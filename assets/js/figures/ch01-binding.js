// ch01-binding — "Fit, bind, release".
// Receptors in a membrane, ligands drifting above them. A ligand whose tip is in an EMPTY
// pocket's capture zone binds at rate k_cap; each embrace lasts an exponential dwell time
// with mean τ. Snug and look-alike capture equally fast; they differ (10×) in τ.
//
//   • Every random event is a rate converted with shared/agents.js rateToP, stepped with
//     fixedStep (1/60 s) so behavior is frame-rate independent and reproducible.
//   • Tuning (capture zone, drift) was checked headless with simulateOccupancy() (exported):
//     60 simulated seconds per setting, mean occupancy vs the spec's targets.
//   • Art: receptor() / ligand() shape-fit glyphs from the library, rasterized as sprites,
//     plus local charge marks (the same "+" blue / "−" orange discs as ch01-gene-to-protein).
import { receptor, ligand, signalIcon, el as svgEl, sprite, drawSprite } from '../art/index.js';
import { rng, fixedStep, rateToP, spatialHash, relax, createEffects, contactRing } from './shared/agents.js';

const ID = 'ch01-binding';

// ---------------------------------------------------------------- model (spec numbers)
export const FITS = {
  snug: { label: 'Snug', kCap: 30, tau: 8, profile: 'notch' },
  look: { label: 'Look-alike', kCap: 30, tau: 0.8, profile: 'step' },
  wrong: { label: 'Wrong shape', kCap: 1.5, tau: 0.08, profile: 'wave' },
};
const SIM = {
  zoneFrac: 0.005,      // capture-zone area as a fraction of the space ligands roam (tuned)
  zoneLift: 0.45,       // zone centre above the pocket, × zone radius
  zoneAspect: 2.5,      // zone is wider than tall: the pocket's mouth
  gamma: 2.2,           // velocity relaxation (1/s) of the Brownian drift
  vRms: 100,            // typical drift speed (px/s at the reference scale)
  refractory: 0.2,      // s after release before a ligand can bind again
  kick: 30,             // px/s upward kick on release
  snap: 0.15,           // s to settle into the pocket
  compactZone: 1.3,     // phone layout zone multiplier
};
const LIGAND = '#3DDC97';
const RECEPTOR = '#A9B1CC';            // neutral slate (a silver cup means MHC in this book)
const POS = '#5D8FF2', NEG = '#EE7F4C';
const SAND = '#E9C9A1';

// ---------------------------------------------------------------- simulation core (no DOM)
/**
 * createSim({ W, H, n, u, count, fit, seed }) → sim with step(dt), setFit, setCount, ...
 * Geometry in CSS px. Receptors are evenly spaced; membrane top at yM.
 */
export function createSim({ W, H, n, u, count, fit = 'snug', seed = 7, compact = false, params = {} }) {
  const P = { ...SIM, ...params };
  if (compact) P.zoneFrac *= P.compactZone;                  // phones: fewer, closer receptors (tuned separately)
  const R = rng(seed);
  const sim = { W, H, n, u, fit, t: 0, ligands: [], receptors: [], fx: null, nextId: 1 };
  const yM = compact ? H * 0.8 : H * 0.78;
  sim.yM = yM;
  sim.memY = (x, t) => yM + 1.8 * Math.sin(x * 0.012 + t * 0.55) + 1.0 * Math.sin(x * 0.031 - t * 0.8);
  const margin = W / n / 2;
  for (let i = 0; i < n; i++) sim.receptors.push({ i, x: margin + i * (W / n), bound: null, glow: 0 });
  sim.dockY = (r, t) => sim.memY(r.x, t) - 0.95 * u;
  // free-ligand box: above the pockets
  const top = u * 0.45, floor = yM - 0.95 * u + 3;
  sim.box = { x0: u * 0.35, x1: W - u * 0.35, y0: top, y1: floor };
  const area = (sim.box.x1 - sim.box.x0) * (sim.box.y1 - sim.box.y0);
  sim.zone = Math.sqrt((P.zoneFrac * area) / (Math.PI * P.zoneAspect));   // capture zone: ellipse, rx = zone·aspect
  sim.zoneUp = sim.zone * P.zoneLift;                         // zone centre sits a little above the pocket
  const scale = Math.sqrt(area / (800 * 300));                 // drift scales with the box
  const vRms = P.vRms * Math.max(compact ? 0.8 : 0.6, scale);
  const sigma = vRms * Math.sqrt(2 * P.gamma);

  const spawn = (fadeIn) => {
    const L = {
      id: sim.nextId++, x: R.range(sim.box.x0, sim.box.x1), y: R.range(sim.box.y0, sim.box.y1 - u * 0.4),
      vx: R.gauss() * vRms * 0.7, vy: R.gauss() * vRms * 0.7, a: R.range(-0.4, 0.4), va: 0,
      state: 'free', rec: null, dwell: 0, bt: 0, cool: 0, alpha: fadeIn ? 0 : 1, dying: false, snap: 1, sx: 0, sy: 0, sa: 0,
    };
    sim.ligands.push(L);
    return L;
  };
  sim.setCount = (c, { fade = true } = {}) => {
    const live = sim.ligands.filter((l) => !l.dying);
    if (c > live.length) for (let k = live.length; k < c; k++) spawn(fade);
    else if (c < live.length) {
      // remove free ligands first (random), then bound ones
      const order = live.slice().sort((a, b) => (a.state === 'free' ? 0 : 1) - (b.state === 'free' ? 0 : 1) || R() - 0.5);
      for (let k = 0; k < live.length - c; k++) {
        const L = order[k];
        if (L.state === 'bound') release(L, false);
        if (fade) L.dying = true; else L.alpha = -1;
      }
      if (!fade) sim.ligands = sim.ligands.filter((l) => l.alpha >= 0);
    }
  };
  sim.setFit = (f) => {
    sim.fit = f;
    // memoryless: bound complexes now dissociate with the new species' rate
    for (const L of sim.ligands) if (L.state === 'bound') L.dwell = -Math.log(1 - R()) * FITS[f].tau;
  };
  function release(L, kick = true) {
    const r = L.rec;
    if (r) r.bound = null;
    L.state = 'free'; L.rec = null; L.cool = P.refractory;
    if (kick) {
      L.vy = -P.kick * Math.max(0.7, scale); L.vx = R.gauss() * 20; L.va = R.gauss() * 1.2;
      sim.onRelease?.(L, r);
    }
  }
  const hash = spatialHash(Math.max(24, u * 0.6));
  sim.occupied = () => sim.receptors.reduce((k, r) => k + (r.bound ? 1 : 0), 0);

  sim.step = (dt) => {
    sim.t += dt;
    const F = FITS[sim.fit];
    const pCap = rateToP(F.kCap, dt);
    const { x0, x1, y0, y1 } = sim.box;
    for (const L of sim.ligands) {
      if (L.dying) { L.alpha -= dt / 0.4; continue; }
      if (L.alpha < 1) L.alpha = Math.min(1, L.alpha + dt / 0.4);
      if (L.state === 'bound') {
        L.bt += dt;
        L.dwell -= dt;
        L.snap = Math.min(1, L.snap + dt / P.snap);
        if (L.dwell <= 0) release(L);
        continue;
      }
      // Brownian drift (Ornstein–Uhlenbeck velocity)
      L.vx += -P.gamma * L.vx * dt + sigma * Math.sqrt(dt) * R.gauss();
      L.vy += -P.gamma * L.vy * dt + sigma * Math.sqrt(dt) * R.gauss();
      L.va += (-2 * L.a - 1.5 * L.va) * dt + 1.6 * Math.sqrt(dt) * R.gauss();
      L.x += L.vx * dt; L.y += L.vy * dt; L.a += L.va * dt;
      if (L.x < x0) { L.x = x0 + (x0 - L.x); L.vx = Math.abs(L.vx) * 0.7; }
      if (L.x > x1) { L.x = x1 - (L.x - x1); L.vx = -Math.abs(L.vx) * 0.7; }
      if (L.y < y0) { L.y = y0 + (y0 - L.y); L.vy = Math.abs(L.vy) * 0.7; }
      if (L.y > y1) { L.y = y1 - (L.y - y1); L.vy = -Math.abs(L.vy) * 0.7; }
      L.a = Math.max(-0.7, Math.min(0.7, L.a));
      if (L.cool > 0) { L.cool -= dt; continue; }
      // capture by the nearest empty pocket
      const i = Math.round((L.x - sim.receptors[0].x) / (W / n));
      const r = sim.receptors[Math.max(0, Math.min(n - 1, i))];
      if (r.bound) continue;
      const dx = (L.x - r.x) / P.zoneAspect, dy = L.y - (sim.dockY(r, sim.t) - sim.zoneUp);
      if (dx * dx + dy * dy > sim.zone * sim.zone) continue;
      if (R() < pCap) {
        L.state = 'bound'; L.rec = r; r.bound = L; L.bt = 0;
        L.dwell = -Math.log(1 - R()) * F.tau;
        L.snap = 0; L.sx = L.x; L.sy = L.y; L.sa = L.a;
        sim.onBind?.(L, r);
      }
    }
    // molecules don't overlap: a soft push apart (bound ones stay put)
    for (const L of sim.ligands) { L.r = u * 0.27; L.fixed = L.state === 'bound'; }
    hash.build(sim.ligands);
    relax(sim.ligands, { hash, strength: 0.25 });
    if (sim.ligands.some((l) => l.dying && l.alpha <= 0)) sim.ligands = sim.ligands.filter((l) => !(l.dying && l.alpha <= 0));
  };
  sim.reset = (c) => {
    for (const r of sim.receptors) r.bound = null;
    sim.ligands = [];
    sim.t = 0;
    for (let k = 0; k < c; k++) spawn(false);
  };
  sim.reset(count);
  return sim;
}

/** Headless check used during tuning: mean occupancy over `seconds` after `warm` seconds. */
export function simulateOccupancy({ W = 860, H = 484, n = 12, u = 58, count = 20, fit = 'snug', seconds = 60, warm = 20, seed = 3, compact = false, params } = {}) {
  const sim = createSim({ W, H, n, u, count, fit, seed, compact, params });
  const dt = 1 / 60;
  for (let t = 0; t < warm; t += dt) sim.step(dt);
  let acc = 0, k = 0;
  for (let t = 0; t < seconds; t += dt) { sim.step(dt); acc += sim.occupied(); k++; }
  return acc / k / n;
}

// ---------------------------------------------------------------- art (composites of library glyphs)
function chargeDisc(sign, x, y, r) {
  const g = svgEl('g', { transform: `translate(${x} ${y})` });
  g.appendChild(svgEl('circle', { r, fill: sign > 0 ? POS : NEG, stroke: '#0B1024', 'stroke-width': r * 0.22 }));
  const w = r * 0.55;
  g.appendChild(svgEl('path', { d: sign > 0 ? `M${-w} 0H${w}M0 ${-w}V${w}` : `M${-w} 0H${w}`, stroke: '#fff', 'stroke-width': r * 0.34, 'stroke-linecap': 'round', fill: 'none' }));
  return g;
}
function bindReceptor({ size }) {
  const g = receptor({ size, profile: 'notch', color: RECEPTOR, stage: 'dark' });
  g.appendChild(chargeDisc(-1, 0, -0.69 * size, Math.max(4, size * 0.1)));
  return g;
}
function bindLigand({ size, fit }) {
  const f = FITS[fit];
  const g = ligand({ size, profile: f.profile, fit: 1, color: LIGAND, stage: 'dark' });
  const r = Math.max(4, size * 0.1);
  if (fit === 'snug') g.appendChild(chargeDisc(1, 0, size * 0.02, r));
  if (fit === 'look') g.appendChild(chargeDisc(1, -size * 0.15, -size * 0.17, r));
  return g;
}

// ---------------------------------------------------------------- CSS
const CSS = `
[data-figure="${ID}"] .bind-main { display: grid; grid-template-columns: minmax(0, 1fr); gap: var(--s-3); }
@container fig (min-width: 900px) { [data-figure="${ID}"] .bind-main { grid-template-columns: minmax(0, 1fr) 14.5rem; gap: var(--s-4); align-items: start; } }
[data-figure="${ID}"] .bind-read { display: flex; flex-direction: column; justify-content: flex-start; gap: var(--s-5); padding: var(--s-4) var(--s-5);
  border: 1px solid var(--rule); border-radius: var(--r-lg); background: var(--surface); font-family: var(--font-ui); }
[data-figure="${ID}"] .bind-read__label { margin: 0 0 .3rem; font-size: var(--text-2xs); font-weight: 650; letter-spacing: var(--tracking-caps); text-transform: uppercase; color: var(--ink-3); }
[data-figure="${ID}"] .bind-read__big { margin: 0; font: 620 2.2rem/1 var(--font-ui); color: var(--ink); font-variant-numeric: tabular-nums; letter-spacing: -0.01em; }
[data-figure="${ID}"] .bind-read__big small { font-size: 1rem; font-weight: 520; color: var(--ink-2); letter-spacing: 0; }
[data-figure="${ID}"] .bind-bar { display: flex; align-items: center; gap: .55rem; }
[data-figure="${ID}"] .bind-bar__track { position: relative; flex: 1; height: .8rem; border-radius: 99px; background: var(--paper-3); overflow: hidden; box-shadow: inset 0 0 0 1px var(--rule); }
[data-figure="${ID}"] .bind-bar__fill { position: absolute; inset: 0 auto 0 0; width: 0; border-radius: inherit; background: #2FB67C; }
[data-figure="${ID}"] .bind-bar__icon { flex: none; width: 1.35rem; height: 1.35rem; }
[data-figure="${ID}"] .bind-key { list-style: none; margin: 0; padding: var(--s-4) 0 0; display: grid; gap: .45rem; border-top: 1px solid var(--rule); font-size: var(--text-xs); color: var(--ink-2); }
[data-figure="${ID}"] .bind-key li { display: flex; align-items: center; gap: .55rem; }
[data-figure="${ID}"] .bind-key svg { width: 28px; height: 20px; flex: none; }
[data-figure="${ID}"] .bind-key small { color: var(--ink-3); font-size: inherit; }
[data-figure="${ID}"] .bind-read__note { margin: .35rem 0 0; font-size: var(--text-2xs); color: var(--ink-3); line-height: 1.35; }
[data-figure="${ID}"] .fig__controls .segmented__opt svg.bind-ico { width: 22px; height: 14px; margin-right: .3rem; vertical-align: -2px; }
@container fig (max-width: 899.98px) {
  [data-figure="${ID}"] .bind-read { flex-direction: row; flex-wrap: wrap; align-items: center; gap: var(--s-3) var(--s-6); padding: var(--s-3) var(--s-4); }
  [data-figure="${ID}"] .bind-read > div { flex: 1 1 12rem; }
  [data-figure="${ID}"] .bind-key { flex: 1 1 100%; display: flex; flex-wrap: wrap; gap: .4rem 1.2rem; padding-top: var(--s-3); }
  [data-figure="${ID}"] .bind-read__big { font-size: 1.7rem; }
}
`;
function injectCSS() {
  if (document.getElementById(`${ID}-css`)) return;
  const s = document.createElement('style');
  s.id = `${ID}-css`;
  s.textContent = CSS;
  document.head.append(s);
}

// ---------------------------------------------------------------- figure
export default async function mount(fig, ctx) {
  injectCSS();
  ctx.setAspect(16 / 9, 4 / 5);
  ctx.tag('Illustrative');
  ctx.tag('Time compressed');
  const c = ctx.colors;

  // stage + readout side panel (beside on wide figures, below the controls on phones)
  const main = ctx.h('div', { class: 'bind-main' });
  ctx.stage.before(main);
  main.append(ctx.stage);
  const big = ctx.h('p', { class: 'bind-read__big' }, '0', ctx.h('small', null, ' of 12'));
  const fill = ctx.h('span', { class: 'bind-bar__fill' });
  const plusIcon = '<svg class="bind-bar__icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#3DDC97"/><path d="M7 12h10M12 7v10" stroke="#0B1024" stroke-width="2.6" stroke-linecap="round"/></svg>';
  const key = ctx.h('ul', { class: 'bind-key', role: 'list' },
    ctx.h('li', { html: `<svg viewBox="0 0 28 20" aria-hidden="true"><path d="M4 3h20v8h-6l-1.6 5h-4.8L10 11H4z" fill="#2F9E70" stroke="#3DDC97" stroke-width="1.4" stroke-linejoin="round"/><circle cx="14" cy="13" r="3" fill="${POS}"/></svg><span>Ligand <small>(+ charge)</small></span>` }),
    ctx.h('li', { html: `<svg viewBox="0 0 28 20" aria-hidden="true"><path d="M3 5h7l1.6 5h4.8L18 5h7v9H3z" fill="#4F5468" stroke="#C4CADB" stroke-width="1.4" stroke-linejoin="round"/><circle cx="14" cy="12" r="2.6" fill="${NEG}"/></svg><span>Receptor <small>(− charge in pocket)</small></span>` }));
  // readout first (it is what the reader watches), the shape key last
  const read = ctx.h('div', { class: 'bind-read' },
    ctx.h('div', null, ctx.h('p', { class: 'bind-read__label', id: `${ID}-occ` }, 'Receptors occupied'), big),
    ctx.h('div', null,
      ctx.h('p', { class: 'bind-read__label' }, 'Signal inside the cell'),
      ctx.h('div', { class: 'bind-bar', role: 'meter', 'aria-label': 'Signal inside the cell (fraction of receptors occupied)', 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': '0' },
        ctx.h('span', { html: plusIcon }), ctx.h('span', { class: 'bind-bar__track' }, fill)),
      ctx.h('p', { class: 'bind-read__note' }, 'Averaged over the last second')),
    key);
  main.append(read);
  const meter = read.querySelector('.bind-bar');

  const cv = ctx.canvas();
  const g = cv.g;

  // ---------------------------------------------------------------- state
  let compact = ctx.compact;
  let fit = 'snug';
  let count = compact ? 14 : 20;
  let sim = null;
  let spr = null;
  let u = 58;
  let prevFit = null, morph = 1;          // shape crossfade 0 → 1 over 0.4 s
  let avg = 0;
  let tracked = null;                      // step 2: one ligand to watch
  let runLeft = 0;                         // reduced motion: "Run 10 seconds"
  const fx = createEffects();
  const N = () => (compact ? 8 : 12);
  const range = () => (compact ? { min: 3, max: 54, def: 14 } : { min: 4, max: 80, def: 20 });

  async function buildSprites() {
    const size = u;
    const [rec, sig, ...ligs] = await Promise.all([
      sprite(bindReceptor, { size }),
      sprite(signalIcon, { type: 'activating', size: Math.max(12, size * 0.26), stage: 'dark' }),
      ...Object.keys(FITS).map((f) => sprite(bindLigand, { size, fit: f })),
    ]);
    spr = { rec, sig, lig: Object.fromEntries(Object.keys(FITS).map((f, i) => [f, ligs[i]])) };
  }

  function newSim() {
    const W = cv.width, H = cv.height;
    u = compact ? Math.max(34, Math.min(46, W / 8.6)) : Math.max(44, Math.min(62, W / 14.5));
    sim = createSim({ W, H, n: N(), u, count, fit, seed: 11, compact });
    sim.onRelease = (L, r) => {
      if (!ctx.reducedMotion) contactRing(fx, r.x, sim.dockY(r, sim.t) - u * 0.05, { color: LIGAND, r: u * 0.22, life: 0.7, core: false });
    };
    // start near equilibrium: run 25 simulated seconds silently
    for (let t = 0; t < 25; t += 1 / 60) sim.step(1 / 60);
    for (const r of sim.receptors) r.glow = r.bound ? 1 : 0;
    for (const L of sim.ligands) L.snap = 1;
    tracked = null;
    avg = sim.occupied() / N();
  }

  // ---------------------------------------------------------------- render
  function drawMembrane(t) {
    const { W, H } = sim;
    const yM = sim.yM;
    const band = Math.max(16, u * 0.36);
    // interior
    const grd = g.createLinearGradient(0, yM, 0, H);
    grd.addColorStop(0, ctx.alpha(SAND, 0.1));
    grd.addColorStop(1, ctx.alpha(SAND, 0.03));
    g.fillStyle = grd;
    g.beginPath();
    g.moveTo(0, H);
    for (let x = 0; x <= W + 8; x += 8) g.lineTo(x, sim.memY(x, t));
    g.lineTo(W, H);
    g.closePath();
    g.fill();
    // bilayer: two leaflets of lipid heads with faint tails
    const sp = Math.max(6, u * 0.12), hr = sp * 0.42;
    g.strokeStyle = ctx.alpha(SAND, 0.22);
    g.lineWidth = 1;
    g.beginPath();
    for (let x = sp / 2; x < W; x += sp) {
      const y = sim.memY(x, t);
      g.moveTo(x, y + hr); g.lineTo(x, y + band / 2 - 1);
      g.moveTo(x, y + band - hr); g.lineTo(x, y + band / 2 + 1);
    }
    g.stroke();
    g.fillStyle = ctx.alpha(SAND, 0.78);
    g.beginPath();
    for (let x = sp / 2; x < W; x += sp) {
      const y = sim.memY(x, t);
      g.moveTo(x + hr, y); g.arc(x, y, hr, 0, Math.PI * 2);
      g.moveTo(x + hr, y + band); g.arc(x, y + band, hr, 0, Math.PI * 2);
    }
    g.fill();
    return band;
  }

  function render() {
    if (!sim || !spr) return;
    const t = sim.t;
    const { W, H } = sim;
    cv.clear();
    const band = drawMembrane(t);
    // receptors: stalk through the membrane, inner tail, head (sprite), activation
    for (const r of sim.receptors) {
      const y0 = sim.memY(r.x, t);
      const on = !!r.bound && r.bound.snap >= 1;
      r.glow += ((on ? 1 : 0) - r.glow) * 0.18;
      g.strokeStyle = ctx.alpha(RECEPTOR, 0.85);
      g.lineWidth = Math.max(2.4, u * 0.07);
      g.lineCap = 'round';
      g.beginPath(); g.moveTo(r.x, y0); g.lineTo(r.x, y0 + band + u * 0.3); g.stroke();
      // tail: glows while the receptor is occupied
      const ty = y0 + band + u * 0.3;
      if (r.glow > 0.02) {
        const halo = g.createRadialGradient(r.x, ty, 0, r.x, ty, u * 0.42);
        halo.addColorStop(0, ctx.alpha(LIGAND, 0.55 * r.glow));
        halo.addColorStop(1, ctx.alpha(LIGAND, 0));
        g.fillStyle = halo;
        g.beginPath(); g.arc(r.x, ty, u * 0.42, 0, Math.PI * 2); g.fill();
      }
      g.fillStyle = ctx.mix('#4F5468', LIGAND, r.glow * 0.65);
      g.strokeStyle = ctx.mix('#C4CADB', '#B8F5D9', r.glow);
      g.lineWidth = 1.2;
      g.beginPath(); g.ellipse(r.x, ty, u * 0.1, u * 0.075, 0, 0, Math.PI * 2); g.fill(); g.stroke();
      if (r.glow > 0.05) drawSprite(g, spr.sig, r.x, ty + u * 0.22, { alpha: Math.min(1, r.glow * 1.2) });
      drawSprite(g, spr.rec, r.x, y0, { scale: 1 });
    }
    // ligands
    const alpha0 = prevFit ? 1 - morph : 0;
    for (const L of sim.ligands) {
      let x = L.x, y = L.y, a = L.a;
      if (L.state === 'bound') {
        const r = L.rec;
        const dy = sim.dockY(r, t);
        const e = L.snap * L.snap * (3 - 2 * L.snap);
        x = L.sx + (r.x - L.sx) * e; y = L.sy + (dy - L.sy) * e; a = L.sa * (1 - e);
        // soft glow while bound
        const halo = g.createRadialGradient(x, y - u * 0.12, 0, x, y - u * 0.12, u * 0.55);
        halo.addColorStop(0, ctx.alpha(LIGAND, 0.32 * e * L.alpha));
        halo.addColorStop(1, ctx.alpha(LIGAND, 0));
        g.fillStyle = halo;
        g.beginPath(); g.arc(x, y - u * 0.12, u * 0.55, 0, Math.PI * 2); g.fill();
      }
      const al = Math.max(0, L.alpha);
      if (alpha0 > 0) drawSprite(g, spr.lig[prevFit], x, y, { rotation: a, alpha: al * alpha0 });
      drawSprite(g, spr.lig[fit], x, y, { rotation: a, alpha: al * (prevFit ? morph : 1) });
    }
    fx.draw(g);
    // step 2: one ligand to watch
    if (tracked && sim.ligands.includes(tracked)) {
      const L = tracked;
      let x = L.x, y = L.y;
      if (L.state === 'bound') { const e = L.snap; x = L.sx + (L.rec.x - L.sx) * e; y = L.sy + (sim.dockY(L.rec, t) - L.sy) * e; }
      g.strokeStyle = 'rgba(255,255,255,0.85)';
      g.lineWidth = 1.6;
      g.setLineDash([4, 4]);
      g.beginPath(); g.arc(x, y - u * 0.1, u * 0.42, 0, Math.PI * 2); g.stroke();
      g.setLineDash([]);
      const txt = L.state === 'bound' ? `Bound ${L.bt.toFixed(1)} s` : 'Drifting free';
      label(txt, x, y - u * 0.62, 'center');
    }
    // labels
    g.font = `650 ${compact ? 11 : 12}px Inter, system-ui, sans-serif`;
    g.textAlign = 'left';
    g.fillStyle = ctx.alpha(c.fg2 || '#A9B1CC', 1);
    if ('letterSpacing' in g) g.letterSpacing = '1px';
    g.fillText('INSIDE THE CELL', 12, H - 12);
    g.fillText('OUTSIDE', 12, 22);
    if ('letterSpacing' in g) g.letterSpacing = '0px';
  }
  function label(text, x, y, align) {
    g.font = '600 13px Inter, system-ui, sans-serif';
    g.textAlign = align;
    g.lineJoin = 'round';
    g.lineWidth = 4;
    g.strokeStyle = 'rgba(11,16,36,0.85)';
    g.strokeText(text, x, y);
    g.fillStyle = '#E9ECF6';
    g.fillText(text, x, y);
  }

  // ---------------------------------------------------------------- readouts
  let lastShown = -1;
  function readouts(dt) {
    const k = sim.occupied();
    const frac = k / N();
    avg += (frac - avg) * Math.min(1, dt / 1.0);
    if (dt === 0) avg = frac;
    if (k !== lastShown) {
      lastShown = k;
      big.firstChild.textContent = String(k);
      big.lastChild.textContent = ` of ${N()}`;
    }
    fill.style.width = `${(avg * 100).toFixed(1)}%`;
    meter.setAttribute('aria-valuenow', String(Math.round(avg * 100)));
  }

  // ---------------------------------------------------------------- loop
  const step = fixedStep((dt) => {
    sim.step(dt);
    fx.step(dt);
    if (prevFit) { morph = Math.min(1, morph + dt / 0.4); if (morph >= 1) prevFit = null; }
  });
  const loop = ctx.loop((dt) => {
    let d = dt;
    if (ctx.reducedMotion) {
      if (runLeft <= 0) { loop.pause(); return; }
      d = Math.min(dt, runLeft); runLeft -= d;
      if (runLeft <= 0) { runBtn?.el.removeAttribute('aria-disabled'); ctx.announce('Ten seconds simulated'); }
    }
    step(d);
    render();
    readouts(d);
  });

  // Reduced motion: a still sampled at equilibrium for the current settings.
  function snapshot() {
    if (!ctx.reducedMotion || loop.playing) return;
    for (let t = 0; t < 30; t += 1 / 60) sim.step(1 / 60);
    prevFit = null; morph = 1;
    for (const r of sim.receptors) r.glow = r.bound ? 1 : 0;
    for (const L of sim.ligands) { L.snap = 1; if (L.dying) L.alpha = 0; }
    render();
    readouts(0);
  }

  // ---------------------------------------------------------------- controls
  const icons = {
    snug: '<path d="M2 3h18v6h-5l-1.5 4h-5L7 9H2z" fill="currentColor" opacity=".85"/>',
    look: '<path d="M2 3h18v6h-9v4H8L7 9H2z" fill="currentColor" opacity=".85"/>',
    wrong: '<path d="M2 3h18v7c-1.5 0-2 3-3.5 3S14 10 11 10s-3.5 3-5 3S3.5 10 2 10z" fill="currentColor" opacity=".85"/>',
  };
  function setFit(f, { user = false } = {}) {
    if (f === fit) return;
    if (!ctx.reducedMotion) { prevFit = fit; morph = 0; }
    fit = f;
    sim.setFit(f);
    seg.set(f);
    if (user) ctx.announce(`Fit: ${FITS[f].label}`);
    if (ctx.reducedMotion) snapshot(); else if (!loop.playing) render();
  }
  const play = ctx.reducedMotion ? null : ctx.ui.playPause({ loop });
  const seg = ctx.ui.segmented({
    label: 'Fit', value: fit,
    options: Object.entries(FITS).map(([v, f]) => ({ value: v, label: f.label })),
    onChange: (v) => setFit(v, { user: true }),
  });
  seg.el.querySelectorAll('.segmented__opt').forEach((b) => {
    const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', '0 0 22 14'); s.setAttribute('class', 'bind-ico'); s.setAttribute('aria-hidden', 'true');
    s.innerHTML = icons[b.dataset.value];
    b.prepend(s);
  });
  const slider = ctx.ui.slider({
    label: 'Ligand molecules', min: range().min, max: range().max, step: 1, value: count,
    format: (v) => String(v),
    onInput: (v) => { count = v; sim.setCount(v, { fade: !ctx.reducedMotion }); if (ctx.reducedMotion) snapshot(); else if (!loop.playing) render(); },
  });
  ctx.ui.button({
    label: 'Reset', icon: 'reset', variant: 'ghost',
    onClick: () => {
      count = range().def; slider.set(count, { silent: true });
      sim.reset(count); fx.clear(); tracked = null; avg = 0;
      if (ctx.reducedMotion) snapshot(); else { render(); readouts(0); }
      ctx.announce('Simulation reset');
    },
  });
  let runBtn = null;
  if (ctx.reducedMotion) {
    runBtn = ctx.ui.button({
      label: 'Run 10 seconds', icon: 'play',
      onClick: () => { if (runLeft > 0) return; runLeft = 10; runBtn.el.setAttribute('aria-disabled', 'true'); loop.play(); },
    });
  }

  // Guided path: the writer's four captions set the scene; all controls stay free.
  const stepper = ctx.ui.stepper({
    steps: [0, 1, 2, 3].map(() => ({ enter(tl) { tl.to({}, { duration: 0.4 }); } })),
    scene: main,
    onChange(i) {
      const want = ['snug', 'snug', 'look', 'wrong'][i];
      setFit(want);
      if (i === 1) pickTracked(); else tracked = null;
      if (!loop.playing) render();
    },
  });
  void stepper;
  function pickTracked() {
    const bound = sim.ligands.filter((l) => l.state === 'bound' && !l.dying);
    const pool = bound.length ? bound : sim.ligands.filter((l) => !l.dying);
    tracked = pool.sort((a, b) => Math.abs(a.x - sim.W / 2) - Math.abs(b.x - sim.W / 2))[0] || null;
  }

  // ---------------------------------------------------------------- layout
  await buildSprites();
  let laidOut = false;
  ctx.onResize(async ({ compact: cmp }) => {
    const changed = cmp !== compact || !laidOut;
    compact = cmp;
    // readouts: beside the stage (wide), after the controls (phones)
    if (compact) ctx.controls.after(read); else main.append(read);
    if (changed) {
      const r = range();
      if (laidOut) { count = r.def; }
      slider.input.min = String(r.min); slider.input.max = String(r.max);
      slider.set(count, { silent: true });
    }
    const prevU = u;
    newSim();
    if (u !== prevU || !spr) await buildSprites();
    laidOut = true;
    if (ctx.reducedMotion) snapshot(); else { render(); readouts(0); }
  });
  if (!sim) newSim();
  if (ctx.reducedMotion) snapshot(); else { render(); readouts(0); }
  void play;

  return { destroy() { loop.pause(); } };
}
