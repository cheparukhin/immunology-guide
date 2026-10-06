// ch05-brakes — "Accelerators and brakes" (FIGURE-AUDIT §2A: owns *why brakes exist and how they
// work*, no drugs; §4 rules 2, 5–8, 10, 12, 16, 17, 21).
//
// A six-step stepper over two scenes, with the shared activity-meter ledger (top left):
//   Scene 1 · Lymph node (steps 1–4): a cell-scale node (dendritic cell + helper T cell + its
//     clone) and the contact, magnified: B7 on the dendritic cell, CD28 and later CTLA-4 on the
//     T cell. CTLA-4 arrives in vesicles, out-competes CD28 for the same B7 and drags B7 into the
//     T cell (B7: 8 → 4). Step 4 = "No CTLA-4" (toggle): runaway, spill, body map.
//   Scene 2 · Tissue (steps 5–6): a killer T cell kills an infected cell and releases IFN-γ
//     (hollow blue rings); neighbours display PD-L1; PD-1 engages (shared synapse.js lens); the
//     T cell keeps crawling at the same speed but no longer settles. Step 6 = "No PD-1" (toggle).
// Knockout toggles are variant flags + stepper.rebuild(); after step 6 both scenes become tabs.
// Everything the steps change is tweened through pure render functions (seek-safe).
import {
  tCell, dendriticCell, healthyCell, lymphNodeField, tissueField, bodyMap, synapse as synapseArt,
  tcr, mhc2, cd28, ctla4, b7, pd1, pdl1, signalIcon, placeOnMembrane, cellInfo, rayHit, DOCK_GAP,
  PALETTE, mix,
} from '../art/index.js';
import * as CA from './shared/cell-actions.js';
import { synapseScene } from './shared/synapse.js';
import { meter } from './shared/activity-meter.js';

const ID = 'ch05-brakes';
const DEG = Math.PI / 180;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
const seg = (p, a, b) => clamp((p - a) / (b - a || 1), 0, 1);
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const f = (v) => String(Math.round(v * 100) / 100);

const CLOCK = ['Lymph node · Day 0', 'Lymph node · Day 1', 'Lymph node · Days 2–3', 'Tissue · Hours 0–6', 'Tissue · Hours 6–24', 'Tissue · Days 1–2'];

// ledger values per step (illustrative; words on screen, never numbers)
const LEDGER = {
  rest: { tcr: 0, cd28: 0, ctla4: 0, pd1: 0 },
  s1: { tcr: 0.34, cd28: 0.28, ctla4: 0, pd1: 0 },
  s2: { tcr: 0.34, cd28: 0.14, ctla4: 0.16, pd1: 0 },
  s3: { tcr: 0.34, cd28: 0.1, ctla4: 0.2, pd1: 0 },
  ko1: { tcr: 0.45, cd28: 0.45, ctla4: 0, pd1: 0 },
  s5a: { tcr: 0.5, cd28: 0, ctla4: 0, pd1: 0 },
  s5c: { tcr: 0.5, cd28: 0, ctla4: 0, pd1: 0.33 },
  ko2: { tcr: 0.6, cd28: 0, ctla4: 0, pd1: 0 },
};

const CHIPS = {
  ko1: '<b>In mice born without CTLA-4,</b> many T cells, mostly helpers, activate against self and invade organs; death by 3–4 weeks. Losing CTLA-4 from Tregs alone is enough to cause fatal disease.',
  ko2: '<b>Mice without PD-1</b> develop autoimmunity too, but milder than without CTLA-4 (in one strain, a fatal disease of the heart muscle).',
};
const INFO = {
  b7: 'B7 = two proteins, CD80 and CD86. CD28 and CTLA-4 bind both; CTLA-4 binds much more tightly.',
  where: 'Simplification: each brake mostly works where shown, but also acts in the other place to some extent.',
};

const LAYOUTS = {
  wide: {
    vb: [960, 600],
    ledger: { x: 24, y: 58, w: 340 },
    lens: { x: 664, y: 194, w: 552, h: 276, size: 34, depth: 44, th: 12 },
    b7x: [-230, -178, -126, -74, 74, 126, 178, 230],
    lab: { top: -100, bot: 106, cap: 18, b7: 2, count: 6 },
    // scene 1 (lymph node, bottom row)
    node: { x: 12, y: 340, w: 720, h: 252 },
    dc: { x: 236, y: 474, r: 100, seed: 3 },
    dcs: [{ x: 616, y: 420, r: 60, seed: 8 }, { x: 664, y: 536, r: 56, seed: 12 }],
    tR: 20, dockWant: -8,
    cluster: { x: 444, y: 486 }, div: [{ angle: 0, spread: 56 }, { angle: 90, spread: 30 }, { angle: 0, spread: 27 }],
    clusterLabel: { x: 444, y: 422 },
    body: { x: 806, y: 478, h: 220, lw: 128 },
    spill: { from: [596, 474], n: 28, a: [-45, 75], d: [36, 150], sx: 1, sy: 0.75 },   // clear of the 'many' label above
    many: { x: 600, y: 360 },
    // scene 2 (tissue strip)
    tissue: { y: 556, r: 50, xs: [70, 172, 274, 376, 478, 580, 682, 784, 886], infected: [2, 5], near: [4, 6] },
    kR: 26, k0: [-40, 410], rowY: 452, pass: 820,
    lens2: { pairs: { tcr: [-200, -142], pd1: [-28, 58, 144, 230] } },
    enough: { x: 580, y: 412 },
  },
  compact: {
    vb: [400, 768],
    ledger: { x: 16, y: 84, w: 368 },
    lens: { x: 200, y: 438, w: 384, h: 218, size: 25, depth: 32, th: 10 },
    b7x: [-162, -122, -82, -42, 42, 82, 122, 162],
    lab: { top: -78, bot: 82, cap: 14, b7: 5, count: 7 },
    node: { x: 6, y: 556, w: 388, h: 206 },
    dc: { x: 104, y: 668, r: 76, seed: 3 },
    dcs: [{ x: 352, y: 744, r: 38, seed: 8 }],
    tR: 18, dockWant: -20,
    cluster: { x: 262, y: 664 }, div: [{ angle: 0, spread: 46 }, { angle: 90, spread: 26 }, { angle: 0, spread: 23 }],
    clusterLabel: { x: 262, y: 606 },
    body: { x: 284, y: 652, h: 150, lw: 108 },
    spill: { from: [180, 672], n: 22, a: [100, 260], d: [40, 165], sx: 1, sy: 0.7 },
    many: { x: 196, y: 754 },
    tissue: { y: 730, r: 42, xs: [40, 122, 204, 286, 368], infected: [1, 3], near: [2, 4] },
    kR: 22, k0: [-40, 600], rowY: 652, pass: 360,
    lens2: { pairs: { tcr: [-140, -96], pd1: [-14, 50, 114, 178] } },
    enough: { x: 200, y: 590 },
  },
};

const STYLE = `
/* polish A5: no in-stage label under 12 px on phones (small caps render at 11 px by default there) */
@container fig (max-width: 599.98px) { [data-figure="${ID}"] svg .t-caps { font-size: max(13.5px, calc(12.5px * var(--u, 1))); } }
[data-figure="${ID}"] .br-i {
  position: absolute; z-index: 4; width: 1.6rem; height: 1.6rem; margin: -0.8rem 0 0 -0.8rem; padding: 0;
  border-radius: 50%; border: 1px solid var(--stage-dark-line, rgba(160,175,220,.4)); cursor: pointer;
  background: color-mix(in srgb, var(--stage-dark-a, #0B1024) 80%, transparent); color: var(--stage-dark-ink, #EEF2FF);
  font: italic 700 0.75rem/1 var(--font-ui); transition: opacity .4s ease, visibility .4s;
}
[data-figure="${ID}"] .br-i::before { content: ""; position: absolute; inset: -0.65rem; }
[data-figure="${ID}"] .br-i[data-off] { opacity: 0; visibility: hidden; }
[data-figure="${ID}"] .br-i:hover { border-color: var(--stage-dark-ink, #EEF2FF); }
[data-figure="${ID}"] .br-i:focus-visible { outline: 2px solid var(--stage-focus, #9DB5FF); outline-offset: 2px; }
[data-figure="${ID}"] .br-i--hud { position: relative; margin: 0.15rem 0 0 0.35rem; pointer-events: auto; }
[data-figure="${ID}"] .fig__hud-top-left { flex-direction: row; align-items: flex-start; }
[data-figure="${ID}"] .br-bar { display: flex; flex-wrap: wrap; align-items: center; gap: var(--s-3) var(--s-5); margin-top: var(--s-4); font-family: var(--font-ui); }
[data-figure="${ID}"] .br-bar[hidden], [data-figure="${ID}"] .br-bar [hidden] { display: none !important; }
[data-figure="${ID}"] .br-chip { flex: 1 1 100%; margin: 0; padding: 0.65rem 0.85rem; border-radius: var(--r-md, 10px); background: var(--surface); box-shadow: inset 0 0 0 1px var(--rule); border-left: 3px solid var(--c-inhibit); font: 500 var(--text-xs)/1.5 var(--font-ui); color: var(--ink-2); }
[data-figure="${ID}"] .br-chip b { color: var(--ink); font-weight: 650; }
@container fig (max-width: 599.98px) {
  [data-figure="${ID}"] .br-bar .segmented { flex: 1 1 100%; }
  [data-figure="${ID}"] .br-bar .segmented__track { width: 100%; }
  [data-figure="${ID}"] .br-bar .segmented__opt { flex: 1 1 0; justify-content: center; height: 2.75rem; }
}
`;

export default function mount(fig, ctx) {
  const { gsap } = ctx;
  if (!document.getElementById(`${ID}-style`)) document.head.append(ctx.h('style', { id: `${ID}-style`, html: STYLE }));
  ctx.setAspect(960 / 600, 400 / 768);
  const svg = ctx.createSVG({ viewBox: '0 0 960 600' });
  const S = (tag, attrs, parent) => ctx.svg(tag, attrs, parent);
  ctx.tag('Illustrative', 'top-right');
  ctx.tag('Time compressed', 'top-right');
  const clock = ctx.ui.clock({ value: CLOCK[0], corner: 'top-left' });

  const lensBg = ctx.radialGradient(svg, [[0, '#18224A'], [1, '#0A0F22']], { id: `${ID}-lensbg`, cy: '45%', r: '75%' });
  const clip1 = S('rect', {}, S('clipPath', { id: `${ID}-clip1` }, svg.defs));

  // "i" chips: B7 (lens 1) and the "mainly here" simplification (beside the clock)
  const mkI = (label, text, cls = '') => {
    const b = ctx.h('button', { type: 'button', class: `br-i ${cls}`.trim(), text: 'i', 'aria-label': label });
    const show = () => ctx.tooltip.show(text, b);
    ctx.on(b, 'click', show); ctx.on(b, 'focus', show); ctx.on(b, 'mouseenter', show);
    ctx.on(b, 'mouseleave', () => ctx.tooltip.hide()); ctx.on(b, 'blur', () => ctx.tooltip.hide());
    ctx.on(b, 'keydown', (e) => { if (e.key === 'Escape') ctx.tooltip.hide(); });
    return b;
  };
  const iB7 = mkI('About B7', INFO.b7);
  iB7.setAttribute('data-off', '');
  ctx.stage.append(iB7);
  const iWhere = mkI('About where each brake works', INFO.where, 'br-i--hud');
  clock.el.after(iWhere);

  let layoutName = ctx.compact ? 'compact' : 'wide';
  let L = LAYOUTS[layoutName];
  let A = {};
  let ko1 = true, ko2 = true;   // knockout variants shown at steps 4 and 6 ("opens on No …")
  let unlocked = false;
  const ambients = [];

  // ------------------------------------------------------------------ helpers
  const setO = (el, v) => el && el.setAttribute('opacity', f(v));
  function fade(tl, els, from, to, pos, duration = 0.5) {
    const list = [].concat(els).filter(Boolean);
    if (!list.length) return;
    CA.drive(tl, (p) => { const v = lerp(from, to, easeInOut(p)); list.forEach((e) => setO(e, v)); }, { duration, pos });
  }
  function label(parent, { x, y, text, anchor = 'middle', cls = 't-label', opacity = 0, leader = null }) {
    const g = S('g', { opacity }, parent);
    if (leader) {
      const ty = y + (leader[1] > y ? 6 : -16);
      S('line', { x1: f(x), y1: f(ty), x2: f(leader[0]), y2: f(leader[1]), style: 'stroke: var(--fg-2); stroke-opacity: 0.6; stroke-width: 1; vector-effect: non-scaling-stroke' }, g);
      S('circle', { cx: f(leader[0]), cy: f(leader[1]), r: 2.2, style: 'fill: var(--fg-2)' }, g);
    }
    S('text', { class: `${cls} t-halo`, x: f(x), y: f(y), 'text-anchor': anchor, text }, g);
    return g;
  }
  function clockTo(tl, from, to, pos) {
    CA.drive(tl, (p) => clock.set(CLOCK[clamp(Math.round(lerp(from, to, p)), 0, CLOCK.length - 1)]), { duration: 0.3, pos });
  }
  function textTo(tl, el, fmt, from, to, pos, duration = 0.6) {
    CA.drive(tl, (p) => { el.textContent = fmt(Math.round(lerp(from, to, p))); }, { duration, pos });
  }
  function lensFrame(parent, LN, clipId) {
    const root = S('g', { transform: `translate(${f(LN.x)} ${f(LN.y)})` }, parent);
    S('rect', { x: f(-LN.w / 2 - 6), y: f(-LN.h / 2 - 6), width: f(LN.w + 12), height: f(LN.h + 12), rx: 26, style: 'fill: #050816; opacity: 0.55' }, root);
    S('rect', { x: f(-LN.w / 2), y: f(-LN.h / 2), width: f(LN.w), height: f(LN.h), rx: 20, fill: lensBg }, root);
    const content = S('g', { 'clip-path': `url(#${clipId})` }, root);
    const rim = () => S('rect', { x: f(-LN.w / 2), y: f(-LN.h / 2), width: f(LN.w), height: f(LN.h), rx: 20, style: 'fill: none; stroke: #AFC0FF; stroke-opacity: 0.5; stroke-width: 1.6' }, root);
    return { root, content, rim };
  }
  function dockOf(art, want) {
    const pts = cellInfo(art).outline;
    let best = null;
    for (let a = want - 50; a <= want + 50; a += 2) {
      const h = rayHit(pts, a * DEG);
      const r = Math.hypot(h.x, h.y);
      const score = r + Math.abs(a - want) * 0.25;
      if (!best || score < best.score) best = { a, r, score };
    }
    return best;
  }

  // ------------------------------------------------------------------ the scene
  function draw() {
    ambients.splice(0).forEach((t) => t.kill());
    if (A.syn2) A.syn2.destroy();
    for (const n of [...svg.children]) if (n !== svg.defs) n.remove();
    L = LAYOUTS[layoutName];
    const [W, H] = L.vb;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    ctx.refreshTextScale();
    A = { plan: { band: null, pdl1: 0, pd1on: 1, scene: 0, body: 0 } };
    clock.set(CLOCK[0]);

    A.s1 = S('g', { 'data-part': 'scene-node' }, svg);
    A.s2 = S('g', { 'data-part': 'scene-tissue', opacity: 0 }, svg);
    drawNode(A.s1);
    drawTissue(A.s2);

    // the ledger (shared activity-meter), top left, on a quiet panel
    const LG = L.ledger;
    const panel = S('rect', { x: LG.x - 12, y: LG.y - 14, width: LG.w + 24, height: 10, rx: 14, style: 'fill: #070B1A; fill-opacity: 0.62; stroke: #AFC0FF; stroke-opacity: 0.16' }, svg);
    A.ledger = meter(svg, {
      mode: 'ledger', x: LG.x, y: LG.y, width: LG.w, title: 'T-cell activity', tag: null, tone: 'benefit',
      segments: [
        { id: 'tcr', label: 'TCR (signal 1)', sign: '+' },
        { id: 'cd28', label: 'CD28 (signal 2)', sign: '+' },
        { id: 'ctla4', label: 'CTLA-4', sign: '-' },
        { id: 'pd1', label: 'PD-1', sign: '-' },
      ],
      zones: [{ from: -1, to: 0.12, label: 'Resting' }, { from: 0.12, to: 0.75, label: 'Active' }, { from: 0.75, to: 1, label: 'Full throttle' }],
      values: LEDGER.rest,
    });
    // zone words: the meter staggers crowded labels (Active drops to a second row). Here "Resting" and
    // "Active" share the first row, and "Full throttle" (the narrow end zone) takes the second row,
    // right-aligned so it stays inside the ledger, with the meter's leader moved to its zone. Otherwise
    // "Active" sat directly under "Full throttle" and read as one label.
    const zl = [...A.ledger.el.querySelectorAll('text.t-caps.t-mid')];
    if (zl.length === 3) {
      const y0 = zl[0].getAttribute('y'), y1 = zl[1].getAttribute('y');
      const lead = [...A.ledger.el.querySelectorAll('line')].find((l) => Math.abs(Number(l.getAttribute('x1')) - Number(zl[1].getAttribute('x'))) < 0.5 && l.getAttribute('x1') === l.getAttribute('x2'));
      zl[1].setAttribute('y', y0);
      zl[2].setAttribute('y', y1);
      zl[2].setAttribute('x', f(LG.w));
      zl[2].setAttribute('text-anchor', 'end');
      zl[2].classList.remove('t-mid');
      if (lead) {
        // centre of the "Full throttle" zone band (the meter's 16-unit-high zone rects)
        const r2 = [...A.ledger.el.querySelectorAll('rect')].filter((r) => r.getAttribute('height') === '16')[2];
        const cxz = r2 ? Number(r2.getAttribute('x')) + Number(r2.getAttribute('width')) / 2 : LG.w - 6;
        lead.setAttribute('x1', f(cxz));
        lead.setAttribute('x2', f(cxz));
      }
    }
    panel.setAttribute('height', f(A.ledger.height + 34));

    // Focus groups (polish A5: one focal panel per step, the others dimmed). Each scene's cells and
    // its magnified window get their own wrapper; the ledger and its panel get a third. Rigs and their
    // fx layer move into the cells wrapper together, so cell-actions keeps finding its fx layer.
    const wrapCells = (g, keep) => {
      const w = S('g', { 'data-focus': 'cells' }, null);
      const kids = [...g.children].filter((n) => !keep.includes(n));
      g.insertBefore(w, g.firstChild);
      kids.forEach((n) => w.append(n));
      const lw = S('g', { 'data-focus': 'lens' }, g);
      keep.filter(Boolean).forEach((n) => lw.append(n));
      return [w, lw];
    };
    const [c1, l1] = wrapCells(A.s1, [A.leader1, A.lens1]);
    const [c2, l2] = wrapCells(A.s2, [A.lens2]);
    const lg = S('g', { 'data-focus': 'ledger' }, svg);
    lg.append(panel, A.ledger.el);
    A.F = { cells: [c1, c2], lens: [l1, l2], ledger: [lg] };
    A.plan.focus = { cells: 1, lens: 1, ledger: 1 };
    placeI();
  }
  const DIM = 0.38;
  /** Seek-safe focus change: `key` panel at full strength, the other two dimmed. */
  function focusTo(tl, key, pos, duration = 0.6) {
    const from = { ...A.plan.focus };
    const to = { cells: DIM, lens: DIM, ledger: DIM, [key]: 1 };
    A.plan.focus = to;
    CA.drive(tl, (p) => {
      const q = easeInOut(p);
      for (const k of ['cells', 'lens', 'ledger']) A.F[k].forEach((e) => setO(e, lerp(from[k], to[k], q)));
    }, { duration, pos });
  }

  // ------------------------------------------------------------------ scene 1: lymph node
  function dcArt(r, seed, peptide) {
    const art = dendriticCell({ r, seed, state: 'mature', stage: 'dark', receptors: false });
    placeOnMembrane(art, (o, i) => (i % 2 ? b7(o) : mhc2({ ...o, peptide })), { count: 12, size: layoutName === 'wide' ? 12 : 11, seed: seed + 1 });
    return art;
  }
  function drawNode(g) {
    const N = L.node;
    g.append(lymphNodeField({ x: N.x, y: N.y, width: N.w, height: N.h, seed: 7, stage: 'dark', follicles: 2, density: 0.85 }));
    S('text', { class: 't-caps', x: N.x + N.w / 2, y: N.y + 24, 'text-anchor': 'middle', text: 'Lymph node', style: 'fill: var(--fg-3)' }, g);
    // context: other dendritic cells presenting ordinary self-peptides (sand)
    A.dcs = L.dcs.map((d) => CA.rig(dcArt(d.r, d.seed, 'self'), { x: d.x, y: d.y, parent: g, seed: d.seed, opacity: 0.8 }));
    A.dc = CA.rig(dcArt(L.dc.r, L.dc.seed, 'foreign'), { x: L.dc.x, y: L.dc.y, parent: g, seed: L.dc.seed });
    A.dock = dockOf(A.dc.art, L.dockWant);
    const a = A.dock.a * DEG;
    A.contact = [L.dc.x + Math.cos(a) * A.dock.r, L.dc.y + Math.sin(a) * A.dock.r];
    const tr = L.tR;
    A.T = CA.rig(tCell({ variant: 'cd4', r: tr, seed: 7, stage: 'dark' }), {
      x: A.contact[0] + Math.cos(a) * (tr + 1), y: A.contact[1] + Math.sin(a) * (tr + 1), parent: g, seed: 7,
    });
    A.Tact = tCell({ variant: 'cd4', r: tr, seed: 7, state: 'activated', polarity: 180 + A.dock.a, stage: 'dark', cytokines: false });
    A.fx1 = CA.fxLayer(g);
    // labels
    A.lab1 = {
      dc: label(g, { x: L.dc.x - L.dc.r * 0.15, y: L.dc.y + L.dc.r * 0.62, text: 'Dendritic cell', cls: 't-small', opacity: 1 }),
      t: label(A.T.layers.over, { x: 0, y: -tr - 14, text: 'T cell', cls: 't-small', opacity: 1 }),
      clone: label(g, { x: L.clusterLabel.x, y: L.clusterLabel.y, text: '8 copies', cls: 't-small' }),
      many: label(g, { x: L.many.x, y: L.many.y, text: 'Many clones, many against self', cls: 't-small' }),
    };
    // knockout crowd (built hidden; step 4 brings them in)
    buildSpill(g);
    buildBody(g);
    buildLens1(g);
    if (!ctx.reducedMotion) {
      ambients.push(ctx.ambient(gsap.to(A.dc.layers.idle, { scale: 1.012, rotation: 0.8, svgOrigin: '0 0', duration: 3.6, ease: 'sine.inOut', yoyo: true, repeat: -1 })));
    }
  }

  function buildSpill(g) {
    const R = ctx.random(11);
    const layer = S('g', { 'data-part': 'spill' }, g);
    A.spill = [];
    const N = L.node;
    const [fx, fy] = L.spill.from;
    for (let i = 0; i < L.spill.n; i++) {
      const killer = i % 5 === 3;
      const r = layoutName === 'wide' ? R.range(11, 13.5) : R.range(9.5, 11.5);
      const art = tCell({ variant: killer ? 'cd8' : 'cd4', r, seed: 40 + i, tcrKey: i, state: 'activated', polarity: R.range(-40, 40), stage: 'dark', cytokines: false });
      // targets: fan out from the node toward (and past) its right edge, a few up and down
      const t = i / (L.spill.n - 1);
      const SP = L.spill;
      const ang = lerp(SP.a[0], SP.a[1], R()) * DEG;
      const dist = lerp(SP.d[0], SP.d[1], Math.pow(t, 0.8)) * R.range(0.85, 1.1);
      const x = fx + Math.cos(ang) * dist * SP.sx;
      const y = clamp(fy + Math.sin(ang) * dist * SP.sy, N.y + 10, N.y + N.h + 40);
      const w = S('g', { transform: `translate(${f(x)} ${f(y)})`, opacity: 0 }, layer);
      const inner = S('g', { transform: 'scale(0.2)' }, w);
      inner.append(art);
      A.spill.push({ w, inner, t, x, y });
    }
    // two dendritic cells showing self-peptides get docked by self-reactive clones (sand peptides)
  }

  function buildBody(g) {
    const B = L.body;
    const body = S('g', { transform: `translate(${f(B.x)} ${f(B.y)})`, opacity: 0 }, g);
    S('rect', { x: f(-B.h * 0.27), y: f(-B.h / 2 - 34), width: f(B.h * 0.27 + B.lw), height: f(B.h + 46), rx: 14, style: 'fill: #070B1A; fill-opacity: 0.7' }, body);
    const organs = ['lungs', 'heart', 'liver', 'pancreas'];
    const map = bodyMap({ height: B.h, stage: 'dark', organs });
    body.append(map);
    const anchors = cellInfo(map).anchors;
    // the four organs the knockout mice lose: crimson outlines + "!" badges, named on the right
    map.querySelectorAll('[data-part="organ"]').forEach((og) => {
      og.querySelectorAll('path').forEach((p) => {
        if (p.getAttribute('fill') && p.getAttribute('fill') !== 'none' && p.getAttribute('stroke')) { p.setAttribute('stroke', '#FF6B70'); p.setAttribute('stroke-width', '1.6'); }
      });
    });
    const names = { lungs: 'Lungs', heart: 'Heart', liver: 'Liver', pancreas: 'Pancreas' };
    const order = organs.map((n) => ({ n, a: anchors[n] })).sort((p, q) => p.a.y - q.a.y);
    const lx = B.h * 0.2;
    order.forEach(({ n, a }, k) => {
      const ty = -B.h * 0.28 + k * (B.h * 0.115);
      const ax = (a.pts ? Math.max(...a.pts.map((q) => q.x)) : a.x) + a.r * 0.4;
      S('path', { d: `M${f(ax)} ${f(a.y)}L${f(lx - 4)} ${f(ty)}`, style: 'fill: none; stroke: #FF6B70; stroke-opacity: 0.7; stroke-width: 1; vector-effect: non-scaling-stroke' }, body);
      const bg = S('g', { transform: `translate(${f(lx + 4)} ${f(ty)})` }, body);
      S('circle', { r: 7, style: 'fill: #E5484D; stroke: #FFFFFF; stroke-opacity: 0.75; stroke-width: 1' }, bg);
      S('text', { x: 0, y: 3.8, 'text-anchor': 'middle', text: '!', style: 'fill: #FFFFFF; font: 800 10.5px var(--font-ui)' }, bg);
      S('text', { class: 't-small t-halo', x: f(lx + 15), y: f(ty + 4), text: names[n] }, body);
    });
    label(body, { x: B.lw * 0.25, y: -B.h / 2 - 14, text: 'Organs invaded', cls: 't-small', opacity: 1 });
    A.body = body;
  }

  // ---- lens 1: the contact, magnified (custom band: CD28 and CTLA-4 compete for the same B7)
  function buildLens1(parentScene) {
    const LN = L.lens, s = LN.size, th = LN.th;
    clip1.setAttribute('x', f(-LN.w / 2)); clip1.setAttribute('y', f(-LN.h / 2));
    clip1.setAttribute('width', f(LN.w)); clip1.setAttribute('height', f(LN.h)); clip1.setAttribute('rx', 20);
    const frame = lensFrame(parentScene, LN, `${ID}-clip1`);
    setO(frame.root, 0);
    A.lens1 = frame.root;
    const gap = DOCK_GAP['cd28-b7'] * s;
    const topY = -gap / 2, bottomY = gap / 2;
    const band = S('g', { transform: 'translate(0 6)' }, frame.content);
    band.append(synapseArt({ width: LN.w + 60, gap, depth: LN.depth, thickness: th, stage: 'dark', top: { color: 'cd4' }, bottom: { color: 'dc' } }));
    const off = (k) => (gap - DOCK_GAP[k] * s) / 2;
    const apart = -0.17 * s;
    const iz = clamp(s * 0.36, 10, 15);
    const discY = topY - th - iz * 0.85;
    const vesY = topY - th - s * 0.95;
    const mk = (node, parent = band) => { const w = S('g', {}, parent); w.append(node); return w; };
    // TCR + MHC II (centre)
    const B = { s, gap, topY, bottomY, th, apart, offT: off('tcr-mhc2'), offC: off('cd28-b7'), offX: off('ctla4-b7'), discY, vesY, iz, pairs: [] };
    B.mhc = mk(mhc2({ size: s, peptide: 'foreign', stage: 'dark' }));
    B.mhc.setAttribute('transform', `translate(0 ${f(bottomY - B.offT)})`);
    B.tcr = mk(tcr({ size: s, color: 'cd4', cd3: true, stage: 'dark' }));
    B.tcrDisc = mk(signalIcon({ type: 'activating', size: iz, stage: 'dark' }));
    B.tcrDisc.setAttribute('transform', `translate(0 ${f(discY)})`);
    const vesLayer = S('g', {}, band);
    L.b7x.forEach((x, i) => {
      const P = { x, dir: i < L.b7x.length / 2 ? -1 : 1 };
      P.b7 = mk(b7({ size: s, stage: 'dark' }));
      P.cd28 = mk(cd28({ size: s, icon: false, stage: 'dark' }));
      P.ves = S('circle', { r: f(s * 0.46), opacity: 0, style: `fill: ${mix(PALETTE.cd4, '#0B1024', 0.55)}; fill-opacity: 0.6; stroke: ${mix(PALETTE.cd4, '#FFFFFF', 0.45)}; stroke-width: 1.2` }, vesLayer);
      P.endo = S('circle', { r: f(s * 0.62), opacity: 0, style: `fill: none; stroke: ${mix(PALETTE.cd4, '#FFFFFF', 0.45)}; stroke-width: 1.3; stroke-dasharray: 3 2` }, vesLayer);
      P.ctla = mk(ctla4({ size: s, icon: false, stage: 'dark' }));
      P.plus = mk(signalIcon({ type: 'activating', size: iz, stage: 'dark' }));
      P.minus = mk(signalIcon({ type: 'inhibitory', size: iz, stage: 'dark' }));
      P.vx = x + (i % 2 ? -0.32 : 0.32) * s;
      P.vy = vesY - (i % 3) * s * 0.18;
      B.pairs.push(P);
    });
    frame.rim();
    // labels inside the window
    const lab = S('g', {}, frame.root);
    const Lb = L.lab, short = layoutName !== 'wide';
    const x2 = L.b7x[2], x5 = L.b7x[5], xb = L.b7x[Lb.b7], xc = L.b7x[Lb.count];
    S('text', { class: 't-caps', x: f(-LN.w / 2 + 14), y: f(-LN.h / 2 + Lb.cap), text: 'T cell', style: 'fill: var(--fg-3)' }, lab);
    S('text', { class: 't-caps', x: f(-LN.w / 2 + 14), y: f(LN.h / 2 - Lb.cap + 8), text: 'Dendritic cell', style: 'fill: var(--fg-3)' }, lab);
    B.lab = {
      cd28: label(lab, { x: x2, y: Lb.top, text: 'CD28', cls: 't-small', opacity: 1, leader: [x2, topY - th - 2 + 6] }),
      tcr: label(lab, { x: 0, y: Lb.top, text: short ? 'TCR' : 'Receptor', cls: 't-small', opacity: 1, leader: [0, topY - th - 2 + 6] }),
      ctla: label(lab, { x: x5, y: Lb.top, text: 'CTLA-4', cls: 't-small', leader: [x5 + (short ? 4 : 8), vesY - 4 + 6] }),
      b7: label(lab, { x: xb, y: Lb.bot, text: 'B7', cls: 't-small', opacity: 1, leader: [xb, bottomY + th + 2 + 6] }),
      mhc: label(lab, { x: 0, y: Lb.bot, text: short ? 'MHC II' : 'Peptide on MHC II', cls: 't-small', opacity: 1, leader: [0, bottomY + th + 2 + 6] }),
    };
    B.count = S('text', { class: 't-label t-num t-halo', x: f(xc + (short ? 0 : 20)), y: f(Lb.bot), 'text-anchor': 'middle', text: 'B7: 8' }, lab);
    // leader from the contact in the node to the window
    const ld = S('g', { opacity: 0 }, parentScene);
    const src = A.contact;
    const ex = clamp(src[0], LN.x - LN.w / 2 + 30, LN.x + LN.w / 2 - 30), ey = LN.y + LN.h / 2 + 6;
    S('line', { x1: f(ex), y1: f(ey), x2: f(src[0] + (ex - src[0]) * 0.06), y2: f(src[1] + (ey - src[1]) * 0.06), style: 'stroke: var(--fg-2); stroke-opacity: 0.55; stroke-width: 1.1; vector-effect: non-scaling-stroke' }, ld);
    S('circle', { cx: f(src[0]), cy: f(src[1]), r: 9, style: 'fill: none; stroke: var(--fg-2); stroke-opacity: 0.8; stroke-width: 1.2' }, ld);
    parentScene.insertBefore(ld, frame.root);
    A.leader1 = ld;
    A.B = B;
    A.plan.band = bandState('rest');
    renderBand(A.plan.band);
  }

  /** Band states: numbers only, so any two can be interpolated. */
  function bandState(name) {
    const n = L.b7x.length;
    const st = { tcr: 0, cd28e: Array(n).fill(0), cd28d: Array(n).fill(0), ct: Array(n).fill(0), endo: Array(n).fill(0), lab: 0, cut: 0 };
    const CT = [0, 1, 3, 4, 6, 7];          // CTLA-4 takes six of the eight B7
    const ENDO = [0, 3, 4, 7];              // and drags four of them into the T cell
    if (name === 'rest') return st;
    st.tcr = 1;
    st.cd28e.fill(1);
    if (name === 's1' || name === 'ko1') return st;
    CT.forEach((i) => { st.ct[i] = 2; st.cd28e[i] = 0; st.cd28d[i] = 1; });
    st.lab = 1;
    if (name === 's2') return st;
    ENDO.forEach((i) => { st.endo[i] = 1; });
    return st;   // 's3'
  }
  function renderBand(st) {
    const B = A.B;
    const { s, topY, bottomY, th, apart } = B;
    B.tcr.setAttribute('transform', `translate(0 ${f(topY + lerp(apart, B.offT, st.tcr))}) rotate(${f(180 + 10 * (1 - st.tcr))})`);
    setO(B.tcrDisc, seg(st.tcr, 0.55, 1));
    B.pairs.forEach((P, i) => {
      const e = st.cd28e[i], d = st.cd28d[i], c = st.ct[i], k = st.endo[i];
      // CD28: engaged ↔ apart; displaced sideways when CTLA-4 takes its B7
      const cx = P.x + P.dir * d * 0.42 * s;
      const tilt = (1 - e) * 12 * P.dir + d * 10 * P.dir;
      P.cd28.setAttribute('transform', `translate(${f(cx)} ${f(topY + lerp(apart, B.offC, e))}) rotate(${f(180 + tilt)})`);
      setO(P.plus, seg(e, 0.55, 1));
      P.plus.setAttribute('transform', `translate(${f(P.x)} ${f(B.discY)})`);
      // CTLA-4: hidden (0) → in a vesicle (1) → at the membrane, gripping B7 (2)
      const k1 = easeInOut(seg(k, 0, 0.6));
      const rise = k1 * (th + s * 0.75);
      if (c <= 1) {
        P.ctla.setAttribute('transform', `translate(${f(P.vx)} ${f(P.vy)}) rotate(${f(180 + (P.dir * 28))}) scale(0.5)`);
        setO(P.ctla, c);
        P.ves.setAttribute('cx', f(P.vx)); P.ves.setAttribute('cy', f(P.vy - s * 0.12));
        setO(P.ves, c * 0.9);
      } else {
        const q = easeInOut(c - 1);
        const x = lerp(P.vx, P.x, q), y = lerp(P.vy, topY + B.offX, q) - rise;
        P.ctla.setAttribute('transform', `translate(${f(x)} ${f(y)}) rotate(${f(180 + P.dir * 28 * (1 - q))}) scale(${f(lerp(0.5, 1, q) * (1 - 0.6 * seg(k, 0.6, 1)))})`);
        setO(P.ctla, 1 - seg(k, 0.72, 1));
        P.ves.setAttribute('cx', f(lerp(P.vx, P.x, q))); P.ves.setAttribute('cy', f(lerp(P.vy - s * 0.12, topY - th * 0.5, q)));
        setO(P.ves, 0.9 * (1 - seg(q, 0.45, 0.9)));
      }
      P.minus.setAttribute('transform', `translate(${f(P.x)} ${f(B.discY)})`);
      setO(P.minus, seg(c, 1.6, 2) * (1 - seg(k, 0, 0.3)));
      // B7: seated on the DC; endocytosis lifts it into the T cell with CTLA-4, then it dissolves
      const by = bottomY - rise;
      P.b7.setAttribute('transform', `translate(${f(P.x)} ${f(by)}) scale(${f(1 - 0.6 * seg(k, 0.6, 1))})`);
      setO(P.b7, 1 - seg(k, 0.72, 1));
      P.endo.setAttribute('cx', f(P.x)); P.endo.setAttribute('cy', f(topY - th - s * 0.12 - rise * 0.5));
      setO(P.endo, seg(k, 0.4, 0.62) * (1 - seg(k, 0.8, 1)));
    });
    setO(B.lab.ctla, st.lab);
    // a "cut" (0 → 1 → 0) veils the band while a knockout replaces it with another mouse's
    const band = B.tcr.parentNode;
    setO(band, 1 - 0.85 * Math.sin(Math.PI * clamp(st.cut, 0, 1)));
  }
  function bandTo(tl, name, pos, duration = 1.4, { stagger = 0.08, cut = false } = {}) {
    const a = A.plan.band, b = bandState(name);
    A.plan.band = b;
    const n = L.b7x.length;
    CA.drive(tl, (p) => {
      if (cut) {   // veil, swap at the darkest point, unveil
        const st = p < 0.5 ? a : b;
        renderBand({ ...st, cut: p });
        return;
      }
      const span = 1 - stagger * (n - 1);
      const st = { cut: 0 };
      const q0 = easeInOut(p);
      st.tcr = lerp(a.tcr, b.tcr, q0);
      st.lab = lerp(a.lab, b.lab, q0);
      ['cd28e', 'cd28d', 'ct', 'endo'].forEach((key) => {
        st[key] = a[key].map((v, i) => lerp(v, b[key][i], clamp((p - stagger * i) / span, 0, 1)));
      });
      renderBand(st);
    }, { duration, pos });
  }

  // ------------------------------------------------------------------ scene 2: tissue
  function tissueArt(i, exposed) {
    const T = L.tissue;
    const infected = T.infected.includes(i);
    const art = healthyCell({
      r: T.r, seed: 20 + i, state: infected ? 'infected' : 'healthy', stage: 'dark',
      mhc: exposed ? 10 : 6, peptides: infected ? ['self', 'viral', 'self'] : ['self'],
    });
    if (exposed) {
      placeOnMembrane(art, (o) => pdl1(o), { count: 4, size: clamp(T.r * 0.28, 9, 15), seed: 20 + i, offset: 0.2, layer: 'pdl1' });
    }
    return art;
  }
  function drawTissue(g) {
    const T = L.tissue, [W, H] = L.vb;
    g.append(tissueField({ x: 0, y: L.node.y - 30, width: W, height: H - L.node.y + 30, seed: 9, stage: 'dark', density: 0.7 }));
    S('text', { class: 't-caps', x: W - 14, y: L.node.y + 4, 'text-anchor': 'end', text: 'Infected tissue', style: 'fill: var(--fg-3)' }, g);
    A.cells = T.xs.map((x, i) => CA.rig(tissueArt(i, false), { x, y: T.y, parent: g, seed: 20 + i }));
    A.cellsX = T.xs.map((x, i) => tissueArt(i, true));
    // damage overlays for the knockout (healthy neighbours near the attack)
    A.damage = T.near.map((i) => {
      const R = A.cells[i];
      const mem = R.art.querySelector('path.sao-membrane');
      const grp = S('g', { opacity: 0 }, R.layers.inner);
      if (mem) S('path', { d: mem.getAttribute('d'), style: 'fill: #090D1C; fill-opacity: 0.52' }, grp);
      const r = T.r;
      const crack = (a0, len) => {
        const pts = [];
        for (let k = 0; k <= 4; k++) {
          const t = k / 4;
          const rr = r * (0.98 - t * len);
          const a = (a0 + (k % 2 ? 9 : -7) * t) * DEG;
          pts.push(`${f(Math.cos(a) * rr)} ${f(Math.sin(a) * rr)}`);
        }
        S('path', { d: `M${pts.join('L')}`, style: 'fill: none; stroke: #120E06; stroke-width: 3; stroke-linejoin: round; stroke-linecap: round' }, grp);
        S('path', { d: `M${pts.join('L')}`, style: 'fill: none; stroke: #F3DDBF; stroke-opacity: 0.65; stroke-width: 1' }, grp);
      };
      crack(-120, 0.45); crack(-40, 0.38); crack(150, 0.32);
      return grp;
    });
    // the killer T cell with PD-1 (unengaged)
    const kArt = tCell({ variant: 'cd8', r: L.kR, seed: 21, state: 'activated', polarity: 0, stage: 'dark' });
    placeOnMembrane(kArt, (o) => pd1({ ...o, icon: false }), { count: 7, size: clamp(L.kR * 0.5, 9, 13), seed: 4, offset: 0.12, layer: 'pd1' });
    A.k = CA.rig(kArt, { x: L.k0[0], y: L.k0[1], parent: g, seed: 21 });
    CA.unpolarize(A.k, { angle: 180 });
    A.kPd1 = kArt.querySelector('[data-part="pd1"]');
    A.fx2 = CA.fxLayer(g);
    A.lab2 = {
      killer: label(A.k.layers.over, { x: 0, y: -L.kR * 1.18 - 14, text: 'Killer T cell', cls: 't-small', opacity: 0 }),
      enough: label(g, { x: L.enough.x, y: L.enough.y, text: 'PD-L1 feedback slows the attack', cls: 't-label' }),
      infected: label(g, { x: T.xs[T.infected[0]] + T.r * 0.9, y: T.y - T.r - 12, text: 'Infected cell', anchor: 'start', cls: 't-small', opacity: 1 }),
    };
    // a brief, non-lasting PD-1 contact mark (cell scale): "−" on the T-cell side
    A.touch = S('g', { opacity: 0 }, A.fx2);
    A.touch.append(signalIcon({ type: 'inhibitory', size: 15, stage: 'dark' }));
    buildLens2(g);
  }

  function buildLens2(g) {
    const LN = L.lens, s = LN.size;
    const frame = lensFrame(g, LN, `${ID}-clip1`);
    const P2 = L.lens2.pairs;
    A.syn2 = synapseScene(frame.content, {
      ctx, x: 0, y: 6, width: LN.w + 60, size: s, depth: LN.depth, seed: 9, stage: 'dark',
      top: { color: 'cd8' }, bottom: { color: 'healthy' },
      pairs: [{ kind: 'tcr-mhc', x: P2.tcr, peptide: 'viral' }, { kind: 'pd1-pdl1', x: P2.pd1 }],
    });
    frame.rim();
    A.pdl1G = A.syn2.pairs['pd1-pdl1'].map((P) => P.bottom);
    A.pd1G = A.syn2.pairs['pd1-pdl1'].map((P) => P.top);
    renderPdl1(0);
    const { topY, bottomY } = A.syn2.info;
    const Lb = L.lab, short = layoutName !== 'wide';
    const lab = S('g', {}, frame.root);
    const cx = (P2.pd1[1] + P2.pd1[2]) / 2, tx = (P2.tcr[0] + P2.tcr[1]) / 2;
    S('text', { class: 't-caps t-end', x: f(LN.w / 2 - 14), y: f(-LN.h / 2 + Lb.cap), text: 'Killer T cell', style: 'fill: var(--fg-3)' }, lab);
    S('text', { class: 't-caps t-end', x: f(LN.w / 2 - 14), y: f(LN.h / 2 - Lb.cap + 8), text: 'Infected cell', style: 'fill: var(--fg-3)' }, lab);
    label(lab, { x: tx, y: Lb.top, text: 'Receptor', cls: 't-small', opacity: 1, leader: [tx, topY - 14 + 6] });
    A.lab2.pd1 = label(lab, { x: cx, y: Lb.top, text: 'PD-1', cls: 't-small', opacity: 1, leader: [P2.pd1[1], topY - 14 + 6] });
    A.lab2.nopd1 = label(lab, { x: cx, y: Lb.top, text: 'No PD-1', cls: 't-small' });
    label(lab, { x: tx, y: Lb.bot, text: short ? 'Viral peptide' : 'Viral peptide on MHC I', cls: 't-small', opacity: 1, leader: [tx, bottomY + 14 + 6] });
    A.lab2.pdl1 = label(lab, { x: cx, y: Lb.bot, text: 'PD-L1', cls: 't-small', leader: [P2.pd1[2], bottomY + 14 + 6] });
    A.lens2 = frame.root;
  }
  /** PD-L1 on the tissue side: 0 = not displayed yet, 1 = displayed (IFN-γ). */
  function renderPdl1(v) {
    A.pdl1G.forEach((gl, i) => {
      const q = easeOut(seg(v, i * 0.12, 0.64 + i * 0.12));
      gl.setAttribute('transform', `scale(${f(Math.max(0.01, q))})`);
      setO(gl, q);
    });
  }
  function pdl1To(tl, v1, pos, duration = 1.4) {
    const v0 = A.plan.pdl1;
    A.plan.pdl1 = v1;
    CA.drive(tl, (p) => renderPdl1(lerp(v0, v1, p)), { duration, pos });
  }
  /** PD-1 on the T cell (lens + cell): 1 present, 0 absent (knockout). */
  function pd1To(tl, v1, pos, duration = 1.0) {
    const v0 = A.plan.pd1on;
    A.plan.pd1on = v1;
    CA.drive(tl, (p) => {
      const v = lerp(v0, v1, easeInOut(p));
      A.pd1G.forEach((gl) => setO(gl, v));
      setO(A.kPd1, v);
      setO(A.lab2.pd1, v);
      setO(A.lab2.nopd1, 1 - v);
    }, { duration, pos });
  }
  function sceneTo(tl, k, pos) {
    const k0 = A.plan.scene;
    A.plan.scene = k;
    CA.drive(tl, (p) => { const v = lerp(k0, k, easeInOut(p)); setO(A.s1, 1 - v); setO(A.s2, v); }, { duration: 1.1, pos });
  }

  // ------------------------------------------------------------------ cell-scale beats
  /** Divide every rig at once; returns the daughters. */
  function divideAll(tl, list, spec, pos, duration = 1.3) {
    const out = [];
    let at = pos;
    list.forEach((R, i) => {
      const d = CA.divide(tl, R, 2, { ...spec, duration, pos: at });
      if (i === 0) at = d.span.start;
      out.push(...d);
    });
    return out;
  }
  function spillIn(tl, pos) {
    const D = 3.6;
    CA.drive(tl, (p) => {
      A.spill.forEach((c) => {
        const q = easeOut(seg(p, c.t * 0.55, c.t * 0.55 + 0.45));
        setO(c.w, q);
        c.inner.setAttribute('transform', `scale(${f(lerp(0.2, 1, q))})`);
      });
    }, { duration: D, pos });
  }
  /** The T cell's look tracks its net activity: a touch smaller when braked, larger when unchecked. */
  function sizeTo(tl, R, key, v1, pos, duration = 1.2) {
    const v0 = A.plan[key] ?? 1;
    A.plan[key] = v1;
    CA.drive(tl, (p) => R.layers.idle.setAttribute('transform', `scale(${f(lerp(v0, v1, easeInOut(p)))})`), { duration, pos });
  }
  const speedDur = (a, b) => clamp(Math.hypot(b[0] - a[0], b[1] - a[1]) / 170, 0.6, 4);   // one crawl speed throughout (PD-1 never slows it)

  // ------------------------------------------------------------------ steps
  const steps = [
    { // 1 · signal 1 + signal 2: the T cell activates and photocopies itself
      enter(tl) {
        clockTo(tl, 0, 0, 0);
        fade(tl, [A.lens1, A.leader1], 0, 1, 0.1, 0.7);
        focusTo(tl, 'lens', 0.1);          // signals 1 and 2 meet in the window…
        focusTo(tl, 'cells', 2.3);         // …then the node: activation and photocopying
        bandTo(tl, 's1', 0.7, 1.4, { stagger: 0.06 });
        CA.recognize(tl, A.T, A.dc, { badge: false, duration: 1.6, pos: 0.7 });
        A.ledger.set(LEDGER.s1, { tl, pos: 1.4, duration: 1.0 });
        fade(tl, A.lab1.t, 1, 0, 2.2, 0.4);
        CA.swap(tl, A.T, A.Tact, { duration: 1.0, pos: 2.3 });
        CA.move(tl, A.T, { x: L.cluster.x, y: L.cluster.y, duration: 1.3, pos: 3.1 });
        const g1 = divideAll(tl, [A.T], L.div[0], 4.4, 1.1);
        const g2 = divideAll(tl, g1, L.div[1], 5.5, 1.1);
        A.clone = divideAll(tl, g2, L.div[2], 6.6, 1.1);
        // one copy goes back to the dendritic cell: the contact the window keeps magnifying
        const near = A.clone.reduce((b, R) => (Math.hypot(R.plan.x - A.contact[0], R.plan.y - A.contact[1]) < Math.hypot(b.plan.x - A.contact[0], b.plan.y - A.contact[1]) ? R : b));
        CA.approach(tl, near, A.dc, { gap: 1, angle: A.dock.a, duration: 1.3, pos: 7.8 });
        A.near = near;
        A.plan.size1 = 1;
        fade(tl, A.lab1.clone, 0, 1, 7.4);
      },
    },
    { // 2 · CTLA-4 arrives (vesicles → contact face) and out-competes CD28 for B7
      enter(tl) {
        clockTo(tl, 0, 1, 0.1);
        focusTo(tl, 'lens', 0.1);
        bandTo(tl, 's2', 0.3, 3.4, { stagger: 0.07 });
        sizeTo(tl, A.near, 'size1', 0.93, 1.8);
        A.ledger.set(LEDGER.s2, { tl, pos: 1.8, duration: 1.4 });
      },
    },
    { // 3 · CTLA-4 strips B7 off the dendritic cell; the response levels off
      enter(tl) {
        clockTo(tl, 1, 2, 0.1);
        focusTo(tl, 'lens', 0.1);
        focusTo(tl, 'ledger', 2.4);        // the response levels off
        bandTo(tl, 's3', 0.3, 3.0, { stagger: 0.12 });
        sizeTo(tl, A.near, 'size1', 0.88, 2.0);
        textTo(tl, A.B.count, (v) => `B7: ${v}`, 8, 4, 1.2, 1.8);
        A.ledger.set(LEDGER.s3, { tl, pos: 2.0, duration: 1.2 });
      },
    },
    { // 4 · Knockout: no CTLA-4 (default) — or the normal mouse (= step 3)
      enter(tl) {
        if (!ko1) { tl.to({}, { duration: 0.4 }); return; }
        focusTo(tl, 'cells', 0.1);
        bandTo(tl, 'ko1', 0.1, 1.4, { cut: true });
        sizeTo(tl, A.near, 'size1', 1.08, 1.0);
        textTo(tl, A.B.count, (v) => `B7: ${v}`, 4, 8, 0.75, 0.05);
        A.ledger.set(LEDGER.ko1, { tl, pos: 1.0, duration: 1.6 });
        fade(tl, A.lab1.clone, 1, 0, 0.6, 0.4);
        spillIn(tl, 0.8);
        fade(tl, A.lab1.many, 0, 1, 2.6);
        fade(tl, A.body, 0, 1, 3.0, 0.9);
      },
    },
    { // 5 · Tissue: kill → IFN-γ → PD-L1 → PD-1 engages; fewer lasting contacts
      enter(tl) {
        const T = L.tissue;
        const c1 = A.cells[T.infected[0]], c2 = A.cells[T.infected[1]];
        sceneTo(tl, 1, 0);
        focusTo(tl, 'cells', 0);
        clockTo(tl, 2, 3, 0.4);
        A.ledger.set(LEDGER.rest, { tl, pos: 0.2, duration: 0.8 });
        // (a) Hours 0–6: stop, kill, release IFN-γ
        fade(tl, A.lab2.killer, 0, 1, 0.5);
        const ap = CA.approach(tl, A.k, c1, { gap: 2, angle: -90, duration: speedDur(L.k0, [c1.plan.x, c1.plan.y - 80]), pos: 0.3 });
        A.syn2.engage('tcr-mhc', true, { tl, pos: ap.end - 0.4, duration: 1.0, stagger: 0.15 });
        CA.recognize(tl, A.k, c1, { badge: false, duration: 1.4, pos: ap.end - 0.2 });
        A.ledger.set(LEDGER.s5a, { tl, pos: ap.end, duration: 0.9 });
        // granules swing to the contact as recognition starts, so kill() needn't aim again (-1.4 s)
        CA.polarize(tl, A.k, c1, { duration: 1.2, pos: ap.end + 0.1 });
        const kl = CA.kill(tl, A.k, c1, { duration: 1.9, pos: ap.end + 0.4 });
        fade(tl, A.lab2.infected, 1, 0, ap.end + 1.2);
        CA.emit(tl, A.k, { kind: 'interferon', color: PALETTE.cd8, n: 18, r: layoutName === 'wide' ? 330 : 190, size: 10, duration: 3.4, seed: 3, pos: kl.marks.fired });
        // (b) Hours 6–24: neighbours display PD-L1 and extra MHC
        const tB = kl.marks.released + 0.2;   // neighbours respond while the killer lets go
        clockTo(tl, 3, 4, tB);
        const order = A.cells.map((R, i) => ({ R, i, d: Math.abs(R.plan.x - c1.plan.x) })).sort((p, q) => p.d - q.d);
        order.forEach(({ R, i, d }) => { if (i !== T.infected[0]) CA.swap(tl, R, A.cellsX[i], { duration: 1.0, pos: tB + 0.2 + d / 700 }); });
        A.syn2.engage('tcr-mhc', false, { tl, pos: tB, duration: 0.6 });
        pdl1To(tl, 1, tB + 0.6, 1.6);
        fade(tl, A.lab2.pdl1, 0, 1, tB + 1.2);
        // (c) Days 1–2: PD-1 engages; the T cell keeps crawling, makes only a brief contact, kills less
        const tC = tB + 1.7;   // the T cell crawls on while PD-L1 comes up
        clockTo(tl, 4, 5, tC);
        const at5 = [c2.plan.x - L.kR * 0.3, L.rowY];
        const m1 = CA.move(tl, A.k, { x: at5[0], y: at5[1], duration: speedDur([A.k.plan.x, A.k.plan.y], at5), pos: tC });
        A.syn2.engage('tcr-mhc', true, { tl, pos: m1.end - 0.5, duration: 0.6 });
        A.syn2.engage('pd1-pdl1', true, { tl, pos: m1.end - 0.4, duration: 1.0, stagger: 0.12 });
        focusTo(tl, 'lens', m1.end - 0.8);           // PD-1 meets PD-L1, magnified
        focusTo(tl, 'cells', m1.end + 1.5);          // …and the T cell crawls on
        // brief touch: "−" at the contact, then on at the same speed
        const tp = [c2.plan.x - L.kR * 0.3, c2.plan.y - L.tissue.r - 2];
        A.touch.setAttribute('transform', `translate(${f(tp[0] - 14)} ${f(tp[1] - 10)})`);
        CA.drive(tl, (p) => setO(A.touch, Math.sin(Math.PI * p)), { duration: 1.4, pos: m1.end - 0.6 });
        CA.emit(tl, A.k, { kind: 'interferon', color: PALETTE.cd8, n: 4, r: 90, size: 9, duration: 2.0, seed: 5, pos: m1.end - 0.4 });
        const to = [L.pass, L.rowY];
        CA.move(tl, A.k, { x: to[0], y: to[1], duration: speedDur(at5, to), pos: m1.end });
        A.ledger.set(LEDGER.s5c, { tl, pos: m1.end - 0.3, duration: 1.4 });
        sizeTo(tl, A.k, 'size2', 0.9, m1.end);
        fade(tl, A.lab2.enough, 0, 1, m1.end + 0.8, 0.7);
      },
    },
    { // 6 · Knockout: no PD-1 (default) — or the normal mouse (= step 5)
      enter(tl) {
        if (!ko2) { tl.to({}, { duration: 0.4 }); return; }
        const T = L.tissue;
        const c2 = A.cells[T.infected[1]];
        focusTo(tl, 'lens', 0);                      // PD-1 is gone from the window
        focusTo(tl, 'cells', 1.5);                   // the attack goes on; neighbours are hurt
        fade(tl, A.lab2.enough, 1, 0, 0, 0.4);
        A.syn2.engage('pd1-pdl1', false, { tl, pos: 0, duration: 0.7 });
        pd1To(tl, 0, 0.5, 1.0);
        A.ledger.set(LEDGER.ko2, { tl, pos: 0.8, duration: 1.2 });
        sizeTo(tl, A.k, 'size2', 1.05, 0.8);
        // no brake: it stops on the infected cell and attacks; neighbours get hurt
        const ap = CA.approach(tl, A.k, c2, { gap: 2, angle: -90, duration: speedDur([A.k.plan.x, A.k.plan.y], [c2.plan.x, c2.plan.y - 80]), pos: 0.6 });
        CA.recognize(tl, A.k, c2, { badge: false, duration: 1.3, pos: ap.end - 0.2 });
        const kl = CA.kill(tl, A.k, c2, { duration: 2.4, pos: ap.end + 0.4 });
        CA.emit(tl, A.k, { kind: 'interferon', color: PALETTE.cd8, n: 18, r: layoutName === 'wide' ? 300 : 180, size: 10, duration: 3.2, seed: 7, pos: kl.marks.fired });
        A.damage.forEach((d, i) => fade(tl, d, 0, 1, kl.marks.fired + 0.6 + i * 0.4, 1.4));
      },
    },
  ];

  // ------------------------------------------------------------------ controls
  // knockout bar under the caption: scene tabs (after the tour) + one toggle per brake + the fact chip
  const bar = ctx.h('div', { class: 'br-bar' });
  const sceneSeg = ctx.ui.segmented({
    label: 'Scene', parent: bar, value: 'node',
    options: [{ value: 'node', label: 'Lymph node' }, { value: 'tissue', label: 'Tissue' }],
    onChange: (v) => stepper.go(v === 'node' ? 3 : 5),
  });
  const ko1Seg = ctx.ui.segmented({
    label: 'CTLA-4', parent: bar, value: 'ko',
    options: [{ value: 'normal', label: 'Normal mouse' }, { value: 'ko', label: 'No CTLA-4' }],
    onChange: (v) => setKO(1, v === 'ko'),
  });
  const ko2Seg = ctx.ui.segmented({
    label: 'PD-1', parent: bar, value: 'ko',
    options: [{ value: 'normal', label: 'Normal mouse' }, { value: 'ko', label: 'No PD-1' }],
    onChange: (v) => setKO(2, v === 'ko'),
  });
  const chip = ctx.h('p', { class: 'br-chip', 'aria-live': 'polite' });
  bar.append(chip);

  const stepper = ctx.ui.stepper({
    steps,
    reset: draw,
    dwell: (i) => (i === 3 || i === 5 ? 6 : 4.5),
    onChange(i) { syncBar(i); },
    onComplete() { unlocked = true; syncBar(stepper ? stepper.index : 5); },
  });
  ctx.caption.append(bar);

  function syncBar(i) {
    sceneSeg.el.hidden = !unlocked;
    sceneSeg.set(i <= 3 ? 'node' : 'tissue');
    ko1Seg.el.hidden = !(unlocked || i === 3);
    ko2Seg.el.hidden = !(unlocked || i === 5);
    ko1Seg.set(ko1 ? 'ko' : 'normal');
    ko2Seg.set(ko2 ? 'ko' : 'normal');
    const html = i === 3 && ko1 ? CHIPS.ko1 : i === 5 && ko2 ? CHIPS.ko2 : '';
    chip.innerHTML = html;
    chip.hidden = !html;
    bar.hidden = !(unlocked || i === 3 || i === 5);
    if (i <= 3) iB7.removeAttribute('data-off'); else iB7.setAttribute('data-off', '');
  }

  /** Flip a knockout: rebuild the timeline with the new variant and show it (animated when turning it on). */
  function setKO(which, on) {
    if (which === 1) ko1 = on; else ko2 = on;
    const target = which === 1 ? 3 : 5;
    stepper.rebuild();
    if (stepper.index !== target) { stepper.go(target); return; }
    syncBar(target);
    ctx.announce(on ? (which === 1 ? 'Showing a mouse without CTLA-4' : 'Showing a mouse without PD-1') : 'Showing a normal mouse');
    if (ctx.reducedMotion) return;
    const tl = stepper.timeline;
    if (on) {
      const t0 = tl.labels[`s${target}:start`] ?? 0, t1 = tl.labels[`s${target}`];
      tl.seek(t0, true);
      gsap.to(tl, { time: t1, duration: t1 - t0, ease: 'none', overwrite: true });
    } else {
      gsap.fromTo(svg, { opacity: 0.15 }, { opacity: 1, duration: 0.45, ease: 'power1.out', clearProps: 'opacity' });
    }
  }

  // ------------------------------------------------------------------ i-chip placement
  function placeI() {
    const LN = L.lens, [W, H] = L.vb;
    // phones: the chip sits LEFT of "B7" (on the right it touched both the label and the "B7: 8" counter)
    const x = LN.x + L.b7x[L.lab.b7] + (layoutName === 'wide' ? 26 : -27), y = LN.y + L.lab.bot - 5;
    iB7.style.left = `${((x / W) * 100).toFixed(1)}%`;
    iB7.style.top = `${((y / H) * 100).toFixed(1)}%`;
  }

  ctx.onResize(({ compact }) => {
    const next = compact ? 'compact' : 'wide';
    if (next === layoutName) return;
    layoutName = next;
    stepper.rebuild();
  });

  return {
    destroy() {
      ambients.forEach((t) => t.kill());
      if (A.syn2) A.syn2.destroy();
      iB7.remove(); iWhere.remove(); bar.remove();
    },
  };
}
