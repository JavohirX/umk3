/**
 * Immortal Combat - Complete Multiplayer UI Engine
 * Features:
 * 1. Full-screen Atmospheric Lobby (Player 1 Left, Player 2 Right, 60s Countdown)
 * 2. Real-time Hero Selection Screen ("SELECT YOUR FIGHTER") with 7 MK Champions
 * 3. Iconic Mortal Kombat "VERSUS" Face-Off Screen (3s Countdown with Audio Fanfare)
 * 4. Battle Combat HUD (Player 1 Left, Player 2 Right, Health Bars, Round Win Dragon Medallions)
 * 5. Round Progression Announcer ("ROUND 1 / 2 / FINAL ROUND — FIGHT!")
 * 6. Best-of-3 Championship Victory Screen (The one who wins 2 rounds wins!)
 * 7. Web Audio Sound Synthesizer (Gongs, clangs, selection clicks, chimes)
 */

export const FIGHTERS = [
    {
        id: 0,
        name: "SCORPION",
        title: "Hellfire Ninja",
        quote: "GET OVER HERE!",
        color: "#f59e0b",
        glow: "rgba(245, 158, 11, 0.75)",
        bg: "radial-gradient(circle at 50% 40%, #3d1c00 0%, #170900 70%, #080300 100%)",
        svg: `<svg viewBox="0 0 100 100" class="hero-svg">
            <defs>
                <linearGradient id="scorpGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ffd54f"/>
                    <stop offset="50%" stop-color="#ff9800"/>
                    <stop offset="100%" stop-color="#b26a00"/>
                </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="46" fill="#140a02" stroke="#ff9800" stroke-width="2.5"/>
            <!-- Ninja Hood -->
            <path d="M 24 68 C 24 32, 34 16, 50 16 C 66 16, 76 32, 76 68 Z" fill="#1c1917" stroke="#44403c" stroke-width="2"/>
            <!-- Cowl/Forehead Wrap -->
            <path d="M 28 36 Q 50 30 72 36 L 72 46 Q 50 40 28 46 Z" fill="url(#scorpGrad)"/>
            <!-- Glowing White Eyes -->
            <ellipse cx="40" cy="48" rx="5" ry="2.5" fill="#ffffff" filter="drop-shadow(0 0 4px #ffd54f)"/>
            <ellipse cx="60" cy="48" rx="5" ry="2.5" fill="#ffffff" filter="drop-shadow(0 0 4px #ffd54f)"/>
            <!-- Lower Face Mask -->
            <path d="M 32 56 L 68 56 L 62 82 L 50 88 L 38 82 Z" fill="url(#scorpGrad)" stroke="#78350f" stroke-width="1.5"/>
            <!-- Mask Vents -->
            <line x1="42" y1="64" x2="58" y2="64" stroke="#451a03" stroke-width="2"/>
            <line x1="44" y1="72" x2="56" y2="72" stroke="#451a03" stroke-width="2"/>
            <line x1="47" y1="80" x2="53" y2="80" stroke="#451a03" stroke-width="2"/>
        </svg>`
    },
    {
        id: 1,
        name: "SUB-ZERO",
        title: "Lin Kuei Cryomancer",
        quote: "CHILL OUT!",
        color: "#06b6d4",
        glow: "rgba(6, 182, 212, 0.75)",
        bg: "radial-gradient(circle at 50% 40%, #002d38 0%, #00131a 70%, #00060a 100%)",
        svg: `<svg viewBox="0 0 100 100" class="hero-svg">
            <defs>
                <linearGradient id="subzGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#b2ebf2"/>
                    <stop offset="50%" stop-color="#00bcd4"/>
                    <stop offset="100%" stop-color="#006064"/>
                </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="46" fill="#020e14" stroke="#00bcd4" stroke-width="2.5"/>
            <!-- Ninja Hood -->
            <path d="M 24 68 C 24 32, 34 16, 50 16 C 66 16, 76 32, 76 68 Z" fill="#0f172a" stroke="#334155" stroke-width="2"/>
            <!-- Cowl/Forehead Wrap -->
            <path d="M 28 36 Q 50 30 72 36 L 72 46 Q 50 40 28 46 Z" fill="url(#subzGrad)"/>
            <!-- Cold Cyan Eyes -->
            <ellipse cx="40" cy="48" rx="5" ry="2.5" fill="#e0f7fa" filter="drop-shadow(0 0 5px #00e5ff)"/>
            <ellipse cx="60" cy="48" rx="5" ry="2.5" fill="#e0f7fa" filter="drop-shadow(0 0 5px #00e5ff)"/>
            <!-- Ice Mask -->
            <path d="M 32 56 L 68 56 L 62 82 L 50 88 L 38 82 Z" fill="url(#subzGrad)" stroke="#004d40" stroke-width="1.5"/>
            <!-- Mask Crystalline Cuts -->
            <polygon points="50,60 55,70 50,78 45,70" fill="#e0f7fa" opacity="0.6"/>
            <line x1="36" y1="68" x2="45" y2="70" stroke="#00363a" stroke-width="2"/>
            <line x1="64" y1="68" x2="55" y2="70" stroke="#00363a" stroke-width="2"/>
        </svg>`
    },
    {
        id: 2,
        name: "KITANA",
        title: "Princess of Edenia",
        quote: "YOU WILL LEARN RESPECT!",
        color: "#6366f1",
        glow: "rgba(99, 102, 241, 0.75)",
        bg: "radial-gradient(circle at 50% 40%, #1e1b4b 0%, #0f0a26 70%, #05020f 100%)",
        svg: `<svg viewBox="0 0 100 100" class="hero-svg">
            <defs>
                <linearGradient id="kitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#93c5fd"/>
                    <stop offset="50%" stop-color="#3b82f6"/>
                    <stop offset="100%" stop-color="#1e3a8a"/>
                </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="46" fill="#090514" stroke="#6366f1" stroke-width="2.5"/>
            <!-- Hair/Head -->
            <path d="M 22 70 C 22 30, 32 14, 50 14 C 68 14, 78 30, 78 70 Z" fill="#09090b"/>
            <!-- Edenian Golden Tiara -->
            <path d="M 30 32 L 50 24 L 70 32 L 66 38 L 50 31 L 34 38 Z" fill="#fbbf24" stroke="#b45309" stroke-width="1"/>
            <circle cx="50" cy="27" r="3" fill="#3b82f6"/>
            <!-- Fierce Eyes -->
            <ellipse cx="40" cy="46" rx="4.5" ry="2.2" fill="#dbeafe" filter="drop-shadow(0 0 3px #60a5fa)"/>
            <ellipse cx="60" cy="46" rx="4.5" ry="2.2" fill="#dbeafe" filter="drop-shadow(0 0 3px #60a5fa)"/>
            <!-- Royal Veil / Mask -->
            <path d="M 33 54 L 67 54 L 61 80 L 50 86 L 39 80 Z" fill="url(#kitGrad)" stroke="#1d4ed8" stroke-width="1.5"/>
            <!-- Steel Fan Emblem -->
            <path d="M 44 68 Q 50 62 56 68 L 50 78 Z" fill="#bfdbfe" opacity="0.8"/>
        </svg>`
    },
    {
        id: 3,
        name: "SHAO KAHN",
        title: "Outworld Emperor",
        quote: "YOU WILL DIE, MORTAL!",
        color: "#ef4444",
        glow: "rgba(239, 68, 68, 0.75)",
        bg: "radial-gradient(circle at 50% 40%, #450a0a 0%, #200404 70%, #0a0101 100%)",
        svg: `<svg viewBox="0 0 100 100" class="hero-svg">
            <defs>
                <linearGradient id="kahnGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#fca5a5"/>
                    <stop offset="50%" stop-color="#b91c1c"/>
                    <stop offset="100%" stop-color="#450a0a"/>
                </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="46" fill="#140202" stroke="#ef4444" stroke-width="2.5"/>
            <!-- Spiked Skull Helm Horns -->
            <polygon points="26,42 12,18 32,28" fill="#57534e" stroke="#292524" stroke-width="1.5"/>
            <polygon points="74,42 88,18 68,28" fill="#57534e" stroke="#292524" stroke-width="1.5"/>
            <!-- Skull Mask Forehead -->
            <path d="M 28 32 Q 50 20 72 32 L 70 54 L 30 54 Z" fill="#d6d3d1" stroke="#44403c" stroke-width="2"/>
            <!-- Glowing Red Evil Eyes -->
            <ellipse cx="40" cy="46" rx="5" ry="3" fill="#ef4444" filter="drop-shadow(0 0 6px #dc2626)"/>
            <ellipse cx="60" cy="46" rx="5" ry="3" fill="#ef4444" filter="drop-shadow(0 0 6px #dc2626)"/>
            <!-- Skull Grille / Teeth -->
            <path d="M 32 54 L 68 54 L 63 84 L 50 90 L 37 84 Z" fill="#78716c" stroke="#292524" stroke-width="2"/>
            <rect x="42" y="66" width="3" height="12" fill="#fafaf9"/>
            <rect x="47" y="66" width="3" height="13" fill="#fafaf9"/>
            <rect x="52" y="66" width="3" height="13" fill="#fafaf9"/>
            <rect x="57" y="66" width="3" height="12" fill="#fafaf9"/>
        </svg>`
    },
    {
        id: 4,
        name: "SONYA",
        title: "Special Forces General",
        quote: "I'LL TAKE YOU DOWN!",
        color: "#10b981",
        glow: "rgba(16, 185, 129, 0.75)",
        bg: "radial-gradient(circle at 50% 40%, #064e3b 0%, #022c22 70%, #01140e 100%)",
        svg: `<svg viewBox="0 0 100 100" class="hero-svg">
            <defs>
                <linearGradient id="sonyaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#6ee7b7"/>
                    <stop offset="50%" stop-color="#10b981"/>
                    <stop offset="100%" stop-color="#047857"/>
                </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="46" fill="#02140d" stroke="#10b981" stroke-width="2.5"/>
            <!-- Blonde Hair / Ponytail -->
            <path d="M 24 64 C 24 26, 34 16, 50 16 C 66 16, 76 26, 76 64 Z" fill="#fde047" stroke="#ca8a04" stroke-width="1.5"/>
            <!-- Tactical Headband -->
            <path d="M 28 36 L 72 36 L 70 45 L 30 45 Z" fill="url(#sonyaGrad)" stroke="#065f46" stroke-width="1.5"/>
            <polygon points="50,38 52,43 48,43" fill="#fbbf24"/>
            <!-- Alert Green Eyes -->
            <ellipse cx="40" cy="50" rx="4.5" ry="2.2" fill="#10b981" filter="drop-shadow(0 0 3px #34d399)"/>
            <ellipse cx="60" cy="50" rx="4.5" ry="2.2" fill="#10b981" filter="drop-shadow(0 0 3px #34d399)"/>
            <!-- Face & Chin -->
            <path d="M 34 54 Q 50 56 66 54 L 60 76 L 50 84 L 40 76 Z" fill="#fed7aa" stroke="#ea580c" stroke-width="1"/>
            <!-- Lips -->
            <path d="M 46 72 Q 50 74 54 72" stroke="#dc2626" stroke-width="2" fill="none"/>
        </svg>`
    },
    {
        id: 5,
        name: "CYRAX",
        title: "Cyber Ninja LK-4D4",
        quote: "TARGET ACQUIRED!",
        color: "#eab308",
        glow: "rgba(234, 179, 8, 0.75)",
        bg: "radial-gradient(circle at 50% 40%, #422006 0%, #1c0a00 70%, #0a0400 100%)",
        svg: `<svg viewBox="0 0 100 100" class="hero-svg">
            <defs>
                <linearGradient id="cyraxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#fef08a"/>
                    <stop offset="50%" stop-color="#eab308"/>
                    <stop offset="100%" stop-color="#854d0e"/>
                </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="46" fill="#120800" stroke="#eab308" stroke-width="2.5"/>
            <!-- Cyborg Helm Dome -->
            <path d="M 26 66 C 26 28, 34 16, 50 16 C 66 16, 74 28, 74 66 Z" fill="url(#cyraxGrad)" stroke="#713f12" stroke-width="2"/>
            <!-- Dreadlock Cables -->
            <line x1="26" y1="46" x2="16" y2="70" stroke="#292524" stroke-width="3"/>
            <line x1="74" y1="46" x2="84" y2="70" stroke="#292524" stroke-width="3"/>
            <!-- Visor Sensor Band -->
            <path d="M 30 42 L 70 42 L 68 52 L 32 52 Z" fill="#1c1917" stroke="#44403c" stroke-width="1.5"/>
            <!-- Glowing Green Optical Sensors -->
            <rect x="37" y="44" width="9" height="5" rx="1.5" fill="#22c55e" filter="drop-shadow(0 0 5px #4ade80)"/>
            <rect x="54" y="44" width="9" height="5" rx="1.5" fill="#22c55e" filter="drop-shadow(0 0 5px #4ade80)"/>
            <!-- Mechanical Mouth Grille -->
            <path d="M 34 58 L 66 58 L 60 82 L 50 86 L 40 82 Z" fill="#292524" stroke="#57534e" stroke-width="1.5"/>
            <circle cx="50" cy="72" r="5" fill="#eab308"/>
        </svg>`
    },
    {
        id: 6,
        name: "LIU KANG",
        title: "Shaolin Dragon Champion",
        quote: "FEEL THE DRAGON'S FURY!",
        color: "#f97316",
        glow: "rgba(249, 115, 22, 0.75)",
        bg: "radial-gradient(circle at 50% 40%, #431407 0%, #1f0701 70%, #0a0200 100%)",
        svg: `<svg viewBox="0 0 100 100" class="hero-svg">
            <defs>
                <linearGradient id="liuGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#fdba74"/>
                    <stop offset="50%" stop-color="#f97316"/>
                    <stop offset="100%" stop-color="#9a3412"/>
                </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="46" fill="#140500" stroke="#f97316" stroke-width="2.5"/>
            <!-- Black Shaolin Hair -->
            <path d="M 22 72 C 22 28, 32 14, 50 14 C 68 14, 78 28, 78 72 Z" fill="#18181b"/>
            <!-- Crimson Headband -->
            <path d="M 26 34 L 74 34 L 72 43 L 28 43 Z" fill="#dc2626" stroke="#991b1b" stroke-width="1.5"/>
            <line x1="72" y1="38" x2="84" y2="52" stroke="#dc2626" stroke-width="3"/>
            <!-- Intense Martial Eyes -->
            <ellipse cx="40" cy="48" rx="4.5" ry="2.2" fill="#fff7ed" filter="drop-shadow(0 0 3px #fb923c)"/>
            <ellipse cx="60" cy="48" rx="4.5" ry="2.2" fill="#fff7ed" filter="drop-shadow(0 0 3px #fb923c)"/>
            <!-- Face / Determined Jaw -->
            <path d="M 33 52 Q 50 54 67 52 L 61 78 L 50 86 L 39 78 Z" fill="#ffedd5" stroke="#ea580c" stroke-width="1"/>
            <!-- Shaolin Dragon Medallion on Neck -->
            <circle cx="50" cy="74" r="3.5" fill="#f59e0b" stroke="#78350f" stroke-width="1"/>
        </svg>`
    }
];

// =========================================================================
// RETRO ARCADE AUDIO SYNTHESIZER (PITCHED GONGS, CLICKS, VICTORY CHORDS)
// =========================================================================
class RetroAudioSynth {
    constructor() {
        this.ctx = null;
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) this.ctx = new AudioCtx();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume().catch(() => {});
        }
    }

    playGong() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        // Dual metallic dissonant frequencies with slow decay
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc1.type = 'triangle';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(110, now);
        osc1.frequency.exponentialRampToValueAtTime(74, now + 1.8);
        osc2.frequency.setValueAtTime(164.8, now);
        osc2.frequency.exponentialRampToValueAtTime(108, now + 1.8);

        gain.gain.setValueAtTime(0.45, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 1.8);
        osc2.stop(now + 1.8);
    }

    playClick() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(880, now + 0.02);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.06);
    }

    playLockIn() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const notes = [330, 440, 660];
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, now + idx * 0.08);
            gain.gain.setValueAtTime(0.2, now + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + 0.35);
        });
    }

    playRoundFanfare() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const freqs = [220, 277, 330, 440];
        freqs.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.1);
            gain.gain.setValueAtTime(0.3, now + idx * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.6);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + idx * 0.1);
            osc.stop(now + idx * 0.1 + 0.6);
        });
    }
}

export const audioSynth = new RetroAudioSynth();

// =========================================================================
// MULTIPLAYER UI CONTROLLER
// =========================================================================
export class MultiplayerUI {
    constructor(mpClient) {
        this.mpClient = mpClient;
        this.selectedHeroId = (mpClient.role === 'p2') ? 1 : 0;
        this.peerHeroId = (mpClient.role === 'p2') ? 0 : 1;
        this.isLocked = false;
        this.isPeerLocked = false;
        this.selectionTimer = 30;
        this.selectionInterval = null;
        this.p1Rounds = 0;
        this.p2Rounds = 0;

        this.injectStyles();
        this.buildDOM();
        this.bindEvents();
    }

    injectStyles() {
        if (document.getElementById('mp-master-styles')) return;
        const style = document.createElement('style');
        style.id = 'mp-master-styles';
        style.textContent = `
            /* Google Fonts: Metal Mania & Cinzel Decorative */
            @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=Metal+Mania&display=swap');

            .mk-font {
                font-family: 'Metal Mania', 'Cinzel Decorative', Impact, fantasy, sans-serif;
                letter-spacing: 2px;
                text-transform: uppercase;
            }

            .mk-gold-text {
                background: linear-gradient(180deg, #fff3b0 0%, #ffd700 35%, #d49520 70%, #7a4800 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                filter: drop-shadow(0 2px 4px rgba(0,0,0,0.9)) drop-shadow(0 0 12px rgba(255,180,30,0.5));
            }

            .mk-cyan-text {
                background: linear-gradient(180deg, #dffffd 0%, #00e5ff 35%, #0099cc 70%, #003366 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                filter: drop-shadow(0 2px 4px rgba(0,0,0,0.9)) drop-shadow(0 0 12px rgba(0,229,255,0.5));
            }

            .mk-red-text {
                background: linear-gradient(180deg, #ffdede 0%, #ff2a2a 35%, #b30000 70%, #590000 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                filter: drop-shadow(0 2px 4px rgba(0,0,0,0.9)) drop-shadow(0 0 12px rgba(255,30,30,0.5));
            }

            /* --- FULL-SCREEN OVERLAY CONTAINERS --- */
            .mp-fullscreen-overlay {
                position: fixed;
                inset: 0;
                width: 100vw;
                height: 100vh;
                height: 100dvh;
                background: radial-gradient(circle at 50% 25%, #1f120c 0%, #0d0705 50%, #050202 100%);
                z-index: 10000;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: center;
                box-sizing: border-box;
                padding: max(12px, env(safe-area-inset-top, 12px)) 16px max(14px, env(safe-area-inset-bottom, 14px));
                color: #fff;
                overflow-y: auto;
                user-select: none;
                -webkit-user-select: none;
                animation: mpFadeIn 0.25s ease-out;
            }

            @keyframes mpFadeIn {
                from { opacity: 0; transform: scale(0.98); }
                to { opacity: 1; transform: scale(1); }
            }

            /* --- 1. LOBBY VIEW --- */
            .mp-lobby-card {
                width: 100%;
                max-width: 440px;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 14px;
                margin: auto 0;
            }

            .mp-title-banner {
                font-size: 26px;
                line-height: 1.15;
                text-align: center;
            }

            .mp-badge-tag {
                background: #1c1510;
                border: 1px solid rgba(255, 152, 0, 0.4);
                padding: 4px 14px;
                border-radius: 4px;
                font-size: 13px;
                font-weight: 700;
                color: #ffaa33;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .mp-two-player-deck {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 100%;
                gap: 12px;
                margin: 10px 0;
            }

            .mp-player-slot {
                flex: 1;
                background: linear-gradient(180deg, #181410 0%, #0c0907 100%);
                border: 2px solid #3d2b18;
                border-radius: 12px;
                padding: 14px 10px;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 200, 100, 0.15);
                position: relative;
            }

            .slot-p1 { border-color: rgba(255, 170, 0, 0.5); }
            .slot-p2 { border-color: rgba(0, 229, 255, 0.5); }

            .slot-role-tag {
                font-size: 14px;
                font-weight: 900;
            }

            .slot-avatar {
                width: 64px;
                height: 64px;
                border-radius: 50%;
                background: #000;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 2px solid #555;
            }

            .slot-name {
                font-size: 13px;
                font-weight: bold;
                max-width: 120px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                text-align: center;
            }

            .slot-status-pill {
                font-size: 10px;
                font-weight: 800;
                padding: 3px 8px;
                border-radius: 10px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .pill-ready { background: #065f46; color: #6ee7b7; border: 1px solid #10b981; }
            .pill-wait { background: #3b2800; color: #fde047; border: 1px solid #eab308; animation: pulseGlow 1.5s infinite; }

            @keyframes pulseGlow {
                0%, 100% { opacity: 0.8; }
                50% { opacity: 1; filter: drop-shadow(0 0 8px #eab308); }
            }

            /* --- 2. HERO SELECTION SCREEN ("SELECT YOUR FIGHTER") --- */
            .hero-select-header {
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-bottom: 8px;
                border-bottom: 1.5px solid rgba(220, 180, 80, 0.25);
            }

            .hero-select-timer {
                font-size: 26px;
                font-weight: 900;
                color: #ff9800;
                font-variant-numeric: tabular-nums;
            }

            .hero-select-stage {
                display: flex;
                width: 100%;
                max-width: 480px;
                justify-content: space-between;
                align-items: center;
                gap: 8px;
                margin: 6px 0;
            }

            .hero-fighter-preview {
                width: 95px;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 4px;
            }

            .hero-preview-avatar {
                width: 82px;
                height: 82px;
                border-radius: 14px;
                background: #000;
                box-shadow: 0 4px 14px rgba(0, 0, 0, 0.9);
                border: 2px solid #555;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                overflow: hidden;
            }

            .p1-preview-avatar { border-color: #ff9800; box-shadow: 0 0 16px rgba(255, 152, 0, 0.5); }
            .p2-preview-avatar { border-color: #00e5ff; box-shadow: 0 0 16px rgba(0, 229, 255, 0.5); }

            .hero-preview-name {
                font-size: 15px;
                font-weight: 900;
                text-align: center;
                letter-spacing: 1px;
            }

            .hero-locked-badge {
                font-size: 9px;
                font-weight: 900;
                padding: 2px 6px;
                border-radius: 4px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .badge-locked { background: #059669; color: #fff; box-shadow: 0 0 10px #10b981; }
            .badge-choosing { background: #451a03; color: #fdba74; }

            /* --- FIGHTER SELECTION ROSTER GRID --- */
            .fighter-roster-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 8px;
                width: 100%;
                max-width: 440px;
                margin: 4px 0 10px 0;
            }

            .roster-card {
                aspect-ratio: 1 / 1;
                background: linear-gradient(180deg, #241c14 0%, #120e0a 100%);
                border: 2px solid #3d2b18;
                border-radius: 10px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                position: relative;
                padding: 4px;
                transition: transform 0.08s ease, border-color 0.08s ease, box-shadow 0.08s ease;
                box-sizing: border-box;
            }

            .roster-card:active {
                transform: scale(0.94);
            }

            .roster-avatar-wrap {
                width: 100%;
                height: 72%;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .hero-svg {
                width: 100%;
                height: 100%;
                display: block;
            }

            .roster-name-label {
                font-size: 9.5px;
                font-weight: 900;
                letter-spacing: 0.5px;
                text-align: center;
                color: #e5c687;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                width: 100%;
            }

            /* Player 1 Selection Ring (Fiery Amber) */
            .roster-card.p1-selected {
                border-color: #ff9800;
                box-shadow: 0 0 16px rgba(255, 152, 0, 0.8), inset 0 0 8px rgba(255, 152, 0, 0.4);
            }

            /* Player 2 Selection Ring (Ice Cyan) */
            .roster-card.p2-selected {
                border-color: #00e5ff;
                box-shadow: 0 0 16px rgba(0, 229, 255, 0.8), inset 0 0 8px rgba(0, 229, 255, 0.4);
            }

            /* Dual Selection Ring */
            .roster-card.dual-selected {
                border-color: #ffd700;
                box-shadow: 0 0 18px rgba(255, 152, 0, 0.9), 0 0 18px rgba(0, 229, 255, 0.9);
            }

            .cursor-p1-tag, .cursor-p2-tag {
                position: absolute;
                top: -6px;
                font-size: 8px;
                font-weight: 900;
                padding: 1px 4px;
                border-radius: 3px;
                letter-spacing: 0.5px;
            }

            .cursor-p1-tag { left: 2px; background: #ff7518; color: #000; }
            .cursor-p2-tag { right: 2px; background: #00d2ff; color: #000; }

            /* --- 3. THE ICONIC VERSUS SCREEN ("VS SCREEN") --- */
            .vs-container {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 100%;
                max-width: 480px;
                margin: auto 0;
                gap: 10px;
                position: relative;
            }

            .vs-fighter-column {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
            }

            .vs-avatar-massive {
                width: 110px;
                height: 110px;
                border-radius: 18px;
                background: #000;
                border: 3px solid #555;
                box-shadow: 0 8px 30px rgba(0, 0, 0, 0.9);
                overflow: hidden;
            }

            .vs-p1-avatar { border-color: #ff9800; box-shadow: 0 0 30px rgba(255, 152, 0, 0.7); }
            .vs-p2-avatar { border-color: #00e5ff; box-shadow: 0 0 30px rgba(0, 229, 255, 0.7); transform: scaleX(-1); }

            .vs-emblem-center {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 6px;
                z-index: 5;
            }

            .vs-logo-text {
                font-size: 54px;
                font-weight: 900;
                line-height: 1;
                color: #ef4444;
                text-shadow: 0 0 20px rgba(239, 68, 68, 0.9), 0 0 40px rgba(255, 100, 0, 0.8);
                animation: pulseVs 0.8s infinite alternate ease-in-out;
            }

            @keyframes pulseVs {
                from { transform: scale(0.96); }
                to { transform: scale(1.06); }
            }

            .vs-countdown-ticker {
                font-size: 28px;
                font-weight: 900;
                color: #ffd700;
                font-variant-numeric: tabular-nums;
            }

            /* --- 4. IN-GAME BATTLE COMBAT HUD --- */
            .combat-hud-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 48px;
                background: linear-gradient(180deg, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.7) 70%, transparent 100%);
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                padding: 4px 10px;
                z-index: 50;
                pointer-events: none;
                box-sizing: border-box;
            }

            .hud-fighter-side {
                display: flex;
                flex-direction: column;
                width: 42%;
                gap: 2px;
            }

            .hud-meta-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 11px;
                font-weight: 900;
            }

            .hud-medallions-wrap {
                display: flex;
                gap: 4px;
            }

            .hud-coin {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                border: 1.5px solid #666;
                background: #111;
                box-sizing: border-box;
            }

            .hud-coin.won {
                background: radial-gradient(circle, #ffe082 0%, #ffb300 70%, #ff6f00 100%);
                border-color: #ffd700;
                box-shadow: 0 0 8px rgba(255, 215, 0, 0.9);
            }

            .hud-hp-bar {
                width: 100%;
                height: 9px;
                background: #1a0000;
                border: 1px solid #ff4444;
                border-radius: 2px;
                overflow: hidden;
            }

            .hud-hp-fill {
                height: 100%;
                background: linear-gradient(180deg, #4ade80 0%, #22c55e 50%, #15803d 100%);
                transition: width 0.1s linear;
            }

            .hud-center-clock {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 1px;
            }

            .hud-round-label {
                font-size: 8.5px;
                font-weight: 900;
                letter-spacing: 0.8px;
                color: #e5c687;
            }

            .hud-clock-digits {
                font-size: 18px;
                font-weight: 900;
                color: #ffd700;
                line-height: 1;
            }

            /* --- 5. ROUND ANNOUNCER SPLASH BANNER --- */
            .round-announcer-banner {
                position: fixed;
                top: 36%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 10001;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 6px;
                pointer-events: none;
                animation: bannerPop 1.6s ease-out forwards;
            }

            @keyframes bannerPop {
                0% { opacity: 0; transform: translate(-50%, -50%) scale(0.6); }
                15% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
                25% { transform: translate(-50%, -50%) scale(1.0); }
                80% { opacity: 1; transform: translate(-50%, -50%) scale(1.0); }
                100% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
            }

            .announcer-main-title {
                font-size: 38px;
                line-height: 1;
                font-weight: 900;
                letter-spacing: 2px;
                text-align: center;
            }

            .announcer-sub-title {
                font-size: 16px;
                font-weight: 800;
                letter-spacing: 1.5px;
                color: #ffaa00;
                text-align: center;
            }

            /* --- 6. VICTORY & CONCLUSION MODAL --- */
            .victory-modal-card {
                width: 90%;
                max-width: 400px;
                background: linear-gradient(180deg, #1c140e 0%, #0d0906 100%);
                border: 2px solid #ffd700;
                box-shadow: 0 0 35px rgba(255, 215, 0, 0.45);
                border-radius: 14px;
                padding: 22px 18px;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 14px;
                text-align: center;
                margin: auto;
            }

            .victory-headline {
                font-size: 30px;
                line-height: 1.1;
                font-weight: 900;
            }

            .victory-score-pill {
                background: #110c08;
                border: 1px solid rgba(255, 215, 0, 0.35);
                padding: 6px 18px;
                border-radius: 8px;
                font-size: 18px;
                font-weight: 900;
                letter-spacing: 1px;
                color: #ffaa00;
            }

            /* --- BUTTONS --- */
            .btn-action-primary {
                width: 100%;
                max-width: 320px;
                padding: 13px 20px;
                background: linear-gradient(180deg, #d97706 0%, #b45309 60%, #78350f 100%);
                border: 2px solid #fde68a;
                border-radius: 8px;
                font-size: 15px;
                font-weight: 900;
                color: #fff;
                cursor: pointer;
                letter-spacing: 1px;
                box-shadow: 0 4px 14px rgba(0,0,0,0.8), 0 0 16px rgba(217, 119, 6, 0.6);
                transition: transform 0.05s ease;
            }

            .btn-action-primary:active {
                transform: scale(0.96);
            }

            .btn-action-secondary {
                width: 100%;
                max-width: 320px;
                padding: 10px 16px;
                background: #1c1917;
                border: 1.5px solid #44403c;
                border-radius: 8px;
                font-size: 12px;
                font-weight: 800;
                color: #d6d3d1;
                cursor: pointer;
                letter-spacing: 0.5px;
            }

            .btn-action-secondary:active {
                background: #292524;
            }
        `;
        document.head.appendChild(style);
    }

    buildDOM() {
        if (document.getElementById('mp-system-root')) return;
        const root = document.createElement('div');
        root.id = 'mp-system-root';
        root.innerHTML = `
            <!-- 1. FULLSCREEN CHALLENGE LOBBY VIEW -->
            <div id="mp-view-lobby" class="mp-fullscreen-overlay" style="display: none;">
                <div class="mp-title-banner mk-font mk-gold-text">IMMORTAL COMBAT</div>
                <div class="mp-lobby-card">
                    <div class="mp-badge-tag" id="mp-lobby-tag">CHALLENGE #------</div>
                    <div class="mp-two-player-deck">
                        <!-- Player 1 Slot (Left) -->
                        <div class="mp-player-slot slot-p1">
                            <span class="slot-role-tag mk-font mk-gold-text">PLAYER 1</span>
                            <div class="slot-avatar" id="mp-lobby-p1-avatar">
                                ${FIGHTERS[0].svg}
                            </div>
                            <span class="slot-name" id="mp-lobby-p1-name">Host Fighter</span>
                            <span class="slot-status-pill pill-ready">READY</span>
                        </div>
                        <!-- VS Badge -->
                        <div class="mk-font mk-red-text" style="font-size: 26px; font-weight: 900;">VS</div>
                        <!-- Player 2 Slot (Right) -->
                        <div class="mp-player-slot slot-p2">
                            <span class="slot-role-tag mk-font mk-cyan-text">PLAYER 2</span>
                            <div class="slot-avatar" id="mp-lobby-p2-avatar">
                                ${FIGHTERS[1].svg}
                            </div>
                            <span class="slot-name" id="mp-lobby-p2-name">Waiting...</span>
                            <span class="slot-status-pill pill-wait" id="mp-lobby-p2-status">SEARCHING</span>
                        </div>
                    </div>
                    <div class="mp-badge-tag" style="background: rgba(0,0,0,0.5);">
                        <span>⏳ Auto-cancels in:</span>
                        <b id="mp-lobby-clock" style="color: #ffd700; font-size: 16px;">60s</b>
                    </div>
                </div>
                <div style="width: 100%; max-width: 320px; display: flex; flex-direction: column; gap: 8px;">
                    <button id="mp-btn-share-link" class="btn-action-primary mk-font">🔗 Share Challenge Link</button>
                    <button id="mp-btn-cancel-lobby" class="btn-action-secondary mk-font">Cancel Battle</button>
                </div>
            </div>

            <!-- 2. FULLSCREEN HERO SELECTION VIEW ("SELECT YOUR FIGHTER") -->
            <div id="mp-view-hero-select" class="mp-fullscreen-overlay" style="display: none;">
                <div class="hero-select-header">
                    <div class="mk-font mk-gold-text" style="font-size: 20px;">SELECT YOUR FIGHTER</div>
                    <div class="hero-select-timer mk-font" id="hero-select-clock">30s</div>
                </div>

                <!-- Two-Sided Fighter Preview Stage: P1 Left, P2 Right -->
                <div class="hero-select-stage">
                    <!-- Left: Player 1 (Amber Theme) -->
                    <div class="hero-fighter-preview">
                        <span class="mk-font mk-gold-text" style="font-size: 12px; font-weight: 900;">PLAYER 1</span>
                        <div class="hero-preview-avatar p1-preview-avatar" id="hero-p1-avatar-box">
                            ${FIGHTERS[0].svg}
                        </div>
                        <span class="hero-preview-name mk-font mk-gold-text" id="hero-p1-name-box">${FIGHTERS[0].name}</span>
                        <span class="hero-locked-badge badge-choosing" id="hero-p1-status-badge">CHOOSING</span>
                    </div>

                    <!-- Center: VS Emblem -->
                    <div class="mk-font mk-red-text" style="font-size: 32px; font-weight: 900;">VS</div>

                    <!-- Right: Player 2 (Cyan Theme) -->
                    <div class="hero-fighter-preview">
                        <span class="mk-font mk-cyan-text" style="font-size: 12px; font-weight: 900;">PLAYER 2</span>
                        <div class="hero-preview-avatar p2-preview-avatar" id="hero-p2-avatar-box">
                            ${FIGHTERS[1].svg}
                        </div>
                        <span class="hero-preview-name mk-font mk-cyan-text" id="hero-p2-name-box">${FIGHTERS[1].name}</span>
                        <span class="hero-locked-badge badge-choosing" id="hero-p2-status-badge">CHOOSING</span>
                    </div>
                </div>

                <!-- Center 7 Fighters Roster Grid -->
                <div class="fighter-roster-grid" id="fighter-roster-grid">
                    ${FIGHTERS.map((f, idx) => `
                        <div class="roster-card" data-hero-id="${f.id}" id="roster-card-${f.id}">
                            <div class="roster-avatar-wrap">
                                ${f.svg}
                            </div>
                            <span class="roster-name-label mk-font">${f.name}</span>
                        </div>
                    `).join('')}
                </div>

                <!-- Lock-In Button -->
                <button id="btn-lock-hero" class="btn-action-primary mk-font">🔥 LOCK IN FIGHTER</button>
            </div>

            <!-- 3. FULLSCREEN ICONIC VERSUS FACE-OFF VIEW -->
            <div id="mp-view-versus" class="mp-fullscreen-overlay" style="display: none; justify-content: center;">
                <div class="vs-container">
                    <!-- Left: Player 1 (Amber Theme) -->
                    <div class="vs-fighter-column">
                        <span class="mk-font mk-gold-text" style="font-size: 15px; font-weight: 900;">PLAYER 1</span>
                        <span id="vs-p1-player-name" style="font-size: 12px; color: #ddd; font-weight: bold;">Fighter 1</span>
                        <div class="vs-avatar-massive vs-p1-avatar" id="vs-p1-avatar-wrap">
                            ${FIGHTERS[0].svg}
                        </div>
                        <span class="mk-font mk-gold-text" id="vs-p1-hero-title" style="font-size: 22px; font-weight: 900;">${FIGHTERS[0].name}</span>
                    </div>

                    <!-- Center: Metallic Flaming VS -->
                    <div class="vs-emblem-center">
                        <div class="vs-logo-text mk-font">VS</div>
                        <div class="vs-countdown-ticker mk-font" id="vs-countdown-ticker">3</div>
                    </div>

                    <!-- Right: Player 2 (Cyan Theme) -->
                    <div class="vs-fighter-column">
                        <span class="mk-font mk-cyan-text" style="font-size: 15px; font-weight: 900;">PLAYER 2</span>
                        <span id="vs-p2-player-name" style="font-size: 12px; color: #ddd; font-weight: bold;">Fighter 2</span>
                        <div class="vs-avatar-massive vs-p2-avatar" id="vs-p2-avatar-wrap">
                            ${FIGHTERS[1].svg}
                        </div>
                        <span class="mk-font mk-cyan-text" id="vs-p2-hero-title" style="font-size: 22px; font-weight: 900;">${FIGHTERS[1].name}</span>
                    </div>
                </div>
            </div>

            <!-- 4. IN-GAME TOP BATTLE HUD OVERLAY -->
            <div id="mp-combat-hud" class="combat-hud-overlay" style="display: none;">
                <!-- P1 Left -->
                <div class="hud-fighter-side">
                    <div class="hud-meta-row">
                        <span class="mk-font mk-gold-text" id="hud-p1-name" style="font-size: 11px;">P1: SCORPION</span>
                        <div class="hud-medallions-wrap" id="hud-p1-coins">
                            <span class="hud-coin" id="coin-p1-r1"></span>
                            <span class="hud-coin" id="coin-p1-r2"></span>
                        </div>
                    </div>
                    <div class="hud-hp-bar">
                        <div class="hud-hp-fill" id="hud-p1-hp-fill" style="width: 100%;"></div>
                    </div>
                </div>

                <!-- Center Clock -->
                <div class="hud-center-clock">
                    <span class="hud-round-label mk-font" id="hud-round-indicator">ROUND 1</span>
                    <span class="hud-clock-digits mk-font" id="hud-clock-timer">99</span>
                </div>

                <!-- P2 Right -->
                <div class="hud-fighter-side" style="align-items: flex-end;">
                    <div class="hud-meta-row" style="width: 100%; justify-content: space-between;">
                        <div class="hud-medallions-wrap" id="hud-p2-coins">
                            <span class="hud-coin" id="coin-p2-r2"></span>
                            <span class="hud-coin" id="coin-p2-r1"></span>
                        </div>
                        <span class="mk-font mk-cyan-text" id="hud-p2-name" style="font-size: 11px;">P2: SUB-ZERO</span>
                    </div>
                    <div class="hud-hp-bar" style="display: flex; justify-content: flex-end;">
                        <div class="hud-hp-fill" id="hud-p2-hp-fill" style="width: 100%;"></div>
                    </div>
                </div>
            </div>

            <!-- 5. FULLSCREEN VICTORY & CHAMPIONSHIP MODAL -->
            <div id="mp-view-victory" class="mp-fullscreen-overlay" style="display: none; justify-content: center;">
                <div class="victory-modal-card">
                    <div class="mk-font mk-red-text" style="font-size: 18px;">FATALITY!</div>
                    <div class="victory-headline mk-font mk-gold-text" id="victory-winner-title">SCORPION WINS!</div>
                    <div style="font-size: 13px; color: #ffd700; font-weight: 800; letter-spacing: 1px;">IMMORTAL COMBAT CHAMPION</div>
                    <div class="victory-score-pill mk-font" id="victory-score-pill">2 - 0</div>
                    <p id="victory-flavor-text" style="font-size: 12px; color: #aaa; margin: 4px 0;">First to win 2 rounds claims victory.</p>
                    <button id="btn-victory-rematch" class="btn-action-primary mk-font">⚔️ INSTANT REMATCH</button>
                    <button id="btn-victory-leaderboard" class="btn-action-secondary mk-font">🏆 VIEW LEADERBOARD</button>
                </div>
            </div>
        `;
        document.body.appendChild(root);
    }

    bindEvents() {
        // 1. Share challenge link
        const shareBtn = document.getElementById('mp-btn-share-link');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                const url = window.location.href;
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(url).then(() => {
                        shareBtn.textContent = "✅ Link Copied!";
                        setTimeout(() => { shareBtn.textContent = "🔗 Share Challenge Link"; }, 2000);
                    }).catch(() => {});
                }
            });
        }

        // 2. Cancel Lobby
        const cancelBtn = document.getElementById('mp-btn-cancel-lobby');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.hideAllOverlays();
                if (this.mpClient && this.mpClient.ws) {
                    this.mpClient.ws.close();
                }
                window.location.href = window.location.pathname; // Clear match query
            });
        }

        // 3. Roster Card Clicks
        const cards = document.querySelectorAll('.roster-card');
        cards.forEach((card) => {
            card.addEventListener('pointerdown', (e) => {
                e.preventDefault();
                if (this.isLocked) return;
                const heroId = parseInt(card.getAttribute('data-hero-id'), 10);
                this.selectHeroLocally(heroId);
            });
        });

        // 4. Lock-In Hero Button
        const lockBtn = document.getElementById('btn-lock-hero');
        if (lockBtn) {
            lockBtn.addEventListener('click', () => {
                this.lockHeroLocally();
            });
        }

        // 5. Rematch Button
        const rematchBtn = document.getElementById('btn-victory-rematch');
        if (rematchBtn) {
            rematchBtn.addEventListener('click', () => {
                if (this.mpClient) {
                    this.mpClient.sendPacket({ type: "rematch_request" });
                    rematchBtn.textContent = "Waiting for Opponent...";
                    rematchBtn.disabled = true;
                }
            });
        }

        // 6. Leaderboard Button
        const lbBtn = document.getElementById('btn-victory-leaderboard');
        if (lbBtn) {
            lbBtn.addEventListener('click', () => {
                if (this.mpClient) this.mpClient.showLeaderboard();
            });
        }
    }

    hideAllOverlays() {
        ['mp-view-lobby', 'mp-view-hero-select', 'mp-view-versus', 'mp-view-victory'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });
    }

    showLobby(remainingSeconds = 60) {
        this.hideAllOverlays();
        const lobby = document.getElementById('mp-view-lobby');
        if (!lobby) return;
        lobby.style.display = 'flex';

        const tag = document.getElementById('mp-lobby-tag');
        if (tag) tag.textContent = `CHALLENGE #${this.mpClient.matchId || 'ONLINE'}`;

        const p1Name = document.getElementById('mp-lobby-p1-name');
        if (p1Name) {
            p1Name.textContent = (this.mpClient.role === 'p1')
                ? `${this.mpClient.userName} (You)`
                : (this.mpClient.creator ? this.mpClient.creator.name : "Host Fighter");
        }

        const clock = document.getElementById('mp-lobby-clock');
        if (clock) clock.textContent = `${remainingSeconds}s`;
    }

    updateLobbyOpponent(opponentName) {
        const p2Name = document.getElementById('mp-lobby-p2-name');
        const p2Status = document.getElementById('mp-lobby-p2-status');
        if (p2Name) p2Name.textContent = opponentName;
        if (p2Status) {
            p2Status.textContent = "CONNECTED";
            p2Status.className = "slot-status-pill pill-ready";
        }
    }

    startHeroSelect() {
        this.hideAllOverlays();
        audioSynth.playGong();
        const view = document.getElementById('mp-view-hero-select');
        if (!view) return;
        view.style.display = 'flex';

        this.isLocked = false;
        this.isPeerLocked = false;
        this.selectedHeroId = (this.mpClient.role === 'p2') ? 1 : 0;
        this.peerHeroId = (this.mpClient.role === 'p2') ? 0 : 1;

        this.updateRosterHighlights();
        this.updatePreviewCards();

        // 30s selection countdown
        clearInterval(this.selectionInterval);
        this.selectionTimer = 30;
        const clockEl = document.getElementById('hero-select-clock');
        if (clockEl) clockEl.textContent = `${this.selectionTimer}s`;

        this.selectionInterval = setInterval(() => {
            this.selectionTimer--;
            if (clockEl) clockEl.textContent = `${Math.max(0, this.selectionTimer)}s`;
            if (this.selectionTimer <= 0) {
                clearInterval(this.selectionInterval);
                if (!this.isLocked) this.lockHeroLocally();
            }
        }, 1000);
    }

    selectHeroLocally(heroId) {
        if (this.isLocked) return;
        this.selectedHeroId = heroId;
        audioSynth.playClick();
        this.updateRosterHighlights();
        this.updatePreviewCards();

        if (this.mpClient) {
            this.mpClient.sendPacket({
                type: "hero_hover",
                hero_id: heroId
            });
        }
    }

    lockHeroLocally() {
        if (this.isLocked) return;
        this.isLocked = true;
        audioSynth.playLockIn();

        const btn = document.getElementById('btn-lock-hero');
        if (btn) {
            btn.textContent = "✅ LOCKED IN! WAITING...";
            btn.style.opacity = "0.7";
            btn.disabled = true;
        }

        const myBadge = (this.mpClient.role === 'p1')
            ? document.getElementById('hero-p1-status-badge')
            : document.getElementById('hero-p2-status-badge');
        if (myBadge) {
            myBadge.textContent = "LOCKED IN! 🔥";
            myBadge.className = "hero-locked-badge badge-locked";
        }

        if (this.mpClient) {
            this.mpClient.sendPacket({
                type: "hero_lock",
                hero_id: this.selectedHeroId
            });
        }
    }

    handlePeerHover(role, heroId) {
        this.peerHeroId = heroId;
        audioSynth.playClick();
        this.updateRosterHighlights();
        this.updatePreviewCards();
    }

    handlePeerLock(role, heroId) {
        this.peerHeroId = heroId;
        this.isPeerLocked = true;

        const peerBadge = (this.mpClient.role === 'p1')
            ? document.getElementById('hero-p2-status-badge')
            : document.getElementById('hero-p1-status-badge');
        if (peerBadge) {
            peerBadge.textContent = "LOCKED IN! 🔥";
            peerBadge.className = "hero-locked-badge badge-locked";
        }

        this.updateRosterHighlights();
        this.updatePreviewCards();
    }

    updateRosterHighlights() {
        const isP1 = (this.mpClient.role === 'p1');
        const p1Hero = isP1 ? this.selectedHeroId : this.peerHeroId;
        const p2Hero = isP1 ? this.peerHeroId : this.selectedHeroId;

        document.querySelectorAll('.roster-card').forEach(card => {
            const hid = parseInt(card.getAttribute('data-hero-id'), 10);
            card.classList.remove('p1-selected', 'p2-selected', 'dual-selected');
            const existingTags = card.querySelectorAll('.cursor-p1-tag, .cursor-p2-tag');
            existingTags.forEach(t => t.remove());

            const isP1Here = (hid === p1Hero);
            const isP2Here = (hid === p2Hero);

            if (isP1Here && isP2Here) {
                card.classList.add('dual-selected');
                card.insertAdjacentHTML('beforeend', `<span class="cursor-p1-tag">P1</span><span class="cursor-p2-tag">P2</span>`);
            } else if (isP1Here) {
                card.classList.add('p1-selected');
                card.insertAdjacentHTML('beforeend', `<span class="cursor-p1-tag">P1</span>`);
            } else if (isP2Here) {
                card.classList.add('p2-selected');
                card.insertAdjacentHTML('beforeend', `<span class="cursor-p2-tag">P2</span>`);
            }
        });
    }

    updatePreviewCards() {
        const isP1 = (this.mpClient.role === 'p1');
        const p1HeroId = isP1 ? this.selectedHeroId : this.peerHeroId;
        const p2HeroId = isP1 ? this.peerHeroId : this.selectedHeroId;

        const fighterP1 = FIGHTERS[p1HeroId] || FIGHTERS[0];
        const fighterP2 = FIGHTERS[p2HeroId] || FIGHTERS[1];

        // Player 1 Left
        const p1AvatarBox = document.getElementById('hero-p1-avatar-box');
        const p1NameBox = document.getElementById('hero-p1-name-box');
        if (p1AvatarBox) p1AvatarBox.innerHTML = fighterP1.svg;
        if (p1NameBox) p1NameBox.textContent = fighterP1.name;

        // Player 2 Right
        const p2AvatarBox = document.getElementById('hero-p2-avatar-box');
        const p2NameBox = document.getElementById('hero-p2-name-box');
        if (p2AvatarBox) p2AvatarBox.innerHTML = fighterP2.svg;
        if (p2NameBox) p2NameBox.textContent = fighterP2.name;
    }

    showVersusScreen(data, onFinished) {
        clearInterval(this.selectionInterval);
        this.hideAllOverlays();
        audioSynth.playGong();

        const view = document.getElementById('mp-view-versus');
        if (!view) return;
        view.style.display = 'flex';

        const p1HeroId = data.p1?.hero_id ?? 0;
        const p2HeroId = data.p2?.hero_id ?? 1;
        const fighterP1 = FIGHTERS[p1HeroId] || FIGHTERS[0];
        const fighterP2 = FIGHTERS[p2HeroId] || FIGHTERS[1];

        // Player 1 (Left)
        const p1Name = document.getElementById('vs-p1-player-name');
        const p1Avatar = document.getElementById('vs-p1-avatar-wrap');
        const p1HeroTitle = document.getElementById('vs-p1-hero-title');
        if (p1Name) p1Name.textContent = data.p1?.name || "Player 1";
        if (p1Avatar) p1Avatar.innerHTML = fighterP1.svg;
        if (p1HeroTitle) p1HeroTitle.textContent = fighterP1.name;

        // Player 2 (Right)
        const p2Name = document.getElementById('vs-p2-player-name');
        const p2Avatar = document.getElementById('vs-p2-avatar-wrap');
        const p2HeroTitle = document.getElementById('vs-p2-hero-title');
        if (p2Name) p2Name.textContent = data.p2?.name || "Player 2";
        if (p2Avatar) p2Avatar.innerHTML = fighterP2.svg;
        if (p2HeroTitle) p2HeroTitle.textContent = fighterP2.name;

        // 3-2-1 Countdown Ticker
        let count = 3;
        const ticker = document.getElementById('vs-countdown-ticker');
        if (ticker) ticker.textContent = String(count);

        const cdInterval = setInterval(() => {
            count--;
            if (count > 0) {
                if (ticker) ticker.textContent = String(count);
                audioSynth.playClick();
            } else if (count === 0) {
                if (ticker) {
                    ticker.textContent = "FIGHT!";
                    ticker.style.color = "#ff3333";
                }
                audioSynth.playGong();
            } else {
                clearInterval(cdInterval);
                view.style.display = 'none';
                if (typeof onFinished === 'function') onFinished(p1HeroId, p2HeroId);
            }
        }, 800);
    }

    showCombatHud(p1HeroId, p2HeroId, p1Name, p2Name) {
        const hud = document.getElementById('mp-combat-hud');
        if (!hud) return;
        hud.style.display = 'flex';

        const fighterP1 = FIGHTERS[p1HeroId] || FIGHTERS[0];
        const fighterP2 = FIGHTERS[p2HeroId] || FIGHTERS[1];

        const p1Label = document.getElementById('hud-p1-name');
        const p2Label = document.getElementById('hud-p2-name');
        if (p1Label) p1Label.textContent = `P1: ${fighterP1.name}`;
        if (p2Label) p2Label.textContent = `P2: ${fighterP2.name}`;

        this.updateRoundCoins(0, 0);
        this.updateHealthBars(100, 100);
    }

    updateRoundCoins(p1Wins, p2Wins) {
        this.p1Rounds = p1Wins;
        this.p2Rounds = p2Wins;

        const c11 = document.getElementById('coin-p1-r1');
        const c12 = document.getElementById('coin-p1-r2');
        const c21 = document.getElementById('coin-p2-r1');
        const c22 = document.getElementById('coin-p2-r2');

        if (c11) c11.classList.toggle('won', p1Wins >= 1);
        if (c12) c12.classList.toggle('won', p1Wins >= 2);
        if (c21) c21.classList.toggle('won', p2Wins >= 1);
        if (c22) c22.classList.toggle('won', p2Wins >= 2);
    }

    updateHealthBars(p1Hp, p2Hp) {
        const f1 = document.getElementById('hud-p1-hp-fill');
        const f2 = document.getElementById('hud-p2-hp-fill');
        if (f1) f1.style.width = `${Math.max(0, Math.min(100, p1Hp))}%`;
        if (f2) f2.style.width = `${Math.max(0, Math.min(100, p2Hp))}%`;
    }

    setRoundNumber(roundNum) {
        const lbl = document.getElementById('hud-round-indicator');
        if (lbl) {
            lbl.textContent = (roundNum >= 3) ? "FINAL ROUND" : `ROUND ${roundNum}`;
        }
    }

    setRoundClock(seconds) {
        const el = document.getElementById('hud-clock-timer');
        if (el) el.textContent = String(Math.max(0, Math.floor(seconds)));
    }

    showRoundAnnounceBanner(mainText, subText = "FIGHT!") {
        audioSynth.playRoundFanfare();
        const banner = document.createElement('div');
        banner.className = 'round-announcer-banner';
        banner.innerHTML = `
            <div class="announcer-main-title mk-font mk-gold-text">${mainText}</div>
            <div class="announcer-sub-title mk-font">${subText}</div>
        `;
        document.body.appendChild(banner);
        setTimeout(() => {
            try { banner.remove(); } catch (_) {}
        }, 1800);
    }

    showVictoryScreen(data) {
        this.hideAllOverlays();
        audioSynth.playGong();

        const hud = document.getElementById('mp-combat-hud');
        if (hud) hud.style.display = 'none';

        const modal = document.getElementById('mp-view-victory');
        if (!modal) return;
        modal.style.display = 'flex';

        const winnerTitle = document.getElementById('victory-winner-title');
        const scorePill = document.getElementById('victory-score-pill');
        const flavor = document.getElementById('victory-flavor-text');

        const winnerName = data.winner_name || (data.winner_role === 'p1' ? 'Player 1' : 'Player 2');
        if (winnerTitle) winnerTitle.textContent = `${winnerName.toUpperCase()} WINS!`;

        const p1Wins = data.p1_rounds ?? this.p1Rounds;
        const p2Wins = data.p2_rounds ?? this.p2Rounds;
        if (scorePill) scorePill.textContent = `${p1Wins} — ${p2Wins}`;

        if (flavor) {
            flavor.textContent = `The one who wins 2 rounds claims Immortal Combat supremacy!`;
        }
    }
}
