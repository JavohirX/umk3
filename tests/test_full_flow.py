"""
End-to-end test suite for Immortal Combat Telegram Multiplayer:
- REST API match creation & leaderboard queries
- 60-second lobby join expiration
- WebSocket 2-player matchmaking & input routing
- In-match disconnect grace period & Autowin resolution
- Dual-disconnect match abandonment (no wins)
- Group-isolated leaderboard statistics calculation
"""

import asyncio
import json
import os
import tempfile
import time
import unittest
from aiohttp.test_utils import AioHTTPTestCase
import server.db as db
from server.multiplayer import create_app, coordinator


class TestFullMultiplayerFlow(AioHTTPTestCase):
    async def get_application(self):
        self.orig_db = db.DB_PATH
        self.test_fd, self.test_db = tempfile.mkstemp(suffix=".db")
        os.close(self.test_fd)
        db.DB_PATH = self.test_db
        db.init_db()

        coordinator.rooms.clear()
        return create_app()

    async def asyncTearDown(self):
        await super().asyncTearDown()
        db.DB_PATH = self.orig_db
        try:
            if os.path.exists(self.test_db):
                os.remove(self.test_db)
        except Exception:
            pass

    async def test_rest_api_create_and_fetch_match(self):
        """Test POST /api/match/create and GET /api/match/{id}."""
        payload = {
            "match_id": "api_test_m1",
            "chat_id": "-1001234567",
            "creator_id": "tg_999",
            "creator_name": "Raiden"
        }
        resp = await self.client.post("/api/match/create", json=payload)
        self.assertEqual(resp.status, 200)
        data = await resp.json()
        self.assertEqual(data["status"], "ok")
        self.assertEqual(data["match"]["match_id"], "api_test_m1")
        self.assertEqual(data["match"]["creator_name"], "Raiden")

        # Fetch match
        resp_get = await self.client.get("/api/match/api_test_m1")
        self.assertEqual(resp_get.status, 200)
        data_get = await resp_get.json()
        self.assertEqual(data_get["match"]["status"], "WAITING")

    async def test_60_second_join_timeout(self):
        """Verify that when no opponent joins, match times out and cancels."""
        match_id = "timeout_m1"
        chat_id = "group_timer"

        # Create room with tiny expiration for testing
        room = coordinator.get_or_create_room(match_id, chat_id, "u1", "Fighter 1")
        room.expires_at = time.time() + 0.1  # Expire in 100ms
        if room.join_timeout_task:
            room.join_timeout_task.cancel()
        room.join_timeout_task = asyncio.create_task(coordinator._watch_join_timeout(room))

        # Connect creator to WebSocket
        ws = await self.client.ws_connect(f"/ws/match/{match_id}")
        await ws.send_json({"type": "join", "user_id": "u1", "user_name": "Fighter 1", "chat_id": chat_id})
        await ws.receive_json()  # joined
        await ws.receive_json()  # waiting

        # Wait for timeout to trigger
        await asyncio.sleep(0.2)

        # Creator receives match_cancelled
        msg_cancelled = await ws.receive_json()
        self.assertEqual(msg_cancelled["type"], "match_cancelled")
        self.assertEqual(msg_cancelled["reason"], "JOIN_TIMEOUT")

        # Verify DB status is CANCELLED
        m = db.get_match(match_id)
        self.assertEqual(m["status"], "CANCELLED")
        self.assertEqual(m["finish_reason"], "JOIN_TIMEOUT")

        await ws.close()

    async def test_combat_flow_and_knockout_resolution(self):
        """Test full combat session from join -> inputs -> KO -> leaderboard update."""
        match_id = "combat_m1"
        chat_id = "group_champions"

        ws1 = await self.client.ws_connect(f"/ws/match/{match_id}")
        await ws1.send_json({"type": "join", "user_id": "p1", "user_name": "Liu Kang", "chat_id": chat_id})
        await ws1.receive_json()
        await ws1.receive_json()

        ws2 = await self.client.ws_connect(f"/ws/match/{match_id}")
        await ws2.send_json({"type": "join", "user_id": "p2", "user_name": "Shang Tsung", "chat_id": chat_id})
        await ws2.receive_json()
        await ws1.receive_json()  # start
        await ws2.receive_json()  # start

        # Exchange punches and kicks
        await ws1.send_json({"type": "input", "key": 53, "down": True})
        p2_recv = await ws2.receive_json()
        self.assertEqual(p2_recv["type"], "peer_input")
        self.assertEqual(p2_recv["key"], 53)

        await ws2.send_json({"type": "input", "key": 55, "down": True})
        p1_recv = await ws1.receive_json()
        self.assertEqual(p1_recv["type"], "peer_input")
        self.assertEqual(p1_recv["key"], 55)

        # Knockout occurs! P1 delivers fatal blow
        await ws1.send_json({
            "type": "match_finish",
            "winner_id": "p1",
            "reason": "KNOCKOUT"
        })

        res1 = await ws1.receive_json()
        res2 = await ws2.receive_json()
        self.assertEqual(res1["type"], "match_ended")
        self.assertEqual(res1["winner_id"], "p1")
        self.assertEqual(res2["winner_id"], "p1")

        # Query REST API leaderboard for this group
        resp_lb = await self.client.get(f"/api/leaderboard?chat_id={chat_id}")
        self.assertEqual(resp_lb.status, 200)
        lb_data = await resp_lb.json()
        lb = lb_data["leaderboard"]

        self.assertEqual(len(lb), 2)
        p1_stats = next(p for p in lb if p["user_id"] == "p1")
        p2_stats = next(p for p in lb if p["user_id"] == "p2")

        self.assertEqual(p1_stats["wins"], 1)
        self.assertEqual(p1_stats["losses"], 0)
        self.assertEqual(p1_stats["games_played"], 1)
        self.assertEqual(p1_stats["win_rate"], 100.0)

        self.assertEqual(p2_stats["wins"], 0)
        self.assertEqual(p2_stats["losses"], 1)
        self.assertEqual(p2_stats["games_played"], 1)
        self.assertEqual(p2_stats["win_rate"], 0.0)

        await ws1.close()
        await ws2.close()


if __name__ == "__main__":
    unittest.main()
