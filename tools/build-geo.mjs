// Builds data/geo.js: projected SVG paths for land, historical regions, lakes, rivers,
// modern borders and graticule. Source: Natural Earth 1:10m (public domain), in raw/.
// Usage: node tools/build-geo.mjs
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import pc from "polygon-clipping";
import { MASKS, REGIONS, MERGE } from "./geo-regions.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const RAW = path.join(ROOT, "raw");
const OUT = path.join(ROOT, "data", "geo.js");

// --- shared projection (same file the browser loads) ---
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(ROOT, "js", "projection.js"), "utf8"), sandbox);
const proj = sandbox.window.SM.projection.raw;

// --- 1. mapshaper preprocessing ---
const ms = (cmd) => execSync(`npx mapshaper ${cmd}`, { cwd: ROOT, stdio: ["ignore", "ignore", "inherit"] });
const SIMPLIFY = "-simplify weighted interval=900 keep-shapes";
ms(`-i raw/ne_10m_admin_1_states_provinces.geojson -clip bbox=-26,34,66,74 -filter-fields adm0_a3,name ` +
   `-filter-islands min-area=6km2 remove-empty ${SIMPLIFY} -o raw/adm1_s.json format=geojson`);
ms(`-i raw/adm1_s.json -dissolve -o raw/land_s.json format=geojson`);
ms(`-i raw/adm1_s.json -dissolve adm0_a3 -innerlines -o raw/borders_s.json format=geojson`);
ms(`-i raw/lakes_clip.json -filter "this.area > 90e6 || ['Åsunden','Tåkern','Hjälmaren','Siljan','Ringsjön','Storsjön'].indexOf(name) >= 0" ` +
   `-simplify weighted interval=900 keep-shapes -o raw/lakes_s.json format=geojson`);
const RIVERS = ["Gta lv", "Göta", "Dalälven", "Klarlven", "Motala strm", "Neva", "Narva", "Daugava", "Vistula",
  "Oder", "Elbe", "Weser", "Rhine", "Rhein", "Volkhov", "Svir", "Vuoksi", "Kemijoki", "Tornelven", "Kokemäenjoki",
  "Kymijoki", "Luga", "Velikaya", "Neman", "Dnepr", "Dnipro", "Volga", "Emajõgi", "Gauja", "Warta", "Spree",
  "Main", "Donau", "Danube", "Vltava", "Saale", "Lule lv", "ngermanlven", "Indalsälven", "Glomma", "Oulu",
  "Muonio", "Lech", "Isar", "Maas", "Seine", "Thames", "Severnaya Dvina", "Onega", "Dniester"];
ms(`-i raw/rivers_clip.json -clip bbox=-10,45,46,72 -filter "${JSON.stringify(RIVERS).replace(/"/g, "'")}.indexOf(name) >= 0" ` +
   `-simplify weighted interval=900 -o raw/rivers_s.json format=geojson`);

const read = (f) => {
  const j = JSON.parse(fs.readFileSync(path.join(RAW, f), "utf8"));
  return j.features ? j : { features: (j.geometries || []).map((geometry) => ({ geometry, properties: {} })) };
};
const adm1 = read("adm1_s.json").features;
const land = read("land_s.json").features;
const borders = read("borders_s.json").features;
const lakes = read("lakes_s.json").features;
const rivers = read("rivers_s.json").features;

// --- 2. historical regions (lon/lat) ---
const asMulti = (g) => (g.type === "Polygon" ? [g.coordinates] : g.coordinates);
const units = new Map();
for (const f of adm1) {
  if (!f.geometry) continue;
  const key = `${f.properties.adm0_a3}|${f.properties.name}`;
  units.set(key, [...(units.get(key) || []), ...asMulti(f.geometry)]);
}
const pick = (spec) => {
  const out = [];
  for (const s of spec) {
    const [iso, name] = s.split("|");
    let hit = false;
    for (const [k, g] of units) {
      const [kIso, kName] = k.split("|");
      if (kIso === iso && (name === "*" || kName === name)) { out.push(...g); hit = true; }
    }
    if (!hit) console.warn(`  ! no admin unit for ${s}`);
  }
  return out;
};
const closeRing = (r) => (r[0][0] === r.at(-1)[0] && r[0][1] === r.at(-1)[1] ? r : [...r, r[0]]);

let claimed = [];
const regionGeo = {};
for (const [id, spec, maskKey] of REGIONS) {
  let geom = pc.union(...pick(spec).map((p) => [p]));
  if (maskKey === "pomerania_s_in_w") {
    geom = pc.intersection(geom, [[closeRing(MASKS.pomerania_w)]], [[closeRing(MASKS.pomerania_s)]]);
  } else if (maskKey) geom = pc.intersection(geom, [[closeRing(MASKS[maskKey])]]);
  if (claimed.length) geom = pc.difference(geom, claimed);
  if (!geom.length) { console.warn(`  ! region ${id} is empty`); continue; }
  claimed = claimed.length ? pc.union(claimed, geom) : geom;
  const target = MERGE[id] || id;
  regionGeo[target] = regionGeo[target] ? pc.union(regionGeo[target], geom) : geom;
}

// --- 3. projection, view rectangle, clipping ---
const KEY_POINTS = [[-7.5, 62.2], [-3.2, 58.8], [-1, 51], [41.5, 55.5], [41, 65], [26, 71.4], [11.5, 47.6], [16.5, 47.9], [4, 47.6]];
const kp = KEY_POINTS.map(([lo, la]) => proj(lo, la));
const PAD = 60;
const x0 = Math.min(...kp.map((p) => p[0])) - PAD;
const y0 = Math.min(...kp.map((p) => p[1])) - PAD;
const W = Math.max(...kp.map((p) => p[0])) + PAD - x0;
const H = Math.max(...kp.map((p) => p[1])) + PAD - y0;
const P = (lo, la) => { const p = proj(lo, la); return [p[0] - x0, p[1] - y0]; };
const MARGIN = 1400; // keep geometry a little beyond the view for panning
const viewRect = [[[-MARGIN, -MARGIN], [W + MARGIN, -MARGIN], [W + MARGIN, H + MARGIN], [-MARGIN, H + MARGIN], [-MARGIN, -MARGIN]]];

const projMulti = (multi) => multi.map((poly) => poly.map((ring) => ring.map(([lo, la]) => P(lo, la))));
const clipMulti = (multi) => pc.intersection(multi, viewRect);

const fmt = (n) => (Math.round(n * 10) / 10).toString();
function ringPath(ring) {
  // drop consecutive duplicates after rounding
  const pts = [];
  for (const [x, y] of ring) {
    const s = `${fmt(x)} ${fmt(y)}`;
    if (pts.at(-1) !== s) pts.push(s);
  }
  if (pts.length > 1 && pts[0] === pts.at(-1)) pts.pop();
  return pts.length >= 3 ? `M${pts.join(" ")}Z` : "";
}
const polyPath = (multi) => multi.flatMap((poly) => poly.map(ringPath)).join("");
const linePath = (coords) => {
  const pts = coords.map(([lo, la]) => P(lo, la)).map(([x, y]) => `${fmt(x)} ${fmt(y)}`);
  return pts.length > 1 ? `M${pts.join(" ")}` : "";
};
const bboxOf = (multi) => {
  let a = [Infinity, Infinity, -Infinity, -Infinity];
  for (const poly of multi) for (const [x, y] of poly[0]) a = [Math.min(a[0], x), Math.min(a[1], y), Math.max(a[2], x), Math.max(a[3], y)];
  return a.map((v) => Math.round(v));
};

const out = { view: [0, 0, Math.round(W), Math.round(H)], origin: [x0, y0], regions: {}, bbox: {} };
for (const [id, g] of Object.entries(regionGeo)) {
  const m = clipMulti(projMulti(g));
  out.regions[id] = polyPath(m);
  out.bbox[id] = bboxOf(m);
}
const landMulti = clipMulti(projMulti(land.flatMap((f) => asMulti(f.geometry))));
out.land = polyPath(landMulti);
out.lakes = polyPath(clipMulti(projMulti(lakes.flatMap((f) => asMulti(f.geometry)))));
const lineFeatures = (fs_) => fs_.flatMap((f) => (f.geometry.type === "LineString" ? [f.geometry.coordinates] : f.geometry.coordinates));
out.borders = lineFeatures(borders).map(linePath).join("");
out.rivers = lineFeatures(rivers).map(linePath).join("");

// graticule every 5°
const grat = [];
for (let lo = -15; lo <= 50; lo += 5) grat.push(Array.from({ length: 61 }, (_, i) => [lo, 40 + i * 0.5]));
for (let la = 45; la <= 75; la += 5) grat.push(Array.from({ length: 141 }, (_, i) => [-20 + i * 0.5, la]));
out.graticule = grat.map(linePath).join("");

const js = `// Generated by tools/build-geo.mjs from Natural Earth 1:10m (public domain). Do not edit.\n` +
  `window.SM = window.SM || {};\nwindow.SM.geo = ${JSON.stringify(out)};\n`;
fs.writeFileSync(OUT, js);
const kb = (s) => `${Math.round(s.length / 1024)} KB`;
console.log(`view ${out.view.join(" ")}; land ${kb(out.land)}, regions ${kb(Object.values(out.regions).join(""))}, ` +
  `lakes ${kb(out.lakes)}, rivers ${kb(out.rivers)}, borders ${kb(out.borders)}; total ${kb(js)}`);
console.log(`regions: ${Object.keys(out.regions).join(", ")}`);
