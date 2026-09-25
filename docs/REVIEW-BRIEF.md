# Review round 1 — fact-check brief

You are an independent, sceptical historian reviewing content written by another author for
**Stormaktsdagar**, an educational, trilingual (sv/en/ar) interactive map of Sweden c. 800–1721.
Read `docs/CONTENT-BRIEF.md` first (format + quality bar). You own ONLY the chapter files named in
your task — do not edit any other file (other reviewers are working in parallel).

## What to check, event by event
1. **Facts**: every date, name, number, place, title, causal claim. Check against reliable sources
   (SBL, NE, Riksarkivet, lex.dk, snl.no, Uppslagsverket Finland/BLF, Britannica, Historiska museet,
   scholarly literature). Use WebSearch/WebFetch (load via ToolSearch "select:WebSearch,WebFetch").
   Budget your searches — you have a limited quota; prioritise claims that are specific (numbers,
   exact dates, "first", "only") and those the author flagged as unsure (listed in your task).
2. **Sources**: each `url` must resolve to a page that actually supports the event (WebFetch it;
   paywalled NE pages count as OK if the URL is the right article). Remove or replace dead/irrelevant
   links. Book citations must be real works with correct author/title/year/publisher — fix or remove
   anything you cannot confirm exists. Never invent URLs; Wikipedia may not be cited.
3. **Nuance & source criticism**: add or sharpen `critique` where a claim rests on late, partisan or
   legendary sources, or where historians disagree. Avoid presenting traditional dates as certain.
4. **Consistency**: the Swedish text is master. If you change a fact, change it in `en` and `ar` too,
   keeping the Arabic in good Modern Standard Arabic (Western digits). `date`, `year`, `loc` (lon/lat
   must be the real place) and `regions` must match the text.
5. **Gaps**: if an event that is genuinely significant for this period (especially "small but
   significant" ones) is missing, you may add up to 3 new events in the same format, fully sourced.
6. **English**: fix awkward or non-idiomatic English while you are there.

Keep texts within the validator limits and run `node tools/validate-content.mjs <your files>` after
editing. Finish with a concise report: corrections made (event id → what changed and why, with the
source), additions, links removed, and any doubts that remain unresolved.
