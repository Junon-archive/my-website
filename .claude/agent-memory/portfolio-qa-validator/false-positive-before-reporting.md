---
name: false-positive-before-reporting
description: Always reconfirm a suspected layout/render bug with a second, independent measurement before writing it into a QA report
metadata:
  type: feedback
---

Rule: before filing a "blocker" or "major" defect based on a headless-Chrome screenshot or a grep
result, reproduce it a second way that doesn't share the same tooling assumption. Two concrete
incidents from Phase 5 QA of the junon-lee redesign:

1. Screenshots at 360/400/440/480px width via `--window-size` showed text clipped mid-word on
   index/portfolio/detail pages — looked like a real horizontal-overflow bug (and I spent real effort
   binary-searching the "threshold width" before doubting the tool). It was entirely a Chrome flag
   floor (see [[headless-chrome-flag-traps]]); a true CDP-driven 360px viewport showed zero overflow.
   Lesson: when a CSS overflow bug's "threshold width" doesn't match any breakpoint in the actual CSS
   (here the site only defines ≤960/≤600 breakpoints, yet the clipping "started" around 460-480px),
   that mismatch itself is a signal to suspect the tool, not the CSS.
2. `grep -oE 'data-work-id="[a-z_]*"'` (character class missing digits) silently failed to match
   `data-work-id="5g_oran"`, making it look like the 5g_oran card was missing from the portfolio grid
   / filter output. Re-grepping with a correct pattern (or just `grep -c '5g_oran'`) showed it was
   present all along. Lesson: when a regex-based structural check reports something "missing" from a
   generated list, grep for the raw substring directly as a sanity check before concluding the app
   logic is broken.

**Why this matters for this project specifically**: the QA report goes straight to other agents
(senior-dev, dev-implementer, etc.) who will spend real effort chasing whatever is written down. A
retracted false positive costs nothing if caught before reporting; it costs another agent's whole
investigation cycle if it ships in the report.

Related: [[headless-chrome-flag-traps]]
