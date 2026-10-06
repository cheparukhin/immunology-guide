// ch02-nk-missing-self — "The missing-self balance" (explorer, dark stage).
//
// An NK cell touches a target cell. Two sliders set how full the target's MHC class I
// "shop window" is and how many stress flags it shows; a balance weighs STOP (−) against
// GO (+) and a verdict badge reads ✓ Spared / ≈ Undecided / ✕ Killed. Presets and the
// "Let the NK cell decide" button run the decision with the shared kill grammar
// (cell-actions.kill, orange, FIGURE-AUDIT §4 rule 6). The model is the writer's, verbatim:
//   I = window · A = 0.2 + 0.8 × flags · net = A − I
//   Killed if net ≥ 0.15 · Spared if net ≤ −0.10 · otherwise Undecided · tilt = clamp(net) × 18°
// Shop windows are drawn exactly as in ch04-mhc1-pathway / ch04-cross-presentation:
// mhc1 with the same square pockets + seated anchors (rule 3: self sand, foreign hot pink).
import {
  nkCell, healthyCell, cancerCell, mhc1, stressLigand, nkInhibitory, nkActivating, signalIcon,
  cellInfo, rayHit, breathe, PALETTE, mix, dotGlow, el,
} from '../art/index.js';
import { rig, kill, move, polarize, fxLayer } from './shared/cell-actions.js';

const DEG = Math.PI / 180;
const POCKETS = ['square', 'square'];           // this body's class I grooves (same in every ch02/ch04 figure)
const ANCHORS = ['square', 'square'];
const CUP_ORDER = [0, 4, 2, 6, 1, 7, 3, 5];      // which of the 8 window slots fill first (even spread)
const FLAG_ORDER = [0, 7, 4, 3, 2, 5, 6, 1];
const ZONE = 50;                                  // half-width (deg) of the contact zone on the target

const PRESETS = [
  { value: 'healthy', label: 'Healthy cell', type: 'healthy', win: 1.0, flags: 0.05 },
  { value: 'infected', label: 'Virus-infected cell hiding from T cells', type: 'infected', win: 0.15, flags: 0.7 },
  { value: 'kept', label: 'Cancer cell that kept its window', type: 'cancer', win: 0.9, flags: 0.55 },
  { value: 'emptied', label: 'Cancer cell that emptied its window', type: 'cancer', win: 0.1, flags: 0.65 },
];
const TYPE_LABEL = { healthy: 'Healthy cell', infected: 'Virus-infected cell', cancer: 'Cancer cell' };
const VERDICT = {
  killed: { kind: 'no', label: 'Killed' },
  spared: { kind: 'yes', label: 'Spared' },
  undecided: { kind: 'partial', label: 'Undecided' },
};

const LAYOUTS = {
  wide: {
    vb: [1000, 600], tg: [636, 404], tgR: 112, nkR: 84, axis: 180, cup: 28, flag: 26, rec: 24,
    pivot: [500, 84], beam: 420, pan: 124, str: 58, wt: 16, hollowNote: 'side',
    shopLabel: { x: 796, y: 296, anchor: 'start' }, flagLabel: { x: 806, y: 528, anchor: 'start' }, tgLabel: { x: 636, y: 578 }, nkLabel: { dx: -34, anchor: 'end' },
  },
  tall: {
    vb: [420, 640], tg: [210, 466], tgR: 90, nkR: 66, axis: -90, cup: 24, flag: 22, rec: 22,
    pivot: [210, 80], beam: 240, pan: 100, str: 46, wt: 14, hollowNote: 'legend',
    shopLabel: { x: 12, y: 380, anchor: 'start', short: true }, flagLabel: { x: 408, y: 380, anchor: 'end', short: true }, tgLabel: { x: 210, y: 618 }, nkLabel: { dx: -26, anchor: 'end' },
  },
};

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const angDiff = (a, b) => ((((b - a) % 360) + 540) % 360) - 180;

function model(win, flags) {
  const I = win;
  const A = 0.2 + 0.8 * flags;
  const net = Math.round((A - I) * 1000) / 1000;
  const verdict = net >= 0.15 ? 'killed' : net <= -0.1 ? 'spared' : 'undecided';
  return { I, A, net, verdict, tilt: clamp(net, -1, 1) * 18, cups: Math.round(win * 8), flags: Math.round(flags * 8) };
}

function tNote(type, win, cups) {
  if (cups === 0) return 'With no window at all, a killer T cell cannot detect this cell.';
  if (type === 'healthy') return 'A killer T cell would find only normal fragments and move on.';
  if (win >= 0.3) return 'A killer T cell can inspect this window and may recognize the abnormal fragments (Chapters 4–5).';
  return 'With few windows left, a killer T cell may miss this cell.';
}

const windowWord = (v) => { const c = Math.round(v * 8); return c === 8 ? 'Full' : c >= 5 ? 'Mostly full' : c >= 3 ? 'Half empty' : c >= 1 ? 'Nearly empty' : 'Empty'; };
const flagWord = (v) => { const c = Math.round(v * 8); return c === 0 ? 'None' : c <= 2 ? 'A few' : c <= 5 ? 'Some' : 'Many'; };

const CSS = `
[data-figure="ch02-nk-missing-self"] .nk-readout { display: flex; flex-direction: column; align-items: center; gap: 0.35rem; text-align: center; font-family: var(--font-ui); pointer-events: none; }
[data-figure="ch02-nk-missing-self"] .fig__stage > .nk-readout { position: absolute; z-index: 4; left: 50%; top: 25.5%; width: 28%; transform: translateX(-50%); }
[data-figure="ch02-nk-missing-self"] .nk-readout .badge { font-size: var(--text-sm); }
[data-figure="ch02-nk-missing-self"] .nk-readout p { margin: 0; font-size: var(--text-xs); line-height: 1.4; color: var(--fg-2); text-wrap: balance; }
[data-figure="ch02-nk-missing-self"] .nk-readout .nk-note2 { color: var(--fg); font-weight: 560; }
[data-figure="ch02-nk-missing-self"] .nk-below { margin-top: var(--s-3); display: flex; flex-direction: column; gap: var(--s-2); }
[data-figure="ch02-nk-missing-self"] .nk-below .nk-readout { --fg: var(--ink); --fg-2: var(--ink-2); align-items: flex-start; text-align: left; }
[data-figure="ch02-nk-missing-self"] .nk-foot { margin: 0; font-family: var(--font-ui); font-size: var(--text-xs); line-height: 1.45; color: var(--ink-3); }
[data-figure="ch02-nk-missing-self"] .nk-presets { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--s-2); flex-basis: 100%; }
[data-figure="ch02-nk-missing-self"] .nk-presets .btn { height: auto; min-height: var(--btn-h); padding-block: 0.4rem; white-space: normal; text-align: center; line-height: 1.25; justify-content: center; }
[data-figure="ch02-nk-missing-self"].is-compact .nk-presets { grid-template-columns: repeat(2, minmax(0, 1fr)); }
[data-figure="ch02-nk-missing-self"] .nk-sliders { display: flex; flex-wrap: wrap; gap: var(--s-3) var(--s-5); flex-basis: 100%; }
[data-figure="ch02-nk-missing-self"] .nk-sliders .slider { flex: 1 1 16rem; }
[data-figure="ch02-nk-missing-self"] [hidden] { display: none !important; }
`;

export default function mount(fig, ctx) {
  const { gsap } = ctx;
  if (!document.getElementById('css-ch02-nk-missing-self')) {
    document.head.append(ctx.h('style', { id: 'css-ch02-nk-missing-self' }, CSS));
  }
  ctx.setAspect(1000 / 600, 420 / 640);
  ctx.tag('Simplified model');
  const svg = ctx.createSVG({ viewBox: '0 0 1000 600' });

  const state = { type: 'healthy', win: 1.0, flags: 0.05, preset: 'healthy' };
  let L = LAYOUTS[ctx.compact ? 'tall' : 'wide'];
  let layoutName = ctx.compact ? 'tall' : 'wide';
  let S = {};                  // scene handles
  let tl = null;               // the running decision timeline
  let dirty = false;           // the scene was changed by a decision animation
  let pulse = null;            // undecided pulse (ambient)
  let breatheH = null;
  let shownTilt = 0;
  const tiltProxy = { t: 0 };

  // ------------------------------------------------------------------ HTML readout + footnote
  const readout = ctx.h('div', { class: 'nk-readout', 'aria-live': 'polite' });
  const badgeHost = ctx.h('div');
  const note = ctx.h('p', { class: 'nk-note' });
  const note2 = ctx.h('p', { class: 'nk-note2', hidden: true }, 'Hiding from T cells made it visible to this NK cell.');
  readout.append(badgeHost, note, note2);
  const below = ctx.h('div', { class: 'nk-below' });
  const foot = ctx.h('p', { class: 'nk-foot' }, 'Shows only how the decision works once an NK cell touches a cell. In real solid tumors, NK cells often fail to get in at all.');
  below.append(foot);
  ctx.stage.after(below);
  const placeReadout = () => {
    if (layoutName === 'tall') below.prepend(readout);
    else ctx.stage.append(readout);
  };

  // ------------------------------------------------------------------ drawing helpers
  const S_ = (tag, attrs, parent) => ctx.svg(tag, attrs, parent);

  /** Seat a glyph on a cell's membrane at angle `deg` (cell frame); returns base + outward normal. */
  function seat(art, glyph, deg, layer = 'receptors') {
    const h = rayHit(cellInfo(art).outline, deg * DEG);
    const nd = Math.atan2(h.ny, h.nx) / DEG;
    glyph.setAttribute('transform', `translate(${h.x.toFixed(2)} ${h.y.toFixed(2)}) rotate(${(nd + 90).toFixed(2)})`);
    let host = art.querySelector(`:scope > [data-part="${layer}"]`);
    if (!host) { host = el('g', { 'data-part': layer }); art.append(host); }
    host.append(glyph);
    return { x: h.x, y: h.y, nx: h.nx, ny: h.ny };
  }

  function shopWindow(size, peptide) {
    return mhc1({ size, peptide, pockets: POCKETS, anchors: ANCHORS, stage: 'dark', detail: 'high' });
  }
  function flagGlyph(size) {
    const g = stressLigand({ size, stage: 'dark', detail: 'high' });
    g.append(signalIcon({ type: 'activating', size: Math.max(8, size * 0.36), y: size * 0.34 }));
    return g;
  }

  function targetArt() {
    const r = L.tgR;
    if (state.type === 'cancer') return cancerCell({ r, seed: 21, mhc: false, stage: 'dark', nuclei: 1 });
    return healthyCell({ r, seed: 7, mhc: false, state: state.type === 'infected' ? 'infected' : 'healthy', stage: 'dark', sides: 6 });
  }

  // target slot angles (target frame): cups at axis + j·45°, flags at axis + 22.5° + i·45°
  const cupAngle = (j) => L.axis + j * 45;
  const flagAngle = (i) => L.axis + 22.5 + i * 45;

  // ------------------------------------------------------------------ full draw
  function draw() {
    if (tl) { tl.kill(); tl = null; }
    if (pulse) { pulse.kill(); pulse = null; }
    if (breatheH) { breatheH.stop?.(); breatheH = null; }
    dirty = false;
    L = LAYOUTS[layoutName];
    for (const c of [...svg.children]) if (c !== svg.defs) c.remove();
    svg.setAttribute('viewBox', `0 0 ${L.vb[0]} ${L.vb[1]}`);
    ctx.refreshTextScale();

    const balanceG = S_('g', { 'data-part': 'balance' }, svg);
    const cellsG = S_('g', { 'data-part': 'cells' }, svg);
    const labelsG = S_('g', { 'data-part': 'labels' }, svg);

    // Target first (its outline sets the contact geometry).
    const tArt = targetArt();
    const tg = rig(tArt, { x: L.tg[0], y: L.tg[1], parent: cellsG, seed: 21 });
    const ax = L.axis * DEG;
    const rT = Math.hypot(rayHit(cellInfo(tArt).outline, ax).x, rayHit(cellInfo(tArt).outline, ax).y);
    const nArt = nkCell({ r: L.nkR, seed: 4, receptors: false, stage: 'dark' });
    const nOut = cellInfo(nArt).outline;
    const hb = rayHit(nOut, ax + Math.PI);
    const rN = Math.hypot(hb.x, hb.y);
    const gap = L.cup * 0.9 + L.rec * 0.93 + 3;
    const nkPos = [L.tg[0] + Math.cos(ax) * (rT + gap + rN), L.tg[1] + Math.sin(ax) * (rT + gap + rN)];
    const nk = rig(nArt, { x: nkPos[0], y: nkPos[1], parent: cellsG, seed: 4 });
    cellsG.append(tg.el);            // target drawn above the NK cell
    const fx = fxLayer(cellsG);

    // Contact-zone glow (shown when the decision is "undecided"): a soft orange light between the cells.
    const zoneG = S_('g', { opacity: 0, 'data-part': 'contact-zone' });
    const cz = [L.tg[0] + Math.cos(ax) * (rT + gap / 2), L.tg[1] + Math.sin(ax) * (rT + gap / 2)];
    const across = layoutName === 'tall';
    S_('ellipse', { cx: cz[0], cy: cz[1], rx: across ? 92 : 46, ry: across ? 46 : 104, fill: dotGlow(mix(PALETTE.nk, '#FFFFFF', 0.3), 0.75) }, zoneG);
    S_('ellipse', { cx: cz[0], cy: cz[1], rx: across ? 70 : 26, ry: across ? 26 : 80, fill: 'none', stroke: mix(PALETTE.nk, '#FFFFFF', 0.45), 'stroke-width': 1.4, 'stroke-dasharray': '3 5', 'stroke-opacity': 0.8 }, zoneG);

    // NK receptors: one facing each contact-zone slot of the target (inhibitory opposite a
    // window slot, activating opposite a flag slot), plus a sprinkling around the rest.
    const nkFacing = Math.atan2(L.tg[1] - nkPos[1], L.tg[0] - nkPos[0]) / DEG;
    const pairs = [];
    const slots = [];
    for (let j = 0; j < 8; j++) slots.push({ kind: 'cup', idx: j, deg: cupAngle(j) });
    for (let i = 0; i < 8; i++) slots.push({ kind: 'flag', idx: i, deg: flagAngle(i) });
    for (const s of slots) {
      // geometry of the slot (target frame) and its head in world coords
      const h = rayHit(cellInfo(tArt).outline, s.deg * DEG);
      const len = s.kind === 'cup' ? L.cup * 0.9 : L.flag * 0.96;
      s.base = h;
      s.head = [L.tg[0] + h.x + h.nx * len, L.tg[1] + h.y + h.ny * len];
      s.inZone = Math.abs(angDiff(s.deg, L.axis)) <= ZONE + 1;
      if (!s.inZone) continue;
      const phi = Math.atan2(s.head[1] - nkPos[1], s.head[0] - nkPos[0]);
      const g = s.kind === 'cup' ? nkInhibitory({ size: L.rec, stage: 'dark', detail: 'high' }) : nkActivating({ size: L.rec, stage: 'dark', detail: 'high' });
      const b = seat(nArt, g, phi / DEG);
      const hl = s.kind === 'cup' ? L.rec * 0.93 : L.rec * 0.79;
      s.nkHead = [nkPos[0] + b.x + b.nx * hl, nkPos[1] + b.y + b.ny * hl];
      pairs.push(s);
    }
    const others = 12;
    for (let k = 0; k < others; k++) {
      const d = nkFacing + 70 + (k * (220 / (others - 1)));
      const g = (k % 2 ? nkInhibitory : nkActivating)({ size: 15, stage: 'dark', icon: false, detail: 'low' });
      seat(nArt, g, d);
    }

    // Bonds (world layer, above both cells).
    cellsG.append(zoneG);
    const bondsG = S_('g', { 'data-part': 'bonds' }, cellsG);
    cellsG.append(fx);

    // ----- balance
    const bal = drawBalance(balanceG);

    // ----- labels
    const lab = (x, y, text, anchor = 'middle', cls = 't-label') => S_('text', { x, y, class: `${cls} t-halo`, 'text-anchor': anchor, 'dominant-baseline': 'middle', text }, labelsG);
    lab(nkPos[0] - L.nkR - 20 + L.nkLabel.dx, nkPos[1], 'NK cell', L.nkLabel.anchor);
    const tgLabel = lab(L.tgLabel.x, L.tgLabel.y, TYPE_LABEL[state.type]);
    const shopG = S_('g', null, labelsG);
    const flagG = S_('g', null, labelsG);

    S = { tArt, tg, nArt, nk, nkPos, slots, pairs, bondsG, zoneG, bal, labelsG, shopG, flagG, tgLabel, fx };
    breatheH = ctx.track(breathe(nArt, { amplitude: 0.6 }));
    updateSurface();
    setTilt(model(state.win, state.flags).tilt, true);
    updateReadout();
  }

  // ------------------------------------------------------------------ surface molecules + bonds
  function updateSurface() {
    const m = model(state.win, state.flags);
    const { tArt, slots, bondsG } = S;
    const host = tArt.querySelector(':scope > [data-part="receptors"]');
    if (host) host.replaceChildren();
    const cupOn = new Set(CUP_ORDER.slice(0, m.cups));
    const flagOn = new Set(FLAG_ORDER.slice(0, m.flags));
    const foreign = state.type !== 'healthy';
    for (const s of slots) {
      s.on = s.kind === 'cup' ? cupOn.has(s.idx) : flagOn.has(s.idx);
      if (!s.on) { s.glyph = null; continue; }
      const g = s.kind === 'cup' ? shopWindow(L.cup, foreign && s.idx % 4 === 2 ? 'foreign' : 'self') : flagGlyph(L.flag);
      seat(tArt, g, s.deg);
      s.glyph = g;
    }
    // bonds
    bondsG.replaceChildren();
    for (const s of S.pairs) {
      if (!s.on) continue;
      const c = s.kind === 'cup' ? PALETTE.inhibitory : PALETTE.activating;
      const [x1, y1] = s.nkHead; const [x2, y2] = s.head;
      const g = S_('g', { 'data-part': 'bond' }, bondsG);
      S_('line', { x1, y1, x2, y2, stroke: c, 'stroke-width': 8, 'stroke-opacity': 0.22, 'stroke-linecap': 'round' }, g);
      S_('line', { x1, y1, x2, y2, stroke: mix(c, '#FFFFFF', 0.35), 'stroke-width': 2.4, 'stroke-linecap': 'round' }, g);
      S_('circle', { cx: (x1 + x2) / 2, cy: (y1 + y2) / 2, r: 3, fill: '#FFFFFF', 'fill-opacity': 0.85 }, g);
    }
    updateLabels();
  }

  function updateLabels() {
    const { shopG, flagG, slots } = S;
    shopG.replaceChildren();
    flagG.replaceChildren();
    // Leader to the visible glyph (outside the contact zone) nearest the label.
    const nearest = (kind, p) => {
      let best = null, bd = Infinity;
      for (const s of slots) {
        if (!s.on || s.kind !== kind || s.inZone) continue;
        const d = Math.hypot(s.head[0] - p.x, s.head[1] - p.y);
        if (d < bd) { bd = d; best = s; }
      }
      return best;
    };
    const put = (g, spec, text, kind) => {
      const s = nearest(kind, spec);
      if (!s) return;
      const anchor = spec.anchor || 'start';
      const w = text.length * 6.6;
      const lx = anchor === 'start' ? spec.x + Math.min(w * 0.5, 30) : spec.x - Math.min(w * 0.5, 30);
      const ly = spec.y + (s.head[1] > spec.y ? 9 : -14);
      S_('line', { class: 'leader', x1: lx, y1: ly, x2: s.head[0], y2: s.head[1] }, g);
      S_('circle', { class: 'leader-dot', cx: s.head[0], cy: s.head[1], r: 2.4 }, g);
      S_('text', { x: spec.x, y: spec.y, class: 't-small t-halo', 'text-anchor': anchor, 'dominant-baseline': 'middle', text }, g);
    };
    put(shopG, L.shopLabel, L.shopLabel.short ? 'shop window' : 'shop window (MHC class I)', 'cup');
    put(flagG, L.flagLabel, 'stress ligand', 'flag');
  }

  // ------------------------------------------------------------------ balance
  function drawBalance(parent) {
    const [px, py] = L.pivot;
    const half = L.beam / 2;
    const line = 'rgba(201, 211, 232, 0.55)';
    // fulcrum (static)
    const postH = layoutName === 'tall' ? 30 : 46;
    S_('path', { d: `M${px} ${py}L${px - 16} ${py + postH}H${px + 16}Z`, fill: 'rgba(201, 211, 232, 0.10)', stroke: line, 'stroke-width': 1.4, 'stroke-linejoin': 'round' }, parent);
    S_('line', { x1: px - 30, y1: py + postH, x2: px + 30, y2: py + postH, stroke: line, 'stroke-width': 2, 'stroke-linecap': 'round' }, parent);
    const beam = S_('g', null, parent);
    S_('line', { x1: -half, y1: 0, x2: half, y2: 0, stroke: 'rgba(222, 228, 240, 0.85)', 'stroke-width': 4, 'stroke-linecap': 'round' }, beam);
    S_('circle', { r: 6.5, fill: '#0F1630', stroke: 'rgba(222, 228, 240, 0.9)', 'stroke-width': 2 }, parent);
    const pans = [-1, 1].map((side) => {
      const g = S_('g', null, parent);
      const w = L.pan, s = L.str;
      S_('path', { d: `M0 0L${-w / 2} ${s}M0 0L${w / 2} ${s}`, stroke: line, 'stroke-width': 1.1, fill: 'none' }, g);
      S_('path', { d: `M${-w / 2 - 4} ${s}Q0 ${s + 18} ${w / 2 + 4} ${s}Z`, fill: 'rgba(201, 211, 232, 0.16)', stroke: 'rgba(222, 228, 240, 0.8)', 'stroke-width': 1.6, 'stroke-linejoin': 'round' }, g);
      S_('circle', { r: 3, fill: 'rgba(222, 228, 240, 0.9)' }, g);
      const weights = S_('g', null, g);
      const capY = s + (layoutName === 'tall' ? 30 : 34);
      S_('text', { x: 0, y: capY, class: 't-caps t-mid', text: side < 0 ? 'Stop (−)' : 'Go (+)' }, g);
      return { g, weights, side };
    });
    // "everyday activating signals" note rides with the GO pan
    const noteG = S_('g', null, pans[1].g);
    return { beam, pans, noteG, px, py, half };
  }

  function drawWeights() {
    const { bal } = S;
    const m = model(state.win, state.flags);
    const wsz = L.wt;
    const gapW = wsz + 2;
    const s = L.str;
    const rowsY = [s - wsz / 2 - 1, s - wsz * 1.5 - 3];
    const perRow = Math.floor((L.pan - 10) / gapW);
    const layoutRow = (n) => {
      const out = [];
      for (let k = 0; k < n; k++) {
        const row = Math.floor(k / perRow);
        const inRow = row === 0 ? Math.min(n, perRow) : n - perRow;
        const col = k % perRow;
        out.push([(col - (inRow - 1) / 2) * gapW, rowsY[Math.min(row, 1)]]);
      }
      return out;
    };
    // STOP pan: one crimson "−" weight per window display
    const stop = bal.pans[0].weights;
    stop.replaceChildren();
    layoutRow(m.cups).forEach(([x, y]) => stop.append(signalIcon({ type: 'inhibitory', size: wsz, x, y })));
    // GO pan: two hollow "everyday" weights + one solid "+" weight per flag
    const go = bal.pans[1].weights;
    go.replaceChildren();
    const pos = layoutRow(2 + m.flags);
    pos.forEach(([x, y], k) => {
      if (k < 2) {
        const g = S_('g', { transform: `translate(${x} ${y})` }, go);
        S_('circle', { r: wsz / 2 - 0.8, fill: 'none', stroke: PALETTE.activating, 'stroke-width': 1.6 }, g);
        S_('path', { d: `M${-wsz * 0.2} 0H${wsz * 0.2}M0 ${-wsz * 0.2}V${wsz * 0.2}`, stroke: PALETTE.activating, 'stroke-width': 1.4, 'stroke-linecap': 'round' }, g);
      } else {
        go.append(signalIcon({ type: 'activating', size: wsz, x, y }));
      }
    });
    // label for the hollow weights
    const ng = bal.noteG;
    ng.replaceChildren();
    const [hx, hy] = pos[0];
    if (L.hollowNote === 'side') {
      const tx = L.pan / 2 + 18;
      S_('line', { class: 'leader', x1: tx - 5, y1: s - 12, x2: hx - wsz / 2 - 1, y2: hy }, ng);
      S_('text', { x: tx, y: s - 20, class: 't-small', text: 'hollow: everyday' }, ng);
      S_('text', { x: tx, y: s - 4, class: 't-small', text: 'activating signals' }, ng);
    }
  }

  function renderTilt(deg) {
    const { bal } = S;
    if (!bal) return;
    const a = deg * DEG;
    bal.beam.setAttribute('transform', `translate(${bal.px} ${bal.py}) rotate(${deg.toFixed(2)})`);
    for (const p of bal.pans) {
      const x = bal.px + Math.cos(a) * bal.half * p.side;
      const y = bal.py + Math.sin(a) * bal.half * p.side;
      p.g.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)})`);
    }
    shownTilt = deg;
  }
  function setTilt(deg, instant = false) {
    drawWeights();
    gsap.killTweensOf(tiltProxy);
    if (instant || ctx.reducedMotion) { tiltProxy.t = deg; renderTilt(deg); return; }
    tiltProxy.t = shownTilt;
    gsap.to(tiltProxy, { t: deg, duration: 0.7, ease: 'so.out', onUpdate: () => renderTilt(tiltProxy.t) });
  }

  // ------------------------------------------------------------------ readout
  let lastVerdict = null;
  function updateReadout() {
    const m = model(state.win, state.flags);
    const v = VERDICT[m.verdict];
    badgeHost.innerHTML = ctx.ui.badgeHTML(v.kind, v.label);
    note.textContent = tNote(state.type, state.win, m.cups);
    note2.hidden = !(state.preset === 'emptied' && m.verdict === 'killed');
    if (S.tgLabel) S.tgLabel.textContent = TYPE_LABEL[state.type];
    if (lastVerdict && lastVerdict !== m.verdict) ctx.announce(`Verdict: ${v.label}.`);
    lastVerdict = m.verdict;
  }

  // ------------------------------------------------------------------ decision animation
  function decide() {
    if (dirty || tl) draw();
    const m = model(state.win, state.flags);
    tl = gsap.timeline({ paused: true });
    const { nk, tg, bondsG, zoneG } = S;
    let endAt = null;
    if (m.verdict === 'killed') {
      tl.to([bondsG, S.shopG, S.flagG], { opacity: 0, duration: 0.45, ease: 'power1.in' }, 0);
      polarize(tl, nk, tg, { duration: 0.9, pos: 0 });
      const k = kill(tl, nk, tg, { perforin: true, duration: 1.5, flatten: 0.1, pos: 0.1 });
      endAt = k.marks.dead;     // reduced motion: rest on the fragmented target
      move(tl, tg, { opacity: 0, duration: 0.8, pos: k.marks.dead - 0.3 });
      tl.to(S.tgLabel, { opacity: 0.45, duration: 0.5 }, k.marks.dead - 0.3);
      newBtn.el.hidden = false;
      dirty = true;
    } else if (m.verdict === 'spared') {
      tl.to(bondsG, { opacity: 0, duration: 0.5, ease: 'power1.in' }, 0);
      const back = L.axis * DEG + Math.PI;
      move(tl, nk, { x: S.nkPos[0] + Math.cos(back) * 42, y: S.nkPos[1] + Math.sin(back) * 42, duration: 1.2, ease: 'so.out', stretch: 0.02, pos: 0.15 });
      dirty = true;
    } else {
      tl.fromTo(zoneG, { opacity: 0 }, { opacity: 0.9, duration: 0.8, ease: 'sine.inOut' }, 0);
      if (!ctx.reducedMotion) {
        tl.eventCallback('onComplete', () => {
          if (pulse) pulse.kill();
          pulse = ctx.ambient(gsap.fromTo(zoneG, { opacity: 0.9 }, { opacity: 0.3, duration: 1.8, ease: 'sine.inOut', repeat: -1, yoyo: true }));
        });
      }
    }
    const v = VERDICT[m.verdict];
    ctx.announce(`The NK cell decides: ${v.label}.`);
    if (ctx.reducedMotion) { if (endAt != null) tl.seek(endAt, false); else tl.progress(1); }
    else tl.play();
  }

  // ------------------------------------------------------------------ controls
  const sliders = ctx.h('div', { class: 'nk-sliders' });
  ctx.controls.append(sliders);
  const winS = ctx.ui.slider({
    label: 'Shop window (MHC class I)', min: 0, max: 1, step: 0.05, value: state.win, parent: sliders,
    format: windowWord, describe: (v) => `Shop window ${windowWord(v).toLowerCase()}`, ticks: ['empty', 'full'],
    onInput: (v) => onSlide({ win: v }),
  });
  const flagS = ctx.ui.slider({
    label: 'Stress ligands', min: 0, max: 1, step: 0.05, value: state.flags, parent: sliders,
    format: flagWord, describe: (v) => `Stress ligands: ${flagWord(v).toLowerCase()}`, ticks: ['none', 'many'],
    onInput: (v) => onSlide({ flags: v }),
  });
  const presetRow = ctx.h('div', { class: 'nk-presets', role: 'group', 'aria-label': 'Presets' });
  ctx.controls.append(presetRow);
  const presetBtns = PRESETS.map((p) => ctx.ui.button({
    label: p.label, small: true, parent: presetRow, pressed: p.value === state.preset,
    onClick: () => applyPreset(p),
  }));
  ctx.ui.button({ label: 'Let the NK cell decide', icon: 'play', variant: 'primary', onClick: () => decide() });
  // Replay (FIGURES.md vocabulary): bring the target back and run the same decision again
  const newBtn = ctx.ui.button({ label: 'Replay', icon: 'replay', variant: 'ghost', onClick: () => { newBtn.el.hidden = true; decide(); } });
  newBtn.el.hidden = true;
  const legendItems = () => [
    { label: 'Stop: inhibitory receptor binds MHC class I', color: PALETTE.inhibitory, icon: 'minus' },
    { label: 'Go: activating receptor binds a stress ligand', color: PALETTE.activating, icon: 'plus' },
    ...(layoutName === 'tall' ? [{ label: 'Hollow weights: everyday activating signals', color: PALETTE.activating, shape: 'ring' }] : []),
  ];
  const legend = ctx.ui.legend(legendItems());

  const paintPresets = () => PRESETS.forEach((p, i) => { presetBtns[i].pressed = p.value === state.preset; });

  function onSlide(patch) {
    Object.assign(state, patch);
    if (state.preset) { state.preset = null; paintPresets(); }
    if (dirty || tl) { draw(); newBtn.el.hidden = true; return; }
    updateSurface();
    setTilt(model(state.win, state.flags).tilt);
    updateReadout();
  }

  function applyPreset(p) {
    Object.assign(state, { type: p.type, win: p.win, flags: p.flags, preset: p.value });
    winS.set(p.win);
    flagS.set(p.flags);
    paintPresets();
    newBtn.el.hidden = true;
    draw();
    decide();
  }

  // ------------------------------------------------------------------ layout
  ctx.onResize(({ compact }) => {
    const want = compact ? 'tall' : 'wide';
    if (want === layoutName && S.tArt) return;
    layoutName = want;
    placeReadout();
    legend.set(legendItems());
    draw();
    newBtn.el.hidden = true;
  });
  placeReadout();
  if (!S.tArt) draw();

  return {
    destroy() { if (tl) tl.kill(); gsap.killTweensOf(tiltProxy); },
  };
}
