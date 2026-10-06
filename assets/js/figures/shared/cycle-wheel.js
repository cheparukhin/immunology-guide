// The cancer-immunity cycle wheel, shared by ch07-cycle, ch12-resistance and
// ch12-combinations (FIGURE-AUDIT §2B, §3). Owner: P5. API: docs/shared/cycle-wheel.md.
//
//   const wheel = createCycleWheel(ctx, parent, { size, density, layout, bands, flow, center, label });
//   wheel.selectStep(5); wheel.setStates([{ step: 5, state: 'broken' }]); wheel.ring([4], 'entersAt');
//
// Two layouts: a circle (≥ 540 px wide; labels outside the ring, status in the middle) and a
// tall oval (phones, locators; labels inside the loop, status under it). Everything the reader
// sees is redrawn from one state object, so layout and theme changes are lossless.
import { STEPS, BANDS, plainText } from './cycle-data.js';
import {
  tCell, cancerCell, dendriticCell, fibroblast, bloodVessel, synapse, placeAlong, tcr, mhc1,
  perforin, dangerSpark, setDying, cellInfo,
} from '../../art/index.js';

const NS = 'http://www.w3.org/2000/svg';
const COLORS = {
  crimson: '#E5484D', gold: '#F2B33D', green: '#3DDC97', pink: '#FF3D7F', blue: '#4C8DFF',
  violet: '#B65FD8', lymph: '#9FC3D9', blood: '#C9A9A6', halo: '#C9D3E8', lap: '#B65FD8',
};
const GLYPH_VARIANTS = { 6: ['hidden', 'self'] };
const STATE_WORDS = {
  weak: 'weak', broken: 'broken', skipped: 'not needed', replaced: 'engineered\nrecognition', repaired: 'repaired',
};
const BASE_SPEED = 0.42;        // steps per second at flow 1 (one lap ≈ 17 s)
const POOL = 30;
// Per-figure wheel counter (fallback when ctx.uid is missing): ids never depend on page load order.
const wheelCount = new WeakMap();

// ------------------------------------------------------------------ CSS (injected once)
const CSS = `
.cw { position: relative; width: 100%; margin-inline: auto; --cw-disc: #121A36; --cw-disc-2: #19224A; --cw-outline: rgb(169 177 204 / 0.75);
  --cw-track: rgb(169 177 204 / 0.38); --cw-crimson: #E5484D; --cw-crimson-ink: #FF7C80; --cw-gold: #F2B33D; --cw-green: #3DDC97; --cw-badge-ink: #0B1024; }
[data-stage="light"] .cw { --cw-disc: var(--surface); --cw-disc-2: var(--paper-2); --cw-outline: var(--rule-strong); --cw-track: var(--chart-axis);
  --cw-crimson-ink: var(--c-inhibit-deep, #C74044); --cw-badge-ink: var(--surface); }
.cw > svg { display: block; width: 100%; height: auto; overflow: hidden; -webkit-tap-highlight-color: transparent; }
.cw svg .cw-node { cursor: pointer; outline: none; }
.cw svg .cw-node__disc { fill: var(--cw-disc); stroke: var(--cw-outline); stroke-width: 1.5; transition: stroke var(--dur-2), stroke-width var(--dur-2); }
.cw svg .cw-node:hover .cw-node__disc { stroke: var(--fg-2); }
.cw svg .cw-node.is-selected .cw-node__disc { stroke: var(--fg); stroke-width: 2.4; }
.cw svg .cw-node__state { fill: none; stroke: none; stroke-width: 2.6; }
.cw svg .cw-node.is-broken .cw-node__state { stroke: var(--cw-crimson); }
.cw svg .cw-node.is-weak .cw-node__state { stroke: var(--cw-crimson); stroke-dasharray: 5.5 4; }
.cw svg .cw-node.is-skipped .cw-node__state { stroke: var(--fg-3); stroke-dasharray: 2.5 4; stroke-width: 1.6; }
.cw svg .cw-node.is-skipped .cw-node__disc { stroke: transparent; }
.cw svg .cw-node__inner { fill: none; stroke: none; stroke-width: 1.8; }
.cw svg .cw-node.is-replaced .cw-node__inner { stroke: var(--cw-gold); stroke-dasharray: 3 3; }
.cw svg .cw-node__art { transition: opacity var(--dur-3); }
.cw svg .cw-node.is-skipped .cw-node__art { opacity: 0.55; }
.cw svg .cw-badge { opacity: 0; transition: opacity var(--dur-2); }
.cw svg .cw-badge circle { stroke: var(--halo); stroke-width: 1.5; }
.cw svg .cw-node.is-broken .cw-badge--block, .cw svg .cw-node.has-break .cw-badge--block { opacity: 1; }
.cw svg .cw-node.has-break:not(.is-broken) .cw-badge--block { opacity: 0.55; }
.cw svg .cw-node.is-repaired .cw-badge--plus { opacity: 1; }
.cw svg .cw-gauge-track { fill: none; stroke: var(--grid); stroke-width: 2.4; }
.cw svg .cw-gauge { fill: none; stroke: var(--fg-2); stroke-width: 2.4; stroke-linecap: round; }
.cw svg .cw-gold { fill: none; stroke: var(--cw-gold); stroke-width: 2.6; opacity: 0; }
.cw svg .cw-gold--glow { stroke-width: 7; stroke-opacity: 0.22; }
.cw svg .cw-node.has-acts .cw-gold { opacity: 1; }
.cw svg .cw-node.has-also:not(.has-acts) .cw-gold { opacity: 0.85; stroke-width: 1.3; stroke-dasharray: 4 3; }
.cw svg .cw-node.has-also:not(.has-acts) .cw-gold--glow { opacity: 0; }
.cw svg .cw-node.has-enters .cw-gold { opacity: 1; }
.cw svg .cw-entry { opacity: 0; fill: none; stroke: var(--cw-gold); stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; }
.cw svg .cw-node.has-enters .cw-entry { opacity: 1; }
.cw svg .cw-joins { opacity: 0; fill: var(--cw-gold); }
.cw svg .cw-node.has-enters .cw-joins { opacity: 1; }
[data-stage="light"] .cw svg .cw-joins { fill: var(--c-drug-deep, #8D6A29); }
.cw svg .cw-art { transition: opacity var(--dur-3); }
.cw svg .cw-art:not(.cw-art--base) { opacity: 0; }
.cw svg .cw-node[data-glyph="hidden"] .cw-art--base, .cw svg .cw-node[data-glyph="self"] .cw-art--base { opacity: 0; }
.cw svg .cw-node[data-glyph="hidden"] .cw-art--hidden, .cw svg .cw-node[data-glyph="self"] .cw-art--self { opacity: 1; }
.cw svg .cw-count { opacity: 0; }
.cw svg .cw-node.has-count .cw-count { opacity: 1; }
.cw svg .cw-count circle { fill: var(--cw-gold); stroke: var(--halo); stroke-width: 1.5; }
.cw svg .cw-count text { fill: var(--cw-badge-ink); font-size: 11px; font-weight: 750; text-anchor: middle; }
.cw svg .cw-node__focus { fill: none; stroke: var(--stage-focus, #A3B2FF); stroke-width: 2; opacity: 0; }
.cw svg .cw-node:focus-visible .cw-node__focus { opacity: 1; }
.cw svg .cw-node__glow { opacity: 0; pointer-events: none; }
.cw svg .cw-label { font-weight: 560; pointer-events: none; }
.cw svg .cw-label .cw-num { fill: var(--fg-3); font-variant-numeric: tabular-nums; font-weight: 600; }
.cw svg .cw-labels .is-selected .cw-label { font-weight: 680; }
.cw svg .cw-labels .is-selected .cw-num { fill: var(--fg-2); }
.cw svg .cw-tag { font-size: max(13px, calc(12px * var(--u, 1))); font-weight: 620; pointer-events: none; }
.cw svg .cw-tag--weak, .cw svg .cw-tag--broken { fill: var(--cw-crimson-ink); }
.cw svg .cw-tag--skipped { fill: var(--fg-3); font-style: italic; font-weight: 520; }
.cw svg .cw-tag--replaced { fill: var(--cw-gold); }
.cw svg .cw-tag--repaired { fill: var(--cw-green); }
[data-stage="light"] .cw svg .cw-tag--replaced { fill: var(--c-drug-deep, #8D6A29); }
[data-stage="light"] .cw svg .cw-tag--repaired { fill: var(--c-activate-deep, #267E59); }
.cw svg .cw-arrow { fill: none; stroke: var(--cw-track); stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }
.cw svg .cw-arrow--loop { stroke-width: 2.2; }
.cw.is-rm svg .cw-arrow__line { stroke-dasharray: 0.5 6; stroke-width: 2.4; }
.cw svg .cw-dot { pointer-events: none; }
.cw.is-rm svg .cw-flow { display: none; }
.cw svg .cw-band-label { font-size: max(12px, calc(11px * var(--u, 1))); font-weight: 650; letter-spacing: 0.09em; fill: var(--fg-3); }
.cw svg .cw-boundary { stroke: var(--fg-3); stroke-opacity: 0.45; stroke-width: 1; stroke-dasharray: 1 5; stroke-linecap: round; fill: none; }
.cw svg .cw-center { font-size: max(17px, calc(14px * var(--u, 1))); font-weight: 640; fill: var(--fg); text-anchor: middle; letter-spacing: -0.005em; }
.cw svg .cw-center tspan + tspan { font-size: max(15px, calc(13px * var(--u, 1))); font-weight: 540; fill: var(--fg-2); }
.cw svg .cw-center.is-stalled tspan:first-child { fill: var(--cw-crimson-ink); }
.cw svg .cw-status { font-size: max(15px, calc(13px * var(--u, 1))); font-weight: 600; fill: var(--fg); text-anchor: middle; }
.cw svg .cw-status.is-stalled { fill: var(--cw-crimson-ink); }
@media (prefers-reduced-motion: reduce) { .cw svg .cw-node__disc, .cw svg .cw-badge, .cw svg .cw-node__art, .cw svg .cw-art { transition: none; } }
`;
function injectCSS() {
  if (document.getElementById('cw-style')) return;
  const s = document.createElement('style');
  s.id = 'cw-style';
  s.textContent = CSS;
  document.head.append(s);
}

// ------------------------------------------------------------------ small helpers
const mod = (x, m = 7) => ((x % m) + m) % m;
const r1 = (v) => Math.round(v * 10) / 10;
function el(tag, attrs = {}, parent) {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) if (v != null) e.setAttribute(k, String(v));
  if (parent) parent.append(e);
  return e;
}
const G = (attrs, parent) => el('g', attrs, parent);
const at = (node, x, y, s = 1, rot = 0) => { const g = G({ transform: `translate(${r1(x)} ${r1(y)})${rot ? ` rotate(${rot})` : ''}${s !== 1 ? ` scale(${s})` : ''}` }); g.append(node); return g; };

/**
 * Ellipse track. Node k sits at angle angles[k-1] (degrees from the top, clockwise) and at
 * position k − 1; positions between nodes map linearly to arc length, so any node spacing works.
 */
function makeTrack(cx, cy, rx, ry, angles) {
  const N = 1440;
  const pts = [];
  const cum = [0];
  for (let i = 0; i <= N; i++) {
    const th = (i / N) * Math.PI * 2;
    pts.push([cx + rx * Math.sin(th), cy - ry * Math.cos(th)]);
    if (i) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  }
  const total = cum[N];
  const nodeS = angles.map((a) => cum[Math.round((mod(a, 360) / 360) * N)]);
  nodeS.push(total + nodeS[0]);
  const seg = (k) => nodeS[k] - nodeS[k - 1];                 // length of segment k (node k → k+1)
  const atS = (sArc) => {
    const s = mod(sArc, total);
    let lo = 0, hi = N;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (cum[m] <= s) lo = m; else hi = m; }
    const f = (s - cum[lo]) / (cum[hi] - cum[lo] || 1);
    const x = pts[lo][0] + (pts[hi][0] - pts[lo][0]) * f;
    const y = pts[lo][1] + (pts[hi][1] - pts[lo][1]) * f;
    let tx = pts[hi][0] - pts[lo][0], ty = pts[hi][1] - pts[lo][1];
    const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
    let nx = (x - cx) / (rx * rx), ny = (y - cy) / (ry * ry);
    const nl = Math.hypot(nx, ny) || 1; nx /= nl; ny /= nl;
    return { x, y, tx, ty, nx, ny };
  };
  const sOf = (p) => { const q = mod(p); const k = Math.floor(q); return nodeS[k] + (q - k) * seg(k + 1); };
  return { at: (p) => atS(sOf(p)), seg: (k) => seg(((k - 1) % 7) + 1), total, unit: total / 7 };
}

// ------------------------------------------------------------------ geometry per layout
function geometry(layout) {
  if (layout === 'circle') {
    return { layout, W: 680, H: 612, cx: 340, cy: 306, rx: 184, ry: 184, nodeR: 31, labelMode: 'outside', centerInside: true,
      angles: STEPS.map((_, i) => (i * 360) / 7) };
  }
  if (layout === 'mini') {
    // Small locators (~240–330 px): step numbers only (names in aria-labels and the tap tooltip).
    return { layout, W: 340, H: 384, cx: 170, cy: 154, rx: 100, ry: 100, nodeR: 23, labelMode: 'number', centerInside: false,
      statusY: 340, angles: STEPS.map((_, i) => (i * 360) / 7) };
  }
  // Oval (phones, locators): flattened sides give the inside labels room; 4 and 5 sit low
  // with their labels underneath, 1 on top with its label above.
  return { layout, W: 380, H: 556, cx: 190, cy: 256, rx: 150, ry: 194, nodeR: 25, labelMode: 'inside', centerInside: false,
    statusY: 528, angles: [0, 61, 119, 160, 200, 241, 299] };
}

// ------------------------------------------------------------------ node glyphs (art library)
// Drawn in a frame of radius 31, scaled to the node radius by the caller.
function glyph(n, stage, variant = null) {
  const g = G({});
  const add = (node, x, y, s, rot) => g.append(at(node, x, y, s, rot));
  if (n === 1) {                       // release: a dying cancer cell spills hot-pink antigen + a danger spark
    const c = cancerCell({ r: 15, seed: 3, stage, mhc: 0 });
    try { setDying(c, 0.45, { seed: 2 }); } catch { /* older art lib */ }
    add(c, -5, 3);
    for (const [x, y, r] of [[11, -12, 3.1], [17, -4, 2.5], [19, -16, 2.2], [7, -20, 2.3], [22, 5, 1.9]]) {
      el('circle', { cx: x, cy: y, r, fill: COLORS.pink }, g);
    }
    add(dangerSpark({ size: 9, stage }), 14, 13);
  } else if (n === 2) {                // presentation: a mature dendritic cell with pink peptides on its dendrites
    add(dendriticCell({ r: 27, state: 'mature', seed: 2, stage }), 0, 0);
  } else if (n === 3) {                // priming: copies of an activated killer in a lymph-node pocket
    el('ellipse', { rx: 27, ry: 20, fill: 'rgba(159,195,217,0.10)', stroke: 'rgba(159,195,217,0.42)', 'stroke-width': 1 }, g);
    for (const [x, y, r, s] of [[-10, -6, 8.5, 3], [10, -5, 8.5, 3], [0, 10, 8.5, 3]]) {
      add(tCell({ variant: 'cd8', r, state: 'activated', seed: s, stage, polarity: 0 }), x, y);
    }
  } else if (n === 4) {                // trafficking: a killer in a blood vessel, flowing
    add(bloodVessel({ length: 84, width: 38, wall: 5, rbc: 3, seed: 2, stage }), 0, 0, 1, -20);
    add(tCell({ variant: 'cd8', r: 8, state: 'activated', seed: 6, stage, polarity: -20 }), 2, -1);
  } else if (n === 5) {                // infiltration: a killer squeezing through a gap in a wall of fibroblasts
    const wall = stage === 'light' ? 'rgba(120,110,100,0.55)' : 'rgba(214,196,170,0.34)';
    for (const dx of [-12, -7, -2, 3, 8]) {               // collagen fibres, parted around the gap
      el('path', { d: `M${dx} -31 C${dx + 2} -20 ${dx - 2} -14 ${dx * 0.4} -9 M${dx * 0.4} 9 C${dx - 2} 14 ${dx + 2} 20 ${dx} 31`, fill: 'none', stroke: wall, 'stroke-width': 1.1 }, g);
    }
    for (const [x, y, s, a] of [[-6, -20, 2, 84], [3, -19, 7, 96], [-5, 20, 5, 96], [4, 19, 9, 84]]) add(fibroblast({ r: 12, angle: a, seed: s, stage }), x, y);
    add(tCell({ variant: 'cd8', r: 8.5, state: 'activated', seed: 6, stage, polarity: 0 }), 3, 0);
  } else if (n === 6) {                // recognition: TCR meets MHC-I holding a hot-pink neoantigen
    // variant 'hidden': the shop window is shut, so the cup is ABSENT (never an empty cup; FIGURE-AUDIT §4.3)
    // variant 'self': the cup holds only a sand self-peptide (nothing new to see)
    const s = synapse({ width: 62, gap: 38, thickness: 5, depth: 10, stage });
    const info = cellInfo(s) || { topY: -19, bottomY: 19 };
    placeAlong(s, (o) => tcr({ ...o }), { x0: 0, x1: 0, y: info.topY, count: 1, facing: 'down', size: 18, stage });
    if (variant !== 'hidden') placeAlong(s, (o) => mhc1({ ...o, peptide: variant === 'self' ? 'self' : 'neo' }), { x0: 0, x1: 0, y: info.bottomY, count: 1, size: 18, stage });
    add(s, 0, 0);
  } else if (n === 7) {                // killing: a docked killer, perforin pores in the cancer cell
    add(cancerCell({ r: 15, seed: 8, stage, mhc: 0 }), 8, 0);
    add(tCell({ variant: 'cd8', r: 9, state: 'activated', seed: 2, stage, polarity: 0 }), -17, 0);
    for (const [x, y] of [[-4, -6], [-5, 5], [0, -13]]) add(perforin({ view: 'top', size: 7, stage }), x, y);
  }
  return g;
}

// ------------------------------------------------------------------ the component
export function createCycleWheel(ctx, parent, opts = {}) {
  injectCSS();
  const {
    size = 600, density = 'full', layout: layoutOpt = 'auto', bands = true, flow: flowOpt = 1,
    center: centerOpt = true, label: groupLabel = 'The cancer-immunity cycle',
  } = opts;
  const locator = density === 'locator';
  const gsap = ctx.gsap;
  const id = typeof ctx.uid === 'function'
    ? ctx.uid('cw')
    : (() => { const n = (wheelCount.get(ctx) || 0) + 1; wheelCount.set(ctx, n); return `${ctx.id}-cw-${n}`; })();

  const root = ctx.h('div', { class: 'cw', dataset: { density } });
  root.style.maxWidth = `${size}px`;
  parent.append(root);

  // ---- state (the single source for every redraw)
  const S = {
    selected: null,
    states: STEPS.map((s) => ({ step: s.n, state: 'ok', strength: null, broken: false, tag: null, glyph: null })),
    rings: { acts: [], also: [], entersAt: [] },          // [{ step, count }]
    halo: null,
    center: null,                                           // null = auto
    flow: flowOpt === false ? 0 : Math.max(0, Math.min(1, Number(flowOpt) || 0)),
    seedPos: 0,
  };
  const stepFns = new Set();
  const layoutFns = new Set();
  let geo = null;
  let svg = null;
  let track = null;
  let N = {};                                               // drawn parts
  let width = 0;
  let destroyed = false;
  const rm = () => ctx.reducedMotion;

  // ------------------------------------------------------------ draw
  function chooseLayout(w) {
    if (['circle', 'oval', 'mini'].includes(layoutOpt)) return layoutOpt;
    if (w < 330) return 'mini';
    return locator || w < 540 ? 'oval' : 'circle';
  }

  function draw() {
    if (destroyed) return;
    const lay = chooseLayout(width || root.clientWidth || size);
    geo = geometry(lay);
    const { W, H, cx, cy, rx, ry, nodeR, layout } = geo;
    track = makeTrack(cx, cy, rx, ry, geo.angles);
    const stage = ctx.artStage;
    const focusedStep = svg?.contains(document.activeElement) ? Number(document.activeElement.dataset?.step) || null : null;
    svg?.remove();
    svg = ctx.createSVG({ viewBox: `0 0 ${W} ${H}`, parent: root, interactive: true, label: groupLabel, className: 'cw__svg' });
    root.style.aspectRatio = `${W} / ${H}`;
    root.classList.toggle('is-rm', rm());
    N = { nodes: [], labels: [], arrows: [], dots: [] };

    // gradients
    const defs = svg.defs;
    const grad = (stops, attrs) => {
      const gid = `${id}-g${defs.childElementCount}`;
      const gr = el('radialGradient', { id: gid, ...attrs }, defs);
      for (const [o, c, a] of stops) el('stop', { offset: o, 'stop-color': c, 'stop-opacity': a }, gr);
      return `url(#${gid})`;
    };
    const R = rx * (layout === 'circle' ? 1.55 : 1.24);     // tints fade out before the SVG's edges
    const ell = { gradientUnits: 'userSpaceOnUse', cx, cy, r: r1(R), gradientTransform: `translate(${cx} ${cy}) scale(1 ${r1(ry / rx * 1000) / 1000}) translate(${-cx} ${-cy})` };
    const tr = rx / R;
    const dotFill = { pink: grad([[0, '#FFE3EE', 1], [0.32, COLORS.pink, 0.95], [1, COLORS.pink, 0]]), blue: grad([[0, '#E4EEFF', 1], [0.32, COLORS.blue, 0.95], [1, COLORS.blue, 0]]) };
    N.dotFill = dotFill;
    const discFill = grad([[0, 'var(--cw-disc-2)', 1], [1, 'var(--cw-disc)', 1]], { cx: '42%', cy: '38%', r: '70%' });
    const glowFill = grad([[0, '#DCE4FF', 0.32], [0.55, '#9FB4FF', 0.12], [1, '#9FB4FF', 0]]);

    // 1. location territories
    const bandsG = G({ class: 'cw-bands' }, svg);
    if (bands) {
      const tint = { tumor: COLORS.violet, node: COLORS.lymph, blood: COLORS.blood };
      const peak = { tumor: 0.15, node: 0.17, blood: 0.18 };
      for (const b of BANDS) {
        const fill = grad([[0, tint[b.id], 0], [tr * 0.62, tint[b.id], 0], [tr, tint[b.id], peak[b.id]], [tr + (1 - tr) * 0.55, tint[b.id], peak[b.id] * 0.45], [1, tint[b.id], 0]], ell);
        let d = `M${cx} ${cy}`;
        for (let p = b.from; p <= b.to + 1e-6; p += 0.05) {
          const q = track.at(p);
          d += `L${r1(cx + (q.x - cx) * 3.4)} ${r1(cy + (q.y - cy) * 3.4)}`;
        }
        el('path', { d: `${d}Z`, fill, class: `cw-band cw-band--${b.id}` }, bandsG);
      }
      for (const p of [1, 2.5, 3.5]) {
        const q = track.at(p);
        const a = 0.62, z = 1.36;
        el('path', { class: 'cw-boundary', d: `M${r1(cx + (q.x - cx) * a)} ${r1(cy + (q.y - cy) * a)}L${r1(cx + (q.x - cx) * z)} ${r1(cy + (q.y - cy) * z)}` }, bandsG);
      }
      if (!locator && layout !== 'mini') drawBandLabels(bandsG);
    }

    // 2. host-factor halo
    N.halo = G({ class: 'cw-halo' }, svg);
    const haloC = stage === 'light' ? '#5B6480' : COLORS.halo;
    N.haloFill = grad([[0, haloC, 0], [Math.max(0, tr - (nodeR * 1.9) / R), haloC, 0], [tr, haloC, 0.9], [Math.min(1, tr + (nodeR * 1.9) / R), haloC, 0]], ell);

    // 3. arrows
    const arrowsG = G({ class: 'cw-arrows' }, svg);
    for (let k = 1; k <= 7; k++) {
      const gapP = (nodeR + 7) / track.seg(k);
      const a = k - 1 + gapP, b = k - gapP;
      let d = '';
      const steps = Math.max(8, Math.round(((b - a) * track.seg(k)) / 4));
      for (let i = 0; i <= steps; i++) { const q = track.at(a + ((b - a) * i) / steps); d += `${i ? 'L' : 'M'}${r1(q.x)} ${r1(q.y)}`; }
      const e = track.at(b);
      const hx = e.x, hy = e.y, s = 6.5;
      const head = `M${r1(hx - e.tx * s + e.nx * s * 0.7)} ${r1(hy - e.ty * s + e.ny * s * 0.7)}L${r1(hx)} ${r1(hy)}L${r1(hx - e.tx * s - e.nx * s * 0.7)} ${r1(hy - e.ty * s - e.ny * s * 0.7)}`;
      const ag = G({ class: `cw-arrow${k === 7 ? ' cw-arrow--loop' : ''}`, 'data-seg': k }, arrowsG);
      el('path', { d, class: 'cw-arrow__line' }, ag);
      el('path', { d: head, class: 'cw-arrow__head' }, ag);
      N.arrows.push(ag);
    }

    // 4. figure layer (under), 5. flow dots
    const under = G({ class: 'cw-layer-under' }, svg);
    const flowG = G({ class: 'cw-flow' }, svg);
    for (let i = 0; i < POOL; i++) {
      const c = el('circle', { r: 5.2, class: 'cw-dot', 'data-ambient': '' }, flowG);
      c.style.opacity = '0';
      N.dots.push(c);
    }

    // 6. nodes
    const nodesG = G({ class: 'cw-nodes' }, svg);
    const labelsG = G({ class: 'cw-labels' }, svg);
    const fxG = G({ class: 'cw-fx' }, svg);
    const clipR = nodeR - 1.6;
    for (const st of STEPS) {
      const k = st.n;
      const q = track.at(k - 1);
      const ix = cx - q.x, iy = cy - q.y;                    // toward the center
      const il = Math.hypot(ix, iy) || 1;
      const inn = [ix / il, iy / il];
      const outer = G({ class: 'cw-node', transform: `translate(${r1(q.x)} ${r1(q.y)})`, role: 'button', tabindex: 0, 'data-step': k, 'aria-pressed': 'false' }, nodesG);
      const glow = el('circle', { r: nodeR * 2, fill: glowFill, class: 'cw-node__glow' }, outer);
      const scaleG = G({ class: 'cw-node__scale' }, outer);
      // gold therapy rings (acts / also / entersAt)
      el('circle', { r: nodeR + 8, class: 'cw-gold cw-gold--glow' }, scaleG);
      el('circle', { r: nodeR + 8, class: 'cw-gold' }, scaleG);
      // entry arrow: a short on-ramp from outside, just before the node, into the gold ring
      // (it comes in from the side, clear of the label, which sits straight out from the node)
      let dx = 0.45 * q.nx - q.tx, dy = 0.45 * q.ny - q.ty;
      const dl = Math.hypot(dx, dy) || 1; dx /= dl; dy /= dl;
      const sx = dx * (nodeR + 31) + q.nx * 5, sy = dy * (nodeR + 31) + q.ny * 5;
      const ex = dx * (nodeR + 11), ey = dy * (nodeR + 11);
      const cxp = dx * (nodeR + 21) + q.nx * 6, cyp = dy * (nodeR + 21) + q.ny * 6;
      const hdx = ex - cxp, hdy = ey - cyp, hl = Math.hypot(hdx, hdy) || 1, ux = hdx / hl, uy = hdy / hl;
      el('path', { class: 'cw-entry', d: `M${r1(sx)} ${r1(sy)}Q${r1(cxp)} ${r1(cyp)} ${r1(ex)} ${r1(ey)}M${r1(ex - ux * 6 + uy * 4)} ${r1(ey - uy * 6 - ux * 4)}L${r1(ex)} ${r1(ey)}L${r1(ex - ux * 6 - uy * 4)} ${r1(ey - uy * 6 + ux * 4)}` }, scaleG);
      if (geo.labelMode !== 'number') {
        const jx = sx + dx * 6, jy = sy + dy * 6 + 4;
        el('text', { class: 'cw-tag cw-joins', x: r1(jx), y: r1(jy), 'text-anchor': dx > 0.3 ? 'start' : dx < -0.3 ? 'end' : 'middle' }, scaleG).textContent = 'joins here';
      }
      // strength gauge
      el('circle', { r: nodeR + 4, class: 'cw-gauge-track', opacity: 0 }, scaleG);
      el('path', { class: 'cw-gauge', d: '' }, scaleG);
      // lens + art
      el('circle', { r: nodeR, class: 'cw-node__disc', fill: discFill }, scaleG);
      const cp = el('clipPath', { id: `${id}-c${k}` }, svg.defs);
      el('circle', { r: clipR }, cp);
      const artG = G({ class: 'cw-node__art', 'clip-path': `url(#${id}-c${k})` }, scaleG);
      for (const v of [null, ...(GLYPH_VARIANTS[k] || [])]) {
        const gl = glyph(k, stage, v);
        gl.setAttribute('transform', `scale(${r1((nodeR / 31) * 100) / 100})`);
        gl.setAttribute('class', v ? `cw-art cw-art--${v}` : 'cw-art cw-art--base');
        artG.append(gl);
      }
      el('circle', { r: nodeR - 4.5, class: 'cw-node__inner' }, scaleG);
      el('circle', { r: nodeR, class: 'cw-node__state' }, scaleG);
      // state badges on the inner rim
      const bx = inn[0] * nodeR, by = inn[1] * nodeR, br = nodeR >= 28 ? 10.5 : 9.5;
      const bBlock = G({ class: 'cw-badge cw-badge--block', transform: `translate(${r1(bx)} ${r1(by)})` }, scaleG);
      el('circle', { r: br, fill: COLORS.crimson }, bBlock);
      el('path', { d: `M${-br * 0.5} 0H${br * 0.28}M${br * 0.42} ${-br * 0.5}V${br * 0.5}`, stroke: '#fff', 'stroke-width': 2.2, 'stroke-linecap': 'round', fill: 'none' }, bBlock);
      const bPlus = G({ class: 'cw-badge cw-badge--plus', transform: `translate(${r1(bx)} ${r1(by)})` }, scaleG);
      el('circle', { r: br, fill: COLORS.green }, bPlus);
      el('path', { d: `M${-br * 0.48} 0H${br * 0.48}M0 ${-br * 0.48}V${br * 0.48}`, stroke: '#0B1024', 'stroke-width': 2.2, 'stroke-linecap': 'round', fill: 'none' }, bPlus);
      // ring count badge: on the gold ring, 55° counter-clockwise from straight out
      const ca = -0.96, ox2 = -inn[0], oy2 = -inn[1];
      const cdx = (ox2 * Math.cos(ca) - oy2 * Math.sin(ca)) * (nodeR + 8), cdy = (ox2 * Math.sin(ca) + oy2 * Math.cos(ca)) * (nodeR + 8);
      const cnt = G({ class: 'cw-count', transform: `translate(${r1(cdx)} ${r1(cdy)})` }, scaleG);
      el('circle', { r: 8.5 }, cnt);
      el('text', { y: 3.8 }, cnt).textContent = '';
      el('circle', { r: nodeR + 6, class: 'cw-node__focus' }, scaleG);
      el('circle', { r: Math.max(nodeR + 6, 26), fill: 'transparent', 'data-hit': '' }, outer);
      N.nodes.push({ k, outer, scaleG, glow, inn, q });
      wireNode(outer, k);
    }

    // 7. labels (+ tag line)
    for (const st of STEPS) {
      const k = st.n;
      const { q } = N.nodes[k - 1];
      const lg = G({ class: 'cw-label-g', 'data-step': k }, labelsG);
      const pos = labelPos(q, k);
      const t = el('text', { x: r1(pos.x), y: r1(pos.y), class: 't-label cw-label', 'text-anchor': pos.anchor }, lg);
      if (geo.labelMode === 'number') {
        el('tspan', {}, t).textContent = String(k);
      } else {
        el('tspan', { class: 'cw-num' }, t).textContent = `${k} `;
        el('tspan', {}, t).textContent = st.short;
      }
      const tag = el('text', { x: r1(pos.x), y: r1(pos.y + pos.tagDy), class: 'cw-tag', 'text-anchor': pos.anchor, 'data-dy': pos.tagDy }, lg);
      N.labels.push({ g: lg, tag });
    }

    // 8. center status
    if (centerOpt) {
      if (geo.centerInside) {
        N.center = el('text', { x: cx, y: cy - 2, class: 'cw-center' }, svg);
      } else {
        N.center = el('text', { x: cx, y: geo.statusY, class: 'cw-status' }, svg);
      }
    }
    const over = G({ class: 'cw-layer-over' }, svg);
    svg.append(fxG);
    N.fx = fxG;
    api.layers = { under, over };

    seedParticles();
    applyAll({ instant: true });
    if (focusedStep) N.nodes[focusedStep - 1]?.outer.focus({ preventScroll: true });
    ctx.refreshTextScale?.();
    requestAnimationFrame(() => ctx.refreshTextScale?.());
    for (const fn of layoutFns) { try { fn({ layout: geo.layout, width: W, height: H }); } catch (e) { console.error(e); } }
  }

  function labelPos(q, k) {
    const { cx, cy, nodeR, rx, labelMode } = geo;
    if (labelMode === 'outside' || labelMode === 'number') {
      const dx = q.x - cx, dy = q.y - cy, l = Math.hypot(dx, dy) || 1;
      const ux = dx / l, uy = dy / l, d = nodeR + 12;
      const x = q.x + ux * d, y = q.y + uy * d;
      const anchor = ux > 0.35 ? 'start' : ux < -0.35 ? 'end' : 'middle';
      if (uy < -0.5) return { x, y: y - 4, anchor, tagDy: -19 };       // above the node: tag stacks upward
      if (uy > 0.5) return { x, y: y + 14, anchor, tagDy: 18 };
      return { x, y: y + 5, anchor, tagDy: 18 };
    }
    // oval: side nodes label inside the loop; top and bottom nodes label outside it
    const side = q.x - cx;
    if (Math.abs(side) > rx * 0.6) {
      const anchor = side > 0 ? 'end' : 'start';
      const x = q.x + (side > 0 ? -1 : 1) * (nodeR + 15);                                    // clears the gold ring (nodeR + 8) and its glow
      return { x, y: q.y + 5, anchor, tagDy: 17 };
    }
    if (q.y < cy) return { x: q.x, y: q.y - nodeR - 10, anchor: 'middle', tagDy: -18 };       // top node: above it
    const anchor = side > 0 ? 'start' : 'end';                                                // bottom nodes: below, splayed
    return { x: q.x + (side > 0 ? -1 : 1) * nodeR * 0.55, y: q.y + nodeR + 25, anchor, tagDy: 17 };
  }

  function drawBandLabels(parentG) {
    const { W, H, cx, cy, rx, nodeR, layout } = geo;
    const put = (text, x, y, anchor) => { el('text', { x: r1(x), y: r1(y), class: 'cw-band-label', 'text-anchor': anchor }, parentG).textContent = text.toUpperCase(); };
    if (layout === 'circle') {
      const polar = (deg, r) => [cx + r * Math.sin((deg * Math.PI) / 180), cy - r * Math.cos((deg * Math.PI) / 180)];
      const [tx, ty] = polar(322, rx + 66); put('Tumor', tx, ty, 'end');
      const [lx, ly] = polar(90, rx + 46); put('Lymph node', lx, ly + 4, 'start');
      const [bx, by] = polar(140, rx + 72); put('Blood', bx, by + 4, 'start');
    } else {
      const p2 = track.at(1), p3 = track.at(2), p4 = track.at(3), p6 = track.at(5), p7 = track.at(6);
      put('Lymph node', p2.x - nodeR - 8, (p2.y + p3.y) / 2 + 4, 'end');
      put('Tumor', p7.x + nodeR + 8, (p7.y + p6.y) / 2 + 4, 'start');
      put('Blood', p4.x + 6, (p3.y + p4.y) / 2 + 2, 'end');
    }
  }

  // ------------------------------------------------------------ interaction
  function wireNode(node, k) {
    const fire = (via) => {
      if (locator) {
        const st = STEPS[k - 1];
        ctx.tooltip.show(`<strong>Step ${k}</strong> · ${st.name}`, node);
        clearTimeout(tipTimer);
        tipTimer = setTimeout(() => ctx.tooltip.hide(), 2600);
      }
      for (const fn of stepFns) { try { fn(k, { via }); } catch (e) { console.error(e); } }
    };
    node.addEventListener('click', () => fire('pointer'), { signal: ctx.signal });
    node.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fire('keyboard'); return; }
      let j = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = (k % 7) + 1;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = ((k + 5) % 7) + 1;
      if (j) { e.preventDefault(); N.nodes[j - 1]?.outer.focus(); }
    }, { signal: ctx.signal });
    node.addEventListener('mouseenter', () => N.labels[k - 1]?.g.classList.add('is-hover'), { signal: ctx.signal });
    node.addEventListener('mouseleave', () => N.labels[k - 1]?.g.classList.remove('is-hover'), { signal: ctx.signal });
  }
  let tipTimer = 0;

  // ------------------------------------------------------------ derived state
  function derive() {
    const st = S.states;
    const barriers = new Set(st.filter((s) => s.state === 'broken' || s.broken).map((s) => s.step));
    const sources = S.rings.entersAt.filter((r) => r.source !== false).map((r) => r.step);
    const fed = new Set();
    if (!barriers.size) for (let k = 1; k <= 7; k++) fed.add(k);
    else for (const e of sources) {
      let k = e;
      for (let i = 0; i < 7; i++) { if (barriers.has(k)) break; fed.add(k); k = (k % 7) + 1; }
    }
    const trueBroken = st.filter((s) => s.state === 'broken').map((s) => s.step);
    const stalledAt = trueBroken.length ? trueBroken[0] : (barriers.size && !sources.length ? [...barriers].sort()[0] : null);
    const bypassFrom = !stalledAt && barriers.size && sources.length ? sources[0] : null;
    return { barriers, sources, fed, stalledAt, bypassFrom, running: !stalledAt };
  }

  function nodeOpacity(k, D) {
    const s = S.states[k - 1];
    let o = 1;
    if (s.state === 'skipped') o = 0.45;
    else if (D.barriers.size && !D.fed.has(k) && !D.barriers.has(k)) o = 0.4;
    if (S.selected === k) o = Math.max(o, 0.75);
    return o;
  }

  // distance (in steps) from the nearest barrier behind k, for the starving cascade
  function starveOrder(k, D) {
    for (let i = 1; i <= 7; i++) { const b = ((k - i - 1 + 14) % 7) + 1; if (D.barriers.has(b)) return i; }
    return 1;
  }

  // ------------------------------------------------------------ apply state to the drawing
  function applyAll({ instant = false } = {}) {
    if (!svg) return;
    const quick = instant || rm();
    root.classList.toggle('is-rm', rm());
    const D = derive();
    const ringSet = (kind) => new Map(S.rings[kind].map((r) => [r.step, r.count]));
    const acts = ringSet('acts'), also = ringSet('also'), enters = ringSet('entersAt');
    for (const nd of N.nodes) {
      const { k, outer, scaleG, glow } = nd;
      const s = S.states[k - 1];
      const cls = outer.classList;
      for (const name of ['is-broken', 'is-weak', 'is-skipped', 'is-replaced', 'is-repaired']) cls.remove(name);
      if (s.state !== 'ok') cls.add(`is-${s.state}`);
      cls.toggle('has-break', !!s.broken);
      if (s.glyph) outer.setAttribute('data-glyph', s.glyph); else outer.removeAttribute('data-glyph');
      cls.toggle('has-acts', acts.has(k));
      cls.toggle('has-also', also.has(k) && !acts.has(k));
      cls.toggle('has-enters', enters.has(k));
      const count = acts.get(k);
      cls.toggle('has-count', count != null);
      const ct = scaleG.querySelector('.cw-count text');
      if (ct) ct.textContent = count ? String(count) : '';
      // strength gauge
      const gauge = scaleG.querySelector('.cw-gauge');
      const gt = scaleG.querySelector('.cw-gauge-track');
      if (s.strength != null) {
        const r = geo.nodeR + 4, a = Math.max(0.001, Math.min(0.999, s.strength)) * Math.PI * 2;
        const x = r * Math.sin(a), y = -r * Math.cos(a);
        gauge.setAttribute('d', `M0 ${-r}A${r} ${r} 0 ${a > Math.PI ? 1 : 0} 1 ${r1(x)} ${r1(y)}`);
        gt.setAttribute('opacity', 1);
      } else { gauge.setAttribute('d', ''); gt.setAttribute('opacity', 0); }
      // selection
      const sel = S.selected === k;
      cls.toggle('is-selected', sel);
      outer.setAttribute('aria-pressed', String(sel));
      outer.setAttribute('aria-label', ariaFor(k));
      N.labels[k - 1].g.classList.toggle('is-selected', sel);
      gsap.to(scaleG, { scale: sel ? 1.12 : 1, svgOrigin: '0 0', duration: quick ? 0 : 0.45, ease: 'so.out', overwrite: 'auto' });
      gsap.to(glow, { opacity: sel ? 1 : 0, duration: quick ? 0 : 0.45, overwrite: 'auto' });
      // fades (starving cascade)
      const o = nodeOpacity(k, D);
      const delay = quick ? 0 : (o < 1 && s.state !== 'skipped' ? (starveOrder(k, D) - 1) * 0.22 : 0);
      gsap.to(outer, { opacity: o, duration: quick ? 0 : 0.55, delay, overwrite: 'auto' });
      gsap.to(N.labels[k - 1].g, { opacity: o < 1 ? Math.max(0.5, o + 0.12) : 1, duration: quick ? 0 : 0.55, delay, overwrite: 'auto' });
      // tag line
      const tag = N.labels[k - 1].tag;
      let word = s.tag != null ? s.tag : (s.state === 'ok' || s.state === 'broken' ? '' : STATE_WORDS[s.state]);
      if (geo.labelMode === 'number' && s.state !== 'weak') word = '';      // mini layout: only "weak" fits
      tag.replaceChildren();
      const lines = word ? word.split('\n') : [];
      const up = Number(tag.dataset.dy) < 0;
      lines.forEach((ln, i) => {
        const dy = i === 0 ? (up ? -(lines.length - 1) * 15 : 0) : 15;
        el('tspan', { x: tag.getAttribute('x'), dy }, tag).textContent = ln;
      });
      tag.setAttribute('class', `cw-tag${word ? ` cw-tag--${s.state}` : ''}`);
    }
    // arrows: the segment after a node that gets no flow dims
    for (const ag of N.arrows) {
      const k = Number(ag.dataset.seg);
      const next = (k % 7) + 1;
      const live = !D.barriers.size || (D.fed.has(k) && !D.barriers.has(k)) || D.barriers.has(next);
      const dead = !live;
      const skipped = S.states[k - 1].state === 'skipped' && S.states[next - 1].state === 'skipped';
      gsap.to(ag, { opacity: dead ? 0.3 : skipped ? 0.45 : 1, duration: quick ? 0 : 0.5, overwrite: 'auto' });
    }
    drawHalo();
    paintCenter(D);
  }

  function ariaFor(k) {
    const st = STEPS[k - 1];
    const s = S.states[k - 1];
    const bits = [`Step ${k}, ${st.short}: ${plainText(st.what)}`];
    if (s.state !== 'ok') bits.push(STATE_WORDS[s.state].replace('\n', ' '));
    if (s.tag) bits.push(s.tag.replace('\n', ' '));
    if (s.glyph === 'hidden') bits.push('no MHC class I on the surface');
    if (s.broken && s.state !== 'broken') bits.push('still broken, but not needed');
    if (S.rings.acts.some((r) => r.step === k)) bits.push('a treatment acts here');
    else if (S.rings.also.some((r) => r.step === k)) bits.push('a treatment also acts here');
    if (S.rings.entersAt.some((r) => r.step === k)) bits.push('ready-made killers join here');
    return `${bits.join('. ')}.`;
  }

  function autoCenter(D) {
    if (D.stalledAt) return { text: `Stalled at step ${D.stalledAt}:\n${STEPS[D.stalledAt - 1].short}`, stalled: true };
    if (D.bypassFrom) return { text: `Running from step ${D.bypassFrom}\n${STEPS[D.bypassFrom - 1].short} onward`, stalled: false };
    return { text: 'Cycle running', stalled: false };
  }

  function paintCenter(D = derive()) {
    if (!N.center) return;
    const c = S.center == null ? autoCenter(D) : { text: String(S.center), stalled: false };
    const lines = c.text.split('\n').slice(0, 2);
    N.center.replaceChildren();
    N.center.classList.toggle('is-stalled', c.stalled);
    if (geo.centerInside) {
      const lh = 21;
      const y0 = geo.cy + 6 - ((lines.length - 1) * lh) / 2;
      lines.forEach((ln, i) => { el('tspan', { x: geo.cx, y: r1(y0 + i * lh) }, N.center).textContent = ln; });
    } else {
      // under the wheel: one line if it fits, else two
      const one = lines.join(' ');
      const fit = one.length <= (geo.layout === 'mini' ? 22 : 34);
      // dy in em: on phone locators the text scales up with --u, and fixed user units let the lines touch
      (fit ? [one] : lines).forEach((ln, i) => { el('tspan', { x: geo.cx, dy: i ? '1.2em' : 0 }, N.center).textContent = ln; });
    }
  }

  function drawHalo() {
    if (!N.halo) return;
    N.halo.replaceChildren();
    const h = S.halo;
    if (!h) return;
    // Layered arcs stroked with a radial gradient (soft inner/outer edge); stacking shorter
    // arcs builds a smooth angular density around the "dense" and "faint" steps.
    const w = geo.nodeR * 1.9;
    const arc = (p0, p1, op) => {
      let d = '';
      const n = Math.max(6, Math.round((p1 - p0) * 24));
      for (let i = 0; i <= n; i++) { const q = track.at(p0 + ((p1 - p0) * i) / n); d += `${i ? 'L' : 'M'}${r1(q.x)} ${r1(q.y)}`; }
      el('path', { d, fill: 'none', stroke: N.haloFill, 'stroke-width': r1(w * 2), 'stroke-opacity': op, 'stroke-linejoin': 'round' }, N.halo);
    };
    arc(0, 7, 0.05);
    for (const k of h.dense || []) for (const span of [1.25, 1, 0.75, 0.52, 0.3]) arc(k - 1 - span, k - 1 + span, 0.07);
    for (const k of h.faint || []) for (const span of [0.9, 0.6, 0.35]) arc(k - 1 - span, k - 1 + span, 0.045);
  }

  // ------------------------------------------------------------ flow particles
  const P = Array.from({ length: POOL }, () => ({ s: 0, active: false, child: false, a: 0, dying: false, lane: 0 }));
  let emitT = 0;
  const target = locator ? 14 : 21;
  const spacing = () => 7 / target;
  function seedParticles() {
    let i = 0;
    for (const p of P) { p.active = false; p.child = false; p.dying = false; p.a = 0; }
    const D = derive();
    if (D.barriers.size) return;          // a stalled wheel starts empty; sources fill it
    for (; i < target; i++) Object.assign(P[i], { s: i * spacing() + 0.12, active: true, a: 1 });
  }
  function speedFactor(s) {
    let f = 1;
    for (const st of S.states) {
      if (st.state !== 'weak') continue;
      const m = 0.22 + 0.45 * (st.strength ?? 0.2);
      const d = mod(st.step - 1 - s + 3.5) - 3.5;          // >0: node ahead
      if (d > -0.25 && d < 0.9) f *= 1 - (1 - m) * Math.exp(-((d - 0.2) ** 2) / (2 * 0.28 * 0.28));
    }
    return f;
  }
  function dimAt(s) {
    const near = Math.round(mod(s)) % 7;
    const st = S.states[near];
    const prev = S.states[Math.floor(mod(s)) % 7], next = S.states[(Math.floor(mod(s)) + 1) % 7];
    if (st.state === 'skipped' || (prev.state === 'skipped' && next.state === 'skipped')) return 0.3;
    return 1;
  }
  function tick(dt) {
    if (!svg || !N.dots.length) return;
    if (rm()) { root.classList.add('is-rm'); return; }
    root.classList.remove('is-rm');
    const D = derive();
    const v = BASE_SPEED * S.flow;
    const gStop = (geo.nodeR + 9) / track.unit;   // (segments are similar in length)
    const q = 0.085;
    const CAP = locator ? 5 : 7;
    const barriers = [...D.barriers].map((k) => k - 1);
    // group active parents by the barrier ahead
    const groups = new Map();
    for (const p of P) {
      if (!p.active || p.child || p.dying) continue;
      if (!barriers.length) continue;
      let best = null, bd = Infinity;
      for (const b of barriers) { const d = mod(b - p.s); if (d < bd) { bd = d; best = b; } }
      if (!groups.has(best)) groups.set(best, []);
      groups.get(best).push({ p, d: bd });
    }
    const limits = new Map();
    for (const [b, list] of groups) {
      list.sort((x, y) => x.d - y.d);
      list.forEach(({ p, d }, i) => {
        const stopD = gStop + i * q;
        limits.set(p, { b, stopD, i });
        if (i >= CAP && d < stopD + 0.05) p.dying = true;
      });
    }
    let parents = 0;
    for (const p of P) {
      if (!p.active) continue;
      if (!p.child) parents++;
      if (p.dying) { p.a -= dt / 0.6; if (p.a <= 0) { p.active = false; p.dying = false; p.a = 0; } continue; }
      if (p.a < 1) p.a = Math.min(1, p.a + dt / 0.5);
      const ds = (v * speedFactor(p.s) * dt * track.unit) / track.seg(Math.floor(mod(p.s)) + 1);
      const before = p.s;
      const lim = limits.get(p);
      if (lim) {
        const d = mod(lim.b - p.s);
        p.s = d - ds > lim.stopD ? p.s + ds : (d > lim.stopD ? lim.b - lim.stopD : p.s);
        p.lane = lim.i > 0 && d <= lim.stopD + 0.01 ? (lim.i % 2 ? 2.4 : -2.4) : 0;
      } else {
        p.s += ds;
        p.lane = 0;
      }
      if (p.child) {
        p.lane = 5.5 * Math.sin(Math.PI * Math.min(1, Math.max(0, p.s - 6)));
        if (p.s >= 7) { p.active = false; continue; }
      } else {
        // killing releases more antigen: a second speck rides along 7 → 1
        if (before < 6 && p.s >= 6 && !D.barriers.has(7)) {
          const c = P.find((x) => !x.active);
          if (c) Object.assign(c, { s: 6.001, active: true, child: true, a: 0.2, dying: false, lane: 0 });
        }
        p.s = mod(p.s);
      }
    }
    // emitters: entry rings always; the natural loop refills itself when nothing blocks it
    const free = () => P.find((x) => !x.active);
    emitT += dt;
    const interval = v > 0 ? spacing() / v : Infinity;
    if (emitT >= interval) {
      emitT = 0;
      const emitAt = (pos) => { const c = free(); if (c) Object.assign(c, { s: pos + 0.02, active: true, child: false, a: 0, dying: false, lane: 0 }); };
      if (D.sources.length && parents < POOL - 6) D.sources.forEach((k) => emitAt(k - 1));
      else if (!D.barriers.size && parents < target) emitAt(S.seedPos);
    }
    // render
    for (let i = 0; i < POOL; i++) {
      const p = P[i];
      const dot = N.dots[i];
      if (!p.active) { if (dot.style.opacity !== '0') dot.style.opacity = '0'; continue; }
      const pt = track.at(p.s);
      const x = pt.x + pt.nx * p.lane, y = pt.y + pt.ny * p.lane;
      dot.setAttribute('transform', `translate(${r1(x)} ${r1(y)})${p.child ? ' scale(0.8)' : ''}`);
      const pink = p.child || p.s >= 6 || p.s < 2;
      dot.style.fill = pink ? N.dotFill.pink : N.dotFill.blue;
      dot.style.opacity = String(r1(Math.max(0, p.a) * dimAt(p.s) * 100) / 100);
    }
  }
  const loop = flowOpt === false ? null : ctx.loop(tick, { autoplay: !rm() });
  if (!loop) root.classList.add('is-rm');
  const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  const onMQ = () => { root.classList.toggle('is-rm', rm() || !loop); if (!rm() && loop && !loop.playing) loop.play(); };
  mq?.addEventListener?.('change', onMQ);

  // ------------------------------------------------------------ fx
  function fxRing(k, { color, from = 1, to = 2.1, duration = 1.6, width = 2.2, hold = 0 }) {
    if (!svg) return;
    const nd = N.nodes[k - 1];
    if (!nd) return;
    const c = el('circle', { r: geo.nodeR, fill: 'none', stroke: color, 'stroke-width': width, 'data-ambient': '', transform: `translate(${r1(nd.q.x)} ${r1(nd.q.y)})` }, N.fx);
    if (rm()) {
      c.style.opacity = '0.8';
      setTimeout(() => c.remove(), Math.max(1200, hold || duration * 1000));
      return;
    }
    gsap.fromTo(c, { scale: from, opacity: 0.9, svgOrigin: `${r1(nd.q.x)} ${r1(nd.q.y)}` },
      { scale: to, opacity: 0, duration, delay: hold / 1000, ease: 'so.out', onComplete: () => c.remove() });
  }

  // ------------------------------------------------------------ observe size, theme
  const ro = new ResizeObserver(() => {
    const w = Math.round(root.clientWidth);
    if (!w || w === width) return;
    const prev = chooseLayout(width || w);
    const changed = !svg || chooseLayout(w) !== prev || !geo || chooseLayout(w) !== geo.layout;
    width = w;
    if (changed) draw();
    else ctx.refreshTextScale?.();
  });
  ro.observe(root);
  if (ctx.stage.dataset.stage === 'light') ctx.onThemeChange(() => draw());
  ctx.cleanup(() => api.destroy());

  // ------------------------------------------------------------ API
  const normSteps = (list, source = true) => (list || []).map((x) => (typeof x === 'number' ? { step: x, count: null, source } : { step: x.step, count: x.count ?? null, source })).filter((x) => x.step >= 1 && x.step <= 7);
  const api = {
    el: root,
    get svg() { return svg; },
    get layout() { return geo?.layout ?? chooseLayout(root.clientWidth || size); },
    get selected() { return S.selected; },
    get states() { return S.states.map((s) => ({ ...s })); },
    get status() { const D = derive(); return { running: D.running, stalledAt: D.stalledAt, bypassFrom: D.bypassFrom }; },
    layers: { under: null, over: null },

    selectStep(n, { instant = false } = {}) {
      S.selected = n >= 1 && n <= 7 ? Math.round(n) : null;
      applyAll({ instant });
      return api;
    },
    setStates(list = [], { instant = false } = {}) {
      const before = derive();
      S.states = STEPS.map((s) => ({ step: s.n, state: 'ok', strength: null, broken: false, tag: null, glyph: null }));
      for (const it of list || []) {
        if (!it || !(it.step >= 1 && it.step <= 7)) continue;
        const cur = S.states[it.step - 1];
        cur.state = ['ok', 'weak', 'broken', 'skipped', 'replaced', 'repaired'].includes(it.state) ? it.state : 'ok';
        cur.strength = it.strength == null ? null : Math.max(0, Math.min(1, Number(it.strength)));
        cur.broken = !!it.broken && cur.state !== 'broken';
        cur.tag = it.tag == null ? null : String(it.tag);
        cur.glyph = it.glyph && (GLYPH_VARIANTS[it.step] || []).includes(it.glyph) ? it.glyph : null;
      }
      const after = derive();
      // a cleared barrier becomes the place where the restarted cycle re-seeds
      const cleared = [...before.barriers].filter((b) => !after.barriers.has(b));
      if (cleared.length) S.seedPos = cleared[0] - 1;
      applyAll({ instant });
      return api;
    },
    setFlow(v) { S.flow = Math.max(0, Math.min(1, Number(v) || 0)); return api; },
    ring(steps, kind = 'acts', { transient = 0, source = true } = {}) {
      const k = kind === 'entersAt' || kind === 'also' ? kind : 'acts';
      const list = normSteps(steps, source !== false);
      if (transient) {
        for (const r of list) fxRing(r.step, { color: COLORS.gold, from: 1.26, to: 1.26, duration: 0.8, width: k === 'also' ? 1.4 : 2.6, hold: transient });
        return api;
      }
      S.rings[k] = list;
      applyAll();
      return api;
    },
    halo(o) { S.halo = o && (o.dense?.length || o.faint?.length) ? { dense: [...(o.dense || [])], faint: [...(o.faint || [])] } : null; drawHalo(); return api; },
    setCenter(text) { S.center = text == null || text === 'auto' ? null : String(text); paintCenter(); return api; },
    onStep(fn) { stepFns.add(fn); return () => stepFns.delete(fn); },
    onLayout(fn) { layoutFns.add(fn); if (geo) { try { fn({ layout: geo.layout, width: geo.W, height: geo.H }); } catch (e) { console.error(e); } } return () => layoutFns.delete(fn); },
    pulse(n, kind = 'repair') {
      const color = kind === 'repair' ? COLORS.green : kind === 'lap' ? COLORS.lap : '#DCE4FF';
      fxRing(n, { color });
      return api;
    },
    nodePoint(n) { const nd = N.nodes?.[n - 1]; return nd ? { x: nd.q.x, y: nd.q.y, r: geo.nodeR } : null; },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      ro.disconnect();
      mq?.removeEventListener?.('change', onMQ);
      clearTimeout(tipTimer);
      loop?.pause();
      root.remove();
    },
  };
  // first draw as soon as we have a width (ResizeObserver also fires once on observe)
  width = Math.round(root.clientWidth);
  if (width) draw();
  return api;
}
