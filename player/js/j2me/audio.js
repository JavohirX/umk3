/**
 * J2ME Audio Subsystem using Web Audio API
 */

export class VolumeControl {
    constructor(player) {
        this.player = player;
        this.level = 100;
    }

    setLevel(val) {
        this.level = Math.max(0, Math.min(100, val));
        if (this.player && this.player.gainNode) {
            this.player.gainNode.gain.setValueAtTime(this.level / 100, (this.player.audioCtx?.currentTime || 0));
        }
    }

    getLevel() {
        return this.level;
    }
}

export class Player {
    static UNREALIZED = 100;
    static REALIZED = 200;
    static PREFETCHED = 300;
    static STARTED = 400;
    static CLOSED = 0;

    constructor(audioCtx, data = null, contentType = "") {
        this.audioCtx = audioCtx;
        this.data = data;
        this.contentType = contentType;
        this.state = Player.UNREALIZED;
        this.loopCount = 1;
        this.volumeControl = new VolumeControl(this);
        this.gainNode = audioCtx ? audioCtx.createGain() : null;
        if (this.gainNode && audioCtx) {
            this.gainNode.connect(audioCtx.destination);
        }
    }

    realize() {
        if (this.state === Player.CLOSED) return;
        this.state = Player.REALIZED;
    }

    prefetch() {
        if (this.state === Player.CLOSED) return;
        this.state = Player.PREFETCHED;
    }

    start() {
        if (this.state === Player.CLOSED || !this.audioCtx) return;
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume().catch(() => {});
        }

        // Synthesize short retro sound effect
        try {
            const now = this.audioCtx.currentTime;
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(220, now);
            osc.frequency.exponentialRampToValueAtTime(55, now + 0.15);

            gain.gain.setValueAtTime((this.volumeControl.level / 100) * 0.4, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

            osc.connect(gain);
            gain.connect(this.gainNode || this.audioCtx.destination);

            osc.start(now);
            osc.stop(now + 0.15);
        } catch (_) {}

        this.state = Player.STARTED;
    }

    stop() {
        if (this.state === Player.CLOSED) return;
        this.state = Player.PREFETCHED;
    }

    close() {
        this.state = Player.CLOSED;
    }

    getState() {
        return this.state;
    }

    setLoopCount(count) {
        this.loopCount = count;
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

    static getAudioContext() {
        if (!Manager.audioCtx && typeof AudioContext !== 'undefined') {
            Manager.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        return Manager.audioCtx;
    }

    static createPlayer(...args) {
        const ctx = Manager.getAudioContext();
        if (args.length >= 2) {
            return new Player(ctx, args[0], args[1]);
        } else if (args.length === 1) {
            return new Player(ctx, null, args[0]);
        }
        return new Player(ctx);
    }
}
