import { ResourceManager } from './j2me/runtime.js';
import { Manager } from './j2me/audio.js';

export const ASSETS_LIST = [
    "a.mbf",
    "b.mbf",
    "c.mbf",
    "charmap",
    "d.mbf",
    "df0_0",
    "df1_0",
    "df2_0",
    "e.mbf",
    "f.mbf",
    "g.mbf",
    "h.mbf",
    "hdr",
    "i.mbf",
    "i.png",
    "index",
    "j.mbf",
    "k.mbf",
    "mgc27282.png",
    "mgc27804.png",
    "mgc28182.png",
    "mgc29662.png",
    "mgc30403.png",
    "mgc31302.png",
    "mgi24171.png",
    "mgi28442.png",
    "mgi28902.png",
    "mgilog.png",
    "moregames",
    "t_de",
    "t_en",
    "t_es-es",
    "t_fr-fr",
    "t_it"
];

/**
 * Loads all assets asynchronously and registers them in ResourceManager
 * @param {string} basePath Base URL path to assets/
 * @param {function(number, number, string)} onProgress Progress callback
 */
export async function loadAllAssets(basePath = 'assets/', onProgress = null) {
    let loaded = 0;
    const total = ASSETS_LIST.length;

    await Promise.all(ASSETS_LIST.map(async (filename) => {
        const url = `${basePath}${filename}`;
        const resp = await fetch(url);
        if (!resp.ok) {
            throw new Error(`Failed to load asset: ${url} (status: ${resp.status})`);
        }
        const buffer = await resp.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        ResourceManager.register('/' + filename, bytes);
        ResourceManager.register(filename, bytes);

        loaded++;
        if (typeof onProgress === 'function') {
            onProgress(loaded, total, filename);
        }
    }));

    // Preload SFX audio bank in background
    Manager.preloadSoundBank(basePath + 'sfx/').catch(() => {});
}
