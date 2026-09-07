/* ==========================================================================
   lang.js — translation loading and application  (03-content-and-i18n.md §2)

   Globals exposed
     window.setLang(lang)        switch language ("kr" | "en" | "jp"). Kept as a
                                 bare global because inline onclick handlers use it.
     window.applyLang()          re-apply the current dictionary to the DOM.
                                 Call it after injecting or rendering markup.
     window.currentLang()        -> "kr" | "en" | "jp"
     window.t(key)               -> string ("" when the key is unknown)
     document event "langchange" fired after every applyLang()

   Markup hooks
     data-lang=KEY                     -> element.textContent
     data-lang=KEY data-lang-attr="placeholder|aria-label|title|alt|content"
                                         -> element.setAttribute(attr, value)
                                            (comma separated list allowed)
     data-placeholder="key"              -> legacy alias for the above
     data-no-lang                        -> <a> excluded from ?lang= propagation
     [data-lang-code="kr|en|jp"]         -> language button, gets aria-pressed

   Lookup order: current language -> en -> the text already in the HTML.
   Source order: window.TRANSLATION_DATA (assets/js/lang-data.js, sync) first,
   then fetch("lang/<lang>.json") replaces it when the page is served over http.
   Under file:// the fetch fails silently and the bundled data is used.
   ========================================================================== */
(function (window, document) {
  "use strict";

  var LANGS = ["kr", "en", "jp"];
  var HTML_LANG = { kr: "ko", jp: "ja", en: "en" };
  var STORE_KEY = "lang";

  /* window.TRANSLATION_DATA (assets/js/lang-data.js) is delta-encoded: en is
     complete, kr and jp carry only the keys that differ from en. Every lookup
     therefore has to fall through to en. Once lang/<lang>.json is fetched we
     hold a complete dictionary for that language and prefer it, but the
     fall-through stays in place so both states behave identically. */
  var bundled = window.TRANSLATION_DATA || {};
  var fetched = {};       /* lang -> complete dictionary from lang/<lang>.json */
  var dict = {};          /* current language, possibly partial */
  var fallback = {};      /* en, always complete */
  var current = "en";
  var defaults = new WeakMap();   /* element -> original HTML text */

  /* ---------- helpers ---------------------------------------------------- */

  function isLang(l) { return LANGS.indexOf(l) !== -1; }

  function urlLang() {
    try {
      var m = /[?&]lang=([^&#]+)/.exec(window.location.search);
      return m ? decodeURIComponent(m[1]) : null;
    } catch (e) { return null; }
  }

  function storedLang() {
    try { return window.localStorage.getItem(STORE_KEY); } catch (e) { return null; }
  }

  function store(l) {
    try { window.localStorage.setItem(STORE_KEY, l); } catch (e) { /* private mode */ }
  }

  function lookup(key) {
    if (!key) return "";
    if (dict && typeof dict[key] === "string") return dict[key];
    if (fallback && typeof fallback[key] === "string") return fallback[key];
    return "";
  }

  /* ---------- DOM application -------------------------------------------- */

  function applyTo(el) {
    var key = el.getAttribute("data-lang");
    var attrs = el.getAttribute("data-lang-attr");
    var value = lookup(key);

    if (attrs) {
      if (!value) return;
      attrs.split(",").forEach(function (a) {
        a = a.trim();
        if (a) el.setAttribute(a, value);
      });
      return;
    }

    if (!defaults.has(el)) defaults.set(el, el.textContent);
    el.textContent = value || defaults.get(el) || "";
  }

  function applyLang() {
    document.documentElement.lang = HTML_LANG[current] || "en";

    var nodes = document.querySelectorAll("[data-lang]");
    for (var i = 0; i < nodes.length; i++) applyTo(nodes[i]);

    /* legacy attribute hook kept for form controls */
    var ph = document.querySelectorAll("[data-placeholder]");
    for (var j = 0; j < ph.length; j++) {
      var v = lookup(ph[j].getAttribute("data-placeholder"));
      if (v) ph[j].setAttribute("placeholder", v);
    }

    updateLangButtons();
    propagateLang();

    try {
      document.dispatchEvent(new CustomEvent("langchange", { detail: { lang: current } }));
    } catch (e) { /* very old browsers */ }
  }

  function updateLangButtons() {
    var btns = document.querySelectorAll("[data-lang-code]");
    for (var i = 0; i < btns.length; i++) {
      var on = btns[i].getAttribute("data-lang-code") === current;
      btns[i].setAttribute("aria-pressed", on ? "true" : "false");
      btns[i].classList.toggle("on", on);
    }
  }

  /* Propagate ?lang= to internal links, preserving any other query
     parameters (portfolio.html?filter=research must keep its filter). */
  function propagateLang() {
    var links = document.querySelectorAll("a[href]");
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      var raw = a.getAttribute("href");
      if (!raw) continue;
      if (a.hasAttribute("data-no-lang")) continue;
      if (raw.charAt(0) === "#") continue;
      if (/^(https?:|mailto:|tel:|javascript:|data:)/i.test(raw)) continue;
      if (/\.pdf($|[?#])/i.test(raw)) continue;

      var hash = "", base = raw, k = raw.indexOf("#");
      if (k >= 0) { hash = raw.slice(k); base = raw.slice(0, k); }

      var path = base, query = "", q = base.indexOf("?");
      if (q >= 0) { path = base.slice(0, q); query = base.slice(q + 1); }

      var parts = query ? query.split("&") : [];
      var kept = [];
      for (var p = 0; p < parts.length; p++) {
        if (parts[p] && parts[p].indexOf("lang=") !== 0) kept.push(parts[p]);
      }
      kept.push("lang=" + current);
      a.setAttribute("href", path + "?" + kept.join("&") + hash);
    }
  }

  /* ---------- dictionary sources ----------------------------------------- */

  /* Prefer a complete fetched dictionary, fall back to the bundled delta. */
  function selectDicts(lang) {
    dict = fetched[lang] || (bundled && bundled[lang]) || {};
    fallback = fetched.en || (bundled && bundled.en) || {};
  }

  function fetchDict(lang) {
    if (fetched[lang] || !window.fetch) return;
    window.fetch("lang/" + lang + ".json")
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
      .then(function (json) {
        fetched[lang] = json;
        selectDicts(current);
        applyLang();
      })
      .catch(function () { /* file:// or offline: the bundled delta stays */ });
  }

  function setLang(lang) {
    if (!isLang(lang)) lang = "en";
    current = lang;
    store(lang);
    selectDicts(lang);
    applyLang();
    fetchDict(lang);
    if (lang !== "en") fetchDict("en");
  }

  /* ---------- boot -------------------------------------------------------- */

  var initial = urlLang();
  if (!isLang(initial)) initial = storedLang();
  if (!isLang(initial)) initial = "en";
  current = initial;
  selectDicts(current);

  function boot() {
    document.addEventListener("click", function (e) {
      var btn = e.target && e.target.closest ? e.target.closest("[data-lang-code]") : null;
      if (!btn) return;
      e.preventDefault();
      setLang(btn.getAttribute("data-lang-code"));
    });
    setLang(current);
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

  window.setLang = setLang;
  window.applyLang = applyLang;
  window.currentLang = function () { return current; };
  window.t = lookup;
})(window, document);
