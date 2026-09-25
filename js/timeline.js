// Timeline: chapters as segments (wider where more happens), event ticks in two lanes
// (the North above, Europe below), a ribbon of who ruled Sweden, and a draggable cursor.
(function (SM) {
  "use strict";
  var el = function (t, a, c) { return SM.core.el(t, a, c); };

  function Timeline(root, opts) {
    this.root = root;
    this.opts = opts;
    this.data = SM.data;
    this.computeScale();
    this.render();
    this.bind();
  }

  // piecewise-linear scale: each chapter gets width proportional to its (dampened) event count
  Timeline.prototype.computeScale = function () {
    var chs = this.data.chapters;
    var weights = chs.map(function (c) { return Math.max(6, c.events.length) + 4; });
    var total = weights.reduce(function (a, b) { return a + b; }, 0);
    var acc = 0;
    this.segs = chs.map(function (c, i) {
      var s = { ch: c, x0: acc / total, x1: (acc + weights[i]) / total, y0: c.start, y1: c.end };
      acc += weights[i];
      return s;
    });
  };
  Timeline.prototype.x = function (year) {
    var segs = this.segs;
    if (year <= segs[0].y0) return 0;
    for (var i = 0; i < segs.length; i++) {
      var s = segs[i];
      if (year < s.y1 || i === segs.length - 1) {
        var f = Math.max(0, Math.min(1, (year - s.y0) / (s.y1 - s.y0)));
        return s.x0 + f * (s.x1 - s.x0);
      }
    }
    return 1;
  };
  Timeline.prototype.year = function (x) {
    var segs = this.segs;
    for (var i = 0; i < segs.length; i++) {
      var s = segs[i];
      if (x <= s.x1 || i === segs.length - 1) {
        var f = Math.max(0, Math.min(1, (x - s.x0) / (s.x1 - s.x0)));
        return s.y0 + f * (s.y1 - s.y0);
      }
    }
    return segs[segs.length - 1].y1;
  };
  // an event's tick sits at its year, but events of one chapter never leave that chapter's segment
  Timeline.prototype.eventX = function (ev) {
    var s = this.segs[ev.chapterIndex];
    return Math.max(s.x0 + 0.002, Math.min(s.x1 - 0.002, this.x(ev.t)));
  };

  Timeline.prototype.render = function () {
    var self = this, i18n = SM.core.i18n, tx = i18n.tx;
    var root = this.root;
    root.textContent = "";
    var track = el("div", { class: "track", role: "group", "aria-label": i18n.t("timeline") });
    this.track = track;
    var chaps = el("div", { class: "chapters" });
    this.segEls = this.segs.map(function (s) {
      var union = s.ch.range[0] < 1523 && s.ch.range[1] > 1389;
      var d = el("div", { class: "seg" + (union ? " union-seg" : ""), title: tx(s.ch.title), text: tx(s.ch.title) });
      d.style.insetInlineStart = (s.x0 * 100) + "%";
      d.style.width = ((s.x1 - s.x0) * 100) + "%";
      chaps.appendChild(d);
      return d;
    });
    track.appendChild(chaps);
    var laneMain = el("div", { class: "lane lane-main" });
    var laneEu = el("div", { class: "lane lane-eu" });
    this.tickEls = this.data.events.map(function (ev) {
      var b = el("button", {
        class: "tick", type: "button", "data-kind": ev.kind, "data-w": ev.weight,
        "aria-label": ev.year + " – " + tx(ev.title), tabindex: "-1",
      });
      b.style.insetInlineStart = (self.eventX(ev) * 100) + "%";
      b.addEventListener("click", function (e) { e.stopPropagation(); self.opts.onSelect(ev.index); });
      b.addEventListener("focus", function () { self.tip(ev, b); });
      b.addEventListener("blur", function () { self.tip(null); });
      b.addEventListener("pointerenter", function () { self.tip(ev, b); });
      b.addEventListener("pointerleave", function () { self.tip(null); });
      (ev.kind === "europe" ? laneEu : laneMain).appendChild(b);
      return b;
    });
    track.appendChild(laneMain);
    track.appendChild(laneEu);
    var ribbon = el("div", { class: "ribbon", "aria-hidden": "true" });
    var tl = this;
    (SM.rulers || []).filter(function (r) { return !r.parallel; }).forEach(function (r) {
      var x0 = tl.x(r.from), x1 = tl.x(r.to);
      if (x1 <= 0 || x0 >= 1) return;
      var d = el("div", { class: "rs", "data-role": r.role, title: tx(r.name) + " (" + Math.floor(r.from) + "–" + Math.floor(r.to) + ")" });
      d.style.insetInlineStart = (x0 * 100) + "%";
      d.style.width = (Math.max(0.1, (x1 - x0) * 100)) + "%";
      ribbon.appendChild(d);
    });
    track.appendChild(ribbon);
    this.cursor = el("div", { class: "cursor", "aria-hidden": "true" });
    track.appendChild(this.cursor);
    this.tipEl = el("div", { class: "track-tip", hidden: true });
    track.appendChild(this.tipEl);
    this.slider = el("input", {
      type: "range", class: "sr-only", min: String(Math.floor(this.data.start)), max: String(Math.ceil(this.data.end)),
      step: "1", "aria-label": i18n.t("yearLabel"),
    });
    this.slider.addEventListener("input", function () { self.opts.onScrub(+self.slider.value, true); });
    track.appendChild(this.slider);
    root.appendChild(track);
  };

  Timeline.prototype.tip = function (ev, anchor) {
    if (!ev) { this.tipEl.hidden = true; return; }
    this.tipEl.textContent = ev.year + " · " + SM.core.i18n.tx(ev.title);
    this.tipEl.style.insetInlineStart = anchor.style.insetInlineStart;
    var f = parseFloat(anchor.style.insetInlineStart) / 100;
    this.tipEl.classList.toggle("at-start", f < 0.12);
    this.tipEl.classList.toggle("at-end", f > 0.82);
    this.tipEl.hidden = false;
  };

  Timeline.prototype.bind = function () {
    var self = this, track = this.track, dragging = false;
    var fracAt = function (e) {
      var r = track.getBoundingClientRect();
      var f = (e.clientX - r.left) / r.width;
      if (document.documentElement.dir === "rtl") f = 1 - f;
      return Math.max(0, Math.min(1, f));
    };
    track.addEventListener("pointerdown", function (e) {
      if (e.target.classList.contains("tick")) return;
      dragging = true;
      track.setPointerCapture(e.pointerId);
      self.opts.onScrub(self.year(fracAt(e)), false);
    });
    var pending = null;
    track.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      var first = pending === null;
      pending = self.year(fracAt(e));
      if (first) requestAnimationFrame(function () {
        if (pending !== null && dragging) self.opts.onScrub(pending, false);
        pending = null;
      });
    });
    var end = function (e) {
      if (!dragging) return;
      dragging = false;
      self.opts.onScrub(self.year(fracAt(e)), true);
    };
    track.addEventListener("pointerup", end);
    track.addEventListener("pointercancel", end);
  };

  Timeline.prototype.setCursor = function (t, ev) {
    var x = this.x(t);
    if (ev && Math.abs(ev.t - t) < 1e-6) x = this.eventX(ev);
    this.cursor.style.insetInlineStart = (x * 100) + "%";
    this.cursor.setAttribute("data-year", String(Math.floor(t)));
    this.slider.value = String(Math.floor(t));
    var ch = SM.core.chapterAt(t);
    this.segEls.forEach(function (s, i) { s.classList.toggle("active", SM.data.chapters[i] === ch); });
  };
  Timeline.prototype.setCurrent = function (ev) {
    var old = this.cur != null && this.tickEls[this.cur];
    var hadFocus = old && document.activeElement === old;
    if (old) { old.classList.remove("current"); old.removeAttribute("aria-current"); old.tabIndex = -1; }
    this.cur = ev ? ev.index : null;
    if (ev) {
      var b = this.tickEls[ev.index];
      b.classList.add("current");
      b.setAttribute("aria-current", "true");
      b.tabIndex = 0;          // roving tabindex: the current event is the timeline's tab stop
      if (hadFocus) b.focus();
    }
  };

  SM.Timeline = Timeline;
})(window.SM = window.SM || {});
