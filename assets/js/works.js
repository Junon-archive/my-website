/* ==========================================================================
   works.js — everything driven by window.WORKS (assets/js/works-data.js)
              cards, filters, resume lists, detail meta / pager / figures
              (02-information-architecture.md §4, 04 §1–3, 05 §1–5)

   Public API
     window.works.sortedWorks()                    -> sorted copy of WORKS
     window.works.byId(id)                         -> work | null
     window.works.renderCards(container, opts)     -> rendered works
         opts = { filter:"all|project|research", featuredOnly:bool,
                  limit:number, layout:"grid"|"wide" }
     window.works.render()                         re-runs every auto hook

   Declarative markup hooks (all optional)
     LIST PAGES
       [data-works="all|project|research"]         card container
         data-works-layout="grid|wide"
         data-works-featured                       projects with featured:true only
         data-works-limit="4"
       [data-filter="all|project|research"]        filter button (portfolio)
     RESUME
       [data-resume-research]   [data-resume-projects]
     DETAIL PAGES  (driven by body[data-work-id] / body[data-work-type])
       [data-work-badges] [data-work-tags] [data-work-meta]
       [data-work-stack]  [data-work-artifacts] [data-work-pager]
       [data-results]                             chart target (figures.js)
       [data-evidence="0"]                        figure.evidence target
       [data-validation]                          removed when a chart exists
       [data-illus="<id>.<scene>"]                handed to window.Illus.render
   ========================================================================== */
(function (window, document) {
  "use strict";

  var SVG_NS = "http://www.w3.org/2000/svg";

  var ICONS = {
    code: 'M6 12 2 8l4-4M10 4l4 4-4 4',
    pdf:  'M8 2v8M4.5 7.5 8 11l3.5-3.5M3 13h10',
    link: 'M6 10 12 4M8 4h4v4'
  };

  /* ---------- tiny DOM helpers ------------------------------------------- */

  function h(tag, attrs, children) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) if (attrs[k] !== null && attrs[k] !== undefined) {
      if (k === "text") e.textContent = attrs[k];
      else if (k === "class") e.className = attrs[k];
      else e.setAttribute(k, attrs[k]);
    }
    (children || []).forEach(function (c) { if (c) e.appendChild(c); });
    return e;
  }

  function icon(kind) {
    var s = document.createElementNS(SVG_NS, "svg");
    s.setAttribute("viewBox", "0 0 16 16");
    s.setAttribute("fill", "none");
    s.setAttribute("stroke", "currentColor");
    s.setAttribute("stroke-width", "1.6");
    s.setAttribute("aria-hidden", "true");
    var p = document.createElementNS(SVG_NS, "path");
    p.setAttribute("d", ICONS[kind] || ICONS.link);
    s.appendChild(p);
    return s;
  }

  function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); }

  function remove(el) { if (el && el.parentNode) el.parentNode.removeChild(el); }

  function tr(key, fallbackText) {
    var v = typeof window.t === "function" ? window.t(key) : "";
    return v || fallbackText || "";
  }

  /* ---------- data -------------------------------------------------------- */

  function all() { return (window.WORKS || []).slice(); }

  function compare(a, b) {
    if (a.type !== b.type) return a.type === "project" ? -1 : 1;
    var ap = a.status === "in-progress", bp = b.status === "in-progress";
    if (ap !== bp) return ap ? -1 : 1;
    var ad = a.date || "", bd = b.date || "";
    if (ad === bd) return 0;
    return ad < bd ? 1 : -1;   /* date descending, YYYY.MM string compare */
  }

  function sortedWorks() { return all().sort(compare); }

  function byId(id) {
    var list = all();
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  function select(opts) {
    opts = opts || {};
    var list = sortedWorks();
    if (opts.filter && opts.filter !== "all") {
      list = list.filter(function (w) { return w.type === opts.filter; });
    }
    if (opts.featuredOnly) list = list.filter(function (w) { return !!w.featured; });
    if (opts.limit) list = list.slice(0, opts.limit);
    return list;
  }

  /* ---------- illustrations ---------------------------------------------- */

  function renderIllus(root) {
    var nodes = (root || document).querySelectorAll("[data-illus]");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el.getAttribute("data-illus-done")) continue;
      if (!window.Illus || typeof window.Illus.render !== "function") continue;
      try {
        window.Illus.render(el);
        el.setAttribute("data-illus-done", "1");
      } catch (e) { /* a missing scene must never break the page */ }
    }
  }

  /* ---------- cards ------------------------------------------------------- */

  function thumb(w) {
    if (!w.illus || !w.illus.thumb) return null;
    return h("span", {
      "class": "thumb",
      "data-illus": w.id + "." + w.illus.thumb,
      role: "img",
      "aria-label": (w.illus && w.illus.alt) || tr("work_" + w.id + "_title", w.id)
    });
  }

  function cardTop(w) {
    var kids = [];
    kids.push(h("span", {
      "class": "badge " + w.type,
      "data-lang": "badge_" + w.type,
      text: w.type === "research" ? "Research" : "Project"
    }));
    if (w.status === "in-progress") {
      kids.push(h("span", { "class": "badge progress", "data-lang": "badge_progress", text: "In progress" }));
    } else if (w.date) {
      kids.push(h("span", { "class": "date", text: w.date }));
    }
    return h("div", { "class": "card-top" }, kids);
  }

  function cardBody(w) {
    var kids = [cardTop(w)];
    kids.push(h("h3", { "data-lang": "work_" + w.id + "_title", text: w.id }));
    kids.push(h("p", { "class": "desc", "data-lang": "work_" + w.id + "_sub", text: "" }));
    if (w.keyfact) kids.push(h("div", { "class": "keyfact", text: w.keyfact }));
    if (w.tags && w.tags.length) {
      kids.push(h("div", { "class": "tagrow" }, w.tags.slice(0, 5).map(function (t) {
        return h("span", { "class": "tag", text: t });
      })));
    }
    return kids;
  }

  function card(w, layout) {
    var wide = layout === "wide";
    var a = h("a", {
      "class": "card" + (wide ? " wide" : ""),
      href: w.href || (w.type + "_" + w.id + ".html"),
      "data-work-id": w.id,
      "data-type": w.type
    });
    var t = thumb(w);
    if (wide) {
      a.appendChild(h("div", null, cardBody(w)));
      if (t) a.appendChild(t);
    } else {
      if (t) a.appendChild(t);
      cardBody(w).forEach(function (n) { a.appendChild(n); });
    }
    return a;
  }

  function renderCards(container, opts) {
    if (!container) return [];
    opts = opts || {};
    var list = select(opts);
    clear(container);
    list.forEach(function (w) { container.appendChild(card(w, opts.layout)); });
    renderIllus(container);
    if (typeof window.applyLang === "function") window.applyLang();
    return list;
  }

  function autoCards() {
    var nodes = document.querySelectorAll("[data-works]");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      renderCards(el, {
        filter: el.getAttribute("data-works") || "all",
        layout: el.getAttribute("data-works-layout") || "grid",
        featuredOnly: el.hasAttribute("data-works-featured"),
        limit: parseInt(el.getAttribute("data-works-limit"), 10) || 0
      });
    }
  }

  /* ---------- filters (portfolio) ---------------------------------------- */

  function queryParam(name) {
    try {
      var m = new RegExp("[?&]" + name + "=([^&#]+)").exec(window.location.search);
      return m ? decodeURIComponent(m[1]) : null;
    } catch (e) { return null; }
  }

  function writeFilter(value) {
    try {
      var url = new URL(window.location.href);
      if (value && value !== "all") url.searchParams.set("filter", value);
      else url.searchParams.delete("filter");
      window.history.replaceState(null, "", url.toString());
    } catch (e) { /* file:// */ }
  }

  function prepareButton(btn) {
    /* Keep the translated label and the count in separate spans so that
       applyLang() cannot wipe the count. */
    if (btn.querySelector(".count")) return;
    var key = btn.getAttribute("data-lang");
    if (key) {
      var label = h("span", { "data-lang": key, text: btn.textContent.trim() });
      btn.removeAttribute("data-lang");
      clear(btn);
      btn.appendChild(label);
    }
    btn.appendChild(h("span", { "class": "count" }));
  }

  function initFilters() {
    var buttons = document.querySelectorAll("[data-filter]");
    if (!buttons.length) return;
    var cards = document.querySelectorAll("[data-works] .card, .work-grid .card");
    var counts = { all: 0, project: 0, research: 0 };
    all().forEach(function (w) { counts.all++; counts[w.type] = (counts[w.type] || 0) + 1; });

    function apply(value, write) {
      for (var i = 0; i < cards.length; i++) {
        var show = value === "all" || cards[i].getAttribute("data-type") === value;
        if (show) cards[i].removeAttribute("hidden");
        else cards[i].setAttribute("hidden", "");
      }
      for (var j = 0; j < buttons.length; j++) {
        buttons[j].setAttribute("aria-pressed",
          buttons[j].getAttribute("data-filter") === value ? "true" : "false");
      }
      if (write) writeFilter(value);
    }

    for (var i = 0; i < buttons.length; i++) {
      (function (btn) {
        prepareButton(btn);
        var f = btn.getAttribute("data-filter");
        var c = btn.querySelector(".count");
        if (c) c.textContent = " · " + (counts[f] || 0);
        btn.addEventListener("click", function () { apply(f, true); });
      })(buttons[i]);
    }

    var initial = queryParam("filter");
    if (["all", "project", "research"].indexOf(initial) === -1) initial = "all";
    apply(initial, false);
  }

  /* ---------- resume ------------------------------------------------------ */

  function resumeItem(w, withDate) {
    var link = h("a", { href: w.href || (w.type + "_" + w.id + ".html") }, [
      h("b", { "data-lang": "work_" + w.id + "_title", text: w.id }),
      h("small", { "data-lang": "work_" + w.id + "_sub", text: "" })
    ]);
    var kids = [];
    if (withDate) kids.push(h("div", { "class": "when", text: w.date || tr("badge_progress", "In progress") }));
    kids.push(h("div", null, [link]));
    return h("div", { "class": "item" + (withDate ? "" : " single") }, kids);
  }

  function renderResume() {
    var r = document.querySelector("[data-resume-research]");
    if (r) {
      clear(r);
      select({ filter: "research" }).forEach(function (w) { r.appendChild(resumeItem(w, false)); });
    }
    var p = document.querySelector("[data-resume-projects]");
    if (p) {
      clear(p);
      select({ filter: "project" }).forEach(function (w) { p.appendChild(resumeItem(w, true)); });
    }
  }

  /* ---------- detail: badges / tags / meta -------------------------------- */

  function renderBadges(el, w) {
    clear(el);
    el.appendChild(h("span", {
      "class": "badge " + w.type,
      "data-lang": "badge_" + w.type,
      text: w.type === "research" ? "Research" : "Project"
    }));
    if (w.status === "in-progress") {
      el.appendChild(h("span", { "class": "badge progress", "data-lang": "badge_progress", text: "In progress" }));
    } else {
      el.appendChild(h("span", { "class": "badge done", "data-lang": "badge_done", text: "Completed" }));
    }
    var when = w.date || w.period || "";
    if (w.updated) {
      when = (when ? when + " · " : "") + tr("detail_common_updated", "updated") + " " + w.updated;
    }
    if (when) el.appendChild(h("span", { "class": "when", text: when }));
  }

  function renderTags(el, w) {
    clear(el);
    (w.tags || []).slice(0, 6).forEach(function (t) {
      el.appendChild(h("span", { "class": "tag", text: t }));
    });
    if (!el.childNodes.length) remove(el);
  }

  function artifactLink(a) {
    var link = h("a", {
      href: a.href,
      target: "_blank",
      rel: "noopener",
      "data-no-lang": ""
    }, [icon(a.kind)]);
    link.appendChild(document.createTextNode(a.label));
    return link;
  }

  function metaColumn(labelKey, labelText, valueNode, cls) {
    return h("div", cls ? { "class": cls } : null, [
      h("span", { "data-lang": labelKey, text: labelText }),
      valueNode
    ]);
  }

  function renderMeta(el, w) {
    clear(el);
    var cols = 0;
    if (w.role) {
      el.appendChild(metaColumn("detail_common_role", "Role", h("b", { text: w.role })));
      cols++;
    }
    if (w.period) {
      el.appendChild(metaColumn("detail_common_period", "Period", h("b", { text: w.period })));
      cols++;
    }
    if (w.stack && w.stack.length) {
      el.appendChild(metaColumn("detail_common_stack", "Stack", h("b", { text: w.stack.join(" · ") })));
      cols++;
    }
    if (w.artifacts && w.artifacts.length) {
      var box = h("div", { "class": "links" }, [
        h("span", { "data-lang": "detail_common_artifacts", text: "Artifacts" })
      ]);
      w.artifacts.forEach(function (a) { box.appendChild(artifactLink(a)); });
      el.appendChild(box);
      cols++;
    }
    if (!cols) remove(el);
  }

  function renderStack(el, w) {
    clear(el);
    (w.stack || []).forEach(function (s) { el.appendChild(h("span", { "class": "tag", text: s })); });
    if (!el.childNodes.length) remove(el);
  }

  function renderArtifacts(el, w) {
    clear(el);
    (w.artifacts || []).forEach(function (a) {
      var link = h("a", { "class": "btn", href: a.href, target: "_blank", rel: "noopener", "data-no-lang": "" }, [icon(a.kind)]);
      link.appendChild(document.createTextNode(a.label));
      el.appendChild(link);
    });
    if (!el.childNodes.length) remove(el);
  }

  /* ---------- detail: pager ---------------------------------------------- */

  /* Arrow glyphs stay outside the translated span: lang/*.json holds
     "Previous" / "Next" / "Back to portfolio" without arrows. */
  function dirLabel(isNext) {
    var key = isNext ? "detail_common_next" : "detail_common_prev";
    var span = h("span", null, []);
    if (!isNext) span.appendChild(h("span", { "aria-hidden": "true", text: "← " }));
    span.appendChild(h("span", { "data-lang": key, text: isNext ? "Next" : "Previous" }));
    if (isNext) span.appendChild(h("span", { "aria-hidden": "true", text: " →" }));
    return span;
  }

  function pagerCard(w, dir) {
    var isNext = dir === "next";
    if (!w) {
      var back = h("b", null, [
        h("span", { "aria-hidden": "true", text: "← " }),
        h("span", { "data-lang": "detail_common_back", text: "Back to portfolio" })
      ]);
      return h("a", { "class": "pager-back" + (isNext ? " next" : ""), href: "portfolio.html" },
        [dirLabel(isNext), back]);
    }
    return h("a", { "class": isNext ? "next" : "", href: w.href || (w.type + "_" + w.id + ".html") }, [
      dirLabel(isNext),
      h("b", { "data-lang": "work_" + w.id + "_title", text: w.id })
    ]);
  }

  function renderPager(el, w) {
    var list = sortedWorks();
    var i = -1;
    for (var k = 0; k < list.length; k++) if (list[k].id === w.id) { i = k; break; }
    clear(el);
    el.appendChild(pagerCard(i > 0 ? list[i - 1] : null, "prev"));
    el.appendChild(pagerCard(i >= 0 && i < list.length - 1 ? list[i + 1] : null, "next"));
  }

  /* ---------- detail: results / evidence ---------------------------------- */

  function renderResults(w) {
    var boxes = document.querySelectorAll("[data-results]");
    var ok = false;
    for (var i = 0; i < boxes.length; i++) {
      if (w.results && window.figures && window.figures.render(boxes[i], w.results)) {
        ok = true;
      } else {
        remove(boxes[i].closest ? (boxes[i].closest(".results") || boxes[i]) : boxes[i]);
      }
    }
    /* the validation bullet list is the fallback when there is no chart */
    var v = document.querySelectorAll("[data-validation]");
    for (var j = 0; j < v.length; j++) if (ok) remove(v[j]);
  }

  function renderEvidence(w) {
    var figs = document.querySelectorAll("[data-evidence]");
    var list = w.evidence || [];
    for (var i = 0; i < figs.length; i++) {
      var fig = figs[i];
      var idx = parseInt(fig.getAttribute("data-evidence"), 10);
      if (isNaN(idx)) idx = i;
      var e = list[idx];
      if (!e || !e.src) { remove(fig); continue; }

      var img = h("img", {
        src: e.src,
        alt: e.alt || "",
        loading: "lazy",
        decoding: "async",
        width: e.width || null,
        height: e.height || null
      });
      var pic = h("picture", null, e.webp
        ? [h("source", { type: "image/webp", srcset: e.webp }), img]
        : [img]);
      var cap = fig.querySelector("figcaption");
      fig.insertBefore(pic, cap || null);
      if (cap && !cap.getAttribute("data-lang")) {
        if (e.captionKey) cap.setAttribute("data-lang", e.captionKey);
        else if (e.caption) cap.textContent = e.caption;
      }
    }
  }

  /* ---------- detail: entry ----------------------------------------------- */

  function renderDetail() {
    var id = document.body && document.body.getAttribute("data-work-id");
    if (!id) return;
    var w = byId(id);
    if (!w) return;

    var badges = document.querySelector("[data-work-badges]");
    if (badges) renderBadges(badges, w);
    var tags = document.querySelector("[data-work-tags]");
    if (tags) renderTags(tags, w);
    var meta = document.querySelector("[data-work-meta]");
    if (meta) renderMeta(meta, w);
    var stack = document.querySelector("[data-work-stack]");
    if (stack) renderStack(stack, w);
    var arts = document.querySelector("[data-work-artifacts]");
    if (arts) renderArtifacts(arts, w);
    var pager = document.querySelector("[data-work-pager]");
    if (pager) renderPager(pager, w);

    renderResults(w);
    renderEvidence(w);
  }

  /* ---------- boot -------------------------------------------------------- */

  function render() {
    autoCards();
    initFilters();
    renderResume();
    renderDetail();
    renderIllus(document);
    if (typeof window.applyLang === "function") window.applyLang();
  }

  function boot() {
    try { render(); }
    catch (e) { if (window.console) console.warn("works.js:", e); }
  }

  /* NOTE: readyState is already "interactive" when deferred scripts execute,
     so testing for "loading" would boot each module immediately and in the
     wrong order (works.js would run before figures.js had defined itself).
     DOMContentLoaded has not fired yet unless readyState is "complete". */
  if (document.readyState === "complete") {
    boot();
  } else {
    document.addEventListener("DOMContentLoaded", boot);
  }

  window.works = {
    sortedWorks: sortedWorks,
    byId: byId,
    renderCards: renderCards,
    render: render
  };
})(window, document);
