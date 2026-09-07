/* ==========================================================================
   assets/js/scenes/5g_oran.js — 5G O-RAN end-to-end simulation (08 s. 4.4)
   scenes: thumb (400x225), hero (1200x400), bringup (780x320)
   The single --blue subject is the E2 link between the RIC and the gNB.
   ZMQ and N2/N3 are drawn in --line so the accent stays alone.
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
    var k = hero ? 1.76 : 1;
    var O = hero ? [534, 372] : [131, 211];
    var t = ctx.tokens, i;

    I.grid(s);

    /* one label block centred on an isometric top face */
    function topLabel(pt, lines, o) {
      var n = Array.isArray(lines) ? lines.length : 1, lh = 12.5;
      I.label(s, pt[0], pt[1] + 3.5 - (n - 1) * lh / 2, lines,
        { anchor: 'middle', lineHeight: lh, accent: o && o.accent });
    }

    /* ---- floor: the Docker Compose slab -------------------------------- */
    var FW = 220 * k, FD = 62 * k, FH = 8 * k;
    I.isoSlab(s, O, FW, FD, { h: FH });

    /* ---- RIC one level up, above and behind the gNB -------------------- */
    /* drawn before the ground row: it is further back along the view axis  */
    var RB = 62 * k, RS = 50 * k, RCS = 38 * k, RCH = 20 * k;
    I.isoSlab(s, P(O, 104 * k, 28 * k, RB), RS, RS, { h: 5 * k });
    var ricO = P(O, 110 * k, 34 * k, RB + 5 * k);
    I.isoContainer(s, ricO, RCS, RCS, RCH);
    var ricTop = P(ricO, RCS / 2, RCS / 2, RCH);
    var ricFoot = P(ricO, RCS / 2, RCS / 2, 0);

    /* ---- ground row: UE -> gNB -> Core, left to right ------------------- */
    var cw = 46 * k, cd = 38 * k, ch = 24 * k, cb = 12 * k;
    var cAs = [8 * k, 84 * k, 160 * k], tops = [], oc;

    /* network namespace around the UE footprint (hero only) */
    if (hero) {
      var m = 13 * k, ns = [[-m, -m], [cw + m, -m], [cw + m, cd + m], [-m, cd + m]]
        .map(function (q) { return P(O, cAs[0] + q[0], cb + q[1], FH); });
      I.mk(s, 'polygon', {
        points: ns.map(function (q) { return q[0].toFixed(1) + ',' + q[1].toFixed(1); }).join(' '),
        fill: 'none', stroke: t.line, 'stroke-width': 1.2, 'stroke-dasharray': '4 3'
      });
    }

    for (i = 2; i >= 0; i--) {                     /* back to front */
      oc = P(O, cAs[i], cb, FH);
      I.isoContainer(s, oc, cw, cd, ch);
      tops[i] = P(oc, cw / 2, cd / 2, ch);
    }

    /* ---- links: --line, so the E2 accent stays alone -------------------- */
    var linkH = FH + ch / 2;
    function link(a1, a2) {
      var p = P(O, a1, cb + cd / 2, linkH), q = P(O, a2, cb + cd / 2, linkH);
      I.arrow(s, p[0], p[1], q[0], q[1], { both: true, color: t.line });
      return P(O, (a1 + a2) / 2, 2 * k, FH);   /* label seat on the front strip */
    }
    var zmq = link(cAs[0] + cw, cAs[1]);
    var n2n3 = link(cAs[1] + cw, cAs[2]);

    /* ---- E2: the one --blue flow --------------------------------------- */
    var e2Top = [ricFoot[0], ricFoot[1] - 2 * k];
    var e2Bot = [tops[1][0] + 1 * k, tops[1][1] - 13 * k];
    I.arrow(s, e2Top[0], e2Top[1], e2Bot[0], e2Bot[1],
      { dashed: true, both: true, accent: true });

    /* --------------------------------------------------------- labels --- */
    var names = hero
      ? [['UE', 'srsRAN', 'netns ue1'], ['gNB', 'srsRAN'], ['Core', 'Open5GS', 'AMF']]
      : ['UE', 'gNB', 'Core'];
    for (i = 0; i < 3; i++) topLabel(tops[i], names[i]);
    topLabel(ricTop, hero ? ['RIC', 'O-RAN SC'] : 'RIC');

    if (!hero) return;

    I.label(s, (e2Top[0] + e2Bot[0]) / 2 - 9 * k, (e2Top[1] + e2Bot[1]) / 2 - 3,
      ['E2', 'E2AP'], { anchor: 'end', accent: true, lineHeight: 13 });
    I.label(s, zmq[0], zmq[1] + 2, 'ZMQ', { anchor: 'middle' });
    I.label(s, n2n3[0], n2n3[1] + 2, 'N2/N3', { anchor: 'middle' });
    var fL = P(O, 0, FD, 0);
    I.label(s, fL[0] - 10, fL[1] + 14 * k, 'Docker Compose', { anchor: 'end' });
  }

  function thumb(s, ctx) { stage(s, ctx); }
  thumb.kind = 'thumb';
  thumb.aria = 'Isometric view: UE, gNB and core containers stand left to right on a Docker Compose slab, with the RIC one level above the gNB on an E2 link.';

  function hero(s, ctx) { stage(s, ctx); }
  hero.kind = 'hero';
  hero.aria = 'Isometric view of the 5G chain: srsRAN UE in its own network namespace talks to an srsRAN gNB over ZMQ, the gNB reaches the Open5GS core over N2 and N3, and the O-RAN SC RIC sits one level above the gNB connected by an E2 link.';

  /* -------------------------------------------------------- s3: bringup */
  function bringup(s, ctx) {
    var t = ctx.tokens;
    var steps = [
      ['5gc up', 'docker compose up 5gc', 'AMF NGAP :38412'],
      ['RIC up', 'docker compose up · oran-sc-ric', '"RMR is ready now..."'],
      ['gNB -e2', './gnb -c gnb_zmq.yaml e2', 'E2 session'],
      ['UE attach', 'ip netns add ue1 · ./srsue ue_zmq.conf', 'NAS attach · IP assigned'],
      ['verify', 'core · RIC · gNB · UE running together', 'connectivity end to end']
    ];
    var y0 = 54, rh = 44, gap = 8, i, y, cy;

    I.label(s, 24, 30, 'bring-up order · one confirmation signal per step', { weight: 600 });
    I.label(s, 640, 30, 'signal it is up', { anchor: 'middle', size: 9.5, accent: true });

    I.mk(s, 'line', {
      x1: 38, y1: y0 + 22, x2: 38, y2: y0 + 4 * (rh + gap) + 22,
      stroke: t.line, 'stroke-width': 1.2
    });

    for (i = 0; i < steps.length; i++) {
      y = y0 + i * (rh + gap);
      cy = y + rh / 2;
      I.mk(s, 'circle', { cx: 38, cy: cy, r: 11, fill: t.paper, stroke: t.line, 'stroke-width': 1.2 });
      I.label(s, 38, cy + 3.5, String(i + 1), { anchor: 'middle', weight: 600 });
      I.box(s, 60, y, 372, rh, { label: steps[i][0], sub: steps[i][1] });
      I.arrow(s, 432, cy, 490, cy, { color: t.line });
      I.box(s, 490, y, 266, rh, {
        label: steps[i][2], fill: 'accent', accent: true, dashed: true, rx: 6
      });
    }

    I.label(s, 60, y0 + 5 * (rh + gap) + 14,
      'each step waits for the line above it; the order is not interchangeable', { size: 9.5 });
  }
  bringup.kind = 'diagram';
  bringup.height = 340;
  bringup.aria = 'Five bring-up steps top to bottom — core, RIC, gNB with E2, UE attach, verify — each with the signal on the right that says it is up.';

  I.scenes['5g_oran'] = { thumb: thumb, hero: hero, bringup: bringup };
})();
