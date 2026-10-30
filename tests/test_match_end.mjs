import assert from "node:assert/strict";
import { stepMatchEnd } from "../player/js/match_end.js";

const idle = { armed: false };

// Hero confirm: second fighter exists at 0 health during the walk-in (stage 1).
const walkIn = stepMatchEnd(idle, {
    fightersExist: true,
    p1Health: 100,
    p2Health: 0,
    p1Rounds: 0,
    p2Rounds: 0,
    stagePhase: 1
});
assert.deepEqual(walkIn, { armed: false, finish: false, winner: null });

// Both still at 0 before the round gives them health.
const unspawnedHealth = stepMatchEnd(idle, {
    fightersExist: true,
    p1Health: 0,
    p2Health: 0,
    p1Rounds: 0,
    p2Rounds: 0,
    stagePhase: 1
});
assert.equal(unspawnedHealth.finish, false);
assert.equal(unspawnedHealth.armed, false);

// Fight stage with both fighters alive arms the bout and does not end it.
const live = stepMatchEnd(idle, {
    fightersExist: true,
    p1Health: 100,
    p2Health: 100,
    p1Rounds: 0,
    p2Rounds: 0,
    stagePhase: 2
});
assert.deepEqual(live, { armed: true, finish: false, winner: null });

// First round lost. Match continues.
const oneRound = stepMatchEnd({ armed: true }, {
    fightersExist: true,
    p1Health: 40,
    p2Health: 0,
    p1Rounds: 1,
    p2Rounds: 0,
    stagePhase: 2
});
assert.deepEqual(oneRound, { armed: true, finish: false, winner: null });

// Two round wins ends the match for that side.
const p1Match = stepMatchEnd({ armed: true }, {
    fightersExist: true,
    p1Health: 20,
    p2Health: 0,
    p1Rounds: 2,
    p2Rounds: 1,
    stagePhase: 2
});
assert.deepEqual(p1Match, { armed: false, finish: true, winner: "p1" });

const p2Match = stepMatchEnd({ armed: true }, {
    fightersExist: true,
    p1Health: 0,
    p2Health: 15,
    p1Rounds: 0,
    p2Rounds: 2,
    stagePhase: 2
});
assert.deepEqual(p2Match, { armed: false, finish: true, winner: "p2" });

// A stale two-win counter from an earlier bout must not finish before this bout arms.
const stale = stepMatchEnd(idle, {
    fightersExist: true,
    p1Health: 0,
    p2Health: 100,
    p1Rounds: 2,
    p2Rounds: 0,
    stagePhase: 2
});
assert.equal(stale.finish, false);
assert.equal(stale.armed, false);

console.log("match_end checks passed");
