// Narrator: read-aloud for every event in the viewer's language (pre-generated MP3s in SM.audio,
// shape { eventId: { sv: {src, dur}, en: {...}, ar: {...} } }); falls back to Swedish.
// Renders a small player in the event card, can read automatically, and tells the app when
// a narration ends so playback can move on after the reading instead of after a timer.
(function (SM) {
  "use strict";
  var core = SM.core, i18n = core.i18n;
  var el = function (t, a, c) { return core.el(t, a, c); };
  var ICON_PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M8 5.5v13l11-6.5z"/></svg>';
  var ICON_PAUSE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z"/></svg>';
  var ICON_SPEAKER = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 9h4l5-4v14l-5-4H4z"/><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" d="M16 9.2a4 4 0 0 1 0 5.6M18.6 6.8a7.5 7.5 0 0 1 0 10.4"/></svg>';

  var fmt = function (s) {
    if (!isFinite(s) || s < 0) s = 0;
    var m = Math.floor(s / 60), r = Math.floor(s % 60);
    return m + ":" + (r < 10 ? "0" : "") + r;
  };

  function Narrator(opts) {
    this.opts = opts || {};
    this.clips = SM.audio || {};
    this.audio = new Audio();
    this.audio.preload = "none";
    this.ev = null;
    this.ui = null;
    this.auto = core.storage.get("autoRead") === "1";
    this.triedBlob = {};
    this.bindAudio();
  }

  // the clip for the current language, or the Swedish one as fallback
  Narrator.prototype.clip = function (ev) {
    var c = ev && this.clips[ev.id];
    if (!c) return null;
    var lang = i18n.lang;
    if (c[lang]) return { lang: lang, src: c[lang].src, dur: c[lang].dur };
    return c.sv ? { lang: "sv", src: c.sv.src, dur: c.sv.dur } : null;
  };
  Narrator.prototype.has = function (ev) { return !!this.clip(ev); };
  Narrator.prototype.isPlaying = function () { return !this.audio.paused && !this.audio.ended; };
  // playback should wait for the reading when this event is (or will be) narrated
  Narrator.prototype.willNarrate = function (ev) { return this.has(ev) && (this.auto || (this.ev === ev && this.isPlaying())); };

  Narrator.prototype.bindAudio = function () {
    var self = this, a = this.audio;
    ["play", "pause", "timeupdate", "loadedmetadata", "ended"].forEach(function (type) {
      a.addEventListener(type, function () { self.sync(); });
    });
    a.addEventListener("ended", function () { if (self.opts.onEnded) self.opts.onEnded(self.ev); });
    // Some sandboxes refuse media from relative URLs; retry once through fetch → blob.
    a.addEventListener("error", function () {
      var ev = self.ev;
      var clip = self.clip(ev);
      if (!ev || !clip || self.triedBlob[clip.src]) return;
      self.triedBlob[clip.src] = true;
      fetch(clip.src).then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.blob();
      }).then(function (b) {
        if (self.ev !== ev) return;
        a.src = URL.createObjectURL(b);
        return a.play();
      }).catch(function () { self.fail(); });
    });
  };

  Narrator.prototype.fail = function () {
    if (this.ui) this.ui.root.classList.add("failed");
    if (this.opts.onFail) this.opts.onFail(this.ev);
  };

  // Called on every event change: stop the old reading, maybe start the new one.
  Narrator.prototype.setEvent = function (ev) {
    var clip = this.clip(ev);
    var changed = this.ev !== ev;
    var srcChanged = changed || (clip && clip.src !== this.src);   // e.g. the language was switched
    var resume = !changed && srcChanged && this.isPlaying();       // keep reading in the new language
    if (srcChanged) {
      this.audio.pause();
      this.ev = ev;
      this.src = clip ? clip.src : null;
      if (clip) {
        this.audio.src = clip.src;
        this.audio.preload = "metadata";
      } else {
        this.audio.removeAttribute("src");
      }
    }
    if ((changed && this.auto && this.has(ev)) || resume) this.play();
  };

  Narrator.prototype.play = function () {
    var self = this;
    var p = this.audio.play();
    if (p && p.catch) p.catch(function (err) {
      // autoplay refused before any user gesture: fall back silently to timed playback
      if (err && err.name === "NotAllowedError") { if (self.opts.onFail) self.opts.onFail(self.ev); }
    });
  };
  Narrator.prototype.toggle = function () {
    if (this.isPlaying()) {
      this.audio.pause();
      if (this.opts.onUserPause) this.opts.onUserPause();
    } else this.play();
  };
  Narrator.prototype.setAuto = function (on) {
    this.auto = on;
    core.storage.set("autoRead", on ? "1" : "0");
  };

  // ---------- UI inside the event card ----------
  Narrator.prototype.renderPlayer = function (ev) {
    if (!this.has(ev)) { this.ui = null; return null; }
    var self = this, clip = this.clip(ev), t = i18n.t;
    var btn = el("button", { type: "button", class: "np-btn" });
    var label = el("span", { class: "np-label", text: clip.lang === i18n.lang ? t("listen") : t("listenSv") });
    var time = el("span", { class: "np-time", text: fmt(clip.dur) });
    var bar = el("input", { type: "range", class: "np-bar", min: "0", max: String(clip.dur || 60), step: "0.1", value: "0", id: "np-bar", "aria-label": t("narration") });
    bar.addEventListener("input", function () {
      if (!self.audio.src) return;
      try { self.audio.currentTime = parseFloat(bar.value); } catch (e) { /* not seekable yet */ }
    });
    btn.addEventListener("click", function () { self.toggle(); });
    var root = el("div", { class: "narrator", role: "group", "aria-label": t("narration") }, [btn, label, bar, time]);
    this.ui = { root: root, btn: btn, bar: bar, time: time, dur: clip.dur };
    this.sync();
    return root;
  };

  Narrator.prototype.sync = function () {
    var ui = this.ui, a = this.audio;
    if (!ui) return;
    var playing = this.isPlaying();
    ui.btn.innerHTML = playing ? ICON_PAUSE : ICON_PLAY;
    ui.btn.setAttribute("aria-label", i18n.t(playing ? "pauseAudio" : "listen"));
    ui.root.classList.toggle("playing", playing);
    var dur = isFinite(a.duration) && a.duration > 0 ? a.duration : ui.dur;
    ui.bar.max = String(dur || 60);
    ui.bar.value = String(a.currentTime || 0);
    ui.bar.style.setProperty("--p", ((a.currentTime || 0) / (dur || 1) * 100).toFixed(1) + "%");
    ui.time.textContent = a.currentTime > 0 ? fmt(a.currentTime) + " / " + fmt(dur) : fmt(dur);
  };

  Narrator.speakerIcon = ICON_SPEAKER;
  SM.Narrator = Narrator;
})(window.SM = window.SM || {});
