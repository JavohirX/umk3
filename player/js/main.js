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

    // Softkeys
    'F1': -6,
    'KeyQ': -6,
    'F2': -7,
    'KeyE': -7,
    'Escape': -7,

    // 6-Button Combat Cluster (J2ME NumPad 1..7)
    'Digit1': 49, // '1' - High Punch (HP)
    'KeyZ': 49,
    'KeyU': 49,

    'Digit2': 50, // '2' - Jump / Up
    'Digit3': 51, // '3' - High Kick (HK)
    'KeyX': 51,
    'KeyI': 51,

    'Digit4': 52, // '4' - Low Punch (LP)
    'KeyC': 52,
    'KeyJ': 52,

    'Digit5': 53, // '5' - Block (BL)
    'KeyB': 53,
    'KeyL': 53,

    'Digit6': 54, // '6' - Low Kick (LK)
    'KeyV': 54,
    'KeyK': 54,

    'Digit7': 55, // '7' - Run (RN)
    'KeyN': 55,
    'KeyO': 55,
    'ShiftLeft': 55,
    'ShiftRight': 55,

    'Digit8': 56, // '8' - Crouch / Down
    'Digit9': 57, // '9' - Special / Fatality
    'Digit0': 48  // '0'
};

function triggerHaptic() {
    try {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        } else if (navigator.vibrate) {
            navigator.vibrate(10);
        }
    } catch (_) {}
}

function unlockAudio() {
    const actx = Manager.getAudioContext();
    if (actx && actx.state === 'suspended') {
        actx.resume().catch(() => {});
    }
}

function sendKeyEvent(keyCode, isDown) {
    if (!CoreEngine.val_maincanvasbridge_a) return;
    if (isDown) {
        CoreEngine.val_maincanvasbridge_a.keyPressed(keyCode);
    } else {
        CoreEngine.val_maincanvasbridge_a.keyReleased(keyCode);
    }
}

function setupTouchControls() {
    const touchKeyMap = new Map();

    function getKeyAtPoint(x, y) {
        const el = document.elementFromPoint(x, y);
        return el ? el.closest('.ctrl-btn, .key') : null;
    }

    function activateKey(keyEl) {
        if (!keyEl || keyEl.classList.contains('active')) return;
        keyEl.classList.add('active');
        triggerHaptic();
        unlockAudio();

        if (keyEl.dataset.key) {
            const keys = keyEl.dataset.key.split(',');
            for (const k of keys) {
                const trimmed = k.trim();
                const code = KEY_MAP[trimmed] || (trimmed.startsWith('Digit') ? trimmed.charCodeAt(5) : null);
                if (code !== null) sendKeyEvent(code, true);
            }
        }
    }

    function deactivateKey(keyEl) {
        if (!keyEl || !keyEl.classList.contains('active')) return;
        keyEl.classList.remove('active');

        if (keyEl.dataset.key) {
            const keys = keyEl.dataset.key.split(',');
            for (const k of keys) {
                const trimmed = k.trim();
                const code = KEY_MAP[trimmed] || (trimmed.startsWith('Digit') ? trimmed.charCodeAt(5) : null);
                if (code !== null) sendKeyEvent(code, false);
            }
        }
    }

    const panel = document.querySelector('.mobile-controls-panel') || document.body;

    panel.addEventListener('touchstart', (e) => {
        e.preventDefault();
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            const keyEl = getKeyAtPoint(touch.clientX, touch.clientY);
            if (keyEl) {
                touchKeyMap.set(touch.identifier, keyEl);
                activateKey(keyEl);
            }
        }
    }, { passive: false });

    panel.addEventListener('touchmove', (e) => {
        e.preventDefault();
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            const currentKeyEl = getKeyAtPoint(touch.clientX, touch.clientY);
            const prevKeyEl = touchKeyMap.get(touch.identifier);

            if (currentKeyEl !== prevKeyEl) {
                if (prevKeyEl) deactivateKey(prevKeyEl);
                if (currentKeyEl) {
                    activateKey(currentKeyEl);
                    touchKeyMap.set(touch.identifier, currentKeyEl);
                } else {
                    touchKeyMap.delete(touch.identifier);
                }
            }
        }
    }, { passive: false });

    const endTouchHandler = (e) => {
        e.preventDefault();
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            const keyEl = touchKeyMap.get(touch.identifier);
            if (keyEl) {
                deactivateKey(keyEl);
                touchKeyMap.delete(touch.identifier);
            }
        }
    };

    panel.addEventListener('touchend', endTouchHandler, { passive: false });
    panel.addEventListener('touchcancel', endTouchHandler, { passive: false });

    // Mouse fallback for desktop clicks
    panel.addEventListener('mousedown', (e) => {
        const keyEl = e.target.closest('.ctrl-btn, .key');
        if (keyEl) {
            activateKey(keyEl);
            const upHandler = () => {
                deactivateKey(keyEl);
                window.removeEventListener('mouseup', upHandler);
            };
            window.addEventListener('mouseup', upHandler);
        }
    });

    // Toolbar buttons: Options, Back, Sound, Reset, Fullscreen
    const btnLsk = document.getElementById('btn-lsk');
    if (btnLsk) {
        btnLsk.addEventListener('click', () => {
            sendKeyEvent(-6, true);
            setTimeout(() => sendKeyEvent(-6, false), 100);
        });
    }

    const btnRsk = document.getElementById('btn-rsk');
    if (btnRsk) {
        btnRsk.addEventListener('click', () => {
            sendKeyEvent(-7, true);
            setTimeout(() => sendKeyEvent(-7, false), 100);
        });
    }

    const btnMute = document.getElementById('btn-mute');
    if (btnMute) {
        btnMute.addEventListener('click', () => {
            isAudioMuted = !isAudioMuted;
            btnMute.textContent = isAudioMuted ? 'UNMUTE' : 'SOUND';
            btnMute.style.color = isAudioMuted ? '#c91818' : '#99aab5';
            const actx = Manager.getAudioContext();
            if (actx) {
                if (isAudioMuted) actx.suspend().catch(() => {});
                else actx.resume().catch(() => {});
            }
        });
    }

    const btnReset = document.getElementById('btn-reset');
    if (btnReset) {
        btnReset.addEventListener('click', () => {
            if (confirm("Reset game?")) {
                location.reload();
            }
        });
    }

    const btnFullscreen = document.getElementById('btn-fullscreen');
    if (btnFullscreen) {
        btnFullscreen.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {});
            } else {
                document.exitFullscreen().catch(() => {});
            }
        });
    }
}

function setupKeyboardControls() {
    window.addEventListener('keydown', (e) => {
        if (e.repeat) return;
        unlockAudio();

        if (e.code === 'KeyM') {
            const btnMute = document.getElementById('btn-mute');
            if (btnMute) btnMute.click();
            e.preventDefault();
            return;
        }

        const keyCode = KEY_MAP[e.code];
        if (keyCode !== undefined) {
            sendKeyEvent(keyCode, true);
            e.preventDefault();
        }
    });

    window.addEventListener('keyup', (e) => {
        const keyCode = KEY_MAP[e.code];
        if (keyCode !== undefined) {
            sendKeyEvent(keyCode, false);
            e.preventDefault();
        }
    });
}

function setupCanvas() {
    canvas = document.getElementById('display');
    canvas.width = 352;
    canvas.height = 416;
    ctx = canvas.getContext('2d', { alpha: false });
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
    console.log("[UMK3] Bootstrapping Native JavaScript Engine...");

    const progressBar = document.getElementById('progress-bar-fill');
    const loadingText = document.getElementById('loading-text');
    const loadingSubtext = document.getElementById('loading-subtext');
    const splashScreen = document.getElementById('splash-screen');
    const canvasEl = document.getElementById('display');

    try {
        if (loadingText) loadingText.textContent = "Loading MK Assets...";
        if (loadingSubtext) loadingSubtext.textContent = "Fetching 34 game resources...";

        // 1. Fetch & register assets
        await loadAllAssets('assets/', (loaded, total, filename) => {
            const pct = Math.round((loaded / total) * 100);
            if (progressBar) progressBar.style.width = `${pct}%`;
            if (loadingSubtext) loadingSubtext.textContent = `${loaded}/${total}: ${filename}`;
        });

        if (loadingText) loadingText.textContent = "Initializing Engine...";
        if (loadingSubtext) loadingSubtext.textContent = "Compiling tables & states...";
        if (progressBar) progressBar.style.width = `100%`;

        // 2. Setup canvas & LCDUI graphics bridge
        setupCanvas();

        // 3. Setup input listeners
        setupTouchControls();
        setupKeyboardControls();

        // 4. Initialize engine static tables
        initEngine();

        // 5. Instantiate SDKMIDlet and boot game
        midlet = new SDKMIDlet();
        midlet.startApp();
        window.CoreEngine = CoreEngine;
        window.midlet = midlet;

        console.log("[UMK3] Native Engine Booted Successfully!");

        // 6. Hide splash screen, show game canvas
        if (splashScreen) {
            splashScreen.style.opacity = '0';
            splashScreen.style.transition = 'opacity 0.2s ease';
            setTimeout(() => {
                splashScreen.style.display = 'none';
                if (canvasEl) canvasEl.style.display = 'block';
            }, 200);
        } else if (canvasEl) {
            canvasEl.style.display = 'block';
        }

        // 7. Start requestAnimationFrame loop
        startAnimationLoop();

    } catch (err) {
        console.error("[UMK3 Bootstrap Failed]:", err);
        if (loadingText) {
            loadingText.textContent = "Load Failed";
            loadingText.style.color = "#ff4d4d";
        }
        if (loadingSubtext) {
            loadingSubtext.textContent = err.message || String(err);
        }
    }
}

// Start once DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
} else {
    bootstrap();
}
