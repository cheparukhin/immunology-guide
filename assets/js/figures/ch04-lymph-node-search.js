// ch04-lymph-node-search — "Needle in a haystack"
//
// A canvas crowd of T cells (shared/agents.js: seeded persistent random walks, fixed steps)
// wanders through a lymph-node interior (art lymphNodeField) past one mature dendritic cell
// (art dendriticCell, SVG, dendrites swaying with art breathe). No homing: a T cell that brushes
// the dendritic cell pauses briefly (shared contactRing, faint) and leaves at the speed it came.
// Exactly one T cell carries the matching receptor; it is unmarked until it touches. Then the
// recognition ring and green-cyan "+" disc appear (cell-actions recognize), a close-up shows its
// receptor notch seated on the cargo's epitope (art tcrKey + epitopeKey), and it photocopies
// itself 2 → 4 → 8 (cell-actions divide).
//
// Traffic (book-compare C9): fresh T cells arrive from the blood through a high-endothelial-venule
// segment on one edge, and after a dwell time drift out with the lymph on the opposite edge (a weak
// pull toward the exit only once their dwell is over; never toward the dendritic cell). The match is
// always a cell that has not left before its contact; once matched it stays and divides.
// Rule 18: the demo odds (1 in N, from the actual crowd) always sit beside the real odds.
// The simulated clock is calibrated by contacts: one dendritic cell ≈ 3,000 contacts per hour,
// the same assumption the "real odds" calculator uses (100,000 contacts ≈ 33 hours).
// This is a free-running simulation, so the writer's three captions follow its phases
// (arrival · search · match) instead of a Back/Next stepper.
import {
  lymphNodeField, lymphaticVessel, bloodVessel, dendriticCell, tCell, tcrKey, epitopeKey, cellInfo, breathe, drawSprite, el,
} from '../art/index.js';
import { rng, fixedStep, walk, spriteStates, createEffects, contactRing } from './shared/agents.js';
import { rig, recognize, divide } from './shared/cell-actions.js';

const ID = 'ch04-lymph-node-search';
const MATCH_KEY = 23;
const REAL = 100000;                 // ~1 in 100,000 naive T cells reads a given target
const PER_HOUR = 3000;               // contacts per dendritic cell per hour (assumption, printed in the panel)
const SETTLE = 3;                    // seconds of sim time for the opening beat
const PAUSE = 0.9;                   // contact pause (sim s)
const DWELL = [120, 300];            // sim s a T cell stays before it starts to drift toward the exit
const EXIT_PULL = 0.5;               // weak heading bias toward the exit once the dwell is over
const EXIT_R = 16;                   // reaching this close to the exit = gone with the lymph
const FADE_IN = 0.8;                 // sim s for a new arrival to fade in at the vessel

const LAYOUTS = {
  wide: { W: 960, H: 540, field: { x: 36, y: 60, width: 888, height: 470 }, dcR: 76, tr: 4.1, speed: 40, mr: 6.6, labelTop: 0,
    hev: 158, exit: -22,
    hevLabel: { x: 22, y: 476, anchor: 'start', sub: 'high endothelial venule' }, exitLabel: { x: 940, y: 150, anchor: 'end' } },
  compact: { W: 400, H: 600, field: { x: 12, y: 204, width: 376, height: 388 }, dcR: 58, tr: 3.6, speed: 30, mr: 6.2, labelTop: 0,
    hev: 118, exit: -62,
    hevLabel: { x: 132, y: 592, anchor: 'start' }, exitLabel: { x: 330, y: 214, anchor: 'start', text: 'out with', sub: 'the lymph', subFg: true } },
};

const CSS = `
[data-figure="${ID}"] .lns-layer { position: absolute; inset: 0; width: 100%; height: 100%; }
[data-figure="${ID}"] .lns-ov { pointer-events: none; }
[data-figure="${ID}"] .lns-odds { position: absolute; z-index: 4; left: 50%; top: 0.7rem; transform: translateX(-50%); width: min(58%, 40rem);
  margin: 0; padding: 0.45rem 0.8rem 0.5rem; border-radius: 12px; text-align: center; pointer-events: none;
  background: color-mix(in srgb, var(--halo) 70%, transparent); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--line) 55%, transparent);
  font: 500 13px/1.45 var(--font-ui); color: var(--fg-2); text-wrap: balance; }
[data-figure="${ID}"] .lns-odds b { color: var(--fg); font-weight: 650; font-variant-numeric: tabular-nums; }
[data-figure="${ID}"] .lns-odds .lns-easier { display: block; color: var(--fg-3); font-weight: 560; }
[data-figure="${ID}"].is-compact .lns-odds { top: 3.9rem; width: calc(100% - 1.5rem); padding: 0.4rem 0.65rem; font-size: 13px; text-wrap: pretty; }
[data-figure="${ID}"] .lns-bar { display: flex; flex-wrap: wrap; gap: 0.4rem 1.6rem; align-items: baseline; width: 100%;
  font: 500 14px/1.35 var(--font-ui); color: var(--ink-2); font-variant-numeric: tabular-nums; }
[data-figure="${ID}"] .lns-bar b { color: var(--ink); font-weight: 650; }
[data-figure="${ID}"] .lns-speed > summary { cursor: pointer; font: 600 14px/1 var(--font-ui); color: var(--ink-2); padding: 0.85rem 0.25rem; list-style-position: inside; min-height: 44px; box-sizing: border-box; }
[data-figure="${ID}"] .lns-speed[open] > summary { padding-bottom: 0.4rem; }
[data-figure="${ID}"] .lns-phases { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.55rem; }
[data-figure="${ID}"] .lns-phases li { display: grid; grid-template-columns: 1.6rem 1fr; gap: 0.6rem; align-items: start; color: var(--ink-3); transition: color 400ms ease; }
[data-figure="${ID}"] .lns-phases li .n { display: inline-grid; place-items: center; width: 1.45rem; height: 1.45rem; margin-top: 0.15rem; border-radius: 50%;
  font: 650 12px/1 var(--font-ui); box-shadow: inset 0 0 0 1.5px currentColor; }
[data-figure="${ID}"] .lns-phases li p { margin: 0; }
[data-figure="${ID}"] .lns-phases li[aria-current="step"] { color: var(--ink); }
[data-figure="${ID}"] .lns-phases li[aria-current="step"] .n { background: var(--accent); color: var(--paper); box-shadow: none; }
[data-figure="${ID}"] .lns-odds-panel { display: grid; gap: 0.75rem; font: 400 15px/1.5 var(--font-ui); color: var(--ink-2); }
[data-figure="${ID}"] .lns-odds-panel .lns-tag { justify-self: start; font: 650 11px/1 var(--font-ui); letter-spacing: var(--tracking-caps); text-transform: uppercase; color: var(--ink-3);
  padding: 0.3rem 0.5rem; border-radius: var(--r-pill); box-shadow: inset 0 0 0 1px var(--rule); }
[data-figure="${ID}"] .lns-odds-panel p { margin: 0; }
[data-figure="${ID}"] .lns-rows { display: grid; gap: 0.4rem; }
[data-figure="${ID}"] .lns-row { display: grid; grid-template-columns: 9rem 1fr 7.8rem; gap: 0.6rem; align-items: center; font-size: 14px; color: var(--ink-3); font-variant-numeric: tabular-nums; }
[data-figure="${ID}"] .lns-row .track { height: 10px; border-radius: 5px; background: color-mix(in srgb, var(--ink) 7%, transparent); overflow: hidden; }
[data-figure="${ID}"] .lns-row .fill { height: 100%; min-width: 3px; border-radius: 5px; background: var(--ink-3); transition: background 300ms ease; }
[data-figure="${ID}"] .lns-row.is-on { color: var(--ink); font-weight: 600; }
[data-figure="${ID}"] .lns-row.is-on .fill { background: var(--accent); }
[data-figure="${ID}"] .lns-readout { font: 600 17px/1.35 var(--font-ui); color: var(--ink); }
[data-figure="${ID}"] .lns-foot { font-size: 13px; color: var(--ink-3); }
@container fig (max-width: 599.98px) { [data-figure="${ID}"] .lns-row { grid-template-columns: 5.6rem 1fr 6.6rem; font-size: 13px; } }
@media (prefers-reduced-motion: reduce) { [data-figure="${ID}"] .lns-phases li { transition: none; } }
`;
function injectCSS() {
  if (document.getElementById(`${ID}-css`)) return;
  document.head.append(Object.assign(document.createElement('style'), { id: `${ID}-css`, textContent: CSS }));
}

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const smooth = (t) => { const x = clamp(t, 0, 1); return x * x * (3 - 2 * x); };
const fmtN = (v) => Math.round(v).toLocaleString('en-US');
function simClock(contacts) {
  const min = (contacts / PER_HOUR) * 60;
  if (min < 60) return `${Math.floor(min)} min`;
  const h = Math.floor(min / 60); const m = Math.floor(min - h * 60);
  return `${h} h ${String(m).padStart(2, '0')} min`;
}

/** The match close-up: the clone's receptor notch with the cargo's epitope plug seated in it. */
function fitGlyph({ key, size = 24, stage = 'dark' }) {
  const g = el('g');
  const rec = tcrKey({ key, size, color: 'cd8', stage, detail: 'high' });
  const ep = epitopeKey({ key, size, facing: 'down', stage });
  ep.setAttribute('transform', `translate(0 ${rec.dataset.dockY})`);
  rec.append(ep);
  rec.setAttribute('transform', `translate(0 ${(size * 0.62).toFixed(2)})`);
  g.append(rec);
  return g;
}

export default async function mount(fig, ctx) {
  injectCSS();
  const { gsap } = ctx;
  const steps = ctx.steps || [];

  // ---------------------------------------------------------------- stage layers
  ctx.setAspect(16 / 9, 400 / 600);
  const bg = ctx.createSVG({ viewBox: '0 0 960 540', className: 'lns-layer lns-bg' });
  const cv = ctx.canvas();
  cv.el.classList.add('lns-layer');
  const ov = ctx.createSVG({ viewBox: '0 0 960 540', className: 'lns-layer lns-ov' });
  const odds = ctx.h('p', { class: 'lns-odds', 'aria-live': 'off' });
  ctx.stage.append(odds);
  const clock = ctx.ui.clock({ value: '0 min' });
  ctx.tag('Illustrative');
  ctx.tag('Time compressed');

  // ---------------------------------------------------------------- captions follow the simulation's phases
  const phases = ctx.h('ol', { class: 'lns-phases' });
  const phaseEls = steps.map((st, i) => {
    const li = ctx.h('li', {}, ctx.h('span', { class: 'n', 'aria-hidden': 'true', text: String(i + 1) }), ctx.h('p', { html: st.html }));
    phases.append(li);
    return li;
  });
  ctx.caption.prepend(phases);
  let phase = -1;
  function setPhase(i, announce = true) {
    if (i === phase || !phaseEls.length) return;
    phase = clamp(i, 0, phaseEls.length - 1);
    phaseEls.forEach((li, k) => { if (k === phase) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current'); });
    if (announce) ctx.announce(steps[phase]?.text || '');
  }

  // ---------------------------------------------------------------- state
  let LY = null; let layoutName = ''; let N = 400;
  let field = null; let fieldInfo = null;
  let dcWrap = null; let dcArt = null; let dcInfo = null; let dcRest = [0, 0]; let dcFrom = [0, 0];
  let breatheH = null;
  let mask = null; let maskW = 0;
  let sheet = null;
  let agents = []; let M = -1;           // index of the match
  let HEV = [0, 0]; let HEV_IN = 0; let EXIT = [0, 0];   // arrival point + inward heading (rad), exit target
  let runSeed = 1;
  let simT = 0; let contacts = 0;
  let found = false; let revealed = false; let foundAfter = 0;
  let matchTl = null; let matchG = null;
  const fx = createEffects();
  let speed = 1;
  let ffwd = null;          // { prev } while "Find the match" fast-forwards the (unchanged, unbiased) search
  let stillMode = false;
  let findBtn = null;

  // ---------------------------------------------------------------- scene build (per layout)
  async function buildScene(name) {
    layoutName = name;
    LY = LAYOUTS[name];
    const { W, H } = LY;
    for (const s of [bg, ov]) { s.setAttribute('viewBox', `0 0 ${W} ${H}`); s.replaceChildren(s.defs); }
    ctx.el.classList.toggle('lns-compact', name === 'compact');
    field = lymphNodeField({ ...LY.field, seed: 7, stage: 'dark', label: true, density: name === 'compact' ? 0.8 : 1 });
    bg.append(field);
    fieldInfo = cellInfo(field);
    const { cx, cy, rx, ry } = fieldInfo;
    // afferent lymphatic entering at the upper left
    const ang = name === 'compact' ? -138 : -152;   // compact: clear of the "LYMPH NODE" label
    const ar = ang * Math.PI / 180;
    const mouth = [cx + Math.cos(ar) * rx * 0.99, cy + Math.sin(ar) * ry * 0.99];
    // short stub of the afferent lymphatic, kept inside the stage
    const vesLen = name === 'compact' ? 64 : 76;
    const ves = lymphaticVessel({ length: vesLen, width: name === 'compact' ? 20 : 24, valves: 0, seed: 3, stage: 'dark', flow: 1 });
    ves.setAttribute('transform', `translate(${mouth[0] + Math.cos(ar) * vesLen * 0.36} ${mouth[1] + Math.sin(ar) * vesLen * 0.36}) rotate(${ang})`);
    ves.setAttribute('opacity', '0.8');
    bg.insertBefore(ves, field);
    // traffic: fresh T cells arrive from the blood through a high endothelial venule on one edge and
    // leave with the lymph through an efferent lymphatic on the opposite edge
    const edge = (deg, k = 1) => { const t = deg * Math.PI / 180; return [cx + Math.cos(t) * rx * k, cy + Math.sin(t) * ry * k]; };
    const tangent = (deg) => { const t = deg * Math.PI / 180; return Math.atan2(ry * Math.cos(t), -rx * Math.sin(t)) * 180 / Math.PI; };
    HEV = edge(LY.hev, 0.82);
    HEV_IN = (LY.hev + 180) * Math.PI / 180;
    EXIT = edge(LY.exit, 0.84);
    const hevAt = edge(LY.hev, 0.93);
    const hev = bloodVessel({ length: name === 'compact' ? 54 : 64, width: name === 'compact' ? 20 : 22, wall: 6, rbc: 2, seed: 9, stage: 'dark', streaks: false });
    hev.setAttribute('transform', `translate(${hevAt[0].toFixed(1)} ${hevAt[1].toFixed(1)}) rotate(${tangent(LY.hev).toFixed(1)})`);
    hev.setAttribute('opacity', '0.9');
    bg.append(hev);
    const ea = LY.exit * Math.PI / 180;
    const exMouth = edge(LY.exit, 0.99);
    const exLen = name === 'compact' ? 50 : 72;
    const eff = lymphaticVessel({ length: exLen, width: name === 'compact' ? 18 : 22, valves: 1, seed: 4, stage: 'dark', flow: 1 });
    eff.setAttribute('transform', `translate(${(exMouth[0] + Math.cos(ea) * exLen * 0.36).toFixed(1)} ${(exMouth[1] + Math.sin(ea) * exLen * 0.36).toFixed(1)}) rotate(${LY.exit})`);
    eff.setAttribute('opacity', '0.8');
    bg.insertBefore(eff, field);
    trafficG = { hevAt, exOut: [exMouth[0] + Math.cos(ea) * exLen * 0.62, exMouth[1] + Math.sin(ea) * exLen * 0.62], ea };
    dcRest = [cx - rx * (name === 'compact' ? 0.02 : 0.06), cy + ry * (name === 'compact' ? 0.05 : 0.04)];
    dcFrom = [mouth[0] - Math.cos(ar) * 6, mouth[1] - Math.sin(ar) * 6];
    // the dendritic cell (SVG, below the canvas crowd)
    dcWrap = ctx.svg('g', {}, bg);
    dcArt = dendriticCell({ r: LY.dcR, state: 'mature', seed: 5, stage: 'dark' });
    dcWrap.append(dcArt);
    dcInfo = cellInfo(dcArt);
    breatheH?.stop?.();
    breatheH = ctx.track(breathe(dcArt, { amplitude: 1.1, period: 7 }));
    // contact mask: the dendritic cell's outline (with dendrites), widened by a T-cell radius
    maskW = W;
    const oc = document.createElement('canvas');
    oc.width = W; oc.height = H;
    const og = oc.getContext('2d');
    og.translate(dcRest[0], dcRest[1]);
    og.beginPath();
    (dcInfo?.outline || []).forEach(([x, y], i) => (i ? og.lineTo(x, y) : og.moveTo(x, y)));
    og.closePath();
    og.fillStyle = '#fff'; og.fill();
    og.lineWidth = LY.tr * 2 + 2; og.strokeStyle = '#fff'; og.lineJoin = 'round'; og.stroke();
    const img = og.getImageData(0, 0, W, H).data;
    mask = new Uint8Array(W * H);
    for (let i = 0; i < W * H; i++) mask[i] = img[i * 4 + 3] > 40 ? 1 : 0;
    sheet = await spriteStates({
      k: ['tCell', { variant: 'cd8', r: LY.tr, detail: 'low', stage: 'dark' }],
      h: ['tCell', { variant: 'cd4', r: LY.tr, detail: 'low', stage: 'dark' }],
    }, { seeds: 4 });
    // overlay: static direction arrows and names for the two vessels (also the reduced-motion cue)
    drawTraffic();
    // overlay groups
    matchG = ctx.svg('g', {}, ov);
  }
  let trafficG = null;
  function chevron(parent, x, y, deg, color) {
    ctx.svg('path', { d: 'M-3.6 -6L3 0L-3.6 6', transform: `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${deg.toFixed(1)})`,
      style: `fill: none; stroke: ${color}; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; stroke-opacity: 0.9` }, parent);
  }
  function drawTraffic() {
    const g = ctx.svg('g', { class: 'lns-traffic' }, ov);
    const { hevAt, exOut, ea } = trafficG;
    const inDeg = HEV_IN * 180 / Math.PI;
    // into the node from the venule; out along the efferent lymphatic
    [1.55, 2.4].forEach((k) => chevron(g, hevAt[0] + Math.cos(HEV_IN) * 15 * k, hevAt[1] + Math.sin(HEV_IN) * 15 * k, inDeg, '#F2A3AA'));
    [-0.45, 0.25].forEach((k) => chevron(g, exOut[0] + Math.cos(ea) * 26 * k, exOut[1] + Math.sin(ea) * 26 * k, LY.exit, '#B9D7EA'));
    const lab = (o, text, to) => {
      text = o.text || text;
      const t = ctx.svg('text', { class: 't-small t-halo', x: o.x, y: o.y, 'text-anchor': o.anchor, text, style: 'fill: var(--fg)' }, g);
      if (o.sub) ctx.svg('text', { class: `t-small t-halo${o.subFg ? '' : ' t-muted'}`, x: o.x, y: o.y + 16, 'text-anchor': o.anchor, text: o.sub, style: o.subFg ? 'fill: var(--fg)' : null }, g);
      const w = text.length * (layoutName === 'compact' ? 7.4 : 6.6);
      const x0 = o.anchor === 'end' ? o.x - w : o.x, x1 = o.anchor === 'end' ? o.x : o.x + w;
      const sx = clamp(to[0], x0, x1), sy = to[1] < o.y ? o.y - 15 : o.y + (o.sub ? 21 : 5);
      const d = Math.hypot(to[0] - sx, to[1] - sy) || 1;
      if (d > 14) ctx.svg('line', { class: 'leader', x1: sx.toFixed(1), y1: sy.toFixed(1), x2: (to[0] - (to[0] - sx) / d * 8).toFixed(1), y2: (to[1] - (to[1] - sy) / d * 8).toFixed(1) }, g);
      return t;
    };
    lab(LY.hevLabel, 'from the blood', hevAt);
    lab(LY.exitLabel, 'out with the lymph', exOut);
  }
  const inMask = (x, y) => {
    const xi = x | 0; const yi = y | 0;
    if (xi < 0 || yi < 0 || xi >= maskW || yi >= LY.H) return false;
    return mask[yi * maskW + xi] === 1;
  };

  // ---------------------------------------------------------------- simulation (deterministic per seed)
  function makeAgents(seed) {
    const R = rng(seed * 7919 + 13);
    const list = [];
    const { cx, cy, rx, ry } = fieldInfo;
    const dcClear = LY.dcR * 1.05;
    for (let i = 0; i < N; i++) {
      let x = cx; let y = cy;
      for (let k = 0; k < 60; k++) {
        x = cx + R.range(-rx, rx); y = cy + R.range(-ry, ry);
        if (Math.hypot((x - cx) / rx, (y - cy) / ry) < 0.9 && fieldInfo.inside(x, y) && Math.hypot(x - dcRest[0], y - dcRest[1]) > dcClear) break;
      }
      list.push({ x, y, x0: x, y0: y, heading: R.range(0, Math.PI * 2), speed: LY.speed * R.range(0.75, 1.25), r: LY.tr,
        kind: R() < 0.62 ? 'k' : 'h', variant: i % 4, rng: rng(seed * 104729 + i * 31 + 7), st: 0, t: 0, first: -1,
        dw: R.range(10, DWELL[1]), born: -1e3, firstExit: -1 });
    }
    return list;
  }
  const inside = (x, y) => fieldInfo.inside(x, y);
  /** A cell that left with the lymph is replaced by a fresh one arriving from the blood (same slot). */
  function respawn(a, t) {
    const R = a.rng;
    a.x = HEV[0] + R.range(-5, 5); a.y = HEV[1] + R.range(-5, 5);
    a.heading = HEV_IN + R.range(-0.5, 0.5);
    a.dw = R.range(DWELL[0], DWELL[1]);
    a.st = 0; a.born = t;
    if (a.firstExit < 0) a.firstExit = t;
  }
  /** Advance one agent by dt. Returns true on a new contact.
   *  (st: 0 walk · 1 paused at the dendritic cell · 2 moving off after a contact · 3 matched · 4 drifting to the exit) */
  function stepAgent(a, dt, t, live) {
    if (a.st === 3) return false;
    if (a.st === 1) {
      a.t -= dt;
      if (a.t <= 0) a.st = 2;
      return false;
    }
    const leaving = a.st === 4;
    walk(a, dt, { turn: 1.25, bounds: inside, bias: leaving ? { x: EXIT[0], y: EXIT[1], strength: EXIT_PULL } : null });
    if (leaving && Math.hypot(a.x - EXIT[0], a.y - EXIT[1]) < EXIT_R) { respawn(a, t); return false; }
    const touching = t >= SETTLE && inMask(a.x, a.y);
    if (a.st === 2) { if (!touching) a.st = 0; return false; }
    if (touching) { a.st = 1; a.t = PAUSE * (0.8 + 0.4 * a.rng()); return true; }
    if (a.st === 0) { a.dw -= dt; if (a.dw <= 0 && t >= SETTLE) a.st = 4; }
    return false;
  }
  /** Run the seeded crowd forward (no drawing) to learn each cell's first contact; choose the match. */
  function chooseMatch(seed, t0 = 0) {
    const sim = makeAgents(seed);
    const dt = 1 / 60; let t = t0;
    while (t < t0 + 40.5) {
      t += dt;
      for (const a of sim) if (stepAgent(a, dt, t, false) && a.first < 0) a.first = t;
    }
    const R = rng(seed * 31 + 5);
    // the match must still be the cell that started in this slot when it first touches (it never left)
    const stayed = (a) => a.firstExit < 0 || a.firstExit > a.first;
    const pool = sim.map((a, i) => ({ i, f: a.first - t0, k: a.kind, ok: stayed(a) })).filter((o) => o.ok && o.k === 'k' && o.f >= 22 && o.f <= 40);
    const any = sim.map((a, i) => ({ i, f: a.first - t0, ok: stayed(a) })).filter((o) => o.ok && o.f >= 12);
    const pick = (pool.length ? pool : any.length ? any : [{ i: 0 }]);
    return pick[Math.floor(R() * pick.length)].i;
  }

  function resetRun(seed, t0 = 0) {
    runSeed = seed;
    agents = makeAgents(seed);
    M = chooseMatch(seed, t0);
    agents[M].kind = 'k';
    simT = t0; contacts = 0; found = false; revealed = false; foundAfter = 0; stillMode = false;
    fx.clear();
    matchTl?.kill(); matchTl = null;
    matchG.replaceChildren();
    tick = fixedStep(stepAll, { dt: 1 / 60, max: 48 });
    updateReadouts(true);
  }
  let tick = null;
  function stepAll(dt) {
    simT += dt;
    for (let i = 0; i < agents.length; i++) {
      const a = agents[i];
      if (stepAgent(a, dt, simT, true)) {
        if (i === M && !found) { onMatch(a); continue; }
        contacts++;
        if (speed <= 4 || ((contacts * 2654435761) >>> 0) % 1000 < 4000 / speed) contactRing(fx, a.x, a.y, { color: a.kind === 'k' ? ctx.colors.cd8 : ctx.colors.cd4, r: 7, life: 0.8, core: false });
      }
    }
  }

  // ---------------------------------------------------------------- the match
  function contactPoint(a) {
    // step from the T cell toward the dendritic cell until inside its body outline
    const dx = dcRest[0] - a.x; const dy = dcRest[1] - a.y; const d = Math.hypot(dx, dy) || 1;
    return [a.x + (dx / d) * LY.tr * 0.8, a.y + (dy / d) * LY.tr * 0.8];
  }
  function onMatch(a, { still = false } = {}) {
    found = true; if (!still) contacts++; foundAfter = contacts;
    if (ffwd) { speed = ffwd.prev; ffwd = null; }      // back to the reader's speed for the payoff
    a.st = 3;
    const stage = 'dark';
    matchG.replaceChildren();
    const cell = rig(tCell({ variant: 'cd8', r: LY.mr, state: 'activated', seed: 11, stage, tcrKey: MATCH_KEY }), { x: a.x, y: a.y, parent: matchG, tcrKey: MATCH_KEY });
    const tl = gsap.timeline({ paused: true });
    tl.fromTo(cell.layers.idle, { scale: 0.55, svgOrigin: '0 0' }, { scale: 1, duration: 0.6, ease: 'so.out' }, 0);
    const [px, py] = contactPoint(a);
    recognize(tl, cell, { x: px, y: py }, { radius: LY.mr * 1.5, pos: 0.1 });
    // close-up: the receptor notch seated on the cargo's epitope
    const { W } = LY;
    const side = a.x > W * 0.62 ? -1 : 1;
    const cx = clamp(a.x + side * (layoutName === 'compact' ? 64 : 92), 46, W - 46);
    const cy = clamp(a.y - (layoutName === 'compact' ? 70 : 84), LY.field.y + 30, LY.H - 60);
    const callout = ctx.svg('g', { opacity: 0 }, matchG);
    ctx.svg('line', { class: 'leader', x1: cx - side * 30, y1: cy + 18, x2: a.x + side * LY.mr * 1.2, y2: a.y - LY.mr * 1.2 }, callout);
    ctx.svg('circle', { cx, cy, r: 34, style: 'fill: rgb(11 16 36 / 0.82); stroke: rgb(233 236 246 / 0.22); stroke-width: 1', 'vector-effect': 'non-scaling-stroke' }, callout);
    const fg = fitGlyph({ key: MATCH_KEY, size: 29 });
    fg.setAttribute('transform', `translate(${cx} ${cy + 2})`);
    callout.append(fg);
    ctx.svg('text', { class: 't-label t-halo t-mid', x: cx, y: cy + 54, text: 'Receptor fits' }, callout);
    ctx.svg('text', { class: 't-small t-halo t-mid', x: cx, y: cy + 71, text: 'the match' }, callout);
    tl.fromTo(callout, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power1.out' }, 0.5);
    // photocopying: 2 → 4 → 8
    const ang = (Math.atan2(a.y - dcRest[1], a.x - dcRest[0]) * 180) / Math.PI;
    const g1 = divide(tl, cell, 2, { pos: 2.4, angle: ang + 90, duration: 1.5, spread: LY.mr * 1.5 });
    let g2 = [];
    g1.forEach((d, i) => { g2 = g2.concat(divide(tl, d, 2, { pos: i ? '<' : '+=0.35', angle: ang, duration: 1.4, spread: LY.mr * 1.35 })); });
    g2.forEach((d, i) => { divide(tl, d, 2, { pos: i ? '<' : '+=0.35', angle: ang + 45 + i * 20, duration: 1.3, spread: LY.mr * 1.2 }); });
    const lab = ctx.svg('g', { opacity: 0 }, matchG);
    const noteW = layoutName === 'compact' ? 172 : 0;   // phones: keep the whole note on stage
    const lx = side > 0 ? clamp(a.x + 26, 20, W - 8 - noteW) : clamp(a.x - 26, 20, W - 20); const ly = clamp(a.y + 46, LY.field.y + 20, LY.H - 30);
    ctx.svg('line', { class: 'leader', x1: lx - side * 4, y1: ly - 14, x2: a.x + side * 8, y2: a.y + 8 }, lab);
    ctx.svg('text', { class: `t-label t-halo${side < 0 ? ' t-end' : ''}`, x: lx, y: ly, text: '8 shown' }, lab);
    ctx.svg('text', { class: `t-small t-halo${side < 0 ? ' t-end' : ''}`, x: lx, y: ly + 17, text: layoutName === 'compact' ? 'real: thousands in days' : 'real: thousands within days' }, lab);   // phones: stays on stage
    tl.fromTo(lab, { opacity: 0 }, { opacity: 1, duration: 0.7 }, '<');
    matchTl = tl;
    tl.stop = () => tl.kill();
    if (still || ctx.reducedMotion) tl.progress(1); else { ctx.track(tl); tl.play(); }
    setPhase(2);
    ctx.announce(`Match found after ${fmtN(foundAfter)} contacts. It divides: 8 shown; in reality thousands within days.`);
    openOdds();
    updateReadouts(true);
  }

  // ---------------------------------------------------------------- render
  function render() {
    if (!sheet) return;
    const g = cv.g;
    const s = cv.width / LY.W;
    g.setTransform(cv.dpr * s, 0, 0, cv.dpr * s, 0, 0);
    g.clearRect(0, 0, LY.W, LY.H);
    // dendritic cell: opening beat from the afferent lymphatic, then settled
    const k = ctx.reducedMotion && simT === 0 ? 1 : smooth(simT / SETTLE);
    const x = dcFrom[0] + (dcRest[0] - dcFrom[0]) * k; const y = dcFrom[1] + (dcRest[1] - dcFrom[1]) * k;
    dcWrap.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${(0.6 + 0.4 * k).toFixed(3)})`);
    dcWrap.setAttribute('opacity', (0.25 + 0.75 * Math.min(1, k * 3)).toFixed(3));
    for (let i = 0; i < agents.length; i++) {
      const a = agents[i];
      if (i === M && found) continue;
      // arrivals fade in at the venule; leavers fade out into the efferent lymphatic
      let alpha = Math.min(1, (simT - a.born) / FADE_IN);
      if (a.st === 4) alpha = Math.min(alpha, (Math.hypot(a.x - EXIT[0], a.y - EXIT[1]) - EXIT_R) / 34);
      if (alpha <= 0.02) continue;
      sheet.draw(g, a, { state: a.kind, rotation: a.heading, alpha: Math.min(1, alpha) });
    }
    fx.draw(g);
    if (revealed && !found && agents[M]) {
      const a = agents[M];
      g.save();
      g.strokeStyle = '#F4F6FB'; g.lineWidth = 1.6; g.globalAlpha = 0.95;
      g.beginPath(); g.arc(a.x, a.y, LY.tr * 3.2, 0, Math.PI * 2); g.stroke();
      const fs = 13 / s;
      g.font = `650 ${fs}px Inter, system-ui, sans-serif`;
      g.textAlign = a.x > LY.W * 0.75 ? 'right' : 'left'; g.textBaseline = 'middle';
      const tx = a.x + (a.x > LY.W * 0.75 ? -1 : 1) * LY.tr * 4.4;
      g.lineJoin = 'round'; g.lineWidth = 3.5 / s; g.strokeStyle = 'rgba(11,16,36,0.9)';
      g.strokeText('the match', tx, a.y - LY.tr * 2.6);
      g.fillStyle = '#F4F6FB'; g.fillText('the match', tx, a.y - LY.tr * 2.6);
      g.restore();
    }
  }

  // ---------------------------------------------------------------- readouts
  const bar = ctx.h('div', { class: 'lns-bar', role: 'status', 'aria-live': 'off' });
  const cEl = ctx.h('b', { text: '0' });
  const mEl = ctx.h('span', {});
  bar.append(ctx.h('span', {}, 'Contacts made: ', cEl), mEl);
  ctx.controls.append(bar);
  let lastC = -1; let lastClock = '';
  function updateReadouts(force = false) {
    if (force || contacts !== lastC) { lastC = contacts; cEl.textContent = fmtN(contacts); }
    const ck = simClock(contacts);
    if (ck !== lastClock) { lastClock = ck; clock.set(ck); }
    if (force) {
      mEl.innerHTML = stillMode ? 'Match: <b>shown as a still</b> (press Play to watch the search)'
        : found ? `Match: <b>found after ${fmtN(foundAfter)} contacts</b>`
          : revealed ? `Match: <b>highlighted, ${ffwd ? 'fast-forwarding the search' : 'still searching'}</b>` : 'Match: <b>not found yet</b>';
      findBtn && (findBtn.el.disabled = found || revealed);
      odds.innerHTML = `<b>In this demo: 1 matching T cell among ${fmtN(N)}.</b> <b>In your body: roughly 1 in 100,000</b> (range about 1 in 10,000 to 1 in a million). <span class="lns-easier">This demo is hundreds of times easier than reality.</span>`;
    }
  }

  // ---------------------------------------------------------------- real odds (progressive disclosure)
  const card = ctx.ui.infoCard({ placement: 'below', empty: null, closable: true });
  let dcs = 1;
  const ROWS = [
    { n: 1, label: '1 dendritic cell', time: 'about 33 hours', h: REAL / PER_HOUR },
    { n: 10, label: '10 dendritic cells', time: 'about 3 hours', h: REAL / PER_HOUR / 10 },
    { n: 100, label: '100 dendritic cells', time: 'about 20 minutes', h: REAL / PER_HOUR / 100 },
  ];
  function oddsBody() {
    const wrap = ctx.h('div', { class: 'lns-odds-panel' });
    wrap.append(ctx.h('span', { class: 'lns-tag', text: 'Illustrative' }));
    wrap.append(ctx.h('p', { text: 'A back-of-the-envelope calculator, not a simulation. Fixed assumptions: odds 1 in 100,000; about 3,000 contacts per dendritic cell per hour; every contact a different T cell.' }));
    const seg = ctx.ui.segmented({
      label: 'Dendritic cells carrying this cargo', parent: null, value: String(dcs),
      options: ROWS.map((r) => ({ value: String(r.n), label: String(r.n) })),
      onChange: (v) => { dcs = Number(v); paintRows(); },
    });
    wrap.append(seg.el);
    const readout = ctx.h('p', { class: 'lns-readout', 'aria-live': 'polite' });
    wrap.append(readout);
    const rows = ctx.h('div', { class: 'lns-rows', 'aria-hidden': 'true' });
    const rowEls = ROWS.map((r) => {
      const fill = ctx.h('div', { class: 'fill', style: `width:${Math.max(0.6, (r.h / ROWS[0].h) * 100).toFixed(2)}%` });
      const row = ctx.h('div', { class: 'lns-row' }, ctx.h('span', { text: r.label }), ctx.h('div', { class: 'track' }, fill), ctx.h('span', { text: r.time }));
      rows.append(row);
      return row;
    });
    wrap.append(rows);
    wrap.append(ctx.h('p', { class: 'lns-foot', text: 'Real numbers vary, but many dendritic cells and a constant inflow of fresh T cells make the search routine despite the odds.' }));
    function paintRows() {
      const r = ROWS.find((x) => x.n === dcs) || ROWS[0];
      readout.textContent = `Expected time to the first match: ${r.time}`;
      rowEls.forEach((el2, i) => el2.classList.toggle('is-on', ROWS[i].n === dcs));
    }
    paintRows();
    return wrap;
  }
  function openOdds() {
    card.show({ kicker: 'Now the real odds', title: 'Why the search still succeeds', body: oddsBody() });
    oddsBtn.el.hidden = true;
  }

  // ---------------------------------------------------------------- controls
  const loop = ctx.loop((dt) => {
    if (!tick || !sheet) return;
    tick(dt * speed);
    fx.step(dt);
    if (phase === 0 && simT > SETTLE + 6) setPhase(1);
    render();
    updateReadouts();
  });
  ctx.ui.playPause({ loop, onChange: (on) => ctx.announce(on ? 'Simulation running' : 'Simulation paused') });
  const speedBox = ctx.h('details', { class: 'lns-speed' }, ctx.h('summary', { text: 'Speed' }));
  const slider = ctx.ui.slider({
    label: 'Speed', min: 1, max: 20, step: 1, value: 1, parent: null,
    format: (v) => `${v}×`, describe: (v) => `${v} times`,
    onInput: (v) => { if (ffwd) ffwd.prev = v; else speed = v; },
  });
  ctx.controls.append(slider.el);
  findBtn = ctx.ui.button({
    label: 'Find the match', icon: 'spark', variant: 'ghost',
    onClick: () => {
      if (found || revealed) return;
      revealed = true;
      // Polish: fast-forward the same random walk (no homing) until the match touches the dendritic
      // cell, then drop back to the reader's speed for the recognition and the photocopying.
      if (!ctx.reducedMotion) { ffwd = { prev: speed }; speed = 16; if (!loop.playing) loop.play(); }
      setPhase(2);
      openOdds();
      updateReadouts(true);
      render();
      ctx.announce('The matching T cell is now ringed and labeled “the match”. Fast-forwarding until it meets the dendritic cell.');
    },
  });
  ctx.ui.button({
    label: 'Reset', icon: 'reset', variant: 'ghost',
    onClick: () => {
      if (ffwd) { speed = ffwd.prev; ffwd = null; }
      resetRun(runSeed + 1, SETTLE);      // the dendritic cell stays settled
      setPhase(1);
      if (ctx.reducedMotion) applyStill(); else render();
      ctx.announce('New crowd. The match is somewhere else now.');
    },
  });
  const oddsBtn = ctx.ui.button({ label: 'Now the real odds', icon: 'arrowRight', variant: 'ghost', onClick: () => openOdds() });
  oddsBtn.el.hidden = true;
  ctx.ui.legend([
    { label: 'Killer T cell', color: ctx.colors.cd8, shape: 'circle' },
    { label: 'Helper T cell', color: ctx.colors.cd4, shape: 'circle' },
    { label: 'Dendritic cell', color: ctx.colors.dc, shape: 'glow' },
    { label: 'Brief contact', color: ctx.colors.cd8, shape: 'ring' },
    { label: 'Match (recognized)', color: ctx.colors.activate, icon: 'plus' },
  ]);
  card.el.addEventListener('click', (e) => { if (e.target.closest('.info-card__close')) oddsBtn.el.hidden = false; });

  // Reduced motion: a meaningful still — crowd static, the match found and expanded, the odds open.
  function applyStill() {
    const a = agents[M];
    // seat the match against the dendritic cell
    const ang = -0.6;
    let px = dcRest[0]; let py = dcRest[1];
    for (let d = LY.dcR * 1.1; d > 0; d -= 1) {
      const qx = dcRest[0] + Math.cos(ang) * d; const qy = dcRest[1] + Math.sin(ang) * d;
      if (inMask(qx, qy)) { px = qx; py = qy; break; }
    }
    a.x = px; a.y = py;
    simT = SETTLE;
    stillMode = true;
    onMatch(a, { still: true });
    render();
  }

  // ---------------------------------------------------------------- layout
  const want = () => ({ name: ctx.compact ? 'compact' : 'wide', n: ctx.width < 760 ? 150 : 400 });
  async function relayout() {
    const w = want();
    if (w.name === layoutName && w.n === N && agents.length) return;
    N = w.n;
    await buildScene(w.name);
    resetRun(runSeed, phase >= 1 ? SETTLE : 0);
    if (ctx.reducedMotion) applyStill();
    render();
  }
  function placeSlider(compact) {
    if (compact) { speedBox.append(slider.el); if (!speedBox.isConnected) findBtn.el.before(speedBox); }
    else { findBtn.el.before(slider.el); speedBox.remove(); }
  }
  await relayout();
  placeSlider(ctx.compact);
  setPhase(ctx.reducedMotion ? 2 : 0, false);
  let busy = false;
  ctx.onResize(async ({ compact }) => {
    placeSlider(compact);
    if (busy) return;
    busy = true;
    await relayout();
    busy = false;
    render();
  });
  ctx.onThemeChange(() => render());
  render();

  return {
    destroy() { loop.pause(); matchTl?.kill(); breatheH?.stop?.(); },
  };
}
