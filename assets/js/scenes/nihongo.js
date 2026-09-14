/* ==========================================================================
   assets/js/scenes/nihongo.js — Nihongo Context, full-stack learning app (08 s. 4.10)
   scenes: thumb (400x225), hero (1200x400)
   The single --blue subject is sentence pre-generation: worker -> LLM ->
   database, the path that fills the study queue before anyone asks for it.
   The browser, static host and API stay in face shading.
   ========================================================================== */
(function () {
  'use strict';
  var I = window.Illus;
  if (!I) return;
  var P = I.P;

  function stage(s, ctx) {
    var hero = ctx.variant === 'hero';
    var k = hero ? 1.8 : 1.02;
    var O = hero ? [470, 372] : [118, 208];
    var t = ctx.tokens, F = ctx.font || 10.5;

    function p(a, b, h) { return P(O, a * k, b * k, (h || 0) * k); }
    function topLabel(pt, text) {
      I.label(s, pt[0], pt[1] + F * 0.34, text, { anchor: 'middle', size: F });
    }

    I.grid(s);

    /* ---- LLM: a chip floating above and behind the server slab --------- */
    var LA = 150, LB = 70, LH = 56;
    I.isoChip(s, p(LA, LB, LH), 30 * k, { h: 9 * k, fill: 'accent-soft' });
    var llmTop = p(LA + 15, LB + 15, LH + 9);
    var llmFoot = p(LA + 15, LB, LH);

    /* ---- server slab: API, worker, database ---------------------------- */
    var SW = 176, SD = 62, SH = 7;
    I.isoSlab(s, p(58, 0, 0), SW * k, SD * k, { h: SH * k });

    /* database: a layered stack at the back right */
    var dbO = p(170, 14, SH);
    I.isoStack(s, dbO, 40 * k, 34 * k, 4, { layerH: 6 * k });
    var dbTop = p(190, 31, SH + 24);

    /* worker (middle) and API (front left) */
    var wkO = p(118, 14, SH);
    I.isoContainer(s, wkO, 38 * k, 34 * k, 22 * k);
    var wkTop = p(137, 31, SH + 22);
    var apiO = p(66, 14, SH);
    I.isoContainer(s, apiO, 38 * k, 34 * k, 22 * k);
    var apiTop = p(85, 31, SH + 22);

    /* ---- browser: a phone on the left, off the server ------------------- */
    I.isoPhone(s, p(0, 10, 0), { w: 38 * k, d: 58 * k, h: 5 * k });
    var phoneTop = p(19, 39, 5);

    /* ---- plain request path: browser -> API (logged-in study only) ------ */
    var ph = p(38, 36, 8), ap = p(66, 30, SH + 10);
    I.arrow(s, ph[0] + 2 * k, ph[1], ap[0] - 2 * k, ap[1], { color: t.slate, width: 1.2 });

    /* ---- the accent: worker -> LLM -> database ------------------------- */
    var wkR = p(150, 38, SH + 22);
    I.arrow(s, wkTop[0] + 6 * k, wkTop[1] - 6 * k, llmFoot[0] - 6 * k, llmFoot[1] + 4 * k,
      { dashed: true, accent: true });
    I.arrow(s, llmFoot[0] + 10 * k, llmFoot[1] + 6 * k, dbTop[0] - 2 * k, dbTop[1] - 8 * k,
      { dashed: true, accent: true });

    /* ------------------------------------------------------------ labels */
    topLabel(apiTop, 'API');
    topLabel(wkTop, 'worker');
    I.label(s, dbTop[0] + 26 * k, dbTop[1] + 26 * k, 'PostgreSQL', { anchor: 'start' });
    I.label(s, llmTop[0], llmTop[1] - 22 * k, 'LLM', { anchor: 'middle', accent: true });

    if (!hero) return;

    I.leader(s, phoneTop[0] - 30 * k, phoneTop[1] - 50 * k, phoneTop[0], phoneTop[1] - 2,
      'browser · trial and kana need no server', { anchor: 'end' });
    var mid = [(wkTop[0] + llmFoot[0]) / 2, (wkTop[1] + llmFoot[1]) / 2 - 3 * k];
    I.leader(s, mid[0] - 50 * k, mid[1] - 34 * k, mid[0] - 2, mid[1],
      'sentences generated ahead of time', { anchor: 'end', accent: true });
    I.leader(s, dbTop[0] + 60 * k, dbTop[1] - 20 * k, dbTop[0] + 12 * k, dbTop[1] - 2 * k,
      'review schedule · furigana stored', { anchor: 'start' });
  }

  function thumb(s, ctx) { stage(s, ctx); }
  thumb.kind = 'thumb';
  thumb.aria = 'Isometric server slab with an API, a worker and a PostgreSQL stack; the worker sends work to an LLM chip above, whose output lands in the database, while a phone on the left talks to the API.';

  function hero(s, ctx) { stage(s, ctx); }
  hero.kind = 'hero';
  hero.aria = 'Isometric view of Nihongo Context: a browser uses the API only for logged-in study, while a background worker asks an LLM for new study sentences ahead of time and stores them, with their review schedule and furigana, in PostgreSQL.';

  /* ---------------------------------------------------------- s3: arch */
  function arch(s, ctx) {
    var t = ctx.tokens;

    I.box(s, 24, 40, 176, 62, { label: 'browser', sub: 'trial · kana: 0 API calls' });
    I.arrow(s, 112, 102, 112, 150, { both: true, label: 'HTML / JS', labelDx: 8, labelAnchor: 'start', labelDy: 4 });
    I.box(s, 24, 150, 176, 52, { label: 'static hosting', sub: 'Cloudflare' });

    I.arrow(s, 200, 71, 272, 71, { dashed: true, label: 'study only', labelDy: -8, size: 9.5 });
    I.box(s, 272, 40, 156, 62, { label: 'FastAPI', sub: 'auth · selection · events' });
    I.arrow(s, 350, 102, 350, 150, { both: true });
    I.box(s, 272, 150, 156, 62, { label: 'PostgreSQL 16', sub: '20 tables · job queue' });

    I.arrow(s, 428, 181, 500, 181, { both: true, accent: true, label: 'SKIP LOCKED', labelDy: -8, size: 9.5 });
    I.box(s, 500, 150, 120, 62, { label: 'worker', sub: 'validate · furigana', fill: 'accent', accent: true });
    I.arrow(s, 620, 181, 648, 181, { accent: true, both: true });
    I.box(s, 648, 150, 108, 62, { label: 'LLM', sub: 'strict JSON', fill: 'accent', accent: true });

    /* the path that does not exist: API -> LLM */
    I.mk(s, 'path', {
      d: 'M428 60 C 560 44, 660 70, 702 150', fill: 'none',
      stroke: t.warn, 'stroke-width': 1.2, 'stroke-dasharray': '4 3'
    });
    I.label(s, 590, 50, '✕ never in a request', { anchor: 'middle', warn: true, size: 9.5 });

    I.bracket(s, 500, 756, 232, '13 checks before any write → ready pool');
    I.label(s, 24, 290, 'a tap is served from stored explanations; generation happens ahead of time', { size: 9.5 });
  }
  arch.kind = 'diagram';
  arch.height = 310;
  arch.aria = 'The browser loads static files from Cloudflare and uses the FastAPI service only for logged-in study; the API reads and writes PostgreSQL. A worker claims jobs from PostgreSQL with SKIP LOCKED, calls the LLM for structured JSON, and runs 13 checks before writing to the ready pool. A crossed dashed line marks that the API never calls the LLM.';

  I.scenes.nihongo = { thumb: thumb, hero: hero, arch: arch };
})();
