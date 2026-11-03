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
        this.onPeerInputCallback = null; // (segment, tick, pressed, released, delayHint, hintSeq, senderTick) per lockstep tick
        this.onMatchStartCallback = null;
        this.onHeroSelectStartCallback = null;
        this.onPeerHeroLockCallback = null;
        this.onVersusStartCallback = null;
        this.onRoundNextCallback = null;
        this.onMatchEndedCallback = null;
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
        this.pendingCandidates = []; // opponent candidates waiting for their offer/answer to be applied
        this.rtcSignalQueue = null;
        this.ice = null; // direct-connection diagnostics, see iceSummary()
        this.pingInterval = null;
        this.rtt = 0;
        this.peerPingInterval = null;
        this.peerPingId = 0;
        this.peerPingSentAt = new Map();
        this.peerRttSamples = [];
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

            this.startPeerPing();

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

        if (packetType === 4 && buffer.byteLength >= 20) { // 0x04: PACKET_LOCKSTEP_INPUT
            if (typeof this.onPeerInputCallback === 'function') {
                this.onPeerInputCallback(view.getUint8(1), view.getUint32(4), view.getUint32(8), view.getUint32(12),
                                         view.getInt8(2), view.getUint8(3), view.getUint32(16));
            }
        } else if (packetType === 5) { // 0x05: PEER_PING -> echo it straight back
            view.setUint8(0, 6);
            this.sendBinaryBothPaths(buffer);
        } else if (packetType === 6) { // 0x06: PEER_PONG
            const sentAt = this.peerPingSentAt.get(view.getUint8(1));
            if (sentAt !== undefined) {
                this.peerPingSentAt.delete(view.getUint8(1)); // the copy on the slower path is ignored
                this.peerRttSamples.push(performance.now() - sentAt);
                if (this.peerRttSamples.length > 10) this.peerRttSamples.shift();
            }
        }
    }

    sendBinaryBothPaths(buffer) {
        if (this.isP2PActive && this.dataChannel && this.dataChannel.readyState === "open") {
            try {
                this.dataChannel.send(buffer);
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

    // Round trip to the opponent over the same paths lockstep inputs take (fastest of direct and relay).
    // The ping to the server says nothing about this: relayed inputs cross the server twice.
    startPeerPing() {
        clearInterval(this.peerPingInterval);
        this.peerPingInterval = setInterval(() => {
            if (this.status !== "HERO_SELECT" && this.status !== "ACTIVE") return;
            this.peerPingId = (this.peerPingId + 1) & 0xFF;
            this.peerPingSentAt.set(this.peerPingId, performance.now());
            const buffer = new ArrayBuffer(4);
            new DataView(buffer).setUint8(0, 5);
            new DataView(buffer).setUint8(1, this.peerPingId);
            this.sendBinaryBothPaths(buffer);
        }, 500);
    }

    // A high percentile of recent samples, so occasional jitter doesn't stall the fight; null until measured
    get peerRtt() {
        if (this.peerRttSamples.length < 3) return null;
        const sorted = this.peerRttSamples.slice().sort((x, y) => x - y);
        return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.8))];
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
        this.pendingCandidates = [];
        this.ice = { state: "new", local: {}, remote: {}, failures: this.ice ? this.ice.failures : 0 };

        try {
            const config = {
                iceServers: [
                    { urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'] },
                    { urls: 'stun:stun.cloudflare.com:3478' }
                ]
            };
            const peer = this.rtcPeer = new RTCPeerConnection(config);

            peer.onicecandidate = (event) => {
                if (event.candidate) {
                    this.countCandidate(this.ice.local, event.candidate.candidate);
                    this.sendPacket({
                        type: "rtc_signal",
                        signal: { type: "candidate", candidate: event.candidate.toJSON() }
                    });
                }
            };

            peer.oniceconnectionstatechange = () => {
                if (this.rtcPeer !== peer) return;
                this.ice.state = peer.iceConnectionState;
                // One more try if the direct link can't be established; the relay keeps the fight going meanwhile
                if (peer.iceConnectionState === "failed") {
                    this.ice.failures++;
                    if (isInitiator && this.ice.failures < 2) {
                        setTimeout(() => {
                            if (this.rtcPeer === peer && !this.isP2PActive) this.initWebRTC(true);
                        }, 2000);
                    }
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

    // Signals are processed strictly in arrival order: a candidate handled while the offer or answer before it
    // is still being applied would be rejected and lost, and lost candidates are often the only working path
    handleRtcSignal(signal) {
        if (!signal) return;
        this.rtcSignalQueue = (this.rtcSignalQueue || Promise.resolve())
            .then(() => this.processRtcSignal(signal))
            .catch((err) => console.warn("[Multiplayer] Failed to process RTC signal:", err));
    }

    async processRtcSignal(signal) {
        // Every offer starts a fresh negotiation, replacing any peer left over from before a reconnect
        if (signal.type === "offer") {
            await this.initWebRTC(false);
        }
        const peer = this.rtcPeer;
        if (!peer) return;

        if (signal.type === "offer" || signal.type === "answer") {
            await peer.setRemoteDescription(new RTCSessionDescription(signal.sdp));
            // Candidates that arrived before the description can be applied now
            for (const candidate of this.pendingCandidates.splice(0)) {
                await peer.addIceCandidate(new RTCIceCandidate(candidate));
            }
            if (signal.type === "offer") {
                const answer = await peer.createAnswer();
                await peer.setLocalDescription(answer);
                this.sendPacket({
                    type: "rtc_signal",
                    signal: { type: "answer", sdp: answer }
                });
            }
        } else if (signal.type === "candidate" && signal.candidate) {
            this.countCandidate(this.ice.remote, signal.candidate.candidate);
            if (peer.remoteDescription) {
                await peer.addIceCandidate(new RTCIceCandidate(signal.candidate));
            } else {
                this.pendingCandidates.push(signal.candidate);
            }
        }
    }

    // Tallies candidate types (host = local network, srflx = public address found via STUN, relay = TURN)
    countCandidate(tally, candidateLine) {
        const type = (/ typ (\w+)/.exec(candidateLine || "") || [])[1] || "unknown";
        tally[type] = (tally[type] || 0) + 1;
    }

    // Direct-connection diagnostics for the stats report
    iceSummary() {
        const fmt = (tally) => Object.entries(tally).map(([type, n]) => `${type}:${n}`).join(",") || "none";
        if (!this.ice) return { ice_state: typeof RTCPeerConnection === 'undefined' ? "unsupported" : "not-started" };
        return { ice_state: this.ice.state, ice_local: fmt(this.ice.local), ice_remote: fmt(this.ice.remote), ice_failures: this.ice.failures };
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

    // Our input for one lockstep tick: the key mask bits pressed and released during it, plus our latest
    // advice on the opponent's input delay (+1 their inputs arrive late, -1 they have slack) and its sequence
    // number, so they apply each piece of advice once, and the tick we just simulated, so they can keep pace.
    // 20-byte binary payload: [0x04, segment, hint (int8), hintSeq, tick (uint32), pressed (uint32),
    //                          released (uint32), senderTick (uint32)]
    sendLockstepInput(segment, tick, pressed, released, hint = 0, hintSeq = 0, senderTick = 0) {
        if (!this.isMultiplayer || this.status !== "ACTIVE") return;
        const buffer = new ArrayBuffer(20);
        const view = new DataView(buffer);
        view.setUint8(0, 4);
        view.setUint8(1, segment & 0xFF);
        view.setInt8(2, hint);
        view.setUint8(3, hintSeq & 0xFF);
        view.setUint32(4, tick);
        view.setUint32(8, pressed >>> 0);
        view.setUint32(12, released >>> 0);
        view.setUint32(16, senderTick);

        // Sent on both paths: the peer keeps the first copy of each tick, and the relay still delivers if the
        // direct channel dies silently. A tick that never arrives would freeze both phones.
        this.sendBinaryBothPaths(buffer);
    }

    // controlType is the engine's val_int_bw, so both phones give our fighter the same key layout
    sendHeroLock(heroId, controlType) {
        this.sendPacket({ type: "hero_lock", hero_id: heroId, control: controlType });
    }

    sendRoundWin(winnerRole) {
        if (!this.isMultiplayer || this.status !== "ACTIVE") return;
        this.sendPacket({ type: "round_win", winner_role: winnerRole });
    }

    // Where both phones restart the bout from after the opponent reconnects
    sendSnapshot(snapshot) {
        this.sendPacket({ type: "state_snapshot", ...snapshot });
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
                // Both phones restart the bout from our state; we stay frozen until their inputs arrive
                if (this._boutLive && typeof this.onPeerRejoinedCallback === 'function') {
                    this.onPeerRejoinedCallback(data);
                }
                break;

            case "state_snapshot":
                if (typeof this.onPeerSnapshotCallback === 'function') {
                    this.onPeerSnapshotCallback(data);
                }
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
