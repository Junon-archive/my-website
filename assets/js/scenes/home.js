/* ==========================================================================
   assets/js/scenes/home.js — Home hero scene.
   "home.hero": isometric memory hierarchy, ported from temp/preview_v2.html.
   viewBox 460x300 (declared through fn.width / fn.height).
   Spec: docs/spec/08-illustration-system.md
   ========================================================================== */
(function () {
  'use strict';
  var I = window.Illus;
  if (!I) return;

  function hero(s, ctx) {
    var P = I.P, t = ctx.tokens;

    I.grid(s);

    /* ---- GPU package (left, high): interposer + 2 HBM stacks + GPU die ---- */
    var IP = [200, 205];
    I.isoSlab(s, IP, 120, 120, { h: 8 });
    /* back-left HBM, back-right HBM, then the die: back to front */
    I.isoStack(s, P(IP, 30, 90, 8), 40, 22, 4, { layerH: 6.5 });
    I.isoStack(s, P(IP, 90, 30, 8), 22, 40, 4, { layerH: 6.5 });
    I.isoChip(s, P(IP, 35, 35, 8), 50, { h: 14 });

    /* ---- host board (right, low): board + 2 DIMMs + CPU ---- */
    var MB = [392, 278];
    I.isoSlab(s, MB, 60, 60, { h: 8 });
    I.isoDimm(s, P(MB, 42, 18, 8), 40);
    I.isoDimm(s, P(MB, 42, 8, 8), 40);
    I.isoChip(s, P(MB, 12, 30, 8), 24, { h: 10 });

    /* ---- the one accent: the PCIe data path between package and board ---- */
    I.arrow(s, 300, 150, 344, 238, { dashed: true, accent: true, both: true });
    I.label(s, 322, 178, 'PCIe', { accent: true });

    /* ---- labels (5 + 2 caption lines, hero limit is 8) ---- */
    I.leader(s, 120, 100, 138, 105, 'HBM', { anchor: 'end' });
    I.leader(s, 200, 58, 200, 96, 'GPU', { anchor: 'middle' });
    I.leader(s, 330, 252, 364, 240, 'CPU', { anchor: 'end' });
    I.leader(s, 440, 180, 408, 200, 'DDR DRAM', { anchor: 'end', from: [414, 184] });

    I.label(s, 40, 40, 'memory hierarchy');
    I.label(s, 40, 54, 'GPU ↔ host data path');
  }
  hero.kind = 'hero';
  hero.width = 460;
  hero.height = 300;
  hero.aria = 'Isometric diagram of the memory hierarchy: a GPU package with HBM stacks on an interposer, linked over PCIe to a host board with a CPU and DDR DIMMs.';

  I.scenes.home = { hero: hero };
})();
