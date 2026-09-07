# Content gaps

Facts that a page would be better with but that no source supports, plus claims that were on the
old site and are **not** backed by the documents. Nothing in this list is currently written into
`lang/en.json` as fact unless the row says so.

Priority: **A** = a visitor will notice or a claim could be wrong; **B** = would strengthen a page;
**C** = nice to have.

---

## A. Claims that need the owner to confirm or drop

| # | id | Issue | What is needed |
|---|---|---|---|
| A1 | can | **Was Junheon the team lead?** `CAN_project_report.docx` contradicts itself: the project header lists "채언(팀장), 재영, 준헌, …", the role table in section 1.2 says "준헌 (팀장 / 본인)", and the follow-up question list in section 9 addresses "본인(채언)". The site currently says team lead (works-data `role: "Team lead · 6 people"`, `detail_can_overview` says "our six-person team"). | One sentence from the owner: team lead, or member responsible for the bit map and LabVIEW logic. The overview and `role` change together. |
| A2 | resume | **NRF Graduate Research Scholarship 2026.08** (`resume_award1_*`). Written on the strength of spec 00 Q10 (the mockup) only. No document. | Confirm, or delete `resume_award1_title` / `resume_award1_sub`. |
| A3 | resume | **Teaching assistant period**. Old `resume_exp3_period` said 2024; spec 03 section 4 says 2025. Written as **2025**. The subject ("Systems programming") and the "40+ students" figure from the old entry were also unverified — the student count has been dropped. | Correct year, correct course name. |
| A4 | resume | **Skills lists.** Spec 03 section 4 proposed "GPGPU-Sim · PIMSimulator · Nsight · LabVIEW". GPGPU-Sim and Nsight appear nowhere in any work or document, so the tools line was written as "PIMSimulator · PyTorch · LabVIEW · Matplotlib" (all four are evidenced). Go and CUDA in the languages line are evidenced (eBPF collector, GPU baselines); C++ is claimed only through `pim_accel`. | Confirm the tool list, add GPGPU-Sim / Nsight back if they are real. |
| A5 | opencl | The old `detail_opencl_debug_*` claimed the camera crash was traced to "a known incompatibility with the specific hardware". The report says the opposite: the permission fix did not help, the same code worked in another project, and the cause was never identified. **The page now says the root cause was never found.** | Nothing needed unless the owner remembers more; the honest version is the defensible one. |
| A6 | opencl | The old text said the blur used a **5×5** neighbourhood. The `.cl` kernels are not in the report (they live at `/data/local/tmp/Blur.cl`), so the mask size is unverified and the text now says "a neighbourhood" without a size. | The kernel source, or the mask size from memory. |

## B. Missing measurements and conditions

| # | id | Missing | Effect today |
|---|---|---|---|
| B1 | ebpf | **No measured numbers at all.** No histogram data, no machine spec, no workload description. | `keyfact: null`, `results: null`, no stat tiles; Results is three qualitative bullets. The `histogram` diagram in spec 08 section 4.2 stays unbuilt. A single `runqlat.csv` from one run would turn this into the strongest project page on the site. |
| B2 | opencl | **Image resolution and device model unknown.** The test image is `lena.bmp`; the board is only identifiable as Mali through `libGLES_mali.so`. | The 2059 → 246 ms numbers are stated without image size or device, which is exactly the condition a reviewer asks for. One line from the owner fixes all four numbers at once. |
| B3 | rowscope | **No repository, no report artifact.** The pipeline, file names and numbers are described but nothing is linkable. | `artifacts: []`. |
| B4 | rowscope | Working-set sweep: "nine log-spaced working sets, 512 KB – 128 MB, hit rate constant at 99.95%" is stated but only the stride plot exists as an image. | Fine as prose; a second plot would make it evidence. |
| B5 | dynamic_moh | Model and GPU are hedged in the old text ("e.g., MoH-LLaMA3-8B", "e.g., NVIDIA L40"). `arch_body` now says "a Mixture-of-Head attention model served with PyTorch and Transformers" and names no GPU. | Naming the exact model and GPU would make the page concrete. |
| B6 | dynamic_moh | The accuracy-vs-rho knee is described qualitatively with no rho value, no metric and no dataset. | `results: null`. One curve would replace three sentences. |
| B7 | pim_accel | No numbers of any kind yet; the Zipf-skew crossover is stated as the target, not a result. | `results: null`, `keyfact: null`. Correct as written — the page says so. |
| B8 | 5g_oran | The report shows no `ping` / `iperf` output; the old `detail_5g_validation_item3` claimed both. The claim is now "core, RIC, gNB and UE run together as one chain", which is what the report's conclusion supports. | Screenshots or logs would let the stronger claim come back. |
| B9 | ebpf, rowscope | **Period unknown.** ebpf uses "2025.12 – 2026.02" from the spec 03 example; rowscope uses the single month "2025.12". | Real start dates. |

## C. Structural / follow-up

| # | Item | Note |
|---|---|---|
| C1 | GitHub links | Spec 00 Q8: no repository URLs, so `artifacts` has no `kind: "code"` entries anywhere. Adding a URL to `works-data.artifacts` is all that is needed — the button renders automatically. |
| C2 | CV PDF | Spec 00 Q7: `SITE.cvUrl = null`, so the Home and Resume CV buttons do not render. `hero_cta_cv` and `resume_cv_cta` exist and are ready. |
| C3 | Evidence images | Final after the Phase 3 asset pass: rowscope (`rowscope-plot.png/webp`, 1600×859) and opencl (`opencl-result.png/webp`, 875×436) are kept and captioned; `CAN.png` was a block diagram and was deleted, so `can.evidence` is `[]`. Both caption keys (`detail_rowscope_evidence1`, `detail_opencl_evidence1`) exist. |
| C4 | References section | Spec 05 section 3 allows `detail_<id>_ref1..n` on research pages. No citation was available from any source, so both research pages have no `s7` and the References section is omitted. The MoH paper the work builds on should be cited once the exact reference is confirmed. |
| C5 | kr/jp sync | This rewrite replaced `lang/en.json` entirely: 385 old keys out, 349 new keys in, and the id prefixes changed (`5g` → `5g_oran`, `moh` → `dynamic_moh`, `pim` → `pim_accel`). `kr.json` and `jp.json` are untouched and now share almost no keys with `en.json`. The i18n agent has to regenerate both from scratch. |
| C6 | Dead keys removed | All `detail_esmoe_*`, `detail_orion_*`, `detail_cxl_*`, `detail_llm_*`, `work_esmoe_*`, `work_orion_*`, `work_cxl_*`, `work_llm_*`, `sidebar_*`, `intro_*`, `profile_*`, `contact_card_*`, `contact_form_*`, `work_*_date`, `resume_pub*`, `resume_proj*`, `resume_intro_*`, `detail_*_skills_*`, `detail_*_artifacts_*`, `detail_*_role/timeline/stack`, `footer_text` are gone. |
