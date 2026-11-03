"""
Immortal Combat - Real-time WebSocket Matchmaker & Game Coordinator

One room per challenge. The two players are the creator and whoever accepts first; anyone else who opens
the challenge watches as a spectator. A room runs: open challenge (db.CHALLENGE_WINDOW_SECONDS to accept;
the creator is notified) -> hero select -> a lockstep bout (inputs relayed, and recorded for spectators and
replays) -> result (both phones must report the same round score) -> optional rematch.
A player who drops or leaves the app has RECONNECT_GRACE_SECONDS to come back before the other wins.
"""

import asyncio
import hashlib
import hmac
import json
import logging
import math
import os
import random
import socket
import time
import uuid
import zlib
from collections import deque
from typing import Awaitable, Callable, Dict, List, Optional, Set, Tuple
from urllib.parse import parse_qsl

from aiohttp import web, WSMsgType
import server.db as db

logging.basicConfig(level=logging.INFO, format="%(asctime)s - [%(levelname)s] %(message)s")

RECONNECT_GRACE_SECONDS = 60
REMATCH_WINDOW_SECONDS = 120          # both players are in the app when a rematch is agreed
ROOM_KEEP_AFTER_END_SECONDS = 600     # finished rooms stay in memory this long for late rejoins
STALE_ACTIVE_SECONDS = 1800           # an ACTIVE match nobody is connected to after this long is abandoned
SWEEP_INTERVAL_SECONDS = 60
INIT_DATA_MAX_AGE_SECONDS = 24 * 3600
# An inline challenge's match is created when Telegram tells the bot the message was sent, which can land a
# moment after a fast tap on its Play button; a join waits this long for it before calling it unknown
NEW_CHALLENGE_WAIT_SECONDS = 3.0

# Fighter names by hero id (the engine's select grid order), for result messages
HERO_NAMES = ["Scorpion", "Sub-Zero", "Kitana", "Shao Kahn", "Sonya", "Cyrax", "Liu Kang"]


def hero_name(hero_id: Optional[int]) -> Optional[str]:
    if isinstance(hero_id, int) and 0 <= hero_id < len(HERO_NAMES):
        return HERO_NAMES[hero_id]
    return None


def bot_token() -> Optional[str]:
    return os.getenv("TELEGRAM_BOT_TOKEN") or os.getenv("TG_BOT_TOKEN")


def auth_required() -> bool:
    """Production sets REQUIRE_TG_AUTH=1: every player must prove who they are with Telegram's signed initData."""
    return os.getenv("REQUIRE_TG_AUTH", "").strip().lower() in ("1", "true", "yes")


def verify_init_data(init_data: str, token: str, now: Optional[float] = None) -> Optional[dict]:
    """
    Checks a Mini App's initData the way Telegram documents it (HMAC-SHA256 keyed with the bot token, over
    every field except `hash`, sorted) and returns the player it vouches for, or None if it isn't genuine.
    """
    if not init_data or not token:
        return None
    try:
        fields = dict(parse_qsl(init_data, strict_parsing=True, keep_blank_values=True))
    except ValueError:
        return None
    received = fields.pop("hash", None)
    if not received:
        return None
    check_string = "\n".join(f"{k}={v}" for k, v in sorted(fields.items()))
    secret = hmac.new(b"WebAppData", token.encode(), hashlib.sha256).digest()
    expected = hmac.new(secret, check_string.encode(), hashlib.sha256).hexdigest()
    if not hmac.compare_digest(expected, received):
        return None
    try:
        auth_date = int(fields.get("auth_date") or 0)
        user = json.loads(fields.get("user") or "{}")
    except ValueError:
        return None
    if (now if now is not None else time.time()) - auth_date > INIT_DATA_MAX_AGE_SECONDS or not user.get("id"):
        return None
    return {
        "id": str(user["id"]),
        "name": str(user.get("first_name") or user.get("username") or "Fighter")[:32],
        "chat_instance": fields.get("chat_instance"),
        "chat_type": fields.get("chat_type"),
    }


def clean_resume(resume) -> Optional[dict]:
    """A restart state from a phone, reduced to the fields and ranges the game uses."""
    if not isinstance(resume, dict):
        return None
    try:
        rounds = [max(0, min(3, int(x))) for x in resume.get("rounds", [0, 0])][:2]
        health = resume.get("health")
        health = [max(1, min(100, int(x))) for x in health][:2] if isinstance(health, list) and len(health) == 2 else None
        timer = max(0, min(99999, int(resume.get("timer") or 0)))
    except (TypeError, ValueError):
        return None
    if len(rounds) != 2:
        return None
    return {"rounds": rounds, "health": health, "timer": timer}


class BoutRecorder:
    """
    Both players' input for every lockstep tick, per bout segment, as the server relays it. Spectators
    catch up from it and it becomes the match replay. Inputs arrive one tick at a time in order on each
    player's socket; a gap (the socket dropped) ends that player's usable run for the segment.
    """

    def __init__(self):
        self.setup: Optional[dict] = None
        self.segments: List[dict] = []

    def start(self, setup: dict):
        self.setup = setup
        self.segments = []
        self.new_segment(0, None)

    def new_segment(self, segment: int, resume: Optional[dict]):
        # inputs[side]: tick -> (pressed, released) for ticks with a key change; next[side]: ticks recorded so far
        self.segments.append({"segment": segment, "resume": resume, "inputs": [{}, {}], "next": [0, 0]})

    def record(self, side: int, packet: bytes) -> bool:
        """Records one lockstep input packet; True if it was the next tick for that side (i.e. new)."""
        # [4, segment, hint, hintSeq, tick u32, pressed u32, released u32, senderTick u32]
        if not self.segments or len(packet) < 20 or packet[0] != 4:
            return False
        seg = self.segments[-1]
        if packet[1] != seg["segment"] & 0xFF:
            return False
        tick = int.from_bytes(packet[4:8], "big")
        if tick != seg["next"][side]:
            return False
        pressed = int.from_bytes(packet[8:12], "big")
        released = int.from_bytes(packet[12:16], "big")
        if pressed or released:
            seg["inputs"][side][tick] = (pressed, released)
        seg["next"][side] = tick + 1
        return True

    @staticmethod
    def segment_json(seg: dict) -> dict:
        def stream(side):
            return [[t, p, r] for t, (p, r) in sorted(seg["inputs"][side].items())]
        return {"segment": seg["segment"], "resume": seg["resume"], "p1": stream(0), "p2": stream(1),
                "ticks": list(seg["next"])}

    def current_json(self) -> Optional[dict]:
        return self.segment_json(self.segments[-1]) if self.segments else None

    def replay_json(self) -> Optional[dict]:
        if not self.setup or not self.segments:
            return None
        return {"setup": self.setup, "segments": [self.segment_json(s) for s in self.segments]}


class MatchRoom:
    def __init__(self, match_id: str, chat_id: str, creator_id: str, creator_name: str,
                 opponent_id: Optional[str] = None, opponent_name: Optional[str] = None):
        self.match_id = match_id
        self.chat_id = str(chat_id)
        self.creator_id = str(creator_id)
        self.creator_name = creator_name
        self.opponent_id = str(opponent_id) if opponent_id else None
        self.opponent_name = opponent_name
        self.status = "WAITING"  # WAITING, ACTIVE, COMPLETED, CANCELLED, ABANDONED
        self.created_at = time.time()
        self.expires_at = self.created_at + db.CHALLENGE_WINDOW_SECONDS

        # The two players' sockets (player id -> socket) and everyone watching (connection id -> socket)
        self.sockets: Dict[str, web.WebSocketResponse] = {}
        self.spectators: Dict[str, web.WebSocketResponse] = {}
        self.player_names: Dict[str, str] = {self.creator_id: creator_name}
        if self.opponent_id and self.opponent_name:
            self.player_names[self.opponent_id] = self.opponent_name

        # Grace timers for a player who dropped or left the app, and when each runs out
        self.disconnect_tasks: Dict[str, asyncio.Task] = {}
        self.forfeit_deadlines: Dict[str, float] = {}
        self.away: Set[str] = set()
        self.join_timeout_task: Optional[asyncio.Task] = None

        self.p1_id: Optional[str] = None
        self.p2_id: Optional[str] = None
        self.p1_name: Optional[str] = None
        self.p2_name: Optional[str] = None
        self.p1_hero: Optional[int] = None
        self.p2_hero: Optional[int] = None
        self.p1_control: int = 1  # Engine control type (val_int_bw) each player fights with
        self.p2_control: int = 1
        self.p1_rounds: int = 0
        self.p2_rounds: int = 0
        self.stage: Optional[int] = None  # Arena index 0-4, shared so both phones load the same one
        self.seed: Optional[int] = None  # Engine RNG seed, shared so both lockstep simulations roll the same numbers
        self.hero_select_started = False

        # Lockstep bookkeeping: the segment both phones run (bumped by every restart), whether each player's
        # phone still holds the running bout, and each phone's latest round score report
        self.segment = 0
        self.bout_live: Dict[str, bool] = {}
        self.score_reports: Dict[str, Tuple[int, int]] = {}
        self.recorder = BoutRecorder()

        self.result: Optional[dict] = None  # the match_ended message, for late rejoins and spectators
        self.ended_at: Optional[float] = None
        self.rematch_requests: Set[str] = set()
        self.rematch_id: Optional[str] = None
        self.restored = False  # rebuilt from the database after a server restart
        self.notified_creator_of: Optional[str] = None
        self.chat_instance: Optional[str] = None

    # ----- who is who -----

    def participants(self) -> List[str]:
        return [pid for pid in (self.creator_id, self.opponent_id) if pid]

    def is_participant(self, player_id: Optional[str]) -> bool:
        return bool(player_id) and player_id in self.participants()

    def other_participant(self, player_id: Optional[str]) -> Optional[str]:
        if player_id == self.creator_id:
            return self.opponent_id
        if player_id == self.opponent_id:
            return self.creator_id
        return None

    def role_of(self, player_id: Optional[str]) -> str:
        """Sides follow hero lock order once someone has locked (first lock fights on the left)."""
        return "p1" if player_id == (self.p1_id or self.creator_id) else "p2"

    def both_connected(self) -> bool:
        return len(self.participants()) == 2 and all(pid in self.sockets for pid in self.participants())

    def heroes_locked(self) -> bool:
        return self.p1_hero is not None and self.p2_hero is not None

    def bout_ready(self) -> bool:
        """The bout has been set up (arena and seed chosen), so both phones can run it."""
        return self.heroes_locked() and self.seed is not None

    def is_expired(self) -> bool:
        return self.status == "WAITING" and time.time() > self.expires_at

    def versus_payload(self) -> dict:
        return {
            "type": "versus_start",
            "p1": {"id": self.p1_id or self.creator_id, "name": self.p1_name or self.creator_name,
                   "hero_id": self.p1_hero, "control": self.p1_control},
            "p2": {"id": self.p2_id or self.opponent_id, "name": self.p2_name or self.opponent_name,
                   "hero_id": self.p2_hero, "control": self.p2_control},
            "stage": self.stage,
            "seed": self.seed,
            "p1_rounds": self.p1_rounds,
            "p2_rounds": self.p2_rounds,
            "countdown": 3,
            "message": "VERSUS"
        }

    def state_for_db(self) -> dict:
        return {key: getattr(self, key) for key in (
            "p1_id", "p2_id", "p1_name", "p2_name", "p1_hero", "p2_hero", "p1_control", "p2_control",
            "p1_rounds", "p2_rounds", "stage", "seed", "segment")}

    def restore_state(self, state: dict):
        for key, value in state.items():
            if hasattr(self, key):
                setattr(self, key, value)

    def persist(self):
        db.save_room_state(self.match_id, self.state_for_db())

    # ----- sending -----

    async def _send(self, ws: Optional[web.WebSocketResponse], payload: str):
        if ws is not None and not ws.closed:
            try:
                await ws.send_str(payload)
            except Exception as e:
                logging.warning(f"[{self.match_id}] Send error: {e}")

    async def broadcast(self, message: dict, exclude_id: Optional[str] = None, spectators: bool = True):
        """Sends a JSON message to both players (and, unless told otherwise, everyone watching)."""
        payload = json.dumps(message)
        for pid, ws in list(self.sockets.items()):
            if pid != exclude_id:
                await self._send(ws, payload)
        if spectators:
            for ws in list(self.spectators.values()):
                await self._send(ws, payload)

    async def broadcast_spectators(self, message: dict):
        payload = json.dumps(message)
        for ws in list(self.spectators.values()):
            await self._send(ws, payload)

    async def send_to(self, player_id: Optional[str], message: dict):
        """Sends a JSON message to a specific player."""
        await self._send(self.sockets.get(player_id) if player_id else None, json.dumps(message))


Notifier = Callable[[str, dict], Awaitable[None]]


class MatchCoordinator:
    """Singleton coordinator managing all active match rooms and lifecycles."""

    def __init__(self):
        self.rooms: Dict[str, MatchRoom] = {}
        # Set by the bot: posts challenge updates and results to Telegram (event name, match info)
        self.notifier: Optional[Notifier] = None

    def get_or_create_room(self, match_id: str, chat_id: str = "0", creator_id: str = "0",
                           creator_name: str = "Player 1", opponent_id: Optional[str] = None,
                           opponent_name: Optional[str] = None, create: bool = True) -> Optional[MatchRoom]:
        if match_id in self.rooms:
            return self.rooms[match_id]

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
            room.chat_instance = match_data.get("chat_instance")
            state = db.load_room_state(match_data)
            if state:
                room.restore_state(state)
            if room.status == "ACTIVE":
                # The server restarted mid-match: the fight continues once both players are back
                room.restored = True
                if room.bout_ready():
                    room.recorder.setup = room.versus_payload()
            elif room.status in ("COMPLETED", "ABANDONED", "CANCELLED"):
                room.ended_at = match_data.get("ended_at") or time.time()
                if room.status == "COMPLETED":
                    room.result = self._result_message(room, match_data.get("winner_id"),
                                                       match_data.get("finish_reason") or "KNOCKOUT")
                    room.result["replay"] = db.get_replay(match_id) is not None
        elif create:
            db.create_match(match_id, chat_id, creator_id, creator_name, opponent_id, opponent_name)
            room = MatchRoom(match_id, chat_id, creator_id, creator_name, opponent_id, opponent_name)
        else:
            return None

        self.rooms[match_id] = room

        if room.status == "WAITING":
            room.join_timeout_task = asyncio.create_task(self._watch_join_timeout(room))

        return room

    # ----- Telegram notifications -----

    def notify(self, event: str, room: MatchRoom, **extra):
        """Tells the bot about a challenge or match change, without holding up the game traffic."""
        if not self.notifier:
            return
        info = {
            "match_id": room.match_id, "chat_id": room.chat_id,
            "creator": {"id": room.creator_id, "name": room.creator_name},
            "opponent": {"id": room.opponent_id, "name": room.opponent_name} if room.opponent_id else None,
            "p1": {"id": room.p1_id, "name": room.p1_name, "hero": hero_name(room.p1_hero)},
            "p2": {"id": room.p2_id, "name": room.p2_name, "hero": hero_name(room.p2_hero)},
            "rounds": [room.p1_rounds, room.p2_rounds],
            "result": room.result,
            **extra,
        }

        async def run():
            try:
                await self.notifier(event, info)
            except Exception as e:
                logging.warning(f"[{room.match_id}] Notifier failed for {event}: {e}")
        asyncio.create_task(run())

    # ----- lobby -----

    async def _watch_join_timeout(self, room: MatchRoom):
        """Cancels the challenge if nobody accepts it before its window closes."""
        try:
            while room.status == "WAITING":
                delay = room.expires_at - time.time()
                if delay <= 0:
                    break
                await asyncio.sleep(min(delay, 30))
            if room.status == "WAITING":
                logging.info(f"[{room.match_id}] Challenge expired without a fight.")
                room.status = "CANCELLED"
                room.ended_at = time.time()
                db.cancel_match(room.match_id, reason="JOIN_TIMEOUT")
                await room.broadcast({
                    "type": "match_cancelled",
                    "reason": "JOIN_TIMEOUT",
                    "message": "Nobody accepted the challenge in time. Match cancelled."
                })
                self.notify("challenge_expired", room)
        except asyncio.CancelledError:
            pass

    async def send_waiting(self, room: MatchRoom):
        """Tells each connected player who they are waiting for and how long the challenge stays open."""
        remaining = max(0, int(room.expires_at - time.time()))
        for pid in list(room.sockets):
            other = room.other_participant(pid)
            await room.send_to(pid, {
                "type": "waiting_opponent",
                "remaining_seconds": remaining,
                "waiting_for": {"id": other, "name": room.player_names.get(other, room.opponent_name)} if other else None,
                "message": "Waiting for your opponent..."
            })

    async def activate(self, room: MatchRoom):
        """Both players are connected: the challenge becomes a match and hero select starts."""
        if room.join_timeout_task:
            room.join_timeout_task.cancel()
        db.join_match(room.match_id, room.opponent_id, room.opponent_name)
        room.status = "ACTIVE"
        await self.start_hero_select(room)
        self.notify("match_started", room)

    async def start_hero_select(self, room: MatchRoom, only: Optional[str] = None):
        """Sends both players (or one rejoining player) to hero select, with any locks already made."""
        room.hero_select_started = True
        locks = {pid: hero for pid, hero in ((room.p1_id, room.p1_hero), (room.p2_id, room.p2_hero))
                 if pid and hero is not None}
        message = {
            "type": "match_start",
            "stage": "hero_select",
            "p1": {"id": room.creator_id, "name": room.creator_name},
            "p2": {"id": room.opponent_id, "name": room.opponent_name},
            "locks": locks,
            "message": "⚔️ SELECT YOUR FIGHTER!"
        }
        if only:
            await room.send_to(only, message)
        else:
            logging.info(f"[{room.match_id}] Both fighters joined. Entering Hero Select.")
            await room.broadcast(message, spectators=False)

    # ----- the bout -----

    async def start_bout(self, room: MatchRoom):
        """Both heroes are locked: pick the arena and seed, and start the fight on both phones."""
        room.stage = random.randint(0, 4)  # native 2P versus picks a random arena 0-4
        room.seed = random.randint(1, 2**31 - 1)
        room.segment = 0
        room.p1_rounds = room.p2_rounds = 0
        room.score_reports = {}
        payload = room.versus_payload()
        room.recorder.start(payload)
        room.bout_live = {pid: True for pid in room.sockets}
        room.persist()
        logging.info(f"[{room.match_id}] Both heroes locked! Initiating match on stage {room.stage}.")
        await room.broadcast(payload, spectators=False)
        await room.broadcast_spectators(self.spectate_message(room))

    def spectate_message(self, room: MatchRoom) -> dict:
        return {"type": "spectate", "setup": room.recorder.setup, "segment": room.recorder.current_json(),
                "p1_rounds": room.p1_rounds, "p2_rounds": room.p2_rounds}

    def begin_segment(self, room: MatchRoom, segment: int, resume: Optional[dict]):
        room.segment = segment
        if room.recorder.setup is None:
            room.recorder.setup = room.versus_payload()
        room.recorder.new_segment(segment, resume)
        room.bout_live = {pid: True for pid in room.sockets}
        room.persist()

    async def restart_bout(self, room: MatchRoom, rejoined_id: str):
        """
        A player came back mid-bout. Their phone may have missed inputs, so both phones restart the bout
        from one state: the phone that kept the bout running sends it (restart_request), or, if neither
        did (both reloaded, e.g. after a server restart), the server's round score.
        """
        if room.status != "ACTIVE" or not room.bout_ready() or not room.both_connected():
            return
        other = room.other_participant(rejoined_id)
        source = other if room.bout_live.get(other) else (rejoined_id if room.bout_live.get(rejoined_id) else None)
        segment = room.segment + 1
        if source:
            await room.send_to(source, {"type": "restart_request", "segment": segment})
            return
        resume = {"rounds": [room.p1_rounds, room.p2_rounds], "health": None, "timer": 0}
        self.begin_segment(room, segment, resume)
        await room.broadcast({"type": "state_snapshot", "segment": segment, "resume": resume, "from_role": "server"},
                             spectators=False)
        await room.broadcast_spectators(self.spectate_message(room))

    async def settle_rounds(self, room: MatchRoom):
        """Adopts a round score once both phones report the same one; ends the match at two wins."""
        reports = [room.score_reports.get(pid) for pid in room.participants()]
        if len(reports) != 2 or reports[0] is None or reports[0] != reports[1]:
            return
        p1, p2 = reports[0]
        if (p1, p2) == (room.p1_rounds, room.p2_rounds) or p1 < room.p1_rounds or p2 < room.p2_rounds:
            return
        room.p1_rounds, room.p2_rounds = p1, p2
        room.persist()
        logging.info(f"[{room.match_id}] Round score confirmed by both phones: P1={p1}, P2={p2}")

        if p1 >= 2 and p1 == p2:
            await self.finish(room, None, "DRAW")
        elif p1 >= 2 or p2 >= 2:
            winner_role = "p1" if p1 > p2 else "p2"
            winner_id = (room.p1_id or room.creator_id) if winner_role == "p1" else (room.p2_id or room.opponent_id)
            await self.finish(room, winner_id, "KNOCKOUT")
        else:
            await room.broadcast({"type": "round_next", "round_num": p1 + p2 + 1, "p1_rounds": p1, "p2_rounds": p2})

    def _result_message(self, room: MatchRoom, winner_id: Optional[str], reason: str) -> dict:
        loser_id = room.other_participant(winner_id) if winner_id else None
        winner_name = room.player_names.get(winner_id, "Winner") if winner_id else None
        messages = {
            "DRAW": f"DRAW! ({room.p1_rounds} - {room.p2_rounds})",
            "AUTOWIN_DISCONNECT": f"🏆 VICTORY BY FORFEIT! {room.player_names.get(loser_id, 'Opponent')} did not come back in time.",
        }
        return {
            "type": "match_ended",
            "winner_id": winner_id,
            "winner_name": winner_name,
            "winner_role": room.role_of(winner_id) if winner_id else None,
            "loser_id": loser_id,
            "loser_name": room.player_names.get(loser_id) if loser_id else None,
            "p1": {"id": room.p1_id or room.creator_id, "name": room.p1_name or room.creator_name},
            "p2": {"id": room.p2_id or room.opponent_id, "name": room.p2_name or room.opponent_name},
            "p1_rounds": room.p1_rounds,
            "p2_rounds": room.p2_rounds,
            "reason": reason,
            "message": messages.get(reason, f"🏆 {winner_name} WINS! ({room.p1_rounds} - {room.p2_rounds})"),
        }

    async def finish(self, room: MatchRoom, winner_id: Optional[str], reason: str):
        room.status = "COMPLETED"
        room.ended_at = time.time()
        for task in room.disconnect_tasks.values():
            task.cancel()
        room.disconnect_tasks.clear()
        room.forfeit_deadlines.clear()
        db.finish_match(room.match_id, winner_id=winner_id, finish_reason=reason)
        replay = room.recorder.replay_json()
        room.result = self._result_message(room, winner_id, reason)
        room.result["replay"] = bool(replay)
        if replay:
            replay["result"] = room.result
            db.save_replay(room.match_id, zlib.compress(json.dumps(replay, separators=(",", ":")).encode()))
        logging.info(f"[{room.match_id}] Match ended: {reason}, winner {winner_id}")
        await room.broadcast(room.result)
        self.notify("match_ended", room, has_replay=bool(replay))

    # ----- leaving and coming back -----

    async def start_forfeit(self, room: MatchRoom, missing_id: str, away: bool = False):
        """Gives a player who dropped (or left the app) the grace period; the other wins if it runs out."""
        remaining_id = room.other_participant(missing_id)
        deadline = room.forfeit_deadlines.setdefault(missing_id, time.time() + RECONNECT_GRACE_SECONDS)
        seconds = max(0, math.ceil(deadline - time.time()))
        name = room.player_names.get(missing_id, "Opponent")
        logging.info(f"[{room.match_id}] {seconds}s forfeit countdown against {missing_id} ({'away' if away else 'dropped'}).")
        if remaining_id in room.sockets:
            await room.send_to(remaining_id, {
                "type": "opponent_away" if away else "opponent_disconnected",
                "disconnected_id": missing_id,
                "disconnected_name": name,
                "remaining_seconds": seconds,
                "message": f"{name} {'left the game' if away else 'disconnected'}! Autowin in {seconds}s."
            })
        await room.broadcast_spectators({"type": "player_away", "player_id": missing_id, "remaining_seconds": seconds})
        task = room.disconnect_tasks.get(missing_id)
        if task is None or task.done():
            room.disconnect_tasks[missing_id] = asyncio.create_task(self._forfeit_timer(room, missing_id))

    def cancel_forfeit(self, room: MatchRoom, player_id: str):
        task = room.disconnect_tasks.pop(player_id, None)
        if task:
            task.cancel()
        room.forfeit_deadlines.pop(player_id, None)

    async def _forfeit_timer(self, room: MatchRoom, missing_id: str):
        try:
            while True:
                deadline = room.forfeit_deadlines.get(missing_id)
                if deadline is None or room.status != "ACTIVE":
                    return
                left = deadline - time.time()
                if left <= 0:
                    break
                await asyncio.sleep(min(10, left))
                left = max(0, math.ceil(deadline - time.time()))
                remaining_id = room.other_participant(missing_id)
                if left > 0 and remaining_id in room.sockets:
                    await room.send_to(remaining_id, {"type": "disconnect_countdown", "remaining_seconds": left})

            remaining_id = room.other_participant(missing_id)
            still_missing = missing_id not in room.sockets or missing_id in room.away
            if room.status != "ACTIVE" or not still_missing:
                return
            room.disconnect_tasks.pop(missing_id, None)
            if remaining_id in room.sockets and remaining_id not in room.away:
                logging.info(f"[{room.match_id}] Grace period over: {remaining_id} wins by forfeit.")
                await self.finish(room, remaining_id, "AUTOWIN_DISCONNECT")
            else:
                # Neither player is in the fight: nobody wins
                await self.abandon(room)
        except asyncio.CancelledError:
            pass

    async def abandon(self, room: MatchRoom):
        logging.info(f"[{room.match_id}] Both players gone. Match ABANDONED without a winner.")
        for task in room.disconnect_tasks.values():
            task.cancel()
        room.disconnect_tasks.clear()
        room.forfeit_deadlines.clear()
        room.status = "ABANDONED"
        room.ended_at = time.time()
        db.finish_match(room.match_id, winner_id=None, finish_reason="BOTH_DISCONNECTED")
        await room.broadcast({"type": "match_cancelled", "reason": "ABANDONED",
                              "message": "Both fighters left. Match abandoned."})

    async def handle_player_disconnect(self, room: MatchRoom, player_id: str, ws: Optional[web.WebSocketResponse] = None):
        """
        - WAITING: an accepted-but-unstarted challenge is released, so someone else can take it.
        - ACTIVE: the player gets the reconnect grace period; if both are gone when it ends, it's abandoned.
        - COMPLETED: their rematch request is withdrawn and the other player is told they left.
        """
        if ws is not None and room.sockets.get(player_id) is not ws:
            return  # a newer connection already replaced this one
        room.sockets.pop(player_id, None)
        room.away.discard(player_id)
        logging.info(f"[{room.match_id}] Player {player_id} disconnected. Status: {room.status}. Active sockets: {len(room.sockets)}")

        if room.status == "WAITING":
            if player_id == room.opponent_id and room.creator_id not in room.sockets:
                logging.info(f"[{room.match_id}] {player_id} left before the creator arrived; the challenge is open again.")
                room.opponent_id = None
                room.opponent_name = None
                room.notified_creator_of = None
            await self.send_waiting(room)
            return

        if room.status == "ACTIVE":
            # Even when both are gone (a deploy reloads both phones at once) each gets the grace period; the
            # match is abandoned only if neither is back when the first one runs out (see _forfeit_timer)
            await self.start_forfeit(room, player_id)
            return

        if room.status == "COMPLETED" and not room.rematch_id:
            room.rematch_requests.discard(player_id)
            await room.broadcast({"type": "rematch_status", "requested": sorted(room.rematch_requests),
                                  "opponent_left": True})

    # ----- rematch -----

    async def request_rematch(self, room: MatchRoom, player_id: str):
        if room.status != "COMPLETED":
            return
        if room.rematch_id:
            await room.send_to(player_id, {"type": "rematch_start", "match_id": room.rematch_id})
            return
        room.rematch_requests.add(player_id)
        if not all(pid in room.rematch_requests for pid in room.participants()):
            await room.broadcast({"type": "rematch_status", "requested": sorted(room.rematch_requests),
                                  "opponent_left": room.other_participant(player_id) not in room.sockets})
            return
        new_id = uuid.uuid4().hex[:8]
        db.create_match(new_id, room.chat_id, room.creator_id, room.creator_name, room.opponent_id, room.opponent_name,
                        timeout_seconds=REMATCH_WINDOW_SECONDS, rematch_of=room.match_id)
        if room.chat_instance:
            db.set_match_chat_instance(new_id, room.chat_instance)
        self.get_or_create_room(new_id)
        room.rematch_id = new_id
        logging.info(f"[{room.match_id}] Rematch agreed: {new_id}")
        await room.broadcast({"type": "rematch_start", "match_id": new_id})

    # ----- housekeeping -----

    def live_match_ids(self) -> List[str]:
        return [mid for mid, r in self.rooms.items() if r.sockets or r.spectators]

    def active_match_count(self) -> int:
        return sum(1 for r in self.rooms.values() if r.status == "ACTIVE" and r.sockets)

    def sweep(self):
        """Forgets finished rooms nobody is connected to and closes matches a restart left hanging."""
        now = time.time()
        for match_id, room in list(self.rooms.items()):
            finished = room.status in ("COMPLETED", "CANCELLED", "ABANDONED")
            if finished and not room.sockets and not room.spectators and now - (room.ended_at or now) > ROOM_KEEP_AFTER_END_SECONDS:
                del self.rooms[match_id]
        closed = db.close_stale_matches(STALE_ACTIVE_SECONDS, self.live_match_ids())
        for match_id in closed["cancelled"] + closed["abandoned"]:
            self.rooms.pop(match_id, None)
        if closed["cancelled"] or closed["abandoned"]:
            logging.info(f"Closed stale matches: {closed}")

    async def sweep_forever(self):
        try:
            while True:
                try:
                    self.sweep()
                except Exception as e:
                    logging.warning(f"Room sweep failed: {e}")
                await asyncio.sleep(SWEEP_INTERVAL_SECONDS)
        except asyncio.CancelledError:
            pass


coordinator = MatchCoordinator()

# Recent lockstep stats reported by phones every 10s, newest last; numbers only, no player identity
NET_STATS_FIELDS = (
    "segment", "secs", "ticks_per_s", "stalls", "stall_ms", "max_stall_ms", "delay", "delay_min", "delay_max",
    "ticks_ahead", "peer_rtt", "server_rtt", "p2p", "ice_failures", "frame_ms", "slow_frames", "tick_ms",
    "paints_skipped", "catch_up_frames", "desyncs",
)
# Direct-connection diagnostics: ICE state and candidate type tallies such as "host:2,srflx:1"
NET_STATS_TEXT_FIELDS = ("ice_state", "ice_local", "ice_remote")
net_stats_log: deque = deque(maxlen=500)


def record_net_stats(match_id: str, role: str, data: dict):
    entry = {"at": round(time.time()), "match_id": match_id, "role": role}
    for field in NET_STATS_FIELDS:
        value = data.get(field)
        if isinstance(value, (int, float, bool)) or value is None:
            entry[field] = value
    for field in NET_STATS_TEXT_FIELDS:
        if field in data:
            entry[field] = str(data[field])[:40]
    entry["device"] = str(data.get("device", ""))[:160]
    net_stats_log.append(entry)
    logging.info(f"[{match_id}] net_stats {role}: {json.dumps({k: v for k, v in entry.items() if k not in ('at', 'match_id', 'role')})}")


def build_version() -> str:
    return os.getenv("BUILD_VERSION", "5dc4ec3")


# =========================================================================
# WEBSOCKET DISPATCHER & PROTOCOL HANDLER
# =========================================================================

def identify(data: dict) -> Optional[dict]:
    """The player a join message speaks for: Telegram-verified, or (development only) as the client claims."""
    token = bot_token()
    verified = verify_init_data(str(data.get("init_data") or ""), token) if token else None
    if verified:
        return verified
    if auth_required():
        return None
    return {
        "id": str(data.get("user_id") or uuid.uuid4().hex[:8]),
        "name": str(data.get("user_name") or "Fighter")[:32],
        "chat_instance": None,
        "chat_type": None,
    }


async def relay_input(room: MatchRoom, sender_id: str, payload: bytes):
    """A player's lockstep input: to the opponent, into the recording, and on to spectators."""
    opponent = room.other_participant(sender_id)
    peer_ws = room.sockets.get(opponent) if opponent else None
    if peer_ws is not None and not peer_ws.closed:
        try:
            await peer_ws.send_bytes(payload)
        except Exception as e:
            logging.warning(f"[{room.match_id}] Binary relay error to {opponent}: {e}")
    if len(payload) < 20 or payload[0] != 4:
        return
    side = 0 if room.role_of(sender_id) == "p1" else 1
    if room.recorder.record(side, payload) and room.spectators:
        tagged = bytes([8, side]) + payload[:20]  # spectators need to know whose input it is
        for spec_ws in list(room.spectators.values()):
            if not spec_ws.closed:
                try:
                    await spec_ws.send_bytes(tagged)
                except Exception:
                    pass


async def join_room(ws: web.WebSocketResponse, match_id: str, data: dict) -> Tuple[Optional[MatchRoom], Optional[str], Optional[str]]:
    """Handles a join message. Returns (room, player id if they play, spectator connection id if they watch)."""
    identity = identify(data)
    if identity is None:
        await ws.send_str(json.dumps({"type": "auth_failed", "message": "Open the game from Telegram to play."}))
        await ws.close()
        return None, None, None

    room = coordinator.get_or_create_room(
        match_id=match_id,
        chat_id=str(data.get("chat_id", "0")),
        creator_id=identity["id"],
        creator_name=identity["name"],
        create=not auth_required(),  # in production only the bot creates challenges
    )
    deadline = time.monotonic() + NEW_CHALLENGE_WAIT_SECONDS
    while room is None and time.monotonic() < deadline and not ws.closed:
        await asyncio.sleep(0.25)
        room = coordinator.get_or_create_room(match_id, create=False)
    if room is None:
        await ws.send_str(json.dumps({"type": "match_cancelled", "reason": "NOT_FOUND",
                                      "message": "This challenge doesn't exist."}))
        return None, None, None

    player_id = identity["id"]
    user_name = identity["name"]

    if room.is_expired():
        room.status = "CANCELLED"
        room.ended_at = time.time()
        db.cancel_match(match_id, reason="JOIN_TIMEOUT")
    if room.status in ("CANCELLED", "ABANDONED"):
        await ws.send_str(json.dumps({"type": "match_cancelled", "reason": "EXPIRED",
                                      "message": "This challenge is over. Please create a new one."}))
        return None, None, None

    # Development only (no Telegram identity): a second tab with the creator's id plays the other side
    if not auth_required() and player_id == room.creator_id and room.status == "WAITING" and room.opponent_id is None:
        existing = room.sockets.get(room.creator_id)
        if existing is not None and existing is not ws and not existing.closed:
            player_id = f"{player_id}_p2_{uuid.uuid4().hex[:4]}"
            user_name = f"{user_name} (P2)"

    # The first person other than the creator to open an open challenge takes the opponent seat
    if room.status == "WAITING" and room.opponent_id is None and player_id != room.creator_id:
        room.opponent_id = player_id
        room.opponent_name = user_name
        logging.info(f"[{match_id}] {user_name} ({player_id}) accepted the challenge.")

    if not room.is_participant(player_id):
        # Everyone else watches
        spectator_id = uuid.uuid4().hex[:8]
        room.spectators[spectator_id] = ws
        await ws.send_str(json.dumps({
            "type": "joined", "role": "spectator", "build_version": build_version(),
            "player_id": player_id, "player_name": user_name, "match_id": match_id, "status": room.status,
            "creator": {"id": room.creator_id, "name": room.creator_name},
            "opponent": {"id": room.opponent_id, "name": room.opponent_name} if room.opponent_id else None,
        }))
        if room.status == "COMPLETED" and room.result:
            await ws.send_str(json.dumps(room.result))
        elif room.status == "ACTIVE" and room.bout_ready() and room.recorder.segments:
            await ws.send_str(json.dumps(coordinator.spectate_message(room)))
        await room.broadcast({"type": "spectators", "count": len(room.spectators)})
        return room, None, spectator_id

    room.player_names[player_id] = user_name
    if identity.get("chat_instance") and room.chat_id == "inline" and not room.chat_instance:
        room.chat_instance = identity["chat_instance"]
        db.set_match_chat_instance(match_id, room.chat_instance)

    # A rejoin can arrive before the server noticed the old socket drop; that socket is replaced
    old_ws = room.sockets.get(player_id)
    if old_ws is not None and old_ws is not ws and not old_ws.closed:
        room.sockets.pop(player_id, None)
        await old_ws.close()
    room.sockets[player_id] = ws
    room.away.discard(player_id)
    room.bout_live[player_id] = bool(data.get("bout_live"))
    coordinator.cancel_forfeit(room, player_id)

    await ws.send_str(json.dumps({
        "type": "joined",
        "role": room.role_of(player_id),
        "build_version": build_version(),
        "player_id": player_id,
        "player_name": user_name,
        "match_id": match_id,
        "chat_id": room.chat_id,
        "status": room.status,
        "creator": {"id": room.creator_id, "name": room.creator_name},
        "opponent": {"id": room.opponent_id, "name": room.opponent_name} if room.opponent_id else None,
        "spectators": len(room.spectators),
    }))

    if room.status == "COMPLETED":
        if room.result:
            await ws.send_str(json.dumps(room.result))
        return room, player_id, None

    if room.status == "WAITING":
        if room.both_connected():
            await coordinator.activate(room)
        else:
            await coordinator.send_waiting(room)
            # The creator isn't here: tell them someone accepted (once per accepting player)
            if player_id == room.opponent_id and room.notified_creator_of != player_id:
                room.notified_creator_of = player_id
                coordinator.notify("challenge_accepted", room)
        return room, player_id, None

    # ACTIVE: every join now is a player coming back (or arriving after a server restart)
    other = room.other_participant(player_id)
    if other in room.sockets:
        logging.info(f"[{match_id}] Player {player_id} ({user_name}) reconnected!")
        await room.send_to(other, {
            "type": "opponent_reconnected",
            "player_id": player_id,
            "player_name": user_name,
            "message": f"⚡ {user_name} has reconnected! Resuming battle."
        })
        await room.broadcast_spectators({"type": "player_back", "player_id": player_id})

    if room.bout_ready():
        # This phone gets the fight setup back; both phones restart the bout once both are here
        await room.send_to(player_id, {**room.versus_payload(), "resume": True})
        if room.both_connected():
            await coordinator.restart_bout(room, player_id)
    elif room.both_connected():
        if room.heroes_locked():
            await coordinator.start_bout(room)
        else:
            await coordinator.start_hero_select(room, only=None if room.restored else player_id)
    if not room.both_connected() and other:
        await coordinator.start_forfeit(room, other)
    if room.both_connected():
        room.restored = False
    return room, player_id, None


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

    current_player_id: Optional[str] = None  # set for the two players
    spectator_id: Optional[str] = None        # set for anyone watching
    room: Optional[MatchRoom] = None

    try:
        async for msg in ws:
            if msg.type == WSMsgType.BINARY:
                if room and current_player_id and room.status in ("ACTIVE", "COMPLETED"):
                    await relay_input(room, current_player_id, msg.data)
                continue
            if msg.type == WSMsgType.ERROR:
                logging.warning(f"WebSocket connection closed with error: {ws.exception()}")
                continue
            if msg.type != WSMsgType.TEXT:
                continue
            try:
                data = json.loads(msg.data)
            except Exception:
                continue
            if not isinstance(data, dict):
                continue
            msg_type = data.get("type")

            # -------------------------------------------------------------
            # 1. JOIN: player, accepting player, or spectator (one join per connection)
            # -------------------------------------------------------------
            if msg_type == "join":
                if room is None:
                    room, current_player_id, spectator_id = await join_room(ws, match_id, data)
                continue

            # -------------------------------------------------------------
            # HEARTBEAT / PING-PONG (anyone)
            # -------------------------------------------------------------
            if msg_type == "ping":
                await ws.send_str(json.dumps({"type": "pong", "time": data.get("time")}))
                continue

            if room is None or current_player_id is None:
                continue  # everything below is for the two players
            player = current_player_id
            other = room.other_participant(player)

            # -------------------------------------------------------------
            # 2. HERO SELECTION & LOCK-IN (first lock fights as P1 on the left)
            # -------------------------------------------------------------
            if msg_type in ("hero_lock", "select_hero"):
                # Locks count until both heroes are in (a late lock, e.g. from a reloaded page, is ignored)
                if room.status not in ("WAITING", "ACTIVE") or room.heroes_locked():
                    continue
                try:
                    hero_id = int(data.get("hero_id", 0))
                except (TypeError, ValueError):
                    continue
                if not 0 <= hero_id < len(HERO_NAMES):
                    continue
                control = 0 if data.get("control") == 0 else 1
                player_name = room.player_names.get(player, "Player")
                if room.p1_id is None or room.p1_id == player:
                    room.p1_id, room.p1_name, room.p1_hero, room.p1_control = player, player_name, hero_id, control
                    from_role = "p1"
                else:
                    room.p2_id, room.p2_name, room.p2_hero, room.p2_control = player, player_name, hero_id, control
                    from_role = "p2"

                logging.info(f"[{match_id}] Player {from_role} ({player_name}, id={player}) locked hero {hero_id} (P1={room.p1_hero}, P2={room.p2_hero})")
                await room.broadcast({
                    "type": "peer_hero_lock",
                    "from_role": from_role,
                    "assigned_role": from_role,
                    "player_id": player,
                    "player_name": player_name,
                    "hero_id": hero_id
                }, spectators=False)

                if room.heroes_locked() and room.status == "ACTIVE" and room.both_connected():
                    await coordinator.start_bout(room)

            # -------------------------------------------------------------
            # 3. ROUND SCORE: both phones run the same fight and must agree on it
            # -------------------------------------------------------------
            elif msg_type == "round_score":
                if room.status == "ACTIVE" and room.bout_ready():
                    try:
                        score = (max(0, min(3, int(data.get("p1", 0)))), max(0, min(3, int(data.get("p2", 0)))))
                    except (TypeError, ValueError):
                        continue
                    room.score_reports[player] = score
                    await coordinator.settle_rounds(room)

            # -------------------------------------------------------------
            # 4. LEAVING THE APP WITHOUT DISCONNECTING (minimised, phone call...)
            # -------------------------------------------------------------
            elif msg_type == "away":
                if room.status == "ACTIVE" and player not in room.away:
                    room.away.add(player)
                    await coordinator.start_forfeit(room, player, away=True)

            elif msg_type == "back":
                if player in room.away:
                    room.away.discard(player)
                    coordinator.cancel_forfeit(room, player)
                    if room.status == "ACTIVE" and other in room.sockets:
                        await room.send_to(other, {"type": "opponent_back", "player_id": player})
                    await room.broadcast_spectators({"type": "player_back", "player_id": player})

            # -------------------------------------------------------------
            # 5. REMATCH (both players ask; the server opens a new match for the same pair)
            # -------------------------------------------------------------
            elif msg_type == "rematch_request":
                await coordinator.request_rematch(room, player)

            # -------------------------------------------------------------
            # 6. LOCKSTEP NETWORK STATS (how a bout runs on each phone, for diagnosing lag)
            # -------------------------------------------------------------
            elif msg_type == "net_stats":
                record_net_stats(match_id, room.role_of(player), data)

            # -------------------------------------------------------------
            # 7. WEBRTC P2P SIGNALING (SDP Offer/Answer & ICE Candidates), between the two players only
            # -------------------------------------------------------------
            elif msg_type == "rtc_signal":
                if other:
                    await room.send_to(other, {"type": "rtc_signal", "from_role": room.role_of(player),
                                               "signal": data.get("signal")})

            # -------------------------------------------------------------
            # 8. BOUT RESTART (the state both phones restart the bout from)
            # -------------------------------------------------------------
            elif msg_type == "state_snapshot":
                if room.status != "ACTIVE" or not room.bout_ready():
                    continue
                try:
                    segment = int(data.get("segment"))
                except (TypeError, ValueError):
                    continue
                resume = clean_resume(data.get("resume"))
                if resume is None or (segment <= room.segment and room.recorder.segments):
                    continue  # malformed, or an older restart
                coordinator.begin_segment(room, segment, resume)
                if other:
                    await room.send_to(other, {"type": "state_snapshot", "segment": segment, "resume": resume,
                                               "from_role": room.role_of(player)})
                await room.broadcast_spectators(coordinator.spectate_message(room))

    finally:
        if room and spectator_id:
            room.spectators.pop(spectator_id, None)
            await room.broadcast({"type": "spectators", "count": len(room.spectators)})
        elif room and current_player_id:
            await coordinator.handle_player_disconnect(room, current_player_id, ws)

    return ws


# =========================================================================
# REST API ENDPOINTS
# =========================================================================

PUBLIC_MATCH_FIELDS = ("match_id", "status", "creator_name", "opponent_name", "winner_id", "finish_reason",
                       "created_at", "expires_at", "started_at", "ended_at", "rematch_of")


def int_query(request: web.Request, name: str, default: int, low: int, high: int) -> int:
    try:
        return max(low, min(high, int(request.query.get(name, default))))
    except ValueError:
        return default


async def api_get_match(request: web.Request) -> web.Response:
    """Returns a match's public details."""
    match = db.get_match(request.match_info.get("match_id"))
    if not match:
        return web.json_response({"status": "error", "message": "Match not found"}, status=404)
    return web.json_response({"status": "ok", "match": {k: match.get(k) for k in PUBLIC_MATCH_FIELDS}})


async def api_get_replay(request: web.Request) -> web.Response:
    """A finished match's recorded inputs, which the game plays back deterministically."""
    data = db.get_replay(request.match_info.get("match_id"))
    if not data:
        return web.json_response({"status": "error", "message": "Replay not found"}, status=404)
    return web.json_response({"status": "ok", "replay": json.loads(zlib.decompress(data))})


async def api_get_net_stats(request: web.Request) -> web.Response:
    """Recent lockstep stats, newest first; ?match_id= narrows to one match."""
    match_id = request.query.get("match_id")
    limit = int_query(request, "limit", 50, 1, 500)
    entries = [e for e in reversed(net_stats_log) if not match_id or e["match_id"] == match_id]
    return web.json_response({"status": "ok", "stats": entries[:limit]})


async def api_get_leaderboard(request: web.Request) -> web.Response:
    """Returns local group leaderboard."""
    chat_id = request.query.get("chat_id", "0")
    lb = db.get_local_leaderboard(chat_id, limit=int_query(request, "limit", 10, 1, 100))
    return web.json_response({"status": "ok", "chat_id": chat_id, "leaderboard": lb})


async def api_health(request: web.Request) -> web.Response:
    """Liveness for the deploy, which waits for active_matches to reach 0 before restarting the server."""
    return web.json_response({"status": "ok", "build": build_version(), "active_matches": coordinator.active_match_count()})


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


SWEEPER_KEY = web.AppKey("sweeper", asyncio.Task)


async def _start_sweeper(app: web.Application):
    app[SWEEPER_KEY] = asyncio.create_task(coordinator.sweep_forever())


async def _stop_sweeper(app: web.Application):
    task = app.get(SWEEPER_KEY)
    if task:
        task.cancel()


def create_app() -> web.Application:
    app = web.Application(middlewares=[cors_middleware])

    # WebSocket Route
    app.router.add_get("/ws/match/{match_id}", websocket_handler)

    # REST API Routes
    app.router.add_get("/api/match/{match_id}", api_get_match)
    app.router.add_get("/api/replay/{match_id}", api_get_replay)
    app.router.add_get("/api/leaderboard", api_get_leaderboard)
    app.router.add_get("/api/netstats", api_get_net_stats)
    app.router.add_get("/api/health", api_health)

    # Static player files & docs (for local development; production serves them from nginx)
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    player_dir = os.path.join(root_dir, "player")
    docs_dir = os.path.join(root_dir, "docs")

    async def index_redirect(request):
        raise web.HTTPFound("/player/index.html")

    app.router.add_get("/", index_redirect)
    app.router.add_static("/player/", path=player_dir, show_index=False)
    app.router.add_static("/docs/", path=docs_dir, show_index=False)

    app.on_startup.append(_start_sweeper)
    app.on_cleanup.append(_stop_sweeper)
    return app


if __name__ == "__main__":
    app = create_app()
    web.run_app(app, host="0.0.0.0", port=8080)
