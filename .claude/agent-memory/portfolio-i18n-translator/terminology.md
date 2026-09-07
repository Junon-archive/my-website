---
name: terminology
description: Approved KR/JP terms for recurring UI chrome and proper nouns in lang/*.json
metadata:
  type: project
---

Approved translations (reuse verbatim when the same English string reappears):

- "Architecture & Computer Systems Laboratory, University of Seoul" → KR "서울시립대학교 컴퓨터구조 및 시스템 연구실" / JP "ソウル市立大学 コンピュータアーキテクチャ・システム研究室"
- Name (Korean, per 00 spec §5 Q2): "이준헌". Name (Japanese, fixed by past commits — do not change): "イ・ジュノン" (full form with hanja seen in old jp.json: "イ・ジュノン (李 俊憲)"; short form "イ・ジュノン" is fine in flowing prose like meta descriptions).
- nav_resume → KR "이력서" / JP "履歴書" (not "経歴" — 履歴書 is the standard JP word for résumé/CV; reused from the pre-redesign jp.json).
- nav_contact → JP "連絡先" (old jp.json had bare "連絡" — superseded, "連絡先" is more complete and matches temp/preview_v2.html).
- "Download CV" (hero_cta_cv, resume_cv_cta) → KR "CV 다운로드" / JP "CVをダウンロード".
- "Open to" (contact_open_label) → KR "열려 있는 것" / JP "募集中" — reused from temp/preview_v2.html I18N dict per explicit instruction to mine that file for contact-section wording.
- badge_progress "In progress" → KR "진행 중" / JP "進行中"; badge_done "Completed" → KR "완료" / JP "完了" (matches 03 spec default).
- detail_common_evidence "Evidence" → KR "근거 자료" / JP "エビデンス".
- footer_quote → KR "시스템을 이해하고, 진실을 측정하고, 더 나은 해결책을 만듭니다." / JP "システムを理解し、真実を測定し、より良い解決策を築く。" (JP kept as a terse motto, not です・ます, since it functions as a slogan/tagline rather than prose).

See [[scope-decisions]] for which key families are translated vs. kept English, and [[style]] for tone rules.
