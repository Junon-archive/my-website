/* ==========================================================================
   layout.js — header / footer injection, active nav, footer year, CV button
                (04-page-specs.md common skeleton)

   Markup hooks
     <header class="site-header" data-site-header data-active="home|resume|portfolio|contact">
     <footer class="site-footer" data-site-footer>
     [data-cv-button]                CV link slot. Rendered only when SITE.cvUrl
                                     is truthy, otherwise the element is removed.
                                     Optional attributes:
                                       data-cv-label="<lang key>"  (default hero_cta_cv)
                                       data-cv-variant="primary"
     [data-year]                     filled with the current year
     [data-site-email]               <a> whose href becomes mailto:SITE.email
     [data-site-github]              <a> whose href becomes the GitHub profile

   Globals exposed
     window.layout.renderHeader(el), renderFooter(el), site()

   Escape hatch: if a page already ships a static <nav class="nav"> inside
   [data-site-header], nothing is injected — only the active state is applied.
   That keeps a hand-written, JS-free header readable (00-overview.md §4-2).
   ========================================================================== */
(function (window, document) {
  "use strict";

  var NAV = [
    { key: "nav_home",      id: "home",      href: "index.html",     text: "Home" },
    { key: "nav_resume",    id: "resume",    href: "resume.html",    text: "Resume" },
    { key: "nav_portfolio", id: "portfolio", href: "portfolio.html", text: "Portfolio" },
    { key: "nav_contact",   id: "contact",   href: "contact.html",   text: "Contact" }
  ];

  var LANG_BUTTONS = [
    { code: "kr", label: "KR" },
    { code: "en", label: "EN" },
    { code: "jp", label: "JP" }
  ];

  var ICON_DOWNLOAD =
    '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">' +
    '<path d="M8 2v8M4.5 7.5 8 11l3.5-3.5M3 13h10"/></svg>';

  function site() {
    return window.SITE || {};
  }

  function githubUrl() {
    var g = site().github;
    if (!g) return "https://github.com/";
    return /^https?:/i.test(g) ? g : "https://github.com/" + g;
  }

  function navLinks(active) {
    return NAV.map(function (n) {
      var on = n.id === active ? ' class="active" aria-current="page"' : "";
      return '<a href="' + n.href + '"' + on + ' data-nav="' + n.id +
             '" data-lang="' + n.key + '">' + n.text + "</a>";
    }).join("");
  }

  function headerHTML(active) {
    return '' +
      '<nav class="nav" aria-label="Main">' +
        '<a class="brand" href="index.html">' +
          '<i aria-hidden="true">JH</i>' +
          '<span data-lang="brand_name">Junheon Lee</span>' +
        '</a>' +
        '<div class="navlinks">' + navLinks(active) + '</div>' +
        '<div class="lang" role="group" aria-label="Language">' +
          LANG_BUTTONS.map(function (b) {
            return '<button type="button" data-lang-code="' + b.code +
                   '" aria-pressed="false">' + b.label + "</button>";
          }).join("") +
        '</div>' +
      '</nav>' +
      '<div class="navmobile" aria-label="Main (compact)">' + navLinks(active) + '</div>';
  }

  function footerHTML() {
    var s = site();
    var email = s.email || "";
    return '' +
      '<div class="footer-inner">' +
        '<span class="q" data-lang="footer_quote">' +
          '“Understand the system, measure the truth, build a better solution.”' +
        '</span>' +
        '<div class="footer-right">' +
          '<div class="aff" data-lang="footer_affiliation">' +
            'Architecture &amp; Computer Systems Laboratory · University of Seoul' +
          '</div>' +
          '<div class="links">' +
            '<a href="' + githubUrl() + '" target="_blank" rel="noopener" data-no-lang>GitHub</a>' +
            (email ? '<a href="mailto:' + email + '" data-no-lang>Email</a>' : "") +
            '<span>© <span data-year>' + new Date().getFullYear() + '</span> ' +
              '<span data-lang="footer_copyright">Junheon Lee</span></span>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function renderHeader(el) {
    if (!el) return;
    var active = el.getAttribute("data-active") || "";
    if (!el.querySelector(".nav")) el.innerHTML = headerHTML(active);
    setActive(el, active);
  }

  function setActive(el, active) {
    var links = el.querySelectorAll("[data-nav]");
    for (var i = 0; i < links.length; i++) {
      var on = links[i].getAttribute("data-nav") === active;
      links[i].classList.toggle("active", on);
      if (on) links[i].setAttribute("aria-current", "page");
      else links[i].removeAttribute("aria-current");
    }
  }

  function renderFooter(el) {
    if (!el) return;
    if (!el.querySelector(".footer-inner")) el.innerHTML = footerHTML();
  }

  function fillYear() {
    var y = String(new Date().getFullYear());
    var nodes = document.querySelectorAll("[data-year]");
    for (var i = 0; i < nodes.length; i++) nodes[i].textContent = y;
  }

  function renderCvButtons() {
    var url = site().cvUrl;
    var slots = document.querySelectorAll("[data-cv-button]");
    for (var i = 0; i < slots.length; i++) {
      var el = slots[i];
      if (!url) {
        if (el.parentNode) el.parentNode.removeChild(el);
        continue;
      }
      var key = el.getAttribute("data-cv-label") || "hero_cta_cv";
      var variant = el.getAttribute("data-cv-variant");
      var cls = "btn" + (variant ? " " + variant : "");
      if (el.tagName === "A") {
        el.setAttribute("href", url);
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener");
        el.className = el.className || cls;
      } else {
        el.innerHTML =
          '<a class="' + cls + '" href="' + url + '" target="_blank" rel="noopener">' +
          ICON_DOWNLOAD + '<span data-lang="' + key + '">Download CV</span></a>';
      }
    }
  }

  function fillSiteLinks() {
    var s = site();
    var mails = document.querySelectorAll("[data-site-email]");
    for (var i = 0; i < mails.length; i++) {
      if (s.email) mails[i].setAttribute("href", "mailto:" + s.email);
      if (s.email && !mails[i].textContent.trim()) mails[i].textContent = s.email;
    }
    var ghs = document.querySelectorAll("[data-site-github]");
    for (var j = 0; j < ghs.length; j++) {
      ghs[j].setAttribute("href", githubUrl());
      ghs[j].setAttribute("target", "_blank");
      ghs[j].setAttribute("rel", "noopener");
    }
  }

  function boot() {
    renderHeader(document.querySelector("[data-site-header]"));
    renderFooter(document.querySelector("[data-site-footer]"));
    fillYear();
    renderCvButtons();
    fillSiteLinks();
    if (typeof window.applyLang === "function") window.applyLang();
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

  window.layout = {
    renderHeader: renderHeader,
    renderFooter: renderFooter,
    site: site,
    githubUrl: githubUrl
  };
})(window, document);
