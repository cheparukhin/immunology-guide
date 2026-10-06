// ch04-cross-presentation — "Cross-presentation" (stepper, dark stage, 3 steps).
//
// LEFT, in the tumor: a tumor cell dies (cell-actions die → setDying), a specialist (cDC1)
// dendritic cell takes its debris into an internal bubble and sets off along a lymphatic.
// RIGHT, in the lymph node: the same cell, now mature, shows the eaten tumor material on its
// class II "evidence board" (route A, always on) — a helper T cell recognizes it — while its
// class I "shop window" shows only self. Step 3 lights route B (bubble → class I pathway →
// class I cups): tumor fragments appear in the shop window and the killer T cell recognizes
// them. A switch on step 3 flips between the two outcomes.
//
// Science guard rails (spec): route B starts in the bubble (never the nucleus); the tumor
// cell never presents to T cells; both T cells are in the lymph node. Vocabulary: class I cups
// are the same mhc1-with-pockets glyph as ch02-nk-missing-self and ch04-mhc1-pathway; tumor
// peptides hot pink with glow (rule 3); recognition = cell-actions recognize() (rule 5);
// B7 studs pale mint without icon (rule 8). T cells stay resting (naive) — rule 2.
import {
  dendriticCell, cancerCell, tCell, mhc1, mhc2, b7, vesicle, lymphNodeField, lymphaticVessel, tissueField,
  cellInfo, rayHit, PALETTE, mix, dotGlow, el, rng, blobRadius, polarPoints, smoothPath,
} from '../art/index.js';
import { rig, move, die, recognize, drive, fxLayer } from './shared/cell-actions.js';

const DEG = Math.PI / 180;
const POCKETS = ['square', 'square'];
const FIT = ['square', 'square'];
const WHITE = '#FFFFFF';
const PINK = PALETTE.foreignPeptide;

const shopWindow = (size, kind) => mhc1({ size, peptide: kind === 'neo' ? 'neo' : 'self', pockets: POCKETS, anchors: FIT, stage: 'dark', detail: 'high' });

const LAYOUTS = {
  wide: {
    vb: [1000, 560],
    tumorPanel: { x: 0, y: 0, w: 360, h: 560 }, tumorTitle: { x: 26, y: 38 },
    tumor: { x: 112, y: 340, r: 60 },
    nest: [[86, 168, 46, 21], [236, 474, 44, 23], [36, 524, 30, 25]],   // living tumor cells (polish A12: no empty panel)
    dcL: { x: 254, y: 250, r: 98 },
    channel: { x: 394, y: 296, len: 104, w: 40, rot: 0 }, chanLabel: { x: 394, y: 336 },
    ln: { x: 436, y: 14, w: 556, h: 532 }, lnTitle: { x: 714, y: 48 },
    dc: { x: 712, y: 290, r: 200, seed: 4 },
    angles: { ii: [165, 238, 254], i: [337, 352, 30], b7: [112, 126, 292, 304] }, helperCup: 1, killerCup: 2,
    helper: { from: [548, 150] }, killer: { from: [928, 468] }, tR: 30,
    labels: {
      tumor: { x: 112, y: 434 }, dcL: { x: 254, y: 388, chip: 'Immunologists call this kind cDC1' },
      bubble: { x: 254, y: 120, small: true },
      board: { x: 604, y: 398, anchor: 'end', small: true }, shop: { x: 884, y: 196, small: true },
      helper: { dx: 0, dy: -52 }, killer: { dx: 0, dy: 52 },
      never: { x: 712, y: 530, small: true }, routeB: { x: 790, y: 452, small: true },
    },
  },
  tall: {
    vb: [420, 900],
    tumorPanel: { x: 0, y: 0, w: 420, h: 250 }, tumorTitle: { x: 18, y: 30 },
    tumor: { x: 100, y: 150, r: 48 },
    nest: [[30, 82, 22, 23]],          // phones: one neighbour (more would crowd the bubble label and stage tags)
    dcL: { x: 282, y: 130, r: 76 },
    channel: { x: 282, y: 284, len: 76, w: 32, rot: 90 }, chanLabel: { x: 260, y: 284, anchor: 'end' },   // left of the vessel: the right side clips at 360 px
    ln: { x: 6, y: 324, w: 408, h: 540 }, lnTitle: { x: 210, y: 354 },
    dc: { x: 210, y: 612, r: 176, seed: 4 },
    angles: { ii: [165, 238, 254], i: [337, 352, 30], b7: [112, 126, 292, 304] }, helperCup: 1, killerCup: 1,
    helper: { from: [76, 470] }, killer: { from: [348, 470] }, tR: 25,
    labels: {
      tumor: { x: 100, y: 224 }, dcL: { x: 282, y: 228, chip: 'Immunologists call this kind cDC1' },
      bubble: { x: 226, y: 50, anchor: 'end', small: true },   // ends left of the stacked stage tags (phones, 360 px too)
      board: { x: 112, y: 818, small: true }, shop: { x: 312, y: 818, small: true },
      helper: { dx: 0, dy: -46 }, killer: { dx: 0, dy: -46 },
      never: { x: 210, y: 884, small: true }, routeB: { x: 210, y: 846, small: true },
    },
  },
};

const CSS = `
[data-figure="ch04-cross-presentation"] .xp-chip { cursor: pointer; }
[data-figure="ch04-cross-presentation"] .xp-chip:focus { outline: none; }
[data-figure="ch04-cross-presentation"] .xp-chip:focus-visible circle { stroke: var(--stage-focus); stroke-width: 2.5; }
[data-figure="ch04-cross-presentation"] .xp-toggle[hidden] { display: none; }
[data-figure="ch04-cross-presentation"].is-compact .xp-toggle { flex-basis: 100%; }
`;

/** Irregular violet debris bit; tagged ones carry a hot-pink tumor-protein tag. */
function debris(r, seed, tagged) {
  const g = el('g', { 'data-part': 'debris' });
  const rf = blobRadius({ r, seed: `xp${seed}`, irregularity: 0.9, kMax: 4 });
  g.append(el('path', { d: smoothPath(polarPoints(rf, 12)), fill: mix(PALETTE.cancer, '#0B1024', 0.3), stroke: mix(PALETTE.cancer, WHITE, 0.35), 'stroke-width': 0.9 }));
  if (tagged) {
    g.append(el('circle', { cx: r * 0.35, cy: -r * 0.3, r: r * 0.9, fill: dotGlow(PINK, 0.5) }));
    g.append(el('circle', { cx: r * 0.35, cy: -r * 0.3, r: Math.max(1.4, r * 0.42), fill: PINK }));
  }
  return g;
}

export default function mount(fig, ctx) {
  const { gsap } = ctx;
  if (!document.getElementById('css-ch04-cross-presentation')) document.head.append(ctx.h('style', { id: 'css-ch04-cross-presentation' }, CSS));
  ctx.tag('Not to scale');
  ctx.tag('Time compressed');

  let layoutName = (ctx.width || fig.clientWidth) < 700 ? 'tall' : 'wide';
  let L = LAYOUTS[layoutName];
  let crossOn = true;
  const applyAspect = () => {
    const a = L.vb[0] / L.vb[1];
    if (layoutName === 'tall') ctx.setAspect(a, a);
    else ctx.setAspect(a, LAYOUTS.tall.vb[0] / LAYOUTS.tall.vb[1]);
  };
  applyAspect();
  const svg = ctx.createSVG({ viewBox: `0 0 ${L.vb[0]} ${L.vb[1]}`, interactive: true, label: 'A dendritic cell carries tumor debris from a tumor to a lymph node' });
  const S_ = (tag, attrs, parent) => ctx.svg(tag, attrs, parent);

  // ------------------------------------------------------------------ labels with "i" chips
  function addLabel(parent, spec, text, { leader, sub } = {}) {
    const g = S_('g', { opacity: 0, style: 'visibility:hidden' }, parent);
    const anchor = spec.anchor || 'middle';
    const cls = spec.small ? 't-small t-halo' : 't-label t-halo';
    if (leader) {
      const [lx, ly] = leader;
      const sy = spec.y + (ly > spec.y ? 10 : -13);
      S_('line', { class: 'leader', x1: spec.x, y1: sy, x2: lx, y2: ly }, g);
      S_('circle', { class: 'leader-dot', cx: lx, cy: ly, r: 2.4 }, g);
    }
    const textEl = S_('text', { x: spec.x, y: spec.y, class: cls, 'text-anchor': anchor, 'dominant-baseline': 'middle', text }, g);
    if (sub) S_('text', { x: spec.x, y: spec.y + 18, class: 't-small t-halo', 'text-anchor': anchor, 'dominant-baseline': 'middle', text: sub }, g);
    if (spec.chip) {
      let w = text.length * (spec.small ? 6.9 : 8.3);
      try { const tw = textEl.getComputedTextLength(); if (tw > 0) w = tw; } catch (e) { /* not rendered yet */ }
      const cx = anchor === 'middle' ? spec.x + w / 2 + 13 : anchor === 'start' ? spec.x + w + 13 : spec.x + 13;
      const chip = S_('g', { class: 'xp-chip', tabindex: 0, role: 'button', 'aria-label': `${text}: ${spec.chip}`, transform: `translate(${cx.toFixed(1)} ${spec.y})` }, g);
      S_('circle', { r: 14, fill: 'transparent' }, chip);
      S_('circle', { r: 8.5, fill: 'rgba(201,211,232,0.12)', stroke: 'rgba(222,228,240,0.75)', 'stroke-width': 1.2 }, chip);
      S_('text', { x: 0, y: 0.5, 'text-anchor': 'middle', 'dominant-baseline': 'middle', style: 'font-size:11px;font-weight:700;font-style:italic;fill:#E8ECF6', text: 'i' }, chip);
      const show = () => ctx.tooltip.show(spec.chip, chip);
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

  /** A small hot-pink bead (engulfed tumor peptide) for travelling along routes. */
  function bead(parent) {
    const g = S_('g', { opacity: 0 }, parent);
    S_('circle', { r: 7, fill: dotGlow(PINK, 0.55) }, g);
    S_('circle', { r: 3, fill: mix(PINK, WHITE, 0.15), stroke: mix(PINK, WHITE, 0.6), 'stroke-width': 0.8 }, g);
    return g;
  }
  /** Seek-safe travel of `node` along an SVG path (cell-actions drive). */
  function along(tl, node, path, pos, duration = 1.2) {
    const len = path.getTotalLength();
    drive(tl, (p) => {
      const q = gsap.parseEase('so.inOut')(p);
      const pt = path.getPointAtLength(q * len);
      node.setAttribute('transform', `translate(${pt.x.toFixed(2)} ${pt.y.toFixed(2)})`);
      node.setAttribute('opacity', (Math.min(1, p * 6, (1 - p) * 6)).toFixed(3));
    }, { duration, pos });
  }

  // ------------------------------------------------------------------ scene
  let E = {};
  const ambients = [];

  function draw() {
    ambients.splice(0).forEach((t) => t.kill());
    for (const c of [...svg.children]) if (c !== svg.defs) c.remove();
    svg.setAttribute('viewBox', `0 0 ${L.vb[0]} ${L.vb[1]}`);
    ctx.refreshTextScale();
    const world = S_('g', null, svg);

    // --- backdrops
    const tp = L.tumorPanel;
    const tf = tissueField({ x: tp.x, y: tp.y, width: tp.w, height: tp.h, seed: 6, stage: 'dark', density: 0.55 });
    tf.setAttribute('opacity', 0.75);
    world.append(tf);
    const lnf = lymphNodeField({ x: L.ln.x, y: L.ln.y, width: L.ln.w, height: L.ln.h, seed: 3, stage: 'dark', follicles: 2, density: 0.7 });
    world.append(lnf);
    const ch = lymphaticVessel({ length: L.channel.len, width: L.channel.w, seed: 2, stage: 'dark', flow: 1, valves: 1 });
    ch.setAttribute('transform', `translate(${L.channel.x} ${L.channel.y}) rotate(${L.channel.rot})`);
    ch.setAttribute('opacity', 0.7);
    world.append(ch);
    S_('text', { x: L.tumorTitle.x, y: L.tumorTitle.y, class: 't-caps', text: 'In the tumor' }, world);
    S_('text', { x: L.lnTitle.x, y: L.lnTitle.y, class: 't-caps t-mid', text: 'Lymph node' }, world);
    S_('text', { x: L.chanLabel.x, y: L.chanLabel.y, class: 't-small t-halo', 'text-anchor': L.chanLabel.anchor || 'middle', 'dominant-baseline': 'middle', text: 'lymphatic vessel' }, world);

    const cells = S_('g', null, world);

    // --- left panel: the rest of the tumor (living cells, scenery), the dying tumor cell, and the
    // immature (specialist) dendritic cell with its bubble. The living neighbours keep the tumor
    // panel from turning into an empty void once the dendritic cell has left (polish A12).
    const nest = S_('g', { 'data-part': 'tumor-nest' }, cells);
    for (const [x, y, r, seed] of L.nest) {
      const c = cancerCell({ r, seed, stage: 'dark', peptides: ['self', 'neo', 'self'], mhc: 5 });
      c.setAttribute('transform', `translate(${x} ${y})`);
      nest.append(c);
    }
    const tumor = rig(cancerCell({ r: L.tumor.r, seed: 5, stage: 'dark', peptides: ['self', 'neo', 'self'], mhc: 6 }), { x: L.tumor.x, y: L.tumor.y, parent: cells, seed: 5 });
    const dcArt = dendriticCell({ state: 'immature', r: L.dcL.r, seed: 4, stage: 'dark', receptors: true });
    const dcL = rig(dcArt, { x: L.dcL.x, y: L.dcL.y, parent: cells, seed: 4 });
    const bubbleL = vesicle({ kind: 'endosome', r: L.dcL.r * 0.2, cargo: 4, tagged: 2, seed: 2, stage: 'dark' });
    bubbleL.setAttribute('opacity', 0);
    const bubbleLWrap = S_('g', { transform: `translate(${(L.dcL.r * 0.04).toFixed(1)} ${(-L.dcL.r * 0.04).toFixed(1)})` }, dcL.layers.inner);
    bubbleLWrap.append(bubbleL);

    // debris bits that drift from the dying tumor into the bubble
    const R = rng(7, 'debris');
    const bits = [0, 1, 2, 3, 4].map((i) => {
      const a = (i / 5) * Math.PI * 2 + R.range(-0.3, 0.3);
      const from = [L.tumor.x + Math.cos(a) * L.tumor.r * 0.55, L.tumor.y + Math.sin(a) * L.tumor.r * 0.55];
      const out = [L.tumor.x + Math.cos(a) * L.tumor.r * 1.05, L.tumor.y + Math.sin(a) * L.tumor.r * 1.05];
      const g = S_('g', { transform: `translate(${from[0].toFixed(1)} ${from[1].toFixed(1)}) scale(1)`, opacity: 0 }, cells);
      g.append(debris(L.tumor.r * 0.13, i, i % 2 === 0));
      return { g, from, out };
    });

    // --- right panel: the same dendritic cell, mature, with its two displays
    const arrive = L.channel.rot ? [L.dc.x, L.dc.y - 90] : [L.dc.x - 90, L.dc.y];
    const dcR = S_('g', { transform: `translate(${arrive[0]} ${arrive[1]}) scale(0.8)`, opacity: 0 }, cells);
    const dcRidle = S_('g', null, dcR);
    const dcArtR = dendriticCell({ state: 'mature', r: L.dc.r, seed: L.dc.seed, stage: 'dark', receptors: false });
    dcRidle.append(dcArtR);
    const info = cellInfo(dcArtR);
    const rb = info.bodyR;
    const cup = layoutName === 'tall' ? 30 : 34;
    const spotAt = (a) => ({ a, h: rayHit(info.outline, a * DEG) });
    const iiSpots = L.angles.ii.map(spotAt);
    const iSpots = L.angles.i.map(spotAt);
    const seat = (g, s) => {
      const nd = Math.atan2(s.h.ny, s.h.nx) / DEG;
      g.setAttribute('transform', `translate(${s.h.x.toFixed(2)} ${s.h.y.toFixed(2)}) rotate(${(nd + 90).toFixed(2)})`);
      dcRidle.append(g);
      const hl = cup * 0.9;
      return { x: s.h.x + s.h.nx * hl, y: s.h.y + s.h.ny * hl, base: [s.h.x - s.h.nx * 3, s.h.y - s.h.ny * 3], angle: nd };
    };
    const boards = iiSpots.map((s) => seat(mhc2({ size: cup, peptide: 'neo', stage: 'dark', detail: 'high' }), s));
    const boardEls = [...dcRidle.children].slice(-boards.length);
    boardEls.forEach((g) => g.setAttribute('opacity', 0));
    // class I: a self version (always) and a tumor version (crossfades in with route B)
    const windows = iSpots.map((s, k) => {
      const self = shopWindow(cup, 'self');
      const head = seat(self, s);
      let neo = null;
      if (k !== 0) { neo = shopWindow(cup, 'neo'); seat(neo, s); neo.setAttribute('opacity', 0); }
      return { self, neo, head };
    });
    // B7 studs elsewhere on the body (pale mint, no icon — rule 8)
    for (const a of L.angles.b7) seat(b7({ size: 22, stage: 'dark', detail: 'high' }), spotAt(a));

    // bubble (eaten material, lower left) + a tiny class I loading bay (right), clear of the nucleus
    const bub = [-0.3 * rb, 0.55 * rb];
    const bubbleR = vesicle({ kind: 'endosome', r: rb * 0.26, cargo: 4, tagged: 2, seed: 2, stage: 'dark' });
    bubbleR.setAttribute('transform', `translate(${bub[0].toFixed(1)} ${bub[1].toFixed(1)})`);
    dcRidle.append(bubbleR);
    const bayAt = [0.5 * rb, 0.3 * rb];
    const bay = vesicle({ kind: 'er', width: rb * 0.5, height: rb * 0.3, seed: 5, ribosomes: false, stage: 'dark' });
    bay.setAttribute('transform', `translate(${bayAt[0].toFixed(1)} ${bayAt[1].toFixed(1)})`);
    bay.setAttribute('opacity', 0);
    dcRidle.append(bay);

    // routes (glowing paths) inside the cell
    const routes = S_('g', null, dcRidle);
    const curve = (a, b, bend = 0.25) => {
      const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
      const nx = -(b[1] - a[1]) * bend, ny = (b[0] - a[0]) * bend;
      return `M${a[0].toFixed(1)} ${a[1].toFixed(1)}Q${(mx + nx).toFixed(1)} ${(my + ny).toFixed(1)} ${b[0].toFixed(1)} ${b[1].toFixed(1)}`;
    };
    const routeG = (paths, dashed) => {
      const g = S_('g', { opacity: 0 }, routes);
      const ps = paths.map((d) => {
        S_('path', { d, fill: 'none', stroke: PINK, 'stroke-width': 7, 'stroke-opacity': 0.16, 'stroke-linecap': 'round' }, g);
        return S_('path', { d, fill: 'none', stroke: mix(PINK, WHITE, 0.45), 'stroke-width': 1.8, 'stroke-linecap': 'round', 'stroke-dasharray': dashed ? '3 4' : null }, g);
      });
      return { g, ps };
    };
    const routeA = routeG(boards.map((b) => curve(bub, b.base, 0.18)));
    const routeB = routeG([curve(bub, bayAt, -0.2), ...windows.filter((w) => w.neo).map((w) => curve(bayAt, w.head.base, 0.15))]);
    const beadsA = boards.map(() => bead(routes));
    const beadsB = windows.filter((w) => w.neo).map(() => bead(routes));

    // --- T cells waiting in the node (naive → resting)
    const lane = S_('g', null, cells);
    const helper = rig(tCell({ variant: 'cd4', r: L.tR, seed: 8, stage: 'dark' }), { x: L.helper.from[0], y: L.helper.from[1], parent: lane, seed: 8 });
    const killer = rig(tCell({ variant: 'cd8', r: L.tR, seed: 3, stage: 'dark' }), { x: L.killer.from[0], y: L.killer.from[1], parent: lane, seed: 3 });
    const tLabel = (R0, text, sub, spec) => {
      const g = S_('g', { 'data-part': 'tlabel' }, R0.layers.over);
      S_('text', { x: spec.dx, y: spec.dy - (spec.dy < 0 ? 16 : 0), class: 't-label t-halo t-mid', text }, g);
      S_('text', { x: spec.dx, y: spec.dy + (spec.dy < 0 ? 0 : 16), class: 't-small t-halo t-mid', text: sub }, g);
      return g;
    };
    tLabel(helper, 'helper T cell', 'reads class II', L.labels.helper);
    tLabel(killer, 'killer T cell', 'reads class I', L.labels.killer);
    fxLayer(cells);

    // --- labels
    const lab = S_('g', null, svg);
    const LS = L.labels;
    const toWorld = (p) => [L.dc.x + p.x, L.dc.y + p.y];
    const labels = {
      tumor: addLabel(lab, LS.tumor, 'dying tumor cell'),
      dcL: addLabel(lab, LS.dcL, 'specialist dendritic cell'),
      bubble: addLabel(lab, LS.bubble, 'engulfed debris in a phagosome', { leader: [L.dcL.x, L.dcL.y - L.dcL.r * 0.2] }),
      board: addLabel(lab, LS.board, 'MHC class II', { leader: toWorld(boards[0]) }),
      shop: addLabel(lab, LS.shop, 'MHC class I', { leader: toWorld(windows[0].head) }),
      never: addLabel(lab, LS.never, 'The killer T cell is never primed.'),
      routeB: addLabel(lab, LS.routeB, 'cross-presentation route'),
    };
    // tumor cell starts visible; its label too
    labels.tumor.setAttribute('opacity', 1);
    labels.tumor.style.visibility = 'visible';

    E = { arrive, tumor, dcL, bubbleL, bits, dcR, dcRidle, boardEls, boards, windows, bubbleR, bay, routeA, routeB, beadsA, beadsB, helper, killer, labels };
  }

  // ------------------------------------------------------------------ steps
  const world = (p) => ({ x: L.dc.x + p.x, y: L.dc.y + p.y });
  /** Where a T cell of radius tR sits to touch display head p (DC frame), approaching along its outward normal. */
  // TCR tips (≈ 0.28 r out from the membrane) meet the cup head to head (§4 rule 5)
  const touchPose = (h, extra = L.tR * 0.28) => {
    const a = h.angle * DEG;
    const tr = L.tR;
    const w = world(h);
    return { x: w.x + Math.cos(a) * (tr + extra), y: w.y + Math.sin(a) * (tr + extra) };
  };

  const steps = [
    { // 1 · engulf, travel
      enter(tl) {
        showL(tl, E.labels.dcL, 0.1);
        die(tl, E.tumor, { duration: 2.2, pos: 0.3 });
        E.bits.forEach((b, i) => {
          const t0 = 1.3 + i * 0.16;
          tl.fromTo(b.g, { attr: { transform: `translate(${b.from[0].toFixed(1)} ${b.from[1].toFixed(1)}) scale(1)` }, opacity: 0 },
            { attr: { transform: `translate(${b.out[0].toFixed(1)} ${b.out[1].toFixed(1)}) scale(1)` }, opacity: 1, duration: 0.7, ease: 'so.out' }, t0)
            .to(b.g, { attr: { transform: `translate(${L.dcL.x + 4} ${L.dcL.y - 4}) scale(0.6)` }, duration: 1.2, ease: 'so.inOut' }, t0 + 0.8)
            .to(b.g, { opacity: 0, duration: 0.3 }, t0 + 1.8);
        });
        tl.to(E.bubbleL, { opacity: 1, duration: 0.6 }, 2.6);
        showL(tl, E.labels.bubble, 2.8);
        move(tl, E.tumor, { opacity: 0.4, duration: 0.8, pos: 3.2 });
        hideL(tl, E.labels.bubble, 4.0);
        hideL(tl, E.labels.dcL, 4.0);
        // journey: along the lymphatic toward the node (compressed)
        const c = L.channel;
        const ex = c.rot ? c.x : c.x - c.len * 0.2;
        const ey = c.rot ? c.y - c.len * 0.2 : c.y;
        move(tl, E.dcL, { x: ex, y: ey, opacity: 0, duration: 1.6, stretch: 0.05, ease: 'so.in', pos: 4.0 });
        tl.fromTo(E.dcR, { attr: { transform: `translate(${E.arrive[0]} ${E.arrive[1]}) scale(0.8)` }, opacity: 0 },
          { attr: { transform: `translate(${L.dc.x} ${L.dc.y}) scale(1)` }, opacity: 1, duration: 1.3, ease: 'so.out' }, 5.0)
          .fromTo(E.routeA.g, { opacity: 0 }, { opacity: 1, duration: 0.6 }, 5.8);
        E.boardEls.forEach((g, i) => tl.to(g, { opacity: 1, duration: 0.5 }, 6.0 + i * 0.12));
        showL(tl, E.labels.board, 6.3);
        showL(tl, E.labels.shop, 6.5);
      },
    },
    { // 2 · without cross-presentation
      enter(tl) {
        E.beadsA.forEach((b, i) => along(tl, b, E.routeA.ps[i], 0.1 + i * 0.15, 1.1));
        const hb = E.boards[L.helperCup];
        move(tl, E.helper, { ...touchPose(hb), duration: 1.6, stretch: 0.03, pos: 0.3 });
        recognize(tl, E.helper, { ...world(hb), angle: hb.angle }, { pos: 1.9, radius: 11 });
        const kw = E.windows[L.killerCup].head;
        const kp = touchPose(kw);
        move(tl, E.killer, { ...kp, duration: 1.7, stretch: 0.03, pos: 2.2 });
        tl.to({}, { duration: 0.7 }, 3.9);
        move(tl, E.killer, { x: L.killer.from[0], y: L.killer.from[1], duration: 1.4, stretch: 0.02, pos: 4.6 });
        showL(tl, E.labels.never, 4.8);
      },
    },
    { // 3 · with cross-presentation (switchable)
      enter(tl) {
        if (!crossOn) return;   // the switch shows the step-2 outcome
        hideL(tl, E.labels.never, 0);
        tl.to(E.bay, { opacity: 1, duration: 0.5 }, 0.1)
          .to(E.routeB.g, { opacity: 1, duration: 0.3 }, 0.3);
        E.routeB.ps.forEach((p, i) => tl.fromTo(p, { drawSVG: '0% 0%' }, { drawSVG: '0% 100%', duration: 0.8, ease: 'power1.inOut' }, 0.3 + (i ? 0.6 : 0)));
        showL(tl, E.labels.routeB, 0.6);
        const legs = E.routeB.ps.slice(1);
        E.beadsB.forEach((b, i) => {
          along(tl, b, E.routeB.ps[0], 1.3 + i * 0.25, 0.8);
          along(tl, b, legs[i], 2.1 + i * 0.25, 0.8);
        });
        E.windows.filter((w) => w.neo).forEach((w, i) => {
          tl.to(w.neo, { opacity: 1, duration: 0.5 }, 2.8 + i * 0.25).to(w.self, { opacity: 0, duration: 0.5 }, 2.8 + i * 0.25);
        });
        const kw = E.windows[L.killerCup].head;
        move(tl, E.killer, { ...touchPose(kw), duration: 1.6, stretch: 0.03, pos: 3.2 });
        recognize(tl, E.killer, { ...world(kw), angle: kw.angle }, { pos: 4.7, radius: 11 });
      },
    },
  ];

  // ------------------------------------------------------------------ controls
  const toggle = ctx.ui.toggle({
    label: 'Cross-presentation', checked: true,
    onChange: (on) => { crossOn = on; ctx.announce(on ? 'Cross-presentation on: the killer T cell is primed.' : 'Cross-presentation off: the killer T cell is never primed.'); stepper.rebuild(); },
  });
  toggle.el.classList.add('xp-toggle');
  toggle.el.hidden = true;

  const stepper = ctx.ui.stepper({
    steps, reset: draw,
    onChange: (i) => { toggle.el.hidden = i !== 2; },
  });
  // keep the switch next to the stepper controls
  ctx.controls.append(toggle.el);

  ctx.onResize(({ width }) => {
    const want = width < 700 ? 'tall' : 'wide';
    if (want === layoutName) return;
    layoutName = want;
    L = LAYOUTS[layoutName];
    applyAspect();
    stepper.rebuild();
  });

  return { destroy() { ambients.forEach((t) => t.kill()); } };
}
