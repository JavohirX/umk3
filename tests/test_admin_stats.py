"""
The numbers the admin panel shows, checked against a small database whose right answers are worked out by hand here.
Decisions get made from these, so each test states the arithmetic it expects, including the traps: averages of
averages, cumulative counters, fights that never started, time with a player gone, and one desync seen by two phones.
"""

import json
import os
import sqlite3
import tempfile
import unittest

import server.admin_stats as stats
import server.db as db
from server.telemetry import clean_client, clean_freezes, clean_window, describe_device

DAY = 86400
NOW = 1_800_000_000.0
TICK_MS = 1000 / 60


def blocks_in(sections):
    for section in sections:
        for block in section["blocks"]:
            yield block
            yield from block.get("blocks", [])


def block_of(sections, *titles):
    for block in blocks_in(sections):
        if block.get("title") in titles:
            return block
    raise KeyError(titles)


def value(sections, label):
    for block in blocks_in(sections):
        items = block.get("items", []) if block["type"] in ("kpis", "status", "parts", "gauge") else []
        for item in [*items, block.get("average"), block.get("slowest"), block.get("rematch")]:
            if item and item["label"] == label:
                return item
    raise KeyError(label)


class StatsCase(unittest.TestCase):
    def setUp(self):
        self.orig_db = db.DB_PATH
        fd, self.path = tempfile.mkstemp(suffix=".db")
        os.close(fd)
        db.DB_PATH = self.path
        db.init_db()
        self.conn = sqlite3.connect(self.path)
        self.conn.row_factory = sqlite3.Row

    def tearDown(self):
        self.conn.close()
        db.DB_PATH = self.orig_db
        for suffix in ("", "-wal", "-shm"):
            try:
                os.remove(self.path + suffix)
            except OSError:
                pass

    def scope(self, days=7, include_admin=False, admin_id=None, tz=0):
        return stats.Scope(days=days, include_admin=include_admin, admin_id=admin_id, tz_minutes=tz, now=NOW)

    def match(self, match_id, created=None, status="COMPLETED", reason="KNOCKOUT", winner="a", p1="a", p2="b", started=True, fight=True,
              length=100.0, paused=0.0, segment=0, hero1=0, hero2=1, rounds=(2, 0), stage=0, chat="-100", rematch_of=None, build="b1"):
        created = NOW - DAY if created is None else created
        started_at = created + 10 if started else None
        fight_at = created + 20 if fight else None
        ended = (fight_at or created) + length + paused if status != "ACTIVE" and status != "WAITING" else None
        self.conn.execute(
            """INSERT INTO matches (match_id, chat_id, creator_id, creator_name, opponent_id, opponent_name, status, winner_id, finish_reason, created_at, expires_at,
                                    started_at, ended_at, fight_started_at, paused_secs, segment, build, p1_id, p2_id, p1_name, p2_name, p1_hero, p2_hero, p1_rounds, p2_rounds, stage, rematch_of)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (match_id, chat, p1, p1.upper(), p2 if started else None, p2.upper() if started else None, status, winner, reason, created, created + 600,
             started_at, ended, fight_at, paused, segment, build, p1 if fight else None, p2 if fight else None, p1.upper() if fight else None, p2.upper() if fight else None,
             hero1 if fight else None, hero2 if fight else None, rounds[0], rounds[1], stage if fight else None, rematch_of))
        self.conn.commit()

    def window(self, match_id, role="p1", active=10.0, **fields):
        row = {"match_id": match_id, "role": role, "player_id": fields.pop("player", role), "received_at": NOW - DAY + 50, "segment": 0, "seq": 0, "secs": active, "active_secs": active,
               "live_secs": active, "ticks": int(active * 60), "live_ticks": int(active * 60), "frames": int(active * 60), "frame_ms_sum": active * 1000, "live_frames": int(active * 60),
               **fields}
        columns = ", ".join(row)
        self.conn.execute(f"INSERT INTO net_windows ({columns}) VALUES ({', '.join('?' * len(row))})", tuple(row.values()))
        self.conn.commit()

    def event(self, match_id, event_kind, /, at=None, player=None, role=None, segment=0, **data):
        self.conn.execute("INSERT INTO match_events (match_id, at, kind, player_id, role, segment, data) VALUES (?, ?, ?, ?, ?, ?, ?)",
                          (match_id, NOW - DAY + 30 if at is None else at, event_kind, player, role, segment, json.dumps(data)))
        self.conn.commit()


class TestPopulations(StatsCase):
    def test_a_match_with_no_fight_is_not_a_fight(self):
        self.match("real")
        # A player left during hero select: the match "completed" with a winner, but nobody fought
        self.match("hero_select_forfeit", reason="AUTOWIN_DISCONNECT", fight=False)
        self.match("expired", status="CANCELLED", reason="JOIN_TIMEOUT", winner=None, started=False, fight=False)
        page = stats.tab_overview(self.conn, self.scope())
        self.assertEqual(value(page, "Fights started")["value"], 1)
        self.assertEqual(value(page, "Forfeited")["value"], 0)
        self.assertEqual(value(page, "Played to the end")["value"], 1)

    def test_outcome_rates_leave_out_running_fights(self):
        self.match("played")
        self.match("forfeit", reason="AUTOWIN_DISCONNECT")
        self.match("both_gone", status="ABANDONED", reason="BOTH_DISCONNECTED", winner=None)
        self.match("stale", status="ABANDONED", reason="STALE", winner=None)
        self.match("running", status="ACTIVE", reason=None, winner=None)
        page = stats.tab_overview(self.conn, self.scope())
        self.assertEqual(value(page, "Fights started")["value"], 5)
        played = value(page, "Played to the end")
        self.assertEqual((played["value"], played["n"]), (0.25, 4))
        self.assertEqual(value(page, "Forfeited")["value"], 0.25)
        self.assertEqual(value(page, "Abandoned")["value"], 0.5)

    def test_the_range_is_by_when_the_fight_started(self):
        self.match("inside", created=NOW - 3 * DAY)
        self.match("outside", created=NOW - 10 * DAY)
        self.assertEqual(value(stats.tab_overview(self.conn, self.scope(days=7)), "Fights started")["value"], 1)
        self.assertEqual(value(stats.tab_overview(self.conn, self.scope(days=30)), "Fights started")["value"], 2)
        self.assertEqual(value(stats.tab_overview(self.conn, self.scope(days=0)), "Fights started")["value"], 2)

    def test_the_admins_own_fights_are_hidden_and_counted(self):
        self.match("mine", p1="me", p2="b", winner="me")
        self.match("theirs", p1="a", p2="b")
        hidden = self.scope(admin_id="me")
        self.assertEqual(value(stats.tab_overview(self.conn, hidden), "Fights started")["value"], 1)
        self.assertEqual(stats.scope_summary(self.conn, hidden)["hidden_fights"], 1)
        shown = self.scope(admin_id="me", include_admin=True)
        self.assertEqual(value(stats.tab_overview(self.conn, shown), "Fights started")["value"], 2)
        self.assertEqual(stats.scope_summary(self.conn, shown)["hidden_fights"], 0)
        # Nothing to hide without knowing who the admin is
        self.assertEqual(value(stats.tab_overview(self.conn, self.scope()), "Fights started")["value"], 2)

    def test_players_and_fights_per_player(self):
        self.match("m1", p1="a", p2="b")
        self.match("m2", p1="a", p2="c", winner="a")
        page = stats.tab_overview(self.conn, self.scope())
        self.assertEqual(value(page, "Players who fought")["value"], 3)
        # Two fights have four seats between three players
        self.assertAlmostEqual(value(page, "Fights per player")["value"], 4 / 3)

    def test_fight_length_leaves_out_paused_time(self):
        self.match("m1", length=90, paused=60)
        self.match("m2", length=110)
        page = stats.tab_overview(self.conn, self.scope())
        self.assertEqual(value(page, "Median fight length")["value"], 100)

    def test_rematch_rate_counts_played_fights_only(self):
        self.match("played_rematched")
        self.match("played_alone")
        self.match("rematch_child", rematch_of="played_rematched")
        self.match("forfeit_rematched", reason="AUTOWIN_DISCONNECT")
        self.match("forfeit_child", rematch_of="forfeit_rematched")
        page = stats.tab_overview(self.conn, self.scope())
        # Played fights: played_rematched, played_alone, rematch_child, forfeit_child. One of the four was rematched.
        self.assertEqual(value(page, "Agreed a rematch")["value"], 0.25)


class TestFunnel(StatsCase):
    def test_each_step_counts_one_group_of_challenges(self):
        self.match("expired", status="CANCELLED", reason="JOIN_TIMEOUT", winner=None, started=False, fight=False)
        self.match("open", status="WAITING", reason=None, winner=None, started=False, fight=False)
        self.match("claimed", status="CANCELLED", reason="JOIN_TIMEOUT", winner=None, started=False, fight=False)
        self.event("claimed", "seat_claimed", player="b")
        self.match("left_in_select", reason="AUTOWIN_DISCONNECT", fight=False)
        self.match("forfeited_fight", reason="AUTOWIN_DISCONNECT")
        self.match("played")
        self.match("played_rematched")
        self.match("the_rematch", rematch_of="played_rematched")  # not a challenge: left out of the steps

        page = stats.tab_funnel(self.conn, self.scope())
        steps = {r["step"]: r["count"] for r in block_of(page, "Step by step")["rows"]}
        self.assertEqual(steps, {"Challenge created": 7, "Someone accepted": 5, "Both players in": 4, "Fight started": 3,
                                 "Played to the end": 2, "Rematch agreed": 1})
        rows = {r["step"]: r for r in block_of(page, "Step by step")["rows"]}
        self.assertAlmostEqual(rows["Fight started"]["of_first"], 3 / 7)
        self.assertAlmostEqual(rows["Fight started"]["of_previous"], 3 / 4)
        self.assertIsNone(rows["Challenge created"]["of_previous"])
        self.assertEqual(value(page, "Still open")["value"], 1)
        self.assertEqual(value(page, "Expired unanswered")["value"], 2)
        self.assertEqual(value(page, "Lost in hero select")["value"], 1)
        self.assertEqual(value(page, "Rematch matches")["value"], 1)

    def test_where_challenges_came_from(self):
        self.assertEqual(stats.source_of_challenge("-100123"), "Group chat")
        self.assertEqual(stats.source_of_challenge("4242"), "Private chat with the bot")
        self.assertEqual(stats.source_of_challenge("inline"), "Inline mode")
        self.assertEqual(stats.source_of_challenge("0"), "Other")

    def test_bot_starters_who_went_on_to_fight(self):
        self.match("m1", p1="a", p2="b")
        for player in ("a", "x", "y", "z"):
            self.event(None, "bot_start", player=player)
        self.conn.execute("INSERT INTO players (player_id, first_seen_at, last_seen_at) VALUES ('a', 1, 1), ('x', 1, 1)")
        self.conn.commit()
        page = stats.tab_funnel(self.conn, self.scope())
        self.assertEqual(value(page, "Started the bot")["value"], 4)
        self.assertEqual(value(page, "Of those, opened a match")["value"], 0.5)
        self.assertEqual(value(page, "Of those, fought")["value"], 0.25)


class TestNetcode(StatsCase):
    def test_rates_are_sums_over_sums_not_averages_of_averages(self):
        self.match("m1")
        # One 90s report with one rollback, one 10s report with nine: 10 rollbacks in 100s is 6 a minute.
        # Averaging each report's rate would claim (0.67 + 54) / 2, about 27 a minute.
        self.window("m1", "p1", active=90, rollbacks=1, rollback_ticks=4)
        self.window("m1", "p1", active=10, rollbacks=9, rollback_ticks=36, seq=1)
        page = stats.tab_netcode(self.conn, self.scope())
        self.assertAlmostEqual(value(page, "Rollbacks a minute")["value"], 6.0)
        self.assertAlmostEqual(value(page, "Average depth")["value"], 4 * TICK_MS)

    def test_input_delay_is_weighted_by_time_and_measured_against_the_goal(self):
        self.match("m1")
        hist = [0] * 16
        hist[3], hist[9] = 300, 100  # 300 ticks at 3 (50ms), 100 ticks at 9 (150ms)
        self.window("m1", "p1", live_delay_hist=json.dumps(hist))
        page = stats.tab_netcode(self.conn, self.scope())
        self.assertAlmostEqual(value(page, "Input delay")["value"], (300 * 3 + 100 * 9) / 400 * TICK_MS)
        self.assertAlmostEqual(value(page, "Time within the goal")["value"], 0.75)

    def test_the_goal_is_six_ticks(self):
        self.assertEqual(stats.GOAL_DELAY_TICKS * TICK_MS, stats.GOAL_DELAY_MS)

    def test_freezes_and_stalls_per_round_time_not_wall_time(self):
        self.match("m1")
        # 60s of fight of which 30s inside a round: 3 freezes is one per 10s in round, so 60 per 10 minutes... of round
        self.window("m1", "p1", active=60, live_secs=30, stall_freezes_live=2, hitch_freezes_live=1, live_stall_ms=1500, live_stalls=6, stalls=9, stall_ms=2000, max_stall_ms=800, load_wait_ms=5000, freezes_other=4)
        page = stats.tab_netcode(self.conn, self.scope())
        self.assertAlmostEqual(value(page, "Freezes per 10 minutes")["value"], 3 / (30 / 600))
        self.assertAlmostEqual(value(page, "Time stalled")["value"], 1500 / 30000)
        self.assertAlmostEqual(value(page, "Stalls a minute")["value"], 12.0)
        self.assertEqual(value(page, "Longest stall")["value"], 800)
        self.assertEqual(value(page, "Waiting for the opponent to load")["value"], 5000)
        self.assertEqual(value(page, "Freezes outside rounds")["value"], 4)

    def test_one_desync_seen_by_both_phones_counts_once(self):
        self.match("m1")
        self.match("m2")
        self.event("m1", "desync", player="a", role="p1", tick=600)
        self.event("m1", "desync", player="b", role="p2", tick=600)
        self.event("m1", "desync", player="a", role="p1", segment=1, tick=120)  # a second one, after the restart
        faults = block_of(stats.tab_netcode(self.conn, self.scope()), "Faults that should never happen")["counts"]
        self.assertEqual((faults["desyncs"], faults["desync_fights"]), (2, 1))

    def test_faults_are_one_line_that_adds_them_all_up(self):
        self.match("m1")
        self.window("m1", "p1", rollback_misses=2, loop_errors=1)
        self.event("m1", "desync", player="a", role="p1", tick=600)
        self.event("m1", "score_conflict", player="a", role="p1")
        self.event("m1", "score_conflict", player="b", role="p2")
        netcode = block_of(stats.tab_netcode(self.conn, self.scope()), "Faults that should never happen")
        self.assertEqual(netcode["counts"]["total"], 6)  # 1 desync, 2 misses, 2 conflicts, 1 error
        self.assertEqual(netcode["words"], ["1 desync", "2 rollback misses", "2 score conflicts", "1 game loop error"])
        # Overview adds up the same six
        tile = value(stats.tab_overview(self.conn, self.scope()), "Faults that should never happen")
        self.assertEqual((tile["value"], tile["tone"]), (6, "fail"))
        self.assertEqual(tile["detail"], "1 desync, 2 rollback misses, 2 score conflicts, 1 game loop error.")

    def test_delay_buckets_group_only_where_they_hold_almost_no_time(self):
        hist = [0] * 16
        hist[2], hist[3], hist[5], hist[6], hist[7], hist[9], hist[10] = 9000, 1, 3, 500, 2, 1, 400
        total = 9907  # half a percent of it is 49.5 ticks
        rows = stats.delay_share_rows(hist)
        self.assertEqual([(r["label"], r["ticks"], r["over_goal"]) for r in rows], [
            ("33ms", 9000, False), ("50 to 83ms", 4, False), ("100ms", 500, False),
            ("117 to 150ms", 3, True), ("167ms", 400, True)])
        self.assertAlmostEqual(rows[0]["value"], 9000 / total)
        self.assertAlmostEqual(sum(r["value"] for r in rows), 1.0)

    def test_grouping_never_crosses_the_goal(self):
        hist = [0] * 16
        hist[2], hist[6], hist[7] = 10000, 1, 1  # 100ms meets the goal and 117ms misses it, however few ticks either has
        rows = stats.delay_share_rows(hist)
        self.assertEqual([(r["label"], r["over_goal"]) for r in rows], [("33ms", False), ("100ms", False), ("117ms", True)])

    def test_no_live_rounds_means_no_delay_rows(self):
        self.assertEqual(stats.delay_share_rows([0] * 16), [])

    def test_connection_table_splits_by_path(self):
        self.match("m1")
        self.window("m1", "p1", active=30, p2p=1, ice_path="relay-relay")
        self.window("m1", "p2", active=60, p2p=1, ice_path="srflx-prflx")
        self.window("m1", "p1", active=10, p2p=0, ice_path="none", seq=1)
        self.window("m1", "p2", active=0, p2p=1, ice_path="none", seq=1)
        rows = {r["transport"]: r for r in block_of(stats.tab_netcode(self.conn, self.scope()), "By connection")["rows"]}
        self.assertAlmostEqual(rows["UDP through the TURN relay"]["share"], 0.3)
        self.assertAlmostEqual(rows["UDP direct between phones"]["share"], 0.6)
        self.assertAlmostEqual(rows["WebSocket only"]["share"], 0.1)
        self.assertEqual(rows["UDP, path not reported"]["share"], 0)

    def test_builds_compare_side_by_side(self):
        self.match("old", build="aaa", created=NOW - 2 * DAY)
        self.match("new", build="bbb")
        self.window("old", "p1", active=60, live_secs=60, hitch_freezes_live=5)
        self.window("new", "p1", active=60, live_secs=60, hitch_freezes_live=1)
        rows = {r["build"]: r for r in block_of(stats.tab_netcode(self.conn, self.scope()), "By the server build a fight started on")["rows"]}
        self.assertAlmostEqual(rows["aaa"]["freezes_per_10"], 50.0)
        self.assertAlmostEqual(rows["bbb"]["freezes_per_10"], 10.0)
        self.assertEqual(rows["bbb"]["fights"], 1)

    def test_freeze_free_needs_both_phones_to_have_reported_enough(self):
        self.match("clean", length=100)
        self.window("clean", "p1", active=100)
        self.window("clean", "p2", active=100)
        self.match("frozen", length=100)
        self.window("frozen", "p1", active=100, hitch_freezes_live=1)
        self.window("frozen", "p2", active=100)
        # One phone reported only a fifth of this fight: it could have frozen any time, so it can't count either way
        self.match("unknown", length=100)
        self.window("unknown", "p1", active=100)
        self.window("unknown", "p2", active=20)
        item = value(stats.tab_overview(self.conn, self.scope()), "Fights without a freeze")
        self.assertEqual((item["value"], item["n"]), (0.5, 2))
        self.assertEqual(item["detail"], "1 of 2 fights froze. Longest stall: 0.0ms. 1 more had too few reports to judge.")


class TestRightNow(StatsCase):
    def fights(self, clean, frozen):
        for i in range(clean + frozen):
            self.match(f"m{i}", length=100)
            self.window(f"m{i}", "p1", active=100, hitch_freezes_live=1 if i >= clean else 0, max_stall_ms=1347 if i >= clean else 0)
            self.window(f"m{i}", "p2", active=100)

    def test_the_freeze_warning_includes_sixty_percent_exactly(self):
        self.fights(clean=3, frozen=2)
        item = value(stats.tab_overview(self.conn, self.scope()), "Fights without a freeze")
        self.assertEqual((item["value"], item["tone"], item["verdict"]), (0.6, "warn", "Needs a look"))
        self.assertEqual(item["detail"], "2 of 5 fights froze. Longest stall: 1,347ms.")

    def test_above_sixty_percent_is_fine(self):
        self.fights(clean=2, frozen=1)
        item = value(stats.tab_overview(self.conn, self.scope()), "Fights without a freeze")
        self.assertAlmostEqual(item["value"], 2 / 3)
        self.assertEqual((item["tone"], item["verdict"]), ("ok", "Above 60%"))

    def test_below_sixty_percent_warns(self):
        self.fights(clean=1, frozen=1)
        self.assertEqual(value(stats.tab_overview(self.conn, self.scope()), "Fights without a freeze")["tone"], "warn")

    def test_nothing_is_judged_with_nothing_measured(self):
        self.event(None, "server_start", at=NOW - 60, build="b1")  # the server logs its own start, so a log is never quite empty
        page = stats.tab_overview(self.conn, self.scope())
        for label in ("Input delay", "Fights without a freeze", "Faults that should never happen", "Data quality"):
            item = value(page, label)
            self.assertIsNone(item["value"], label)
            self.assertIsNone(item["tone"], label)
        # A fight with no phone reports: the server saw no fault, but most faults are the phones' to report
        self.match("m1")
        item = value(stats.tab_overview(self.conn, self.scope()), "Faults that should never happen")
        self.assertIsNone(item["value"])

    def test_overview_and_netcode_show_one_input_delay(self):
        self.match("m1")
        hist = [0] * 16
        hist[3], hist[9] = 300, 100
        self.window("m1", "p1", live_delay_hist=json.dumps(hist))
        hist[3], hist[9] = 100, 0
        self.window("m1", "p2", live_delay_hist=json.dumps(hist))
        overview = value(stats.tab_overview(self.conn, self.scope()), "Input delay")
        netcode = value(stats.tab_netcode(self.conn, self.scope()), "Input delay")
        # 400 ticks at 3 and 100 at 9, weighted by time. The median of the two phones' averages would say otherwise.
        self.assertAlmostEqual(overview["value"], (400 * 3 + 100 * 9) / 500 * TICK_MS)
        self.assertEqual(overview["value"], netcode["value"])
        self.assertEqual((overview["tone"], overview["verdict"]), ("ok", "Within goal"))

    def test_input_delay_exactly_at_the_goal_meets_it(self):
        self.assertEqual(stats.delay_verdict(stats.GOAL_DELAY_MS), ("ok", "Within goal"))
        self.assertEqual(stats.delay_verdict(stats.GOAL_DELAY_MS + 0.1), ("warn", "Over goal"))
        self.assertEqual(stats.delay_verdict(None), (None, None))

    def test_data_quality_says_how_many_passed(self):
        self.match("m1")
        self.event("m1", "fight_started")
        item = value(stats.tab_overview(self.conn, self.scope()), "Data quality")
        checks = stats.data_quality_checks(self.conn, self.scope())
        passed = sum(1 for c in checks if c["status"] == "ok")
        self.assertEqual(item["value"], f"{passed} of {len(checks)}")
        # The fight has no reports and the leaderboard is empty, so this can't be a clean bill of health
        self.assertIn(item["tone"], ("warn", "fail"))
        self.assertNotEqual(item["verdict"], "All passed")

    def test_data_quality_numbers_add_up_when_there_is_more_than_one_kind(self):
        self.match("no_reports")  # a warning: no phone reported this fight. And a failure: the leaderboard doesn't know about it.
        self.event("no_reports", "fight_started")
        checks = stats.data_quality_checks(self.conn, self.scope())
        fails, warns = [sum(1 for c in checks if c["status"] == s) for s in ("fail", "warn")]
        self.assertGreater(fails, 0)
        self.assertGreater(warns, 0)
        item = value(stats.tab_overview(self.conn, self.scope()), "Data quality")
        self.assertEqual(item["verdict"], f"{fails} failed")
        self.assertIn(f"Also {warns} warning", item["detail"])


class TestFightsToLookAt(StatsCase):
    def rows(self):
        return block_of(stats.tab_overview(self.conn, self.scope()), "Fights to look at")["rows"]

    def test_worst_first_and_clean_fights_left_out(self):
        base = NOW - DAY
        self.match("clean", created=base)
        self.window("clean", "p1", active=100)
        self.window("clean", "p2", active=100)
        self.match("dropped", created=base + 10, hero1=0, hero2=2)
        self.event("dropped", "player_disconnected", at=base + 50, player="a", role="p1", in_fight=True, close_code=1006, replaced=False)
        self.event("dropped", "player_connected", at=base + 54, player="a", role="p1", reconnect=True, in_fight=True, client={})
        self.match("frozen", created=base + 20, hero1=0, hero2=3)
        self.window("frozen", "p1", active=100, hitch_freezes_live=2)
        self.window("frozen", "p2", active=100, stall_freezes_live=1)
        self.event("frozen", "freeze", at=base + 60, player="a", role="p1", kind="hitch", ms=500, live=True)
        self.event("frozen", "freeze", at=base + 70, player="a", role="p1", kind="hitch", ms=908, live=True)
        self.event("frozen", "freeze", at=base + 70.1, player="b", role="p2", kind="stall", ms=700, live=True)
        self.match("desynced", created=base + 30, hero1=0, hero2=4)
        self.event("desynced", "desync", at=base + 80, player="a", role="p1", tick=10)
        rows = self.rows()
        self.assertEqual([r["match_id"] for r in rows], ["desynced", "frozen", "dropped"])
        self.assertEqual(rows[0]["wrong"], "1 desync")
        self.assertEqual(rows[0]["cause"], "The two phones' simulations differed")
        self.assertEqual(rows[1]["wrong"], "3 freezes, worst 908ms")
        self.assertEqual(rows[1]["cause"], "One phone stopped drawing, and the other waited for it")
        self.assertEqual(rows[2]["wrong"], "1 lost connection")
        self.assertEqual(rows[2]["cause"], "The connection died, and the player was back in 4.0s")

    def test_only_the_five_worst(self):
        for i in range(7):
            self.match(f"m{i}", created=NOW - DAY + i, segment=i + 1)
        rows = self.rows()
        self.assertEqual([r["match_id"] for r in rows], ["m6", "m5", "m4", "m3", "m2"])
        self.assertEqual(rows[0]["wrong"], "7 restarts")

    def test_newest_breaks_a_tie(self):
        self.match("older", created=NOW - DAY, segment=1)
        self.match("newer", created=NOW - DAY + 5, segment=1)
        self.assertEqual([r["match_id"] for r in self.rows()], ["newer", "older"])

    def test_a_player_who_never_came_back_is_said_so(self):
        self.match("m1")
        self.event("m1", "player_disconnected", player="a", role="p1", in_fight=True, close_code=1001, replaced=False)
        self.assertEqual(self.rows()[0]["cause"], "The page went away, and the player never came back")

    def test_a_fight_with_no_reports_claims_no_freezes_either_way(self):
        self.match("m1")
        self.assertEqual(self.rows(), [])  # nothing known to be wrong, and the empty text says "reported"
        self.assertIn("reported", block_of(stats.tab_overview(self.conn, self.scope()), "Fights to look at")["empty"])

    def test_the_fights_page_finds_every_fault(self):
        self.match("clean")
        self.window("clean", "p1")
        self.match("missed")
        self.window("missed", "p1", rollback_misses=1)
        self.match("errored")
        self.window("errored", "p1", loop_errors=1)
        self.match("conflicted")
        self.event("conflicted", "score_conflict", player="a", role="p1")
        self.match("desynced")
        self.event("desynced", "desync", player="a", role="p1", tick=5)
        rows = stats.tab_fights(self.conn, self.scope(), only="faults")[0]["blocks"][0]["rows"]
        self.assertEqual({r["match_id"] for r in rows}, {"missed", "errored", "conflicted", "desynced"})

    def test_the_problem_columns_come_before_the_ones_that_scroll_away(self):
        block = stats.tab_fights(self.conn, self.scope())[0]["blocks"][0]
        keys = [c["key"] for c in block["columns"]]
        self.assertLess(max(keys.index(k) for k in ("freezes", "desyncs", "drops", "restarts")), min(keys.index(k) for k in ("delay_ms", "rollbacks", "coverage")))


class TestOneFightStory(StatsCase):
    def story(self, match_id="m1"):
        return stats.fight_detail(self.conn, match_id)["story"]

    def shared_freezes(self):
        self.match("m1", length=26)
        start = NOW - DAY + 20
        self.window("m1", "p1", active=26, stall_freezes_live=2)
        self.window("m1", "p2", active=26, hitch_freezes_live=2)
        self.event("m1", "freeze", at=start + 18, player="b", role="p2", kind="hitch", ms=908, live=True)
        self.event("m1", "freeze", at=start + 18.2, player="a", role="p1", kind="stall", ms=729, live=True)
        self.event("m1", "freeze", at=start + 22, player="b", role="p2", kind="hitch", ms=905, live=True)
        self.event("m1", "freeze", at=start + 22.1, player="a", role="p1", kind="stall", ms=854, live=True)
        self.event("m1", "freeze", at=start + 1, player="a", role="p1", kind="stall", ms=400, live=False)  # outside a round

    def test_the_sentence_says_who_froze_and_who_waited(self):
        self.shared_freezes()
        self.assertEqual(self.story()["sentence"], "4 freezes in 26s. A waited for the opponent twice. B's phone froze twice.")

    def test_the_lanes_hold_only_freezes_in_a_round_placed_from_the_start_of_the_fight(self):
        self.shared_freezes()
        story = self.story()
        self.assertEqual(story["span"], 26)
        self.assertEqual([(round(m["t"], 1), m["ms"], m["kind"]) for m in story["lanes"]["p1"]], [(18.2, 729, "stall"), (22.1, 854, "stall")])
        self.assertEqual([(round(m["t"], 1), m["ms"], m["kind"]) for m in story["lanes"]["p2"]], [(18.0, 908, "hitch"), (22.0, 905, "hitch")])
        self.assertEqual(story["unlisted"], 0)

    def test_freezes_past_the_listing_limit_are_admitted(self):
        self.match("m1", length=26)
        self.window("m1", "p1", active=26, hitch_freezes_live=25)
        self.window("m1", "p2", active=26)
        for i in range(20):
            self.event("m1", "freeze", at=NOW - DAY + 21 + i, player="a", role="p1", kind="hitch", ms=300, live=True)
        story = self.story()
        self.assertEqual(story["unlisted"], 5)
        self.assertIn("25 freezes", story["sentence"])

    def test_the_sentence_never_says_less_than_the_strip(self):
        # The report's counts were dropped by the writer under load, but the freezes it listed made it
        self.match("m1", length=26)
        self.window("m1", "p1", active=26)
        self.window("m1", "p2", active=26)
        self.event("m1", "freeze", at=NOW - DAY + 30, player="a", role="p1", kind="hitch", ms=500, live=True)
        self.event("m1", "freeze", at=NOW - DAY + 30.1, player="b", role="p2", kind="stall", ms=400, live=True)
        self.assertEqual(self.story()["sentence"], "2 freezes in 26s. A's phone froze once. B waited for the opponent once.")
        self.assertEqual(self.story()["unlisted"], 0)

    def test_a_listed_freeze_is_known_even_with_no_report_at_all(self):
        self.match("m1", length=26)
        self.event("m1", "freeze", at=NOW - DAY + 30, player="a", role="p1", kind="hitch", ms=500, live=True)
        self.assertEqual(self.story()["sentence"], "1 freeze in 26s. A's phone froze once. A and B reported less than half of the fight, so there may be more.")

    def test_a_clean_fight_says_so(self):
        self.match("m1", length=26)
        self.window("m1", "p1", active=26)
        self.window("m1", "p2", active=26)
        self.assertEqual(self.story()["sentence"], "No freezes in 26s.")

    def test_no_reports_never_reads_as_no_freezes(self):
        self.match("m1", length=26)
        sentence = self.story()["sentence"]
        self.assertEqual(sentence, "No phone reports for this fight, so any freezes are unknown.")

    def test_a_phone_that_reported_little_is_called_out(self):
        self.match("m1", length=100)
        self.window("m1", "p1", active=100)
        self.window("m1", "p2", active=20)
        self.assertEqual(self.story()["sentence"], "No freezes reported in 1m 40s, but B reported less than half of the fight.")
        self.window("m1", "p1", active=1, hitch_freezes_live=1, seq=1)
        self.assertEqual(self.story()["sentence"], "1 freeze in 1m 40s. A's phone froze once. B reported less than half of the fight, so there may be more.")

    def test_everything_else_that_went_wrong_is_listed_too(self):
        self.match("m1", length=26, segment=1)
        self.window("m1", "p1", active=26, loop_errors=1)
        self.window("m1", "p2", active=26)
        self.event("m1", "player_disconnected", player="a", role="p1", in_fight=True, close_code=1006, replaced=False)
        self.event("m1", "player_disconnected", at=NOW - DAY + 60, player="a", role="p1", in_fight=False, close_code=1001, replaced=False)  # after the end
        self.event("m1", "desync", player="a", role="p1", tick=5)
        self.event("m1", "desync", player="b", role="p2", tick=5)  # the same one, seen from the other phone
        self.assertEqual(self.story()["sentence"], "No freezes in 26s. 1 desync, 1 game loop error, 1 lost connection, 1 bout restart.")

    def test_a_running_fight_says_so_far(self):
        self.match("m1", status="ACTIVE", reason=None, winner=None)
        self.window("m1", "p1", hitch_freezes_live=1)
        self.assertEqual(self.story()["sentence"], "1 freeze so far. A's phone froze once.")

    def test_a_match_that_never_fought_has_no_story(self):
        self.match("m1", fight=False, status="CANCELLED", reason="JOIN_TIMEOUT", winner=None, started=False)
        self.assertIsNone(self.story())

    def test_the_time_paused_stretches_the_lanes_but_not_the_sentence(self):
        self.match("m1", length=26, paused=60)
        self.window("m1", "p1", active=26)
        self.window("m1", "p2", active=26)
        story = self.story()
        self.assertEqual(story["span"], 86)
        self.assertEqual(story["paused"], 60)
        self.assertEqual(story["sentence"], "No freezes in 26s.")


class TestWhichPhoneDidWorse(unittest.TestCase):
    def test_at_least_double_and_bad_enough(self):
        worse = stats.worse_side({"p1": {"peer_rtt": 237, "worst_frame": 100, "stalls": 2, "stall_ms": 200},
                                  "p2": {"peer_rtt": 16, "worst_frame": 908, "stalls": 0, "stall_ms": 0}})
        self.assertEqual(worse, {"peer_rtt": "p1", "worst_frame": "p2", "stalls": "p1"})  # 200ms stalled is under the 250ms floor

    def test_a_small_difference_is_not_marked(self):
        self.assertEqual(stats.worse_side({"p1": {"worst_frame": 500}, "p2": {"worst_frame": 400}}), {})

    def test_exactly_double_is_marked(self):
        self.assertEqual(stats.worse_side({"p1": {"worst_frame": 500}, "p2": {"worst_frame": 250}}), {"worst_frame": "p1"})

    def test_equal_or_empty_is_not_marked(self):
        self.assertEqual(stats.worse_side({"p1": {"stalls": 0, "stall_freezes": 3}, "p2": {"stalls": 0, "stall_freezes": 3}}), {})

    def test_it_takes_two_phones_to_compare(self):
        self.assertEqual(stats.worse_side({"p1": {"stalls": 9}}), {})
        self.assertEqual(stats.worse_side({"p1": {"peer_rtt": None}, "p2": {"peer_rtt": 500}}), {})


class TestWordsMatchThePage(unittest.TestCase):
    def test_times_read_the_way_the_page_writes_them(self):
        self.assertEqual([stats.ms_text(v) for v in (2, 908, 1347, 12345)], ["2.0ms", "908ms", "1,347ms", "12.3s"])
        self.assertEqual([stats.secs_text(v) for v in (2, 26.4, 89.4, 119.6, 3700)], ["2.0s", "26s", "89s", "2m 0s", "1h 2m"])


class TestReliability(StatsCase):
    def test_lost_connections_count_only_during_a_fight(self):
        self.match("m1", length=600)
        base = NOW - DAY
        self.event("m1", "player_disconnected", at=base + 100, player="a", role="p1", in_fight=True, close_code=1006, replaced=False)
        self.event("m1", "player_connected", at=base + 104, player="a", role="p1", reconnect=True, in_fight=True, client={})
        self.event("m1", "player_disconnected", at=base + 200, player="b", role="p2", in_fight=True, close_code=1006, replaced=True)  # back before noticed
        self.event("m1", "player_disconnected", at=base + 300, player="a", role="p1", in_fight=True, close_code=1001, replaced=False)  # never back
        self.event("m1", "player_disconnected", at=base + 700, player="a", role="p1", in_fight=False, close_code=1001, replaced=False)  # after the end
        page = stats.tab_reliability(self.conn, self.scope())
        self.assertAlmostEqual(value(page, "Connections lost per 10 minutes")["value"], 3.0)
        self.assertEqual(value(page, "Fights with a lost connection")["value"], 1.0)
        came_back = value(page, "Players who came back")
        self.assertAlmostEqual(came_back["value"], 2 / 3)
        self.assertEqual(came_back["n"], 3)
        # Only the return with a known time counts towards the time to come back
        item = value(page, "Time to come back")
        self.assertEqual((item["value"], item["n"]), (4, 1))
        codes = {r["code"]: r["count"] for r in block_of(page, "How connections were lost")["rows"]}
        self.assertEqual(codes, {"1006: connection died": 2, "1001: page went away": 1})

    def test_why_a_forfeiting_player_went(self):
        base = NOW - DAY
        self.match("left_app", reason="AUTOWIN_DISCONNECT", winner="b")
        self.event("left_app", "player_away", at=base + 50, player="a", role="p1", in_fight=True)
        self.match("died", reason="AUTOWIN_DISCONNECT", winner="b")
        self.event("died", "player_disconnected", at=base + 50, player="a", role="p1", in_fight=True, close_code=1006, replaced=False)
        self.match("closed", reason="AUTOWIN_DISCONNECT", winner="a")
        self.event("closed", "player_disconnected", at=base + 50, player="b", role="p2", in_fight=True, close_code=1001, replaced=False)
        self.match("no_events", reason="AUTOWIN_DISCONNECT", winner="a")
        # No close code means the server's own handler fell over. That isn't the player's doing.
        self.match("our_fault", reason="AUTOWIN_DISCONNECT", winner="a")
        self.event("our_fault", "player_disconnected", at=base + 50, player="b", role="p2", in_fight=True, close_code=None, replaced=False)
        rows = {r["what"]: r["count"] for r in block_of(stats.tab_reliability(self.conn, self.scope()), "What the forfeiting player did last")["rows"]}
        self.assertEqual(rows, {"Left the app and never came back": 1, "Connection died": 1, "Closed the game": 1, "Server error": 1, "Unknown": 1})

    def test_freeze_causes_from_three_views_of_the_moment(self):
        base = NOW - DAY

        def events(*items):
            return [{"kind": k, "role": r, "at": base + t, "data": json.dumps(d)} for k, r, t, d in items]

        # P2's phone blocked for 900ms: it reports a hitch, the server sees P2 go silent, and P1 runs out of guesses and stalls
        blocked = events(("freeze", "p2", 18.02, {"kind": "hitch", "ms": 908, "live": True}), ("input_gap", "p2", 18.01, {"ms": 902}),
                         ("input_gap", "p1", 18.18, {"ms": 750}), ("freeze", "p1", 18.19, {"kind": "stall", "ms": 734, "live": True}))
        self.assertEqual(stats.freeze_causes(blocked), {"own_device": 1, "opponent_device": 1})

        # P1 stopped receiving: P1 goes silent because it stalled, and P2 (still running) stalls after it
        blackout = events(("input_gap", "p1", 18.34, {"ms": 1371}), ("freeze", "p1", 18.36, {"kind": "stall", "ms": 1350, "live": True}),
                          ("input_gap", "p2", 18.51, {"ms": 1222}), ("freeze", "p2", 18.53, {"kind": "stall", "ms": 1202, "live": True}))
        self.assertEqual(stats.freeze_causes(blackout), {"own_connection": 1, "opponent_silent": 1})

        # Out of round freezes don't count here, and two unrelated moments don't get linked
        unrelated = events(("freeze", "p1", 5, {"kind": "hitch", "ms": 400, "live": False}), ("input_gap", "p2", 10, {"ms": 300}),
                           ("freeze", "p1", 30, {"kind": "stall", "ms": 300, "live": True}))
        self.assertEqual(stats.freeze_causes(unrelated), {"own_connection": 1})

    def test_restart_reasons(self):
        self.match("m1", segment=2)
        self.event("m1", "segment_restart", reason="reconnect", segment=1)
        self.event("m1", "segment_restart", reason="desync", segment=2)
        page = stats.tab_reliability(self.conn, self.scope())
        self.assertEqual(value(page, "Bout restarts per fight")["value"], 2)
        rows = {r["reason"]: r["count"] for r in block_of(page, "Why bouts restarted")["rows"]}
        self.assertEqual(rows, {"A player reconnected": 1, "The simulations differed": 1})


class TestBalance(StatsCase):
    def test_win_rates_ignore_forfeits_and_mirrors(self):
        self.match("win1", hero1=0, hero2=1, winner="a")
        self.match("win2", hero1=0, hero2=1, winner="b")
        self.match("win3", hero1=0, hero2=2, winner="a")
        self.match("forfeit", hero1=0, hero2=1, winner="b", reason="AUTOWIN_DISCONNECT")
        self.match("mirror", hero1=3, hero2=3, winner="a")
        self.match("draw", hero1=4, hero2=5, winner=None, reason="DRAW", rounds=(2, 2))
        page = stats.tab_balance(self.conn, self.scope())
        rows = {r["hero"]: r for r in block_of(page, "Pick rate and win rate")["rows"]}
        self.assertEqual((rows["Scorpion"]["games"], rows["Scorpion"]["wins"]), (3, 2))
        self.assertAlmostEqual(rows["Scorpion"]["win_rate"], 2 / 3)
        self.assertEqual((rows["Sub-Zero"]["games"], rows["Sub-Zero"]["wins"]), (2, 1))
        self.assertEqual(rows["Shao Kahn"]["games"], 0)
        self.assertIsNone(rows["Shao Kahn"]["win_rate"])
        self.assertEqual(rows["Shao Kahn"]["picks"], 2)  # a mirror is still two picks
        self.assertEqual(rows["Scorpion"]["picks"], 4)   # the forfeit still counts as a pick
        self.assertEqual(sum(r["picks"] for r in rows.values()), 12)
        self.assertEqual(value(page, "Mirror matches")["value"], 1)
        self.assertEqual(block_of(page, "Who beats whom")["rows"][0]["h1"], "1 to 1")

    def test_p1_win_rate_comes_with_its_uncertainty(self):
        for i in range(3):
            self.match(f"p1_{i}", winner="a")
        self.match("p2_0", winner="b")
        item = value(stats.tab_balance(self.conn, self.scope()), "P1 win rate")
        self.assertEqual((item["value"], item["n"]), (0.75, 4))
        self.assertIn("Could be", item["note"])

    def test_wilson_interval(self):
        low, high = stats.wilson(5, 10)
        self.assertAlmostEqual(low, 0.2366, places=3)
        self.assertAlmostEqual(high, 0.7634, places=3)
        self.assertEqual(stats.wilson(0, 0), (None, None))
        low, high = stats.wilson(10, 10)
        self.assertEqual(high, 1.0)
        self.assertLess(low, 0.8)  # ten wins from ten isn't proof of a 100% win rate

    def test_final_scores(self):
        self.match("clean", rounds=(2, 0), winner="a")
        self.match("close", rounds=(1, 2), winner="b")
        self.match("drawn", rounds=(2, 2), winner=None, reason="DRAW")
        self.match("gone", reason="AUTOWIN_DISCONNECT", rounds=(1, 0), winner="a")
        rows = {r["score"]: r["count"] for r in block_of(stats.tab_balance(self.conn, self.scope()), "Final scores")["rows"]}
        self.assertEqual(rows, {"2 to 0": 1, "2 to 1": 1, "Draw": 1})


class TestPlayers(StatsCase):
    def test_retention_only_counts_players_whose_day_has_come(self):
        # Day -10: "old" fights, and comes back the next day and a week later
        self.match("o1", created=NOW - 10 * DAY, p1="old", p2="x", winner="old")
        self.match("o2", created=NOW - 9 * DAY, p1="old", p2="x", winner="old")
        self.match("o3", created=NOW - 3 * DAY, p1="old", p2="y", winner="old")
        # Three days ago: "y" starts, doesn't come back
        # Just now: "new" starts; tomorrow hasn't happened yet
        self.match("n1", created=NOW - 100, p1="new", p2="old", winner="new", length=10)
        page = stats.tab_players(self.conn, self.scope(days=30))
        d1 = value(page, "Fought again on the next day")
        # Eligible: old, x, y. New's next day is still to come. Old and x fought again the next day.
        self.assertEqual(d1["n"], 3)
        self.assertAlmostEqual(d1["value"], 2 / 3)
        d7 = value(page, "Fought again on day 7")
        # Eligible for day 7: old and x. Old fought again on day 7 (day -3).
        self.assertEqual(d7["n"], 2)
        self.assertAlmostEqual(d7["value"], 1 / 2)

    def test_a_player_row_adds_up(self):
        self.match("w", p1="a", p2="b", winner="a")
        self.match("l", p1="b", p2="a", winner="b")
        self.match("d", p1="a", p2="b", winner=None, reason="DRAW", rounds=(2, 2))
        self.match("fw", p1="a", p2="b", winner="a", reason="AUTOWIN_DISCONNECT")
        self.match("fl", p1="a", p2="b", winner="b", reason="AUTOWIN_DISCONNECT")
        rows = {r["player_id"]: r for r in block_of(stats.tab_players(self.conn, self.scope()), "Players")["rows"]}
        a = rows["a"]
        self.assertEqual((a["fights"], a["played"], a["wins"], a["losses"], a["draws"], a["forfeits_won"], a["forfeits_lost"]), (5, 3, 1, 1, 1, 1, 1))
        self.assertEqual(a["win_rate"], 0.5)  # forfeits don't count towards it

    def test_days_are_in_the_viewers_time_zone(self):
        # 22:00 UTC is already the next day in Tashkent (UTC+5)
        moment = 1_799_964_000.0
        self.assertEqual(stats.Scope(days=1, now=NOW).day(moment), "2027-01-14")
        self.assertEqual(stats.Scope(days=1, now=NOW, tz_minutes=300).day(moment), "2027-01-15")


class TestFightLog(StatsCase):
    def test_a_row_for_every_fight_and_filters(self):
        self.match("good", length=100)
        self.window("good", "p1", active=100)
        self.window("good", "p2", active=95, hitch_freezes_live=2)
        self.event("good", "player_disconnected", player="a", in_fight=True, close_code=1006, replaced=False)
        self.match("unreported", p1="carol", p2="dan", winner="carol")
        rows = {r["match_id"]: r for r in block_of(stats.tab_fights(self.conn, self.scope()), "2 fights")["rows"]}
        self.assertEqual(rows["good"]["freezes"], 2)
        self.assertEqual(rows["good"]["drops"], 1)
        self.assertEqual(rows["good"]["coverage"], 0.95)
        self.assertEqual(rows["unreported"]["coverage"], 0)
        self.assertEqual(rows["unreported"]["heroes"], "Scorpion vs Sub-Zero")
        self.assertEqual([r["match_id"] for r in block_of(stats.tab_fights(self.conn, self.scope(), only="freezes"), "1 fights")["rows"]], ["good"])
        self.assertEqual([r["match_id"] for r in block_of(stats.tab_fights(self.conn, self.scope(), only="no_reports"), "1 fights")["rows"]], ["unreported"])
        self.assertEqual([r["match_id"] for r in block_of(stats.tab_fights(self.conn, self.scope(), query="CAROL"), "1 fights")["rows"]], ["unreported"])

    def test_one_fight_in_detail(self):
        self.match("m1", length=100, paused=10, segment=1)
        base = NOW - DAY + 20
        self.window("m1", "p1", active=60, received_at=base + 60, delay=4, peer_rtt=100, seq=0)
        self.window("m1", "p1", active=40, received_at=base + 110, delay=5, peer_rtt=120, seq=1)
        self.event("m1", "fight_started", at=base, stage=0)
        self.event("m1", "freeze", at=base + 30, player="a", role="p1", kind="stall", ms=400, live=True, open=False)
        detail = stats.fight_detail(self.conn, "m1")
        self.assertEqual(detail["fight"]["active_secs"], 100)
        self.assertEqual(detail["sides"]["p1"]["reports"], 2)
        self.assertEqual(detail["sides"]["p1"]["coverage"], 1.0)
        self.assertEqual([e["kind"] for e in detail["timeline"]], ["fight_started", "freeze"])
        self.assertEqual(detail["timeline"][1]["t"], 30)
        self.assertEqual(detail["timeline"][1]["detail"], "waited for the opponent 400ms, in round")
        self.assertTrue(detail["timeline"][1]["problem"])
        self.assertEqual(detail["causes"], {"own_connection": 1})
        self.assertEqual(detail["lines"]["peer_rtt"][0]["points"][0], [60, 100])
        self.assertIsNone(stats.fight_detail(self.conn, "nope"))

    def test_leaving_is_only_a_problem_before_the_match_is_over(self):
        self.match("m1", length=100)
        base = NOW - DAY + 20
        self.event("m1", "player_away", at=base + 30, player="a", role="p1", in_fight=True)
        self.event("m1", "player_disconnected", at=base + 40, player="b", role="p2", in_fight=True, close_code=1006, replaced=False)
        self.event("m1", "player_away", at=base + 101, player="a", role="p1", in_fight=False)
        self.event("m1", "player_disconnected", at=base + 102, player="b", role="p2", in_fight=False, close_code=1001, replaced=False)
        timeline = stats.fight_detail(self.conn, "m1")["timeline"]
        self.assertEqual([e["problem"] for e in timeline], [True, True, False, False])
        # A match still running has no end, so anyone leaving it counts
        self.match("m2", status="ACTIVE")
        self.event("m2", "player_disconnected", at=base + 40, player="b", role="p2", in_fight=True, close_code=1006, replaced=False)
        self.assertTrue(stats.fight_detail(self.conn, "m2")["timeline"][0]["problem"])


class TestDataQuality(StatsCase):
    def statuses(self):
        return {c["name"]: c for c in stats.data_quality_checks(self.conn, self.scope())}

    def leaderboard(self, wins, losses, games):
        self.conn.execute("INSERT INTO local_leaderboard (chat_id, user_id, first_name, wins, losses, draws, games_played, last_played_at) VALUES ('c', 'u', 'U', ?, ?, 0, ?, 1)", (wins, losses, games))
        self.conn.commit()

    def test_good_data_passes_everything(self):
        self.match("m1", length=100)
        self.window("m1", "p1", active=100)
        self.window("m1", "p2", active=100)
        self.event("m1", "round_settled", p1=2, p2=0)
        self.leaderboard(1, 1, 2)
        failed = [c["name"] for c in stats.data_quality_checks(self.conn, self.scope()) if c["status"] != "ok"]
        self.assertEqual(failed, [])

    def test_each_kind_of_bad_row_is_caught(self):
        self.match("fine", length=100)
        self.leaderboard(1, 1, 2)
        self.assertEqual(self.statuses()["The leaderboard adds up"]["status"], "ok")

        # A winner who didn't fight, a score that contradicts it, a report for an unknown match...
        self.match("wrong_winner", winner="z")
        self.assertEqual(self.statuses()["Winners fought"]["status"], "fail")
        self.assertEqual(self.statuses()["Winners won on rounds"]["examples"], ["wrong_winner"])
        self.assertEqual(self.statuses()["The leaderboard adds up"]["status"], "fail")

        self.window("ghost", "p1", active=10)
        self.assertEqual(self.statuses()["Reports belong to real matches"]["status"], "fail")
        self.event("ghost2", "freeze", kind="stall", ms=300)
        self.assertEqual(self.statuses()["Events belong to real matches"]["status"], "fail")
        self.event("ghost3", "join_rejected", reason="NOT_FOUND")  # a rejected join legitimately has no match
        self.assertEqual(self.statuses()["Events belong to real matches"]["bad"], 1)

        self.match("impossible", length=100)
        self.window("impossible", "p1", active=10, ticks=10000)
        self.assertEqual(self.statuses()["Phones can't outrun the clock"]["examples"], ["impossible"])
        self.window("impossible", "p2", active=10, stall_ms=999999, secs=10)
        self.assertEqual(self.statuses()["Parts fit inside wholes"]["examples"], ["impossible"])

        self.match("backwards", length=-50)
        self.assertEqual(self.statuses()["Fights end after they start"]["examples"], ["backwards"])

        self.match("no_players", segment=0)
        self.conn.execute("UPDATE matches SET p1_hero = NULL WHERE match_id = 'no_players'")
        self.conn.commit()
        self.assertEqual(self.statuses()["Fights record their setup"]["examples"], ["no_players"])

        self.match("stuck", status="ACTIVE", reason=None, winner=None, created=NOW - DAY)
        self.assertEqual(self.statuses()["No fight stays open forever"]["examples"], ["stuck"])

    def test_timeline_disagreements(self):
        self.match("score", rounds=(2, 0))
        self.event("score", "round_settled", p1=2, p2=1)
        self.assertEqual(self.statuses()["Scores match the timeline"]["examples"], ["score"])
        self.match("restarts", segment=2)
        self.event("restarts", "segment_restart", reason="reconnect", segment=1)
        self.assertEqual(self.statuses()["Restarts match the timeline"]["examples"], ["restarts"])

    def test_reports_against_the_servers_clock(self):
        self.match("double", length=100)
        self.window("double", "p1", active=130)
        self.window("double", "p2", active=100)
        self.assertEqual(self.statuses()["Phone reports don't exceed the fight"]["examples"], ["double"])

        self.match("silent", length=100)
        self.window("silent", "p1", active=100)
        checks = self.statuses()
        self.assertEqual(checks["Phones report the fights they play"]["status"], "warn")  # a phone can die; a warning
        self.assertEqual(checks["Phones report the fights they play"]["examples"], ["silent"])

        self.match("partial", length=100)
        self.window("partial", "p1", active=100)
        self.window("partial", "p2", active=10)
        self.assertEqual(self.statuses()["Phones report most of each fight"]["examples"], ["partial"])

    def test_old_fights_are_counted_apart(self):
        self.conn.execute("""INSERT INTO matches (match_id, chat_id, creator_id, creator_name, status, created_at, expires_at, room_state)
                             VALUES ('old', 'c', 'a', 'A', 'ABANDONED', 1, 2, '{"seed": 5, "p1_hero": 1}')""")
        self.conn.commit()
        page = stats.tab_quality(self.conn, self.scope(), {"written": 3, "dropped": 0, "write_errors": 0, "windows_rejected": 0})
        self.assertEqual(value(page, "Old fights not counted")["value"], 1)
        self.assertEqual(value(stats.tab_overview(self.conn, self.scope(days=0)), "Fights started")["value"], 0)


class TestEveryPageRenders(StatsCase):
    def test_on_an_empty_database(self):
        for name, tab in stats.TABS.items():
            json.dumps(tab(self.conn, self.scope()))

    def test_on_a_busy_one_and_all_of_it_is_json(self):
        self.match("m1", segment=1)
        self.window("m1", "p1", live_delay_hist=json.dumps([0] * 16), live_frame_hist=json.dumps([0] * 7), live_stall_hist=json.dumps([0] * 5), platform="android", model="SM-A135F", peer_rtt=80, p2p=1, ice_path="relay-relay")
        self.event("m1", "player_connected", player="a", role="p1", reconnect=False, in_fight=False, client={"platform": "android", "boot_ms": 900, "memory_gb": 4, "net": "4g"})
        self.conn.execute("INSERT INTO server_samples (at, lag_p50_ms, lag_p99_ms, lag_max_ms, cpu_pct, rss_mb, live_fights, secs, relay_msgs, relay_kb, db_mb) VALUES (?, 1, 5, 9, 20, 80, 2, 60, 7200, 300, 12)", (NOW - 100,))
        self.conn.commit()
        for days in (1, 7, 0):
            for name, tab in stats.TABS.items():
                json.dumps(tab(self.conn, self.scope(days=days)))
        page = stats.tab_server(self.conn, self.scope())
        self.assertEqual(value(page, "Worst lag seen")["value"], 9)
        self.assertEqual(value(page, "Most fights at once")["value"], 2)
        rows = block_of(stats.tab_devices(self.conn, self.scope()), "Device model")["rows"]
        self.assertEqual(rows[0]["model"], "SM-A135F")
        self.assertEqual(value(stats.tab_devices(self.conn, self.scope()), "Load time")["value"], 900)

    def test_a_reading_never_taken_is_not_a_zero(self):
        # /proc is Linux only, so memory can be NULL. That has to read as no data, and a real zero has to stay a zero.
        self.conn.execute("INSERT INTO server_samples (at, lag_max_ms, cpu_pct, rss_mb, live_fights, secs) VALUES (?, 9, 20, NULL, 0, 60)", (NOW - 100,))
        self.conn.commit()
        page = stats.tab_server(self.conn, self.scope())
        self.assertIsNone(value(page, "Peak memory")["value"])
        self.assertEqual(value(page, "Peak memory")["n"], 0)
        self.assertEqual(value(page, "Most fights at once")["value"], 0)
        self.assertEqual(value(page, "Most fights at once")["n"], 1)
        self.conn.execute("INSERT INTO server_samples (at, lag_max_ms, cpu_pct, rss_mb, live_fights, secs) VALUES (?, 4, 10, 80, 1, 60)", (NOW - 50,))
        self.conn.commit()
        page = stats.tab_server(self.conn, self.scope())
        self.assertEqual(value(page, "Peak memory")["value"], 80)
        self.assertEqual(value(page, "Peak memory")["n"], 1)

    def test_exports_defuse_spreadsheet_formulas(self):
        self.match("m1", p1="=HYPERLINK(1)", p2="b", winner="b")
        columns, rows = stats.export_rows(self.conn, "fights", self.scope())
        cell = rows[0][columns.index("creator_id")]
        self.assertEqual(cell, "'=HYPERLINK(1)")
        self.assertEqual(rows[0][columns.index("created_at")], NOW - DAY)  # numbers stay numbers
        for name in stats.EXPORTS:
            stats.export_rows(self.conn, name, self.scope())


class TestCleaningPhoneReports(unittest.TestCase):
    def test_a_good_report_keeps_its_numbers(self):
        window = clean_window({"secs": 10, "paused_ms": 2000, "hidden_ms": 1000, "ticks": 420, "delay": 4, "p2p": True, "ice_path": "relay-relay",
                               "live_delay_hist": [0, 0, 0, 0, 420] + [0] * 11, "lead_min": -3, "lead_sum": 12, "reason": "interval"})
        self.assertEqual(window["active_secs"], 7.0)
        self.assertEqual(window["ticks"], 420)
        self.assertEqual(window["p2p"], 1)
        self.assertEqual(window["lead_min"], -3)
        self.assertEqual(json.loads(window["live_delay_hist"])[4], 420)

    def test_junk_becomes_null_rather_than_a_number(self):
        window = clean_window({"secs": "ten", "ticks": -5, "stalls": float("nan"), "stall_ms": float("inf"), "frames": 1e12, "delay": True, "p2p": "yes",
                               "live_delay_hist": [1, 2], "live_frame_hist": "abc", "live_stall_hist": [1, 2, 3, "x", 5], "ice_path": {"a": 1}})
        for field in ("secs", "ticks", "stalls", "stall_ms", "frames", "delay", "p2p", "live_delay_hist", "live_frame_hist", "live_stall_hist", "ice_path", "active_secs"):
            self.assertIsNone(window[field], field)

    def test_paused_time_cant_make_fight_time_negative(self):
        self.assertEqual(clean_window({"secs": 5, "paused_ms": 9000})["active_secs"], 0.0)

    def test_nothing_extra_is_kept(self):
        window = clean_window({"user_name": "should not be kept", "secs": 1})
        self.assertNotIn("user_name", window)
        self.assertTrue(set(window) <= set(db.NET_WINDOW_COLUMNS), set(window) - set(db.NET_WINDOW_COLUMNS))

    def test_freezes_are_checked_and_capped(self):
        good = {"kind": "stall", "ms": 300, "ago_ms": 100, "tick": 5, "live": True}
        self.assertEqual(clean_freezes(None), [])
        self.assertEqual(clean_freezes([{"kind": "other", "ms": 1, "ago_ms": 1}, {"kind": "hitch", "ms": "x", "ago_ms": 1}, "junk"]), [])
        self.assertEqual(clean_freezes([good])[0], {"kind": "stall", "ms": 300, "ago_ms": 100, "tick": 5, "live": True, "open": False})
        self.assertEqual(len(clean_freezes([good] * 500)), 20)

    def test_device_descriptions(self):
        android = "Mozilla/5.0 (Linux; Android 13; SM-A135F Build/TP1A.220624.014; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/119.0.6045.163 Mobile Safari/537.36 Telegram-Android/10.2.9 (Samsung SM-A135F; Android 13; SDK 33; AVERAGE)"
        self.assertEqual(describe_device(android), {"os": "Android 13", "model": "Samsung SM-A135F", "perf_class": "AVERAGE"})
        plain = "Mozilla/5.0 (Linux; Android 11; Redmi Note 8 Build/RKQ1.201004.002; wv) AppleWebKit/537.36 Chrome/119.0 Mobile Safari/537.36"
        self.assertEqual(describe_device(plain), {"os": "Android 11", "model": "Redmi Note 8", "perf_class": None})
        reduced = "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36"
        self.assertEqual(describe_device(reduced), {"os": "Android 10", "model": None, "perf_class": None})
        iphone = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148"
        self.assertEqual(describe_device(iphone), {"os": "iOS 17", "model": "iPhone", "perf_class": None})
        self.assertEqual(describe_device("Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0")["os"], "Windows")
        self.assertEqual(describe_device(None)["os"], None)

    def test_client_info_is_reduced_to_known_fields(self):
        client = clean_client({"platform": "Android<script>", "cores": 8, "memory_gb": "lots", "boot_ms": 1200, "secret": "x", "ua": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)"})
        self.assertEqual(client["platform"], "androidscript")
        self.assertEqual(client["cores"], 8)
        self.assertIsNone(client["memory_gb"])
        self.assertEqual(client["os"], "iOS 16")
        self.assertNotIn("secret", client)
        self.assertEqual(clean_client("junk"), {})


if __name__ == "__main__":
    unittest.main()
