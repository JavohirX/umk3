import { loadAllAssets } from './assets.js';
import { Graphics, Display } from './j2me/graphics.js';
import { Manager } from './j2me/audio.js';
import { initEngine, SDKMIDlet, CoreEngine } from './engine/umk3.js';
import { MultiplayerClient } from './network_pure.js';
import { stepMatchEnd } from './match_end.js';

let midlet = null;
let animFrameId = null;
let isAudioMuted = false;
let canvas = null;
let ctx = null;
let mpClient = new MultiplayerClient();
window.mpClient = mpClient;

// Key mapping table from UI / keyboard identifiers to J2ME KeyCodes
const KEY_MAP = {
    // D-Pad / Movement
    'ArrowUp': -1,
    'KeyW': -1,
    'ArrowDown': -2,
    'KeyS': -2,
    'ArrowLeft': -3,
    'KeyA': -3,
    'ArrowRight': -4,
    'KeyD': -4,

    // Center Action (Fire / Enter / Space)
    'Enter': -5,
    'Space': -5,
    'KeyX': -5,

    // Softkeys: Left (OPTNS) & Right (BACK)
    'F1': -6,
    'KeyQ': -6,
    'Escape': -6,

    'F2': -7,
    'KeyE': -7,
    'Backspace': -7,

    // Dialpad / Special Keys (*, 0, #)
    'Digit0': 48,
    'Numpad0': 48,
    'NumpadAsterisk': 42,
    'Minus': 42,
    'NumpadDivide': 35,
    'Equal': 35,

    // Combat Action Cluster (A: Punch 53, B: Kick 55, D: Block 57)
    'Digit1': 49,
    'Numpad1': 49,
    'KeyZ': 49,

    'Digit2': 50,
    'Numpad2': 50,

    'Digit3': 51,
    'Numpad3': 51,

    'Digit4': 52,
    'Numpad4': 52,
    'KeyC': 52,

    'Digit5': 53, // Button A (Punch / Select)
    'Numpad5': 53,
    'KeyJ': 53,
    'KeyB': 53,

    'Digit6': 54,
    'Numpad6': 54,
    'KeyV': 54,

    'Digit7': 55, // Button B (Kick)
    'Numpad7': 55,
    'KeyK': 55,
    'KeyN': 55,
    'ShiftLeft': 55,
    'ShiftRight': 55,

    'Digit8': 56, // Crouch / Down
    'Numpad8': 56,

    'Digit9': 57, // Button D (Block / Special)
    'Numpad9': 57,
    'KeyL': 57,
    'KeyU': 57,
    'KeyO': 57,
    'KeyI': 57
};

function triggerHaptic(duration = 10) {
    try {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        } else if (navigator.vibrate) {
            navigator.vibrate(duration);
        }
    } catch (_) {}
}

function unlockAudio() {
    try {
        Manager.unlockAudio();
    } catch (_) {}
}

function sendKeyEvent(keyCode, isDown) {
    if (!CoreEngine.val_maincanvasbridge_a) return;

    if (mpClient && mpClient.isMultiplayer) {
        // A decided or expired online match stays on its result banner; keys must not start single-player
        if (mpClient.status === "COMPLETED" || mpClient.status === "CANCELLED") return;
        // A frozen bout would replay queued presses on resume; releases still pass so no key sticks
        if (mpClient.paused && isDown) return;
    }

    // Online, the engine hands the resulting key mask change to CoreEngine.onlineVersus.routeLocalBits,
    // which drives our own fighter and streams the change to the opponent
    if (isDown) {
        CoreEngine.val_maincanvasbridge_a.keyPressed(keyCode);
    } else {
        CoreEngine.val_maincanvasbridge_a.keyReleased(keyCode);
    }
}

function triggerButtonActive(code, isActive) {
    const btns = document.querySelectorAll(`[data-key*="${code}"]`);
    btns.forEach(b => {
        if (isActive) b.classList.add('active');
        else b.classList.remove('active');
    });

    // Also visually highlight D-pad arrow buttons when keyboard arrow keys are pressed
    const joyArrowMap = {
        'ArrowUp': 'up',
        'ArrowDown': 'down',
        'ArrowLeft': 'left',
        'ArrowRight': 'right',
        'KeyW': 'up',
        'KeyS': 'down',
        'KeyA': 'left',
        'KeyD': 'right'
    };
    const joyDir = joyArrowMap[code];
    if (joyDir) {
        const ind = document.querySelector(`[data-dir="${joyDir}"]`) || document.querySelector(`[data-joy-dir="${joyDir}"]`);
        if (ind) {
            if (isActive) ind.classList.add('active');
            else ind.classList.remove('active');
        }
    }
}

// =========================================================================
// ADVANCED VIRTUAL LEFT JOYSTICK MOVEMENT & TRANSITION SYSTEM
// Multi-stage input pipeline: analog clamp, asymmetric sectors,
// angular hysteresis, transition matrix / ignored moves, clean key sync.
// =========================================================================
class AdvancedMovementJoystick {
    constructor(config = {}) {
        this.config = Object.assign({
            deadZoneRadius: 14,          // Layer 2: 15-20% base radius
            maxRadius: 55,               // Layer 1: pad radius - knob radius
            hysteresisAngleDeg: 6,       // Layer 4: 6 deg sticky angle margin (leaves 32 deg diagonal window)
            cardinalHalfWidthDeg: 26     // Layer 3: 26 deg half-width (52 deg full cardinal arc)
        }, config);

        this.currentDirection = null;
        this.hasExceededDeadzone = false;
        this.recentTouchHistory = [];
    }

    processMove(dx, dy) {
        const dist = Math.hypot(dx, dy);

        // Layer 1: Coordinate Normalization & Analog 360 Visual Clamp
        const clampedDist = Math.min(dist, this.config.maxRadius);
        const scale = dist > 0 ? (clampedDist / dist) : 0;
        const thumbX = dx * scale;
        const thumbY = dy * scale;

        // Layer 2: Radial Deadzone & Center-Tap Filter
        if (dist < this.config.deadZoneRadius) {
            this.setDirection(null);
            return { direction: null, thumbX, thumbY };
        }

        this.hasExceededDeadzone = true;

        // Angle in degrees: 0° = Right, 90° = Down, 180° = Left, 270° = Up
        let deg = Math.atan2(dy, dx) * (180 / Math.PI);
        if (deg < 0) deg += 360;

        // Track rolling touch history (past 60ms) for flick/snapback suppression
        this.recordHistory(dist, deg);

        // Layer 3 & 4: Resolve Candidate Sector with Asymmetric Weighting & Angular Hysteresis
        const candidate = this.resolveSector(deg);

        // Layer 5: Transition Matrix & Ignored Moves Engine
        if (this.isValidTransition(this.currentDirection, candidate, dist, dx, dy)) {
            this.setDirection(candidate);
        }

        return { direction: this.currentDirection, thumbX, thumbY };
    }

    resolveSector(deg) {
        const cHalf = this.config.cardinalHalfWidthDeg; // 30° -> 60° total for Cardinals
        const hyst = this.config.hysteresisAngleDeg;    // 10° hysteresis margin

        // Test if angle falls within cardinal sector with hysteresis expansion/contraction
        const inSector = (centerDeg) => {
            let effectiveHalf = cHalf;
            if (this.isCurrent(centerDeg)) {
                // Currently in this cardinal: expand sector boundary by hyst
                effectiveHalf = cHalf + hyst;
            } else if (this.isAdjacentDiagonal(this.currentDirection, centerDeg)) {
                // Currently in adjacent diagonal: cardinal boundary shrinks by hyst
                effectiveHalf = cHalf - hyst;
            }
            const diff = Math.abs(((deg - centerDeg + 180 + 360) % 360) - 180);
            return diff <= effectiveHalf;
        };

        if (inSector(0)) return 'right';
        if (inSector(90)) return 'down';
        if (inSector(180)) return 'left';
        if (inSector(270)) return 'up';

        // Diagonals take remaining narrower sectors (30° each)
        if (deg > 0 && deg < 90) return 'down-right';
        if (deg > 90 && deg < 180) return 'down-left';
        if (deg > 180 && deg < 270) return 'up-left';
        return 'up-right';
    }

    isCurrent(centerDeg) {
        if (!this.currentDirection) return false;
        const dirCenterMap = {
            'right': 0, 'down': 90, 'left': 180, 'up': 270
        };
        return dirCenterMap[this.currentDirection] === centerDeg;
    }

    isAdjacentDiagonal(dir, cardinalCenterDeg) {
        if (!dir) return false;
        const adjMap = {
            0: ['up-right', 'down-right'],
            90: ['down-right', 'down-left'],
            180: ['down-left', 'up-left'],
            270: ['up-left', 'up-right']
        };
        return (adjMap[cardinalCenterDeg] || []).includes(dir);
    }

    isValidTransition(from, to, dist, dx, dy) {
        if (from === to) return true;
        if (!from || !to) return true;

        // Rule 1: Opposing Cardinal Reversal Lock (Left <-> Right, Up <-> Down)
        // Direct 180° flip prohibited without neutral passage
        const opposites = [
            ['left', 'right'], ['right', 'left'],
            ['up', 'down'], ['down', 'up'],
            ['up-left', 'down-right'], ['down-right', 'up-left'],
            ['up-right', 'down-left'], ['down-left', 'up-right']
        ];
        const isOpposite = opposites.some(([a, b]) => (from === a && to === b));
        if (isOpposite) {
            // Rule 1: Instant 180 flip is prohibited in a single movement frame.
            // Thumb must transition through neutral (null) for at least 1 tick before opposite is acknowledged.
            this.setDirection(null);
            return false;
        }

        // Rule 2: Snap-Back / Release Flick Suppression
        if (this.isSnapbackFlick(to)) {
            return false;
        }

        // Rule 3: Diagonal Intent & Threshold Elevation (|dy| >= 0.5 * |dx|)
        if ((from === 'right' && to === 'up-right') || (from === 'left' && to === 'up-left')) {
            if (Math.abs(dy) < 0.5 * Math.abs(dx)) {
                return false; // Keep horizontal walk without accidental diagonal jump
            }
        }

        // Rule 4: Crouch Direction Lock (Duck Sweep)
        if ((from === 'down' || from === 'down-left' || from === 'down-right') && (to === 'left' || to === 'right')) {
            if (dy > this.config.deadZoneRadius * 0.75) {
                // Retain defensive crouch instead of popping up into standing walk
                const defensiveCrouch = (to === 'left') ? 'down-left' : 'down-right';
                this.setDirection(defensiveCrouch);
                return false;
            }
        }

        return true;
    }

    isSnapbackFlick(target) {
        if (this.recentTouchHistory.length < 2) return false;
        const oldest = this.recentTouchHistory[0];
        const newest = this.recentTouchHistory[this.recentTouchHistory.length - 1];

        // If radius collapsed rapidly while angle swung > 90 degrees -> Snap-back artifact
        const radiusDelta = oldest.dist - newest.dist;
        const angleDelta = Math.abs(((newest.angle - oldest.angle + 180 + 360) % 360) - 180);

        return (radiusDelta > 10 && angleDelta > 90);
    }

    handleRelease() {
        const wasTap = !this.hasExceededDeadzone;
        this.setDirection(null);
        this.hasExceededDeadzone = false;
        this.recentTouchHistory = [];
        return { centerTapped: wasTap };
    }

    setDirection(dir) {
        this.currentDirection = dir;
    }

    recordHistory(dist, angle) {
        const now = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
        this.recentTouchHistory.push({ dist, angle, time: now });
        if (this.recentTouchHistory.length > 10) this.recentTouchHistory.shift();
        this.recentTouchHistory = this.recentTouchHistory.filter(h => now - h.time <= 120);
    }
}
window.AdvancedMovementJoystick = AdvancedMovementJoystick;

function setupInputControls() {
    // --- 1. 8-DIRECTIONAL TACTILE D-PAD (TOUCH & FLUID SLIDING/GLIDE ENGINE) ---
    const dpadGrid = document.getElementById('dpad-grid');
    if (dpadGrid) {
        let dpadPointerId = null;
        let currentDpadDir = null;
        let activeDpadKeys = [];
        let touchStartInCenter = false;

        const dpadButtons = {
            'up-left': dpadGrid.querySelector('[data-dir="up-left"]'),
            'up': dpadGrid.querySelector('[data-dir="up"]'),
            'up-right': dpadGrid.querySelector('[data-dir="up-right"]'),
            'left': dpadGrid.querySelector('[data-dir="left"]'),
            'right': dpadGrid.querySelector('[data-dir="right"]'),
            'down-left': dpadGrid.querySelector('[data-dir="down-left"]'),
            'down': dpadGrid.querySelector('[data-dir="down"]'),
            'down-right': dpadGrid.querySelector('[data-dir="down-right"]')
        };

        const DIR_KEYS = {
            'up': [-1],
            'down': [-2],
            'left': [-3],
            'right': [-4],
            'up-left': [49],     // Key 1: Native J2ME Up-Left Diagonal Jump
            'up-right': [51],    // Key 3: Native J2ME Up-Right Diagonal Jump
            'down-left': [-2],   // Same function as simple 8 (Down / Crouch)
            'down-right': [-2]   // Same function as simple 8 (Down / Crouch)
        };

        const joystick = new AdvancedMovementJoystick({
            deadZoneRadius: 16,
            maxRadius: 50,
            hysteresisAngleDeg: 6,
            cardinalHalfWidthDeg: 26
        });
        window.__joystick = joystick;
        window.__dpad = joystick;

        // Layer 6: Event Dispatch & Clean Key Sync (Diff previous keys vs new keys)
        function syncDirection(newDir) {
            if (newDir === currentDpadDir) return;

            // Visual feedback on the physical buttons
            if (currentDpadDir && dpadButtons[currentDpadDir]) {
                dpadButtons[currentDpadDir].classList.remove('active');
            }
            if (newDir && dpadButtons[newDir]) {
                dpadButtons[newDir].classList.add('active');
            }

            // Diff previous keys vs new keys -> KeyUp obsolete, KeyDown new
            const newKeys = newDir ? (DIR_KEYS[newDir] || []) : [];
            const keysToRelease = activeDpadKeys.filter(k => !newKeys.includes(k));
            const keysToPress = newKeys.filter(k => !activeDpadKeys.includes(k));

            keysToRelease.forEach(k => sendKeyEvent(k, false));
            keysToPress.forEach(k => sendKeyEvent(k, true));

            activeDpadKeys = newKeys;
            currentDpadDir = newDir;

            if (newDir) {
                triggerHaptic(8);
                unlockAudio();
            }
        }

        function handleDpadMove(clientX, clientY) {
            const rect = dpadGrid.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = clientX - cx;
            const dy = clientY - cy;

            const res = joystick.processMove(dx, dy);
            syncDirection(res.direction);
        }

        function releaseDpad() {
            const { centerTapped } = joystick.handleRelease();
            syncDirection(null);
            return centerTapped;
        }

        dpadGrid.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            dpadPointerId = e.pointerId;
            try { dpadGrid.setPointerCapture(e.pointerId); } catch (_) {}

            const rect = dpadGrid.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
            touchStartInCenter = (dist < 18);

            handleDpadMove(e.clientX, e.clientY);
        });

        dpadGrid.addEventListener('pointermove', (e) => {
            if (dpadPointerId === null || e.pointerId !== dpadPointerId) return;
            e.preventDefault();
            handleDpadMove(e.clientX, e.clientY);
        });

        const onDpadEnd = (e) => {
            if (dpadPointerId === null || e.pointerId !== dpadPointerId) return;
            e.preventDefault();
            try { dpadGrid.releasePointerCapture(e.pointerId); } catch (_) {}
            dpadPointerId = null;

            const centerTapped = releaseDpad();

            // Center tap detection (< inner center core): dispatch Fire / OK (-5)
            if (centerTapped) {
                sendKeyEvent(-5, true);
                setTimeout(() => sendKeyEvent(-5, false), 90);
                triggerHaptic(14);
                unlockAudio();
            }
        };

        dpadGrid.addEventListener('pointerup', onDpadEnd);
        dpadGrid.addEventListener('pointercancel', onDpadEnd);
    }

    // --- 2. INDEPENDENT ACTION BUTTONS (A, B, C, D, OPTNS, PAUSE) ---
    const actionButtons = document.querySelectorAll('.ctrl-btn');
    actionButtons.forEach((btn) => {
        const keyData = btn.getAttribute('data-key');
        if (!keyData) return;

        const keys = keyData.split(',');

        const getPrimaryJ2meKey = () => {
            for (let i = 0; i < keys.length; i++) {
                const k = KEY_MAP[keys[i].trim()];
                if (k !== undefined) return k;
            }
            return undefined;
        };

        const handlePress = (e) => {
            e.preventDefault();
            if (mpClient && mpClient.isMultiplayer && mpClient.status === "ACTIVE" && (keyData === 'F1' || keyData === 'F2')) {
                return;
            }
            btn.classList.add('active');
            try { btn.setPointerCapture(e.pointerId); } catch (_) {}
            triggerHaptic(12);
            unlockAudio();

            const j2meKey = getPrimaryJ2meKey();
            if (j2meKey !== undefined) sendKeyEvent(j2meKey, true);
        };

        const handleRelease = (e) => {
            e.preventDefault();
            btn.classList.remove('active');
            try { btn.releasePointerCapture(e.pointerId); } catch (_) {}

            const j2meKey = getPrimaryJ2meKey();
            if (j2meKey !== undefined) sendKeyEvent(j2meKey, false);
        };

        btn.addEventListener('pointerdown', handlePress);
        btn.addEventListener('pointerup', handleRelease);
        btn.addEventListener('pointercancel', handleRelease);
    });

    // Global fail-safe release on blur or pointerup outside
    const releaseAllActionButtons = () => {
        actionButtons.forEach((btn) => {
            if (btn.classList.contains('active')) {
                btn.classList.remove('active');
                const keyData = btn.getAttribute('data-key');
                if (keyData) {
                    const keys = keyData.split(',');
                    for (let i = 0; i < keys.length; i++) {
                        const j2meKey = KEY_MAP[keys[i].trim()];
                        if (j2meKey !== undefined) {
                            sendKeyEvent(j2meKey, false);
                            break;
                        }
                    }
                }
            }
        });
    };

    window.addEventListener('blur', () => {
        releaseAllActionButtons();
    });
}

function setupKeyboardControls() {
    const activeDirKeys = new Set();
    let currentDiagonalChord = null;

    const isDirCode = (code) => [
        'ArrowUp', 'KeyW', 'ArrowDown', 'KeyS',
        'ArrowLeft', 'KeyA', 'ArrowRight', 'KeyD'
    ].includes(code);

    const updateKeyboardDirection = () => {
        const hasUp = activeDirKeys.has('ArrowUp') || activeDirKeys.has('KeyW');
        const hasDown = activeDirKeys.has('ArrowDown') || activeDirKeys.has('KeyS');
        const hasLeft = activeDirKeys.has('ArrowLeft') || activeDirKeys.has('KeyA');
        const hasRight = activeDirKeys.has('ArrowRight') || activeDirKeys.has('KeyD');

        let targetChord = null;
        if (hasUp && hasRight) targetChord = 'up-right';
        else if (hasUp && hasLeft) targetChord = 'up-left';

        if (targetChord !== currentDiagonalChord) {
            // Release prior diagonal chord key
            if (currentDiagonalChord === 'up-right') {
                sendKeyEvent(51, false);
            } else if (currentDiagonalChord === 'up-left') {
                sendKeyEvent(49, false);
            }

            currentDiagonalChord = targetChord;

            if (currentDiagonalChord === 'up-right') {
                sendKeyEvent(-1, false);
                sendKeyEvent(-4, false);
                sendKeyEvent(51, true);
            } else if (currentDiagonalChord === 'up-left') {
                sendKeyEvent(-1, false);
                sendKeyEvent(-3, false);
                sendKeyEvent(49, true);
            } else {
                // Return to active cardinal keys
                if (hasUp) sendKeyEvent(-1, true);
                if (hasRight) sendKeyEvent(-4, true);
                if (hasLeft) sendKeyEvent(-3, true);
                if (hasDown) sendKeyEvent(-2, true);
            }

            // Sync visual indicators for diagonal arrows
            const urInd = document.querySelector('[data-dir="up-right"]');
            const ulInd = document.querySelector('[data-dir="up-left"]');
            if (urInd) urInd.classList.toggle('active', currentDiagonalChord === 'up-right');
            if (ulInd) ulInd.classList.toggle('active', currentDiagonalChord === 'up-left');
        }
    };

    window.addEventListener('keydown', (e) => {
        if (e.repeat) return;
        unlockAudio();

        if (e.code === 'KeyM') {
            isAudioMuted = !isAudioMuted;
            const actx = Manager.getAudioContext();
            if (actx) {
                if (isAudioMuted) actx.suspend().catch(() => {});
                else actx.resume().catch(() => {});
            }
            e.preventDefault();
            return;
        }

        if (isDirCode(e.code)) {
            activeDirKeys.add(e.code);
            triggerButtonActive(e.code, true);

            const hasUp = activeDirKeys.has('ArrowUp') || activeDirKeys.has('KeyW');
            const hasRight = activeDirKeys.has('ArrowRight') || activeDirKeys.has('KeyD');
            const hasLeft = activeDirKeys.has('ArrowLeft') || activeDirKeys.has('KeyA');

            if ((hasUp && hasRight) || (hasUp && hasLeft)) {
                updateKeyboardDirection();
                e.preventDefault();
                return;
            }
        }

        const keyCode = KEY_MAP[e.code];
        if (keyCode !== undefined) {
            sendKeyEvent(keyCode, true);
            triggerButtonActive(e.code, true);
            e.preventDefault();
        }
    });

    window.addEventListener('keyup', (e) => {
        if (isDirCode(e.code)) {
            activeDirKeys.delete(e.code);
            triggerButtonActive(e.code, false);
            updateKeyboardDirection();
        }

        if (currentDiagonalChord) {
            e.preventDefault();
            return;
        }

        const keyCode = KEY_MAP[e.code];
        if (keyCode !== undefined) {
            sendKeyEvent(keyCode, false);
            triggerButtonActive(e.code, false);
            e.preventDefault();
        }
    });

    window.addEventListener('blur', () => {
        if (currentDiagonalChord === 'up-right') sendKeyEvent(51, false);
        if (currentDiagonalChord === 'up-left') sendKeyEvent(49, false);
        currentDiagonalChord = null;
        activeDirKeys.clear();
    });
}

function fitScreenContainer() {
    const wrapper = document.getElementById('screen-wrapper');
    const container = document.getElementById('screen-container');
    if (!wrapper || !container) return;

    const availW = wrapper.clientWidth;
    const availH = wrapper.clientHeight;
    if (!availW || !availH) return;

    const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const maxW = isDesktop ? availW * 0.96 : availW;
    const maxH = isDesktop ? availH * 0.96 : availH;

    const targetRatio = 352 / 416;
    let w, h;
    if (maxW / maxH > targetRatio) {
        // Height-constrained (landscape / desktop)
        h = Math.floor(maxH);
        w = Math.round(h * targetRatio);
    } else {
        // Width-constrained (portrait phone)
        w = Math.floor(maxW);
        h = Math.round(w / targetRatio);
    }

    if (h > maxH) {
        h = Math.floor(maxH);
        w = Math.round(h * targetRatio);
    }
    if (w > maxW) {
        w = Math.floor(maxW);
        h = Math.round(w / targetRatio);
    }

    container.style.width = `${w}px`;
    container.style.height = `${h}px`;
}

function setupCanvas() {
    fitScreenContainer();
    const wrapper = document.getElementById('screen-wrapper');
    if (wrapper && typeof ResizeObserver !== 'undefined') {
        new ResizeObserver(() => fitScreenContainer()).observe(wrapper);
    }
    window.addEventListener('resize', fitScreenContainer);
    window.addEventListener('orientationchange', () => setTimeout(fitScreenContainer, 100));

    canvas = document.getElementById('display');
    canvas.width = 352;
    canvas.height = 416;
    ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
    ctx.imageSmoothingEnabled = false;

    const g = new Graphics(ctx);
    Display.getDisplay().setGraphics(g);

    // Interactive Touch & Mouse Controls on the Display Canvas
    const handleCanvasPointer = (e) => {
        if (!CoreEngine?.val_maincanvasbridge_a) return;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const cx = (e.clientX - rect.left) * scaleX;
        const cy = (e.clientY - rect.top) * scaleY;

        // 1. Softkey zone at the bottom of the screen (OPTNS / BACK / PAUSE)
        // Canvas is 352 x 416. The bottom softkey bar occupies cy >= 355.
        // LSK is on the left (cx <= 105), RSK is on the right (cx >= 247).
        if (cy >= 355) {
            if (cx <= 105) {
                // In active multiplayer combat, ignore menu softkeys
                if (mpClient && mpClient.isMultiplayer && mpClient.status === "ACTIVE") return;

                triggerHaptic(12);
                unlockAudio();
                const lskBtn = document.getElementById('screen-btn-lsk');
                if (lskBtn) {
                    lskBtn.classList.add('active');
                    setTimeout(() => lskBtn.classList.remove('active'), 120);
                }
                sendKeyEvent(-6, true);
                setTimeout(() => sendKeyEvent(-6, false), 90);
                return;
            }
            if (cx >= 247) {
                // In active multiplayer combat, ignore pause
                if (mpClient && mpClient.isMultiplayer && mpClient.status === "ACTIVE") return;

                triggerHaptic(12);
                unlockAudio();
                const rskBtn = document.getElementById('screen-btn-rsk');
                if (rskBtn) {
                    rskBtn.classList.add('active');
                    setTimeout(() => rskBtn.classList.remove('active'), 120);
                }
                sendKeyEvent(-7, true);
                setTimeout(() => sendKeyEvent(-7, false), 90);
                return;
            }
        }

        // 2. Active combat check:
        // When fighters are spawned and fighting (single-player or multiplayer), touches on the arena
        // must NEVER trigger combat actions (like Punch / -5). Combat is controlled by the keypad.
        const isCombat = Boolean(
            CoreEngine.val_coreengine_b !== null ||
            (mpClient && mpClient.isMultiplayer && mpClient.status === "ACTIVE")
        );
        if (isCombat) {
            return;
        }

        triggerHaptic(12);
        unlockAudio();

        // 3. Hero Select Grid (single player or multiplayer):
        if (CoreEngine.val_int_cw === 1 || (mpClient && mpClient.isMultiplayer && mpClient.status === "HERO_SELECT")) {
            if (mpClient && mpClient.isMultiplayer && mpClient._heroSelected) return; // Already locked in

            const startX = CoreEngine.val_int_bT || 0;
            const startY = CoreEngine.val_int_bU || 0;
            const size = CoreEngine.val_int_bQ || 40;

            if (typeof PatternTable !== 'undefined' && PatternTable.val_arr_arr_byte_a) {
                for (let i = 0; i < PatternTable.val_arr_arr_byte_a.length; i++) {
                    const entry = PatternTable.val_arr_arr_byte_a[i];
                    const px = (entry[2] || 0) + startX;
                    const py = (entry[3] || 0) + startY;
                    if (cx >= px - 6 && cx <= px + size + 6 && cy >= py - 6 && cy <= py + size + 6) {
                        CoreEngine.val_byte_n = i;
                        sendKeyEvent(-5, true);
                        setTimeout(() => sendKeyEvent(-5, false), 90);
                        return;
                    }
                }
            }
            return;
        }

        // 4. Initial screens & Title Screen (val_int_h < 9):
        // "TOUCH THE SCREEN TO START" or language/sound selections
        if (CoreEngine.val_int_h < 9) {
            sendKeyEvent(-5, true);
            setTimeout(() => sendKeyEvent(-5, false), 90);
            return;
        }

        // 5. Main Menu (val_int_h === 9):
        if (CoreEngine.val_int_h === 9 && Array.isArray(CoreEngine.val_arr_int_t)) {
            // Up scroll arrow
            if (cy < 135 && cy > 40) {
                sendKeyEvent(-1, true);
                setTimeout(() => sendKeyEvent(-1, false), 90);
                return;
            }
            // Down scroll arrow
            if (cy > 300 && cy < 380) {
                sendKeyEvent(-2, true);
                setTimeout(() => sendKeyEvent(-2, false), 90);
                return;
            }

            const startY = CoreEngine.val_int_aL || 139;
            const itemH = (CoreEngine.val_arr_int_P && CoreEngine.val_arr_int_P[CoreEngine.val_int_aH]) || 45;
            const gap = (CoreEngine.val_arr_int_Q && CoreEngine.val_arr_int_Q[CoreEngine.val_int_aH]) || 10;
            const step = itemH + gap;

            for (let i = 0; i < CoreEngine.val_arr_int_t.length; i++) {
                const top = startY + i * step;
                const bottom = top + itemH + 6;
                if (cy >= top - 6 && cy <= bottom) {
                    const targetId = CoreEngine.val_arr_int_t[i];
                    CoreEngine.val_int_aD = targetId;
                    sendKeyEvent(-5, true);
                    setTimeout(() => sendKeyEvent(-5, false), 90);
                    return;
                }
            }
            return;
        }

        // 6. Choose Destiny / Difficulty Tower (val_int_h === 10):
        if (CoreEngine.val_int_h === 10) {
            sendKeyEvent(-5, true);
            setTimeout(() => sendKeyEvent(-5, false), 90);
        }
    };

    canvas.addEventListener('pointerdown', (e) => {
        if (e.target && e.target.classList && e.target.classList.contains('on-screen-softkey')) return;
        handleCanvasPointer(e);
    });
}

// Bookkeeping for the online fight, null outside one:
//   resuming        - we reloaded mid-bout and are loading back in
//   pendingSnapshot - the opponent's view of the fight, applied once our fight is live again
//   lastHp, frame   - P1 streams health as it changes plus a periodic position/timer sync
//   rounds          - engine round wins [P1, P2] already reported to the server
let onlineBout = null;

function boutSnapshot() {
    const fighterB = CoreEngine.val_coreengine_b;
    const fighterC = CoreEngine.val_coreengine_c;
    if (!fighterB || !fighterC || CoreEngine.val_int_dN !== 2) return {};
    return {
        p1_hp: fighterB.currentHealth,
        p2_hp: fighterC.currentHealth,
        p1_x: fighterB.exec_a_to_int(),
        p2_x: fighterC.exec_a_to_int(),
        round_timer: CoreEngine.val_int_dS
    };
}

function applyBoutSnapshot(snapshot) {
    const fighterB = CoreEngine.val_coreengine_b;
    const fighterC = CoreEngine.val_coreengine_c;
    if (snapshot.p1_hp === undefined || !fighterB || !fighterC) return;
    fighterB.currentHealth = snapshot.p1_hp;
    fighterC.currentHealth = snapshot.p2_hp;
    fighterB.setActorPosition(snapshot.p1_x, 0);
    fighterC.setActorPosition(snapshot.p2_x, 0);
    CoreEngine.val_int_dS = snapshot.round_timer;
}

// Runs after each engine frame of an online bout. The native arcade flow handles rounds, the timer and
// KOs on both phones; P1's phone is the authority that streams health and reports scored rounds.
function stepOnlineBout() {
    const fighterB = CoreEngine.val_coreengine_b;
    const fighterC = CoreEngine.val_coreengine_c;
    if (!fighterB || !fighterC || CoreEngine.val_int_dN !== 2) return;

    // Back in after a reload: once our round intro is over, take the opponent's view of the fight
    // and let them unfreeze
    if (onlineBout.resuming && CoreEngine.val_int_dL === 2 && onlineBout.pendingSnapshot) {
        onlineBout.resuming = false;
        applyBoutSnapshot(onlineBout.pendingSnapshot);
        onlineBout.lastHp = [fighterB.currentHealth, fighterC.currentHealth];
        mpClient.sendBoutReady();
    }

    if (mpClient.role !== "p1") return;

    const p1Hp = fighterB.currentHealth;
    const p2Hp = fighterC.currentHealth;
    onlineBout.frame++;
    if (p1Hp !== onlineBout.lastHp[0] || p2Hp !== onlineBout.lastHp[1] || onlineBout.frame % 30 === 0) {
        onlineBout.lastHp = [p1Hp, p2Hp];
        mpClient.sendSync(p1Hp, p2Hp, fighterB.exec_a_to_int(), fighterC.exec_a_to_int(), CoreEngine.val_int_dS);
    }

    // Report each round as the engine scores it; a time-out on equal health scores both
    const roundsB = CoreEngine.val_int_dU;
    const roundsC = CoreEngine.val_int_dV;
    const wonB = roundsB > onlineBout.rounds[0];
    const wonC = roundsC > onlineBout.rounds[1];
    if (wonB || wonC) {
        mpClient.sendRoundWin(wonB && wonC ? "draw" : (wonB ? "p1" : "p2"));
    }
    onlineBout.rounds = [roundsB, roundsC];
}

function startAnimationLoop() {
    function loop() {
        if (midlet && !midlet.isExitRequested) {
            try {
                // A frozen online bout keeps its last frame on screen; the banner below says why
                if (!(mpClient && mpClient.isMultiplayer && mpClient.paused)) {
                    midlet.stepFrame();
                }

                if (mpClient && mpClient.isMultiplayer) {
                    // 1. Hero Selection Phase on Native Canvas
                    if (mpClient.status === "HERO_SELECT") {
                        if (CoreEngine.val_bool_W && !mpClient._heroSelected) {
                            mpClient._heroSelected = true;
                            let hero = CoreEngine.exec_n_to_int();
                            if (hero < 0 || hero > 6) {
                                hero = Math.floor(Math.random() * 7);
                            }
                            mpClient._heroId = hero;
                            console.log(`[Multiplayer] Local player locked hero: ${hero}`);
                            mpClient.sendHeroLock(hero, CoreEngine.val_int_bw);
                            CoreEngine.val_int_aA = CoreEngine.val_int_bF;
                        }
                        // Online the grid only locks a hero: never continue to the arcade tower or back to the menu
                        CoreEngine.val_bool_W = false;
                        CoreEngine.val_bool_X = false;
                    }

                    // 2. Active Combat Phase
                    if (mpClient.status === "ACTIVE" && onlineBout && !mpClient.paused) {
                        stepOnlineBout();
                    }

                    // 3. Status banner (hero locked, opponent dropped, result) drawn over the native frame
                    const bannerText = mpClient.bannerText();
                    if (bannerText && canvas && ctx) {
                        ctx.save();
                        const bH = 34;
                        const bY = canvas.height - bH - 18;
                        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
                        ctx.fillRect(0, bY, canvas.width, bH);
                        ctx.strokeStyle = '#dcb450';
                        ctx.lineWidth = 1.5;
                        ctx.strokeRect(0, bY, canvas.width, bH);

                        ctx.fillStyle = '#ffeedd';
                        ctx.font = 'bold 12px monospace';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillText(bannerText, canvas.width / 2, bY + bH / 2);
                        ctx.restore();
                    }
                }
            } catch (err) {
                console.error("[Game Loop Error]:", err);
            }
        }
        animFrameId = requestAnimationFrame(loop);
    }
    animFrameId = requestAnimationFrame(loop);
}

async function bootstrap() {
    console.log("[UMK3] Bootstrapping Pure Native JavaScript Engine...");

    const progressBar = document.getElementById('progress-bar-fill');
    const splashScreen = document.getElementById('splash-screen');
    const canvasEl = document.getElementById('display');

    try {
        // 1. Fetch & register assets
        await loadAllAssets('assets/', (loaded, total, filename) => {
            const pct = Math.round((loaded / total) * 100);
            if (progressBar) progressBar.style.width = `${pct}%`;
        });

        if (progressBar) progressBar.style.width = '100%';

        // 2. Setup canvas & LCDUI graphics bridge
        setupCanvas();

        // 3. Setup input listeners (D-pad vector sliding & 3D button controls)
        setupInputControls();
        setupKeyboardControls();

        // 4. Initialize engine static tables
        initEngine();

        // 5. Instantiate SDKMIDlet and boot game
        midlet = new SDKMIDlet();
        midlet.startApp();
        window.CoreEngine = CoreEngine;
        window.midlet = midlet;
        window.Manager = Manager;

        console.log("[UMK3] Native Engine Booted Successfully!");

        // 6. Smoothly dismiss full-screen splash veil (exact nightmare-b4-xmas timing)
        if (splashScreen) {
            splashScreen.classList.add('fade-out');
            setTimeout(() => {
                try { splashScreen.remove(); } catch (_) {}
                fitScreenContainer();
            }, 360);
        }
        if (canvasEl) {
            canvasEl.focus();
        }

        // 7. Initialize Multiplayer Subsystem
        if (mpClient && mpClient.isMultiplayer) {
            console.log("[Multiplayer] Entering Character Selection directly on load...");
            mpClient.status = "HERO_SELECT";
            mpClient._heroSelected = false;
            mpClient._heroId = null;
            CoreEngine.setGameState(11);
            CoreEngine.exec_u_int_to_void(1);
        }

        mpClient.onHeroSelectStartCallback = (data) => {
            console.log("[Multiplayer] Entering native hero select grid...");
            mpClient.status = "HERO_SELECT";
            CoreEngine.onlineVersus = null;
            onlineBout = null;
            if (!mpClient._heroSelected && CoreEngine.val_int_cw !== 1) {
                CoreEngine.setGameState(11);
                CoreEngine.exec_u_int_to_void(1);
            }
        };

        mpClient.onVersusStartCallback = (p1Hero, p2Hero, data) => {
            if (mpClient._boutLive) {
                // Rejoined after a socket blip: our fight kept its state, so the opponent can unfreeze now
                mpClient.sendBoutReady();
                return;
            }
            console.log(`[Multiplayer] Versus: P1=${p1Hero}, P2=${p2Hero}, stage=${data.stage}, resume=${!!data.resume}`);
            mpClient._boutLive = true;
            const localSide = (mpClient.role === 'p1') ? 0 : 1;
            const resumeRounds = data.resume ? [data.p1_rounds || 0, data.p2_rounds || 0] : null;
            onlineBout = {
                resuming: !!data.resume,
                pendingSnapshot: null,
                lastHp: [100, 100],
                frame: 0,
                rounds: resumeRounds || [0, 0]
            };

            // Arcade rules with fighter C as the remote human (see CoreEngine.onlineVersus)
            CoreEngine.val_bool_am = false;
            CoreEngine.onlineVersus = {
                p2Masks: { dI: 0, dJ: 0, dK: 0, dF: 0, dG: 0, dH: 0 },
                routeLocalBits: (bits, isDown) => {
                    CoreEngine.applyInputBits(localSide, bits, isDown);
                    mpClient.sendInput(bits, isDown);
                },
                healthFromPeer: localSide === 1,
                stage: data.stage ?? 0,
                controlTypes: [data.p1.control === 0 ? 0 : 1, data.p2.control === 0 ? 0 : 1],
                resumeRounds
            };

            // Native versus: a one-rung tower with P2 as the next opponent shows both fighters, then the engine
            // loads the arcade fight for P1 (left) vs P2 (right). Mirror matches need nothing extra: the engine
            // skins fighter C from val_arr_int_aT when both heroes are the same.
            const VERSUS_HEADER_TEXT = 24; // "FIGHT!" in the engine's text table (towers use NOVICE/WARRIOR/MASTER)
            const rung = [VERSUS_HEADER_TEXT, p2Hero];
            CoreEngine.val_arr_arr_int_d = [rung, rung.slice(), rung.slice()];
            CoreEngine.val_int_cy = p1Hero;
            CoreEngine.val_int_cz = 0;
            CoreEngine.val_int_cA = 0;
            CoreEngine.exec_u_int_to_void(4);
        };

        // The opponent's key mask changes drive their fighter on our phone: P1 is fighter B, P2 is fighter C
        mpClient.onPeerInputCallback = (bits, isDown) => {
            if (!CoreEngine.onlineVersus) return;
            CoreEngine.applyInputBits(mpClient.role === 'p1' ? 1 : 0, bits, isDown);
        };

        mpClient.onPeerRejoinedCallback = () => {
            mpClient.sendSnapshot(boutSnapshot());
        };

        mpClient.onPeerSnapshotCallback = (data) => {
            if (onlineBout && onlineBout.resuming) {
                onlineBout.pendingSnapshot = data;
            }
        };

        mpClient.onPeerSyncCallback = (data) => {
            // P2 receives authoritative sync corrections from P1
            if (mpClient.role === 'p2' && CoreEngine.val_coreengine_b && CoreEngine.val_coreengine_c) {
                if (data.p1_hp !== undefined && data.p1_hp >= 0) {
                    CoreEngine.val_coreengine_b.currentHealth = data.p1_hp;
                }
                if (data.p2_hp !== undefined && data.p2_hp >= 0) {
                    CoreEngine.val_coreengine_c.currentHealth = data.p2_hp;
                }
                if (data.round_timer !== undefined && data.round_timer >= 0) {
                    CoreEngine.val_int_dS = data.round_timer;
                }
                if (data.p1_x !== undefined && typeof CoreEngine.val_coreengine_b.exec_a_to_int === 'function') {
                    const curX = CoreEngine.val_coreengine_b.exec_a_to_int();
                    if (Math.abs(curX - data.p1_x) > 16) {
                        CoreEngine.val_coreengine_b.setActorPosition(data.p1_x, 0);
                    }
                }
                if (data.p2_x !== undefined && typeof CoreEngine.val_coreengine_c.exec_a_to_int === 'function') {
                    const curX = CoreEngine.val_coreengine_c.exec_a_to_int();
                    if (Math.abs(curX - data.p2_x) > 16) {
                        CoreEngine.val_coreengine_c.setActorPosition(data.p2_x, 0);
                    }
                }
            }
        };

        mpClient.initUI();

        // 8. Start requestAnimationFrame loop
        startAnimationLoop();

    } catch (err) {
        console.error("[UMK3 Bootstrap Failed]:", err);
    }
}

// Start once DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
} else {
    bootstrap();
}
