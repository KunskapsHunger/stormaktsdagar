# Stormaktsdagar

An interactive map that plays through Swedish history from the rise of the kingdom
(c. 800/995) through the Kalmar Union (1397–1523) to the great-power era (1611–1660), with an
epilogue to the Peace of Nystad in 1721. The content is in Swedish, English and Arabic (with a right-to-left layout).

* **283 events** in 11 chapters, each with a "why it matters" note, a source-critical note where one is needed, and 1–3 sources.
* The Kalmar Union has four chapters (1363–1523). It has its own status indicator (forming / in the union / breakaway),
  gold hatching over the union lands, and a ruler ribbon in the timeline showing union monarchs and Swedish regents.
* The map shows each region's control over time: firm, loose, pledged, occupied or disputed. It also has animated routes
  (for example Gustav Vasa in Dalarna, Gustav II Adolf 1630–32 and the march across the ice in 1658).
* **Narration:** every event is read aloud in Swedish, English and Arabic by an AI voice (Google Gemini,
  `gemini-3.8-flash-tts`, voice Charon). Each clip was verified by transcribing it back with `gemini-3.8-flash` and
  comparing it with the source text. The player follows the chosen language; a "Read aloud" toggle reads each event
  automatically, and during auto-play the app waits for the reading to finish before moving on.
* Also included: a glossary (39 terms), a searchable list of all sources, and an "About the map" page explaining how the borders were drawn.

## Running it

* **Online:** published with GitHub Pages (see the repository's Pages URL).
* **Open a single file:** `npm run build` creates `dist/index.html`, which works directly in the browser
  (narration needs the `audio/` folder next to it). Fonts are loaded from Google Fonts.
* **Development:** `node tools/serve.mjs 8124` → http://localhost:8124/ (no caching).

## Structure

| Path | Contents |
|---|---|
| `index.html`, `css/`, `js/` | The application: `core` (data and time), `map` (SVG map), `timeline`, `panel`, `app` |
| `data/content/ch01–ch11.js` | Chapters and events (sv/en/ar) |
| `data/territory.js` | Who controlled each region, and how, over time |
| `data/rulers.js` | Sweden's rulers, the union status for 1389–1523, Danish kings |
| `data/places.js`, `data/glossary.js`, `data/ui.js` | Places, realm names and routes; glossary; interface text |
| `data/audio.js`, `audio/` | Narration manifest and MP3 files (generated) |
| `data/geo.js` | Generated map geometry (Natural Earth 1:10m, public domain) |
| `docs/` | Content and review guidelines, border research |

## Tools

```bash
npm run validate                  # checks the format, languages, sources and regions of all chapters
node tools/check-consistency.mjs  # checks the map data against the events and rulers
node tools/check-rulers.cjs .     # checks that the list of rulers has no gaps
npm run geo                       # rebuilds data/geo.js (requires the Natural Earth files in raw/)
npm run build                     # inlines everything into dist/index.html and dist/stormaktsdagar.html (+ dist/audio)
GEMINI_API_KEY=... node tools/tts.mjs [--langs sv,en,ar] [--ids a,b] [--concurrency 6]
                                  # generates and verifies narration (skips clips that already exist)
```

## Quality work

Researchers drafted the content, and it then went through three review rounds:
1. Fact-checking of every chapter against SBL, NE, lex.dk, Store norske leksikon, Uppslagsverket Finland,
   Britannica and the scholarly literature, plus a code and accessibility review.
2. Language review of the Arabic and English, with terms kept consistent across the project.
3. Browser testing (languages, screen sizes, themes, map accuracy) and a teaching review of coverage and balance,
   which led to 22 new events (mining, Norway's role in the union, the Sámi, conscription, and more).

Borders are simplified; see "About the map". The book citations that could not be checked online are flagged in the
reviewers' reports and should be the first to check if the material is used in teaching.
