// ch03-vdj — "Shuffle the deck" (Figure 3.1)
//
// A slot machine for antibody heavy chains. Every young B cell starts with the
// same inherited DNA ribbon (≈40 V, 23 D, 6 J segments + the constant part). One
// build = the six writer's steps, driven by ctx.ui.stepper so Back / dot jumps /
// reduced motion always land in the designed state:
//   1 the ribbon            2 RAG picks D + J, the loop between them is cut out
//   3 seam lens (D–J)       4 the same for V, seam lens (V–D)
//   5 reading-frame check (an out-of-frame first copy → the other parent's copy
//     is tried quickly; two failures → the cell dies)
//   6 receptors appear on the B cell; a thumbnail drops into the library.
// Each new build ("Build another", "Same pieces, new seams") rebuilds the
// stepper timeline from that build's data and sweeps it in ≈3 s while the stepper
// stays on its last step (no narration, tally increments). "Build 100"
// skips the animation. The library (shared unitGrid) and the counter appear after
// the first finished cell; "Build 100" after three builds.
//
// The science (FIGURE-AUDIT §2H, §4; spec in content/drafts/03-adaptive.md):
//   • D joins J first, then V joins DJ; RAG cuts, repair joins; the loop is lost.
//   • Letters change only at the seams: 0–4 trimmed per end, 0–6 random added.
//   • In frame ⇔ the net length change of both seams is a multiple of 3.
//   • "Different receptors" compares whole builds (heavy V, D, J + both seams'
//     letters + the hidden light chain); duplicates are possible, never forced.
//   • The failure share is a property of this simplified model ("Illustrative").
//
// Clone identity (§4 rule 13) is the notched receptor tip. The library's tcrKey
// has 46 seeded notches and no composite seed, so this module draws a LOCAL
// composite tip in the same geometry (keyBadge): the outer notches follow the V
// segment, the centre notch follows the seam letters (as CDR1/2 vs CDR3 do).
import { bCell, bcr, mix, placeOnMembrane, dyingState } from '../art/index.js';
import { unitGrid } from './shared/unit-grid.js';

const FIG = 'ch03-vdj';
const NV = 40;
const ND = 23;
const NJ = 6;
const BASES = 'ACGT';
const AMBER = '#F2B33D';
const NAVY = '#0B1024';
const WHITE = '#FFFFFF';
const HUE = { V: '#45C1B3', D: '#F2A07A', J: '#B3A0F0', C: '#8D93AB' };
const GRAY_FILL = '#5D6480';
const GRAY_STROKE = '#8A91AD';
const CRIMSON = '#FF6B73';
const SILVER = '#D9DEEA';

// ------------------------------------------------------------------ layouts
const LAYOUTS = {
  wide: {
    compact: false, W: 960, H: 560,
    head: [40, 38],
    rows: [124], x0: 44, xMax: 930, tileH: 30, rib: 5,
    pitch: { V: 11.5, D: 8.5, J: 13, C: 52, brk: 16 },
    tileW: { V: 8.5, D: 6, J: 9.5, C: 46 },
    seamGap: 4,
    chosenDy: 35, groupDy: 58,
    loopScale: 1,
    lens: { r: 98, y: 268, centered: false, pitch: 23, br: 10 },
    strip: { cx: 520, y: 250, h: 26, wV: 150, wD: 52, wJ: 76, wN: 7, tick: 8.5, titleLeft: true },
    note: { x: 520, y: 334 },
    hint: { x: 520, y: 300 },
    copyDy: 70,
    cell: { x: 100, y: 430, r: 48 },
    close: { x: 278, y: 528, size: 112, lab: 66 },
    counter: { x: 470, y: 378, dy: 20, link: 419 },
    lib: { x: 470, y: 436, w: 460, h: 114 },
    sizes: [34, 28, 22, 17],
  },
  compact: {
    compact: true, W: 400, H: 830,
    head: [22, 34],
    rows: [104, 162, 220], x0: 25, xMax: 376, tileH: 26, rib: 4.5,
    pitch: { V: 17.5, D: 8.6, J: 13, C: 38, brk: 12 },
    tileW: { V: 13, D: 6, J: 9.5, C: 33 },
    seamGap: 4,
    chosenDy: 31, groupDy: 29,
    loopScale: 0.8,
    lens: { r: 150, y: 318, centered: true, pitch: 26, br: 11.5 },
    strip: { cx: 200, y: 298, h: 26, wV: 112, wD: 44, wJ: 60, wN: 6, tick: 7.5, titleLeft: false },
    note: { x: 200, y: 372 },
    hint: { x: 200, y: 300 },
    copyDy: 70,
    cell: { x: 90, y: 458, r: 42 },
    close: { x: 262, y: 536, size: 98, lab: 54 },
    counter: { x: 22, y: 592, dy: 21, link: 660 },
    lib: { x: 22, y: 678, w: 356, h: 124 },
    sizes: [32, 26],
  },
};

// ------------------------------------------------------------------ small utils
const f2 = (v) => Math.round(v * 100) / 100;
const T = (x, y, r = 0, s = 1) => `translate(${f2(x)} ${f2(y)}) rotate(${f2(r)}) scale(${f2(s)})`;
const TB = (x, y, s = 1) => `translate(${f2(x)} ${f2(y)}) scale(${f2(s)})`;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function mulberry(seed) {
  let a = seed >>> 0;
  const r = () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  r.int = (lo, hi) => Math.floor(lo + (hi - lo + 1) * r());
  return r;
}
const letters = (r, n) => Array.from({ length: n }, () => BASES[Math.floor(r() * 4)]).join('');

// Germline letters at the segment ends (deterministic): what the seam lens shows.
const SEQ = {
  Vend: (v) => letters(mulberry(hashStr(`Vend${v}`)), 12),
  D: (d) => letters(mulberry(hashStr(`Dseg${d}`)), 15 + (d % 6)),
  Jstart: (j) => letters(mulberry(hashStr(`Jst${j}`)), 12),
};

// ------------------------------------------------------------------ composite receptor tip
// Same proportions as the art library's tcrKey({ form: 'tip' }) badge; the socket is
// composed of two outer notches (from the V segment) and one centre notch (from the seams).
const OUTER = [
  null,
  { s: 'rect', h: 1, w: 0.075 },
  { s: 'rect', h: 0.5, w: 0.095 },
  { s: 'round', h: 1, w: 0.095 },
  { s: 'vee', h: 1, w: 0.1 },
  { s: 'ledge', h: 0.62 },
  { s: 'round', h: 0.5, w: 0.1 },
];
const OUTER_PAIRS = (() => {
  const list = [];
  for (let a = 0; a < OUTER.length; a++) for (let b = 0; b < OUTER.length; b++) if (a || b) list.push([a, b]);
  return list.map((p, i) => ({ p, k: hashStr(`op${i}`) })).sort((x, y) => x.k - y.k).slice(0, NV).map((x) => x.p);
})();
const CENTER = (() => {
  const list = [];
  for (const s of ['rect', 'round', 'vee']) for (const h of [1, 0.58]) for (const w of [0.065, 0.11]) for (const c of [-0.04, 0, 0.04]) list.push({ s, h, w, c });
  return list;
})();
const DMAX = 0.36;
function notchD(x, { s, h, w, c }) {
  const t = (x - c) / w;
  const a = Math.abs(t);
  if (a >= 1) return 0;
  if (s === 'rect') return h * (a < 0.72 ? 1 : (1 - a) / 0.28);
  if (s === 'round') return h * Math.sqrt(1 - t * t);
  return h * (1 - a);
}
function outerD(x, o, side) {
  if (o.s === 'ledge') {
    const s = side * x;
    return s > 0.3 ? o.h : s > 0.24 ? (o.h * (s - 0.24)) / 0.06 : 0;
  }
  return notchD(x, { ...o, c: side * 0.31 });
}
function socketDepth(x, glyph) {
  const [lo, ro] = OUTER_PAIRS[glyph.outer % OUTER_PAIRS.length];
  let d = notchD(x, CENTER[glyph.center % CENTER.length]);
  if (OUTER[lo]) d = Math.max(d, outerD(x, OUTER[lo], -1));
  if (OUTER[ro]) d = Math.max(d, outerD(x, OUTER[ro], 1));
  return d * DMAX;
}
/** Notched tip badge (centred, notch facing −y). */
function keyBadge(S, glyph, size, { bright = false } = {}) {
  const u = size;
  const W = 0.5 * u, rc = 0.12 * u, yt = -0.32 * u, yb = 0.32 * u;
  const N = 60;
  const pts = [];
  for (let i = 0; i <= N; i++) { const x = -0.42 + (0.84 * i) / N; pts.push([x * u, yt + socketDepth(x, glyph) * u]); }
  let d = `M${f2(-W)} ${f2(yt + rc)}Q${f2(-W)} ${f2(yt)} ${f2(-W + rc)} ${f2(yt)}L${f2(pts[0][0])} ${f2(yt)}`;
  for (const [x, y] of pts) d += `L${f2(x)} ${f2(y)}`;
  d += `L${f2(W - rc)} ${f2(yt)}Q${f2(W)} ${f2(yt)} ${f2(W)} ${f2(yt + rc)}L${f2(W)} ${f2(yb - rc * 1.6)}Q${f2(W)} ${f2(yb)} ${f2(W - rc * 1.6)} ${f2(yb)}`;
  d += `L${f2(-W + rc * 1.6)} ${f2(yb)}Q${f2(-W)} ${f2(yb)} ${f2(-W)} ${f2(yb - rc * 1.6)}Z`;
  const low = u < 13;
  return S('path', {
    class: 'vdj-key', d,
    fill: low || bright ? mix(AMBER, WHITE, 0.3) : mix(AMBER, NAVY, 0.25),
    stroke: low ? 'none' : mix(AMBER, WHITE, bright ? 0.7 : 0.45),
    'stroke-width': f2(Math.max(0.5, Math.min(2, u * 0.045))), 'stroke-linejoin': 'round',
  });
}

// ------------------------------------------------------------------ the model
function makeAttempt(r, pieces) {
  const v = pieces ? pieces.v : r.int(1, NV);
  const d = pieces ? pieces.d : r.int(1, ND);
  const j = pieces ? pieces.j : r.int(1, NJ);
  const seam = () => ({ tL: r.int(0, 4), tR: r.int(0, 4), add: letters(r, r.int(0, 6)) });
  const vd = seam();
  const dj = seam();
  const net = (vd.add.length - vd.tL - vd.tR) + (dj.add.length - dj.tL - dj.tR);
  const inFrame = ((net % 3) + 3) % 3 === 0;
  const D = SEQ.D(d);
  const junction = SEQ.Vend(v).slice(0, 12 - vd.tL) + vd.add + D.slice(vd.tR, D.length - dj.tL) + dj.add + SEQ.Jstart(j).slice(dj.tR);
  return { v, d, j, vd, dj, net, inFrame, junction };
}
function makeLight(r, pieces) {
  const fam = pieces ? pieces.fam : (r() < 175 / 325 ? 'K' : 'L');
  const v = pieces ? pieces.v : r.int(1, fam === 'K' ? 35 : 30);
  const j = pieces ? pieces.j : r.int(1, 5);
  return { fam, v, j, seam: `${r.int(0, 3)}.${r.int(0, 3)}.${letters(r, r.int(0, 3))}` };
}
/** A whole B cell: one or two heavy-chain attempts (one per parental copy) + a light chain. */
function makeBuild(n, seed, { same = null } = {}) {
  const r = mulberry(seed);
  const pieces = same ? { v: same.final.v, d: same.final.d, j: same.final.j } : null;
  const a1 = makeAttempt(r, pieces);
  const attempts = [a1];
  if (!a1.inFrame) attempts.push(makeAttempt(r, pieces));
  const final = attempts[attempts.length - 1];
  const ok = final.inFrame;
  const light = makeLight(r, same ? same.light : null);
  const key = `${final.v}|${final.d}|${final.j}|${final.junction}|${light.fam}${light.v}.${light.j}.${light.seam}`;
  let center = hashStr(final.junction + light.seam) % CENTER.length;
  // Display mapping only: with the same pieces, the centre notch must visibly change.
  if (same && ok && same.ok && same.glyph && center === same.glyph.center) center = (center + 1) % CENTER.length;
  return { n, seed, attempts, final, ok, light, key, same: !!same, glyph: ok ? { outer: final.v - 1, center } : null };
}
/** The guided first cell: its first copy goes out of frame, the other parent's copy works. */
function firstBuild() {
  for (let s = 1; s < 5000; s++) {
    const b = makeBuild(0, 9000 + s);
    const [a, c] = b.attempts;
    if (!c || !c.inFrame) continue;
    if (a.dj.tL + a.dj.tR < 2 || a.dj.add.length < 3 || a.vd.add.length < 2 || a.vd.tL + a.vd.tR < 1) continue;
    if (c.dj.add.length < 2 || c.vd.add.length < 2 || c.dj.tL + c.dj.tR < 1 || c.vd.tL + c.vd.tR < 1) continue;
    if (a.d > 17 || a.j > 4 || a.v > 30 || a.v < 8 || c.v < 6 || c.v > 34) continue;
    return b;
  }
  return makeBuild(0, 9001);
}

// ------------------------------------------------------------------ ribbon geometry
const LIST = (() => {
  const list = [];
  const add = (type, i) => list.push({ key: type === 'C' ? 'C' : `${type}${i}`, type, i });
  for (let i = 1; i <= NV; i++) add('V', i);
  add('brk', 1);
  for (let i = 1; i <= ND; i++) add('D', i);
  add('brk', 2);
  for (let i = 1; i <= NJ; i++) add('J', i);
  add('brk', 3);
  add('C');
  return list;
})();
const INDEX = Object.fromEntries(LIST.map((e, i) => [e.key, i]));
const BYKEY = Object.fromEntries(LIST.map((e) => [e.key, e]));
const pitchOf = (L, key) => L.pitch[BYKEY[key].type];

function layout0(L) {
  const pos = {};
  let row = 0;
  let x = L.x0;
  for (const e of LIST) {
    const r = L.compact ? (e.type === 'V' ? (e.i <= 20 ? 0 : 1) : 2) : 0;
    if (r !== row) { row = r; x = L.x0; }
    const p = L.pitch[e.type];
    pos[e.key] = { x: x + p / 2, y: L.rows[r], row: r };
    x += p;
  }
  return pos;
}
function flowAfter(L, before, kept, movers, anchor) {
  const pos = {};
  for (const k of kept) pos[k] = before[k];
  const a = before[anchor];
  let row = a.row;
  let x = a.x + pitchOf(L, anchor) / 2 + L.seamGap;
  // the joined block wraps as a whole (it never strands the constant part on its own)
  const block = movers.reduce((w, k) => w + pitchOf(L, k), 0);
  if (L.compact && x + block > L.xMax + 0.5 && row < L.rows.length - 1) { row += 1; x = L.x0; }
  for (const k of movers) {
    const p = pitchOf(L, k);
    if (x + p > L.xMax + 0.5) { row = Math.min(row + 1, L.rows.length - 1); x = L.x0; }
    pos[k] = { x: x + p / 2, y: L.rows[row], row };
    x += p;
  }
  return pos;
}
/** The two cuts of one attempt: D–J first, then V–DJ. */
function geometry(L, A) {
  const pos0 = layout0(L);
  const cut = (before, leftKey, rightKey) => {
    const present = LIST.map((e) => e.key).filter((k) => before[k]);
    const iL = present.indexOf(leftKey);
    const iR = present.indexOf(rightKey);
    const kept = present.slice(0, iL + 1);
    const loop = present.slice(iL + 1, iR);
    const movers = present.slice(iR);
    const after = flowAfter(L, before, kept, movers, leftKey);
    const neck = { x: before[leftKey].x + pitchOf(L, leftKey) / 2 + L.seamGap / 2, y: before[leftKey].y };
    const R = clamp(8 + loop.length * 0.4, 12, 30) * L.loopScale;
    const cx = clamp(neck.x, L.x0 + R, L.W - R - 6);
    const cy = neck.y - L.tileH / 2 - 10 - R;
    const ring = loop.map((k, i) => {
      const th = Math.PI / 2 + ((i + 0.5) / loop.length) * Math.PI * 2;
      return { x: cx + R * Math.cos(th), y: cy + R * Math.sin(th), r: (th * 180) / Math.PI + 90 };
    });
    const seam = { x: after[rightKey].x - pitchOf(L, rightKey) / 2 - L.seamGap / 2, y: after[rightKey].y };
    return { leftKey, rightKey, kept, loop, movers, before, after, neck, R, cx, cy, ring, seam };
  };
  const dj = cut(pos0, `D${A.d}`, `J${A.j}`);
  const vd = cut(dj.after, `V${A.v}`, `D${A.d}`);
  return { pos0, dj, vd };
}

// ------------------------------------------------------------------ CSS
const CSS = `
[data-figure="${FIG}"] .vdj-actions { display: flex; flex-wrap: wrap; gap: var(--s-2); width: 100%; align-items: center; }
[data-figure="${FIG}"] .vdj-actions [hidden] { display: none !important; }
[data-figure="${FIG}"] .vdj-actions .vdj-reset { margin-left: auto; }
@container fig (max-width: 599.98px) {
  [data-figure="${FIG}"] .vdj-actions .btn:not(.vdj-reset) { flex: 1 1 100%; justify-content: center; }
  [data-figure="${FIG}"] .vdj-actions .vdj-reset { margin-left: 0; }
}
[data-figure="${FIG}"] .vdj-link {
  position: absolute; z-index: 5; transform: translateY(-78%);
  font: 560 max(13px, 0.8rem)/1.2 var(--font-ui); color: var(--fg); white-space: nowrap;
  text-decoration: underline; text-decoration-color: var(--fg-3); text-underline-offset: 3px;
  padding: 6px 2px; border-radius: 4px;
}
[data-figure="${FIG}"] .vdj-link:hover { text-decoration-color: var(--fg); }
[data-figure="${FIG}"] .vdj-link:focus-visible { outline: 2px solid var(--stage-focus); outline-offset: 2px; }
[data-figure="${FIG}"] svg .vdj-letter { font-size: max(12px, calc(11px * var(--u, 1))); font-weight: 700; fill: ${NAVY}; text-anchor: middle; }
[data-figure="${FIG}"] svg .vdj-rag { font-size: max(10px, calc(9.5px * var(--u, 1))); font-weight: 750; letter-spacing: 0.06em; fill: ${NAVY}; text-anchor: middle; }
[data-figure="${FIG}"] svg .vdj-blk { font-size: max(12px, calc(11px * var(--u, 1))); font-weight: 650; fill: ${NAVY}; text-anchor: middle; }
[data-figure="${FIG}"] svg .vdj-rib { fill: none; stroke: ${SILVER}; stroke-opacity: 0.5; stroke-width: 1.3; }
[data-figure="${FIG}"] svg .vdj-brk { fill: none; stroke: ${SILVER}; stroke-opacity: 0.75; stroke-width: 1.4; stroke-linecap: round; }
[data-figure="${FIG}"] svg .vdj-strong { font-weight: 650; fill: var(--fg); }
`;
function injectCSS() {
  if (document.getElementById(`${FIG}-css`)) return;
  const s = document.createElement('style');
  s.id = `${FIG}-css`;
  s.textContent = CSS;
  document.head.append(s);
}

// ================================================================== mount
export default function mount(fig, ctx) {
  injectCSS();
  const { gsap } = ctx;
  const S = (tag, attrs, parent) => ctx.svg(tag, attrs, parent);

  ctx.setAspect(LAYOUTS.wide.W / LAYOUTS.wide.H, LAYOUTS.compact.W / LAYOUTS.compact.H);
  const svg = ctx.createSVG({ viewBox: `0 0 ${LAYOUTS.wide.W} ${LAYOUTS.wide.H}` });
  const tag = ctx.tag('Illustrative');
  gsap.set(tag.el, { autoAlpha: 0 });

  // "How big is the library? ↓" — an HTML link over the stage (focusable, real anchor).
  const target = document.querySelector('[data-figure="ch03-numbers"]');
  const link = ctx.h('a', { class: 'vdj-link', href: target?.id ? `#${target.id}` : '#', text: 'How big is the library? ↓' });
  ctx.stage.append(link);
  ctx.on(link, 'click', (e) => {
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: ctx.reducedMotion ? 'auto' : 'smooth', block: 'start' });
  });
  gsap.set(link, { autoAlpha: 0 });

  // Paints, created once.
  const paint = {
    glint: ctx.linearGradient(svg, [[0, WHITE, 0], [0.5, WHITE, 0.55], [1, WHITE, 0]], { id: `${FIG}-glint` }),
    tipGlow: ctx.radialGradient(svg, [[0, AMBER, 0.55], [1, AMBER, 0]], { id: `${FIG}-tipglow` }),
  };

  // ---------------------------------------------------------------- state
  let L = ctx.compact ? LAYOUTS.compact : LAYOUTS.wide;
  let seedBase = (Math.floor(Math.random() * 1e9) >>> 0) || 1;
  let builds = [];
  let current = null;
  let stageB = false;
  let el = {};
  let defsMine = [];
  const ambients = [];
  let uidN = 0;
  const uid = (p) => `${FIG}-${p}-${++uidN}`;

  const newSeed = () => (seedBase = (Math.imul(seedBase, 1103515245) + 12345) >>> 0);
  const guided = () => current && current.n === 0;
  const speed = () => (guided() ? 1 : 0.4);
  const tallies = (list) => {
    const ok = list.filter((b) => b.ok);
    return { built: list.length, diff: new Set(ok.map((b) => b.key)).size, failed: list.length - ok.length };
  };

  // ---------------------------------------------------------------- drawing: one attempt
  function drawAttempt(A, ai, B, layers) {
    const G = geometry(L, A);
    A.G = G;
    const hidden = ai === 1 || B.n > 0;
    const root = S('g', { transform: ai === 1 ? `translate(0 ${L.copyDy})` : B.n > 0 ? `translate(${-L.W} 0)` : 'translate(0 0)' }, layers.rib);
    if (hidden) gsap.set(root, { opacity: 0 });

    // heading (travels with its ribbon)
    const [hx, hy] = L.head;
    const head = S('text', { class: 't-label', x: hx, y: hy }, root);
    if (ai === 1) {
      head.textContent = 'Copy from the other parent';
      if (!L.compact) S('tspan', { class: 't-small', dx: 8, text: '(same inherited segments)' }, head);
    } else if (B.n > 0) {
      head.textContent = 'Next young B cell';
      if (L.compact) S('text', { class: 't-small', x: hx, y: hy + 19, text: 'same inherited DNA' }, root);
      else S('tspan', { class: 't-small', dx: 8, text: 'same inherited DNA' }, head);
    } else {
      head.textContent = 'Inherited DNA';
      if (L.compact) S('text', { class: 't-small', x: hx, y: hy + 19, text: '(the same in every young B cell)' }, root);
      else S('tspan', { class: 't-small', dx: 8, text: '(the same in every young B cell)' }, head);
    }

    // group labels
    const groupLabels = {};
    const span = (type) => {
      const ks = LIST.filter((e) => e.type === type).map((e) => G.pos0[e.key]);
      const row = L.compact && type === 'V' ? ks.filter((p) => p.row === 1) : ks;
      const x0 = Math.min(...row.map((p) => p.x)) - L.pitch[type] / 2;
      const x1 = Math.max(...row.map((p) => p.x)) + L.pitch[type] / 2;
      return { x0, x1, y: row[0].y };
    };
    const glab = { V: 'V ≈40', D: 'D 23', J: 'J 6', C: L.compact ? 'C' : 'constant part' };
    if (ai === 0) {
      for (const type of ['V', 'D', 'J', 'C']) {
        const sp = span(type);
        const anchorEnd = type === 'C' && L.compact;
        groupLabels[type] = S('text', {
          class: `t-small ${anchorEnd ? 't-end' : 't-mid'}`,
          x: anchorEnd ? sp.x1 : (sp.x0 + sp.x1) / 2, y: sp.y + L.groupDy,
          text: glab[type],
        }, root);
      }
    }

    // ribbon elements
    const els = {};
    const tileFill = (e) => {
      const base = HUE[e.type];
      if (e.type === 'C') return mix(base, NAVY, 0.25);
      const band = e.type === 'V' ? e.i % 3 : e.i % 2;
      const shades = [mix(base, NAVY, 0.3), mix(base, NAVY, 0.12), mix(base, NAVY, 0.45)];
      return shades[band];
    };
    const chosen = new Set([`V${A.v}`, `D${A.d}`, `J${A.j}`]);
    for (const e of LIST) {
      const p = G.pos0[e.key];
      const pitch = L.pitch[e.type];
      const g = S('g', { transform: T(p.x, p.y) }, root);
      const rec = { g, e };
      if (e.type === 'brk') {
        S('path', { class: 'vdj-rib', d: `M${f2(-pitch / 2)} ${-L.rib}H${f2(pitch / 2)}M${f2(-pitch / 2)} ${L.rib}H${f2(pitch / 2)}`, 'stroke-dasharray': '1.5 3' }, g);
        S('path', { class: 'vdj-brk', d: `M-4.5 7L-0.5 -7M0.5 7L4.5 -7` }, g);
      } else {
        S('path', { class: 'vdj-rib', d: `M${f2(-pitch / 2)} ${-L.rib}H${f2(pitch / 2)}M${f2(-pitch / 2)} ${L.rib}H${f2(pitch / 2)}` }, g);
        const w = L.tileW[e.type];
        rec.tile = S('rect', { x: f2(-w / 2), y: f2(-L.tileH / 2), width: w, height: L.tileH, rx: Math.min(2.2, w / 3), fill: tileFill(e) }, g);
        if (e.type === 'C') S('text', { class: 'vdj-blk', x: 0, y: 0, dy: '0.36em', text: 'C', style: 'fill:#E9ECF6' }, g);
      }
      if (chosen.has(e.key)) {
        const hue = HUE[e.type];
        rec.bright = mix(hue, WHITE, 0.42);
        const anchor = e.type === 'D' ? 't-end' : e.type === 'J' ? '' : 't-mid';
        const lx = e.type === 'D' ? 2.5 : e.type === 'J' ? -2.5 : 0;
        rec.label = S('text', { class: `t-label ${anchor}`, x: lx, y: L.chosenDy, text: e.key, style: `fill:${mix(hue, WHITE, 0.45)}`, opacity: 0 }, g);
        if (e.type === 'D') {
          const dx = G.vd.after[e.key].x;
          rec.combo = S('text', { class: 't-label t-mid', x: f2(clamp(dx, 70, L.W - 70) - dx), y: L.chosenDy, opacity: 0 }, g);
          [[`V${A.v}`, HUE.V], [' · ', null], [`D${A.d}`, HUE.D], [' · ', null], [`J${A.j}`, HUE.J]].forEach(([txt, hue2]) => {
            S('tspan', { text: txt, style: hue2 ? `fill:${mix(hue2, WHITE, 0.45)}` : 'fill:var(--fg-3)' }, rec.combo);
          });
        }
        // RAG: a pale enzyme pill that settles on the tile, with two clamp arms (one per cut it takes part in)
        const makeRag = () => {
          const rag = S('g', { opacity: 0, transform: 'translate(0 -16)' }, g);
          const top = -L.tileH / 2;
          S('path', { d: `M-9 ${top - 9}Q-12 ${top} -${f2(L.tileW[e.type] / 2 + 2.5)} ${top + 9}M9 ${top - 9}Q12 ${top} ${f2(L.tileW[e.type] / 2 + 2.5)} ${top + 9}`, fill: 'none', stroke: '#E4E8F5', 'stroke-width': 2, 'stroke-linecap': 'round', opacity: 0.9 }, rag);
          S('rect', { x: -16, y: top - 23, width: 32, height: 15, rx: 7.5, fill: '#E4E8F5' }, rag);
          S('text', { class: 'vdj-rag', x: 0, y: top - 15.5 + 0.5, dy: '0.36em', text: 'RAG' }, rag);
          return rag;
        };
        rec.rag = makeRag();
        if (e.type === 'D') rec.ragV = makeRag();
        // seam marker (left side of the right partner of each join)
        if (e.type === 'J' || e.type === 'D') {
          const sx = -pitch / 2 - L.seamGap / 2;
          rec.seam = S('g', { opacity: 0 }, g);
          S('rect', { x: f2(sx - 3.2), y: f2(-L.tileH / 2 - 3), width: 6.4, height: L.tileH + 6, rx: 3.2, fill: WHITE, 'fill-opacity': 0.14 }, rec.seam);
          S('rect', { x: f2(sx - 1.5), y: f2(-L.tileH / 2 + 1), width: 3, height: L.tileH - 2, rx: 1.2, fill: WHITE }, rec.seam);
        }
      }
      els[e.key] = rec;
    }

    // per-cut overlays: snip line, repair stitch, the excised circle
    const cuts = {};
    for (const which of ['dj', 'vd']) {
      const c = G[which];
      const o = {};
      const top = c.neck.y - L.tileH / 2;
      o.snip = S('path', { d: `M${f2(c.neck.x)} ${f2(top - 8)}V${f2(c.neck.y + L.tileH / 2 + 6)}`, fill: 'none', stroke: WHITE, 'stroke-width': 1.6, 'stroke-dasharray': '3 3', opacity: 0 }, root);
      const sx = c.seam.x, sy = c.seam.y;
      o.stitch = S('path', { d: `M${f2(sx - 4)} ${f2(sy - 9)}L${f2(sx + 4)} ${f2(sy - 3)}M${f2(sx - 4)} ${f2(sy - 2)}L${f2(sx + 4)} ${f2(sy + 4)}M${f2(sx - 4)} ${f2(sy + 5)}L${f2(sx + 4)} ${f2(sy + 11)}`, fill: 'none', stroke: '#BFF5DC', 'stroke-width': 1.6, 'stroke-linecap': 'round', opacity: 0 }, root);
      o.ringG = S('g', { transform: 'translate(0 0)' }, root);
      o.ring = S('g', { opacity: 0 }, o.ringG);
      S('circle', { cx: f2(c.cx), cy: f2(c.cy), r: f2(c.R), fill: 'none', stroke: SILVER, 'stroke-width': 1.3, 'stroke-opacity': 0.8 }, o.ring);
      S('circle', { cx: f2(c.cx), cy: f2(c.cy), r: f2(c.R - 3.5), fill: 'none', stroke: SILVER, 'stroke-width': 1, 'stroke-opacity': 0.55 }, o.ring);
      const right = c.cx + c.R + 150 < L.W;
      o.ringLabel = S('text', { class: `t-small ${right ? '' : 't-end'}`, x: f2(right ? c.cx + c.R + 8 : c.cx - c.R - 8), y: f2(c.cy + 4), text: 'cut out and lost', opacity: 0 }, o.ringG);
      cuts[which] = o;
    }

    // shimmer glint (step 1)
    const xs = Object.values(G.pos0).map((p) => p.x);
    const glint = S('rect', { x: -40, y: -L.tileH / 2 - 6, width: 80, height: L.tileH + 12, fill: paint.glint, opacity: 0, transform: `translate(${f2(Math.min(...xs) - 60)} ${L.rows[0]})` }, root);
    const glints = [glint];
    if (L.compact) {
      for (const r of [1, 2]) glints.push(S('rect', { x: -40, y: -L.tileH / 2 - 6, width: 80, height: L.tileH + 12, fill: paint.glint, opacity: 0, transform: `translate(${f2(L.x0 - 60)} ${L.rows[r]})` }, root));
    }

    const lens = { dj: drawLens(A, 'dj', layers.lens), vd: drawLens(A, 'vd', layers.lens) };
    const strip = drawStrip(A, layers.strip);
    return { A, G, root, els, cuts, glints, groupLabels, lens, strip };
  }

  // ---------------------------------------------------------------- seam lens
  function drawLens(A, which, parent) {
    const c = A.G[which];
    const LZ = L.lens;
    const cx = LZ.centered ? L.W / 2 : clamp(c.seam.x, LZ.r + 16, L.W - LZ.r - 16);
    const cy = LZ.y;
    const g = S('g', { transform: `translate(${f2(cx)} ${f2(cy)})`, opacity: 0 }, parent);
    // cone from the seam to the lens (desktop only)
    if (!LZ.centered) {
      const px = c.seam.x - cx, py = c.seam.y + L.tileH / 2 + 2 - cy;
      const dist = Math.hypot(px, py);
      if (dist > LZ.r + 4) {
        const a = Math.acos(LZ.r / dist);
        const b = Math.atan2(py, px);
        const t1 = [LZ.r * Math.cos(b - a), LZ.r * Math.sin(b - a)];
        const t2 = [LZ.r * Math.cos(b + a), LZ.r * Math.sin(b + a)];
        S('path', { d: `M${f2(px)} ${f2(py)}L${f2(t1[0])} ${f2(t1[1])}L${f2(t2[0])} ${f2(t2[1])}Z`, fill: SILVER, 'fill-opacity': 0.07 }, g);
        S('path', { d: `M${f2(t1[0])} ${f2(t1[1])}L${f2(px)} ${f2(py)}L${f2(t2[0])} ${f2(t2[1])}`, fill: 'none', stroke: SILVER, 'stroke-opacity': 0.45, 'stroke-width': 1 }, g);
        S('circle', { cx: f2(px), cy: f2(py), r: 2.6, fill: WHITE }, g);
      }
    }
    const inner = S('g', { transform: 'scale(0.55)' }, g);
    S('circle', { r: LZ.r, fill: '#0A0F26', 'fill-opacity': 0.96, stroke: SILVER, 'stroke-opacity': 0.7, 'stroke-width': 1.5 }, inner);
    S('circle', { r: LZ.r - 5, fill: 'none', stroke: SILVER, 'stroke-opacity': 0.18, 'stroke-width': 4 }, inner);
    const cid = uid('clip');
    const cp = S('clipPath', { id: cid }, svg.defs);
    defsMine.push(cp);
    S('circle', { r: LZ.r - 3 }, cp);
    const content = S('g', { 'clip-path': `url(#${cid})` }, inner);
    const sm = which === 'dj' ? A.dj : A.vd;
    const leftType = which === 'dj' ? 'D' : 'V';
    const rightType = which === 'dj' ? 'J' : 'D';
    const D = SEQ.D(A.d);
    const leftSeq = which === 'dj' ? D.slice(-5) : SEQ.Vend(A.v).slice(-5);
    const rightSeq = which === 'dj' ? SEQ.Jstart(A.j).slice(0, 5) : D.slice(0, 5);
    const P = LZ.pitch, BR = LZ.br, gap = 14;
    const nA = sm.add.length;
    const keptL = 5 - sm.tL, keptR = 5 - sm.tR;
    const bead = (ch, kind, hue, x0) => {
      const b = S('g', { transform: TB(x0, 0, 1) }, content);
      const added = kind === 'added';
      const circle = S('circle', { r: BR, fill: added ? WHITE : mix(hue, NAVY, 0.08), stroke: WHITE, 'stroke-width': 1.5 }, b);
      S('text', { class: 'vdj-letter', x: 0, y: 0, dy: '0.36em', text: ch }, b);
      if (added) {
        const by = -BR - 7;
        const pr = BR * 0.42;
        S('circle', { cx: 0, cy: f2(by), r: f2(pr), fill: '#2C3563', stroke: WHITE, 'stroke-width': 1 }, b);
        S('path', { d: `M${f2(-pr * 0.55)} ${f2(by)}H${f2(pr * 0.55)}M0 ${f2(by - pr * 0.55)}V${f2(by + pr * 0.55)}`, stroke: WHITE, 'stroke-width': 1.3, 'stroke-linecap': 'round' }, b);
      }
      return { g: b, circle, x0 };
    };
    const left = [...leftSeq].map((ch, i) => bead(ch, 'old', HUE[leftType], -gap / 2 - P / 2 - (4 - i) * P));
    const right = [...rightSeq].map((ch, i) => bead(ch, 'old', HUE[rightType], gap / 2 + P / 2 + i * P));
    // faint continuation dots beyond the flanks
    for (const s of [-1, 1]) for (let k = 0; k < 3; k++) S('circle', { cx: f2(s * (gap / 2 + P * 5 + k * 9)), cy: 0, r: 1.8, fill: SILVER, opacity: 0.5 }, content);
    const trimmed = [...left.slice(keptL), ...right.slice(0, sm.tR)];
    left.slice(0, keptL).forEach((b, i) => { b.x1 = -(nA * P) / 2 - P / 2 - (keptL - 1 - i) * P; });
    right.slice(sm.tR).forEach((b, i) => { b.x1 = (nA * P) / 2 + P / 2 + i * P; });
    const added = [...sm.add].map((ch, k) => { const b = bead(ch, 'added', WHITE, (k - (nA - 1) / 2) * P); b.x1 = b.x0; gsap.set(b.g, { opacity: 0 }); return b; });
    const kept = [...left.slice(0, keptL), ...right.slice(sm.tR)];
    S('text', { class: 't-caps t-mid', x: 0, y: f2(-LZ.r + (L.compact ? 40 : 34)), text: which === 'dj' ? 'D–J junction' : 'V–D junction' }, inner);
    const trim = sm.tL + sm.tR;
    const tTxt = trim ? `−${trim} nucleotide${trim > 1 ? 's' : ''}` : 'nothing trimmed';
    const aTxt = nA ? `+${nA} added at random` : 'nothing added';
    const result = S('g', { opacity: 0 }, inner);
    const ry = LZ.r - (L.compact ? 58 : 44);
    S('text', { class: 't-small t-mid', x: 0, y: f2(ry), text: tTxt }, result);
    S('text', { class: 't-small t-mid vdj-strong', x: 0, y: f2(ry + (L.compact ? 20 : 18)), text: aTxt }, result);
    const sub = S('text', { class: 't-small t-mid t-muted', x: 0, y: f2(-LZ.r + (L.compact ? 60 : 52)), text: `${leftType} end · ${rightType} start` }, inner);
    return { g, inner, trimmed, kept, added, result, sub, cx, cy };
  }

  // ---------------------------------------------------------------- the new gene + reading frame
  function drawStrip(A, parent) {
    const P = L.strip;
    const g = S('g', { transform: 'translate(0 0)', opacity: 0 }, parent);
    const nW = (n) => Math.max(5, n * P.wN);
    const parts = [
      { k: 'V', w: P.wV, label: `V${A.v}` },
      { k: 'N', w: nW(A.vd.add.length), s: A.vd },
      { k: 'D', w: P.wD, label: `D${A.d}` },
      { k: 'N', w: nW(A.dj.add.length), s: A.dj },
      { k: 'J', w: P.wJ, label: `J${A.j}` },
    ];
    const total = parts.reduce((s, p) => s + p.w, 0) + 4 * 2;
    let x = P.cx - total / 2;
    const x0 = x;
    const y = P.y, h = P.h;
    let jStart = 0;
    for (const p of parts) {
      if (p.k === 'N') {
        S('rect', { x: f2(x), y: f2(y - h / 2 - 2), width: f2(p.w), height: h + 4, rx: 2, fill: WHITE, 'fill-opacity': 0.95 }, g);
        // one dot per random letter added at this seam
        for (let q = 0; q < p.s.add.length; q++) S('circle', { cx: f2(x + P.wN * (q + 0.5)), cy: f2(y), r: 1.7, fill: NAVY, 'fill-opacity': 0.6 }, g);
        const trim = p.s.tL + p.s.tR, add = p.s.add.length;
        S('text', { class: 't-small t-mid', x: f2(x + p.w / 2), y: f2(y - h / 2 - 9), text: `−${trim} +${add}` }, g);
      } else {
        if (p.k === 'J') jStart = x;
        S('rect', { x: f2(x), y: f2(y - h / 2), width: f2(p.w), height: h, rx: 4, fill: mix(HUE[p.k], NAVY, 0.1), stroke: mix(HUE[p.k], WHITE, 0.35), 'stroke-width': 1 }, g);
        S('text', { class: 'vdj-blk', x: f2(x + p.w / 2), y: f2(y), dy: '0.36em', text: p.label }, g);
      }
      x += p.w + 2;
    }
    const x1 = x - 2;
    const title = P.titleLeft
      ? S('text', { class: 't-caps t-end', x: f2(x0 - 14), y: f2(y + 4), text: 'New heavy-chain gene' }, g)
      : S('text', { class: 't-caps t-end', x: f2(x1), y: f2(y - h / 2 - 30), text: 'New heavy-chain gene' }, g);   // right-aligned: the segment names sit at the left
    // reading frame: three-letter ticks; the J part is regular (in frame) or jagged (out)
    const by = y + h / 2 + 13;
    const clipId = uid('rf');
    const cp = S('clipPath', { id: clipId }, svg.defs);
    defsMine.push(cp);
    const clipRect = S('rect', { x: f2(x0 - 3), y: f2(by - 12), width: 0, height: 24 }, cp);
    const bar = S('g', { 'clip-path': `url(#${clipId})` }, g);
    let ticks = '';
    for (let t = x0; t <= jStart + 0.1; t += P.tick) ticks += `M${f2(t)} ${f2(by - 5)}V${f2(by + 5)}`;
    S('path', { d: `M${f2(x0)} ${f2(by)}H${f2(jStart)}${ticks}`, fill: 'none', stroke: SILVER, 'stroke-width': 1.5, 'stroke-linecap': 'round' }, bar);
    if (A.inFrame) {
      let t2 = '';
      for (let t = jStart + P.tick; t <= x1 + 0.1; t += P.tick) t2 += `M${f2(t)} ${f2(by - 5)}V${f2(by + 5)}`;
      S('path', { d: `M${f2(jStart)} ${f2(by)}H${f2(x1)}${t2}`, fill: 'none', stroke: '#9FF0CC', 'stroke-width': 1.6, 'stroke-linecap': 'round' }, bar);
    } else {
      let z = `M${f2(jStart)} ${f2(by)}`;
      let up = true;
      for (let t = jStart + P.tick / 2; t <= x1 + 0.1; t += P.tick / 2) { z += `L${f2(t)} ${f2(by + (up ? -5 : 5))}`; up = !up; }
      S('path', { d: z, fill: 'none', stroke: CRIMSON, 'stroke-width': 1.6, 'stroke-dasharray': '4 2.5', 'stroke-linejoin': 'round' }, bar);
    }
    const head = S('path', { d: 'M-5 -11L5 -11L0 -4Z', fill: WHITE, transform: `translate(${f2(x0)} ${f2(by)})`, opacity: 0 }, g);
    const badgeG = S('g', { transform: TB(x1 + 18, by, 0.4), opacity: 0 }, g);
    ctx.badgeSVG(A.inFrame ? 'yes' : 'no', { x: 0, y: 0, r: L.compact ? 11 : 12 }, badgeG);
    const msg = S('text', { class: 't-small t-mid', x: f2((x0 + x1) / 2), y: f2(by + 27), opacity: 0 }, g);
    if (A.inFrame) { msg.textContent = 'In frame: the gene can be read.'; }
    else { msg.textContent = 'Out of frame: no working protein.'; msg.setAttribute('style', `fill:${CRIMSON}`); }
    return { g, title, clipRect, head, badgeG, msg, x0, x1, by, full: x1 - x0 + 6 };
  }

  // ---------------------------------------------------------------- receptor glyphs
  function badgeAt(parent, u, glyph, s, size, opts) {
    // Arm tip of the library antibody (molecules.js geometry): arm at ±36°, length 0.56u.
    const ang = (36 * Math.PI) / 180;
    const La = 0.56 * u;
    const ox = s * 0.035 * u, oy = -0.47 * u - 0.015 * u;
    const t = 1.12;
    const x = ox + s * Math.sin(ang) * La * t + s * Math.cos(ang) * 0.033 * u;
    const y = oy - Math.cos(ang) * La * t + Math.sin(ang) * 0.033 * u;
    const g = S('g', { transform: T(x, y, s * 36) }, parent);
    const glow = S('circle', { r: f2(size * 0.7), fill: paint.tipGlow, opacity: 0.35 }, g);
    g.append(keyBadge(S, glyph, size, opts));
    return { g, glow, x, y };
  }
  function receptor(parent, u, glyph, { badge = 0.3, bright = false } = {}) {
    const ab = bcr({ size: u, stage: 'dark' });
    parent.append(ab);
    const tips = [-1, 1].map((s) => badgeAt(parent, u, glyph, s, u * badge, { bright }));
    return tips;
  }

  // ---------------------------------------------------------------- cell area, close-up
  function drawCell(B, layers) {
    const P = L.cell;
    const g = S('g', { transform: `translate(${P.x} ${P.y})` }, layers.cell);
    const young = bCell({ r: P.r, seed: 7, receptors: false, stage: 'dark' });
    g.append(young);
    gsap.set(young, { opacity: B.n > 0 ? 0 : 0.42 });
    const mature = S('g', { opacity: 0 }, g);
    const mcell = bCell({ r: P.r, seed: 7, receptors: false, stage: 'dark' });
    mature.append(mcell);
    const inners = [];
    const glows = [];
    if (B.ok) {
      placeOnMembrane(mcell, (o) => {
        const wrap = S('g', null, null);
        const inner = S('g', { transform: 'scale(0.3)', opacity: 0 }, wrap);
        const tips = receptor(inner, o.size, B.glyph, { badge: 0.36 });
        tips.forEach((t) => glows.push(t.glow));
        inners.push(inner);
        return wrap;
      }, { count: 7, size: P.r * 0.6, seed: 5, arcStart: -170, arcEnd: 150 });
    }
    const ly = P.r + (L.compact ? 34 : 36);
    const labYoung = S('text', { class: 't-label t-mid', x: 0, y: ly, text: 'A young B cell', opacity: B.n > 0 ? 0 : 1 }, g);
    const labMature = S('text', { class: 't-label t-mid', x: 0, y: ly + 6, text: 'Finished B cell', opacity: 0 }, g);
    const labMature2 = S('text', { class: 't-small t-mid', x: 0, y: ly + 25, text: 'one receptor, many copies', opacity: 0 }, g);
    const labDead = S('text', { class: 't-small t-mid', x: 0, y: ly - 4, opacity: 0, style: `fill:${CRIMSON}` }, g);
    S('tspan', { x: 0, text: 'Both copies failed:' }, labDead);
    S('tspan', { x: 0, dy: 17, text: 'the cell dies' }, labDead);
    const dying = dyingState(young, { remnants: false, seed: 3 });

    // magnified receptor
    const C = L.close;
    const cg = S('g', { transform: `translate(${C.x} ${C.y})`, opacity: 0 }, layers.cell);
    const closeTips = [];
    const cTitle = S('text', { class: 't-caps t-mid', x: 0, y: f2(-C.size * 1.32), text: 'Its receptor, magnified' }, cg);
    if (B.ok) {
      const tips = receptor(cg, C.size, B.glyph, { badge: 0.3, bright: true });
      tips.forEach((t) => { closeTips.push(t); glows.push(t.glow); });
      const u = C.size;
      const ang = (36 * Math.PI) / 180;
      const armAt = (s, t, off) => [s * 0.035 * u + s * Math.sin(ang) * 0.56 * u * t + s * Math.cos(ang) * off, -0.485 * u - Math.cos(ang) * 0.56 * u * t + Math.sin(ang) * off];
      const lab = (txt, [ax, ay], [tx, ty], anchor = 'start') => {
        const lg = S('g', null, cg);
        S('line', { class: 'leader', x1: f2(tx + (anchor === 'start' ? -4 : 4)), y1: f2(ty - 5), x2: f2(ax), y2: f2(ay) }, lg);
        S('circle', { class: 'leader-dot', cx: f2(ax), cy: f2(ay), r: 2.4 }, lg);
        S('text', { class: `t-small ${anchor === 'end' ? 't-end' : ''}`, x: f2(tx), y: f2(ty), text: txt }, lg);
        return lg;
      };
      const right = C.lab;
      el.closeLabels = [
        lab('light chain', armAt(1, 0.42, 0.11 * u), [right, f2(-0.62 * u)]),
        lab('heavy chain', [0.07 * u, -0.22 * u], [right, f2(-0.18 * u)]),
        lab('binding site', [tips[1].x + 4, tips[1].y - 6], [right, f2(-1.08 * u)]),
      ];
    }
    const note = S('text', { class: 't-small t-mid', x: L.note.x, y: L.note.y, opacity: 0, style: 'fill:var(--fg)' }, layers.cell);
    note.textContent = 'Same V, D and J, different junctions: a different receptor.';
    return { g, young, mature, inners, glows, labYoung, labMature, labMature2, labDead, dying, close: cg, cTitle, closeTips, note };
  }

  // ---------------------------------------------------------------- library + counter
  function drawLibrary(B, layers) {
    const box = L.lib;
    const libG = S('g', null, layers.lib);
    const fit = (s) => {
      const gap = Math.max(3, Math.round(s * 0.22));
      const pitch = s + gap;
      const cols = Math.floor((box.w + gap) / pitch);
      const rows = Math.floor((box.h + gap) / pitch);
      return { s, gap, cols, rows, cap: cols * rows };
    };
    const fits = L.sizes.map(fit);
    const maxCap = fits[fits.length - 1].cap;
    const need = Math.min(builds.length, maxCap);
    const F = fits.find((q) => q.cap >= need) || fits[fits.length - 1];
    const shown = builds.slice(Math.max(0, builds.length - F.cap));
    const more = builds.length - shown.length;
    const grid = unitGrid(libG, {
      count: shown.length, cols: F.cols, size: F.s, gap: F.gap, shape: 'circle', x: box.x, y: box.y,
      group: (i) => (shown[i].ok ? 'ok' : 'fail'),
      color: { ok: 'rgba(242,179,61,0.2)', fail: 'rgba(150,158,186,0.62)' },
      state: (u, i) => (shown[i] === B ? 'hidden' : shown[i].ok ? 'filled' : 'outline'),
      label: `Library: ${shown.length} cells shown`,
    });
    // The kit's hatch pattern id comes from a page-wide counter (mount-order dependent);
    // pin it to a fixed id so identical states compare equal. (Hatch is never shown here.)
    const fixedHatch = `${FIG}-ughatch`;
    libG.querySelectorAll('.ug-hatch').forEach((pth) => {
      const m = /url\(["']?#([^"')]+)["']?\)/.exec(pth.getAttribute('style') || '');
      if (!m) return;
      if (m[1] !== fixedHatch) {
        const pat = svg.querySelector(`pattern[id="${m[1]}"]`);
        if (pat && !svg.querySelector(`pattern[id="${fixedHatch}"]`)) pat.id = fixedHatch;
        pth.setAttribute('style', pth.getAttribute('style').replace(m[0], `url(#${fixedHatch})`));
      }
    });
    let cur = null;
    grid.units.forEach((u, i) => {
      const b = shown[i];
      const ov = S('g', null, u.g);
      if (b.ok) {
        S('circle', { r: f2(F.s / 2 - 0.7), fill: 'none', stroke: AMBER, 'stroke-opacity': 0.8, 'stroke-width': 1.2 }, ov);
        const k = keyBadge(S, b.glyph, F.s * 0.66);
        k.setAttribute('transform', `translate(0 ${f2(F.s * 0.04)})`);
        ov.append(k);
      } else {
        const q = F.s * 0.17;
        S('path', { d: `M${f2(-q)} ${f2(-q)}L${f2(q)} ${f2(q)}M${f2(q)} ${f2(-q)}L${f2(-q)} ${f2(q)}`, stroke: CRIMSON, 'stroke-opacity': 0.85, 'stroke-width': 1.6, 'stroke-linecap': 'round' }, ov);
      }
      if (b === B) { cur = { u, ov }; gsap.set(ov, { opacity: 0 }); }
    });
    let moreT = null;
    if (more > 0) moreT = S('text', { class: 't-small t-end', x: box.x + box.w, y: box.y + grid.height + 17, text: `+${more} earlier cells not shown` }, libG);
    return { libG, grid, cur, shown, F, moreT };
  }
  function drawCounter(B, layers) {
    const P = L.counter;
    const g = S('g', null, layers.lib);
    const line1 = S('text', { class: 't-small', x: P.x, y: P.y }, g);
    line1.textContent = 'Heavy-chain choices: ';
    S('tspan', { class: 'vdj-strong t-num', text: '≈40 × 23 × 6 = 5,520' }, line1);
    const pre = tallies(builds.filter((b) => b !== B));
    const post = tallies(builds);
    const mk = (t) => {
      const tx = S('text', { class: 't-small t-num', x: P.x, y: P.y + P.dy }, g);
      if (L.compact) {
        tx.textContent = `Cells built: ${t.built} · Failed: ${t.failed}`;
        S('tspan', { x: P.x, dy: P.dy, text: `Different receptors: ${t.diff}` }, tx);
      } else {
        tx.textContent = `Cells built: ${t.built} · Different receptors: ${t.diff} · Failed: ${t.failed}`;
      }
      return tx;
    };
    const tPre = mk(pre);
    const tPost = mk(post);
    gsap.set(tPost, { opacity: 0 });
    // link position (HTML over the stage, in % of the viewBox)
    link.style.left = `${(P.x / L.W) * 100}%`;
    link.style.top = `${(P.link / L.H) * 100}%`;
    return { g, tPre, tPost };
  }

  // ---------------------------------------------------------------- reset (draw the "before step 1" scene)
  function draw() {
    ambients.splice(0).forEach((t) => t.kill());
    for (const c of [...svg.children]) if (c !== svg.defs) c.remove();
    defsMine.splice(0).forEach((n) => n.remove());
    uidN = 0; // ids restart with every redraw, so identical states compare equal
    svg.setAttribute('viewBox', `0 0 ${L.W} ${L.H}`);
    ctx.refreshTextScale();
    const B = current;
    const layers = {};
    for (const name of ['strip', 'rib', 'cell', 'lib', 'lens']) layers[name] = S('g', { class: `vdj-${name}` }, svg);
    el = {};
    el.attempts = B.attempts.map((A, ai) => drawAttempt(A, ai, B, layers));
    el.cell = drawCell(B, layers);
    el.lib = drawLibrary(B, layers);
    el.counter = drawCounter(B, layers);
    const first = B.n === 0;
    el.hint = S('text', { class: 't-small t-mid', x: L.hint.x, y: L.hint.y, opacity: first ? 1 : 0, style: 'font-style:italic' }, layers.lens);
    el.hint.textContent = 'Watch one young B cell edit this DNA.';
    gsap.set([el.lib.libG, el.counter.g], { opacity: first ? 0 : 1 });
    gsap.set([tag.el, link], { autoAlpha: first ? 0 : 1 });
    // identical receptors pulse together (ambient; never under reduced motion)
    if (el.cell.glows.length) {
      gsap.set(el.cell.glows, { opacity: 0.25 });
      ambients.push(ctx.ambient(gsap.to(el.cell.glows, { opacity: 0.85, duration: 1.6, ease: 'sine.inOut', yoyo: true, repeat: -1 })));
    }
  }

  // ---------------------------------------------------------------- phases (timeline builders)
  function phaseCut(tl, R, which, t, k, { keep = false } = {}) {
    const c = R.G[which];
    const o = R.cuts[which];
    const left = R.els[c.leftKey];
    const right = R.els[c.rightKey];
    const fresh = which === 'dj' ? [left, right] : [left];
    const rags = which === 'dj' ? [left.rag, right.rag] : [left.rag, right.ragV];
    const gl = Object.values(R.groupLabels);
    if (which === 'dj' && gl.length) tl.to(gl, { opacity: 0, duration: 0.4 * k }, t);
    tl.fromTo(rags, { opacity: 0, attr: { transform: 'translate(0 -16)' } },
      { opacity: 1, attr: { transform: 'translate(0 0)' }, duration: 0.6 * k, ease: 'so.out', stagger: 0.15 * k }, t);
    fresh.forEach((r) => {
      tl.to(r.tile, { attr: { fill: r.bright }, duration: 0.45 * k }, t + 0.45 * k);
      tl.fromTo(r.label, { opacity: 0 }, { opacity: 1, duration: 0.45 * k }, t + 0.5 * k);
    });
    const t2 = t + 1.0 * k;
    const loopGs = c.loop.map((key) => R.els[key].g);
    c.loop.forEach((key, i) => {
      const p = c.ring[i];
      tl.to(R.els[key].g, { attr: { transform: T(p.x, p.y, p.r, 0.42) }, duration: 1.15 * k, ease: 'so.inOut' }, t2 + (i / Math.max(1, c.loop.length)) * 0.15 * k);
    });
    c.movers.forEach((key) => {
      const p = c.after[key];
      tl.to(R.els[key].g, { attr: { transform: T(p.x, p.y) }, duration: 1.1 * k, ease: 'so.inOut' }, t2 + 0.15 * k);
    });
    const t3 = t2 + 1.2 * k;
    tl.fromTo(o.snip, { opacity: 0 }, { opacity: 1, duration: 0.2 * k }, t3 - 0.35 * k)
      .to(o.snip, { opacity: 0, duration: 0.35 * k }, t3 + 0.2 * k);
    if (loopGs.length) tl.to(loopGs, { opacity: 0, duration: 0.5 * k }, t3);
    tl.fromTo(o.ring, { opacity: 0 }, { opacity: 1, duration: 0.45 * k }, t3);
    tl.fromTo(o.ringLabel, { opacity: 0 }, { opacity: 1, duration: 0.4 * k }, t3 + 0.25 * k);
    tl.fromTo(o.stitch, { opacity: 0 }, { opacity: 1, duration: 0.3 * k }, t3 + 0.15 * k);
    tl.to(rags, { opacity: 0, duration: 0.4 * k }, t3 + 0.3 * k);
    if (which === 'vd') {
      // the three names merge into one label under the new gene
      const D = R.els[c.rightKey];
      const J = R.els[`J${R.A.j}`];
      tl.to([left.label, D.label, J.label], { opacity: 0, duration: 0.35 * k }, t3 + 0.2 * k);
      tl.fromTo(D.combo, { opacity: 0 }, { opacity: 1, duration: 0.45 * k }, t3 + 0.45 * k);
    }
    if (keep) {
      // the cut-out circle stays in view (drifted a little) until the next step
      tl.to(o.ringG, { attr: { transform: 'translate(0 -10)' }, duration: 1.2 * k, ease: 'so.out' }, t3 + 0.3 * k);
      return t3 + 1.0 * k;
    }
    tl.to(o.stitch, { opacity: 0, duration: 0.5 * k }, t3 + 1.2 * k);
    tl.to(o.ringG, { attr: { transform: 'translate(0 -26)' }, opacity: 0, duration: 1.3 * k, ease: 'so.in' }, t3 + 1.0 * k);
    return t3 + 1.0 * k;
  }

  /** Let a kept cut-out circle drift away and the repair stitch give way to the seam marker. */
  function clearCut(tl, R, which, t, k) {
    const o = R.cuts[which];
    tl.to(o.ringG, { attr: { transform: 'translate(0 -30)' }, opacity: 0, duration: 0.9 * k, ease: 'so.in' }, t);
    tl.to(o.stitch, { opacity: 0, duration: 0.4 * k }, t);
  }

  function phaseSeam(tl, R, which, t, k, { close = false } = {}) {
    const lz = R.lens[which];
    const c = R.G[which];
    const seamEl = R.els[c.rightKey].seam;
    tl.fromTo(lz.g, { opacity: 0 }, { opacity: 1, duration: 0.35 * k, ease: 'power1.out' }, t);
    tl.fromTo(lz.inner, { attr: { transform: 'scale(0.55)' } }, { attr: { transform: 'scale(1)' }, duration: 0.6 * k, ease: 'so.out' }, t);
    let tt = t + 0.8 * k;
    if (lz.trimmed.length) {
      lz.trimmed.forEach((b, i) => tl.to(b.circle, { attr: { fill: GRAY_FILL, stroke: GRAY_STROKE }, duration: 0.35 * k }, tt + i * 0.07 * k));
      const t1 = tt + 0.45 * k + lz.trimmed.length * 0.07 * k;
      lz.trimmed.forEach((b, i) => tl.to(b.g, { attr: { transform: TB(b.x0, L.lens.br * 3.1, 0.8) }, opacity: 0.32, duration: 0.55 * k, ease: 'so.in' }, t1 + i * 0.06 * k));
      tt = t1 + 0.5 * k + lz.trimmed.length * 0.06 * k;
    }
    lz.kept.forEach((b) => tl.to(b.g, { attr: { transform: TB(b.x1, 0, 1) }, duration: 0.6 * k, ease: 'so.inOut' }, tt));
    tt += 0.3 * k;
    lz.added.forEach((b, i) => tl.fromTo(b.g, { opacity: 0, attr: { transform: TB(b.x1, 0, 0.2) } },
      { opacity: 1, attr: { transform: TB(b.x1, 0, 1) }, duration: 0.42 * k, ease: 'back.out(1.6)' }, tt + i * 0.14 * k));
    tt += lz.added.length * 0.14 * k + 0.35 * k;
    tl.fromTo(lz.result, { opacity: 0 }, { opacity: 1, duration: 0.35 * k }, tt);
    tl.fromTo(seamEl, { opacity: 0 }, { opacity: 1, duration: 0.4 * k }, tt);
    tl.to(R.cuts[which].stitch, { opacity: 0, duration: 0.3 * k }, tt);
    tt += 0.5 * k;
    if (close) {
      tl.to(lz.g, { opacity: 0, duration: 0.3 * k }, tt + 0.45 * k);
      tt += 0.75 * k;
    }
    return tt;
  }

  function phaseFrame(tl, R, t, k) {
    const s = R.strip;
    tl.fromTo(s.g, { opacity: 0, attr: { transform: 'translate(0 10)' } }, { opacity: 1, attr: { transform: 'translate(0 0)' }, duration: 0.6 * k, ease: 'so.out' }, t);
    const tt = t + 0.65 * k;
    const run = 1.7 * k;
    tl.fromTo(s.clipRect, { attr: { width: 0 } }, { attr: { width: s.full }, duration: run, ease: 'none' }, tt);
    tl.fromTo(s.head, { opacity: 0, attr: { transform: `translate(${f2(s.x0)} ${f2(s.by)})` } },
      { opacity: 1, attr: { transform: `translate(${f2(s.x1)} ${f2(s.by)})` }, duration: run, ease: 'none' }, tt);
    tl.to(s.head, { opacity: 0, duration: 0.3 * k }, tt + run);
    tl.fromTo(s.badgeG, { opacity: 0, attr: { transform: TB(s.x1 + 18, s.by, 0.4) } },
      { opacity: 1, attr: { transform: TB(s.x1 + 18, s.by, 1) }, duration: 0.45 * k, ease: 'back.out(1.6)' }, tt + run + 0.05 * k);
    tl.fromTo(s.msg, { opacity: 0 }, { opacity: 1, duration: 0.4 * k }, tt + run + 0.2 * k);
    return tt + run + 0.6 * k;
  }

  /** Library thumbnail + tallies (+ the first reveal of library, counter, tag and link). */
  function dropIn(tl, B, t) {
    const lib = el.lib;
    if (B.n === 0) {
      tl.fromTo([lib.libG, el.counter.g], { opacity: 0 }, { opacity: 1, duration: 0.6 }, t - 0.3);
      tl.fromTo([tag.el, link], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, t - 0.3);
    }
    if (lib.cur) {
      const { u, ov } = lib.cur;
      lib.grid.setStates((x, i) => (i === u.i ? (B.ok ? 'filled' : 'outline') : undefined), { tl, at: t, duration: 0.4 });
      tl.fromTo(u.g, { y: u.y - 18 }, { y: u.y, duration: 0.65, ease: 'so.out' }, t);
      tl.fromTo(ov, { opacity: 0 }, { opacity: 1, duration: 0.4 }, t + 0.15);
    }
    tl.to(el.counter.tPre, { opacity: 0, duration: 0.3 }, t + 0.2);
    tl.fromTo(el.counter.tPost, { opacity: 0 }, { opacity: 1, duration: 0.4 }, t + 0.3);
    return t + 0.8;
  }

  // ---------------------------------------------------------------- steps
  const steps = [
    { // 1 · the inherited ribbon
      enter(tl) {
        const B = current;
        const k = speed();
        const R = el.attempts[0];
        let t = 0;
        if (B.n > 0) {
          tl.fromTo(R.root, { opacity: 0, attr: { transform: `translate(${-L.W} 0)` } }, { opacity: 1, attr: { transform: 'translate(0 0)' }, duration: 1.0 * k, ease: 'so.out' }, 0);
          tl.fromTo(el.cell.young, { opacity: 0 }, { opacity: 0.42, duration: 0.6 * k }, 0.3 * k);
          tl.fromTo(el.cell.labYoung, { opacity: 0 }, { opacity: 1, duration: 0.6 * k }, 0.3 * k);
          t = 0.8 * k;
        }
        const xs = Object.values(R.G.pos0).map((p) => p.x);
        const xMin = Math.min(...xs) - 60;
        const xMax = Math.max(...xs) + 60;
        R.glints.forEach((gl, i) => {
          const y = L.rows[L.compact ? i : 0];
          tl.fromTo(gl, { opacity: 0, attr: { transform: `translate(${f2(xMin)} ${y})` } }, { opacity: 0.8, duration: 0.3 * k }, t + i * 0.25 * k);
          tl.to(gl, { attr: { transform: `translate(${f2(xMax)} ${y})` }, duration: 1.3 * k, ease: 'power1.inOut' }, t + i * 0.25 * k);
          tl.to(gl, { opacity: 0, duration: 0.35 * k }, t + i * 0.25 * k + 1.0 * k);
        });
      },
    },
    { // 2 · RAG picks D and J; the loop between them is cut out
      enter(tl) {
        tl.to(el.hint, { opacity: 0, duration: 0.4 }, 0);
        phaseCut(tl, el.attempts[0], 'dj', 0, speed(), { keep: true });
      },
    },
    { // 3 · the D–J seam
      enter(tl) {
        const k = speed();
        clearCut(tl, el.attempts[0], 'dj', 0, k);
        phaseSeam(tl, el.attempts[0], 'dj', 0.2 * k, k);
      },
    },
    { // 4 · the same for V
      enter(tl) {
        const k = speed();
        const R = el.attempts[0];
        tl.to(R.lens.dj.g, { opacity: 0, duration: 0.35 * k }, 0);
        const t = phaseCut(tl, R, 'vd', 0.2 * k, k, { keep: true });
        phaseSeam(tl, R, 'vd', t + 0.1 * k, k);
      },
    },
    { // 5 · reading frame; the other parent's copy; death if both fail
      enter(tl) {
        const B = current;
        const k = speed();
        const R1 = el.attempts[0];
        tl.to(R1.lens.vd.g, { opacity: 0, duration: 0.35 * k }, 0);
        clearCut(tl, R1, 'vd', 0, k);
        let t = phaseFrame(tl, R1, 0.25 * k, k);
        if (el.attempts[1]) {
          const R2 = el.attempts[1];
          t += 1.0 * k;
          tl.to(R1.root, { opacity: 0, attr: { transform: 'translate(0 -22)' }, duration: 0.8 * k, ease: 'so.in' }, t);
          tl.to(R1.strip.g, { opacity: 0, duration: 0.6 * k }, t);
          tl.fromTo(R2.root, { opacity: 0.0, attr: { transform: `translate(0 ${L.copyDy})` } }, { opacity: 1, attr: { transform: 'translate(0 0)' }, duration: 1.1 * k, ease: 'so.out' }, t + 0.3 * k);
          t += 1.6 * k;
          const k2 = k * 0.4;
          t = phaseCut(tl, R2, 'dj', t, k2);
          t = phaseSeam(tl, R2, 'dj', t, k2, { close: true });
          t = phaseCut(tl, R2, 'vd', t, k2);
          t = phaseSeam(tl, R2, 'vd', t, k2, { close: true });
          t = phaseFrame(tl, R2, t + 0.1 * k, k2);
        }
        if (!B.ok) {
          const C = el.cell;
          t += 0.3 * k;
          tl.to(C.young, { opacity: 0.75, duration: 0.4 * k }, t);
          tl.to(C.dying, { p: 1, duration: 2.0 * k, ease: 'none' }, t + 0.3 * k);
          tl.to(C.young, { opacity: 0.25, duration: 1.2 * k }, t + 1.3 * k);
          tl.to(C.labYoung, { opacity: 0, duration: 0.4 * k }, t + 0.4 * k);
          tl.fromTo(C.labDead, { opacity: 0 }, { opacity: 1, duration: 0.5 * k }, t + 0.8 * k);
          dropIn(tl, B, t + 2.0 * k);
        }
      },
    },
    { // 6 · light chain, receptors on the cell; the thumbnail drops into the library
      enter(tl) {
        const B = current;
        const k = speed();
        const C = el.cell;
        if (!B.ok) {
          tl.to(C.labDead, { opacity: 1, duration: 0.3 }, 0);
          return;
        }
        tl.to(C.young, { opacity: 0, duration: 0.6 * k }, 0);
        tl.fromTo(C.mature, { opacity: 0 }, { opacity: 1, duration: 0.8 * k }, 0.1 * k);
        C.inners.forEach((r, i) => tl.fromTo(r, { opacity: 0, attr: { transform: 'scale(0.3)' } },
          { opacity: 1, attr: { transform: 'scale(1)' }, duration: 0.55 * k, ease: 'so.out' }, 0.45 * k + i * 0.09 * k));
        tl.to(C.labYoung, { opacity: 0, duration: 0.4 * k }, 0);
        tl.fromTo([C.labMature, C.labMature2], { opacity: 0 }, { opacity: 1, duration: 0.5 * k }, 0.6 * k);
        tl.fromTo(C.close, { opacity: 0, attr: { transform: `translate(${L.close.x} ${L.close.y + 12})` } },
          { opacity: 1, attr: { transform: `translate(${L.close.x} ${L.close.y})` }, duration: 0.8 * k, ease: 'so.out' }, 1.0 * k);
        if (B.same) tl.fromTo(C.note, { opacity: 0 }, { opacity: 1, duration: 0.5 * k }, 1.6 * k);
        dropIn(tl, B, 1.7 * k);
      },
    },
  ];

  // ---------------------------------------------------------------- builds
  function commitFirst() {
    builds = [firstBuild()];
    current = builds[0];
  }
  commitFirst();

  const words = (i) => (ctx.steps?.[i]?.text || '').split(/\s+/).filter(Boolean).length;
  let stepper = null;
  let fast = null;       // the compressed replay of a new build (see fastForward)
  let fastGo = false;
  stepper = ctx.ui.stepper({
    steps,
    reset: draw,
    dwell: (i) => (guided() ? clamp(1.2 + words(i) / 4.2, 2.6, 7.5) : i === 0 ? 0.2 : 0.35),
    onChange: (i, { initial }) => {
      if (fast && !fastGo) { fast.kill(); fast = null; }   // the reader took over: stop the compressed build
      if (i === 5 && !stageB) unlockB();
      if (!initial && (i === 5 || (i === 4 && !current.ok))) {
        const t = tallies(builds);
        ctx.announce(`${current.ok ? 'A finished B cell with a new receptor.' : 'Both copies failed; the cell died.'} Cells built: ${t.built}. Different receptors: ${t.diff}. Failed: ${t.failed}.`);
      }
      // A failed cell stops at step 5 when playing through.
      if (i === 4 && !current.ok && stepper?.playing) stepper.pause();
    },
  });

  // ---------------------------------------------------------------- controls
  const actions = ctx.ui.group({ className: 'vdj-actions' });
  ctx.controls.prepend(actions);
  const bBuild = ctx.ui.button({ label: 'Build a B cell', variant: 'primary', icon: 'play', parent: actions, onClick: () => runCurrent() });
  const bAnother = ctx.ui.button({ label: 'Build another', variant: 'primary', icon: 'plus', parent: actions, onClick: () => newBuild() });
  const bSame = ctx.ui.button({ label: 'Same segments, new junctions', parent: actions, onClick: () => newBuild({ same: true }) });
  const bHundred = ctx.ui.button({ label: 'Build 100', parent: actions, onClick: () => build100() });
  const bReset = ctx.ui.button({ label: 'Reset', icon: 'reset', variant: 'ghost', small: true, parent: actions, onClick: () => resetAll() });
  bReset.el.classList.add('vdj-reset');
  [bAnother, bSame, bHundred, bReset].forEach((b) => { b.el.hidden = true; });

  function unlockB() {
    stageB = true;
    bBuild.el.hidden = true;
    bAnother.el.hidden = false;
    bSame.el.hidden = false;
    bReset.el.hidden = false;
    bHundred.el.hidden = builds.length < 3;
  }
  const endIndex = () => (current.ok ? 5 : 4);

  function runCurrent() {
    if (ctx.reducedMotion) { stepper.go(endIndex(), { instant: true }); return; }
    if (stepper.index >= endIndex()) stepper.replay(); else stepper.play();
  }
  // After the guided first cell, every new build is a compressed replay of the same
  // timeline (≈3 s, no narration): the stepper stays on its last step and the master
  // timeline is swept from the fresh ribbon to the end state, so Back / dots / Play all
  // still land in the designed states.
  function fastForward() {
    if (fast) { fast.kill(); fast = null; }
    const target = endIndex();
    fastGo = true;
    stepper.go(target, { instant: true });
    fastGo = false;
    if (ctx.reducedMotion) { announceBuild(); return; }
    const tl = stepper.timeline;
    const end = tl.labels[`s${target}`] ?? tl.duration();
    fast = gsap.fromTo(tl, { time: 0 }, {
      time: end, duration: clamp(end * 0.3, 2.4, 3.6), ease: 'power1.inOut', overwrite: true,
      onComplete: () => { fast = null; announceBuild(); },
    });
  }
  function announceBuild() {
    const t = tallies(builds);
    ctx.announce(`${current.ok ? 'A finished B cell with a new receptor.' : 'Both copies failed; the cell died.'} Cells built: ${t.built}. Different receptors: ${t.diff}. Failed: ${t.failed}.`);
  }
  function newBuild({ same = false } = {}) {
    if (fast) { fast.kill(); fast = null; }
    stepper.pause();
    const prevOk = [...builds].reverse().find((b) => b.ok) || builds[builds.length - 1];
    const base = same ? builds[builds.length - 1] : null;
    const b = makeBuild(builds.length, newSeed(), { same: same ? (base.ok ? base : prevOk) : null });
    builds.push(b);
    current = b;
    if (builds.length >= 3) bHundred.el.hidden = false;
    stepper.rebuild();
    fastForward();
  }
  function build100() {
    if (fast) { fast.kill(); fast = null; }
    stepper.pause();
    const before = builds.length;
    for (let i = 0; i < 100; i++) builds.push(makeBuild(builds.length, newSeed()));
    current = builds[builds.length - 1];
    stepper.rebuild();
    stepper.go(endIndex(), { instant: true });
    // staggered pop-in of the new thumbnails (not part of the step timeline)
    const lib = el.lib;
    const fresh = lib.grid.units.filter((u, i) => builds.indexOf(lib.shown[i]) >= before && lib.shown[i] !== current).map((u) => u.g);
    if (!ctx.reducedMotion && fresh.length) gsap.fromTo(fresh, { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: Math.min(0.02, 1.8 / fresh.length), ease: 'power1.out' });
    const t = tallies(builds);
    ctx.announce(`Built 100 more cells. Cells built: ${t.built}. Different receptors: ${t.diff}. Failed: ${t.failed}.`);
  }
  function resetAll() {
    if (fast) { fast.kill(); fast = null; }
    stepper.pause();
    stageB = false;
    commitFirst();
    bBuild.el.hidden = false;
    [bAnother, bSame, bHundred, bReset].forEach((b) => { b.el.hidden = true; });
    stepper.rebuild();
    stepper.go(0, { instant: true });
  }

  // ---------------------------------------------------------------- layout switch
  ctx.onResize(({ compact }) => {
    const next = compact ? LAYOUTS.compact : LAYOUTS.wide;
    if (next === L) return;
    L = next;
    stepper.rebuild();
  });
  ctx.addDust();

  return {
    destroy() { ambients.forEach((t) => t.kill()); defsMine.forEach((n) => n.remove()); },
  };
}
