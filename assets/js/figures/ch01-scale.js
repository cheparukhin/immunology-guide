// ch01-scale — "Seven powers of ten" (Figure 1.1)
//
// A continuous Powers-of-Ten zoom from a hand down to the amino acids where an
// antibody grips a virus spike. One zoom parameter z ∈ [0, 7]; the width of view
// is 10 cm × 10^(−z). Each power of ten has its own scene, drawn TO SCALE in its
// own frame: 1000 scene units = the width of view at that stop, origin at the
// centre. Scene k+1 sits inside scene k's dashed frame (1/10 of the width).
//
// All scenes are built from ONE shared geometry, so objects line up across levels:
// the fingerprint ridges on the hand are the ridges of the 1 cm scene, the cells of
// the skin slice are the cells of the 100 µm scene, the T cell at 100 µm is the
// same T cell (same seed, same place) at 10 µm, the virus specks at 10 µm are the
// particles at 1 µm, and so on. Zooming scales the scene groups by 10^(z−k) about
// a fixed point and crossfades the next scene in over the last ~30 % of a step.
//
// Controls: slider (continuous, snaps to stops on release), − / + (one stop),
// stop ticks, horizontal drag on the stage, keyboard (←/→, Home/End) and a tour.
// Reduced motion: discrete stops with a short crossfade; no tour.
import {
  tCell, macrophage, redBloodCell, bacterium, antibody, antibodyTips, ecmFibers, fibroblast,
  cellInfo, PALETTE, mix, tones, bodyFill, nucleusFill, haloFill, smoothPath, roundedPolygonPath, roundedPolygonPoints, rng,
  onReducedMotionChange,
} from '../art/index.js';

// ---------------------------------------------------------------- small math
const DEG = Math.PI / 180;
const TAU = Math.PI * 2;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const sstep = (a, b, x) => { const u = clamp((x - a) / (b - a), 0, 1); return u * u * (3 - 2 * u); };
const nf = (v) => String(Math.round(v * 10) / 10);
const circ = (x, y, r) => `M${nf(x - r)} ${nf(y)}a${nf(r)} ${nf(r)} 0 1 0 ${nf(2 * r)} 0a${nf(r)} ${nf(r)} 0 1 0 ${nf(-2 * r)} 0`;
const ellD = (x, y, rx, ry, a) => {
  const c = Math.cos(a), s = Math.sin(a);
  const p = (u, v) => [x + u * c - v * s, y + u * s + v * c];
  const [p0, p1] = [p(-rx, 0), p(rx, 0)];
  return `M${nf(p0[0])} ${nf(p0[1])}A${nf(rx)} ${nf(ry)} ${nf(a / DEG)} 1 0 ${nf(p1[0])} ${nf(p1[1])}A${nf(rx)} ${nf(ry)} ${nf(a / DEG)} 1 0 ${nf(p0[0])} ${nf(p0[1])}Z`;
};
const polyD = (pts, closed = true) => pts.map((p, i) => `${i ? 'L' : 'M'}${nf(p[0])} ${nf(p[1])}`).join('') + (closed ? 'Z' : '');
const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const mul = (a, k) => [a[0] * k, a[1] * k];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
const len = (a) => Math.hypot(a[0], a[1]);
const unit = (a) => { const l = len(a) || 1; return [a[0] / l, a[1] / l]; };
const rot = (a, ang) => { const c = Math.cos(ang), s = Math.sin(ang); return [a[0] * c - a[1] * s, a[0] * s + a[1] * c]; };
const centroid = (pts) => { let x = 0, y = 0; for (const p of pts) { x += p[0]; y += p[1]; } return [x / pts.length, y / pts.length]; };
const area = (pts) => { let s = 0; for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; s += a[0] * b[1] - b[0] * a[1]; } return Math.abs(s / 2); };

// ---------------------------------------------------------------- palette
const COL = {
  bg: '#0B1024',
  sand: PALETTE.healthy,
  coral: PALETTE.virus,
  gold: PALETTE.antibody,
  rbc: PALETTE.rbc,
  endo: PALETTE.endothelium,
  white: '#FFFFFF',
  cd8: PALETTE.cd8,
};

// ---------------------------------------------------------------- reader-facing text
const STOPS = [
  { w: '10 cm', spoken: '10 centimeters', plain: 'a hundred millimeters' },
  { w: '1 cm', spoken: '1 centimeter', plain: 'ten millimeters' },
  { w: '1 mm', spoken: '1 millimeter', plain: 'one millimeter' },
  { w: '100 µm', spoken: '100 micrometers', plain: 'a tenth of a millimeter' },
  { w: '10 µm', spoken: '10 micrometers', plain: 'a hundredth of a millimeter' },
  { w: '1 µm', spoken: '1 micrometer', plain: 'a thousandth of a millimeter' },
  { w: '100 nm', spoken: '100 nanometers', plain: 'a ten-thousandth of a millimeter' },
  { w: '10 nm', spoken: '10 nanometers', plain: 'a hundred-thousandth of a millimeter' },
];
// "What if a T cell were your height?" (draft data; scale factor 1.7 m / 7 µm ≈ 240,000)
const SPACE = 'You would stand about 400 km tall, roughly the altitude at which the International Space Station orbits.';
const TALL = [
  SPACE, SPACE, SPACE,
  'A red blood cell would be about as wide as you are tall; a macrophage would be as tall as a giraffe (4–5 m).',
  'The bacterium would be the size of a house cat (~0.5 m).',
  'Each virus particle would be the size of a grape (~2.5 cm).',
  'Each antibody would be the size of a sesame seed (~3 mm).',
  'Each amino acid would be about the size of the finest grains of sand (~0.15 mm).',
];
const LAST = 7;

/** Length in meters → "320 µm" (2 significant figures, sensible unit). */
function fmtLen(m) {
  const units = [['cm', 1e-2], ['mm', 1e-3], ['µm', 1e-6], ['nm', 1e-9]];
  let i = m >= 0.995e-2 ? 0 : m >= 0.995e-3 ? 1 : m >= 0.995e-6 ? 2 : 3;
  let v = Number((m / units[i][1]).toPrecision(2));
  if (v >= 1000 && i > 0) { i -= 1; v = Number((m / units[i][1]).toPrecision(2)); }
  return `${v} ${units[i][0]}`;
}

/** Like the library's smoothPath (open), but end tangents come from neighbours outside the chunk. */
function smoothOpen(pts, prev, next, smooth = 0.34) {
  const N = pts.length;
  if (N < 2) return '';
  const at = (i) => (i < 0 ? prev || pts[0] : i >= N ? next || pts[N - 1] : pts[i]);
  const tan = pts.map((_, i) => unit(sub(at(i + 1), at(i - 1))));
  let d = `M${nf(pts[0][0])} ${nf(pts[0][1])}`;
  for (let i = 0; i < N - 1; i++) {
    const a = pts[i], b = pts[i + 1];
    const L = len(sub(b, a)) * smooth;
    d += `C${nf(a[0] + tan[i][0] * L)} ${nf(a[1] + tan[i][1] * L)} ${nf(b[0] - tan[i + 1][0] * L)} ${nf(b[1] - tan[i + 1][1] * L)} ${nf(b[0])} ${nf(b[1])}`;
  }
  return d;
}
/** Cut a polyline at a polygon's boundary (exact crossings) → runs of points inside. */
function clipPolyline(pts, closed, poly) {
  const inside = (p) => insidePoly(poly, p);
  const cross = (a, b) => {
    let best = null;
    for (let i = 0; i < poly.length; i++) {
      const c = poly[i], d = poly[(i + 1) % poly.length];
      const r = sub(b, a), s2 = sub(d, c), den = r[0] * s2[1] - r[1] * s2[0];
      if (Math.abs(den) < 1e-12) continue;
      const t = ((c[0] - a[0]) * s2[1] - (c[1] - a[1]) * s2[0]) / den, u = ((c[0] - a[0]) * r[1] - (c[1] - a[1]) * r[0]) / den;
      if (t >= 0 && t <= 1 && u >= 0 && u <= 1 && (!best || t < best.t)) best = { t, p: add(a, mul(r, t)) };
    }
    return best ? best.p : a;
  };
  const list = closed ? [...pts, pts[0]] : pts;
  const flags = list.map(inside);
  if (flags.every(Boolean)) return [{ pts, closed }];
  const out = [];
  let cur = [];
  for (let i = 0; i < list.length; i++) {
    if (flags[i]) {
      if (!cur.length && i > 0) cur.push(cross(list[i], list[i - 1]));
      cur.push(list[i]);
    } else if (cur.length) {
      cur.push(cross(list[i - 1], list[i]));
      if (cur.length > 1) out.push({ pts: cur, closed: false });
      cur = [];
    }
  }
  if (cur.length > 1) out.push({ pts: cur, closed: false });
  // a closed ring that was cut: join the run that wraps around the start
  if (closed && out.length > 1 && flags[0] && flags[flags.length - 1]) {
    const last = out.pop();
    out[0].pts = [...last.pts.slice(0, -1), ...out[0].pts];
  }
  return out;
}
/** Split long polylines into chunks (for spatial tiling); each chunk keeps its neighbours for tangents. */
function chunked(runs, n = 24) {
  const out = [];
  for (const r of runs) {
    const P = r.closed ? [...r.pts, r.pts[0]] : r.pts;
    for (let i = 0; i < P.length - 1; i += n) {
      const seg = P.slice(i, Math.min(P.length, i + n + 1));
      const prev = i > 0 ? P[i - 1] : r.closed ? P[P.length - 2] : null;
      const next = i + n + 1 < P.length ? P[i + n + 1] : r.closed ? P[1] : null;
      out.push({ pts: seg, prev, next, mid: seg[Math.floor(seg.length / 2)] });
    }
  }
  return out;
}
/** Group path strings by grid cell so the renderer can cull what is off screen. */
function tiler(size) {
  const m = new Map();
  return {
    add(p, d, k = 0) { if (!d) return; const key = `${Math.floor(p[0] / size)},${Math.floor(p[1] / size)},${k}`; m.set(key, (m.get(key) || '') + d); },
    each(fn) { for (const [key, d] of m) fn(d, Number(key.split(',')[2])); },
  };
}

// ====================================================================================
// WORLD GEOMETRY (shared by all scenes)
// ====================================================================================

// ---------- Scene 0/1: the hand (millimetres; scene-0 units = mm × 10)
function buildHand() {
  const F = [
    { id: 'thumb', base: [-37, 55], ang: -118, len: 60, w: 22, joints: [27], sL: 0, sR: 23, core: -1.4, tilt: -14, seed: 5 },
    { id: 'index', base: [-10, 44], ang: -93, len: 65, w: 17.5, joints: [22.5, 46], sL: 6, sR: 5, core: 1.9, tilt: 9, seed: 1 },
    { id: 'middle', base: [9.3, 43.5], ang: -88.5, len: 72, w: 17.6, joints: [24, 50], sL: 5, sR: 5, core: -1.2, tilt: -6, seed: 2 },
    { id: 'ring', base: [27.8, 45.5], ang: -83, len: 66, w: 16.6, joints: [23, 47], sL: 5, sR: 6, core: 1.1, tilt: 12, seed: 3 },
    { id: 'little', base: [44.5, 51], ang: -75, len: 52, w: 14.6, joints: [19, 37], sL: 6, sR: 0, core: 0.6, tilt: -8, seed: 4 },
  ];
  for (const f of F) {
    const a = f.ang * DEG;
    f.d = [Math.cos(a), Math.sin(a)];
    f.n = [-f.d[1], f.d[0]];
    f.hw = (s) => {
      let k = 1 - 0.09 * s / f.len;
      for (const j of f.joints) k += 0.035 * Math.exp(-(((s - (f.len - j)) / 3.2) ** 2));
      k += 0.05 * Math.exp(-(((f.len - 9 - s) / 5) ** 2));              // the fingertip pulp
      return (f.w / 2) * k + Math.max(0, 7 - s) * 0.11;               // slight flare into the palm
    };
    f.at = (s, off) => [f.base[0] + f.d[0] * s + f.n[0] * off, f.base[1] + f.d[1] * s + f.n[1] * off];
    f.tipS = f.len - f.hw(f.len);
  }
  const side = (f, s0, s1, sign, inset = 0) => {
    const out = [];
    const k = Math.max(2, Math.ceil(Math.abs(s1 - s0) / 3));
    for (let i = 0; i <= k; i++) {
      const s = lerp(s0, s1, i / k);
      out.push(f.at(s, sign * (f.hw(s) - inset)));
    }
    return out;
  };
  const arc = (f, inset = 0) => {
    const h = f.hw(f.len) - inset;
    const T = f.at(f.tipS, 0);
    const out = [];
    for (let i = 1; i < 12; i++) {
      const ph = (i / 12) * Math.PI;
      out.push([T[0] - f.n[0] * h * Math.cos(ph) + f.d[0] * h * Math.sin(ph), T[1] - f.n[1] * h * Math.cos(ph) + f.d[1] * h * Math.sin(ph)]);
    }
    return out;
  };
  const finger = (f, sL, sR, inset = 0) => [...side(f, sL, f.tipS, -1, inset), ...arc(f, inset), ...side(f, f.tipS, sR, 1, inset)];
  const web = (f, g) => {
    const a = f.at(f.sR, f.hw(f.sR)), b = g.at(g.sL, -g.hw(g.sL));
    return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 2.2];
  };
  const [T, I, M, R, L] = F;
  const outline = [
    [-49, 112], [-51, 86], [-49, 68],
    ...finger(T, T.sL, T.sR),
    [-22.5, 49.5], [-18.5, 47],
    ...finger(I, I.sL, I.sR), web(I, M),
    ...finger(M, M.sL, M.sR), web(M, R),
    ...finger(R, R.sL, R.sR), web(R, L),
    ...finger(L, L.sL, L.sR),
    [56, 70], [57, 90], [56, 112], [3, 116],
  ];
  // distal pads (fingerprint regions) and joint creases
  const pads = F.map((f) => {
    const s0 = f.len - f.joints[0] + 0.9;
    return [...side(f, s0, f.tipS, -1, 0.35), ...arc(f, 0.35), ...side(f, f.tipS, s0, 1, 0.35)];
  });
  const creases = [];
  for (const f of F) {
    f.joints.forEach((j, idx) => {
      const s = f.len - j;
      const lines = idx === 0 ? [0] : [-0.55, 0.55];
      for (const o of lines) {
        const h = f.hw(s + o) - 1.4;
        const a = f.at(s + o, -h), b = f.at(s + o, h), c = f.at(s + o + 1.0, 0);
        creases.push([a, c, b]);
      }
    });
  }
  // palm creases (visible on tall phone stages)
  const palm = [
    [[57, 66], [40, 63.5], [24, 63], [8, 66.5]],
    [[56, 75], [36, 73], [14, 72.5], [-6, 75], [-16, 79]],
    [[-12, 58], [-21, 66], [-27, 80], [-29, 100]],
  ];
  // fingerprint ridges: offset ellipses around a core, with ridge endings (gaps)
  const rings = F.map((f) => {
    const R = rng(f.seed, 'ridges');
    const fine = f.id === 'index';
    const core = f.at(f.len - 10.4, f.core);
    const count = fine ? 36 : 30;
    const step = fine ? 0.5 : 1.0;
    const tilt = f.tilt * DEG;
    const list = [];
    for (let i = 0; i < count; i++) {
      const a = 0.3 + i * 0.46, b = 0.95 + i * 0.46;
      const shift = [0.035 * i, 0.06 * i];
      const per = TAU * Math.sqrt((a * a + b * b) / 2);
      const m = Math.max(18, Math.round(per / step));
      const ph = R.range(0, TAU);
      const gaps = [];
      if (i >= 3) {
        const k = R.pick([0, 1, 1, 2]);
        for (let q = 0; q < k; q++) gaps.push({ at: R.range(0, TAU), w: R.range(0.35, 0.7) / ((a + b) / 2) });
      }
      const inGap = (th) => gaps.some((g) => Math.abs(((th - g.at + Math.PI * 3) % TAU) - Math.PI) < g.w / 2);
      const pts = [];
      for (let k = 0; k < m; k++) {
        const th = (k / m) * TAU;
        const w = 0.06 * Math.sin(3 * th + i * 0.7 + ph) + 0.04 * Math.sin(5 * th + i * 1.3);
        let lp = [(a + w) * Math.cos(th) + shift[0], (b + w) * Math.sin(th) + shift[1]];
        lp = rot(lp, tilt);
        const p = [core[0] + f.n[0] * lp[0] + f.d[0] * lp[1], core[1] + f.n[1] * lp[0] + f.d[1] * lp[1]];
        pts.push({ p, gap: inGap(th) });
      }
      // split at gaps into open polylines (rotate so we start inside a gap)
      const start = pts.findIndex((o) => o.gap);
      if (start < 0) { list.push({ pts: pts.map((o) => o.p), closed: true }); continue; }
      let cur = [];
      for (let k = 0; k <= m; k++) {
        const o = pts[(start + k) % m];
        if (o.gap) { if (cur.length > 2) list.push({ pts: cur, closed: false }); cur = []; } else cur.push(o.p);
      }
      if (cur.length > 2) list.push({ pts: cur, closed: false });
    }
    return list;
  });
  const padCenter = I.at(I.len - 9, 0);
  const ridgeChunks = rings.map((list, i) => chunked(list.flatMap((r) => clipPolyline(r.pts, r.closed, pads[i])), i === 1 ? 20 : 30));
  return { F, outline, pads, creases, palm, rings, ridgeChunks, padCenter };
}

// ---------- Scene 2/3/4: skin cross-section (micrometres)
const RIDGE = 460;
function ys(x) { return -268 + 30 * (1 - Math.cos((TAU * x) / RIDGE)) + 2.5 * Math.sin(x / 37); }
function yGT(x) { return ys(x) + 104; }               // bottom of the stratum corneum
function yGB(x) { return yGT(x) + 21; }               // bottom of the granular layer
function yj(x) {                                       // dermal–epidermal junction
  const c = Math.cos((TAU * (x - 115)) / 230);
  const peg = 0.5 + 0.5 * Math.cos((TAU * x) / RIDGE);
  return 12 - 52 * c + 20 * peg * (1 - c) / 2;
}
const dyj = (x) => (yj(x + 0.5) - yj(x - 0.5));

function clipHalf(poly, px, py, nx, ny) {
  const out = [];
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length];
    const da = (a[0] - px) * nx + (a[1] - py) * ny, db = (b[0] - px) * nx + (b[1] - py) * ny;
    if (da <= 0) out.push(a);
    if ((da < 0 && db > 0) || (da > 0 && db < 0)) {
      const t = da / (da - db);
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
    }
  }
  return out;
}

/**
 * Intersect a densely sampled closed outline with the region on one side of a graph
 * y = f(x): side = +1 keeps y ≤ f(x) (above it on screen), −1 keeps y ≥ f(x). Where the
 * outline leaves the region, the part outside is replaced by the graph itself, so thin
 * wedges that poke across become a clean edge (no slivers).
 */
function clipGraph(pts, f, side) {
  const g = (p) => side * (p[1] - f(p[0]));
  const N = pts.length;
  const start = pts.findIndex((p) => g(p) <= 0);
  if (start < 0) return [];
  const out = [];
  let exitPt = null;
  for (let k = 0; k <= N; k++) {
    const a = pts[(start + k) % N], b = pts[(start + k + 1) % N];
    const ga = g(a), gb = g(b);
    if (ga <= 0 && k < N) out.push(a);
    if (ga <= 0 && gb > 0) {
      const t = ga / (ga - gb);
      exitPt = add(a, mul(sub(b, a), t));
      out.push([exitPt[0], f(exitPt[0])]);
    } else if (ga > 0 && gb <= 0 && exitPt) {
      const t = ga / (ga - gb);
      const entry = add(a, mul(sub(b, a), t));
      const steps = Math.ceil(Math.abs(entry[0] - exitPt[0]) / 1.2);
      for (let i = 1; i < steps; i++) { const x = lerp(exitPt[0], entry[0], i / steps); out.push([x, f(x)]); }
      out.push([entry[0], f(entry[0])]);
      exitPt = null;
    }
  }
  return out;
}

/** Points + unit tangents along the curve the library's smoothPath() draws through `pts` (closed). */
function smoothSample(pts, smooth = 0.3, step = 8, within = Infinity) {
  const N = pts.length, out = [];
  const tan = pts.map((_, i) => unit(sub(pts[(i + 1) % N], pts[(i - 1 + N) % N])));
  for (let i = 0; i < N; i++) {
    const a = pts[i], b = pts[(i + 1) % N];
    if (Math.min(len(a), len(b)) > within) continue;
    const L = len(sub(b, a)) * smooth;
    const c1 = add(a, mul(tan[i], L)), c2 = sub(b, mul(tan[(i + 1) % N], L));
    const k = Math.max(2, Math.ceil(len(sub(b, a)) / step));
    for (let j = 0; j < k; j++) {
      const t = j / k, u = 1 - t;
      const p = [u * u * u * a[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * b[0], u * u * u * a[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * b[1]];
      const d = [3 * u * u * (c1[0] - a[0]) + 6 * u * t * (c2[0] - c1[0]) + 3 * t * t * (b[0] - c2[0]), 3 * u * u * (c1[1] - a[1]) + 6 * u * t * (c2[1] - c1[1]) + 3 * t * t * (b[1] - c2[1])];
      out.push({ p, t: unit(d) });
    }
  }
  return out;
}

function insidePoly(pts, p) {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const a = pts[i], b = pts[j];
    if ((a[1] > p[1]) !== (b[1] > p[1]) && p[0] < ((b[0] - a[0]) * (p[1] - a[1])) / (b[1] - a[1]) + a[0]) inside = !inside;
  }
  return inside;
}

function buildSkin() {
  const R = rng(11, 'skin');
  const X = 1450;
  // --- epidermal cells: a basal row along the junction + Poisson fill + Voronoi
  const pts = [];
  const G = 16, grid = new Map();
  const key = (gx, gy) => (gx + 4000) * 10000 + (gy + 4000);
  const put = (p) => {
    const k = key(Math.floor(p.x / G), Math.floor(p.y / G));
    if (!grid.has(k)) grid.set(k, []);
    grid.get(k).push(p);
  };
  const near = (x, y, r) => {
    const gx = Math.floor(x / G), gy = Math.floor(y / G), out = [];
    const span = Math.ceil(r / G);
    for (let i = -span; i <= span; i++) for (let j = -span; j <= span; j++) {
      const l = grid.get(key(gx + i, gy + j));
      if (l) for (const p of l) if ((p.x - x) ** 2 + (p.y - y) ** 2 < r * r) out.push(p);
    }
    return out;
  };
  const ghosts = [];
  for (let x = -X; x < X;) {
    const y = yj(x), sl = dyj(x);
    const nrm = unit([sl, -1]);
    const p = { x: x + nrm[0] * 4.8, y: y + nrm[1] * 4.8, basal: true };
    pts.push(p); put(p);
    // ghost seeds just below the junction bound the basal cells (they make no cells)
    for (const dd of [5.2, 14]) { const q = { x: x - nrm[0] * dd, y: y - nrm[1] * dd, ghost: true }; ghosts.push(q); put(q); }
    x += (8.6 + R.range(-0.9, 0.9)) / Math.sqrt(1 + sl * sl);
  }
  for (let x = -X; x < X; x += 9) { const q = { x, y: yGB(x) - 4.5, ghost: true }; ghosts.push(q); put(q); }
  const rad = (x, y) => {
    const d = yj(x) - y;
    return d < 15 ? 9.6 : lerp(11.6, 15.6, clamp((d - 15) / 85, 0, 1));
  };
  const yTopAll = -150, yBotAll = 92;
  for (let i = 0; i < 30000; i++) {
    const x = R.range(-X, X), y = R.range(yTopAll, yBotAll);
    if (y < yGB(x) + 4 || y > yj(x) - 6) continue;
    const r = rad(x, y);
    if (near(x, y, r).some((q) => !q.ghost)) continue;
    const p = { x, y, basal: false };
    pts.push(p); put(p);
  }
  const cells = [];
  for (const p of pts) {
    let poly = [[p.x - 24, p.y - 24], [p.x + 24, p.y - 24], [p.x + 24, p.y + 24], [p.x - 24, p.y + 24]];
    for (const q of near(p.x, p.y, 40)) {
      if (q === p) continue;
      poly = clipHalf(poly, (p.x + q.x) / 2, (p.y + q.y) / 2, q.x - p.x, q.y - p.y);
      if (poly.length < 3) break;
    }
    if (poly.length < 3) continue;
    // clamp to the living epidermis (between the granular layer and the junction).
    // `poly`: vertex-clamped (cheap, for the 1 mm mosaic); `dense`: rounded corners,
    // densely sampled and clamped point-by-point (for the close-ups).
    const clampP = ([x, y]) => [x, clamp(y, yGB(x) + 0.3, yj(x) - 0.35)];
    const raw = poly;
    poly = raw.map(clampP);
    let dense = roundedPolygonPoints(raw, 0.27, 6);
    dense = clipGraph(dense, (x) => yj(x) - 0.35, 1);
    if (dense.length >= 3) dense = clipGraph(dense, (x) => yGB(x) + 0.3, -1);
    dense = dense.filter((q, i) => len(sub(q, dense[(i + dense.length - 1) % dense.length])) > 0.2);
    if (dense.length < 3) continue;
    const c = centroid(dense);
    const A = area(dense);
    if (A < 18) continue;
    // inset ≈ 0.13 µm for a hairline gap between neighbours
    const inset = (list) => list.map((v) => { const dv = sub(v, c); const l = len(dv) || 1; return add(c, mul(dv, Math.max(0.55, 1 - 0.13 / l))); });
    poly = inset(poly); dense = inset(dense);
    const req = Math.sqrt(A / Math.PI);
    const depth = yj(c[0]) - c[1];
    cells.push({ poly, dense, c, req, nr: clamp(req * (p.basal ? 0.42 : 0.36), 2.6, 5.4), basal: p.basal, depth });
  }
  // --- granular layer: 2–3 rows of flattened cells
  const gran = [];
  for (let row = 0; row < 3; row++) {
    let x = -X - R.range(0, 20);
    while (x < X) {
      const w = R.range(18, 29);
      const xc = x + w / 2;
      const y = yGB(xc) - 3.6 - row * 6.6;
      const sl = (yGB(xc + 1) - yGB(xc - 1)) / 2;
      gran.push({ x: xc, y, rx: w / 2 - 0.7, ry: 2.7, a: Math.atan(sl), nuc: R.chance(0.55), gr: Array.from({ length: R.int(2, 5) }, () => [R.range(-0.7, 0.7), R.range(-0.5, 0.5)]) });
      x += w + 0.4;
    }
  }
  // --- stratum corneum: flattened, dead (no nuclei) cells as staggered thin lenses
  const corn = [];
  const LAYERS = 15;
  for (let k = 0; k < LAYERS; k++) {
    let x = -X - R.range(0, 40);
    while (x < X) {
      const w = R.range(26, 44);
      corn.push({ x0: x, x1: x + w, f: (k + 0.5) / LAYERS });
      x += w + R.range(1.2, 2.6);
    }
  }
  // --- capillary loops (one per dermal papilla) and the plexus below
  const vessels = [];
  for (let k = -6; k <= 5; k++) {
    const xp = 115 + 230 * k;
    if (Math.abs(xp) > X + 40) continue;
    const top = yj(xp) + 13.5, ra = 9, cy = top + ra;
    const pl = [];
    for (let y = 238; y > cy; y -= 4) pl.push([xp - ra - (y - cy) * 0.025 + 1.3 * Math.sin((y - cy) / 14 + k), y]);
    for (let i = 0; i <= 12; i++) { const th = Math.PI - (i / 12) * Math.PI; pl.push([xp + ra * Math.cos(th), cy - ra * Math.sin(th)]); }
    for (let y = cy + 4; y <= 266; y += 4) pl.push([xp + ra + (y - cy) * 0.035 + 1.5 * Math.sin((y - cy) / 17 + 1 + k), y]);
    vessels.push({ pts: pl, lumen: 8, wall: 1.1, xp });
  }
  const art = [], ven = [];
  for (let x = -X - 60; x <= X + 60; x += 8) { art.push([x, 240 + 5 * Math.sin(x / 95)]); ven.push([x, 268 + 7 * Math.sin(x / 130 + 1)]); }
  vessels.push({ pts: art, lumen: 13, wall: 2, plexus: true });
  vessels.push({ pts: ven, lumen: 19, wall: 2, plexus: true });
  // a deeper arteriole/venule pair (seen on tall phone stages)
  const art2 = [], ven2 = [];
  for (let x = -X - 60; x <= X + 60; x += 10) { art2.push([x, 610 + 14 * Math.sin(x / 210 + 2)]); ven2.push([x, 662 + 12 * Math.sin(x / 260 + 0.5)]); }
  vessels.push({ pts: art2, lumen: 26, wall: 4, plexus: true });
  vessels.push({ pts: ven2, lumen: 38, wall: 3, plexus: true });
  // red blood cells along the vessels (positions + flow direction)
  const rbcs = [];
  for (const v of vessels) {
    let acc = R.range(0, 6);
    const spacing = v.plexus ? 16 : 9.6;
    for (let i = 1; i < v.pts.length; i++) {
      const a = v.pts[i - 1], b = v.pts[i];
      const L = len(sub(b, a));
      let t = acc;
      while (t < L) {
        if (R.chance(v.plexus ? 0.55 : 0.82)) {
          const p = add(a, mul(sub(b, a), t / L));
          const jit = v.plexus ? R.range(-v.lumen * 0.25, v.lumen * 0.25) : 0;
          const dir = unit(sub(b, a));
          rbcs.push({ p: add(p, mul([-dir[1], dir[0]], jit)), dir, plexus: !!v.plexus, view: R.pick(['side', 'side', 'tilted']), seed: rbcs.length });
        }
        t += spacing + R.range(-1.5, 2.5);
      }
      acc = t - L;
    }
  }
  // --- collagen bundles in the dermis
  const fibers = [];
  for (let i = 0; i < 150; i++) {
    const x = R.range(-X, X), y = R.range(-30, 1500);
    const L = R.range(50, 190), a = R.range(-0.5, 0.5) + (R.chance(0.3) ? Math.PI / 2 * R.range(0.5, 1) : 0);
    const pl = [];
    const amp = R.range(2, 7), fr = R.range(1, 3), ph = R.range(0, TAU);
    for (let k = 0; k <= 10; k++) {
      const t = k / 10 - 0.5;
      pl.push([x + Math.cos(a) * L * t - Math.sin(a) * Math.sin(t * fr * TAU + ph) * amp, y + Math.sin(a) * L * t + Math.cos(a) * Math.sin(t * fr * TAU + ph) * amp]);
    }
    fibers.push({ pts: pl, w: R.range(1.4, 4.2) });
  }
  return { cells, gran, corn, vessels, rbcs, fibers, X };
}

/** Dermis region (below the junction) as a closed polygon, in scene coords via `tf`. */
function dermisPoly(tf, x0, x1, yBottom, step = 3) {
  const pts = [];
  for (let x = x0; x <= x1; x += step) pts.push(tf([x, yj(x)]));
  pts.push(tf([x1, yBottom]), tf([x0, yBottom]));
  return pts;
}

/** Nearest point on any edge of the cells' polygons to p (scene-2 coords). */
function nearestEdge(cells, p) {
  let best = null;
  for (const c of cells) {
    if (Math.abs(c.c[0] - p[0]) > 30 || Math.abs(c.c[1] - p[1]) > 30) continue;
    const P = c.dense;
    for (let i = 0; i < P.length; i++) {
      const a = P[i], b = P[(i + 1) % P.length];
      const ab = sub(b, a), L2 = dot(ab, ab);
      if (L2 < 1) continue;
      const t = clamp(dot(sub(p, a), ab) / L2, 0, 1);
      const q = add(a, mul(ab, t));
      const d = len(sub(p, q));
      if (!best || d < best.d) best = { d, q, a, b, cell: c, t };
    }
  }
  return best;
}

// ====================================================================================
// THE MODULE
// ====================================================================================
const CSS = `
[data-figure="ch01-scale"] .fig__stage { touch-action: pan-y; cursor: ew-resize; user-select: none; -webkit-user-select: none; }
[data-figure="ch01-scale"] .fig__stage.is-dragging { cursor: grabbing; }
[data-figure="ch01-scale"] .s1-readout {
  position: absolute; z-index: 4; top: 0.7rem; left: 0.85rem; pointer-events: none;
  font-family: var(--font-ui); line-height: 1.3;
  padding: 0.2rem 0.5rem 0.25rem; margin: -0.2rem -0.5rem; border-radius: 0.5rem;
  background: color-mix(in srgb, var(--stage-dark-a) 62%, transparent);
  text-shadow: 0 0 6px var(--stage-dark-a), 0 0 3px var(--stage-dark-a), 0 0 1px var(--stage-dark-a);
}
[data-figure="ch01-scale"] .s1-readout__w { font-size: var(--text-xs); font-weight: 520; color: var(--fg-2); letter-spacing: 0.01em; }
[data-figure="ch01-scale"] .s1-readout__w b { color: var(--fg); font-weight: 650; font-variant-numeric: tabular-nums; }
[data-figure="ch01-scale"] .s1-readout__p { font-size: var(--text-2xs); font-weight: 500; color: var(--fg-2); transition: opacity var(--dur-2) var(--ease-out); }
@container fig (max-width: 599.98px) {
  [data-figure="ch01-scale"] .s1-readout { top: 0.55rem; left: 0.65rem; }
}
[data-figure="ch01-scale"] .s1-ctl { display: flex; flex-wrap: wrap; align-items: flex-start; gap: var(--s-3) var(--s-4); width: 100%; }
[data-figure="ch01-scale"] .s1-ctl > .btn--play { margin-top: 0.1rem; }
[data-figure="ch01-scale"] .s1-zoom { flex: 1 1 26rem; min-width: 0; display: flex; align-items: flex-start; gap: var(--s-2); }
[data-figure="ch01-scale"] .s1-zoom > .btn { flex: none; margin-top: 0.1rem; }
[data-figure="ch01-scale"] .s1-track {
  --fill: 0%; --track: var(--rule-strong); --fill-color: var(--accent);
  position: relative; flex: 1 1 auto; min-width: 0; padding-top: calc((var(--btn-h, 2.5rem) - 1.75rem) / 2 + 0.1rem);
}
[data-figure="ch01-scale"] .s1-track .slider__input { display: block; }
[data-figure="ch01-scale"] .s1-ticks { position: relative; height: 1.7rem; margin-top: -0.15rem; }
[data-figure="ch01-scale"] .s1-tick {
  position: absolute; top: 0; transform: translateX(-50%);
  display: flex; flex-direction: column; align-items: center; gap: 0.12rem;
  min-width: 2.2rem; padding: 0.15rem 0.2rem 0.25rem; margin: 0;
  border: 0; background: none; border-radius: var(--r-xs); cursor: pointer;
  font-family: var(--font-ui); font-size: var(--text-2xs); font-weight: 560; line-height: 1;
  color: var(--ink-3); white-space: nowrap; font-variant-numeric: tabular-nums;
  -webkit-tap-highlight-color: transparent;
}
[data-figure="ch01-scale"] .s1-tick::before { content: ""; width: 1px; height: 0.3rem; background: var(--rule-strong); }
[data-figure="ch01-scale"] .s1-tick:hover { color: var(--ink); }
[data-figure="ch01-scale"] .s1-tick.is-current { color: var(--accent); }
[data-figure="ch01-scale"] .s1-tick.is-current::before { background: var(--accent); }
[data-figure="ch01-scale"] .s1-tick:focus-visible { outline: 2px solid var(--accent); outline-offset: 1px; }
[data-figure="ch01-scale"] .s1-tick[data-minor] { pointer-events: none; }
[data-figure="ch01-scale"] .s1-tick[data-minor] .s1-tick__t { visibility: hidden; }
@container fig (max-width: 599.98px) {
  [data-figure="ch01-scale"] .s1-zoom { order: -1; flex-basis: 100%; }
  [data-figure="ch01-scale"] .s1-tick { min-width: 2.75rem; padding-bottom: 0.7rem; }
  [data-figure="ch01-scale"] .s1-ticks { height: 2.2rem; }
}
[data-figure="ch01-scale"] .s1-steps .fig__step-num .t { font-variant-numeric: tabular-nums; }
[data-figure="ch01-scale"] .s1-tall { margin-top: var(--s-3); font-family: var(--font-ui); font-size: var(--text-xs); color: var(--ink-2); }
[data-figure="ch01-scale"] .s1-tall > summary {
  display: inline-flex; align-items: center; gap: 0.45rem; min-height: 2.2rem; cursor: pointer;
  list-style: none; font-weight: 560; color: var(--accent);
}
[data-figure="ch01-scale"] .s1-tall > summary::-webkit-details-marker { display: none; }
[data-figure="ch01-scale"] .s1-tall > summary::before {
  content: ""; width: 0.42rem; height: 0.42rem; border-right: 1.5px solid currentColor; border-bottom: 1.5px solid currentColor;
  transform: rotate(-45deg); transition: transform var(--dur-2) var(--ease-out); margin-right: 0.1rem;
}
[data-figure="ch01-scale"] .s1-tall[open] > summary::before { transform: rotate(45deg); }
[data-figure="ch01-scale"] .s1-tall__line { margin: 0.15rem 0 0; font-family: var(--font-body); font-size: var(--text-sm); line-height: 1.5; color: var(--ink); }
[data-figure="ch01-scale"] .s1-tall__note { margin: 0.3rem 0 0; color: var(--ink-3); font-size: var(--text-2xs); }
@media (min-width: 48rem) {
  /* Keep stage + slider inside one screen on short laptop displays. */
  .fig[data-figure="ch01-scale"] { width: min(100%, max(36rem, calc((100svh - 10.5rem) * 1.5))); justify-self: center; }
}
@media (pointer: coarse) {
  [data-figure="ch01-scale"] .s1-track { --btn-h: 2.75rem; }
}
`;

export default function mount(fig, ctx) {
  const { gsap } = ctx;
  if (!document.getElementById('s1-style')) document.head.append(ctx.h('style', { id: 's1-style', text: CSS }));

  // ------------------------------------------------------------ layout
  const LAYOUT = {
    wide: { VW: 1000, VH: 667 },
    compact: { VW: 400, VH: 500 },
  };
  let lay = ctx.compact ? 'compact' : 'wide';
  let VW, VH, S, CX, CY, AR;
  const applyLayout = () => {
    ({ VW, VH } = LAYOUT[lay]);
    S = VW / 1000; CX = VW / 2; CY = VH / 2; AR = VW / VH;
  };
  applyLayout();
  ctx.setAspect(3 / 2, 4 / 5);
  const svg = ctx.createSVG({ viewBox: `0 0 ${VW} ${VH}`, className: 's1-svg' });
  const E = (tag, attrs, parent) => ctx.svg(tag, attrs, parent);
  let idn = 0;
  const uid = (p) => `s1-${p}-${++idn}`;
  const clipOf = (d) => { const id = uid('clip'); const cp = E('clipPath', { id, clipPathUnits: 'userSpaceOnUse' }, svg.defs); E('path', { d }, cp); return `url(#${id})`; };
  const NS = { 'vector-effect': 'non-scaling-stroke' };

  const world = E('g', { class: 's1-world' }, svg);
  const over = E('g', { class: 's1-over' }, svg);

  // ------------------------------------------------------------ geometry
  const hand = buildHand();
  const skin = buildSkin();
  const frames = [];      // frames[k] = centre (scene-k coords) of scene k+1's view
  const labels = [];      // { scene, at, text, wide: [dx, dy, anchor], compact }
  const scenes = [];

  // chain transforms between neighbouring scenes: q_{k+1} = (q_k − F_k) × 10
  const down = (q, F) => [(q[0] - F[0]) * 10, (q[1] - F[1]) * 10];

  // ================================================================ SCENE 0 — hand (u = 0.1 mm)
  {
    const g = E('g', { class: 's1-scene' });
    const U = (p) => [p[0] * 10, p[1] * 10];
    const outlineD = smoothPath(hand.outline.map(U), { closed: true, smooth: 0.3 });
    const fill = ctx.linearGradient(svg, [[0, COL.sand, 0.13], [0.6, COL.sand, 0.07], [1, COL.sand, 0.04]], { x1: '0%', y1: '0%', x2: '0%', y2: '100%' });
    E('path', { d: outlineD, fill: 'none', stroke: COL.sand, strokeOpacity: 0.07, strokeWidth: 9, strokeLinejoin: 'round', ...NS }, g);
    E('path', { d: outlineD, fill }, g);
    hand.F.forEach((f, i) => {
      const tl = tiler(45);
      for (const c of hand.ridgeChunks[i]) tl.add(U(c.mid), smoothOpen(c.pts.map(U), c.prev && U(c.prev), c.next && U(c.next)));
      tl.each((d) => E('path', { d, fill: 'none', stroke: COL.sand, strokeOpacity: i === 1 ? 0.34 : 0.26, strokeWidth: 0.6, ...NS }, g));
    });
    let dc = '';
    for (const [a, c, b] of hand.creases) { const [A, Cc, B] = [a, c, b].map(U); dc += `M${nf(A[0])} ${nf(A[1])}Q${nf(Cc[0])} ${nf(Cc[1])} ${nf(B[0])} ${nf(B[1])}`; }
    for (const line of hand.palm) dc += smoothPath(line.map(U), { closed: false });
    E('path', { d: dc, fill: 'none', stroke: COL.sand, strokeOpacity: 0.42, strokeWidth: 1, strokeLinecap: 'round', ...NS }, g);
    E('path', { d: outlineD, fill: 'none', stroke: mix(COL.sand, COL.white, 0.15), strokeOpacity: 0.95, strokeWidth: 1.6, strokeLinejoin: 'round', ...NS }, g);
    const F0 = U(hand.padCenter);
    frames[0] = F0;
    labels.push({ scene: 0, at: F0, text: 'Fingertip', wide: [-150, -58, 'end'], compact: [-62, -92, 'end'] });
    scenes.push({ g });
  }

  // ================================================================ SCENE 1 — fingerprint (u = 10 µm)
  {
    const g = E('g', { class: 's1-scene' });
    const F0 = frames[0];
    const U = (p) => down([p[0] * 10, p[1] * 10], F0);
    const outlineD = smoothPath(hand.outline.map(U), { closed: true, smooth: 0.3 });
    E('path', { d: outlineD, fill: COL.sand, fillOpacity: 0.055 }, g);
    // ridges (tiled so off-screen parts are culled while zooming)
    const tl = tiler(380);
    const P1 = [];
    for (const c of hand.ridgeChunks[1]) {
      const pts = c.pts.map(U);
      P1.push(pts);
      tl.add(U(c.mid), smoothOpen(pts, c.prev && U(c.prev), c.next && U(c.next)));
    }
    // opaque strokes inside translucent layers: chunk joints (shared end caps) never double up
    const ridgeStyles = [
      [0.2, { stroke: COL.sand, strokeWidth: 25, strokeLinecap: 'round' }],
      [0.36, { stroke: mix(COL.sand, COL.white, 0.35), strokeWidth: 8, strokeLinecap: 'round' }],
      [0.32, { stroke: mix(COL.sand, COL.white, 0.6), strokeWidth: 1.1, ...NS }],
    ];
    const layers = ridgeStyles.map(([o]) => E('g', { opacity: o }, g));
    tl.each((d) => ridgeStyles.forEach(([, st], k) => E('path', { d, fill: 'none', ...st }, layers[k])));
    // sweat pores along the ridges
    const R = rng(21, 'pores');
    const tp = tiler(380);
    for (const pts of P1) {
      let acc = R.range(0, 40);
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1], b = pts[i], L = len(sub(b, a));
        let t = acc;
        while (t < L) {
          const p = add(a, mul(sub(b, a), t / L));
          if (Math.abs(p[0]) < 1150 && Math.abs(p[1]) < 1400 && R.chance(0.8)) tp.add(p, circ(p[0], p[1], R.range(3.6, 5.2)));
          t += R.range(38, 62);
        }
        acc = t - L;
      }
    }
    tp.each((d) => E('path', { d, fill: COL.bg, fillOpacity: 0.78, stroke: COL.sand, strokeOpacity: 0.3, strokeWidth: 0.8, ...NS }, g));
    E('path', { d: outlineD, fill: 'none', stroke: mix(COL.sand, COL.white, 0.15), strokeOpacity: 0.9, strokeWidth: 1.6, ...NS }, g);
    // frame on a ridge near the centre
    let best = null;
    for (const pts of P1) for (const p of pts) { const dd = len(sub(p, [30, 25])); if (!best || dd < best.d) best = { d: dd, p }; }
    frames[1] = best.p;
    scenes.push({ g });
  }

  // ================================================================ SCENE 2 — skin slice (u = 1 µm)
  // The scene-2 coordinate system is set by the slice itself (a new viewpoint): the
  // ridge crest under the 1 cm frame sits at x = 0.
  const F2 = [115, -31];                 // the 100 µm view: a dermal papilla beside its capillary loop
  frames[2] = F2;
  // the T cell: in the papilla, against the basal cell on its right flank
  const contact2 = (() => { const x = 140; return nearestEdge(skin.cells, [x, yj(x) + 1]); })();
  const nd2 = (() => {         // unit normal at the contact, pointing into the dermis
    const e = unit(sub(contact2.b, contact2.a));
    let n = [-e[1], e[0]];
    if (dot(n, sub(contact2.q, contact2.cell.c)) < 0) n = mul(n, -1);
    return { e, n };
  })();
  const TC2 = add(contact2.q, mul(nd2.n, 3.5 + 1.1));       // T cell: 7 µm across, ~1 µm from the body cell
  const MA2 = [89.5, -6.8];                                   // macrophage: ~18 µm
  const EC2 = add(TC2, [4.7, 1.8]);                           // E. coli: 2 µm × ~1 µm
  const T3 = (q) => down(q, F2);                               // scene 2 → 3
  const TC3 = T3(TC2), MA3 = T3(MA2), EC3 = T3(EC2);
  const F3 = [TC3[0] + 18.5, TC3[1] - 6];                    // the 10 µm view (T cell sits at (−185, 60) in scene 4)
  frames[3] = F3;
  const T4 = (q) => down(T3(q), F3);                           // scene 2 → 4
  const TC4 = T4(TC2), EC4 = T4(EC2);
  // scene 4: the virus specks sit on the body-cell membrane; the 1 µm view is centred
  // 300 nm off that membrane, on the dermis side
  // walk ~2 µm along the same cell's membrane (away from the T cell, toward the bacterium)
  const memb = (() => {
    const sgn = nd2.e[0] >= 0 ? 1 : -1;
    const tgt = add(contact2.q, mul(nd2.e, 2.0 * sgn));
    const hit = nearestEdge([contact2.cell], tgt);
    const e = unit(sub(hit.b, hit.a));
    let n = [-e[1], e[0]];
    if (dot(n, sub(hit.q, contact2.cell.c)) < 0) n = mul(n, -1);
    return { q: hit.q, e: e[0] >= 0 ? e : mul(e, -1), n };
  })();
  const e4 = memb.e, n4 = memb.n;                              // directions are the same at every scale
  const along4 = T4(memb.q);
  // the T cell at 10 µm (library cell, r = 3.5 µm); its outline is carried into the 1 µm scene
  const tc4 = lymphocyte(tCell({ variant: 'cd8', r: 350, seed: 9, receptors: false }));
  tc4.querySelector('[data-part="microvilli"]')?.remove();
  const tOut4 = cellInfo(tc4).outline.map((p) => add(TC4, p));
  // T-cell microvilli (≈ 80 nm wide, 150–450 nm long), drawn at both 10 µm and 1 µm
  const villi4 = (() => {
    const R = rng(13, 'villi');
    const out = [];
    for (const o of smoothSample(tOut4.map((p) => sub(p, TC4)), 0.34, 22)) {
      if (!R.chance(0.72)) continue;
      let n = [-o.t[1], o.t[0]];
      if (dot(n, o.p) < 0) n = mul(n, -1);
      out.push({ p: add(TC4, o.p), n: rot(n, R.range(-0.3, 0.3)), L: R.range(12, 40), w: R.range(7, 9.5), bend: R.range(-0.35, 0.35) });
    }
    return out;
  })();
  // the 1 µm view sits in the gap between the body-cell membrane and the T cell
  const gap4 = (() => { for (let t = 0; t < 400; t += 2) if (insidePoly(tOut4, add(along4, mul(n4, t)))) return t; return 400; })();
  const F4 = add(along4, mul(n4, clamp(gap4 * 0.3, 18, 24)));
  frames[4] = F4;
  const T5 = (q) => down(q, F4);
  const Tpoly5 = tOut4.map(T5);                                 // T-cell outline in the 1 µm scene
  const distPoly = (P, q) => { let b = Infinity; for (let i = 0; i < P.length; i++) { const a = P[i], c = P[(i + 1) % P.length]; const ab = sub(c, a), t = clamp(dot(sub(q, a), ab) / dot(ab, ab), 0, 1); b = Math.min(b, len(sub(q, add(a, mul(ab, t))))); } return b; };
  const clearOfT = (q, r) => !insidePoly(Tpoly5, q) && distPoly(Tpoly5, q) > r + 25 + 45;
  const M5 = T5(along4);                                       // membrane point nearest the scene-5 centre

  // ---------- particles (scene-5 coords, nm): enveloped virus, ~90–100 nm
  const R5 = rng(31, 'virions');
  const spikeSet = (seed, k = 9) => {
    const R = rng(seed, 'spk');
    const out = [];
    let a = R.range(0, TAU);
    for (let i = 0; i < k; i++) { out.push({ ang: a, tilt: R.range(-18, 18) * DEG, bend: R.range(-0.25, 0.25) }); a += (TAU / k) * R.range(0.72, 1.28); }
    return out;
  };
  const H5 = [-40, 110];               // the hero particle (the 100 nm view sits on its top)
  const HERO_R = 46;                    // envelope radius, nm (≈ 92 nm across)
  const heroSpikes = [
    { ang: -8 * DEG, tilt: 6 * DEG, bend: 0.12 }, { ang: 33 * DEG, tilt: -14 * DEG, bend: -0.1 },
    { ang: 70 * DEG, tilt: 9 * DEG, bend: 0.08 }, { ang: 104 * DEG, tilt: -7 * DEG, bend: 0 },
    { ang: 141 * DEG, tilt: 16 * DEG, bend: 0.1 }, { ang: 178 * DEG, tilt: -4 * DEG, bend: -0.12 },
    { ang: 215 * DEG, tilt: 11 * DEG, bend: 0.05 }, { ang: 252 * DEG, tilt: -15 * DEG, bend: 0.1 },
    { ang: 290 * DEG, tilt: 5 * DEG, bend: -0.06 }, { ang: 323 * DEG, tilt: -11 * DEG, bend: 0.12 },
  ];
  const particles = [{ c: H5, r: HERO_R, spikes: heroSpikes, hero: true, seed: 1 }];
  // the body-cell membrane in scene-5 coords, sampled every ~8 nm along the drawn curve
  const T5c = (q) => T5(T4(q));
  const memCell = contact2.cell;
  const memPoly5 = memCell.dense.map(T5c);
  const memC5 = T5c(memCell.c);
  const memS = smoothSample(memPoly5, 0.3, 8, 3200).map((o) => {
    let n = [-o.t[1], o.t[0]];
    if (dot(n, sub(o.p, memC5)) < 0) n = mul(n, -1);
    return { p: o.p, n };
  });
  const memNearest = (q) => { let b = null; for (const m of memS) { const d = len(sub(m.p, q)); if (!b || d < b.d) b = { ...m, d }; } return b; };
  const insideCell5 = (q) => insidePoly(memPoly5, q);
  // two particles touching the membrane (spike tips on it), at ±arc length from the centre
  {
    const i0 = memS.reduce((bi, m, i) => (len(m.p) < len(memS[bi].p) ? i : bi), 0);
    for (const [ds, r] of [[34, 45], [-22, 47.5]]) {      // ×8 nm along the membrane
      const m = memS[clamp(i0 + ds, 0, memS.length - 1)];
      if (!clearOfT(add(m.p, mul(m.n, r + 23.5)), r)) continue;
      particles.push({ c: add(m.p, mul(m.n, r + 23.5)), r, spikes: spikeSet(40 + particles.length, 9), seed: 2 + particles.length });
    }
  }
  // free particles around (kept outside the cell, clear of each other)
  for (const [x, y, r] of [[-420, -235, 44], [-400, 245, 46], [-260, 520, 47], [230, 540, 44.5], [-330, -520, 46], [-700, 60, 45], [640, 420, 45.5]]) {
    const q = [x, y];
    const m = memNearest(q);
    if (insideCell5(q) || (m && m.d < r + 45) || !clearOfT(q, r)) continue;
    if (particles.some((o) => len(sub(o.c, q)) < o.r + r + 70)) continue;
    particles.push({ c: q, r, spikes: spikeSet(40 + particles.length, particles.length % 3 ? 9 : 8), seed: 2 + particles.length });
  }

  // ---------- the hero particle in scene 6 (u = 0.1 nm) and its antibodies
  const F5 = [H5[0], H5[1] - 60];
  frames[5] = F5;
  const H6 = down(H5, F5);              // (0, 600)
  const R6 = HERO_R * 10;               // 460
  const spike6 = (sp) => {
    const u = [Math.sin(sp.ang), -Math.cos(sp.ang)];
    const ax = [Math.sin(sp.ang + sp.tilt), -Math.cos(sp.ang + sp.tilt)];
    const base = add(H6, mul(u, R6 - 8));
    const stalkTop = add(add(base, mul(ax, 92)), mul([-ax[1], ax[0]], sp.bend * 18));
    return { u, ax, base, top: stalkTop };
  };
  // head outline (head-local: x across, y outward negative), ~13 nm wide × 16 nm tall
  const HEAD = [
    [26, 4], [40, -26], [55, -60], [63, -94], [66, -117], [63, -136], [52, -150], [38, -155], [27, -150],
    [18, -158], [0, -162], [-18, -158], [-27, -150], [-38, -155], [-52, -150], [-63, -136], [-66, -117],
    [-63, -94], [-55, -60], [-40, -26], [-26, 4], [0, 9],
  ];
  const headTf = (sp6) => { const ax = sp6.ax, r = [-ax[1], ax[0]]; return (p) => add(add(sp6.top, mul(r, p[0])), mul(ax, -p[1])); };
  const AB_SIZE = 144;                  // antibody() size giving a ~14 nm tall Y
  const tipsLoc = antibodyTips(AB_SIZE);
  // binding: arm tip on a spike head, Fc pointing away (arm direction = −spike axis, rotated)
  const abs6 = [
    { spike: 0, at: [0, -162], turn: 0, press: 4 },
    { spike: 1, at: [34, -152], turn: -28 * DEG, press: 4 },
    { spike: 9, at: [-30, -153], turn: 24 * DEG, press: 4 },
  ].map((b) => {
    const sp6 = spike6(heroSpikes[b.spike]);
    const hf = headTf(sp6);
    const target = hf(b.at);
    const dir = rot(mul(sp6.ax, -1), b.turn);                 // arm direction (pointing into the head)
    const rho = Math.atan2(dir[1], dir[0]) + 54 * DEG;         // right arm local direction is −54°
    const tipW = rot(tipsLoc.right, rho);
    const pos = sub(add(target, mul(dir, b.press)), tipW);
    return { ...b, pos, rho, target, dir };
  });
  const F6 = add(abs6[0].target, [6, 4]);
  frames[6] = F6;

  // =========================== draw scene 2
  {
    const g = E('g', { class: 's1-scene' });
    const X = skin.X;
    const derm = dermisPoly((p) => p, -X - 20, X + 20, 1600, 4);
    E('path', { d: polyD(derm), fill: COL.sand, fillOpacity: 0.03 }, g);
    const fg = E('g', { clipPath: clipOf(polyD(derm)) }, g);
    {
      const tl = tiler(300);
      for (const f of skin.fibers) tl.add(f.pts[5], smoothPath(f.pts, { closed: false }), f.w > 2.6 ? 1 : 0);
      tl.each((d, w) => E('path', { d, fill: 'none', stroke: mix(COL.sand, '#C7B9D9', 0.4), strokeOpacity: w ? 0.09 : 0.14, strokeWidth: w ? 3.6 : 1.6, strokeLinecap: 'round' }, fg));
    }
    drawVessels(g, (p) => p, 1);
    {
      const R = rng(17, 'fib');
      for (let i = 0; i < 26; i++) {
        const x = R.range(-1250, 1250), y = R.range(80, 1250);
        if (y < yj(x) + 30 || Math.abs(y - 250) < 30 || Math.abs(y - 636) < 45) continue;
        const f = fibroblast({ r: R.range(20, 30), angle: R.range(-25, 25), seed: 30 + i, detail: 'low' });
        f.setAttribute('transform', `translate(${nf(x)} ${nf(y)})`);
        f.setAttribute('opacity', '0.7');
        g.append(f);
      }
    }
    {
      const tl = tiler(150);
      for (const rb of skin.rbcs) tl.add(rb.p, ellD(rb.p[0], rb.p[1], 3.7, rb.view === 'side' ? 1.6 : 2.6, Math.atan2(rb.dir[1], rb.dir[0]) + Math.PI / 2));
      tl.each((d) => E('path', { d, fill: mix(COL.rbc, COL.white, 0.12), fillOpacity: 0.85 }, g));
    }
    drawCells(g, skin.cells, (p) => p, 'mosaic');
    drawGranular(g, (p) => p, 1);
    drawCorneum(g, (p) => p, 1);
    // skin surface and basement membrane
    const surf = [], junc = [];
    for (let x = -X - 20; x <= X + 20; x += 4) { surf.push([x, ys(x)]); junc.push([x, yj(x)]); }
    const ds = polyD(surf, false);
    E('path', { d: ds, fill: 'none', stroke: COL.sand, strokeOpacity: 0.12, strokeWidth: 7, ...NS }, g);
    E('path', { d: ds, fill: 'none', stroke: mix(COL.sand, COL.white, 0.25), strokeOpacity: 0.9, strokeWidth: 1.3, ...NS }, g);
    E('path', { d: polyD(junc, false), fill: 'none', stroke: mix(COL.sand, COL.white, 0.4), strokeOpacity: 0.3, strokeWidth: 0.8, ...NS }, g);
    // the two immune cells and the bacterium, at true size (7, ~18 and 2 µm)
    const mac = macrophage({ r: 9, variant: 'm1', seed: 6, detail: 'low', glow: true });
    mac.setAttribute('transform', `translate(${nf(MA2[0])} ${nf(MA2[1])})`);
    const tc = tCell({ variant: 'cd8', r: 3.5, seed: 9, detail: 'low', receptors: false });
    tc.setAttribute('transform', `translate(${nf(TC2[0])} ${nf(TC2[1])})`);
    g.append(mac, tc);
    E('path', { d: ellD(EC2[0], EC2[1], 1, 0.45, -25 * DEG), fill: PALETTE.bacteria, fillOpacity: 0.85 }, g);
    labels.push({ scene: 2, at: [-300, ys(-300) + 50], text: 'Skin, in cross-section', wide: [40, -118, 'start'], compact: [30, -77, 'start'] });
    scenes.push({ g });
  }

  // ---------- shared tissue painters (scene-2 data drawn through a transform `tf`, scale `k`)
  function drawVessels(parent, tf, k) {
    // one path per vessel (and per ~240 µm of the long plexus vessels), so off-screen ones are culled
    const g = E('g', null, parent);
    const wallC = mix(COL.endo, COL.white, 0.1);
    const lumC = mix(COL.rbc, COL.bg, 0.72);
    const walls = E('g', null, g), lums = E('g', null, g);
    for (const v of skin.vessels) {
      const P = v.pts.map(tf);
      const runs = [];
      if (v.plexus) for (let i = 0; i < P.length - 1; i += 30) runs.push(P.slice(i, Math.min(P.length, i + 31)));
      else runs.push(P);
      const outer = v.plexus ? v.lumen + 2 * v.wall : v.lumen + 2.4;
      for (const r of runs) {
        const d = polyD(r, false);
        E('path', { d, fill: 'none', stroke: wallC, strokeOpacity: v.plexus ? 0.2 : 0.22, strokeWidth: outer * k, strokeLinejoin: 'round' }, walls);
        E('path', { d, fill: 'none', stroke: lumC, strokeOpacity: 0.95, strokeWidth: v.lumen * k, strokeLinejoin: 'round' }, lums);
      }
    }
    return g;
  }
  function drawCells(parent, cells, tf, mode, { region = null } = {}) {
    const g = E('g', null, parent);
    const T = tones(COL.sand, 'dark');
    if (mode === 'mosaic') {
      const tl = tiler(120);
      for (const c of cells) {
        const cc = tf(c.c);
        tl.add(cc, roundedPolygonPath(c.poly.map(tf), 0.22), c.depth < 26 ? 1 : 0);
        tl.add(cc, circ(cc[0], cc[1], c.nr), 2);
      }
      const st = [
        { fill: T.bodyMid, fillOpacity: 0.62, stroke: T.rim, strokeOpacity: 0.5, strokeWidth: 0.7, strokeLinejoin: 'round', ...NS },
        { fill: mix(T.bodyMid, T.bodyOut, 0.35), fillOpacity: 0.72, stroke: T.rim, strokeOpacity: 0.62, strokeWidth: 0.75, strokeLinejoin: 'round', ...NS },
        { fill: T.nucOut, fillOpacity: 0.95, stroke: T.nucRim, strokeOpacity: 0.55, strokeWidth: 0.6, ...NS },
      ];
      const layers = st.map(() => E('g', null, g));
      tl.each((d, k) => E('path', { d, ...st[k] }, layers[k]));
      return g;
    }
    // 'detail': library cell paints, one path per cell
    const body = bodyFill(COL.sand, 'dark');
    const nfill = nucleusFill(COL.sand, 'dark');
    let dDet = '', dChrom = '', dNucl = '';
    const R = rng(77, 'cells-detail');
    for (const c of cells) {
      const P = c.dense.map(tf);
      const cc = tf(c.c);
      if (region && (Math.abs(cc[0]) > region[0] + 260 || Math.abs(cc[1]) > region[1] + 260)) continue;
      const d = smoothPath(P, { closed: true, smooth: 0.3 });
      E('path', { d, fill: body, stroke: T.rim, strokeOpacity: 0.85, strokeWidth: 1.3, strokeLinejoin: 'round', ...NS }, g);
      const scale = len(sub(tf([1, 0]), tf([0, 0])));
      const nr = c.nr * scale;
      E('path', { d: circ(cc[0], cc[1], nr), fill: nfill, stroke: T.nucRim, strokeOpacity: 0.85, strokeWidth: 1, ...NS }, g);
      for (let i = 0; i < 7; i++) {
        const a = R.range(0, TAU), rr = Math.sqrt(R()) * nr * 0.8;
        dChrom += circ(cc[0] + Math.cos(a) * rr, cc[1] + Math.sin(a) * rr, nr * R.range(0.06, 0.12));
      }
      dNucl += circ(cc[0] + R.range(-0.2, 0.2) * nr, cc[1] + R.range(-0.2, 0.2) * nr, nr * 0.16);
      // a few mitochondria in the cytoplasm
      for (let i = 0; i < 3; i++) {
        const a = R.range(0, TAU), rr = nr * R.range(1.45, 1.85);
        const p = add(cc, [Math.cos(a) * rr, Math.sin(a) * rr]);
        dDet += ellD(p[0], p[1], nr * 0.24, nr * 0.1, a + Math.PI / 2 + R.range(-0.5, 0.5));
      }
    }
    E('path', { d: dDet, fill: T.detail, fillOpacity: 0.12, stroke: T.detail, strokeOpacity: 0.35, strokeWidth: 0.8, ...NS }, g);
    E('path', { d: dChrom, fill: T.chromatin, fillOpacity: 0.5 }, g);
    E('path', { d: dNucl, fill: T.nucleolus, fillOpacity: 0.8 }, g);
    return g;
  }
  function drawGranular(parent, tf, k, { region = null } = {}) {
    const T = tones(COL.sand, 'dark');
    const tl = tiler(150 * k);
    for (const c of skin.gran) {
      const p = tf([c.x, c.y]);
      if (region && (Math.abs(p[0]) > region[0] + 400 || Math.abs(p[1]) > region[1] + 200)) continue;
      tl.add(p, ellD(p[0], p[1], c.rx * k, c.ry * k, c.a), 0);
      if (c.nuc) tl.add(p, ellD(p[0], p[1], 3.4 * k, 1.1 * k, c.a), 1);
      let dg = '';
      for (const [u, v] of c.gr) { const q = add(p, rot([u * c.rx * k, v * c.ry * k], c.a)); dg += circ(q[0], q[1], 0.55 * k); }
      tl.add(p, dg, 2);
    }
    const g = E('g', null, parent);
    const st = [
      { fill: T.bodyMid, fillOpacity: 0.55, stroke: T.rim, strokeOpacity: 0.45, strokeWidth: 0.7, ...NS },
      { fill: T.nucOut, fillOpacity: 0.9 },
      { fill: mix(COL.sand, COL.bg, 0.75), fillOpacity: 0.9 },
    ];
    const layers = st.map(() => E('g', null, g));
    tl.each((d, kk) => E('path', { d, ...st[kk] }, layers[kk]));
    return g;
  }
  function drawCorneum(parent, tf, k, { region = null } = {}) {
    // flattened, dead keratinocytes (no nuclei): stacked thin lenses, staggered like bricks
    const tl = tiler(160 * k);
    for (let ci = 0; ci < skin.corn.length; ci++) {
      const c = skin.corn[ci];
      const top = [], bot = [];
      const steps = 6;
      for (let i = 0; i <= steps; i++) {
        const x = lerp(c.x0, c.x1, i / steps);
        const y = lerp(ys(x) + 3, yGT(x) - 1.5, c.f);
        const th = 1.15 * Math.sin((Math.PI * i) / steps) + 0.12;
        top.push(tf([x, y - th])); bot.push(tf([x, y + th]));
      }
      if (region && !top.some((p) => Math.abs(p[0]) < region[0] && Math.abs(p[1]) < region[1])) continue;
      tl.add(top[3], smoothPath([...top, ...bot.reverse()], { closed: true, smooth: 0.25 }), ci % 3);
    }
    const g = E('g', null, parent);
    tl.each((d, i) => E('path', { d, fill: COL.sand, fillOpacity: [0.2, 0.3, 0.42][i], stroke: mix(COL.sand, COL.white, 0.3), strokeOpacity: [0.2, 0.28, 0.36][i], strokeWidth: 0.6, ...NS }, g));
    void k;
    return g;
  }

  /** T-cell microvilli as rounded fingers (scene-4 data drawn through `tf`, scale `k`). */
  function drawVilli(parent, list, tf, k, region = null) {
    const Tt = tones(COL.cd8 || PALETTE.cd8, 'dark');
    let d = '';
    for (const v of list) {
      const a = tf(v.p);
      if (region && (Math.abs(a[0]) > region[0] || Math.abs(a[1]) > region[1])) continue;
      const tip = add(v.p, mul(v.n, v.L));
      const mid = add(add(v.p, mul(v.n, v.L * 0.5)), mul([-v.n[1], v.n[0]], v.bend * v.L * 0.4));
      const b = add(v.p, mul(v.n, -v.w));
      const [B, M, T] = [b, mid, tip].map(tf);
      d += `M${nf(B[0])} ${nf(B[1])}Q${nf(M[0])} ${nf(M[1])} ${nf(T[0])} ${nf(T[1])}`;
    }
    const w = 7.4 * k;
    const g = E('g', null, parent);
    E('path', { d, fill: 'none', stroke: Tt.rim, strokeOpacity: 0.6, strokeWidth: w, strokeLinecap: 'round' }, g);
    E('path', { d, fill: 'none', stroke: Tt.bodyOut, strokeOpacity: 0.9, strokeWidth: w * 0.7, strokeLinecap: 'round' }, g);
    return g;
  }

  /** Resting lymphocyte as the spec asks: the nucleus fills most of the cell (library T cell, nucleus ×1.2, no granules). */
  function lymphocyte(tc) {
    const nuc = tc.querySelector('[data-part="nucleus"]');
    const env = nuc?.querySelector('.sao-nucleus-envelope');
    if (env) {
      const v = (env.getAttribute('d').match(/-?\d*\.?\d+/g) || []).map(Number);
      let sx = 0, sy = 0, k = 0;
      for (let i = 0; i + 1 < v.length; i += 2) { sx += v[i]; sy += v[i + 1]; k++; }
      const cx = sx / k, cy = sy / k;
      nuc.setAttribute('transform', `translate(${nf(cx)} ${nf(cy)}) scale(1.2) translate(${nf(-cx)} ${nf(-cy)})`);
    }
    tc.querySelector('[data-part="granules"]')?.remove();
    return tc;
  }

  // ================================================================ SCENE 3 — cells (u = 0.1 µm)
  {
    const g = E('g', { class: 's1-scene' });
    const REG = [1250, 1500];
    const derm = dermisPoly(T3, F2[0] - 130, F2[0] + 130, F2[1] + 160, 1);
    E('path', { d: polyD(derm), fill: COL.sand, fillOpacity: 0.03 }, g);
    const fg = E('g', { clipPath: clipOf(polyD(derm)) }, g);
    let d = '';
    for (const f of skin.fibers) d += smoothPath(f.pts.map(T3), { closed: false });
    E('path', { d, fill: 'none', stroke: mix(COL.sand, '#C7B9D9', 0.4), strokeOpacity: 0.05, strokeWidth: 26, strokeLinecap: 'round' }, fg);
    fg.append(ecmFibers({ width: 2600, height: 3000, x: -1300, y: -1500, count: 46, seed: 3, angle: 14, spread: 50, waviness: 2.2, opacity: 0.9 }));
    // capillary loop: wall, lumen, endothelial nuclei, red blood cells
    const vg = E('g', null, g);
    for (const v of skin.vessels) {
      const pts = v.pts.map(T3).filter((p) => Math.abs(p[0]) < REG[0] + 300 && Math.abs(p[1]) < REG[1] + 300);
      if (pts.length < 2) continue;
      const dd = polyD(pts, false);
      const lw = v.lumen * 10, ww = v.wall * 10;
      E('path', { d: dd, fill: 'none', stroke: mix(COL.endo, COL.white, 0.1), strokeOpacity: 0.32, strokeWidth: lw + 2 * ww, strokeLinejoin: 'round' }, vg);
      E('path', { d: dd, fill: 'none', stroke: mix(COL.rbc, COL.bg, 0.7), strokeOpacity: 1, strokeWidth: lw, strokeLinejoin: 'round' }, vg);
      E('path', { d: dd, fill: 'none', stroke: mix(COL.rbc, COL.bg, 0.55), strokeOpacity: 0.5, strokeWidth: lw * 0.55, strokeLinejoin: 'round' }, vg);
      // wall edges (fine lines either side) + elongated endothelial nuclei
      const edge = (sgn) => pts.map((p, i) => { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)]; const t = unit(sub(b, a)); return add(p, mul([-t[1], t[0]], sgn * (lw / 2 + ww))); });
      const de = polyD(edge(1), false) + polyD(edge(-1), false);
      E('path', { d: de, fill: 'none', stroke: mix(COL.endo, COL.white, 0.35), strokeOpacity: 0.7, strokeWidth: 1.1, strokeLinejoin: 'round', ...NS }, vg);
      let dnuc = '';
      for (let i = 6; i < pts.length - 6; i += 11) {
        const a = pts[i - 1], b = pts[i + 1], t = unit(sub(b, a));
        const sgn = i % 22 < 11 ? 1 : -1;
        const p = add(pts[i], mul([-t[1], t[0]], sgn * (lw / 2 + ww * 0.5)));
        dnuc += ellD(p[0], p[1], 34, 7, Math.atan2(t[1], t[0]));
      }
      E('path', { d: dnuc, fill: mix(COL.endo, COL.bg, 0.45), fillOpacity: 0.9, stroke: COL.endo, strokeOpacity: 0.5, strokeWidth: 0.8, ...NS }, vg);
    }
    for (const rb of skin.rbcs) {
      const p = T3(rb.p);
      if (Math.abs(p[0]) > REG[0] + 100 || Math.abs(p[1]) > REG[1] + 100) continue;
      const ang = Math.atan2(rb.dir[1], rb.dir[0]) / DEG + 90;
      const c = redBloodCell({ r: 37.5, view: rb.view, angle: ang, seed: rb.seed, glow: false });
      c.setAttribute('transform', `translate(${nf(p[0])} ${nf(p[1])})`);
      vg.append(c);
    }
    drawCells(g, skin.cells, T3, 'detail', { region: REG });
    drawGranular(g, T3, 10, { region: REG });
    drawCorneum(g, T3, 10, { region: REG });
    const mac = macrophage({ r: 90, variant: 'm1', seed: 6, receptors: false });
    mac.setAttribute('transform', `translate(${nf(MA3[0])} ${nf(MA3[1])})`);
    const tc = lymphocyte(tCell({ variant: 'cd8', r: 35, seed: 9, receptors: false }));
    tc.setAttribute('transform', `translate(${nf(TC3[0])} ${nf(TC3[1])})`);
    const ec = bacterium({ shape: 'rod', r: 10, angle: -25, seed: 4, glow: true });
    ec.setAttribute('transform', `translate(${nf(EC3[0])} ${nf(EC3[1])})`);
    g.append(mac, tc, ec);
    // labels
    const rbcAt = skin.rbcs.map((r) => T3(r.p)).filter((p) => p[1] > 140 && p[1] < 280 && p[0] > 0 && p[0] < 300).sort((a, b) => a[1] - b[1])[0] || [90, 200];
    const bodyAt = (() => { const c = skin.cells.map((c) => ({ c, p: T3(c.c) })).filter((o) => o.p[1] < -150 && o.p[0] < -150 && o.p[0] > -380).sort((a, b) => a.p[1] - b.p[1]).pop(); return c ? c.p : [-300, -250]; })();
    labels.push({ scene: 3, at: bodyAt, text: 'body cells', wide: [-70, -40, 'end'], compact: [-40, -52, 'end'] });
    labels.push({ scene: 3, at: rbcAt, text: 'red blood cells', wide: [95, 60, 'start'], compact: [-100, 122, 'end'] });
    labels.push({ scene: 3, at: [MA3[0], MA3[1] - 70], text: 'macrophage', wide: [0, -42, 'middle'], compact: [-20, 95, 'middle'] });
    labels.push({ scene: 3, at: [TC3[0] + 10, TC3[1] + 30], text: 'T cell', wide: [25, 95, 'middle'], compact: [30, 110, 'middle'] });
    scenes.push({ g });
  }

  // ================================================================ SCENE 4 — T cell & bacterium (u = 10 nm)
  {
    const g = E('g', { class: 's1-scene' });
    const derm = dermisPoly(T4, F2[0] + F3[0] / 10 - 16, F2[0] + F3[0] / 10 + 16, F2[1] + F3[1] / 10 + 20, 0.05);
    E('path', { d: polyD(derm), fill: COL.sand, fillOpacity: 0.03 }, g);
    const fg = E('g', { clipPath: clipOf(polyD(derm)) }, g);
    fg.append(ecmFibers({ width: 2600, height: 3000, x: -1300, y: -1500, count: 30, seed: 8, angle: -20, spread: 60, waviness: 3, opacity: 0.9 }));
    const near4 = skin.cells.filter((c) => { const p = T4(c.c); return Math.abs(p[0]) < 3000 && Math.abs(p[1]) < 3200; });
    drawCells(g, near4, T4, 'detail');
    // virus specks (each ~100 nm: 1 % of the view)
    let dv = '';
    const halo = haloFill(COL.coral, 'dark', { intensity: 1.2 });
    const hg = E('g', null, g);
    for (const p of particles) {
      const q = add(F4, mul(p.c, 0.1));
      dv += circ(q[0], q[1], p.r / 10);
      E('circle', { cx: nf(q[0]), cy: nf(q[1]), r: 12, fill: halo }, hg);
    }
    E('path', { d: dv, fill: mix(COL.coral, COL.white, 0.15), stroke: mix(COL.coral, COL.white, 0.5), strokeOpacity: 0.8, strokeWidth: 0.7, ...NS }, g);
    const tc = tc4;
    drawVilli(g, villi4, (p) => p, 1);
    tc.setAttribute('transform', `translate(${nf(TC4[0])} ${nf(TC4[1])})`);
    const ec = bacterium({ shape: 'rod', r: 100, angle: -25, seed: 4 });
    ec.setAttribute('transform', `translate(${nf(EC4[0])} ${nf(EC4[1])})`);
    g.append(tc, ec);
    labels.push({ scene: 4, at: [TC4[0] - 120, TC4[1] + 120], text: 'T cell', wide: [-70, 110, 'end'], compact: [0, 118, 'middle'] });
    labels.push({ scene: 4, at: [EC4[0] + 40, EC4[1] + 20], text: 'bacterium', wide: [-20, -120, 'middle'], compact: [-20, 80, 'middle'] });
    labels.push({ scene: 4, at: add(F4, mul(n4, 6)), text: 'virus particles', wide: [70, 48, 'start'], compact: [-26, -62, 'end'] });
    scenes.push({ g });
  }

  // ================================================================ SCENE 5 — virus particles (u = 1 nm)
  {
    const g = E('g', { class: 's1-scene' });
    // the body cell whose membrane the particles sit on (and its neighbours)
    const near5 = skin.cells.filter((c) => { const p = T5c(c.c); return Math.abs(p[0]) < 30000 && Math.abs(p[1]) < 30000; });
    const Tn = tones(COL.sand, 'dark');
    for (const c of near5) {
      const P = c.dense.map(T5c);
      const d = smoothPath(P, { closed: true, smooth: 0.3 });
      if (!P.some((p) => Math.abs(p[0]) < 4000 && Math.abs(p[1]) < 4000) && !insidePoly(P, [0, 0])) continue;
      E('path', { d, fill: Tn.bodyOut, fillOpacity: 0.32 }, g);
      const cg = E('g', { clipPath: clipOf(d) }, g);
      E('path', { d, fill: 'none', stroke: COL.sand, strokeOpacity: 0.12, strokeWidth: 140 }, cg);
      E('path', { d, fill: 'none', stroke: COL.sand, strokeOpacity: 0.16, strokeWidth: 40 }, cg);
      E('path', { d, fill: 'none', stroke: mix(COL.sand, COL.white, 0.3), strokeOpacity: 0.85, strokeWidth: 6 }, g);
      E('path', { d, fill: 'none', stroke: Tn.bodyIn, strokeOpacity: 0.9, strokeWidth: 1.8 }, g);
    }
    // the T cell's edge (same outline as at 10 µm) with its microvilli
    {
      const Tt = tones(COL.cd8, 'dark');
      drawVilli(g, villi4, T5, 10, [1700, 1800]);
      const dT = smoothPath(Tpoly5, { closed: true, smooth: 0.34 });
      E('path', { d: dT, fill: Tt.bodyOut, fillOpacity: 0.5 }, g);
      const cg = E('g', { clipPath: clipOf(dT) }, g);
      E('path', { d: dT, fill: 'none', stroke: COL.cd8, strokeOpacity: 0.16, strokeWidth: 160 }, cg);
      E('path', { d: dT, fill: 'none', stroke: Tt.rim, strokeOpacity: 0.85, strokeWidth: 6 }, g);
      E('path', { d: dT, fill: 'none', stroke: Tt.bodyIn, strokeOpacity: 0.9, strokeWidth: 1.8 }, g);
    }
    // membrane proteins (~5–12 nm) along the visible stretch of membrane, and a few vesicles inside
    {
      const R = rng(55, 'memprot');
      let dp = '', dh = '', dv = '';
      for (let i = 0; i < memS.length; i += R.int(3, 8)) {
        const m = memS[i];
        if (Math.abs(m.p[0]) > 1300 || Math.abs(m.p[1]) > 1500) continue;
        const h = R.range(5, 12);
        const dir = rot(m.n, R.range(-0.35, 0.35));
        const base = add(m.p, mul(m.n, 2.5));
        const tip = add(base, mul(dir, h));
        dp += `M${nf(base[0])} ${nf(base[1])}L${nf(tip[0])} ${nf(tip[1])}`;
        dh += circ(tip[0], tip[1], R.range(2.2, 3.6));
        if (R.chance(0.05)) { const c = add(m.p, mul(m.n, -R.range(90, 260))); dv += circ(c[0], c[1], R.range(28, 48)); }
      }
      E('path', { d: dp, fill: 'none', stroke: mix(COL.sand, COL.white, 0.2), strokeOpacity: 0.55, strokeWidth: 1.6, strokeLinecap: 'round' }, g);
      E('path', { d: dh, fill: mix(COL.sand, COL.white, 0.15), fillOpacity: 0.6 }, g);
      E('path', { d: dv, fill: mix(COL.sand, COL.bg, 0.55), fillOpacity: 0.5, stroke: mix(COL.sand, COL.white, 0.2), strokeOpacity: 0.55, strokeWidth: 1, ...NS }, g);
    }
    // particles: membrane envelope (fine double line), sparse club-shaped spikes, inner nucleocapsid
    const halo = haloFill(COL.coral, 'dark', { intensity: 1.1 });
    const Tv = tones(COL.coral, 'dark');
    for (const p of particles) {
      const pg = E('g', null, g);
      E('circle', { cx: nf(p.c[0]), cy: nf(p.c[1]), r: nf(p.r * 1.75), fill: halo }, pg);
      let dStalk = '', dHead = '';
      for (const sp of p.spikes) {
        const u = [Math.sin(sp.ang), -Math.cos(sp.ang)];
        const ax = [Math.sin(sp.ang + sp.tilt), -Math.cos(sp.ang + sp.tilt)];
        const b = add(p.c, mul(u, p.r - 0.8));
        const top = add(add(b, mul(ax, 9.2)), mul([-ax[1], ax[0]], sp.bend * 1.8));
        dStalk += `M${nf(b[0])} ${nf(b[1])}L${nf(top[0])} ${nf(top[1])}`;
        const r = [-ax[1], ax[0]];
        const hp = HEAD.map((q) => add(add(top, mul(r, q[0] / 10)), mul(ax, -q[1] / 10)));
        dHead += smoothPath(hp, { closed: true, smooth: 0.3 });
      }
      E('path', { d: dStalk, fill: 'none', stroke: mix(COL.coral, COL.white, 0.25), strokeOpacity: 0.85, strokeWidth: 2.2, strokeLinecap: 'round' }, pg);
      E('path', { d: dHead, fill: mix(COL.coral, COL.bg, 0.25), stroke: mix(COL.coral, COL.white, 0.45), strokeOpacity: 0.9, strokeWidth: 0.9, strokeLinejoin: 'round', ...NS }, pg);
      E('circle', { cx: nf(p.c[0]), cy: nf(p.c[1]), r: nf(p.r - 2), fill: Tv.bodyIn, fillOpacity: 0.8 }, pg);
      const R = rng(p.seed, 'rnp');
      let dr = '';
      for (let i = 0; i < 26; i++) { const a = R.range(0, TAU), rr = Math.sqrt(R()) * (p.r - 9); dr += circ(p.c[0] + Math.cos(a) * rr, p.c[1] + Math.sin(a) * rr, R.range(2, 3.4)); }
      E('path', { d: dr, fill: mix(COL.coral, COL.white, 0.1), fillOpacity: 0.42 }, pg);
      E('circle', { cx: nf(p.c[0]), cy: nf(p.c[1]), r: nf(p.r), fill: 'none', stroke: mix(COL.coral, COL.white, 0.4), strokeOpacity: 0.95, strokeWidth: 1, ...NS }, pg);
      E('circle', { cx: nf(p.c[0]), cy: nf(p.c[1]), r: nf(p.r - 4), fill: 'none', stroke: mix(COL.coral, COL.white, 0.2), strokeOpacity: 0.75, strokeWidth: 0.8, ...NS }, pg);
    }
    // antibodies on the hero particle (natural: gold, no outline) — the same three as in scene 6
    for (const b of abs6) {
      const ab = antibody({ size: AB_SIZE / 10, variant: 'generic' });
      const pos = add(F5, mul(b.pos, 0.1));
      ab.setAttribute('transform', `translate(${nf(pos[0])} ${nf(pos[1])}) rotate(${nf(b.rho / DEG)})`);
      g.append(ab);
    }
    // a few free antibodies drifting nearby
    [[-330, -40, 40], [250, 200, -70], [-150, 330, 160], [420, -60, 20], [-420, 520, -120], [120, -560, 80]].forEach(([x, y, a]) => {
      const ab = antibody({ size: AB_SIZE / 10, variant: 'generic' });
      ab.setAttribute('transform', `translate(${x} ${y}) rotate(${a})`);
      ab.setAttribute('opacity', '0.85');
      g.append(ab);
    });
    const pl = particles.filter((p) => !p.hero).sort((a, b) => len(sub(a.c, [-400, 245])) - len(sub(b.c, [-400, 245])))[0];
    const plC = particles.filter((p) => !p.hero).sort((a, b) => len(sub(a.c, [-260, 520])) - len(sub(b.c, [-260, 520])))[0];
    labels.push({ scene: 5, at: add(pl.c, mul(unit([1, -1]), pl.r * 0.7)), atC: add(plC.c, mul(unit([1, -1]), plC.r * 0.7)), text: 'virus particles (~100 nm)', wide: [70, -62, 'start'], compact: [40, -48, 'start'] });
    scenes.push({ g });
  }

  // ================================================================ SCENE 6 — spikes & antibodies (u = 0.1 nm)
  {
    const g = E('g', { class: 's1-scene' });
    const Tv = tones(COL.coral, 'dark');
    // envelope: lipid bilayer (≈ 4 nm), heads drawn as beads in both leaflets
    E('circle', { cx: nf(H6[0]), cy: nf(H6[1]), r: nf(R6 * 1.3), fill: haloFill(COL.coral, 'dark') }, g);
    E('circle', { cx: nf(H6[0]), cy: nf(H6[1]), r: nf(R6 - 40), fill: Tv.bodyIn, fillOpacity: 0.85 }, g);
    E('circle', { cx: nf(H6[0]), cy: nf(H6[1]), r: nf(R6 - 20), fill: 'none', stroke: mix(COL.coral, COL.bg, 0.45), strokeOpacity: 0.85, strokeWidth: 28 }, g);
    {
      let dh = '';
      for (const rr of [R6 - 4, R6 - 36]) {
        const step = 9.2 / rr;
        for (let a = 0; a < TAU; a += step) dh += circ(H6[0] + Math.sin(a) * rr, H6[1] - Math.cos(a) * rr, 3.9);
      }
      E('path', { d: dh, fill: mix(COL.coral, COL.white, 0.3), fillOpacity: 0.85 }, g);
      // tails: fine radial lines between the leaflets
      let dt = '';
      for (let a = 0; a < TAU; a += 9.2 / R6) {
        for (const [r0, r1] of [[R6 - 8, R6 - 19], [R6 - 32, R6 - 21]]) {
          dt += `M${nf(H6[0] + Math.sin(a) * r0)} ${nf(H6[1] - Math.cos(a) * r0)}L${nf(H6[0] + Math.sin(a + 0.004) * r1)} ${nf(H6[1] - Math.cos(a + 0.004) * r1)}`;
        }
      }
      E('path', { d: dt, fill: 'none', stroke: mix(COL.coral, COL.white, 0.15), strokeOpacity: 0.3, strokeWidth: 1.2 }, g);
      // nucleocapsid (RNA + N protein) inside
      const R = rng(61, 'n');
      let dn = '';
      for (let i = 0; i < 160; i++) { const a = R.range(0, TAU), rr = Math.sqrt(R()) * (R6 - 70); dn += circ(H6[0] + Math.cos(a) * rr, H6[1] + Math.sin(a) * rr, R.range(14, 24)); }
      E('path', { d: dn, fill: mix(COL.coral, COL.white, 0.05), fillOpacity: 0.22 }, g);
      // small membrane proteins between the spikes
      let dm = '';
      for (let a = 0; a < TAU; a += R.range(0.1, 0.22)) dm += ellD(H6[0] + Math.sin(a) * (R6 - 20), H6[1] - Math.cos(a) * (R6 - 20), 13, 24, a);
      E('path', { d: dm, fill: mix(COL.coral, COL.bg, 0.35), fillOpacity: 0.45, stroke: mix(COL.coral, COL.white, 0.2), strokeOpacity: 0.25, strokeWidth: 0.8, ...NS }, g);
    }
    // amino-acid stipple (beads 0.5 nm across)
    const patId = uid('aa');
    const pat = E('pattern', { id: patId, patternUnits: 'userSpaceOnUse', width: 13, height: 11.2 }, svg.defs);
    for (const [x, y] of [[0, 0], [13, 0], [0, 11.2], [13, 11.2], [6.5, 5.6]]) E('circle', { cx: x, cy: y, r: 2.6, fill: mix(COL.coral, COL.white, 0.35), fillOpacity: 0.35 }, pat);
    const headFill = bodyFill(COL.coral, 'dark', { intensity: 1.05 });
    for (const sp of heroSpikes) {
      const s6 = spike6(sp);
      const hf = headTf(s6);
      const mid = add(add(s6.base, mul(sub(s6.top, s6.base), 0.5)), mul([-s6.ax[1], s6.ax[0]], sp.bend * 10));
      const ds = `M${nf(s6.base[0])} ${nf(s6.base[1])}Q${nf(mid[0])} ${nf(mid[1])} ${nf(s6.top[0])} ${nf(s6.top[1])}`;
      E('path', { d: ds, fill: 'none', stroke: mix(COL.coral, COL.bg, 0.25), strokeWidth: 19, strokeLinecap: 'round' }, g);
      E('path', { d: ds, fill: 'none', stroke: mix(COL.coral, COL.white, 0.35), strokeOpacity: 0.6, strokeWidth: 1, ...NS }, g);
      const hd = smoothPath(HEAD.map(hf), { closed: true, smooth: 0.3 });
      E('path', { d: hd, fill: headFill, stroke: mix(COL.coral, COL.white, 0.45), strokeOpacity: 0.95, strokeWidth: 1.2, strokeLinejoin: 'round', ...NS }, g);
      E('path', { d: hd, fill: `url(#${patId})` }, g);
      const seam = [[-22, -6], [-24, -80], [-27, -148]].map(hf), seam2 = [[22, -6], [24, -80], [27, -148]].map(hf);
      E('path', { d: smoothPath(seam, { closed: false }) + smoothPath(seam2, { closed: false }), fill: 'none', stroke: mix(COL.coral, COL.bg, 0.5), strokeOpacity: 0.6, strokeWidth: 1, ...NS }, g);
    }
    for (const b of abs6) {
      const ab = antibody({ size: AB_SIZE, variant: 'generic' });
      ab.setAttribute('transform', `translate(${nf(b.pos[0])} ${nf(b.pos[1])}) rotate(${nf(b.rho / DEG)})`);
      g.append(ab);
    }
    const a1 = abs6[0];
    const fcAt = add(a1.pos, rot([0, -0.3 * AB_SIZE], a1.rho));
    labels.push({ scene: 6, at: fcAt, text: 'antibodies (~10–15 nm)', wide: [-110, -10, 'end'], compact: [60, -55, 'start'] });
    scenes.push({ g });
  }

  // ================================================================ SCENE 7 — amino acids at the contact (u = 0.01 nm)
  {
    const g = E('g', { class: 's1-scene' });
    const T7 = (q) => down(q, F6);
    const A1 = abs6[0];
    const s6 = spike6(heroSpikes[A1.spike]);
    const hf = headTf(s6);
    const headPts = HEAD.map((p) => T7(hf(p)));
    const contact = T7(A1.target);
    const BR = 25;                               // bead radius: 0.5 nm across
    // shaded bead paints
    const beadPaint = (color, shade, k = 1) => ctx.radialGradient(svg, [
      [0, mix(color, COL.white, (0.4 - shade * 0.22) * k)], [0.6, mix(color, COL.bg, (0.08 + shade * 0.3) * k)], [1, mix(color, COL.bg, (0.38 + shade * 0.28) * k)],
    ], { cx: '42%', cy: '38%', r: '62%' });
    const paints = {
      coral: [0, 1, 2].map((s) => beadPaint(mix(COL.coral, COL.bg, 0.12), s / 2, 0.7)),
      gold: [0, 1, 2].map((s) => beadPaint(COL.gold, s / 2)),
      coralGlow: ctx.radialGradient(svg, [[0, mix(COL.coral, COL.white, 0.78)], [0.5, mix(COL.coral, COL.white, 0.32)], [1, COL.coral]], { cx: '45%', cy: '42%', r: '60%' }),
      goldGlow: ctx.radialGradient(svg, [[0, mix(COL.gold, COL.white, 0.8)], [0.5, mix(COL.gold, COL.white, 0.3)], [1, COL.gold]], { cx: '45%', cy: '42%', r: '60%' }),
    };
    // spike head body under the beads (solid, with the same stipple deeper down)
    const hdD = smoothPath(headPts, { closed: true, smooth: 0.3 });
    E('path', { d: hdD, fill: bodyFill(COL.coral, 'dark') }, g);
    const patId = uid('aa7');
    const pat = E('pattern', { id: patId, patternUnits: 'userSpaceOnUse', width: 130, height: 112 }, svg.defs);
    for (const [x, y] of [[0, 0], [130, 0], [0, 112], [130, 112], [65, 56]]) E('circle', { cx: x, cy: y, r: 25, fill: mix(COL.coral, COL.bg, 0.35), fillOpacity: 0.55 }, pat);
    E('path', { d: hdD, fill: `url(#${patId})` }, g);
    // head beads near the surface (3-D packing, back to front)
    const R = rng(71, 'beads');
    const inHead = (p) => insidePoly(headPts, p);
    const surfaceDist = (p) => { let best = Infinity; for (let i = 0; i < headPts.length; i++) { const a = headPts[i], b = headPts[(i + 1) % headPts.length]; const ab = sub(b, a), t = clamp(dot(sub(p, a), ab) / dot(ab, ab), 0, 1); best = Math.min(best, len(sub(p, add(a, mul(ab, t))))); } return best; };
    const head = [];
    for (let i = 0; i < 9000 && head.length < 520; i++) {
      const p = [R.range(-1250, 1250), R.range(contact[1] - 200, contact[1] + 900)];
      if (!inHead(p)) continue;
      const sd = surfaceDist(p);
      if (sd > 520) continue;
      const z = R.range(-1, 1);
      if (head.some((h) => (h.p[0] - p[0]) ** 2 + (h.p[1] - p[1]) ** 2 < (36 + 14 * Math.abs(z - h.z)) ** 2)) continue;
      head.push({ p, z, sd });
    }
    // antibody arm tip: V domains (VH, VL), and the constant domains above them
    const ang36 = 36 * DEG, u = AB_SIZE;
    const armLocal = (t, off) => {
      const dx = Math.sin(ang36), dy = -Math.cos(ang36), px = Math.cos(ang36), py = Math.sin(ang36);
      const La = 0.56 * u, ox = 0.035 * u, oy = -0.485 * u;
      return [ox + dx * La * t + px * off, oy + dy * La * t + py * off];
    };
    const toScene7 = (pl) => T7(add(A1.pos, rot(pl, A1.rho)));
    const armDir = unit(sub(toScene7(armLocal(1, 0)), toScene7(armLocal(0, 0))));
    const across = [-armDir[1], armDir[0]];
    const domains = [
      { c: toScene7(armLocal(0.8, -0.045 * u)), a: 172, b: 118, n: 110, main: true },    // VH
      { c: toScene7(armLocal(0.8, 0.112 * u)), a: 172, b: 118, n: 110, main: true },     // VL
      { c: toScene7(armLocal(0.25, -0.045 * u)), a: 172, b: 118, n: 110 },               // CH1
      { c: toScene7(armLocal(0.3, 0.112 * u)), a: 165, b: 118, n: 110 },                 // CL
    ];
    const abBeads = [];
    domains.forEach((dm, di) => {
      const RD = rng(90 + di, 'dom');
      const list = [];
      for (let i = 0; i < 6000 && list.length < dm.n; i++) {
        const l = [RD.range(-1, 1), RD.range(-1, 1), RD.range(-1, 1)];
        if (l[0] ** 2 + l[1] ** 2 + l[2] ** 2 > 1) continue;
        const pos3 = [l[0] * dm.b, l[1] * dm.a, l[2] * dm.b];
        if (list.some((q) => (q.l[0] - pos3[0]) ** 2 + (q.l[1] - pos3[1]) ** 2 + (q.l[2] - pos3[2]) ** 2 < 36 * 36)) continue;
        list.push({ l: pos3 });
      }
      for (const q of list) {
        const p = add(add(dm.c, mul(across, q.l[0])), mul(armDir, q.l[1]));
        abBeads.push({ p, z: q.l[2] / dm.b, dom: di });
      }
    });
    // the contact patch: beads within reach of the interface
    const nearContact = (p) => Math.abs(p[0] - contact[0]) < 270 && Math.abs(p[1] - contact[1]) < 70;
    const glowG = E('g', null, g);
    const all = [
      ...head.map((h) => ({ ...h, kind: 'coral' })),
      ...abBeads.map((b) => ({ ...b, kind: 'gold' })),
    ].sort((a, b) => a.z - b.z);
    const bg = E('g', null, g);
    for (const b of all) {
      const shade = b.z > 0.33 ? 0 : b.z > -0.33 ? 1 : 2;
      const glow = nearContact(b.p) && b.z > -0.2;
      const fill = glow ? (b.kind === 'gold' ? paints.goldGlow : paints.coralGlow) : paints[b.kind][shade];
      const fade = b.kind === 'coral' ? clamp(1 - (b.sd - 380) / 160, 0, 1) : (b.dom >= 2 ? 0.82 : 1);
      const r = BR * (0.92 + 0.12 * (b.z + 1) / 2);
      E('circle', { cx: nf(b.p[0]), cy: nf(b.p[1]), r: nf(r), fill, opacity: fade < 1 ? nf(fade) : null }, bg);
    }
    E('ellipse', { cx: nf(contact[0]), cy: nf(contact[1]), rx: 420, ry: 170, fill: haloFill(COL.gold, 'dark', { intensity: 1.5 }) }, glowG);
    // labels: one bead, and the contact
    const rightDom = domains[0].c[0] > domains[1].c[0] ? 0 : 1;
    const solo = abBeads.filter((b) => b.dom === rightDom && b.z > 0.45 && b.p[1] < domains[rightDom].c[1]).sort((a, b) => b.p[0] - a.p[0])[0];
    labels.push({ scene: 7, at: solo ? solo.p : domains[rightDom].c, text: 'each bead = one amino acid\n(<1 nm)', textC: 'each bead = one\namino acid (<1 nm)', wide: [150, -70, 'start'], compact: [390, 92, 'end', 'abs'] });
    labels.push({ scene: 7, at: [contact[0] + 210, contact[1] - 20], text: 'the contact:\nwhere recognition happens', textC: 'the contact: where\nrecognition happens', wide: [170, -60, 'start'], compact: [390, 196, 'end', 'abs'] });
    scenes.push({ g });
  }


  for (const s of scenes) { s.g.setAttribute('display', 'none'); world.append(s.g); s.shown = false; }

  // ================================================================ overlay: frame, labels, scale bar
  const frameEl = E('g', { class: 's1-frame', opacity: 0 }, over);
  const frameGlow = E('rect', { fill: 'none', stroke: '#0B1024', strokeOpacity: 0.55, strokeWidth: 3.4, rx: 1.5 }, frameEl);
  const frameRect = E('rect', { fill: 'none', stroke: '#E9ECF6', strokeOpacity: 0.85, strokeWidth: 1.2, strokeDasharray: '5 4', rx: 1.5 }, frameEl);
  const corners = E('path', { fill: 'none', stroke: '#FFFFFF', strokeOpacity: 0.95, strokeWidth: 1.6, strokeLinecap: 'round' }, frameEl);
  for (const L of labels) {
    L.g = E('g', { class: 's1-label', opacity: 0 }, over);
    L.leader = E('path', { class: 'leader' }, L.g);
    L.dot = E('circle', { class: 'leader-dot', r: 2.4 }, L.g);
    L.t = E('text', { class: 't-label t-halo' }, L.g);
  }
  const labelText = () => {
    for (const L of labels) {
      const txt = (lay === 'compact' && L.textC) || L.text;
      if (L.cur === txt) continue;
      L.cur = txt;
      L.t.replaceChildren();
      L.lines = txt.split('\n');
      L.spans = L.lines.map((ln) => E('tspan', { text: ln }, L.t));
      L.w = {};
    }
  };
  labelText();
  const bar = E('g', { class: 's1-bar' }, over);
  const barHalo = E('path', { fill: 'none', stroke: '#0B1024', strokeOpacity: 0.6, strokeWidth: 5, strokeLinecap: 'round' }, bar);
  const barLine = E('path', { fill: 'none', stroke: '#E9ECF6', strokeWidth: 1.6, strokeLinecap: 'round' }, bar);
  const barText = E('text', { class: 't-label t-halo t-num', textAnchor: 'middle' }, bar);

  // readout (HTML, top-left of the stage)
  const rW = ctx.h('b', null, STOPS[0].w);
  const rP = ctx.h('div', { class: 's1-readout__p' }, STOPS[0].plain);
  const readout = ctx.h('div', { class: 's1-readout', 'aria-hidden': 'true' }, ctx.h('div', { class: 's1-readout__w' }, 'Width of view: ', rW), rP);
  ctx.stage.append(readout);

  // ================================================================ controls
  const ctl = ctx.h('div', { class: 's1-ctl' });
  ctx.controls.append(ctl);
  const tourBtn = ctx.ui.playPause({ labels: { play: 'Play all', pause: 'Pause' }, parent: ctl, onChange: (on) => (on ? startTour() : stopTour(true)) });
  const zoomRow = ctx.h('div', { class: 's1-zoom' });
  ctl.append(zoomRow);
  const minus = ctx.ui.button({ label: 'Zoom out one step', icon: 'minus', iconOnly: true, parent: zoomRow, onClick: () => { userInput(); step(-1); } });
  const track = ctx.h('div', { class: 's1-track' });
  zoomRow.append(track);
  const plus = ctx.ui.button({ label: 'Zoom in one step', icon: 'plus', iconOnly: true, parent: zoomRow, onClick: () => { userInput(); step(1); } });
  const input = ctx.h('input', { class: 'slider__input s1-range', type: 'range', min: 0, max: LAST, step: 'any', value: 0, 'aria-label': 'Width of view (zoom)' });
  track.append(input);
  const ticksEl = ctx.h('div', { class: 's1-ticks' });
  track.append(ticksEl);
  const ticks = STOPS.map((s, i) => {
    const b = ctx.h('button', { type: 'button', class: 's1-tick', tabindex: '-1', 'aria-label': `Zoom to ${s.spoken} across`, style: { left: `calc(0.625rem + (100% - 1.25rem) * ${i / LAST})` } }, ctx.h('span', { class: 's1-tick__t' }, s.w));
    b.addEventListener('click', () => { userInput(); goTo(i); }, { signal: ctx.signal });
    ticksEl.append(b);
    return b;
  });
  const syncTicks = () => ticks.forEach((b, i) => { if (lay === 'compact' && i % 2) b.dataset.minor = ''; else delete b.dataset.minor; });

  // caption: the nearest stop's caption (verbatim) + "What if a T cell were your height?"
  const steps = ctx.steps.length ? ctx.steps : STOPS.map((s) => ({ html: s.w, text: s.w }));
  const capWrap = ctx.h('div', { class: 'fig__steps s1-steps' });
  const capEls = steps.map((s, i) => {
    const el = ctx.h('div', { class: 'fig__step', 'aria-hidden': 'true' },
      ctx.h('span', { class: 'fig__step-num', html: `Stop ${i + 1} <span class="of">of ${steps.length}</span> <span class="t">· ${STOPS[i]?.w ?? ''} across</span>` }),
      ctx.h('p', { class: 'fig__step-text', html: s.html }));
    capWrap.append(el);
    return el;
  });
  const tallLine = ctx.h('p', { class: 's1-tall__line' }, TALL[0]);
  const tall = ctx.h('details', { class: 's1-tall' },
    ctx.h('summary', null, 'What if a T cell were your height?'),
    tallLine,
    ctx.h('p', { class: 's1-tall__note' }, 'Everything scaled up about 240,000 times (1.7 m ÷ 7 µm).'));
  ctx.caption.append(capWrap, tall);

  // ================================================================ camera + render
  const state = { z: 0 };
  let blend = null;                 // reduced motion: { a, b, p }
  // crossfade windows per step k → k+1: [fade-in start, end] for scene k+1, [fade-out start, end] for scene k.
  // Step 1 → 2 (top view → slice) is a change of viewpoint, not a zoom into matching detail: dissolve earlier.
  const XF = (k) => (k === 1 ? [0.5, 0.82, 0.35, 0.7] : [0.64, 0.9, 0.74, 0.985]);
  function opacityOf(j, z) {
    let o = 1;
    if (j > 0) { const w = XF(j - 1); o *= sstep(j - 1 + w[0], j - 1 + w[1], z); }
    if (j < LAST) { const w = XF(j); o *= 1 - sstep(j + w[2], j + w[3], z); }
    return o;
  }
  function transformsAt(z) {
    const k0 = Math.min(LAST - 1, Math.floor(z + 1e-9));
    const t = z - k0;
    const m = Math.pow(10, t);
    const F = frames[k0];
    const P = [F[0] * 10 / 9, F[1] * 10 / 9];
    const s0 = S * m;
    const tx0 = S * P[0] * (1 - m) + CX, ty0 = S * P[1] * (1 - m) + CY;
    const xf = {};
    xf[k0] = [s0, tx0, ty0];
    xf[k0 + 1] = [s0 / 10, tx0 + s0 * F[0], ty0 + s0 * F[1]];
    return { k0, t, xf };
  }
  const stopXf = () => [S, CX, CY];

  let lastCap = -1, lastW = '', lastBar = '', lastPlainOp = -1, lastPlain = '';
  const setScene = (j, xf, op) => {
    const s = scenes[j];
    if (!xf || op < 0.003) {
      if (s.shown) { s.g.setAttribute('display', 'none'); s.shown = false; }
      return;
    }
    if (!s.shown) { s.g.removeAttribute('display'); s.shown = true; }
    const tr = `matrix(${xf[0].toPrecision(7)} 0 0 ${xf[0].toPrecision(7)} ${xf[1].toFixed(2)} ${xf[2].toFixed(2)})`;
    if (s.tr !== tr) { s.g.setAttribute('transform', tr); s.tr = tr; }
    const o = op > 0.997 ? '1' : op.toFixed(3);
    if (s.op !== o) { s.g.setAttribute('opacity', o); s.op = o; }
  };
  const place = (xf, p) => [xf[0] * p[0] + xf[1], xf[0] * p[1] + xf[2]];

  function drawFrame(j, xf, op) {
    if (j >= LAST || !xf || op < 0.01) { frameEl.setAttribute('opacity', 0); return; }
    const c = place(xf, frames[j]);
    const hw = xf[0] * 50, hh = xf[0] * 50 / AR;
    const x = c[0] - hw, y = c[1] - hh, w = hw * 2, h = hh * 2;
    for (const r of [frameGlow, frameRect]) { r.setAttribute('x', x.toFixed(2)); r.setAttribute('y', y.toFixed(2)); r.setAttribute('width', w.toFixed(2)); r.setAttribute('height', h.toFixed(2)); }
    const k = Math.min(7, w * 0.22);
    corners.setAttribute('d', `M${nf(x)} ${nf(y + k)}V${nf(y)}H${nf(x + k)}M${nf(x + w - k)} ${nf(y)}H${nf(x + w)}V${nf(y + k)}M${nf(x + w)} ${nf(y + h - k)}V${nf(y + h)}H${nf(x + w - k)}M${nf(x + k)} ${nf(y + h)}H${nf(x)}V${nf(y + h - k)}`);
    frameEl.setAttribute('opacity', op.toFixed(3));
  }
  function drawLabels(opFor) {
    for (const L of labels) {
      const { op, xf } = opFor(L.scene);
      const spec = L[lay];
      if (!spec || !xf || op < 0.01) { if (L.vis !== false) { L.g.setAttribute('opacity', 0); L.vis = false; } continue; }
      L.vis = true;
      const [dx, dy, anchor, mode] = spec;
      const A = place(xf, (lay === 'compact' && L.atC) || L.at);
      let tx = mode === 'abs' ? dx : A[0] + dx;
      const ty = mode === 'abs' ? dy : A[1] + dy;
      if (!L.w) L.w = {};
      if (L.w[lay] == null) { try { L.w[lay] = Math.max(...L.spans.map((sp) => sp.getComputedTextLength())); } catch { L.w[lay] = 0; } }
      const tw = L.w[lay], M = lay === 'compact' ? 10 : 16;
      const left = anchor === 'start' ? tx : anchor === 'end' ? tx - tw : tx - tw / 2;
      if (left < M) tx += M - left; else if (left + tw > VW - M) tx -= left + tw - (VW - M);
      L.dot.setAttribute('cx', A[0].toFixed(1)); L.dot.setAttribute('cy', A[1].toFixed(1));
      const lh = lay === 'compact' ? 19 : 18, nl = L.lines.length;
      const y0 = ty + 5 - ((nl - 1) * lh) / 2;
      L.spans.forEach((sp, i) => { sp.setAttribute('x', tx.toFixed(1)); sp.setAttribute('y', (y0 + i * lh).toFixed(1)); });
      L.t.setAttribute('text-anchor', anchor);
      // leader: from the anchor dot to the nearest point of the (padded) text box
      const bl = (anchor === 'start' ? tx : anchor === 'end' ? tx - tw : tx - tw / 2) - 6, br = bl + tw + 12;
      const bt = y0 - 14, bb = y0 + (nl - 1) * lh + 6;
      const ex = clamp(A[0], bl, br), ey = clamp(A[1], bt, bb);
      const show = A[0] < bl || A[0] > br || A[1] < bt || A[1] > bb;
      L.leader.setAttribute('d', show ? `M${A[0].toFixed(1)} ${A[1].toFixed(1)}L${ex.toFixed(1)} ${ey.toFixed(1)}` : '');
      L.g.setAttribute('opacity', op.toFixed(3));
    }
  }
  function drawBarAndReadout(z) {
    const W = 0.1 * Math.pow(10, -z);               // metres
    const wTxt = fmtLen(W), bTxt = fmtLen(W / 5);
    if (wTxt !== lastW) { rW.textContent = wTxt; lastW = wTxt; }
    const nearest = clamp(Math.round(z), 0, LAST);
    const pOp = 1 - sstep(0.03, 0.12, Math.abs(z - nearest));
    const plain = STOPS[nearest].plain;
    if (plain !== lastPlain) { rP.textContent = plain; lastPlain = plain; }
    const po = Math.round(pOp * 100) / 100;
    if (po !== lastPlainOp) { rP.style.opacity = String(po); lastPlainOp = po; }
    const L = VW / 5;
    const right = VW - (lay === 'compact' ? 16 : 26), base = VH - (lay === 'compact' ? 16 : 22);
    const d = `M${nf(right - L)} ${nf(base - 5)}V${nf(base)}H${nf(right)}V${nf(base - 5)}`;
    if (bTxt + d !== lastBar) {
      barHalo.setAttribute('d', d); barLine.setAttribute('d', d);
      barText.setAttribute('x', nf(right - L / 2)); barText.setAttribute('y', nf(base - 10));
      barText.textContent = bTxt;
      lastBar = bTxt + d;
    }
  }
  function syncControls(z, fromInput) {
    if (!fromInput) input.value = String(z);
    track.style.setProperty('--fill', `${(z / LAST) * 100}%`);
    const nearest = clamp(Math.round(z), 0, LAST);
    input.setAttribute('aria-valuetext', `Width of view ${fmtLen(0.1 * Math.pow(10, -z))}${Math.abs(z - nearest) < 0.02 ? `, ${STOPS[nearest].plain}` : ''}`);
    if (nearest !== lastCap) {
      capEls.forEach((el, i) => { el.classList.toggle('is-active', i === nearest); el.setAttribute('aria-hidden', String(i !== nearest)); });
      ticks.forEach((b, i) => b.classList.toggle('is-current', i === nearest));
      tallLine.textContent = TALL[nearest];
      lastCap = nearest;
    }
    minus.disabled = z <= 0.001 && !anim;
    plus.disabled = z >= LAST - 0.001 && !anim;
  }

  function render(fromInput = false) {
    if (blend) return renderBlend();
    const z = state.z;
    const { k0, xf } = transformsAt(z);
    for (let j = 0; j < scenes.length; j++) setScene(j, xf[j], xf[j] ? opacityOf(j, z) : 0);
    // the frame of the scene nearest the current zoom
    const fj = clamp(Math.round(z), 0, LAST);
    const fop = sstep(fj - 0.55, fj - 0.18, z) * (1 - sstep(fj + 0.2, fj + 0.6, z));
    drawFrame(fj, xf[fj], fop);
    drawLabels((j) => ({ xf: xf[j], op: 1 - sstep(0.05, 0.2, Math.abs(z - j)) }));
    drawBarAndReadout(z);
    syncControls(z, fromInput);
    void k0;
  }
  function renderBlend() {
    const { a, b, p } = blend;
    const X = stopXf();
    for (let j = 0; j < scenes.length; j++) setScene(j, (j === a || j === b) ? X : null, j === b ? p : j === a ? 1 - p : 0);
    // scene b on top
    if (scenes[b].g.nextSibling && b < a) world.append(scenes[b].g);
    frameEl.setAttribute('opacity', 0);
    drawFrame(b, X, sstep(0.4, 1, p));
    drawLabels((j) => ({ xf: X, op: j === b ? sstep(0.4, 1, p) : 0 }));
    drawBarAndReadout(b);
    syncControls(b, false);
  }
  const restoreOrder = () => { for (const s of scenes) world.append(s.g); };

  // ================================================================ interaction
  let anim = null;           // current gsap tween/timeline (zoom moves and the tour)
  let animTarget = null;
  let touring = false;
  let settleTimer = 0;
  const rm = () => ctx.reducedMotion;

  function kill() {
    if (anim) { anim.kill(); anim = null; }
    animTarget = null;
  }
  function stopTour(user = false) {
    if (!touring) return;
    touring = false;
    kill();
    tourBtn.set(false);
    if (user) settleTo(Math.round(state.z));
  }
  function userInput() { if (touring) stopTour(false); }
  function announceSoon() {
    clearTimeout(settleTimer);
    settleTimer = setTimeout(() => {
      const i = clamp(Math.round(state.z), 0, LAST);
      if (Math.abs(state.z - i) < 0.02) ctx.announce(`Width of view ${STOPS[i].spoken}. ${steps[i].text || ''}`);
    }, 450);
  }
  function goTo(target, { duration } = {}) {
    target = clamp(target, 0, LAST);
    if (rm()) return rmJump(Math.round(target));
    kill();
    const dz = Math.abs(target - state.z);
    if (dz < 1e-4) { state.z = target; render(); announceSoon(); return; }
    animTarget = target;
    anim = gsap.to(state, {
      z: target, duration: duration ?? Math.min(2.6, 0.7 + 0.55 * dz), ease: 'so.inOut',
      onUpdate: () => render(),
      onComplete: () => { anim = null; animTarget = null; render(); announceSoon(); },
    });
  }
  function settleTo(target) {
    target = clamp(target, 0, LAST);
    if (rm()) return rmJump(target);
    kill();
    if (Math.abs(target - state.z) < 1e-4) { state.z = target; render(); announceSoon(); return; }
    animTarget = target;
    anim = gsap.to(state, { z: target, duration: 0.35 + 0.5 * Math.abs(target - state.z), ease: 'so.out', onUpdate: () => render(), onComplete: () => { anim = null; animTarget = null; render(); announceSoon(); } });
  }
  function step(dir) {
    const base = animTarget ?? state.z;
    const next = dir > 0 ? Math.floor(base + 1e-6) + 1 : Math.ceil(base - 1e-6) - 1;
    goTo(clamp(next, 0, LAST));
  }
  function rmJump(target) {
    kill();
    const from = clamp(Math.round(blend ? blend.b : state.z), 0, LAST);
    target = clamp(Math.round(target), 0, LAST);
    blend = null;
    if (from === target) { state.z = target; restoreOrder(); render(); announceSoon(); return; }
    blend = { a: from, b: target, p: 0 };
    state.z = target;
    anim = gsap.to(blend, {
      p: 1, duration: 0.32, ease: 'none',
      onUpdate: () => render(),
      onComplete: () => { anim = null; blend = null; restoreOrder(); render(); announceSoon(); },
    });
  }
  function startTour() {
    if (rm()) { tourBtn.set(false); return; }
    kill();
    touring = true;
    tourBtn.set(true);
    const tl = gsap.timeline({ onUpdate: () => render(), onComplete: () => { anim = null; touring = false; tourBtn.set(false); render(); announceSoon(); } });
    let from = state.z;
    if (from > LAST - 0.02) { tl.to(state, { z: 0, duration: 2.2, ease: 'so.inOut' }).to({}, { duration: 1.0 }); from = 0; }
    let first = true;
    for (let k = Math.floor(from + 0.02) + 1; k <= LAST; k++) {
      if (!first) tl.to({}, { duration: 1.2 });
      tl.to(state, { z: k, duration: 1.4 * (first ? Math.max(0.4, k - from) : 1), ease: 'so.inOut', onComplete: () => announceSoon() });
      first = false;
    }
    anim = tl;
  }

  // slider
  let dragging = false;
  ctx.on(input, 'pointerdown', () => { userInput(); kill(); dragging = true; });
  ctx.on(input, 'input', () => {
    userInput();
    const v = Number(input.value);
    if (rm()) { const t = Math.round(v); if (t !== Math.round(blend ? blend.b : state.z)) rmJump(t); input.value = String(t); return; }
    kill();
    state.z = v;
    render(true);
  });
  const release = () => { if (!dragging) return; dragging = false; if (!rm()) settleTo(Math.round(state.z)); };
  ctx.on(input, 'change', release);
  ctx.on(input, 'pointerup', release);
  ctx.on(input, 'pointercancel', release);
  ctx.on(input, 'keydown', (e) => {
    const k = e.key;
    let t = null;
    const cur = animTarget ?? (blend ? blend.b : state.z);
    if (k === 'ArrowRight' || k === 'ArrowUp' || k === 'PageUp') t = Math.floor(cur + 1e-6) + 1;
    else if (k === 'ArrowLeft' || k === 'ArrowDown' || k === 'PageDown') t = Math.ceil(cur - 1e-6) - 1;
    else if (k === 'Home') t = 0;
    else if (k === 'End') t = LAST;
    if (t == null) return;
    e.preventDefault();
    userInput();
    goTo(clamp(t, 0, LAST));
  });

  // horizontal drag on the stage (vertical swipes still scroll the page)
  let drag = null;
  ctx.on(ctx.stage, 'pointerdown', (e) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    drag = { id: e.pointerId, x: e.clientX, y: e.clientY, z0: state.z, on: false };
  });
  ctx.on(ctx.stage, 'pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.on) {
      if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(dy) * 1.2) { if (Math.abs(dy) > 12) drag = null; return; }
      drag.on = true;
      userInput(); kill();
      drag.z0 = blend ? blend.b : state.z;
      drag.x = e.clientX;
      ctx.stage.classList.add('is-dragging');
      try { ctx.stage.setPointerCapture(e.pointerId); } catch { /* ignore */ }
      return;
    }
    const w = ctx.stage.clientWidth || 1;
    const z = clamp(drag.z0 + ((e.clientX - drag.x) / w) * 2.4, 0, LAST);
    if (rm()) { const t = Math.round(z); if (t !== Math.round(blend ? blend.b : state.z)) rmJump(t); return; }
    state.z = z;
    render();
  });
  const endDrag = (e) => {
    if (!drag || (e && e.pointerId !== drag.id)) return;
    const was = drag.on;
    drag = null;
    ctx.stage.classList.remove('is-dragging');
    if (was && !rm()) settleTo(Math.round(state.z));
  };
  ctx.on(ctx.stage, 'pointerup', endDrag);
  ctx.on(ctx.stage, 'pointercancel', endDrag);
  ctx.on(ctx.stage, 'lostpointercapture', endDrag);

  // reduced motion switched at runtime: stop the tour and land on a stop
  const syncRM = () => {
    tourBtn.el.hidden = rm();
    input.step = rm() ? '1' : 'any';
    if (rm()) { if (touring) stopTour(false); kill(); blend = null; state.z = Math.round(state.z); restoreOrder(); render(); }
  };
  const offRM = onReducedMotionChange(() => requestAnimationFrame(syncRM));

  // ------------------------------------------------------------ resize
  ctx.onResize(({ compact }) => {
    const want = compact ? 'compact' : 'wide';
    if (want !== lay) {
      lay = want;
      applyLayout();
      svg.setAttribute('viewBox', `0 0 ${VW} ${VH}`);
      for (const s of scenes) s.tr = null;
      lastBar = '';
      for (const L of labels) if (L.w) L.w = {};
      labelText();
      ctx.refreshTextScale();
    }
    syncTicks();
    render();
  });

  syncTicks();
  syncRM();
  render();
  document.fonts?.ready.then(() => { for (const L of labels) L.w = {}; render(); });

  // QA hook (tools/shot.mjs --eval): fig._s1.jump(3.5)
  fig._s1 = { jump: (z) => { kill(); blend = null; state.z = clamp(z, 0, LAST); restoreOrder(); render(); }, goTo, get z() { return state.z; } };

  return {
    pause() { if (anim) anim.pause(); },
    resume() { if (anim) anim.resume(); },
    destroy() { kill(); clearTimeout(settleTimer); offRM?.(); delete fig._s1; },
  };
}
