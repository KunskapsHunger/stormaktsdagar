// Reading comfort: a draggable divider between map and text, a reading mode that gives the
// text most of the screen, and a text-size control. Preferences are remembered per viewer.
(function (SM) {
  "use strict";
  var core = SM.core, i18n = core.i18n;
  var SCALES = [0.9, 1, 1.12, 1.25, 1.4];
  var MIN_PANEL = 340, MIN_MAP = 300, KEY_STEP = 40;
  var BOOK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" d="M3 5.5c3-1.2 6-1.2 9 .8 3-2 6-2 9-.8v13c-3-1.2-6-1.2-9 .8-3-2-6-2-9-.8z M12 6.3v13.3"/></svg>';

  function Reading(app, splitter, panel, opts) {
    this.app = app;
    this.splitter = splitter;
    this.panel = panel;
    this.opts = opts || {};
    var saved = parseFloat(core.storage.get("panelW"));
    this.width = saved > 0 ? saved : null;          // null = responsive default from CSS
    var si = SCALES.indexOf(parseFloat(core.storage.get("readScale")));
    this.scaleIdx = si >= 0 ? si : 1;
    this.readingMode = core.storage.get("readingMode") === "1";
    this.bindButtons();
    this.bindSplitter();
    this.apply();
  }

  Reading.prototype.isRtl = function () { return document.documentElement.dir === "rtl"; };
  Reading.prototype.maxWidth = function () { return Math.max(MIN_PANEL, this.app.clientWidth - MIN_MAP); };
  Reading.prototype.clamp = function (w) { return Math.round(Math.max(MIN_PANEL, Math.min(this.maxWidth(), w))); };
  Reading.prototype.currentWidth = function () { return this.panel.getBoundingClientRect().width; };

  Reading.prototype.apply = function () {
    var style = this.app.style;
    if (this.readingMode) style.setProperty("--panel-w", "clamp(520px, 64vw, calc(100vw - " + MIN_MAP + "px))");
    else if (this.width) style.setProperty("--panel-w", this.clamp(this.width) + "px");
    else style.removeProperty("--panel-w");
    style.setProperty("--read", String(SCALES[this.scaleIdx]));
    this.app.classList.toggle("reading", this.readingMode);
    var b = document.getElementById("btn-reading");
    b.setAttribute("aria-pressed", String(this.readingMode));
    document.getElementById("btn-smaller").disabled = this.scaleIdx === 0;
    document.getElementById("btn-larger").disabled = this.scaleIdx === SCALES.length - 1;
    this.updateAria();
    if (this.opts.onChange) this.opts.onChange();
  };

  Reading.prototype.updateAria = function () {
    var total = this.app.clientWidth || 1;
    this.splitter.setAttribute("aria-valuemin", "20");
    this.splitter.setAttribute("aria-valuemax", "80");
    this.splitter.setAttribute("aria-valuenow", String(Math.round(this.currentWidth() / total * 100)));
  };

  Reading.prototype.save = function () {
    core.storage.set("panelW", this.width ? String(this.width) : "");
    core.storage.set("readScale", String(SCALES[this.scaleIdx]));
    core.storage.set("readingMode", this.readingMode ? "1" : "0");
  };

  Reading.prototype.setLang = function () {
    var t = i18n.t;
    var r = document.getElementById("btn-reading");
    r.innerHTML = BOOK;
    r.appendChild(document.createTextNode(t("readingMode")));
    document.getElementById("btn-smaller").setAttribute("aria-label", t("textSmaller"));
    document.getElementById("btn-smaller").title = t("textSmaller");
    document.getElementById("btn-larger").setAttribute("aria-label", t("textLarger"));
    document.getElementById("btn-larger").title = t("textLarger");
    this.splitter.setAttribute("aria-label", t("resizePanel"));
    this.splitter.title = t("resizePanel");
  };

  Reading.prototype.bindButtons = function () {
    var self = this;
    document.getElementById("btn-reading").addEventListener("click", function () {
      self.readingMode = !self.readingMode;
      self.apply(); self.save();
    });
    document.getElementById("btn-smaller").addEventListener("click", function () {
      self.scaleIdx = Math.max(0, self.scaleIdx - 1);
      self.apply(); self.save();
    });
    document.getElementById("btn-larger").addEventListener("click", function () {
      self.scaleIdx = Math.min(SCALES.length - 1, self.scaleIdx + 1);
      self.apply(); self.save();
    });
    window.addEventListener("resize", function () { if (self.width) self.apply(); });
  };

  // Dragging the divider sets an explicit width and leaves reading mode.
  Reading.prototype.setWidth = function (w) {
    this.readingMode = false;
    this.width = this.clamp(w);
    this.apply();
  };

  Reading.prototype.bindSplitter = function () {
    var self = this, sp = this.splitter, dragging = false, pending = null;
    var widthAt = function (clientX) {
      var r = self.app.getBoundingClientRect();
      return self.isRtl() ? clientX - r.left : r.right - clientX;
    };
    sp.addEventListener("pointerdown", function (e) {
      dragging = true;
      sp.setPointerCapture(e.pointerId);
      sp.classList.add("dragging");
      self.app.classList.add("resizing");
      e.preventDefault();
    });
    sp.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      var first = pending === null;
      pending = widthAt(e.clientX);
      if (first) requestAnimationFrame(function () {
        if (pending !== null) self.setWidth(pending);
        pending = null;
      });
    });
    var end = function () {
      if (!dragging) return;
      dragging = false;
      sp.classList.remove("dragging");
      self.app.classList.remove("resizing");
      self.save();
    };
    sp.addEventListener("pointerup", end);
    sp.addEventListener("pointercancel", end);
    sp.addEventListener("dblclick", function () {        // back to the default width
      self.width = null; self.readingMode = false; self.apply(); self.save();
    });
    sp.addEventListener("keydown", function (e) {
      var wider = self.isRtl() ? "ArrowRight" : "ArrowLeft";
      var narrower = self.isRtl() ? "ArrowLeft" : "ArrowRight";
      if (e.key !== wider && e.key !== narrower) return;
      e.preventDefault();
      e.stopPropagation();                                 // don't also step through events
      self.setWidth(self.currentWidth() + (e.key === wider ? KEY_STEP : -KEY_STEP));
      self.save();
    });
  };

  SM.Reading = Reading;
})(window.SM = window.SM || {});
