// ch05-exhaustion — "When the fight never ends" (figure task F13).
//
// A DETERMINISTIC KEYFRAMED model (FIGURE-AUDIT §2A), not a stochastic simulation: every
// scenario is a short list of keyframes; cell counts, glows, badges, migrants and the chart
// are pure functions of (scenario, day). The same input always gives the same picture.
//
//   • guided: ctx.ui.stepper (5 writer captions) drives a state proxy through cell-actions
//     drive(), so Back, dot jumps and reduced motion land on identical frames;
//   • free (after step 5, §4 rule 21): Acute | Chronic, Play/Pause, Restart, "Release the
//     PD-1 brake", then "Remove the stem-like reserve, then try again" — a ctx.loop advances
//     the day; under reduced motion Play steps through keyframes as static snapshots.
//
// Vocabulary shared verbatim with ch08-two-brakes: ./shared/exhaustion-marks.js.
import { tCell, healthyCell, lymphNodeField, tissueField, setDying, PALETTE, mix } from '../art/index.js';
import { C, scale, chartRoot, axis, pathD, band } from './shared/chart.js';
import { drive } from './shared/cell-actions.js';
import { brakeBadge, setStruck, lockBadge, markLayout, MARK_CSS, NAMES, CARDS } from './shared/exhaustion-marks.js';

const FIG = 'ch05-exhaustion';
const NS = 'http://www.w3.org/2000/svg';
const KEY = 7;                                    // one clone: one tcrKey (§4 rule 13)
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const clamp01 = (v) => clamp(v, 0, 1);
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => t * t * (3 - 2 * t);
const r2 = (v) => Math.round(v * 100) / 100;

// ------------------------------------------------------------------ keyframes
// Group params: f = fraction of the group's drawn slots, fn = function (glow), rest = resting-art
// weight (naive / memory / stem-like look), x = exhausted-art weight, b = inhibitory badges (0–3),
// lock = fraction of slots padlocked, stem = TCF1 badge. Groups: S = stem-like cluster in the
// lymph node, E = other lymph-node cells, O = tissue cells, W = tissue "wave" slots.
const G = (f, fn = 1, o = {}) => ({ f, fn, rest: 0, x: 0, b: 0, lock: 0, stem: 0, ...o });
const NONE = G(0, 1);
const K = (d, o) => ({ d, tox: 0, struck: 0, die: false, ...o });

const A0 = K(0, { ag: 0.1, T: 0.05, fn: 1, pop: [0.06, 0], S: G(1 / 3, 1, { rest: 1 }), E: NONE, O: NONE, W: NONE });
const A6 = K(6, { ag: 1, T: 0.5, fn: 1, pop: [0.55, 0.35], S: G(1), E: G(2 / 7), O: G(2 / 6), W: G(1 / 4) });
const C10 = K(10, { ag: 0.9, T: 0.9, fn: 0.8, pop: [0.75, 0.9],
  S: G(1, 0.85, { rest: 0.25, b: 1 }), E: G(4 / 7, 0.8, { x: 0.15, b: 1 }), O: G(1, 0.8, { x: 0.15, b: 1 }), W: G(3 / 4, 0.8, { x: 0.15, b: 1 }) });
const C20 = K(20, { ag: 0.8, T: 0.6, fn: 0.5, tox: 1, die: true, pop: [0.4, 0.6],
  S: G(1, 0.6, { rest: 1, b: 1, stem: 1 }), E: G(2 / 7, 0.45, { x: 0.6, b: 2 }), O: G(1, 0.45, { x: 0.65, b: 2, lock: 2 / 6 }), W: G(0, 0.45, { x: 0.65, b: 2 }) });
const C35 = K(35, { ag: 0.8, T: 0.5, fn: 0.3, tox: 1, die: true, pop: [0.24, 0.5],
  S: G(1, 0.55, { rest: 1, b: 1, stem: 1 }), E: G(0, 0.35, { x: 0.8, b: 2 }), O: G(1, 0.25, { x: 1, b: 3, lock: 5 / 6 }), W: G(0, 0.35, { x: 0.8, b: 2 }) });
const hold = (k, d) => ({ ...k, d, die: false });

const KF = {
  acute: [
    A0, A6,
    K(10, { ag: 0.2, T: 1, fn: 1, pop: [0.8, 1], S: G(1), E: G(4 / 7), O: G(1), W: G(3 / 4) }),
    K(14, { ag: 0, T: 0.8, fn: 1, pop: [0.65, 0.8], S: G(1), E: G(3 / 7), O: G(5 / 6), W: G(2 / 4) }),
    K(30, { ag: 0, T: 0.1, fn: 1, die: true, pop: [0.14, 0.12], S: G(0.75, 1, { rest: 1 }), E: NONE, O: G(0.4, 1, { rest: 1 }), W: NONE }),
    K(60, { ag: 0, T: 0.1, fn: 1, pop: [0.14, 0.12], S: G(0.75, 1, { rest: 1 }), E: NONE, O: G(0.4, 1, { rest: 1 }), W: NONE }),
  ],
  chronic: [A0, A6, C10, C20, C35, hold(C35, 60)],
  // Release, triggered from the day-35 state (Pauken et al. 2016 for re-exhaustion at +25 days).
  release: [A0, A6, C10, C20, C35,
    K(40, { ag: 0.7, T: 0.72, fn: 0.45, tox: 1, struck: 1, pop: [0.78, 0.56],
      S: G(1, 0.72, { rest: 0.5, b: 1, stem: 1 }), E: G(5 / 7, 0.92), O: G(1, 0.28, { x: 1, b: 3, lock: 5 / 6 }), W: G(1 / 4, 0.95) }),
    K(45, { ag: 0.4, T: 0.9, fn: 0.6, tox: 1, struck: 1, pop: [0.5, 0.92],
      S: G(1, 0.66, { rest: 0.8, b: 1, stem: 1 }), E: G(2 / 7, 0.9), O: G(1, 0.3, { x: 1, b: 3, lock: 5 / 6 }), W: G(1, 1) }),
    K(60, { ag: 0.6, T: 0.6, fn: 0.35, tox: 1, struck: 0, pop: [0.24, 0.66],
      S: G(1, 0.55, { rest: 1, b: 1, stem: 1 }), E: G(0, 0.9), O: G(1, 0.25, { x: 1, b: 3, lock: 5 / 6 }), W: G(1, 0.35, { x: 0.85, b: 2, lock: 3 / 4 }) }),
  ],
  // The same release with the stem-like reserve removed first: only a small, brief effect.
  noreserve: [A0, A6, C10, C20, { ...C35, S: G(0, 0.55, { rest: 1, b: 1, stem: 1 }), pop: [0.04, 0.5] },
    K(40, { ag: 0.78, T: 0.52, fn: 0.33, tox: 1, struck: 1, pop: [0.03, 0.52], S: G(0, 0.55, { rest: 1, b: 1, stem: 1 }), E: NONE, O: G(1, 0.32, { x: 1, b: 3, lock: 5 / 6 }), W: NONE }),
    K(45, { ag: 0.75, T: 0.55, fn: 0.35, tox: 1, struck: 1, pop: [0.03, 0.55], S: G(0, 0.55, { rest: 1, b: 1, stem: 1 }), E: NONE, O: G(1, 0.35, { x: 1, b: 3, lock: 5 / 6 }), W: NONE }),
    K(60, { ag: 0.8, T: 0.4, fn: 0.28, tox: 1, struck: 0, die: true, pop: [0.02, 0.4], S: G(0, 0.55, { rest: 1, b: 1, stem: 1 }), E: NONE, O: G(4 / 6, 0.25, { x: 1, b: 3, lock: 4 / 6 }), W: NONE }),
  ],
};
const CHRONIC_FAMILY = new Set(['chronic', 'release', 'noreserve']);

// Which of the three looks (act / rest / exh) each group can ever show, derived from the keyframes,
// so slots only draw the T-cell arts they need (performance: each art is ~55 SVG nodes). Stem-like
// slots never look exhausted; lymph-node "E" and tissue-wave "W" slots never look resting.
const LOOKS = Object.fromEntries(['S', 'E', 'O', 'W'].map((k) => {
  const gs = Object.values(KF).flat().map((q) => q[k]);
  const anyX = gs.some((g) => g.x > 0), anyRest = gs.some((g) => g.rest > 0);
  const need = [];
  if (gs.some((g) => g.x < 1 && g.rest < 1) || (anyX && anyRest)) need.push('act');
  if (anyRest) need.push('rest');
  if (anyX) need.push('exh');
  return [k, need];
}));

// Monotone cubic interpolation (Fritsch–Carlson) for the chart curves: smooth, no overshoot.
function monotone(xs, ys) {
  const n = xs.length;
  const d = [];
  const m = new Array(n).fill(0);
  for (let i = 0; i < n - 1; i++) d[i] = (ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]);
  m[0] = d[0]; m[n - 1] = d[n - 2];
  for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) { m[i] = 0; m[i + 1] = 0; continue; }
    const a = m[i] / d[i], b = m[i + 1] / d[i], s = a * a + b * b;
    if (s > 9) { const t = 3 / Math.sqrt(s); m[i] = t * a * d[i]; m[i + 1] = t * b * d[i]; }
  }
  return (x) => {
    if (x <= xs[0]) return ys[0];
    if (x >= xs[n - 1]) return ys[n - 1];
    let i = 0;
    while (i < n - 2 && x > xs[i + 1]) i++;
    const h = xs[i + 1] - xs[i], t = (x - xs[i]) / h, t2 = t * t, t3 = t2 * t;
    return (2 * t3 - 3 * t2 + 1) * ys[i] + (t3 - 2 * t2 + t) * h * m[i] + (-2 * t3 + 3 * t2) * ys[i + 1] + (t3 - t2) * h * m[i + 1];
  };
}
const CURVES = Object.fromEntries(Object.entries(KF).map(([k, list]) => {
  const xs = list.map((q) => q.d);
  return [k, { ag: monotone(xs, list.map((q) => q.ag)), T: monotone(xs, list.map((q) => q.T)), fn: monotone(xs, list.map((q) => q.fn)) }];
}));

/** Model state at (scenario, day). `cut` animates the reserve's removal (noreserve, day 35). */
function evalModel(scen, day, cut = 1) {
  const list = KF[scen];
  let i = 0;
  while (i < list.length - 2 && day > list[i + 1].d) i++;
  const A = list[i], B = list[i + 1];
  const e = smooth(clamp01((day - A.d) / (B.d - A.d)));
  const groups = {};
  for (const k of ['S', 'E', 'O', 'W']) {
    const a = A[k], b = B[k];
    const g = {};
    for (const p of ['f', 'fn', 'rest', 'x', 'b', 'lock', 'stem']) g[p] = lerp(a[p], b[p], e);
    g.mode = b.f < a.f - 1e-6 ? (B.die ? 'die' : 'fade') : 'grow';
    Object.assign(g, { fA: a.f, fB: b.f, lockA: a.lock, lockB: b.lock, e });   // for whole-cell counts per layout
    groups[k] = g;
  }
  // Removing the reserve: the stem-like cells die out at day 35 before the release plays.
  if (scen === 'noreserve' && day >= 35 - 1e-6 && cut < 1) groups.S = { ...C35.S, f: 1 - cut, fA: 1 - cut, fB: 1 - cut, lockA: 0, lockB: 0, e: 0, mode: 'die' };
  const cv = CURVES[scen];
  return {
    scen, day, cut,
    chronic: CHRONIC_FAMILY.has(scen),
    tox: lerp(A.tox, B.tox, e), struck: lerp(A.struck, B.struck, e),
    pop: [lerp(A.pop[0], B.pop[0], e), lerp(A.pop[1], B.pop[1], e)],
    ag: clamp(cv.ag(day), 0, 1.2), T: clamp(cv.T(day), 0, 1.2), fn: clamp(cv.fn(day), 0, 1.2),
    dAg: cv.ag(day + 0.2) - cv.ag(day - 0.2),
    groups,
  };
}

// Migrants: one daughter of a dividing cell drifts from the lymph node to the tissue.
// Windows [start, end] in days, per scenario; src/dst are slot refs.
function migrantWindows(scen) {
  if (scen === 'acute') return [{ a: 2.5, b: 8.5, src: ['S', 1], dst: ['O', 1], kind: 'effector' }, { a: 4, b: 10, src: ['S', 2], dst: ['O', 2], kind: 'effector' }];
  const truce = [20, 27.5].map((a) => ({ a, b: a + 7.5, src: ['S', 0], dst: ['O', 5], kind: 'recruit', renew: true }));
  if (scen === 'chronic') return [...truce, ...[35, 42.5, 50].map((a) => ({ a, b: a + 7.5, src: ['S', 0], dst: ['O', 5], kind: 'recruit', renew: true }))];
  if (scen === 'release') {
    return [...truce,
      { a: 35.5, b: 40.5, src: ['S', 0], dst: ['W', 0], kind: 'recruit', renew: true },
      { a: 36.5, b: 41.5, src: ['S', 1], dst: ['W', 1], kind: 'recruit', renew: true },
      { a: 37.5, b: 43, src: ['S', 2], dst: ['W', 2], kind: 'recruit', renew: true },
      { a: 39, b: 44.5, src: ['S', 1], dst: ['W', 3], kind: 'recruit' },
      { a: 47, b: 54.5, src: ['S', 0], dst: ['O', 5], kind: 'recruit', renew: true }];
  }
  return truce;   // noreserve: nothing renews after the reserve is gone
}

// ------------------------------------------------------------------ layouts
const FOOT = 'Simplified. In chronic viral infection in mice, stem-like cells sit mainly in lymphoid tissue; in tumors they are also found in niches inside the tumor. Curves are illustrative.';
// Focus per panel (1 = full, 0 = veiled): lymph node, tissue, chart.
const FOCUS = {
  all: { ln: 1, ts: 1, chart: 1 },
  ts: { ln: 0, ts: 1, chart: 0 },
  cells: { ln: 1, ts: 1, chart: 0 },
  ln: { ln: 1, ts: 0, chart: 0 },
};
const LAYOUTS = {
  wide: {
    vb: [960, 604], R: 19, TR: 26,
    ln: { x: 16, y: 66, w: 452, h: 300 }, ts: { x: 492, y: 66, w: 452, h: 300 },
    plot: { x0: 64, x1: 776, y0: 414, y1: 550 }, heads: true,
    slots: {
      S: [[0.40, 0.53], [0.55, 0.37], [0.58, 0.68]],
      E: [[0.24, 0.40], [0.29, 0.69], [0.71, 0.27], [0.75, 0.52], [0.72, 0.80], [0.88, 0.40], [0.41, 0.22]],
      O: [[0.08, 0.76], [0.405, 0.51], [0.87, 0.525], [0.525, 0.775], [0.74, 0.32], [0.095, 0.30]],
      W: [[0.175, 0.55], [0.525, 0.29], [0.30, 0.735], [0.915, 0.765]],
      T: [[0.31, 0.33], [0.645, 0.545], [0.745, 0.745], [0.915, 0.30]],
    },
    th: [0.06, 0.4, 0.68, 0.88],
    via: [480, 90],
  },
  compact: {
    vb: [400, 778], R: 18, TR: 24, popTop: true, short: true,
    ln: { x: 8, y: 70, w: 384, h: 224 }, ts: { x: 8, y: 304, w: 384, h: 224 },
    plot: { x0: 30, x1: 384, y0: 574, y1: 668 }, heads: false,
    legend: { y: 730 },
    slots: {
      S: [[0.40, 0.56], [0.53, 0.31]],
      E: [[0.20, 0.45], [0.80, 0.56], [0.62, 0.80], [0.70, 0.22]],
      O: [[0.08, 0.70], [0.12, 0.38], [0.50, 0.70], [0.885, 0.70]],   // 0.885: its TOX pill (it grows with the text on phones) stays inside the panel
      W: [[0.60, 0.38], [0.29, 0.70]],
      T: [[0.36, 0.38], [0.70, 0.70], [0.87, 0.38]],
    },
    th: [0.06, 0.5, 0.88],
    via: [200, 300],
  },
};

const CSS = `
[data-figure="${FIG}"] svg .ex5-title { font-family: var(--font-ui); }
[data-figure="${FIG}"] svg .ex5-callout { pointer-events: none; }
[data-figure="${FIG}"] svg [data-hit] { cursor: pointer; outline: none; }
[data-figure="${FIG}"] svg [data-hit]:focus-visible { stroke: var(--stage-focus, #A3B2FF); stroke-width: 2; vector-effect: non-scaling-stroke; }
[data-figure="${FIG}"] .ex5-controls { display: flex; flex-wrap: wrap; align-items: center; gap: 10px 14px; width: 100%; }
[data-figure="${FIG}"] .ex5-controls[hidden] { display: none; }
[data-figure="${FIG}"] .ex5-fns { list-style: none; margin: 0.5em 0 0; padding: 0; display: flex; flex-wrap: wrap; gap: 6px 10px; }
[data-figure="${FIG}"] .ex5-fns li { display: inline-flex; }
[data-figure="${FIG}"] .ex5-note { margin: 0.6em 0 0; font-size: 0.92em; color: var(--ink-2, var(--fg-2)); }
[data-figure="${FIG}"] .ex5-legend { display: flex; flex-wrap: wrap; gap: 6px 16px; margin: var(--s-2) 0 0; padding: 0; list-style: none; font-family: var(--font-ui); font-size: var(--text-xs); color: var(--ink-2); }
[data-figure="${FIG}"] .ex5-legend li { display: inline-flex; align-items: center; gap: 7px; }
[data-figure="${FIG}"] .ex5-legend li[hidden] { display: none; }
[data-figure="${FIG}"] .ex5-legend svg { width: 26px; height: 26px; flex-shrink: 0; border-radius: 7px; background: #0F1630; }
[data-figure="${FIG}"] .fig__controls > .ex5-legend, [data-figure="${FIG}"] .fig__controls > .ex5-card { flex: 1 1 100%; margin: 0; }
[data-figure="${FIG}"] .ex5-foot { margin: var(--s-2) 0 0; font-family: var(--font-ui); font-size: var(--text-xs); line-height: 1.45; color: var(--ink-3); }
@container fig (max-width: 599.98px) { [data-figure="${FIG}"] svg .t-caps { font-size: max(13.5px, calc(12.5px * var(--u, 1))); } }
${MARK_CSS(`[data-figure="${FIG}"]`)}
`;

export default function mount(fig, ctx) {
  const { gsap } = ctx;
  if (!document.getElementById('ex5-style')) document.head.append(ctx.h('style', { id: 'ex5-style', text: CSS }));

  ctx.setAspect(960 / 604, 400 / 778);
  const svg = ctx.createSVG({ viewBox: '0 0 960 604', interactive: true, label: 'Killer T cells in a lymph node and in infected tissue or a tumor, with a time chart below' });
  ctx.tag('Illustrative');
  ctx.tag('Time compressed');
  const clock = ctx.ui.clock({ value: 'Day 0' });

  const S = (tag, attrs = {}, parent) => {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) if (k !== 'text' && attrs[k] != null) e.setAttribute(k, String(attrs[k]));
    if (attrs.text != null) e.textContent = attrs.text;
    if (parent) parent.appendChild(e);
    return e;
  };
  // attribute cache: write only when the value changes (render runs every frame)
  const setA = (e, name, v) => {
    const s = typeof v === 'number' ? String(r2(v)) : v;
    const c = e.__a || (e.__a = {});
    if (c[name] !== s) { c[name] = s; e.setAttribute(name, s); }
  };

  const haloPaint = ctx.radialGradient(svg, [[0, PALETTE.cd8, 0.5], [0.55, PALETTE.cd8, 0.22], [1, PALETTE.cd8, 0]], { id: 'ex5-halo' });
  const hazePaint = ctx.radialGradient(svg, [[0, PALETTE.cd8, 0.34], [0.6, PALETTE.cd8, 0.12], [1, PALETTE.cd8, 0]], { id: 'ex5-haze' });

  let layoutName = ctx.compact ? 'compact' : 'wide';
  let L = LAYOUTS[layoutName];
  let el = null;                       // scene nodes for the current layout
  const ambients = [];

  // ------------------------------------------------------------------ scene build
  function buildScene() {
    ambients.splice(0).forEach((t) => t.kill());
    for (const c of [...svg.children]) if (c !== svg.defs) c.remove();
    L = LAYOUTS[layoutName];
    const [VW, VH] = L.vb;
    svg.setAttribute('viewBox', `0 0 ${VW} ${VH}`);
    const R = L.R;
    const P = (box, [u, v]) => [box.x + u * box.w, box.y + v * box.h];

    // Compartments
    const bg = S('g', {}, svg);
    const ln = L.ln, ts = L.ts;
    bg.append(lymphNodeField({ width: ln.w, height: ln.h, x: ln.x, y: ln.y, seed: 4, stage: 'dark', follicles: 3, density: 0.75 }));
    const clipId = `ex5-clip-${layoutName}`;
    svg.defs.querySelector(`#${clipId}`)?.remove();
    const cp = S('clipPath', { id: clipId }, svg.defs);
    S('rect', { x: ts.x, y: ts.y, width: ts.w, height: ts.h, rx: 26 }, cp);
    const tsG = S('g', { 'clip-path': `url(#${clipId})` }, bg);
    S('rect', { x: ts.x, y: ts.y, width: ts.w, height: ts.h, fill: mix(PALETTE.healthy, '#0B1024', 0.9), opacity: 0.55 }, tsG);
    tsG.append(tissueField({ width: ts.w, height: ts.h, x: ts.x, y: ts.y, seed: 6, stage: 'dark', density: 0.65 }));
    S('rect', { x: ts.x + 0.5, y: ts.y + 0.5, width: ts.w - 1, height: ts.h - 1, rx: 26, fill: 'none', stroke: 'rgb(233 236 246 / 0.16)', 'stroke-width': 1, 'vector-effect': 'non-scaling-stroke' }, bg);
    S('text', { class: 't-caps ex5-title', x: ln.x + 14, y: ln.y + 20, text: 'Lymph node' }, bg);
    S('text', { class: 't-caps ex5-title', x: ts.x + 16, y: ts.y + 22, text: 'Infected tissue / tumor' }, bg);

    // Population haze + word
    const haze = [ln, ts].map((b) => S('ellipse', { cx: b.x + b.w / 2, cy: b.y + b.h * 0.54, rx: b.w * 0.42, ry: b.h * 0.4, fill: hazePaint, opacity: 0 }, bg));
    const popWords = [ln, ts].map((b) => S('text', { class: 't-small t-end t-halo', x: b.x + b.w - 14, y: L.popTop ? b.y + 21 : b.y + b.h - 12, text: '' }, bg));

    const scene = S('g', {}, svg);                 // veiled when the scenario switches
    const targetsL = S('g', { 'pointer-events': 'none' }, scene);
    const cellsL = S('g', {}, scene);
    const migL = S('g', { 'pointer-events': 'none' }, scene);
    const fxL = S('g', { 'pointer-events': 'none' }, scene);
    const callL = S('g', { 'pointer-events': 'none' }, svg);

    // Target cells (infected; hot-pink viral peptides)
    const targets = L.slots.T.map((uv, i) => {
      const [x, y] = P(ts, uv);
      const g = S('g', { transform: `translate(${r2(x)} ${r2(y)})`, opacity: 0 }, targetsL);
      const inner = S('g', {}, g);
      const art = healthyCell({ r: L.TR, seed: 11 + i * 3, state: 'infected', stage: 'dark', mhc: 6 });
      inner.append(art);
      // prepare the seekable apoptosis once, so every navigation path has the same DOM
      setDying(art, 1, { remnants: false, seed: 3 }); setDying(art, 0, { remnants: false, seed: 3 });
      return { g, inner, art, th: L.th[i], x, y, dp: 0 };
    });

    // T-cell slots
    const slots = [];
    const mkCell = (parent, seed, looks = ['act', 'rest', 'exh']) => {
      const g = S('g', {}, parent);
      const idle = S('g', {}, g);
      const body = S('g', {}, idle);
      const halo = S('circle', { r: R * 2.15, fill: haloPaint, opacity: 0 }, body);
      const make = {
        act: () => tCell({ variant: 'cd8', r: R, state: 'activated', seed, tcrKey: KEY, polarity: -150 + ((seed * 53) % 120), stage: 'dark' }),
        rest: () => tCell({ variant: 'cd8', r: R, state: 'resting', seed, tcrKey: KEY, stage: 'dark' }),
        exh: () => tCell({ variant: 'cd8', r: R, state: 'exhausted', seed, tcrKey: KEY, stage: 'dark' }),
      };
      const arts = Object.fromEntries(looks.map((k) => [k, make[k]()]));
      for (const a of Object.values(arts)) { a.setAttribute('opacity', '0'); body.append(a); }
      const specks = S('g', { opacity: 0 }, g);
      const speckEls = Array.from({ length: 5 }, (_, k) => S('circle', { r: 2.3, fill: mix(PALETTE.cd8, '#FFFFFF', 0.35) }, specks));
      const marks = S('g', {}, idle);
      // Polish A5 (no badge soup): cell state is read from the cell's own look plus ONE ring and at
      // most two small glyphs, explained once in the legend under the stage:
      //   glow = function · any ring = TOX on (the exhausted family) · mint ring = stem-like (TCF1) ·
      //   padlock = terminal (TCF1 lost) · one crimson "−" = the PD-1 brake (struck through on release).
      // The exhausted art itself carries the extra inhibitory receptors, so one disc is enough.
      const ML = markLayout(R);
      const toxRing = S('circle', { r: R + 6, fill: 'none', stroke: '#C9D3E8', 'stroke-width': 1.7, 'stroke-dasharray': '3.2 3.6', 'stroke-linecap': 'round', opacity: 0 }, marks);
      const stemRing = S('circle', { r: R + 6, fill: 'none', stroke: '#8FE3B0', 'stroke-width': 2.4, opacity: 0 }, marks);
      const badges = [ML.badges[1]].map(([bx, by]) => {
        const b = brakeBadge({ x: bx, y: by, size: 12.5 });
        b.setAttribute('opacity', '0');
        marks.append(b);
        return b;
      });
      const tox = toxRing, tcf1 = stemRing;
      const lock = lockBadge(ctx, { x: ML.lock[0], y: ML.lock[1], r: 9 }); lock.setAttribute('opacity', '0'); marks.append(lock);
      return { g, idle, body, halo, arts, specks, speckEls, marks, badges, tox, tcf1, lock, seed };
    };
    let seed = 3;
    for (const grp of ['S', 'E', 'O', 'W']) {
      L.slots[grp].forEach((uv, k) => {
        const box = grp === 'S' || grp === 'E' ? ln : ts;
        const [x, y] = P(box, uv);
        const c = mkCell(cellsL, seed++, LOOKS[grp]);
        c.g.setAttribute('transform', `translate(${r2(x)} ${r2(y)})`);
        const hit = S('circle', { r: R + 10, fill: 'transparent', 'data-hit': '', role: 'button', tabindex: '-1', 'aria-label': 'T cell' }, c.g);
        const slot = { ...c, grp, k, x, y, hit, kind: null, vis: 0 };
        hit.addEventListener('click', () => showCard(slot));
        hit.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); showCard(slot); } });
        slots.push(slot);
        if (!ctx.reducedMotion) {
          const rr = ctx.random(seed * 17);
          ambients.push(ctx.ambient(gsap.to(c.idle, { x: rr.range(-3, 3), y: rr.range(-2.5, 2.5), duration: rr.range(2.8, 4.6), ease: 'sine.inOut', yoyo: true, repeat: -1 })));
        }
      });
    }
    const slotOf = (grp, k) => slots.find((s) => s.grp === grp && s.k === Math.min(k, L.slots[grp].length - 1));

    // Migrants (daughters on their way to the tissue)
    const migrants = Array.from({ length: 4 }, (_, i) => {
      const c = mkCell(migL, 40 + i, ['act']);   // migrants only ever show the activated look
      c.g.setAttribute('opacity', '0');
      c.arts.act.setAttribute('opacity', '1');
      return c;
    });
    // Self-renewal loop arrow (one daughter stays)
    const loop = S('g', { opacity: 0, class: 'ex5-loop' }, fxL);
    {
      const rr = R + 13;
      const a0 = (-200 * Math.PI) / 180, a1 = (-20 * Math.PI) / 180;
      const p = (a) => `${r2(Math.cos(a) * rr)} ${r2(Math.sin(a) * rr)}`;
      S('path', { d: `M${p(a0)} A${rr} ${rr} 0 0 1 ${p(a1)}`, fill: 'none', stroke: '#8FE3B0', 'stroke-width': 1.8, 'stroke-linecap': 'round', 'stroke-dasharray': '3 4' }, loop);
      const ax = Math.cos(a1) * rr, ay = Math.sin(a1) * rr;
      S('path', { d: `M${r2(ax - 7)} ${r2(ay - 3)} L${r2(ax + 1)} ${r2(ay + 1)} L${r2(ax - 3)} ${r2(ay - 8)}`, fill: 'none', stroke: '#8FE3B0', 'stroke-width': 1.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, loop);
    }
    // "Reserve removed" mark
    const cutMark = S('g', { opacity: 0 }, fxL);
    {
      const s0 = slotOf('S', 0);
      ctx.badgeSVG('no', { x: s0.x, y: s0.y, r: 13 }, cutMark);
    }

    // Callouts (one label per idea, with a thin leader)
    const callout = (text, [tx, ty], [ax, ay], anchor = 'start', icon) => {
      const g = S('g', { class: 'ex5-callout', opacity: 0 }, callL);
      const tw = text.length * 7.4 + (icon ? 20 : 0);
      const lx = anchor === 'start' ? tx + Math.min(tw / 2, 50) : anchor === 'end' ? tx - Math.min(tw / 2, 50) : tx;
      const ly = ty + (ay > ty ? 7 : -17);
      const dx = ax - lx, dy = ay - ly, len = Math.hypot(dx, dy);
      if (len > 16) {
        S('line', { class: 'leader', x1: lx, y1: ly, x2: r2(ax - (dx / len) * 4), y2: r2(ay - (dy / len) * 4) }, g);
        S('circle', { class: 'leader-dot', cx: ax, cy: ay, r: 2.4 }, g);
      }
      let x = tx;
      if (icon) {
        const ix = anchor === 'end' ? tx - tw + 8 : tx + 8;
        ctx.iconSVG(icon, { x: ix, y: ty - 5, size: 15, color: '#E9ECF6' }, g);
        if (anchor !== 'end') x = tx + 20;
      }
      S('text', { class: `t-label t-halo${anchor === 'end' ? ' t-end' : anchor === 'middle' ? ' t-mid' : ''}`, x, y: ty, text }, g);
      return g;
    };
    const s0 = slotOf('S', 0), s1 = slotOf('S', 1), o0 = slotOf('O', 0), wk = slotOf('W', layoutName === 'wide' ? 1 : 0), o1 = slotOf('O', 1);
    const wide = layoutName === 'wide';
    const calls = {
      memory: wide ? callout('Memory cells', [ln.x + 30, ln.y + ln.h - 18], [s0.x - R * 0.7, s0.y + R * 0.7])
        : callout('Memory cells', [ln.x + 14, ln.y + ln.h - 14], [s0.x - R * 0.7, s0.y + R * 0.7]),
      stem: wide ? callout('Stem-like (progenitor)', [ln.x + 26, ln.y + ln.h - 18], [s0.x - R * 0.8, s0.y + R * 0.8])
        : callout('Stem-like (progenitor)', [ln.x + 14, ln.y + ln.h - 14], [s0.x - R * 0.8, s0.y + R * 0.8]),
      lock: wide ? callout(NAMES.lock, [ts.x + 16, ts.y + ts.h - 16], [o0.x + R + 5, o0.y - R + 3], 'start', 'padlock')
        : callout(NAMES.lock, [ts.x + 14, ts.y + ts.h - 12], [o0.x + R + 5, o0.y - R + 3], 'start', 'padlock'),
      wave: wide ? callout('Fresh from the reserve', [ts.x + ts.w - 16, ts.y + 24], [wk.x + R * 0.6, wk.y - R * 0.7], 'end')
        : callout('From the reserve', [ts.x + ts.w - 12, ts.y + ts.h - 12], [wk.x + R * 0.6, wk.y + R * 0.6], 'end'),
      cut: wide ? callout('Reserve removed', [ln.x + 26, ln.y + ln.h - 18], [s0.x - 10, s0.y + 10])
        : callout('Reserve removed', [ln.x + 14, ln.y + ln.h - 14], [s0.x - 10, s0.y + 10]),
      locked: null,
    };
    void o1;

    // ---------------------------------------------------------------- chart (dark-native)
    const plot = L.plot;
    const xs = scale({ domain: [0, 60], range: [plot.x0, plot.x1] });
    const ys = scale({ domain: [0, 1.28], range: [plot.y1, plot.y0] });
    const chart = chartRoot(svg, { theme: 'stage-dark' });
    const bandG = S('g', { opacity: 0 }, chart);
    const bandEl = band(bandG, { x0: xs(35), x1: xs(60), y0: plot.y0 - 4, y1: plot.y1, label: L.short ? 'Brake released' : 'PD-1 brake released', opacity: 0.07 });
    axis(chart, { scale: xs, orient: 'bottom', at: plot.y1, ticks: [0, 10, 20, 30, 40, 50, 60], format: (v) => String(v),
      title: 'Days', titleAlign: 'end', grid: null });
    axis(chart, { scale: ys, orient: 'left', at: plot.x0, ticks: [], labels: false, tickSize: 0, title: 'Relative level' });
    S('line', { class: 'ck-grid', x1: plot.x0, x2: plot.x1, y1: ys(1), y2: ys(1) }, chart);
    const SER = [
      { id: 'ag', label: 'Antigen', color: C.stroke('neo-peptide'), dash: '7 5', width: 2.4 },
      { id: 'T', label: 'Specific T cells', color: C.stroke('cd8'), dash: null, width: 2.8 },
      { id: 'fn', label: 'Function per cell', color: C.stroke('activate'), dash: '0.5 5.5', width: 3 },
    ];
    const dataG = S('g', {}, chart);
    const ghostG = S('g', { opacity: 0 }, dataG);
    const ghosts = SER.map((s) => S('path', { d: '', fill: 'none', 'stroke-width': s.width - 0.6, 'stroke-linecap': 'round', 'stroke-dasharray': s.dash, style: `stroke:${s.color};stroke-opacity:0.32` }, ghostG));
    const ghostLabel = S('text', { class: 't-small t-mid', x: 0, y: 0, text: '', style: 'fill: var(--fg-3)' }, ghostG);
    const lines = SER.map((s) => S('path', { d: '', fill: 'none', 'stroke-width': s.width, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-dasharray': s.dash, style: `stroke:${s.color}` }, dataG));
    const head = S('g', {}, dataG);
    const rule = S('line', { x1: 0, x2: 0, y1: plot.y0 - 6, y2: plot.y1, style: 'stroke: var(--fg-2); stroke-opacity: 0.55; stroke-width: 1; vector-effect: non-scaling-stroke' }, head);
    const dots = SER.map((s) => S('circle', { r: 4.6, cx: 0, cy: 0, style: `fill:${s.color}; stroke: #0B1024; stroke-width: 2` }, head));
    const heads = L.heads ? SER.map((s) => S('text', { class: 't-small t-halo', x: 0, y: 0, text: s.label, style: 'fill: var(--fg)' }, head)) : [];
    if (!L.heads) {
      // compact legend: line swatches (color + dash) with names
      const lg = S('g', {}, chart);
      const rows = [[SER[0], SER[1]], [SER[2]]];
      rows.forEach((row, ri) => {
        let x = plot.x0;
        row.forEach((s) => {
          const y = L.legend.y + ri * 24;
          S('line', { x1: x, x2: x + 24, y1: y - 4.5, y2: y - 4.5, 'stroke-width': s.width, 'stroke-linecap': 'round', 'stroke-dasharray': s.dash, style: `stroke:${s.color}` }, lg);
          S('text', { class: 't-small', x: x + 32, y, text: s.label, style: 'fill: var(--fg)' }, lg);
          x += 32 + s.label.length * 8 + 26;
        });
      });
    }
    // Focus veils (polish A5: one focal panel per step). A soft navy veil over each panel that is not
    // the step's focus; render() sets their opacity from the state proxy, so every route agrees.
    const vg = S('g', { 'pointer-events': 'none' }, svg);
    const veil = (x, y, w, h, rx) => S('rect', { x, y, width: w, height: h, rx, fill: '#0B1024', opacity: 0 }, vg);
    const [VW2, VH2] = L.vb;
    const veils = {
      ln: veil(ln.x - 4, ln.y - 4, ln.w + 8, ln.h + 8, 30),
      ts: veil(ts.x - 4, ts.y - 4, ts.w + 8, ts.h + 8, 30),
      chart: veil(0, Math.max(ln.y + ln.h, ts.y + ts.h) + 8, VW2, VH2 - (Math.max(ln.y + ln.h, ts.y + ts.h) + 8), 0),
    };

    el = { scene, targets, slots, slotOf, migrants, loop, cutMark, calls, haze, popWords, xs, ys, plot, bandG, bandEl, ghostG, ghosts, ghostLabel, lines, rule, dots, heads, veils };
    ctx.refreshTextScale();
  }

  // ------------------------------------------------------------------ render
  function slotVisual(s, g, M, rv, kIndex, cap) {
    // keyframe counts rounded to whole cells for this layout, so held states never show ghosts
    const n = lerp(Math.round(g.fA * cap), Math.round(g.fB * cap), g.e);
    const nl = lerp(Math.round(g.lockA * cap), Math.round(g.lockB * cap), g.e);
    const pres = clamp01(n - kIndex);
    const lockW = clamp01(nl - kIndex) * rv.lock;
    const dying = g.mode === 'die' && pres < 1;
    const fn = clamp01(g.fn + (g.lock > 0.01 ? 0.08 * (1 - clamp01(nl - kIndex)) : 0));
    // body + death specks
    let op, sc, dp = 0;
    if (dying) { dp = 1 - pres; op = clamp01(1 - dp * 1.35); sc = lerp(1, 0.55, dp); }
    else { op = pres; sc = lerp(0.72, 1, pres); }
    setA(s.body, 'opacity', op);
    setA(s.body, 'transform', `scale(${r2(sc)})`);
    setA(s.specks, 'opacity', dying && dp > 0.05 ? clamp01(1 - (dp - 0.4) / 0.6) : 0);
    {
      s.speckEls.forEach((c, i) => {
        const a = (i / 5) * Math.PI * 2 + s.seed;
        const d = L.R * lerp(0.3, 1.5, dp);
        setA(c, 'cx', Math.cos(a) * d); setA(c, 'cy', Math.sin(a) * d);
      });
    }
    // art crossfade (function = glow, ONE property)
    const x = clamp01(g.x), rest = clamp01(g.rest);
    if (s.arts.act) setA(s.arts.act, 'opacity', (1 - x) * (1 - rest));
    if (s.arts.rest) setA(s.arts.rest, 'opacity', (1 - x) * rest);
    if (s.arts.exh) setA(s.arts.exh, 'opacity', x);
    setA(s.halo, 'opacity', 0.08 + 0.85 * Math.pow(fn, 1.4));
    // marks
    const mk = dying ? 0 : pres * pres;
    setA(s.marks, 'opacity', mk);
    s.badges.forEach((b, i) => { setA(b, 'opacity', clamp01(g.b - i)); setStruck(b, M.struck); });
    const chronicLineage = M.chronic;
    const stemW = s.grp === 'S' && chronicLineage ? clamp01(g.stem) * rv.stem : 0;
    setA(s.tox, 'opacity', chronicLineage ? clamp01(M.tox) * rv.tox * (1 - stemW) : 0);   // the mint ring replaces it
    setA(s.lock, 'opacity', lockW);
    setA(s.tcf1, 'opacity', stemW);
    // kind (for the info card)
    let kind = 'effector';
    if (!M.chronic) kind = M.day < 3 ? 'naive' : rest > 0.5 ? 'memory' : 'effector';
    else if (s.grp === 'S' && g.stem * rv.stem > 0.5) kind = 'stem';
    else if (lockW > 0.5) kind = 'terminal';
    else if (M.tox * rv.tox > 0.5) kind = fn > 0.75 ? 'recruit' : 'exhausted';
    else kind = fn > 0.7 ? 'effector' : 'exhausting';
    s.kind = kind; s.fn = fn;
    s.vis = op > 0.5 ? 1 : 0;
    return s.vis;
  }

  const KIND_LABEL = {
    naive: 'Naive killer T cell', effector: 'Effector killer T cell', memory: 'Memory T cell', stem: 'Stem-like (progenitor) exhausted cell',
    terminal: 'Terminally exhausted cell', recruit: 'Fresh effector from the reserve', exhausted: 'Exhausted T cell', exhausting: 'Killer T cell losing function',
  };

  function render(st) {
    if (!el) return;
    const M = evalModel(st.scen, st.day, st.cut);
    const rv = st.rv;
    clock.set(`Day ${Math.floor(st.day + 1e-6)}`);
    setA(el.scene, 'opacity', 1 - st.veil);

    // population haze + words
    M.pop.forEach((p, i) => {
      setA(el.haze[i], 'opacity', clamp01(p) * 0.85);
      const w = p < 0.03 ? 'none' : p < 0.2 ? 'few' : p < 0.55 ? 'some' : 'many';
      const t = `T cells: ${w}`;
      if (el.popWords[i].textContent !== t) el.popWords[i].textContent = t;
    });

    // targets
    el.targets.forEach((t) => {
      const pres = clamp01((M.ag - t.th + 0.06) / 0.06);
      let op, dp;
      if (M.dAg < -1e-4) { dp = 1 - pres; op = 1; }
      else { dp = 0; op = pres; }
      if (Math.abs(dp - t.dp) > 1e-4) {
        // apply p = 1 first: setDying leaves late-phase parts untouched at small p, so this keeps
        // the (hidden) DOM a pure function of p whatever the navigation path
        setDying(t.art, 1, { remnants: false, seed: 3 }); setDying(t.art, dp, { remnants: false, seed: 3 }); t.dp = dp;
      }
      setA(t.g, 'opacity', op * (dp >= 0.999 ? 0 : 1));
      setA(t.inner, 'transform', `scale(${r2(lerp(0.8, 1, op))})`);
    });

    // slots
    const caps = Object.fromEntries(['S', 'E', 'O', 'W'].map((k) => [k, L.slots[k].length]));
    const firstOfKind = new Set();
    for (const s of el.slots) {
      const vis = slotVisual(s, M.groups[s.grp], M, rv, s.k, caps[s.grp]);
      const focus = vis && !firstOfKind.has(s.kind);
      if (focus) firstOfKind.add(s.kind);
      setA(s.hit, 'tabindex', focus ? '0' : '-1');
      setA(s.hit, 'aria-label', vis ? KIND_LABEL[s.kind] : 'Empty');
      setA(s.hit, 'display', vis ? 'inline' : 'none');
    }

    // migrants + self-renewal loop
    let loopOp = 0, loopAt = null;
    const wins = migrantWindows(M.scen).filter((w) => !(w.kind === 'recruit' && rv.stem < 0.5));
    const active = wins.filter((w) => st.day > w.a && st.day < w.b).slice(0, el.migrants.length);
    el.migrants.forEach((m, i) => {
      const w = active[i];
      if (!w) {   // canonical idle state (keeps the hidden DOM path-independent)
        setA(m.g, 'opacity', 0); setA(m.g, 'transform', 'translate(0 0) scale(1)');
        setA(m.halo, 'opacity', 0); setA(m.body, 'opacity', 0); setA(m.tox, 'opacity', 0); setA(m.marks, 'opacity', 0);
        return;
      }
      const src = el.slotOf(...w.src), dst = el.slotOf(...w.dst);
      const phi = (st.day - w.a) / (w.b - w.a);
      const ang = Math.atan2(dst.y - src.y, dst.x - src.x);
      const ex = src.x + Math.cos(ang) * L.R * 1.7, ey = src.y + Math.sin(ang) * L.R * 1.7;
      let x, y, op, sc;
      if (phi < 0.2) { const q = smooth(phi / 0.2); x = lerp(src.x, ex, q); y = lerp(src.y, ey, q); op = q; sc = lerp(0.7, 1, q); }
      else {
        const q = smooth(clamp01((phi - 0.2) / 0.7));
        const [vx, vy] = L.via;
        const cx = (vx + (ex + dst.x) / 2) / 2, cy = (vy + (ey + dst.y) / 2) / 2;
        x = (1 - q) * (1 - q) * ex + 2 * (1 - q) * q * cx + q * q * dst.x;
        y = (1 - q) * (1 - q) * ey + 2 * (1 - q) * q * cy + q * q * dst.y;
        op = phi > 0.88 ? clamp01(1 - (phi - 0.88) / 0.12) : 1; sc = 1;
      }
      setA(m.g, 'opacity', op * (1 - st.veil));
      setA(m.g, 'transform', `translate(${r2(x)} ${r2(y)}) scale(${r2(sc)})`);
      setA(m.halo, 'opacity', 0.75);
      setA(m.body, 'opacity', 1);
      setA(m.tox, 'opacity', w.kind === 'recruit' ? clamp01(M.tox) * rv.tox : 0);
      setA(m.marks, 'opacity', 1);
      if (w.renew && phi < 0.55) { const lo = phi < 0.08 ? phi / 0.08 : phi > 0.4 ? (0.55 - phi) / 0.15 : 1; if (lo > loopOp) { loopOp = lo; loopAt = src; } }
    });
    setA(el.loop, 'opacity', loopOp);
    setA(el.loop, 'transform', loopAt ? `translate(${r2(loopAt.x)} ${r2(loopAt.y)})` : 'translate(0 0)');

    // removal mark
    const cutOn = M.scen === 'noreserve' && st.day >= 35 - 1e-6 ? clamp01(st.cut) : 0;
    setA(el.cutMark, 'opacity', cutOn);

    // callouts
    const c = el.calls;
    setA(c.memory, 'opacity', !M.chronic && st.day > 22 ? clamp01((st.day - 22) / 4) : 0);
    setA(c.stem, 'opacity', M.chronic && cutOn < 0.5 ? clamp01(M.groups.S.stem) * rv.stem * clamp01(M.groups.S.f) : 0);
    setA(c.cut, 'opacity', cutOn > 0.5 ? cutOn : 0);
    const locked = M.chronic ? clamp01(M.groups.O.lock * L.slots.O.length) * rv.lock : 0;
    setA(c.lock, 'opacity', locked);
    const wave = M.scen === 'release' ? clamp01(M.groups.W.f * L.slots.W.length - 1) * clamp01(M.groups.W.fn * 1.6 - 0.6) : 0;
    setA(c.wave, 'opacity', wave);

    // chart
    renderChart(st, M);
    // focus veils
    const fc = st.focus || FOCUS.all;
    for (const k of ['ln', 'ts', 'chart']) setA(el.veils[k], 'opacity', (1 - fc[k]) * 0.62);
  }

  function seriesPts(scen, id, d0, d1) {
    const f = CURVES[scen][id];
    const pts = [];
    for (let d = d0; d < d1; d += 0.5) pts.push([el.xs(d), el.ys(f(d))]);
    pts.push([el.xs(d1), el.ys(f(d1))]);
    return pts;
  }
  function renderChart(st, M) {
    const day = clamp(st.day, 0, 60);
    const ids = ['ag', 'T', 'fn'];
    ids.forEach((id, i) => setA(el.lines[i], 'd', day > 0.01 ? pathD(seriesPts(M.scen, id, 0, day), 'linear') : ''));
    setA(el.lines[0].parentNode, 'opacity', 1 - st.veil);
    // ghost: what the other run did, for comparison
    const ghostScen = M.scen === 'release' ? 'chronic' : M.scen === 'noreserve' ? 'release' : null;
    setA(el.ghostG, 'opacity', ghostScen ? 1 : 0);
    setA(el.bandG, 'opacity', ghostScen ? 1 : 0);
    if (!ghostScen) {
      el.ghosts.forEach((g) => setA(g, 'd', ''));
      setA(el.ghostLabel, 'x', 0); setA(el.ghostLabel, 'y', 0);
    } else {
      ids.forEach((id, i) => setA(el.ghosts[i], 'd', pathD(seriesPts(ghostScen, id, 35, 60), 'linear')));
      const gl = M.scen === 'release' ? 'no release' : 'with the reserve';
      if (el.ghostLabel.textContent !== gl) el.ghostLabel.textContent = gl;
      const gd = M.scen === 'release' ? 55 : 52;
      setA(el.ghostLabel, 'x', el.xs(gd));
      setA(el.ghostLabel, 'y', el.ys(CURVES[ghostScen].T(gd)) + (M.scen === 'release' ? 18 : -10));
      const bl = M.scen === 'release' ? (L.short ? 'Brake released' : 'PD-1 brake released') : (L.short ? 'No reserve' : 'Released, no reserve');
      if (el.bandEl.label && el.bandEl.label.textContent !== bl) el.bandEl.label.textContent = bl;
    }
    const hx = el.xs(day);
    setA(el.rule, 'x1', hx); setA(el.rule, 'x2', hx);
    const vals = [M.ag, M.T, M.fn];
    el.dots.forEach((d, i) => { setA(d, 'cx', hx); setA(d, 'cy', el.ys(vals[i])); });
    if (el.heads.length) {
      const items = vals.map((v, i) => ({ i, y: el.ys(v) + 4.5 })).sort((a, b) => a.y - b.y);
      for (let k = 1; k < items.length; k++) if (items[k].y - items[k - 1].y < 17) items[k].y = items[k - 1].y + 17;
      const over = items[items.length - 1].y - (el.plot.y1 + 2);
      if (over > 0) items.forEach((it) => { it.y -= over; });
      items.forEach((it) => { setA(el.heads[it.i], 'x', hx + 11); setA(el.heads[it.i], 'y', it.y); });
    }
  }

  // ------------------------------------------------------------------ info cards
  const card = ctx.ui.infoCard({ placement: 'below', empty: 'Tap or click a cell to see what kind it is.' });

  // ONE legend for the cell marks, right under the stage (polish A5); entries appear with their step.
  const sw = (inner) => `<svg viewBox="-13 -13 26 26" aria-hidden="true">${inner}</svg>`;
  const LEG = [
    { from: 0, html: sw('<circle r="9" fill="#4C8DFF" opacity="0.28"/><circle r="5.5" fill="#4C8DFF"/>'), text: 'Glow: how well a cell works' },
    { from: 1, html: sw('<circle r="6.5" fill="#E5484D"/><path d="M-3.4 0H3.4" stroke="#fff" stroke-width="2" stroke-linecap="round"/>'), text: 'PD-1 brake' },
    { from: 2, html: sw('<circle r="8.5" fill="none" stroke="#C9D3E8" stroke-width="1.7" stroke-dasharray="3 3.3"/><circle r="4" fill="#4C8DFF" opacity="0.7"/>'), text: 'Ring: TOX on (exhausted family)' },
    { from: 2, html: sw('<rect x="-4.5" y="-1.5" width="9" height="7" rx="1.5" fill="none" stroke="#E9ECF6" stroke-width="1.6"/><path d="M-2.8 -1.5V-3.6a2.8 2.8 0 0 1 5.6 0V-1.5" fill="none" stroke="#E9ECF6" stroke-width="1.6"/>'), text: NAMES.lock },
    { from: 3, html: sw('<circle r="8.5" fill="none" stroke="#8FE3B0" stroke-width="2.4"/><circle r="4" fill="#4C8DFF" opacity="0.7"/>'), text: 'Mint ring: stem-like reserve (TCF1), also TOX on' },
  ];
  const legendEl = ctx.h('ul', { class: 'ex5-legend', 'aria-label': 'What the marks on the cells mean' });
  const legendItems = LEG.map((it) => {
    const li = ctx.h('li', { html: `${it.html}<span>${it.text}</span>` });
    legendEl.append(li);
    return li;
  });
  function paintLegend(i) { legendItems.forEach((li, k) => { li.hidden = LEG[k].from > i; }); }
  paintLegend(0);
  // the "Simplified…" footnote lives under the step caption now, not inside the stage
  ctx.caption.append(ctx.h('p', { class: 'ex5-foot', text: FOOT }));

  function fnList(statuses) {
    return `<ul class="ex5-fns">${CARDS.functions.map((f, i) => `<li>${ctx.ui.badgeHTML(statuses[i], f, 'sm')}</li>`).join('')}</ul>`;
  }
  const byFn = (fn) => [0.8, 0.7, 0.45, 0.3].map((t) => (fn >= t ? 'yes' : fn >= t - 0.25 ? 'partial' : 'no'));
  function showCard(s) {
    const k = s.kind;
    const body = {
      naive: '<p>One killer T cell of this clone, before it has met the virus. When it recognizes an infected cell’s peptide, it starts to proliferate.</p>',
      effector: `<p>Fully functional: it proliferates, secretes IL-2, TNF and IFN-γ, and kills infected cells.</p>${fnList(['yes', 'yes', 'yes', 'yes'])}`,
      memory: `<p>${CARDS.memory}</p>`,
      stem: `<p>${CARDS.stem}</p>${fnList(['yes', 'partial', 'partial', 'partial'])}`,
      terminal: `<p>${CARDS.terminal}</p>${fnList(['no', 'no', 'partial', 'partial'])}`,
      recruit: `<p>A new cell sent out by the stem-like reserve: bright and able to kill, but TOX+, so it already belongs to the exhausted family. If antigen persists, it wears out again.</p>${fnList(['partial', 'partial', 'yes', 'yes'])}`,
      exhausted: `<p>Part of the exhausted family (TOX+). Abilities fade in order: proliferation and IL-2 first, then the other cytokines, killing last.</p>${fnList(byFn(s.fn))}`,
      exhausting: `<p>Still killing, but the antigen never goes away: it is losing abilities and piling up inhibitory receptors.</p>${fnList(byFn(s.fn))}`,
    }[k];
    const kicker = k === 'stem' || k === 'terminal' || k === 'exhausted' || k === 'recruit' ? 'Exhausted family · TOX+' : 'Killer T cell';
    card.show({ kicker, title: KIND_LABEL[k], body });
  }

  // ------------------------------------------------------------------ guided steps
  const SS = { scen: 'acute', day: 0, cut: 1, veil: 0, rv: { tox: 0, lock: 0, stem: 0 }, focus: FOCUS.all };
  const F = { scen: 'chronic', day: 35, cut: 1, veil: 0, rv: { tox: 1, lock: 1, stem: 1 }, focus: FOCUS.all };
  let owner = 'stepper';
  const put = (o) => { Object.assign(SS, o, { rv: { ...SS.rv, ...(o.rv || {}) } }); if (owner === 'stepper') render(SS); };
  const RV0 = { tox: 0, lock: 0, stem: 0 };
  const dayEase = (p) => gsap.parseEase('sine.inOut')(p);

  // one focal panel per step (polish A5): 1 the whole story · 2 the tissue, where cells wear out ·
  // 3 both compartments (TOX marks the whole family) · 4 the lymph node's reserve · 5 the payoff, all
  const STEP_FOCUS = ['all', 'ts', 'cells', 'ln', 'all'];
  const focusDrive = (tl, i) => {
    const a = FOCUS[STEP_FOCUS[Math.max(0, i - 1)]], b = FOCUS[STEP_FOCUS[i]];
    drive(tl, (p) => { const q = smooth(p); put({ focus: { ln: lerp(a.ln, b.ln, q), ts: lerp(a.ts, b.ts, q), chart: lerp(a.chart, b.chart, q) } }); }, { duration: 0.7, pos: 0 });
  };
  const steps = [
    { enter(tl) { drive(tl, (p) => put({ scen: 'acute', day: 60 * dayEase(p), cut: 1, veil: 0, rv: RV0 }), { duration: 6.5 }); focusDrive(tl, 0); } },
    { enter(tl) {
      drive(tl, (p) => put({ scen: p < 0.5 ? 'acute' : 'chronic', day: p < 0.5 ? 60 : 0, cut: 1, veil: Math.sin(Math.PI * p), rv: RV0 }), { duration: 0.8 });
      drive(tl, (p) => put({ scen: 'chronic', day: 20 * dayEase(p), cut: 1, veil: 0, rv: RV0 }), { duration: 4.6 });
      focusDrive(tl, 1);
    } },
    { enter(tl) {
      drive(tl, (p) => put({ scen: 'chronic', day: 20, cut: 1, veil: 0, rv: { tox: smooth(p), lock: smooth(clamp01(p * 1.4 - 0.4)), stem: 0 } }), { duration: 1.2 });
      drive(tl, (p) => put({ scen: 'chronic', day: lerp(20, 27.5, dayEase(p)), cut: 1, veil: 0, rv: { tox: 1, lock: 1, stem: 0 } }), { duration: 3 });
      focusDrive(tl, 2);
    } },
    { enter(tl) {
      drive(tl, (p) => put({ scen: 'chronic', day: 27.5, cut: 1, veil: 0, rv: { tox: 1, lock: 1, stem: smooth(p) } }), { duration: 1 });
      drive(tl, (p) => put({ scen: 'chronic', day: lerp(27.5, 35, p), cut: 1, veil: 0, rv: { tox: 1, lock: 1, stem: 1 } }), { duration: 5 });
      focusDrive(tl, 3);
    } },
    { enter(tl) {
      drive(tl, (p) => put({ scen: p > 0 ? 'release' : 'chronic', day: lerp(35, 45, dayEase(p)), cut: 1, veil: 0, rv: { tox: 1, lock: 1, stem: 1 } }), { duration: 5.5 });
      focusDrive(tl, 4);
    } },
  ];

  // ------------------------------------------------------------------ free play
  const RATE = 8;                // days per second
  let snapT = 0;
  let released = false;
  const keyDays = (scen) => KF[scen].map((q) => q.d);
  const loop = ctx.loop((dt) => {
    if (owner !== 'free') return;
    if (F.scen === 'noreserve' && F.day >= 35 - 1e-6 && F.cut < 1) {
      F.cut = ctx.reducedMotion ? 1 : Math.min(1, F.cut + dt / 1.3);
      render(F);
      return;
    }
    if (F.day >= 60) { loop.pause(); render(F); return; }
    if (ctx.reducedMotion) {
      snapT += dt;
      if (snapT < 1.4) return;
      snapT = 0;
      F.day = keyDays(F.scen).find((d) => d > F.day + 1e-6) ?? 60;
    } else {
      F.day = Math.min(60, F.day + dt * RATE);
    }
    render(F);
    if (F.day >= 60) loop.pause();
  }, { autoplay: false });

  const controls = ctx.h('div', { class: 'ex5-controls' });
  controls.hidden = true;
  ctx.controls.append(controls);
  const goFree = (o, { play = true } = {}) => {
    owner = 'free';
    stepper.pause();
    Object.assign(F, o, { focus: FOCUS.all });
    paintLegend(4);
    snapT = 0;
    seg.set(F.scen === 'acute' ? 'acute' : 'chronic');
    paintButtons();
    render(F);
    if (play) loop.play(); else loop.pause();
  };
  const seg = ctx.ui.segmented({
    label: 'Infection', hideLabel: true, value: 'chronic', parent: controls,
    options: [{ value: 'acute', label: 'Acute infection' }, { value: 'chronic', label: 'Chronic infection or tumor' }],
    onChange: (v) => { goFree({ scen: v, day: 0, cut: 1 }); ctx.announce(v === 'acute' ? 'Acute infection, from day 0.' : 'Chronic infection or tumor, from day 0.'); },
  });
  const playBtn = ctx.ui.playPause({ loop, parent: controls, onChange: (on) => {
    if (owner !== 'free') { goFree({ scen: SS.scen, day: SS.day, cut: SS.cut }, { play: on }); }
    if (on && F.day >= 60) { F.day = 0; F.cut = 1; }
  } });
  ctx.ui.button({ label: 'Replay', icon: 'replay', variant: 'ghost', parent: controls, onClick: () => goFree({ scen: owner === 'free' ? F.scen : SS.scen, day: 0, cut: 1 }, { play: !ctx.reducedMotion }) });
  const releaseBtn = ctx.ui.button({ label: 'Release the PD-1 brake', variant: 'primary', parent: controls, onClick: () => {
    released = true;
    goFree({ scen: 'release', day: 35, cut: 1 });
    ctx.announce('PD-1 brake released at day 35. The burst of new T cells comes from the stem-like reserve.');
  } });
  const removeBtn = ctx.ui.button({ label: 'Remove the stem-like reserve, then try again', parent: controls, onClick: () => {
    goFree({ scen: 'noreserve', day: 35, cut: ctx.reducedMotion ? 1 : 0 });
    ctx.announce('Stem-like reserve removed, then the PD-1 brake released: only a small, brief effect.');
  } });
  let stepIndex = 0;
  function paintButtons() {
    const scen = owner === 'free' ? F.scen : stepIndex === 0 ? 'acute' : 'chronic';
    releaseBtn.el.hidden = scen === 'acute';
    removeBtn.el.hidden = !released || scen === 'acute';
  }

  // ------------------------------------------------------------------ stepper
  const stepper = ctx.ui.stepper({
    steps,
    reset: buildScene,
    onChange(i) {
      owner = 'stepper';
      stepIndex = i;
      loop.pause();
      if (i === 4) released = true;     // step 5 releases the brake once: the second button appears
      seg.set(i === 0 ? 'acute' : 'chronic');
      paintButtons();
      paintLegend(i);
      render(SS);
    },
    onComplete() { controls.hidden = false; paintButtons(); paintLegend(4); },
  });
  void playBtn;

  ctx.onResize(({ compact }) => {
    const want = compact ? 'compact' : 'wide';
    if (want === layoutName) return;
    layoutName = want;
    stepper.rebuild();
    render(owner === 'free' ? F : SS);
  });

  // Final polish (S2): stage → stepper → caption stay together; the marks legend and the cell-card
  // hint come right after the caption, before the free controls.
  ctx.controls.prepend(legendEl, card.el);
  card.el.classList.add('ex5-card');

  return {
    destroy() { ambients.forEach((t) => t.kill()); },
  };
}
