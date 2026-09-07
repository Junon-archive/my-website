---
name: css-and-check-conventions
description: CSS token/file split, layout traps found at the 960 and 600 breakpoints, and what scripts/check.mjs actually verifies
metadata:
  type: project
---

**CSS split** — tokens.css (the only file with colour literals) / base.css (reset, shell, header,
footer, .btn .badge .tag, focus, reduced-motion, print) / pages.css (home, portfolio, resume,
contact, 404) / detail.css (loaded *instead of* pages.css on detail pages). Extra tokens added
beyond 01 §1–3: `--on-navy` (primary-button text, flips in dark), `--r-box` / `--r-btn` / `--r-badge`,
`--header-h`, `--anchor-offset`, `--toc-top`, `--t` (transition duration).

**Layout traps found while testing:**
- `.card.wide` at ≤960px needs `.thumb{order:-1}`, not `order:0`. The text column is the first DOM
  child, so equal order values leave the thumbnail stranded below the tags.
- The mobile nav is a second `.navmobile` row rendered by layout.js, hidden above 600px. There is no
  hamburger (01 §3 forbids one).
- Chart value labels near the right edge must flip to `text-anchor="end"`, and bar-chart tick ranges
  must be generated so the top tick is ≥ max, or the tallest bar overshoots the plot box.
- A template HTML comment must never contain `-->` (an early `<!-- TEMPLATE: … -->` inside the
  header comment leaked template prose onto the rendered page).

**lang-data.js is delta-encoded** (since 2026-09-07): `en` is complete, `kr`/`jp` carry only the keys
whose value differs from en (60 keys each instead of 350), which brings the synchronously loaded
bundle to 57.5 KB, under the 60 KB target in 06 §4. `lang/*.json` on disk stay complete. This works
because `lang.js` resolves current language -> en -> HTML fallback on every path, and prefers a
fetched complete dictionary over the bundled delta once `lang/<lang>.json` arrives.

**scripts/check.mjs** runs the eight checks from 03 §8 plus two extensions (9: no hex/rgb outside
tokens.css, 10: works ids ↔ project_/research_*.html 1:1). Check 3 (unused keys) is a warning only.
Keys containing `{` or `}` are skipped so `docs/templates/*.html` placeholders do not fail check 2,
and a hard-coded RUNTIME_KEYS list covers keys that JS builds by concatenation and a regex cannot see.

**Why:** the checks are the only guard against the data drift described in 00 §3; the placeholder and
runtime-key carve-outs exist because a naive regex scan produced false failures on the templates.

**How to apply:** before adding a new dynamic `data-lang` key in JS, add it to RUNTIME_KEYS in
check.mjs, otherwise check 3 will report it as unused and check 2 will not protect it.
See [[frontend-contracts]].
