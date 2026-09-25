# Review round 2 — translation & language brief

You are a professional translator and editor (Swedish → English and Swedish → Arabic) reviewing
**Stormaktsdagar**, an educational interactive map for upper-secondary students and adults.
The Swedish text (`sv`) is the fact-checked master: do **not** change facts. You own ONLY the
files named in your task (others are being edited in parallel).

For every translatable field (`title`, `intro`, `date`, `where`, `text`, `why`, `critique`, `quote`):

**Arabic (`ar`)** — the priority.
* Modern Standard Arabic that reads naturally to an educated Arab reader (not a word-for-word calque);
  correct grammar, agreement, `إن/أن`, hamzas, ة/ه, ى/ي, and punctuation (، ؛ ؟ and Arabic quotes « »).
* Faithful to the Swedish: nothing added, nothing omitted, same nuance (e.g. "troligen", "enligt
  traditionen" must stay hedged).
* Consistent terminology across the file, e.g. اتحاد كالمار، المجلس الملكي/مجلس المملكة (riksråd),
  الوصي على المملكة (riksföreståndare), طبقة النبلاء المعفاة من الضرائب (frälse), الريكسداغ/البرلمان
  السويدي (riksdag), الرابطة الهانزية (Hansan), رسوم مضيق أوريسند (Öresundstullen).
  Use consistent Arabic spellings of names (غوستاف فاسا، إنغلبريكت، مارغريت، إريك البوميراني،
  كريستيان الثاني، أكسل أوكسنشيرنا، كريستينا، كارل العاشر غوستاف …). Give the Latin-script name in
  brackets the first time an obscure name or place appears in an event if it helps (e.g. «أسله (Åsle)»).
* Western digits (0–9); dates as «17 يونيو 1397». Keep text length similar to the Swedish.
* Make sure no Latin-script words remain unintentionally and no Swedish words are left untranslated.

**English (`en`)** — natural British/international academic English; standard English forms of
names (Eric of Pomerania, Charles X Gustav, Gustavus Adolphus may be given as "Gustav II Adolf
(Gustavus Adolphus)" on first mention), correct terminology (council of the realm, regent, estates,
Riksdag, the Hanse/Hanseatic League, the Sound Dues). Fix calques and awkward phrasing.

**Swedish (`sv`)** — only fix typos, grammar or clumsy wording; no factual changes.

Run `node tools/validate-content.mjs <your files>` when done (limits: text 45–150 Swedish words etc.).
Report briefly: number of fields improved per language, recurring problems you fixed, and any place
where the Swedish itself seemed unclear or possibly wrong (report, don't change).
