---
name: head-audit-2026-09
description: Findings from the 2026-09-07 head-meta audit of all 12 root pages (docs/content/head-audit.md) — what's broken, what's fine
metadata:
  type: project
---

Full table lives in `docs/content/head-audit.md` (read-only audit, this
agent did not edit any page head — that's implementer/senior-dev territory,
this agent only reports). Recheck this if a future task asks "is the head
audit still current" — it's a snapshot as of commit `f1e038f`.

**3/12 fully consistent:** `resume.html`, `contact.html`, `404.html`.

**Open issues (not fixed by this agent, needs implementer/senior-dev):**
1. All 7 detail pages (`project_5g_oran/can/ebpf/opencl/rowscope.html`,
   `research_dynamic_moh/pim_accel.html`) are missing `og:url` entirely.
   `canonical` is present and correct on every one of them, so this is a
   missing-duplicate-tag issue, not a missing-URL issue — low severity but
   real for OG-only social unfurlers.
2. Same 7 detail pages are missing `apple-touch-icon` (present on the other
   5: index/portfolio/resume/contact/404).
3. `index.html` description is 180 chars, `portfolio.html` is 182 — both
   over the ~160 char guideline, will truncate in Google snippets. Every
   other page is under 160 (resume.html is the closest at 158).
4. `index.html` has **no** `application/ld+json` `Person` block at all,
   despite `06-assets-seo-performance.md` §3 calling for one specifically
   on the home page (name, alternateName "이준헌", affiliation University
   of Seoul, url, sameAs GitHub). Not a partial/wrong implementation —
   completely absent.

**Confirmed NOT broken (checked explicitly, don't re-litigate without new
evidence):** title-pattern match against `04-page-specs.md`'s table on all
12 (including the index.html exception, which is name-first not
`{title} · Junheon Lee`); canonical/og:url self-consistency (no page points
at another page's URL); og:image identical absolute URL on all 12;
twitter:card `summary_large_image` on all 12; favicon.svg link present and
identical on all 12. Detail pages use `og:type=article` vs. base template's
`website` — flagged as a note, not an issue (reasonable choice, not in this
task's flag list).

**Deploy files reconfirmed unchanged and correct this pass:** `sitemap.xml`
has exactly the 11 non-404 pages (checked programmatically, zero
missing/extra vs. the expected set), `robots.txt` references it,
`_headers` matches the content recorded in
[[deploy-files-and-brand-assets]]. No edits needed.

See also [[og-image-generation]].
