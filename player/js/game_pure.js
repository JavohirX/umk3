import { loadAllAssets } from './assets.js';
import { Graphics, Display } from './j2me/graphics.js';
import { Manager } from './j2me/audio.js';
import * as EngineModule from './engine/umk3.js';
import { initEngine, SDKMIDlet, CoreEngine } from './engine/umk3.js';
import { MultiplayerClient } from './network_pure.js';
import { stepMatchEnd } from './match_end.js';
import { createStateSaver } from './rollback_state.js';
import {
    newNetStats, noteFrame, noteTick, noteWork, noteInput, stallBegin, stallAdvance, stallSkip, stallEnd, reportFields
} from './net_telemetry.js';

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

// Keys that confirm on the result screens: the centre/OK key and the A (punch) button
const CONFIRM_KEYS = [-5, 53];

function sendKeyEvent(keyCode, isDown) {
    if (!CoreEngine.val_maincanvasbridge_a) return;

    // Watching a match (live or replay): the fight isn't ours, keys only work the result screen
    if (mpClient.isReplay || (mpClient.isMultiplayer && mpClient.isSpectator)) {
        if (isDown) handleViewerKey(keyCode);
        return;
    }
    if (mpClient && mpClient.isMultiplayer) {
        // A decided or expired online match stays on its result screen; keys must not start single-player
        if (["COMPLETED", "CANCELLED", "REJECTED"].includes(mpClient.status)) {
            if (isDown) handleResultKey(keyCode);
            return;
        }
        // The menu softkeys would open the pause menu or the move list on this screen only, mid-fight
        if (keyCode === -6 || keyCode === -7) return;
        // A frozen bout would replay queued presses on resume; releases still pass so no key sticks
        if (mpClient.paused && isDown) return;
    }

    // Online, the engine hands the resulting key mask change to CoreEngine.onlineVersus.routeLocalBits,
    // which drives our own fighter and streams the change to the opponent.
    // The engine's key queue holds 8 events and empties only when a tick runs. While the fight waits for the
    // opponent's input it fills, then drops presses (from 5 queued) and releases (from 6), and a dropped
    // release leaves the key held for good. So in an online fight a key goes to the engine's key handling now,
    // between frames, exactly as the queue would hand it over at the next tick.
    if (onlineFightRunning()) {
        try {
            if (isDown) CoreEngine.exec_f_int_to_void(keyCode);
            else CoreEngine.exec_i_int_to_void(keyCode);
        } catch (e) {
            console.warn('[Multiplayer] Key event failed:', e);
        }
        return;
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

        // Unit vector per direction: the stone cross rocks toward it (--dx / --dy in play.html)
        const DIAG = Math.SQRT1_2;
        const DIR_TILT = {
            'up': [0, -1], 'down': [0, 1], 'left': [-1, 0], 'right': [1, 0],
            'up-left': [-DIAG, -DIAG], 'up-right': [DIAG, -DIAG],
            'down-left': [-DIAG, DIAG], 'down-right': [DIAG, DIAG]
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

            // The cross lights its arms from data-active (a diagonal lights two) and tilts by --dx / --dy
            const [tiltX, tiltY] = newDir ? DIR_TILT[newDir] : [0, 0];
            dpadGrid.dataset.active = newDir || '';
            dpadGrid.style.setProperty('--dx', tiltX);
            dpadGrid.style.setProperty('--dy', tiltY);

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
    // Not `desynchronized`: that low-latency mode draws straight to the screen on Windows (Telegram Desktop),
    // so half-drawn frames showed - the arena without the HUD drawn on top made the health bars flicker
    ctx = canvas.getContext('2d', { alpha: false });
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

        // 0. A result screen (online match over, replay over): tapping the picture confirms, like A
        if (resultScreenShown() && cy < 355) {
            triggerHaptic(12);
            sendKeyEvent(-5, true);
            return;
        }

        // 1. The softkeys (OPTNS / BACK / PAUSE) are not handled here: #screen-btn-lsk / #screen-btn-rsk sit
        // on top of the game's own corner icons (see .on-screen-softkey in play.html) and take those taps.
        // A second, wider zone here would fire softkeys from taps that miss the icons.

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
            const pad = Math.floor((CoreEngine.val_int_bR || 0) / 2); // half the gap, so neighbouring cells never overlap

            if (typeof PatternTable !== 'undefined' && PatternTable.val_arr_arr_byte_a) {
                for (let i = 0; i < PatternTable.val_arr_arr_byte_a.length; i++) {
                    const entry = PatternTable.val_arr_arr_byte_a[i];
                    // Entries hold grid columns/rows; the engine draws them at exec_a_byte_to_int (cell + gap) spacing
                    const px = CoreEngine.exec_a_byte_to_int(entry[2]) + startX;
                    const py = CoreEngine.exec_a_byte_to_int(entry[3]) + startY;
                    if (cx >= px - pad && cx <= px + size + pad && cy >= py - pad && cy <= py + size + pad) {
                        // Move the native cursor (name + preview), then the engine's select rules apply:
                        // a fighter confirms, "?" spins the roulette, a locked fighter does nothing
                        CoreEngine.exec_e_byte_to_void(i);
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

// Online fights run on rollback netcode. Both phones step the same engine on a fixed 60 ticks/s clock and
// apply both players' key mask changes on the same tick, `delay` ticks after they happen, so our own presses
// show after the same short delay whatever the connection. The opponent's input for a tick is often still
// on its way when we get there: we guess it (no change - they keep holding what they held) and carry on.
// When their real input arrives and differs, we put the fight back the way it was before that tick, replay
// the ticks since with the real input, and the next frame draws the corrected picture. We only wait for the
// opponent when our guesses would run more than MAX_PREDICTION ticks past their last input.
// With identical inputs, RNG seed and clock the two simulations end up identical; the round scores and the
// per-second fingerprints both phones compare are taken from ticks whose inputs are all in, never guesses.
const LOCKSTEP_TICK_MS = 1000 / 60;
const MIN_INPUT_DELAY = 2;
const MAX_INPUT_DELAY = 15;
const MAX_PREDICTION = 8;
const NO_INPUT = [0, 0];

// Saves and restores the whole engine state (see rollback_state.js). Left out is what follows this phone's
// real keys rather than the fight: the engine's key event queue, and the scene's record of which key each
// key slot holds (sceneExtraShorts, sceneStateId). The engine passes on a release only for the key that
// record holds, and ignores a press of the key it already holds. A rewind to before a press would forget the
// key is down, so its release never reached the fight and the key stayed held on both phones; a rewind to
// before a release would make the next press of that key do nothing. Presses only reach the fight through
// `pending`, which a rewind never touches either.
let stateSaver = null;
function getStateSaver() {
    if (!stateSaver) {
        const engineClasses = Object.values(EngineModule).filter((v) => typeof v === 'function' && /^[A-Z]/.test(v.name));
        const scene = CoreEngine.val_scenebase_a;
        stateSaver = createStateSaver([CoreEngine, midlet, ...engineClasses.filter((c) => c !== CoreEngine)], {
            skipFields: [[midlet, 'frameHistoryArray'], [midlet, 'loopState'],
                         [scene, 'sceneExtraShorts'], [scene, 'sceneStateId']]
        });
    }
    return stateSaver;
}

// The current online fight, null outside one:
//   setup          - versus info both phones build the fight from (heroes, stage, control types, seed)
//   segment        - bumped when both phones restart the bout after a reconnect; older inputs are ignored
//   tick, delay    - next tick to simulate, and our input delay in ticks
//   local, remote  - tick -> [pressedBits, releasedBits] for us and the opponent, kept while a rollback
//                    could still replay that tick
//   remoteNext     - the first tick whose opponent input hasn't arrived; ticks from here on run on a guess
//   snapshots      - [{tick, state}] oldest first: the engine state before each of those ticks. There is
//                    always one at or before remoteNext while any tick runs on a guess
//   rollbackTo     - the earliest tick whose guess turned out wrong, or null
//   facts          - tick -> [fight phase, P1 rounds, P2 rounds, fingerprint or null] for ticks run but
//                    not yet confirmed; factsNext is the next tick waiting for confirmation
//   pending        - our key mask changes captured during the tick being simulated
//   acc, last      - real time banked towards the next tick
//   rounds         - engine round wins [P1, P2] already reported to the server
//   delayChange    - +1/-1 advice from the opponent on our delay, applied at the next tick we schedule
//   peerHintSeq    - sequence number of the last advice we applied
//   advice         - our current advice on the opponent's delay, sent with every input
//   window         - this second's waits for their input and the least slack their inputs arrived with
//   goodSeconds    - the last few seconds' spare ticks (null: an input came too late), for lowering their delay
//   peerTick, peerTickAt - the latest tick the opponent reported simulating, and when that report arrived
//   stallStart     - when we started waiting for their input for the current tick, or null
//   stats          - counters reported to the server every 10s (see reportNetStats)
//   openStall      - the same wait as the stats see it (see stallBegin in net_telemetry.js)
//   hiddenAt       - when the page left the screen, or null
//   skipFrame      - the next frame's length isn't the fight's: the page was hidden, or the fight was being built
//   statsClosed    - the final report went out; the fight's last moments play out unmeasured
let onlineBout = null;
// Set while we rejoin a bout: the versus info and the opponent's restart snapshot, whichever arrives first
let onlineResume = null;

// True while runOnlineBout drives the engine instead of the normal frame loop (see startAnimationLoop)
function onlineFightRunning() {
    return !!(mpClient && mpClient.isMultiplayer && onlineBout && mpClient.status !== "HERO_SELECT");
}

function startOnlineSegment(setup, segment, resume) {
    // What the bout being replaced did since its last report
    if (onlineBout) closeNetStats(onlineBout, performance.now(), "restart");
    // Our input for a tick must reach the opponent before their guesses run MAX_PREDICTION ticks past it:
    // one-way trip to them in ticks, plus three for frame timing and jitter, less what guessing covers.
    // Before a measurement exists, relayed inputs cross the server twice.
    const peerRtt = mpClient.peerRtt ?? (mpClient.rtt ? mpClient.rtt * 2 : 200);
    const oneWayTicks = Math.ceil(peerRtt / 2 / LOCKSTEP_TICK_MS);
    const delay = Math.min(MAX_INPUT_DELAY, Math.max(MIN_INPUT_DELAY, oneWayTicks + 3 - MAX_PREDICTION));
    const now = performance.now();
    onlineBout = {
        setup, segment, tick: 0, delay,
        local: new Map(), remote: new Map(), pending: [0, 0],
        remoteNext: 0, snapshots: [], rollbackTo: null, facts: new Map(), factsNext: 0,
        acc: 0, last: now, lastTickAt: now,
        rounds: resume ? resume.rounds.slice() : [0, 0],
        delayChange: 0, peerHintSeq: 0, advice: { hint: 0, seq: 0 },
        window: { stalls: 0, stallMs: 0, minLead: Infinity, since: now }, goodSeconds: [],
        peerTick: 0, peerTickAt: 0, heardFromPeer: false, stallStart: null,
        hashes: new Map(), peerHashes: new Map(), lastResyncAt: 0,
        stats: newNetStats(now, delay),
        openStall: null, hiddenAt: document.hidden ? now : null, skipFrame: true, statsClosed: false
    };
    for (let t = 0; t < delay; t++) {
        onlineBout.local.set(t, [0, 0]);
        mpClient.sendLockstepInput(segment, t, 0, 0);
    }
    mpClient.selfOffline = false;
    mpClient._boutLive = true;
    resetHaptics();
    console.log(`[Multiplayer] Lockstep segment ${segment}: input delay ${delay} ticks (opponent round trip ${Math.round(peerRtt)}ms)`);

    resetEngineForBout(setup, segment, resume, (bits, isDown) => {
        const pending = onlineBout.pending;
        if (isDown) {
            pending[0] |= bits;
            // Released and pressed again within one tick: a tick applies its presses before its releases, so
            // keeping the release would leave the key up while it is held
            pending[1] &= ~bits;
        } else {
            pending[1] |= bits;
        }
    });
    getStateSaver().refresh();
    onlineBout.stats.setupMs = performance.now() - now;
    // The score this segment starts from, so the server sees both phones agree on it
    mpClient.sendRoundScore(onlineBout.rounds[0], onlineBout.rounds[1]);
}

// Puts the engine into the versus screen for this fight, from the same state on every device that runs it
// (both players, and anyone watching or replaying): same seed, first frame delta, round-intro timer offset
// (left over from the select screen), no keys held, and no fight phase or clock left over from an
// interrupted bout (a reloaded phone starts with none)
function resetEngineForBout(setup, segment, resume, routeLocalBits) {
    CoreEngine.val_bool_am = false;
    CoreEngine.globalRandom.setSeed(setup.seed + segment);
    CoreEngine.val_long_a = 0;
    CoreEngine.val_int_aA = 0;
    CoreEngine.val_int_dN = CoreEngine.val_int_dL = CoreEngine.val_int_dM = 0;
    CoreEngine.val_int_dO = CoreEngine.val_int_dP = CoreEngine.val_int_dS = 0;
    CoreEngine.val_int_dF = CoreEngine.val_int_dG = CoreEngine.val_int_dH = 0;
    CoreEngine.val_int_dI = CoreEngine.val_int_dJ = CoreEngine.val_int_dK = 0;
    CoreEngine.onlineVersus = {
        p2Masks: { dI: 0, dJ: 0, dK: 0, dF: 0, dG: 0, dH: 0 },
        routeLocalBits,
        stage: setup.stage,
        controlTypes: setup.controlTypes,
        resume,
        // The engine calls this when it loads fighter C's sprites (see exec_f_to_bool)
        recolorMirror: setup.p1Hero === setup.p2Hero ? recolorMirrorSheets : null
    };

    // Native versus: a one-rung tower with P2 as the next opponent shows both fighters, then the engine
    // loads the arcade fight for P1 (left) vs P2 (right). Mirror matches get the engine's alternate
    // palette for fighter C (val_arr_int_aT), pushed further apart by recolorMirrorSheets if needed.
    const VERSUS_HEADER_TEXT = 24; // "FIGHT!" in the engine's text table (towers use NOVICE/WARRIOR/MASTER)
    const rung = [VERSUS_HEADER_TEXT, setup.p2Hero];
    CoreEngine.val_arr_arr_int_d = [rung, rung.slice(), rung.slice()];
    CoreEngine.val_int_cy = setup.p1Hero;
    CoreEngine.val_int_cz = 0;
    CoreEngine.val_int_cA = 0;
    CoreEngine.exec_u_int_to_void(4);
}

// The versus info both phones (and viewers) build the fight from, out of a versus_start message
function setupFromVersus(data) {
    return {
        p1Hero: data.p1.hero_id,
        p2Hero: data.p2.hero_id,
        stage: data.stage ?? 0,
        seed: data.seed ?? 1,
        controlTypes: [data.p1.control === 0 ? 0 : 1, data.p2.control === 0 ? 0 : 1],
        names: [data.p1.name || "P1", data.p2.name || "P2"]
    };
}

// Restart point for both phones after a reconnect: the round score, plus health and clock if mid-round
function boutRestartState() {
    const fighterB = CoreEngine.val_coreengine_b;
    const fighterC = CoreEngine.val_coreengine_c;
    const resume = { rounds: [CoreEngine.val_int_dU, CoreEngine.val_int_dV], health: null, timer: 0 };
    if (CoreEngine.val_int_dN !== 2 || !fighterB || !fighterC) {
        resume.rounds = onlineBout ? onlineBout.rounds.slice() : [0, 0];
    } else if (fighterB.currentHealth > 0 && fighterC.currentHealth > 0) {
        // A finished round restarts as the next one rather than replaying a knockout
        resume.health = [fighterB.currentHealth, fighterC.currentHealth];
        resume.timer = CoreEngine.val_int_dS;
    }
    return resume;
}

// We hold the bout's state: send it and restart our side from it; the opponent restarts on receiving it
function restartBoutFromHere(segment) {
    const setup = (onlineBout && onlineBout.setup) || (onlineResume && onlineResume.setup);
    if (!setup) return;
    const snapshot = { segment, resume: boutRestartState() };
    onlineResume = null;
    mpClient.sendSnapshot(snapshot);
    startOnlineSegment(setup, segment, snapshot.resume);
}

function resumeOnlineBout() {
    if (!onlineResume || !onlineResume.snapshot) return;
    const setup = onlineResume.setup || (onlineBout && onlineBout.setup);
    if (!setup) return;
    const { snapshot } = onlineResume;
    onlineResume = null;
    startOnlineSegment(setup, snapshot.segment, snapshot.resume);
}

function applyTickInput(side, input) {
    if (input[0]) CoreEngine.applyInputBits(side, input[0], true);
    if (input[1]) CoreEngine.applyInputBits(side, input[1], false);
}

// Advances the online fight by as many ticks as real time allows: first fixing any wrong guesses about the
// opponent's input, then running new ticks while their input is in or close enough behind to guess
function runOnlineBout(now) {
    const bout = onlineBout;
    const stats = bout.stats;
    const frameMs = now - bout.last;
    bout.last = now;
    // Two devices never tick at exactly the same rate. If we've run ahead of the opponent, ease off until
    // they catch up, rather than guessing further and further ahead of their input.
    const pace = ticksAheadOfPeer(bout, now) > 2 ? 0.8 : 1;
    // A slow phone runs several ticks in one frame to keep game speed, drawing only the last; never more
    // than a few, so a hitch doesn't fast-forward the fight
    bout.acc = Math.min(bout.acc + frameMs * pace, LOCKSTEP_TICK_MS * 4);
    // Once the server has decided the match, the end animation plays out without waiting on inputs
    const decided = mpClient.status === "COMPLETED";
    const live = inLiveRound();
    if (bout.skipFrame) {
        bout.skipFrame = false;
        if (bout.openStall) stallSkip(bout.openStall, now);
    } else if (!bout.statsClosed) {
        noteFrame(stats, frameMs, live, bout.tick, now);
    }

    if (!decided && bout.rollbackTo !== null) rollBack(bout);

    let ran = 0;
    while (bout.acc >= LOCKSTEP_TICK_MS) {
        const t = bout.tick;
        if (!decided && !canRunTick(bout, t)) {
            // Too far past the opponent's last input to keep guessing. The waiting time isn't banked, or the
            // fight would jump ahead once it lands.
            if (bout.stallStart === null) {
                bout.stallStart = now;
                // Until the opponent has simulated anything, the wait is them finishing loading
                bout.openStall = stallBegin(now, t, live, bout.peerTick === 0);
            }
            bout.acc = Math.min(bout.acc, LOCKSTEP_TICK_MS);
            break;
        }
        if (bout.stallStart !== null) {
            endStall(bout, now - bout.stallStart, now);
            bout.stallStart = null;
        }
        // From the first guessed tick on, keep a way back to before each one
        if (!decided && t >= bout.remoteNext) saveSnapshot(bout, t);

        // Skip drawing a tick when another one is due this frame and can run (it redraws everything)
        const anotherThisFrame = bout.acc >= 2 * LOCKSTEP_TICK_MS && (decided || canRunTick(bout, t + 1));
        const tickStart = performance.now();
        simulateTick(bout, t, anotherThisFrame, decided);
        stats.tickMs += performance.now() - tickStart;
        if (anotherThisFrame) stats.paintsSkipped++;
        noteTick(stats, inLiveRound(), bout.delay);

        if (decided) {
            bout.pending = [0, 0];
        } else {
            scheduleLocalInput(bout);
        }
        bout.tick++;
        bout.acc -= LOCKSTEP_TICK_MS;
        bout.lastTickAt = now;
        if (!decided) stats.predictSum += Math.max(0, bout.tick - bout.remoteNext);
        ran++;
    }
    if (ran > 1) stats.catchUpFrames++;
    if (!decided) {
        confirmTicks(bout);
        if (onlineBout !== bout) return; // a desync restarted the bout
        updateDelayAdvice(bout, now);
    }
    if (!bout.statsClosed && mpClient.status === "ACTIVE" && now - stats.since >= 10000) reportNetStats(bout, now, "interval");
}

// A round is being fought: the fighters take input and the clock runs (not loading, the round intro or a knockout)
function inLiveRound() {
    return CoreEngine.val_int_dN === 2 && CoreEngine.val_int_dL === 2;
}

function canRunTick(bout, t) {
    return bout.local.has(t) && t - bout.remoteNext < MAX_PREDICTION;
}

// One tick of the fight with both players' inputs; the opponent's is a guess (no change) if it isn't here
function simulateTick(bout, t, skipPaint, decided) {
    if (!decided) {
        const localSide = mpClient.role === 'p1' ? 0 : 1;
        applyTickInput(localSide, bout.local.get(t) || NO_INPUT);
        applyTickInput(1 - localSide, bout.remote.get(t) || NO_INPUT);
    }
    midlet.stepFrame(1000 + Math.floor(t * 1000 / 60), skipPaint);
    if (!decided) {
        bout.facts.set(t, [CoreEngine.val_int_dN, CoreEngine.val_int_dU, CoreEngine.val_int_dV,
                           t % HASH_EVERY_TICKS === 0 ? simulationHash() : null]);
    }
}

function saveSnapshot(bout, t) {
    const started = performance.now();
    bout.snapshots.push({ tick: t, state: getStateSaver().save() });
    bout.stats.saves++;
    bout.stats.saveMs += performance.now() - started;
}

// The opponent's real input differs from what we guessed for bout.rollbackTo: go back to the latest saved
// state at or before it and replay every tick since, silently and without drawing
function rollBack(bout) {
    const target = bout.rollbackTo;
    bout.rollbackTo = null;
    if (target >= bout.tick) return;
    const snaps = bout.snapshots;
    let i = snaps.length - 1;
    while (i >= 0 && snaps[i].tick > target) i--;
    if (i < 0) {
        // Never expected; the fights now differ and the fingerprint check will restart them
        console.warn(`[Multiplayer] No saved state to roll back to tick ${target}`);
        bout.stats.rollbackMisses++;
        return;
    }
    const from = snaps[i].tick;
    snaps.length = i + 1;
    const started = performance.now();
    getStateSaver().load(snaps[i].state);
    bout.stats.loads++;
    bout.stats.loadMs += performance.now() - started;
    const resimStart = performance.now();
    const savesBefore = bout.stats.saveMs;
    window.__rollbackResim = true;
    try {
        for (let t = from; t < bout.tick; t++) {
            // Ticks from the first one still guessed may need undoing again: keep a way back to it
            if (t > from && t === bout.remoteNext) saveSnapshot(bout, t);
            simulateTick(bout, t, true, false);
        }
    } finally {
        window.__rollbackResim = false;
    }
    bout.stats.resimMs += performance.now() - resimStart - (bout.stats.saveMs - savesBefore);
    const ticks = bout.tick - from;
    bout.stats.rollbacks++;
    bout.stats.rollbackTicks += ticks;
    bout.stats.maxRollback = Math.max(bout.stats.maxRollback, ticks);
}

// Ticks run with both players' real inputs can't change any more: report their round scores, share their
// fingerprints, and forget what only a rollback to them would need
function confirmTicks(bout) {
    const upTo = Math.min(bout.remoteNext, bout.tick);
    while (bout.factsNext < upTo) {
        const t = bout.factsNext++;
        const facts = bout.facts.get(t);
        bout.facts.delete(t);
        if (!facts) continue;
        reportScoredRounds(bout, facts);
        if (facts[3] !== null) {
            shareStateHash(bout, t, facts[3]);
            if (onlineBout !== bout) return;
        }
    }
    // Keep only the latest snapshot at or before the first guessed tick, and none if nothing is guessed
    const snaps = bout.snapshots;
    if (bout.remoteNext >= bout.tick) {
        snaps.length = 0;
    } else {
        let k = 0;
        while (k + 1 < snaps.length && snaps[k + 1].tick <= bout.remoteNext) k++;
        if (k) snaps.splice(0, k);
    }
    const keepFrom = snaps.length ? snaps[0].tick : bout.tick;
    for (const map of [bout.local, bout.remote]) {
        for (const t of map.keys()) if (t < keepFrom) map.delete(t);
    }
}

// Desync check: both phones fingerprint their simulation once a second and compare. The fights only ever
// differ if the engine isn't deterministic somewhere (an untested browser, say); then P1 restarts both
// from its own state, the way a reconnect does, and the count goes into the net stats.
const HASH_EVERY_TICKS = 60;
// Times the two simulations differed this match (a restart starts a new bout, so this lives outside it)
let totalDesyncs = 0;

function simulationHash() {
    const E = CoreEngine;
    let h = 0x811c9dc5;
    const mix = (value) => {
        h = Math.imul(h ^ (value | 0), 0x01000193) >>> 0;
    };
    [E.val_int_dL, E.val_int_dM, E.val_int_dS, E.val_int_dU, E.val_int_dV].forEach(mix);
    const seed = E.globalRandom.seed;
    mix(Number(seed & 0xFFFFFFFFn));
    mix(Number(seed >> 32n));
    for (const fighter of [E.val_coreengine_b, E.val_coreengine_c]) {
        if (!fighter) { mix(-1); continue; }
        mix(fighter.actorPhysicsArray[0]);
        mix(fighter.actorPhysicsArray[1]);
        mix(fighter.currentHealth);
        mix(fighter.actorTimerW);
        mix(fighter.actorTimerX);
    }
    return h;
}

function shareStateHash(bout, tick, hash) {
    bout.hashes.set(tick, hash);
    mpClient.sendStateHash(bout.segment, tick, hash);
    compareStateHash(bout, tick);
}

function compareStateHash(bout, tick) {
    const ours = bout.hashes.get(tick);
    const theirs = bout.peerHashes.get(tick);
    if (ours === undefined || theirs === undefined) return;
    bout.hashes.delete(tick);
    bout.peerHashes.delete(tick);
    // Keep the maps small if a hash never arrives
    for (const map of [bout.hashes, bout.peerHashes]) {
        for (const t of map.keys()) if (t < tick - 10 * HASH_EVERY_TICKS) map.delete(t);
    }
    if (ours === theirs) return;
    totalDesyncs++;
    mpClient.sendNetEvent("desync", { segment: bout.segment, tick });
    console.warn(`[Multiplayer] Simulations differ at tick ${tick} (segment ${bout.segment}); restarting from P1's state`);
    const now = performance.now();
    if (mpClient.role === "p1" && mpClient.status === "ACTIVE" && now - bout.lastResyncAt > 3000) {
        bout.lastResyncAt = now;
        restartBoutFromHere(bout.segment + 1);
    }
}

// Schedules what we pressed during this tick `delay` ticks ahead, applying the opponent's advice on our
// delay: raising fills the tick the old delay would have used with an empty input; lowering skips this
// tick's send and carries our presses into the next tick's input, which lands on that same tick.
function scheduleLocalInput(bout) {
    const pending = bout.pending;
    bout.pending = [0, 0];
    if (bout.delayChange > 0 && bout.delay < MAX_INPUT_DELAY) {
        sendLocalInput(bout, bout.tick + bout.delay, [0, 0]);
        bout.delay++;
    } else if (bout.delayChange < 0 && bout.delay > MIN_INPUT_DELAY) {
        // Advice can lower by several ticks: one per tick
        bout.delay--;
        bout.delayChange++;
        bout.pending = pending;
        return;
    }
    bout.delayChange = 0;
    bout.stats.delayMin = Math.min(bout.stats.delayMin, bout.delay);
    bout.stats.delayMax = Math.max(bout.stats.delayMax, bout.delay);
    sendLocalInput(bout, bout.tick + bout.delay, pending);
}

function sendLocalInput(bout, tick, input) {
    bout.local.set(tick, input);
    mpClient.sendLockstepInput(bout.segment, tick, input[0], input[1], bout.advice.hint, bout.advice.seq, bout.tick);
}

// How many ticks we are ahead of the opponent right now: their last reported tick, plus the ticks they've
// run while that report travelled here and since it arrived
function ticksAheadOfPeer(bout, now) {
    if (!bout.peerTickAt) return 0;
    const oneWayMs = (mpClient.peerRtt ?? 100) / 2;
    return bout.tick - (bout.peerTick + (oneWayMs + now - bout.peerTickAt) / LOCKSTEP_TICK_MS);
}

function endStall(bout, ms, now) {
    if (bout.openStall) {
        stallEnd(bout.stats, bout.openStall, now);
        bout.openStall = null;
    }
    // Only short waits while we're level with the opponent say their delay is too small. Long ones are
    // outages, waits while we're ahead are pacing (handled by easing off), and the first wait of a bout is
    // just the opponent finishing loading.
    if (bout.heardFromPeer && ms < 500 && ticksAheadOfPeer(bout, now) <= 2) {
        bout.window.stalls++;
        bout.window.stallMs += ms;
    }
}

// Once a second, advise the opponent on their input delay from how their inputs reached us: raise it if we
// had to wait for them; when for three seconds running every input arrived with 3+ ticks to spare before
// our guesses would have run out, lower it by half the spare (a delay set from a bad early measurement
// comes down in a few seconds)
function updateDelayAdvice(bout, now) {
    const w = bout.window;
    if (now - w.since < 1000) return;
    let hint = 0;
    if (w.stalls >= 2 || w.stallMs > 50) {
        hint = 1;
        bout.goodSeconds = [];
    } else {
        // Ticks to spare beyond 3 before we'd have had to stop guessing and wait; null for a bad second
        const spare = w.stalls === 0 && w.minLead !== Infinity ? w.minLead - (3 - MAX_PREDICTION) : -1;
        bout.goodSeconds.push(spare >= 0 ? spare : null);
        if (bout.goodSeconds.length > 3) bout.goodSeconds.shift();
        if (bout.goodSeconds.length === 3 && bout.goodSeconds.every((x) => x !== null)) {
            hint = -Math.max(1, Math.min(4, Math.floor(Math.min(...bout.goodSeconds) / 2)));
            bout.goodSeconds = [];
        }
    }
    if (hint) {
        bout.advice = { hint, seq: (bout.advice.seq % 255) + 1 };
    }
    bout.window = { stalls: 0, stallMs: 0, minLead: Infinity, since: now };
}

// Every 10s the server logs how the bout ran on this phone, so lag reports can be checked against real numbers.
// reason says what sent this one: "interval", or a moment that could otherwise lose the time since the last one
// ("restart", "hidden", "pagehide", "final").
function reportNetStats(bout, now, reason) {
    // Measuring must never get in the way of the fight
    try {
        sendNetStats(bout, now, reason);
    } catch (err) {
        console.warn('[Multiplayer] Stats report failed:', err);
    }
}

function sendNetStats(bout, now, reason) {
    const s = bout.stats;
    if (bout.openStall) stallAdvance(s, bout.openStall, now);
    const fields = reportFields(s, now);
    if (!fields) return;
    mpClient.sendPacket({
        type: "net_stats",
        reason,
        segment: bout.segment,
        ...fields,
        delay: bout.delay,
        ticks_ahead: Math.round(ticksAheadOfPeer(bout, now) * 10) / 10,
        peer_rtt: mpClient.peerRtt === null ? null : Math.round(mpClient.peerRtt),
        server_rtt: mpClient.rtt,
        p2p: mpClient.isP2PActive,
        ...mpClient.iceSummary(),
        frame_ms: s.frames ? Math.round(s.frameMs / s.frames * 10) / 10 : null,
        tick_ms: s.ticks ? Math.round(s.tickMs / s.ticks * 10) / 10 : null,
        // cumulative for this page, unlike everything else here; the fight log counts desync events instead
        desyncs: totalDesyncs,
        netcode: "rollback",
        // how many ticks past the opponent's last input we ran, on average (how much was guessed)
        predict_ticks: s.ticks ? Math.round(s.predictSum / s.ticks * 10) / 10 : null,
        save_ms: s.saves ? Math.round(s.saveMs / s.saves * 100) / 100 : null,
        load_ms: s.loads ? Math.round(s.loadMs / s.loads * 100) / 100 : null,
        device: navigator.userAgent.slice(0, 160)
    });
    bout.stats = newNetStats(now, bout.delay, s.seq + 1);
}

// No more reports from this bout: the last one, with any wait still open counted as it stands
function closeNetStats(bout, now, reason) {
    if (bout.statsClosed) return;
    bout.statsClosed = true;
    if (bout.openStall) {
        stallEnd(bout.stats, bout.openStall, now, true);
        bout.openStall = null;
    }
    if (bout.hiddenAt !== null) {
        bout.stats.hiddenMs += now - bout.hiddenAt;
        bout.hiddenAt = now;
    }
    reportNetStats(bout, now, reason);
}

// The page left the screen or came back. A hidden page may never run again, so this is the last sure moment to
// report; and no frames run while it's hidden, so the first one back is as long as the whole absence.
function noteVisibility(hidden) {
    const bout = onlineBout;
    if (!bout || bout.statsClosed) return;
    const now = performance.now();
    if (hidden && bout.hiddenAt === null) {
        if (mpClient.status === "ACTIVE") reportNetStats(bout, now, "hidden");
        bout.hiddenAt = now;
    } else if (!hidden && bout.hiddenAt !== null) {
        bout.stats.hiddenMs += now - bout.hiddenAt;
        bout.hiddenAt = null;
        bout.skipFrame = true;
        if (bout.openStall) stallSkip(bout.openStall, now);
    }
}

// A frame with the bout frozen. Time spent hidden is already counted as hidden, whether or not frames ran through it.
function notePaused(bout, now) {
    if (bout.openStall) stallSkip(bout.openStall, now);
    if (bout.skipFrame) bout.skipFrame = false;
    else if (bout.hiddenAt === null) bout.stats.pausedMs += now - bout.last;
}

// An uncaught error in the game loop: it can leave the picture frozen while everything else carries on. Reported the
// first few times, since it usually repeats every frame.
let loopErrorsReported = 0;
function noteLoopError(err) {
    try {
        if (onlineBout) onlineBout.stats.loopErrors++;
        if (mpClient.isMultiplayer && loopErrorsReported < 3) {
            loopErrorsReported++;
            mpClient.sendNetEvent("loop_error", { message: String(err && err.message || err).slice(0, 200) });
        }
    } catch (_) {}
}

// Both phones report the engine's round score whenever it changes, as of a confirmed tick (never a guess);
// the server counts a round once both reports agree (a time-out on equal health scores both)
function reportScoredRounds(bout, [phase, roundsB, roundsC]) {
    if (phase !== 2) return;
    if (roundsB !== bout.rounds[0] || roundsC !== bout.rounds[1]) {
        mpClient.sendRoundScore(roundsB, roundsC);
    }
    bout.rounds = [roundsB, roundsC];
}

// =========================================================================
// WATCHING: live spectating and replays
// =========================================================================

// A fight we don't play: someone else's live match, or a recorded one. Both players' inputs come from the
// server and the same engine replays them tick by tick, so the picture matches what the players saw.
//   setup, segment - the fight and which bout segment is running; tick - next tick to simulate
//   inputs[side]   - tick -> [pressed, released] for the ticks where that player's keys changed
//   avail[side]    - how many ticks of that player's input have arrived (a replay has them all)
//   final          - no more input will come (replay's last segment, or the live match ended): once the
//                    inputs run out the fight plays on by itself, as it did on the players' phones
//   replay         - for replays: the recording, the segment index, and when the playback finished
let viewer = null;

function startViewerSegment(setup, seg, extra = {}) {
    const now = performance.now();
    viewer = {
        setup, segment: seg.segment, tick: 0,
        inputs: [new Map(seg.p1.map(([t, p, r]) => [t, [p, r]])), new Map(seg.p2.map(([t, p, r]) => [t, [p, r]]))],
        avail: seg.ticks.slice(),
        acc: 0, last: now, final: false, freeTicks: 0, over: false,
        ...extra
    };
    mpClient._watching = true;
    window.__muteVibration = true;
    resetEngineForBout(setup, seg.segment, seg.resume, () => {});
}

function viewerFrontier(v) {
    return Math.min(v.avail[0], v.avail[1]);
}

function viewerTickReady(v, t) {
    return t < viewerFrontier(v) || v.final;
}

function stepViewerTick(v, skipPaint) {
    for (let side = 0; side < 2; side++) {
        const input = v.inputs[side].get(v.tick);
        if (input) {
            applyTickInput(side, input);
            v.inputs[side].delete(v.tick);
        }
    }
    if (v.tick >= viewerFrontier(v)) v.freeTicks++;
    midlet.stepFrame(1000 + Math.floor(v.tick * 1000 / 60), skipPaint);
    v.tick++;
}

function runViewer(now) {
    const v = viewer;
    if (v.over) return;
    const frameMs = now - v.last;
    v.last = now;

    // Replays: at the end of a segment's recording, go on to the next one (a restart after a reconnect)
    if (v.replay && !v.final && v.tick >= viewerFrontier(v)) {
        const next = v.replay.index + 1;
        const segments = v.replay.data.segments;
        if (next < segments.length) {
            startReplaySegment(v.replay.data, next);
            return;
        }
        v.final = true;
    }
    // After the last input the fight plays out for a few seconds (the knockout and win pose), then ends
    if (v.replay && v.final && v.freeTicks >= 300) {
        v.over = true;
        return;
    }

    const behind = viewerFrontier(v) - v.tick;
    if (!v.replay && !v.final && behind > 30) {
        // Joined a live fight late: fast-forward through what we missed, drawing only each frame's last tick
        const until = performance.now() + 14;
        while (viewerFrontier(v) - v.tick > 12 && performance.now() < until) {
            stepViewerTick(v, true);
        }
        stepViewerTick(v, false);
        v.acc = 0;
        return;
    }

    // Live: stay a few ticks behind the latest input so network jitter doesn't stall the picture
    const pace = v.replay || v.final ? 1 : (behind < 4 ? 0.9 : (behind > 16 ? 1.15 : 1));
    v.acc = Math.min(v.acc + frameMs * pace, LOCKSTEP_TICK_MS * 4);
    while (v.acc >= LOCKSTEP_TICK_MS) {
        if (!viewerTickReady(v, v.tick)) {
            v.acc = Math.min(v.acc, LOCKSTEP_TICK_MS);
            break;
        }
        if (v.replay && !v.final && v.tick >= viewerFrontier(v)) break; // next segment, next frame
        const another = v.acc >= 2 * LOCKSTEP_TICK_MS && viewerTickReady(v, v.tick + 1);
        stepViewerTick(v, another);
        v.acc -= LOCKSTEP_TICK_MS;
    }
}

// Spectators: a fight (or a restart of it) to watch from the start of its segment, with the inputs so far
function onSpectate(data) {
    if (!data.setup || !data.segment) return;
    const setup = setupFromVersus(data.setup);
    startViewerSegment(setup, data.segment);
    console.log(`[Multiplayer] Watching segment ${data.segment.segment}: ${viewerFrontier(viewer)} ticks to catch up`);
}

// Spectators: one tick of a player's input, as the server relays it
function onSpectatorInput(side, segment, tick, pressed, released) {
    const v = viewer;
    if (!v || v.replay || (v.segment & 0xFF) !== segment || tick !== v.avail[side]) return;
    if (pressed || released) v.inputs[side].set(tick, [pressed, released]);
    v.avail[side] = tick + 1;
}

function startReplaySegment(data, index) {
    const setup = setupFromVersus(data.setup);
    startViewerSegment(setup, data.segments[index], { replay: { data, index } });
}

async function startReplay() {
    try {
        const data = await mpClient.fetchReplay();
        if (!data || !data.segments || !data.segments.length) throw new Error("empty replay");
        replayData = data;
        startReplaySegment(data, 0);
    } catch (err) {
        console.error("[Replay] Could not load:", err);
        replayError = "REPLAY NOT AVAILABLE";
    }
}

let replayData = null;
let replayError = null;

// =========================================================================
// RESULT SCREENS, EXIT, HAPTICS, CLOSE CONFIRMATION, MIRROR COLOURS
// =========================================================================

function closeGame() {
    const tg = window.Telegram?.WebApp;
    if (tg && typeof tg.close === 'function' && tg.initData) {
        tg.close();
    } else {
        window.location.href = 'play.html';
    }
}

function openReplay(matchId) {
    if (!matchId) return;
    window.location.href = `play.html?replay=${encodeURIComponent(matchId)}${window.location.hash || ''}`;
}

// The match is over on this screen and a result panel is up
function resultScreenShown() {
    if (mpClient.isReplay) return !!(viewer && viewer.over) || !!replayError;
    return mpClient.isMultiplayer && ["COMPLETED", "CANCELLED", "REJECTED"].includes(mpClient.status);
}

// A finished online match: A asks for a rematch, OPTNS opens its replay, BACK leaves the game
function handleResultKey(keyCode) {
    if (CONFIRM_KEYS.includes(keyCode) && mpClient.status === "COMPLETED") {
        mpClient.requestRematch();
    } else if (keyCode === -6 && mpClient.status === "COMPLETED" && mpClient.result && mpClient.result.replay) {
        openReplay(mpClient.matchId);
    } else if (keyCode === -7) {
        closeGame();
    }
}

// Watching: BACK leaves; a finished replay replays on A; a finished live match offers its replay on OPTNS
function handleViewerKey(keyCode) {
    if (keyCode === -7) {
        closeGame();
    } else if (mpClient.isReplay && CONFIRM_KEYS.includes(keyCode) && viewer && viewer.over && replayData) {
        startReplaySegment(replayData, 0);
    } else if (keyCode === -6 && mpClient.isSpectator && mpClient.status === "COMPLETED"
               && mpClient.result && mpClient.result.replay) {
        openReplay(mpClient.matchId);
    }
}

function short(name, n = 10) {
    return String(name || "").toUpperCase().slice(0, n);
}

// The lines of the result panel drawn over the last frame of a finished match or replay
function resultPanelLines() {
    if (mpClient.isReplay) {
        if (replayError) return [replayError, "", "BACK: EXIT"];
        const result = replayData && replayData.result;
        return ["REPLAY OVER", result ? scoreLine(result) : "", "A: WATCH AGAIN    BACK: EXIT"];
    }
    if (mpClient.status !== "COMPLETED" || !mpClient.result) return null;
    const result = mpClient.result;
    const replayHint = result.replay ? "OPTNS: REPLAY    " : "";
    if (mpClient.isSpectator) {
        const title = result.winner_id ? `${short(result.winner_name, 14)} WINS!` : "DRAW";
        return [title, scoreLine(result), `${replayHint}BACK: EXIT`];
    }
    let title = "DRAW";
    if (result.winner_id) {
        title = result.winner_id !== mpClient.userId ? "DEFEAT"
            : (result.reason === "AUTOWIN_DISCONNECT" ? "VICTORY - OPPONENT FORFEITED" : "VICTORY!");
    }
    const opponent = short(mpClient.opponentName(), 12);
    const rematch = mpClient.rematch || { requested: [] };
    const iAsked = rematch.requested.includes(mpClient.userId);
    const theyAsked = rematch.requested.some((id) => id !== mpClient.userId);
    let rematchLine = "A: REMATCH";
    if (rematch.opponentLeft) rematchLine = `${opponent} LEFT THE ARENA`;
    else if (iAsked) rematchLine = `WAITING FOR ${opponent}...`;
    else if (theyAsked) rematchLine = `${opponent} WANTS A REMATCH - PRESS A`;
    return [title, scoreLine(result), rematchLine, `${replayHint}BACK: EXIT`];
}

function scoreLine(result) {
    const p1 = result.p1 ? short(result.p1.name, 12) : "P1";
    const p2 = result.p2 ? short(result.p2.name, 12) : "P2";
    return `${p1} ${result.p1_rounds ?? 0} - ${result.p2_rounds ?? 0} ${p2}`;
}

// Text we draw over the game is set in the game's own bitmap font. Resource slot 4 holds its white menu
// font and slot 5 the red one the menus use for the selected entry. Both have A-Z, 0-9 and punctuation.
// Lowercase is upper-cased; characters the font lacks (a Cyrillic name, an emoji) use FALLBACK_FONT.
const GAME_FONT_WHITE = 4;
const GAME_FONT_RED = 5;
const GAME_FONT_LINE = 18;        // the engine's line height for these fonts
const GAME_FONT_GLYPH_TOP = 4;    // glyphs start 4px below the y the engine is given...
const GAME_FONT_GLYPH_H = 10;     // ...and are 10px tall
const TEXT_ANCHOR_LEFT = 0;
const FALLBACK_FONT = 'italic bold 12px sans-serif';

// The game's palette (sampled from its menus): the stone menu bars and the selection red
const GAME_RED = '#ff0000';
const STONE_EDGE = '#0c0a08';
const STONE_CAP = '#1c1d22';
const STONE_HI = '#a6a191';
const STONE_GLINT = '#cfccc4';

// Runs fn(fontCharmap) with one of the game's fonts selected, then puts the engine's own font back.
// Returns undefined when the engine has no font loaded yet.
function withGameFont(red, fn) {
    const slots = CoreEngine && CoreEngine.val_arr_object_a;
    const font = slots && ((red && slots[GAME_FONT_RED]) || slots[GAME_FONT_WHITE]);
    if (!font) return undefined;
    let fc;
    try { fc = CoreEngine.exec_a_to_fontcharmap(); } catch (_) { return undefined; }
    if (!fc) return undefined;
    const previous = fc.val_contextservicenode_a.val_object_b;
    CoreEngine.exec_a_object_to_void(font);
    try {
        return fn(fc);
    } finally {
        CoreEngine.exec_a_object_to_void(previous);
    }
}

// Splits upper-cased text into runs the game font can draw ({ game: true }) and runs it can't, each with
// its width. Without a loaded game font the whole line is one fallback run.
function layoutGameText(text, red) {
    const s = String(text).toUpperCase();
    const runs = withGameFont(red, (fc) => {
        const out = [];
        for (const ch of s) {
            const c = ch.charCodeAt(0);
            // The engine draws a debug box for a glyph it doesn't have (-1), so those go to the fallback
            const game = c === 32 || (ch.length === 1 && c <= 126 && fc.getKerning(c, 1) >= 0);
            const last = out[out.length - 1];
            if (last && last.game === game) last.text += ch;
            else out.push({ text: ch, game });
        }
        for (const run of out) {
            if (run.game) {
                run.width = CoreEngine.exec_a_encodedtextbuffer_int_int_to_int(new EngineModule.EncodedTextBuffer(run.text), 0, run.text.length);
            }
        }
        return out;
    }) || [{ text: s, game: false }];
    ctx.save();
    ctx.font = FALLBACK_FONT;
    for (const run of runs) {
        if (!run.game) run.width = ctx.measureText(run.text).width;
    }
    ctx.restore();
    return runs;
}

function measureGameText(text) {
    return layoutGameText(text, false).reduce((sum, run) => sum + run.width, 0);
}

// One line centred on (cx, cy)
function drawGameText(text, cx, cy, red = false) {
    const runs = layoutGameText(text, red);
    let x = Math.round(cx - runs.reduce((sum, run) => sum + run.width, 0) / 2);
    const top = Math.round(cy - GAME_FONT_GLYPH_H / 2) - GAME_FONT_GLYPH_TOP;
    for (const run of runs) {
        if (run.game) {
            withGameFont(red, () => {
                const buf = new EngineModule.EncodedTextBuffer(run.text);
                CoreEngine.exec_a_encodedtextbuffer_int_int_int_int_int_to_void(buf, 0, buf.bufferCapacity, x, top, TEXT_ANCHOR_LEFT);
            });
        } else {
            ctx.save();
            ctx.fillStyle = red ? GAME_RED : '#ffffff';
            ctx.font = FALLBACK_FONT;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(run.text, x, cy);
            ctx.restore();
        }
        x += run.width;
    }
}

// Breaks text into lines no wider than maxWidth: first at the " - " between a message's parts, then
// between words. A line that fits keeps its spacing.
function wrapGameText(text, maxWidth) {
    if (measureGameText(text) <= maxWidth) return [text];
    const parts = String(text).split(' - ');
    if (parts.length > 1) return parts.flatMap((part) => wrapGameText(part, maxWidth));
    const lines = [];
    let line = '';
    for (const word of String(text).split(/ +/)) {
        const next = line ? `${line} ${word}` : word;
        if (line && measureGameText(next) > maxWidth) {
            lines.push(line);
            line = word;
        } else {
            line = next;
        }
    }
    if (line) lines.push(line);
    return lines;
}

// A black box framed like the game's menu bars: dark top and left, light bottom and right
function drawStonePanel(x, y, w, h, edge = 3) {
    ctx.save();
    ctx.fillStyle = '#000000';
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = STONE_EDGE;
    ctx.fillRect(x, y, w, edge);
    ctx.fillStyle = STONE_CAP;
    ctx.fillRect(x, y, edge, h);
    ctx.fillStyle = STONE_HI;
    ctx.fillRect(x, y + h - edge, w, edge);
    ctx.fillStyle = STONE_GLINT;
    ctx.fillRect(x + w - edge, y, edge, h);
    ctx.restore();
}

// The title in the game's red, the rest in its white
function drawResultPanel(lines) {
    const x = 16;
    const w = canvas.width - 2 * x;
    const pad = 12;
    const rows = [];
    lines.forEach((line, i) => {
        wrapGameText(line, w - 2 * pad).forEach((part) => rows.push({ text: part, red: i === 0 }));
        if (i === 0) rows.push(null); // a blank row under the title
    });
    const h = 2 * pad + rows.length * GAME_FONT_LINE;
    const y = Math.round((canvas.height - h) / 2) - 20;
    drawStonePanel(x, y, w, h);
    rows.forEach((row, i) => {
        if (row && row.text) drawGameText(row.text, canvas.width / 2, y + pad + GAME_FONT_LINE * i + GAME_FONT_LINE / 2, row.red);
    });
}

// A status strip across the screen just above the softkey icons
function drawBanner(text) {
    const pad = 8;
    const rows = wrapGameText(text, canvas.width - 2 * pad);
    const bH = 2 * pad + rows.length * GAME_FONT_LINE;
    const bY = canvas.height - bH - 30;
    drawStonePanel(-3, bY, canvas.width + 6, bH);
    rows.forEach((row, i) => drawGameText(row, canvas.width / 2, bY + pad + GAME_FONT_LINE * i + GAME_FONT_LINE / 2));
}

// Haptics: a knock when our fighter takes a hit (heavier for big ones), success/error when a round ends
let hapticState = { fighter: null, health: null, rounds: null, lastAt: 0 };

function resetHaptics() {
    hapticState = { fighter: null, health: null, rounds: null, lastAt: 0 };
}

function updateHaptics() {
    const haptics = window.Telegram?.WebApp?.HapticFeedback;
    if (!haptics || mpClient.isReplay) return;
    let side = 0; // single player fights as B
    if (mpClient.isMultiplayer) {
        if (mpClient.isSpectator || !onlineBout || mpClient.status !== "ACTIVE") return;
        side = mpClient.role === "p1" ? 0 : 1;
    }
    const own = side === 0 ? CoreEngine.val_coreengine_b : CoreEngine.val_coreengine_c;
    if (!own || CoreEngine.val_int_dN !== 2) {
        hapticState.health = null;
        return;
    }
    try {
        const now = performance.now();
        const health = own.currentHealth;
        // Only hits during a live round, on the same fighter: between rounds the engine swaps in a new
        // fighter object that starts at 0 health, which isn't a hit
        const sameFighter = hapticState.fighter === own;
        hapticState.fighter = own;
        if (sameFighter && CoreEngine.val_int_dL === 2 && hapticState.health !== null && health < hapticState.health
            && now - hapticState.lastAt > 90) {
            haptics.impactOccurred(hapticState.health - health >= 10 ? 'heavy' : 'medium');
            hapticState.lastAt = now;
        }
        hapticState.health = health;
        const rounds = [CoreEngine.val_int_dU, CoreEngine.val_int_dV];
        if (hapticState.rounds && (rounds[0] !== hapticState.rounds[0] || rounds[1] !== hapticState.rounds[1])) {
            haptics.notificationOccurred(rounds[side] > hapticState.rounds[side] ? 'success' : 'error');
        }
        hapticState.rounds = rounds;
    } catch (_) {}
}

// While an online match is on, Telegram asks before closing the game, so a stray swipe doesn't forfeit it
let closingConfirmationOn = false;

function updateClosingConfirmation() {
    const tg = window.Telegram?.WebApp;
    if (!tg || typeof tg.enableClosingConfirmation !== 'function') return;
    const want = mpClient.isMultiplayer && !mpClient.isSpectator
        && (mpClient.status === "ACTIVE" || mpClient.status === "HERO_SELECT");
    if (want === closingConfirmationOn) return;
    closingConfirmationOn = want;
    try {
        if (want) tg.enableClosingConfirmation();
        else tg.disableClosingConfirmation();
    } catch (_) {}
}

// Mirror matches: the engine skins fighter C with the arcade's alternate palette, which for some fighters
// (Cyrax) is nearly the same colour as the original. If the two costumes are that close, C's costume
// colours are turned around the colour wheel. Only the pictures change; the fight itself is untouched.
function recolorMirrorSheets(animSet) {
    try {
        const sheetsOf = (set) => ((set && set.spriteImages) || [])
            .map((si) => si && si.sourceImage && si.sourceImage.underlyingImage && si.sourceImage.underlyingImage.canvas)
            .filter((c) => c && c.getContext);
        const cSheets = sheetsOf(animSet);
        const fighterB = CoreEngine.val_coreengine_b;
        const bSheets = sheetsOf(fighterB && fighterB.currentAnimSet);
        if (!cSheets.length || !bSheets.length || bSheets[0] === cSheets[0]) return;
        const hueB = costumeHue(bSheets[0]);
        const hueC = costumeHue(cSheets[0]);
        if (hueB === null || hueC === null) return;
        const distance = Math.abs(((hueB - hueC + 540) % 360) - 180);
        if (distance >= 35) return;
        cSheets.forEach((sheet) => rotateCostumeHue(sheet, 150));
        console.log(`[Multiplayer] Mirror match: fighter C recoloured (costume hues ${Math.round(hueB)} / ${Math.round(hueC)})`);
    } catch (err) {
        console.warn("[Multiplayer] Mirror recolour skipped:", err);
    }
}

function rgbToHsv(r, g, b) {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;
    let h = 0;
    if (d) {
        if (max === r) h = ((g - b) / d) % 6;
        else if (max === g) h = (b - r) / d + 2;
        else h = (r - g) / d + 4;
        h *= 60;
        if (h < 0) h += 360;
    }
    return [h, max ? d / max : 0, max / 255];
}

function hsvToRgb(h, s, v) {
    const c = v * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v - c;
    const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x]
        : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
    return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}

// Saturated pixels are costume; skin and greys stay as they are
const COSTUME_SATURATION = 0.55;

// Average hue of a sheet's costume pixels (a circular mean), or null if it has none
function costumeHue(sheet) {
    const data = sheet.getContext('2d').getImageData(0, 0, sheet.width, sheet.height).data;
    let x = 0, y = 0, n = 0;
    for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] < 128) continue;
        const [h, s, v] = rgbToHsv(data[i], data[i + 1], data[i + 2]);
        if (s < COSTUME_SATURATION || v < 0.2) continue;
        x += Math.cos(h * Math.PI / 180);
        y += Math.sin(h * Math.PI / 180);
        n++;
    }
    if (n < 50) return null;
    return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}

function rotateCostumeHue(sheet, degrees) {
    const sctx = sheet.getContext('2d');
    const img = sctx.getImageData(0, 0, sheet.width, sheet.height);
    const data = img.data;
    for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] === 0) continue;
        const [h, s, v] = rgbToHsv(data[i], data[i + 1], data[i + 2]);
        if (s < COSTUME_SATURATION || v < 0.2) continue;
        const [r, g, b] = hsvToRgb((h + degrees) % 360, s, v);
        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;
    }
    sctx.putImageData(img, 0, 0);
}

// A finished match keeps playing its knockout for a moment before the result panel covers it
function showResultPanelNow() {
    if (mpClient.isReplay) return !!(viewer && viewer.over) || !!replayError;
    if (!mpClient.isMultiplayer || mpClient.status !== "COMPLETED") return false;
    if (!onlineBout && !viewer) return true;
    return CoreEngine.val_int_dL === 15 || Date.now() - (mpClient.resultAt || 0) > 3500;
}

// Overlays drawn on the canvas over the native frame (no DOM): result panel, status banner, footer note
function drawOnlineOverlays(now) {
    if (!canvas || !ctx) return;
    // The engine's last draw call may have left a clip rectangle on the context; overlays use the whole screen
    const g = Display.getDisplay().getGraphics();
    if (g) g.resetClip();
    if (showResultPanelNow()) {
        const lines = resultPanelLines();
        if (lines) drawResultPanel(lines);
        return;
    }
    if (mpClient.isReplay) {
        drawFooterText(viewer ? "REPLAY" : "LOADING REPLAY...");
        return;
    }
    let bannerText = mpClient.bannerText();
    if (!bannerText && mpClient.status === "ACTIVE" && onlineBout && now - (onlineBout.lastTickAt || now) > 500) {
        bannerText = "WAITING FOR OPPONENT...";
    }
    if (bannerText) {
        drawBanner(bannerText);
    } else if (mpClient.isSpectator && viewer && !viewer.final && viewerFrontier(viewer) - viewer.tick > 30) {
        drawFooterText("CATCHING UP...");
    } else if (mpClient.isSpectator && viewer) {
        drawFooterText(mpClient.spectatorCount > 1 ? `SPECTATING - ${mpClient.spectatorCount} WATCHING` : "SPECTATING");
    } else if (mpClient.status === "ACTIVE" && mpClient.spectatorCount > 0) {
        drawFooterText(`${mpClient.spectatorCount} WATCHING`);
    }
}

// A short note in the softkey bar, between the two corner icons and level with them
function drawFooterText(text) {
    const cy = 401; // the softkey icons' centre row (see .on-screen-softkey in play.html)
    const w = Math.min(canvas.width - 2 * 64, Math.ceil(measureGameText(text)) + 12);
    ctx.save();
    ctx.fillStyle = '#000000';
    ctx.fillRect(Math.round((canvas.width - w) / 2), cy - 9, w, 18);
    ctx.restore();
    drawGameText(text, canvas.width / 2, cy);
}

function startAnimationLoop() {
    function loop() {
        if (midlet && !midlet.isExitRequested) {
            try {
                const now = performance.now();
                if (viewer) {
                    runViewer(now);
                } else if (onlineFightRunning()) {
                    // A frozen bout keeps its last frame on screen; the banner below says why
                    if (mpClient.paused) {
                        notePaused(onlineBout, now);
                        onlineBout.last = now;
                    } else {
                        runOnlineBout(now);
                        if (onlineBout) noteWork(onlineBout.stats, performance.now() - now);
                    }
                } else if (!mpClient.isReplay) {
                    midlet.stepFrame();
                }
                updateHaptics();
                updateClosingConfirmation();

                // Hero Selection Phase on Native Canvas
                if (mpClient && mpClient.isMultiplayer && mpClient.status === "HERO_SELECT") {
                    if (CoreEngine.val_bool_W && !mpClient._heroSelected) {
                        mpClient._heroSelected = true;
                        let hero = CoreEngine.exec_n_to_int();
                        if (hero < 0 || hero > 6) {
                            // The "?" roulette normally settles on a real fighter first; if not, use the
                            // engine's own pick, which skips fighters that are still locked
                            hero = PatternTable.val_arr_arr_byte_a[CoreEngine.exec_c_to_byte()][0];
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

                if (mpClient && (mpClient.isMultiplayer || mpClient.isReplay)) {
                    drawOnlineOverlays(now);
                }
            } catch (err) {
                console.error("[Game Loop Error]:", err);
                noteLoopError(err);
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

        // 7. Initialize Multiplayer Subsystem (a match link or a replay link both start from the select screen)
        if (mpClient && (mpClient.isMultiplayer || mpClient.isReplay)) {
            console.log("[Multiplayer] Entering Character Selection directly on load...");
            if (mpClient.isMultiplayer) mpClient.status = "HERO_SELECT";
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
            onlineResume = null;
            if (!mpClient._heroSelected && CoreEngine.val_int_cw !== 1) {
                CoreEngine.setGameState(11);
                CoreEngine.exec_u_int_to_void(1);
            }
        };

        mpClient.onVersusStartCallback = (p1Hero, p2Hero, data) => {
            const setup = setupFromVersus(data);
            console.log(`[Multiplayer] Versus: P1=${p1Hero}, P2=${p2Hero}, stage=${setup.stage}, resume=${!!data.resume}`);
            mpClient._boutLive = true;
            if (!data.resume) {
                startOnlineSegment(setup, 0, null);
                return;
            }
            // Rejoining: both phones restart from one state (ours, the opponent's, or the server's), which may
            // arrive before or after this
            onlineResume = { ...onlineResume, setup };
            resumeOnlineBout();
        };

        // The opponent's input for one tick; both paths deliver it, so keep the first copy
        mpClient.onPeerInputCallback = (segment, tick, pressed, released, hint, hintSeq, senderTick) => {
            const bout = onlineBout;
            if (!bout || segment !== (bout.segment & 0xFF)) return; // from before a restart
            if (senderTick > bout.peerTick) {
                bout.peerTick = senderTick;
                bout.peerTickAt = performance.now();
            }
            // Their advice on our delay, once per new sequence number (the two paths can deliver out of order)
            const newer = (hintSeq - bout.peerHintSeq) & 0xFF;
            if (hint && newer > 0 && newer < 128) {
                bout.peerHintSeq = hintSeq;
                bout.delayChange = hint;
            }
            if (tick < bout.remoteNext || bout.remote.has(tick)) return;
            bout.remote.set(tick, [pressed, released]);
            while (bout.remote.has(bout.remoteNext)) bout.remoteNext++;
            noteInput(bout.stats, tick - bout.tick, mpClient.rxPath);
            // We already ran this tick guessing "no change"; any key change means it ran wrong
            if (tick < bout.tick && (pressed || released)) {
                bout.rollbackTo = bout.rollbackTo === null ? tick : Math.min(bout.rollbackTo, tick);
            }
            bout.window.minLead = Math.min(bout.window.minLead, tick - bout.tick);
            bout.heardFromPeer = true;
            if (!mpClient.opponentDropDeadline) {
                mpClient.waitingForPeer = false;
            }
        };

        // The opponent's simulation fingerprint for a tick (both paths deliver it; the first copy is compared)
        mpClient.onPeerHashCallback = (segment, tick, hash) => {
            const bout = onlineBout;
            if (!bout || segment !== (bout.segment & 0xFF) || bout.peerHashes.has(tick)) return;
            bout.peerHashes.set(tick, hash);
            compareStateHash(bout, tick);
        };

        // The server asks the phone that kept the bout to restart both phones from its state
        mpClient.onRestartRequestCallback = (segment) => restartBoutFromHere(segment);

        mpClient.onPeerSnapshotCallback = (data) => {
            if (onlineBout && data.segment <= onlineBout.segment) return; // an older restart
            onlineResume = { ...onlineResume, snapshot: { segment: data.segment, resume: data.resume } };
            resumeOnlineBout();
        };

        // So the server knows, when we rejoin, whether this phone can hand over the bout's state
        mpClient.boutLiveProvider = () => !!onlineBout;

        mpClient.onSpectateCallback = onSpectate;
        mpClient.onSpectatorInputCallback = onSpectatorInput;

        mpClient.onMatchEndedCallback = (data) => {
            mpClient.resultAt = Date.now();
            if (onlineBout) closeNetStats(onlineBout, performance.now(), "final");
            if (viewer && !viewer.replay) viewer.final = true; // the fight plays out without more inputs
            const haptics = window.Telegram?.WebApp?.HapticFeedback;
            if (haptics && !mpClient.isSpectator && data.winner_id) {
                try { haptics.notificationOccurred(data.winner_id === mpClient.userId ? 'success' : 'error'); } catch (_) {}
            }
        };

        // Both players asked for a rematch: same pair, new match, straight to hero select
        mpClient.onRematchStartCallback = (matchId) => {
            onlineBout = null;
            totalDesyncs = 0;
            onlineResume = null;
            viewer = null;
            mpClient._watching = false;
            window.__muteVibration = false;
            CoreEngine.onlineVersus = null;
            mpClient.switchMatch(matchId);
            // Players pick again; spectators wait on the same screen for the next fight
            CoreEngine.setGameState(11);
            CoreEngine.exec_u_int_to_void(1);
        };

        // Leaving the app mid-fight (minimised, phone call): the opponent sees a countdown instead of a freeze
        // (pagehide comes before the hidden visibilitychange of a page that is reloading or closing)
        window.addEventListener('pagehide', () => {
            mpClient.leavingPage = true;
            if (onlineBout && !onlineBout.statsClosed && mpClient.status === "ACTIVE") {
                reportNetStats(onlineBout, performance.now(), "pagehide");
            }
        });
        window.addEventListener('beforeunload', () => { mpClient.leavingPage = true; });
        window.addEventListener('pageshow', () => { mpClient.leavingPage = false; });
        document.addEventListener('visibilitychange', () => {
            mpClient.setAway(document.hidden);
            noteVisibility(document.hidden);
        });
        try {
            window.Telegram?.WebApp?.onEvent?.('deactivated', () => mpClient.setAway(true));
            window.Telegram?.WebApp?.onEvent?.('activated', () => mpClient.setAway(false));
        } catch (_) {}

        mpClient.bootMs = Math.round(performance.now());
        mpClient.initUI();
        if (mpClient.isReplay) startReplay();

        // Read-only view of the online state, for tests and debugging from the console
        window.__onlineDebug = {
            bout: () => onlineBout,
            viewer: () => viewer,
            desyncs: () => totalDesyncs,
            panel: () => (showResultPanelNow() ? resultPanelLines() : null),
        };

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
