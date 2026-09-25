// Core: assembles content, answers "what was true at time t", and handles language.
(function (SM) {
  "use strict";

  var LANGS = ["sv", "en", "ar"];
  var MONTHS_SV = ["januari", "februari", "mars", "april", "maj", "juni", "juli", "augusti", "september", "oktober", "november", "december"];

  // --- language ---
  var lang = "sv";
  var i18n = {
    langs: LANGS,
    get lang() { return lang; },
    set: function (l) { lang = LANGS.indexOf(l) >= 0 ? l : "sv"; },
    t: function (key) {
      var parts = key.split(".");
      var pick = function (dict) { return parts.reduce(function (o, k) { return o == null ? o : o[k]; }, dict); };
      var v = pick(SM.ui[lang]);
      return v == null ? (pick(SM.ui.sv) != null ? pick(SM.ui.sv) : key) : v;
    },
    // pick a translation from a {sv,en,ar} object, falling back to Swedish
    tx: function (obj) {
      if (obj == null) return "";
      if (typeof obj === "string") return obj;
      return obj[lang] || obj.sv || obj.en || "";
    },
    num: function (n) { return String(n); },
  };

  // --- time of an event: parsed from the Swedish date so the map state matches the day ---
  // For ranges ("1 juni 1657 – 11 februari 1658") the date belonging to the event's own year wins.
  function eventTime(ev) {
    if (typeof ev.ty === "number") return ev.ty;
    var sv = ((ev.date && ev.date.sv) || "").toLowerCase();
    var re = /(?:(?<!\d)(\d{1,2})\s*(?:[–-]\s*\d{1,2}\s*)?)?(januari|februari|mars|april|maj|juni|juli|augusti|september|oktober|november|december)/g;
    var m, best = null;
    while ((m = re.exec(sv))) {
      var after = sv.slice(re.lastIndex).match(/(?:^|\D)(\d{3,4})(?!\d)/);
      var y = after ? parseInt(after[1], 10) : ev.year;
      if (y === ev.year) best = m;   // keep the last match in the event's year
    }
    if (!best) return ev.year + 0.5;
    var month = MONTHS_SV.indexOf(best[2]);
    var day = best[1] ? parseInt(best[1], 10) : 15;
    return ev.year + (month + day / 31) / 12 + 0.001;
  }

  // --- content ---
  function build() {
    var chapters = (SM.chapters || []).slice().sort(function (a, b) {
      return a.range[0] - b.range[0] || a.id.localeCompare(b.id);
    });
    var events = [];
    chapters.forEach(function (ch, ci) {
      ch.index = ci;
      (ch.events || []).forEach(function (ev, k) {
        events.push(Object.assign({}, ev, { chapter: ch, chapterIndex: ci, srcIndex: k, t: eventTime(ev) }));
      });
    });
    events.sort(function (a, b) {
      return a.chapterIndex - b.chapterIndex || a.year - b.year || (a.order || 0) - (b.order || 0) ||
        a.t - b.t || a.srcIndex - b.srcIndex;
    });
    events.forEach(function (ev, i) {
      ev.index = i;
      // stepping forward must never move the map backwards within a year
      var prev = events[i - 1];
      if (prev && prev.year === ev.year && ev.t < prev.t) ev.t = prev.t;
    });
    chapters.forEach(function (ch) {
      ch.events = events.filter(function (ev) { return ev.chapter === ch; });
      ch.start = ch.range[0];
    });
    chapters.forEach(function (ch, i) {
      var next = chapters[i + 1];
      ch.end = next ? next.range[0] : ch.range[1];
      if (ch.end <= ch.start) ch.end = ch.start + 1;
    });
    SM.data = {
      chapters: chapters,
      events: events,
      start: chapters.length ? chapters[0].start : 800,
      end: chapters.length ? chapters[chapters.length - 1].end : 1721,
      byId: events.reduce(function (m, ev) { m[ev.id] = ev; return m; }, {}),
    };
    return SM.data;
  }

  // --- "what was true at time t" ---
  function territoryAt(t) {
    var out = {};
    var terr = SM.territory || {};
    Object.keys(terr).forEach(function (id) {
      var cur = null;
      terr[id].forEach(function (e) { if (e[0] <= t) cur = e; });
      out[id] = cur ? { owner: cur[1], status: cur[2] || "core" } : { owner: null, status: "core" };
    });
    return out;
  }

  function periodAt(list, t) {
    if (!list) return null;
    var hit = null;
    for (var i = 0; i < list.length; i++) {
      var p = list[i];
      if (p.from <= t && t < p.to) hit = p;
    }
    return hit;
  }

  function rulersAt(t) {
    var list = SM.rulers || [];
    return list.filter(function (p) { return p.from <= t && t < p.to; });
  }

  function chapterAt(t) {
    var chs = SM.data.chapters;
    for (var i = chs.length - 1; i >= 0; i--) if (t >= chs[i].start) return chs[i];
    return chs[0];
  }

  SM.core = {
    i18n: i18n,
    build: build,
    eventTime: eventTime,
    territoryAt: territoryAt,
    unionAt: function (t) { return periodAt(SM.unionStatus, t); },
    rulersAt: rulersAt,
    danishRulerAt: function (t) { return periodAt(SM.danishRulers, t); },
    chapterAt: chapterAt,
    storage: {
      get: function (k) { try { return window.localStorage.getItem("stormakt:" + k); } catch (e) { return null; } },
      set: function (k, v) { try { window.localStorage.setItem("stormakt:" + k, v); } catch (e) { /* storage unavailable */ } },
    },
    el: function (tag, attrs, children) {
      var n = document.createElement(tag);
      if (attrs) Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v == null || v === false) return;
        if (k === "text") n.textContent = v;
        else if (k === "html") n.innerHTML = v;
        else if (k.slice(0, 2) === "on") n.addEventListener(k.slice(2), v);
        else n.setAttribute(k, v === true ? "" : v);
      });
      (children || []).forEach(function (c) { if (c != null) n.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
      return n;
    },
  };
})(window.SM = window.SM || {});
