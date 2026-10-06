// ch07-immunoediting — "Evolution under police pressure" (Figure 7.2, build task F15)
//
// An agent-based simulation of a varied tumor under T-cell pressure. Each cancer cell has a
// visibility v (how strongly it displays neoantigens), shown by ONE encoding: 0–4 pink dots.
// T cells patrol, touch cells and kill with a probability that rises with v; cells never change
// their own v — it changes only by random inheritance at division, plus selection. Recently
// engaged T cells also hold back the division of cells near them (IFN-γ-like cytostasis), which
// lapses once there is nothing left to recognize. Elimination, equilibrium and escape emerge from
// that; nothing is scripted. A "transplant test" moves 40 cells into a fresh, strong host.
//
// Layout: one dark stage = a square canvas patch (left / top) + dark-native SVG charts
// (chart.js theme 'stage-dark', FIGURE-AUDIT §4.1). Rules honored: §4.5/6 (contact ring, crowd kill
// = shrink + specks), §4.15 (the hidden variant = hue shift + matte + hatch), §4.16 (phase HUD,
// phase bands), §4.17/19 ("Illustrative" + "Time compressed", no percentages), §4.20 (chart tokens).
//
// The model (createSim / phaseDetector) is DOM-free and exported so it can be tuned headlessly.
import { PALETTE, shiftHue, redBloodCell, sprite, drawSprite } from '../art/index.js';
import { rng, fixedStep, rateToP, spatialHash, walk, relax, spriteStates, createEffects, killSpecks, contactRing } from './shared/agents.js';
import { C, scale, chartRoot, axis, axisBreak, hatchFill } from './shared/chart.js';

const TAU = Math.PI * 2;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const easeOut = (t) => 1 - (1 - t) ** 3;

// ====================================================================== model
export const PARAMS = {
  world: 400, rC: 6, rT: 4, N0: 40, K: 600,
  b: 0.3,                       // division rate per s (logistic: × (1 − N/K))
  sd: 0.04, bigLoss: 0.003, lossFactor: 0.1,   // inheritance of v at division
  vHi: [0.4, 1], vLo: [0.13, 0.4], loFrac: 0.3, // founders: varied from the start (every one shows ≥ 1 dot)
  pack: 1.3,
  T: { off: 0, on: 12, strong: 24 },
  tSpeed: 40, seekR: 80, turn: 1.4, startR: [45, 120],
  qMax: 0.9, qExp: 1.4,         // kill probability per contact q = 0.9 v^1.4 (0 for a 0-dot cell)
  killPause: 0.8, memory: 2.5,  // after a kill the T cell pauses; it re-tests a cell only after `memory` s
  supR: 25, supMult: 0.2, actTau: 3,           // cytostasis near recently engaged T cells
  recruit: 0.5, recruitCap: 2, recruitDecay: 0.12,
  spawnGap: 0.15,
};

export const dotsOf = (v) => Math.round(v * 4);
const tierOf = (dots) => (dots >= 3 ? 0 : dots >= 1 ? 1 : 2);   // easy | faint | hidden

export function createSim({ seed = 1, pressure = 'on', K, world, seedCells, params = {} } = {}) {
  const p = { ...PARAMS, ...params };
  if (K) p.K = K;
  if (world) p.world = world;
  const R = rng(seed);
  const W = p.world, cx = W / 2, cy = W / 2;
  const tumorR = W * 0.46;
  const vesselX = p.rT + 8;
  let nextId = 1;
  const cells = [];
  const tcells = [];
  const events = [];
  const hash = spatialHash(16);
  const near = [];
  const sim = { p, cells, tcells, events, t: 0, kills: 0, pressure, extra: 0, cx, cy, mx: cx, my: cy, seed, lastSpawn: -1, vesselX };

  const addCell = (x, y, v) => {
    const id = nextId++;
    const c = { id, x, y, r: p.rC, v, dots: dotsOf(v), sup: 0, born: sim.t, rot: (id * 2.39996) % TAU, variant: id % 4 };
    cells.push(c);
    return c;
  };
  const vs = seedCells || Array.from({ length: p.N0 }, () => (R() < p.loFrac ? R.range(p.vLo[0], p.vLo[1]) : R.range(p.vHi[0], p.vHi[1])));
  vs.forEach((v, i) => {
    const a = i * 2.39996 + R.range(-0.2, 0.2);
    const d = p.rC * p.pack * Math.sqrt(i + 0.5);
    const c = addCell(cx + Math.cos(a) * d, cy + Math.sin(a) * d, v);
    c.born = -10;
  });

  const target = () => p.T[sim.pressure] || 0;
  const addT = (x, y, enter) => {
    const id = nextId++;
    const a = { id, x, y, r: p.rT, heading: R.range(0, TAU), rng: rng(R.int(1, 1e9)), pause: 0, mem: new Map(), act: 0, alpha: enter ? 0 : 1, leaving: false, variant: id % 3 };
    if (enter) a.heading = R.range(-0.6, 0.6);
    tcells.push(a);
    return a;
  };
  // Patrolling killer T cells, already in the tissue around the young tumor.
  for (let i = 0; i < target(); i++) {
    const a = R.range(0, TAU), d = R.range(p.startR[0], p.startR[1]);
    addT(clamp(cx + Math.cos(a) * d, vesselX + 6, W - 6), clamp(cy + Math.sin(a) * d, 6, W - 6), false);
  }

  const bounds = { x0: 0, y0: 0, x1: W, y1: W };
  const qOf = (c) => (c.dots === 0 ? 0 : p.qMax * Math.pow(c.v, p.qExp));

  sim.setPressure = (pr) => { sim.pressure = pr; if (pr === 'off') sim.extra = 0; };

  sim.step = (dt) => {
    sim.t += dt;
    const t = sim.t;
    hash.build(cells);
    if (cells.length) {
      let sx = 0, sy = 0;
      for (const c of cells) { sx += c.x; sy += c.y; }
      sim.mx = sx / cells.length; sim.my = sy / cells.length;
    }
    // ---- T-cell numbers: base + recruited extra (more kills → more T cells arrive)
    const base = target();
    sim.extra *= Math.exp(-p.recruitDecay * dt);
    const want = base === 0 ? 0 : Math.round(base + sim.extra);
    let present = 0;
    for (const a of tcells) if (!a.leaving) present++;
    if (present < want && t - sim.lastSpawn >= p.spawnGap) { addT(vesselX, R.range(20, W - 20), true); sim.lastSpawn = t; }
    else if (present > want) {
      let pick = null;
      for (const a of tcells) if (!a.leaving && (!pick || a.act < pick.act)) pick = a;
      if (pick) pick.leaving = true;
    }
    // ---- T cells: patrol, touch, sometimes kill
    for (let i = tcells.length - 1; i >= 0; i--) {
      const a = tcells[i];
      if (a.leaving) { a.alpha -= dt / 0.8; if (a.alpha <= 0) { tcells.splice(i, 1); continue; } }
      else if (a.alpha < 1) a.alpha = Math.min(1, a.alpha + dt / 0.6);
      a.act *= Math.exp(-dt / p.actTau);
      for (const [id, exp] of a.mem) if (exp < t) a.mem.delete(id);
      if (a.pause > 0) { a.pause -= dt; continue; }
      if (a.leaving) { walk(a, dt, { speed: p.tSpeed * 0.5, turn: p.turn, bounds }); continue; }
      let best = null, bd = Infinity;
      hash.each(a.x, a.y, p.seekR, (c) => {
        if (a.mem.has(c.id)) return;
        const d = (c.x - a.x) ** 2 + (c.y - a.y) ** 2;
        if (d < bd) { bd = d; best = c; }
      });
      const bias = best ? Math.atan2(best.y - a.y, best.x - a.x) : (cells.length ? Math.atan2(sim.my - a.y, sim.mx - a.x) : null);
      walk(a, dt, { speed: p.tSpeed, turn: p.turn, bias: () => bias, bounds });
      hash.near(a.x, a.y, p.rT + p.rC + 1, near);
      for (const c of near) {
        if (c.dead || a.mem.has(c.id)) continue;
        a.mem.set(c.id, t + p.memory);
        if (c.dots === 0) break;                 // nothing on display: nothing to recognize
        a.act = 1;                               // recognition (the T cell engages)
        if (R() < qOf(c)) {
          c.dead = true;
          sim.kills++;
          a.pause = p.killPause;
          sim.extra = Math.min(base * (p.recruitCap - 1), sim.extra + p.recruit);
          events.push({ type: 'kill', cell: c, tcell: a });
        } else events.push({ type: 'miss', cell: c, tcell: a });
        break;
      }
    }
    for (let i = cells.length - 1; i >= 0; i--) if (cells[i].dead) cells.splice(i, 1);
    // ---- cytostasis: engaged T cells hold back division nearby
    for (const c of cells) c.sup = 0;
    for (const a of tcells) {
      if (a.leaving || a.act <= 0.01) continue;
      const s = a.act;
      hash.each(a.x, a.y, p.supR + p.rC, (c) => { if (s > c.sup) c.sup = s; });
    }
    // ---- division with inheritance (+ rare big loss: a shuttered window / lost dominant neoantigen)
    const crowd = Math.max(0, 1 - cells.length / p.K);
    const n0 = cells.length;
    for (let i = 0; i < n0; i++) {
      const c = cells[i];
      const rate = p.b * crowd * (1 - (1 - p.supMult) * c.sup);
      if (R() >= rateToP(rate, dt)) continue;
      let v = c.v + R.gauss() * p.sd;
      if (R() < p.bigLoss) v = c.v * p.lossFactor;
      v = clamp(v, 0, 1);
      const off = Math.hypot(c.x - sim.mx, c.y - sim.my) > 2;
      const ang = off ? Math.atan2(c.y - sim.my, c.x - sim.mx) + R.gauss() * 1.1 : R.range(0, TAU);
      const nc = addCell(c.x + Math.cos(ang) * p.rC * 0.9, c.y + Math.sin(ang) * p.rC * 0.9, v);
      events.push({ type: 'birth', cell: nc, parent: c });
    }
    // ---- mechanics
    hash.build(cells);
    relax(cells, { hash, iterations: 1, strength: 0.45 });
    for (const c of cells) {
      const dx = c.x - cx, dy = c.y - cy, d = Math.hypot(dx, dy);
      if (d > tumorR) { c.x = cx + dx / d * tumorR; c.y = cy + dy / d * tumorR; }
    }
  };

  sim.stats = () => {
    const n = [0, 0, 0];
    let sv = 0;
    for (const c of cells) { n[tierOf(c.dots)]++; sv += c.v; }
    const k = cells.length || 1;
    return { N: cells.length, easy: n[0] / k, faint: n[1] / k, hidden: n[2] / k, meanV: cells.length ? sv / k : 0 };
  };
  return sim;
}

/** Phase detection on N sampled at 4 Hz (smoothed over 2 s). */
export function phaseDetector({ N0 = 40 } = {}) {
  const S = [];
  const det = { phase: 'elimination', bands: [{ phase: 'elimination', t0: 0, t1: null }], done: null, quietSince: null, riseSince: null, lastQuiet: null, fell: false, smooth: N0, slope: 0, frozen: false };
  det.push = (t, N) => {
    S.push({ t, N, s: 0 });
    const k = S.length;
    let sum = 0, n = 0;
    for (let i = Math.max(0, k - 8); i < k; i++) { sum += S[i].N; n++; }
    const s = sum / n;
    S[k - 1].s = s;
    const back = S[Math.max(0, k - 13)];
    const slope = k > 12 ? (s - back.s) / (t - back.t) : 0;
    det.slope = slope; det.smooth = s;
    if (det.done || det.frozen) return;
    if (N === 0) { det.done = 'eliminated'; det.bands[det.bands.length - 1].t1 = t; return; }
    if (s < 0.9 * N0 || t >= 8) det.fell = true;
    const quiet = det.fell && k > 12 && Math.abs(slope) < Math.max(1, 0.05 * s) && s > 5 && s < 150;
    if (quiet) { if (det.quietSince == null) det.quietSince = t; det.lastQuiet = t; } else det.quietSince = null;
    if (det.phase === 'elimination' && det.quietSince != null && t - det.quietSince > 4) {
      det.phase = 'equilibrium';
      det.bands[0].t1 = det.quietSince;
      det.bands.push({ phase: 'equilibrium', t0: det.quietSince, t1: null });
    }
    if (s > 200 && slope > 0) { if (det.riseSince == null) det.riseSince = t; } else det.riseSince = null;
    if (det.phase !== 'escape' && det.riseSince != null && t - det.riseSince >= 3) {
      det.phase = 'escape';
      const last = det.bands[det.bands.length - 1];
      let t0 = det.lastQuiet;
      if (t0 == null || t0 < last.t0) {
        t0 = last.t0;
        for (let i = S.length - 1; i > 0; i--) if (S[i].s <= Math.max(N0, 30)) { t0 = S[i].t; break; }
      }
      last.t1 = Math.max(last.t0, t0);
      det.bands.push({ phase: 'escape', t0: last.t1, t1: null });
    }
  };
  /** Stop detecting (pressure removed, free play): close the open band at t. */
  det.freeze = (t) => { if (det.frozen || det.done) return; det.frozen = true; const last = det.bands[det.bands.length - 1]; if (last.t1 == null) last.t1 = t; };
  return det;
}

// ====================================================================== figure
const STYLE_ID = 'ch07-immunoediting-style';
const CSS = `
[data-figure="ch07-immunoediting"] .imed-layer { position: absolute; inset: 0; z-index: 4; pointer-events: none; }
[data-figure="ch07-immunoediting"] .imed-slot { position: absolute; display: flex; justify-content: center; align-items: center; text-align: center; }
[data-figure="ch07-immunoediting"] .imed-slot[hidden] { display: none; }
[data-figure="ch07-immunoediting"] .imed-banner {
  padding: 10px 16px; border-radius: 12px;
  background: rgb(11 16 36 / 0.82); box-shadow: inset 0 0 0 1px rgb(233 236 246 / 0.16);
  font: 600 15px/1.35 var(--font-ui); color: var(--fg); text-align: center; text-wrap: balance;
  opacity: 0; transition: opacity 0.5s ease; }
[data-figure="ch07-immunoediting"] .imed-banner.is-on { opacity: 1; }
[data-figure="ch07-immunoediting"] .imed-host {
  padding: 6px 14px; border-radius: 16px;
  background: rgb(11 16 36 / 0.78); box-shadow: inset 0 0 0 1px rgb(233 236 246 / 0.14);
  font: 500 13px/1.35 var(--font-ui); color: var(--fg); text-align: center; text-wrap: balance; }
[data-figure="ch07-immunoediting"] .imed-foot { position: absolute; margin: 0; font: 400 12px/1.45 var(--font-ui); color: var(--fg-3); text-wrap: pretty; }
[data-figure="ch07-immunoediting"] .imed-legend {
  display: flex; flex-wrap: wrap; align-items: center; gap: 6px 18px; margin-top: var(--s-3);
  font: 400 13px/1.4 var(--font-ui); color: var(--ink-2); }
[data-figure="ch07-immunoediting"] .imed-legend__item { display: inline-flex; align-items: center; gap: 8px; }
[data-figure="ch07-immunoediting"] .imed-legend svg { flex: none; overflow: visible; }
[data-figure="ch07-immunoediting"] .imed-transplant { transition: opacity 0.6s ease; }
[data-figure="ch07-immunoediting"] .imed-transplant.is-hidden { display: none; }
[data-figure="ch07-immunoediting"] .imed-transplant.is-fresh { animation: imed-fade 0.6s ease both; }
[data-figure="ch07-immunoediting"] .imed-transplant.is-pulse { animation: imed-pulse 1.6s ease-in-out 1; }
@keyframes imed-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes imed-pulse { 0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--accent) 0%, transparent); }
  45% { box-shadow: 0 0 0 7px color-mix(in srgb, var(--accent) 28%, transparent); } }
@media (prefers-reduced-motion: reduce) {
  [data-figure="ch07-immunoediting"] .imed-transplant.is-pulse, [data-figure="ch07-immunoediting"] .imed-transplant.is-fresh { animation: none; }
  [data-figure="ch07-immunoediting"] .imed-banner { transition: none; }
}
[data-figure="ch07-immunoediting"] .imed-more { position: relative; }
[data-figure="ch07-immunoediting"] .imed-more__panel {
  position: absolute; right: 0; bottom: calc(100% + 6px); z-index: 20; width: max-content; max-width: min(19rem, 86vw);
  display: flex; flex-direction: column; align-items: stretch; gap: 10px; padding: 12px;
  background: var(--surface); border-radius: var(--r-md, 10px);
  box-shadow: 0 10px 30px rgb(0 0 0 / 0.16), inset 0 0 0 1px var(--rule); }
[data-figure="ch07-immunoediting"] .imed-more__panel[hidden] { display: none; }
[data-figure="ch07-immunoediting"] .imed-more__panel .btn { justify-content: flex-start; }
[data-figure="ch07-immunoediting"] .imed-more__panel .segmented { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 6px 12px; }
[data-figure="ch07-immunoediting"] .imed-cap { margin: 0; color: var(--ink); }
[data-figure="ch07-immunoediting"] .imed-cap b { font-weight: 650; }
[data-figure="ch07-immunoediting"] .imed-cap--hint { color: var(--ink-2); }
[data-figure="ch07-immunoediting"] .imed-again {
  margin-left: 0.35em; padding: 0; border: 0; background: none; font: inherit; font-family: var(--font-ui); font-size: 0.92em; font-weight: 600;
  color: var(--accent); text-decoration: underline; text-underline-offset: 0.18em; cursor: pointer; min-height: 44px; }
[data-figure="ch07-immunoediting"] .imed-again:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; border-radius: 3px; }
[data-figure="ch07-immunoediting"] .imed-debug { position: absolute; left: 8px; bottom: 8px; z-index: 6; font: 500 11px/1.3 ui-monospace, monospace; color: #9fb0e0; pointer-events: none; white-space: pre; }
@container fig (max-width: 599.98px) {
  [data-figure="ch07-immunoediting"] .fig__controls .btn { min-height: 44px; }
  [data-figure="ch07-immunoediting"] .fig__controls .segmented__opt { min-height: 44px; }
  [data-figure="ch07-immunoediting"] .imed-banner { font-size: 14px; }
}
`;

const PHASE = {
  elimination: { label: 'Elimination', color: C.fill('cd8'), opacity: 0.14 },
  equilibrium: { label: 'Equilibrium', color: C.ink, opacity: 0.08 },
  escape: { label: 'Escape', color: C.fill('cancer'), opacity: 0.2 },
  noT: { label: 'No T cells', color: C.ink2, opacity: 0.04, hatch: true },
};
const TIERS = [
  { key: 'easy', label: 'Easy to spot', dots: 4, note: '3–4 dots' },
  { key: 'faint', label: 'Faint', dots: 2, note: '1–2 dots' },
  { key: 'hidden', label: 'Hidden', dots: 0, note: '0 dots' },
];
const HIDDEN_HUE = -18;                       // §4.15: the hidden variant, a hue shift (≤ ±25°) + matte + hatch
// Preset seeds, tuned so the three phases show clearly AND the payoff comes fast (visitor review B4):
// at the default 2× the equilibrium caption arrives at ~10 s and escape at ~22 s (seed 85 on both layouts).
const GUIDED = { wide: 85, compact: 85 };
const SPEEDS = [1, 2, 4];

export default async function mount(fig, ctx) {
  if (!document.getElementById(STYLE_ID)) document.head.append(ctx.h('style', { id: STYLE_ID, text: CSS }));
  const RM = () => ctx.reducedMotion;
  const debug = /[?&]imed-debug/.test(location.search);
  const capSteps = ctx.steps || [];

  // ------------------------------------------------------------------ stage layers
  ctx.setAspect(16 / 9, 0.6);
  const cv = ctx.canvas();
  const g = cv.g;
  const svg = ctx.createSVG({ viewBox: '0 0 960 540' });
  svg.style.pointerEvents = 'none';
  const layer = ctx.h('div', { class: 'imed-layer' });
  ctx.stage.append(layer);
  const bannerEl = ctx.h('div', { class: 'imed-banner', role: 'status' });
  const banner = ctx.h('div', { class: 'imed-slot', hidden: true }, bannerEl);
  const hostLabel = ctx.h('div', { class: 'imed-slot', hidden: true }, ctx.h('div', { class: 'imed-host' }, 'Moved into a fresh host whose immune system has never been dampened.'));
  const foot = ctx.h('p', { class: 'imed-foot' }, '“Hidden” stands for several real changes: fewer neoantigens, or loss of MHC class I.');
  layer.append(banner, hostLabel, foot);
  const dbg = debug ? ctx.h('div', { class: 'imed-debug' }) : null;
  if (dbg) layer.append(dbg);

  const clock = ctx.ui.clock({ value: 'Ready' });
  ctx.tag('Illustrative');
  ctx.tag('Time compressed');

  // Legend line under the stage (always visible).
  const legend = ctx.h('div', { class: 'imed-legend' });
  legend.innerHTML = `
    <span class="imed-legend__item">${glyphSVG(3, 18)}<span>Pink dots = neoantigens on display. More dots, easier for T cells to spot.</span></span>
    <span class="imed-legend__item">${tGlyphSVG(16)}<span>Killer T cell</span></span>
    <span class="imed-legend__item">${glyphSVG(0, 18)}<span>Hidden cancer cell (no dots)</span></span>`;
  ctx.stage.after(legend);

  // ------------------------------------------------------------------ state
  let L = null;                 // layout
  let sheet = null;             // sprite sheet
  let sheetScale = 0;
  let dotImg = null;
  let bgCanvas = null;
  let run = null;
  let pressure = 'on';          // the reader's choice for the next/current run ('off' | 'on')
  let strong = false;           // "Strong immune pressure" (menu)
  let speed = 2;                // default 2× so the guided run pays off in ~25 s (B4)
  let xMax = 60;
  const fx = createEffects();
  const ghosts = [];

  const compact = () => ctx.compact;
  const worldFor = (cmp) => (cmp ? { world: 400, K: 400 } : { world: 400, K: 600 });
  const levelOf = () => (pressure === 'off' ? 'off' : strong ? 'strong' : 'on');

  function newRun({ kind = 'guided', seed, seedCells = null, source = null } = {}) {
    const cmp = compact();
    const wk = worldFor(cmp);
    const level = kind === 'transplant' ? 'strong' : levelOf();
    const s = seed ?? (kind === 'guided' ? GUIDED[cmp ? 'compact' : 'wide'] : 1);
    const sim = createSim({ seed: s, pressure: level, seedCells, ...wk });
    run = {
      kind, seed: s, level0: level, sim, wk, source,
      det: phaseDetector({ N0: seedCells ? seedCells.length : PARAMS.N0 }),
      hist: [{ t: 0, N: sim.cells.length }], nextSample: 0.25,
      noT: level === 'off' ? [{ t0: 0, t1: null }] : [],
      edited: source ? source.edited : null,
      caption: null, outcome: null, ended: false, started: false, offDuringEq: null, pulsed: false,
      fresh: true,
    };
    fx.clear();
    ghosts.length = 0;
    xMax = 60;
    if (kind !== 'transplant') snapSeg.set(0);
    banner.hidden = true; bannerEl.classList.remove('is-on');
    hostLabel.hidden = kind !== 'transplant';
    buildCharts();
    updateHUD();
    return run;
  }

  // ------------------------------------------------------------------ sprites & backgrounds
  async function ensureSprites() {
    if (!L) return;
    const sc = Math.min(2, window.devicePixelRatio || 1) * L.s;
    if (sheet && Math.abs(sc - sheetScale) / sheetScale < 0.12) return;
    sheetScale = sc;
    const hid = shiftHue(PALETTE.cancer, HIDDEN_HUE);
    sheet = await spriteStates({
      vis: ['cancerCell', { r: PARAMS.rC, stage: 'dark', detail: 'low' }],
      hid: ['cancerCell', { r: PARAMS.rC, stage: 'dark', detail: 'low', state: 'hidden', color: hid, glow: false }],
      t: { kind: 'tCell', params: { variant: 'cd8', r: PARAMS.rT, state: 'activated', polarity: 0, stage: 'dark', detail: 'low' }, seeds: 3 },
    }, { seeds: 4, scale: sc });
    dotImg = makeDot(sc);
    bgCanvas = await makeBackground();
  }

  function makeDot(sc) {
    const r = 2.9, size = Math.ceil(r * 2 * sc) + 2;
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const x = c.getContext('2d');
    const m = size / 2;
    const grad = x.createRadialGradient(m, m, 0, m, m, m);
    grad.addColorStop(0, '#FFE6EF');
    grad.addColorStop(0.2, '#FF7AA6');
    grad.addColorStop(0.42, PALETTE.neoPeptide);
    grad.addColorStop(0.55, 'rgba(255,61,127,0.45)');
    grad.addColorStop(1, 'rgba(255,61,127,0)');
    x.fillStyle = grad;
    x.fillRect(0, 0, size, size);
    c._w = r * 2;
    return c;
  }

  // Static tissue: faint sand outlines of healthy cells + a soft vessel band along the left edge.
  async function makeBackground() {
    const W = run ? run.wk.world : worldFor(compact()).world;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const px = Math.round(L.side * dpr);
    const c = document.createElement('canvas');
    c.width = c.height = px;
    const x = c.getContext('2d');
    const k = px / W;
    x.setTransform(k, 0, 0, k, 0, 0);
    const R = rng(77);
    const step = 22;
    x.lineWidth = 0.7;
    for (let j = -1; j * step * 0.87 < W + step; j++) {
      for (let i = -1; i * step < W + step; i++) {
        const ox = i * step + (j % 2 ? step / 2 : 0) + R.range(-4.5, 4.5);
        const oy = j * step * 0.87 + R.range(-4.5, 4.5);
        const rr = step * R.range(0.4, 0.5);
        const n = 6;
        const rot = R.range(0, TAU);
        x.beginPath();
        for (let q = 0; q <= n; q++) {
          const a = rot + (q / n) * TAU;
          const rq = rr * (0.9 + 0.12 * Math.sin(q * 2.3 + ox));
          const qx = ox + Math.cos(a) * rq, qy = oy + Math.sin(a) * rq;
          if (q === 0) x.moveTo(qx, qy); else x.lineTo(qx, qy);
        }
        x.strokeStyle = 'rgba(233,201,161,0.12)';
        x.stroke();
        x.fillStyle = 'rgba(233,201,161,0.05)';
        x.beginPath();
        x.arc(ox + R.range(-1.5, 1.5), oy + R.range(-1.5, 1.5), rr * 0.32, 0, TAU);
        x.fill();
      }
    }
    // vessel band (soft edges)
    const vw = 26;
    const grad = x.createLinearGradient(0, 0, vw + 10, 0);
    grad.addColorStop(0, 'rgba(196,80,90,0.30)');
    grad.addColorStop(0.62, 'rgba(196,80,90,0.20)');
    grad.addColorStop(1, 'rgba(196,80,90,0)');
    x.fillStyle = grad;
    x.fillRect(0, 0, vw + 10, W);
    x.strokeStyle = 'rgba(201,169,166,0.28)';
    x.lineWidth = 1;
    x.beginPath(); x.moveTo(vw - 2, 0); x.lineTo(vw - 2, W); x.stroke();
    try {
      const rbc = await sprite(redBloodCell, { r: 5, view: 'tilted', stage: 'dark' }, { scale: k });
      for (let i = 0; i < Math.round(W / 26); i++) {
        x.save();
        x.globalAlpha = 0.5;
        drawSprite(x, rbc, R.range(6, vw - 8), i * 26 + R.range(4, 20), { rotation: R.range(-0.6, 0.6) });
        x.restore();
      }
    } catch (e) { /* decorative */ }
    return c;
  }

  // ------------------------------------------------------------------ layout
  function layout({ width: Wd, height: Hd }) {
    const cmp = Wd < 600;
    if (cmp) {
      const side = Math.min(Wd, 430);
      const want = side + 262;
      ctx.setAspect(16 / 9, Wd / want);
      const top = side + 14;
      const colW = Wd - 24;
      const lw = Math.round(colW * 0.56);
      L = {
        cmp, Wd, Hd, side, ox: (Wd - side) / 2, oy: 0,
        line: { x0: 12, y0: top, x1: 12 + lw, y1: Hd - 58 },
        bars: { x0: 12 + lw + 18, y0: top, x1: Wd - 12, y1: Hd - 58 },
        foot: { x: 12, y: Hd - 50, w: Wd - 24 },
      };
    } else {
      // Wide: 16:9. Medium widths (tablets) get a taller stage so the chart column keeps its room.
      ctx.setAspect(Wd >= 1000 ? 16 / 9 : Wd >= 860 ? 1.55 : 1.3, 0.6);
      const pad = Math.round(clamp(Hd * 0.04, 14, 26));
      const side = Math.min(Hd - pad * 2, Math.round(Wd * (Wd >= 1000 ? 0.6 : 0.58)));
      const x0 = pad + side + Math.round(clamp(Wd * 0.03, 20, 40));
      const top = pad + 34;
      const footH = Wd - pad - x0 < 330 ? 58 : 40;
      const avail = Hd - top - pad - footH;
      const lineH = Math.round(avail * 0.62);
      L = {
        cmp, Wd, Hd, side, ox: pad, oy: (Hd - side) / 2,
        line: { x0, y0: top, x1: Wd - pad, y1: top + lineH },
        bars: { x0, y0: top + lineH + 14, x1: Wd - pad, y1: Hd - pad - footH },
        foot: { x: x0, y: Hd - pad - footH + 6, w: Wd - pad - x0 },
      };
    }
    L.world = run ? run.wk.world : worldFor(cmp).world;
    L.s = L.side / L.world;
    svg.setAttribute('viewBox', `0 0 ${Wd} ${Hd}`);
    ctx.refreshTextScale();
    Object.assign(foot.style, { left: `${L.foot.x}px`, top: `${L.foot.y}px`, width: `${L.foot.w}px` });
    const inset = L.side * 0.08;
    Object.assign(banner.style, { left: `${L.ox + inset}px`, width: `${L.side - 2 * inset}px`, top: `${L.oy}px`, height: `${L.side}px` });
    Object.assign(hostLabel.style, { left: `${L.ox + inset / 2}px`, width: `${L.side - inset}px`, top: `${L.oy + (L.cmp ? 78 : 46)}px` });
  }

  // ------------------------------------------------------------------ charts (dark-native, chart.js)
  let CH = null;
  function buildCharts() {
    if (!L || L.Hd < 200) return;
    for (const n of [...svg.children]) if (n !== svg.defs) n.remove();
    const root = chartRoot(svg, { theme: 'stage-dark' });
    const ln = L.line;
    const lineG = ctx.svg('g', {}, root);
    ctx.svg('text', { x: ln.x0, y: ln.y0 + 12, class: 't-label', text: 'Tumor cells over time' }, lineG);
    const labelRow = ln.y0 + 34;
    const px0 = ln.x0 + (L.cmp ? 30 : 36);
    const px1 = ln.x1 - 6;
    const flow = L.cmp || px1 - px0 < 380;      // narrow plot: band labels become a wrapping legend
    const py0 = labelRow + (flow ? 26 : 14);
    const py1 = ln.y1 - (L.cmp ? 34 : 40);
    const K = run ? run.wk.K : worldFor(L.cmp).K;
    const ylog = scale({ type: 'log', domain: [1, K], range: [py1 - 16, py0] });
    const y = (N) => (N <= 0 ? py1 : ylog(Math.max(1, N)));
    const x = scale({ domain: [0, xMax], range: [px0, px1] });
    const bandsG = ctx.svg('g', {}, lineG);
    const bandLabels = ctx.svg('g', {}, lineG);
    // y axis: 0 (with a break), 10, 100, cap
    const yAx = scale({ type: 'log', domain: [1, K], range: [py1 - 16, py0] });
    const ticks = Math.abs(yAx(100) - yAx(K)) >= 22 ? [10, 100, K] : [10, 100];
    axis(lineG, { scale: yAx, orient: 'left', at: px0, ticks, format: (v) => String(v), grid: [px0, px1], tickSize: 0, line: false });
    ctx.svg('text', { x: px0 - 6, y: py1, dy: '0.35em', class: 't-small t-num ck-tick-label t-end', text: '0' }, lineG);
    ctx.svg('line', { x1: px0, x2: px1, y1: py1, y2: py1, class: 'ck-axis' }, lineG);
    axisBreak(lineG, { x: px0, y: py1 - 8, orient: 'v', size: 5 });
    ctx.svg('line', { x1: px0, x2: px0, y1: py0, y2: py1 - 13, class: 'ck-axis' }, lineG);
    // x axis title (no units)
    const xt = ctx.svg('text', { x: px0, y: py1 + 20, class: 't-caps' }, lineG);
    ctx.svg('tspan', { text: 'time → ' }, xt);
    if (!L.cmp) ctx.svg('tspan', { class: 't-small t-muted', style: 'text-transform:none;letter-spacing:0', text: '(in people, often years)' }, xt);
    else ctx.svg('text', { x: px0, y: py1 + 36, class: 't-small t-muted', text: '(in people, often years)' }, lineG);
    const path = ctx.svg('path', { fill: 'none', style: `stroke:${C.stroke('cancer')};stroke-width:2.25;stroke-linejoin:round;stroke-linecap:round` }, lineG);
    const nowDot = ctx.svg('circle', { r: 4, style: `fill:${C.fill('cancer')};stroke:${C.surface};stroke-width:2` }, lineG);

    // "Who is left?" — three meters, labeled with the dot glyphs (no percentages: §4.19)
    const bs = L.bars;
    const barsG = ctx.svg('g', {}, root);
    ctx.svg('text', { x: bs.x0, y: bs.y0 + 12, class: 't-label', text: 'Who is left?' }, barsG);
    ctx.svg('text', { x: bs.x0, y: bs.y0 + 30, class: 't-small t-muted', text: L.cmp ? 'share of tumor' : 'share of living tumor cells' }, barsG);
    const rowsTop = bs.y0 + 44;
    const rowH = clamp((bs.y1 - rowsTop) / 3, 34, 48);
    const barW = bs.x1 - bs.x0;
    const hatch = hatchFill(svg, C.ink2, { spacing: 4, width: 1.1 });
    const meters = TIERS.map((tier, i) => {
      const ry = rowsTop + i * rowH;
      const gl = ctx.svg('g', { transform: `translate(${bs.x0 + 8} ${ry + 8})` }, barsG);
      gl.innerHTML = glyphInner(tier.dots, 7.5);
      const lab = ctx.svg('text', { x: bs.x0 + 22, y: ry + 8, dy: '0.35em', class: 't-small', style: 'fill:var(--fg)' }, barsG);
      lab.textContent = tier.label;
      if (!L.cmp) ctx.svg('tspan', { class: 't-muted', dx: 8, text: tier.note }, lab);
      const by = ry + 19;
      ctx.svg('rect', { x: bs.x0, y: by, width: barW, height: 9, rx: 3, style: `fill:${C.ink};fill-opacity:0.07` }, barsG);
      const op = [1, 0.62, 0.42][i];
      const bar = ctx.svg('rect', { x: bs.x0, y: by, width: 0, height: 9, rx: 3, style: `fill:${C.s4};fill-opacity:${op}` }, barsG);
      const hb = i === 2 ? ctx.svg('rect', { x: bs.x0, y: by, width: 0, height: 9, rx: 3, style: `fill:${hatch};opacity:0.9` }, barsG) : null;
      return { bar, hb, w: barW, x0: bs.x0 };
    });
    CH = { x, y, px0, px1, py0, py1, labelRow, flow, lx0: ln.x0, bandsG, bandLabels, path, nowDot, meters, K };
    drawCharts(true);
  }

  function drawCharts(instant = false) {
    if (!CH || !run) return;
    const { x, y } = CH;
    // extend the time axis when the run outgrows it (rebuilds everything once)
    const tNow = run.sim.t;
    if (tNow > xMax - 1.5) { xMax = Math.ceil((tNow + 25) / 20) * 20; buildCharts(); return; }
    // bands
    CH.bandsG.replaceChildren();
    CH.bandLabels.replaceChildren();
    const bands = [];
    const pressured = run.level0 !== 'off';
    if (pressured && run.kind !== 'transplant' && run.started) for (const b of run.det.bands) bands.push({ ...b, t1: b.t1 ?? tNow });
    for (const b of run.noT) bands.push({ phase: 'noT', t0: b.t0, t1: b.t1 ?? tNow });
    const hatch = hatchFill(svg, C.ink2, { spacing: 5, width: 1 });
    const rowEnd = [-Infinity, -Infinity];
    const rows = 1;
    for (const b of bands) {
      if (b.t1 - b.t0 <= 0.05 && b.phase !== 'elimination') continue;
      const st = PHASE[b.phase];
      const bx0 = x(b.t0), bx1 = x(Math.max(b.t0, b.t1));
      ctx.svg('rect', { x: bx0, y: CH.py0, width: Math.max(0, bx1 - bx0), height: Math.max(0, CH.py1 - CH.py0), style: `fill:${st.color};fill-opacity:${st.opacity}` }, CH.bandsG);
      if (st.hatch) ctx.svg('rect', { x: bx0, y: CH.py0, width: Math.max(0, bx1 - bx0), height: Math.max(0, CH.py1 - CH.py0), style: `fill:${hatch};opacity:0.5` }, CH.bandsG);
      // label (with a swatch) in a row above the plot; on phones a second row avoids collisions
      const tw = st.label.length * 7.6 + 16;
      let row = 0, lx;
      if (CH.flow) {
        // narrow plots: a chronological legend that wraps (the plot is too narrow to pin labels to bands)
        lx = Math.max(CH.lx0, rowEnd[row] + 10);
        if (lx + tw > CH.px1 + 4 && rowEnd[0] > -Infinity) { row = 1; lx = Math.max(CH.lx0, rowEnd[1] + 10); }
      } else {
        const want = clamp(bx0, CH.px0, CH.px1 - tw);
        while (row < rows && want < rowEnd[row] + 8) row++;
        lx = want;
        if (row >= rows) { row = 0; lx = Math.min(rowEnd[0] + 8, CH.px1 - tw); }
      }
      const ly = CH.labelRow - 6 + row * 15;
      const active = b.phase === run.det.phase && !run.det.done && !run.det.frozen;
      ctx.svg('rect', { x: lx, y: ly - 8, width: 9, height: 9, rx: 2, style: `fill:${st.color};fill-opacity:${Math.min(1, st.opacity * 4.5)}` }, CH.bandLabels);
      ctx.svg('text', { x: lx + 14, y: ly, class: 't-caps', style: active ? 'fill:var(--fg)' : 'fill:var(--fg-2)', text: st.label }, CH.bandLabels);
      ctx.svg('line', { x1: bx0, x2: bx0, y1: CH.py0, y2: CH.py0 - 4, class: 'ck-axis' }, CH.bandLabels);
      rowEnd[row] = lx + tw;
    }
    // line
    const pts = run.hist;
    let d = '';
    for (let i = 0; i < pts.length; i++) d += `${i ? 'L' : 'M'}${x(pts[i].t).toFixed(1)},${y(pts[i].N).toFixed(1)}`;
    CH.path.setAttribute('d', d);
    const last = pts[pts.length - 1];
    CH.nowDot.setAttribute('cx', x(last.t).toFixed(1));
    CH.nowDot.setAttribute('cy', y(last.N).toFixed(1));
    // meters
    const st = run.sim.stats();
    const shares = [st.easy, st.faint, st.hidden];
    CH.meters.forEach((m, i) => {
      const w = (run.sim.cells.length ? shares[i] : 0) * m.w;
      for (const el of [m.bar, m.hb]) if (el) {
        if (instant || RM()) { ctx.gsap.killTweensOf(el); el.setAttribute('width', w.toFixed(1)); }
        else ctx.gsap.to(el, { attr: { width: w }, duration: 0.22 / Math.max(1, speed * 0.5), ease: 'none', overwrite: true });
      }
    });
  }

  // ------------------------------------------------------------------ rendering (canvas)
  function render() {
    const dpr = cv.dpr;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, cv.width, cv.height);
    if (!L || !sheet || !run) return;
    const { ox, oy, side } = L;
    const W = run.wk.world;
    const s = side / W;
    g.save();
    // soft-edged patch of tissue
    g.beginPath();
    g.rect(ox, oy, side, side);
    g.clip();
    if (bgCanvas) g.drawImage(bgCanvas, ox, oy, side, side);
    g.setTransform(dpr * s, 0, 0, dpr * s, dpr * ox, dpr * oy);
    const sim = run.sim;
    const now = sim.t;
    // cancer cells
    for (const c of sim.cells) {
      const age = now - c.born;
      c.scale = age < 0.45 ? 0.6 + 0.4 * easeOut(clamp(age / 0.45, 0, 1)) : 1;
      c.rotation = c.rot;
      sheet.draw(g, c, { state: c.dots ? 'vis' : 'hid', alpha: c.dots ? 1 : 0.86 });
      if (!c.dots) {
        // matte outline for a hidden cell
        g.strokeStyle = 'rgba(169,177,204,0.55)';
        g.lineWidth = 0.6;
        g.beginPath(); g.arc(c.x, c.y, c.r * 0.98 * c.scale, 0, TAU); g.stroke();
      }
    }
    // neoantigen dots (one encoding: 0–4 per cell, on the rim)
    if (dotImg) {
      const dw = dotImg._w;
      for (const c of sim.cells) {
        const n = c.dots;
        if (!n) continue;
        const rr = c.r * 0.94 * c.scale;
        for (let i = 0; i < n; i++) {
          const a = c.rot + (i / n) * TAU + (n === 2 ? 0.6 : 0);
          g.drawImage(dotImg, c.x + Math.cos(a) * rr - dw / 2, c.y + Math.sin(a) * rr - dw / 2, dw, dw);
        }
      }
    }
    // dying cells (crowd kill: shrink + specks)
    for (let i = ghosts.length - 1; i >= 0; i--) {
      const gh = ghosts[i];
      if (gh.dead) { ghosts.splice(i, 1); continue; }
      sheet.draw(g, gh, { state: gh.state });
    }
    fx.draw(g);
    // T cells
    for (const a of sim.tcells) {
      if (a.act > 0.05) {
        g.globalAlpha = 0.22 * a.act * a.alpha;
        g.fillStyle = PALETTE.cd8;
        g.beginPath(); g.arc(a.x, a.y, a.r * 2.1, 0, TAU); g.fill();
        g.globalAlpha = 1;
      }
      a.rotation = a.heading;
      sheet.draw(g, a, { state: 't', alpha: a.alpha });
    }
    g.restore();
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    // feather the patch edges into the stage
    feather(ox, oy, side);
  }

  let featherCache = null;
  function feather(ox, oy, side) {
    const key = `${ox}|${oy}|${side}`;
    if (!featherCache || featherCache.key !== key) {
      const f = Math.round(side * 0.07);
      featherCache = { key, f };
    }
    const f = featherCache.f;
    const bg = '11,16,36';
    const edge = (x0, y0, x1, y1, rx, ry, rw, rh) => {
      const gr = g.createLinearGradient(x0, y0, x1, y1);
      gr.addColorStop(0, `rgba(${bg},0.95)`);
      gr.addColorStop(1, `rgba(${bg},0)`);
      g.fillStyle = gr;
      g.fillRect(rx, ry, rw, rh);
    };
    if (!L.cmp || L.ox > 0) {
      edge(ox + side, 0, ox + side - f, 0, ox + side - f, oy, f, side);
      if (L.ox > 0) edge(ox, 0, ox + f, 0, ox, oy, f, side);
    }
    edge(0, oy, 0, oy + f, ox, oy, side, f);
    edge(0, oy + side, 0, oy + side - f, ox, oy + side - f, side, f);
  }

  // ------------------------------------------------------------------ simulation driving
  const stepper = fixedStep((dt) => { if (run && !run.ended) simStep(dt); }, { dt: 1 / 60, max: 10 });

  function simStep(dt) {
    const sim = run.sim;
    sim.step(dt);
    if (sim.t >= run.nextSample) {
      run.nextSample += 0.25;
      run.hist.push({ t: sim.t, N: sim.cells.length });
      if (run.kind !== 'transplant' && run.level0 !== 'off') run.det.push(sim.t, sim.cells.length);
      run.dirty = true;
      checkRun();
    }
  }

  function drainEvents() {
    const sim = run.sim;
    if (RM()) { sim.events.length = 0; return; }
    for (const e of sim.events) {
      if (e.type !== 'kill') continue;
      const c = e.cell, a = e.tcell;
      contactRing(fx, (c.x + a.x) / 2, (c.y + a.y) / 2, { color: PALETTE.cd8, r: 6.5, life: 0.9 });
      const gh = { x: c.x, y: c.y, r: c.r, variant: c.variant, rotation: c.rot, state: c.dots ? 'vis' : 'hid' };
      killSpecks(fx, gh, { color: PALETTE.cancer, life: 0.6, seed: c.id });
      ghosts.push(gh);
    }
    sim.events.length = 0;
  }

  let rmAcc = 0;
  const loop = ctx.loop((dt) => {
    if (!run) return;
    stepper(dt * speed);
    drainEvents();
    if (!RM()) fx.step(dt * speed);
    if (RM()) { rmAcc += dt; if (rmAcc < 0.25) return; rmAcc = 0; }
    render();
    if (run.dirty) { run.dirty = false; drawCharts(); updateHUD(); }
    if (dbg) {
      const st = run.sim.stats();
      dbg.textContent = `t ${run.sim.t.toFixed(1)}  N ${st.N}  v̄ ${st.meanV.toFixed(2)}  T ${run.sim.tcells.length}  kills ${run.sim.kills}  ${run.det.phase}`;
    }
  }, { autoplay: false });

  // ------------------------------------------------------------------ run logic: phases, captions, endings
  function checkRun() {
    const sim = run.sim;
    const N = sim.cells.length;
    const det = run.det;
    if (run.kind === 'transplant') {
      if (!run.outcome && N === 0) endTransplant('rejected');
      else if (!run.outcome && N > 200) endTransplant('grew');
      if (run.outcome === 'grew' && N >= 0.95 * run.wk.K) finish();
      if (N > 100) showTransplantButton(false);
      return;
    }
    // captions follow the detected phases
    if (run.level0 !== 'off' && !det.frozen) {
      if (det.phase === 'elimination' && sim.kills > 0 && run.caption == null) setCaption(0);
      if (det.phase === 'equilibrium' && run.caption !== 1 && run.caption !== 6) setCaption(1);
      if (det.phase === 'escape' && run.caption !== 2) { setCaption(2); showTransplantButton(true); }
    }
    if (run.offDuringEq != null && run.caption !== 6 && det.smooth > Math.max(100, run.offDuringEq * 3)) setCaption(6);
    if (N > 100) showTransplantButton(true);
    if (N === 0) {
      bannerEl.textContent = 'Eliminated — no tumor ever becomes visible';
      banner.hidden = false;
      requestAnimationFrame(() => bannerEl.classList.add('is-on'));
      ctx.announce('Eliminated: no tumor ever becomes visible.');
      finish();
    } else if (N >= 0.95 * run.wk.K) {
      finish();
      if (!run.pulsed && transplantShown) {
        run.pulsed = true;
        transplantBtn.el.classList.remove('is-pulse');
        void transplantBtn.el.offsetWidth;
        transplantBtn.el.classList.add('is-pulse');
      }
    }
  }

  function finish() {
    run.ended = true;
    loop.pause();
    if (run.det) run.det.freeze?.(run.sim.t);
    drawCharts();
    updateHUD();
    syncPlay();
  }

  function endTransplant(outcome) {
    run.outcome = outcome;
    const src = run.source;
    if (src.edited) setCaption(3, { again: true });
    else if (src.unedited) setCaption(outcome === 'rejected' ? 4 : 5, { again: true });
    else setAgainOnly(outcome === 'rejected' ? 'Rejected by the new host.' : 'It grew in the new host.');
    if (outcome === 'rejected') {
      bannerEl.textContent = 'Rejected by the new host';
      banner.hidden = false;
      requestAnimationFrame(() => bannerEl.classList.add('is-on'));
      finish();
    } else {
      ctx.announce('The transplanted tumor grew.');
    }
    updateHUD();
  }

  function updateHUD() {
    if (!run) return;
    let v;
    if (run.kind === 'transplant') v = run.outcome === 'rejected' ? 'Transplant · rejected' : run.outcome === 'grew' ? 'Transplant · grew' : 'Transplant test';
    else if (run.sim.cells.length === 0) v = 'Eliminated';
    else if (run.level0 === 'off' && !run.det.bands.length) v = 'No immune pressure';
    else if (run.level0 === 'off') v = 'No immune pressure';
    else if (run.det.frozen) v = run.sim.pressure === 'off' ? 'T cells removed' : 'Immune pressure on';
    else if (!run.started) v = 'Ready';
    else v = PHASE[run.det.phase].label;
    if (clock.value !== v) clock.set(v);
  }

  // ------------------------------------------------------------------ captions (verbatim from the draft)
  const capWrap = ctx.h('div', { class: 'imed-caps', 'aria-live': 'polite' });
  ctx.caption.append(capWrap);
  function setHint(text) {
    capWrap.replaceChildren(ctx.h('p', { class: 'imed-cap imed-cap--hint' }, text));
    if (run) run.caption = null;
  }
  function setAgainOnly(text) {
    const p = ctx.h('p', { class: 'imed-cap imed-cap--hint' }, text);
    p.append(' ', ctx.h('button', { type: 'button', class: 'imed-again', onClick: () => tryAgain() }, 'Try again'));
    capWrap.replaceChildren(p);
  }
  function setCaption(i, { again = false } = {}) {
    const st = capSteps[i];
    if (!st) return;
    if (run) run.caption = i;
    if (i <= 2 && run && run.kind !== 'transplant') snapSeg.set(i);   // the phase chips follow the run
    const p = ctx.h('p', { class: 'imed-cap' });
    p.innerHTML = boldLead(st.html || st.text);
    if (again) {
      const b = ctx.h('button', { type: 'button', class: 'imed-again', onClick: () => tryAgain() }, 'Try again');
      p.append(' ', b);
    }
    capWrap.replaceChildren(p);
  }

  // ------------------------------------------------------------------ controls
  const playLabels = { play: 'Play guided run', pause: 'Pause' };
  let playBtn = null;
  if (!RM()) {
    playBtn = ctx.ui.playPause({ playing: false, labels: playLabels, onChange: (on) => onPlay(on) });
    playBtn.el.classList.add('btn--primary');
  }
  // The three phases, always beside Play: they follow the run (current phase checked) and jump
  // the guided run to that phase (reduced motion: a still of it).
  const snapSeg = ctx.ui.segmented({
    label: RM() ? 'Guided run' : 'Jump to phase', hideLabel: !RM(), value: RM() ? null : 0,
    options: [{ value: 0, label: 'Elimination' }, { value: 1, label: 'Equilibrium' }, { value: 2, label: 'Escape' }],
    onChange: (v) => (RM() ? showSnapshot(v) : jumpToPhase(v)),
  });
  if (!RM()) {
    ctx.ui.segmented({
      label: 'Speed', value: speed,
      options: SPEEDS.map((v) => ({ value: v, label: `${v}×` })),
      onChange: (v) => { speed = v; },
    });
  }
  const pressureSeg = ctx.ui.segmented({
    label: 'Immune pressure', value: 'on',
    options: [{ value: 'off', label: 'Off' }, { value: 'on', label: 'On' }],
    onChange: (v) => onPressure(v),
  });
  const transplantBtn = ctx.ui.button({ label: 'Transplant test', icon: 'arrowRight', onClick: () => startTransplant() });
  transplantBtn.el.classList.add('imed-transplant', 'is-hidden');
  let transplantShown = false;
  function showTransplantButton(on) {
    if (on === transplantShown) return;
    transplantShown = on;
    transplantBtn.el.classList.toggle('is-hidden', !on);
    transplantBtn.el.classList.toggle('is-fresh', on);
  }
  ctx.ui.spacer();
  // "More" menu: everything else.
  const moreWrap = ctx.h('div', { class: 'imed-more' });
  ctx.controls.append(moreWrap);
  const moreBtn = ctx.ui.button({ label: 'More', icon: 'chevronDown', variant: 'ghost', parent: moreWrap, onClick: () => toggleMenu() });
  const panelId = `imed-more-${Math.random().toString(36).slice(2, 8)}`;
  moreBtn.el.setAttribute('aria-expanded', 'false');
  moreBtn.el.setAttribute('aria-controls', panelId);
  const panel = ctx.h('div', { class: 'imed-more__panel', id: panelId, hidden: true, role: 'group', 'aria-label': 'More options' });
  moreWrap.append(panel);
  if (!RM()) {
    ctx.ui.button({ label: 'New random tumor', icon: 'reset', variant: 'ghost', parent: panel, onClick: () => { toggleMenu(false); freshRun({ kind: 'free', seed: 100 + Math.floor(Math.random() * 1e6) }); } });
    ctx.ui.button({ label: 'Replay', icon: 'replay', variant: 'ghost', parent: panel, onClick: () => { toggleMenu(false); replay(); } });
  }
  const strongToggle = ctx.ui.toggle({ label: 'Strong immune pressure', checked: false, parent: panel, onChange: (on) => onStrong(on) });
  function toggleMenu(force) {
    const open = force ?? panel.hidden;
    panel.hidden = !open;
    moreBtn.el.setAttribute('aria-expanded', String(open));
  }
  ctx.on(document, 'pointerdown', (e) => { if (!panel.hidden && !moreWrap.contains(e.target)) toggleMenu(false); });
  ctx.on(moreWrap, 'keydown', (e) => { if (e.key === 'Escape' && !panel.hidden) { toggleMenu(false); moreBtn.el.focus(); } });

  function syncPlay() {
    if (!playBtn) return;
    const playing = loop.playing && run && !run.ended;
    playLabels.play = run && run.started && !run.ended ? 'Resume' : 'Play guided run';
    playBtn.set(playing);
  }

  function onPlay(on) {
    if (on) {
      if (!run || run.ended || run.kind === 'transplant' && run.outcome) freshRun({ kind: 'guided' });
      else start();
    } else {
      loop.pause();
      ctx.announce('Simulation paused');
      syncPlay();
    }
  }

  function start() {
    if (!run) return;
    if (!run.started) {
      run.started = true;
      if (run.kind !== 'transplant') {
        if (run.level0 === 'off') setHint('Immune pressure is off: no T cells patrol this patch.');
        else setHint('Killer T cells are patrolling the young tumor…');
      }
    }
    loop.play();
    updateHUD();
    syncPlay();
  }

  function freshRun(opts) {
    newRun(opts);
    showTransplantButton(false);
    if (RM()) { computeTo(opts.until ?? null); return; }
    start();
  }

  function replay() {
    if (!run) return freshRun({ kind: 'guided' });
    if (run.kind === 'transplant') return tryAgain();
    freshRun({ kind: run.kind, seed: run.seed });
  }

  function onPressure(v) {
    pressure = v;
    if (v === 'off' && strong) { /* keep the menu switch as is: it only matters when pressure is on */ }
    if (RM()) {
      if (v === 'off') { newRun({ kind: 'free', seed: GUIDED[compact() ? 'compact' : 'wide'] }); computeTo('cap'); setHint('Immune pressure is off: this tumor grew without being edited. Try the transplant test.'); }
      else { snapSeg?.set(2); showSnapshot(2); }
      return;
    }
    // Before the first run: just reset. After a transplant test, or once a run has ended,
    // changing the pressure starts a fresh default tumor with the chosen pressure.
    if (run && !run.started && run.kind !== 'transplant') { newRun({ kind: 'guided' }); render(); return; }
    if (!run || run.ended || run.kind === 'transplant') { freshRun({ kind: 'guided' }); return; }
    applyPressureLive();
  }

  function onStrong(on) {
    strong = on;
    if (on && pressure === 'off') { pressure = 'on'; pressureSeg.set('on'); }
    if (RM()) { onPressure(pressure); return; }
    if (run && !run.started && run.kind !== 'transplant') { newRun({ kind: run.kind, seed: run.seed }); render(); return; }
    if (!run || run.ended || run.kind === 'transplant') return;
    applyPressureLive();
  }

  function applyPressureLive() {
    const sim = run.sim;
    const lvl = levelOf();
    const prev = sim.pressure;
    if (lvl === prev) return;
    sim.setPressure(lvl);
    if (lvl === 'off') {
      if (run.det.phase === 'equilibrium' && !run.det.frozen) run.offDuringEq = run.det.smooth;
      run.det.freeze(sim.t);
      run.noT.push({ t0: sim.t, t1: null });
      ctx.announce('T cells removed');
    } else if (prev === 'off') {
      const open = run.noT[run.noT.length - 1];
      if (open && open.t1 == null) open.t1 = sim.t;
      ctx.announce('T cells return');
    }
    run.dirty = true;
    if (!loop.playing && !run.ended) start();
    updateHUD();
  }

  // ------------------------------------------------------------------ transplant test
  let lastSource = null;
  function startTransplant(src) {
    const source = src || snapshotSource();
    if (!source || !source.vs.length) return;
    lastSource = source;
    const R = rng(source.seed + source.tries * 7919);
    const pool = source.vs.slice();
    const pick = [];
    for (let i = 0; i < 40 && pool.length; i++) pick.push(pool.splice(Math.floor(R() * pool.length), 1)[0]);
    newRun({ kind: 'transplant', seed: 9000 + source.seed + source.tries * 31, seedCells: pick, source });
    showTransplantButton(false);
    if (source.edited) setCaption(3);
    else setHint('Transplant test running…');
    ctx.announce('Transplant test started');
    if (RM()) { computeTo('transplant'); return; }
    start();
  }
  function snapshotSource() {
    if (!run || !run.sim.cells.length) return null;
    const vs = run.sim.cells.map((c) => c.v);
    const meanV = vs.reduce((a, b) => a + b, 0) / vs.length;
    const neverPressured = run.level0 === 'off' && run.noT.length === 1 && run.noT[0].t1 == null;
    return { vs, meanV, edited: meanV < 0.3, unedited: neverPressured && meanV >= 0.3, seed: Math.floor(Math.random() * 1e6), tries: 0 };
  }
  function tryAgain() {
    if (!lastSource) return;
    lastSource.tries++;
    startTransplant(lastSource);
  }

  // ------------------------------------------------------------------ reduced motion: computed stills
  function computeTo(until) {
    // Run silently (fixed steps) to a target, then draw one still.
    const sim = run.sim;
    const det = run.det;
    let guard = 0;
    const stopAt = {
      0: () => sim.kills > 0 && (det.smooth <= 0.6 * PARAMS.N0 || sim.t >= 12 || det.phase !== 'elimination'),
      1: () => det.phase === 'equilibrium' && sim.t >= (det.bands[1]?.t0 ?? 0) + 8,
      2: () => det.phase === 'escape' && sim.cells.length >= 0.6 * run.wk.K,
      cap: () => run.ended,
      transplant: () => run.ended || !!run.outcome,
    }[until] || (() => run.ended);
    run.started = true;
    while (!stopAt() && !run.ended && guard++ < 60 * 240) simStep(1 / 60);
    sim.events.length = 0;
    render();
    drawCharts(true);
    updateHUD();
  }
  function jumpToPhase(i) {
    // Fast-forward a fresh guided run silently to that phase, then keep playing from there.
    showSnapshot(i);
    snapSeg.set(i);
    if (!run.ended) start();
  }
  function showSnapshot(i) {
    if (pressure === 'off') { pressure = 'on'; pressureSeg.set('on'); }
    newRun({ kind: 'guided' });
    computeTo(i);
    if (i === 0) setCaption(0);
    if (run.sim.cells.length > 100 || i === 2) showTransplantButton(true);
  }

  // ------------------------------------------------------------------ resize / mount
  let lastCmp = null;
  ctx.onResize(async (info) => {
    layout(info);
    if (lastCmp !== null && lastCmp !== L.cmp && run && !run.started) newRun({ kind: run.kind, seed: GUIDED[L.cmp ? 'compact' : 'wide'] });
    lastCmp = L.cmp;
    await ensureSprites();
    if (!run) return;
    buildCharts();
    render();
  });

  layout({ width: ctx.width, height: ctx.height });
  lastCmp = L.cmp;
  newRun({ kind: 'guided' });
  await ensureSprites();
  if (RM()) {
    showSnapshot(0);
    snapSeg.set(0);
  } else {
    setHint('Press “Play guided run” to grow a small, varied tumor while killer T cells patrol it.');
    render();
  }

  if (debug) fig.__imed = { get run() { return run; }, fast(sec) { const n = Math.round(sec * 60); for (let i = 0; i < n && !run.ended; i++) simStep(1 / 60); run.sim.events.length = 0; render(); drawCharts(true); updateHUD(); }, start, startTransplant, setSpeed: (v) => { speed = v; } };

  return {
    destroy() { loop.pause(); },
  };
}

// ---------------------------------------------------------------------- small glyphs (legend, meters)
function glyphInner(dots, r = 7) {
  const hidden = dots === 0;
  const fill = hidden ? shiftHue(PALETTE.cancer, HIDDEN_HUE) : PALETTE.cancer;
  let s = `<circle r="${r}" fill="${fill}" fill-opacity="${hidden ? 0.55 : 0.9}" stroke="${hidden ? '#A9B1CC' : '#E3C8F5'}" stroke-opacity="${hidden ? 0.7 : 0.55}" stroke-width="${hidden ? 0.9 : 0.8}"/>`;
  if (hidden) {
    // hatch (§4.15) clipped by drawing short chords
    for (let k = -2; k <= 2; k++) {
      const o = k * r * 0.42;
      const h = Math.sqrt(Math.max(0, r * r - (o * o) / 2) ) * 0.85;
      s += `<line x1="${(o / Math.SQRT2 - h / Math.SQRT2).toFixed(2)}" y1="${(o / Math.SQRT2 + h / Math.SQRT2).toFixed(2)}" x2="${(o / Math.SQRT2 + h / Math.SQRT2).toFixed(2)}" y2="${(o / Math.SQRT2 - h / Math.SQRT2).toFixed(2)}" stroke="currentColor" stroke-opacity="0.5" stroke-width="0.8"/>`;
    }
  }
  for (let i = 0; i < dots; i++) {
    const a = -Math.PI / 2 + (i / dots) * TAU;
    const x = (Math.cos(a) * r * 0.9).toFixed(2), y = (Math.sin(a) * r * 0.9).toFixed(2);
    s += `<circle cx="${x}" cy="${y}" r="${(r * 0.42).toFixed(2)}" fill="${PALETTE.neoPeptide}" fill-opacity="0.35"/><circle cx="${x}" cy="${y}" r="${(r * 0.24).toFixed(2)}" fill="${PALETTE.neoPeptide}"/>`;
  }
  return s;
}
function glyphSVG(dots, size = 18) {
  const r = size * 0.36;
  return `<svg width="${size}" height="${size}" viewBox="${-size / 2} ${-size / 2} ${size} ${size}" aria-hidden="true">${glyphInner(dots, r)}</svg>`;
}
function tGlyphSVG(size = 16) {
  const r = size * 0.3;
  return `<svg width="${size}" height="${size}" viewBox="${-size / 2} ${-size / 2} ${size} ${size}" aria-hidden="true"><circle r="${r * 1.35}" fill="${PALETTE.cd8}" fill-opacity="0.18"/><circle r="${r}" fill="${PALETTE.cd8}" stroke="#BFD6FF" stroke-width="0.8" stroke-opacity="0.7"/></svg>`;
}
/** Bold a short lead phrase ("Elimination.") without changing the writer's words. */
function boldLead(html) {
  const m = /^([A-Z][^.<]{0,24}?\.)(\s)/.exec(html);
  if (!m || m[1].split(/\s+/).length > 3) return html;
  return `<b>${m[1]}</b>${html.slice(m[1].length)}`;
}
