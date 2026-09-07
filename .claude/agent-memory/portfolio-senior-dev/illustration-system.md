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
    `leader()`; leaders crossing the object they point into look sloppy. When the scene is wide
    and low (a card/DIMM), two columns (one per side) beat one.
  - A "fan" of free-floating lines only reads as *falling* if the drop in `h` exceeds `0.5 * da`:
    in the 30 degree projection every +1 of `a` lifts the screen point by 0.5. Long hops toward
    +a visibly climb. Fixes: keep the fan inside one plane (lines drawn on a slab's top face read
    as sliding, not rising), bias long hops toward -a, or add a `b` offset (-b descends).
  - A 16:9 thumb frame cannot be filled by an isometric object: the natural aspect of a flat iso
    plan is 0.87/0.5 = 1.74 and any stack height lowers it further. Target ~80% of the height and
    accept ~60% of the width, then put labels in the empty corner triangles. Beware: those corners
    are bounded by diagonal edges, so horizontal text placed "just outside" a corner usually
    crosses the edge a few characters in.
  - Ghost (outline-only) cells read as scattered debris. Use `fill:'paper'` for the inactive cells
    and solid `onFill:'accent'` for the highlighted ones.
  - A bare `--line` stroke on a `--tint` slab is invisible at thumb scale. Draw connective
    structure (a bus, a branch stub, a trace) as a flat `fill:'paper'` iso box ~1 unit high
    instead of a line: the paper face plus its outline reads as a physical wire in both themes.
  - Anything riding on such a track must be *narrower in `b`* than the track, or it hides it.
    A row of small iso boxes spaced at their own width fuses into one slab; a "burst" needs
    spacing of at least ~1.8x the box width before it reads as discrete packets.
  - Stacking a scene's nodes on one side of the track (all at high `b`) keeps the front of the
    slab free for direct labels and avoids the +a / -b screen-space collisions that appear when
    a front node sits at high `a`.
  - A 16:9 thumb cannot hold a two-level iso scene at 80% width: the ground plane's screen
    aspect is fixed at 1.74:1 and every unit of vertical stacking adds height only. A two-storey
    scene tops out near 60% frame width / 85% height — put the upper level up-AND-right
    (staircase along +a) rather than straight above, and lift it only just enough to clear the
    back-top corner of whatever it passes over (compute the corner, do not eyeball it).
  - Arrows from a row of objects into a shared target read as spaghetti unless the target sits
    in FRONT of the row's centre (smaller b); then the three arrows form a short converging fan.
  - A label column with leaders to a row of iso objects that ascend to the right produces
    crossing leaders. Stagger one label beside each object instead: the iso pitch gives ~34px of
    vertical separation, which is enough for labels that overlap horizontally.
  - Multi-line labels on an iso top face must be centred by hand
    (y = top.y + 3.5 - (n-1)*lineHeight/2); `label()`'s `above` shifts a full line, not half.
  - Labels for links in the narrow gap between two iso containers always land on a face. Seat
    them on the floor slab's front strip (b ~ 0) instead — clear of every box, still on the slab.
- Thumbs and heroes are **auto-fitted**: after the scene runs, the engine wraps the drawn content
  in `<g data-illus-content>`, measures its bbox, pads 6%, expands to 16:9 / 3:1 and rewrites the
  viewBox (the grid is a pattern-filled rect that is resized to match). Text is rescaled by the same
  factor so rendered px stay constant. Diagrams and any scene that sets `fn.width`/`fn.height`
  (home.hero) keep their declared box and the 10.5-unit label size; everything else gets
  12 units (thumb) / 15 units (hero) so labels read at ~10-11 CSS px. Consequence for scene
  authors: multi-line labels placed **on** an isometric top face overflow it at hero size — put
  hero labels beside the object with `leader()`.
  - The engine auto-fits thumb/hero viewBoxes to drawn content and picks the base label size by
    kind (`ctx.font`: thumb 12, hero 15, diagram 10.5 scene units). Two consequences for a scene:
    never hardcode `lineHeight` — derive it from `ctx.font` (a hardcoded 12.5 under a 15-unit font
    makes multi-line labels overlap themselves); and do not hand-tune the origin to centre a scene,
    the fit does that. Shrinking a label with `{size}` to make it fit is usually the wrong fix:
    a hero at body width (~780px) renders `ctx.font` at ~9.5px, so 0.8x is already illegible —
    shorten the string instead and move the detail to a leader in free space.
- Thumb and hero share one parametric `stage(svg, ctx)` with a scale factor `k` and an origin per
  variant; every dimension is `n * k`, so labels derived from projected points work at both sizes.

Related: [[illustration-review-loop]]
