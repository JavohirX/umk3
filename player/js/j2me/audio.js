/**
 * J2ME Audio Subsystem using Web Audio API
 * High-Precision Pure Native JavaScript MIDI Synthesizer & Sound Engine
 * Authentically synthesizes Living Mobile J2ME Standard MIDI tracks & retro sound effects.
 */

export class VolumeControl {
    constructor(player) {
        this.player = player;
        this.level = 100;
    }

    setLevel(val) {
        this.level = Math.max(0, Math.min(100, val));
        if (this.player && this.player.gainNode && this.player.audioCtx) {
            const now = this.player.audioCtx.currentTime;
            this.player.gainNode.gain.setValueAtTime(this.level / 100, now);
        }
    }

    getLevel() {
        return this.level;
    }
}

export class RetroMidiSynthesizer {
    constructor(audioCtx, destinationGain = null) {
        this.ctx = audioCtx;
        this.destinationGain = destinationGain;

        // Warm retro filter: rolls off harsh high-frequency buzz > 2800 Hz
        this.filterNode = this.ctx.createBiquadFilter();
        this.filterNode.type = "lowpass";
        this.filterNode.frequency.setValueAtTime(2800, this.ctx.currentTime);
        this.filterNode.Q.setValueAtTime(0.7, this.ctx.currentTime);

        // Dynamics Compressor: keeps polyphonic voices smooth without clipping
        this.compressor = this.ctx.createDynamicsCompressor();
        this.compressor.threshold.setValueAtTime(-18, this.ctx.currentTime);
        this.compressor.knee.setValueAtTime(12, this.ctx.currentTime);
        this.compressor.ratio.setValueAtTime(8, this.ctx.currentTime);
        this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
        this.compressor.release.setValueAtTime(0.15, this.ctx.currentTime);

        this.filterNode.connect(this.compressor);
        if (destinationGain) {
            this.compressor.connect(destinationGain);
        } else {
            this.compressor.connect(this.ctx.destination);
        }

        this.noiseBuffer = this._buildNoiseBuffer();
        this.schedulerTimer = null;
        this.activeVoices = new Set();
        this.isPlaying = false;
        this.loopCount = 1;
        this.trackStartTime = 0;
        this.noteIndex = 0;
        this.currentTrack = null;
    }

    _buildNoiseBuffer() {
        if (!this.ctx) return null;
        const sampleRate = this.ctx.sampleRate || 44100;
        const bufferSize = sampleRate * 1.0;
        const buffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        return buffer;
    }

    static parseMidi(rawBytes) {
        let bytes = rawBytes;
        if (bytes instanceof Int8Array) {
            bytes = new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength);
        } else if (Array.isArray(bytes)) {
            bytes = new Uint8Array(bytes.map(b => b < 0 ? b + 256 : b));
        }

        // Locate MThd header magic
        let start = 0;
        for (let i = 0; i < Math.min(bytes.length - 4, 64); i++) {
            if (bytes[i] === 0x4D && bytes[i + 1] === 0x54 && bytes[i + 2] === 0x68 && bytes[i + 3] === 0x64) {
                start = i;
                break;
            }
        }
        if (start > 0) bytes = bytes.slice(start);

        let pos = 0;
        const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

        function readUint32() {
            const v = view.getUint32(pos);
            pos += 4;
            return v;
        }
        function readUint16() {
            const v = view.getUint16(pos);
            pos += 2;
            return v;
        }
        function readUint8() {
            const v = view.getUint8(pos);
            pos += 1;
            return v;
        }
        function readVarLen() {
            let val = 0;
            let b;
            do {
                b = readUint8();
                val = (val << 7) | (b & 0x7F);
            } while (b & 0x80);
            return val;
        }

        const magic = String.fromCharCode(readUint8(), readUint8(), readUint8(), readUint8());
        if (magic !== 'MThd') throw new Error('Not Standard MIDI format: ' + magic);
        readUint32(); // headerLen
        readUint16(); // format
        const numTracks = readUint16();
        const division = readUint16();

        const events = [];
        let maxTrackDuration = 0;
        let globalTempo = 500000; // default 120 BPM (500000 us/beat)

        for (let t = 0; t < numTracks; t++) {
            if (pos >= bytes.byteLength) break;
            readUint8(); readUint8(); readUint8(); readUint8(); // 'MTrk'
            const trkLen = readUint32();
            const trkEnd = pos + trkLen;

            let runningStatus = 0;
            let currentTick = 0;
            let currentTimeSec = 0;
            let currentTempo = globalTempo;
            const channelPrograms = new Uint8Array(16);
            const activeNotes = Array.from({ length: 16 }, () => ({}));

            while (pos < trkEnd && pos < bytes.byteLength) {
                const deltaTicks = readVarLen();
                if (deltaTicks > 0) {
                    currentTick += deltaTicks;
                    const secondsPerTick = (currentTempo / 1000000) / division;
                    currentTimeSec += deltaTicks * secondsPerTick;
                }

                let status = readUint8();
                if (status < 0x80) {
                    pos--;
                    status = runningStatus;
                } else {
                    runningStatus = status;
                }

                if (status === 0xFF) {
                    const metaType = readUint8();
                    const len = readVarLen();
                    if (metaType === 0x51 && len === 3) {
                        const b0 = readUint8();
                        const b1 = readUint8();
                        const b2 = readUint8();
                        currentTempo = (b0 << 16) | (b1 << 8) | b2;
                        globalTempo = currentTempo;
                    } else {
                        pos += len;
                    }
                } else if (status === 0xF0 || status === 0xF7) {
                    const len = readVarLen();
                    pos += len;
                } else {
                    const cmd = status & 0xF0;
                    const chan = status & 0x0F;

                    if (cmd === 0x90) { // Note On
                        const note = readUint8();
                        const vel = readUint8();
                        if (vel > 0) {
                            if (activeNotes[chan][note]) {
                                const prev = activeNotes[chan][note];
                                events.push({
                                    time: prev.startTime,
                                    duration: Math.max(0.04, currentTimeSec - prev.startTime),
                                    note,
                                    vel: prev.vel,
                                    chan,
                                    isDrum: chan === 9,
                                    program: channelPrograms[chan]
                                });
                            }
                            activeNotes[chan][note] = { startTime: currentTimeSec, vel };
                        } else {
                            if (activeNotes[chan][note]) {
                                const prev = activeNotes[chan][note];
                                events.push({
                                    time: prev.startTime,
                                    duration: Math.max(0.04, currentTimeSec - prev.startTime),
                                    note,
                                    vel: prev.vel,
                                    chan,
                                    isDrum: chan === 9,
                                    program: channelPrograms[chan]
                                });
                                delete activeNotes[chan][note];
                            }
                        }
                    } else if (cmd === 0x80) { // Note Off
                        const note = readUint8();
                        readUint8();
                        if (activeNotes[chan][note]) {
                            const prev = activeNotes[chan][note];
                            events.push({
                                time: prev.startTime,
                                duration: Math.max(0.04, currentTimeSec - prev.startTime),
                                note,
                                vel: prev.vel,
                                chan,
                                isDrum: chan === 9,
                                program: channelPrograms[chan]
                            });
                            delete activeNotes[chan][note];
                        }
                    } else if (cmd === 0xC0) { // Program Change
                        channelPrograms[chan] = readUint8();
                    } else if (cmd === 0xD0) { // Channel Pressure
                        readUint8();
                    } else { // Control change (0xB0), Pitch bend (0xE0)
                        readUint8();
                        readUint8();
                    }
                }
            }

            for (let c = 0; c < 16; c++) {
                for (const n in activeNotes[c]) {
                    const prev = activeNotes[c][n];
                    events.push({
                        time: prev.startTime,
                        duration: Math.max(0.04, currentTimeSec - prev.startTime),
                        note: parseInt(n, 10),
                        vel: prev.vel,
                        chan: c,
                        isDrum: c === 9,
                        program: channelPrograms[c]
                    });
                }
            }

            if (currentTimeSec > maxTrackDuration) {
                maxTrackDuration = currentTimeSec;
            }
        }

        return {
            totalDuration: maxTrackDuration,
            notes: events.sort((a, b) => a.time - b.time)
        };
    }

    start(trackData, loopCount = 1) {
        this.stop();
        if (!trackData || !trackData.notes || trackData.notes.length === 0) return;

        this.currentTrack = trackData;
        this.loopCount = loopCount;
        this.isPlaying = true;
        this.noteIndex = 0;
        this.trackStartTime = this.ctx.currentTime + 0.05;

        this.schedulerTimer = setInterval(() => this._scheduleSlice(), 30);
        this._scheduleSlice();
    }

    setLoopCount(count) {
        this.loopCount = count;
    }

    stop() {
        if (this.schedulerTimer) {
            clearInterval(this.schedulerTimer);
            this.schedulerTimer = null;
        }
        this.isPlaying = false;
        this.noteIndex = 0;
        this.activeVoices.forEach(v => {
            try {
                if (v.osc && v.osc.stop) v.osc.stop();
                if (v.osc && v.osc.disconnect) v.osc.disconnect();
                if (v.gain && v.gain.disconnect) v.gain.disconnect();
                if (v.filter && v.filter.disconnect) v.filter.disconnect();
            } catch (_) {}
        });
        this.activeVoices.clear();
    }

    _scheduleSlice() {
        if (!this.isPlaying || !this.currentTrack || !this.ctx) return;

        const now = this.ctx.currentTime;
        const LOOKAHEAD = 0.25;
        const track = this.currentTrack;

        while (this.noteIndex < track.notes.length) {
            const note = track.notes[this.noteIndex];
            const scheduleTime = this.trackStartTime + note.time;

            if (scheduleTime > now + LOOKAHEAD) {
                break;
            }

            if (scheduleTime >= now - 0.05) {
                this._synthesizeNote(note, scheduleTime);
            }

            this.noteIndex++;
        }

        if (this.noteIndex >= track.notes.length) {
            const trackEndTime = this.trackStartTime + track.totalDuration;
            if (now >= trackEndTime) {
                if (this.loopCount === -1 || this.loopCount > 1) {
                    if (this.loopCount > 1) this.loopCount--;
                    this.noteIndex = 0;
                    this.trackStartTime = Math.max(now, trackEndTime);
                } else {
                    this.stop();
                }
            }
        }
    }

    _synthesizeNote(note, startTime) {
        if (!this.ctx) return;

        try {
            const duration = Math.min(4.0, Math.max(0.04, note.duration));
            const baseVol = (note.vel / 127) * 0.12;
            const stopTime = startTime + duration;

            if (note.isDrum) {
                this._synthesizeDrum(note.note, startTime, baseVol);
                return;
            }

            const osc = this.ctx.createOscillator();
            const voiceFilter = this.ctx.createBiquadFilter();
            voiceFilter.type = "lowpass";
            const gain = this.ctx.createGain();

            const freq = 440 * Math.pow(2, (note.note - 69) / 12);
            osc.frequency.setValueAtTime(freq, startTime);

            const p = note.program || 0;
            if (p >= 16 && p <= 23) {
                // Organ: warm sine tone
                osc.type = "sine";
                voiceFilter.frequency.setValueAtTime(2400, startTime);
            } else if (p >= 32 && p <= 39) {
                // Bass: deep round triangle
                osc.type = "triangle";
                voiceFilter.frequency.setValueAtTime(900, startTime);
            } else if ((p >= 40 && p <= 55) || (p >= 88 && p <= 95)) {
                // Strings & Pads: authentic Mortal Kombat rich synthesizer pad
                osc.type = "sawtooth";
                voiceFilter.frequency.setValueAtTime(1600, startTime);
                voiceFilter.Q.setValueAtTime(0.9, startTime);
            } else if (p >= 56 && p <= 71) {
                // Brass: filtered square wave
                osc.type = "square";
                voiceFilter.frequency.setValueAtTime(1300, startTime);
                voiceFilter.Q.setValueAtTime(0.7, startTime);
            } else if (p >= 72 && p <= 79) {
                // Flute / Whistle
                osc.type = "sine";
                voiceFilter.frequency.setValueAtTime(2600, startTime);
            } else if (p >= 112 && p <= 119) {
                // Taiko / Tinker / Reverse Cymbal
                osc.type = "triangle";
                voiceFilter.frequency.setValueAtTime(1200, startTime);
                osc.frequency.exponentialRampToValueAtTime(Math.max(30, freq * 0.4), stopTime);
            } else {
                // Default melodic voice: mellow triangle
                osc.type = "triangle";
                voiceFilter.frequency.setValueAtTime(1800, startTime);
            }

            const attackTime = Math.min(0.025, duration * 0.25);
            gain.gain.setValueAtTime(0.0001, startTime);
            gain.gain.linearRampToValueAtTime(baseVol, startTime + attackTime);
            gain.gain.setValueAtTime(baseVol * 0.75, startTime + Math.max(attackTime + 0.01, duration * 0.65));
            gain.gain.exponentialRampToValueAtTime(0.0001, stopTime + 0.04);

            osc.connect(voiceFilter);
            voiceFilter.connect(gain);
            gain.connect(this.filterNode);

            osc.start(startTime);
            osc.stop(stopTime + 0.05);

            const voiceRef = { osc, filter: voiceFilter, gain };
            this.activeVoices.add(voiceRef);
            osc.onended = () => {
                this.activeVoices.delete(voiceRef);
                try {
                    osc.disconnect();
                    voiceFilter.disconnect();
                    gain.disconnect();
                } catch (_) {}
            };
        } catch (_) {}
    }

    _synthesizeDrum(drumNote, startTime, baseVol) {
        if (!this.ctx) return;

        try {
            // Kick Drum (35, 36)
            if (drumNote === 35 || drumNote === 36) {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = "sine";
                osc.frequency.setValueAtTime(120, startTime);
                osc.frequency.exponentialRampToValueAtTime(35, startTime + 0.07);

                gain.gain.setValueAtTime(baseVol * 1.1, startTime);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.08);

                osc.connect(gain);
                gain.connect(this.filterNode);
                osc.start(startTime);
                osc.stop(startTime + 0.09);

                const v = { osc, gain };
                this.activeVoices.add(v);
                osc.onended = () => {
                    this.activeVoices.delete(v);
                    try { osc.disconnect(); gain.disconnect(); } catch (_) {}
                };
                return;
            }

            // Toms / Taiko (41, 43, 45, 47, 48, 50, 116)
            if (drumNote === 41 || drumNote === 43 || drumNote === 45 || drumNote === 47 || drumNote === 48 || drumNote === 50 || drumNote === 116) {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = "sine";
                const startFreq = drumNote > 45 ? 180 : 130;
                osc.frequency.setValueAtTime(startFreq, startTime);
                osc.frequency.exponentialRampToValueAtTime(45, startTime + 0.12);

                gain.gain.setValueAtTime(baseVol * 0.9, startTime);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.13);

                osc.connect(gain);
                gain.connect(this.filterNode);
                osc.start(startTime);
                osc.stop(startTime + 0.14);

                const v = { osc, gain };
                this.activeVoices.add(v);
                osc.onended = () => {
                    this.activeVoices.delete(v);
                    try { osc.disconnect(); gain.disconnect(); } catch (_) {}
                };
                return;
            }

            // Snare / Hi-Hat / Cymbal noise
            if (this.noiseBuffer) {
                const noise = this.ctx.createBufferSource();
                noise.buffer = this.noiseBuffer;

                const filter = this.ctx.createBiquadFilter();
                const gain = this.ctx.createGain();

                const isHiHat = (drumNote === 42 || drumNote === 44 || drumNote === 46 || drumNote === 49);
                const dur = isHiHat ? 0.035 : 0.07;

                filter.type = "bandpass";
                filter.frequency.setValueAtTime(isHiHat ? 4500 : 1200, startTime);
                filter.Q.setValueAtTime(isHiHat ? 2.0 : 1.4, startTime);

                const drumVol = baseVol * (isHiHat ? 0.25 : 0.50);
                gain.gain.setValueAtTime(drumVol, startTime);
                gain.gain.exponentialRampToValueAtTime(0.0005, startTime + dur);

                noise.connect(filter);
                filter.connect(gain);
                gain.connect(this.filterNode);

                noise.start(startTime);
                noise.stop(startTime + dur + 0.01);

                const v = { osc: noise, filter, gain };
                this.activeVoices.add(v);
                noise.onended = () => {
                    this.activeVoices.delete(v);
                    try { noise.disconnect(); filter.disconnect(); gain.disconnect(); } catch (_) {}
                };
            }
        } catch (_) {}
    }
}

export class Player {
    static UNREALIZED = 100;
    static REALIZED = 200;
    static PREFETCHED = 300;
    static STARTED = 400;
    static CLOSED = 0;

    constructor(audioCtx, data = null, contentType = "", soundId = 0) {
        this.audioCtx = audioCtx;
        this.data = data;
        this.contentType = contentType || "";
        this.soundId = soundId;
        this.state = Player.UNREALIZED;
        this.loopCount = 1;
        this.parsedMidi = null;
        this.audioBuffer = null;
        this.currentSource = null;

        this.volumeControl = new VolumeControl(this);
        this.gainNode = audioCtx ? audioCtx.createGain() : null;
        if (this.gainNode && audioCtx) {
            this.gainNode.connect(audioCtx.destination);
        }
        this.synth = (audioCtx && this.gainNode) ? new RetroMidiSynthesizer(audioCtx, this.gainNode) : null;
    }

    realize() {
        if (this.state === Player.CLOSED) return;

        // Extract raw byte buffer if wrapped in InputStream
        let rawBytes = this.data;
        if (rawBytes && rawBytes.buf) {
            rawBytes = rawBytes.buf;
        }

        // Check if MIDI
        const isMidi = (this.contentType === "audio/midi") ||
            (rawBytes && rawBytes.length >= 4 &&
             (rawBytes[0] === 0x4D || rawBytes[0] === 77) &&
             (rawBytes[1] === 0x54 || rawBytes[1] === 84) &&
             (rawBytes[2] === 0x68 || rawBytes[2] === 104) &&
             (rawBytes[3] === 0x64 || rawBytes[3] === 100));

        if (isMidi && rawBytes) {
            try {
                this.parsedMidi = RetroMidiSynthesizer.parseMidi(rawBytes);
            } catch (err) {
                console.warn("[Player] MIDI parse failed:", err);
            }
        } else if (this.soundId && Manager.sfxBuffers.has(this.soundId)) {
            this.audioBuffer = Manager.sfxBuffers.get(this.soundId);
        }

        this.state = Player.REALIZED;
    }

    prefetch() {
        if (this.state === Player.CLOSED) return;
        if (this.state === Player.UNREALIZED) {
            this.realize();
        }
        this.state = Player.PREFETCHED;
    }

    start() {
        if (this.state === Player.CLOSED || !this.audioCtx) return;
        Manager.unlockAudio();

        this.stop();

        if (this.parsedMidi && this.synth) {
            this.synth.start(this.parsedMidi, this.loopCount);
        } else if (this.soundId && Manager.sfxBuffers.has(this.soundId)) {
            const buf = Manager.sfxBuffers.get(this.soundId);
            try {
                const src = this.audioCtx.createBufferSource();
                src.buffer = buf;
                src.loop = (this.loopCount === -1 || this.loopCount > 1);
                src.connect(this.gainNode || this.audioCtx.destination);
                src.start(0);
                this.currentSource = src;
                src.onended = () => {
                    if (this.currentSource === src) {
                        this.currentSource = null;
                        this.state = Player.PREFETCHED;
                    }
                };
            } catch (_) {}
        } else if (this.audioBuffer) {
            try {
                const src = this.audioCtx.createBufferSource();
                src.buffer = this.audioBuffer;
                src.loop = (this.loopCount === -1 || this.loopCount > 1);
                src.connect(this.gainNode || this.audioCtx.destination);
                src.start(0);
                this.currentSource = src;
                src.onended = () => {
                    if (this.currentSource === src) {
                        this.currentSource = null;
                        this.state = Player.PREFETCHED;
                    }
                };
            } catch (_) {}
        }

        this.state = Player.STARTED;
    }

    stop() {
        if (this.state === Player.CLOSED) return;
        if (this.synth) {
            this.synth.stop();
        }
        if (this.currentSource) {
            try {
                this.currentSource.stop();
                this.currentSource.disconnect();
            } catch (_) {}
            this.currentSource = null;
        }
        this.state = Player.PREFETCHED;
    }

    deallocate() {
        if (this.state === Player.CLOSED) return;
        this.stop();
        this.state = Player.REALIZED;
    }

    close() {
        this.stop();
        if (this.gainNode) {
            try { this.gainNode.disconnect(); } catch (_) {}
        }
        this.state = Player.CLOSED;
    }

    getState() {
        return this.state;
    }

    setLoopCount(count) {
        this.loopCount = count;
        if (this.synth) {
            this.synth.setLoopCount(count);
        }
        if (this.currentSource) {
            this.currentSource.loop = (count === -1 || count > 1);
        }
    }

    setMediaTime(mediaTimeUs) {
        if (this.state === Player.STARTED) {
            this.start();
        }
    }

    getControl(controlType) {
        if (controlType && controlType.endsWith("VolumeControl")) {
            return this.volumeControl;
        }
        return null;
    }
}

export class Manager {
    static audioCtx = null;
    static sfxBuffers = new Map();
    static sfxPreloadPromise = null;

    static getAudioContext() {
        if (!Manager.audioCtx && typeof AudioContext !== 'undefined') {
            Manager.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            Manager.setupAutoUnlock(Manager.audioCtx);
        }
        return Manager.audioCtx;
    }

    static setupAutoUnlock(ctx) {
        if (typeof window === 'undefined' || !ctx) return;
        const unlock = () => {
            if (ctx.state === 'suspended') {
                ctx.resume().then(() => {
                    console.log('[Audio] Web Audio context resumed successfully');
                }).catch(() => {});
            }
            ['pointerdown', 'keydown', 'touchstart', 'mousedown', 'click'].forEach(e => {
                window.removeEventListener(e, unlock, true);
                document.removeEventListener(e, unlock, true);
            });
        };

        ['pointerdown', 'keydown', 'touchstart', 'mousedown', 'click'].forEach(e => {
            window.addEventListener(e, unlock, { capture: true, passive: true });
            document.addEventListener(e, unlock, { capture: true, passive: true });
        });

        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible' && ctx.state === 'suspended') {
                ctx.resume().catch(() => {});
            }
        });
    }

    static unlockAudio() {
        const ctx = Manager.getAudioContext();
        if (ctx && ctx.state === 'suspended') {
            ctx.resume().catch(() => {});
        }
    }

    static createPlayer(...args) {
        const ctx = Manager.getAudioContext();
        let data = null;
        let contentType = "";
        let soundId = 0;

        if (args.length >= 3) {
            data = args[0];
            contentType = args[1];
            soundId = args[2] || 0;
        } else if (args.length === 2) {
            data = args[0];
            contentType = args[1];
        } else if (args.length === 1) {
            contentType = args[0];
        }

        return new Player(ctx, data, contentType, soundId);
    }

    /**
     * Preloads all 55 converted MP3 sound effects into native Web Audio AudioBuffers
     */
    static async preloadSoundBank(basePath = 'assets/sfx/') {
        if (Manager.sfxPreloadPromise) return Manager.sfxPreloadPromise;

        const ctx = Manager.getAudioContext();
        if (!ctx) return;

        Manager.sfxPreloadPromise = (async () => {
            const soundIds = [];
            for (let i = 31; i <= 85; i++) soundIds.push(i);

            await Promise.all(soundIds.map(async (id) => {
                try {
                    const url = `${basePath}${id}.mp3`;
                    const res = await fetch(url);
                    if (!res.ok) return;
                    const arrayBuf = await res.arrayBuffer();
                    const audioBuf = await ctx.decodeAudioData(arrayBuf);
                    Manager.sfxBuffers.set(id, audioBuf);
                } catch (_) {}
            }));
            console.log(`[Audio] Preloaded ${Manager.sfxBuffers.size} sound effects into Web Audio memory.`);
        })();

        return Manager.sfxPreloadPromise;
    }
}
