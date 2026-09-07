/* ==========================================================================
   assets/js/scenes/rowscope.js — DRAM row buffer locality (08 section 4.1)
   scenes: thumb (400x225), hero (1200x400), address (780x240), state (780x260)
   ========================================================================== */
(function () {
  'use strict';
  var I = window.Illus;
  if (!I) return;
  var P = I.P;

  /* ---------------------------------------------------------------- scene */
  /* One parametric composition; `hero` is the same scene at a larger scale
     with more labels (08 section 4: thumb = narrow crop of the hero). */
  function stage(s, ctx) {
    var hero = ctx.variant === 'hero';
    var k = hero ? 1.5 : 0.85;
    var O = hero ? [520, 348] : [135, 190];

    var SW = 213 * k, SD = 102 * k, SH = 7 * k;            /* DRAM chip slab */
    var cw = 44 * k, cd = 38 * k, cg = 7 * k, ch = 12 * k;  /* bank cell      */
    var rd = 12 * k, rh = 3.5 * k;                          /* row buffer bar */

    I.grid(s);
    I.isoSlab(s, O, SW, SD, { h: SH });

    var origin = P(O, 8 * k, 9.5 * k, SH);
    var cells = I.isoBankArray(s, origin, 4, 2, { cw: cw, cd: cd, ch: ch, gap: cg, open: 3 });
    var bank = cells[3];                                   /* front-right bank */

    /* the open row: the one --blue subject of this scene */
    var rowO = P(bank.o, 0, (cd - rd) / 2, ch);
    I.isoBox(s, rowO, cw, rd, rh, { fill: 'accent' });

    /* the next row of the same bank: outline only, target of a conflict */
    var nextO = P(bank.o, 0, (cd - rd) / 2 + rd + 3 * k, ch);
    if (hero) I.isoBox(s, nextO, cw, rd, rh, { fill: 'ghost' });

    /* strided accesses arrive from the front (perpendicular to the row) */
    var tail = [30 * k, 17.5 * k], head = [12 * k, 7 * k], hits = [], i, T;
    for (i = 0; i < 3; i++) {
      T = P(rowO, (8 + i * 14) * k, rd / 2, rh);
      hits.push(T);
      I.arrow(s, T[0] + tail[0], T[1] + tail[1], T[0] + head[0], T[1] + head[1], { accent: true });
    }
    var conflict = P(nextO, 8 * k, rd / 2, rh);
    if (hero) I.arrow(s, conflict[0] + tail[0], conflict[1] + tail[1],
      conflict[0] + head[0], conflict[1] + head[1], { warn: true });

    /* ------------------------------------------------------------ labels */
    var M = P(O, 0, SD / 2, SH);                 /* left face, top edge mid  */
    I.label(s, M[0] - 14, M[1] + 30, 'bank 0..7', { anchor: 'end' });

    var E = P(rowO, cw, rd / 2, rh);             /* right end of the open row */
    var t0 = [hits[0][0] + tail[0], hits[0][1] + tail[1]];

    if (!hero) {
      I.label(s, E[0] + 14, E[1] - 4, 'open row (8 KB)');
      I.label(s, t0[0] + 10, t0[1] + 13, 'stride');
      return;
    }

    /* hero: label column in the free space right of the chip */
    var cx = P(O, SW, 0, SH)[0] + 26;
    var Eg = P(nextO, cw, rd / 2, rh);
    var t2 = [hits[2][0] + tail[0], hits[2][1] + tail[1]];
    var tw = [conflict[0] + tail[0], conflict[1] + tail[1]];
    I.leader(s, cx, Eg[1] - 6, Eg[0] + 8, Eg[1] - 2, 'row conflict', { anchor: 'start', warn: true });
    I.leader(s, cx, E[1] + 12, E[0] + 8, E[1] + 2, 'open row (8 KB)', { anchor: 'start' });
    I.leader(s, cx, E[1] + 44, hits[2][0] + head[0] + 5, hits[2][1] + head[1], 'row hit', { anchor: 'start', accent: true });
    I.leader(s, cx, E[1] + 76, t2[0] + 6, t2[1] - 4, 'stride', { anchor: 'start' });
    I.leader(s, cx, E[1] + 108, tw[0] + 8, tw[1] + 4, '4 B element', { anchor: 'start' });
  }

  function thumb(s, ctx) { stage(s, ctx); }
  thumb.kind = 'thumb';
  thumb.aria = 'Isometric DRAM chip with eight banks; four strided accesses hit the same open row in bank 3.';

  function hero(s, ctx) { stage(s, ctx); }
  hero.kind = 'hero';
  hero.aria = 'Isometric DRAM chip with eight banks: strided accesses hit one open 8 KB row until the stride crosses into the next row, which costs a row conflict.';

  /* -------------------------------------------------------- s3: address */
  function address(s, ctx) {
    var t = ctx.tokens;
    I.label(s, 24, 30, 'physical address · 8 KB row · 8 banks', { weight: 600 });

    var f = I.fieldRow(s, 24, 48, 732, [
      { label: 'row id', bits: 32 },
      { label: 'bank id', bits: 3 },
      { label: 'col offset', bits: 13, accent: true }
    ], { h: 46 });

    I.label(s, f[0].cx, 110, '47 .. 16', { anchor: 'middle', size: 9.5 });
    I.label(s, f[1].cx, 110, '15..13', { anchor: 'middle', size: 9.5 });
    I.label(s, f[2].cx, 110, '12 .. 0', { anchor: 'middle', size: 9.5 });
    I.bracket(s, f[2].x, f[2].x + f[2].w, 122, 'stays inside the open row', { accent: true });

    /* stride walk along one row and across its boundary */
    I.label(s, 24, 172, 'consecutive accesses at a fixed stride', { weight: 600 });
    var y = 212, bound = 600;
    I.mk(s, 'rect', { x: 24, y: y - 7, width: bound - 24, height: 14, rx: 3, fill: t.blueSoft, stroke: t.blue, 'stroke-width': 1 });
    I.mk(s, 'rect', { x: bound, y: y - 7, width: 756 - bound, height: 14, rx: 3, fill: t.tint, stroke: t.line, 'stroke-width': 1 });
    I.mk(s, 'line', { x1: bound, y1: y - 22, x2: bound, y2: y + 20, stroke: t.line, 'stroke-width': 1.2, 'stroke-dasharray': '4 3' });
    I.label(s, bound + 8, 186, '8 KB row boundary', { size: 9.5 });

    var xs = [70, 204, 338, 472], i;
    for (i = 0; i < xs.length; i++) {
      I.mk(s, 'circle', { cx: xs[i], cy: y, r: 4, fill: t.blue, stroke: t.blue });
      if (i) I.arrow(s, xs[i - 1] + 8, y - 16, xs[i] - 8, y - 16, { accent: true, label: i === 1 ? '+ stride' : null, labelDy: -5 });
    }
    I.mk(s, 'circle', { cx: 634, cy: y, r: 4, fill: t.warn, stroke: t.warn });
    I.arrow(s, xs[3] + 8, y - 16, 626, y - 16, { warn: true });
    I.label(s, 248, 236, 'row hit', { anchor: 'middle', accent: true });
    I.label(s, 660, 236, 'row conflict', { anchor: 'middle', warn: true });
  }
  address.kind = 'diagram';
  address.height = 250;
  address.aria = 'A physical address splits into row id, bank id and a 13-bit column offset; strided accesses stay in one 8 KB row until they cross the row boundary.';

  /* ---------------------------------------------------------- s3: state */
  function state(s, ctx) {
    I.label(s, 24, 32, 'row buffer state, one bank', { weight: 600 });

    var empty = I.state(s, 46, 142, 'EMPTY', { w: 120 });
    var open = I.state(s, 292, 138, ['OPEN', 'row r'], { w: 156, h: 48 });
    var other = I.state(s, 588, 138, ['OPEN', "row r'"], { w: 156, h: 48 });

    I.transition(s, empty, open, 'miss · activate', { dy: -12 });
    I.transition(s, open, open, ['row hit', 'read / write'], { self: true, accent: true, dy: -10 });
    I.transition(s, open, other, ['conflict', 'precharge + activate'], { warn: true, dy: -20 });
    I.transition(s, other, empty, 'precharge / refresh', { curve: -104, dy: -8 });

    I.label(s, 24, 268, 'blue = the fast path (same row) · amber = the stall (different row, same bank)', { size: 9.5 });
  }
  state.kind = 'diagram';
  state.height = 280;
  state.aria = 'State machine of one DRAM bank row buffer: a hit keeps the open row, a different row in the same bank forces a precharge and activate.';

  I.scenes.rowscope = { thumb: thumb, hero: hero, address: address, state: state };
})();
