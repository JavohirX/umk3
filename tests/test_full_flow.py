"""
End-to-end test for Immortal Combat Telegram Multiplayer: a challenge posted by the bot (database row),
both players joining over WebSocket, hero locks, lockstep inputs, a best-of-three decided by both phones'
round reports, and the group leaderboard and replay served over REST.
"""

import os
import tempfile
import unittest
from aiohttp.test_utils import AioHTTPTestCase
import server.db as db
from server.multiplayer import create_app, coordinator
from tests.test_websocket_match import input_packet, recv_type


class TestFullMultiplayerFlow(AioHTTPTestCase):
    async def get_application(self):
        self.orig_db = db.DB_PATH
        fd, self.test_db = tempfile.mkstemp(suffix=".db")
        os.close(fd)
        db.DB_PATH = self.test_db
        db.init_db()
        coordinator.rooms.clear()
        coordinator.notifier = None
        return create_app()

    async def asyncTearDown(self):
        await super().asyncTearDown()
        db.DB_PATH = self.orig_db
        try:
            os.remove(self.test_db)
        except OSError:
            pass

    async def test_challenge_to_knockout_to_leaderboard(self):
        match_id = "combat_m1"
        chat_id = "-100champions"
        db.create_match(match_id, chat_id, "p1", "Liu Kang")

        ws1 = await self.client.ws_connect(f"/ws/match/{match_id}")
        await ws1.send_json({"type": "join", "user_id": "p1", "user_name": "Liu Kang"})
        await recv_type(ws1, "waiting_opponent")
        ws2 = await self.client.ws_connect(f"/ws/match/{match_id}")
        await ws2.send_json({"type": "join", "user_id": "p2", "user_name": "Shang Tsung"})
        await recv_type(ws1, "match_start")
        await recv_type(ws2, "match_start")

        await ws1.send_json({"type": "hero_lock", "hero_id": 6})
        await recv_type(ws2, "peer_hero_lock")
        await ws2.send_json({"type": "hero_lock", "hero_id": 0})
        await recv_type(ws1, "versus_start")
        await recv_type(ws2, "versus_start")

        for tick in range(10):
            await ws1.send_bytes(input_packet(0, tick, pressed=1 if tick == 4 else 0))
            await ws2.send_bytes(input_packet(0, tick))

        for score in ((1, 0), (2, 0)):
            for ws in (ws1, ws2):
                await ws.send_json({"type": "round_score", "p1": score[0], "p2": score[1]})
        end = await recv_type(ws2, "match_ended")
        self.assertEqual((end["winner_id"], end["reason"]), ("p1", "KNOCKOUT"))

        lb = (await (await self.client.get(f"/api/leaderboard?chat_id={chat_id}")).json())["leaderboard"]
        stats = {p["user_id"]: p for p in lb}
        self.assertEqual((stats["p1"]["wins"], stats["p1"]["games_played"], stats["p1"]["win_rate"]), (1, 1, 100.0))
        self.assertEqual((stats["p2"]["losses"], stats["p2"]["win_rate"]), (1, 0.0))

        replay = (await (await self.client.get(f"/api/replay/{match_id}")).json())["replay"]
        self.assertEqual(replay["segments"][0]["p1"], [[4, 1, 0]])
        self.assertEqual(db.get_match(match_id)["status"], "COMPLETED")


if __name__ == "__main__":
    unittest.main()
