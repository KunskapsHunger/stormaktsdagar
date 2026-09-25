// Read-aloud audio for every event in Swedish, English and Arabic with Gemini TTS.
// Each clip is verified by transcribing it back with a Gemini text model and comparing
// it with the source text; clips that don't match are regenerated.
// The API key is read from the environment and never written anywhere:
//   GEMINI_API_KEY=... node tools/tts.mjs [--langs sv,en,ar] [--ids a,b] [--limit N]
//                                         [--concurrency 4] [--voice Charon] [--no-verify]
// Output: audio/<lang>/<event-id>.mp3 and data/audio.js (manifest used by the app).
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import vm from "node:vm";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MANIFEST = path.join(ROOT, "data", "audio.js");
const API = "https://generativelanguage.googleapis.com/v1beta/models";

const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : def; };
const flag = (name) => args.includes(`--${name}`);
const TTS_MODEL = opt("model", "gemini-3.8-flash-tts");
const CHECK_MODEL = opt("check-model", "gemini-3.8-flash");
const VOICE = opt("voice", "Charon");
const LANGS = opt("langs", "sv,en,ar").split(",");
const CONCURRENCY = Number(opt("concurrency", "4"));
const LIMIT = Number(opt("limit", "0"));
const VERIFY = !flag("no-verify");
const MIN_SIMILARITY = Number(opt("min-sim", "0.82"));
const KEY = process.env.GEMINI_API_KEY;

// Style direction for the narrator; the model follows it without reading it aloud.
const DIRECTION = {
  sv: "Read the following Swedish text aloud in Swedish as a calm, clear documentary narrator. Pronounce Swedish names natively. Read only the text.",
  en: "Read the following English text aloud in clear, neutral British English as a calm documentary narrator. Pronounce Scandinavian names as a Swede would. Read only the text.",
  ar: "Read the following Arabic text aloud in Modern Standard Arabic (fusha) as a calm, clear documentary narrator. Read the digits as Arabic numbers and pronounce names in Latin script naturally. Read only the text.",
};

function loadEvents() {
  const ctx = { window: {} };
  vm.createContext(ctx);
  const dir = path.join(ROOT, "data", "content");
  for (const f of fs.readdirSync(dir).filter((f) => /^ch\d+\.js$/.test(f)).sort()) {
    vm.runInContext(fs.readFileSync(path.join(dir, f), "utf8"), ctx);
  }
  return ctx.window.SM.chapters.flatMap((ch) => ch.events);
}

// What is read aloud: title, date and main text.
function speechText(ev, lang) {
  const abbrev = { sv: [[/\bc\. /g, "cirka "], [/\bs\. /g, "sidan "]], en: [[/\bc\. /g, "circa "]], ar: [] }[lang];
  let s = `${ev.title[lang].replace(/[.!?؟]?$/, ".")} ${ev.date[lang]}. ${ev.text[lang]}`.replace(/\s+/g, " ").trim();
  for (const [re, to] of abbrev) s = s.replace(re, to);
  return s;
}

// ---------- Gemini calls with retry ----------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function gemini(model, body, attempt = 0) {
  const res = await fetch(`${API}/${model}:generateContent?key=${KEY}`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
  });
  if (res.ok) return res.json();
  const text = await res.text();
  if ((res.status === 429 || res.status >= 500) && attempt < 6) {
    const hint = /"retryDelay":\s*"(\d+)s"/.exec(text);
    const wait = hint ? Number(hint[1]) * 1000 + 500 : Math.min(60000, 2000 * 2 ** attempt);
    await sleep(wait);
    return gemini(model, body, attempt + 1);
  }
  throw new Error(`HTTP ${res.status}: ${text.slice(0, 300)}`);
}

async function synthesize(text, lang) {
  const j = await gemini(TTS_MODEL, {
    contents: [{ parts: [{ text: `${DIRECTION[lang]}\n\n${text}` }] }],
    generationConfig: { responseModalities: ["AUDIO"], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: VOICE } } } },
  });
  const part = j.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
  if (!part) throw new Error(`no audio in response: ${JSON.stringify(j).slice(0, 200)}`);
  return Buffer.from(part.inlineData.data, "base64");
}

function toMp3(audio, out) {
  const tmp = path.join(os.tmpdir(), `tts-${process.pid}-${Math.random().toString(36).slice(2)}`);
  fs.writeFileSync(tmp, audio);
  const isWav = audio.subarray(0, 4).toString("ascii") === "RIFF";
  const input = isWav ? ["-i", tmp] : ["-f", "s16le", "-ar", "24000", "-ac", "1", "-i", tmp];
  try {
    execFileSync("ffmpeg", ["-y", "-loglevel", "error", ...input, "-af", "loudnorm=I=-17:TP=-1.5:LRA=11",
      "-ar", "24000", "-ac", "1", "-b:a", "32k", out]);
  } finally { fs.rmSync(tmp, { force: true }); }
  const dur = parseFloat(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", out]).toString());
  return Math.round(dur * 10) / 10;
}

// ---------- verification ----------
const normalize = (s) => s.toLowerCase()
  .replace(/[ً-ْـ]/g, "")           // Arabic diacritics and tatweel
  .replace(/[أإآ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه")
  .replace(/[\p{P}\p{S}]/gu, " ")
  .split(/\s+/).filter(Boolean);
function similarity(a, b) {
  const x = normalize(a), y = normalize(b);
  if (!x.length || !y.length) return 0;
  let prev = Array.from({ length: y.length + 1 }, (_, j) => j);
  for (let i = 1; i <= x.length; i++) {
    const cur = [i];
    for (let j = 1; j <= y.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (x[i - 1] === y[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return 1 - prev[y.length] / Math.max(x.length, y.length);
}
async function transcribe(mp3Path) {
  const j = await gemini(CHECK_MODEL, {
    contents: [{ parts: [
      { inlineData: { mimeType: "audio/mpeg", data: fs.readFileSync(mp3Path).toString("base64") } },
      { text: "Transcribe this audio verbatim in the language spoken. Write numbers as digits. Output only the transcript." },
    ] }],
  });
  return (j.candidates?.[0]?.content?.parts || []).map((p) => p.text || "").join("").trim();
}

// ---------- manifest ----------
function readManifest() {
  if (!fs.existsSync(MANIFEST)) return {};
  const ctx = { window: {} };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(MANIFEST, "utf8"), ctx);
  const m = ctx.window.SM.audio || {};
  // entries from the old single-language format are dropped
  return Object.fromEntries(Object.entries(m).filter(([, v]) => v && (v.sv || v.en || v.ar) && !v.src));
}
function writeManifest(m) {
  const sorted = Object.fromEntries(Object.entries(m).sort(([a], [b]) => a.localeCompare(b)));
  fs.writeFileSync(MANIFEST, `// Generated by tools/tts.mjs – read-aloud audio (Gemini ${TTS_MODEL}, voice ${VOICE}). Do not edit by hand.\n` +
    `window.SM = window.SM || {};\nwindow.SM.audio = ${JSON.stringify(sorted)};\n`);
}

// ---------- main ----------
async function main() {
  if (!KEY) { console.error("Set GEMINI_API_KEY in the environment."); process.exit(1); }
  const onlyIds = opt("ids") ? new Set(opt("ids").split(",")) : null;
  const events = loadEvents().filter((e) => !onlyIds || onlyIds.has(e.id));
  const manifest = readManifest();
  let jobs = [];
  for (const lang of LANGS) {
    fs.mkdirSync(path.join(ROOT, "audio", lang), { recursive: true });
    for (const ev of events) {
      const done = manifest[ev.id]?.[lang];
      if (done && fs.existsSync(path.join(ROOT, done.src))) continue;
      jobs.push({ ev, lang });
    }
  }
  // interleave languages so a partial run still covers every language
  jobs.sort((a, b) => events.indexOf(a.ev) - events.indexOf(b.ev) || LANGS.indexOf(a.lang) - LANGS.indexOf(b.lang));
  if (LIMIT) jobs = jobs.slice(0, LIMIT);
  console.log(`${jobs.length} clips to generate (${LANGS.join(", ")}), concurrency ${CONCURRENCY}, verify ${VERIFY}`);

  let next = 0, ok = 0, weak = 0, failed = 0;
  const t0 = Date.now();
  const worker = async () => {
    while (next < jobs.length) {
      const { ev, lang } = jobs[next++];
      const text = speechText(ev, lang);
      const rel = `audio/${lang}/${ev.id}.mp3`;
      const out = path.join(ROOT, rel);
      let best = null;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const tmpOut = `${out}.try${attempt}.mp3`;
          const dur = toMp3(await synthesize(text, lang), tmpOut);
          const sim = VERIFY ? similarity(text, await transcribe(tmpOut)) : 1;
          if (!best || sim > best.sim) {
            if (best) fs.rmSync(best.file, { force: true });
            best = { file: tmpOut, dur, sim };
          } else fs.rmSync(tmpOut, { force: true });
          if (sim >= MIN_SIMILARITY) break;
        } catch (e) {
          console.error(`  ! ${lang}/${ev.id} attempt ${attempt}: ${e.message}`);
        }
      }
      if (!best) { failed++; continue; }
      fs.renameSync(best.file, out);
      manifest[ev.id] = { ...(manifest[ev.id] || {}), [lang]: { src: rel, dur: best.dur, sim: Math.round(best.sim * 100) / 100 } };
      writeManifest(manifest);
      if (best.sim >= MIN_SIMILARITY) ok++; else weak++;
      const n = ok + weak + failed;
      const eta = Math.round(((Date.now() - t0) / n) * (jobs.length - n) / 60000);
      console.log(`${n}/${jobs.length} ${lang}/${ev.id} ${best.dur}s sim ${best.sim.toFixed(2)}${best.sim < MIN_SIMILARITY ? " WEAK" : ""} · ~${eta} min left`);
    }
  };
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  console.log(`done: ${ok} verified, ${weak} below ${MIN_SIMILARITY}, ${failed} failed`);
}

main().catch((e) => { console.error(e.message); process.exit(1); });
