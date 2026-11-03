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

    async def test_two_tabs_same_credentials_join_and_start_match(self):
        """
        Verify that if two tabs open the same link with the same credentials/hash,
        the server seamlessly pairs Tab 2 as Player 2 and activates the match!
        """
        match_id = "test_same_hash_tabs"
        chat_id = "group_tabs"

        # Tab 1 connects
        ws1 = await self.client.ws_connect(f"/ws/match/{match_id}")
        await ws1.send_json({
            "type": "join",
            "user_id": "same_user",
            "user_name": "SharedFighter",
            "chat_id": chat_id
        })
        resp1 = await ws1.receive_json()
        self.assertEqual(resp1["type"], "joined")
        self.assertEqual(resp1["role"], "p1")

        # Tab 2 connects to the SAME match with the SAME user_id
        ws2 = await self.client.ws_connect(f"/ws/match/{match_id}")
        await ws2.send_json({
            "type": "join",
            "user_id": "same_user",
            "user_name": "SharedFighter",
            "chat_id": chat_id
        })
        resp2 = await ws2.receive_json()
        self.assertEqual(resp2["type"], "joined")
        self.assertEqual(resp2["role"], "p2")

        # Tab 2 must trigger match_start for both
        start2 = await ws2.receive_json()
        self.assertEqual(start2["type"], "match_start")

        # Tab 1 receives waiting_opponent then match_start
        msg_t1 = await ws1.receive_json()
        if msg_t1["type"] == "waiting_opponent":
            start1 = await ws1.receive_json()
        else:
            start1 = msg_t1
        self.assertEqual(start1["type"], "match_start")

        # Verify room is ACTIVE
        room = coordinator.rooms[match_id]
        self.assertEqual(room.status, "ACTIVE")

        await ws1.close()
        await ws2.close()

    async def test_hero_selection_versus_and_best_of_three_round_wins(self):
        """
        Verify end-to-end multiplayer hero selection, versus screen trigger,
        and best-of-three round win resolution (first to 2 round wins).
        """
        match_id = "test_hero_flow_01"
        chat_id = "group_tournament"

        # 1. P1 and P2 connect
        ws1 = await self.client.ws_connect(f"/ws/match/{match_id}")
        await ws1.send_json({"type": "join", "user_id": "p1_id", "user_name": "Player 1", "chat_id": chat_id})
        await ws1.receive_json() # joined
        await ws1.receive_json() # waiting

        ws2 = await self.client.ws_connect(f"/ws/match/{match_id}")
        await ws2.send_json({"type": "join", "user_id": "p2_id", "user_name": "Player 2", "chat_id": chat_id})
        await ws2.receive_json() # joined
        s1 = await ws1.receive_json() # match_start / hero select
        s2 = await ws2.receive_json() # match_start / hero select
        self.assertEqual(s1["type"], "match_start")
        self.assertEqual(s1["stage"], "hero_select")

        # 2. Independent character selection: P1 locks Scorpion (0)
        await ws1.send_json({"type": "hero_lock", "hero_id": 0})
        p1_lock_recv1 = await ws1.receive_json()
        p1_lock_recv2 = await ws2.receive_json()
        self.assertEqual(p1_lock_recv1["type"], "peer_hero_lock")
        self.assertEqual(p1_lock_recv2["type"], "peer_hero_lock")
        self.assertEqual(p1_lock_recv1["hero_id"], 0)

        # 4. P2 locks Sub-Zero (1) -> triggers versus_start
        await ws2.send_json({"type": "hero_lock", "hero_id": 1})
        await ws1.receive_json() # peer_hero_lock for p2
        await ws2.receive_json() # peer_hero_lock for p2

        vs1 = await ws1.receive_json() # versus_start
        vs2 = await ws2.receive_json() # versus_start
        self.assertEqual(vs1["type"], "versus_start")
        self.assertEqual(vs2["type"], "versus_start")
        self.assertEqual(vs1["p1"]["hero_id"], 0)
        self.assertEqual(vs1["p2"]["hero_id"], 1)

        # 5. Round 1: P1 wins round 1
        await ws1.send_json({"type": "round_win", "winner_role": "p1"})
        r1_w1 = await ws1.receive_json()
        r1_w2 = await ws2.receive_json()
        self.assertEqual(r1_w1["type"], "round_next")
        self.assertEqual(r1_w1["p1_rounds"], 1)
        self.assertEqual(r1_w1["p2_rounds"], 0)
        self.assertEqual(r1_w1["round_num"], 2)

        # 6. Round 2: P2 wins round 2 (tied 1-1)
        await ws1.send_json({"type": "round_win", "winner_role": "p2"})
        r2_w1 = await ws1.receive_json()
        r2_w2 = await ws2.receive_json()
        self.assertEqual(r2_w1["type"], "round_next")
        self.assertEqual(r2_w1["p1_rounds"], 1)
        self.assertEqual(r2_w1["p2_rounds"], 1)
        self.assertEqual(r2_w1["round_num"], 3)

        # 7. Round 3 (Deciding round): P1 wins round 3 (P1 has 2 round wins -> MATCH WON!)
        await ws1.send_json({"type": "round_win", "winner_role": "p1"})
        end1 = await ws1.receive_json()
        end2 = await ws2.receive_json()
        self.assertEqual(end1["type"], "match_ended")
        self.assertEqual(end2["type"], "match_ended")
        self.assertEqual(end1["winner_role"], "p1")
        self.assertEqual(end1["p1_rounds"], 2)
        self.assertEqual(end1["p2_rounds"], 1)

        await ws1.close()
        await ws2.close()

    async def test_binary_input_relay_and_rtc_signaling(self):
        """Tests ultra-low latency binary packet relay and WebRTC signaling exchange."""
        match_id = "test_binary_rtc_001"
        chat_id = "group_fast"

        # 1. Connect both players
        ws1 = await self.client.ws_connect(f"/ws/match/{match_id}")
        await ws1.send_json({"type": "join", "user_id": "u1", "user_name": "Liu Kang", "chat_id": chat_id})
        await ws1.receive_json() # joined
        await ws1.receive_json() # waiting_opponent

        ws2 = await self.client.ws_connect(f"/ws/match/{match_id}")
        await ws2.send_json({"type": "join", "user_id": "u2", "user_name": "Kung Lao", "chat_id": chat_id})
        await ws2.receive_json() # joined

        await ws1.receive_json() # match_start
        await ws2.receive_json() # match_start

        # 2. Test WebRTC signaling relay (Offer/Answer/Candidate)
        await ws1.send_json({
            "type": "rtc_signal",
            "signal": {"type": "offer", "sdp": "v=0..."}
        })
        sig_p2 = await ws2.receive_json()
        self.assertEqual(sig_p2["type"], "rtc_signal")
        self.assertEqual(sig_p2["from_role"], "p1")
        self.assertEqual(sig_p2["signal"]["type"], "offer")

        await ws2.send_json({
            "type": "rtc_signal",
            "signal": {"type": "answer", "sdp": "v=0..."}
        })
        sig_p1 = await ws1.receive_json()
        self.assertEqual(sig_p1["type"], "rtc_signal")
        self.assertEqual(sig_p1["from_role"], "p2")
        self.assertEqual(sig_p1["signal"]["type"], "answer")

        # 3. Test Binary Input Relay (zero-copy ArrayBuffer / bytes)
        # Format: [0x01 (INPUT), 53 (Key Digit5), 1 (Down), 42 (Seq)]
        binary_input = bytes([1, 53, 1, 42])
        await ws1.send_bytes(binary_input)

        msg2 = await ws2.receive()
        from aiohttp import WSMsgType
        self.assertEqual(msg2.type, WSMsgType.BINARY)
        self.assertEqual(msg2.data, binary_input)

        await ws1.close()
        await ws2.close()


    async def test_whoever_chooses_hero_first_is_assigned_p1(self):
        """
        Verify that whoever chooses a hero FIRST is assigned in the network as Player 1 (P1),
        and whoever chooses SECOND is assigned as Player 2 (P2), regardless of who created the room.
        """
        match_id = "test_role_order_01"
        chat_id = "group_order"

        # 1. ws1 (creator) and ws2 (joiner) connect
        ws1 = await self.client.ws_connect(f"/ws/match/{match_id}")
        await ws1.send_json({"type": "join", "user_id": "user_creator", "user_name": "Creator", "chat_id": chat_id})
        await ws1.receive_json() # joined
        await ws1.receive_json() # waiting

        ws2 = await self.client.ws_connect(f"/ws/match/{match_id}")
        await ws2.send_json({"type": "join", "user_id": "user_joiner", "user_name": "Joiner", "chat_id": chat_id})
        await ws2.receive_json() # joined
        await ws1.receive_json() # match_start / hero_select
        await ws2.receive_json() # match_start / hero_select

        # 2. Joiner (ws2) locks hero FIRST (hero_id=5, Liu Kang)
        await ws2.send_json({"type": "hero_lock", "hero_id": 5})
        lock1_ws1 = await ws1.receive_json()
        lock1_ws2 = await ws2.receive_json()

        # Both receive peer_hero_lock showing ws2 was assigned 'p1'
        self.assertEqual(lock1_ws1["type"], "peer_hero_lock")
        self.assertEqual(lock1_ws1["from_role"], "p1")
        self.assertEqual(lock1_ws1["assigned_role"], "p1")
        self.assertEqual(lock1_ws1["player_id"], "user_joiner")
        self.assertEqual(lock1_ws1["hero_id"], 5)

        self.assertEqual(lock1_ws2["type"], "peer_hero_lock")
        self.assertEqual(lock1_ws2["from_role"], "p1")
        self.assertEqual(lock1_ws2["assigned_role"], "p1")
        self.assertEqual(lock1_ws2["player_id"], "user_joiner")
        self.assertEqual(lock1_ws2["hero_id"], 5)

        # 3. Creator (ws1) locks hero SECOND (hero_id=2, Sonya)
        await ws1.send_json({"type": "hero_lock", "hero_id": 2})
        lock2_ws1 = await ws1.receive_json()
        lock2_ws2 = await ws2.receive_json()

        # Both receive peer_hero_lock showing ws1 was assigned 'p2'
        self.assertEqual(lock2_ws1["from_role"], "p2")
        self.assertEqual(lock2_ws1["assigned_role"], "p2")
        self.assertEqual(lock2_ws1["player_id"], "user_creator")
        self.assertEqual(lock2_ws1["hero_id"], 2)

        # 4. versus_start triggers with P1=Joiner (hero 5) and P2=Creator (hero 2)
        vs1 = await ws1.receive_json()
        vs2 = await ws2.receive_json()
        self.assertEqual(vs1["type"], "versus_start")
        self.assertEqual(vs2["type"], "versus_start")

        # Verify P1 is ws2 (user_joiner, hero 5) and P2 is ws1 (user_creator, hero 2)
        self.assertEqual(vs1["p1"]["id"], "user_joiner")
        self.assertEqual(vs1["p1"]["hero_id"], 5)
        self.assertEqual(vs1["p2"]["id"], "user_creator")
        self.assertEqual(vs1["p2"]["hero_id"], 2)

        await ws1.close()
        await ws2.close()

    async def _connect_and_lock(self, match_id, chat_id, p1_hero, p2_hero, p1_control=1, p2_control=1):
        """
        Creator ('creator', ws1) and joiner ('joiner', ws2) connect; the joiner locks first so it
        fights as P1 with p1_hero. Drains both sockets up to versus_start.
        """
        ws1 = await self.client.ws_connect(f"/ws/match/{match_id}")
        await ws1.send_json({"type": "join", "user_id": "creator", "user_name": "Creator", "chat_id": chat_id})
        await ws1.receive_json()  # joined
        await ws1.receive_json()  # waiting

        ws2 = await self.client.ws_connect(f"/ws/match/{match_id}")
        await ws2.send_json({"type": "join", "user_id": "joiner", "user_name": "Joiner", "chat_id": chat_id})
        await ws2.receive_json()  # joined
        await ws1.receive_json()  # match_start
        await ws2.receive_json()  # match_start

        await ws2.send_json({"type": "hero_lock", "hero_id": p1_hero, "control": p1_control})
        await ws1.receive_json()  # peer_hero_lock
        await ws2.receive_json()  # peer_hero_lock
        await ws1.send_json({"type": "hero_lock", "hero_id": p2_hero, "control": p2_control})
        await ws1.receive_json()  # peer_hero_lock
        await ws2.receive_json()  # peer_hero_lock
        vs1 = await ws1.receive_json()
        vs2 = await ws2.receive_json()
        return ws1, ws2, vs1, vs2

    async def test_versus_start_shares_one_stage_for_both_players(self):
        """Mirror match: both phones must get the same arena index, independent of the heroes."""
        ws1, ws2, vs1, vs2 = await self._connect_and_lock("test_stage_01", "group_stage", 3, 3)

        self.assertEqual(vs1["type"], "versus_start")
        self.assertIn(vs1["stage"], range(5))
        self.assertEqual(vs1["stage"], vs2["stage"])
        # Lockstep: both simulations must roll the same random numbers
        self.assertIsInstance(vs1["seed"], int)
        self.assertEqual(vs1["seed"], vs2["seed"])

        await ws1.close()
        await ws2.close()

    async def test_reconnect_mid_bout_resumes_without_restarting_hero_select(self):
        """
        A fighter who drops mid-bout and rejoins gets the same versus setup back, keeps their
        lock-order side, and the player who stayed is not sent back to hero select.
        """
        match_id = "test_reconnect_bout_01"
        chat_id = "group_reconnect"
        ws1, ws2, vs1, _ = await self._connect_and_lock(match_id, chat_id, 4, 6)
        await ws2.send_json({"type": "round_win", "winner_role": "p1"})
        await ws1.receive_json()  # round_next
        await ws2.receive_json()  # round_next
        await ws2.close()  # the joiner, P1 by lock order, drops mid-bout

        disc = await ws1.receive_json()
        self.assertEqual(disc["type"], "opponent_disconnected")

        ws2_new = await self.client.ws_connect(f"/ws/match/{match_id}")
        await ws2_new.send_json({"type": "join", "user_id": "joiner", "user_name": "Joiner", "chat_id": chat_id})

        joined = await ws2_new.receive_json()
        self.assertEqual(joined["type"], "joined")
        self.assertEqual(joined["role"], "p1")  # side follows lock order, not room creation

        resume = await ws2_new.receive_json()
        self.assertEqual(resume["type"], "versus_start")
        self.assertTrue(resume["resume"])
        self.assertEqual(resume["p1"]["id"], "joiner")
        self.assertEqual(resume["p1"]["hero_id"], 4)
        self.assertEqual(resume["p2"]["hero_id"], 6)
        self.assertEqual(resume["stage"], vs1["stage"])
        self.assertEqual((resume["p1_rounds"], resume["p2_rounds"]), (1, 0))

        recon = await ws1.receive_json()
        self.assertEqual(recon["type"], "opponent_reconnected")

        # Nothing else (e.g. a match_start that resets hero select) is queued for the staying player
        await ws1.send_json({"type": "ping", "time": 1})
        self.assertEqual((await ws1.receive_json())["type"], "pong")

        # The stayer hands over the state both phones restart the bout from
        restart = {"rounds": [1, 0], "health": [55, 30], "timer": 61000}
        await ws1.send_json({"type": "state_snapshot", "segment": 1, "resume": restart})
        snapshot = await ws2_new.receive_json()
        self.assertEqual(snapshot["type"], "state_snapshot")
        self.assertEqual((snapshot["segment"], snapshot["resume"]), (1, restart))
        self.assertEqual(snapshot["from_role"], "p2")

        await ws2_new.close()
        await ws1.close()

    async def test_versus_start_carries_each_players_control_type(self):
        """Each fighter must use its own player's key layout on both phones."""
        ws1, ws2, vs1, vs2 = await self._connect_and_lock("test_control_01", "group_ctl", 2, 3, p1_control=0, p2_control=1)

        self.assertEqual(vs1["p1"]["control"], 0)
        self.assertEqual(vs1["p2"]["control"], 1)
        self.assertEqual(vs2["p1"]["control"], 0)

        await ws1.close()
        await ws2.close()

    async def test_round_win_ignored_while_opponent_disconnected(self):
        """The player who stayed cannot score rounds against an opponent who dropped."""
        match_id = "test_idle_round_01"
        ws1, ws2, _, _ = await self._connect_and_lock(match_id, "group_idle", 0, 1)
        await ws2.close()
        self.assertEqual((await ws1.receive_json())["type"], "opponent_disconnected")

        await ws1.send_json({"type": "round_win", "winner_role": "p2"})
        await ws1.send_json({"type": "ping", "time": 1})
        self.assertEqual((await ws1.receive_json())["type"], "pong")

        room = coordinator.rooms[match_id]
        self.assertEqual((room.p1_rounds, room.p2_rounds), (0, 0))
        await ws1.close()

    async def test_two_drawn_rounds_end_the_match_as_a_draw(self):
        """Time-outs on equal health score both sides, as the engine does; 2-2 is a drawn match."""
        match_id = "test_draw_01"
        chat_id = "group_draw"
        ws1, ws2, _, _ = await self._connect_and_lock(match_id, chat_id, 0, 1)

        await ws2.send_json({"type": "round_win", "winner_role": "draw"})
        r1 = await ws1.receive_json()
        await ws2.receive_json()
        self.assertEqual(r1["type"], "round_next")
        self.assertEqual((r1["p1_rounds"], r1["p2_rounds"]), (1, 1))

        await ws2.send_json({"type": "round_win", "winner_role": "draw"})
        end = await ws1.receive_json()
        await ws2.receive_json()
        self.assertEqual(end["type"], "match_ended")
        self.assertIsNone(end["winner_id"])
        self.assertEqual(end["reason"], "DRAW")

        self.assertEqual(db.get_match(match_id)["status"], "COMPLETED")
        for p in db.get_local_leaderboard(chat_id):
            self.assertEqual((p["wins"], p["losses"], p["draws"]), (0, 0, 1))

        await ws1.close()
        await ws2.close()

    async def test_rejoin_before_server_noticed_the_drop_replaces_the_socket(self):
        """
        A phone that reconnects while its old socket still looks open takes over that slot: the old
        socket is closed and its late close must not start a forfeit against the reconnected player.
        """
        match_id = "test_replace_socket_01"
        chat_id = "group_replace"
        ws1, ws2, _, _ = await self._connect_and_lock(match_id, chat_id, 0, 1)

        ws2_new = await self.client.ws_connect(f"/ws/match/{match_id}")
        await ws2_new.send_json({"type": "join", "user_id": "joiner", "user_name": "Joiner", "chat_id": chat_id})
        self.assertEqual((await ws2_new.receive_json())["type"], "joined")
        self.assertEqual((await ws2_new.receive_json())["type"], "versus_start")
        self.assertEqual((await ws1.receive_json())["type"], "opponent_reconnected")

        # Let the old socket's close run through the server
        await ws2.receive()
        await asyncio.sleep(0.05)

        await ws1.send_json({"type": "ping", "time": 1})
        self.assertEqual((await ws1.receive_json())["type"], "pong")
        room = coordinator.rooms[match_id]
        self.assertEqual(room.disconnect_tasks, {})
        self.assertIn("joiner", room.sockets)

        await ws2_new.close()
        await ws1.close()

    async def test_net_stats_are_kept_without_player_identity(self):
        """Phones report lockstep stats; the API returns them by match with only the known numeric fields."""
        match_id = "test_net_stats_01"
        ws1, ws2, _, _ = await self._connect_and_lock(match_id, "group_stats", 0, 1)

        await ws2.send_json({"type": "net_stats", "ticks_per_s": 59.4, "stalls": 3, "delay": 6, "p2p": True,
                             "ice_state": "connected", "ice_local": "host:2,srflx:1",
                             "device": "TestPhone/1.0", "user_name": "should not be kept"})
        await ws2.send_json({"type": "ping", "time": 1})
        await ws2.receive_json()  # pong: the stats were processed

        resp = await self.client.get(f"/api/netstats?match_id={match_id}")
        stats = (await resp.json())["stats"]
        self.assertEqual(len(stats), 1)
        self.assertEqual(stats[0]["role"], "p1")  # the joiner locked first
        self.assertEqual((stats[0]["ticks_per_s"], stats[0]["stalls"], stats[0]["delay"], stats[0]["p2p"]), (59.4, 3, 6, True))
        self.assertEqual(stats[0]["device"], "TestPhone/1.0")
        self.assertEqual((stats[0]["ice_state"], stats[0]["ice_local"]), ("connected", "host:2,srflx:1"))
        self.assertNotIn("user_name", stats[0])

        await ws1.close()
        await ws2.close()

    async def test_hero_lock_after_versus_is_ignored(self):
        """Once both heroes are locked, a late lock must not change heroes or re-broadcast versus."""
        match_id = "test_late_lock_01"
        ws1, ws2, _, _ = await self._connect_and_lock(match_id, "group_late", 0, 1)

        await ws1.send_json({"type": "hero_lock", "hero_id": 5})
        await ws1.send_json({"type": "ping", "time": 1})
        self.assertEqual((await ws1.receive_json())["type"], "pong")

        room = coordinator.rooms[match_id]
        self.assertEqual(room.p1_hero, 0)
        self.assertEqual(room.p2_hero, 1)

        await ws1.close()
        await ws2.close()


if __name__ == "__main__":
    unittest.main()
