---
name: scope-decisions
description: Which lang/en.json key families get translated to KR/JP vs copied verbatim, including judgment calls on keys the task brief left ambiguous
metadata:
  type: project
---

Rule of thumb confirmed while rebuilding lang/kr.json and lang/jp.json for the 2026-09 redesign
(349-key en.json): the redesign's i18n plan is an **allowlist**. A key is translated only if it is
UI chrome (nav, buttons, badges, filters, field labels, prose paragraphs). Everything that reads
as a "section heading" (short, capitalized, doubles as a nav anchor or brand-like label) stays
identical to English in all three languages, matching hero_cta_research/hero_cta_projects staying
"Research"/"Projects" in KR and JP.

Kept English (identical string in en/kr/jp), even though not literally listed in the task brief's
"keep identical" enumeration — treat as settled precedent for future key additions:
- `home_research_title` ("Featured Research"), `home_projects_title` ("Selected Projects")
- `portfolio_eyebrow` ("Portfolio"), `portfolio_title` ("Research & Projects")
- `contact_eyebrow` ("Contact")
- `resume_areas` (identical text to `hero_areas`, a taxonomy tag line, not prose)

Translated even though not literally listed in the task brief's translate enumeration — treated as
an oversight to fix for internal page consistency (these sit next to `contact_open_label`, which
*was* explicitly called out as translate, on the same page in the same label:value pattern):
- `contact_email_label` ("Email"), `contact_github_label` ("GitHub" — value stays "GitHub", only
  the label word around it is localized), `contact_lab_label` ("Lab")

If a future key looks like a short capitalized nav/section anchor → keep English by default.
If it looks like a field label (`X:` pattern) or a sentence of prose → translate by default.
When genuinely unsure, prefer translating field labels for internal consistency within a page
(e.g. don't leave one label in a label:value list untranslated while its siblings are translated).

Full translate/keep classification lives only in lang/kr.json and lang/jp.json themselves — diff
against lang/en.json to see exactly which 60 of 349 keys were translated per language (the rest are
byte-identical to en.json by design: `detail_<id>_*` bodies, `work_<id>_*`, resume item values,
`contact_email/github/lab_name/lab_addr`, `footer_affiliation/copyright`, pill/hero_cta titles).

See [[terminology]] for the actual approved strings and [[style]] for tone.
