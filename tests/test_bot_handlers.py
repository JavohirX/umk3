"""
Unit tests for bot.py Telegram interaction logic:
- Inline query results (no web_app buttons, which Telegram rejects there)
- DM and group challenges (web_app buttons only in private chats; groups get links)
- One-tap Direct Link Mini App buttons when WEBAPP_SHORT_NAME is set
- Deep-linked entry (/start challenge_<id>, replay_<id>, a match being fought)
- Match updates from the game server: accept ping, live message, result post, expiry
- HTML escaping of player names
"""

import os
import tempfile
import unittest
from unittest.mock import AsyncMock, MagicMock, patch

import server.db as db
import bot


def make_message(chat_id, chat_type, user_id, first_name, title=None):
    user = MagicMock(id=user_id, first_name=first_name)
    chat = MagicMock(id=chat_id, type=chat_type, title=title)
    message = MagicMock(chat=chat, from_user=user)
    sent = MagicMock(message_id=555, chat=MagicMock(id=chat_id))
    message.answer = AsyncMock(return_value=sent)
    return message


def buttons(markup):
    return [button for row in markup.inline_keyboard for button in row]


class BotTestCase(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        self.orig_db = db.DB_PATH
        fd, self.test_db = tempfile.mkstemp(suffix=".db")
        os.close(fd)
        db.DB_PATH = self.test_db
        db.init_db()

    def tearDown(self):
        db.DB_PATH = self.orig_db
        try:
            os.remove(self.test_db)
        except OSError:
            pass


class TestChallenges(BotTestCase):
    async def test_inline_query_keyboard_does_not_use_web_app(self):
        query = MagicMock(from_user=MagicMock(id=12345, first_name="SubZero"), query="")
        query.answer = AsyncMock()

        await bot.handle_inline_query(query)

        results = query.answer.call_args[0][0]
        self.assertEqual(len(results), 2)
        btn = results[0].reply_markup.inline_keyboard[0][0]
        self.assertEqual(btn.text, "Play")
        self.assertIsNone(btn.web_app, "Inline query result MUST NOT have web_app attribute!")
        self.assertTrue(btn.url.startswith(f"https://t.me/{bot.BOT_USERNAME}?start=challenge_"))

    async def test_inline_query_creates_no_match_until_one_is_sent(self):
        query = MagicMock(from_user=MagicMock(id=12345, first_name="SubZero"), query="")
        query.answer = AsyncMock()

        await bot.handle_inline_query(query)
        await bot.handle_inline_query(query)  # the user keeps typing, or reopens inline mode

        ids = [call[0][0][0].id.split("_", 1)[1] for call in query.answer.call_args_list]
        self.assertNotEqual(ids[0], ids[1])
        self.assertIsNone(db.get_match(ids[0]))
        self.assertIsNone(db.get_match(ids[1]))

        # Sending the second one creates its match, for the user who sent it, and remembers the message
        chosen = MagicMock(result_id=f"challenge_{ids[1]}", inline_message_id="INLINE-9",
                           from_user=MagicMock(id=12345, first_name="SubZero"))
        await bot.handle_chosen_inline_result(chosen)
        match = db.get_match(ids[1])
        self.assertEqual((match["chat_id"], match["creator_id"], match["creator_name"], match["status"]),
                         ("inline", "12345", "SubZero", "WAITING"))
        self.assertEqual(match["inline_message_id"], "INLINE-9")
        self.assertIsNone(db.get_match(ids[0]))

    async def test_forwarded_chat_challenge_keeps_its_match(self):
        """'Send to a Friend' forwards a challenge made in a chat; sending it must not replace that match."""
        db.create_match("m_dm", "100", "100", "Alice")
        chosen = MagicMock(result_id="challenge_m_dm", inline_message_id="INLINE-2",
                           from_user=MagicMock(id=100, first_name="Alice"))
        await bot.handle_chosen_inline_result(chosen)
        match = db.get_match("m_dm")
        self.assertEqual((match["chat_id"], match["inline_message_id"]), ("100", "INLINE-2"))

    async def test_sharing_a_record_creates_nothing(self):
        chosen = MagicMock(result_id="record_100", inline_message_id=None, from_user=MagicMock(id=100))
        await bot.handle_chosen_inline_result(chosen)
        self.assertIsNone(db.get_match("100"))

    async def test_dm_challenge_provides_friend_picker_and_share_link(self):
        message = make_message(55555, "private", 55555, "Scorpion")
        await bot.handle_challenge(message)

        kwargs = message.answer.call_args[1]
        row1, row2 = kwargs["reply_markup"].inline_keyboard[:2]
        self.assertEqual(row1[0].text, "⚔️ Send to a Friend")
        self.assertTrue(row1[0].switch_inline_query.startswith("challenge_"))
        self.assertIn("t.me/share/url", row1[1].url)
        self.assertEqual(row2[0].text, "Play")
        self.assertIsNotNone(row2[0].web_app)

    async def test_group_challenge_uses_links_not_web_app_buttons(self):
        """Telegram only allows web_app buttons in private chats; a group challenge must use a link."""
        message = make_message(-100777, "supergroup", 42, "Raiden")
        await bot.handle_challenge(message)

        markup = message.answer.call_args[1]["reply_markup"]
        self.assertTrue(all(b.web_app is None for b in buttons(markup)))
        play = buttons(markup)[0]
        self.assertTrue(play.url.startswith(f"https://t.me/{bot.BOT_USERNAME}?start=challenge_"))
        match_id = play.url.split("challenge_")[1]
        match = db.get_match(match_id)
        self.assertEqual((match["chat_id"], match["message_chat_id"], match["message_id"]), ("-100777", "-100777", 555))

    async def test_direct_link_opens_the_game_in_one_tap(self):
        with patch.object(bot, "WEBAPP_SHORT_NAME", "fight"):
            message = make_message(-100777, "supergroup", 42, "Raiden")
            await bot.handle_challenge(message)
        play = buttons(message.answer.call_args[1]["reply_markup"])[0]
        self.assertTrue(play.url.startswith(f"https://t.me/{bot.BOT_USERNAME}/fight?startapp=challenge_"))

    async def test_deep_link_start_for_creator_and_opponent(self):
        db.create_match("test_dl", "chat_group", creator_id="100", creator_name="Raiden")
        cmd = MagicMock(args="challenge_test_dl")

        creator_msg = make_message(100, "private", 100, "Raiden")
        await bot.handle_start(creator_msg, cmd)
        self.assertIn("YOUR CHALLENGE IS LIVE", creator_msg.answer.call_args[0][0])

        opp_msg = make_message(200, "private", 200, "LiuKang")
        await bot.handle_start(opp_msg, cmd)
        text = opp_msg.answer.call_args[0][0]
        self.assertIn("CHALLENGE DETECTED", text)
        self.assertIn("Raiden", text)

    async def test_deep_link_to_a_live_match_offers_to_watch(self):
        db.create_match("m_live", "chat_group", creator_id="100", creator_name="Raiden")
        db.join_match("m_live", "200", "Kano")
        msg = make_message(300, "private", 300, "Fan")
        await bot.handle_start(msg, MagicMock(args="challenge_m_live"))
        markup = msg.answer.call_args[1]["reply_markup"]
        self.assertEqual(buttons(markup)[0].text, "👁 Watch live")
        self.assertIn("match=m_live", buttons(markup)[0].web_app.url)

    async def test_deep_link_replay(self):
        msg = make_message(300, "private", 300, "Fan")
        await bot.handle_start(msg, MagicMock(args="replay_abc123"))
        self.assertIn("replay=abc123", buttons(msg.answer.call_args[1]["reply_markup"])[0].web_app.url)

    def test_player_names_are_escaped_in_html_messages(self):
        db.create_match("m_esc", "-1001", "1", "<b>Evil</b>")
        db.join_match("m_esc", "2", "Tom & Jerry")
        db.finish_match("m_esc", winner_id="2", finish_reason="KNOCKOUT")
        text = bot.format_leaderboard_text("-1001", "Group <3")
        self.assertIn("Tom &amp; Jerry", text)
        self.assertIn("&lt;b&gt;Evil", text)
        self.assertIn("Group &lt;3", text)


class TestMatchEvents(BotTestCase):
    def info(self, match_id, chat_id="-100777", **extra):
        return {"match_id": match_id, "chat_id": chat_id,
                "creator": {"id": "100", "name": "Alice"}, "opponent": {"id": "200", "name": "Bob"},
                "p1": {"id": "200", "name": "Bob", "hero": "Scorpion"}, "p2": {"id": "100", "name": "Alice", "hero": "Sub-Zero"},
                "rounds": [2, 1], "result": None, **extra}

    async def test_creator_is_pinged_when_someone_accepts(self):
        db.create_match("m_acc", "-100777", "100", "Alice")
        db.set_challenge_message("m_acc", "-100777", 9)
        tg = MagicMock(send_message=AsyncMock(), edit_message_text=AsyncMock())
        await bot.on_match_event(tg, "challenge_accepted", self.info("m_acc"))
        self.assertEqual(tg.send_message.call_args_list[0][0][0], 100)  # a DM to the creator
        self.assertIn("Bob", tg.send_message.call_args_list[0][0][1])
        self.assertEqual(tg.edit_message_text.call_args[1]["message_id"], 9)

    async def test_group_is_used_when_the_creator_cannot_be_messaged(self):
        db.create_match("m_acc2", "-100777", "100", "Alice")
        tg = MagicMock(send_message=AsyncMock(side_effect=[Exception("bot was blocked"), None]), edit_message_text=AsyncMock())
        await bot.on_match_event(tg, "challenge_accepted", self.info("m_acc2"))
        self.assertEqual(tg.send_message.call_args_list[1][0][0], -100777)
        self.assertIn("tg://user?id=100", tg.send_message.call_args_list[1][0][1])

    async def test_result_is_posted_to_the_group_and_the_challenge_message_updated(self):
        db.create_match("m_res", "-100777", "100", "Alice")
        db.set_challenge_message("m_res", "-100777", 9)
        result = {"winner_id": "200", "winner_name": "Bob", "loser_name": "Alice", "p1_rounds": 2, "p2_rounds": 1,
                  "reason": "KNOCKOUT"}
        tg = MagicMock(send_message=AsyncMock(), edit_message_text=AsyncMock())
        await bot.on_match_event(tg, "match_ended", self.info("m_res", result=result, has_replay=True))
        text = tg.send_message.call_args[0][1]
        self.assertIn("<b>Bob</b> beat <b>Alice</b> 2–1 (Scorpion vs Sub-Zero)", text)
        posted = buttons(tg.send_message.call_args[1]["reply_markup"])
        self.assertTrue(posted[0].url.endswith("start=replay_m_res"))
        self.assertIn("beat", tg.edit_message_text.call_args[1]["text"])

    async def test_inline_challenge_message_is_edited_in_place(self):
        db.create_match("m_inl", "inline", "100", "Alice")
        db.set_inline_message("m_inl", "INLINE-1")
        tg = MagicMock(send_message=AsyncMock(), edit_message_text=AsyncMock())
        await bot.on_match_event(tg, "match_started", self.info("m_inl", chat_id="inline"))
        self.assertEqual(tg.edit_message_text.call_args[1]["inline_message_id"], "INLINE-1")
        tg.send_message.assert_not_called()


class TestFeedback(unittest.IsolatedAsyncioTestCase):
    ADMIN = 999000

    def setUp(self):
        patcher = patch.object(bot, "ADMIN_ID", self.ADMIN)
        patcher.start()
        self.addCleanup(patcher.stop)
        bot._last_feedback_at.clear()
        self.tg = MagicMock(send_message=AsyncMock(), copy_message=AsyncMock())
        self.state = AsyncMock()

    def message(self, text="hi", chat_type="private", user_id=42, first_name="Liu", username="liukang", title=None):
        message = make_message(chat_id=user_id if chat_type == "private" else -100555, chat_type=chat_type,
                               user_id=user_id, first_name=first_name, title=title)
        message.from_user.full_name = first_name
        message.from_user.username = username
        message.text = text
        message.message_id = 77
        return message

    def replies(self, message):
        return [call[0][0] for call in message.answer.call_args_list]

    async def test_feedback_with_text_is_sent_to_the_admin(self):
        message = self.message("/feedback the d-pad is great")
        await bot.handle_feedback(message, MagicMock(args="the d-pad is great"), self.state, self.tg)

        chat_id, text = self.tg.send_message.call_args[0]
        self.assertEqual(chat_id, self.ADMIN)
        self.assertIn('<a href="tg://user?id=42">Liu</a>', text)
        self.assertIn("@liukang", text)
        self.assertIn("id <code>42</code>", text)
        self.assertTrue(text.endswith("the d-pad is great"))
        self.assertIn("sent to the developer", self.replies(message)[0])
        self.state.set_state.assert_not_called()

    async def test_bare_feedback_asks_for_it_then_sends_the_next_message(self):
        prompt = self.message("/feedback")
        await bot.handle_feedback(prompt, MagicMock(args=None), self.state, self.tg)
        self.state.set_state.assert_awaited_with(bot.FeedbackForm.waiting)
        self.assertIsInstance(prompt.answer.call_args[1]["reply_markup"], bot.ForceReply)
        self.tg.send_message.assert_not_called()

        reply = self.message("rounds end too fast")
        await bot.handle_feedback_message(reply, self.state, self.tg)
        self.state.clear.assert_awaited()
        self.assertTrue(self.tg.send_message.call_args[0][1].endswith("rounds end too fast"))

    async def test_a_screenshot_is_copied_to_the_admin_under_a_header(self):
        photo = self.message(text=None)
        await bot.handle_feedback_message(photo, self.state, self.tg)
        header = self.tg.send_message.call_args[0][1]
        self.assertIn("Feedback", header)
        self.tg.copy_message.assert_awaited_with(chat_id=self.ADMIN, from_chat_id=42, message_id=77)

    async def test_other_commands_while_waiting_are_not_feedback(self):
        await bot.handle_feedback_message(self.message("/leaderboard"), self.state, self.tg)
        self.tg.send_message.assert_not_called()
        self.state.clear.assert_not_called()

    async def test_group_feedback_names_the_group_and_escapes_html(self):
        message = self.message("<b>bold</b> & co", chat_type="group", first_name="<Raiden>", title="Outworld <3")
        await bot.handle_feedback(message, MagicMock(args="<b>bold</b> & co"), self.state, self.tg)
        text = self.tg.send_message.call_args[0][1]
        self.assertIn("&lt;Raiden&gt;", text)
        self.assertIn("in <b>Outworld &lt;3</b>", text)
        self.assertTrue(text.endswith("&lt;b&gt;bold&lt;/b&gt; &amp; co"))

    async def test_a_second_message_within_the_cooldown_is_not_sent(self):
        await bot.handle_feedback(self.message(), MagicMock(args="one"), self.state, self.tg)
        second = self.message()
        await bot.handle_feedback(second, MagicMock(args="two"), self.state, self.tg)
        self.assertEqual(self.tg.send_message.await_count, 1)
        self.assertIn("wait a moment", self.replies(second)[0])

    async def test_no_admin_id_means_feedback_is_off(self):
        with patch.object(bot, "ADMIN_ID", None):
            message = self.message()
            await bot.handle_feedback(message, MagicMock(args="hello"), self.state, self.tg)
        self.tg.send_message.assert_not_called()
        self.assertIn("isn't switched on", self.replies(message)[0])

    async def test_delivery_failure_is_reported_and_does_not_start_the_cooldown(self):
        self.tg.send_message.side_effect = bot.TelegramAPIError(method=MagicMock(), message="Forbidden: chat not found")
        message = self.message()
        await bot.handle_feedback(message, MagicMock(args="hello"), self.state, self.tg)
        self.assertIn("couldn't be delivered", self.replies(message)[0])
        self.assertNotIn(42, bot._last_feedback_at)

    def test_admin_id_parsing(self):
        self.assertEqual(bot.parse_admin_id(" 123456 "), 123456)
        self.assertIsNone(bot.parse_admin_id(""))
        self.assertIsNone(bot.parse_admin_id(None))
        self.assertIsNone(bot.parse_admin_id("@someone"))


if __name__ == "__main__":
    unittest.main()
