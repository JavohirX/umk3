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

# Columns added after the first release; init_db adds any that an older database lacks
MATCH_EXTRA_COLUMNS = {
    "room_state": "TEXT",          # JSON fight setup + score, so a restarted server can resume the bout
    "chat_instance": "TEXT",       # Telegram chat_instance of the chat an inline challenge was played in
    "message_chat_id": "TEXT",     # where the bot posted the challenge message, to edit it later
    "message_id": "INTEGER",
    "inline_message_id": "TEXT",   # the same for a challenge sent through inline mode
    "rematch_of": "TEXT",
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

        conn.execute("CREATE INDEX IF NOT EXISTS idx_matches_chat ON matches(chat_id)")
        conn.execute("CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status)")
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
            conn.execute("UPDATE matches SET status = 'CANCELLED', finish_reason = 'JOIN_TIMEOUT' WHERE match_id = ?", (match_id,))
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
    with get_db_connection() as conn:
        conn.execute("UPDATE matches SET room_state = ? WHERE match_id = ?", (json.dumps(state), match_id))
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
