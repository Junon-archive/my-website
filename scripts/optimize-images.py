#!/usr/bin/env python3
"""Generate WebP + resized PNG fallbacks for evidence images.

Source: assets/img/src/*.png (real screenshots / measurement plots only —
see docs/content/image-verdicts.md for the keep/delete judgement).

Output: assets/img/<name>.webp (max width 1600, quality 82)
        assets/img/<name>.png  (max width 1600, optimized fallback)

Per docs/spec/06-assets-seo-performance.md section 1.
"""
import pathlib
from PIL import Image

MAX_WIDTH = 1600
WEBP_QUALITY = 82

SRC_DIR = pathlib.Path(__file__).resolve().parent.parent / "assets" / "img" / "src"
OUT_DIR = SRC_DIR.parent


def resized(im):
    w, h = im.size
    if w <= MAX_WIDTH:
        return im
    new_h = round(h * (MAX_WIDTH / w))
    return im.resize((MAX_WIDTH, new_h), Image.LANCZOS)


def main():
    rows = []
    for p in sorted(SRC_DIR.glob("*.png")):
        name = p.stem
        im = Image.open(p)
        # Keep alpha if present, otherwise flatten to RGB (avoids black backgrounds
        # for opaque screenshots, preserves transparency where it matters).
        mode = "RGBA" if "A" in im.getbands() else "RGB"
        im = im.convert(mode)
        im = resized(im)
        w, h = im.size

        webp_path = OUT_DIR / f"{name}.webp"
        png_path = OUT_DIR / f"{name}.png"

        im.save(webp_path, "WEBP", quality=WEBP_QUALITY, method=6)
        im.save(png_path, "PNG", optimize=True)

        webp_kb = webp_path.stat().st_size / 1024
        png_kb = png_path.stat().st_size / 1024
        rows.append((name, w, h, webp_kb, png_kb))

    print("| name | width | height | webp KB | png KB |")
    print("|---|---|---|---|---|")
    for name, w, h, webp_kb, png_kb in rows:
        print(f"| {name} | {w} | {h} | {webp_kb:.1f} | {png_kb:.1f} |")


if __name__ == "__main__":
    main()
