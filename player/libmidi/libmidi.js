// Enhanced LibMidi with Dual-Channel Audio & Robust Auto-Unlock

export function unlockAudioContext(audioCtx) {
    if (!audioCtx) return;

    function unlock() {
        if (audioCtx.state === 'suspended') {
            audioCtx.resume().then(() => {
                console.log('[Audio] AudioContext successfully resumed');
            }).catch(e => console.warn('[Audio] Resume error:', e));
        }
        clean();
    }

    const events = ['touchstart', 'touchend', 'mousedown', 'pointerdown', 'keydown'];
    function clean() {
        events.forEach(e => {
            window.removeEventListener(e, unlock, true);
            document.removeEventListener(e, unlock, true);
        });
    }

    events.forEach(e => {
        window.addEventListener(e, unlock, { capture: true, passive: true });
        document.addEventListener(e, unlock, { capture: true, passive: true });
    });

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && audioCtx.state === 'suspended') {
            audioCtx.resume().catch(e => {});
        }
    });
}

export function createUnlockingAudioContext(...params) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const ac = new AudioCtx(...params);
    unlockAudioContext(ac);
    return ac;
}

export function closeContext(ctx) {
    if (ctx && ctx.close) return ctx.close();
}

class CmdClient {
    constructor(port) {
        this.port = port;
        this.messageCounter = 0;
        this.pendingMessages = {};
        this.port.addEventListener('message', this._handleMessage.bind(this));
    }

    send(what, transfer = []) {
        const msgId = ++this.messageCounter;
        return new Promise((resolve, reject) => {
            this.pendingMessages[msgId] = { resolve, reject };
            this.port.postMessage({ ...what, msgId }, transfer);
        });
    }

    _handleMessage(event) {
        const data = event.data;
        if (data && data.replyFor) {
            const { replyFor, value, error } = data;
            const handlers = this.pendingMessages[replyFor];
            if (handlers) {
                if (error !== undefined) {
                    handlers.reject(error);
                } else {
                    handlers.resolve(value);
                }
                delete this.pendingMessages[replyFor];
            }
        }
    }
}

export class MIDIPlayer extends EventTarget {
    static _unregister = ([client, node, gainNode]) => {
        if (client) client.send({ cmd: "delete" }).catch(() => {});
        if (node) node.disconnect();
        if (gainNode) gainNode.disconnect();
    };

    static _finalizer = new FinalizationRegistry(args => {
        MIDIPlayer._unregister(args);
    });

    constructor(audioContext, destination) {
        super();
        this.audioContext = audioContext;
        this.destination = destination;

        if (!audioContext || !audioContext.audioWorklet || typeof AudioWorkletNode === 'undefined') {
            return;
        }

        this.gainNode = audioContext.createGain();
        this.gainNode.gain.value = 1.0;
        this.gainNode.connect(destination);

        this.node = new AudioWorkletNode(audioContext, 'midi-player', {
            outputChannelCount: [2]
        });
        this.node.connect(this.gainNode);
        this.client = new CmdClient(this.node.port);

        const weakThis = new WeakRef(this);
        this.node.port.onmessage = e => {
            if (e.data?.replyFor) return;
            if (e.data === 'end-of-media') {
                weakThis.deref()?.dispatchEvent(new Event('end-of-media'));
            }
        };

        this.duration = 0;
        this.isClosed = false;
        MIDIPlayer._finalizer.register(this, [this.client, this.node, this.gainNode], this);
    }

    send(what, transfer = []) {
        if (this.isClosed || !this.client) return Promise.resolve(null);
        return this.client.send(what, transfer);
    }

    async setSequence(buffer) {
        if (this.isClosed) return { duration: 0 };
        const res = await this.send({ cmd: "setSequence", buffer });
        const duration = res?.duration || 0;
        this.duration = duration;
        return { duration };
    }

    play() {
        if (!this.isClosed) this.send({ cmd: "play" });
    }

    loop(times) {
        if (!this.isClosed) this.send({ cmd: "loop", times });
    }

    stop() {
        if (!this.isClosed) this.send({ cmd: "stop" });
    }

    shortEvent(status, data1, data2) {
        if (!this.isClosed) this.send({ cmd: "shortEvent", status, data1, data2 });
    }

    getPosition() {
        if (this.isClosed) return Promise.resolve(0);
        return this.send({ cmd: "getPosition" });
    }

    seek(pos) {
        if (!this.isClosed) this.send({ cmd: "seek", pos });
    }

    close() {
        if (this.isClosed) return;
        this.isClosed = true;
        MIDIPlayer._unregister([this.client, this.node, this.gainNode]);
        MIDIPlayer._finalizer.unregister(this);
    }

    get volume() {
        return this.gainNode ? this.gainNode.gain.value : 1;
    }

    set volume(v) {
        if (this.gainNode) this.gainNode.gain.value = v;
    }
}

/**
 * Smart Dual-Channel Audio Manager:
 * Maintains a dedicated BGM channel and SFX channel.
 * Short sound effects will NEVER stop or wipe background music!
 */
export class LibMidi {
    constructor(context, destination = null) {
        this.context = context;
        this.destination = destination || context.destination;
        this.initialized = false;

        this.bgmPlayer = null;
        this.sfxPlayer = null;
        this.activeBgmSeq = null;
        this.isMuted = false;

        this.masterGain = this.context.createGain();
        this.masterGain.connect(this.destination);
    }

    async init() {
        if (!this.context || !this.context.audioWorklet) {
            this.initialized = true;
            return;
        }

        try {
            const addModuleTask = this.context.audioWorklet.addModule(new URL('worklet.js', import.meta.url).toString());
            const wasmRes = await fetch(new URL('libmidi.wasm', import.meta.url));
            const module = await WebAssembly.compileStreaming(wasmRes);
            await addModuleTask;

            const bootstrapNode = new AudioWorkletNode(this.context, "bootstrap", {
                processorOptions: { module }
            });

            await new Promise((resolve, reject) => {
                bootstrapNode.port.onmessage = e => {
                    if (e.data.ok) resolve();
                    else reject(e.data.error);
                };
            });

            this.bgmPlayer = new MIDIPlayer(this.context, this.masterGain);
            this.sfxPlayer = new MIDIPlayer(this.context, this.masterGain);

            this.initialized = true;
            console.log('[Audio] LibMidi initialized with dual BGM/SFX channels.');
        } catch (err) {
            console.error('[Audio] LibMidi init error:', err);
            this.initialized = false;
        }
    }

    get midiPlayer() {
        // Return a smart proxy that routes BGM vs SFX automatically
        return this.getSmartPlayerProxy();
    }

    getSmartPlayerProxy() {
        const self = this;
        let isBgm = false;
        let activePlayer = self.bgmPlayer;

        const proxy = new EventTarget();

        proxy.setSequence = async function(buffer) {
            if (self.context && self.context.state === 'suspended') {
                self.context.resume().catch(() => {});
            }

            const len = buffer.byteLength || buffer.length || 0;
            // Tracks >= 5000 bytes are BGM (Track 3, 4, 5 in NBC)
            // Tracks < 5000 bytes are SFX (Track 0, 1, 2 in NBC)
            isBgm = len >= 5000;
            activePlayer = isBgm ? self.bgmPlayer : self.sfxPlayer;

            if (isBgm) {
                self.activeBgmSeq = buffer;
            }

            if (activePlayer) {
                return await activePlayer.setSequence(buffer);
            }
            return { duration: 0 };
        };

        proxy.play = function() {
            if (self.context && self.context.state === 'suspended') {
                self.context.resume().catch(() => {});
            }
            if (activePlayer) {
                activePlayer.play();
            }
        };

        proxy.loop = function(times) {
            if (times === -1 || times > 1) {
                isBgm = true;
                activePlayer = self.bgmPlayer;
            }
            if (activePlayer) {
                activePlayer.loop(times);
            }
        };

        proxy.stop = function() {
            if (!isBgm && activePlayer === self.sfxPlayer) {
                // Stopping SFX only stops the SFX channel!
                // It NEVER interrupts the BGM channel!
                self.sfxPlayer?.stop();
            } else if (isBgm) {
                self.bgmPlayer?.stop();
            }
        };

        proxy.shortEvent = function(status, data1, data2) {
            activePlayer?.shortEvent(status, data1, data2);
        };

        proxy.getPosition = function() {
            return activePlayer ? activePlayer.getPosition() : Promise.resolve(0);
        };

        proxy.seek = function(pos) {
            activePlayer?.seek(pos);
        };

        proxy.close = function() {
            // When game destroys temporary SFX player, do NOT destroy the audio worklet!
            if (!isBgm) {
                self.sfxPlayer?.stop();
            }
        };

        Object.defineProperty(proxy, 'volume', {
            get() { return activePlayer ? activePlayer.volume : 1; },
            set(v) { if (activePlayer) activePlayer.volume = v; }
        });

        return proxy;
    }

    setMuted(mute) {
        this.isMuted = !!mute;
        if (this.masterGain) {
            this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.35, this.context.currentTime);
        }
    }

    toggleMute() {
        this.setMuted(!this.isMuted);
        return this.isMuted;
    }
}
