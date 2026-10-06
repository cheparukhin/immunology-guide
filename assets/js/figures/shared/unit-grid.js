// shared/unit-grid.js — unit grids ("out of 100"), platform task P3.
// API: docs/shared/unit-grid.md
//
// One small mark per unit in a grid. Each unit is a <g> (positioned with GSAP
// x/y, highlighted with its opacity) holding stacked shapes whose opacities
// express its state, so every state change is a plain tween that steppers
// can seek through:
//   filled · outline · check (outline + ✓) · dim · hatch · hidden
import { svg as S } from '../../ui/dom.js';
import { gsap } from '../../../vendor/gsap/index.js';
import { C, hatchFill, tweenTo, chartRoot } from './chart.js';

const LOOK = {
  filled: { body: 1, ring: 0, hatch: 0, check: 0 },
  outline: { body: 0, ring: 1, hatch: 0, check: 0 },
  check: { body: 0, ring: 1, hatch: 0, check: 1 },
  dim: { body: 0.2, ring: 0, hatch: 0, check: 0 },
  hatch: { body: 0, ring: 1, hatch: 1, check: 0 },
  hidden: { body: 0, ring: 0, hatch: 0, check: 0 },
};
const PARTS = ['body', 'ring', 'hatch', 'check'];
const norm = (s) => (s === 'outline+check' ? 'check' : s);

const f1 = (v) => Math.round(v * 100) / 100;
function shapePath(shape, s, inset = 0, radius) {
  const h = s / 2 - inset;
  if (shape === 'circle' || shape === 'bead') {
    return `M${f1(-h)},0A${f1(h)},${f1(h)} 0 1 0 ${f1(h)},0A${f1(h)},${f1(h)} 0 1 0 ${f1(-h)},0Z`;
  }
  if (shape === 'person') {
    const k = (v) => f1(v * (s - inset * 2));
    const hr = 0.17;
    const head = `M${k(-hr)},${k(-0.3)}A${k(hr)},${k(hr)} 0 1 0 ${k(hr)},${k(-0.3)}A${k(hr)},${k(hr)} 0 1 0 ${k(-hr)},${k(-0.3)}Z`;
    const body = `M${k(-0.32)},${k(0.48)}V${k(0.12)}Q${k(-0.32)},${k(-0.06)} ${k(-0.13)},${k(-0.06)}H${k(0.13)}Q${k(0.32)},${k(-0.06)} ${k(0.32)},${k(0.12)}V${k(0.48)}Z`;
    return head + body;
  }
  const r = Math.max(0, Math.min(h, (radius ?? s * 0.18) - inset));
  return `M${f1(-h + r)},${f1(-h)}H${f1(h - r)}Q${f1(h)},${f1(-h)} ${f1(h)},${f1(-h + r)}V${f1(h - r)}Q${f1(h)},${f1(h)} ${f1(h - r)},${f1(h)}H${f1(-h + r)}Q${f1(-h)},${f1(h)} ${f1(-h)},${f1(h - r)}V${f1(-h + r)}Q${f1(-h)},${f1(-h)} ${f1(-h + r)},${f1(-h)}Z`;
}

function mulberry(seed) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

export function unitGrid(g, {
  count = 100, cols, size = 10, gap = 3, shape = 'square', x = 0, y = 0, order = 'rows',
  group = () => 0, color = C.s1, state = 'filled', radius, label,
} = {}) {
  // Make sure the C tokens resolve even if the caller didn't create a chartRoot.
  const parent = g.closest?.('.ck') ? g : chartRoot(g);
  const ncols = cols || Math.ceil(Math.sqrt(count));
  const nrows = Math.ceil(count / ncols);
  const pitch = size + gap;
  const el = S('g', { class: 'ug', transform: `translate(${x} ${y})`, role: label ? 'img' : null, 'aria-label': label || null, 'aria-hidden': label ? null : 'true' }, parent);
  const colorOf = (grp, i) => (typeof color === 'function' ? color(grp, i) : color && typeof color === 'object' ? (color[grp] ?? C.s1) : color);
  const sw = Math.max(1, Math.min(1.6, size * 0.13));
  const body = shapePath(shape, size, 0, radius);
  const ringD = shapePath(shape, size, sw / 2, radius);
  const checkW = Math.max(1.3, size * 0.14);
  const checkD = `M${f1(-size * 0.22)},${f1(size * 0.02)}L${f1(-size * 0.06)},${f1(size * 0.18)}L${f1(size * 0.24)},${f1(-size * 0.15)}`;

  const units = [];
  for (let i = 0; i < count; i++) {
    const col = order === 'columns' ? Math.floor(i / nrows) : i % ncols;
    const row = order === 'columns' ? i % nrows : Math.floor(i / ncols);
    const cx = col * pitch + size / 2;
    const cy = row * pitch + size / 2;
    const grp = group(i);
    const c = colorOf(grp, i);
    const ug = S('g', { class: 'ug-unit', 'data-group': String(grp) }, el);
    const parts = {};
    parts.body = S('g', { class: 'ug-body' }, ug);
    S('path', { d: body, style: `fill:${c}` }, parts.body);
    if (shape === 'bead') S('circle', { cx: f1(-size * 0.14), cy: f1(-size * 0.15), r: f1(size * 0.16), style: 'fill:#fff;fill-opacity:0.38' }, parts.body);
    parts.ring = S('path', { class: 'ug-ring', d: ringD, style: `fill:none;stroke:${c};stroke-width:${sw}` }, ug);
    parts.hatch = S('path', { class: 'ug-hatch', d: ringD, style: `fill:${hatchFill(el, c, { spacing: Math.max(2.6, size * 0.28), width: Math.max(0.9, size * 0.08) })};stroke:none` }, ug);
    parts.check = S('path', { class: 'ug-check', d: checkD, style: `fill:none;stroke:${c};stroke-width:${checkW};stroke-linecap:round;stroke-linejoin:round` }, ug);
    gsap.set(ug, { x: cx, y: cy });
    const unit = { i, group: grp, g: ug, x: cx, y: cy, state: null, parts };
    units.push(unit);
  }

  const resolve = (states, u, i) => {
    if (typeof states === 'string') return states;
    if (Array.isArray(states)) return states[i];
    if (typeof states === 'function') return states(u, i);
    if (states && typeof states === 'object') return states[u.group];
    return undefined;
  };

  const rankOf = (list, from) => {
    const n = list.length;
    if (from === 'end') return (k) => n - 1 - k;
    if (from === 'center') return (k) => Math.abs(k - (n - 1) / 2);
    if (from === 'random') {
      const r = mulberry(n * 7919 + 17);
      const ranks = list.map((_, k) => ({ k, v: r() })).sort((a, b) => a.v - b.v);
      const pos = new Array(n);
      ranks.forEach((o, idx) => { pos[o.k] = idx; });
      return (k) => pos[k];
    }
    return (k) => k;
  };

  function setStates(states, { tl, at = 0, duration = 0.45, ease = 'so.inOut', stagger = 0, from = 'start' } = {}) {
    const changed = [];
    units.forEach((u, i) => {
      const s = norm(resolve(states, u, i));
      if (!s || !LOOK[s]) { if (s && !LOOK[s]) console.warn(`[unitGrid] unknown state "${s}"`); return; }
      if (s === u.state && !tl) return;
      changed.push([u, s]);
    });
    const rank = rankOf(changed, from);
    changed.forEach(([u, s], k) => {
      const look = LOOK[s];
      const anim = { tl, at: at + rank(k) * stagger, duration, ease };
      for (const p of PARTS) {
        if (!tl && u.state && LOOK[u.state][p] === look[p]) continue;
        tweenTo(u.parts[p], { opacity: look[p] }, anim);
      }
      u.state = s;
    });
  }

  function highlight(sel, { tl, at = 0, duration = 0.45, ease = 'so.inOut', dim = 0.22 } = {}) {
    const test = sel == null ? () => true
      : typeof sel === 'function' ? sel
        : Array.isArray(sel) ? (u) => sel.includes(u.group) : (u) => u.group === sel;
    const on = units.filter(test).map((u) => u.g);
    const off = units.filter((u) => !test(u)).map((u) => u.g);
    if (on.length) tweenTo(on, { opacity: 1 }, { tl, at, duration, ease });
    if (off.length) tweenTo(off, { opacity: dim }, { tl, at, duration, ease });
  }

  function relayout(fn, { tl, at = 0, duration = 0.8, ease = 'so.inOut', stagger = 0 } = {}) {
    units.forEach((u, i) => {
      const p = fn(u, i);
      if (!p) return;
      u.x = p.x; u.y = p.y;
      tweenTo(u.g, { x: p.x, y: p.y }, { tl, at: at + i * stagger, duration, ease });
    });
  }

  // Initial state, instantly.
  units.forEach((u, i) => {
    const s = norm(resolve(state, u, i)) || 'filled';
    const look = LOOK[s] || LOOK.filled;
    for (const p of PARTS) gsap.set(u.parts[p], { opacity: look[p] });
    u.state = LOOK[s] ? s : 'filled';
  });

  return {
    el, units,
    width: ncols * pitch - gap,
    height: nrows * pitch - gap,
    cols: ncols, rows: nrows, pitch,
    setStates, highlight, relayout,
    stateOf: (i) => units[i]?.state,
    count: (s) => units.filter((u) => u.state === norm(s)).length,
    /** Default cell center (grid-relative) of index i, for relayout helpers. */
    cellCenter(i, c = ncols) {
      return { x: (i % c) * pitch + size / 2, y: Math.floor(i / c) * pitch + size / 2 };
    },
  };
}
