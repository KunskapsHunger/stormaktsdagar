// Map view: engraved sea, hand-coloured realm borders, labels, event pins and routes.
(function (SM) {
  "use strict";

  var NS = "http://www.w3.org/2000/svg";
  var ZOOM_MIN = 0.85, ZOOM_MAX = 10;
  var UNION_OWNERS = { denmark: 1, norway: 1, erik: 1 };
  var STATUS_STYLE = { loose: "l", pledge: "p", occupied: "o", disputed: "d" };
  // the Nordic realms carry the story; other powers are washed more lightly
  var MAJOR = { sweden: 1, denmark: 1, norway: 1, svear: 1, gotar: 1, erik: 1, holstein: 1 };

  function svg(tag, attrs, parent) {
    var n = document.createElementNS(NS, tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { if (attrs[k] != null) n.setAttribute(k, attrs[k]); });
    if (parent) parent.appendChild(n);
    return n;
  }

  // van Wijk & Nuij smooth zoom (same maths as d3.interpolateZoom)
  function interpolateZoom(p0, p1) {
    var rho = Math.SQRT2, rho2 = 2, rho4 = 4;
    var ux0 = p0[0], uy0 = p0[1], w0 = p0[2], ux1 = p1[0], uy1 = p1[1], w1 = p1[2];
    var dx = ux1 - ux0, dy = uy1 - uy0, d2 = dx * dx + dy * dy, S, fn;
    if (d2 < 1e-12) {
      S = Math.log(w1 / w0) / rho;
      fn = function (t) { return [ux0 + t * dx, uy0 + t * dy, w0 * Math.exp(rho * t * S)]; };
    } else {
      var d1 = Math.sqrt(d2);
      var b0 = (w1 * w1 - w0 * w0 + rho4 * d2) / (2 * w0 * rho2 * d1);
      var b1 = (w1 * w1 - w0 * w0 - rho4 * d2) / (2 * w1 * rho2 * d1);
      var r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0);
      var r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
      S = (r1 - r0) / rho;
      fn = function (t) {
        var s = t * S, c0 = Math.cosh(r0);
        var u = w0 / (rho2 * d1) * (c0 * Math.tanh(rho * s + r0) - Math.sinh(r0));
        return [ux0 + u * dx, uy0 + u * dy, w0 * c0 / Math.cosh(rho * s + r0)];
      };
    }
    fn.duration = Math.max(500, Math.min(2600, Math.abs(S) * 1000 * rho / Math.SQRT2 * 0.9));
    return fn;
  }
  var ease = function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  var reducedMotion = function () { return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches; };

  // Catmull-Rom → cubic Bézier for smooth routes
  function smoothPath(pts) {
    if (pts.length < 2) return "";
    var d = "M" + pts[0][0].toFixed(1) + " " + pts[0][1].toFixed(1);
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      var c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      var c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += "C" + [c1, c2, p2].map(function (p) { return p[0].toFixed(1) + " " + p[1].toFixed(1); }).join(" ");
    }
    return d;
  }

  function MapView(container, opts) {
    this.el = container;
    this.opts = opts || {};
    this.geo = SM.geo;
    SM.projection.origin = this.geo.origin;
    this.W = this.geo.view[2];
    this.H = this.geo.view[3];
    this.cam = { x: this.W * 0.5, y: this.H * 0.47, k: 1 };
    this.t = 1000;
    this.state = {};
    this.build();
    this.bindInput();
    this.resize();
    var self = this;
    if (window.ResizeObserver) new ResizeObserver(function () { self.resize(); }).observe(container);
    else window.addEventListener("resize", function () { self.resize(); });
  }

  MapView.prototype.project = function (lon, lat) { return SM.projection.project(lon, lat); };

  MapView.prototype.build = function () {
    var g = this.geo, self = this;
    var root = svg("svg", { role: "img", "aria-label": SM.core.i18n.t("mapLabel"), direction: "ltr" });
    root.style.direction = "ltr";
    this.root = root;
    var defs = svg("defs", null, root);
    this.defs = defs;

    // geometry is defined once and reused through <use>
    svg("path", { id: "g-land", d: g.land }, defs);
    Object.keys(g.regions).forEach(function (id) {
      svg("path", { id: "rg-" + id, d: g.regions[id] }, defs);
      var cp = svg("clipPath", { id: "cp-" + id }, defs);
      svg("use", { href: "#rg-" + id }, cp);
    });
    this.buildPatterns(defs);

    svg("rect", { class: "m-sea", x: -5000, y: -5000, width: 20000, height: 20000 }, root);
    var cam = svg("g", { class: "cam" }, root);
    this.camG = cam;
    svg("path", { class: "m-grat", d: g.graticule }, cam);
    // copperplate water-lining: the coast repeated as fading contour strokes
    var wl = svg("g", { class: "waterlines" }, cam);
    this.waterlines = [[26, 0.10], [15, 0.16], [7, 0.26]].map(function (s) {
      var u = svg("use", { href: "#g-land", class: "m-waterline" }, wl);
      u.style.setProperty("--w", s[0]);
      u.style.strokeOpacity = s[1];
      return u;
    });
    svg("use", { href: "#g-land", class: "m-land" }, cam);

    var fills = svg("g", { class: "reg-fills" }, cam);
    var bands = svg("g", { class: "reg-bands" }, cam);
    this.bandsG = bands;
    var union = svg("g", { class: "union-layer" }, cam);
    var edges = svg("g", { class: "reg-edges" }, cam);
    this.regionEls = {};
    Object.keys(g.regions).forEach(function (id) {
      var f = svg("use", { href: "#rg-" + id, class: "reg-fill" }, fills);
      var b = svg("use", { href: "#rg-" + id, class: "reg-band", "clip-path": "url(#cp-" + id + ")" }, bands);
      var u = svg("use", { href: "#rg-" + id, class: "union-hatch" }, union);
      svg("use", { href: "#rg-" + id, class: "reg-edge" }, edges);
      u.style.opacity = 0;
      self.regionEls[id] = { fill: f, band: b, union: u };
    });
    svg("path", { class: "m-lakes", d: g.lakes }, cam);
    svg("path", { class: "m-rivers", d: g.rivers }, cam);
    this.bordersEl = svg("path", { class: "m-borders", d: g.borders }, cam);
    this.bordersEl.setAttribute("hidden", "");
    this.hlG = svg("g", { class: "highlights" }, cam);
    this.routeG = svg("g", { class: "routes" }, cam);
    this.labelG = svg("g", { class: "labels" }, cam);
    this.cityG = svg("g", { class: "cities" }, cam);
    this.pinG = svg("g", { class: "pins" }, cam);
    this.el.insertBefore(root, this.el.firstChild);
    this.buildLabels();
  };

  MapView.prototype.buildPatterns = function (defs) {
    var owners = Object.keys(SM.owners);
    var self = this;
    this.patterns = [];
    var mk = function (id, size, draw) {
      var p = svg("pattern", { id: id, patternUnits: "userSpaceOnUse", width: size, height: size }, defs);
      p.dataset.size = size;
      draw(p, size);
      self.patterns.push(p);
      return p;
    };
    owners.forEach(function (o) {
      var col = "var(--c-" + o + ")";
      // loose: sparse diagonal wash
      mk("pat-" + o + "-l", 10, function (p, s) {
        svg("rect", { width: s, height: s, style: "fill:" + col + ";fill-opacity:.14" }, p);
        svg("path", { d: "M0 " + s + "L" + s + " 0", style: "stroke:" + col + ";stroke-width:1.6;stroke-opacity:.75" }, p);
      });
      // pledge: dotted
      mk("pat-" + o + "-p", 9, function (p, s) {
        svg("rect", { width: s, height: s, style: "fill:" + col + ";fill-opacity:.2" }, p);
        svg("circle", { cx: s / 2, cy: s / 2, r: 1.8, style: "fill:" + col + ";fill-opacity:.9" }, p);
      });
      // occupied: dense diagonal hatch
      mk("pat-" + o + "-o", 7, function (p, s) {
        svg("rect", { width: s, height: s, style: "fill:" + col + ";fill-opacity:.18" }, p);
        svg("path", { d: "M0 " + s + "L" + s + " 0M-1 1L1 -1M" + (s - 1) + " " + (s + 1) + "L" + (s + 1) + " " + (s - 1), style: "stroke:" + col + ";stroke-width:2.2;stroke-opacity:.85" }, p);
      });
      // disputed: cross-hatch
      mk("pat-" + o + "-d", 10, function (p, s) {
        svg("rect", { width: s, height: s, style: "fill:" + col + ";fill-opacity:.12" }, p);
        svg("path", { d: "M0 " + s + "L" + s + " 0M0 0L" + s + " " + s, style: "stroke:" + col + ";stroke-width:1.2;stroke-opacity:.7" }, p);
      });
    });
    mk("pat-union", 12, function (p, s) {
      svg("path", { d: "M0 0L" + s + " " + s + "M-2 " + (s - 2) + "L2 " + (s + 2) + "M" + (s - 2) + " -2L" + (s + 2) + " 2", style: "stroke:var(--gold);stroke-width:1.5;stroke-opacity:.8" }, p);
    });
  };

  MapView.prototype.buildLabels = function () {
    var self = this;
    this.realmEls = (SM.realmLabels || []).concat(SM.unionLabel ? [Object.assign({ union: true }, SM.unionLabel)] : []).map(function (r) {
      var p = self.project(r.lon, r.lat);
      var gEl = svg("g", { class: "lbl-wrap" }, self.labelG);
      var cls = r.union ? "lbl lbl-union" : (/^[A-ZÅÄÖ–\- ]+$/.test(r.text.sv) ? "lbl lbl-realm" : "lbl lbl-land");
      var txt = svg("text", { class: cls, "dominant-baseline": "middle" }, gEl);
      if (r.owner) txt.style.fill = "color-mix(in srgb, var(--c-" + r.owner + ") " + (MAJOR[r.owner] ? 72 : 45) + "%, var(--ink))";
      return { data: r, g: gEl, text: txt, x: p[0], y: p[1] };
    });
    this.cityEls = (SM.places || []).map(function (c) {
      var p = self.project(c.lon, c.lat);
      var gEl = svg("g", { class: "city" }, self.cityG);
      svg("circle", { class: "city-dot" + (c.rank === 1 ? " cap" : ""), r: c.rank === 1 ? 3.2 : 2.4 }, gEl);
      var txt = svg("text", { class: "lbl lbl-city", "dominant-baseline": "middle" }, gEl);
      return { data: c, g: gEl, text: txt, x: p[0], y: p[1] };
    });
  };

  // ---------- camera ----------
  MapView.prototype.resize = function () {
    var r = this.el.getBoundingClientRect();
    this.cw = Math.max(1, r.width);
    this.ch = Math.max(1, r.height);
    this.root.setAttribute("viewBox", "0 0 " + this.cw + " " + this.ch);
    this.s0 = Math.min(this.cw / this.W, this.ch / this.H);
    this.applyCam(true);
  };
  MapView.prototype.scale = function () { return this.s0 * this.cam.k; };
  MapView.prototype.clampCam = function (c) {
    var k = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, c.k));
    return { x: Math.max(0, Math.min(this.W, c.x)), y: Math.max(0, Math.min(this.H, c.y)), k: k };
  };
  MapView.prototype.applyCam = function (full) {
    var s = this.scale(), c = this.cam;
    this.camG.setAttribute("transform", "translate(" + (this.cw / 2) + " " + (this.ch / 2) + ") scale(" + s + ") translate(" + (-c.x) + " " + (-c.y) + ")");
    var inv = 1 / s;
    var place = function (e) {
      if (e.g.style.display === "none") { e.stale = true; return; }
      e.stale = false;
      e.g.setAttribute("transform", "translate(" + e.x + " " + e.y + ") scale(" + inv + ")");
    };
    this.realmEls.forEach(place);
    this.cityEls.forEach(place);
    (this.pinEls || []).forEach(place);
    if (this.routeHead) place(this.routeHead);
    if (full || !this.animating) this.applyZoomDetail();
    else this.camG.style.setProperty("--inv", inv.toFixed(4));
  };
  // stroke widths and pattern sizes that should stay constant on screen
  MapView.prototype.applyZoomDetail = function () {
    var inv = 1 / this.scale();
    this.camG.style.setProperty("--inv", inv.toFixed(4));
    var tr = "scale(" + inv.toFixed(4) + ")";
    this.patterns.forEach(function (p) { p.setAttribute("patternTransform", tr); });
    this.updateLabelVisibility();
  };

  MapView.prototype.flyTo = function (target, instant) {
    var self = this;
    var to = this.clampCam(target);
    if (this.anim) cancelAnimationFrame(this.anim);
    if (instant || reducedMotion()) {
      this.cam = to;
      this.animating = false;
      this.applyCam(true);
      return;
    }
    var span = Math.max(this.cw, this.ch);
    var p0 = [this.cam.x, this.cam.y, span / this.scale()];
    var p1 = [to.x, to.y, span / (this.s0 * to.k)];
    var interp = interpolateZoom(p0, p1);
    var t0 = performance.now();
    this.animating = true;
    var step = function (now) {
      var u = Math.min(1, (now - t0) / interp.duration);
      var p = interp(ease(u));
      self.cam = { x: p[0], y: p[1], k: span / p[2] / self.s0 };
      self.applyCam(false);
      if (u < 1) self.anim = requestAnimationFrame(step);
      else { self.animating = false; self.cam = to; self.applyCam(true); }
    };
    this.anim = requestAnimationFrame(step);
  };

  MapView.prototype.focusOn = function (ev, instant) {
    var k = ev.zoom ? [1, 1, 1.7, 2.6, 4, 6, 8.5][ev.zoom] : 2.2;
    if (ev.loc) {
      var p = this.project(ev.loc[0], ev.loc[1]);
      // keep the pin clear of the year plate in the upper corner
      var yShift = (this.ch * 0.06) / (this.s0 * k);
      this.flyTo({ x: p[0], y: p[1] - yShift, k: k }, instant);
    } else if (ev.regions && ev.regions.some(function (id) { return SM.geo.bbox[id]; })) {
      var b = this.regionBBox(ev.regions);
      var kk = Math.min(6, 0.8 * Math.min(this.cw / (b[2] - b[0] + 1) , this.ch / (b[3] - b[1] + 1)) / this.s0);
      this.flyTo({ x: (b[0] + b[2]) / 2, y: (b[1] + b[3]) / 2, k: kk }, instant);
    } else {
      this.home(instant);
    }
  };
  MapView.prototype.regionBBox = function (ids) {
    var bb = this.geo.bbox;
    return ids.filter(function (id) { return bb[id]; }).reduce(function (a, id) {
      var b = bb[id];
      return b ? [Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[2], b[2]), Math.max(a[3], b[3])] : a;
    }, [Infinity, Infinity, -Infinity, -Infinity]);
  };
  MapView.prototype.home = function (instant) {
    var p = this.project(17, 59.2);
    this.flyTo({ x: p[0], y: p[1], k: 1.15 }, instant);
  };
  MapView.prototype.zoomBy = function (f) {
    this.flyTo({ x: this.cam.x, y: this.cam.y, k: this.cam.k * f });
  };

  // ---------- pointer input: drag, wheel, pinch ----------
  MapView.prototype.bindInput = function () {
    var self = this, root = this.root;
    var pointers = new Map(), last = null, pinch0 = null;
    var toWorld = function (px, py) {
      var r = root.getBoundingClientRect(), s = self.scale();
      return [self.cam.x + (px - r.left - self.cw / 2) / s, self.cam.y + (py - r.top - self.ch / 2) / s];
    };
    var zoomAt = function (px, py, k) {
      var w = toWorld(px, py);
      var k2 = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, k));
      var r = root.getBoundingClientRect(), s2 = self.s0 * k2;
      self.cam = self.clampCam({ x: w[0] - (px - r.left - self.cw / 2) / s2, y: w[1] - (py - r.top - self.ch / 2) / s2, k: k2 });
      self.applyCam(true);
    };
    root.addEventListener("wheel", function (e) {
      e.preventDefault();
      if (self.anim) { cancelAnimationFrame(self.anim); self.animating = false; }
      zoomAt(e.clientX, e.clientY, self.cam.k * Math.exp(-e.deltaY * (e.deltaMode ? 0.05 : 0.0018)));
      self.userMoved();
    }, { passive: false });
    root.addEventListener("pointerdown", function (e) {
      if (e.target.closest && e.target.closest(".pin")) return;
      root.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId, [e.clientX, e.clientY]);
      last = [e.clientX, e.clientY];
      if (self.anim) { cancelAnimationFrame(self.anim); self.animating = false; }
      if (pointers.size === 2) {
        var pts = Array.from(pointers.values());
        pinch0 = { d: Math.hypot(pts[0][0] - pts[1][0], pts[0][1] - pts[1][1]), k: self.cam.k };
      }
      root.classList.add("dragging");
    });
    root.addEventListener("pointermove", function (e) {
      if (!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, [e.clientX, e.clientY]);
      if (pointers.size === 2 && pinch0) {
        var pts = Array.from(pointers.values());
        var d = Math.hypot(pts[0][0] - pts[1][0], pts[0][1] - pts[1][1]);
        zoomAt((pts[0][0] + pts[1][0]) / 2, (pts[0][1] + pts[1][1]) / 2, pinch0.k * d / pinch0.d);
      } else if (pointers.size === 1 && last) {
        var s = self.scale();
        self.cam = self.clampCam({ x: self.cam.x - (e.clientX - last[0]) / s, y: self.cam.y - (e.clientY - last[1]) / s, k: self.cam.k });
        last = [e.clientX, e.clientY];
        self.applyCam(false);
      }
      self.userMoved();
    });
    var end = function (e) {
      pointers.delete(e.pointerId);
      if (pointers.size < 2) pinch0 = null;
      if (pointers.size === 0) { root.classList.remove("dragging"); last = null; self.applyZoomDetail(); }
      else last = Array.from(pointers.values())[0];
    };
    root.addEventListener("pointerup", end);
    root.addEventListener("pointercancel", end);
    root.addEventListener("dblclick", function (e) { zoomAt(e.clientX, e.clientY, self.cam.k * 1.8); });
  };
  MapView.prototype.userMoved = function () { if (this.opts.onUserMove) this.opts.onUserMove(); };

  // ---------- time state ----------
  MapView.prototype.setTime = function (t) {
    this.t = t;
    var terr = SM.core.territoryAt(t);
    var union = SM.core.unionAt(t);
    var inUnion = t >= 1389 && t < 1523.43;
    var swedeInUnion = union && (union.status === "union" || union.status === "forming" || union.status === "contested");
    var self = this;
    Object.keys(this.regionEls).forEach(function (id) {
      var st = terr[id] || { owner: null, status: "core" };
      var els = self.regionEls[id];
      var prev = self.state[id];
      if (!prev || prev.owner !== st.owner || prev.status !== st.status) {
        if (!st.owner) {
          els.fill.style.fill = "transparent";
          els.band.style.stroke = "transparent";
        } else if (st.status === "core") {
          els.fill.style.fill = "var(--c-" + st.owner + ")";
          els.fill.style.fillOpacity = MAJOR[st.owner] ? "var(--wash)" : "var(--wash-minor)";
          els.band.style.stroke = "var(--c-" + st.owner + ")";
          els.band.style.strokeOpacity = MAJOR[st.owner] ? "var(--band-op)" : "var(--band-op-minor)";
        } else {
          els.fill.style.fill = "url(#pat-" + st.owner + "-" + STATUS_STYLE[st.status] + ")";
          els.fill.style.fillOpacity = 1;
          els.band.style.stroke = "var(--c-" + st.owner + ")";
          els.band.style.strokeOpacity = st.status === "loose" ? 0.35 : 0.55;
        }
      }
      var u = inUnion && st.owner && (UNION_OWNERS[st.owner] || (st.owner === "sweden" && swedeInUnion));
      els.union.style.opacity = u ? (union && union.status === "forming" ? 0.3 : 0.55) : 0;
    });
    this.state = terr;
    this.updateLabelVisibility();
    return terr;
  };

  MapView.prototype.setLang = function () {
    var tx = SM.core.i18n.tx, lang = SM.core.i18n.lang;
    this.root.setAttribute("aria-label", SM.core.i18n.t("mapLabel"));
    this.realmEls.forEach(function (e) {
      e.text.textContent = tx(e.data.text);
      e.baseSize = (e.data.union ? 19 : 17) * e.data.size * (lang === "ar" ? 1.15 : 1);
    });
    this.cityEls.forEach(function (e) {
      e.text.textContent = tx(e.data.name);
      var rtl = lang === "ar";
      e.text.setAttribute("x", rtl ? -6 : 6);
      e.text.setAttribute("text-anchor", rtl ? "end" : "start");
      e.text.style.fontSize = rtl ? "14px" : "";
    });
    this.renderPins(this.pinEvents || [], this.currentEvent);
    this.updateLabelVisibility();
  };

  MapView.prototype.placeOne = function (e) {
    e.stale = false;
    e.g.setAttribute("transform", "translate(" + e.x + " " + e.y + ") scale(" + (1 / this.scale()) + ")");
  };
  MapView.prototype.updateLabelVisibility = function () {
    var t = this.t, k = this.cam.k, self = this;
    var labelScale = Math.min(1.9, Math.max(0.8, Math.pow(k, 0.35)));
    this.realmEls.forEach(function (e) {
      var on = e.data.from <= t && t < e.data.to && !(e.data.size < 0.7 && k < 1.5);
      e.g.style.display = on ? "" : "none";
      if (on) e.text.style.fontSize = (e.baseSize * labelScale).toFixed(1) + "px";
      if (on && e.stale) self.placeOne(e);
    });
    var maxRank = k < 1.6 ? 1 : k < 2.6 ? 2 : 3;
    this.cityEls.forEach(function (e) {
      var d = e.data;
      var on = d.from <= t && t < d.to && d.rank <= maxRank;
      e.g.style.display = on ? "" : "none";
      if (on && e.stale) self.placeOne(e);
    });
    this.declutter();
  };

  // Hide city names that would collide with the current event label, realm names or a more
  // important city (the dots stay). Runs after camera moves, not per animation frame.
  MapView.prototype.declutter = function () {
    var s = this.scale(), cam = this.cam, cw = this.cw, ch = this.ch;
    var rtl = SM.core.i18n.lang === "ar";
    var sx = function (x) { return (x - cam.x) * s + cw / 2; };
    var sy = function (y) { return (y - cam.y) * s + ch / 2; };
    var boxes = [];
    var hits = function (b) {
      for (var i = 0; i < boxes.length; i++) {
        var o = boxes[i];
        if (b[0] < o[2] && b[2] > o[0] && b[1] < o[3] && b[3] > o[1]) return true;
      }
      return false;
    };
    var ev = this.currentEvent;
    var pin = null;
    if (ev && ev.loc) {
      var p = this.project(ev.loc[0], ev.loc[1]);
      pin = [sx(p[0]), sy(p[1])];
      var w = (SM.core.i18n.tx(ev.where) || "").length * 7.2;
      boxes.push(rtl ? [pin[0] - 14 - w, pin[1] - 11, pin[0] + 10, pin[1] + 9] : [pin[0] - 10, pin[1] - 11, pin[0] + 14 + w, pin[1] + 9]);
    }
    this.realmEls.forEach(function (e) {
      if (e.g.style.display === "none") return;
      var fs = parseFloat(e.text.style.fontSize) || 16;
      var w = e.text.textContent.length * fs * (rtl ? 0.55 : 0.95);
      var x = sx(e.x), y = sy(e.y);
      boxes.push([x - w / 2, y - fs * 0.6, x + w / 2, y + fs * 0.6]);
    });
    var cities = this.cityEls.filter(function (e) { return e.g.style.display !== "none"; })
      .sort(function (a, b) { return a.data.rank - b.data.rank; });
    cities.forEach(function (e) {
      var x = sx(e.x), y = sy(e.y);
      var w = e.text.textContent.length * (rtl ? 6 : 6.6);
      var box = rtl ? [x - 8 - w, y - 8, x + 3, y + 8] : [x - 3, y - 8, x + 8 + w, y + 8];
      var nearPin = pin && Math.abs(pin[0] - x) < 16 && Math.abs(pin[1] - y) < 16;
      var hide = nearPin || hits(box);
      e.text.style.display = hide ? "none" : "";
      if (!hide) boxes.push(box);
    });
  };

  MapView.prototype.showBorders = function (on) {
    if (on) this.bordersEl.removeAttribute("hidden"); else this.bordersEl.setAttribute("hidden", "");
  };

  // ---------- highlights, pins, routes ----------
  MapView.prototype.highlight = function (ids) {
    var g = this.hlG;
    while (g.firstChild) g.removeChild(g.firstChild);
    (ids || []).forEach(function (id) {
      if (SM.geo.regions[id]) svg("use", { href: "#rg-" + id, class: "reg-hl" }, g);
    });
  };

  MapView.prototype.renderPins = function (events, current) {
    var self = this, tx = SM.core.i18n.tx;
    this.pinEvents = events;
    this.currentEvent = current;
    var g = this.pinG;
    while (g.firstChild) g.removeChild(g.firstChild);
    this.pinEls = [];
    var list = events.filter(function (ev) { return ev.loc; });
    // current pin last so it draws on top
    list.sort(function (a, b) { return (a === current) - (b === current); });
    list.forEach(function (ev) {
      var p = self.project(ev.loc[0], ev.loc[1]);
      var isCur = ev === current;
      var gEl = svg("g", {
        class: "pin" + (ev.kind === "europe" ? " europe" : "") + (isCur ? " current" : ""),
        tabindex: "0", role: "button", "aria-current": isCur ? "true" : null,
        "aria-label": ev.year + " – " + tx(ev.title),
      }, g);
      var col = "var(--kind-" + ev.kind + ")";
      if (isCur) {
        var ring = svg("circle", { class: "ring", r: 7 }, gEl);
        ring.style.stroke = col;
      }
      var dot = svg("circle", { class: "dot", r: isCur ? 7 : 4.5 }, gEl);
      dot.style.fill = col;
      if (isCur) {
        var lbl = svg("text", { class: "pin-label", x: 12, y: 4 }, gEl);
        if (SM.core.i18n.lang === "ar") { lbl.setAttribute("x", -12); lbl.setAttribute("text-anchor", "end"); }
        lbl.textContent = tx(ev.where) || "";
      }
      var t = svg("title", null, gEl);
      t.textContent = ev.year + " – " + tx(ev.title);
      var go = function () { if (self.opts.onPin) self.opts.onPin(ev); };
      gEl.addEventListener("click", go);
      gEl.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
      self.pinEls.push({ g: gEl, x: p[0], y: p[1] });
    });
    this.applyCam(false);
    this.declutter();
  };

  MapView.prototype.showRoute = function (id) {
    var g = this.routeG, self = this;
    while (g.firstChild) g.removeChild(g.firstChild);
    this.routeHead = null;
    var r = id && SM.routes && SM.routes[id];
    if (!r) return;
    var pts = r.points.map(function (p) { return self.project(p[0], p[1]); });
    var d = smoothPath(pts);
    svg("path", { class: "m-route-halo", d: d }, g);
    var path = svg("path", { class: "m-route", d: d }, g);
    var len = path.getTotalLength ? path.getTotalLength() : 0;
    var headG = svg("g", null, g);
    svg("circle", { class: "m-route-head", r: 5 }, headG);
    this.routeHead = { g: headG, x: pts[pts.length - 1][0], y: pts[pts.length - 1][1] };
    if (!len || reducedMotion()) { this.applyCam(false); return; }
    // draw the route progressively; the dash pattern is in screen units because of non-scaling stroke
    var t0 = performance.now(), dur = Math.min(4200, 1400 + len * 1.5);
    var step = function (now) {
      var u = Math.min(1, (now - t0) / dur), e = ease(u);
      var pt = path.getPointAtLength(len * e);
      self.routeHead.x = pt.x; self.routeHead.y = pt.y;
      var sub = len * e;
      path.setAttribute("stroke-dasharray", sub + " " + (len + 10));
      g.firstChild.setAttribute("stroke-dasharray", sub + " " + (len + 10));
      headG.setAttribute("transform", "translate(" + pt.x + " " + pt.y + ") scale(" + (1 / self.scale()) + ")");
      if (u < 1 && self.routeG.contains(path)) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  SM.MapView = MapView;
})(window.SM = window.SM || {});
