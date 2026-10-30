"""
Immortal Combat - High-Performance Dev Server & Real-time Multiplayer Gateway
Powers:
- Pure JavaScript Web Player & CheerpJ asset delivery with HTTP Range support
- Real-time WebSocket match synchronization (/ws/match/{match_id})
- Local SQLite database & group leaderboards (/api/leaderboard)
- Optional background Telegram Bot polling if TELEGRAM_BOT_TOKEN is set
"""

import asyncio
import os
import sys
import socket
import webbrowser
import logging
from aiohttp import web
from server.multiplayer import create_app

PORT = 8080


def get_local_ip() -> str:
    """Detects the LAN IP address for local network & mobile Telegram Mini App testing."""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"


def run():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)

    port = int(sys.argv[1]) if len(sys.argv) > 1 and sys.argv[1].isdigit() else PORT
    local_ip = get_local_ip()

    print("=" * 65)
    print("  IMMORTAL COMBAT — 1:1 REAL-TIME MULTIPLAYER SERVER")
    print("=" * 65)
    print(f"[*] Local Web Player       : http://localhost:{port}/player/")
    print(f"[*] Mobile Wi-Fi TMA URL   : http://{local_ip}:{port}/player/")
    print(f"[*] HTML Architecture Debrief: http://localhost:{port}/docs/multiplayer-explainer.html")
    print(f"[*] WebSocket Match Gateway: ws://localhost:{port}/ws/match/<id>")
    print(f"[*] Local Leaderboard API  : http://localhost:{port}/api/leaderboard?chat_id=0")
    print("=" * 65)

    if "--no-browser" not in sys.argv:
        try:
            webbrowser.open(f"http://localhost:{port}/player/")
        except Exception:
            pass

    app = create_app()
    web.run_app(app, host="0.0.0.0", port=port)


if __name__ == "__main__":
    run()
