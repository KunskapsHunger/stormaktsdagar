// In-page director for the Stormaktsdagar short: layout modes, camera, captions, end card.
// Injected into the running app by capture.cjs; every visual is driven from scene time t (seconds).
(function () {
  "use strict";
  var A = (window.__ad = {});
  var App = function () { return window.SM.App; };

  // A route animation frame can fire after its route was cleared (map.js step() touches a null
  // routeHead). A real browser just logs it; under the fake clock it would abort runFor().
  var raf = window.requestAnimationFrame;
  window.requestAnimationFrame = function (cb) {
    return raf(function (ts) { try { cb(ts); } catch (e) { console.warn("[raf]", e.message); } });
  };

  var css = `
  html[data-ad] body { overflow: hidden; }
  html[data-ad] .map-controls, html[data-ad] .legend, html[data-ad] .read-tools { display: none !important; }

  /* full-bleed map */
  html[data-ad="map"] .masthead, html[data-ad="map"] .timeline, html[data-ad="map"] .panel { display: none !important; }
  html[data-ad="map"] .app { display: block; height: 100svh; }
  html[data-ad="map"] .map-wrap { height: 100svh; }

  /* map + real timeline */
  html[data-ad="map-time"] .masthead, html[data-ad="map-time"] .panel { display: none !important; }
  html[data-ad="map-time"] .app { display: flex; flex-direction: column; height: 100svh; }
  html[data-ad="map-time"] .map-wrap { flex: 1 1 auto; height: auto; min-height: 0; }
  html[data-ad="map-time"] .timeline { position: static; }

  /* map on top, event card below (optionally with the masthead) */
  html[data-ad^="split"] .timeline { display: none !important; }
  html[data-ad="split"] .masthead { display: none !important; }
  html[data-ad^="split"] .app { display: flex; flex-direction: column; height: 100svh; }
  html[data-ad^="split"] .map-wrap { flex: 0 0 auto; height: 40svh; min-height: 0; }
  html[data-ad="split-head"] .map-wrap { height: 30svh; }
  html[data-ad^="split"] .panel { flex: 1 1 auto; min-height: 0; overflow: hidden; padding-top: 14px; }
  html[data-ad^="split"] .chapter-head { display: none; }

  #ad-ov { position: fixed; inset: 0; z-index: 99999; pointer-events: none; font-family: "Alegreya", Georgia, serif; }
  #ad-ov .cap { position: absolute; left: 20px; right: 20px; display: flex; flex-direction: column; align-items: center; gap: 6px; text-align: center; }
  #ad-ov .ln { display: inline-block; font: 700 31px/1.08 "Alegreya", Georgia, serif; color: #28231c;
    background: #f1ede3; padding: 6px 13px 8px; border-radius: 8px; letter-spacing: -.005em;
    box-shadow: 0 2px 0 rgba(40,35,28,.08), 0 14px 30px -12px rgba(40,35,28,.55); will-change: transform, opacity; }
  #ad-ov .ln.hl { background: #9c7418; color: #fbf6ea; }
  #ad-ov .ln.blue { background: #2e5a87; color: #fbf6ea; }
  #ad-ov .ln.red { background: #a63f35; color: #fbf6ea; }
  #ad-ov .ln.big { font-size: 40px; }
  #ad-ov .ln.sub { font: 600 17px/1.2 "Alegreya Sans", system-ui, sans-serif; background: rgba(40,35,28,.86); color: #f1ede3; padding: 7px 12px; letter-spacing: .01em; }
  #ad-ov .ln.ar { font-family: "Amiri", serif; }
  #ad-ov .scrim { position: absolute; inset: 0; }
  #ad-ov .flash { position: absolute; inset: 0; background: #f1ede3; opacity: 0; }
  #ad-ov .tap { position: absolute; width: 46px; height: 46px; margin: -23px 0 0 -23px; border-radius: 50%;
    border: 3px solid #f1ede3; background: rgba(40,35,28,.25); box-shadow: 0 0 0 2px rgba(40,35,28,.35); opacity: 0; }

  #ad-ov .end { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0; text-align: center; padding: 0 26px 70px; }
  #ad-ov .end > * { will-change: transform, opacity; }
  #ad-ov .end .crowns { font-size: 34px; color: #9c7418; letter-spacing: 6px; }
  #ad-ov .end .name { font: 400 50px/1 "IM Fell English", Georgia, serif; color: #28231c; margin-top: 6px; letter-spacing: -.01em; }
  #ad-ov .end .rule { width: 140px; height: 2px; background: #9c7418; margin: 16px 0 14px; transform-origin: center; }
  #ad-ov .end .tag { font: italic 400 21px/1.3 "Alegreya", Georgia, serif; color: #3d362c; max-width: 290px; }
  #ad-ov .end .stats { display: flex; gap: 12px; margin-top: 24px; }
  #ad-ov .end .stat { background: #f1ede3; border: 1px solid #c4b99f; border-radius: 10px; padding: 9px 4px 8px; width: 88px; box-shadow: 0 10px 22px -14px rgba(40,35,28,.6); }
  #ad-ov .end .stat b { display: block; font: 400 30px/1 "IM Fell English", Georgia, serif; color: #2e5a87; }
  #ad-ov .end .stat span { font: 600 13px/1.2 "Alegreya Sans", system-ui, sans-serif; color: #5a5144; text-transform: uppercase; letter-spacing: .06em; }
  #ad-ov .end .cta { margin-top: 26px; font: 700 20px/1 "Alegreya Sans", system-ui, sans-serif; color: #f1ede3; background: #28231c; border-radius: 999px; padding: 15px 24px; display: inline-flex; gap: 10px; align-items: center; box-shadow: 0 14px 28px -12px rgba(40,35,28,.7); }
  #ad-ov .end .cta i { font-style: normal; color: #c9a54a; }
  #ad-ov .end .fine { margin-top: 14px; font: 500 14px/1.3 "Alegreya Sans", system-ui, sans-serif; color: #5a5144; }
  `;
  var st = document.createElement("style");
  st.textContent = css;
  document.head.appendChild(st);
  var ov = document.createElement("div");
  ov.id = "ad-ov";
  ov.dir = "ltr";
  document.body.appendChild(ov);

  // ---------- easing ----------
  var clamp = function (x) { return Math.max(0, Math.min(1, x)); };
  var outCubic = function (u) { return 1 - Math.pow(1 - u, 3); };
  var inOut = function (u) { return u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };
  var outBack = function (u) { var c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(u - 1, 3) + c1 * Math.pow(u - 1, 2); };
  A.ease = { outCubic: outCubic, inOut: inOut };

  // ---------- layout / app control ----------
  A.mode = function (m) {
    document.documentElement.setAttribute("data-ad", m);
    window.dispatchEvent(new Event("resize"));
    App().map.resize();
  };
  A.go = function (id, opt) {
    var ev = SM.data.byId[id];
    if (!ev) throw new Error("no event " + id);
    // a hard cut shows the new year at once instead of counting towards it
    document.getElementById("yp-year").textContent = String(ev.year);
    App().go(ev.index, opt || { instant: true });
  };
  A.cam = function (lon, lat, k) {
    var m = App().map, p = m.project(lon, lat);
    if (m.anim) cancelAnimationFrame(m.anim);
    m.animating = false;
    m.cam = { x: p[0], y: p[1], k: k };
    m.applyCam(true);
  };
  A.lang = function (l) {
    var b = document.querySelector('.lang button[data-lang="' + l + '"]');
    if (b) b.click();
  };
  A.scrollPanelToEvent = function (offset) {
    // the chapter head is hidden in split modes, so the event card sits at the top
    var panel = document.getElementById("panel");
    panel.scrollTop = 0;
    window.scrollTo(0, 0);
  };
  // drive the narrator UI as if the clip were playing (audio itself is mixed in afterwards)
  A.narration = function (sec, playing) {
    var n = App().narrator;
    if (!n.__fake) {
      var real = n.audio;
      real.pause();
      n.audio = { paused: true, ended: false, currentTime: 0, duration: NaN, src: "x",
        play: function () { return Promise.resolve(); }, pause: function () {}, removeAttribute: function () {}, addEventListener: function () {} };
      n.__fake = true;
    }
    n.audio.paused = !playing;
    n.audio.currentTime = sec;
    n.audio.duration = n.ui ? n.ui.dur : 60;
    n.sync();
  };

  // ---------- captions ----------
  // spec: { y: "18%", lines: [{ text, at, cls }], out: seconds | null }
  var cur = null;
  A.captions = function (specs) {
    ov.textContent = "";
    cur = { specs: specs || [], nodes: [] };
    cur.specs.forEach(function (s) {
      var box = document.createElement("div");
      box.className = "cap";
      box.style.top = s.y || "18%";
      var lines = s.lines.map(function (l) {
        var d = document.createElement("div");
        d.className = "ln " + (l.cls || "");
        if (l.html) d.innerHTML = l.html; else d.textContent = l.text;
        if (l.dir) d.dir = l.dir;
        box.appendChild(d);
        return d;
      });
      ov.appendChild(box);
      cur.nodes.push({ box: box, lines: lines });
    });
    var extra = document.createElement("div");
    extra.className = "flash";
    ov.appendChild(extra);
    cur.flash = extra;
    var tap = document.createElement("div");
    tap.className = "tap";
    ov.appendChild(tap);
    cur.tap = tap;
  };
  A.tick = function (t, opt) {
    opt = opt || {};
    if (!cur) return;
    cur.specs.forEach(function (s, i) {
      var n = cur.nodes[i];
      var outU = s.out != null ? clamp((t - s.out) / 0.22) : 0;
      s.lines.forEach(function (l, j) {
        var u = clamp((t - l.at) / 0.34);
        var e = outBack(u);
        var node = n.lines[j];
        node.style.opacity = String(clamp(u * 2.2) * (1 - outU));
        node.style.transform = "translateY(" + ((1 - e) * 26 - outU * 14).toFixed(2) + "px) scale(" + (0.9 + 0.1 * e).toFixed(4) + ") rotate(" + (l.rot || 0) + "deg)";
      });
    });
    // brief paper flash at the start of a scene (reads as a cut on the beat)
    var fl = opt.flash ? clamp(1 - t / 0.16) * 0.55 : 0;
    cur.flash.style.opacity = String(fl);
    if (opt.tap) {
      var tu = (t - opt.tap.at) / 0.5;
      cur.tap.style.left = opt.tap.x + "px";
      cur.tap.style.top = opt.tap.y + "px";
      cur.tap.style.opacity = tu < 0 || tu > 1 ? "0" : String(Math.sin(Math.PI * clamp(tu)));
      cur.tap.style.transform = "scale(" + (0.7 + 0.5 * clamp(tu)) + ")";
    }
  };

  // ---------- end card ----------
  A.endCard = function () {
    ov.textContent = "";
    cur = null;
    var scrim = document.createElement("div");
    scrim.className = "scrim";
    ov.appendChild(scrim);
    var end = document.createElement("div");
    end.className = "end";
    end.innerHTML =
      '<div class="crowns">♔♔♔</div>' +
      '<div class="name">Stormaktsdagar</div>' +
      '<div class="rule"></div>' +
      '<div class="tag">Sveriges historia 800–1721 – på en interaktiv karta</div>' +
      '<div class="stats"><div class="stat"><b>283</b><span>händelser</span></div><div class="stat"><b>11</b><span>kapitel</span></div><div class="stat"><b>3</b><span>språk</span></div></div>' +
      '<div class="cta">Utforska kartan <i>→</i></div>' +
      '<div class="fine">Direkt i webbläsaren · källor till varje händelse</div>';
    ov.appendChild(end);
    A._end = { scrim: scrim, parts: Array.prototype.slice.call(end.children) };
  };
  A.endTick = function (t) {
    var e = A._end;
    var s = inOut(clamp(t / 0.5));
    e.scrim.style.background = "radial-gradient(120% 80% at 50% 45%, rgba(241,237,227," + (0.93 * s).toFixed(3) + ") 0%, rgba(231,226,212," + (0.86 * s).toFixed(3) + ") 60%, rgba(222,215,197," + (0.8 * s).toFixed(3) + ") 100%)";
    var starts = [0.25, 0.35, 0.55, 0.62, 0.85, 1.15, 1.25];
    e.parts.forEach(function (p, i) {
      var u = clamp((t - starts[i]) / 0.4), k = outBack(u);
      p.style.opacity = String(clamp(u * 2));
      if (p.className === "rule") p.style.transform = "scaleX(" + outCubic(u) + ")";
      else if (p.className === "cta") {
        var pulse = t > 2.2 ? 1 + 0.035 * Math.sin((t - 2.2) * 6.2) : 1;
        p.style.transform = "translateY(" + ((1 - k) * 18).toFixed(2) + "px) scale(" + ((0.92 + 0.08 * k) * pulse).toFixed(4) + ")";
      } else p.style.transform = "translateY(" + ((1 - k) * 18).toFixed(2) + "px)";
    });
  };

  // ---------- deterministic CSS animations (driven by the virtual clock) ----------
  A.syncAnimations = function (vt) {
    document.getAnimations().forEach(function (a) {
      if (a.__v0 == null) a.__v0 = vt - (a.currentTime || 0);
      a.pause();
      a.currentTime = vt - a.__v0;
    });
  };
})();
