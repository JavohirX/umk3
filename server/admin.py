"""
Immortal Combat - Admin panel routes

The panel holds player ids, names and devices, so nothing here answers without a token. There is no password: the bot's
/admin command gives ADMIN_ID a signed link that expires, and a leaked one stops working on its own. The token travels in
the link's #fragment, which browsers don't send anywhere, so it never reaches a server or access log; the page reads it
and sends it as a bearer token.

Reads run one at a time in a process of their own (server/admin_read.py), so the event loop stays free to relay inputs,
however much the panel is asked to add up.
"""

import asyncio
import base64
import hashlib
import hmac
import json
import logging
import os
import subprocess
import sys
import time
from typing import Dict, Optional, Tuple

from aiohttp import web

import server.admin_stats as stats
import server.db as db
from server.telemetry import telemetry

LOGIN_LINK_SECONDS = 12 * 3600
CACHE_SECONDS = 10
CACHE_READ_TIMES = 10            # a page is kept at least this many times as long as it took to read, however often the panel refreshes
READ_SECONDS = 180
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PANEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "admin_panel.html")
READS = web.AppKey("admin_reads", asyncio.Lock)
# Everything the page loads is its own, except its typeface. If a player's name ever got past the page's escaping, a
# script still couldn't send the token anywhere.
PANEL_HEADERS = {
    "Cache-Control": "no-store",
    "Referrer-Policy": "no-referrer",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Content-Security-Policy": ("default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline' https://fonts.googleapis.com; "
                                "font-src https://fonts.gstatic.com; connect-src 'self'; img-src data:; base-uri 'none'; form-action 'none'; "
                                "frame-ancestors 'none'"),
}


# =========================================================================
# THE LOGIN LINK
# =========================================================================

def signing_key() -> Optional[bytes]:
    """From the bot token in production; ADMIN_PANEL_SECRET lets a local server without a bot have a panel too."""
    secret = os.getenv("ADMIN_PANEL_SECRET", "").strip()
    if secret:
        return hashlib.sha256(b"umk3-admin:" + secret.encode()).digest()
    token = os.getenv("TELEGRAM_BOT_TOKEN") or os.getenv("TG_BOT_TOKEN")
    return hashlib.sha256(b"umk3-admin:" + token.encode()).digest() if token else None


def make_token(now: Optional[float] = None, lifetime: int = LOGIN_LINK_SECONDS) -> Optional[str]:
    key = signing_key()
    if key is None:
        return None
    expiry = str(int((time.time() if now is None else now) + lifetime))
    signature = hmac.new(key, expiry.encode(), hashlib.sha256).digest()
    return f"{expiry}.{base64.urlsafe_b64encode(signature).decode().rstrip('=')}"


def token_valid(token: Optional[str], now: Optional[float] = None) -> bool:
    key = signing_key()
    if key is None or not token or "." not in token:
        return False
    expiry, signature = token.split(".", 1)
    try:
        expected = base64.urlsafe_b64encode(hmac.new(key, expiry.encode(), hashlib.sha256).digest()).decode().rstrip("=")
        if not hmac.compare_digest(expected, signature):
            return False
        return int(expiry) > (time.time() if now is None else now)
    except (ValueError, TypeError):
        return False


def login_url(base_url: str) -> Optional[str]:
    token = make_token()
    return f"{base_url.rstrip('/')}/admin/#key={token}" if token else None


def admin_id() -> Optional[str]:
    return (os.getenv("ADMIN_ID") or "").strip() or None


# =========================================================================
# READING
# =========================================================================

def scope_from(request: web.Request) -> stats.Scope:
    def number(name: str, default: int, low: int, high: int) -> int:
        try:
            return max(low, min(high, int(request.query.get(name, default))))
        except ValueError:
            return default
    return stats.Scope(days=number("days", 7, 0, 3650), include_admin=request.query.get("include_admin") == "1", admin_id=admin_id(),
                       tz_minutes=number("tz", 0, -840, 840))


def scope_fields(scope: stats.Scope) -> dict:
    return {"days": scope.days, "include_admin": scope.include_admin, "admin_id": scope.admin_id, "tz_minutes": scope.tz_minutes}


def run_read(what: dict) -> bytes:
    done = subprocess.run([sys.executable, "-m", "server.admin_read"], input=json.dumps({**what, "db_path": db.DB_PATH}).encode(),
                          capture_output=True, timeout=READ_SECONDS, cwd=ROOT, check=True)
    return done.stdout


async def read_elsewhere(what: dict) -> bytes:
    try:
        return await asyncio.to_thread(run_read, what)
    except (subprocess.SubprocessError, OSError) as e:
        lines = (getattr(e, "stderr", None) or b"").decode(errors="replace").strip().splitlines()
        reason = f"it took over {READ_SECONDS} seconds" if isinstance(e, subprocess.TimeoutExpired) else lines[-1] if lines else str(e)
        logging.warning(f"Admin panel: {what['kind']} read failed: {reason}")
        raise web.HTTPInternalServerError(text=json.dumps({"status": "error", "message": f"The panel couldn't read the log: {reason}"}),
                                          content_type="application/json")


def authorized(request: web.Request) -> bool:
    header = request.headers.get("Authorization", "")
    return header.startswith("Bearer ") and token_valid(header[7:].strip())


def refuse() -> web.Response:
    return web.json_response({"status": "error", "message": "This link has expired. Send /admin to the bot for a new one."}, status=401,
                             headers={"Cache-Control": "no-store"})


_cache: Dict[Tuple, Tuple[float, bytes]] = {}  # key -> (good until, the page)


def remember(key: Tuple, body: bytes, read_secs: float):
    # A handful of ranges and tabs; old entries are dropped rather than managed
    if len(_cache) > 200:
        _cache.clear()
    _cache[key] = (time.monotonic() + max(CACHE_SECONDS, read_secs * CACHE_READ_TIMES), body)


def cached(key: Tuple) -> Optional[bytes]:
    entry = _cache.get(key)
    return entry[1] if entry and time.monotonic() < entry[0] else None


def json_body(body: bytes) -> web.Response:
    return web.Response(body=body, content_type="application/json", charset="utf-8", headers={"Cache-Control": "no-store"})


async def api_tab(request: web.Request) -> web.Response:
    if not authorized(request):
        return refuse()
    tab = request.match_info["tab"]
    if tab not in stats.TABS:
        return web.json_response({"status": "error", "message": "No such page."}, status=404)
    scope = scope_from(request)
    query = request.query.get("q", "")
    only = request.query.get("only", "")
    try:
        offset = max(0, int(request.query.get("offset", 0)))
    except ValueError:
        offset = 0
    key = (tab, scope.days, scope.include_admin, scope.tz_minutes, query, only, offset)
    fresh = request.query.get("fresh") == "1"
    body = None if fresh else cached(key)
    if body is None:
        async with request.app[READS]:
            # Another request may have read this very page while this one waited its turn
            body = None if fresh else cached(key)
            if body is None:
                started = time.monotonic()
                body = await read_elsewhere({"kind": "tab", "tab": tab, "scope": scope_fields(scope), "query": query, "only": only, "offset": offset,
                                             "writer_health": telemetry.health() if tab == "quality" else None})
                remember(key, body, time.monotonic() - started)
    return json_body(body)


async def api_fight(request: web.Request) -> web.Response:
    if not authorized(request):
        return refuse()
    async with request.app[READS]:
        body = await read_elsewhere({"kind": "fight", "match_id": request.match_info["match_id"]})
    if body == b"null":
        return web.json_response({"status": "error", "message": "No such fight."}, status=404)
    return json_body(body)


async def api_live(request: web.Request) -> web.Response:
    """What's happening this second, straight from the server's memory rather than the log."""
    if not authorized(request):
        return refuse()
    from server.multiplayer import build_version, coordinator
    now = time.time()
    fights = []
    for room in coordinator.rooms.values():
        if room.status == "ACTIVE" and room.sockets:
            fights.append({
                "match_id": room.match_id, "phase": "Fighting" if room.fight_running() else "Hero select",
                "p1": room.p1_name or room.creator_name, "p2": room.p2_name or room.opponent_name,
                "heroes": " vs ".join(db.HERO_NAMES[h] if h is not None else "?" for h in (room.p1_hero, room.p2_hero)) if room.fight_running() else None,
                "score": f"{room.p1_rounds} to {room.p2_rounds}", "secs": now - (room.fight_started_at or room.created_at),
                "connected": len(room.sockets), "away": len(room.away), "restarts": room.segment, "spectators": len(room.spectators),
            })
    fights.sort(key=lambda f: -f["secs"])
    return web.json_response({
        "status": "ok", "now": now, "build": build_version(), "uptime_secs": now - telemetry.started_at, **coordinator.live_counts(),
        "waiting": sum(1 for r in coordinator.rooms.values() if r.status == "WAITING"), "fights": fights,
        "logging": telemetry.health(),
    }, headers={"Cache-Control": "no-store"})


async def api_export(request: web.Request) -> web.Response:
    """The raw log as CSV, for the analysis this panel doesn't do."""
    if not authorized(request):
        return refuse()
    name = request.match_info["name"]
    if name not in stats.EXPORTS:
        return web.json_response({"status": "error", "message": "No such export."}, status=404)
    async with request.app[READS]:
        body = await read_elsewhere({"kind": "export", "name": name, "scope": scope_fields(scope_from(request))})
    return web.Response(body=body, content_type="text/csv", charset="utf-8", headers={
        "Content-Disposition": f'attachment; filename="immortal_combat_{name}.csv"', "Cache-Control": "no-store"})


async def serve_panel(request: web.Request) -> web.Response:
    return web.FileResponse(PANEL_PATH, headers=PANEL_HEADERS)


async def redirect_to_panel(request: web.Request) -> web.Response:
    raise web.HTTPFound("/admin/")


def add_routes(app: web.Application):
    app[READS] = asyncio.Lock()
    app.router.add_get("/admin", redirect_to_panel)
    app.router.add_get("/admin/", serve_panel)
    app.router.add_get("/api/admin/tab/{tab}", api_tab)
    app.router.add_get("/api/admin/fight/{match_id}", api_fight)
    app.router.add_get("/api/admin/live", api_live)
    app.router.add_get("/api/admin/export/{name}", api_export)
