---
name: illustration-review-loop
description: How to review illustration scenes — docs/gallery.html + headless Chrome screenshots
metadata:
  type: reference
---

`docs/gallery.html` (dev only, noindex, not deployed) renders every registered scene: thumb at
400px, hero at 900px, diagrams at 780px, each with an auto-computed checklist line
(label count vs the 08 limit of 4 thumb / 8 hero, accent element count, warn count, aria present).
It lists all seven `scenes/*.js` explicitly; files that do not exist yet just 404 harmlessly.
`?theme=dark` (or the toggle button) sets `data-theme` and the engine re-renders.

Review command (full page is ~5000px tall, taller than the 3000 used in early drafts):
`google-chrome --headless=new --disable-gpu --no-sandbox --hide-scrollbars --window-size=1400,5000 --screenshot=docs/spec/img/gallery-light.png file:///home/junon/my-website/docs/gallery.html`

Reviewed screenshots live in `docs/spec/img/gallery-light.png` and `gallery-dark.png`.
For debugging a specific overlap, crop the PNG with Pillow and upscale with `Image.NEAREST`;
`--dump-dom` prints the generated SVG when it is unclear which element drew a stray line.

Related: [[illustration-system]]
