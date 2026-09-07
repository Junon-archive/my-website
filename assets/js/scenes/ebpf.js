/* ==========================================================================
   assets/js/scenes/ebpf.js — latency observability with eBPF (08 section 4.2)
   scenes: thumb (400x225), hero (1200x400), pipeline (780x230)
   The single --blue subject is the measurement path:
   tracepoint pins -> BPF map -> user-space collector. Everything the path
   passes through is drawn in --line / face shading so the path stays alone.
   ========================================================================== */
(function () {
  'use strict';
  var I = window.Illus;
  if (!I) return;
  var P = I.P;

  /* --------------------------------------------------------------- scene */
  /* One parametric composition; `hero` is the same scene at a larger scale
     with more labels (08 section 4: thumb = narrow crop of the hero). */
  function stage(s, ctx) {
    var hero = ctx.variant === 'hero';
    var k = hero ? 1.7 : 0.95;
    var O = hero ? [481, 374] : [148, 211];
    var t = ctx.tokens, i;
    var F = ctx.font || 10.5;

    I.grid(s);

    /* ---- kernel: the thick slab everything is measured inside ---------- */
    var KW = 176 * k, KD = 54 * k, KH = 30 * k;
    I.isoBox(s, O, KW, KD, KH);

    /* ---- three tracepoint pins standing on the kernel ------------------ */
    /* drawn back (large a) to front so the caps never clip each other      */
    var pinA = [16, 56, 96], pw = 6 * k, ph = 20 * k, cs = 12 * k;
    var caps = [], po, co;
    for (i = 2; i >= 0; i--) {
      po = P(O, pinA[i] * k, 36 * k, KH);
      I.isoBox(s, po, pw, pw, ph);
      co = P(po, -(cs - pw) / 2, -(cs - pw) / 2, ph);
      I.isoBox(s, co, cs, cs, 3 * k);
      caps[i] = P(co, cs / 2, cs / 2, 3 * k);
    }

    /* ---- BPF map: in front of the pin row, so the probes fan into it --- */
    var MW = 48 * k, MD = 22 * k, MH = 11 * k;
    var mo = P(O, 40 * k, 2 * k, KH);
    I.isoBox(s, mo, MW, MD, MH, { fill: 'accent-soft' });
    var mapFront = P(mo, 0, 0, 0);
    var mapR = P(mo, MW, MD / 2, MH);

    /* ---- user space: a thin slab one level up, to the right ------------ */
    var UW = 88 * k, UD = 38 * k, UT = 6 * k;
    var UO = P(O, 146 * k, 2 * k, KH + 24 * k);
    I.isoSlab(s, UO, UW, UD, { h: UT });

    /* output cards (back) then the collector (front) */
    var cardW = 28 * k, cardD = 12 * k, cardH = 2.5 * k;
    var card2 = P(UO, 52 * k, 22 * k, UT);
    I.isoBox(s, card2, cardW, cardD, cardH);
    var card1 = P(UO, 52 * k, 6 * k, UT);
    I.isoBox(s, card1, cardW, cardD, cardH);
    var col = P(UO, 8 * k, 8 * k, UT);
    I.isoBox(s, col, 28 * k, 22 * k, 11 * k);
    var colTop = P(col, 14 * k, 11 * k, 11 * k);
    var colL = P(col, 0, 11 * k, 6 * k);

    /* ---- the measurement path: the one --blue flow --------------------- */
    for (i = 0; i < 3; i++) {
      var tgt = P(mo, MW * (0.2 + i * 0.3), MD * 0.55, MH);
      I.arrow(s, caps[i][0], caps[i][1] + 2 * k, tgt[0], tgt[1] - 2 * k,
        { dashed: true, accent: true, width: 1.2 });
    }
    I.arrow(s, mapR[0] + 3 * k, mapR[1] - 2 * k, colL[0] - 3 * k, colL[1] + 2 * k,
      { dashed: true, accent: true });

    /* --------------------------------------------------------- labels --- */
    var kL = P(O, 0, KD, KH / 2);                 /* left edge of the slab  */
    var uB = P(UO, 0, UD, UT);                    /* back-left of the shelf */
    var cardR = P(card1, cardW, cardD / 2, cardH);

    I.label(s, kL[0] - 9 * k, kL[1] + 14 * k, 'kernel', { anchor: 'end' });
    I.label(s, uB[0] - 8 * k, uB[1] - 3 * k, 'user space', { anchor: 'end' });

    if (!hero) {
      I.label(s, caps[0][0] - 8 * k, caps[0][1] - 5 * k, 'tracepoint', { anchor: 'end' });
      I.label(s, mapFront[0], mapFront[1] + 14 * k, 'BPF map', { anchor: 'middle', accent: true });
      return;
    }

    /* hero: each probe names its own tracepoint, beside its own pin */
    var probes = ['runqlat · sched', 'memlat · page fault', 'iolat · block I/O'];
    for (i = 0; i < 3; i++) {
      I.label(s, caps[i][0] - 9 * k, caps[i][1] - 6 * k, probes[i], { anchor: 'end' });
    }
    I.label(s, mapFront[0], mapFront[1] + 15 * k, 'BPF map', { anchor: 'middle', accent: true });
    I.leader(s, colTop[0], colTop[1] - 22 * k, colTop[0], colTop[1] - 2,
      'collector (Go)', { anchor: 'middle' });
    I.leader(s, cardR[0] + 14 * k, cardR[1] + 15 * k, cardR[0] + 3, cardR[1],
      'csv + summary.json', { anchor: 'start' });
  }

  function thumb(s, ctx) { stage(s, ctx); }
  thumb.kind = 'thumb';
  thumb.aria = 'Isometric view: three eBPF probes stand on a kernel slab and feed a BPF map, which a collector on the user-space shelf above reads.';

  function hero(s, ctx) { stage(s, ctx); }
  hero.kind = 'hero';
  hero.aria = 'Isometric view of the eBPF toolkit: runqlat, memlat and iolat probes sit on scheduler, page fault and block I/O tracepoints inside the kernel, bucket their deltas in a BPF map, and a Go collector on the user-space level above reads that map into CSV and JSON files.';

  /* ------------------------------------------------------- s3: pipeline */
  function pipeline(s, ctx) {
    var t = ctx.tokens, y = 76, h = 62, cy = y + h / 2;

    I.label(s, 24, 30, 'one measurement path, per tool', { weight: 600 });

    /* kernel | user space divider */
    I.mk(s, 'line', {
      x1: 476, y1: 40, x2: 476, y2: 178, stroke: t.line,
      'stroke-width': 1.2, 'stroke-dasharray': '4 3'
    });
    I.label(s, 241, 52, 'kernel', { anchor: 'middle', size: 9.5 });
    I.label(s, 616, 52, 'user space', { anchor: 'middle', size: 9.5 });

    I.box(s, 24, y, 120, h, { label: 'tracepoint', sub: 'enter / exit' });
    I.arrow(s, 144, cy, 180, cy);
    I.box(s, 180, y, 96, h, { label: 'Δt', sub: 'per event' });
    I.arrow(s, 276, cy, 312, cy);
    I.box(s, 312, y, 146, h, { label: 'log2 histogram', sub: 'BPF map', fill: 'accent', accent: true });
    I.arrow(s, 458, cy, 494, cy);
    I.box(s, 494, y, 104, h, { label: 'collector', sub: 'Go' });
    I.arrow(s, 598, cy, 634, cy);

    var files = ['memlat.csv', 'runqlat.csv', 'iolat.csv', '*.summary.json'], i, fy = 54;
    for (i = 0; i < files.length; i++) {
      I.box(s, 634, fy, 122, 22, { label: files[i], size: 9.5, fill: i === 3 ? 'paper' : 'tint' });
      fy += 29;
    }

    I.label(s, 24, 158, 'no per-event record crosses the boundary — only bucket counts', { size: 9.5 });
    I.bracket(s, 24, 756, 186, 'one run · --duration 30s · one output set');
  }
  pipeline.kind = 'diagram';
  pipeline.height = 230;
  pipeline.aria = 'Left to right: a tracepoint pair produces a delta, the delta is bucketed into a log2 histogram held in a BPF map inside the kernel, and a Go collector in user space reads that map once per run and writes one CSV and one JSON summary per tool.';

  I.scenes.ebpf = { thumb: thumb, hero: hero, pipeline: pipeline };
})();
