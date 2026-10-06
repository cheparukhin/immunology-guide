// shared/cell-actions.js — the cell kit (platform task P4). API: docs/shared/cell-actions.md
//
// Stepper-safe timeline builders for the site's cell grammar (FIGURE-AUDIT §4 rules 5–13):
// approach · probe · dock · recognize · polarize · kill · detach · die · clearUp · swap ·
// divide · dockAntibody · emit · pulseAlong, plus free-running twins under `run.*`.
//
// How it stays seekable: every builder reads the PLANNED state of its rigs (what the scene
// looks like at the end of everything appended so far), computes explicit from → to values,
// and renders through `drive()`: a tween of a 0..1 proxy whose setter calls a pure
// render(p). Nothing depends on wall-clock time or on what happened to play before, so Back,
// dot jumps, rebuilds and reduced motion land on identical frames.
import { gsap } from '../../../vendor/gsap/index.js';
import * as ART from '../../art/index.js';

const { el, cellInfo, signalIcon, granzyme, rayHit, resolve, mix, PALETTE } = ART;

const DEG = Math.PI / 180;
const TAU = Math.PI * 2;
const WHITE = '#FFFFFF';
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const clamp01 = (v) => clamp(v, 0, 1);
const lerp = (a, b, t) => a + (b - a) * t;
const f = (v) => String(Math.round(v * 100) / 100);
const seg = (p, a, b) => clamp01((p - a) / (b - a || 1));
const angDelta = (a, b) => ((((b - a) % 360) + 540) % 360) - 180;
const E = {
  inOut: gsap.parseEase('so.inOut') || gsap.parseEase('power2.inOut'),
  out: gsap.parseEase('so.out') || gsap.parseEase('power2.out'),
  in: gsap.parseEase('so.in') || gsap.parseEase('power2.in'),
  sine: gsap.parseEase('sine.inOut'),
  back: gsap.parseEase('back.out(1.7)'),
};
const easeOf = (e) => (typeof e === 'function' ? e : gsap.parseEase(e || 'so.inOut') || E.inOut);
const reducedMotion = () => (ART.prefersReducedMotion ? ART.prefersReducedMotion() : matchMedia('(prefers-reduced-motion: reduce)').matches);

/** Small seeded PRNG (mulberry32). */
function prng(seed = 1) {
  let s = (typeof seed === 'number' ? seed : [...String(seed)].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 16777619), 2166136261)) >>> 0;
  const r = () => {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  r.range = (a, b) => a + (b - a) * r();
  return r;
}

// ------------------------------------------------------------------ driving

/**
 * Tween a pure render(p), p: 0 → 1, on `tl`. The proxy's setter calls render on EVERY render
 * of the tween (including suppressed-event seeks), which is what makes it seek-safe.
 */
export function drive(tl, render, { duration = 1, ease = 'none', pos } = {}) {
  let v = 0;
  const proxy = {};
  Object.defineProperty(proxy, 'p', { get: () => v, set: (x) => { v = x; render(x); }, enumerable: true });
  tl.fromTo(proxy, { p: 0 }, { p: 1, duration: Math.max(0.001, duration), ease, immediateRender: false }, pos);
  return proxy;
}

/** Build into a fresh sub-timeline placed at `pos` on `tl`; returns { start, end, sub }. */
function build(tl, pos, fn) {
  const sub = gsap.timeline();
  const extra = fn(sub) || {};
  tl.add(sub, pos);
  const start = sub.startTime();
  return { ...extra, start, end: start + sub.duration(), sub };
}

// ------------------------------------------------------------------ rigs

const RIGS = new WeakMap();      // rig.el → rig
const IDENTITY = [1, 0, 1];      // symmetric deformation matrix [a, b, d] = [[a b] [b d]]

/** Deformation that scales by sx along `deg` and sy across it. */
function squashM(deg, sx, sy) {
  const c = Math.cos(deg * DEG), s = Math.sin(deg * DEG);
  return [sx * c * c + sy * s * s, (sx - sy) * c * s, sx * s * s + sy * c * c];
}
const addM = (A, B, k = 1) => [A[0] + (B[0] - IDENTITY[0]) * k, A[1] + B[1] * k, A[2] + (B[2] - IDENTITY[2]) * k];
const lerpM = (A, B, t) => [lerp(A[0], B[0], t), lerp(A[1], B[1], t), lerp(A[2], B[2], t)];

function poseOf(plan) { return { x: plan.x, y: plan.y, m: plan.m.slice(), s: plan.s, o: plan.o }; }
function lerpPose(A, B, t) {
  return { x: lerp(A.x, B.x, t), y: lerp(A.y, B.y, t), m: lerpM(A.m, B.m, t), s: lerp(A.s, B.s, t), o: lerp(A.o, B.o, t) };
}
function applyPose(R, P) {
  R.el.setAttribute('transform', `translate(${f(P.x)} ${f(P.y)})`);
  R.el.setAttribute('opacity', f(clamp01(P.o)));
  const s = P.s;
  R.layers.body.setAttribute('transform', `matrix(${f(P.m[0] * s)} ${f(P.m[1] * s)} ${f(P.m[1] * s)} ${f(P.m[2] * s)} 0 0)`);
}
function setPlan(R, P) { Object.assign(R.plan, { x: P.x, y: P.y, m: P.m.slice(), s: P.s, o: P.o }); }

/**
 * Hold a library cell in a rig so actions can move, flatten and fade it.
 * rig(art, { x, y, parent, tcrKey, seed, opacity }) → Rig
 */
export function rig(art, { x = 0, y = 0, parent = null, tcrKey, seed = 1, opacity = 1, name } = {}) {
  const info = cellInfo(art) || {};
  const g = el('g', { 'data-rig': name || info.kind || 'cell' });
  const under = el('g', { 'data-rig-layer': 'under' });
  const body = el('g', { 'data-rig-layer': 'body' });
  const idle = el('g', { 'data-rig-layer': 'idle' });
  const inner = el('g', { 'data-rig-layer': 'inner' });
  const over = el('g', { 'data-rig-layer': 'over' });
  idle.appendChild(art);
  body.append(idle, inner);
  g.append(under, body, over);
  const R = {
    el: g, art, info,
    r: info.rEff || info.bodyR || info.r || 30,
    color: resolve(info.color || '#C9D3E8'),
    stage: info.stage || 'dark',
    kind: info.kind || 'cell',
    seed,
    tcrKey: tcrKey ?? art.getAttribute('data-key') ?? null,
    layers: { under, body, idle, inner, over },
    plan: { x, y, m: IDENTITY.slice(), s: 1, o: opacity, contact: null, docked: null, polarized: null, dying: 0, mtoc: null, granules: null },
    mtoc: null,
  };
  applyPose(R, R.plan);
  if (parent) parent.appendChild(g);
  RIGS.set(g, R);
  return R;
}

/** Immediate placement (setup / reset only). */
export function place(R, { x = R.plan.x, y = R.plan.y, opacity = R.plan.o } = {}) {
  Object.assign(R.plan, { x, y, o: opacity });
  applyPose(R, R.plan);
  return R;
}

/** The effects layer of a parent (created at its end on first use). */
export function fxLayer(parent) {
  let g = parent.querySelector(':scope > g[data-fx]');
  if (!g) { g = el('g', { 'data-fx': '' }); parent.appendChild(g); }
  return g;
}

const isRig = (o) => !!(o && o.el && o.layers && o.plan);
const rigOf = (node) => { for (let n = node; n; n = n.parentNode) { const R = n.nodeType === 1 && RIGS.get(n); if (R) return R; } return null; };

/** Membrane radius of a rig toward `deg` (its art frame; ignores planned squash). */
function membraneR(R, deg) {
  const pts = R.info && R.info.outline;
  if (!pts) return R.r;
  const h = rayHit(pts, deg * DEG);
  return Math.hypot(h.x, h.y) || R.r;
}

/**
 * Planned contact geometry between a mover `a` and a target `b` (Rig or {x,y}).
 * angle = direction from the target's center toward the mover (deg).
 */
export function contact(a, b, { gap = 0, angle, flatten = 0 } = {}) {
  const A = a.plan, B = isRig(b) ? b.plan : b;
  const ang = angle ?? Math.atan2(A.y - B.y, A.x - B.x) / DEG;
  const rb = isRig(b) ? membraneR(b, ang) : 0;
  const ra = membraneR(a, ang + 180) * (1 - flatten);
  const d = rb + ra + gap;
  const c = Math.cos(ang * DEG), s = Math.sin(ang * DEG);
  return {
    x: B.x + c * d, y: B.y + s * d, angle: ang, face: ang + 180, distance: d,
    cx: B.x + c * (rb + gap / 2), cy: B.y + s * (rb + gap / 2),
  };
}

// ------------------------------------------------------------------ geometry helpers

/** Product of the SVG transforms from `node` up to (not including) `stop`, as a DOMMatrix. */
function chainMatrix(node, stop) {
  let m = new DOMMatrix();
  for (let n = node; n && n !== stop; n = n.parentNode) {
    if (!n.transform || !n.transform.baseVal) continue;
    const list = n.transform.baseVal;
    let mm = new DOMMatrix();
    for (let i = 0; i < list.numberOfItems; i++) {
      const t = list.getItem(i).matrix;
      mm = mm.multiply(new DOMMatrix([t.a, t.b, t.c, t.d, t.e, t.f]));
    }
    m = mm.multiply(m);
  }
  return m;
}
/** Matrix mapping frame `from` coordinates into frame `to` coordinates (rendered DOM). */
function frameMatrix(from, to) {
  if (from === to) return new DOMMatrix();
  try {
    const a = from.getCTM(), b = to.getCTM();
    if (a && b) return DOMMatrix.fromMatrix(b).inverse().multiply(DOMMatrix.fromMatrix(a));
  } catch (e) { /* not rendered */ }
  return new DOMMatrix();
}
const apply = (m, x, y) => ({ x: m.a * x + m.c * y + m.e, y: m.b * x + m.d * y + m.f });

/**
 * Head of a membrane glyph (top of its bbox along its local −y) and its outward direction,
 * in the coordinate frame `frame` — using rig PLANS when the glyph sits on a rigged cell.
 */
function glyphHead(glyph, frame, { lift = 0 } = {}) {
  let top = -16;
  try { top = glyph.getBBox().y; } catch (e) { /* unrendered */ }
  const R = rigOf(glyph);
  let m;
  if (R) {
    const local = chainMatrix(glyph, R.layers.idle);
    const toFrame = frameMatrix(R.el.parentNode, frame);
    m = toFrame.multiply(new DOMMatrix([1, 0, 0, 1, R.plan.x, R.plan.y])).multiply(local);
  } else {
    m = frame.contains(glyph) ? chainMatrix(glyph, frame) : frameMatrix(glyph, frame);
  }
  const p = apply(m, 0, top - lift);
  const o = apply(m, 0, 0);
  const ang = Math.atan2(p.y - o.y, p.x - o.x) / DEG;
  const scale = Math.hypot(m.a, m.b) || 1;
  return { x: p.x, y: p.y, angle: ang, scale, base: o };
}

/** Catmull-Rom path through points, resampled by arc length → (t) => { x, y, heading }. */
function curve(points) {
  const P = points.map(([x, y]) => ({ x, y }));
  if (P.length < 2) P.push({ ...P[0] });
  const samples = [];
  const N = Math.max(2, (P.length - 1) * 24);
  const at = (u) => {
    const k = Math.min(P.length - 2, Math.floor(u * (P.length - 1)));
    const t = u * (P.length - 1) - k;
    const p0 = P[Math.max(0, k - 1)], p1 = P[k], p2 = P[k + 1], p3 = P[Math.min(P.length - 1, k + 2)];
    const t2 = t * t, t3 = t2 * t;
    const c = (a, b, c2, d) => 0.5 * (2 * b + (-a + c2) * t + (2 * a - 5 * b + 4 * c2 - d) * t2 + (-a + 3 * b - 3 * c2 + d) * t3);
    return { x: c(p0.x, p1.x, p2.x, p3.x), y: c(p0.y, p1.y, p2.y, p3.y) };
  };
  let len = 0;
  let prev = at(0);
  samples.push({ ...prev, len: 0 });
  for (let i = 1; i <= N; i++) {
    const q = at(i / N);
    len += Math.hypot(q.x - prev.x, q.y - prev.y);
    samples.push({ ...q, len });
    prev = q;
  }
  const fn = (t) => {
    const target = clamp01(t) * len;
    let i = 1;
    while (i < samples.length - 1 && samples[i].len < target) i++;
    const a = samples[i - 1], b = samples[i];
    const k = (target - a.len) / ((b.len - a.len) || 1);
    return { x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), heading: Math.atan2(b.y - a.y, b.x - a.x) / DEG };
  };
  fn.total = len;
  return fn;
}

// ------------------------------------------------------------------ move / approach / probe

/** Crawl to (x, y), optionally via points; the body stretches gently along the heading. */
export function move(tl, R, { x = R.plan.x, y = R.plan.y, via = [], opacity, duration, ease = 'so.inOut', stretch = 0.04, pos } = {}) {
  return build(tl, pos, (sub) => {
    const A = poseOf(R.plan);
    const B = { ...A, x, y, m: IDENTITY.slice(), o: opacity ?? A.o };
    const path = curve([[A.x, A.y], ...via, [x, y]]);
    const dur = duration ?? clamp(path.total / 120, 0.8, 3);
    const ez = easeOf(ease);
    const still = path.total < 0.5;
    drive(sub, (p) => {
      const q = ez(p);
      const pt = still ? { x: A.x, y: A.y, heading: 0 } : path(q);
      const bump = Math.sin(Math.PI * p);
      let m = lerpM(A.m, B.m, E.inOut(clamp01(p * 1.6)));
      if (stretch && !still) m = addM(m, squashM(pt.heading, 1 + stretch, 1 - stretch * 0.75), bump);
      applyPose(R, { x: pt.x, y: pt.y, m, s: A.s, o: lerp(A.o, B.o, q) });
    }, { duration: dur });
    setPlan(R, B);
    R.plan.docked = null;
    R.plan.contact = null;
    return { duration: dur };
  });
}

/**
 * Move to just short of a target: membranes `gap` apart along `angle` (from the target).
 * A point target `{x, y}` is treated as a zero-radius target: the mover's membrane stops `gap`
 * short of the point (to move ONTO a point, use `move`).
 */
export function approach(tl, mover, target, { gap = 4, angle, via, duration, ease, stretch, pos } = {}) {
  const g = contact(mover, target, { gap, angle });
  const span = move(tl, mover, { x: g.x, y: g.y, via, duration, ease, stretch, pos });
  mover.plan.contact = { x: g.cx, y: g.cy, angle: g.face, with: target };
  return span;
}

function noMatchMark(stage, size) {
  const light = stage === 'light';
  const s = size / 2, k = s * 0.42;
  const g = el('g', { 'data-part': 'no-match' });
  g.appendChild(el('circle', { r: f(s), fill: light ? '#FFFFFF' : '#0B1024', 'fill-opacity': light ? 0.9 : 0.55, stroke: light ? '#6B7280' : '#AEB7C8', 'stroke-width': f(Math.max(1, size * 0.09)) }));
  g.appendChild(el('path', { d: `M${f(-k)} ${f(-k)}L${f(k)} ${f(k)}M${f(k)} ${f(-k)}L${f(-k)} ${f(k)}`, stroke: light ? '#4B5563' : '#C9D3E8', 'stroke-width': f(Math.max(1, size * 0.11)), 'stroke-linecap': 'round' }));
  return g;
}

/** A brief patrol touch (no docking); a tiny gray ✕ "no match" tick when match is false. */
export function probe(tl, killer, cell, { match = false, gap = 1, angle, hold = 0.5, mark = true, duration, via, layer, pos } = {}) {
  return build(tl, pos, (sub) => {
    const a = approach(sub, killer, cell, { gap, angle, via, duration, pos: 0 });
    const g = contact(killer, cell, { gap, angle: killer.plan.contact ? killer.plan.contact.angle - 180 : angle });
    let markEl = null;
    if (mark && !match) {
      const host = layer || fxLayer(killer.el.parentNode);
      const size = clamp(killer.r * 0.34, 11, 16);
      const off = { x: Math.cos((g.angle + 90) * DEG), y: Math.sin((g.angle + 90) * DEG) };
      if (off.y > 0 || (Math.abs(off.y) < 0.2 && off.x < 0)) { off.x = -off.x; off.y = -off.y; }
      const at = { x: g.cx + off.x * size * 0.9, y: g.cy + off.y * size * 0.9 };
      markEl = el('g', { transform: `translate(${f(at.x)} ${f(at.y)})`, opacity: 0 });
      markEl.appendChild(noMatchMark(killer.stage, size));
      host.appendChild(markEl);
      const t0 = a.end - 0.15;
      const life = 0.25 + hold + 0.1;
      drive(sub, (p) => {
        const t = p * life;
        const o = t < 0.25 ? E.out(t / 0.25) : t > life - 0.35 ? 1 - E.in(seg(t, life - 0.35, life)) : 1;
        markEl.setAttribute('opacity', f(o));
      }, { duration: life, pos: t0 });
    }
    sub.to({}, { duration: hold }, a.end);
    return { mark: markEl };
  });
}

// ------------------------------------------------------------------ dock

function sealGraphic(R, face) {
  const r = R.r;
  const Rm = membraneR(R, face);
  const light = R.stage === 'light';
  const g = el('g', { 'data-part': 'seal', transform: `rotate(${f(face)}) translate(${f(Rm)} 0)`, opacity: 0 });
  const outer = el('ellipse', { rx: f(r * 0.07), ry: f(r * 0.66), fill: 'none', stroke: light ? mix(R.color, '#1B1F2A', 0.35) : mix(R.color, WHITE, 0.55), 'stroke-width': f(clamp(r * 0.05, 1.4, 3)), 'stroke-opacity': 0.95 });
  const zone = el('ellipse', { rx: f(r * 0.05), ry: f(r * 0.3), fill: light ? R.color : mix(R.color, WHITE, 0.35), 'fill-opacity': light ? 0.6 : 0.85 });
  const glow = el('ellipse', { rx: f(r * 0.16), ry: f(r * 0.48), fill: ART.dotGlow ? ART.dotGlow(R.color, light ? 0.25 : 0.55) : R.color, opacity: light ? 0.6 : 0.9 });
  g.append(glow, outer, zone);
  return { g, outer, zone, glow, r };
}

/** Close contact: flatten the killer's face against the target; optional synapse seal. */
export function dock(tl, killer, target, { flatten = 0.14, angle, seal = false, duration = 1.1, ease = 'so.inOut', pos } = {}) {
  return build(tl, pos, (sub) => {
    const ang = angle ?? (killer.plan.contact && killer.plan.contact.with === target ? killer.plan.contact.angle - 180 : undefined);
    const g = contact(killer, target, { gap: 0, angle: ang, flatten });
    const A = poseOf(killer.plan);
    const B = { ...A, x: g.x, y: g.y, m: squashM(g.face, 1 - flatten, 1 + flatten * 0.55) };
    const ez = easeOf(ease);
    let sealG = null;
    if (seal) {
      sealG = sealGraphic(killer, g.face);
      killer.layers.inner.appendChild(sealG.g);
    }
    drive(sub, (p) => {
      const q = ez(p);
      applyPose(killer, lerpPose(A, B, q));
      if (sealG) {
        const k = E.out(seg(p, 0.45, 1));
        sealG.g.setAttribute('opacity', f(k));
        sealG.outer.setAttribute('ry', f(sealG.r * 0.66 * (0.25 + 0.75 * k)));
        sealG.zone.setAttribute('ry', f(sealG.r * 0.3 * (0.2 + 0.8 * k)));
      }
    }, { duration });
    setPlan(killer, B);
    killer.plan.docked = target;
    killer.plan.flatten = flatten;
    killer.plan.contact = { x: g.cx, y: g.cy, angle: g.face, with: target };
    killer.plan.seal = sealG;
    return { seal: sealG && sealG.g };
  });
}

// ------------------------------------------------------------------ recognize

function resolvePoint(killer, at, frame) {
  if (at == null) {
    const c = killer.plan.contact;
    if (c) return { x: c.x, y: c.y, axis: c.angle };
    return { x: killer.plan.x, y: killer.plan.y, axis: 0 };
  }
  if (isRig(at)) {
    const g = contact(killer, at, { gap: 0 });
    return { x: g.cx, y: g.cy, axis: g.face };
  }
  if (at.nodeType === 1) {
    const h = glyphHead(at, frame);
    return { x: h.x, y: h.y, axis: h.angle + 180, glyph: true, scale: h.scale };
  }
  return { x: at.x, y: at.y, axis: at.angle ?? 0 };
}

function badgeSide(axis) {
  // perpendicular to the contact axis, preferring "up" (then "right")
  let x = Math.cos((axis + 90) * DEG), y = Math.sin((axis + 90) * DEG);
  if (y > 0.2 || (Math.abs(y) <= 0.2 && x < 0)) { x = -x; y = -y; }
  return { x, y };
}

/**
 * Recognition (rule 5): a slow swelling ring in the T cell's color with a white core, plus a
 * green-cyan "+" disc. A tween, never a flash.
 */
export function recognize(tl, killer, at, { color, radius, duration = 1.8, badge = true, hold = true, badgeOffset, badgeSize, layer, pos } = {}) {
  return build(tl, pos, (sub) => {
    const host = layer || fxLayer(killer.el.parentNode);
    const P = resolvePoint(killer, at, host);
    const c = resolve(color || killer.color);
    const light = killer.stage === 'light';
    const r0 = radius ?? (P.glyph ? clamp(10 * (P.scale || 1), 7, 16) : killer.r * 0.42);
    const g = el('g', { 'data-part': 'recognition', transform: `translate(${f(P.x)} ${f(P.y)})` });
    const halo = el('circle', { r: f(r0 * 1.1), fill: ART.dotGlow ? ART.dotGlow(c, light ? 0.3 : 0.55) : c, opacity: 0 });
    const ring = el('circle', { r: f(r0), fill: 'none', stroke: light ? c : mix(c, WHITE, 0.25), 'stroke-width': f(clamp(r0 * 0.12, 1.4, 3)), 'stroke-opacity': 0 });
    const core = el('circle', { r: f(r0 * 0.3), fill: ART.dotGlow ? ART.dotGlow(WHITE, light ? 0.6 : 0.95) : WHITE, opacity: 0 });
    const dot = el('circle', { r: f(Math.max(1.4, r0 * 0.12)), fill: WHITE, stroke: light ? c : 'none', 'stroke-width': light ? 1 : null, opacity: 0 });
    g.append(halo, ring, core, dot);
    host.appendChild(g);
    let b = null, bi = null;
    if (badge) {
      const size = badgeSize ?? clamp(killer.r * 0.38, 12, 19);
      const side = badgeOffset ? { x: badgeOffset.x, y: badgeOffset.y, abs: true } : badgeSide(P.axis);
      const bx = side.abs ? P.x + side.x : P.x + side.x * (r0 * 1.2 + size * 0.7);
      const by = side.abs ? P.y + side.y : P.y + side.y * (r0 * 1.2 + size * 0.7);
      b = el('g', { 'data-part': 'recognition-badge', transform: `translate(${f(bx)} ${f(by)})`, opacity: 0 });
      bi = el('g', { transform: 'scale(0.01)' });
      bi.appendChild(signalIcon({ type: 'activating', size, stage: killer.stage }));
      b.appendChild(bi);
      host.appendChild(b);
    }
    drive(sub, (p) => {
      const e = E.sine(p);
      const env = Math.pow(Math.sin(Math.PI * Math.min(1, p * 1.12)), 0.9);
      ring.setAttribute('r', f(r0 * (1 + 0.75 * e)));
      ring.setAttribute('stroke-opacity', f(0.9 * env));
      halo.setAttribute('r', f(r0 * (1.1 + 0.6 * e)));
      halo.setAttribute('opacity', f(env));
      const coreO = p < 0.25 ? E.out(p / 0.25) : 1 - E.inOut(seg(p, 0.45, 1));
      core.setAttribute('opacity', f(coreO));
      dot.setAttribute('opacity', f(coreO));
      if (b) {
        const k = seg(p, 0.28, 0.62);
        const fade = hold ? 0 : seg(p, 0.85, 1);
        b.setAttribute('opacity', f(clamp01(k * 2) * (1 - fade)));
        bi.setAttribute('transform', `scale(${f(Math.max(0.01, E.back(k)))})`);
      }
    }, { duration });
    return { ring: g, badge: b };
  });
}

// ------------------------------------------------------------------ granules & centrosome

function granuleEls(R) { return [...R.art.querySelectorAll('[data-part="granule"]')]; }
function readGranules(R) {
  return granuleEls(R).map((c) => ({ x: +c.getAttribute('cx'), y: +c.getAttribute('cy'), r: +c.getAttribute('r'), o: 1 }));
}
function granulePlan(R) {
  if (!R.plan.granules) R.plan.granules = readGranules(R);
  if (!R.restGranules) R.restGranules = readGranules(R);
  return R.plan.granules;
}
function writeGranule(c, g) {
  c.setAttribute('cx', f(g.x));
  c.setAttribute('cy', f(g.y));
  c.setAttribute('r', f(Math.max(0, g.r)));
  c.setAttribute('opacity', f(g.o));
}
/** Polar interpolation around the cell center (granules ride around the nucleus). */
function polarLerp(a, b, t) {
  const ra = Math.hypot(a.x, a.y), rb = Math.hypot(b.x, b.y);
  const pa = Math.atan2(a.y, a.x) / DEG, pb = Math.atan2(b.y, b.x) / DEG;
  const ph = (pa + angDelta(pa, pb) * t) * DEG;
  const rr = lerp(ra, rb, t);
  return { x: Math.cos(ph) * rr, y: Math.sin(ph) * rr, r: lerp(a.r, b.r, t), o: lerp(a.o, b.o, t) };
}

function ensureMtoc(R, angle = 180) {
  if (R.mtoc) return R.mtoc;
  const r = R.r;
  const light = R.stage === 'light';
  const rail = light ? mix(R.color, '#1B1F2A', 0.3) : mix(R.color, WHITE, 0.62);
  const g = el('g', { 'data-part': 'mtoc', transform: `rotate(${f(angle)})` });
  const d = r * 0.6;
  let rails = '';
  for (const k of [-118, -82, -48, -16, 16, 48, 82, 118, 180]) {
    const a = (180 + k) * DEG;
    const len = r * (0.62 + 0.18 * Math.cos(k * 0.9 * DEG));
    const ex = d + Math.cos(a) * len, ey = Math.sin(a) * len;
    const mx = d + Math.cos(a) * len * 0.5 + Math.sin(a) * r * 0.05, my = Math.sin(a) * len * 0.5 - Math.cos(a) * r * 0.05;
    rails += `M${f(d)} 0Q${f(mx)} ${f(my)} ${f(ex)} ${f(ey)}`;
  }
  g.appendChild(el('path', { 'data-part': 'rails', d: rails, fill: 'none', stroke: rail, 'stroke-width': f(clamp(r * 0.018, 0.6, 1.2)), 'stroke-opacity': light ? 0.45 : 0.38, 'stroke-linecap': 'round' }));
  let spokes = '';
  const sl = r * 0.1;
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * TAU + 0.2;
    spokes += `M${f(d + Math.cos(a) * sl * 0.35)} ${f(Math.sin(a) * sl * 0.35)}L${f(d + Math.cos(a) * sl)} ${f(Math.sin(a) * sl)}`;
  }
  // Dark stages: a soft, cell-tinted aster (a bright white core read as a sparkle in NK/ADCC scenes).
  g.appendChild(el('path', { d: spokes, stroke: light ? mix(R.color, '#1B1F2A', 0.45) : mix(R.color, WHITE, 0.6), 'stroke-width': f(clamp(r * 0.024, 0.8, 1.6)), 'stroke-linecap': 'round', 'stroke-opacity': light ? 1 : 0.8 }));
  g.appendChild(el('circle', { cx: f(d), r: f(clamp(r * 0.045, 1.4, 3)), fill: light ? mix(R.color, '#1B1F2A', 0.4) : mix(R.color, WHITE, 0.75), 'fill-opacity': light ? 0.95 : 0.6 }));
  R.layers.inner.appendChild(g);
  R.mtoc = g;
  R.plan.mtoc = angle;
  return g;
}

/** Immediate setup: granules scattered around the cytoplasm, centrosome at `angle` (the rear). */
export function unpolarize(R, { angle = 180, seed } = {}) {
  ensureMtoc(R, angle);
  R.mtoc.setAttribute('transform', `rotate(${f(angle)})`);
  R.plan.mtoc = angle;
  const els = granuleEls(R);
  granulePlan(R);
  const rnd = prng(seed ?? R.seed * 31 + 7);
  const n = els.length;
  const list = els.map((c, i) => {
    const a = (angle + lerp(-125, 125, n > 1 ? i / (n - 1) : 0.5) + rnd.range(-12, 12)) * DEG;
    const rr = membraneR(R, a / DEG) * rnd.range(0.6, 0.76);
    const base = R.restGranules[i] || { r: R.r * 0.06 };
    return { x: Math.cos(a) * rr, y: Math.sin(a) * rr, r: base.r, o: 1 };
  });
  list.forEach((g, i) => writeGranule(els[i], g));
  R.plan.granules = list;
  R.plan.polarized = null;
  return R;
}

function towardAngle(R, toward) {
  if (toward == null) return R.plan.contact ? R.plan.contact.angle : 0;
  if (typeof toward === 'number') return toward;
  const p = isRig(toward) ? toward.plan : toward;
  return Math.atan2(p.y - R.plan.y, p.x - R.plan.x) / DEG;
}

/** Cluster positions near the face at `deg` (art frame). */
function frontCluster(R, deg, n) {
  const rnd = prng(R.seed * 17 + 3);
  const Rm = membraneR(R, deg);
  return Array.from({ length: n }, (_, i) => {
    const t = n > 1 ? i / (n - 1) : 0.5;
    const a = (deg + lerp(-30, 30, t) + rnd.range(-6, 6)) * DEG;
    const rr = Rm * (0.78 - 0.2 * Math.abs(t - 0.5) * 2 + rnd.range(-0.05, 0.05) - (i % 2) * 0.14);
    return { x: Math.cos(a) * rr, y: Math.sin(a) * rr };
  });
}

/** The centrosome swings to face `toward`; granules ride the rails and cluster there. */
export function polarize(tl, killer, toward, { duration = 1.6, mtoc = true, pos } = {}) {
  return build(tl, pos, (sub) => {
    const deg = towardAngle(killer, toward);
    const els = granuleEls(killer);
    const from = granulePlan(killer).map((g) => ({ ...g }));
    const spots = frontCluster(killer, deg, els.length);
    const to = from.map((g, i) => ({ x: spots[i].x, y: spots[i].y, r: (killer.restGranules[i] || g).r, o: 1 }));
    let m0 = null, m1 = deg;
    if (mtoc) {
      ensureMtoc(killer, killer.plan.mtoc ?? deg + 180);
      m0 = killer.plan.mtoc;
      m1 = m0 + angDelta(m0, deg);
      if (Math.abs(angDelta(m0, deg)) > 170) m1 = m0 - (360 - Math.abs(angDelta(m0, deg)));   // swing over the top
    }
    const n = els.length;
    drive(sub, (p) => {
      if (mtoc) killer.mtoc.setAttribute('transform', `rotate(${f(lerp(m0, m1, E.inOut(seg(p, 0, 0.6))))})`);
      for (let i = 0; i < n; i++) {
        const d0 = 0.28 + (n > 1 ? (i / (n - 1)) * 0.18 : 0);
        writeGranule(els[i], polarLerp(from[i], to[i], E.inOut(seg(p, d0, d0 + 0.54))));
      }
    }, { duration });
    killer.plan.granules = to;
    killer.plan.polarized = deg;
    if (mtoc) killer.plan.mtoc = m1;
  });
}

// ------------------------------------------------------------------ kill

/** Granules nearest the face fuse with the membrane (shrink + fade at the contact). */
function fuse(sub, killer, { duration = 0.8, pos = 0 } = {}) {
  const els = granuleEls(killer);
  if (!els.length) return;
  const deg = killer.plan.contact ? killer.plan.contact.angle : killer.plan.polarized ?? 0;
  const from = granulePlan(killer).map((g) => ({ ...g }));
  const c = Math.cos(deg * DEG), s = Math.sin(deg * DEG);
  const order = from.map((g, i) => ({ i, d: g.x * c + g.y * s })).sort((a, b) => b.d - a.d);
  const k = Math.max(1, Math.ceil(from.length * 0.45));
  const firing = new Set(order.slice(0, k).map((o) => o.i));
  const Rm = membraneR(killer, deg);
  const to = from.map((g, i) => (firing.has(i) ? { x: c * Rm * 0.94 + (g.x - c * (g.x * c + g.y * s)) * 0.6, y: s * Rm * 0.94 + (g.y - s * (g.x * c + g.y * s)) * 0.6, r: 0, o: 0 } : { ...g }));
  drive(sub, (p) => {
    els.forEach((elc, i) => {
      if (!firing.has(i)) { writeGranule(elc, from[i]); return; }
      const j = [...firing].indexOf(i);
      const q = E.inOut(seg(p, j * 0.08, 0.7 + j * 0.06));
      writeGranule(elc, { x: lerp(from[i].x, to[i].x, q), y: lerp(from[i].y, to[i].y, q), r: lerp(from[i].r, 0, E.in(seg(q, 0.45, 1))), o: 1 - seg(q, 0.6, 1) });
    });
  }, { duration, pos });
  killer.plan.granules = to;
}

/** Lens-scale puff: perforin specks and granzyme beads cross the cleft into the target. */
function puff(sub, killer, target, { pos = 0, duration = 1.4, layer } = {}) {
  const host = layer || fxLayer(killer.el.parentNode);
  const ct = killer.plan.contact;
  if (!ct) return;
  const axis = ct.angle;
  const ax = Math.cos(axis * DEG), ay = Math.sin(axis * DEG);
  const px = -ay, py = ax;
  const rnd = prng(killer.seed * 7 + 11);
  const items = [];
  const light = killer.stage === 'light';
  for (let i = 0; i < 7; i++) {
    const isGz = i % 2 === 0;
    const node = isGz
      ? granzyme({ size: clamp(killer.r * 0.12, 4, 7), stage: killer.stage })
      : el('path', { d: `M-2.2 0L2.2 0`, stroke: light ? mix(killer.color, '#1B1F2A', 0.3) : mix(killer.color, WHITE, 0.6), 'stroke-width': 1.6, 'stroke-linecap': 'round' });
    const g = el('g', { opacity: 0 });
    g.appendChild(node);
    host.appendChild(g);
    const lat = rnd.range(-1, 1) * killer.r * 0.22;
    const depth = rnd.range(0.12, 0.34) * target.r;
    items.push({ g, lat, depth, d: i * 0.05, rot: rnd.range(-40, 40) });
  }
  drive(sub, (p) => {
    for (const it of items) {
      const q = E.out(seg(p, it.d, it.d + 0.7));
      const along = lerp(-killer.r * 0.06, it.depth, q);
      const x = ct.x + ax * along + px * it.lat;
      const y = ct.y + ay * along + py * it.lat;
      it.g.setAttribute('transform', `translate(${f(x)} ${f(y)}) rotate(${f(axis + it.rot)})`);
      it.g.setAttribute('opacity', f(Math.min(E.out(seg(p, it.d, it.d + 0.15)), 1 - seg(p, 0.62, 1))));
    }
  }, { duration, pos });
}

/**
 * The delivery moment on its own: granules at the face fuse with the membrane (cell scale);
 * with perforin: true also the lens-scale puff into the target. kill() = dock + polarize + fire + die + detach.
 */
export function fire(tl, killer, target, { perforin = false, duration = 0.9, pos } = {}) {
  return build(tl, pos, (sub) => {
    fuse(sub, killer, { duration, pos: 0 });
    if (perforin && target) puff(sub, killer, target, { pos: duration * 0.4 });
  });
}

/** Seekable apoptosis on a Rig or art node (rule 6 death: shrink, blebs, fragments). */
export function die(tl, cell, { duration = 3, to = 1, from, remnants = true, pos } = {}) {
  return build(tl, pos, (sub) => {
    const art = isRig(cell) ? cell.art : cell;
    const p0 = from ?? (isRig(cell) ? cell.plan.dying : 0) ?? 0;
    const state = ART.dyingState ? ART.dyingState(art, { remnants }) : null;
    const virions = art.querySelector('[data-part="virions"]');
    drive(sub, (p) => {
      const v = lerp(p0, to, p);
      // setDying(…, 0) restores the visible drawing but leaves hidden fragment transforms as
      // they were; render a hair above 0 first so the DOM never depends on history.
      if (v <= 0 && state) state.p = 1e-4;
      if (state) state.p = v;
      else if (ART.setDying) ART.setDying(art, v, { remnants });
      if (virions) virions.setAttribute('opacity', f(1 - E.inOut(seg(v, 0.05, 0.5))));
    }, { duration });
    if (isRig(cell)) cell.plan.dying = to;
  });
}

/** Back off from the contact, unflatten, re-arm the granules. */
export function detach(tl, killer, { from, distance, duration = 1.1, ease = 'so.inOut', pos } = {}) {
  return build(tl, pos, (sub) => {
    const ct = killer.plan.contact;
    const faceDeg = ct ? ct.angle : 0;
    const back = (faceDeg + 180) * DEG;
    const dist = distance ?? killer.r * 0.6;
    const A = poseOf(killer.plan);
    const B = { ...A, x: A.x + Math.cos(back) * dist, y: A.y + Math.sin(back) * dist, m: IDENTITY.slice() };
    const els = granuleEls(killer);
    const g0 = els.length ? granulePlan(killer).map((g) => ({ ...g })) : [];
    const g1 = els.map((c, i) => ({ ...(killer.restGranules[i] || g0[i]), o: 1 }));
    const seal = killer.plan.seal;
    const m0 = killer.plan.mtoc;
    const m1 = m0 == null ? null : m0 + angDelta(m0, faceDeg + 180);
    const ez = easeOf(ease);
    drive(sub, (p) => {
      applyPose(killer, lerpPose(A, B, ez(p)));
      const q = E.inOut(seg(p, 0.2, 1));
      els.forEach((c, i) => writeGranule(c, { x: lerp(g0[i].x, g1[i].x, q), y: lerp(g0[i].y, g1[i].y, q), r: lerp(g0[i].r, g1[i].r, q), o: lerp(g0[i].o, 1, q) }));
      if (seal) seal.g.setAttribute('opacity', f(1 - E.out(seg(p, 0, 0.45))));
      if (m0 != null && killer.mtoc) killer.mtoc.setAttribute('transform', `rotate(${f(lerp(m0, m1, E.inOut(seg(p, 0.15, 1))))})`);
    }, { duration });
    setPlan(killer, B);
    if (els.length) killer.plan.granules = g1;
    if (m1 != null) killer.plan.mtoc = m1;
    Object.assign(killer.plan, { docked: null, contact: null, polarized: null, seal: null });
  });
}

/**
 * The canonical contact kill (rule 6): dock → granules to the contact → fuse (+ lens-scale
 * perforin/granzyme puff) → setDying → the killer detaches intact.
 */
export function kill(tl, killer, target, { perforin = false, duration = 3.2, dock: doDock = true, flatten = 0.14, seal = false, detach: doDetach = true, back, pos } = {}) {
  const marks = {};
  const span = build(tl, pos, (sub) => {
    let t = 0;
    if (doDock && killer.plan.docked !== target) t = dock(sub, killer, target, { flatten, seal, pos: 0 }).end;
    marks.docked = t;
    const hasGranules = granuleEls(killer).length > 0;
    const face = killer.plan.contact ? killer.plan.contact.angle : towardAngle(killer, target);
    if (hasGranules && (killer.plan.polarized == null || Math.abs(angDelta(killer.plan.polarized, face)) > 20)) {
      t = polarize(sub, killer, face, { duration: 1.4, pos: t }).end;
    }
    marks.aimed = t;
    fuse(sub, killer, { duration: 0.9, pos: t });
    marks.fired = t + 0.45;
    if (perforin) puff(sub, killer, target, { pos: t + 0.35 });
    marks.dying = t + (perforin ? 0.9 : 0.6);
    die(sub, target, { duration, pos: marks.dying });
    marks.dead = marks.dying + duration;
    if (doDetach) {
      marks.released = marks.dying + duration * 0.45;
      detach(sub, killer, { distance: back, pos: marks.released });
    }
  });
  for (const k of Object.keys(marks)) marks[k] += span.start;
  return { ...span, marks };
}

/** A macrophage drifts onto the apoptotic bodies, which shrink into it and fade. */
export function clearUp(tl, mac, dead, { duration = 2.6, pos } = {}) {
  return build(tl, pos, (sub) => {
    const D = dead.plan;
    const ang = Math.atan2(mac.plan.y - D.y, mac.plan.x - D.x) / DEG;
    const reach = mac.r * 0.32;
    move(sub, mac, { x: D.x + Math.cos(ang * DEG) * reach, y: D.y + Math.sin(ang * DEG) * reach, duration: duration * 0.62, pos: 0, stretch: 0.03 });
    const A = poseOf(dead.plan);
    const B = { ...A, x: lerp(A.x, mac.plan.x, 0.35), y: lerp(A.y, mac.plan.y, 0.35), s: A.s * 0.5, o: 0 };
    drive(sub, (p) => {
      const q = E.inOut(p);
      applyPose(dead, { x: lerp(A.x, B.x, q), y: lerp(A.y, B.y, q), m: A.m, s: lerp(A.s, B.s, q), o: lerp(A.o, 0, E.in(seg(p, 0.25, 1))) });
    }, { duration: duration * 0.62, pos: duration * 0.38 });
    setPlan(dead, B);
  });
}

/** Crossfade a rig to a redrawn art node (same seed). Later builders use `next`. */
export function swap(tl, R, next, { duration = 0.8, pos } = {}) {
  return build(tl, pos, (sub) => {
    const old = R.art;
    next.setAttribute('opacity', '0');
    old.after(next);
    drive(sub, (p) => {
      const q = E.inOut(p);
      next.setAttribute('opacity', f(q));
      old.setAttribute('opacity', f(1 - E.inOut(seg(p, 0.15, 1))));
    }, { duration });
    R.art = next;
    R.info = cellInfo(next) || R.info;
    R.plan.granules = null;
    R.restGranules = null;
  });
}

// ------------------------------------------------------------------ divide

/** "Photocopying": the cell elongates, pinches and becomes n daughters (same seed, same tcrKey). */
export function divide(tl, cell, n = 2, { angle, spread, duration = 1.8, scale = 0.94, pos } = {}) {
  const daughters = [];
  const span = build(tl, pos, (sub) => {
    const A = poseOf(cell.plan);
    const axis = angle ?? (prng(cell.seed * 13 + 5)() * 180 - 90);
    const dist = spread ?? cell.r * 1.15;
    const parent = cell.el.parentNode;
    let after = cell.el;
    for (let k = 0; k < n; k++) {
      const dir = axis + (k * 360) / n;
      const art = cell.art.cloneNode(true);
      art.removeAttribute('opacity');
      const d = rig(art, { x: A.x, y: A.y, tcrKey: cell.tcrKey, seed: cell.seed, opacity: 0, name: cell.el.getAttribute('data-rig') });
      if (parent) { after.after(d.el); after = d.el; }
      d.r = cell.r;
      d.dir = dir;
      daughters.push(d);
    }
    const P1 = { ...A, m: squashM(axis, 1.24, 0.84) };
    drive(sub, (p) => {
      const q = E.inOut(seg(p, 0, 0.48));
      const pm = lerpM(A.m, P1.m, q);
      applyPose(cell, { x: A.x, y: A.y, m: pm, s: A.s, o: A.o * (1 - E.inOut(seg(p, 0.44, 0.6))) });
      for (const d of daughters) {
        const c = Math.cos(d.dir * DEG), s = Math.sin(d.dir * DEG);
        const k1 = E.out(seg(p, 0.44, 1));
        const off = lerp(cell.r * 0.36, dist, k1);
        const m = lerpM(squashM(d.dir, 0.84, 1.04), IDENTITY, E.inOut(seg(p, 0.55, 1)));
        applyPose(d, { x: A.x + c * off, y: A.y + s * off, m, s: lerp(scale * 0.9, scale, k1), o: A.o * E.inOut(seg(p, 0.44, 0.62)) });
      }
    }, { duration });
    setPlan(cell, { ...A, o: 0 });
    for (const d of daughters) {
      const c = Math.cos(d.dir * DEG), s = Math.sin(d.dir * DEG);
      setPlan(d, { x: A.x + c * dist, y: A.y + s * dist, m: IDENTITY.slice(), s: scale, o: A.o });
    }
  });
  daughters.span = { start: span.start, end: span.end };
  return daughters;
}

// ------------------------------------------------------------------ antibodies

function abSize(ab, size) {
  if (size) return { u: size, center: isCenterAnchored(ab) != null };
  const c = isCenterAnchored(ab);
  if (c != null) return { u: c * 2, center: true };
  let top = -28;
  try { top = ab.getBBox().y; } catch (e) { /* unrendered */ }
  return { u: Math.max(8, -top), center: false };
}
function isCenterAnchored(ab) {
  const kids = ab.children;
  if (kids.length !== 1 || kids[0].tagName !== 'g') return null;
  const m = /^translate\(0[ ,]+([\d.]+)\)$/.exec(kids[0].getAttribute('transform') || '');
  return m ? Number(m[1]) : null;
}

/** A drug antibody drifts in and caps a glyph's head with one arm tip, Fc pointing away (rule 9). */
export function dockAntibody(tl, ab, glyph, { from, arm = 'right', size, duration = 1.5, ease = 'so.out', pos } = {}) {
  return build(tl, pos, (sub) => {
    let wrap = ab.parentNode;
    if (!wrap || !wrap.hasAttribute || !wrap.hasAttribute('data-ab-pose')) {
      const host = ab.parentNode;
      wrap = el('g', { 'data-ab-pose': '' });
      if (host) host.insertBefore(wrap, ab);
      wrap.appendChild(ab);
    }
    const frame = wrap.parentNode;
    const { u, center } = abSize(ab, size);
    const tips = ART.antibodyTips ? ART.antibodyTips(u) : { right: [0.4 * u, -0.95 * u], left: [-0.4 * u, -0.95 * u] };
    const tip = tips[arm] || tips.right;
    const tx = tip[0], ty = tip[1] + (center ? 0.5 * u : 0);
    const hx = 0.035 * u * (arm === 'left' ? -1 : 1), hy = -0.485 * u + (center ? 0.5 * u : 0);
    const alpha = Math.atan2(ty - hy, tx - hx) / DEG;
    const H = glyphHead(glyph, frame);
    const psi = H.angle + 180 - alpha;
    const c = Math.cos(psi * DEG), s = Math.sin(psi * DEG);
    const P = { x: H.x - (c * tx - s * ty), y: H.y - (s * tx + c * ty), r: psi };
    const out = { x: Math.cos(H.angle * DEG), y: Math.sin(H.angle * DEG) };
    const F = from ? { x: from.x ?? P.x, y: from.y ?? P.y, r: from.rotation ?? psi - 25 }
      : { x: P.x + out.x * u * 1.6 + out.y * u * 0.5, y: P.y + out.y * u * 1.6 - out.x * u * 0.5, r: psi - 28 };
    const ez = easeOf(ease);
    wrap.setAttribute('transform', `translate(${f(F.x)} ${f(F.y)}) rotate(${f(F.r)})`);
    wrap.setAttribute('opacity', '0');
    drive(sub, (p) => {
      const q = ez(p);
      wrap.setAttribute('transform', `translate(${f(lerp(F.x, P.x, q))} ${f(lerp(F.y, P.y, q))}) rotate(${f(lerp(F.r, P.r, q))})`);
      wrap.setAttribute('opacity', f(E.out(seg(p, 0, 0.3))));
    }, { duration });
    return { antibody: wrap };
  });
}

// ------------------------------------------------------------------ signals

function particle(kind, { color, size, stage, rotation }) {
  if (kind === 'interferon' && ART.interferon) return ART.interferon({ color, size, stage });
  if (kind === 'danger' && ART.dangerSpark) return ART.dangerSpark({ size, stage, rotation });
  if (kind === 'interferon') {
    const g = el('g');
    g.appendChild(el('circle', { r: f(size / 2), fill: 'none', stroke: color, 'stroke-width': f(size * 0.2) }));
    return g;
  }
  return ART.cytokine({ color, size, stage });
}

/** Signal molecules leave the sender and diffuse outward (cytokine dots · interferon rings · danger sparks). */
export function emit(tl, from, { kind = 'cytokine', color, n = 8, r = 90, duration = 2.4, size, spread = 360, angle = 0, fade = true, seed = 1, layer, pos } = {}) {
  return build(tl, pos, (sub) => {
    const sender = isRig(from) ? from : null;
    const O = sender ? { x: from.plan.x, y: from.plan.y } : from;
    if (!sender && !layer && !from.parent) throw new Error('emit: pass `layer` when `from` is a point');
    const host = layer || fxLayer(sender ? sender.el.parentNode : from.parent);
    const stage = sender ? sender.stage : from.stage || 'dark';
    const c = kind === 'danger' ? (color || PALETTE.danger || '#FFE6A6') : resolve(color || (sender ? sender.color : PALETTE.cd4));
    const sz = size ?? (kind === 'cytokine' ? 5 : kind === 'interferon' ? 8 : 9);
    const rnd = prng(seed * 101 + n);
    const parts = [];
    for (let i = 0; i < n; i++) {
      const a = (spread >= 360 ? (i / n) * 360 : angle - spread / 2 + (n > 1 ? (i / (n - 1)) * spread : spread / 2)) + rnd.range(-0.4, 0.4) * (spread / Math.max(1, n));
      const g = el('g', { opacity: 0 });
      g.appendChild(particle(kind, { color: c, size: sz * rnd.range(0.8, 1.15), stage, rotation: rnd.range(0, 90) }));
      host.appendChild(g);
      const r0 = sender ? membraneR(sender, a) * 1.02 : 0;
      parts.push({ g, a: a * DEG, r0, r1: r * rnd.range(0.6, 1), wob: rnd.range(-1, 1) * r * 0.12, d: rnd.range(0, 0.32), spin: rnd.range(-60, 60) });
    }
    drive(sub, (p) => {
      for (const q of parts) {
        const t = seg(p, q.d, q.d + (1 - 0.32));
        const e = E.out(t);
        const rr = lerp(q.r0, q.r1, e);
        const w = Math.sin(Math.PI * e) * q.wob;
        const x = O.x + Math.cos(q.a) * rr - Math.sin(q.a) * w;
        const y = O.y + Math.sin(q.a) * rr + Math.cos(q.a) * w;
        q.g.setAttribute('transform', `translate(${f(x)} ${f(y)})${kind === 'danger' ? ` rotate(${f(q.spin * e)})` : ''}`);
        const fo = fade === true ? 0 : fade === false ? 1 : fade;   // final opacity
        const o = t <= 0 ? 0 : Math.min(E.out(seg(t, 0, 0.15)), lerp(1, fo, E.in(seg(t, 0.6, 1))));
        q.g.setAttribute('opacity', f(o));
      }
    }, { duration });
    return { particles: parts.map((q) => q.g) };
  });
}

/** A signal disc travels along an SVG path: '+' activating, '-' inhibitory, null neutral. */
export function pulseAlong(tl, path, sign = '+', { duration = 1.2, size = 12, reverse = false, stage = 'dark', layer, pos } = {}) {
  return build(tl, pos, (sub) => {
    const host = layer || path.parentNode;
    const L = path.getTotalLength ? path.getTotalLength() : 0;
    const g = el('g', { 'data-part': 'pulse', opacity: 0 });
    if (sign === '+' || sign === '-') g.appendChild(signalIcon({ type: sign === '+' ? 'activating' : 'inhibitory', size, stage }));
    else {
      g.appendChild(el('circle', { r: f(size * 0.9), fill: ART.dotGlow ? ART.dotGlow(WHITE, 0.6) : WHITE }));
      g.appendChild(el('circle', { r: f(size * 0.28), fill: WHITE }));
    }
    host.appendChild(g);
    drive(sub, (p) => {
      const q = E.inOut(p);
      const pt = L ? path.getPointAtLength((reverse ? 1 - q : q) * L) : { x: 0, y: 0 };
      g.setAttribute('transform', `translate(${f(pt.x)} ${f(pt.y)})`);
      g.setAttribute('opacity', f(Math.min(E.out(seg(p, 0, 0.15)), 1 - E.in(seg(p, 0.82, 1)))));
    }, { duration });
    return { pulse: g };
  });
}

// ------------------------------------------------------------------ free-running twins

function twin(builder) {
  return (...args) => {
    const tl = gsap.timeline({ paused: true });
    tl.result = builder(tl, ...args);
    tl.stop = () => tl.kill();
    if (reducedMotion()) tl.progress(1);
    else tl.play();
    return tl;
  };
}

/** Free-running twins: run.kill(killer, target, opts) → a playing gsap timeline (+ .stop(), .result). */
export const run = Object.freeze({
  move: twin(move), approach: twin(approach), probe: twin(probe), dock: twin(dock), recognize: twin(recognize),
  polarize: twin(polarize), fire: twin(fire), kill: twin(kill), detach: twin(detach), die: twin(die), clearUp: twin(clearUp),
  swap: twin(swap), divide: twin(divide), dockAntibody: twin(dockAntibody), emit: twin(emit), pulseAlong: twin(pulseAlong),
});

export const setDying = ART.setDying;
export const dyingState = ART.dyingState;
