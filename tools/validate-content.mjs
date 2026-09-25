// Validates chapter content files in data/content/.
// Usage: node tools/validate-content.mjs [file ...]   (default: all chapter files)
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const LANGS = ["sv", "en", "ar"];
const KINDS = new Set(["sweden", "union", "nordic", "europe", "culture"]);
const REGIONS = new Set(`svealand vastergotland ostergotland smaland gotland norrland_s norrland_n
  lappmark_se jamtland idre_sarna skane blekinge halland bohuslan norway trondelag northern_isles
  faroes denmark bornholm schleswig holstein fin_sw fin_tavast fin_karelia fin_west fin_east
  fin_north kexholm ingria novgorod rus_rest estland osel livonia_ee livonia_lv latgale courland
  prussia royal_prussia lithuania poland pomerania_w pomerania_s pomerania_e mecklenburg wismar bremen_verden
  hre`.split(/\s+/).filter(Boolean));
const ROUTES = new Set(["erik-crusade-1150", "birger-1249", "torgils-1293", "margaret-1389",
  "engelbrekt-1434", "gustav-vasa-1520", "gustav-adolf-1630", "karl-x-1658"]);
const EXTENT = { lon: [-8, 42], lat: [47, 71.5] };

const words = (s) => (s || "").trim().split(/\s+/).filter(Boolean).length;

function loadChapters(files) {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  for (const f of files) {
    vm.runInContext(fs.readFileSync(f, "utf8"), sandbox, { filename: f });
  }
  return sandbox.window.SM?.chapters ?? [];
}

function checkI18n(obj, label, errors, { minWords = 0, maxWords = Infinity } = {}) {
  if (!obj || typeof obj !== "object") {
    errors.push(`${label}: missing`);
    return;
  }
  for (const l of LANGS) {
    if (typeof obj[l] !== "string" || !obj[l].trim()) errors.push(`${label}.${l}: missing/empty`);
  }
  const n = words(obj.sv);
  if (n && (n < minWords || n > maxWords)) {
    errors.push(`${label}.sv: ${n} words (expected ${minWords}–${maxWords})`);
  }
  if (obj.ar && !/[؀-ۿ]/.test(obj.ar)) errors.push(`${label}.ar: contains no Arabic script`);
}

function checkEvent(ev, ch, ids, errors, warnings) {
  const at = `${ch.id}/${ev.id ?? "?"}`;
  if (!/^[a-z0-9-]+$/.test(ev.id || "")) errors.push(`${at}: bad id`);
  if (ids.has(ev.id)) errors.push(`${at}: duplicate id`);
  ids.add(ev.id);
  if (!Number.isInteger(ev.year)) errors.push(`${at}: year must be integer`);
  else if (ev.year < ch.range[0] || ev.year > ch.range[1]) {
    warnings.push(`${at}: year ${ev.year} outside chapter range ${ch.range.join("–")}`);
  }
  if (!KINDS.has(ev.kind)) errors.push(`${at}: kind '${ev.kind}' invalid`);
  if (![1, 2, 3].includes(ev.weight)) errors.push(`${at}: weight must be 1|2|3`);
  if (ev.loc !== null) {
    const [lon, lat] = ev.loc || [];
    const ok = Number.isFinite(lon) && Number.isFinite(lat) &&
      lon >= EXTENT.lon[0] && lon <= EXTENT.lon[1] && lat >= EXTENT.lat[0] && lat <= EXTENT.lat[1];
    if (!ok) errors.push(`${at}: loc must be [lon,lat] inside extent or null`);
  }
  if (ev.zoom !== undefined && !(ev.zoom >= 1 && ev.zoom <= 6)) errors.push(`${at}: zoom 1–6`);
  checkI18n(ev.date, `${at}.date`, errors);
  checkI18n(ev.where, `${at}.where`, errors);
  checkI18n(ev.title, `${at}.title`, errors, { maxWords: 10 });
  checkI18n(ev.text, `${at}.text`, errors, { minWords: 45, maxWords: 150 });
  checkI18n(ev.why, `${at}.why`, errors, { maxWords: 45 });
  if (ev.critique) checkI18n(ev.critique, `${at}.critique`, errors, { maxWords: 70 });
  if (ev.quote) {
    checkI18n(ev.quote, `${at}.quote`, errors, { maxWords: 40 });
    if (!ev.quote.src) errors.push(`${at}.quote.src missing`);
  }
  for (const r of ev.regions || []) if (!REGIONS.has(r)) errors.push(`${at}: unknown region '${r}'`);
  if (ev.route && !ROUTES.has(ev.route)) errors.push(`${at}: unknown route '${ev.route}'`);
  if (!Array.isArray(ev.sources) || ev.sources.length === 0) errors.push(`${at}: needs ≥1 source`);
  for (const s of ev.sources || []) {
    if (!s.title) errors.push(`${at}: source without title`);
    if (s.url && !/^https:\/\//.test(s.url)) errors.push(`${at}: source url must be https`);
    if (/wikipedia\.org/.test(s.url || "")) errors.push(`${at}: Wikipedia is not an accepted source`);
  }
}

function main() {
  const args = process.argv.slice(2);
  const dir = path.join(ROOT, "data", "content");
  const files = args.length
    ? args.map((f) => path.resolve(f))
    : fs.readdirSync(dir).filter((f) => /^ch\d+\.js$/.test(f)).sort().map((f) => path.join(dir, f));
  const errors = [];
  const warnings = [];
  let chapters = [];
  try {
    chapters = loadChapters(files);
  } catch (e) {
    console.error(`Syntax/runtime error while loading: ${e.message}`);
    process.exit(1);
  }
  const ids = new Set();
  let total = 0;
  for (const ch of chapters) {
    if (!/^ch\d+$/.test(ch.id || "")) errors.push(`chapter id invalid: ${ch.id}`);
    if (!Array.isArray(ch.range) || ch.range.length !== 2) errors.push(`${ch.id}: range invalid`);
    checkI18n(ch.title, `${ch.id}.title`, errors, { maxWords: 7 });
    checkI18n(ch.intro, `${ch.id}.intro`, errors, { minWords: 40, maxWords: 120 });
    for (const ev of ch.events || []) checkEvent(ev, ch, ids, errors, warnings);
    total += ch.events?.length ?? 0;
    const byKind = {};
    for (const ev of ch.events || []) byKind[ev.kind] = (byKind[ev.kind] || 0) + 1;
    console.log(`${ch.id} ${ch.range?.join("–")}: ${ch.events?.length ?? 0} events ${JSON.stringify(byKind)}`);
  }
  warnings.forEach((w) => console.warn(`warn: ${w}`));
  errors.forEach((e) => console.error(`ERROR: ${e}`));
  console.log(`${chapters.length} chapters, ${total} events, ${errors.length} errors, ${warnings.length} warnings`);
  process.exit(errors.length ? 1 : 0);
}

main();
