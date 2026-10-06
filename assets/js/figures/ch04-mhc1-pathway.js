// ch04-mhc1-pathway — "The shop window" (stepper, dark stage).
//
// A body cell in cross-section runs a short production line: proteins → shredder
// (proteasome) → fragments (most destroyed) → gate (TAP) → loading bay (ER) where empty
// MHC class I cups test peptides → loaded cups travel to the membrane and face outward →
// an activated killer T cell reads the display by touch. Four scenarios (healthy / virus /
// mutated / shuttered) rebuild the stepper; a persistent "What's in the window" readout
// shows twelve stylized slots.
//
// Vocabulary (FIGURE-AUDIT §4): MHC-I + peptide = art mhc1 with pockets (identical to
// ch02-nk-missing-self and ch04-cross-presentation); self peptides sand; neo hot pink + glow;
// viral peptides red-coral in THIS figure only, always with their origin icon (rule 3).
// Shuttered = absent cups on the surface, never empty ones. Recognition = cell-actions
// recognize() (rule 5). No killing here (that is Chapter 5).
import {
  tCell, nkCell, mhc1, proteasome, vesicle, tapGate, virus, peptideChain,
  cellInfo, rayHit, PALETTE, mix, tones, dotGlow, nucleusFill, linear, el, rng, blobRadius, polarPoints,
  smoothPath,
} from '../art/index.js';
import { rig, move, recognize, fxLayer } from './shared/cell-actions.js';

const DEG = Math.PI / 180;
const POCKETS = ['square', 'square'];       // same grooves as ch02-nk-missing-self / ch04-cross-presentation
const FIT = ['square', 'square'];
const SLOT = 8;                              // the membrane slot the tracked cup travels to
const WHITE = '#FFFFFF';
const BG = '#0B1024';

const SCENARIOS = [
  { value: 'healthy', label: 'Healthy' },
  { value: 'virus', label: 'Virus-infected' },
  { value: 'mutated', label: 'Mutated (cancer)' },
  { value: 'shuttered', label: 'Window shuttered' },
];

/** What the twelve display slots hold in each scenario (null = no cup at all). */
function display(scen) {
  if (scen === 'shuttered') return Array(12).fill(null);
  const d = Array(12).fill('self');
  if (scen === 'virus') { d[SLOT] = 'viral'; d[SLOT + 2] = 'viral'; }
  if (scen === 'mutated') d[SLOT] = 'neo';
  return d;
}
const special = (scen) => (scen === 'virus' ? 'viral' : scen === 'mutated' ? 'neo' : 'self');
const PEP = { self: PALETTE.selfPeptide, viral: PALETTE.virus, neo: PALETTE.foreignPeptide };
const mhcPeptide = (kind) => (kind === 'viral' ? PALETTE.virus : kind === 'neo' ? 'neo' : 'self');

// ------------------------------------------------------------------ layouts
// Everything is placed in viewBox units; 'wide' ≥ 700 px stage, 'tall' below (portrait, the
// production line runs top → bottom and the T-cell lane is pinned to the bottom edge).
const LAYOUTS = {
  wide: {
    vb: [1000, 640], side: 'top',
    mem: { y0: 178, sag: 22, cx: 500, half: 500 },
    cup: 42, cupX: (i) => 236 + i * 56,
    lane: { y: 76, x0: 70, step: 18 }, tR: 30, tPol: 90,
    proteins: [[168, 318], [150, 372], [104, 300], [96, 356], [122, 414]], protR: 4.3,
    prot: { x: 300, y: 342, size: 72, rot: 90 }, protIn: [236, 342], protOut: [360, 342],
    frags: [[386, 290, -8], [452, 276, 10], [516, 294, -4], [392, 336, 14], [452, 334, -12], [512, 352, 6], [384, 384, 6], [446, 392, -6], [510, 408, -14], [424, 434, 8]],
    fragR: 2.9, A: 5, B: 8,
    er: { x: 776, y: 366, w: 340, h: 200, seed: 3 }, gateAngle: 180, gateRot: -90, gate: 44,
    erCup: 50, erCups: [[690, 440], [772, 446], [854, 440]], load: 0, hoverDy: -64,
    nucleus: { x: 112, y: 612, r: 120 },
    virus: [[58, 252, 14], [228, 262, 6], [70, 470, 5]],
    labels: {
      proteins: { x: 134, y: 262 },
      shredder: { x: 300, y: 410, chip: 'an enzyme complex that cleaves proteins into short peptides' },
      gate: { x: 586, y: 302, chip: 'transporter associated with antigen processing', leader: 'gate' },
      bay: { x: 800, y: 300, chip: 'the compartment where MHC class I is assembled and loaded' },
      empty: { x: 800, y: 324, small: true },
      shop: { x: 930, y: 118, chip: 'molecular name: MHC class I', leader: 'cup11' },
      note1: { x: 456, y: 474, small: true }, note2: { x: 456, y: 492, small: true },
      blocked: { x: 520, y: 470, small: true },
      none: { x: 520, y: 222, small: true },
      report: { x: 684, y: 26, small: true },
      missing: { x: 700, y: 126, anchor: 'start' },
    },
    nk: { from: [1090, 84], to: 7 }, tLabel: 'right',
  },
  tall: {
    vb: [420, 770], side: 'bottom',
    mem: { y0: 614, sag: 14, cx: 210, half: 210 },
    cup: 28, cupX: (i) => 45 + i * 30,
    lane: { y: 708, x0: 40, step: 10 }, tR: 26, tPol: -90,
    proteins: [[70, 124], [104, 112], [36, 74], [80, 70], [124, 64]], protR: 3.7,
    prot: { x: 96, y: 206, size: 54, rot: 90 }, protIn: [46, 206], protOut: [150, 206],
    frags: [[210, 146, -8], [282, 132, 10], [354, 146, 6], [214, 192, 14], [292, 184, -12], [262, 232, 6], [368, 198, -6], [196, 238, 8], [338, 242, -10], [346, 100, 4]],
    fragR: 2.5, A: 5, B: 8,
    er: { x: 222, y: 400, w: 330, h: 172, seed: 3 }, gateAngle: -90, gateRot: 0, gate: 34,
    erCup: 40, erCups: [[150, 462], [222, 468], [294, 462]], load: 2, hoverDy: -50,
    nucleus: { x: -8, y: 560, r: 64 },
    virus: [[178, 74, 11], [30, 268, 5], [140, 292, 5]],
    labels: {
      proteins: { x: 16, y: 18, anchor: 'start' },
      shredder: { x: 96, y: 252, chip: 'an enzyme complex that cleaves proteins into short peptides' },
      gate: { x: 120, y: 298, chip: 'transporter associated with antigen processing', leader: 'gate' },
      bay: { x: 222, y: 352, chip: 'the compartment where MHC class I is assembled and loaded' },
      empty: { x: 222, y: 374, small: true },
      shop: { x: 336, y: 760, chip: 'molecular name: MHC class I' },
      note1: { x: 322, y: 282, small: true }, note2: { x: 322, y: 298, small: true },
      blocked: { x: 316, y: 270, small: true },
      none: { x: 230, y: 574, small: true },
      report: { x: 150, y: 760, small: true },
      missing: { x: 250, y: 760 },
    },
    nk: { from: [480, 708], to: 10, label: 'below' }, tLabel: 'right',
  },
};

// ------------------------------------------------------------------ figure CSS
const CSS = `
[data-figure="ch04-mhc1-pathway"] .mp-scen { margin: 0 0 var(--s-3); }
[data-figure="ch04-mhc1-pathway"].mp-tall .mp-scen .segmented { display: flex; width: 100%; }
[data-figure="ch04-mhc1-pathway"].mp-tall .mp-scen .segmented__track { display: grid; grid-template-columns: 1fr 1fr; width: 100%; border-radius: var(--r-lg); }
[data-figure="ch04-mhc1-pathway"].mp-tall .mp-scen .segmented__opt { justify-content: center; height: 2.75rem; border-radius: var(--r-md); }
[data-figure="ch04-mhc1-pathway"] .mp-readout {
  font-family: var(--font-ui); color: var(--stage-dark-ink, #E8ECF6);
  background: rgb(11 16 36 / 0.82); border: 1px solid rgb(201 211 232 / 0.18); border-radius: var(--r-md);
  padding: 0.55rem 0.7rem 0.6rem; box-sizing: border-box;
}
[data-figure="ch04-mhc1-pathway"] .fig__stage > .mp-readout { position: absolute; z-index: 4; right: 1.4%; bottom: 2.2%; width: 34.5%; }
[data-figure="ch04-mhc1-pathway"] .mp-below > .mp-readout { margin-top: var(--s-2); background: #0F1630; }
[data-figure="ch04-mhc1-pathway"] .mp-readout__title { margin: 0 0 0.35rem; font-size: var(--text-2xs); font-weight: 650; letter-spacing: 0.08em; text-transform: uppercase; color: var(--stage-dark-ink-2, #B9C1D6); }
[data-figure="ch04-mhc1-pathway"] .mp-slots { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 3px; list-style: none; margin: 0; padding: 0; }
[data-figure="ch04-mhc1-pathway"] .mp-slot { aspect-ratio: 1; display: grid; place-items: center; border-radius: 5px; background: rgb(201 211 232 / 0.07); border: 1px solid rgb(201 211 232 / 0.22); }
[data-figure="ch04-mhc1-pathway"] .mp-slot--empty { background: transparent; border-style: dashed; border-color: rgb(201 211 232 / 0.35); }
[data-figure="ch04-mhc1-pathway"] .mp-slot--viral { border-color: rgb(255 77 94 / 0.6); }
[data-figure="ch04-mhc1-pathway"] .mp-slot--neo { border-color: rgb(255 61 127 / 0.75); box-shadow: 0 0 8px rgb(255 61 127 / 0.45); }
[data-figure="ch04-mhc1-pathway"] .mp-slot svg { width: 78%; height: 78%; overflow: visible; }
[data-figure="ch04-mhc1-pathway"] .mp-key { display: flex; flex-wrap: wrap; gap: 0.2rem 0.75rem; margin: 0.4rem 0 0; font-size: var(--text-2xs); color: var(--stage-dark-ink-2, #B9C1D6); }
[data-figure="ch04-mhc1-pathway"] .mp-key span { display: inline-flex; align-items: center; gap: 0.25rem; }
[data-figure="ch04-mhc1-pathway"] .mp-key svg { width: 0.85rem; height: 0.85rem; overflow: visible; }
[data-figure="ch04-mhc1-pathway"] .mp-readout p.mp-small { margin: 0.35rem 0 0; font-size: var(--text-2xs); line-height: 1.4; color: var(--stage-dark-ink-3, #8E97B0); }
[data-figure="ch04-mhc1-pathway"] .mp-readout p.mp-neo { margin: 0.3rem 0 0; font-size: var(--text-2xs); line-height: 1.4; color: var(--stage-dark-ink, #E8ECF6); }
[data-figure="ch04-mhc1-pathway"] .mp-readout [hidden] { display: none; }
[data-figure="ch04-mhc1-pathway"] .mp-chip { cursor: pointer; }
[data-figure="ch04-mhc1-pathway"] .mp-scen-line { margin: var(--s-2) 0 0; color: var(--ink); }
[data-figure="ch04-mhc1-pathway"] .mp-scen-line b { font-family: var(--font-ui); font-size: var(--text-xs); font-weight: 650; letter-spacing: var(--tracking-caps); text-transform: uppercase; color: var(--accent); margin-right: 0.4em; }
[data-figure="ch04-mhc1-pathway"] .mp-scen-line[hidden] { display: none; }
[data-figure="ch04-mhc1-pathway"] .mp-chip:focus { outline: none; }
[data-figure="ch04-mhc1-pathway"] .mp-chip:focus-visible circle { stroke: var(--stage-focus); stroke-width: 2.5; }
`;

// ------------------------------------------------------------------ small local glyphs
/** Origin icon: self = plain dot · viral = small spiked hexagon · neo = asterisk. Centred, size = width. */
function originIcon(kind, size = 12) {
  const g = el('g', { 'data-part': 'origin', 'data-origin': kind });
  const r = size / 2;
  if (kind === 'viral') {
    let d = '', sp = '';
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
      d += `${i ? 'L' : 'M'}${(Math.cos(a) * r * 0.56).toFixed(2)} ${(Math.sin(a) * r * 0.56).toFixed(2)}`;
      sp += `M${(Math.cos(a) * r * 0.62).toFixed(2)} ${(Math.sin(a) * r * 0.62).toFixed(2)}L${(Math.cos(a) * r).toFixed(2)} ${(Math.sin(a) * r).toFixed(2)}`;
    }
    g.append(el('path', { d: sp, stroke: mix(PALETTE.virus, WHITE, 0.2), 'stroke-width': Math.max(1, size * 0.1), 'stroke-linecap': 'round' }));
    g.append(el('path', { d: `${d}Z`, fill: PALETTE.virus, stroke: mix(PALETTE.virus, WHITE, 0.45), 'stroke-width': Math.max(0.6, size * 0.06), 'stroke-linejoin': 'round' }));
  } else if (kind === 'neo') {
    g.append(el('circle', { r: r * 1.25, fill: dotGlow(PALETTE.foreignPeptide, 0.6) }));
    let d = '';
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI + Math.PI / 2;
      d += `M${(Math.cos(a) * r * 0.9).toFixed(2)} ${(Math.sin(a) * r * 0.9).toFixed(2)}L${(-Math.cos(a) * r * 0.9).toFixed(2)} ${(-Math.sin(a) * r * 0.9).toFixed(2)}`;
    }
    g.append(el('path', { d, stroke: mix(PALETTE.foreignPeptide, WHITE, 0.15), 'stroke-width': Math.max(1.3, size * 0.17), 'stroke-linecap': 'round' }));
  } else {
    g.append(el('circle', { r: r * 0.5, fill: mix(PALETTE.selfPeptide, BG, 0.05), stroke: mix(PALETTE.selfPeptide, WHITE, 0.35), 'stroke-width': Math.max(0.6, size * 0.06) }));
  }
  return g;
}
const iconSVG = (kind) => {
  const s = el('svg', { viewBox: '-8 -8 16 16', 'aria-hidden': 'true' });
  s.append(originIcon(kind, 13));
  return s;
};

/** A peptide fragment: n beads; beads 2 and n are anchors (squares that fit this groove, or triangles). */
function fragment({ n = 9, beadR = 2.9, kind = 'self', fits = true, seed = 1 }) {
  const c = PEP[kind];
  const foreign = kind !== 'self';
  const g = el('g', { 'data-part': 'fragment', 'data-kind': kind });
  const R = rng(seed, 'frag');
  const sp = beadR * 2.15;
  const pts = Array.from({ length: n }, (_, i) => [(i - (n - 1) / 2) * sp, Math.sin(i * 0.9 + R.range(0, 1)) * beadR * 0.45]);
  if (kind === 'neo') g.append(el('ellipse', { rx: (n * sp) / 2 + beadR * 2, ry: beadR * 3.4, fill: dotGlow(c, 0.55) }));
  const stroke = mix(c, WHITE, foreign ? 0.55 : 0.35);
  const fill = foreign ? mix(c, WHITE, 0.1) : mix(c, BG, 0.1);
  g.append(el('path', { d: `M${pts.map((p) => `${p[0].toFixed(2)} ${p[1].toFixed(2)}`).join('L')}`, fill: 'none', stroke, 'stroke-width': Math.max(0.6, beadR * 0.4), 'stroke-opacity': 0.75, 'stroke-linecap': 'round' }));
  pts.forEach(([x, y], i) => {
    const anchor = i === 1 || i === n - 1;
    if (!anchor) {
      g.append(el('circle', { cx: x.toFixed(2), cy: y.toFixed(2), r: beadR, fill, stroke, 'stroke-width': Math.max(0.5, beadR * 0.22) }));
      return;
    }
    const ay = y + beadR * 1.15;   // anchors hang down: they drop into the groove's pockets
    const s = beadR * 1.05;
    const d = fits
      ? `M${(x - s).toFixed(2)} ${(ay - s).toFixed(2)}h${(2 * s).toFixed(2)}v${(2 * s).toFixed(2)}h${(-2 * s).toFixed(2)}Z`
      : `M${x.toFixed(2)} ${(ay + s * 1.1).toFixed(2)}L${(x + s * 1.15).toFixed(2)} ${(ay - s * 0.9).toFixed(2)}L${(x - s * 1.15).toFixed(2)} ${(ay - s * 0.9).toFixed(2)}Z`;
    g.append(el('path', { d, fill: mix(c, BG, foreign ? 0.05 : 0.25), stroke, 'stroke-width': Math.max(0.5, beadR * 0.22), 'stroke-linejoin': 'round' }));
  });
  if (foreign) pts.slice(2, n - 2).forEach(([x, y]) => g.append(el('circle', { cx: x.toFixed(2), cy: y.toFixed(2), r: beadR * 0.36, fill: WHITE, 'fill-opacity': kind === 'neo' ? 0.85 : 0.35 })));
  return g;
}

/** The shop window, drawn identically in ch02/ch04 figures. */
const shopWindow = (size, kind) => mhc1({ size, peptide: kind == null ? 'none' : mhcPeptide(kind), pockets: POCKETS, anchors: kind == null ? undefined : FIT, stage: 'dark', detail: 'high' });

export default function mount(fig, ctx) {
  const { gsap } = ctx;
  if (!document.getElementById('css-ch04-mhc1-pathway')) document.head.append(ctx.h('style', { id: 'css-ch04-mhc1-pathway' }, CSS));
  ctx.tag('Not to scale');
  ctx.tag('Illustrative');

  let layoutName = (ctx.width || fig.clientWidth) < 700 ? 'tall' : 'wide';
  let L = LAYOUTS[layoutName];
  let scen = 'healthy';
  const applyAspect = () => {
    const a = L.vb[0] / L.vb[1];
    if (layoutName === 'tall') ctx.setAspect(a, a);
    else ctx.setAspect(a, LAYOUTS.tall.vb[0] / LAYOUTS.tall.vb[1]);
    fig.classList.toggle('mp-tall', layoutName === 'tall');
  };
  applyAspect();

  const svg = ctx.createSVG({ viewBox: `0 0 ${L.vb[0]} ${L.vb[1]}`, interactive: true, label: 'Cross-section of a cell displaying protein fragments' });
  const S_ = (tag, attrs, parent) => ctx.svg(tag, attrs, parent);

  // ------------------------------------------------------------------ scenario control (above the stage)
  const scenWrap = ctx.h('div', { class: 'mp-scen' });
  ctx.stage.before(scenWrap);
  ctx.ui.segmented({
    label: 'Scenario', hideLabel: true, value: scen, parent: scenWrap, options: SCENARIOS,
    onChange: (v) => { scen = v; renderReadout(); renderScenLine(); ctx.announce(`Scenario: ${SCENARIOS.find((s) => s.value === v).label}.`); stepper.rebuild(); },
  });

  // ------------------------------------------------------------------ readout ("What's in the window")
  const readout = ctx.h('div', { class: 'mp-readout', role: 'group', 'aria-label': 'What’s in the window' });
  const slotsEl = ctx.h('ul', { class: 'mp-slots' });
  const keyEl = ctx.h('p', { class: 'mp-key', 'aria-hidden': 'true' });
  for (const [k, w] of [['self', 'self'], ['viral', 'viral'], ['neo', 'mutated']]) {
    const sp = ctx.h('span');
    sp.append(iconSVG(k), document.createTextNode(w));
    keyEl.append(sp);
  }
  const neoNote = ctx.h('p', { class: 'mp-neo', hidden: true }, 'In a real tumor cell, one neoantigen would be about one in several thousand different peptides — which is why it is so easy to miss.');
  readout.append(
    ctx.h('p', { class: 'mp-readout__title' }, 'What’s in the window'),
    slotsEl, keyEl,
    ctx.h('p', { class: 'mp-small' }, 'Illustrative: 12 slots stand in for a few thousand different peptides on ~200,000 molecules.'),
    neoNote,
  );
  const below = ctx.h('div', { class: 'mp-below' });
  ctx.stage.after(below);
  function renderReadout() {
    const d = display(scen);
    slotsEl.replaceChildren();
    const names = { self: 'self fragment', viral: 'viral fragment', neo: 'mutated fragment (neoantigen)' };
    d.forEach((k) => {
      const li = ctx.h('li', { class: `mp-slot mp-slot--${k || 'empty'}`, 'aria-label': k ? names[k] : 'empty: no molecule on the surface' });
      if (k) li.append(iconSVG(k));
      slotsEl.append(li);
    });
    slotsEl.setAttribute('aria-label', scen === 'shuttered' ? 'All twelve slots empty' : `${d.filter((k) => k !== 'self').length} of 12 slots show an abnormal fragment`);
    neoNote.hidden = scen !== 'mutated';
  }
  const placeReadout = () => { if (layoutName === 'tall') below.append(readout); else ctx.stage.append(readout); };
  renderReadout();
  placeReadout();

  // ------------------------------------------------------------------ geometry helpers
  const memY = (x) => {
    const m = L.mem;
    const k = ((x - m.cx) / m.half) ** 2;
    return L.side === 'top' ? m.y0 + m.sag * k : m.y0 - m.sag * k;
  };
  /** Membrane slot i: base point, outward angle (deg, cup rotation) and head point. */
  const slot = (i, size = L.cup) => {
    const x = L.cupX(i);
    const y = memY(x);
    const m = L.mem;
    const slope = (L.side === 'top' ? 2 : -2) * m.sag * (x - m.cx) / (m.half * m.half);
    const rot = Math.atan(slope) / DEG + (L.side === 'top' ? 0 : 180);
    const a = (rot - 90) * DEG;
    const h = size * 0.9;
    return { x, y, rot, head: { x: x + Math.cos(a) * h, y: y + Math.sin(a) * h, angle: rot + 90 } };
  };
  const out = L.side === 'top' ? -1 : 1;   // outward y-direction of the membrane

  // ------------------------------------------------------------------ labels
  function addLabel(parent, spec, text, opts = {}) {
    const g = S_('g', { opacity: 0, style: 'visibility:hidden', 'data-label': opts.key || text }, parent);
    const anchor = spec.anchor || 'middle';
    const cls = spec.small ? 't-small t-halo' : 't-label t-halo';
    const textEl = S_('text', { x: spec.x, y: spec.y, class: cls, 'text-anchor': anchor, 'dominant-baseline': 'middle', text }, g);
    if (opts.leader) {
      const [lx, ly] = opts.leader;
      const sy = spec.y + (ly > spec.y ? 11 : -13);
      S_('line', { class: 'leader', x1: spec.x, y1: sy, x2: lx, y2: ly }, g);
      S_('circle', { class: 'leader-dot', cx: lx, cy: ly, r: 2.4 }, g);
    }
    if (spec.chip) {
      let w = text.length * (spec.small ? 6.9 : 8.3);
      try { const tw = textEl.getComputedTextLength(); if (tw > 0) w = tw; } catch (e) { /* not rendered yet */ }
      const cx = anchor === 'middle' ? spec.x + w / 2 + 13 : anchor === 'start' ? spec.x + w + 13 : spec.x + 13;
      const chip = S_('g', { class: 'mp-chip', tabindex: 0, role: 'button', 'aria-label': `${text}: ${spec.chip}`, transform: `translate(${cx.toFixed(1)} ${spec.y})` }, g);
      S_('circle', { r: 14, fill: 'transparent' }, chip);
      S_('circle', { r: 8.5, fill: 'rgba(201,211,232,0.12)', stroke: 'rgba(222,228,240,0.75)', 'stroke-width': 1.2 }, chip);
      S_('text', { x: 0, y: 0.5, 'text-anchor': 'middle', 'dominant-baseline': 'middle', style: 'font-size:11px;font-weight:700;font-style:italic;fill:#E8ECF6', text: 'i' }, chip);
      const show = () => ctx.tooltip.show(`<strong>${text}</strong> · ${spec.chip}`, chip);
      const hide = () => ctx.tooltip.hide();
      ctx.on(chip, 'pointerenter', show);
      ctx.on(chip, 'pointerleave', hide);
      ctx.on(chip, 'focus', show);
      ctx.on(chip, 'blur', hide);
      ctx.on(chip, 'click', show);
      ctx.on(chip, 'keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(); } if (e.key === 'Escape') hide(); });
    }
    return g;
  }
  const showL = (tl, g, pos, d = 0.5) => tl.to(g, { autoAlpha: 1, duration: d, ease: 'power1.out' }, pos);
  const hideL = (tl, g, pos, d = 0.4) => tl.to(g, { autoAlpha: 0, duration: d, ease: 'power1.in' }, pos);

  // ------------------------------------------------------------------ the scene
  let E = {};
  const ambients = [];

  function cellBody(parent, cancer) {
    const color = cancer ? PALETTE.cancer : PALETTE.healthy;
    const T = tones(color, 'dark');
    const [W, H] = L.vb;
    const R = rng(cancer ? 9 : 4, 'xsec');
    const lump = (x) => (cancer ? Math.sin(x * 0.021 + 1.3) * 6 + Math.sin(x * 0.047 + R.range(0, 3)) * 3.5 : 0);
    const top = [];
    for (let x = -40; x <= W + 40; x += 16) top.push([x, memY(x) + lump(x) * (L.side === 'top' ? 1 : -1)]);
    const farY = L.side === 'top' ? H + 60 : -60;
    const d = `M${top.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join('L')}L${W + 40} ${farY}L-40 ${farY}Z`;
    // Cytoplasm as a luminous haze of the cell's own color over the navy stage (polish: the old
    // opaque darkened-sand fill read as an off-palette muddy brown). Strongest just under the membrane.
    const a = cancer ? [0.34, 0.24, 0.13, 0.08] : [0.3, 0.2, 0.1, 0.06];
    const fill = linear(`mp-xsec-${cancer ? 'c' : 'h'}-${L.side}`, L.side === 'top'
      ? [[0, color, a[0]], [0.035, color, a[1]], [0.4, color, a[2]], [1, color, a[3]]]
      : [[0, color, a[3]], [0.6, color, a[2]], [0.965, color, a[1]], [1, color, a[0]]],
    { x1: 0, y1: 0, x2: 0, y2: 1 });
    const g = S_('g', { 'data-part': 'cell' }, parent);
    S_('path', { d, fill }, g);
    // faint cytoplasm texture
    let dots = '';
    for (let i = 0; i < 40; i++) {
      const x = R.range(10, W - 10), y = L.side === 'top' ? R.range(memY(x) + 30, H - 10) : R.range(10, memY(x) - 30);
      const r = R.range(1.2, 3.2);
      dots += `M${(x + r).toFixed(1)} ${y.toFixed(1)}a${r.toFixed(1)} ${r.toFixed(1)} 0 1 0 ${(-2 * r).toFixed(1)} 0a${r.toFixed(1)} ${r.toFixed(1)} 0 1 0 ${(2 * r).toFixed(1)} 0`;
    }
    S_('path', { d: dots, fill: T.detail, 'fill-opacity': 0.14 }, g);
    // membrane: soft glow band + bilayer
    const md = `M${top.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join('L')}`;
    S_('path', { d: md, fill: 'none', stroke: color, 'stroke-width': 16, 'stroke-opacity': 0.1, 'stroke-linejoin': 'round' }, g);
    S_('path', { d: md, fill: 'none', stroke: T.rim, 'stroke-width': 2.4, 'stroke-opacity': 0.95, 'stroke-linejoin': 'round' }, g);
    const inner = `M${top.map((p) => `${p[0].toFixed(1)} ${(p[1] - out * 5).toFixed(1)}`).join('L')}`;
    S_('path', { d: inner, fill: 'none', stroke: T.rim, 'stroke-width': 1.1, 'stroke-opacity': 0.45, 'stroke-linejoin': 'round' }, g);
    // nucleus (partly in view)
    const N = L.nucleus;
    const rf = blobRadius({ r: N.r, seed: cancer ? 'mpn-c' : 'mpn-h', irregularity: cancer ? 0.55 : 0.08, kMax: cancer ? 6 : 4 });
    const np = polarPoints(rf, 48).map(([x, y]) => [x + N.x, y + N.y]);
    const nd = smoothPath(np);
    S_('path', { d: nd, fill: nucleusFill(color, 'dark'), stroke: T.nucRim, 'stroke-width': 1.4, 'stroke-opacity': 0.8 }, g);
    let ch = '';
    const RN = rng(cancer ? 3 : 2, 'chrom');
    for (let i = 0; i < 26; i++) {
      const a = RN.range(0, Math.PI * 2), rr = Math.sqrt(RN()) * N.r * 0.75, s = RN.range(3, cancer ? 9 : 6);
      ch += `M${(N.x + Math.cos(a) * rr + s).toFixed(1)} ${(N.y + Math.sin(a) * rr).toFixed(1)}a${s.toFixed(1)} ${(s * 0.7).toFixed(1)} 0 1 0 ${(-2 * s).toFixed(1)} 0a${s.toFixed(1)} ${(s * 0.7).toFixed(1)} 0 1 0 ${(2 * s).toFixed(1)} 0`;
    }
    S_('path', { d: ch, fill: T.chromatin, 'fill-opacity': cancer ? 0.6 : 0.45 }, g);
    return g;
  }

  function draw() {
    ambients.splice(0).forEach((t) => t.kill());
    for (const c of [...svg.children]) if (c !== svg.defs) c.remove();
    svg.setAttribute('viewBox', `0 0 ${L.vb[0]} ${L.vb[1]}`);
    ctx.refreshTextScale();
    const cancer = scen === 'mutated' || scen === 'shuttered';
    const kindA = special(scen);
    const shut = scen === 'shuttered';

    const world = S_('g', null, svg);
    cellBody(world, cancer);
    const inside = S_('g', { 'data-part': 'inside' }, world);

    // virus particles (virus scenario only)
    if (scen === 'virus') {
      L.virus.forEach(([x, y, r], i) => {
        const v = virus({ r, seed: 5 + i, spikes: r > 8 ? 12 : 8, stage: 'dark' });
        v.setAttribute('transform', `translate(${x} ${y})`);
        inside.append(v);
      });
    }

    // ER (loading bay) + empty cups waiting inside
    const er = vesicle({ kind: 'er', width: L.er.w, height: L.er.h, seed: L.er.seed, stage: 'dark' });
    er.setAttribute('transform', `translate(${L.er.x} ${L.er.y})`);
    inside.append(er);
    const erCups = L.erCups.map(([x, y]) => {
      const g = S_('g', { transform: `translate(${x} ${y})` }, inside);
      g.append(shopWindow(L.erCup, null));
      return g;
    });

    // gate (TAP) in the ER wall, facing the cytosol
    const wh = rayHit(cellInfo(er).outline, L.gateAngle * DEG);
    const gatePos = [L.er.x + wh.x, L.er.y + wh.y];
    const gate = tapGate({ size: L.gate, state: shut ? 'blocked' : 'open', stage: 'dark' });
    gate.setAttribute('transform', `translate(${gatePos[0].toFixed(1)} ${gatePos[1].toFixed(1)}) rotate(${L.gateRot})`);
    inside.append(gate);
    const ga = L.gateAngle * DEG;
    const gateOut = [gatePos[0] + Math.cos(ga) * L.gate * 0.95, gatePos[1] + Math.sin(ga) * L.gate * 0.95];   // cytosol mouth
    const gateIn = [gatePos[0] - Math.cos(ga) * L.gate * 0.9, gatePos[1] - Math.sin(ga) * L.gate * 0.9];      // ER side

    // shredder
    const prot = proteasome({ size: L.prot.size, stage: 'dark' });
    const protWrap = S_('g', { transform: `translate(${L.prot.x} ${L.prot.y})` }, inside);
    const protInner = S_('g', null, protWrap);
    prot.setAttribute('transform', `rotate(${L.prot.rot})`);
    protInner.append(prot);

    // proteins (folded chains); the first two get retired into the shredder
    const kinds = scen === 'virus' ? ['self', 'viral', 'self', 'viral', 'self'] : ['self', scen === 'mutated' ? 'typo' : 'self', 'self', 'self', 'self'];
    const proteins = L.proteins.map(([x, y], i) => {
      const k = kinds[i];
      const pc = peptideChain({ length: 15, beadR: L.protR, fold: 1, seed: 11 + i, stage: 'dark', color: k === 'viral' ? PALETTE.virus : PALETTE.selfPeptide, highlight: k === 'typo' ? [6] : [] });
      const g = S_('g', { transform: `translate(${x} ${y}) scale(1)` }, inside);
      g.append(pc);
      if (k === 'viral') { const ic = originIcon('viral', 11); ic.setAttribute('transform', `translate(${L.protR * 4.6} ${-L.protR * 4.2})`); g.append(ic); }
      return g;
    });

    // fragments: 10 chains; A (fits) carries the scenario's special kind; B is self with the wrong anchors
    const viralSet = new Set([1, 3, 5, 7, 9]);
    const frags = L.frags.map(([x, y, r], i) => {
      let kind = 'self';
      if (scen === 'virus' && viralSet.has(i)) kind = 'viral';
      if (i === L.A) kind = kindA;
      const fits = i === L.A ? true : i === L.B ? false : (i % 3 !== 1);
      const n = [9, 8, 10, 9, 8, 9, 10, 9, 8, 10][i];
      const g = S_('g', { transform: `translate(${L.protOut[0]} ${L.protOut[1]}) rotate(${r}) scale(0.2)`, opacity: 0 }, inside);
      g.append(fragment({ n, beadR: L.fragR, kind, fits, seed: 31 + i }));
      g.dataset.home = `${x} ${y} ${r}`;
      return g;
    });

    // ruler above the fragment the reader will follow (it survives and gets loaded)
    const [rx, ry, rr] = L.frags[L.A];
    const rlen = 9 * L.fragR * 2.15 + L.fragR * 2;
    const ruler = S_('g', { opacity: 0, style: 'visibility:hidden' }, inside);
    const rg = S_('g', { transform: `translate(${rx} ${ry}) rotate(${rr})` }, ruler);
    S_('path', { d: `M${-rlen / 2} ${-L.fragR * 3}v-5H${rlen / 2}v5`, fill: 'none', stroke: 'rgba(222,228,240,0.7)', 'stroke-width': 1.1 }, rg);
    S_('text', { x: rx, y: ry - L.fragR * 3 - 18, class: 't-small t-halo', 'text-anchor': 'middle', text: '8–10 amino acids' }, ruler);

    // loaded cup (the tracked one): crossfades in at the ER cup, then travels to the membrane
    const loadAt = L.erCups[L.load];
    const sTarget = slot(SLOT);
    const erScale = L.erCup / L.cup;
    const travel = S_('g', { transform: `translate(${loadAt[0]} ${loadAt[1]}) rotate(0) scale(${erScale.toFixed(3)})`, opacity: 0 }, inside);
    travel.append(shopWindow(L.cup, kindA));
    if (kindA !== 'self') { const ic = originIcon(kindA, 11); ic.setAttribute('transform', `translate(${L.cup * 0.62} ${-L.cup * 0.78})`); travel.append(ic); }

    // fit / no-fit badges in the loading bay
    const badgeYes = ctx.badgeSVG('yes', { x: loadAt[0] + L.erCup * 0.62, y: loadAt[1] - L.erCup * 1.05, r: 9 }, inside);
    const bAt = L.erCups[1];
    const badgeNo = ctx.badgeSVG('no', { x: bAt[0] + L.erCup * 0.62, y: bAt[1] - L.erCup * 1.05, r: 9 }, inside);
    for (const b of [badgeYes, badgeNo]) { b.setAttribute('opacity', 0); b.style.visibility = 'hidden'; }

    // membrane display: 11 stand-in cups + the travelling one at SLOT
    const disp = display(scen);
    const memCups = [];
    const surface = S_('g', { 'data-part': 'display' }, world);
    disp.forEach((k, i) => {
      if (k == null || i === SLOT) return;
      const s = slot(i);
      const g = S_('g', { transform: `translate(${s.x.toFixed(1)} ${s.y.toFixed(1)}) rotate(${s.rot.toFixed(2)})`, opacity: 0 }, surface);
      g.append(shopWindow(L.cup, k));
      if (k !== 'self') { const ic = originIcon(k, 11); ic.setAttribute('transform', `translate(${L.cup * 0.62} ${-L.cup * 0.78})`); g.append(ic); }
      memCups.push(g);
    });
    surface.append(travel);   // above the membrane once it arrives

    // transport arrow (step 5)
    const er0 = rayHit(cellInfo(er).outline, (L.side === 'top' ? -90 : 90) * DEG);
    const erExit = [loadAt[0], L.er.y + er0.y * 0.98];
    const arrow = S_('g', { opacity: 0, style: 'visibility:hidden' }, inside);
    const ay0 = loadAt[1] + (L.side === 'top' ? -L.erCup * 1.2 : L.erCup * 0.6);
    const ay1 = sTarget.y + (L.side === 'top' ? 14 : -14);
    S_('path', { d: `M${loadAt[0]} ${ay0}C${loadAt[0]} ${(ay0 + ay1) / 2} ${sTarget.x} ${(ay0 + ay1) / 2} ${sTarget.x} ${ay1}`, fill: 'none', stroke: 'rgba(222,228,240,0.55)', 'stroke-width': 1.4, 'stroke-dasharray': '4 5' }, arrow);
    const dir = L.side === 'top' ? -1 : 1;
    S_('path', { d: `M${sTarget.x - 5} ${ay1 - dir * 7}L${sTarget.x} ${ay1}L${sTarget.x + 5} ${ay1 - dir * 7}`, fill: 'none', stroke: 'rgba(222,228,240,0.75)', 'stroke-width': 1.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, arrow);

    // T cell (activated killer) in the lane outside the membrane
    const lane = S_('g', { 'data-part': 'lane' }, svg);
    const tArt = tCell({ variant: 'cd8', r: L.tR, state: 'activated', polarity: L.tPol, seed: 3, stage: 'dark' });
    const tc = rig(tArt, { x: L.lane.x0, y: L.lane.y, parent: lane, seed: 3 });
    let tLabR = null, tLabL = null;
    if (L.tLabel === 'right') {
      tLabR = S_('text', { x: L.tR * 1.25 + 8, y: -L.tR * 0.35, class: 't-label t-halo', 'dominant-baseline': 'middle', text: 'activated killer T cell' }, tc.layers.over);
      tLabL = S_('text', { x: -L.tR * 1.25 - 8, y: -L.tR * 0.35, class: 't-label t-halo t-end', 'dominant-baseline': 'middle', text: 'activated killer T cell', opacity: 0 }, tc.layers.over);
    } else {
      tLabR = S_('text', { x: 0, y: L.tR * 1.25 + 20, class: 't-label t-halo t-mid', text: 'activated killer T cell' }, tc.layers.over);
    }
    ambients.push(ctx.ambient(gsap.fromTo(tc.layers.idle, { scale: 1 }, { scale: 1.02, svgOrigin: '0 0', duration: 2.8, ease: 'sine.inOut', yoyo: true, repeat: -1 })));

    let nk = null;
    if (shut) {
      const nArt = nkCell({ r: L.tR * 1.25, seed: 6, state: 'activated', polarity: L.side === 'top' ? 100 : -100, stage: 'dark' });
      nk = rig(nArt, { x: L.nk.from[0], y: L.nk.from[1], parent: lane, seed: 6, opacity: 0 });
      if (L.nk.label === 'below') S_('text', { x: 0, y: L.tR * 1.4 + 20, class: 't-label t-halo t-mid', text: 'NK cell' }, nk.layers.over);
      else S_('text', { x: 0, y: -L.tR * 1.6 - 10, class: 't-label t-halo t-mid', text: 'NK cell' }, nk.layers.over);
    }
    fxLayer(lane);

    // labels
    const lab = S_('g', { 'data-part': 'labels' }, svg);
    const LS = L.labels;
    const gateLeader = [gatePos[0] + (L.side === 'top' ? -4 : -L.gate * 0.5), gatePos[1] + (L.side === 'top' ? -L.gate * 0.45 : -2)];
    const c11 = slot(11);
    const labels = {
      proteins: addLabel(lab, LS.proteins, 'proteins'),
      shredder: addLabel(lab, LS.shredder, 'proteasome'),
      gate: addLabel(lab, LS.gate, 'TAP', { leader: gateLeader }),
      bay: addLabel(lab, LS.bay, 'endoplasmic reticulum (ER)'),
      empty: addLabel(lab, LS.empty, 'empty MHC class I, waiting'),
      shop: addLabel(lab, LS.shop, 'shop window', LS.shop.leader ? { leader: [c11.head.x + 6, c11.head.y - 2] } : {}),
      note1: addLabel(lab, LS.note1, 'Shown: 1 in 5 survive.'),
      note2: addLabel(lab, LS.note2, 'Real: about 1 in 5,000.'),
      blocked: addLabel(lab, LS.blocked, 'TAP blocked: nothing enters'),
      none: addLabel(lab, LS.none, 'No MHC class I reaches the surface'),
      report: addLabel(lab, LS.report, 'Nothing to report.'),
      missing: addLabel(lab, LS.missing, 'missing self (Chapter 2)'),
    };

    E = { tLabR, tLabL, world, inside, er, erCups, gate, gatePos, gateIn, gateOut, erExit, protInner, proteins, frags, ruler, travel, loadAt, sTarget, erScale, memCups, arrow, tc, nk, labels, badgeYes, badgeNo, shut, kindA };
  }

  // ------------------------------------------------------------------ steps
  const tStep = (i) => L.lane.x0 + L.lane.step * i;
  const laneMove = (tl, i) => move(tl, E.tc, { x: tStep(i), y: L.lane.y, duration: 1.6, stretch: 0, ease: 'sine.inOut', pos: 0 });
  const homeOf = (g) => g.dataset.home.split(' ').map(Number);

  const steps = [
    { // 1 · Make & chop
      enter(tl) {
        laneMove(tl, 1);
        showL(tl, E.labels.proteins, 0);
        showL(tl, E.labels.shredder, 0.3);
        const [ix, iy] = L.protIn;
        [0, 1].forEach((k) => {
          const p = E.proteins[k];
          const [x, y] = L.proteins[k];
          tl.fromTo(p, { attr: { transform: `translate(${x} ${y}) scale(1)` }, opacity: 1 },
            { attr: { transform: `translate(${ix} ${iy}) scale(0.45)` }, duration: 1.2, ease: 'so.inOut' }, 0.2 + k * 0.7)
            .to(p, { opacity: 0, duration: 0.35, ease: 'power1.in' }, 1.1 + k * 0.7);
        });
        tl.fromTo(E.protInner, { scale: 1 }, { scale: 1.04, svgOrigin: '0 0', duration: 0.5, ease: 'sine.inOut', yoyo: true, repeat: 3 }, 1.2);
        E.frags.forEach((f, i) => {
          const [x, y, r] = homeOf(f);
          tl.fromTo(f, { attr: { transform: `translate(${L.protOut[0]} ${L.protOut[1]}) rotate(${r}) scale(0.2)` }, opacity: 0 },
            { attr: { transform: `translate(${x} ${y}) rotate(${r}) scale(1)` }, opacity: 1, duration: 1.1, ease: 'so.out' }, 1.5 + i * 0.12);
        });
        showL(tl, E.ruler, 2.9);
      },
    },
    { // 2 · Most are destroyed
      enter(tl) {
        laneMove(tl, 2);
        E.frags.forEach((f, i) => {
          if (i === L.A || i === L.B) return;
          const [x, y, r] = homeOf(f);
          tl.to(f, { attr: { transform: `translate(${x} ${y + 6}) rotate(${r + 25}) scale(0.35)` }, opacity: 0, duration: 1.1, ease: 'power1.in' }, 0.3 + (i % 5) * 0.14);
        });
        showL(tl, E.labels.note1, 0.9);
        showL(tl, E.labels.note2, 1.2);
      },
    },
    { // 3 · Through the gate
      enter(tl) {
        laneMove(tl, 3);
        hideL(tl, E.ruler, 0);
        hideL(tl, E.labels.note1, 0);
        hideL(tl, E.labels.note2, 0);
        showL(tl, E.labels.gate, 0.2);
        showL(tl, E.labels.bay, 0.4);
        const [ox, oy] = E.gateOut;
        const [nx, ny] = E.gateIn;
        const rot = L.side === 'top' ? 0 : 90;
        [L.A, L.B].forEach((idx, k) => {
          const f = E.frags[idx];
          const t0 = 0.4 + k * 0.9;
          tl.to(f, { attr: { transform: `translate(${ox} ${oy}) rotate(${rot}) scale(0.8)` }, duration: 1.2, ease: 'so.inOut' }, t0);
          if (E.shut) {
            tl.to(f, { attr: { transform: `translate(${ox + (L.side === 'top' ? -10 : 0)} ${oy + (L.side === 'top' ? 0 : -10)}) rotate(${rot}) scale(0.8)` }, duration: 0.5, ease: 'sine.out' }, t0 + 1.25)
              .to(f, { opacity: 0, duration: 0.8, ease: 'power1.in' }, t0 + 1.8);
          } else {
            const cup = L.erCups[k === 0 ? L.load : 1];
            const hx = cup[0], hy = cup[1] + L.hoverDy;
            tl.to(f, { attr: { transform: `translate(${nx} ${ny}) rotate(${rot}) scale(0.6)` }, duration: 0.7, ease: 'sine.inOut' }, t0 + 1.2)
              .to(f, { attr: { transform: `translate(${hx} ${hy}) rotate(0) scale(1)` }, duration: 1.2, ease: 'so.out' }, t0 + 1.9);
          }
        });
        if (E.shut) showL(tl, E.labels.blocked, 1.9);
      },
    },
    { // 4 · Test and load
      enter(tl) {
        laneMove(tl, 4);
        showL(tl, E.labels.empty, 0);
        if (E.shut) return;
        // B tries the middle cup: wrong anchors, so it is let go
        const fb = E.frags[L.B];
        const cb = L.erCups[1];
        const fa = E.frags[L.A];
        const ca = L.erCups[L.load];
        const cupTop = (c) => c[1] - L.erCup * 0.78;
        tl.to(fb, { attr: { transform: `translate(${cb[0]} ${cupTop(cb) - 4}) rotate(0) scale(0.7)` }, duration: 1.0, ease: 'so.inOut' }, 0.3)
          .to(E.badgeNo, { autoAlpha: 1, duration: 0.4 }, 1.25)
          .to(fb, { attr: { transform: `translate(${cb[0] + 14} ${cupTop(cb) - 46}) rotate(-14) scale(0.7)` }, duration: 1.0, ease: 'sine.inOut' }, 1.5)
          .to(fb, { opacity: 0, duration: 0.6, ease: 'power1.in' }, 2.1);
        // A settles: its anchors drop into the pockets
        tl.to(fa, { attr: { transform: `translate(${ca[0]} ${cupTop(ca) - 2}) rotate(0) scale(0.7)` }, duration: 1.1, ease: 'so.inOut' }, 1.0)
          .to(fa, { attr: { transform: `translate(${ca[0]} ${ca[1] - L.erCup * 0.72}) rotate(0) scale(0.3)` }, opacity: 0, duration: 0.6, ease: 'power1.in' }, 2.1)
          .to(E.erCups[L.load], { opacity: 0, duration: 0.5 }, 2.2)
          .to(E.travel, { opacity: 1, duration: 0.5 }, 2.2)
          .to(E.badgeYes, { autoAlpha: 1, duration: 0.4 }, 2.6);
      },
    },
    { // 5 · To the surface
      enter(tl) {
        laneMove(tl, 5);
        hideL(tl, E.labels.empty, 0);
        tl.to([E.badgeYes, E.badgeNo], { autoAlpha: 0, duration: 0.4 }, 0);
        if (E.shut) { showL(tl, E.labels.none, 0.4); return; }
        showL(tl, E.arrow, 0.1);
        const [lx, ly] = E.loadAt;
        const mid = L.side === 'top' ? [lx, E.erExit[1] - 8] : [lx, E.erExit[1] + 8];
        const s = E.sTarget;
        tl.fromTo(E.travel, { attr: { transform: `translate(${lx} ${ly}) rotate(0) scale(${E.erScale.toFixed(3)})` } },
          { attr: { transform: `translate(${mid[0]} ${mid[1]}) rotate(${L.side === 'top' ? 0 : 90}) scale(${((E.erScale + 1) / 2).toFixed(3)})` }, duration: 1.1, ease: 'so.inOut' }, 0.3)
          .to(E.travel, { attr: { transform: `translate(${s.x.toFixed(1)} ${s.y.toFixed(1)}) rotate(${s.rot.toFixed(2)}) scale(1)` }, duration: 1.3, ease: 'so.out' }, 1.4);
        hideL(tl, E.arrow, 2.6);
        E.memCups.forEach((c, i) => tl.to(c, { opacity: 1, duration: 0.5, ease: 'power1.out' }, 2.3 + i * 0.07));
        showL(tl, E.labels.shop, 2.9);
      },
    },
    { // 6 · The T cell reads the display
      enter(tl) {
        const tc = E.tc;
        const tr = L.tR * 1.18;                                   // activated blast radius
        const f = [Math.cos(L.tPol * DEG), Math.sin(L.tPol * DEG)];  // the TCR-studded front
        // TCR tips (≈ 0.78 × TCR size ≈ 0.28 r out from the membrane) meet the cup rim head to head (§4 rule 5)
        const tcrReach = tr * 0.36 * 0.78;
        const touchAt = (p, gap = 0) => ({ x: p.x - f[0] * (tr + tcrReach + gap), y: p.y - f[1] * (tr + tcrReach + gap) });
        const flipLabel = (pos) => { if (E.tLabL) tl.to(E.tLabR, { opacity: 0, duration: 0.4 }, pos).to(E.tLabL, { opacity: 1, duration: 0.4 }, pos + 0.2); };
        if (E.shut) {
          const x1 = L.cupX(3);
          const p1 = touchAt({ x: x1, y: memY(x1) }, 1);
          move(tl, tc, { ...p1, duration: 1.4, stretch: 0, pos: 0 });
          move(tl, tc, { x: x1 - 50, y: L.lane.y, duration: 1.6, stretch: 0, pos: 2.3 });
          const x2 = L.cupX(L.nk.to);
          const nr = L.tR * 1.25 * 1.1;
          move(tl, E.nk, { opacity: 1, x: x2, y: L.side === 'top' ? memY(x2) - nr - 6 : memY(x2) + nr + 6, duration: 2.0, stretch: 0, pos: 2.6 });
          showL(tl, E.labels.missing, 4.2);
          return;
        }
        const p1 = touchAt(slot(2).head);
        move(tl, tc, { ...p1, duration: 1.3, stretch: 0, pos: 0 });
        const p2 = touchAt(E.sTarget.head);
        move(tl, tc, { ...p2, via: [[(p1.x + p2.x) / 2, L.lane.y]], duration: 1.9, stretch: 0, pos: 2.0 });
        if (p2.x > L.vb[0] * 0.6) flipLabel(2.4);
        if (scen === 'healthy') {
          move(tl, tc, { x: L.side === 'top' ? L.cupX(9) + 28 : L.cupX(10) + 26, y: L.lane.y, duration: 1.8, stretch: 0, pos: 4.6 });
          showL(tl, E.labels.report, 4.4);
        } else {
          const h = E.sTarget.head;
          // "+" disc on the side away from the cup's own origin icon (top right of the cup when it
          // points up; bottom left when the portrait layout flips it), so both stay readable
          const r0 = L.cup * 0.42, bs = Math.min(19, Math.max(12, tr * 0.38));
          const off = L.side === 'top' ? { x: -(r0 * 1.2 + bs * 0.7), y: 0 } : { x: r0 * 1.2 + bs * 0.4, y: r0 * 0.9 };
          recognize(tl, tc, { x: h.x, y: h.y, angle: h.angle }, { pos: 4.0, radius: r0, badgeOffset: off });
        }
      },
    },
  ];

  // ------------------------------------------------------------------ stepper
  const stepper = ctx.ui.stepper({ steps, reset: draw });

  // Scenario line (polish A6): the writer's step captions describe the pathway; this one line under
  // them says what the chosen scenario changes, so the text matches the stage at every step.
  const SCEN_LINE = {
    virus: 'The virus’s own proteins are degraded and presented too, so viral fragments appear in the window (2 of the 12 slots here), and a killer T cell recognizes them.',
    mutated: 'One typo in one protein gives one changed fragment among thousands on display: a neoantigen a killer T cell can recognize, but easy to miss.',
    shuttered: 'TAP is blocked, so no peptide-loaded MHC class I reaches the surface. A killer T cell finds nothing to recognize, but an NK cell detects the missing self.',
  };
  const scenLine = ctx.h('p', { class: 'mp-scen-line', hidden: true, 'aria-live': 'polite' });
  ctx.caption.append(scenLine);
  function renderScenLine() {
    const t = SCEN_LINE[scen];
    scenLine.hidden = !t;
    if (t) scenLine.innerHTML = `<b>${SCENARIOS.find((o) => o.value === scen).label}</b>${t}`;
  }

  ctx.onResize(({ width }) => {
    const want = width < 700 ? 'tall' : 'wide';
    if (want === layoutName) return;
    layoutName = want;
    L = LAYOUTS[layoutName];
    applyAspect();
    placeReadout();
    stepper.rebuild();
  });

  return {
    destroy() { ambients.forEach((t) => t.kill()); },
  };
}
