"""
Immortal Combat - Real-time WebSocket Matchmaker & Game Coordinator
Handles active match lobbies, 60-second join timeouts, 60-second disconnect grace periods,
input relay, autowins, and local group leaderboard APIs.
"""

import asyncio
import json
import logging
import os
import time
import uuid
from typing import Dict, Optional, Set
from aiohttp import web, WSMsgType
import server.db as db

logging.basicConfig(level=logging.INFO, format="%(asctime)s - [%(levelname)s] %(message)s")


class MatchRoom:
    def __init__(self, match_id: str, chat_id: str, creator_id: str, creator_name: str, opponent_id: Optional[str] = None, opponent_name: Optional[str] = None):
        self.match_id = match_id
        self.chat_id = str(chat_id)
        self.creator_id = str(creator_id)
        self.creator_name = creator_name
        self.opponent_id = str(opponent_id) if opponent_id else None
        self.opponent_name = opponent_name
        self.status = "WAITING"  # WAITING, ACTIVE, COMPLETED, CANCELLED, ABANDONED
        self.created_at = time.time()
        self.expires_at = self.created_at + 60.0  # 1 minute to join

        # Active WebSockets: player_id -> WebSocketResponse
        self.sockets: Dict[str, web.WebSocketResponse] = {}
        self.player_names: Dict[str, str] = {self.creator_id: creator_name}
        if self.opponent_id and self.opponent_name:
            self.player_names[self.opponent_id] = self.opponent_name

        self.disconnect_tasks: Dict[str, asyncio.Task] = {}
        self.join_timeout_task: Optional[asyncio.Task] = None
        self.ready_players: Set[str] = set()

    def is_expired(self) -> bool:
        return self.status == "WAITING" and time.time() > self.expires_at

    async def broadcast(self, message: dict, exclude_id: Optional[str] = None):
        """Sends a JSON message to all connected players in the room."""
        payload = json.dumps(message)
        for pid, ws in list(self.sockets.items()):
            if pid != exclude_id and not ws.closed:
                try:
                    await ws.send_str(payload)
                except Exception as e:
                    logging.warning(f"[{self.match_id}] Broadcast error to {pid}: {e}")

    async def send_to(self, player_id: str, message: dict):
        """Sends a JSON message to a specific player."""
        ws = self.sockets.get(player_id)
        if ws and not ws.closed:
            try:
                await ws.send_str(json.dumps(message))
            except Exception as e:
                logging.warning(f"[{self.match_id}] Send error to {player_id}: {e}")


class MatchCoordinator:
    """Singleton coordinator managing all active match rooms and lifecycles."""

    def __init__(self):
        self.rooms: Dict[str, MatchRoom] = {}

    def get_or_create_room(self, match_id: str, chat_id: str = "0", creator_id: str = "0", creator_name: str = "Player 1", opponent_id: Optional[str] = None, opponent_name: Optional[str] = None) -> MatchRoom:
        if match_id in self.rooms:
            return self.rooms[match_id]

        # Check DB first
        match_data = db.get_match(match_id)
        if match_data:
            room = MatchRoom(
                match_id=match_id,
                chat_id=match_data["chat_id"],
                creator_id=match_data["creator_id"],
                creator_name=match_data["creator_name"],
                opponent_id=match_data["opponent_id"],
                opponent_name=match_data["opponent_name"]
            )
            room.status = match_data["status"]
            room.created_at = match_data["created_at"]
            room.expires_at = match_data["expires_at"]
        else:
            # Create in DB
            db.create_match(match_id, chat_id, creator_id, creator_name, opponent_id, opponent_name, timeout_seconds=60)
            room = MatchRoom(match_id, chat_id, creator_id, creator_name, opponent_id, opponent_name)

        self.rooms[match_id] = room

        # Schedule 60-second lobby expiration check
        if room.status == "WAITING":
            room.join_timeout_task = asyncio.create_task(self._watch_join_timeout(room))

        return room

    async def _watch_join_timeout(self, room: MatchRoom):
        """Waits up to 60 seconds for an opponent to join. If none joins, cancels match."""
        delay = max(0.5, room.expires_at - time.time())
        try:
            await asyncio.sleep(delay)
            if room.status == "WAITING":
                logging.info(f"[{room.match_id}] Match timed out. Opponent did not join within 60s.")
                room.status = "CANCELLED"
                db.cancel_match(room.match_id, reason="JOIN_TIMEOUT")
                await room.broadcast({
                    "type": "match_cancelled",
                    "reason": "JOIN_TIMEOUT",
                    "message": "Opponent did not join within 1 minute. Match cancelled."
                })
        except asyncio.CancelledError:
            pass

    async def handle_player_disconnect(self, room: MatchRoom, player_id: str):
        """
        Handles disconnection of a player during an active match.
        Rules:
        - If match is WAITING: player left lobby.
        - If match is ACTIVE: start 60-second reconnect grace period.
        - If other player also disconnects while waiting: both exited -> ABANDONED, no win.
        - If 60 seconds expire without reconnect: remaining player gets AUTOWIN!
        """
        if player_id in room.sockets:
            del room.sockets[player_id]

        logging.info(f"[{room.match_id}] Player {player_id} disconnected. Status: {room.status}. Active sockets: {len(room.sockets)}")

        if room.status == "WAITING":
            # If creator left lobby before opponent joined
            if len(room.sockets) == 0:
                if room.join_timeout_task:
                    room.join_timeout_task.cancel()
                room.status = "CANCELLED"
                db.cancel_match(room.match_id, reason="CREATOR_LEFT")
            return

        if room.status == "ACTIVE":
            remaining_players = list(room.sockets.keys())

            if len(remaining_players) == 0:
                # BOTH PLAYERS EXITED: no win for anyone
                logging.info(f"[{room.match_id}] Both players exited. Cancelling autowin, match marked ABANDONED.")
                # Cancel any pending autowin task
                for pid, task in list(room.disconnect_tasks.items()):
                    task.cancel()
                room.disconnect_tasks.clear()
                room.status = "ABANDONED"
                db.finish_match(room.match_id, winner_id=None, finish_reason="BOTH_DISCONNECTED")
                return

            # Exactly one player remains. Start 60-second grace timer for disconnected player.
            remaining_id = remaining_players[0]
            remaining_name = room.player_names.get(remaining_id, "Player")
            disconnected_name = room.player_names.get(player_id, "Opponent")

            logging.info(f"[{room.match_id}] Starting 60s forfeit countdown against {player_id}. Remaining: {remaining_id}")

            await room.send_to(remaining_id, {
                "type": "opponent_disconnected",
                "disconnected_id": player_id,
                "disconnected_name": disconnected_name,
                "remaining_seconds": 60,
                "message": f"{disconnected_name} disconnected! Waiting 60 seconds for reconnect. Autowin on timeout."
            })

            # Cancel existing task for this player if any
            if player_id in room.disconnect_tasks:
                room.disconnect_tasks[player_id].cancel()

            task = asyncio.create_task(self._forfeit_timer(room, disconnected_id=player_id, remaining_id=remaining_id))
            room.disconnect_tasks[player_id] = task

    async def _forfeit_timer(self, room: MatchRoom, disconnected_id: str, remaining_id: str):
        """60-second grace period timer before awarding autowin to remaining player."""
        try:
            for s in range(60, 0, -10):
                await asyncio.sleep(min(10, s))
                if room.status != "ACTIVE" or remaining_id not in room.sockets:
                    return
                # Ping remaining player with countdown update
                await room.send_to(remaining_id, {
                    "type": "disconnect_countdown",
                    "remaining_seconds": max(0, s - 10)
                })

            # 60s expired! Remaining player wins by forfeit
            if room.status == "ACTIVE" and remaining_id in room.sockets:
                room.status = "COMPLETED"
                winner_name = room.player_names.get(remaining_id, "Player")
                loser_name = room.player_names.get(disconnected_id, "Opponent")

                logging.info(f"[{room.match_id}] 60s forfeit timer expired! Winner by autowin: {remaining_id} ({winner_name})")
                db.finish_match(room.match_id, winner_id=remaining_id, finish_reason="AUTOWIN_DISCONNECT")

                await room.send_to(remaining_id, {
                    "type": "match_ended",
                    "winner_id": remaining_id,
                    "winner_name": winner_name,
                    "loser_id": disconnected_id,
                    "loser_name": loser_name,
                    "reason": "AUTOWIN_DISCONNECT",
                    "message": f"🏆 VICTORY BY FORFEIT! {loser_name} failed to reconnect within 1 minute."
                })
        except asyncio.CancelledError:
            pass


coordinator = MatchCoordinator()


# =========================================================================
# WEBSOCKET DISPATCHER & PROTOCOL HANDLER
# =========================================================================

async def websocket_handler(request: web.Request) -> web.WebSocketResponse:
    ws = web.WebSocketResponse(heartbeat=15.0)
    await ws.prepare(request)

    match_id = request.match_info.get("match_id")
    if not match_id:
        await ws.send_str(json.dumps({"type": "error", "message": "Missing match_id in path"}))
        await ws.close()
        return ws

    current_player_id: Optional[str] = None
    room: Optional[MatchRoom] = None

    try:
        async for msg in ws:
            if msg.type == WSMsgType.TEXT:
                try:
                    data = json.loads(msg.data)
                except Exception:
                    continue

                msg_type = data.get("type")

                # -------------------------------------------------------------
                # 1. PLAYER JOIN / AUTHENTICATE
                # -------------------------------------------------------------
                if msg_type == "join":
                    current_player_id = str(data.get("user_id", str(uuid.uuid4())[:8]))
                    user_name = data.get("user_name", f"Fighter #{current_player_id[:4]}")
                    chat_id = str(data.get("chat_id", "0"))

                    room = coordinator.get_or_create_room(
                        match_id=match_id,
                        chat_id=chat_id,
                        creator_id=current_player_id,
                        creator_name=user_name
                    )

                    # Store socket and player metadata
                    room.sockets[current_player_id] = ws
                    room.player_names[current_player_id] = user_name

                    # If this player was disconnected, cancel forfeit timer
                    if current_player_id in room.disconnect_tasks:
                        room.disconnect_tasks[current_player_id].cancel()
                        del room.disconnect_tasks[current_player_id]
                        logging.info(f"[{match_id}] Player {current_player_id} ({user_name}) reconnected!")
                        await room.broadcast({
                            "type": "opponent_reconnected",
                            "player_id": current_player_id,
                            "player_name": user_name,
                            "message": f"⚡ {user_name} has reconnected! Resuming battle."
                        }, exclude_id=current_player_id)

                    # Determine player role (P1 = creator, P2 = opponent)
                    if current_player_id == room.creator_id:
                        role = "p1"
                    else:
                        role = "p2"
                        if room.status == "WAITING":
                            # Second player joins the waiting lobby!
                            db.join_match(match_id, current_player_id, user_name)
                            room.opponent_id = current_player_id
                            room.opponent_name = user_name
                            room.status = "ACTIVE"
                            if room.join_timeout_task:
                                room.join_timeout_task.cancel()

                    # Send acknowledgment to this player
                    await ws.send_str(json.dumps({
                        "type": "joined",
                        "role": role,
                        "player_id": current_player_id,
                        "player_name": user_name,
                        "match_id": match_id,
                        "chat_id": room.chat_id,
                        "status": room.status,
                        "creator": {"id": room.creator_id, "name": room.creator_name},
                        "opponent": {"id": room.opponent_id, "name": room.opponent_name} if room.opponent_id else None
                    }))

                    # If still waiting for opponent:
                    if room.status == "WAITING":
                        remaining_join_time = max(0, int(room.expires_at - time.time()))
                        await ws.send_str(json.dumps({
                            "type": "waiting_opponent",
                            "remaining_seconds": remaining_join_time,
                            "message": "Waiting for opponent to join... (Cancels in 1 minute if nobody joins)"
                        }))
                    elif room.status == "ACTIVE" and len(room.sockets) >= 2:
                        # Both players connected! Notify both to start match
                        logging.info(f"[{match_id}] Match ACTIVE! Both fighters in the arena.")
                        await room.broadcast({
                            "type": "match_start",
                            "p1": {"id": room.creator_id, "name": room.creator_name},
                            "p2": {"id": room.opponent_id, "name": room.opponent_name},
                            "message": "⚔️ MORTAL COMBAT! FIGHT!"
                        })

                # -------------------------------------------------------------
                # 2. REAL-TIME INPUT RELAY (Keys, D-pad, Punches, Kicks, Blocks)
                # -------------------------------------------------------------
                elif msg_type == "input":
                    if room and room.status == "ACTIVE":
                        # Relay input immediately to the peer with zero added overhead
                        await room.broadcast({
                            "type": "peer_input",
                            "from_role": "p1" if current_player_id == room.creator_id else "p2",
                            "key": data.get("key"),
                            "down": bool(data.get("down")),
                            "seq": data.get("seq", 0)
                        }, exclude_id=current_player_id)

                # -------------------------------------------------------------
                # 3. GAME STATE SYNC (Health, Frame, Position correction)
                # -------------------------------------------------------------
                elif msg_type == "sync":
                    if room and room.status == "ACTIVE":
                        await room.broadcast({
                            "type": "peer_sync",
                            "from_role": "p1" if current_player_id == room.creator_id else "p2",
                            "p1_hp": data.get("p1_hp"),
                            "p2_hp": data.get("p2_hp"),
                            "p1_x": data.get("p1_x"),
                            "p2_x": data.get("p2_x"),
                            "round_timer": data.get("round_timer")
                        }, exclude_id=current_player_id)

                # -------------------------------------------------------------
                # 4. MATCH FINISH / KNOCKOUT DECLARATION
                # -------------------------------------------------------------
                elif msg_type == "match_finish":
                    if room and room.status == "ACTIVE":
                        winner_id = data.get("winner_id")
                        reason = data.get("reason", "KNOCKOUT")
                        room.status = "COMPLETED"
                        db.finish_match(room.match_id, winner_id=winner_id, finish_reason=reason)

                        winner_name = room.player_names.get(winner_id, "Winner")
                        await room.broadcast({
                            "type": "match_ended",
                            "winner_id": winner_id,
                            "winner_name": winner_name,
                            "reason": reason,
                            "message": f"🏆 {winner_name} WINS! FATALITY!"
                        })

                # -------------------------------------------------------------
                # 5. REMATCH PROTOCOL
                # -------------------------------------------------------------
                elif msg_type == "rematch_request":
                    if room:
                        await room.broadcast({
                            "type": "rematch_offered",
                            "from_id": current_player_id,
                            "from_name": room.player_names.get(current_player_id, "Player")
                        }, exclude_id=current_player_id)

                elif msg_type == "rematch_accept":
                    if room:
                        # Reset match to active
                        room.status = "ACTIVE"
                        await room.broadcast({
                            "type": "match_start",
                            "p1": {"id": room.creator_id, "name": room.creator_name},
                            "p2": {"id": room.opponent_id, "name": room.opponent_name},
                            "message": "⚔️ REMATCH BEGINS! FIGHT!"
                        })

                # -------------------------------------------------------------
                # 6. HEARTBEAT / PING-PONG
                # -------------------------------------------------------------
                elif msg_type == "ping":
                    await ws.send_str(json.dumps({"type": "pong", "time": data.get("time")}))

            elif msg.type == WSMsgType.ERROR:
                logging.warning(f"WebSocket connection closed with error: {ws.exception()}")

    finally:
        if room and current_player_id:
            await coordinator.handle_player_disconnect(room, current_player_id)

    return ws


# =========================================================================
# REST API ENDPOINTS
# =========================================================================

async def api_create_match(request: web.Request) -> web.Response:
    """Creates a new match session."""
    try:
        body = await request.json()
    except Exception:
        body = {}

    match_id = body.get("match_id") or str(uuid.uuid4())[:8]
    chat_id = str(body.get("chat_id", "0"))
    creator_id = str(body.get("creator_id", str(uuid.uuid4())[:6]))
    creator_name = body.get("creator_name", "Player 1")
    opponent_id = body.get("opponent_id")
    opponent_name = body.get("opponent_name")

    room = coordinator.get_or_create_room(
        match_id=match_id,
        chat_id=chat_id,
        creator_id=creator_id,
        creator_name=creator_name,
        opponent_id=opponent_id,
        opponent_name=opponent_name
    )

    return web.json_response({
        "status": "ok",
        "match": {
            "match_id": room.match_id,
            "chat_id": room.chat_id,
            "creator_id": room.creator_id,
            "creator_name": room.creator_name,
            "opponent_id": room.opponent_id,
            "opponent_name": room.opponent_name,
            "expires_at": room.expires_at
        }
    })


async def api_get_match(request: web.Request) -> web.Response:
    """Returns match details."""
    match_id = request.match_info.get("match_id")
    match = db.get_match(match_id)
    if not match:
        return web.json_response({"status": "error", "message": "Match not found"}, status=404)
    return web.json_response({"status": "ok", "match": match})


async def api_get_leaderboard(request: web.Request) -> web.Response:
    """Returns local group leaderboard."""
    chat_id = request.query.get("chat_id", "0")
    limit = int(request.query.get("limit", "10"))
    lb = db.get_local_leaderboard(chat_id, limit=limit)
    return web.json_response({"status": "ok", "chat_id": chat_id, "leaderboard": lb})


# =========================================================================
# AIOHTTP APPLICATION BUILDER WITH STATIC FILE SUPPORT
# =========================================================================

@web.middleware
async def cors_middleware(request: web.Request, handler):
    """CORS middleware for Telegram WebApp compatibility."""
    if request.method == "OPTIONS":
        resp = web.Response(status=200)
    else:
        resp = await handler(request)
    resp.headers["Access-Control-Allow-Origin"] = "*"
    resp.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    resp.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, Range"
    resp.headers["Access-Control-Expose-Headers"] = "Content-Range, Content-Length, Accept-Ranges"
    return resp


def create_app() -> web.Application:
    app = web.Application(middlewares=[cors_middleware])

    # WebSocket Route
    app.router.add_get("/ws/match/{match_id}", websocket_handler)

    # REST API Routes
    app.router.add_post("/api/match/create", api_create_match)
    app.router.add_get("/api/match/{match_id}", api_get_match)
    app.router.add_get("/api/leaderboard", api_get_leaderboard)

    # Static player files & docs
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    player_dir = os.path.join(root_dir, "player")
    docs_dir = os.path.join(root_dir, "docs")

    async def index_redirect(request):
        raise web.HTTPFound("/player/index.html")

    app.router.add_get("/", index_redirect)
    app.router.add_static("/player/", path=player_dir, show_index=True)
    app.router.add_static("/docs/", path=docs_dir, show_index=True)

    return app


if __name__ == "__main__":
    app = create_app()
    web.run_app(app, host="0.0.0.0", port=8080)
