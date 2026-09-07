---
name: headless-chrome-flag-traps
description: Chrome 146 headless=new CLI flags that silently fail — window-size floor and preferredColorScheme — and the CDP workaround
metadata:
  type: feedback
---

`google-chrome --headless=new` (Chrome 146.0.7680.177, this machine) has two CLI flags that look like
they work but silently produce wrong results. Both were caught during Phase 5 QA of the junon-lee
redesign by cross-checking with real CDP calls before filing bugs — do this cross-check *before*
reporting any responsive/dark-mode defect found via plain `--screenshot`.

1. **`--window-size=W,H` is clamped to a minimum width of ~500px.** Requesting 360/400/440/480 still
   lays out the page at 500px internally, but `--screenshot` crops/scales the output PNG down to the
   requested W×H anyway — so narrow-viewport screenshots show text cut off mid-word, which looks
   exactly like a horizontal-overflow CSS bug but isn't one. Confirmed by loading a page that writes
   `window.innerWidth` into `document.title` and reading it back with `--dump-dom`.
2. **`--blink-settings=preferredColorScheme=2` does not force dark mode.** `matchMedia('(prefers-color-scheme: dark)').matches` stays `false`; screenshots taken this way are silently still light mode.

**Workaround (use for anything below 500px or for dark-mode capture):** launch Chrome once with
`--remote-debugging-port=9222 --remote-allow-origins=*` in the background, then drive it over the
CDP WebSocket (`pip install --break-system-packages websocket-client`, plain `json`/`urllib` for the
`/json/new` PUT handshake). Two CDP calls fix both traps:
- `Emulation.setDeviceMetricsOverride({width, height, deviceScaleFactor:1, mobile:true})` for a true
  narrow viewport (verified 360px this way: `scrollWidth === clientWidth === 360`, no overflow).
- `Emulation.setEmulatedMedia({features:[{name:'prefers-color-scheme',value:'dark'}]})` for real dark
  mode (verified visually — tokens.css dark palette applies correctly).

A minimal reusable script for this lives conceptually as `cdp_shot.py` (navigate → optionally set dark
media → measure `scrollWidth`/`clientWidth`/widest-element via `Runtime.evaluate` → `Page.captureScreenshot`).
Recreate it in the scratchpad each session; do not assume `--window-size` alone is trustworthy for
anything at or below 500px, or that `--blink-settings` toggles color scheme.

Related: [[false-positive-before-reporting]]
