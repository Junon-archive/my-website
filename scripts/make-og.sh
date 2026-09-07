#!/usr/bin/env bash
# scripts/make-og.sh — regenerate assets/img/og.png (1200x630) from the live
# design tokens + the home.hero illustration, via a headless-Chrome screenshot.
#
# Requires: google-chrome (or chromium) on PATH, python3 + Pillow.
# Spec: docs/spec/06-assets-seo-performance.md §1 "신규 자산".
#
# Usage: scripts/make-og.sh
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="$ROOT/assets/img/og.png"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

CHROME="$(command -v google-chrome || command -v google-chrome-stable || command -v chromium || command -v chromium-browser || true)"
if [ -z "$CHROME" ]; then
  echo "make-og.sh: no headless-capable Chrome/Chromium found on PATH" >&2
  exit 1
fi

cat > "$WORK/og.html" <<HTML
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>OG</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Noto+Sans+KR:wght@400;500;700&family=JetBrains+Mono:wght@400;600&family=Caveat:wght@500&display=swap">
<link rel="stylesheet" href="file://$ROOT/assets/css/tokens.css">
<link rel="stylesheet" href="file://$ROOT/assets/css/base.css">
<style>
  html,body{width:1200px;height:630px;margin:0;overflow:hidden}
  body{background:var(--paper);position:relative}
  .og{
    width:1200px;height:630px;display:flex;
  }
  .og-text{
    flex:0 0 660px;
    padding:72px 0 56px 72px;display:flex;flex-direction:column;justify-content:center;
    position:relative;
  }
  .og-eyebrow{
    font-family:var(--mono);font-size:15px;font-weight:600;color:var(--blue);
    letter-spacing:.1em;text-transform:uppercase;margin-bottom:22px;
  }
  .og-name{
    font-family:var(--display);font-weight:800;color:var(--navy);
    font-size:64px;line-height:1.08;letter-spacing:-.03em;margin:0 0 22px;
  }
  .og-name .en{font-weight:600;font-size:.56em;color:var(--slate);letter-spacing:-.01em;margin-left:.35em}
  .og-areas{
    font-family:var(--mono);font-size:16px;color:var(--slate);margin:0;white-space:nowrap;
  }
  .og-domain{
    position:absolute;left:72px;bottom:44px;
    font-family:var(--mono);font-size:15px;color:var(--slate);letter-spacing:.02em;
  }
  .og-visual{
    flex:1 1 auto;
    position:relative;overflow:hidden;
    background:linear-gradient(150deg,var(--tint),var(--blue-soft));
    border-left:1px solid var(--line);
    display:flex;align-items:center;justify-content:center;
  }
  .og-visual::before{
    content:"";position:absolute;inset:0;
    background-image:linear-gradient(var(--line) 1px,transparent 1px),
                     linear-gradient(90deg,var(--line) 1px,transparent 1px);
    background-size:28px 28px;opacity:.45;
  }
  .og-visual svg{position:relative;width:736px;height:auto;display:block}
</style>
</head>
<body>
  <div class="og">
    <div class="og-text">
      <div class="og-eyebrow">Computer Architecture &amp; Memory Systems</div>
      <h1 class="og-name">이준헌<span class="en">| Junheon Lee</span></h1>
      <p class="og-areas">Computer Architecture · Memory Systems · GPU Systems</p>
      <div class="og-domain">junon-lee.pages.dev</div>
    </div>
    <div class="og-visual" data-illus="home.hero" aria-hidden="true"></div>
  </div>
<script src="file://$ROOT/assets/js/illustrations.js"></script>
<script src="file://$ROOT/assets/js/scenes/home.js"></script>
</body>
</html>
HTML

# NOTE: headless Chrome's --window-size is an *outer* window size, not the
# viewport — on this machine the effective viewport is ~90px shorter than
# requested, so content past that line is simply absent from the screenshot
# (the canvas is still window-size, padded white). Render tall, then crop
# back down to the true 1200x630 target.
"$CHROME" --headless=new --disable-gpu --no-sandbox --hide-scrollbars \
  --window-size=1200,760 --virtual-time-budget=4000 \
  --screenshot="$WORK/raw.png" "file://$WORK/og.html" >/dev/null 2>&1

python3 - "$WORK/raw.png" "$OUT" <<'PY'
import sys
from PIL import Image

raw_path, out_path = sys.argv[1], sys.argv[2]
im = Image.open(raw_path).convert('RGB').crop((0, 0, 1200, 630))

# Quantizing to <=256 colours costs ~1% size here (flat/gradient design, no
# photographic content) and is visually identical at social-preview scale.
q = im.quantize(colors=256, method=Image.MEDIANCUT, dither=Image.FLOYDSTEINBERG).convert('RGB')
q.save(out_path, optimize=True)
print(f"{out_path}: {im.size[0]}x{im.size[1]}, {Image.open(out_path).size}")
PY

echo "make-og.sh: wrote $OUT ($(du -h "$OUT" | cut -f1))"
