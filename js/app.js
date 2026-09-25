// App: wires map, timeline and panel together; playback, language, legend, keyboard, deep links.
(function (SM) {
  "use strict";
  var core = SM.core, i18n = core.i18n;
  var el = function (tg, a, c) { return core.el(tg, a, c); };
  var $ = function (s) { return document.querySelector(s); };

  var SPEEDS = { slow: 1.7, normal: 1, fast: 0.5 };
  var ICONS = {
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M8 5.5v13l11-6.5z"/></svg>',
    pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z"/></svg>',
    prev: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6 5h2v14H6zm3.5 7L19 5.5v13z"/></svg>',
    next: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16 5h2v14h-2zM5 5.5 14.5 12 5 18.5z"/></svg>',
    plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z"/></svg>',
    minus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 11h14v2H5z"/></svg>',
    home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
  };

  var App = {
    idx: 0,
    playing: false,
    timer: null,
    speed: "normal",
    includeEurope: true,

    init: function () {
      core.build();
      var saved = core.storage.get("lang");
      i18n.set(saved || "sv");
      this.speed = core.storage.get("speed") || "normal";
      this.includeEurope = core.storage.get("europe") !== "0";
      this.buildChrome();
      var self = this;
      this.map = new SM.MapView($("#map"), {
        onPin: function (ev) { self.stop(); self.go(ev.index); },
        onUserMove: function () { /* user takes the camera; playback continues */ },
      });
      this.timeline = new SM.Timeline($("#track"), {
        onSelect: function (i) { self.stop(); self.go(i); },
        onScrub: function (y, done) { self.scrub(y, done); },
      });
      this.narrator = new SM.Narrator({
        onEnded: function () { if (self.playing) { clearTimeout(self.timer); self.timer = setTimeout(function () { self.step(1); }, 1400); } },
        onFail: function () { self.narrationFailed = true; if (self.playing) self.schedule(); },
        onUserPause: function () { self.stop(); },
      });
      this.panel = new SM.Panel($("#panel-body"), {
        narrator: this.narrator,
        onSelect: function (i) { self.stop(); self.go(i); },
      });
      // read the deep link before anything rewrites the hash
      var start = this.fromHash();
      this.idx = start != null ? start : 0;
      this.reading = new SM.Reading($(".app"), $("#splitter"), $("#panel"), { onChange: function () { self.map.resize(); } });
      this.applyLang({ skipRender: true });
      this.go(this.idx, { instant: true });
      this.bindKeys();
      window.addEventListener("hashchange", function () {
        var i = self.fromHash();
        if (i != null && i !== self.idx) self.go(i);
      });
    },

    fromHash: function () {
      var id = decodeURIComponent((location.hash || "").slice(1));
      var ev = id && SM.data.byId[id];
      return ev ? ev.index : null;
    },

    // ---------- chrome ----------
    buildChrome: function () {
      var self = this;
      $("#btn-play").innerHTML = ICONS.play;
      $("#btn-prev").innerHTML = ICONS.prev;
      $("#btn-next").innerHTML = ICONS.next;
      $("#btn-zin").innerHTML = ICONS.plus;
      $("#btn-zout").innerHTML = ICONS.minus;
      $("#btn-home").innerHTML = ICONS.home;
      $("#btn-play").classList.add("hint");
      $("#btn-play").addEventListener("click", function () { this.classList.remove("hint"); self.toggle(); });
      $("#btn-prev").addEventListener("click", function () { self.stop(); self.step(-1); });
      $("#btn-next").addEventListener("click", function () { self.stop(); self.step(1); });
      $("#btn-zin").addEventListener("click", function () { self.map.zoomBy(1.6); });
      $("#btn-zout").addEventListener("click", function () { self.map.zoomBy(1 / 1.6); });
      $("#btn-home").addEventListener("click", function () { self.map.home(); });
      $("#speed").value = this.speed;
      $("#speed").addEventListener("change", function (e) { self.speed = e.target.value; core.storage.set("speed", self.speed); if (self.playing) self.schedule(); });
      document.querySelectorAll(".lang button").forEach(function (b) {
        b.addEventListener("click", function () {
          i18n.set(b.getAttribute("data-lang"));
          core.storage.set("lang", i18n.lang);
          self.applyLang();
        });
      });
      $("#btn-glossary").addEventListener("click", function () { self.panel.openGlossary(); });
      $("#btn-biblio").addEventListener("click", function () { self.panel.openBibliography(); });
      $("#btn-about").addEventListener("click", function () { self.panel.openAbout(); });
      var ar = $("#btn-autoread");
      ar.hidden = !Object.keys(SM.audio || {}).length;
      ar.addEventListener("click", function () {
        var on = !self.narrator.auto;
        self.narrator.setAuto(on);
        ar.setAttribute("aria-pressed", String(on));
        var ev = SM.data.events[self.idx];
        if (on && self.narrator.has(ev)) self.narrator.play();
        if (self.playing) self.schedule();
      });
    },

    applyLang: function (opt) {
      var l = i18n.lang, t = i18n.t;
      document.documentElement.lang = l;
      document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
      document.title = t("appTitle") === "Stormaktsdagar" ? "Stormaktsdagar" : t("appTitle") + " · Stormaktsdagar";
      $("#app-title").textContent = t("appTitle");
      $("#app-sub").textContent = t("appSub");
      document.querySelectorAll(".lang button").forEach(function (b) {
        b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === l));
      });
      $("#btn-glossary").textContent = t("glossary");
      $("#btn-biblio").textContent = t("bibliography");
      $("#btn-about").textContent = t("about");
      $("#btn-prev").setAttribute("aria-label", t("prev"));
      $("#btn-next").setAttribute("aria-label", t("next"));
      $("#btn-zin").setAttribute("aria-label", t("zoomIn"));
      $("#btn-zout").setAttribute("aria-label", t("zoomOut"));
      $("#btn-home").setAttribute("aria-label", t("zoomReset"));
      $("#speed").setAttribute("aria-label", t("speed"));
      $("#speed").options[0].textContent = t("speedSlow");
      $("#speed").options[1].textContent = t("speedNormal");
      $("#speed").options[2].textContent = t("speedFast");
      this.updatePlayButton();
      if (this.reading) this.reading.setLang();
      var arBtn = $("#btn-autoread");
      arBtn.innerHTML = SM.Narrator.speakerIcon;
      arBtn.appendChild(document.createTextNode(t("autoRead")));
      arBtn.setAttribute("aria-pressed", String(!!(this.narrator && this.narrator.auto)));
      if (this.map) {
        this.map.setLang();
        this.timeline.computeScale();
        this.timeline.render();
        this.timeline.bind();
      }
      if (!(opt && opt.skipRender) && SM.data.events[this.idx] && this.panel) this.go(this.idx, { instant: true, keepCamera: true });
    },

    updatePlayButton: function () {
      var b = $("#btn-play");
      b.innerHTML = this.playing ? ICONS.pause : ICONS.play;
      b.setAttribute("aria-label", i18n.t(this.playing ? "pause" : "play"));
      b.setAttribute("aria-pressed", String(this.playing));
    },

    renderLegend: function (terr) {
      var t = i18n.t, tx = i18n.tx;
      var body = $("#legend-body");
      var legendOpen = $("#legend").open;
      body.textContent = "";
      var owners = {}, statuses = {};
      Object.keys(terr).forEach(function (id) {
        var s = terr[id];
        if (s.owner) { owners[s.owner] = true; if (s.status !== "core") statuses[s.status] = s.owner; }
      });
      var ul = el("ul");
      var order = Object.keys(SM.owners);
      order.filter(function (o) { return owners[o]; }).forEach(function (o) {
        var sw = el("span", { class: "sw" });
        sw.style.background = "color-mix(in srgb, var(--c-" + o + ") 70%, transparent)";
        ul.appendChild(el("li", null, [sw, el("span", { text: tx(SM.owners[o].name) })]));
      });
      body.appendChild(el("h4", { text: t("ownersLegend") }));
      body.appendChild(ul);
      var sts = Object.keys(statuses);
      var y = SM.data.events[this.idx] ? SM.data.events[this.idx].t : 0;
      if (sts.length || (y >= 1389 && y < 1523.43)) {
        var ul2 = el("ul");
        var pat = { loose: "repeating-linear-gradient(135deg, var(--ink-3) 0 1.5px, transparent 1.5px 6px)",
          pledge: "radial-gradient(var(--ink-3) 1.4px, transparent 1.6px) 0 0/6px 6px",
          occupied: "repeating-linear-gradient(135deg, var(--ink-3) 0 2.5px, transparent 2.5px 5px)",
          disputed: "repeating-linear-gradient(135deg, var(--ink-3) 0 1px, transparent 1px 6px), repeating-linear-gradient(45deg, var(--ink-3) 0 1px, transparent 1px 6px)" };
        sts.forEach(function (s) {
          var sw = el("span", { class: "sw" });
          sw.style.background = pat[s];
          ul2.appendChild(el("li", null, [sw, el("span", { text: tx(SM.statuses[s]) })]));
        });
        if (y >= 1389 && y < 1523.43) {
          var sw = el("span", { class: "sw" });
          sw.style.background = "repeating-linear-gradient(45deg, var(--gold) 0 1.5px, transparent 1.5px 6px)";
          ul2.appendChild(el("li", null, [sw, el("span", { text: t("kalmarUnion") })]));
        }
        body.appendChild(el("h4", { text: t("statusLegend") }));
        body.appendChild(ul2);
      }
      var self = this;
      var cb = el("input", { type: "checkbox", id: "chk-borders" });
      cb.checked = !!this.showBorders;
      cb.addEventListener("change", function () { self.showBorders = cb.checked; self.map.showBorders(cb.checked); });
      var cb2 = el("input", { type: "checkbox", id: "chk-europe" });
      cb2.checked = this.includeEurope;
      cb2.addEventListener("change", function () { self.includeEurope = cb2.checked; core.storage.set("europe", cb2.checked ? "1" : "0"); });
      body.appendChild(el("label", null, [cb, el("span", { text: t("modernBorders") })]));
      body.appendChild(el("label", null, [cb2, el("span", { text: t("showEurope") })]));
      $("#legend-summary").textContent = t("legend");
      $("#legend").open = legendOpen;
    },

    // ---------- navigation ----------
    go: function (i, opt) {
      opt = opt || {};
      var evs = SM.data.events;
      i = Math.max(0, Math.min(evs.length - 1, i));
      var ev = evs[i];
      this.idx = i;
      var terr = this.map.setTime(ev.t);
      var chEvents = ev.chapter.events;
      this.map.renderPins(chEvents, ev);
      this.map.highlight(ev.regions);
      if (!opt.keepCamera) this.map.focusOn(ev, opt.instant);
      this.map.showRoute(ev.route);
      this.timeline.setCursor(ev.t, ev);
      this.timeline.setCurrent(ev);
      this.narrationFailed = false;
      this.panel.render(ev);
      this.narrator.setEvent(ev);
      this.renderYearplate(ev);
      this.renderLegend(terr);
      $("#live").textContent = ev.year + " – " + i18n.tx(ev.title);
      try { history.replaceState(null, "", "#" + ev.id); } catch (e) { /* sandboxed frames may refuse */ }
      if (this.playing) this.schedule();
    },

    renderYearplate: function (ev, yearOverride) {
      var y = yearOverride != null ? yearOverride : ev.year;
      var yearEl = $("#yp-year");
      var from = parseInt(yearEl.textContent, 10);
      this.countYear(yearEl, isNaN(from) ? y : from, y);
      var ch = ev ? ev.chapter : core.chapterAt(y);
      $("#yp-era").textContent = i18n.tx(ch.title);
      var t = yearOverride != null ? yearOverride : ev.t;
      var u = core.unionAt(t);
      var badge = $("#yp-union");
      if (u && t >= 1389 && t < 1523.43) {
        badge.hidden = false;
        badge.setAttribute("data-status", u.status);
        $("#yp-union-text").textContent = i18n.t("kalmarUnion") + " · " + i18n.t("union." + u.status);
      } else badge.hidden = true;
    },

    countYear: function (node, from, to) {
      if (this.yearAnim) cancelAnimationFrame(this.yearAnim);
      var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (from === to || reduce || Math.abs(to - from) > 400) { node.textContent = String(to); return; }
      var t0 = performance.now(), dur = Math.min(1100, 250 + Math.abs(to - from) * 12), self = this;
      var step = function (now) {
        var u = Math.min(1, (now - t0) / dur);
        var e = 1 - Math.pow(1 - u, 3);
        node.textContent = String(Math.round(from + (to - from) * e));
        if (u < 1) self.yearAnim = requestAnimationFrame(step);
      };
      this.yearAnim = requestAnimationFrame(step);
    },

    step: function (d) {
      var i = this.idx + d, evs = SM.data.events;
      if (this.playing && !this.includeEurope) {
        while (evs[i] && evs[i].kind === "europe") i += d;
      }
      if (i < 0 || i >= evs.length) { this.stop(); return; }
      this.go(i);
    },

    scrub: function (year, done) {
      var y = Math.max(SM.data.start, Math.min(SM.data.end, year));
      this.stop();
      if (!done) {
        var terr = this.map.setTime(y);
        this.timeline.setCursor(y);
        this.renderYearplate(null, Math.floor(y));
        return;
      }
      // snap to the nearest event
      var best = 0, bd = Infinity;
      SM.data.events.forEach(function (ev, i) {
        var d = Math.abs(ev.t - y);
        if (d < bd) { bd = d; best = i; }
      });
      this.go(best);
    },

    // ---------- playback ----------
    toggle: function () { if (this.playing) this.stop(); else this.play(); },
    play: function () {
      this.playing = true;
      this.updatePlayButton();
      if (this.idx >= SM.data.events.length - 1) this.go(0); else this.schedule();
    },
    stop: function () {
      if (!this.playing) return;
      this.playing = false;
      clearTimeout(this.timer);
      this.updatePlayButton();
    },
    schedule: function () {
      clearTimeout(this.timer);
      var ev = SM.data.events[this.idx], self = this;
      // a narrated event advances when the reading ends (see Narrator onEnded)
      if (!this.narrationFailed && this.narrator.willNarrate(ev)) return;
      var words = (i18n.tx(ev.text) || "").split(/\s+/).length;
      var ms = (5000 + words * 70 + (ev.route ? 2500 : 0)) * (SPEEDS[this.speed] || 1);
      if (ev.kind === "europe") ms *= 0.8;
      this.timer = setTimeout(function () { self.step(1); }, ms);
    },

    bindKeys: function () {
      var self = this;
      document.addEventListener("keydown", function (e) {
        if (e.altKey || e.ctrlKey || e.metaKey) return;
        var tag = (e.target.tagName || "").toLowerCase();
        if (tag === "input" || tag === "select" || tag === "textarea" || document.querySelector("dialog[open]")) return;
        // arrow keys inside the map canvas or a pin belong to the page, not to event stepping
        if (e.target.closest && e.target.closest(".pin")) return;
        var rtl = document.documentElement.dir === "rtl";
        if (e.key === "ArrowRight") { e.preventDefault(); self.stop(); self.step(rtl ? -1 : 1); }
        else if (e.key === "ArrowLeft") { e.preventDefault(); self.stop(); self.step(rtl ? 1 : -1); }
        else if (e.key === " " && tag !== "button" && tag !== "a") { e.preventDefault(); self.toggle(); }
        else if (e.key === "+" || e.key === "=") self.map.zoomBy(1.6);
        else if (e.key === "-") self.map.zoomBy(1 / 1.6);
      });
    },
  };

  SM.App = App;
  var boot = function () {
    try { App.init(); }
    catch (err) {
      var box = document.getElementById("panel");
      if (box) box.textContent = "Kartan kunde inte starta: " + err.message;
      throw err;
    }
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})(window.SM = window.SM || {});
