/**
 * Online match-end decision for the hero-select walk-in.
 *
 * Confirming a fighter spawns both actors before the round starts.
 * The second fighter is created with currentHealth 0 while the first
 * is already at 100. Reading that as a knockout ends the match on the
 * select screen.
 *
 * A bout arms only once the fight stage is running and both fighters
 * have health, with neither side already at two round wins. It finishes
 * when one side reaches two wins (best of three).
 *
 * @param {{ armed: boolean }} state
 * @param {{
 *   fightersExist: boolean,
 *   p1Health: number|null,
 *   p2Health: number|null,
 *   p1Rounds: number,
 *   p2Rounds: number,
 *   stagePhase: number
 * }} snapshot
 * @returns {{ armed: boolean, finish: boolean, winner: 'p1'|'p2'|null }}
 */
export function stepMatchEnd(state, snapshot) {
    const p1Rounds = snapshot.p1Rounds | 0;
    const p2Rounds = snapshot.p2Rounds | 0;
    const bothPresent = snapshot.fightersExist
        && snapshot.p1Health != null
        && snapshot.p2Health != null;

    if (!bothPresent) {
        return { armed: false, finish: false, winner: null };
    }

    if (!state.armed) {
        const roundIsLive = snapshot.stagePhase === 2
            && snapshot.p1Health > 0
            && snapshot.p2Health > 0
            && p1Rounds < 2
            && p2Rounds < 2;
        if (roundIsLive) {
            return { armed: true, finish: false, winner: null };
        }
        return { armed: false, finish: false, winner: null };
    }

    if (p1Rounds < 2 && p2Rounds < 2) {
        return { armed: true, finish: false, winner: null };
    }

    return {
        armed: false,
        finish: true,
        winner: p2Rounds > p1Rounds ? "p2" : "p1"
    };
}
