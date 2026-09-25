// Scene list for the short. setup() and frame(t) run inside the page (serialized), so they
// may only use window.__ad / window.SM, never variables from this file.
const SCENES = [
  {
    name: "hook", dur: 3.0,
    setup() {
      __ad.mode("map");
      __ad.go("roskildefreden-1658");
      __ad.captions([{ y: "34%", lines: [
        { text: "Hur blev lilla Sverige", at: 0.1 },
        { text: "en stormakt?", at: 0.45, cls: "hl big" },
      ] }]);
    },
    frame(t) {
      __ad.cam(19, 60.3, 1.55 + 0.3 * __ad.ease.inOut(Math.min(1, t / 3)));
      __ad.tick(t);
    },
  },
  {
    name: "timelapse", dur: 7.0,
    stills: [0.3, 2.0, 4.5, 6.8],
    setup() {
      __ad.mode("map-time");
      const evs = SM.data.events;
      const targets = [830, 995, 1164, 1250, 1290, 1319, 1361, 1397, 1434, 1471, 1497, 1520, 1523, 1561, 1595, 1617, 1631, 1648, 1658, 1700, 1709, 1721];
      const pick = targets.map((y) => evs.reduce((b, e) => (Math.abs(e.t - y) < Math.abs(b.t - y) ? e : b)));
      __ad._tl = pick.filter((e, i) => pick.indexOf(e) === i).map((e) => e.id);
      __ad._tlIdx = -1;
      __ad.go(__ad._tl[0]);
      __ad.cam(19, 60.3, 1.3);
      __ad.captions([
        { y: "22%", out: 3.35, lines: [
          { text: "900 år av historia", at: 0.15 },
          { text: "på en enda karta", at: 0.5, cls: "blue" },
        ] },
        { y: "22%", lines: [
          { text: "Se riket växa –", at: 3.6 },
          { text: "och krympa", at: 3.95, cls: "red" },
        ] },
      ]);
    },
    frame(t) {
      const list = __ad._tl, per = 6.3 / list.length;
      const i = Math.max(0, Math.min(list.length - 1, Math.floor((t - 0.25) / per)));
      if (i !== __ad._tlIdx) {
        __ad._tlIdx = i;
        SM.App.go(SM.data.byId[list[i]].index, { instant: true, keepCamera: true });
      }
      __ad.cam(19, 60.3, 1.3);
      __ad.tick(t, { flash: true });
    },
  },
  {
    name: "kalmar", dur: 3.3,
    setup() {
      __ad.mode("map");
      __ad.go("kalmar-kroning-1397");
      __ad.captions([{ y: "36%", lines: [
        { text: "1397: tre riken –", at: 0.1 },
        { text: "en kung", at: 0.45, cls: "hl big" },
      ] }]);
    },
    frame(t) {
      __ad.cam(15.5, 61.5, 1.25 + 0.25 * __ad.ease.inOut(Math.min(1, t / 3.3)));
      __ad.tick(t, { flash: true });
    },
  },
  {
    name: "blodbad", dur: 5.0,
    stills: [0.2, 0.6, 2.5, 4.9],
    setup() {
      __ad.mode("split");
      __ad.go("stockholms-blodbad-1520");
      __ad.scrollPanelToEvent(4);
      const b = document.querySelector(".narrator .np-btn").getBoundingClientRect();
      __ad._tap = { x: b.left + b.width / 2, y: b.top + b.height / 2, at: 0.3 };
      __ad.captions([{ y: "63%", lines: [
        { text: "Tryck play –", at: 0.1 },
        { text: "och lyssna", at: 0.4, cls: "red big" },
        { text: "Nyckelhändelser läses upp på svenska", at: 0.8, cls: "sub" },
      ] }]);
    },
    frame(t) {
      __ad.scrollPanelToEvent(4);
      __ad.narration(Math.max(0, t - 0.45), t >= 0.45);
      __ad.tick(t, { flash: true, tap: __ad._tap });
    },
  },
  {
    name: "ice", dur: 4.5,
    stills: [0.3, 2.0, 4.4],
    setup() {
      __ad.mode("map");
      __ad.go("taget-over-balt-1658");
      __ad.captions([{ y: "58%", lines: [
        { text: "Följ fälttågen", at: 0.1 },
        { text: "Tåget över Bält 1658", at: 0.45, cls: "blue" },
      ] }]);
    },
    frame(t) {
      __ad.cam(11.2, 55.9, 5.2 + 0.6 * __ad.ease.inOut(Math.min(1, t / 4.5)));
      __ad.tick(t, { flash: true });
    },
  },
  {
    name: "roskilde", dur: 4.2,
    stills: [0.3, 2.0, 4.1],
    setup() {
      __ad.mode("map");
      __ad.go("roskildefreden-1658");
      __ad.captions([{ y: "58%", lines: [
        { text: "Roskildefreden:", at: 0.25 },
        { text: "Sveriges största utbredning", at: 1.55, cls: "hl" },
      ] }]);
    },
    frame(t) {
      const u = __ad.ease.inOut(Math.min(1, t / 4.0));
      __ad.cam(14 + 5 * u, 57 + 3.3 * u, 3.4 - 1.85 * u);
      __ad.tick(t, { flash: true });
    },
  },
  {
    name: "langs", dur: 3.3,
    stills: [0.4, 1.5, 2.6, 3.2],
    setup() {
      __ad.mode("split-head");
      __ad.lang("sv");
      __ad.go("vasa-1628");
      __ad.scrollPanelToEvent(4);
      const pos = {};
      document.querySelectorAll(".lang button").forEach((b) => {
        const r = b.getBoundingClientRect();
        pos[b.getAttribute("data-lang")] = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      });
      __ad._lp = pos;
      __ad._lang = "sv";
      __ad.captions([{ y: "72%", lines: [
        { text: "På svenska,", at: 0.1 },
        { text: "engelska", at: 1.2, cls: "blue" },
        { text: "och arabiska", at: 2.3, cls: "hl" },
      ] }]);
    },
    frame(t) {
      const want = t >= 2.2 ? "ar" : t >= 1.1 ? "en" : "sv";
      if (want !== __ad._lang) {
        __ad._lang = want;
        __ad.lang(want);
      }
      __ad.scrollPanelToEvent(4);
      const tapAt = t >= 1.95 ? 1.95 : 0.85;
      const p = __ad._lp[t >= 1.95 ? "ar" : "en"];
      __ad.tick(t, { flash: true, tap: { x: p.x, y: p.y, at: tapAt } });
    },
  },
  {
    name: "end", dur: 4.0,
    stills: [0.2, 1.0, 3.9],
    setup() {
      __ad.lang("sv");
      __ad.mode("map");
      __ad.go("roskildefreden-1658");
      __ad.endCard();
    },
    frame(t) {
      __ad.cam(19, 60.3, 1.5 + 0.12 * (t / 4));
      __ad.endTick(t);
    },
  },
];
module.exports = { SCENES };
