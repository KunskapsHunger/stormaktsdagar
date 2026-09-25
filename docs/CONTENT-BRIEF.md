# Stormaktsdagar – content brief

Interactive, trilingual (Swedish primary, English, Arabic) map that plays through time:
Sweden from a kingdom taking shape (c. 1000) to a European great power (1658/1660),
with a short epilogue to 1721. Audience: upper-secondary students, teachers and curious adults.
The Kalmar Union (1397–1523) is covered **extensively**.

## Quality bar

* **Every claim must be sourced.** Each event carries 1–3 sources. Prefer
  scholarly works (author, title, year, publisher) and reputable reference works:
  Nationalencyklopedin (ne.se), Svenskt biografiskt lexikon (sok.riksarkivet.se/sbl),
  Riksarkivet, Historiska museet / SHM, Den Store Danske (lex.dk), Store norske leksikon (snl.no),
  Uppslagsverket Finland / Biografiskt lexikon för Finland (blf.fi), Encyclopaedia Britannica,
  national archives, and primary sources (Erikskrönikan, Karlskrönikan, Peder Svart, Olaus Petri,
  Adam av Bremen, treaty texts). Wikipedia is **not** an acceptable source.
* **Only include a `url` if you actually opened it (WebFetch) or confirmed it via WebSearch**
  in this session. Never invent URLs, page numbers or quotations. A book citation without URL is fine.
* Where the historical record is uncertain or legendary, say so in `critique`
  (källkritik). Examples: Erik den heliges korståg, Neva 1240 (only Russian sources),
  Unionsbrevets rättsliga status, Gustav Vasa's Dalarna adventures (Peder Svart), Engelbrekt's image.
* Include events that look small but matter (e.g. Alsnö stadga, Nyköpings gästabud,
  Öresundstullen, Orkney/Shetland pledged, Uppsala möte 1593, Tartu university 1632,
  Codex Gigas taken 1648). Explain *why* they matter in `why`.
* Use neutral, precise, readable language. Swedish is the master text; English and Arabic are
  faithful, natural translations (Modern Standard Arabic, Western digits 0–9, month names
  يناير، فبراير، مارس، أبريل، مايو، يونيو، يوليو، أغسطس، سبتمبر، أكتوبر، نوفمبر، ديسمبر).
  Proper names in Arabic: use established Arabic transliterations (e.g. ستوكهولم، كالمار، الدنمارك،
  النرويج، السويد، فنلندا، إنغلبريكت، غوستاف فاسا، مارغريت).
* Dates: give Julian/Gregorian note only when it matters (Sweden used Julian until 1753; Lützen is
  6 Nov O.S. = 16 Nov N.S.). Otherwise use the date as usually cited in Swedish scholarship.

## File format

Each chapter is its own file in `data/content/`, e.g. `data/content/ch04.js`:

```js
window.SM = window.SM || {};
(window.SM.chapters = window.SM.chapters || []).push({
  id: "ch04",
  range: [1397, 1439],               // first and last year of chapter
  title: { sv: "…", en: "…", ar: "…" },          // ≤ 6 words
  intro: { sv: "…", en: "…", ar: "…" },          // 60–100 words: what defines the era
  events: [
    {
      id: "kalmar-kroning-1397",     // unique kebab-case, include the year
      year: 1397,                    // integer, used for ordering and map state
      order: 0,                      // optional tie-breaker within the same year
      date: { sv: "17 juni 1397", en: "17 June 1397", ar: "17 يونيو 1397" },
      kind: "union",                 // sweden | union | nordic | europe | culture
      weight: 3,                     // 3 = key station, 2 = important, 1 = supporting
      loc: [16.36, 56.66],           // [lon, lat] or null (if outside map extent)
      where: { sv: "Kalmar", en: "Kalmar", ar: "كالمار" },
      zoom: 3,                       // 1 = whole map … 6 = a city region
      title: { sv: "…", en: "…", ar: "…" },       // ≤ 9 words
      text:  { sv: "…", en: "…", ar: "…" },       // 70–130 words
      why:   { sv: "…", en: "…", ar: "…" },       // one sentence: why it matters
      critique: { sv: "…", en: "…", ar: "…" },    // OPTIONAL source-critical note (1–3 sentences)
      quote: { sv: "…", en: "…", ar: "…", src: "Kröningsbrevet 1397" }, // OPTIONAL short primary quote (≤ 30 words, pre-1900 text only)
      regions: ["gotland"],          // OPTIONAL region ids to highlight (see list)
      route: "gustav-vasa-1520",     // OPTIONAL route id (see list)
      sources: [
        { author: "Vivian Etting", title: "Queen Margrete I (1353–1412) and the Founding of the Nordic Union",
          year: 2004, publisher: "Brill", note: "kap. 6" },
        { title: "Kalmarunionen", publisher: "Nationalencyklopedin", url: "https://…" }
      ]
    }
  ]
});
```

`kind` meanings: `sweden` Swedish politics/war; `union` Kalmar Union specific (use for 1363–1523
union politics incl. Danish/Norwegian parts); `nordic` Denmark/Norway/Finland/Baltic context not
about Sweden directly; `europe` wider European context ("Samtidigt i Europa"); `culture`
church, law, learning, economy, society, art.

Map extent: lon −8…42, lat 47…71.5 (covers North Sea to Moscow, Paris/Prague/Vienna to North Cape).
If an event lies outside (Rome, Constantinople, America), set `loc: null` and fill `where`.

### Region ids (for `regions`)
Sweden: `svealand`, `vastergotland`, `ostergotland`, `smaland`, `gotland`, `norrland_s`,
`norrland_n`, `lappmark_se`, `jamtland`, `idre_sarna`, `skane`, `blekinge`, `halland`, `bohuslan`.
Norway: `norway`, `trondelag`, `northern_isles` (Orkney+Shetland), `faroes`.
Denmark: `denmark`, `bornholm`, `schleswig`, `holstein`.
Finland: `fin_sw` (Egentliga Finland/Åland), `fin_tavast` (Tavastland), `fin_karelia` (Viborg area),
`fin_west` (rest west of Nöteborg line), `fin_east` (east of Nöteborg line), `fin_north` (Lapland).
Russia: `kexholm`, `ingria`, `novgorod`, `rus_rest`.
Baltics: `estland`, `osel`, `livonia_ee`, `livonia_lv`, `latgale`, `courland`.
Central Europe: `prussia`, `royal_prussia`, `lithuania`, `poland`, `pomerania_w`, `pomerania_e`,
`mecklenburg`, `wismar`, `bremen_verden`, `hre`.

### Route ids (for `route`)
`erik-crusade-1150`, `birger-1249`, `torgils-1293`, `margaret-1389`, `engelbrekt-1434`,
`gustav-vasa-1520`, `gustav-adolf-1630`, `karl-x-1658`.

## Validation

Run `node tools/validate-content.mjs data/content/chXX.js` and fix every error before finishing.
