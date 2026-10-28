import { LibMedia } from "../libmedia/libmedia.js";
import { LibMidi, createUnlockingAudioContext } from "../libmidi/libmidi.js";
import { codeMap, KeyRepeatManager } from "./key.js";
import { EventQueue } from "./eventqueue.js";
import { initKbdListeners, setKbdHandler } from "./screenKbd.js";

import canvasFontNatives from "../libjs/libcanvasfont.js";
import canvasGraphicsNatives from "../libjs/libcanvasgraphics.js";
import gles2Natives from "../libjs/libgles2.js";
import jsReferenceNatives from "../libjs/libjsreference.js";
import mediaBridgeNatives from "../libjs/libmediabridge.js";
import midiBridgeNatives from "../libjs/libmidibridge.js";

const evtQueue = new EventQueue();
const keyRepeatManager = new KeyRepeatManager();
window.evtQueue = evtQueue;

const sp = new URLSearchParams(location.search);
const cheerpjWebRoot = '/app' + location.pathname.replace(/\/[^/]*$/, '');

let display = null;
let screenCtx = null;
let isReady = false;
let audioContext = null;

// Alternative key aliases for comfortable desktop and mobile play
const keyAliases = {
    'KeyW': 'ArrowUp',
    'KeyS': 'ArrowDown',
    'KeyA': 'ArrowLeft',
    'KeyD': 'ArrowRight',
    'Space': 'Enter',
    'KeyZ': 'Digit1',
    'KeyX': 'Digit3',
    'KeyC': 'Digit4',
    'KeyV': 'Digit6',
    'KeyB': 'Digit5',
    'KeyN': 'Digit7',
    'KeyQ': 'F1',
    'KeyE': 'F2',
};

function setupScaling() {
    display = document.getElementById('display');
    const container = document.getElementById('screen-container');

    function updateScale() {
        if (!container || !display) return;
        // In landscape or small-height viewports, let CSS flexbox & aspect-ratio constrain the height
        // to prevent pushing the controls panel off screen.
    }

    window.addEventListener('resize', updateScale);
    window.addEventListener('orientationchange', () => setTimeout(updateScale, 150));
    updateScale();
}

function setListeners() {
    // Mobile On-Screen Controls listener
    setKbdHandler((isDown, key) => {
        let actualKey = keyAliases[key] || key;
        const symbol = actualKey.startsWith('Digit') ? actualKey.substring(5) : '\x00';
        keyRepeatManager.post(isDown, actualKey, { symbol, ctrlKey: false, shiftKey: false });
    });

    // Physical Keyboard listener
    function handleKeyEvent(e) {
        if (e.repeat) return;
        let code = keyAliases[e.code] || e.code;
        const isDown = e.type === 'keydown';

        if (code === 'KeyM' && isDown) {
            toggleMute();
            e.preventDefault();
            return;
        }

        if (codeMap[code]) {
            keyRepeatManager.post(isDown, code, {
                symbol: e.key && e.key.length === 1 ? e.key.charCodeAt(0) : '\x00',
                ctrlKey: e.ctrlKey,
                shiftKey: e.shiftKey
            });
            e.preventDefault();
        }
    }

    window.addEventListener('keydown', handleKeyEvent);
    window.addEventListener('keyup', handleKeyEvent);

    keyRepeatManager.register((kind, key, args) => {
        if (codeMap[key]) {
            evtQueue.queueEvent({
                kind: kind === 'up' ? 'keyup' : 'keydown',
                args: [codeMap[key], args.symbol, args.ctrlKey, args.shiftKey]
            });
        }
    });

    // Touch/Pointer events on game screen (for menus or touch interaction)
    function getCanvasCoords(clientX, clientY) {
        const rect = display.getBoundingClientRect();
        const scaleX = (screenCtx?.canvas?.width || 352) / rect.width;
        const scaleY = (screenCtx?.canvas?.height || 416) / rect.height;
        const x = Math.max(0, Math.min(351, Math.floor((clientX - rect.left) * scaleX)));
        const y = Math.max(0, Math.min(415, Math.floor((clientY - rect.top) * scaleY)));
        return { x, y };
    }

    display.addEventListener('pointerdown', e => {
        display.focus();
        const { x, y } = getCanvasCoords(e.clientX, e.clientY);
        evtQueue.queueEvent({ kind: 'pointerpressed', x, y });
        e.preventDefault();
    });

    display.addEventListener('pointermove', e => {
        if (e.buttons > 0) {
            const { x, y } = getCanvasCoords(e.clientX, e.clientY);
            evtQueue.queueEvent({ kind: 'pointerdragged', x, y });
            e.preventDefault();
        }
    });

    display.addEventListener('pointerup', e => {
        const { x, y } = getCanvasCoords(e.clientX, e.clientY);
        evtQueue.queueEvent({ kind: 'pointerreleased', x, y });
        e.preventDefault();
    });

    initKbdListeners();
}

function setupToolbar() {
    const muteBtn = document.getElementById('btn-mute');
    const fsBtn = document.getElementById('btn-fullscreen');
    const resetBtn = document.getElementById('btn-reset');
    const kbdToggleBtn = document.getElementById('btn-kbd-toggle');
    const numKeypad = document.getElementById('num-keypad');

    if (muteBtn) {
        muteBtn.addEventListener('click', toggleMute);
    }

    if (fsBtn) {
        fsBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {});
            } else {
                document.exitFullscreen().catch(() => {});
            }
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm('Restart game?')) {
                location.reload();
            }
        });
    }

    if (kbdToggleBtn && numKeypad) {
        kbdToggleBtn.addEventListener('click', () => {
            const isHidden = numKeypad.classList.contains('hidden');
            if (isHidden) {
                numKeypad.classList.remove('hidden');
                kbdToggleBtn.classList.add('active');
            } else {
                numKeypad.classList.add('hidden');
                kbdToggleBtn.classList.remove('active');
            }
        });
    }
}

function toggleMute() {
    if (window.libmidi) {
        const isMuted = window.libmidi.toggleMute();
        const muteBtn = document.getElementById('btn-mute');
        if (muteBtn) {
            muteBtn.textContent = isMuted ? '🔇' : '🔊';
            muteBtn.classList.toggle('muted', isMuted);
        }
    }
}

async function init() {
    console.log('[App] init() started. cheerpjWebRoot =', cheerpjWebRoot);
    const loadingEl = document.getElementById("loading-text");
    const loadingSubtext = document.getElementById("loading-subtext");
    const progressBar = document.getElementById("progress-bar-fill");
    const progressTimer = document.getElementById("loading-timer");

    let startTime = Date.now();
    const progressTimerId = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        let pct = Math.min(94, Math.round(5 + (elapsed / 48) * 85));
        if (progressBar) progressBar.style.width = pct + "%";
        if (progressTimer) {
            if (elapsed < 10) {
                progressTimer.textContent = `Downloading WebAssembly JVM... (${elapsed}s)`;
            } else if (elapsed < 28) {
                progressTimer.textContent = `Compiling J2ME Bytecode... (${elapsed}s)`;
            } else if (elapsed < 45) {
                progressTimer.textContent = `Mounting Ultimate Mortal Kombat 3 Assets... (${elapsed}s)`;
            } else {
                progressTimer.textContent = `Almost ready! Booting Game... (${elapsed}s)`;
            }
        }
    }, 1000);

    if (loadingEl) loadingEl.textContent = "Loading WebAssembly Runtime...";
    if (loadingSubtext) loadingSubtext.textContent = "Downloading CheerpJ JVM (~20MB on initial run)...";

    display = document.getElementById('display');
    screenCtx = display.getContext('2d');

    setupScaling();
    setListeners();
    setupToolbar();

    console.log('[App] Initializing LibMidi...');
    audioContext = createUnlockingAudioContext();
    window.libmidi = new LibMidi(audioContext);
    await window.libmidi.init();

    window.libmedia = new LibMedia();

    if (loadingEl) loadingEl.textContent = "Starting J2ME Engine...";
    if (loadingSubtext) loadingSubtext.textContent = "Initializing WebAssembly runtime...";
    console.log('[App] Calling cheerpjInit...');

    try {
        await cheerpjInit({
            enableDebug: true,
            natives: {
                ...canvasFontNatives,
                ...canvasGraphicsNatives,
                ...gles2Natives,
                ...jsReferenceNatives,
                ...mediaBridgeNatives,
                ...midiBridgeNatives,
                async Java_pl_zb3_freej2me_bridge_shell_Shell_setTitle(lib, title) {
                    document.title = title;
                },
                async Java_pl_zb3_freej2me_bridge_shell_Shell_setIcon(lib, iconBytes) {},
                async Java_pl_zb3_freej2me_bridge_shell_Shell_getScreenCtx(lib) {
                    return screenCtx;
                },
                async Java_pl_zb3_freej2me_bridge_shell_Shell_setCanvasSize(lib, width, height) {
                    console.log('[App] setCanvasSize called:', width, height);
                    clearInterval(progressTimerId);
                    if (progressBar) progressBar.style.width = "100%";
                    if (!isReady) {
                        const splash = document.getElementById('splash-screen');
                        if (splash) splash.style.display = 'none';
                        display.style.display = 'block';
                        isReady = true;
                        display.focus();
                    }
                    screenCtx.canvas.width = width;
                    screenCtx.canvas.height = height;
                },
                async Java_pl_zb3_freej2me_bridge_shell_Shell_waitForAndDispatchEvents(lib, listener) {
                    const KeyEvent = await lib.pl.zb3.freej2me.bridge.shell.KeyEvent;
                    const PointerEvent = await lib.pl.zb3.freej2me.bridge.shell.PointerEvent;

                    const evt = await evtQueue.waitForEvent();
                    if (evt.kind === 'keydown') {
                        await listener.keyPressed(await new KeyEvent(...evt.args));
                    } else if (evt.kind === 'keyup') {
                        await listener.keyReleased(await new KeyEvent(...evt.args));
                    } else if (evt.kind === 'pointerpressed') {
                        await listener.pointerPressed(await new PointerEvent(evt.x, evt.y));
                    } else if (evt.kind === 'pointerdragged') {
                        await listener.pointerDragged(await new PointerEvent(evt.x, evt.y));
                    } else if (evt.kind === 'pointerreleased') {
                        await listener.pointerReleased(await new PointerEvent(evt.x, evt.y));
                    } else if (evt.kind === 'player-eom') {
                        await listener.playerEOM(evt.player);
                    } else if (evt.kind === 'player-video-frame') {
                        await listener.playerVideoFrame(evt.player);
                    }
                },
                async Java_pl_zb3_freej2me_bridge_shell_Shell_restart(lib) {
                    location.reload();
                },
                async Java_pl_zb3_freej2me_bridge_shell_Shell_exit(lib) {
                    location.reload();
                },
                async Java_pl_zb3_freej2me_bridge_shell_Shell_say(lib, sth) {
                    console.log('[FreeJ2ME]', sth);
                }
            }
        });
        console.log('[App] cheerpjInit() resolved successfully!');
    } catch (e) {
        console.error('[App] cheerpjInit() failed:', e);
        if (loadingEl) loadingEl.textContent = "CheerpJ Init Error: " + e.message;
        return;
    }

    if (loadingEl) loadingEl.textContent = "Compiling FreeJ2ME Engine...";
    if (loadingSubtext) loadingSubtext.textContent = "JIT compiling bytecode into WebAssembly (~30-60s on first run)...";
    const jarLibPath = cheerpjWebRoot + "/freej2me-web.jar";
    console.log('[App] Calling cheerpjRunLibrary on:', jarLibPath);

    let lib;
    try {
        lib = await cheerpjRunLibrary(jarLibPath);
        console.log('[App] cheerpjRunLibrary resolved!');
        if (loadingEl) loadingEl.textContent = "Starting Game...";
        if (loadingSubtext) loadingSubtext.textContent = "Loading Ultimate Mortal Kombat 3 assets...";
    } catch (e) {
        console.error('[App] cheerpjRunLibrary failed:', e);
        if (loadingEl) loadingEl.textContent = "Library Load Error: " + e.message;
        return;
    }

    try {
        const FreeJ2ME = await lib.org.recompile.freej2me.FreeJ2ME;
        const gameJar = sp.get('jar') || "Ultimate_Mortal_Kombat_3_deobf.jar";
        const gamePath = cheerpjWebRoot + "/jar/" + gameJar;
        console.log('[App] Launching FreeJ2ME.main with:', gamePath);

        FreeJ2ME.main(['jar', gamePath]).then(() => {
            console.log('[App] FreeJ2ME.main returned successfully');
        }).catch(e => {
            console.error('[App] Error in FreeJ2ME.main execution:', e);
            if (loadingEl) loadingEl.textContent = "Execution Error: " + e;
        });
    } catch (e) {
        console.error('[App] Error starting FreeJ2ME class:', e);
    }
}

// Initial audio unlocking banner on first click
window.addEventListener('click', () => {
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume().catch(() => {});
    }
}, { once: true });

init();
