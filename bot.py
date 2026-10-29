"""
Ultimate Mortal Kombat 3 - Telegram Mini App Bot
Powered by aiogram 3.x
"""

import asyncio
import logging
import os
import sys
from dotenv import load_dotenv
from aiogram import Bot, Dispatcher, types
from aiogram.filters import CommandStart, Command
from aiogram.types import (
    InlineKeyboardMarkup,
    InlineKeyboardButton,
    WebAppInfo,
    MenuButtonWebApp
)

load_dotenv()

TOKEN = os.getenv("TELEGRAM_BOT_TOKEN") or os.getenv("TG_BOT_TOKEN")
WEBAPP_URL = os.getenv("WEBAPP_URL") or "https://javohirx.github.io/umk3/player/"

if not TOKEN:
    print("Notice: TELEGRAM_BOT_TOKEN or TG_BOT_TOKEN is not set in .env. Configure it before launching bot.py.")

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

dp = Dispatcher()


@dp.message(CommandStart())
async def handle_start(message: types.Message):
    """Handles /start command with UMK3 welcome message and play button."""
    base_url = WEBAPP_URL.rstrip('/')
    player_base = base_url if base_url.endswith("/player") else f"{base_url}/player"

    kb = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="🐉 FIGHT! (Play UMK3)",
                    web_app=WebAppInfo(url=f"{player_base}/?v=1.0.0")
                )
            ]
        ]
    )

    text = (
        "🐉 <b>Ultimate Mortal Kombat 3</b>\n\n"
        "Enter the Kombat Arena directly inside Telegram!\n"
        "Full arcade controls, sound, and classic roster.\n\n"
        "Tap below to begin:"
    )

    await message.answer(
        text,
        parse_mode="HTML",
        reply_markup=kb,
        link_preview_options=types.LinkPreviewOptions(is_disabled=True)
    )


@dp.message(Command("play"))
async def handle_play(message: types.Message):
    """Direct play command."""
    base_url = WEBAPP_URL.rstrip('/')
    player_base = base_url if base_url.endswith("/player") else f"{base_url}/player"

    kb = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="🐉 FIGHT!",
                    web_app=WebAppInfo(url=f"{player_base}/?v=1.0.0")
                )
            ]
        ]
    )
    await message.answer(
        "🐉 Tap below to enter Kombat:",
        parse_mode="HTML",
        reply_markup=kb,
        link_preview_options=types.LinkPreviewOptions(is_disabled=True)
    )


async def main():
    if not TOKEN:
        print("Error: Cannot start bot without TELEGRAM_BOT_TOKEN.")
        sys.exit(1)

    bot = Bot(token=TOKEN)

    try:
        base_url = WEBAPP_URL.rstrip('/')
        player_base = base_url if base_url.endswith("/player") else f"{base_url}/player"
        await bot.set_chat_menu_button(
            menu_button=MenuButtonWebApp(
                text="🐉 Play UMK3",
                web_app=WebAppInfo(url=f"{player_base}/?v=1.0.0")
            )
        )
        logging.info("Telegram persistent Menu Button configured successfully.")
    except Exception as e:
        logging.warning(f"Failed to set menu button: {e}")

    logging.info(f"Bot starting... Serving WebApp: {WEBAPP_URL}")
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
