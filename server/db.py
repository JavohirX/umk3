"""
Immortal Combat - Local SQLite Database & Leaderboard Engine
Manages matches, player stats, group-isolated leaderboards and match replays.
"""

import json
import sqlite3
import os
import time
from typing import Optional, Dict, Any, List

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "immortal_combat.db")

# How long an open challenge waits for someone to accept it. The creator is notified when it's accepted.
CHALLENGE_WINDOW_SECONDS = 600
# Replays kept on disk; older ones are pruned
REPLAYS_KEPT = 500

# Fighter names by hero id (the engine's select grid order)
HERO_NAMES = ["Scorpion", "Sub-Zero", "Kitana", "Shao Kahn", "Sonya", "Cyrax", "Liu Kang"]

# Columns added after the first release; init_db adds any that an older database lacks
MATCH_EXTRA_COLUMNS = {
    "room_state": "TEXT",          # JSON fight setup + score, so a restarted server can resume the bout
    "chat_instance": "TEXT",       # Telegram chat_instance of the chat an inline challenge was played in
    "message_chat_id": "TEXT",     # where the bot posted the challenge message, to edit it later
    "message_id": "INTEGER",
    "inline_message_id": "TEXT",   # the same for a challenge sent through inline mode
    "rematch_of": "TEXT",
    # The fight itself, for the fight log. started_at is when hero select began, and a match can finish (by
    # forfeit) without a fight ever starting, so fight_started_at is what says a fight happened.
    "fight_started_at": "REAL",    # both heroes locked and the versus screen sent to both phones
    "paused_secs": "REAL",         # time the bout stood frozen with a player gone or away
    "segment": "INTEGER",          # restarts of the bout so far (after a reconnect or a desync)
    "build": "TEXT",               # server build the fight started on
    "p1_id": "TEXT",
    "p2_id": "TEXT",
    "p1_name": "TEXT",
    "p2_name": "TEXT",
    "p1_hero": "INTEGER",
    "p2_hero": "INTEGER",
    "p1_control": "INTEGER",
    "p2_control": "INTEGER",
    "p1_rounds": "INTEGER",
    "p2_rounds": "INTEGER",
    "stage": "INTEGER",
}

# The room state fields that also live in their own column, so the fight log can query them
ROOM_STATE_COLUMNS = ("fight_started_at", "paused_secs", "segment", "build", "p1_id", "p2_id", "p1_name", "p2_name",
                      "p1_hero", "p2_hero", "p1_control", "p2_control", "p1_rounds", "p2_rounds", "stage")

# One row per stats report from a phone: how the last few seconds of a fight ran there (player/js/net_telemetry.js
# sends them, server/telemetry.py cleans them). Every counter covers that report's time only, so they add up.
NET_WINDOW_COLUMNS = {
    "match_id": "TEXT NOT NULL",
    "player_id": "TEXT",
    "role": "TEXT",
    "received_at": "REAL NOT NULL",
    "build": "TEXT",
    "platform": "TEXT",            # Telegram's name for the client: android, ios, tdesktop...
    "os": "TEXT",
    "model": "TEXT",
    "perf_class": "TEXT",          # Telegram for Android's own LOW / AVERAGE / HIGH device class
    "segment": "INTEGER",
    "seq": "INTEGER",              # numbers the reports of one bout segment, so a lost one shows
    "reason": "TEXT",              # what sent it: interval, restart, hidden, pagehide, final
    "secs": "REAL",                # wall clock the report covers...
    "paused_ms": "REAL",           # ...of which the bout stood frozen...
    "hidden_ms": "REAL",           # ...or the page wasn't on screen
    "active_secs": "REAL",         # secs less those two: the fight time everything below is measured over
    "live_secs": "REAL",           # active time inside a live round (not loading, intro or knockout)
    "ticks": "INTEGER",
    "live_ticks": "INTEGER",
    "setup_ms": "REAL",            # building the fight at the start of a segment
    "frames": "INTEGER",
    "frame_ms_sum": "REAL",
    "max_frame_ms": "REAL",
    "slow_frames": "INTEGER",      # frames over 50ms
    "live_frames": "INTEGER",
    "live_slow_frames": "INTEGER",
    "live_frame_hist": "TEXT",     # JSON counts, see FRAME_BUCKETS_MS in net_telemetry.js
    "tick_ms_sum": "REAL",         # simulating and drawing new ticks
    "work_ms_sum": "REAL",         # everything the fight did on the main thread
    "max_work_ms": "REAL",
    "paints_skipped": "INTEGER",
    "catch_up_frames": "INTEGER",
    "stalls": "INTEGER",           # waits for the opponent's input (not counting their loading screen)
    "stall_ms": "REAL",
    "max_stall_ms": "REAL",
    "live_stalls": "INTEGER",
    "live_stall_ms": "REAL",
    "live_stall_hist": "TEXT",     # JSON counts, see STALL_BUCKETS_MS in net_telemetry.js
    "load_wait_ms": "REAL",        # waiting for the opponent's phone to start the fight at all
    "stall_freezes_live": "INTEGER",  # in-round stalls of FREEZE_MS or more...
    "hitch_freezes_live": "INTEGER",  # ...and in-round single frames that long
    "freeze_live_ms": "REAL",
    "freezes_other": "INTEGER",    # freezes outside a live round (loading, intro, knockout)
    "delay": "INTEGER",
    "delay_min": "INTEGER",
    "delay_max": "INTEGER",
    "live_delay_hist": "TEXT",     # JSON: in-round ticks spent at each input delay (index = delay in ticks)
    "ticks_ahead": "REAL",
    "peer_rtt": "REAL",
    "server_rtt": "REAL",
    "rollbacks": "INTEGER",
    "rollback_ticks": "INTEGER",
    "max_rollback": "INTEGER",
    "rollback_misses": "INTEGER",
    "predict_sum": "INTEGER",      # sum over ticks of how far past the opponent's last input the tick ran
    "saves": "INTEGER",
    "save_ms_sum": "REAL",
    "loads": "INTEGER",
    "load_ms_sum": "REAL",
    "resim_ms_sum": "REAL",        # replaying ticks after a rollback
    "inputs_udp": "INTEGER",       # opponent inputs that reached us first over the WebRTC channel...
    "inputs_tcp": "INTEGER",       # ...or the WebSocket
    "late_inputs": "INTEGER",      # opponent inputs for a tick we had already run on a guess
    "lead_sum": "REAL",
    "lead_min": "REAL",
    "p2p": "INTEGER",
    "ice_state": "TEXT",
    "ice_path": "TEXT",
    "ice_local": "TEXT",
    "ice_remote": "TEXT",
    "ice_failures": "INTEGER",
    "loop_errors": "INTEGER",
}


def get_db_connection() -> sqlite3.Connection:
    """Creates a connection to the SQLite database with WAL mode and row factory."""
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH, timeout=10.0)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


def init_db():
    """Initializes database tables and indices."""
    with get_db_connection() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS matches (
                match_id TEXT PRIMARY KEY,
                chat_id TEXT NOT NULL,
                creator_id TEXT NOT NULL,
                creator_name TEXT NOT NULL,
                opponent_id TEXT,
                opponent_name TEXT,
                status TEXT NOT NULL DEFAULT 'WAITING',
                winner_id TEXT,
                finish_reason TEXT,
                created_at REAL NOT NULL,
                expires_at REAL NOT NULL,
                started_at REAL,
                ended_at REAL
            )
        """)
        existing = {row["name"] for row in conn.execute("PRAGMA table_info(matches)")}
        for column, sql_type in MATCH_EXTRA_COLUMNS.items():
            if column not in existing:
                conn.execute(f"ALTER TABLE matches ADD COLUMN {column} {sql_type}")

        conn.execute("""
            CREATE TABLE IF NOT EXISTS local_leaderboard (
                chat_id TEXT NOT NULL,
                user_id TEXT NOT NULL,
                username TEXT,
                first_name TEXT NOT NULL,
                wins INTEGER NOT NULL DEFAULT 0,
                losses INTEGER NOT NULL DEFAULT 0,
                draws INTEGER NOT NULL DEFAULT 0,
                games_played INTEGER NOT NULL DEFAULT 0,
                last_played_at REAL NOT NULL,
                PRIMARY KEY (chat_id, user_id)
            )
        """)

        # Telegram's chat_instance -> chat id, learned from button presses in chats the bot is in. Inline
        # challenges only know the chat_instance, so this lets their results join that group's leaderboard.
        conn.execute("""
            CREATE TABLE IF NOT EXISTS chat_instances (
                chat_instance TEXT PRIMARY KEY,
                chat_id TEXT NOT NULL,
                updated_at REAL NOT NULL
            )
        """)

        conn.execute("""
            CREATE TABLE IF NOT EXISTS replays (
                match_id TEXT PRIMARY KEY,
                created_at REAL NOT NULL,
                data BLOB NOT NULL
            )
        """)

        # The fight log. Append-only: rows are written by server/telemetry.py and never changed.
        # A match's timeline: what the server saw, plus discrete events the phones reported.
        conn.execute("""
            CREATE TABLE IF NOT EXISTS match_events (
                id INTEGER PRIMARY KEY,
                match_id TEXT,
                at REAL NOT NULL,
                kind TEXT NOT NULL,
                player_id TEXT,
                role TEXT,
                segment INTEGER,
                data TEXT
            )
        """)
        conn.execute("CREATE TABLE IF NOT EXISTS net_windows (id INTEGER PRIMARY KEY, match_id TEXT NOT NULL, received_at REAL NOT NULL)")
        existing = {row["name"] for row in conn.execute("PRAGMA table_info(net_windows)")}
        for column, sql_type in NET_WINDOW_COLUMNS.items():
            if column not in existing:
                conn.execute(f"ALTER TABLE net_windows ADD COLUMN {column} {sql_type}")

        # The server's own health, one row a minute
        conn.execute("""
            CREATE TABLE IF NOT EXISTS server_samples (
                at REAL PRIMARY KEY,
                build TEXT,
                uptime_secs REAL,
                secs REAL,
                lag_p50_ms REAL,
                lag_p99_ms REAL,
                lag_max_ms REAL,
                cpu_pct REAL,
                rss_mb REAL,
                load1 REAL,
                db_mb REAL,
                connections INTEGER,
                rooms INTEGER,
                live_fights INTEGER,
                players INTEGER,
                spectators INTEGER,
                relay_msgs INTEGER,
                relay_kb REAL,
                relay_send_max_ms REAL,
                relay_send_ms_sum REAL,
                log_queue_max INTEGER,
                log_write_max_ms REAL,
                log_dropped INTEGER
            )
        """)

        # Everyone who has opened a match, and the device they last did it from
        conn.execute("""
            CREATE TABLE IF NOT EXISTS players (
                player_id TEXT PRIMARY KEY,
                name TEXT,
                first_seen_at REAL NOT NULL,
                last_seen_at REAL NOT NULL,
                platform TEXT,
                os TEXT,
                model TEXT,
                perf_class TEXT
            )
        """)

        conn.execute("CREATE INDEX IF NOT EXISTS idx_matches_chat ON matches(chat_id)")
        conn.execute("CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status)")
        conn.execute("CREATE INDEX IF NOT EXISTS idx_matches_created ON matches(created_at)")
        conn.execute("CREATE INDEX IF NOT EXISTS idx_matches_fight ON matches(fight_started_at)")
        conn.execute("CREATE INDEX IF NOT EXISTS idx_matches_rematch ON matches(rematch_of)")
        conn.execute("CREATE INDEX IF NOT EXISTS idx_events_match ON match_events(match_id, at)")
        conn.execute("CREATE INDEX IF NOT EXISTS idx_events_kind ON match_events(kind, at)")
        conn.execute("CREATE INDEX IF NOT EXISTS idx_windows_match ON net_windows(match_id, role, segment, seq)")
        conn.execute("CREATE INDEX IF NOT EXISTS idx_windows_received ON net_windows(received_at)")
        conn.execute("CREATE INDEX IF NOT EXISTS idx_lb_chat_wins ON local_leaderboard(chat_id, wins DESC)")
        conn.execute("CREATE INDEX IF NOT EXISTS idx_chat_instances_chat ON chat_instances(chat_id)")
        conn.commit()


def create_match(match_id: str, chat_id: str, creator_id: str, creator_name: str, opponent_id: Optional[str] = None,
                 opponent_name: Optional[str] = None, timeout_seconds: int = CHALLENGE_WINDOW_SECONDS,
                 rematch_of: Optional[str] = None) -> Dict[str, Any]:
    """Creates a new open challenge that waits `timeout_seconds` for an opponent."""
    now = time.time()
    expires_at = now + timeout_seconds

    with get_db_connection() as conn:
        conn.execute("""
            INSERT INTO matches (match_id, chat_id, creator_id, creator_name, opponent_id, opponent_name, status,
                                 created_at, expires_at, rematch_of)
            VALUES (?, ?, ?, ?, ?, ?, 'WAITING', ?, ?, ?)
        """, (match_id, str(chat_id), str(creator_id), creator_name, str(opponent_id) if opponent_id else None,
              opponent_name, now, expires_at, rematch_of))
        conn.commit()

    return {
        "match_id": match_id,
        "chat_id": str(chat_id),
        "creator_id": str(creator_id),
        "creator_name": creator_name,
        "opponent_id": str(opponent_id) if opponent_id else None,
        "opponent_name": opponent_name,
        "status": "WAITING",
        "created_at": now,
        "expires_at": expires_at,
        "rematch_of": rematch_of,
    }


def get_match(match_id: str) -> Optional[Dict[str, Any]]:
    """Retrieves match details by match_id."""
    with get_db_connection() as conn:
        cur = conn.execute("SELECT * FROM matches WHERE match_id = ?", (match_id,))
        row = cur.fetchone()
        if row:
            return dict(row)
    return None


def join_match(match_id: str, user_id: str, user_name: str) -> Optional[Dict[str, Any]]:
    """Assigns the opponent to a waiting match and sets status to ACTIVE."""
    now = time.time()
    with get_db_connection() as conn:
        cur = conn.execute("SELECT * FROM matches WHERE match_id = ?", (match_id,))
        row = cur.fetchone()
        if not row:
            return None

        match = dict(row)
        if match["status"] != "WAITING":
            return None
        if now > match["expires_at"]:
            conn.execute("UPDATE matches SET status = 'CANCELLED', finish_reason = 'JOIN_TIMEOUT', ended_at = ? WHERE match_id = ?",
                         (now, match_id))
            conn.commit()
            return None
        if str(match["creator_id"]) == str(user_id):
            # Creator cannot challenge themselves as opponent
            return None

        # Check if match was restricted to a specific opponent
        if match["opponent_id"] and str(match["opponent_id"]) != str(user_id):
            return None

        conn.execute("""
            UPDATE matches
            SET opponent_id = ?, opponent_name = ?, status = 'ACTIVE', started_at = ?
            WHERE match_id = ?
        """, (str(user_id), user_name, now, match_id))
        conn.commit()

        match["opponent_id"] = str(user_id)
        match["opponent_name"] = user_name
        match["status"] = "ACTIVE"
        match["started_at"] = now
        return match


def cancel_match(match_id: str, reason: str = "JOIN_TIMEOUT") -> bool:
    """Cancels a match that timed out or was aborted before start."""
    now = time.time()
    with get_db_connection() as conn:
        cur = conn.execute("""
            UPDATE matches
            SET status = 'CANCELLED', finish_reason = ?, ended_at = ?
            WHERE match_id = ? AND status = 'WAITING'
        """, (reason, now, match_id))
        conn.commit()
        return cur.rowcount > 0


def leaderboard_chat_id(conn: sqlite3.Connection, match: Dict[str, Any]) -> str:
    """
    The leaderboard a match's result belongs to: its chat, or for an inline challenge (chat "inline") the chat
    it was opened in, when known - the group's id once learned, else a bucket for its chat_instance.
    """
    chat_id = str(match["chat_id"])
    chat_instance = match.get("chat_instance")
    if chat_id != "inline" or not chat_instance:
        return chat_id
    row = conn.execute("SELECT chat_id FROM chat_instances WHERE chat_instance = ?", (chat_instance,)).fetchone()
    return str(row["chat_id"]) if row else f"ci:{chat_instance}"


def finish_match(match_id: str, winner_id: Optional[str], finish_reason: str,
                 record_stats: bool = True) -> Optional[Dict[str, Any]]:
    """
    Finishes an active match, sets outcome, and updates local leaderboard.
    If finish_reason is 'BOTH_DISCONNECTED' or 'DRAW', winner_id is None and neither player gets a win.
    record_stats=False closes the match without touching the leaderboard (e.g. a stale match after a restart).
    """
    now = time.time()
    with get_db_connection() as conn:
        cur = conn.execute("SELECT * FROM matches WHERE match_id = ?", (match_id,))
        row = cur.fetchone()
        if not row:
            return None

        match = dict(row)
        if match["status"] in ("COMPLETED", "CANCELLED", "ABANDONED"):
            return match  # Already closed

        status = "COMPLETED" if winner_id or finish_reason == "DRAW" else "ABANDONED"
        conn.execute("""
            UPDATE matches
            SET status = ?, winner_id = ?, finish_reason = ?, ended_at = ?
            WHERE match_id = ?
        """, (status, str(winner_id) if winner_id else None, finish_reason, now, match_id))

        chat_id = leaderboard_chat_id(conn, match)
        creator_id = str(match["creator_id"])
        creator_name = match["creator_name"]
        opponent_id = str(match["opponent_id"]) if match["opponent_id"] else None
        opponent_name = match["opponent_name"] or "Opponent"

        # Update leaderboard only if match actually had two players
        if opponent_id and record_stats:
            if winner_id:
                winner_id_str = str(winner_id)
                loser_id_str = opponent_id if winner_id_str == creator_id else creator_id
                loser_name = opponent_name if winner_id_str == creator_id else creator_name
                winner_name = creator_name if winner_id_str == creator_id else opponent_name

                _record_player_stat(conn, chat_id, winner_id_str, winner_name, is_win=True)
                _record_player_stat(conn, chat_id, loser_id_str, loser_name, is_loss=True)
            else:
                # Both disconnected / Draw: records 1 game played for both, no wins or losses
                _record_player_stat(conn, chat_id, creator_id, creator_name, is_draw=True)
                _record_player_stat(conn, chat_id, opponent_id, opponent_name, is_draw=True)

        conn.commit()
        match["status"] = status
        match["winner_id"] = str(winner_id) if winner_id else None
        match["finish_reason"] = finish_reason
        match["ended_at"] = now
        match["leaderboard_chat_id"] = chat_id
        return match


def _record_player_stat(conn: sqlite3.Connection, chat_id: str, user_id: str, name: str, is_win: bool = False, is_loss: bool = False, is_draw: bool = False):
    """Internal helper to upsert player stats in the local leaderboard."""
    now = time.time()
    w = 1 if is_win else 0
    l = 1 if is_loss else 0
    d = 1 if is_draw else 0

    conn.execute("""
        INSERT INTO local_leaderboard (chat_id, user_id, first_name, wins, losses, draws, games_played, last_played_at)
        VALUES (?, ?, ?, ?, ?, ?, 1, ?)
        ON CONFLICT(chat_id, user_id) DO UPDATE SET
            first_name = excluded.first_name,
            wins = local_leaderboard.wins + ?,
            losses = local_leaderboard.losses + ?,
            draws = local_leaderboard.draws + ?,
            games_played = local_leaderboard.games_played + 1,
            last_played_at = ?
    """, (str(chat_id), str(user_id), name, w, l, d, now, w, l, d, now))


def _leaderboard_buckets(conn: sqlite3.Connection, chat_id: str) -> List[str]:
    """A chat's own leaderboard plus the inline-challenge buckets of chat_instances known to belong to it."""
    rows = conn.execute("SELECT chat_instance FROM chat_instances WHERE chat_id = ?", (str(chat_id),)).fetchall()
    return [str(chat_id)] + [f"ci:{r['chat_instance']}" for r in rows]


def _with_win_rate(d: Dict[str, Any]) -> Dict[str, Any]:
    gp = d["games_played"]
    d["win_rate"] = round((d["wins"] / gp) * 100, 1) if gp > 0 else 0.0
    return d


def get_local_leaderboard(chat_id: str, limit: int = 10) -> List[Dict[str, Any]]:
    """
    Returns the local leaderboard for a specific chat/group.
    Sorted by wins DESC, games_played DESC.
    """
    with get_db_connection() as conn:
        buckets = _leaderboard_buckets(conn, chat_id)
        marks = ",".join("?" * len(buckets))
        cur = conn.execute(f"""
            SELECT user_id, MAX(first_name) AS first_name, MAX(username) AS username,
                   SUM(wins) AS wins, SUM(losses) AS losses, SUM(draws) AS draws,
                   SUM(games_played) AS games_played, MAX(last_played_at) AS last_played_at
            FROM local_leaderboard
            WHERE chat_id IN ({marks})
            GROUP BY user_id
            ORDER BY wins DESC, games_played DESC, (SUM(wins) * 1.0 / MAX(SUM(games_played), 1)) DESC
            LIMIT ?
        """, (*buckets, limit))
        result = []
        for rank, r in enumerate(cur.fetchall(), start=1):
            d = _with_win_rate(dict(r))
            d["rank"] = rank
            result.append(d)
        return result


def get_user_stats(chat_id: str, user_id: str) -> Optional[Dict[str, Any]]:
    """Retrieves player statistics in a specific chat."""
    with get_db_connection() as conn:
        cur = conn.execute("""
            SELECT * FROM local_leaderboard
            WHERE chat_id = ? AND user_id = ?
        """, (str(chat_id), str(user_id)))
        row = cur.fetchone()
        if row:
            return _with_win_rate(dict(row))
    return None


def get_user_totals(user_id: str) -> Optional[Dict[str, Any]]:
    """A player's record summed over every chat they have fought in."""
    with get_db_connection() as conn:
        row = conn.execute("""
            SELECT user_id, MAX(first_name) AS first_name, SUM(wins) AS wins, SUM(losses) AS losses,
                   SUM(draws) AS draws, SUM(games_played) AS games_played
            FROM local_leaderboard WHERE user_id = ? GROUP BY user_id
        """, (str(user_id),)).fetchone()
        return _with_win_rate(dict(row)) if row else None


# -------------------------------------------------------------------------
# Live match state, challenge messages and chat instances
# -------------------------------------------------------------------------

def save_room_state(match_id: str, state: Dict[str, Any]):
    """Stores the fight setup and score, so a restarted server can put both players back into the bout."""
    columns = ", ".join(f"{column} = ?" for column in ROOM_STATE_COLUMNS)
    with get_db_connection() as conn:
        conn.execute(f"UPDATE matches SET room_state = ?, {columns} WHERE match_id = ?",
                     (json.dumps(state), *(state.get(column) for column in ROOM_STATE_COLUMNS), match_id))
        conn.commit()


def load_room_state(match: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    try:
        return json.loads(match["room_state"]) if match.get("room_state") else None
    except (TypeError, ValueError):
        return None


def set_challenge_message(match_id: str, chat_id: str, message_id: int):
    with get_db_connection() as conn:
        conn.execute("UPDATE matches SET message_chat_id = ?, message_id = ? WHERE match_id = ?",
                     (str(chat_id), int(message_id), match_id))
        conn.commit()


def set_inline_message(match_id: str, inline_message_id: str):
    with get_db_connection() as conn:
        conn.execute("UPDATE matches SET inline_message_id = ? WHERE match_id = ?", (inline_message_id, match_id))
        conn.commit()


def set_match_chat_instance(match_id: str, chat_instance: str):
    """Records which chat an inline challenge was opened in (only the first one counts)."""
    with get_db_connection() as conn:
        conn.execute("UPDATE matches SET chat_instance = ? WHERE match_id = ? AND chat_instance IS NULL",
                     (chat_instance, match_id))
        conn.commit()


def remember_chat_instance(chat_instance: str, chat_id: str):
    """Maps a chat_instance to its chat id, from a button pressed under a message the bot sent there."""
    if not chat_instance or not chat_id:
        return
    with get_db_connection() as conn:
        conn.execute("""
            INSERT INTO chat_instances (chat_instance, chat_id, updated_at) VALUES (?, ?, ?)
            ON CONFLICT(chat_instance) DO UPDATE SET chat_id = excluded.chat_id, updated_at = excluded.updated_at
        """, (str(chat_instance), str(chat_id), time.time()))
        conn.commit()


def count_active_matches() -> int:
    with get_db_connection() as conn:
        return conn.execute("SELECT COUNT(*) FROM matches WHERE status = 'ACTIVE'").fetchone()[0]


def close_stale_matches(active_idle_seconds: float, live_match_ids: List[str]) -> Dict[str, List[str]]:
    """
    Housekeeping after restarts: waiting challenges past their window become CANCELLED, and ACTIVE matches
    that started more than `active_idle_seconds` ago with nobody connected become ABANDONED without stats.
    """
    now = time.time()
    closed = {"cancelled": [], "abandoned": []}
    with get_db_connection() as conn:
        for row in conn.execute("SELECT match_id FROM matches WHERE status = 'WAITING' AND expires_at < ?", (now,)):
            if row["match_id"] not in live_match_ids:
                closed["cancelled"].append(row["match_id"])
        for row in conn.execute("SELECT match_id FROM matches WHERE status = 'ACTIVE' AND COALESCE(started_at, created_at) < ?",
                                (now - active_idle_seconds,)):
            if row["match_id"] not in live_match_ids:
                closed["abandoned"].append(row["match_id"])
        for match_id in closed["cancelled"]:
            conn.execute("UPDATE matches SET status = 'CANCELLED', finish_reason = 'JOIN_TIMEOUT', ended_at = ? "
                         "WHERE match_id = ? AND status = 'WAITING'", (now, match_id))
        for match_id in closed["abandoned"]:
            conn.execute("UPDATE matches SET status = 'ABANDONED', finish_reason = 'STALE', ended_at = ? "
                         "WHERE match_id = ? AND status = 'ACTIVE'", (now, match_id))
        conn.commit()
    return closed


# -------------------------------------------------------------------------
# Replays
# -------------------------------------------------------------------------

def save_replay(match_id: str, data: bytes):
    with get_db_connection() as conn:
        conn.execute("INSERT OR REPLACE INTO replays (match_id, created_at, data) VALUES (?, ?, ?)",
                     (match_id, time.time(), sqlite3.Binary(data)))
        conn.execute("""
            DELETE FROM replays WHERE match_id NOT IN (
                SELECT match_id FROM replays ORDER BY created_at DESC LIMIT ?
            )
        """, (REPLAYS_KEPT,))
        conn.commit()


def get_replay(match_id: str) -> Optional[bytes]:
    with get_db_connection() as conn:
        row = conn.execute("SELECT data FROM replays WHERE match_id = ?", (match_id,)).fetchone()
        return bytes(row["data"]) if row else None


# Initialize DB on module import
init_db()
