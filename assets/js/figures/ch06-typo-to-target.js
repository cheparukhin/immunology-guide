// ch06-typo-to-target — "From typo to target"
//
// One real mutation, KRAS G12D, followed through five gates:
//   1 Changes the protein? · 2 Is it made? · 3 Displayed by this person's HLA? ·
//   4 Looks new? · 5 A matching T cell?
// Upper band: the PIPELINE (five glowing arches, a hot-pink token, and beyond gate 5 a
// killer T cell beside a stretch of cancer-cell membrane with MHC class I cups).
// Lower band: the WORKBENCH, one thing at a time (DNA → protein → fragment → six cups →
// healthy vs cancer cell → the 2016 case).
//
// Part A is a six-step ctx.ui.stepper; every Part A tween lives in its master timeline.
// Two things live OUTSIDE it, as an overlay with its own timeline and its own copies of the
// pipeline and workbench: the Patient B switch (step 4) and Part B's five other typos.
// The overlay never touches nodes the master timeline drives (it hides their wrappers),
// and any stepper navigation tears it down, so every step lands on the same DOM.
//
// The endpoint is a unit grid of 100 beads (shared unit-grid.js) with its source line:
// only the final share is measured (Parkhurst 2019), so the per-gate losses are words,
// never numbers (FIGURE-AUDIT §4 rule 18).
import {
  dna, peptideChain, peptidePositions, proteasome, mhc1, anchorShapeD, mhcGroove, tCell, cancerCell, healthyCell,
  placeOnMembrane, membraneSurface, organIcon, dotGlow, mix, PALETTE, el, cellInfo,
} from '../art/index.js';
import { rig, place, move, approach, recognize } from './shared/cell-actions.js';
import { unitGrid } from './shared/unit-grid.js';
import { C, chartRoot } from './shared/chart.js';

/** Where the endpoint T cell sits to read the display slot: on the cup's outward axis, its TCR tips
 *  (≈ 0.28 r beyond the membrane) on the cup rim, head to head (§4 rule 5). cell-actions approach()
 *  ignores gap/angle for a point target, so the contact is computed here. */
function dockAt(end) {
  const h = end.slot.head, a = (h.axis * Math.PI) / 180, d = end.tc.r * 1.28;
  return { x: h.x + Math.cos(a) * d, y: h.y + Math.sin(a) * d };
}

const ID = 'ch06-typo-to-target';

// ------------------------------------------------------------------ the data (verbatim from the spec)
// KRAS coding sequence, codons 1–18 (NM_004985; identical in both transcript variants)
const SEQ = 'ATGACTGAATATAAACTTGTGGTAGTTGGAGCTGGTGGCGTAGGCAAGAGTGCC';
const MUT = `${SEQ.slice(0, 34)}A${SEQ.slice(35)}`;              // codon 12 GGT → GAT
const AA = 'MTEYKLVVVGAGGVGKSA';
const AAM = 'MTEYKLVVVGADGVGKSA';
const FRAG = 'GADGVGKSA';
const NORMAL = 'GAGGVGKSA';
const codons = (s) => Array.from({ length: s.length / 3 }, (_, i) => s.slice(i * 3, i * 3 + 3));

const GATES = [
  ['Changes the', 'protein?'],
  ['Is it', 'made?'],
  ['Displayed by this', 'person’s HLA?'],
  ['Looks', 'new?'],
  ['A matching', 'T cell?'],
];
const GATE_TEXT = ['Changes the protein?', 'Is it made?', 'Displayed by this person’s HLA?', 'Looks new?', 'A matching T cell?'];
const FAIL_WORD = ['no change', 'not made', 'not displayed', 'looks like self'];

// Six class I grooves per patient, differing only in their pocket shapes. The fragment's two
// anchors (both alanine) are drawn as squares: only Patient A's sixth groove (HLA-C*08:02)
// holds both; nothing in Patient B holds it (Patient B is hypothetical and unlabeled).
const FRAG_ANCHORS = ['square', 'square'];
const CUPS_A = [['round', 'round'], ['triangle', 'round'], ['round', 'triangle'], ['wide', 'triangle'], ['triangle', 'triangle'], ['square', 'square']];
const CUPS_B = [['round', 'triangle'], ['triangle', 'round'], ['round', 'round'], ['triangle', 'triangle'], ['wide', 'round'], ['round', 'wide']];

const CARDS = [
  { value: 'silent', label: 'A silent typo', fail: 0, text: 'The DNA base changed, but the new codon still means the same amino acid. The protein is untouched.' },
  { value: 'off', label: 'A typo in a gene this cell never uses', fail: 1, text: 'The gene is not expressed in this kind of cell, so the mutant protein is never made.' },
  { value: 'nohold', label: 'A typo no groove binds', fail: 2, text: 'The mutant protein is made and degraded, but none of the resulting peptides binds any of this person’s six peptide-binding grooves.' },
  { value: 'hidden', label: 'A typo hidden in the groove', fail: 3, text: 'The peptide is displayed, but the changed amino acid points down into the groove. From above it looks just like the normal peptide, to which T cells are tolerant.' },
  { value: 'frameshift', label: 'A frameshift', fail: null, text: 'A missing base shifts the reading frame, so every amino acid after it is new — many new peptides, and a much better chance that one is recognized. (Often the cell detects the faulty mRNA and degrades it after only a little protein is made, so this is the best bet, not a sure thing.)' },
];

const SOURCE = 'Measured in 75 patients with digestive-tract cancers: 1.6% of protein-changing mutations were recognized (Parkhurst et al. 2019).';

// Gate looks (attribute opacities per part)
const LOOK = {
  dim: { arch: 0.22, glow: 0, label: 0.42, num: 0.45, check: 0, block: 0 },
  current: { arch: 1, glow: 1, label: 1, num: 1, check: 0, block: 0 },
  passed: { arch: 0.55, glow: 0, label: 0.78, num: 0.8, check: 1, block: 0 },
  failed: { arch: 0.4, glow: 0, label: 1, num: 0.8, check: 0, block: 1 },
};
// Part A gate states before step 1, then at the end of each step
const PLAN = [
  ['dim', 'dim', 'dim', 'dim', 'dim'],
  ['current', 'dim', 'dim', 'dim', 'dim'],
  ['passed', 'current', 'dim', 'dim', 'dim'],
  ['passed', 'passed', 'current', 'dim', 'dim'],
  ['passed', 'passed', 'passed', 'current', 'dim'],
  ['passed', 'passed', 'passed', 'passed', 'passed'],
  ['passed', 'passed', 'passed', 'passed', 'passed'],
];

const f = (v) => String(Math.round(v * 100) / 100);
const TR = (x, y, s = 1, r = 0) => `translate(${f(x)} ${f(y)}) rotate(${f(r)}) scale(${f(s)})`;

// ------------------------------------------------------------------ layouts
// wide (≥ 700 px): pipeline across the top, workbench below.
// compact (< 700 px): pipeline as five stacked bands, workbench below, a tall portrait stage.
function makeLayout(compact) {
  if (!compact) {
    const gx = [100, 228, 356, 484, 612];
    return {
      name: 'wide', vb: [960, 540], compact: false,
      gates: gx.map((x) => ({ x, y: 112 })),
      tok: { start: [gx[0] - 60, 112], mids: gx.slice(0, 4).map((x, i) => [(x + gx[i + 1]) / 2, 112]), end: null },
      track: [40, 112, 905, 112],
      divider: 226, title: [40, 252],
      end: { cancer: [1106, 112, 182], t: [790, 58, 25], cupArc: [158, 202], tLabel: [790, 18], cLabel: [946, 212] },
      wb: { cx: 480, top: 240, bottom: 540 },
    };
  }
  const gy = [44, 92, 140, 188, 236];
  return {
    name: 'compact', vb: [400, 820], compact: true,
    gates: gy.map((y) => ({ x: 34, y })),
    tok: { start: [34, 17], mids: gy.slice(0, 4).map((y, i) => [34, (y + gy[i + 1]) / 2]), end: null },
    track: [34, 17, 34, 296],
    divider: 330, title: [18, 356],
    end: { cancer: [256, 304, 0], t: [86, 288, 15], cupArc: null, tLabel: [86, 322], cLabel: [388, 270] },
    wb: { cx: 200, top: 340, bottom: 820 },
  };
}

// ------------------------------------------------------------------ CSS
const CSS = `
[data-figure="${ID}"] .tt-link { position: absolute; z-index: 5; font-family: var(--font-ui); font-size: var(--text-xs); font-weight: 600; color: #A3B2FF; text-decoration: none; padding: 0.35rem 0.6rem; margin: -0.35rem -0.6rem; border-radius: var(--r-sm); visibility: hidden; opacity: 0; white-space: nowrap; }
[data-figure="${ID}"] .tt-link:hover { text-decoration: underline; }
[data-figure="${ID}"] .tt-link:focus-visible { outline: 2px solid var(--stage-focus); outline-offset: 2px; }
[data-figure="${ID}"] .tt-partb { flex: 1 1 100%; display: flex; flex-direction: column; gap: var(--s-3); padding-top: var(--s-3); border-top: 1px solid var(--rule); }
[data-figure="${ID}"] .tt-partb[hidden] { display: none; }
[data-figure="${ID}"] .tt-partb__head { margin: 0; font-family: var(--font-ui); font-size: var(--text-ui); font-weight: 620; color: var(--ink); }
[data-figure="${ID}"] .tt-partb__hint { margin: -0.4rem 0 0; font-family: var(--font-ui); font-size: var(--text-xs); color: var(--ink-3); }
[data-figure="${ID}"] .tt-score { display: flex; flex-direction: column; gap: 6px; margin-top: var(--s-2); }
[data-figure="${ID}"] .tt-score svg { display: block; width: 100%; max-width: 44rem; height: auto; overflow: visible; }
[data-figure="${ID}"] .tt-score__src { margin: 0; font-family: var(--font-ui); font-size: 12px; line-height: 1.45; color: var(--ink-3); max-width: 46rem; }
[data-figure="${ID}"] .tt-ctl { display: contents; }
[data-figure="${ID}"] .tt-ctl > [hidden] { display: none !important; }
[data-figure="${ID}"] .chips--card .chip--card { flex-basis: 9rem; }
`;
function injectCSS() {
  if (document.getElementById(`${ID}-css`)) return;
  const s = document.createElement('style');
  s.id = `${ID}-css`;
  s.textContent = CSS;
  document.head.append(s);
}

export default function mount(fig, ctx) {
  const { gsap } = ctx;
  injectCSS();
  const PORTRAIT = 400 / 820;
  ctx.setAspect(16 / 9, PORTRAIT);
  ctx.tag('Not to scale');
  const svg = ctx.createSVG({ viewBox: '0 0 960 540' });
  const clipId = `${ID}-band`;
  const clip = el('clipPath', { id: clipId });
  const clipRect = el('rect', { x: 0, y: -40, width: 960, height: 266 });
  clip.appendChild(clipRect);
  svg.defs.appendChild(clip);

  const link = ctx.h('a', { class: 'tt-link', href: '07-escape.html#how-tumors-escape' }, 'How tumors hide → Chapter 7');
  ctx.stage.append(link);

  let L = makeLayout(ctx.width > 0 && ctx.width < 700);
  if (L.compact) ctx.setAspect(PORTRAIT, PORTRAIT);
  let S = {};            // scene handles (rebuilt in reset)
  let stepIdx = -1;
  let overlayTl = null;
  let overlayOn = null;  // null | 'patientB' | card value

  // ---------------------------------------------------------------- small drawing helpers
  const txt = (parent, x, y, text, cls = 't-small', anchor = 'middle', extra = {}) => {
    const t = ctx.svg('text', { class: cls, x: f(x), y: f(y), 'text-anchor': anchor, ...extra }, parent);
    t.textContent = text;
    return t;
  };
  const grp = (parent, attrs = {}) => { const g = el('g', attrs); parent.appendChild(g); return g; };
  const hidden = (parent, attrs = {}) => grp(parent, { opacity: 0, ...attrs });
  const show = (tl, node, pos, duration = 0.5) => tl.fromTo(node, { attr: { opacity: 0 } }, { attr: { opacity: 1 }, duration, ease: 'power1.out' }, pos);
  const hide = (tl, node, pos, duration = 0.4) => tl.to(node, { attr: { opacity: 0 }, duration, ease: 'power1.in' }, pos);
  /** Letters drawn on top of beads (peptidePositions frame), D in white on hot pink. */
  function beadLetters(parent, letters, pos, { pinkIndex = -1, size = 'small' } = {}) {
    const g = grp(parent, {});
    letters.split('').forEach((ch, i) => {
      const t = txt(g, pos[i][0], pos[i][1] + 0.5, ch, size === 'small' ? 't-small' : 't-label', 'middle', { 'dominant-baseline': 'central' });
      t.style.fill = i === pinkIndex ? '#6B0A2E' : '#2A2014';
      t.style.fontWeight = '700';
    });
    return g;
  }
  /** A text line where one character range is hot pink (tspans). */
  function mixedText(parent, x, y, parts, cls = 't-label t-num', anchor = 'middle') {
    const t = ctx.svg('text', { class: cls, x: f(x), y: f(y), 'text-anchor': anchor }, parent);
    for (const [s, pink] of parts) {
      const ts = ctx.svg('tspan', {}, t);
      ts.textContent = s;
      if (pink) { ts.style.fill = PALETTE.foreignPeptide; ts.style.fontWeight = '700'; }
    }
    return t;
  }
  function tokenNode(parent) {
    const g = grp(parent, { 'data-part': 'token' });
    g.appendChild(el('circle', { r: 20, fill: dotGlow(PALETTE.foreignPeptide, 0.7) }));
    g.appendChild(el('circle', { r: 8.5, fill: PALETTE.foreignPeptide, stroke: mix(PALETTE.foreignPeptide, '#FFFFFF', 0.6), 'stroke-width': 1.4 }));
    g.appendChild(el('circle', { r: 2.8, fill: '#FFFFFF', 'fill-opacity': 0.9 }));
    return g;
  }
  /** The fragment as tried in a groove: nine tiny beads, the two anchors drawn as squares. */
  function trialFragment(parent, u) {
    const g = grp(parent, { 'data-part': 'trial' });
    const xs = Array.from({ length: 9 }, (_, i) => (i - 4) * u * 0.11);
    const stroke = mix(PALETTE.foreignPeptide, '#FFFFFF', 0.55);
    g.appendChild(el('ellipse', { cx: 0, cy: 0, rx: f(u * 0.6), ry: f(u * 0.16), fill: dotGlow(PALETTE.foreignPeptide, 0.45) }));
    g.appendChild(el('path', { d: `M${f(xs[0])} 0H${f(xs[8])}`, stroke, 'stroke-width': f(u * 0.02), 'stroke-opacity': 0.8 }));
    let d = '';
    xs.forEach((x, i) => {
      if (i === 1 || i === 8) d += anchorShapeD('square', x, u * 0.045, u * 0.042);
      else d += `M${f(x - u * 0.04)} 0a${f(u * 0.04)} ${f(u * 0.04)} 0 1 0 ${f(u * 0.08)} 0a${f(u * 0.04)} ${f(u * 0.04)} 0 1 0 ${f(-u * 0.08)} 0Z`;
    });
    g.appendChild(el('path', { d, fill: PALETTE.foreignPeptide, stroke, 'stroke-width': f(u * 0.012) }));
    return g;
  }

  // ---------------------------------------------------------------- the pipeline
  function buildPipeline(parent) {
    const P = { gates: [], parent };
    const [x0, y0, x1, y1] = L.track;
    const track = grp(parent, { 'data-part': 'track' });
    track.appendChild(el('path', { d: `M${f(x0)} ${f(y0)}L${f(x1)} ${f(y1)}`, stroke: '#7F89AB', 'stroke-width': 2, 'stroke-opacity': 0.35, 'stroke-dasharray': '2 6', 'stroke-linecap': 'round' }));
    L.gates.forEach((g, i) => {
      const G = { x: g.x, y: g.y };
      const root = grp(parent, { 'data-gate': String(i + 1) });
      const archColor = '#C9D3F0';
      if (!L.compact) {
        const d = `M${f(g.x - 30)} ${f(g.y + 30)}V${f(g.y - 20)}A30 30 0 0 1 ${f(g.x + 30)} ${f(g.y - 20)}V${f(g.y + 30)}`;
        G.glow = grp(root, { opacity: 0 });
        G.glow.appendChild(el('ellipse', { cx: f(g.x), cy: f(g.y - 8), rx: 58, ry: 64, fill: dotGlow('#9FB4FF', 0.32) }));
        G.arch = grp(root, { opacity: LOOK.dim.arch });
        G.arch.appendChild(el('path', { d, fill: 'none', stroke: archColor, 'stroke-width': 9, 'stroke-opacity': 0.18, 'stroke-linecap': 'round' }));
        G.arch.appendChild(el('path', { d, fill: 'none', stroke: archColor, 'stroke-width': 2.6, 'stroke-linecap': 'round' }));
        G.num = grp(root, { opacity: LOOK.dim.num });
        G.num.appendChild(el('circle', { cx: f(g.x), cy: f(g.y - 50), r: 12, fill: '#141C38', stroke: archColor, 'stroke-width': 1.4 }));
        txt(G.num, g.x, g.y - 49.5, String(i + 1), 't-small', 'middle', { 'dominant-baseline': 'central' }).style.fill = '#E9ECF6';
        G.label = grp(root, { opacity: LOOK.dim.label });
        txt(G.label, g.x, g.y + 56, GATES[i][0], 't-small');
        txt(G.label, g.x, g.y + 73, GATES[i][1], 't-small');
        G.label.querySelectorAll('text').forEach((t) => { t.style.fill = '#E9ECF6'; });
        G.check = grp(root, { opacity: 0 });
        ctx.badgeSVG('yes', { x: g.x + 25, y: g.y - 36, r: 9 }, G.check);
        G.block = grp(root, { opacity: 0 });
        G.block.appendChild(el('circle', { cx: f(g.x), cy: f(g.y), r: 14, fill: PALETTE.inhibit, stroke: '#0B1024', 'stroke-width': 2 }));
        ctx.iconSVG('block', { x: g.x, y: g.y, size: 17, color: '#FFFFFF', strokeWidth: 2.4 }, G.block);
        if (i < 4) {
          const w = txt(G.block, g.x, g.y + 92, FAIL_WORD[i], 't-small');
          w.style.fill = '#FF8A8F';
          w.style.fontWeight = '650';
        }
      } else {
        // a labeled band per gate
        G.glow = grp(root, { opacity: 0 });
        G.glow.appendChild(el('rect', { x: 14, y: f(g.y - 20), width: 372, height: 40, rx: 12, fill: '#9FB4FF', 'fill-opacity': 0.1 }));
        G.arch = grp(root, { opacity: LOOK.dim.arch });
        G.arch.appendChild(el('rect', { x: 14, y: f(g.y - 20), width: 372, height: 40, rx: 12, fill: 'none', stroke: archColor, 'stroke-width': 1.6 }));
        G.num = grp(root, { opacity: LOOK.dim.num });
        G.num.appendChild(el('circle', { cx: f(g.x), cy: f(g.y), r: 12, fill: '#141C38', stroke: archColor, 'stroke-width': 1.4 }));
        txt(G.num, g.x, g.y + 0.5, String(i + 1), 't-small', 'middle', { 'dominant-baseline': 'central' }).style.fill = '#E9ECF6';
        G.label = grp(root, { opacity: LOOK.dim.label });
        const lt = txt(G.label, 58, g.y + 0.5, GATE_TEXT[i], 't-label', 'start', { 'dominant-baseline': 'central' });
        lt.style.fill = '#E9ECF6';
        G.check = grp(root, { opacity: 0 });
        ctx.badgeSVG('yes', { x: 364, y: g.y, r: 10 }, G.check);
        G.block = grp(root, { opacity: 0 });
        G.block.appendChild(el('circle', { cx: 364, cy: f(g.y), r: 13, fill: PALETTE.inhibit, stroke: '#0B1024', 'stroke-width': 2 }));
        ctx.iconSVG('block', { x: 364, y: g.y, size: 16, color: '#FFFFFF', strokeWidth: 2.4 }, G.block);
        if (i < 4) {
          const w = txt(G.block, 344, g.y + 0.5, FAIL_WORD[i], 't-small', 'end', { 'dominant-baseline': 'central' });
          w.style.fill = '#FF8A8F';
          w.style.fontWeight = '650';
        }
      }
      P.gates.push(G);
    });
    // the endpoint: a killer T cell beside a stretch of cancer-cell membrane carrying cups
    const E = L.end;
    const endG = grp(parent, { 'data-part': 'endpoint', 'clip-path': `url(#${clipId})` });
    let host, cups, ox, oy;
    if (!L.compact) {
      host = cancerCell({ r: E.cancer[2], seed: 11, receptors: false, mhc: 0, pdl1: false, stage: 'dark' });
      [ox, oy] = E.cancer;
      host.setAttribute('transform', `translate(${f(ox)} ${f(oy)})`);
      endG.appendChild(host);
      cups = placeOnMembrane(host, () => mhc1({ size: 21, peptide: 'self', stage: 'dark' }), { count: 5, size: 21, arcStart: E.cupArc[0], arcEnd: E.cupArc[1], seed: 2 });
    } else {
      host = membraneSurface({ width: 250, thickness: 10, depth: 16, color: 'cancer', side: 'up', stage: 'dark' });
      [ox, oy] = E.cancer;
      host.setAttribute('transform', `translate(${f(ox)} ${f(oy)})`);
      endG.appendChild(host);
      cups = [-96, -48, 0, 48, 96].map((x) => {
        const c = mhc1({ size: 21, peptide: 'self', stage: 'dark' });
        c.setAttribute('transform', `translate(${x} 0) rotate(0)`);
        host.appendChild(c);
        return c;
      });
    }
    // the middle cup's place is the display slot for the mutant fragment (empty until step 4:
    // an absent cup, never an empty one)
    const slot = cups[2];
    slot.remove();
    const pink = mhc1({ size: 21, peptide: 'neo', stage: 'dark' });
    pink.setAttribute('transform', slot.getAttribute('transform'));
    pink.setAttribute('opacity', '0');
    cups[1].parentNode.appendChild(pink);
    const m = /translate\(([-\d.]+) ([-\d.]+)\)(?: rotate\(([-\d.]+)\))?/.exec(slot.getAttribute('transform'));
    const sx = ox + Number(m[1]), sy = oy + Number(m[2]), rot = Number(m[3] || 0);
    const head = { x: sx + Math.sin((rot * Math.PI) / 180) * 21 * 0.9, y: sy - Math.cos((rot * Math.PI) / 180) * 21 * 0.9 };
    // the cup's outward axis: the T cell docks along it, TCR tips on the cup rim (head to head, §4 rule 5)
    const axis = (Math.atan2(-Math.cos((rot * Math.PI) / 180), Math.sin((rot * Math.PI) / 180)) * 180) / Math.PI;
    // phones: the strip between gate band 5 and the cups is short, so the T cell docks obliquely
    // from the upper left instead of straight down (it would cover band 5)
    head.axis = L.compact ? axis - 60 : axis;
    const tc = rig(tCell({ variant: 'cd8', r: E.t[2], state: 'activated', polarity: head.axis + 180, seed: 4, stage: 'dark' }), { x: E.t[0], y: E.t[1], parent: endG });
    const lt = txt(endG, E.tLabel[0], E.tLabel[1], 'killer T cell', 't-small');
    lt.style.fill = '#A9B1CC';
    const lc = txt(endG, E.cLabel[0], E.cLabel[1], 'cancer cell', 't-small', 'end');
    lc.style.fill = '#A9B1CC';
    P.end = { group: endG, cell: host, pink, slot: { x: sx, y: sy, rot, head }, tc };
    P.token = tokenNode(parent);
    P.token.setAttribute('transform', TR(L.tok.start[0], L.tok.start[1]));
    P.token.setAttribute('opacity', '0');
    L.tok.end = [head.x, head.y + (L.compact ? 6 : 0)];
    return P;
  }

  function gateLook(tl, G, from, to, pos, duration = 0.5) {
    const a = LOOK[from], b = LOOK[to];
    for (const k of ['arch', 'glow', 'label', 'num', 'check', 'block']) {
      if (a[k] === b[k]) continue;
      tl.fromTo(G[k], { attr: { opacity: a[k] } }, { attr: { opacity: b[k] }, duration, ease: 'power1.inOut', immediateRender: false }, pos);
    }
  }
  function setGate(G, state) {
    const b = LOOK[state];
    for (const k of ['arch', 'glow', 'label', 'num', 'check', 'block']) G[k].setAttribute('opacity', f(b[k]));
  }
  const tokXY = (k) => (k < 0 ? L.tok.start : k < 4 ? L.tok.mids[k] : L.tok.end);   // k = gates passed − 1

  // ---------------------------------------------------------------- workbench pieces
  const WB = () => L.wb;
  function sectionTitle(parent, text) {
    const t = txt(parent, L.title[0], L.title[1], text, 't-caps', 'start');
    t.style.fill = '#A9B1CC';
    return t;
  }

  /** Step 1: the DNA strip (one helix wide, three rows of six codons on phones). */
  function buildDNA(parent) {
    const g = hidden(parent, { 'data-part': 'wb-dna' });
    sectionTitle(g, 'DNA · start of the KRAS gene');
    const rows = L.compact ? [[0, 6], [6, 12], [12, 18]] : [[0, 18]];
    const rise = L.compact ? 19.5 : 15;
    const y0 = L.compact ? 448 : 372;
    const dy = L.compact ? 120 : 0;
    const before = grp(g, {}), after = grp(g, { opacity: 0 });
    let box = null;
    rows.forEach(([c0, c1], r) => {
      const seq = SEQ.slice(c0 * 3, c1 * 3), mut = MUT.slice(c0 * 3, c1 * 3);
      const cy = y0 + r * dy;
      const n = seq.length;
      const x0 = L.wb.cx - ((n - 1) / 2) * rise;
      const hiIdx = 34 - c0 * 3;
      const a = dna({ sequence: seq, rise, width: L.compact ? 34 : 32, letters: true, stage: 'dark', twist: 10.5 });
      a.setAttribute('transform', `translate(${f(L.wb.cx)} ${f(cy)})`);
      before.appendChild(a);
      const b = dna({ sequence: mut, rise, width: L.compact ? 34 : 32, letters: true, stage: 'dark', twist: 10.5, highlight: hiIdx >= 0 && hiIdx < n ? [hiIdx] : [] });
      b.setAttribute('transform', `translate(${f(L.wb.cx)} ${f(cy)})`);
      after.appendChild(b);
      // codon dividers and numbers
      const marks = grp(g, {});
      for (let c = c0; c <= c1; c++) {
        if (c > c0 && c < c1) {
          const x = x0 + ((c - c0) * 3 - 0.5) * rise;
          marks.appendChild(el('path', { d: `M${f(x)} ${f(cy - 38)}V${f(cy + 40)}`, stroke: '#A9B1CC', 'stroke-opacity': 0.28, 'stroke-width': 1, 'stroke-dasharray': '2 3' }));
        }
        if (c < c1) {
          const t = txt(marks, x0 + ((c - c0) * 3 + 1) * rise, cy + (L.compact ? 58 : 62), String(c + 1), 't-small');
          t.style.fill = c === 11 ? PALETTE.foreignPeptide : '#7F89AB';
          if (c === 11) t.style.fontWeight = '700';
        }
      }
      if (hiIdx >= 0 && hiIdx < n) {
        const bx = x0 + (hiIdx - 1.5) * rise;
        box = { x: bx, y: cy - 40, w: rise * 3, h: 82 };
      }
    });
    const boxG = grp(g, {});
    boxG.appendChild(el('rect', { x: f(box.x - 2), y: f(box.y), width: f(box.w + 4), height: f(box.h), rx: 9, fill: PALETTE.foreignPeptide, 'fill-opacity': 0.07, stroke: PALETTE.foreignPeptide, 'stroke-width': 1.6 }));
    const [lx, ly, la] = L.compact ? [388, 398, 'end'] : [box.x + box.w / 2, box.y - 14, 'middle'];
    const lab0 = grp(g, {});
    mixedText(lab0, lx, ly, [['codon 12: GGT', false]], 't-label t-num', la);
    const lab1 = grp(g, { opacity: 0 });
    mixedText(lab1, lx, ly, [['codon 12: GGT → ', false], ['GAT', true]], 't-label t-num', la);
    return { g, before, after, lab0, lab1 };
  }

  /** Steps 2–3: codon line aligned over the amino-acid chain (two rows of nine on phones). */
  function buildProtein(parent) {
    const g = hidden(parent, { 'data-part': 'wb-protein' });
    const rows = L.compact ? [[0, 9], [9, 18]] : [[0, 18]];
    const beadR = L.compact ? 17.5 : 19.5;
    const yRef = L.compact ? 400 : 286, yBead = L.compact ? 446 : 336, dy = L.compact ? 108 : 0;
    const refG = grp(g, {}), normG = grp(g, {}), mutG = grp(g, { opacity: 0 });
    const under = hidden(g, {});
    const cods = codons(MUT);
    rows.forEach(([a, b], r) => {
      const n = b - a;
      const pos = peptidePositions({ length: n, beadR, seed: 7 + r });
      const cx = L.wb.cx, cy = yBead + r * dy;
      const abs = pos.map(([x, y]) => [cx + x, cy + y]);
      for (let i = 0; i < n; i++) {
        const c = a + i;
        const t = txt(refG, abs[i][0], yRef + r * dy, c === 11 ? cods[c] : codons(SEQ)[c], 't-small t-num');
        t.style.fill = c === 11 ? PALETTE.foreignPeptide : '#C9D3F0';
        t.style.letterSpacing = '0.04em';
        if (c === 11) t.style.fontWeight = '700';
      }
      const hiLocal = 11 - a;
      const has12 = hiLocal >= 0 && hiLocal < n;
      const ch = peptideChain({ length: n, beadR, seed: 7 + r, fold: 0, stage: 'dark' });
      ch.setAttribute('transform', `translate(${f(cx)} ${f(cy)})`);
      normG.appendChild(ch);
      beadLetters(normG, AA.slice(a, b), abs, {});
      if (has12) {
        const chm = peptideChain({ length: n, beadR, seed: 7 + r, fold: 0, stage: 'dark', highlight: [hiLocal] });
        chm.setAttribute('transform', `translate(${f(cx)} ${f(cy)})`);
        mutG.appendChild(chm);
        beadLetters(mutG, AAM.slice(a, b), abs, { pinkIndex: hiLocal });
      } else {
        // this row is unchanged: draw it in the mutant layer too so the crossfade is seamless
        const chm = peptideChain({ length: n, beadR, seed: 7 + r, fold: 0, stage: 'dark' });
        chm.setAttribute('transform', `translate(${f(cx)} ${f(cy)})`);
        mutG.appendChild(chm);
        beadLetters(mutG, AAM.slice(a, b), abs, {});
      }
      // underline residues 10–18 (and their codons)
      const i0 = Math.max(9, a) - a, i1 = Math.min(17, b - 1) - a;
      if (i1 >= i0) {
        const xA = abs[i0][0] - beadR, xB = abs[i1][0] + beadR;
        under.appendChild(el('rect', { x: f(xA), y: f(cy + beadR + 9), width: f(xB - xA), height: 4, rx: 2, fill: PALETTE.foreignPeptide, 'fill-opacity': 0.9 }));
        under.appendChild(el('rect', { x: f(xA), y: f(yRef + r * dy + 8), width: f(xB - xA), height: 2.5, rx: 1.2, fill: PALETTE.foreignPeptide, 'fill-opacity': 0.75 }));
      }
    });
    const title2 = hidden(g, {});
    sectionTitle(title2, L.compact ? 'Protein · three bases per amino acid' : 'Protein · the codons, read three bases at a time');
    const title3 = hidden(g, {});
    sectionTitle(title3, 'Made, then degraded');
    // the folded protein: KRAS jammed "on"
    const fold = hidden(g, {});
    const fx = L.compact ? 200 : 392, fy = L.compact ? 668 : 456;
    const fp = peptideChain({ length: 30, beadR: L.compact ? 6.5 : 7, fold: 1, seed: 12, highlight: [11], stage: 'dark' });
    fp.setAttribute('transform', `translate(${f(fx)} ${f(fy)})`);
    fold.appendChild(fp);
    const lx = L.compact ? fx : fx + 66, ly = L.compact ? fy + 72 : fy - 6, la = L.compact ? 'middle' : 'start';
    const ft = txt(fold, lx, ly, 'KRAS — locked ‘on’', 't-label', la);
    ft.style.fill = '#E9ECF6';
    const fs = txt(fold, lx, ly + 20, 'a growth switch that cannot turn off', 't-small', la);
    fs.style.fill = '#A9B1CC';
    return { g, refG, normG, mutG, under, fold, title2, title3 };
  }

  /** Step 3: copies into the proteasome; most fragments fade; one nine-mer survives. */
  function buildCut(parent) {
    const g = hidden(parent, { 'data-part': 'wb-cut' });
    const py = L.compact ? 646 : 452, px = L.compact ? 112 : 300;
    const pr = proteasome({ size: L.compact ? 60 : 72, stage: 'dark' });
    pr.setAttribute('transform', `translate(${f(px)} ${f(py)}) rotate(90)`);
    g.appendChild(pr);
    const lp = txt(g, px, py + (L.compact ? 50 : 58), 'proteasome', 't-small');
    lp.style.fill = '#A9B1CC';
    const copies = [0, 1].map((k) => {
      const c = peptideChain({ length: 18, beadR: 3.4, seed: 30 + k, highlight: [11], stage: 'dark' });
      const w = grp(g, { opacity: 0 });
      w.appendChild(c);
      w.setAttribute('transform', TR(px - (L.compact ? 92 : 170), py + (k ? 16 : -14)));
      return w;
    });
    const R = ctx.random(5);
    const frags = Array.from({ length: L.compact ? 6 : 8 }, (_, k) => {
      const n = R.int(3, 7);
      const c = peptideChain({ length: n, beadR: 3.4, seed: 40 + k, highlight: k % 3 === 0 ? [1] : [], stage: 'dark' });
      const w = grp(g, { opacity: 0 });
      w.appendChild(c);
      const tx = L.compact ? R.range(170, 330) : R.range(390, 560);
      const ty = py + R.range(-58, 58);
      w.setAttribute('transform', TR(px + 30, py));
      return { w, to: [tx, ty] };
    });
    // the survivor: G A D G V G K S A with a ruler
    const sv = hidden(g, {});
    const sR = L.compact ? 11 : 15;
    const sx = L.compact ? 262 : 690, sy = L.compact ? 744 : 444;
    const spos = peptidePositions({ length: 9, beadR: sR, seed: 9 });
    const sc = peptideChain({ length: 9, beadR: sR, seed: 9, highlight: [2], stage: 'dark' });
    const inner = grp(sv, { transform: TR(sx, sy) });
    inner.appendChild(sc);
    beadLetters(inner, FRAG, spos, { pinkIndex: 2 });
    const xA = spos[0][0] - sR, xB = spos[8][0] + sR, ry = sR + 14;
    inner.appendChild(el('path', { d: `M${f(xA)} ${f(ry - 5)}V${f(ry + 5)}M${f(xA)} ${f(ry)}H${f(xB)}M${f(xB)} ${f(ry - 5)}V${f(ry + 5)}`, stroke: '#C9D3F0', 'stroke-width': 1.3, fill: 'none' }));
    const rt = txt(inner, 0, ry + 20, '9 amino acids', 't-small');
    rt.style.fill = '#C9D3F0';
    const start = TR(px + 30 - 0.3 * sx, py - 0.3 * sy, 0.3);
    sv.setAttribute('transform', start);
    return { g, copies, frags, sv, start, from: [px + 30, py] };
  }

  /** Step 4 (and the overlay): six class I molecules; the fragment is tried in each. */
  function cupRow(parent, pockets, title, { labelLast = false } = {}) {
    const g = grp(parent, {});
    sectionTitle(g, title);
    const hint = txt(g, L.title[0], L.title[1] + 22, L.compact ? 'Its two anchor residues must fit the pockets.' : 'The peptide’s two anchor residues must fit a groove’s pockets.', 't-small', 'start');
    hint.style.fill = '#A9B1CC';
    const u = L.compact ? 66 : 88;
    const pos = pockets.map((_, j) => (L.compact
      ? [80 + (j % 3) * 120, 520 + Math.floor(j / 3) * 150]
      : [L.wb.cx + (j - 2.5) * 124, 462]));
    const cups = pockets.map((pk, j) => {
      const empty = mhc1({ size: u, pockets: pk, peptide: 'none', stage: 'dark' });
      empty.setAttribute('transform', `translate(${f(pos[j][0])} ${f(pos[j][1])})`);
      g.appendChild(empty);
      const full = mhc1({ size: u, pockets: pk, anchors: FRAG_ANCHORS, peptide: 'neo', stage: 'dark' });
      full.setAttribute('transform', `translate(${f(pos[j][0])} ${f(pos[j][1])})`);
      full.setAttribute('opacity', '0');
      g.appendChild(full);
      const mark = grp(g, { opacity: 0 });
      ctx.badgeSVG(j === 5 && labelLast ? 'yes' : 'no', { x: pos[j][0] + u * 0.46, y: pos[j][1] - u * 1.02, r: 8.5 }, mark);
      return { empty, full, mark, x: pos[j][0], y: pos[j][1] };
    });
    let allele = null;
    if (labelLast) {
      allele = grp(g, { opacity: 0 });
      const t = txt(allele, pos[5][0], pos[5][1] + (L.compact ? 30 : 40), 'HLA-C*08:02', 't-label');
      t.style.fill = '#E9ECF6';
    }
    const trial = trialFragment(g, u);
    trial.setAttribute('opacity', '0');
    return { g, cups, trial, allele, u };
  }
  /** Tween the fragment over each cup; fits[j] decides whether it clicks in. */
  function tryCups(tl, row, fits, t0) {
    const { cups, trial, u } = row;
    const hoverY = (c) => c.y - u * 1.42, dipY = (c) => c.y - u * 0.78;
    tl.fromTo(trial, { attr: { opacity: 0, transform: TR(cups[0].x - 60, hoverY(cups[0]) - 30) } }, { attr: { opacity: 1, transform: TR(cups[0].x, hoverY(cups[0])) }, duration: 0.6, ease: 'so.out' }, t0);
    let t = t0 + 0.6;
    for (let j = 0; j < cups.length; j++) {
      const c = cups[j];
      if (j > 0) { tl.to(trial, { attr: { transform: TR(c.x, hoverY(c)) }, duration: 0.34, ease: 'so.inOut' }, t); t += 0.34; }
      tl.to(trial, { attr: { transform: TR(c.x, dipY(c)) }, duration: 0.22, ease: 'power2.in' }, t);
      t += 0.22;
      if (fits[j]) {
        tl.to(trial, { attr: { opacity: 0 }, duration: 0.25 }, t);
        tl.fromTo(c.full, { attr: { opacity: 0 } }, { attr: { opacity: 1 }, duration: 0.35 }, t);
        tl.fromTo(c.mark, { attr: { opacity: 0 } }, { attr: { opacity: 1 }, duration: 0.3 }, t + 0.1);
        t += 0.45;
        return t;
      }
      tl.to(trial, { attr: { transform: TR(c.x, hoverY(c)) }, duration: 0.24, ease: 'power2.out' }, t);
      tl.fromTo(c.mark, { attr: { opacity: 0 } }, { attr: { opacity: 1 }, duration: 0.3 }, t);
      t += 0.24;
    }
    // held by none: it slides away and fades
    tl.to(trial, { attr: { opacity: 0, transform: TR(cups[cups.length - 1].x + 70, hoverY(cups[cups.length - 1]) + 40) }, duration: 0.7, ease: 'so.in' }, t);
    return t + 0.7;
  }

  /** Step 5: a healthy cell shows the normal fragment, the cancer cell the mutant one. */
  function buildSurface(parent) {
    const g = hidden(parent, { 'data-part': 'wb-surface' });
    sectionTitle(g, 'At the cell surface');
    const hc = L.compact ? [100, 590, 52] : [290, 432, 56];
    const kc = L.compact ? [298, 590, 56] : [670, 432, 60];
    const h = healthyCell({ r: hc[2], seed: 5, receptors: false, mhc: 0, stage: 'dark' });
    h.setAttribute('transform', `translate(${f(hc[0])} ${f(hc[1])})`);
    g.appendChild(h);
    const hCups = placeOnMembrane(h, (o) => mhc1({ ...o, peptide: 'self' }), { count: 3, size: 26, arcStart: -128, arcEnd: -52 });
    const k = cancerCell({ r: kc[2], seed: 6, receptors: false, mhc: 0, pdl1: false, stage: 'dark' });
    k.setAttribute('transform', `translate(${f(kc[0])} ${f(kc[1])})`);
    g.appendChild(k);
    const kCups = placeOnMembrane(k, (o, i) => mhc1({ ...o, peptide: i === 1 ? 'neo' : 'self' }), { count: 3, size: 26, arcStart: -128, arcEnd: -52 });
    const lab = (x, y, text, anchor) => { const t = txt(g, x, y, text, 't-small', anchor); t.style.fill = '#A9B1CC'; };
    if (L.compact) {
      lab(hc[0], hc[1] + hc[2] + 22, 'healthy cell', 'middle');
      lab(kc[0], kc[1] + kc[2] + 22, 'cancer cell', 'middle');
      mixedText(g, hc[0], hc[1] + hc[2] + 46, [['GAGGVGKSA', false]], 't-label t-num').style.letterSpacing = '0.06em';
      mixedText(g, kc[0], kc[1] + kc[2] + 46, [['GA', false], ['D', true], ['GVGKSA', false]], 't-label t-num').style.letterSpacing = '0.06em';
    } else {
      lab(hc[0] - hc[2] - 18, hc[1] + 4, 'healthy cell', 'end');
      lab(kc[0] + kc[2] + 18, kc[1] + 4, 'cancer cell', 'start');
      mixedText(g, hc[0], hc[1] + hc[2] + 30, [['GAGGVGKSA', false]], 't-label t-num').style.letterSpacing = '0.06em';
      mixedText(g, kc[0], kc[1] + kc[2] + 30, [['GA', false], ['D', true], ['GVGKSA', false]], 't-label t-num').style.letterSpacing = '0.06em';
    }
    const t0 = L.compact ? [16, 470] : [90, 322];
    const tc = rig(tCell({ variant: 'cd8', r: L.compact ? 22 : 27, state: 'activated', polarity: 0, seed: 3, stage: 'dark' }), { x: t0[0], y: t0[1], parent: g, opacity: 0 });
    const headOf = (cell, xy, cup) => {
      const m = /translate\(([-\d.]+) ([-\d.]+)\) rotate\(([-\d.]+)\)/.exec(cup.getAttribute('transform'));
      const rot = (Number(m[3]) * Math.PI) / 180;
      return { x: xy[0] + Number(m[1]) + Math.sin(rot) * 26 * 0.9, y: xy[1] + Number(m[2]) - Math.cos(rot) * 26 * 0.9 };
    };
    return { g, tc, hHead: headOf(h, hc, hCups[1]), kHead: headOf(k, kc, kCups[1]), kCup: kCups[1] };
  }

  /** Step 6: the case card. */
  function buildCase(parent) {
    const g = hidden(parent, { 'data-part': 'wb-case' });
    const box = L.compact ? [10, 342, 380, 468] : [60, 238, 840, 294];
    g.appendChild(el('rect', { x: box[0], y: box[1], width: box[2], height: box[3], rx: 16, fill: '#121A36', 'fill-opacity': 0.94, stroke: 'rgb(140 160 255 / 0.22)', 'stroke-width': 1.2 }));
    const tt = txt(g, box[0] + 22, box[1] + 28, 'What happened next · one patient, 2016', 't-caps', 'start');
    tt.style.fill = '#A9B1CC';
    const lungXY = L.compact ? [116, box[1] + 150] : [210, 392];
    const lungs = organIcon('lungs', { size: L.compact ? 150 : 190, stage: 'dark' });
    lungs.setAttribute('transform', `translate(${f(lungXY[0])} ${f(lungXY[1])})`);
    g.appendChild(lungs);
    // seven metastases spread through both lobes (positions relative to the icon's box)
    const bb = lungs.getBBox();
    const REL = [[0.2, 0.42], [0.3, 0.6], [0.19, 0.76], [0.29, 0.86], [0.76, 0.44], [0.8, 0.64], [0.7, 0.8]];
    const DOTS = REL.map(([rx, ry]) => [bb.x + rx * bb.width, bb.y + ry * bb.height]);
    const s = 1;
    const dots = DOTS.map(([dx, dy]) => {
      const d = grp(g, { transform: TR(lungXY[0] + dx, lungXY[1] + dy, 1) });
      d.appendChild(el('circle', { r: 13, fill: dotGlow(PALETTE.cancer, 0.55) }));
      d.appendChild(el('circle', { r: 6.5, fill: PALETTE.cancer, stroke: mix(PALETTE.cancer, '#FFFFFF', 0.45), 'stroke-width': 1.2 }));
      return d;
    });
    const regrow = dots[5];
    const ring = el('circle', { cx: f(lungXY[0] + DOTS[5][0] * s), cy: f(lungXY[1] + DOTS[5][1] * s), r: 15, fill: 'none', stroke: '#FF8A8F', 'stroke-width': 1.6, opacity: 0 });
    g.appendChild(ring);
    const lines = L.compact
      ? [[box[0] + 216, box[1] + 76, 'T cells infused:'], [box[0] + 216, box[1] + 96, 'all seven shrank'], [box[0] + 216, box[1] + 136, 'Months later:'], [box[0] + 216, box[1] + 156, 'one grew back']]
      : [[360, 300, 'T cells infused: all seven shrank'], [360, 330, 'Months later: one grew back']];
    const step1 = hidden(g, {}), step2 = hidden(g, {});
    lines.forEach(([x, y, t], i) => {
      const n = txt(L.compact ? (i < 2 ? step1 : step2) : (i < 1 ? step1 : step2), x, y, t, 't-label', 'start');
      n.style.fill = '#E9ECF6';
    });
    // callout: that tumor's cells, missing the one groove that showed the typo
    const cellXY = L.compact ? [200, box[1] + 330] : [640, 432];
    const callout = hidden(g, {});
    const from = [lungXY[0] + DOTS[5][0] * s + 14, lungXY[1] + DOTS[5][1] * s];
    callout.appendChild(el('path', { d: `M${f(from[0])} ${f(from[1])}C${f(from[0] + 60)} ${f(from[1])} ${f(cellXY[0] - 110)} ${f(cellXY[1] - 10)} ${f(cellXY[0] - (L.compact ? 52 : 62))} ${f(cellXY[1])}`, fill: 'none', stroke: '#A9B1CC', 'stroke-width': 1, 'stroke-dasharray': '3 4' }));
    const kc = cancerCell({ r: L.compact ? 44 : 52, seed: 14, receptors: false, mhc: 0, pdl1: false, stage: 'dark' });
    kc.setAttribute('transform', `translate(${f(cellXY[0])} ${f(cellXY[1])})`);
    callout.appendChild(kc);
    const cps = placeOnMembrane(kc, (o) => mhc1({ ...o, peptide: 'self' }), { count: 6, size: 20, arcStart: -150, arcEnd: -30, seed: 3 });
    const gone = cps[3];
    const m = /translate\(([-\d.]+) ([-\d.]+)\)/.exec(gone.getAttribute('transform'));
    gone.remove();                                   // a lost window is an ABSENT cup (rule 3)
    const gx = cellXY[0] + Number(m[1]), gy = cellXY[1] + Number(m[2]);
    ctx.badgeSVG('no', { x: gx + 2, y: gy - 16, r: 8 }, callout);
    const al = txt(callout, gx + 16, gy - 34, 'HLA-C*08:02 lost', 't-small', 'start');
    al.style.fill = '#FF8A8F';
    al.style.fontWeight = '650';
    const capY = cellXY[1] + (L.compact ? 66 : 80);
    if (L.compact) {
      txt(callout, cellXY[0], capY, 'this tumor lost the chromosome', 't-small').style.fill = '#C9D3F0';
      txt(callout, cellXY[0], capY + 18, 'carrying HLA-C*08:02', 't-small').style.fill = '#C9D3F0';
    } else {
      txt(callout, cellXY[0], capY, 'this tumor lost the chromosome carrying HLA-C*08:02', 't-small').style.fill = '#C9D3F0';
    }
    return { g, dots, regrow, ring, step1, step2, callout, linkAt: L.compact ? [box[0] + box[2] - 20, box[1] + box[3] - 22] : [box[0] + box[2] - 24, box[1] + 28] };
  }

  // ---------------------------------------------------------------- reset: draw the scene
  function reset() {
    killOverlay();
    for (const c of [...svg.children]) if (c !== svg.defs) c.remove();
    svg.setAttribute('viewBox', `0 0 ${L.vb[0]} ${L.vb[1]}`);
    clipRect.setAttribute('width', String(L.vb[0]));
    clipRect.setAttribute('height', String(L.divider + 40));
    // wrappers the overlay may dim; the master timeline never touches them
    const pipeAW = grp(svg, { 'data-part': 'pipe-a', opacity: 1 });
    const pipeBW = grp(svg, { 'data-part': 'pipe-b', opacity: 1 });
    const div = el('path', { d: L.compact ? `M16 ${L.divider}H384` : `M30 ${L.divider}H930`, stroke: '#A9B1CC', 'stroke-opacity': 0.16, 'stroke-width': 1 });
    svg.appendChild(div);
    const wbAW = grp(svg, { 'data-part': 'wb-a', opacity: 1 });
    const wbBW = grp(svg, { 'data-part': 'wb-b', opacity: 1 });
    const flyW = grp(svg, { 'data-part': 'fly' });
    const P = buildPipeline(pipeAW);
    const dnaS = buildDNA(wbAW);
    const prot = buildProtein(wbAW);
    const cut = buildCut(wbAW);
    const cupsA = cupRow(hidden(wbAW, { 'data-part': 'wb-cups' }), CUPS_A, 'Patient A’s six display molecules', { labelLast: true });
    const surf = buildSurface(wbAW);
    const kase = buildCase(wbAW);
    // the loaded cup that travels up to the cancer-cell membrane
    const fly = mhc1({ size: cupsA.u, pockets: CUPS_A[5], anchors: FRAG_ANCHORS, peptide: 'neo', stage: 'dark' });
    const flyG = grp(flyW, { opacity: 0, transform: TR(cupsA.cups[5].x, cupsA.cups[5].y, 1, 0) });
    flyG.appendChild(fly);
    S = { P, pipeAW, pipeBW, wbAW, wbBW, dnaS, prot, cut, cupsA, surf, kase, flyG };
    gsap.set(link, { autoAlpha: 0 });
    placeLink();
  }

  function placeLink() {
    const [x, y] = S.kase.linkAt;
    link.style.right = `${f(((L.vb[0] - x) / L.vb[0]) * 100)}%`;
    link.style.left = 'auto';
    link.style.top = `${f(((y - 9) / L.vb[1]) * 100)}%`;
  }

  // ---------------------------------------------------------------- Part A steps (master timeline)
  function gatesStep(tl, k, pos) {
    S.P.gates.forEach((G, i) => gateLook(tl, G, PLAN[k][i], PLAN[k + 1][i], pos));
  }
  function moveToken(tl, from, to, pos, duration = 1.1) {
    tl.fromTo(S.P.token, { attr: { transform: TR(...from) } }, { attr: { transform: TR(...to) }, duration, ease: 'so.inOut', immediateRender: false }, pos);
  }

  const steps = [
    { // 1 · DNA
      enter(tl) {
        const D = S.dnaS;
        show(tl, D.g, 0, 0.6);
        tl.fromTo(S.P.token, { attr: { opacity: 0 } }, { attr: { opacity: 1 }, duration: 0.6 }, 0.2);
        gatesStep(tl, 0, 0.3);
        // the middle letter of codon 12 changes: G → A
        tl.fromTo(D.before, { attr: { opacity: 1 } }, { attr: { opacity: 0 }, duration: 0.7 }, 1.4)
          .fromTo(D.after, { attr: { opacity: 0 } }, { attr: { opacity: 1 }, duration: 0.7 }, 1.4)
          .fromTo(D.lab0, { attr: { opacity: 1 } }, { attr: { opacity: 0 }, duration: 0.5 }, 1.6)
          .fromTo(D.lab1, { attr: { opacity: 0 } }, { attr: { opacity: 1 }, duration: 0.6 }, 1.7);
      },
    },
    { // 2 · protein
      enter(tl) {
        const D = S.dnaS, Pr = S.prot;
        hide(tl, D.g, 0, 0.5);
        show(tl, Pr.g, 0.4, 0.6);
        show(tl, Pr.title2, 0.4, 0.5);
        // residue 12: G → D
        tl.fromTo(Pr.normG, { attr: { opacity: 1 } }, { attr: { opacity: 0 }, duration: 0.7 }, 1.5)
          .fromTo(Pr.mutG, { attr: { opacity: 0 } }, { attr: { opacity: 1 }, duration: 0.7 }, 1.5);
        show(tl, Pr.fold, 2.2, 0.7);
        moveToken(tl, tokXY(-1), tokXY(0), 1.6);
        gatesStep(tl, 1, 2.0);
      },
    },
    { // 3 · made and cut
      enter(tl) {
        const Pr = S.prot, Cu = S.cut;
        hide(tl, Pr.fold, 0, 0.4);
        hide(tl, Pr.title2, 0, 0.3);
        show(tl, Pr.title3, 0.2, 0.4);
        show(tl, Pr.under, 0.3, 0.5);
        show(tl, Cu.g, 0.5, 0.4);
        gatesStep(tl, 2, 0.4);
        moveToken(tl, tokXY(0), tokXY(1), 0.6);
        const px = Cu.from[0] - 30, py = Cu.from[1];
        Cu.copies.forEach((c, k) => {
          const y0 = py + (k ? 16 : -14);
          tl.fromTo(c, { attr: { opacity: 0, transform: TR(px - (L.compact ? 92 : 170), y0) } }, { attr: { opacity: 1, transform: TR(px - (L.compact ? 66 : 120), y0) }, duration: 0.5 }, 0.9 + k * 0.35)
            .to(c, { attr: { opacity: 0, transform: TR(px, py, 0.6) }, duration: 0.8, ease: 'so.in' }, 1.4 + k * 0.35);
        });
        Cu.frags.forEach((fr, k) => {
          const t = 2.0 + k * 0.12;
          tl.fromTo(fr.w, { attr: { opacity: 0, transform: TR(Cu.from[0], Cu.from[1]) } }, { attr: { opacity: 1, transform: TR(...fr.to) }, duration: 0.9, ease: 'so.out' }, t)
            .to(fr.w, { attr: { opacity: 0 }, duration: 0.9, ease: 'power1.in' }, t + 1.0);   // most are destroyed
        });
        // one nine-amino-acid fragment survives
        tl.fromTo(Cu.sv, { attr: { opacity: 0, transform: Cu.start } }, { attr: { opacity: 1, transform: TR(0, 0, 1) }, duration: 1.2, ease: 'so.out' }, 2.5);
      },
    },
    { // 4 · display (Patient A)
      enter(tl) {
        const Pr = S.prot, Cu = S.cut, row = S.cupsA;
        hide(tl, Pr.g, 0, 0.5);
        hide(tl, Cu.g, 0, 0.5);
        show(tl, row.g.parentNode, 0.4, 0.5);
        const t = tryCups(tl, row, CUPS_A.map((pk) => pk[0] === 'square' && pk[1] === 'square'), 0.9);
        tl.fromTo(row.allele, { attr: { opacity: 0 } }, { attr: { opacity: 1 }, duration: 0.5 }, t);
        gatesStep(tl, 3, t);
        moveToken(tl, tokXY(1), tokXY(2), t);
        // the loaded cup travels to the cancer-cell membrane
        const c6 = row.cups[5];
        const sl = S.P.end.slot;
        const sc = 21 / row.u;
        tl.fromTo(S.flyG, { attr: { opacity: 0, transform: TR(c6.x, c6.y, 1, 0) } }, { attr: { opacity: 1, transform: TR(c6.x, c6.y, 1, 0) }, duration: 0.25 }, t + 0.35)
          .to(S.flyG, { attr: { transform: TR(sl.x, sl.y, sc, sl.rot) }, duration: 1.35, ease: 'so.inOut' }, t + 0.55)
          .to(S.flyG, { attr: { opacity: 0 }, duration: 0.25 }, t + 1.85)
          .fromTo(S.P.end.pink, { attr: { opacity: 0 } }, { attr: { opacity: 1 }, duration: 0.3 }, t + 1.8);
      },
    },
    { // 5 · looks new, and a matching T cell
      enter(tl) {
        const row = S.cupsA, Su = S.surf, E = S.P.end;
        hide(tl, row.g.parentNode, 0, 0.5);
        show(tl, Su.g, 0.4, 0.6);
        // the T cell drifts past the healthy cell (no badge) and stops at the cancer cell
        const tc = Su.tc;
        const hx = Su.hHead, kx = Su.kHead, r = tc.r;
        move(tl, tc, { x: hx.x, y: hx.y - r - 10, opacity: 1, duration: 1.6, pos: 0.9 });
        move(tl, tc, { x: kx.x - r * 0.5, y: kx.y - r - 12, duration: 1.7, pos: 3.0 });
        recognize(tl, tc, Su.kCup, { pos: 4.6, duration: 1.8, badgeOffset: { x: r * 1.15, y: -r * 0.6 } });
        // the pipeline: gates 4 and 5 pass; the token reaches the display
        gatesStep(tl, 4, 4.4);
        moveToken(tl, tokXY(2), tokXY(4), 3.2, 1.6);
        tl.to(S.P.token, { attr: { opacity: 0 }, duration: 0.4 }, 4.8);
        move(tl, E.tc, { ...dockAt(E), duration: 1.2, pos: 3.4 });
        recognize(tl, E.tc, E.pink, { pos: 4.7, duration: 1.8, badgeSize: 12 });
      },
    },
    { // 6 · what happened next
      enter(tl) {
        const Su = S.surf, K = S.kase;
        hide(tl, Su.g, 0, 0.5);
        show(tl, K.g, 0.3, 0.6);
        K.dots.forEach((d, i) => {
          const tr0 = d.getAttribute('transform');
          const m = /translate\(([-\d.]+) ([-\d.]+)\)/.exec(tr0);
          const x = Number(m[1]), y = Number(m[2]);
          tl.fromTo(d, { attr: { transform: TR(x, y, 1) } }, { attr: { transform: TR(x, y, 0.42) }, duration: 1.4, ease: 'so.inOut' }, 1.6 + i * 0.06);
          if (d === K.regrow) tl.to(d, { attr: { transform: TR(x, y, 1.15) }, duration: 1.3, ease: 'so.inOut' }, 4.1);
        });
        show(tl, K.step1, 1.1, 0.5);
        show(tl, K.step2, 3.7, 0.5);
        tl.fromTo(K.ring, { attr: { opacity: 0 } }, { attr: { opacity: 1 }, duration: 0.5 }, 4.8);
        show(tl, K.callout, 5.2, 0.8);
        tl.fromTo(link, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 5.8);
      },
    },
  ];

  // ---------------------------------------------------------------- the overlay: Patient B and Part B
  function killOverlay() {
    if (overlayTl) { overlayTl.kill(); overlayTl = null; }
    overlayOn = null;
    if (S.pipeBW) {
      S.pipeBW.replaceChildren();
      S.wbBW.replaceChildren();
      S.pipeAW.setAttribute('opacity', '1');
      S.wbAW.setAttribute('opacity', '1');
    }
  }
  const overlayTracker = { pause() { if (overlayTl && overlayTl.progress() < 1) overlayTl.progress(1); }, resume() {}, stop() { overlayTl?.kill(); } };
  ctx.track(overlayTracker);

  /**
   * Run a typo down a fresh copy of the pipeline. startGate: gates before it are already passed;
   * failAt: the gate (0-based) it stops at, or null (passes all five); vignette(tl, t0) draws the
   * workbench story and returns the time the token should meet its gate.
   */
  function runOverlay(kind, { startGate = 0, failAt = null, vignette }) {
    killOverlay();
    overlayOn = kind;
    const tl = gsap.timeline({ paused: true });
    const P = buildPipeline(S.pipeBW);
    P.gates.forEach((G, i) => setGate(G, i < startGate ? 'passed' : i === startGate ? 'current' : 'dim'));
    const wb = grp(S.wbBW, {});
    tl.fromTo(S.pipeAW, { attr: { opacity: 1 } }, { attr: { opacity: 0 }, duration: 0.25 }, 0)
      .fromTo(S.wbAW, { attr: { opacity: 1 } }, { attr: { opacity: 0 }, duration: 0.25 }, 0)
      .fromTo(S.pipeBW, { attr: { opacity: 0 } }, { attr: { opacity: 1 }, duration: 0.35 }, 0.1)
      .fromTo(wb, { attr: { opacity: 0 } }, { attr: { opacity: 1 }, duration: 0.35 }, 0.15);
    const meet = vignette(tl, wb, P, 0.4);
    // the token runs gate by gate, reaching its last gate at `meet`
    const last = failAt ?? 5;
    const hops = Math.max(1, last - startGate + (failAt == null ? 0 : 1));
    const t0 = Math.max(0.4, meet - hops * 0.55);
    P.token.setAttribute('opacity', '1');
    tl.fromTo(P.token, { attr: { opacity: 0 } }, { attr: { opacity: 1 }, duration: 0.3 }, 0.2);
    let from = tokXY(startGate - 1), t = t0;
    for (let i = startGate; i < last; i++) {
      const to = tokXY(i);
      tl.fromTo(P.token, { attr: { transform: TR(...from) } }, { attr: { transform: TR(...to) }, duration: 0.5, ease: 'so.inOut', immediateRender: i === startGate }, t);
      gateLook(tl, P.gates[i], 'current', 'passed', t + 0.25, 0.35);
      if (i + 1 < 5) gateLook(tl, P.gates[i + 1], 'dim', 'current', t + 0.3, 0.35);
      from = to; t += 0.55;
    }
    if (failAt != null) {
      const g = L.gates[failAt];
      const stop = L.compact ? [g.x, g.y - 22] : [g.x - 22, g.y];
      tl.fromTo(P.token, { attr: { transform: TR(...from) } }, { attr: { transform: TR(...stop) }, duration: 0.45, ease: 'so.inOut', immediateRender: startGate === failAt }, t)
        .to(P.token, { attr: { transform: TR(...stop, 0.7), opacity: 0.55 }, duration: 0.4 }, t + 0.5);
      gateLook(tl, P.gates[failAt], 'current', 'failed', t + 0.4, 0.4);
    } else {
      tl.to(P.token, { attr: { opacity: 0 }, duration: 0.4 }, t + 0.1);
      tl.fromTo(P.end.pink, { attr: { opacity: 0 } }, { attr: { opacity: 1 }, duration: 0.35 }, t);
      move(tl, P.end.tc, { ...dockAt(P.end), duration: 1.1, pos: t + 0.1 });
      recognize(tl, P.end.tc, P.end.pink, { pos: t + 1.2, duration: 1.8, badgeSize: 12 });
    }
    overlayTl = tl;
    if (ctx.reducedMotion || !ctx.visible) { tl.progress(1); } else tl.play();
  }

  // Vignettes (workbench stories for the overlay)
  const V = {
    patientB(tl, wb, P, t0) {
      const row = cupRow(wb, CUPS_B, 'Patient B’s six display molecules');
      return tryCups(tl, row, CUPS_B.map(() => false), t0 + 0.2) - 0.4;
    },
    nohold(tl, wb, P, t0) {
      const row = cupRow(wb, CUPS_B, 'This person’s six display molecules');
      return tryCups(tl, row, CUPS_B.map(() => false), t0 + 0.2) - 0.4;
    },
    silent(tl, wb, P, t0) {
      sectionTitle(wb, L.compact ? 'Silent · codon 13: GGC → GGT' : 'A silent typo · codon 13: GGC → GGT');
      // codons 10–15 over their amino acids; codon 13's last letter changes, glycine stays glycine
      const cods = codons(SEQ).slice(9, 15), aa = AA.slice(9, 15);
      const beadR = L.compact ? 20 : 24;
      const pos = peptidePositions({ length: 6, beadR, seed: 21 });
      const cx = L.wb.cx, cy = L.compact ? 520 : 420, ry = cy - (L.compact ? 64 : 70);
      const ch = peptideChain({ length: 6, beadR, seed: 21, stage: 'dark' });
      ch.setAttribute('transform', `translate(${f(cx)} ${f(cy)})`);
      wb.appendChild(ch);
      beadLetters(wb, aa, pos.map(([x, y]) => [cx + x, cy + y]), { size: 'label' });
      const before = grp(wb, {}), after = grp(wb, { opacity: 0 });
      cods.forEach((c, i) => {
        const x = cx + pos[i][0];
        const a = txt(before, x, ry, c, 't-label t-num');
        a.style.fill = '#C9D3F0';
        if (i === 3) mixedText(after, x, ry, [['GG', false], ['T', true]]);
        else { const b = txt(after, x, ry, c, 't-label t-num'); b.style.fill = '#C9D3F0'; }
      });
      tl.fromTo(before.children[3], { attr: { opacity: 1 } }, { attr: { opacity: 0 }, duration: 0.5 }, t0 + 0.7)
        .fromTo(after, { attr: { opacity: 0 } }, { attr: { opacity: 1 }, duration: 0.5 }, t0 + 0.7);
      for (let i = 0; i < 6; i++) if (i !== 3) tl.to(before.children[i], { attr: { opacity: 0 }, duration: 0.01 }, t0 + 1.2);
      const note = hidden(wb, {});
      const n = txt(note, cx + pos[3][0], cy + beadR + 30, 'still G (glycine): same protein', 't-label');
      n.style.fill = '#E9ECF6';
      show(tl, note, t0 + 1.4, 0.5);
      return t0 + 1.6;
    },
    off(tl, wb, P, t0) {
      sectionTitle(wb, 'A gene this cell never uses');
      const cx = L.wb.cx, cy = L.compact ? 520 : 400;
      const d = dna({ sequence: 'ATGGCCTCTGAGCAGGTACTGAAGCTC', rise: L.compact ? 12 : 15, width: 30, letters: false, stage: 'dark' });
      const dg = grp(wb, { opacity: 1, transform: `translate(${f(cx)} ${f(cy)})` });
      dg.appendChild(d);
      tl.to(dg, { attr: { opacity: 0.28 }, duration: 0.8 }, t0 + 0.5);
      const lock = hidden(wb, {});
      lock.appendChild(el('circle', { cx: f(cx), cy: f(cy), r: 26, fill: '#141C38', stroke: '#A9B1CC', 'stroke-width': 1.4 }));
      ctx.iconSVG('padlock', { x: cx, y: cy, size: 26, color: '#E9ECF6', strokeWidth: 1.8 }, lock);
      const a = txt(lock, cx, cy + 62, 'not expressed: no mRNA, no protein', 't-label');
      a.style.fill = '#E9ECF6';
      show(tl, lock, t0 + 0.9, 0.5);
      return t0 + 1.2;
    },
    hidden(tl, wb, P, t0) {
      sectionTitle(wb, 'Hidden in the groove');
      const W = L.compact ? 300 : 330;
      const spots = L.compact ? [[200, 470], [200, 640]] : [[260, 420], [700, 420]];
      const mk = (x, y, mutant, name) => {
        const g = grp(wb, { transform: `translate(${f(x)} ${f(y)})` });
        const gr = mhcGroove({ view: 'side', width: W, pockets: ['round', 'round'], ridge: 'A', peptide: { kind: 'self', anchors: ['circle', 'circle'], pattern: 'y' }, stage: 'dark' });
        g.appendChild(gr);
        if (mutant) {
          // the changed amino acid is bead 9: an anchor, pointing down into its pocket
          const b9 = gr.querySelector('[data-part="bead"][data-index="8"] path');
          if (b9) { b9.setAttribute('fill', PALETTE.foreignPeptide); b9.setAttribute('stroke', mix(PALETTE.foreignPeptide, '#FFFFFF', 0.6)); }
        }
        const t = txt(g, 0, W * 0.24 + 26, name, 't-label');
        t.style.fill = '#E9ECF6';
        return g;
      };
      const a = mk(...spots[0], false, 'normal peptide');
      const b = mk(...spots[1], true, 'mutant peptide');
      b.setAttribute('opacity', '0');
      tl.fromTo(b, { attr: { opacity: 0 } }, { attr: { opacity: 1 }, duration: 0.6 }, t0 + 0.3);
      // what a T cell touches is identical: the same up-facing beads
      const eq = hidden(wb, {});
      const ex = L.compact ? 200 : 480, ey = L.compact ? 400 : 360;
      const e = txt(eq, ex, ey, 'seen from above: identical', 't-label');
      e.style.fill = '#E9ECF6';
      show(tl, eq, t0 + 1.0, 0.5);
      return t0 + 1.4;
    },
    frameshift(tl, wb, P, t0) {
      sectionTitle(wb, L.compact ? 'A frameshift' : 'A frameshift · every amino acid after it is new');
      const n = L.compact ? 20 : 26, beadR = L.compact ? 6.5 : 8;
      const hi = Array.from({ length: n - 6 }, (_, i) => i + 6);
      const cx = L.wb.cx, cy = L.compact ? 430 : 316;
      const ch = peptideChain({ length: n, beadR, seed: 51, fold: 0.15, highlight: hi, stage: 'dark' });
      const cg = grp(wb, { opacity: 0, transform: `translate(${f(cx)} ${f(cy)})` });
      cg.appendChild(ch);
      tl.fromTo(cg, { attr: { opacity: 0 } }, { attr: { opacity: 1 }, duration: 0.6 }, t0 + 0.2);
      const pos = peptidePositions({ length: n, beadR, seed: 51, fold: 0.15 });
      const mx = cx + (pos[5][0] + pos[6][0]) / 2;
      const mark = hidden(wb, {});
      mark.appendChild(el('path', { d: `M${f(mx)} ${f(cy - 22)}V${f(cy + 22)}`, stroke: '#E9ECF6', 'stroke-width': 1.4, 'stroke-dasharray': '3 3' }));
      const ml = txt(mark, mx, cy - 30, 'a base goes missing', 't-small');
      ml.style.fill = '#C9D3F0';
      show(tl, mark, t0 + 0.6, 0.4);
      // several new fragments fit grooves
      const u = L.compact ? 58 : 66;
      const xs = L.compact ? [90, 200, 310] : [340, 480, 620];
      const cy2 = L.compact ? 600 : 480;
      const fitPk = [['square', 'square'], ['wide', 'square'], ['square', 'wide']];
      fitPk.forEach((pk, j) => {
        const c = mhc1({ size: u, pockets: pk, anchors: FRAG_ANCHORS, peptide: 'neo', stage: 'dark' });
        const w = grp(wb, { opacity: 0, transform: `translate(${f(xs[j])} ${f(cy2)})` });
        w.appendChild(c);
        tl.fromTo(w, { attr: { opacity: 0 } }, { attr: { opacity: 1 }, duration: 0.4 }, t0 + 1.0 + j * 0.25);
      });
      const lab = hidden(wb, {});
      const lt = txt(lab, cx, cy2 + (L.compact ? 34 : 40), 'several new peptides bind grooves', 't-label');
      lt.style.fill = '#E9ECF6';
      show(tl, lab, t0 + 1.8, 0.4);
      return t0 + 2.4;
    },
  };

  // ---------------------------------------------------------------- controls
  const ctl = ctx.h('div', { class: 'tt-ctl' });
  const patient = ctx.ui.segmented({
    label: 'Patient', value: 'A', parent: ctl,
    options: [{ value: 'A', label: 'Patient A' }, { value: 'B', label: 'Patient B' }],
    onChange: (v) => {
      card.hide(); chips.set(null);
      if (v === 'B') {
        runOverlay('patientB', { startGate: 2, failAt: 2, vignette: V.patientB });
        ctx.announce('Patient B: none of the six grooves binds the peptide. Not displayed.');
      } else {
        fadeBack();
        ctx.announce('Patient A: HLA-C*08:02 binds the peptide.');
      }
    },
  });
  const skip = ctx.ui.button({ label: 'Skip to the other typos', icon: 'arrowRight', variant: 'ghost', parent: ctl, onClick: () => { revealB(); partB.querySelector('button.chip')?.focus(); } });

  function fadeBack() {
    // leave the overlay: crossfade back to the step's own drawing, then clear the copies
    if (!overlayOn) return;
    const tl = gsap.timeline({ onComplete: () => killOverlay() });
    if (overlayTl) overlayTl.kill();
    overlayTl = tl;
    tl.to(S.pipeBW, { attr: { opacity: 0 }, duration: 0.3 }, 0)
      .to(S.wbBW, { attr: { opacity: 0 }, duration: 0.3 }, 0)
      .to(S.pipeAW, { attr: { opacity: 1 }, duration: 0.35 }, 0.15)
      .to(S.wbAW, { attr: { opacity: 1 }, duration: 0.35 }, 0.15);
    if (ctx.reducedMotion || !ctx.visible) tl.progress(1);
  }

  // Part B: the other typos + the scoreboard
  const partB = ctx.h('div', { class: 'tt-partb', hidden: true });
  partB.append(
    ctx.h('p', { class: 'tt-partb__head' }, 'The other typos'),
    ctx.h('p', { class: 'tt-partb__hint' }, 'Send one down the same five gates and watch where it stops.'),
  );
  const chips = ctx.ui.chips({
    label: 'Choose a typo', hideLabel: true, variant: 'card', parent: partB,
    options: CARDS.map((c) => ({ value: c.value, label: c.label })),
    onChange: (v) => {
      patient.set('A');
      if (!v) { card.hide(); fadeBack(); return; }
      const c = CARDS.find((x) => x.value === v);
      const verdict = c.fail == null ? { kind: 'yes', label: 'Passes all five gates' } : { kind: 'no', label: `Stops at gate ${c.fail + 1}` };
      card.show({ kicker: c.label, title: c.fail == null ? 'Recognized' : GATE_TEXT[c.fail], badge: verdict, body: `<p>${c.text}</p>` });
      runOverlay(v, { startGate: 0, failAt: c.fail, vignette: V[v] });
      ctx.announce(`${c.label}: ${verdict.label}.`);
    },
  });
  const card = ctx.ui.infoCard({ placement: 'below', empty: null, closable: false });

  // the scoreboard (real data: a light, page-colored panel with its source line)
  const score = ctx.h('div', { class: 'tt-score' });
  partB.append(score);
  let grid = null;
  let scoreSvg = null;
  function buildScore() {
    score.replaceChildren();
    const compact = L.compact;
    const cols = compact ? 20 : 50, size = compact ? 13 : 11, gap = compact ? 4 : 3;
    const pitch = size + gap;
    const W = cols * pitch + 20, gy = 34, rows = 100 / cols;
    const H = gy + rows * pitch + (compact ? 52 : 40);
    scoreSvg = ctx.createSVG({ viewBox: `0 0 ${W} ${H}`, parent: score, interactive: true, label: 'Scoreboard: of 100 protein-changing mutations in a tumor, about 2 are recognized by the patient’s own T cells.' });
    const root = chartRoot(scoreSvg, { theme: 'light' });
    const t = ctx.svg('text', { class: 't-label', x: 0, y: 16 }, root);
    t.textContent = '100 protein-changing mutations in a tumor';
    t.style.fill = 'var(--ink)';
    const SEEN = [37, 88];
    grid = unitGrid(root, {
      count: 100, cols, size, gap, shape: 'bead', x: 0, y: gy,
      group: (i) => (SEEN.includes(i) ? 'seen' : 'rest'),
      color: { seen: 'var(--c-neo-peptide)', rest: C.muted }, state: 'hidden',
      label: 'One hundred protein-changing mutations; two are recognized by the patient’s own T cells.',
    });
    // the two recognized ones glow softly (halos behind the beads)
    const halos = ctx.svg('g', {}, root);
    root.insertBefore(halos, grid.el);
    SEEN.forEach((i) => {
      const un = grid.units[i];
      ctx.svg('circle', { cx: f(un.x), cy: f(gy + un.y), r: f(size * 1.05), style: 'fill: var(--c-neo-peptide); fill-opacity: 0.22' }, halos);
    });
    halos.setAttribute('opacity', '0');
    const u = grid.units[SEEN[1]];
    const ax = u.x, ay = gy + u.y + size / 2 + 2;
    const lab = ctx.svg('g', {}, root);
    ctx.svg('path', { class: 'leader', d: `M${f(ax)} ${f(ay + 2)}V${f(ay + 16)}` }, lab);
    const lt = ctx.svg('text', { class: 't-small', x: f(Math.min(ax, W - 10)), y: f(ay + 30), 'text-anchor': compact ? 'end' : 'middle' }, lab);
    lt.textContent = 'about 2 are recognized by the patient’s own T cells';
    lt.style.fill = C.stroke('neo-peptide');
    lt.style.fontWeight = '650';
    lab.halos = halos;
    lab.setAttribute('opacity', '0');
    score.append(ctx.h('p', { class: 'tt-score__src' }, SOURCE));
    return lab;
  }
  let scoreLab = null;
  let revealed = false;
  function revealB() {
    if (revealed) return;
    revealed = true;
    partB.hidden = false;
    skip.el.hidden = true;
    scoreLab = buildScore();
    const anim = ctx.reducedMotion ? { duration: 0 } : { duration: 0.35, stagger: 0.008 };
    grid.setStates({ rest: 'filled', seen: 'filled' }, anim);
    if (ctx.reducedMotion) { scoreLab.setAttribute('opacity', '1'); scoreLab.halos.setAttribute('opacity', '1'); }
    else gsap.to([scoreLab, scoreLab.halos], { attr: { opacity: 1 }, duration: 0.5, delay: 1.1 });
  }

  // ---------------------------------------------------------------- stepper
  const stepper = ctx.ui.stepper({
    reset,
    steps,
    dwell: (i) => [8, 8, 9, 9, 9, 9][i],
    onChange(i) {
      stepIdx = i;
      killOverlay();
      patient.set('A');
      chips.set(null);
      card.hide();
      patient.el.hidden = i !== 3;
    },
    onComplete() { revealB(); },
  });
  ctx.controls.append(ctl);
  ctx.controls.append(partB);
  patient.el.hidden = true;

  ctx.onResize(({ width }) => {
    const compact = width < 700;
    if (compact === L.compact) return;
    L = makeLayout(compact);
    ctx.setAspect(compact ? PORTRAIT : 16 / 9, PORTRAIT);
    stepper.rebuild();
    if (revealed) { const lab = buildScore(); grid.setStates({ rest: 'filled', seen: 'filled' }, { duration: 0 }); lab.setAttribute('opacity', '1'); lab.halos.setAttribute('opacity', '1'); }
  });

  return {
    destroy() { killOverlay(); },
  };
}
