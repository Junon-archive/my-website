/* ==========================================================================
   assets/js/illustrations.js
   Blueprint Schematic illustration engine. Spec: docs/spec/08-illustration-system.md
   Classic script (no modules, no deps, works from file://). Defines window.Illus.

   Usage in a page:
     <script defer src="assets/js/illustrations.js"></script>
     <script defer src="assets/js/scenes/rowscope.js"></script>
     <figure class="diagram" data-illus="rowscope.address" aria-label="...">
       <figcaption>...</figcaption>
     </figure>
   The <svg> is inserted as the first child of the [data-illus] element.
   ========================================================================== */
(function (global) {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';
  var seq = 0;

  /* viewBox per scene kind (08 section 2, "크기") */
  var KIND = { thumb: [400, 225], hero: [1200, 400], diagram: [780, 300] };
  /* Default label size in viewBox units, chosen so text lands at ~10-11 CSS px
     at the display width of each kind (thumb ~380px, hero ~780-900px, diagram 780px).
     A scene that declares its own canvas (fn.width / fn.height) is drawn at its own
     scale, so it keeps 10.5 unless it sets fn.font. */
  var KIND_FONT = { thumb: 12, hero: 15, diagram: 10.5 };

  /* ---------------------------------------------------------------- tokens */
  /* Fallbacks are the light values of 01 section 1, used only when
     assets/css/tokens.css has not been loaded (dev pages, unit checks). */
  var FALLBACK = {
    '--navy': '#12395F', '--blue': '#1F67A7', '--blue-soft': '#EAF3FB',
    '--ink': '#14283D', '--slate': '#5C7084', '--line': '#DBE4EC',
    '--tint': '#F2F7FB', '--paper': '#FFFFFF', '--canvas': '#F5F8FB',
    '--ok': '#1F7A4D', '--ok-soft': '#E6F4EC',
    '--warn': '#A1620B', '--warn-soft': '#FBF1E0',
    '--mono': '"JetBrains Mono", ui-monospace, Menlo, monospace'
  };

  function tokens() {
    var cs = global.getComputedStyle(document.documentElement);
    function v(n) { var s = (cs.getPropertyValue(n) || '').trim(); return s || FALLBACK[n] || ''; }
    return {
      get: v,
      navy: v('--navy'), blue: v('--blue'), blueSoft: v('--blue-soft'), ink: v('--ink'),
      slate: v('--slate'), line: v('--line'), tint: v('--tint'), paper: v('--paper'),
      canvas: v('--canvas'), warn: v('--warn'), warnSoft: v('--warn-soft'),
      ok: v('--ok'), okSoft: v('--ok-soft'), mono: v('--mono')
    };
  }

  /* --------------------------------------------------------------- helpers */
  function mk(parent, name, attrs) {
    var e = document.createElementNS(NS, name);
    if (attrs) for (var k in attrs) {
      if (attrs[k] !== undefined && attrs[k] !== null && attrs[k] !== false) e.setAttribute(k, attrs[k]);
    }
    if (parent) parent.appendChild(e);
    return e;
  }
  function rootSvg(node) { return node.ownerSVGElement || node; }
  function meta(node) {
    var s = rootSvg(node);
    if (!s.__illus) s.__illus = { W: 0, H: 0, font: 10.5, tokens: tokens(), markers: {}, id: ++seq };
    return s.__illus;
  }
  /* rough advance width of the mono face, used for auto-sized boxes */
  function tw(text, size) { return String(text).length * size * 0.6; }

  function fillOf(t, name, dflt) {
    if (!name) return dflt;
    if (name === 'none') return 'none';
    if (name === 'accent') return t.blueSoft;
    if (name === 'accent-solid') return t.blue;
    if (name === 'warn') return t.warnSoft;
    if (name === 'warn-solid') return t.warn;
    if (name === 'tint') return t.tint;
    if (name === 'paper') return t.paper;
    if (name === 'line') return t.line;
    return name; /* explicit colour string, e.g. tokens.blue */
  }
  function strokeOf(t, o, dflt) {
    if (o.stroke) return o.stroke;
    if (o.warn) return t.warn;
    if (o.accent) return t.blue;
    return dflt;
  }

  /* -------------------------------------------------------- canvas + grid */
  /**
   * Create an <svg>. viewBox "0 0 W H"; width 100% / height auto so the
   * container's aspect-ratio prevents layout shift.
   */
  function svg(container, opts) {
    opts = opts || {};
    var vb = opts.viewBox || '0 0 400 225';
    var p = vb.split(/[\s,]+/).map(Number);
    var s = mk(null, 'svg', {
      viewBox: vb, width: '100%', height: 'auto',
      preserveAspectRatio: opts.preserveAspectRatio || 'xMidYMid meet',
      xmlns: NS
    });
    if (opts.aria) { s.setAttribute('role', 'img'); s.setAttribute('aria-label', opts.aria); }
    else { s.setAttribute('aria-hidden', 'true'); }
    s.__illus = { W: p[2], H: p[3], font: opts.font || 10.5, tokens: opts.tokens || tokens(), markers: {}, id: ++seq };
    if (container) {
      if (opts.first && container.firstChild) container.insertBefore(s, container.firstChild);
      else container.appendChild(s);
    }
    if (opts.grid) grid(s);
    return s;
  }

  /** 28px blueprint grid at 45% --line. Decorative -> aria-hidden.
      Drawn as a pattern-filled rect so fitToContent() can resize it. */
  function grid(s, o) {
    o = o || {};
    var m = meta(s), t = m.tokens, step = o.step || 28;
    var defs = ensureDefs(s);
    var id = 'illus-' + m.id + '-grid';
    var pat = mk(defs, 'pattern', {
      id: id, width: step, height: step, patternUnits: 'userSpaceOnUse'
    });
    mk(pat, 'path', {
      d: 'M' + step + ' 0 L 0 0 0 ' + step, fill: 'none',
      stroke: t.line, 'stroke-width': 1
    });
    var g = mk(null, 'g', {
      'data-illus-grid': '', 'aria-hidden': 'true',
      opacity: o.opacity == null ? 0.45 : o.opacity
    });
    mk(g, 'rect', { x: 0, y: 0, width: m.W, height: m.H, fill: 'url(#' + id + ')' });
    s.insertBefore(g, defs.nextSibling);
    return g;
  }

  function ensureDefs(s) {
    var defs = s.querySelector('defs');
    if (!defs) { defs = mk(null, 'defs'); s.insertBefore(defs, s.firstChild); }
    return defs;
  }

  /**
   * Crop a thumb/hero viewBox to what the scene actually drew, expanded back to
   * the frame aspect ratio, so every card fills its frame the same way.
   * Text is rescaled by the same factor so its rendered size does not change.
   */
  function fitToContent(s) {
    var m = meta(s), wrap = s.querySelector('[data-illus-content]');
    if (!wrap) return;
    var ar = m.W / m.H;
    function measure() {
      try { return wrap.getBBox(); } catch (e) { return null; }
    }
    function boxOf(b) {
      var p = Math.max(b.width, b.height) * 0.06;
      var x = b.x - p, y = b.y - p, w = b.width + 2 * p, h = b.height + 2 * p, n;
      if (w / h < ar) { n = h * ar; x -= (n - w) / 2; w = n; }
      else { n = w / ar; y -= (n - h) / 2; h = n; }
      return [x, y, w, h];
    }
    var bb = measure();
    if (!bb || !(bb.width > 0) || !(bb.height > 0)) return;   /* detached / hidden */
    var box = boxOf(bb), k = box[2] / m.W, i, texts, fs;
    if (Math.abs(k - 1) > 0.01) {
      texts = s.querySelectorAll('text');
      for (i = 0; i < texts.length; i++) {
        fs = parseFloat(texts[i].getAttribute('font-size')) || m.font;
        texts[i].setAttribute('font-size', +(fs * k).toFixed(2));
      }
      bb = measure();
      if (bb && bb.width > 0 && bb.height > 0) box = boxOf(bb);
    }
    s.setAttribute('viewBox', box.map(function (v) { return +v.toFixed(1); }).join(' '));
    m.W = box[2]; m.H = box[3]; m.font = m.font * k;
    var gr = s.querySelector('[data-illus-grid] rect');
    if (gr) {
      gr.setAttribute('x', box[0].toFixed(1)); gr.setAttribute('y', box[1].toFixed(1));
      gr.setAttribute('width', box[2].toFixed(1)); gr.setAttribute('height', box[3].toFixed(1));
    }
  }

  /* ------------------------------------------------------------ isometric */
  /* Fixed 30 degree axes for every scene (08 section 2). */
  var UX = [0.87, -0.5];   /* +a: right and up   */
  var UY = [-0.87, -0.5];  /* +b: left and up    */

  /**
   * Project isometric (a, b, h) onto screen.
   * origin o = [x, y] is the FRONT-BOTTOM corner of the object.
   */
  function P(o, a, b, h) {
    return [o[0] + a * UX[0] + b * UY[0], o[1] + a * UX[1] + b * UY[1] - (h || 0)];
  }
  /** depth key: larger = further back. Draw large first (painter's algorithm). */
  function depth(a, b) { return a + b; }
  /**
   * Sort drawable descriptors back-to-front.
   * key(item) must return a depth number (default item.a + item.b).
   */
  function depthSort(items, key) {
    key = key || function (i) { return depth(i.a || 0, i.b || 0); };
    return items.slice().sort(function (x, y) { return key(y) - key(x); });
  }

  function isoFaces(t, o) {
    o = o || {};
    var f = o.fill;
    var base = { top: t.tint, left: t.blueSoft, right: t.paper, stroke: t.line };
    if (f && typeof f === 'object') {
      return {
        top: fillOf(t, f.top, base.top), left: fillOf(t, f.left, base.left),
        right: fillOf(t, f.right, base.right), stroke: f.stroke || base.stroke
      };
    }
    if (f === 'accent') return { top: t.blue, left: t.blue, right: t.blue, stroke: t.blue };
    if (f === 'accent-soft') return { top: t.blueSoft, left: t.blueSoft, right: t.blueSoft, stroke: t.blue };
    if (f === 'warn') return { top: t.warn, left: t.warn, right: t.warn, stroke: t.warn };
    if (f === 'warn-soft') return { top: t.warnSoft, left: t.warnSoft, right: t.warnSoft, stroke: t.warn };
    if (f === 'ghost') return { top: 'none', left: 'none', right: 'none', stroke: o.stroke || t.line };
    if (f === 'paper') return { top: t.paper, left: t.paper, right: t.paper, stroke: t.line };
    if (o.stroke) base.stroke = o.stroke;
    return base;
  }
  function poly(g, pts, fill, stroke) {
    return mk(g, 'polygon', {
      points: pts.map(function (q) { return q[0].toFixed(2) + ',' + q[1].toFixed(2); }).join(' '),
      fill: fill, stroke: stroke, 'stroke-width': 1, 'stroke-linejoin': 'round'
    });
  }

  /** Cuboid: right face (--paper), left face (--blue-soft), top face (--tint). */
  function isoBox(s, o, w, d, h, opt) {
    opt = opt || {};
    var t = meta(s).tokens, f = isoFaces(t, opt);
    var g = mk(s, 'g', { 'data-iso': 'box', opacity: opt.opacity });
    if (h > 0) {
      poly(g, [P(o, 0, 0, 0), P(o, w, 0, 0), P(o, w, 0, h), P(o, 0, 0, h)], f.right, f.stroke);
      poly(g, [P(o, 0, 0, 0), P(o, 0, d, 0), P(o, 0, d, h), P(o, 0, 0, h)], f.left, f.stroke);
    }
    poly(g, [P(o, 0, 0, h), P(o, w, 0, h), P(o, w, d, h), P(o, 0, d, h)], f.top, f.stroke);
    g.__top = P(o, w / 2, d / 2, h);
    if (opt.label) label(s, g.__top[0], g.__top[1] + 3.5, opt.label, { anchor: 'middle', accent: opt.labelAccent });
    return g;
  }

  /** Thin board / interposer (default thickness 6). */
  function isoSlab(s, o, w, d, opt) {
    opt = opt || {};
    return isoBox(s, o, w, d, opt.h == null ? 6 : opt.h, opt);
  }

  /** Square die. Label sits on the top face. */
  function isoChip(s, o, size, opt) {
    opt = opt || {};
    return isoBox(s, o, size, size, opt.h == null ? 12 : opt.h, opt);
  }

  /** Layered stack (HBM). Returns the group; top-face centre in g.__top. */
  function isoStack(s, o, w, d, layers, opt) {
    opt = opt || {};
    var lh = opt.layerH == null ? 6 : opt.layerH, g = mk(s, 'g'), i, sub;
    for (i = 0; i < layers; i++) {
      sub = isoBox(g, [o[0], o[1] - i * lh], w, d, lh, {
        fill: opt.fill || (opt.accentTop && i === layers - 1 ? 'accent-soft' : undefined)
      });
    }
    g.__top = P(o, w / 2, d / 2, layers * lh);
    if (opt.label) label(s, g.__top[0], g.__top[1] + 3.5, opt.label, { anchor: 'middle' });
    return g;
  }

  /** Vertical DIMM standing on a board. len runs along +b. */
  function isoDimm(s, o, len, opt) {
    opt = opt || {};
    return isoBox(s, o, opt.thick == null ? 6 : opt.thick, len, opt.h == null ? 20 : opt.h, opt);
  }

  /** Container box with an inset top plate and a top label. */
  function isoContainer(s, o, w, d, h, opt) {
    opt = opt || {};
    var t = meta(s).tokens, g = mk(s, 'g');
    isoBox(g, o, w, d, h, opt);
    var m = Math.min(w, d) * 0.16;
    poly(g, [P(o, m, m, h), P(o, w - m, m, h), P(o, w - m, d - m, h), P(o, m, d - m, h)],
      'none', opt.accent ? t.blue : t.line);
    g.__top = P(o, w / 2, d / 2, h);
    if (opt.label) label(s, g.__top[0], g.__top[1] + 3.5, opt.label, { anchor: 'middle', accent: opt.accent });
    return g;
  }

  /**
   * DRAM bank array on a plane: cols x rows small cuboids, back-to-front.
   * opt: {cw, cd, ch, gap, open: idx, on: [idx], warn: [idx], plate: bool}
   * Returns [{i, col, row, o, top:[x,y], g}] in index order.
   */
  function isoBankArray(s, o, cols, rows, opt) {
    opt = opt || {};
    var cw = opt.cw == null ? 30 : opt.cw, cd = opt.cd == null ? 34 : opt.cd,
      ch = opt.ch == null ? 9 : opt.ch, gap = opt.gap == null ? 5 : opt.gap;
    var g = mk(s, 'g'), on = opt.on || [], warn = opt.warn || [], list = [], c, r, i;
    for (r = 0; r < rows; r++) for (c = 0; c < cols; c++) {
      i = r * cols + c;
      list.push({ i: i, col: c, row: r, a: c * (cw + gap), b: r * (cd + gap) });
    }
    depthSort(list).forEach(function (cell) {
      var co = P(o, cell.a, cell.b, 0);
      var hit = cell.i === opt.open || on.indexOf(cell.i) >= 0;
      var bad = warn.indexOf(cell.i) >= 0;
      cell.o = co;
      cell.g = isoBox(g, co, cw, cd, ch, {
        fill: bad ? (opt.warnFill || 'warn-soft') : hit ? (opt.onFill || 'accent-soft') : opt.fill
      });
      cell.top = P(co, cw / 2, cd / 2, ch);
      cell.h = ch;
      cell.cw = cw; cell.cd = cd;
    });
    list.sort(function (x, y) { return x.i - y.i; });
    g.__cells = list;
    return list;
  }

  /** Android board / phone: slab with an accent screen plate. */
  function isoPhone(s, o, opt) {
    opt = opt || {};
    var w = opt.w == null ? 70 : opt.w, d = opt.d == null ? 110 : opt.d, t = meta(s).tokens;
    var g = mk(s, 'g');
    isoBox(g, o, w, d, opt.h == null ? 7 : opt.h, opt);
    var m = 8, h = opt.h == null ? 7 : opt.h;
    poly(g, [P(o, m, m, h), P(o, w - m, m, h), P(o, w - m, d - m, h), P(o, m, d - m, h)], t.blueSoft, t.line);
    g.__top = P(o, w / 2, d / 2, h);
    return g;
  }

  /* ------------------------------------------------------------ flat text */
  /**
   * label(svg, x, y, text | [lines], {anchor, accent, warn, size, weight, fill, lineHeight})
   */
  function label(s, x, y, text, o) {
    o = o || {};
    var m = meta(s), t = m.tokens;
    var size = o.size || m.font;
    var fill = o.fill || (o.accent ? t.blue : o.warn ? t.warn : t.slate);
    var lc = (Array.isArray(text) ? text : String(text).split('\n')).length;
    if (o.above && lc > 1) y -= (lc - 1) * (o.lineHeight || size * 1.35);
    var e = mk(s, 'text', {
      x: x, y: y, 'font-family': t.mono, 'font-size': size, fill: fill,
      'font-weight': o.weight || 400, 'text-anchor': o.anchor || 'start',
      'letter-spacing': o.tracking, opacity: o.opacity
    });
    var lines = Array.isArray(text) ? text : String(text).split('\n');
    if (lines.length === 1) { e.textContent = lines[0]; }
    else lines.forEach(function (ln, i) {
      mk(e, 'tspan', { x: x, dy: i === 0 ? 0 : (o.lineHeight || size * 1.35) }).textContent = ln;
    });
    return e;
  }

  /**
   * Leader line: text at (x,y) with a hairline to the target (tx,ty). Heroes only.
   * o.from = [x, y] overrides where the line leaves the label (use for vertical leaders).
   */
  function leader(s, x, y, tx, ty, text, o) {
    o = o || {};
    var m = meta(s), t = m.tokens, size = o.size || m.font;
    var anchor = o.anchor || (tx >= x ? 'end' : 'start');
    label(s, x, y, text, { anchor: anchor, accent: o.accent, size: size, weight: o.weight });
    var pad = 5, sx, sy;
    if (o.from) { sx = o.from[0]; sy = o.from[1]; }
    else if (anchor === 'middle') { sx = x; sy = ty > y ? y + 5 : y - size - 4; }
    else { sx = anchor === 'end' ? x + pad : x - pad; sy = y - size / 3; }
    mk(s, 'line', {
      x1: sx, y1: sy, x2: tx, y2: ty,
      stroke: o.accent ? t.blue : t.line, 'stroke-width': 1
    });
    mk(s, 'circle', { cx: tx, cy: ty, r: 1.8, fill: o.accent ? t.blue : t.line });
    return { x: x, y: y };
  }

  /* ------------------------------------------------------------ flat boxes */
  /**
   * box(svg, x, y, w, h, {label, sub, inner: [str], fill, rx, accent, warn, dashed})
   */
  function box(s, x, y, w, h, o) {
    o = o || {};
    var m = meta(s), t = m.tokens, g = mk(s, 'g');
    mk(g, 'rect', {
      x: x, y: y, width: w, height: h, rx: o.rx == null ? 3 : o.rx,
      fill: fillOf(t, o.fill, t.tint), stroke: strokeOf(t, o, t.line),
      'stroke-width': 1.2, 'stroke-dasharray': o.dashed ? '4 3' : null
    });
    var cx = x + w / 2, size = o.size || m.font, cy = y + h / 2;
    var head = [];
    if (o.label) head.push(o.label);
    if (o.sub) head.push(o.sub);
    var inner = o.inner || [];
    var top = inner.length ? y + 20 : cy + (head.length > 1 ? -2 : 3.5);
    if (o.label) label(s, cx, top, o.label, { anchor: 'middle', weight: 600, size: size, accent: o.accent, warn: o.warn });
    if (o.sub) label(s, cx, top + size * 1.45, o.sub, { anchor: 'middle', size: size * 0.95 });
    var iy = top + (o.sub ? size * 1.45 : 0) + 12;
    inner.forEach(function (txt) {
      mk(g, 'rect', {
        x: x + 10, y: iy, width: w - 20, height: 22, rx: 6,
        fill: t.paper, stroke: t.line, 'stroke-width': 1, 'stroke-dasharray': '4 3'
      });
      label(s, cx, iy + 14.5, txt, { anchor: 'middle', size: size * 0.95 });
      iy += 28;
    });
    g.__box = { x: x, y: y, w: w, h: h, cx: cx, cy: cy };
    return g.__box;
  }

  /** Single protocol/bit field. */
  function field(s, x, y, w, h, o) {
    o = o || {};
    var m = meta(s), t = m.tokens, size = o.size || m.font;
    mk(s, 'rect', {
      x: x, y: y, width: w, height: h, rx: 3,
      fill: o.accent ? t.blueSoft : o.warn ? t.warnSoft : fillOf(t, o.fill, t.tint),
      stroke: strokeOf(t, o, t.line), 'stroke-width': 1.2
    });
    var cx = x + w / 2, fits = tw(o.label || '', size) < w - 6;
    if (o.label) {
      if (fits) label(s, cx, y + h / 2 + (o.bits ? -2 : 3.5), o.label, { anchor: 'middle', weight: 600, size: size, accent: o.accent, warn: o.warn });
      else label(s, cx, y - 6, o.label, { anchor: 'middle', weight: 600, size: size, accent: o.accent, warn: o.warn });
    }
    if (o.bits != null) label(s, cx, y + h / 2 + (fits && o.label ? 12 : 3.5), o.bits + (o.unit || ' bit'), { anchor: 'middle', size: size * 0.92 });
    return { x: x, y: y, w: w, h: h, cx: cx };
  }

  /**
   * fieldRow(svg, x, y, totalW, [{label, bits, weight?, accent, warn}])
   * Widths follow `weight` if present, otherwise `bits`.
   */
  function fieldRow(s, x, y, totalW, fields, o) {
    o = o || {};
    var h = o.h == null ? 40 : o.h, gap = o.gap == null ? 2 : o.gap;
    var sum = fields.reduce(function (a, f) { return a + (f.weight || f.bits || 1); }, 0);
    var avail = totalW - gap * (fields.length - 1), cx = x, out = [];
    fields.forEach(function (f) {
      var w = avail * (f.weight || f.bits || 1) / sum;
      out.push(field(s, cx, y, w, h, {
        label: f.label, bits: f.bits, unit: f.unit, accent: f.accent, warn: f.warn, fill: f.fill, size: o.size
      }));
      cx += w + gap;
    });
    return out;
  }

  /**
   * cellGrid(svg, x, y, cols, rows, size, {on: [i], warn: [i], gap, rx})
   * i = row * cols + col. Returns {rects, cx(c,r), cy(c,r), w, h}.
   */
  function cellGrid(s, x, y, cols, rows, size, o) {
    o = o || {};
    var t = meta(s).tokens, gap = o.gap == null ? 2 : o.gap;
    var on = o.on || [], warn = o.warn || [], rects = [], c, r, i;
    var g = mk(s, 'g');
    for (r = 0; r < rows; r++) for (c = 0; c < cols; c++) {
      i = r * cols + c;
      rects.push(mk(g, 'rect', {
        x: x + c * (size + gap), y: y + r * (size + gap), width: size, height: size,
        rx: o.rx == null ? 1.5 : o.rx,
        fill: warn.indexOf(i) >= 0 ? t.warn : on.indexOf(i) >= 0 ? t.blue : fillOf(t, o.fill, t.paper),
        stroke: warn.indexOf(i) >= 0 ? t.warn : on.indexOf(i) >= 0 ? t.blue : t.line,
        'stroke-width': 1
      }));
    }
    return {
      g: g, rects: rects, w: cols * (size + gap) - gap, h: rows * (size + gap) - gap,
      cx: function (c) { return x + c * (size + gap) + size / 2; },
      cy: function (r) { return y + r * (size + gap) + size / 2; },
      x: x, y: y, size: size, gap: gap
    };
  }

  /**
   * timeline(svg, x, y, w, lanes, {span, laneH, gap, ticks, unit})
   * lanes: [{label, bars: [{from, to, accent, warn, dashed, label}]}]
   * Returns {X(t), lanes: [{y, cy}], bottom}
   */
  function timeline(s, x, y, w, lanes, o) {
    o = o || {};
    var m = meta(s), t = m.tokens, size = o.size || m.font;
    var span = o.span || 1, laneH = o.laneH == null ? 22 : o.laneH, gap = o.gap == null ? 10 : o.gap;
    var padL = o.labelW == null ? 130 : o.labelW;
    var x0 = x + padL, plot = w - padL;
    var X = function (v) { return x0 + (v / span) * plot; };
    var info = [];
    lanes.forEach(function (ln, i) {
      var ly = y + i * (laneH + gap);
      label(s, x0 - 10, ly + laneH / 2 + 3.5, ln.label, { anchor: 'end', size: size });
      mk(s, 'line', { x1: x0, y1: ly + laneH / 2, x2: x0 + plot, y2: ly + laneH / 2, stroke: t.line, 'stroke-width': 1, 'stroke-dasharray': '2 4' });
      (ln.bars || []).forEach(function (b) {
        mk(s, 'rect', {
          x: X(b.from), y: ly, width: Math.max(1, X(b.to) - X(b.from)), height: laneH, rx: 3,
          fill: b.accent ? t.blueSoft : b.warn ? t.warnSoft : t.tint,
          stroke: b.accent ? t.blue : b.warn ? t.warn : t.line, 'stroke-width': 1.2,
          'stroke-dasharray': b.dashed ? '4 3' : null
        });
        if (b.label) label(s, (X(b.from) + X(b.to)) / 2, ly + laneH / 2 + 3.5, b.label,
          { anchor: 'middle', size: size * 0.92, accent: b.accent, warn: b.warn });
      });
      info.push({ y: ly, cy: ly + laneH / 2, h: laneH });
    });
    var bottom = y + lanes.length * (laneH + gap) - gap;
    if (o.axis) {
      mk(s, 'line', { x1: x0, y1: bottom + 8, x2: x0 + plot, y2: bottom + 8, stroke: t.line, 'stroke-width': 1 });
      (o.ticks || []).forEach(function (tk) {
        mk(s, 'line', { x1: X(tk.at), y1: bottom + 5, x2: X(tk.at), y2: bottom + 11, stroke: t.line, 'stroke-width': 1 });
        label(s, X(tk.at), bottom + 22, tk.label, { anchor: 'middle', size: size * 0.92 });
      });
    }
    return { X: X, x0: x0, plot: plot, lanes: info, bottom: bottom };
  }

  /* -------------------------------------------------------- state machine */
  /** Rounded state node. Returns {x, y, w, h, cx, cy}. */
  function state(s, x, y, text, o) {
    o = o || {};
    var m = meta(s), t = m.tokens, size = o.size || m.font;
    var lines = Array.isArray(text) ? text : [text];
    var w = o.w || Math.max(90, Math.max.apply(null, lines.map(function (l) { return tw(l, size); })) + 30);
    var h = o.h || (lines.length > 1 ? 46 : 34);
    mk(s, 'rect', {
      x: x, y: y, width: w, height: h, rx: h / 2,
      fill: o.accent ? t.blueSoft : o.warn ? t.warnSoft : fillOf(t, o.fill, t.paper),
      stroke: strokeOf(t, o, t.line), 'stroke-width': 1.2
    });
    var first = y + h / 2 + 3.5 - (lines.length - 1) * size * 0.7;
    lines.forEach(function (l, i) {
      label(s, x + w / 2, first + i * size * 1.4, l, {
        anchor: 'middle', size: size, weight: i === 0 ? 600 : 400, accent: o.accent, warn: o.warn
      });
    });
    return { x: x, y: y, w: w, h: h, cx: x + w / 2, cy: y + h / 2 };
  }

  function edgePoint(n, tx, ty) {
    var dx = tx - n.cx, dy = ty - n.cy;
    if (!dx && !dy) return [n.cx, n.cy];
    var rx = n.w / 2, ry = n.h / 2;
    var sx = Math.abs(dx) / rx, sy = Math.abs(dy) / ry, k = 1 / Math.max(sx, sy);
    return [n.cx + dx * k, n.cy + dy * k];
  }

  /** Arrow between two state nodes. o.self = loop above the node. */
  function transition(s, a, b, text, o) {
    o = o || {};
    var m = meta(s), t = m.tokens, col = o.warn ? t.warn : o.accent ? t.blue : t.slate;
    if (o.self || a === b) {
      var r = 30, cx = a.cx + (o.dx || 0), top = a.y;
      var p = mk(s, 'path', {
        d: 'M' + (cx - 22) + ' ' + top + ' C ' + (cx - 34) + ' ' + (top - r * 1.6) + ', ' +
          (cx + 34) + ' ' + (top - r * 1.6) + ', ' + (cx + 22) + ' ' + top,
        fill: 'none', stroke: col, 'stroke-width': 1.4,
        'stroke-dasharray': o.dashed ? '4 3' : null, 'marker-end': 'url(#' + marker(s, col) + ')'
      });
      if (text) label(s, cx, top - r * 1.62 + (o.dy || 0), text, { anchor: 'middle', accent: o.accent, warn: o.warn, size: o.size, above: true });
      return p;
    }
    var pa = edgePoint(a, b.cx, b.cy), pb = edgePoint(b, a.cx, a.cy);
    var bend = o.curve || 0;
    var mx = (pa[0] + pb[0]) / 2, my = (pa[1] + pb[1]) / 2;
    var nx = -(pb[1] - pa[1]), ny = pb[0] - pa[0], len = Math.hypot(nx, ny) || 1;
    var qx = mx + nx / len * bend, qy = my + ny / len * bend;
    mk(s, 'path', {
      d: bend ? 'M' + pa[0] + ' ' + pa[1] + ' Q ' + qx + ' ' + qy + ' ' + pb[0] + ' ' + pb[1]
        : 'M' + pa[0] + ' ' + pa[1] + ' L ' + pb[0] + ' ' + pb[1],
      fill: 'none', stroke: col, 'stroke-width': 1.4,
      'stroke-dasharray': o.dashed ? '4 3' : null, 'marker-end': 'url(#' + marker(s, col) + ')'
    });
    if (text) {
      var lx = bend ? (mx + nx / len * bend * 0.62) : mx, ly = bend ? (my + ny / len * bend * 0.62) : my;
      label(s, lx, ly + (o.dy == null ? -6 : o.dy), text, {
        anchor: 'middle', accent: o.accent, warn: o.warn, size: o.size,
        above: (o.dy == null ? -6 : o.dy) < 0
      });
    }
  }

  /* ----------------------------------------------------------- connectors */
  function marker(node, color) {
    var s = rootSvg(node), m = meta(node);
    if (!m.markers[color]) {
      var defs = ensureDefs(s);
      var id = 'illus-' + m.id + '-a' + Object.keys(m.markers).length;
      var mk1 = mk(defs, 'marker', {
        id: id, viewBox: '0 0 8 8', refX: 6.6, refY: 4,
        markerWidth: 5, markerHeight: 5, orient: 'auto-start-reverse', markerUnits: 'strokeWidth'
      });
      mk(mk1, 'path', { d: 'M0.8 0.9 L7 4 L0.8 7.1 Z', fill: color });
      m.markers[color] = id;
    }
    return m.markers[color];
  }

  /** arrow(svg, x1, y1, x2, y2, {dashed, both, label, accent, warn, curve, width, plain}) */
  function arrow(s, x1, y1, x2, y2, o) {
    o = o || {};
    var t = meta(s).tokens;
    var col = o.color || (o.warn ? t.warn : o.accent ? t.blue : t.slate);
    var d;
    if (o.curve) {
      var mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      var nx = -(y2 - y1), ny = x2 - x1, len = Math.hypot(nx, ny) || 1;
      d = 'M' + x1 + ' ' + y1 + ' Q ' + (mx + nx / len * o.curve) + ' ' + (my + ny / len * o.curve) + ' ' + x2 + ' ' + y2;
    } else d = 'M' + x1 + ' ' + y1 + ' L ' + x2 + ' ' + y2;
    var p = mk(s, 'path', {
      d: d, fill: 'none', stroke: col, 'stroke-width': o.width || 1.4,
      'stroke-dasharray': o.dashed ? '4 3' : null, opacity: o.opacity,
      'marker-end': o.plain ? null : 'url(#' + marker(s, col) + ')',
      'marker-start': o.both ? 'url(#' + marker(s, col) + ')' : null
    });
    if (o.label) {
      label(s, (x1 + x2) / 2 + (o.labelDx || 0), (y1 + y2) / 2 + (o.labelDy == null ? -6 : o.labelDy),
        o.label, {
          anchor: o.labelAnchor || 'middle', accent: o.accent, warn: o.warn, size: o.size,
          above: (o.labelDy == null ? -6 : o.labelDy) < 0
        });
    }
    return p;
  }

  /** Horizontal bus with node stubs. nodes: [{x, label, warn, below}] */
  function bus(s, x1, y, x2, o) {
    o = o || {};
    var m = meta(s), t = m.tokens, size = o.size || m.font;
    mk(s, 'line', { x1: x1, y1: y, x2: x2, y2: y, stroke: t.line, 'stroke-width': 2 });
    (o.nodes || []).forEach(function (n) {
      var dir = n.below ? 1 : -1, len = n.stub == null ? 16 : n.stub;
      mk(s, 'line', { x1: n.x, y1: y, x2: n.x, y2: y + dir * len, stroke: n.warn ? t.warn : t.line, 'stroke-width': 1.2 });
      if (n.label) label(s, n.x, y + dir * (len + (dir > 0 ? 12 : 6)), n.label, { anchor: 'middle', size: size, warn: n.warn });
    });
    return { y: y, x1: x1, x2: x2 };
  }

  /** Span bracket with a centred caption. o.up = ticks point up. */
  function bracket(s, x1, x2, y, text, o) {
    o = o || {};
    var m = meta(s), t = m.tokens, k = o.up ? -1 : 1, tick = o.tick == null ? 6 : o.tick;
    mk(s, 'path', {
      d: 'M' + x1 + ' ' + (y + k * tick) + ' L' + x1 + ' ' + y + ' L' + x2 + ' ' + y + ' L' + x2 + ' ' + (y + k * tick),
      fill: 'none', stroke: o.accent ? t.blue : t.line, 'stroke-width': 1.2
    });
    if (text) label(s, (x1 + x2) / 2, y + (o.up ? -10 : 15), text, {
      anchor: 'middle', accent: o.accent, warn: o.warn, size: o.size || m.font * 0.95
    });
  }

  /* ---------------------------------------------------------- entry point */
  var Illus = {
    NS: NS, scenes: {}, KIND: KIND,
    tokens: tokens, mk: mk, svg: svg, grid: grid,
    UX: UX, UY: UY, P: P, depth: depth, depthSort: depthSort,
    isoBox: isoBox, isoSlab: isoSlab, isoChip: isoChip, isoStack: isoStack,
    isoDimm: isoDimm, isoContainer: isoContainer, isoBankArray: isoBankArray, isoPhone: isoPhone,
    box: box, field: field, fieldRow: fieldRow, cellGrid: cellGrid, timeline: timeline,
    state: state, transition: transition,
    arrow: arrow, bus: bus, leader: leader, label: label, bracket: bracket,
    marker: marker, meta: meta,

    /** Render one [data-illus] element. Idempotent. Returns the <svg> or null. */
    render: function (node) {
      if (!node || !node.getAttribute) return null;
      var key = node.getAttribute('data-illus');
      if (!key) return null;
      var dot = key.indexOf('.');
      var setId = dot < 0 ? key : key.slice(0, dot);
      var name = dot < 0 ? 'thumb' : key.slice(dot + 1);
      var set = Illus.scenes[setId], fn = set && set[name];
      if (typeof fn !== 'function') {
        if (global.console) console.warn('[Illus] unknown scene:', key);
        return null;
      }
      var kind = fn.kind || (name === 'thumb' ? 'thumb' : name === 'hero' ? 'hero' : 'diagram');
      var dim = KIND[kind] || KIND.diagram;
      var W = fn.width || dim[0], H = fn.height || dim[1];
      var aria = node.getAttribute('aria-label') || fn.aria || '';
      var i, kids = node.childNodes;
      for (i = kids.length - 1; i >= 0; i--) {
        if (kids[i].nodeType === 1 && kids[i].nodeName.toLowerCase() === 'svg') node.removeChild(kids[i]);
      }
      var font = fn.font || ((fn.width || fn.height) ? 10.5 : (KIND_FONT[kind] || 10.5));
      var s = svg(null, {
        viewBox: '0 0 ' + W + ' ' + H, aria: aria, font: font
      });
      s.setAttribute('data-illus-kind', kind);
      node.insertBefore(s, node.firstChild);
      var ctx = {
        W: W, H: H, variant: name, kind: kind, name: name, set: setId,
        font: font, tokens: s.__illus.tokens, el: node
      };
      try { fn(s, ctx); }
      catch (err) { if (global.console) console.error('[Illus] scene failed:', key, err); }

      /* group everything the scene drew (grid and defs stay outside) so the
         drawn extent can be measured */
      var drawn = [], c, cn;
      for (c = s.firstChild; c; c = c.nextSibling) {
        if (c.nodeType !== 1) continue;
        cn = c.nodeName.toLowerCase();
        if (cn === 'defs' || c.hasAttribute('data-illus-grid')) continue;
        drawn.push(c);
      }
      if (drawn.length) {
        var wrap = mk(s, 'g', { 'data-illus-content': '' });
        for (i = 0; i < drawn.length; i++) wrap.appendChild(drawn[i]);
      }
      /* thumbs and heroes are auto-fitted; diagrams and scenes that declare their
         own viewBox (home.hero) keep the declared box */
      if ((kind === 'thumb' || kind === 'hero') && !fn.width && !fn.height) fitToContent(s);
      return s;
    },

    /** Render every [data-illus] under root. */
    renderAll: function (root) {
      root = root || document;
      var list = root.querySelectorAll ? root.querySelectorAll('[data-illus]') : [];
      for (var i = 0; i < list.length; i++) Illus.render(list[i]);
      return list.length;
    }
  };

  global.Illus = Illus;

  /* auto render + re-render when the resolved token values can change */
  function boot() { Illus.renderAll(document); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  if (global.matchMedia) {
    var mq = global.matchMedia('(prefers-color-scheme: dark)');
    var onScheme = function () { Illus.renderAll(document); };
    if (mq.addEventListener) mq.addEventListener('change', onScheme);
    else if (mq.addListener) mq.addListener(onScheme);
  }
  if (global.MutationObserver) {
    new MutationObserver(function () { Illus.renderAll(document); })
      .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }
})(window);
