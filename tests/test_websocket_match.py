"""
Integration tests for the WebSocket match coordinator: open challenges and claims, hero select, lockstep
relay and recording, round scores confirmed by both phones, reconnects and restarts, leaving the app,
spectators, replays, rematches, Telegram identity checks, and housekeeping.
"""

import asyncio
import hashlib
import hmac
import json
import os
import tempfile
import time
import unittest
from unittest.mock import patch
from urllib.parse import urlencode

from aiohttp import WSMsgType
from aiohttp.test_utils import AioHTTPTestCase

import server.db as db
import server.multiplayer as mp
from server.multiplayer import create_app, coordinator

BOT_TOKEN = "123456:TEST-token"


def signed_init_data(token, user, extra=None, auth_date=None):
    """initData the way Telegram signs it (see verify_init_data)."""
    fields = {"auth_date": str(auth_date or int(time.time())), "query_id": "AAHtest",
              "user": json.dumps(user, separators=(",", ":")), **(extra or {})}
    check = "\n".join(f"{k}={v}" for k, v in sorted(fields.items()))
    secret = hmac.new(b"WebAppData", token.encode(), hashlib.sha256).digest()
    fields["hash"] = hmac.new(secret, check.encode(), hashlib.sha256).hexdigest()
    return urlencode(fields)


def input_packet(segment, tick, pressed=0, released=0):
    """A lockstep input packet: [4, segment, hint, hintSeq, tick, pressed, released, senderTick]."""
    return (bytes([4, segment & 0xFF, 0, 0]) + tick.to_bytes(4, "big") + pressed.to_bytes(4, "big")
            + released.to_bytes(4, "big") + (0).to_bytes(4, "big"))


async def recv_type(ws, wanted, timeout=3.0):
    """The next JSON message of type `wanted`, skipping others."""
    deadline = time.monotonic() + timeout
    while True:
        msg = await ws.receive(timeout=max(0.01, deadline - time.monotonic()))
        if msg.type == WSMsgType.TEXT:
            data = json.loads(msg.data)
            if data.get("type") == wanted:
                return data


async def drain(ws, timeout=0.15):
    """Everything queued on a socket right now: (json messages, binary payloads)."""
    texts, binaries = [], []
    while True:
        try:
            msg = await ws.receive(timeout=timeout)
        except asyncio.TimeoutError:
            return texts, binaries
        if msg.type == WSMsgType.TEXT:
            texts.append(json.loads(msg.data))
        elif msg.type == WSMsgType.BINARY:
            binaries.append(msg.data)
        else:
            return texts, binaries


def types_of(messages):
    return [m.get("type") for m in messages]


class MatchTestCase(AioHTTPTestCase):
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
        coordinator.notifier = None
        db.DB_PATH = self.orig_db
        try:
            os.remove(self.test_db)
        except OSError:
            pass

    async def join(self, match_id, user_id, name, chat_id="group_1", **extra):
        ws = await self.client.ws_connect(f"/ws/match/{match_id}")
        await ws.send_json({"type": "join", "user_id": user_id, "user_name": name, "chat_id": chat_id, **extra})
        return ws

    async def start_match(self, match_id, chat_id="group_1"):
        """Creator and joiner connect; both are in hero select."""
        ws1 = await self.join(match_id, "creator", "Creator", chat_id)
        self.assertEqual((await recv_type(ws1, "joined"))["role"], "p1")
        ws2 = await self.join(match_id, "joiner", "Joiner", chat_id)
        self.assertEqual((await recv_type(ws2, "joined"))["role"], "p2")
        await recv_type(ws1, "match_start")
        await recv_type(ws2, "match_start")
        return ws1, ws2

    async def start_bout(self, match_id, chat_id="group_1", p1_hero=0, p2_hero=1, p1_control=1, p2_control=1):
        """The joiner locks first, so it fights as P1. Returns (creator ws, joiner ws, versus for each)."""
        ws1, ws2 = await self.start_match(match_id, chat_id)
        await ws2.send_json({"type": "hero_lock", "hero_id": p1_hero, "control": p1_control})
        await recv_type(ws1, "peer_hero_lock")
        await ws1.send_json({"type": "hero_lock", "hero_id": p2_hero, "control": p2_control})
        vs1 = await recv_type(ws1, "versus_start")
        vs2 = await recv_type(ws2, "versus_start")
        return ws1, ws2, vs1, vs2

    async def report(self, sockets, p1, p2):
        for ws in sockets:
            await ws.send_json({"type": "round_score", "p1": p1, "p2": p2})

    async def settle(self):
        """Lets the server finish handling what was sent."""
        await asyncio.sleep(0.05)


class TestLobby(MatchTestCase):
    async def test_both_players_join_and_enter_hero_select(self):
        ws1 = await self.join("m_join", "p1_user", "Sub-Zero")
        self.assertEqual((await recv_type(ws1, "joined"))["role"], "p1")
        waiting = await recv_type(ws1, "waiting_opponent")
        self.assertLessEqual(waiting["remaining_seconds"], db.CHALLENGE_WINDOW_SECONDS)
        self.assertIsNone(waiting["waiting_for"])

        ws2 = await self.join("m_join", "p2_user", "Scorpion")
        self.assertEqual((await recv_type(ws2, "joined"))["role"], "p2")
        start1 = await recv_type(ws1, "match_start")
        start2 = await recv_type(ws2, "match_start")
        self.assertEqual(start1["stage"], "hero_select")
        self.assertEqual((start1["p1"]["name"], start1["p2"]["name"]), ("Sub-Zero", "Scorpion"))
        self.assertEqual(start2["locks"], {})
        self.assertEqual(db.get_match("m_join")["status"], "ACTIVE")

    async def test_accepting_player_waits_for_creator_who_is_notified(self):
        events = []

        async def notifier(event, info):
            events.append((event, info))
        coordinator.notifier = notifier
        db.create_match("m_claim", "group_1", "alice", "Alice")

        bob = await self.join("m_claim", "bob", "Bob")
        self.assertEqual((await recv_type(bob, "joined"))["role"], "p2")
        waiting = await recv_type(bob, "waiting_opponent")
        self.assertEqual(waiting["waiting_for"], {"id": "alice", "name": "Alice"})
        await self.settle()
        self.assertEqual([e for e, _ in events], ["challenge_accepted"])
        self.assertEqual(events[0][1]["opponent"], {"id": "bob", "name": "Bob"})

        # A third person is now only a spectator
        carol = await self.join("m_claim", "carol", "Carol")
        self.assertEqual((await recv_type(carol, "joined"))["role"], "spectator")

        alice = await self.join("m_claim", "alice", "Alice")
        await recv_type(alice, "match_start")
        await recv_type(bob, "match_start")
        await self.settle()
        self.assertEqual([e for e, _ in events], ["challenge_accepted", "match_started"])

    async def test_claim_is_released_if_the_accepting_player_leaves_first(self):
        db.create_match("m_release", "group_1", "alice", "Alice")
        bob = await self.join("m_release", "bob", "Bob")
        await recv_type(bob, "waiting_opponent")
        await bob.close()
        await self.settle()

        carol = await self.join("m_release", "carol", "Carol")
        self.assertEqual((await recv_type(carol, "joined"))["role"], "p2")
        self.assertEqual(coordinator.rooms["m_release"].opponent_id, "carol")

    async def test_challenge_expires_when_nobody_accepts(self):
        room = coordinator.get_or_create_room("m_expire", "group_1", "u1", "Fighter 1")
        room.expires_at = time.time() + 0.1
        room.join_timeout_task.cancel()
        room.join_timeout_task = asyncio.create_task(coordinator._watch_join_timeout(room))

        ws = await self.join("m_expire", "u1", "Fighter 1")
        cancelled = await recv_type(ws, "match_cancelled")
        self.assertEqual(cancelled["reason"], "JOIN_TIMEOUT")
        self.assertEqual(db.get_match("m_expire")["status"], "CANCELLED")

    async def test_two_tabs_with_the_same_id_play_each_other_in_development(self):
        ws1 = await self.join("m_tabs", "same_user", "Shared")
        self.assertEqual((await recv_type(ws1, "joined"))["role"], "p1")
        ws2 = await self.join("m_tabs", "same_user", "Shared")
        self.assertEqual((await recv_type(ws2, "joined"))["role"], "p2")
        await recv_type(ws1, "match_start")
        await recv_type(ws2, "match_start")
        self.assertEqual(coordinator.rooms["m_tabs"].status, "ACTIVE")

    async def test_a_lock_made_while_waiting_survives_the_opponent_arriving(self):
        ws1 = await self.join("m_early", "creator", "Creator")
        await recv_type(ws1, "waiting_opponent")
        await ws1.send_json({"type": "hero_lock", "hero_id": 4})
        await self.settle()
        ws2 = await self.join("m_early", "joiner", "Joiner")
        start = await recv_type(ws2, "match_start")
        self.assertEqual(start["locks"], {"creator": 4})


class TestHeroSelectAndRounds(MatchTestCase):
    async def test_whoever_locks_first_fights_as_p1(self):
        ws1, ws2 = await self.start_match("m_order")
        await ws2.send_json({"type": "hero_lock", "hero_id": 5})
        lock = await recv_type(ws1, "peer_hero_lock")
        self.assertEqual((lock["from_role"], lock["player_id"], lock["hero_id"]), ("p1", "joiner", 5))
        await recv_type(ws2, "peer_hero_lock")  # the joiner's own lock comes back to it too
        await ws1.send_json({"type": "hero_lock", "hero_id": 2})
        lock = await recv_type(ws2, "peer_hero_lock")
        self.assertEqual((lock["from_role"], lock["player_id"]), ("p2", "creator"))
        vs = await recv_type(ws1, "versus_start")
        self.assertEqual((vs["p1"]["id"], vs["p1"]["hero_id"], vs["p2"]["id"], vs["p2"]["hero_id"]),
                         ("joiner", 5, "creator", 2))

    async def test_versus_shares_stage_seed_and_control_types(self):
        _, _, vs1, vs2 = await self.start_bout("m_vs", p1_hero=3, p2_hero=3, p1_control=0, p2_control=1)
        self.assertIn(vs1["stage"], range(5))
        self.assertEqual((vs1["stage"], vs1["seed"]), (vs2["stage"], vs2["seed"]))
        self.assertIsInstance(vs1["seed"], int)
        self.assertEqual((vs1["p1"]["control"], vs1["p2"]["control"]), (0, 1))

    async def test_lock_after_versus_is_ignored(self):
        ws1, ws2, _, _ = await self.start_bout("m_late_lock", p1_hero=0, p2_hero=1)
        await ws1.send_json({"type": "hero_lock", "hero_id": 5})
        await self.settle()
        room = coordinator.rooms["m_late_lock"]
        self.assertEqual((room.p1_hero, room.p2_hero), (0, 1))

    async def test_best_of_three_counts_only_scores_both_phones_report(self):
        ws1, ws2, _, _ = await self.start_bout("m_rounds", "group_rounds")

        await ws2.send_json({"type": "round_score", "p1": 1, "p2": 0})  # one phone alone doesn't count
        await self.settle()
        self.assertEqual(coordinator.rooms["m_rounds"].p1_rounds, 0)
        await ws1.send_json({"type": "round_score", "p1": 0, "p2": 1})  # a disagreeing phone doesn't either
        await self.settle()
        self.assertEqual((coordinator.rooms["m_rounds"].p1_rounds, coordinator.rooms["m_rounds"].p2_rounds), (0, 0))

        await self.report([ws1], 1, 0)
        r1 = await recv_type(ws2, "round_next")
        self.assertEqual((r1["p1_rounds"], r1["p2_rounds"], r1["round_num"]), (1, 0, 2))
        await self.report([ws1, ws2], 1, 1)
        await recv_type(ws2, "round_next")
        await self.report([ws1, ws2], 2, 1)
        end = await recv_type(ws1, "match_ended")
        self.assertEqual((end["winner_id"], end["winner_role"], end["p1_rounds"], end["p2_rounds"]), ("joiner", "p1", 2, 1))
        self.assertEqual(end["reason"], "KNOCKOUT")
        lb = {p["user_id"]: p for p in db.get_local_leaderboard("group_rounds")}
        self.assertEqual((lb["joiner"]["wins"], lb["creator"]["losses"]), (1, 1))

    async def test_two_drawn_rounds_end_the_match_as_a_draw(self):
        ws1, ws2, _, _ = await self.start_bout("m_draw", "group_draw")
        await self.report([ws1, ws2], 1, 1)
        await recv_type(ws1, "round_next")
        await self.report([ws1, ws2], 2, 2)
        end = await recv_type(ws1, "match_ended")
        self.assertIsNone(end["winner_id"])
        self.assertEqual(end["reason"], "DRAW")
        for p in db.get_local_leaderboard("group_draw"):
            self.assertEqual((p["wins"], p["losses"], p["draws"]), (0, 0, 1))

    async def test_a_client_cannot_declare_the_winner(self):
        ws1, ws2, _, _ = await self.start_bout("m_cheat", "group_cheat")
        await ws2.send_json({"type": "match_finish", "winner_id": "joiner", "reason": "KNOCKOUT"})
        await ws2.send_json({"type": "round_win", "winner_role": "p1"})
        await self.settle()
        self.assertEqual(db.get_match("m_cheat")["status"], "ACTIVE")
        self.assertEqual(db.get_local_leaderboard("group_cheat"), [])


class TestRelayAndRecording(MatchTestCase):
    async def test_inputs_and_rtc_signals_reach_only_the_opponent(self):
        ws1, ws2, _, _ = await self.start_bout("m_relay")
        await ws1.send_json({"type": "rtc_signal", "signal": {"type": "offer", "sdp": "v=0"}})
        sig = await recv_type(ws2, "rtc_signal")
        self.assertEqual((sig["from_role"], sig["signal"]["type"]), ("p2", "offer"))

        packet = input_packet(0, 0, pressed=16)
        await ws2.send_bytes(packet)
        msg = await ws1.receive(timeout=2)
        while msg.type != WSMsgType.BINARY:
            msg = await ws1.receive(timeout=2)
        self.assertEqual(msg.data, packet)

    async def test_spectator_catches_up_from_the_recording_then_gets_live_inputs(self):
        ws1, ws2, _, _ = await self.start_bout("m_watch")
        # joiner is P1 (side 0), creator is P2 (side 1)
        for tick in range(3):
            await ws2.send_bytes(input_packet(0, tick, pressed=4 if tick == 1 else 0))
            await ws1.send_bytes(input_packet(0, tick))
        await ws2.send_bytes(input_packet(0, 1, pressed=99))  # a duplicate tick is not recorded twice
        await self.settle()

        carol = await self.join("m_watch", "carol", "Carol")
        self.assertEqual((await recv_type(carol, "joined"))["role"], "spectator")
        spectate = await recv_type(carol, "spectate")
        self.assertEqual(spectate["setup"]["p1"]["id"], "joiner")
        self.assertEqual(spectate["segment"]["p1"], [[1, 4, 0]])
        self.assertEqual(spectate["segment"]["ticks"], [3, 3])
        self.assertEqual((await recv_type(ws1, "spectators"))["count"], 1)

        await ws1.send_bytes(input_packet(0, 3, released=8))
        texts, binaries = await drain(carol)
        self.assertEqual(binaries, [bytes([8, 1]) + input_packet(0, 3, released=8)])

        # The spectator leaving is not the opponent leaving
        await carol.close()
        count = await recv_type(ws1, "spectators")
        self.assertEqual(count["count"], 0)
        texts, _ = await drain(ws1)
        self.assertNotIn("opponent_disconnected", types_of(texts))

    async def test_finished_match_has_a_replay(self):
        ws1, ws2, vs, _ = await self.start_bout("m_replay")
        for tick in range(5):
            await ws2.send_bytes(input_packet(0, tick, pressed=2 if tick == 2 else 0))
            await ws1.send_bytes(input_packet(0, tick))
        await self.report([ws1, ws2], 2, 0)
        end = await recv_type(ws1, "match_ended")
        self.assertTrue(end["replay"])

        resp = await self.client.get("/api/replay/m_replay")
        self.assertEqual(resp.status, 200)
        replay = (await resp.json())["replay"]
        self.assertEqual(replay["setup"]["seed"], vs["seed"])
        self.assertEqual(replay["segments"][0]["p1"], [[2, 2, 0]])
        self.assertEqual(replay["segments"][0]["ticks"], [5, 5])
        self.assertEqual(replay["result"]["winner_id"], "joiner")
        self.assertEqual((await self.client.get("/api/replay/nope")).status, 404)


class TestLeavingAndComingBack(MatchTestCase):
    async def test_drop_during_hero_select_and_reconnect(self):
        ws1, ws2 = await self.start_match("m_reconnect")
        await ws1.close()
        disc = await recv_type(ws2, "opponent_disconnected")
        self.assertEqual((disc["disconnected_id"], disc["remaining_seconds"]), ("creator", 60))

        ws1 = await self.join("m_reconnect", "creator", "Creator")
        await recv_type(ws1, "joined")
        await recv_type(ws1, "match_start")  # back to hero select, for the rejoining player only
        recon = await recv_type(ws2, "opponent_reconnected")
        self.assertEqual(recon["player_id"], "creator")
        texts, _ = await drain(ws2)
        self.assertNotIn("match_start", types_of(texts))

    async def test_forfeit_after_the_grace_period(self):
        with patch.object(mp, "RECONNECT_GRACE_SECONDS", 0.3):
            ws1, ws2, _, _ = await self.start_bout("m_forfeit", "group_forfeit")
            await ws2.close()  # the joiner (P1) leaves
            await recv_type(ws1, "opponent_disconnected")
            end = await recv_type(ws1, "match_ended", timeout=3)
        self.assertEqual((end["winner_id"], end["reason"]), ("creator", "AUTOWIN_DISCONNECT"))
        lb = {p["user_id"]: p for p in db.get_local_leaderboard("group_forfeit")}
        self.assertEqual((lb["creator"]["wins"], lb["joiner"]["losses"]), (1, 1))

    async def test_both_leaving_abandons_the_match_without_a_winner(self):
        with patch.object(mp, "RECONNECT_GRACE_SECONDS", 0.3):
            ws1, ws2 = await self.start_match("m_both_exit", "group_exit")
            await ws1.close()
            await self.settle()
            await ws2.close()
            await self.settle()
            self.assertEqual(coordinator.rooms["m_both_exit"].status, "ACTIVE")  # either may still come back
            await asyncio.sleep(0.5)
        self.assertEqual(coordinator.rooms["m_both_exit"].status, "ABANDONED")
        m = db.get_match("m_both_exit")
        self.assertEqual((m["status"], m["winner_id"], m["finish_reason"]), ("ABANDONED", None, "BOTH_DISCONNECTED"))
        for p in db.get_local_leaderboard("group_exit"):
            self.assertEqual((p["wins"], p["losses"], p["draws"]), (0, 0, 1))

    async def test_rejoin_mid_bout_restarts_both_phones_from_the_player_who_stayed(self):
        ws1, ws2, vs1, _ = await self.start_bout("m_rejoin", p1_hero=4, p2_hero=6)
        await self.report([ws1, ws2], 1, 0)
        await recv_type(ws1, "round_next")
        await ws2.close()  # the joiner (P1) drops
        await recv_type(ws1, "opponent_disconnected")

        ws2 = await self.join("m_rejoin", "joiner", "Joiner", bout_live=False)  # reloaded: no bout on this phone
        self.assertEqual((await recv_type(ws2, "joined"))["role"], "p1")
        resume = await recv_type(ws2, "versus_start")
        self.assertTrue(resume["resume"])
        self.assertEqual((resume["p1"]["hero_id"], resume["p2"]["hero_id"], resume["stage"]), (4, 6, vs1["stage"]))
        self.assertEqual((resume["p1_rounds"], resume["p2_rounds"]), (1, 0))

        await recv_type(ws1, "opponent_reconnected")
        restart = await recv_type(ws1, "restart_request")
        self.assertEqual(restart["segment"], 1)
        state = {"rounds": [1, 0], "health": [55, 30], "timer": 61000}
        await ws1.send_json({"type": "state_snapshot", "segment": 1, "resume": state})
        snapshot = await recv_type(ws2, "state_snapshot")
        self.assertEqual((snapshot["segment"], snapshot["resume"], snapshot["from_role"]), (1, state, "p2"))

    async def test_rejoin_before_the_old_socket_closed_replaces_it(self):
        ws1, ws2, _, _ = await self.start_bout("m_replace")
        ws2_new = await self.join("m_replace", "joiner", "Joiner", bout_live=True)
        await recv_type(ws2_new, "joined")
        await recv_type(ws2_new, "versus_start")
        await recv_type(ws1, "opponent_reconnected")
        await recv_type(ws1, "restart_request")
        await ws2.receive()  # the old socket is closed by the server
        await self.settle()
        room = coordinator.rooms["m_replace"]
        self.assertEqual(room.disconnect_tasks, {})
        self.assertIs(room.sockets["joiner"].closed, False)

    async def test_leaving_the_app_starts_the_countdown_and_coming_back_cancels_it(self):
        ws1, ws2, _, _ = await self.start_bout("m_away")
        await ws2.send_json({"type": "away"})
        away = await recv_type(ws1, "opponent_away")
        self.assertEqual(away["remaining_seconds"], 60)
        self.assertIn("joiner", coordinator.rooms["m_away"].disconnect_tasks)
        await ws2.send_json({"type": "back"})
        await recv_type(ws1, "opponent_back")
        self.assertEqual(coordinator.rooms["m_away"].disconnect_tasks, {})

    async def test_both_reloading_at_once_keeps_the_match(self):
        """A deploy reloads both phones together: both drop, both come back, the bout goes on."""
        ws1, ws2, _, _ = await self.start_bout("m_both_reload")
        await ws1.close()
        await ws2.close()
        await self.settle()
        ws1 = await self.join("m_both_reload", "creator", "Creator")
        ws2 = await self.join("m_both_reload", "joiner", "Joiner")
        snapshot = await recv_type(ws2, "state_snapshot")
        self.assertEqual(snapshot["from_role"], "server")
        self.assertEqual(coordinator.rooms["m_both_reload"].status, "ACTIVE")
        self.assertEqual(coordinator.rooms["m_both_reload"].disconnect_tasks, {})

    async def test_away_player_loses_when_the_grace_runs_out(self):
        with patch.object(mp, "RECONNECT_GRACE_SECONDS", 0.3):
            ws1, ws2, _, _ = await self.start_bout("m_away_loss")
            await ws2.send_json({"type": "away"})
            end = await recv_type(ws1, "match_ended", timeout=3)
        self.assertEqual(end["winner_id"], "creator")

    async def test_server_restart_mid_bout_resumes_from_the_confirmed_score(self):
        ws1, ws2, vs, _ = await self.start_bout("m_restart")
        await self.report([ws1, ws2], 1, 0)
        await recv_type(ws1, "round_next")

        # The process restarts: its rooms are gone, the database remains
        old_room = coordinator.rooms.pop("m_restart")
        old_room.sockets.clear()
        await ws1.close()
        await ws2.close()
        await self.settle()

        ws1 = await self.join("m_restart", "creator", "Creator")
        await recv_type(ws1, "joined")
        resume = await recv_type(ws1, "versus_start")
        self.assertEqual((resume["seed"], resume["p1_rounds"]), (vs["seed"], 1))
        await recv_type(ws1, "opponent_disconnected")  # the other player has the grace period to come back

        ws2 = await self.join("m_restart", "joiner", "Joiner")
        await recv_type(ws2, "versus_start")
        snap1 = await recv_type(ws1, "state_snapshot")
        snap2 = await recv_type(ws2, "state_snapshot")
        self.assertEqual(snap1, snap2)
        self.assertEqual((snap1["from_role"], snap1["segment"]), ("server", 1))
        self.assertEqual(snap1["resume"], {"rounds": [1, 0], "health": None, "timer": 0})


class TestRematch(MatchTestCase):
    async def test_both_asking_opens_a_new_match_for_the_same_pair(self):
        ws1, ws2, _, _ = await self.start_bout("m_first", "group_rm")
        await self.report([ws1, ws2], 2, 0)
        await recv_type(ws1, "match_ended")

        await ws1.send_json({"type": "rematch_request"})
        status = await recv_type(ws2, "rematch_status")
        self.assertEqual(status["requested"], ["creator"])
        await ws2.send_json({"type": "rematch_request"})
        start1 = await recv_type(ws1, "rematch_start")
        start2 = await recv_type(ws2, "rematch_start")
        new_id = start1["match_id"]
        self.assertEqual(start2["match_id"], new_id)
        new_match = db.get_match(new_id)
        self.assertEqual((new_match["creator_id"], new_match["opponent_id"], new_match["rematch_of"]),
                         ("creator", "joiner", "m_first"))

        a = await self.join(new_id, "creator", "Creator")
        b = await self.join(new_id, "joiner", "Joiner")
        await recv_type(a, "match_start")
        await recv_type(b, "match_start")
        # The new match can't be taken by someone else
        c = await self.join(new_id, "carol", "Carol")
        self.assertEqual((await recv_type(c, "joined"))["role"], "spectator")


class TestTelegramIdentity(MatchTestCase):
    def test_signature_check_matches_aiogram(self):
        from aiogram.utils.web_app import check_webapp_signature
        data = signed_init_data(BOT_TOKEN, {"id": 42, "first_name": "Ann"}, extra={"signature": "abc", "chat_instance": "-77"})
        self.assertTrue(check_webapp_signature(BOT_TOKEN, data))
        who = mp.verify_init_data(data, BOT_TOKEN)
        self.assertEqual((who["id"], who["name"], who["chat_instance"]), ("42", "Ann", "-77"))
        self.assertIsNone(mp.verify_init_data(data, "999:other-token"))
        self.assertIsNone(mp.verify_init_data(data.replace("Ann", "Bob"), BOT_TOKEN))
        stale = signed_init_data(BOT_TOKEN, {"id": 42}, auth_date=int(time.time()) - 3 * 86400)
        self.assertIsNone(mp.verify_init_data(stale, BOT_TOKEN))

    async def test_production_requires_genuine_telegram_identity(self):
        db.create_match("m_auth", "group_1", "42", "Ann")
        env = {"REQUIRE_TG_AUTH": "1", "TELEGRAM_BOT_TOKEN": BOT_TOKEN}
        with patch.dict(os.environ, env):
            # Claiming to be someone without Telegram's signature is refused
            fake = await self.join("m_auth", "42", "Ann")
            self.assertEqual((await recv_type(fake, "auth_failed"))["type"], "auth_failed")

            # The id comes from the signed data, whatever user_id the client claims
            ws = await self.join("m_auth", "42", "Ann",
                                 init_data=signed_init_data(BOT_TOKEN, {"id": 77, "first_name": "Bob"}))
            joined = await recv_type(ws, "joined")
            self.assertEqual((joined["player_id"], joined["role"]), ("77", "p2"))

            # Unknown matches can't be created from the game in production
            with patch.object(mp, "NEW_CHALLENGE_WAIT_SECONDS", 0.3):
                other = await self.join("m_unknown", "1", "X", init_data=signed_init_data(BOT_TOKEN, {"id": 1}))
                self.assertEqual((await recv_type(other, "match_cancelled"))["reason"], "NOT_FOUND")
            self.assertIsNone(db.get_match("m_unknown"))

    async def test_join_waits_for_an_inline_challenge_that_was_just_sent(self):
        """The bot creates an inline challenge's match when Telegram reports it sent; a fast tap can beat that."""
        env = {"REQUIRE_TG_AUTH": "1", "TELEGRAM_BOT_TOKEN": BOT_TOKEN}
        with patch.dict(os.environ, env):
            ws = await self.join("m_fast", "", "", init_data=signed_init_data(BOT_TOKEN, {"id": 77, "first_name": "Bob"}))
            await asyncio.sleep(0.4)
            db.create_match("m_fast", "inline", "42", "Ann")
            joined = await recv_type(ws, "joined")
        self.assertEqual((joined["player_id"], joined["role"]), ("77", "p2"))

    async def test_inline_challenge_records_the_chat_it_was_played_in(self):
        db.create_match("m_inline", "inline", "42", "Ann")
        env = {"REQUIRE_TG_AUTH": "1", "TELEGRAM_BOT_TOKEN": BOT_TOKEN}
        with patch.dict(os.environ, env):
            ws = await self.join("m_inline", "", "", init_data=signed_init_data(
                BOT_TOKEN, {"id": 77, "first_name": "Bob"}, extra={"chat_instance": "-555", "chat_type": "supergroup"}))
            await recv_type(ws, "joined")
        self.assertEqual(db.get_match("m_inline")["chat_instance"], "-555")


class TestHousekeepingAndApi(MatchTestCase):
    async def test_net_stats_are_kept_without_player_identity(self):
        ws1, ws2, _, _ = await self.start_bout("m_stats")
        await ws2.send_json({"type": "net_stats", "ticks_per_s": 59.4, "stalls": 3, "delay": 6, "p2p": True,
                             "desyncs": 0, "ice_state": "connected", "ice_local": "host:2,srflx:1",
                             "device": "TestPhone/1.0", "user_name": "should not be kept"})
        await ws2.send_json({"type": "ping", "time": 1})
        await recv_type(ws2, "pong")
        stats = (await (await self.client.get("/api/netstats?match_id=m_stats")).json())["stats"]
        self.assertEqual(len(stats), 1)
        self.assertEqual((stats[0]["role"], stats[0]["ticks_per_s"], stats[0]["p2p"], stats[0]["desyncs"]), ("p1", 59.4, True, 0))
        self.assertEqual((stats[0]["ice_state"], stats[0]["device"]), ("connected", "TestPhone/1.0"))
        self.assertNotIn("user_name", stats[0])

    async def test_sweep_closes_matches_left_hanging(self):
        db.create_match("m_old_wait", "g", "a", "A", timeout_seconds=-10)
        db.create_match("m_old_active", "g", "a", "A")
        db.join_match("m_old_active", "b", "B")
        with db.get_db_connection() as conn:
            conn.execute("UPDATE matches SET started_at = ? WHERE match_id = 'm_old_active'", (time.time() - 7200,))
            conn.commit()
        coordinator.sweep()
        self.assertEqual(db.get_match("m_old_wait")["status"], "CANCELLED")
        self.assertEqual((db.get_match("m_old_active")["status"], db.get_match("m_old_active")["finish_reason"]),
                         ("ABANDONED", "STALE"))
        self.assertEqual(db.get_local_leaderboard("g"), [])

    async def test_health_and_public_match_details(self):
        health = await (await self.client.get("/api/health")).json()
        self.assertEqual((health["status"], health["active_matches"]), ("ok", 0))
        db.create_match("m_pub", "-100123", "42", "Ann")
        match = (await (await self.client.get("/api/match/m_pub")).json())["match"]
        self.assertEqual(match["status"], "WAITING")
        self.assertNotIn("creator_id", match)
        self.assertNotIn("chat_id", match)
        self.assertEqual((await self.client.get("/api/leaderboard?limit=abc")).status, 200)


if __name__ == "__main__":
    unittest.main()
