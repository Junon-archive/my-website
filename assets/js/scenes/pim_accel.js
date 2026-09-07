/* ==========================================================================
   assets/js/scenes/pim_accel.js — PIM gradient accumulation (08 section 4.7)
   scenes: thumb (400x225), hero (1200x400)
   diagrams: contention (780x260), stages (780x210)

   One --blue subject only: the binned fragment flow
   (fragments -> host binning -> bank-local accumulator).
   --warn appears once, on the serialised acc[g] cell in `contention`.
   ========================================================================== */
(function () {
  'use strict';
  var I = window.Illus;
  if (!I) return;
  var P = I.P;

  /* Fragment -> bank assignment for the scene. 12 fragments, 3 per bank.
     Long hops are biased toward smaller `a` on purpose: in the isometric
     projection a hop toward +a rises on screen and stops reading as
     "falling into a bank", while a hop toward -a descends. */
  var BINS = [0, 0, 1, 1, 0, 2, 1, 2, 3, 2, 3, 3];

  /* ----------------------------------------------------------------- scene */
  /* One parametric composition; `hero` is the same stage at 2x with leaders. */
  function stage(s, ctx) {
    var hero = ctx.variant === 'hero';
    var k = hero ? 2 : 1;
    var O = hero ? [551, 384] : [168, 205];
    var t = ctx.tokens;

    var ML = 172 * k, MD = 40 * k, MH = 8 * k;               /* PIM module card */
    var cw = 34 * k, cd = 28 * k, ch = 12 * k, cgap = 8 * k; /* bank            */
    var aw = 16 * k, ad = 10 * k, ah = 5 * k;                /* accumulator     */
    var PB = 72 * k, PD = 44 * k, PH = 4 * k, PZ = 34 * k;   /* host plate      */
    var fw = 8 * k, fd = 7 * k, fh = 3 * k;                  /* fragment        */
    var FB = 98 * k, FA = 34 * k, FS = 11.4 * k;             /* fragment row    */
    var pTop = PZ + PH, i, q, r;

    I.grid(s);

    /* ---- PIM module: DIMM-shaped card with an edge connector ------------ */
    I.isoSlab(s, O, ML, MD, { h: MH });
    for (i = 0; i < 12; i++) {
      q = P(O, (10 + i * 13) * k, 0, 1.4 * k);
      r = P(O, (10 + i * 13) * k, 0, MH - 1.6 * k);
      I.mk(s, 'line', { x1: q[0], y1: q[1], x2: r[0], y2: r[1], stroke: t.line, 'stroke-width': 1 });
    }

    /* ---- four banks, each with a bank-local accumulator ----------------- */
    var banks = I.isoBankArray(s, P(O, 6 * k, 6 * k, MH), 4, 1,
      { cw: cw, cd: cd, ch: ch, gap: cgap });
    var acc = [];
    banks.forEach(function (bk) {
      var ao = P(bk.o, (cw - aw) / 2, (cd - ad) / 2, ch);
      I.isoBox(s, ao, aw, ad, ah, { fill: 'accent-soft' });
      acc.push({ top: P(ao, aw / 2, ad / 2, ah), back: P(ao, aw / 2, ad, ah) });
    });

    /* ---- write-back leaves the module (not the accent flow) ------------- */
    var wbA = P(O, ML - 4 * k, 20 * k, MH + ch + ah);
    var wbB = P(O, ML + 18 * k, 20 * k, MH + ch + ah + 14 * k);
    if (hero) I.arrow(s, wbA[0], wbA[1], wbB[0], wbB[1], { dashed: true });

    /* ---- host binning plate, floating above the module ------------------ */
    var plate = P(O, 0, PB, PZ);
    I.isoSlab(s, plate, ML, PD, { h: PH });

    /* fan lines: fragment -> its bin, drawn in the plate's top plane */
    var binC = [], frag = [];
    for (i = 0; i < 4; i++) binC.push((23 + i * 42) * k);
    for (i = 0; i < 12; i++) frag.push(FA + i * FS + fw / 2);
    for (i = 0; i < 12; i++) {
      q = P(O, frag[i], FB, pTop);
      r = P(O, binC[BINS[i]], PB + 10 * k, pTop);
      I.mk(s, 'line', {
        x1: q[0], y1: q[1], x2: r[0], y2: r[1],
        stroke: t.blue, 'stroke-width': 1, opacity: 0.5
      });
    }

    /* fragments (back of the plate) then bins (flat slots at its front edge) */
    for (i = 0; i < 12; i++) {
      var fo = P(O, FA + i * FS, FB, pTop);
      I.isoBox(s, fo, fw, fd, fh, { fill: 'accent-soft' });
      if (hero) {
        q = P(fo, fw / 3, 0, fh); r = P(fo, fw / 3, fd, fh);
        I.mk(s, 'line', { x1: q[0], y1: q[1], x2: r[0], y2: r[1], stroke: t.blue, 'stroke-width': 1 });
      }
    }
    for (i = 0; i < 4; i++) {
      I.isoBox(s, P(O, binC[i] - 11 * k, PB + 2 * k, pTop), 22 * k, 6 * k, 1.5 * k, { fill: 'accent-soft' });
    }

    /* ---- the drop: each bin falls into its bank accumulator ------------- */
    for (i = 0; i < 4; i++) {
      q = P(O, binC[i], PB, PZ);
      I.arrow(s, q[0], q[1], acc[i].back[0], acc[i].back[1], { accent: true });
    }

    /* ------------------------------------------------------------ labels */
    /* Every anchor is a projected point of the object it names, so the two
       variants stay aligned when k changes. */
    var plateFR = P(O, ML, PB, pTop);          /* plate, front-right corner   */
    var fragL = P(O, FA, FB + fd, pTop + fh);  /* fragment row, back-left end */
    var modR = P(O, ML, 4 * k, MH);            /* module, right end top edge  */

    if (!hero) {
      I.label(s, fragL[0] - 6, fragL[1] - 12, 'fragments', { anchor: 'end' });
      I.label(s, plateFR[0] + 10, plateFR[1] + 11, 'host binning');
      I.label(s, modR[0] + 6, acc[3].top[1] + 12, 'bank-local Σ', { accent: true });
      I.label(s, O[0] - 12, O[1] + 2, 'PIM', { anchor: 'end' });
      return;
    }

    /* hero: two label columns in the free space beside the composition */
    var L = 330, R = 866;
    var f0 = P(O, FA + fw / 2, FB + fd / 2, pTop + fh);
    var f3 = P(O, FA + 3 * FS + fw / 3, FB + fd / 2, pTop + fh);
    var f7 = P(O, FA + 7 * FS + fw * 0.8, FB + fd / 2, pTop + fh);
    var pFL = P(O, 20 * k, PB + 6 * k, pTop);

    I.leader(s, L, f7[1], f7[0], f7[1], 'grad', { anchor: 'end' });
    I.leader(s, L, f3[1], f3[0], f3[1], 'gaussian_id', { anchor: 'end' });
    I.leader(s, L, f0[1], f0[0], f0[1], 'fragments', { anchor: 'end' });
    I.leader(s, L, pFL[1] + 4, pFL[0], pFL[1], 'host binning', { anchor: 'end' });

    I.leader(s, R, wbB[1] - 12, wbB[0] - 2, wbB[1] + 3, 'write-back', { anchor: 'start' });
    I.leader(s, R, acc[3].top[1], acc[3].top[0] + 9, acc[3].top[1], 'bank-local Σ', { anchor: 'start', accent: true });
    I.leader(s, R, modR[1] + 44, modR[0] - 4, modR[1] + 4, 'PIM', { anchor: 'start' });
  }

  function thumb(s, ctx) { stage(s, ctx); }
  thumb.kind = 'thumb';
  thumb.aria = 'Isometric PIM module: fragments on a host binning plate fall into four DRAM banks, each with its own accumulator.';

  function hero(s, ctx) { stage(s, ctx); }
  hero.kind = 'hero';
  hero.aria = 'Isometric view of PIM gradient accumulation: fragments carrying a gaussian id and a gradient are binned on the host, dropped into four DRAM banks where a bank-local accumulator sums them, and written back.';

  /* ------------------------------------------------------- s2: contention */
  function contention(s, ctx) {
    var t = ctx.tokens, i, m, cnt = [0, 0, 0, 0];
    var LC = 200, RC = 580;

    I.mk(s, 'line', {
      x1: 390, y1: 40, x2: 390, y2: 250,
      stroke: t.line, 'stroke-width': 1, 'stroke-dasharray': '4 3'
    });

    /* ---- left: GPU atomicAdd, twelve updates on one address ------------- */
    I.label(s, LC, 28, 'GPU · atomicAdd', { anchor: 'middle', weight: 600 });
    I.label(s, LC, 50, '12 fragment updates', { anchor: 'middle', size: 9.5 });
    var lg = I.cellGrid(s, 72, 58, 12, 1, 14, { gap: 8, fill: 'paper' });
    var lacc = I.box(s, 160, 176, 80, 36, { label: 'acc[g]', warn: true, fill: 'warn' });
    for (i = 0; i < 12; i++) {
      I.arrow(s, lg.cx(i), 74, LC + (i - 5.5) * 6, 172);
    }
    I.label(s, LC, 234, 'one address, one at a time', { anchor: 'middle', warn: true });
    I.label(s, LC, 249, 'cost grows with the skew', { anchor: 'middle', size: 9.5 });

    /* ---- right: PIM bank-local reduction -------------------------------- */
    I.label(s, RC, 28, 'PIM · bank-local', { anchor: 'middle', weight: 600 });
    I.label(s, RC, 50, 'the same 12 updates', { anchor: 'middle', size: 9.5 });
    var rg = I.cellGrid(s, 452, 58, 12, 1, 14, { gap: 8, fill: 'paper' });
    var bc = [454, 538, 622, 706];
    for (i = 0; i < 4; i++) {
      I.box(s, bc[i] - 35, 172, 70, 46, {
        label: 'Σ', sub: 'bank ' + i, fill: 'accent', accent: true
      });
    }
    for (i = 0; i < 12; i++) {
      m = i % 4;
      I.arrow(s, rg.cx(i), 74, bc[m] + (cnt[m] - 1) * 14, 169, { accent: true });
      cnt[m]++;
    }
    I.label(s, RC, 234, 'same fragments, no global atomics', { anchor: 'middle', accent: true });
    I.label(s, RC, 249, '3 updates per bank, in parallel', { anchor: 'middle', size: 9.5 });
    return lacc;
  }
  contention.kind = 'diagram';
  contention.height = 260;
  contention.aria = 'Left: twelve fragment updates converge on a single accumulator element through GPU atomicAdd and serialise there. Right: the same twelve updates are binned across four PIM banks, three per bank, each summed by a bank-local accumulator.';

  /* ----------------------------------------------------------- s3: stages */
  function stages(s, ctx) {
    var STEPS = [
      { label: 'bin', sub: 'host', measure: 'latency' },
      { label: 'transfer', sub: 'host → PIM', measure: 'bytes moved' },
      { label: 'accumulate', sub: 'PIM', measure: 'PIM cycles', accent: true },
      { label: 'write-back', sub: 'PIM → host', measure: 'latency' }
    ];
    var x0 = 30, w = 156, gap = 32, i, x;

    I.label(s, 30, 28, 'every stage is timed, not just the accumulate', { weight: 600 });

    for (i = 0; i < STEPS.length; i++) {
      x = x0 + i * (w + gap);
      I.box(s, x, 52, w, 58, {
        label: STEPS[i].label, sub: STEPS[i].sub,
        fill: STEPS[i].accent ? 'accent' : undefined, accent: STEPS[i].accent
      });
      I.box(s, x, 128, w, 28, { label: STEPS[i].measure, fill: 'none', dashed: true, size: 9.5 });
      if (i) I.arrow(s, x - gap + 8, 81, x - 8, 81);
    }

    I.label(s, 390, 122, 'measured per stage', { anchor: 'middle', size: 9.5 });
    I.bracket(s, x0, x0 + 4 * w + 3 * gap, 172,
      'PIM total = bin + transfer + accumulate + write-back');
  }
  stages.kind = 'diagram';
  stages.height = 210;
  stages.aria = 'Four stages left to right: bin on the host, transfer to PIM, accumulate inside PIM, write back. Latency, bytes moved and PIM cycles are measured under each stage, and the PIM total is the sum of all four.';

  I.scenes.pim_accel = { thumb: thumb, hero: hero, contention: contention, stages: stages };
})();
