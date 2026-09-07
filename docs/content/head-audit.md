# Head meta audit — 12 root pages

Snapshot of `<head>` state as of 2026-09-07 on branch `redesign-2026-09`
(commit range up to `f1e038f`). Read-only audit — no pages were edited by
this pass. Checked against `docs/spec/04-page-specs.md` title table and
`docs/spec/06-assets-seo-performance.md` §3.

## Table

| file | `<title>` | desc len | og:title | og:description | og:image | og:url | canonical | favicon | apple-touch-icon | twitter:card |
|---|---|---|---|---|---|---|---|---|---|---|
| index.html | `Junheon Lee · Computer Architecture & Memory Systems` | 180 ⚠️ | ✅ | ✅ | ✅ abs | ✅ `/` | ✅ `/` | ✅ | ✅ | ✅ |
| portfolio.html | `Portfolio · Junheon Lee` | 182 ⚠️ | ✅ | ✅ | ✅ abs | ✅ `/portfolio.html` | ✅ `/portfolio.html` | ✅ | ✅ | ✅ |
| resume.html | `Resume · Junheon Lee` | 158 | ✅ | ✅ | ✅ abs | ✅ `/resume.html` | ✅ `/resume.html` | ✅ | ✅ | ✅ |
| contact.html | `Contact · Junheon Lee` | 80 | ✅ | ✅ | ✅ abs | ✅ `/contact.html` | ✅ `/contact.html` | ✅ | ✅ | ✅ |
| project_5g_oran.html | `5G O-RAN End-to-End Simulation · Junheon Lee` | 70 | ✅ | ✅ | ✅ abs | ❌ missing | ✅ `/project_5g_oran.html` | ✅ | ❌ missing | ✅ |
| project_can.html | `CAN Bus Security Analysis and Intrusion Detection · Junheon Lee` | 90 | ✅ | ✅ | ✅ abs | ❌ missing | ✅ `/project_can.html` | ✅ | ❌ missing | ✅ |
| project_ebpf.html | `Practical Latency Observability with eBPF · Junheon Lee` | 62 | ✅ | ✅ | ✅ abs | ❌ missing | ✅ `/project_ebpf.html` | ✅ | ❌ missing | ✅ |
| project_opencl.html | `On-Device GPU Image Processing via OpenCL and the Android NDK · Junheon Lee` | 77 | ✅ | ✅ | ✅ abs | ❌ missing | ✅ `/project_opencl.html` | ✅ | ❌ missing | ✅ |
| project_rowscope.html | `RowScope: DRAM Row Buffer Locality Analyzer · Junheon Lee` | 70 | ✅ | ✅ | ✅ abs | ❌ missing | ✅ `/project_rowscope.html` | ✅ | ❌ missing | ✅ |
| research_dynamic_moh.html | `GPU Memory System Optimization for LLM Inference · Junheon Lee` | 105 | ✅ | ✅ | ✅ abs | ❌ missing | ✅ `/research_dynamic_moh.html` | ✅ | ❌ missing | ✅ |
| research_pim_accel.html | `PIM-Accelerated Gradient Accumulation for 3DGS-SLAM · Junheon Lee` | 85 | ✅ | ✅ | ✅ abs | ❌ missing | ✅ `/research_pim_accel.html` | ✅ | ❌ missing | ✅ |
| 404.html | `Page not found · Junheon Lee` | 76 | ✅ | ✅ | ✅ abs | ✅ `/404.html` | ✅ `/404.html` | ✅ | ✅ | ✅ |

`desc len` = character count of `<meta name="description">`. ⚠️ = over the
~155–160 char guideline (Google truncates around there; not a hard spec
number, flagged per this task's instruction).

## Summary

**Fully consistent (no issues found): 3 / 12** — `resume.html`, `contact.html`, `404.html`.

**9 / 12 pages have at least one issue:**

1. **`og:url` missing on all 7 detail pages** (`project_5g_oran.html`,
   `project_can.html`, `project_ebpf.html`, `project_opencl.html`,
   `project_rowscope.html`, `research_dynamic_moh.html`,
   `research_pim_accel.html`). `canonical` is present and correct on all of
   them, so the absolute URL exists in the head — `og:url` is just not
   duplicated from it. Low severity for crawlers (canonical covers
   dedup/indexing) but OG consumers (Slack/Discord/X previews) that read
   `og:url` specifically instead of falling back to canonical will show no
   link target or the crawled address instead of the canonical one.
2. **`apple-touch-icon` missing on the same 7 detail pages.** `favicon.svg`
   is present everywhere; only the iOS/old-Safari PNG fallback link is
   absent on detail pages. Low severity (modern Safari/iOS reads
   `favicon.svg` fine); matters only for "Add to Home Screen" icon quality
   on older iOS.
3. **`index.html` and `portfolio.html` descriptions exceed ~160 characters**
   (180 and 182 respectively) — both will be truncated mid-word in Google
   search snippets and some OG unfurls. Every other page's description is
   under 160.
4. **`index.html` has no `application/ld+json` `Person` structured-data
   block.** `06-assets-seo-performance.md` §3 calls for one (name,
   alternateName "이준헌", affiliation University of Seoul, url, sameAs
   GitHub) and it is the only page the spec asks for it on. Not present in
   the current head — the entire `<script type="application/ld+json">` tag
   is absent from `index.html`.

**Not flagged (checked, found consistent):**
- Title pattern: all 12 match `04-page-specs.md`'s table exactly, including
  the `index.html` exception (name-first, not `{title} · Junheon Lee`).
- `canonical` and `og:image`/`og:url` (where present) all point to the
  correct own file, absolute `https://junon-lee.pages.dev/...` — no
  cross-page copy-paste mismatches found.
- `og:image` is the same absolute URL (`.../assets/img/og.png`) on all 12
  pages — consistent, and the file now exists (see report).
- `twitter:card` is `summary_large_image` on all 12.
- `favicon.svg` link present and identical on all 12.
- Detail pages use `og:type=article` vs. the base template's `website`;
  not an inconsistency the task's check list covers (title/description
  length/missing-tag/wrong-file-in-og:url-or-canonical) — reasonable and
  arguably more correct for individual project/research write-ups, so not
  flagged as an issue, just noted.

This file is a report only; none of the 12 pages were edited by this pass
(out of scope — this agent owns only `og.png`, `make-og.sh`, and this
audit doc).
