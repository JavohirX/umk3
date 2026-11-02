/**
 * Immortal Combat - Real-time Telegram Multiplayer Network Bridge
 * Handles WebSocket connection, matchmaking lobby, 60s join timer,
 * 60s disconnect grace period, input transmission, autowin resolution,
 * and local group leaderboards.
 */

export class MultiplayerClient {
    constructor() {
        this.ws = null;
        this.matchId = null;
        this.chatId = "0";
        this.userId = null;
        this.userName = "Fighter";
        this.role = null; // 'p1' or 'p2'
        this.status = "DISCONNECTED"; // HERO_SELECT, ACTIVE, COMPLETED, CANCELLED
        this.opponent = null;
        this.creator = null;
        this.inputSeq = 0;
        this.onPeerInputCallback = null;
        this.onMatchStartCallback = null;
        this.onHeroSelectStartCallback = null;
        this.onPeerHeroLockCallback = null;
        this.onVersusStartCallback = null;
        this.onRoundNextCallback = null;
        this.onMatchEndedCallback = null;
        this.onPeerSyncCallback = null;
        this.onPeerRejoinedCallback = null;
        this.onPeerSnapshotCallback = null;
        this.isMultiplayer = false;
        this._boutLive = false;
        this._heroSelected = false;
        this._heroId = null;
        this.opponentDropDeadline = 0; // Date.now() when the opponent's 60s reconnect grace runs out; 0 while connected
        this.result = null; // match_ended packet once the bout is decided
        // The bout is frozen while either side is offline, so nobody can beat an idle fighter
        this.waitingForPeer = false; // opponent dropped, or rejoined and is still loading back in
        this.selfOffline = false;

        // Ultra-low-latency WebRTC P2P DataChannel & Latency Monitoring
        this.rtcPeer = null;
        this.dataChannel = null;
        this.isP2PActive = false;
        this.pingInterval = null;
        this.rtt = 0;
        this.outgoingQueue = [];

        this.parseEnvironment();
    }

    parseEnvironment() {
        // 1. Extract from Telegram WebApp initData if running inside Telegram
        const tg = window.Telegram?.WebApp;
        let authenticatedUser = null;
        if (tg?.initDataUnsafe?.user) {
            authenticatedUser = {
                id: String(tg.initDataUnsafe.user.id),
                name: tg.initDataUnsafe.user.first_name || tg.initDataUnsafe.user.username || "Fighter"
            };
        }

        // 2. Extract matchId from URL search params OR hash fragment
        this.matchId = this.extractMatchId();

        const searchParams = new URLSearchParams(window.location.search);
        if (searchParams.get('chat')) this.chatId = String(searchParams.get('chat'));
        if (searchParams.get('chat_id')) this.chatId = String(searchParams.get('chat_id'));

        // Check hash for chat_id if not in search params
        if (window.location.hash && window.location.hash.includes('=')) {
            const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
            if (hashParams.get('chat')) this.chatId = String(hashParams.get('chat'));
            if (hashParams.get('chat_id')) this.chatId = String(hashParams.get('chat_id'));
        }

        if (authenticatedUser) {
            this.userId = authenticatedUser.id;
            this.userName = authenticatedUser.name;
        }

        // Fallback unique session credentials for testing outside Telegram (isolated per tab)
        if (!this.userId) {
            let sessionUserId = sessionStorage.getItem('ic_session_user_id');
            if (!sessionUserId) {
                sessionUserId = 'fighter_' + Math.floor(100000 + Math.random() * 900000);
                sessionStorage.setItem('ic_session_user_id', sessionUserId);
            }
            this.userId = sessionUserId;
            this.userName = 'Fighter #' + this.userId.slice(-4);
        }

        if (this.matchId) {
            this.isMultiplayer = true;
            console.log(`[Multiplayer] Detected match ID: ${this.matchId}, User: ${this.userId} (${this.userName})`);
        }
    }

    extractMatchId() {
        const tg = window.Telegram?.WebApp;
        let match = null;

        // A. Telegram WebApp start_param
        const tgParam = tg?.initDataUnsafe?.start_param;
        if (tgParam) {
            match = tgParam.replace(/^(challenge_|match_)/, '').trim();
            if (match) return match;
        }

        // B. URL Search Query (?match=... or ?startapp=...)
        const searchParams = new URLSearchParams(window.location.search);
        const searchStart = searchParams.get('tgWebAppStartParam') || searchParams.get('startapp');
        if (searchStart) {
            match = searchStart.replace(/^(challenge_|match_)/, '').trim();
            if (match) return match;
        }
        if (searchParams.get('match')) return searchParams.get('match').trim();
        if (searchParams.get('match_id')) return searchParams.get('match_id').trim();

        // C. URL Hash fragment (#match=... or #abc123 or #challenge_abc123)
        if (window.location.hash) {
            const rawHash = window.location.hash.replace(/^#/, '').trim();
            if (rawHash) {
                if (rawHash.includes('=')) {
                    const hashParams = new URLSearchParams(rawHash);
                    const hashStart = hashParams.get('tgWebAppStartParam') || hashParams.get('startapp');
                    if (hashStart) {
                        match = hashStart.replace(/^(challenge_|match_)/, '').trim();
                        if (match) return match;
                    }
                    if (hashParams.get('match')) return hashParams.get('match').trim();
                    if (hashParams.get('match_id')) return hashParams.get('match_id').trim();
                }
                match = rawHash.replace(/^(challenge_|match_)/, '').trim();
                if (match && /^[a-zA-Z0-9_-]+$/.test(match)) {
                    return match;
                }
            }
        }

        return null;
    }

    initUI() {
        if (this.isMultiplayer) {
            this.connect();
        }
    }

    connect() {
        if (!this.matchId) return;

        const searchParams = new URLSearchParams(window.location.search);
        let hostOverride = searchParams.get('server') || searchParams.get('ws');

        if (!hostOverride && window.location.hash && window.location.hash.includes('=')) {
            const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
            hostOverride = hashParams.get('server') || hashParams.get('ws');
        }

        let host = hostOverride;
        if (!host) {
            // When hosted on GitHub Pages static CDN, route WebSocket traffic to production VPS gateway
            if (window.location.host.includes('github.io')) {
                host = '193.36.236.221.sslip.io';
            } else {
                host = window.location.host;
            }
        }

        const protocol = (window.location.protocol === 'https:' || host.includes('sslip.io')) ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${host}/ws/match/${this.matchId}`;

        console.log(`[Multiplayer] Connecting to ${wsUrl}...`);

        try {
            this.ws = new WebSocket(wsUrl);
            this.ws.binaryType = "arraybuffer"; // Zero-copy binary transport
        } catch (e) {
            console.error("[Multiplayer] WebSocket creation error:", e);
            setTimeout(() => {
                if (this.shouldReconnect()) this.connect();
            }, 3000);
            return;
        }

        this.ws.onopen = () => {
            console.log("[Multiplayer] WebSocket connected. Sending join packet...");
            this.sendPacket({
                type: "join",
                match_id: this.matchId,
                chat_id: this.chatId,
                user_id: this.userId,
                user_name: this.userName
            });

            while (this.outgoingQueue.length > 0) {
                const pkt = this.outgoingQueue.shift();
                if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                    this.ws.send(JSON.stringify(pkt));
                }
            }

            // Start latency monitoring ping every 5 seconds
            clearInterval(this.pingInterval);
            this.pingInterval = setInterval(() => {
                if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                    this.sendPacket({ type: "ping", time: performance.now() });
                }
            }, 5000);
        };

        this.ws.onmessage = (event) => {
            if (event.data instanceof ArrayBuffer) {
                this.handleBinaryPacket(event.data);
            } else {
                try {
                    const data = JSON.parse(event.data);
                    this.handlePacket(data);
                } catch (err) {
                    console.error("[Multiplayer] Packet parse error:", err);
                }
            }
        };

        this.ws.onclose = () => {
            console.log("[Multiplayer] WebSocket closed.");
            clearInterval(this.pingInterval);
            this.resetP2P();
            if (this._boutLive && this.status === "ACTIVE") {
                this.selfOffline = true;
            }

            if (this.shouldReconnect()) {
                setTimeout(() => {
                    if (this.shouldReconnect()) this.connect();
                }, 2000);
            }
        };

        this.ws.onerror = (err) => {
            console.error("[Multiplayer] WebSocket error:", err);
        };
    }

    // Keep retrying through hero select and the bout so the server's 60s grace can resume us
    shouldReconnect() {
        return this.isMultiplayer && this.status !== "COMPLETED" && this.status !== "CANCELLED";
    }

    resetP2P() {
        if (this.rtcPeer) {
            try { this.rtcPeer.close(); } catch (_) {}
            this.rtcPeer = null;
        }
        this.dataChannel = null;
        this.isP2PActive = false;
    }

    get paused() {
        return this.waitingForPeer || this.selfOffline;
    }

    handleBinaryPacket(buffer) {
        if (!buffer || buffer.byteLength < 4) return;
        const view = new DataView(buffer);
        const packetType = view.getUint8(0);

        if (packetType === 3 && buffer.byteLength >= 8) { // 0x03: PACKET_INPUT_BITS
            const isDown = view.getUint8(1) === 1;
            const bits = view.getUint32(4);
            if (typeof this.onPeerInputCallback === 'function') {
                this.onPeerInputCallback(bits, isDown);
            }
        } else if (packetType === 2 && buffer.byteLength >= 11) { // 0x02: PACKET_SYNC
            const p1Hp = view.getUint8(1);
            const p2Hp = view.getUint8(2);
            const p1X = view.getInt16(3);
            const p2X = view.getInt16(5);
            const roundTimer = view.getInt32(7);
            if (typeof this.onPeerSyncCallback === 'function') {
                this.onPeerSyncCallback({
                    p1_hp: p1Hp,
                    p2_hp: p2Hp,
                    p1_x: p1X,
                    p2_x: p2X,
                    round_timer: roundTimer
                });
            }
        }
    }

    // =========================================================================
    // WEBRTC P2P DATACHANNEL (UDP-BASED ZERO SERVER BOUNCE TRANSPORT)
    // =========================================================================

    async initWebRTC(isInitiator) {
        if (typeof RTCPeerConnection === 'undefined') return;
        if (this.rtcPeer) {
            try { this.rtcPeer.close(); } catch (_) {}
            this.rtcPeer = null;
        }

        try {
            const config = {
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:stun1.l.google.com:19302' },
                    { urls: 'stun:stun2.l.google.com:19302' }
                ]
            };
            this.rtcPeer = new RTCPeerConnection(config);

            this.rtcPeer.onicecandidate = (event) => {
                if (event.candidate) {
                    this.sendPacket({
                        type: "rtc_signal",
                        signal: { type: "candidate", candidate: event.candidate.toJSON() }
                    });
                }
            };

            if (isInitiator) {
                // Ordered and reliable: inputs are press/release events, so a lost release would leave a key held
                const dc = this.rtcPeer.createDataChannel("combat_input", { ordered: true });
                this.setupDataChannel(dc);

                const offer = await this.rtcPeer.createOffer();
                await this.rtcPeer.setLocalDescription(offer);
                this.sendPacket({
                    type: "rtc_signal",
                    signal: { type: "offer", sdp: offer }
                });
            } else {
                this.rtcPeer.ondatachannel = (event) => {
                    this.setupDataChannel(event.channel);
                };
            }
        } catch (err) {
            console.warn("[Multiplayer] WebRTC setup error, will use WebSocket relay:", err);
        }
    }

    async handleRtcSignal(signal) {
        if (!signal) return;
        // Every offer starts a fresh negotiation, replacing any peer left over from before a reconnect
        if (signal.type === "offer") {
            await this.initWebRTC(false);
        }
        if (!this.rtcPeer) return;

        try {
            if (signal.type === "offer") {
                await this.rtcPeer.setRemoteDescription(new RTCSessionDescription(signal.sdp));
                const answer = await this.rtcPeer.createAnswer();
                await this.rtcPeer.setLocalDescription(answer);
                this.sendPacket({
                    type: "rtc_signal",
                    signal: { type: "answer", sdp: answer }
                });
            } else if (signal.type === "answer") {
                await this.rtcPeer.setRemoteDescription(new RTCSessionDescription(signal.sdp));
            } else if (signal.type === "candidate" && signal.candidate) {
                await this.rtcPeer.addIceCandidate(new RTCIceCandidate(signal.candidate));
            }
        } catch (err) {
            console.warn("[Multiplayer] Failed to process RTC signal:", err);
        }
    }

    setupDataChannel(dc) {
        if (!dc) return;
        this.dataChannel = dc;
        dc.binaryType = "arraybuffer";

        // A channel replaced after a reconnect must not flip the state of its successor
        dc.onopen = () => {
            if (this.dataChannel !== dc) return;
            console.log("[Multiplayer] ⚡ WebRTC P2P DataChannel OPEN! Direct low-latency UDP combat active.");
            this.isP2PActive = true;
        };

        dc.onclose = () => {
            if (this.dataChannel !== dc) return;
            console.log("[Multiplayer] WebRTC DataChannel closed. Falling back to WebSocket relay.");
            this.isP2PActive = false;
        };

        dc.onerror = (err) => {
            if (this.dataChannel !== dc) return;
            console.warn("[Multiplayer] WebRTC DataChannel error:", err);
            this.isP2PActive = false;
        };

        dc.onmessage = (event) => {
            if (event.data instanceof ArrayBuffer) {
                this.handleBinaryPacket(event.data);
            }
        };
    }

    sendPacket(data) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        } else {
            console.log("[Multiplayer] Queuing packet until connected:", data.type);
            this.outgoingQueue.push(data);
        }
    }

    // Streams the engine's keypad mask change (not the raw key) so the peer feeds it straight to our fighter
    sendInput(bits, isDown) {
        if (!this.isMultiplayer || this.status !== "ACTIVE") return;
        this.inputSeq = (this.inputSeq + 1) & 0xFF;

        // 8-byte binary payload: [0x03, isDown, seq, 0, bits (uint32)]
        const buffer = new ArrayBuffer(8);
        const view = new DataView(buffer);
        view.setUint8(0, 3);
        view.setUint8(1, isDown ? 1 : 0);
        view.setUint8(2, this.inputSeq);
        view.setUint32(4, bits >>> 0);

        // 1. Direct WebRTC P2P DataChannel (0ms server bounce, UDP transport)
        if (this.isP2PActive && this.dataChannel && this.dataChannel.readyState === "open") {
            try {
                this.dataChannel.send(buffer);
                return;
            } catch (_) {
                this.isP2PActive = false;
            }
        }

        // 2. Binary WebSocket relay (TCP_NODELAY enabled). While disconnected, presses are
        // dropped rather than queued so a reconnect does not replay stale inputs to the peer.
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            try {
                this.ws.send(buffer);
            } catch (_) {}
        }
    }

    sendSync(p1Hp, p2Hp, p1X, p2X, roundTimer) {
        if (!this.isMultiplayer || this.status !== "ACTIVE") return;

        const buffer = new ArrayBuffer(11);
        const view = new DataView(buffer);
        view.setUint8(0, 2); // 0x02: PACKET_SYNC
        view.setUint8(1, Math.max(0, Math.min(100, Math.round(p1Hp || 0))));
        view.setUint8(2, Math.max(0, Math.min(100, Math.round(p2Hp || 0))));
        view.setInt16(3, Math.round(p1X || 0));
        view.setInt16(5, Math.round(p2X || 0));
        view.setInt32(7, Math.round(roundTimer || 0));

        if (this.isP2PActive && this.dataChannel && this.dataChannel.readyState === "open") {
            try {
                this.dataChannel.send(buffer);
                return;
            } catch (_) {
                this.isP2PActive = false;
            }
        }

        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            try {
                this.ws.send(buffer);
            } catch (_) {}
        }
    }

    // controlType is the engine's val_int_bw, so both phones give our fighter the same key layout
    sendHeroLock(heroId, controlType) {
        this.sendPacket({ type: "hero_lock", hero_id: heroId, control: controlType });
    }

    sendRoundWin(winnerRole) {
        if (!this.isMultiplayer || this.status !== "ACTIVE") return;
        this.sendPacket({ type: "round_win", winner_role: winnerRole });
    }

    // Fighter state for an opponent who reloaded mid-bout and is loading back in
    sendSnapshot(snapshot) {
        this.sendPacket({ type: "state_snapshot", ...snapshot });
    }

    // Our side of the bout is live again; the opponent can unfreeze
    sendBoutReady() {
        this.selfOffline = false;
        this.sendPacket({ type: "bout_ready" });
    }

    handlePacket(data) {
        switch (data.type) {
            case "joined": {
                // Version handshake — hard-reload if client is stale
                const CURRENT_BUILD = "5dc4ec3";
                if (data.build_version && data.build_version !== CURRENT_BUILD) {
                    console.warn(`[Version Mismatch] Server=${data.build_version} Client=${CURRENT_BUILD}. Hard reloading...`);
                    window.location.replace(window.location.pathname + "?_ts=" + Date.now());
                    return;
                }
                this.role = data.role;
                // The server renames a second tab that reuses the creator's id; match on what it assigned
                if (data.player_id) this.userId = data.player_id;
                this.creator = data.creator;
                this.opponent = data.opponent;
                console.log(`[Multiplayer] Joined as role: ${this.role}. Match status: ${data.status}`);
                // Rejoining a running match as P1: we own the WebRTC offer
                if (this.role === "p1" && data.status === "ACTIVE") {
                    this.initWebRTC(true);
                }
                break;
            }

            case "match_start":
                this.creator = data.p1;
                this.opponent = data.p2;
                if (this.role === "p1" && !this.rtcPeer) {
                    this.initWebRTC(true);
                }
                if (data.stage === "hero_select") {
                    this.status = "HERO_SELECT";
                    this._heroSelected = false;
                    this._heroId = null;
                    this._boutLive = false;
                    this.result = null;
                    console.log("[Multiplayer] Match ACTIVE! Entering native Character Selection.");
                    if (typeof this.onHeroSelectStartCallback === 'function') {
                        this.onHeroSelectStartCallback(data);
                    }
                } else {
                    this.status = "ACTIVE";
                    if (typeof this.onMatchStartCallback === 'function') {
                        this.onMatchStartCallback(data);
                    }
                }
                break;

            case "peer_hero_lock":
                console.log(`[Multiplayer] Hero locked: ${data.hero_id} by ${data.player_id} (assigned role: ${data.from_role || data.assigned_role})`);
                if (data.player_id === this.userId) {
                    this.role = data.from_role || data.assigned_role;
                    console.log(`[Multiplayer] Confirmed role assignment: I am ${this.role.toUpperCase()}`);
                } else if ((data.from_role || data.assigned_role) === "p1") {
                    // Opponent took the left side first, so we fight as P2 even before locking
                    this.role = "p2";
                }
                if (typeof this.onPeerHeroLockCallback === 'function') {
                    this.onPeerHeroLockCallback(data);
                }
                break;

            case "versus_start":
                this.status = "ACTIVE";
                this.role = (data.p1.id === this.userId) ? "p1" : "p2";
                this.opponent = (this.role === "p1") ? data.p2 : data.p1;
                this.creator = data.p1;
                console.log(`[Multiplayer] Fight starting: P1=${data.p1.hero_id}, P2=${data.p2.hero_id}. Local role=${this.role}`);
                if (this.role === "p1" && !this.isP2PActive && !this.rtcPeer) {
                    this.initWebRTC(true);
                }
                if (typeof this.onVersusStartCallback === 'function') {
                    this.onVersusStartCallback(data.p1.hero_id, data.p2.hero_id, data);
                }
                break;

            case "round_next":
                console.log(`[Multiplayer] Starting Round ${data.round_num}! Scores: P1=${data.p1_rounds}, P2=${data.p2_rounds}`);
                if (typeof this.onRoundNextCallback === 'function') {
                    this.onRoundNextCallback(data);
                }
                break;

            case "peer_input":
                if (typeof this.onPeerInputCallback === 'function') {
                    this.onPeerInputCallback(data.key, data.down);
                }
                break;

            case "peer_sync":
                if (typeof this.onPeerSyncCallback === 'function') {
                    this.onPeerSyncCallback(data);
                }
                break;

            case "rtc_signal":
                this.handleRtcSignal(data.signal);
                break;

            case "pong":
                if (data.time) {
                    this.rtt = Math.max(1, Math.round(performance.now() - data.time));
                }
                break;

            case "opponent_disconnected":
                // Their end of the DataChannel is gone; relay inputs until a fresh one is negotiated
                this.resetP2P();
                this.opponentDropDeadline = Date.now() + (data.remaining_seconds || 60) * 1000;
                this.waitingForPeer = this._boutLive;
                break;

            case "disconnect_countdown":
                if (this.opponentDropDeadline) {
                    this.opponentDropDeadline = Date.now() + data.remaining_seconds * 1000;
                }
                break;

            case "opponent_reconnected":
                this.opponentDropDeadline = 0;
                console.log("[Multiplayer] Opponent reconnected. Battle resumed.");
                // A staying P1 owns the WebRTC offer; a rejoining P1 starts it from "joined" instead
                if (this.role === "p1") {
                    this.initWebRTC(true);
                }
                // Stay frozen until they send bout_ready; hand them our view of the fight in case they reloaded
                if (this._boutLive && typeof this.onPeerRejoinedCallback === 'function') {
                    this.onPeerRejoinedCallback(data);
                }
                break;

            case "state_snapshot":
                if (typeof this.onPeerSnapshotCallback === 'function') {
                    this.onPeerSnapshotCallback(data);
                }
                break;

            case "bout_ready":
                this.waitingForPeer = false;
                break;

            case "match_ended":
                this.status = "COMPLETED";
                this.opponentDropDeadline = 0;
                this.waitingForPeer = false;
                this.selfOffline = false;
                this.result = data;
                console.log("[Multiplayer] Match ended! Winner:", data.winner_name);
                if (typeof this.onMatchEndedCallback === 'function') {
                    this.onMatchEndedCallback(data);
                }
                break;

            case "match_cancelled":
                this.status = "CANCELLED";
                console.warn("[Multiplayer] Match cancelled:", data.message);
                break;
        }
    }

    // Status line the game loop draws on the canvas (no DOM overlays), or null when there is nothing to say
    bannerText() {
        if (this.status === "COMPLETED" && this.result) {
            if (!this.result.winner_id) return "DRAW";
            if (this.result.winner_id !== this.userId) return "DEFEAT";
            return this.result.reason === "AUTOWIN_DISCONNECT" ? "VICTORY - OPPONENT FORFEITED" : "VICTORY!";
        }
        if (this.status === "CANCELLED") return "CHALLENGE EXPIRED - START A NEW ONE";
        if (this.selfOffline) return "CONNECTION LOST - RECONNECTING...";
        if (this.opponentDropDeadline) {
            const secs = Math.max(0, Math.ceil((this.opponentDropDeadline - Date.now()) / 1000));
            return `OPPONENT DISCONNECTED - AUTOWIN IN ${secs}s`;
        }
        if (this.waitingForPeer) return "OPPONENT REJOINING...";
        if (this.status === "HERO_SELECT" && this._heroSelected) {
            const roleText = this.role ? `[${this.role.toUpperCase()}] ` : '';
            return `${roleText}HERO LOCKED - WAITING FOR OPPONENT...`;
        }
        return null;
    }
}
