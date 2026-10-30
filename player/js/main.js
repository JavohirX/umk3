import { loadAllAssets } from './assets.js';
import { Graphics, Display } from './j2me/graphics.js';
import { Manager } from './j2me/audio.js';
import { initEngine, SDKMIDlet, CoreEngine } from './engine/umk3.js';
import { MultiplayerClient } from './network.js';

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

    if (mpClient && mpClient.isMultiplayer && mpClient.status === "ACTIVE") {
        mpClient.sendInput(keyCode, isDown);
        if (mpClient.role === 'p2') {
            // Local player is P2 -> drive Fighter C directly!
            const localFighter = CoreEngine.val_coreengine_c;
            if (localFighter) {
                if (isDown) {
                    if (keyCode === 53 || keyCode === -5) localFighter.updateActor(4);
                    else if (keyCode === 55) localFighter.updateActor(5);
                    else if (keyCode === 57) localFighter.updateActor(27);
                    else if (keyCode === -1 || keyCode === 49 || keyCode === 51) localFighter.updateActor(12);
                    else if (keyCode === -2 || keyCode === 56) localFighter.updateActor(3);
                    else if (keyCode === -3) localFighter.setActorAnimation(-1);
                    else if (keyCode === -4) localFighter.setActorAnimation(1);
                } else {
                    if (keyCode === -2 || keyCode === 57 || keyCode === -3 || keyCode === -4) {
                        localFighter.updateActor(0);
                    }
                }
                return;
            }
        }
    }

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

function setupCanvas() {
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

        triggerHaptic(12);
        unlockAudio();

        // 1. Initial screens & Title Screen (val_int_h < 9):
        // "TOUCH THE SCREEN TO START" or language/sound selections
        if (CoreEngine.val_int_h < 9) {
            sendKeyEvent(-5, true);
            setTimeout(() => sendKeyEvent(-5, false), 90);
            return;
        }

        // 2. Main Menu (val_int_h === 9):
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
        }

        // 3. Selection Screens (e.g. Choose Destiny / Difficulty / Character Select):
        if (CoreEngine.val_int_h < 12) {
            sendKeyEvent(-5, true);
            setTimeout(() => sendKeyEvent(-5, false), 90);
        }
    };

    canvas.addEventListener('pointerdown', (e) => {
        if (e.target && e.target.classList && e.target.classList.contains('on-screen-softkey')) return;
        handleCanvasPointer(e);
    });
}

function startAnimationLoop() {
    function loop() {
        if (midlet && !midlet.isExitRequested) {
            try {
                midlet.stepFrame();

                // Monitor active multiplayer health for KO resolution
                if (mpClient && mpClient.isMultiplayer && mpClient.status === "ACTIVE") {
                    if (CoreEngine.val_coreengine_b && CoreEngine.val_coreengine_c) {
                        if (CoreEngine.val_coreengine_b.currentHealth <= 0 && mpClient.role === 'p1') {
                            mpClient.status = "COMPLETED";
                            mpClient.sendPacket({
                                type: "match_finish",
                                winner_id: mpClient.opponent ? mpClient.opponent.id : "p2",
                                reason: "KNOCKOUT"
                            });
                        } else if (CoreEngine.val_coreengine_c.currentHealth <= 0 && mpClient.role === 'p1') {
                            mpClient.status = "COMPLETED";
                            mpClient.sendPacket({
                                type: "match_finish",
                                winner_id: mpClient.userId,
                                reason: "KNOCKOUT"
                            });
                        }
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
            }, 360);
        }
        if (canvasEl) {
            canvasEl.focus();
        }

        // 7. Initialize Multiplayer Subsystem
        mpClient.onMatchStartCallback = (data) => {
            console.log("[Multiplayer] Match starting in 2-Player Versus Mode!");
            CoreEngine.val_bool_am = true;
            if (CoreEngine.val_int_h < 11) {
                CoreEngine.val_int_dQ = 0; // Scorpion
                CoreEngine.val_int_dR = 1; // Sub-Zero
                CoreEngine.setGameState(11); // Enter combat
            }
        };

        mpClient.onPeerInputCallback = (keyCode, isDown) => {
            const targetFighter = (mpClient.role === 'p1') ? CoreEngine.val_coreengine_c : CoreEngine.val_coreengine_b;
            if (!targetFighter) return;

            if (isDown) {
                if (keyCode === 53 || keyCode === -5) targetFighter.updateActor(4);
                else if (keyCode === 55) targetFighter.updateActor(5);
                else if (keyCode === 57) targetFighter.updateActor(27);
                else if (keyCode === -1 || keyCode === 49 || keyCode === 51) targetFighter.updateActor(12);
                else if (keyCode === -2 || keyCode === 56) targetFighter.updateActor(3);
                else if (keyCode === -3) targetFighter.setActorAnimation(-1);
                else if (keyCode === -4) targetFighter.setActorAnimation(1);
            } else {
                if (keyCode === -2 || keyCode === 57 || keyCode === -3 || keyCode === -4) {
                    targetFighter.updateActor(0);
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
