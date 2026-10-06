// ch05-whole-team — "One infection, start to finish" (Part I's consolidation map).
// Spec: the :::figure block in content/drafts/05-t-cells.md and docs/aggregate/book-compare/CHANGES.md
// ("New figure: ch05-whole-team").
//
// One SVG scene in two layouts:
//   wide    960×600: airway tissue (left) · lymph and blood channels (middle) · lymph node (right),
//           with a "Who's working" ribbon along the bottom.
//   compact 400×790: tissue above, node below, the two channels vertical (lymph down on the left,
//           blood up on the right), ribbon full width at the bottom.
// Cells come from the art library and move with shared/cell-actions builders, so every step is a
// pure function of timeline time (Back, dot jumps, Replay and reduced motion all agree).
// The region not in play is veiled (dimmed, never hidden). After step 8 every cell on stage is a
// button that opens a one-line card with a link to the chapter that explains it. An optional
// "Show the handshakes" switch labels the key molecular contacts of the current step.
import {
  healthyCell, macrophage, nkCell, dendriticCell, tCell, bCell, plasmaCell, virus, antibody, pamp,
  tissueField, lymphNodeField, bloodVessel, lymphaticVessel, signalIcon, cellInfo, rng, PALETTE, mix,
} from '../art/index.js';
import { rig, place, move, approach, probe, recognize, kill, detach, divide, swap, die, emit, drive, fxLayer } from './shared/cell-actions.js';
import { pathD } from './shared/chart.js';

const ID = 'ch05-whole-team';
const DEG = Math.PI / 180;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
const f = (v) => String(Math.round(v * 100) / 100);
const WHITE = '#FFFFFF';
const NAVY = '#0B1024';

// ------------------------------------------------------------------ time and the "Who's working" ribbon
// Stretched axis: five equal zones, u = 0…5.
const ZONES = ['Hours', 'Days 1–3', 'Days 4–7', 'Weeks 2–3', 'Months–years'];
const ZONES_2 = [['Hours', ''], ['Days', '1–3'], ['Days', '4–7'], ['Weeks', '2–3'], ['Months–', 'years']];
const STEP_U = [0.12, 0.62, 1.5, 2.0, 2.5, 2.95, 3.5, 4.5];    // step 4 sits on the days 1–3 | 4–7 boundary
const CLOCK = ['Hour 0', 'Hours', 'Days 1–3', 'Days 2–5', 'Days 4–7', 'About a week', 'Weeks 2–3', 'Months–years'];
// Illustrative activity curves (0…1). Innate overlaps the adaptive rise: no hard handover.
const SERIES = [
  { id: 'innate', label: 'Innate', color: PALETTE.macrophage, dash: null,
    pts: [[0, 0.04], [0.3, 0.2], [0.75, 0.6], [1.45, 0.9], [2.0, 0.76], [2.6, 0.48], [3.15, 0.25], [3.7, 0.1], [4.2, 0.05], [5, 0.04]] },
  { id: 't', label: 'T cells', color: PALETTE.cd8, dash: '7 5',
    pts: [[1.8, 0], [2.15, 0.08], [2.45, 0.4], [2.78, 0.86], [2.97, 0.94], [3.35, 0.58], [3.8, 0.24], [4.2, 0.14], [5, 0.13]] },
  { id: 'ab', label: 'Antibodies', color: PALETTE.antibody, dash: '0.1 5.5',
    pts: [[2.3, 0], [2.6, 0.08], [3.0, 0.36], [3.4, 0.7], [3.85, 0.78], [4.2, 0.6], [4.6, 0.43], [5, 0.4]] },
];
// brightness of [innate, T cells, antibodies] at the end of each step (the bands in play brighten)
const BRIGHT = [[1, 0.32, 0.32], [1, 0.32, 0.32], [1, 0.32, 0.32], [1, 1, 0.32], [0.5, 1, 1], [0.7, 1, 1], [0.4, 1, 1], [0.4, 1, 1]];
const BRIGHT0 = [0.32, 0.32, 0.32];

// Headline chips (top of the stage on wide layouts; under the caption on phones), by step index.
const HEADLINE = {
  0: 'Inside cells: out of antibodies’ reach',
  5: 'Until now, innate defenses did most of the work.',
  6: 'No virus, no signal: most expanded T cells die',
  7: 'Same virus again: a response within days',
};

// ------------------------------------------------------------------ layouts
const LAYOUTS = {
  wide: {
    vb: [960, 600],
    titleTissue: [26, 60], titleNode: [752, 60], titleNodeAnchor: 'middle',
    tissue: { x: 18, y: 70, w: 428, h: 378 },
    lining: { y: 154, xs: [68, 150, 232, 314, 396], r: 34 },
    lumenY: 84,
    mac: [100, 320], macR: 46,
    dc: [376, 318], dcR: 40, dcNodeR: 31,
    free: [[176, 296], [252, 336]],
    cap: { orient: 'h', x0: 18, x1: 700, y: 410, w: 44, chev: [486, 532, 578] },
    lymph: { orient: 'h', x0: 404, x1: 606, y: 236, w: 22, chev: [478, 520, 562] },
    node: { x: 566, y: 80, w: 372, h: 350 },
    ribbon: { x0: 24, x1: 936, titleY: 476, legendY: 476, legendX: 186, top: 496, base: 552, segY: 576, two: false },
    nkFrom: [300, 410], nkVia: [[296, 300]],
    killerExit: [[226, 410], [120, 410], [356, 410]],   // where Ka, Kb, Kc leave the capillary
    clusterOff: { k: [38, 36], h: [-50, 14] },
  },
  compact: {
    vb: [400, 790],
    titleTissue: [16, 50], titleNode: [386, 372], titleNodeAnchor: 'end',
    tissue: { x: 10, y: 58, w: 380, h: 256 },
    lining: { y: 114, xs: [52, 126, 200, 274, 348], r: 29 },
    lumenY: 70,
    mac: [334, 252], macR: 38,
    dc: [92, 232], dcR: 34, dcNodeR: 27,
    free: [[148, 214], [190, 246]],
    cap: { orient: 'v', y0: 282, y1: 452, x: 236, w: 34, chev: [330, 356] },
    lymph: { orient: 'v', y0: 262, y1: 440, x: 92, w: 20, chev: [326, 352] },
    node: { x: 10, y: 380, w: 380, h: 264 },
    ribbon: { x0: 16, x1: 384, titleY: 666, legendY: 686, legendX: 16, top: 702, base: 742, segY: 760, two: true },
    nkFrom: [236, 292], nkVia: [[262, 236]],
    killerExit: [[236, 292], [236, 292], [236, 292]],
    clusterOff: { k: [28, 24], h: [30, 30] },
  },
};

// ------------------------------------------------------------------ explore cards (after step 8)
const CH = {
  2: { file: '02-innate.html', title: 'Innate Immunity' },
  3: { file: '03-adaptive.html', title: 'Adaptive Immunity' },
  4: { file: '04-presentation.html', title: 'Antigen Presentation' },
  5: { file: '05-t-cells.html', title: 'T Cells: Selection, Killing and Regulation' },
};
const chLink = (n, anchor) => `<a href="${CH[n].file}${anchor ? `#${anchor}` : ''}">Chapter ${n}</a>`;
const WHO = {
  lining: { name: 'Airway lining cell', does: 'The virus’s home: it copied itself inside cells like this one, which secreted interferons. Fresh cells have replaced the ones that died.', ch: `Introduced in ${chLink(2, 'the-antiviral-alarm')}` },
  mac: { name: 'Macrophage', does: 'A resident sentinel: it sensed the virus’s molecular signatures and recruited other immune cells with inflammatory cytokines.', ch: `Introduced in ${chLink(2, 'barriers-and-sentinel-cells')}` },
  nk: { name: 'NK cell', does: 'An innate killer: it destroyed an infected cell whose MHC class I display had thinned, days before any T cell arrived.', ch: `Introduced in ${chLink(2, 'natural-killers-and-the-missing-self')}` },
  dc: { name: 'Dendritic cell', does: 'One of these sampled the infected tissue, matured in response to the alarm, and carried viral proteins through the lymph to the node to present them to T cells. A fresh one now samples the tissue.', ch: `Introduced in ${chLink(2, 'the-bridge-to-adaptive-immunity')} and ${chLink(4, 'dendritic-cells-from-tissue-to-lymph-node')}` },
  helper: { name: 'Helper T cell (memory)', does: 'The coordinator: it licensed the dendritic cell to prime killers and helped the B cell. It rarely kills. A few copies remain as memory.', ch: `Introduced in ${chLink(5, 'the-helpers')}` },
  killer: { name: 'Killer T cell (memory)', does: 'It recognized viral peptides on the infected cells’ MHC class I and destroyed them. Most copies died once the virus was gone; this one stays in the airway as memory.', ch: `Introduced in ${chLink(5, 'the-kill')}` },
  killerNode: { name: 'Killer T cell (memory)', does: 'One of the few killer copies left after the die-off. If the same virus returns, memory cells like it respond within days.', ch: `Introduced in ${chLink(3, 'memory-why-the-second-time-is-different')}` },
  bcell: { name: 'B cell (memory)', does: 'It bound whole virus particles with its receptors and, with help from a helper T cell, divided. Some copies became plasma cells; this one remains as memory.', ch: `Introduced in ${chLink(3, 'clonal-selection')}` },
  plasma: { name: 'Plasma cell', does: 'It secretes antibodies in large amounts. Most die after the infection; long-lived ones settle mainly in the bone marrow and keep antibody levels raised for years.', ch: `Introduced in ${chLink(3, 'antibodies-one-molecule-four-jobs')}` },
  antibody: { name: 'Antibodies', does: 'They coat free virus so it can’t enter new cells, and stay in the blood at a raised level. They can’t reach virus inside cells.', ch: `Introduced in ${chLink(3, 'antibodies-one-molecule-four-jobs')}` },
};

const CSS = `
[data-figure="${ID}"] .wt-layer { position: absolute; inset: 0; pointer-events: none; z-index: 3; }
[data-figure="${ID}"] .wt-chip {
  position: absolute; z-index: 3; width: max-content; max-width: min(17rem, 46%);
  padding: 0.3rem 0.65rem 0.32rem; border-radius: 0.6rem;
  background: color-mix(in srgb, var(--stage-dark-a, #0B1024) 86%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--stage-dark-ink-2, #A9B1CC) 30%, transparent);
  color: var(--stage-dark-ink, #E9ECF6); font: 520 13px/1.35 var(--font-ui); text-wrap: balance;
  visibility: hidden; opacity: 0;
}
[data-figure="${ID}"] .wt-chip--head { max-width: none; white-space: nowrap; padding: 0.32rem 0.75rem; font-weight: 560;
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--stage-dark-ink-2, #A9B1CC) 42%, transparent); }
[data-figure="${ID}"] .wt-headline { flex-basis: 100%; margin: 0; font: 600 var(--text-xs, 13px)/1.45 var(--font-ui); color: var(--ink); }
[data-figure="${ID}"] .wt-headline[hidden] { display: none; }
[data-figure="${ID}"] .wt-chip--brake { box-shadow: inset 0 0 0 1px color-mix(in srgb, #E5484D 65%, transparent); }
[data-figure="${ID}"].is-compact .wt-chip { max-width: 62%; }
[data-figure="${ID}"].is-compact .fig__hud .fig-tag-caps { white-space: normal; max-width: 12rem; text-align: right; line-height: 1.3; border-radius: 0.6rem; }
[data-figure="${ID}"] .wt-hits { position: absolute; inset: 0; z-index: 5; pointer-events: none; }
[data-figure="${ID}"] .wt-hit {
  position: absolute; pointer-events: auto; padding: 0; margin: 0; border: 0; border-radius: 50%;
  background: transparent; cursor: pointer; transform: translate(-50%, -50%);
  min-width: 44px; min-height: 44px;
}
[data-figure="${ID}"] .wt-hit::after {
  content: ''; position: absolute; inset: 3px; border-radius: 50%;
  border: 1.5px dashed rgb(233 236 246 / 0); transition: border-color 200ms ease;
}
[data-figure="${ID}"] .wt-hit:hover::after { border-color: rgb(233 236 246 / 0.45); }
[data-figure="${ID}"] .wt-hit[aria-pressed="true"]::after { border-color: rgb(233 236 246 / 0.9); }
[data-figure="${ID}"] .wt-hit:focus-visible { outline: 2px solid var(--stage-focus, #8EA2FF); outline-offset: 2px; }
[data-figure="${ID}"] .wt-hits[hidden] { display: none; }
[data-figure="${ID}"] .wt-closing {
  flex-basis: 100%; margin: 0; padding: 0.7rem 0.9rem; border-radius: var(--r-md, 10px);
  background: var(--paper-2); color: var(--ink-2); font: 500 var(--text-xs, 13px)/1.5 var(--font-ui);
  box-shadow: inset 3px 0 0 var(--accent);
}
[data-figure="${ID}"] .wt-closing b { color: var(--ink); font-weight: 650; }
[data-figure="${ID}"] .wt-closing[hidden], [data-figure="${ID}"] .wt-hint[hidden] { display: none; }
[data-figure="${ID}"] .wt-hint { font: 500 var(--text-xs, 13px)/1.4 var(--font-ui); color: var(--ink-3); }
[data-figure="${ID}"] .wt-card-ch { margin-top: 0.35rem; color: var(--ink-3); font-size: 0.875em; }
[data-figure="${ID}"] svg .wt-seg { fill: var(--fg-3); transition: fill 300ms ease; }
[data-figure="${ID}"] svg .wt-seg.is-now { fill: var(--fg); font-weight: 650; }
[data-figure="${ID}"] svg [data-hs-layer][data-on="0"] { display: none; }
@media (prefers-reduced-motion: reduce) { [data-figure="${ID}"] svg .wt-seg, [data-figure="${ID}"] .wt-hit::after { transition: none; } }
`;

export default function mount(fig, ctx) {
  const { gsap } = ctx;
  if (!document.getElementById(`${ID}-css`)) document.head.append(ctx.h('style', { id: `${ID}-css`, text: CSS }));
  ctx.setAspect(960 / 600, 400 / 790);
  const svg = ctx.createSVG({ viewBox: '0 0 960 600' });
  const S = (tag, attrs, parent) => ctx.svg(tag, attrs, parent);
  const ease = { inOut: gsap.parseEase('so.inOut'), out: gsap.parseEase('so.out'), in: gsap.parseEase('so.in'), line: (t) => t };

  // HUD: time label (top left), one tag (top right)
  ctx.tag('Illustrative · timings vary by pathogen', 'top-right');
  const clock = ctx.ui.clock({ value: CLOCK[0], corner: 'top-left' });

  // paints (created once; draw() keeps svg.defs)
  const inflamePaint = ctx.radialGradient(svg, [[0, PALETTE.macrophage, 0.2], [0.6, PALETTE.macrophage, 0.08], [1, PALETTE.macrophage, 0]]);
  const haze = {
    k: ctx.radialGradient(svg, [[0, PALETTE.cd8, 0.42], [0.6, PALETTE.cd8, 0.16], [1, PALETTE.cd8, 0]]),
    h: ctx.radialGradient(svg, [[0, PALETTE.cd4, 0.4], [0.6, PALETTE.cd4, 0.15], [1, PALETTE.cd4, 0]]),
    b: ctx.radialGradient(svg, [[0, PALETTE.bCell, 0.4], [0.6, PALETTE.bCell, 0.15], [1, PALETTE.bCell, 0]]),
  };
  const clipId = ctx.uid('ribbon-clip');
  const fadeIds = { a: ctx.uid('fade-a'), b: ctx.uid('fade-b') };

  // HTML layers over the stage: chips (aria-hidden: the captions carry the words) and explore hits
  const chipLayer = ctx.h('div', { class: 'wt-layer', 'aria-hidden': 'true' });
  const hitLayer = ctx.h('div', { class: 'wt-hits', hidden: true });
  ctx.stage.append(chipLayer, hitLayer);

  let layoutName = ctx.compact ? 'compact' : 'wide';
  let L = LAYOUTS[layoutName];
  let A = {};
  let hsOn = false;
  let completed = false;
  let current = -1;

  // ------------------------------------------------------------------ small helpers
  const show = (tl, nodes, pos, d = 0.5) => [].concat(nodes).forEach((n) => n && tl.fromTo(n, { attr: { opacity: 0 } }, { attr: { opacity: 1 }, duration: d, ease: 'power1.out' }, pos));
  const hide = (tl, nodes, pos, d = 0.4) => [].concat(nodes).forEach((n) => n && tl.fromTo(n, { attr: { opacity: 1 } }, { attr: { opacity: 0 }, duration: d, ease: 'power1.in' }, pos));
  const fade = (tl, node, from, to, pos, d = 0.6) => node && tl.fromTo(node, { attr: { opacity: from } }, { attr: { opacity: to }, duration: d, ease: 'sine.inOut' }, pos);
  const showChip = (tl, c, pos, d = 0.45) => c && tl.fromTo(c, { autoAlpha: 0 }, { autoAlpha: 1, duration: d, ease: 'power1.out' }, pos);
  const hideChip = (tl, c, pos, d = 0.35) => c && tl.fromTo(c, { autoAlpha: 1 }, { autoAlpha: 0, duration: d, ease: 'power1.in' }, pos);

  /** A free glyph (virion, antibody) with a planned pose, moved by explicit from→to tweens. */
  function glyph(node, parent, x, y, { s = 1, o = 0, rot = 0 } = {}) {
    const g = S('g', {}, parent);
    g.append(node);
    g._p = { x, y, s, o, rot };
    gApply(g, g._p);
    return g;
  }
  function gApply(g, p) {
    g.setAttribute('transform', `translate(${f(p.x)} ${f(p.y)}) rotate(${f(p.rot)}) scale(${f(p.s)})`);
    g.setAttribute('opacity', f(clamp(p.o, 0, 1)));
  }
  /** Tween a glyph through waypoints (each { x, y, s?, o?, rot? }); returns the end time. */
  function gTo(tl, g, way, { pos = 0, duration = 1, ez = ease.inOut } = {}) {
    const pts = [g._p, ...[].concat(way).map((w) => ({ ...g._p, ...w }))];
    const lens = [];
    let total = 0;
    for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y) + 1e-3; lens.push(d); total += d; }
    const at = (q) => {
      let t = q * total;
      for (let i = 0; i < lens.length; i++) {
        if (t <= lens[i] || i === lens.length - 1) {
          const k = clamp(t / lens[i], 0, 1), P = pts[i], Q = pts[i + 1];
          return { x: lerp(P.x, Q.x, k), y: lerp(P.y, Q.y, k), s: lerp(P.s, Q.s, k), o: lerp(P.o, Q.o, k), rot: lerp(P.rot, Q.rot, k) };
        }
        t -= lens[i];
      }
      return pts[pts.length - 1];
    };
    drive(tl, (p) => gApply(g, at(ez(p))), { duration, pos });
    g._p = { ...pts[pts.length - 1] };
    return (typeof pos === 'number' ? pos : 0) + duration;
  }
  /** Scale a rig's art (layers.idle is free for figure use) — used to squeeze through vessels. */
  function rScale(tl, R, to, { pos = 0, duration = 0.8 } = {}) {
    const from = R._s ?? 1;
    R._s = to;
    tl.fromTo(R.layers.idle, { attr: { transform: `scale(${f(from)})` } }, { attr: { transform: `scale(${f(to)})` }, duration, ease: 'sine.inOut' }, pos);
  }
  const fadeRig = (tl, R, o, pos, duration = 0.7) => move(tl, R, { opacity: o, duration, pos, stretch: 0 });

  /** Cell name label with an optional leader (always horizontal). */
  function label(parent, { text, sub, x, y, anchor = 'middle', to = null, cls = 't-label' }) {
    const g = S('g', { opacity: 0 }, parent);
    if (to) {
      const w = text.length * (cls === 't-small' ? 6.8 : 7.8);
      let lx = x, ly = y - 5;
      if (anchor === 'start') lx = x - 6;
      else if (anchor === 'end') lx = x + 6;
      else { ly = to[1] > y ? y + (sub ? 22 : 6) : y - 17; lx = clamp(to[0], x - w / 2 + 6, x + w / 2 - 6); }
      const dx = to[0] - lx, dy = to[1] - ly, len = Math.hypot(dx, dy);
      if (len > 12) {
        S('line', { class: 'leader', x1: f(lx), y1: f(ly), x2: f(to[0] - (dx / len) * 3), y2: f(to[1] - (dy / len) * 3) }, g);
        S('circle', { class: 'leader-dot', cx: f(to[0]), cy: f(to[1]), r: 2.4 }, g);
      }
    }
    S('text', { class: `${cls} t-halo`, x: f(x), y: f(y), 'text-anchor': anchor, text }, g);
    if (sub) S('text', { class: 't-small t-halo', x: f(x), y: f(y + 16), 'text-anchor': anchor, text: sub }, g);
    return g;
  }
  /** HTML chip positioned in viewBox units. anchor: 'top' | 'bottom' | 'left' | 'right' | 'center'. */
  function chip(text, x, y, anchor = 'center', extra = '') {
    const [W, H] = L.vb;
    const c = ctx.h('div', { class: `wt-chip ${extra}`, html: text });
    c.style.left = `${(x / W) * 100}%`;
    c.style.top = `${(y / H) * 100}%`;
    c.style.transform = {
      center: 'translate(-50%, -50%)', top: 'translate(-50%, 0)', bottom: 'translate(-50%, -100%)',
      left: 'translate(0, -50%)', right: 'translate(-100%, -50%)', 'top-left': 'translate(0, 0)', 'top-right': 'translate(-100%, 0)',
    }[anchor] || 'translate(-50%, -50%)';
    chipLayer.append(c);
    gsap.set(c, { autoAlpha: 0 });
    return c;
  }
  /** Handshake label: a ring on the contact, a leader, a name and (optionally) the drug that acts there. */
  function handshake(parent, { at, x, y, anchor = 'start', name, drug }) {
    const g = S('g', { opacity: 0 }, parent);
    S('circle', { cx: f(at[0]), cy: f(at[1]), r: 6, style: 'fill: none; stroke: #F4F6FB; stroke-width: 1.4; stroke-opacity: 0.95' }, g);
    // leader from the nearest edge of the text block (estimated metrics: deterministic) to the contact
    const cw = A.wide ? 6.7 : 7.5;
    const w = Math.max(name.length, drug ? drug.length : 0) * cw;
    const x0 = anchor === 'end' ? x - w : x, x1 = anchor === 'end' ? x : x + w;
    const top = y - 12, bot = drug ? y + 17 : y + 3;
    let lx = clamp(at[0], x0, x1), ly = clamp(at[1], top, bot);
    if (lx > x0 && lx < x1 && ly > top && ly < bot) ly = at[1] < y ? top : bot;
    if (at[1] >= top && at[1] <= bot) lx = at[0] < x0 ? x0 - 5 : x1 + 5;
    else ly = at[1] < top ? top - 3 : bot + 3;
    const dx = at[0] - lx, dy = at[1] - ly, len = Math.hypot(dx, dy) || 1;
    if (len > 10) S('line', { class: 'leader', x1: f(lx), y1: f(ly), x2: f(at[0] - (dx / len) * 6.5), y2: f(at[1] - (dy / len) * 6.5), style: 'stroke: rgb(244 246 251 / 0.75)' }, g);
    S('text', { class: 't-small t-halo', x: f(x), y: f(y), 'text-anchor': anchor, text: name, style: 'fill: var(--fg); font-weight: 600' }, g);
    if (drug) S('text', { class: 't-small t-halo', x: f(x), y: f(y + 15), 'text-anchor': anchor, text: drug, style: 'fill: #F6C76A' }, g);
    return g;
  }
  /** Memory marker (ch03-clonal-selection's grammar): a thin bright ring and a small "M" disc. */
  function memoryBadge(R) {
    const r = R.r;
    const c = mix(R.color, WHITE, 0.55);
    const g = S('g', { opacity: 0 }, R.layers.over);
    S('circle', { r: f(r + 3.2), style: `fill: none; stroke: ${c}; stroke-width: 1.3; stroke-opacity: 0.95` }, g);
    const m = S('g', { transform: `translate(${f(r * 0.8 + 3)} ${f(r * 0.8 + 2)})` }, g);
    S('circle', { r: 5.6, style: `fill: ${NAVY}; stroke: ${c}; stroke-width: 1` }, m);
    S('path', { d: 'M-2.6 2.1V-2L0 0.9L2.6 -2V2.1', style: `fill: none; stroke: ${c}; stroke-width: 1.25; stroke-linejoin: round; stroke-linecap: round` }, m);
    return g;
  }
  const P = (R) => [R.plan.x, R.plan.y];
  const between = (a, b, t = 0.5) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];

  // ------------------------------------------------------------------ the scene ("before step 1")
  function draw() {
    for (const n of [...svg.children]) if (n !== svg.defs) n.remove();
    chipLayer.replaceChildren();
    L = LAYOUTS[layoutName];
    const [W, H] = L.vb;
    const wide = layoutName === 'wide';
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    ctx.refreshTextScale();
    A = { wide, hits: [] };
    const R0 = rng(5, 'whole-team');

    const back = S('g', { 'data-layer': 'back' }, svg);
    const cells = S('g', { 'data-layer': 'cells' }, svg);
    const veils = S('g', { 'data-layer': 'veils' }, svg);
    const labels = S('g', { 'data-layer': 'labels' }, svg);
    const hsLayer = S('g', { 'data-hs-layer': '', 'data-on': hsOn ? '1' : '0' }, svg);
    const ribbonG = S('g', { 'data-layer': 'ribbon' }, svg);
    A.cells = cells; A.labels = labels; A.hsLayer = hsLayer;

    // ---- tissue
    const T = L.tissue;
    back.append(tissueField({ x: T.x, y: T.y, width: T.w, height: T.h, seed: 3, stage: 'dark', density: 0.7 }));
    S('rect', { x: T.x, y: T.y, width: T.w, height: T.h, rx: 14, style: 'fill: none; stroke: rgb(233 236 246 / 0.1); stroke-width: 1' }, back);
    // airway lumen: a slightly lighter band above the lining
    S('rect', { x: T.x + 1, y: T.y + 1, width: T.w - 2, height: L.lining.y - L.lining.r - T.y - 4, rx: 13, style: 'fill: rgb(159 195 217 / 0.05)' }, back);
    A.inflame = S('ellipse', { cx: f(T.x + T.w * 0.5), cy: f(L.lining.y + T.h * 0.18), rx: f(T.w * 0.62), ry: f(T.h * 0.6), fill: inflamePaint, opacity: 0 }, back);
    S('text', { class: 't-caps', x: L.titleTissue[0], y: L.titleTissue[1], text: 'Airway tissue' }, labels);

    // ---- channels (drawn before the node so the node's capsule covers their ends)
    const C = L.cap, LY = L.lymph;
    const capLen = C.orient === 'h' ? C.x1 - C.x0 : C.y1 - C.y0;
    const capV = bloodVessel({ length: capLen, width: C.w, wall: 6, rbc: wide ? 12 : 5, seed: 4, stage: 'dark' });
    A.capWrap = S('g', {}, back);
    const capPos = C.orient === 'h' ? `translate(${f((C.x0 + C.x1) / 2)} ${f(C.y)})` : `translate(${f(C.x)} ${f((C.y0 + C.y1) / 2)}) rotate(90)`;
    A.capWrap.setAttribute('transform', capPos);
    A.capInner = S('g', { transform: 'scale(1 1)' }, A.capWrap);
    A.capInner.append(capV);
    const lymLen = LY.orient === 'h' ? LY.x1 - LY.x0 : LY.y1 - LY.y0;
    const lymV = lymphaticVessel({ length: lymLen, width: LY.w, valves: wide ? 3 : 2, seed: 6, stage: 'dark', flow: 1 });
    const lymPos = LY.orient === 'h' ? `translate(${f((LY.x0 + LY.x1) / 2)} ${f(LY.y)})` : `translate(${f(LY.x)} ${f((LY.y0 + LY.y1) / 2)}) rotate(90)`;
    const lymG = S('g', { transform: lymPos }, back);
    lymG.append(lymV);
    // soft ends where the vessels begin in the tissue (fade masks)
    vesselFade(back, capV, C, 'a');
    vesselFade(back, lymV, LY, 'b');
    // direction chevrons + names
    chevrons(back, LY, 1, '#9FC3D9');
    chevrons(back, C, -1, '#E58C93');
    if (wide) {
      S('text', { class: 't-small', x: f((T.x + T.w + 566) / 2 + 6), y: f(LY.y - LY.w / 2 - 9), 'text-anchor': 'middle', text: 'lymph' }, labels);
      S('text', { class: 't-small', x: f((T.x + T.w + 566) / 2 + 6), y: f(C.y - C.w / 2 - 9), 'text-anchor': 'middle', text: 'blood' }, labels);
    } else {
      S('text', { class: 't-small', x: f(LY.x + LY.w / 2 + 8), y: f((T.y + T.h + L.node.y) / 2 - 2), 'text-anchor': 'start', text: 'lymph' }, labels);
      S('text', { class: 't-small', x: f(C.x + C.w / 2 + 8), y: f((T.y + T.h + L.node.y) / 2 - 2), 'text-anchor': 'start', text: 'blood' }, labels);
    }

    // ---- lymph node
    const N = L.node;
    const field = lymphNodeField({ x: N.x, y: N.y, width: N.w, height: N.h, seed: 7, stage: 'dark', follicles: 3, density: wide ? 0.75 : 0.65 });
    back.append(field);
    const NI = cellInfo(field);
    A.NI = NI;
    S('text', { class: 't-caps', x: L.titleNode[0], y: L.titleNode[1], 'text-anchor': L.titleNodeAnchor, text: 'Lymph node' }, labels);
    const tz = NI.tZone;
    // resident crowd: resting T cells (teal and blue) and a few B cells; context only
    const residents = S('g', { opacity: 0.5 }, back);
    const tr = wide ? 8.5 : 7.5;
    const avoid = [];
    const dcRest = [tz.cx - tz.rx * 0.08, tz.cy - tz.ry * 0.06];
    const hStart = wide ? [tz.cx - tz.rx * 0.56, tz.cy + tz.ry * 0.12] : [tz.cx - tz.rx * 0.52, tz.cy + tz.ry * 0.3];
    const kStart = [tz.cx + tz.rx * 0.5, tz.cy + tz.ry * 0.4];
    avoid.push([...dcRest, 60], [...hStart, 24], [...kStart, 24]);
    let placed = 0;
    for (let k = 0; k < 400 && placed < (wide ? 16 : 13); k++) {
      const a = R0.range(0, Math.PI * 2), d = Math.sqrt(R0()) * 0.95;
      const x = tz.cx + Math.cos(a) * tz.rx * d, y = tz.cy + Math.sin(a) * tz.ry * d;
      if (!NI.inside(x, y) || avoid.some(([ax, ay, ar]) => Math.hypot(x - ax, y - ay) < ar)) continue;
      avoid.push([x, y, tr * 2.6]);
      const c = tCell({ variant: placed % 3 ? 'cd8' : 'cd4', r: tr, seed: 40 + placed, stage: 'dark', detail: 'low', tcrKey: 3 + placed * 2 });
      c.setAttribute('transform', `translate(${f(x)} ${f(y)})`);
      residents.append(c);
      placed++;
    }
    NI.follicles.forEach((fo, i) => {
      for (let j = 0; j < 2; j++) {
        const a = i * 1.7 + j * 2.6;
        const b = bCell({ r: tr, seed: 60 + i * 3 + j, stage: 'dark', detail: 'low', receptors: false });
        b.setAttribute('transform', `translate(${f(fo.x + Math.cos(a) * fo.r * 0.45)} ${f(fo.y + Math.sin(a) * fo.r * 0.45)})`);
        residents.append(b);
      }
    });

    // ---- veils (the region not in play dims, never disappears)
    A.veilTissue = S('rect', { x: T.x, y: T.y, width: T.w, height: T.h, rx: 14, style: `fill: ${NAVY}`, opacity: 0 }, veils);
    A.veilNode = S('ellipse', { cx: f(NI.cx), cy: f(NI.cy), rx: f(NI.rx + 8), ry: f(NI.ry + 8), style: `fill: ${NAVY}`, opacity: 0.5 }, veils);

    // ---- cast: tissue
    const LN = L.lining;
    A.lining = LN.xs.map((x, i) => rig(healthyCell({ r: LN.r, seed: 11 + i, stage: 'dark', mhc: 8 }), { x, y: LN.y, parent: cells, seed: 11 + i, name: 'lining' }));
    A.infected = {
      1: healthyCell({ r: LN.r, seed: 12, stage: 'dark', state: 'infected', mhc: 8 }),
      2: healthyCell({ r: LN.r, seed: 13, stage: 'dark', state: 'infected', mhc: 8 }),
      3: healthyCell({ r: LN.r, seed: 14, stage: 'dark', state: 'infected', mhc: 3 }),   // thinned windows: NK target
    };
    A.healed = [1, 2, 3].map((i) => rig(healthyCell({ r: LN.r, seed: 31 + i, stage: 'dark', mhc: 8 }), { x: LN.xs[i], y: LN.y, parent: cells, opacity: 0, seed: 31 + i, name: 'lining' }));
    A.mac = rig(macrophage({ r: L.macR, seed: 3, stage: 'dark', variant: 'm1' }), { x: L.mac[0], y: L.mac[1], parent: cells, opacity: 0.5, seed: 3 });
    A.dc = rig(dendriticCell({ r: L.dcR, seed: 5, stage: 'dark', state: 'immature' }), { x: L.dc[0], y: L.dc[1], parent: cells, opacity: 0.5, seed: 5 });
    A.dc.layers.idle.setAttribute('transform', 'scale(1)');
    A.dcMature = dendriticCell({ r: L.dcR, seed: 5, stage: 'dark', state: 'mature' });
    A.dcNew = rig(dendriticCell({ r: L.dcR, seed: 8, stage: 'dark', state: 'immature' }), { x: L.dc[0], y: L.dc[1], parent: cells, opacity: 0, seed: 8 });
    A.nk = rig(nkCell({ r: wide ? 17 : 15, seed: 4, stage: 'dark' }), { x: L.nkFrom[0], y: L.nkFrom[1], parent: cells, opacity: 0, seed: 4 });

    // ---- cast: node
    const tR = wide ? 12 : 9.5;
    A.dcNode = rig(dendriticCell({ r: L.dcNodeR, seed: 5, stage: 'dark', state: 'mature' }), { x: dcRest[0], y: dcRest[1], parent: cells, opacity: 0, seed: 5 });
    A.dcRest = dcRest;
    A.H = rig(tCell({ variant: 'cd4', r: tR, seed: 22, stage: 'dark', tcrKey: 9 }), { x: hStart[0], y: hStart[1], parent: cells, opacity: 0.5, seed: 22 });
    A.K = rig(tCell({ variant: 'cd8', r: tR, seed: 21, stage: 'dark', tcrKey: 14 }), { x: kStart[0], y: kStart[1], parent: cells, opacity: 0.5, seed: 21 });
    const fol = NI.follicles.slice().sort((a, b) => (wide ? a.y - b.y : a.x - b.x))[0];
    const towardTz = Math.atan2(tz.cy - fol.y, tz.cx - fol.x);
    A.bPos = [fol.x + Math.cos(towardTz) * fol.r * 0.55, fol.y + Math.sin(towardTz) * fol.r * 0.55];
    A.B = rig(bCell({ r: tR, seed: 23, stage: 'dark' }), { x: A.bPos[0], y: A.bPos[1], parent: cells, opacity: 0.5, seed: 23 });
    A.fol = fol;
    A.bAngle = towardTz / DEG;
    // extra copies that fade in at step 5 (the photocopying continues beyond what divide() draws)
    A.extra = { k: [], h: [], b: [] };
    const mk = (kind, n) => {
      for (let i = 0; i < n; i++) {
        const art = kind === 'k' ? tCell({ variant: 'cd8', r: tR, seed: 21, stage: 'dark', tcrKey: 14 })
          : kind === 'h' ? tCell({ variant: 'cd4', r: tR, seed: 22, stage: 'dark', tcrKey: 9 })
            : bCell({ r: tR, seed: 23, stage: 'dark' });
        const R = rig(art, { x: 0, y: 0, parent: cells, opacity: 0, seed: 21 });
        R.plan.s = 0.94;
        place(R);
        A.extra[kind].push(R);
      }
    };
    mk('k', 4); mk('h', 4); mk('b', 2);
    A.hazes = ['k', 'h', 'b'].map((k) => S('circle', { r: wide ? 52 : 44, fill: haze[k], opacity: 0 }, back));

    // ---- free glyphs
    const gl = S('g', { 'data-layer': 'glyphs' }, cells);
    A.gl = gl;
    const vr = wide ? 6.5 : 6;
    const L2 = A.lining[2];
    A.vIn = [[-26, -6], [4, 4], [30, -4]].map(([dx, dy], i) => glyph(virus({ r: vr, seed: 70 + i, stage: 'dark' }), gl, L2.plan.x + dx * 1.4, L.lumenY + dy, { o: 0 }));
    A.vBud = [0, 1].map((i) => glyph(virus({ r: vr, seed: 80 + i, stage: 'dark' }), gl, L2.plan.x, LN.y - LN.r * 0.6, { o: 0 }));
    A.vFree = L.free.map(([x, y], i) => glyph(virus({ r: vr, seed: 90 + i, stage: 'dark' }), gl, L2.plan.x + (i ? 10 : -14), LN.y + LN.r * 0.5, { o: 0 }));
    A.vLymph = glyph(virus({ r: vr * 0.85, seed: 95, stage: 'dark' }), gl, A.lining[3].plan.x, LN.y + LN.r * 0.6, { o: 0 });
    A.rna = [0, 1].map((i) => glyph(pamp({ kind: 'rna', size: wide ? 15 : 13, stage: 'dark' }), gl, L2.plan.x, LN.y + LN.r * 0.7, { o: 0, rot: i ? 30 : -30 }));
    const abS = wide ? 14 : 12;
    A.ab5 = [0, 1, 2, 3].map((i) => glyph(antibody({ size: abS, anchor: 'center', stage: 'dark' }), gl, 0, 0, { o: 0, rot: i * 40 }));
    A.ab6 = [0, 1, 2, 3, 4, 5].map((i) => glyph(antibody({ size: abS, anchor: 'center', stage: 'dark' }), gl, 0, 0, { o: 0 }));
    A.ab8 = [0, 1].map((i) => glyph(antibody({ size: abS * 0.9, anchor: 'center', stage: 'dark' }), gl, 0, 0, { o: 0, rot: i ? -20 : 25 }));
    A.fx = fxLayer(cells);

    // ---- headline chips (wide only; phones show them under the caption)
    A.headline = {};
    if (wide) for (const [k, t] of Object.entries(HEADLINE)) A.headline[k] = chip(t, W / 2, 8, 'top', 'wt-chip--head');
    // ---- labels (built per step position; all start hidden)
    A.lab = {};
    // ---- handshakes (positions filled in by the steps)
    A.hs = {};

    // ---- ribbon
    drawRibbon(ribbonG);
    paintSegments(-1);
  }

  /** Fade the tissue end of a vessel into the tissue (where capillaries and lymphatics begin). */
  function vesselFade(parent, vessel, V, key) {
    const id = fadeIds[key];
    const old = svg.defs.querySelector(`#${id}`);
    if (old) old.remove();
    const len = V.orient === 'h' ? V.x1 - V.x0 : V.y1 - V.y0;
    // vessel frame: x from -len/2 (tissue end for both orientations here) to +len/2
    const lg = S('linearGradient', { id: `${id}-g`, gradientUnits: 'userSpaceOnUse', x1: f(-len / 2), y1: 0, x2: f(-len / 2 + Math.min(70, len * 0.3)), y2: 0 }, svg.defs);
    const prevG = svg.defs.querySelectorAll(`#${id}-g`);
    if (prevG.length > 1) prevG[0].remove();
    S('stop', { offset: 0, 'stop-color': WHITE, 'stop-opacity': key === 'a' && V.orient === 'h' ? 1 : 0 }, lg);
    S('stop', { offset: 1, 'stop-color': WHITE, 'stop-opacity': 1 }, lg);
    const m = S('mask', { id, maskUnits: 'userSpaceOnUse', x: f(-len / 2 - 10), y: -60, width: f(len + 20), height: 120 }, svg.defs);
    S('rect', { x: f(-len / 2 - 10), y: -60, width: f(len + 20), height: 120, fill: `url(#${id}-g)` }, m);
    vessel.setAttribute('mask', `url(#${id})`);
  }
  /** Direction chevrons along a channel, in the gap between the panels (dir +1 = toward +axis). */
  function chevrons(parent, V, dir, color) {
    const g = S('g', { style: `stroke: ${color}; stroke-opacity: 0.8; fill: none; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round` }, parent);
    const s = Math.min(6, V.w * 0.24);
    for (const along of V.chev) {
      const [x, y] = V.orient === 'h' ? [along, V.y] : [V.x, along];
      const rot = V.orient === 'h' ? (dir > 0 ? 0 : 180) : (dir > 0 ? 90 : -90);
      S('path', { d: `M${f(-s * 0.6)} ${f(-s)}L${f(s * 0.5)} 0L${f(-s * 0.6)} ${f(s)}`, transform: `translate(${f(x)} ${f(y)}) rotate(${rot})` }, g);
    }
  }

  // ------------------------------------------------------------------ ribbon
  function drawRibbon(g) {
    const RB = L.ribbon;
    const ux = (u) => RB.x0 + ((RB.x1 - RB.x0) * u) / 5;
    const vy = (v) => RB.base - (RB.base - RB.top) * v;
    A.ux = ux; A.vy = vy;
    S('text', { class: 't-caps', x: RB.x0, y: RB.titleY, text: 'Who’s working' }, g);
    S('text', { class: 't-small t-muted', x: RB.x1, y: RB.titleY, 'text-anchor': 'end', text: A.wide ? 'Time, stretched (not to scale)' : 'Time, stretched' }, g);
    // zones
    for (let i = 1; i < 5; i++) S('line', { x1: f(ux(i)), x2: f(ux(i)), y1: f(RB.top - 4), y2: f(RB.base), class: 'gridline' }, g);
    S('line', { x1: f(RB.x0), x2: f(RB.x1), y1: f(RB.base), y2: f(RB.base), style: 'stroke: var(--fg-3); stroke-width: 1; vector-effect: non-scaling-stroke' }, g);
    A.segs = ZONES.map((z, i) => {
      const t = S('text', { class: 't-small wt-seg', x: f(ux(i + 0.5)), y: f(RB.segY), 'text-anchor': 'middle' }, g);
      if (RB.two) {
        const [a, b] = ZONES_2[i];
        S('tspan', { x: f(ux(i + 0.5)), dy: 0, text: a }, t);
        if (b) S('tspan', { x: f(ux(i + 0.5)), dy: '1.15em', text: b }, t);
      } else t.textContent = z;
      return t;
    });
    // series, revealed up to the playhead by a clip
    const old = svg.defs.querySelector(`#${clipId}`);
    if (old) old.remove();
    const cp = S('clipPath', { id: clipId }, svg.defs);
    A.clip = S('rect', { x: f(RB.x0 - 3), y: f(RB.top - 12), width: 0, height: f(RB.base - RB.top + 14) }, cp);
    A.series = SERIES.map((s, i) => {
      const sg = S('g', { opacity: BRIGHT0[i] }, g);
      const inner = S('g', { 'clip-path': `url(#${clipId})` }, sg);
      const pts = s.pts.map(([u, v]) => [ux(u), vy(v)]);
      const d = pathD(pts, 'monotone');
      S('path', { d: `${d}L${f(ux(5))} ${f(RB.base)}L${f(ux(s.pts[0][0]))} ${f(RB.base)}Z`, style: `fill: ${s.color}; fill-opacity: 0.12; stroke: none` }, inner);
      S('path', { d, style: `fill: none; stroke: ${s.color}; stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round${s.dash ? `; stroke-dasharray: ${s.dash}` : ''}` }, inner);
      return sg;
    });
    // keys in the title row (a short sample of each line: color is never the only cue)
    let kx = RB.legendX;
    A.seriesLabels = SERIES.map((sr) => {
      const lg = S('g', {}, g);
      const y = RB.legendY;
      S('line', { x1: f(kx), x2: f(kx + 20), y1: f(y - 4.5), y2: f(y - 4.5), style: `stroke: ${sr.color}; stroke-width: 2.4; stroke-linecap: round${sr.dash ? `; stroke-dasharray: ${sr.dash}` : ''}` }, lg);
      S('text', { class: 't-small', x: f(kx + 26), y: f(y), text: sr.label, style: 'fill: var(--fg)' }, lg);
      kx += 26 + sr.label.length * (A.wide ? 7.2 : 7.6) + (A.wide ? 26 : 18);
      return lg;
    });
    // playhead
    A.head = S('g', { opacity: 0, transform: `translate(${f(ux(0))} 0)` }, g);
    S('line', { x1: 0, x2: 0, y1: f(RB.top - 8), y2: f(RB.base + 3), style: 'stroke: var(--fg); stroke-width: 1.4; stroke-opacity: 0.85' }, A.head);
    S('circle', { cx: 0, cy: f(RB.top - 9), r: 3.6, style: 'fill: var(--fg)' }, A.head);
    A.headU = 0;
  }
  /** Ribbon: move the playhead and the reveal to step i's time; brighten the bands in play. */
  function ribbonTo(tl, i, pos = 0, duration = 1.4) {
    const u0 = A.headU, u1 = STEP_U[i];
    A.headU = u1;
    const ux = A.ux;
    const x0 = L.ribbon.x0 - 3;
    tl.fromTo(A.clip, { attr: { width: f(ux(u0) - x0) } }, { attr: { width: f(ux(u1) - x0) }, duration, ease: 'sine.inOut' }, pos);
    tl.fromTo(A.head, { attr: { transform: `translate(${f(ux(u0))} 0)` } }, { attr: { transform: `translate(${f(ux(u1))} 0)` }, duration, ease: 'sine.inOut' }, pos);
    if (i === 0) fade(tl, A.head, 0, 1, pos, 0.4);
    const b0 = i ? BRIGHT[i - 1] : BRIGHT0, b1 = BRIGHT[i];
    A.series.forEach((sg, k) => { if (b0[k] !== b1[k]) fade(tl, sg, b0[k], b1[k], pos + 0.2, 0.8); });
  }
  function paintSegments(i) {
    const u = i >= 0 ? STEP_U[i] : -1;
    const z = u < 0 ? -1 : Math.min(4, Math.floor(u + (i === 3 ? 0 : 0)));
    A.segs?.forEach((t, k) => t.classList.toggle('is-now', k === z || (i === 3 && (k === 1 || k === 2))));
  }

  // ------------------------------------------------------------------ steps
  const veil = (tl, which, from, to, pos = 0, d = 0.9) => fade(tl, which === 'tissue' ? A.veilTissue : A.veilNode, from, to, pos, d);

  const steps = [
    { // 1 · Hour 0: virus enters a lining cell and multiplies inside it
      enter(tl) {
        ribbonTo(tl, 0, 0, 1.0);
        const L2 = A.lining[2];
        const r = L.lining.r;
        A.vIn.forEach((v, i) => {
          gTo(tl, v, { o: 1 }, { pos: 0.1 + i * 0.12, duration: 0.5 });
          gTo(tl, v, [{ x: L2.plan.x + (i - 1) * r * 0.3, y: L2.plan.y - r * 0.85, o: 1 }, { x: L2.plan.x + (i - 1) * r * 0.25, y: L2.plan.y - r * 0.45, o: 0, s: 0.6 }], { pos: 0.5 + i * 0.15, duration: 1.5 });
        });
        swap(tl, L2, A.infected[2], { duration: 1.1, pos: 1.7 });
        // new particles bud off toward the neighbors (they wait at their surfaces)
        A.vBud.forEach((v, i) => {
          const N = A.lining[i ? 3 : 1];
          gTo(tl, v, { o: 1 }, { pos: 2.6 + i * 0.2, duration: 0.4 });
          gTo(tl, v, [{ x: lerp(L2.plan.x, N.plan.x, 0.5), y: L2.plan.y - r * 1.3 }, { x: N.plan.x + (i ? -1 : 1) * r * 0.15, y: N.plan.y - r * 1.12 }], { pos: 2.7 + i * 0.2, duration: 1.4 });
        });
        A.lab.infected = label(A.labels, A.wide
          ? { text: 'Infected lining cell', x: L2.plan.x + 4, y: L2.plan.y + r + 46, to: [L2.plan.x, L2.plan.y + r * 0.95] }
          : { text: 'Infected lining cell', x: L2.plan.x, y: L2.plan.y + r + 40, to: [L2.plan.x, L2.plan.y + r * 0.95] });
        A.lab.virus = label(A.labels, { text: 'Virus', x: L2.plan.x + r * 1.55, y: L.lumenY + 4, anchor: 'start', cls: 't-small' });
        show(tl, A.lab.virus, 0.3);
        show(tl, A.lab.infected, 2.2);
        showChip(tl, A.headline[0], 2.6);
      },
    },
    { // 2 · Hours: interferon alarm; sentinels sense the virus; inflammation
      enter(tl) {
        ribbonTo(tl, 1, 0);
        const L2 = A.lining[2];
        const r = L.lining.r;
        hide(tl, [A.lab.virus, A.lab.infected], 0);
        hideChip(tl, A.headline[0], 0);
        emit(tl, L2, { kind: 'interferon', color: PALETTE.macrophage, n: 12, r: A.wide ? 120 : 100, size: A.wide ? 10 : 9, duration: 3.0, seed: 2, pos: 0.2 });
        A.lab.ifn = label(A.labels, { text: 'Interferons', x: L2.plan.x, y: L.lumenY + 2, cls: 't-small' });
        show(tl, A.lab.ifn, 0.6);
        // the budded particles enter the neighbors
        A.vBud.forEach((v, i) => {
          const N = A.lining[i ? 3 : 1];
          gTo(tl, v, { x: N.plan.x, y: N.plan.y - r * 0.4, o: 0, s: 0.6 }, { pos: 0.3 + i * 0.15, duration: 1.1 });
          swap(tl, N, A.infected[i ? 3 : 1], { duration: 1.0, pos: 1.0 + i * 0.15 });
        });
        // sentinels wake: viral signatures (RNA) reach them, they answer with cytokines
        fadeRig(tl, A.mac, 1, 0.6, 0.8);
        fadeRig(tl, A.dc, 1, 0.6, 0.8);
        const tgt = [A.mac, A.dc];
        A.rna.forEach((g, i) => {
          const R = tgt[i];
          const ang = Math.atan2(L2.plan.y - R.plan.y, L2.plan.x - R.plan.x);
          gTo(tl, g, { o: 1 }, { pos: 0.9 + i * 0.2, duration: 0.3 });
          gTo(tl, g, { x: R.plan.x + Math.cos(ang) * R.r * 0.8, y: R.plan.y + Math.sin(ang) * R.r * 0.8 }, { pos: 0.9 + i * 0.2, duration: 1.3 });
          gTo(tl, g, { o: 0, s: 0.7 }, { pos: 2.3 + i * 0.2, duration: 0.5 });
        });
        emit(tl, A.mac, { kind: 'cytokine', n: 12, r: A.wide ? 95 : 80, duration: 2.6, seed: 5, pos: 2.3 });
        emit(tl, A.dc, { kind: 'cytokine', n: 7, r: A.wide ? 70 : 60, duration: 2.4, seed: 6, pos: 2.5 });
        // inflamed: warmer tissue, the capillary widens a little
        fade(tl, A.inflame, 0, 1, 2.4, 1.6);
        tl.fromTo(A.capInner, { attr: { transform: 'scale(1 1)' } }, { attr: { transform: 'scale(1 1.12)' }, duration: 1.6, ease: 'sine.inOut' }, 2.4);
        A.lab.mac = label(A.labels, A.wide
          ? { text: 'Macrophage', x: A.mac.plan.x, y: A.mac.plan.y - L.macR - 10 }
          : { text: 'Macrophage', x: A.mac.plan.x + 18, y: A.mac.plan.y + L.macR + 18, anchor: 'end' });
        A.lab.dc = label(A.labels, A.wide
          ? { text: 'Dendritic cell', x: A.dc.plan.x - 4, y: A.dc.plan.y - L.dcR - 10 }
          : { text: 'Dendritic cell', x: A.dc.plan.x - 46, y: A.dc.plan.y + L.dcR + 18, anchor: 'start' });
        A.lab.inflamed = label(A.labels, A.wide
          ? { text: 'inflamed', x: 238, y: 372, cls: 't-small' }
          : { text: 'inflamed', x: 210, y: 196, cls: 't-small' });
        show(tl, [A.lab.mac, A.lab.dc], 1.4);
        show(tl, A.lab.inflamed, 3.2);
      },
    },
    { // 3 · Days 1–3: NK kills the cell with thinned windows; the dendritic cell carries the news
      enter(tl) {
        ribbonTo(tl, 2, 0);
        const r = L.lining.r;
        hide(tl, [A.lab.ifn, A.lab.mac, A.lab.dc, A.lab.inflamed], 0);
        // NK cell: out of the capillary, up to the cell whose MHC windows thinned
        const L3 = A.lining[3];
        fadeRig(tl, A.nk, 1, 0.1, 0.5);
        move(tl, A.nk, { x: L.nkVia[0][0], y: L.nkVia[0][1], duration: 1.1, pos: 0.3 });
        approach(tl, A.nk, L3, { gap: 2, angle: 90, duration: 0.9, pos: 1.4 });
        const k = kill(tl, A.nk, L3, { duration: 2.2, pos: 2.3 });
        A.nkContact = A.nk.plan.contact;
        A.lab.nk = label(A.labels, A.wide
          ? { text: 'NK cell', x: A.nk.plan.x + A.nk.r + 10, y: A.nk.plan.y + 10, anchor: 'start' }
          : { text: 'NK cell', x: A.nk.plan.x + A.nk.r + 8, y: A.nk.plan.y + 12, anchor: 'start' });
        show(tl, A.lab.nk, 1.6);
        // free virus between cells (antibodies will meet it in step 6)
        A.vFree.forEach((v, i) => {
          gTo(tl, v, { o: 1 }, { pos: 1.0 + i * 0.3, duration: 0.4 });
          gTo(tl, v, { x: L.free[i][0], y: L.free[i][1] }, { pos: 1.0 + i * 0.3, duration: 2.2, ez: ease.out });
        });
        // the dendritic cell matures and rides the lymph to the node
        swap(tl, A.dc, A.dcMature, { duration: 1.0, pos: 0.4 });
        const LY = L.lymph;
        const inlet = LY.orient === 'h' ? [LY.x0 + 14, LY.y] : [LY.x, LY.y0 + 14];
        const outlet = LY.orient === 'h' ? [LY.x1 - 8, LY.y] : [LY.x, LY.y1 - 8];
        move(tl, A.dc, { x: inlet[0], y: inlet[1], duration: 1.1, pos: 1.4 });
        rScale(tl, A.dc, 0.36, { pos: 1.6, duration: 0.8 });
        move(tl, A.dc, { x: outlet[0], y: outlet[1], duration: 1.7, pos: 2.5, stretch: 0.02 });
        fadeRig(tl, A.dc, 0, 3.9, 0.4);
        // in the node: the same cell, settled
        place(A.dcNode, { x: outlet[0], y: outlet[1] });
        fadeRig(tl, A.dcNode, 1, 3.9, 0.5);
        move(tl, A.dcNode, { x: A.dcRest[0], y: A.dcRest[1], duration: 1.4, pos: 4.1 });
        veil(tl, 'node', 0.5, 0, 3.8, 1.0);
        // a free virus particle drains with the lymph to a B-cell follicle
        const vl = A.vLymph;
        gTo(tl, vl, { o: 1 }, { pos: 1.6, duration: 0.3 });
        gTo(tl, vl, [{ x: inlet[0], y: inlet[1] }, { x: outlet[0], y: outlet[1] }], { pos: 1.6, duration: 2.6 });
        const bTip = [A.B.plan.x + (A.wide ? -A.B.r * 0.9 : A.B.r * 0.2), A.B.plan.y - A.B.r * 1.05];
        gTo(tl, vl, { x: bTip[0], y: bTip[1] }, { pos: 4.2, duration: 1.2 });
        A.lab.dcNode = label(A.labels, A.wide
          ? { text: 'Dendritic cell', sub: 'carrying viral proteins', x: A.dcRest[0] + 6, y: A.dcRest[1] + L.dcNodeR + 34 }
          : { text: 'Dendritic cell', sub: 'carrying viral proteins', x: A.dcRest[0] - 4, y: A.dcRest[1] + L.dcNodeR + 30 });
        show(tl, A.lab.dcNode, 4.9);
        void k;
      },
    },
    { // 4 · Days 2–5: the rare matching helper and killer get both signals; helper licenses and helps
      enter(tl) {
        ribbonTo(tl, 3, 0);
        hide(tl, [A.lab.nk, A.lab.dcNode], 0);
        veil(tl, 'tissue', 0, 0.55, 0.1);
        const D = A.dcNode, H = A.H, K = A.K, B = A.B;
        fadeRig(tl, H, 1, 0.2, 0.6);
        fadeRig(tl, K, 1, 0.2, 0.6);
        fadeRig(tl, B, 1, 0.2, 0.6);
        // helper first: recognition (signal 1) + "+" (signal 2); it licenses the dendritic cell
        approach(tl, H, D, { gap: 1, angle: A.wide ? -168 : 175, duration: 1.0, pos: 0.4 });
        const rH = recognize(tl, H, D, { duration: 1.4, pos: 1.4 });
        const cH = H.plan.contact;
        const hAtDc = { x: H.plan.x, y: H.plan.y };
        // the killer docks on the same dendritic cell a moment later
        approach(tl, K, D, { gap: 1, angle: 24, duration: 1.0, pos: 1.6 });
        const rK = recognize(tl, K, D, { duration: 1.4, pos: 2.6 });
        const cK = K.plan.contact;
        // then the helper finds the B cell that caught the virus
        approach(tl, H, B, { gap: 1, angle: A.wide ? 4 : A.bAngle, duration: 1.2, pos: 3.2 });
        const rB = recognize(tl, H, B, { duration: 1.4, pos: 4.4, ...(A.wide ? { badgeOffset: { x: 0, y: -24 } } : {}) });
        const cB = H.plan.contact;
        A.badges4 = [rH.badge, rK.badge, rB.badge, rH.ring, rK.ring, rB.ring];
        const w = A.wide;
        A.chipLic = chip('licensed', cH.x - 12, cH.y + 26, 'right');
        A.chipHelp = w ? chip('help', cB.x + 10, cB.y - 30, 'left') : chip('help', cB.x + 14, cB.y - 12, 'left');
        showChip(tl, A.chipLic, 2.0);
        showChip(tl, A.chipHelp, 5.0);
        A.lab.H = label(A.labels, w ? { text: 'Helper T cell', x: H.plan.x + H.r + 10, y: H.plan.y + 5, anchor: 'start' } : { text: 'Helper T cell', x: H.plan.x + 4, y: H.plan.y + H.r + 20 });
        A.lab.K = label(A.labels, { text: 'Killer T cell', x: K.plan.x + K.r + 10, y: K.plan.y + 5, anchor: 'start' });
        A.lab.B = label(A.labels, w ? { text: 'B cell', sub: 'caught the virus', x: B.plan.x - B.r - 12, y: B.plan.y - 8, anchor: 'end' }
          : { text: 'B cell', x: B.plan.x - B.r - 8, y: B.plan.y + 5, anchor: 'end' });
        A.lab.H1 = label(A.labels, { text: 'Helper T cell', x: hAtDc.x - H.r - 8, y: hAtDc.y - 2, anchor: 'end' });
        show(tl, A.lab.H1, 1.2);
        hide(tl, A.lab.H1, 3.1, 0.3);
        show(tl, A.lab.H, 4.5);
        show(tl, A.lab.K, 2.4);
        show(tl, A.lab.B, 3.6);
        // handshakes (shown only with the switch on)
        A.hs.s4 = [
          handshake(A.hsLayer, w ? { at: [cK.x, cK.y], x: cK.x + 30, y: cK.y - 44, name: 'TCR + peptide–MHC' } : { at: [cK.x, cK.y], x: 388, y: cK.y - 38, anchor: 'end', name: 'TCR + peptide–MHC' }),
          handshake(A.hsLayer, w ? { at: [cK.x + 3, cK.y + 6], x: cK.x + 30, y: cK.y + 52, name: 'CD28–B7', drug: 'anti-CTLA-4 acts here' } : { at: [cK.x + 3, cK.y + 6], x: 388, y: cK.y + 52, anchor: 'end', name: 'CD28–B7', drug: 'anti-CTLA-4 acts here' }),
          handshake(A.hsLayer, w ? { at: [cB.x, cB.y], x: cB.x - 20, y: cB.y + 44, anchor: 'end', name: 'CD40L–CD40' } : { at: [cB.x, cB.y], x: B.plan.x - 46, y: B.plan.y - B.r - 16, anchor: 'start', name: 'CD40L–CD40' }),
        ];
        show(tl, A.hs.s4[0], 3.0);
        show(tl, A.hs.s4[1], 3.2);
        show(tl, A.hs.s4[2], 5.0);
        void cH;
      },
    },
    { // 5 · Days 4–7: photocopying; killers set off through the blood; plasma cells and the first antibodies
      enter(tl) {
        ribbonTo(tl, 4, 0);
        hide(tl, [A.lab.H, A.lab.K, A.lab.B], 0);
        hide(tl, A.badges4, 0.1, 0.5);
        hide(tl, A.hs.s4, 0);
        hideChip(tl, A.chipLic, 0); hideChip(tl, A.chipHelp, 0);
        gTo(tl, A.vLymph, { o: 0, s: 0.6 }, { pos: 0.8, duration: 0.6 });
        const { K, H, B } = A;
        // the cells let go and step apart before dividing
        const off = L.clusterOff;
        move(tl, K, { x: K.plan.x + off.k[0], y: K.plan.y + off.k[1], duration: 0.8, pos: 0.1 });
        move(tl, H, { x: H.plan.x + off.h[0], y: H.plan.y + off.h[1], duration: 0.8, pos: 0.1 });
        const spread = A.wide ? 17 : 13;
        const gen = (R, a, pos) => {
          const d1 = divide(tl, R, 2, { angle: a, spread, duration: 1.2, pos });
          const d2 = [];
          d1.forEach((d, i) => d2.push(...divide(tl, d, 2, { angle: a + 90, spread: spread * 0.9, duration: 1.1, pos: pos + 1.2 + i * 0.1 })));
          return d2;
        };
        A.Kc = gen(K, 20, 0.9);
        A.Hc = gen(H, -30, 1.1);
        A.Bc = gen(B, 70, 1.3);
        // more copies keep coming (8 drawn per T-cell clone; really thousands)
        const ring = (R0, list, rad, a0, pos) => list.forEach((R, i) => {
          const a = (a0 + i * (360 / list.length) + 20) * DEG;
          const x = R0[0] + Math.cos(a) * rad, y = R0[1] + Math.sin(a) * rad;
          place(R, { x, y });
          fadeRig(tl, R, 1, pos + i * 0.18, 0.6);
        });
        const kC = [K.plan.x, K.plan.y], hC = [H.plan.x, H.plan.y], bC = [B.plan.x, B.plan.y];
        ring(kC, A.extra.k, spread * 2.5, 15, 3.4);
        ring(hC, A.extra.h, spread * 2.4, 50, 3.6);
        ring(bC, A.extra.b, spread * 2.2, 200, 3.8);
        [[kC, 0], [hC, 1], [bC, 2]].forEach(([c, i]) => {
          A.hazes[i].setAttribute('cx', f(c[0])); A.hazes[i].setAttribute('cy', f(c[1]));
          fade(tl, A.hazes[i], 0, 1, 3.0 + i * 0.2, 1.2);
        });
        // two B copies become plasma cells and release the first antibodies
        const pr = A.wide ? 14 : 12.5;
        A.plasma = [A.Bc[0], A.Bc[2]];
        A.plasma.forEach((R, i) => swap(tl, R, plasmaCell({ r: pr, seed: 24 + i, stage: 'dark', secreting: false }), { duration: 0.9, pos: 3.5 + i * 0.2 }));
        const C = L.cap;
        const vIn = C.orient === 'h' ? [C.x1 - 16, C.y] : [C.x, C.y1 - 14];
        A.ab5.forEach((g, i) => {
          const src = A.plasma[i % 2];
          g._p = { x: src.plan.x, y: src.plan.y, s: 1, o: 0, rot: i * 50 };
          gApply(g, g._p);
          gTo(tl, g, { o: 1, x: src.plan.x + (i % 2 ? 12 : -12), y: src.plan.y + 14 }, { pos: 4.3 + i * 0.15, duration: 0.6 });
          gTo(tl, g, { x: vIn[0] + (i - 1.5) * 4, y: vIn[1] + (i - 1.5) * 3, rot: i * 50 + 90 }, { pos: 4.9 + i * 0.15, duration: 1.6 });
        });
        // three killer copies set off through the blood
        A.leavers = [A.Kc[3], A.Kc[1], A.Kc[2]];
        const stops = C.orient === 'h' ? [[C.x1 - 22, C.y], [C.x1 - 50, C.y], [C.x1 - 78, C.y]] : [[C.x, C.y1 - 12], [C.x, C.y1 - 38], [C.x, C.y1 - 64]];
        A.leavers.forEach((R, i) => move(tl, R, { x: stops[i][0], y: stops[i][1], duration: 1.6, pos: 4.4 + i * 0.25 }));
        A.lab.copies = label(A.labels, A.wide
          ? { text: 'Thousands of copies', sub: '8 drawn per clone', x: kC[0] + 4, y: kC[1] + 64 }
          : { text: 'Thousands of copies', sub: '8 drawn per clone', x: kC[0] - 30, y: kC[1] + 56 });
        A.lab.plasma = label(A.labels, A.wide
          ? { text: 'Plasma cells', x: bC[0] + 50, y: bC[1] + 2, anchor: 'start' }
          : { text: 'Plasma cells', x: bC[0] + 8, y: bC[1] - 40 });
        A.lab.ab5 = label(A.labels, A.wide
          ? { text: 'First antibodies', x: vIn[0] - 30, y: vIn[1] + 40, cls: 't-small' }
          : { text: 'First antibodies', x: vIn[0] + 22, y: vIn[1] - 12, anchor: 'start', cls: 't-small' });
        show(tl, A.lab.copies, 3.8);
        show(tl, A.lab.plasma, 4.4);
        show(tl, A.lab.ab5, 5.2);
      },
    },
    { // 6 · About a week: killers read shop windows and destroy infected cells; antibodies coat free virus
      enter(tl) {
        ribbonTo(tl, 5, 0);
        hide(tl, [A.lab.copies, A.lab.plasma, A.lab.ab5], 0);
        veil(tl, 'tissue', 0.55, 0, 0.1);
        veil(tl, 'node', 0, 0.5, 0.2);
        const [Ka, Kb, Kc] = A.leavers;
        A.ab5.forEach((g, i) => gTo(tl, g, { o: 0 }, { pos: 0.2 + i * 0.1, duration: 0.6 }));
        const ex = L.killerExit;
        const C = L.cap;
        const r = L.lining.r;
        const L1 = A.lining[1], L2 = A.lining[2], L4 = A.lining[4];
        // along the blood to the airway
        if (C.orient === 'h') {
          move(tl, Ka, { x: ex[0][0], y: ex[0][1], duration: 1.5, pos: 0.2, stretch: 0.02 });
          move(tl, Kb, { x: ex[1][0], y: ex[1][1], duration: 1.7, pos: 0.3, stretch: 0.02 });
          move(tl, Kc, { x: ex[2][0], y: ex[2][1], duration: 1.3, pos: 0.35, stretch: 0.02 });
        } else {
          move(tl, Ka, { x: C.x, y: C.y0 + 14, duration: 1.4, pos: 0.2, stretch: 0.02 });
          move(tl, Kb, { x: C.x, y: C.y0 + 30, duration: 1.4, pos: 0.35, stretch: 0.02 });
          move(tl, Kc, { x: C.x, y: C.y0 + 46, duration: 1.4, pos: 0.5, stretch: 0.02 });
        }
        // read shop windows: no match on healthy cells; a match on infected ones → the kill
        probe(tl, Kc, L4, { angle: A.wide ? 120 : 110, hold: 0.5, duration: 1.1, pos: 1.9 });
        approach(tl, Ka, L2, { gap: 2, angle: A.wide ? 80 : 70, duration: 1.1, pos: 1.7 });
        kill(tl, Ka, L2, { duration: 2.0, pos: 2.8 });
        approach(tl, Kb, L1, { gap: 2, angle: 100, duration: 1.1, pos: 1.9 });
        const kB = kill(tl, Kb, L1, { duration: 2.0, pos: 3.0 });
        // antibodies coat the free virus particles
        const capTop = C.orient === 'h' ? (x) => [x, C.y - C.w / 2] : () => [C.x, C.y0 + 10];
        A.ab6.forEach((g, i) => {
          const v = A.vFree[Math.floor(i / 3)];
          const k = i % 3;
          const phi = (Math.floor(i / 3) ? 200 : 140) + k * 120;
          const vr = A.wide ? 6.5 : 6;
          const d = vr * 1.5 + (A.wide ? 9 : 8);
          const tx = v._p.x + Math.cos(phi * DEG) * d, ty = v._p.y + Math.sin(phi * DEG) * d;
          const [sx, sy] = capTop(v._p.x + (k - 1) * 22);
          g._p = { x: sx, y: sy, s: 1, o: 0, rot: phi - 90 + 180 };
          gApply(g, g._p);
          gTo(tl, g, { o: 1 }, { pos: 1.2 + i * 0.12, duration: 0.4 });
          gTo(tl, g, { x: tx, y: ty, rot: phi + 90 }, { pos: 1.2 + i * 0.12, duration: 2.0, ez: ease.out });
        });
        A.lab.killers = label(A.labels, A.wide
          ? { text: 'Killer T cells', x: 312, y: 262, anchor: 'start', to: [Ka.plan.x + 9, Ka.plan.y + 9] }
          : { text: 'Killer T cells', x: 250, y: 206, anchor: 'start', to: [Ka.plan.x + 8, Ka.plan.y + 6] });
        const v2 = A.vFree[A.wide ? 1 : 0]._p;
        A.lab.abs = label(A.labels, A.wide
          ? { text: 'Antibodies coat free virus', x: v2.x + 4, y: v2.y + 34, cls: 't-small' }
          : { text: 'Antibodies coat free virus', x: v2.x + 10, y: v2.y + 40, cls: 't-small' });
        show(tl, A.lab.killers, 2.4);
        show(tl, A.lab.abs, 3.2);
        showChip(tl, A.headline[5], 4.8);
        // handshakes
        const mac = A.mac;
        // one coated particle is grabbed by the macrophage (its Fc receptors hold the antibodies' stems)
        const gi = A.wide ? 0 : 1;
        const vF = A.vFree[gi];
        const reach = mac.r * 0.95 + 10;
        const ang = Math.atan2(vF._p.y - mac.plan.y, vF._p.x - mac.plan.x);
        const grab = [mac.plan.x + Math.cos(ang) * reach, mac.plan.y + Math.sin(ang) * reach];
        const dx = grab[0] - vF._p.x, dy = grab[1] - vF._p.y;
        gTo(tl, vF, { x: grab[0], y: grab[1] }, { pos: 3.6, duration: 1.4 });
        A.ab6.slice(gi * 3, gi * 3 + 3).forEach((g) => gTo(tl, g, { x: g._p.x + dx, y: g._p.y + dy }, { pos: 3.6, duration: 1.4 }));
        const fcAt = between(grab, P(mac), 0.42);
        A.hs.s6 = [
          handshake(A.hsLayer, A.wide ? { at: fcAt, x: fcAt[0] + 40, y: fcAt[1] - 52, anchor: 'end', name: 'Fc–Fc receptor', drug: 'antibody drugs use it' } : { at: fcAt, x: 388, y: mac.plan.y + mac.r + 22, anchor: 'end', name: 'Fc–Fc receptor', drug: 'antibody drugs use it' }),
        ];
        show(tl, A.hs.s6[0], 5.0);
        void kB;
      },
    },
    { // 7 · Weeks 2–3: no virus, no signal: die-off; brakes keep the attack in proportion
      enter(tl) {
        ribbonTo(tl, 6, 0);
        hide(tl, [A.lab.killers, A.lab.abs], 0);
        hide(tl, A.hs.s6, 0);
        hideChip(tl, A.headline[5], 0);
        veil(tl, 'node', 0.5, 0, 0.1);
        const [Ka, Kb, Kc] = A.leavers;
        // cleared: debris and coated virus disappear; the inflammation settles
        [1, 2, 3].forEach((i) => fadeRig(tl, A.lining[i], 0, 0.3 + i * 0.15, 0.9));
        [...A.vFree, ...A.ab6].forEach((g, i) => gTo(tl, g, { o: 0 }, { pos: 0.3 + (i % 3) * 0.1, duration: 0.8 }));
        fade(tl, A.inflame, 1, 0, 0.4, 1.8);
        tl.fromTo(A.capInner, { attr: { transform: 'scale(1 1.12)' } }, { attr: { transform: 'scale(1 1)' }, duration: 1.6, ease: 'sine.inOut' }, 0.4);
        // most of the new army dies (programmed death; nothing flashes)
        const node = [...A.Kc.filter((R) => !A.leavers.includes(R)), ...A.extra.k];
        A.kMem = node[0];
        const dying = [Ka, Kc, ...node.slice(1), ...A.Hc.slice(1, 4), ...A.extra.h.slice(1), ...A.extra.b, A.plasma[1], A.dcNode];
        A.hMem = [A.Hc[0], A.extra.h[0]];
        A.bMem = [A.Bc[1], A.Bc[3]];
        dying.forEach((R, i) => die(tl, R, { duration: 2.2, remnants: false, pos: 0.6 + (i % 7) * 0.22 + Math.floor(i / 7) * 0.12 }));
        A.hazes.forEach((h, i) => fade(tl, h, 1, 0, 0.8 + i * 0.1, 1.6));
        // a brake: PD-1 on the surviving killer meets PD-L1 on a neighbor (crimson "−")
        const L0 = A.lining[0];
        approach(tl, Kb, L0, { gap: 1, angle: A.wide ? 60 : 70, duration: 1.2, pos: 1.0 });
        const cb = Kb.plan.contact;
        const brake = S('g', { opacity: 0, transform: `translate(${f(cb.x)} ${f(cb.y)})` }, A.fx);
        brake.append(signalIcon({ type: 'inhibitory', size: A.wide ? 15 : 14, stage: 'dark' }));
        A.brake = brake;
        show(tl, brake, 2.2, 0.6);
        A.chipBrake = A.wide ? chip('Brakes limit tissue damage', cb.x + 18, cb.y + 34, 'left', 'wt-chip--brake')
          : chip('Brakes limit tissue damage', cb.x + 18, cb.y + 60, 'left', 'wt-chip--brake');
        showChip(tl, A.chipBrake, 2.5);
        showChip(tl, A.headline[6], 1.4);
        A.hs.s7 = [handshake(A.hsLayer, A.wide ? { at: [cb.x, cb.y], x: cb.x + 30, y: cb.y + 78, name: 'PD-1–PD-L1', drug: 'anti-PD-1/PD-L1 act here' } : { at: [cb.x, cb.y], x: 14, y: cb.y + 104, anchor: 'start', name: 'PD-1–PD-L1', drug: 'anti-PD-1/PD-L1 act here' })];
        show(tl, A.hs.s7[0], 2.4);
      },
    },
    { // 8 · Months to years: memory cells and long-lived plasma cells remain
      enter(tl) {
        ribbonTo(tl, 7, 0);
        hideChip(tl, A.chipBrake, 0); hideChip(tl, A.headline[6], 0);
        hide(tl, A.hs.s7, 0);
        hide(tl, A.brake, 0.2);
        const [, Kb] = A.leavers;
        detach(tl, Kb, { duration: 1.0, pos: 0.3 });
        // the lining heals; a fresh dendritic cell keeps watch; the macrophage rests
        A.healed.forEach((R, i) => fadeRig(tl, R, 1, 0.4 + i * 0.25, 1.0));
        fadeRig(tl, A.dcNew, 1, 0.9, 1.0);
        // memory: a few more cells than the clone started with
        const mem = [Kb, A.kMem, ...A.hMem, ...A.bMem];
        A.memRigs = mem;
        mem.forEach((R, i) => show(tl, memoryBadge(R), 1.0 + i * 0.15, 0.7));
        // a long-lived plasma cell (most settle in the bone marrow)
        const pl = A.plasma[0];
        const NI = A.NI;
        // antibodies stay at a raised, steady level in the blood
        const C = L.cap;
        A.ab8.forEach((g, i) => {
          const at = C.orient === 'h' ? [C.x0 + 160 + i * 160, C.y + (i ? 4 : -5)] : [C.x + (i ? 4 : -4), C.y0 + 60 + i * 50];
          g._p = { ...g._p, x: at[0], y: at[1] };
          gApply(g, g._p);
          gTo(tl, g, { o: 0.9 }, { pos: 1.2 + i * 0.2, duration: 0.8 });
        });
        A.lab.mem = label(A.labels, A.wide
          ? { text: 'Memory cells (M)', sub: 'more than each clone started with', x: NI.cx - NI.rx * 0.36, y: NI.cy + NI.ry * 0.6 }
          : { text: 'Memory cells (M)', sub: 'more than each clone started with', x: 220, y: NI.cy + NI.ry * 0.78 });
        A.lab.memT = label(A.labels, A.wide
          ? { text: 'Memory T cell', sub: 'stays in the airway', x: Kb.plan.x + 46, y: Kb.plan.y + 44, anchor: 'start', to: [Kb.plan.x + 10, Kb.plan.y + 10] }
          : { text: 'Memory T cell', sub: 'stays in the airway', x: Kb.plan.x + 36, y: Kb.plan.y + 40, anchor: 'start', to: [Kb.plan.x + 8, Kb.plan.y + 10] });
        A.lab.plasma8 = label(A.labels, A.wide
          ? { text: 'Long-lived plasma cell', sub: 'most live in the bone marrow', x: pl.plan.x - 34, y: pl.plan.y - 4, anchor: 'end', to: [pl.plan.x - 12, pl.plan.y - 6] }
          : { text: 'Long-lived plasma cell', sub: 'most live in the bone marrow', x: A.bPos[0] + 36, y: A.bPos[1] - 40, anchor: 'start', to: [pl.plan.x + 8, pl.plan.y - 6] });
        show(tl, A.lab.mem, 1.6);
        show(tl, A.lab.memT, 1.9);
        show(tl, A.lab.plasma8, 2.3);
        showChip(tl, A.headline[7], 2.8);
        // explore targets (after the last step)
        A.hits = [
          { key: 'killer', R: Kb }, { key: 'killerNode', R: A.kMem },
          { key: 'helper', R: A.hMem[0] }, { key: 'helper', R: A.hMem[1] },
          ...A.bMem.map((R) => ({ key: 'bcell', R })),
          { key: 'plasma', R: pl }, { key: 'mac', R: A.mac }, { key: 'nk', R: A.nk }, { key: 'dc', R: A.dcNew },
          ...[0, 1, 2, 3, 4].map((i) => ({ key: 'lining', R: i >= 1 && i <= 3 ? A.healed[i - 1] : A.lining[i] })),
          ...A.ab8.map((g) => ({ key: 'antibody', g })),
        ];
      },
    },
  ];

  // ------------------------------------------------------------------ stepper + controls
  const card = ctx.ui.infoCard({ placement: 'below', empty: null, closable: true });
  let picked = null;
  const hint = ctx.h('span', { class: 'wt-hint', text: 'Tap or click any cell to see what it did.', hidden: true });
  const headline = ctx.h('p', { class: 'wt-headline', hidden: true, 'aria-hidden': 'true' });
  const closing = ctx.h('p', { class: 'wt-closing', hidden: true, html: '<b>Swap the virus for a tumor</b> and the same sequence must run, usually without step 2’s alarm. <a href="07-escape.html">Chapter 7</a> calls it the cancer-immunity cycle.' });
  const stepper = ctx.ui.stepper({
    steps,
    reset: draw,
    dwell: 3.2,
    onChange(i) {
      current = i;
      clock.set(CLOCK[clamp(i, 0, CLOCK.length - 1)]);
      paintSegments(i);
      closing.hidden = i !== steps.length - 1;
      paintHeadline();
      syncExplore();
    },
    onComplete() { completed = true; syncExplore(); },
  });

  ctx.ui.button({
    label: 'Replay', icon: 'replay', variant: 'ghost', small: true,
    onClick: () => {
      const i = stepper.index;
      if (i > 0) { stepper.go(i - 1, { instant: true }); stepper.next(); return; }
      const tl = stepper.timeline;
      const t0 = tl.labels['s0:start'] ?? 0, t1 = tl.labels.s0;
      tl.seek(t0, true);
      if (ctx.reducedMotion) tl.seek(t1, true);
      else gsap.to(tl, { time: t1, duration: t1 - t0, ease: 'none', overwrite: true });
    },
  });
  ctx.ui.toggle({
    label: 'Show molecular contacts', checked: false,
    onChange: (on) => {
      hsOn = on;
      A.hsLayer?.setAttribute('data-on', on ? '1' : '0');
      const names = { 3: 'TCR with peptide–MHC; CD28 with B7, where anti-CTLA-4 acts; CD40L with CD40.', 5: 'TCR with peptide–MHC; Fc with Fc receptor, which antibody drugs use.', 6: 'PD-1 with PD-L1, where anti-PD-1 and anti-PD-L1 act.' };
      ctx.announce(on ? `Molecular contacts shown. ${names[current] || 'This step has no labeled contacts.'}` : 'Molecular contacts hidden.');
    },
  });
  ctx.controls.append(hint);
  ctx.controls.prepend(headline, closing);
  function paintHeadline() {
    const t = HEADLINE[current];
    headline.textContent = t || '';
    headline.hidden = !(t && layoutName === 'compact');
  }

  // ------------------------------------------------------------------ explore (after step 8)
  function syncExplore() {
    const on = completed && current === steps.length - 1;
    hint.hidden = !on;
    hitLayer.hidden = !on;
    if (!on) {
      if (card.isOpen) card.hide();
      picked = null;
      hitLayer.replaceChildren();
      hitLayer._for = null;
      return;
    }
    if (hitLayer._for !== A) buildHits();
  }
  function buildHits() {
    hitLayer._for = A;
    hitLayer.replaceChildren();
    const [W, H] = L.vb;
    for (const h of A.hits || []) {
      let x, y, r;
      if (h.R) { x = h.R.plan.x; y = h.R.plan.y; r = h.R.r * (h.R.plan.s || 1) + 4; }
      else { x = h.g._p.x; y = h.g._p.y; r = 12; }
      const W0 = WHO[h.key];
      const b = ctx.h('button', { type: 'button', class: 'wt-hit', 'aria-label': `${W0.name}: what it did`, 'aria-pressed': 'false' });
      b.style.left = `${(x / W) * 100}%`;
      b.style.top = `${(y / H) * 100}%`;
      b.style.width = `${((2 * r) / W) * 100}%`;
      b.style.aspectRatio = '1';
      b.addEventListener('click', () => pick(h, b), { signal: ctx.signal });
      hitLayer.append(b);
    }
  }
  function pick(h, b) {
    const W0 = WHO[h.key];
    hitLayer.querySelectorAll('.wt-hit').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    picked = h;
    card.show({ kicker: 'Who did what', title: W0.name, body: `<p>${W0.does}</p><p class="wt-card-ch">${W0.ch}</p>` });
    ctx.announce(`${W0.name}. ${W0.does}`);
  }
  card.el.addEventListener('click', (e) => { if (e.target.closest('.info-card__close')) hitLayer.querySelectorAll('.wt-hit').forEach((x) => x.setAttribute('aria-pressed', 'false')); });

  // ------------------------------------------------------------------ layout
  ctx.onResize(({ compact }) => {
    ctx.el.classList.toggle('is-compact', compact);
    const next = compact ? 'compact' : 'wide';
    if (next === layoutName) return;
    layoutName = next;
    stepper.rebuild();
    paintHeadline();
    syncExplore();
  });

  return {
    destroy() { chipLayer.remove(); hitLayer.remove(); },
  };
}
