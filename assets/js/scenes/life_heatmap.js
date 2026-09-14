/* ==========================================================================
   assets/js/scenes/life_heatmap.js — Life Heatmap, offline-first PWA (08 s. 4.9)
   scenes: thumb (400x225), hero (1200x400)
   The single --blue subject is a streak: consecutive days on the heatmap
   that the app counts by itself. The sync link to the edge store and the
   second device stay in --line / face shading.
   ========================================================================== */
(function () {
  'use strict';
  var I = window.Illus;
  if (!I) return;
  var P = I.P;

  var COLS = 7, ROWS = 6;
  /* one streak of 9 days running through weeks 2-3, then a gap */
  var STREAK = [8, 9, 10, 11, 12, 13, 14, 15, 16];
  /* marked days outside the streak: plain face-shaded cells */
  var MARKED = [1, 3, 4, 20, 22, 23, 26, 29, 30, 33, 36, 38];

  function stage(s, ctx) {
    var hero = ctx.variant === 'hero';
    var k = hero ? 2.0 : 1.12;
    var O = hero ? [520, 372] : [150, 206];
    var t = ctx.tokens, i;

    function p(a, b, h) { return P(O, a * k, b * k, (h || 0) * k); }

    I.grid(s);

    /* ---- edge store: a container one level up, behind ------------------ */
    var KA = 118, KB = 64, KH = 40;
    I.isoSlab(s, p(KA - 6, KB - 6, KH - 5), 42 * k, 42 * k, { h: 5 * k });
    I.isoContainer(s, p(KA, KB, KH), 30 * k, 30 * k, 18 * k);
    var kvTop = p(KA + 15, KB + 15, KH + 18);
    var kvFoot = p(KA + 15, KB, KH);

    /* ---- second device (PC), flat slab on the right -------------------- */
    var DA = 150, DB = 4;
    I.isoSlab(s, p(DA, DB, 0), 58 * k, 38 * k, { h: 4 * k });
    I.isoBankArray(s, p(DA + 6, DB + 6, 4), 7, 4, {
      cw: 5.4 * k, cd: 5.4 * k, ch: 0.8 * k, gap: 1.4 * k, fill: 'paper', on: [], onFill: 'tint'
    });
    var pcTop = p(DA + 29, DB + 38, 4);

    /* ---- phone with the heatmap on its screen ------------------------- */
    var PW = 96, PD = 86, PH = 7;
    I.isoPhone(s, O, { w: PW * k, d: PD * k, h: PH * k });
    var cells = I.isoBankArray(s, p(12, 10, PH), COLS, ROWS, {
      cw: 9 * k, cd: 9 * k, ch: 1.6 * k, gap: 1.6 * k,
      fill: 'paper', on: STREAK, onFill: 'accent'
    });
    MARKED.forEach(function (idx) {
      var c = cells[idx];
      I.isoBox(s, c.o, c.cw, c.cd, c.h, { fill: { top: 'line', left: 'tint', right: 'paper' } });
    });

    /* ---- sync links: --line, so the streak stays the only accent -------- */
    var phoneR = p(PW - 6, PD - 10, PH + 2);
    I.arrow(s, phoneR[0] + 2 * k, phoneR[1] - 2 * k, kvFoot[0] - 12 * k, kvFoot[1] + 4 * k,
      { dashed: true, both: true, color: t.slate, width: 1.2 });
    var pcB = p(DA + 30, DB + 38, 4);
    I.arrow(s, pcB[0] - 4 * k, pcB[1] - 2 * k, kvFoot[0] + 12 * k, kvFoot[1] + 2 * k,
      { dashed: true, both: true, color: t.slate, width: 1.2 });

    /* ------------------------------------------------------------ labels */
    var phoneL = p(0, PD, PH / 2);
    I.label(s, phoneL[0] - 8 * k, phoneL[1] + 12 * k, 'phone · PWA', { anchor: 'end' });
    I.label(s, kvTop[0], kvTop[1] - 20 * k, 'KV sync', { anchor: 'middle' });
    var st = cells[STREAK[4]].top;
    I.label(s, st[0] - 44 * k, st[1] - 22 * k, 'streak', { anchor: 'end', accent: true });
    I.label(s, pcTop[0] + 30 * k, pcTop[1] + 36 * k, 'PC', { anchor: 'start' });

    if (!hero) return;

    var first = cells[STREAK[0]].top;
    I.leader(s, first[0] + 80 * k, first[1] + 58 * k, first[0] + 2, first[1] + 1,
      '9 days in a row · counted, not typed', { anchor: 'start', accent: true });
    I.leader(s, kvTop[0] + 70 * k, kvTop[1] - 8 * k, kvTop[0] + 8 * k, kvTop[1],
      'Cloudflare KV · last-write-wins per cell', { anchor: 'start' });
    I.leader(s, phoneL[0] - 30 * k, phoneL[1] - 40 * k, phoneL[0] + 4 * k, phoneL[1] - 12 * k,
      'works offline', { anchor: 'end' });
  }

  function thumb(s, ctx) { stage(s, ctx); }
  thumb.kind = 'thumb';
  thumb.aria = 'Isometric phone showing a heatmap of days with one highlighted streak, synced through an edge key-value store to a second device.';

  function hero(s, ctx) { stage(s, ctx); }
  hero.kind = 'hero';
  hero.aria = 'Isometric view of Life Heatmap: a phone holds a grid of days in which a run of consecutive days is highlighted as a streak, and the phone and a PC keep the same data through a Cloudflare KV store while each still works offline.';

  /* ---------------------------------------------------------- s3: arch */
  function arch(s, ctx) {
    var t = ctx.tokens;

    function frame(x, y, w, h, text) {
      I.mk(s, 'rect', {
        x: x, y: y, width: w, height: h, rx: 6, fill: 'none',
        stroke: t.line, 'stroke-width': 1.2, 'stroke-dasharray': '4 3'
      });
      I.label(s, x, y - 8, text, { weight: 600 });
    }

    frame(16, 40, 474, 256, 'device · phone or PC');
    frame(514, 40, 250, 256, 'Cloudflare · free tier');

    I.box(s, 34, 62, 132, 52, { label: 'Preact UI', sub: 'cells · editor · year' });
    I.arrow(s, 166, 88, 190, 88);
    I.box(s, 190, 62, 132, 52, { label: 'store.update()', sub: 'one write path' });
    I.arrow(s, 322, 88, 346, 88);
    I.box(s, 346, 62, 126, 52, { label: 'localStorage', sub: 'whole document' });

    I.box(s, 34, 146, 132, 52, { label: 'cellVisual()', sub: 'derived per render' });
    I.arrow(s, 100, 146, 100, 114);

    I.arrow(s, 256, 114, 256, 146, { accent: true });
    I.box(s, 190, 146, 132, 52, { label: 'sync.ts', sub: '3 s debounce · focus', fill: 'accent', accent: true });
    I.arrow(s, 256, 198, 256, 226, { accent: true });
    I.box(s, 190, 226, 132, 52, { label: 'merge.ts', sub: 'per-cell LWW', fill: 'accent', accent: true });

    I.box(s, 346, 226, 126, 52, { label: 'service worker', sub: '13 files precached' });

    I.box(s, 534, 100, 210, 52, { label: 'Pages Function', sub: '/api/data · 48 lines' });
    I.arrow(s, 639, 152, 639, 206, { both: true });
    I.box(s, 534, 206, 210, 52, { label: 'Workers KV', sub: 'sha256(code) → JSON' });

    I.arrow(s, 322, 172, 534, 126, { both: true, accent: true, dashed: true, label: 'X-Sync-Key', labelDy: -8 });
    I.label(s, 34, 318, 'no sync code set → the app makes no network calls at all', { size: 9.5 });
  }
  arch.kind = 'diagram';
  arch.height = 330;
  arch.aria = 'Inside the device, the Preact UI writes through store.update() into a single localStorage document, cellVisual() derives what each cell looks like on render, and sync.ts with merge.ts performs per-cell last-write-wins merging. Across a dashed link carrying the hashed sync key, a 48-line Pages Function stores the document in Workers KV.';

  I.scenes.life_heatmap = { thumb: thumb, hero: hero, arch: arch };
})();
