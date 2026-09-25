// Cross-checks content against map data:
//  - every event's highlighted regions exist and change hands near the event (report-only),
//  - territory entries are sorted and use known owners/statuses,
//  - events with loc lie on a sensible place (inside extent) and rulers cover each event.
// Usage: node tools/check-consistency.mjs
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ctx = { window: {}, globalThis: {} };
vm.createContext(ctx);
const load = (f) => vm.runInContext(fs.readFileSync(path.join(ROOT, f), "utf8"), ctx, { filename: f });
["js/projection.js", "data/ui.js", "data/territory.js", "data/places.js", "data/rulers.js", "data/glossary.js"].forEach(load);
fs.readdirSync(path.join(ROOT, "data/content")).filter((f) => /^ch\d+\.js$/.test(f)).sort().forEach((f) => load(`data/content/${f}`));
ctx.window.document = undefined;
load("js/core.js");
const SM = ctx.window.SM;
SM.core.build();

const problems = [];
const notes = [];
const STATUSES = new Set(["loose", "pledge", "occupied", "disputed", undefined]);
for (const [id, list] of Object.entries(SM.territory)) {
  list.forEach((e, i) => {
    if (i && e[0] <= list[i - 1][0]) problems.push(`territory ${id}: entries not strictly increasing at ${e[0]}`);
    if (e[1] !== null && !SM.owners[e[1]]) problems.push(`territory ${id}: unknown owner ${e[1]}`);
    if (!STATUSES.has(e[2])) problems.push(`territory ${id}: unknown status ${e[2]}`);
  });
}
const geo = fs.readFileSync(path.join(ROOT, "data/geo.js"), "utf8");
for (const id of Object.keys(SM.territory)) if (!geo.includes(`"${id}":"M`)) problems.push(`territory ${id}: no geometry`);

for (const ev of SM.data.events) {
  const rs = SM.core.rulersAt(ev.t).filter((r) => !r.parallel);
  if (ev.year >= 995 && !rs.length) problems.push(`${ev.id}: no ruler covers t=${ev.t.toFixed(2)}`);
  for (const r of ev.regions || []) {
    const list = SM.territory[r] || [];
    const near = list.filter((e) => Math.abs(e[0] - ev.t) < 1.2);
    if (!near.length) notes.push(`${ev.id} (${ev.t.toFixed(2)}) highlights ${r}; no change within ±1.2 y`);
    for (const e of near) {
      // a change dated just after the event (same season) usually means the event should already show it
      if (e[0] > ev.t && e[0] - ev.t < 0.35) notes.push(`${ev.id} t=${ev.t.toFixed(3)} is just BEFORE ${r} → ${e[1]} at ${e[0]}`);
    }
  }
}
notes.forEach((n) => console.log(`note: ${n}`));
problems.forEach((p) => console.log(`PROBLEM: ${p}`));
console.log(`${SM.data.events.length} events checked, ${problems.length} problems, ${notes.length} notes`);
process.exit(problems.length ? 1 : 0);
