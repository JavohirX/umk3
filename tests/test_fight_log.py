"""
The fight log and admin panel on the running server: what a real match leaves in the log, that nothing a phone sends can
break its connection, and that the panel answers nobody without a signed link.
"""

import asyncio
import json
import os
import tempfile
import time
from unittest.mock import AsyncMock, MagicMock, patch

import bot
import server.admin as admin
import server.db as db
import server.multiplayer as mp
from server.telemetry import telemetry
from tests.test_websocket_match import MatchTestCase, input_packet, recv_type


def events_of(match_id, *kinds):
    telemetry.flush()
    conn = db.get_db_connection()
    try:
        marks = ",".join("?" * len(kinds))
        rows = conn.execute(f"SELECT * FROM match_events WHERE match_id = ? AND kind IN ({marks}) ORDER BY id", (match_id, *kinds)).fetchall()
        return [{**dict(r), "data": json.loads(r["data"]) if r["data"] else {}} for r in rows]
    finally:
        conn.close()


def windows_of(match_id):
    telemetry.flush()
    conn = db.get_db_connection()
    try:
        return [dict(r) for r in conn.execute("SELECT * FROM net_windows WHERE match_id = ? ORDER BY id", (match_id,))]
    finally:
        conn.close()


GOOD_REPORT = {"type": "net_stats", "segment": 0, "seq": 0, "reason": "interval", "secs": 10, "ticks": 600, "stalls": 1, "stall_ms": 300, "p2p": True, "ice_path": "relay-relay",
               "live_delay_hist": [0, 0, 0, 0, 600] + [0] * 11, "live_frame_hist": [600, 0, 0, 0, 0, 0, 0], "live_stall_hist": [0, 0, 0, 1, 0],
               "freezes": [{"kind": "stall", "ms": 300, "ago_ms": 2000, "tick": 480, "live": True, "open": False}]}


class TestWhatAFightLeavesInTheLog(MatchTestCase):
    async def test_a_whole_fight(self):
        before = time.time()
        with patch.dict(os.environ, {"BUILD_VERSION": "abc1234"}):
            ws1, ws2, _, _ = await self.start_bout("m_log", p1_hero=3, p2_hero=5)
            await self.report([ws1, ws2], 1, 0)
            await recv_type(ws1, "round_next")
            await self.report([ws1, ws2], 2, 0)
            await recv_type(ws1, "match_ended")
        await self.settle()

        match = db.get_match("m_log")
        self.assertGreaterEqual(match["fight_started_at"], before)
        self.assertGreaterEqual(match["ended_at"], match["fight_started_at"])
        self.assertEqual((match["p1_id"], match["p2_id"]), ("joiner", "creator"))  # the joiner locks first in start_bout
        self.assertEqual((match["p1_hero"], match["p2_hero"], match["p1_rounds"], match["p2_rounds"]), (3, 5, 2, 0))
        self.assertEqual((match["build"], match["segment"]), ("abc1234", 0))
        self.assertIn(match["stage"], range(5))

        kinds = [e["kind"] for e in events_of("m_log", "seat_claimed", "player_connected", "hero_locked", "fight_started", "round_settled", "match_finished")]
        self.assertEqual(kinds, ["player_connected", "seat_claimed", "player_connected", "hero_locked", "hero_locked", "fight_started", "round_settled", "round_settled", "match_finished"])
        finished = events_of("m_log", "match_finished")[0]
        self.assertEqual(finished["data"]["reason"], "KNOCKOUT")
        self.assertEqual(finished["data"]["winner"], "joiner")
        settled = events_of("m_log", "round_settled")
        self.assertEqual([(e["data"]["p1"], e["data"]["p2"]) for e in settled], [(1, 0), (2, 0)])

    async def test_a_phone_report_lands_in_the_log_with_its_freezes(self):
        ws1, ws2, _, _ = await self.start_bout("m_report")
        await ws2.send_json({**GOOD_REPORT, "paused_ms": 2000, "hidden_ms": 1000})
        await ws2.send_json({"type": "ping", "time": 1})
        await recv_type(ws2, "pong")
        rows = windows_of("m_report")
        self.assertEqual(len(rows), 1)
        self.assertEqual((rows[0]["role"], rows[0]["player_id"], rows[0]["ticks"], rows[0]["stalls"], rows[0]["p2p"]), ("p1", "joiner", 600, 1, 1))
        self.assertEqual(rows[0]["active_secs"], 7.0)
        self.assertEqual(rows[0]["ice_path"], "relay-relay")
        freeze = events_of("m_report", "freeze")[0]
        self.assertEqual((freeze["role"], freeze["data"]["kind"], freeze["data"]["ms"], freeze["data"]["tick"], freeze["data"]["live"]), ("p1", "stall", 300, 480, True))
        self.assertAlmostEqual(freeze["at"], rows[0]["received_at"] - 2, delta=0.01)  # placed when it began, not when reported
        # Reports stay available the old way too
        recent = (await (await self.client.get("/api/netstats?match_id=m_report")).json())["stats"]
        self.assertEqual(recent[0]["stalls"], 1)

    async def test_the_device_goes_on_the_report_and_the_player(self):
        await self.start_match("m_device")  # just to have a room; this phone joins below
        ua = "Mozilla/5.0 (Linux; Android 13; SM-A135F Build/X; wv) Telegram-Android/10.2 (Samsung SM-A135F; Android 13; SDK 33; LOW)"
        ws = await self.join("m_dev2", "phone1", "Ann", client={"platform": "android", "ua": ua, "cores": 8, "boot_ms": 1500})
        await recv_type(ws, "joined")
        ws_b = await self.join("m_dev2", "phone2", "Bob", client={"platform": "ios"})
        await recv_type(ws_b, "joined")
        await recv_type(ws, "match_start")
        await ws.send_json({"type": "hero_lock", "hero_id": 0})
        await recv_type(ws, "peer_hero_lock")
        await ws_b.send_json({"type": "hero_lock", "hero_id": 1})
        await recv_type(ws, "versus_start")
        await ws.send_json(GOOD_REPORT)
        await ws.send_json({"type": "ping", "time": 1})
        await recv_type(ws, "pong")
        row = windows_of("m_dev2")[0]
        self.assertEqual((row["platform"], row["os"], row["model"], row["perf_class"]), ("android", "Android 13", "Samsung SM-A135F", "LOW"))
        connected = events_of("m_dev2", "player_connected")[0]
        self.assertEqual((connected["data"]["client"]["cores"], connected["data"]["client"]["boot_ms"]), (8, 1500))
        conn = db.get_db_connection()
        player = dict(conn.execute("SELECT * FROM players WHERE player_id = 'phone1'").fetchone())
        conn.close()
        self.assertEqual((player["name"], player["platform"], player["model"]), ("Ann", "android", "Samsung SM-A135F"))

    async def test_nothing_a_phone_sends_can_end_its_connection(self):
        ws1, ws2, _, _ = await self.start_bout("m_fuzz")
        junk = [
            {"type": "net_stats"}, {"type": "net_stats", "secs": "x", "freezes": "nope"}, {"type": "net_stats", "freezes": [{"kind": "stall"}, 5, None, {"kind": "hitch", "ms": 1, "ago_ms": 1, "tick": "t"}]},
            {"type": "net_stats", "secs": 1e308, "ticks": -1, "live_delay_hist": {"a": 1}, "segment": "zero", "p2p": [], "ice_path": 5, "reason": {"x": 1}},
            {"type": "net_stats", "freezes": [{"kind": "stall", "ms": 1, "ago_ms": 1, "match_id": "x", "at": 5, "kind2": 1}]},
            {"type": "net_event"}, {"type": "net_event", "kind": "desync"}, {"type": "net_event", "kind": "desync", "segment": "a", "tick": {}},
            {"type": "net_event", "kind": "loop_error", "message": {"a": 1}}, {"type": "net_event", "kind": "whatever", "kind2": 1},
        ]
        for message in junk:
            await ws2.send_json(message)
        await ws2.send_str('{"type": "net_stats", "stall_ms": NaN, "frames": Infinity}')
        await ws2.send_json({"type": "ping", "time": 7})
        pong = await recv_type(ws2, "pong")
        self.assertEqual(pong["time"], 7)
        self.assertFalse(ws2.closed)
        self.assertIn("joiner", coordinator_room("m_fuzz").sockets)
        # And none of it upset the database: whatever got through was storable
        before = telemetry.health()["write_errors"]
        telemetry.flush()
        self.assertEqual(telemetry.health()["write_errors"], before)

    async def test_join_junk_cant_end_a_connection_either(self):
        ws = await self.join("m_join_junk", "a", "A", client={"ua": 5, "platform": [], "cores": "x", "boot_ms": float("inf") if False else "y"})
        self.assertEqual((await recv_type(ws, "joined"))["role"], "p1")
        ws2 = await self.join("m_join_junk", "b", "B", client="junk")
        self.assertEqual((await recv_type(ws2, "joined"))["role"], "p2")

    async def test_a_phone_flooding_reports_is_cut_off_and_counted(self):
        ws1, ws2, _, _ = await self.start_bout("m_flood")
        before = telemetry.windows_rejected
        for i in range(40):
            await ws2.send_json({**GOOD_REPORT, "seq": i, "freezes": []})
        await ws2.send_json({"type": "ping", "time": 1})
        await recv_type(ws2, "pong")
        self.assertEqual(len(windows_of("m_flood")), mp.MAX_REPORTS_PER_MINUTE)
        self.assertEqual(telemetry.windows_rejected - before, 40 - mp.MAX_REPORTS_PER_MINUTE)

    async def test_a_report_after_the_match_ended_still_counts(self):
        """The final report is sent on hearing the match ended, so it always arrives after the server closed it."""
        ws1, ws2, _, _ = await self.start_bout("m_final")
        await self.report([ws1, ws2], 2, 0)
        await recv_type(ws2, "match_ended")
        await ws2.send_json({**GOOD_REPORT, "reason": "final", "freezes": []})
        await ws2.send_json({"type": "ping", "time": 1})
        await recv_type(ws2, "pong")
        self.assertEqual(windows_of("m_final")[0]["reason"], "final")

    async def test_no_report_before_a_fight(self):
        ws1, ws2 = await self.start_match("m_early_report")
        await ws1.send_json(GOOD_REPORT)
        await ws1.send_json({"type": "ping", "time": 1})
        await recv_type(ws1, "pong")
        self.assertEqual(windows_of("m_early_report"), [])

    async def test_a_drop_and_return_mid_fight(self):
        ws1, ws2, _, _ = await self.start_bout("m_drop")
        await ws2.close()
        await recv_type(ws1, "opponent_disconnected")
        await asyncio.sleep(0.2)
        ws2 = await self.join("m_drop", "joiner", "Joiner", bout_live=False)
        await recv_type(ws2, "versus_start")
        await recv_type(ws1, "restart_request")
        await ws1.send_json({"type": "state_snapshot", "segment": 1, "resume": {"rounds": [0, 0], "health": [50, 50], "timer": 1000}})
        await recv_type(ws2, "state_snapshot")
        await self.settle()

        dropped = events_of("m_drop", "player_disconnected")
        self.assertEqual(len(dropped), 1)
        self.assertEqual((dropped[0]["player_id"], dropped[0]["data"]["in_fight"], dropped[0]["data"]["replaced"]), ("joiner", True, False))
        back = events_of("m_drop", "player_connected")[-1]
        self.assertEqual((back["player_id"], back["data"]["reconnect"], back["data"]["in_fight"]), ("joiner", True, True))
        restart = events_of("m_drop", "segment_restart")[0]
        self.assertEqual((restart["segment"], restart["data"]["reason"]), (1, "reconnect"))
        room = coordinator_room("m_drop")
        self.assertGreaterEqual(room.paused_secs, 0.15)
        self.assertLess(room.paused_secs, 3)
        self.assertIsNone(room.pause_started)
        self.assertEqual(db.get_match("m_drop")["segment"], 1)
        self.assertAlmostEqual(db.get_match("m_drop")["paused_secs"], room.paused_secs, places=2)

    async def test_a_restart_nobody_asked_for_is_a_desync(self):
        ws1, ws2, _, _ = await self.start_bout("m_desync")
        await ws2.send_json({"type": "net_event", "kind": "desync", "segment": 0, "tick": 600})
        await ws1.send_json({"type": "net_event", "kind": "desync", "segment": 0, "tick": 600})
        await ws2.send_json({"type": "state_snapshot", "segment": 1, "resume": {"rounds": [0, 0], "health": [50, 50], "timer": 1000}})
        await recv_type(ws1, "state_snapshot")
        self.assertEqual(events_of("m_desync", "segment_restart")[0]["data"]["reason"], "desync")
        reports = events_of("m_desync", "desync")
        self.assertEqual({(e["role"], e["segment"], e["data"]["tick"]) for e in reports}, {("p1", 0, 600), ("p2", 0, 600)})

    async def test_leaving_the_app_pauses_the_fight_clock(self):
        ws1, ws2, _, _ = await self.start_bout("m_pause")
        await ws2.send_json({"type": "away"})
        await recv_type(ws1, "opponent_away")
        await asyncio.sleep(0.3)
        await ws2.send_json({"type": "back"})
        await recv_type(ws1, "opponent_back")
        room = coordinator_room("m_pause")
        self.assertGreaterEqual(room.paused_secs, 0.25)
        self.assertEqual([e["kind"] for e in events_of("m_pause", "player_away", "player_back")], ["player_away", "player_back"])
        await self.report([ws1, ws2], 2, 0)
        await recv_type(ws1, "match_ended")
        self.assertAlmostEqual(db.get_match("m_pause")["paused_secs"], room.paused_secs, places=2)

    async def test_time_in_hero_select_isnt_a_pause(self):
        ws1, ws2 = await self.start_match("m_select_gap")
        await ws1.close()
        await recv_type(ws2, "opponent_disconnected")
        await asyncio.sleep(0.1)
        ws1 = await self.join("m_select_gap", "creator", "Creator")
        await recv_type(ws1, "match_start")
        self.assertEqual(coordinator_room("m_select_gap").paused_secs, 0)

    async def test_score_conflict_only_when_both_moved_apart(self):
        ws1, ws2, _, _ = await self.start_bout("m_conflict")
        await ws2.send_json({"type": "round_score", "p1": 1, "p2": 0})  # one phone ahead of the other: normal
        await ws1.send_json({"type": "round_score", "p1": 0, "p2": 0})
        await self.settle()
        self.assertEqual(events_of("m_conflict", "score_conflict"), [])
        await ws1.send_json({"type": "round_score", "p1": 0, "p2": 1})  # now they disagree on who won
        await self.settle()
        conflict = events_of("m_conflict", "score_conflict")
        self.assertEqual(len(conflict), 1)
        await ws1.send_json({"type": "round_score", "p1": 0, "p2": 1})  # the same disagreement isn't logged again
        await self.settle()
        self.assertEqual(len(events_of("m_conflict", "score_conflict")), 1)

    async def test_input_gaps_are_measured_at_the_server(self):
        ws1, ws2, _, _ = await self.start_bout("m_gaps")
        tick = 0

        async def send(ws, sender_tick):
            nonlocal tick
            tick += 1
            await ws.send_bytes(input_packet(0, tick)[:16] + sender_tick.to_bytes(4, "big"))

        # The load burst (sender tick 0) followed by a long silence isn't a gap
        await send(ws2, 0)
        await asyncio.sleep(0.3)
        await send(ws2, 1)
        await self.settle()
        room = coordinator_room("m_gaps")
        self.assertEqual(sum(room.gaps.hist[0]), 0)

        await send(ws2, 2)
        await asyncio.sleep(0.3)
        await send(ws2, 3)
        await self.settle()
        self.assertEqual(sum(room.gaps.hist[0]), 2)
        self.assertGreaterEqual(room.gaps.max_ms[0], 280)
        logged = events_of("m_gaps", "input_gap")
        self.assertEqual(len(logged), 1)
        self.assertEqual(logged[0]["player_id"], "joiner")
        self.assertGreaterEqual(logged[0]["data"]["ms"], 280)

        # A silence across a pause (player away) isn't a gap either
        await ws2.send_json({"type": "away"})
        await recv_type(ws1, "opponent_away")
        await asyncio.sleep(0.3)
        await ws2.send_json({"type": "back"})
        await recv_type(ws1, "opponent_back")
        await send(ws2, 4)
        await self.settle()
        self.assertEqual(len(events_of("m_gaps", "input_gap")), 1)

        await self.report([ws1, ws2], 2, 0)
        await recv_type(ws1, "match_ended")
        summary = events_of("m_gaps", "input_gaps")
        self.assertEqual(summary[0]["role"], "p1")
        self.assertEqual(summary[0]["data"]["packets"], 5)
        self.assertEqual(sum(summary[0]["data"]["hist"]), 2)

    async def test_spectators_and_turned_away_joins(self):
        ws1, ws2, _, _ = await self.start_bout("m_spec")
        carol = await self.join("m_spec", "carol", "Carol")
        await recv_type(carol, "joined")
        await carol.close()
        await self.settle()
        self.assertEqual([e["kind"] for e in events_of("m_spec", "spectator_joined", "spectator_left")], ["spectator_joined", "spectator_left"])

    async def test_a_server_start_is_logged(self):
        telemetry.flush()
        conn = db.get_db_connection()
        count = conn.execute("SELECT COUNT(*) FROM match_events WHERE kind = 'server_start'").fetchone()[0]
        conn.close()
        self.assertEqual(count, 1)


def coordinator_room(match_id):
    return mp.coordinator.rooms[match_id]


class TestAdminPanelAccess(MatchTestCase):
    SECRET = {"ADMIN_PANEL_SECRET": "test-secret"}

    def setUp(self):
        super().setUp()
        self.env = patch.dict(os.environ, self.SECRET)
        self.env.start()
        self.addCleanup(self.env.stop)

    def bearer(self, token=None):
        return {"Authorization": f"Bearer {token or admin.make_token()}"}

    async def test_nothing_answers_without_a_token(self):
        for path in ("/api/admin/live", "/api/admin/tab/overview", "/api/admin/tab/players", "/api/admin/fight/x", "/api/admin/export/players"):
            for headers in ({}, {"Authorization": "Bearer nonsense"}, {"Authorization": "Basic abc"}, self.bearer(token="9999999999.AAAA")):
                response = await self.client.get(path, headers=headers)
                self.assertEqual(response.status, 401, (path, headers))
                self.assertNotIn("player", await response.text())

    async def test_an_expired_link_stops_working(self):
        old = admin.make_token(now=time.time() - admin.LOGIN_LINK_SECONDS - 1)
        self.assertFalse(admin.token_valid(old))
        self.assertEqual((await self.client.get("/api/admin/live", headers=self.bearer(old))).status, 401)
        self.assertEqual((await self.client.get("/api/admin/live", headers=self.bearer())).status, 200)

    async def test_a_token_cant_be_forged_or_extended(self):
        token = admin.make_token()
        expiry, signature = token.split(".")
        self.assertFalse(admin.token_valid(f"{int(expiry) + 999999}.{signature}"))
        self.assertFalse(admin.token_valid(f"{expiry}.{signature[:-1]}x"))
        self.assertFalse(admin.token_valid(""))
        self.assertFalse(admin.token_valid(None))
        self.assertFalse(admin.token_valid("x"))
        self.assertFalse(admin.token_valid("é.é"))
        with patch.dict(os.environ, {"ADMIN_PANEL_SECRET": "another-secret"}):
            self.assertFalse(admin.token_valid(token))

    async def test_no_key_means_no_panel_rather_than_an_open_one(self):
        with patch.dict(os.environ, {"ADMIN_PANEL_SECRET": "", "TELEGRAM_BOT_TOKEN": "", "TG_BOT_TOKEN": ""}):
            self.assertIsNone(admin.make_token())
            self.assertIsNone(admin.login_url("https://x"))
            self.assertEqual((await self.client.get("/api/admin/live", headers={"Authorization": "Bearer x.y"})).status, 401)

    async def test_the_key_comes_from_the_bot_token_in_production(self):
        with patch.dict(os.environ, {"ADMIN_PANEL_SECRET": "", "TELEGRAM_BOT_TOKEN": "123:abc"}):
            token = admin.make_token()
            self.assertTrue(admin.token_valid(token))
        with patch.dict(os.environ, {"ADMIN_PANEL_SECRET": "", "TELEGRAM_BOT_TOKEN": "123:other"}):
            self.assertFalse(admin.token_valid(token))

    async def test_the_page_itself_is_harmless_and_locked_down(self):
        response = await self.client.get("/admin/")
        self.assertEqual(response.status, 200)
        text = await response.text()
        self.assertIn("Immortal Combat", text)
        policy = response.headers["Content-Security-Policy"]
        self.assertIn("connect-src 'self'", policy)
        self.assertIn("frame-ancestors 'none'", policy)
        self.assertEqual(response.headers["Cache-Control"], "no-store")
        self.assertNotIn("innerHTML", text)  # nothing from the server is ever parsed as HTML

    async def test_every_page_answers_with_a_token_and_links_sign_in(self):
        ws1, ws2, _, _ = await self.start_bout("m_panel", "-100500")
        await ws2.send_json(GOOD_REPORT)
        await self.report([ws1, ws2], 2, 0)
        await recv_type(ws1, "match_ended")
        telemetry.flush()
        for tab in ("overview", "funnel", "netcode", "devices", "reliability", "server", "balance", "players", "fights", "quality"):
            response = await self.client.get(f"/api/admin/tab/{tab}?days=7&tz=300", headers=self.bearer())
            self.assertEqual(response.status, 200, tab)
            body = await response.json()
            self.assertEqual(body["scope"]["tz_minutes"], 300)
            self.assertTrue(body["sections"], tab)
        self.assertEqual((await self.client.get("/api/admin/tab/nope", headers=self.bearer())).status, 404)

        fights = await (await self.client.get("/api/admin/tab/fights?fresh=1", headers=self.bearer())).json()
        rows = fights["sections"][0]["blocks"][0]["rows"]
        self.assertEqual([r["match_id"] for r in rows], ["m_panel"])

        detail = await (await self.client.get("/api/admin/fight/m_panel", headers=self.bearer())).json()
        self.assertEqual(detail["fight"]["match_id"], "m_panel")
        self.assertEqual(detail["fight"]["source"], "Group chat")
        self.assertTrue(detail["fight"]["has_replay"] is False or detail["fight"]["has_replay"] is True)
        self.assertEqual((await self.client.get("/api/admin/fight/nope", headers=self.bearer())).status, 404)

        live = await (await self.client.get("/api/admin/live", headers=self.bearer())).json()
        self.assertEqual(live["players"], 2)
        export = await self.client.get("/api/admin/export/fights?days=7", headers=self.bearer())
        self.assertEqual(export.headers["Content-Type"].split(";")[0], "text/csv")
        text = await export.text()
        self.assertIn("m_panel", text)
        self.assertEqual((await self.client.get("/api/admin/export/nope", headers=self.bearer())).status, 404)

    async def test_the_admins_fights_are_hidden_unless_asked_for(self):
        with patch.dict(os.environ, {"ADMIN_ID": "joiner"}):
            ws1, ws2, _, _ = await self.start_bout("m_mine")
            telemetry.flush()
            hidden = await (await self.client.get("/api/admin/tab/overview?fresh=1", headers=self.bearer())).json()
            shown = await (await self.client.get("/api/admin/tab/overview?include_admin=1&fresh=1", headers=self.bearer())).json()
        self.assertEqual(hidden["scope"]["hidden_fights"], 1)
        self.assertEqual(shown["scope"]["hidden_fights"], 0)

    async def test_the_game_keeps_working_while_the_panel_reads(self):
        ws1, ws2, _, _ = await self.start_bout("m_busy")
        for tab in ("overview", "netcode", "quality"):
            await self.client.get(f"/api/admin/tab/{tab}", headers=self.bearer())
        await ws2.send_bytes(input_packet(0, 0, pressed=16))
        msg = None
        while msg is None or msg.type.name != "BINARY":
            msg = await ws1.receive(timeout=2)
        self.assertEqual(msg.data, input_packet(0, 0, pressed=16))

    async def test_requests_for_the_same_page_share_one_read(self):
        admin._cache.clear()
        with patch.object(admin, "run_read", side_effect=admin.run_read) as run:
            responses = await asyncio.gather(*(self.client.get("/api/admin/tab/server", headers=self.bearer()) for _ in range(3)))
        self.assertEqual([r.status for r in responses], [200, 200, 200])
        self.assertEqual(run.call_count, 1)

    async def test_a_failed_read_says_why_and_the_next_one_works(self):
        telemetry.flush()
        fd, empty = tempfile.mkstemp(suffix=".db")
        os.close(fd)
        self.addCleanup(os.remove, empty)
        with patch.object(db, "DB_PATH", empty):
            response = await self.client.get("/api/admin/tab/overview?fresh=1", headers=self.bearer())
        self.assertEqual(response.status, 500)
        body = await response.json()
        self.assertEqual(body["status"], "error")
        self.assertIn("no such table", body["message"])
        self.assertEqual((await self.client.get("/api/admin/tab/overview?fresh=1", headers=self.bearer())).status, 200)

    async def test_a_slow_page_is_kept_for_longer(self):
        admin._cache.clear()
        admin.remember("quick", b"{}", read_secs=0.1)
        admin.remember("slow", b"{}", read_secs=30)
        left = {key: admin._cache[key][0] - time.monotonic() for key in ("quick", "slow")}
        self.assertLessEqual(left["quick"], admin.CACHE_SECONDS)
        self.assertGreater(left["slow"], 299)
        admin._cache.clear()


class TestBotCommand(MatchTestCase):
    def message(self, user_id, chat_type="private"):
        message = MagicMock()
        message.from_user.id = user_id
        message.chat.type = chat_type
        message.answer = AsyncMock()
        return message

    async def test_only_the_admin_gets_a_link_and_only_in_private(self):
        with patch.object(bot, "ADMIN_ID", 42), patch.object(bot, "WEBAPP_URL", "https://game.example/player/"), patch.dict(os.environ, {"ADMIN_PANEL_SECRET": "s"}):
            stranger = self.message(7)
            await bot.handle_admin(stranger)
            stranger.answer.assert_not_called()

            in_group = self.message(42, "supergroup")
            await bot.handle_admin(in_group)
            self.assertNotIn("#key=", str(in_group.answer.call_args))

            mine = self.message(42)
            await bot.handle_admin(mine)
            button = mine.answer.call_args.kwargs["reply_markup"].inline_keyboard[0][0]
            self.assertTrue(button.url.startswith("https://game.example/admin/#key="))
            self.assertTrue(admin.token_valid(button.url.split("#key=")[1]))

    async def test_no_admin_configured_means_no_link(self):
        with patch.object(bot, "ADMIN_ID", None):
            message = self.message(42)
            await bot.handle_admin(message)
            message.answer.assert_not_called()

    async def test_starting_the_bot_is_logged(self):
        message = self.message(55)
        message.chat.id = 55
        command = MagicMock(args="challenge_abc")
        with patch.object(db, "get_match", return_value=None):
            await bot.handle_start(message, command)
        telemetry.flush()
        conn = db.get_db_connection()
        row = conn.execute("SELECT * FROM match_events WHERE kind = 'bot_start' AND player_id = '55'").fetchone()
        conn.close()
        self.assertEqual(json.loads(row["data"])["entry"], "challenge")


class TestFailureCantReachTheGame(MatchTestCase):
    async def test_a_broken_log_doesnt_stop_a_fight(self):
        with patch.object(telemetry._queue, "put_nowait", side_effect=RuntimeError("disk on fire")):
            ws1, ws2, _, _ = await self.start_bout("m_broken")
            await ws2.send_json(GOOD_REPORT)
            await self.report([ws1, ws2], 2, 0)
            end = await recv_type(ws1, "match_ended")
        self.assertEqual(end["reason"], "KNOCKOUT")
        self.assertEqual(db.get_match("m_broken")["status"], "COMPLETED")

    async def test_the_writer_survives_a_bad_row_and_counts_it(self):
        before = telemetry.health()
        telemetry._put("INSERT INTO no_such_table VALUES (1)", ())
        telemetry.event("after_bad_row", "m_after")
        telemetry.flush()
        after = telemetry.health()
        self.assertEqual(after["write_errors"] - before["write_errors"], 1)
        self.assertEqual(len(events_of("m_after", "after_bad_row")), 1)

    async def test_a_full_queue_drops_and_counts_rather_than_blocks(self):
        import queue as queue_module
        before = telemetry.dropped
        with patch.object(telemetry._queue, "put_nowait", side_effect=queue_module.Full):
            started = time.perf_counter()
            telemetry.event("dropped", "m_full")
            self.assertLess(time.perf_counter() - started, 0.1)
        self.assertEqual(telemetry.dropped - before, 1)
