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
        this.status = "DISCONNECTED"; // WAITING, ACTIVE, COMPLETED, CANCELLED
        this.opponent = null;
        this.creator = null;
        this.inputSeq = 0;
        this.joinTimerInterval = null;
        this.disconnectTimerInterval = null;
        this.onPeerInputCallback = null;
        this.onMatchStartCallback = null;
        this.isMultiplayer = false;

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
        this.injectMultiplayerDOM();
        this.bindUIEvents();

        if (this.isMultiplayer) {
            this.showLobbyWaiting(60);
            this.connect();
        }
    }

    injectMultiplayerDOM() {
        if (document.getElementById('mp-container')) return;

        const mpHTML = `
        <!-- MULTIPLAYER HEADS-UP OVERLAY -->
        <div id="mp-hud-bar" class="mp-hud-bar" style="display: none;">
            <div class="mp-player-badge mp-badge-p1">
                <span class="mp-role-dot dot-p1"></span>
                <span id="mp-hud-p1-name">P1: Loading...</span>
            </div>
            <button id="mp-btn-leaderboard" class="mp-btn-hud">🏆 Leaderboard</button>
            <div class="mp-player-badge mp-badge-p2">
                <span class="mp-role-dot dot-p2"></span>
                <span id="mp-hud-p2-name">P2: Waiting...</span>
            </div>
        </div>

        <!-- 1. LOBBY WAITING MODAL (60s COUNTDOWN) -->
        <div id="mp-lobby-modal" class="mp-modal" style="display: none;">
            <div class="mp-modal-box">
                <div class="mp-modal-header">⚔️ ARENA CHALLENGE LOBBY</div>
                <div class="mp-modal-body">
                    <p class="mp-highlight" id="mp-lobby-match-id">Match: #------</p>
                    <p id="mp-lobby-status-text">Waiting for opponent to join...</p>
                    <div class="mp-timer-wrap">
                        <div id="mp-lobby-timer" class="mp-timer-display">60s</div>
                        <div class="mp-progress-bar"><div id="mp-lobby-bar" class="mp-progress-fill"></div></div>
                    </div>
                    <p class="mp-subtext">If opponent does not join within 1 minute, the challenge cancels automatically.</p>
                </div>
                <div class="mp-modal-footer">
                    <button id="mp-lobby-cancel-btn" class="mp-btn mp-btn-secondary">Cancel Challenge</button>
                </div>
            </div>
        </div>

        <!-- 2. OPPONENT DISCONNECTED FORFEIT MODAL (60s COUNTDOWN) -->
        <div id="mp-disconnect-modal" class="mp-modal" style="display: none;">
            <div class="mp-modal-box mp-box-warning">
                <div class="mp-modal-header">⚠️ OPPONENT DISCONNECTED</div>
                <div class="mp-modal-body">
                    <p id="mp-disc-message">Your opponent lost connection!</p>
                    <div class="mp-timer-wrap">
                        <div id="mp-disc-timer" class="mp-timer-display">60s</div>
                        <div class="mp-progress-bar"><div id="mp-disc-bar" class="mp-progress-fill mp-bar-warning"></div></div>
                    </div>
                    <p class="mp-subtext">Waiting 1 minute for opponent to reconnect.<br><b>AUTOWIN</b> awarded to you if they do not return.<br><i>(If you exit too, match is cancelled without a win)</i></p>
                </div>
            </div>
        </div>

        <!-- 3. MATCH RESULT / VICTORY / AUTOWIN MODAL -->
        <div id="mp-result-modal" class="mp-modal" style="display: none;">
            <div class="mp-modal-box">
                <div id="mp-result-header" class="mp-modal-header">🏆 BATTLE CONCLUDED</div>
                <div class="mp-modal-body">
                    <div id="mp-result-title" class="mp-result-title">VICTORY!</div>
                    <p id="mp-result-reason" class="mp-subtext">Reason: Knockout</p>
                    <div id="mp-result-stats" class="mp-stats-card"></div>
                </div>
                <div class="mp-modal-footer">
                    <button id="mp-rematch-btn" class="mp-btn mp-btn-primary">⚔️ Rematch</button>
                    <button id="mp-close-result-btn" class="mp-btn mp-btn-secondary">Close</button>
                </div>
            </div>
        </div>

        <!-- 4. LOCAL GROUP LEADERBOARD MODAL -->
        <div id="mp-leaderboard-modal" class="mp-modal" style="display: none;">
            <div class="mp-modal-box mp-lb-box">
                <div class="mp-modal-header">🏆 LOCAL ARENA LEADERBOARD</div>
                <div class="mp-modal-body">
                    <p class="mp-subtext">Local group standings. Tracks Wins, Losses & Total Battles.</p>
                    <div id="mp-lb-table-wrap" class="mp-table-wrap">
                        <div class="mp-loading">Loading standings...</div>
                    </div>
                </div>
                <div class="mp-modal-footer">
                    <button id="mp-lb-close-btn" class="mp-btn mp-btn-secondary">Back to Arena</button>
                </div>
            </div>
        </div>
        `;

        const div = document.createElement('div');
        div.id = 'mp-container';
        div.innerHTML = mpHTML;
        document.body.appendChild(div);
        this.injectStyles();
    }

    injectStyles() {
        if (document.getElementById('mp-styles')) return;
        const style = document.createElement('style');
        style.id = 'mp-styles';
        style.textContent = `
            .mp-hud-bar {
                position: absolute;
                top: 4px;
                left: 6px;
                right: 6px;
                height: 28px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                z-index: 1000;
                background: rgba(0, 0, 0, 0.75);
                border: 1px solid #333;
                border-radius: 4px;
                padding: 0 8px;
                font-size: 11px;
                color: #e0e2ec;
                backdrop-filter: blur(4px);
            }
            .mp-player-badge {
                display: flex;
                align-items: center;
                gap: 5px;
                font-weight: bold;
                max-width: 110px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .mp-role-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
            }
            .dot-p1 { background: #ff7518; box-shadow: 0 0 6px #ff7518; }
            .dot-p2 { background: #00d2ff; box-shadow: 0 0 6px #00d2ff; }
            .mp-btn-hud {
                background: #1a1a1a;
                border: 1px solid #ff7518;
                color: #ff7518;
                font-size: 10px;
                font-weight: bold;
                padding: 2px 7px;
                border-radius: 3px;
                cursor: pointer;
            }
            .mp-modal {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.85);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                backdrop-filter: blur(5px);
                animation: mpFadeIn 0.2s ease-out;
            }
            @keyframes mpFadeIn {
                from { opacity: 0; transform: scale(0.96); }
                to { opacity: 1; transform: scale(1); }
            }
            .mp-modal-box {
                width: 90%;
                max-width: 360px;
                background: #0f1015;
                border: 2px solid #ff7518;
                box-shadow: 0 0 25px rgba(255, 117, 24, 0.4);
                color: #fff;
                font-family: inherit;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }
            .mp-box-warning {
                border-color: #ff3333;
                box-shadow: 0 0 25px rgba(255, 51, 51, 0.4);
            }
            .mp-modal-header {
                background: #181920;
                padding: 10px 14px;
                font-weight: 900;
                font-size: 13px;
                letter-spacing: 1px;
                color: #ff7518;
                border-bottom: 1px solid #222;
                text-align: center;
            }
            .mp-box-warning .mp-modal-header {
                color: #ff4444;
            }
            .mp-modal-body {
                padding: 16px 14px;
                text-align: center;
            }
            .mp-modal-footer {
                padding: 10px 14px;
                background: #14151b;
                display: flex;
                gap: 8px;
                justify-content: center;
                border-top: 1px solid #222;
            }
            .mp-highlight {
                font-size: 15px;
                font-weight: bold;
                color: #ffaa33;
                margin-bottom: 8px;
            }
            .mp-timer-wrap {
                margin: 14px 0;
            }
            .mp-timer-display {
                font-size: 32px;
                font-weight: 900;
                color: #ff7518;
                font-variant-numeric: tabular-nums;
                margin-bottom: 6px;
            }
            .mp-box-warning .mp-timer-display {
                color: #ff4444;
            }
            .mp-progress-bar {
                width: 100%;
                height: 8px;
                background: #222;
                border: 1px solid #444;
                overflow: hidden;
            }
            .mp-progress-fill {
                width: 100%;
                height: 100%;
                background: #ff7518;
                transition: width 1s linear;
            }
            .mp-bar-warning {
                background: #ff3333;
            }
            .mp-subtext {
                font-size: 11px;
                color: #888;
                line-height: 1.4;
            }
            .mp-btn {
                padding: 8px 16px;
                font-weight: bold;
                font-size: 12px;
                cursor: pointer;
                border: none;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .mp-btn-primary {
                background: #ff7518;
                color: #000;
            }
            .mp-btn-secondary {
                background: #222;
                color: #ccc;
                border: 1px solid #444;
            }
            .mp-result-title {
                font-size: 26px;
                font-weight: 900;
                color: #ffaa00;
                margin-bottom: 6px;
            }
            .mp-stats-card {
                margin: 12px 0;
                background: #181920;
                padding: 10px;
                border: 1px solid #333;
                font-size: 12px;
                color: #ddd;
            }
            /* LEADERBOARD TABLE */
            .mp-table-wrap {
                max-height: 260px;
                overflow-y: auto;
                margin-top: 10px;
            }
            .mp-table {
                width: 100%;
                border-collapse: collapse;
                font-size: 11px;
                text-align: left;
            }
            .mp-table th {
                background: #181920;
                color: #ff7518;
                padding: 6px 8px;
                border-bottom: 1px solid #333;
            }
            .mp-table td {
                padding: 6px 8px;
                border-bottom: 1px solid #1c1d24;
            }
            .mp-table tr:hover {
                background: #1a1b22;
            }
            .mp-rank-1 { color: #ffd700; font-weight: bold; }
            .mp-rank-2 { color: #c0c0c0; font-weight: bold; }
            .mp-rank-3 { color: #cd7f32; font-weight: bold; }
        `;
        document.head.appendChild(style);
    }

    bindUIEvents() {
        const cancelBtn = document.getElementById('mp-lobby-cancel-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.closeLobby();
                if (this.ws) this.ws.close();
            });
        }

        const lbBtn = document.getElementById('mp-btn-leaderboard');
        if (lbBtn) {
            lbBtn.addEventListener('click', () => this.showLeaderboard());
        }

        const lbCloseBtn = document.getElementById('mp-lb-close-btn');
        if (lbCloseBtn) {
            lbCloseBtn.addEventListener('click', () => {
                document.getElementById('mp-leaderboard-modal').style.display = 'none';
            });
        }

        const closeResultBtn = document.getElementById('mp-close-result-btn');
        if (closeResultBtn) {
            closeResultBtn.addEventListener('click', () => {
                document.getElementById('mp-result-modal').style.display = 'none';
            });
        }

        const rematchBtn = document.getElementById('mp-rematch-btn');
        if (rematchBtn) {
            rematchBtn.addEventListener('click', () => {
                this.sendPacket({ type: "rematch_request" });
                rematchBtn.textContent = "Waiting for Opponent...";
                rematchBtn.disabled = true;
            });
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
        const statusText = document.getElementById('mp-lobby-status-text');
        if (statusText) statusText.textContent = "Connecting to combat arena...";

        try {
            this.ws = new WebSocket(wsUrl);
        } catch (e) {
            console.error("[Multiplayer] WebSocket creation error:", e);
            if (statusText) statusText.innerHTML = "⚠️ <b>Connection error!</b> Retrying in 3s...";
            setTimeout(() => {
                if (this.status === "WAITING" && !this.isTimeout) this.connect();
            }, 3000);
            return;
        }

        this.ws.onopen = () => {
            console.log("[Multiplayer] WebSocket connected. Sending join packet...");
            if (statusText) statusText.textContent = "Connected to Arena! Waiting for opponent to join...";
            this.sendPacket({
                type: "join",
                match_id: this.matchId,
                chat_id: this.chatId,
                user_id: this.userId,
                user_name: this.userName
            });
        };

        this.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                this.handlePacket(data);
            } catch (err) {
                console.error("[Multiplayer] Packet parse error:", err);
            }
        };

        this.ws.onclose = () => {
            console.log("[Multiplayer] WebSocket closed.");
            if (this.status === "WAITING" && !this.isTimeout) {
                if (statusText) statusText.textContent = "Reconnecting to arena...";
                setTimeout(() => {
                    if (this.status === "WAITING" && !this.isTimeout) this.connect();
                }, 2000);
            }
        };

        this.ws.onerror = (err) => {
            console.error("[Multiplayer] WebSocket error:", err);
            if (statusText && this.status === "WAITING") statusText.textContent = "Connecting to arena server...";
        };
    }

    sendPacket(data) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        }
    }

    sendInput(keyCode, isDown) {
        if (!this.isMultiplayer || this.status !== "ACTIVE") return;
        this.inputSeq++;
        this.sendPacket({
            type: "input",
            key: keyCode,
            down: isDown,
            seq: this.inputSeq
        });
    }

    handlePacket(data) {
        switch (data.type) {
            case "joined":
                this.role = data.role;
                this.creator = data.creator;
                this.opponent = data.opponent;
                console.log(`[Multiplayer] Joined as role: ${this.role}. Match status: ${data.status}`);
                this.updateHudBar();
                break;

            case "waiting_opponent":
                this.showLobbyWaiting(data.remaining_seconds || 60);
                break;

            case "match_start":
                this.status = "ACTIVE";
                this.dismissLobby();
                this.dismissDisconnectModal();
                this.creator = data.p1;
                this.opponent = data.p2;
                this.updateHudBar();
                console.log("[Multiplayer] Match ACTIVE! Starting combat simulation.");
                if (typeof this.onMatchStartCallback === 'function') {
                    this.onMatchStartCallback(data);
                }
                break;

            case "peer_input":
                if (typeof this.onPeerInputCallback === 'function') {
                    this.onPeerInputCallback(data.key, data.down);
                }
                break;

            case "opponent_disconnected":
                this.showOpponentDisconnectModal(data.remaining_seconds || 60, data.disconnected_name || "Opponent");
                break;

            case "disconnect_countdown":
                this.updateDisconnectTimer(data.remaining_seconds);
                break;

            case "opponent_reconnected":
                this.dismissDisconnectModal();
                console.log("[Multiplayer] Opponent reconnected. Battle resumed.");
                break;

            case "match_ended":
                this.status = "COMPLETED";
                this.dismissDisconnectModal();
                this.showMatchResultModal(data);
                break;

            case "match_cancelled":
                this.status = "CANCELLED";
                this.showMatchCancelled(data.message || "Match cancelled.");
                break;

            case "rematch_offered":
                this.handleRematchOffered(data);
                break;
        }
    }

    showLobbyWaiting(seconds = 60) {
        const modal = document.getElementById('mp-lobby-modal');
        const matchLabel = document.getElementById('mp-lobby-match-id');
        const timerDisplay = document.getElementById('mp-lobby-timer');
        const bar = document.getElementById('mp-lobby-bar');
        const cancelBtn = document.getElementById('mp-lobby-cancel-btn');
        const statusText = document.getElementById('mp-lobby-status-text');

        if (!modal) return;
        modal.style.display = 'flex';
        this.status = "WAITING";
        this.isTimeout = false;
        if (matchLabel) matchLabel.textContent = `Match: #${this.matchId}`;
        if (statusText) statusText.textContent = "Waiting for opponent to join...";
        if (cancelBtn) {
            cancelBtn.textContent = "Cancel Challenge";
            cancelBtn.onclick = () => {
                this.closeLobby();
                if (this.ws) this.ws.close();
            };
        }

        let remaining = seconds;
        if (timerDisplay) timerDisplay.textContent = `${remaining}s`;
        if (bar) bar.style.width = '100%';

        clearInterval(this.joinTimerInterval);
        this.joinTimerInterval = setInterval(() => {
            remaining--;
            if (timerDisplay) timerDisplay.textContent = `${Math.max(0, remaining)}s`;
            if (bar) bar.style.width = `${Math.max(0, (remaining / 60) * 100)}%`;

            if (remaining <= 0) {
                clearInterval(this.joinTimerInterval);
                this.handleJoinTimeout();
            }
        }, 1000);
    }

    handleJoinTimeout() {
        this.isTimeout = true;
        this.status = "CANCELLED";
        if (this.ws) {
            try { this.ws.close(); } catch (_) {}
        }
        const statusText = document.getElementById('mp-lobby-status-text');
        const timerDisplay = document.getElementById('mp-lobby-timer');
        const bar = document.getElementById('mp-lobby-bar');
        const cancelBtn = document.getElementById('mp-lobby-cancel-btn');

        if (statusText) statusText.innerHTML = "⏱️ <b>Join window expired!</b><br>Opponent did not join within 1 minute. Match cancelled.";
        if (timerDisplay) timerDisplay.textContent = "EXPIRED";
        if (bar) bar.style.width = '0%';
        if (cancelBtn) {
            cancelBtn.textContent = "Close";
            cancelBtn.onclick = () => this.closeLobby();
        }
    }

    dismissLobby() {
        clearInterval(this.joinTimerInterval);
        const modal = document.getElementById('mp-lobby-modal');
        if (modal) modal.style.display = 'none';
        const hud = document.getElementById('mp-hud-bar');
        if (hud) hud.style.display = 'flex';
    }

    closeLobby() {
        clearInterval(this.joinTimerInterval);
        const modal = document.getElementById('mp-lobby-modal');
        if (modal) modal.style.display = 'none';
        this.isMultiplayer = false;
        if (this.ws) {
            try { this.ws.close(); } catch (_) {}
        }
    }

    showOpponentDisconnectModal(seconds = 60, oppName = "Opponent") {
        const modal = document.getElementById('mp-disconnect-modal');
        const msgEl = document.getElementById('mp-disc-message');
        const timerDisplay = document.getElementById('mp-disc-timer');
        const bar = document.getElementById('mp-disc-bar');

        if (!modal) return;
        modal.style.display = 'flex';
        if (msgEl) msgEl.textContent = `${oppName} has lost connection!`;

        let remaining = seconds;
        if (timerDisplay) timerDisplay.textContent = `${remaining}s`;
        if (bar) bar.style.width = '100%';

        clearInterval(this.disconnectTimerInterval);
        this.disconnectTimerInterval = setInterval(() => {
            remaining--;
            if (timerDisplay) timerDisplay.textContent = `${Math.max(0, remaining)}s`;
            if (bar) bar.style.width = `${Math.max(0, (remaining / 60) * 100)}%`;

            if (remaining <= 0) {
                clearInterval(this.disconnectTimerInterval);
            }
        }, 1000);
    }

    updateDisconnectTimer(seconds) {
        const timerDisplay = document.getElementById('mp-disc-timer');
        const bar = document.getElementById('mp-disc-bar');
        if (timerDisplay) timerDisplay.textContent = `${seconds}s`;
        if (bar) bar.style.width = `${Math.max(0, (seconds / 60) * 100)}%`;
    }

    dismissDisconnectModal() {
        clearInterval(this.disconnectTimerInterval);
        const modal = document.getElementById('mp-disconnect-modal');
        if (modal) modal.style.display = 'none';
    }

    showMatchResultModal(data) {
        const modal = document.getElementById('mp-result-modal');
        const titleEl = document.getElementById('mp-result-title');
        const reasonEl = document.getElementById('mp-result-reason');
        const statsEl = document.getElementById('mp-result-stats');

        if (!modal) return;
        modal.style.display = 'flex';

        const isWinner = data.winner_id === this.userId;
        if (titleEl) {
            if (isWinner) {
                titleEl.textContent = "🏆 VICTORY!";
                titleEl.style.color = "#ffaa00";
            } else {
                titleEl.textContent = "💀 DEFEAT";
                titleEl.style.color = "#ff4444";
            }
        }

        if (reasonEl) {
            if (data.reason === "AUTOWIN_DISCONNECT") {
                reasonEl.textContent = isWinner
                    ? "Opponent failed to reconnect within 1 minute. Autowin awarded!"
                    : "Match forfeit due to disconnection timeout.";
            } else {
                reasonEl.textContent = data.message || "Match finished.";
            }
        }

        if (statsEl) {
            statsEl.innerHTML = `
                <div>Winner: <b>${data.winner_name || 'Champion'}</b></div>
                <div style="margin-top: 4px;">Local leaderboard updated for this chat!</div>
            `;
        }
    }

    showMatchCancelled(msg) {
        clearInterval(this.joinTimerInterval);
        this.status = "CANCELLED";
        this.isTimeout = true;
        if (this.ws) {
            try { this.ws.close(); } catch (_) {}
        }

        const modal = document.getElementById('mp-lobby-modal');
        const statusText = document.getElementById('mp-lobby-status-text');
        const timerDisplay = document.getElementById('mp-lobby-timer');
        const bar = document.getElementById('mp-lobby-bar');
        const cancelBtn = document.getElementById('mp-lobby-cancel-btn');

        if (modal) {
            modal.style.display = 'flex';
            if (statusText) statusText.innerHTML = `⚠️ <b>${escapeHtml(msg)}</b>`;
            if (timerDisplay) timerDisplay.textContent = "CANCELLED";
            if (bar) bar.style.width = "0%";
            if (cancelBtn) {
                cancelBtn.textContent = "Close";
                cancelBtn.onclick = () => this.closeLobby();
            }
        }
    }

    handleRematchOffered(data) {
        const accept = confirm(`${data.from_name} has requested a rematch! Do you accept?`);
        if (accept) {
            this.sendPacket({ type: "rematch_accept" });
            const resultModal = document.getElementById('mp-result-modal');
            if (resultModal) resultModal.style.display = 'none';
        }
    }

    updateHudBar() {
        const p1Name = document.getElementById('mp-hud-p1-name');
        const p2Name = document.getElementById('mp-hud-p2-name');
        if (p1Name) p1Name.textContent = `P1: ${this.creator?.name || 'Waiting...'}`;
        if (p2Name) p2Name.textContent = `P2: ${this.opponent?.name || 'Waiting...'}`;
    }

    async showLeaderboard() {
        const modal = document.getElementById('mp-leaderboard-modal');
        const wrap = document.getElementById('mp-lb-table-wrap');
        if (!modal || !wrap) return;

        modal.style.display = 'flex';
        wrap.innerHTML = `<div class="mp-loading" style="padding: 10px; color: #ff7518;">Loading arena leaderboard...</div>`;

        try {
            const resp = await fetch(`/api/leaderboard?chat_id=${encodeURIComponent(this.chatId)}`);
            const data = await resp.json();
            const list = data.leaderboard || [];

            if (list.length === 0) {
                wrap.innerHTML = `<p style="padding: 10px; color: #888;">No matches recorded in this arena yet.<br>Fight to claim the #1 spot!</p>`;
                return;
            }

            let rows = list.map(p => `
                <tr>
                    <td class="mp-rank-${p.rank}">${p.rank}</td>
                    <td><b>${escapeHtml(p.first_name)}</b></td>
                    <td>${p.wins}</td>
                    <td>${p.losses}</td>
                    <td>${p.games_played}</td>
                    <td>${p.win_rate}%</td>
                </tr>
            `).join('');

            wrap.innerHTML = `
                <table class="mp-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Fighter</th>
                            <th>W</th>
                            <th>L</th>
                            <th>Total</th>
                            <th>Win%</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            `;
        } catch (err) {
            wrap.innerHTML = `<p style="color: #ff4444;">Failed to load leaderboard: ${err.message}</p>`;
        }
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
