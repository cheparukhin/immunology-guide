// demo-chart — reference implementation of a CHART on a LIGHT stage.
// "Who arrives when": schematic time course of neutrophils and macrophages at
// a wound over the first week (illustrative shapes, not measured data).
//
// Copy this file when building a chart, timeline or schematic. It shows:
//   • a light stage that follows the page theme: colors come from ctx.colors
//     (stroke.* = readable line colors for this stage+theme) and CSS classes
//     (.gridline, .axis, .t-*), and the chart re-draws on theme change
//   • re-layout for phones (different viewBox, margins and label placement)
//   • a draw-in animation on first view (instant under reduced motion)
//   • an accessible scrubber: pointer, touch AND keyboard (← →) move a cursor,
//     values go to a tooltip and to screen readers via ctx.announce
//   • a segmented control and a legend from ctx.ui
//
// For real data charts: put the numbers (with their sources) in the draft's
// `data:` field, copy them here as a constant, and cite the source in the caption.

// Schematic curves: smooth single peaks, normalized to 1 at their maximum.
const peak = (tp, k, scale = 1) => (t) => (t <= 0 ? 0 : scale * (t / tp) ** k * Math.exp(k * (1 - t / tp)));
const SERIES = [
  { key: 'neutrophil', label: 'Neutrophils', note: 'kill microbes', f: peak(1, 2.2) },
  { key: 'macrophage', label: 'Macrophages', note: 'clean up, start repair', f: peak(3.2, 2.6, 0.85) },
];
const DAYS = 7;

const LAYOUTS = {
  wide: { w: 960, h: 440, m: { l: 56, r: 28, t: 72, b: 64 } },
  compact: { w: 400, h: 420, m: { l: 20, r: 20, t: 76, b: 64 } },
};

export default function mount(fig, ctx) {
  const { gsap } = ctx;
  ctx.setAspect(960 / 440, 400 / 420);
  const svg = ctx.createSVG({ viewBox: '0 0 960 440', interactive: true, label: 'Chart: cells at a wound over the first week. Use left and right arrow keys to read values.' });
  svg.setAttribute('tabindex', '0');

  let L = LAYOUTS.wide;
  let show = 'both';
  let cursorDay = null;
  let drawn = false;       // has the draw-in animation played?
  const el = {};

  // ------------------------------------------------------------------ scales
  const x = (d) => L.m.l + (d / DAYS) * (L.w - L.m.l - L.m.r);
  const y = (v) => L.h - L.m.b - v * (L.h - L.m.t - L.m.b);
  const dayAt = (px) => Math.max(0, Math.min(DAYS, ((px - L.m.l) / (L.w - L.m.l - L.m.r)) * DAYS));
  const pathFor = (f, close = false) => {
    let d = '';
    for (let t = 0; t <= DAYS + 1e-9; t += 0.05) d += `${d ? 'L' : 'M'}${x(t).toFixed(1)},${y(f(t)).toFixed(1)}`;
    return close ? `${d}L${x(DAYS).toFixed(1)},${y(0)}L${x(0)},${y(0)}Z` : d;
  };

  // ------------------------------------------------------------------ draw
  function draw() {
    const c = ctx.colors;   // re-read every draw: depends on the page theme
    for (const n of [...svg.children]) if (n !== svg.defs) n.remove();
    svg.defs.replaceChildren();
    svg.setAttribute('viewBox', `0 0 ${L.w} ${L.h}`);
    const S = (tag, a, p = svg) => ctx.svg(tag, a, p);

    // Axis title (horizontal, top-left: never rotate text) and gridlines.
    S('text', { class: 't-caps', x: L.m.l, y: L.m.t - 30, text: 'Cells at the site (relative)' });
    for (const v of [0.25, 0.5, 0.75, 1]) S('line', { class: 'gridline', x1: L.m.l, x2: L.w - L.m.r, y1: y(v), y2: y(v) });
    S('line', { class: 'axis', x1: L.m.l, x2: L.w - L.m.r, y1: y(0), y2: y(0) });
    for (let dd = 0; dd <= DAYS; dd++) {
      if (L === LAYOUTS.compact && dd % 2) continue;    // fewer ticks on phones
      S('line', { class: 'axis', x1: x(dd), x2: x(dd), y1: y(0), y2: y(0) + 5 });
      S('text', { class: 't-small t-mid t-num', x: x(dd), y: y(0) + 22, text: String(dd) });
    }
    S('text', { class: 't-caps t-mid', x: (L.m.l + L.w - L.m.r) / 2, y: L.h - 10, text: 'Days after injury' });

    // Series: soft area + line + end label.
    el.series = SERIES.map((s) => {
      const g = S('g', { 'data-series': s.key });
      const fill = ctx.linearGradient(svg, [[0, c[s.key], 0.32], [1, c[s.key], 0.02]], { x1: '0%', y1: '0%', x2: '0%', y2: '100%' });
      const area = S('path', { d: pathFor(s.f, true), fill }, g);
      const line = S('path', { d: pathFor(s.f), fill: 'none', stroke: c.stroke[s.key], strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round' }, g);
      // Direct labels (no legend needed). Neutrophils: just right of the sharp peak,
      // where the curve has already dropped away. Macrophages: above the broad peak
      // on wide layouts, inside its own area on phones (where space above is taken).
      let tPeak = 0;
      for (let t = 0; t <= DAYS; t += 0.05) if (s.f(t) > s.f(tPeak)) tPeak = t;
      const compact = L === LAYOUTS.compact;
      let lx; let ly; let anchor;
      if (s.key === 'neutrophil') { lx = x(tPeak + 0.4); ly = y(s.f(tPeak)) + 4; anchor = 'start'; }
      else if (!compact) { lx = x(tPeak); ly = y(s.f(tPeak)) - 34; anchor = 'middle'; }
      else { lx = x(4.7); ly = y(0.42); anchor = 'middle'; }
      const label = S('g', null, g);
      S('text', { class: 't-label t-halo', x: lx, y: ly, 'text-anchor': anchor, style: `fill:${c.stroke[s.key]}`, text: s.label }, label);
      S('text', { class: 't-small t-halo', x: lx, y: ly + 18, 'text-anchor': anchor, text: s.note }, label);
      return { ...s, g, area, line, label };
    });

    // Scrubber: vertical rule + a dot per series. Hidden until used.
    el.cursor = S('g', { opacity: 0, 'pointer-events': 'none' });
    el.rule = S('line', { class: 'leader', y1: L.m.t - 10, y2: y(0) }, el.cursor);
    el.dots = SERIES.map((s) => S('circle', { r: 5, fill: c.surface, stroke: c.stroke[s.key], strokeWidth: 2.5 }, el.cursor));

    // A transparent hit area makes the whole plot scrub-able (mouse, pen, touch).
    el.hit = S('rect', { x: L.m.l, y: L.m.t - 10, width: L.w - L.m.l - L.m.r, height: y(0) - L.m.t + 10, fill: 'transparent', 'data-hit': '' });

    applyVisibility(true);
    if (cursorDay != null) moveCursor(cursorDay, { quiet: true });
    if (drawn || ctx.reducedMotion) return;
    // Hide lines until the draw-in runs (first time the figure is 35% visible).
    el.series.forEach((s) => { gsap.set(s.line, { drawSVG: '0%' }); gsap.set([s.area, s.label], { opacity: 0 }); });
  }

  function drawIn() {
    if (drawn) return;
    drawn = true;
    if (ctx.reducedMotion) return;
    el.series.forEach((s, i) => {
      gsap.fromTo(s.line, { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.8, ease: 'so.inOut', delay: 0.15 + i * 0.35 });
      gsap.to(s.area, { opacity: 1, duration: 1.2, delay: 0.7 + i * 0.35 });
      gsap.to(s.label, { opacity: 1, duration: 0.6, delay: 1.4 + i * 0.35 });
    });
  }

  function applyVisibility(instant = false) {
    for (const s of el.series) {
      const on = show === 'both' || show === s.key;
      gsap.to(s.g, { opacity: on ? 1 : 0.12, duration: instant || ctx.reducedMotion ? 0 : 0.4 });
    }
  }

  // ------------------------------------------------------------------ scrubbing
  function moveCursor(day, { quiet = false, anchor } = {}) {
    cursorDay = Math.max(0, Math.min(DAYS, day));
    const cx = x(cursorDay);
    el.rule.setAttribute('x1', cx);
    el.rule.setAttribute('x2', cx);
    SERIES.forEach((s, i) => { el.dots[i].setAttribute('cx', cx); el.dots[i].setAttribute('cy', y(s.f(cursorDay))); });
    el.cursor.setAttribute('opacity', 1);
    const vals = SERIES.map((s) => `${s.label} ${Math.round(s.f(cursorDay) * 100)}%`);
    const text = `Day ${cursorDay.toFixed(1)}: ${vals.join(', ')}`;
    // Tooltip anchored to the top of the rule (viewport coordinates).
    const r = el.rule.getBoundingClientRect();
    ctx.tooltip.show(`<strong>Day ${cursorDay.toFixed(1)}</strong><br>${vals.join('<br>')}`, anchor || { x: r.left, y: r.top });
    if (!quiet) ctx.announce(text);
  }
  function hideCursor() {
    el.cursor.setAttribute('opacity', 0);
    ctx.tooltip.hide();
  }
  const toViewBoxX = (clientX) => {
    const r = svg.getBoundingClientRect();
    const vb = svg.viewBox.baseVal;
    const scale = Math.min(r.width / vb.width, r.height / vb.height);
    const offsetX = (r.width - vb.width * scale) / 2;   // xMidYMid meet letterboxing
    return (clientX - r.left - offsetX) / scale;
  };
  ctx.on(svg, 'pointermove', (e) => { if (e.target === el.hit || e.pointerType !== 'mouse') moveCursor(dayAt(toViewBoxX(e.clientX)), { quiet: true }); });
  ctx.on(svg, 'pointerdown', (e) => { if (e.target === el.hit) { moveCursor(dayAt(toViewBoxX(e.clientX)), { quiet: true }); } });
  ctx.on(svg, 'pointerleave', (e) => { if (e.pointerType === 'mouse') hideCursor(); });
  ctx.on(svg, 'keydown', (e) => {
    const step = e.shiftKey ? 1 : 0.5;
    if (e.key === 'ArrowRight') moveCursor((cursorDay ?? -step) + step);
    else if (e.key === 'ArrowLeft') moveCursor((cursorDay ?? DAYS + step) - step);
    else if (e.key === 'Home') moveCursor(0);
    else if (e.key === 'End') moveCursor(DAYS);
    else if (e.key === 'Escape') hideCursor();
    else return;
    e.preventDefault();
  });
  ctx.on(svg, 'blur', hideCursor);
  ctx.on(window, 'scroll', () => { if (cursorDay != null && el.cursor.getAttribute('opacity') === '1') hideCursor(); }, { passive: true });

  // ------------------------------------------------------------------ controls
  ctx.ui.segmented({
    label: 'Show',
    value: 'both',
    options: [
      { value: 'both', label: 'Both' },
      { value: 'neutrophil', label: 'Neutrophils', color: ctx.colors.neutrophil },
      { value: 'macrophage', label: 'Macrophages', color: ctx.colors.macrophage },
    ],
    onChange: (v) => { show = v; applyVisibility(); },
  });

  // ------------------------------------------------------------------ lifecycle
  ctx.onResize(({ compact }) => {
    const next = compact ? LAYOUTS.compact : LAYOUTS.wide;
    if (next === L && el.series) return;
    L = next;
    draw();
  });
  ctx.onThemeChange(() => draw());           // light stage colors follow the page theme
  ctx.onceVisible(drawIn, 0.35);

  return { destroy() { ctx.tooltip.hide(); } };
}
