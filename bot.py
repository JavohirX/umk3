"""
Immortal Combat - Telegram Mini App Bot & Multiplayer Gateway
Powered by aiogram 3.x
Supports:
- Inline queries (@Bot) to challenge friends in DM or send battle challenges to groups
- Dynamic match session tokens with 60-second join expiration
- Deep-linked match entry via Telegram Mini App (TMA)
- Local group-isolated leaderboards (/leaderboard) tracking Wins, Losses, Games, and Win Rate
- In-match disconnect grace period and autowin rules
"""

import asyncio
import logging
import os
import sys
import uuid
from dotenv import load_dotenv
from aiogram import Bot, Dispatcher, types, F
from aiogram.filters import CommandStart, Command, CommandObject
from aiogram.types import (
    InlineKeyboardMarkup,
    InlineKeyboardButton,
    InlineQuery,
    InlineQueryResultArticle,
    InputTextMessageContent,
    WebAppInfo,
    MenuButtonWebApp
)

import server.db as db

load_dotenv()

TOKEN = os.getenv("TELEGRAM_BOT_TOKEN") or os.getenv("TG_BOT_TOKEN")
WEBAPP_URL = os.getenv("WEBAPP_URL") or "https://javohirx.github.io/umk3/player/"
BOT_USERNAME = os.getenv("BOT_USERNAME") or "ImmortalCombatBot"

logging.basicConfig(level=logging.INFO, format="%(asctime)s - [%(levelname)s] %(message)s")

dp = Dispatcher()


def get_player_url(params: str = "") -> str:
    """Builds clean Telegram WebApp URL for player entry."""
    base_url = WEBAPP_URL.rstrip('/')
    player_base = base_url if base_url.endswith("/player") else f"{base_url}/player"
    if params:
        delim = "&" if "?" in player_base else "?"
        return f"{player_base}/{delim}{params.lstrip('?')}"
    return f"{player_base}/"


def format_leaderboard_text(chat_id: str, chat_title: str = "This Group") -> str:
    """Formats the local group leaderboard into an executive Telegram HTML message."""
    lb = db.get_local_leaderboard(str(chat_id), limit=10)
    if not lb:
        return (
            f"🏆 <b>LOCAL ARENA LEADERBOARD — {chat_title}</b>\n\n"
            "<i>No combat matches recorded in this arena yet!</i>\n\n"
            "⚔️ Type <code>/challenge</code> or call the bot inline to start the first battle!"
        )

    lines = [
        f"🏆 <b>LOCAL ARENA LEADERBOARD — {chat_title}</b>",
        "──────────────────────────────",
        "Rank | Fighter           | W - L | Total | Win%"
    ]

    medals = {1: "🥇", 2: "🥈", 3: "🥉"}

    for p in lb:
        rank = p["rank"]
        prefix = medals.get(rank, f"{rank}.")
        name = p["first_name"][:14]
        wins = p["wins"]
        losses = p["losses"]
        gp = p["games_played"]
        wr = p["win_rate"]

        lines.append(f"{prefix} <b>{name}</b> — <b>{wins}W</b> / {losses}L ({gp} games, {wr}%)")

    lines.append("──────────────────────────────")
    lines.append("<i>Leaderboard is local to this chat. Autowin awarded if opponent forfeits.</i>")
    return "\n".join(lines)


# =========================================================================
# 1. /START COMMAND & DEEP LINK ENTRY
# =========================================================================

@dp.message(CommandStart())
async def handle_start(message: types.Message, command: CommandObject):
    """Handles /start command, including deep-linked challenge acceptance."""
    args = command.args or ""
    chat_id = str(message.chat.id)
    user_id = str(message.from_user.id)
    user_name = message.from_user.first_name or "Fighter"

    # Deep-linked challenge entry: /start challenge_<match_id>
    if args.startswith("challenge_") or args.startswith("match_"):
        match_id = args.split("_", 1)[1]
        match = db.get_match(match_id)

        if match and match.get("status") == "WAITING":
            creator_name = match["creator_name"]
            creator_id = match["creator_id"]
            play_url = get_player_url(f"match={match_id}&chat={match['chat_id']}&user={user_id}&name={user_name}")

            if user_id == creator_id:
                # Creator re-opening their own challenge link
                share_url = f"https://t.me/share/url?url=https://t.me/{BOT_USERNAME}?start=challenge_{match_id}&text=⚔️%20I%20challenge%20you%20to%20Immortal%20Combat!%20Tap%20Play%20to%20fight%20me!"
                kb = InlineKeyboardMarkup(
                    inline_keyboard=[
                        [
                            InlineKeyboardButton(
                                text="Play",
                                web_app=WebAppInfo(url=play_url)
                            )
                        ],
                        [
                            InlineKeyboardButton(
                                text="⚔️ Send to a Friend",
                                switch_inline_query=f"challenge_{match_id}"
                            ),
                            InlineKeyboardButton(
                                text="📲 Share Link",
                                url=share_url
                            )
                        ]
                    ]
                )
                text = (
                    f"⚔️ <b>YOUR CHALLENGE IS LIVE!</b>\n\n"
                    f"🥋 Match <code>#{match_id}</code> is waiting for an opponent.\n\n"
                    f"⏱️ <b>Join Window:</b> Opponents have 60 seconds to join.\n"
                    f"🛡️ <b>Forfeit Rule:</b> If an opponent disconnects during battle, you win by Autowin after 1 minute.\n\n"
                    f"Tap below to enter your arena lobby or invite friends:"
                )
            else:
                # Opponent accepting challenge
                kb = InlineKeyboardMarkup(
                    inline_keyboard=[
                        [
                            InlineKeyboardButton(
                                text="Play",
                                web_app=WebAppInfo(url=play_url)
                            )
                        ]
                    ]
                )
                text = (
                    f"⚔️ <b>CHALLENGE DETECTED!</b>\n\n"
                    f"🥋 <b>{creator_name}</b> has challenged you in Immortal Combat!\n\n"
                    f"⏱️ <b>Rules of Engagement:</b>\n"
                    f"• 1-minute lobby countdown: If neither joins, match cancels.\n"
                    f"• If a player exits during match, the remaining player waits 1 minute for an <b>AUTOWIN</b>.\n"
                    f"• If both players exit, match is abandoned without a win.\n\n"
                    f"Tap below to accept and fight:"
                )

            await message.answer(text, parse_mode="HTML", reply_markup=kb)
            return

        elif match and match.get("status") in ("ACTIVE", "COMPLETED", "CANCELLED", "ABANDONED"):
            status_desc = match.get("status").lower()
            reason_desc = match.get("finish_reason") or "expired"
            kb = InlineKeyboardMarkup(
                inline_keyboard=[
                    [
                        InlineKeyboardButton(
                            text="⚔️ Issue a New Challenge",
                            callback_data="cmd_challenge"
                        )
                    ],
                    [
                        InlineKeyboardButton(
                            text="Play",
                            web_app=WebAppInfo(url=get_player_url(f"user={user_id}&name={user_name}&chat={chat_id}"))
                        )
                    ]
                ]
            )
            text = (
                f"⚠️ <b>CHALLENGE NO LONGER AVAILABLE</b>\n\n"
                f"Match <code>#{match_id}</code> is already <b>{status_desc}</b> ({reason_desc}).\n\n"
                f"Start a new battle below:"
            )
            await message.answer(text, parse_mode="HTML", reply_markup=kb)
            return
        else:
            # Match not found in DB - create on the fly
            db.create_match(
                match_id=match_id,
                chat_id="inline",
                creator_id="unknown",
                creator_name="Challenger",
                timeout_seconds=60
            )
            play_url = get_player_url(f"match={match_id}&chat=inline&user={user_id}&name={user_name}")
            kb = InlineKeyboardMarkup(
                inline_keyboard=[
                    [
                        InlineKeyboardButton(
                            text="Play",
                            web_app=WebAppInfo(url=play_url)
                        )
                    ]
                ]
            )
            text = (
                f"⚔️ <b>CHALLENGE DETECTED!</b>\n\n"
                f"🥋 Match <code>#{match_id}</code> is ready.\n\n"
                f"⏱️ <b>Rules of Engagement:</b>\n"
                f"• 1-minute lobby countdown: If nobody joins, match cancels.\n"
                f"• Disconnect during battle grants an <b>AUTOWIN</b> after 60s.\n\n"
                f"Tap below to enter and fight:"
            )
            await message.answer(text, parse_mode="HTML", reply_markup=kb)
            return

    # Standard /start welcome
    play_url = get_player_url(f"user={user_id}&name={user_name}&chat={chat_id}")
    kb = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="Play",
                    web_app=WebAppInfo(url=play_url)
                )
            ],
            [
                InlineKeyboardButton(
                    text="⚔️ Issue a Challenge",
                    callback_data="cmd_challenge"
                ),
                InlineKeyboardButton(
                    text="🏆 View Leaderboard",
                    callback_data="cmd_leaderboard"
                )
            ]
        ]
    )

    welcome_text = (
        "⚔️ <b>IMMORTAL COMBAT — 1:1 COMBAT ARENA</b>\n\n"
        "Enter the classic arcade battlefield directly inside Telegram!\n\n"
        "<b>Multiplayer Features:</b>\n"
        "• ⚔️ <b>1v1 Challenges:</b> Challenge friends in DMs or groups.\n"
        "• ⏱️ <b>1-Minute Lobby Timer:</b> Opponents have 60 seconds to join.\n"
        "• 🛡️ <b>Forfeit Autowin:</b> If an opponent disconnects and doesn't return in 1 minute, you win automatically!\n"
        "• 🏆 <b>Local Leaderboard:</b> Track wins, losses, and battle history per group.\n\n"
        "Tap below to start fighting:"
    )

    await message.answer(
        welcome_text,
        parse_mode="HTML",
        reply_markup=kb,
        link_preview_options=types.LinkPreviewOptions(is_disabled=True)
    )


# =========================================================================
# 2. /CHALLENGE COMMAND (FOR GROUPS & DMS)
# =========================================================================

@dp.message(Command("challenge"))
async def handle_challenge(message: types.Message):
    """Creates an instant challenge in the current chat."""
    chat_id = str(message.chat.id)
    user_id = str(message.from_user.id)
    user_name = message.from_user.first_name or "Fighter"
    match_id = str(uuid.uuid4())[:8]

    # Create match in local database
    db.create_match(
        match_id=match_id,
        chat_id=chat_id,
        creator_id=user_id,
        creator_name=user_name,
        timeout_seconds=60
    )

    play_url = get_player_url(f"match={match_id}&chat={chat_id}&user={user_id}&name={user_name}")
    share_url = f"https://t.me/share/url?url=https://t.me/{BOT_USERNAME}?start=challenge_{match_id}&text=⚔️%20I%20challenge%20you%20to%20Immortal%20Combat!%20Tap%20Play%20to%20fight%20me!"

    if message.chat.type == "private":
        kb = InlineKeyboardMarkup(
            inline_keyboard=[
                [
                    InlineKeyboardButton(
                        text="⚔️ Send to a Friend",
                        switch_inline_query=f"challenge_{match_id}"
                    ),
                    InlineKeyboardButton(
                        text="📲 Share Link",
                        url=share_url
                    )
                ],
                [
                    InlineKeyboardButton(
                        text="Play",
                        web_app=WebAppInfo(url=play_url)
                    )
                ]
            ]
        )
        text = (
            f"⚔️ <b>CHALLENGE CREATED!</b>\n\n"
            f"🥋 Match <code>#{match_id}</code> has been prepared.\n\n"
            f"Send this challenge to a friend in any chat, or tap <b>Play</b> to enter the lobby and wait for your opponent (60s timer):"
        )
    else:
        kb = InlineKeyboardMarkup(
            inline_keyboard=[
                [
                    InlineKeyboardButton(
                        text="Play",
                        web_app=WebAppInfo(url=play_url)
                    )
                ],
                [
                    InlineKeyboardButton(
                        text="⚔️ Forward Challenge",
                        switch_inline_query=f"challenge_{match_id}"
                    )
                ]
            ]
        )
        text = (
            f"⚔️ <b>NEW CHALLENGE ISSUED!</b>\n\n"
            f"🥋 <b>{user_name}</b> has placed an open challenge in this group!\n\n"
            f"⏱️ <b>Timer:</b> 1 minute to accept before cancellation.\n"
            f"⚠️ <b>Disconnect Rule:</b> Exiting during match grants an Autowin to the opponent after 60s.\n\n"
            f"Who dares to step up? Tap below to fight:"
        )

    await message.answer(text, parse_mode="HTML", reply_markup=kb)


# =========================================================================
# 3. /LEADERBOARD COMMAND (LOCAL TO CURRENT CHAT)
# =========================================================================

@dp.message(Command("leaderboard"))
async def handle_leaderboard(message: types.Message):
    """Displays the isolated local leaderboard for this specific chat."""
    chat_id = str(message.chat.id)
    chat_title = message.chat.title or "This Chat"
    text = format_leaderboard_text(chat_id, chat_title)

    kb = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="⚔️ Issue a Challenge",
                    callback_data="cmd_challenge"
                )
            ]
        ]
    )

    await message.answer(text, parse_mode="HTML", reply_markup=kb)


@dp.callback_query(F.data == "cmd_leaderboard")
async def handle_callback_leaderboard(callback: types.CallbackQuery):
    """Callback to display leaderboard."""
    chat_id = str(callback.message.chat.id)
    chat_title = callback.message.chat.title or "This Chat"
    text = format_leaderboard_text(chat_id, chat_title)
    await callback.message.edit_text(text, parse_mode="HTML")
    await callback.answer()


@dp.callback_query(F.data == "cmd_challenge")
async def handle_callback_challenge(callback: types.CallbackQuery):
    """Callback to issue challenge."""
    chat_id = str(callback.message.chat.id)
    user_id = str(callback.from_user.id)
    user_name = callback.from_user.first_name or "Fighter"
    match_id = str(uuid.uuid4())[:8]

    db.create_match(match_id, chat_id, user_id, user_name, timeout_seconds=60)
    play_url = get_player_url(f"match={match_id}&chat={chat_id}&user={user_id}&name={user_name}")
    share_url = f"https://t.me/share/url?url=https://t.me/{BOT_USERNAME}?start=challenge_{match_id}&text=⚔️%20I%20challenge%20you%20to%20Immortal%20Combat!%20Tap%20Play%20to%20fight%20me!"

    if callback.message.chat.type == "private":
        kb = InlineKeyboardMarkup(
            inline_keyboard=[
                [
                    InlineKeyboardButton(
                        text="⚔️ Send to a Friend",
                        switch_inline_query=f"challenge_{match_id}"
                    ),
                    InlineKeyboardButton(
                        text="📲 Share Link",
                        url=share_url
                    )
                ],
                [
                    InlineKeyboardButton(
                        text="Play",
                        web_app=WebAppInfo(url=play_url)
                    )
                ]
            ]
        )
        text = (
            f"⚔️ <b>CHALLENGE CREATED!</b>\n\n"
            f"🥋 Match <code>#{match_id}</code> is ready.\n\n"
            f"Send this challenge to a friend or tap <b>Play</b> to enter the lobby:"
        )
    else:
        kb = InlineKeyboardMarkup(
            inline_keyboard=[
                [
                    InlineKeyboardButton(
                        text="Play",
                        web_app=WebAppInfo(url=play_url)
                    )
                ],
                [
                    InlineKeyboardButton(
                        text="⚔️ Forward Challenge",
                        switch_inline_query=f"challenge_{match_id}"
                    )
                ]
            ]
        )
        text = (
            f"⚔️ <b>{user_name}</b> has issued a new challenge!\n\n"
            f"⏱️ 60s join timer. Disconnect grants Autowin after 60s.\n"
            f"Tap below to fight:"
        )

    await callback.message.answer(text, parse_mode="HTML", reply_markup=kb)
    await callback.answer()


# =========================================================================
# 4. INLINE QUERY HANDLER (@Bot IN DMS OR GROUPS)
# =========================================================================

@dp.inline_query()
async def handle_inline_query(inline_query: InlineQuery):
    """
    Handles inline bot invocation.
    Users can call @Bot to challenge a friend in DM or send a challenge card to a group.
    """
    user_id = str(inline_query.from_user.id)
    user_name = inline_query.from_user.first_name or "Fighter"
    query_text = inline_query.query.strip()

    # If query contains an existing match id (e.g. challenge_1a2b3c4d), reuse it
    match_id = None
    if query_text.startswith("challenge_") or query_text.startswith("match_"):
        candidate_id = query_text.split("_", 1)[1].strip()
        if candidate_id:
            existing = db.get_match(candidate_id)
            if existing:
                match_id = candidate_id

    if not match_id:
        match_id = str(uuid.uuid4())[:8]
        db.create_match(
            match_id=match_id,
            chat_id="inline",
            creator_id=user_id,
            creator_name=user_name,
            timeout_seconds=60
        )

    # CRITICAL: InlineKeyboardMarkup inside InlineQueryResultArticle CANNOT have web_app buttons!
    # Telegram Bot API throws BUTTON_TYPE_INVALID.
    # It must be a standard deep link URL button pointing to the bot.
    challenge_deep_link = f"https://t.me/{BOT_USERNAME}?start=challenge_{match_id}"

    kb_challenge = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="Play",
                    url=challenge_deep_link
                )
            ]
        ]
    )

    msg_challenge = (
        f"⚔️ <b>IMMORTAL COMBAT — 1v1 CHALLENGE</b>\n\n"
        f"🥋 <b>{user_name}</b> challenges you to battle!\n\n"
        f"⏱️ <b>Join Window:</b> 1 minute to accept before the challenge cancels.\n"
        f"🛡️ <b>Forfeit Rule:</b> Exiting during battle awards an Autowin to your opponent after 60s.\n\n"
        f"Tap below to step into the Arena:"
    )

    results = [
        # Option 1: 1v1 Challenge
        InlineQueryResultArticle(
            id=f"challenge_{match_id}",
            title="⚔️ Challenge to Immortal Combat",
            description="Send a 1v1 challenge (60s to accept, 60s forfeit autowin)",
            input_message_content=InputTextMessageContent(
                message_text=msg_challenge,
                parse_mode="HTML"
            ),
            reply_markup=kb_challenge
        ),
        # Option 2: Group Arena Leaderboard
        InlineQueryResultArticle(
            id=f"lb_{user_id}",
            title="🏆 View Arena Local Leaderboard",
            description="View local win/loss records and fighter statistics",
            input_message_content=InputTextMessageContent(
                message_text=format_leaderboard_text("inline", "Arena"),
                parse_mode="HTML"
            )
        )
    ]

    await inline_query.answer(results, cache_time=1, is_personal=True)


# =========================================================================
# 5. BOT BOOTSTRAP & MENU BUTTON
# =========================================================================

async def main():
    if not TOKEN:
        logging.error("TELEGRAM_BOT_TOKEN is not set in environment or .env. Cannot start bot.")
        sys.exit(1)

    # 1. Start real-time multiplayer WebSocket & API server on port 8080
    try:
        from aiohttp import web
        from server.multiplayer import create_app
        app = create_app()
        runner = web.AppRunner(app)
        await runner.setup()
        site = web.TCPSite(runner, '0.0.0.0', 8080)
        await site.start()
        logging.info("Real-time Multiplayer WebSocket & REST server started on http://0.0.0.0:8080")
    except Exception as e:
        logging.warning(f"Could not bind WebSocket server on port 8080 (may already be running): {e}")

    # 2. Initialize Telegram Bot
    bot = Bot(token=TOKEN)

    try:
        me = await bot.get_me()
        global BOT_USERNAME
        if me.username:
            BOT_USERNAME = me.username
        logging.info(f"Connected as Telegram Bot: @{BOT_USERNAME} ({me.first_name})")
    except Exception as e:
        logging.warning(f"Could not fetch bot identity: {e}")

    try:
        play_url = get_player_url()
        await bot.set_chat_menu_button(
            menu_button=MenuButtonWebApp(
                text="Play",
                web_app=WebAppInfo(url=play_url)
            )
        )
        logging.info("Telegram persistent Menu Button configured successfully.")
    except Exception as e:
        logging.warning(f"Failed to set menu button: {e}")

    logging.info(f"Immortal Combat Bot starting... Serving WebApp: {WEBAPP_URL}")
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
