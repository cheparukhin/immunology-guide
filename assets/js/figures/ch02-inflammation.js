// ch02-inflammation — Figure 2.2 "Anatomy of an inflammation" (Chapter 2, build task F6).
//
// Nine steps through a side-on cross-section of skin: a splinter carries bacteria in → a resident
// macrophage and a mast cell raise the alarm → the venule widens (redness, heat) and leaks
// (swelling) → prostaglandins sensitise a nerve ending (pain) → neutrophils roll, stick and squeeze
// out → they eat the bacteria and die (pus) → a macrophage clears up and switches toward repair.
//
// How it is built
//   • ONE scene in a fixed 1000×600 frame. Phones see a 420×600 window onto the same scene (all the
//     action is composed inside x 290–710), with their own label positions — a re-framing, not a
//     shrink.
//   • Continuous scene state (vessel width, leak, swelling, tints, molecules…) lives in `S` and is
//     drawn by pure render functions. Each step tweens S with cell-actions `drive()`, so Next, Back,
//     dot jumps and reduced motion all land on identical frames (tools/stepper-check.mjs).
//   • Cells are art-library cells held in cell-actions rigs (move, emit, divide, die, swap).
//   • Blood flow is an ambient loop (ctx.loop) that only moves RBC wrappers marked data-ambient;
//     everything it shows that matters (how many cells, where the walls are) comes from S.
//   • HTML around the stage: the four-signs strip above it; the stepper's own phase groups under it.
import * as A from '../art/index.js';
import { rig, place, move, emit, die, swap, divide, drive, pulseAlong } from './shared/cell-actions.js';

const ID = 'ch02-inflammation';
const W = 1000;
const H = 560;
const CROP = { x: 290, y: -40, w: 420, h: 600 };   // the phone window onto the scene (extra air on top for the HUD)

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const lerp = (a, b, t) => a + (b - a) * t;
const seg = (p, a, b) => clamp01((p - a) / (b - a || 1));
const sm = (t) => t * t * (3 - 2 * t);
const r1 = (v) => String(Math.round(v * 10) / 10);
const DEG = Math.PI / 180;

// ------------------------------------------------------------------ scene geometry (scene units)
const SKIN = { top: 50, depth: 54 };
const SITE = 480;                                               // centre of the injury / bulge
const bulge = (x) => 22 * Math.exp(-(((x - SITE) / 185) ** 2));
const surfY = (x, sw) => SKIN.top + 2.2 * Math.sin(x * 0.012 + 0.6) + 1.3 * Math.sin(x * 0.033 + 2) - bulge(x) * sw;
const juncY = (x, sw) => SKIN.top + SKIN.depth + 6 * Math.sin(x * 0.047 + 1.1) + 2.5 * Math.sin(x * 0.12 + 0.3) - bulge(x) * sw * 0.9;

const VES = { x: 500, y: 450, half0: 58, half1: 58 * 1.4, wall: 14, len: 1200 };
const vHalf = (d) => lerp(VES.half0, VES.half1, d);
const lumenTop = (d) => VES.y - vHalf(d) + VES.wall;           // scene y of the luminal surface (top wall)
const wallOuter = (d) => VES.y - vHalf(d);                      // scene y of the outer surface (top wall)

const SPL = { tip: [452, 196], angle: 52, length: 640, slide: 280 };
const MAC = { x: 624, y: 270, r: 54, seed: 6 };
const MAST = { x: 330, y: 326, r: 24, seed: 4 };
const NR = 20;                                                   // neutrophil radius (≈1.7 × an RBC)
const PUS = { x: 484, y: 252 };
// where each neutrophil ends up eating (and dying); bacteria settle in four little clusters here
const SPOTS = [[444, 238], [498, 220], [532, 264], [480, 288]];
const SPOT_OF = { 2: 0, 1: 1, 0: 2, 3: 3 };                      // neutrophil → its engulfing spot
const GAP_WANT = [452, 540, 624];                                // desired gap positions (scene x)
const HOOKS = [252, 668];                                        // x-range of the selectin-bearing lining

// nerve: a trunk from the right edge to a branch point, three free endings under the epidermis
const NERVE = {
  trunk: [[1016, 318], [900, 298], [790, 244], [700, 188], [646, 168]],
  branches: [
    [[646, 168], [618, 150], [592, 132], [576, 117]],
    [[646, 168], [610, 166], [572, 160], [540, 146]],
    [[646, 168], [640, 146], [630, 127], [624, 113]],
  ],
};

const PHASES = [
  { label: 'The alarm', short: 'Alarm', steps: [0, 1] },
  { label: 'The four signs', short: 'Four signs', steps: [2, 3, 4] },
  { label: 'Neutrophils arrive', short: 'Neutrophils', steps: [5, 6, 7, 8] },
];
const CLOCK = ['0 min', 'First minutes', 'First minutes', 'First hour', 'First hour', 'Hours', 'Hours', 'First day', 'Days'];
const SIGNS = [
  { key: 'red', label: 'Redness', icon: 'drop', color: '#EE6468', deep: '#B4232C', on: [2, 3, 4, 5, 6, 7] },
  { key: 'heat', label: 'Heat', icon: 'thermometer', color: '#F39345', deep: '#A84E0E', on: [2, 3, 4, 5, 6, 7] },
  { key: 'swell', label: 'Swelling', icon: 'swell', color: '#63B6E6', deep: '#1D6C9A', on: [3, 4, 5, 6, 7] },
  { key: 'pain', label: 'Pain', icon: 'bolt', color: '#EBC350', deep: '#876405', on: [4, 5, 6, 7] },
];
const SWELL_ICON = '<path d="M9.2 9.2L4.6 4.6M4.6 8.6v-4h4"/><path d="M14.8 9.2l4.6-4.6M15.4 4.6h4v4"/><path d="M9.2 14.8l-4.6 4.6M4.6 15.4v4h4"/><path d="M14.8 14.8l4.6 4.6M19.4 15.4v4h-4"/><circle cx="12" cy="12" r="2.7"/>';

// In-stage labels: which steps show them, and where (wide / phone). `at` = leader target.
const LABELS = {
  skin: { text: 'Skin', steps: [0], delay: 0.2, wide: { x: 958, y: 93, anchor: 'end' }, compact: { x: 702, y: 93, anchor: 'end' } },
  splinter: { text: 'Splinter', steps: [0], delay: 0.9, wide: { x: 266, y: 34, anchor: 'end' }, compact: { x: 408, y: 30, anchor: 'start' } },
  bacteria: { text: 'Bacteria', steps: [0, 1], delay: 1.8, at: [440, 246], wide: { x: 380, y: 272, anchor: 'end' }, compact: { x: 380, y: 262, anchor: 'end' } },
  vessel: { text: 'Small blood vessel', steps: [0], delay: 0.4, wide: { x: 40, y: 380, anchor: 'start' }, compact: { x: 702, y: 380, anchor: 'end' } },
  macrophage: { text: 'Macrophage', steps: [1, 2], delay: 0.3, wide: { x: 686, y: 300, anchor: 'start' }, compact: { x: 630, y: 205, anchor: 'middle' } },
  mast: { text: 'Mast cell', steps: [1], delay: 0.6, wide: { x: 296, y: 331, anchor: 'end' }, compact: { x: 330, y: 372, anchor: 'middle' } },
  cytokines: { text: 'Cytokines', steps: [1], delay: 1.6, wide: { x: 720, y: 214, anchor: 'start' }, compact: { x: 702, y: 382, anchor: 'end' } },
  trail: { text: 'Chemokine gradient', steps: [1, 6], delay: 2.2, at: [522, 318], wide: { x: 574, y: 358, anchor: 'start' }, compact: { x: 560, y: 360, anchor: 'middle' } },
  histamine: { text: 'Histamine', steps: [1], delay: 1.9, wide: { x: 290, y: 366, anchor: 'end' }, compact: { x: 330, y: 292, anchor: 'middle' } },
  widens: { text: 'Vessel widens', steps: [2], delay: 0.8, wide: { x: 150, y: 345, anchor: 'middle' }, compact: { x: 420, y: 345, anchor: 'middle' } },
  warmIn: { text: 'More warm blood', steps: [2], delay: 1.0, wide: { x: 24, y: 456, anchor: 'start' }, compact: { x: 300, y: 456, anchor: 'start' } },
  leak: { text: 'Fluid leaks out', steps: [3], delay: 1.0, wide: { x: 706, y: 356, anchor: 'start' }, compact: { x: 702, y: 352, anchor: 'end' } },
  nerve: { text: 'Nerve ending', steps: [4], delay: 0.2, at: [600, 136], wide: { x: 720, y: 142, anchor: 'start' }, compact: { x: 702, y: 106, anchor: 'end' } },
  pg: { text: 'Prostaglandins', steps: [4], delay: 0.9, at: [566, 158], wide: { x: 500, y: 210, anchor: 'end' }, compact: { x: 520, y: 206, anchor: 'end' } },
  brain: { text: 'Signal to brain', steps: [4], delay: 1.6, wide: { x: 984, y: 340, anchor: 'end' }, compact: { x: 702, y: 210, anchor: 'end' } },
  hooks: { text: 'Selectins', steps: [5], delay: 1.0, at: [574, 384], wide: { x: 590, y: 352, anchor: 'start' }, compact: { x: 702, y: 352, anchor: 'end' } },
  rolling: { text: 'Neutrophils roll', steps: [5], delay: 2.6, wide: { x: 372, y: 494, anchor: 'middle' }, compact: { x: 420, y: 494, anchor: 'middle' } },
  grip: { text: 'Integrins bind', steps: [6], delay: 1.6, at: [452, 386], wide: { x: 372, y: 494, anchor: 'middle' }, compact: { x: 420, y: 494, anchor: 'middle' } },
  squeeze: { text: 'Squeezing out', steps: [6], delay: 3.0, wide: { x: 420, y: 364, anchor: 'end', at: [440, 372] }, compact: { x: 420, y: 364, anchor: 'end', at: [440, 372] } },
  pus: { text: 'Pus', steps: [7], delay: 6.4, at: [468, 262], wide: { x: 400, y: 304, anchor: 'end' }, compact: { x: 400, y: 304, anchor: 'end' } },
  repair: { text: 'Repair mode', steps: [8], delay: 3.2, wide: { x: 534, y: 342, anchor: 'middle' }, compact: { x: 534, y: 342, anchor: 'middle' } },
};

const CSS = `
[data-figure="${ID}"] .inf-signs { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.45rem 0.55rem; margin: 0 0 var(--s-3); padding: 0; list-style: none; }
[data-figure="${ID}"] .inf-sign {
  --sc: currentColor;
  display: inline-flex; align-items: center; gap: 0.42rem; min-height: 2.1rem;
  padding: 0.3rem 0.85rem 0.3rem 0.6rem; border-radius: 999px;
  font-family: var(--font-ui); font-size: var(--text-xs); font-weight: 600; line-height: 1; letter-spacing: 0.01em;
  color: var(--ink-3); background: transparent; box-shadow: inset 0 0 0 1.5px var(--rule-strong);
  transition: color .5s var(--ease-out), background-color .6s var(--ease-out), box-shadow .6s var(--ease-out);
}
[data-figure="${ID}"] .inf-sign svg { width: 1.15rem; height: 1.15rem; flex-shrink: 0; overflow: visible; }
[data-figure="${ID}"] .inf-sign .fig-icon { transition: fill .6s var(--ease-out), stroke .6s var(--ease-out); }
[data-figure="${ID}"] .inf-sign[data-lit="true"] {
  color: var(--ink); background: color-mix(in srgb, var(--sc) 14%, var(--surface));
  box-shadow: inset 0 0 0 1.5px var(--sc), 0 0 0 3px color-mix(in srgb, var(--sc) 13%, transparent), 0 0 18px color-mix(in srgb, var(--sc) 38%, transparent);
}
[data-figure="${ID}"] .inf-sign[data-lit="true"] .fig-icon { stroke: var(--sc-ink); fill: color-mix(in srgb, var(--sc) 70%, transparent); }
[data-figure="${ID}"] .inf-sign[data-lit="true"].is-fresh { transition-delay: .55s; }
[data-figure="${ID}"] .inf-sign[data-lit="true"].is-fresh .fig-icon { transition-delay: .55s; }
[data-figure="${ID}"] .inf-sign__state { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

@container fig (max-width: 599.98px) {
  [data-figure="${ID}"] .inf-signs { gap: 0.32rem; flex-wrap: nowrap; }
  [data-figure="${ID}"] .inf-sign { gap: 0.28rem; padding: 0.26rem 0.55rem 0.26rem 0.42rem; font-size: 0.75rem; min-height: 2rem; }
  [data-figure="${ID}"] .inf-sign svg { width: 0.95rem; height: 0.95rem; }
}
`;

function injectCSS() {
  if (document.getElementById(`${ID}-css`)) return;
  const s = document.createElement('style');
  s.id = `${ID}-css`;
  s.textContent = CSS;
  document.head.append(s);
}

// ------------------------------------------------------------------ module
export default function mount(fig, ctx) {
  injectCSS();
  const { gsap } = ctx;
  const P = A.PALETTE;
  const stage = 'dark';
  ctx.setAspect(W / H, CROP.w / CROP.h);

  const svg = ctx.createSVG({ viewBox: `0 0 ${W} ${H}` });

  // Paints made once (reset() redraws the scene but keeps svg.defs).
  const paint = {
    epi: ctx.linearGradient(svg, [[0, '#F3E1C8', 0.5], [0.18, '#EBCDA8', 0.36], [1, '#C79B74', 0.26]], { id: `${ID}-epi`, x1: '0%', y1: '0%', x2: '0%', y2: '100%' }),
    redness: ctx.radialGradient(svg, [[0, '#FF6A5E', 0.62], [0.55, '#FF6A5E', 0.3], [1, '#FF6A5E', 0]], { id: `${ID}-redness`, cx: '46%', cy: '60%', r: '32%' }),
    dermis: ctx.linearGradient(svg, [[0, '#E9C9A1', 0.05], [1, '#E9C9A1', 0.012]], { id: `${ID}-dermis`, x1: '0%', y1: '0%', x2: '0%', y2: '100%' }),
    warm: ctx.radialGradient(svg, [[0, '#FF6B4A', 0.36], [0.4, '#FF6B4A', 0.2], [1, '#FF6B4A', 0]], { id: `${ID}-warm` }),
    edema: ctx.radialGradient(svg, [[0, '#8FCBF2', 0.22], [0.6, '#8FCBF2', 0.09], [1, '#8FCBF2', 0]], { id: `${ID}-edema` }),
    halo: ctx.radialGradient(svg, [[0.35, P.macrophage, 0.3], [1, P.macrophage, 0]], { id: `${ID}-halo` }),
    pus: ctx.radialGradient(svg, [[0, '#FBF0C2', 0.42], [0.5, '#F2E09A', 0.3], [1, '#F2E09A', 0]], { id: `${ID}-pus` }),
    nerveGlow: ctx.radialGradient(svg, [[0, '#FFF6D8', 0.9], [1, '#FFF6D8', 0]], { id: `${ID}-nerveGlow` }),
  };

  // ---------------------------------------------------------------- HTML: four signs + phases
  const signsEl = ctx.h('ul', { class: 'inf-signs', 'aria-label': 'The four signs of inflammation' });
  const signEls = SIGNS.map((s) => {
    const ico = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    ico.setAttribute('viewBox', '0 0 24 24');
    ico.setAttribute('aria-hidden', 'true');
    if (s.icon === 'swell') {
      const g = ctx.iconSVG('spark', { x: 12, y: 12, size: 24 }, ico);
      g.innerHTML = SWELL_ICON;
    } else ctx.iconSVG(s.icon, { x: 12, y: 12, size: 24 }, ico);
    const state = ctx.h('span', { class: 'inf-sign__state', text: ': not yet' });
    const li = ctx.h('li', { class: 'inf-sign', 'data-lit': 'false', style: `--sc:${s.color};--sc-ink:${s.color}` }, ico, ctx.h('span', { text: s.label }), state);
    li.state = state;
    signsEl.append(li);
    return li;
  });
  ctx.stage.before(signsEl);
  const deepInk = () => ctx.theme === 'light';
  const paintSignInk = () => signEls.forEach((li, k) => li.style.setProperty('--sc-ink', deepInk() ? SIGNS[k].deep : SIGNS[k].color));
  paintSignInk();
  ctx.onThemeChange(paintSignInk);


  const clock = ctx.ui.clock({ value: CLOCK[0] });
  ctx.tag('Not to scale', 'top-right');
  ctx.tag('Time compressed', 'top-right');

  // ---------------------------------------------------------------- scene state
  // S: live values the renderers read. P: the PLANNED value at the end of everything built so far.
  const KEYS = { dilate: 0, leak: 0, fluid: 0, warm: 0, swell: 0, flowV: 1, crowd: 0, hooks: 0, trail: 0, wallChemo: 0, nerve: 0, pg: 0, pgFade: 0, pus: 0, cytoOut: 0, histOut: 0, drain: 0, macHalo: 0 };
  let S = { ...KEYS };
  let PL = { ...KEYS };
  let compact = ctx.compact;

  /** Tween scene state keys (from the planned values) on `tl`. */
  function tweenState(tl, to, { duration = 1.6, ease = 'so.inOut', pos } = {}) {
    const from = {};
    for (const k of Object.keys(to)) { from[k] = PL[k]; PL[k] = to[k]; }
    const ez = gsap.parseEase(ease);
    drive(tl, (p) => {
      const e = ez(p);
      for (const k of Object.keys(to)) S[k] = lerp(from[k], to[k], e);
      render();
    }, { duration, pos });
  }

  // References filled by draw()
  let D = null;
  const ambients = [];

  // ---------------------------------------------------------------- draw (stepper reset)
  function draw() {
    ambients.splice(0).forEach((t) => t.kill());
    for (const ch of [...svg.children]) if (ch !== svg.defs) ch.remove();
    S = { ...KEYS };
    PL = { ...KEYS };
    svg.setAttribute('viewBox', compact ? `${CROP.x} ${CROP.y} ${CROP.w} ${CROP.h}` : `0 0 ${W} ${H}`);
    const L = (tag, attrs, parent) => ctx.svg(tag, attrs, parent);
    const g = (parent, attrs = {}) => L('g', attrs, parent);
    D = { labels: {}, last: {} };

    // ---- background: dermis tint, connective tissue, tints
    const bg = g(svg);
    L('rect', { x: -20, y: SKIN.top + 40, width: W + 40, height: H, fill: paint.dermis }, bg);
    bg.append(A.tissueField({ width: W, height: H - 100, y: 100, seed: 11, stage, density: 0.8 }));
    D.warm = L('ellipse', { cx: SITE + 10, cy: VES.y - 10, rx: 560, ry: 300, fill: paint.warm, opacity: 0 }, bg);
    D.edema = L('ellipse', { cx: 520, cy: 270, rx: 330, ry: 165, fill: paint.edema, opacity: 0 }, bg);

    // ---- skin (epidermis strata); paths are a function of S.swell
    const skin = g(svg, { 'data-part': 'skin' });
    D.skin = {
      band: L('path', { fill: paint.epi }, skin),
      red: L('path', { fill: paint.redness, opacity: 0 }, skin),
      cells: L('path', { fill: '#E9C9A1', 'fill-opacity': 0.07, stroke: '#F3DFC4', 'stroke-opacity': 0.26, 'stroke-width': 0.8 }, skin),
      basal: L('path', { fill: '#B98E66', 'fill-opacity': 0.4 }, skin),
      corneum: L('path', { fill: '#F7EBD9', 'fill-opacity': 0.5 }, skin),
      flakes: L('path', { fill: 'none', stroke: '#FFF4E4', 'stroke-opacity': 0.45, 'stroke-width': 0.9, 'stroke-dasharray': '7 5' }, skin),
      junction: L('path', { fill: 'none', stroke: '#E9C9A1', 'stroke-opacity': 0.42, 'stroke-width': 1.3 }, skin),
    };

    // ---- nerve (thin, pale, branching) + its glow
    const nerveG = g(svg, { 'data-part': 'nerve' });
    const nTrunk = A.smoothPath(NERVE.trunk, { closed: false });
    const nBr = NERVE.branches.map((b) => A.smoothPath(b, { closed: false }));
    const nerveD = nTrunk + nBr.join('');
    D.nerveGlow = L('path', { d: nerveD, fill: 'none', stroke: '#FFE9A8', 'stroke-opacity': 0, 'stroke-width': 7, 'stroke-linecap': 'round' }, nerveG);
    D.nerve = L('path', { d: nerveD, fill: 'none', stroke: '#D9D4F2', 'stroke-opacity': 0.5, 'stroke-width': 1.6, 'stroke-linecap': 'round' }, nerveG);
    D.nerveEnds = NERVE.branches.map((b) => {
      const [x, y] = b[b.length - 1];
      const e = g(nerveG, { transform: `translate(${x} ${y})` });
      const glow = L('circle', { r: 9, fill: paint.nerveGlow, opacity: 0 }, e);
      L('circle', { r: 2.6, fill: '#E6E1F8', 'fill-opacity': 0.75 }, e);
      return glow;
    });
    // signal paths (ending → branch point → out of the stage) for the pain pulses
    D.signalPaths = NERVE.branches.map((b) => L('path', { d: A.smoothPath([...b.slice().reverse(), ...NERVE.trunk.slice().reverse().slice(1)], { closed: false }), fill: 'none', stroke: 'none' }, nerveG));

    // ---- chemokine trail: small coral dots, densest near the bacteria, thinning toward the vessel
    const trailG = g(svg, { 'data-part': 'chemokines' });
    const R = A.rng(21, 'trail');
    D.trail = [];
    for (let i = 0; i < 64; i++) {
      const t = Math.pow(R(), 1.5);
      const gx = R.pick(GAP_WANT);
      const sx = lerp(PUS.x + R.range(-30, 30), gx + R.range(-24, 24), t);
      const sy = lerp(PUS.y + R.range(-26, 26), wallOuter(1) - 6, t);
      const node = A.cytokine({ color: P.macrophage, size: lerp(3.2, 2, t), stage });
      node.setAttribute('transform', `translate(${r1(sx)} ${r1(sy)})`);
      node.setAttribute('opacity', '0');
      trailG.append(node);
      D.trail.push({ node, t, o: lerp(0.95, 0.4, t) });
    }

    // ---- pus haze + debris (drawn over the dying neutrophils: their remains read as a pale-yellow mass)
    const pusG = ctx.svg('g', { opacity: 0 });
    L('path', { d: A.smoothPath(A.polarPoints(A.blobRadius({ r: 64, seed: 3, irregularity: 0.5 }), 28).map(([x, y]) => [x * 1.15 + PUS.x, y * 0.9 + PUS.y + 6])), fill: paint.pus }, pusG);
    const RD = A.rng(5, 'debris');
    let debris = '';
    for (let i = 0; i < 14; i++) debris += A.circleD(PUS.x + RD.range(-52, 52), PUS.y + RD.range(-34, 40), RD.range(0.9, 1.8));
    L('path', { d: debris, fill: '#C9D98A', 'fill-opacity': 0.55 }, pusG);
    D.pus = pusG;

    // ---- the vessel: lumen + flow (under), neutrophils, then the walls (over)
    const vessel = A.bloodVessel({ length: VES.len, width: VES.half0 * 2, wall: VES.wall, seed: 7, stage, rbc: 0, streaks: false });
    const lumenG = g(svg, { transform: `translate(${VES.x} ${VES.y})` });
    D.lumen = vessel.querySelector('[data-part="lumen"]');
    lumenG.append(D.lumen);
    D.flowG = g(lumenG, { 'data-part': 'flow' });
    buildFlow();

    D.neutroLayer = g(svg, { 'data-part': 'neutrophils' });

    const wallsG = g(svg, { transform: `translate(${VES.x} ${VES.y})` });
    D.wallTop = g(wallsG);
    D.wallBot = g(wallsG);
    const wTop = vessel.querySelector('[data-part="wall-top"]');
    const wBot = vessel.querySelector('[data-part="wall-bottom"]');
    D.wallTop.append(wTop);
    D.wallBot.append(wBot);
    const bl = { fill: 'none', stroke: '#E4CFCC', 'stroke-opacity': 0.32, 'stroke-width': 1 };
    D.basementTop = L('path', { ...bl }, D.wallTop);
    D.basementGaps = L('path', { ...bl }, D.wallTop);
    L('path', { d: `M${-VES.len / 2} ${VES.half0 + 1.5}H${VES.len / 2}`, ...bl }, D.wallBot);
    // endothelial cells of the top wall: find their ends, pick the junctions that will open
    // an opaque backing behind each lining cell, so a neutrophil squeezing between two of them
    // shows a clean waist (hourglass) instead of showing through the translucent cells
    const backing = g(D.wallTop);
    D.wallTop.insertBefore(backing, wTop);
    const cells = [...wTop.querySelectorAll('[data-part="endothelial"]')].map((c) => {
      const bb = c.getBBox();
      const back = L('path', { d: c.querySelector('path').getAttribute('d'), fill: '#1A2140', 'fill-opacity': 0.92 }, backing);
      return { node: c, back, x0: bb.x, x1: bb.x + bb.width, dl: 0, dr: 0 };
    }).sort((a, b) => a.x0 - b.x0);
    D.endo = cells;
    D.gaps = GAP_WANT.map((want) => {
      let best = 0;
      let bestD = Infinity;
      for (let i = 0; i < cells.length - 1; i++) {
        const jx = (cells[i].x1 + cells[i + 1].x0) / 2 + VES.x;
        if (Math.abs(jx - want) < bestD) { bestD = Math.abs(jx - want); best = i; }
      }
      cells[best].dr = 6.5;
      cells[best + 1].dl = 6.5;
      return (cells[best].x1 + cells[best + 1].x0) / 2 + VES.x;
    });
    {
      const y = -VES.half0 - 1.5;
      const xs = D.gaps.map((gx) => gx - VES.x).sort((p, q) => p - q);
      let d = `M${-VES.len / 2} ${y}`;
      let dg = '';
      for (const x of xs) { d += `H${r1(x - 12)}M${r1(x + 12)} ${y}`; dg += `M${r1(x - 12)} ${y}H${r1(x + 12)}`; }
      D.basementTop.setAttribute('d', `${d}H${VES.len / 2}`);
      D.basementGaps.setAttribute('d', dg);
    }
    // sticky molecules (selectin-like hooks) on the luminal face of the top wall
    const hookG = g(D.wallTop);
    const ly = -VES.half0 + VES.wall;
    D.hooks = [];
    for (let x = HOOKS[0]; x <= HOOKS[1]; x += 11) {
      if (D.gaps.some((gx) => Math.abs(gx - x) < 12)) continue;
      const lx = x - VES.x + Math.sin(x * 1.7) * 2;
      const h = g(hookG, { transform: `translate(${r1(lx)} ${ly}) scale(1 0)` });
      L('path', { d: 'M0 0.5V5.6Q0 8.6 -2.8 8.6', fill: 'none', stroke: '#F7D4CF', 'stroke-width': 1.5, 'stroke-linecap': 'round' }, h);
      D.hooks.push({ node: h, x: lx, k: (x - HOOKS[0]) / (HOOKS[1] - HOOKS[0]) });
    }
    // chemokines displayed on the wall at each gap (they switch on the strong grip)
    D.wallChemo = [];
    for (const gx of D.gaps) {
      for (const dx of [-15, 14]) {
        const c = A.cytokine({ color: P.macrophage, size: 3.4, stage });
        c.setAttribute('transform', `translate(${r1(gx - VES.x + dx)} ${ly + 4.5})`);
        c.setAttribute('opacity', '0');
        D.wallTop.append(c);
        D.wallChemo.push(c);
      }
    }

    svg.append(pusG);

    // ---- fluid that leaks out through the gaps (pale-blue droplets)
    const fluidG = g(svg, { 'data-part': 'fluid' });
    const RF = A.rng(9, 'fluid');
    D.fluid = [];
    const drop = A.dotGlow('#BFE6FA', 0.55);
    for (let i = 0; i < 64; i++) {
      const gx = D.gaps[i % D.gaps.length];
      const tx = gx + RF.range(-110, 110);
      const ty = RF.range(150, wallOuter(1) - 8);
      const r = RF.range(1.8, 3.1);
      const node = g(fluidG, { opacity: 0 });
      L('circle', { r: r1(r * 2.4), fill: drop }, node);
      L('circle', { r: r1(r), fill: '#D2EEFC' }, node);
      D.fluid.push({ node, gx, tx, ty, d: RF.range(0, 0.5), w: RF.range(-16, 16), o: RF.range(0.45, 0.85) });
    }

    // ---- prostaglandins (pale-yellow dots) drifting to the nerve endings
    const pgG = g(svg, { 'data-part': 'prostaglandins' });
    const RP = A.rng(13, 'pg');
    D.pg = [];
    for (let i = 0; i < 24; i++) {
      const end = NERVE.branches[i % 3][NERVE.branches[i % 3].length - 1];
      const node = A.cytokine({ color: '#F3E08E', size: 4.2, stage });
      node.setAttribute('opacity', '0');
      pgG.append(node);
      D.pg.push({
        node, x0: PUS.x + RP.range(-40, 90), y0: PUS.y + RP.range(-50, 30),
        x1: end[0] + RP.range(-14, 14), y1: end[1] + RP.range(-4, 16), d: RP.range(0, 0.45), w: RP.range(-20, 20),
      });
    }

    // ---- tissue cells
    D.histLayer = g(svg);
    D.cellLayer = g(svg);
    D.mast = rig(A.mastCell({ r: MAST.r, seed: MAST.seed, stage }), { x: MAST.x, y: MAST.y, parent: D.cellLayer });
    D.mac = rig(macArt(0), { x: MAC.x, y: MAC.y, parent: D.cellLayer });
    D.macHalo = L('circle', { r: 78, fill: paint.halo, opacity: 0 }, D.mac.layers.under);
    D.sensorGlow = g(D.mac.layers.inner, { opacity: 0 });
    // sensors on the side facing the bacteria light up (an echo of Figure 2.1)
    const outline = A.cellInfo(D.mac.art).outline;
    for (const deg of [148, 166, 184, 202, 220]) {
      const h = A.rayHit(outline, deg * DEG);
      L('circle', { cx: r1(h.x), cy: r1(h.y), r: 7, fill: A.dotGlow('#F4FFC9', 0.85) }, D.sensorGlow);
      L('circle', { cx: r1(h.x), cy: r1(h.y), r: 1.8, fill: '#FBFFE6' }, D.sensorGlow);
    }
    D.cytoLayer = g(svg);

    // ---- neutrophils (four that will leave the vessel), in the vessel layer under the walls
    D.neut = [0, 1, 2, 3].map((i) => {
      const art = A.neutrophil({ r: NR, seed: 31 + i, stage, lobes: 3 + (i % 2) });
      const R0 = rig(art, { x: -70 - i * 60, y: rollY(), parent: D.neutroLayer });
      const squash = g(R0.layers.idle);
      const spin = g(squash);
      spin.append(art);
      const fx = g(squash);
      // strong-grip glyphs (integrin-like clamps) on the top face; phagosomes inside
      const grip = g(fx, { opacity: 0 });
      for (const dx of [-9, 0, 9]) {
        L('path', { d: `M${dx - 2.6} ${-NR + 0.5}V${-NR - 4.2}H${dx + 2.6}V${-NR + 0.5}`, fill: 'none', stroke: '#FFE2EF', 'stroke-width': 1.6, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, grip);
      }
      const phago = g(fx, { opacity: 0 });
      for (const [px, py] of [[-6, -3], [5, -6], [3, 6], [-5, 7]]) {
        L('circle', { cx: px, cy: py, r: 3.4, fill: '#F9D9E8', 'fill-opacity': 0.18, stroke: '#FCE4EF', 'stroke-opacity': 0.7, 'stroke-width': 0.8 }, phago);
        L('circle', { cx: px + 0.4, cy: py - 0.3, r: 1, fill: P.bacteria, 'fill-opacity': 0.55 }, phago);
      }
      place(R0, { opacity: 1 });
      R0.ext = { squash, spin, grip, phago, sx: 1, sy: 1, rot: 0, seed: 31 + i };
      return R0;
    });

    // ---- bacteria: they arrive with the splinter (four little clusters near its tip)
    D.bactLayer = g(svg);
    const RB = A.rng(17, 'bact');
    D.bact = [];
    SPOTS.forEach(([sx, sy], k) => {
      for (let j = 0; j < 3; j++) {
        const a = (j / 3) * Math.PI * 2 + k + RB.range(-0.4, 0.4);
        const rr = RB.range(7, 13);
        const rod = (k + j) % 3 !== 0;
        const art = A.bacterium({ shape: rod ? 'rod' : 'coccus', r: rod ? 3.6 : 2.3, angle: RB.range(0, 180), seed: 40 + k * 3 + j, stage });
        const b = rig(art, { x: SPL.tip[0] - 4, y: SPL.tip[1] - 2, parent: D.bactLayer, opacity: 0 });
        b.home = [sx + Math.cos(a) * rr, sy + Math.sin(a) * rr];
        b.spot = k;
        D.bact.push(b);
      }
    });

    // ---- splinter (only its tip is in view)
    D.splinterG = g(svg);
    D.splinterG.append(A.splinter({ length: SPL.length, angle: SPL.angle, seed: 2, stage }));
    const ca = Math.cos(SPL.angle * DEG);
    const sa = Math.sin(SPL.angle * DEG);
    D.splinterAt = (k) => `translate(${r1(SPL.tip[0] - (SPL.length / 2 + k) * ca)} ${r1(SPL.tip[1] - (SPL.length / 2 + k) * sa)})`;
    D.splinterG.setAttribute('transform', D.splinterAt(SPL.slide));

    // ---- effects and labels on top
    D.fx = g(svg);
    D.labelLayer = g(svg);
    for (const [key, spec] of Object.entries(LABELS)) D.labels[key] = makeLabel(spec, D.labelLayer);
    // small glyphs that belong to labels: the "widens" arrows and the "warm blood" arrow
    D.widenArrows = g(D.labels.widens, {});
    D.warmArrow = g(D.labels.warmIn, {});
    drawLabelGlyphs();

    // ---- idle motion (ambient: paused off-screen, off under reduced motion)
    ambients.push(ctx.ambient(gsap.to(D.mac.layers.idle, { rotation: 2.2, scale: 1.02, svgOrigin: '0 0', duration: 4.2, ease: 'sine.inOut', yoyo: true, repeat: -1 })));
    ambients.push(ctx.ambient(gsap.to(D.mast.layers.idle, { scale: 1.03, svgOrigin: '0 0', duration: 3.1, ease: 'sine.inOut', yoyo: true, repeat: -1 })));
    render(true);
  }

  function macArt(polarization) {
    return A.macrophage({ r: MAC.r, polarization, seed: MAC.seed, stage, receptors: false });
  }

  function rollY() { return lumenTop(1) + NR - 0.5; }

  // ---------------------------------------------------------------- labels
  function makeLabel(spec, parent) {
    const pos = (compact && spec.compact) || spec.wide;
    const gEl = ctx.svg('g', { opacity: 0 }, parent);
    const at = pos.at || spec.at;
    if (at) {
      const [ax, ay] = at;
      const tx = pos.x;
      const ty = pos.y;
      // leader from the text's nearest edge to the target
      const sx = pos.anchor === 'end' ? tx + 5 : pos.anchor === 'start' ? tx - 5 : tx;
      const sy = pos.anchor === 'middle' ? (ay < ty ? ty - 16 : ty + 5) : ty - 5;
      ctx.svg('path', { d: `M${r1(sx)} ${r1(sy)}L${r1(ax)} ${r1(ay)}`, class: 'leader', style: 'stroke: rgba(225,232,255,.55)' }, gEl);
      ctx.svg('circle', { cx: ax, cy: ay, r: 2.2, fill: '#E9EEFF', 'fill-opacity': 0.85 }, gEl);
    }
    const cls = `t-label t-halo${pos.anchor === 'middle' ? ' t-mid' : pos.anchor === 'end' ? ' t-end' : ''}`;
    ctx.svg('text', { x: pos.x, y: pos.y, class: cls, text: spec.text }, gEl);
    return gEl;
  }

  function drawLabelGlyphs() {
    const L = (tag, attrs, parent) => ctx.svg(tag, attrs, parent);
    const col = 'rgba(232,238,255,.75)';
    // ↕ arrows on the vessel walls where the "widens" label is
    const wx = (compact ? LABELS.widens.compact : LABELS.widens.wide).x;
    for (const s of [-1, 1]) {
      const y0 = VES.y + s * (VES.half1 + 4);
      const y1 = VES.y + s * (VES.half1 + 16);
      L('path', { d: `M${wx} ${y0}L${wx} ${y1}M${wx - 4} ${y1 - s * 5}L${wx} ${y1}L${wx + 4} ${y1 - s * 5}`, fill: 'none', stroke: col, 'stroke-width': 1.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, D.widenArrows);
    }
    const a = compact ? LABELS.warmIn.compact : LABELS.warmIn.wide;
    const ax = a.x + 128;
    L('path', { d: `M${ax} ${a.y - 5}h22M${ax + 16} ${a.y - 10}l6 5-6 5`, fill: 'none', stroke: col, 'stroke-width': 1.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, D.warmArrow);
  }

  const labelOn = (key, i) => i >= 0 && LABELS[key].steps.includes(i);
  function labelsFor(tl, i) {
    for (const key of Object.keys(LABELS)) {
      const was = labelOn(key, i - 1);
      const now = labelOn(key, i);
      if (was === now) continue;
      tl.fromTo(D.labels[key], { attr: { opacity: was ? 1 : 0 } }, { attr: { opacity: now ? 1 : 0 }, duration: now ? 0.7 : 0.45, ease: 'so.inOut' }, now ? LABELS[key].delay : 0);
    }
  }

  // ---------------------------------------------------------------- blood flow (ambient)
  let flowT = 0;
  function buildFlow() {
    const R = A.rng(29, 'flow');
    D.flow = [];
    const n = 36;
    for (let i = 0; i < n; i++) {
      const wrap = ctx.svg('g', { 'data-ambient': '' }, D.flowG);
      const vis = ctx.svg('g', { opacity: 0 }, wrap);
      const view = R.pick(['side', 'side', 'tilted', 'side', 'face']);
      const art = A.redBloodCell({ r: R.range(11, 12.6), view, seed: i, stage, glow: false, angle: view === 'face' ? 0 : R.range(-28, 28) });
      vis.append(art);
      D.flow.push({ wrap, vis, x0: (i / n) * VES.len + R.range(-12, 12), lane: R.range(-0.86, 0.86), k: R.range(0.02, 0.98), v: R.range(0.92, 1.08), tumble: R.range(-14, 14), r: 12 });
    }
    // two passing neutrophils that never get caught (they keep to the middle of the stream)
    for (let i = 0; i < 2; i++) {
      const wrap = ctx.svg('g', { 'data-ambient': '' }, D.flowG);
      const vis = ctx.svg('g', { opacity: 1 }, wrap);
      vis.append(A.neutrophil({ r: NR, seed: 60 + i, stage, glow: true }));
      D.flow.push({ wrap, vis, x0: 260 + i * 590, lane: i ? 0.12 : -0.18, k: -1, v: 0.86, tumble: 30, r: NR, neutro: true });
    }
  }
  function renderFlow() {
    if (!D) return;
    const half = vHalf(S.dilate) - VES.wall;
    const dens = 0.52 + 0.22 * S.dilate + 0.24 * S.crowd;
    for (const c of D.flow) {
      const x = ((c.x0 + flowT * 150 * c.v) % VES.len) - VES.len / 2;
      const y = c.lane * (half - c.r * 0.9);
      const rot = c.neutro ? (flowT * c.tumble) % 360 : Math.sin(flowT * 0.6 + c.x0) * c.tumble;
      c.wrap.setAttribute('transform', `translate(${r1(x)} ${r1(y)}) rotate(${r1(rot)})`);
    }
    if (D.last.dens !== dens) {
      D.last.dens = dens;
      for (const c of D.flow) if (!c.neutro) c.vis.setAttribute('opacity', r1(sm(clamp01((dens - c.k) / 0.08))));
    }
  }
  ctx.loop((dt) => { flowT += dt * (S.flowV ?? 1); renderFlow(); });

  // ---------------------------------------------------------------- render (pure function of S)
  const changed = (key, v) => { if (D.last[key] === v) return false; D.last[key] = v; return true; };

  function render(force = false) {
    if (!D) return;
    if (force) D.last = {};
    // vessel width + leak (gaps open as endothelial cells contract)
    if (changed('dilate', S.dilate)) {
      const dy = vHalf(S.dilate) - VES.half0;
      D.wallTop.setAttribute('transform', `translate(0 ${r1(-dy)})`);
      D.wallBot.setAttribute('transform', `translate(0 ${r1(dy)})`);
      const half = vHalf(S.dilate) - VES.wall;
      D.lumen.setAttribute('y', r1(-half));
      D.lumen.setAttribute('height', r1(half * 2));
    }
    if (changed('leak', S.leak)) {
      D.basementGaps.setAttribute('opacity', r1(1 - S.leak));
      for (const c of D.endo) {
        if (!c.dl && !c.dr) continue;
        const len = c.x1 - c.x0;
        const dl = c.dl * S.leak;
        const dr = c.dr * S.leak;
        const s = (len - dl - dr) / len;
        const tr = `translate(${r1(c.x0 + dl)} 0) scale(${s.toFixed(4)} 1) translate(${r1(-c.x0)} 0)`;
        c.node.setAttribute('transform', tr);
        c.back.setAttribute('transform', tr);
      }
    }
    // skin (bulges with the swelling) + redness
    if (changed('swell', S.swell)) renderSkin(S.swell);
    if (changed('warm', S.warm)) {
      D.warm.setAttribute('opacity', r1(S.warm));
      D.skin.red.setAttribute('opacity', r1(S.warm * 0.95));
    }
    if (changed('edema', S.swell * (1 - S.drain))) D.edema.setAttribute('opacity', r1(S.swell * (1 - S.drain)));
    // sticky molecules sprout along the lining
    if (changed('hooks', S.hooks)) {
      for (const h of D.hooks) {
        const t = sm(seg(S.hooks, h.k * 0.5, h.k * 0.5 + 0.5));
        h.node.setAttribute('transform', `translate(${r1(h.x)} ${-VES.half0 + VES.wall}) scale(1 ${t.toFixed(3)})`);
        h.node.setAttribute('opacity', r1(t));
      }
    }
    if (changed('wallChemo', S.wallChemo)) for (const c of D.wallChemo) c.setAttribute('opacity', r1(S.wallChemo));
    // chemokine trail: revealed from the source outward
    if (changed('trail', S.trail)) {
      for (const d of D.trail) d.node.setAttribute('opacity', r1(d.o * sm(seg(S.trail, d.t * 0.7, d.t * 0.7 + 0.3))));
    }
    // fluid droplets: out of the gaps and up into the tissue; drained at the end
    const fk = `${S.fluid}|${S.drain}`;
    if (changed('fluid', fk)) {
      for (const d of D.fluid) {
        const t = sm(seg(S.fluid, d.d, d.d + 0.5));
        const y0 = wallOuter(S.dilate) + 6;
        const x = lerp(d.gx, d.tx, sm(seg(t, 0.15, 1))) + Math.sin(t * Math.PI) * d.w;
        const y = lerp(y0, d.ty, t) + S.drain * 30;
        d.node.setAttribute('transform', `translate(${r1(x)} ${r1(y)})`);
        d.node.setAttribute('opacity', r1(d.o * Math.min(1, t * 4) * (1 - S.drain)));
      }
    }
    // nerve sensitised
    if (changed('nerve', S.nerve)) {
      D.nerve.setAttribute('stroke-opacity', r1(0.5 + 0.45 * S.nerve));
      D.nerve.setAttribute('stroke', S.nerve > 0.5 ? '#F6F0D6' : '#D9D4F2');
      D.nerveGlow.setAttribute('stroke-opacity', r1(0.16 * S.nerve));
      for (const e of D.nerveEnds) e.setAttribute('opacity', r1(S.nerve));
    }
    const pk = `${S.pg}|${S.pgFade}`;
    if (changed('pg', pk)) {
      for (const d of D.pg) {
        const t = sm(seg(S.pg, d.d, d.d + 0.55));
        const x = lerp(d.x0, d.x1, t) + Math.sin(t * Math.PI) * d.w;
        const y = lerp(d.y0, d.y1, t);
        d.node.setAttribute('transform', `translate(${r1(x)} ${r1(y)})`);
        d.node.setAttribute('opacity', r1(Math.min(1, t * 5) * 0.9 * (1 - S.pgFade)));
      }
    }
    if (changed('pus', S.pus)) D.pus.setAttribute('opacity', r1(S.pus));
    if (changed('cytoOut', S.cytoOut)) {
      D.cytoLayer.setAttribute('transform', `translate(0 ${r1(S.cytoOut * 60)})`);
      D.cytoLayer.setAttribute('opacity', r1(1 - S.cytoOut));
    }
    if (changed('histOut', S.histOut)) {
      D.histLayer.setAttribute('transform', `translate(0 ${r1(S.histOut * 34)})`);
      D.histLayer.setAttribute('opacity', r1(1 - S.histOut));
    }
    if (changed('macHalo', S.macHalo)) D.macHalo.setAttribute('opacity', r1(S.macHalo));
    // the flow loop moves the blood; here only redraw it when the lumen or the crowding changes
    if (changed('flowGeom', `${S.dilate}|${S.crowd}`)) renderFlow();
  }

  function renderSkin(sw) {
    const xs = [];
    for (let x = -24; x <= W + 24; x += 8) xs.push(x);
    const top = xs.map((x) => [x, surfY(x, sw)]);
    const bot = xs.map((x) => [x, juncY(x, sw)]);
    const line = (pts) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${r1(x)} ${r1(y)}`).join('');
    const band = `${line(top)}${line(bot.slice().reverse()).replace(/^M/, 'L')}Z`;
    D.skin.band.setAttribute('d', band);
    D.skin.red.setAttribute('d', band);
    const corn = `${line(top)}${line(top.map(([x, y]) => [x, y + 5.5]).reverse()).replace(/^M/, 'L')}Z`;
    D.skin.corneum.setAttribute('d', corn);
    D.skin.flakes.setAttribute('d', line(top.map(([x, y]) => [x, y + 2.6])));
    D.skin.junction.setAttribute('d', line(bot));
    // keratinocytes: flatter toward the surface, rounder and darker in the basal row
    let cells = '';
    let basal = '';
    const rows = [[0.3, 9.5, 2.6], [0.52, 7.6, 3.8], [0.73, 6.2, 4.6]];
    rows.forEach(([fr, rx, ry], k) => {
      for (let x = -20 + k * 5; x < W + 20; x += rx * 2 + 2.6) {
        const y = lerp(surfY(x, sw) + 5.5, juncY(x, sw), fr);
        cells += A.ellipseD(x, y, rx, ry, 0);
      }
    });
    for (let x = -18; x < W + 20; x += 9.4) basal += A.ellipseD(x, juncY(x, sw) - 3.4, 3.4, 3, 0);
    D.skin.cells.setAttribute('d', cells);
    D.skin.basal.setAttribute('d', basal);
  }

  // ---------------------------------------------------------------- helpers for steps
  function squashTo(tl, N, sx, sy, { duration = 0.8, pos, ease = 'so.inOut' } = {}) {
    const a = { sx: N.ext.sx, sy: N.ext.sy };
    N.ext.sx = sx;
    N.ext.sy = sy;
    const ez = gsap.parseEase(ease);
    drive(tl, (p) => {
      const e = ez(p);
      N.ext.squash.setAttribute('transform', `scale(${lerp(a.sx, sx, e).toFixed(3)} ${lerp(a.sy, sy, e).toFixed(3)})`);
    }, { duration, pos });
  }
  /** Roll along the top wall (rotation follows distance) with a stop-go rhythm: catch, let go, catch. */
  function roll(tl, N, x, { duration, pos, k = 3 } = {}) {
    const x0 = N.plan.x;
    const rot0 = N.ext.rot;
    const rot1 = rot0 - ((x - x0) / NR) * (180 / Math.PI);
    N.ext.rot = rot1;
    const raw = (p) => p - (0.75 * Math.sin(2 * Math.PI * k * p)) / (2 * Math.PI * k);
    const norm = raw(1);
    const stopGo = (p) => clamp01(raw(p) / norm);
    const span = move(tl, N, { x, y: N.plan.y, duration, ease: stopGo, stretch: 0, pos });
    drive(tl, (p) => { N.ext.spin.setAttribute('transform', `rotate(${r1(lerp(rot0, rot1, stopGo(p)))})`); }, { duration, pos: span.start });
    return span;
  }
  function fade(tl, node, from, to, { duration = 0.6, pos } = {}) {
    tl.fromTo(node, { attr: { opacity: from } }, { attr: { opacity: to }, duration, ease: 'so.inOut' }, pos);
  }

  // ---------------------------------------------------------------- the nine steps
  const steps = [
    // 1 — the splinter carries bacteria in; they settle and begin to multiply
    { enter(tl) {
      labelsFor(tl, 0);
      tl.fromTo(D.splinterG, { attr: { transform: D.splinterAt(SPL.slide) } }, { attr: { transform: D.splinterAt(0) }, duration: 1.5, ease: 'so.out' }, 0);
      D.bact.forEach((b, i) => {
        move(tl, b, { x: b.home[0], y: b.home[1], opacity: 1, duration: 1.3, ease: 'so.out', stretch: 0, pos: 1.0 + i * 0.07 });
      });
      // one bacterium in each cluster divides
      const divT = 2.9;
      [0, 4, 8, 10].forEach((bi, k) => {
        const b = D.bact[bi];
        const kids = divide(tl, b, 2, { angle: 30 + k * 40, spread: 5.5, duration: 1.1, pos: divT + k * 0.18 });
        kids.forEach((d) => { d.spot = b.spot; d.home = [d.plan.x, d.plan.y]; });
        b.gone = true;
        D.bact.push(...kids);
      });
      // gentle drift for every bacterium that is still around
      D.bact.filter((b) => !b.gone).forEach((b, i) => {
        const R = A.rng(i + 3, 'drift');
        ambients.push(ctx.ambient(gsap.to(b.layers.idle, { x: R.range(-2.5, 2.5), y: R.range(-2.5, 2.5), duration: R.range(2.2, 3.6), ease: 'sine.inOut', yoyo: true, repeat: -1 })));
      });
      tl.to({}, { duration: 0.2 }, 4.1);
    } },

    // 2 — the alarm: macrophage senses, releases cytokines + lays a chemokine trail; mast cell degranulates
    { enter(tl) {
      labelsFor(tl, 1);
      drive(tl, (p) => D.sensorGlow.setAttribute('opacity', r1(Math.sin(Math.PI * p))), { duration: 1.4, pos: 0 });
      tweenState(tl, { macHalo: 1 }, { duration: 1.2, pos: 0.5 });
      emit(tl, D.mac, { kind: 'cytokine', n: 16, r: 150, duration: 2.6, fade: false, seed: 4, layer: D.cytoLayer, size: 5, pos: 0.7 });
      tweenState(tl, { trail: 1 }, { duration: 2.4, pos: 1.0, ease: 'none' });
      drive(tl, (p) => A.setDegranulation(D.mast.art, p), { duration: 1.8, pos: 0.9 });
      emit(tl, D.mast, { kind: 'cytokine', color: P.mast, n: 12, r: 64, spread: 200, angle: 100, duration: 2.4, fade: false, seed: 7, layer: D.histLayer, size: 3.4, pos: 1.2 });
    } },

    // 3 — vessels widen: redness and heat
    { enter(tl) {
      labelsFor(tl, 2);
      tweenState(tl, { cytoOut: 1, histOut: 1 }, { duration: 1.6, pos: 0, ease: 'so.in' });
      tweenState(tl, { dilate: 1, flowV: 1.25 }, { duration: 2.2, pos: 0.3 });
      tweenState(tl, { warm: 1 }, { duration: 2.0, pos: 0.7 });
    } },

    // 4 — the lining loosens: fluid leaks out (swelling); blood slows and crowds
    { enter(tl) {
      labelsFor(tl, 3);
      tweenState(tl, { leak: 1 }, { duration: 1.4, pos: 0 });
      tweenState(tl, { fluid: 1 }, { duration: 2.4, pos: 0.5, ease: 'none' });
      tweenState(tl, { swell: 1 }, { duration: 2.2, pos: 0.8 });
      tweenState(tl, { flowV: 0.5, crowd: 1 }, { duration: 2.0, pos: 0.6 });
    } },

    // 5 — prostaglandins sensitise the nerve ending: pain
    { enter(tl) {
      labelsFor(tl, 4);
      tweenState(tl, { pg: 1 }, { duration: 2.0, pos: 0, ease: 'none' });
      tweenState(tl, { nerve: 1 }, { duration: 0.9, pos: 1.6 });
      D.signalPaths.forEach((path, k) => pulseAlong(tl, path, null, { duration: 1.9, size: 4.2, stage, layer: D.fx, pos: 2.2 + k * 0.55 }));
    } },

    // 6 — the lining puts out sticky molecules; passing neutrophils catch, let go, catch: rolling
    { enter(tl) {
      labelsFor(tl, 5);
      tweenState(tl, { pgFade: 1, nerve: 0.35 }, { duration: 0.8, pos: 0 });
      tweenState(tl, { hooks: 1 }, { duration: 1.4, pos: 0.2 });
      const ends = [474, 406, 338, 272];
      D.neut.forEach((N, i) => {
        const t0 = 0.4 + i * 1.15;
        const catchX = 262;
        move(tl, N, { x: catchX, y: rollY(), duration: 1.0, ease: 'so.out', stretch: 0.03, pos: t0 });
        roll(tl, N, ends[i], { duration: 5.6 - (t0 + 1.0), pos: t0 + 1.0, k: 2 + (3 - i) * 0.5 });
      });
    } },

    // 7 — chemokines on the wall switch on a strong grip: arrest, flatten, squeeze out between cells
    { enter(tl) {
      labelsFor(tl, 6);
      tweenState(tl, { wallChemo: 1 }, { duration: 0.7, pos: 0 });
      const plan = [
        { n: 2, gap: 0, start: 0.2 },
        { n: 1, gap: 1, start: 0.6 },
        { n: 0, gap: 2, start: 1.0 },
        { n: 3, gap: 0, start: 2.3 },
      ];
      const outY = wallOuter(1) - NR - 3;
      for (const { n, gap, start } of plan) {
        const N = D.neut[n];
        const gx = D.gaps[gap];
        const dist = gx - N.plan.x;
        const rollDur = Math.max(0.9, dist / 62);
        const r = roll(tl, N, gx, { duration: rollDur, pos: start, k: 1.5 });
        let t = r.end;
        // arrest: the grip switches on and the cell flattens against the wall
        fade(tl, N.ext.grip, 0, 1, { duration: 0.45, pos: t });
        squashTo(tl, N, 1.14, 0.84, { duration: 0.6, pos: t });
        move(tl, N, { x: gx, y: lumenTop(1) + NR * 0.84 - 0.5, duration: 0.6, stretch: 0, pos: t });
        t += 0.85;
        // squeeze up through the gap (the wall hides its waist: an hourglass), then round up outside
        fade(tl, N.ext.grip, 1, 0, { duration: 0.4, pos: t });
        squashTo(tl, N, 1.0, 1.28, { duration: 0.7, pos: t });
        if (n === 3) {
          // the last one is caught mid-squeeze when the step ends: the still frame shows the hourglass
          move(tl, N, { x: gx, y: VES.y - vHalf(1) + VES.wall / 2 - 2, duration: 1.0, ease: 'so.inOut', stretch: 0, pos: t + 0.15 });
          continue;
        }
        const spot = SPOTS[SPOT_OF[n]];
        const ex = gx + (spot[0] - gx) * 0.12;
        move(tl, N, { x: ex, y: outY, duration: 1.8, ease: 'so.inOut', stretch: 0, pos: t + 0.15 });
        // and creeps a little way up the trail, clearing the gap for the next one
        const creep = 0.55;
        const cx = lerp(ex, spot[0], creep);
        const cy = lerp(outY, spot[1], creep);
        squashTo(tl, N, 1, 1, { duration: 0.6, pos: t + 1.4 });
        // it now crawls: polarity points at its target (the spin group still carries the roll angle)
        const ang = Math.atan2(spot[1] - outY, spot[0] - ex) / DEG - N.ext.rot;
        swap(tl, N, A.neutrophil({ r: NR, seed: N.ext.seed, stage, lobes: 3 + (n % 2), state: 'crawling', polarity: ang }), { duration: 0.6, pos: t + 1.6 });
        move(tl, N, { x: cx, y: cy, duration: 1.3, stretch: 0.03, pos: t + 2.0 });
      }
    } },

    // 8 — up the chemokine trail to the bacteria; engulf; many neutrophils die → pus
    { enter(tl) {
      labelsFor(tl, 7);
      tweenState(tl, { wallChemo: 0 }, { duration: 0.6, pos: 0 });
      {
        // the last neutrophil finishes squeezing out
        const N = D.neut[3];
        const spot = SPOTS[SPOT_OF[3]];
        const outY = wallOuter(1) - NR - 3;
        const ex = N.plan.x + (spot[0] - N.plan.x) * 0.12;
        move(tl, N, { x: ex, y: outY, duration: 1.1, ease: 'so.inOut', stretch: 0, pos: 0 });
        squashTo(tl, N, 1, 1, { duration: 0.6, pos: 0.5 });
        const ang = Math.atan2(spot[1] - outY, spot[0] - ex) / DEG - N.ext.rot;
        swap(tl, N, A.neutrophil({ r: NR, seed: N.ext.seed, stage, lobes: 4, state: 'crawling', polarity: ang }), { duration: 0.6, pos: 0.75 });
      }
      const order = [2, 1, 0, 3];
      order.forEach((n, j) => {
        const N = D.neut[n];
        const k = SPOT_OF[n];
        const [sx, sy] = SPOTS[k];
        const t0 = n === 3 ? 1.6 : 0.2 + j * 0.45;
        const mid = [lerp(N.plan.x, sx, 0.5) + (j % 2 ? 14 : -14), lerp(N.plan.y, sy, 0.5)];
        const span = move(tl, N, { x: sx, y: sy, via: [mid], duration: 2.0, ease: 'so.inOut', pos: t0 });
        let t = span.end - 0.15;
        // the bacteria in this little cluster are wrapped and pulled inside, one after another
        const prey = D.bact.filter((b) => !b.gone && b.spot === k);
        prey.forEach((b, q) => {
          const a = (q / Math.max(1, prey.length)) * Math.PI * 2 + 0.6;
          const ix = sx + Math.cos(a) * NR * 0.38;
          const iy = sy + Math.sin(a) * NR * 0.38;
          const tq = t + q * 0.32;
          wrapRing(tl, b, ix, iy, tq);
          move(tl, b, { x: ix, y: iy, duration: 0.7, ease: 'so.inOut', stretch: 0, pos: tq + 0.15 });
          move(tl, b, { opacity: 0, duration: 0.7, stretch: 0, pos: tq + 0.9 });
        });
        t += prey.length * 0.32 + 0.6;
        fade(tl, N.ext.phago, 0, 1, { duration: 0.6, pos: t - 0.4 });
        // then it dies (shrinks and fragments; never bursts), its remains joining the pus
        const dieAt = t + 0.5;
        fade(tl, N.ext.phago, 1, 0, { duration: 0.9, pos: dieAt });
        die(tl, N, { duration: 2.6, pos: dieAt });
        move(tl, N, { x: lerp(sx, PUS.x, 0.3), y: lerp(sy, PUS.y, 0.3), duration: 2.6, stretch: 0, pos: dieAt });
      });
      tweenState(tl, { pus: 1 }, { duration: 2.4, pos: 5.2 });
    } },

    // 9 — the macrophage clears the dead neutrophils and turns toward repair; the four signs fade
    { enter(tl) {
      labelsFor(tl, 8);
      const mac = D.mac;
      const to = { x: PUS.x + 50, y: PUS.y + 12 };
      move(tl, mac, { x: to.x, y: to.y, via: [[570, 300]], duration: 2.2, pos: 0.2, stretch: 0.03 });
      // the remains shrink into the macrophage and fade
      D.neut.forEach((N, i) => {
        const A0 = { x: N.plan.x, y: N.plan.y };
        move(tl, N, { x: lerp(A0.x, to.x, 0.55), y: lerp(A0.y, to.y, 0.55), opacity: 0, duration: 1.8, stretch: 0, pos: 1.6 + i * 0.18 });
      });
      tweenState(tl, { pus: 0 }, { duration: 2.0, pos: 1.4 });
      tweenState(tl, { macHalo: 0 }, { duration: 2.0, pos: 2.0 });
      swap(tl, mac, macArt(0.3), { duration: 1.3, pos: 2.6 });
      swap(tl, mac, macArt(0.6), { duration: 1.3, pos: 3.8 });
      // the vessel tightens, gaps close, the swelling drains, the warmth fades
      tweenState(tl, { dilate: 0, leak: 0, hooks: 0, flowV: 1, crowd: 0 }, { duration: 2.6, pos: 1.0 });
      tweenState(tl, { warm: 0, swell: 0, drain: 1, trail: 0, nerve: 0 }, { duration: 2.8, pos: 1.4 });
    } },
  ];

  function wrapRing(tl, b, ix, iy, pos) {
    // the neutrophil's membrane closes around the bacterium (a bubble), which then sinks in and fades
    const ring = ctx.svg('circle', { cx: 0, cy: 0, r: 5.6, fill: '#F9D9E8', 'fill-opacity': 0.12, stroke: '#FCE2EE', 'stroke-width': 1.3, 'stroke-dasharray': '36', 'stroke-dashoffset': '36', opacity: 0 }, b.layers.under);
    drive(tl, (p) => {
      ring.setAttribute('stroke-dashoffset', r1(36 * (1 - sm(seg(p, 0, 0.45)))));
      ring.setAttribute('opacity', r1(Math.min(sm(seg(p, 0, 0.15)), 1 - sm(seg(p, 0.7, 1)))));
    }, { duration: 1.6, pos });
  }

  const stepper = ctx.ui.stepper({
    steps,
    reset: draw,
    phases: PHASES,            // grouped, labeled dots (the stepper's own; FIGURES.md §5)
    onChange(i, { instant }) {
      clock.set(CLOCK[i]);
      SIGNS.forEach((s, k) => {
        const on = s.on.includes(i);
        const li = signEls[k];
        const was = li.getAttribute('data-lit') === 'true';
        li.classList.toggle('is-fresh', on && !was && !instant);
        li.setAttribute('data-lit', String(on));
        li.state.textContent = on ? ': present' : ': not yet';
      });
    },
  });

  ctx.onResize(({ compact: c }) => {
    if (c === compact) return;
    compact = c;
    stepper.rebuild();
    ctx.refreshTextScale();
  });

  return {
    destroy() { ambients.splice(0).forEach((t) => t.kill()); },
  };
}
