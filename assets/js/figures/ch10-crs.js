// ch10-crs — "Blocking the fever, not the therapy" (Chapter 10, Living Drugs).
// ONE idea: the fever of cytokine release syndrome is made by the patient's own macrophages
// responding to CAR-T activity, so blocking the IL-6 RECEPTOR (tocilizumab) breaks the fever
// without switching off the therapy.
//
// Left (top on phones): a patch of bone marrow on a canvas crowd (shared/agents.js).
//   CAR-T cells kill (crowd kill: shrink + specks) and divide; each kill releases IFN-γ (hollow
//   blue rings) and TNF (solid blue dots) — rule 12, sender's color. When those reach a
//   macrophage it swells, brightens and floods the scene with coral IL-6 dots (sender = macrophage).
//   The IL-6 drifts to IL-6 receptors on body cells (a strip of receptors, SVG). Tocilizumab =
//   drug antibodies capping those RECEPTORS (cell-actions dockAntibody, rule 9); IL-6 dots then
//   bounce off. Killing goes on.
// Right (below on phones): two dark-native plots (shared/chart.js, theme 'stage-dark', rule 1)
//   sharing days 0–14: CAR-T cells in the blood (log, blue = the entity) and IL-6 (coral) with
//   the temperature band (chart token). Curves are an illustrative model (not patient data):
//   blue starts rising at day 2, IL-6 a day later and peaks alongside (not after) the blue peak.
// The scene follows the model (kills, expansion, macrophage output), so plot and scene agree.
import { tCell, cancerCell, macrophage, car, receptor, antibody, placeOnMembrane, tissueField, PALETTE, mix } from '../art/index.js';
import { rng, fixedStep, spatialHash, walk, relax, spriteStates, createEffects, killSpecks, divisionPinch, contactRing } from './shared/agents.js';
import { C, scale, chartRoot, axis, line, pathD, threshold } from './shared/chart.js';
import * as CA from './shared/cell-actions.js';

const ID = 'ch10-crs';
const DAY_S = 2.6;        // real seconds per simulated day
const T_END = 14;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
const sm = (x) => { const t = clamp(x, 0, 1); return t * t * (3 - 2 * t); };
const TAU = Math.PI * 2;

// ------------------------------------------------------------------ the illustrative model
const BURDEN = {
  low: { cPeak: 2.0, tPeak: 9.0, il6: 0.28, killSpan: 6.2, label: 'Low' },
  high: { cPeak: 2.8, tPeak: 8.0, il6: 1.0, killSpan: 8.0, label: 'High' },
};
const C_MAX = 2.8;                        // log10 fold, high-burden peak (axis scale)
const HILL_K = 0.35;
const hill = (v) => (v * v) / (v * v + HILL_K * HILL_K);
const HILL_NORM = hill(1);
function model(t, b, tb) {
  const P = BURDEN[b];
  let logC = 0;
  if (t > 2) {
    const x = (t - 2) / (P.tPeak - 2);
    logC = x < 1 ? P.cPeak * sm(x) : P.cPeak * (1 - 0.3 * sm((t - P.tPeak) / (T_END - P.tPeak)));
  }
  const tp = P.tPeak - 0.6;              // IL-6 peaks alongside the CAR-T peak, never after it
  let L = 0;
  if (t > 3) {                            // a day after the blue curve starts to rise
    const x = (t - 3) / (tp - 3);
    L = x < 1 ? P.il6 * Math.pow(sm(x), 1.2) : P.il6 * Math.exp(-(t - tp) / 2.0);
  }
  const blk = tb == null ? 0 : sm((t - tb) / 0.3);     // the receptor block takes hold within hours
  const temp = 37 + 3.4 * hill(L * (1 - blk)) / HILL_NORM;
  const F = 1 - 0.985 * sm((t - 1.4) / P.killSpan);   // tumor left (fraction)
  return { logC, L, temp, F, blk };
}

// ------------------------------------------------------------------ layouts (design units)
const LAYOUTS = {
  wide: {
    vb: [960, 540],
    scene: { x: 18, y: 54, w: 520, h: 470 },
    strip: { dir: 'v', at: 548, from: 92, to: 486, n: 7 },
    stripLabel: { x: 548, y: 70, anchor: 'middle', lines: ['IL-6 receptors', 'on body cells'] },
    plots: { x0: 640, x1: 930, A: [92, 214], B: [300, 438], titleA: 70, titleB: 278, axisY: 438, axisTitle: 484, note: 506 },
    cells: { rc: 13, rt: 9.5, rm: 30, nHigh: 38, nLow: 20, tMax: 16, macs: [[156, 176], [420, 148], [134, 418], [404, 404]] },
    emit: 13,
  },
  compact: {
    vb: [400, 690],
    scene: { x: 0, y: 34, w: 400, h: 262 },
    strip: { dir: 'h', at: 306, from: 26, to: 374, n: 6 },
    stripLabel: { x: 200, y: 344, anchor: 'middle', lines: ['IL-6 receptors on body cells'] },
    plots: { x0: 62, x1: 382, A: [392, 474], B: [530, 612], titleA: 378, titleB: 503, axisY: 612, axisTitle: 652, note: 674 },
    cells: { rc: 11, rt: 8.5, rm: 25, nHigh: 28, nLow: 15, tMax: 12, macs: [[78, 106], [318, 98], [206, 236]] },
    emit: 9,
  },
};

const STYLE = `
[data-figure="${ID}"] .crs-legend { margin: 0.6rem 0 0; }
[data-figure="${ID}"] .crs-note { margin: 0.5rem 0 0; font: 400 var(--text-sm, 16px)/1.5 var(--font-body); color: var(--ink-2); }
[data-figure="${ID}"] .crs-svg-bg, [data-figure="${ID}"] .crs-svg-fg { pointer-events: none; }
[data-figure="${ID}"] .segmented__opt:disabled { opacity: 0.42; cursor: not-allowed; }
@container fig (max-width: 599.98px) {
  [data-figure="${ID}"] .fig__controls { position: sticky; bottom: 0; z-index: 6; margin-inline: -4px; padding: 8px 4px 10px; gap: 8px;
    background: color-mix(in srgb, var(--paper) 94%, transparent); backdrop-filter: blur(6px); border-top: 1px solid var(--rule); }
  [data-figure="${ID}"] .crs-iconable .btn__text { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
  [data-figure="${ID}"] .crs-iconable { padding-inline: 0; width: 44px; justify-content: center; }
  [data-figure="${ID}"] .segmented__opt { padding-inline: 12px; }
}
`;

export default async function mount(fig, ctx) {
  const { gsap } = ctx;
  if (!document.getElementById('crs10-style')) document.head.append(ctx.h('style', { id: 'crs10-style', html: STYLE }));
  ctx.setAspect(16 / 9, 400 / 690);

  const bg = ctx.createSVG({ viewBox: '0 0 960 540', className: 'crs-svg-bg' });
  const cv = ctx.canvas();
  const fg = ctx.createSVG({ viewBox: '0 0 960 540', className: 'crs-svg-fg' });
  const S = (tag, attrs, parent) => ctx.svg(tag, attrs, parent);
  ctx.tag('Illustrative', 'top-right');
  ctx.tag('Time compressed', 'top-right');
  const clock = ctx.ui.clock({ value: 'Day 0', corner: 'top-left' });

  let layoutName = ctx.compact ? 'compact' : 'wide';
  let L = LAYOUTS[layoutName];
  let burden = 'high';
  let sheet = null;
  let k = 1;                 // CSS px per design unit
  const fx = createEffects();
  const hash = spatialHash(36);
  const near = [];

  // ------------------------------------------------------------------ sim state
  let R, t, tb, cancers, ts, macs, parts, nextId, hits, feverOn, blockedUI;
  let plan = 'none';         // the reader's treatment plan; 'block' = pre-armed: the drug is given at the 38 °C crossing
  const emitAcc = new Map();

  function sceneBounds() {
    const s = L.scene;
    return { x0: s.x + 8, y0: s.y + 8, x1: s.x + s.w - 8, y1: s.y + s.h - 8 };
  }
  function resetSim() {
    R = rng(burden === 'high' ? 1031 : 517);
    t = 0; tb = null; feverOn = false; nextId = 1;
    fx.clear(); emitAcc.clear();
    const CL = L.cells, B = sceneBounds();
    macs = CL.macs.map(([x, y], i) => ({ id: nextId++, x, y, r: CL.rm, kind: 'm', variant: i, reached: 0, a: 0, fixed: true }));
    cancers = [];
    const n = burden === 'high' ? CL.nHigh : CL.nLow;
    let guard = 0;
    while (cancers.length < n && guard++ < 6000) {
      const x = R.range(B.x0 + CL.rc + 30, B.x1 - CL.rc - 4), y = R.range(B.y0 + CL.rc + 4, B.y1 - CL.rc - 4);
      if (macs.some((m) => Math.hypot(m.x - x, m.y - y) < m.r + CL.rc + 8)) continue;
      if (cancers.some((c) => Math.hypot(c.x - x, c.y - y) < CL.rc * 2 + 5)) continue;
      cancers.push({ id: nextId++, x, y, r: CL.rc, kind: 'c', variant: cancers.length, fixed: true });
    }
    ts = [];
    for (let i = 0; i < 3; i++) ts.push(newT(B.x0 + 14 + i * 6, lerp(B.y0 + 40, B.y1 - 40, (i + 0.5) / 3)));
    parts = [];
    hits = new Float32Array(L.strip.n);
    blockedUI = false;
    if (treat) treat.set(plan);
    clearDrugs();
  }
  function newT(x, y, heading) {
    const id = nextId++;
    return { id, x, y, r: L.cells.rt, kind: 't', variant: id % 4, heading: heading ?? R.range(-0.6, 0.6), rng: rng(id * 7919), busy: 0, prey: null, alpha: 1, fade: 0, speed: 26 };
  }

  // ------------------------------------------------------------------ sprites
  function carT(p) {
    const art = tCell({ variant: 'cd8', r: p.r, state: 'activated', seed: p.seed, polarity: 0, receptors: false, stage: 'dark' });
    placeOnMembrane(art, (o) => car({ ...o, size: p.r * 0.62 }), { count: 5, size: p.r * 0.62, seed: p.seed, offset: 0.1, layer: 'cars' });
    return art;
  }
  async function buildSprites() {
    const CL = L.cells;
    const sc = Math.min(3, (window.devicePixelRatio || 1) * Math.max(1, k));
    sheet = await spriteStates({
      c: ['cancerCell', { r: CL.rc, mhc: 0, stage: 'dark' }],
      t: [carT, { r: CL.rt }],
      m0: ['macrophage', { r: CL.rm, state: 'resting', polarization: 0.12, stage: 'dark' }],
      m1: ['macrophage', { r: CL.rm, state: 'activated', polarization: 0.08, stage: 'dark' }],
    }, { seeds: 4, scale: sc });
  }
  // coral IL-6 dot + blue signals, pre-rendered
  const dotCache = new Map();
  function dotSprite(color, r, ring = false) {
    const key = `${color}|${r}|${ring}|${k}`;
    if (dotCache.has(key)) return dotCache.get(key);
    const dpr = Math.min(3, (window.devicePixelRatio || 1) * Math.max(1, k));
    const ext = r * 3.2;
    const c = document.createElement('canvas');
    c.width = c.height = Math.ceil(ext * 2 * dpr);
    const g = c.getContext('2d');
    g.scale(dpr, dpr);
    const grd = g.createRadialGradient(ext, ext, 0, ext, ext, ext);
    grd.addColorStop(0, ctx.alpha(color, ring ? 0.32 : 0.55));
    grd.addColorStop(0.35, ctx.alpha(color, ring ? 0.14 : 0.22));
    grd.addColorStop(1, ctx.alpha(color, 0));
    g.fillStyle = grd;
    g.fillRect(0, 0, ext * 2, ext * 2);
    if (ring) {
      g.strokeStyle = mix(color, '#FFFFFF', 0.35);
      g.lineWidth = Math.max(1.1, r * 0.34);
      g.beginPath(); g.arc(ext, ext, r, 0, TAU); g.stroke();
    } else {
      g.fillStyle = mix(color, '#FFFFFF', 0.4);
      g.beginPath(); g.arc(ext, ext, r, 0, TAU); g.fill();
    }
    const out = { c, ext };
    dotCache.set(key, out);
    return out;
  }
  const blit = (g, s, x, y, a) => { g.globalAlpha = a; g.drawImage(s.c, x - s.ext, y - s.ext, s.ext * 2, s.ext * 2); };

  // ------------------------------------------------------------------ SVG: scene frame, strip, labels, charts
  let A = {};
  function drawSVG() {
    for (const svg of [bg, fg]) {
      for (const n of [...svg.children]) if (n !== svg.defs) n.remove();
      svg.setAttribute('viewBox', `0 0 ${L.vb[0]} ${L.vb[1]}`);
    }
    ctx.refreshTextScale();
    A = {};
    const s = L.scene;
    const clipId = `${ctx.id}-scene-clip`;            // stable, page-unique; replaced on re-layout
    bg.defs.querySelector(`#${clipId}`)?.remove();
    const cp = S('clipPath', { id: clipId }, bg.defs);
    S('rect', { x: s.x, y: s.y, width: s.w, height: s.h, rx: layoutName === 'wide' ? 14 : 0 }, cp);
    const sceneBg = S('g', { 'clip-path': `url(#${clipId})` }, bg);
    S('rect', { x: s.x, y: s.y, width: s.w, height: s.h, style: 'fill: rgb(20 28 58 / 0.55)' }, sceneBg);
    const tf = tissueField({ width: s.w, height: s.h, seed: 4, stage: 'dark', density: 0.7 });
    tf.setAttribute('transform', `translate(${s.x} ${s.y})`);
    sceneBg.append(tf);
    if (layoutName === 'wide') S('rect', { x: s.x + 0.5, y: s.y + 0.5, width: s.w - 1, height: s.h - 1, rx: 14, style: 'fill: none; stroke: var(--line); stroke-width: 1' }, bg);
    // Phones: lift the label clear of the receptor strip and its drug antibodies.
    S('text', { class: 't-caps t-halo', x: s.x + 14, y: s.y + s.h - (layoutName === 'wide' ? 14 : 46), text: 'Bone marrow', style: 'fill: var(--fg-3)' }, fg);

    // ---------- the receptor strip (body cells' IL-6 receptors)
    const st = L.strip;
    const stripG = S('g', { class: 'crs-strip' }, fg);
    const sand = PALETTE.healthy;
    const thick = 10;
    if (st.dir === 'v') {
      S('rect', { x: st.at, y: st.from - 18, width: 26, height: st.to - st.from + 36, rx: 8, style: `fill: ${mix(sand, '#0B1024', 0.72)}; opacity: 0.9` }, stripG);
      S('rect', { x: st.at, y: st.from - 18, width: thick, height: st.to - st.from + 36, rx: 4, style: `fill: ${mix(sand, '#0B1024', 0.45)}; stroke: ${mix(sand, '#FFFFFF', 0.1)}; stroke-width: 1; stroke-opacity: 0.6` }, stripG);
    } else {
      S('rect', { x: st.from - 18, y: st.at, width: st.to - st.from + 36, height: 22, rx: 8, style: `fill: ${mix(sand, '#0B1024', 0.72)}; opacity: 0.9` }, stripG);
      S('rect', { x: st.from - 18, y: st.at, width: st.to - st.from + 36, height: thick, rx: 4, style: `fill: ${mix(sand, '#0B1024', 0.45)}; stroke: ${mix(sand, '#FFFFFF', 0.1)}; stroke-width: 1; stroke-opacity: 0.6` }, stripG);
    }
    A.receptors = [];
    A.recHeads = [];
    const rs = layoutName === 'wide' ? 22 : 18;
    for (let i = 0; i < st.n; i++) {
      const p = lerp(st.from, st.to, st.n > 1 ? i / (st.n - 1) : 0.5);
      const gx = st.dir === 'v' ? st.at : p, gy = st.dir === 'v' ? p : st.at;
      const holder = S('g', { transform: `translate(${gx} ${gy}) rotate(${st.dir === 'v' ? -90 : 0})` }, stripG);
      const rc = receptor({ size: rs, profile: 'round', color: mix(sand, '#FFFFFF', 0.15), stage: 'dark' });
      holder.append(rc);
      A.receptors.push(rc);
      const head = st.dir === 'v' ? { x: gx - rs * 0.9, y: gy } : { x: gx, y: gy - rs * 0.9 };
      A.recHeads.push(head);
    }
    A.drugLayer = S('g', { class: 'crs-drugs' }, stripG);
    const sl = L.stripLabel;
    const lab = S('text', { class: 't-small t-halo', x: sl.x, y: sl.y, 'text-anchor': sl.anchor, style: 'fill: var(--fg-2)' }, fg);
    sl.lines.forEach((ln, i) => S('tspan', { x: sl.x, dy: i ? 15 : 0, text: ln }, lab));
    if (layoutName === 'wide') lab.setAttribute('y', String(sl.y - 15 * (sl.lines.length - 1)));

    // in-scene labels (fade with time)
    const lbl = (text, x, y, anchor = 'start') => S('text', { class: 't-small t-halo', x, y, 'text-anchor': anchor, text, opacity: 0, style: 'fill: var(--fg)' }, fg);
    const B = sceneBounds();
    A.lblT = lbl('CAR-T cells', B.x0 + 30, B.y0 + 26);
    A.lblC = lbl('Cancer cells', (B.x0 + B.x1) / 2, B.y0 + 26, 'middle');
    const m0 = L.cells.macs[0];
    A.lblM = lbl('Macrophage (the patient’s own)', m0[0], m0[1] + L.cells.rm + 22, 'middle');
    const m1 = L.cells.macs[layoutName === 'wide' ? 3 : 2];
    A.lblI = lbl('IL-6', m1[0] + L.cells.rm + 14, m1[1] - L.cells.rm * 0.4);
    A.lblI.setAttribute('class', 't-label t-halo');

    // ---------- charts
    const P = L.plots;
    const root = chartRoot(fg, { theme: 'stage-dark' });
    A.x = scale({ domain: [0, T_END], range: [P.x0, P.x1] });
    A.yC = scale({ type: 'log', domain: [0.6, 1500], range: [P.A[1], P.A[0]] });
    A.yT = scale({ domain: [36.6, 41], range: [P.B[1], P.B[0]] });
    A.yL = scale({ domain: [0, 1.12], range: [A.yT(37), P.B[0]] });   // IL-6 rises from the same baseline
    const dayTicks = layoutName === 'wide' ? [0, 2, 4, 6, 8, 10, 12, 14] : [0, 2, 4, 6, 8, 10, 12, 14];
    S('text', { class: 't-caps', x: P.x0, y: P.titleA, text: 'CAR-T cells in the blood' }, root);
    axis(root, { scale: A.yC, orient: 'left', at: P.x0, ticks: [1, 10, 100, 1000], format: (v) => (v >= 1000 ? '1,000×' : `${v}×`), grid: [P.x0, P.x1], tickSize: 0 });
    axis(root, { scale: A.x, orient: 'bottom', at: P.A[1], ticks: dayTicks, labels: false, tickSize: 4 });
    S('text', { class: 't-caps', x: P.x0, y: P.titleB, text: layoutName === 'wide' ? 'IL-6, and the patient’s temperature' : 'IL-6 and temperature' }, root);
    axis(root, { scale: A.yT, orient: 'left', at: P.x0, ticks: [37, 38, 39, 40], format: (v) => `${v}°`, grid: null, tickSize: 0 });
    axis(root, { scale: A.x, orient: 'bottom', at: P.axisY, ticks: dayTicks, format: (v) => String(v), tickSize: 4 });
    S('text', { class: 't-small t-mid', x: (P.x0 + P.x1) / 2, y: P.axisTitle, text: 'Days after infusion', style: 'fill: var(--fg-2)' }, root);
    S('text', { class: 't-caps t-mid', x: (P.x0 + P.x1) / 2, y: P.note, text: 'Illustrative time course', style: 'fill: var(--fg-3)' }, root);
    // normal / fever reference lines (°C)
    threshold(root, { y: A.yT(37), x0: P.x0, x1: P.x1, dash: '2 4', color: C.ink3 });
    const fev = threshold(root, { y: A.yT(38), x0: P.x0, x1: P.x1, dash: '5 4', color: C.ink2, label: 'fever', labelPos: 'end' });
    fev.label.setAttribute('style', 'fill: var(--fg-2)');
    // live marks
    const tempFill = 'rgb(232 166 90 / 0.22)';
    A.tempArea = S('path', { d: '', style: `fill: ${tempFill}; stroke: none` }, root);
    A.tempLine = S('path', { d: '', style: `fill: none; stroke: ${C.s3}; stroke-width: 1.4; stroke-opacity: 0.85` }, root);
    A.il6 = line(root, [[P.x0, P.B[1]]], { color: C.stroke('macrophage'), width: 2.6 });
    A.carT = line(root, [[P.x0, P.A[1]]], { color: C.stroke('cd8'), width: 2.6 });
    A.now = S('line', { x1: P.x0, x2: P.x0, y1: P.A[0] - 6, y2: P.axisY, style: 'stroke: var(--fg-3); stroke-width: 1; stroke-dasharray: 2 3', opacity: 0 }, root);
    A.drugMark = S('g', { opacity: 0 }, root);
    A.drugLine = S('line', { x1: 0, x2: 0, y1: P.B[0] - 4, y2: P.axisY, style: `stroke: ${PALETTE.drug}; stroke-width: 1.5` }, A.drugMark);
    A.drugText = S('text', { class: 't-small', x: 0, y: P.B[0] - (layoutName === 'wide' ? 8 : 6), 'text-anchor': 'middle', text: 'tocilizumab', style: `fill: ${PALETTE.drug}` }, A.drugMark);
    // keys inside plot B (top right)
    const kx = P.x1 - (layoutName === 'wide' ? 116 : 104), ky = P.B[0] + 12;
    const keys = S('g', {}, root);
    S('line', { x1: kx, x2: kx + 16, y1: ky - 4, y2: ky - 4, style: `stroke: ${C.stroke('macrophage')}; stroke-width: 2.6; stroke-linecap: round` }, keys);
    S('text', { class: 't-small t-halo', x: kx + 22, y: ky, text: 'IL-6' }, keys);
    S('rect', { x: kx, y: ky + 9, width: 16, height: 10, rx: 2, style: `fill: ${tempFill}; stroke: ${C.s3}; stroke-width: 1` }, keys);
    S('text', { class: 't-small t-halo', x: kx + 22, y: ky + 18, text: 'temperature' }, keys);
    A.labelCar = S('text', { class: 't-small t-halo', x: 0, y: 0, text: 'CAR-T', opacity: 0, style: `fill: var(--fg)` }, root);
  }

  // ------------------------------------------------------------------ sim step
  function step(dt) {
    if (t >= T_END) return;
    t = Math.min(T_END, t + dt / DAY_S);
    const M = model(t, burden, tb);
    const B = sceneBounds();
    const CL = L.cells;

    // fever → the treatment becomes available
    if (!feverOn && M.temp >= 38) { feverOn = true; if (plan === 'block') giveDrug(); }

    // expansion / contraction of the CAR-T population (follows the model)
    const want = Math.round(3 + (CL.tMax - 3) * (M.logC / C_MAX));
    const live = ts.filter((a) => !a.fade && !a.dead);
    const pending = live.filter((a) => a.pinch).length;
    if (live.length + pending < want) {
      const free = live.filter((a) => !a.pinch && !(a.busy > 0));
      const mother = free.length ? free[Math.floor(R() * free.length)] : null;
      if (mother) {
        divisionPinch(fx, mother, { duration: 0.8, gap: 0.8, seed: mother.id, onSplit: (a, ang, p) => {
          const d = newT(p.x, p.y, ang);
          d.variant = a.variant;
          ts.push(d);
        } });
      }
    } else if (live.length > want && !pending) {
      const free = live.filter((a) => !(a.busy > 0) && !a.pinch);
      const old = free.length ? free[Math.floor(R() * free.length)] : null;
      if (old && R() < dt * 2) old.fade = 0.0001;      // contraction: a few at a time
    }

    // T cells: hunt while the model says tumor should be falling, else patrol
    const liveC = cancers.filter((c) => !c.dying && !c.dead);
    const wantC = Math.round((burden === 'high' ? CL.nHigh : CL.nLow) * M.F);
    const hunting = liveC.length > wantC;
    const TB = { x0: B.x0 + CL.rt, y0: B.y0 + CL.rt, x1: B.x1 - CL.rt * 1.6, y1: B.y1 - CL.rt };
    const chased = new Set(ts.filter((q) => q.goal && !q.goal.dying && !q.goal.dead).map((q) => q.goal.id));
    hash.build([...ts, ...cancers.filter((c) => !c.dead), ...macs]);
    for (const a of ts) {
      if (a.dead) continue;
      if (a.fade) { a.fade += dt / 1.6; a.alpha = 1 - clamp(a.fade, 0, 1); if (a.fade >= 1) a.dead = true; continue; }
      if (a.busy > 0) {
        a.busy -= dt;
        if (a.busy <= 0.25 && a.prey && !a.prey.dying) {
          killSpecks(fx, a.prey, { color: PALETTE.cancer, seed: a.prey.id });
          const cx = (a.x + a.prey.x) / 2, cy = (a.y + a.prey.y) / 2;
          emitSignals(cx, cy, a.prey.id);
        }
        continue;
      }
      let bias = null;
      if (hunting && liveC.length) {
        // each CAR-T cell keeps its own quarry (nearest one nobody else is chasing)
        if (!a.goal || a.goal.dying || a.goal.dead || a.goal.claimed) {
          let best = null, bd = 1e9;
          for (const c of liveC) {
            if (c.claimed || chased.has(c.id)) continue;
            const d = Math.hypot(c.x - a.x, c.y - a.y);
            if (d < bd) { bd = d; best = c; }
          }
          a.goal = best || liveC[Math.floor(R() * liveC.length)];
        }
        if (a.goal) { chased.add(a.goal.id); bias = { x: a.goal.x, y: a.goal.y, strength: 2.6 }; }
      } else a.goal = null;
      a.speed = hunting && liveC.length - wantC >= 2 ? 62 : 34;
      walk(a, dt, { speed: a.speed, turn: 1.6, bias, bounds: TB });
      if (hunting) {
        hash.near(a.x, a.y, a.r + CL.rc + 4, near);
        for (const c of near) {
          if (c.kind !== 'c' || c.dying || c.dead || c.claimed) continue;
          c.claimed = true;
          a.busy = 0.75;
          a.prey = c;
          contactRing(fx, (a.x + c.x) / 2, (a.y + c.y) / 2, { color: PALETTE.cd8, r: 10, life: 0.8 });
          break;
        }
      }
    }
    relax(ts.filter((a) => !a.dead), { hash, strength: 0.5, pad: L.cells.rt * 0.7 });
    ts = ts.filter((a) => !a.dead);
    for (const c of cancers) if (c.dying && c.dying >= 1) c.dead = true;

    // macrophages: reached by CAR-T signals → swell, brighten, release IL-6 (rate follows the model)
    for (const m of macs) {
      const target = m.reached ? Math.max(0.25, clamp(M.L / 0.12, 0, 1)) : 0;
      m.a += (target - m.a) * clamp(dt * 1.4, 0, 1);
      if (m.reached && M.L > 0.002) {
        const rate = L.emit * M.L;
        const acc = (emitAcc.get(m.id) || 0) + rate * dt;
        let n = Math.floor(acc);
        emitAcc.set(m.id, acc - n);
        while (n-- > 0) {
          const ang = R() * TAU;
          const rr = m.r * (0.75 + 0.15 * m.a);
          parts.push({ kind: 'il6', x: m.x + Math.cos(ang) * rr, y: m.y + Math.sin(ang) * rr, vx: Math.cos(ang) * R.range(16, 30), vy: Math.sin(ang) * R.range(16, 30), age: 0, life: R.range(6.5, 9.5), seed: R() });
        }
      }
    }

    // particles
    const st = L.strip;
    const blocked = M.blk > 0.5;
    for (const p of parts) {
      p.age += dt;
      const g = R.gauss(), g2 = R.gauss();
      p.vx += g * 26 * Math.sqrt(dt); p.vy += g2 * 26 * Math.sqrt(dt);
      if (p.kind === 'il6') {
        // gentle drift toward the receptors (bulk flow toward the rest of the body)
        if (st.dir === 'v') p.vx += 15 * dt; else p.vy += 15 * dt;
      } else if (p.to) {
        const dx = p.to.x - p.x, dy = p.to.y - p.y, d = Math.hypot(dx, dy) || 1;
        p.vx += (dx / d) * 34 * dt; p.vy += (dy / d) * 34 * dt;
      }
      const damp = Math.exp(-dt * 0.9);
      p.vx *= damp; p.vy *= damp;
      p.x += p.vx * dt; p.y += p.vy * dt;
      // walls of the scene (soft), except toward the receptor strip
      if (p.x < B.x0) { p.x = B.x0; p.vx = Math.abs(p.vx); }
      if (p.y < B.y0) { p.y = B.y0; p.vy = Math.abs(p.vy); }
      if (st.dir === 'v' && (p.y > B.y1)) { p.y = B.y1; p.vy = -Math.abs(p.vy); }
      if (st.dir === 'h' && (p.x > B.x1)) { p.x = B.x1; p.vx = -Math.abs(p.vx); }
      if (p.kind !== 'il6') {
        if (st.dir === 'v' && p.x > B.x1) { p.x = B.x1; p.vx = -Math.abs(p.vx); }
        if (st.dir === 'h' && p.y > B.y1) { p.y = B.y1; p.vy = -Math.abs(p.vy); }
        for (const m of macs) {
          if (Math.hypot(m.x - p.x, m.y - p.y) < m.r * 0.95) { p.dead = true; if (!m.reached) m.reached = t; break; }
        }
      } else {
        const edge = st.at - 4;
        const pos = st.dir === 'v' ? p.x : p.y;
        if (pos > edge) {
          if (blocked) {
            if (st.dir === 'v') { p.x = edge - 1; p.vx = -Math.abs(p.vx) * 0.9 - 14; } else { p.y = edge - 1; p.vy = -Math.abs(p.vy) * 0.9 - 14; }
            p.bounce = 0.5;
          } else {
            p.dead = true;
            const along = st.dir === 'v' ? p.y : p.x;
            const i = clamp(Math.round(((along - st.from) / (st.to - st.from)) * (st.n - 1)), 0, st.n - 1);
            hits[i] = Math.min(1, hits[i] + 0.35);
          }
        }
        if (p.bounce) p.bounce = Math.max(0, p.bounce - dt);
      }
      if (p.age > p.life) p.dead = true;
    }
    parts = parts.filter((p) => !p.dead);
    if (parts.length > 520) parts.splice(0, parts.length - 520);
    for (let i = 0; i < hits.length; i++) hits[i] = Math.max(0, hits[i] - dt * 1.2);
    fx.step(dt);
    if (t >= T_END) onEnd();
  }

  function emitSignals(x, y, seed) {
    const r2 = rng(seed * 31 + 7);
    // CAR-T signals go out toward the host's macrophages (diffusion + a little drift)
    const targets = macs.slice().sort((a, b) => Math.hypot(a.x - x, a.y - y) - Math.hypot(b.x - x, b.y - y));
    for (let i = 0; i < 4; i++) {
      const to = targets[i % 2 === 0 ? 0 : Math.min(1, targets.length - 1)];
      const ang = Math.atan2(to.y - y, to.x - x) + r2.range(-0.9, 0.9);
      const sp = r2.range(22, 34);
      parts.push({ kind: i < 2 ? 'ifn' : 'tnf', x, y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, age: 0, life: 7, to });
    }
  }

  // ------------------------------------------------------------------ render
  function render() {
    const g = cv.g;
    cv.clear();
    if (!sheet) return;
    const M = model(t, burden, tb);
    g.save();
    g.scale(k, k);
    const s = L.scene;
    g.beginPath();
    if (g.roundRect && layoutName === 'wide') g.roundRect(s.x, s.y, s.w, s.h, 14); else g.rect(s.x, s.y, s.w, s.h);
    g.clip();

    // macrophages (dim until reached; then swell + coral halo)
    const coral = PALETTE.macrophage;
    for (const m of macs) {
      if (m.a > 0.02) {
        const halo = g.createRadialGradient(m.x, m.y, m.r * 0.6, m.x, m.y, m.r * (1.9 + 0.5 * m.a));
        halo.addColorStop(0, ctx.alpha(coral, 0.28 * m.a));
        halo.addColorStop(1, ctx.alpha(coral, 0));
        g.globalAlpha = 1;
        g.fillStyle = halo;
        g.beginPath(); g.arc(m.x, m.y, m.r * (1.9 + 0.5 * m.a), 0, TAU); g.fill();
      }
      const sc = 1 + 0.16 * m.a;
      const a0 = (1 - clamp(m.a * 1.6, 0, 1)) * (m.reached ? 0.85 : 0.3);
      if (a0 > 0.01) sheet.draw(g, { x: m.x, y: m.y, variant: m.variant, scale: sc, alpha: a0 }, { state: 'm0' });
      if (m.a > 0.01) sheet.draw(g, { x: m.x, y: m.y, variant: m.variant, scale: sc, alpha: clamp(m.a * 1.6, 0, 1) }, { state: 'm1' });
    }
    // cancer cells
    for (const c of cancers) if (!c.dead) sheet.draw(g, { ...c, state: 'c' });
    // CAR-T cells
    for (const a of ts) sheet.draw(g, { x: a.x, y: a.y, variant: a.variant, alpha: a.alpha, pinch: a.pinch, r: a.r, rotation: a.heading }, { state: 't' });
    fx.draw(g);

    // signals
    const il6 = dotSprite(coral, layoutName === 'wide' ? 2.4 : 2.1);
    const ifn = dotSprite(PALETTE.cd8, layoutName === 'wide' ? 3.1 : 2.7, true);
    const tnf = dotSprite(PALETTE.cd8, layoutName === 'wide' ? 1.9 : 1.7);
    for (const p of parts) {
      const a = Math.min(1, p.age / 0.3) * (1 - clamp((p.age - p.life + 1.2) / 1.2, 0, 1));
      blit(g, p.kind === 'il6' ? il6 : p.kind === 'ifn' ? ifn : tnf, p.x, p.y, a);
    }
    g.restore();

    // receptor glow when IL-6 docks (outside the clip: the strip sits at the scene's edge)
    g.save();
    g.scale(k, k);
    A.recHeads.forEach((h, i) => {
      const v = hits[i];
      if (v < 0.02) return;
      const grd = g.createRadialGradient(h.x, h.y, 0, h.x, h.y, 16);
      grd.addColorStop(0, ctx.alpha(coral, 0.55 * v));
      grd.addColorStop(1, ctx.alpha(coral, 0));
      g.globalAlpha = 1;
      g.fillStyle = grd;
      g.beginPath(); g.arc(h.x, h.y, 16, 0, TAU); g.fill();
    });
    g.restore();
    g.globalAlpha = 1;

    renderCharts(M);
    renderLabels(M);
    const day = Math.floor(t + 1e-6);
    if (day !== shownDay) { shownDay = day; clock.set(`Day ${day}`); }
  }
  let shownDay = -1;

  function series(fn, t1, n = 140) {
    const out = [];
    for (let i = 0; i <= n; i++) { const tt = (t1 * i) / n; out.push([tt, fn(tt)]); }
    return out;
  }
  function renderCharts(M) {
    const P = L.plots;
    const n = Math.max(2, Math.round(t * 12));
    const cs = series((tt) => 10 ** model(tt, burden, tb).logC, t, n).map(([tt, v]) => [A.x(tt), A.yC(v)]);
    A.carT.path.setAttribute('d', pathD(cs));
    const ls = series((tt) => model(tt, burden, tb).L, t, n).map(([tt, v]) => [A.x(tt), A.yL(v)]);
    A.il6.path.setAttribute('d', pathD(ls));
    const ts2 = series((tt) => model(tt, burden, tb).temp, t, n).map(([tt, v]) => [A.x(tt), A.yT(v)]);
    A.tempLine.setAttribute('d', pathD(ts2));
    const base = A.yT(37);
    A.tempArea.setAttribute('d', ts2.length ? `${pathD(ts2)}L${ts2[ts2.length - 1][0]},${base}L${ts2[0][0]},${base}Z` : '');
    const nx = A.x(t);
    A.now.setAttribute('x1', nx); A.now.setAttribute('x2', nx);
    A.now.setAttribute('opacity', t > 0.05 && t < T_END ? 1 : 0);
    if (tb != null) {
      const bx = A.x(tb);
      A.drugLine.setAttribute('x1', bx); A.drugLine.setAttribute('x2', bx);
      A.drugText.setAttribute('x', clamp(bx, P.x0 + 40, P.x1 - 40));
      A.drugMark.setAttribute('opacity', 1);
    } else A.drugMark.setAttribute('opacity', 0);
    const last = cs[cs.length - 1];
    if (last && t > 2.6) {
      A.labelCar.setAttribute('x', Math.min(last[0] + 8, P.x1 - 40));
      A.labelCar.setAttribute('y', last[1] - 8);
      A.labelCar.setAttribute('opacity', 1);
    } else A.labelCar.setAttribute('opacity', 0);
    void M;
  }
  function renderLabels(M) {
    const early = 1 - clamp((t - 1.6) / 0.8, 0, 1);
    A.lblT.setAttribute('opacity', (t < 0.02 ? 1 : early).toFixed(2));
    A.lblC.setAttribute('opacity', (t < 0.02 ? 1 : early).toFixed(2));
    const first = macs.filter((m) => m.reached).sort((a, b) => a.reached - b.reached)[0];
    if (first && A.lblFor !== first) {
      A.lblFor = first;
      const B = sceneBounds();
      const below = first.y + first.r + 26 < B.y1 - 20;
      A.lblM.setAttribute('x', clamp(first.x, B.x0 + 110, B.x1 - 110));
      A.lblM.setAttribute('y', below ? first.y + first.r * 1.2 + 22 : first.y - first.r * 1.2 - 12);
      const right = first.x + first.r + 60 < B.x1;
      A.lblI.setAttribute('x', right ? first.x + first.r * 1.3 + 8 : first.x - first.r * 1.3 - 8);
      A.lblI.setAttribute('text-anchor', right ? 'start' : 'end');
      A.lblI.setAttribute('y', first.y - first.r * 0.6);
    }
    A.lblM.setAttribute('opacity', first ? clamp((first.a - 0.2) * 3, 0, 1).toFixed(2) : '0');
    A.lblI.setAttribute('opacity', first ? clamp((M.L - 0.06) * 6, 0, 1).toFixed(2) : '0');
  }

  // ------------------------------------------------------------------ treatment (receptor block)
  let drugs = [];
  function clearDrugs() {
    drugs.forEach((h) => h.stop && h.stop());
    drugs = [];
    if (A.drugLayer) A.drugLayer.replaceChildren();
  }
  function giveDrug() {
    if (tb != null) return;
    tb = t;
    const sz = layoutName === 'wide' ? 24 : 20;
    A.receptors.forEach((rc, i) => {
      const ab = antibody({ variant: 'therapeutic', size: sz, stage: 'dark' });
      // the drug lives in the receptors' frame (each receptor sits in its own rotated holder)
      rc.parentNode.append(ab);
      const h = CA.run.dockAntibody(ab, rc, { duration: 1.2 + i * 0.05, arm: i % 2 ? 'left' : 'right' });
      ctx.track(h);
      drugs.push(h);
    });
    blockedUI = true;
    ctx.announce('Tocilizumab given: the drug binds the IL-6 receptors and blocks IL-6 signaling. The macrophages keep secreting IL-6, the fever falls within hours, and the CAR-T cells keep expanding and killing.');
  }

  // ------------------------------------------------------------------ controls
  let ready = false;
  const loop = ctx.loop((dt) => { if (!ready) return; stepper(dt); render(); });
  const stepper = fixedStep(step, { dt: 1 / 60, max: 6 });
  function onEnd() {
    loop.pause();
    ctx.announce(tb == null
      ? `Day 14. Without treatment the fever ran its course; the CAR-T cells expanded about ${burden === 'high' ? 'six hundred' : 'a hundred'}-fold and cleared the cancer.`
      : 'Day 14. The fever subsided once the IL-6 receptor was blocked, and the CAR-T cells still expanded and cleared the cancer.');
  }
  const play = ctx.ui.playPause({ loop, onChange: (on) => { if (on && t >= T_END) { restart(); } } });
  play.el.classList.add('crs-iconable');
  const replay = ctx.ui.button({ label: 'Replay', icon: 'replay', variant: 'ghost', onClick: () => { restart(); if (!loop.playing) loop.play(); } });
  replay.el.classList.add('crs-iconable');
  replay.el.setAttribute('aria-label', 'Replay from day 0');
  const burdenSeg = ctx.ui.segmented({
    label: 'Tumor burden',
    hideLabel: true,
    options: [{ value: 'low', label: 'Low tumor burden' }, { value: 'high', label: 'High tumor burden' }],
    value: burden,
    onChange: (v) => { burden = v; restart(); if (!loop.playing && !ctx.reducedMotion) loop.play(); ctx.announce(`Tumor burden: ${v}. Restarting from day 0.`); },
  });
  // Pre-armed treatment (POLISH B7): "Block … at fever" gives the drug at the 38 °C crossing.
  // Chosen during a run: before the crossing it waits for it; between the crossing and the
  // fever's peak it is given at once; after the peak (or once the run is over) the run replays
  // with the drug, so the reader always sees the fever being switched off. Choosing "Do nothing"
  // after the drug was given replays without it.
  const PEAK = (b) => BURDEN[b].tPeak - 0.6;               // IL-6 and temperature peak (model)
  const treat = ctx.ui.segmented({
    label: 'Treatment',
    hideLabel: true,
    options: [{ value: 'none', label: 'Do nothing' }, { value: 'block', label: 'Block the IL-6 receptor at fever (tocilizumab)' }],
    value: plan,
    onChange: (v) => {
      plan = v;
      const replayWith = (msg) => { restart(); if (!loop.playing && !ctx.reducedMotion) loop.play(); ctx.announce(msg); };
      if (v === 'block') {
        if (tb != null) return;
        if (t >= T_END || t > PEAK(burden)) replayWith('The fever had already peaked, so the run starts again from day 0; this time tocilizumab is given as soon as the fever starts.');
        else if (feverOn) giveDrug();
        else ctx.announce('Tocilizumab will be given as soon as the temperature reaches 38 °C.');
      } else if (tb != null) {
        replayWith('Starting again from day 0 without the drug.');
      } else ctx.announce('No treatment in this run.');
    },
  });
  const treatButtons = [...treat.el.querySelectorAll('.segmented__opt')];
  treatButtons[1]?.setAttribute('aria-label', 'Block the IL-6 receptor with tocilizumab as soon as the fever starts');
  const legend = ctx.ui.legend([
    { label: 'CAR-T cell', color: ctx.colors.cd8, shape: 'glow' },
    { label: 'Cancer cell', color: ctx.colors.cancer, shape: 'glow' },
    { label: 'Macrophage (the patient’s own)', color: ctx.colors.macrophage, shape: 'glow' },
    { label: 'IFN-γ, TNF (from CAR-T cells)', color: ctx.colors.cd8, shape: 'ring' },
    { label: 'IL-6 (from macrophages)', color: ctx.colors.macrophage, shape: 'circle' },
  ], { parent: null });
  legend.el.classList.add('crs-legend');
  const note = ctx.h('p', { class: 'crs-note', text: 'Corticosteroids also settle this syndrome; because they act on T cells directly, they are used second for the fever and first for the neurological syndrome.' });
  ctx.controls.after(legend.el);
  legend.el.after(note);

  function restart() {
    resetSim();
    shownDay = -1;
    if (ctx.reducedMotion) { stillFrame(); return; }
    render();
  }
  /** Reduced motion: a meaningful still (day 9 of an untreated run), Play continues from there. */
  function stillFrame() {
    const steps = Math.round(9 * DAY_S * 60);
    for (let i = 0; i < steps; i++) step(1 / 60);
    render();
  }

  // ------------------------------------------------------------------ layout
  async function relayout() {
    ready = false;
    L = LAYOUTS[layoutName];
    k = cv.width / L.vb[0];
    dotCache.clear();
    drawSVG();
    await buildSprites();
    ready = true;
    restart();
  }
  k = cv.width / L.vb[0];
  drawSVG();
  await buildSprites();
  resetSim();
  ready = true;
  if (ctx.reducedMotion) stillFrame(); else render();

  const burdenBtns = [...burdenSeg.el.querySelectorAll('.segmented__opt')];
  const burdenText = (compact) => burdenBtns.forEach((b, i) => {
    const tn = [...b.childNodes].reverse().find((n) => n.nodeType === 3);
    if (tn) tn.textContent = `${i ? 'High' : 'Low'} ${compact ? '' : 'tumor '}burden`;
    const tt = [...(treatButtons[1]?.childNodes || [])].reverse().find((n) => n.nodeType === 3);
    if (tt) tt.textContent = compact ? 'Block IL-6 receptor at fever' : 'Block the IL-6 receptor at fever (tocilizumab)';
  });
  ctx.onResize(({ compact }) => {
    burdenText(compact);
    const next = compact ? 'compact' : 'wide';
    const nk = cv.width / LAYOUTS[next].vb[0];
    if (next !== layoutName) { layoutName = next; relayout(); return; }
    if (Math.abs(nk - k) > 0.01) { k = nk; dotCache.clear(); render(); }
  });
  void gsap; void play;

  return { destroy() { loop.pause(); clearDrugs(); note.remove(); legend.el.remove(); } };
}
