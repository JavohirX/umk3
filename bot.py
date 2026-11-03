"""
Immortal Combat - Telegram Mini App Bot & Multiplayer Gateway
Powered by aiogram 3.x
Supports:
- /challenge in groups and DMs, and inline mode (@Bot) to challenge friends anywhere
- Open challenges that wait db.CHALLENGE_WINDOW_SECONDS for an opponent; the creator is pinged on accept
- One-tap entry through a Direct Link Mini App (WEBAPP_SHORT_NAME), falling back to the bot's chat
- Challenge messages that follow the match (accepted, live with a Watch button, result with a replay)
- Local group-isolated leaderboards (/leaderboard) tracking Wins, Losses, Games, and Win Rate
- In-match disconnect grace period and autowin rules
"""

import asyncio
import html
import logging
import os
import sys
import time
import uuid
from typing import Optional
from urllib.parse import urlencode

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
# Short name of the Direct Link Mini App created with @BotFather /newapp. With it, a Play button anywhere
# (groups, inline messages) opens the game in one tap; without it, groups go through the bot's chat.
WEBAPP_SHORT_NAME = os.getenv("WEBAPP_SHORT_NAME", "").strip()

CHALLENGE_WINDOW_TEXT = f"{db.CHALLENGE_WINDOW_SECONDS // 60} minutes"

logging.basicConfig(level=logging.INFO, format="%(asctime)s - [%(levelname)s] %(message)s")

dp = Dispatcher()


def esc(text) -> str:
    return html.escape(str(text or ""), quote=False)


def get_player_url(params: Optional[dict] = None) -> str:
    """The game's URL with query parameters, plus a timestamp so Telegram never serves a cached page."""
    base_url = WEBAPP_URL.rstrip('/')
    root_base = base_url.split("/player")[0] if "/player" in base_url else base_url
    query = dict(params or {})
    query["v"] = "20261103"
    query["_ts"] = int(time.time())
    return f"{root_base}/player/play.html?{urlencode(query)}"


def deep_link(param: str) -> str:
    """Opens the bot's chat with /start <param>."""
    return f"https://t.me/{BOT_USERNAME}?start={param}"


def direct_link(param: str) -> Optional[str]:
    """Opens the Mini App straight away, in the chat the link was tapped in, with start_param <param>."""
    return f"https://t.me/{BOT_USERNAME}/{WEBAPP_SHORT_NAME}?startapp={param}" if WEBAPP_SHORT_NAME else None


def game_button(text: str, start_param: str, url_params: dict, private: bool) -> InlineKeyboardButton:
    """
    A button that opens the game. web_app buttons only work in private chats, so in groups and inline
    messages it's the direct link (one tap) when configured, or a link to the bot's chat.
    """
    if private:
        return InlineKeyboardButton(text=text, web_app=WebAppInfo(url=get_player_url(url_params)))
    link = direct_link(start_param)
    return InlineKeyboardButton(text=text, url=link or deep_link(start_param))


def play_button(match_id: str, chat_id: str, private: bool, text: str = "Play") -> InlineKeyboardButton:
    return game_button(text, f"challenge_{match_id}", {"match": match_id, "chat": chat_id}, private)


def replay_button(match_id: str, private: bool) -> InlineKeyboardButton:
    return game_button("▶️ Watch replay", f"replay_{match_id}", {"replay": match_id}, private)


def share_url(match_id: str) -> str:
    return (f"https://t.me/share/url?url={deep_link(f'challenge_{match_id}')}"
            f"&text=⚔️%20I%20challenge%20you%20to%20Immortal%20Combat!%20Tap%20Play%20to%20fight%20me!")


def remember_chat(callback: types.CallbackQuery):
    """A button press under a bot message tells us which chat a chat_instance is (for inline challenge stats)."""
    try:
        if callback.message and callback.chat_instance:
            db.remember_chat_instance(callback.chat_instance, str(callback.message.chat.id))
    except Exception as e:
        logging.warning(f"Could not remember chat instance: {e}")


def format_leaderboard_text(chat_id: str, chat_title: str = "This Group") -> str:
    """Formats the local group leaderboard into an executive Telegram HTML message."""
    lb = db.get_local_leaderboard(str(chat_id), limit=10)
    if not lb:
        return (
            f"🏆 <b>LOCAL ARENA LEADERBOARD — {esc(chat_title)}</b>\n\n"
            "<i>No combat matches recorded in this arena yet!</i>\n\n"
            "⚔️ Type <code>/challenge</code> or call the bot inline to start the first battle!"
        )

    lines = [
        f"🏆 <b>LOCAL ARENA LEADERBOARD — {esc(chat_title)}</b>",
        "──────────────────────────────",
        "Rank | Fighter           | W - L | Total | Win%"
    ]

    medals = {1: "🥇", 2: "🥈", 3: "🥉"}

    for p in lb:
        prefix = medals.get(p["rank"], f"{p['rank']}.")
        name = esc(p["first_name"][:14])
        lines.append(f"{prefix} <b>{name}</b> — <b>{p['wins']}W</b> / {p['losses']}L ({p['games_played']} games, {p['win_rate']}%)")

    lines.append("──────────────────────────────")
    lines.append("<i>Leaderboard is local to this chat. Autowin awarded if opponent forfeits.</i>")
    return "\n".join(lines)


def format_user_record(user_id: str, name: str) -> str:
    stats = db.get_user_totals(user_id)
    if not stats:
        return f"🥋 <b>{esc(name)}</b> hasn't fought yet.\n\n⚔️ Send a challenge to start!"
    return (f"🥋 <b>{esc(name)}</b> — all arenas\n"
            f"<b>{stats['wins']}W</b> / {stats['losses']}L / {stats['draws']}D "
            f"({stats['games_played']} games, {stats['win_rate']}% wins)")


def challenge_text(creator_name: str, group: bool) -> str:
    if group:
        return (
            f"⚔️ <b>NEW CHALLENGE ISSUED!</b>\n\n"
            f"🥋 <b>{esc(creator_name)}</b> has placed an open challenge in this group!\n\n"
            f"⏱️ <b>Open for {CHALLENGE_WINDOW_TEXT}.</b> The first to tap Play fights; everyone after that watches.\n"
            f"⚠️ <b>Disconnect Rule:</b> Leaving during a match gives the opponent an Autowin after 60s.\n\n"
            f"Who dares to step up? Tap below to fight:"
        )
    return (
        f"⚔️ <b>CHALLENGE CREATED!</b>\n\n"
        f"Send it to a friend, or tap <b>Play</b> to wait in the arena. "
        f"It stays open for {CHALLENGE_WINDOW_TEXT}, and I'll message you when someone accepts."
    )


def challenge_keyboard(match_id: str, chat_id: str, private: bool) -> InlineKeyboardMarkup:
    if private:
        return InlineKeyboardMarkup(inline_keyboard=[
            [
                InlineKeyboardButton(text="⚔️ Send to a Friend", switch_inline_query=f"challenge_{match_id}"),
                InlineKeyboardButton(text="📲 Share Link", url=share_url(match_id)),
            ],
            [play_button(match_id, chat_id, private=True)],
        ])
    return InlineKeyboardMarkup(inline_keyboard=[
        [play_button(match_id, chat_id, private=False)],
        [InlineKeyboardButton(text="⚔️ Forward Challenge", switch_inline_query=f"challenge_{match_id}")],
    ])


async def post_challenge(target: types.Message, chat: types.Chat, user: types.User):
    """Creates an open challenge in `chat` and posts it, remembering the message so it can follow the match."""
    chat_id = str(chat.id)
    private = chat.type == "private"
    match_id = uuid.uuid4().hex[:8]
    db.create_match(match_id=match_id, chat_id=chat_id, creator_id=str(user.id),
                    creator_name=user.first_name or "Fighter")
    sent = await target.answer(challenge_text(user.first_name or "Fighter", group=not private), parse_mode="HTML",
                               reply_markup=challenge_keyboard(match_id, chat_id, private))
    try:
        db.set_challenge_message(match_id, str(sent.chat.id), int(sent.message_id))
    except (AttributeError, TypeError, ValueError):
        pass


# =========================================================================
# 1. /START COMMAND & DEEP LINK ENTRY
# =========================================================================

@dp.message(CommandStart())
async def handle_start(message: types.Message, command: CommandObject):
    """Handles /start command, including deep-linked challenges, replays and live matches."""
    args = command.args or ""
    chat_id = str(message.chat.id)
    user_id = str(message.from_user.id)

    # Deep-linked replay: /start replay_<match_id>
    if args.startswith("replay_"):
        match_id = args.split("_", 1)[1]
        kb = InlineKeyboardMarkup(inline_keyboard=[[replay_button(match_id, private=True)]])
        await message.answer(f"▶️ <b>REPLAY</b> of match <code>#{esc(match_id)}</code>. Tap below to watch:",
                             parse_mode="HTML", reply_markup=kb)
        return

    # Deep-linked challenge entry: /start challenge_<match_id>
    if args.startswith("challenge_") or args.startswith("match_"):
        match_id = args.split("_", 1)[1]
        match = db.get_match(match_id)

        if match and match.get("status") == "WAITING":
            creator_name = match["creator_name"]
            kb_play = play_button(match_id, match["chat_id"], private=True)

            if user_id == match["creator_id"]:
                kb = InlineKeyboardMarkup(inline_keyboard=[
                    [kb_play],
                    [
                        InlineKeyboardButton(text="⚔️ Send to a Friend", switch_inline_query=f"challenge_{match_id}"),
                        InlineKeyboardButton(text="📲 Share Link", url=share_url(match_id)),
                    ],
                ])
                text = (
                    f"⚔️ <b>YOUR CHALLENGE IS LIVE!</b>\n\n"
                    f"🥋 Match <code>#{esc(match_id)}</code> is waiting for an opponent.\n\n"
                    f"⏱️ <b>Open for {CHALLENGE_WINDOW_TEXT}.</b> I'll message you when someone accepts.\n"
                    f"🛡️ <b>Forfeit Rule:</b> If an opponent disconnects during battle, you win by Autowin after 1 minute.\n\n"
                    f"Tap below to enter your arena lobby or invite friends:"
                )
            else:
                kb = InlineKeyboardMarkup(inline_keyboard=[[kb_play]])
                text = (
                    f"⚔️ <b>CHALLENGE DETECTED!</b>\n\n"
                    f"🥋 <b>{esc(creator_name)}</b> has challenged you in Immortal Combat!\n\n"
                    f"⏱️ <b>Rules of Engagement:</b>\n"
                    f"• Accept now and {esc(creator_name)} gets pinged to join you.\n"
                    f"• If a player exits during match, the remaining player waits 1 minute for an <b>AUTOWIN</b>.\n"
                    f"• If both players exit, match is abandoned without a win.\n\n"
                    f"Tap below to accept and fight:"
                )
            await message.answer(text, parse_mode="HTML", reply_markup=kb)
            return

        if match and match.get("status") == "ACTIVE":
            kb = InlineKeyboardMarkup(inline_keyboard=[[play_button(match_id, match["chat_id"], private=True, text="👁 Watch live")]])
            await message.answer(
                f"⚔️ <b>{esc(match['creator_name'])}</b> vs <b>{esc(match['opponent_name'] or 'Challenger')}</b> "
                f"is being fought right now. Tap below to watch:",
                parse_mode="HTML", reply_markup=kb)
            return

        rows = []
        if match and match.get("status") == "COMPLETED" and db.get_replay(match_id):
            rows.append([replay_button(match_id, private=True)])
        rows.append([InlineKeyboardButton(text="⚔️ Issue a New Challenge", callback_data="cmd_challenge")])
        status_desc = (match.get("status") or "").lower() if match else "not found"
        await message.answer(
            f"⚠️ <b>CHALLENGE NO LONGER AVAILABLE</b>\n\nMatch <code>#{esc(match_id)}</code> is {esc(status_desc)}.\n\n"
            f"Start a new battle below:",
            parse_mode="HTML", reply_markup=InlineKeyboardMarkup(inline_keyboard=rows))
        return

    # Standard /start welcome
    rows = []
    if message.chat.type == "private":  # web_app buttons only work in private chats
        rows.append([InlineKeyboardButton(text="Play", web_app=WebAppInfo(url=get_player_url()))])
    rows.append([
        InlineKeyboardButton(text="⚔️ Issue a Challenge", callback_data="cmd_challenge"),
        InlineKeyboardButton(text="🏆 View Leaderboard", callback_data="cmd_leaderboard")
    ])
    kb = InlineKeyboardMarkup(inline_keyboard=rows)

    welcome_text = (
        "⚔️ <b>IMMORTAL COMBAT — 1:1 COMBAT ARENA</b>\n\n"
        "Enter the classic arcade battlefield directly inside Telegram!\n\n"
        "<b>Multiplayer Features:</b>\n"
        "• ⚔️ <b>1v1 Challenges:</b> Challenge friends in DMs or groups.\n"
        f"• ⏱️ <b>Open Challenges:</b> Stay open for {CHALLENGE_WINDOW_TEXT}; you're pinged when someone accepts.\n"
        "• 👁 <b>Spectators & Replays:</b> Watch live fights and replay finished ones.\n"
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
    """Creates an open challenge in the current chat."""
    await post_challenge(message, message.chat, message.from_user)


# =========================================================================
# 3. /LEADERBOARD COMMAND (LOCAL TO CURRENT CHAT)
# =========================================================================

@dp.message(Command("leaderboard"))
async def handle_leaderboard(message: types.Message):
    """Displays the isolated local leaderboard for this specific chat."""
    chat_id = str(message.chat.id)
    chat_title = message.chat.title or "This Chat"
    kb = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="⚔️ Issue a Challenge", callback_data="cmd_challenge")]
    ])
    await message.answer(format_leaderboard_text(chat_id, chat_title), parse_mode="HTML", reply_markup=kb)


@dp.callback_query(F.data == "cmd_leaderboard")
async def handle_callback_leaderboard(callback: types.CallbackQuery):
    """Callback to display leaderboard."""
    remember_chat(callback)
    chat_id = str(callback.message.chat.id)
    chat_title = callback.message.chat.title or "This Chat"
    await callback.message.answer(format_leaderboard_text(chat_id, chat_title), parse_mode="HTML")
    await callback.answer()


@dp.callback_query(F.data == "cmd_challenge")
async def handle_callback_challenge(callback: types.CallbackQuery):
    """Callback to issue challenge."""
    remember_chat(callback)
    await post_challenge(callback.message, callback.message.chat, callback.from_user)
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
        if candidate_id and db.get_match(candidate_id):
            match_id = candidate_id

    # A new challenge is only an id for now. Telegram sends a query as the user types and each time they reopen
    # inline mode, and most are never sent; the match is created once a result is actually sent
    # (handle_chosen_inline_result).
    if not match_id:
        match_id = uuid.uuid4().hex[:8]

    # web_app buttons are rejected in inline results (BUTTON_TYPE_INVALID): link to the app or the bot instead
    kb_challenge = InlineKeyboardMarkup(inline_keyboard=[[play_button(match_id, "inline", private=False)]])

    msg_challenge = (
        f"⚔️ <b>IMMORTAL COMBAT — 1v1 CHALLENGE</b>\n\n"
        f"🥋 <b>{esc(user_name)}</b> challenges you to battle!\n\n"
        f"⏱️ <b>Open for {CHALLENGE_WINDOW_TEXT}.</b> The first to tap Play fights; everyone after that watches.\n"
        f"🛡️ <b>Forfeit Rule:</b> Exiting during battle awards an Autowin to your opponent after 60s.\n\n"
        f"Tap below to step into the Arena:"
    )

    results = [
        InlineQueryResultArticle(
            id=f"challenge_{match_id}",
            title="⚔️ Challenge to Immortal Combat",
            description=f"Send a 1v1 challenge (open for {CHALLENGE_WINDOW_TEXT}, 60s forfeit autowin)",
            input_message_content=InputTextMessageContent(message_text=msg_challenge, parse_mode="HTML"),
            reply_markup=kb_challenge
        ),
        InlineQueryResultArticle(
            id=f"record_{user_id}",
            title="🏆 Share My Record",
            description="Your wins and losses across every arena",
            input_message_content=InputTextMessageContent(
                message_text=format_user_record(user_id, user_name), parse_mode="HTML")
        )
    ]

    await inline_query.answer(results, cache_time=1, is_personal=True)


@dp.chosen_inline_result()
async def handle_chosen_inline_result(chosen: types.ChosenInlineResult):
    """
    A user sent one of our inline results. Needs inline feedback on for every result (@BotFather
    /setinlinefeedback, 100%). A new challenge's match is created here, and the sent message is remembered so
    it can follow the match. A challenge forwarded from a chat ("Send to a Friend") already has its match.
    """
    if not chosen.result_id.startswith("challenge_"):
        return
    match_id = chosen.result_id.split("_", 1)[1]
    if not db.get_match(match_id):
        db.create_match(match_id=match_id, chat_id="inline", creator_id=str(chosen.from_user.id),
                        creator_name=chosen.from_user.first_name or "Fighter")
    if chosen.inline_message_id:
        db.set_inline_message(match_id, chosen.inline_message_id)


# =========================================================================
# 5. MATCH UPDATES FROM THE GAME SERVER
# =========================================================================

def result_line(info: dict) -> str:
    """'🏆 Bob beat Alice 2–1 (Scorpion vs Sub-Zero)' and friends."""
    result = info.get("result") or {}
    p1, p2 = info.get("p1") or {}, info.get("p2") or {}
    heroes = f" ({p1.get('hero')} vs {p2.get('hero')})" if p1.get("hero") and p2.get("hero") else ""
    score = f"{result.get('p1_rounds', 0)}–{result.get('p2_rounds', 0)}"
    names = {(p1.get("id")): p1.get("name"), (p2.get("id")): p2.get("name")}
    if result.get("reason") == "DRAW":
        return f"🤝 <b>{esc(p1.get('name'))}</b> and <b>{esc(p2.get('name'))}</b> fought to a draw {score}{heroes}"
    winner = esc(result.get("winner_name") or names.get(result.get("winner_id")))
    loser = esc(result.get("loser_name") or "their opponent")
    if result.get("reason") == "AUTOWIN_DISCONNECT":
        return f"🏆 <b>{winner}</b> wins by forfeit — <b>{loser}</b> didn't come back{heroes}"
    winner_score = max(result.get("p1_rounds", 0), result.get("p2_rounds", 0))
    loser_score = min(result.get("p1_rounds", 0), result.get("p2_rounds", 0))
    return f"🏆 <b>{winner}</b> beat <b>{loser}</b> {winner_score}–{loser_score}{heroes}"


async def edit_challenge_message(bot: Bot, match: dict, text: str, keyboard: Optional[InlineKeyboardMarkup]):
    """Updates the challenge message the bot posted (a chat message or an inline one), if it knows it."""
    try:
        if match.get("message_chat_id") and match.get("message_id"):
            await bot.edit_message_text(text=text, chat_id=int(match["message_chat_id"]), message_id=int(match["message_id"]),
                                        parse_mode="HTML", reply_markup=keyboard)
        elif match.get("inline_message_id"):
            await bot.edit_message_text(text=text, inline_message_id=match["inline_message_id"],
                                        parse_mode="HTML", reply_markup=keyboard)
    except Exception as e:
        logging.info(f"[{match['match_id']}] Challenge message not updated: {e}")


def is_private_chat_id(chat_id: str) -> bool:
    return chat_id.lstrip("-").isdigit() and not chat_id.startswith("-")


async def on_match_event(bot: Bot, event: str, info: dict):
    """Keeps Telegram in step with a match: pings, live status, results."""
    match = db.get_match(info["match_id"]) or {}
    match_id = info["match_id"]
    chat_id = str(info.get("chat_id") or "")
    real_chat = chat_id not in ("", "0", "inline")
    message_private = is_private_chat_id(str(match.get("message_chat_id") or "")) if match.get("message_chat_id") else False
    creator = info.get("creator") or {}
    opponent = info.get("opponent") or {}

    if event == "challenge_accepted":
        text = (f"⚔️ <b>{esc(opponent.get('name'))}</b> accepted your challenge and is waiting in the arena!\n\n"
                f"Tap below to fight.")
        kb = InlineKeyboardMarkup(inline_keyboard=[[play_button(match_id, chat_id, private=True, text="⚔️ Fight now")]])
        pinged = False
        try:
            await bot.send_message(int(creator["id"]), text, parse_mode="HTML", reply_markup=kb)
            pinged = True
        except Exception as e:
            logging.info(f"[{match_id}] Could not message the creator directly: {e}")
        if not pinged and real_chat and not is_private_chat_id(chat_id):
            mention = f'<a href="tg://user?id={esc(creator.get("id"))}">{esc(creator.get("name"))}</a>'
            group_kb = InlineKeyboardMarkup(inline_keyboard=[[play_button(match_id, chat_id, private=False, text="⚔️ Fight now")]])
            await bot.send_message(int(chat_id), f"{mention}, <b>{esc(opponent.get('name'))}</b> accepted your challenge! Tap to fight.",
                                   parse_mode="HTML", reply_markup=group_kb)
        await edit_challenge_message(
            bot, match,
            f"⚔️ <b>{esc(opponent.get('name'))}</b> accepted <b>{esc(creator.get('name'))}</b>'s challenge!\n\n"
            f"Waiting for {esc(creator.get('name'))} to enter the arena…",
            InlineKeyboardMarkup(inline_keyboard=[[play_button(match_id, chat_id, private=message_private)]]))

    elif event == "match_started":
        await edit_challenge_message(
            bot, match,
            f"⚔️ <b>{esc(creator.get('name'))}</b> vs <b>{esc(opponent.get('name'))}</b> — fight in progress!",
            InlineKeyboardMarkup(inline_keyboard=[[play_button(match_id, chat_id, private=message_private, text="👁 Watch live")]]))

    elif event == "match_ended":
        line = result_line(info)
        rows = []
        if info.get("has_replay"):
            rows.append([replay_button(match_id, private=message_private)])
        await edit_challenge_message(bot, match, line, InlineKeyboardMarkup(inline_keyboard=rows) if rows else None)
        # Results go to the chat the challenge came from, so the group sees who won
        if real_chat:
            private = is_private_chat_id(chat_id)
            buttons = [[replay_button(match_id, private=private)]] if info.get("has_replay") else []
            buttons.append([InlineKeyboardButton(text="⚔️ New Challenge", callback_data="cmd_challenge")])
            await bot.send_message(int(chat_id), line, parse_mode="HTML",
                                   reply_markup=InlineKeyboardMarkup(inline_keyboard=buttons))

    elif event == "challenge_expired":
        await edit_challenge_message(
            bot, match,
            f"⌛ <b>{esc(creator.get('name'))}</b>'s challenge expired — nobody accepted in time.",
            InlineKeyboardMarkup(inline_keyboard=[[InlineKeyboardButton(text="⚔️ New Challenge", callback_data="cmd_challenge")]])
            if not match.get("inline_message_id") else None)


# =========================================================================
# 6. BOT BOOTSTRAP & MENU BUTTON
# =========================================================================

async def main():
    if not TOKEN:
        logging.error("TELEGRAM_BOT_TOKEN is not set in environment or .env. Cannot start bot.")
        sys.exit(1)

    bot = Bot(token=TOKEN)

    # 1. Start real-time multiplayer WebSocket & API server on port 8080
    try:
        from aiohttp import web
        from server.multiplayer import create_app, coordinator
        coordinator.notifier = lambda event, info: on_match_event(bot, event, info)
        app = create_app()
        runner = web.AppRunner(app)
        await runner.setup()
        site = web.TCPSite(runner, '0.0.0.0', 8080)
        await site.start()
        logging.info("Real-time Multiplayer WebSocket & REST server started on http://0.0.0.0:8080")
    except Exception as e:
        logging.warning(f"Could not bind WebSocket server on port 8080 (may already be running): {e}")

    try:
        me = await bot.get_me()
        global BOT_USERNAME
        if me.username:
            BOT_USERNAME = me.username
        logging.info(f"Connected as Telegram Bot: @{BOT_USERNAME} ({me.first_name})")
    except Exception as e:
        logging.warning(f"Could not fetch bot identity: {e}")

    try:
        await bot.set_chat_menu_button(
            menu_button=MenuButtonWebApp(text="Play", web_app=WebAppInfo(url=get_player_url()))
        )
        logging.info("Telegram persistent Menu Button configured successfully.")
    except Exception as e:
        logging.warning(f"Failed to set menu button: {e}")

    logging.info(f"Immortal Combat Bot starting... Serving WebApp: {WEBAPP_URL}")
    await dp.start_polling(bot, allowed_updates=dp.resolve_used_update_types())


if __name__ == "__main__":
    asyncio.run(main())
