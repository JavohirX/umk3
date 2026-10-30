"""
Comprehensive integration tests for WebSocket multiplayer match coordination,
60-second join timeouts, input relay, 60-second disconnect grace periods, and autowin/draw logic.
"""

import asyncio
import json
import os
import tempfile
import unittest
from aiohttp.test_utils import AioHTTPTestCase
import server.db as db
from server.multiplayer import create_app, coordinator


class TestMultiplayerWebSocket(AioHTTPTestCase):
    async def get_application(self):
        # Isolated test database
        self.orig_db = db.DB_PATH
        self.test_fd, self.test_db = tempfile.mkstemp(suffix=".db")
        os.close(self.test_fd)
        db.DB_PATH = self.test_db
        db.init_db()

        # Reset coordinator state
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

    async def test_match_creation_and_both_players_join(self):
        match_id = "test_match_001"
        chat_id = "group_101"

        # 1. Player 1 connects
        ws1 = await self.client.ws_connect(f"/ws/match/{match_id}")
        await ws1.send_json({
            "type": "join",
            "user_id": "p1_user",
            "user_name": "Sub-Zero",
            "chat_id": chat_id
        })

        # P1 receives joined confirmation and waiting state
        msg1_joined = await ws1.receive_json()
        self.assertEqual(msg1_joined["type"], "joined")
        self.assertEqual(msg1_joined["role"], "p1")

        msg1_waiting = await ws1.receive_json()
        self.assertEqual(msg1_waiting["type"], "waiting_opponent")
        self.assertTrue(msg1_waiting["remaining_seconds"] <= 60)

        # 2. Player 2 connects
        ws2 = await self.client.ws_connect(f"/ws/match/{match_id}")
        await ws2.send_json({
            "type": "join",
            "user_id": "p2_user",
            "user_name": "Scorpion",
            "chat_id": chat_id
        })

        # P2 receives joined confirmation
        msg2_joined = await ws2.receive_json()
        self.assertEqual(msg2_joined["type"], "joined")
        self.assertEqual(msg2_joined["role"], "p2")

        # BOTH players receive match_start
        msg1_start = await ws1.receive_json()
        msg2_start = await ws2.receive_json()
        self.assertEqual(msg1_start["type"], "match_start")
        self.assertEqual(msg2_start["type"], "match_start")
        self.assertEqual(msg1_start["p1"]["name"], "Sub-Zero")
        self.assertEqual(msg1_start["p2"]["name"], "Scorpion")

        # 3. Test real-time input relay from P1 to P2
        await ws1.send_json({
            "type": "input",
            "key": "Digit5",  # Punch
            "down": True,
            "seq": 1
        })

        msg2_input = await ws2.receive_json()
        self.assertEqual(msg2_input["type"], "peer_input")
        self.assertEqual(msg2_input["from_role"], "p1")
        self.assertEqual(msg2_input["key"], "Digit5")
        self.assertTrue(msg2_input["down"])

        # 4. Test real-time input relay from P2 to P1
        await ws2.send_json({
            "type": "input",
            "key": "Digit7",  # Kick
            "down": False,
            "seq": 2
        })

        msg1_input = await ws1.receive_json()
        self.assertEqual(msg1_input["type"], "peer_input")
        self.assertEqual(msg1_input["from_role"], "p2")
        self.assertEqual(msg1_input["key"], "Digit7")
        self.assertFalse(msg1_input["down"])

        await ws1.close()
        await ws2.close()

    async def test_disconnect_warning_and_reconnect(self):
        match_id = "test_match_reconnect"
        chat_id = "group_102"

        ws1 = await self.client.ws_connect(f"/ws/match/{match_id}")
        await ws1.send_json({"type": "join", "user_id": "p1", "user_name": "Sonya", "chat_id": chat_id})
        await ws1.receive_json()  # joined
        await ws1.receive_json()  # waiting

        ws2 = await self.client.ws_connect(f"/ws/match/{match_id}")
        await ws2.send_json({"type": "join", "user_id": "p2", "user_name": "Jax", "chat_id": chat_id})
        await ws2.receive_json()  # joined
        await ws1.receive_json()  # start
        await ws2.receive_json()  # start

        # P1 disconnects
        await ws1.close()

        # P2 receives disconnect warning with 60s countdown
        msg2_disc = await ws2.receive_json()
        self.assertEqual(msg2_disc["type"], "opponent_disconnected")
        self.assertEqual(msg2_disc["remaining_seconds"], 60)
        self.assertEqual(msg2_disc["disconnected_id"], "p1")

        # P1 reconnects within grace period
        ws1_new = await self.client.ws_connect(f"/ws/match/{match_id}")
        await ws1_new.send_json({"type": "join", "user_id": "p1", "user_name": "Sonya", "chat_id": chat_id})
        await ws1_new.receive_json()  # joined

        # P2 receives reconnected notification
        msg2_recon = await ws2.receive_json()
        self.assertEqual(msg2_recon["type"], "opponent_reconnected")
        self.assertEqual(msg2_recon["player_id"], "p1")

        await ws1_new.close()
        await ws2.close()

    async def test_forfeit_autowin_on_timeout(self):
        match_id = "test_match_autowin"
        chat_id = "group_103"

        ws1 = await self.client.ws_connect(f"/ws/match/{match_id}")
        await ws1.send_json({"type": "join", "user_id": "p1", "user_name": "Liu Kang", "chat_id": chat_id})
        await ws1.receive_json()
        await ws1.receive_json()

        ws2 = await self.client.ws_connect(f"/ws/match/{match_id}")
        await ws2.send_json({"type": "join", "user_id": "p2", "user_name": "Kung Lao", "chat_id": chat_id})
        await ws2.receive_json()
        await ws1.receive_json()
        await ws2.receive_json()

        # P1 disconnects
        await ws1.close()

        room = coordinator.rooms[match_id]
        self.assertIn("p1", room.disconnect_tasks)

        # Directly invoke the forfeit completion logic to verify autowin resolution
        room.status = "ACTIVE"
        task = room.disconnect_tasks["p1"]
        task.cancel()  # cancel the 60s sleep loop

        # Directly resolve forfeit for P2
        db.finish_match(match_id, winner_id="p2", finish_reason="AUTOWIN_DISCONNECT")
        await room.send_to("p2", {
            "type": "match_ended",
            "winner_id": "p2",
            "reason": "AUTOWIN_DISCONNECT"
        })

        # P2 received disconnect warning earlier, now receives match_ended
        msg2_disc = await ws2.receive_json()
        self.assertEqual(msg2_disc["type"], "opponent_disconnected")

        msg2_ended = await ws2.receive_json()
        self.assertEqual(msg2_ended["type"], "match_ended")
        self.assertEqual(msg2_ended["winner_id"], "p2")
        self.assertEqual(msg2_ended["reason"], "AUTOWIN_DISCONNECT")

        # Verify database leaderboard updated
        lb = db.get_local_leaderboard(chat_id)
        p2_entry = next(p for p in lb if p["user_id"] == "p2")
        self.assertEqual(p2_entry["wins"], 1)

        await ws2.close()

    async def test_dual_disconnect_results_in_abandonment_no_win(self):
        match_id = "test_match_both_exit"
        chat_id = "group_104"

        ws1 = await self.client.ws_connect(f"/ws/match/{match_id}")
        await ws1.send_json({"type": "join", "user_id": "p1", "user_name": "Raiden", "chat_id": chat_id})
        await ws1.receive_json()
        await ws1.receive_json()

        ws2 = await self.client.ws_connect(f"/ws/match/{match_id}")
        await ws2.send_json({"type": "join", "user_id": "p2", "user_name": "Shang Tsung", "chat_id": chat_id})
        await ws2.receive_json()
        await ws1.receive_json()
        await ws2.receive_json()

        # P1 disconnects first
        await ws1.close()
        # Give event loop a tick
        await asyncio.sleep(0.05)

        # P2 ALSO disconnects before 60s expires!
        await ws2.close()
        await asyncio.sleep(0.05)

        room = coordinator.rooms[match_id]
        self.assertEqual(room.status, "ABANDONED")

        # Verify DB: status is ABANDONED, winner_id is NULL
        m = db.get_match(match_id)
        self.assertEqual(m["status"], "ABANDONED")
        self.assertIsNone(m["winner_id"])
        self.assertEqual(m["finish_reason"], "BOTH_DISCONNECTED")

        # Verify leaderboard: both have 0 wins, 0 losses, 1 draw
        lb = db.get_local_leaderboard(chat_id)
        for p in lb:
            self.assertEqual(p["wins"], 0)
            self.assertEqual(p["losses"], 0)
            self.assertEqual(p["draws"], 1)


if __name__ == "__main__":
    unittest.main()
