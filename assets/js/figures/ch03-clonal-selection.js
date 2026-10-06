// ch03-clonal-selection — "Select, copy, remember"
//
// One dark stage, two linked panels:
//   LEFT  a lymph-node field (art lymphNodeField + a canvas crowd of ~300 B cells, each
//         wearing its own receptor notch, art tcrKey). Germ pieces arrive, the few cells
//         whose notch fits are selected, they photocopy themselves into clones, some become
//         plasma cells that shower the germ with antibodies, ~95% die, memory remains; a
//         second exposure is faster and bigger; a different germ starts from scratch.
//   RIGHT a dark-native two-panel chart (shared/chart.js, theme 'stage-dark'): measured
//         killer-T-cell numbers in mice (log) over a stylized germ/antibody panel, with a
//         playhead synced to the field's day counter, and the data-source disclosure line
//         ON the stage (FIGURE-AUDIT §7.4).
//
// Stepper-safe by construction: every step tweens ONE plain number, S.u (story time), plus
// SVG attributes with the same eases. The canvas is a pure function of S.u (and of an
// ambient drift clock that never changes meaning), so Back / dot jumps / reduced motion land
// in identical states. Story time: u = day of the first exposure (0–60); u = 100 + day for
// germ A's return (99–100 = "months or years later"); u = 200 + day for germ B.
import {
  bCell, plasmaCell, dendriticCell, virus, bacterium, antibody, tcrKey, epitopeKey,
  lymphNodeField, cellInfo, el, PALETTE, mix, WHITE, drawSprite,
} from '../art/index.js';
import { rng, spriteStates, createEffects, contactRing, killSpecks } from './shared/agents.js';
import { C, scale, chartRoot, axis, line, band, axisBreak, directLabel } from './shared/chart.js';

const ID = 'ch03-clonal-selection';
const DISCLOSURE = 'The field shows B cells, which make antibodies; its cell counts are illustrative. The measured count is of killer T cells in mice (Blattman 2002), which expand the same way. The pathogen-and-antibody chart is stylized; antibody timing from human vaccine data (Pollard & Bijker 2021).';

// Receptor notches (art tcrKey seeds). The three germ-A epitopes and two germ-B epitopes are
// carried by exactly one founder cell each; nobody else wears these notches.
const KEYS_A = [5, 17, 29];
const KEYS_B = [11, 38];
const KEY_TOTAL = 46;

// ------------------------------------------------------------------ data (chart)
// Measured: LCMV-infected mice, all CD8 T cells specific for one viral epitope (Blattman 2002):
// ~150 naive precursors → ~10^7 at day 8 → ~5×10^5 memory by day ~30, then stable.
const T1 = [[0, 150], [1, 165], [2, 420], [3, 2100], [4, 1.2e4], [5, 7e4], [6, 4e5], [7, 2.5e6], [8, 1e7], [9, 9e6], [10, 7e6],
  [12, 4e6], [15, 2e6], [20, 1e6], [25, 6.5e5], [30, 5e5], [45, 5e5], [60, 5e5]];
// Stylized second exposure: from the memory level, faster to a modestly higher peak.
const T2 = [[0, 5e5], [1, 9e5], [2, 3.5e6], [3, 1.3e7], [4, 2.6e7], [5, 3e7], [6, 2.7e7], [8, 1.8e7], [12, 8e6], [18, 3.5e6], [24, 2.2e6], [30, 2e6]];
// Stylized germ B: a first response again, from ~150.
const TB = T1.filter((p) => p[0] <= 30);
// Illustrative germ and antibody curves (arbitrary units, 0–1.4).
const G1 = [[0, 0], [1, 0.1], [2, 0.28], [3, 0.5], [4, 0.72], [5, 0.88], [6, 0.96], [7, 0.95], [8, 0.85], [9, 0.66], [10, 0.43], [11, 0.2], [12, 0.04], [13, 0], [60, 0]];
const AB1 = [[0, 0], [5, 0], [6, 0.015], [7, 0.05], [8, 0.11], [10, 0.3], [12, 0.52], [14, 0.69], [17, 0.8], [20, 0.79], [25, 0.66], [30, 0.53], [40, 0.37], [50, 0.29], [60, 0.26]];
const G2 = [[0, 0], [1, 0.09], [2, 0.18], [3, 0.19], [4, 0.1], [5, 0.01], [6, 0], [30, 0]];
const AB2 = [[0, 0.26], [1, 0.27], [2, 0.32], [3, 0.52], [4, 0.82], [5, 1.04], [6, 1.17], [8, 1.27], [10, 1.25], [15, 1.1], [20, 0.96], [30, 0.82]];
const GB = G1.filter((p) => p[0] <= 30).concat([[30, 0]]);
const ABB = AB1.filter((p) => p[0] <= 30);
const ILL = 0.55;          // "enough pathogen to make you ill" threshold (illustrative units)

// ------------------------------------------------------------------ layouts
const LAYOUTS = {
  wide: { W: 600, H: 600, top: 0, nBy: 250, r: 5.5, minD: 23, sp: 9, dcR: 23, gR: 6.5, abS: 7, nG1: 16, nG2: 7, nGB: 14, drift: 5.5 },
  compact: { W: 380, H: 446, top: 34, nBy: 165, r: 5, minD: 19.5, sp: 7.8, dcR: 18, gR: 6, abS: 6.5, nG1: 12, nG2: 6, nGB: 11, drift: 4 },
};
// Cluster centers in oval units (x, y ∈ −1…1): germ-A clones grow in the three follicles near the
// rim (B cells multiply in follicles), germ-B clones lower down.
const CENTERS = [[-0.62, -0.25], [0, -0.66], [0.62, -0.25], [-0.36, 0.4], [0.4, 0.38]];

// Primary response (germ A first time, germ B): day of selection per founder, division
// generations, plasma cells, contraction, memory. Secondary (germ A again) is faster.
const P = {
  sel: [1.3, 1.95, 2.55], selB: [1.55, 2.35],
  gen0: 3.25, genGap: 0.8, pinch: 0.34, move: 0.9, n: 40,
  plasma: [8.15, 9.9], plasmaFrac: 0.3, flight: 1.05, leave: [10.6, 12.4], leaveDur: 3,
  die: [11, 26.5], diePlasma: [13, 19.5], dw: 3, mem: [23.5, 29.5], memN: 6, memMove: 4,
};
const P2 = {
  ring: [0.25, 0.85], toSlot: [0.8, 1.45], gen0: 1.3, genGap: 0.5, pinch: 0.22, move: 0.6, n: 54,
  plasma: [2.0, 2.95], plasmaFrac: 0.35, flight: 0.8, leave: [4.6, 6], leaveDur: 2.2,
  die: [7, 20.5], diePlasma: [7.5, 13], dw: 3, mem: [17, 22.5], memNewN: 3, memMove: 4,
};

// ------------------------------------------------------------------ helpers
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => { const x = clamp(t, 0, 1); return x * x * (3 - 2 * x); };
const ramp = (v, a, b) => smooth((v - a) / (b - a));
const TAU = Math.PI * 2;
const GOLD = Math.PI * (3 - Math.sqrt(5));
const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
const pow10 = (v) => `10${String(Math.round(Math.log10(v))).split('').map((c) => SUP[c]).join('')}`;

/** Interpolate a [[x, y]] series (log-linear when `log`). */
function at(series, x, log = false) {
  if (x <= series[0][0]) return series[0][1];
  for (let i = 1; i < series.length; i++) {
    const [x1, y1] = series[i];
    if (x <= x1) {
      const [x0, y0] = series[i - 1];
      const t = (x - x0) / (x1 - x0 || 1);
      return log ? 10 ** lerp(Math.log10(y0), Math.log10(y1), t) : lerp(y0, y1, t);
    }
  }
  return series[series.length - 1][1];
}
function cellsText(v) {
  if (v >= 1e6) { const m = v / 1e6; return `${m >= 9.5 ? Math.round(m) : (Math.round(m * 2) / 2).toFixed(m < 1.95 ? 1 : 1).replace(/\.0$/, '')} million`; }
  if (v >= 1000) { const p = 10 ** (Math.floor(Math.log10(v)) - 1); return (Math.round(v / p) * p).toLocaleString('en-US'); }
  return String(Math.round(v / 10) * 10);
}
const dayA1 = (u) => (u < 99 ? clamp(u, 0, 60) : 60);
const dayA2 = (u) => (u < 99 ? -1e9 : u < 199 ? u - 100 : 30);
const dayB1 = (u) => (u < 199 ? -1e9 : u - 200);

// ------------------------------------------------------------------ composite sprites (library art only)
/** A B cell wearing its receptor notch (art tcrKey tip) on top; `mem` adds the memory ring + "M". */
function bKeyCell({ key = 0, seed = 1, r = 5.5, mem = false, stage = 'dark' } = {}) {
  const k = key ?? seed - 1;
  const g = el('g');
  g.append(bCell({ r, seed: 1 + (k % 4), stage, detail: 'low', receptors: false }));
  const ks = r * 1.75;
  const tip = tcrKey({ key: k, form: 'tip', size: ks, color: 'bCell', stage });
  tip.setAttribute('transform', `translate(0 ${(-r - ks * 0.12).toFixed(2)})`);
  g.append(tip);
  if (mem) {
    const c = mix(PALETTE.bCell, WHITE, 0.55);
    g.append(el('circle', { r: r + 2.7, fill: 'none', stroke: c, 'stroke-width': 0.95, 'stroke-opacity': 0.95 }));
    const m = el('g', { transform: `translate(${(r + 3.3).toFixed(2)} ${(r + 1.7).toFixed(2)})` });
    m.append(el('circle', { r: 3.7, fill: '#0B1024', stroke: c, 'stroke-width': 0.75 }));
    m.append(el('path', { d: 'M-1.9 1.55V-1.5L0 0.65L1.9 -1.5V1.55', fill: 'none', stroke: c, 'stroke-width': 0.95, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }));
    g.append(m);
  }
  return g;
}
/** "It fits": the clone's receptor notch with the germ's epitope plug seated in it (rule 13). */
function fitIcon({ key = 0, size = 13, stage = 'dark' } = {}) {
  const g = el('g');
  const rec = tcrKey({ key, size, color: 'bCell', stage, detail: 'high' });
  const ep = epitopeKey({ key, size, facing: 'down', stage });
  ep.setAttribute('transform', `translate(0 ${rec.dataset.dockY})`);
  rec.append(ep);
  rec.setAttribute('transform', `translate(0 ${(size * 0.55).toFixed(2)})`);
  g.append(rec);
  return g;
}
/** Germ A: a virus particle showing its three epitopes (hot-pink plugs, art epitopeKey). */
function germAPiece({ r = 6.5, plug = 1.2, stage = 'dark', seed = 2 } = {}) {
  const g = el('g');
  g.append(virus({ r, seed, spikes: 10, stage }));
  KEYS_A.forEach((key, i) => {
    const p = epitopeKey({ key, size: r * plug, facing: 'up', stage, glow: false });
    p.setAttribute('transform', `rotate(${i * 120}) translate(0 ${(-r * 1.02).toFixed(2)})`);
    g.append(p);
  });
  return g;
}
/** Germ B: a rod bacterium showing its two epitopes. */
function germBPiece({ r = 7, plug = 1.05, stage = 'dark', seed = 2 } = {}) {
  const g = el('g');
  g.append(bacterium({ r, seed, angle: 0, stage }));
  KEYS_B.forEach((key, i) => {
    const p = epitopeKey({ key, size: r * plug, facing: 'up', stage, glow: false });
    p.setAttribute('transform', `rotate(${i ? 180 : 0}) translate(${(-r * 0.25).toFixed(2)} ${(-r * 0.42).toFixed(2)})`);
    g.append(p);
  });
  return g;
}

// ------------------------------------------------------------------ CSS
const CSS = `
[data-figure="${ID}"] .cs-wrap { position: relative; z-index: 1; display: grid; grid-template-columns: 55fr 45fr; width: 100%; }
[data-figure="${ID}"] .cs-field { position: relative; aspect-ratio: 1 / 1; min-width: 0; }
[data-figure="${ID}"] .cs-field > svg, [data-figure="${ID}"] .cs-field > canvas { position: absolute; inset: 0; width: 100%; height: 100%; }
[data-figure="${ID}"] .cs-field > .cs-ov { pointer-events: none; }
[data-figure="${ID}"] .cs-chart { position: relative; min-width: 0; display: flex; flex-direction: column; padding: 14px 18px 16px 4px; }
[data-figure="${ID}"] .cs-chart > svg { position: relative; display: block; width: 100%; flex: 1 1 0; min-height: 0; overflow: visible; }
[data-figure="${ID}"] .cs-disclosure { margin: 8px 0 0; padding-left: 10px; font: 400 12.5px/1.5 var(--font-ui); color: var(--fg-2); text-wrap: pretty; max-width: 60ch; }
[data-figure="${ID}"].is-compact .cs-wrap, [data-figure="${ID}"] .cs-wrap.is-compact { grid-template-columns: 1fr; }
[data-figure="${ID}"] .cs-wrap.is-compact .cs-chart { padding: 6px 12px 14px 4px; }
[data-figure="${ID}"] .cs-wrap.is-compact .cs-chart > svg { flex: none; }
[data-figure="${ID}"] .fig__controls > .cs-disclosure { flex-basis: 100%; margin: 0; padding: 0; color: var(--ink-3); font-size: 13px; }
[data-figure="${ID}"] .cs-bg text, [data-figure="${ID}"] svg .cs-card .t-caps { font-size: calc(12.5px * var(--u, 1)); }
[data-figure="${ID}"] svg .t-small { font-size: max(13px, calc(13px * var(--u, 1))); }
[data-figure="${ID}"] svg .cs-cnt { font-weight: 700; font-variant-numeric: tabular-nums; fill: var(--fg); }
[data-figure="${ID}"] svg .cs-ptitle { font-weight: 640; }
[data-figure="${ID}"] svg .cs-playhead { stroke: var(--fg-2); stroke-width: 1; vector-effect: non-scaling-stroke; stroke-dasharray: 2 3; }
[data-figure="${ID}"] svg .cs-card-bg { fill: rgb(11 16 36 / 0.72); stroke: rgb(233 236 246 / 0.16); stroke-width: 1; vector-effect: non-scaling-stroke; }
[data-figure="${ID}"] svg .cs-arrow { fill: none; stroke: var(--fg-2); stroke-width: 1.4; vector-effect: non-scaling-stroke; stroke-linecap: round; stroke-linejoin: round; }
`;
function injectCSS() {
  if (document.getElementById(`${ID}-css`)) return;
  document.head.append(Object.assign(document.createElement('style'), { id: `${ID}-css`, textContent: CSS }));
}

// ====================================================================== mount
export default async function mount(fig, ctx) {
  injectCSS();
  const { gsap } = ctx;
  const S = { u: 0 };                 // story time — the ONLY state the steps drive for the canvas

  // ---------------------------------------------------------------- DOM
  const wrap = ctx.h('div', { class: 'cs-wrap' });
  const fieldBox = ctx.h('div', { class: 'cs-field' });
  const chartBox = ctx.h('div', { class: 'cs-chart' });
  wrap.append(fieldBox, chartBox);
  ctx.stage.append(wrap);
  ctx.setAspect('auto');
  const bgSvg = ctx.createSVG({ parent: fieldBox, viewBox: '0 0 600 600', className: 'cs-bg' });
  const cv = ctx.canvas({ parent: fieldBox });
  const ovSvg = ctx.createSVG({ parent: fieldBox, viewBox: '0 0 600 600', className: 'cs-ov' });
  const chSvg = ctx.createSVG({ parent: chartBox, viewBox: '0 0 500 520', className: 'cs-ch', interactive: true, label: 'Chart: steps 1 to 5 show killer T cells in mice (measured, log scale) over 60 days; steps 6 and 7 compare pathogen and antibody levels (illustrative) after a first and a second exposure' });
  const disclosure = ctx.h('p', { class: 'cs-disclosure', text: DISCLOSURE });
  chartBox.append(disclosure);

  const clock = ctx.ui.clock({ value: 'Before infection' });
  ctx.tag('Time compressed');
  ctx.tag('Illustrative');

  // ---------------------------------------------------------------- world (rebuilt per layout)
  let LY = null;          // current layout constants
  let layoutName = '';
  let W = 600;
  let H = 600;
  let oval = null;        // lymphNodeField info
  let world = null;       // agents & schedules
  let sheet = null;       // sprite sheet for this layout
  let E = {};             // SVG elements the steps animate
  let chartGeo = null;
  let amb = 0;            // ambient drift clock (seconds); frozen under reduced motion
  const fxTmp = createEffects();

  const OP = (nx, ny) => [oval.cx + nx * oval.rx, oval.cy + ny * oval.ry];

  async function loadSprites(L) {
    const st = 'dark';
    const defs = {
      b: { kind: bKeyCell, params: { r: L.r, stage: st }, seeds: KEY_TOTAL },
      plasma: { kind: plasmaCell, params: { r: L.r * 1.5, detail: 'low', secreting: false, stage: st }, seeds: 3 },
      dc: { kind: dendriticCell, params: { r: L.dcR, state: 'mature', stage: st }, seeds: 3 },
      gA: [germAPiece, { r: L.gR, stage: st, seed: 2 }],
      gB: [germBPiece, { r: L.gR + 0.6, stage: st, seed: 2 }],
      ab: [antibody, { size: L.abS, anchor: 'center', stage: st, seed: 1 }],
    };
    [...KEYS_A, ...KEYS_B].forEach((key) => {
      defs[`m${key}`] = [bKeyCell, { key, r: L.r, mem: true, stage: st, seed: 1 }];
      defs[`fit${key}`] = [fitIcon, { key, size: 17, stage: st, seed: 1 }];
    });
    return spriteStates(defs);
  }

  // ---------------------------------------------------------------- schedule
  function buildWorld(L) {
    const R = rng(31);
    const r = L.r;
    // Bystanders: Poisson-disc homes inside the oval, away from the founders.
    const centers = CENTERS.map(([x, y]) => OP(x, y));
    const homes = [];
    const ok = (x, y) => {
      if (!oval.inside(x, y) || Math.hypot((x - oval.cx) / oval.rx, (y - oval.cy) / oval.ry) > 0.93) return false;
      for (const c of centers) if (Math.hypot(x - c[0], y - c[1]) < L.minD * 1.1) return false;
      for (const h of homes) if (Math.abs(h[0] - x) < L.minD && Math.hypot(h[0] - x, h[1] - y) < L.minD) return false;
      return true;
    };
    for (let tries = 0; homes.length < L.nBy && tries < L.nBy * 120; tries++) {
      const x = R.range(oval.cx - oval.rx, oval.cx + oval.rx); const y = R.range(oval.cy - oval.ry, oval.cy + oval.ry);
      if (ok(x, y)) homes.push([x, y]);
    }
    const free = Array.from({ length: KEY_TOTAL }, (_, i) => i).filter((k) => !KEYS_A.includes(k) && !KEYS_B.includes(k));
    const by = homes.map(([hx, hy], i) => ({
      hx, hy, key: free[(i * 7 + (i >> 2)) % free.length],
      p1: R.range(0, TAU), p2: R.range(0, TAU), f1: R.range(0.09, 0.2), f2: R.range(0.08, 0.19), amp: L.drift * R.range(0.6, 1.2),
    }));

    // Clones
    const cells = [];
    const clones = [];
    const slotsFor = (cx, cy, n, sp) => Array.from({ length: n }, (_, k) => {
      const rad = sp * Math.sqrt(k + 0.15) * 1.02; const a = k * GOLD + 0.6;
      return [cx + Math.cos(a) * rad, cy + Math.sin(a) * rad];
    });
    const assign = (list, slots, firstFree) => {
      // daughters take the free slot nearest their parent (local "photocopying")
      const used = new Set(Array.from({ length: firstFree }, (_, i) => i));
      const order = list.filter((c) => c.parent).sort((a, b) => a.born - b.born);
      for (const c of order) {
        const pp = c.parent.slotFor;
        let best = -1; let bd = Infinity;
        slots.forEach((s, i) => { if (used.has(i)) return; const d = Math.hypot(s[0] - pp[0], s[1] - pp[1]); if (d < bd) { bd = d; best = i; } });
        used.add(best);
        c.slotFor = slots[best];
      }
    };
    // A memory "home" spread around a center (golden-angle rings).
    const memSpread = (cx, cy, n, r0, r1, seed) => Array.from({ length: n }, (_, j) => {
      const rad = lerp(r0, r1, Math.sqrt((j + 0.5) / n)); const a = j * GOLD * 1.0 + seed;
      return [cx + Math.cos(a) * rad, cy + Math.sin(a) * rad];
    });
    const kOf = (W / 600);

    function primary(cloneIx, key, ep, tSel) {
      const [cx, cy] = centers[cloneIx];
      const Rc = rng(100 + cloneIx * 17 + (ep === 'B1' ? 7 : 0));
      const n = P.n;
      const slots = slotsFor(cx, cy, n, L.sp);
      const list = [];
      const off = cloneIx % 3 * 0.12;
      for (let k = 0; k < n; k++) {
        const g = k === 0 ? 0 : Math.floor(Math.log2(k)) + 1;
        const parent = k === 0 ? null : list[k - 2 ** (g - 1)];
        const born = k === 0 ? -1e9 : P.gen0 + off + (g - 1) * P.genGap + Rc.range(0, P.genGap * 0.42);
        const c = { ep, clone: cloneIx, key, variant: key, parent, born, kids: [], slotFor: k === 0 ? [cx, cy] : null, rot: Rc.range(0, TAU), id: `${ep}-${cloneIx}-${k}` };
        if (parent) parent.kids.push(c);
        list.push(c);
      }
      if (ep !== 'A2') list[0].tSel = tSel;
      assign(list, slots, 1);
      // fates
      const idx = list.map((_, i) => i);
      const h = idx.map((i) => Rc());
      // memory: founder + five spread-out survivors born early enough to be settled
      const memIx = [0, ...idx.filter((i) => i > 0 && i < 32).sort((a, b) => h[a] - h[b]).slice(0, P.memN - 1)];
      const plasmaPool = idx.filter((i) => i >= 4 && !memIx.includes(i)).sort((a, b) => h[b] - h[a]);
      const plasmaIx = plasmaPool.slice(0, Math.round(n * P.plasmaFrac));
      const leaveIx = plasmaIx.slice(0, 2);
      const memPos = memSpread(cx, cy, memIx.length, 10 * kOf + L.r, 30 * kOf + L.sp * 2.2, cloneIx * 1.7);
      list.forEach((c, i) => {
        const pl = plasmaIx.includes(i);
        if (pl) c.plasmaAt = Rc.range(P.plasma[0], P.plasma[1]);
        if (leaveIx.includes(i)) { c.leaveAt = Rc.range(P.leave[0], P.leave[1]); }
        const mi = memIx.indexOf(i);
        if (mi >= 0) { c.memAt = Rc.range(P.mem[0], P.mem[1]); c.memPos = memPos[mi]; c.memState = `m${key}`; }
        else if (!c.leaveAt) c.dieAt = pl ? Rc.range(P.diePlasma[0], P.diePlasma[1]) : Rc.range(P.die[0], P.die[1]);
        c.prm = P;
      });
      cells.push(...list);
      return list;
    }

    const cloneA = KEYS_A.map((key, i) => primary(i, key, 'A1', P.sel[i]));
    const cloneB = KEYS_B.map((key, i) => primary(3 + i, key, 'B1', P.selB[i]));

    // Second exposure of germ A: the six memory cells per clone respond, divide faster.
    const cloneA2 = cloneA.map((list, ci) => {
      const key = KEYS_A[ci];
      const [cx, cy] = centers[ci];
      const Rc = rng(400 + ci * 13);
      const mems = list.filter((c) => c.memAt != null);
      const m = mems.length;
      const n = P2.n;
      const slots = slotsFor(cx, cy, n, L.sp);
      const arr = [];
      mems.forEach((c, j) => {
        c.a2 = { ringAt: Rc.range(P2.ring[0], P2.ring[1]), slot: slots[j], kids: [], memAt: Rc.range(P2.mem[0], P2.mem[1]) };
        arr.push({ ref: c, slotFor: slots[j], born: -1e9, kids: c.a2.kids, a2ref: true });
      });
      for (let k = m; k < n; k++) {
        const g = Math.floor(Math.log2(k / m)) + 1;
        const parent = arr[k - m * 2 ** (g - 1)];
        const born = P2.gen0 + (g - 1) * P2.genGap + Rc.range(0, P2.genGap * 0.45);
        const c = { ep: 'A2', clone: ci, key, variant: key, parent, born, kids: [], slotFor: null, rot: Rc.range(0, TAU), id: `A2-${ci}-${k}` };
        parent.kids.push(c);
        arr.push(c);
      }
      assign(arr, slots, m);
      const fresh = arr.slice(m);
      const h = fresh.map(() => Rc());
      const ids = fresh.map((_, i) => i);
      const memNew = ids.filter((i) => fresh[i].born < 2.6).sort((a, b) => h[a] - h[b]).slice(0, P2.memNewN);
      const plasmaIx = ids.filter((i) => !memNew.includes(i)).sort((a, b) => h[b] - h[a]).slice(0, Math.round(fresh.length * P2.plasmaFrac));
      const leaveIx = plasmaIx.slice(0, 2);
      const memPos2 = memSpread(cx, cy, m + memNew.length, 10 * kOf + L.r, 34 * kOf + L.sp * 2.6, ci * 1.3 + 0.9);
      mems.forEach((c, j) => { c.a2.memPos = memPos2[j]; });
      fresh.forEach((c, i) => {
        const pl = plasmaIx.includes(i);
        if (pl) c.plasmaAt = Rc.range(P2.plasma[0], P2.plasma[1]);
        if (leaveIx.includes(i)) c.leaveAt = Rc.range(P2.leave[0], P2.leave[1]);
        const mi = memNew.indexOf(i);
        if (mi >= 0) { c.memAt = Rc.range(P2.mem[0], P2.mem[1]); c.memPos = memPos2[m + mi]; c.memState = `m${key}`; }
        else if (!c.leaveAt) c.dieAt = pl ? Rc.range(P2.diePlasma[0], P2.diePlasma[1]) : Rc.range(P2.die[0], P2.die[1]);
        c.prm = P2;
      });
      cells.push(...fresh);
      return { mems, fresh };
    });
    // split points for daughters (parent's slot ± pinch offset toward the daughter's slot)
    const splitInit = (c) => {
      const pp = c.parent.slotFor;
      const ang = Math.atan2(c.slotFor[1] - pp[1], c.slotFor[0] - pp[0]);
      c.ang = ang;
      c.sx0 = pp[0] + Math.cos(ang) * r * 0.75 * 2; c.sy0 = pp[1] + Math.sin(ang) * r * 0.75 * 2;
    };
    cells.forEach((c) => { if (c.parent) splitInit(c); });
    cloneA.forEach((l) => l.forEach((c) => { c.slot = c.slotFor; }));
    cloneB.forEach((l) => l.forEach((c) => { c.slot = c.slotFor; }));
    cloneA2.forEach(({ fresh }) => fresh.forEach((c) => { c.slot = c.slotFor; }));

    // Germ pieces, dendritic cells and antibodies, per episode.
    const exitPt = OP(0.97, 0.12);
    const entry = (Rg) => { const a = Math.PI + Rg.range(-0.7, 0.7); return [oval.cx + Math.cos(a) * oval.rx * 1.02, oval.cy + Math.sin(a) * oval.ry * 1.02]; };
    function pieces(ep, n, kind, entryWin, clearWin, touches, seed) {
      const Rg = rng(seed);
      const list = [];
      for (let i = 0; i < n; i++) {
        const t = touches[i];
        let from = entry(Rg); let to; let entryAt;
        if (t) {
          const a = Rg.range(-2.4, -0.7);
          to = [t.at[0] + Math.cos(a) * (L.r + L.gR + 1.5), t.at[1] + Math.sin(a) * (L.r + L.gR + 1.5)];
          entryAt = t.time - 1.25;
          const aa = Math.atan2(to[1] - oval.cy, to[0] - oval.cx);
          from = Math.cos(aa) < 0 ? from : [oval.cx - oval.rx * 1.02, to[1]];
        } else {
          let p;
          for (let k = 0; k < 40; k++) { p = OP(Rg.range(-0.75, 0.55), Rg.range(-0.55, 0.75)); if (oval.inside(p[0], p[1])) break; }
          to = p;
          entryAt = lerp(entryWin[0], entryWin[1], (i + Rg()) / n);
        }
        list.push({ ep, kind, from, to, entryAt, clearAt: Rg.range(clearWin[0], clearWin[1]), w1: Rg.range(0.25, 0.5), w2: Rg.range(0.2, 0.45), p1: Rg.range(0, TAU), p2: Rg.range(0, TAU), wa: Rg.range(10, 22) * (W / 600), rot: Rg.range(0, TAU), spin: Rg.range(-0.3, 0.3), abs: [] });
      }
      return list;
    }
    const fA = cloneA.map((l) => l[0]); const fB = cloneB.map((l) => l[0]);
    // founders 0 and 2 meet free-drifting pieces; founder 1 meets a dendritic cell
    const piecesA1 = pieces('A1', L.nG1, 'gA', [0.2, 4.6], [9.4, 12.0], { 0: { at: fA[0].slot, time: P.sel[0] }, 1: { at: fA[2].slot, time: P.sel[2] } }, 51);
    const piecesA2 = pieces('A2', L.nG2, 'gA', [0.05, 1.0], [3.7, 4.95], {}, 52);
    const piecesB1 = pieces('B1', L.nGB, 'gB', [0.2, 4.6], [9.4, 12.0], { 0: { at: fB[0].slot, time: P.selB[0] } }, 53);
    const dcAt = (f, a) => [f.slot[0] + Math.cos(a) * (L.dcR * 0.86 + L.r), f.slot[1] + Math.sin(a) * (L.dcR * 0.86 + L.r)];
    const dcs = [
      { ep: 'A1', carry: 'gA', enterAt: P.sel[1] - 1.2, from: OP(-1.05, -0.5), rest: dcAt(fA[1], Math.PI * 0.82), leaveAt: 12.5, variant: 0 },
      { ep: 'A1', carry: 'gA', enterAt: 0.35, from: OP(-1.05, 0.1), rest: OP(-0.42, 0.06), leaveAt: 12.8, variant: 1 },
      { ep: 'A1', carry: 'gA', enterAt: 1.6, from: OP(-1.05, 0.45), rest: OP(-0.05, 0.34), leaveAt: 13.2, variant: 2 },
      { ep: 'A2', carry: 'gA', enterAt: 0.1, from: OP(-1.05, 0), rest: OP(-0.3, 0.05), leaveAt: 5.5, variant: 1 },
      { ep: 'B1', carry: 'gB', enterAt: P.selB[1] - 1.2, from: OP(-1.05, 0.55), rest: dcAt(fB[1], Math.PI * 1.1), leaveAt: 12.5, variant: 2 },
      { ep: 'B1', carry: 'gB', enterAt: 0.5, from: OP(-1.05, -0.1), rest: OP(-0.2, -0.05), leaveAt: 12.8, variant: 0 },
    ];
    // antibodies: three per piece, from the episode's plasma cells
    const abs = [];
    function shower(pcs, lists, flight, seed) {
      const Ra = rng(seed);
      const plasma = lists.flat().filter((c) => c.plasmaAt != null).sort((a, b) => a.plasmaAt - b.plasmaAt);
      pcs.forEach((pc, i) => {
        [1.05, 0.62, 0.22].forEach((lead, j) => {
          const arrive = pc.clearAt - lead;
          const emit = arrive - flight;
          const ready = plasma.filter((c) => c.plasmaAt + 0.3 <= emit);
          const src = ready.length ? ready[(i * 3 + j * 7) % ready.length] : plasma[(i + j) % plasma.length];
          const a = { piece: pc, src, emit: Math.max(emit, src.plasmaAt + 0.15), arrive, stick: pc.rot + j * 2.1 + Ra.range(-0.3, 0.3), bend: Ra.range(-0.35, 0.35) };
          abs.push(a); pc.abs.push(a);
        });
      });
    }
    shower(piecesA1, cloneA, P.flight, 61);
    shower(piecesA2, cloneA2.map((x) => x.fresh), P2.flight, 62);
    shower(piecesB1, cloneB, P.flight, 63);

    return {
      by, cells, cloneA, cloneB, cloneA2, centers, exitPt, dcs, abs,
      pieces: [...piecesA1, ...piecesA2, ...piecesB1],
      founders: [...fA, ...fB],
      radius: new Float32Array(5),
    };
  }

  // ---------------------------------------------------------------- per-frame state
  const out = { x: 0, y: 0, state: 'b', variant: 0, alpha: 1, dying: 0, pinch: null, r: 5, scale: 1, rotation: 0 };
  const pinchObj = { p: 0, angle: 0, gap: 0.75 };

  /** Position + look of a clone cell in its own episode at local day d (false = not visible). */
  function episodeState(c, d, o) {
    const pr = c.prm;
    if (d < c.born) return false;
    if (c.dieAt != null && d >= c.dieAt + pr.dw) return false;
    if (c.leaveAt != null && d >= c.leaveAt + pr.leaveDur) return false;
    let x; let y;
    if (c.parent) {
      const k = smooth((d - c.born) / pr.move);
      x = lerp(c.sx0, c.slot[0], k); y = lerp(c.sy0, c.slot[1], k);
    } else { x = c.slot[0]; y = c.slot[1]; }
    o.pinch = null;
    o.alpha = 1; o.dying = 0; o.rotation = 0; o.scale = 1;
    // dividing: pinch toward the coming daughter, then ease back after the split
    for (const kid of c.kids) {
      if (d >= kid.born - pr.pinch && d < kid.born) {
        pinchObj.p = clamp((d - (kid.born - pr.pinch)) / pr.pinch, 0.0001, 1); pinchObj.angle = kid.ang;
        o.pinch = pinchObj; break;
      }
      if (d >= kid.born && d < kid.born + 0.3) {
        const k = 1 - smooth((d - kid.born) / 0.3);
        x -= Math.cos(kid.ang) * LY.r * 0.75 * k; y -= Math.sin(kid.ang) * LY.r * 0.75 * k;
      }
    }
    o.state = 'b'; o.variant = c.variant; o.blend = 0; o.blendState = null;
    if (c.plasmaAt != null && d >= c.plasmaAt) {
      o.blend = smooth((d - c.plasmaAt) / 0.5); o.blendState = 'plasma';
    }
    if (c.leaveAt != null && d >= c.leaveAt) {
      const k = (d - c.leaveAt) / pr.leaveDur;
      const e = world.exitPt;
      const mx = (x + e[0]) / 2; const my = Math.min(y, e[1]) - 30 * (W / 600);
      const t = smooth(k);
      x = (1 - t) * (1 - t) * x + 2 * (1 - t) * t * mx + t * t * e[0];
      y = (1 - t) * (1 - t) * y + 2 * (1 - t) * t * my + t * t * e[1];
      o.alpha = 1 - ramp(k, 0.78, 1);
    }
    if (c.memAt != null && d >= c.memAt) {
      const k = smooth((d - c.memAt) / pr.memMove);
      x = lerp(x, c.memPos[0], k); y = lerp(y, c.memPos[1], k);
      o.blend = smooth((d - c.memAt) / 1.2); o.blendState = c.memState;
    }
    if (c.dieAt != null && d >= c.dieAt) o.dying = clamp((d - c.dieAt) / pr.dw, 0.0001, 1);
    o.x = x; o.y = y;
    return true;
  }
  /** A first-exposure memory cell during germ A's return (and afterwards). */
  function a2State(c, u, o) {
    const a = c.a2;
    const d = dayA2(u);
    o.pinch = null; o.alpha = 1; o.dying = 0; o.rotation = 0; o.scale = 1; o.variant = c.variant;
    let x = c.memPos[0]; let y = c.memPos[1];
    o.state = 'b'; o.blend = 1; o.blendState = c.memState;
    if (d >= P2.toSlot[0]) {
      const k = smooth((d - P2.toSlot[0]) / (P2.toSlot[1] - P2.toSlot[0]));
      x = lerp(x, a.slot[0], k); y = lerp(y, a.slot[1], k);
      o.blend = 1 - smooth((d - 0.95) / 0.4);
    }
    for (const kid of a.kids) {
      if (d >= kid.born - P2.pinch && d < kid.born) {
        pinchObj.p = clamp((d - (kid.born - P2.pinch)) / P2.pinch, 0.0001, 1); pinchObj.angle = kid.ang;
        o.pinch = pinchObj; break;
      }
      if (d >= kid.born && d < kid.born + 0.25) {
        const k = 1 - smooth((d - kid.born) / 0.25);
        x -= Math.cos(kid.ang) * LY.r * 0.75 * k; y -= Math.sin(kid.ang) * LY.r * 0.75 * k;
      }
    }
    if (d >= a.memAt) {
      const k = smooth((d - a.memAt) / P2.memMove);
      x = lerp(x, a.memPos[0], k); y = lerp(y, a.memPos[1], k);
      o.blend = smooth((d - a.memAt) / 1.2);
    }
    o.x = x; o.y = y;
    return true;
  }
  /** Ring (selected / responding) strength and the "match" tag for founders and memory cells. */
  function ringOf(c, u) {
    if (c.ep === 'A1' && c.tSel != null && u < 99) {
      const d = dayA1(u);
      if (d < c.tSel) return null;
      return { t0: c.tSel, d, a: 1 - ramp(d, 3.4, 4.1), tag: true };
    }
    if (c.ep === 'B1' && c.tSel != null) {
      const d = dayB1(u);
      if (d < c.tSel) return null;
      return { t0: c.tSel, d, a: 1 - ramp(d, 3.4, 4.1), tag: true };
    }
    if (c.a2 && u >= 99 && u < 199) {
      const d = dayA2(u);
      if (d < c.a2.ringAt) return null;
      return { t0: c.a2.ringAt, d, a: 1 - ramp(d, 1.7, 2.3), tag: false };
    }
    return null;
  }

  function piecePos(pc, d, o) {
    if (d < pc.entryAt) return false;
    const k = (d - pc.entryAt) / 1.25;
    let x; let y;
    if (k < 1) { const t = smooth(k); x = lerp(pc.from[0], pc.to[0], t); y = lerp(pc.from[1], pc.to[1], t); }
    else {
      const s = d - pc.entryAt - 1.25; const g = smooth(s / 1.5);
      x = pc.to[0] + g * pc.wa * Math.sin(pc.w1 * s + pc.p1) - g * pc.wa * Math.sin(pc.p1);
      y = pc.to[1] + g * pc.wa * Math.sin(pc.w2 * s + pc.p2) - g * pc.wa * Math.sin(pc.p2);
    }
    o.x = x; o.y = y;
    o.alpha = smooth((d - pc.entryAt) / 0.3) * (1 - ramp(d, pc.clearAt, pc.clearAt + 0.6));
    o.rotation = pc.rot + pc.spin * d;
    return o.alpha > 0.01;
  }
  const dayOfEp = (ep, u) => (ep === 'A1' ? dayA1(u) : ep === 'A2' ? dayA2(u) : dayB1(u));
  const epLive = (ep, u) => (ep === 'A1' ? u < 99 : ep === 'A2' ? u >= 99 && u < 199 : u >= 199);

  // ---------------------------------------------------------------- render
  const P1 = { x: 0, y: 0 };
  const rp = { x: 0, y: 0, r: 5, state: 'b', variant: 0, alpha: 1, dying: 0, pinch: null, scale: 1, rotation: 0 };
  const deathFx = new Map();
  const cellPos = [];         // per frame [cell, x, y] for the bystander push

  function dimOf(u) {
    if (u < 99) return ramp(u, 3, 3.8) * (1 - 0.35 * ramp(u, 32, 50));
    if (u < 199) return 0.65 + 0.35 * ramp(u, 100.6, 101.2);
    return 0.65 + 0.35 * ramp(u, 200.8, 201.6);
  }

  function render() {
    if (!world || !sheet) return;
    const g = cv.g;
    const u = S.u;
    const s = cv.width / W;
    g.setTransform(cv.dpr * s, 0, 0, cv.dpr * s, 0, 0);
    g.clearRect(0, 0, W, H);
    const tm = amb;
    const r = LY.r;

    // 1) clone cells → positions (also the cluster radii that push bystanders aside)
    cellPos.length = 0;
    const rad = world.radius; rad.fill(0);
    for (const c of world.cells) {
      let okk = false;
      if (c.ep === 'A1') { if (u < 99) okk = episodeState(c, dayA1(u), out); else if (c.a2) okk = a2State(c, u, out); }
      else if (c.ep === 'A2') { if (u >= 99) okk = episodeState(c, dayA2(u), out); }
      else if (u >= 199) okk = episodeState(c, dayB1(u), out);
      if (!okk) continue;
      const wob = 0.35 * r;
      const x = out.x + wob * Math.sin(0.5 * tm + c.rot * 3); const y = out.y + wob * Math.cos(0.43 * tm + c.rot * 5);
      const ctr = world.centers[c.clone];
      const leaving = c.leaveAt != null && dayOfEp(c.ep, u) >= c.leaveAt;
      if (!out.dying && !leaving) rad[c.clone] = Math.max(rad[c.clone], Math.min(Math.hypot(x - ctr[0], y - ctr[1]), 75 * (W / 600)) + r * 1.6);
      cellPos.push([c, x, y, out.state, out.variant, out.alpha, out.dying, out.pinch ? { ...out.pinch } : null, out.blend, out.blendState]);
    }

    // 2) dendritic cells (behind the lymphocytes)
    for (const dc of world.dcs) {
      if (!epLive(dc.ep, u)) continue;
      const d = dayOfEp(dc.ep, u);
      if (d < dc.enterAt) continue;
      const k = smooth((d - dc.enterAt) / 1.2);
      const a = smooth((d - dc.enterAt) / 0.35) * (1 - ramp(d, dc.leaveAt, dc.leaveAt + 1.6));
      if (a <= 0.01) continue;
      const x = lerp(dc.from[0], dc.rest[0], k) + 1.5 * Math.sin(0.4 * tm + dc.variant);
      const y = lerp(dc.from[1], dc.rest[1], k) + 1.5 * Math.cos(0.33 * tm + dc.variant);
      rp.x = x; rp.y = y; rp.state = 'dc'; rp.variant = dc.variant; rp.alpha = a; rp.dying = 0; rp.pinch = null; rp.scale = 1; rp.rotation = 0.15 * Math.sin(0.2 * tm + dc.variant) + dc.variant;
      sheet.draw(g, rp);
      rp.x = x + LY.dcR * 0.5; rp.y = y - LY.dcR * 0.45; rp.state = dc.carry; rp.variant = 0; rp.scale = 0.8; rp.rotation = 0.3 * tm;
      sheet.draw(g, rp);
    }

    // 3) bystanders (dimmed while clones respond; pushed aside by growing clusters)
    const dim = dimOf(u);
    rp.state = 'b'; rp.dying = 0; rp.pinch = null; rp.scale = 1; rp.rotation = 0;
    rp.alpha = 0.92 - 0.6 * dim;
    for (const b of world.by) {
      let x = b.hx + b.amp * Math.sin(b.f1 * tm + b.p1);
      let y = b.hy + b.amp * Math.sin(b.f2 * tm + b.p2);
      for (let ci = 0; ci < 5; ci++) {
        const R0 = rad[ci]; if (!R0) continue;
        const c = world.centers[ci];
        const dx = x - c[0]; const dy = y - c[1]; const dd = Math.hypot(dx, dy) || 1;
        const need = R0 + r * 1.2;
        if (dd < need) { const push = need - dd; x += (dx / dd) * push; y += (dy / dd) * push; }
      }
      rp.x = x; rp.y = y; rp.variant = b.key;
      sheet.draw(g, rp);
    }

    // 4) germ pieces + stuck antibodies
    for (const pc of world.pieces) {
      if (!epLive(pc.ep, u)) continue;
      const d = dayOfEp(pc.ep, u);
      if (!piecePos(pc, d, P1)) continue;
      rp.x = P1.x; rp.y = P1.y; rp.state = pc.kind; rp.variant = 0; rp.alpha = P1.alpha; rp.rotation = P1.rotation; rp.scale = 1;
      sheet.draw(g, rp);
      for (const ab of pc.abs) {
        if (d < ab.arrive) continue;
        const rr = LY.gR + LY.abS * 0.55;
        rp.x = P1.x + Math.cos(ab.stick) * rr; rp.y = P1.y + Math.sin(ab.stick) * rr;
        rp.state = 'ab'; rp.rotation = ab.stick - Math.PI / 2; rp.alpha = P1.alpha;
        sheet.draw(g, rp);
      }
    }

    // 5) clone cells (B cell → plasma / memory crossfades, pinches, deaths)
    for (const [c, x, y, state, variant, alpha, dying, pinch, blend, blendState] of cellPos) {
      rp.x = x; rp.y = y; rp.dying = dying; rp.pinch = pinch; rp.scale = 1; rp.rotation = 0;
      if (blend < 1) { rp.state = state; rp.variant = variant; rp.alpha = alpha * (1 - (blend || 0)); sheet.draw(g, rp); }
      if (blend > 0 && blendState) {
        rp.state = blendState; rp.variant = (c.rot * 100) | 0; rp.alpha = alpha * blend; rp.pinch = null;
        rp.rotation = blendState === 'plasma' ? c.rot : 0;
        sheet.draw(g, rp);
      }
      if (dying > 0) {
        let e = deathFx.get(c);
        if (!e) { e = killSpecks(fxTmp, { x, y, r: r * 1.1 }, { color: PALETTE.bCell, seed: c.id.length * 31 + Math.round(x) }); fxTmp.clear(); deathFx.set(c, e); }
        e.x = x; e.y = y; e.t = dying * e.life;
        e.draw(g, e);
      }
    }

    // 6) antibodies in flight (plasma cell → germ piece)
    rp.state = 'ab'; rp.pinch = null; rp.dying = 0; rp.scale = 1;
    for (const ab of world.abs) {
      if (!epLive(ab.piece.ep, u)) continue;
      const d = dayOfEp(ab.piece.ep, u);
      if (d < ab.emit || d >= ab.arrive) continue;
      if (!piecePos(ab.piece, d, P1)) continue;
      const k = smooth((d - ab.emit) / (ab.arrive - ab.emit));
      const sx = ab.src.slot[0]; const sy = ab.src.slot[1];
      const tx = P1.x + Math.cos(ab.stick) * (LY.gR + LY.abS * 0.55); const ty = P1.y + Math.sin(ab.stick) * (LY.gR + LY.abS * 0.55);
      const nx = -(ty - sy); const ny = tx - sx;
      const bend = ab.bend * Math.sin(Math.PI * k);
      rp.x = lerp(sx, tx, k) + nx * bend * 0.25; rp.y = lerp(sy, ty, k) + ny * bend * 0.25;
      rp.rotation = Math.atan2(ty - sy, tx - sx) + Math.PI / 2;
      rp.alpha = smooth(k / 0.15);
      sheet.draw(g, rp);
    }

    // 7) selection rings + "match" tags
    const fs = 13 / s;
    for (const [c, x, y] of cellPos) {
      const rg = ringOf(c, u);
      if (!rg) continue;
      const p = (rg.d - rg.t0) / 0.8;
      if (p < 1) {
        const e = contactRing(fxTmp, x, y, { color: mix(PALETTE.bCell, WHITE, 0.25), r: r * 2.1, core: true }); fxTmp.clear();
        e.t = clamp(p, 0, 1) * e.life; e.draw(g, e);
      }
      if (rg.a > 0.01) {
        g.save();
        g.globalAlpha = rg.a * smooth(p * 2);
        g.strokeStyle = mix(PALETTE.bCell, WHITE, 0.55);
        g.lineWidth = 1.4;
        g.beginPath(); g.arc(x, y - r * 0.2, r * 2.05, 0, TAU); g.stroke();
        if (rg.tag) {
          const ix = x + r * 2.4 + 8; const iy = y - r * 2.4;
          drawFit(g, c.key, ix, iy);
          g.font = `650 ${fs}px Inter, system-ui, sans-serif`;
          g.textAlign = 'left'; g.textBaseline = 'middle';
          g.lineJoin = 'round'; g.lineWidth = 3.5 / s; g.strokeStyle = 'rgba(11,16,36,0.9)';
          g.strokeText('match', ix + 11, iy);
          g.fillStyle = '#F4F6FB';
          g.fillText('match', ix + 11, iy);
        }
        g.restore();
      }
    }
  }

  function drawFit(g, key, x, y) {
    const img = sheet.get(`fit${key}`, 0);
    if (img) drawSprite(g, img, x, y, {});
  }

  // ---------------------------------------------------------------- HUD + counter (derived from S.u)
  let lastHud = ''; let lastCount = '';
  function hudText(u) {
    if (u < 0.02) return 'Before infection';
    if (u < 99) return `Day ${Math.floor(Math.min(u, 60) + 1e-6)}`;
    if (u < 100) return 'Months or years later';
    if (u < 199) return `Day ${Math.floor(Math.min(u - 100, 30) + 1e-6)} · same pathogen`;
    if (u < 200) return 'Another time · a new pathogen';
    return `Day ${Math.floor(Math.min(u - 200, 30) + 1e-6)} · pathogen B`;
  }
  /** How many cells that fit the current germ are drawn in the field right now (alive, not leaving). */
  function matchCount(u) {
    let n = 0;
    for (const e of cellPos) {
      const ep = e[0].ep;
      const mine = u < 199 ? ep !== 'B1' : ep === 'B1';
      if (mine && !e[6] && e[5] > 0.5) n++;
    }
    return n;
  }
  function updateText() {
    const h = hudText(S.u);
    if (h !== lastHud) { lastHud = h; clock.set(h); }
    const n = String(matchCount(S.u));
    if (n !== lastCount) {
      lastCount = n;
      if (E.cntA) E.cntA.textContent = n;
      if (E.cntB) E.cntB.textContent = n;
    }
  }
  const frame = () => { render(); updateText(); };
  // Steps also repaint while the ambient loop is idle (reduced motion, or a stale visibility flag).
  let loop = null;
  const kick = () => { if (!loop || !loop.running) frame(); };

  // ---------------------------------------------------------------- field overlay (labels, germ cards)
  function T(parent, attrs) { return ctx.svg('text', attrs, parent); }
  function leaderLabel(parent, { x, y, to, text, sub, anchor = 'start' }) {
    const gl = ctx.svg('g', { opacity: 0 }, parent);
    if (to) {
      ctx.svg('line', { class: 'leader', x1: x + (anchor === 'end' ? 4 : -4), y1: y - 5, x2: to[0], y2: to[1] }, gl);
      ctx.svg('circle', { class: 'leader-dot', cx: to[0], cy: to[1], r: 2.2 }, gl);
    }
    T(gl, { class: `t-label t-halo${anchor === 'end' ? ' t-end' : anchor === 'middle' ? ' t-mid' : ''}`, x, y, text });
    if (sub) T(gl, { class: `t-small t-halo${anchor === 'end' ? ' t-end' : anchor === 'middle' ? ' t-mid' : ''}`, x, y: y + 17, text: sub });
    return gl;
  }
  // The card also counts the cells in the drawing that fit this germ (what the field shows).
  function germCard(parent, kind, x, y, sc = 1) {
    const gl = ctx.svg('g', { class: 'cs-card', opacity: 0, transform: `translate(${x} ${y}) scale(${sc})` }, parent);
    const w = 182; const h = 82;
    ctx.svg('rect', { class: 'cs-card-bg', x: 0, y: 0, width: w, height: h, rx: 10 }, gl);
    const art = kind === 'A' ? germAPiece({ r: 15, plug: 1.05, seed: 2 }) : germBPiece({ r: 17, plug: 0.95, seed: 2 });
    art.setAttribute('transform', `translate(32 ${h / 2 + 1})`);
    gl.append(art);
    T(gl, { class: 't-caps', x: 62, y: 24, text: kind === 'A' ? 'Pathogen A' : 'Pathogen B' });
    T(gl, { class: 't-small', x: 62, y: 43, text: kind === 'A' ? '3 different pieces' : '2 different pieces' });
    const cnt = T(gl, { class: 't-small', x: 62, y: 64 });
    const num = ctx.svg('tspan', { class: 'cs-cnt', text: kind === 'A' ? '3' : '2' }, cnt);
    ctx.svg('tspan', { text: ' cells fit it' }, cnt);
    if (kind === 'A') E.cntA = num; else E.cntB = num;
    lastCount = '';
    return gl;
  }

  function buildOverlay() {
    ovSvg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    ovSvg.replaceChildren(ovSvg.defs);
    const k = W / 600;
    const g = ctx.svg('g', {}, ovSvg);
    const compact = layoutName === 'compact';
    // fixed note
    T(g, { class: 't-small t-muted t-end', x: W - 8, y: H - 9, text: compact ? 'Only a few hundred B cells drawn' : 'Only a few hundred of the lymph node’s B cells are drawn.' });
    // step 1: every cell has its own receptor
    const target = world.by.reduce((best, b) => {
      const [tx, ty] = OP(0.05, 0.08);
      const d = Math.hypot(b.hx - tx, b.hy - ty);
      return !best || d < best.d ? { b, d } : best;
    }, null).b;
    E.lbReceptor = leaderLabel(g, compact   // phones: centred, so the two-line label never runs off the field's right edge
      ? { x: W / 2, y: target.hy - 40 * k, to: [target.hx + 2, target.hy - LY.r * 1.6], text: 'Each cell: its own receptor', sub: 'a random notch, made in advance', anchor: 'middle' }
      : { x: target.hx + 26 * k, y: target.hy - 36 * k, to: [target.hx + 2, target.hy - LY.r * 1.6], text: 'Each cell: its own receptor', sub: 'a random notch, made in advance' });
    // germ cards
    const cs = 1;
    E.cardA = germCard(g, 'A', compact ? 4 : 12, H - (compact ? 110 : 120), cs);
    E.cardB = germCard(g, 'B', compact ? 4 : 12, H - (compact ? 110 : 120), cs);
    // step 3: a clone
    const cA = world.centers[0];
    E.lbClone = leaderLabel(g, { x: cA[0] + 34 * k, y: cA[1] + 104 * k, to: [cA[0] + 14 * k, cA[1] + 52 * k], text: 'A clone', sub: 'copies of one selected cell' });
    // step 4: plasma cells + bone-marrow arrow
    const c1 = world.cloneA[1];
    const pl = c1.filter((c) => c.plasmaAt != null && !c.leaveAt).sort((a, b) => b.slot[1] - a.slot[1])[0];
    const cB = world.centers[1];
    E.lbPlasma = leaveLabelFor(g, pl, cB, k);
    const ex = world.exitPt;
    E.arrow = ctx.svg('g', { opacity: 0 }, g);
    const ax0 = ex[0] - 46 * k; const ay0 = ex[1] + 4 * k;
    ctx.svg('path', { class: 'cs-arrow', d: `M${ax0} ${ay0}L${ex[0] + 4} ${ex[1]}M${ex[0] - 4} ${ex[1] - 5}L${ex[0] + 4} ${ex[1]}L${ex[0] - 4} ${ex[1] + 5}` }, E.arrow);
    T(E.arrow, { class: 't-small t-halo t-end', x: ex[0] - 2, y: ex[1] + 22 * k, text: 'some plasma cells' });
    T(E.arrow, { class: 't-small t-halo t-end', x: ex[0] - 2, y: ex[1] + 22 * k + 16, text: '→ bone marrow' });
    // step 5: memory cells
    const m2 = world.cloneA[2].filter((c) => c.memAt != null).sort((a, b) => b.memPos[1] - a.memPos[1])[0];
    E.lbMemory = leaderLabel(g, { x: m2.memPos[0] - 30 * k, y: m2.memPos[1] + 52 * k, to: [m2.memPos[0], m2.memPos[1] + LY.r * 1.4], text: 'Memory cells', sub: 'more than the 3 that started', anchor: 'end' });
    // step 7: germ-A memory does not respond
    const m0 = world.cloneA[0].filter((c) => c.a2).sort((a, b) => b.a2.memPos[1] - a.a2.memPos[1])[0];
    E.lbNoResp = leaderLabel(g, { x: m0.a2.memPos[0] + 6 * k, y: m0.a2.memPos[1] + 58 * k, to: [m0.a2.memPos[0], m0.a2.memPos[1] + LY.r * 1.5], text: 'Pathogen A memory', sub: 'stays calm: no match' });
  }
  function leaveLabelFor(g, pl, center, k) {
    const to = [pl.slot[0], pl.slot[1] + LY.r * 1.2];
    return leaderLabel(g, { x: center[0] + 64 * k, y: center[1] + 92 * k, to, text: 'Plasma cells', sub: 'secrete antibodies' });
  }

  // ---------------------------------------------------------------- chart
  // ONE chart at a time (steps 1–5: the measured count; steps 6–7: germ and antibody,
  // first vs second exposure on one 0–30-day axis). The panels crossfade in step 6.
  function buildChart() {
    const compact = layoutName === 'compact';
    chSvg.style.height = '';
    const Wc = Math.max(280, Math.round(chSvg.clientWidth || chartBox.clientWidth - 22));
    const Hc = compact ? Math.round(clamp(Wc * 0.92, 320, 390)) : Math.max(360, Math.round(chSvg.clientHeight || 480));
    if (compact) chSvg.style.height = `${Hc}px`;
    chSvg.setAttribute('viewBox', `0 0 ${Wc} ${Hc}`);
    chSvg.replaceChildren(chSvg.defs);
    chSvg.defs.replaceChildren();
    const g = chartRoot(chSvg, { theme: 'stage-dark' });

    const padL = compact ? 46 : 52; const padR = compact ? 10 : 16;
    const x0 = padL; const x1 = Wc - padR;
    const yT = compact ? 24 : 30; const yS = yT + 20;
    const top = yS + (compact ? 34 : 42);
    const yBot = Hc - 46;
    const xsA = scale({ domain: [0, 60], range: [x0, x1] });
    const xsB = scale({ domain: [0, 30], range: [x0, x1] });
    const ys = scale({ type: 'log', domain: [10, 1e8], range: [yBot, top] });
    const yb = scale({ domain: [0, 1.4], range: [yBot, top + 18] });
    chartGeo = { xs1: xsA, xs2: xsB, x0, x1, top, yBot };
    const tColor = C.stroke('cd8');
    const pts = (series, xs, ysc) => series.map(([d, v]) => [xs(d), ysc(v)]);
    const dline = (gg, p, o, dash) => { const h = line(gg, p, o); h.path.setAttribute('stroke-dasharray', dash); h.path.setAttribute('stroke-linecap', dash.startsWith('0.') ? 'round' : 'butt'); return h; };
    const lab = (gg, o) => { const el2 = directLabel(gg, { className: 't-small', ...o }); el2.setAttribute('opacity', 0); return el2; };
    const clip = (id, x) => {
      const cp = ctx.svg('clipPath', { id }, chSvg.defs);
      return ctx.svg('rect', { x, y: 0, width: 0, height: Hc }, cp);
    };

    // ---- panel A · steps 1–5 · the measured count (log)
    const A = ctx.svg('g', {}, g);
    E.panelA = A;
    T(A, { class: 't-label cs-ptitle', x: 10, y: yT, text: 'Measured example: killer T cells in mice' });
    T(A, { class: 't-small', x: 10, y: yS, text: compact ? 'same expansion, one viral fragment' : 'the same expansion, counted for one viral fragment' });
    const decades = compact ? [10, 1e3, 1e5, 1e7] : [10, 100, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8];
    axis(A, { scale: ys, orient: 'left', at: x0, ticks: decades, format: pow10, grid: [x0, x1], line: false, tickSize: 0, labelOffset: 8 });
    axis(A, { scale: xsA, orient: 'bottom', at: yBot, ticks: compact ? [0, 20, 40, 60] : [0, 10, 20, 30, 40, 50, 60], tickSize: 4 });
    T(A, { class: 't-caps', x: x1, y: yBot + 38, 'text-anchor': 'end', text: 'Days after infection' });
    E.clip1x = x0 - 8;
    E.clip1 = clip(`${ID}-c1`, E.clip1x);
    const g1 = ctx.svg('g', { 'clip-path': `url(#${ID}-c1)` }, A);
    line(g1, pts(T1, xsA, ys), { curve: 'monotone', color: tColor, width: 2.8 });
    ctx.svg('circle', { cx: xsA(0), cy: ys(150), r: 4, style: `fill:${tColor}` }, g1);
    E.lbStart = lab(A, { x: xsA(0) + 4, y: ys(150) + 20, text: '≈150 at the start' });
    E.lbPeak = lab(A, { x: xsA(10.2), y: ys(1.6e7), text: '≈10 million', sub: 'by day 8' });
    E.lbMem = lab(A, { x: xsA(compact ? 26 : 30), y: ys(5e5) - 12, text: compact ? '≈500,000 remain' : '≈500,000 remain as memory' });
    E.play = ctx.svg('line', { class: 'cs-playhead', x1: xsA(0), x2: xsA(0), y1: top - 6, y2: yBot }, A);

    // ---- panel B · steps 6–7 · germ and antibody, first vs second time (illustrative)
    const B = ctx.svg('g', { opacity: 0 }, g);
    E.panelB = B;
    T(B, { class: 't-label cs-ptitle', x: 10, y: yT, text: 'Pathogen and antibody in the blood' });
    T(B, { class: 't-small', x: 10, y: yS, text: compact ? 'illustrative · faint lines: first exposure' : 'illustrative · faint lines: the first exposure' });
    // key row (outside the plot): the shaded band
    ctx.svg('rect', { x: 10, y: yS + 10, width: 16, height: 11, rx: 2, style: `fill:${C.stroke('virus')};fill-opacity:0.2;stroke:${C.stroke('virus')};stroke-opacity:0.5;stroke-dasharray:2 2` }, B);
    T(B, { class: 't-small', x: 32, y: yS + 20, text: 'shaded: enough pathogen to make you ill' });
    band(B, { x0, x1, y0: yb(ILL), y1: top + 18, color: C.stroke('virus'), opacity: 0.07 });
    ctx.svg('line', { class: 'ck-ref', x1: x0, x2: x1, y1: yb(ILL), y2: yb(ILL), style: `stroke:${C.stroke('virus')};stroke-opacity:0.45`, 'stroke-dasharray': '2 3' }, B);
    axis(B, { scale: xsB, orient: 'bottom', at: yBot, ticks: [0, 10, 20, 30], tickSize: 4 });
    ctx.svg('line', { class: 'ck-axis', x1: x0, x2: x0, y1: top + 12, y2: yBot }, B);
    T(B, { class: 't-caps', x: x1, y: yBot + 38, 'text-anchor': 'end', text: 'Days after the pathogen arrives' });
    // the first time, as a faint reference (not clipped)
    const ref = ctx.svg('g', { opacity: 0.38 }, B);
    E.ref = ref;
    const G1b = G1.filter((q) => q[0] <= 30); const AB1b = AB1.filter((q) => q[0] <= 30);
    dline(ref, pts(G1b, xsB, yb), { curve: 'monotone', color: C.stroke('virus'), width: 1.8 }, '6 4');
    dline(ref, pts(AB1b, xsB, yb), { curve: 'monotone', color: C.stroke('antibody'), width: 2.4 }, '0.5 4.5');
    // the second time (germ A again) and germ B, revealed by the playhead
    E.clip2x = x0 - 4;
    E.clip2 = clip(`${ID}-c2`, E.clip2x);
    E.clipB = clip(`${ID}-cb`, E.clip2x);
    const g2 = ctx.svg('g', { 'clip-path': `url(#${ID}-c2)` }, B);
    const gB = ctx.svg('g', { 'clip-path': `url(#${ID}-cb)` }, B);
    E.g2 = g2;
    dline(g2, pts(G2, xsB, yb), { curve: 'monotone', color: C.stroke('virus'), width: 2.2 }, '6 4');
    dline(g2, pts(AB2, xsB, yb), { curve: 'monotone', color: C.stroke('antibody'), width: 3 }, '0.5 4.5');
    dline(gB, pts(GB, xsB, yb), { curve: 'monotone', color: C.stroke('bacteria'), width: 2.2 }, '6 4');
    dline(gB, pts(ABB, xsB, yb), { curve: 'monotone', color: C.stroke('antibody'), width: 3 }, '0.5 4.5');
    E.lbA2 = lab(B, { x: x1, y: yb(compact ? 1.33 : 1.12), anchor: 'end', dx: 0, text: 'antibody, second time' });
    E.lbFast = lab(B, { x: xsB(4.6), y: yb(0.22) - 4, text: compact ? 'pathogen, second time' : 'pathogen, second time: cleared early', dx: 6 });
    E.lbGermB = lab(B, { x: xsB(7.4), y: yb(0.97) - 4, text: 'pathogen B: a first response', dx: 6 });
    E.playB = ctx.svg('line', { class: 'cs-playhead', x1: xsB(0), x2: xsB(0), y1: top + 12, y2: yBot }, B);
    ctx.refreshTextScale();
  }

  // ---------------------------------------------------------------- layout
  async function setLayout(name) {
    layoutName = name;
    LY = LAYOUTS[name];
    W = LY.W; H = LY.H;
    wrap.classList.toggle('is-compact', name === 'compact');
    // Phones: the data-source line moves under the caption (before the legend), so the stepper
    // sits right under the chart; it stays fully visible, never collapsed.
    if (name === 'compact') ctx.controls.prepend(disclosure); else chartBox.append(disclosure);
    fieldBox.style.aspectRatio = `${W} / ${H}`;
    bgSvg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    bgSvg.replaceChildren(bgSvg.defs);
    const field = lymphNodeField({ width: W, height: W, y: LY.top, seed: 4, stage: 'dark', label: true, density: name === 'compact' ? 0.8 : 1 });
    bgSvg.append(field);
    oval = cellInfo(field);
    world = buildWorld(LY);
    deathFx.clear();
    sheet = await loadSprites(LY);
  }

  // ---------------------------------------------------------------- steps
  const fadeIn = (tl, el2, at = 0, d = 0.6) => tl.fromTo(el2, { opacity: 0 }, { opacity: 1, duration: d, ease: 'power1.out' }, at);
  const fadeOut = (tl, el2, at = 0, d = 0.5, to = 0) => tl.fromTo(el2, { opacity: 1 }, { opacity: to, duration: d, ease: 'power1.in' }, at);
  /** Tween story time and the chart in lockstep (same ease, same duration). */
  function advance(tl, u0, u1, dur, pos, { ease = 'sine.inOut' } = {}) {
    tl.fromTo(S, { u: u0 }, { u: u1, duration: dur, ease, onUpdate: kick }, pos);
    const seg = (u) => (u < 99 ? 1 : u < 199 ? 2 : 3);
    const xOf = (u) => (u < 99 ? chartGeo.xs1(clamp(u, 0, 60)) : u < 199 ? chartGeo.xs2(clamp(u - 100, 0, 30)) : chartGeo.xs2(clamp(u - 200, 0, 30)));
    const sg = seg(u0);
    const xa = xOf(u0); const xb = xOf(u1);
    tl.fromTo(sg === 1 ? E.play : E.playB, { attr: { x1: xa, x2: xa } }, { attr: { x1: xb, x2: xb }, duration: dur, ease }, pos);
    const [clipEl, cx0] = sg === 1 ? [E.clip1, E.clip1x] : sg === 2 ? [E.clip2, E.clip2x] : [E.clipB, E.clip2x];
    tl.fromTo(clipEl, { attr: { width: Math.max(0, xa - cx0 + 4) } }, { attr: { width: Math.max(0, xb - cx0 + 4) }, duration: dur, ease }, pos);
  }

  const steps = [
    { // 1 · rest
      enter(tl) {
        tl.fromTo(S, { u: 0 }, { u: 0, duration: 0.01 }, 0);
        const w0 = chartGeo.xs1(0) - E.clip1x + 4;
        tl.fromTo(E.clip1, { attr: { width: w0 } }, { attr: { width: w0 }, duration: 0.01 }, 0);
        fadeIn(tl, E.lbReceptor, 0.2, 0.8);
        fadeIn(tl, E.lbStart, 0.4, 0.6);
      },
    },
    { // 2 · germ A arrives, three cells are selected
      enter(tl) {
        fadeOut(tl, E.lbReceptor, 0, 0.5);
        fadeIn(tl, E.cardA, 0.1, 0.7);
        advance(tl, 0, 3, 4.2, 0.1);
      },
    },
    { // 3 · expansion
      enter(tl) {
        advance(tl, 3, 8, 4.6, 0);
        fadeIn(tl, E.lbClone, 3.6, 0.7);
        fadeIn(tl, E.lbPeak, 4.0, 0.6);
      },
    },
    { // 4 · plasma cells, antibodies, germ cleared
      enter(tl) {
        fadeOut(tl, E.lbClone, 0, 0.4);
        advance(tl, 8, 14, 4.4, 0);
        fadeIn(tl, E.lbPlasma, 1.4, 0.7);
        fadeIn(tl, E.arrow, 2.6, 0.7);
      },
    },
    { // 5 · contraction and memory
      enter(tl) {
        fadeOut(tl, E.lbPlasma, 0, 0.4);
        fadeOut(tl, E.arrow, 0, 0.4);
        fadeOut(tl, E.cardA, 0.2, 0.6, 0.35);
        advance(tl, 14, 35, 4.0, 0, { ease: 'sine.in' });
        advance(tl, 35, 60, 1.3, 4.0, { ease: 'sine.out' });
        fadeIn(tl, E.lbMemory, 4.1, 0.7);
        fadeIn(tl, E.lbMem, 4.4, 0.6);
      },
    },
    { // 6 · germ A returns months or years later: the chart switches to germ and antibody
      enter(tl) {
        fadeOut(tl, E.lbMemory, 0, 0.4);
        tl.fromTo(E.panelA, { opacity: 1 }, { opacity: 0, duration: 0.6, ease: 'power1.in' }, 0.1);
        tl.fromTo(E.panelB, { opacity: 0 }, { opacity: 1, duration: 0.7, ease: 'power1.out' }, 0.6);
        tl.fromTo(E.clip2, { attr: { width: 0 } }, { attr: { width: 0 }, duration: 0.01 }, 0);
        tl.fromTo(E.cardA, { opacity: 0.35 }, { opacity: 1, duration: 0.6 }, 0.9);
        tl.fromTo(S, { u: 60 }, { u: 99, duration: 0.01, onUpdate: kick }, 0);
        tl.fromTo(S, { u: 99 }, { u: 100, duration: 1.1, ease: 'none', onUpdate: kick }, 0.01);
        advance(tl, 100, 130, 6.4, 1.15);
        fadeIn(tl, E.lbFast, 3.0, 0.6);
        fadeIn(tl, E.lbA2, 3.6, 0.6);
      },
    },
    { // 7 · a different germ starts from scratch
      enter(tl) {
        fadeOut(tl, E.cardA, 0, 0.5);
        fadeOut(tl, E.lbFast, 0, 0.4);
        fadeOut(tl, E.lbA2, 0, 0.4);
        tl.fromTo(E.clipB, { attr: { width: 0 } }, { attr: { width: 0 }, duration: 0.01 }, 0);
        tl.fromTo(E.g2, { opacity: 1 }, { opacity: 0.25, duration: 0.7 }, 0.1);
        fadeIn(tl, E.cardB, 0.4, 0.7);
        tl.fromTo(S, { u: 130 }, { u: 199, duration: 0.01, onUpdate: kick }, 0);
        tl.fromTo(E.playB, { attr: { x1: chartGeo.xs2(30), x2: chartGeo.xs2(30) } }, { attr: { x1: chartGeo.xs2(0), x2: chartGeo.xs2(0) }, duration: 0.8, ease: 'sine.inOut' }, 0.05);
        tl.fromTo(S, { u: 199 }, { u: 200, duration: 1.0, ease: 'none', onUpdate: kick }, 0.01);
        advance(tl, 200, 230, 6.4, 1.05);
        fadeIn(tl, E.lbNoResp, 1.6, 0.7);
        fadeIn(tl, E.lbGermB, 3.4, 0.6);
      },
    },
  ];

  function reset() {
    gsap.set(S, { u: 0 });
    buildOverlay();
    buildChart();
    amb = 0;
  }

  // ---------------------------------------------------------------- go
  const pickLayout = () => (ctx.compact ? 'compact' : 'wide');
  await setLayout(pickLayout());
  let stepper = null;
  loop = ctx.loop((dt) => { amb += dt; frame(); });
  stepper = ctx.ui.stepper({
    steps, reset,
    scene: wrap,
    phases: [
      { label: 'First exposure', short: 'First', steps: [0, 1, 2, 3, 4] },
      { label: 'Pathogen A again', short: 'Again', steps: [5] },
      { label: 'A new pathogen', short: 'New pathogen', steps: [6] },
    ],
    onChange: () => { frame(); },
  });
  ctx.ui.legend([
    { label: 'B cell (own receptor notch)', color: ctx.colors.bcell, shape: 'circle' },
    { label: 'Plasma cell', color: ctx.colors.bcell, shape: 'glow' },
    { label: 'Memory cell (M)', color: ctx.colors.bcell, shape: 'ring' },
    { label: 'Pathogen A (virus)', color: ctx.colors.virus, shape: 'circle' },
    { label: 'Pathogen B (bacterium)', color: ctx.colors.bacteria, shape: 'square' },
    { label: 'Dendritic cell', color: ctx.colors.dc, shape: 'glow' },
  ]);

  let busy = false;
  ctx.onResize(async () => {
    const want = pickLayout();
    if (busy) return;
    if (want !== layoutName) {
      busy = true;
      await setLayout(want);
      busy = false;
    }
    stepper.rebuild();
    frame();
  });
  frame();

  return {
    destroy() { loop.pause(); },
  };
}
