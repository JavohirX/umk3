"""
Immortal Combat - Local SQLite Database & Leaderboard Engine
Manages matches, player stats, and group-isolated leaderboards.
"""

import sqlite3
import os
import time
from typing import Optional, Dict, Any, List

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "immortal_combat.db")


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

        conn.execute("CREATE INDEX IF NOT EXISTS idx_matches_chat ON matches(chat_id)")
        conn.execute("CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status)")
        conn.execute("CREATE INDEX IF NOT EXISTS idx_lb_chat_wins ON local_leaderboard(chat_id, wins DESC)")
        conn.commit()


def create_match(match_id: str, chat_id: str, creator_id: str, creator_name: str, opponent_id: Optional[str] = None, opponent_name: Optional[str] = None, timeout_seconds: int = 60) -> Dict[str, Any]:
    """Creates a new match with a 60-second lobby expiration."""
    now = time.time()
    expires_at = now + timeout_seconds

    with get_db_connection() as conn:
        conn.execute("""
            INSERT INTO matches (match_id, chat_id, creator_id, creator_name, opponent_id, opponent_name, status, created_at, expires_at)
            VALUES (?, ?, ?, ?, ?, ?, 'WAITING', ?, ?)
        """, (match_id, str(chat_id), str(creator_id), creator_name, str(opponent_id) if opponent_id else None, opponent_name, now, expires_at))
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
        "expires_at": expires_at
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


def finish_match(match_id: str, winner_id: Optional[str], finish_reason: str) -> Optional[Dict[str, Any]]:
    """
    Finishes an active match, sets outcome, and updates local leaderboard.
    If finish_reason is 'BOTH_DISCONNECTED' or 'DRAW', winner_id is None and neither player gets a win.
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

        status = "COMPLETED" if winner_id else "ABANDONED"
        conn.execute("""
            UPDATE matches
            SET status = ?, winner_id = ?, finish_reason = ?, ended_at = ?
            WHERE match_id = ?
        """, (status, str(winner_id) if winner_id else None, finish_reason, now, match_id))

        chat_id = match["chat_id"]
        creator_id = str(match["creator_id"])
        creator_name = match["creator_name"]
        opponent_id = str(match["opponent_id"]) if match["opponent_id"] else None
        opponent_name = match["opponent_name"] or "Opponent"

        # Update leaderboard only if match actually had two players
        if opponent_id:
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


def get_local_leaderboard(chat_id: str, limit: int = 10) -> List[Dict[str, Any]]:
    """
    Returns the local leaderboard for a specific chat/group.
    Sorted by wins DESC, games_played DESC.
    """
    with get_db_connection() as conn:
        cur = conn.execute("""
            SELECT user_id, first_name, username, wins, losses, draws, games_played, last_played_at
            FROM local_leaderboard
            WHERE chat_id = ?
            ORDER BY wins DESC, games_played DESC, (wins * 1.0 / MAX(games_played, 1)) DESC
            LIMIT ?
        """, (str(chat_id), limit))
        rows = cur.fetchall()
        result = []
        for rank, r in enumerate(rows, start=1):
            d = dict(r)
            d["rank"] = rank
            gp = d["games_played"]
            d["win_rate"] = round((d["wins"] / gp) * 100, 1) if gp > 0 else 0.0
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
            d = dict(row)
            gp = d["games_played"]
            d["win_rate"] = round((d["wins"] / gp) * 100, 1) if gp > 0 else 0.0
            return d
    return None


# Initialize DB on module import
init_db()
