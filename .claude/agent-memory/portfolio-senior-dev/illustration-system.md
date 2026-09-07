---
name: illustration-system
description: Decisions and gotchas for the window.Illus inline-SVG illustration engine (assets/js/illustrations.js + scenes/)
metadata:
  type: project
---

The redesign draws every thumbnail, detail hero and explanatory diagram as inline SVG built by
`window.Illus` (classic script, no modules, file:// safe). Scenes live in `assets/js/scenes/<id>.js`
and register themselves as `Illus.scenes.<id> = { thumb, hero, <diagram>, ... }`.

**Why:** spec docs/spec/08-illustration-system.md replaces raster concept art with code-generated
blueprint schematics so figures follow the design tokens and work in dark mode.

**How to apply:**
- Colours are resolved from CSS custom properties at render time; a re-render is triggered by
  `prefers-color-scheme` change and by `data-theme` mutation on `<html>`. Never hardcode hex in a
  scene — the only hex in JS is the documented `FALLBACK` map in illustrations.js.
- Non-obvious traps learned while building the two reference scenes:
  - A `--blue` arrow pointing at a solid `--blue` element is invisible. Keep the accent on ONE
    element and stop arrowheads ~8 iso units short of it, on a light face.
  - In a 2-row isometric bank array the screen space directly above a front cell is occupied by the
    back row. Arrows/labels aimed at a front cell must come from the front-right (perpendicular to
    the a-axis), not from "above".
  - Access marks spaced along one cell are ~8px apart at thumb scale; 3 marks with 14-unit spacing
    is the practical maximum that still reads.
  - For hero labels put a single label column in the free space beside the object and use
    `leader()`; leaders crossing the object they point into look sloppy.
  - Ghost (outline-only) cells read as scattered debris. Use `fill:'paper'` for the inactive cells
    and solid `onFill:'accent'` for the highlighted ones.
- Thumb and hero share one parametric `stage(svg, ctx)` with a scale factor `k` and an origin per
  variant; every dimension is `n * k`, so labels derived from projected points work at both sizes.

Related: [[illustration-review-loop]]
