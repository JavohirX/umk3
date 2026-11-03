/**
 * Save and restore the whole fight, for rollback netcode.
 *
 * The engine keeps everything on class statics (CoreEngine and friends) and the objects they reach, so a
 * snapshot walks that graph and copies every object's own fields. Restoring writes those fields back into the
 * same objects, so every reference the engine holds stays valid. Objects created after the snapshot are simply
 * no longer referenced once the fields that pointed at them are restored.
 *
 * Left out: things that are not game state and are expensive or unsafe to copy - images and canvases, Web Audio
 * objects, saved settings, and big read-only buffers such as the packed resource file.
 */

const SKIP_CONSTRUCTORS = new Set([
    // drawing
    'Graphics', 'Image', 'ConcreteImage', 'SpriteImage', 'HTMLCanvasElement', 'CanvasRenderingContext2D',
    'OffscreenCanvas', 'ImageData', 'ImageBitmap', 'HTMLImageElement',
    // sound
    'Player', 'RetroMidiSynthesizer', 'VolumeControl', 'AudioContext', 'GainNode', 'AudioBuffer',
    'AudioBufferSourceNode', 'OscillatorNode', 'BiquadFilterNode', 'WaveShaperNode', 'DynamicsCompressorNode',
    // persistence and platform objects
    'RecordStore', 'WebSocket', 'Promise', 'Map', 'Set', 'WeakMap', 'Window',
]);

// Typed arrays bigger than this are read-only data (the packed resource file, audio curves)
const MAX_TYPED_ARRAY = 16384;

function isSkipped(value) {
    if (typeof Node !== 'undefined' && value instanceof Node) return true;
    const ctor = value.constructor;
    if (ctor && SKIP_CONSTRUCTORS.has(ctor.name)) return true;
    if (ArrayBuffer.isView(value) && value.length > MAX_TYPED_ARRAY) return true;
    return false;
}

// Static fields of a class (or own fields of any root object), without the built-in function properties
function rootKeys(root) {
    return Object.getOwnPropertyNames(root).filter((k) => {
        if (typeof root === 'function' && (k === 'length' || k === 'name' || k === 'prototype')) return false;
        const d = Object.getOwnPropertyDescriptor(root, k);
        return d && 'value' in d && d.writable && typeof d.value !== 'function';
    });
}

/**
 * roots: classes and objects whose fields hold the game state (e.g. [CoreEngine, midlet, ...]).
 * options.skipFields: [object, fieldName] pairs left out of snapshots (e.g. an input queue that must not rewind).
 * Returns { save(), load(snapshot), refresh() }.
 *
 * Walking the graph is most of the cost of a save, so the walk is done once and its result (the layout) reused:
 * a save copies the fields of the objects the layout lists. The engine is translated Java, so a field or array
 * that held a number holds numbers for good; only the slots that can hold references are checked, and if one
 * points at an object the layout hasn't seen (something created since), the graph is walked again.
 */
export function createStateSaver(roots, options = {}) {
    const rootList = roots.filter(Boolean);
    const skipFields = new Map();
    for (const [obj, field] of options.skipFields || []) {
        if (!obj) continue;
        if (!skipFields.has(obj)) skipFields.set(obj, new Set());
        skipFields.get(obj).add(field);
    }
    const fieldsOf = (o, ks) => (skipFields.has(o) ? ks.filter((k) => !skipFields.get(o).has(k)) : ks);
    // Listing a class's fields also walks its thousands of methods, so it's done once, not on every save
    const listRootKeys = () => rootList.map((root) => fieldsOf(root, rootKeys(root)));
    let rootKeyLists = listRootKeys();
    let layout = null;

    function discover() {
        const objs = [];
        const keys = [];   // field names, or null for arrays
        const refs = [];   // objects: indexes of fields that can hold references; arrays: true if they can
        const open = [];   // plain objects, which can gain fields (engine classes declare all of theirs)
        const known = new Set();
        const stack = [];
        const visit = (v) => {
            if (v !== null && typeof v === 'object' && !known.has(v)) {
                known.add(v);
                if (!isSkipped(v)) stack.push(v);
            }
        };
        const refIndexes = (o, ks) => {
            const r = [];
            for (let i = 0; i < ks.length; i++) {
                const v = o[ks[i]];
                if (v === null || v === undefined || typeof v === 'object') {
                    r.push(i);
                    visit(v);
                }
            }
            return r;
        };

        // A root reached again through a field (the midlet, say) is already listed
        for (const root of rootList) known.add(root);
        for (let n = 0; n < rootList.length; n++) {
            objs.push(rootList[n]);
            keys.push(rootKeyLists[n]);
            refs.push(refIndexes(rootList[n], rootKeyLists[n]));
            open.push(false);
        }
        while (stack.length) {
            const o = stack.pop();
            objs.push(o);
            const proto = Object.getPrototypeOf(o);
            open.push(proto === Object.prototype || proto === null);
            if (ArrayBuffer.isView(o)) {
                keys.push(null);
                refs.push(false);
            } else if (Array.isArray(o)) {
                let holdsRefs = o.length === 0;
                for (let i = 0; i < o.length; i++) {
                    const v = o[i];
                    if (v === null || v === undefined || typeof v === 'object') {
                        holdsRefs = true;
                        visit(v);
                    }
                }
                keys.push(null);
                refs.push(holdsRefs);
            } else {
                const ks = fieldsOf(o, Object.keys(o));
                keys.push(ks);
                refs.push(refIndexes(o, ks));
            }
        }
        return { objs, keys, refs, open, known };
    }

    // The snapshot, or null if the layout is out of date
    function copy(L) {
        const { objs, keys, refs, open, known } = L;
        const vals = new Array(objs.length);
        for (let n = 0; n < objs.length; n++) {
            const o = objs[n];
            const ks = keys[n];
            const r = refs[n];
            if (ks === null) {
                const c = o.slice();
                if (r === true) {
                    for (let i = 0; i < c.length; i++) {
                        const v = c[i];
                        if (v !== null && typeof v === 'object' && !known.has(v)) return null;
                    }
                }
                vals[n] = c;
            } else {
                // A field added since the walk would be missed
                if (open[n] && fieldsOf(o, Object.keys(o)).length !== ks.length) return null;
                const vs = new Array(ks.length);
                for (let i = 0; i < ks.length; i++) vs[i] = o[ks[i]];
                for (let j = 0; j < r.length; j++) {
                    const v = vs[r[j]];
                    if (v !== null && typeof v === 'object' && !known.has(v)) return null;
                }
                vals[n] = vs;
            }
        }
        return { layout: L, vals };
    }

    function save() {
        let snap = layout && copy(layout);
        if (!snap) {
            layout = discover();
            snap = copy(layout);
        }
        return snap;
    }

    function load(snap) {
        const { objs, keys } = snap.layout;
        const vals = snap.vals;
        for (let n = 0; n < objs.length; n++) {
            const o = objs[n];
            const ks = keys[n];
            const vs = vals[n];
            if (ks === null) {
                if (ArrayBuffer.isView(o)) {
                    o.set(vs);
                } else {
                    if (o.length !== vs.length) o.length = vs.length;
                    for (let i = 0; i < vs.length; i++) o[i] = vs[i];
                }
            } else {
                for (let i = 0; i < ks.length; i++) o[ks[i]] = vs[i];
            }
        }
    }

    // Picks up static fields first assigned after the saver was made (call when a new bout starts)
    function refresh() {
        rootKeyLists = listRootKeys();
        layout = null;
    }

    return { save, load, refresh };
}

/**
 * A path -> value listing of everything a snapshot would capture, for tests: two runs that should end in the
 * same state must give the same listing (paths, not object identities, so freshly created objects compare).
 */
export function describeState(roots) {
    const out = new Map();
    const seen = new Map();
    const walk = (v, path) => {
        if (v === null || typeof v !== 'object') {
            out.set(path, typeof v === 'bigint' ? `${v}n` : v);
            return;
        }
        if (seen.has(v)) {
            out.set(path, `@${seen.get(v)}`);
            return;
        }
        seen.set(v, path);
        if (isSkipped(v)) {
            out.set(path, `<${v.constructor && v.constructor.name}>`);
            return;
        }
        if (ArrayBuffer.isView(v) || Array.isArray(v)) {
            for (let i = 0; i < v.length; i++) walk(v[i], `${path}[${i}]`);
            out.set(`${path}.length`, v.length);
        } else {
            for (const k of Object.keys(v)) {
                if (typeof v[k] !== 'function') walk(v[k], `${path}.${k}`);
            }
        }
    };
    for (const root of roots.filter(Boolean)) {
        const name = typeof root === 'function' ? root.name : (root.constructor && root.constructor.name);
        for (const k of rootKeys(root)) walk(root[k], `${name}.${k}`);
    }
    return out;
}
