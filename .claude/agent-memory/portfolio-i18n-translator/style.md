---
name: style
description: Tone/register rules for KR and JP UI strings, and how to reuse temp/preview_v2.html wording
metadata:
  type: feedback
---

- Korean: 격식체 "~합니다" for lead/contact prose, not "~해요"/"~다". Technical proper nouns
  (DRAM, eBPF, GPU, LLM, KV cache, O-RAN, LabVIEW, OpenCL) stay in English/Latin script as-is.
- Japanese: です・ます調 for prose sentences (hero_lead, contact_title, meta_desc_*, resume section
  intros). Exception: `footer_quote` is a motto/tagline, so a terse non-です・ます closing ("築く。")
  is acceptable there — don't force です・ます onto slogans.
- `temp/preview_v2.html` has an inline `I18N` JS object (search for `const I18N=`) with previously
  reviewed KR/JP wording for hero_sub → `hero_role`, hero_lead, pill_1..4, `fr_sub`/`sp_sub`/`pf_sub`
  → `home_research_sub`/`home_projects_sub`/`portfolio_sub`, `rs_*` → resume section titles, and
  `ct_*` → contact_* keys. When the *meaning* of the new en.json string matches the old preview
  string closely, reuse the KR/JP wording verbatim or with light edits. When en.json content was
  rewritten with materially different facts (this happened for `hero_lead`, the pill descriptions,
  and the three `_sub` section subtitles in the 2026-09 rewrite — they became full sentences instead
  of short phrases), translate fresh instead of forcing an outdated translation to fit.
- The pre-redesign `lang/kr.json`/`lang/jp.json` (obsolete key set) had almost no reusable UI-chrome
  wording beyond `nav_resume`→履歴書 and the footer copyright line — everything else was either
  sidebar/profile keys deleted in the redesign, or English-only detail body text already identical
  across languages. Don't expect much mineable value there beyond nav labels; check `temp/preview_v2.html`
  first for chrome wording, not the old lang/*.json.

See [[terminology]] for the resulting approved strings and [[scope-decisions]] for what to translate.
