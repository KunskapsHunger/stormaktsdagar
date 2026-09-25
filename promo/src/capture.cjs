// Renders the Stormaktsdagar short frame by frame (1080x1920, 30 fps) from the running app.
// Usage: node capture.cjs [--stills] [--only=name,name]
const path = require("path");
const fs = require("fs");
const { chromium } = require("C:/Users/venag/AppData/Local/npm-cache/_npx/9833c18b2d85bc59/node_modules/playwright");
const { SCENES } = require("./scenes.cjs");

const FPS = 30;
const URL = "http://localhost:8124/";
const EXE = "C:/Users/venag/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe";
const OUT = path.join(__dirname, "frames");
const STILLS = path.join(__dirname, "stills");
const args = process.argv.slice(2);
const stillsMode = args.includes("--stills");
const only = (args.find((a) => a.startsWith("--only=")) || "").slice(7).split(",").filter(Boolean);

async function main() {
  fs.mkdirSync(stillsMode ? STILLS : OUT, { recursive: true });
  const browser = await chromium.launch({ executablePath: EXE });
  const ctx = await browser.newContext({
    viewport: { width: 360, height: 640 }, deviceScaleFactor: 3, colorScheme: "light",
    reducedMotion: "no-preference", locale: "sv-SE",
  });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => console.error("[pageerror]", e.message));
  await page.clock.install({ time: new Date("2026-09-23T10:00:00") });
  await page.goto(URL, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.addScriptTag({ path: path.join(__dirname, "ad.js") });
  await page.evaluate(() => Promise.all([
    "700 31px Alegreya", "italic 400 21px Alegreya", "600 17px 'Alegreya Sans'", "700 20px 'Alegreya Sans'",
    "400 50px 'IM Fell English'", "400 20px Amiri",
  ].map((f) => document.fonts.load(f))));
  await page.clock.runFor(500);

  let vt = 0, frameNo = 0;
  const step = async (ms) => { await page.clock.runFor(ms); vt += ms; await page.evaluate((v) => window.__ad.syncAnimations(v), vt); };
  // let any resize / language re-render settle before a scene starts
  await step(100);

  for (const sc of SCENES) {
    if (only.length && !only.includes(sc.name)) continue;
    await page.evaluate(sc.setup);
    await step(34);
    const n = Math.round(sc.dur * FPS);
    const stillAt = new Set((sc.stills || [0.2, sc.dur * 0.6]).map((s) => Math.round(s * FPS)));
    const t0 = Date.now();
    for (let f = 0; f < n; f++) {
      const t = f / FPS;
      await page.evaluate(sc.frame, t);
      await step(1000 / FPS);
      if (stillsMode) {
        if (stillAt.has(f)) await page.screenshot({ path: path.join(STILLS, `${sc.name}-${t.toFixed(2)}.jpg`), type: "jpeg", quality: 80, scale: "css" });
      } else {
        await page.screenshot({ path: path.join(OUT, `f${String(frameNo).padStart(5, "0")}.jpg`), type: "jpeg", quality: 93 });
      }
      frameNo++;
    }
    console.log(`${sc.name}: ${n} frames in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  }
  await browser.close();
  console.log("total frames", frameNo);
}
main().catch((e) => { console.error(e); process.exit(1); });
