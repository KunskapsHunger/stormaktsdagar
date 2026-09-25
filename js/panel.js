// Reading panel (chapter, event card, sources, who ruled, Europe meanwhile) and dialogs.
(function (SM) {
  "use strict";
  var el = function (t, a, c) { return SM.core.el(t, a, c); };
  var i18n = SM.core.i18n;
  var t = function (k) { return i18n.t(k); };
  var tx = function (o) { return i18n.tx(o); };

  function formatSource(s) {
    var li = el("li");
    var parts = [];
    if (s.author) parts.push(document.createTextNode(s.author + ", "));
    parts.push(el("cite", { text: s.title }));
    var tail = [s.publisher, s.year].filter(Boolean).join(" ");
    if (tail) parts.push(document.createTextNode(" (" + tail + ")"));
    if (s.note) parts.push(document.createTextNode(", " + s.note));
    parts.forEach(function (p) { li.appendChild(p); });
    if (s.url) {
      li.appendChild(document.createTextNode(" · "));
      var host = s.url.replace(/^https?:\/\/(www\.)?/, "").split("/")[0];
      li.appendChild(el("a", { href: s.url, target: "_blank", rel: "noopener noreferrer", text: host, title: t("open") }));
    }
    return li;
  }

  function roleText(r) {
    var role = t("roles." + r.role);
    return role === "roles." + r.role ? r.role : role;
  }

  function Panel(root, opts) {
    this.root = root;
    this.opts = opts;
    this.chapterId = null;
  }

  Panel.prototype.render = function (ev) {
    var self = this, root = this.root, data = SM.data;
    root.textContent = "";
    var ch = ev.chapter;

    // chapter head
    var head = el("header", { class: "chapter-head" }, [
      el("span", { class: "eyebrow", text: t("chapter") + " " + (ch.index + 1) + " · " + ch.range[0] + "–" + ch.range[1] }),
      el("h2", { text: tx(ch.title) }),
    ]);
    var intro = el("details", { class: "chapter-intro" }, [el("summary", { text: "…" }), el("p", { text: tx(ch.intro) })]);
    intro.firstChild.textContent = t("inChapter") + " — " + ch.events.length + " " + t("events");
    if (this.chapterId !== ch.id) intro.open = true;
    head.appendChild(intro);
    root.appendChild(head);
    this.chapterId = ch.id;

    // the event card
    var art = el("article", { class: "event", "aria-labelledby": "ev-title" });
    art.appendChild(el("div", { class: "meta" }, [
      el("span", { class: "date", text: tx(ev.date) || String(ev.year) }),
      el("span", { class: "chip", "data-kind": ev.kind, text: t("kinds." + ev.kind) }),
      el("span", { class: "count", text: (ev.index + 1) + " " + t("of") + " " + data.events.length }),
    ]));
    art.appendChild(el("h3", { id: "ev-title", text: tx(ev.title) }));
    if (ev.where) art.appendChild(el("div", { class: "where", text: tx(ev.where) + (ev.loc ? "" : " · " + t("outside")) }));
    var player = this.opts.narrator && this.opts.narrator.renderPlayer(ev);
    if (player) art.appendChild(player);
    art.appendChild(el("p", { class: "text", text: tx(ev.text) }));
    if (ev.quote) {
      art.appendChild(el("figure", { class: "quote" }, [
        el("blockquote", { text: tx(ev.quote) }),
        el("figcaption", { text: "— " + ev.quote.src }),
      ]));
    }
    if (ev.why) art.appendChild(el("div", { class: "why" }, [el("b", { text: t("why") }), el("p", { text: tx(ev.why) })]));
    if (ev.critique) {
      var crit = el("details", { class: "crit", open: true }, [el("summary", { text: t("critique") }), el("p", { text: tx(ev.critique) })]);
      art.appendChild(crit);
    }
    if (ev.sources && ev.sources.length) {
      var ol = el("ol");
      ev.sources.forEach(function (s) { ol.appendChild(formatSource(s)); });
      art.appendChild(el("section", { class: "sources" }, [el("h4", { text: t("sources") }), ol]));
    }
    var prev = data.events[ev.index - 1], next = data.events[ev.index + 1];
    var pbtn = function (target, label, dir) {
      var b = el("button", { type: "button", disabled: !target }, [
        el("small", { text: label }),
        el("span", { text: target ? target.year + " · " + tx(target.title) : "—" }),
      ]);
      if (target) b.addEventListener("click", function () { self.opts.onSelect(target.index, dir); });
      return b;
    };
    art.appendChild(el("nav", { class: "pager" }, [pbtn(prev, t("prev"), -1), pbtn(next, t("next"), 1)]));
    root.appendChild(art);

    root.appendChild(this.renderRuler(ev));
    root.appendChild(this.renderList(ev, true));
    root.appendChild(this.renderList(ev, false));
    if (root.parentNode) root.parentNode.scrollTop = 0;
  };

  Panel.prototype.renderRuler = function (ev) {
    var sec = el("section", { class: "side-section ruler" }, [el("h4", { text: t("rulesSweden") + " · " + ev.year })]);
    var rs = SM.core.rulersAt(ev.t);
    if (!rs.length && !SM.core.unionAt(ev.t)) return el("div", { hidden: true });
    var main = rs.filter(function (r) { return !r.parallel; });
    var par = rs.filter(function (r) { return r.parallel; });
    main.concat(par).forEach(function (r) {
      var years = Math.floor(r.from) + "–" + Math.floor(r.to);
      var box = el("div", { class: "now" }, [
        el("span", { class: "name", text: tx(r.name) }),
        el("span", { class: "role", text: roleText(r) + (r.house ? " · " + tx(r.house) : "") + " · " + years + (r.approx ? " (c.)" : "") }),
      ]);
      if (r.note) box.appendChild(el("span", { class: "role", text: tx(r.note) }));
      sec.appendChild(box);
    });
    var u = SM.core.unionAt(ev.t);
    if (u) sec.appendChild(el("div", { class: "dk", text: t("unionStatus") + ": " + t("union." + u.status) + (u.note ? " — " + tx(u.note) : "") }));
    var dk = SM.core.danishRulerAt(ev.t);
    if (dk && ev.year >= 1340 && ev.year <= 1660) {
      sec.appendChild(el("div", { class: "dk", text: tx(SM.owners.denmark.name) + ": " + tx(dk.name) }));
    }
    return sec;
  };

  // europe=true: "Meanwhile in Europe" for this chapter; false: the chapter's own events
  Panel.prototype.renderList = function (ev, europe) {
    var self = this;
    var list = ev.chapter.events.filter(function (e) { return europe ? e.kind === "europe" : e.kind !== "europe"; });
    var sec = el("section", { class: "side-section meanwhile" }, [el("h4", { text: europe ? t("meanwhile") : t("inChapter") })]);
    if (!list.length) { sec.appendChild(el("p", { text: t("noEvents") })); return sec; }
    var ul = el("ul", { class: "mini-list" });
    list.forEach(function (e) {
      var title = el("span", { text: tx(e.title) });
      if (self.opts.narrator && self.opts.narrator.has(e)) {
        var ic = el("span", { class: "has-audio", title: t("hasAudio"), "aria-label": t("hasAudio") });
        ic.innerHTML = SM.Narrator.speakerIcon;
        title.appendChild(ic);
      }
      var b = el("button", { type: "button", "aria-current": e === ev ? "true" : null }, [
        el("span", { class: "y", text: String(e.year) }), title,
      ]);
      b.addEventListener("click", function () { self.opts.onSelect(e.index); });
      ul.appendChild(el("li", null, [b]));
    });
    sec.appendChild(ul);
    return sec;
  };

  // ---------- dialogs ----------
  function openDialog(title, body) {
    var dlg = document.getElementById("dlg");
    dlg.textContent = "";
    var close = el("button", { class: "btn-text", type: "button", text: t("close") });
    close.addEventListener("click", function () { dlg.close(); });
    dlg.appendChild(el("div", { class: "dlg-head" }, [el("h2", { text: title }), close]));
    dlg.appendChild(el("div", { class: "dlg-body" }, [body]));
    if (!dlg.dataset.bound) {
      dlg.dataset.bound = "1";
      dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
    }
    if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
  }

  Panel.prototype.openGlossary = function () {
    var items = (SM.glossary || []).slice().sort(function (a, b) { return tx(a.term).localeCompare(tx(b.term), i18n.lang); });
    var dl = el("dl", { class: "gloss" });
    items.forEach(function (g) {
      dl.appendChild(el("div", null, [el("dt", { text: tx(g.term) }), el("dd", { text: tx(g.def) })]));
    });
    openDialog(t("glossary"), dl);
  };

  Panel.prototype.openBibliography = function () {
    var self = this;
    var map = new Map();
    SM.data.events.forEach(function (ev) {
      (ev.sources || []).forEach(function (s) {
        var key = [s.author || "", s.title, s.url || ""].join("|").toLowerCase();
        var e = map.get(key) || { s: s, evs: [] };
        e.evs.push(ev);
        map.set(key, e);
      });
    });
    var entries = Array.from(map.values()).sort(function (a, b) {
      return (a.s.author || a.s.publisher || a.s.title).localeCompare(b.s.author || b.s.publisher || b.s.title, i18n.lang);
    });
    var wrap = el("div");
    var search = el("input", { class: "search", type: "search", id: "bib-search", placeholder: t("searchPlaceholder"), "aria-label": t("searchPlaceholder") });
    var ol = el("ol", { class: "biblio" });
    var count = el("p", { class: "uses", "aria-live": "polite" });
    var draw = function () {
      var q = search.value.trim().toLowerCase();
      var shown = 0;
      ol.textContent = "";
      entries.forEach(function (e) {
        var hay = [e.s.author, e.s.title, e.s.publisher].join(" ").toLowerCase() + " " + e.evs.map(function (v) { return tx(v.title).toLowerCase(); }).join(" ");
        if (q && hay.indexOf(q) < 0) return;
        var li = formatSource(e.s);
        var uses = el("div", { class: "uses" });
        e.evs.slice(0, 6).forEach(function (v, i) {
          var a = el("a", { href: "#" + v.id, text: v.year + " " + tx(v.title) });
          a.addEventListener("click", function (x) { x.preventDefault(); document.getElementById("dlg").close(); self.opts.onSelect(v.index); });
          if (i) uses.appendChild(document.createTextNode(" · "));
          uses.appendChild(a);
        });
        if (e.evs.length > 6) uses.appendChild(document.createTextNode(" · +" + (e.evs.length - 6)));
        li.appendChild(uses);
        ol.appendChild(li);
        shown++;
      });
      count.textContent = shown ? shown + " / " + entries.length + " · " + t("sources") : t("noResults");
    };
    search.addEventListener("input", draw);
    draw();
    wrap.appendChild(search);
    wrap.appendChild(count);
    wrap.appendChild(ol);
    openDialog(t("bibliography"), wrap);
  };

  Panel.prototype.openAbout = function () {
    var body = el("div");
    (t("aboutBody") || []).forEach(function (p) { body.appendChild(el("p", { text: p })); });
    body.appendChild(el("p", { class: "uses", text: t("keyboard") }));
    body.appendChild(el("p", { class: "uses", text: t("credits") }));
    openDialog(t("aboutTitle"), body);
  };

  SM.Panel = Panel;
})(window.SM = window.SM || {});
