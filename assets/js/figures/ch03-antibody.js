// ch03-antibody — "One molecule, four jobs" (Chapter 3). Build task F9 (with ch09-humanization).
//
// An explorer with five modes (chips above the stage):
//   Anatomy  — one large library IgG (12 domains). Hinge swivels gently; four hotspots
//              (variable regions · hinge · Fc region · heavy & light chains) open the shared infoCard.
//   Block · Mark for engulfment · Complement · Recruit NK cells — each a short, seekable scene that
//              plays "without antibodies" first; "Add antibodies" replays it with them, then a
//              Without/With switch + Replay compare. Flag / Complement / NK also have a
//              "Target: … / Cancer cell" switch (drug antibodies, white outline) — Chapter 9 links
//              here for the naked-antibody mechanisms.
// Every scene is one paused GSAP timeline built from shared/cell-actions builders (rigs, approach,
// probe, dock, recognize, kill, swap, dockAntibody, drive), so reduced motion can show any frame:
// it renders a two-panel BEFORE / AFTER still for the selected state.
import {
  antibody, antibodyTips, invert, healthyCell, cancerCell, nkCell, macrophage, bacterium, virus,
  antigen, receptor, vesicle, placeOnMembrane, samplePerimeter, cellInfo, dotGlow, PALETTE, mix,
} from '../art/index.js';
import {
  rig, move, approach, probe, dock, recognize, kill, swap, dockAntibody, drive, contact,
} from './shared/cell-actions.js';

const ID = 'ch03-antibody';
const DEG = Math.PI / 180;
const WHITE = '#FFFFFF';
const r2 = (v) => Math.round(v * 100) / 100;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const dirv = (a) => [Math.cos(a * DEG), Math.sin(a * DEG)];
const angOf = (dx, dy) => Math.atan2(dy, dx) / DEG;
const add = (p, v, k = 1) => ({ x: p.x + v[0] * k, y: p.y + v[1] * k });

const GOLD = PALETTE.antibody;
const DOCK = '#E3D2B8';                                   // the body cell's own docking protein (sand family)
const COMP = mix(PALETTE.platelet, WHITE, 0.3);           // complement proteins: pale lilac (single-use prop)
const COMP_RIM = mix(PALETTE.platelet, WHITE, 0.62);

const MODES = [
  { value: 'anatomy', label: 'Anatomy' },
  { value: 'block', label: 'Block' },
  { value: 'flag', label: 'Mark for engulfment' },
  { value: 'complement', label: 'Complement' },
  { value: 'nk', label: 'Recruit NK cells' },
];

const CH9 = '<a href="09-antibodies.html#three-jobs-for-a-naked-antibody">Chapter 9</a>';
const DRUG_NOTE = `<p class="abx-note">Gold with a white outline = a drug antibody. Several antibody drugs against cancer rely partly on this route (${CH9}).</p>`;
const term = (id, text) => `<a class="term" data-term="${id}" href="glossary.html#${id}">${text}</a>`;

const HOTSPOTS = [
  { id: 'tips', label: 'Variable regions', title: 'Variable regions',
    body: `<p>Shaped by gene rearrangement; the two Fab arms are identical and bind the same ${term('epitope', 'epitope')}. When one arm dissociates, the other is still bound, so the antibody binds far more strongly than either arm alone (${term('avidity', 'avidity')}, Chapter 1).</p>` },
  { id: 'hinge', label: 'Hinge', title: 'Hinge',
    body: '<p>Flexible, lets the arms reach targets at different distances.</p>' },
  { id: 'fc', label: 'Fc region', title: 'Fc region',
    body: '<p>The stem of the Y, built from constant regions and essentially the same in every antibody of a given class or subclass. Fc receptors on immune cells, and complement proteins, bind it.</p>' },
  { id: 'chains', label: 'Heavy & light chains', title: 'Heavy and light chains',
    body: '<p>Two of each; each arm has one light chain and part of one heavy chain. The heavy chains run all the way down into the Fc region.</p>' },
];

const CARDS = {
  block: {
    kicker: 'Neutralization',
    without: '<p>The virus’s spike proteins bind entry receptors on the cell, and it slips inside.</p>',
    with: '<p>Antibodies bind the spikes. A coated virus can bump into the cell but cannot attach, so it drifts away. This is the one job antibodies do on their own.</p>',
  },
  flag: {
    kicker: 'Opsonization',
    without: { natural: '<p>The macrophage contacts the bare bacterium but binds it poorly. Engulfing it is slow, or fails.</p>',
      cancer: '<p>The macrophage contacts the cancer cell, finds nothing to bind, and moves on.</p>' },
    with: { natural: '<p>Antibodies coat the bacterium, Fc regions facing out. Fc receptors on the macrophage bind the Fc regions, and the macrophage engulfs the bacterium, coat and all, into a phagosome.</p>',
      cancer: '<p>Drug antibodies bind a protein on the cancer cell. The macrophage’s Fc receptors bind their Fc regions, and it engulfs the cell.</p>' },
  },
  complement: {
    kicker: 'Complement activation',
    without: { natural: '<p>Complement proteins drift past in the fluid. With nothing to start them off here, few bind.</p>',
      cancer: '<p>Complement proteins drift past the cancer cell. Few bind.</p>' },
    with: { natural: '<p>Where several antibody Fc regions cluster, the first complement proteins bind (a lone antibody is not enough). More coat the surface, opsonizing it, and some assemble into ring-shaped pores. The bacterium leaks and collapses.</p>',
      cancer: '<p>Drug antibodies cluster on the cancer cell. Complement proteins bind the clustered Fc regions and assemble pores in its membrane; the cell leaks and dies. Our own cells carry complement regulators, so this works better for some drugs than others.</p>' },
  },
  nk: {
    kicker: 'Antibody-dependent cellular cytotoxicity (ADCC)',
    without: { natural: '<p>The NK cell touches the infected cell and moves on.</p>',
      cancer: '<p>The NK cell touches the cancer cell and moves on.</p>' },
    with: { natural: '<p>Antibodies bind viral proteins on the infected cell. The NK cell’s Fc receptors bind their Fc regions; it releases its cytotoxic granules at the contact, the target dies by apoptosis, and the NK cell leaves intact.</p>',
      cancer: '<p>Drug antibodies bind a protein on the cancer cell. The NK cell’s Fc receptors bind their Fc regions, and it triggers the cancer cell’s apoptosis.</p>' },
  },
};
const TARGETS = { flag: 'Bacterium', complement: 'Bacterium', nk: 'Infected cell' };

// ------------------------------------------------------------------------------------ CSS
const CSS = `
[data-figure="${ID}"] .abx-modes { margin: 0 0 var(--s-3); }
[data-figure="${ID}"] .abx-modes .chip { font-size: var(--text-xs); }
@container fig (max-width: 599.98px) {
  [data-figure="${ID}"] .abx-modes .chips__tray { flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none;
    margin-inline: -2px; padding: 2px; scroll-snap-type: x proximity; }
  [data-figure="${ID}"] .abx-modes .chips__tray::-webkit-scrollbar { display: none; }
  [data-figure="${ID}"] .abx-modes .chip { flex: 0 0 auto; scroll-snap-align: start; }
}
[data-figure="${ID}"] .abx-hot { cursor: pointer; outline: none; }
[data-figure="${ID}"] .abx-hot .abx-pill { fill: rgba(11, 16, 36, 0.72); stroke: rgba(242, 179, 61, 0.55); stroke-width: 1.2px; vector-effect: non-scaling-stroke; transition: fill 0.2s, stroke 0.2s; }
[data-figure="${ID}"] .abx-hot:hover .abx-pill { stroke: #F2B33D; }
[data-figure="${ID}"] .abx-hot.is-active .abx-pill { fill: rgba(242, 179, 61, 0.22); stroke: #FFD27A; stroke-width: 1.6px; }
[data-figure="${ID}"] .abx-hot:focus-visible .abx-pill { stroke: var(--stage-focus, #8EA2FF); stroke-width: 2.4px; }
[data-figure="${ID}"] .abx-hot .abx-plus { fill: none; stroke: #F2B33D; stroke-width: 1.6px; vector-effect: non-scaling-stroke; }
[data-figure="${ID}"] .abx-hot.is-active .abx-plus { opacity: 0; }
[data-figure="${ID}"] .abx-dim { transition: opacity 0.35s; }
[data-figure="${ID}"] .abx-note { font-size: var(--text-xs); font-family: var(--font-ui); color: var(--ink-3); }
[data-figure="${ID}"] .abx-hit { fill: transparent; cursor: pointer; }
[data-figure="${ID}"] .fig__controls .abx-add .btn__text { font-weight: 650; }
`;
function injectCSS() {
  if (document.getElementById(`${ID}-css`)) return;
  const s = document.createElement('style');
  s.id = `${ID}-css`;
  s.textContent = CSS;
  document.head.append(s);
}

// ------------------------------------------------------------------------------------ helpers
/** Point (x, y) in `node`'s local frame → coordinates in `frame` (rendered DOM). */
function mapPt(frame, node, x = 0, y = 0) {
  const m = frame.getScreenCTM().inverse().multiply(node.getScreenCTM());
  return { x: m.a * x + m.c * y + m.e, y: m.b * x + m.d * y + m.f };
}

/** Catmull-Rom through points [[x,y]…] → t ∈ [0,1] → [x, y]. */
function pathFn(pts) {
  const n = pts.length - 1;
  return (t) => {
    if (n <= 0) return pts[0];
    const u = clamp(t, 0, 1) * n;
    const k = Math.min(n - 1, Math.floor(u));
    const s = u - k;
    const p0 = pts[Math.max(0, k - 1)], p1 = pts[k], p2 = pts[k + 1], p3 = pts[Math.min(n, k + 2)];
    const c = (a, b, c2, d) => 0.5 * (2 * b + (-a + c2) * s + (2 * a - 5 * b + 4 * c2 - d) * s * s + (-a + 3 * b - 3 * c2 + d) * s * s * s);
    return [c(p0[0], p1[0], p2[0], p3[0]), c(p0[1], p1[1], p2[1], p3[1])];
  };
}

/** Spike heads of a library virus (local frame): parsed from its spikes path (M base L head …). */
function spikeHeads(vArt) {
  const p = vArt.querySelector('[data-part="spikes"] path');
  const nums = ((p && p.getAttribute('d')) || '').match(/-?\d*\.?\d+(?:e-?\d+)?/g) || [];
  const out = [];
  for (let i = 0; i + 3 < nums.length; i += 4) {
    const x = +nums[i + 2], y = +nums[i + 3];
    out.push({ x, y, a: angOf(x, y) });
  }
  return out;
}

export default function mount(fig, ctx) {
  injectCSS();
  const gsap = ctx.gsap;
  const S = (tag, attrs, parent) => ctx.svg(tag, attrs, parent);

  let mode = 'anatomy';
  let target = 'natural';
  const withAb = { block: false, flag: false, complement: false, nk: false };
  const added = { block: false, flag: false, complement: false, nk: false };
  let compact = ctx.compact;
  let current = null;            // { tl } of the playing scene
  let pausedByUs = false;
  let hot = null;                // active anatomy hotspot id
  let anat = null;               // anatomy handles

  ctx.setAspect(16 / 9, 4 / 5);
  ctx.tag('Not to scale');
  const svg = ctx.createSVG({ viewBox: '0 0 960 540', interactive: true, label: 'Antibody explorer' });

  // ------------------------------------------------------------------ chrome
  const card = ctx.ui.infoCard({ empty: 'Tap or hover over a label to explore each part of the antibody.' });
  const modes = ctx.ui.chips({
    label: 'Show', hideLabel: true, options: MODES, value: 'anatomy', required: true, parent: null,
    onChange: (v) => { if (v && v !== mode) setMode(v); },
  });
  modes.el.classList.add('abx-modes');
  (ctx.stage.closest('.fig__main') || ctx.stage).before(modes.el);

  const addBtn = ctx.ui.button({ label: 'Add antibodies', icon: 'plus', variant: 'primary', onClick: () => {
    added[mode] = true; withAb[mode] = true; abSeg.set('with'); render({ play: true }); syncControls(); syncCard();
    ctx.announce('Antibodies added. Replaying the scene with antibodies.');
  } });
  addBtn.el.classList.add('abx-add');
  const abSeg = ctx.ui.segmented({
    label: 'Antibodies', hideLabel: true, value: 'without',
    options: [{ value: 'without', label: 'Without antibodies' }, { value: 'with', label: 'With antibodies' }],
    onChange: (v) => { withAb[mode] = v === 'with'; render({ play: true }); syncCard(); },
  });
  const replayBtn = ctx.ui.button({ label: 'Replay', icon: 'replay', variant: 'ghost', onClick: () => replay() });
  ctx.ui.spacer();
  const targetSeg = ctx.ui.segmented({
    label: 'Target', value: 'natural',
    options: [{ value: 'natural', label: 'Bacterium' }, { value: 'cancer', label: 'Cancer cell' }],
    onChange: (v) => { target = v; render({ play: true }); syncCard(); },
  });

  // captions: the writer's five captions, one per mode, sharing one grid cell
  const capWrap = ctx.h('div', { class: 'fig__steps' });
  const capEls = MODES.map((m, i) => {
    const c = ctx.h('div', { class: 'fig__step', 'aria-hidden': 'true' }, ctx.h('p', { class: 'fig__step-text', html: ctx.steps[i]?.html || '' }));
    capWrap.append(c);
    return c;
  });
  ctx.caption.prepend(capWrap);

  function syncCaption() {
    const i = MODES.findIndex((m) => m.value === mode);
    capEls.forEach((c, k) => { c.classList.toggle('is-active', k === i); c.setAttribute('aria-hidden', String(k !== i)); });
  }

  function syncControls() {
    const job = mode !== 'anatomy';
    addBtn.el.hidden = !job || added[mode];
    abSeg.el.hidden = !job || !added[mode];
    replayBtn.el.hidden = !job;
    targetSeg.el.hidden = !TARGETS[mode];
    if (TARGETS[mode]) {
      const first = targetSeg.el.querySelector('.segmented__opt');
      if (first) first.lastChild.textContent = TARGETS[mode];
      targetSeg.set(target);
    }
    if (job) abSeg.set(withAb[mode] ? 'with' : 'without');
  }

  function syncCard() {
    if (mode === 'anatomy') {
      const h = HOTSPOTS.find((x) => x.id === hot);
      if (h) card.show({ kicker: 'Antibody anatomy', title: h.title, body: h.body });
      else card.hide();
      return;
    }
    const C = CARDS[mode];
    const st = withAb[mode] ? 'with' : 'without';
    let body = C[st];
    if (typeof body === 'object') body = body[target];
    if (TARGETS[mode] && target === 'cancer' && st === 'with') body += DRUG_NOTE;
    card.show({ kicker: C.kicker, title: st === 'with' ? 'With antibodies' : 'Without antibodies', body });
  }

  // ------------------------------------------------------------------ labels
  function label(parent, { x, y, text, anchor = 'start', to = null, cls = 't-label', from = null }) {
    const g = S('g', { class: 'abx-label' }, parent);
    if (to) {
      const sx = from ? from[0] : anchor === 'end' ? x + 5 : anchor === 'start' ? x - 5 : x;
      const sy = from ? from[1] : anchor === 'middle' ? (to[1] > y ? y + 6 : y - 19) : y - 5;
      S('line', { class: 'leader', x1: r2(sx), y1: r2(sy), x2: r2(to[0]), y2: r2(to[1]) }, g);
      S('circle', { class: 'leader-dot', cx: r2(to[0]), cy: r2(to[1]), r: 2.4 }, g);
    }
    S('text', { class: `${cls} t-halo${anchor === 'middle' ? ' t-mid' : anchor === 'end' ? ' t-end' : ''}`, x: r2(x), y: r2(y), text }, g);
    return g;
  }
  const show = (tl, node, at, dur = 0.5) => {
    node.setAttribute('opacity', '0');
    tl.fromTo(node, { attr: { opacity: 0 } }, { attr: { opacity: 1 }, duration: dur, ease: 'so.out', immediateRender: false }, at);
    return node;
  };
  const hide = (tl, node, at, dur = 0.5) => {
    if (!node.hasAttribute('opacity')) node.setAttribute('opacity', '1');
    tl.fromTo(node, { attr: { opacity: 1 } }, { attr: { opacity: 0 }, duration: dur, ease: 'so.in', immediateRender: false }, at);
    return node;
  };
  /** Tween an attribute transform string on a node (structurally identical from/to). */
  const tform = (tl, node, from, to, at, dur, ease = 'so.inOut') => {
    node.setAttribute('transform', from);
    tl.fromTo(node, { attr: { transform: from } }, { attr: { transform: to }, duration: dur, ease, immediateRender: false }, at);
  };
  /** A small glowing dot (complement protein, leaking contents). */
  function dot(parent, { r = 4.5, color = COMP, rim = COMP_RIM, glow = true } = {}) {
    const g = S('g', { opacity: 0 }, parent);
    if (glow) S('circle', { r: r2(r * 2.4), fill: dotGlow(color, 0.45) }, g);
    S('circle', { r: r2(r), fill: color, stroke: rim, strokeWidth: r2(Math.max(0.6, r * 0.18)) }, g);
    return g;
  }
  /** Fly a node along points (drive-based, seekable). */
  function fly(tl, node, pts, { at = 0, dur = 2, ease = 'sine.inOut', fadeIn = 0.15, fadeOut = 0, opacity = 1 } = {}) {
    const fn = pathFn(pts);
    const ez = gsap.parseEase(ease);
    node.setAttribute('transform', `translate(${r2(pts[0][0])} ${r2(pts[0][1])})`);
    node.setAttribute('opacity', '0');
    drive(tl, (p) => {
      const [x, y] = fn(ez(p));
      node.setAttribute('transform', `translate(${r2(x)} ${r2(y)})`);
      let o = fadeIn ? Math.min(1, p / fadeIn) : 1;
      if (fadeOut) o = Math.min(o, (1 - p) / fadeOut);
      node.setAttribute('opacity', String(r2(clamp(o, 0, 1) * opacity)));
    }, { duration: dur, pos: at });
  }
  /** Small crimson "⊣" disc (a blocked step, rule 10). */
  function blockMark(parent, x, y, size = 24) {
    const g = S('g', { transform: `translate(${r2(x)} ${r2(y)})`, opacity: 0 }, parent);
    S('circle', { r: r2(size * 0.62), fill: '#0B1024', 'fill-opacity': 0.82, stroke: ctx.colors.inhibit, strokeWidth: 1.6 }, g);
    ctx.iconSVG('block', { x: 0, y: 0, size, color: ctx.colors.inhibit, strokeWidth: 2.2 }, g);
    return g;
  }
  /** Local single-use prop: an Fc receptor — a small cup on a stalk that grabs antibody stems. */
  const fcReceptor = (color) => (o) => {
    const s = o.size;
    const g = S('g', { class: 'abx-fcr', 'data-mol': 'fc-receptor' });
    S('path', { d: `M0 ${r2(0.12 * s)}V${r2(-0.52 * s)}`, stroke: color, strokeWidth: r2(Math.max(1, 0.1 * s)), strokeLinecap: 'round', fill: 'none' }, g);
    S('path', { d: `M${r2(-0.32 * s)} ${r2(-1 * s)}Q${r2(-0.32 * s)} ${r2(-0.5 * s)} 0 ${r2(-0.5 * s)}Q${r2(0.32 * s)} ${r2(-0.5 * s)} ${r2(0.32 * s)} ${r2(-1 * s)}`, stroke: color, strokeWidth: r2(Math.max(1.3, 0.14 * s)), strokeLinecap: 'round', fill: 'none' }, g);
    return g;
  };
  /** Antibody in a scene: always the library IgG at high detail; drugs get the white outline. */
  const ab = (u, drug) => antibody({ size: u, detail: 'high', variant: drug ? 'therapeutic' : 'generic', stage: 'dark' });

  /** World points of a docked antibody's tip / Fc end, measured at the timeline's end state. */
  function abPoints(frame, abEl, u, arm = 'right') {
    const t = antibodyTips(u)[arm];
    return { tip: mapPt(frame, abEl, t[0], t[1]), fc: mapPt(frame, abEl, 0, 0), hinge: mapPt(frame, abEl, 0, -0.47 * u) };
  }

  /** "Tips bind" / "Fc stem" labels for one docked antibody, laid out from its geometry. */
  function abLabelPair(parent, pts, center, { side = -1, tipsD = 58, stemD = 44 } = {}) {
    const ox = pts.fc.x - center[0], oy = pts.fc.y - center[1];
    const d = Math.hypot(ox, oy) || 1;
    const out = [ox / d, oy / d];
    const perp = side < 0 ? [out[1], -out[0]] : [-out[1], out[0]];
    const anchorOf = (vx) => (vx > 0.35 ? 'start' : vx < -0.35 ? 'end' : 'middle');
    const T = { x: pts.tip.x + perp[0] * tipsD + out[0] * 4, y: pts.tip.y + perp[1] * tipsD + out[1] * 4 };
    const F = { x: pts.fc.x + out[0] * stemD, y: pts.fc.y + out[1] * stemD };
    const tips = label(parent, { x: T.x, y: T.y + (perp[1] > 0.35 ? 12 : 4), text: 'Fab arms bind', anchor: anchorOf(perp[0]), to: [pts.tip.x, pts.tip.y] });
    const stem = label(parent, { x: F.x, y: F.y + (out[1] > 0.35 ? 12 : 4), text: 'Fc region', anchor: anchorOf(out[0]), to: [pts.fc.x, pts.fc.y] });
    return [tips, stem];
  }

  /** Inverted antibodies (both tips on the surface, stem out) on an art node's outline (local frame). */
  function coatInverted(tl, host, outline, spots, u, { at = 0.1, stagger = 0.13, dur = 0.9, drop = 26 } = {}) {
    const items = [];
    spots.forEach((s, i) => {
      const rot = angOf(s.nx, s.ny) + 90;
      const w = S('g', { transform: `translate(${r2(s.x)} ${r2(s.y)}) rotate(${r2(rot)})` }, host);
      const inner = S('g', {}, w);
      const a = ab(u, false);
      inner.append(invert(a, u));
      tform(tl, inner, `translate(0 ${-drop})`, 'translate(0 0)', at + i * stagger, dur, 'so.out');
      show(tl, inner, at + i * stagger, dur * 0.6);
      items.push({ wrap: w, ab: a, s });
    });
    return items;
  }

  // ================================================================== ANATOMY
  function drawAnatomy() {
    const D = compact
      ? { cx: 200, cy: 262, u: 262,
        pills: { tips: { x: 200, y: 50, a: 'middle' }, hinge: { x: 58, y: 300, a: 'middle' }, fc: { x: 318, y: 404, a: 'middle' }, chains: { x: 118, y: 452, a: 'middle' } } }
      : { cx: 470, cy: 290, u: 352,
        pills: { tips: { x: 470, y: 46, a: 'middle' }, hinge: { x: 236, y: 318, a: 'middle' }, fc: { x: 700, y: 410, a: 'middle' }, chains: { x: 742, y: 238, a: 'middle' } } };
    const { cx, cy, u } = D;
    const root = S('g', {}, svg);
    const glowG = S('g', {}, root);
    const A = antibody({ size: u, detail: 'high', anchor: 'center', variant: 'generic', stage: 'dark' });
    A.setAttribute('transform', `translate(${cx} ${cy})`);
    root.append(A);
    const inner = A.firstElementChild;                 // translate(0 0.5u): base-anchored frame
    const oy = 0.5 * u;                                // inner frame → scene: (cx + x, cy + oy + y)
    const W = (x, y) => [cx + x, cy + oy + y];

    // arm geometry (mirrors the library's antibody(): hinge −0.47u, arms 36° off vertical, La 0.56u)
    const hingeY = -0.47 * u, ang = 36 * DEG, La = 0.56 * u;
    const arm = (s) => {
      const dx = s * Math.sin(ang), dy = -Math.cos(ang), px = s * Math.cos(ang), py = Math.sin(ang);
      const ox = s * 0.035 * u, oyA = hingeY - 0.015 * u;
      return { s, ox, oy: oyA, at: (t, off) => [ox + dx * La * t + px * off, oyA + dy * La * t + py * off] };
    };
    const ARM = { left: arm(-1), right: arm(1) };

    // Split the CDR loops so each arm can swivel as one piece with its own loops.
    const cdrG = inner.querySelector(':scope > [data-part="cdr"]');
    const cdrPath = cdrG && cdrG.querySelector('path');
    const subs = cdrPath ? (cdrPath.getAttribute('d').match(/M[^M]+/g) || []) : [];
    const arms = {};
    const E = { fc: inner.querySelector('[data-part="fc"]'), hinge: inner.querySelector('[data-part="hinge"]') };
    ['left', 'right'].forEach((side, k) => {
      const fab = inner.querySelector(`[data-part="fab-${side}"]`);
      const w = S('g', { 'data-arm': side });
      fab.before(w);
      const G = ARM[side];
      // soft glow behind the variable tip (the tips are brighter than the frame)
      const tipC = G.at(0.8, 0.034 * u);
      const halo = S('ellipse', { cx: r2(tipC[0]), cy: r2(tipC[1]), rx: r2(0.16 * u), ry: r2(0.2 * u), fill: dotGlow('#FFD98A', 0.55), opacity: 0.85, class: 'abx-dim' }, w);
      halo.setAttribute('transform', `rotate(${r2(G.s * 36)} ${r2(tipC[0])} ${r2(tipC[1])})`);
      w.append(fab);
      if (subs[k] && cdrPath) {
        const p = cdrPath.cloneNode(false);
        p.setAttribute('d', subs[k]);
        const cg = S('g', { 'data-part': `cdr-${side}` }, w);
        cg.append(p);
        arms[side] = { w, G, halo, fab, cdr: cg, kids: [...fab.children] };
      } else arms[side] = { w, G, halo, fab, cdr: null, kids: [...fab.children] };
    });
    if (cdrG) cdrG.remove();
    [E.fc, E.hinge].forEach((n) => n && n.classList.add('abx-dim'));
    for (const a of Object.values(arms)) { a.kids.forEach((n) => n.classList.add('abx-dim')); a.cdr?.classList.add('abx-dim'); }

    // overlays (hidden until a hotspot is active)
    const over = S('g', { 'pointer-events': 'none' }, inner);
    const hingeGlow = S('ellipse', { cx: 0, cy: r2(hingeY), rx: r2(0.12 * u), ry: r2(0.08 * u), fill: dotGlow('#FFE3A3', 0.55), opacity: 0, class: 'abx-dim' }, over);
    inner.insertBefore(hingeGlow, inner.firstChild);
    const fcGlow = S('rect', { x: r2(-0.2 * u), y: r2(-0.47 * u), width: r2(0.4 * u), height: r2(0.5 * u), rx: r2(0.12 * u), fill: dotGlow('#FFE3A3', 0.42), opacity: 0, class: 'abx-dim' });
    inner.insertBefore(fcGlow, inner.firstChild);
    const chainG = S('g', { opacity: 0, class: 'abx-dim', 'pointer-events': 'none' });
    const heavyCol = '#FFD27A', lightCol = '#FFFFFF';
    const hw = r2(Math.max(2, 0.02 * u)), lw = r2(Math.max(1.6, 0.014 * u));
    const armChains = {};
    for (const side of ['left', 'right']) {
      const G = arms[side].G;
      const cg = S('g', { opacity: 0, class: 'abx-dim', 'pointer-events': 'none' }, arms[side].w);
      const h0 = G.at(1.0, -0.02 * u), h1 = G.at(0, -0.02 * u), l0 = G.at(1.0, 0.088 * u), l1 = G.at(0.15, 0.088 * u);
      S('path', { d: `M${r2(h0[0])} ${r2(h0[1])}L${r2(h1[0])} ${r2(h1[1])}`, stroke: heavyCol, strokeWidth: hw, strokeLinecap: 'round', fill: 'none' }, cg);
      S('path', { d: `M${r2(l0[0])} ${r2(l0[1])}L${r2(l1[0])} ${r2(l1[1])}`, stroke: lightCol, strokeWidth: lw, strokeLinecap: 'round', strokeDasharray: `${r2(lw * 2.2)} ${r2(lw * 2)}`, fill: 'none' }, cg);
      armChains[side] = cg;
      const s = G.s;
      S('path', { d: `M${r2(G.ox)} ${r2(G.oy)}L${r2(s * 0.062 * u)} ${r2(-0.44 * u)}V${r2(-0.03 * u)}`, stroke: heavyCol, strokeWidth: hw, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' }, chainG);
    }
    inner.append(chainG);

    // swivel state (ambient) and moving-leader bookkeeping
    const rot = { left: 0, right: 0 };
    const tipLocal = (side) => arms[side].G.at(1.07, 0.034 * u);
    const rotPt = (side, p) => {
      const G = arms[side].G, a = rot[side] * DEG, c = Math.cos(a), s2 = Math.sin(a);
      const x = p[0] - G.ox, y = p[1] - G.oy;
      return [G.ox + x * c - y * s2, G.oy + x * s2 + y * c];
    };
    const movers = [];
    const applyRot = () => {
      for (const side of ['left', 'right']) {
        const G = arms[side].G;
        arms[side].w.setAttribute('transform', `rotate(${r2(rot[side])} ${r2(G.ox)} ${r2(G.oy)})`);
      }
      for (const m of movers) {
        const [x, y] = W(...rotPt(m.side, m.local));
        m.line.setAttribute('x2', r2(x)); m.line.setAttribute('y2', r2(y));
        m.dot.setAttribute('cx', r2(x)); m.dot.setAttribute('cy', r2(y));
      }
    };

    // hotspots: pills with leaders (focusable buttons) + hit areas on the molecule
    const pillLayer = S('g', {}, root);
    const hots = {};
    const targets = {
      tips: [{ side: 'left', local: tipLocal('left') }, { side: 'right', local: tipLocal('right') }],
      hinge: [{ pt: W(0, hingeY + 0.01 * u) }],
      fc: [{ pt: W(0.07 * u, -0.22 * u) }],
      chains: compact ? [{ side: 'left', local: ARM.left.at(0.32, 0.088 * u) }] : [{ side: 'right', local: ARM.right.at(0.32, -0.02 * u) }],
    };
    for (const h of HOTSPOTS) {
      const P = D.pills[h.id];
      const g = S('g', { class: 'abx-hot', tabindex: 0, role: 'button', 'aria-label': `${h.label}: show details`, 'aria-pressed': 'false' }, pillLayer);
      const leaders = S('g', {}, g);
      const pill = S('rect', { class: 'abx-pill', rx: 15, ry: 15, height: 30 }, g);
      const txt = S('text', { class: 't-label t-mid', x: P.x + 8, y: P.y + 5, text: h.label }, g);
      const plus = S('path', { class: 'abx-plus' }, g);
      let w = 120;
      try { w = txt.getComputedTextLength(); } catch (e) { /* not rendered */ }
      const pw = w + 46;
      pill.setAttribute('x', r2(P.x - pw / 2)); pill.setAttribute('y', P.y - 15); pill.setAttribute('width', r2(pw));
      // generous invisible tap target (≥ 44 px on phones)
      const padH = compact ? 52 : 40;
      const hitR = S('rect', { x: r2(P.x - pw / 2 - 6), y: r2(P.y - padH / 2), width: r2(pw + 12), height: padH, fill: 'transparent' });
      g.insertBefore(hitR, g.firstChild);
      txt.setAttribute('x', r2(P.x + 8));
      const px = P.x - pw / 2 + 17;
      plus.setAttribute('d', `M${r2(px - 5)} ${P.y}H${r2(px + 5)}M${r2(px)} ${P.y - 5}V${P.y + 5}`);
      for (const t of targets[h.id]) {
        const end = t.pt || W(...t.local);
        const sy = end[1] > P.y ? P.y + 15 : P.y - 15;
        const line = S('line', { class: 'leader', x1: r2(clamp(end[0], P.x - pw / 2 + 12, P.x + pw / 2 - 12)), y1: sy, x2: r2(end[0]), y2: r2(end[1]) }, leaders);
        const d = S('circle', { class: 'leader-dot', cx: r2(end[0]), cy: r2(end[1]), r: 2.6 }, leaders);
        if (t.side) movers.push({ side: t.side, local: t.local, line, dot: d });
      }
      // order: leaders under the pill
      g.insertBefore(leaders, pill);
      g.addEventListener('click', () => setHot(h.id, true));
      g.addEventListener('focus', () => setHot(h.id));
      g.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') setHot(h.id); });
      g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setHot(h.id, true); } });
      hots[h.id] = g;
    }
    // hit areas on the molecule itself (pointer only; the pills are the keyboard targets)
    const hitLayer = S('g', {}, root);
    hitLayer.parentNode.insertBefore(hitLayer, pillLayer);
    const hit = (id, el) => { el.classList.add('abx-hit'); el.addEventListener('click', () => setHot(id, true)); el.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') setHot(id); }); };
    for (const side of ['left', 'right']) {
      const c = W(...ARM[side].at(0.8, 0.034 * u));
      hit('tips', S('circle', { cx: r2(c[0]), cy: r2(c[1]), r: r2(0.15 * u) }, hitLayer));
      const m = W(...ARM[side].at(0.3, 0.034 * u));
      hit('chains', S('circle', { cx: r2(m[0]), cy: r2(m[1]), r: r2(0.1 * u) }, hitLayer));
    }
    const hc = W(0, hingeY);
    hit('hinge', S('circle', { cx: r2(hc[0]), cy: r2(hc[1]), r: r2(0.07 * u) }, hitLayer));
    const f0 = W(-0.13 * u, -0.42 * u);
    hit('fc', S('rect', { x: r2(f0[0]), y: r2(f0[1]), width: r2(0.26 * u), height: r2(0.42 * u), rx: 8 }, hitLayer));

    // ambient hinge swivel (±14°, two independent rhythms) — never under reduced motion
    const sw = { l: 0, r: 0 };
    const upd = () => { rot.left = -12 * sw.l; rot.right = 12 * sw.r; applyRot(); };
    const twL = gsap.fromTo(sw, { l: -1 }, { l: 1, duration: 3.6, ease: 'sine.inOut', repeat: -1, yoyo: true, onUpdate: upd });
    const twR = gsap.fromTo(sw, { r: 0.9 }, { r: -1, duration: 4.4, ease: 'sine.inOut', repeat: -1, yoyo: true, onUpdate: upd });
    ctx.ambient(twL); ctx.ambient(twR);
    if (ctx.reducedMotion) { sw.l = 0; sw.r = 0; }
    upd();

    anat = {
      kill() { twL.kill(); twR.kill(); },
      paint() {
        for (const [id, g] of Object.entries(hots)) { g.classList.toggle('is-active', id === hot); g.setAttribute('aria-pressed', String(id === hot)); }
        const dim = (n, on) => n && (n.style.opacity = on ? '0.3' : '');
        const t = hot === 'tips', hg = hot === 'hinge', f = hot === 'fc', ch = hot === 'chains';
        dim(E.fc, t || hg); dim(E.hinge, t || f);
        for (const a of Object.values(arms)) {
          a.kids.forEach((n) => dim(n, n.getAttribute('data-part')?.startsWith('variable') ? (hg || f) : (t || hg || f)));
          dim(a.cdr, hg || f);
          a.halo.style.opacity = t ? '1' : (hg || f) ? '0.15' : '';
        }
        hingeGlow.style.opacity = hg ? '1' : '0';
        fcGlow.style.opacity = f ? '1' : '0';
        chainG.style.opacity = ch ? '1' : '0';
        armChains.left.style.opacity = ch ? '1' : '0';
        armChains.right.style.opacity = ch ? '1' : '0';
        chainLabels.forEach((n) => (n.style.opacity = ch ? '1' : '0'));
      },
    };
    // chain legend (visible with the chains hotspot)
    const chainLabels = [];
    const lg = S('g', { class: 'abx-dim', 'pointer-events': 'none' }, root);
    const LX = compact ? 228 : 610, LY = compact ? 470 : 486;
    S('line', { x1: LX, y1: LY - 5, x2: LX + 26, y2: LY - 5, stroke: heavyCol, strokeWidth: 3.2, strokeLinecap: 'round' }, lg);
    S('text', { class: 't-small', x: LX + 34, y: LY, text: 'heavy chain' }, lg);
    const LX2 = compact ? 228 : 760, LY2 = compact ? 494 : LY;
    S('line', { x1: LX2, y1: LY2 - 5, x2: LX2 + 26, y2: LY2 - 5, stroke: lightCol, strokeWidth: 2.4, strokeLinecap: 'round', strokeDasharray: '5 4' }, lg);
    S('text', { class: 't-small', x: LX2 + 34, y: LY2, text: 'light chain' }, lg);
    lg.style.opacity = '0';
    chainLabels.push(lg);
    anat.paint();
  }

  function setHot(id, fromClick = false) {
    if (mode !== 'anatomy') return;
    if (hot === id && !fromClick) return;
    hot = id;
    anat?.paint();
    syncCard();
  }

  // ================================================================== SCENES
  // Each scene: build(S) appends rigs / art into S.cells and labels into S.labels, tweens to S.tl,
  // and returns { before } (a representative time just before the key event).
  function newScene(host, comp) {
    const cells = S('g', {}, host);
    const labels = S('g', {}, host);
    return { host, cells, labels, tl: gsap.timeline({ paused: true }), compact: comp, withAb: !!withAb[mode], cancer: target === 'cancer' && !!TARGETS[mode] };
  }

  // ------------------------------------------------------------------ Block (neutralization)
  function sceneBlock(Z) {
    const c = Z.compact;
    const L = c
      ? { cell: [200, 398, 92], rec: 26, arc: [236, 304], vr: 20, u: 22,
        v: [{ at: [80, 96], dock: 1, away: [[150, 226], [64, 168]], inn: [-34, -30] }, { at: [322, 84], dock: 2, away: [[262, 214], [338, 150]], inn: [30, -24] }],
        lab: { dock: 3, dockAt: [384, 276, 'end'], cell: [200, 490, 'middle'], inLab: [24, 262, 'start'] } }
      : { cell: [790, 284, 148], rec: 32, arc: [134, 226], vr: 26, u: 24,
        v: [{ at: [196, 168], dock: 2, away: [[470, 196], [226, 94]], inn: [-58, -34] }, { at: [150, 410], dock: 1, away: [[440, 390], [210, 474]], inn: [-50, 40] }],
        lab: { dock: 0, dockAt: [560, 470, 'end'], cell: [830, 478, 'middle'], inLab: [596, 130, 'end'] } };
    const { tl } = Z;
    const cellArt = healthyCell({ r: L.cell[2], seed: 4, mhc: false, stage: 'dark' });
    const docks = placeOnMembrane(cellArt, (o) => receptor({ ...o, profile: 'round', color: DOCK }), { count: 4, arcStart: L.arc[0], arcEnd: L.arc[1], size: L.rec, seed: 2, layer: 'docks' });
    const C = rig(cellArt, { x: L.cell[0], y: L.cell[1], parent: Z.cells });
    const dockInfo = (k) => {
      const g = docks[k];
      const head = mapPt(Z.cells, g, 0, -0.95 * L.rec);
      const base = mapPt(Z.cells, g, 0, 0);
      return { head, base, axis: angOf(head.x - base.x, head.y - base.y) };
    };
    const V = L.v.map((spec, i) => {
      const D = dockInfo(spec.dock);
      const vArt = virus({ r: L.vr, seed: 3 + i * 4, spikes: 12, stage: 'dark' });
      const heads = spikeHeads(vArt);
      const phi = D.axis + 180 - heads[0].a;
      const wrap = S('g', { transform: `rotate(${r2(phi)})` });
      wrap.append(vArt);
      const R = rig(wrap, { x: spec.at[0], y: spec.at[1], parent: Z.cells, name: 'virus' });
      R.r = L.vr * 1.5;
      return { R, D, wrap, heads, phi, spec };
    });
    const n = (D) => dirv(D.axis);
    const lab = L.lab;
    // the "Virus" label rides along with the first virus
    const lVirus = label(V[0].R.layers.over, { x: 0, y: -L.vr * 1.62 - 8, text: 'Virus', anchor: 'middle' });
    label(Z.labels, { x: lab.cell[0], y: lab.cell[1], text: 'Body cell', anchor: lab.cell[2] });
    const dk = dockInfo(lab.dock);
    label(Z.labels, { x: lab.dockAt[0], y: lab.dockAt[1], text: 'Entry receptor', anchor: lab.dockAt[2], to: [dk.head.x + (c ? 3 : -2), dk.head.y + (c ? -3 : 3)] });

    let before = 1.4;
    if (!Z.withAb) {
      hide(tl, lVirus, 2.1, 0.5);
      V.forEach((v, i) => {
        const t0 = 0.3 + i * 1.3;
        const nn = n(v.D);
        const P = add(v.D.head, nn, 1.42 * L.vr - 0.08 * L.rec);
        const mid = [(v.spec.at[0] + P.x) / 2 + nn[1] * 30, (v.spec.at[1] + P.y) / 2 - nn[0] * 30];
        move(tl, v.R, { x: P.x, y: P.y, via: [mid], duration: 2.1, pos: t0, stretch: 0 });
        const inP = { x: L.cell[0] + v.spec.inn[0], y: L.cell[1] + v.spec.inn[1] };
        move(tl, v.R, { x: inP.x, y: inP.y, opacity: 0.66, duration: 1.9, pos: t0 + 2.6, stretch: 0 });
        tform(tl, v.R.layers.idle, 'scale(1)', 'scale(0.6)', t0 + 2.6, 1.9);
      });
      const v0 = { x: L.cell[0] + L.v[0].inn[0], y: L.cell[1] + L.v[0].inn[1] };
      const inLab = label(Z.labels, { x: lab.inLab[0], y: lab.inLab[1], text: 'Viruses get in', anchor: lab.inLab[2], to: [v0.x - (c ? 10 : 4), v0.y - L.vr * 0.7] });
      show(tl, inLab, 5.4, 0.6);
      before = 1.5;
    } else {
      // natural antibodies (gold, no outline) cap the spikes that face the cell
      let first = null;
      V.forEach((v, i) => {
        const abG = S('g', {}, v.R.layers.idle);
        const offs = [0, -30, 30, -60, 60, -120, 120];
        offs.forEach((off, j) => {
          const want = v.heads[0].a + off;
          const dA = (h) => Math.abs(((h.a - want + 540) % 360) - 180);
          const sp = v.heads.reduce((b, h) => (dA(h) < dA(b) ? h : b), v.heads[0]);
          const proxy = S('g', { transform: `translate(${r2(sp.x)} ${r2(sp.y)}) rotate(${r2(sp.a + 90)})` }, v.wrap);
          S('rect', { x: -0.5, y: r2(-0.14 * L.vr), width: 1, height: r2(0.14 * L.vr), fill: 'none' }, proxy);
          const a = ab(L.u, false);
          abG.append(a);
          const arm = off < 0 ? 'left' : 'right';
          dockAntibody(tl, a, proxy, { size: L.u, arm, duration: 1.3, pos: 0.15 + i * 0.5 + j * 0.2 });
          if (!first && i === 0 && j === 0) first = { a, arm };
        });
      });
      tl.progress(1, true);
      const pts = abPoints(Z.cells, first.a, L.u, first.arm);
      tl.progress(0, true);
      const tipsL = label(Z.labels, c ? { x: pts.tip.x + 30, y: pts.tip.y + 50, text: 'Fab arms bind', anchor: 'start', to: [pts.tip.x, pts.tip.y] }
        : { x: pts.tip.x + 6, y: pts.tip.y - 70, text: 'Fab arms bind', anchor: 'middle', to: [pts.tip.x, pts.tip.y] });
      const stemL = label(Z.labels, c ? { x: pts.fc.x + 40, y: pts.fc.y + 12, text: 'Fc region', anchor: 'start', to: [pts.fc.x, pts.fc.y] }
        : { x: pts.fc.x + 10, y: pts.fc.y + 70, text: 'Fc region', anchor: 'middle', to: [pts.fc.x, pts.fc.y] });
      show(tl, tipsL, 1.6); show(tl, stemL, 1.8);
      hide(tl, tipsL, 3.3); hide(tl, stemL, 3.3);
      hide(tl, lVirus, 1.2, 0.5);
      V.forEach((v, i) => {
        const t0 = 3.4 + i * 0.9;
        const nn = n(v.D);
        const B = add(v.D.head, nn, 1.55 * L.vr + 1.0 * L.u + 3);
        const mid = [(v.spec.at[0] + B.x) / 2 + nn[1] * 26, (v.spec.at[1] + B.y) / 2 - nn[0] * 26];
        move(tl, v.R, { x: B.x, y: B.y, via: [mid], duration: 1.9, pos: t0, stretch: 0 });
        const B2 = add(B, nn, 18);
        move(tl, v.R, { x: B2.x, y: B2.y, duration: 0.45, ease: 'so.out', pos: t0 + 1.95, stretch: 0 });
        move(tl, v.R, { x: v.spec.away[1][0], y: v.spec.away[1][1], via: [v.spec.away[0]], duration: 2.6, pos: t0 + 2.45, stretch: 0 });
        if (i === 0) {
          const M = add(v.D.head, nn, 0.36 * L.u);
          const bm = blockMark(Z.labels, M.x, M.y, c ? 20 : 22);
          show(tl, bm, t0 + 1.7, 0.5);
          const cl = label(Z.labels, c ? { x: M.x - 24, y: M.y - 22, text: 'Can’t attach', anchor: 'end' } : { x: M.x - 22, y: M.y - 26, text: 'Can’t attach', anchor: 'end' });
          show(tl, cl, t0 + 1.9, 0.5);
        }
      });
      before = 4.6;
    }
    return { before };
  }

  // ------------------------------------------------------------------ Flag for eating (opsonization)
  function sceneFlag(Z) {
    const c = Z.compact, cancer = Z.cancer;
    const L = c
      ? { t: [200, 112], tr: 52, cr: 50, m: [200, 392], mr: 148, u: 22, fcS: 16 }
      : { t: [296, 268], tr: 66, cr: 64, m: [742, 300], mr: 176, u: 24, fcS: 18 };
    const { tl } = Z;
    const dirTM = angOf(L.m[0] - L.t[0], L.m[1] - L.t[1]);     // target → macrophage
    const pol = dirTM + 180;                                     // the macrophage faces the target
    const macCol = PALETTE.m1;
    const fcCol = mix(macCol, WHITE, 0.45);
    const macArt = (state) => {
      const a = macrophage({ r: L.mr, seed: 3, state, polarity: pol, stage: 'dark' });
      placeOnMembrane(a, fcReceptor(fcCol), { count: 9, arcStart: pol - 58, arcEnd: pol + 58, size: L.fcS, seed: 4, layer: 'fc-receptors' });
      return a;
    };
    const M = rig(macArt('resting'), { x: L.m[0], y: L.m[1], parent: Z.cells, name: 'macrophage' });
    const vacG = S('g', {}, Z.cells);
    const tArt = cancer
      ? cancerCell({ r: L.cr, seed: 9, mhc: false, stage: 'dark' })
      : bacterium({ shape: 'rod', r: L.tr, seed: 5, angle: 0, stage: 'dark' });
    let ags = [];
    if (cancer) ags = placeOnMembrane(tArt, (o) => antigen({ ...o, shape: 'circle' }), { count: 12, size: c ? 16 : 17, seed: 11, layer: 'antigens' });
    const T = rig(tArt, { x: L.t[0], y: L.t[1], parent: Z.cells, name: 'target' });
    const tName = cancer ? 'Cancer cell' : 'Bacterium';
    const nTM = dirv(dirTM), perp = dirv(dirTM + 90);
    const tLab = label(Z.labels, c ? { x: 16, y: 56, text: tName, anchor: 'start', to: [L.t[0] - (cancer ? 46 : 58), L.t[1] - (cancer ? 20 : 8)] }
      : { x: L.t[0] - 70, y: L.t[1] + (cancer ? 132 : 110), text: tName, anchor: 'middle', to: [L.t[0] - 34, L.t[1] + (cancer ? 62 : 30)] });
    if (c) label(Z.labels, { x: 26, y: 486, text: 'Macrophage', anchor: 'start' });
    else label(M.layers.over, { x: 30, y: L.mr * 0.86, text: 'Macrophage', anchor: 'middle' });
    const fcPt = mapPt(Z.cells, M.art.querySelector('[data-part="fc-receptors"]').children[c ? 7 : 1], 0, -L.fcS);
    const fr = [fcPt.x - L.m[0], fcPt.y - L.m[1]];            // rides along with the macrophage
    const fcLab = label(M.layers.over, c ? { x: 380 - L.m[0], y: 300 - L.m[1], text: 'Fc receptors', anchor: 'end', to: fr }
      : { x: fr[0] + 30, y: fr[1] - 70, text: 'Fc receptors', anchor: 'start', to: fr });

    let before = 1.6;
    if (!Z.withAb) {
      if (!cancer) {
        approach(tl, M, T, { gap: 3, duration: 2.3, pos: 0.3 });
        hide(tl, fcLab, 2.0, 0.5);
        const ct = contact(M, T, { gap: 3 });
        // the grip slips: the bacterium slides along the edge and away
        const P = add({ x: L.t[0], y: L.t[1] }, perp, c ? 64 : -74);
        const P2 = add(P, nTM, c ? -14 : -22);
        move(tl, T, { x: P2.x, y: P2.y, via: [[P.x, P.y]], duration: 1.5, pos: 3.0, stretch: 0 });
        const Mf = add({ x: M.plan.x, y: M.plan.y }, nTM, -10);
        move(tl, M, { x: Mf.x, y: Mf.y, duration: 1.2, pos: 3.1 });
        const sl = label(Z.labels, c ? { x: ct.cx + 34, y: ct.cy + 8, text: 'Binds poorly', anchor: 'start' } : { x: ct.cx + 10, y: ct.cy + 104, text: 'Binds poorly', anchor: 'middle' });
        show(tl, sl, 3.4, 0.6);
        before = 2.0;
      } else {
        probe(tl, M, T, { match: false, gap: 3, hold: 0.9, duration: 2.3, pos: 0.3 });
        hide(tl, fcLab, 2.0, 0.5);
        const back = add({ x: L.m[0], y: L.m[1] }, nTM, 14);
        move(tl, M, { x: back.x, y: back.y, duration: 1.8, pos: 3.6 });
        const ct = contact(M, T, { gap: 3 });
        const sl = label(Z.labels, c ? { x: ct.cx + 30, y: ct.cy - 72, text: 'Nothing to bind', anchor: 'start' } : { x: ct.cx, y: ct.cy - 112, text: 'Nothing to bind', anchor: 'middle' });
        show(tl, sl, 2.9, 0.6);
        before = 2.0;
      }
      return { before };
    }

    // WITH antibodies: coat the target
    const abG = S('g', {}, T.layers.idle);
    let first;
    if (!cancer) {
      const info = cellInfo(tArt);
      const spots = samplePerimeter(info.outline, 12, { offset: 0.25 });
      const items = coatInverted(tl, abG, info.outline, spots, L.u, { at: 0.15, stagger: 0.12 });
      const want = c ? -170 : -165;
      const dA = (it) => Math.abs(((angOf(it.s.nx, it.s.ny) - want + 540) % 360) - 180);
      const up = items.reduce((b, it) => (dA(it) < dA(b) ? it : b), items[0]);
      first = { a: up.ab, arm: 'right' };
    } else {
      ags.forEach((g, i) => {
        const a = ab(L.u, true);
        abG.append(a);
        dockAntibody(tl, a, g, { size: L.u, arm: i % 2 ? 'left' : 'right', duration: 1.2, pos: 0.15 + i * 0.12 });
      });
      const pick = ags.reduce((b, g, i) => {
        const p = mapPt(Z.cells, g, 0, 0);
        const sc = -Math.abs(((angOf(p.x - L.t[0], p.y - L.t[1]) - (c ? -170 : -165) + 540) % 360) - 180);
        return sc > b.sc ? { sc, i } : b;
      }, { sc: -Infinity, i: 0 });
      first = { a: abG.children[pick.i].querySelector('[data-mol="antibody"]') || abG.children[pick.i], arm: pick.i % 2 ? 'left' : 'right' };
    }
    tl.progress(1, true);
    const pts = abPoints(Z.cells, first.a, L.u, first.arm);
    tl.progress(0, true);
    const [tipsL, stemL] = abLabelPair(Z.labels, pts, L.t, { side: 1, tipsD: c ? 54 : 62, stemD: c ? 30 : 40 });
    show(tl, tipsL, 1.7); show(tl, stemL, 1.9);
    hide(tl, fcLab, 2.6, 0.5);
    // the macrophage arrives; its Fc receptors grab the stems
    const gap = cancer ? (c ? 40 : 44) : (c ? 28 : 30);
    approach(tl, M, T, { gap, duration: 2.1, pos: 2.6 });
    const ct = contact(M, T, { gap });
    recognize(tl, M, { x: ct.cx, y: ct.cy }, { radius: c ? 14 : 18, duration: 1.4, hold: false, pos: 4.6 });
    const gl = label(Z.labels, c ? { x: 384, y: 468, text: 'Fc receptors bind Fc regions', anchor: 'end' }
      : { x: ct.cx - 10, y: ct.cy + 150, text: 'Fc receptors bind Fc regions', anchor: 'middle', to: [ct.cx, ct.cy + 24] });
    show(tl, gl, 4.9, 0.6);
    hide(tl, gl, 7.4, 0.5);
    if (c) { hide(tl, tipsL, 4.4); hide(tl, stemL, 4.4); }
    // engulf: the macrophage opens a cup; the target (coat and all) moves into a bubble
    const eng = macArt('engulfing');
    swap(tl, M, eng, { duration: 0.9, pos: 6.0 });
    const mouth = cellInfo(eng).mouth;
    const Mx = M.plan.x, My = M.plan.y;
    const mouthW = { x: Mx + mouth.x, y: My + mouth.y };
    const inside = add({ x: Mx, y: My }, nTM, -L.mr * 0.16);
    move(tl, T, { x: mouthW.x, y: mouthW.y, duration: 1.2, pos: 6.2, stretch: 0 });
    move(tl, T, { x: inside.x, y: inside.y, duration: 1.6, pos: 7.4, stretch: 0 });
    tform(tl, T.layers.idle, 'scale(1)', 'scale(0.6)', 7.2, 1.8);
    const vr = (cancer ? L.cr : L.tr) * 0.72;
    const vac = vesicle({ kind: 'endosome', r: vr, cargo: 0, seed: 3, stage: 'dark' });
    const vw = S('g', { transform: `translate(${r2(inside.x)} ${r2(inside.y)})` }, vacG);
    vw.append(vac);
    show(tl, vw, 8.3, 0.9);
    swap(tl, M, macArt('resting'), { duration: 1.0, pos: 8.5 });
    if (!c) { hide(tl, tipsL, 6.0); hide(tl, stemL, 6.0); }
    hide(tl, tLab, 6.0, 0.5);
    const sw = label(Z.labels, c ? { x: 24, y: 250, text: 'Engulfed', anchor: 'start', to: [inside.x - vr * 0.7, inside.y - vr * 0.7] }
      : { x: inside.x - 190, y: inside.y + 150, text: 'Engulfed', anchor: 'middle', to: [inside.x - vr * 0.72, inside.y + vr * 0.72] });
    show(tl, sw, 9.0, 0.6);
    before = 5.4;
    return { before };
  }

  // ------------------------------------------------------------------ Complement
  function sceneComplement(Z) {
    const c = Z.compact, cancer = Z.cancer;
    const L = c ? { t: [200, 262], tr: 100, cr: 92, u: 22, pr: 11, key: [24, 486] }
      : { t: [440, 282], tr: 128, cr: 104, u: 24, pr: 13, key: [40, 506] };
    const { tl } = Z;
    const tArt = cancer
      ? cancerCell({ r: L.cr, seed: 13, mhc: false, stage: 'dark' })
      : bacterium({ shape: 'rod', r: L.tr, seed: 8, angle: 0, stage: 'dark' });
    // antibody targets in clusters (and two loners)
    const CL = [{ a: -128, n: 3 }, { a: -58, n: 3 }, { a: 98, n: 3 }];
    const LONE = [175, 28];
    let agGroups = [];
    if (cancer) {
      agGroups = CL.map((k, i) => placeOnMembrane(tArt, (o) => antigen({ ...o, shape: 'circle' }), { count: k.n, arcStart: k.a - 15, arcEnd: k.a + 15, size: 17, seed: 20 + i, layer: 'antigens' }));
      LONE.forEach((a, i) => agGroups.push(placeOnMembrane(tArt, (o) => antigen({ ...o, shape: 'circle' }), { count: 1, arcStart: a - 3, arcEnd: a + 3, size: 17, seed: 30 + i, layer: 'antigens' })));
    }
    const T = rig(tArt, { x: L.t[0], y: L.t[1], parent: Z.cells, name: 'target' });
    const tName = cancer ? 'Cancer cell' : 'Bacterium';
    label(Z.labels, c ? { x: 26, y: 70, text: tName, anchor: 'start' } : { x: L.t[0] + (cancer ? 150 : 170), y: L.t[1] + 130, text: tName, anchor: 'start', to: [L.t[0] + (cancer ? 84 : 112), L.t[1] + 40] });
    // key: what a complement protein looks like
    const key = S('g', { transform: `translate(${L.key[0]} ${L.key[1]})` }, Z.labels);
    const kd = dot(key, { r: 5 }); kd.setAttribute('opacity', 1); kd.setAttribute('transform', 'translate(6 -5)');
    S('text', { class: 't-small', x: 20, y: 0, text: 'Complement protein' }, key);

    const rnd = ctx.random(cancer ? 71 : 37);
    const W = c ? 400 : 960, H = c ? 500 : 540;
    const fluid = S('g', {}, Z.cells);
    Z.cells.insertBefore(fluid, Z.cells.firstChild);
    const passers = (count, t0, span, avoid = 1) => {
      for (let i = 0; i < count; i++) {
        const d = dot(fluid, { r: c ? 3.8 : 4.4 });
        const y0 = rnd.range(30, H - 30);
        const fromTop = rnd() < 0.35;
        const p0 = fromTop ? [rnd.range(40, W - 120), -12] : [-14, y0];
        const p2 = fromTop ? [rnd.range(80, W - 40), H + 14] : [W + 14, clamp(y0 + rnd.range(-120, 120), 20, H - 20)];
        let mid = [(p0[0] + p2[0]) / 2 + rnd.range(-60, 60), (p0[1] + p2[1]) / 2 + rnd.range(-60, 60)];
        const dx = mid[0] - L.t[0], dy = mid[1] - L.t[1];
        const rr = Math.hypot(dx, dy), minR = (cancer ? L.cr : L.tr) * (c ? 1.2 : 1.05) + 30 * avoid;
        if (rr < minR) mid = [L.t[0] + (dx / (rr || 1)) * minR, L.t[1] + (dy / (rr || 1)) * minR];
        fly(tl, d, [p0, mid, p2], { at: t0 + (i / count) * span + rnd.range(0, 0.4), dur: rnd.range(4.2, 6.2), ease: 'none', fadeIn: 0.08, fadeOut: 0.08 });
      }
    };

    let before = 1.5;
    if (!Z.withAb) {
      passers(c ? 12 : 18, 0, 3.4);
      // two brush the surface and leave
      const info = cellInfo(tArt);
      const sp = samplePerimeter(info.outline, 8, { offset: 0.3 });
      [sp[1], sp[5]].forEach((s, i) => {
        const d = dot(fluid, { r: c ? 3.8 : 4.4 });
        const P = [L.t[0] + s.x + s.nx * 7, L.t[1] + s.y + s.ny * 7];
        const A = [P[0] + s.nx * 160 - s.ny * 90, P[1] + s.ny * 160 + s.nx * 90];
        const B = [P[0] + s.nx * 170 + s.ny * 110, P[1] + s.ny * 170 - s.nx * 110];
        fly(tl, d, [A, P, B], { at: 0.8 + i * 1.3, dur: 4.2, ease: 'sine.inOut', fadeIn: 0.12, fadeOut: 0.12 });
      });
      const fl = label(Z.labels, c ? { x: 200, y: 424, text: 'Few bind', anchor: 'middle' } : { x: L.t[0], y: L.t[1] + 150, text: 'Few bind', anchor: 'middle' });
      show(tl, fl, 4.4, 0.6);
      tl.to({}, { duration: 0.1 }, 6.6);
      return { before: 2.4 };
    }

    // WITH antibodies
    const abG = S('g', {}, T.layers.idle);
    const clusterFc = [];       // per cluster: list of Fc points (rig-local)
    let firstLone = null;
    const toLocal = (p) => ({ x: p.x - L.t[0], y: p.y - L.t[1] });
    if (!cancer) {
      const info = cellInfo(tArt);
      const all = samplePerimeter(info.outline, c ? 30 : 34, { offset: 0.5 });
      const near = (a) => all.reduce((b, s, i) => {
        const d = Math.abs(((angOf(s.x, s.y) - a + 540) % 360) - 180);
        return d < b.d ? { d, i } : b;
      }, { d: 999, i: 0 }).i;
      const spots = [];
      const groups = [];
      CL.forEach((k) => { const i0 = near(k.a); const g = [i0 - 1, i0, i0 + 1].map((j) => all[(j + all.length) % all.length]); groups.push(g); spots.push(...g); });
      LONE.forEach((a) => spots.push(all[near(a)]));
      const items = coatInverted(tl, abG, info.outline, spots, L.u, { at: 0.15, stagger: 0.14 });
      tl.progress(1, true);
      groups.forEach((g, gi) => clusterFc.push(items.slice(gi * 3, gi * 3 + 3).map((it) => toLocal(mapPt(Z.cells, it.ab, 0, 0)))));
      const lone = items[items.length - 2];
      firstLone = { pts: abPoints(Z.cells, lone.ab, L.u), s: lone.s };
      tl.progress(0, true);
    } else {
      const abs = [];
      let k = 0;
      agGroups.forEach((grp, gi) => grp.forEach((g, j) => {
        const a = ab(L.u, true);
        abG.append(a);
        dockAntibody(tl, a, g, { size: L.u, arm: 'right', duration: 1.2, pos: 0.15 + k * 0.13 });
        abs.push({ a, gi });
        k++;
      }));
      tl.progress(1, true);
      CL.forEach((_, gi) => clusterFc.push(abs.filter((x) => x.gi === gi).map((x) => toLocal(mapPt(Z.cells, x.a, 0, 0)))));
      const lone = abs.find((x) => x.gi === CL.length);
      firstLone = { pts: abPoints(Z.cells, lone.a, L.u) };
      tl.progress(0, true);
    }
    const lp = firstLone.pts;
    const tipsL = label(Z.labels, c ? { x: lp.tip.x - 8, y: lp.tip.y + 50, text: 'Fab arms bind', anchor: 'start', to: [lp.tip.x, lp.tip.y] }
      : { x: lp.tip.x - 40, y: lp.tip.y + 66, text: 'Fab arms bind', anchor: 'middle', to: [lp.tip.x, lp.tip.y] });
    const stemL = label(Z.labels, c ? { x: lp.fc.x - 6, y: lp.fc.y - 34, text: 'Fc region', anchor: 'start', to: [lp.fc.x, lp.fc.y] }
      : { x: lp.fc.x - 44, y: lp.fc.y - 26, text: 'Fc region', anchor: 'end', to: [lp.fc.x, lp.fc.y] });
    show(tl, tipsL, 1.9); show(tl, stemL, 2.1);
    hide(tl, tipsL, 4.6); hide(tl, stemL, 4.6);

    const cen = clusterFc.map((list) => {
      const x = list.reduce((s, p) => s + p.x, 0) / list.length, y = list.reduce((s, p) => s + p.y, 0) / list.length;
      const d = Math.hypot(x, y) || 1;
      return { x, y, nx: x / d, ny: y / d };
    });
    const tags = S('g', {}, T.layers.idle);
    // 1) the first complement proteins latch on where stems cluster
    cen.forEach((p, i) => {
      const d = dot(tags, { r: c ? 5.6 : 6.4 });
      const P = [p.x + p.nx * 6, p.y + p.ny * 6];
      const A = [P[0] + p.nx * 220 + p.ny * 90, P[1] + p.ny * 220 - p.nx * 90];
      fly(tl, d, [A, [P[0] + p.nx * 70, P[1] + p.ny * 70], P], { at: 2.4 + i * 0.35, dur: 2.0, ease: 'so.out' });
    });
    const cl1 = cen[0];
    const latch = label(Z.labels, c ? { x: 24, y: 120, text: 'Binds clustered Fc regions', anchor: 'start', to: [L.t[0] + cl1.x + cl1.nx * 8, L.t[1] + cl1.y + cl1.ny * 8] }
      : { x: L.t[0] + cl1.x - 70, y: L.t[1] + cl1.y - 74, text: 'Binds clustered Fc regions', anchor: 'end', to: [L.t[0] + cl1.x + cl1.nx * 8, L.t[1] + cl1.y + cl1.ny * 8] });
    show(tl, latch, 4.1, 0.5);
    hide(tl, latch, 6.4, 0.5);
    // a passer near the lone antibody does not stick
    passers(c ? 6 : 9, 2.2, 3.0, 1);
    // 2) cascade: many more deposit on the surface (tagging)
    const info = cellInfo(tArt);
    const surf = samplePerimeter(info.outline, 48, { offset: 0.1 });
    const angs = cen.map((p) => angOf(p.x, p.y));
    const deposit = surf.filter((s) => angs.some((a) => Math.abs(((angOf(s.x, s.y) - a + 540) % 360) - 180) < 40));
    deposit.forEach((s, i) => {
      if (i % 2) return;
      const d = dot(tags, { r: c ? 3.2 : 3.6, glow: false });
      const P = [s.x + s.nx * 4, s.y + s.ny * 4];
      const A = [P[0] + s.nx * 120 + s.ny * 40, P[1] + s.ny * 120 - s.nx * 40];
      fly(tl, d, [A, P], { at: 4.6 + (i % 9) * 0.16 + (i > 9 ? 0.25 : 0), dur: 1.3, ease: 'so.out' });
    });
    // 3) pores assemble in the membrane (top view rings), then it leaks and collapses
    const pores = cen.slice(0, 2).map((p) => ({ x: p.x * (cancer ? 0.55 : 0.62), y: p.y * (cancer ? 0.55 : 0.45) }));
    const poreG = S('g', {}, T.layers.idle);
    pores.forEach((P, pi) => {
      const g = S('g', { transform: `translate(${r2(P.x)} ${r2(P.y)})` }, poreG);
      const hole = S('circle', { r: r2(L.pr * 0.62), fill: '#0B1024', 'fill-opacity': 0.88 }, g);
      show(tl, hole, 7.0 + pi * 0.3, 0.6);
      const nSub = 10;
      for (let k = 0; k < nSub; k++) {
        const a = (k / nSub) * 360;
        const [vx, vy] = dirv(a);
        const sub = S('line', { x1: r2(vx * L.pr * 0.62), y1: r2(vy * L.pr * 0.62), x2: r2(vx * L.pr * 1.15), y2: r2(vy * L.pr * 1.15), stroke: COMP, strokeWidth: c ? 3 : 3.6, strokeLinecap: 'round' }, g);
        const t = 6.0 + pi * 0.3 + k * 0.09;
        tform(tl, sub, `translate(${r2(vx * 14)} ${r2(vy * 14)})`, 'translate(0 0)', t, 0.5, 'so.out');
        show(tl, sub, t, 0.3);
      }
    });
    const p0 = pores[0];
    const poreL = label(Z.labels, c ? { x: 376, y: 132, text: 'Pore', anchor: 'end', to: [L.t[0] + p0.x + 6, L.t[1] + p0.y - 6] }
      : { x: L.t[0] + p0.x - 30, y: L.t[1] + p0.y - 150, text: 'Pore', anchor: 'middle', to: [L.t[0] + p0.x, L.t[1] + p0.y - L.pr - 3] });
    show(tl, poreL, 7.3, 0.5);
    // leaking contents (scene frame)
    const leakCol = cancer ? mix(PALETTE.cancer, WHITE, 0.35) : mix(PALETTE.bacteria, WHITE, 0.3);
    pores.forEach((P, pi) => {
      for (let k = 0; k < 7; k++) {
        const d = dot(Z.cells, { r: 2, color: leakCol, rim: leakCol, glow: false });
        const a = angOf(P.x, P.y) + rnd.range(-70, 70);
        const [vx, vy] = dirv(a);
        const s0 = [L.t[0] + P.x, L.t[1] + P.y];
        const dist = rnd.range(40, 90) + (cancer ? L.cr : L.tr * 0.4);
        fly(tl, d, [s0, [s0[0] + vx * dist * 0.5, s0[1] + vy * dist * 0.5], [s0[0] + vx * dist, s0[1] + vy * dist]], { at: 7.8 + pi * 0.2 + k * 0.18, dur: 1.9, ease: 'so.out', fadeIn: 0.1, fadeOut: 0.5 });
      }
    });
    tform(tl, T.layers.idle, 'scale(1 1)', cancer ? 'scale(0.9 0.86)' : 'scale(0.97 0.8)', 8.0, 2.0);
    T.art.setAttribute('opacity', '1');
    tl.fromTo(T.art, { attr: { opacity: 1 } }, { attr: { opacity: 0.45 }, duration: 2.0, immediateRender: false }, 8.0);
    const end = label(Z.labels, c ? { x: 200, y: 436, text: cancer ? 'Leaks and dies' : 'Leaks and collapses', anchor: 'middle' }
      : { x: L.t[0], y: L.t[1] + (cancer ? 168 : 150), text: cancer ? 'Leaks and dies' : 'Leaks and collapses', anchor: 'middle' });
    show(tl, end, 9.0, 0.6);
    before = 4.3;
    return { before };
  }

  // ------------------------------------------------------------------ Recruit NK cells (ADCC)
  function sceneNK(Z) {
    const c = Z.compact, cancer = Z.cancer;
    const L = c
      ? { t: [200, 132], tr: 74, nk: [200, 404], nr: 52, u: 22, ag: 16, fcS: 15, away: [330, 470] }
      : { t: [310, 278], tr: 100, nk: [760, 300], nr: 64, u: 24, ag: 18, fcS: 17, away: [800, 120] };
    const { tl } = Z;
    const dirTN = angOf(L.nk[0] - L.t[0], L.nk[1] - L.t[1]);
    const nkArt = nkCell({ r: L.nr, seed: 5, receptors: false, stage: 'dark' });
    placeOnMembrane(nkArt, fcReceptor(mix(PALETTE.nk, WHITE, 0.45)), { count: 14, size: L.fcS, seed: 6, layer: 'fc-receptors' });
    const N = rig(nkArt, { x: L.nk[0], y: L.nk[1], parent: Z.cells, name: 'nk' });
    const tArt = cancer
      ? cancerCell({ r: L.tr * 0.95, seed: 9, mhc: false, stage: 'dark' })
      : healthyCell({ r: L.tr, seed: 6, state: 'infected', mhc: false, stage: 'dark' });
    const ags = placeOnMembrane(tArt, (o) => antigen({ ...o, shape: 'circle', color: cancer ? undefined : PALETTE.virus }), { count: 14, size: L.ag, seed: 12, layer: 'antigens' });
    const T = rig(tArt, { x: L.t[0], y: L.t[1], parent: Z.cells, name: 'target' });
    const tName = cancer ? 'Cancer cell' : 'Infected cell';
    // phones: the target label points up at the target; the NK label rides along with the NK cell
    label(Z.labels, c ? { x: 118, y: 238, text: tName, anchor: 'end', to: [L.t[0] - L.tr * 0.62, L.t[1] + L.tr * 0.6] } : { x: L.t[0], y: L.t[1] + L.tr + 62, text: tName, anchor: 'middle' });
    if (c) label(N.layers.over, { x: -(L.nr + 14), y: 6, text: 'NK cell', anchor: 'end' });
    else label(N.layers.over, { x: 0, y: L.nr + 46, text: 'NK cell', anchor: 'middle' });
    const cups = [...N.art.querySelector('[data-part="fc-receptors"]').children];
    const cupWant = c ? 20 : -55;
    const cupA = (g) => Math.abs(((+g.getAttribute('data-angle') - cupWant + 540) % 360) - 180);
    const cup = cups.reduce((b, g) => (cupA(g) < cupA(b) ? g : b), cups[0]);
    const cupPt = mapPt(Z.cells, cup, 0, -L.fcS);
    const cr = [cupPt.x - L.nk[0] + 2, cupPt.y - L.nk[1] - 2];   // rides along with the NK cell
    const fcLab = label(N.layers.over, c ? { x: 384 - L.nk[0], y: 330 - L.nk[1], text: 'Fc receptors', anchor: 'end', to: cr }
      : { x: cr[0] + 40, y: cr[1] - 50, text: 'Fc receptors', anchor: 'start', to: cr });
    const agPick = ags.reduce((b, g) => {
      const p = mapPt(Z.cells, g, 0, -0.96 * L.ag);
      const sc = c ? -p.y - Math.abs(p.x - 140) : -p.y - p.x * 0.4;
      return sc > b.sc ? { sc, p } : b;
    }, { sc: -Infinity, p: null }).p;
    const agLab = label(Z.labels, c ? { x: 384, y: 62, text: cancer ? 'Target protein' : 'Viral protein', anchor: 'end', to: [agPick.x + 3, agPick.y - 3] }
      : { x: agPick.x + 120, y: agPick.y - 34, text: cancer ? 'Target protein' : 'Viral protein', anchor: 'start', to: [agPick.x + 4, agPick.y - 2] });

    let before = 1.6;
    if (!Z.withAb) {
      probe(tl, N, T, { match: false, gap: 3, hold: 0.9, duration: 2.4, pos: 0.3 });
      hide(tl, fcLab, 1.6, 0.5);
      move(tl, N, { x: L.away[0], y: L.away[1], via: [[(L.nk[0] + L.away[0]) / 2 + (c ? 60 : -20), (L.nk[1] + L.away[1]) / 2 + (c ? -40 : 30)]], duration: 2.4, pos: 3.8 });
      const ct = contact(N, T, { gap: 3 });
      const ml = label(Z.labels, c ? { x: 376, y: 300, text: 'Moves on', anchor: 'end' } : { x: 560, y: 470, text: 'Moves on', anchor: 'middle' });
      show(tl, ml, 4.4, 0.6);
      return { before: 2.2, ct };
    }

    // antibodies dock onto the target proteins facing the NK side (and a few others)
    const abG = S('g', {}, T.layers.idle);
    const chosen = ags.filter((g) => {
      const b = mapPt(Z.cells, g, 0, 0);
      const a = angOf(b.x - L.t[0], b.y - L.t[1]);
      return Math.abs(((a - dirTN + 540) % 360) - 180) < 80;
    });
    const others = ags.filter((g) => !chosen.includes(g)).filter((_, i) => i % 3 === 0);
    const list = [...chosen, ...others];
    const docked = list.map((g, i) => {
      const a = ab(L.u, cancer);
      abG.append(a);
      dockAntibody(tl, a, g, { size: L.u, arm: i % 2 ? 'left' : 'right', duration: 1.3, pos: 0.15 + i * 0.16 });
      return { a, arm: i % 2 ? 'left' : 'right', g };
    });
    hide(tl, agLab, 1.2, 0.5);
    hide(tl, fcLab, 3.2, 0.5);
    tl.progress(1, true);
    const lab = docked.find((d) => d.g === agPick) || docked[0];
    const near = docked.reduce((b, d) => {
      const p = abPoints(Z.cells, d.a, L.u, d.arm);
      const want = c ? -15 : -40;
      const sc = -Math.abs(((angOf(p.fc.x - L.t[0], p.fc.y - L.t[1]) - want + 540) % 360) - 180);
      return sc > b.sc ? { sc, d, p } : b;
    }, { sc: -Infinity, d: lab, p: null });
    const pts = near.p || abPoints(Z.cells, lab.a, L.u, lab.arm);
    tl.progress(0, true);
    const [tipsL, stemL] = abLabelPair(Z.labels, pts, L.t, { side: c ? -1 : 1, tipsD: c ? 50 : 60, stemD: c ? 30 : 40 });
    show(tl, tipsL, 1.9); show(tl, stemL, 2.1);
    hide(tl, tipsL, 3.4); hide(tl, stemL, 3.4);

    // the NK cell arrives; its Fc receptors grab the stems; then the shared kill grammar (orange)
    const g1 = (c ? 46 : 50) + 10, g2 = c ? 44 : 48;
    approach(tl, N, T, { gap: g1, duration: 2.2, pos: 3.2 });
    const P = contact(N, T, { gap: g2 * 2 });
    dock(tl, N, { x: P.cx, y: P.cy }, { flatten: 0.12, duration: 0.9 });
    const mid = contact(N, T, { gap: g2 });
    recognize(tl, N, { x: mid.cx, y: mid.cy }, { radius: c ? 14 : 18, duration: 1.4, hold: false });
    const gl = label(Z.labels, c ? { x: 200, y: 420, text: 'Fc receptors bind Fc regions', anchor: 'middle' }
      : { x: mid.cx, y: mid.cy - 140, text: 'Fc receptors bind Fc regions', anchor: 'middle', to: [mid.cx, mid.cy - 22] });   // above: the target and NK labels sit below
    const kStart = tl.duration();
    show(tl, gl, kStart - 1.2, 0.6);
    const K = kill(tl, N, T, { dock: false, duration: 3.0, pos: kStart + 0.2 });
    hide(tl, gl, K.marks.dying + 0.4, 0.5);
    // antibodies go down with the dying cell
    abG.setAttribute('opacity', '1');
    tl.fromTo(abG, { attr: { opacity: 1 } }, { attr: { opacity: 0 }, duration: 1.6, immediateRender: false }, K.marks.dying + 0.4);
    const endL = label(Z.labels, c ? { x: 200, y: 232, text: 'Target dies by apoptosis', anchor: 'middle' }
      : { x: L.t[0], y: L.t[1] + L.tr + 96, text: 'Target dies by apoptosis', anchor: 'middle' });
    show(tl, endL, K.marks.dying + 1.4, 0.6);
    before = kStart - 0.9;
    return { before };
  }

  const BUILD = { block: sceneBlock, flag: sceneFlag, complement: sceneComplement, nk: sceneNK };

  // ================================================================== render
  function clear() {
    if (current?.tl) current.tl.kill();
    current = null;
    anat?.kill();
    anat = null;
    for (const n of [...svg.children]) if (n !== svg.defs) n.remove();
  }

  function render({ play = false } = {}) {
    clear();
    const rm = ctx.reducedMotion;
    if (mode === 'anatomy') {
      ctx.setAspect(16 / 9, 4 / 5);
      svg.setAttribute('viewBox', compact ? '0 0 400 500' : '0 0 960 540');
      drawAnatomy();
      ctx.refreshTextScale();
      return;
    }
    const build = BUILD[mode];
    if (rm) {
      // two-panel still: BEFORE / AFTER of the chosen state (portrait panels)
      ctx.setAspect(16 / 9, 400 / 1060);
      svg.setAttribute('viewBox', compact ? '0 0 400 1060' : '0 0 960 540');
      const spots = compact ? [[0, 40], [0, 560]] : [[40, 34], [520, 34]];
      ['Before', 'After'].forEach((name, i) => {
        const host = S('g', { transform: `translate(${spots[i][0]} ${spots[i][1]})` }, svg);
        const Z = newScene(host, true);
        const r = build(Z);
        Z.tl.progress(1, true);
        if (i === 0) Z.tl.seek(r.before, true);
        const hx = compact ? 200 : spots[i][0] + 200;
        const hy = compact ? spots[i][1] - 14 : 22;
        S('text', { class: 't-caps t-mid', x: hx, y: hy, text: name }, svg);
      });
      if (compact) S('line', { x1: 24, x2: 376, y1: 532, y2: 532, stroke: 'rgba(233,236,246,0.18)', strokeWidth: 1 }, svg);
      else S('line', { x1: 480, x2: 480, y1: 36, y2: 520, stroke: 'rgba(233,236,246,0.18)', strokeWidth: 1 }, svg);
      ctx.refreshTextScale();
      return;
    }
    ctx.setAspect(16 / 9, 4 / 5);
    svg.setAttribute('viewBox', compact ? '0 0 400 500' : '0 0 960 540');
    const host = S('g', {}, svg);
    const Z = newScene(host, compact);
    S('text', { class: 't-caps', x: compact ? 16 : 24, y: compact ? 22 : 30, text: withAb[mode] ? 'With antibodies' : 'Without antibodies' }, host);
    build(Z);
    Z.tl.progress(1, true).progress(0, true);
    current = { tl: Z.tl };
    ctx.refreshTextScale();
    if (play && ctx.visible) Z.tl.play(0);
    else if (play) Z.tl.progress(0);
    else Z.tl.progress(1, true);
  }

  function replay() {
    if (mode === 'anatomy') return;
    if (ctx.reducedMotion) { render(); return; }
    if (current?.tl) { pausedByUs = false; current.tl.restart(); }
    else render({ play: true });
  }

  function setMode(m) {
    mode = m;
    if (m !== 'anatomy') hot = null;
    modes.set(m);
    syncControls();
    syncCaption();
    syncCard();
    render({ play: true });
    ctx.announce(`${MODES.find((x) => x.value === m).label}. ${ctx.steps[MODES.findIndex((x) => x.value === m)]?.text || ''}`);
  }

  ctx.onResize(({ compact: cmp }) => {
    if (cmp === compact && svg.childElementCount > 1) return;
    compact = cmp;
    render({ play: false });
  });

  syncControls();
  syncCaption();
  syncCard();
  render();

  return {
    pause() { if (current?.tl && current.tl.isActive()) { current.tl.pause(); pausedByUs = true; } },
    resume() { if (pausedByUs && current?.tl) { pausedByUs = false; current.tl.resume(); } },
    destroy() { clear(); },
  };
}
