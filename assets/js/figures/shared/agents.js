// shared/agents.js — canvas crowd kit (platform task P4). API: docs/shared/agents.md
//
// Seeded, deterministic helpers for canvas simulations drawn with art-library sprites.
// No loop of its own: call from ctx.loop (through fixedStep for reproducible runs).
import * as ART from '../../art/index.js';

const TAU = Math.PI * 2;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** mulberry32: r(), r.range, r.int, r.pick, r.chance, r.gauss (same stream as ctx.random). */
export function rng(seed = 1) {
  let s = (typeof seed === 'number' ? seed : [...String(seed)].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 16777619), 2166136261)) >>> 0;
  const r = () => {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  r.range = (a, b) => a + (b - a) * r();
  r.int = (a, b) => Math.floor(a + (b - a + 1) * r());
  r.pick = (arr) => arr[Math.floor(r() * arr.length)];
  r.chance = (p) => r() < p;
  r.gauss = () => { let u = 0, v = 0; while (!u) u = r(); while (!v) v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v); };
  return r;
}

/** Fixed-timestep driver: returns (realDt) => number of steps taken. */
export function fixedStep(fn, { dt = 1 / 60, max = 8 } = {}) {
  let acc = 0;
  return (real) => {
    acc = Math.min(acc + real, dt * max);
    let n = 0;
    while (acc >= dt - 1e-9) { fn(dt); acc -= dt; n++; }
    return n;
  };
}

/** P(event with rate k per second happens within dt). */
export function rateToP(k, dt) { return 1 - Math.exp(-Math.max(0, k) * dt); }

/** Uniform-grid spatial hash for neighbor queries. */
export function spatialHash(cell = 40) {
  const map = new Map();
  const key = (i, j) => i * 73856093 ^ j * 19349663;
  const hash = {
    cell,
    clear() { map.clear(); return hash; },
    insert(a) {
      const k = key(Math.floor(a.x / cell), Math.floor(a.y / cell));
      let b = map.get(k);
      if (!b) { b = []; map.set(k, b); }
      b.push(a);
      return hash;
    },
    build(list) { map.clear(); for (const a of list) hash.insert(a); return hash; },
    each(x, y, r, fn) {
      const i0 = Math.floor((x - r) / cell), i1 = Math.floor((x + r) / cell);
      const j0 = Math.floor((y - r) / cell), j1 = Math.floor((y + r) / cell);
      const r2 = r * r;
      for (let i = i0; i <= i1; i++) for (let j = j0; j <= j1; j++) {
        const b = map.get(key(i, j));
        if (!b) continue;
        for (const a of b) { const dx = a.x - x, dy = a.y - y; if (dx * dx + dy * dy <= r2) fn(a); }
      }
    },
    near(x, y, r, out = []) { out.length = 0; hash.each(x, y, r, (a) => out.push(a)); return out; },
  };
  return hash;
}

/**
 * Persistent random walk. a: { x, y, heading?, rng? }.
 * bias: { x, y, strength } | { angle, strength } | (a) => angle|null ; bounds: box (reflect) or inside(x, y).
 */
export function walk(a, dt, { speed = 30, turn = 1.4, bias = null, bounds = null, rng: R = null } = {}) {
  const r = R || a.rng || Math.random;
  if (a.heading == null) a.heading = r() * TAU;
  const g = r.gauss ? r.gauss() : (r() + r() + r() - 1.5) * 1.4;
  a.heading += g * turn * Math.sqrt(dt);
  let want = null, strength = 0;
  if (typeof bias === 'function') { want = bias(a); strength = want == null ? 0 : 1.6; }
  else if (bias && bias.angle != null) { want = bias.angle; strength = bias.strength ?? 1; }
  else if (bias && bias.x != null) { want = Math.atan2(bias.y - a.y, bias.x - a.x); strength = bias.strength ?? 1; }
  if (want != null) {
    const d = Math.atan2(Math.sin(want - a.heading), Math.cos(want - a.heading));
    a.heading += d * clamp(strength * dt, 0, 1);
  }
  const v = (a.speed ?? speed) * dt;
  let nx = a.x + Math.cos(a.heading) * v, ny = a.y + Math.sin(a.heading) * v;
  if (bounds) {
    if (typeof bounds === 'function') {
      if (!bounds(nx, ny)) { a.heading += Math.PI + (r() - 0.5) * 0.8; nx = a.x; ny = a.y; }
    } else {
      const pad = a.r || 0;
      if (nx < bounds.x0 + pad || nx > bounds.x1 - pad) { a.heading = Math.PI - a.heading; nx = clamp(nx, bounds.x0 + pad, bounds.x1 - pad); }
      if (ny < bounds.y0 + pad || ny > bounds.y1 - pad) { a.heading = -a.heading; ny = clamp(ny, bounds.y0 + pad, bounds.y1 - pad); }
    }
  }
  a.x = nx; a.y = ny;
  return a;
}

/** Push overlapping agents apart (a.r + pad); a.fixed agents don't move. */
export function relax(agents, { hash = null, iterations = 1, strength = 0.5, pad = 0 } = {}) {
  const H = hash || spatialHash(64).build(agents);
  const near = [];
  let maxR = 0;
  for (const a of agents) maxR = Math.max(maxR, a.r || 0);
  for (let it = 0; it < iterations; it++) {
    for (const a of agents) {
      if (a.dead) continue;
      H.near(a.x, a.y, (a.r || 0) + maxR + pad, near);
      for (const b of near) {
        if (b === a || b.dead || b.id != null && a.id != null && b.id < a.id) continue;
        const dx = b.x - a.x, dy = b.y - a.y;
        const d = Math.hypot(dx, dy) || 1e-6;
        const min = (a.r || 0) + (b.r || 0) + pad;
        if (d >= min) continue;
        const push = (min - d) * strength;
        const ux = dx / d, uy = dy / d;
        const wa = a.fixed ? 0 : b.fixed ? 1 : 0.5, wb = b.fixed ? 0 : a.fixed ? 1 : 0.5;
        a.x -= ux * push * wa; a.y -= uy * push * wa;
        b.x += ux * push * wb; b.y += uy * push * wb;
      }
    }
  }
  return agents;
}

/**
 * Preload sprites per state. defs: { state: [kind, params] | { kind, params, seeds } }.
 * → Promise<{ get(state, variant), draw(g, a, opts), states, size(state) }>
 */
export async function spriteStates(defs, { seeds = 4, scale } = {}) {
  const entries = Object.entries(defs);
  const sheets = {};
  await Promise.all(entries.map(async ([state, d]) => {
    const [kind, params, n] = Array.isArray(d) ? [d[0], d[1] || {}, d[2] ?? seeds] : [d.kind, d.params || {}, d.seeds ?? seeds];
    const fixed = params.seed != null;
    const list = await Promise.all(Array.from({ length: fixed ? 1 : n }, (_, i) => ART.sprite(kind, fixed ? params : { ...params, seed: i + 1 }, scale ? { scale } : undefined)));
    sheets[state] = list;
  }));
  const get = (state, variant = 0) => {
    const l = sheets[state] || sheets[Object.keys(sheets)[0]];
    return l[((variant % l.length) + l.length) % l.length];
  };
  const draw = (g, a, { state, scale: sc = 1, alpha = 1, rotation = 0 } = {}) => {
    const img = get(state ?? a.state, a.variant ?? 0);
    if (!img) return;
    const s = sc * (a.scale ?? 1) * (a.dying ? 1 - easeInOut(clamp(a.dying, 0, 1)) * 0.92 : 1);
    const al = alpha * (a.alpha ?? 1) * (a.dying ? 1 - clamp((a.dying - 0.55) / 0.45, 0, 1) : 1);
    if (s <= 0.01 || al <= 0.01) return;
    const rot = rotation || a.rotation || 0;
    if (a.pinch && a.pinch.p > 0) {
      // two overlapping copies drifting apart along the pinch axis (division)
      const p = a.pinch.p;
      const off = (a.r || 10) * lerp(0.05, a.pinch.gap ?? 0.75, easeInOut(p));
      const ux = Math.cos(a.pinch.angle), uy = Math.sin(a.pinch.angle);
      const ss = s * lerp(1, 0.9, Math.sin(Math.PI * p));
      ART.drawSprite(g, img, a.x - ux * off, a.y - uy * off, { scale: ss, alpha: al, rotation: rot });
      ART.drawSprite(g, img, a.x + ux * off, a.y + uy * off, { scale: ss, alpha: al, rotation: rot });
      return;
    }
    ART.drawSprite(g, img, a.x, a.y, { scale: s, alpha: al, rotation: rot });
  };
  return { get, draw, states: Object.keys(sheets), size: (state) => { const i = get(state, 0); const m = i && ART.spriteInfo(i); return m ? m.size : 0; } };
}

// ------------------------------------------------------------------ effects

/** Effects store: killSpecks / divisionPinch / contactRing push into it; step + draw each frame. */
export function createEffects() {
  const list = [];
  const fx = {
    list,
    get count() { return list.length; },
    add(e) { list.push(e); return e; },
    step(dt) {
      for (let i = list.length - 1; i >= 0; i--) {
        const e = list[i];
        e.t += dt;
        if (e.step) e.step(e, dt);
        if (e.t >= e.life) { if (e.done) e.done(e); list.splice(i, 1); }
      }
    },
    draw(g) { for (const e of list) if (e.draw) e.draw(g, e); },
    clear() { list.length = 0; },
  };
  return fx;
}

/** Crowd kill (rule 6): the agent shrinks away while 4–6 specks of its color drift out and fade. */
export function killSpecks(fx, a, { color = '#B65FD8', n, life = 0.6, seed } = {}) {
  const R = rng(seed ?? (Math.floor(a.x * 13 + a.y * 7) | 0));
  const count = n ?? R.int(4, 6);
  const r0 = a.r || 10;
  const specks = Array.from({ length: count }, (_, i) => {
    const ang = (i / count) * TAU + R.range(-0.4, 0.4);
    return { ang, d: r0 * R.range(0.9, 1.6), s: r0 * R.range(0.1, 0.18) };
  });
  a.dying = a.dying || 0.0001;
  return fx.add({
    t: 0, life, a, x: a.x, y: a.y, specks,
    step(e) { e.a.dying = clamp(e.t / e.life, 0.0001, 1); },
    done(e) { e.a.dying = 1; e.a.dead = true; },
    draw(g, e) {
      const p = clamp(e.t / e.life, 0, 1);
      g.save();
      g.fillStyle = color;
      for (const s of e.specks) {
        const k = easeOut(p);
        g.globalAlpha = (1 - p) * 0.85;
        g.beginPath();
        g.arc(e.x + Math.cos(s.ang) * s.d * (0.35 + 0.65 * k), e.y + Math.sin(s.ang) * s.d * (0.35 + 0.65 * k), s.s * (1 - 0.4 * p), 0, TAU);
        g.fill();
      }
      g.restore();
    },
  });
}

/** Division: the agent pinches into two along `angle`; onSplit(a, angle) once at the end. */
export function divisionPinch(fx, a, { angle, duration = 0.8, gap = 0.75, onSplit, seed } = {}) {
  const ang = angle ?? rng(seed ?? (Math.floor(a.x * 3 + a.y * 11) | 0))() * TAU;
  a.pinch = { p: 0.0001, angle: ang, gap };
  return fx.add({
    t: 0, life: duration, a,
    step(e) { e.a.pinch.p = clamp(e.t / e.life, 0.0001, 1); },
    done(e) {
      const off = (e.a.r || 10) * gap;
      e.a.pinch = null;
      const ux = Math.cos(ang), uy = Math.sin(ang);
      e.a.x -= ux * off; e.a.y -= uy * off;
      if (onSplit) onSplit(e.a, ang, { x: e.a.x + ux * off * 2, y: e.a.y + uy * off * 2 });
    },
  });
}

/** Crowd recognition (rule 5): a swelling ring in the killer's color with a white core. */
export function contactRing(fx, x, y, { color = '#4C8DFF', r = 12, life = 0.9, core = true } = {}) {
  return fx.add({
    t: 0, life, x, y,
    draw(g, e) {
      const p = clamp(e.t / e.life, 0, 1);
      const env = Math.sin(Math.PI * Math.min(1, p * 1.1));
      const rr = r * (1 + 0.7 * easeInOut(p));
      g.save();
      g.globalAlpha = 0.9 * env;
      g.strokeStyle = color;
      g.lineWidth = Math.max(1.2, r * 0.14) * (1 - 0.5 * p);
      g.beginPath();
      g.arc(e.x, e.y, rr, 0, TAU);
      g.stroke();
      if (core) {
        const grad = g.createRadialGradient(e.x, e.y, 0, e.x, e.y, r * 0.55);
        grad.addColorStop(0, 'rgba(255,255,255,0.95)');
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        g.globalAlpha = env * (1 - p * 0.6);
        g.fillStyle = grad;
        g.beginPath();
        g.arc(e.x, e.y, r * 0.55, 0, TAU);
        g.fill();
      }
      g.restore();
    },
  });
}
