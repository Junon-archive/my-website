/* ==========================================================================
   toc.js — builds the detail-page table of contents and the scroll spy
            (01-design-system.md §4.7, 05-detail-templates.md §1)

   Reads   section.detail-section > h2  ->  <span class="num">01</span>
                                           <span data-lang="…">Problem</span>
   Writes  [data-toc]  (an <aside class="toc">)

   The generated link mirrors the heading's data-lang key so applyLang()
   translates the TOC for free. A "← Back to portfolio" link is appended,
   pointing at portfolio.html?filter=<body data-work-type>.

   Everything is wrapped in try/catch: a broken TOC must never break the page.
   ========================================================================== */
(function (window, document) {
  "use strict";

  function build() {
    var host = document.querySelector("[data-toc]");
    if (!host) return;

    var sections = document.querySelectorAll("section.detail-section");
    if (!sections.length) { host.setAttribute("hidden", ""); return; }

    var label = document.createElement("div");
    label.className = "toc-label";
    label.setAttribute("data-lang", "detail_common_contents");
    label.textContent = "Contents";
    host.appendChild(label);

    var links = [];
    for (var i = 0; i < sections.length; i++) {
      var sec = sections[i];
      var h2 = sec.querySelector("h2");
      if (!h2) continue;
      if (!sec.id) sec.id = "s" + (i + 1);

      var numEl = h2.querySelector(".num");
      var labelEl = h2.querySelector("span:not(.num)");

      var a = document.createElement("a");
      a.href = "#" + sec.id;
      a.setAttribute("data-toc-target", sec.id);

      var n = document.createElement("span");
      n.className = "n";
      n.textContent = numEl ? numEl.textContent : String(i + 1);
      a.appendChild(n);

      var txt = document.createElement("span");
      if (labelEl) {
        var key = labelEl.getAttribute("data-lang");
        if (key) txt.setAttribute("data-lang", key);
        txt.textContent = labelEl.textContent;
      } else {
        txt.textContent = h2.textContent.replace(/^\s*\d+\s*/, "");
      }
      a.appendChild(txt);

      host.appendChild(a);
      links.push({ a: a, id: sec.id, section: sec });
    }

    var type = (document.body && document.body.getAttribute("data-work-type")) || "";
    var back = document.createElement("a");
    back.className = "back";
    back.href = "portfolio.html" + (type ? "?filter=" + type : "");
    var arrow = document.createElement("span");
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "← ";
    var backLabel = document.createElement("span");
    backLabel.setAttribute("data-lang", "detail_common_back");
    backLabel.textContent = "Back to portfolio";
    back.appendChild(arrow);
    back.appendChild(backLabel);
    host.appendChild(back);

    if (typeof window.applyLang === "function") window.applyLang();
    spy(links);
  }

  function spy(links) {
    if (!links.length || !("IntersectionObserver" in window)) return;

    var visible = {};
    function highlight() {
      var best = null;
      for (var i = 0; i < links.length; i++) {
        if (visible[links[i].id]) { best = links[i]; break; }
      }
      for (var j = 0; j < links.length; j++) {
        links[j].a.classList.toggle("is-active", !!best && links[j] === best);
      }
    }

    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        visible[entries[i].target.id] = entries[i].isIntersecting;
      }
      highlight();
    }, { rootMargin: "-90px 0px -60% 0px", threshold: 0 });

    for (var k = 0; k < links.length; k++) io.observe(links[k].section);
  }

  function boot() {
    try { build(); }
    catch (e) { if (window.console) console.warn("toc.js:", e); }
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
})(window, document);
