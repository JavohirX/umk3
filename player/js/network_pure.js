/**
 * Immortal Combat - Real-time Telegram Multiplayer Network Bridge
 * Handles the WebSocket connection, the open-challenge lobby, hero locks, lockstep input transport
 * (WebRTC DataChannel + WebSocket relay), the reconnect grace period, spectating, rematches and replays.
 */

// How many of our latest inputs every packet on the WebRTC channel carries: a run of lost packets shorter
// than this costs nothing (8 ticks is 133ms)
const INPUT_BUNDLE_TICKS = 8;

// Lobby states the server can end a challenge with, as shown on the canvas banner
const CANCEL_TEXT = {
    JOIN_TIMEOUT: "CHALLENGE EXPIRED - START A NEW ONE",
    EXPIRED: "CHALLENGE EXPIRED - START A NEW ONE",
    NOT_FOUND: "CHALLENGE NOT FOUND - START A NEW ONE",
    ABANDONED: "BOTH FIGHTERS LEFT - MATCH ABANDONED",
};

export class MultiplayerClient {
    constructor() {
        this.ws = null;
        this.matchId = null;
        this.replayId = null; // set when the page plays back a finished match (?replay=<id>)
        this.chatId = "0";
        this.userId = null;
        this.userName = "Fighter";
        this.initData = "";   // Telegram's signed initData; the server verifies who we are from it
        this.role = null; // 'p1', 'p2' or 'spectator'
        this.status = "DISCONNECTED"; // HERO_SELECT, ACTIVE, COMPLETED, CANCELLED, REJECTED, SPECTATING
        this.opponent = null;
        this.creator = null;
        this.onPeerInputCallback = null; // (segment, tick, pressed, released, delayHint, hintSeq, senderTick) per lockstep tick
        this.onPeerHashCallback = null; // (segment, tick, hash): the opponent's simulation fingerprint
        this.onSpectatorInputCallback = null; // (side, segment, tick, pressed, released) for spectators
        this.onMatchStartCallback = null;
        this.onHeroSelectStartCallback = null;
        this.onPeerHeroLockCallback = null;
        this.onVersusStartCallback = null;
        this.onRoundNextCallback = null;
        this.onMatchEndedCallback = null;
        this.onRestartRequestCallback = null;
        this.onPeerSnapshotCallback = null;
        this.onSpectateCallback = null;
        this.onRematchStartCallback = null;
        this.boutLiveProvider = null; // () => whether this phone still runs the bout (sent when rejoining)
        this.isMultiplayer = false;
        this.isReplay = false;
        this._boutLive = false;
        this._heroSelected = false;
        this._heroId = null;
        this.opponentDropDeadline = 0; // Date.now() when the opponent's 60s grace runs out; 0 while they're here
        this.opponentAway = false;      // the opponent left the app (still connected) rather than dropping
        this.result = null; // match_ended packet once the bout is decided
        this.cancelReason = null;
        this.lobby = null; // {deadline, waitingFor} while the challenge waits for a player
        this.spectatorCount = 0;
        this.playerAway = null; // spectators: {name, deadline} while a player is gone
        this.rematch = { requested: [], opponentLeft: false };
        // The bout is frozen while either side is offline or away, so nobody can beat an idle fighter
        this.waitingForPeer = false; // opponent dropped, or rejoined and is still loading back in
        this.selfOffline = false;
        this.selfAway = false;

        // Ultra-low-latency WebRTC P2P DataChannel & Latency Monitoring
        this.rtcPeer = null;
        this.dataChannel = null;
        this.isP2PActive = false;
        this.pendingCandidates = []; // opponent candidates waiting for their offer/answer to be applied
        this.rtcSignalQueue = null;
        this.ice = null; // direct-connection diagnostics, see iceSummary()
        this.turnServers = []; // our short-lived TURN login from the server: a UDP relay when no direct path works
        this.sentInputs = []; // our last few lockstep inputs [segment, tick, pressed, released], resent in every bundle
        this.pingInterval = null;
        this.rtt = 0;
        this.peerPingInterval = null;
        this.peerPingId = 0;
        this.peerPingSentAt = new Map();
        this.peerRttSamples = [];
        this.outgoingQueue = [];
        this.rxPath = "tcp"; // the way the packet being handled came: "tcp" (WebSocket) or "udp" (WebRTC channel)
        this.bootMs = null;  // how long this page took to load the game

        this.parseEnvironment();
    }

    parseEnvironment() {
        // 1. Telegram identity (initData is verified by the server; initDataUnsafe is only for display)
        const tg = window.Telegram?.WebApp;
        let authenticatedUser = null;
        this.initData = tg?.initData || "";
        if (tg?.initDataUnsafe?.user) {
            authenticatedUser = {
                id: String(tg.initDataUnsafe.user.id),
                name: tg.initDataUnsafe.user.first_name || tg.initDataUnsafe.user.username || "Fighter"
            };
        }

        // 2. What to open: a replay, or a match (challenge link)
        this.replayId = this.extractStartParam("replay_", ["replay"]);
        this.matchId = this.replayId ? null : this.extractMatchId();

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

        if (this.replayId) {
            this.isReplay = true;
            this.status = "REPLAY";
            console.log(`[Multiplayer] Replay of match ${this.replayId}`);
        } else if (this.matchId) {
            this.isMultiplayer = true;
            console.log(`[Multiplayer] Detected match ID: ${this.matchId}, User: ${this.userId} (${this.userName})`);
        }
    }

    // A Telegram start_param with `prefix` (direct links: ?startapp=replay_<id>), or one of the query keys
    extractStartParam(prefix, keys) {
        const tgParam = window.Telegram?.WebApp?.initDataUnsafe?.start_param;
        if (tgParam && tgParam.startsWith(prefix)) return tgParam.slice(prefix.length).trim() || null;
        const searchParams = new URLSearchParams(window.location.search);
        const searchStart = searchParams.get('tgWebAppStartParam') || searchParams.get('startapp');
        if (searchStart && searchStart.startsWith(prefix)) return searchStart.slice(prefix.length).trim() || null;
        for (const key of keys) {
            if (searchParams.get(key)) return searchParams.get(key).trim();
        }
        return null;
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

    get isSpectator() {
        return this.role === "spectator";
    }

    // The game server: this site, or the production gateway when the page is served from GitHub Pages
    serverHost() {
        const searchParams = new URLSearchParams(window.location.search);
        let hostOverride = searchParams.get('server') || searchParams.get('ws');
        if (!hostOverride && window.location.hash && window.location.hash.includes('=')) {
            const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
            hostOverride = hashParams.get('server') || hashParams.get('ws');
        }
        if (hostOverride) return hostOverride;
        return window.location.host.includes('github.io') ? '193.36.236.221.sslip.io' : window.location.host;
    }

    serverIsSecure(host) {
        return window.location.protocol === 'https:' || host.includes('sslip.io');
    }

    // A finished match's recorded inputs, for playback
    async fetchReplay() {
        const host = this.serverHost();
        const resp = await fetch(`${this.serverIsSecure(host) ? 'https:' : 'http:'}//${host}/api/replay/${encodeURIComponent(this.replayId)}`);
        if (!resp.ok) throw new Error(`Replay not found (${resp.status})`);
        return (await resp.json()).replay;
    }

    initUI() {
        if (this.isMultiplayer) {
            this.connect();
        }
    }

    connect() {
        if (!this.matchId) return;

        const host = this.serverHost();
        const protocol = this.serverIsSecure(host) ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${host}/ws/match/${this.matchId}`;

        console.log(`[Multiplayer] Connecting to ${wsUrl}...`);

        let ws;
        try {
            ws = this.ws = new WebSocket(wsUrl);
            ws.binaryType = "arraybuffer"; // Zero-copy binary transport
        } catch (e) {
            console.error("[Multiplayer] WebSocket creation error:", e);
            setTimeout(() => {
                if (this.shouldReconnect()) this.connect();
            }, 3000);
            return;
        }

        ws.onopen = () => {
            if (this.ws !== ws) return;
            console.log("[Multiplayer] WebSocket connected. Sending join packet...");
            this.sendPacket({
                type: "join",
                match_id: this.matchId,
                chat_id: this.chatId,
                user_id: this.userId,
                user_name: this.userName,
                init_data: this.initData,
                // A phone that still runs the bout can hand both phones the state to restart from
                bout_live: typeof this.boutLiveProvider === 'function' ? !!this.boutLiveProvider() : false,
                client: this.clientInfo()
            });

            while (this.outgoingQueue.length > 0) {
                const pkt = this.outgoingQueue.shift();
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify(pkt));
                }
            }

            this.startPeerPing();

            // Start latency monitoring ping every 5 seconds
            clearInterval(this.pingInterval);
            this.pingInterval = setInterval(() => {
                if (ws.readyState === WebSocket.OPEN) {
                    this.sendPacket({ type: "ping", time: performance.now() });
                }
            }, 5000);
        };

        ws.onmessage = (event) => {
            if (this.ws !== ws) return;
            if (event.data instanceof ArrayBuffer) {
                this.rxPath = "tcp";
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

        ws.onclose = () => {
            if (this.ws !== ws) return; // a socket we replaced on purpose (rematch)
            console.log("[Multiplayer] WebSocket closed.");
            clearInterval(this.pingInterval);
            this.resetP2P();
            if (this._boutLive && this.status === "ACTIVE") {
                this.selfOffline = true;
            }

            if (this.shouldReconnect()) {
                setTimeout(() => {
                    if (this.shouldReconnect() && this.ws === ws) this.connect();
                }, 2000);
            }
        };

        ws.onerror = (err) => {
            console.error("[Multiplayer] WebSocket error:", err);
        };
    }

    // Keep retrying through hero select and the bout so the server's 60s grace can resume us; a finished
    // match stays connected for a rematch, so a drop there reconnects too
    shouldReconnect() {
        return this.isMultiplayer && this.status !== "CANCELLED" && this.status !== "REJECTED";
    }

    // What this phone is, for the server's fight log: slow devices and networks show up next to their numbers
    clientInfo() {
        const tg = window.Telegram?.WebApp;
        return {
            platform: tg?.platform || "browser",
            tg_version: tg?.version || null,
            ua: navigator.userAgent.slice(0, 400),
            cores: navigator.hardwareConcurrency || null,
            memory_gb: navigator.deviceMemory || null,
            net: navigator.connection?.effectiveType || null,
            screen: `${window.screen.width}x${window.screen.height}`,
            dpr: window.devicePixelRatio || null,
            boot_ms: this.bootMs
        };
    }

    // Moves to a new match (a rematch): new socket, fresh match state, and a URL a reload would come back to
    switchMatch(matchId) {
        const old = this.ws;
        this.ws = null;
        if (old) {
            try { old.close(); } catch (_) {}
        }
        this.resetP2P();
        this.matchId = matchId;
        this.status = this.isSpectator ? "SPECTATING" : "HERO_SELECT";
        this._boutLive = false;
        this._heroSelected = false;
        this._heroId = null;
        this.result = null;
        this.lobby = null;
        this.cancelReason = null;
        this.opponentDropDeadline = 0;
        this.opponentAway = false;
        this.playerAway = null;
        this.waitingForPeer = false;
        this.selfOffline = false;
        this.rematch = { requested: [], opponentLeft: false };
        this.outgoingQueue = [];
        try {
            const url = new URL(window.location.href);
            url.searchParams.set('match', matchId);
            url.searchParams.delete('startapp');
            url.searchParams.delete('tgWebAppStartParam');
            history.replaceState(null, '', url.toString());
        } catch (_) {}
        this.connect();
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
        return this.waitingForPeer || this.selfOffline || this.selfAway;
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
        } else if (packetType === 9 && buffer.byteLength >= 16) { // 0x09: the last few inputs, see sendLockstepInput
            const count = view.getUint8(12);
            if (typeof this.onPeerInputCallback === 'function' && buffer.byteLength >= 16 + count * 8) {
                const segment = view.getUint8(1);
                const firstTick = view.getUint32(8);
                for (let i = 0; i < count; i++) {
                    this.onPeerInputCallback(segment, firstTick + i, view.getUint32(16 + i * 8), view.getUint32(20 + i * 8),
                                             view.getInt8(2), view.getUint8(3), view.getUint32(4));
                }
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
        } else if (packetType === 7 && buffer.byteLength >= 12) { // 0x07: STATE_HASH [7, segment, 0, 0, tick, hash]
            if (typeof this.onPeerHashCallback === 'function') {
                this.onPeerHashCallback(view.getUint8(1), view.getUint32(4), view.getUint32(8));
            }
        } else if (packetType === 8 && buffer.byteLength >= 22) { // 0x08: a player's input relayed to spectators
            // [8, side, then the player's 20-byte lockstep input packet]
            if (typeof this.onSpectatorInputCallback === 'function') {
                this.onSpectatorInputCallback(view.getUint8(1), view.getUint8(3), view.getUint32(6),
                                              view.getUint32(10), view.getUint32(14));
            }
        }
    }

    sendBinaryBothPaths(buffer) {
        this.sendDirect(buffer);
        this.sendRelay(buffer);
    }

    // The WebRTC channel: straight to the opponent, or through the TURN relay, over UDP
    sendDirect(buffer) {
        if (this.isP2PActive && this.dataChannel && this.dataChannel.readyState === "open") {
            try {
                this.dataChannel.send(buffer);
            } catch (_) {
                this.isP2PActive = false;
            }
        }
    }

    // The WebSocket through the game server (TCP), which also records the match for replays and spectators
    sendRelay(buffer) {
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
            if (this.isSpectator || (this.status !== "HERO_SELECT" && this.status !== "ACTIVE")) return;
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
        if (typeof RTCPeerConnection === 'undefined' || this.isSpectator) return;
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
                    { urls: 'stun:stun.cloudflare.com:3478' },
                    // Behind carrier NAT neither phone can reach the other directly; the game server's TURN relay
                    // carries the channel over UDP instead
                    ...this.turnServers
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
                // Unordered and never retransmitted: a lost or late packet must not hold up the ones behind it.
                // Every input packet repeats the last few ticks (see sendLockstepInput), and the WebSocket
                // delivers each one as well, so a loss costs nothing.
                const dc = this.rtcPeer.createDataChannel("combat_input", { ordered: false, maxRetransmits: 0 });
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
        return { ice_state: this.ice.state, ice_local: fmt(this.ice.local), ice_remote: fmt(this.ice.remote), ice_failures: this.ice.failures,
                 ice_path: this.ice.path || "none" };
    }

    // Which way the open channel runs, as "<our candidate type>-<theirs>": relay is through TURN,
    // host/srflx/prflx are direct
    async notePath(peer) {
        try {
            const stats = await peer.getStats();
            let pair = null;
            stats.forEach((s) => {
                if (s.type === "transport" && s.selectedCandidatePairId) pair = stats.get(s.selectedCandidatePairId);
            });
            if (!pair) stats.forEach((s) => { if (s.type === "candidate-pair" && s.nominated && s.state === "succeeded") pair = s; });
            if (!pair || this.rtcPeer !== peer || !this.ice) return;
            const local = stats.get(pair.localCandidateId);
            const remote = stats.get(pair.remoteCandidateId);
            this.ice.path = `${local ? local.candidateType : "?"}-${remote ? remote.candidateType : "?"}`;
        } catch (_) {}
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
            if (this.rtcPeer) this.notePath(this.rtcPeer);
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
                this.rxPath = "udp";
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
    // To the server (which records and relays it), a 20-byte packet:
    //   [0x04, segment, hint (int8), hintSeq, tick (uint32), pressed (uint32), released (uint32), senderTick (uint32)]
    // On the WebRTC channel, which drops packets rather than resend them, this tick and the ones before it:
    //   [0x09, segment, hint (int8), hintSeq, senderTick (uint32), firstTick (uint32), count, 0, 0, 0,
    //    then count x (pressed (uint32), released (uint32)) for ticks firstTick, firstTick + 1, ...]
    // The peer keeps the first copy of each tick from either path. A tick that never arrived would freeze both phones.
    sendLockstepInput(segment, tick, pressed, released, hint = 0, hintSeq = 0, senderTick = 0) {
        if (!this.isMultiplayer || this.status !== "ACTIVE" || this.isSpectator) return;
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
        this.sendRelay(buffer);

        // Our inputs go out one tick after another; a new bout segment starts the list again
        const last = this.sentInputs[this.sentInputs.length - 1];
        if (!last || last[0] !== segment || last[1] !== tick - 1) this.sentInputs = [];
        this.sentInputs.push([segment, tick, pressed >>> 0, released >>> 0]);
        if (this.sentInputs.length > INPUT_BUNDLE_TICKS) this.sentInputs.shift();
        if (!this.isP2PActive) return;
        const count = this.sentInputs.length;
        const bundle = new ArrayBuffer(16 + count * 8);
        const out = new DataView(bundle);
        out.setUint8(0, 9);
        out.setUint8(1, segment & 0xFF);
        out.setInt8(2, hint);
        out.setUint8(3, hintSeq & 0xFF);
        out.setUint32(4, senderTick);
        out.setUint32(8, this.sentInputs[0][1]);
        out.setUint8(12, count);
        this.sentInputs.forEach(([, , p, r], i) => {
            out.setUint32(16 + i * 8, p);
            out.setUint32(20 + i * 8, r);
        });
        this.sendDirect(bundle);
    }

    // A fingerprint of our simulation at a tick, so the two phones can tell if their fights ever differ.
    // 12-byte binary payload: [0x07, segment, 0, 0, tick (uint32), hash (uint32)]
    sendStateHash(segment, tick, hash) {
        if (!this.isMultiplayer || this.status !== "ACTIVE" || this.isSpectator) return;
        const buffer = new ArrayBuffer(12);
        const view = new DataView(buffer);
        view.setUint8(0, 7);
        view.setUint8(1, segment & 0xFF);
        view.setUint32(4, tick);
        view.setUint32(8, hash >>> 0);
        this.sendBinaryBothPaths(buffer);
    }

    // controlType is the engine's val_int_bw, so both phones give our fighter the same key layout
    sendHeroLock(heroId, controlType) {
        this.sendPacket({ type: "hero_lock", hero_id: heroId, control: controlType });
    }

    // The engine's round score (P1, P2); the server counts it once both phones report the same one
    sendRoundScore(p1Rounds, p2Rounds) {
        if (!this.isMultiplayer || this.status !== "ACTIVE" || this.isSpectator) return;
        this.sendPacket({ type: "round_score", p1: p1Rounds, p2: p2Rounds });
    }

    // Where both phones restart the bout from (after a reconnect, or if the two simulations ever differ)
    sendSnapshot(snapshot) {
        this.sendPacket({ type: "state_snapshot", ...snapshot });
    }

    // Something the fight log should hear about now rather than in the next stats report
    sendNetEvent(kind, fields) {
        if (!this.isMultiplayer || this.isSpectator) return;
        this.sendPacket({ type: "net_event", kind, ...fields });
    }

    // We left the app (minimised, phone call) or came back: the opponent's screen shows the grace countdown
    setAway(away) {
        if (!this.isMultiplayer || this.isSpectator || this.selfAway === away) return;
        // A page that is reloading or closing hides itself on the way out; that's a disconnect, not "away"
        if (away && this.leavingPage) return;
        if (away && !(this.status === "ACTIVE" && this._boutLive)) return;
        this.selfAway = away;
        this.sendPacket({ type: away ? "away" : "back" });
    }

    requestRematch() {
        if (this.isSpectator || this.status !== "COMPLETED") return;
        if (!this.rematch.requested.includes(this.userId)) {
            this.rematch = { ...this.rematch, requested: [...this.rematch.requested, this.userId] };
        }
        this.sendPacket({ type: "rematch_request" });
    }

    opponentName() {
        return (this.opponent && this.opponent.name) || "OPPONENT";
    }

    handlePacket(data) {
        switch (data.type) {
            case "joined": {
                // Version handshake: a stale client reloads, keeping the match link (and Telegram's hash data)
                const CURRENT_BUILD = "5dc4ec3";
                // Once per server build: if a reload doesn't fix the mismatch, carry on rather than loop
                const reloadKey = `ic_reloaded_for_${data.build_version}`;
                let reloadedAlready = false;
                try { reloadedAlready = sessionStorage.getItem(reloadKey) === "1"; } catch (_) {}
                if (data.build_version && data.build_version !== CURRENT_BUILD && !reloadedAlready) {
                    console.warn(`[Version Mismatch] Server=${data.build_version} Client=${CURRENT_BUILD}. Hard reloading...`);
                    try { sessionStorage.setItem(reloadKey, "1"); } catch (_) {}
                    this.leavingPage = true;
                    const url = new URL(window.location.href);
                    url.searchParams.set('_ts', String(Date.now()));
                    window.location.replace(url.toString());
                    return;
                }
                this.role = data.role;
                this.turnServers = Array.isArray(data.ice_servers) ? data.ice_servers : [];
                // The server renames a second tab that reuses the creator's id; match on what it assigned
                if (data.player_id) this.userId = data.player_id;
                this.creator = data.creator;
                this.opponent = data.creator && data.creator.id === this.userId ? data.opponent : data.creator;
                this.spectatorCount = data.spectators || 0;
                console.log(`[Multiplayer] Joined as role: ${this.role}. Match status: ${data.status}`);
                if (this.isSpectator) {
                    this.status = "SPECTATING";
                    this.watched = { p1: data.creator, p2: data.opponent };
                    break;
                }
                // Rejoining a running match as P1: we own the WebRTC offer
                if (this.role === "p1" && data.status === "ACTIVE") {
                    this.initWebRTC(true);
                }
                break;
            }

            case "auth_failed":
                this.status = "REJECTED";
                this.cancelReason = "AUTH";
                console.warn("[Multiplayer] Server could not verify our Telegram identity.");
                break;

            case "waiting_opponent":
                this.lobby = {
                    deadline: Date.now() + (data.remaining_seconds || 0) * 1000,
                    waitingFor: data.waiting_for || null
                };
                break;

            case "match_start":
                if (this.isSpectator) break;
                this.lobby = null;
                this.creator = data.p1;
                this.opponent = data.p1 && data.p1.id === this.userId ? data.p2 : data.p1;
                if (this.role === "p1" && !this.rtcPeer) {
                    this.initWebRTC(true);
                }
                if (data.stage === "hero_select") {
                    this.status = "HERO_SELECT";
                    // A lock we made before the opponent arrived still stands
                    const myLock = data.locks ? data.locks[this.userId] : undefined;
                    this._heroSelected = myLock !== undefined && myLock !== null;
                    this._heroId = this._heroSelected ? myLock : null;
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
                if (this.isSpectator) break;
                this.status = "ACTIVE";
                this.lobby = null;
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
                this.opponentAway = false;
                this.opponentDropDeadline = Date.now() + (data.remaining_seconds || 60) * 1000;
                this.waitingForPeer = this._boutLive;
                break;

            case "opponent_away":
                // They left the app but are still connected: the direct channel survives, the bout waits
                this.opponentAway = true;
                this.opponentDropDeadline = Date.now() + (data.remaining_seconds || 60) * 1000;
                this.waitingForPeer = this._boutLive;
                break;

            case "opponent_back":
                // Their inputs resume where they stopped, so nothing restarts; their next input unfreezes us
                this.opponentAway = false;
                this.opponentDropDeadline = 0;
                break;

            case "disconnect_countdown":
                if (this.opponentDropDeadline) {
                    this.opponentDropDeadline = Date.now() + data.remaining_seconds * 1000;
                }
                break;

            case "opponent_reconnected":
                this.opponentDropDeadline = 0;
                this.opponentAway = false;
                console.log("[Multiplayer] Opponent reconnected. Battle resumed.");
                // A staying P1 owns the WebRTC offer; a rejoining P1 starts it from "joined" instead
                if (this.role === "p1") {
                    this.initWebRTC(true);
                }
                break;

            case "restart_request":
                // The server asks us, the phone that kept the bout, for the state both phones restart from
                if (typeof this.onRestartRequestCallback === 'function') {
                    this.onRestartRequestCallback(data.segment);
                }
                break;

            case "state_snapshot":
                if (typeof this.onPeerSnapshotCallback === 'function') {
                    this.onPeerSnapshotCallback(data);
                }
                break;

            case "spectate":
                if (this.isSpectator && typeof this.onSpectateCallback === 'function') {
                    this.onSpectateCallback(data);
                }
                break;

            case "spectators":
                this.spectatorCount = data.count || 0;
                break;

            case "player_away": {
                const watched = this.watched || {};
                const who = [watched.p1, watched.p2].find((p) => p && p.id === data.player_id);
                this.playerAway = { name: who ? who.name : "A FIGHTER", deadline: Date.now() + (data.remaining_seconds || 60) * 1000 };
                break;
            }

            case "player_back":
                this.playerAway = null;
                break;

            case "match_ended":
                this.status = "COMPLETED";
                this.opponentDropDeadline = 0;
                this.opponentAway = false;
                this.playerAway = null;
                this.waitingForPeer = false;
                this.selfOffline = false;
                this.result = data;
                console.log("[Multiplayer] Match ended! Winner:", data.winner_name);
                if (typeof this.onMatchEndedCallback === 'function') {
                    this.onMatchEndedCallback(data);
                }
                break;

            case "rematch_status":
                this.rematch = { requested: data.requested || [], opponentLeft: !!data.opponent_left };
                break;

            case "rematch_start":
                console.log(`[Multiplayer] Rematch: moving to match ${data.match_id}`);
                if (typeof this.onRematchStartCallback === 'function') {
                    this.onRematchStartCallback(data.match_id);
                }
                break;

            case "match_cancelled":
                this.status = "CANCELLED";
                this.cancelReason = data.reason || "EXPIRED";
                console.warn("[Multiplayer] Match cancelled:", data.message);
                break;
        }
    }

    // Status line the game loop draws on the canvas (no DOM overlays), or null when there is nothing to say.
    // A finished match shows the result panel instead (see the game loop).
    bannerText() {
        if (this.status === "REJECTED") return "OPEN THE GAME FROM TELEGRAM TO PLAY";
        if (this.status === "CANCELLED") return CANCEL_TEXT[this.cancelReason] || CANCEL_TEXT.EXPIRED;
        if (this.status === "COMPLETED") return null;
        if (this.selfOffline) return "CONNECTION LOST - RECONNECTING...";
        if (this.isSpectator) {
            if (this.playerAway) {
                const secs = Math.max(0, Math.ceil((this.playerAway.deadline - Date.now()) / 1000));
                return `${String(this.playerAway.name).toUpperCase().slice(0, 12)} LEFT - ${secs}s TO COME BACK`;
            }
            return this.status === "SPECTATING" && !this._watching ? "SPECTATING - WAITING FOR THE FIGHT..." : null;
        }
        if (this.opponentDropDeadline) {
            const secs = Math.max(0, Math.ceil((this.opponentDropDeadline - Date.now()) / 1000));
            return this.opponentAway ? `OPPONENT LEFT THE GAME - AUTOWIN IN ${secs}s` : `OPPONENT DISCONNECTED - AUTOWIN IN ${secs}s`;
        }
        if (this.waitingForPeer) return "OPPONENT REJOINING...";
        if (this.lobby && this.status !== "ACTIVE") {
            const secs = Math.max(0, Math.ceil((this.lobby.deadline - Date.now()) / 1000));
            const clock = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;
            const who = this.lobby.waitingFor && this.lobby.waitingFor.name
                ? String(this.lobby.waitingFor.name).toUpperCase().slice(0, 12) : "OPPONENT";
            const locked = this._heroSelected ? "LOCKED - " : "";
            return `${locked}WAITING FOR ${who} ${clock}`;
        }
        if (this.status === "HERO_SELECT" && this._heroSelected) {
            const roleText = this.role ? `[${this.role.toUpperCase()}] ` : '';
            return `${roleText}HERO LOCKED - WAITING FOR OPPONENT...`;
        }
        return null;
    }
}
