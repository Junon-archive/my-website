/* ==========================================================================
   assets/js/scenes/opencl.js — On-device GPU image processing (08 section 4.5)
   scenes: thumb (400x225), hero (1200x400)
   diagram: stack (780x300)

   The one --blue subject of the scene is the pixel neighbourhood that a
   work-item reads; nothing else in the scene is accented. The mask size is
   not verified, so the region is labelled "neighbourhood", never "5x5".
   ========================================================================== */
(function () {
  'use strict';
  var I = window.Illus;
  if (!I) return;
  var P = I.P;

  /* --- scene geometry, in unscaled iso units --------------------------- */
  var BW = 136, BD = 63, BH = 7;            /* Android board               */
  var TX = 8.5, TY = 8.5, TW = 14, TD = 8.4, TG = 1, TH = 1.4;  /* tiles   */
  var COLS = 8, ROWS = 5;
  var DA = 64, DB = 16, DS = 40, DH = 10, DFLOAT = 40;           /* GPU die */
  var WX = 66.5, WY = 23, WS = 4.4, WG = 0.7, WC = 7, WR = 5;    /* work-items */

  /* the 5-cell neighbourhood: centre (col 1, row 1) and its four neighbours */
  var NB = [1 * COLS + 1, 0 * COLS + 1, 2 * COLS + 1, 1 * COLS + 0, 1 * COLS + 2];

  /* ---------------------------------------------------------------- scene */
  function stage(s, ctx) {
    var hero = ctx.variant === 'hero';
    var k = hero ? 2.25 : 1.34;
    var O = hero ? [529, 346] : [157, 199];
    var t = ctx.tokens;

    function u(n) { return n * k; }
    function p(a, b, h) { return P(O, a * k, b * k, (h || 0) * k); }

    I.grid(s);

    /* --- Android board with the image on its screen --------------------- */
    I.isoPhone(s, O, { w: u(BW), d: u(BD), h: u(BH) });
    var tiles = I.isoBankArray(s, p(TX, TY, BH), COLS, ROWS, {
      cw: u(TW), cd: u(TD), ch: u(TH), gap: u(TG),
      fill: 'paper', on: NB, onFill: 'accent'
    });

    /* --- GPU die floating above, with its work-item grid ---------------- */
    I.isoChip(s, p(DA, DB, DFLOAT), u(DS), { h: u(DH) });
    var items = I.isoBankArray(s, p(WX, WY, DFLOAT + DH), WC, WR, {
      cw: u(WS), cd: u(WS), ch: u(1.2), gap: u(WG),
      fill: 'paper', on: [WC + 1], onFill: 'accent'
    });

    /* --- drop lines: the die hovers over the image plane ---------------- */
    [DA, DA + DS].forEach(function (a) {
      var d0 = p(a, DB, DFLOAT), d1 = p(a, DB, BH + TH);
      I.mk(s, 'line', {
        x1: d0[0], y1: d0[1], x2: d1[0], y2: d1[1],
        stroke: t.line, 'stroke-width': 1.2, 'stroke-dasharray': '4 3'
      });
    });

    /* --- neighbourhood -> work-item, the single accent flow ------------- */
    var wi = items[WC + 1].top;
    [NB[0], NB[3]].forEach(function (idx) {
      var c = tiles[idx].top;
      I.mk(s, 'line', {
        x1: c[0], y1: c[1] - 1, x2: wi[0], y2: wi[1] + 2,
        stroke: t.blue, 'stroke-width': 1, 'stroke-dasharray': '4 3'
      });
    });

    /* --------------------------------------------------------- labels --- */
    var dieL = p(DA, DB + DS, DFLOAT + DH);                   /* die left    */
    var gridR = p(WX + WC * (WS + WG), WY, DFLOAT + DH + 1.2);/* items right */
    var boardL = p(0, BD, BH);                                /* board left  */

    I.label(s, dieL[0] - u(7), dieL[1], 'Mali GPU', { anchor: 'end' });
    I.label(s, gridR[0] + u(7), gridR[1] + u(3), 'work-items');
    I.label(s, boardL[0] - u(6), boardL[1] + u(4), 'image', { anchor: 'end' });
    var drop = p(DA + DS, DB, DFLOAT);                        /* right riser */
    I.label(s, drop[0] + u(18), drop[1] + u(48), 'JNI');

    if (!hero) return;

    /* hero: two more leaders, both into free space outside the board */
    var nb = tiles[NB[1]].top;
    I.leader(s, nb[0] - u(26), nb[1] + u(36), nb[0] - u(3), nb[1] + u(1),
      'neighbourhood', { anchor: 'end', accent: true });
    var edge = p(BW / 2, 0, BH);
    I.leader(s, edge[0] + u(11), edge[1] + u(44), edge[0] + u(1), edge[1] + u(2),
      'Android board', { anchor: 'start' });
  }

  function thumb(s, ctx) { stage(s, ctx); }
  thumb.kind = 'thumb';
  thumb.aria = 'Isometric Android board showing an image as a grid of tiles, with a GPU die floating above it; one pixel neighbourhood is highlighted and linked to a work-item on the GPU.';

  function hero(s, ctx) { stage(s, ctx); }
  hero.kind = 'hero';
  hero.aria = 'Isometric view of on-device GPU image processing: an Android board holds the bitmap as an 8 by 5 tile grid, a Mali GPU die floats above it, and the highlighted pixel neighbourhood maps onto one work-item of the GPU grid.';

  /* ------------------------------------------------------- s3: stack --- */
  function stack(s, ctx) {
    var t = ctx.tokens, x = 86, w = 300, cx = x + w / 2;

    I.label(s, 24, 50, 'Java', { size: 9.5 });
    I.label(s, 24, 158, 'native C', { size: 9.5 });
    I.label(s, 24, 274, 'device', { size: 9.5 });

    I.box(s, x, 26, w, 44, { label: 'Activity (Java)', sub: 'ARGB_8888 bitmap', rx: 6 });
    I.box(s, x, 80, w, 44, { label: 'JNI', sub: 'native method per operation' });
    I.box(s, x, 134, w, 44, { label: 'OpenCLDriver.c', sub: 'context · queue · buffers' });
    I.box(s, x, 188, w, 50, {
      label: 'clBuildProgram · clEnqueueNDRangeKernel',
      sub: '1-D NDRange · local size 64', size: 10
    });
    I.box(s, x, 250, w, 40, { label: 'Mali GPU', rx: 6 });

    I.arrow(s, cx, 70, cx, 80);
    I.arrow(s, cx, 124, cx, 134);
    I.arrow(s, cx, 178, cx, 188);
    I.arrow(s, cx, 238, cx, 250);

    /* --- right column: the pixel data path, the one accent flow -------- */
    I.mk(s, 'rect', {
      x: 452, y: 62, width: 304, height: 232, rx: 6,
      fill: 'none', stroke: t.line, 'stroke-width': 1.2, 'stroke-dasharray': '4 3'
    });
    I.label(s, 452, 54, 'pixel data path', { accent: true, weight: 600 });

    /* ties between the call path and the data path at the matching stage */
    [96, 270].forEach(function (ty) {
      I.mk(s, 'line', {
        x1: x + w, y1: ty, x2: 452, y2: ty, stroke: t.line,
        'stroke-width': 1.2, 'stroke-dasharray': '4 3'
      });
    });

    I.box(s, 470, 80, 268, 32, { label: 'AndroidBitmap_lockPixels', size: 10 });
    I.box(s, 470, 188, 126, 50, { label: 'clEnqueue', sub: 'WriteBuffer', size: 10 });
    I.box(s, 612, 188, 126, 50, { label: 'clEnqueue', sub: 'ReadBuffer', size: 10 });
    I.box(s, 470, 250, 268, 40, { label: 'device buffer (Mali GPU)', size: 10 });

    I.arrow(s, 533, 112, 533, 188, { accent: true, label: 'staging buffer', labelDx: 8, labelAnchor: 'start', labelDy: 4 });
    I.arrow(s, 533, 238, 533, 250, { accent: true });
    I.arrow(s, 675, 250, 675, 238, { accent: true });
    I.arrow(s, 675, 188, 675, 112, { accent: true, label: 'result', labelDx: 8, labelAnchor: 'start', labelDy: 4 });
  }
  stack.kind = 'diagram';
  stack.height = 300;
  stack.aria = 'Call path from the Java activity through JNI to OpenCLDriver.c, clBuildProgram and clEnqueueNDRangeKernel, and down to the Mali GPU, with the pixels crossing the same boundary twice: AndroidBitmap_lockPixels into clEnqueueWriteBuffer on the way in and clEnqueueReadBuffer on the way out.';

  I.scenes.opencl = { thumb: thumb, hero: hero, stack: stack };
})();
