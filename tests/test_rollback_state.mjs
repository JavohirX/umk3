import assert from "node:assert/strict";
import { createStateSaver, describeState } from "../player/js/rollback_state.js";

class Fighter { x = 0; health = 100; anim = null; }
class Engine {
    static tick = 0;
    static fighters = [new Fighter(), new Fighter()];
    static effects = [];          // array of objects, can grow
    static masks = { p1: 0, p2: 0 };  // plain object
    static table = [1, 2, 3, 4];  // numbers only
    static queue = [0, 0, 0];     // must NOT be saved (skipped field)
}

const saver = createStateSaver([Engine], { skipFields: [[Engine, "queue"]] });

// 1. Restore puts values back: save, then change Engine.tick, fighters[0].x, fighters[1].health, masks.p1, table[2]; load; assert all are back to the saved values.
const snap1 = saver.save();
Engine.tick = 42;
Engine.fighters[0].x = 15;
Engine.fighters[1].health = 80;
Engine.masks.p1 = 9;
Engine.table[2] = 99;
saver.load(snap1);
assert.equal(Engine.tick, 0);
assert.equal(Engine.fighters[0].x, 0);
assert.equal(Engine.fighters[1].health, 100);
assert.equal(Engine.masks.p1, 0);
assert.equal(Engine.table[2], 3);

// 2. Identity is kept: keep `const f0 = Engine.fighters[0]` before load, and assert `Engine.fighters[0] === f0` after load.
const snap2 = saver.save();
const f0 = Engine.fighters[0];
Engine.fighters[0].x = 55;
saver.load(snap2);
assert.equal(Engine.fighters[0], f0);

// 3. Objects created after the save are dropped: save; push a new object {kind: 1} into Engine.effects and set Engine.fighters[0].anim = {frame: 5}; load; assert Engine.effects.length is back to what it was and Engine.fighters[0].anim is back to its saved value.
const snap3 = saver.save();
const prevEffectsLength = Engine.effects.length;
const prevAnim = Engine.fighters[0].anim;
Engine.effects.push({ kind: 1 });
Engine.fighters[0].anim = { frame: 5 };
saver.load(snap3);
assert.equal(Engine.effects.length, prevEffectsLength);
assert.equal(Engine.fighters[0].anim, prevAnim);

// 4. Objects created after the save are themselves saved by the next save: push {kind: 2, t: 0} into Engine.effects, then save (snapshot B), then set Engine.effects[Engine.effects.length - 1].t = 99, then load(B), assert that effect's t is 0 again.
Engine.effects.push({ kind: 2, t: 0 });
const snapB = saver.save();
Engine.effects[Engine.effects.length - 1].t = 99;
saver.load(snapB);
assert.equal(Engine.effects[Engine.effects.length - 1].t, 0);

// 5. Skipped field is not rewound: save; set Engine.queue[0] = 7; load; assert Engine.queue[0] === 7.
const snap5 = saver.save();
Engine.queue[0] = 7;
saver.load(snap5);
assert.equal(Engine.queue[0], 7);

// 6. A field added to a plain object after a save is picked up: save; Engine.masks.p3 = 1; save again (snapshot C); Engine.masks.p3 = 2; load(C); assert Engine.masks.p3 === 1.
saver.save();
Engine.masks.p3 = 1;
const snapC = saver.save();
Engine.masks.p3 = 2;
saver.load(snapC);
assert.equal(Engine.masks.p3, 1);

// 7. describeState is stable: run the same mutations twice from the same snapshot (load, set fighters[0].x = 10, describeState; load, set fighters[0].x = 10, describeState) and assert the two Maps have the same size and every key has the same value.
const snap7 = saver.save();

saver.load(snap7);
Engine.fighters[0].x = 10;
const map1 = describeState([Engine]);

saver.load(snap7);
Engine.fighters[0].x = 10;
const map2 = describeState([Engine]);

assert.equal(map1.size, map2.size);
for (const [key, val] of map1) {
    assert.equal(map2.has(key), true);
    assert.equal(map2.get(key), val);
}

console.log("rollback_state tests passed");
