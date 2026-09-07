---
name: content-unverified-claims
description: Portfolio claims the source documents contradict or do not support — corrected in the 2026-09 rewrite, still awaiting the owner's confirmation
metadata:
  type: project
---

# Claims the old site made that the documents do not support

Found while rewriting `lang/en.json` on 2026-09-07. All are tracked in `docs/content/gaps.md`
(sections A1–A6); this memory exists so a future rewrite does not quietly restore them.

**Why:** the site's stated principle is "numbers are evidence". Two of these were plainly wrong
against the owner's own reports, so restoring them would be a regression, not a rollback.

**How to apply:** if any of these reappears in a draft, check `gaps.md` before writing it, and ask
the owner rather than inferring.

| Claim (old site) | What the source says |
|---|---|
| OpenCL camera crash was traced to "a known hardware/API incompatibility" | `opencl-report.pdf` section 5.0 says the permission fix did not help, the same code worked in a separate project, and **the root cause was never found**. Page now says so. |
| OpenCL blur used a **5×5** mask | The `.cl` kernels live at `/data/local/tmp/*.cl` and are not in the report. Mask size unverified; the size was removed from the text. |
| 5G lab verified connectivity with `ping` / `iperf` | The report shows neither. It shows `RMR is ready now...`, the AMF NGAP address 10.53.1.2, and a conclusion that the whole chain ran. |
| CAN: "team of six with myself as team lead" | `CAN_project_report.docx` contradicts itself — the header lists 채언 as 팀장, the role table says 준헌 (팀장/본인), section 9 addresses "본인(채언)". Kept as team lead, flagged A1. |
| TA experience "2024", "40+ students" | Old `en.json` said 2024, spec 03 says 2025; student count unverified and dropped. |
| NRF Graduate Research Scholarship 2026.08 | Comes from the mockup only (spec 00 Q10). No document. |
| "Systems engineer intern · Summer 2024 · Blackwell hardware" | Unverifiable; deleted entirely per spec 03 section 4. |

Also removed as unevidenced: GPGPU-Sim and Nsight from the resume tools line (replaced with
PIMSimulator · PyTorch · LabVIEW · Matplotlib, all four of which appear in real work).

See [[evidence-sources]] for where to re-check any of this.
