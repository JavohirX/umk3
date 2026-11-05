"""
Immortal Combat - Fight log writer

Everything the fight log stores goes through here, and nothing here may slow a fight down: the game server is one
event loop relaying inputs, and a disk write on it would add the very jitter the log is there to measure. So logging
only puts a row on a queue; a background thread writes the queue out in batches about once a second. If the queue
ever fills, rows are dropped and counted (the admin panel's data quality page shows the count), never waited for.

What phones report is untrusted input: every field is checked against its type and a believable range and stored
as NULL if it fails, so a broken or tampered client can't poison the averages.
"""

import asyncio
import atexit
import json
import logging
import math
import os
import queue
import re
import threading
import time
from typing import Any, Callable, Dict, List, Optional

import server.db as db

QUEUE_LIMIT = 100_000
BATCH_SECONDS = 1.0
BATCH_ROWS = 2000

LOOP_PROBE_SECONDS = 0.25
SAMPLE_SECONDS = 60


class Telemetry:
    def __init__(self):
        self._queue: queue.Queue = queue.Queue(maxsize=QUEUE_LIMIT)
        self._thread: Optional[threading.Thread] = None
        self._lock = threading.Lock()
        self.started_at = time.time()
        self.queued = 0
        self.written = 0
        self.dropped = 0
        self.write_errors = 0
        self.windows_rejected = 0
        self.queue_peak = 0        # since the last server sample
        self.write_peak_ms = 0.0   # since the last server sample
        # Relay traffic since the last server sample (only the event loop touches these)
        self.relay_msgs = 0
        self.relay_bytes = 0
        self.relay_send_ms_sum = 0.0
        self.relay_send_max_ms = 0.0

    # ----- logging: never blocks, never raises -----

    def event(self, event_kind: str, /, match_id: Optional[str] = None, player_id: Optional[str] = None,
              role: Optional[str] = None, segment: Optional[int] = None, at: Optional[float] = None, **data):
        """One line on a match's timeline (see the kinds listed in README, section 5). data may hold any other key."""
        try:
            self._put("INSERT INTO match_events (match_id, at, kind, player_id, role, segment, data) VALUES (?, ?, ?, ?, ?, ?, ?)",
                      (match_id, time.time() if at is None else at, event_kind, player_id, role, segment,
                       json.dumps(data, separators=(",", ":")) if data else None))
        except Exception as e:
            logging.warning(f"Fight log: could not queue {event_kind}: {e}")

    def net_window(self, match_id: str, player_id: str, role: str, client: dict, build: str, window: dict,
                   at: Optional[float] = None):
        """A phone's cleaned stats report (clean_window)."""
        try:
            row = {**window, "match_id": match_id, "player_id": player_id, "role": role, "build": build,
                   "received_at": time.time() if at is None else at, "platform": client.get("platform"),
                   "os": client.get("os"), "model": client.get("model"), "perf_class": client.get("perf_class")}
            columns = ", ".join(row)
            marks = ", ".join("?" * len(row))
            self._put(f"INSERT INTO net_windows ({columns}) VALUES ({marks})", tuple(row.values()))
        except Exception as e:
            logging.warning(f"Fight log: could not queue a net window: {e}")

    def player_seen(self, player_id: str, name: str, client: dict, at: Optional[float] = None):
        now = time.time() if at is None else at
        self._put("""
            INSERT INTO players (player_id, name, first_seen_at, last_seen_at, platform, os, model, perf_class)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(player_id) DO UPDATE SET
                name = excluded.name, last_seen_at = excluded.last_seen_at,
                platform = COALESCE(excluded.platform, players.platform), os = COALESCE(excluded.os, players.os),
                model = COALESCE(excluded.model, players.model), perf_class = COALESCE(excluded.perf_class, players.perf_class)
        """, (player_id, name, now, now, client.get("platform"), client.get("os"), client.get("model"), client.get("perf_class")))

    def server_sample(self, sample: dict):
        columns = ", ".join(sample)
        marks = ", ".join("?" * len(sample))
        self._put(f"INSERT OR REPLACE INTO server_samples ({columns}) VALUES ({marks})", tuple(sample.values()))

    def _put(self, sql: str, params: tuple):
        """Everything logged comes through here, on the game's event loop: whatever goes wrong stays here."""
        try:
            self._ensure_thread()
            self._queue.put_nowait((sql, params))
            self.queued += 1
            self.queue_peak = max(self.queue_peak, self._queue.qsize())
        except queue.Full:
            self.dropped += 1
        except Exception as e:
            self.dropped += 1
            logging.warning(f"Fight log: a row was lost: {e}")

    # ----- the writer thread -----

    def _ensure_thread(self):
        if self._thread is not None:
            return
        with self._lock:
            if self._thread is None:
                self._thread = threading.Thread(target=self._run, name="fight-log", daemon=True)
                self._thread.start()
                atexit.register(self.flush)

    def _run(self):
        while True:
            batch: List[tuple] = []
            waiters: List[threading.Event] = []
            self._collect(self._queue.get(), batch, waiters)
            deadline = time.monotonic() + BATCH_SECONDS
            while not waiters and len(batch) < BATCH_ROWS:
                left = deadline - time.monotonic()
                if left <= 0:
                    break
                try:
                    self._collect(self._queue.get(timeout=left), batch, waiters)
                except queue.Empty:
                    break
            self._write(batch)
            for waiter in waiters:
                waiter.set()

    @staticmethod
    def _collect(item, batch: list, waiters: list):
        if isinstance(item, threading.Event):
            waiters.append(item)
        else:
            batch.append(item)

    def _write(self, batch: List[tuple]):
        if not batch:
            return
        started = time.perf_counter()
        try:
            conn = db.get_db_connection()
            try:
                # No disk sync per commit: the database stays consistent, and a power cut costs the last moments of
                # log at worst. This connection only ever writes the log; the game's own writes keep their settings.
                conn.execute("PRAGMA synchronous=NORMAL")
                for sql, params in batch:
                    try:
                        conn.execute(sql, params)
                        self.written += 1
                    except Exception as e:
                        self.write_errors += 1
                        logging.warning(f"Fight log: a row was refused: {e}")
                conn.commit()
            finally:
                conn.close()
        except Exception as e:
            self.write_errors += len(batch)
            logging.warning(f"Fight log: a batch of {len(batch)} rows was lost: {e}")
        self.write_peak_ms = max(self.write_peak_ms, (time.perf_counter() - started) * 1000)

    def flush(self, timeout: float = 5.0) -> bool:
        """Waits until everything logged so far is in the database (shutdown and tests)."""
        if self._thread is None:
            return True
        done = threading.Event()
        try:
            self._queue.put(done, timeout=timeout)
        except queue.Full:
            return False
        return done.wait(timeout)

    def health(self) -> dict:
        return {"started_at": self.started_at, "queued": self.queued, "written": self.written, "dropped": self.dropped,
                "write_errors": self.write_errors, "windows_rejected": self.windows_rejected,
                "queue_now": self._queue.qsize()}


telemetry = Telemetry()


# =========================================================================
# CLEANING WHAT PHONES REPORT
# =========================================================================

def _number(value: Any, high: float, low: float = 0) -> Optional[float]:
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        return None
    if not math.isfinite(value) or not low <= value <= high:
        return None
    return value


def _text(value: Any, limit: int) -> Optional[str]:
    return value[:limit] if isinstance(value, str) and value else None


def _hist(value: Any, length: int) -> Optional[str]:
    """A histogram of `length` counts as JSON, or None if it isn't exactly that."""
    if not isinstance(value, list) or len(value) != length:
        return None
    counts = [_number(x, 1e7) for x in value]
    return None if any(c is None or c != int(c) for c in counts) else json.dumps([int(c) for c in counts], separators=(",", ":"))


# A believable ceiling for each number in a stats report. A report covers at most a few minutes in practice, but a
# long pause counts into its wall clock, so the time fields allow for the longest a match can stay open.
_DAY_MS = 86_400_000
_MILLION = 1_000_000
WINDOW_NUMBERS = {
    "segment": 1000, "seq": _MILLION, "secs": 86_400, "paused_ms": _DAY_MS, "hidden_ms": _DAY_MS, "live_secs": 86_400,
    "ticks": _MILLION, "live_ticks": _MILLION, "setup_ms": 600_000,
    "frames": _MILLION, "frame_ms_sum": _DAY_MS, "max_frame_ms": _DAY_MS, "slow_frames": _MILLION,
    "live_frames": _MILLION, "live_slow_frames": _MILLION,
    "tick_ms_sum": _DAY_MS, "work_ms_sum": _DAY_MS, "max_work_ms": _DAY_MS,
    "paints_skipped": _MILLION, "catch_up_frames": _MILLION,
    "stalls": _MILLION, "stall_ms": _DAY_MS, "max_stall_ms": _DAY_MS,
    "live_stalls": _MILLION, "live_stall_ms": _DAY_MS, "load_wait_ms": _DAY_MS,
    "stall_freezes_live": _MILLION, "hitch_freezes_live": _MILLION, "freeze_live_ms": _DAY_MS, "freezes_other": _MILLION,
    "delay": 64, "delay_min": 64, "delay_max": 64, "peer_rtt": 600_000, "server_rtt": 600_000,
    "rollbacks": _MILLION, "rollback_ticks": _MILLION, "max_rollback": 10_000, "rollback_misses": _MILLION,
    "predict_sum": 1e9, "saves": _MILLION, "save_ms_sum": _DAY_MS, "loads": _MILLION, "load_ms_sum": _DAY_MS,
    "resim_ms_sum": _DAY_MS, "inputs_udp": _MILLION, "inputs_tcp": _MILLION, "late_inputs": _MILLION,
    "ice_failures": 1000, "loop_errors": _MILLION,
}
# Lengths match FRAME_BUCKETS_MS, STALL_BUCKETS_MS and MAX_INPUT_DELAY in the client
WINDOW_HISTOGRAMS = {"live_frame_hist": 7, "live_stall_hist": 5, "live_delay_hist": 16}
WINDOW_TEXT = {"reason": 16, "ice_state": 16, "ice_path": 24, "ice_local": 40, "ice_remote": 40}
MAX_FREEZES_PER_REPORT = 20


def clean_window(data: dict) -> dict:
    """The fields of a net_stats message worth keeping, each checked; active_secs is worked out here."""
    window: Dict[str, Any] = {name: _number(data.get(name), high) for name, high in WINDOW_NUMBERS.items()}
    window.update({name: _hist(data.get(name), length) for name, length in WINDOW_HISTOGRAMS.items()})
    window.update({name: _text(data.get(name), limit) for name, limit in WINDOW_TEXT.items()})
    # These two can be negative (the opponent's input can arrive after we ran its tick; we can trail them)
    window["ticks_ahead"] = _number(data.get("ticks_ahead"), 100_000, -100_000)
    window["lead_sum"] = _number(data.get("lead_sum"), 1e9, -1e9)
    window["lead_min"] = _number(data.get("lead_min"), 100_000, -100_000)
    window["p2p"] = 1 if data.get("p2p") is True else 0 if data.get("p2p") is False else None
    secs = window["secs"]
    window["active_secs"] = None if secs is None else max(
        0.0, secs - (window["paused_ms"] or 0) / 1000 - (window["hidden_ms"] or 0) / 1000)
    return window


def clean_freezes(freezes: Any) -> List[dict]:
    """The individual freezes a report lists; ago_ms says how long before the report each one began."""
    if not isinstance(freezes, list):
        return []
    out = []
    for f in freezes[:MAX_FREEZES_PER_REPORT]:
        if not isinstance(f, dict) or f.get("kind") not in ("stall", "hitch"):
            continue
        ms, ago, tick = _number(f.get("ms"), _DAY_MS), _number(f.get("ago_ms"), _DAY_MS), _number(f.get("tick"), 1e9)
        if ms is None or ago is None:
            continue
        out.append({"kind": f["kind"], "ms": round(ms), "ago_ms": ago, "tick": None if tick is None else int(tick),
                    "live": f.get("live") is True, "open": f.get("open") is True})
    return out


_TELEGRAM_ANDROID = re.compile(r"Telegram-Android/[\w.]+ \(([^;)]+);\s*Android ([\d.]+);[^;)]*;\s*(LOW|AVERAGE|HIGH)\)")
_ANDROID = re.compile(r"Android ([\d.]+)(?:;\s*([^;)]+?))?(?:\s+Build/[^;)]*)?(?:;[^)]*)?\)")
_IOS = re.compile(r"(iPhone|iPad)[^)]*?OS (\d+)")


def describe_device(user_agent: Optional[str]) -> dict:
    """
    OS, model and (from Telegram for Android, which adds them to its web view's user agent) the real model and
    device class. Chrome's reduced user agents give the model as "K", which says nothing, so that becomes None.
    """
    ua = user_agent or ""
    match = _TELEGRAM_ANDROID.search(ua)
    if match:
        return {"os": f"Android {match.group(2)}", "model": match.group(1).strip()[:48], "perf_class": match.group(3)}
    match = _ANDROID.search(ua)
    if match:
        model = (match.group(2) or "").strip()
        return {"os": f"Android {match.group(1)}", "model": model[:48] if len(model) > 1 else None, "perf_class": None}
    match = _IOS.search(ua)
    if match:
        return {"os": f"iOS {match.group(2)}", "model": match.group(1), "perf_class": None}
    for needle, name in (("Windows", "Windows"), ("Macintosh", "macOS"), ("CrOS", "ChromeOS"), ("Linux", "Linux")):
        if needle in ua:
            return {"os": name, "model": None, "perf_class": None}
    return {"os": None, "model": None, "perf_class": None}


def clean_client(client: Any) -> dict:
    """What a phone says about itself when it joins, reduced to known fields."""
    if not isinstance(client, dict):
        return {}
    platform = _text(client.get("platform"), 20)
    ua = _text(client.get("ua"), 400)
    return {
        "platform": re.sub(r"[^a-z0-9_]", "", platform.lower()) or None if platform else None,
        "tg_version": _text(client.get("tg_version"), 16),
        "cores": _number(client.get("cores"), 1024),
        "memory_gb": _number(client.get("memory_gb"), 1024),
        "net": _text(client.get("net"), 16),
        "screen": _text(client.get("screen"), 16),
        "dpr": _number(client.get("dpr"), 16),
        "boot_ms": _number(client.get("boot_ms"), 3_600_000),
        "ua": ua,
        **describe_device(ua),
    }


# =========================================================================
# THE SERVER'S OWN HEALTH
# =========================================================================

def _current_rss_mb() -> Optional[float]:
    try:
        with open("/proc/self/statm") as f:
            return int(f.read().split()[1]) * os.sysconf("SC_PAGE_SIZE") / 1_048_576
    except (OSError, ValueError, IndexError, AttributeError):
        return None


def _database_mb() -> Optional[float]:
    try:
        size = os.path.getsize(db.DB_PATH)
        if os.path.exists(db.DB_PATH + "-wal"):
            size += os.path.getsize(db.DB_PATH + "-wal")
        return size / 1_048_576
    except OSError:
        return None


class ServerSampler:
    """
    Once a minute, one row on how the server is doing. Event loop lag is the number that matters most: it's how late
    a timer that should fire now actually fires, so it's also how long every relayed input was held up. A probe every
    quarter second measures it from inside the loop.
    """

    def __init__(self, build: Callable[[], str], live_counts: Callable[[], dict]):
        self.build = build
        self.live_counts = live_counts
        self.started_at = time.time()
        self.lags: List[float] = []

    async def run(self):
        last_at = time.monotonic()
        last_cpu = time.process_time()
        try:
            while True:
                expected = time.perf_counter() + LOOP_PROBE_SECONDS
                await asyncio.sleep(LOOP_PROBE_SECONDS)
                self.lags.append(max(0.0, (time.perf_counter() - expected) * 1000))
                elapsed = time.monotonic() - last_at
                if elapsed >= SAMPLE_SECONDS:
                    cpu = time.process_time()
                    self.write_sample(elapsed, cpu - last_cpu)
                    last_at, last_cpu = time.monotonic(), cpu
        except asyncio.CancelledError:
            pass

    def write_sample(self, elapsed: float, cpu_secs: float):
        try:
            lags = sorted(self.lags)
            self.lags = []
            t = telemetry
            sample = {
                "at": time.time(), "build": self.build(), "uptime_secs": round(time.time() - self.started_at), "secs": round(elapsed, 1),
                "lag_p50_ms": round(lags[len(lags) // 2], 2) if lags else None,
                "lag_p99_ms": round(lags[min(len(lags) - 1, int(len(lags) * 0.99))], 2) if lags else None,
                "lag_max_ms": round(lags[-1], 2) if lags else None,
                "cpu_pct": round(cpu_secs / elapsed * 100, 1) if elapsed > 0 else None,
                "rss_mb": _current_rss_mb(),
                "load1": os.getloadavg()[0] if hasattr(os, "getloadavg") else None,
                "db_mb": _database_mb(),
                **self.live_counts(),
                "relay_msgs": t.relay_msgs, "relay_kb": round(t.relay_bytes / 1024, 1),
                "relay_send_max_ms": round(t.relay_send_max_ms, 2), "relay_send_ms_sum": round(t.relay_send_ms_sum, 1),
                "log_queue_max": t.queue_peak, "log_write_max_ms": round(t.write_peak_ms, 1), "log_dropped": t.dropped,
            }
            t.relay_msgs = t.relay_bytes = 0
            t.relay_send_ms_sum = t.relay_send_max_ms = 0.0
            t.queue_peak = 0
            t.write_peak_ms = 0.0
            t.server_sample(sample)
        except Exception as e:
            logging.warning(f"Fight log: server sample failed: {e}")
