"""
Unit tests for bot.py Telegram interaction logic:
- Inline query generation (asserts no invalid web_app buttons in inline results)
- DM challenge creation with friend-picker & share links
- Group challenge creation
- Deep-linked challenge entry (/start challenge_<id>)
"""

import unittest
from unittest.mock import AsyncMock, MagicMock
import server.db as db
import bot


class TestBotHandlers(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        db.init_db()

    async def test_inline_query_keyboard_does_not_use_web_app(self):
        """
        Telegram Bot API strictly rejects web_app buttons in InlineQueryResultArticle.
        Verify that handle_inline_query outputs valid URL buttons instead of WebAppInfo.
        """
        mock_user = MagicMock()
        mock_user.id = 12345
        mock_user.first_name = "SubZero"

        mock_query = MagicMock()
        mock_query.from_user = mock_user
        mock_query.query = ""
        mock_query.answer = AsyncMock()

        await bot.handle_inline_query(mock_query)

        mock_query.answer.assert_called_once()
        args, kwargs = mock_query.answer.call_args
        results = args[0]

        # There must be 2 results: 1v1 Challenge and Leaderboard
        self.assertEqual(len(results), 2)
        challenge_result = results[0]

        # Verify button is a URL button and button text is 'Play'
        btn = challenge_result.reply_markup.inline_keyboard[0][0]
        self.assertEqual(btn.text, "Play")
        self.assertIsNone(btn.web_app, "Inline query result MUST NOT have web_app attribute!")
        self.assertTrue(btn.url.startswith(f"https://t.me/{bot.BOT_USERNAME}?start=challenge_"))

    async def test_dm_challenge_provides_friend_picker_and_share_link(self):
        """
        In DM with the bot, issuing a challenge must provide friend-picker and share buttons.
        """
        mock_user = MagicMock()
        mock_user.id = 55555
        mock_user.first_name = "Scorpion"

        mock_chat = MagicMock()
        mock_chat.id = 55555
        mock_chat.type = "private"

        mock_message = MagicMock()
        mock_message.chat = mock_chat
        mock_message.from_user = mock_user
        mock_message.answer = AsyncMock()

        await bot.handle_challenge(mock_message)

        mock_message.answer.assert_called_once()
        text, kwargs = mock_message.answer.call_args
        reply_markup = kwargs["reply_markup"]

        # Row 1: Send to Friend (switch_inline_query) & Share Link (url)
        # Row 2: Play (web_app)
        row1 = reply_markup.inline_keyboard[0]
        row2 = reply_markup.inline_keyboard[1]

        self.assertEqual(row1[0].text, "⚔️ Send to a Friend")
        self.assertTrue(row1[0].switch_inline_query.startswith("challenge_"))

        self.assertEqual(row1[1].text, "📲 Share Link")
        self.assertTrue("t.me/share/url" in row1[1].url)

        self.assertEqual(row2[0].text, "Play")
        self.assertIsNotNone(row2[0].web_app)

    async def test_deep_link_start_for_creator_and_opponent(self):
        """
        Test /start challenge_<id> differentiation between creator and opponent.
        """
        match_id = "test_dl_01"
        db.create_match(match_id, "chat_group", creator_id="100", creator_name="Raiden", timeout_seconds=60)

        # 1. Test when creator opens link
        creator_user = MagicMock()
        creator_user.id = 100
        creator_user.first_name = "Raiden"
        creator_msg = MagicMock()
        creator_msg.chat = MagicMock(id=100)
        creator_msg.from_user = creator_user
        creator_msg.answer = AsyncMock()

        cmd = MagicMock()
        cmd.args = f"challenge_{match_id}"

        await bot.handle_start(creator_msg, cmd)
        text_creator = creator_msg.answer.call_args[0][0]
        self.assertIn("YOUR CHALLENGE IS LIVE", text_creator)

        # 2. Test when opponent opens link
        opp_user = MagicMock()
        opp_user.id = 200
        opp_user.first_name = "LiuKang"
        opp_msg = MagicMock()
        opp_msg.chat = MagicMock(id=200)
        opp_msg.from_user = opp_user
        opp_msg.answer = AsyncMock()

        await bot.handle_start(opp_msg, cmd)
        text_opp = opp_msg.answer.call_args[0][0]
        self.assertIn("CHALLENGE DETECTED", text_opp)
        self.assertIn("Raiden", text_opp)


if __name__ == "__main__":
    unittest.main()
