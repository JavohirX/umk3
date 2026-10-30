"""
Unit test for server/db.py: local leaderboard, match lifecycle, forfeit autowin, dual disconnect.
"""

import unittest
import time
import os
import tempfile
import server.db as db

class TestDatabase(unittest.TestCase):
    def setUp(self):
        # Use an isolated test database
        self.orig_db = db.DB_PATH
        self.test_fd, self.test_db = tempfile.mkstemp(suffix=".db")
        os.close(self.test_fd)
        db.DB_PATH = self.test_db
        db.init_db()

    def tearDown(self):
        db.DB_PATH = self.orig_db
        try:
            if os.path.exists(self.test_db):
                os.remove(self.test_db)
        except Exception:
            pass

    def test_match_lifecycle_join_and_finish(self):
        m = db.create_match("match1", "chat100", "p1", "Sub-Zero", timeout_seconds=60)
        self.assertEqual(m["status"], "WAITING")
        self.assertEqual(m["creator_id"], "p1")

        # Join match
        joined = db.join_match("match1", "p2", "Scorpion")
        self.assertIsNotNone(joined)
        self.assertEqual(joined["status"], "ACTIVE")
        self.assertEqual(joined["opponent_id"], "p2")

        # Finish match with P1 winning
        finished = db.finish_match("match1", winner_id="p1", finish_reason="KNOCKOUT")
        self.assertEqual(finished["status"], "COMPLETED")
        self.assertEqual(finished["winner_id"], "p1")

        # Check local leaderboard
        lb = db.get_local_leaderboard("chat100")
        self.assertEqual(len(lb), 2)
        p1_stat = next(p for p in lb if p["user_id"] == "p1")
        p2_stat = next(p for p in lb if p["user_id"] == "p2")

        self.assertEqual(p1_stat["wins"], 1)
        self.assertEqual(p1_stat["losses"], 0)
        self.assertEqual(p1_stat["games_played"], 1)
        self.assertEqual(p1_stat["win_rate"], 100.0)

        self.assertEqual(p2_stat["wins"], 0)
        self.assertEqual(p2_stat["losses"], 1)
        self.assertEqual(p2_stat["games_played"], 1)
        self.assertEqual(p2_stat["win_rate"], 0.0)

    def test_forfeit_autowin(self):
        db.create_match("match_forfeit", "chat_forfeit", "p1", "Liu Kang")
        db.join_match("match_forfeit", "p2", "Sonya")

        # P1 leaves and 60s passes -> autowin for P2
        finished = db.finish_match("match_forfeit", winner_id="p2", finish_reason="AUTOWIN_DISCONNECT")
        self.assertEqual(finished["winner_id"], "p2")

        lb = db.get_local_leaderboard("chat_forfeit")
        p2_stat = next(p for p in lb if p["user_id"] == "p2")
        self.assertEqual(p2_stat["wins"], 1)

    def test_dual_disconnect_draw(self):
        db.create_match("match_dual", "chat_dual", "p1", "Jax")
        db.join_match("match_dual", "p2", "Kano")

        # Both leave -> no win for anyone
        finished = db.finish_match("match_dual", winner_id=None, finish_reason="BOTH_DISCONNECTED")
        self.assertEqual(finished["status"], "ABANDONED")
        self.assertIsNone(finished["winner_id"])

        lb = db.get_local_leaderboard("chat_dual")
        for p in lb:
            self.assertEqual(p["wins"], 0)
            self.assertEqual(p["losses"], 0)
            self.assertEqual(p["draws"], 1)
            self.assertEqual(p["games_played"], 1)

    def test_local_group_isolation(self):
        # Match in Chat A
        db.create_match("m_a", "chat_A", "user1", "P1")
        db.join_match("m_a", "user2", "P2")
        db.finish_match("m_a", winner_id="user1", finish_reason="KNOCKOUT")

        # Match in Chat B with same users
        db.create_match("m_b", "chat_B", "user1", "P1")
        db.join_match("m_b", "user2", "P2")
        db.finish_match("m_b", winner_id="user2", finish_reason="KNOCKOUT")

        lb_a = db.get_local_leaderboard("chat_A")
        lb_b = db.get_local_leaderboard("chat_B")

        # Chat A has user1 with 1 win
        u1_a = next(p for p in lb_a if p["user_id"] == "user1")
        self.assertEqual(u1_a["wins"], 1)

        # Chat B has user1 with 0 wins and 1 loss
        u1_b = next(p for p in lb_b if p["user_id"] == "user1")
        self.assertEqual(u1_b["wins"], 0)
        self.assertEqual(u1_b["losses"], 1)


if __name__ == "__main__":
    unittest.main()
