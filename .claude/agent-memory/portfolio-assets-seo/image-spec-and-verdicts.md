---
name: image-spec-and-verdicts
description: Confirmed evidence-image judgement, spec values (max width/quality), and final output sizes for the redesign
metadata:
  type: project
---

Decided/verified in Phase 1+3 of the redesign (2026-09-07), branch `redesign-2026-09`.

**Evidence image policy (06-assets-seo-performance.md §1, confirmed by Q11):** thumbnails, hero
images, and explainer diagrams are all code-generated inline SVG (see 08-illustration-system.md).
Only real screenshots / measurement plots are raster. Two files needed a manual open-and-judge
in Phase 3:
- `CAN.png` (2422×944) → **delete**. It's a LabVIEW **block diagram** (wiring/code view — DBL
  terminals, byte-packing formula nodes, wires), not a front-panel UI screenshot. Spec's keep
  condition was explicitly "front panel screenshot"; block diagram doesn't qualify.
- `openCL.png` (875×436) → **keep**, renamed `opencl-result.png`. Real app output screenshot:
  "구현 기능" label with ORIGINAL/BLUR/GRAYSCALE/ROTATE tiles — an actual processing result, not
  a generated concept image.
- `rowscope.png` (1627×874) → kept per Q11 (real stride-analysis plot), renamed `rowscope-plot.png`.

Full reasoning is written to `docs/content/image-verdicts.md` each time (recreate if missing).

**Pipeline:** originals that are kept live in `assets/img/src/<name>.png` (git-tracked, source of
truth). `scripts/optimize-images.py` (Pillow, no cwebp/ImageMagick in this environment) reads
every `assets/img/src/*.png`, resizes to max width **1600px** (Lanczos, skips if already
narrower), and writes both `assets/img/<name>.webp` (quality **82**, method 6) and
`assets/img/<name>.png` (Pillow `optimize=True`) as fallback. Keeps alpha (`RGBA`) only if the
source has an alpha band, else flattens to `RGB` (avoids turning transparency into black).

**Budget note:** 06 §4 says evidence images should be <150KB. The WebP outputs are comfortably
under that (opencl-result.webp 25KB, rowscope-plot.webp 44KB) but the PNG **fallback** exceeds it
(opencl-result.png 316KB, rowscope-plot.png 210KB) because there's no pngquant/ImageMagick here
to shrink PNG further beyond Pillow's `optimize=True`. Treated as non-violation since `<picture>`
serves WebP first and the PNG is a legacy-browser fallback only — flag to planner if they want it
tightened further.

See also [[deletion-log]] and [[deploy-files-and-brand-assets]].
