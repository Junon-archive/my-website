/* ==========================================================================
   assets/js/scenes/riff.js — Riff, static guitar curriculum (08 section 4.8)
   scenes: thumb (400x225), hero (1200x400), arch (780x300)
   The single --blue subject is the scale shape rendered on the fretboard:
   the notes a lesson asks the player to learn. The score card that feeds it
   and the lesson pages beside it stay in face shading.
   ========================================================================== */
(function () {
  'use strict';
  var I = window.Illus;
  if (!I) return;
  var P = I.P;

  /* A minor pentatonic, first box (frets 5-8), strings 6 (low) .. 1 (high) */
  var BOX = [[0, 5], [0, 8], [1, 5], [1, 7], [2, 5], [2, 7], [3, 5], [3, 7], [4, 5], [4, 8], [5, 5], [5, 8]];

  function stage(s, ctx) {
    var hero = ctx.variant === 'hero';
    var k = hero ? 1.9 : 1.05;
    var O = hero ? [470, 360] : [120, 200];
    var t = ctx.tokens, i;

    function p(a, b, h) { return P(O, a * k, b * k, (h || 0) * k); }
    function seg(a1, b1, a2, b2, h, o) {
      var q1 = p(a1, b1, h), q2 = p(a2, b2, h);
      return I.mk(s, 'line', Object.assign({
        x1: q1[0].toFixed(1), y1: q1[1].toFixed(1), x2: q2[0].toFixed(1), y2: q2[1].toFixed(1),
        stroke: t.line, 'stroke-width': 1
      }, o || {}));
    }

    I.grid(s);

    /* ---- lesson pages: a short stack behind the neck, to the right ------ */
    var LA = 150, LB = 80;
    for (i = 0; i < 3; i++) {
      I.isoBox(s, P(p(LA, LB, 0), 0, 0, i * 5 * k), 44 * k, 30 * k, 4 * k,
        { fill: i === 2 ? undefined : 'paper' });
    }
    var pagesTop = p(LA + 22, LB + 15, 15);

    /* ---- score card floating above the neck, to the left --------------- */
    var CA = 4, CB = 84, CH = 30;
    I.isoBox(s, p(CA, CB, CH), 40 * k, 26 * k, 3 * k);
    for (i = 0; i < 3; i++) seg(CA + 6, CB + 7 + i * 6, CA + 26 - i * 5, CB + 7 + i * 6, CH + 3);
    var cardFoot = p(CA + 20, CB, CH);

    /* ---- the neck: a long board, six strings, frets ------------------- */
    var NW = 196, ND = 66, NH = 7, F0 = 10, FW = 26, SG = 11;
    I.isoBox(s, O, NW * k, ND * k, NH * k);
    for (i = 0; i <= 7; i++) seg(F0 + i * FW, 2, F0 + i * FW, ND - 2, NH);
    for (i = 0; i < 6; i++) seg(3, 5.5 + i * SG, NW - 3, 5.5 + i * SG, NH, { stroke: t.slate, opacity: 0.6 });

    /* ---- score -> neck: rendered, not drawn by hand -------------------- */
    var into = p(F0 + 1.5 * FW, ND - 8, NH + 2);
    I.arrow(s, cardFoot[0], cardFoot[1] + 3, into[0], into[1] - 3 * k,
      { dashed: true, color: t.slate, width: 1.2 });

    /* ---- the accent: the scale box on frets 5-8 ------------------------- */
    /* fret n sits in the middle of the cell between fret lines n-1 and n,
       counting the drawn cells from fret 4 */
    BOX.forEach(function (n) {
      var c = p(F0 + (n[1] - 4 - 0.5) * FW, 5.5 + n[0] * SG, NH);
      I.mk(s, 'ellipse', { cx: c[0].toFixed(1), cy: c[1].toFixed(1), rx: 4.6 * k, ry: 2.7 * k, fill: t.blue });
    });

    /* ------------------------------------------------------------ labels */
    var neckL = p(0, ND, NH / 2);
    I.label(s, cardFoot[0] - 26 * k, cardFoot[1] - 24 * k, 'score JSON', { anchor: 'middle' });
    I.label(s, neckL[0] - 8 * k, neckL[1] + 12 * k, 'SVG fretboard', { anchor: 'end' });
    I.label(s, pagesTop[0] + 12 * k, pagesTop[1] - 12 * k, 'lesson days', { anchor: 'start' });

    if (!hero) return;

    var box = p(F0 + 3.5 * FW, 5.5, NH);
    I.leader(s, box[0] + 30 * k, box[1] + 34 * k, box[0], box[1] + 2,
      'pentatonic box · frets 5–8', { anchor: 'start', accent: true });
    I.leader(s, pagesTop[0] + 70 * k, pagesTop[1] + 6 * k, pagesTop[0] + 24 * k, pagesTop[1] + 2 * k,
      'static pages · KR / EN / JP', { anchor: 'start' });
  }

  function thumb(s, ctx) { stage(s, ctx); }
  thumb.kind = 'thumb';
  thumb.aria = 'Isometric guitar neck with a pentatonic scale shape highlighted on it, rendered from a floating score card, next to a stack of lesson pages.';

  function hero(s, ctx) { stage(s, ctx); }
  hero.kind = 'hero';
  hero.aria = 'Isometric view of Riff: a score described as JSON is rendered into an SVG fretboard, where the first A minor pentatonic box on frets 5 to 8 is highlighted, beside a stack of static lesson pages built in Korean, English and Japanese.';

  /* ---------------------------------------------------------- s3: arch */
  function arch(s, ctx) {
    var t = ctx.tokens;

    I.label(s, 24, 30, 'build time · Node', { weight: 600 });
    I.label(s, 540, 30, 'run time · browser', { weight: 600 });
    I.mk(s, 'line', {
      x1: 520, y1: 18, x2: 520, y2: 322, stroke: t.line,
      'stroke-width': 1.2, 'stroke-dasharray': '4 3'
    });

    /* build column */
    I.box(s, 24, 50, 210, 56, { label: 'lesson .md × 3 languages', sub: 'front matter + score JSON' });
    I.arrow(s, 234, 78, 266, 78);
    I.box(s, 266, 50, 234, 56, { label: 'build-content.mjs', sub: 'schema · beat sums · 3-lang parity' });
    I.label(s, 383, 124, '✗ invalid score → build fails', { anchor: 'middle', warn: true, size: 9.5 });

    I.arrow(s, 383, 132, 383, 150);
    I.box(s, 24, 150, 476, 56, { label: 'Astro static build', sub: 'routes × ko / en / ja · hreflang · sitemap' });

    I.arrow(s, 137, 206, 137, 234);
    I.arrow(s, 387, 206, 387, 234);
    I.box(s, 24, 234, 226, 56, { label: 'fretboard.ts', sub: 'own SVG renderer', fill: 'accent', accent: true });
    I.box(s, 274, 234, 226, 56, { label: 'staff.ts', sub: 'VexFlow 4 in jsdom → SVG', fill: 'accent', accent: true });
    I.label(s, 262, 310, 'scores become inline SVG here, once per language', { anchor: 'middle', size: 9.5, accent: true });

    /* run column */
    I.arrow(s, 500, 178, 540, 90);
    I.box(s, 540, 50, 216, 56, { label: '1,012 static pages', sub: 'HTML + inline SVG' });
    I.arrow(s, 648, 106, 648, 132);
    I.box(s, 540, 132, 216, 46, { label: 'Cloudflare Pages CDN' });
    I.arrow(s, 648, 178, 648, 200);
    I.box(s, 540, 200, 216, 116, {
      label: 'browser', sub: '28 KB gzip of JS',
      inner: ['app.ts ⇄ localStorage', 'import(): audio tools']
    });
  }
  arch.kind = 'diagram';
  arch.height = 330;
  arch.aria = 'Two lanes split by a dashed line. Build time in Node: lesson Markdown in three languages with score JSON goes through build-content.mjs, which fails the build on an invalid score, then an Astro static build, where fretboard.ts and staff.ts running VexFlow in jsdom turn scores into SVG. Run time: 1,012 static pages on the Cloudflare Pages CDN reach a browser that only adds progress from localStorage and lazily imported audio tools.';

  I.scenes.riff = { thumb: thumb, hero: hero, arch: arch };
})();
