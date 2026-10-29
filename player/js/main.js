import { loadAllAssets } from './assets.js';
import { Graphics, Display } from './j2me/graphics.js';
import { Manager } from './j2me/audio.js';
import { initEngine, SDKMIDlet, CoreEngine } from './engine/umk3.js';

let midlet = null;
let animFrameId = null;
let isAudioMuted = false;
let canvas = null;
let ctx = null;

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

    // 6-Button Combat Cluster (J2ME NumPad 1..9)
    'Digit1': 49, // High Punch (HP)
    'Numpad1': 49,
    'KeyZ': 49,
    'KeyU': 49,

    'Digit2': 50, // Jump / Up
    'Numpad2': 50,
    'KeyI': 50,

    'Digit3': 51, // High Kick (HK)
    'Numpad3': 51,
    'KeyO': 51,

    'Digit4': 52, // Low Punch (LP)
    'Numpad4': 52,
    'KeyC': 52,
    'KeyJ': 52,

    'Digit5': 53, // Block (BL)
    'Numpad5': 53,
    'KeyB': 53,
    'KeyL': 53,

    'Digit6': 54, // Low Kick (LK)
    'Numpad6': 54,
    'KeyV': 54,
    'KeyK': 54,

    'Digit7': 55, // Run (RN)
    'Numpad7': 55,
    'KeyN': 55,
    'ShiftLeft': 55,
    'ShiftRight': 55,

    'Digit8': 56, // Crouch / Down
    'Numpad8': 56,

    'Digit9': 57, // Special
    'Numpad9': 57
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
        const actx = Manager.getAudioContext();
        if (actx && actx.state === 'suspended') {
            actx.resume().catch(() => {});
        }
    } catch (_) {}
}

function sendKeyEvent(keyCode, isDown) {
    if (!CoreEngine.val_maincanvasbridge_a) return;
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

    // Also visually highlight joystick indicator arrows when keyboard arrow keys are pressed
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
        const ind = document.querySelector(`[data-joy-dir="${joyDir}"]`);
        if (ind) {
            if (isActive) ind.classList.add('active');
            else ind.classList.remove('active');
        }
    }
}

function setupInputControls() {
    // --- 1. VIRTUAL 360° JOYSTICK CONTROLLER (FREE ROTATION WITH 8-WAY DIRECTIONAL FEEDBACK) ---
    const joyZone = document.getElementById('joystick-zone');
    const joyThumb = document.getElementById('joystick-thumb');
    if (joyZone && joyThumb) {
        let joyPointerId = null;
        let currentJoyDir = null;
        let hasMovedBeyondDeadzone = false;

        const joyIndicators = {
            'up': joyZone.querySelector('[data-joy-dir="up"]'),
            'down': joyZone.querySelector('[data-joy-dir="down"]'),
            'left': joyZone.querySelector('[data-joy-dir="left"]'),
            'right': joyZone.querySelector('[data-joy-dir="right"]'),
            'up-left': joyZone.querySelector('[data-joy-dir="up-left"]'),
            'up-right': joyZone.querySelector('[data-joy-dir="up-right"]'),
            'down-left': joyZone.querySelector('[data-joy-dir="down-left"]'),
            'down-right': joyZone.querySelector('[data-joy-dir="down-right"]')
        };

        const DIR_KEYS = {
            'up': [-1],
            'down': [-2],
            'left': [-3],
            'right': [-4],
            'up-left': [-1, -3],
            'up-right': [-1, -4],
            'down-left': [-2, -3],
            'down-right': [-2, -4]
        };

        const SECTORS = [
            'right',       // 0: [337.5°, 22.5°)
            'down-right',  // 1: [22.5°, 67.5°)
            'down',        // 2: [67.5°, 112.5°)
            'down-left',   // 3: [112.5°, 157.5°)
            'left',        // 4: [157.5°, 202.5°)
            'up-left',     // 5: [202.5°, 247.5°)
            'up',          // 6: [247.5°, 292.5°)
            'up-right'     // 7: [292.5°, 337.5°)
        ];

        function setJoyDirection(newDir) {
            if (newDir === currentJoyDir) return;

            // Release previous direction
            if (currentJoyDir) {
                const oldInd = joyIndicators[currentJoyDir];
                if (oldInd) oldInd.classList.remove('active');
                const oldKeys = DIR_KEYS[currentJoyDir];
                if (oldKeys) {
                    oldKeys.forEach(k => sendKeyEvent(k, false));
                }
            }

            currentJoyDir = newDir;

            // Press new direction
            if (currentJoyDir) {
                const newInd = joyIndicators[currentJoyDir];
                if (newInd) newInd.classList.add('active');
                const newKeys = DIR_KEYS[currentJoyDir];
                if (newKeys) {
                    newKeys.forEach(k => sendKeyEvent(k, true));
                }
                triggerHaptic(8);
                unlockAudio();
            }
        }

        function handleJoyMove(clientX, clientY) {
            const rect = joyZone.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = clientX - cx;
            const dy = clientY - cy;
            const dist = Math.hypot(dx, dy);

            // Maximum radius for thumb travel
            const maxRadius = Math.max(15, (rect.width / 2) - 24);
            const deadZone = 10;

            let thumbX = dx;
            let thumbY = dy;
            if (dist > maxRadius) {
                thumbX = (dx / dist) * maxRadius;
                thumbY = (dy / dist) * maxRadius;
            }

            // Smooth 360-degree free rotation visual positioning
            joyThumb.style.transform = `translate3d(${thumbX}px, ${thumbY}px, 0)`;

            if (dist < deadZone) {
                setJoyDirection(null);
                return;
            }

            hasMovedBeyondDeadzone = true;
            let deg = Math.atan2(dy, dx) * (180 / Math.PI);
            if (deg < 0) deg += 360;

            const sector = Math.floor(((deg + 22.5) % 360) / 45);
            setJoyDirection(SECTORS[sector] || null);
        }

        function releaseJoystick() {
            joyZone.classList.remove('dragging');
            joyThumb.style.transform = 'translate3d(0, 0, 0)';
            setJoyDirection(null);
        }

        joyZone.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            joyPointerId = e.pointerId;
            hasMovedBeyondDeadzone = false;
            joyZone.classList.add('dragging');
            try { joyZone.setPointerCapture(e.pointerId); } catch (_) {}
            handleJoyMove(e.clientX, e.clientY);
        });

        joyZone.addEventListener('pointermove', (e) => {
            if (joyPointerId === null || e.pointerId !== joyPointerId) return;
            e.preventDefault();
            handleJoyMove(e.clientX, e.clientY);
        });

        const onJoyEnd = (e) => {
            if (joyPointerId === null || e.pointerId !== joyPointerId) return;
            e.preventDefault();
            try { joyZone.releasePointerCapture(e.pointerId); } catch (_) {}
            joyPointerId = null;

            // Center tap detection (< 10px deadzone movement): dispatch Fire / OK (-5)
            if (!hasMovedBeyondDeadzone) {
                sendKeyEvent(-5, true);
                setTimeout(() => sendKeyEvent(-5, false), 90);
                triggerHaptic(14);
                unlockAudio();
            }

            releaseJoystick();
        };

        joyZone.addEventListener('pointerup', onJoyEnd);
        joyZone.addEventListener('pointercancel', onJoyEnd);
    }

    // --- 2. INDEPENDENT ACTION BUTTONS (OPTNS, BACK, COMBAT KEYS 1 TO 9) ---
    const actionButtons = document.querySelectorAll('.ctrl-btn');
    actionButtons.forEach((btn) => {
        const keyData = btn.getAttribute('data-key');
        if (!keyData) return;

        const keys = keyData.split(',');

        const handlePress = (e) => {
            e.preventDefault();
            btn.classList.add('active');
            try { btn.setPointerCapture(e.pointerId); } catch (_) {}
            triggerHaptic(12);
            unlockAudio();

            keys.forEach((k) => {
                const j2meKey = KEY_MAP[k.trim()];
                if (j2meKey !== undefined) sendKeyEvent(j2meKey, true);
            });
        };

        const handleRelease = (e) => {
            e.preventDefault();
            btn.classList.remove('active');
            try { btn.releasePointerCapture(e.pointerId); } catch (_) {}

            keys.forEach((k) => {
                const j2meKey = KEY_MAP[k.trim()];
                if (j2meKey !== undefined) sendKeyEvent(j2meKey, false);
            });
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
                    keyData.split(',').forEach(k => {
                        const j2meKey = KEY_MAP[k.trim()];
                        if (j2meKey !== undefined) sendKeyEvent(j2meKey, false);
                    });
                }
            }
        });
    };

    window.addEventListener('blur', () => {
        releaseAllActionButtons();
    });
}

function setupKeyboardControls() {
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

        const keyCode = KEY_MAP[e.code];
        if (keyCode !== undefined) {
            sendKeyEvent(keyCode, true);
            triggerButtonActive(e.code, true);
            e.preventDefault();
        }
    });

    window.addEventListener('keyup', (e) => {
        const keyCode = KEY_MAP[e.code];
        if (keyCode !== undefined) {
            sendKeyEvent(keyCode, false);
            triggerButtonActive(e.code, false);
            e.preventDefault();
        }
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
}

function startAnimationLoop() {
    function loop() {
        if (midlet && !midlet.isExitRequested) {
            try {
                midlet.stepFrame();
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

        // 7. Start requestAnimationFrame loop
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
