/* ==========================================================================
   assets/js/scenes/can.js — CAN bus security & IDS (08 section 4.3)
   scenes: thumb (400x225), hero (1200x400)
   diagrams: frame (780x200), packing (780x240), ids (780x240)

   The one --blue subject of the scene is the packet flow on the bus.
   --warn is used only for the anomaly: the injected burst and the hazard LED.
   ========================================================================== */
(function () {
  'use strict';
  var I = window.Illus;
  if (!I) return;
  var P = I.P;

  /* --- scene geometry, in unscaled iso units --------------------------- */
  /* a runs along the bus (right and up), b is depth, h is height.         */
  var SW = 156, SD = 76, SH = 6;          /* harness slab                  */
  var BUS_B = 24, NODE_B = 48;            /* bus depth / node row depth    */
  var ECU_A = [8, 46, 84], ECU_S = 18, ECU_H = 8;
  var MON_A = 118, MON_W = 30, MON_D = 26, MON_H = 8;
  var PK_W = 6, PK_D = 6, PK_H = 4.5, PK_B = 21;
  var BUS_D = 10;                         /* flat ribbon: CAN_H + CAN_L    */
  var NORMAL = [6, 30, 54, 78];               /* regular frames, 24 apart   */
  var BURST = [92, 103, 114, 125, 136];       /* injected frames, 11 apart  */

  /* ---------------------------------------------------------------- scene */
  function stage(s, ctx) {
    var hero = ctx.variant === 'hero';
    var k = hero ? 2.2 : 1.3;
    var O = hero ? [523, 349] : [142, 200];
    var t = ctx.tokens;

    function u(n) { return n * k; }
    function p(a, b, h) { return P(O, a * k, b * k, (h || 0) * k); }

    I.grid(s);
    I.isoSlab(s, O, u(SW), u(SD), { h: u(SH) });

    /* nodes sit behind the bus so the front of the slab stays free for text */
    ECU_A.forEach(function (a) {
      I.isoBox(s, p(a, NODE_B, SH), u(ECU_S), u(ECU_S), u(ECU_H));
    });

    var mon = p(MON_A, NODE_B, SH);
    I.isoContainer(s, mon, u(MON_W), u(MON_D), u(MON_H));
    /* display panel standing on the back edge of the monitor base */
    I.isoBox(s, p(MON_A + 26, NODE_B + 2, SH + MON_H), u(3), u(MON_D - 4), u(14));
    /* hazard LED on the base, in front of the panel */
    var led = p(MON_A + 9, NODE_B + 8, SH + MON_H);
    I.mk(s, 'circle', { cx: led[0], cy: led[1], r: 2.4 * k, fill: t.warn, stroke: t.warn });

    /* node stubs: the same trace as the bus, branching to each node */
    ECU_A.concat([MON_A + MON_W / 2 - 9]).forEach(function (a) {
      I.isoBox(s, p(a + 8, BUS_B + 4, SH), u(2.4), u(NODE_B - BUS_B - 4), u(0.9),
        { fill: 'paper' });
    });

    /* the bus itself: CAN_H and CAN_L drawn as one flat ribbon */
    I.isoBox(s, p(2, BUS_B - BUS_D / 2, SH), u(SW - 6), u(BUS_D), u(1.2), { fill: 'paper' });

    /* frames on the bus: the single --blue subject */
    NORMAL.forEach(function (a) {
      I.isoBox(s, p(a, PK_B, SH), u(PK_W), u(PK_D), u(PK_H), { fill: 'accent' });
    });
    /* the injected burst: same frames, six times the rate */
    BURST.forEach(function (a) {
      I.isoBox(s, p(a, PK_B, SH), u(PK_W), u(PK_D), u(PK_H), { fill: 'warn' });
    });

    /* --------------------------------------------------------- labels --- */
    var ecuL = p(ECU_A[0], NODE_B + ECU_S, SH + ECU_H);      /* left corner  */
    var busL = p(68, BUS_B, SH);                             /* free gap     */
    var monR = p(MON_A + MON_W, NODE_B, SH + MON_H + 12);    /* right corner */
    var burstF = p(BURST[2], PK_B, SH);                      /* burst front  */

    I.label(s, ecuL[0] - 8, ecuL[1] + 2, 'ECU', { anchor: 'end' });
    I.label(s, busL[0] + u(4), busL[1] + u(13), 'CAN bus');
    I.label(s, monR[0] + u(8), monR[1] + u(6), 'IDS (LabVIEW)');
    I.label(s, burstF[0] + u(6), burstF[1] + u(10), 'injected', { warn: true });

    if (!hero) return;

    /* hero only: two more leaders into the free space below the bus */
    var pk = p(NORMAL[0] + PK_W / 2, PK_B, SH);
    I.leader(s, pk[0] - u(4), pk[1] + u(24), pk[0] - u(1), pk[1] + u(3),
      'data frame · 8 B', { anchor: 'end' });
    I.leader(s, led[0] + u(30), led[1] - u(2), led[0] + 3.6 * k, led[1],
      'hazard LED', { anchor: 'start', warn: true });
  }

  function thumb(s, ctx) { stage(s, ctx); }
  thumb.kind = 'thumb';
  thumb.aria = 'Isometric CAN bus with three ECU nodes and a LabVIEW monitor; regular frames sit evenly on the bus until a dense burst of injected frames appears and the monitor LED turns amber.';

  function hero(s, ctx) { stage(s, ctx); }
  hero.kind = 'hero';
  hero.aria = 'Isometric CAN bus: three ECUs and a LabVIEW monitor share one line, evenly spaced data frames travel along it, and a tight burst of injected frames raises the hazard LED on the monitor.';

  /* ------------------------------------------------------- s3: frame --- */
  function frame(s, ctx) {
    var t = ctx.tokens;
    I.label(s, 24, 20, 'CAN 2.0A data frame', { weight: 600 });

    var f = I.fieldRow(s, 24, 48, 732, [
      { label: 'SOF', bits: 1, weight: 5 },
      { label: 'ID', bits: 11, weight: 13 },
      { label: 'RTR', bits: 1, weight: 5 },
      { label: 'CTRL', bits: 6, weight: 8 },
      { label: 'DATA', bits: '0–64', weight: 30, accent: true },
      { label: 'CRC', bits: 16, weight: 16 },
      { label: 'ACK', bits: 2, weight: 5 },
      { label: 'EOF', bits: 7, weight: 8 }
    ], { h: 46 });

    I.bracket(s, f[1].x, f[2].x + f[2].w, 44, 'arbitration 12 bit', { up: true });
    I.bracket(s, f[4].x, f[4].x + f[4].w, 104, 'the only field the sender fills', { accent: true });

    I.label(s, 24, 152, 'identifier 5 · DLC 8 · eight payload bytes', { });
    I.label(s, 24, 176, 'no field carries a sender address — any node may transmit identifier 5',
      { warn: true });
  }
  frame.kind = 'diagram';
  frame.height = 200;
  frame.aria = 'Field layout of a CAN 2.0A data frame: SOF 1 bit, identifier 11, RTR 1, control 6, data 0 to 64, CRC 16, ACK 2 and EOF 7 bits. Only the data field carries payload and no field identifies the sender.';

  /* ----------------------------------------------------- s3: packing --- */
  var SEGS = [
    { name: 'LFT', bits: 10 }, { name: 'HEM', bits: 19 }, { name: 'BRAIN', bits: 21 },
    { name: 'WATER', bits: 3 }, { name: 'GENDER', bits: 1 }, { name: 'STRESS', bits: 10 }
  ];

  function packing(s, ctx) {
    var t = ctx.tokens, x0 = 24, W = 732, bw = W / 64, y = 56, h = 46;
    var X = function (bit) { return x0 + bit * bw; };
    var i, bit = 0, starts = [];

    I.label(s, x0, 26, 'data field · 64 bit · bit 0 at the left', { weight: 600 });

    /* byte boundaries: drawn above and below the row so they never cross a
       label, and continued down through the byte ruler */
    for (i = 8; i < 64; i += 8) {
      I.mk(s, 'line', {
        x1: X(i), y1: y - 10, x2: X(i), y2: y + 8, stroke: t.line,
        'stroke-width': 1, 'stroke-dasharray': '3 3'
      });
      I.mk(s, 'line', {
        x1: X(i), y1: y + h - 8, x2: X(i), y2: 144, stroke: t.line,
        'stroke-width': 1, 'stroke-dasharray': '3 3'
      });
    }

    /* the six signals, width proportional to their bit count */
    for (i = 0; i < SEGS.length; i++) {
      starts.push(bit);
      var wide = SEGS[i].bits >= 8;
      I.field(s, X(bit), y, SEGS[i].bits * bw, h, {
        label: wide ? SEGS[i].name : null, bits: wide ? SEGS[i].bits : null
      });
      bit += SEGS[i].bits;
    }
    starts.push(64);

    /* the two narrow signals get callouts instead of an inside label */
    var wx = X(50 + 1.5), gx = X(53.5);
    I.label(s, 566, 46, 'WATER 3 bit', { anchor: 'end' });
    I.mk(s, 'line', { x1: 570, y1: 42, x2: wx, y2: y - 4, stroke: t.line, 'stroke-width': 1 });
    I.label(s, 756, 26, 'GENDER 1 bit', { anchor: 'end' });
    I.mk(s, 'line', { x1: 678, y1: 22, x2: gx, y2: y - 4, stroke: t.line, 'stroke-width': 1 });

    /* boundary bit numbers: they chain with no gap and no overlap */
    for (i = 0; i < starts.length; i++) {
      I.label(s, X(starts[i]), y + h + 13, String(starts[i]), { anchor: 'middle', size: 9 });
    }

    /* byte ruler */
    for (i = 0; i < 8; i++) {
      I.field(s, X(i * 8), 120, 8 * bw, 24, { label: 'byte' + i, fill: i === 1 ? 'accent' : 'paper', accent: i === 1 });
    }

    /* one accent: byte1, the byte where two signals meet */
    I.mk(s, 'rect', {
      x: X(8) - 2, y: y - 4, width: 8 * bw + 4, height: 96, rx: 3,
      fill: 'none', stroke: t.blue, 'stroke-width': 1.2, 'stroke-dasharray': '4 3'
    });

    /* byte1 expanded: two LFT bits and six HEM bits in one byte */
    var zx = 150, zc = 30, zy = 176;
    I.mk(s, 'line', { x1: X(8) - 2, y1: 148, x2: zx, y2: zy, stroke: t.blue, 'stroke-width': 1, 'stroke-dasharray': '4 3' });
    I.mk(s, 'line', { x1: X(16) + 2, y1: 148, x2: zx + 8 * zc, y2: zy, stroke: t.blue, 'stroke-width': 1, 'stroke-dasharray': '4 3' });
    I.label(s, zx - 10, zy + 18, 'byte1', { anchor: 'end' });
    for (i = 0; i < 8; i++) {
      I.field(s, zx + i * zc, zy, zc - 2, 26, {
        label: i < 2 ? 'LFT' : 'HEM', fill: i < 2 ? 'accent' : 'tint',
        accent: i < 2, size: 9
      });
      I.label(s, zx + i * zc + (zc - 2) / 2, zy + 38, String(8 + i), { anchor: 'middle', size: 9 });
    }
    I.label(s, 420, zy + 12, ['byte1 = ((LFT & 0x300) >> 8)', '        | ((HEM & 0x3F) << 2)'],
      { accent: true, size: 10, lineHeight: 15 });
  }
  packing.kind = 'diagram';
  packing.height = 240;
  packing.aria = 'The 64 bit CAN payload split into six signals: LFT 10 bits, HEM 19, BRAIN 21, WATER 3, GENDER 1 and STRESS 10, with byte boundaries every 8 bits. Byte 1 holds the top two LFT bits together with the low six HEM bits.';

  /* --------------------------------------------------------- s3: ids --- */
  function ids(s, ctx) {
    var t = ctx.tokens, x0 = 150, plot = 606;
    var X = function (v) { return x0 + v * plot; };
    var base = 196, thr = 140, px = 0.28;      /* 0.28 px per millisecond */
    var Y = function (ms) { return base - ms * px; };

    /* arrivals: four at the configured rate, five injected, one late frame */
    var arr = [
      { t: 0.030 }, { t: 0.158 }, { t: 0.287 }, { t: 0.417 },
      { t: 0.525, w: 1 }, { t: 0.575, w: 1 }, { t: 0.625, w: 1 }, { t: 0.676, w: 1 }, { t: 0.726, w: 1 },
      { t: 0.920 }
    ];
    /* interval measured for every arrival after the first */
    var iv = [200, 200, 200, 167, 78, 78, 78, 78, 300];

    I.label(s, 24, 20, 'packet arrival · measured interval against the configured rate',
      { weight: 600 });

    /* --- lane A: arrivals on the bus ---------------------------------- */
    I.label(s, x0 - 12, 58, 'bus traffic', { anchor: 'end' });
    I.mk(s, 'line', { x1: x0, y1: 64, x2: x0 + plot, y2: 64, stroke: t.line, 'stroke-width': 1 });
    arr.forEach(function (a) {
      I.mk(s, 'rect', {
        x: X(a.t) - 2.5, y: 44, width: 5, height: 20, rx: 1.5,
        fill: a.w ? t.warnSoft : t.tint, stroke: a.w ? t.warn : t.line, 'stroke-width': 1.2
      });
    });
    I.arrow(s, X(arr[0].t) + 4, 38, X(arr[1].t) - 4, 38, { both: true, plain: false, label: '200 ms', labelDy: -6 });

    /* --- lane B: measured interval ------------------------------------- */
    I.label(s, x0 - 12, 160, ['measured', 'interval'], { anchor: 'end', lineHeight: 15 });
    I.mk(s, 'line', { x1: x0, y1: base, x2: x0 + plot, y2: base, stroke: t.line, 'stroke-width': 1 });
    I.mk(s, 'line', {
      x1: x0, y1: thr, x2: x0 + plot, y2: thr,
      stroke: t.blue, 'stroke-width': 1.2, 'stroke-dasharray': '4 3'
    });
    I.label(s, x0 + 6, thr - 8, 'configured rate · 200 ms', { accent: true });

    iv.forEach(function (ms, i) {
      var a = arr[i + 1], bad = a.w || ms > 200;
      I.mk(s, 'rect', {
        x: X(a.t) - 4.5, y: Y(ms), width: 9, height: base - Y(ms), rx: 2,
        fill: bad ? t.warnSoft : t.tint, stroke: bad ? t.warn : t.line, 'stroke-width': 1.2
      });
    });

    /* the injected span */
    I.bracket(s, X(0.512), X(0.739), base + 10, 'injected · ~80 ms apart', { warn: true });

    /* the alert: the first interval that exceeds the configured rate */
    var ax = X(0.920), ay = Y(300);
    I.mk(s, 'circle', { cx: ax, cy: ay - 15, r: 4.5, fill: t.warn, stroke: t.warn });
    I.label(s, ax - 11, ay - 11, 'LED alert · loop stops · 300 ms', { anchor: 'end', warn: true });
    I.label(s, x0 - 12, base + 4, 'time →', { anchor: 'end', size: 9.5 });
  }
  ids.kind = 'diagram';
  ids.height = 240;
  ids.aria = 'Packet arrivals on the bus with the interval measured for each one: four frames at the configured 200 millisecond rate, then a dense injected burst about 80 milliseconds apart, and finally an interval of 300 milliseconds that crosses the threshold and raises the LED alert.';

  I.scenes.can = { thumb: thumb, hero: hero, frame: frame, packing: packing, ids: ids };
})();
