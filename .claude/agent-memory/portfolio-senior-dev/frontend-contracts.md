---
name: frontend-contracts
description: Public JS globals, data-* markup hooks, and the header/footer injection decision for the 2026-09 redesign
metadata:
  type: project
---

The redesign has **no single `window.PORTFOLIO` namespace**. Each module owns its own global,
because pages, templates and other agents' files reference them by name:

| global | file | key members |
|---|---|---|
| `setLang` / `applyLang` / `currentLang()` / `t(key)` | assets/js/lang.js | `setLang` stays a bare global because inline `onclick` handlers use it |
| `layout` | assets/js/layout.js | `renderHeader(el)`, `renderFooter(el)`, `site()`, `githubUrl()` |
| `works` | assets/js/works.js | `sortedWorks()`, `byId(id)`, `renderCards(container, opts)`, `render()` |
| `figures` | assets/js/figures.js | `render(container, spec)` for line/bar/hist/bits/metric |
| `Illus` | assets/js/illustrations.js (other agent) | `render(el)` reads `el.dataset.illus = "<workId>.<scene>"`, appends SVG before any figcaption |
| `WORKS` / `SITE` / `TRANSLATION_DATA` | works-data.js, lang-data.js | data only |

`document` fires a `langchange` CustomEvent after every `applyLang()`.

**Header/footer decision (resolves the 02 §6 vs 00 §4-2 tension):** `layout.js` injects the header
into `[data-site-header]` and the footer into `[data-site-footer]`, **but skips injection when the
element already contains `.nav` / `.footer-inner`**. A page can therefore ship a static, JS-free
header and still get the active-nav / year / language wiring. Nothing else in the codebase duplicates
header markup, so there is no copy-paste drift to hash-check.

**Why:** 02 §6 asks for injection (one source of truth) while 00 §4-2 requires the page to read in
English with JS off. The escape hatch satisfies both without a build step.

**How to apply:** when a page implementer asks "where does the header come from", the answer is
layout.js; when accessibility/no-JS is the concern, point them at the escape hatch rather than
letting them hand-write a second header.

Markup hooks are documented in the comment block at the top of each JS file — read those before
inventing a new attribute. See [[css-and-check-conventions]].
