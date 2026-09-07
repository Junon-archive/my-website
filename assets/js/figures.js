/* ==========================================================================
   figures.js — data charts for the Results section
                (05-detail-templates.md §6, 01-design-system.md §4.10)

   window.figures.render(container, spec)
     container  a .chartbox element (usually [data-results])
     spec       works-data.results, one of:

     { kind:"line", x:[…], xLabel, xLog, model:[…], measured:{index:value},
       yLabel:"%", yTicks:[0,25,50,75,100], title, legend, legendPos, aria }
     { kind:"bar",  items:[{label,value}], unit, title, highlight:[i], aria }
     { kind:"hist", data:[…], tail:7, unit:"µs", title, aria }
     { kind:"bits", segments:[{label,bits}], caption, title, aria }
     { kind:"metric", value:"8.4×", caption, title }

   Rules enforced here: no colour literals (every colour is read from a CSS
   custom property), measured points are filled circles, model/estimate lines
   are dashed, all text uses --mono in --slate, the <svg> carries role="img"
   and an aria-label. Nothing is drawn when spec is missing or empty.
   ========================================================================== */
(function (window, document) {
  "use strict";

  var NS = "http://www.w3.org/2000/svg";
  var W = 460, H = 230;

  function css(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }
  var C = {
    blue:     function () { return css("--blue"); },
    blueSoft: function () { return css("--blue-soft"); },
    line:     function () { return css("--line"); },
    slate:    function () { return css("--slate"); },
    paper:    function () { return css("--paper"); },
    tint:     function () { return css("--tint"); },
    warn:     function () { return css("--warn"); },
    navy:     function () { return css("--navy"); },
    mono:     function () { return css("--mono") || "monospace"; }
  };

  function el(parent, name, attrs) {
    var e = document.createElementNS(NS, name);
    for (var k in attrs) if (Object.prototype.hasOwnProperty.call(attrs, k)) {
      e.setAttribute(k, attrs[k]);
    }
    parent.appendChild(e);
    return e;
  }

  function text(parent, x, y, str, opts) {
    opts = opts || {};
    var t = el(parent, "text", {
      x: x, y: y,
      "font-size": opts.size || 10,
      "font-family": C.mono(),
      fill: opts.fill || C.slate(),
      "text-anchor": opts.anchor || "start"
    });
    if (opts.weight) t.setAttribute("font-weight", opts.weight);
    t.textContent = str;
    return t;
  }

  function polyline(parent, pts, stroke, width, dash) {
    var p = el(parent, "polyline", {
      points: pts.map(function (q) { return q[0] + "," + q[1]; }).join(" "),
      fill: "none",
      stroke: stroke,
      "stroke-width": width || 2,
      "stroke-linejoin": "round"
    });
    if (dash) p.setAttribute("stroke-dasharray", dash);
    return p;
  }

  function svgRoot(container, viewBox, aria) {
    var s = el(container, "svg", {
      viewBox: viewBox || ("0 0 " + W + " " + H),
      role: "img",
      "aria-label": aria || ""
    });
    s.setAttribute("preserveAspectRatio", "xMidYMid meet");
    return s;
  }

  function heading(container, title) {
    if (!title) return;
    var h = document.createElement("h4");
    h.textContent = title;
    container.appendChild(h);
  }

  /* Ticks always cover max, so a bar can never overshoot the plot area. */
  function niceTicks(max, count) {
    count = count || 5;
    if (!(max > 0)) return [0, 1];
    var raw = max / count;
    var mag = Math.pow(10, Math.floor(Math.log(raw) / Math.LN10));
    var norm = raw / mag;
    var step = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10) * mag;
    var n = Math.ceil(max / step - 1e-9);
    var ticks = [];
    for (var i = 0; i <= n; i++) ticks.push(Math.round(i * step * 1000) / 1000);
    return ticks;
  }

  function legendXY(pos, box) {
    switch (pos) {
      case "top-left":     return [box.L + 8, box.T + 14, "start"];
      case "top-right":    return [W - box.R - 8, box.T + 14, "end"];
      case "bottom-right": return [W - box.R - 8, H - box.B - 10, "end"];
      default:             return [box.L + 8, H - box.B - 10, "start"];
    }
  }

  /* ---------- line ------------------------------------------------------- */

  function renderLine(container, spec) {
    var xs = spec.x || [];
    if (!xs.length) return;
    var box = { L: 46, R: 16, T: 14, B: 40 };
    var pw = W - box.L - box.R, ph = H - box.T - box.B;

    var ticks = spec.yTicks && spec.yTicks.length ? spec.yTicks.slice() : null;
    var measured = spec.measured || {};
    if (!ticks) {
      var max = 0;
      (spec.model || []).forEach(function (v) { if (v > max) max = v; });
      Object.keys(measured).forEach(function (k) { if (measured[k] > max) max = measured[k]; });
      ticks = niceTicks(max);
    }
    var top = ticks[ticks.length - 1] || 1;

    var aria = spec.aria || spec.title || "line chart";
    var s = svgRoot(container, null, aria);
    var X = function (i) { return box.L + (xs.length > 1 ? i * (pw / (xs.length - 1)) : pw / 2); };
    var Y = function (v) { return box.T + (1 - v / top) * ph; };

    ticks.forEach(function (v) {
      el(s, "line", { x1: box.L, x2: W - box.R, y1: Y(v), y2: Y(v), stroke: C.line(), "stroke-width": 1 });
      text(s, box.L - 8, Y(v) + 3.5, v + (spec.yLabel || ""), { anchor: "end" });
    });

    var every = xs.length > 8 ? 2 : 1;
    xs.forEach(function (v, i) {
      if (i % every === 0 || i === xs.length - 1) {
        text(s, X(i), H - box.B + 16, String(v), { anchor: "middle" });
      }
    });
    if (spec.xLabel) text(s, box.L + pw / 2, H - 6, spec.xLabel, { anchor: "middle", size: 10.5 });

    if (spec.model && spec.model.length) {
      polyline(s, spec.model.map(function (v, i) { return [X(i), Y(v)]; }), C.slate(), 1.2, "4 3");
    }

    var labelled = 0;
    for (var i = 0; i < xs.length; i++) {
      var strong = Object.prototype.hasOwnProperty.call(measured, String(i));
      var v = strong ? measured[String(i)]
                     : (spec.model && spec.model[i] !== undefined ? spec.model[i] : null);
      if (v === null || v === undefined) continue;
      el(s, "circle", {
        cx: X(i), cy: Y(v), r: strong ? 4 : 2.5,
        fill: strong ? C.blue() : C.paper(),
        stroke: C.blue(), "stroke-width": 1.5
      });
      if (strong && labelled < 6) {
        labelled++;
        var above = Y(v) > box.T + 24;
        var lx = X(i) + 8, anchor = "start";
        if (lx > W - box.R - 34) { lx = X(i) - 8; anchor = "end"; }
        text(s, lx, Y(v) + (above ? -8 : 14), v + (spec.yLabel || ""),
             { size: 9.5, anchor: anchor });
      }
    }

    if (spec.legend) {
      var lp = legendXY(spec.legendPos, box);
      text(s, lp[0], lp[1], spec.legend, { anchor: lp[2], size: 9.5 });
    }
  }

  /* ---------- bar -------------------------------------------------------- */

  function renderBar(container, spec) {
    var items = spec.items || [];
    if (!items.length) return;
    var box = { L: 46, R: 16, T: 24, B: 42 };
    var pw = W - box.L - box.R, ph = H - box.T - box.B;
    var max = 0;
    items.forEach(function (it) { if (it.value > max) max = it.value; });
    var ticks = niceTicks(max);
    var top = ticks[ticks.length - 1] || 1;

    var aria = spec.aria || spec.title ||
      items.map(function (i) { return i.label + " " + i.value + (spec.unit || ""); }).join(", ");
    var s = svgRoot(container, null, aria);
    var Y = function (v) { return box.T + (1 - v / top) * ph; };

    ticks.forEach(function (v) {
      el(s, "line", { x1: box.L, x2: W - box.R, y1: Y(v), y2: Y(v), stroke: C.line(), "stroke-width": 1 });
      text(s, box.L - 8, Y(v) + 3.5, String(v), { anchor: "end" });
    });

    var slot = pw / items.length;
    var bw = Math.min(52, slot * 0.56);
    var highlight = spec.highlight || [];
    items.forEach(function (it, i) {
      var x = box.L + slot * i + (slot - bw) / 2;
      var y = Y(it.value);
      var on = highlight.indexOf(i) !== -1;
      el(s, "rect", {
        x: x, y: y, width: bw, height: Math.max(1, box.T + ph - y), rx: 3,
        fill: on ? C.blue() : C.blueSoft(), stroke: C.blue(), "stroke-width": 1
      });
      text(s, x + bw / 2, y - 6, String(it.value), { anchor: "middle", size: 10, fill: C.navy(), weight: 600 });
      text(s, x + bw / 2, H - box.B + 16, it.label, { anchor: "middle", size: 9.5 });
    });

    if (spec.unit) text(s, 4, 10, spec.unit, { size: 9.5 });
  }

  /* ---------- hist ------------------------------------------------------- */

  function renderHist(container, spec) {
    var data = spec.data || [];
    if (!data.length) return;
    var box = { L: 46, R: 16, T: 16, B: 42 };
    var pw = W - box.L - box.R, ph = H - box.T - box.B;
    var max = 0;
    data.forEach(function (v) { if (v > max) max = v; });
    var ticks = niceTicks(max);
    var top = ticks[ticks.length - 1] || 1;
    var tail = typeof spec.tail === "number" ? spec.tail : data.length;

    var aria = spec.aria || spec.title ||
      ("log2 latency histogram over " + data.length + " buckets" +
       (spec.unit ? " in " + spec.unit : ""));
    var s = svgRoot(container, null, aria);
    var Y = function (v) { return box.T + (1 - v / top) * ph; };

    ticks.forEach(function (v) {
      el(s, "line", { x1: box.L, x2: W - box.R, y1: Y(v), y2: Y(v), stroke: C.line(), "stroke-width": 1 });
      text(s, box.L - 8, Y(v) + 3.5, String(v), { anchor: "end" });
    });

    var slot = pw / data.length;
    var bw = Math.max(3, slot - 3);
    data.forEach(function (v, i) {
      var x = box.L + slot * i + (slot - bw) / 2;
      var y = Y(v);
      el(s, "rect", {
        x: x, y: y, width: bw, height: Math.max(1, box.T + ph - y), rx: 2,
        fill: i >= tail ? C.blue() : C.blueSoft(), stroke: C.blue(), "stroke-width": 0.8
      });
      if (i % 2 === 0 || i === data.length - 1) {
        text(s, x + bw / 2, H - box.B + 16, String(Math.pow(2, i)), { anchor: "middle", size: 9 });
      }
    });

    text(s, box.L + pw / 2, H - 6,
         "latency bucket (" + (spec.unit || "µs") + ", log2)", { anchor: "middle", size: 10.5 });
  }

  /* ---------- bits ------------------------------------------------------- */

  function renderBits(container, spec) {
    var segs = spec.segments || [];
    if (!segs.length) return;
    var total = 0;
    segs.forEach(function (sg) { total += sg.bits || 0; });
    if (!total) return;

    var HB = 96, L = 8, R = 8, barY = 18, barH = 30;
    var pw = W - L - R;
    var aria = spec.aria ||
      ("Bit map: " + segs.map(function (sg) { return sg.label + " " + sg.bits + " bits"; }).join(", ") +
       ", " + total + " bits total");
    var s = svgRoot(container, "0 0 " + W + " " + HB, aria);

    var x = L;
    segs.forEach(function (sg, i) {
      var w = pw * (sg.bits / total);
      el(s, "rect", {
        x: x, y: barY, width: w, height: barH, rx: 3,
        fill: i % 2 ? C.tint() : C.blueSoft(), stroke: C.line(), "stroke-width": 1
      });
      if (w > 26) text(s, x + w / 2, barY + 19, sg.label, { anchor: "middle", size: 9.5, fill: C.navy() });
      text(s, x + w / 2, barY - 6, String(sg.bits), { anchor: "middle", size: 9 });
      x += w;
    });

    /* byte boundaries */
    for (var b = 8; b < total; b += 8) {
      var bx = L + pw * (b / total);
      el(s, "line", {
        x1: bx, x2: bx, y1: barY + barH, y2: barY + barH + 6,
        stroke: C.line(), "stroke-width": 1
      });
      text(s, bx, barY + barH + 18, String(b), { anchor: "middle", size: 8.5 });
    }
    text(s, L, HB - 6, spec.caption || ("bit 0 → " + (total - 1)), { size: 9.5 });
  }

  /* ---------- metric ----------------------------------------------------- */

  function renderMetric(container, spec) {
    if (!spec.value) return;
    var v = document.createElement("div");
    v.className = "metric-value";
    v.textContent = spec.value;
    container.appendChild(v);
    if (spec.caption) {
      var c = document.createElement("div");
      c.className = "metric-caption";
      c.textContent = spec.caption;
      container.appendChild(c);
    }
  }

  /* ---------- entry point ------------------------------------------------ */

  var KINDS = {
    line: renderLine, bar: renderBar, hist: renderHist,
    bits: renderBits, metric: renderMetric
  };

  function render(container, spec) {
    if (!container || !spec || !spec.kind) return false;
    var fn = KINDS[spec.kind];
    if (!fn) return false;
    container.innerHTML = "";
    heading(container, spec.title);
    try {
      fn(container, spec);
    } catch (e) {
      container.innerHTML = "";
      return false;
    }
    return true;
  }

  window.figures = { render: render, kinds: Object.keys(KINDS) };
})(window, document);
