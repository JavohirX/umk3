import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// The panel's formatting lives inside its one HTML page, so these are its own functions, lifted out of it
const page = readFileSync(new URL("../server/admin_panel.html", import.meta.url), "utf8");
const source = page.slice(page.indexOf("function fmt("), page.indexOf("function xLabel("));
const { fmt, tickFmt, niceScale } = new Function(`const dash = "–"; ${source}; return { fmt, tickFmt, niceScale };`)();

// A nearly idle server isn't at zero, and mustn't be rounded down to it
{
    const printed = [0, 0.1, 0.4, 0.5, 1.4, 9.9, 10, 87.3].map((v) => fmt(v, "pct100"));
    assert.deepEqual(printed, ["0%", "0.1%", "0.4%", "0.5%", "1.4%", "9.9%", "10%", "87%"]);
    assert.equal(fmt(null, "pct100"), "–");
}

// However low the peak, an axis's labels stay different from each other
{
    const labels = (peak) => niceScale(peak, "pct100").ticks.map((t) => tickFmt(t, "pct100"));
    assert.deepEqual(labels(0.4), ["0%", "0.1%", "0.2%", "0.3%", "0.4%"]);
    assert.deepEqual(labels(1.4), ["0%", "0.5%", "1%", "1.5%"]);
    for (const peak of [0.1, 0.2, 0.3, 0.7, 0.9, 1.4, 3, 7, 12, 25, 87.3]) {
        const seen = labels(peak);
        assert.equal(new Set(seen).size, seen.length, `${peak}: ${seen}`);
    }
}

console.log("admin_panel_format checks passed");
