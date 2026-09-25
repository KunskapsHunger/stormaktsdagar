// Inlines CSS, data and scripts from index.html into single-file builds:
//   dist/index.html          – complete standalone document (+ dist/audio with every narration clip)
//   dist/stormaktsdagar.html – artifact variant: no <html>/<head>/<body> wrappers (the host adds them).
//     The artifact host caps a version at 64 MB, so it only lists narration for the key events
//     (weight 3); dist/artifact-audio.json maps those files for publishing.
// Usage: node tools/build-bundle.mjs
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");
const html = read("index.html");

const between = (s, a, b) => {
  const i = s.indexOf(a), j = s.indexOf(b);
  if (i < 0 || j < 0) throw new Error(`markers ${a} / ${b} not found in index.html`);
  return s.slice(i + a.length, j);
};

const body = between(html, "<!--BODY-->", "<!--/BODY-->").trim();
const scriptSrcs = [...between(html, "<!--SCRIPTS-->", "<!--/SCRIPTS-->").matchAll(/src="([^"]+)"/g)].map((m) => m[1]);
const missing = scriptSrcs.filter((s) => !fs.existsSync(path.join(ROOT, s)));
if (missing.length) console.warn(`skipping missing scripts: ${missing.join(", ")}`);
const present = scriptSrcs.filter((s) => !missing.includes(s));
// "</script" inside data would end the inline script early
const safe = (js) => js.replace(/<\/script/gi, "<\\/script");
const scriptTag = (name, src) => `<script>/* ${name} */\n${safe(src)}\n</script>`;
const scripts = present.map((s) => scriptTag(s, read(s))).join("\n");

// narration subset for the artifact: key events only, all languages
const ctx = { window: {} };
vm.createContext(ctx);
for (const s of present.filter((s) => s.startsWith("data/content/") || s === "data/audio.js")) vm.runInContext(read(s), ctx);
const keyIds = new Set((ctx.window.SM.chapters || []).flatMap((c) => c.events).filter((e) => e.weight === 3).map((e) => e.id));
const artifactAudio = Object.fromEntries(Object.entries(ctx.window.SM.audio || {}).filter(([id]) => keyIds.has(id)));
const artifactScripts = present.map((s) => (s === "data/audio.js"
  ? scriptTag(s, `window.SM = window.SM || {};\nwindow.SM.audio = ${JSON.stringify(artifactAudio)};`)
  : scriptTag(s, read(s)))).join("\n");
const artifactFiles = Object.values(artifactAudio).flatMap((v) => Object.values(v).map((c) => c.src));

const css = read("css/styles.css");
const fontLink = html.match(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^>]+>/)[0];
const title = "<title>Stormaktsdagar</title>";
const icon = (html.match(/<link rel="icon"[^>]+>/) || [""])[0];
const desc = html.match(/<meta name="description"[^>]+>/)[0];

const head = `${title}\n${desc}\n<link rel="preconnect" href="https://fonts.googleapis.com">\n` +
  `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n${fontLink}\n<style>\n${css}\n</style>`;

fs.mkdirSync(path.join(ROOT, "dist"), { recursive: true });
const artifact = `${head}\n${body}\n${artifactScripts}\n`;
fs.writeFileSync(path.join(ROOT, "dist", "stormaktsdagar.html"), artifact);
fs.writeFileSync(path.join(ROOT, "dist", "artifact-audio.json"),
  JSON.stringify(Object.fromEntries(artifactFiles.map((f) => [f, `dist/${f}`])), null, 1));
const full = `<!doctype html>\n<html lang="sv" dir="ltr">\n<head>\n<meta charset="utf-8">\n` +
  `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n${icon}\n${head}\n</head>\n<body>\n${body}\n${scripts}\n</body>\n</html>\n`;
fs.writeFileSync(path.join(ROOT, "dist", "index.html"), full);
// narration clips are shipped next to the page, not inlined
const audioSrc = path.join(ROOT, "audio");
if (fs.existsSync(audioSrc)) {
  fs.rmSync(path.join(ROOT, "dist", "audio"), { recursive: true, force: true });
  fs.cpSync(audioSrc, path.join(ROOT, "dist", "audio"), { recursive: true, filter: (f) => !/\.try\d\.mp3$/.test(f) });
}
console.log(`dist/stormaktsdagar.html ${(artifact.length / 1024).toFixed(0)} KB (${artifactFiles.length} clips), ` +
  `dist/index.html ${(full.length / 1024).toFixed(0)} KB, ${present.length} scripts`);
