---
name: og-image-generation
description: How assets/img/og.png is built (scripts/make-og.sh) — headless Chrome quirk, layout, and file facts
metadata:
  type: project
---

Built 2026-09-07 on `redesign-2026-09`. Regenerate any time with
`scripts/make-og.sh` (no args, writes `assets/img/og.png` in place).

**Headless Chrome viewport quirk (important, cost real time to debug):** on
this machine, `google-chrome --headless=new --window-size=W,H --screenshot=`
does **not** give you an H-pixel-tall viewport. `--window-size` is the outer
window size; the actual page viewport is roughly **90px shorter** than
requested (confirmed both at 630→~540 and 900→~809, so it's a near-constant
chrome-UI offset, not proportional). Content below that line is simply
absent from the render — not squished, just not captured — and the output
PNG is still padded to the full requested `--window-size` with white below
the cutoff. **Fix:** request `--window-size=W,H+130ish` (used `760` for a
`630` target), screenshot, then crop the top `WxH` pixels with Pillow. Do
NOT trust a headless-Chrome screenshot's content to reach the bottom edge of
a `--window-size`-dimensioned canvas without verifying this on a fresh
machine — check with a plain colored `<div>` fixture first if the tool
versions differ from what's recorded here.

**og.png composition (1200×630):** flex row, not the site's `.hero` grid
(spec explicitly wants a bespoke OG layout, not a literal reuse of
`pages.css` `.hero`). Left column fixed `flex:0 0 640px`, generous left
padding (72px), vertically centered via `justify-content:center` on a
column flexbox: mono blue eyebrow → Manrope 800 navy name (Korean + `|
Junheon Lee` in `--slate`, smaller) → mono slate one-liner. Domain string
pinned `position:absolute; bottom:44px` so it doesn't get pulled into the
vertical centering. Right column `flex:1 1 auto`, `--tint`→`--blue-soft`
gradient + the same 28px blueprint-grid pseudo-element pattern as
`.visual` in `pages.css`, centering the **real** `home.hero` scene
(`assets/js/illustrations.js` + `assets/js/scenes/home.js`, loaded via
`data-illus="home.hero"` and Illus's own `DOMContentLoaded` boot — no
manual `Illus.render()` call needed) at a fixed `460px` CSS width (native
1:1 with its `460×300` viewBox, not stretched to fill the panel — filling
the full 630px panel height by stretching would need `preserveAspectRatio`
slice/crop, which was not worth the visual tradeoff; centered at native
size instead).

**Font note:** Google Fonts (`fonts.googleapis.com`/`fonts.gstatic.com`) IS
reachable from this environment (verified `curl -sI` → 200), so headless
Chrome renders true Manrope/Noto Sans KR/JetBrains Mono, not the DejaVu
fallback used for Pillow-only rasterization (see
[[deploy-files-and-brand-assets]] for the Pillow-side font limitation,
which does NOT apply here since this pipeline is a real browser render).
`--virtual-time-budget=4000` was enough for fonts to finish loading in
every run tested; one intermediate debug screenshot (with `--window-size`
not yet fixed) showed the `home.hero` scene's "GPU" leader label
overlapping its own caption text — this only happened in one debug capture
and is suspected to be a font-not-yet-loaded layout race (fallback
monospace is a different width than JetBrains Mono, shifting anchor='end'
label positions), not a bug in `home.js` itself. The final production
`og.png` render was clean. If a future regeneration shows this overlap
again, bump `--virtual-time-budget` higher before suspecting the scene
code (which this agent does not own/edit anyway).

**Output facts:** final `assets/img/og.png` is 1200×630 RGB, quantized to
≤256 colours (`Image.quantize(colors=256, method=MEDIANCUT,
dither=FLOYDSTEINBERG)`) — costs about 1% file size vs. no quantization on
this flat/gradient design (no photographic content) and is visually
identical at social-preview scale, so kept it per the task's ask. Final
size **~99–100KB**, comfortably under the 150KB evidence-image budget (this
isn't an evidence image but same budget used as the ceiling).

**2026-09-07 revision (coordinator-requested tweaks, same session):** two
things were off in the first pass and got fixed in `make-og.sh` directly
(no new script, same file edited in place):
1. The `home.hero` scene's actual drawing only filled ~40% of the right
   panel width (the `460×300` viewBox has a lot of empty margin around the
   isometric objects). Fix: bumped `.og-visual svg` CSS width from `460px`
   to `736px` (1.6×) while leaving the panel (`.og-visual`, `overflow:hidden`,
   `display:flex;align-items:center;justify-content:center`) untouched — the
   SVG now overflows its flex box and gets center-cropped, which reads as a
   zoom/crop rather than a squish (aspect ratio preserved, `height:auto`).
   The CSS grid pseudo-element background (`.og-visual::before`) already
   covered the full panel before and after this change since it's sized off
   `.og-visual`, not the svg — nothing needed there. Verified by cropping
   just the right panel and eyeballing the drawing's bounding box vs. panel
   width: comes out around 85–90% including the leader-line labels, ~75%
   for just the solid isometric shapes — matches the "~85%" ask well
   enough, didn't chase exact pixels further.
2. `.og-areas` (the "Computer Architecture · Memory Systems · GPU Systems"
   line) was wrapping to a orphaned second line ("GPU" alone, or "GPU /
   Systems") at `19px` in a `640px`-wide left column (effective text width
   568px after the 72px left padding — not enough for that string in
   JetBrains Mono at 19px). Fixed with **both** levers at once rather than
   picking one: widened `.og-text` flex-basis `640px → 660px` *and* dropped
   `.og-areas` to `16px`, plus added `white-space:nowrap` as a hard
   guarantee. Don't reduce below ~15px without re-checking legibility at
   OG-thumbnail scale (Slack/Discord/X previews render this quite small).
3. Net file size after both changes: **~108KB**, still comfortably under
   the 150KB ceiling.

See also [[deploy-files-and-brand-assets]], [[head-audit-2026-09]].
