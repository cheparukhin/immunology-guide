// ch10-build-a-car — "One signal, or two" (Chapter 10, Living Drugs).
// ONE idea: what the CAR's signaling tail does. A tail with signal 1 only (CD3ζ) kills once and
// fades; a tail with signal 1 + signal 2 (CD28 or 4-1BB, built into the same molecule) kills,
// divides and survives. One binding event delivers both signals.
//
// Two views of the same moment, side by side (stacked on phones):
//   • ONE RECEPTOR: the T-cell membrane in cross-section with one CAR (art `car`, modular tail),
//     the target cell's surface arriving with its antigen keys (art `antigen`, circles = the
//     generic CAR target, rule 4), the clamp at the art DOCK_GAP['car-antigen'] geometry, the
//     CD3ζ ITAMs lighting up, the costimulatory domain pulsing, and "+" signals travelling into
//     the cell to two chips.
//   • THE CELL: the CAR-T cell and a cancer cell, contact kill with shared/cell-actions (rule 6
//     grammar), then divide (signal 2) or dim and stop (signal 1 only).
// Meters: shared/activity-meter (segments, words only, "Illustrative").
// The close-up is drawn locally from art primitives (see report: synapse.js cannot vary the CAR
// tail, hold one large glyph upright at rest, or slide/dimple its membranes).
import { tCell, cancerCell, car, antigen, placeOnMembrane, PALETTE, mix, shade, DOCK_GAP } from '../art/index.js';
import * as CA from './shared/cell-actions.js';
import { meter } from './shared/activity-meter.js';

const ID = 'ch10-build-a-car';
const WHITE = '#FFFFFF';
const BG = '#0B1024';
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
const seg = (p, a, b) => clamp((p - a) / (b - a || 1), 0, 1);
const f = (v) => String(Math.round(v * 100) / 100);
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t) => 1 - Math.pow(1 - t, 3);

const TAILS = {
  z: { costim: [], label: 'CD3ζ only', name: null, sig2: false },
  cd28: { costim: ['cd28'], label: 'CD28 + CD3ζ', name: 'CD28', sig2: true },
  bb: { costim: ['4-1bb'], label: '4-1BB + CD3ζ', name: '4-1BB', sig2: true },
};

const LAYOUTS = {
  wide: {
    vb: [960, 540],
    close: { x0: 0, x1: 528, cx: 262, my: 302, u: 104, labelX: 352, chipY: [454, 494], regionX: 26, depth: 250 },
    heads: [{ x: 26, y: 30, text: 'One receptor, up close' }, { x: 566, y: 30, text: 'The whole cell' }],
    divider: { x: 538, y0: 52, y1: 500 },
    cell: { x: 704, y: 262, r: 40, polarity: -40, tr: 50, from: [1030, 20], angle: -40, d: [[612, 330], [668, 124]], dim: [690, 270], out: [740, 372] },
    meters: { x: 566, y: [402, 462], w: 360 },
  },
  compact: {
    vb: [400, 640],
    close: { x0: 0, x1: 400, cx: 178, my: 232, u: 74, labelX: 236, chipY: [344, 378], regionX: 14, depth: 176 },
    heads: [{ x: 14, y: 22, text: 'One receptor, up close' }, { x: 14, y: 428, text: 'The whole cell' }],
    divider: null,
    hline: { y: 408, x0: 14, x1: 386 },
    cell: { x: 160, y: 532, r: 32, polarity: -30, tr: 40, from: [470, 380], angle: -30, d: [[86, 566], [262, 500]], dim: [150, 538], out: [200, 620] },
    meters: null,
  },
};

const STYLE = `
[data-figure="${ID}"] .bc-meters { --fg: var(--ink); --fg-2: var(--ink-2); --fg-3: var(--ink-3); --line: var(--rule-strong); --halo: var(--surface);
  display: none; gap: 14px 32px; flex-wrap: wrap; margin: 0.75rem 0 0; }
[data-figure="${ID}"] .bc-meters.is-on { display: flex; }
[data-figure="${ID}"] .bc-meters svg text { font-family: var(--font-ui); fill: var(--fg); }
[data-figure="${ID}"] .bc-meters .t-caps { font-size: 12px; font-weight: 650; letter-spacing: 0.08em; text-transform: uppercase; fill: var(--fg-2); }
[data-figure="${ID}"] .bc-history { margin: 0.6rem 0 0; font: 400 var(--text-sm, 16px)/1.5 var(--font-body); color: var(--ink-2);
  opacity: 0; transform: translateY(4px); transition: opacity .6s ease, transform .6s ease; }
[data-figure="${ID}"] .bc-history[hidden] { display: none; }
[data-figure="${ID}"] .bc-history.is-on { opacity: 1; transform: none; }
[data-figure="${ID}"] .bc-run { white-space: nowrap; }
[data-figure="${ID}"] .bc-ghost text { visibility: hidden; }
[data-figure="${ID}"] .bc-mrow { position: relative; }
[data-figure="${ID}"] .bc-mrow > svg { position: relative; }
[data-figure="${ID}"] .bc-mrow > .bc-ghost { position: absolute; inset: 0; opacity: 0.4; }
[data-figure="${ID}"] .bc-mnote { flex: 1 1 100%; margin: -6px 0 0; display: flex; flex-wrap: wrap; gap: 2px 16px; font: 500 13px/1.4 var(--font-ui); color: var(--ink-2); }
[data-figure="${ID}"] .bc-mnote [hidden] { display: none; }
@media (prefers-reduced-motion: reduce) { [data-figure="${ID}"] .bc-history { transition: none; } }
`;

export default function mount(fig, ctx) {
  const { gsap } = ctx;
  if (!document.getElementById('bc10-style')) document.head.append(ctx.h('style', { id: 'bc10-style', html: STYLE }));

  ctx.setAspect(16 / 9, 400 / 640);
  const svg = ctx.createSVG({ viewBox: '0 0 960 540' });
  const S = (tag, attrs, parent) => ctx.svg(tag, attrs, parent);
  ctx.tag('Illustrative', 'top-right');

  let tailKey = 'cd28';
  let layoutName = ctx.compact ? 'compact' : 'wide';
  let L = LAYOUTS[layoutName];
  let A = {};
  let tl = null;
  let runs = 0;
  let shownMeters = false;
  let lastResult = null;   // { kill, persist } of the last finished run, for redraws
  let ghost = null;        // { tail, kill, persist }: the last finished run with a different tail (faint bars)
  const done = [];         // finished runs, newest last: { tail, kill, persist }
  let paused = false;      // off-screen / hidden tab

  // ------------------------------------------------------------------ HTML: meters (phones), history line
  const metersBox = ctx.h('div', { class: 'bc-meters', 'aria-hidden': 'true' });
  const history = ctx.h('p', { class: 'bc-history', hidden: true, text: 'The first generation of these receptors had only the first option.' });

  // ------------------------------------------------------------------ the custom bilayer (can dimple)
  function bilayer(parent, { x0, x1, cx, sigma, m, color, dir, depth }) {
    const g = S('g', { 'data-part': dir > 0 ? 'membrane-t' : 'membrane-target' }, parent);
    const cytoColor = mix(shade(color, 0.42), '#131B36', 0.3);
    const grad = ctx.linearGradient(svg, [[0, cytoColor, 0.62], [0.5, cytoColor, 0.2], [1, cytoColor, 0]],
      { x1: '0%', x2: '0%', y1: dir > 0 ? '0%' : '100%', y2: dir > 0 ? '100%' : '0%' });
    const cyto = S('path', { fill: grad }, g);
    const band = S('path', { fill: mix(shade(color, 0.6), BG, 0.3) }, g);
    const tails = S('path', { fill: 'none', stroke: mix(color, WHITE, 0.35), 'stroke-opacity': 0.35, 'stroke-width': f(Math.max(0.5, m * 0.05)) }, g);
    const heads = S('path', { fill: mix(color, WHITE, 0.35), 'fill-opacity': 0.78 }, g);
    const hr = m * 0.17, step = hr * 2.3;
    const surfFn = (y, A0) => (x) => y - dir * A0 * Math.exp(-(((x - cx) / sigma) ** 2));
    function render(y, A0) {
      const s = surfFn(y, A0);
      let top = '', bot = '', hd = '', tl2 = '';
      const N = Math.ceil((x1 - x0) / 8);
      for (let i = 0; i <= N; i++) {
        const x = x0 + ((x1 - x0) * i) / N;
        top += `${i ? 'L' : 'M'}${f(x)} ${f(s(x))}`;
      }
      for (let i = N; i >= 0; i--) {
        const x = x0 + ((x1 - x0) * i) / N;
        bot += `L${f(x)} ${f(s(x) + dir * m)}`;
      }
      band.setAttribute('d', `${top}${bot}Z`);
      // cytoplasm: from the inner surface to the far side
      let cy = '';
      for (let i = 0; i <= N; i++) {
        const x = x0 + ((x1 - x0) * i) / N;
        cy += `${i ? 'L' : 'M'}${f(x)} ${f(s(x) + dir * m)}`;
      }
      cy += `L${f(x1)} ${f(y + dir * depth)}L${f(x0)} ${f(y + dir * depth)}Z`;
      cyto.setAttribute('d', cy);
      for (let x = x0 + hr; x < x1; x += step) {
        const yo = s(x);
        const ya = yo + dir * hr, yb = yo + dir * (m - hr);
        hd += `M${f(x - hr)} ${f(ya)}a${f(hr)} ${f(hr)} 0 1 0 ${f(2 * hr)} 0a${f(hr)} ${f(hr)} 0 1 0 ${f(-2 * hr)} 0`;
        hd += `M${f(x - hr)} ${f(yb)}a${f(hr)} ${f(hr)} 0 1 0 ${f(2 * hr)} 0a${f(hr)} ${f(hr)} 0 1 0 ${f(-2 * hr)} 0`;
        const mid = yo + dir * m / 2;
        tl2 += `M${f(x - hr * 0.35)} ${f(ya + dir * hr)}V${f(mid - dir * 0.4)}M${f(x + hr * 0.35)} ${f(ya + dir * hr)}V${f(mid - dir * 0.4)}`;
        tl2 += `M${f(x - hr * 0.35)} ${f(yb - dir * hr)}V${f(mid + dir * 0.4)}M${f(x + hr * 0.35)} ${f(yb - dir * hr)}V${f(mid + dir * 0.4)}`;
      }
      heads.setAttribute('d', hd);
      tails.setAttribute('d', tl2);
      return s;
    }
    return { el: g, render, surf: surfFn };
  }

  // ------------------------------------------------------------------ small SVG helpers
  function label(parent, { text, x, y, to, anchor = 'start', cls = 't-label' }) {
    const g = S('g', { 'data-label': text }, parent);
    if (to) {
      const lx = anchor === 'start' ? x - 6 : anchor === 'end' ? x + 6 : x;
      const ly = y - 5;
      const dx = to[0] - lx, dy = to[1] - ly, len = Math.hypot(dx, dy) || 1;
      S('line', { class: 'leader', x1: f(lx), y1: f(ly), x2: f(to[0] - (dx / len) * 3.5), y2: f(to[1] - (dy / len) * 3.5) }, g);
      S('circle', { class: 'leader-dot', cx: f(to[0]), cy: f(to[1]), r: 2.4 }, g);
    }
    S('text', { class: `${cls} t-halo`, x: f(x), y: f(y), 'text-anchor': anchor, text }, g);
    return g;
  }

  /** A signal chip: rounded pill, a sign disc (+ green-cyan / neutral ring), text. */
  function chip(parent, { x, y, text, sign, anchor = 'middle' }) {
    const g = S('g', { 'data-part': 'chip', opacity: 0 }, parent);
    const bg = S('rect', { y: -15, height: 30, rx: 15, style: sign ? 'fill: rgb(11 16 36 / 0.86); stroke: rgb(61 220 151 / 0.55); stroke-width: 1.2' : 'fill: rgb(11 16 36 / 0.7); stroke: rgb(169 177 204 / 0.4); stroke-width: 1.2; stroke-dasharray: 3 3' }, g);
    const disc = S('g', { transform: 'translate(16 0)' }, g);
    if (sign) {
      S('circle', { r: 8, style: `fill: ${PALETTE.activating}; stroke: ${mix(PALETTE.activating, WHITE, 0.4)}; stroke-width: 1` }, disc);
      S('path', { d: 'M-4.2 0H4.2M0 -4.2V4.2', style: 'stroke: #0B1024; stroke-width: 2; stroke-linecap: round' }, disc);
    } else {
      S('circle', { r: 7, style: 'fill: none; stroke: var(--fg-3); stroke-width: 1.5; stroke-dasharray: 2.5 2.5' }, disc);
    }
    const t = S('text', { class: 't-small', x: 30, y: 4.5, text, style: sign ? 'fill: var(--fg); font-weight: 600' : 'fill: var(--fg-2)' }, g);
    let w = 0;
    try { w = t.getComputedTextLength(); } catch (e) { /* not rendered */ }
    if (!w) w = text.length * 7.2;
    const W = 30 + w + 14;
    bg.setAttribute('width', f(W));
    const left = anchor === 'middle' ? x - W / 2 : anchor === 'end' ? x - W : x;
    g.setAttribute('transform', `translate(${f(left)} ${f(y)})`);
    g.dataset.w = f(W);
    return { g, left, W, top: y - 15, bottom: y + 15 };
  }

  const fadeIn = (t, node, pos, d = 0.5) => t.fromTo(node, { attr: { opacity: 0 } }, { attr: { opacity: 1 }, duration: d, ease: 'power1.out', immediateRender: false }, pos);
  const fadeOut = (t, node, pos, d = 0.5) => t.fromTo(node, { attr: { opacity: 1 } }, { attr: { opacity: 0 }, duration: d, ease: 'power1.in', immediateRender: false }, pos);

  // ------------------------------------------------------------------ cell-panel art
  function carTCell({ r, state, seed = 21, polarity }) {
    const art = tCell({ variant: 'cd8', r, state, seed, polarity, receptors: false, stage: 'dark' });
    const sz = clamp(r * 0.38, 11, 17);
    placeOnMembrane(art, (o) => car({ ...o, size: sz, costim: TAILS[tailKey].costim }), { count: 9, size: sz, seed, offset: 0.15, layer: 'cars' });
    return art;
  }

  // ------------------------------------------------------------------ draw (reset state)
  function draw() {
    if (tl) { tl.kill(); tl = null; }
    for (const n of [...svg.children]) if (n !== svg.defs) n.remove();
    L = LAYOUTS[layoutName];
    const [W, H] = L.vb;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    ctx.refreshTextScale();
    A = {};
    const T = TAILS[tailKey];
    const C = L.close;
    const u = C.u, m = 0.16 * u;
    const sigma = 0.95 * u;
    A.u = u; A.m = m;

    // ---------- the close-up
    const close = S('g', { class: 'bc-close' }, svg);
    const clipId = `bc10-clip-${Math.random().toString(36).slice(2, 7)}`;
    const cp = S('clipPath', { id: clipId }, svg.defs);
    const clipH = layoutName === 'wide' ? H : (L.hline ? L.hline.y : H);
    S('rect', { x: C.x0, y: 0, width: C.x1 - C.x0, height: clipH }, cp);
    close.setAttribute('clip-path', `url(#${clipId})`);

    // engaged geometry: binder head meets antigen head at the art DOCK_GAP; both membranes dimple
    const dock = (DOCK_GAP['car-antigen'] || 2.0) * u;
    const dimple = 0.06 * u;
    A.geo = { yEng: C.my - dock - 2 * dimple, yNear: C.my - dock - 2 * dimple - 0.34 * u, yFar: C.my - dock - 3.4 * u, dimple };

    const tMem = bilayer(close, { x0: C.x0 - 10, x1: C.x1 + 10, cx: C.cx, sigma, m, color: PALETTE.cd8, dir: 1, depth: C.depth });
    const targetG = S('g', { 'data-part': 'target', opacity: 1 }, close);
    const gMem = bilayer(targetG, { x0: C.x0 - 10, x1: C.x1 + 10, cx: C.cx, sigma, m, color: PALETTE.cancer, dir: -1, depth: 520 });

    // antigens on the target surface (circles on stalks, facing down toward the T cell)
    const agXs = [C.cx - 2.55 * u, C.cx - 1.3 * u, C.cx, C.cx + 1.3 * u, C.cx + 2.55 * u].filter((x) => x > C.x0 - 20 && x < C.x1 + 20);
    const ags = agXs.map((x, i) => {
      const w = S('g', {}, targetG);
      w.append(antigen({ size: u * (x === C.cx ? 1 : 0.94), shape: 'circle', stage: 'dark' }));
      return { w, x, main: x === C.cx, tilt: x === C.cx ? 0 : [-7, 5, 0, -4, 8][i] };
    });

    // the CAR (one receptor)
    const carWrap = S('g', {}, close);
    const carArt = car({ size: u, costim: T.costim, stage: 'dark' });
    carWrap.append(carArt);
    // overlays in the CAR's own frame: ITAM ticks lighting, costim pulse ring
    const yZ0 = m + 0.05 * u + T.costim.length * (0.25 * u);
    const itams = [0, 1, 2].map((i) => {
      const yy = yZ0 + 0.13 * u + i * 0.13 * u;
      const g = S('g', { opacity: 0 }, carArt);
      S('ellipse', { cx: 0, cy: f(yy), rx: f(0.12 * u), ry: f(0.06 * u), fill: ctxGlow(PALETTE.activating) }, g);
      S('path', { d: `M${f(-0.042 * u)} ${f(yy)}H${f(0.042 * u)}`, style: `stroke: ${mix(PALETTE.activating, WHITE, 0.55)}; stroke-width: ${f(Math.max(2, u * 0.03))}; stroke-linecap: round` }, g);
      return g;
    });
    let costimRing = null;
    const yC = m + 0.05 * u + 0.1 * u;
    if (T.costim.length) {
      costimRing = S('g', { opacity: 0 }, carArt);
      S('circle', { cx: 0, cy: f(yC), r: f(0.2 * u), fill: ctxGlow(PALETTE.activating) }, costimRing);
      A.costimRingC = S('circle', { cx: 0, cy: f(yC), r: f(0.15 * u), style: `fill: none; stroke: ${mix(PALETTE.activating, WHITE, 0.4)}; stroke-width: 1.6` }, costimRing);
    }
    A.itams = itams; A.costimRing = costimRing;

    // the live geometry (pure function of st)
    const st = { arrive: 0, clamp: 0, leave: 0 };
    A.st = st;
    const render = () => {
      const g = A.geo;
      const yA = lerp(g.yFar, g.yNear, easeOut(st.arrive));
      const yC2 = lerp(yA, g.yEng, easeInOut(st.clamp));
      const yT = lerp(yC2, g.yNear - 0.6 * u, easeInOut(st.leave));
      const dT = g.dimple * easeInOut(st.clamp) * (1 - easeInOut(st.leave));
      const sT = tMem.render(C.my, dT);
      const sG = gMem.render(yT, dT);
      carWrap.setAttribute('transform', `translate(${f(C.cx)} ${f(sT(C.cx))})`);
      for (const a of ags) {
        const tilt = a.main ? 9 * (1 - easeInOut(st.clamp)) + 6 * easeInOut(st.leave) : a.tilt;
        a.w.setAttribute('transform', `translate(${f(a.x)} ${f(sG(a.x))}) rotate(${f(180 + tilt)})`);
      }
      targetG.setAttribute('opacity', f((st.arrive > 0 ? 1 : 0) * (1 - easeInOut(seg(st.leave, 0.3, 1)))));
    };
    A.render = render;
    render();

    // region words
    S('text', { class: 't-caps', x: C.regionX, y: C.my - 12, text: 'Outside the cell', style: 'fill: var(--fg-3)' }, svg);
    S('text', { class: 't-caps', x: C.regionX, y: C.my + m + 22, text: 'Inside the T cell', style: 'fill: var(--fg-3)' }, svg);

    // part labels (static)
    const lx = C.labelX;
    const lab = S('g', { class: 'bc-labels' }, svg);
    const yZc = yZ0 + 0.04 * u + 0.22 * u;
    const parts = [
      { text: 'scFv', y: C.my - 0.84 * u, to: [C.cx + 0.2 * u, C.my - 0.86 * u] },
      { text: 'hinge', y: C.my - 0.36 * u, to: [C.cx + 0.08 * u, C.my - 0.36 * u] },
      { text: layoutName === 'compact' ? 'transmembrane' : 'transmembrane domain', y: C.my + m * 0.5 - 2, to: [C.cx + 0.08 * u, C.my + m * 0.5] },
      T.name ? { text: T.name, y: C.my + yC + 2, to: [C.cx + 0.14 * u, C.my + yC] } : null,
      { text: 'CD3ζ', y: C.my + yZc, to: [C.cx + 0.16 * u, C.my + yZc] },
    ].filter(Boolean);
    // keep label baselines ≥ 21 units apart (phones), pushing downward from the anchor label
    const gapMin = layoutName === 'compact' ? 24 : 21;
    for (let i = 3; i < parts.length; i++) parts[i].y = Math.max(parts[i].y, parts[i - 1].y + gapMin);
    for (let i = 2; i >= 1; i--) parts[i].y = Math.min(parts[i].y, parts[i + 1].y - gapMin);
    for (const q of parts) label(lab, { text: q.text, x: lx, y: q.y + 5, to: q.to });

    // chips + the paths the signals travel along
    const fx = S('g', { class: 'bc-fx' }, svg);
    A.fx = fx;
    const chipX = C.cx;
    A.chip1 = chip(fx, { x: chipX, y: C.chipY[0], text: 'Signal 1: activate', sign: true });
    A.chip2 = T.sig2
      ? chip(fx, { x: chipX, y: C.chipY[1], text: 'Signal 2: divide, and survive', sign: true })
      : chip(fx, { x: chipX, y: C.chipY[1], text: 'No signal 2', sign: false });
    const zBottom = C.my + yZ0 + 0.48 * u;
    A.path1 = S('path', { d: `M${f(C.cx)} ${f(zBottom - 0.12 * u)}L${f(C.cx)} ${f(C.chipY[0] - 15)}`, fill: 'none', stroke: 'none' }, fx);
    if (T.sig2) {
      const sx = C.cx - 0.14 * u, sy = C.my + yC;
      const ex = A.chip2.left + 16, ey = C.chipY[1] - 9;
      const bx = Math.min(sx - 0.55 * u, A.chip1.left - 14);
      A.path2 = S('path', { d: `M${f(sx)} ${f(sy)}C${f(bx)} ${f(sy + 6)} ${f(bx)} ${f(ey - 40)} ${f(ex)} ${f(ey)}`, fill: 'none', stroke: 'none' }, fx);
    }

    // headings and separators
    for (const hd of L.heads) S('text', { class: 't-caps t-halo', x: hd.x, y: hd.y, text: hd.text }, svg);
    if (L.divider) S('line', { x1: L.divider.x, x2: L.divider.x, y1: L.divider.y0, y2: L.divider.y1, style: 'stroke: var(--line); stroke-width: 1; stroke-dasharray: 2 5' }, svg);
    if (L.hline) {
      S('rect', { x: 0, y: L.hline.y, width: W, height: H - L.hline.y, style: 'fill: rgb(11 16 36 / 0.55)' }, svg);
      S('line', { x1: L.hline.x0, x2: L.hline.x1, y1: L.hline.y, y2: L.hline.y, style: 'stroke: var(--line); stroke-width: 1; stroke-dasharray: 2 5' }, svg);
    }

    // ---------- the cell panel
    const CL = L.cell;
    const scene = S('g', { class: 'bc-cells' }, svg);
    if (layoutName === 'wide') {
      const cp2 = S('clipPath', { id: `${clipId}-c` }, svg.defs);
      S('rect', { x: L.divider.x + 1, y: 0, width: W - L.divider.x, height: H }, cp2);
      scene.setAttribute('clip-path', `url(#${clipId}-c)`);
    } else {
      const cp2 = S('clipPath', { id: `${clipId}-c` }, svg.defs);
      S('rect', { x: 0, y: L.hline.y + 1, width: W, height: H - L.hline.y }, cp2);
      scene.setAttribute('clip-path', `url(#${clipId}-c)`);
    }
    A.target = CA.rig(cancerCell({ r: CL.tr, seed: 14, mhc: 0, antigens: { shape: 'circle', count: 7 }, stage: 'dark' }), { x: CL.from[0], y: CL.from[1], parent: scene, seed: 14 });
    A.killer = CA.rig(carTCell({ r: CL.r, state: 'activated', polarity: CL.polarity }), { x: CL.x, y: CL.y, parent: scene, seed: 21 });
    CA.unpolarize(A.killer, { angle: CL.polarity + 180 });
    CA.fxLayer(scene);
    A.scene = scene;
    A.outWord = S('text', { class: 't-small t-halo t-mid', x: CL.out[0], y: CL.out[1], 'text-anchor': 'middle', text: '', opacity: 0 }, scene);
    A.cellLabel = S('text', { class: 't-small t-halo t-mid', x: CL.x, y: CL.y + CL.r * 1.5 + 22, 'text-anchor': 'middle', text: 'CAR-T cell' }, scene);

    // ---------- meters
    buildMeters();
  }

  function ctxGlow(color) {
    return ctx.radialGradient(svg, [[0, mix(color, WHITE, 0.5), 0.95], [0.45, color, 0.45], [1, color, 0]]);
  }

  function buildMeters() {
    metersBox.replaceChildren();
    const spec = (title) => ({ mode: 'segments', count: 5, title, tone: 'benefit', tag: null, domain: [0, 1] });
    const TITLES = ['Kills on first contact', 'Still alive and working weeks later'];
    const ghostLabel = () => (ghost ? `Faint bars: last run, ${TAILS[ghost.tail].label}` : '');
    if (L.meters) {
      const M = L.meters;
      const g = S('g', { class: 'bc-meter-g', opacity: shownMeters ? 1 : 0 }, svg);
      A.meterG = g;
      // Ghosts (POLISH B8): the previous tail's result, drawn under the live meters at the same geometry.
      const gg = S('g', { class: 'bc-ghost', opacity: 0.4 }, g);
      A.gKill = meter(gg, { ...spec(TITLES[0]), x: M.x, y: M.y[0], width: M.w });
      A.gLive = meter(gg, { ...spec(TITLES[1]), x: M.x, y: M.y[1], width: M.w });
      A.mKill = meter(g, { ...spec(TITLES[0]), x: M.x, y: M.y[0], width: M.w });
      A.mLive = meter(g, { ...spec(TITLES[1]), x: M.x, y: M.y[1], width: M.w });
      // the time jump between the two meters, and what the faint bars are
      const by = M.y[1] + 66;
      A.jump = S('g', { opacity: 0 }, g);
      A.jump.append(ctx.iconSVG('clock', { x: M.x + 8, y: by - 4.5, size: 15, color: 'var(--fg-2)' }));
      S('text', { class: 't-small t-halo', x: M.x + 22, y: by, text: 'Weeks later', style: 'fill: var(--fg-2)' }, A.jump);
      A.ghostNote = S('text', { class: 't-small t-halo t-end', x: M.x + M.w, y: by, 'text-anchor': 'end', text: ghostLabel(), style: 'fill: var(--fg-3)' }, g);
      metersBox.classList.remove('is-on');
    } else {
      A.meterG = null;
      const w = Math.min(330, Math.max(240, (ctx.width || 360) - 8));
      const row = (title, tag) => {
        const r = ctx.h('div', { class: 'bc-mrow' });
        const gh = ctx.h('div', { class: 'bc-ghost' });
        r.append(gh);
        metersBox.append(r);
        // Phones: the meters sit below the stage, out of reach of its tag, so the first carries its own.
        return { g: meter(gh, { ...spec(title), tag, width: w }), m: meter(r, { ...spec(title), tag, width: w }) };
      };
      const r1 = row(TITLES[0], 'Illustrative');
      const r2 = row(TITLES[1], null);
      A.gKill = r1.g; A.mKill = r1.m; A.gLive = r2.g; A.mLive = r2.m;
      const note = ctx.h('p', { class: 'bc-mnote' });
      A.jump = ctx.h('span', { style: 'display:inline-flex;align-items:center;gap:6px' });
      const ic = ctx.svg('svg', { viewBox: '-10 -10 20 20', width: 15, height: 15, 'aria-hidden': 'true' });
      ic.append(ctx.iconSVG('clock', { x: 0, y: 0, size: 18, color: 'currentColor' }));
      A.jump.append(ic, document.createTextNode('Weeks later'));
      A.jump.style.opacity = '0';
      A.ghostNote = ctx.h('span', { text: ghostLabel() });
      note.append(A.jump, A.ghostNote);
      metersBox.append(note);
      metersBox.classList.toggle('is-on', shownMeters);
    }
    setGhost();
    if (lastResult) {
      A.mKill.set(lastResult.kill, { duration: 0 }); A.mLive.set(lastResult.persist, { duration: 0 });
      setJump(1);
    }
  }
  function setJump(o) {
    if (!A.jump) return;
    if (A.jump instanceof SVGElement) A.jump.setAttribute('opacity', String(o));
    else A.jump.style.opacity = String(o);
  }
  function setGhost() {
    if (!A.gKill) return;
    A.gKill.set(ghost ? ghost.kill : 0, { duration: 0 });
    A.gLive.set(ghost ? ghost.persist : 0, { duration: 0 });
    const txt = ghost ? `Faint bars: last run, ${TAILS[ghost.tail].label}` : '';
    A.ghostNote.textContent = txt;
  }

  // ------------------------------------------------------------------ the run
  function run() {
    draw();
    const T = TAILS[tailKey];
    const C = L.close, CL = L.cell;
    const u = A.u;
    const st = A.st;
    const t = gsap.timeline({ paused: true });
    tl = t;
    lastResult = null;
    A.mKill.set(0, { duration: 0 });
    A.mLive.set(0, { duration: 0 });
    setJump(0);
    // Paced for a payoff in about 5 s (POLISH B8): both signals, the kill and the two meters
    // overlap instead of queueing; the meters fill from the moment of contact.

    // beat 0: the target arrives (close-up surface + whole cell)
    CA.drive(t, (p) => { st.arrive = p; A.render(); }, { duration: 1.2, pos: 0 });
    CA.approach(t, A.target, A.killer, { gap: 2, angle: CL.angle, duration: 1.25, pos: 0, stretch: 0.03 });
    fadeOut(t, A.cellLabel, 0, 0.4);
    if (A.meterG && !shownMeters) fadeIn(t, A.meterG, 0.3, 0.5);

    // beat 1: the binder clamps one key; both membranes dimple; recognition at both scales; the
    // killer docks and turns its granules toward the contact while the signals arrive
    const b1 = 1.2;
    CA.drive(t, (p) => { st.clamp = p; A.render(); }, { duration: 0.7, pos: b1, ease: 'none' });
    const meetY = C.my - A.geo.dimple - 1.04 * u;
    CA.recognize(t, A.killer, { x: C.cx, y: meetY, angle: 90 }, { layer: A.fx, color: PALETTE.cd8, radius: 0.15 * u, badge: false, duration: 1.2, pos: b1 + 0.3 });
    CA.recognize(t, A.killer, A.target, { duration: 1.6, pos: b1 + 0.2, badgeSize: 14, hold: false });
    CA.dock(t, A.killer, A.target, { duration: 0.8, pos: b1 + 0.2 });
    CA.polarize(t, A.killer, A.target, { duration: 1.0, pos: b1 + 0.6 });

    // beat 2: CD3ζ ITAMs light in sequence → "+" travels into the cell → "Signal 1: go"
    const b2 = 1.8;
    A.itams.forEach((g, i) => fadeIn(t, g, b2 + i * 0.15, 0.3));
    CA.pulseAlong(t, A.path1, '+', { duration: 0.7, size: 16, layer: A.fx, pos: b2 + 0.45 });
    fadeIn(t, A.chip1.g, b2 + 0.95, 0.4);

    // beat 3: the costimulatory domain pulses → "Signal 2: divide, and survive" (or "No signal 2")
    const b3 = 2.5;
    if (A.costimRing) {
      fadeIn(t, A.costimRing, b3, 0.3);
      CA.drive(t, (p) => {
        const k = Math.sin(Math.PI * p);
        A.costimRingC.setAttribute('r', f(0.15 * u * (1 + 0.55 * k)));
        A.costimRingC.setAttribute('stroke-opacity', f(0.3 + 0.7 * (1 - p)));
      }, { duration: 0.8, pos: b3 });
      CA.pulseAlong(t, A.path2, '+', { duration: 0.8, size: 16, layer: A.fx, pos: b3 + 0.3 });
      fadeIn(t, A.chip2.g, b3 + 0.9, 0.4);
    } else {
      fadeIn(t, A.chip2.g, b3 + 0.2, 0.5);
    }

    // beat 4: the contact kill (rule 6 grammar; docked and aimed already), then divide — or dim and stop
    const k = CA.kill(t, A.killer, A.target, { duration: 1.6, pos: 2.6 });
    A.mKill.set(1, { tl: t, pos: b1 + 0.3, duration: k.marks.dying + 0.4 - (b1 + 0.3), ease: 'power1.inOut' });
    // the close-up: the dying cell lets go; the receptor is intact
    CA.drive(t, (p) => { st.leave = p; A.render(); }, { duration: 1.0, pos: k.marks.released });
    const after = k.marks.released + 0.3;
    const out = A.outWord;
    CA.move(t, A.target, { opacity: 0.3, duration: 2, pos: k.end, stretch: 0 });   // debris fades (a macrophage would clear it)
    // the weeks-later meter: labelled as a jump in time, filled right after the kill
    if (A.jump instanceof SVGElement) fadeIn(t, A.jump, after - 0.4, 0.4);
    else CA.drive(t, (p) => { A.jump.style.opacity = f(p); }, { duration: 0.4, pos: after - 0.4 });
    if (T.sig2) {
      out.textContent = 'Divides, keeps killing';
      const ds = CA.divide(t, A.killer, 2, { angle: Math.atan2(CL.d[1][1] - CL.d[0][1], CL.d[1][0] - CL.d[0][0]) * 180 / Math.PI, spread: CL.r * 1.25, duration: 1.3, pos: after });
      CA.move(t, ds[0], { x: CL.d[0][0], y: CL.d[0][1], duration: 1.8, pos: ds.span.end - 0.2, stretch: 0.05 });
      CA.move(t, ds[1], { x: CL.d[1][0], y: CL.d[1][1], duration: 1.8, pos: ds.span.end - 0.1, stretch: 0.05 });
      A.mLive.set(0.9, { tl: t, pos: after - 0.2, duration: 1.0 });
      fadeIn(t, out, ds.span.end + 0.2, 0.5);
      lastResult = { kill: 1, persist: 0.9 };
    } else {
      out.textContent = 'Fades after one kill';
      CA.move(t, A.killer, { x: CL.dim[0], y: CL.dim[1], opacity: 0.32, duration: 2.6, pos: after, ease: 'power3.out', stretch: 0.01 });
      A.mLive.set(0.1, { tl: t, pos: after - 0.2, duration: 0.8 });
      fadeIn(t, out, after + 0.8, 0.5);
      lastResult = { kill: 1, persist: 0.1 };
    }
    const result = lastResult;
    lastResult = null;

    t.eventCallback('onComplete', () => {
      lastResult = result;
      runs++;
      done.push({ tail: tailKey, ...result });
      if (!shownMeters) { shownMeters = true; if (!A.meterG) metersBox.classList.add('is-on'); }
      history.hidden = false;
      requestAnimationFrame(() => history.classList.add('is-on'));
      ctx.announce(T.sig2
        ? `With signal 1 and signal 2 (a ${T.name} costimulatory domain), the CAR-T cell killed its target, then divided into two cells that kept killing.`
        : 'With signal 1 only (CD3ζ), the CAR-T cell killed its target once, then dimmed and stopped.');
    });
    if (!A.meterG && !shownMeters) metersBox.classList.add('is-on');
    if (ctx.reducedMotion) t.progress(1);
    else if (paused) t.pause();
    else t.play();
  }

  // ------------------------------------------------------------------ controls
  ctx.ui.segmented({
    label: 'Which signaling domains?',
    options: [
      { value: 'z', label: TAILS.z.label },
      { value: 'cd28', label: TAILS.cd28.label },
      { value: 'bb', label: TAILS.bb.label },
    ],
    value: tailKey,
    onChange: (v) => {
      tailKey = v;
      lastResult = null;
      // the faint bars show the most recent finished run with a different tail
      ghost = [...done].reverse().find((d) => d.tail !== v) || null;
      draw();
      ctx.announce(`Signaling domains: ${TAILS[v].label}. ${TAILS[v].sig2 ? 'Signal 1 and signal 2.' : 'Signal 1 only.'} Press Meet a target cell.`);
    },
  });
  const runBtn = ctx.ui.button({ label: 'Meet a target cell', icon: 'play', variant: 'primary', onClick: run });
  runBtn.el.classList.add('bc-run');
  ctx.controls.after(metersBox);
  metersBox.after(history);

  draw();

  ctx.onResize(({ compact }) => {
    const next = compact ? 'compact' : 'wide';
    if (next === layoutName) return;
    layoutName = next;
    const keep = lastResult;
    draw();
    lastResult = keep;
    if (keep) buildMeters();
  });

  return {
    pause() { paused = true; if (tl) tl.pause(); },
    resume() { paused = false; if (tl && tl.progress() < 1) tl.resume(); },
    destroy() { if (tl) tl.kill(); metersBox.remove(); history.remove(); },
  };
}
