// Self & Other — illustration library
// bodymap.js: a calm, front-facing, gender-neutral human silhouette (no face, no features)
// with schematic organ glyphs and anchor coordinates for hotspots / leader lines
// (ch05-thymus AIRE, ch05-brakes knockout, ch08-side-effects, ch01-census).
//
//   const body = bodyMap({ height: 460, stage: 'light', organs: ['thyroid', 'lungs', 'liver', 'gut'] });
//   const { anchors } = cellInfo(body);      // anchors.liver → { x, y, r }
//   svg.append(body); // centred at (0,0); place with a transform
//
// Viewer's left = the person's right (front view), so the heart and spleen sit to the right.

import { el, part, n, circleD, ellipseD, capsuleD, roundRectD, TAU, clamp, lerp } from './svg.js';
import { PALETTE, mix, resolve, WHITE, stageOf } from './palette.js';
import { radial, dotGlow } from './defs.js';
import { smoothPath } from './shapes.js';
import { setInfo } from './registry.js';

// muted anatomical tones: organs stay calm so crimson hotspot rings and canonical cell colors pop
const ORGAN_COLOR = {
  brain: '#C9B3C6', pituitary: '#D9A3B4', eye: '#A9BEDA', salivary: '#D7B39C', thyroid: '#D69AA4', thymus: '#D9C3A8',
  lungs: '#D7A9AE', heart: '#C97F86', liver: '#B5826F', stomach: '#D2AE8E', spleen: '#B0798F', pancreas: '#D9BE86',
  adrenals: '#D8A85F', kidneys: '#B97C7C', gut: '#D7B49A', marrow: '#E1D3B8', lymphNodes: PALETTE.lymph,
  skin: PALETTE.healthy, joints: '#CBBFAE', muscle: '#C98C8C', nerves: '#E2CF9A',
};

/** All organ names, in drawing order (back to front). */
export const ORGANS = Object.freeze([
  'marrow', 'lymphNodes', 'brain', 'pituitary', 'salivary', 'thyroid', 'thymus', 'lungs', 'heart', 'liver', 'stomach',
  'spleen', 'pancreas', 'kidneys', 'adrenals', 'gut', 'muscle', 'nerves', 'joints', 'skin', 'eye',
]);

// Anchor centres in unit coordinates (height = 1, head top at y = 0, centre line x = 0) and a
// hotspot radius. Paired organs list both sides in `pts`.
const ANCHORS = {
  brain: { x: 0, y: 0.048, r: 0.04 },
  pituitary: { x: 0, y: 0.076, r: 0.013 },
  eye: { x: 0.026, y: 0.07, r: 0.014 },
  salivary: { x: 0.034, y: 0.112, r: 0.014 },
  thyroid: { x: 0, y: 0.148, r: 0.02 },
  thymus: { x: 0, y: 0.205, r: 0.02 },
  lungs: { x: 0, y: 0.255, r: 0.07, pts: [[-0.046, 0.255], [0.046, 0.255]] },
  heart: { x: 0.016, y: 0.278, r: 0.026 },
  liver: { x: -0.03, y: 0.333, r: 0.04 },
  stomach: { x: 0.032, y: 0.338, r: 0.026 },
  spleen: { x: 0.064, y: 0.33, r: 0.016 },
  pancreas: { x: 0.012, y: 0.362, r: 0.024 },
  adrenals: { x: 0, y: 0.36, r: 0.05, pts: [[-0.044, 0.36], [0.044, 0.36]] },
  kidneys: { x: 0, y: 0.382, r: 0.055, pts: [[-0.045, 0.382], [0.045, 0.382]] },
  gut: { x: 0, y: 0.448, r: 0.06 },
  marrow: { x: 0, y: 0.62, r: 0.06, pts: [[-0.052, 0.62], [0.052, 0.62]] },
  lymphNodes: { x: 0, y: 0.23, r: 0.03, pts: [[-0.026, 0.135], [0.026, 0.135], [-0.086, 0.232], [0.086, 0.232], [-0.052, 0.528], [0.052, 0.528]] },
  skin: { x: -0.146, y: 0.43, r: 0.022 },
  joints: { x: 0, y: 0.728, r: 0.05, pts: [[-0.054, 0.728], [0.054, 0.728]] },
  muscle: { x: -0.118, y: 0.27, r: 0.024 },
  nerves: { x: 0.122, y: 0.3, r: 0.02 },
};
/** Common aliases. */
const ALIAS = { colon: 'gut', intestine: 'gut', bowel: 'gut', 'bone marrow': 'marrow', boneMarrow: 'marrow', 'lymph nodes': 'lymphNodes', lymph: 'lymphNodes', adrenal: 'adrenals', kidney: 'kidneys', lung: 'lungs', joint: 'joints', knee: 'joints', eyes: 'eye', muscles: 'muscle', nerve: 'nerves', salivaryGland: 'salivary', hypophysis: 'pituitary' };
const canon = (name) => ALIAS[name] || name;

// ---------------------------------------------------------------- silhouette

function silhouetteParts(H) {
  const P = (x, y) => [x * H, y * H - H / 2];
  // torso + legs: right half from the neck base down and back up the inner leg, then mirrored
  const R = [
    [0.03, 0.158], [0.06, 0.165], [0.092, 0.177], [0.106, 0.198], [0.101, 0.236], [0.089, 0.3], [0.081, 0.375],
    [0.083, 0.445], [0.093, 0.502], [0.09, 0.58], [0.081, 0.672], [0.075, 0.728], [0.069, 0.8], [0.063, 0.9],
    [0.068, 0.952], [0.084, 0.982], [0.071, 0.996], [0.034, 0.995], [0.029, 0.95], [0.032, 0.88], [0.036, 0.8],
    [0.031, 0.728], [0.023, 0.63], [0.013, 0.565], [0.0, 0.552],
  ];
  const L = R.slice(0, -1).reverse().map(([x, y]) => [-x, y]);
  const torso = smoothPath([...R, ...L].map(([x, y]) => P(x, y)), { closed: true, smooth: 0.32 });
  const head = ellipseD(0, 0.066 * H - H / 2, 0.047 * H, 0.062 * H);
  const neck = roundRectD(0, 0.14 * H - H / 2, 0.046 * H, 0.06 * H, 0.012 * H);
  const arm = (s) => {
    const sh = P(s * 0.098, 0.195), el2 = P(s * 0.127, 0.355), wr = P(s * 0.147, 0.49);
    return capsuleD(sh[0], sh[1], el2[0], el2[1], 0.048 * H) + capsuleD(el2[0], el2[1], wr[0], wr[1], 0.037 * H) +
      ellipseD(s * 0.152 * H, 0.528 * H - H / 2, 0.021 * H, 0.036 * H, s * -8);
  };
  return { torso, head, neck, arms: arm(-1) + arm(1) };
}

// ---------------------------------------------------------------- organ glyphs (unit coords → px)

function organShapes(name, H, one = false) {
  const P = (x, y) => [x * H, y * H - H / 2];
  const E = (x, y, rx, ry, rot = 0) => { const [px, py] = P(x, y); return ellipseD(px, py, rx * H, ry * H, rot); };
  const C = (x, y, r) => { const [px, py] = P(x, y); return circleD(px, py, r * H); };
  const S = (pts, closed = true) => smoothPath(pts.map(([x, y]) => P(x, y)), { closed, smooth: 0.34 });
  const line = (pts) => pts.map(([x, y], i) => { const [px, py] = P(x, y); return `${i ? 'L' : 'M'}${n(px)} ${n(py)}`; }).join('');
  switch (name) {
    case 'brain': return {
      // seen from above-front: two hemispheres, a midline and a few meandering folds
      // (no symmetric arcs or dots that could read as a face)
      fill: S([[-0.037, 0.058], [-0.04, 0.034], [-0.026, 0.014], [0, 0.009], [0.026, 0.014], [0.04, 0.034], [0.037, 0.058], [0.018, 0.066], [0, 0.064], [-0.018, 0.066]]),
      lines: line([[0, 0.011], [0, 0.064]]) + S([[-0.034, 0.028], [-0.026, 0.024], [-0.022, 0.032], [-0.012, 0.03], [-0.008, 0.022]], false) +
        S([[0.006, 0.05], [0.014, 0.056], [0.02, 0.048], [0.03, 0.052], [0.035, 0.046]], false) + S([[-0.03, 0.05], [-0.022, 0.046], [-0.018, 0.054]], false),
    };
    case 'pituitary': return { fill: E(0, 0.076, 0.0065, 0.0055), lines: line([[0, 0.064], [0, 0.071]]) };
    case 'eye': return { fill: S([[0.014, 0.07], [0.026, 0.063], [0.038, 0.07], [0.026, 0.077]]), lines: C(0.026, 0.07, 0.0042) };
    case 'salivary': return { fill: C(0.031, 0.11, 0.007) + C(0.039, 0.113, 0.006) + C(0.034, 0.118, 0.006), lines: line([[0.03, 0.115], [0.022, 0.104]]) };
    case 'thyroid': return { fill: E(-0.011, 0.148, 0.009, 0.014, -12) + E(0.011, 0.148, 0.009, 0.014, 12) + E(0, 0.152, 0.008, 0.004), lines: '' };
    case 'thymus': return { fill: S([[-0.002, 0.188], [-0.016, 0.196], [-0.02, 0.215], [-0.008, 0.222], [-0.001, 0.205]]) + S([[0.002, 0.188], [0.016, 0.196], [0.02, 0.215], [0.008, 0.222], [0.001, 0.205]]), lines: '' };
    case 'lungs': {
      const lung = (s) => S([[s * 0.016, 0.205], [s * 0.04, 0.198], [s * 0.066, 0.225], [s * 0.074, 0.275], [s * 0.07, 0.31], [s * 0.042, 0.305], [s * 0.022, 0.296], [s * (s > 0 ? 0.03 : 0.018), 0.26], [s * 0.016, 0.225]]);
      return { fill: lung(-1) + lung(1), lines: line([[0, 0.17], [0, 0.205]]) + S([[-0.016, 0.218], [0, 0.205], [0.016, 0.218]], false) };
    }
    case 'heart': return { fill: S([[0.002, 0.262], [0.016, 0.255], [0.032, 0.262], [0.036, 0.28], [0.022, 0.3], [0.01, 0.296], [0.0, 0.28]]), lines: S([[0.012, 0.262], [0.02, 0.28], [0.03, 0.29]], false) };
    case 'liver': return { fill: S([[-0.07, 0.318], [-0.04, 0.31], [0.0, 0.315], [0.02, 0.322], [0.006, 0.335], [-0.03, 0.348], [-0.062, 0.352], [-0.073, 0.338]]), lines: S([[-0.012, 0.318], [-0.02, 0.334]], false) };
    case 'stomach': return { fill: S([[0.018, 0.322], [0.034, 0.317], [0.052, 0.328], [0.05, 0.35], [0.034, 0.358], [0.016, 0.352], [0.024, 0.34], [0.03, 0.33]]), lines: '' };
    case 'spleen': return { fill: E(0.066, 0.33, 0.008, 0.016, 20), lines: '' };
    case 'pancreas': return { fill: S([[-0.012, 0.364], [0.004, 0.357], [0.03, 0.356], [0.05, 0.353], [0.052, 0.36], [0.03, 0.365], [0.006, 0.371]]), lines: '' };
    case 'adrenals': return { fill: (one ? '' : S([[-0.053, 0.366], [-0.044, 0.351], [-0.035, 0.366]])) + S([[0.053, 0.366], [0.044, 0.351], [0.035, 0.366]]), lines: '' };
    case 'kidneys': {
      const k = (s) => S([[s * 0.036, 0.366], [s * 0.05, 0.364], [s * 0.057, 0.382], [s * 0.051, 0.4], [s * 0.037, 0.398], [s * 0.034, 0.386], [s * 0.04, 0.382], [s * 0.034, 0.376]]);
      return { fill: one ? k(1) : k(-1) + k(1), lines: '' };
    }
    case 'gut': {
      // colon as a frame + a coil of small intestine inside
      const colon = S([[-0.052, 0.488], [-0.057, 0.44], [-0.05, 0.41], [-0.02, 0.404], [0.02, 0.404], [0.05, 0.41], [0.057, 0.44], [0.052, 0.478], [0.03, 0.496], [0.008, 0.498]], false);
      let coil = '';
      for (let i = 0; i < 3; i++) {
        const y = 0.428 + i * 0.021;
        coil += S([[-0.03, y], [-0.016, y - 0.008], [0, y], [0.016, y - 0.008], [0.03, y], [0.018, y + 0.009], [0, y + 0.004], [-0.018, y + 0.009]], true);
      }
      return { fill: coil, lines: colon, colonWidth: 0.012 };
    }
    case 'marrow': {
      const bone = (s) => {
        const top = P(s * 0.06, 0.52), bot = P(s * 0.05, 0.71);
        return capsuleD(top[0], top[1], bot[0], bot[1], 0.018 * H) + circleD(top[0] - s * 0.004 * H, top[1], 0.014 * H) + circleD(bot[0], bot[1] + 0.004 * H, 0.015 * H);
      };
      const mar = (s) => { const a = P(s * 0.058, 0.55), b = P(s * 0.051, 0.685); return capsuleD(a[0], a[1], b[0], b[1], 0.008 * H); };
      return { fill: one ? bone(1) : bone(-1) + bone(1), inner: one ? mar(1) : mar(-1) + mar(1), lines: '' };
    }
    case 'lymphNodes': {
      let d = '';
      for (const [x, y] of one ? [ANCHORS.lymphNodes.pts[3]] : ANCHORS.lymphNodes.pts) {
        d += E(x, y, 0.0075, 0.0055, 30) + E(x + (x > 0 ? 0.009 : -0.009), y + 0.009, 0.006, 0.0045, -20);
      }
      return { fill: d, lines: one ? '' : line([[-0.026, 0.135], [-0.052, 0.18], [-0.086, 0.232]]) + line([[0.026, 0.135], [0.052, 0.18], [0.086, 0.232]]) };
    }
    case 'skin': {
      const [x, y] = P(-0.146, 0.43);
      let hatch = '';
      for (let i = -2; i <= 2; i++) hatch += `M${n(x - 0.012 * H)} ${n(y + i * 0.006 * H)}l${n(0.024 * H)} ${n(-0.004 * H)}`;
      return { fill: roundRectD(x, y, 0.03 * H, 0.04 * H, 0.008 * H), lines: hatch };
    }
    case 'joints': {
      let d = '', l = '';
      for (const [x, y] of one ? [ANCHORS.joints.pts[1]] : ANCHORS.joints.pts) { d += C(x, y, 0.016); l += E(x, y - 0.002, 0.008, 0.007); }
      return { fill: d, lines: l };
    }
    case 'muscle': {
      const a = P(-0.108, 0.215), b = P(-0.126, 0.33);
      let st = '';
      for (let i = 1; i < 6; i++) { const t = i / 6; const x = lerp(a[0], b[0], t), y = lerp(a[1], b[1], t); st += `M${n(x - 0.012 * H)} ${n(y)}l${n(0.024 * H)} ${n(-0.004 * H)}`; }
      return { fill: S([[-0.108, 0.212], [-0.098, 0.24], [-0.104, 0.3], [-0.126, 0.332], [-0.132, 0.3], [-0.122, 0.24]]), lines: st };
    }
    case 'nerves': return { fill: '', lines: S([[0.1, 0.2], [0.112, 0.26], [0.126, 0.33], [0.14, 0.42]], false) + S([[0.112, 0.26], [0.124, 0.28]], false) + S([[0.126, 0.33], [0.138, 0.35]], false) };
    default: return { fill: '', lines: '' };
  }
}

/**
 * Human body map. bodyMap({ height:460, stage, organs:'all' | [names] | [] (silhouette only),
 *   anchorsOnly:false, outline:true })
 * Organs: brain, pituitary, eye, salivary, thyroid, thymus, lungs, heart, liver, stomach,
 *   spleen, pancreas, adrenals, kidneys, gut (colon), marrow (bone marrow), lymphNodes,
 *   skin (forearm patch), joints (knees), muscle (upper arm), nerves (arm).
 *   Aliases: colon, 'bone marrow', 'lymph nodes', knee, eyes, kidney, lung, adrenal …
 * Centred at (0,0); feet at +height/2. Every organ is <g data-part="organ" data-organ="name">.
 * cellInfo(g).anchors[name] → { x, y, r, pts? } (px, local) for hotspot rings & leader lines —
 * available for every organ even when it isn't drawn. Parts: silhouette, organs.
 */
export function bodyMap(o = {}) {
  const H = o.height ?? 460;
  const stage = o.stage === 'light' ? 'light' : 'dark';
  const dark = stage === 'dark';
  const S = stageOf(stage);
  const list = o.organs === 'all' || o.organs == null ? ORGANS.filter((x) => x !== 'eye') : o.organs.map(canon);
  const g = el('g', { class: 'sao-bodymap', 'data-part': 'bodymap', role: o.label ? 'img' : null });
  const sw = clamp(H * 0.0042, 1, 2.4);
  const sil = silhouetteParts(H);
  const all = sil.torso + sil.head + sil.neck + sil.arms;
  const sg = part('silhouette');
  // union trick: stroke of every part underneath, fills on top → one seamless figure
  if (o.outline !== false) sg.appendChild(el('path', { d: all, fill: 'none', stroke: dark ? mix(S.ink2, S.bg, 0.25) : S.ink2, 'stroke-opacity': dark ? 0.6 : 0.75, 'stroke-width': n(sw * 2), 'stroke-linejoin': 'round' }));
  sg.appendChild(el('path', {
    d: all,
    fill: dark
      ? radial('bodyfill', [[0, '#26304F'], [1, '#1A2240']], { cx: 0.5, cy: 0.35, r: 0.75 })
      : radial('bodyfill', [[0, '#FFFFFF'], [1, '#F3EEE6']], { cx: 0.5, cy: 0.35, r: 0.75 }),
  }));
  g.appendChild(sg);
  const og = part('organs');
  for (const name of ORGANS) {
    if (!list.includes(name)) continue;
    const shp = organShapes(name, H);
    const col = ORGAN_COLOR[name];
    const fill = dark ? mix(col, S.bg, 0.5) : mix(col, WHITE, 0.45);
    const stroke = dark ? mix(col, WHITE, 0.25) : mix(col, S.ink, 0.45);
    const og2 = el('g', { 'data-part': 'organ', 'data-organ': name });
    if (name === 'gut') {
      // colon: a tube = wide outline stroke under a slightly narrower fill stroke
      og2.appendChild(el('path', { d: shp.lines, fill: 'none', stroke, 'stroke-width': n(shp.colonWidth * H + sw * 1.4), 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
      og2.appendChild(el('path', { d: shp.lines, fill: 'none', stroke: fill, 'stroke-width': n(shp.colonWidth * H), 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
    }
    if (shp.fill) og2.appendChild(el('path', { d: shp.fill, fill, stroke, 'stroke-width': n(sw * 0.7), 'stroke-linejoin': 'round' }));
    if (shp.inner) og2.appendChild(el('path', { d: shp.inner, fill: dark ? mix('#D98A8A', S.bg, 0.3) : mix('#D98A8A', WHITE, 0.35) }));
    if (shp.lines && name !== 'gut') {
      og2.appendChild(el('path', { d: shp.lines, fill: 'none', stroke, 'stroke-width': n(sw * 0.8), 'stroke-opacity': 0.75, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
    }
    og.appendChild(og2);
  }
  g.appendChild(og);
  const anchors = {};
  for (const [name, a] of Object.entries(ANCHORS)) {
    anchors[name] = { x: a.x * H, y: a.y * H - H / 2, r: a.r * H, pts: a.pts ? a.pts.map(([x, y]) => ({ x: x * H, y: y * H - H / 2 })) : null };
  }
  for (const [al, name] of Object.entries(ALIAS)) anchors[al] = anchors[name];
  setInfo(g, { kind: 'bodyMap', stage, height: H, width: H * 0.36, anchors, organs: list });
  return g;
}

/**
 * A single organ as a standalone icon (chips, AIRE "organ proteins", hotspot legends).
 * organIcon('pancreas', { size:24, stage }) or organIcon({ name:'pancreas', size }) — centred at (0,0), fits a size×size box.
 * Paired organs (kidneys, adrenals, joints, marrow, lymph nodes) show a single one; lungs show the pair.
 */
export function organIcon(name, o = {}) {
  if (name && typeof name === 'object') { o = name; name = o.name || o.organ; }
  name = canon(name);
  const size = o.size ?? 24;
  const stage = o.stage === 'light' ? 'light' : 'dark';
  const dark = stage === 'dark';
  const S = stageOf(stage);
  const PAIRED_ONE = { kidneys: [0.046, 0.382, 0.03], adrenals: [0.044, 0.36, 0.016], joints: [0.054, 0.728, 0.02], marrow: [0.055, 0.615, 0.11], lymphNodes: [0.09, 0.236, 0.016] };
  const one = !!PAIRED_ONE[name];
  const a = one ? { x: PAIRED_ONE[name][0], y: PAIRED_ONE[name][1], r: PAIRED_ONE[name][2] } : (ANCHORS[name] || { x: 0, y: 0.5, r: 0.03 });
  const span = (!one && a.pts ? Math.max(...a.pts.map(([x]) => Math.abs(x))) + a.r * 0.7 : a.r) * 2.2;
  const H = size / span;
  const shp = organShapes(name, H, one);
  const col = ORGAN_COLOR[name] || '#C9B3C6';
  const fill = dark ? mix(col, S.bg, 0.25) : mix(col, WHITE, 0.3);
  const stroke = dark ? mix(col, WHITE, 0.35) : mix(col, S.ink, 0.5);
  const sw = clamp(size * 0.05, 0.7, 2);
  const g = el('g', { class: 'sao-organ-icon', 'data-organ': name });
  const inner = el('g', { transform: `translate(${n(-a.x * H)} ${n(-(a.y * H - H / 2))})` });
  if (name === 'gut') {
    inner.appendChild(el('path', { d: shp.lines, fill: 'none', stroke, 'stroke-width': n(shp.colonWidth * H + sw * 1.6), 'stroke-linecap': 'round' }));
    inner.appendChild(el('path', { d: shp.lines, fill: 'none', stroke: fill, 'stroke-width': n(shp.colonWidth * H), 'stroke-linecap': 'round' }));
  }
  if (shp.fill) inner.appendChild(el('path', { d: shp.fill, fill, stroke, 'stroke-width': n(sw), 'stroke-linejoin': 'round' }));
  if (shp.inner) inner.appendChild(el('path', { d: shp.inner, fill: mix('#D98A8A', dark ? S.bg : WHITE, 0.3) }));
  if (shp.lines && name !== 'gut') inner.appendChild(el('path', { d: shp.lines, fill: 'none', stroke, 'stroke-width': n(sw), 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
  g.appendChild(inner);
  return g;
}
