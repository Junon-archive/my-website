---
name: deletion-log
description: What was deleted/renamed in the Phase 1/3/4 cleanup pass on redesign-2026-09 and what's still pending
metadata:
  type: project
---

Branch `redesign-2026-09`, 2026-09-07. All done via `git rm`/`git mv` (staged, not committed —
this agent does not commit).

**Deleted pages:** project_esmoe.html, project_orion.html, project_example1.html,
research_cxl.html, research_offloading.html, remote.html, assets/js/sidebar.js,
assets/css/project.css. Reference check before deletion found only mentions in old pages
(index.html, portfolio.html, contact.html, resume.html, project_*.html, research_*.html) that are
themselves being rewritten by other agents in this same redesign — expected per the launching
task, not a blocker.

**Deleted images (20 files, zero real references found, only doc mentions):** CAN.png (see
[[image-spec-and-verdicts]] for why, not just "unused"), eBPF.png, oran_5g_system.png,
dynamic_moh.png, pim_accel.png, alien.png, nyancat.jpg, laiming.png, paper01_hero.jpg,
paper01_thumb.jpg, paper02_hero.jpg, paper02_thumb.jpg, project01_hero.jpg, project01_thumb.jpg,
project02_hero.jpg, project02_thumb.jpg, profile.jpg, mono_profile.png,
mono_profile_background.jpg, oran_5g.png.

**Kept + renamed (moved to assets/img/src/ as source of truth, then piped through
scripts/optimize-images.py):** rowscope.png → src/rowscope-plot.png, openCL.png →
src/opencl-result.png.

**PDF renames/conversions (assets/pdf/, ASCII-only names, personal ID number removed from
filenames per spec):**
- `project_oran_5g.pdf` → `5g-oran-report.pdf`
- `CAN/CAN_presentation.pdf` → `can-slides.pdf`
- `CAN/CAN_project_report.docx` → converted to `can-report.pdf` via `soffice --headless
  --convert-to pdf` (LibreOffice **is** installed here, see [[deploy-files-and-brand-assets]]) —
  do NOT assume this needs manual conversion next time, check `which soffice` first.
- `Android_OpenCL_GPU/마프실_PPT_Project_2019440100_이준헌.pdf` → `opencl-slides.pdf`
- `Android_OpenCL_GPU/마프실_Project_2019440100_이준헌.pdf` → `opencl-report.pdf`
- Deleted (class material, not the user's own output): `2023 마프응 프로젝트 안내.pdf`,
  `Ch12. OpenCL_JNI_template.pdf`
- Empty subfolders `assets/pdf/CAN/` and `assets/pdf/Android_OpenCL_GPU/` removed after the
  moves (also found and removed a stray untracked empty dir tree
  `assets/pdf/CAN/.claude/agent-memory/portfolio-master-planner/` — looked like another agent's
  memory dir had been accidentally created inside the asset tree; it was empty and untracked, so
  just cleaned up, nothing lost).

**Still missing (not an error, expected per Q7):** `assets/pdf/Junheon_Lee_CV.pdf` does not
exist. Do not create a CV link/button; per 00-overview.md Q7 the CTA should stay hidden until the
user drops a real file at that path.

**Not yet present in the repo (built by other agents/scripts, not mine to create):**
`scripts/check.mjs` didn't exist yet as of this pass — couldn't run the post-deletion check step
my base instructions call for. Try again once the senior-dev/implementer agent adds it.

See also [[image-spec-and-verdicts]], [[deploy-files-and-brand-assets]].
