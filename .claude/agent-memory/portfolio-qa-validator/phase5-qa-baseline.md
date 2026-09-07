---
name: phase5-qa-baseline
description: Phase 5 QA pass/fail baseline for the junon-lee redesign (f1e038f) — what was confirmed good and what's still open
metadata:
  type: project
---

Full report: `docs/content/qa-report-phase5.md` (written 2026-09-07, redesign-2026-09 branch @ f1e038f).

**Confirmed solid** (don't re-litigate unless code changes): `node scripts/check.mjs` 10/10, en/kr/jp key
parity, works-data sort order (project-then-research, date desc, in-progress first) matches
02-information-architecture.md exactly across Home/Portfolio/Resume/pager, all 7 detail pages'
TOC-count == section-count, pager chain ebpf→rowscope→can→5g_oran→opencl→dynamic_moh→pim_accel with
"Back to portfolio" at both ends, all 5 PDF artifact links resolve and open target=_blank rel=noopener,
filter buttons + `?filter=` + aria-pressed + counts, language switching (`?lang=`) propagates through
internal links and keeps card/detail body English while translating chrome, dark mode
(`prefers-color-scheme`) renders correctly and legibly including the line/bar/bits charts, 360px mobile
layout has zero horizontal overflow, contact/resume have no placeholders and correct links, CV button
correctly hidden site-wide because `SITE.cvUrl` is `null` in works-data.js.

**Open defects as of this report** (see report for file:line and routing):
1. major — console error on 10/12 pages: `assets/js/illustrations.js` sets `height="auto"` as an SVG
   attribute (invalid). Routed to portfolio-senior-dev.
2. major — `illustrations.js` + `scenes/*.js` = 93.1KB, budget is 40KB (06-assets-seo-performance.md §4).
   `illustrations.js` alone is 32KB. Routed to portfolio-senior-dev.
3. major — `index.html` missing the required JSON-LD `Person` structured data block (06 §3). Routed to
   portfolio-assets-seo.
4. minor — `og:url` present on the 4 top-level pages + 404 but absent on all 7 detail pages
   (inconsistent, spec ambiguity on whether it's required at all).
5. minor — `lang-data.js` is 57.48KB against a 60KB budget, only 2.5KB of headroom left.
6. informational, spec-only (route to portfolio-master-planner, no code change needed): 07's QA
   checklist says "설명 도식 12개" but its own itemized breakdown sums to 13 (matches the actual
   implementation, which is correct) — just a doc arithmetic typo. Also 07's "≤960px arch 화살표 회전"
   checklist item references a CSS `.arch` component that 01-design-system.md §4.9 explicitly says was
   discarded in favor of static SVG diagrams — the checklist line is stale. Also rowscope's scene uses
   `--warn` for "row conflict" even though 07's checklist text says warn is "can/pim 이상 현상에만"
   (08's broader color rule does list "충돌/collision" as legitimate warn material, so this may be
   intentional — needs a planner decision, not a QA fix).

Next QA pass on this project should re-run the static checks + re-verify defects 1-3 are closed, and
does not need to re-verify the "confirmed solid" list unless the underlying files changed.
