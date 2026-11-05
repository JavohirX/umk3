"""
Immortal Combat - What the admin panel shows, worked out from the fight log

Decisions get made from these numbers, so the rules are strict:
  - Each number carries where it comes from, how it is worked out, and how many fights or phones stand behind it. The
    definition sits next to the calculation here, not in the page, so the two can't drift apart.
  - Rates are sums over sums (never averages of averages), so a short report weighs less than a long one.
  - A fight is a match whose fight actually started (fight_started_at). A match can finish without one: a player who
    drops out during hero select forfeits, and that isn't a fight anyone played.
  - Fight time leaves out time the bout stood frozen with a player gone or away. Freezes only count inside a live
    round; loading screens and the knockout animation are reported apart.
  - A running fight isn't counted as finished or unfinished. It joins the rates once it ends.

Everything here only reads. Tabs build a page as data ({sections: [{title, blocks}]}) that admin_panel.html renders.
"""

import json
import sqlite3
import time
from collections import Counter, defaultdict
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Iterable, List, Optional, Tuple

from server.db import HERO_NAMES

TICK_MS = 1000 / 60
TICKS_PER_SECOND = 60
GOAL_DELAY_MS = 100              # the felt lag goal for online fights
GOAL_DELAY_TICKS = 6             # the most input delay that still meets it: 6 x 16.7ms = 100ms
MIN_COVERAGE = 0.5               # a fight needs this much of its time reported by a phone to judge it by that phone
STALE_FIGHT_SECONDS = 2 * 3600   # past the housekeeping limit (STALE_ACTIVE_SECONDS) with room to spare
FREEZE_CLOCK_SLACK = 0.3         # phone events are placed on the server's clock to within about a network trip
FREEZE_FREE_WARN = 0.6           # at or below this share of fights without a freeze, Overview asks for a look. A starting point: tune it from real fights
DELAY_SCALE_MS = 250             # the most input delay the netcode allows: 15 ticks
SMALL_DELAY_SHARE = 0.005        # delays with less of the round time than this are grouped with their neighbours, so the ones that matter stand out
FIGHTS_TO_LOOK_AT = 5

SERVER = "server"    # measured by the server itself: can't be lost or misreported by a phone
PHONES = "phones"    # reported by phones: lost if a phone dies before reporting
BOTH = "both"

PLAYED_OUT = ("KNOCKOUT", "DRAW")
OUTCOME_LABELS = {"played": "Played to the end", "forfeit": "Forfeited", "abandoned": "Abandoned", "running": "Running"}

# Fatal to a claim about a whole population with few samples; the panel marks anything below this
LOW_SAMPLE = 30


# =========================================================================
# PAGE BUILDING BLOCKS
# =========================================================================

def kpi(label: str, value: Any, unit: str = "count", n: Optional[int] = None, source: str = SERVER, why: str = "",
        note: Optional[str] = None, n_label: str = "fights", viz: Optional[dict] = None, trend: Optional[dict] = None) -> dict:
    """viz is a small picture of the value (meter, range_to); trend is its day by day shape (day_trend). Most numbers need neither."""
    return {"type": "kpi", "label": label, "value": value, "unit": unit, "n": n, "n_label": n_label, "source": source,
            "why": why, "note": note, "viz": viz, "trend": trend}


def kpis(*items: dict, strip: bool = False, columns: Optional[int] = None) -> dict:
    """strip: one card holding them all, for numbers that are context rather than the point of the page."""
    return {"type": "kpis", "items": list(items), "strip": strip, "columns": columns}


def tile(label: str, value: Any, unit: str, tone: Optional[str], verdict: Optional[str], detail: str, tab: str, why: str, source: str = SERVER,
         n: Optional[int] = None, n_label: str = "fights", viz: Optional[dict] = None, caption: Optional[str] = None, trend: Optional[dict] = None) -> dict:
    """
    A number with a verdict on it and the page to open about it. tone is ok, warn or fail; None when there is nothing to judge yet.
    With a viz, the picture and the short caption stand in for the detail, which stays one click away.
    """
    return {"type": "tile", "label": label, "value": value, "unit": unit, "tone": tone, "verdict": verdict, "detail": detail, "tab": tab, "why": why,
            "source": source, "n": n, "n_label": n_label, "viz": viz, "caption": caption, "trend": trend}


def side_by_side(*blocks: dict) -> dict:
    """Blocks side by side, where the screen has room."""
    return {"type": "side_by_side", "blocks": [b for b in blocks if b]}


def chart(title: str, kind: str, x: List[Any], series: List[dict], unit: str = "count", source: str = SERVER, why: str = "",
          x_kind: str = "category", compact: bool = False, headlines: Optional[List[dict]] = None) -> dict:
    """headlines: the numbers that belong to this chart, shown on it instead of on cards of their own."""
    return {"type": "chart", "kind": kind, "title": title, "x": x, "series": series, "unit": unit, "source": source,
            "why": why, "x_kind": x_kind, "compact": compact, "headlines": headlines or []}


def table(title: str, columns: List[tuple], rows: List[dict], source: str = SERVER, why: str = "",
          empty: str = "Nothing here yet.", view: Optional[dict] = None, headlines: Optional[List[dict]] = None,
          heat_from: Optional[dict] = None) -> dict:
    """
    Columns are (key, label, unit), with an optional fourth: "bar", "heat" or "flag" to draw that column's values in the cell.
    view: the same rows drawn as a chart (bars_view and friends). The rows stay the source, and one click shows them as a table.
    heat_from: {min, label}: a heat cell whose row's "<key>_n" is under min gets no colour, because a share of too few people isn't a finding.
    """
    return {"type": "table", "title": title, "columns": [{"key": c[0], "label": c[1], "unit": c[2], "viz": c[3] if len(c) > 3 else None} for c in columns],
            "rows": rows, "source": source, "why": why, "empty": empty, "view": view, "headlines": headlines or [], "heat_from": heat_from}


def section(title: str, *blocks: dict, note: Optional[str] = None) -> dict:
    return {"title": title, "note": note, "blocks": [b for b in blocks if b]}


def meter(mark: Optional[float] = None, scale: float = 1) -> dict:
    """The value as a share of scale. mark is a line across it, such as a threshold."""
    return {"kind": "meter", "mark": mark, "scale": scale}


def range_to(to: Optional[float], label: str = "Slowest 5%") -> Optional[dict]:
    """A typical value and how far the bad end reaches, as one bar in place of two numbers."""
    return {"kind": "range", "to": to, "label": label} if to is not None else None


def day_trend(axis: List[str], values: List[Optional[float]]) -> dict:
    return {"x": axis, "values": values, "x_kind": "day"}


def bars_view(label: str, value: str, share: bool = False, divider: Optional[dict] = None) -> dict:
    """Rows as labelled bars. share also prints each row's part of the total. divider: {before: row index, text}."""
    return {"kind": "bars", "label": label, "value": value, "share": share, "divider": divider}


# =========================================================================
# MATHS
# =========================================================================

def percentile(values: Iterable[float], q: float) -> Optional[float]:
    """Linear interpolation between the two nearest values; None with no data."""
    data = sorted(v for v in values if v is not None)
    if not data:
        return None
    position = (len(data) - 1) * q
    low = int(position)
    high = min(low + 1, len(data) - 1)
    return data[low] + (data[high] - data[low]) * (position - low)


def ratio(top: Optional[float], bottom: Optional[float]) -> Optional[float]:
    return top / bottom if bottom and top is not None else None


def wilson(wins: int, games: int, z: float = 1.96) -> Tuple[Optional[float], Optional[float]]:
    """95% confidence interval for a win rate. It stays honest with few games, where a plain percentage doesn't."""
    if not games:
        return None, None
    p = wins / games
    d = 1 + z * z / games
    centre = (p + z * z / (2 * games)) / d
    margin = z * ((p * (1 - p) / games + z * z / (4 * games * games)) ** 0.5) / d
    return max(0.0, centre - margin), min(1.0, centre + margin)


def counted(n: int, one: str, many: Optional[str] = None) -> str:
    return f"{n:,} {one if n == 1 else many or one + 's'}"


def times(n: int) -> str:
    return {1: "once", 2: "twice"}.get(n, f"{n:,} times")


def ms_text(ms: float) -> str:
    """A time written as the page writes it, for verdicts and sentences worked out here."""
    return "0ms" if ms == 0 else f"{ms / 1000:.1f}s" if ms >= 10000 else f"{ms:.1f}ms" if ms < 10 else f"{round(ms):,}ms"


def secs_text(secs: float) -> str:
    if secs == 0:
        return "0s"
    if secs < 10:
        return f"{secs:.1f}s"
    whole = round(secs)
    if whole < 90:
        return f"{whole}s"
    if whole < 3600:
        return f"{whole // 60}m {whole % 60}s"
    minutes = round(whole / 60)
    return f"{minutes // 60}h {minutes % 60}m"


def data_of(raw: Optional[str]) -> dict:
    try:
        return json.loads(raw) if raw else {}
    except ValueError:
        return {}


def hist_of(raw: Optional[str], length: int) -> List[int]:
    try:
        counts = json.loads(raw) if raw else None
    except ValueError:
        counts = None
    return counts if isinstance(counts, list) and len(counts) == length else [0] * length


# =========================================================================
# THE SLICE OF DATA A PAGE LOOKS AT
# =========================================================================

class Scope:
    """A time range, and whether the admin's own fights count. Their test fights would skew a small beta."""

    def __init__(self, days: int = 7, include_admin: bool = False, admin_id: Optional[str] = None, tz_minutes: int = 0,
                 now: Optional[float] = None):
        self.now = time.time() if now is None else now
        self.days = days
        self.since = self.now - days * 86400 if days else 0.0
        self.until = self.now
        self.admin_id = str(admin_id) if admin_id else None
        self.include_admin = include_admin or not self.admin_id
        self.tz_minutes = tz_minutes

    def not_admin(self, *columns: str) -> Tuple[str, list]:
        if self.include_admin:
            return "1", []
        return " AND ".join(f"COALESCE({c}, '') <> ?" for c in columns), [self.admin_id] * len(columns)

    def fights_cte(self) -> Tuple[str, list]:
        """WITH f: the fights in range, in the matches table's own shape."""
        clause, params = self.not_admin("p1_id", "p2_id")
        return (f"WITH f AS (SELECT * FROM matches WHERE fight_started_at IS NOT NULL AND fight_started_at >= ? "
                f"AND fight_started_at <= ? AND {clause})", [self.since, self.until, *params])

    def day(self, ts: float) -> str:
        """The day a moment falls on in the viewer's time zone."""
        return (datetime.fromtimestamp(ts, timezone.utc) + timedelta(minutes=self.tz_minutes)).strftime("%Y-%m-%d")

    def day_axis(self, first_ts: Optional[float]) -> List[str]:
        """Every day from the start of the range (or the first data, for all time) to today, with no gaps."""
        start = self.since if self.since else first_ts
        if not start:
            return []
        day = datetime.strptime(self.day(start), "%Y-%m-%d")
        last = datetime.strptime(self.day(self.until), "%Y-%m-%d")
        axis = []
        while day <= last:
            axis.append(day.strftime("%Y-%m-%d"))
            day += timedelta(days=1)
        return axis


def outcome_of(fight: dict) -> str:
    if fight["status"] == "ACTIVE":
        return "running"
    if fight["finish_reason"] in PLAYED_OUT:
        return "played"
    if fight["finish_reason"] == "AUTOWIN_DISCONNECT":
        return "forfeit"
    return "abandoned"  # both gone (BOTH_DISCONNECTED) or never closed until housekeeping found it (STALE)


def load_fights(conn: sqlite3.Connection, scope: Scope) -> List[dict]:
    cte, params = scope.fights_cte()
    fights = []
    for row in conn.execute(f"{cte} SELECT * FROM f ORDER BY fight_started_at", params):
        fight = dict(row)
        fight.pop("room_state", None)
        fight["outcome"] = outcome_of(fight)
        end = fight["ended_at"] if fight["outcome"] != "running" else None
        fight["active_secs"] = max(0.0, end - fight["fight_started_at"] - (fight["paused_secs"] or 0)) if end else None
        fights.append(fight)
    return fights


SUMMED = ("active_secs", "live_secs", "ticks", "live_ticks", "setup_ms", "frames", "frame_ms_sum", "slow_frames", "live_frames",
          "live_slow_frames", "tick_ms_sum", "work_ms_sum", "stalls", "stall_ms", "live_stalls", "live_stall_ms",
          "load_wait_ms", "stall_freezes_live", "hitch_freezes_live", "freeze_live_ms", "freezes_other", "rollbacks",
          "rollback_ticks", "rollback_misses", "predict_sum", "saves", "save_ms_sum", "loads", "load_ms_sum", "resim_ms_sum",
          "inputs_udp", "inputs_tcp", "late_inputs", "lead_sum", "loop_errors")
MAXED = ("max_frame_ms", "max_work_ms", "max_stall_ms", "max_rollback")
ROLLUP_COLUMNS = ", ".join([f"COALESCE(SUM(w.{c}), 0) AS {c}" for c in SUMMED] + [f"COALESCE(MAX(w.{c}), 0) AS {c}" for c in MAXED]
                           + ["COUNT(*) AS windows", "COUNT(DISTINCT w.match_id || ':' || w.role) AS fight_sides"])


def load_sides(conn: sqlite3.Connection, scope: Scope) -> Dict[Tuple[str, str], dict]:
    """Per fight and phone, what its reports add up to."""
    cte, params = scope.fights_cte()
    sides: Dict[Tuple[str, str], dict] = {}
    rows = conn.execute(f"""{cte} SELECT w.match_id, w.role, MAX(w.player_id) AS player_id, MAX(w.platform) AS platform,
                                         MAX(w.model) AS model, MAX(w.os) AS os, {ROLLUP_COLUMNS}
                            FROM net_windows w JOIN f ON f.match_id = w.match_id GROUP BY w.match_id, w.role""", params)
    for row in rows:
        side = dict(row)
        side["delay_hist"] = [0] * 16
        sides[(row["match_id"], row["role"])] = side
    for row in conn.execute(f"""{cte} SELECT w.match_id, w.role, w.live_delay_hist FROM net_windows w
                                JOIN f ON f.match_id = w.match_id WHERE w.live_delay_hist IS NOT NULL""", params):
        side = sides[(row["match_id"], row["role"])]
        for i, count in enumerate(hist_of(row["live_delay_hist"], 16)):
            side["delay_hist"][i] += count
    return sides


def mean_delay_ticks(hist: List[int]) -> Optional[float]:
    return ratio(sum(i * c for i, c in enumerate(hist)), sum(hist))


def delay_ms(hist: List[int]) -> Optional[float]:
    ticks = mean_delay_ticks(hist)
    return ticks * TICK_MS if ticks is not None else None


def delay_verdict(delay: Optional[float]) -> Tuple[Optional[str], Optional[str]]:
    if delay is None:
        return None, None
    return ("ok", "Within goal") if delay <= GOAL_DELAY_MS else ("warn", "Over goal")


def phone_delays(sides: Iterable[dict]) -> List[float]:
    """Each phone's average delay in each fight."""
    return [d for d in (delay_ms(s["delay_hist"]) for s in sides) if d is not None]


def sides_by_day(scope: Scope, fights: List[dict], sides: Dict[Tuple[str, str], dict]) -> Dict[str, List[dict]]:
    """Each phone's reports in each fight, filed under the day the fight started."""
    days: Dict[str, List[dict]] = defaultdict(list)
    for fight in fights:
        for role in ("p1", "p2"):
            if (fight["match_id"], role) in sides:
                days[scope.day(fight["fight_started_at"])].append(sides[(fight["match_id"], role)])
    return days


def combine(rows: Iterable[dict]) -> dict:
    total = {c: 0 for c in SUMMED}
    total.update({c: 0 for c in MAXED})
    total["delay_hist"] = [0] * 16
    for row in rows:
        for c in SUMMED:
            total[c] += row[c] or 0
        for c in MAXED:
            total[c] = max(total[c], row[c] or 0)
        for i, count in enumerate(row.get("delay_hist") or []):
            total["delay_hist"][i] += count
    return total


def freezes_in_round(side: dict) -> int:
    return (side["stall_freezes_live"] or 0) + (side["hitch_freezes_live"] or 0)


def fight_coverage(fight: dict, sides: Dict[Tuple[str, str], dict]) -> Dict[str, Optional[float]]:
    """How much of a finished fight each phone's reports cover."""
    return {role: ratio((sides.get((fight["match_id"], role)) or {}).get("active_secs", 0), fight["active_secs"])
            for role in ("p1", "p2")}


def judged_fights(fights: List[dict], sides: Dict[Tuple[str, str], dict]) -> List[dict]:
    """Finished fights with enough of both phones' reports to judge how they ran. Short fights with no time at all are out."""
    judged = []
    for fight in fights:
        if fight["outcome"] != "running" and fight["active_secs"]:
            coverage = fight_coverage(fight, sides)
            if all((c or 0) >= MIN_COVERAGE for c in coverage.values()):
                judged.append(fight)
    return judged


def events_by_fight(conn: sqlite3.Connection, scope: Scope, kinds: Tuple[str, ...]) -> Dict[str, List[dict]]:
    cte, params = scope.fights_cte()
    events: Dict[str, List[dict]] = defaultdict(list)
    for e in conn.execute(f"""{cte} SELECT e.match_id, e.at, e.kind, e.player_id, e.role, e.segment, e.data FROM match_events e
                              JOIN f ON f.match_id = e.match_id WHERE e.kind IN ({", ".join("?" * len(kinds))}) ORDER BY e.at""", [*params, *kinds]):
        events[e["match_id"]].append(dict(e))
    return events


def fight_counts(conn: sqlite3.Connection, scope: Scope) -> Dict[str, Counter]:
    """Per fight, what the event log alone can say: distinct desyncs, score conflicts, connections lost mid fight."""
    cte, params = scope.fights_cte()
    counts: Dict[str, Counter] = defaultdict(Counter)
    seen_desyncs = set()
    for r in conn.execute(f"{cte} SELECT e.match_id, e.kind, e.segment, e.data FROM match_events e JOIN f ON f.match_id = e.match_id WHERE e.kind IN ('player_disconnected', 'desync', 'score_conflict')", params):
        if r["kind"] == "desync":
            key = (r["match_id"], r["segment"], r["data"])
            if key not in seen_desyncs:
                seen_desyncs.add(key)
                counts[r["match_id"]]["desyncs"] += 1
        elif r["kind"] == "score_conflict":
            counts[r["match_id"]]["conflicts"] += 1
        elif data_of(r["data"]).get("in_fight"):
            counts[r["match_id"]]["drops"] += 1
    return counts


def desync_counts(conn: sqlite3.Connection, scope: Scope) -> Tuple[int, int]:
    """(distinct desyncs, fights with one). Both phones report the same one, so it counts once per segment and tick."""
    cte, params = scope.fights_cte()
    rows = conn.execute(f"{cte} SELECT DISTINCT e.match_id, e.segment, e.data FROM match_events e JOIN f ON f.match_id = e.match_id WHERE e.kind = 'desync'", params).fetchall()
    return len(rows), len({r["match_id"] for r in rows})


def fault_counts(conn: sqlite3.Connection, scope: Scope, total: dict) -> dict:
    """The things that should never happen, added up the same way wherever they are shown."""
    cte, params = scope.fights_cte()
    desyncs, desync_fights = desync_counts(conn, scope)
    conflicts = conn.execute(f"{cte} SELECT COUNT(*) FROM match_events e JOIN f ON f.match_id = e.match_id WHERE e.kind = 'score_conflict'", params).fetchone()[0]
    counts = {"desyncs": desyncs, "desync_fights": desync_fights, "rollback_misses": total["rollback_misses"], "score_conflicts": conflicts, "loop_errors": total["loop_errors"]}
    counts["total"] = desyncs + total["rollback_misses"] + conflicts + total["loop_errors"]
    return counts


def fault_words(faults: dict) -> List[str]:
    return [counted(faults["desyncs"], "desync"), counted(faults["rollback_misses"], "rollback miss", "rollback misses"),
            counted(faults["score_conflicts"], "score conflict"), counted(faults["loop_errors"], "game loop error")]


# =========================================================================
# OVERVIEW
# =========================================================================

def freeze_tile(scope: Scope, axis: List[str], fights: List[dict], judged: List[dict], sides: Dict[Tuple[str, str], dict], longest_stall: float) -> dict:
    clean = [f for f in judged if not any(freezes_in_round(sides[(f["match_id"], r)]) for r in ("p1", "p2"))]
    share = ratio(len(clean), len(judged))
    why = (f"Finished fights where neither phone saw the round stop for 250ms or more, out of those where both phones reported at least half the fight. "
           f"Asks for a look at {FREEZE_FREE_WARN:.0%} or below, the line across the bar.")
    if share is None:
        return tile("Fights without a freeze", None, "pct", None, None, "No finished fight has enough phone reports to judge yet.", "reliability", why, PHONES, 0)
    frozen = len(judged) - len(clean)
    detail = f"{frozen} of {len(judged)} fights froze. Longest stall: {ms_text(longest_stall)}."
    unjudged = len([f for f in fights if f["outcome"] != "running"]) - len(judged)
    if unjudged:
        detail += f" {unjudged:,} more had too few reports to judge."
    tone, verdict = ("warn", "Needs a look") if share <= FREEZE_FREE_WARN else ("ok", f"Above {FREEZE_FREE_WARN:.0%}")
    judged_on, clean_on = Counter(scope.day(f["fight_started_at"]) for f in judged), Counter(scope.day(f["fight_started_at"]) for f in clean)
    return tile("Fights without a freeze", share, "pct", tone, verdict, detail, "reliability", why, PHONES, len(judged), viz=meter(mark=FREEZE_FREE_WARN),
                caption=f"{frozen:,} of {len(judged):,} froze, longest stall {ms_text(longest_stall)}", trend=day_trend(axis, [ratio(clean_on[d], judged_on[d]) for d in axis]))


def faults_tile(faults: dict, any_reports: bool) -> dict:
    why = "Desyncs, rollback misses, score conflicts and game loop errors added up. Each one means something is broken, so one is enough to look into."
    if not any_reports:
        return tile("Faults that should never happen", None, "count", None, None, "Phones haven't reported from this range yet, and most faults are theirs to report.", "netcode", why, BOTH)
    viz = {"kind": "counts", "items": [{"label": "Desyncs", "value": faults["desyncs"]}, {"label": "Misses", "value": faults["rollback_misses"]},
                                       {"label": "Conflicts", "value": faults["score_conflicts"]}, {"label": "Errors", "value": faults["loop_errors"]}]}
    if not faults["total"]:
        return tile("Faults that should never happen", 0, "count", "ok", "None", "No desyncs, rollback misses, score conflicts or game loop errors.", "netcode", why, BOTH, viz=viz)
    words = [w for w in fault_words(faults) if not w.startswith("0 ")]
    return tile("Faults that should never happen", faults["total"], "count", "fail", "Investigate", f"{', '.join(words)}.", "netcode", why, BOTH, viz=viz)


def quality_tile(conn: sqlite3.Connection, scope: Scope) -> dict:
    why = "Facts that must be true if the data is right, most comparing records written independently. These always cover all time."
    if conn.execute("SELECT 1 FROM matches LIMIT 1").fetchone() is None:
        return tile("Data quality", None, "text", None, None, "No matches yet to check.", "quality", why, BOTH)
    checks = data_quality_checks(conn, scope)
    status = Counter(c["status"] for c in checks)
    tone, verdict = (("fail", f"{status['fail']} failed") if status["fail"] else ("warn", counted(status["warn"], "warning")) if status["warn"] else ("ok", "All passed"))
    # The verdict names the worst kind, so anything else short of passing is said here for the numbers to add up
    also = f" Also {counted(status['warn'], 'warning')}." if status["fail"] and status["warn"] else ""
    worst_first = sorted((c["status"] for c in checks), key=("fail", "warn", "ok").index)
    return tile("Data quality", f"{status['ok']} of {len(checks)}", "text", tone, verdict, f"Consistency checks across the whole log.{also}", "quality", why, BOTH,
                viz={"kind": "cells", "statuses": worst_first}, caption=also.strip() or None)


def problem_words(summary: dict, worst_freeze: Optional[float]) -> str:
    """What went wrong in one fight, worst kind first."""
    words = []
    for key, one, many in (("desyncs", "desync", None), ("conflicts", "score conflict", None), ("misses", "rollback miss", "rollback misses"), ("errors", "game loop error", None)):
        if summary[key]:
            words.append(counted(summary[key], one, many))
    if summary["freezes"]:
        words.append(counted(summary["freezes"], "freeze", "freezes") + (f", worst {ms_text(worst_freeze)}" if worst_freeze else ""))
    if summary["drops"]:
        words.append(counted(summary["drops"], "lost connection"))
    if summary["restarts"]:
        words.append(counted(summary["restarts"], "restart"))
    return ", ".join(words)


DROP_WORDS = {0: "The page closed the connection", 1000: "The page closed the connection", 1001: "The page went away", 1006: "The connection died",
              1011: "A server error closed the connection", None: "A server error closed the connection"}


def likely_cause(summary: dict, events: List[dict]) -> str:
    """The single most useful thing to say about why, from the worst kind of problem in the fight. A pointer, not a verdict."""
    if summary["desyncs"]:
        return "The two phones' simulations differed"
    if summary["conflicts"]:
        return "The phones reported different round scores"
    if summary["errors"]:
        return "An uncaught error in the game loop"
    if summary["misses"]:
        return "A rewind had no saved state to go back to"
    causes = freeze_causes(events)
    if causes:
        device = causes["own_device"] + causes["opponent_device"]
        if device >= causes["opponent_silent"] + causes["own_connection"]:
            return "One phone stopped drawing, and the other waited for it" if causes["opponent_device"] else "A phone stopped drawing"
        return "A phone's inputs stopped reaching the server" if causes["opponent_silent"] >= causes["own_connection"] else "A phone wasn't getting inputs the server already had"
    drops = analyse_drops(events)
    if drops:
        drop = next((d for d in drops if not d["recovered"]), drops[0])
        words = DROP_WORDS.get(drop["close_code"], f"The connection closed with code {drop['close_code']}")
        if not drop["recovered"]:
            return f"{words}, and the player never came back"
        return f"{words}, and the player was back in {secs_text(drop['secs'])}" if drop["secs"] is not None else f"{words}, and the player was already back"
    return ""


def fights_to_look_at(conn: sqlite3.Connection, scope: Scope, fights: List[dict], sides: Dict[Tuple[str, str], dict]) -> dict:
    counts = fight_counts(conn, scope)
    events = events_by_fight(conn, scope, ("player_disconnected", "player_connected", "freeze", "input_gap"))
    rows = []
    for fight in fights:
        summary = fight_summary(fight, sides, counts)
        evs = events.get(fight["match_id"], [])
        lengths = [data_of(e["data"]).get("ms") or 0 for e in evs if e["kind"] == "freeze" and data_of(e["data"]).get("live")]
        wrong = problem_words(summary, max(lengths, default=None))
        if wrong:
            rows.append({"match_id": fight["match_id"], "fight": summary["heroes"], "wrong": wrong, "cause": likely_cause(summary, evs),
                         "secs": summary["secs"], "started": summary["started"], "rank": (summary["faults"], summary["freezes"] or 0, summary["drops"] + summary["restarts"], summary["started"])})
    rows.sort(key=lambda r: r.pop("rank"), reverse=True)
    block = table("Fights to look at", [("fight", "Fight", "text"), ("wrong", "What went wrong", "text"), ("cause", "Likely cause", "text"), ("secs", "Length", "secs"), ("started", "Started", "time")],
                  rows[:FIGHTS_TO_LOOK_AT], BOTH, "Worst first: faults, then freezes, then lost connections and restarts. Likely causes are a guide, good to about 300ms.",
                  empty="No fights in this range yet." if not fights else "No freezes, lost connections, restarts or faults reported in this range.")
    block.update(link="match_id", hide_title=True, prose=True, more={"tab": "fights", "text": f"All {counted(len(fights), 'fight')}"})
    return block


def tab_overview(conn: sqlite3.Connection, scope: Scope) -> List[dict]:
    fights = load_fights(conn, scope)
    sides = load_sides(conn, scope)
    total = combine(sides.values())
    closed = [f for f in fights if f["outcome"] != "running"]
    played = [f for f in fights if f["outcome"] == "played"]
    forfeit = [f for f in fights if f["outcome"] == "forfeit"]
    abandoned = [f for f in fights if f["outcome"] == "abandoned"]
    fighters = {pid for f in fights for pid in (f["p1_id"], f["p2_id"]) if pid}
    lengths = [f["active_secs"] for f in played if f["active_secs"] is not None]
    side_delays = phone_delays(sides.values())
    ids = {f["match_id"] for f in played}
    rematched = {r["rematch_of"] for r in conn.execute("SELECT rematch_of FROM matches WHERE rematch_of IS NOT NULL")} & ids

    axis = scope.day_axis(fights[0]["fight_started_at"] if fights else None)
    per_day = {key: Counter() for key in OUTCOME_LABELS}
    for f in fights:
        per_day[f["outcome"]][scope.day(f["fight_started_at"])] += 1

    delay = delay_ms(total["delay_hist"])
    tone, verdict = delay_verdict(delay)
    slowest = percentile(side_delays, 0.95)
    delay_detail = f"Goal {GOAL_DELAY_MS}ms or less. Slowest 5% of phones: {ms_text(slowest)}." if slowest is not None else "Phones haven't reported a live round in this range yet."
    day_sides = sides_by_day(scope, fights, sides)
    delay_days = [delay_ms(combine(day_sides[d])["delay_hist"]) if d in day_sides else None for d in axis]
    ended = [("Played to the end", played, "Decided by rounds or a draw."), ("Forfeited", forfeit, "A player left or dropped and did not come back within the 60 second grace period."),
             ("Abandoned", abandoned, "Both players gone, or a fight left open until housekeeping closed it.")]

    return [
        section("Right now",
                {"type": "status", "items": [
                    tile("Input delay", delay, "ms", tone, verdict, delay_detail, "netcode",
                         "Average delay between a key press and the fight using it, weighted by time, over all live round ticks. The same number as on the Netcode page. The slowest 5% is the 95th percentile across phones of each phone's average in that fight.",
                         PHONES, len(side_delays), "phones", viz={"kind": "goal", "goal": GOAL_DELAY_MS, "scale": DELAY_SCALE_MS, "slowest": slowest}, trend=day_trend(axis, delay_days)),
                    freeze_tile(scope, axis, fights, judged_fights(fights, sides), sides, total["max_stall_ms"]),
                    faults_tile(fault_counts(conn, scope, total), bool(sides)),
                    quality_tile(conn, scope),
                ]}),
        section("Fights to look at", fights_to_look_at(conn, scope, fights, sides)),
        section("Is the game being played",
                kpis(
                    kpi("Fights started", len(fights), why="Matches where both heroes were locked and the versus screen went to both phones. Matches that ended in hero select are not fights."),
                    kpi("Players who fought", len(fighters), n=len(fights), why="Different Telegram accounts on either side of a fight in this range."),
                    kpi("Fights per player", ratio(len(fights) * 2, len(fighters)), "ratio", n=len(fighters), n_label="players", why="Each fight has two players: fights times two, divided by players who fought."),
                    kpi("Median fight length", percentile(lengths, 0.5), "secs", n=len(lengths), why="Fights played to the end, from the versus screen to the result, less any time the bout stood frozen with a player gone."),
                    strip=True),
                side_by_side(
                    chart("Fights per day", "stack", axis,
                          [{"name": OUTCOME_LABELS[k], "values": [per_day[k][d] for d in axis]} for k in OUTCOME_LABELS],
                          why="By the day the fight started, in your time zone, split by how each one ended. Players per day is on the Players page.", x_kind="day", compact=True),
                    {"type": "parts", "title": "How fights ended", "n": len(closed), "source": SERVER,
                     "items": [{"label": label, "count": len(group), "value": ratio(len(group), len(closed)), "unit": "pct", "n": len(closed)} for label, group, _ in ended],
                     "rematch": {"label": "Agreed a rematch", "value": ratio(len(rematched), len(played)), "count": len(rematched), "n": len(played)},
                     "why": "Finished fights only, so running fights are left out. " + " ".join(f"{label}: {what}" for label, _, what in ended) + " A rematch is both players asking for one after a fight played to the end."})),
    ]


# =========================================================================
# FUNNEL
# =========================================================================

def source_of_challenge(chat_id: Optional[str]) -> str:
    chat = str(chat_id or "")
    if chat == "inline":
        return "Inline mode"
    if chat.startswith("-"):
        return "Group chat"
    if chat.lstrip("-").isdigit() and chat != "0":
        return "Private chat with the bot"
    return "Other"


def tab_funnel(conn: sqlite3.Connection, scope: Scope) -> List[dict]:
    clause, params = scope.not_admin("creator_id", "opponent_id")
    rows = [dict(r) for r in conn.execute(
        f"""SELECT match_id, chat_id, status, finish_reason, created_at, started_at, fight_started_at, ended_at, rematch_of
            FROM matches WHERE created_at >= ? AND created_at <= ? AND {clause}""", [scope.since, scope.until, *params])]
    claimed = {r["match_id"] for r in conn.execute("SELECT DISTINCT match_id FROM match_events WHERE kind = 'seat_claimed'")}
    rematch_parents = {r["rematch_of"] for r in conn.execute("SELECT rematch_of FROM matches WHERE rematch_of IS NOT NULL")}

    challenges = [m for m in rows if not m["rematch_of"]]

    def steps(matches: List[dict]) -> List[int]:
        accepted = [m for m in matches if m["match_id"] in claimed or m["started_at"]]
        both_in = [m for m in matches if m["started_at"]]
        fought = [m for m in matches if m["fight_started_at"]]
        finished = [m for m in fought if m["finish_reason"] in PLAYED_OUT]
        rematched = [m for m in finished if m["match_id"] in rematch_parents]
        return [len(matches), len(accepted), len(both_in), len(fought), len(finished), len(rematched)]

    labels = ["Challenge created", "Someone accepted", "Both players in", "Fight started", "Played to the end", "Rematch agreed"]
    counts = steps(challenges)
    funnel_rows = []
    for i, (label, count) in enumerate(zip(labels, counts)):
        funnel_rows.append({"step": label, "count": count, "of_first": ratio(count, counts[0]),
                            "of_previous": ratio(count, counts[i - 1]) if i else None})

    by_source = defaultdict(list)
    for m in challenges:
        by_source[source_of_challenge(m["chat_id"])].append(m)
    source_rows = []
    for name, matches in sorted(by_source.items(), key=lambda kv: -len(kv[1])):
        s = steps(matches)
        source_rows.append({"source": name, "created": s[0], "fought": s[3], "played": s[4], "to_fight": ratio(s[3], s[0]),
                            "to_end": ratio(s[4], s[0])})

    rematches = [m for m in rows if m["rematch_of"]]
    still_open = sum(1 for m in challenges if m["status"] == "WAITING")
    expired = sum(1 for m in challenges if m["status"] == "CANCELLED")
    forfeit_in_select = sum(1 for m in challenges if m["started_at"] and not m["fight_started_at"] and m["status"] != "ACTIVE")

    first_claim = {}
    for r in conn.execute("SELECT match_id, MIN(at) AS at FROM match_events WHERE kind = 'seat_claimed' GROUP BY match_id"):
        first_claim[r["match_id"]] = r["at"]
    time_to_accept = [first_claim[m["match_id"]] - m["created_at"] for m in challenges if m["match_id"] in first_claim]
    time_both_in = [m["started_at"] - m["created_at"] for m in challenges if m["started_at"]]
    time_in_select = [m["fight_started_at"] - m["started_at"] for m in rows if m["fight_started_at"] and m["started_at"]]

    # People who started the bot, and how far they got. Only people first seen in this range, so the ratio has a fixed base.
    starters = {r["player_id"] for r in conn.execute(
        "SELECT DISTINCT player_id FROM match_events WHERE kind = 'bot_start' AND at >= ? AND at <= ? AND player_id IS NOT NULL",
        (scope.since, scope.until))}
    if not scope.include_admin:
        starters.discard(scope.admin_id)
    opened = {r["player_id"] for r in conn.execute("SELECT player_id FROM players")}
    fought_ids = set()
    for r in conn.execute("SELECT p1_id, p2_id FROM matches WHERE fight_started_at IS NOT NULL"):
        fought_ids.update((r["p1_id"], r["p2_id"]))

    rejected = Counter()
    for r in conn.execute("SELECT kind, data FROM match_events WHERE kind IN ('join_rejected', 'auth_failed') AND at >= ? AND at <= ?",
                          (scope.since, scope.until)):
        rejected["Could not verify Telegram identity" if r["kind"] == "auth_failed"
                 else {"NOT_FOUND": "Challenge does not exist", "CANCELLED": "Challenge expired", "ABANDONED": "Match already abandoned"}
                 .get(data_of(r["data"]).get("reason"), "Other")] += 1

    return [
        section("From a challenge to a fight",
                table("Challenges at each step", [("step", "Step", "text"), ("count", "Challenges", "count"), ("of_first", "Of all created", "pct"),
                                                  ("of_previous", "Of the step before", "pct")], funnel_rows,
                      why="One group followed through: every challenge created in this range, excluding rematches. Each step counts those that reached it, however long it took, so a challenge created minutes ago may simply not have got there yet. The biggest loss between two steps is marked. A rematch is a choice rather than a step everyone should reach, so it's shown as a share and not as a loss.",
                      view={"kind": "funnel", "label": "step", "value": "count", "optional": ["Rematch agreed"]}),
                kpis(
                    kpi("Still open", still_open, why="Created in this range and waiting for an opponent right now."),
                    kpi("Expired unanswered", expired, why="Nobody accepted within the 10 minute window, or the creator never came back to an accepted one."),
                    kpi("Lost in hero select", forfeit_in_select, why="Both players connected, but a fight never started: someone left before both heroes were locked. These can show as forfeits on the leaderboard; they are not fights."),
                    kpi("Rematch matches", len(rematches), why="Matches opened by both players agreeing a rematch. Kept apart from the steps above so they don't inflate how many challenges convert."),
                    strip=True)),
        section("How long each step takes",
                kpis(
                    kpi("Time until someone accepts", percentile(time_to_accept, 0.5), "secs", n=len(time_to_accept), n_label="challenges", why="Median, from the challenge being created to the first other person opening it."),
                    kpi("Time until both are in", percentile(time_both_in, 0.5), "secs", n=len(time_both_in), n_label="challenges", why="Median, from the challenge being created to both players being connected."),
                    kpi("Time in hero select", percentile(time_in_select, 0.5), "secs", n=len(time_in_select), why="Median, from both players being connected to both heroes locked. Includes rematches."),
                    strip=True)),
        section("Where challenges come from",
                table("By where the challenge was created", [("source", "Source", "text"), ("created", "Created", "count"), ("fought", "Fights", "count"),
                                                             ("played", "Played to the end", "count"), ("to_fight", "Fights, of created", "pct", "bar"),
                                                             ("to_end", "Played to the end, of created", "pct", "bar")], source_rows,
                      why="From the chat id on the match. Excludes rematches.")),
        section("Before the first challenge",
                side_by_side(
                    kpis(
                        kpi("Started the bot", len(starters), n_label="people", why="Different people who sent /start in this range."),
                        kpi("Then opened a match", ratio(len(starters & opened), len(starters)), "pct", n=len(starters), n_label="people", why="Of those who started the bot: connected to a match at any time, as a player.", viz=meter()),
                        kpi("Then fought", ratio(len(starters & fought_ids), len(starters)), "pct", n=len(starters), n_label="people", why="Of those who started the bot: were on one side of a fight at any time. Counted over everyone, whether or not your own fights are hidden.", viz=meter()),
                        strip=True),
                    table("Joins the server turned away", [("reason", "Reason", "text"), ("count", "Times", "count")],
                          [{"reason": k, "count": v} for k, v in rejected.most_common()],
                          why="Someone opened a link and got nothing to play. Your own fights can't be filtered out of this one.",
                          empty="Nobody has been turned away.", view=bars_view("reason", "count")))),
    ]


# =========================================================================
# NETCODE
# =========================================================================

def transport_name(p2p: Any, ice_path: Optional[str]) -> str:
    """The same names as transport_case, for one report."""
    if not p2p:
        return "WebSocket only"
    if ice_path and "relay" in ice_path:
        return "UDP through the TURN relay"
    return "UDP direct between phones" if ice_path and ice_path != "none" else "UDP, path not reported"


def transport_case() -> str:
    return """CASE WHEN w.p2p = 1 AND w.ice_path LIKE '%relay%' THEN 'UDP through the TURN relay'
                   WHEN w.p2p = 1 AND w.ice_path IS NOT NULL AND w.ice_path <> 'none' THEN 'UDP direct between phones'
                   WHEN w.p2p = 1 THEN 'UDP, path not reported'
                   ELSE 'WebSocket only' END"""


def quality_row(total: dict) -> dict:
    """The per group numbers shared by the netcode tables. Every rate is sums over sums."""
    live_minutes = (total["live_secs"] or 0) / 60
    return {
        "delay_ms": (lambda d: d * TICK_MS if d is not None else None)(mean_delay_ticks(total["delay_hist"])),
        "rollbacks_per_min": ratio(total["rollbacks"], (total["active_secs"] or 0) / 60),
        "stall_share": ratio(total["live_stall_ms"], (total["live_secs"] or 0) * 1000),
        "freezes_per_10": ratio(freezes_in_round(total), live_minutes / 10),
        "live_minutes": live_minutes,
    }


QUALITY_COLUMNS = [("live_minutes", "Minutes in round", "number"), ("delay_ms", "Input delay", "ms", "bar"),
                   ("rollbacks_per_min", "Rollbacks a minute", "number"), ("stall_share", "Time stalled", "pct"),
                   ("freezes_per_10", "Freezes per 10 min", "number", "bar")]
STALL_BUCKETS = ["Under 50ms", "50 to 100ms", "100 to 250ms", "250ms to 1s", "1s and over"]
STALL_BUCKETS_BELOW_A_FREEZE = 3


def delay_share_rows(hist: List[int]) -> List[dict]:
    """
    The share of live round time at each input delay, split at the goal. Neighbouring delays that each hold almost no time
    are grouped, on the same side of the goal only: the two delays that matter shouldn't be lost among twelve empty ones.
    """
    total = sum(hist)
    groups: List[dict] = []
    for ticks in range(2, 16):
        count = hist[ticks]
        small = not total or count / total < SMALL_DELAY_SHARE
        over = ticks > GOAL_DELAY_TICKS
        last = groups[-1] if groups else None
        if last and small and last["small"] and last["over_goal"] == over:
            last["buckets"].append((ticks, count))
        else:
            groups.append({"small": small, "over_goal": over, "buckets": [(ticks, count)]})
    rows = []
    for group in groups:
        filled = [t for t, c in group["buckets"] if c]
        if filled:
            first, final = filled[0] * TICK_MS, filled[-1] * TICK_MS
            count = sum(c for _, c in group["buckets"])
            rows.append({"label": f"{first:.0f}ms" if len(filled) == 1 else f"{first:.0f} to {final:.0f}ms", "ticks": count, "value": count / total, "over_goal": group["over_goal"]})
    return rows


def tab_netcode(conn: sqlite3.Connection, scope: Scope) -> List[dict]:
    fights = load_fights(conn, scope)
    sides = load_sides(conn, scope)
    all_sides = list(sides.values())
    total = combine(all_sides)
    cte, params = scope.fights_cte()

    hist = total["delay_hist"]
    side_delays = phone_delays(all_sides)
    live_ticks = sum(hist)
    within_goal = sum(hist[:GOAL_DELAY_TICKS + 1])
    with_ticks = [s for s in all_sides if s["live_secs"]]

    windows = [dict(r) for r in conn.execute(
        f"{cte} SELECT w.peer_rtt, w.server_rtt FROM net_windows w JOIN f ON f.match_id = w.match_id", params)]
    peer = [w["peer_rtt"] for w in windows if w["peer_rtt"] is not None]
    server_rtt = [w["server_rtt"] for w in windows if w["server_rtt"]]

    faults = fault_counts(conn, scope, total)
    causes = Counter()
    for evs in events_by_fight(conn, scope, ("freeze", "input_gap")).values():
        causes += freeze_causes(evs)

    # Stall lengths in round, added across reports
    stall_hist = [0] * 5
    for row in conn.execute(f"{cte} SELECT w.live_stall_hist FROM net_windows w JOIN f ON f.match_id = w.match_id WHERE w.live_stall_hist IS NOT NULL", params):
        for i, count in enumerate(hist_of(row["live_stall_hist"], 5)):
            stall_hist[i] += count

    # By the way inputs travelled
    transports = []
    grouped: Dict[str, List[dict]] = defaultdict(list)
    for row in conn.execute(f"""{cte} SELECT {transport_case()} AS transport, w.live_delay_hist, {", ".join(f"w.{c} AS {c}" for c in SUMMED + MAXED)}
                                FROM net_windows w JOIN f ON f.match_id = w.match_id""", params):
        entry = dict(row)
        entry["delay_hist"] = hist_of(row["live_delay_hist"], 16)
        grouped[row["transport"]].append(entry)
    all_time = sum(e["active_secs"] or 0 for rows in grouped.values() for e in rows)
    for name, rows in sorted(grouped.items(), key=lambda kv: -sum(e["active_secs"] or 0 for e in kv[1])):
        combined = combine(rows)
        transports.append({"transport": name, "share": ratio(combined["active_secs"], all_time), **quality_row(combined)})

    # By build, so a deploy can be judged against the last one
    fights_by_build: Dict[str, List[dict]] = defaultdict(list)
    for f in fights:
        fights_by_build[f["build"] or "unknown"].append(f)
    build_rows = []
    for build, group in sorted(fights_by_build.items(), key=lambda kv: -max(f["fight_started_at"] for f in kv[1])):
        combined = combine(sides[(f["match_id"], r)] for f in group for r in ("p1", "p2") if (f["match_id"], r) in sides)
        build_rows.append({"build": build, "fights": len(group), "first": min(f["fight_started_at"] for f in group), **quality_row(combined)})

    # Day by day
    axis = scope.day_axis(fights[0]["fight_started_at"] if fights else None)
    day_sides = sides_by_day(scope, fights, sides)
    daily = {d: quality_row(combine(day_sides[d])) if d in day_sides else None for d in axis}

    def by_day(key: str) -> List[Optional[float]]:
        return [daily[d][key] if daily[d] else None for d in axis]

    live_minutes = total["live_secs"] / 60
    delay = delay_ms(hist)
    tone, verdict = delay_verdict(delay)
    peer_slowest = percentile(peer, 0.95)
    delay_shares = chart("Share of live round time at each delay", "shares", [f"{i * TICK_MS:.0f}ms" for i in range(2, 16)],
                         [{"name": "Ticks", "values": hist[2:16]}], source=PHONES,
                         why=f"From exact tick counts. The netcode allows 2 to 15 ticks. Delays that each hold under {SMALL_DELAY_SHARE:.1%} of the time are grouped with their neighbours; the table has every one.")
    delay_shares["rows"] = delay_share_rows(hist)
    delay_shares["goal"] = GOAL_DELAY_MS
    return [
        section("",
                {"type": "faults", "title": "Faults that should never happen", "counts": faults, "words": fault_words(faults), "measured": bool(all_sides), "n": len(fights), "source": BOTH,
                 "why": "Each should stay at zero. Desyncs: the two phones' simulations differed, which means the engine isn't deterministic somewhere. Both phones notice the same one, so each counts once, and the bout restarts from P1's state. "
                        "Rollback misses: a rewind had no saved state to go back to. Score conflicts: both phones reported different round scores past the settled one, and the match can't finish until they agree. "
                        "Game loop errors: uncaught errors in the game loop; the fight's timeline shows the message."}),
        section("Felt lag",
                side_by_side(
                    {"type": "gauge", "title": "Input delay against the goal", "goal": GOAL_DELAY_MS, "scale": DELAY_SCALE_MS, "tone": tone, "verdict": verdict,
                     "average": kpi("Input delay", delay, "ms", n=len(side_delays), source=PHONES, n_label="phones", why="Average delay between a key press and the fight using it, weighted by time, over all live round ticks. This is what the rollback netcode adds; the screen and touch panel add their own on top."),
                     "slowest": kpi("Input delay, slowest 5%", percentile(side_delays, 0.95), "ms", n=len(side_delays), source=PHONES, n_label="phones", why="95th percentile across phones of each phone's average delay in that fight."),
                     "items": [
                         kpi("Time within the goal", ratio(within_goal, live_ticks), "pct", n=len(side_delays), source=PHONES, n_label="phones", why=f"Share of live round ticks played at {GOAL_DELAY_TICKS} ticks of input delay or less ({GOAL_DELAY_MS}ms). From exact tick counts, not samples.", viz=meter()),
                         kpi("Opponent round trip", percentile(peer, 0.5), "ms", n=len(peer), source=PHONES, n_label="reports", viz=range_to(peer_slowest),
                             why="Median of what phones report: a high percentile of their last 10 pings to the opponent over the same paths inputs take, sampled once per report. The slowest 5% is the 95th percentile of the same reports."),
                         kpi("Server round trip", percentile(server_rtt, 0.5), "ms", n=len(server_rtt), source=PHONES, n_label="reports", viz=range_to(percentile(server_rtt, 0.95)),
                             why="Median of the latest WebSocket ping to the game server at each report. The slowest 5% is the 95th percentile of the same reports."),
                     ]},
                    delay_shares)),
        section("Freezes",
                side_by_side(
                    chart("Freezes per 10 minutes", "line", axis, [{"name": "Freezes", "values": by_day("freezes_per_10")}], "number", PHONES, x_kind="day", compact=True,
                          headlines=[kpi("Freezes per 10 minutes", ratio(freezes_in_round(total), live_minutes / 10), "number", n=len(with_ticks), source=PHONES, n_label="phones", why="Times a live round visibly stopped for 250ms or more, on one phone, per 10 minutes of round time on that phone. A single freeze usually shows on both phones and counts on each. Drawn by the day the fight started.")]),
                    chart("Time stalled", "line", axis, [{"name": "Time stalled", "values": by_day("stall_share")}], "pct", PHONES, x_kind="day", compact=True,
                          headlines=[kpi("Time stalled", ratio(total["live_stall_ms"], total["live_secs"] * 1000), "pct", n=len(with_ticks), source=PHONES, n_label="phones", why="Share of live round time spent waiting because the opponent's input ran more than 8 ticks late, however short the wait. Drawn by the day the fight started.")])),
                kpis(
                    kpi("Stalls a minute", ratio(total["live_stalls"], live_minutes), "number", n=len(with_ticks), source=PHONES, n_label="phones", why="Waits of any length per minute of live round time."),
                    kpi("Longest stall", total["max_stall_ms"] if all_sides else None, "ms", n=len(all_sides), source=PHONES, n_label="phones", why="The longest single wait for the opponent's input in this range. Time with a player gone is not included."),
                    kpi("Waiting for the opponent to load", ratio(total["load_wait_ms"], len(all_sides)), "ms", n=len(all_sides), source=PHONES, n_label="phones", why="Average per phone in each fight: waiting for the opponent's phone to start at all. Reported apart so a slow loading screen doesn't read as a freeze."),
                    kpi("Freezes outside rounds", total["freezes_other"] if all_sides else None, n=len(all_sides), source=PHONES, n_label="phones", why="Same 250ms test, during loading, the round intro or a knockout. Annoying, but they don't lose anyone a fight."),
                    strip=True),
                side_by_side(
                    cause_table(causes, "Likely cause of each freeze"),
                    table("How long stalls last, in live rounds", [("length", "Length", "text"), ("count", "Stalls", "count")],
                          [{"length": label, "count": count} for label, count in zip(STALL_BUCKETS, stall_hist)], PHONES, "Under a frame or two is invisible to players. From 250ms on it counts as a freeze.",
                          empty="No stalls reported in this range.", view=bars_view("length", "count", divider={"before": STALL_BUCKETS_BELOW_A_FREEZE, "text": "A freeze from here"})))),
        section("Rollback",
                side_by_side(
                    chart("Rollbacks a minute", "line", axis, [{"name": "Rollbacks", "values": by_day("rollbacks_per_min")}], "number", PHONES, x_kind="day", compact=True,
                          headlines=[kpi("Rollbacks a minute", ratio(total["rollbacks"], total["active_secs"] / 60), "number", n=len(all_sides), source=PHONES, n_label="phones", why="Times a guess about the opponent's keys was wrong and the fight was rewound, per minute of fight. Drawn by the day the fight started.")]),
                    kpis(
                        kpi("Average depth", ratio(total["rollback_ticks"], total["rollbacks"]) and ratio(total["rollback_ticks"], total["rollbacks"]) * TICK_MS, "ms", n=total["rollbacks"], source=PHONES, n_label="rollbacks", viz=range_to(total["max_rollback"] * TICK_MS, "Deepest"),
                            why="How far back each rewind went on average. The further, the more visibly fighters jump. Deepest is the largest rewind in this range."),
                        kpi("Ticks run on a guess", ratio(total["predict_sum"], total["ticks"]), "number", n=len(all_sides), source=PHONES, n_label="phones", viz=meter(scale=8), why="How many ticks past the opponent's last known input the fight ran, on average. The netcode stops at 8 and waits, so the bar runs to 8."),
                        kpi("Inputs that arrived late", ratio(total["late_inputs"], total["inputs_udp"] + total["inputs_tcp"]), "pct", n=len(all_sides), source=PHONES, n_label="phones", viz=meter(), why="Opponent inputs for a tick already run on a guess. Late inputs only cost a rollback when the guess was wrong."),
                        kpi("Inputs first by UDP", ratio(total["inputs_udp"], total["inputs_udp"] + total["inputs_tcp"]), "pct", n=len(all_sides), source=PHONES, n_label="phones", viz=meter(), why="Inputs are sent both ways, over the WebRTC channel and the WebSocket. This is how often the UDP copy got there first."),
                        strip=True, columns=2))),
        section("How inputs travelled",
                table("By connection", [("transport", "Connection", "text"), ("share", "Share of fight time", "pct", "bar"), *QUALITY_COLUMNS], transports, PHONES,
                      "The path each report saw at the moment it was sent. Compare the lines to see what a path is worth.")),
        section("Compared across builds",
                table("By the server build a fight started on", [("build", "Build", "text"), ("first", "First fight", "time"), ("fights", "Fights", "count"), *QUALITY_COLUMNS], build_rows, PHONES,
                      "Use this after every deploy, watching the sample size. The same players on the same day are the fairest comparison.")),
    ]


# =========================================================================
# DEVICES
# =========================================================================

DEVICE_COLUMNS = [("fight_sides", "Phones in fights", "count"), ("minutes", "Fight minutes", "number"), ("frame_ms", "Average frame", "ms"),
                  ("slow_share", "Slow frames", "pct", "bar"), ("worst_frame", "Worst frame", "ms"), ("hitches_per_10", "Own freezes per 10 min", "number", "bar"),
                  ("busy", "Main thread busy", "pct"), ("tick_ms", "Tick", "ms"), ("save_ms", "Save", "ms"), ("load_ms", "Restore", "ms")]


def device_rows(conn: sqlite3.Connection, scope: Scope, expression: str, label: str, limit: int = 30) -> List[dict]:
    cte, params = scope.fights_cte()
    out = []
    for row in conn.execute(f"""{cte} SELECT {expression} AS grp, {ROLLUP_COLUMNS} FROM net_windows w JOIN f ON f.match_id = w.match_id
                                GROUP BY grp ORDER BY COALESCE(SUM(w.active_secs), 0) DESC LIMIT ?""", [*params, limit]):
        out.append({
            label: row["grp"] or "Unknown", "fight_sides": row["fight_sides"], "minutes": row["active_secs"] / 60,
            "frame_ms": ratio(row["frame_ms_sum"], row["frames"]), "slow_share": ratio(row["live_slow_frames"], row["live_frames"]),
            "worst_frame": row["max_frame_ms"], "hitches_per_10": ratio(row["hitch_freezes_live"], row["live_secs"] / 600),
            "busy": ratio(row["work_ms_sum"], row["active_secs"] * 1000), "tick_ms": ratio(row["tick_ms_sum"], row["ticks"]),
            "save_ms": ratio(row["save_ms_sum"], row["saves"]), "load_ms": ratio(row["load_ms_sum"], row["loads"]),
        })
    return out


def tab_devices(conn: sqlite3.Connection, scope: Scope) -> List[dict]:
    cte, params = scope.fights_cte()
    budget_rows = []
    for row in conn.execute(f"""{cte} SELECT COALESCE(w.platform, 'unknown') AS grp, {ROLLUP_COLUMNS} FROM net_windows w JOIN f ON f.match_id = w.match_id
                                GROUP BY grp ORDER BY COALESCE(SUM(w.active_secs), 0) DESC LIMIT 8"""
                            , params):
        secs = row["active_secs"]
        if secs:
            parts = [row["tick_ms_sum"] / secs, row["save_ms_sum"] / secs, row["load_ms_sum"] / secs, row["resim_ms_sum"] / secs]
            other = max(0.0, row["work_ms_sum"] / secs - sum(parts))
            budget_rows.append((row["grp"], parts + [other]))

    boots: Dict[str, List[float]] = defaultdict(list)
    memory = Counter()
    networks = Counter()
    for row in conn.execute(f"""{cte} SELECT e.data FROM match_events e JOIN f ON f.match_id = e.match_id WHERE e.kind = 'player_connected'""", params):
        data = data_of(row["data"])
        client = data.get("client") or {}
        if not data.get("reconnect"):
            if client.get("boot_ms") is not None:
                boots[client.get("platform") or "unknown"].append(client["boot_ms"])
            memory[f"{client['memory_gb']:g} GB" if client.get("memory_gb") else "Not reported"] += 1
            networks[client.get("net") or "Not reported"] += 1
    all_boots = [b for v in boots.values() for b in v]

    names = ["Simulate and draw", "Save state", "Restore state", "Replay after rollback", "Everything else"]
    boot_rows = [{"platform": platform, "ms": percentile(times_ms, 0.5), "phones": len(times_ms)} for platform, times_ms in sorted(boots.items(), key=lambda kv: -len(kv[1]))]
    return [
        section("How phones cope",
                side_by_side(
                    table("Load time by platform", [("platform", "Platform", "text"), ("ms", "Load time", "ms"), ("phones", "Phones", "count")], boot_rows, PHONES,
                          "Median for each platform, from the page starting to the game being ready to connect, when a player first joins a fight.", empty="No phone has reported a load time in this range.",
                          view=bars_view("platform", "ms"),
                          headlines=[kpi("Load time", percentile(all_boots, 0.5), "ms", n=len(all_boots), source=PHONES, n_label="phones", why="Median across all platforms."),
                                     kpi("Load time, slowest 5%", percentile(all_boots, 0.95), "ms", n=len(all_boots), source=PHONES, n_label="phones", why="95th percentile across all platforms.")]),
                    chart("Where a second of fight goes, by platform", "stackbar", [b[0] for b in budget_rows],
                          [{"name": names[i], "values": [b[1][i] for b in budget_rows]} for i in range(5)], "ms", PHONES,
                          "Milliseconds of main thread work per second of fight. 1000 means the phone can't keep up at all; well under that leaves room for the browser. Slow frames with low work point at the browser or the system, not the game."))),
        section("By platform",
                table("Telegram client", [("platform", "Platform", "text"), *DEVICE_COLUMNS], device_rows(conn, scope, "w.platform", "platform"), PHONES,
                      "As Telegram names it. Own freezes are single frames of 250ms or more on that phone; stalls are in the netcode tab. Tick is per tick; save and restore per snapshot.")),
        section("By device",
                table("Device model", [("model", "Model", "text"), *DEVICE_COLUMNS], device_rows(conn, scope, "COALESCE(w.model, w.os)", "model"), PHONES,
                      "Telegram for Android states the exact model. iPhones hide theirs, and desktop has none, so those fall back to the OS."),
                table("Telegram's own device class", [("perf_class", "Class", "text"), *DEVICE_COLUMNS], device_rows(conn, scope, "w.perf_class", "perf_class"), PHONES,
                      "Telegram for Android rates each device LOW, AVERAGE or HIGH. Unknown is everything else.")),
        section("Who is playing on what",
                side_by_side(
                    table("Reported memory", [("value", "Memory", "text"), ("count", "Phones", "count")], [{"value": k, "count": v} for k, v in sorted(memory.items(), key=lambda kv: (kv[0] == "Not reported", float(kv[0].split()[0]) if kv[0] != "Not reported" else 0))], PHONES,
                          "Rounded down by the browser, and only Chrome based browsers report it.", view=bars_view("value", "count", share=True)),
                    table("Reported network", [("value", "Network", "text"), ("count", "Phones", "count")], [{"value": k, "count": v} for k, v in networks.most_common()], PHONES,
                          "The browser's estimate when the player joined. iOS doesn't report it.", view=bars_view("value", "count", share=True)))),
    ]


# =========================================================================
# RELIABILITY
# =========================================================================

CAUSES = {
    "own_device": "This phone froze",
    "opponent_device": "The opponent's phone froze",
    "opponent_silent": "The opponent's inputs stopped reaching the server",
    "own_connection": "This phone wasn't getting inputs",
}
CAUSES_WHY = ("This phone froze: one of its own frames took 250ms or more. The opponent's phone froze: at that same moment, so this one had to wait. "
              "This phone wasn't getting inputs: the server had the opponent's inputs and they didn't arrive here.")


def freeze_causes(events: List[dict]) -> Counter:
    """
    A likely cause for each freeze in a live round of one fight, from three independent views of the same moment: what
    this phone saw, what the other phone saw, and what the server received. A stall begins about 8 ticks after the
    opponent's last input reached this phone, so whatever stopped them is already under way by then.
    """
    freezes, gaps = [], []
    for e in events:
        data = data_of(e["data"])
        if e["kind"] == "freeze" and data.get("live"):
            freezes.append({"role": e["role"], "at": e["at"], "ms": data.get("ms") or 0, "kind": data.get("kind")})
        elif e["kind"] == "input_gap":
            gaps.append({"role": e["role"], "at": e["at"], "ms": data.get("ms") or 0})

    def silence_at(role: str, moment: float) -> Optional[dict]:
        """The stretch of silence from this phone that a freeze at this moment (on a phone's clock) falls in."""
        return next((g for g in gaps if g["role"] == role and g["at"] - FREEZE_CLOCK_SLACK <= moment <= g["at"] + g["ms"] / 1000 + FREEZE_CLOCK_SLACK), None)

    causes: Counter = Counter()
    for f in freezes:
        if f["kind"] == "hitch":
            causes["own_device"] += 1
            continue
        other = "p2" if f["role"] == "p1" else "p1"
        # A hitch can only cause a stall by starting first: at least the 8 ticks of guessing (133ms) before it
        if any(x["kind"] == "hitch" and x["role"] == other and x["at"] <= f["at"] + 0.05 and f["at"] <= x["at"] + x["ms"] / 1000 + FREEZE_CLOCK_SLACK for x in freezes):
            causes["opponent_device"] += 1
            continue
        # Both phones go quiet in a shared freeze, one because of the other. Which went first is exact: the server
        # timed both silences on its own clock.
        ours, theirs = silence_at(f["role"], f["at"]), silence_at(other, f["at"])
        causes["opponent_silent" if theirs and (not ours or theirs["at"] < ours["at"]) else "own_connection"] += 1
    return causes


def analyse_drops(events: List[dict]) -> List[dict]:
    """Each connection lost during a fight, and whether and how fast that player came back to it."""
    drops = []
    for i, e in enumerate(events):
        if e["kind"] != "player_disconnected":
            continue
        data = data_of(e["data"])
        if not data.get("in_fight"):
            continue
        back = next((x for x in events[i + 1:] if x["kind"] == "player_connected" and x["player_id"] == e["player_id"]), None)
        if data.get("replaced"):
            # The phone was already back on a new connection when the server noticed this one drop
            drops.append({"player": e["player_id"], "recovered": True, "secs": None, "close_code": data.get("close_code")})
        else:
            drops.append({"player": e["player_id"], "recovered": back is not None, "secs": back["at"] - e["at"] if back else None,
                          "close_code": data.get("close_code")})
    return drops


def cause_table(causes: Counter, title: str) -> dict:
    total = sum(causes.values())
    return table(title, [("cause", "Likely cause", "text"), ("count", "Freezes", "count"), ("share", "Share", "pct")],
                 [{"cause": CAUSES[k], "count": causes[k], "share": ratio(causes[k], total)} for k in CAUSES], BOTH,
                 f"{CAUSES_WHY} Worked out by lining up three views of the moment: both phones' reports and what the server received. Phone events are placed on the server's clock, good to about 300ms, so a freeze next to another issue can be misfiled. Read it as a guide to where to look first.",
                 empty="No freezes in a live round.", view=bars_view("cause", "count", share=True))


GAP_BUCKETS = ["Under 25ms", "25 to 50ms", "50 to 100ms", "100 to 250ms", "250 to 500ms", "500ms to 1s", "1s and over"]
MOST_RECENT_RESTARTS = 5


def close_code_label(code: Any) -> str:
    return {0: "0: page closed the connection", 1000: "1000: closed normally", 1001: "1001: page went away",
            1006: "1006: connection died", 1011: "1011: server error", None: "None: server error"}.get(code, str(code))


def tab_reliability(conn: sqlite3.Connection, scope: Scope) -> List[dict]:
    fights = load_fights(conn, scope)
    events = events_by_fight(conn, scope, ("player_disconnected", "player_connected", "player_away", "player_back", "segment_restart", "freeze", "input_gap", "input_gaps"))

    fight_minutes = sum(f["active_secs"] or 0 for f in fights) / 60
    drops, causes = [], Counter()
    restarts = Counter()
    aways, away_secs, returned = 0, [], 0
    gap_hist = [0] * 7
    forfeit_kind = Counter()
    fights_with_drop = 0
    connect_restored = 0
    drops_on, secs_on = Counter(), Counter()
    for fight in fights:
        evs = events.get(fight["match_id"], [])
        fight_drops = analyse_drops(evs)
        drops += fight_drops
        fights_with_drop += 1 if fight_drops else 0
        drops_on[scope.day(fight["fight_started_at"])] += len(fight_drops)
        secs_on[scope.day(fight["fight_started_at"])] += fight["active_secs"] or 0
        causes += freeze_causes(evs)
        for e in evs:
            if e["kind"] == "segment_restart":
                restarts[data_of(e["data"]).get("reason") or "unknown"] += 1
            elif e["kind"] == "player_away" and data_of(e["data"]).get("in_fight"):
                aways += 1
                back = next((x for x in evs if x["kind"] == "player_back" and x["player_id"] == e["player_id"] and x["at"] >= e["at"]), None)
                if back:
                    returned += 1
                    away_secs.append(back["at"] - e["at"])
            elif e["kind"] == "input_gaps":
                data = data_of(e["data"])
                hist = data.get("hist") or []
                if len(hist) == 7:
                    gap_hist = [a + b for a, b in zip(gap_hist, hist)]
            elif e["kind"] == "player_connected" and data_of(e["data"]).get("restored"):
                connect_restored += 1
        if fight["outcome"] == "forfeit" and fight["winner_id"]:
            loser = fight["p1_id"] if fight["winner_id"] == fight["p2_id"] else fight["p2_id"]
            last = next((e for e in reversed(evs) if e["player_id"] == loser and e["kind"] in ("player_away", "player_disconnected")), None)
            if last is None:
                forfeit_kind["Unknown"] += 1
            elif last["kind"] == "player_away":
                forfeit_kind["Left the app and never came back"] += 1
            else:
                code = data_of(last["data"]).get("close_code")
                forfeit_kind["Connection died" if code == 1006 else "Server error" if code in (None, 1011) else "Closed the game"] += 1
    recovered = [d for d in drops if d["recovered"]]
    timed = [d["secs"] for d in drops if d["secs"] is not None]
    codes = Counter(close_code_label(d["close_code"]) for d in drops)

    restarts_at = conn.execute("SELECT at, data FROM match_events WHERE kind = 'server_start' AND at >= ? AND at <= ? ORDER BY at DESC", (scope.since, scope.until)).fetchall()
    restart_rows = [{"at": r["at"], "build": data_of(r["data"]).get("build")} for r in restarts_at[:MOST_RECENT_RESTARTS]]
    restart_days = scope.day_axis(restarts_at[-1]["at"] if restarts_at else None)
    restarts_on = Counter(scope.day(r["at"]) for r in restarts_at)

    axis = scope.day_axis(fights[0]["fight_started_at"] if fights else None)
    forfeits = [f for f in fights if f["outcome"] == "forfeit"]
    closed = [f for f in fights if f["outcome"] != "running"]
    return [
        section("Staying connected",
                kpis(
                    kpi("Drops per 10 minutes", ratio(len(drops), fight_minutes / 10), "number", n=len(fights), why="Times a player's WebSocket closed during a running fight, per 10 minutes of fight. Not counted once a match has ended, when leaving is normal. The line is the same number by the day the fight started.",
                        trend=day_trend(axis, [ratio(drops_on[d], secs_on[d] / 600) for d in axis])),
                    kpi("Fights with a drop", ratio(fights_with_drop, len(fights)), "pct", n=len(fights), why="Fights where at least one player's connection closed mid fight.", viz=meter()),
                    kpi("Players who came back", ratio(len(recovered), len(drops)), "pct", n=len(drops), n_label="lost connections", why="Lost connections followed by that player reconnecting to the same match.", viz=meter()),
                    kpi("Time to come back", percentile(timed, 0.5), "secs", n=len(timed), n_label="returns", viz=range_to(percentile(timed, 0.95)),
                        why="Median, from the server noticing the connection close to the same player reconnecting. A closed page or a killed app is noticed at once. A phone that silently loses signal takes the server about 22 seconds to notice, which this doesn't include, and if it reconnects before then it isn't timed at all. The slowest 5% is the 95th percentile of the same. The grace period is 60 seconds."),
                    kpi("Bout restarts per fight", ratio(sum(restarts.values()), len(fights)), "number", n=len(fights), why="Restarts of the bout from one saved state. Each one puts both phones through a short reload."),
                ),
                side_by_side(
                    table("How connections were lost", [("code", "WebSocket close code", "text"), ("count", "Times", "count")],
                          [{"code": k, "count": v} for k, v in codes.most_common()],
                          why="1006 means the connection died with no goodbye: bad network, or the app being killed. 1001 means the page closed.", empty="No connection has been lost during a fight.", view=bars_view("code", "count", share=True)),
                    table("Why bouts restarted", [("reason", "Reason", "text"), ("count", "Times", "count")],
                          [{"reason": {"reconnect": "A player reconnected", "desync": "The simulations differed"}.get(k, k), "count": v} for k, v in restarts.most_common()],
                          empty="No bout has restarted.", view=bars_view("reason", "count", share=True)))),
        section("Leaving the app",
                side_by_side(
                    kpis(
                        kpi("Times a player left mid fight", aways, n=len(fights), why="The page was hidden during a running fight: minimised, a phone call, switching apps."),
                        kpi("Came back in time", ratio(returned, aways), "pct", n=aways, n_label="absences", why="Returned before the match ended.", viz=meter()),
                        kpi("Time away", percentile(away_secs, 0.5), "secs", n=len(away_secs), n_label="absences", why="Median length of an absence the player came back from."),
                        kpi("Forfeit rate", ratio(len(forfeits), len(closed)), "pct", n=len(closed), why="Finished fights that ended with a player gone past the 60 second grace period.", viz=meter()),
                        strip=True, columns=2),
                    table("What the forfeiting player did last", [("what", "Last thing seen", "text"), ("count", "Forfeits", "count")],
                          [{"what": k, "count": v} for k, v in forfeit_kind.most_common()],
                          why="Rage quit or bad network? Closing the game cleanly and losing the connection look different to the server.", empty="No forfeits.", view=bars_view("what", "count", share=True)))),
        section("What causes freezes",
                side_by_side(
                    cause_table(causes, "Likely cause of each freeze in a live round"),
                    table("Gaps between one phone's inputs, at the server", [("gap", "Gap", "text"), ("count", "Gaps", "count")],
                          [{"gap": label, "count": count} for label, count in zip(GAP_BUCKETS, gap_hist)],
                          why="A phone sends one input per tick, about every 17ms, so most fall in the first bucket. Includes loading between rounds, which the server can't tell apart from a live round. Measured here, so it holds even when a phone never reports.",
                          empty="No data for this range yet.", view=bars_view("gap", "count", share=True)))),
        section("Server restarts",
                side_by_side(
                    chart("Server restarts by day", "column", restart_days, [{"name": "Restarts", "values": [restarts_on[d] for d in restart_days]}], why="Each deploy or crash. Fights in progress resume once both players are back.", x_kind="day", compact=True,
                          headlines=[kpi("Server restarts", len(restarts_at), why="Each one in this range."),
                                     kpi("Rejoins into a restored fight", connect_restored, n=len(fights), why="Players reconnecting to a fight the server had to rebuild from the database after a restart.")]),
                    table("Most recent", [("at", "When", "time"), ("build", "Build", "text")], restart_rows, empty="The server hasn't restarted in this range."))),
    ]


# =========================================================================
# SERVER
# =========================================================================

def tab_server(conn: sqlite3.Connection, scope: Scope) -> List[dict]:
    span = max(60.0, scope.until - (scope.since or (conn.execute("SELECT MIN(at) FROM server_samples").fetchone()[0] or scope.until)))
    bucket = max(60.0, span / 240)
    rows = [dict(r) for r in conn.execute(
        """SELECT CAST(at / ? AS INTEGER) * ? AS slot, MAX(lag_max_ms) AS lag_max, MAX(lag_p99_ms) AS lag_p99, AVG(lag_p50_ms) AS lag_p50,
                  MAX(cpu_pct) AS cpu, MAX(rss_mb) AS rss, MAX(load1) AS load1, MAX(db_mb) AS db_mb, MAX(connections) AS connections,
                  MAX(live_fights) AS live_fights, MAX(players) AS players, SUM(relay_msgs) AS relay_msgs, SUM(secs) AS secs, SUM(relay_kb) AS relay_kb,
                  MAX(relay_send_max_ms) AS relay_send_max, MAX(log_queue_max) AS log_queue, MAX(log_write_max_ms) AS log_write, MAX(log_dropped) AS log_dropped
           FROM server_samples WHERE at >= ? AND at <= ? GROUP BY slot ORDER BY slot""", (bucket, bucket, scope.since, scope.until))]
    all_samples = [dict(r) for r in conn.execute(
        "SELECT lag_p50_ms, lag_p99_ms, lag_max_ms, cpu_pct, rss_mb, live_fights, connections, db_mb, relay_send_max_ms, relay_msgs, secs FROM server_samples WHERE at >= ? AND at <= ?",
        (scope.since, scope.until))]
    x = [r["slot"] for r in rows]
    n = len(all_samples)

    def series(name, key, scale=1.0):
        return {"name": name, "values": [None if r[key] is None else r[key] * scale for r in rows]}

    def peak(label, key, unit, why):
        readings = [s[key] for s in all_samples if s[key] is not None]
        return kpi(label, max(readings, default=None), unit, n=len(readings), n_label="minutes", why=why)

    return [
        section("Is the server keeping up",
                side_by_side(
                    chart("Event loop lag", "line", x, [series("Worst in the period", "lag_max"), series("99th percentile", "lag_p99"), series("Median", "lag_p50")], "ms",
                          why="If this rises with the number of fights, the server is the bottleneck.", x_kind="time", compact=True,
                          headlines=[kpi("Typical", percentile((s["lag_p50_ms"] for s in all_samples), 0.5), "ms", n=n, n_label="minutes", why="How late a timer fires. Everything on the event loop, every relayed input included, is held up that long. Median of each minute's median."),
                                     kpi("Bad minutes", percentile((s["lag_p99_ms"] for s in all_samples), 0.95), "ms", n=n, n_label="minutes", why="95th percentile of each minute's 99th percentile."),
                                     peak("Worst lag seen", "lag_max_ms", "ms", "The single worst delay in this range. Anything over 50ms is visible as an input gap.")]),
                    chart("Fights running", "line", x, [series("Fights", "live_fights")], why="At each minute's sample.", x_kind="time", compact=True,
                          headlines=[peak("Most fights at once", "live_fights", "count", "Fights running at the moment of a minute's sample. Short peaks between samples aren't seen.")]),
                    chart("CPU", "line", x, [series("CPU", "cpu")], "pct100", why="Busiest minute of each period.", x_kind="time", compact=True,
                          headlines=[peak("Peak CPU", "cpu_pct", "pct100", "This process's share of one CPU core, over its busiest minute. The event loop can't use more than one core, so near 100 is the limit.")]),
                    chart("Memory", "line", x, [series("Memory", "rss")], "mb", why="Steady growth without more fights would mean a leak.", x_kind="time", compact=True,
                          headlines=[peak("Peak memory", "rss_mb", "mb", "Resident memory of the server process, read from the system once a minute. Linux only.")]))),
        section("Relay traffic",
                side_by_side(
                    chart("Inputs relayed per second", "line", x, [{"name": "Messages", "values": [ratio(r["relay_msgs"], r["secs"]) for r in rows]}], "number",
                          why="Binary messages through the WebSocket relay. Each player in a fight sends about 60 a second.", x_kind="time", compact=True),
                    chart("Slowest single relay send", "line", x, [series("Slowest", "relay_send_max")], "ms",
                          why="How long the slowest forward to an opponent took. A rising line means a player's connection can't take what we send it.", x_kind="time", compact=True))),
        section("The fight log itself",
                side_by_side(
                    chart("Database size", "line", x, [series("Size", "db_mb")], "mb", why="The database file and its write ahead log.", x_kind="time", compact=True),
                    chart("Log writer", "line", x, [series("Slowest write", "log_write")], "ms", why="How long the background writer's slowest batch took. It runs beside the game, so it can't hold up inputs.", x_kind="time", compact=True))),
    ]


# =========================================================================
# BALANCE
# =========================================================================

MATCHUP_COLOUR_FROM = 5          # fewer decided games than this between two fighters get no colour: 1 to 0 isn't dominance
COHORT_COLOUR_FROM = 5           # fewer players than this behind a cell get no colour: 1 of 1 isn't retention
COHORT_WEEKS = 8


def tab_balance(conn: sqlite3.Connection, scope: Scope) -> List[dict]:
    fights = load_fights(conn, scope)
    decided = [f for f in fights if f["finish_reason"] == "KNOCKOUT" and f["winner_id"]]
    n_heroes = len(HERO_NAMES)
    picks = [0] * n_heroes
    wins = [0] * n_heroes
    games = [0] * n_heroes
    matchup_wins = [[0] * n_heroes for _ in range(n_heroes)]
    for f in fights:
        for hero in (f["p1_hero"], f["p2_hero"]):
            if hero is not None and 0 <= hero < n_heroes:
                picks[hero] += 1
    mirrors = 0
    for f in decided:
        a, b = f["p1_hero"], f["p2_hero"]
        if a is None or b is None:
            continue
        if a == b:
            mirrors += 1
            continue
        games[a] += 1
        games[b] += 1
        winner_hero, loser_hero = (a, b) if f["winner_id"] == f["p1_id"] else (b, a)
        wins[winner_hero] += 1
        matchup_wins[winner_hero][loser_hero] += 1

    total_picks = sum(picks)
    hero_rows = []
    for h, name in enumerate(HERO_NAMES):
        low, high = wilson(wins[h], games[h])
        hero_rows.append({"hero": name, "picks": picks[h], "pick_share": ratio(picks[h], total_picks), "games": games[h], "wins": wins[h],
                          "win_rate": ratio(wins[h], games[h]), "low": low, "high": high})
    hero_rows.sort(key=lambda r: -r["picks"])

    matchups = []
    for h, name in enumerate(HERO_NAMES):
        row: Dict[str, Any] = {"hero": name}
        for o, other in enumerate(HERO_NAMES):
            w, l = matchup_wins[h][o], matchup_wins[o][h]
            row[f"h{o}"] = "" if h == o or (w + l) == 0 else f"{w} to {l}"
        matchups.append(row)

    p1_wins = sum(1 for f in decided if f["winner_id"] == f["p1_id"])
    low, high = wilson(p1_wins, len(decided))
    scores = Counter()
    for f in fights:
        if f["outcome"] != "played":
            continue
        if f["finish_reason"] == "DRAW":
            scores["Draw"] += 1
        else:
            top, bottom = max(f["p1_rounds"] or 0, f["p2_rounds"] or 0), min(f["p1_rounds"] or 0, f["p2_rounds"] or 0)
            scores[f"{top} to {bottom}"] += 1
    stages = Counter(f["stage"] for f in fights if f["stage"] is not None)

    cte, params = scope.fights_cte()
    round_secs = []
    events: Dict[str, List[Tuple[float, str]]] = defaultdict(list)
    for r in conn.execute(f"{cte} SELECT e.match_id, e.at, e.kind FROM match_events e JOIN f ON f.match_id = e.match_id WHERE e.kind IN ('fight_started', 'round_settled') ORDER BY e.at", params):
        events[r["match_id"]].append((r["at"], r["kind"]))
    clean = {f["match_id"] for f in fights if not f["paused_secs"] and not f["segment"]}
    for match_id, evs in events.items():
        if match_id in clean:
            round_secs += [later[0] - earlier[0] for earlier, later in zip(evs, evs[1:])]

    fought = [h for h in range(n_heroes) if games[h]]
    return [
        section("Fighters",
                table("Pick rate and win rate", [("hero", "Fighter", "text"), ("picks", "Picks", "count"), ("pick_share", "Pick share", "pct"), ("games", "Decided games", "count"),
                                                 ("wins", "Wins", "count"), ("win_rate", "Win rate", "pct"), ("low", "Could be as low as", "pct"), ("high", "Could be as high as", "pct")], hero_rows,
                      why="Picks count every fight. Win rate only counts fights decided by rounds between two different fighters: a forfeit says nothing about a fighter, and a mirror match is always one win and one loss. The line through each dot is a 95% confidence interval; two fighters whose lines overlap may not differ at all.",
                      view={"kind": "fighters"}),
                table("Who beats whom", [("hero", "Wins and losses against", "text")] + [(f"h{o}", name, "text") for o, name in enumerate(HERO_NAMES)], matchups,
                      why=f"Read across: the row fighter's wins to losses against the column fighter. Coloured from {MATCHUP_COLOUR_FROM} games, because one win from one game would otherwise look like total dominance.",
                      view={"kind": "matrix", "heroes": [HERO_NAMES[h] for h in fought], "min_games": MATCHUP_COLOUR_FROM,
                            "cells": [[None if a == b else {"w": matchup_wins[a][b], "l": matchup_wins[b][a]} for b in fought] for a in fought]})),
        section("Fairness",
                kpis(
                    kpi("P1 win rate", ratio(p1_wins, len(decided)), "pct", n=len(decided), note=None if low is None else f"Could be {low * 100:.0f}% to {high * 100:.0f}%",
                        viz=None if low is None else {"kind": "interval", "low": low, "high": high, "fair": 0.5}, why="P1 is whoever locked a fighter first and fights on the left. Near 50% is fair, the line down the middle. The band is a 95% confidence interval."),
                    kpi("Mirror matches", mirrors, n=len(decided), why="Decided fights where both players picked the same fighter."),
                    kpi("Round length", percentile(round_secs, 0.5), "secs", n=len(round_secs), n_label="rounds", why="Median time between rounds being settled, in fights with no pause or restart, and from the start of the fight for the first round, so it includes the intro."),
                    strip=True),
                side_by_side(
                    table("Final scores", [("score", "Score", "text"), ("count", "Fights", "count")], [{"score": k, "count": v} for k, v in scores.most_common()],
                          why="Fights played to the end. Close 2 to 1 games are usually the fun ones.", view=bars_view("score", "count", share=True)),
                    table("Arenas", [("stage", "Arena", "text"), ("count", "Fights", "count")], [{"stage": f"Arena {k + 1}", "count": v} for k, v in sorted(stages.items())],
                          why="Picked at random by the server, so these should come out roughly even.", view=bars_view("stage", "count", share=True)))),
    ]


# =========================================================================
# PLAYERS
# =========================================================================

def tab_players(conn: sqlite3.Connection, scope: Scope) -> List[dict]:
    fights = load_fights(conn, scope)
    clause, params = scope.not_admin("p1_id", "p2_id")
    days_active: Dict[str, set] = defaultdict(set)
    for r in conn.execute(f"SELECT p1_id, p2_id, fight_started_at FROM matches WHERE fight_started_at IS NOT NULL AND {clause}", params):
        day = scope.day(r["fight_started_at"])
        for pid in (r["p1_id"], r["p2_id"]):
            if pid:
                days_active[pid].add(day)
    first_day = {pid: min(days) for pid, days in days_active.items()}
    today = scope.day(scope.until)

    def later(day: str, n: int) -> str:
        return (datetime.strptime(day, "%Y-%m-%d") + timedelta(days=n)).strftime("%Y-%m-%d")

    since_day = scope.day(scope.since) if scope.since else ""
    in_range = {pid for pid, day in first_day.items() if day >= since_day}

    def retention(n: int) -> Tuple[Optional[float], int]:
        eligible = [pid for pid in in_range if later(first_day[pid], n) <= today]
        kept = [pid for pid in eligible if later(first_day[pid], n) in days_active[pid]]
        return ratio(len(kept), len(eligible)), len(eligible)

    stats: Dict[str, dict] = {}
    for f in fights:
        for pid, name, role in ((f["p1_id"], f["p1_name"], "p1"), (f["p2_id"], f["p2_name"], "p2")):
            if not pid:
                continue
            s = stats.setdefault(pid, {"player": name, "player_id": pid, "fights": 0, "played": 0, "wins": 0, "losses": 0, "draws": 0,
                                       "forfeits_lost": 0, "forfeits_won": 0, "last": 0, "first": first_day.get(pid)})
            s["player"] = name or s["player"]
            s["fights"] += 1
            s["last"] = max(s["last"], f["fight_started_at"])
            if f["outcome"] == "played":
                s["played"] += 1
                if f["winner_id"] == pid:
                    s["wins"] += 1
                elif f["winner_id"]:
                    s["losses"] += 1
                else:
                    s["draws"] += 1
            elif f["outcome"] == "forfeit":
                if f["winner_id"] == pid:
                    s["forfeits_won"] += 1
                else:
                    s["forfeits_lost"] += 1

    devices = {r["player_id"]: r for r in conn.execute("SELECT player_id, platform, COALESCE(model, os) AS device FROM players")}
    rows = sorted(stats.values(), key=lambda s: (-s["fights"], -s["last"]))
    for s in rows:
        s["win_rate"] = ratio(s["wins"], s["wins"] + s["losses"])
        s["days_active"] = len(days_active[s["player_id"]])
        device = devices.get(s["player_id"])
        s["device"] = (device["device"] or device["platform"]) if device else None

    axis = scope.day_axis(fights[0]["fight_started_at"] if fights else None)
    new_by_day, returning_by_day = Counter(), Counter()
    for pid, days in days_active.items():
        for day in days:
            if day == first_day[pid]:
                new_by_day[day] += 1
            else:
                returning_by_day[day] += 1

    d1, d1_n = retention(1)
    d3, d3_n = retention(3)
    d7, d7_n = retention(7)
    returned_any = [pid for pid in in_range if len(days_active[pid]) > 1]
    repeat = [s for s in rows if s["fights"] > 1]

    # Cohorts by the week of a player's first fight, Monday first. A day's new players are too few to read during a beta.
    def week_of(day: str) -> str:
        date = datetime.strptime(day, "%Y-%m-%d")
        return (date - timedelta(days=date.weekday())).strftime("%Y-%m-%d")

    cohorts = defaultdict(list)
    for pid in in_range:
        cohorts[week_of(first_day[pid])].append(pid)
    cohort_rows = []
    for week in sorted(cohorts, reverse=True)[:COHORT_WEEKS]:
        members = cohorts[week]
        row: Dict[str, Any] = {"week": week, "size": len(members)}
        for n in (1, 3, 7):
            # Each player's own day, and only once it has come, so these add up to the figures above
            due = [pid for pid in members if later(first_day[pid], n) <= today]
            row[f"d{n}"] = ratio(sum(1 for pid in due if later(first_day[pid], n) in days_active[pid]), len(due))
            row[f"d{n}_n"] = len(due)
        cohort_rows.append(row)

    return [
        section("Are players coming back",
                kpis(
                    kpi("Players who fought", len(stats), n=len(fights), why="Different accounts on either side of a fight in this range."),
                    kpi("New players", len(in_range), why="Players whose first fight ever falls in this range."),
                    kpi("Played more than once", ratio(len(repeat), len(rows)), "pct", n=len(rows), n_label="players", why="Players with two or more fights in this range.", viz=meter()),
                    strip=True),
                kpis(
                    kpi("Fought again on the next day", d1, "pct", n=d1_n, n_label="players", why="New players who fought on the day after their first fight. Only counts those whose next day has already come.", viz=meter()),
                    kpi("Fought again on day 3", d3, "pct", n=d3_n, n_label="players", why="The same, three days after the first fight.", viz=meter()),
                    kpi("Fought again on day 7", d7, "pct", n=d7_n, n_label="players", why="The same, seven days after the first fight.", viz=meter()),
                    kpi("Came back on any later day", ratio(len(returned_any), len(in_range)), "pct", n=len(in_range), n_label="players", why="New players who fought on at least one later day so far. Rises with time, so recent players pull it down.", viz=meter()),
                    strip=True),
                side_by_side(
                    chart("Players per day", "stack", axis, [{"name": "New", "values": [new_by_day[d] for d in axis]}, {"name": "Returning", "values": [returning_by_day[d] for d in axis]}],
                          why="Players with a fight that day. New means it was their first day fighting.", x_kind="day"),
                    table("By first week", [("week", "Week of", "text"), ("size", "New players", "count"), ("d1", "Next day", "pct", "heat"), ("d3", "Day 3", "pct", "heat"), ("d7", "Day 7", "pct", "heat")], cohort_rows,
                          why=f"New players by the week of their first fight, the latest {COHORT_WEEKS} weeks. Each cell only counts players whose day has come, the same as the figures above, and a dash means nobody's has yet. Darker means more of them came back. Coloured from {COHORT_COLOUR_FROM} players, because one player coming back would otherwise look like perfect retention.",
                          empty="No new players in this range.", heat_from={"min": COHORT_COLOUR_FROM, "label": "players"}))),
        section("Everyone who fought",
                table("Players", [("player", "Player", "text"), ("player_id", "Telegram id", "text"), ("fights", "Fights", "count", "bar"), ("played", "Played out", "count"), ("wins", "Wins", "count"),
                                  ("losses", "Losses", "count"), ("draws", "Draws", "count"), ("win_rate", "Win rate", "pct"), ("forfeits_lost", "Forfeits lost", "count"), ("forfeits_won", "Forfeits won", "count"),
                                  ("days_active", "Days active", "count"), ("last", "Last fight", "time"), ("device", "Last device", "text")], rows[:300],
                      why="Fights in this range. Win rate only counts fights played to the end. Days active is all time.")),
    ]


# =========================================================================
# FIGHTS: THE LOG, AND ONE FIGHT IN DETAIL
# =========================================================================

def fight_summary(fight: dict, sides: Dict[Tuple[str, str], dict], counts: Dict[str, Counter]) -> dict:
    a, b = sides.get((fight["match_id"], "p1")), sides.get((fight["match_id"], "p2"))
    present = [s for s in (a, b) if s]
    combined = combine(present) if present else None
    coverage = fight_coverage(fight, sides) if fight["active_secs"] else {"p1": None, "p2": None}
    known = [c for c in coverage.values() if c is not None]
    count = counts[fight["match_id"]]
    misses, errors = (combined["rollback_misses"], combined["loop_errors"]) if combined else (0, 0)
    return {
        "match_id": fight["match_id"], "started": fight["fight_started_at"], "p1": fight["p1_name"], "p2": fight["p2_name"],
        "heroes": " vs ".join(HERO_NAMES[h] if h is not None and 0 <= h < len(HERO_NAMES) else "?" for h in (fight["p1_hero"], fight["p2_hero"])),
        "outcome": OUTCOME_LABELS[fight["outcome"]], "outcome_key": fight["outcome"],
        "score": f"{fight['p1_rounds'] or 0} to {fight['p2_rounds'] or 0}",
        "secs": fight["active_secs"], "paused": fight["paused_secs"] or 0, "restarts": fight["segment"] or 0,
        "delay_ms": delay_ms(combined["delay_hist"]) if combined else None,
        "rollbacks": combined["rollbacks"] if combined else None,
        "freezes": freezes_in_round(combined) if combined else None,
        "drops": count["drops"], "desyncs": count["desyncs"], "conflicts": count["conflicts"], "misses": misses, "errors": errors,
        "faults": count["desyncs"] + count["conflicts"] + misses + errors,
        "coverage": min(known) if len(known) == 2 else None, "build": fight["build"],
    }


def tab_fights(conn: sqlite3.Connection, scope: Scope, query: str = "", only: str = "", limit: int = 100, offset: int = 0) -> List[dict]:
    fights = load_fights(conn, scope)
    sides = load_sides(conn, scope)
    counts = fight_counts(conn, scope)

    rows = [fight_summary(f, sides, counts) for f in reversed(fights)]
    needle = query.strip().lower()
    if needle:
        wanted = {f["match_id"] for f in fights if needle in " ".join(str(f[k] or "") for k in ("match_id", "p1_id", "p2_id", "p1_name", "p2_name")).lower()}
        rows = [r for r in rows if r["match_id"] in wanted]
    if only in OUTCOME_LABELS:
        rows = [r for r in rows if r["outcome_key"] == only]
    elif only == "freezes":
        rows = [r for r in rows if r["freezes"]]
    elif only == "drops":
        rows = [r for r in rows if r["drops"]]
    elif only == "desyncs":
        rows = [r for r in rows if r["desyncs"]]
    elif only == "faults":
        rows = [r for r in rows if r["faults"]]
    elif only == "no_reports":
        rows = [r for r in rows if r["outcome_key"] != "running" and (r["coverage"] or 0) < MIN_COVERAGE]
    total = len(rows)
    columns = [("started", "Started", "time"), ("p1", "P1", "text"), ("p2", "P2", "text"), ("heroes", "Fighters", "text"), ("outcome", "Result", "text"),
               ("score", "Score", "text"), ("secs", "Length", "secs"), ("freezes", "Freezes", "count", "flag"), ("desyncs", "Desyncs", "count", "flag"), ("drops", "Lost connections", "count", "flag"),
               ("restarts", "Restarts", "count", "flag"), ("delay_ms", "Input delay", "ms"), ("rollbacks", "Rollbacks", "count"), ("coverage", "Reported", "pct", "bar")]
    log = table(f"{total} fights", columns, rows[offset:offset + limit], BOTH,
                "Newest first. Select a fight to see its timeline. Reported is the share of the fight covered by the phone with the least reports.",
                empty="No fights match. Try a wider range, or include your own fights.")
    log["link"] = "match_id"
    log["total"] = total
    log["offset"] = offset
    log["limit"] = limit
    return [section("Every fight", log)]


TIMELINE_TEXT = {
    "seat_claimed": "accepted the challenge", "seat_released": "left before the creator arrived", "player_connected": "connected",
    "player_disconnected": "connection closed", "player_away": "left the app", "player_back": "came back to the app", "hero_locked": "locked a fighter",
    "fight_started": "fight started", "segment_restart": "bout restarted", "round_settled": "round settled by both phones", "score_conflict": "phones report different scores",
    "match_finished": "match finished", "rematch_requested": "asked for a rematch", "rematch_agreed": "rematch agreed", "freeze": "froze", "input_gap": "went silent at the server",
    "desync": "simulations differ", "loop_error": "game loop error", "challenge_expired": "challenge expired",
}


def timeline_detail(kind: str, data: dict) -> str:
    if kind == "freeze":
        what = "own frame took" if data.get("kind") == "hitch" else "waited for the opponent"
        where = "in round" if data.get("live") else "outside a round"
        return f"{what} {data.get('ms')}ms, {where}" + (", still going when reported" if data.get("open") else "")
    if kind == "input_gap":
        return f"nothing received for {data.get('ms')}ms"
    if kind == "player_disconnected":
        return f"close code {data.get('close_code')}" + (", already back on a new connection" if data.get("replaced") else "")
    if kind == "player_connected":
        client = data.get("client") or {}
        device = " ".join(str(x) for x in (client.get("platform"), client.get("model") or client.get("os")) if x)
        extra = ", rejoining" if data.get("reconnect") else ""
        return f"{device}{extra}".strip(", ")
    if kind == "hero_locked":
        hero = data.get("hero")
        return HERO_NAMES[hero] if isinstance(hero, int) and 0 <= hero < len(HERO_NAMES) else ""
    if kind == "segment_restart":
        return {"reconnect": "a player came back", "desync": "the simulations differed"}.get(data.get("reason"), str(data.get("reason")))
    if kind == "round_settled":
        return f"{data.get('p1')} to {data.get('p2')}"
    if kind == "match_finished":
        return f"{data.get('reason')}, {data.get('p1_rounds')} to {data.get('p2_rounds')}"
    if kind == "score_conflict":
        return str(data.get("reports"))
    if kind == "desync":
        return f"at tick {data.get('tick')}"
    if kind == "loop_error":
        return str(data.get("message"))
    return ""


# How bad a number has to be before one phone doing worse than the other is worth pointing at
WORSE_FROM = {"stall_freezes": 1, "hitch_freezes": 1, "freezes_other": 1, "stalls": 1, "stall_ms": 250, "max_stall_ms": 250, "load_wait_ms": 1000, "worst_frame": 250,
              "slow_share": 0.05, "busy": 0.5, "errors": 1, "delay_ms": 100, "peer_rtt": 100, "server_rtt": 100}


def worse_side(sides: Dict[str, dict]) -> Dict[str, str]:
    """The numbers where one phone clearly did worse: at least double the other, and bad enough to matter."""
    a, b = sides.get("p1"), sides.get("p2")
    if not a or not b:
        return {}
    worse = {}
    for key, floor in WORSE_FROM.items():
        x, y = a.get(key), b.get(key)
        if x is not None and y is not None and max(x, y) >= floor and max(x, y) >= 2 * min(x, y):
            worse[key] = "p1" if x > y else "p2"
    return worse


def gone_spans(events: List[dict], zero: float, end: float) -> Dict[str, List[dict]]:
    """
    When each player was gone from a running fight, from the server's own record: connection lost, or the app left. Someone
    who never came back is gone until the end. A connection the phone had already replaced cost no time at all, so it's left out.
    """
    spans: Dict[str, List[dict]] = {"p1": [], "p2": []}
    for i, e in enumerate(events):
        data = data_of(e["data"])
        if e["role"] not in spans or not data.get("in_fight"):
            continue
        if e["kind"] == "player_disconnected" and not data.get("replaced"):
            kind, back_kind = "lost", "player_connected"
        elif e["kind"] == "player_away":
            kind, back_kind = "away", "player_back"
        else:
            continue
        back = next((x for x in events[i + 1:] if x["kind"] == back_kind and x["player_id"] == e["player_id"]), None)
        spans[e["role"]].append({"t": e["at"] - zero, "secs": max(0.0, (back["at"] if back else end) - e["at"]), "kind": kind, "came_back": back is not None})
    return spans


def fight_story(fight: dict, sides: Dict[str, dict], events: List[dict]) -> Optional[dict]:
    """What the fight's page leads with. The sentence is built from counts, so it can't claim more than was measured."""
    if not fight["fight_started_at"]:
        return None
    zero = fight["fight_started_at"]
    roles = ("p1", "p2")
    name = lambda role: fight[f"{role}_name"] or role.upper()
    lanes: Dict[str, List[dict]] = {role: [] for role in roles}
    for e in events:
        data = data_of(e["data"])
        if e["kind"] == "freeze" and data.get("live") and e["role"] in lanes:
            lanes[e["role"]].append({"t": e["at"] - zero, "ms": data.get("ms") or 0, "kind": data.get("kind")})

    active = fight["active_secs"]
    where = f" in {secs_text(active)}" if active is not None else " so far"
    # Counts and listed freezes arrive together but are separate rows, and the writer can drop one under load. Whichever
    # knows of more is right, so the sentence can't say less than the strip drawn under it.
    own = {role: max((sides.get(role) or {}).get("hitch_freezes") or 0, sum(1 for m in lanes[role] if m["kind"] == "hitch")) for role in roles}
    waited = {role: max((sides.get(role) or {}).get("stall_freezes") or 0, sum(1 for m in lanes[role] if m["kind"] != "hitch")) for role in roles}
    freezes = sum(own.values()) + sum(waited.values())
    # A finished fight a phone reported little of can have had freezes nobody heard about
    thin = [name(role) for role in roles if active is not None and ((sides.get(role) or {}).get("coverage") or 0) < MIN_COVERAGE]

    sentences = []
    if freezes:
        sentences.append(f"{counted(freezes, 'freeze', 'freezes')}{where}.")
        for role in roles:
            if own[role]:
                sentences.append(f"{name(role)}'s phone froze {times(own[role])}.")
            if waited[role]:
                sentences.append(f"{name(role)} waited for the opponent {times(waited[role])}.")
        if thin:
            sentences.append(f"{' and '.join(thin)} reported less than half of the fight, so there may be more.")
    elif not sides:
        sentences.append("No phone reports for this fight, so any freezes are unknown.")
    elif thin:
        sentences.append(f"No freezes reported{where}, but {' and '.join(thin)} reported less than half of the fight.")
    else:
        sentences.append(f"No freezes{where}.")

    drops = sum(1 for e in events if e["kind"] == "player_disconnected" and data_of(e["data"]).get("in_fight"))
    desyncs = len({(e["segment"], e["data"]) for e in events if e["kind"] == "desync"})
    conflicts = sum(1 for e in events if e["kind"] == "score_conflict")
    errors = sum(s.get("errors") or 0 for s in sides.values())
    others = [counted(n, one) for n, one in ((desyncs, "desync"), (conflicts, "score conflict"), (errors, "game loop error"), (drops, "lost connection"), (fight["segment"] or 0, "bout restart")) if n]
    if others:
        sentences.append(f"{', '.join(others)}.")

    end = fight["ended_at"] or max((e["at"] for e in events), default=zero)
    listed = sum(len(marks) for marks in lanes.values())
    span = max([end - zero, 1.0] + [m["t"] + m["ms"] / 1000 for marks in lanes.values() for m in marks])
    rounds = [{"t": e["at"] - zero, "p1": d.get("p1"), "p2": d.get("p2")} for e, d in ((e, data_of(e["data"])) for e in events if e["kind"] == "round_settled")]
    return {"sentence": " ".join(sentences), "lanes": lanes, "gone": gone_spans(events, zero, end), "rounds": rounds, "span": span, "unlisted": max(0, freezes - listed), "paused": fight["paused_secs"] or 0}


def fight_detail(conn: sqlite3.Connection, match_id: str) -> Optional[dict]:
    row = conn.execute("SELECT * FROM matches WHERE match_id = ?", (match_id,)).fetchone()
    if row is None:
        return None
    fight = dict(row)
    fight.pop("room_state", None)
    fight["outcome"] = outcome_of(fight) if fight["fight_started_at"] else None
    if fight["fight_started_at"] and fight["outcome"] != "running" and fight["ended_at"]:
        fight["active_secs"] = max(0.0, fight["ended_at"] - fight["fight_started_at"] - (fight["paused_secs"] or 0))
    else:
        fight["active_secs"] = None

    events = [dict(e) for e in conn.execute(
        "SELECT at, kind, player_id, role, segment, data FROM match_events WHERE match_id = ? ORDER BY at", (match_id,))]
    names = {fight["p1_id"]: fight["p1_name"], fight["p2_id"]: fight["p2_name"], fight["creator_id"]: fight["creator_name"]}
    if fight["opponent_id"]:
        names[fight["opponent_id"]] = fight["opponent_name"]
    zero = fight["fight_started_at"] or fight["created_at"]
    timeline = []
    for e in events:
        if e["kind"] in ("input_gaps",):
            continue
        data = data_of(e["data"])
        # Leaving before the match is over may be what ended it; leaving afterwards is just people closing the game
        left_early = e["kind"] in ("player_disconnected", "player_away") and not (fight["ended_at"] and e["at"] >= fight["ended_at"])
        timeline.append({"t": e["at"] - zero, "at": e["at"], "kind": e["kind"], "text": TIMELINE_TEXT.get(e["kind"], e["kind"]),
                         "detail": timeline_detail(e["kind"], data), "role": e["role"], "who": names.get(e["player_id"]) or "",
                         "problem": left_early or e["kind"] in ("freeze", "input_gap", "desync", "score_conflict", "loop_error", "segment_restart")})

    windows = [dict(w) for w in conn.execute("SELECT * FROM net_windows WHERE match_id = ? ORDER BY received_at", (match_id,))]
    sides = {}
    for role in ("p1", "p2"):
        rows = [w for w in windows if w["role"] == role]
        if rows:
            for w in rows:
                w["delay_hist"] = hist_of(w["live_delay_hist"], 16)
            total = combine(rows)
            sides[role] = {
                "player": fight[f"{role}_name"], "platform": rows[-1]["platform"], "device": rows[-1]["model"] or rows[-1]["os"], "reports": len(rows),
                "reported_secs": total["active_secs"], "coverage": ratio(total["active_secs"], fight["active_secs"]),
                "delay_ms": delay_ms(total["delay_hist"]),
                "peer_rtt": percentile((w["peer_rtt"] for w in rows), 0.5), "server_rtt": percentile((w["server_rtt"] for w in rows if w["server_rtt"]), 0.5),
                "transport": transport_name(rows[-1]["p2p"], rows[-1]["ice_path"]),
                "rollbacks": total["rollbacks"], "max_rollback_ms": total["max_rollback"] * TICK_MS,
                "stalls": total["stalls"], "stall_ms": total["stall_ms"], "max_stall_ms": total["max_stall_ms"], "load_wait_ms": total["load_wait_ms"],
                "stall_freezes": total["stall_freezes_live"], "hitch_freezes": total["hitch_freezes_live"], "freezes_other": total["freezes_other"],
                "frame_ms": ratio(total["frame_ms_sum"], total["frames"]), "worst_frame": total["max_frame_ms"],
                "slow_share": ratio(total["live_slow_frames"], total["live_frames"]), "busy": ratio(total["work_ms_sum"], (total["active_secs"] or 0) * 1000),
                "speed": ratio(total["ticks"], total["active_secs"]),
                "inputs_udp": ratio(total["inputs_udp"], total["inputs_udp"] + total["inputs_tcp"]), "errors": total["loop_errors"],
            }

    def line(key, scale=1.0):
        out = []
        for role in ("p1", "p2"):
            points = [[w["received_at"] - zero, None if w[key] is None else w[key] * scale] for w in windows if w["role"] == role]
            if points:
                out.append({"name": role.upper(), "points": points})
        return out

    gaps = {}
    for e in events:
        if e["kind"] == "input_gaps":
            data = data_of(e["data"])
            gap = gaps.setdefault(e["role"], {"packets": 0, "max_ms": 0})
            gap["packets"] += data.get("packets") or 0
            gap["max_ms"] = max(gap["max_ms"], data.get("max_ms") or 0)

    fight_public = {k: fight[k] for k in (
        "match_id", "status", "finish_reason", "winner_id", "created_at", "started_at", "fight_started_at", "ended_at", "paused_secs", "segment", "build",
        "p1_id", "p2_id", "p1_name", "p2_name", "p1_hero", "p2_hero", "p1_rounds", "p2_rounds", "stage", "rematch_of", "chat_id", "active_secs", "outcome")}
    fight_public["heroes"] = [HERO_NAMES[h] if isinstance(h, int) and 0 <= h < len(HERO_NAMES) else None for h in (fight["p1_hero"], fight["p2_hero"])]
    fight_public["source"] = source_of_challenge(fight["chat_id"])
    fight_public["rematch"] = (conn.execute("SELECT match_id FROM matches WHERE rematch_of = ?", (match_id,)).fetchone() or [None])[0]
    fight_public["has_replay"] = conn.execute("SELECT 1 FROM replays WHERE match_id = ?", (match_id,)).fetchone() is not None
    return {
        "fight": fight_public, "sides": sides, "server_gaps": gaps, "timeline": timeline, "causes": dict(freeze_causes(events)), "cause_labels": CAUSES,
        "story": fight_story(fight, sides, events), "worse": worse_side(sides),
        "lines": {"delay": line("delay", TICK_MS), "peer_rtt": line("peer_rtt"), "stall_ms": line("stall_ms"), "rollbacks": line("rollbacks"),
                  "max_frame_ms": line("max_frame_ms")},
        "windows": [{k: w[k] for k in ("role", "segment", "seq", "reason", "received_at", "secs", "active_secs", "paused_ms", "hidden_ms", "ticks", "stalls", "stall_ms", "rollbacks", "delay", "peer_rtt", "max_frame_ms")} for w in windows],
    }


# =========================================================================
# DATA QUALITY
# =========================================================================

def check(name: str, proves: str, bad: int, examples: Iterable[str] = (), warn_only: bool = False, detail: Optional[str] = None) -> dict:
    return {"name": name, "proves": proves, "bad": bad, "examples": [str(x) for x in list(examples)[:5]], "detail": detail,
            "status": "ok" if not bad else ("warn" if warn_only else "fail")}


def data_quality_checks(conn: sqlite3.Connection, scope: Scope) -> List[dict]:
    """
    Facts the data must obey if it is right, mostly comparing sources that were recorded independently. These run over
    all time, whatever the range and filter on the page, because a broken row is broken whichever fights you look at.
    """
    checks = []

    def ids(sql: str, *params) -> List[str]:
        return [r[0] for r in conn.execute(sql, params)]

    bad = ids("SELECT match_id FROM matches WHERE status IN ('COMPLETED', 'ABANDONED', 'CANCELLED') AND (ended_at IS NULL OR finish_reason IS NULL)")
    checks.append(check("Closed matches say how and when", "Every closed match has an end time and a reason, so outcome rates have no unknowns.", len(bad), bad))
    bad = ids("SELECT match_id FROM matches WHERE fight_started_at IS NOT NULL AND ended_at IS NOT NULL AND ended_at < fight_started_at")
    checks.append(check("Fights end after they start", "No fight has a negative length, so time based numbers can be trusted.", len(bad), bad))
    bad = ids("SELECT match_id FROM matches WHERE fight_started_at IS NOT NULL AND started_at IS NULL")
    checks.append(check("A fight needs both players connected", "No fight skipped the both players in step, so the funnel can only narrow.", len(bad), bad))
    bad = ids("SELECT match_id FROM matches WHERE fight_started_at IS NOT NULL AND (p1_id IS NULL OR p2_id IS NULL OR p1_hero IS NULL OR p2_hero IS NULL OR stage IS NULL)")
    checks.append(check("Fights record their setup", "Every fight has both players, fighters and an arena, so balance numbers cover all of them.", len(bad), bad))
    bad = ids("SELECT match_id FROM matches WHERE fight_started_at IS NOT NULL AND winner_id IS NOT NULL AND winner_id <> p1_id AND winner_id <> p2_id")
    checks.append(check("Winners fought", "Every winner was one of the two players.", len(bad), bad))
    bad = ids("""SELECT match_id FROM matches WHERE finish_reason = 'KNOCKOUT' AND fight_started_at IS NOT NULL AND NOT (
                 (winner_id = p1_id AND p1_rounds >= 2 AND p1_rounds > p2_rounds) OR (winner_id = p2_id AND p2_rounds >= 2 AND p2_rounds > p1_rounds))""")
    checks.append(check("Winners won on rounds", "The stored winner matches the stored score, recorded at different moments.", len(bad), bad))

    last_settled = {}
    for r in conn.execute("SELECT match_id, data FROM match_events WHERE kind = 'round_settled' ORDER BY at"):
        last_settled[r["match_id"]] = data_of(r["data"])
    bad = []
    for r in conn.execute("SELECT match_id, p1_rounds, p2_rounds FROM matches WHERE fight_started_at IS NOT NULL"):
        settled = last_settled.get(r["match_id"])
        if settled and (settled.get("p1"), settled.get("p2")) != (r["p1_rounds"], r["p2_rounds"]):
            bad.append(r["match_id"])
    checks.append(check("Scores match the timeline", "The score on the match equals the last round settled in its event log, two independent writes.", len(bad), bad))

    restarts = Counter(r[0] for r in conn.execute("SELECT match_id FROM match_events WHERE kind = 'segment_restart'"))
    bad = [r["match_id"] for r in conn.execute("SELECT match_id, segment FROM matches WHERE fight_started_at IS NOT NULL AND segment IS NOT NULL")
           if restarts.get(r["match_id"], 0) != r["segment"]]
    checks.append(check("Restarts match the timeline", "The restart count on each fight equals its logged restart events, so no events went missing.", len(bad), bad))

    wins = conn.execute("SELECT COALESCE(SUM(wins), 0), COALESCE(SUM(losses), 0), COALESCE(SUM(games_played), 0) FROM local_leaderboard").fetchone()
    with_winner = conn.execute("SELECT COUNT(*) FROM matches WHERE winner_id IS NOT NULL AND opponent_id IS NOT NULL").fetchone()[0]
    games = conn.execute("""SELECT COUNT(*) FROM matches WHERE status IN ('COMPLETED', 'ABANDONED') AND opponent_id IS NOT NULL
                            AND COALESCE(finish_reason, '') <> 'STALE'""").fetchone()[0]
    checks.append(check("The leaderboard adds up", "Leaderboard wins, losses and games match the match table, kept separately by the game.",
                        abs(wins[0] - with_winner) + abs(wins[1] - with_winner) + abs(wins[2] - games * 2), [],
                        detail=f"{wins[0]} wins and {wins[1]} losses against {with_winner} matches with a winner; {wins[2]} games played against {games} closed matches times two"))

    bad = ids("""SELECT DISTINCT e.match_id FROM match_events e LEFT JOIN matches m ON m.match_id = e.match_id
                 WHERE e.match_id IS NOT NULL AND m.match_id IS NULL AND e.kind NOT IN ('join_rejected', 'auth_failed')""")
    checks.append(check("Events belong to real matches", "Every logged event points at a match that exists.", len(bad), bad))
    bad = ids("SELECT DISTINCT w.match_id FROM net_windows w LEFT JOIN matches m ON m.match_id = w.match_id WHERE m.match_id IS NULL")
    checks.append(check("Reports belong to real matches", "Every phone report points at a match that exists.", len(bad), bad))
    bad = ids(f"SELECT match_id FROM matches WHERE status = 'ACTIVE' AND fight_started_at IS NOT NULL AND fight_started_at < ?", scope.now - STALE_FIGHT_SECONDS)
    checks.append(check("No fight stays open forever", "Housekeeping closes abandoned fights, so running fights are really running.", len(bad), bad))

    # Reports that can't be physically true
    bad = ids("""SELECT DISTINCT match_id FROM net_windows WHERE ticks > active_secs * 60 * 1.1 + 15""")
    checks.append(check("Phones can't outrun the clock", "No report claims more than 60 ticks a second of fight time, a sign its counters or its time are wrong.", len(bad), bad))
    bad = ids("""SELECT DISTINCT match_id FROM net_windows WHERE stall_ms > (secs * 1000 + 100) OR live_stall_ms > stall_ms + 1 OR live_ticks > ticks OR live_frames > frames""")
    checks.append(check("Parts fit inside wholes", "Stall time fits in its report, and in round counts never exceed totals.", len(bad), bad))
    bad = ids("""SELECT match_id FROM net_windows GROUP BY match_id, role, segment, seq, player_id HAVING COUNT(*) > 1""")
    checks.append(check("Reports aren't counted twice", "No phone report appears twice, which would inflate every sum.", len(bad), bad, warn_only=True))

    # Independent clocks: the server's idea of how long a fight lasted against what the phones report
    fights = [dict(r) for r in conn.execute(
        "SELECT match_id, fight_started_at, ended_at, paused_secs, status, p1_id, p2_id FROM matches WHERE fight_started_at IS NOT NULL AND ended_at IS NOT NULL AND status <> 'ACTIVE'")]
    secs: Dict[Tuple[str, str], float] = defaultdict(float)
    for r in conn.execute("SELECT match_id, role, SUM(active_secs) AS s FROM net_windows GROUP BY match_id, role"):
        secs[(r["match_id"], r["role"])] = r["s"] or 0
    missing, partial, over, covered = [], [], [], []
    for f in fights:
        length = max(0.0, f["ended_at"] - f["fight_started_at"] - (f["paused_secs"] or 0))
        if length < 2:
            continue
        for role in ("p1", "p2"):
            c = secs[(f["match_id"], role)] / length
            covered.append(c)
            if c == 0:
                missing.append(f["match_id"])
            elif c < MIN_COVERAGE:
                partial.append(f["match_id"])
            elif c > 1.15:
                over.append(f["match_id"])
    checks.append(check("Phone reports don't exceed the fight", "Reported fight time never runs well past the server's own clock, which would mean counting twice.", len(over), over))
    checks.append(check("Phones report the fights they play", "Each phone reported something for every fight. A phone can die before reporting, so a few are expected.", len(set(missing)), set(missing), warn_only=True,
                        detail=None if not covered else f"Across {len(covered)} phones in fights, median coverage {percentile(covered, 0.5) * 100:.0f}%"))
    checks.append(check("Phones report most of each fight", "Each phone covered at least half the fight it played, or its numbers aren't judged. A crash or a dropped final report causes this.", len(set(partial)), set(partial), warn_only=True))

    desync_reports = defaultdict(set)
    for r in conn.execute("SELECT match_id, segment, role, data FROM match_events WHERE kind = 'desync'"):
        desync_reports[(r["match_id"], r["segment"], r["data"])].add(r["role"])
    one_sided = [k[0] for k, v in desync_reports.items() if len(v) < 2]
    checks.append(check("Both phones see each desync", "A desync reported by one phone alone may be a lost message or a tampered client.", len(one_sided), one_sided, warn_only=True))
    return checks


def tab_quality(conn: sqlite3.Connection, scope: Scope, writer_health: Optional[dict] = None) -> List[dict]:
    checks = data_quality_checks(conn, scope)
    first_event = conn.execute("SELECT MIN(at) FROM match_events").fetchone()[0]
    legacy = conn.execute("SELECT COUNT(*) FROM matches WHERE fight_started_at IS NULL AND room_state LIKE '%\"seed\": %' AND room_state NOT LIKE '%\"seed\": null%'").fetchone()[0]
    tables = []
    for name in ("matches", "match_events", "net_windows", "server_samples", "players", "replays"):
        tables.append({"table": name, "rows": conn.execute(f"SELECT COUNT(*) FROM {name}").fetchone()[0]})
    health = writer_health or {}
    return [
        section("Do the numbers hold up",
                {"type": "checks", "items": checks, "source": BOTH, "title": "Consistency checks",
                 "why": "Facts that must be true if the data is right, most comparing records written independently. These always cover all time. A failure means a number elsewhere may be wrong: investigate before relying on it. A warning is expected now and then."}),
        section("The log itself",
                kpis(
                    kpi("Logging since", first_event, "time", why="The first event in the log. Fights before this have no timeline, and aren't counted anywhere in this panel."),
                    kpi("Old fights not counted", legacy, why="Fights from before the fight log existed. They had no start time or reports, so including them would skew every rate."),
                    kpi("Rows written since restart", health.get("written"), why="By the background writer, since the server last started."),
                    kpi("Rows dropped since restart", health.get("dropped"), why="The writer's queue was full and a row was thrown away rather than slowing a fight. Should stay at zero."),
                    kpi("Write errors since restart", health.get("write_errors"), why="Rows the database refused. Should stay at zero."),
                    kpi("Phone reports refused", health.get("windows_rejected"), why="Past the limit of 30 a minute from one phone. Should stay at zero; more means a client misbehaving."),
                    strip=True),
                table("What is stored", [("table", "Table", "text"), ("rows", "Rows", "count")], tables,
                      why="matches: one per challenge. match_events: each match's timeline. net_windows: phone reports, about one per 10s per phone. server_samples: one a minute. players: everyone who has opened a match. replays: only the latest 500 are kept.",
                      view=bars_view("table", "rows"))),
        section("",
                {"type": "text", "title": "How to read this panel", "items": [
                    "Server means the game server measured it, so a phone can't lose or misreport it.",
                    "Phones means phones reported it. It's lost if a phone dies before its next report, which is why the fight log shows how much of each fight was reported.",
                    f"With fewer than {LOW_SAMPLE} fights in a range, a note at the top of the page says so. With more, any number resting on fewer than {LOW_SAMPLE} samples is marked as a small sample. Percentages from a handful of fights swing wildly; don't decide anything from them alone.",
                    "A fight is a match where both heroes were locked. Fight time leaves out time the bout stood frozen with a player gone or away. Your own fights are hidden unless you include them.",
                ]}),
    ]


# =========================================================================
# EXPORTS
# =========================================================================

EXPORTS = {
    "fights": ("""SELECT match_id, status, finish_reason, winner_id, chat_id, rematch_of, build, created_at, started_at, fight_started_at, ended_at, paused_secs, segment,
                         p1_id, p1_name, p1_hero, p1_control, p1_rounds, p2_id, p2_name, p2_hero, p2_control, p2_rounds, stage, creator_id, creator_name, opponent_id, opponent_name
                  FROM matches WHERE created_at >= ? AND created_at <= ? ORDER BY created_at""", True),
    "events": ("SELECT * FROM match_events WHERE at >= ? AND at <= ? ORDER BY at", True),
    "windows": ("SELECT * FROM net_windows WHERE received_at >= ? AND received_at <= ? ORDER BY received_at", True),
    "server": ("SELECT * FROM server_samples WHERE at >= ? AND at <= ? ORDER BY at", True),
    "players": ("SELECT * FROM players ORDER BY first_seen_at", False),
}
# Names come from players. A spreadsheet would run one that starts like a formula, so those get a leading quote.
FORMULA_STARTS = ("=", "+", "-", "@", "\t", "\r")


def safe_cell(value: Any) -> Any:
    return "'" + value if isinstance(value, str) and value.startswith(FORMULA_STARTS) else value


def export_rows(conn: sqlite3.Connection, name: str, scope: Scope) -> Tuple[List[str], List[list]]:
    sql, ranged = EXPORTS[name]
    cursor = conn.execute(sql, (scope.since, scope.until) if ranged else ())
    columns = [c[0] for c in cursor.description]
    return columns, [[safe_cell(v) for v in row] for row in cursor]


TABS = {"overview": tab_overview, "funnel": tab_funnel, "netcode": tab_netcode, "devices": tab_devices, "reliability": tab_reliability,
        "server": tab_server, "balance": tab_balance, "players": tab_players, "fights": tab_fights, "quality": tab_quality}


def scope_summary(conn: sqlite3.Connection, scope: Scope) -> dict:
    hidden = 0
    if not scope.include_admin:
        hidden = conn.execute("""SELECT COUNT(*) FROM matches WHERE fight_started_at IS NOT NULL AND fight_started_at >= ? AND fight_started_at <= ?
                                 AND (p1_id = ? OR p2_id = ?)""", (scope.since, scope.until, scope.admin_id, scope.admin_id)).fetchone()[0]
    cte, params = scope.fights_cte()
    return {"since": scope.since, "until": scope.until, "days": scope.days, "tz_minutes": scope.tz_minutes, "include_admin": scope.include_admin,
            "can_hide_admin": bool(scope.admin_id), "hidden_fights": hidden, "fights_in_range": conn.execute(f"{cte} SELECT COUNT(*) FROM f", params).fetchone()[0],
            "generated_at": scope.now, "low_sample": LOW_SAMPLE}
