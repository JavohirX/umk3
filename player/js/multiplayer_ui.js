/**
 * TOMBSTONE — multiplayer_ui.js
 *
 * This file intentionally neutralizes the old custom neon multiplayer UI
 * that was removed in commit de1a649. It exists solely to serve as a dead
 * no-op to any Telegram WebView that still has the old version cached.
 *
 * DO NOT add any UI logic to this file. It must remain a silent no-op forever.
 */

// Dead exports — match the old interface so any cached import doesn't throw
export const FIGHTERS = [];
export const audioSynth = { play: () => {}, stop: () => {} };

export class MultiplayerUI {
    constructor() {
        console.warn('[TOMBSTONE] multiplayer_ui.js is neutralized. No custom UI will render.');
    }
    init() {}
    showLobby() {}
    hideLobby() {}
    showHeroSelect() {}
    showVersus() {}
    showVictory() {}
    destroy() {}
}

