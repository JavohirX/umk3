/**
 * J2ME Runtime Environment Emulation Layer
 * Provides core Java language utilities, I/O streams, System functions, and LCDUI support.
 */

// --- Array & Arithmetic Helpers ---

export function createArray(length, defaultValue = 0) {
    const arr = new Array(length);
    for (let i = 0; i < length; i++) {
        arr[i] = defaultValue;
    }
    return arr;
}

export function createMultiArray(dimensions, defaultValue = 0) {
    if (dimensions.length === 0) return defaultValue;
    const len = dimensions[0];
    const arr = new Array(len);
    const rest = dimensions.slice(1);
    for (let i = 0; i < len; i++) {
        arr[i] = rest.length > 0 ? createMultiArray(rest, defaultValue) : defaultValue;
    }
    return arr;
}

export function arraycopy(src, srcPos, dest, destPos, length) {
    if (!src || !dest) return;
    if (src === dest && destPos > srcPos) {
        for (let i = length - 1; i >= 0; i--) {
            dest[destPos + i] = src[srcPos + i];
        }
    } else {
        for (let i = 0; i < length; i++) {
            dest[destPos + i] = src[srcPos + i];
        }
    }
}

export function makeString(arg, off, len) {
    if (arg === undefined || arg === null) return "";
    if (typeof arg === 'string') return arg;
    if (Array.isArray(arg) || arg instanceof Uint8Array || arg instanceof Int8Array) {
        let start = off !== undefined ? off : 0;
        let count = len !== undefined ? len : (arg.length - start);
        let s = "";
        for (let i = 0; i < count; i++) {
            s += String.fromCharCode(arg[start + i] & 0xFF);
        }
        return s;
    }
    return String(arg);
}

// Enhance String and Object prototypes for Java-like equals()
if (!String.prototype.equals) {
    String.prototype.equals = function (other) {
        if (other === null || other === undefined) return false;
        return this.valueOf() === (typeof other === 'string' ? other : other.toString());
    };
}

if (!String.prototype.toCharArray) {
    String.prototype.toCharArray = function () {
        const len = this.length;
        const arr = new Array(len);
        for (let i = 0; i < len; i++) {
            arr[i] = this.charCodeAt(i);
        }
        return arr;
    };
}

if (!Object.prototype.equals) {
    Object.prototype.equals = function (other) {
        return this === other;
    };
}

// --- StringBuffer / StringBuilder Class ---

export class StringBuffer {
    constructor(initial = "") {
        this.str = typeof initial === 'string' ? initial : "";
    }
    append(x) {
        if (typeof x === 'number') {
            this.str += (x >= 32 && x <= 126) ? String.fromCharCode(x) : String(x);
        } else {
            this.str += (x !== null && x !== undefined ? x : "null");
        }
        return this;
    }
    toString() {
        return this.str;
    }
    length() {
        return this.str.length;
    }
    charAt(i) {
        return this.str.charAt(i);
    }
    setCharAt(i, c) {
        const ch = typeof c === 'number' ? String.fromCharCode(c) : c;
        this.str = this.str.substring(0, i) + ch + this.str.substring(i + 1);
    }
}

export const StringBuilder = StringBuffer;

// --- Random Class ---

export class Random {
    constructor(seed = Date.now()) {
        this.seed = seed;
    }
    nextInt(bound = undefined) {
        if (bound === undefined) {
            return (Math.random() * 2147483647) | 0;
        }
        return Math.floor(Math.random() * bound);
    }
}

// --- Thread Class ---

export class Thread {
    constructor(target = null) {
        this.target = target;
        this._isAlive = false;
    }
    setPriority(p) {}
    start() {
        this._isAlive = true;
        if (this.run) {
            this.run();
        } else if (this.target && this.target.run) {
            // If target is GameMidletLoop, startApp handles tickFrame / loop
            this.target.run();
        }
        this._isAlive = false;
    }
    isAlive() {
        return !!this._isAlive;
    }
    join() {
        this._isAlive = false;
    }
    run() {}
    static sleep(ms) {}
    static yield() {}
}

// --- System Class ---

export const System = {
    currentTimeMillis() {
        return Date.now();
    },
    arraycopy(src, srcPos, dest, destPos, length) {
        arraycopy(src, srcPos, dest, destPos, length);
    },
    gc() {},
    out: {
        println(...args) { console.log(...args); },
        print(...args) { console.log(...args); },
        getClass() { return this; },
        getResourceAsStream(name) { return ResourceManager.getResourceAsStream(name); }
    },
    err: {
        println(...args) { console.warn(...args); },
        print(...args) { console.warn(...args); }
    },
    getProperty(key) {
        if (key === "microedition.platform") return "NokiaN95/352x416";
        if (key === "microedition.configuration") return "CLDC-1.1";
        if (key === "microedition.profiles") return "MIDP-2.0";
        return "";
    }
};

// --- Vector Emulation ---

export class JVector extends Array {
    addElement(x) { this.push(x); }
    elementAt(i) { return this[i]; }
    size() { return this.length; }
    setSize(n) { this.length = n; }
    removeElementAt(i) { this.splice(i, 1); }
    contains(x) { return this.includes(x); }
    removeAllElements() { this.length = 0; }
}

// --- Stream Implementations ---

export class InputStream {
    read() { return -1; }
    readBytes(buf, off = 0, len = undefined) {
        if (len === undefined) len = buf.length;
        for (let i = 0; i < len; i++) {
            let b = this.read();
            if (b === -1) return i > 0 ? i : -1;
            buf[off + i] = (b << 24 >> 24);
        }
        return len;
    }
    available() { return 0; }
    skip(n) {
        for (let i = 0; i < n; i++) {
            if (this.read() === -1) return i;
        }
        return n;
    }
    close() {}
    mark(readlimit) {}
    reset() {}
    markSupported() { return false; }
}

export class ByteArrayInputStream extends InputStream {
    constructor(buf, offset = 0, length = undefined) {
        super();
        this.buf = buf instanceof Uint8Array ? buf : new Uint8Array(buf || []);
        this.pos = offset;
        this.markPos = offset;
        this.end = length !== undefined ? offset + length : this.buf.length;
    }
    mark(readlimit) {
        this.markPos = this.pos;
    }
    reset() {
        this.pos = this.markPos;
    }
    markSupported() {
        return true;
    }
    read() {
        if (this.pos >= this.end) return -1;
        return this.buf[this.pos++] & 0xFF;
    }
    readBytes(buf, off = 0, len = undefined) {
        if (len === undefined) len = buf.length;
        if (this.pos >= this.end) return -1;
        let count = Math.min(len, this.end - this.pos);
        for (let i = 0; i < count; i++) {
            buf[off + i] = (this.buf[this.pos++] << 24 >> 24);
        }
        return count;
    }
    available() {
        return Math.max(0, this.end - this.pos);
    }
}

export class ByteArrayOutputStream {
    constructor() {
        this.buffer = [];
    }
    write(b) {
        if (typeof b === 'number') {
            this.buffer.push(b & 0xFF);
        } else if (b && b.length !== undefined) {
            for (let i = 0; i < b.length; i++) {
                this.buffer.push(b[i] & 0xFF);
            }
        }
    }
    toByteArray() {
        const arr = new Int8Array(this.buffer.length);
        for (let i = 0; i < this.buffer.length; i++) {
            arr[i] = (this.buffer[i] << 24) >> 24;
        }
        return arr;
    }
    close() {}
}

export class DataInputStream {
    constructor(inStream) {
        this.inStream = inStream;
    }
    read() {
        return this.inStream.read();
    }
    readByte() {
        let b = this.inStream.read();
        return (b << 24) >> 24;
    }
    readUnsignedByte() {
        return this.inStream.read() & 0xFF;
    }
    readBoolean() {
        return this.inStream.read() !== 0;
    }
    readShort() {
        let ch1 = this.inStream.read();
        let ch2 = this.inStream.read();
        let s = (ch1 << 8) | ch2;
        return (s << 16) >> 16;
    }
    readUnsignedShort() {
        let ch1 = this.inStream.read();
        let ch2 = this.inStream.read();
        return ((ch1 << 8) | ch2) & 0xFFFF;
    }
    readInt() {
        let ch1 = this.inStream.read();
        let ch2 = this.inStream.read();
        let ch3 = this.inStream.read();
        let ch4 = this.inStream.read();
        return (ch1 << 24) | (ch2 << 16) | (ch3 << 8) | ch4;
    }
    readLong() {
        let hi = this.readInt();
        let lo = this.readInt() >>> 0;
        return hi * 4294967296 + lo;
    }
    readFully(b, off = 0, len = undefined) {
        if (len === undefined) len = b.length;
        for (let i = 0; i < len; i++) {
            let ch = this.inStream.read();
            b[off + i] = (ch << 24) >> 24;
        }
    }
    skipBytes(n) {
        for (let i = 0; i < n; i++) this.inStream.read();
        return n;
    }
    mark(readlimit) {
        if (this.inStream && typeof this.inStream.mark === 'function') {
            this.inStream.mark(readlimit);
        }
    }
    reset() {
        if (this.inStream && typeof this.inStream.reset === 'function') {
            this.inStream.reset();
        }
    }
    markSupported() {
        return this.inStream ? !!this.inStream.markSupported() : false;
    }
    close() {
        if (this.inStream && this.inStream.close) this.inStream.close();
    }
}

export class DataOutputStream {
    constructor(out) {
        this.out = out;
    }
    writeByte(v) {
        this.out.write(v & 0xFF);
    }
    writeBoolean(v) {
        this.out.write(v ? 1 : 0);
    }
    writeShort(v) {
        this.out.write((v >> 8) & 0xFF);
        this.out.write(v & 0xFF);
    }
    writeInt(v) {
        this.out.write((v >> 24) & 0xFF);
        this.out.write((v >> 16) & 0xFF);
        this.out.write((v >> 8) & 0xFF);
        this.out.write(v & 0xFF);
    }
    close() {
        if (this.out && this.out.close) this.out.close();
    }
}

// --- RMS (RecordStore) Implementation ---

export class RecordStore {
    constructor(name) {
        this.name = name;
        this.records = [];
        this.load();
    }

    static openRecordStore(name, createIfNecessary) {
        return new RecordStore(name);
    }

    load() {
        try {
            const data = localStorage.getItem('umk3_rms_' + this.name);
            if (data) {
                const parsed = JSON.parse(data);
                this.records = parsed.map(hex => {
                    const bytes = [];
                    for (let c = 0; c < hex.length; c += 2) {
                        bytes.push(parseInt(hex.substr(c, 2), 16));
                    }
                    return new Int8Array(bytes);
                });
            }
        } catch (_) {}
    }

    save() {
        try {
            const serialized = this.records.map(rec => {
                let hex = '';
                for (let i = 0; i < rec.length; i++) {
                    hex += (rec[i] & 0xFF).toString(16).padStart(2, '0');
                }
                return hex;
            });
            localStorage.setItem('umk3_rms_' + this.name, JSON.stringify(serialized));
        } catch (_) {}
    }

    getNumRecords() {
        return this.records.length;
    }

    getRecord(recordId) {
        const idx = recordId - 1;
        if (idx >= 0 && idx < this.records.length) {
            return this.records[idx];
        }
        return null;
    }

    setRecord(recordId, data, offset, numBytes) {
        const idx = recordId - 1;
        while (this.records.length <= idx) {
            this.records.push(new Int8Array(0));
        }
        const slice = new Int8Array(numBytes);
        for (let i = 0; i < numBytes; i++) {
            slice[i] = data[offset + i];
        }
        this.records[idx] = slice;
        this.save();
    }

    addRecord(data, offset, numBytes) {
        const slice = new Int8Array(numBytes);
        for (let i = 0; i < numBytes; i++) {
            slice[i] = data[offset + i];
        }
        this.records.push(slice);
        this.save();
        return this.records.length;
    }

    closeRecordStore() {
        this.save();
    }
}

// --- Resource Manager ---

export class ResourceManager {
    static assets = new Map();

    static register(name, uint8Array) {
        let cleanName = name.startsWith('/') ? name : '/' + name;
        this.assets.set(cleanName, uint8Array);
        this.assets.set(cleanName.substring(1), uint8Array);
    }

    static getBytes(name) {
        let cleanName = name.startsWith('/') ? name : '/' + name;
        let buf = this.assets.get(cleanName) || this.assets.get(cleanName.substring(1));
        return buf || null;
    }

    static getResourceAsStream(name) {
        const bytes = this.getBytes(name);
        if (!bytes) {
            console.warn(`[ResourceManager] Resource not found: ${name}`);
            return new ByteArrayInputStream(new Uint8Array(0));
        }
        return new ByteArrayInputStream(bytes);
    }
}

// Universal fallback for any Java object.getClass().getResourceAsStream(...) calls
Object.prototype.getResourceAsStream = function(name) {
    return ResourceManager.getResourceAsStream(name);
};

// --- Java Primitive Boxed Wrappers ---

export class Integer {
    static MAX_VALUE = 2147483647;
    static MIN_VALUE = -2147483648;
    static parseInt(s, radix = 10) {
        return parseInt(s, radix);
    }
    static toString(i, radix = 10) {
        return i.toString(radix);
    }
}
globalThis.Integer = Integer;

export class Short {
    static MAX_VALUE = 32767;
    static MIN_VALUE = -32768;
    static parseShort(s, radix = 10) {
        return parseInt(s, radix);
    }
}
globalThis.Short = Short;

export class Byte {
    static MAX_VALUE = 127;
    static MIN_VALUE = -128;
    static parseByte(s, radix = 10) {
        return parseInt(s, radix);
    }
}
globalThis.Byte = Byte;

export class Long {
    static MAX_VALUE = 9223372036854775807n;
    static MIN_VALUE = -9223372036854775808n;
    static parseLong(s, radix = 10) {
        return parseInt(s, radix);
    }
}
globalThis.Long = Long;
