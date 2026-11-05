import assert from "node:assert/strict";
import {
    FREEZE_MS, MAX_LISTED_FREEZES, newNetStats, noteFrame, noteTick, noteInput, noteWork,
    stallBegin, stallAdvance, stallSkip, stallEnd, reportFields
} from "../player/js/net_telemetry.js";

// Counters are raw sums over the window, so the server can add windows together and divide once
{
    const s = newNetStats(1000, 4);
    noteFrame(s, 16, true, 10, 1016);
    noteFrame(s, 60, true, 11, 1076);
    noteFrame(s, 16, false, 12, 1092);
    const r = reportFields(s, 1092);
    assert.equal(r.frames, 3);
    assert.equal(r.frame_ms_sum, 92);
    assert.equal(r.max_frame_ms, 60);
    assert.equal(r.slow_frames, 1);
    assert.equal(r.live_frames, 2);
    assert.equal(r.live_slow_frames, 1);
    assert.equal(r.live_secs, 0.1); // 76ms in a live round, rounded to a tenth
    // Only frames inside a live round go in the histogram: <20, <33, <50, <100, <250, <1000, longer
    assert.deepEqual(r.live_frame_hist, [1, 0, 0, 1, 0, 0, 0]);
    assert.equal(r.freezes.length, 0);
}

// A long frame is a freeze; it's a live one only inside a round
{
    const s = newNetStats(0, 4);
    noteFrame(s, FREEZE_MS, true, 50, 1000);
    noteFrame(s, FREEZE_MS + 500, false, 60, 2000);
    assert.equal(s.hitchFreezesLive, 1);
    assert.equal(s.stallFreezesLive, 0);
    assert.equal(s.freezesOther, 1);
    assert.equal(s.freezeLiveMs, FREEZE_MS);
    const r = reportFields(s, 3000);
    assert.equal(r.freezes.length, 2);
    // ago_ms: how long before the report it began
    assert.deepEqual(r.freezes[0], { kind: "hitch", ms: 250, ago_ms: 2250, tick: 50, live: true, open: false });
    assert.equal(r.freezes[1].live, false);
}

// The counts keep going after the list of individual freezes is full
{
    const s = newNetStats(0, 4);
    for (let i = 0; i < MAX_LISTED_FREEZES + 5; i++) noteFrame(s, 300, true, i, i * 1000);
    assert.equal(s.hitchFreezesLive, MAX_LISTED_FREEZES + 5);
    assert.equal(s.freezes.length, MAX_LISTED_FREEZES);
}

// Ticks at each input delay, for the share of the fight spent within a lag goal
{
    const s = newNetStats(0, 3);
    noteTick(s, true, 3);
    noteTick(s, true, 3);
    noteTick(s, true, 7);
    noteTick(s, false, 7);
    assert.equal(s.ticks, 4);
    assert.equal(s.liveTicks, 3);
    assert.equal(s.liveDelayHist[3], 2);
    assert.equal(s.liveDelayHist[7], 1);
}

// A stall crossing a report: its time is split between the windows, and it counts once, where it ends
{
    const first = newNetStats(0, 4);
    const stall = stallBegin(9000, 300, true, false);
    stallAdvance(first, stall, 10000); // the report goes out mid-stall
    assert.equal(first.stallMs, 1000);
    assert.equal(first.liveStallMs, 1000);
    assert.equal(first.stalls, 0);

    const second = newNetStats(10000, 4);
    stallEnd(second, stall, 10500);
    assert.equal(second.stallMs, 500);
    assert.equal(second.stalls, 1);
    assert.equal(second.liveStalls, 1);
    assert.equal(second.maxStallMs, 1500); // its whole length, not just this window's part
    assert.equal(first.stallMs + second.stallMs, 1500); // nothing counted twice
    assert.deepEqual(second.liveStallHist, [0, 0, 0, 0, 1]); // 1500ms: the 1s and longer bucket
    assert.equal(second.stallFreezesLive, 1);
    const r = reportFields(second, 11000);
    assert.deepEqual(r.freezes[0], { kind: "stall", ms: 1500, ago_ms: 2000, tick: 300, live: true, open: false });
}

// Paused time inside a stall isn't stall time
{
    const s = newNetStats(0, 4);
    const stall = stallBegin(1000, 10, true, false);
    stallAdvance(s, stall, 1100);
    stallSkip(stall, 61100); // a minute with the opponent gone
    stallEnd(s, stall, 61200);
    assert.equal(s.stallMs, 200);
    assert.equal(s.maxStallMs, 200);
    assert.equal(s.stallFreezesLive, 0);
}

// Waiting for the opponent to finish loading isn't a stall
{
    const s = newNetStats(0, 4);
    const stall = stallBegin(0, 8, false, true);
    stallEnd(s, stall, 3000);
    assert.equal(s.loadWaitMs, 3000);
    assert.equal(s.stalls, 0);
    assert.equal(s.stallMs, 0);
    assert.equal(s.freezesOther, 0);
}

// A stall still open when the fight ends is reported as such, or it would never be counted at all
{
    const s = newNetStats(0, 4);
    const stall = stallBegin(1000, 10, true, false);
    stallEnd(s, stall, 2000, true);
    assert.equal(reportFields(s, 2000).freezes[0].open, true);
}

// Inputs: which path delivered them first, and how early they came
{
    const s = newNetStats(0, 4);
    noteInput(s, 5, "udp");
    noteInput(s, -2, "tcp");
    noteInput(s, 1, "udp");
    const r = reportFields(s, 1000);
    assert.equal(r.inputs_udp, 2);
    assert.equal(r.inputs_tcp, 1);
    assert.equal(r.late_inputs, 1);
    assert.equal(r.lead_sum, 4);
    assert.equal(r.lead_min, -2);
}

// Paused and hidden time come off the fight's speed
{
    const s = newNetStats(0, 4);
    s.pausedMs = 4000;
    s.hiddenMs = 1000;
    for (let i = 0; i < 300; i++) noteTick(s, true, 4);
    noteWork(s, 12);
    noteWork(s, 3);
    const r = reportFields(s, 10000); // 10s on the clock, 5s of it running
    assert.equal(r.secs, 10);
    assert.equal(r.ticks_per_s, 60);
    assert.equal(r.work_ms_sum, 15);
    assert.equal(r.max_work_ms, 12);
}

// A flush right after another one has nothing to say
{
    const s = newNetStats(1000, 4);
    assert.equal(reportFields(s, 1010), null);
    assert.notEqual(reportFields(s, 2000), null); // time passing is worth reporting: it may be a pause
}

console.log("net_telemetry checks passed");
