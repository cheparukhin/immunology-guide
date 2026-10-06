// Self & Other — illustration library
// cells.js: one factory per cell type (PLAN §4). Each returns an SVG <g> centred at (0,0).
//
// Common options (all factories):
//   r        nominal radius in px. For round cells = membrane radius. For cells with long
//            processes (dendritic cell, fibroblast, macrophage) = overall extent, so the
//            cell always fits in a circle of radius ≈ r. Activated lymphocytes grow ~15%.
//   seed     integer/string; same seed ⇒ same shape. Vary it for crowds.
//   stage    'dark' (luminous, default) | 'light' (crisp illustration on paper)
//   detail   'auto' (default: high if r ≥ 18) | 'high' | 'low'
//   glow     false to drop the soft halo (dark stage)
//   receptors true/false (default: true when detail is high and r ≥ 16)
//   state    type-specific (see each factory)
//   polarity degrees; direction an activated/crawling cell faces (0 = right, 90 = down)
//
// Named parts (data-part): glow, membrane, sheen, cytoplasm, granules, nucleus,
// microvilli, receptors (+ type-specific: vacuoles, er, antibodies, cytokines, blebs…).

import { el, part, n, circleD, ellipseD, capsuleD, TAU, clamp, lerp } from './svg.js';
import { PALETTE, tones, mix, resolve, WHITE, desaturate, shade as shadeHex } from './palette.js';
import { bodyFill, haloFill, nucleusFill, sheenFill, radial as radialStops } from './defs.js';
import {
  rng, ringNoise, blobRadius, polarPoints, smoothPath, armOutline, roundedPolygonPath, roundedPolygonPoints,
  extentOf, samplePerimeter, scatterInDisc, wrapAngle, bandPoints, edgeFolds,
} from './shapes.js';
import { setInfo, cellInfo } from './registry.js';
import { tcrKey } from './keys.js';
import { setNecrotic } from './animate.js';
import {
  placeOnMembrane, tcr, bcr, mhc1, mhc2, b7, pd1, pdl1, cd25, ctla4, nkActivating, nkInhibitory,
  stressLigand, antigen, antibody, cytokineCloud,
} from './molecules.js';

export { cellInfo };

const DEG = Math.PI / 180;

// ---------------------------------------------------------------- shared construction

function baseOpts(o, defR) {
  const r = o.r ?? defR;
  const stage = o.stage === 'light' ? 'light' : 'dark';
  const detail = !o.detail || o.detail === 'auto' ? (r >= 18 ? 'high' : 'low') : o.detail;
  return {
    r, stage, detail, hi: detail === 'high',
    seed: o.seed ?? 1,
    glow: o.glow !== false && stage === 'dark',
    receptors: o.receptors ?? (detail === 'high' && r >= 16),
    polarity: (o.polarity ?? 0) * DEG,
  };
}

function rootG(kind, c, extra = {}) {
  return el('g', {
    class: `sao-cell sao-${kind}`,
    'data-cell': kind,
    'data-stage': c.stage,
    ...extra,
  });
}

function strokeW(c, k = 1) {
  return c.stage === 'light' ? clamp(c.r * 0.034, 0.8, 2.6) * k : clamp(c.r * 0.028, 0.6, 2.2) * k;
}

function addHalo(g, c, T, radius, intensityOpts) {
  if (!c.glow || T.haloOpacity <= 0) return null;
  const h = el('circle', { 'data-part': 'glow', r: n(radius), fill: haloFill(T.base, c.stage, intensityOpts) });
  g.appendChild(h);
  return h;
}

function addBody(g, c, T, d, fill) {
  const p = el('path', {
    class: 'sao-membrane',
    d, fill,
    stroke: T.rim, 'stroke-opacity': n(T.rimOpacity), 'stroke-width': n(strokeW(c)),
    'stroke-linejoin': 'round',
  });
  g.appendChild(part('membrane', {}, [p]));
  return p;
}

function addSheen(g, c, T, d) {
  if (!c.hi) return null;
  const p = el('path', { class: 'sao-sheen', d, fill: sheenFill(T.base, c.stage), 'pointer-events': 'none' });
  g.appendChild(part('sheen', {}, [p]));
  return p;
}

/** Fine hair-like microvilli around an outline (one <path>). */
function microvilliPath(c, T, pts, { spacing, len, opacity = 1, seed = 1, skip = null } = {}) {
  const R = rng(seed, 'villi');
  let per = 0;
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i], q = pts[(i + 1) % pts.length];
    per += Math.hypot(q[0] - p[0], q[1] - p[1]);
  }
  const sp = spacing ?? clamp(c.r * 0.085, 2.1, 4.6);
  const L = len ?? clamp(c.r * 0.085, 1.4, 5.5);
  const count = Math.round(per / sp);
  const spots = samplePerimeter(pts, count);
  let d = '';
  for (const s of spots) {
    if (skip && skip(s)) continue;
    const l = L * R.range(0.65, 1.25);
    const lean = R.range(-0.45, 0.45) * l;
    const tx = -s.ny, ty = s.nx;
    const bx = s.x - s.nx * l * 0.35, by = s.y - s.ny * l * 0.35;
    const ex = s.x + s.nx * l + tx * lean, ey = s.y + s.ny * l + ty * lean;
    const cx = s.x + s.nx * l * 0.55 + tx * lean * 0.15, cy = s.y + s.ny * l * 0.55 + ty * lean * 0.15;
    d += `M${n(bx)} ${n(by)}Q${n(cx)} ${n(cy)} ${n(ex)} ${n(ey)}`;
  }
  return el('path', {
    class: 'sao-villi', d, fill: 'none', stroke: T.fuzz, 'stroke-opacity': n(T.fuzzOpacity * opacity),
    'stroke-width': n(clamp(c.r * 0.022, 0.45, 1.25)), 'stroke-linecap': 'round',
  });
}

function speckles(R, cx, cy, radius, count, size, sizeJitter = 0.45) {
  let d = '';
  for (let i = 0; i < count; i++) {
    const a = R.range(0, TAU), rr = Math.sqrt(R()) * radius;
    const s = size * R.range(1 - sizeJitter, 1 + sizeJitter);
    // slightly elongated blobs read as chromatin clumps
    d += ellipseD(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, s, s * R.range(0.55, 1), R.range(0, 180));
  }
  return d;
}

/**
 * Nucleus builder.
 * shape: 'round' | 'kidney' | 'irregular' | 'oval'; nr radius; chromatin: density 0..1;
 * clumped: coarse texture; nucleoli: count; tone: tones() object.
 */
function nucleusBlob(c, T, {
  cx = 0, cy = 0, nr, seed = 1, shape = 'round', irregularity = 0.25, indent = 0.3, indentAngle = 0,
  squash = 0, squashAngle = 0, chromatin = 0.6, clumped = false, nucleoli = 1, nucleolusSize = 0.13,
  name = 'nucleus',
} = {}) {
  const R = rng(seed, 'nucleus');
  const bumps = [];
  if (shape === 'kidney') bumps.push({ angle: indentAngle, amp: -indent, width: 0.55 });
  const rf = blobRadius({
    r: nr, seed: `${seed}n`, irregularity: shape === 'irregular' ? irregularity * 2.4 : irregularity,
    bumps, squash: shape === 'oval' ? squash || 0.25 : squash, squashAngle, kMax: shape === 'irregular' ? 7 : 5,
  });
  const pts = polarPoints(rf, c.hi ? 40 : 24).map(([x, y]) => [x + cx, y + cy]);
  const d = smoothPath(pts);
  const g = part(name, { class: 'sao-nucleus' });
  g.appendChild(el('path', {
    class: 'sao-nucleus-envelope', d, fill: nucleusFill(T.base, c.stage, { intensity: T._k, desat: T._ds }),
    'fill-opacity': c.hi || c.stage === 'light' ? null : 0.4,
    stroke: T.nucRim, 'stroke-width': n(strokeW(c, 0.7)), 'stroke-opacity': c.stage === 'light' ? 0.9 : 0.75,
  }));
  if (c.hi) {
    const inner = nr * (shape === 'kidney' ? 0.6 : 0.78);
    const cnt = Math.round((clumped ? 9 : 14) * chromatin * clamp(nr / 18, 0.6, 2.2));
    const size = nr * (clumped ? 0.13 : 0.075);
    g.appendChild(el('path', { 'data-part': 'chromatin', d: speckles(R, cx, cy, inner, cnt, size), fill: T.chromatin, 'fill-opacity': n(T.chromatinOpacity) }));
    g.appendChild(el('path', { d: speckles(R, cx, cy, inner, Math.round(cnt * 0.7), size * 0.8), fill: T.chromatinLight, 'fill-opacity': n(T.chromatinLightOpacity) }));
    if (nucleoli > 0) {
      // irregular, off-centre, unequal sizes — never a symmetric pair of dark dots ("eyes")
      let dn = '';
      const a0 = R.range(0, TAU);
      for (let i = 0; i < nucleoli; i++) {
        const a = a0 + (i * TAU) / nucleoli + R.range(-0.4, 0.4);
        const rr = nr * R.range(0.3, 0.48);
        const sz = nr * nucleolusSize * (i === 0 ? 1.15 : R.range(0.45, 0.62));
        const rfN = blobRadius({ r: sz, seed: `${seed}nl${i}`, irregularity: 1.1, kMax: 4 });
        dn += smoothPath(polarPoints(rfN, 14).map(([x, y]) => [x + cx + Math.cos(a) * rr, y + cy + Math.sin(a) * rr]));
      }
      g.appendChild(el('path', { 'data-part': 'nucleolus', d: dn, fill: T.nucleolus, 'fill-opacity': c.stage === 'light' ? 0.5 : 0.7 }));
    }
  }
  return { g, pts, d };
}

/** Multi-lobed (segmented) nucleus: 2–5 lobes along a curved spine joined by thin strands. */
function nucleusLobed(c, T, { cx = 0, cy = 0, size, lobes = 3, seed = 1, spineAngle = 0 }) {
  const R = rng(seed, 'lobes');
  const g = part('nucleus', { class: 'sao-nucleus sao-nucleus-lobed' });
  const lr = size * (lobes >= 4 ? 0.27 : 0.31);
  const Rs = size * 0.95; // spine radius (gentle C-curve)
  const step = (2.05 * lr) / Rs;
  const ocx = cx - Math.cos(spineAngle) * Rs, ocy = cy - Math.sin(spineAngle) * Rs;
  const centers = [];
  for (let i = 0; i < lobes; i++) {
    const a = spineAngle + (i - (lobes - 1) / 2) * step + R.range(-0.06, 0.06);
    const rr = Rs + R.range(-0.12, 0.12) * lr;
    centers.push([ocx + Math.cos(a) * rr, ocy + Math.sin(a) * rr]);
  }
  let strands = '';
  for (let i = 0; i < lobes - 1; i++) {
    const a = centers[i], b = centers[i + 1];
    strands += `M${n(a[0])} ${n(a[1])}L${n(b[0])} ${n(b[1])}`;
  }
  const sw = strokeW(c, 0.6);
  g.appendChild(el('path', { d: strands, stroke: T.nucRim, 'stroke-opacity': 0.6, 'stroke-width': n(Math.max(0.8, lr * 0.32) + sw * 2), fill: 'none', 'stroke-linecap': 'round' }));
  g.appendChild(el('path', { d: strands, stroke: T.nucOut, 'stroke-width': n(Math.max(0.8, lr * 0.32)), fill: 'none', 'stroke-linecap': 'round' }));
  let d = '';
  const lobeR = [];
  centers.forEach((p, i) => {
    const r0 = lr * R.range(0.88, 1.1);
    lobeR.push(r0);
    const rf = blobRadius({ r: r0, seed: `${seed}l${i}`, irregularity: 0.45, squash: 0.12, squashAngle: spineAngle + Math.PI / 2 });
    d += smoothPath(polarPoints(rf, 20).map(([x, y]) => [x + p[0], y + p[1]]));
  });
  // union trick: rim stroke underneath, fill on top → no inner outlines where lobes touch
  g.appendChild(el('path', { d, fill: 'none', stroke: T.nucRim, 'stroke-width': n(sw * 2), 'stroke-opacity': c.stage === 'light' ? 0.9 : 0.75 }));
  g.appendChild(el('path', { class: 'sao-nucleus-envelope', d, fill: nucleusFill(T.base, c.stage, { intensity: T._k, desat: T._ds }) }));
  if (c.hi) {
    let dc = '';
    centers.forEach((p, i) => { dc += speckles(R, p[0], p[1], lobeR[i] * 0.6, 3, lobeR[i] * 0.16); });
    g.appendChild(el('path', { 'data-part': 'chromatin', d: dc, fill: T.chromatin, 'fill-opacity': n(T.chromatinOpacity) }));
  }
  return { g, centers };
}

/** Granules: individual circles in high detail (animatable), single path in low. */
function granulesG(c, T, list, { color, edge = true } = {}) {
  const g = part('granules', { class: 'sao-granules' });
  const fill = color || T.granule;
  if (c.hi) {
    for (const p of list) {
      g.appendChild(el('circle', {
        'data-part': 'granule', cx: n(p.x), cy: n(p.y), r: n(p.r), fill,
        stroke: edge ? T.granuleEdge : 'none', 'stroke-width': n(Math.max(0.3, p.r * 0.28)), 'stroke-opacity': 0.8,
      }));
    }
  } else {
    let d = '';
    for (const p of list) d += circleD(p.x, p.y, p.r);
    g.appendChild(el('path', { d, fill }));
  }
  return g;
}

function cellTones(color, c, { intensity = 1, desat = 0 } = {}) {
  const T = { ...tones(color, c.stage, { intensity, desat }) };
  T._k = intensity;
  T._ds = desat;
  return T;
}

/** Finalize: record info for animation/placement. */
function finish(g, c, info) {
  setInfo(g, { stage: c.stage, r: c.r, detail: c.detail, ...info });
  return g;
}

function blobBody(c, T, rf, { samples, fillOpts } = {}) {
  const count = samples || (c.hi ? clamp(Math.round(c.r * 1.2), 40, 96) : 28);
  const pts = polarPoints(rf, count);
  return { pts, d: smoothPath(pts), count };
}

// ---------------------------------------------------------------- lymphocytes

const T_VARIANTS = { cd8: 'cd8', cd4: 'cd4', treg: 'treg' };

/**
 * T cell (CD8 killer, CD4 helper, regulatory).
 * tCell({ variant:'cd8'|'cd4'|'treg', r:24, seed, state:'resting'|'activated'|'exhausted',
 *         polarity:0, receptors:true, stage, detail, glow })
 * Silhouette: small, round, fine microvilli fuzz, big nucleus, TCR glyphs.
 *  • activated  — ~18% larger blast, brighter, polarized (front lamellipodium, rear uropod),
 *                 TCRs gathered at the front; CD8: cytotoxic granules massed at the front;
 *                 CD4: releases cytokine dots.
 *  • exhausted  — dimmer, desaturated, sparse fuzz, PD-1 (crimson, bar icon) all over.
 *  • treg       — dense CD25 dots on the surface + a few CTLA-4 (shape cue, not only color).
 *  tcrKey: clone identity (keys.js) — every TCR on the cell carries that notched tip.
 * Extra parts: granules (cd8), cytokines (cd4 activated).
 */
export function tCell(o = {}) {
  const variant = T_VARIANTS[o.variant] || 'cd8';
  const state = o.state || 'resting';
  const c = baseOpts(o, 24);
  const color = o.color || PALETTE[variant];
  const act = state === 'activated', exh = state === 'exhausted';
  const intensity = act ? 1.28 : exh ? 0.6 : 1;
  const desat = exh ? 0.5 : variant === 'treg' ? 0.05 : 0;
  const T = cellTones(color, c, { intensity, desat });
  const R = rng(c.seed, `t-${variant}`);
  const rr = c.r * (act ? 1.18 : exh ? 0.95 : 1);
  const pol = c.polarity;
  const bumps = act
    ? [{ angle: pol, amp: 0.1, width: 0.75 }, { angle: pol + Math.PI, amp: 0.26, width: 0.26 }, { angle: pol + Math.PI, amp: -0.06, width: 1.2 }]
    : [];
  const rf = blobRadius({
    r: rr, seed: c.seed, irregularity: act ? 0.3 : exh ? 0.42 : 0.2, bumps,
    squash: act ? 0.06 : exh ? 0.05 : 0, squashAngle: act ? pol : R.range(0, TAU), ruffle: act ? 0.25 : 0, ruffleK: 11,
  });
  const g = rootG('tcell', c, { 'data-variant': variant, 'data-state': state, 'data-key': o.tcrKey != null ? String(o.tcrKey) : null });
  const { pts, d } = blobBody(c, T, rf);
  addHalo(g, c, T, rr * 1.55, { intensity, desat });
  if (c.hi || c.r >= 8) {
    g.appendChild(part('microvilli', {}, [microvilliPath(c, T, pts, {
      seed: c.seed, opacity: exh ? 0.45 : 1, spacing: exh ? clamp(rr * 0.2, 3, 9) : undefined,
      len: exh ? clamp(rr * 0.06, 1.2, 4) : undefined,
      skip: act ? (s) => Math.cos(Math.atan2(s.y, s.x) - pol - Math.PI) > 0.93 : null,
    })]));
  }
  addBody(g, c, T, d, bodyFill(color, c.stage, { intensity, desat }));
  // nucleus: lymphocytes have a big nucleus and a thin rim of cytoplasm
  const nOff = act ? 0.2 * rr : 0.06 * rr;
  const nAng = act ? pol + Math.PI : R.range(0, TAU);
  const nuc = nucleusBlob(c, T, {
    cx: Math.cos(nAng) * nOff, cy: Math.sin(nAng) * nOff, nr: rr * (act ? 0.54 : 0.64), seed: c.seed,
    shape: 'round', irregularity: 0.22, chromatin: 0.9, clumped: true, nucleoli: act ? 1 : 0,
  });
  g.appendChild(nuc.g);
  // cytotoxic granules (CD8 only)
  if (variant === 'cd8' && c.r >= 10) {
    const count = act ? 9 : exh ? 2 : 4;
    const list = scatterInDisc(R.fork('gran'), {
      count, radius: rr * 0.82, size: rr * (act ? 0.065 : 0.055),
      avoid: act ? [] : [{ x: Math.cos(nAng) * nOff, y: Math.sin(nAng) * nOff, r: rr * 0.62 }],
      bias: act ? { angle: pol, spread: 0.45 } : null,
    });
    if (act) for (const p of list) { const k = 0.35; p.x = lerp(p.x, Math.cos(pol) * rr * 0.62, k); p.y = lerp(p.y, Math.sin(pol) * rr * 0.62, k); }
    g.appendChild(granulesG(c, T, list));
  }
  addSheen(g, c, T, d);
  const info = {
    kind: 'tCell', variant, state, color, extent: extentOf(pts) + (c.hi ? clamp(rr * 0.085, 1.4, 5.5) : 0),
    outline: pts, regen: (t, extra) => ({ d: smoothPath(polarPoints(rf, pts.length, t, extra)) }), radiusFn: rf, rEff: rr,
  };
  finish(g, c, info);
  if (c.receptors) {
    const size = clamp(rr * 0.36, 5, 22);
    const tcrColor = color;
    const tk = o.tcrKey;
    if (act) {
      placeOnMembrane(g, (op) => tcr({ ...op, color: tcrColor, key: tk }), { count: Math.round(clamp(rr / 4.5, 5, 12)), arcStart: (o.polarity ?? 0) - 70, arcEnd: (o.polarity ?? 0) + 70, size, seed: c.seed });
      placeOnMembrane(g, (op) => tcr({ ...op, color: tcrColor, key: tk }), { count: 4, arcStart: (o.polarity ?? 0) + 110, arcEnd: (o.polarity ?? 0) + 250, size: size * 0.9, seed: c.seed + 1 });
    } else if (exh) {
      placeOnMembrane(g, (op, i) => (i % 2 ? pd1({ ...op, icon: false }) : tcr({ ...op, color: tcrColor, key: tk })), { count: Math.round(clamp(rr / 2.6, 6, 18)), size, seed: c.seed, offset: 0.25 });
    } else if (variant === 'treg') {
      placeOnMembrane(g, (op, i) => (i % 4 === 0 ? tcr({ ...op, color: tcrColor, key: tk }) : i % 4 === 2 ? ctla4({ ...op, icon: false }) : cd25(op)), { count: Math.round(clamp(rr / 2.2, 8, 22)), size: size * 0.9, seed: c.seed });
    } else {
      placeOnMembrane(g, (op) => tcr({ ...op, color: tcrColor, key: tk }), { count: Math.round(clamp(rr / 3.4, 6, 14)), size, seed: c.seed });
    }
  }
  if (variant === 'cd4' && act && c.hi && o.cytokines !== false) {
    const cl = cytokineCloud({ count: 8, radius: rr * 0.42, inner: rr * 0.05, seed: c.seed, size: clamp(rr * 0.085, 2, 5), color, stage: c.stage });
    cl.setAttribute('transform', `translate(${n(Math.cos(pol) * rr * 1.42)} ${n(Math.sin(pol) * rr * 1.42)})`);
    g.appendChild(cl);
  }
  return g;
}

/**
 * B cell. bCell({ r:25, seed, state:'resting'|'activated', polarity, receptors, key, stage })
 * key: clone identity (keys.js) — receptors become notched tips (one shared notch per clone).
 * Silhouette: round, smoother membrane than a T cell (sparse fuzz), gold Y-shaped BCRs.
 * activated: larger, brighter, BCRs capped toward `polarity`.
 */
export function bCell(o = {}) {
  const state = o.state || 'resting';
  const c = baseOpts(o, 25);
  const color = o.color || PALETTE.bCell;
  const act = state === 'activated';
  const intensity = act ? 1.25 : 1;
  const T = cellTones(color, c, { intensity });
  const R = rng(c.seed, 'b');
  const rr = c.r * (act ? 1.12 : 1);
  const rf = blobRadius({ r: rr, seed: c.seed, irregularity: 0.16 });
  const g = rootG('bcell', c, { 'data-state': state, 'data-key': o.key != null ? String(o.key) : null });
  const { pts, d } = blobBody(c, T, rf);
  addHalo(g, c, T, rr * 1.55, { intensity });
  if (c.hi) g.appendChild(part('microvilli', {}, [microvilliPath(c, T, pts, { seed: c.seed, spacing: clamp(rr * 0.2, 3, 9), len: clamp(rr * 0.06, 1.1, 3.5), opacity: 0.7 })]));
  addBody(g, c, T, d, bodyFill(color, c.stage, { intensity }));
  const nAng = R.range(0, TAU);
  g.appendChild(nucleusBlob(c, T, { cx: Math.cos(nAng) * rr * 0.08, cy: Math.sin(nAng) * rr * 0.08, nr: rr * 0.6, seed: c.seed, chromatin: 0.85, clumped: true, nucleoli: 0 }).g);
  addSheen(g, c, T, d);
  finish(g, c, { kind: 'bCell', state, color, extent: extentOf(pts), outline: pts, regen: (t, e) => ({ d: smoothPath(polarPoints(rf, pts.length, t, e)) }), radiusFn: rf, rEff: rr });
  if (c.receptors) {
    const size = clamp(rr * 0.4, 6, 24);
    // key: clone identity (keys.js) — receptors drawn as notched tips in the B cell's gold
    const rec = o.key != null ? (op) => tcrKey({ ...op, key: o.key, color }) : bcr;
    if (act) placeOnMembrane(g, rec, { count: Math.round(clamp(rr / 4, 5, 11)), arcStart: (o.polarity ?? 0) - 55, arcEnd: (o.polarity ?? 0) + 55, size, seed: c.seed });
    else placeOnMembrane(g, rec, { count: Math.round(clamp(rr / 3.4, 6, 13)), size, seed: c.seed });
  }
  return g;
}

/**
 * Plasma cell — antibody factory. plasmaCell({ r:34, seed, secreting:true, stage })
 * Silhouette: oval, eccentric "clock-face" nucleus, layered rough-ER arcs, pale Golgi zone;
 * secreting:true adds small gold antibodies drifting away (part 'antibodies').
 */
export function plasmaCell(o = {}) {
  const c = baseOpts(o, 34);
  const color = o.color || PALETTE.plasma;
  const T = cellTones(color, c, { intensity: 1.05 });
  const R = rng(c.seed, 'plasma');
  const axis = (o.angle ?? R.range(-30, 30)) * DEG;
  const rf = blobRadius({ r: c.r, seed: c.seed, irregularity: 0.18, squash: 0.18, squashAngle: axis });
  const g = rootG('plasmacell', c);
  const { pts, d } = blobBody(c, T, rf);
  addHalo(g, c, T, c.r * 1.55);
  addBody(g, c, T, d, bodyFill(color, c.stage, { intensity: 1.05 }));
  const ncx = -Math.cos(axis) * c.r * 0.42, ncy = -Math.sin(axis) * c.r * 0.42;
  const nr = c.r * 0.38;
  if (c.hi) {
    // rough ER: concentric arcs around the nucleus, studded with ribosome dots
    const cy = part('er', { class: 'sao-er' });
    const er = erArcs(c, rf, ncx, ncy, nr, axis);
    const dd = er.dots;
    cy.appendChild(el('path', { d: er.d, fill: 'none', stroke: T.detail, 'stroke-opacity': n(T.detailOpacity * 1.2), 'stroke-width': n(strokeW(c, 0.55)), 'stroke-linecap': 'round' }));
    cy.appendChild(el('path', { d: dd, fill: T.detail, 'fill-opacity': n(T.detailOpacity * 1.3) }));
    g.appendChild(cy);
    // Golgi: pale zone beside the nucleus
    g.appendChild(el('circle', {
      'data-part': 'golgi', cx: n(ncx + Math.cos(axis) * nr * 1.15), cy: n(ncy + Math.sin(axis) * nr * 1.15), r: n(nr * 0.55),
      fill: c.stage === 'light' ? WHITE : mix(color, WHITE, 0.6), 'fill-opacity': c.stage === 'light' ? 0.55 : 0.12,
    }));
  }
  // clock-face nucleus: chromatin clumps around the rim
  const nuc = nucleusBlob(c, T, { cx: ncx, cy: ncy, nr, seed: c.seed, chromatin: 0, nucleoli: 0, irregularity: 0.12 });
  if (c.hi) {
    let dc = '';
    const k = 8;
    for (let i = 0; i < k; i++) {
      const a = (i / k) * TAU + R.range(-0.15, 0.15);
      dc += ellipseD(ncx + Math.cos(a) * nr * 0.66, ncy + Math.sin(a) * nr * 0.66, nr * 0.16, nr * 0.1, (a * 180) / Math.PI);
    }
    dc += circleD(ncx, ncy, nr * 0.16);
    nuc.g.appendChild(el('path', { 'data-part': 'chromatin', d: dc, fill: T.chromatin, 'fill-opacity': n(Math.min(1, T.chromatinOpacity * 1.3)) }));
  }
  g.appendChild(nuc.g);
  addSheen(g, c, T, d);
  finish(g, c, { kind: 'plasmaCell', color, extent: extentOf(pts), outline: pts, regen: (t, e) => ({ d: smoothPath(polarPoints(rf, pts.length, t, e)) }), radiusFn: rf });
  if (o.secreting !== false && c.hi) {
    const ab = part('antibodies');
    const count = o.antibodies ?? 5;
    for (let i = 0; i < count; i++) {
      const a = axis + R.range(-0.9, 0.9);
      const dist = c.r * R.range(1.2, 1.9);
      const y = antibody({ size: clamp(c.r * 0.3, 6, 18), stage: c.stage, anchor: 'center', detail: 'low' });
      y.setAttribute('transform', `translate(${n(Math.cos(a) * dist)} ${n(Math.sin(a) * dist)}) rotate(${n(R.range(-180, 180))})`);
      ab.appendChild(y);
    }
    g.appendChild(ab);
  }
  return g;
}

function erArcs(c, rf, ncx, ncy, nr, axis) {
  let d = '', dots = '';
  const dr = Math.max(0.35, c.r * 0.014);
  for (let k = 0; k < 5; k++) {
    const rad = nr * (1.45 + k * 0.32);
    const a0 = axis - 1.05 + k * 0.04, a1 = axis + 1.05 - k * 0.04;
    const steps = 16;
    let pen = false;
    for (let s = 0; s <= steps; s++) {
      const a = lerp(a0, a1, s / steps);
      const x = ncx + Math.cos(a) * rad, y = ncy + Math.sin(a) * rad;
      const inside = Math.hypot(x, y) < rf(Math.atan2(y, x)) * 0.86;
      if (!inside) { pen = false; continue; }
      d += (pen ? 'L' : 'M') + n(x) + ' ' + n(y);
      if (s % 2 === 0) dots += circleD(x + Math.cos(a) * dr * 3, y + Math.sin(a) * dr * 3, dr);
      pen = true;
    }
  }
  return { d, dots };
}

/**
 * NK cell (natural killer). nkCell({ r:27, seed, state:'resting'|'activated', polarity, receptors })
 * Silhouette: round, kidney-shaped nucleus, LARGE visible granules; surface carries both
 * activating (green-cyan, plus) and inhibitory (crimson, bar) receptors.
 */
export function nkCell(o = {}) {
  const state = o.state || 'resting';
  const c = baseOpts(o, 27);
  const color = o.color || PALETTE.nk;
  const act = state === 'activated';
  const intensity = act ? 1.25 : 1;
  const T = cellTones(color, c, { intensity });
  const R = rng(c.seed, 'nk');
  const rr = c.r * (act ? 1.1 : 1);
  const pol = c.polarity;
  const rf = blobRadius({ r: rr, seed: c.seed, irregularity: 0.24, bumps: act ? [{ angle: pol, amp: 0.08, width: 0.8 }] : [] });
  const g = rootG('nkcell', c, { 'data-state': state });
  const { pts, d } = blobBody(c, T, rf);
  addHalo(g, c, T, rr * 1.55, { intensity });
  if (c.hi) g.appendChild(part('microvilli', {}, [microvilliPath(c, T, pts, { seed: c.seed, opacity: 0.8, spacing: clamp(rr * 0.12, 2.6, 6) })]));
  addBody(g, c, T, d, bodyFill(color, c.stage, { intensity }));
  const nAng = act ? pol + Math.PI : R.range(0, TAU);
  const ncx = Math.cos(nAng) * rr * 0.2, ncy = Math.sin(nAng) * rr * 0.2;
  g.appendChild(nucleusBlob(c, T, { cx: ncx, cy: ncy, nr: rr * 0.48, seed: c.seed, shape: 'kidney', indent: 0.32, indentAngle: nAng + Math.PI, chromatin: 0.8, clumped: true, nucleoli: 0 }).g);
  const gAng = nAng + Math.PI;
  const list = scatterInDisc(R.fork('g'), {
    count: c.hi ? 12 : 7, radius: rr * 0.84, size: rr * 0.085, sizeJitter: 0.35, gap: rr * 0.02,
    avoid: [{ x: ncx, y: ncy, r: rr * 0.42 }], bias: { angle: gAng, spread: act ? 0.5 : 0.9 },
  });
  g.appendChild(granulesG(c, T, list));
  addSheen(g, c, T, d);
  finish(g, c, { kind: 'nkCell', state, color, extent: extentOf(pts), outline: pts, regen: (t, e) => ({ d: smoothPath(polarPoints(rf, pts.length, t, e)) }), radiusFn: rf, rEff: rr });
  if (c.receptors) {
    placeOnMembrane(g, (op, i) => (i % 2 ? nkInhibitory({ ...op, icon: false }) : nkActivating({ ...op, icon: false })), {
      count: Math.round(clamp(rr / 3.4, 6, 14)), size: clamp(rr * 0.34, 5, 20), seed: c.seed,
    });
  }
  return g;
}

// ---------------------------------------------------------------- myeloid cells

/**
 * Macrophage. macrophage({ r:60, seed, polarization:0..1, variant:'m1'|'tam', state:'resting'|'activated'|'engulfing',
 *                          polarity, receptors:false })
 * r = overall extent. Silhouette: big, amoeboid, ruffled edge folds, pseudopods, vacuoles.
 * polarization (continuous, fully reversible): 0 = fight end ("M1-like", coral, spiky pseudopods,
 *   few vacuoles) → 1 = repair end (dusky rose, smoother, broader lamellae, slightly elongated,
 *   more vacuoles). Color, outline and vacuoles interpolate smoothly — safe to drive from a slider.
 *   variant:'m1' ≡ 0.12, variant:'tam' (alias 'm2') ≡ 0.88. A tumor-associated macrophage is
 *   polarization ≥ 0.8 — label it "tumor-associated macrophage", never "M2".
 * engulfing: a phagocytic cup opens toward `polarity` (put the prey at cellInfo(m).mouth).
 * activated (fight side): coral cytokine dots.  Extra parts: ruffles, vacuoles (vacuole ×8), cytokines.
 */
export function macrophage(o = {}) {
  const pRaw = o.polarization != null ? clamp(+o.polarization, 0, 1) : (o.variant === 'm2' || o.variant === 'tam' ? 0.88 : 0.12);
  const p = Math.round(pRaw * 50) / 50; // quantized so a slider can't spawn endless gradients
  const variant = p >= 0.8 ? 'tam' : p <= 0.25 ? 'm1' : 'mixed';
  const state = o.state || 'resting';
  const c = baseOpts(o, 60);
  const color = o.color || mix(PALETTE.m1, PALETTE.m2, p);
  const T = cellTones(color, c, { intensity: state === 'activated' ? 1.2 : 1 });
  const R = rng(c.seed, 'mac');
  const pol = c.polarity;
  const eng = state === 'engulfing';
  const rb = c.r * lerp(0.66, 0.77, p);
  const squashA = R.range(0, TAU);
  const body = blobRadius({
    r: rb, seed: c.seed, irregularity: lerp(0.75, 0.38, p), ruffle: lerp(1.35, 0.4, p), ruffleK: 12,
    bumps: eng ? [{ angle: pol, amp: -0.3, width: 0.42 }] : [], kMax: 5, squash: lerp(0, 0.2, p), squashAngle: squashA,
  });
  const arms = [];
  // irregular angular spacing so the silhouette never reads as a polygon
  const gaps = Array.from({ length: 4 }, () => R.range(0.75, 1.6));
  const gsum = gaps.reduce((a, b) => a + b, 0);
  let acc = R.range(0, TAU);
  for (let i = 0; i < 4; i++) {
    const a = acc;
    acc += (gaps[i] / gsum) * TAU;
    const L1 = R.range(0.24, 0.42), L2 = R.range(0.06, 0.12);
    const b1 = R.range(0.28, 0.4), b2 = R.range(0.5, 0.64);
    const t1 = R.range(0.05, 0.08);
    const bend = R.range(-0.7, 0.7), ph = R.range(0, 6), ws = R.range(0.35, 0.7), wp = R.range(0, 6);
    if (eng && Math.cos(a - pol) > 0.2) continue;
    arms.push({
      angle: a, length: c.r * lerp(L1, L2, p), base: rb * lerp(b1, b2, p), tip: c.r * lerp(t1, 0.17, p),
      bend: bend * lerp(1, 0.5, p), taper: lerp(1.35, 1.0, p), ruffle: lerp(0.16, 0.05, p), rufflePhase: ph,
      wave: 0.16, waveSpeed: ws, wavePhase: wp,
    });
    // fine filopodia on the fight side; they retract toward the repair end
    const fa = a + ((gaps[i] / gsum) * TAU) * R.range(0.35, 0.65);
    const fl = c.r * R.range(0.1, 0.17) * (1 - p);
    const fb = R.range(-0.5, 0.5); // drawn unconditionally so the random stream never shifts with p
    if (!eng && fl > c.r * 0.015) arms.push({ angle: fa, length: fl, base: rb * 0.09, tip: c.r * 0.016, bend: fb, taper: 1.6 });
  }
  if (eng) {
    for (const s2 of [-1, 1]) {
      arms.push({ angle: pol + s2 * 0.7, length: c.r * 0.44, base: rb * 0.36, tip: c.r * 0.085, bend: -s2 * 1.45, taper: 1.2, ruffle: 0.08, wave: 0.08, waveSpeed: 0.6, wavePhase: s2 });
    }
  }
  const step = clamp(c.r * 0.06, 2.2, 6);
  const build = (t = 0, extra) => armOutline((th, tt) => body(th, tt, extra), arms, { t, step, waveT: extra && extra.waveT });
  const pts = build(0);
  const d = smoothPath(pts, { smooth: 0.3 });
  const g = rootG('macrophage', c, { 'data-variant': variant, 'data-state': state, 'data-polarization': n(p) });
  addHalo(g, c, T, c.r * 1.2);
  addBody(g, c, T, d, bodyFill(color, c.stage, { r: rb * 1.12, intensity: T._k }));
  const nAng = eng ? pol + Math.PI : R.range(0, TAU);
  const ncx = Math.cos(nAng) * rb * 0.24, ncy = Math.sin(nAng) * rb * 0.24;
  if (c.hi) {
    // ruffled membrane folds just inside the edge (the "veil" look of a crawling macrophage)
    g.appendChild(part('ruffles', {}, [el('path', {
      d: edgeFolds(R.fork('folds'), pts, { count: 12, depth: c.r * 0.045, len: 7 }),
      fill: 'none', stroke: T.rim, 'stroke-opacity': n((c.stage === 'light' ? 0.45 : 0.34) * lerp(1, 0.7, p)), 'stroke-width': n(strokeW(c, 0.45)), 'stroke-linecap': 'round',
    })]));
    // vacuoles fade in one by one as the cell moves toward the repair end
    const vac = part('vacuoles', { class: 'sao-vacuoles' });
    const list = scatterInDisc(R.fork('vac'), {
      count: 8, radius: rb * 0.78, size: rb * 0.09, sizeJitter: 0.45,
      avoid: [{ x: ncx, y: ncy, r: rb * 0.46 }], gap: rb * 0.04,
    });
    const shown = lerp(3.5, 8, p);
    list.forEach((q, i) => {
      const op = clamp(shown - i, 0, 1);
      if (op <= 0) return;
      const RR = R.fork(`v${i}`);
      let dd = '';
      for (let j = 0; j < 2; j++) dd += circleD(q.x + RR.range(-0.4, 0.4) * q.r, q.y + RR.range(-0.4, 0.4) * q.r, q.r * RR.range(0.15, 0.28));
      vac.appendChild(el('g', { 'data-part': 'vacuole', opacity: op < 1 ? n(op) : null }, [
        el('path', {
          d: circleD(q.x, q.y, q.r), fill: c.stage === 'light' ? mix(color, WHITE, 0.88) : mix(shadeHex(color, 0.7), '#0B1024', 0.3), 'fill-opacity': 0.85,
          stroke: T.detail, 'stroke-opacity': n(T.detailOpacity * 1.6), 'stroke-width': n(strokeW(c, 0.5)),
        }),
        el('path', { d: dd, fill: T.detail, 'fill-opacity': n(T.detailOpacity * 1.3) }),
      ]));
    });
    g.appendChild(vac);
    g.appendChild(part('cytoplasm', {}, [el('path', {
      d: speckles(R.fork('cyto'), 0, 0, rb * 0.85, 26, rb * 0.016, 0.5), fill: T.detail, 'fill-opacity': n(T.detailOpacity),
    })]));
  }
  g.appendChild(nucleusBlob(c, T, {
    cx: ncx, cy: ncy, nr: rb * 0.4, seed: c.seed, shape: 'kidney', indent: 0.3, indentAngle: nAng + Math.PI,
    squash: 0.12, squashAngle: nAng, chromatin: 0.55, nucleoli: 1,
  }).g);
  addSheen(g, c, T, smoothPath(polarPoints(body, 40)));
  finish(g, c, {
    kind: 'macrophage', variant, state, color, polarization: p, extent: extentOf(pts), outline: pts,
    regen: (t, e) => ({ d: smoothPath(build(t, e), { smooth: 0.3 }) }), bodyR: rb,
    mouth: eng ? { x: Math.cos(pol) * c.r * 0.62, y: Math.sin(pol) * c.r * 0.62 } : null,
  });
  if (c.receptors && o.receptors) placeOnMembrane(g, (op) => mhc2({ ...op }), { count: 10, size: clamp(c.r * 0.16, 6, 16), seed: c.seed });
  if (state === 'activated' && p < 0.5 && c.hi && o.cytokines !== false) {
    const cl = cytokineCloud({ count: 9, radius: c.r * 0.32, inner: c.r * 0.05, seed: c.seed, size: clamp(c.r * 0.045, 2, 5), color, stage: c.stage });
    cl.setAttribute('transform', `translate(${n(Math.cos(pol) * c.r * 1.1)} ${n(Math.sin(pol) * c.r * 1.1)})`);
    g.appendChild(cl);
  }
  return g;
}

/**
 * Mast cell — a tissue sentinel packed with histamine granules. mastCell({ r:30, seed, stage,
 *   release:0..1 })
 * Silhouette: pale lilac-gray body DENSELY packed with deep-indigo granules, round nucleus
 * (clearly unlike the pale-pink, lobed neutrophil or the orange NK cell).
 * release (or setDegranulation(cell, p) afterwards — seekable, no clock): outer granules drift
 * out through the membrane, slightly shrinking — "it empties its granules". Parts: granules
 * (granule ×N), nucleus.
 */
export function mastCell(o = {}) {
  const c = baseOpts(o, 30);
  const color = o.color || PALETTE.mast;
  const T = cellTones(color, c, { intensity: 1.05 });
  const R = rng(c.seed, 'mast');
  const rf = blobRadius({ r: c.r, seed: c.seed, irregularity: 0.32, ruffle: 0.18, ruffleK: 14 });
  const g = rootG('mast', c);
  const { pts, d } = blobBody(c, T, rf);
  addHalo(g, c, T, c.r * 1.5);
  addBody(g, c, T, d, bodyFill(color, c.stage, { intensity: 1.05 }));
  const nAng = R.range(0, TAU);
  const ncx = Math.cos(nAng) * c.r * 0.08, ncy = Math.sin(nAng) * c.r * 0.08;
  g.appendChild(nucleusBlob(c, T, { cx: ncx, cy: ncy, nr: c.r * 0.32, seed: c.seed, irregularity: 0.1, chromatin: 0.4, nucleoli: 0 }).g);
  const gc = PALETTE.mastGranule;
  const dark = c.stage === 'dark';
  const list = scatterInDisc(R.fork('g'), {
    count: c.hi ? 48 : 20, radius: c.r * 0.88, size: c.r * (c.hi ? 0.062 : 0.08), sizeJitter: 0.3, gap: c.r * 0.006,
    avoid: [{ x: ncx, y: ncy, r: c.r * 0.2 }],
  });
  const gg = part('granules', { class: 'sao-granules' });
  const gran = [];
  list.forEach((q, i) => {
    const dist = Math.hypot(q.x, q.y), a = Math.atan2(q.y, q.x) + R.range(-0.25, 0.25);
    const out = c.r * R.range(1.15, 1.85);
    const node = el('circle', {
      'data-part': 'granule', cx: n(q.x), cy: n(q.y), r: n(q.r),
      fill: dark ? mix(gc, '#0B1024', 0.05) : gc,
      stroke: dark ? mix(gc, WHITE, 0.45) : 'none', 'stroke-width': n(Math.max(0.3, q.r * 0.3)), 'stroke-opacity': 0.7,
    });
    gg.appendChild(node);
    gran.push({ node, x0: q.x, y0: q.y, r0: q.r, x1: Math.cos(a) * out, y1: Math.sin(a) * out, delay: (1 - dist / (c.r * 0.88)) * 0.5, moves: dist > c.r * 0.38 });
  });
  g.appendChild(gg);
  addSheen(g, c, T, d);
  finish(g, c, { kind: 'mastCell', color, extent: extentOf(pts), outline: pts, regen: (t, e) => ({ d: smoothPath(polarPoints(rf, pts.length, t, e)) }), radiusFn: rf, granules: gran });
  if (o.release) setDegranulation(g, o.release);
  return g;
}

/** Seekable mast-cell degranulation: p 0 (packed) → 1 (outer granules released). No clock. */
export function setDegranulation(cell, p) {
  const info = cellInfo(cell);
  if (!info || !info.granules) return;
  p = clamp(+p || 0, 0, 1);
  for (const q of info.granules) {
    if (!q.moves) continue;
    const t = clamp((p - q.delay) / 0.5, 0, 1);
    const e = t * t * (3 - 2 * t);
    q.node.setAttribute('cx', n(lerp(q.x0, q.x1, e)));
    q.node.setAttribute('cy', n(lerp(q.y0, q.y1, e)));
    q.node.setAttribute('r', n(q.r0 * lerp(1, 0.82, e)));
    if (e > 0) q.node.setAttribute('opacity', n(lerp(1, 0.78, e))); else q.node.removeAttribute('opacity');
  }
  cell.setAttribute('data-release', n(p));
}

/**
 * Dendritic cell — scout & courier. dendriticCell({ r:70, seed, state:'immature'|'mature',
 *   receptors, peptide:'foreign'|'self' })
 * r = overall extent (dendrite tips). Silhouette: star-shaped with long, branching dendrites.
 *  • immature — shorter, thicker processes; many endocytic vesicles (it is sampling).
 *  • mature   — long, thin, branched dendrites; surface studded with MHC-II (+peptide) and B7.
 * Animate dendrite waving with animate.breathe(cell) (uses the dendrite wave model).
 * maturity: 0..1 (continuous; overrides state) — the same cell maturing: processes lengthen,
 *   thin and branch, vesicles empty, MHC-II + B7 windows fade in. Quantized to 0.05 steps.
 */
export function dendriticCell(o = {}) {
  if (o.maturity != null) return dendriticMaturing(o);
  const state = o.state === 'immature' ? 'immature' : 'mature';
  const c = baseOpts(o, 70);
  const color = o.color || PALETTE.dendritic;
  const mature = state === 'mature';
  const intensity = mature ? 1.12 : 1;
  const T = cellTones(color, c, { intensity });
  const R = rng(c.seed, `dc-${state}`);
  const rb = c.r * (mature ? 0.33 : 0.42);
  const body = blobRadius({ r: rb, seed: c.seed, irregularity: 0.5, kMax: 5 });
  const arms = [];
  const k = mature ? R.int(7, 9) : R.int(5, 6);
  const offs = R.range(0, TAU);
  for (let i = 0; i < k; i++) {
    const a = offs + (i / k) * TAU + R.range(-0.25, 0.25);
    const L = (c.r * 1.02 - rb) * (mature ? R.range(0.72, 1) : R.range(0.38, 0.62));
    const branches = [];
    if (mature && R.chance(0.8)) branches.push({ at: R.range(0.3, 0.55), side: R.sign(), angle: R.range(0.5, 0.85), length: L * R.range(0.3, 0.45), base: rb * 0.09, tip: c.r * 0.01, bend: R.range(-0.5, 0.5), taper: 1.6, curl: 0.2 });
    if (mature && R.chance(0.3)) branches.push({ at: R.range(0.65, 0.8), side: R.sign(), angle: R.range(0.4, 0.7), length: L * 0.22, base: rb * 0.05, tip: c.r * 0.012, bend: 0.2, taper: 1.5 });
    arms.push({
      angle: a, length: L, base: rb * (mature ? R.range(0.24, 0.32) : R.range(0.3, 0.38)), tip: c.r * (mature ? 0.011 : 0.03),
      bend: R.range(-0.6, 0.6), taper: mature ? 2.0 : 1.6, branches,
      curl: mature ? R.range(0.12, 0.28) * R.sign() : 0.12, curlPhase: R.range(0, TAU),
      wave: 0.22, waveSpeed: R.range(0.35, 0.7), wavePhase: R.range(0, TAU),
    });
  }
  const step = clamp(c.r * 0.045, 1.6, 5);
  const build = (t = 0, extra) => armOutline((th, tt) => body(th, tt, extra), arms, { t, step, waveT: extra && extra.waveT });
  const pts = build(0);
  const d = smoothPath(pts, { smooth: 0.32 });
  const g = rootG('dendritic', c, { 'data-state': state });
  addHalo(g, c, T, rb * 2.3, { intensity });
  const mem = addBody(g, c, T, d, bodyFill(color, c.stage, { r: rb * 1.05, intensity }));
  mem.setAttribute('stroke-width', n(strokeW(c, 0.6)));
  const nAng = R.range(0, TAU);
  const ncx = Math.cos(nAng) * rb * 0.15, ncy = Math.sin(nAng) * rb * 0.15;
  if (c.hi) {
    const ves = scatterInDisc(R.fork('ves'), {
      count: mature ? 4 : 10, radius: rb * 0.85, size: rb * (mature ? 0.07 : 0.085), sizeJitter: 0.4, avoid: [{ x: ncx, y: ncy, r: rb * 0.55 }],
    });
    let dv = '';
    for (const p of ves) dv += circleD(p.x, p.y, p.r);
    g.appendChild(part('vacuoles', {}, [el('path', {
      d: dv, fill: c.stage === 'light' ? WHITE : mix(color, '#0B1024', 0.7), 'fill-opacity': 0.8,
      stroke: T.detail, 'stroke-opacity': n(T.detailOpacity * 1.6), 'stroke-width': n(strokeW(c, 0.4)),
    })]));
  }
  g.appendChild(nucleusBlob(c, T, { cx: ncx, cy: ncy, nr: rb * 0.5, seed: c.seed, shape: 'irregular', irregularity: 0.2, chromatin: 0.6, nucleoli: 1 }).g);
  addSheen(g, c, T, smoothPath(polarPoints(body, 32)));
  finish(g, c, { kind: 'dendriticCell', state, color, extent: extentOf(pts), outline: pts, regen: (t, e) => ({ d: smoothPath(build(t, e), { smooth: 0.32 }) }), bodyR: rb, arms });
  if (c.receptors) {
    // present on the body and along the dendrites
    const pep = o.peptide || (mature ? 'foreign' : 'self');
    const count = mature ? Math.round(clamp(c.r / 4.5, 8, 22)) : Math.round(clamp(c.r / 7, 5, 12));
    placeOnMembrane(g, (op, i) => (mature && i % 3 === 2 ? b7(op) : mhc2({ ...op, peptide: pep })), {
      count, size: clamp(c.r * 0.12, 5, 14), seed: c.seed,
    });
  }
  return g;
}

/**
 * Continuous dendritic-cell maturation (maturity 0 = immature, 1 = mature): one cell whose
 * processes lengthen, thin and branch, whose vesicles empty, and whose MHC-II windows (with
 * pink peptides) and B7 appear — smooth enough to drive from a tween (quantized to 0.05).
 */
function dendriticMaturing(o) {
  const m = Math.round(clamp(+o.maturity, 0, 1) * 20) / 20;
  const sm = (a, b) => { const t = clamp((m - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  const c = baseOpts(o, 70);
  const color = o.color || PALETTE.dendritic;
  const intensity = lerp(1, 1.12, m);
  const T = cellTones(color, c, { intensity });
  const R = rng(c.seed, 'dc-maturing');
  const rb = c.r * lerp(0.42, 0.33, m);
  const body = blobRadius({ r: rb, seed: c.seed, irregularity: 0.5, kMax: 5 });
  const arms = [];
  const k = R.int(7, 8);
  const offs = R.range(0, TAU);
  for (let i = 0; i < k; i++) {
    const a = offs + (i / k) * TAU + R.range(-0.25, 0.25);
    const span = c.r * 1.02 - c.r * 0.33;
    const L = span * lerp(R.range(0.3, 0.55), R.range(0.72, 1), m);
    const bAt = R.range(0.3, 0.55), bSide = R.sign(), bAng = R.range(0.5, 0.85), bLen = R.range(0.3, 0.45), bBend = R.range(-0.5, 0.5);
    const branches = [];
    const bl = sm(0.35, 1);
    if (bl > 0.05 && i % 4 !== 3) branches.push({ at: bAt, side: bSide, angle: bAng, length: L * bLen * bl, base: rb * 0.09, tip: c.r * 0.01, bend: bBend, taper: 1.6, curl: 0.2 });
    const base = R.range(0.24, 0.32), base0 = R.range(0.3, 0.38), bend = R.range(-0.6, 0.6), curl = R.range(0.12, 0.28) * R.sign();
    arms.push({
      angle: a, length: L, base: rb * lerp(base0, base, m), tip: c.r * lerp(0.03, 0.011, m),
      bend, taper: lerp(1.6, 2.0, m), branches, curl: lerp(0.12, curl, m), curlPhase: R.range(0, TAU),
      wave: 0.22, waveSpeed: R.range(0.35, 0.7), wavePhase: R.range(0, TAU),
    });
  }
  const step = clamp(c.r * 0.045, 1.6, 5);
  const build = (t = 0, extra) => armOutline((th, tt) => body(th, tt, extra), arms, { t, step, waveT: extra && extra.waveT });
  const pts = build(0);
  const d = smoothPath(pts, { smooth: 0.32 });
  const state = m >= 0.5 ? 'mature' : 'immature';
  const g = rootG('dendritic', c, { 'data-state': state, 'data-maturity': n(m) });
  addHalo(g, c, T, rb * 2.3, { intensity });
  const mem = addBody(g, c, T, d, bodyFill(color, c.stage, { r: rb * 1.05, intensity }));
  mem.setAttribute('stroke-width', n(strokeW(c, 0.6)));
  const nAng = R.range(0, TAU);
  const ncx = Math.cos(nAng) * rb * 0.15, ncy = Math.sin(nAng) * rb * 0.15;
  if (c.hi) {
    const ves = scatterInDisc(R.fork('ves'), { count: 10, radius: rb * 0.85, size: rb * 0.08, sizeJitter: 0.4, avoid: [{ x: ncx, y: ncy, r: rb * 0.55 }] });
    const shown = lerp(10, 3.5, m);
    const vg = part('vacuoles');
    ves.forEach((p, i) => {
      const op = clamp(shown - i, 0, 1);
      if (op <= 0) return;
      vg.appendChild(el('path', {
        d: circleD(p.x, p.y, p.r), fill: c.stage === 'light' ? WHITE : mix(color, '#0B1024', 0.7), 'fill-opacity': n(0.8 * op),
        stroke: T.detail, 'stroke-opacity': n(T.detailOpacity * 1.6 * op), 'stroke-width': n(strokeW(c, 0.4)),
      }));
    });
    g.appendChild(vg);
  }
  g.appendChild(nucleusBlob(c, T, { cx: ncx, cy: ncy, nr: rb * 0.5, seed: c.seed, shape: 'irregular', irregularity: 0.2, chromatin: 0.6, nucleoli: 1 }).g);
  addSheen(g, c, T, smoothPath(polarPoints(body, 32)));
  finish(g, c, { kind: 'dendriticCell', state, maturity: m, color, extent: extentOf(pts), outline: pts, regen: (t, e) => ({ d: smoothPath(build(t, e), { smooth: 0.32 }) }), bodyR: rb, arms });
  const showR = sm(0.3, 0.9);
  if (c.receptors && showR > 0.02) {
    const placed = placeOnMembrane(g, (op, i) => (i % 3 === 2 ? b7(op) : mhc2({ ...op, peptide: o.peptide || 'foreign' })), {
      count: Math.round(clamp(c.r / 4.5, 8, 22)), size: clamp(c.r * 0.12, 5, 14), seed: c.seed,
    });
    if (showR < 0.999 && placed[0]) placed[0].parentNode.setAttribute('opacity', n(showR));
  }
  return g;
}

/**
 * Neutrophil. neutrophil({ r:32, seed, state:'resting'|'crawling'|'activated', polarity, lobes:3 })
 * Silhouette: round, slightly ruffled, MULTI-LOBED nucleus, many fine granules.
 * crawling: broad ruffled front (lamellipodium) toward `polarity`, narrow uropod behind.
 */
export function neutrophil(o = {}) {
  const state = o.state || 'resting';
  const c = baseOpts(o, 32);
  const color = o.color || PALETTE.neutrophil;
  const T = cellTones(color, c, { intensity: state === 'activated' ? 1.2 : 1 });
  const R = rng(c.seed, 'neut');
  const pol = c.polarity;
  const crawl = state === 'crawling';
  let rf, pts, d, build = null;
  if (crawl) {
    // crawling: a broad, flattened, ruffled lamellipodium in front; the round body behind;
    // a small knob-like uropod trailing at the rear
    const body = blobRadius({
      r: c.r * 0.9, seed: c.seed, irregularity: 0.28,
      bumps: [{ angle: pol, amp: 0.2, width: 1.3 }, { angle: pol + Math.PI * 0.66, amp: -0.07, width: 0.45 }, { angle: pol - Math.PI * 0.66, amp: -0.07, width: 0.45 }],
      squash: -0.16, squashAngle: pol,
    });
    const fr = ringNoise(R.fork('front'), { kMin: 14, kMax: 24, amp: 0.06, falloff: 0.2, drift: 1.2 });
    rf = (th, t = 0, e) => {
      const front = Math.max(0, Math.cos(th - pol));
      return body(th, t, e) + c.r * fr(th, t) * front * front;
    };
    const arms = [{ angle: pol + Math.PI + R.range(-0.12, 0.12), length: c.r * 0.2, base: c.r * 0.2, tip: c.r * 0.155, taper: 0.8, bend: R.range(-0.2, 0.2), wave: 0.1, waveSpeed: 0.6 }];
    build = (t = 0, e) => armOutline((th, tt) => rf(th, tt, e), arms, { t, step: clamp(c.r * 0.06, 1.6, 4), waveT: e && e.waveT });
    pts = build(0);
    d = smoothPath(pts, { smooth: 0.32 });
  } else {
    rf = blobRadius({ r: c.r, seed: c.seed, irregularity: 0.22, ruffle: 0.3, ruffleK: 15 });
    ({ pts, d } = blobBody(c, T, rf));
  }
  const g = rootG('neutrophil', c, { 'data-state': state });
  addHalo(g, c, T, c.r * 1.5);
  addBody(g, c, T, d, bodyFill(color, c.stage, { intensity: T._k }));
  const lobes = o.lobes ?? R.int(3, 4);
  const nAng = crawl ? pol + Math.PI : R.range(0, TAU);
  const ncx = Math.cos(nAng) * c.r * (crawl ? 0.18 : 0.05), ncy = Math.sin(nAng) * c.r * (crawl ? 0.18 : 0.05);
  if (c.hi || c.r >= 12) {
    const list = scatterInDisc(R.fork('g'), { count: c.hi ? 46 : 12, radius: c.r * 0.88, size: c.r * 0.02, sizeJitter: 0.4, gap: c.r * 0.01 });
    const gg = granulesG({ ...c, hi: false }, T, list, { edge: false, color: c.stage === 'light' ? mix(color, '#1B1F2A', 0.45) : mix(color, WHITE, 0.25) });
    gg.firstChild.setAttribute('fill-opacity', c.stage === 'light' ? 0.55 : 0.6);
    g.appendChild(gg);
  }
  g.appendChild(nucleusLobed(c, T, { cx: ncx, cy: ncy, size: c.r * 0.6, lobes, seed: c.seed, spineAngle: nAng + R.range(-0.5, 0.5) }).g);
  if (c.hi && crawl) g.appendChild(part('ruffles', {}, [el('path', { d: edgeFolds(R.fork('f'), pts, { count: 5, depth: c.r * 0.08, len: 7, filter: (s) => Math.cos(Math.atan2(s.y, s.x) - pol) > 0.5 }), fill: 'none', stroke: T.rim, 'stroke-opacity': 0.35, 'stroke-width': n(strokeW(c, 0.5)), 'stroke-linecap': 'round' })]));
  addSheen(g, c, T, d);
  finish(g, c, { kind: 'neutrophil', state, color, extent: extentOf(pts), outline: pts, regen: build ? (t, e) => ({ d: smoothPath(build(t, e), { smooth: 0.32 }) }) : (t, e) => ({ d: smoothPath(polarPoints(rf, pts.length, t, e)) }), radiusFn: rf });
  return g;
}

/**
 * MDSC (myeloid-derived suppressor cell). mdsc({ r:22, seed })
 * Silhouette: small, irregular/angular, ring- or band-shaped immature nucleus, few granules.
 */
export function mdsc(o = {}) {
  const c = baseOpts(o, 22);
  const color = o.color || PALETTE.mdsc;
  const T = cellTones(color, c, { intensity: 0.95 });
  const R = rng(c.seed, 'mdsc');
  const bumps = [];
  for (let i = 0; i < 3; i++) bumps.push({ angle: R.range(0, TAU), amp: R.range(0.08, 0.16), width: R.range(0.2, 0.35) });
  const rf = blobRadius({ r: c.r, seed: c.seed, irregularity: 0.9, kMax: 7, bumps, ruffle: 0.2, ruffleK: 9 });
  const g = rootG('mdsc', c);
  const { pts, d } = blobBody(c, T, rf, { samples: c.hi ? 56 : 28 });
  addHalo(g, c, T, c.r * 1.5);
  addBody(g, c, T, d, bodyFill(color, c.stage));
  // band / ring-shaped immature nucleus (organic horseshoe)
  const nr = c.r * 0.34, w = c.r * 0.24;
  const bp = bandPoints(R.fork('band'), { cx: c.r * 0.04, cy: -c.r * 0.03, radius: nr * 0.9, a0: R.range(0, TAU), span: R.range(3.0, 3.5), width: w * 1.15, pinch: 0.5 });
  const ring = smoothPath(bp, { smooth: 0.3 });
  const ng = part('nucleus', { class: 'sao-nucleus' }, [el('path', {
    class: 'sao-nucleus-envelope', d: ring, fill: nucleusFill(color, c.stage), stroke: T.nucRim, 'stroke-width': n(strokeW(c, 0.6)), 'stroke-opacity': 0.75,
  })]);
  if (c.hi) ng.appendChild(el('path', { 'data-part': 'chromatin', d: speckles(R.fork('ch'), c.r * 0.04, -c.r * 0.03, nr * 1.05, 6, w * 0.14), fill: T.chromatin, 'fill-opacity': n(T.chromatinOpacity * 0.8) }));
  g.appendChild(ng);
  if (c.hi) {
    const list = scatterInDisc(R.fork('g'), { count: 5, radius: c.r * 0.8, size: c.r * 0.05, avoid: [{ x: 0, y: 0, r: nr + w }] });
    g.appendChild(granulesG(c, T, list));
  }
  addSheen(g, c, T, d);
  return finish(g, c, { kind: 'mdsc', color, extent: extentOf(pts), outline: pts, regen: (t, e) => ({ d: smoothPath(polarPoints(rf, pts.length, t, e)) }), radiusFn: rf });
}

// ---------------------------------------------------------------- tissue cells

/**
 * Healthy body cell (e.g. epithelial). healthyCell({ r:40, seed, state:'healthy'|'infected'|'stressed',
 *   mhc:true|count, peptides:['self',…] (pattern), shape:'polygon'|'round' })
 * Silhouette: calm rounded polygon, neat round central nucleus with one nucleolus;
 * MHC-I "shop windows" showing self peptides.
 *  • infected — virus particles inside; some MHC-I show foreign (hot pink) peptides.
 *  • stressed — stress ligands (NK "eat-me" flags) appear among the MHC-I.
 *  • necrotic — ruptured, messy death (setNecrotic at `progress`, default 0.75).
 */
export function healthyCell(o = {}) {
  const state = o.state || 'healthy';
  const c = baseOpts(o, 40);
  const color = o.color || PALETTE.healthy;
  const T = cellTones(color, c, { intensity: state === 'stressed' ? 0.9 : 1 });
  const R = rng(c.seed, 'healthy');
  const g = rootG('healthy', c, { 'data-state': state });
  let pts, d;
  if (o.shape === 'round') {
    const rf = blobRadius({ r: c.r, seed: c.seed, irregularity: 0.12 });
    ({ pts, d } = blobBody(c, T, rf));
  } else {
    const k = o.sides ?? R.int(5, 7);
    const off = R.range(0, TAU);
    const verts = [];
    for (let i = 0; i < k; i++) {
      const a = off + (i / k) * TAU + R.range(-0.18, 0.18);
      const rr = c.r * R.range(0.95, 1.07);
      verts.push([Math.cos(a) * rr, Math.sin(a) * rr]);
    }
    d = roundedPolygonPath(verts, 0.34);
    pts = roundedPolygonPoints(verts, 0.34, c.hi ? 8 : 4);
  }
  addHalo(g, c, T, c.r * 1.45);
  addBody(g, c, T, d, bodyFill(color, c.stage));
  if (c.hi) {
    const cy = part('cytoplasm', { class: 'sao-organelles' });
    let dm = '', dmi = '';
    const RR = R.fork('mito');
    for (let i = 0; i < 3; i++) {
      const a = RR.range(0, TAU), rr = c.r * RR.range(0.55, 0.7);
      const x = Math.cos(a) * rr, y = Math.sin(a) * rr, ang = a + Math.PI / 2 + RR.range(-0.5, 0.5);
      const L = c.r * 0.1;
      dm += capsuleD(x - Math.cos(ang) * L, y - Math.sin(ang) * L, x + Math.cos(ang) * L, y + Math.sin(ang) * L, c.r * 0.075);
      // cristae squiggle
      let s = '';
      for (let j = 0; j <= 6; j++) {
        const t = j / 6 - 0.5;
        const px = x + Math.cos(ang) * L * 1.6 * t + Math.cos(ang + Math.PI / 2) * c.r * 0.016 * (j % 2 ? 1 : -1);
        const py = y + Math.sin(ang) * L * 1.6 * t + Math.sin(ang + Math.PI / 2) * c.r * 0.016 * (j % 2 ? 1 : -1);
        s += (j ? 'L' : 'M') + n(px) + ' ' + n(py);
      }
      dmi += s;
    }
    cy.appendChild(el('path', { d: dm, fill: T.detail, 'fill-opacity': n(T.detailOpacity * 0.25), stroke: T.detail, 'stroke-opacity': n(T.detailOpacity * 0.9), 'stroke-width': n(strokeW(c, 0.4)) }));
    cy.appendChild(el('path', { d: dmi, fill: 'none', stroke: T.detail, 'stroke-opacity': n(T.detailOpacity * 0.7), 'stroke-width': n(strokeW(c, 0.28)), 'stroke-linejoin': 'round' }));
    const ves = scatterInDisc(RR.fork('v'), { count: 5, radius: c.r * 0.75, size: c.r * 0.03, avoid: [{ x: 0, y: 0, r: c.r * 0.45 }] });
    let dv = '';
    for (const p of ves) dv += circleD(p.x, p.y, p.r);
    cy.appendChild(el('path', { d: dv, fill: T.detail, 'fill-opacity': n(T.detailOpacity) }));
    g.appendChild(cy);
  }
  if (state === 'infected' && c.hi) {
    const vg = part('virions');
    const list = scatterInDisc(R.fork('vir'), { count: 6, radius: c.r * 0.72, size: c.r * 0.05, avoid: [{ x: 0, y: 0, r: c.r * 0.42 }] });
    let dv = '';
    for (const p of list) dv += hexD(p.x, p.y, p.r);
    vg.appendChild(el('path', { d: dv, fill: c.stage === 'light' ? PALETTE.virus : mix(PALETTE.virus, WHITE, 0.1), stroke: c.stage === 'light' ? mix(PALETTE.virus, '#1B1F2A', 0.4) : mix(PALETTE.virus, WHITE, 0.5), 'stroke-width': n(strokeW(c, 0.4)) }));
    g.appendChild(vg);
  }
  const nAng = R.range(0, TAU);
  g.appendChild(nucleusBlob(c, T, { cx: Math.cos(nAng) * c.r * 0.05, cy: Math.sin(nAng) * c.r * 0.05, nr: c.r * 0.36, seed: c.seed, irregularity: 0.08, chromatin: 0.5, nucleoli: 1 }).g);
  addSheen(g, c, T, d);
  finish(g, c, { kind: 'healthyCell', state, color, extent: extentOf(pts), outline: pts });
  if (state === 'necrotic') { setNecrotic(g, o.progress ?? 0.75, { seed: c.seed }); return g; }
  const nMhc = o.mhc === false ? 0 : typeof o.mhc === 'number' ? o.mhc : c.receptors ? Math.round(clamp(c.r / 4.5, 5, 16)) : 0;
  if (nMhc) {
    const pattern = o.peptides || (state === 'infected' ? ['self', 'viral', 'self'] : ['self']);
    if (state === 'stressed') {
      placeOnMembrane(g, (op, i) => (i % 2 ? stressLigand(op) : mhc1({ ...op, peptide: pattern[i % pattern.length] })), { count: nMhc, size: clamp(c.r * 0.26, 5, 18), seed: c.seed });
    } else {
      placeOnMembrane(g, (op, i) => mhc1({ ...op, peptide: pattern[i % pattern.length] }), { count: nMhc, size: clamp(c.r * 0.26, 5, 18), seed: c.seed });
    }
  }
  return g;
}

function hexD(cx, cy, r) {
  let d = '';
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * TAU;
    d += (i ? 'L' : 'M') + n(cx + Math.cos(a) * r) + ' ' + n(cy + Math.sin(a) * r);
  }
  return d + 'Z';
}

/**
 * Cancer cell. cancerCell({ r:46, seed, state:'visible'|'hidden'|'dying'|'dividing',
 *   mhc:count, peptides:[…], pdl1:true|count, nuclei:1|2, progress:0..1 (dying),
 *   antigens:{ shape, color, count }, clone:0..4 (sub-clone hue nudge) })
 * Silhouette: irregular, lumpy membrane; large misshapen nucleus with prominent nucleoli
 * (sometimes two nuclei).
 *  • visible  — MHC-I showing hot-pink neoantigen peptides (the "typo" in the shop window).
 *  • hidden   — MHC-I lost: no shop windows at all.
 *  • dying    — apoptosis: shrinking, membrane blebs, fragmented nucleus, dimmed color.
 *  • dividing — pinched peanut shape with two nuclei.
 *  • necrotic — swollen, torn and spilling (setNecrotic at `progress`, default 0.75); contrast with dying.
 * pdl1 adds PD-L1 (light crimson, square plug) among the MHC.
 */
export function cancerCell(o = {}) {
  const state = o.state || 'visible';
  const c = baseOpts(o, 46);
  let color = o.color || PALETTE.cancer;
  if (o.clone) color = mix(color, ['#B65FD8', '#D05FC0', '#9A67E0', '#C86FD0', '#A35CC8'][o.clone % 5], 0.7);
  const dying = state === 'dying';
  const p = clamp(o.progress ?? 0.7, 0, 1);
  const intensity = dying ? lerp(1, 0.55, p) : 1;
  const desat = dying ? 0.55 * p : 0;
  const T = cellTones(color, c, { intensity, desat });
  const R = rng(c.seed, 'cancer');
  const g = rootG('cancer', c, { 'data-state': state });
  const rr = c.r * (dying ? lerp(1, 0.82, p) : 1);
  const bumps = [];
  const lumpCount = R.int(3, 5);
  for (let i = 0; i < lumpCount; i++) bumps.push({ angle: R.range(0, TAU), amp: R.range(0.06, 0.13), width: R.range(0.22, 0.42) });
  const blebs = [];
  if (dying) {
    const kb = Math.round(lerp(3, 8, p));
    const a0 = R.range(0, TAU);
    for (let i = 0; i < kb; i++) blebs.push({ angle: a0 + (i / kb) * TAU + R.range(-0.25, 0.25), dist: R.range(0.93, 1.03), radius: R.range(0.17, 0.26) * (0.35 + 0.65 * p) });
  }
  const dividing = state === 'dividing';
  const axis = R.range(0, Math.PI);
  const rf0 = blobRadius({ r: rr, seed: c.seed, irregularity: dying ? 0.5 : 0.75, kMax: 7, bumps, blebs, ruffle: dying ? 0 : 0.18, ruffleK: 12 });
  const rf = dividing
    ? (th, t, e) => rf0(th, t, e) * (0.9 + 0.32 * Math.cos(2 * (th - axis)))
    : rf0;
  const { pts, d } = blobBody(c, T, rf, { samples: c.hi ? clamp(Math.round(rr * 1.4), 48, 110) : 32 });
  addHalo(g, c, T, rr * 1.42, { intensity, desat });
  addBody(g, c, T, d, bodyFill(color, c.stage, { intensity, desat }));
  if (c.hi && !dying) {
    const ves = scatterInDisc(R.fork('v'), { count: 7, radius: rr * 0.82, size: rr * 0.035, sizeJitter: 0.5, avoid: [{ x: 0, y: 0, r: rr * 0.55 }] });
    let dv = '';
    for (const q of ves) dv += circleD(q.x, q.y, q.r);
    g.appendChild(part('cytoplasm', {}, [el('path', { d: dv, fill: T.detail, 'fill-opacity': n(T.detailOpacity * 1.1) })]));
  }
  if (dying) {
    // karyorrhexis: the nucleus breaks into dense fragments
    const ng = part('nucleus', { class: 'sao-nucleus sao-nucleus-fragmented' });
    // early: pyknosis (one shrunken, dense nucleus); later: karyorrhexis (many uneven fragments)
    const frags = p < 0.5
      ? [{ x: rr * 0.04, y: -rr * 0.03, r: rr * lerp(0.42, 0.3, p / 0.5), irr: 0.6 }]
      : scatterInDisc(R.fork('frag'), { count: Math.round(lerp(5, 8, (p - 0.5) / 0.5)), radius: rr * lerp(0.42, 0.58, p), size: rr * lerp(0.13, 0.09, p), sizeJitter: 0.55, gap: rr * 0.012, tries: 80 });
    let df = '';
    for (const f of frags) {
      const rfF = blobRadius({ r: f.r, seed: `${c.seed}f${f.x}`, irregularity: f.irr ?? 0.45 });
      df += smoothPath(polarPoints(rfF, 16).map(([x, y]) => [x + f.x, y + f.y]));
    }
    const fragFill = c.stage === 'light' ? mix(color, '#1B1F2A', 0.5) : mix(shadeHex(T.base, 0.72), '#0B1024', 0.2);
    ng.appendChild(el('path', { d: df, fill: fragFill, stroke: c.stage === 'light' ? mix(color, '#1B1F2A', 0.65) : T.nucRim, 'stroke-width': n(strokeW(c, 0.5)), 'stroke-opacity': 0.7 }));
    g.appendChild(ng);
    // apoptotic bodies budding off
    if (c.hi && p > 0.45) {
      const bodies = part('blebs');
      const kb = Math.round(lerp(1, 4, (p - 0.45) / 0.55));
      for (let i = 0; i < kb; i++) {
        const a = R.range(0, TAU), dist = rr * R.range(1.08, 1.28);
        const br = rr * R.range(0.12, 0.2);
        const rfB = blobRadius({ r: br, seed: `${c.seed}b${i}`, irregularity: 0.2 });
        const dB = smoothPath(polarPoints(rfB, 18).map(([x, y]) => [x + Math.cos(a) * dist, y + Math.sin(a) * dist]));
        bodies.appendChild(el('path', { d: dB, fill: bodyFill(color, c.stage, { intensity, desat }), stroke: T.rim, 'stroke-opacity': n(T.rimOpacity * 0.8), 'stroke-width': n(strokeW(c, 0.7)) }));
      }
      g.appendChild(bodies);
    }
  } else {
    const nuclei = o.nuclei ?? (dividing ? 2 : R.chance(0.25) ? 2 : 1);
    if (nuclei >= 2) {
      // two nuclei of unequal size and shape, offset from each other (never a symmetric pair)
      const ax = dividing ? axis : R.range(0, TAU);
      const specs = dividing
        ? [{ s: -1, nr: 0.27, d: 0.36, off: 0.05 }, { s: 1, nr: 0.24, d: 0.38, off: -0.06 }]
        : [{ s: -1, nr: 0.34, d: 0.2, off: 0.1 }, { s: 1, nr: 0.24, d: 0.36, off: -0.14 }];
      for (const q of specs) {
        const px = -Math.sin(ax) * rr * q.off, py = Math.cos(ax) * rr * q.off;
        g.appendChild(nucleusBlob(c, T, {
          cx: Math.cos(ax) * rr * q.d * q.s + px, cy: Math.sin(ax) * rr * q.d * q.s + py, nr: rr * q.nr, seed: `${c.seed}${q.s}`,
          shape: 'irregular', irregularity: 0.38, squash: 0.12, squashAngle: ax + q.s, chromatin: 0.9, clumped: true,
          nucleoli: q.s < 0 ? 1 : 0, nucleolusSize: 0.2, name: 'nucleus',
        }).g);
      }
    } else {
      const a = R.range(0, TAU);
      g.appendChild(nucleusBlob(c, T, {
        cx: Math.cos(a) * rr * 0.07, cy: Math.sin(a) * rr * 0.07, nr: rr * 0.47, seed: c.seed,
        shape: 'irregular', irregularity: 0.3, chromatin: 1, clumped: true, nucleoli: R.int(2, 3), nucleolusSize: 0.14,
      }).g);
    }
  }
  addSheen(g, c, T, d);
  finish(g, c, {
    kind: 'cancerCell', state, color, extent: extentOf(pts), outline: pts,
    regen: (t, e) => ({ d: smoothPath(polarPoints(rf, pts.length, t, e)) }), radiusFn: rf,
  });
  if (state === 'necrotic') { setNecrotic(g, o.progress ?? 0.75, { seed: c.seed }); return g; }
  if (c.receptors && !dying) {
    const size = clamp(rr * 0.25, 5, 18);
    const nMhc = state === 'hidden' ? 0 : typeof o.mhc === 'number' ? o.mhc : o.mhc === false ? 0 : Math.round(clamp(rr / 5, 5, 14));
    const nPd = o.pdl1 === true ? Math.round(clamp(rr / 8, 4, 8)) : typeof o.pdl1 === 'number' ? o.pdl1 : 0;
    const pattern = o.peptides || ['neo', 'self', 'neo', 'self', 'self'];
    const glyphs = [];
    for (let i = 0; i < nMhc; i++) glyphs.push((op) => mhc1({ ...op, peptide: pattern[i % pattern.length] }));
    // interleave PD-L1 evenly among the MHC
    for (let j = 0; j < nPd; j++) glyphs.splice(Math.round(((j + 0.5) / nPd) * glyphs.length), 0, (op) => pdl1(op));
    if (glyphs.length) placeOnMembrane(g, (op, i) => glyphs[i](op), { count: glyphs.length, size, seed: c.seed, offset: 0.3 });
    if (o.antigens) {
      const ag = o.antigens;
      placeOnMembrane(g, (op) => antigen({ ...op, shape: ag.shape, color: ag.color }), { count: ag.count ?? 8, size: size * 0.95, seed: c.seed + 7, offset: 0.8, layer: 'antigens' });
    }
  }
  return g;
}

/**
 * Fibroblast / stroma. fibroblast({ r:70, seed, angle:deg })
 * r = half-length. Silhouette: spindle-shaped with two long tapering ends (S-curve),
 * elongated nucleus, faint stress fibres. Lay many in parallel to draw a stromal "wall".
 */
export function fibroblast(o = {}) {
  const c = baseOpts(o, 70);
  const color = o.color || PALETTE.fibroblast;
  const T = cellTones(color, c, { intensity: 1.12 });
  const R = rng(c.seed, 'fib');
  const ax = (o.angle ?? R.range(-20, 20)) * DEG;
  const rb = c.r * 0.3;
  const body = blobRadius({ r: rb, seed: c.seed, irregularity: 0.3, squash: 0.35, squashAngle: ax });
  const bendA = R.range(0.15, 0.35) * R.sign();
  const arms = [
    { angle: ax, length: c.r * R.range(0.58, 0.68), base: rb * 0.6, tip: c.r * 0.012, bend: bendA, taper: 1.7, wave: 0.06, waveSpeed: 0.5 },
    { angle: ax + Math.PI, length: c.r * R.range(0.58, 0.68), base: rb * 0.6, tip: c.r * 0.012, bend: bendA, taper: 1.7, wave: 0.06, waveSpeed: 0.5, wavePhase: 2 },
  ];
  if (R.chance(0.55)) arms.push({ angle: ax + Math.PI / 2 * R.sign() + R.range(-0.4, 0.4), length: c.r * R.range(0.2, 0.32), base: rb * 0.28, tip: c.r * 0.01, bend: R.range(-0.5, 0.5), taper: 1.8 });
  const step = clamp(c.r * 0.04, 1.5, 4);
  const build = (t = 0, e) => armOutline((th, tt) => body(th, tt, e), arms, { t, step, waveT: e && e.waveT });
  const pts = build(0);
  const d = smoothPath(pts, { smooth: 0.32 });
  const g = rootG('fibroblast', c);
  addHalo(g, c, T, rb * 2.4);
  addBody(g, c, T, d, bodyFill(color, c.stage, { r: c.r * 0.5, intensity: 1.12 }));
  if (c.hi) {
    let df = '';
    for (let i = -1; i <= 1; i++) {
      const off = i * rb * 0.35;
      const nx = -Math.sin(ax) * off, ny = Math.cos(ax) * off;
      const L = c.r * (0.62 - Math.abs(i) * 0.12);
      df += `M${n(nx - Math.cos(ax) * L)} ${n(ny - Math.sin(ax) * L)}Q${n(nx)} ${n(ny + bendA * 6)} ${n(nx + Math.cos(ax) * L)} ${n(ny + Math.sin(ax) * L)}`;
    }
    g.appendChild(part('cytoplasm', {}, [el('path', { d: df, fill: 'none', stroke: T.detail, 'stroke-opacity': n(T.detailOpacity * 0.8), 'stroke-width': n(strokeW(c, 0.35)) })]));
  }
  g.appendChild(nucleusBlob(c, T, { nr: rb * 0.62, seed: c.seed, shape: 'oval', squash: 0.75, squashAngle: ax, irregularity: 0.1, chromatin: 0.45, nucleoli: 1 }).g);
  addSheen(g, c, T, smoothPath(polarPoints(body, 32)));
  return finish(g, c, { kind: 'fibroblast', color, extent: extentOf(pts), outline: pts, regen: (t, e) => ({ d: smoothPath(build(t, e), { smooth: 0.32 }) }), angle: ax });
}

// ---------------------------------------------------------------- blood

/**
 * Red blood cell. redBloodCell({ r:14, seed, view:'face'|'side'|'tilted', angle:deg })
 * Background element for vessels: biconcave disc, muted so it never competes with immune cells.
 */
export function redBloodCell(o = {}) {
  const c = baseOpts(o, 14);
  const color = o.color || PALETTE.rbc;
  const view = o.view || 'face';
  const T = cellTones(color, c, { intensity: 0.85 });
  const dark = c.stage === 'dark';
  const g = rootG('rbc', c, { 'data-view': view });
  const ang = o.angle ?? 0;
  let d;
  if (view === 'side') {
    const w = c.r, h = c.r * 0.42, k = h * 0.45;
    d = `M${n(-w)} 0C${n(-w)} ${n(-h)} ${n(-w * 0.4)} ${n(-h)} 0 ${n(-k)}C${n(w * 0.4)} ${n(-h)} ${n(w)} ${n(-h)} ${n(w)} 0C${n(w)} ${n(h)} ${n(w * 0.4)} ${n(h)} 0 ${n(k)}C${n(-w * 0.4)} ${n(h)} ${n(-w)} ${n(h)} ${n(-w)} 0Z`;
  } else {
    const sy = view === 'tilted' ? 0.55 : 1;
    d = ellipseD(0, 0, c.r, c.r * sy, 0);
  }
  const fill = view === 'side'
    ? bodyFill(color, c.stage, { intensity: 0.85 })
    : (dark
      ? radialRbc(color, true)
      : radialRbc(color, false));
  if (c.glow) g.appendChild(el('circle', { 'data-part': 'glow', r: n(c.r * 1.3), fill: haloFill(color, c.stage, { intensity: 0.6 }) }));
  g.appendChild(part('membrane', {}, [el('path', { class: 'sao-membrane', d, fill, stroke: T.rim, 'stroke-opacity': dark ? 0.55 : 0.9, 'stroke-width': n(strokeW(c, 0.8)) })]));
  if (ang) g.setAttribute('data-angle', ang);
  if (ang) g.firstChild && [...g.children].forEach((ch) => ch.setAttribute('transform', `rotate(${n(ang)})`));
  return finish(g, c, { kind: 'redBloodCell', color, extent: c.r, outline: polarPoints(() => c.r, 24) });
}

function radialRbc(color, dark) {
  const base = resolve(color);
  return dark
    ? radialStops('rbc', [[0, mix(base, '#0B1024', 0.62)], [0.42, mix(base, '#0B1024', 0.5)], [0.78, mix(base, '#0B1024', 0.22)], [1, mix(base, '#0B1024', 0.35)]])
    : radialStops('rbc', [[0, mix(base, WHITE, 0.72)], [0.45, mix(base, WHITE, 0.62)], [0.8, mix(base, WHITE, 0.38)], [1, mix(base, WHITE, 0.45)]]);
}


/** Platelet. platelet({ r:6, seed, state:'resting'|'activated' }) — small irregular disc; activated = spiky. */
export function platelet(o = {}) {
  const c = baseOpts(o, 6);
  const color = o.color || PALETTE.platelet;
  const T = cellTones(color, c, { intensity: 0.9 });
  const R = rng(c.seed, 'plt');
  const act = o.state === 'activated';
  const body = blobRadius({ r: c.r * (act ? 0.7 : 1), seed: c.seed, irregularity: 0.6, squash: act ? 0 : 0.3, squashAngle: R.range(0, TAU) });
  const arms = act ? Array.from({ length: R.int(4, 6) }, (_, i) => ({ angle: (i / 5) * TAU + R.range(-0.3, 0.3), length: c.r * R.range(0.5, 0.9), base: c.r * 0.16, tip: c.r * 0.04, bend: R.range(-0.4, 0.4), taper: 1.6 })) : [];
  const pts = arms.length ? armOutline(body, arms, { step: Math.max(0.8, c.r * 0.12) }) : polarPoints(body, 20);
  const d = smoothPath(pts);
  const g = rootG('platelet', c, { 'data-state': act ? 'activated' : 'resting' });
  addHalo(g, c, T, c.r * 1.6);
  addBody(g, c, T, d, bodyFill(color, c.stage));
  const list = scatterInDisc(R, { count: 7, radius: c.r * 0.6, size: c.r * 0.06, sizeJitter: 0.5 });
  const pg = granulesG({ ...c, hi: false }, T, list, { color: T.detail });
  pg.firstChild.setAttribute('fill-opacity', 0.5);
  g.appendChild(pg);
  return finish(g, c, { kind: 'platelet', color, extent: extentOf(pts), outline: pts });
}

/**
 * Generic cell for anything not covered above (e.g. a monocyte or an "infected cell").
 * genericCell({ color, r, seed, irregularity, nucleus:0.5 (relative size, 0 = none),
 *               granules:0, microvilli:false })
 */
export function genericCell(o = {}) {
  const c = baseOpts(o, 30);
  const color = resolve(o.color || PALETTE.healthy);
  const T = cellTones(color, c, { intensity: o.intensity ?? 1, desat: o.desat ?? 0 });
  const R = rng(c.seed, 'generic');
  const rf = blobRadius({ r: c.r, seed: c.seed, irregularity: o.irregularity ?? 0.25 });
  const g = rootG(o.kind || 'generic', c);
  const { pts, d } = blobBody(c, T, rf);
  addHalo(g, c, T, c.r * 1.5, { intensity: o.intensity ?? 1 });
  if (o.microvilli && c.hi) g.appendChild(part('microvilli', {}, [microvilliPath(c, T, pts, { seed: c.seed })]));
  addBody(g, c, T, d, bodyFill(color, c.stage, { intensity: o.intensity ?? 1, desat: o.desat ?? 0 }));
  if (o.granules) g.appendChild(granulesG(c, T, scatterInDisc(R, { count: o.granules, radius: c.r * 0.82, size: c.r * 0.05, avoid: [{ x: 0, y: 0, r: c.r * (o.nucleus ?? 0.5) }] })));
  if ((o.nucleus ?? 0.5) > 0) g.appendChild(nucleusBlob(c, T, { nr: c.r * (o.nucleus ?? 0.5), seed: c.seed, shape: o.nucleusShape || 'round', chromatin: 0.6, nucleoli: 1, indentAngle: R.range(0, TAU) }).g);
  addSheen(g, c, T, d);
  return finish(g, c, { kind: 'genericCell', color, extent: extentOf(pts), outline: pts, regen: (t, e) => ({ d: smoothPath(polarPoints(rf, pts.length, t, e)) }), radiusFn: rf });
}

/** All cell factories by name (used by sprites.js and the gallery). */
export const CELLS = {
  tCell, bCell, plasmaCell, nkCell, macrophage, mastCell, dendriticCell, neutrophil, mdsc,
  healthyCell, cancerCell, fibroblast, redBloodCell, platelet, genericCell,
};
