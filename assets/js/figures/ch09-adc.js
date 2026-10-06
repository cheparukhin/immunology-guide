// ch09-adc — "Anatomy of a guided missile" (Chapter 9, stepper, dark stage).
//
// Steps 1–4 zoom in on one HER2-rich cancer cell: bind → swallow → release → kill. Step 5 zooms
// out to a patch of seven cells (HER2-rich, HER2-low, no HER2) and reveals a T-DXd / T-DM1
// switch: T-DXd's payload crosses into TOUCHING neighbors (one HER2-negative cell next to a
// dying cell dies; the edge one survives); T-DM1's payload stays trapped in the first cell.
//
// Vocabulary (FIGURE-AUDIT §4): the ADC is the library antibody({ variant:'adc' }) (gold, white
// drug outline); payloads are the library `adc` hexagons; HER2 is antigen({ shape:'diamond' })
// on a stalk, capped by one arm tip with the Fc pointing away (rule 9); every death is the shared
// kill grammar's dying sequence (cell-actions die → setDying). Nothing flashes, nothing explodes.
//
// Seek safety: every moving part is rendered by a pure function of its step's progress
// (cell-actions drive), so Back, dot jumps and reduced motion land on identical frames.
import {
  antibody, antigen, antibodyTips, cancerCell, vesicle, dna, setDying, PALETTE, mix, shade,
} from '../art/index.js';
import { rig, die, drive } from './shared/cell-actions.js';

const ID = 'ch09-adc';
const DEG = Math.PI / 180;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
const seg = (p, a, b) => clamp((p - a) / (b - a || 1), 0, 1);
const io = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const out = (t) => 1 - Math.pow(1 - t, 3);
const f = (v) => (Math.round(v * 100) / 100).toString();

// ------------------------------------------------------------------ world geometry (close-up)
const HALF = 6.5;              // half-thickness of the drawn bilayer
const RV = 96;                 // radius of the swallowed bubble
const POCKET = 140;            // half-width of membrane that folds in
const MEM_X = 760;             // flat membrane extends to ±MEM_X
const HER2_SIZE = 60;
const ADC_SIZE = 104;
const HER2_X = [-690, -580, -470, -360, -250, -160, 160, 250, 340, 450, 560, 670, 780];
const LYSO = { x: 276, y: 300, r: 98 };
const SAC = { x: 194, y: 312, r: 136 };
const NUC = { x: 0, y: 832, rx: 600, ry: 300 };
const DNA_Y = 614;
const PAYLOAD_SPOTS = [[-1, -0.33], [1, -0.33], [-1, -0.16], [1, -0.16], [-1, -0.5], [1, -0.5], [-1, -0.04], [1, -0.04]];

const LAYOUTS = {
  wide: {
    vb: [960, 540], s: 1, a1x: 340, her2x: -160,
    pans: [[480, 300], [480, 140], [480, 78], [480, -118]],
    cell: { x: 480, y: 282, r: 148 }, focal: [480, 150],
    patch: { cx: 604, cy: 288, d: 116, r: 56, rot: 0 },
    inset: { x: 150, y: 150, r: 104, scrap: [268, 116, 'start'] },
    key: { x: 46, y: 352 }, legend: { x: 46, y: 452 },
    labels: {
      her2: [-300, -150], adc: [-150, -224], payload: [150, -236], cell: [-450, 74],
      bubble: [-150, 330], lyso: [420, 150], enzymes: [430, 440], dna: [250, 600], nucleus: [-440, 600],
    },
  },
  compact: {
    vb: [400, 560], s: 0.72, a1x: -160, her2x: 160,
    pans: [[150, 280], [150, 190], [150, 128], [150, 38]],
    cell: { x: 200, y: 296, r: 112 }, focal: [200, 184],
    patch: { cx: 200, cy: 372, d: 88, r: 42, rot: 0, mirror: true },
    inset: { x: 92, y: 124, r: 68, scrap: [166, 168, 'start'] },
    key: { x: 222, y: 86 }, legend: { x: 16, y: 482 }, reachDy: 22,
    labels: {
      her2: [196, -120], adc: [-56, -228], payload: [118, -196], cell: [-135, 42],
      bubble: [-130, 272, 'start'], lyso: [200, 70], enzymes: [-110, 350, 'start'], dna: [-110, 492, 'start'], nucleus: [-135, 424],
    },
  },
};

const STYLE = `
[data-figure="${ID}"] .adc-notes { margin: 0; font-family: var(--font-ui); font-size: var(--text-xs); color: var(--ink-3); }
[data-figure="${ID}"] .adc-notes p { margin: 0.35em 0 0; }
[data-figure="${ID}"] .adc-notes .adc-n5[hidden] { display: none; }
[data-figure="${ID}"] .adc-free { display: inline-flex; flex-wrap: wrap; align-items: center; gap: var(--s-2) var(--s-4); }
[data-figure="${ID}"] .adc-free[hidden] { display: none; }
`;

function injectStyle() {
  if (document.getElementById(`${ID}-style`)) return;
  const s = document.createElement('style');
  s.id = `${ID}-style`;
  s.textContent = STYLE;
  document.head.append(s);
}

// ------------------------------------------------------------------ geometry helpers

/** Pose that caps a glyph head with one antibody arm tip, Fc pointing away (= dockAntibody's math). */
function capPose(head, u, arm = 'right') {
  const tips = antibodyTips(u);
  const [tx, ty] = tips[arm];
  const hx = 0.035 * u * (arm === 'left' ? -1 : 1), hy = -0.485 * u;
  const alpha = Math.atan2(ty - hy, tx - hx) / DEG;
  const psi = head.angle + 180 - alpha;
  const c = Math.cos(psi * DEG), s = Math.sin(psi * DEG);
  return { x: head.x - (c * tx - s * ty), y: head.y - (s * tx + c * ty), r: psi };
}
const apply = (P, [x, y], k = 1) => {
  const c = Math.cos(P.r * DEG), s = Math.sin(P.r * DEG);
  return [P.x + (c * x - s * y) * k, P.y + (s * x + c * y) * k];
};
const poseStr = (P, k = 1) => `translate(${f(P.x)} ${f(P.y)}) rotate(${f(P.r)}) scale(${f(k)})`;
const lerpPose = (A, B, t) => ({ x: lerp(A.x, B.x, t), y: lerp(A.y, B.y, t), r: lerp(A.r, B.r, t) });
const payloadLocal = (i, u) => { const [s, y] = PAYLOAD_SPOTS[i]; return [s * 0.33 * u, y * u]; };

/** Membrane pocket keyframe: shoulders + an arc of the circle (c, R) cut at the neck height yN. */
function pocketKey({ c, R, yN }, M = 120) {
  const b0 = Math.acos(clamp((c - yN) / R, -1, 1));
  const w = R * Math.sin(b0);
  const N = [-w, yN];
  const T = [-Math.cos(b0), Math.sin(b0)];
  const dist = Math.hypot(N[0] + POCKET, N[1]);
  const k1 = 0.45 * (POCKET - w);
  const k2 = clamp(0.8 * w, 6, 0.45 * dist);
  const P0 = [-POCKET, 0], P1 = [-POCKET + k1, 0];
  const P2 = [N[0] - T[0] * k2, Math.max(0, N[1] - T[1] * k2)];
  const bez = (t) => {
    const u = 1 - t;
    return [0, 1].map((k) => u * u * u * P0[k] + 3 * u * u * t * P1[k] + 3 * u * t * t * P2[k] + t * t * t * N[k]);
  };
  const left = Array.from({ length: 31 }, (_, i) => bez(i / 30));
  const arc = [];
  for (let j = 1; j < 60; j++) {
    const b = b0 + ((2 * Math.PI - 2 * b0) * j) / 60;
    arc.push([-R * Math.sin(b), c - R * Math.cos(b)]);
  }
  const right = left.slice().reverse().map(([x, y]) => [-x, y]);
  const raw = [...left, ...arc, ...right];
  // resample by arc length
  const acc = [0];
  for (let i = 1; i < raw.length; i++) acc.push(acc[i - 1] + Math.hypot(raw[i][0] - raw[i - 1][0], raw[i][1] - raw[i - 1][1]));
  const L = acc[acc.length - 1];
  const pts = [];
  let k = 1;
  for (let i = 0; i < M; i++) {
    const t = (i / (M - 1)) * L;
    while (k < acc.length - 1 && acc[k] < t) k++;
    const a = raw[k - 1], b = raw[k];
    const q = (t - acc[k - 1]) / ((acc[k] - acc[k - 1]) || 1);
    pts.push([lerp(a[0], b[0], q), lerp(a[1], b[1], q)]);
  }
  return pts;
}
const K = {
  flat: pocketKey({ c: -399.5, R: 400, yN: 0 }),
  dimple: pocketKey({ c: -78, R: 128, yN: 0 }),
  cup: pocketKey({ c: 64, R: RV, yN: 64 }),
  omega: pocketKey({ c: 112, R: RV, yN: 26 }),
  neck: pocketKey({ c: 118, R: RV, yN: 22 }),
  scar: pocketKey({ c: -16, R: 36, yN: 0 }),
};
const FLAT_L = Array.from({ length: 22 }, (_, i) => [-MEM_X + (i * (MEM_X - POCKET)) / 22, 0]);
const FLAT_R = FLAT_L.map(([x, y]) => [-x, y]).reverse();
const lerpPts = (A, B, t) => A.map((a, i) => [lerp(a[0], B[i][0], t), lerp(a[1], B[i][1], t)]);
const PINCH = 0.72;            // fraction of step 2's morph at which the bubble pinches off
function membraneAt(p) {
  // p: 0 → 1 over the fold; after PINCH the membrane heals back to flat
  let pk;
  if (p < PINCH) {
    const q = p / PINCH;
    const keys = [K.flat, K.dimple, K.cup, K.omega, K.neck];
    const x = q * (keys.length - 1);
    const i = Math.min(keys.length - 2, Math.floor(x));
    pk = lerpPts(keys[i], keys[i + 1], io(x - i));
  } else {
    pk = lerpPts(K.scar, K.flat, out(seg(p, PINCH, 1)));
  }
  return [...FLAT_L, ...pk, ...FLAT_R];
}
const bottomOf = (pts) => pts[FLAT_L.length + 60][1];

function offsetPath(pts, off) {
  let d = '';
  for (let i = 0; i < pts.length; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
    let tx = b[0] - a[0], ty = b[1] - a[1];
    const l = Math.hypot(tx, ty) || 1;
    tx /= l; ty /= l;
    const x = pts[i][0] + ty * off, y = pts[i][1] - tx * off;
    d += `${i ? 'L' : 'M'}${f(x)} ${f(y)}`;
  }
  return d;
}

// ------------------------------------------------------------------ small glyphs

function payloadGlyph(u) {
  const ab = antibody({ variant: 'adc', dar: 1, size: u, stage: 'dark' });
  const p = ab.querySelector('[data-part="payload"]').cloneNode(true);
  p.removeAttribute('transform');
  return p;
}

/** T-DM1's linker never opens: draw each tether as a straight, solid line (local fallback). */
function stableLinkers(ab, u, dar) {
  const path = ab.querySelector('[data-part="linker"] path');
  if (!path) return;
  let d = '';
  for (let i = 0; i < dar; i++) {
    const [s, y] = PAYLOAD_SPOTS[i];
    d += `M${f(s * 0.12 * u)} ${f(y * u)}H${f(s * 0.27 * u)}`;
  }
  path.setAttribute('d', d);
  path.setAttribute('stroke-width', f(Math.max(1, u * 0.045)));
}

function enzymeGlyph(ctx, r, color) {
  const a = 0.62;
  return ctx.svg('path', {
    d: `M0 0L${f(r * Math.cos(a))} ${f(-r * Math.sin(a))}A${r} ${r} 0 1 0 ${f(r * Math.cos(a))} ${f(r * Math.sin(a))}Z`,
    fill: mix(color, '#FFFFFF', 0.35), stroke: mix(color, '#FFFFFF', 0.7), strokeWidth: 1,
  });
}

export default function mount(fig, ctx) {
  injectStyle();
  const { gsap } = ctx;
  ctx.setAspect(16 / 9, 5 / 7);
  const svg = ctx.createSVG({ viewBox: '0 0 960 540' });
  ctx.tag('Not to scale');
  ctx.tag('Illustrative');

  let layoutName = ctx.compact ? 'compact' : 'wide';
  let L = LAYOUTS[layoutName];
  let variant = 'tdxd';
  let E = {};

  const S = (tag, attrs, parent) => ctx.svg(tag, attrs, parent);
  // paints are created once (ids must not change between rebuilds)
  const cytoGrad = ctx.linearGradient(svg, [[0, PALETTE.cancer, 0.22], [0.35, PALETTE.cancer, 0.11], [1, PALETTE.cancer, 0.06]], { id: 'adc9-cyto', x1: '0%', y1: '0%', x2: '0%', y2: '100%' });
  const nucFill = ctx.radialGradient(svg, [[0, mix(PALETTE.cancer, '#0B1024', 0.84), 0.95], [0.8, mix(PALETTE.cancer, '#0B1024', 0.76), 0.92], [1, mix(PALETTE.cancer, '#0B1024', 0.64), 0.9]], { id: 'adc9-nuc', cy: '25%' });
  const T = (parent, x, y, text, cls = 't-label', anchor) => S('text', { x, y, class: `${cls} t-halo`, 'text-anchor': anchor, text }, parent);

  /** A label (opacity 0) in the label layer: text at world (tx, ty), leader to world (ax, ay). */
  function label(text, [tx, ty, anc], at, { cls = 't-label', anchor = 'middle' } = {}) {
    const s = L.s;
    const g = S('g', { opacity: 0 }, E.labelG);
    const X = tx, Y = ty;
    if (anc) anchor = anc;
    if (at) {
      const [ax, ay] = [at[0] * s, at[1] * s];
      const ly = Y + (ay > Y ? 7 : -18);
      const lx = anchor === 'start' ? X + 16 : anchor === 'end' ? X - 16 : X;
      const dx = ax - lx, dy = ay - ly, len = Math.hypot(dx, dy);
      if (len > 18) {
        S('line', { class: 'leader', x1: lx, y1: ly, x2: ax - (dx / len) * 5, y2: ay - (dy / len) * 5 }, g);
        S('circle', { class: 'leader-dot', cx: ax, cy: ay, r: 2.4 }, g);
      }
    }
    T(g, X, Y, text, cls, anchor);
    return g;
  }

  // ---------------------------------------------------------------- scene
  function reset() {
    for (const n of [...svg.children]) if (n !== svg.defs) n.remove();
    const [W, H] = L.vb;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    ctx.refreshTextScale();
    E = {};

    // ----- close-up world (steps 1–4)
    E.zoomG = S('g', null, svg);
    E.panG = S('g', { transform: `translate(${L.pans[0][0]} ${L.pans[0][1]})` }, E.zoomG);
    E.worldG = S('g', { transform: `scale(${L.s})` }, E.panG);
    E.labelG = S('g', null, E.panG);
    const w = E.worldG;

    E.cyto = S('path', { fill: cytoGrad }, w);
    // faint organelles for depth
    const ghosts = S('g', { opacity: 0.15 }, w);
    [[-420, 190, 30], [-250, 300, 20], [420, 330, 26], [560, 180, 18], [-560, 330, 22]].forEach(([x, y, r], k) => {
      const v = vesicle({ kind: 'endosome', r, seed: k + 2, stage: 'dark', color: mix(PALETTE.cancer, '#C9D3E8', 0.5) });
      v.setAttribute('transform', `translate(${x} ${y})`);
      ghosts.append(v);
    });
    // nucleus with the DNA strand that will break
    S('ellipse', { cx: NUC.x, cy: NUC.y, rx: NUC.rx, ry: NUC.ry, fill: nucFill, stroke: mix(PALETTE.cancer, '#FFFFFF', 0.32), strokeOpacity: 0.55, strokeWidth: 1.8 }, w);
    S('ellipse', { cx: NUC.x, cy: NUC.y, rx: NUC.rx - 7, ry: NUC.ry - 7, fill: 'none', stroke: mix(PALETTE.cancer, '#FFFFFF', 0.3), strokeOpacity: 0.25, strokeWidth: 1, strokeDasharray: '2 6' }, w);
    E.dnaL = S('g', { transform: 'translate(-50 0) rotate(0)' }, S('g', { transform: `translate(0 ${DNA_Y})` }, w));
    E.dnaR = S('g', { transform: 'translate(50 0) rotate(0)' }, E.dnaL.parentNode);
    E.dnaL.append(dna({ sequence: 'GATTACAG', rise: 11, width: 26, stage: 'dark' }));
    E.dnaR.append(dna({ sequence: 'CTGACCTA', rise: 11, width: 26, stage: 'dark' }));
    for (const [g, sx] of [[E.dnaL, 1], [E.dnaR, -1]]) {
      // jagged broken end, hidden until the break
      g.brk = S('path', { d: `M${sx * 44} -13 l${sx * 3} 5 l${-sx * 4} 5 l${sx * 4} 6 l${-sx * 3} 5 l${sx * 3} 5`, stroke: PALETTE.foreignPeptide, strokeWidth: 2.2, fill: 'none', strokeLinejoin: 'round', opacity: 0 }, g);
    }

    // lysosome (+ the merged sac that replaces it after fusion)
    E.lyso = vesicle({ kind: 'lysosome', r: LYSO.r, seed: 4, stage: 'dark' });
    E.lyso.setAttribute('transform', `translate(${LYSO.x} ${LYSO.y})`);
    w.append(E.lyso);
    const acid = mix('#C3A6D9', '#FFB09A', 0.45);
    E.sac = S('g', { transform: `translate(${SAC.x} ${SAC.y})`, opacity: 0 }, w);
    E.sac.append(vesicle({ kind: 'lysosome', r: SAC.r, seed: 7, stage: 'dark', color: acid }));
    E.enzymes = [[-72, -54], [66, -74], [-84, 46], [76, 56], [0, 94], [-12, -96]].map(([x, y], i) => {
      const g = S('g', { transform: `translate(${x} ${y}) rotate(${i * 60})` }, E.sac);
      g.append(enzymeGlyph(ctx, 10, acid));
      g.home = [x, y];
      return g;
    });

    // the swallowed bubble (drawn like the plasma membrane)
    E.bubble = S('g', { opacity: 0, transform: 'translate(0 118)' }, w);
    S('circle', { r: RV, fill: '#101733', fillOpacity: 0.92 }, E.bubble);
    const memCore = mix(shade(PALETTE.cancer, 0.6), '#0B1024', 0.3);
    const memHead = mix(PALETTE.cancer, '#FFFFFF', 0.35);
    S('circle', { r: RV, fill: 'none', stroke: memCore, strokeWidth: HALF * 2 }, E.bubble);
    for (const o of [-4.6, 4.6]) S('circle', { r: RV + o, fill: 'none', stroke: memHead, strokeWidth: 3.4, strokeDasharray: '0 4.8', strokeLinecap: 'round' }, E.bubble);

    // plasma membrane
    E.memBand = S('path', { fill: 'none', stroke: memCore, strokeWidth: HALF * 2, strokeLinejoin: 'round' }, w);
    E.memOut = S('path', { fill: 'none', stroke: memHead, strokeWidth: 3.4, strokeDasharray: '0 4.8', strokeLinecap: 'round' }, w);
    E.memIn = S('path', { fill: 'none', stroke: memHead, strokeWidth: 3.4, strokeDasharray: '0 4.8', strokeLinecap: 'round' }, w);
    setMembrane(membraneAt(0));

    // HER2 on the surface
    const her2 = (x, y = -HALF) => {
      const g = antigen({ shape: 'diamond', size: HER2_SIZE, stage: 'dark' });
      g.setAttribute('transform', `translate(${x} ${y})`);
      return g;
    };
    HER2_X.forEach((x) => w.append(her2(x)));

    // the complex that gets swallowed: HER2 + the ADC that caps it
    E.complex = S('g', { transform: `translate(0 ${-HALF})` }, w);
    E.complex.append(her2(0, 0));
    const head0 = { x: 0, y: -0.99 * HER2_SIZE, angle: -90 };
    E.p0 = capPose(head0, ADC_SIZE, 'right');
    E.a0 = S('g', { opacity: 0 }, E.complex);
    E.a0Art = antibody({ variant: 'adc', dar: 8, size: ADC_SIZE, stage: 'dark' });
    E.a0.append(E.a0Art);
    E.a0Payloads = E.a0Art.querySelector('[data-part="payloads"]');
    E.a0Linker = E.a0Art.querySelector('[data-part="linker"]');
    // a second ADC binds nearby and stays on the surface
    E.p1 = capPose({ x: L.a1x, y: -HALF - 0.99 * HER2_SIZE, angle: -90 }, ADC_SIZE, 'left');
    E.a1 = S('g', { opacity: 0 }, w);
    E.a1.append(antibody({ variant: 'adc', dar: 8, size: ADC_SIZE, stage: 'dark' }));
    // ADCs that drift past and never bind
    E.passers = [0, 1, 2].map(() => {
      const g = S('g', { opacity: 0 }, w);
      g.append(antibody({ variant: 'adc', dar: 8, size: ADC_SIZE * 0.92, stage: 'dark' }));
      return g;
    });

    // free payload (clones of the ADC's own hexagons)
    E.free = Array.from({ length: 8 }, () => {
      const g = S('g', { opacity: 0 }, w);
      g.append(payloadGlyph(ADC_SIZE));
      return g;
    });

    // labels (world positions per layout)
    const lb = L.labels;
    E.lab = {
      cell: label('Cancer cell', lb.cell, null, { cls: 't-caps', anchor: 'start' }),
      her2: label('HER2', lb.her2, [L.her2x, -HALF - HER2_SIZE * 0.75]),
      adc: label('ADC', lb.adc, apply(E.p0, [0, -0.3 * ADC_SIZE]).map((v, i) => v + (i ? -HALF : 0))),
      payload: label('payload', lb.payload, apply(E.p0, payloadLocal(1, ADC_SIZE)).map((v, i) => v + (i ? -HALF : 0))),
      bubble: label('endosome', lb.bubble, [BUB_END[0] - RV * 0.86, BUB_END[1] + RV * 0.45]),
      lyso: label('lysosome', lb.lyso, [SAC.x + SAC.r * 0.72, SAC.y - SAC.r * 0.7]),
      enzymes: label('proteases', lb.enzymes, [SAC.x + 12, SAC.y + 94]),
      dna: label('DNA', lb.dna, [74, DNA_Y + 10]),
      nucleus: label('Nucleus', lb.nucleus, null, { cls: 't-caps', anchor: 'start' }),
    };
    E.lab.cell.setAttribute('opacity', 1);
    E.lab.nucleus.setAttribute('opacity', 1);

    // ----- whole-cell view (end of step 4)
    E.cellZoom = S('g', { opacity: 0 }, svg);
    const C = L.cell;
    const art = cancerCell({ r: C.r, seed: 21, stage: 'dark', mhc: 0, antigens: { shape: 'diamond', count: 18 } });
    // a few ADCs still bound on the surface (they fade with the cell)
    const abLayer = S('g', { 'data-part': 'antibodies' });
    const glyphs = [...art.querySelectorAll('[data-part="antigens"] > *')];
    const sizeA = clamp(C.r * 0.25, 5, 18) * 0.95;
    const uSmall = 34;
    [2, 6, 11, 15].forEach((gi) => {
      const g = glyphs[gi % glyphs.length];
      if (!g) return;
      const m = g.transform.baseVal.consolidate()?.matrix;
      const ang = Number(g.getAttribute('data-angle'));
      const h = { x: m.e + Math.cos(ang * DEG) * sizeA, y: m.f + Math.sin(ang * DEG) * sizeA, angle: ang };
      const ab = antibody({ variant: 'adc', dar: 8, size: uSmall, stage: 'dark' });
      ab.setAttribute('transform', poseStr(capPose(h, uSmall, 'right')));
      abLayer.append(ab);
    });
    art.append(abLayer);
    // payload already loose inside the cell
    const inner = S('g', { 'data-part': 'cytoplasm' });
    [[-40, -30], [30, -46], [52, 20], [-20, 48], [-58, 12], [12, 6]].forEach(([x, y]) => {
      const p = payloadGlyph(ADC_SIZE);
      p.setAttribute('transform', `translate(${f(x * C.r / 148)} ${f(y * C.r / 148)})`);
      inner.append(p);
    });
    art.append(inner);
    E.cellRig = rig(art, { x: C.x, y: C.y, parent: E.cellZoom });

    // ----- patch (step 5)
    buildPatch();
  }

  function setMembrane(pts) {
    const mid = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${f(x)} ${f(y)}`).join('');
    E.memBand.setAttribute('d', mid);
    E.memOut.setAttribute('d', offsetPath(pts, 4.6));
    E.memIn.setAttribute('d', offsetPath(pts, -4.6));
    E.cyto.setAttribute('d', `${mid}L${MEM_X} 1200L${-MEM_X} 1200Z`);
  }

  // ---------------------------------------------------------------- patch (step 5)
  const KINDS = { rich: 12, poor: 3, zero: 0 };
  const PATCH = [
    { id: 'R1', q: [-0.5, -0.866], kind: 'rich', seed: 31 },
    { id: 'P1', q: [0.5, -0.866], kind: 'poor', seed: 32 },
    { id: 'R2', q: [-1, 0], kind: 'rich', seed: 33 },
    { id: 'R3', q: [0, 0], kind: 'rich', seed: 34 },
    { id: 'Z1', q: [1, 0], kind: 'zero', seed: 35 },
    { id: 'P2', q: [-0.5, 0.866], kind: 'poor', seed: 36 },
    { id: 'Z2', q: [1.5, 0.866], kind: 'zero', seed: 37 },
  ];
  const PLAN = {
    tdxd: {
      dar: 8, stable: false,
      adcs: { R1: 3, R2: 3, R3: 3, P1: 1, P2: 1 },
      hex: { R1: 6, R2: 6, R3: 6, P1: 3, P2: 3 },
      moves: [['R3', 'Z1'], ['R3', 'Z1'], ['R3', 'Z1'], ['P1', 'Z1'], ['R1', 'P1'], ['R2', 'P2'], ['R3', 'P2']],
      deaths: { R3: 7.0, R1: 7.3, R2: 7.6, P1: 8.0, P2: 8.3, Z1: 9.4 },
    },
    tdm1: {
      dar: 4, stable: true,
      adcs: { R1: 3, R2: 3, R3: 3, P1: 1 },
      hex: { R1: 5, R2: 5, R3: 5, P1: 2 },
      moves: [],
      deaths: { R3: 7.6, R1: 7.9, R2: 8.2 },
    },
  };
  const SCEN = 11.5;             // scenario length (s) after the patch appears

  function buildPatch() {
    const P = L.patch;
    const plan = PLAN[variant];
    const R = ctx.random(variant === 'tdxd' ? 5 : 6);
    E.patchZoom = S('g', { opacity: 0 }, svg);
    const pg = S('g', { transform: `translate(${P.cx} ${P.cy})` }, E.patchZoom);
    E.patchG = pg;
    const rot = P.rot * DEG;
    const at = ([qx0, qy0]) => {
      const [qx, qy] = P.mirror ? [qy0, qx0] : [qx0, qy0];
      return [P.d * (qx * Math.cos(rot) - qy * Math.sin(rot)), P.d * (qx * Math.sin(rot) + qy * Math.cos(rot))];
    };
    // centre the cluster
    const all = PATCH.map((c) => at(c.q));
    const cx0 = (Math.min(...all.map((a) => a[0])) + Math.max(...all.map((a) => a[0]))) / 2;
    const cy0 = (Math.min(...all.map((a) => a[1])) + Math.max(...all.map((a) => a[1]))) / 2;
    const cells = {};
    const cellLayer = S('g', null, pg);
    const adcLayer = S('g', null, pg);
    const hexLayer = S('g', null, pg);
    const overLayer = S('g', null, pg);
    PATCH.forEach((c) => {
      const [x, y] = at(c.q);
      const art = cancerCell({ r: P.r, seed: c.seed, stage: 'dark', mhc: 0, nuclei: 1, ...(KINDS[c.kind] ? { antigens: { shape: 'diamond', count: KINDS[c.kind] } } : {}) });
      const wrap = S('g', null, cellLayer);     // dimmed once the cell is dead
      const rg = rig(art, { x: x - cx0, y: y - cy0, parent: wrap });
      // seed each cell's apoptotic layout so the dead don't all look alike
      setDying(art, 1e-4, { seed: c.seed * 7 + 3 });
      setDying(art, 0);
      cells[c.id] = { ...c, rig: rg, x: x - cx0, y: y - cy0, art, wrap };
      if (c.kind === 'zero') {
        // "0" badge: no HER2 at all
        const b = S('g', { transform: `translate(${f(x - cx0 + P.r * 0.64)} ${f(y - cy0 - P.r * 0.64)})` }, overLayer);
        S('circle', { r: 11, fill: '#1A2142', stroke: '#C9D3F0', strokeWidth: 1.4 }, b);
        S('text', { x: 0, y: 4.6, 'text-anchor': 'middle', style: 'font: 700 13px var(--font-ui); fill: #E9EDF7', text: '0' }, b);
        cells[c.id].badge = b;
      }
    });
    E.cells = cells;
    const ids = Object.keys(cells);
    const touching = (a, b) => Math.hypot(cells[a].x - cells[b].x, cells[a].y - cells[b].y) < P.d * 1.05;
    const sizeA = clamp(P.r * 0.25, 5, 18) * 0.95;
    const uA = Math.round(P.r * 0.5);

    // ADCs: pick the most exposed HER2 heads, drift in along their outward normal, bind, sink in
    E.padcs = [];
    for (const [id, n] of Object.entries(plan.adcs)) {
      const c = cells[id];
      const glyphs = [...c.art.querySelectorAll('[data-part="antigens"] > *')].map((g) => {
        const m = g.transform.baseVal.consolidate()?.matrix;
        const ang = Number(g.getAttribute('data-angle'));
        const hx = c.x + m.e + Math.cos(ang * DEG) * sizeA, hy = c.y + m.f + Math.sin(ang * DEG) * sizeA;
        const open = Math.min(...ids.filter((o) => o !== id).map((o) => Math.hypot(hx - cells[o].x, hy - cells[o].y) - P.r));
        return { ang, hx, hy, open, bx: c.x + m.e, by: c.y + m.f };
      }).sort((a, b) => b.open - a.open);
      const chosen = [];
      for (const g of glyphs) {
        if (chosen.length >= n) break;
        if (chosen.every((h) => Math.abs(((h.ang - g.ang + 540) % 360) - 180) > 40)) chosen.push(g);
      }
      chosen.forEach((g, k) => {
        const end = capPose({ x: g.hx, y: g.hy, angle: g.ang }, uA, 'right');
        const nx = Math.cos(g.ang * DEG), ny = Math.sin(g.ang * DEG);
        const start = { x: end.x + nx * 230 - ny * 70, y: end.y + ny * 230 + nx * 70, r: end.r - 35 };
        const sunk = { x: end.x - nx * uA * 0.75, y: end.y - ny * uA * 0.75, r: end.r };
        const grp = S('g', { opacity: 0 }, adcLayer);
        const ab = antibody({ variant: 'adc', dar: plan.dar, size: uA, stage: 'dark' });
        if (plan.stable) stableLinkers(ab, uA, plan.dar);
        grp.append(ab);
        E.padcs.push({ g: grp, start, end, sunk, t0: 0.4 + E.padcs.length * 0.16 + R() * 0.2, cell: id, entry: [g.bx - nx * 6, g.by - ny * 6] });
      });
    }

    // hexagons: released inside each loaded cell, wander, and (T-DXd) cross into touching cells
    E.phex = [];
    const inside = (c, k = 0.5) => { const a = R() * Math.PI * 2, rr = Math.sqrt(R()) * P.r * k; return [c.x + Math.cos(a) * rr, c.y + Math.sin(a) * rr]; };
    for (const [id, n] of Object.entries(plan.hex)) {
      const c = cells[id];
      const entries = E.padcs.filter((a) => a.cell === id);
      for (let k = 0; k < n; k++) {
        const ent = entries[k % entries.length];
        const tA = 4.4 + R() * 0.6;
        let path;
        if (plan.stable) {
          // trapped: drift to the inner face of the membrane, bump, and stay
          const a = R() * Math.PI * 2;
          const p1 = [c.x + Math.cos(a) * P.r * 0.82, c.y + Math.sin(a) * P.r * 0.82];
          const p2 = [c.x + Math.cos(a) * P.r * 0.7, c.y + Math.sin(a) * P.r * 0.7];
          path = [[tA, ...ent.entry], [tA + 1.6, ...p1], [tA + 2.1, ...p2]];
        } else {
          path = [[tA, ...ent.entry], [tA + 1.5, ...inside(c)]];
        }
        E.phex.push({ path, fadeIn: tA, die: plan.deaths[id] ?? null, src: id });
      }
    }
    plan.moves.forEach(([a, b], i) => {
      if (!touching(a, b)) return;
      const A = cells[a], B = cells[b];
      const dx = B.x - A.x, dy = B.y - A.y, l = Math.hypot(dx, dy);
      const ux = dx / l, uy = dy / l, px = -uy, py = ux;
      const off = (i % 3 - 1) * P.r * 0.28;
      const s0 = [A.x + ux * P.r * 0.35 + px * off, A.y + uy * P.r * 0.35 + py * off];
      const s1 = [B.x - ux * P.r * 0.3 + px * off * 0.8 + (R() - 0.5) * 12, B.y - uy * P.r * 0.3 + py * off * 0.8 + (R() - 0.5) * 12];
      const t0 = 5.9 + i * 0.22;
      E.phex.push({ path: [[t0 - 0.4, ...s0], [t0, ...s0], [t0 + 1.7, ...s1]], fadeIn: t0 - 0.4, die: plan.deaths[b] ?? null, src: a });
    });
    E.phex.forEach((h) => {
      h.g = S('g', { opacity: 0 }, hexLayer);
      h.g.append(payloadGlyph(48));
    });

    // labels, key, legend
    const z2 = cells.Z2;
    E.reach = S('g', { opacity: 0 }, overLayer);
    {
      const ty = z2.y + P.r + (L.reachDy ?? 30);
      T(E.reach, z2.x, ty, 'out of reach', 't-label', 'middle');
    }
    E.pkey = S('g', { transform: `translate(${L.key.x} ${L.key.y})` }, E.patchZoom);
    const keyAb = antibody({ variant: 'adc', dar: plan.dar, size: 46, stage: 'dark', anchor: 'center' });
    if (plan.stable) stableLinkers(keyAb, 46, plan.dar);
    keyAb.setAttribute('transform', 'translate(22 0)');
    E.pkey.append(keyAb);
    T(E.pkey, 60, -4, variant === 'tdxd' ? 'T-DXd' : 'T-DM1', 't-label', 'start');
    T(E.pkey, 60, 15, variant === 'tdxd' ? '8 payloads' : '≈3.5 on average', 't-small', 'start');
    const lg = S('g', { transform: `translate(${L.legend.x} ${L.legend.y})` }, E.patchZoom);
    const dia = antigen({ shape: 'diamond', size: 22, stage: 'dark' });
    dia.setAttribute('transform', 'translate(10 9)');
    lg.append(dia);
    T(lg, 30, 4, 'HER2', 't-small', 'start');
    const zb = S('g', { transform: 'translate(10 30)' }, lg);
    S('circle', { r: 10, fill: '#1A2142', stroke: '#C9D3F0', strokeWidth: 1.3 }, zb);
    S('text', { x: 0, y: 4.4, 'text-anchor': 'middle', style: 'font: 700 12px var(--font-ui); fill: #E9EDF7', text: '0' }, zb);
    T(lg, 30, 35, 'no HER2', 't-small', 'start');

    // T-DM1 inset: inside a lysosome, the antibody is digested; payload keeps a charged scrap
    E.inset = null;
    if (variant === 'tdm1') buildInset();
  }

  function buildInset() {
    const I = L.inset;
    const g = S('g', { opacity: 0, transform: `translate(${I.x} ${I.y})` }, E.patchZoom);
    const clipId = 'adc9-clip';
    let cp = svg.defs.querySelector(`#${clipId}`);
    if (!cp) cp = S('clipPath', { id: clipId }, svg.defs);
    cp.replaceChildren();
    S('circle', { r: I.r }, cp);
    S('circle', { r: I.r + 3, fill: '#0B1024', fillOpacity: 0.94, stroke: '#C9D3F0', strokeOpacity: 0.55, strokeWidth: 1.5 }, g);
    const inner = S('g', { 'clip-path': `url(#${clipId})` }, g);
    const acid = mix('#C3A6D9', '#FFB09A', 0.45);
    const sac = vesicle({ kind: 'endosome', r: I.r * 0.86, seed: 9, stage: 'dark', color: acid });
    inner.append(sac);
    [[-0.5, -0.32], [0.52, 0.18], [-0.42, 0.5], [0.3, -0.58]].forEach(([x, y], i) => {
      const e = S('g', { transform: `translate(${f(x * I.r)} ${f(y * I.r)}) rotate(${i * 80})`, opacity: 0.85 }, inner);
      e.append(enzymeGlyph(ctx, I.r * 0.075, acid));
    });
    const u = I.r * 0.8;
    const abG = S('g', { transform: `translate(0 ${f(u * 0.5)})` }, inner);
    const ab = antibody({ variant: 'adc', dar: 4, size: u, stage: 'dark' });
    stableLinkers(ab, u, 4);
    abG.append(ab);
    const body = [...ab.children].filter((c) => !['linker', 'payloads'].includes(c.getAttribute('data-part')));
    // digested fragments of the antibody
    const frags = [[-0.2, -0.75], [0.22, -0.8], [-0.05, -0.5], [0.08, -0.22], [-0.3, -0.4], [0.3, -0.45]].map(([x, y], i) => {
      const fr = S('rect', { x: -4, y: -2, width: 8, height: 4, rx: 2, fill: mix(PALETTE.antibody, '#0B1024', 0.2), opacity: 0, transform: `translate(${f(x * u)} ${f(y * u)}) rotate(${i * 37})` }, abG);
      fr.home = [x * u, y * u];
      return fr;
    });
    // payload with its charged scrap of linker
    const scraps = [0, 1, 2, 3].map((i) => {
      const [px, py] = payloadLocal(i, u);
      const s = PAYLOAD_SPOTS[i][0];
      const sg = S('g', { opacity: 0, transform: `translate(${f(px)} ${f(py)})` }, abG);
      S('path', { d: `M${f(-s * 0.16 * u)} 0H0`, stroke: PALETTE.linker, strokeWidth: 2.4, strokeLinecap: 'round' }, sg);
      sg.append(payloadGlyph(u));
      S('text', { x: f(-s * 0.16 * u), y: -5, 'text-anchor': 'middle', style: `font: 700 12px var(--font-ui); fill: ${PALETTE.linker}`, text: '+' }, sg);
      sg.home = [px, py];
      sg.side = s;
      return sg;
    });
    T(g, 0, I.r + 24, 'T-DM1 in a lysosome', 't-small', 'middle');
    const sl = S('g', { opacity: 0 }, g);
    {
      const sc = scraps[1];                       // a right-hand scrap, at its final spot
      const ax = sc.home[0] + sc.side * 10 - sc.side * 0.16 * u, ay = sc.home[1] - 4 + u * 0.5;
      const [tx, ty, anchor] = I.scrap;
      const X = tx - I.x, Y = ty - I.y;
      const lx = anchor === 'start' ? X + 20 : X;
      const ly = Y + (ay > Y ? 7 : -17);
      S('line', { class: 'leader', x1: lx, y1: ly, x2: ax, y2: ay }, sl);
      S('circle', { class: 'leader-dot', cx: ax, cy: ay, r: 2.2 }, sl);
      T(sl, X, Y, 'charged linker fragment', 't-small', anchor);
    }
    E.inset = { g, body, frags, scraps, scrapLabel: sl, payloads: ab.querySelector('[data-part="payloads"]'), linker: ab.querySelector('[data-part="linker"]') };
  }

  // ---------------------------------------------------------------- steps
  const show = (tl, node, pos, d = 0.5) => tl.fromTo(node, { opacity: 0 }, { opacity: 1, duration: d, ease: 'power1.out' }, pos);
  const hide = (tl, node, pos, d = 0.4) => tl.fromTo(node, { opacity: 1 }, { opacity: 0, duration: d, ease: 'power1.in' }, pos);
  const pan = (tl, from, to, pos, d) => tl.fromTo(E.panG, { attr: { transform: `translate(${from[0]} ${from[1]})` } }, { attr: { transform: `translate(${to[0]} ${to[1]})` }, duration: d, ease: 'so.inOut' }, pos);

  // complex position (HER2 anchor) over the story
  const BUB_START = [0, 118];
  const BUB_END = [72, 292];
  const BUB_TOUCH = [124, 310];
  const SAC_ANCHOR = [SAC.x - 26, SAC.y + SAC.r * 0.86];
  const DNA_SPOTS = [[-16, -20], [8, -24], [-4, 22], [16, 18], [-24, 4], [24, -2], [-10, -2], [10, 6]].map(([x, y]) => [x, DNA_Y + y]);

  function freeStart(i) {
    // world position of A0's payload i once the complex sits in the sac
    const [x, y] = apply(E.p0, payloadLocal(i, ADC_SIZE));
    return [x + SAC_ANCHOR[0], y + SAC_ANCHOR[1]];
  }
  const SAC_SPOTS = [[-56, -44], [38, -68], [72, -10], [-78, 20], [-20, 58], [50, 48], [4, -92], [-44, -84]].map(([x, y]) => [SAC.x + x, SAC.y + y - 26]);

  const steps = [
    { // 1 · Bind
      enter(tl) {
        show(tl, E.lab.her2, 0.3);
        E.passers.forEach((g, i) => {
          const y0 = [-230, -300, -170][i], y1 = [-260, -210, -235][i];
          const A = { x: -900, y: y0, r: -30 + i * 20 }, B = { x: 900, y: y1, r: 25 - i * 15 };
          drive(tl, (p) => {
            g.setAttribute('transform', poseStr(lerpPose(A, B, p)));
            g.setAttribute('opacity', f(Math.min(seg(p, 0, 0.12), 1 - seg(p, 0.88, 1))));
          }, { duration: 5.2, pos: [0, 0.6, 1.3][i] });
        });
        const F0 = { x: -520, y: -250, r: E.p0.r - 70 };
        drive(tl, (p) => {
          const q = out(p);
          E.a0.setAttribute('transform', poseStr(lerpPose(F0, E.p0, q)));
          E.a0.setAttribute('opacity', f(seg(p, 0, 0.25)));
        }, { duration: 3.2, pos: 0.2 });
        const F1 = { x: -140, y: -330, r: E.p1.r + 60 };
        drive(tl, (p) => {
          E.a1.setAttribute('transform', poseStr(lerpPose(F1, E.p1, out(p))));
          E.a1.setAttribute('opacity', f(seg(p, 0, 0.25)));
        }, { duration: 3.4, pos: 1.0 });
        show(tl, E.lab.adc, 3.3);
        show(tl, E.lab.payload, 3.7);
      },
    },
    { // 2 · Swallow
      enter(tl) {
        hide(tl, E.lab.her2, 0);
        hide(tl, E.lab.adc, 0);
        hide(tl, E.lab.payload, 0);
        drive(tl, (p) => {
          const pm = seg(p, 0, 0.7);                 // fold + pinch
          const pts = membraneAt(pm);
          setMembrane(pts);
          const pinched = pm >= PINCH;
          const q = io(seg(p, 0.74, 1));             // bubble drifts inward
          const bx = lerp(BUB_START[0], BUB_END[0], q), by = lerp(BUB_START[1], BUB_END[1], q);
          E.bubble.setAttribute('opacity', pinched ? 1 : 0);
          E.bubble.setAttribute('transform', `translate(${f(bx)} ${f(by)})`);
          const cy = pinched ? by + RV - HALF : bottomOf(pts) - HALF;
          const cx = pinched ? bx : 0;
          E.complex.setAttribute('transform', `translate(${f(cx)} ${f(cy)})`);
        }, { duration: 5.4, pos: 0.2 });
        pan(tl, L.pans[0], L.pans[1], 0.4, 4.8);
        show(tl, E.lab.bubble, 5.0);
      },
    },
    { // 3 · Release
      enter(tl) {
        hide(tl, E.lab.bubble, 0);
        pan(tl, L.pans[1], L.pans[2], 0, 1.8);
        show(tl, E.lab.lyso, 0.6);
        drive(tl, (p) => {
          const a = io(seg(p, 0.03, 0.25));           // bubble meets the lysosome
          const bx = lerp(BUB_END[0], BUB_TOUCH[0], a), by = lerp(BUB_END[1], BUB_TOUCH[1], a);
          const fuse = io(seg(p, 0.25, 0.42));        // the two merge into one sac
          E.bubble.setAttribute('transform', `translate(${f(bx)} ${f(by)})`);
          E.bubble.setAttribute('opacity', f(1 - fuse));
          E.lyso.setAttribute('opacity', f(1 - fuse));
          E.sac.setAttribute('opacity', f(fuse));
          const c0 = [bx, by + RV - HALF];
          E.complex.setAttribute('transform', `translate(${f(lerp(c0[0], SAC_ANCHOR[0], fuse))} ${f(lerp(c0[1], SAC_ANCHOR[1], fuse))})`);
          // enzymes close in on the linkers, which snap
          const e = io(seg(p, 0.45, 0.62));
          E.enzymes.forEach((g, i) => {
            const [hx, hy] = g.home;
            const tgt = i < 4 ? freeStart(i * 2) : [SAC.x + hx, SAC.y + hy];
            const x = lerp(hx, tgt[0] - SAC.x + (i % 2 ? 9 : -9), i < 4 ? e : 0);
            const y = lerp(hy, tgt[1] - SAC.y + 6, i < 4 ? e : 0);
            g.setAttribute('transform', `translate(${f(x)} ${f(y)}) rotate(${i * 60 + e * 40})`);
          });
          const snap = seg(p, 0.64, 0.7);
          E.a0Linker.setAttribute('opacity', f(1 - snap));
          E.a0Payloads.setAttribute('opacity', f(1 - snap));
          const drift = io(seg(p, 0.66, 1));
          E.free.forEach((g, i) => {
            const [sx, sy] = freeStart(i);
            const [ex, ey] = SAC_SPOTS[i];
            g.setAttribute('transform', `translate(${f(lerp(sx, ex, drift))} ${f(lerp(sy, ey, drift))})`);
            g.setAttribute('opacity', f(snap));
          });
          // the spent antibody fades back
          E.a0.setAttribute('opacity', f(1 - 0.55 * drift));
        }, { duration: 6.2, pos: 0.1 });
        show(tl, E.lab.enzymes, 2.9);
      },
    },
    { // 4 · Kill
      enter(tl) {
        hide(tl, E.lab.lyso, 0);
        hide(tl, E.lab.enzymes, 0);
        pan(tl, L.pans[2], L.pans[3], 0, 1.8);
        drive(tl, (p) => {
          E.free.forEach((g, i) => {
            const q = io(seg(p, 0.05 + i * 0.035, 0.6 + i * 0.035));
            const [sx, sy] = SAC_SPOTS[i];
            const [ex, ey] = DNA_SPOTS[i];
            const mx = lerp(sx, ex, 0.5) - 60, my = lerp(sy, ey, 0.5);
            const x = (1 - q) * (1 - q) * sx + 2 * (1 - q) * q * mx + q * q * ex;
            const y = (1 - q) * (1 - q) * sy + 2 * (1 - q) * q * my + q * q * ey;
            g.setAttribute('transform', `translate(${f(x)} ${f(y)})`);
          });
          const b = io(seg(p, 0.72, 0.9));
          E.dnaL.setAttribute('transform', `translate(${f(-50 - 9 * b)} ${f(4 * b)}) rotate(${f(-9 * b)})`);
          E.dnaR.setAttribute('transform', `translate(${f(50 + 9 * b)} ${f(4 * b)}) rotate(${f(9 * b)})`);
          E.dnaL.brk.setAttribute('opacity', f(b));
          E.dnaR.brk.setAttribute('opacity', f(b));
        }, { duration: 3.6, pos: 0.2 });
        show(tl, E.lab.dna, 1.6);
        // pull back: the close-up shrinks into the cell's surface, the whole cell appears…
        const [fx, fy] = L.focal;
        tl.fromTo(E.zoomG, { scale: 1, opacity: 1, svgOrigin: `${fx} ${fy}` }, { scale: 0.3, opacity: 0, svgOrigin: `${fx} ${fy}`, duration: 1.6, ease: 'so.inOut' }, 4.4);
        tl.fromTo(E.cellZoom, { scale: 2.4, opacity: 0, svgOrigin: `${fx} ${fy}` }, { scale: 1, opacity: 1, svgOrigin: `${fx} ${fy}`, duration: 1.6, ease: 'so.inOut' }, 4.4);
        // …and dies by the shared dying sequence (shrink, blebs, fragments)
        die(tl, E.cellRig, { duration: 3.2, pos: 6.1 });
      },
    },
    { // 5 · Neighbors
      enter(tl) {
        const C = L.cell;
        tl.fromTo(E.cellZoom, { scale: 1, opacity: 1, svgOrigin: `${C.x} ${C.y}` }, { scale: 0.55, opacity: 0, svgOrigin: `${C.x} ${C.y}`, duration: 1.2, ease: 'so.inOut' }, 0);
        const P = L.patch;
        tl.fromTo(E.patchZoom, { scale: 1.3, opacity: 0, svgOrigin: `${P.cx} ${P.cy}` }, { scale: 1, opacity: 1, svgOrigin: `${P.cx} ${P.cy}`, duration: 1.3, ease: 'so.inOut' }, 0.3);
        const T0 = 1.4;
        drive(tl, (p) => renderScenario(p * SCEN), { duration: SCEN, pos: T0 });
        const plan = PLAN[variant];
        for (const [id, t] of Object.entries(plan.deaths)) {
          die(tl, E.cells[id].rig, { duration: 2.4, to: 0.8, pos: T0 + t });
          tl.fromTo(E.cells[id].wrap, { opacity: 1 }, { opacity: 0.55, duration: 1.2, ease: 'power1.inOut' }, T0 + t + 2.2);
          if (E.cells[id].badge) hide(tl, E.cells[id].badge, T0 + t + 0.4, 0.8);
        }
        if (variant === 'tdxd') show(tl, E.reach, T0 + 10.6, 0.6);
        if (E.inset) {
          show(tl, E.inset.g, T0 + 0.6, 0.6);
          drive(tl, (p) => renderInset(p), { duration: 4.2, pos: T0 + 1.4 });
          show(tl, E.inset.scrapLabel, T0 + 5.4, 0.5);
        }
      },
    },
  ];

  function renderScenario(t) {
    for (const a of E.padcs) {
      const arrive = out(seg(t, a.t0, a.t0 + 2.6));
      const sink = io(seg(t, 3.6 + (a.t0 - 0.4) * 0.3, 4.6 + (a.t0 - 0.4) * 0.3));
      const P = sink > 0 ? lerpPose(a.end, a.sunk, sink) : lerpPose(a.start, a.end, arrive);
      a.g.setAttribute('transform', poseStr(P, 1 - 0.45 * sink));
      a.g.setAttribute('opacity', f(Math.min(seg(t, a.t0, a.t0 + 0.6), 1 - sink)));
    }
    for (const h of E.phex) {
      const pts = h.path;
      let x = pts[0][1], y = pts[0][2];
      for (let i = 1; i < pts.length; i++) {
        const [t0, x0, y0] = pts[i - 1];
        const [t1, x1, y1] = pts[i];
        if (t >= t1) { x = x1; y = y1; continue; }
        if (t > t0) { const q = io((t - t0) / (t1 - t0)); x = lerp(x0, x1, q); y = lerp(y0, y1, q); }
        break;
      }
      let o = seg(t, h.fadeIn, h.fadeIn + 0.4);
      if (h.die != null) o *= 1 - seg(t, h.die + 0.3, h.die + 1.4);
      h.g.setAttribute('transform', `translate(${f(x)} ${f(y)})`);
      h.g.setAttribute('opacity', f(o));
    }
  }

  function renderInset(p) {
    const I = E.inset;
    const d = io(seg(p, 0.15, 0.6));            // the antibody is digested
    I.body.forEach((n) => n.setAttribute('opacity', f(1 - d)));
    I.linker.setAttribute('opacity', f(1 - d));
    I.payloads.setAttribute('opacity', f(1 - seg(p, 0.45, 0.55)));
    I.frags.forEach((fr, i) => {
      const k = seg(p, 0.25, 0.85);
      const [x, y] = fr.home;
      fr.setAttribute('opacity', f(Math.min(seg(p, 0.2, 0.35), 1 - seg(p, 0.7, 1)) * 0.9));
      fr.setAttribute('transform', `translate(${f(x * (1 + 0.5 * k))} ${f(y + (i % 2 ? 1 : -1) * 8 * k)}) rotate(${i * 37 + k * 50})`);
    });
    I.scraps.forEach((sg) => {
      const k = io(seg(p, 0.45, 1));
      const [x, y] = sg.home;
      sg.setAttribute('opacity', f(seg(p, 0.45, 0.55)));
      sg.setAttribute('transform', `translate(${f(x + sg.side * 10 * k)} ${f(y - 4 * k)})`);
    });
  }

  // ---------------------------------------------------------------- notes, controls
  const notes = ctx.h('div', { class: 'adc-notes' },
    ctx.h('p', null, 'A payload molecule is a few hundred times lighter than the antibody.'),
    ctx.h('p', { class: 'adc-n5', hidden: true }, 'Not shown: payload that leaks into the blood or is taken up by healthy organs, the main source of side effects such as lung inflammation.'));
  ctx.caption.append(notes);
  const note5 = notes.querySelector('.adc-n5');

  const free = ctx.h('div', { class: 'adc-free', hidden: true });
  let stepper = null;
  const replay = () => {
    if (!stepper) return;
    stepper.go(3, { instant: true });
    stepper.go(4);
  };
  ctx.ui.segmented({
    label: 'Drug', parent: free, value: 'tdxd',
    options: [{ value: 'tdxd', label: 'T-DXd' }, { value: 'tdm1', label: 'T-DM1' }],
    onChange: (v) => {
      variant = v;
      stepper.rebuild();
      if (!ctx.reducedMotion) replay();
      ctx.announce(v === 'tdxd' ? 'Trastuzumab deruxtecan selected' : 'Trastuzumab emtansine selected');
    },
  });
  ctx.ui.button({ label: 'Play', icon: 'play', variant: 'ghost', parent: free, onClick: replay });

  stepper = ctx.ui.stepper({
    steps,
    reset,
    onChange(i) {
      free.hidden = i !== 4;
      note5.hidden = i !== 4;
    },
  });
  ctx.controls.append(free);

  ctx.onResize(({ compact }) => {
    const name = compact ? 'compact' : 'wide';
    if (name === layoutName) return;
    layoutName = name;
    L = LAYOUTS[name];
    stepper.rebuild();
  });

  return {};
}
