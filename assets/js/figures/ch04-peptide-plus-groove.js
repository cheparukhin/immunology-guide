// ch04-peptide-plus-groove — "Peptide plus groove"
//
// A staged explorer (ctx.ui.stepper, four steps, one new control per step):
//   1 Does it fit?            peptide picker P1 / P2 / P3, person fixed to Ana
//   2 Can this T cell read it? + "Swap to a different T cell" (T1 ↔ T2)
//   3 Different people         + the 3 × 3 grid (click a cell to open that case)
//   4 The virus mutates        + "Change one anchor in P1" (P1 → P1*)
// After step 4 every control is live (free play).
//
// The DETAIL view is the library's mhcGroove close-up (side view): two pockets in the
// floor, a ridge on the wall, a nine-bead peptide (anchors 2 and 9 down, 4–6 up with a
// pattern). A figure-local TCR paddle (three loops) hangs from a killer T cell's
// membrane and lies across the groove. Shape carries the logic: anchorFits() decides
// display; a T cell reads only its own ridge + up-pattern pair.
//
// Stepper safety: the master timeline only re-lays out the stage (detail panel shifts
// left and the grid fades in at step 3 on wide stages). Everything about the current
// CASE (person, peptide, T cell, mutation) is rebuilt from scratch by show(): fresh
// nodes, explicit from → to tweens on a separate timeline, and the very same timeline
// is jumped to its end for instant renders, so every route lands on identical DOM.
import { mhcGroove, membraneSurface, anchorFits, anchorShapeD, pocketD, cellInfo, PALETTE, mix, glyphTones, dotGlow, el } from '../art/index.js';
import { recognize, drive } from './shared/cell-actions.js';

const ID = 'ch04-peptide-plus-groove';

// ------------------------------------------------------------------ the truth table
const PEOPLE = {
  ana: { id: 'ana', name: 'Ana', initial: 'A', pockets: ['round', 'round'], ridge: 'A', self: ['circle', 'circle'] },
  ben: { id: 'ben', name: 'Ben', initial: 'B', pockets: ['wide', 'round'], ridge: 'B', self: ['circle', 'circle'] },
  chen: { id: 'chen', name: 'Chen', initial: 'C', pockets: ['square', 'triangle'], ridge: 'C', self: ['square', 'triangle'] },
};
const PEOPLE_ORDER = ['ana', 'ben', 'chen'];
const PEPS = {
  p1: { id: 'p1', name: 'P1', anchors: ['circle', 'circle'], pattern: 'x' },
  p2: { id: 'p2', name: 'P2', anchors: ['square', 'circle'], pattern: 'y' },
  p3: { id: 'p3', name: 'P3', anchors: ['square', 'triangle'], pattern: 'z' },
  p1s: { id: 'p1s', name: 'P1*', anchors: ['square', 'circle'], pattern: 'x' },
};
const PEP_ORDER = ['p1', 'p2', 'p3'];
// T1 reads pattern x on ridge A; T2 reads pattern z on ridge C. Their "home" groove is the
// person whose ridge they fit (used to shape the loop tips).
const TCELLS = {
  t1: { id: 't1', name: 'T1', ridge: 'A', pattern: 'x', home: 'ana' },
  t2: { id: 't2', name: 'T2', ridge: 'C', pattern: 'z', home: 'chen' },
};
const SELF_PATTERN = 'y';   // read by neither T cell

const LABELS = {
  yes: 'Recognized',
  partial: 'Displayed, but this T cell can’t read it',
  no: 'Not displayed',
  shown: 'Displayed',
};

const pepIdOf = (c) => (c.pep == null ? null : c.pep === 'p1' && c.mutated ? 'p1s' : c.pep);
const isShown = (person, pid) => {
  if (!pid) return false;
  const P = PEOPLE[person], pep = PEPS[pid];
  return anchorFits(P.pockets[0], pep.anchors[0]) && anchorFits(P.pockets[1], pep.anchors[1]);
};
/** 'yes' | 'partial' | 'no' | 'shown' (no T cell yet) | null (no peptide) */
function outcomeOf(person, pid, tid) {
  if (!pid) return null;
  if (!isShown(person, pid)) return 'no';
  if (!tid) return 'shown';
  const P = PEOPLE[person], T = TCELLS[tid], pep = PEPS[pid];
  return T.ridge === P.ridge && T.pattern === pep.pattern ? 'yes' : 'partial';
}
const caseOutcome = (c) => outcomeOf(c.person, pepIdOf(c), c.showT ? c.tcell : null);
const badgeKind = (o) => (o === 'shown' ? 'yes' : o);

// ------------------------------------------------------------------ layouts
// wide: ≥ 980 px stage, the grid lives on the stage (right) from step 3.
// narrow: 600–980 px, same drawing, grid below the controls (spec: stack below 760 px).
// compact: < 600 px (phones), a squarer viewBox, grid below the controls.
const LAYOUTS = {
  wide: { vb: [960, 540], W: 470, gx: 480, gy: 318, shift: { gx: 300, gy: 330, s: 0.76 }, raise: 78, ghost: [0.5, 0.46], start: -0.74, tLabel: [446, 34], side: true, labels: 'side' },
  narrow: { vb: [960, 540], W: 470, gx: 480, gy: 318, shift: null, raise: 78, ghost: [0.5, 0.46], start: -0.74, tLabel: [446, 34], side: false, labels: 'side' },
  compact: { vb: [420, 470], W: 330, gx: 210, gy: 300, shift: null, raise: 60, ghost: [0.17, 0.42], start: -0.5, tLabel: [196, -60], side: false, labels: 'compact' },
};

const f = (v) => String(Math.round(v * 100) / 100);
const TR = (x, y, s = 1) => `translate(${f(x)} ${f(y)}) scale(${f(s)})`;
const bez = (p0, p1, p2, p3, t) => {
  const u = 1 - t;
  return [
    u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
    u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
  ];
};

// ------------------------------------------------------------------ CSS (scoped)
const CSS = `
[data-figure="${ID}"] .ppg-readout { position: absolute; z-index: 5; left: clamp(8px, 1.6%, 16px); top: clamp(8px, 2.2%, 14px); display: flex; flex-flow: row wrap; align-items: center; gap: 6px 8px; pointer-events: none; font-family: var(--font-ui); max-width: 66%; }
[data-figure="${ID}"] .ppg-readout__case { font-size: var(--text-xs); font-weight: 600; color: var(--fg-2); padding: 0.28rem 0.6rem; border-radius: var(--r-pill); background: color-mix(in srgb, var(--halo) 72%, transparent); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--line) 55%, transparent); white-space: nowrap; }
[data-figure="${ID}"] .ppg-readout__case b { color: var(--fg); font-weight: 650; }
[data-figure="${ID}"] .ppg-readout .badge { background: color-mix(in srgb, var(--halo) 78%, transparent); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--b) 45%, transparent); white-space: normal; }
[data-figure="${ID}"] .ppg-side { font-family: var(--font-ui); display: flex; flex-direction: column; gap: 10px; }
[data-figure="${ID}"] .ppg-side.is-stage { position: absolute; z-index: 5; right: 2.2%; top: 11.5%; width: 35%; padding: 14px 14px 12px; border-radius: var(--r-md); background: color-mix(in srgb, var(--stage-dark-a) 80%, transparent); box-shadow: inset 0 0 0 1px var(--stage-dark-border), 0 10px 30px rgb(0 0 0 / 0.25); color: var(--fg); visibility: hidden; opacity: 0; }
[data-figure="${ID}"] .ppg-side.is-below { flex: 1 1 100%; color: var(--ink); padding-top: var(--s-2); }
[data-figure="${ID}"] .ppg-side[hidden] { display: none; }
[data-figure="${ID}"] .ppg-side__title { margin: 0; font-size: var(--text-2xs); font-weight: 650; letter-spacing: var(--tracking-caps); text-transform: uppercase; color: var(--fg-2, var(--ink-2)); }
[data-figure="${ID}"] .ppg-grid { display: grid; grid-template-columns: minmax(3.6rem, auto) repeat(3, minmax(0, 1fr)); gap: 6px; align-items: stretch; }
[data-figure="${ID}"] .ppg-grid__col, [data-figure="${ID}"] .ppg-grid__row { display: flex; align-items: center; gap: 6px; font-size: var(--text-xs); font-weight: 650; color: var(--fg, var(--ink)); }
[data-figure="${ID}"] .ppg-grid__col { flex-direction: column; justify-content: flex-end; gap: 3px; padding-bottom: 2px; text-align: center; }
[data-figure="${ID}"] .ppg-grid__row { justify-content: flex-start; }
[data-figure="${ID}"] .ppg-ico { display: block; flex-shrink: 0; color: var(--fg-2, var(--ink-2)); }
[data-figure="${ID}"] .ppg-ico--pep { color: var(--c-neo-peptide); }
[data-figure="${ID}"] .ppg-cell { all: unset; box-sizing: border-box; display: grid; place-items: center; min-height: 46px; border-radius: 10px; cursor: pointer; background: color-mix(in srgb, var(--fg, var(--ink)) 5%, transparent); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--fg, var(--ink)) 14%, transparent); transition: background-color var(--dur-1), box-shadow var(--dur-1); -webkit-tap-highlight-color: transparent; }
[data-figure="${ID}"] .ppg-cell:hover { background: color-mix(in srgb, var(--fg, var(--ink)) 10%, transparent); }
[data-figure="${ID}"] .ppg-cell:focus-visible { outline: 2px solid var(--stage-focus, var(--accent)); outline-offset: 2px; }
[data-figure="${ID}"] .ppg-cell[aria-pressed="true"] { background: color-mix(in srgb, var(--stage-focus, var(--accent)) 16%, transparent); box-shadow: inset 0 0 0 2px var(--stage-focus, var(--accent)); }
[data-figure="${ID}"] .ppg-cell .badge { pointer-events: none; }
[data-figure="${ID}"] .ppg-legend { display: flex; flex-direction: column; gap: 5px; margin: 2px 0 0; padding: 0; list-style: none; }
[data-figure="${ID}"] .ppg-legend li { display: flex; align-items: center; gap: 6px; }
[data-figure="${ID}"] .ppg-legend .badge { white-space: normal; text-align: left; }
[data-figure="${ID}"] .ppg-who { margin: 0; font-size: var(--text-xs); color: var(--fg-2, var(--ink-2)); }
[data-figure="${ID}"] .ppg-note { margin: 0; font-family: var(--font-ui); font-size: var(--text-2xs); line-height: 1.45; color: var(--fg-3, var(--ink-3)); }
[data-figure="${ID}"] .ppg-side.is-below .ppg-grid { max-width: 26rem; }
[data-figure="${ID}"] .ppg-side.is-below .ppg-legend { flex-flow: row wrap; gap: 6px 12px; }
[data-figure="${ID}"] .ppg-ctl { display: contents; }
[data-figure="${ID}"] .ppg-people { flex: 1 1 100%; display: flex; flex-wrap: wrap; align-items: center; gap: 4px 10px; font-size: var(--text-xs); font-weight: 560; color: var(--fg-2); }
[data-figure="${ID}"] .ppg-av { display: inline-flex; align-items: center; gap: 5px; opacity: 0.55; }
[data-figure="${ID}"] .ppg-av i { display: inline-grid; place-items: center; width: 1.3rem; height: 1.3rem; border-radius: 50%; font-style: normal; font-size: 0.7rem; font-weight: 700; color: var(--fg); box-shadow: inset 0 0 0 1.5px currentColor; }
[data-figure="${ID}"] .ppg-av.is-on { opacity: 1; color: var(--fg); }
[data-figure="${ID}"] .ppg-av.is-on i { background: var(--stage-focus, #8EA2FF); color: #0B1024; box-shadow: none; }
[data-figure="${ID}"] .ppg-av.is-met { opacity: 1; }
[data-figure="${ID}"] .ppg-later { color: var(--fg-3); font-weight: 500; }
[data-figure="${ID}"] .ppg-ctl [hidden] { display: none !important; }
@container fig (max-width: 599.98px) {
  [data-figure="${ID}"] .ppg-readout { max-width: 78%; }
  [data-figure="${ID}"] .ppg-readout .badge { font-size: var(--text-2xs); }
}
`;
function injectCSS() {
  if (document.getElementById(`${ID}-css`)) return;
  const s = document.createElement('style');
  s.id = `${ID}-css`;
  s.textContent = CSS;
  document.head.append(s);
}

// Small inline icons for the grid headers (shape carries the logic there too).
function pocketIcon(type2) {
  const d = pocketD(type2[0], 13, 6, 9, 7) + pocketD(type2[1], 33, 6, 9, 7);
  return `<svg class="ppg-ico" width="46" height="18" viewBox="0 0 46 18" aria-hidden="true"><path d="M2 6H44" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none"/><path d="${d}" fill="currentColor" fill-opacity="0.22" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>`;
}
// Polish A7: "displayed, but this T cell can't read it" gets a hollow eye (seen, not recognized)
// instead of the generic ≈ glyph, in the grid, the legend and the on-stage readout.
const EYE = '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M2.6 12c2.4-4 5.5-6 9.4-6s7 2 9.4 6c-2.4 4-5.5 6-9.4 6s-7-2-9.4-6z"/><circle cx="12" cy="12" r="2.8"/></svg>';
const eyeify = (html) => html
  .replace(/(<span class="badge badge--partial[^"]*"><span class="badge__glyph" aria-hidden="true">)<svg[\s\S]*?<\/svg>/g, `$1${EYE}`)
  .replace(/(badge--partial[\s\S]*?<span class="visually-hidden">)Partly</g, '$1Displayed, not recognized<');

function anchorIcon(pep) {
  const beads = [6, 10.5, 15, 19.5, 24, 28.5, 33, 37.5, 42];
  let dots = '';
  beads.forEach((x, i) => { if (i !== 1 && i !== 8) dots += `<circle cx="${x}" cy="7" r="1.9"/>`; });
  const a = anchorShapeD(pep.anchors[0], beads[1], 10, 3.6) + anchorShapeD(pep.anchors[1], beads[8], 10, 3.6);
  return `<svg class="ppg-ico ppg-ico--pep" width="48" height="16" viewBox="0 0 48 16" aria-hidden="true"><path d="M6 7H42" stroke="currentColor" stroke-width="1.2" stroke-opacity="0.6"/><g fill="currentColor" fill-opacity="0.75">${dots}</g><path d="${a}" fill="currentColor"/></svg>`;
}

export default function mount(fig, ctx) {
  const { gsap } = ctx;
  injectCSS();
  ctx.setAspect(16 / 9, 420 / 470);
  ctx.tag('Illustrative');

  const svg = ctx.createSVG({ viewBox: '0 0 960 540' });
  // Soft horizontal fade for long membranes (ends dissolve instead of stopping dead).
  // fixed ids (one instance of this figure per page) keep the DOM identical on every route
  const fadeGrad = ctx.linearGradient(svg, [[0, '#000'], [0.16, '#fff'], [0.84, '#fff'], [1, '#000']], { id: `${ID}-fadeg` });
  const bandGrad = ctx.linearGradient(svg, [[0, PALETTE.healthy, 0.05], [1, PALETTE.healthy, 0]], { id: `${ID}-band`, x1: '0%', y1: '0%', x2: '0%', y2: '100%' });
  const maskId = `${ID}-fade`;
  const mask = el('mask', { id: maskId, maskContentUnits: 'objectBoundingBox' });
  mask.appendChild(el('rect', { x: 0, y: 0, width: 1, height: 1, fill: fadeGrad }));
  svg.defs.appendChild(mask);
  const MASK = `url(#${maskId})`;

  // ---------------------------------------------------------------- HTML overlays
  const readout = ctx.h('div', { class: 'ppg-readout', 'aria-hidden': 'true' });
  const readCase = ctx.h('span', { class: 'ppg-readout__case' });
  readout.append(readCase);
  const readBadge = ctx.ui.badge({ kind: 'yes', label: '', parent: readout });
  const people = ctx.h('span', { class: 'ppg-people' });
  readout.append(people);
  ctx.stage.append(readout);

  // ---------------------------------------------------------------- state
  // `state` = what the reader has chosen (and the step forces); `current` = what is drawn.
  let state = { person: 'ana', pep: 'p1', tcell: 't1', showT: false, mutated: false, step: -1 };
  let current = { person: 'ana', pep: null, tcell: 't1', showT: false, mutated: false, step: -1 };
  let stepIdx = -1;
  let layoutName = null;
  let L = null;
  let G = {};          // geometry for the current layout
  let lay = {};        // scene layers
  let caseTl = null;
  let transients = [];

  // Off-screen (or hidden tab): a one-shot case animation jumps to its end state
  // rather than waiting, so nothing runs unseen and the reader returns to the result.
  const tracker = {
    pause() { finishCase(); },
    resume() {},
    stop() { killCase(); },
  };
  ctx.track(tracker);

  // ---------------------------------------------------------------- geometry
  function geometry() {
    const W = L.W, k = W / 420;
    const probe = (person) => cellInfo(mhcGroove({ view: 'side', width: W, pockets: PEOPLE[person].pockets, ridge: PEOPLE[person].ridge, peptide: { kind: 'viral', anchors: ['circle', 'circle'], pattern: 'x' } }));
    const info = probe('ana');
    const br = W * 0.088 * 0.42;
    const sp = W * 0.088;
    const xs = Array.from({ length: 9 }, (_, i) => (i - 4) * sp);
    const yf = br * 1.35;
    const floorBottom = yf + W * 0.14;
    const capTop = -br * 0.9 - br * 1.72;         // top of the up-facing pattern caps
    const dashY = floorBottom + 30 * k;
    const dockY = capTop - 1 - 98 * k;            // T-cell membrane when docked
    const restY = dockY - 92 * k;
    const ridgeOf = (person) => cellInfo(mhcGroove({ view: 'side', width: W, pockets: PEOPLE[person].pockets, ridge: PEOPLE[person].ridge, peptide: null })).ridge;
    return {
      W, k, br, sp, xs, yf, floorBottom, capTop, dashY, dockY, restY,
      anchorY: yf + br * 0.95,
      pocketY: info.pockets.map((p) => p.y),
      ridges: { ana: ridgeOf('ana'), ben: ridgeOf('ben'), chen: ridgeOf('chen') },
      hover: [0, -86 * k],
      start: [L.start * W, dashY + 64 * k],
      ghost: [L.ghost[0] * W, dashY + 58 * k, L.ghost[1]],
    };
  }

  // ---------------------------------------------------------------- scene skeleton (reset)
  // 0: step 1 (no T cell yet: the groove sits higher, centred) · 1: T cell above · 2: grid beside
  function panelTransform(mode) {
    if (mode === 2 && L.shift) return TR(L.shift.gx, L.shift.gy, L.shift.s);
    return TR(L.gx, L.gy - (mode === 0 ? L.raise : 0), 1);
  }

  function reset() {
    killCase();
    for (const c of [...svg.children]) if (c !== svg.defs) c.remove();
    svg.setAttribute('viewBox', `0 0 ${L.vb[0]} ${L.vb[1]}`);
    G = geometry();
    const { W, k, dashY } = G;
    const panel = el('g', { 'data-part': 'panel', transform: panelTransform(0) });
    svg.appendChild(panel);
    // the presenting cell: a faint dashed surface, its interior below
    const inside = el('g', { 'data-part': 'inside' });
    const span = (L.vb[0] / 2 + 60) / (L.shift ? L.shift.s : 1);
    const bandG = el('g', { mask: MASK });
    bandG.appendChild(el('rect', { x: f(-span), y: f(dashY), width: f(span * 2), height: f(110 * k), fill: bandGrad }));
    bandG.appendChild(el('path', { d: `M${f(-span)} ${f(dashY)}H${f(span)}`, stroke: '#A9B1CC', 'stroke-width': 1.4, 'stroke-dasharray': '6 7', 'stroke-opacity': 0.55, fill: 'none' }));
    inside.appendChild(bandG);
    const insideLabel = ctx.svg('text', { class: 't-caps', x: f(L.labels === 'compact' ? -W / 2 - 10 * k : -W / 2 - 40 * k), y: f(dashY + 24 * k), text: 'inside the cell' }, inside);
    insideLabel.setAttribute('fill-opacity', '0.9');
    panel.appendChild(inside);
    lay = {
      panel,
      groove: el('g', { 'data-part': 'groove-layer' }),
      pep: el('g', { 'data-part': 'peptides' }),
      marks: el('g', { 'data-part': 'marks' }),
      t: el('g', { 'data-part': 't-layer' }),
      labels: el('g', { 'data-part': 'labels' }),
      fx: el('g', { 'data-part': 'fx' }),
    };
    panel.append(lay.groove, lay.pep, lay.marks, lay.t, lay.labels, lay.fx);
    // grid placement for this layout
    placeSide();
    show(current, { instant: true, from: current });
  }

  // ---------------------------------------------------------------- building blocks
  function grooveNode(person) {
    const P = PEOPLE[person];
    const g = el('g', {});
    const { W, k, floorBottom, dashY } = G;
    // the rest of the molecule: a short stalk + β2m bead down to the cell surface
    const T = glyphTones(PALETTE.mhc, 'dark');
    const stalk = el('g', { 'data-part': 'stalk' });
    const sh = dashY - floorBottom;
    stalk.appendChild(el('path', { d: `M0 ${f(floorBottom + sh * 0.55)}V${f(dashY + 4 * k)}`, stroke: T.stroke, 'stroke-width': f(2.6 * k), 'stroke-linecap': 'round', 'stroke-opacity': 0.75 }));
    stalk.appendChild(el('ellipse', { cx: f(-6 * k), cy: f(floorBottom + sh * 0.32), rx: f(17 * k), ry: f(sh * 0.36), fill: T.fill, stroke: T.stroke, 'stroke-width': 1.3, 'stroke-opacity': 0.8 }));
    stalk.appendChild(el('circle', { cx: f(22 * k), cy: f(floorBottom + sh * 0.42), r: f(sh * 0.3), fill: T.fill2, 'fill-opacity': 0.5, stroke: T.stroke, 'stroke-width': 1.2, 'stroke-opacity': 0.8 }));
    g.appendChild(stalk);
    g.appendChild(mhcGroove({ view: 'side', width: W, pockets: P.pockets, ridge: P.ridge, peptide: null, stage: 'dark' }));
    return g;
  }

  function peptideNode(person, anchors, pattern, kind) {
    const P = PEOPLE[person];
    const g = mhcGroove({ view: 'side', width: G.W, pockets: P.pockets, ridge: P.ridge, peptide: { kind, anchors, pattern }, stage: 'dark' });
    const pg = g.querySelector('[data-part="peptide"]');
    const wrap = el('g', { 'data-pep': kind });
    wrap.appendChild(pg);
    return wrap;
  }

  // Where a T cell's loop tips sit, in groove coordinates, when docked on its home groove.
  function homeTips(tid) {
    const T = TCELLS[tid];
    const r = G.ridges[T.home];
    return [[r[0].x, r[0].y], [0, G.capTop], [r[2].x, r[2].y]];
  }

  function tipGlyph(kind, x, y, br) {
    // y = the contact point (top of the bump / cap); the socket arches over it.
    if (kind === 'square') return `M${f(x - br * 0.78)} ${f(y + br * 0.62)}V${f(y - br * 0.14)}H${f(x + br * 0.78)}V${f(y + br * 0.62)}`;
    if (kind === 'chevron') return `M${f(x - br * 0.82)} ${f(y + br * 0.78)}L${f(x)} ${f(y - br * 0.16)}L${f(x + br * 0.82)} ${f(y + br * 0.78)}`;
    if (kind === 'dot') return `M${f(x - br * 0.58)} ${f(y + br * 0.5)}C${f(x - br * 0.58)} ${f(y - br * 0.28)} ${f(x + br * 0.58)} ${f(y - br * 0.28)} ${f(x + br * 0.58)} ${f(y + br * 0.5)}`;
    return `M${f(x - br * 0.88)} ${f(y + br * 0.6)}C${f(x - br * 0.88)} ${f(y - br * 0.5)} ${f(x + br * 0.88)} ${f(y - br * 0.5)} ${f(x + br * 0.88)} ${f(y + br * 0.6)}`;
  }

  /** A killer T cell's membrane + its receptor paddle. Frame: membrane surface at y = 0. */
  function tcellNode(tid) {
    const T = TCELLS[tid];
    const { k, br, dockY } = G;
    const tips = homeTips(tid).map(([x, y]) => [x, y - dockY]);   // in T frame
    const g = el('g', { 'data-t': tid });
    const span = (L.vb[0] / 2 + 80) / (L.shift ? L.shift.s : 1);
    const mem = membraneSurface({ width: span * 2, thickness: 13 * k, depth: 170 * k, color: 'cd8', side: 'down', stage: 'dark' });
    mem.setAttribute('mask', MASK);
    g.appendChild(mem);
    const C = glyphTones(PALETTE.cd8, 'dark');
    const light = mix(PALETTE.cd8, '#FFFFFF', 0.62);
    const xL = Math.min(tips[0][0], tips[1][0]) - 46 * k;
    const xR = Math.max(tips[2][0], tips[1][0]) + 46 * k;
    const cx = (xL + xR) / 2;
    const rec = el('g', { 'data-part': 'tcr' });
    // constant domains (two chains) anchored in the membrane
    for (const s of [-1, 1]) {
      rec.appendChild(el('path', { d: `M${f(cx + s * 9 * k)} ${f(-6 * k)}V${f(8 * k)}`, stroke: C.stroke, 'stroke-width': f(2.2 * k), 'stroke-linecap': 'round', 'stroke-opacity': 0.8 }));
      rec.appendChild(el('ellipse', { cx: f(cx + s * 12.5 * k), cy: f(25 * k), rx: f(11.5 * k), ry: f(18 * k), fill: C.fill, stroke: C.stroke, 'stroke-width': 1.3 }));
    }
    // the variable paddle: a flat slab lying across (top face + front face)
    const y0 = 42 * k, y1 = 53 * k, y2 = 66 * k, skew = 16 * k;
    rec.appendChild(el('path', { d: `M${f(xL + skew + 6 * k)} ${f(y0)}H${f(xR + skew - 6 * k)}Q${f(xR + skew)} ${f(y0)} ${f(xR)} ${f(y1)}H${f(xL)}Q${f(xL + skew * 0.4)} ${f(y0)} ${f(xL + skew + 6 * k)} ${f(y0)}Z`, fill: mix(PALETTE.cd8, '#FFFFFF', 0.28), 'fill-opacity': 0.92, stroke: light, 'stroke-width': 1.2, 'stroke-linejoin': 'round' }));
    rec.appendChild(el('rect', { x: f(xL), y: f(y1), width: f(xR - xL), height: f(y2 - y1), rx: f(5 * k), fill: C.fill2, stroke: C.stroke, 'stroke-width': 1.2 }));
    // three loops on the underside, each ending in a socket shaped for what this T cell reads
    const sideKind = T.ridge === 'C' ? 'square' : 'round';
    const midKind = T.pattern === 'z' ? 'chevron' : 'dot';
    const loops = el('g', { 'data-part': 'loops' });
    tips.forEach(([x, y], i) => {
      const top = y2 - 1;
      const yb = y - br * 0.2;
      loops.appendChild(el('path', { d: `M${f(x - 6 * k)} ${f(top)}C${f(x - 7 * k)} ${f(yb - 6 * k)} ${f(x - 3 * k)} ${f(yb)} ${f(x)} ${f(yb)}C${f(x + 3 * k)} ${f(yb)} ${f(x + 7 * k)} ${f(yb - 6 * k)} ${f(x + 6 * k)} ${f(top)}`, fill: 'none', stroke: C.stroke, 'stroke-width': f(2.4 * k), 'stroke-linecap': 'round' }));
      loops.appendChild(el('path', { d: tipGlyph(i === 1 ? midKind : sideKind, x, y, br), fill: 'none', stroke: light, 'stroke-width': f(2.6 * k), 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
    });
    rec.appendChild(loops);
    g.appendChild(rec);
    // contact glows (shown when docked and recognized)
    const glows = tips.map(([x, y]) => el('circle', { cx: f(x), cy: f(y), r: f(12 * k), fill: dotGlow('#DCE8FF', 0.95), opacity: 0 }));
    glows.forEach((c) => g.appendChild(c));
    g.glows = glows;
    g.paddle = { xL, xR, y1, y2, cx };
    return g;
  }

  function labelNode(text, x, y, anchor, leader, cls = 't-label t-halo') {
    const g = el('g', { 'data-label': text });
    if (leader) {
      const [ax, ay] = leader;
      const lx = x + (anchor === 'end' ? 4 : anchor === 'start' ? -4 : 0);
      const ly = y + (ay > y ? 6 : -10);
      g.appendChild(el('line', { class: 'leader', x1: f(lx), y1: f(ly), x2: f(ax), y2: f(ay) }));
      g.appendChild(el('circle', { class: 'leader-dot', cx: f(ax), cy: f(ay), r: 2.4 }));
    }
    ctx.svg('text', { class: cls, x: f(x), y: f(y), 'text-anchor': anchor, text }, g);
    return g;
  }

  // ---------------------------------------------------------------- the case renderer
  function finishCase() {
    if (caseTl && caseTl.progress() < 1) caseTl.progress(1);
  }

  function killCase() {
    if (caseTl) { caseTl.kill(); caseTl = null; }
    transients.forEach((n) => n.remove());
    transients = [];
  }

  /**
   * Draw `next`, animating from `from` (what is on screen). Pure function of (from, next)
   * for the end state; instant renders run the same timeline to its end.
   */
  function show(next, { instant = false, from = current } = {}) {
    killCase();
    const prev = from || null;
    current = { ...next };
    for (const key of ['groove', 'pep', 'marks', 't', 'labels', 'fx']) lay[key].replaceChildren();
    const tl = gsap.timeline({ paused: true });
    const still = gsap.timeline({ paused: true });      // parts that don't change: jump to end
    const { W, k, br, xs, dashY, dockY, restY, hover, start, ghost } = G;
    const P = PEOPLE[next.person];
    const pid = pepIdOf(next);
    const pep = pid ? PEPS[pid] : null;
    const shown = isShown(next.person, pid);
    const out = caseOutcome(next);
    const tid = next.showT ? next.tcell : null;

    const prevPid = prev ? pepIdOf(prev) : null;
    const samePerson = !!prev && prev.person === next.person;
    const prevOut = prev ? caseOutcome(prev) : null;
    const prevTid = prev && prev.showT ? prev.tcell : null;
    const mutation = samePerson && prev.pep === 'p1' && !prev.mutated && next.pep === 'p1' && next.mutated;
    const pepChanged = !samePerson || prevPid !== pid;
    const prevDisplayed = prev ? (isShown(prev.person, prevPid) ? 'foreign' : prevPid ? 'self' : null) : null;
    const lab = labelFlags(next.step, next.showT);
    const prevLab = prev ? labelFlags(prev.step, prev.showT) : { parts: false, ridge: false, tcell: false };
    // first tween on a node renders its start at once; later ones wait their turn
    const fade = (line, node, a, b, pos, duration = 0.45, later = false) => line.fromTo(node, { attr: { opacity: a } }, { attr: { opacity: b }, duration, ease: 'power1.inOut', immediateRender: !later }, pos);
    let t = 0;

    // ---- groove
    const gNode = grooveNode(next.person);
    lay.groove.appendChild(gNode);
    if (!samePerson && prev) {
      const old = el('g', {});
      old.appendChild(grooveNode(prev.person));
      if (prevDisplayed) old.appendChild(prevDisplayed === 'foreign' ? peptideNode(prev.person, PEPS[prevPid].anchors, PEPS[prevPid].pattern, 'viral') : peptideNode(prev.person, PEOPLE[prev.person].self, SELF_PATTERN, 'self'));
      lay.groove.insertBefore(old, gNode);
      transients.push(old);
      fade(tl, old, 1, 0, 0, 0.45);
      fade(tl, gNode, 0, 1, 0.25, 0.6);
      t = 0.75;
    } else {
      gNode.setAttribute('opacity', '1');
    }

    // ---- T cell: the old one leaves or lifts before the display changes
    const tChanged = prevTid !== tid;
    let tNode = null;
    if (prevTid && tChanged) {
      const oldT = tcellNode(prevTid);
      const fromY = prevOut === 'yes' ? dockY : restY;
      oldT.setAttribute('transform', TR(0, fromY));
      lay.t.appendChild(oldT);
      transients.push(oldT);
      tl.fromTo(oldT, { attr: { transform: TR(0, fromY), opacity: 1 } }, { attr: { transform: TR(0, restY - 130 * k), opacity: 0 }, duration: 0.8, ease: 'so.in' }, 0);
      t = Math.max(t, 0.5);
    }
    if (tid) {
      tNode = tcellNode(tid);
      lay.t.appendChild(tNode);
    }
    const sameTWasDocked = tid && !tChanged && prevOut === 'yes';
    const displayChanges = pepChanged || !samePerson || mutation;

    // ---- peptides
    const marks = [];
    const markAt = (i, ok) => {
      const g = ctx.badgeSVG(ok ? 'yes' : 'no', { x: f(xs[i === 0 ? 1 : 8]), y: f(G.floorBottom + 14 * k), r: f(9 * k) });
      g.setAttribute('opacity', '0');
      lay.marks.appendChild(g);
      marks.push(g);
      return g;
    };
    let fNode = null, sNode = null, ghostTag = null, selfLabel = null;
    if (pep) {
      fNode = peptideNode(next.person, pep.anchors, pep.pattern, 'viral');
      const fits = [anchorFits(P.pockets[0], pep.anchors[0]), anchorFits(P.pockets[1], pep.anchors[1])];
      fits.forEach((ok, i) => markAt(i, ok));
      if (shown) {
        lay.pep.appendChild(fNode);
        setPose(fNode, 0, 0, 1, 1);
      } else {
        sNode = peptideNode(next.person, P.self, SELF_PATTERN, 'self');
        lay.pep.append(fNode, sNode);
        setPose(fNode, ghost[0], ghost[1], ghost[2], 0.42);
        setPose(sNode, 0, 0, 1, 1);
        // the dropped peptide keeps its name and a ✕
        ghostTag = el('g', { opacity: 1 });
        const gx = ghost[0] + (W / 2) * ghost[2] + 16 * k;
        ctx.badgeSVG('no', { x: f(gx), y: f(ghost[1]), r: f(8 * k) }, ghostTag);
        ctx.svg('text', { class: 't-small', x: f(gx + 14 * k), y: f(ghost[1] + 4.5 * k), text: pep.name }, ghostTag);
        lay.labels.appendChild(ghostTag);
        selfLabel = labelNode('self', xs[0] - br - 8 * k, 4 * k, 'end', null, 't-small t-halo');
        selfLabel.querySelector('text').style.fill = PALETTE.selfPeptide;
        selfLabel.setAttribute('opacity', '1');
        lay.labels.appendChild(selfLabel);
      }
      marks.forEach((m) => m.setAttribute('opacity', shown ? '1' : '0'));
    }

    if (pep && displayChanges) {
      // outgoing peptide in the same groove lifts away
      if (samePerson && prevDisplayed && !mutation) {
        const old = prevDisplayed === 'foreign' ? peptideNode(prev.person, PEPS[prevPid].anchors, PEPS[prevPid].pattern, 'viral') : peptideNode(prev.person, PEOPLE[prev.person].self, SELF_PATTERN, 'self');
        lay.pep.insertBefore(old, lay.pep.firstChild);
        transients.push(old);
        tl.fromTo(old, { attr: { transform: TR(0, 0), opacity: 1 } }, { attr: { transform: TR(0, -60 * k), opacity: 0 }, duration: 0.55, ease: 'so.in' }, sameTWasDocked ? 0.45 : 0);
        if (prevDisplayed === 'self' && prevPid) {
          const oldGhost = peptideNode(prev.person, PEPS[prevPid].anchors, PEPS[prevPid].pattern, 'viral');
          lay.pep.insertBefore(oldGhost, lay.pep.firstChild);
          transients.push(oldGhost);
          tl.fromTo(oldGhost, { attr: { transform: TR(ghost[0], ghost[1], ghost[2]), opacity: 0.42 } }, { attr: { opacity: 0 }, duration: 0.4 }, 0);
        }
        t = Math.max(t, sameTWasDocked ? 0.9 : 0.45);
      }
      if (sameTWasDocked) {
        // the docked receptor lets go first
        tl.fromTo(tNode, { attr: { transform: TR(0, dockY) } }, { attr: { transform: TR(0, restY) }, duration: 0.75, ease: 'so.inOut' }, 0);
        t = Math.max(t, 0.55);
      }
      if (mutation) {
        // P1 sits seated … one anchor changes shape … it no longer fits and is pushed out
        const p1 = peptideNode(next.person, PEPS.p1.anchors, PEPS.p1.pattern, 'viral');
        lay.pep.insertBefore(p1, fNode);
        transients.push(p1);
        setPose(p1, 0, 0, 1, 1);
        const ax = xs[1], ay = G.anchorY;
        const ring = el('circle', { cx: f(ax), cy: f(ay), r: f(br * 1.4), fill: 'none', stroke: '#FFFFFF', 'stroke-width': f(2 * k), opacity: 0 });
        lay.fx.appendChild(ring);
        transients.push(ring);
        const t0 = Math.max(t, 0.3);
        tl.fromTo(ring, { attr: { opacity: 0, r: f(br * 1.1) } }, { attr: { opacity: 0.9, r: f(br * 1.7) }, duration: 0.6, ease: 'so.out' }, t0)
          .to(ring, { attr: { opacity: 0 }, duration: 0.5 }, t0 + 0.9);
        fade(tl, p1, 1, 0, t0 + 0.5, 0.5);
        tl.fromTo(fNode, { attr: { transform: TR(0, 0), opacity: 0 } }, { attr: { transform: TR(0, 0), opacity: 1 }, duration: 0.5, ease: 'power1.inOut' }, t0 + 0.5);
        marks.forEach((m) => fade(tl, m, 0, 1, t0 + 0.9, 0.35));
        t = t0 + 1.6;
      } else {
        // a new peptide rises from inside the cell, hovers, and tries the groove
        const t0 = t;
        setPose(fNode, start[0], start[1], 0.55, 0);
        travel(tl, fNode, [start, [start[0], -40 * k], [start[0] * 0.45, hover[1]], hover], { s0: 0.55, s1: 1, o0: 0, o1: 1, duration: 1.25, pos: t0 });
        travel(tl, fNode, [hover, hover, [0, -10 * k], [0, 0]], { s0: 1, s1: 1, o0: 1, o1: 1, duration: 0.55, pos: t0 + 1.25, ease: 'power2.out' });
        marks.forEach((m) => fade(tl, m, 0, 1, t0 + 1.75, 0.35));
        t = t0 + 2.0;
      }
      if (!shown) {
        // pushed out: falls away inside the cell; a self peptide takes the groove
        const t1 = t + 0.35;
        travel(tl, fNode, [[0, 0], [0, -34 * k], [ghost[0] * 0.6, -70 * k], [ghost[0], ghost[1]]], { s0: 1, s1: ghost[2], o0: 1, o1: 0.42, duration: 1.2, pos: t1, ease: 'so.inOut' });
        marks.forEach((m) => fade(tl, m, 1, 0, t1 + 0.6, 0.4, true));
        fade(tl, ghostTag, 0, 1, t1 + 1.1, 0.4);
        setPose(sNode, start[0], start[1], 0.55, 0);
        travel(tl, sNode, [start, [start[0], -40 * k], [start[0] * 0.45, hover[1]], hover], { s0: 0.55, s1: 1, o0: 0, o1: 1, duration: 1.15, pos: t1 + 0.7 });
        travel(tl, sNode, [hover, hover, [0, -10 * k], [0, 0]], { s0: 1, s1: 1, o0: 1, o1: 1, duration: 0.5, pos: t1 + 1.85, ease: 'power2.out' });
        fade(tl, selfLabel, 0, 1, t1 + 2.3, 0.4);
        t = t1 + 2.45;
      }
    } else if (sameTWasDocked && out !== 'yes') {
      tl.fromTo(tNode, { attr: { transform: TR(0, dockY) } }, { attr: { transform: TR(0, restY) }, duration: 0.75 }, 0);
      t = Math.max(t, 0.7);
    }

    // ---- T cell: arrive (if new), then read the display
    if (tid) {
      // pose at time 0 (the timeline's end puts it where it belongs)
      tNode.setAttribute('transform', TR(0, sameTWasDocked ? dockY : restY));
      tNode.setAttribute('opacity', '1');
      if (tChanged) {
        tl.fromTo(tNode, { attr: { transform: TR(0, restY - 120 * k), opacity: 0 } }, { attr: { transform: TR(0, restY), opacity: 1 }, duration: 0.9, ease: 'so.out' }, Math.max(0, t - 0.3));
        t = Math.max(t, 0) + 0.6;
      }
      const needsRead = tChanged || displayChanges || (sameTWasDocked !== (out === 'yes'));
      const line = needsRead ? tl : still;
      const tr = needsRead ? t + 0.1 : 0;
      if (out === 'yes') {
        line.fromTo(tNode, { attr: { transform: TR(0, restY) } }, { attr: { transform: TR(0, dockY) }, duration: 1.0, ease: 'so.inOut', immediateRender: line === still }, tr);
        tNode.glows.forEach((gl) => line.fromTo(gl, { attr: { opacity: 0 } }, { attr: { opacity: 1 }, duration: 0.45 }, tr + 0.95));
        const killer = { el: lay.fx, color: PALETTE.cd8, stage: 'dark', r: 46 * k, plan: {} };
        recognize(line, killer, { x: 0, y: G.capTop, angle: -90 }, { layer: lay.fx, radius: 20 * k, badgeSize: 16 * k, badgeOffset: { x: 54 * k, y: -15 * k }, pos: tr + 1.0 });
        t = tr + 2.6;
      } else if (out === 'partial') {
        if (needsRead) {
          const touchY = dockY - 7 * k;
          tl.fromTo(tNode, { attr: { transform: TR(0, restY) } }, { attr: { transform: TR(0, touchY) }, duration: 0.95, ease: 'so.inOut', immediateRender: false }, tr)
            .to(tNode, { attr: { transform: TR(0, restY) }, duration: 0.85, ease: 'so.inOut' }, tr + 1.35);
          t = tr + 2.2;
        }
      }
    }

    // ---- labels (anchor / pocket / ridge / receptor / T cell name)
    buildLabels(next, lab, prevLab, tl, still, tNode);

    // ---- readout
    paintReadout(next, out);
    const showBadge = out != null;
    const badgeChanged = !prev || prevOut !== out || displayChanges || tChanged;
    if (showBadge && badgeChanged) tl.fromTo(readBadge.el, { opacity: 0 }, { opacity: 1, duration: 0.45 }, Math.max(t - 0.2, 0));
    else still.fromTo(readBadge.el, { opacity: showBadge ? 1 : 0 }, { opacity: showBadge ? 1 : 0, duration: 0.01 }, 0);

    still.progress(1);
    still.kill();
    const done = () => { transients.forEach((n) => n.remove()); transients = []; if (caseTl === tl) caseTl = null; };
    if (instant || ctx.reducedMotion) {
      tl.progress(1);
      tl.kill();
      done();
    } else {
      caseTl = tl;
      tl.eventCallback('onComplete', done);
      if (ctx.visible && !document.hidden) tl.play();
      else finishCase();
    }
    paintGrid();
  }

  function setPose(node, x, y, s, o) {
    node.setAttribute('transform', TR(x, y, s));
    node.setAttribute('opacity', f(o));
  }

  /** Move a node along a cubic Bézier (stepper-safe pure render). */
  function travel(tl, node, [p0, p1, p2, p3], { s0 = 1, s1 = 1, o0 = 1, o1 = 1, duration = 1, pos = 0, ease = 'so.inOut' } = {}) {
    const e = gsap.parseEase(ease);
    drive(tl, (p) => {
      const q = e(p);
      const [x, y] = bez(p0, p1, p2, p3, q);
      node.setAttribute('transform', TR(x, y, s0 + (s1 - s0) * q));
      node.setAttribute('opacity', f(o0 + (o1 - o0) * Math.min(1, q * 3)));
    }, { duration, pos });
  }

  function labelFlags(step, showT) {
    const compact = L.labels === 'compact';
    return { parts: step >= 0 && step <= (compact ? 0 : 1), ridge: step === 1 && showT && !compact, tcell: step === 1 && showT };
  }

  function buildLabels(next, lab, prevLab, tl, still, tNode) {
    const { W, k, br, xs, anchorY, pocketY } = G;
    const ridge = G.ridges[next.person];
    const items = [];
    if (L.labels === 'side') {
      items.push(['parts', labelNode('anchor', -W / 2 - 22 * k, anchorY + 2, 'end', [xs[1] - br - 3, anchorY])]);
      items.push(['parts', labelNode('pocket', W / 2 + 22 * k, pocketY[1] + 10 * k, 'start', [xs[8] + br * 1.1, pocketY[1] + 4 * k])]);
      items.push(['ridge', labelNode('ridge', W / 2 + 22 * k, ridge[2].y - 18 * k, 'start', [ridge[2].x + br * 0.7, ridge[2].y + 2])]);
    } else {
      items.push(['parts', labelNode('anchor', W / 2 + 6 * k, -78 * k, 'end', [xs[8] + br * 0.62, anchorY - br * 0.62])]);
      items.push(['parts', labelNode('pocket', W / 2 + 6 * k, G.dashY + 26 * k, 'end', [xs[8] + br * 1.05, pocketY[1] + br * 0.4])]);
    }
    if (next.showT && tNode) {
      const name = TCELLS[next.tcell].name;
      const [tx, ty] = L.tLabel;
      const g = el('g', {});
      ctx.svg('text', { class: 't-label t-halo', x: f(tx), y: f(ty), 'text-anchor': 'end', text: `Killer T cell ${name}` }, g);
      ctx.svg('text', { class: 't-small t-halo', x: f(tx), y: f(ty + 20), 'text-anchor': 'end', text: 'and its receptor' }, g);
      tNode.appendChild(g);
      items.push(['tcell', g]);
    }
    for (const [flag, node] of items) {
      if (!node.parentNode) lay.labels.appendChild(node);
      const a = prevLab[flag] ? 1 : 0, b = lab[flag] ? 1 : 0;
      if (a !== b) tl.fromTo(node, { attr: { opacity: a } }, { attr: { opacity: b }, duration: 0.45 }, b ? 0.3 : 0);
      else still.fromTo(node, { attr: { opacity: b } }, { attr: { opacity: b }, duration: 0.01 }, 0);
    }
  }

  function paintReadout(c, out) {
    const P = PEOPLE[c.person];
    const pid = pepIdOf(c);
    const short = L.labels === 'compact';
    const parts = [short ? `<b>${P.name}</b>` : `<b>${P.name}</b>’s groove`];
    if (pid) parts.push(short ? PEPS[pid].name : `peptide ${PEPS[pid].name}`);
    if (c.showT) parts.push(short ? TCELLS[c.tcell].name : `T cell ${TCELLS[c.tcell].name}`);
    readCase.innerHTML = parts.join(' · ');
    if (out) { readBadge.set(badgeKind(out), LABELS[out]); readBadge.el.innerHTML = eyeify(readBadge.el.innerHTML); }
    paintPeople(c.person);
  }
  /** Ana, Ben and Chen are introduced from step 1 (polish A7); Ben and Chen join at step 3. */
  function paintPeople(person = 'ana') {
    const met = stepIdx >= 2;
    people.innerHTML = PEOPLE_ORDER.map((pid) => {
      const P = PEOPLE[pid];
      const on = pid === person;
      return `<span class="ppg-av${on ? ' is-on' : met ? ' is-met' : ''}"><i>${P.initial}</i>${P.name}</span>`;
    }).join('') + (met ? '' : '<span class="ppg-later">Ben and Chen join at step 3</span>');
  }

  // ---------------------------------------------------------------- the grid (step 3+)
  const side = ctx.h('div', { class: 'ppg-side is-stage' });
  const sideTitle = ctx.h('p', { class: 'ppg-side__title' });
  const grid = ctx.h('div', { class: 'ppg-grid', role: 'group', 'aria-label': 'Outcome for each person and peptide' });
  const legend = ctx.h('ul', { class: 'ppg-legend', role: 'list' });
  const who = ctx.h('p', { class: 'ppg-who' }, 'A = Ana · B = Ben · C = Chen');
  const note = ctx.h('p', { class: 'ppg-note' }, 'Each real person has up to six class I types, so real coverage is broader than this grid — but the differences between people are real.');
  side.append(sideTitle, grid, legend, who, note);
  const colHeads = {};
  const rowHeads = {};
  const cells = {};
  grid.append(ctx.h('span', { 'aria-hidden': 'true' }));
  for (const pid of PEOPLE_ORDER) {
    const P = PEOPLE[pid];
    const head = ctx.h('div', { class: 'ppg-grid__col' });
    head.innerHTML = `${pocketIcon(P.pockets)}<span class="ppg-grid__name">${P.name}</span>`;
    colHeads[pid] = head;
    grid.append(head);
  }
  for (const rid of PEP_ORDER) {
    const head = ctx.h('div', { class: 'ppg-grid__row' });
    rowHeads[rid] = head;
    grid.append(head);
    for (const person of PEOPLE_ORDER) {
      const b = ctx.h('button', { type: 'button', class: 'ppg-cell', 'aria-pressed': 'false' });
      b.addEventListener('click', () => pickCell(person, rid), { signal: ctx.signal });
      cells[`${rid}-${person}`] = b;
      grid.append(b);
    }
  }
  legend.innerHTML = eyeify(['yes', 'partial', 'no'].map((o) => `<li>${ctx.ui.badgeHTML(o, LABELS[o], 'sm')}</li>`).join(''));

  function placeSide() {
    if (L.side) {
      side.classList.add('is-stage');
      side.classList.remove('is-below');
      side.hidden = false;
      ctx.stage.append(side);
      gsap.set(side, { autoAlpha: 0 });
    } else {
      side.classList.remove('is-stage');
      side.classList.add('is-below');
      gsap.set(side, { clearProps: 'opacity,visibility' });
      ctx.controls.append(side);
      side.hidden = stepIdx < 2;
    }
    who.hidden = L.side;
    for (const pid of PEOPLE_ORDER) colHeads[pid].querySelector('.ppg-grid__name').textContent = L.side ? PEOPLE[pid].name : PEOPLE[pid].initial;
  }

  function paintGrid() {
    const c = state;
    const tid = c.showT ? c.tcell : 't1';
    sideTitle.textContent = `What T cell ${TCELLS[tid].name} sees`;
    for (const rid of PEP_ORDER) {
      const pid = rid === 'p1' && c.mutated ? 'p1s' : rid;
      rowHeads[rid].innerHTML = `<span>${PEPS[pid].name}</span>${anchorIcon(PEPS[pid])}`;
      for (const person of PEOPLE_ORDER) {
        const o = outcomeOf(person, pid, tid);
        const b = cells[`${rid}-${person}`];
        b.innerHTML = eyeify(ctx.ui.badgeHTML(o, '', 'md'));
        b.setAttribute('aria-label', `${PEOPLE[person].name}, peptide ${PEPS[pid].name}: ${LABELS[o]}`);
        b.setAttribute('aria-pressed', String(stepIdx >= 2 && current.person === person && current.pep === rid));
      }
    }
  }

  function pickCell(person, rid) {
    if (stepIdx < 2) return;
    state = { ...state, person, pep: rid };
    pepCtl.set(rid);
    go(true);
  }

  // ---------------------------------------------------------------- controls
  const ctlRow = ctx.h('div', { class: 'ppg-ctl' });
  const pepCtl = ctx.ui.segmented({
    label: 'Peptide', value: 'p1',
    options: PEP_ORDER.map((p) => ({ value: p, label: PEPS[p].name })),
    onChange: (v) => { state = { ...state, pep: v }; go(true); },
    parent: ctlRow,
  });
  const swapBtn = ctx.ui.button({
    label: 'Swap to a different T cell', icon: 'replay', variant: 'ghost', parent: ctlRow,
    onClick: () => { state = { ...state, tcell: state.tcell === 't1' ? 't2' : 't1' }; go(true); },
  });
  const mutCtl = ctx.ui.toggle({
    label: 'Change one anchor in P1', checked: false, parent: ctlRow,
    onChange: (on) => { state = { ...state, mutated: on, pep: on ? 'p1' : state.pep }; pepCtl.set(state.pep); go(true); },
  });

  function paintControls() {
    swapBtn.el.hidden = stepIdx < 1;
    mutCtl.el.hidden = stepIdx < 3;
    mutCtl.set(state.mutated);
    pepCtl.set(state.pep);
    const p1Btn = pepCtl.el.querySelector('[data-value="p1"]');
    if (p1Btn) p1Btn.lastChild.textContent = state.mutated ? 'P1*' : 'P1';
    if (!L.side) side.hidden = stepIdx < 2;
  }

  function go(user) {
    state.step = stepIdx;
    show(state);
    paintControls();
    if (user) {
      const o = caseOutcome(state);
      const P = PEOPLE[state.person];
      const pid = pepIdOf(state);
      ctx.announce(`${P.name}, peptide ${PEPS[pid].name}${state.showT ? `, T cell ${TCELLS[state.tcell].name}` : ''}: ${LABELS[o]}.`);
    }
  }

  // ---------------------------------------------------------------- stepper
  const pick = () => (ctx.compact ? 'compact' : ctx.width < 980 ? 'narrow' : 'wide');   // the grid fits on the stage only when it is wide
  layoutName = pick();
  L = LAYOUTS[layoutName];

  const stepper = ctx.ui.stepper({
    reset,
    steps: [
      { enter() {} },
      {
        enter(tl) {
          tl.fromTo(lay.panel, { attr: { transform: panelTransform(0) } }, { attr: { transform: panelTransform(1) }, duration: 1.0, ease: 'so.inOut' }, 0);
        },
      },
      {
        enter(tl) {
          if (L.shift) {
            tl.fromTo(lay.panel, { attr: { transform: panelTransform(1) } }, { attr: { transform: panelTransform(2) }, duration: 1.1, ease: 'so.inOut', immediateRender: false }, 0);
            tl.fromTo(side, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, ease: 'power1.out' }, 0.6);
          }
          // polish A7: the matrix arrives one person (column) at a time: Ana, then Ben, then Chen
          PEOPLE_ORDER.forEach((pid, k) => {
            const col = [colHeads[pid], ...PEP_ORDER.map((r) => cells[`${r}-${pid}`])];
            tl.fromTo(col, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power1.out', immediateRender: false }, 0.9 + k * 0.75);
          });
        },
      },
      { enter() {} },
    ],
    dwell: (i) => [9, 9, 8, 8][i],
    onChange(i, { instant }) {
      stepIdx = i;
      const s = { ...state, step: i, showT: i >= 1 };
      if (i <= 1) s.person = 'ana';
      if (i <= 2) s.mutated = false;
      let from = current;
      if (i === 3) {
        Object.assign(s, { person: 'ana', pep: 'p1', tcell: 't1', mutated: true });
        from = { ...s, mutated: false };
        show(from, { instant: true, from });      // snap to P1 in Ana's groove, then mutate it
      }
      state = s;
      paintControls();
      show(state, { instant, from });
    },
  });
  // the stepper controls sit first; the case controls follow on their own line
  ctx.controls.append(ctlRow);
  if (!L.side) ctx.controls.append(side);
  paintControls();

  ctx.onResize(() => {
    const name = pick();
    if (name === layoutName) return;
    layoutName = name;
    L = LAYOUTS[name];
    stepper.rebuild();
    paintControls();
  });

  return {
    destroy() { killCase(); },
  };
}
