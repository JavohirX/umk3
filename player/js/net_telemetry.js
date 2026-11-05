/**
 * What a phone measures about an online fight and reports to the server's fight log.
 *
 * Counters are kept per report ("window", about 10s) as raw sums, never averages, so the server can add any number of
 * windows together and divide once: an average of averages would weigh a 1s window the same as a 10s one.
 *
 * Time the fight isn't running doesn't count against it: while the bout stands frozen with a player gone or away
 * (pausedMs) or the page isn't on screen (hiddenMs) nothing here is measured, and a report's fight time is its wall
 * clock less those two. Nothing here reads or changes what the netcode decides; it only watches.
 */

// A frame or a wait for the opponent this long is a freeze: the fight visibly stops. Shorter ones are counted in the
// histograms, these are also listed one by one (up to MAX_LISTED_FREEZES a report; the counts include all of them).
export const FREEZE_MS = 250;
export const SLOW_FRAME_MS = 50;
export const MAX_LISTED_FREEZES = 20;

// Upper bounds of the histogram buckets; one more bucket holds everything longer
export const FRAME_BUCKETS_MS = [20, 33, 50, 100, 250, 1000];
export const STALL_BUCKETS_MS = [50, 100, 250, 1000];
// Index is the input delay in ticks (MAX_INPUT_DELAY in game_pure.js is 15)
export const DELAY_BUCKETS = 16;

function bucketOf(bounds, ms) {
    const i = bounds.findIndex((top) => ms < top);
    return i === -1 ? bounds.length : i;
}

export function newNetStats(now, delay, seq = 0) {
    return {
        since: now, seq,
        pausedMs: 0, hiddenMs: 0, liveMs: 0, setupMs: 0,
        frames: 0, frameMs: 0, maxFrameMs: 0, slowFrames: 0,
        liveFrames: 0, liveSlowFrames: 0, liveFrameHist: new Array(FRAME_BUCKETS_MS.length + 1).fill(0),
        ticks: 0, liveTicks: 0, tickMs: 0, workMs: 0, maxWorkMs: 0, paintsSkipped: 0, catchUpFrames: 0,
        stalls: 0, stallMs: 0, maxStallMs: 0, liveStalls: 0, liveStallMs: 0,
        liveStallHist: new Array(STALL_BUCKETS_MS.length + 1).fill(0), loadWaitMs: 0,
        stallFreezesLive: 0, hitchFreezesLive: 0, freezeLiveMs: 0, freezesOther: 0,
        delayMin: delay, delayMax: delay, liveDelayHist: new Array(DELAY_BUCKETS).fill(0),
        rollbacks: 0, rollbackTicks: 0, maxRollback: 0, rollbackMisses: 0, predictSum: 0,
        saves: 0, saveMs: 0, loads: 0, loadMs: 0, resimMs: 0,
        inputsUdp: 0, inputsTcp: 0, lateInputs: 0, leadSum: 0, leadMin: null,
        loopErrors: 0,
        freezes: []
    };
}

function noteFreeze(stats, kind, ms, startedAt, tick, live, open = false) {
    if (live) {
        if (kind === "stall") stats.stallFreezesLive++;
        else stats.hitchFreezesLive++;
        stats.freezeLiveMs += ms;
    } else {
        stats.freezesOther++;
    }
    if (stats.freezes.length < MAX_LISTED_FREEZES) stats.freezes.push({ kind, ms, startedAt, tick, live, open });
}

// One animation frame of the running fight, frameMs after the last one
export function noteFrame(stats, frameMs, live, tick, now) {
    stats.frames++;
    stats.frameMs += frameMs;
    stats.maxFrameMs = Math.max(stats.maxFrameMs, frameMs);
    if (frameMs > SLOW_FRAME_MS) stats.slowFrames++;
    if (live) {
        stats.liveMs += frameMs;
        stats.liveFrames++;
        if (frameMs > SLOW_FRAME_MS) stats.liveSlowFrames++;
        stats.liveFrameHist[bucketOf(FRAME_BUCKETS_MS, frameMs)]++;
    }
    if (frameMs >= FREEZE_MS) noteFreeze(stats, "hitch", frameMs, now - frameMs, tick, live);
}

// One new tick of the fight, at the input delay we were on
export function noteTick(stats, live, delay) {
    stats.ticks++;
    if (live) {
        stats.liveTicks++;
        stats.liveDelayHist[Math.min(delay, DELAY_BUCKETS - 1)]++;
    }
}

export function noteWork(stats, ms) {
    stats.workMs += ms;
    stats.maxWorkMs = Math.max(stats.maxWorkMs, ms);
}

// The opponent's input for a tick reached us for the first time, lead ticks before we'd run that tick (negative: we
// already ran it on a guess). path is the way it came first.
export function noteInput(stats, lead, path) {
    if (path === "udp") stats.inputsUdp++;
    else stats.inputsTcp++;
    if (lead < 0) stats.lateInputs++;
    stats.leadSum += lead;
    stats.leadMin = stats.leadMin === null ? lead : Math.min(stats.leadMin, lead);
}

// A wait for the opponent's input. It can outlast a report, so its time goes into whichever window it passes through,
// and it is counted (and listed if it was a freeze) in the window it ends in. loading: the opponent's phone hasn't
// started the fight yet, which is their loading screen rather than a stall.
export function stallBegin(now, tick, live, loading) {
    return { from: now, startedAt: now, ms: 0, tick, live, loading };
}

export function stallAdvance(stats, stall, now) {
    const ms = now - stall.from;
    stall.from = now;
    stall.ms += ms;
    if (stall.loading) {
        stats.loadWaitMs += ms;
    } else {
        stats.stallMs += ms;
        if (stall.live) stats.liveStallMs += ms;
    }
}

// Paused or hidden time inside a wait isn't part of it
export function stallSkip(stall, now) {
    stall.from = now;
}

export function stallEnd(stats, stall, now, open = false) {
    stallAdvance(stats, stall, now);
    if (stall.loading) return;
    stats.stalls++;
    stats.maxStallMs = Math.max(stats.maxStallMs, stall.ms);
    if (stall.live) {
        stats.liveStalls++;
        stats.liveStallHist[bucketOf(STALL_BUCKETS_MS, stall.ms)]++;
    }
    if (stall.ms >= FREEZE_MS) noteFreeze(stats, "stall", stall.ms, stall.startedAt, stall.tick, stall.live, open);
}

function round1(x) {
    return Math.round(x * 10) / 10;
}

// The numbers of a net_stats message. Empty windows (nothing ran and no time passed) come back null, so a flush right
// after another one sends nothing.
export function reportFields(stats, now) {
    const secs = (now - stats.since) / 1000;
    if (stats.ticks === 0 && stats.frames === 0 && secs < 0.05) return null;
    const activeSecs = Math.max(0, secs - (stats.pausedMs + stats.hiddenMs) / 1000);
    return {
        seq: stats.seq,
        secs: round1(secs),
        paused_ms: Math.round(stats.pausedMs),
        hidden_ms: Math.round(stats.hiddenMs),
        live_secs: round1(stats.liveMs / 1000),
        setup_ms: Math.round(stats.setupMs),
        ticks: stats.ticks,
        live_ticks: stats.liveTicks,
        ticks_per_s: activeSecs > 0 ? round1(stats.ticks / activeSecs) : null,
        frames: stats.frames,
        frame_ms_sum: Math.round(stats.frameMs),
        max_frame_ms: Math.round(stats.maxFrameMs),
        slow_frames: stats.slowFrames,
        live_frames: stats.liveFrames,
        live_slow_frames: stats.liveSlowFrames,
        live_frame_hist: stats.liveFrameHist,
        tick_ms_sum: round1(stats.tickMs),
        work_ms_sum: round1(stats.workMs),
        max_work_ms: round1(stats.maxWorkMs),
        paints_skipped: stats.paintsSkipped,
        catch_up_frames: stats.catchUpFrames,
        stalls: stats.stalls,
        stall_ms: Math.round(stats.stallMs),
        max_stall_ms: Math.round(stats.maxStallMs),
        live_stalls: stats.liveStalls,
        live_stall_ms: Math.round(stats.liveStallMs),
        live_stall_hist: stats.liveStallHist,
        load_wait_ms: Math.round(stats.loadWaitMs),
        stall_freezes_live: stats.stallFreezesLive,
        hitch_freezes_live: stats.hitchFreezesLive,
        freeze_live_ms: Math.round(stats.freezeLiveMs),
        freezes_other: stats.freezesOther,
        delay_min: stats.delayMin,
        delay_max: stats.delayMax,
        live_delay_hist: stats.liveDelayHist,
        rollbacks: stats.rollbacks,
        rollback_ticks: stats.rollbackTicks,
        max_rollback: stats.maxRollback,
        rollback_misses: stats.rollbackMisses,
        predict_sum: stats.predictSum,
        saves: stats.saves,
        save_ms_sum: round1(stats.saveMs),
        loads: stats.loads,
        load_ms_sum: round1(stats.loadMs),
        resim_ms_sum: round1(stats.resimMs),
        inputs_udp: stats.inputsUdp,
        inputs_tcp: stats.inputsTcp,
        late_inputs: stats.lateInputs,
        lead_sum: stats.leadSum,
        lead_min: stats.leadMin,
        loop_errors: stats.loopErrors,
        freezes: stats.freezes.map((f) => ({
            kind: f.kind, ms: Math.round(f.ms), ago_ms: Math.round(now - f.startedAt), tick: f.tick, live: f.live, open: f.open
        }))
    };
}
