/* ==========================================================================
   assets/js/scenes/dynamic_moh.js — MoH-guided head-wise offloading
   (08 section 4.6). scenes: thumb, hero, arch, trace, overlap.
   The single --blue subject of the scene is the resident head set;
   the PCIe link is drawn with --line so the figure keeps one accent.
   ========================================================================== */
(function () {
  'use strict';
  var I = window.Illus;
  if (!I) return;
  var P = I.P;

  /* --------------------------------------------------------------- scene */
  function stage(s, ctx) {
    var hero = ctx.variant === 'hero';
    var k = hero ? 1.9 : 1;
    var HO = hero ? [312, 366] : [112, 202];   /* host board  */
    var GO = hero ? [772, 316] : [274, 154];   /* GPU package */
    var t = ctx.tokens;

    I.grid(s);

    /* ---- host: board + DIMM + CPU, offloaded heads above the DIMM ------- */
    var bw = 58 * k, bh = 7 * k;
    I.isoSlab(s, HO, bw, bw, { h: bh });
    var dimm = P(HO, 38 * k, 10 * k, bh);
    I.isoDimm(s, dimm, 36 * k, { thick: 6 * k, h: 18 * k });
    var cpu = P(HO, 10 * k, 26 * k, bh);
    I.isoChip(s, cpu, 22 * k, { h: 9 * k });

    var oc = 6 * k, og = 1 * k;
    var offO = P(HO, 34 * k, 12 * k, bh + 18 * k + 16 * k);
    I.isoBankArray(s, offO, 3, 2, { cw: oc, cd: oc, ch: 1.6 * k, gap: og, fill: 'ghost' });

    /* ---- GPU package: interposer + HBM stack + die ---------------------- */
    var iw = 72 * k, ih = 7 * k;
    I.isoSlab(s, GO, iw, iw, { h: ih });
    var hbm = P(GO, 10 * k, 46 * k, ih);
    I.isoStack(s, hbm, 16 * k, 20 * k, 3, { layerH: 5 * k });
    var die = P(GO, 22 * k, 20 * k, ih);
    I.isoChip(s, die, 32 * k, { h: 13 * k });

    /* ---- attention heads floating over the die: 8 x 4 ------------------- */
    var fh = 62 * k, cell = 6.4 * k, gap = 0.6 * k;
    var gO = P(GO, 14 * k, 18 * k, fh);
    var resident = [1, 3, 6, 8, 11, 13, 17, 19, 22, 26, 29];
    I.isoBankArray(s, gO, 8, 4, {
      cw: cell, cd: cell, ch: 1.3 * k, gap: gap, on: resident,
      fill: 'paper', onFill: 'accent'
    });
    /* drop lines so the grid reads as hovering over the die */
    [[14 * k, 18 * k, 20 * k], [14 * k + 8 * (cell + gap), 18 * k, ih]].forEach(function (d) {
      var a = P(GO, d[0], d[1], fh), b = P(GO, d[0], d[1], d[2]);
      I.mk(s, 'line', { x1: a[0], y1: a[1] + 2, x2: b[0], y2: b[1], stroke: t.line, 'stroke-width': 1, 'stroke-dasharray': '3 3' });
    });

    /* ---- PCIe link between host board and package ----------------------- */
    var pa = P(HO, bw, 0, bh), pb = P(GO, 0, iw / 2, 0);
    I.arrow(s, pa[0], pa[1], pb[0], pb[1], { dashed: true, both: true });
    I.label(s, (pa[0] + pb[0]) / 2, (pa[1] + pb[1]) / 2 - 10, 'PCIe', { anchor: 'middle' });

    /* --------------------------------------------------------- labels ---- */
    var gLeft = P(gO, 0, 4 * (cell + gap), 1.6 * k);        /* grid left corner  */
    var gRight = P(gO, 8 * (cell + gap), 0, 1.6 * k);       /* grid right corner */
    var offBack = P(offO, 1.5 * (oc + og), 2 * (oc + og), 1.6 * k);

    I.label(s, gLeft[0] - 10, gLeft[1] - 2, 'heads', { anchor: 'end' });
    I.label(s, gRight[0] + 12, gRight[1] + 4, 'resident', { accent: true });
    I.label(s, offBack[0], offBack[1] - 10, 'offloaded', { anchor: 'middle' });

    if (!hero) return;

    var cpuTL = P(cpu, 0, 22 * k, 9 * k);
    var dimmTL = P(dimm, 0, 36 * k, 18 * k);
    var dieR = P(die, 32 * k, 0, 13 * k);
    var hbmL = P(hbm, 0, 20 * k, 15 * k);
    I.leader(s, cpuTL[0] - 46, cpuTL[1] + 26, cpuTL[0] - 2, cpuTL[1] + 2, 'CPU', { anchor: 'end' });
    I.leader(s, dimmTL[0] - 40, dimmTL[1] + 4, dimmTL[0] - 3, dimmTL[1] + 3, 'DDR DRAM', { anchor: 'end' });
    I.leader(s, dieR[0] + 26, dieR[1] + 30, dieR[0] + 4, dieR[1] + 5, 'GPU die', { anchor: 'start' });
    I.leader(s, hbmL[0] - 34, hbmL[1] - 12, hbmL[0] - 2, hbmL[1] + 2, 'HBM', { anchor: 'end' });
  }

  function thumb(s, ctx) { stage(s, ctx); }
  thumb.kind = 'thumb';
  thumb.aria = 'Isometric view: attention heads hover over a GPU die, some resident in HBM and the rest offloaded to host DRAM across PCIe.';

  function hero(s, ctx) { stage(s, ctx); }
  hero.kind = 'hero';
  hero.aria = 'Isometric view of head-wise offloading: a host board with CPU and DDR DIMM holds the offloaded attention heads, the GPU package keeps the resident heads, and PCIe carries the KV cache between them.';

  /* ------------------------------------------------------------ s2: arch */
  function arch(s, ctx) {
    I.box(s, 24, 40, 300, 158, {
      label: 'CPU (Host)', sub: 'DDR DRAM', rx: 6,
      inner: ['KV cache (offloaded)', 'host binning · pinned buffers']
    });
    I.box(s, 456, 40, 300, 158, {
      label: 'GPU (Device)', sub: 'HBM', rx: 6,
      inner: ['Attention (layer i) · MLP', 'KV cache (resident)']
    });
    I.arrow(s, 338, 119, 442, 119, { both: true, accent: true });
    I.label(s, 390, 100, 'PCIe transfer', { anchor: 'middle' });
    I.label(s, 390, 146, 'overlap?', { anchor: 'middle', accent: true, weight: 600 });
    I.label(s, 24, 224, 'the question is not where the KV cache lives, but whether the transfer hides behind compute', { size: 9.5 });
  }
  arch.kind = 'diagram';
  arch.height = 240;
  arch.aria = 'Host CPU with DDR DRAM on the left, GPU with HBM on the right, connected by a PCIe transfer that may or may not overlap with compute.';

  /* ----------------------------------------------------------- s3: trace */
  function trace(s, ctx) {
    var t = ctx.tokens, cols = 24, rows = 12, size = 12, gap = 2, x = 120, y = 64;
    var on = [], tk, i, sel, drift;
    for (tk = 0; tk < cols; tk++) {
      sel = [1, 4, 7, 9];
      drift = Math.floor(tk / 7);
      sel[3] = (9 + drift) % rows;
      if (tk % 7 === 4) sel[1] = 5;
      if (tk % 11 === 6) sel[0] = 2;
      for (i = 0; i < sel.length; i++) on.push(sel[i] * cols + tk);
    }
    I.label(s, 24, 32, 'head selection per token (router trace)', { weight: 600 });
    var g = I.cellGrid(s, x, y, cols, rows, size, { on: on, gap: gap });

    I.label(s, x - 10, y + 9, 'head 0', { anchor: 'end', size: 9.5 });
    I.label(s, x - 10, y + (rows - 1) * (size + gap) + 9, 'head ' + (rows - 1), { anchor: 'end', size: 9.5 });
    I.label(s, x, y + g.h + 22, 'tokens →', { size: 9.5 });

    /* two adjacent token columns under comparison */
    var c0 = 10, bx = x + c0 * (size + gap) - 3, bw = 2 * (size + gap) - gap + 6;
    I.mk(s, 'rect', {
      x: bx, y: y - 3, width: bw, height: g.h + 6, rx: 3,
      fill: 'none', stroke: t.blue, 'stroke-width': 1.2, 'stroke-dasharray': '4 3'
    });
    I.bracket(s, bx, bx + bw, y - 12, 'Jaccard(t, t+1)', { up: true, accent: true });

    /* legend */
    I.mk(s, 'rect', { x: 520, y: 78, width: size, height: size, rx: 1.5, fill: t.blue, stroke: t.blue });
    I.label(s, 520 + size + 10, 78 + 9.5, 'head selected for this token');
    I.mk(s, 'rect', { x: 520, y: 104, width: size, height: size, rx: 1.5, fill: t.paper, stroke: t.line });
    I.label(s, 520 + size + 10, 104 + 9.5, 'head not selected');
    I.label(s, 520, 150, ['if adjacent tokens keep', 'most of their head set,', 'the resident set can be', 'reused instead of refetched'], { size: 9.5, lineHeight: 15 });
  }
  trace.kind = 'diagram';
  trace.height = 300;
  trace.aria = 'Grid of tokens by attention heads: the selected head set changes slowly from one token to the next, so adjacent columns overlap heavily.';

  /* --------------------------------------------------------- s4: overlap */
  function overlap(s, ctx) {
    var t = ctx.tokens;
    I.label(s, 24, 30, 'naive · transfer starts after compute', { weight: 600 });
    I.timeline(s, 24, 44, 732, [
      { label: 'layer i compute', bars: [{ from: 0, to: 0.34, label: 'compute' }] },
      { label: 'KV transfer (i+1)', bars: [{ from: 0.34, to: 0.68, label: 'transfer' }] }
    ], { span: 1, laneH: 26, gap: 8, labelW: 140 });

    I.label(s, 24, 144, 'prefetch · transfer overlaps compute', { weight: 600 });
    var tl = I.timeline(s, 24, 158, 732, [
      { label: 'layer i compute', bars: [{ from: 0, to: 0.34, label: 'compute' }] },
      { label: 'KV transfer (i+1)', bars: [{ from: 0.18, to: 0.52, accent: true, label: 'transfer' }] }
    ], { span: 1, laneH: 26, gap: 8, labelW: 140 });

    I.mk(s, 'rect', {
      x: tl.X(0.18), y: 154, width: tl.X(0.34) - tl.X(0.18), height: 66,
      fill: 'none', stroke: t.blue, 'stroke-width': 1.2, 'stroke-dasharray': '4 3'
    });
    I.bracket(s, tl.X(0.18), tl.X(0.34), 224, 'overlap', { accent: true });
    I.mk(s, 'line', {
      x1: tl.X(0.68), y1: 100, x2: tl.X(0.68), y2: 218, stroke: t.line,
      'stroke-width': 1, 'stroke-dasharray': '4 3'
    });
    I.arrow(s, tl.X(0.68), 224, tl.X(0.52), 224, { both: true, label: 'time saved', labelDy: -7 });
  }
  overlap.kind = 'diagram';
  overlap.height = 250;
  overlap.aria = 'Two timelines: serial compute then transfer, versus a prefetched transfer that starts during compute and shortens the layer.';

  I.scenes.dynamic_moh = { thumb: thumb, hero: hero, arch: arch, trace: trace, overlap: overlap };
})();
