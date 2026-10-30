"""
Immortal Combat - Real-time WebSocket Matchmaker & Game Coordinator
Handles active match lobbies, 60-second join timeouts, 60-second disconnect grace periods,
input relay, autowins, and local group leaderboard APIs.
"""

import asyncio
import json
import logging
import os
import socket
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
        self.p1_id: Optional[str] = None
        self.p2_id: Optional[str] = None
        self.p1_name: Optional[str] = None
        self.p2_name: Optional[str] = None
        self.p1_hero: Optional[int] = None
        self.p2_hero: Optional[int] = None
        self.p1_rounds: int = 0
        self.p2_rounds: int = 0

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
            # If a player disconnects during lobby wait (e.g. reload or temporary blip),
            # keep room alive for reconnection until the 60-second join timeout genuinely fires.
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

    # Low-latency socket tuning: disable Nagle's algorithm and enable quick ACK
    transport = request.transport
    if transport:
        sock = transport.get_extra_info('socket')
        if sock:
            try:
                sock.setsockopt(socket.IPPROTO_TCP, socket.TCP_NODELAY, 1)
                if hasattr(socket, 'TCP_QUICKACK'):
                    sock.setsockopt(socket.IPPROTO_TCP, socket.TCP_QUICKACK, 1)
            except Exception:
                pass

    match_id = request.match_info.get("match_id")
    if not match_id:
        await ws.send_str(json.dumps({"type": "error", "message": "Missing match_id in path"}))
        await ws.close()
        return ws

    current_player_id: Optional[str] = None
    room: Optional[MatchRoom] = None

    try:
        async for msg in ws:
            if msg.type == WSMsgType.BINARY:
                if room and room.status == "ACTIVE":
                    # Ultra-low-latency zero-copy binary input packet relay
                    payload = msg.data
                    for pid, peer_ws in list(room.sockets.items()):
                        if pid != current_player_id and not peer_ws.closed:
                            try:
                                await peer_ws.send_bytes(payload)
                            except Exception as e:
                                logging.warning(f"[{match_id}] Binary broadcast error to {pid}: {e}")
                continue

            elif msg.type == WSMsgType.TEXT:
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

                    # Check if match has expired or concluded
                    now = time.time()
                    if room.status in ("CANCELLED", "COMPLETED", "ABANDONED") or (room.status == "WAITING" and now >= room.expires_at):
                        if room.status == "WAITING":
                            room.status = "CANCELLED"
                            db.cancel_match(match_id, reason="JOIN_TIMEOUT")
                        await ws.send_str(json.dumps({
                            "type": "match_cancelled",
                            "reason": "EXPIRED",
                            "message": "This battle session has expired (60s timer). Please create a new challenge."
                        }))
                        continue

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
                    # If creator is ALREADY connected with an active socket and another join arrives with same ID:
                    existing_creator_socket = room.sockets.get(room.creator_id)
                    is_duplicate_creator = (
                        current_player_id == room.creator_id
                        and existing_creator_socket is not None
                        and existing_creator_socket is not ws
                        and not existing_creator_socket.closed
                    )

                    if is_duplicate_creator:
                        # Another client joined with same ID (e.g. 2 tabs in same browser or shared URL)
                        # Treat this connection as Player 2!
                        current_player_id = f"{current_player_id}_p2_{str(uuid.uuid4())[:4]}"
                        user_name = f"{user_name} (P2)"
                        role = "p2"
                    elif current_player_id == room.creator_id:
                        role = "p1"
                    else:
                        role = "p2"

                    if role == "p2" and room.status == "WAITING":
                        # Second player joins the waiting lobby!
                        db.join_match(match_id, current_player_id, user_name)
                        room.opponent_id = current_player_id
                        room.opponent_name = user_name
                        room.status = "ACTIVE"
                        if room.join_timeout_task:
                            room.join_timeout_task.cancel()

                    # Store socket and player metadata
                    room.sockets[current_player_id] = ws
                    room.player_names[current_player_id] = user_name

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
                        # Both players connected! Notify both to enter Character Selection
                        logging.info(f"[{match_id}] Match ACTIVE! Both fighters joined. Entering Hero Select.")
                        await room.broadcast({
                            "type": "match_start",
                            "stage": "hero_select",
                            "p1": {"id": room.creator_id, "name": room.creator_name},
                            "p2": {"id": room.opponent_id, "name": room.opponent_name},
                            "message": "⚔️ SELECT YOUR FIGHTER!"
                        })

                # -------------------------------------------------------------
                # 2. HERO SELECTION & LOCK-IN SYNCHRONIZATION
                # -------------------------------------------------------------
                elif msg_type == "hero_hover":
                    if room:
                        hero_id = int(data.get("hero_id", 0))
                        from_role = "p1" if current_player_id == room.creator_id else "p2"
                        await room.broadcast({
                            "type": "peer_hero_hover",
                            "from_role": from_role,
                            "hero_id": hero_id
                        }, exclude_id=current_player_id)

                elif msg_type in ("hero_lock", "select_hero"):
                    if room:
                        hero_id = int(data.get("hero_id", 0))
                        player_name = room.player_names.get(current_player_id, "Player")
                        # First player to select becomes P1 (Left), second becomes P2 (Right)
                        if room.p1_hero is None:
                            room.p1_id = current_player_id
                            room.p1_name = player_name
                            room.p1_hero = hero_id
                            from_role = "p1"
                        elif room.p2_hero is None and current_player_id != room.p1_id:
                            room.p2_id = current_player_id
                            room.p2_name = player_name
                            room.p2_hero = hero_id
                            from_role = "p2"
                        else:
                            from_role = "p1" if current_player_id == room.p1_id else "p2"
                            if from_role == "p1":
                                room.p1_hero = hero_id
                            else:
                                room.p2_hero = hero_id

                        logging.info(f"[{match_id}] Player {from_role} ({player_name}) locked hero {hero_id} (P1={room.p1_hero}, P2={room.p2_hero})")

                        await room.broadcast({
                            "type": "peer_hero_lock",
                            "from_role": from_role,
                            "hero_id": hero_id
                        })

                        # When BOTH fighters are locked in, start the fight!
                        if room.p1_hero is not None and room.p2_hero is not None:
                            p1_id = room.p1_id or room.creator_id
                            p2_id = room.p2_id or room.opponent_id
                            p1_name = room.p1_name or room.creator_name
                            p2_name = room.p2_name or room.opponent_name
                            logging.info(f"[{match_id}] Both heroes locked! Initiating match.")
                            await room.broadcast({
                                "type": "versus_start",
                                "p1": {"id": p1_id, "name": p1_name, "hero_id": room.p1_hero},
                                "p2": {"id": p2_id, "name": p2_name, "hero_id": room.p2_hero},
                                "countdown": 3,
                                "message": "VERSUS"
                            })

                # -------------------------------------------------------------
                # 3. ROUND PROGRESSION & BEST-OF-THREE RESOLUTION
                # -------------------------------------------------------------
                elif msg_type == "round_win":
                    if room and room.status == "ACTIVE":
                        winner_role = str(data.get("winner_role", "p1")).lower()
                        if winner_role == "p1":
                            room.p1_rounds += 1
                        elif winner_role == "p2":
                            room.p2_rounds += 1

                        logging.info(f"[{match_id}] Round won by {winner_role}! Score: P1={room.p1_rounds}, P2={room.p2_rounds}")

                        if room.p1_rounds >= 2 or room.p2_rounds >= 2:
                            # 2 round wins achieved -> Match Won!
                            winner_role = "p1" if room.p1_rounds >= 2 else "p2"
                            p1_id = room.p1_id or room.creator_id
                            p2_id = room.p2_id or room.opponent_id
                            p1_name = room.p1_name or room.creator_name
                            p2_name = room.p2_name or room.opponent_name
                            winner_id = p1_id if winner_role == "p1" else p2_id
                            winner_name = p1_name if winner_role == "p1" else p2_name
                            loser_id = p2_id if winner_role == "p1" else p1_id
                            loser_name = p2_name if winner_role == "p1" else p1_name
                            room.status = "COMPLETED"
                            db.finish_match(room.match_id, winner_id=winner_id, finish_reason="KNOCKOUT")

                            await room.broadcast({
                                "type": "match_ended",
                                "winner_id": winner_id,
                                "winner_name": winner_name,
                                "winner_role": winner_role,
                                "loser_id": loser_id,
                                "loser_name": loser_name,
                                "p1_rounds": room.p1_rounds,
                                "p2_rounds": room.p2_rounds,
                                "reason": "KNOCKOUT",
                                "message": f"🏆 {winner_name} WINS! ({room.p1_rounds} - {room.p2_rounds})"
                            })
                        else:
                            await room.broadcast({
                                "type": "round_next",
                                "round_num": room.p1_rounds + room.p2_rounds + 1,
                                "p1_rounds": room.p1_rounds,
                                "p2_rounds": room.p2_rounds,
                                "winner_role": winner_role
                            })

                # -------------------------------------------------------------
                # 4. REAL-TIME INPUT RELAY (Keys, D-pad, Punches, Kicks, Blocks)
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
                        # Reset match to active and clear heroes & rounds for fresh rematch
                        room.status = "ACTIVE"
                        room.p1_id = None
                        room.p2_id = None
                        room.p1_name = None
                        room.p2_name = None
                        room.p1_hero = None
                        room.p2_hero = None
                        room.p1_rounds = 0
                        room.p2_rounds = 0
                        await room.broadcast({
                            "type": "match_start",
                            "stage": "hero_select",
                            "p1": {"id": room.creator_id, "name": room.creator_name},
                            "p2": {"id": room.opponent_id, "name": room.opponent_name},
                            "message": "⚔️ REMATCH BEGINS! CHOOSE YOUR FIGHTERS!"
                        })

                # -------------------------------------------------------------
                # 6. HEARTBEAT / PING-PONG
                # -------------------------------------------------------------
                elif msg_type == "ping":
                    await ws.send_str(json.dumps({"type": "pong", "time": data.get("time")}))

                # -------------------------------------------------------------
                # 7. WEBRTC P2P SIGNALING (SDP Offer/Answer & ICE Candidates)
                # -------------------------------------------------------------
                elif msg_type == "rtc_signal":
                    if room:
                        from_role = "p1" if current_player_id == room.creator_id else "p2"
                        await room.broadcast({
                            "type": "rtc_signal",
                            "from_role": from_role,
                            "signal": data.get("signal")
                        }, exclude_id=current_player_id)

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
