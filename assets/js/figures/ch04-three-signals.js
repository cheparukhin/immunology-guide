// ch04-three-signals — "Two-factor authentication, plus a briefing" (FIGURE-AUDIT §2A, §4 rules 5, 8, 10, 12).
//
// A naive killer T cell meets a dendritic cell in a lymph node. Cell scale on the left/bottom;
// the contact itself, magnified, in a window (shared synapse.js contact band) with three
// channels: signal 2 (CD28–B7, left), signal 1 (TCR–peptide–MHC, centre), signal 3 (briefing
// cytokines: green dots + hollow green rings, right). Outcome readout = ctx.ui.infoCard (beside
// the stage on wide figures, under it on phones), with "The brake that follows → Chapter 5."
//
// Guided (ctx.ui.stepper, 3 writer captions): 1 alone → anergy; + 2 → activation and division;
// + 3 → armed killers. Switches and presets are live from the start. Each free change replays a
// fresh encounter (a new naive T cell) on its own timeline; going back to the steps rebuilds.
// No CTLA-4 anywhere (ch05-brakes owns the brake).
import {
  tCell, dendriticCell, lymphNodeField, mhc1, b7, receptor, cytokine, interferon, signalIcon,
  placeOnMembrane, cellInfo, rayHit, PALETTE, mix,
} from '../art/index.js';
import * as CA from './shared/cell-actions.js';
import { synapseScene } from './shared/synapse.js';

const ID = 'ch04-three-signals';
const DEG = Math.PI / 180;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
const seg = (p, a, b) => clamp((p - a) / (b - a || 1), 0, 1);
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const backOut = (t) => { const c = 1.6; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
const f = (v) => String(Math.round(v * 100) / 100);

const STEP_STATES = [
  { s1: true, s2: false, s3: false },
  { s1: true, s2: true, s3: false },
  { s1: true, s2: true, s3: true },
];
const PRESETS = {
  alarmed: { s1: true, s2: true, s3: true, pep: 'foreign' },
  self: { s1: true, s2: false, s3: false, pep: 'self' },
  tumor: { s1: true, s2: false, s3: false, pep: 'foreign' },
};
const outcomeOf = (S) => (!S.s1 ? 'ignore' : !S.s2 ? 'anergy' : !S.s3 ? 'active' : 'briefed');

const LAYOUTS = {
  wide: {
    vb: [960, 540],
    field: { x: -40, y: -26, w: 1040, h: 592 },
    ln: { x: 22, y: 30, anchor: 'start' },
    dc: { x: 190, y: 452, r: 150, seed: 6 },
    dcLabel: { x: 190, y: 526, anchor: 'middle' },
    tR: 28, want: -62,
    enter1: [-50, 190], enter2: [300, -50], park: [72, 222], exit: [700, 478],
    C: [596, 452],
    div: [{ angle: 0, spread: 80 }, { angle: 90, spread: 40 }, { angle: 0, spread: 38 }],
    cluster: { x: 770, y: 446, anchor: 'start' },
    lens: { x: 650, y: 194, w: 556, h: 264, size: 40, depth: 46, ch: [-178, 0, 178], dx: 46, n: 3, short: false },
    lensTitle: { x: 372, y: 52 },
  },
  compact: {
    vb: [400, 640],
    field: { x: -60, y: -30, w: 520, h: 720 },
    ln: { x: 388, y: 628, anchor: 'end' },
    dc: { x: 100, y: 578, r: 138, seed: 6 },
    dcLabel: { x: 14, y: 628, anchor: 'start' },
    tR: 25, want: -55,
    enter1: [-50, 380], enter2: [-50, 330], park: [46, 372], exit: [440, 470],
    C: [296, 410],
    div: [{ angle: 90, spread: 64 }, { angle: 0, spread: 34 }, { angle: 90, spread: 32 }],
    cluster: { x: 296, y: 572, anchor: 'middle' },
    lens: { x: 200, y: 170, w: 380, h: 226, size: 30, depth: 34, ch: [-128, 0, 128], dx: 34, n: 2, short: true },
    lensTitle: { x: 12, y: 46 },
  },
};

const TEXT = {
  // channels left → right in reading order: 1 · 2 · 3 (polish A6)
  titles: [
    { cap: 'Signal 1', long: 'Recognition', short: 'Recognize' },
    { cap: 'Signal 2', long: 'Confirmation', short: 'Confirm' },
    { cap: 'Signal 3', long: 'Instruction', short: 'Instruct' },
  ],
  // bottom state words per channel: [on, off]
  ch2: { long: ['CD28 binds B7', 'too little B7'], short: ['B7 plenty', 'too little B7'] },
  ch1: { long: ['receptor fits peptide', 'no match'], short: ['fits', 'no match'] },
  ch3: { long: ['instructive cytokines', 'no cytokines'], short: ['cytokines', 'none'] },
};

const CARD = {
  ignore: { title: 'Walks on by', badge: null, line: 'Without recognition the other signals count for nothing. The T cell detaches unchanged and keeps searching.' },
  anergy: { title: 'Unresponsive (anergic)', badge: 'no', line: 'Alive, but it will no longer respond — even to proper presentation later. In a living body, some such cells divide briefly and die instead.' },
  active: { title: 'Activated', badge: 'yes', line: 'Both factors check out. The T cell swells and starts dividing into copies of itself.' },
  briefed: { title: 'Activated and instructed', badge: 'yes', line: 'Cytokines tell the copies what to become: they keep dividing and turn into effector killer T cells.' },
};

const STYLE = `
[data-figure="${ID}"] .ts-i {
  position: absolute; z-index: 4; width: 1.75rem; height: 1.75rem; margin: -0.875rem 0 0 -0.875rem; padding: 0;
  border-radius: 50%; border: 1px solid var(--stage-dark-line, rgba(160,175,220,.4)); cursor: pointer;
  background: color-mix(in srgb, var(--stage-dark-a, #0B1024) 80%, transparent); color: var(--stage-dark-ink, #EEF2FF);
  font: 700 0.8125rem/1 var(--font-ui); font-style: italic;
  opacity: 0; visibility: hidden; transition: opacity .4s ease, visibility .4s;
}
[data-figure="${ID}"] .ts-i::before { content: ""; position: absolute; inset: -0.6rem; }
[data-figure="${ID}"] .ts-i.is-on { opacity: 1; visibility: visible; transition-delay: var(--ts-delay, 0s); }
[data-figure="${ID}"] .ts-i:hover { border-color: var(--stage-dark-ink, #EEF2FF); }
[data-figure="${ID}"] .ts-i:focus-visible { outline: 2px solid var(--stage-focus, #9DB5FF); outline-offset: 2px; }
[data-figure="${ID}"] .ts-free { display: flex; flex-wrap: wrap; align-items: flex-start; gap: var(--s-3) var(--s-5); flex: 1 1 100%; padding-top: var(--s-3); border-top: 1px solid var(--rule); }
[data-figure="${ID}"] .ts-switches { display: flex; flex-direction: column; gap: 0.15rem; min-width: 15rem; }
[data-figure="${ID}"] .ts-switches__label, [data-figure="${ID}"] .ts-free .chips__label { font-family: var(--font-ui); font-size: var(--text-xs); font-weight: 560; color: var(--ink-2); margin-bottom: 0.2rem; }
[data-figure="${ID}"] .ts-switches .switch { justify-content: flex-start; }
[data-figure="${ID}"] .ts-switches .switch b { font-weight: 650; color: var(--ink); }
[data-figure="${ID}"] .ts-switches .switch .ts-state { margin-left: 0.35rem; font-weight: 600; font-size: var(--text-2xs); letter-spacing: 0.06em; text-transform: uppercase; color: var(--ink-3); }
[data-figure="${ID}"] .ts-switches .switch[aria-checked="true"] .ts-state { color: var(--accent); }
[data-figure="${ID}"] .switch:disabled { opacity: 0.45; cursor: not-allowed; }
[data-figure="${ID}"] .switch:disabled:hover .switch__track { box-shadow: none; }
[data-figure="${ID}"] .ts-presets { flex: 1 1 24rem; min-width: 0; }
[data-figure="${ID}"] .ts-presets .chip--card { flex: 1 1 9.5rem; }
[data-figure="${ID}"] .fig__controls > .ts-card { flex: 1 1 100%; margin: 0; }
[data-figure="${ID}"] .ts-scen { margin: 0; font-size: inherit; line-height: inherit; color: var(--ink); }
[data-figure="${ID}"] .ts-scen b { font-family: var(--font-ui); font-size: var(--text-xs); font-weight: 650; letter-spacing: var(--tracking-caps); text-transform: uppercase; color: var(--accent); margin-right: 0.4em; }
[data-figure="${ID}"] .ts-scen[hidden] { display: none; }
[data-figure="${ID}"] .fig__caption.ts-scen-on > .fig__steps { display: none; }
[data-figure="${ID}"] .ts-legend { flex: 1 1 100%; margin: 0; font-family: var(--font-ui); font-size: var(--text-xs); color: var(--ink-2); display: flex; flex-wrap: wrap; align-items: center; gap: 0.35rem 1rem; }
[data-figure="${ID}"] .ts-legend .ts-disc { display: inline-grid; place-items: center; width: 1rem; height: 1rem; border-radius: 50%; background: var(--c-activate); color: #0B1024; font-weight: 800; font-size: 0.75rem; line-height: 1; margin-right: 0.3rem; vertical-align: -0.15rem; }
[data-figure="${ID}"] .info-card .ts-next { font-family: var(--font-ui); font-size: var(--text-xs); font-weight: 600; }
[data-figure="${ID}"] .info-card .ts-note { padding-left: 0.7rem; border-left: 2px solid var(--c-neo-peptide); color: var(--ink-2); }
[data-figure="${ID}"] .ts-asides { flex: 1 1 100%; list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.4rem var(--s-5); font-family: var(--font-ui); font-size: var(--text-xs); line-height: 1.45; color: var(--ink-2); }
[data-figure="${ID}"] .ts-asides li { padding-left: 0.7rem; border-left: 2px solid var(--rule-strong); }
[data-figure="${ID}"] .ts-asides b { color: var(--ink); font-weight: 650; }
@container fig (max-width: 599.98px) {
  [data-figure="${ID}"] .ts-switches { flex: 1 1 100%; min-width: 0; }
  [data-figure="${ID}"] .ts-switches .switch { width: 100%; flex-direction: row-reverse; justify-content: space-between; min-height: 2.75rem; border-bottom: 1px solid var(--rule); }
  [data-figure="${ID}"] .ts-presets { flex: 1 1 100%; }
  [data-figure="${ID}"] .ts-presets .chips__tray { flex-direction: column; }
  [data-figure="${ID}"] .ts-presets .chip--card { flex: 0 0 auto; width: 100%; }
  [data-figure="${ID}"] .ts-asides { grid-template-columns: minmax(0, 1fr); }
}
`;

export default function mount(fig, ctx) {
  const { gsap } = ctx;
  if (!document.getElementById(`${ID}-style`)) document.head.append(ctx.h('style', { id: `${ID}-style`, html: STYLE }));
  ctx.setAspect(16 / 9, 400 / 640);
  const svg = ctx.createSVG({ viewBox: '0 0 960 540' });
  const S = (tag, attrs, parent) => ctx.svg(tag, attrs, parent);
  ctx.tag('Illustrative', 'top-right');

  // one-time defs (deterministic ids: the stepper check compares across page loads)
  const lensBg = ctx.radialGradient(svg, [[0, '#18224A'], [1, '#0A0F22']], { id: `${ID}-lensbg`, cy: '45%', r: '75%' });
  const clipEl = S('clipPath', { id: `${ID}-lensclip` }, svg.defs);
  const clipRect = S('rect', {}, clipEl);

  // "i" chip for the briefing cytokines (HTML, over the stage)
  const iChip = ctx.h('button', { type: 'button', class: 'ts-i', text: 'i', 'aria-label': 'About the instructive cytokines' });
  ctx.stage.append(iChip);
  const tipText = 'Mainly IL-12 and type I interferons.';
  const showTip = () => ctx.tooltip.show(tipText, iChip);
  ctx.on(iChip, 'click', showTip);
  ctx.on(iChip, 'focus', showTip);
  ctx.on(iChip, 'mouseenter', showTip);
  ctx.on(iChip, 'mouseleave', () => ctx.tooltip.hide());
  ctx.on(iChip, 'blur', () => ctx.tooltip.hide());
  ctx.on(iChip, 'keydown', (e) => { if (e.key === 'Escape') ctx.tooltip.hide(); });

  let layoutName = ctx.compact ? 'compact' : 'wide';
  let L = LAYOUTS[layoutName];
  let A = {};
  let free = null;              // { S, tl } while exploring freely
  let pep = 'foreign';          // peptide on display (presets switch it)
  let preset = null;
  const ambients = [];
  const tracked = [];

  // ------------------------------------------------------------------ small helpers
  const setO = (el, v) => el && el.setAttribute('opacity', f(v));
  /** Seek-safe fade of attribute opacity between explicit values. */
  function fade(tl, els, from, to, pos, duration = 0.5) {
    const list = [].concat(els).filter(Boolean);
    if (!list.length) return;
    CA.drive(tl, (p) => { const v = lerp(from, to, easeInOut(p)); list.forEach((e) => setO(e, v)); }, { duration, pos });
  }
  /** Text whose content is a pure function of timeline time. */
  function textTo(tl, el, fmt, from, to, pos) {
    CA.drive(tl, (p) => { el.textContent = fmt(Math.round(lerp(from, to, p))); }, { duration: 0.35, pos });
  }
  function label(parent, { x, y, text, anchor = 'middle', cls = 't-label', opacity = 0 }) {
    return S('text', { class: `${cls} t-halo`, x: f(x), y: f(y), 'text-anchor': anchor, text, opacity }, parent);
  }

  // ------------------------------------------------------------------ art
  function tArt(seed, state) {
    const art = tCell({ variant: 'cd8', r: L.tR, seed, state, polarity: state === 'activated' ? -20 : 0, stage: 'dark' });
    const gr = art.querySelector('[data-part="granules"]');
    if (gr) gr.setAttribute('opacity', '0');      // naive and merely activated cells: no armed granules yet
    return art;
  }
  function dcArt(mature) {
    const art = dendriticCell({ r: L.dc.r, seed: L.dc.seed, state: mature ? 'mature' : 'immature', stage: 'dark', receptors: false });
    const p = pep === 'self' ? 'self' : 'foreign';
    const n = mature ? 14 : 8;
    placeOnMembrane(art, (o, i) => (mature ? (i % 2 ? b7(o) : mhc1({ ...o, peptide: p })) : i === 3 ? b7({ ...o, size: o.size * 0.7 }) : mhc1({ ...o, peptide: p })), {
      count: n, size: layoutName === 'wide' ? 13 : 12, seed: 4,
    });
    return art;
  }
  /** Docking angle (from the DC centre) that lands on the cell body, not on a dendrite. */
  function dockOf(art) {
    const pts = cellInfo(art).outline;
    let best = null;
    for (let a = L.want - 46; a <= L.want + 46; a += 2) {
      const h = rayHit(pts, a * DEG);
      const r = Math.hypot(h.x, h.y);
      const score = r + Math.abs(a - L.want) * 0.25;
      if (!best || score < best.score) best = { a, r, score };
    }
    return best;
  }

  // ------------------------------------------------------------------ scene
  /** Draw the scene. mode: 'guided' (before step 1) or a free state S (before its encounter). */
  function draw(mode) {
    ambients.splice(0).forEach((t) => t.kill());
    tracked.splice(0).forEach((h) => h.stop());
    if (A.syn) A.syn.destroy();
    for (const n of [...svg.children]) if (n !== svg.defs) n.remove();
    L = LAYOUTS[layoutName];
    const [W, H] = L.vb;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    ctx.refreshTextScale();
    const guided = mode === 'guided';
    const S0 = guided ? { s1: true, s2: false, s3: false } : mode;
    A = { guided, plan: { open: guided ? 0 : 1, b7: S0.s2 ? 1 : 0, flow: 0, txt: { 1: -1, 2: S0.s2 ? 0 : 1, 3: 1 }, src: null } };

    const scene = S('g', { 'data-part': 'scene' }, svg);
    scene.append(lymphNodeField({ x: L.field.x, y: L.field.y, width: L.field.w, height: L.field.h, seed: 4, stage: 'dark', follicles: 3, density: 0.8 }));
    S('text', { class: 't-caps', x: L.ln.x, y: L.ln.y, 'text-anchor': L.ln.anchor, text: 'Lymph node', style: 'fill: var(--fg-3)' }, scene);

    // the dendritic cell (quiet, or alarmed in free mode with signal 2)
    const quiet = dcArt(false);
    const alarmed = dcArt(true);
    A.dockQ = dockOf(quiet);
    A.dockA = dockOf(alarmed);
    A.dc = CA.rig(guided || !S0.s2 ? quiet : alarmed, { x: L.dc.x, y: L.dc.y, parent: scene, seed: L.dc.seed });
    A.dcNext = guided ? alarmed : null;
    A.dock = guided || !S0.s2 ? A.dockQ : A.dockA;
    A.plan.src = contactPt(A.dock);

    // T cells
    const nameTag = (R, text) => label(R.layers.over, { x: 0, y: -R.r - 15, text, cls: 't-small' });
    if (guided) {
      A.T1 = CA.rig(tArt(11, 'resting'), { x: L.enter1[0], y: L.enter1[1], parent: scene, seed: 11 });
      A.T2 = CA.rig(tArt(12, 'resting'), { x: L.enter2[0], y: L.enter2[1], parent: scene, seed: 12 });
      A.T1.name = nameTag(A.T1, 'Naive T cell');
      A.T2.name = nameTag(A.T2, 'Naive T cell');
      A.T2act = tArt(12, 'activated');
    } else {
      A.T = CA.rig(tArt(12, 'resting'), { x: L.enter1[0], y: L.enter1[1], parent: scene, seed: 12 });
      A.T.name = nameTag(A.T, 'Naive T cell');
      A.Tact = tArt(12, 'activated');
    }
    A.fx = CA.fxLayer(scene);

    // labels
    const labels = S('g', { 'data-part': 'labels' }, svg);
    A.lab = {
      quiet: label(labels, { ...L.dcLabel, text: 'Quiet dendritic cell', opacity: guided || !S0.s2 ? 1 : 0 }),
      alarmed: label(labels, { ...L.dcLabel, text: 'Alarmed dendritic cell', opacity: !guided && S0.s2 ? 1 : 0 }),
      act: label(labels, { x: L.cluster.x, y: L.cluster.y, anchor: L.cluster.anchor, text: 'Activated T cells' }),
      armed: label(labels, { x: L.cluster.x, y: L.cluster.y, anchor: L.cluster.anchor, text: 'Effector killers' }),
      count: label(labels, { x: L.cluster.x, y: L.cluster.y + 22, anchor: L.cluster.anchor, text: 'Divisions: 0', cls: 't-small t-num' }),
    };

    buildLens(S0);
    if (!ctx.reducedMotion) {
      // idle life on wrappers the timelines never touch
      ambients.push(ctx.ambient(gsap.to(A.dc.layers.idle, { scale: 1.012, rotation: 0.6, svgOrigin: '0 0', duration: 3.4, ease: 'sine.inOut', yoyo: true, repeat: -1 })));
    }
    placeI();
  }

  // ------------------------------------------------------------------ the magnified contact
  function buildLens(S0) {
    const LN = L.lens, s = LN.size;
    const short = LN.short;
    clipRect.setAttribute('x', f(-LN.w / 2));
    clipRect.setAttribute('y', f(-LN.h / 2));
    clipRect.setAttribute('width', f(LN.w));
    clipRect.setAttribute('height', f(LN.h));
    clipRect.setAttribute('rx', 22);

    const leader = S('g', { opacity: 0 }, svg);
    A.leaderLine = S('line', { x1: 0, y1: 0, x2: 0, y2: 0, style: 'stroke: var(--fg-2); stroke-opacity: 0.55; stroke-width: 1.1; vector-effect: non-scaling-stroke' }, leader);
    A.sourceRing = S('circle', { r: 10, style: 'fill: none; stroke: var(--fg-2); stroke-opacity: 0.8; stroke-width: 1.2' }, leader);
    A.leader = leader;
    const title = S('g', { opacity: 0 }, svg);
    S('text', { class: 't-caps', x: L.lensTitle.x, y: L.lensTitle.y, text: 'The contact, magnified', style: 'fill: var(--fg-3)' }, title);
    A.lensTitle = title;

    const root = S('g', { 'data-part': 'lens', opacity: 0 }, svg);
    A.lens = root;
    S('rect', { x: f(-LN.w / 2 - 6), y: f(-LN.h / 2 - 6), width: f(LN.w + 12), height: f(LN.h + 12), rx: 27, style: 'fill: #050816; opacity: 0.55' }, root);
    S('rect', { x: f(-LN.w / 2), y: f(-LN.h / 2), width: f(LN.w), height: f(LN.h), rx: 22, fill: lensBg }, root);
    const content = S('g', { 'clip-path': `url(#${ID}-lensclip)` }, root);
    const xs = (c) => (LN.n === 3 ? [c - LN.dx, c, c + LN.dx] : [c - LN.dx / 2, c + LN.dx / 2]);
    A.syn = synapseScene(content, {
      ctx, x: 0, y: 0, width: LN.w + 80, size: s, depth: LN.depth, seed: 3, stage: 'dark',
      top: { color: 'cd8' }, bottom: { color: 'dc' },
      pairs: [
        { kind: 'tcr-mhc', x: xs(LN.ch[0]), peptide: pep === 'self' ? 'self' : 'foreign' },
        { kind: 'cd28-b7', x: xs(LN.ch[1]) },
      ],
    });
    // A self-reactive T cell does read its self-peptide (the "harmless self-protein" preset).
    if (pep === 'self') A.syn.pairs['tcr-mhc'].forEach((P) => { P.matched = true; });
    const { topY, bottomY, thickness } = A.syn.info;
    A.b7 = A.syn.pairs['cd28-b7'].map((P) => P.bottom);
    renderB7(A.plan.b7);

    // signal 3: cytokine receptors on the T cell, cytokines leaving the dendritic cell
    const cyto = S('g', { 'data-part': 'cytokine-channel' }, content);
    const rs = s * 0.78;
    const headY = topY + 0.95 * rs;
    xs(LN.ch[2]).forEach((x) => {
      const g = receptor({ size: rs, profile: 'round', color: mix(PALETTE.cd8, '#FFFFFF', 0.4), stage: 'dark' });
      g.setAttribute('transform', `translate(${f(x)} ${f(topY)}) rotate(180)`);
      cyto.append(g);
    });
    const flow = S('g', { opacity: 0 }, cyto);
    A.flow = flow;
    const dot = (k, x, y) => {
      const make = k % 2 ? interferon : cytokine;
      const g = make({ size: k % 2 ? s * 0.3 : s * 0.22, color: PALETTE.dendritic, stage: 'dark' });
      const w = S('g', { transform: `translate(${f(x)} ${f(y)})` }, flow);
      const inner = S('g', {}, w);
      inner.append(g);
      return inner;
    };
    xs(LN.ch[2]).forEach((x, i) => dot(i, x, headY + s * 0.12));        // docked in the receptor cups
    const y0 = bottomY + thickness + s * 0.42, rise = y0 - (headY + s * 0.3);
    const floaters = [];
    const nF = LN.n === 3 ? 6 : 4;
    for (let k = 0; k < nF; k++) {
      const x = LN.ch[2] + lerp(-1, 1, (k + 0.5) / nF) * LN.dx * (LN.n === 3 ? 1.25 : 1.05);
      floaters.push(dot(k + 1, x, y0));
    }
    if (!ctx.reducedMotion) {
      floaters.forEach((g, k) => {
        const d = 2.6 + (k % 3) * 0.35;
        ambients.push(ctx.ambient(gsap.fromTo(g, { y: 0 }, { y: -rise, duration: d, ease: 'none', repeat: -1, delay: (k * 0.53) % d })));
        ambients.push(ctx.ambient(gsap.fromTo(g, { opacity: 0 }, { opacity: 1, duration: d / 2, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: (k * 0.53) % d })));
      });
    } else {
      floaters.forEach((g, k) => { g.setAttribute('transform', `translate(0 ${f(-rise * ((k * 0.37) % 1))})`); g.setAttribute('data-ambient', ''); });
    }
    const iz = clamp(s * 0.34, 11, 18);
    A.s3disc = S('g', { transform: `translate(${f(LN.ch[2])} ${f(topY - thickness - iz * 0.95)})`, opacity: 0 }, cyto);
    A.s3disc.append(signalIcon({ type: 'activating', size: iz, stage: 'dark' }));

    S('rect', { x: f(-LN.w / 2), y: f(-LN.h / 2), width: f(LN.w), height: f(LN.h), rx: 22, style: 'fill: none; stroke: #AFC0FF; stroke-opacity: 0.5; stroke-width: 1.6' }, root);

    // channel titles (top) and state words (bottom)
    const texts = S('g', {}, root);
    const tY = -LN.h / 2 + (short ? 22 : 26), wY = tY + (short ? 19 : 22);
    const bY = LN.h / 2 - (short ? 14 : 18);
    A.txt = {};
    TEXT.titles.forEach((t, i) => {
      const x = LN.ch[i];
      S('text', { class: 't-caps t-mid', x: f(x), y: f(tY), text: t.cap, style: 'fill: var(--fg-3)' }, texts);
      S('text', { class: 't-label t-mid t-halo', x: f(x), y: f(wY), text: short ? t.short : t.long }, texts);
    });
    const words = (key, x) => {
      const w = short ? TEXT[key].short : TEXT[key].long;
      return [label(texts, { x, y: bY, text: w[0], cls: 't-small' }), label(texts, { x, y: bY, text: w[1], cls: 't-small' })];
    };
    A.txt[1] = words('ch1', LN.ch[0]);
    A.txt[2] = words('ch2', LN.ch[1]);
    A.txt[3] = words('ch3', LN.ch[2]);
    [1, 2, 3].forEach((c) => A.txt[c].forEach((el, k) => setO(el, A.plan.txt[c] === k ? 1 : 0)));
    A.bY = bY;

    if (!short) {
      // which side is which (outside the window, left)
      const sx = LN.x - LN.w / 2 - 12;
      label(title, { x: sx, y: LN.y + topY - 22, text: 'T cell', anchor: 'end', cls: 't-small', opacity: 1 });
      label(title, { x: sx, y: LN.y + bottomY + 30, text: 'Dendritic cell', anchor: 'end', cls: 't-small', opacity: 1 });
    }
    renderLens(A.plan.open, A.plan.src);
  }

  /** Contact point between a docked T cell and the DC body (scene coordinates). */
  function contactPt(dock) {
    const a = dock.a * DEG;
    return [L.dc.x + Math.cos(a) * dock.r, L.dc.y + Math.sin(a) * dock.r];
  }
  function renderLens(v, src) {
    const LN = L.lens;
    const e = easeOut(v);
    const x = lerp(src[0], LN.x, e), y = lerp(src[1], LN.y, e);
    A.lens.setAttribute('transform', `translate(${f(x)} ${f(y)}) scale(${f(lerp(0.06, 1, e))})`);
    setO(A.lens, clamp(v * 2.2, 0, 1));
    setO(A.lensTitle, seg(v, 0.6, 1));
    // leader from the window's edge to the contact
    const hw = LN.w / 2, hh = LN.h / 2;
    const dx = src[0] - LN.x, dy = src[1] - LN.y;
    const k = Math.min(hw / Math.abs(dx || 1e-6), hh / Math.abs(dy || 1e-6));
    const ex = LN.x + dx * k, ey = LN.y + dy * k;
    const d = Math.hypot(src[0] - ex, src[1] - ey) || 1;
    A.leaderLine.setAttribute('x1', f(ex)); A.leaderLine.setAttribute('y1', f(ey));
    A.leaderLine.setAttribute('x2', f(src[0] - ((src[0] - ex) / d) * 13)); A.leaderLine.setAttribute('y2', f(src[1] - ((src[1] - ey) / d) * 13));
    A.sourceRing.setAttribute('cx', f(src[0])); A.sourceRing.setAttribute('cy', f(src[1]));
    setO(A.leader, seg(v, 0.55, 1));
  }
  function lensTo(tl, v1, pos, duration = 0.95) {
    const v0 = A.plan.open, src = A.plan.src;
    A.plan.open = v1;
    CA.drive(tl, (p) => renderLens(lerp(v0, v1, easeInOut(p)), src), { duration, pos });
  }
  /** Move the leader's source ring to a new contact point (the alarmed DC's body differs). */
  function srcTo(tl, dock, pos, duration = 1.2) {
    const a = A.plan.src, b = contactPt(dock), v = A.plan.open;
    A.plan.src = b;
    CA.drive(tl, (p) => { const q = easeInOut(p); renderLens(v, [lerp(a[0], b[0], q), lerp(a[1], b[1], q)]); }, { duration, pos });
  }
  /** B7 on the DC: v = 1 plenty (alarmed), 0 = one faint, unlit nub (a quiet presenter). */
  function renderB7(v) {
    A.b7.forEach((g, i) => {
      // a quiet presenter keeps one or two stubby, unlit nubs: far too little B7 to count
      const keep = A.b7.length > 2 ? i !== Math.floor(A.b7.length / 2) : i === 0;
      const sx = keep ? lerp(0.8, 1, v) : lerp(0.01, 1, v);
      const sy = keep ? lerp(0.36, 1, v) : lerp(0.01, 1, v);
      g.setAttribute('transform', `scale(${f(sx)} ${f(sy)})`);
      setO(g, keep ? lerp(0.6, 1, v) : clamp(v * 1.4, 0, 1));
    });
  }
  function b7To(tl, v1, pos, duration = 1.2) {
    const v0 = A.plan.b7;
    A.plan.b7 = v1;
    CA.drive(tl, (p) => renderB7(lerp(v0, v1, easeInOut(p))), { duration, pos });
  }
  function flowTo(tl, v1, pos, duration = 0.9) {
    const v0 = A.plan.flow;
    A.plan.flow = v1;
    CA.drive(tl, (p) => { const v = lerp(v0, v1, easeInOut(p)); setO(A.flow, v); setO(A.s3disc, seg(v, 0.4, 1)); }, { duration, pos });
  }
  /** Crossfade a channel's state word: k = 0 (on word), 1 (off word), -1 (none). */
  function wordTo(tl, ch, k, pos) {
    const k0 = A.plan.txt[ch];
    if (k0 === k) return;
    A.plan.txt[ch] = k;
    const [on, off] = A.txt[ch];
    CA.drive(tl, (p) => {
      const q = easeInOut(p);
      setO(on, lerp(k0 === 0 ? 1 : 0, k === 0 ? 1 : 0, q));
      setO(off, lerp(k0 === 1 ? 1 : 0, k === 1 ? 1 : 0, q));
    }, { duration: 0.5, pos });
  }

  // ------------------------------------------------------------------ cell-scale beats
  function approachDock(tl, T, pos, duration = 2.0) {
    const ap = CA.approach(tl, T, A.dc, { gap: 2, angle: A.dock.a, duration, pos });
    const dk = CA.dock(tl, T, A.dc, { flatten: 0.1, duration: 0.7 });
    return { start: ap.start, end: dk.end };
  }
  /** Signal 1 alone: the T cell dims, its receptors thin out, a padlock badge stays on it. */
  function anergize(tl, T, pos) {
    const art = T.art;
    const recs = [...art.querySelectorAll('[data-part="receptors"] > *')].filter((_, i) => i % 3 !== 1);
    const glow = art.querySelector('[data-part="glow"]');
    const mem = art.querySelector('path.sao-membrane') || art.querySelector('[data-part="membrane"] path');
    const veil = mem ? S('path', { d: mem.getAttribute('d'), opacity: 0, style: 'fill: #090D1C' }, T.layers.inner) : null;
    const r = T.r;
    const pad = S('g', { transform: `translate(${f(r * 0.95)} ${f(-r * 0.62)})`, opacity: 0 }, T.layers.over);
    const padIn = S('g', { transform: 'scale(0.01)' }, pad);
    S('circle', { r: 11.5, style: 'fill: #121933; stroke: #C9D3E8; stroke-width: 1.3' }, padIn);
    ctx.iconSVG('padlock', { x: 0, y: 0, size: 14, color: '#E6ECFF', strokeWidth: 2 }, padIn);
    const off = label(T.layers.over, { x: 0, y: -r - 15, text: 'Anergic', cls: 't-small' });
    CA.drive(tl, (p) => {
      const q = easeInOut(seg(p, 0, 0.7));
      if (veil) setO(veil, lerp(0, 0.4, q));
      if (glow) setO(glow, lerp(1, 0.1, q));
      recs.forEach((g, i) => setO(g, 1 - easeInOut(seg(p, 0.1 + i * 0.04, 0.45 + i * 0.04))));
      const k = seg(p, 0.55, 0.85);
      setO(pad, Math.min(1, k * 2));
      padIn.setAttribute('transform', `scale(${f(Math.max(0.01, backOut(k)))})`);
      setO(off, seg(p, 0.7, 1));
      setO(T.name, 1 - seg(p, 0.3, 0.6));
    }, { duration: 2.2, pos });
    return { pad, off };
  }
  function granulesIn(tl, rigs, pos) {
    const els = rigs.map((R) => R.art.querySelector('[data-part="granules"]')).filter(Boolean);
    CA.drive(tl, (p) => els.forEach((e, i) => setO(e, easeInOut(seg(p, i * 0.06, 0.6 + i * 0.06)))), { duration: 1.8, pos });
  }
  /** One round of division for every rig in `list`, all at once. Returns the daughters. */
  function divideAll(tl, list, spec, pos, duration = 1.5) {
    const out = [];
    let at = pos;
    list.forEach((R, i) => {
      const d = CA.divide(tl, R, 2, { ...spec, duration, pos: at });
      if (i === 0) at = d.span.start;
      out.push(...d);
    });
    return out;
  }
  /** Daughters of armed cells are born armed (clones are taken when the timeline is built). */
  function armed(rigs) { rigs.forEach((R) => setO(R.art.querySelector('[data-part="granules"]'), 1)); }
  function counterTo(tl, from, to, pos) { textTo(tl, A.lab.count, (v) => `Divisions: ${v}`, from, to, pos); }
  function emitBriefing(tl, pos) {
    const ang = Math.atan2(L.C[1] - L.dc.y, L.C[0] - L.dc.x) / DEG;
    const dist = Math.hypot(L.C[0] - L.dc.x, L.C[1] - L.dc.y);
    CA.emit(tl, A.dc, { kind: 'cytokine', color: PALETTE.dendritic, n: 12, r: dist * 1.05, angle: ang, spread: 46, size: 6, duration: 2.8, seed: 2, pos });
    CA.emit(tl, A.dc, { kind: 'interferon', color: PALETTE.dendritic, n: 7, r: dist * 1.05, angle: ang, spread: 40, size: 9, duration: 2.8, seed: 5, pos: typeof pos === 'number' ? pos + 0.4 : pos });
  }

  // ------------------------------------------------------------------ guided steps
  const steps = [
    { // 1 · Signal 1 alone: recognition without confirmation makes the naive T cell anergic
      enter(tl) {
        const T = A.T1;
        fade(tl, T.name, 0, 1, 0.2);
        const ad = approachDock(tl, T, 0);
        CA.recognize(tl, T, A.dc, { badge: false, duration: 1.6, pos: ad.end - 0.4 });
        lensTo(tl, 1, ad.end - 0.2);
        A.syn.engage('tcr-mhc', true, { tl, pos: ad.end + 0.8, duration: 1.1, stagger: 0.16 });
        wordTo(tl, 1, 0, ad.end + 1.4);
        A.an1 = anergize(tl, T, ad.end + 2.4);
      },
    },
    { // 2 · Signals 1 + 2: an alarmed DC; a fresh naive T cell activates and divides
      // (tightened: the DC matures while T1 parks and T2 is already on its way; ≈ 9.7 s)
      enter(tl) {
        const T1 = A.T1, T2 = A.T2;
        A.syn.engage('tcr-mhc', false, { tl, pos: 0, duration: 0.6, stagger: 0.08 });
        wordTo(tl, 1, -1, 0);
        CA.move(tl, T1, { x: L.park[0], y: L.park[1], duration: 1.6, pos: 0.1 });
        CA.swap(tl, A.dc, A.dcNext, { duration: 1.2, pos: 0.4 });
        A.dock = A.dockA;                                 // the alarmed DC has a different body
        srcTo(tl, A.dock, 0.6);
        fade(tl, A.lab.quiet, 1, 0, 0.4, 0.6);
        fade(tl, A.lab.alarmed, 0, 1, 0.9, 0.6);
        b7To(tl, 1, 0.6, 1.2);
        wordTo(tl, 2, 0, 1.2);
        fade(tl, T2.name, 0, 1, 1.0);
        const ad = approachDock(tl, T2, 0.9, 1.6);
        CA.recognize(tl, T2, A.dc, { badge: false, duration: 1.6, pos: ad.end - 0.4 });
        A.syn.engage('tcr-mhc', true, { tl, pos: ad.end - 0.2, duration: 1.0, stagger: 0.14 });
        wordTo(tl, 1, 0, ad.end + 0.2);
        A.syn.engage('cd28-b7', true, { tl, pos: ad.end + 0.3, duration: 1.0, stagger: 0.14 });
        // activation: brighter, larger; leaves the DC and divides
        const t0 = ad.end + 1.4;
        fade(tl, T2.name, 1, 0, t0, 0.4);
        CA.swap(tl, T2, A.T2act, { duration: 1.2, pos: t0 });
        CA.move(tl, T2, { x: L.C[0], y: L.C[1], duration: 1.5, pos: t0 + 0.9 });
        const g1 = divideAll(tl, [T2], L.div[0], t0 + 2.45, 1.3);
        fade(tl, A.lab.count, 0, 1, t0 + 2.6);
        counterTo(tl, 0, 1, t0 + 3.3);
        A.gen2 = divideAll(tl, g1, L.div[1], t0 + 3.8, 1.3);
        counterTo(tl, 1, 2, t0 + 4.8);
        fade(tl, A.lab.act, 0, 1, t0 + 4.6);
      },
    },
    { // 3 · Signal 3: the briefing turns the daughters into armed killers
      enter(tl) {
        flowTo(tl, 1, 0.1);
        wordTo(tl, 3, 0, 0.3);
        emitBriefing(tl, 0.4);
        granulesIn(tl, A.gen2, 2.2);
        const g3 = divideAll(tl, A.gen2, L.div[2], 3.4);
        armed(g3);
        counterTo(tl, 2, 3, 4.5);
        fade(tl, A.lab.act, 1, 0, 4.2, 0.4);
        fade(tl, A.lab.armed, 0, 1, 4.6, 0.6);
        A.gen3 = g3;
      },
    },
  ];

  // ------------------------------------------------------------------ free encounters
  function encounter(tl, S) {
    const T = A.T;
    fade(tl, T.name, 0, 1, 0.2);
    if (!S.s1) {
      const pr = CA.probe(tl, T, A.dc, { match: false, angle: A.dock.a, hold: 1.0, duration: 2.0, pos: 0 });
      wordTo(tl, 1, 1, pr.end - 1.0);
      if (S.s2) {
        A.syn.engage('cd28-b7', true, { tl, pos: pr.end - 1.1, duration: 0.6, stagger: 0.1 });
        A.syn.engage('cd28-b7', false, { tl, pos: pr.end + 0.2, duration: 0.6, stagger: 0.1 });
      }
      if (S.s3) { flowTo(tl, 1, pr.end - 1.0); wordTo(tl, 3, 0, pr.end - 0.8); }
      const keep = label(T.layers.over, { x: 0, y: -T.r - 15, text: 'Keeps searching', cls: 't-small' });
      fade(tl, T.name, 1, 0, pr.end, 0.4);
      fade(tl, keep, 0, 1, pr.end + 0.4);
      CA.move(tl, T, { x: L.exit[0], y: L.exit[1], duration: 2.6, pos: pr.end + 0.1 });
      return;
    }
    const ad = approachDock(tl, T, 0);
    CA.recognize(tl, T, A.dc, { badge: false, duration: 1.6, pos: ad.end - 0.4 });
    A.syn.engage('tcr-mhc', true, { tl, pos: ad.end - 0.2, duration: 1.0, stagger: 0.14 });
    wordTo(tl, 1, 0, ad.end + 0.2);
    let t = ad.end + 0.6;
    if (S.s2) { A.syn.engage('cd28-b7', true, { tl, pos: t, duration: 1.0, stagger: 0.14 }); t += 0.8; }
    if (S.s3) { flowTo(tl, 1, t); wordTo(tl, 3, 0, t + 0.2); t += 0.6; }
    const out = outcomeOf(S);
    if (out === 'anergy') { anergize(tl, T, t + 0.6); return; }
    const t0 = t + 0.6;
    fade(tl, T.name, 1, 0, t0, 0.4);
    CA.swap(tl, T, A.Tact, { duration: 1.2, pos: t0 });
    CA.move(tl, T, { x: L.C[0], y: L.C[1], duration: 1.9, pos: t0 + 1.1 });
    const g1 = divideAll(tl, [T], L.div[0], t0 + 3.1);
    fade(tl, A.lab.count, 0, 1, t0 + 3.4);
    counterTo(tl, 0, 1, t0 + 4.2);
    if (out === 'active') {
      divideAll(tl, g1, L.div[1], t0 + 4.8);
      counterTo(tl, 1, 2, t0 + 5.9);
      fade(tl, A.lab.act, 0, 1, t0 + 5.6);
      return;
    }
    emitBriefing(tl, t0 + 3.0);
    const g2 = divideAll(tl, g1, L.div[1], t0 + 4.8);
    counterTo(tl, 1, 2, t0 + 5.9);
    granulesIn(tl, g2, t0 + 5.6);
    armed(divideAll(tl, g2, L.div[2], t0 + 6.8));
    counterTo(tl, 2, 3, t0 + 7.9);
    fade(tl, A.lab.armed, 0, 1, t0 + 7.8, 0.6);
  }

  function startFree(Snext, { instant = false } = {}) {
    if (free && free.tl) free.tl.kill();
    const St = { s1: !!Snext.s1, s2: !!Snext.s2, s3: !!Snext.s3 };
    draw(St);
    const tl = gsap.timeline({ paused: true });
    encounter(tl, St);
    free = { S: St, tl };
    if (instant || ctx.reducedMotion) tl.progress(1);
    else tl.play();
    showCard(St);
    showScenario(St);
    if (stepper.playing) stepper.pause();   // the reader took over: stop the guided play-all
  }

  // Scenario line (polish A6): while the reader's own switches or a preset are showing, this line
  // replaces the step caption, so the text always describes what is on the stage.
  const scenLine = ctx.h('p', { class: 'ts-scen', hidden: true, 'aria-live': 'polite' });
  const SCEN = {
    alarmed: 'An alarmed dendritic cell gives all three signals: the T cell activates, divides, and its daughters become effector killer T cells.',
    self: 'A quiet dendritic cell showing a harmless self-protein gives recognition without confirmation, so the self-reactive T cell becomes anergic. This is how tolerance is kept outside the thymus.',
    tumor: 'A quiet dendritic cell carrying tumor debris gives recognition without confirmation, so the T cells that could attack the tumor become anergic instead.',
  };
  const OUT_LINE = {
    ignore: 'Without signal 1 there is no recognition, so confirmation and cytokines count for nothing: the T cell walks on by.',
    anergy: 'Recognition without confirmation leaves the naive T cell unresponsive (anergic).',
    active: 'Recognition plus confirmation: the T cell activates and divides. Without instructive cytokines, its daughters do not yet become effector killer T cells.',
    briefed: 'All three signals: the T cell activates, divides, and its daughters become effector killer T cells.',
  };
  function showScenario(S) {
    const out = outcomeOf(S);
    let text = preset ? SCEN[preset] : OUT_LINE[out];
    if (!preset && out === 'anergy' && S.s3) text += ' Cytokines cannot replace the missing confirmation.';
    scenLine.innerHTML = `<b>${preset ? 'Scenario' : 'Your switches'}</b>${text}`;
    scenLine.hidden = false;
    ctx.caption.classList.add('ts-scen-on');
    if (scenLine.parentNode !== ctx.caption) ctx.caption.append(scenLine);
  }
  function hideScenario() {
    scenLine.hidden = true;
    ctx.caption.classList.remove('ts-scen-on');
  }

  // ------------------------------------------------------------------ outcome card + controls
  const card = ctx.ui.infoCard({ placement: 'auto', width: '19rem', closable: false, empty: null });
  // Phones (final polish): the outcome card would sit between the stage and the stepper, pushing the
  // stepper and caption a screen down. There it moves after the caption, to the top of the controls;
  // on wide figures it stays beside the stage.
  const cardHome = card.el.parentElement;
  card.el.classList.add('ts-card');
  const placeCard = (compact) => {
    if (compact) { if (card.el.parentElement !== ctx.controls) ctx.controls.prepend(card.el); }
    else if (card.el.parentElement !== cardHome) cardHome.append(card.el);
  };
  function kicker(S) {
    const on = [S.s1 && '1', S.s2 && '2', S.s3 && '3'].filter(Boolean);
    if (!on.length) return 'No signals';
    if (on.length === 1) return `Signal ${on[0]} alone`;
    return `Signals ${on.slice(0, -1).join(', ')} and ${on[on.length - 1]}`;
  }
  function showCard(S) {
    const out = outcomeOf(S);
    const c = CARD[out];
    let extra = '';
    if (out === 'ignore' && (S.s2 || S.s3)) extra = '<p>Confirmation and cytokines never stand in for recognition.</p>';
    if (out === 'anergy' && S.s3) extra = '<p>Cytokines cannot replace the missing confirmation.</p>';
    // (the preset's own sentence now lives in the scenario line under the stepper, not repeated here)
    card.show({
      kicker: kicker(S),
      title: c.title,
      badge: c.badge ? { kind: c.badge, label: '' } : null,
      body: `<p>${c.line}</p>${extra}<p class="ts-next"><a href="05-t-cells.html#the-brakes">The brake that follows → Chapter 5.</a></p>`,
    });
  }

  // free controls: three switches + presets, live from the start (polish A6: no gating)
  const freeBox = ctx.h('div', { class: 'ts-free' });
  const swBox = ctx.h('div', { class: 'ts-switches', role: 'group', 'aria-label': 'Signals' }, ctx.h('span', { class: 'ts-switches__label', text: 'Signals' }));
  freeBox.append(swBox);
  const SW = [
    { key: 's1', n: 1, name: 'recognition' },
    { key: 's2', n: 2, name: 'confirmation' },
    { key: 's3', n: 3, name: 'instruction' },
  ];
  const switches = SW.map((d) => {
    const t = ctx.ui.toggle({ label: '', checked: false, parent: swBox, onChange: () => onSwitch() });
    t.def = d;
    return t;
  });
  function paintSwitch(t) {
    const on = t.checked;
    t.el.querySelector('.switch__label').innerHTML = `<b>Signal ${t.def.n}</b> · ${t.def.name}<span class="ts-state">${on ? 'On' : 'Off'}</span>`;
  }
  function syncSwitches(St) { switches.forEach((t) => { t.set(!!St[t.def.key]); paintSwitch(t); }); }
  function readSwitches() { const o = {}; switches.forEach((t) => { o[t.def.key] = t.checked; }); return o; }
  function onSwitch() {
    switches.forEach(paintSwitch);
    preset = null;
    presets.set(null);
    startFree(readSwitches());
  }

  const presetBox = ctx.h('div', { class: 'ts-presets' });
  freeBox.append(presetBox);
  const presets = ctx.ui.chips({
    label: 'Scenarios',
    variant: 'card',
    parent: presetBox,
    options: [
      { value: 'alarmed', label: 'Alarmed dendritic cell', desc: 'Danger detected' },
      { value: 'self', label: 'Quiet dendritic cell', desc: 'Harmless self-protein' },
      { value: 'tumor', label: 'Quiet dendritic cell', desc: 'Tumor debris' },
    ],
    onChange(v) {
      if (!v) return;
      const P = PRESETS[v];
      preset = v;
      pep = P.pep;
      syncSwitches(P);
      startFree(P);
    },
  });


  const stepper = ctx.ui.stepper({
    steps,
    reset: () => draw('guided'),
    onChange(i) {
      hideScenario();
      if (free) leaveFree(i);
      pep = 'foreign';
      preset = null;
      presets.set(null);
      syncSwitches(STEP_STATES[i]);
      showCard(STEP_STATES[i]);
      iChip.style.setProperty('--ts-delay', i === 0 ? '3.4s' : '0s');
      iChip.classList.add('is-on');
    },
  });

  ctx.controls.append(ctx.h('p', { class: 'ts-legend', html: '<span><span class="ts-disc" aria-hidden="true">+</span>signal delivered</span><span>Signals 1 and 2 are the two factors. Signal 3 is instruction, carried by cytokines.</span>' }));
  ctx.controls.append(ctx.h('ul', { class: 'ts-asides', html: '<li><b>This check governs a naive T cell’s first activation.</b> Effector killer T cells act on signal 1 alone (Chapter 5).</li><li>Naive T cells meet presenters in lymph nodes; ordinary body cells carry essentially no B7.</li>' }));
  ctx.controls.append(freeBox);

  function leaveFree(i) {
    if (free.tl) free.tl.kill();
    free = null;
    pep = 'foreign';
    stepper.rebuild();
    if (ctx.reducedMotion) return;
    const tl = stepper.timeline;
    const t0 = tl.labels[`s${i}:start`] ?? 0, t1 = tl.labels[`s${i}`];
    tl.seek(t0, true);
    gsap.to(tl, { time: t1, duration: t1 - t0, ease: 'none', overwrite: true });
  }

  syncSwitches(STEP_STATES[0]);
  showCard(STEP_STATES[0]);

  // ------------------------------------------------------------------ the "i" chip position
  function placeI() {
    const LN = L.lens;
    const [W, H] = L.vb;
    // t-small renders at max(13, 12 px on screen) → user units; Inter averages ~0.53 em per glyph
    const fs = Math.max(13, 12 / (ctx.pxPerUnit(svg) || 1));
    const half = (LN.short ? TEXT.ch3.short[0] : TEXT.ch3.long[0]).length * 0.53 * fs / 2;
    const x = LN.x + LN.ch[2] + half + 15, y = LN.y + A.bY - 4;
    iChip.style.left = `${((x / W) * 100).toFixed(1)}%`;
    iChip.style.top = `${((y / H) * 100).toFixed(1)}%`;
  }

  ctx.onResize(({ compact }) => {
    placeCard(compact);
    const next = compact ? 'compact' : 'wide';
    requestAnimationFrame(() => { if (A.txt) placeI(); });
    if (next === layoutName) return;
    layoutName = next;
    if (free) startFree(free.S, { instant: true });
    else stepper.rebuild();
  });

  return {
    destroy() {
      if (free && free.tl) free.tl.kill();
      ambients.forEach((t) => t.kill());
      tracked.forEach((h) => h.stop());
      if (A.syn) A.syn.destroy();
      iChip.remove();
    },
  };
}
