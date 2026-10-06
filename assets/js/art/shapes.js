// Self & Other — illustration library
// shapes.js: deterministic (seeded) organic geometry.
//
// Everything here is pure math → point arrays and path strings. No DOM.
// Same seed + same options ⇒ same shape, always.

import { TAU, n, clamp, lerp } from './svg.js';

// ---------------------------------------------------------------- seeded random

/** Hash a number or string seed (+ optional salt) into a 32-bit int. */
export function hashSeed(seed, salt = '') {
  const s = `${seed}::${salt}`;
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Seeded PRNG (mulberry32) with helpers.
 * const R = rng(7); R() ∈ [0,1); R.range(2, 5); R.int(1, 6); R.pick([...]); R.fork('nucleus')
 * fork(salt) gives an independent stream so that adding a feature never shifts others.
 */
export function rng(seed = 1, salt = '') {
  let a = hashSeed(seed, salt) || 0x9e3779b9;
  const next = () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const R = () => next();
  R.next = next;
  R.range = (lo, hi) => lo + (hi - lo) * next();
  R.int = (lo, hi) => Math.floor(lo + (hi - lo + 1) * next());
  R.pick = (arr) => arr[Math.floor(next() * arr.length)];
  R.sign = () => (next() < 0.5 ? -1 : 1);
  R.chance = (p) => next() < p;
  R.gauss = () => {
    const u = 1 - next(), v = next();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v);
  };
  R.fork = (s) => rng(seed, `${salt}/${s}`);
  R.seed = seed;
  return R;
}

// ---------------------------------------------------------------- angles

export function wrapAngle(a) {
  a %= TAU;
  return a < 0 ? a + TAU : a;
}
/** Signed smallest difference a - b in (-π, π]. */
export function angleDiff(a, b) {
  let d = (a - b) % TAU;
  if (d > Math.PI) d -= TAU;
  if (d <= -Math.PI) d += TAU;
  return d;
}

// ---------------------------------------------------------------- periodic noise

/**
 * A smooth periodic function of angle: sum of sinusoidal harmonics with random phases.
 * Returns f(theta, t) ≈ in [-amp, amp]. `t` (seconds) slowly drifts phases for breathing.
 */
export function ringNoise(R, { kMin = 2, kMax = 6, amp = 0.08, falloff = 0.8, drift = 0.5 } = {}) {
  const terms = [];
  let norm = 0;
  for (let k = kMin; k <= kMax; k++) {
    const a = R.range(0.5, 1) / Math.pow(k - kMin + 1, falloff);
    norm += a;
    terms.push({ k, a, p: R.range(0, TAU), w: R.range(-drift, drift) * (1 + 0.3 * (k - kMin)) });
  }
  for (const q of terms) q.a *= amp / (norm || 1) * 1.6;
  return (theta, t = 0) => {
    let s = 0;
    for (const q of terms) s += q.a * Math.sin(q.k * theta + q.p + q.w * t);
    return s;
  };
}

/** Gaussian bump profile in angle. */
export function bump(theta, { angle, amp, width }) {
  const d = angleDiff(theta, angle) / width;
  return amp * Math.exp(-d * d);
}

/** Elliptic squash factor for radius at theta (s>0 elongates along `angle`). */
export function squashFactor(theta, s, angle = 0) {
  if (!s) return 1;
  const a = 1 + s, b = 1 / (1 + s);
  const c = Math.cos(theta - angle) / a, d = Math.sin(theta - angle) / b;
  return 1 / Math.sqrt(c * c + d * d);
}

/**
 * Build a radius function r(theta, t, extra) for an organic blob.
 * opts: r, seed, irregularity (0..1), ruffle (0..1), ruffleK, bumps:[{angle,amp,width}],
 *       squash, squashAngle, drift
 * `extra.bumps` (dynamic) are added at call time — used by crawl/apoptosis animations.
 */
export function blobRadius({
  r = 40, seed = 1, irregularity = 0.3, ruffle = 0, ruffleK = 18, bumps = [],
  squash = 0, squashAngle = 0, drift = 0.5, kMax = 6, blebs = [],
} = {}) {
  const R = rng(seed, 'blob');
  const low = ringNoise(R.fork('low'), { kMin: 2, kMax, amp: 0.12 * irregularity, falloff: 0.9, drift });
  const high = ruffle
    ? ringNoise(R.fork('high'), { kMin: ruffleK, kMax: ruffleK + 10, amp: 0.05 * ruffle, falloff: 0.2, drift: drift * 3 })
    : null;
  return (theta, t = 0, extra) => {
    let f = 1 + low(theta, t);
    if (high) f += high(theta, t);
    for (const b of bumps) f += bump(theta, b);
    if (extra && extra.bumps) for (const b of extra.bumps) f += bump(theta, b);
    let rr = r * f * squashFactor(theta, squash, squashAngle);
    const bl = extra && extra.blebs ? blebs.concat(extra.blebs) : blebs;
    for (const b of bl) {
      // union with a round bleb: circle of radius b.radius*r centred at b.dist*r along b.angle
      const D = b.dist * r, rad = b.radius * r;
      const dA = angleDiff(theta, b.angle);
      const s = D * Math.sin(dA);
      if (Math.abs(s) <= rad && Math.cos(dA) > 0) rr = Math.max(rr, D * Math.cos(dA) + Math.sqrt(rad * rad - s * s));
    }
    if (extra && extra.scale) rr *= extra.scale;
    return Math.max(r * 0.15, rr);
  };
}

/** Sample a radius function into points. */
export function polarPoints(radiusFn, count = 48, t = 0, extra) {
  const pts = new Array(count);
  for (let i = 0; i < count; i++) {
    const a = (i / count) * TAU;
    const rr = radiusFn(a, t, extra);
    pts[i] = [rr * Math.cos(a), rr * Math.sin(a)];
  }
  return pts;
}

// ---------------------------------------------------------------- smooth curves

/**
 * Smooth closed (or open) curve through points as cubic Béziers.
 * Tangent at each point is parallel to (next - prev); handle length is `smooth` × the
 * distance to the neighbour, which never overshoots even with uneven spacing.
 */
export function smoothPath(pts, { closed = true, smooth = 0.34 } = {}) {
  const N = pts.length;
  if (N < 2) return '';
  if (N === 2) return `M${n(pts[0][0])} ${n(pts[0][1])}L${n(pts[1][0])} ${n(pts[1][1])}`;
  const tan = new Array(N);
  for (let i = 0; i < N; i++) {
    const p0 = pts[closed ? (i - 1 + N) % N : Math.max(0, i - 1)];
    const p2 = pts[closed ? (i + 1) % N : Math.min(N - 1, i + 1)];
    let tx = p2[0] - p0[0], ty = p2[1] - p0[1];
    const l = Math.hypot(tx, ty) || 1;
    tan[i] = [tx / l, ty / l];
  }
  let d = `M${n(pts[0][0])} ${n(pts[0][1])}`;
  const segs = closed ? N : N - 1;
  for (let i = 0; i < segs; i++) {
    const a = pts[i], b = pts[(i + 1) % N];
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]) * smooth;
    const ta = tan[i], tb = tan[(i + 1) % N];
    d += `C${n(a[0] + ta[0] * L)} ${n(a[1] + ta[1] * L)} ${n(b[0] - tb[0] * L)} ${n(b[1] - tb[1] * L)} ${n(b[0])} ${n(b[1])}`;
  }
  return closed ? d + 'Z' : d;
}

/** Straight polyline path. */
export function polyPath(pts, closed = true) {
  let d = '';
  pts.forEach((p, i) => (d += (i ? 'L' : 'M') + n(p[0]) + ' ' + n(p[1])));
  return closed ? d + 'Z' : d;
}

/**
 * Rounded polygon: straight-ish sides with soft corners (quadratic corner fillets).
 * `round` 0..0.5 = fraction of each side used for the corner.
 */
export function roundedPolygonPath(verts, round = 0.3) {
  const N = verts.length;
  let d = '';
  for (let i = 0; i < N; i++) {
    const p0 = verts[(i - 1 + N) % N], p1 = verts[i], p2 = verts[(i + 1) % N];
    const a = [lerp(p1[0], p0[0], round), lerp(p1[1], p0[1], round)];
    const b = [lerp(p1[0], p2[0], round), lerp(p1[1], p2[1], round)];
    d += (i ? 'L' : 'M') + n(a[0]) + ' ' + n(a[1]);
    d += `Q${n(p1[0])} ${n(p1[1])} ${n(b[0])} ${n(b[1])}`;
  }
  return d + 'Z';
}

/** Dense samples of a rounded polygon (for placing receptors along it). */
export function roundedPolygonPoints(verts, round = 0.3, per = 6) {
  const N = verts.length;
  const out = [];
  for (let i = 0; i < N; i++) {
    const p0 = verts[(i - 1 + N) % N], p1 = verts[i], p2 = verts[(i + 1) % N];
    const a = [lerp(p1[0], p0[0], round), lerp(p1[1], p0[1], round)];
    const b = [lerp(p1[0], p2[0], round), lerp(p1[1], p2[1], round)];
    for (let k = 0; k <= per; k++) {
      const t = k / per, u = 1 - t;
      out.push([u * u * a[0] + 2 * u * t * p1[0] + t * t * b[0], u * u * a[1] + 2 * u * t * p1[1] + t * t * b[1]]);
    }
    const c = [lerp(p1[0], p2[0], 1 - round), lerp(p1[1], p2[1], 1 - round)];
    for (let k = 1; k < per; k++) {
      const t = k / per;
      out.push([lerp(b[0], c[0], t), lerp(b[1], c[1], t)]);
    }
  }
  return out;
}

// ---------------------------------------------------------------- body + arms outlines

/**
 * Outline of a cell body with arms (dendrites, pseudopods, spindle ends, uropods).
 * bodyR(theta, t) gives the body radius. Each arm:
 *   { angle, length, base, tip, bend, wave, ruffle, branches:[{at, side:±1, angle, length, base, tip, bend}] }
 *   base/tip = half-widths in px; bend = total turn (rad) along the arm; side -1/+1.
 * Returns a closed point list in traversal order (feed to smoothPath).
 */
export function armOutline(bodyR, arms, { t = 0, step = 4, waveT = null } = {}) {
  const wt = waveT == null ? t : waveT;
  const pts = [];
  const sorted = arms
    .map((a) => ({ ...a, angle: wrapAngle(a.angle) }))
    .sort((a, b) => a.angle - b.angle);
  if (!sorted.length) {
    const rr = bodyR(0, t);
    const count = clamp(Math.round((TAU * rr) / step), 24, 160);
    return polarPoints(bodyR, count, t);
  }
  // angular half-width of each arm base
  for (const a of sorted) {
    const rho = bodyR(a.angle, t);
    a._rho = rho;
    a._w = Math.asin(clamp((a.base * 1.15) / rho, 0.05, 0.95));
  }
  const K = sorted.length;
  for (let i = 0; i < K; i++) {
    const a = sorted[i];
    const prev = sorted[(i - 1 + K) % K];
    let from = prev.angle + prev._w;
    let to = a.angle - a._w;
    if (K === 1) from = a.angle + a._w - TAU;
    else if (i === 0) from -= TAU;
    // body samples between arms
    const span = to - from;
    if (span > 0) {
      const rr = bodyR((from + to) / 2, t);
      const cnt = Math.max(1, Math.round((span * rr) / step));
      for (let k = 0; k <= cnt; k++) {
        const th = from + (span * k) / cnt;
        const r0 = bodyR(th, t);
        pts.push([r0 * Math.cos(th), r0 * Math.sin(th)]);
      }
    }
    // the arm itself
    const c0 = [Math.cos(a.angle) * a._rho * 0.9, Math.sin(a.angle) * a._rho * 0.9];
    emitArm(pts, c0, a.angle, a, wt, step);
  }
  return pts;
}

function emitArm(out, c0, phi0, spec, t, step) {
  const L = spec.length;
  const steps = clamp(Math.round(L / (step * 1.2)), 4, 18);
  const wave = spec.wave || 0;
  const bend = (spec.bend || 0) + wave * Math.sin(t * (spec.waveSpeed || 0.8) + (spec.wavePhase || 0));
  const C = [], PH = [], HW = [];
  let x = c0[0], y = c0[1];
  for (let k = 0; k <= steps; k++) {
    const s = k / steps;
    const phi = phi0 + bend * Math.pow(s, 1.4) + (spec.curl || 0) * Math.sin(s * TAU * 0.9 + (spec.curlPhase || 0) + t * (spec.waveSpeed || 0.8) * 0.6) * s;
    if (k > 0) {
      const ds = L / steps;
      x += Math.cos(phi) * ds;
      y += Math.sin(phi) * ds;
    }
    C.push([x, y]);
    PH.push(phi);
    const profile = Math.pow(1 - s, spec.taper || 2.2);
    let hw = spec.tip + (spec.base - spec.tip) * profile;
    if (spec.ruffle) hw *= 1 + spec.ruffle * Math.sin(k * 2.7 + (spec.rufflePhase || 0) + t * 1.3);
    HW.push(hw);
  }
  const branches = (spec.branches || []).map((b) => ({ ...b, k: clamp(Math.round(b.at * steps), 1, steps - 1) }));
  const perp = (phi) => [-Math.sin(phi), Math.cos(phi)];
  // edge A (−perp side), travelling outward
  for (let k = 1; k <= steps; k++) {
    const p = perp(PH[k]);
    const br = branches.find((b) => b.k === k && b.side < 0);
    if (br && k < steps) {
      const bc = [C[k][0] - p[0] * HW[k] * 0.3, C[k][1] - p[1] * HW[k] * 0.3];
      emitArm(out, bc, PH[k] - (br.angle || 0.7), br, t, step);
    } else {
      out.push([C[k][0] - p[0] * HW[k], C[k][1] - p[1] * HW[k]]);
    }
  }
  // rounded tip cap
  const tipC = C[steps], tipPhi = PH[steps], tipHW = HW[steps];
  for (let j = 1; j < 4; j++) {
    const beta = -Math.PI / 2 + (Math.PI * j) / 4;
    out.push([tipC[0] + Math.cos(tipPhi + beta) * tipHW, tipC[1] + Math.sin(tipPhi + beta) * tipHW]);
  }
  // edge B (+perp side), travelling inward
  for (let k = steps; k >= 1; k--) {
    const p = perp(PH[k]);
    const br = branches.find((b) => b.k === k && b.side > 0);
    if (br && k < steps) {
      const bc = [C[k][0] + p[0] * HW[k] * 0.3, C[k][1] + p[1] * HW[k] * 0.3];
      emitArm(out, bc, PH[k] + (br.angle || 0.7), br, t, step);
    } else {
      out.push([C[k][0] + p[0] * HW[k], C[k][1] + p[1] * HW[k]]);
    }
  }
}

// ---------------------------------------------------------------- outline geometry helpers

/** Signed area (positive = clockwise on screen, since SVG y points down). */
export function signedArea(pts) {
  let a = 0;
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i], q = pts[(i + 1) % pts.length];
    a += p[0] * q[1] - q[0] * p[1];
  }
  return a / 2;
}

/** Max distance from origin (the cell's visual extent). */
export function extentOf(pts) {
  let m = 0;
  for (const p of pts) m = Math.max(m, Math.hypot(p[0], p[1]));
  return m;
}

/**
 * Resample a closed polyline at `count` evenly spaced arc-length positions.
 * Returns [{x, y, nx, ny, angle}] with outward unit normals (angle = normal direction).
 * Optional arc filter: only the parts of the outline whose polar angle is within
 * [a0, a1] (radians, clockwise on screen from +x) are used.
 */
export function samplePerimeter(pts, count, { a0 = null, a1 = null, offset = 0.5 } = {}) {
  const N = pts.length;
  if (!N || count <= 0) return [];
  const cw = signedArea(pts) > 0; // increasing-angle traversal (clockwise on screen)
  const full = a0 == null || Math.abs(a1 - a0) >= TAU - 1e-6;
  const s0 = full ? 0 : wrapAngle(a0), e0 = full ? 0 : wrapAngle(a1);
  const inArc = (x, y) => {
    if (full) return true;
    const a = wrapAngle(Math.atan2(y, x));
    return s0 <= e0 ? a >= s0 && a <= e0 : a >= s0 || a <= e0;
  };
  const segs = [];
  for (let i = 0; i < N; i++) {
    const p = pts[i], q = pts[(i + 1) % N];
    segs.push({ p, q, len: Math.hypot(q[0] - p[0], q[1] - p[1]), use: inArc((p[0] + q[0]) / 2, (p[1] + q[1]) / 2) });
  }
  // start at the beginning of a used run so arcs come out contiguous and ordered
  let startIdx = 0;
  if (!full) {
    const f = segs.findIndex((s, i) => s.use && !segs[(i - 1 + N) % N].use);
    startIdx = f < 0 ? 0 : f;
  }
  const used = [];
  let total = 0;
  for (let k = 0; k < N; k++) {
    const s = segs[(startIdx + k) % N];
    if (!s.use) continue;
    s.start = total;
    total += s.len;
    used.push(s);
  }
  if (total <= 0) return [];
  const out = [];
  let si = 0;
  for (let i = 0; i < count; i++) {
    const target = ((i + offset) * total) / count;
    while (si < used.length - 1 && used[si].start + used[si].len < target) si++;
    const s = used[si];
    const t = clamp((target - s.start) / (s.len || 1), 0, 1);
    const x = lerp(s.p[0], s.q[0], t), y = lerp(s.p[1], s.q[1], t);
    // smooth the tangent using the neighbouring segments
    let tx = s.q[0] - s.p[0], ty = s.q[1] - s.p[1];
    const l = Math.hypot(tx, ty) || 1;
    tx /= l; ty /= l;
    const nx = cw ? ty : -ty, ny = cw ? -tx : tx;
    out.push({ x, y, nx, ny, angle: Math.atan2(ny, nx) });
  }
  return out;
}

/** Point on outline in the direction `theta` (ray from origin; farthest hit for star shapes). */
export function rayHit(pts, theta) {
  const dx = Math.cos(theta), dy = Math.sin(theta);
  let best = null;
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i], q = pts[(i + 1) % pts.length];
    const ex = q[0] - p[0], ey = q[1] - p[1];
    const den = dx * ey - dy * ex;
    if (Math.abs(den) < 1e-9) continue;
    const tt = (p[0] * ey - p[1] * ex) / den;
    const u = (p[0] * dy - p[1] * dx) / den;
    if (tt > 0 && u >= 0 && u <= 1) {
      if (!best || tt < best.t) best = { t: tt, x: dx * tt, y: dy * tt, ex, ey };
    }
  }
  if (!best) return { x: dx, y: dy, nx: dx, ny: dy, angle: theta };
  const l = Math.hypot(best.ex, best.ey) || 1;
  let nx = best.ey / l, ny = -best.ex / l;
  if (nx * dx + ny * dy < 0) { nx = -nx; ny = -ny; }
  return { x: best.x, y: best.y, nx, ny, angle: Math.atan2(ny, nx) };
}

/** Is point inside polygon (even-odd)? */
export function inside(pts, x, y) {
  let c = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const a = pts[i], b = pts[j];
    if (a[1] > y !== b[1] > y && x < ((b[0] - a[0]) * (y - a[1])) / (b[1] - a[1] + 1e-12) + a[0]) c = !c;
  }
  return c;
}

// ---------------------------------------------------------------- scatter / packing

/**
 * Scatter `count` dots of radius `size` in a disc (cx, cy, radius), avoiding `avoid`
 * discs [{x,y,r}] and each other (best-effort Poisson). Returns [{x,y,r}].
 */
export function scatterInDisc(R, { count, cx = 0, cy = 0, radius, size = 2, sizeJitter = 0.3, avoid = [], gap = 0.6, bias = null, tries = 30 }) {
  const out = [];
  for (let i = 0; i < count; i++) {
    for (let k = 0; k < tries; k++) {
      let a = R.range(0, TAU);
      if (bias) a = bias.angle + R.gauss() * (bias.spread || 0.7);
      const rr = Math.sqrt(R()) * radius;
      const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr;
      const s = size * (1 + R.range(-sizeJitter, sizeJitter));
      if (Math.hypot(x - cx, y - cy) + s > radius) continue;
      let ok = true;
      for (const o of avoid) if (Math.hypot(x - o.x, y - o.y) < o.r + s + gap) { ok = false; break; }
      if (ok) for (const o of out) if (Math.hypot(x - o.x, y - o.y) < o.r + s + gap) { ok = false; break; }
      if (ok) { out.push({ x, y, r: s }); break; }
    }
  }
  return out;
}

/**
 * Compact "folded" bead path: consecutive beads on a hexagonal-lattice spiral so that
 * neighbours stay one spacing apart. Used by peptideChain({ fold }).
 */
export function foldedPositions(count, spacing, seed = 1) {
  const R = rng(seed, 'fold');
  // generate a self-avoiding random walk on a hex lattice biased toward the centre
  const dirs = [[1, 0], [0.5, 0.866], [-0.5, 0.866], [-1, 0], [-0.5, -0.866], [0.5, -0.866]];
  const key = (x, y) => `${Math.round(x * 100)},${Math.round(y * 100)}`;
  for (let attempt = 0; attempt < 40; attempt++) {
    const seen = new Set([key(0, 0)]);
    const pos = [[0, 0]];
    let ok = true;
    for (let i = 1; i < count; i++) {
      const [x, y] = pos[i - 1];
      const cand = dirs
        .map(([dx, dy]) => [x + dx, y + dy])
        .filter(([a, b]) => !seen.has(key(a, b)))
        .map((p) => ({ p, s: Math.hypot(p[0], p[1]) + R.range(0, 1.4) }))
        .sort((a, b) => a.s - b.s);
      if (!cand.length) { ok = false; break; }
      const p = cand[0].p;
      seen.add(key(p[0], p[1]));
      pos.push(p);
    }
    if (ok) {
      let cx = 0, cy = 0;
      for (const p of pos) { cx += p[0]; cy += p[1]; }
      cx /= count; cy /= count;
      return pos.map(([x, y]) => [(x - cx) * spacing, (y - cy) * spacing]);
    }
  }
  return Array.from({ length: count }, (_, i) => [(i - count / 2) * spacing, 0]);
}

/**
 * Organic band (e.g. a horseshoe/ring nucleus): an arc of `radius` from angle a0 spanning
 * `span`, with varying width. Returns a closed point list.
 */
export function bandPoints(R, { cx = 0, cy = 0, radius, a0 = 0, span = 4.5, width, steps = 18, pinch = 0 }) {
  const ws = [];
  const pAt = R.range(0.35, 0.65);
  for (let i = 0; i <= steps; i++) {
    const s = i / steps;
    const pin = pinch ? 1 - pinch * Math.exp(-Math.pow((s - pAt) / 0.07, 2)) : 1;
    ws.push(width * (0.8 + 0.3 * Math.sin(Math.PI * s) + R.range(-0.1, 0.1)) * pin);
  }
  const outer = [], inner = [];
  for (let i = 0; i <= steps; i++) {
    const a = a0 + (span * i) / steps;
    const rr = radius * (1 + R.range(-0.05, 0.05));
    outer.push([cx + Math.cos(a) * (rr + ws[i] / 2), cy + Math.sin(a) * (rr + ws[i] / 2)]);
    inner.push([cx + Math.cos(a) * (rr - ws[i] / 2), cy + Math.sin(a) * (rr - ws[i] / 2)]);
  }
  // semicircular end caps: forward cap at the end, backward cap at the start
  const cap = (a, w, dir, fromOuter) => {
    const out = [];
    const ex = cx + Math.cos(a) * radius, ey = cy + Math.sin(a) * radius;
    const nx = Math.cos(a), ny = Math.sin(a);
    const tx = -ny * dir, ty = nx * dir;
    for (let k = 1; k < 5; k++) {
      const th = fromOuter ? (k / 5) * Math.PI : Math.PI - (k / 5) * Math.PI;
      out.push([ex + (nx * Math.cos(th) + tx * Math.sin(th)) * (w / 2), ey + (ny * Math.cos(th) + ty * Math.sin(th)) * (w / 2)]);
    }
    return out;
  };
  return [...outer, ...cap(a0 + span, ws[steps], 1, true), ...inner.reverse(), ...cap(a0, ws[0], -1, false)];
}

/**
 * Membrane folds / ruffles: short open curves just inside an outline (one path string).
 * pts: closed outline; count: number of folds; depth: px inward; len: points per fold.
 * filter(s) can restrict where folds appear (s = {x,y,nx,ny}).
 */
export function edgeFolds(R, pts, { count = 8, depth = 3, len = 6, filter = null, dense = 120 } = {}) {
  const spots = samplePerimeter(pts, dense);
  let d = '';
  let made = 0;
  for (let tries = 0; tries < count * 4 && made < count; tries++) {
    const i0 = R.int(0, dense - 1);
    if (filter && !filter(spots[i0])) continue;
    const L = R.int(Math.max(3, len - 2), len + 2);
    const dep = depth * R.range(0.6, 1.3);
    const seg = [];
    for (let k = 0; k < L; k++) {
      const s = spots[(i0 + k) % dense];
      const taper = Math.sin((Math.PI * (k + 0.5)) / L);
      seg.push([s.x - s.nx * dep * (0.55 + 0.45 * taper), s.y - s.ny * dep * (0.55 + 0.45 * taper)]);
    }
    d += smoothPath(seg, { closed: false, smooth: 0.3 });
    made++;
  }
  return d;
}
