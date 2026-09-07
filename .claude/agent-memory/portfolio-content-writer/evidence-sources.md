---
name: evidence-sources
description: Where every portfolio number actually comes from, including facts that only exist inside PDF images and the extraction commands that work
metadata:
  type: reference
---

# Where the portfolio's facts live

The full ledger is `docs/content/sources.md`. This memory records the things that cost time to
find and would cost the same time again.

## Facts that are NOT in extractable text

- **OpenCL timings (2059 / 246 / 81 / 72 ms)** exist only as photographs of the device screen
  embedded in `assets/pdf/opencl-slides.pdf`, **pages 6 and 8**. `pdftotext` returns nothing for
  them. Read them with:
  `pdftoppm -r 110 -png -f 6 -l 8 assets/pdf/opencl-slides.pdf out` then view the PNGs.
  8.4× is 2059/246 computed, not printed anywhere.
- **RowScope's 29 detail keys** were never in `lang/en.json`. They only existed in
  `assets/js/lang-data.js` — recover with `git show c63dab9:assets/js/lang-data.js` (also the only
  home of `detail_opencl_role/_timeline/_stack`).

## Extraction commands

- PDFs: `pdftotext -layout <file> -`. The 5G and OpenCL reports are Korean.
- CAN report is `.docx`, no pandoc in this environment. Use:
  `python3 -c "import zipfile,re,html; x=zipfile.ZipFile('f.docx').read('word/document.xml').decode('utf8'); x=re.sub(r'</w:p>','\n',x); print(html.unescape(re.sub(r'<[^>]+>','',x)))"`

## Source quality, per work

- **can, 5g_oran, opencl** — real documents, dense with verbatim commands, code and numbers. The
  CAN docx is the richest single source on the site (bit map table, Formula Node code, test values).
- **rowscope, ebpf, dynamic_moh, pim_accel** — no external document at all. Every claim traces
  back to prose the owner wrote himself in the old `en.json` / `lang-data.js`. Do not treat these
  as verified; do not extend them with numbers.
- `assets/img/rowscope-plot.png` is a genuine measured plot (hit rate + conflict rate vs stride,
  2^0 to 2^10) — it confirms the "11 stride values, 1 to 1024" claim independently.

See [[content-unverified-claims]] for the claims these sources contradict.
