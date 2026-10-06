// ch12-neoadjuvant — "Before or after surgery?" (Chapter 12, Treat first, operate later).
//
// Two synchronized lanes (two patients, the same drug, only the order differs), six steps:
//   1 both lanes identical: a primary tumor whose cells display three neoantigens (hot-pink
//     triangle / star / diamond glyphs), a lymph node with naive T cells of matching clones,
//     the bloodstream, and three hidden micrometastases (A ▲, B ★, C ◆) "too small for scans";
//   2 adjuvant: the scalpel removes the tumor first; only a trickle of ▲ from A reaches the node;
//   3 neoadjuvant: the drug arrives with the tumor in place; dendritic cells carry all three
//     shapes along the lymph route to the node;
//   4 priming: three clones photocopy (cell-actions divide) vs one; clone counters 3 vs 1;
//   5 patrol through the blood: the broader army finds A, B and C (shared kill grammar);
//     the triangle army finds only A and passes B by (✕ no match);
//   6 outcome: surgery + pathology card vs a relapse from B and C, tagged "one possible course".
//
// Vocabulary (FIGURE-AUDIT §4): clone identity = named tcrKey notches with hot-pink epitopeKey
// glyphs (rule 13); lymphNodeField interiors labeled LYMPH NODE (rule 14); recognition rings +
// green "+" (rule 5); kills by T cells only, never by the drug (rules 6, 9); mature vs immature
// dendritic cells (rule 11); phase HUD + grouped step dots (rule 16); two stage tags (rule 17).
// Path and lane grammar shared with ch11-oncolytic: dotted pale-blue lymph routes with chevrons,
// soft rose blood ribbons with drifting streaks, t-caps route names.
import {
  tCell, cancerCell, healthyCell, dendriticCell, lymphNodeField, tissueField, tcrKey, epitopeKey, keyChip,
  antibody, PALETTE, mix,
} from '../art/index.js';
import * as CA from './shared/cell-actions.js';

const ID = 'ch12-neoadjuvant';
const KEYS = ['triangle', 'star', 'diamond'];
const TAU = Math.PI * 2;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
const f2 = (v) => String(Math.round(v * 100) / 100);
const C = {
  lymph: PALETTE.lymph || '#9FC3D9', blood: mix(PALETTE.rbc || '#C4505A', '#FFFFFF', 0.22),
  pink: PALETTE.neoPeptide, cancer: PALETTE.cancer, healthy: PALETTE.healthy, cd8: PALETTE.cd8, drug: PALETTE.drug || '#F2B33D',
};
const CLOCK = ['Diagnosis', 'Weeks 0–3', 'Weeks 0–6', 'Weeks 3–8', 'Weeks 6–9', 'Up to month 24'];
const NOTE = 'Illustrative: real tumors prime many more clones.';
// no-surgery variant: replaces step 6's surgery caption. Sentences are the chapter's own (12-frontier:
// the dostarlimab opening and "Sometimes there is no surgery at all…"); no new claims.
const NO_SURGERY = 'Sometimes there is no surgery at all. Twelve people with a rare type of rectal cancer \u2014 mismatch-repair deficient (MSI-high) \u2014 received six months of dostarlimab, an antibody that blocks the PD-1 brake. In all twelve who had completed treatment, the tumor vanished from scans, endoscopy and biopsies. None had needed the radiation, chemotherapy and surgery that normally follow. Such tumors are a small minority of rectal cancers; most rectal tumors do not respond to PD-1 blockade alone.';

// ------------------------------------------------------------------ geometry (lane-local units)
const GEOM = {
  wide: {
    W: 960, H: 626, laneY: [50, 346], laneH: 276,
    title: (lane) => (lane === 'adj' ? 'After surgery (adjuvant)' : 'Before surgery (neoadjuvant)'),
    chips: { x: 940, y: 12, size: 17, gap: 24, label: 'T-cell clones expanded' },
    tumor: { cx: 124, cy: 116, n: 22, r: 12.5, gap: 1.05, nh: 10, rh: 13, ring: 76 },
    ln: { x: 290, y: 32, w: 262, h: 160 },
    lymph: [[198, 116], [232, 92], [268, 96], [300, 108]],
    trickle: [[606, 112], [580, 90], [556, 92], [532, 104]],
    band: { y: 226, x0: 18, x1: 942, w: 15 },
    connector: [[476, 182], [482, 204], [492, 226]],
    mets: [{ x: 640, y: 132 }, { x: 750, y: 132 }, { x: 860, y: 132 }], metR: 30, mr: 9.5,
    scans: { x: 750, y: 70 },
    dcStart: [[214, 58], [222, 176], [150, 34]], dcSpots: [[340, 84], [352, 142], [386, 110]], rdc: 21,
    resDC: [404, 128],
    naive: { triangle: [474, 70], star: [474, 112], diamond: [474, 154] },
    rt: 9.5, badge: 17, glyph: 19, spread: 12,
    removed: { x: 124, y: 116, rx: 92, ry: 74 },
    blood: { x: 940, y: 214, anchor: 'end', text: 'Bloodstream' },
    course: { x: 944, y: 44, anchor: 'end' },
    time: { y: 258, x0: 70, wk: 50, brk: 690, m24: 876 },
    note: { x: 422, y: 210, anchor: 'middle' },
    card: { x: 26, y: 70, w: 196, h: 96 },
    texts: { tumor: [124, 213], node: [306, 52], dcs: [258, 190], scans: 'too small for scans' },
    sc: 1,
  },
  compact: {
    W: 400, H: 666, laneY: [78, 372], laneH: 290,
    title: (lane) => (lane === 'adj' ? 'After surgery' : 'Before surgery'),
    sub: (lane) => (lane === 'adj' ? 'adjuvant' : 'neoadjuvant'),
    chips: { x: 392, y: 12, size: 15, gap: 19, label: 'Clones' },
    tumor: { cx: 66, cy: 110, n: 16, r: 8.6, gap: 1.06, nh: 7, rh: 9, ring: 50 },
    ln: { x: 148, y: 48, w: 246, h: 122 },
    lymph: [[114, 106], [132, 94], [152, 100], [168, 108]],
    trickle: [[132, 192], [154, 176], [172, 162], [190, 150]],
    band: { y: 250, x0: 8, x1: 392, w: 12 },
    connector: [[296, 166], [300, 208], [304, 250]],
    mets: [{ x: 120, y: 212 }, { x: 222, y: 212 }, { x: 352, y: 212 }], metR: 22, mr: 7,
    scans: { x: 222, y: 182 },
    dcStart: [[126, 58], [134, 162], [140, 120]], dcSpots: [[192, 90], [200, 134], [230, 112]], rdc: 15,
    resDC: [238, 130],
    naive: { triangle: [318, 80], star: [318, 110], diamond: [318, 140] },
    rt: 7.2, badge: 12, glyph: 15, spread: 10,
    removed: { x: 66, y: 110, rx: 60, ry: 52 },
    blood: { x: 8, y: 241, anchor: 'start', text: 'Blood' },
    time: { y: 274, x0: 30, wk: 21, brk: 294, m24: 364 },
    note: { x: 8, y: 34, anchor: 'start' },
    course: { x: 12, y: 31, anchor: 'start' },
    card: { x: 6, y: 60, w: 170, h: 86 },
    texts: { tumor: [66, 180], node: [160, 64], dcs: null, scans: 'too small for scans' },
    sc: 0.75,
  },
};

const STYLE = `
[data-figure="${ID}"] .nadj-tag rect { fill: rgba(11,16,36,0.78); stroke: var(--fg-3); stroke-width: 1; }
[data-figure="${ID}"] .nadj-tag text { fill: var(--fg-2); }
[data-figure="${ID}"] .nadj-card rect.card { fill: #0E1530; stroke: rgba(175,192,255,0.45); stroke-width: 1.2; }
[data-figure="${ID}"] .nadj-dim { fill: var(--fg-3); }
[data-figure="${ID}"] .fig__controls .nadj-locked { display: none; }
[data-figure="${ID}"] .fig__step-text[hidden] { display: none; }
`;

// ------------------------------------------------------------------ small geometry helpers
function bez(s, t) {
  const u = 1 - t;
  return {
    x: u * u * u * s[0].x + 3 * u * u * t * s[1].x + 3 * u * t * t * s[2].x + t * t * t * s[3].x,
    y: u * u * u * s[0].y + 3 * u * u * t * s[1].y + 3 * u * t * t * s[2].y + t * t * t * s[3].y,
  };
}
/** Smooth path through points (Catmull-Rom → Béziers) with arc-length sampling (same as ch11). */
function curve(points, samples = 16) {
  const P = points.map((p) => ({ x: p[0], y: p[1] }));
  const segs = [];
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
    segs.push([p1, { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 }, { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 }, p2]);
  }
  const xs = [], ys = [], ls = [];
  let L = 0;
  segs.forEach((s, si) => {
    for (let k = si ? 1 : 0; k <= samples; k++) {
      const p = bez(s, k / samples);
      if (xs.length) L += Math.hypot(p.x - xs[xs.length - 1], p.y - ys[ys.length - 1]);
      xs.push(p.x); ys.push(p.y); ls.push(L);
    }
  });
  const at = (u) => {
    const d = clamp(u, 0, 1) * L;
    let lo = 0, hi = ls.length - 1;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (ls[m] < d) lo = m; else hi = m; }
    const k = ls[hi] - ls[lo] > 1e-9 ? (d - ls[lo]) / (ls[hi] - ls[lo]) : 0;
    return { x: lerp(xs[lo], xs[hi], k), y: lerp(ys[lo], ys[hi], k), a: Math.atan2(ys[hi] - ys[lo], xs[hi] - xs[lo]) };
  };
  const d = `M${f2(segs[0][0].x)} ${f2(segs[0][0].y)}` + segs.map((s) => `C${f2(s[1].x)} ${f2(s[1].y)} ${f2(s[2].x)} ${f2(s[2].y)} ${f2(s[3].x)} ${f2(s[3].y)}`).join('');
  return { at, d, length: L, pts: points };
}
function rngOf(seed) {
  let s = seed >>> 0;
  const r = () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  r.range = (a, b) => a + (b - a) * r();
  return r;
}
function packHex(n, r, gap, seed) {
  const R = rngOf(seed);
  const d = 2 * r * gap;
  const pts = [];
  for (let j = -7; j <= 7; j++) for (let i = -7; i <= 7; i++) {
    const x = (i + (j & 1 ? 0.5 : 0)) * d, y = j * d * 0.866;
    const a = Math.atan2(y, x);
    pts.push({ x, y, k: Math.hypot(x, y) / (1 + 0.1 * Math.sin(3 * a + seed) + 0.05 * Math.sin(5 * a + 2 * seed)) });
  }
  pts.sort((a, b) => a.k - b.k);
  return pts.slice(0, n).map((p) => ({ x: p.x + R.range(-0.18, 0.18) * r, y: p.y + R.range(-0.18, 0.18) * r }));
}

export default function mount(fig, ctx) {
  if (!document.getElementById(`${ID}-style`)) document.head.append(ctx.h('style', { id: `${ID}-style`, html: STYLE }));
  ctx.setAspect(960 / 626, 400 / 666);
  const svg = ctx.createSVG({ viewBox: '0 0 960 626' });
  const S = (tag, attrs, parent) => ctx.svg(tag, attrs, parent);
  const RM = ctx.reducedMotion;
  const { gsap } = ctx;

  ctx.tag('Illustrative', 'top-right');
  ctx.tag('Time compressed', 'top-right');
  const clock = ctx.ui.clock({ value: CLOCK[0], corner: 'top-left' });

  let layout = ctx.compact ? 'compact' : 'wide';
  let G = GEOM[layout];
  let lanes = {};
  const ambients = [];

  // ---------------------------------------------------------------- shared route grammar (as ch11-oncolytic)
  function drawLymph(parent, J, { faint = false } = {}) {
    const g = S('g', { class: 'route route--lymph', opacity: faint ? 0.75 : 1 }, parent);
    S('path', { d: J.d, fill: 'none', stroke: C.lymph, 'stroke-opacity': 0.07, 'stroke-width': 9, 'stroke-linecap': 'round' }, g);
    const dots = S('path', { d: J.d, fill: 'none', stroke: C.lymph, 'stroke-opacity': faint ? 0.5 : 0.75, 'stroke-width': 2.2, 'stroke-linecap': 'round', 'stroke-dasharray': '0.1 7' }, g);
    const step = layout === 'compact' ? 40 : 56;
    for (let s = step * 0.55; s < J.length - 8; s += step) {
      const p = J.at(s / J.length);
      S('path', { d: 'M-3.2 -3.6L1.4 0L-3.2 3.6', transform: `translate(${f2(p.x)} ${f2(p.y)}) rotate(${f2((p.a * 180) / Math.PI)})`, fill: 'none', stroke: C.lymph, 'stroke-opacity': faint ? 0.45 : 0.7, 'stroke-width': 1.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    }
    if (!RM) ambients.push(ctx.ambient(gsap.fromTo(dots, { strokeDashoffset: 0 }, { strokeDashoffset: -14.2, duration: 1.6, ease: 'none', repeat: -1 })));
    return g;
  }
  function drawBlood(parent, J, w) {
    const g = S('g', { class: 'route route--blood' }, parent);
    S('path', { d: J.d, fill: 'none', stroke: C.blood, 'stroke-opacity': 0.08, 'stroke-width': w + 10, 'stroke-linecap': 'round' }, g);
    S('path', { d: J.d, fill: 'none', stroke: C.blood, 'stroke-opacity': 0.16, 'stroke-width': w, 'stroke-linecap': 'round' }, g);
    S('path', { d: J.d, fill: 'none', stroke: C.blood, 'stroke-opacity': 0.3, 'stroke-width': 1, 'stroke-linecap': 'round' }, g);
    const flow = S('path', { d: J.d, fill: 'none', stroke: mix(C.blood, '#FFFFFF', 0.25), 'stroke-opacity': 0.5, 'stroke-width': Math.max(2, w * 0.2), 'stroke-linecap': 'round', 'stroke-dasharray': '2 16' }, g);
    if (!RM) ambients.push(ctx.ambient(gsap.fromTo(flow, { strokeDashoffset: 0 }, { strokeDashoffset: -36, duration: 2.4, ease: 'none', repeat: -1 })));
    return g;
  }

  // ---------------------------------------------------------------- art helpers
  /** A T cell wearing its clone key: TCR notches on the cell + an enlarged notched tip badge (rule 13). */
  function tArt(key, state, seed) {
    const art = tCell({ variant: 'cd8', r: G.rt, state, seed, tcrKey: key, polarity: -90, stage: 'dark' });
    const b = tcrKey({ key, form: 'tip', size: G.badge, color: 'cd8', stage: 'dark' });
    const lift = G.rt * (state === 'activated' ? 1.42 : 1.22) + G.badge * 0.18;
    const holder = S('g', { transform: `translate(0 ${f2(-lift)})` });
    holder.append(b);
    // the shape this clone recognizes, seated in its notch (hot-pink outline: "looks for ▲")
    if (typeof key === 'string') {
      const ep = epitopeKey({ key, size: G.badge * 1.75, facing: 'down', stage: 'dark', glow: false });
      const plug = ep.querySelector('[data-part="plug"]');
      if (plug) { plug.setAttribute('fill', C.pink); plug.setAttribute('fill-opacity', '0.28'); plug.setAttribute('stroke', mix(C.pink, '#FFFFFF', 0.35)); plug.setAttribute('stroke-width', '1.1'); }
      ep.setAttribute('transform', `translate(0 ${f2(Number(b.getAttribute('data-dock-y')) - 0.6)})`);
      holder.append(ep);
    }
    art.append(holder);
    if (state === 'resting') art.setAttribute('opacity', '0.82');
    return art;
  }
  function glyph(key, size, parent, x, y, { glow = true } = {}) {
    const g = S('g', { transform: `translate(${f2(x)} ${f2(y)})` }, parent);
    const e = epitopeKey({ key, size, facing: 'up', stage: 'dark', glow });
    e.setAttribute('transform', `translate(0 ${f2(size * 0.08)})`);
    g.append(e);
    return g;
  }
  function textEl(parent, x, y, text, cls = 't-small', anchor = 'start', extra = {}) {
    return S('text', { class: `${cls} t-halo`, x: f2(x), y: f2(y), 'text-anchor': anchor, text, ...extra }, parent);
  }
  function tagPill(parent, x, y, text, anchor = 'start') {
    const g = S('g', { class: 'nadj-tag', opacity: 0, transform: `translate(${f2(x)} ${f2(y)})` }, parent);
    const rect = S('rect', { y: -11, height: 20, rx: 10 }, g);
    const t = S('text', { class: 't-caps', x: 0, y: 4, 'text-anchor': 'middle', text }, g);
    // size the pill to the rendered text (t-caps grows on small stages)
    let tw = text.length * 7.4;
    try { const b = t.getBBox(); if (b.width) tw = b.width; } catch (e) { /* not rendered */ }
    const w = tw + 18, h = Math.max(20, tw / text.length * 1.9);
    const x0 = anchor === 'end' ? -w : anchor === 'middle' ? -w / 2 : 0;
    rect.setAttribute('x', f2(x0)); rect.setAttribute('width', f2(w));
    rect.setAttribute('y', f2(-h / 2 - 1)); rect.setAttribute('height', f2(h)); rect.setAttribute('rx', f2(h / 2));
    t.setAttribute('x', f2(x0 + w / 2));
    return g;
  }

  // ---------------------------------------------------------------- one lane
  function drawLane(id, index) {
    const ly = G.laneY[index];
    const root = S('g', { class: `lane lane--${id}`, transform: `translate(0 ${ly})`, opacity: 1 }, svg);
    const L = { id, root, cells: [], tumor: [], mets: [[], [], []], dcs: [], naive: {}, fx: null };
    const bg = S('g', null, root);
    const T = G.tumor;

    // lane frame: a hairline and the title
    if (index === 1) S('line', { x1: 14, x2: G.W - 14, y1: -14, y2: -14, style: 'stroke: var(--line); stroke-width: 1; stroke-dasharray: 2 5', opacity: 0.8 }, root);
    const noSurg = id === 'neo' && variant === 'none';
    const title = noSurg ? (G.sub ? 'Drug only' : 'Drug only (no surgery)') : G.title(id);
    const titleEl = textEl(root, 16, 14, title, 't-label');
    if (G.sub) {
      let tw = title.length * 8.1;
      try { tw = titleEl.getBBox().width || tw; } catch (e) { /* not rendered */ }
      textEl(root, 16 + tw + 8, 14, `(${noSurg ? 'no surgery' : G.sub(id)})`, 't-small');
    }

    // backdrop: tissue + tumor bed, node, routes
    bg.append(tissueField({ width: G.W, height: G.laneH - 34, y: 22, seed: 7 + index, stage: 'dark', density: 0.45, ghosts: false }));
    const bed = ctx.radialGradient(svg, [[0, C.healthy, 0.13], [0.7, C.healthy, 0.06], [1, C.healthy, 0]]);
    S('ellipse', { cx: T.cx, cy: T.cy, rx: f2(T.ring + 30), ry: f2((T.ring + 30) * 0.92), fill: bed }, bg);
    const lnf = lymphNodeField({ x: G.ln.x, y: G.ln.y, width: G.ln.w, height: G.ln.h, seed: 4 + index, stage: 'dark', follicles: 3, density: layout === 'compact' ? 0.6 : 0.75 });
    bg.append(lnf);
    L.lymph = curve(G.lymph);
    L.band = curve([[G.band.x0, G.band.y], [G.band.x1, G.band.y]]);
    L.conn = curve(G.connector);
    drawBlood(bg, L.band, G.band.w);
    drawBlood(bg, L.conn, G.band.w * 0.8);
    drawLymph(bg, L.lymph);
    if (id === 'adj') { L.trickle = curve(G.trickle); drawLymph(bg, L.trickle, { faint: true }); }

    // labels that never move
    const lab = S('g', { class: 'lane-labels' }, root);
    textEl(lab, G.texts.node[0], G.texts.node[1], 'Lymph node', 't-caps');
    textEl(lab, G.blood.x, G.blood.y, G.blood.text, 't-caps', G.blood.anchor, { style: 'fill: var(--fg-3)' });
    L.tumorLabel = textEl(lab, G.texts.tumor[0], G.texts.tumor[1], 'Primary tumor', 't-small', 'middle');
    ['A', 'B', 'C'].forEach((k, i) => textEl(lab, G.mets[i].x + G.metR * 0.9, G.mets[i].y + G.metR + 4, k, 't-caps', 'start'));

    // cells layer + effects
    const cellsG = S('g', { class: 'lane-cells' }, root);
    const glyphG = S('g', { class: 'lane-glyphs' }, root);
    const moverG = S('g', { class: 'lane-movers' }, root);
    L.cellsG = cellsG; L.glyphG = glyphG; L.moverG = moverG;

    // primary tumor in sand tissue
    const tumorG = S('g', { class: 'tumor' }, cellsG);
    L.tumorG = tumorG;
    const R = rngOf(31 + index);
    for (let k = 0; k < T.nh; k++) {
      const a = (k / T.nh) * TAU + R.range(-0.18, 0.18);
      const rr = T.ring + R.range(-4, 8);
      const h = healthyCell({ r: T.rh, seed: 40 + k, stage: 'dark', receptors: false });
      h.setAttribute('transform', `translate(${f2(T.cx + Math.cos(a) * rr)} ${f2(T.cy + Math.sin(a) * rr * 0.9)})`);
      h.setAttribute('opacity', '0.6');
      tumorG.append(h);
    }
    const pts = packHex(T.n, T.r, T.gap, 3 + index * 0);
    pts.sort((a, b) => a.y - b.y);
    pts.forEach((p, i) => {
      const key = KEYS[(i * 7 + 1) % 3];
      const art = cancerCell({ r: T.r, seed: 10 + i, stage: 'dark', receptors: false });
      const rg = CA.rig(art, { x: T.cx + p.x, y: T.cy + p.y, parent: tumorG, seed: 10 + i });
      const gl = glyph(key, G.glyph, glyphG, T.cx + p.x + T.r * 0.12, T.cy + p.y - T.r * 0.38);
      L.tumor.push({ rig: rg, key, glyph: gl, x: T.cx + p.x, y: T.cy + p.y });
    });
    // removed outline (shown after surgery)
    L.removed = S('g', { opacity: 0 }, lab);
    S('ellipse', { cx: G.removed.x, cy: G.removed.y, rx: G.removed.rx, ry: G.removed.ry, style: 'fill: none; stroke: var(--fg-3); stroke-width: 1.4; stroke-dasharray: 4 5' }, L.removed);
    textEl(L.removed, G.removed.x, G.removed.y + 4, 'Removed', 't-caps', 'middle');

    // micrometastases: 3 faint cells each, one shape per site, dotted outline
    L.metG = [];
    G.mets.forEach((m, i) => {
      const g = S('g', { class: 'met' }, cellsG);
      const outline = S('circle', { cx: m.x, cy: m.y, r: G.metR, 'stroke-dasharray': '2.5 4', style: 'fill: none; stroke: #C9A6E6; stroke-width: 1.3', opacity: 0.7 }, g);
      const pulse = S('circle', { cx: m.x, cy: m.y, r: G.metR, fill: '#B65FD8', opacity: 0 }, g);   // ambient pulse rides CSS opacity
      if (!RM) ambients.push(ctx.ambient(gsap.fromTo(pulse, { opacity: 0 }, { opacity: 0.09, duration: 2.2 + i * 0.3, ease: 'sine.inOut', yoyo: true, repeat: -1 })));
      const offs = [[-0.42, 0.28], [0.42, 0.24], [0.02, -0.36]];
      const grown = [[-0.9, -0.2], [0.88, -0.32], [-0.36, 0.82], [0.46, 0.84], [0.0, 0.2]];
      const key = KEYS[i];
      const list = offs.map(([u, v], k) => {
        const art = cancerCell({ r: G.mr, seed: 70 + i * 5 + k, stage: 'dark', receptors: false });
        const rg = CA.rig(art, { x: m.x + u * G.metR, y: m.y + v * G.metR, parent: g, seed: 70 + i * 5 + k, opacity: 0.42 });
        const gl = glyph(key, G.glyph * 0.85, glyphG, m.x + u * G.metR + G.mr * 0.1, m.y + v * G.metR - G.mr * 0.36);
        gl.setAttribute('opacity', '0.55');
        return { rig: rg, key, glyph: gl, x: m.x + u * G.metR, y: m.y + v * G.metR };
      });
      // relapse growth (adjuvant, step 6): extra cells, hidden until then
      const extra = id === 'adj' && i > 0 ? grown.map(([u, v], k) => {
        const art = cancerCell({ r: G.mr * 1.05, seed: 90 + i * 7 + k, stage: 'dark', receptors: false });
        const rg = CA.rig(art, { x: m.x + u * G.metR * 1.05, y: m.y + v * G.metR * 0.95, parent: g, seed: 90 + i * 7 + k, opacity: 0 });
        const gl = glyph(key, G.glyph * 0.85, glyphG, m.x + u * G.metR * 1.05, m.y + v * G.metR * 0.95 - G.mr * 0.38);
        gl.setAttribute('opacity', '0');
        return { rig: rg, glyph: gl };
      }) : [];
      L.mets[i] = list;
      L.metG.push({ g, outline, extra, m, key });
    });
    // "too small for scans" bracket over the three sites
    const sc = S('g', { opacity: 0.85 }, lab);
    const x0 = G.mets[0].x - G.metR, x1 = G.mets[2].x + G.metR;
    const by = G.scans.y + 6;
    S('path', { d: `M${x0} ${by + 6}V${by}H${x1}V${by + 6}`, style: 'fill: none; stroke: var(--fg-3); stroke-width: 1; stroke-dasharray: 2 3' }, sc);
    L.scansText = textEl(sc, G.scans.x, G.scans.y, G.texts.scans, 't-small', 'middle', { opacity: 0.55, style: 'fill: var(--fg)' });
    L.scans = sc;

    // dendritic cells: neo lane: three immature DCs at the tumor edge; adj lane: one resident DC in the node
    const dcPos = id === 'neo' ? G.dcStart : [G.resDC];
    dcPos.forEach((p, i) => {
      const imm = dendriticCell({ r: G.rdc, state: 'immature', seed: 3 + i, stage: 'dark' });
      const rg = CA.rig(imm, { x: p[0], y: p[1], parent: moverG, seed: 3 + i });
      const mat = dendriticCell({ r: G.rdc, state: 'mature', seed: 3 + i, stage: 'dark' });
      const carried = S('g', { opacity: 0 }, rg.layers.over);
      const keys = id === 'neo' ? [KEYS[i]] : ['triangle'];
      keys.forEach((k) => glyph(k, G.glyph * 0.8, carried, G.rdc * 0.15, -G.rdc * 0.18));
      L.dcs.push({ rig: rg, mature: mat, carried, key: keys[0] });
    });

    // naive T cells (one per clone, plus two unrelated clones)
    let s = 0;
    for (const key of KEYS) {
      const p = G.naive[key];
      const rg = CA.rig(tArt(key, 'resting', 50 + s), { x: p[0], y: p[1], parent: moverG, seed: 50 + s, tcrKey: key });
      L.naive[key] = rg;
      s++;
    }

    // drug antibodies (gold Y + white outline, rule 9): drift into the bloodstream, never bind tumor cells
    L.drugs = [0.22, 0.5, 0.78].map((u, i) => {
      const ab = antibody({ variant: 'therapeutic', anchor: 'center', size: layout === 'compact' ? 11 : 14, stage: 'dark' });
      const g = S('g', { opacity: 0, transform: `translate(${f2(G.band.x0)} ${G.band.y}) rotate(${-20 + i * 25})` }, moverG);
      g.append(ab);
      return { g, x: lerp(G.band.x0 + 60, G.band.x1 - 40, u), rot: -20 + i * 25 };
    });

    // timeline under the lane
    L.time = drawTimeline(root, id);

    // clone counter (header right): three chips + a count
    const ch = G.chips;
    const chipsG = S('g', { class: 'chips' }, root);
    L.count = textEl(chipsG, ch.x, ch.y + 2, curIndex >= 3 ? (id === 'adj' ? '1' : '3') : '0', 't-label', 'end', { style: 'font-variant-numeric: tabular-nums' });
    L.chips = KEYS.map((k, i) => {
      const cx = ch.x - 26 - (2 - i) * ch.gap;
      const g = S('g', { transform: `translate(${f2(cx)} ${f2(ch.y - 3)})`, opacity: 0.28 }, chipsG);
      const c = keyChip({ key: k, size: ch.size * 1.6, stage: 'dark' });
      g.append(c);
      return g;
    });
    textEl(chipsG, ch.x - 26 - 2 * ch.gap - ch.size * 0.8, ch.y + 2, ch.label, 't-caps', 'end', { style: 'fill: var(--fg-3)' });

    L.fx = CA.fxLayer(root);
    return L;
  }

  function drawTimeline(root, id) {
    const t = G.time;
    const g = S('g', { class: 'timeline' }, root);
    const xw = (w) => (w > 12 ? t.m24 : t.x0 + w * t.wk);
    const y = t.y;
    S('line', { x1: t.x0, x2: t.brk, y1: y, y2: y, style: 'stroke: var(--fg-3); stroke-width: 1.2' }, g);
    S('line', { x1: t.brk + 14, x2: t.m24 + 14, y1: y, y2: y, style: 'stroke: var(--fg-3); stroke-width: 1.2' }, g);
    S('path', { d: `M${t.brk + 2} ${y + 5}l4 -10M${t.brk + 9} ${y + 5}l4 -10`, style: 'stroke: var(--fg-3); stroke-width: 1.2; fill: none' }, g);
    for (let w = 0; w <= 12; w += 3) S('line', { x1: xw(w), x2: xw(w), y1: y - 3, y2: y + 3, style: 'stroke: var(--fg-3); stroke-width: 1' }, g);
    const lab = (x, txt, anchor) => textEl(g, x, y + 16, txt, 't-small', anchor, { style: 'fill: var(--fg-3)' });
    lab(t.x0, 'Week 0', 'middle');
    lab(xw(12), 'Week 12', 'middle');
    lab(t.m24, 'Month 24', 'middle');
    // the plan: doses (gold Y) and surgery (scalpel)
    const doses = id === 'adj' ? [3, 6, 9, 12] : [0, 3, 6, 11];
    const surgery = id === 'adj' ? 0 : 9;
    const marks = [];
    const ds = layout === 'compact' ? 9 : 12;
    doses.forEach((w) => {
      const m = S('g', { transform: `translate(${f2(xw(w))} ${f2(y - ds * 0.95)})`, opacity: 0.35 }, g);
      m.append(antibody({ variant: 'therapeutic', anchor: 'center', size: ds, stage: 'dark' }));
      marks.push({ w, el: m });
    });
    if (!(id === 'neo' && variant === 'none')) {
      const sg = S('g', { transform: `translate(${f2(xw(surgery))} ${f2(y - 12)})`, opacity: 0.35 }, g);
      ctx.iconSVG('scalpel', { x: 0, y: 0, size: layout === 'compact' ? 15 : 18, color: '#D9DEEA', strokeWidth: 1.8 }, sg);
      marks.push({ w: surgery, el: sg, surgery: true });
    }
    const ph = S('g', { transform: `translate(${f2(t.x0)} 0)` }, g);
    S('line', { x1: 0, x2: 0, y1: y - 22, y2: y + 5, style: 'stroke: #EEF2FF; stroke-width: 1.6' }, ph);
    S('path', { d: `M-5 ${y - 26}h10l-5 6z`, style: 'fill: #EEF2FF' }, ph);
    return { g, ph, marks, xw, at: 0 };
  }

  // ---------------------------------------------------------------- whole scene (reset)
  let note, card, course, relapseTag, scalpels = {};
  let curIndex = -1;
  let variant = 'surgery';           // free exploration after the last step: 'surgery' | 'none'
  function draw() {
    ambients.splice(0).forEach((a) => a.kill());
    for (const n of [...svg.children]) if (n !== svg.defs) n.remove();
    G = GEOM[layout];
    svg.setAttribute('viewBox', `0 0 ${G.W} ${G.H}`);
    ctx.refreshTextScale();
    lanes = { adj: drawLane('adj', 0), neo: drawLane('neo', 1) };
    // step-4 note, step-6 pathology card, "one possible course" + "relapse" tags
    const neo = lanes.neo, adj = lanes.adj;
    note = S('g', { opacity: 0 }, neo.root);
    textEl(note, G.note.x, G.note.y, NOTE, 't-small', G.note.anchor, { style: 'fill: var(--fg-2)' });
    card = S('g', { class: 'nadj-card', opacity: 0, transform: `translate(${G.card.x} ${G.card.y})` }, neo.root);
    const none = variant === 'none';
    const lines = none
      ? ['Clinical complete response:', 'no sign of cancer on exams,', 'scans or biopsies.']
      : ['Viable cancer left:', 'almost none \u2014 major', 'pathologic response.'];
    S('rect', { class: 'card', x: 0, y: 0, width: G.card.w + (none ? 16 : 0), height: G.card.h, rx: 8 }, card);
    ctx.badgeSVG('yes', { x: 19, y: 18, r: 8 }, card);
    textEl(card, 33, 22, none ? 'No surgery' : 'Pathology report', 't-caps');
    lines.forEach((l, i) => textEl(card, 12, 44 + i * 17, l, 't-small', 'start', { style: 'fill: var(--fg)' }));
    course = tagPill(adj.root, G.course.x, G.course.y, 'One possible course', G.course.anchor);
    relapseTag = tagPill(adj.root, (G.mets[1].x + G.mets[2].x) / 2, G.scans.y - 2, 'Relapse', 'middle');
    // scalpels that sweep across each primary tumor
    for (const id of ['adj', 'neo']) {
      const g = S('g', { opacity: 0 }, lanes[id].root);
      ctx.iconSVG('scalpel', { x: 0, y: 0, size: layout === 'compact' ? 30 : 40, color: '#E6EBF5', strokeWidth: 1.6 }, g);
      scalpels[id] = g;
    }
  }

  // ---------------------------------------------------------------- timeline helpers
  const show = (tl, n, pos, d = 0.5, to = 1) => n && tl.fromTo(n, { attr: { opacity: 0 } }, { attr: { opacity: to }, duration: d, ease: 'power1.out' }, pos);
  const hide = (tl, n, pos, d = 0.4, from = 1) => n && tl.fromTo(n, { attr: { opacity: from } }, { attr: { opacity: 0 }, duration: d, ease: 'power1.in' }, pos);
  const fade = (tl, n, a, b, pos, d = 0.5) => n && tl.fromTo(n, { attr: { opacity: a } }, { attr: { opacity: b }, duration: d, ease: 'sine.inOut' }, pos);
  /** Playhead from week a to week b (or month 24 when b > 12). Marks it passes brighten. */
  function play(tl, L, a, b, pos, d = 1.6) {
    const T = L.time;
    const xa = T.xw(a), xb = T.xw(b);
    CA.drive(tl, (p) => {
      const q = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      T.ph.setAttribute('transform', `translate(${f2(lerp(xa, xb, q))} 0)`);
    }, { duration: d, pos });
    for (const m of T.marks) {
      if (m.w > a && m.w <= b || (a === 0 && m.w === 0 && b > 0)) {
        const k = b > 12 ? Math.min(1, m.w / 12) : (m.w - a) / Math.max(0.001, b - a);
        fade(tl, m.el, 0.35, 1, `${pos}+=${f2(clamp(k, 0, 1) * d)}`, 0.35);
      }
    }
  }
  function dim(tl, L, a, b, pos) { fade(tl, L.root, a, b, pos, 0.6); }
  /** Glide a free node (e.g. a fragment glyph) between points. */
  function glide(tl, node, from, to, pos, d = 1.2, { o0 = 1, o1 = 1, arc = 0 } = {}) {
    CA.drive(tl, (p) => {
      const q = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      const x = lerp(from[0], to[0], q), y = lerp(from[1], to[1], q) - Math.sin(Math.PI * q) * arc;
      node.setAttribute('transform', `translate(${f2(x)} ${f2(y)})`);
      node.setAttribute('opacity', f2(lerp(o0, o1, Math.min(1, p * 1.4))));
    }, { duration: d, pos });
  }
  function drugsIn(tl, L, pos) {
    L.drugs.forEach((d, i) => {
      CA.drive(tl, (p) => {
        const q = 1 - Math.pow(1 - p, 3);
        d.g.setAttribute('transform', `translate(${f2(lerp(G.band.x0 - 10, d.x, q))} ${f2(G.band.y + Math.sin(p * 6 + i) * 2)}) rotate(${f2(d.rot + 30 * (1 - q))})`);
        d.g.setAttribute('opacity', f2(Math.min(1, p * 3)));
      }, { duration: 2.2 + i * 0.25, pos: `${pos}+=${i * 0.3}` });
    });
  }
  function sweepScalpel(tl, id, pos) {
    const g = scalpels[id];
    const r = G.removed;
    CA.drive(tl, (p) => {
      const q = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      const x = lerp(r.x - r.rx * 0.9, r.x + r.rx * 0.9, q), y = lerp(r.y + r.ry * 0.9, r.y - r.ry * 0.7, q);
      g.setAttribute('transform', `translate(${f2(x)} ${f2(y)})`);
      g.setAttribute('opacity', f2(Math.sin(Math.PI * p)));
    }, { duration: 1.5, pos });
  }
  function removeTumor(tl, L, pos) {
    sweepScalpel(tl, L.id, pos);
    fade(tl, L.tumorG, 1, 0, `${pos}+=0.9`, 0.9);
    L.tumor.forEach((c) => fade(tl, c.glyph, 1, 0, `${pos}+=0.9`, 0.7));
    fade(tl, L.tumorLabel, 1, 0, `${pos}+=0.9`, 0.5);
    show(tl, L.removed, `${pos}+=1.5`, 0.6);
  }
  /** Crowd kill of a primary-tumor cell by a nearby T cell (ring + shrink, rule 6). */
  function crowdKill(tl, killer, c, pos) {
    CA.recognize(tl, killer, c.rig, { badge: false, duration: 0.9, radius: G.rt * 1.2, pos });
    CA.die(tl, c.rig, { duration: 1.1, remnants: false, pos: `${pos}+=0.35` });
    fade(tl, c.glyph, 1, 0, `${pos}+=0.35`, 0.6);
  }

  // ---------------------------------------------------------------- steps
  const steps = [
    { // 1 · two identical patients; micrometastases "too small for scans"
      enter(tl) {
        for (const id of ['adj', 'neo']) {
          const L = lanes[id];
          fade(tl, L.scans, 0.85, 1, 0.2, 0.6);
          L.metG.forEach((m, i) => fade(tl, m.outline, 0.7, 1, 0.3 + i * 0.15, 0.5));
          fade(tl, L.scansText, 0.55, 1, 0.4, 0.6);
        }
      },
    },
    { // 2 · adjuvant: surgery first; drug arrives; only a trickle of ▲ from A
      enter(tl) {
        const L = lanes.adj;
        dim(tl, lanes.neo, 1, 0.4, 0);
        removeTumor(tl, L, 0.3);
        play(tl, L, 0, 3, 1.6, 1.8);
        drugsIn(tl, L, 2.4);
        // the trickle: two ▲ fragments from A ride A's lymph route to the resident DC
        const J = L.trickle;
        const dc = L.dcs[0];
        [0, 1].forEach((k) => {
          const fr = glyph('triangle', G.glyph * 0.7, L.moverG, J.pts[0][0], J.pts[0][1]);
          fr.setAttribute('opacity', '0');
          CA.drive(tl, (p) => {
            const q = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
            const pt = J.at(q);
            const end = dc.rig.plan;
            const x = q > 0.9 ? lerp(pt.x, end.x + G.rdc * 0.15, (q - 0.9) * 10) : pt.x;
            const y = q > 0.9 ? lerp(pt.y, end.y - G.rdc * 0.18, (q - 0.9) * 10) : pt.y;
            fr.setAttribute('transform', `translate(${f2(x)} ${f2(y)})`);
            fr.setAttribute('opacity', f2(Math.min(Math.min(1, p * 5), 1 - Math.max(0, (p - 0.92) / 0.08))));
          }, { duration: 2.6, pos: 2.2 + k * 0.9 });
        });
        show(tl, dc.carried, 5.4, 0.4);
        CA.swap(tl, dc.rig, dc.mature, { duration: 1.0, pos: 5.3 });
      },
    },
    { // 3 · neoadjuvant: drug arrives with the tumor in place; DCs carry all three shapes to the node
      enter(tl) {
        const L = lanes.neo;
        dim(tl, lanes.neo, 0.4, 1, 0);
        dim(tl, lanes.adj, 1, 0.4, 0);
        play(tl, L, 0, 6, 0.4, 2.4);
        drugsIn(tl, L, 0.6);
        // shed fragments: one of each shape per DC, from cells near that DC
        L.dcs.forEach((dc, i) => {
          const key = KEYS[i];
          const near = L.tumor.filter((c) => c.key === key).sort((a, b) => Math.hypot(a.x - dc.rig.plan.x, a.y - dc.rig.plan.y) - Math.hypot(b.x - dc.rig.plan.x, b.y - dc.rig.plan.y))[0];
          const fr = glyph(key, G.glyph * 0.75, L.moverG, near.x, near.y);
          fr.setAttribute('opacity', '0');
          glide(tl, fr, [near.x, near.y - G.tumor.r * 0.3], [dc.rig.plan.x + G.rdc * 0.15, dc.rig.plan.y - G.rdc * 0.18], 1.2 + i * 0.35, 1.6, { o0: 0, o1: 1, arc: 10 });
          hide(tl, fr, 2.85 + i * 0.35, 0.2);
          show(tl, dc.carried, 2.8 + i * 0.35, 0.3);
          CA.swap(tl, dc.rig, dc.mature, { duration: 0.9, pos: 3.0 + i * 0.35 });
          // walk: to the lymph route, along it, into the node
          const J = L.lymph;
          const via = [[J.pts[0][0], J.pts[0][1]], ...J.pts.slice(1, -1), [J.pts[J.pts.length - 1][0], J.pts[J.pts.length - 1][1]]];
          const spot = G.dcSpots[i];
          CA.move(tl, dc.rig, { x: spot[0], y: spot[1], via, duration: 3.4, stretch: 0.02, pos: 4.0 + i * 0.45 });
        });
        if (G.texts.dcs) {
          const lbl = textEl(L.root, G.texts.dcs[0], G.texts.dcs[1], 'Dendritic cells', 't-small', 'middle');
          lbl.setAttribute('opacity', 0);
          show(tl, lbl, 1.0, 0.5);
          hide(tl, lbl, 4.6, 0.5);
        }
      },
    },
    { // 4 · priming: three clones expand (neo) vs one (adj)
      enter(tl) {
        dim(tl, lanes.adj, 0.4, 1, 0);
        const prime = (L, dc, key, pos, chipIndex) => {
          const t = L.naive[key];
          CA.approach(tl, t, dc.rig, { gap: 1, duration: 1.1, pos });
          CA.recognize(tl, t, dc.rig, { duration: 1.4, hold: false, pos: pos + 1.1 });
          const next = tArt(key, 'activated', t.seed);
          CA.swap(tl, t, next, { duration: 0.8, pos: pos + 1.6 });
          // back home, then two rounds of photocopying: a row of four identical cells
          const K = G.naive[key];
          CA.move(tl, t, { x: K[0], y: K[1], duration: 0.9, stretch: 0.02, pos: pos + 2.3 });
          const d1 = CA.divide(tl, t, 2, { angle: 0, spread: G.spread * 2, duration: 1.2, scale: 1, pos: pos + 3.25 });
          const army = [];
          d1.forEach((d, k) => army.push(...CA.divide(tl, d, 2, { angle: 0, spread: G.spread, duration: 1.1, scale: 1, pos: pos + 4.5 + k * 0.1 })));
          army.sort((a, b) => a.plan.x - b.plan.x);
          L.army = L.army || {};
          L.army[key] = army;
          fade(tl, L.chips[chipIndex], 0.28, 1, pos + 4.2, 0.5);
        };
        const N = lanes.neo, A = lanes.adj;
        KEYS.forEach((k, i) => prime(N, N.dcs[i], k, 0.3 + i * 0.5, i));
        prime(A, A.dcs[0], 'triangle', 0.3, 0);
        show(tl, note, 2.0, 0.6);
        play(tl, A, 3, 6, 0.3, 2);
        play(tl, N, 6, 7, 0.3, 1.2);
      },
    },
    { // 5 · patrol through the blood: the broad army finds A, B, C; the triangle army only A
      enter(tl) {
        const N = lanes.neo, A = lanes.adj;
        const conn = G.connector;
        const band = G.band.y;
        const down = [[conn[0][0], conn[0][1]], [conn[1][0], conn[1][1]]];
        /** Ride the blood to a site and settle just outside one of its cells (outward side). */
        const toCell = (t, siteIndex, c, pos) => {
          const m = G.mets[siteIndex];
          const a = Math.atan2(c.y - m.y, c.x - m.x);
          const d = G.mr + G.rt * 1.25 + 3;
          const P = [c.x + Math.cos(a) * d, c.y + Math.sin(a) * d];
          const side = Math.cos(a) >= 0 ? 1 : -1;
          const via = [...down, [conn[2][0] + 10, band], [m.x + side * (G.metR + G.rt * 1.6), band - G.rt * 0.5]];
          if (P[1] < m.y) via.push([m.x + side * (G.metR + G.rt * 1.6), m.y]);
          const dur = 2.1 + Math.abs(m.x - conn[2][0]) / 300;
          CA.move(tl, t, { x: P[0], y: P[1], via, duration: dur, stretch: 0.03, pos });
          return pos + dur;
        };
        const site = (L, army, siteIndex, pos0) => {
          army.forEach((t, k) => {
            const c = L.mets[siteIndex][k];
            const end = toCell(t, siteIndex, c, pos0 + k * 0.3);
            CA.kill(tl, t, c.rig, { duration: 1.4, pos: end + 0.1 });
            fade(tl, c.glyph, 0.55, 0, end + 1.6, 0.5);
          });
          fade(tl, L.metG[siteIndex].outline, 1, 0, pos0 + 5.6, 0.8);
        };
        // neoadjuvant: three copies per clone to its site, the fourth back into the primary tumor
        KEYS.forEach((key, i) => {
          const army = N.army[key];
          site(N, army.slice(1, 4), i, 0.2 + i * 0.35);
          const t = army[0];
          const targets = N.tumor.filter((c) => c.key === key).sort((a, b) => b.y - a.y);
          const first = targets[0];
          CA.move(tl, t, { x: first.x + G.rt * 1.4, y: first.y + G.tumor.r + G.rt, via: [...down, [conn[2][0] - 10, band], [first.x + 30, band]], duration: 2.6, stretch: 0.03, pos: 0.3 + i * 0.3 });
          let at = 3.0 + i * 0.3;
          targets.slice(0, key === 'star' ? 6 : 7).forEach((c, k) => {
            if (k > 0) CA.approach(tl, t, c.rig, { gap: 1, duration: 0.45, pos: at - 0.45 });
            crowdKill(tl, t, c, at);
            at += 0.6;
          });
          N.inTumor = (N.inTumor || []).concat(t);
        });
        // adjuvant: three triangle copies clear A; the fourth meets B (no match) and moves on
        const army = A.army.triangle;
        site(A, army.slice(1, 4), 0, 0.2);
        const t4 = army[0];
        const b0 = A.mets[1][0];
        const reach = toCell(t4, 1, b0, 0.9);
        CA.probe(tl, t4, b0.rig, { match: false, hold: 0.8, pos: reach + 0.1 });
        const m1 = G.mets[1];
        CA.move(tl, t4, { x: m1.x - G.metR * 1.9, y: G.band.y - G.rt * 0.3, duration: 1.6, stretch: 0.03, pos: reach + 2.2 });
        fade(tl, N.scans, 1, 0, 6.6, 0.6);
        play(tl, A, 6, 9, 0.2, 2.4);
        play(tl, N, 7, 8, 0.2, 1.2);
      },
    },
    { // 6 · outcome: surgery + pathology vs one possible relapse
      enter(tl) {
        const N = lanes.neo, A = lanes.adj;
        if (variant === 'none') {
          // variant: no surgery — the T cells clear the last cells; the drug continues; follow-up
          const left = N.tumor.filter((c) => c.rig.plan.dying < 1);
          left.forEach((c, k) => {
            const t = N.inTumor[KEYS.indexOf(c.key)] || N.inTumor[0];
            CA.approach(tl, t, c.rig, { gap: 1, duration: 0.6, pos: 0.2 + k * 0.9 });
            crowdKill(tl, t, c, 0.8 + k * 0.9);
          });
          play(tl, N, 8, 12, 0.2, 1.8);
        } else {
          removeTumor(tl, N, 0.2);
          (N.inTumor || []).forEach((t) => CA.move(tl, t, { opacity: 0, duration: 0.8, pos: 1.1 }));
          play(tl, N, 8, 9, 0.2, 1.2);
        }
        show(tl, card, 2.0, 0.6);
        tl.fromTo(card, { attr: { transform: `translate(${G.card.x} ${G.card.y + 8})` } }, { attr: { transform: `translate(${G.card.x} ${G.card.y})` }, duration: 0.6, ease: 'so.out' }, 2.0);
        // adjuvant: two years on, B and C have grown into a visible relapse
        play(tl, A, 9, 24, 0.6, 1.4);
        fade(tl, A.scans, 1, 0, 1.6, 0.5);
        [1, 2].forEach((i) => {
          const st = A.metG[i];
          A.mets[i].forEach((c, k) => {
            CA.move(tl, c.rig, { opacity: 1, duration: 1.0, pos: 2.0 + k * 0.1 });
            fade(tl, c.glyph, 0.55, 1, 2.0 + k * 0.1, 0.8);
          });
          st.extra.forEach((c, k) => {
            CA.move(tl, c.rig, { opacity: 1, duration: 1.0, pos: 2.3 + k * 0.18 });
            fade(tl, c.glyph, 0, 1, 2.4 + k * 0.18, 0.7);
          });
          tl.fromTo(st.outline, { attr: { r: G.metR, 'stroke-dasharray': '2.5 4', opacity: 1 } }, { attr: { r: G.metR * 1.45, 'stroke-dasharray': '1000 0', opacity: 1 }, duration: 1.2 }, 2.2);
        });
        show(tl, relapseTag, 3.4, 0.5);
        show(tl, course, 3.8, 0.5);
      },
    },
  ];

  let variantCtl = null;
  let paintCaption = () => {};
  const stepper = ctx.ui.stepper({
    steps,
    reset: draw,
    phases: [
      { label: 'Two patients', steps: [0] },
      { label: 'Antigen supply', steps: [1, 2] },
      { label: 'T cells', steps: [3, 4] },
      { label: 'Outcome', steps: [5] },
    ],
    onChange(i, info) {
      curIndex = i;
      clock.set(CLOCK[Math.max(0, i)]);
      lanes.adj.count.textContent = i >= 3 ? '1' : '0';
      lanes.neo.count.textContent = i >= 3 ? '3' : '0';
      // the stepper announced the writer's (surgery) caption; the no-surgery course has its own
      if (variant === 'none' && i === 5 && !info?.initial) ctx.announce(`Step 6 of 6, Outcome. ${NO_SURGERY}`);
    },
    onComplete() { if (variantCtl) variantCtl.el.classList.remove('nadj-locked'); },
  });

  // guided-then-free (rule 21): once the reader reaches the end, the before-surgery patient's last
  // step can be swapped for the no-surgery course the chapter describes (dMMR rectal cancer).
  // That course gets its own step-6 caption, swapped in place of the surgery caption.
  const step6 = ctx.caption.querySelectorAll('.fig__steps > .fig__step')[5];
  const surgeryText = step6?.querySelector('.fig__step-text');
  if (step6 && surgeryText) {
    const noSurgeryText = ctx.h('p', { class: 'fig__step-text nadj-nosurgery', hidden: true, html: NO_SURGERY });
    step6.append(noSurgeryText);
    paintCaption = () => { surgeryText.hidden = variant === 'none'; noSurgeryText.hidden = variant !== 'none'; };
  }
  variantCtl = ctx.ui.segmented({
    label: 'Before-surgery patient, last step',
    options: [{ value: 'surgery', label: 'Surgery' }, { value: 'none', label: 'No surgery' }],
    value: variant,
    onChange: (v) => {
      variant = v;
      paintCaption();
      stepper.rebuild();
      if (stepper.index !== 5) stepper.go(5);
      ctx.announce(v === 'none' ? `Showing the no-surgery course. ${NO_SURGERY}` : `Showing surgery after the drug. ${ctx.steps?.[5]?.text || ''}`.trim());
    },
  });
  variantCtl.el.classList.add('nadj-locked');

  ctx.onResize(({ compact }) => {
    const next = compact ? 'compact' : 'wide';
    if (next === layout) return;
    layout = next;
    stepper.rebuild();
  });

  return { destroy() { ambients.forEach((a) => a.kill()); } };
}
