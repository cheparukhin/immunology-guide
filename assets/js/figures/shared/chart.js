// shared/chart.js — the chart kit (platform task P3). API: docs/shared/chart.md
//
// Lightweight SVG primitives for the site's data charts: scales, axes, lines,
// bars, markers, whiskers, bands, thresholds, labels, focusable row bands, an
// ARIA cursor, and an HTML frame (legend + detail card + source line).
//
// Conventions
//   • Geometry is in SVG user units. Map data with scale() and pass pixels.
//   • Colors are CSS custom properties (the `C` tokens), resolved inside a
//     chartRoot() group, so light-stage charts follow the page theme with no
//     redraw and the same code draws dark-native on a dark stage.
//   • Anything that moves takes { tl, at, duration, ease, delay }: with a GSAP
//     timeline the tween is appended (stepper-safe), otherwise it runs
//     standalone (a set under reduced motion).
import { svg as S, h, prefersReducedMotion, icon } from '../../ui/dom.js';
import { gsap } from '../../../vendor/gsap/index.js';

// ------------------------------------------------------------------ tokens
const ENTITIES = ['healthy', 'cancer', 'cd8', 'cd4', 'treg', 'bcell', 'antibody', 'nk', 'macrophage', 'm2', 'dc',
  'neutrophil', 'mdsc', 'fibroblast', 'bacteria', 'virus', 'mhc', 'self-peptide', 'neo-peptide', 'inhibit', 'activate', 'drug'];

let warnedSeries = false;
export const C = Object.freeze({
  s1: 'var(--ck-1)', s2: 'var(--ck-2)', s3: 'var(--ck-3)', s4: 'var(--ck-4)', s5: 'var(--ck-5)',
  /** Categorical series color i (0-based). Never cycles: a 6th series gets the muted color. */
  series(i) {
    if (i < 5) return `var(--ck-${i + 1})`;
    if (!warnedSeries) { warnedSeries = true; console.warn('[chart] more than 5 series: fold the tail into "Other" or use small multiples'); }
    return 'var(--ck-muted)';
  },
  ink: 'var(--ck-ink)', ink2: 'var(--ck-ink-2)', ink3: 'var(--ck-ink-3)',
  grid: 'var(--ck-grid)', axis: 'var(--ck-axis)', muted: 'var(--ck-muted)',
  surface: 'var(--ck-surface)', accent: 'var(--ck-accent)', hover: 'var(--ck-hover)',
  /** Entity color for lines and text (deep variant on a light stage in the light theme). */
  stroke: (name) => `var(--ck-stroke-${name})`,
  /** Entity fill color. */
  fill: (name) => `var(--c-${name})`,
});

// ------------------------------------------------------------------ styles (injected once)
const STYLE_ID = 'so-chart-kit';
const strokeVars = (deep) => ENTITIES.map((n) => `--ck-stroke-${n}: var(--c-${n}${deep ? '-deep' : ''});`).join(' ');
const CSS = `
.ck {
  --ck-1: var(--chart-1); --ck-2: var(--chart-2); --ck-3: var(--chart-3); --ck-4: var(--chart-4); --ck-5: var(--chart-5);
  --ck-ink: var(--fg); --ck-ink-2: var(--fg-2); --ck-ink-3: var(--fg-3);
  --ck-grid: var(--grid); --ck-axis: var(--chart-axis); --ck-muted: var(--chart-muted);
  --ck-surface: var(--halo); --ck-accent: var(--accent);
  --ck-hover: color-mix(in srgb, var(--fg) 5%, transparent);
  --ck-select: color-mix(in srgb, var(--fg) 7%, transparent);
  ${strokeVars(true)}
}
:root[data-theme="dark"] .ck--light { ${strokeVars(false)} }
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) .ck--light { ${strokeVars(false)} } }
.ck.ck--dark {
  --ck-1: #8EA2FF; --ck-2: #4CC9C0; --ck-3: #E8A65A; --ck-4: #C78BE6; --ck-5: #FF7C80; --ck-muted: #6C7385;
  --ck-axis: rgb(233 236 246 / 0.42); --ck-accent: #A3B2FF;
  --ck-hover: rgb(233 236 246 / 0.06); --ck-select: rgb(233 236 246 / 0.09);
  ${strokeVars(false)}
}
.fig svg .ck-grid { stroke: var(--ck-grid); stroke-width: 1; vector-effect: non-scaling-stroke; fill: none; }
.fig svg .ck-grid.is-strong { stroke: var(--ck-axis); }
.fig svg .ck-axis { stroke: var(--ck-axis); stroke-width: 1; vector-effect: non-scaling-stroke; fill: none; }
.fig svg .ck-tick-label { fill: var(--ck-ink-2); }
.fig svg .ck-ref { fill: none; stroke-width: 1; vector-effect: non-scaling-stroke; }
.fig svg .ck-ref.is-strong { stroke-width: 1.5; }
.fig svg .ck-row { outline: none; }
.fig svg .ck-row.is-selectable { cursor: pointer; }
.fig svg .ck-row__band { fill: transparent; transition: fill var(--dur-1, 120ms) ease; }
.fig svg .ck-row.is-selectable:hover .ck-row__band, .fig svg .ck-row.is-hover .ck-row__band { fill: var(--ck-hover); }
.fig svg .ck-row.is-selected .ck-row__band { fill: var(--ck-select); }
.fig svg .ck-row:focus-visible .ck-row__band { stroke: var(--stage-focus); stroke-width: 2; vector-effect: non-scaling-stroke; }
.fig svg .ck-row__label { font-size: max(var(--ck-row-fs, 14px), calc(13px * var(--u, 1))); font-weight: 500; fill: var(--ck-ink); }
.fig svg .ck-row__label.is-strong { font-weight: 650; }
.fig svg .ck-row__label.is-muted { fill: var(--ck-ink-2); }
.fig svg .ck-cursor { outline: none; }
.fig svg .ck-cursor:focus-visible .ck-cursor__rule { stroke: var(--stage-focus); stroke-width: 2; }
.fig svg .ck-cursor__rule { stroke: var(--ck-ink-2); stroke-width: 1; vector-effect: non-scaling-stroke; }
.fig svg .ck-label .t-label, .fig svg .ck-label .t-small { paint-order: stroke fill; stroke-linejoin: round; }
.ck-frame { position: relative; z-index: 1; display: flex; flex-direction: column; gap: 14px;
  padding: clamp(14px, 2.4cqi, 26px) clamp(12px, 2.6cqi, 30px) clamp(14px, 2cqi, 22px); container-type: inline-size; }
.ck-frame__toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 18px; min-height: 2.5rem; }
.ck-frame__toolbar:empty { display: none; }
.ck-frame__top:empty { display: none; }
.ck-frame__main { min-width: 0; }
.ck-frame__main > svg { display: block; width: 100%; height: auto; overflow: visible; }
.ck-frame__below:empty { display: none; }
.ck-source { margin: 0; max-width: 78ch; font: 400 12px/1.5 var(--font-ui); color: var(--fg-3); text-wrap: pretty; }
.ck-legend { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 6px 18px;
  font: 500 13px/1.35 var(--font-ui); color: var(--fg-2); }
.ck-legend__item { display: flex; align-items: flex-start; gap: 8px; }
.ck-legend__key { flex: none; width: 16px; height: 16px; margin-top: 1px; overflow: visible; }
.ck-card { position: relative; padding: 14px 16px 14px; border-radius: var(--r-md, 10px);
  background: color-mix(in srgb, var(--fg) 3.5%, var(--halo)); box-shadow: inset 0 0 0 1px var(--line);
  font-family: var(--font-ui); color: var(--fg); }
.ck-card[hidden] { display: none; }
.ck-card__title { margin: 0 2.2rem 6px 0; font-size: 15px; font-weight: 650; line-height: 1.3; color: var(--fg); }
.ck-card__close { position: absolute; top: 6px; right: 6px; }
.ck-info .ck-info__line { font-family: var(--font-ui); font-size: 14px; line-height: 1.45; color: var(--ink); font-variant-numeric: tabular-nums; }
.ck-info .ck-info__line + .ck-info__line { margin-top: 0.2em; }
.ck-info .ck-info__line .k, .ck-card .ck-info__line .k { color: var(--ink-2); }
.ck-info .ck-info__note { font-size: 0.95em; color: var(--ink-2); text-wrap: pretty; }
.ck-info .ck-info__src { font-family: var(--font-ui); font-size: 12px; line-height: 1.45; color: var(--ink-3); }
.ck-card .ck-info__line { margin: 0 0 4px; font-size: 14px; line-height: 1.45; color: var(--fg); font-variant-numeric: tabular-nums; }
.ck-card .ck-info__note { margin: 8px 0 0; font-size: 13px; line-height: 1.5; color: var(--fg-2); }
.ck-card .ck-info__src { margin: 8px 0 0; font-size: 12px; line-height: 1.45; color: var(--fg-3); }
`;
function ensureStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  document.head.append(h('style', { id: STYLE_ID, text: CSS }));
}

// ------------------------------------------------------------------ animation switch
/**
 * Tween (or set) `target` to `vars`. anim: { tl, at, duration, ease, delay, stagger }.
 * With a timeline the tween is appended at `at` (stepper-safe). Without one it runs
 * standalone when duration > 0 (a set under reduced motion), else it is a set.
 */
export function tweenTo(target, vars, { tl, at = 0, duration, ease = 'so.inOut', delay = 0, stagger } = {}) {
  if (tl) return tl.to(target, { ...vars, duration: duration ?? 0.6, ease, stagger }, at + delay);
  if (duration > 0 && !prefersReducedMotion()) return gsap.to(target, { ...vars, duration, ease, delay, stagger, overwrite: 'auto' });
  gsap.killTweensOf(target, Object.keys(vars).join(','));
  return gsap.set(target, vars);
}
/** Same as tweenTo with explicit start values. */
export function tweenFromTo(target, from, vars, { tl, at = 0, duration, ease = 'so.inOut', delay = 0, stagger } = {}) {
  if (tl) return tl.fromTo(target, from, { ...vars, duration: duration ?? 0.6, ease, stagger }, at + delay);
  if (duration > 0 && !prefersReducedMotion()) return gsap.fromTo(target, from, { ...vars, duration, ease, delay, stagger, overwrite: 'auto' });
  gsap.killTweensOf(target, Object.keys(vars).join(','));
  return gsap.set(target, vars);
}

// ------------------------------------------------------------------ formatting
const trimZeros = (s) => (s.includes('.') ? s.replace(/\.?0+$/, '') : s);
// Half-up rounding that survives binary fractions (0.85 → 0.9, not toFixed's 0.8).
const fixed = (v, d) => (Math.round((Math.abs(v) + 1e-9) * 10 ** d) / 10 ** d * Math.sign(v || 1)).toFixed(d);
const withCommas = (s) => {
  const [i, d] = s.split('.');
  const neg = i.startsWith('-');
  const body = (neg ? i.slice(1) : i).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${neg ? '−' : ''}${body}${d != null ? `.${d}` : ''}`;
};
export const fmt = Object.freeze({
  /** 175732 → '175,732'; digits = fixed decimals. */
  num(v, { digits = 0 } = {}) { return withCommas(fixed(Number(v), digits)); },
  /** ≥ 10 → integer; ≥ 1 → one decimal; < 1 → two significant figures. */
  smart(v) {
    const a = Math.abs(v);
    if (a >= 10) return withCommas(fixed(v, 0));
    if (a >= 1) return withCommas(fixed(v, 1));
    if (a === 0) return '0';
    return withCommas(trimZeros(Number(v.toPrecision(2)).toString()));
  },
  /** n significant figures, at most `max` decimals, trailing zeros kept to `keep` decimals: sig(14.88) → '14.9' */
  sig(v, n = 3, { max = 2 } = {}) {
    if (!v) return '0';
    const d = Math.min(max, Math.max(0, n - 1 - Math.floor(Math.log10(Math.abs(v)))));
    return withCommas(fixed(v, d));
  },
  /** 61.46 → '61×', 2.1 → '2.1×', 0.85 → '0.9×' */
  times(v) { return `${v >= 10 ? fixed(v, 0) : fixed(v, 1)}×`; },
  /** Range with enough decimals that the ends differ: 50.95, 73.49 → '51–73×'; 2.06, 2.14 → '2.06–2.14×' */
  range(a, b, { unit = '×' } = {}) {
    const d0 = Math.max(Math.abs(a), Math.abs(b)) >= 10 ? 0 : Math.min(Math.abs(a), Math.abs(b)) < 1 ? 2 : 1;
    let da = d0; let db = d0;
    let A = fixed(a, da); let B = fixed(b, db);
    for (let k = 0; A === B && k < 3; k++) { da++; db++; A = fixed(a, da); B = fixed(b, db); }
    return `${A}–${B}${unit}`;
  },
  minus(v) { return String(v).replace(/^-/, '−'); },
});

// ------------------------------------------------------------------ scales
/** scale({ type: 'linear' | 'log', domain: [a, b], range: [r0, r1], clamp }) → s(v) */
export function scale({ type = 'linear', domain = [0, 1], range = [0, 1], clamp = false } = {}) {
  const [d0, d1] = domain;
  const [r0, r1] = range;
  const log = type === 'log';
  if (log && (d0 <= 0 || d1 <= 0)) throw new Error('[chart] log scale needs a positive domain');
  const f = log ? Math.log10 : (v) => v;
  const fi = log ? (v) => 10 ** v : (v) => v;
  const a = f(d0); const b = f(d1);
  const s = (v) => {
    let t = (f(v) - a) / (b - a || 1);
    if (clamp) t = Math.min(1, Math.max(0, t));
    return r0 + t * (r1 - r0);
  };
  s.invert = (px) => {
    let t = (px - r0) / (r1 - r0 || 1);
    if (clamp) t = Math.min(1, Math.max(0, t));
    return fi(a + t * (b - a));
  };
  s.type = type;
  s.domain = [d0, d1];
  s.range = [r0, r1];
  s.ticks = (arg = 5) => {
    const lo = Math.min(d0, d1); const hi = Math.max(d0, d1);
    if (log) {
      const mults = Array.isArray(arg) ? arg : [1];
      const out = [];
      for (let e = Math.floor(Math.log10(lo)) - 1; e <= Math.ceil(Math.log10(hi)) + 1; e++) {
        for (const m of mults) {
          const v = Number((m * 10 ** e).toPrecision(12));
          if (v >= lo * (1 - 1e-9) && v <= hi * (1 + 1e-9)) out.push(v);
        }
      }
      return out.sort((x, y) => x - y);
    }
    const n = typeof arg === 'number' ? arg : 5;
    const raw = (hi - lo) / Math.max(1, n);
    const mag = 10 ** Math.floor(Math.log10(raw));
    const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((st) => st >= raw) || raw;
    const out = [];
    for (let v = Math.ceil(lo / step) * step; v <= hi + step * 1e-9; v += step) out.push(Number(v.toPrecision(12)));
    return out;
  };
  s.copy = (o = {}) => scale({ type, domain: s.domain, range: s.range, clamp, ...o });
  return s;
}

// ------------------------------------------------------------------ root
/** <g class="ck ck--light|ck--dark">: every chart lives in one. theme: 'auto' | 'light' | 'stage-dark' */
export function chartRoot(parent, { theme = 'auto', className = '' } = {}) {
  ensureStyles();
  let t = theme;
  if (t === 'auto') {
    const stage = parent.closest?.('[data-stage]');
    t = stage?.dataset.stage === 'dark' ? 'stage-dark' : 'light';
  }
  return S('g', { class: `ck ${t === 'stage-dark' ? 'ck--dark' : 'ck--light'} ${className}`.trim() }, parent);
}

// ------------------------------------------------------------------ axis
export function axis(g, {
  scale: sc, orient = 'bottom', at = 0, ticks, format = String, labels = true, grid = null, emphasize = [],
  line: showLine = true, tickSize = 5, title, note, titleAlign = 'middle', labelClass = 't-small t-num',
  labelOffset, className = '',
} = {}) {
  ensureStyles();
  const horiz = orient === 'bottom' || orient === 'top';
  const sign = orient === 'bottom' || orient === 'right' ? 1 : -1;
  const el = S('g', { class: `ck-axis-group ck-axis--${orient} ${className}`.trim() }, g);
  const values = Array.isArray(ticks) ? ticks : sc.ticks(ticks ?? 5);
  const showLabel = (v, i) => (typeof labels === 'function' ? labels(v, i) : Array.isArray(labels) ? labels.some((x) => Math.abs(x - v) < 1e-9) : !!labels);
  const isEmph = (v) => emphasize.some((x) => Math.abs(x - v) < 1e-9);
  const gridG = grid ? S('g', { class: 'ck-grid-lines' }, el) : null;
  const [p0, p1] = sc.range;
  if (showLine) {
    S('line', horiz ? { class: 'ck-axis', x1: Math.min(p0, p1), x2: Math.max(p0, p1), y1: at, y2: at }
      : { class: 'ck-axis', x1: at, x2: at, y1: Math.min(p0, p1), y2: Math.max(p0, p1) }, el);
  }
  const off = labelOffset ?? (tickSize + (horiz ? (sign > 0 ? 15 : 7) : 6));
  const out = values.map((value, i) => {
    const pos = sc(value);
    const rec = { value, pos, grid: null, tick: null, label: null };
    if (gridG) {
      const [a, b] = grid;
      rec.grid = S('line', horiz ? { class: `ck-grid${isEmph(value) ? ' is-strong' : ''}`, x1: pos, x2: pos, y1: a, y2: b }
        : { class: `ck-grid${isEmph(value) ? ' is-strong' : ''}`, x1: a, x2: b, y1: pos, y2: pos }, gridG);
    }
    if (tickSize) {
      rec.tick = S('line', horiz ? { class: 'ck-axis', x1: pos, x2: pos, y1: at, y2: at + sign * tickSize }
        : { class: 'ck-axis', x1: at, x2: at + sign * tickSize, y1: pos, y2: pos }, el);
    }
    if (showLabel(value, i)) {
      rec.label = S('text', horiz
        ? { class: `${labelClass} ck-tick-label t-mid`, x: pos, y: at + sign * off }
        : { class: `${labelClass} ck-tick-label ${sign < 0 ? 't-end' : ''}`, x: at + sign * off, y: pos, dy: '0.35em' }, el);
      rec.label.textContent = format(value);
    }
    return rec;
  });
  let titleEl = null; let noteEl = null;
  if (title) {
    const lo = Math.min(p0, p1); const hi = Math.max(p0, p1);
    if (horiz) {
      const tx = titleAlign === 'start' ? lo : titleAlign === 'end' ? hi : (lo + hi) / 2;
      const anchor = titleAlign === 'start' ? '' : titleAlign === 'end' ? 't-end' : 't-mid';
      const lines = [].concat(title);
      const ty = sign > 0 ? at + off + 24 : at - off - 20 - (lines.length - 1) * 16;
      titleEl = S('text', { class: `t-caps ${anchor}`, x: tx, y: ty }, el);
      lines.forEach((ln, k) => S('tspan', { x: tx, dy: k ? '1.35em' : 0, text: ln }, titleEl));
      const ny = ty + (lines.length - 1) * 16;
      if (note) {
        noteEl = S('text', { class: `t-small t-muted ${anchor}`, x: tx, y: ny + (sign > 0 ? 19 : -17) }, el);
        [].concat(note).forEach((ln, k) => S('tspan', { x: tx, dy: k ? '1.3em' : 0, text: ln }, noteEl));
      }
    } else {
      // Never rotate: the title sits above the axis, horizontally.
      titleEl = S('text', { class: `t-caps ${sign < 0 ? '' : 't-end'}`, x: sign < 0 ? at - off : at + off, y: lo - 16, text: title }, el);
      if (note) noteEl = S('text', { class: `t-small t-muted ${sign < 0 ? '' : 't-end'}`, x: sign < 0 ? at - off : at + off, y: lo - 34, text: note }, el);
    }
  }
  return { el, ticks: out, title: titleEl, note: noteEl };
}

// ------------------------------------------------------------------ paths
const P = (pt) => (Array.isArray(pt) ? pt : [pt.x, pt.y]);
const n1 = (v) => Math.round(v * 10) / 10;
/** Path string for points [[x, y], …] with curve 'linear' | 'monotone' | 'step'. */
export function pathD(points, curve = 'linear') {
  const pts = points.map(P);
  if (!pts.length) return '';
  if (curve === 'step') {
    let d = `M${n1(pts[0][0])},${n1(pts[0][1])}`;
    for (let i = 1; i < pts.length; i++) {
      const xm = (pts[i - 1][0] + pts[i][0]) / 2;
      d += `H${n1(xm)}V${n1(pts[i][1])}H${n1(pts[i][0])}`;
    }
    return d;
  }
  if (curve !== 'monotone' || pts.length < 3) return pts.map((p, i) => `${i ? 'L' : 'M'}${n1(p[0])},${n1(p[1])}`).join('');
  // Fritsch–Carlson monotone cubic (no overshoot between data points).
  const n = pts.length;
  const dx = []; const m = [];
  for (let i = 0; i < n - 1; i++) { dx[i] = pts[i + 1][0] - pts[i][0]; m[i] = (pts[i + 1][1] - pts[i][1]) / (dx[i] || 1e-9); }
  const t = new Array(n);
  t[0] = m[0]; t[n - 1] = m[n - 2];
  for (let i = 1; i < n - 1; i++) t[i] = m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2;
  for (let i = 0; i < n - 1; i++) {
    if (m[i] === 0) { t[i] = 0; t[i + 1] = 0; continue; }
    const a = t[i] / m[i]; const b = t[i + 1] / m[i]; const s2 = a * a + b * b;
    if (s2 > 9) { const tau = 3 / Math.sqrt(s2); t[i] = tau * a * m[i]; t[i + 1] = tau * b * m[i]; }
  }
  let d = `M${n1(pts[0][0])},${n1(pts[0][1])}`;
  for (let i = 0; i < n - 1; i++) {
    const [x0, y0] = pts[i]; const [x1, y1] = pts[i + 1]; const h3 = dx[i] / 3;
    d += `C${n1(x0 + h3)},${n1(y0 + t[i] * h3)} ${n1(x1 - h3)},${n1(y1 - t[i + 1] * h3)} ${n1(x1)},${n1(y1)}`;
  }
  return d;
}

// ------------------------------------------------------------------ line
export function line(g, pts, { curve = 'linear', color = C.s1, width = 2, dash, opacity, area, drawIn = false, className = '' } = {}) {
  ensureStyles();
  const el = S('g', { class: `ck-line ${className}`.trim() }, g);
  let areaEl = null;
  const areaD = (list) => {
    const p = list.map(P);
    if (!p.length) return '';
    return `${pathD(p, curve)}L${n1(p[p.length - 1][0])},${n1(area.base)}L${n1(p[0][0])},${n1(area.base)}Z`;
  };
  if (area) areaEl = S('path', { d: areaD(pts), style: `fill:${color};fill-opacity:${area.opacity ?? 0.1};stroke:none` }, el);
  const d = pathD(pts, curve);
  const path = S('path', {
    d, fill: 'none', strokeWidth: width, strokeLinecap: 'round', strokeLinejoin: 'round',
    strokeDasharray: dash || null, style: `stroke:${color}${opacity != null ? `;stroke-opacity:${opacity}` : ''}`,
  }, el);
  // Dashed lines can't use DrawSVG (it owns stroke-dasharray): they reveal with a left-to-right clip wipe.
  let wipe = null;
  let wipeW = 0;
  if (dash) {
    const p = pts.map(P);
    const xs = p.map((q) => q[0]); const ys = p.map((q) => q[1]);
    const x0 = Math.min(...xs) - width * 2; wipeW = Math.max(...xs) - x0 + width * 2;
    const root = rootOf(g);
    const geo = { x: n1(x0), y: n1(Math.min(...ys) - 20), width: n1(wipeW), height: n1(Math.max(...ys) - Math.min(...ys) + 40) };
    const id = defId(root, 'wipe', `${geo.x},${geo.y},${geo.width},${geo.height}|${pathD(pts, curve)}`);
    const existing = ownDef(root, id);
    if (existing) {                                   // same line redrawn in the same svg: reuse its clip
      wipe = existing.firstElementChild;
      for (const [k, v] of Object.entries(geo)) wipe.setAttribute(k, v);
    } else {
      wipe = S('rect', geo, S('clipPath', { id }, defsOf(root)));
    }
    path.setAttribute('clip-path', `url(#${id})`);
  }
  if (drawIn) {
    if (wipe) gsap.set(wipe, { attr: { width: 0 } }); else gsap.set(path, { drawSVG: '0%' });
    if (areaEl) gsap.set(areaEl, { opacity: 0 });
  }
  return {
    el, path, area: areaEl, d,
    set(next, anim = {}) {
      const nd = pathD(next, curve);
      tweenTo(path, { attr: { d: nd } }, anim);
      if (areaEl) tweenTo(areaEl, { attr: { d: areaD(next) } }, anim);
      this.d = nd;
    },
    drawIn(anim = { duration: 1.4 }) {
      if (wipe) tweenFromTo(wipe, { attr: { width: 0 } }, { attr: { width: wipeW } }, { ease: 'so.inOut', ...anim });
      else tweenFromTo(path, { drawSVG: '0%' }, { drawSVG: '100%' }, { ease: 'so.inOut', ...anim });
      if (areaEl) tweenFromTo(areaEl, { opacity: 0 }, { opacity: 1 }, { ...anim, at: (anim.at || 0) + (anim.duration || 1.4) * 0.4, duration: (anim.duration || 1.4) * 0.6 });
    },
  };
}

// ------------------------------------------------------------------ bars
function barPath(orient, at, from, to, thick, radius) {
  const t2 = thick / 2;
  const len = Math.abs(to - from);
  const r = Math.max(0, Math.min(radius, t2, len));
  const s = to >= from ? 1 : -1;
  if (orient === 'h') {
    const y0 = at - t2; const y1 = at + t2; const e = to;
    return `M${n1(from)},${n1(y0)}H${n1(e - s * r)}A${n1(r)},${n1(r)} 0 0 ${s > 0 ? 1 : 0} ${n1(e)},${n1(y0 + r)}V${n1(y1 - r)}A${n1(r)},${n1(r)} 0 0 ${s > 0 ? 1 : 0} ${n1(e - s * r)},${n1(y1)}H${n1(from)}Z`;
  }
  const x0 = at - t2; const x1 = at + t2; const e = to;   // vertical: from/to are y (to < from grows up)
  const u = to <= from ? -1 : 1;
  return `M${n1(x0)},${n1(from)}V${n1(e - u * r)}A${n1(r)},${n1(r)} 0 0 ${u < 0 ? 1 : 0} ${n1(x0 + r)},${n1(e)}H${n1(x1 - r)}A${n1(r)},${n1(r)} 0 0 ${u < 0 ? 1 : 0} ${n1(x1)},${n1(e - u * r)}V${n1(from)}Z`;
}
export function bars(g, items, { orient = 'h', thickness = 16, radius = 4, base = 0, color = C.s1, whiskers = false, className = '' } = {}) {
  ensureStyles();
  const thick = Math.min(24, thickness);
  const el = S('g', { class: `ck-bars ${className}`.trim() }, g);
  const recs = items.map((it) => {
    const from = it.from ?? base;
    const bg = S('g', { class: 'ck-bar', 'data-id': it.id ?? null }, el);
    const bar = S('path', { d: barPath(orient, it.at, from, it.to, thick, radius), style: `fill:${it.color || color}` }, bg);
    let wh = null;
    if (whiskers && it.low != null && it.high != null) {
      wh = orient === 'h' ? whisker(bg, { x0: it.low, x1: it.high, y: it.at, cap: Math.min(10, thick * 0.6) })
        : whisker(bg, { y0: it.low, y1: it.high, x: it.at, cap: Math.min(10, thick * 0.6) });
    }
    return { id: it.id, el: bg, bar, whisker: wh, item: { ...it, from } };
  });
  return {
    el, items: recs,
    grow(anim = { duration: 0.8 }) {
      recs.forEach((r, i) => {
        const a = { ...anim, at: (anim.at || 0) + (anim.stagger || 0) * i, stagger: undefined };
        tweenFromTo(r.bar, { attr: { d: barPath(orient, r.item.at, r.item.from, r.item.from, thick, radius) } },
          { attr: { d: barPath(orient, r.item.at, r.item.from, r.item.to, thick, radius) } }, { ease: 'so.out', ...a });
        if (r.whisker) tweenFromTo(r.whisker, { opacity: 0 }, { opacity: 1 }, { ...a, at: a.at + (a.duration || 0.8) * 0.7, duration: 0.3 });
      });
    },
  };
}

// ------------------------------------------------------------------ markers
/** Path d for a marker shape centered on 0,0, with roughly equal visual area across shapes. */
export function markerPath(shape = 'circle', r = 5) {
  const f = (v) => n1(v);
  switch (shape) {
    case 'square': { const s = r * 0.89; return `M${f(-s)},${f(-s)}H${f(s)}V${f(s)}H${f(-s)}Z`; }
    case 'diamond': { const s = r * 1.26; return `M0,${f(-s)}L${f(s)},0L0,${f(s)}L${f(-s)},0Z`; }
    case 'triangle': { const a = r * 2.69; const ht = a * 0.866; return `M0,${f(-ht * 2 / 3)}L${f(a / 2)},${f(ht / 3)}L${f(-a / 2)},${f(ht / 3)}Z`; }
    default: return `M${f(-r)},0A${f(r)},${f(r)} 0 1 0 ${f(r)},0A${f(r)},${f(r)} 0 1 0 ${f(-r)},0Z`;
  }
}
export function marker(g, { shape = 'circle', x = 0, y = 0, r = 5, color = C.ink2, fill = true, width = 1.5, dash, ring = true, className = '' } = {}) {
  ensureStyles();
  const hollow = shape === 'ring' || !fill;
  const geo = shape === 'ring' ? 'circle' : shape;
  const d = markerPath(geo, r);
  const el = S('g', { class: `ck-marker ${className}`.trim(), 'data-shape': shape }, g);
  if (ring) S('path', { d, class: 'ck-marker__ring', style: `fill:${C.surface};stroke:${C.surface};stroke-width:${hollow ? width + 4 : 4};stroke-linejoin:round` }, el);
  el.shape = S('path', {
    d, class: 'ck-marker__shape', strokeLinejoin: 'round', strokeDasharray: dash || null,
    style: hollow ? `fill:none;stroke:${color};stroke-width:${width}` : `fill:${color};stroke:none`,
  }, el);
  gsap.set(el, { x, y });
  return el;
}

/** Horizontal { x0, x1, y } or vertical { y0, y1, x } range with end caps. */
export function whisker(g, { x0, x1, y, y0, y1, x, cap = 6, color = C.ink2, width = 1.5, className = '' } = {}) {
  ensureStyles();
  const el = S('g', { class: `ck-whisker ${className}`.trim(), style: `stroke:${color}`, strokeWidth: width, strokeLinecap: 'round', fill: 'none' }, g);
  if (x0 != null) {
    S('line', { x1: x0, x2: x1, y1: y, y2: y }, el);
    if (cap) { S('line', { x1: x0, x2: x0, y1: y - cap / 2, y2: y + cap / 2 }, el); S('line', { x1, x2: x1, y1: y - cap / 2, y2: y + cap / 2 }, el); }
  } else {
    S('line', { x1: x, x2: x, y1: y0, y2: y1 }, el);
    if (cap) { S('line', { x1: x - cap / 2, x2: x + cap / 2, y1: y0, y2: y0 }, el); S('line', { x1: x - cap / 2, x2: x + cap / 2, y1, y2: y1 }, el); }
  }
  return el;
}

// ------------------------------------------------------------------ deterministic <defs> ids
// Ids never come from a page-wide counter (that varies with figure load order and
// breaks stepper-check). They are `ck-<figure id>-<svg index>-<kind>-<hash of spec>`:
// the same figure, svg and spec always give the same id, and different figures or
// svgs can't collide. A def with the same id already in this svg is reused.
const fnv = (str) => {
  let x = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) { x ^= str.charCodeAt(i); x = Math.imul(x, 0x01000193); }
  return (x >>> 0).toString(36);
};
let detached = 0;
function rootKey(root) {
  if (root.dataset?.ckKey) return root.dataset.ckKey;
  const fig = root.isConnected ? root.closest('[data-figure]') : null;
  let key;
  if (fig) {
    const tops = [...fig.querySelectorAll('svg')].filter((x) => !x.ownerSVGElement);
    const figSvgs = tops.filter((x) => x.classList.contains('fig__svg'));
    const list = figSvgs.includes(root) ? figSvgs : tops;
    key = `${fig.dataset.figure.replace(/[^\w-]/g, '-')}-${Math.max(0, list.indexOf(root))}`;
  } else {
    key = `svg${++detached}`;           // detached svg (rare): unique, not page-order independent
  }
  if (root.dataset) root.dataset.ckKey = key;
  return key;
}
const rootOf = (node) => node.ownerSVGElement || node;
function defsOf(root) {
  let defs = root.querySelector(':scope > defs');
  if (!defs) defs = S('defs', null, root);
  return defs;
}
/** The def with `id` inside `root` itself (works for svgs not attached to the document yet). */
function ownDef(root, id) {
  return root.querySelector(`[id="${String(id).replace(/["\\]/g, '\\$&')}"]`);
}
/** Deterministic id for a def of `kind` described by `spec` inside the svg that owns `node`. */
export function defId(node, kind, spec = '') {
  const root = rootOf(node);
  const base = `ck-${rootKey(root)}-${kind}-${fnv(String(spec))}`;
  let id = base;
  // Same id elsewhere on the page (only possible for detached svgs): add a suffix.
  for (let k = 2; ; k++) {
    const found = document.getElementById(id);
    if (!found || root.contains(found)) return id;
    id = `${base}-${k}`;
  }
}

// ------------------------------------------------------------------ hatch pattern
/** url(#id) of a 45° hatch in `color`, created once per <svg> (deterministic id). */
export function hatchFill(node, color = C.ink2, { spacing = 4, width = 1.2 } = {}) {
  const root = rootOf(node);
  spacing = Math.round(spacing * 10) / 10; width = Math.round(width * 10) / 10;   // tiny size jitter → same pattern
  const id = defId(root, 'hatch', `${color}|${spacing}|${width}`);
  if (!ownDef(root, id)) {
    const p = S('pattern', { id, patternUnits: 'userSpaceOnUse', width: spacing, height: spacing, patternTransform: 'rotate(45)' }, defsOf(root));
    S('line', { x1: 0, y1: 0, x2: 0, y2: spacing, style: `stroke:${color}`, strokeWidth: width }, p);
  }
  return `url(#${id})`;
}

// ------------------------------------------------------------------ band, threshold, break
export function band(g, { x0, x1, y0, y1, label, hatch = false, color = C.ink, opacity = 0.05, labelPos = 'top-start', className = '' } = {}) {
  ensureStyles();
  const el = S('g', { class: `ck-band ${className}`.trim() }, g);
  const x = Math.min(x0, x1); const y = Math.min(y0, y1);
  const w = Math.abs(x1 - x0); const hgt = Math.abs(y1 - y0);
  const rect = S('rect', { x, y, width: w, height: hgt, style: `fill:${color};fill-opacity:${opacity}` }, el);
  if (hatch) S('rect', { x, y, width: w, height: hgt, style: `fill:${hatchFill(g, color)};opacity:0.35` }, el);
  let lab = null;
  if (label) {
    const [v, hz] = labelPos.split('-');
    const tx = hz === 'end' ? x + w - 8 : hz === 'middle' ? x + w / 2 : x + 8;
    lab = S('text', { class: `t-caps ${hz === 'end' ? 't-end' : hz === 'middle' ? 't-mid' : ''}`, x: tx, y: v === 'bottom' ? y + hgt - 8 : y + 18, text: label }, el);
  }
  return { el, rect, label: lab };
}

export function threshold(g, { x, y, x0, x1, y0, y1, label, labelPos, dash = true, strong = false, color = C.ink2, className = '' } = {}) {
  ensureStyles();
  const el = S('g', { class: `ck-threshold ${className}`.trim() }, g);
  const vertical = x != null && y == null;
  const ln = S('line', vertical ? { x1: x, x2: x, y1: y0, y2: y1 } : { x1: x0, x2: x1, y1: y, y2: y }, el);
  ln.setAttribute('class', `ck-ref${strong ? ' is-strong' : ''}`);
  ln.setAttribute('style', `stroke:${color}`);
  if (dash && !strong) ln.setAttribute('stroke-dasharray', typeof dash === 'string' ? dash : '4 4');
  let lab = null;
  if (label) {
    if (vertical) {
      const pos = labelPos || 'top';
      lab = S('text', { class: 't-small t-mid', x, y: pos === 'bottom' ? Math.max(y0, y1) + 16 : Math.min(y0, y1) - 8, text: label }, el);
    } else {
      const pos = labelPos || 'end';
      lab = S('text', { class: `t-small ${pos === 'end' ? 't-end' : ''}`, x: pos === 'end' ? Math.max(x0, x1) : Math.min(x0, x1), y: y - 7, text: label }, el);
    }
  }
  return { el, line: ln, label: lab };
}

export function axisBreak(g, { x = 0, y = 0, orient = 'h', size = 8 } = {}) {
  ensureStyles();
  const el = S('g', { class: 'ck-break', transform: `translate(${x} ${y})${orient === 'v' ? ' rotate(90)' : ''}` }, g);
  const s = size;
  S('rect', { x: -s * 0.35, y: -s, width: s * 0.7, height: s * 2, style: `fill:${C.surface}` }, el);
  S('path', { d: `M${-s * 0.55},${s * 0.8}L${-s * 0.05},${-s * 0.8}M${s * 0.05},${s * 0.8}L${s * 0.55},${-s * 0.8}`, class: 'ck-axis', strokeLinecap: 'round' }, el);
  return el;
}

// ------------------------------------------------------------------ labels
export function directLabel(g, { x, y, text, sub, anchor = 'start', dx, dy = 0, key = null, color = C.ink2, leader = null, className = 't-label', halo = true } = {}) {
  ensureStyles();
  const el = S('g', { class: 'ck-label' }, g);
  const off = dx ?? (anchor === 'middle' ? 0 : 8) * (anchor === 'end' ? -1 : 1);
  let tx = x + off;
  if (leader) {
    const [lx, ly] = leader;
    S('line', { class: 'leader', x1: x, y1: y, x2: lx, y2: ly }, el);
    S('circle', { class: 'leader-dot', cx: lx, cy: ly, r: 2.5 }, el);
  }
  if (key) {
    const kx = anchor === 'end' ? tx - 0 : tx;
    if (key === 'dot') S('circle', { cx: anchor === 'end' ? x + off + 0 : kx + 4, cy: y + dy - 4.5, r: 4, style: `fill:${color}` }, el);
    else S('line', { x1: kx, x2: kx + 14, y1: y + dy - 4.5, y2: y + dy - 4.5, strokeWidth: 2.5, strokeLinecap: 'round', style: `stroke:${color}` }, el);
    if (anchor !== 'end') tx += key === 'dot' ? 14 : 20;
  }
  const cls = `${className}${halo ? ' t-halo' : ''}${anchor === 'end' ? ' t-end' : anchor === 'middle' ? ' t-mid' : ''}`;
  el.text = S('text', { class: cls, x: tx, y: y + dy, text }, el);
  if (sub) el.sub = S('text', { class: `t-small${halo ? ' t-halo' : ''}${anchor === 'end' ? ' t-end' : anchor === 'middle' ? ' t-mid' : ''}`, x: tx, y: y + dy + 18, text: sub }, el);
  return el;
}

/** Nudge label y positions apart (order kept). list: [{ y, … }] → same list, y adjusted. */
export function placeLabels(list, { minGap = 18, min = -Infinity, max = Infinity } = {}) {
  const items = list.map((it, i) => ({ it, i, y: it.y })).sort((a, b) => a.y - b.y);
  for (let pass = 0; pass < 4; pass++) {
    for (let k = 1; k < items.length; k++) if (items[k].y - items[k - 1].y < minGap) items[k].y = items[k - 1].y + minGap;
    if (items.length && items[items.length - 1].y > max) {
      items[items.length - 1].y = max;
      for (let k = items.length - 2; k >= 0; k--) if (items[k + 1].y - items[k].y < minGap) items[k].y = items[k + 1].y - minGap;
    }
    if (items.length && items[0].y < min) items[0].y = min;
  }
  for (const r of items) r.it.y = r.y;
  return list;
}

// ------------------------------------------------------------------ rows
function wrapLines(text, maxChars) {
  if (!maxChars || text.length <= maxChars) return [text];
  const words = text.split(' ');
  let best = null;
  for (let k = 1; k < words.length; k++) {
    const a = words.slice(0, k).join(' '); const b = words.slice(k).join(' ');
    const score = Math.max(a.length, b.length);
    if (!best || score < best.score) best = { score, lines: [a, b] };
  }
  return best ? best.lines : [text];
}

export function rows(g, {
  items = [], x0 = 0, x1 = 600, top = 0, rowH = 30, labelW = 180, labelPad = 12,
  label = (it) => it.label, wrap = 0, labelClass = () => '', glyph = null,
  ariaLabel, name = 'Rows', selectable = () => true, hoverSelects = true, onSelect, onFocus,
} = {}) {
  ensureStyles();
  const el = S('g', { class: 'ck-rows', role: 'group', 'aria-label': name }, g);
  let selected = null;
  let focusId = null;
  const targetY = new Map();
  const labelX = x0 + labelW - labelPad;
  const recs = items.map((item, index) => {
    const raw = label(item);
    const lines = Array.isArray(raw) ? raw.slice(0, 2) : wrapLines(String(raw), wrap);
    const text = lines.join(' ');
    const rg = S('g', { class: 'ck-row', role: 'button', tabindex: -1, 'aria-pressed': 'false', 'aria-label': ariaLabel ? ariaLabel(item) : text, 'data-id': item.id }, el);
    const bandEl = S('rect', { class: 'ck-row__band', x: x0, y: 0, width: x1 - x0, height: rowH, rx: 4 }, rg);
    const lab = S('text', { class: `ck-row__label t-end ${labelClass(item) || ''}`.trim(), x: labelX, y: rowH / 2 }, rg);
    if (lines.length === 1) { lab.setAttribute('dy', '0.35em'); lab.textContent = lines[0]; }
    else lines.forEach((ln, k) => S('tspan', { x: labelX, dy: k === 0 ? '-0.25em' : '1.15em', text: ln }, lab));
    const content = S('g', { class: 'ck-row__content', transform: `translate(0 ${rowH / 2})` }, rg);
    const y = top + index * rowH;
    gsap.set(rg, { y });
    targetY.set(item.id, y);
    const rec = { id: item.id, item, index, g: rg, band: bandEl, label: lab, content, glyph: null, lines, y };
    if (glyph) {
      const gl = glyph(item);
      if (gl) { rec.glyph = gl; rg.append(gl.el); }
    }
    return rec;
  });
  const byId = (id) => recs.find((r) => r.id === id) || null;
  const isSel = (r) => !!selectable(r.item, r.index);

  // Measure labels to place glyphs just left of the (right-aligned) text.
  const measure = (r) => {
    let w = 0;
    try { w = r.label.getComputedTextLength(); } catch { /* not rendered */ }
    if (!w) w = r.lines[0].length * 7;
    if (r.lines.length > 1) {
      try { w = r.label.querySelector('tspan')?.getComputedTextLength() || w; } catch { /* ignore */ }
    }
    return w;
  };
  const placeGlyphs = () => {
    for (const r of recs) {
      if (!r.glyph) continue;
      const w = measure(r);
      const cy = r.lines.length > 1 ? rowH / 2 - 0.25 * 14 - 4.5 : rowH / 2;
      r.glyph.el.setAttribute('transform', `translate(${n1(labelX - w - 6 - r.glyph.width / 2)} ${n1(cy)})`);
    }
  };
  if (glyph) { requestAnimationFrame(placeGlyphs); document.fonts?.ready?.then(placeGlyphs); }

  const paint = () => {
    for (const r of recs) {
      const on = r.id === selected;
      r.g.classList.toggle('is-selected', on);
      r.g.setAttribute('aria-pressed', String(on));
      const s = isSel(r);
      r.g.classList.toggle('is-selectable', s);
      if (!s) r.g.setAttribute('aria-disabled', 'true'); else r.g.removeAttribute('aria-disabled');
    }
    const cur = byId(focusId) && isSel(byId(focusId)) ? byId(focusId) : visual().find(isSel);
    for (const r of recs) r.g.setAttribute('tabindex', r === cur ? 0 : -1);
  };
  const visual = () => [...recs].sort((a, b) => targetY.get(a.id) - targetY.get(b.id));
  const select = (id, { silent = false } = {}) => {
    const r = id == null ? null : byId(id);
    const next = r && isSel(r) ? r.id : null;
    if (next === selected) return;
    selected = next;
    paint();
    if (!silent) onSelect?.(next == null ? null : byId(next).item, next == null ? null : byId(next));
  };
  const focus = (id) => {
    const r = byId(id);
    if (!r) return;
    focusId = id;
    paint();
    r.g.focus({ preventScroll: false });
    onFocus?.(r.item, r);
  };

  for (const r of recs) {
    r.g.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse' && hoverSelects && isSel(r)) select(r.id); });
    r.g.addEventListener('click', () => { if (!isSel(r)) return; focusId = r.id; select(r.id); paint(); });
    r.g.addEventListener('focus', () => { focusId = r.id; });
  }
  el.addEventListener('keydown', (e) => {
    const list = visual().filter(isSel);
    if (!list.length) return;
    const i = Math.max(0, list.findIndex((r) => r.id === focusId));
    let j = null;
    if (e.key === 'ArrowDown') j = Math.min(list.length - 1, i + 1);
    else if (e.key === 'ArrowUp') j = Math.max(0, i - 1);
    else if (e.key === 'Home') j = 0;
    else if (e.key === 'End') j = list.length - 1;
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(list[i].id); return; }
    else if (e.key === 'Escape') { if (selected != null) { e.preventDefault(); select(null); } return; }
    if (j == null) return;
    e.preventDefault();
    focus(list[j].id);
  });
  paint();

  const api = {
    el, rows: recs, byId, select, focus,
    get selected() { return selected; },
    yOf: (id) => targetY.get(id),
    place(fn, anim = {}) {
      let k = 0;
      for (const r of recs) {
        const y = fn(r);
        if (y == null) continue;
        targetY.set(r.id, y);
        const a = { ...anim, at: (anim.at || 0) + (anim.stagger || 0) * k++, stagger: undefined };
        tweenTo(r.g, { y }, a);
      }
      paint();
    },
    order(ids, { top: t0 = top, rowH: rh = rowH, gaps = {} } = {}, anim = {}) {
      const pos = new Map();
      let y = t0;
      for (const id of ids) { y += gaps[id] || 0; pos.set(id, y); y += rh; }
      api.place((r) => (pos.has(r.id) ? pos.get(r.id) : null), anim);
      return y;
    },
    setInteractive(fn) { if (fn) selectable = fn; if (selected != null && !isSel(byId(selected))) select(null); paint(); },
    labelWidth: (id) => measure(byId(id)),
    relayoutGlyphs: placeGlyphs,
  };
  return api;
}

// ------------------------------------------------------------------ cursor
export function cursor(ctx, g, {
  scale: sc, domain, step = 1, value = null, y0 = 0, y1 = 100, label = 'Cursor', format = String, onMove,
} = {}) {
  ensureStyles();
  const [d0, d1] = domain || sc.domain;
  const lo = Math.min(d0, d1); const hi = Math.max(d0, d1);
  const snap = (v) => Math.min(hi, Math.max(lo, Math.round((v - lo) / step) * step + lo));
  const [r0, r1] = sc.range;
  const el = S('g', { class: 'ck-cursor', role: 'slider', tabindex: 0, 'aria-label': label, 'aria-valuemin': lo, 'aria-valuemax': hi, 'aria-orientation': 'horizontal' }, g);
  const hit = S('rect', { x: Math.min(r0, r1), y: Math.min(y0, y1), width: Math.abs(r1 - r0), height: Math.abs(y1 - y0), fill: 'transparent', 'data-hit': '', style: 'touch-action: pan-y' }, el);
  const rule = S('line', { class: 'ck-cursor__rule', y1: y0, y2: y1, opacity: 0 }, el);
  let cur = value;
  const root = g.ownerSVGElement;
  const toLocal = (clientX, clientY) => {
    const m = el.getScreenCTM();
    if (!m) return { x: 0, y: 0 };
    const p = new DOMPoint(clientX, clientY).matrixTransform(m.inverse());
    return { x: p.x, y: p.y };
  };
  const clientPoint = () => {
    const m = el.getScreenCTM();
    if (!m) return { x: 0, y: 0 };
    const p = new DOMPoint(sc(cur), Math.min(y0, y1)).matrixTransform(m);
    return { x: p.x, y: p.y };
  };
  const render = () => {
    if (cur == null) return;
    const x = sc(cur);
    rule.setAttribute('x1', x); rule.setAttribute('x2', x);
    rule.setAttribute('opacity', 1);
    el.setAttribute('aria-valuenow', cur);
    el.setAttribute('aria-valuetext', format(cur));
  };
  const set = (v, { silent = false, source = 'api' } = {}) => {
    const nv = snap(v);
    const changed = nv !== cur;
    cur = nv;
    render();
    if (!silent && (changed || source !== 'pointer')) onMove?.(cur, { source, clientPoint: clientPoint() });
    if (source === 'key') ctx.announce(format(cur));
  };
  let dragging = false;
  ctx.on(hit, 'pointermove', (e) => {
    if (e.pointerType === 'mouse' || dragging) set(sc.invert(toLocal(e.clientX, e.clientY).x), { source: 'pointer' });
  });
  ctx.on(hit, 'pointerdown', (e) => {
    if (e.pointerType !== 'mouse') { dragging = true; try { hit.setPointerCapture(e.pointerId); } catch { /* ignore */ } }
    set(sc.invert(toLocal(e.clientX, e.clientY).x), { source: 'pointer' });
  });
  const end = (e) => { dragging = false; try { hit.releasePointerCapture(e.pointerId); } catch { /* ignore */ } };
  ctx.on(hit, 'pointerup', end);
  ctx.on(hit, 'pointercancel', end);
  ctx.on(el, 'keydown', (e) => {
    const big = step * 10;
    const base = cur ?? lo;
    let v = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') v = base + (e.shiftKey ? big : step);
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') v = base - (e.shiftKey ? big : step);
    else if (e.key === 'PageUp') v = base + big;
    else if (e.key === 'PageDown') v = base - big;
    else if (e.key === 'Home') v = lo;
    else if (e.key === 'End') v = hi;
    else if (e.key === 'Escape') { api.hide(); return; }
    if (v == null) return;
    e.preventDefault();
    set(v, { source: 'key' });
  });
  if (cur != null) render();
  const api = {
    el, rule, hit, root,
    get value() { return cur; },
    set: (v, o = {}) => set(v, { source: 'api', ...o }),
    show() { if (cur != null) rule.setAttribute('opacity', 1); },
    hide() { rule.setAttribute('opacity', 0); ctx.tooltip?.hide(); },
  };
  return api;
}

// ------------------------------------------------------------------ HTML: legend, frame, card
const keySvg = (it) => {
  const shape = it.shape || 'circle';
  const color = it.color || 'var(--fg-2)';
  if (shape === 'tick') {
    return `<svg class="ck-legend__key" viewBox="-8 -8 16 16" aria-hidden="true"><line x1="0" x2="0" y1="-6.5" y2="6.5" stroke-width="2" stroke-linecap="round" style="stroke:${color}"/></svg>`;
  }
  if (shape === 'line') {
    return `<svg class="ck-legend__key" viewBox="-8 -8 16 16" aria-hidden="true"><line x1="-7" x2="7" y1="0" y2="0" stroke-width="2.5" stroke-linecap="round" style="stroke:${color}"${it.dash ? ` stroke-dasharray="${it.dash}"` : ''}/></svg>`;
  }
  const hollow = shape === 'ring' || it.fill === false;
  const d = markerPath(shape === 'ring' ? 'circle' : shape, 5);
  const style = hollow ? `fill:none;stroke:${color};stroke-width:1.5` : `fill:${color}`;
  return `<svg class="ck-legend__key" viewBox="-8 -8 16 16" aria-hidden="true"><path d="${d}" style="${style}"${it.dash ? ` stroke-dasharray="${it.dash}"` : ''}/></svg>`;
};
/** <ul class="ck-legend"> with marker keys that match marker(). items: [{ label, shape, fill, color, dash }] */
export function legendHTML(items = []) {
  ensureStyles();
  const ul = h('ul', { class: 'ck-legend', role: 'list' });
  for (const it of items) {
    const li = h('li', { class: 'ck-legend__item' });
    li.innerHTML = keySvg(it);
    li.append(h('span', { text: it.label }));
    ul.append(li);
  }
  return ul;
}

const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/**
 * In-stage HTML frame for real-data charts: optional toolbar, a legend slot above
 * the chart, the chart itself, a slot under it, and an always-visible source line.
 * The detail card is the foundation's ctx.ui.infoCard (beside the stage on wide
 * figures, under it on phones); a local fallback is used if that is unavailable.
 */
export function chartFrame(ctx, { toolbar = false, source = '', cardHint = '', cardWidth = '18rem', card: wantCard = true } = {}) {
  ensureStyles();
  ctx.setAspect('auto');
  const dark = ctx.stage.dataset.stage === 'dark';
  const toolbarEl = h('div', { class: 'ck-frame__toolbar' });
  const top = h('div', { class: 'ck-frame__top' });
  const main = h('div', { class: 'ck-frame__main' });
  const below = h('div', { class: 'ck-frame__below' });
  const sourceEl = h('p', { class: 'ck-source' });
  // The frame carries the theme tokens too, so HTML legends resolve C.* colors.
  const el = h('div', { class: `ck-frame ck ${dark ? 'ck--dark' : 'ck--light'}` });
  if (toolbar) el.append(toolbarEl);
  el.append(top, main, below, sourceEl);
  ctx.stage.append(el);
  sourceEl.textContent = source;
  if (!source) sourceEl.hidden = true;

  let legendEl = null;
  let onClose = null;
  let open = false;
  const bodyHTML = ({ lines = [], note, source: src }) => [
    ...lines.map((ln) => `<p class="ck-info__line">${ln}</p>`),
    note ? `<p class="ck-info__note">${note}</p>` : '',
    src ? `<p class="ck-info__src">${src}</p>` : '',
  ].join('');

  let card;
  if (wantCard && typeof ctx.ui.infoCard === 'function') {
    const ic = ctx.ui.infoCard({ placement: 'auto', width: cardWidth, empty: cardHint ? esc(cardHint) : null, closable: true });
    ic.el.classList.add('ck-info');
    ic.el.querySelector('.info-card__close')?.addEventListener('click', () => { open = false; const f = onClose; f?.(); }, { signal: ctx.signal });
    card = {
      el: ic.el,
      get open() { return open; },
      /** show({ title, lines: [html], note, source, kicker }) or show(htmlString). */
      show(content, { onClose: oc } = {}) {
        open = true;
        onClose = oc || null;
        if (typeof content === 'string') ic.show({ body: content });
        else ic.show({ kicker: content.kicker, title: content.title ? esc(content.title) : undefined, body: bodyHTML(content) });
      },
      hide({ silent = false } = {}) { const was = open; open = false; ic.hide(); if (was && !silent) onClose?.(); },
    };
  } else {
    // Local fallback: an inline panel under the chart.
    const cardEl = h('div', { class: 'ck-card', role: 'region', 'aria-label': 'Details', 'aria-live': 'polite', hidden: true });
    const closeBtn = h('button', { type: 'button', class: 'btn btn--ghost btn--icon btn--sm ck-card__close', 'aria-label': 'Close details', html: icon('close') });
    const cardBody = h('div', { class: 'ck-card__body' });
    cardEl.append(cardBody, closeBtn);
    below.append(cardEl);
    card = {
      el: cardEl,
      get open() { return open; },
      show(content, { onClose: oc } = {}) {
        open = true;
        onClose = oc || null;
        cardBody.replaceChildren();
        if (typeof content === 'string') cardBody.innerHTML = content;
        else {
          if (content.title) cardBody.append(h('p', { class: 'ck-card__title', text: content.title }));
          cardBody.insertAdjacentHTML('beforeend', bodyHTML(content));
        }
        cardEl.hidden = false;
      },
      hide({ silent = false } = {}) { const was = open; open = false; cardEl.hidden = true; if (was && !silent) onClose?.(); },
    };
    closeBtn.addEventListener('click', () => card.hide(), { signal: ctx.signal });
    cardEl.addEventListener('keydown', (e) => { if (e.key === 'Escape' && open) card.hide(); }, { signal: ctx.signal });
  }

  return {
    el, toolbar: toolbarEl, top, main, below, sourceEl, card,
    setSource(text) { sourceEl.textContent = text; sourceEl.hidden = !text; },
    /** Legend above the chart (items: see legendHTML); [] removes it. Returns the <ul>. */
    legend(items = []) {
      if (legendEl) legendEl.remove();
      legendEl = items.length ? legendHTML(items) : null;
      if (legendEl) top.append(legendEl);
      return legendEl;
    },
  };
}
