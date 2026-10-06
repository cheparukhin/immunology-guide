// Self & Other — illustration library
// animate.js: tiny, dependency-free motion helpers for the art library.
//
// • One shared requestAnimationFrame loop for everything.
// • Loops pause when the tab is hidden and when their SVG is off-screen.
// • prefers-reduced-motion: ambient loops (breathe, jitter, drift, crawl) do not start;
//   one-shot effects (apoptosis, glowPulse, tween) jump to their end state.
// • Every helper returns a handle: { stop(), pause(), resume(), finished: Promise, running }.
// Works side by side with GSAP — but never let two systems drive the same attribute.

import { el, n, TAU, clamp, lerp } from './svg.js';
import { cellInfo } from './registry.js';
import { rng, blobRadius, polarPoints, smoothPath, rayHit } from './shapes.js';
import { mix, stageOf, resolve, shade } from './palette.js';
import { dotGlow, bodyFill } from './defs.js';
import { dangerSpark } from './molecules.js';

// ---------------------------------------------------------------- reduced motion

let rmOverride = null;
const rmListeners = new Set();
const mq = typeof matchMedia !== 'undefined' ? matchMedia('(prefers-reduced-motion: reduce)') : null;
if (mq && mq.addEventListener) mq.addEventListener('change', () => rmListeners.forEach((f) => f(prefersReducedMotion())));

/** True when the user (or setReducedMotion) asks for reduced motion. */
export function prefersReducedMotion() {
  if (rmOverride != null) return !!rmOverride;
  return !!(mq && mq.matches);
}
/** Force reduced motion on/off (true/false) or follow the OS again (null). Dev/testing aid. */
export function setReducedMotion(v) {
  rmOverride = v;
  rmListeners.forEach((f) => f(prefersReducedMotion()));
}
/** Subscribe to reduced-motion changes; returns an unsubscribe function. */
export function onReducedMotionChange(fn) {
  rmListeners.add(fn);
  return () => rmListeners.delete(fn);
}

// ---------------------------------------------------------------- easing

export const ease = {
  linear: (t) => t,
  inOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
  outCubic: (t) => 1 - Math.pow(1 - t, 3),
  inOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  inCubic: (t) => t * t * t,
  outBack: (t) => { const c1 = 1.2, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
};

// ---------------------------------------------------------------- shared ticker

const active = new Set();
let raf = 0;
const hasDoc = typeof document !== 'undefined';

function loop(now) {
  raf = 0;
  if (hasDoc && document.hidden) return;
  for (const a of [...active]) {
    if (a.paused || !a.visible) { a.lastNow = now; continue; }
    if (a.lastNow != null) a.time += Math.min(100, now - a.lastNow) / 1000;
    a.lastNow = now;
    a.tick(a.time, now);
  }
  if (active.size) raf = requestAnimationFrame(loop);
}
function ensure() {
  if (!raf && active.size && !(hasDoc && document.hidden)) raf = requestAnimationFrame(loop);
}
if (hasDoc) document.addEventListener('visibilitychange', () => {
  for (const a of active) a.lastNow = null;
  ensure();
});

const watchers = new Map(); // host element -> Set(anim)
const io = typeof IntersectionObserver !== 'undefined'
  ? new IntersectionObserver((entries) => {
    for (const e of entries) {
      const set = watchers.get(e.target);
      if (set) for (const a of set) a.visible = e.isIntersecting;
    }
    ensure();
  }, { rootMargin: '120px' })
  : null;

function hostOf(node) {
  let h = node;
  while (h && h.parentNode && h.parentNode.namespaceURI === 'http://www.w3.org/2000/svg') h = h.parentNode;
  return h;
}

function start(anim, target) {
  anim.time = 0;
  anim.lastNow = null;
  anim.visible = true;
  anim.paused = false;
  let done;
  anim.finished = new Promise((r) => (done = r));
  anim.done = done;
  const host = target ? hostOf(target) : null;
  anim.host = host;
  if (io && host && host.nodeType === 1) {
    if (!watchers.has(host)) { watchers.set(host, new Set()); io.observe(host); }
    watchers.get(host).add(anim);
  }
  active.add(anim);
  ensure();
  const handle = {
    running: true,
    finished: anim.finished,
    stop() {
      if (!handle.running) return;
      handle.running = false;
      active.delete(anim);
      if (anim.host && watchers.has(anim.host)) {
        const set = watchers.get(anim.host);
        set.delete(anim);
        if (!set.size) { watchers.delete(anim.host); io && io.unobserve(anim.host); }
      }
      if (anim.onStop) anim.onStop();
      anim.done();
    },
    pause() { anim.paused = true; },
    resume() { anim.paused = false; anim.lastNow = null; ensure(); },
  };
  anim.handle = handle;
  return handle;
}

function inert(reason = 'reduced-motion') {
  return { running: false, reduced: reason === 'reduced-motion', finished: Promise.resolve(), stop() {}, pause() {}, resume() {} };
}

const list = (els) => (els == null ? [] : els.length != null && typeof els !== 'string' ? [...els] : [els]);

// ---------------------------------------------------------------- generic tween

/**
 * tween({ duration:600 (ms), ease:'inOutCubic', onUpdate(p), onComplete(), target })
 * Reduced motion → onUpdate(1) immediately.
 */
export function tween({ duration = 600, ease: e = 'inOutCubic', onUpdate, onComplete, target = null } = {}) {
  const fe = typeof e === 'function' ? e : ease[e] || ease.inOutCubic;
  if (prefersReducedMotion() || duration <= 0) {
    onUpdate && onUpdate(1);
    onComplete && onComplete();
    return inert();
  }
  const anim = {
    tick(t) {
      const p = clamp((t * 1000) / duration, 0, 1);
      onUpdate && onUpdate(fe(p));
      if (p >= 1) { anim.handle.stop(); onComplete && onComplete(); }
    },
  };
  return start(anim, target);
}

// ---------------------------------------------------------------- membrane breathing

function membranePaths(cell) {
  const mem = cell.querySelector('[data-part="membrane"] > path');
  const sheen = cell.querySelector('[data-part="sheen"] > path');
  return { mem, sheen: sheen && mem && sheen.getAttribute('d') === mem.getAttribute('d') ? sheen : null };
}

/**
 * Gentle membrane "breathing" — the outline wobbles a little around its resting shape;
 * dendrites and pseudopods sway. breathe(cell, { amplitude:1, period:6 (s), fps:24 })
 * Cells without regeneration data fall back to a subtle scale oscillation.
 */
export function breathe(cell, { amplitude = 1, period = 6, fps = 24 } = {}) {
  if (prefersReducedMotion()) return inert();
  const info = cellInfo(cell);
  const { mem, sheen } = membranePaths(cell);
  if (!info || !info.regen || !mem) {
    const base = cell.getAttribute('transform') || '';
    const anim = {
      tick(t) { const s = 1 + 0.012 * amplitude * Math.sin((TAU * t) / period); cell.setAttribute('transform', `${base} scale(${n(s)})`); },
      onStop() { cell.setAttribute('transform', base); },
    };
    return start(anim, cell);
  }
  const d0 = mem.getAttribute('d');
  let lastFrame = -1;
  const anim = {
    tick(t) {
      const f = Math.floor(t * fps);
      if (f === lastFrame) return;
      lastFrame = f;
      const tw = amplitude * 0.9 * Math.sin((TAU * t) / period) + amplitude * 0.35 * Math.sin((TAU * t) / (period * 0.43) + 1);
      const { d } = info.regen(tw, { waveT: t * amplitude });
      mem.setAttribute('d', d);
      if (sheen) sheen.setAttribute('d', d);
    },
    onStop() { mem.setAttribute('d', d0); if (sheen) sheen.setAttribute('d', d0); },
  };
  return start(anim, cell);
}

/** Alias: a livelier wobble. */
export function wobble(cell, o = {}) {
  return breathe(cell, { amplitude: 2, period: 4, ...o });
}

// ---------------------------------------------------------------- crawling

function readTranslate(node) {
  const tr = node.transform && node.transform.baseVal;
  if (tr && tr.numberOfItems) {
    const m = tr.consolidate().matrix;
    return [m.e, m.f];
  }
  return [0, 0];
}

/**
 * Amoeboid crawling: the cell pushes a pseudopod toward its heading, then follows it
 * (inch-worm rhythm). crawl(cell, { to:[x,y] | path:[[x,y]…], speed:28 (px/s), stride:1.6 (s),
 *   loop:false, onArrive })
 * Owns the cell's transform (`translate(x y)`); nest the cell in another <g> for extra transforms.
 * Reduced motion → jumps to the destination.
 */
export function crawl(cell, { to = null, path = null, speed = 28, stride = 1.6, loop = false, onArrive = null } = {}) {
  const pts = path ? path.slice() : to ? [to] : [];
  if (!pts.length) return inert('no-target');
  if (prefersReducedMotion()) {
    const last = pts[pts.length - 1];
    cell.setAttribute('transform', `translate(${n(last[0])} ${n(last[1])})`);
    onArrive && onArrive();
    return inert();
  }
  const info = cellInfo(cell);
  const { mem, sheen } = membranePaths(cell);
  const d0 = mem && mem.getAttribute('d');
  let [x, y] = readTranslate(cell);
  let idx = 0;
  let heading = Math.atan2(pts[0][1] - y, pts[0][0] - x);
  let lastFrame = -1;
  let last = 0;
  const anim = {
    tick(t) {
      const dt = Math.max(0, t - last);
      last = t;
      const [tx, ty] = pts[idx];
      const dx = tx - x, dy = ty - y;
      const dist = Math.hypot(dx, dy);
      const want = Math.atan2(dy, dx);
      // turn smoothly toward the target
      let dA = ((want - heading + Math.PI * 3) % TAU) - Math.PI;
      heading += clamp(dA, -dt * 2.2, dt * 2.2);
      const phase = (TAU * t) / stride;
      const v = speed * (0.45 + 0.55 * Math.max(0, Math.sin(phase)));
      const step = Math.min(dist, v * dt);
      if (dist > 0.5) { x += Math.cos(heading) * step; y += Math.sin(heading) * step; }
      cell.setAttribute('transform', `translate(${n(x)} ${n(y)})`);
      const f = Math.floor(t * 24);
      if (info && info.regen && mem && f !== lastFrame) {
        lastFrame = f;
        const reach = 0.1 + 0.08 * Math.sin(phase + Math.PI / 2);
        const bumps = [
          { angle: heading, amp: reach, width: 0.55 },
          { angle: heading + Math.PI, amp: 0.1, width: 0.3 },
        ];
        const { d } = info.regen(0.4 * Math.sin(t * 0.7), { bumps, waveT: t });
        mem.setAttribute('d', d);
        if (sheen) sheen.setAttribute('d', d);
      }
      if (dist <= 0.5) {
        idx++;
        if (idx >= pts.length) {
          if (loop) idx = 0;
          else { anim.handle.stop(); onArrive && onArrive(); }
        }
      }
    },
    onStop() { if (mem && d0) { mem.setAttribute('d', d0); if (sheen) sheen.setAttribute('d', d0); } },
  };
  return start(anim, cell);
}

// ---------------------------------------------------------------- receptor jitter, drift

/**
 * Small thermal jiggle for receptors / molecules (rotation about their anchor).
 * jitter(cell.querySelectorAll('[data-part="receptors"] > *'), { amplitude:5 (deg), speed:1, seed })
 */
export function jitter(elements, { amplitude = 5, speed = 1, seed = 1, fps = 30 } = {}) {
  if (prefersReducedMotion()) return inert();
  const els = list(elements);
  if (!els.length) return inert('empty');
  const R = rng(seed, 'jitter');
  const items = els.map((e) => ({ e, base: e.getAttribute('data-base-transform') || e.getAttribute('transform') || '', p: R.range(0, TAU), w: R.range(0.7, 1.4) }));
  let lastFrame = -1;
  const anim = {
    tick(t) {
      const f = Math.floor(t * fps);
      if (f === lastFrame) return;
      lastFrame = f;
      for (const it of items) {
        const a = amplitude * (Math.sin(t * speed * 2.1 * it.w + it.p) * 0.7 + Math.sin(t * speed * 5.3 * it.w + it.p * 2) * 0.3);
        it.e.setAttribute('transform', `${it.base} rotate(${n(a)})`);
      }
    },
    onStop() { for (const it of items) it.e.setAttribute('transform', it.base); },
  };
  return start(anim, els[0]);
}

/**
 * Slow floating drift for particles, cytokines, free antibodies.
 * drift(elements, { amplitude:6 (px), speed:0.25, seed })
 */
export function drift(elements, { amplitude = 6, speed = 0.25, seed = 1, fps = 30 } = {}) {
  if (prefersReducedMotion()) return inert();
  const els = list(elements);
  if (!els.length) return inert('empty');
  const R = rng(seed, 'drift');
  const items = els.map((e) => ({ e, base: e.getAttribute('transform') || '', p: [R.range(0, TAU), R.range(0, TAU)], w: [R.range(0.6, 1.4), R.range(0.6, 1.4)], a: R.range(0.5, 1) }));
  let lastFrame = -1;
  const anim = {
    tick(t) {
      const f = Math.floor(t * fps);
      if (f === lastFrame) return;
      lastFrame = f;
      for (const it of items) {
        const dx = amplitude * it.a * Math.sin(t * speed * TAU * 0.3 * it.w[0] + it.p[0]);
        const dy = amplitude * it.a * Math.sin(t * speed * TAU * 0.23 * it.w[1] + it.p[1]);
        it.e.setAttribute('transform', `translate(${n(dx)} ${n(dy)}) ${it.base}`);
      }
    },
    onStop() { for (const it of items) it.e.setAttribute('transform', it.base); },
  };
  return start(anim, els[0]);
}

// ---------------------------------------------------------------- recognition pulse

/**
 * A slow, soft ring of light that swells and fades — marks a recognition event.
 * Never flashes. glowPulse(target, { color, radius, duration:1600, repeat:0 (or Infinity),
 *   scale:1.7, width:2 })
 * For cells, the ring is centred on the cell; for other nodes, on their bbox centre.
 * Reduced motion → a static ring is shown for `duration` ms, then removed.
 */
export function glowPulse(target, { color, radius, duration = 1800, repeat = 0, scale = 1.6, width = 2.2 } = {}) {
  const info = cellInfo(target);
  let cx = 0, cy = 0, r0 = radius;
  let host = target;
  if (!info) {
    try {
      const b = target.getBBox();
      cx = b.x + b.width / 2; cy = b.y + b.height / 2;
      r0 = r0 || Math.max(b.width, b.height) / 2;
    } catch (e) { r0 = r0 || 20; }
  } else {
    r0 = r0 || (info.rEff || info.r || info.extent || 20) * 1.08;
  }
  const c = resolve(color || (info && info.color) || '#FFFFFF');
  const stage = (info && info.stage) || 'dark';
  const ring = el('g', { 'data-part': 'pulse', 'pointer-events': 'none' });
  const fillC = el('circle', { cx: n(cx), cy: n(cy), r: n(r0), fill: dotGlow(c, stage === 'light' ? 0.25 : 0.45) });
  const strokeC = el('circle', { cx: n(cx), cy: n(cy), r: n(r0), fill: 'none', stroke: c, 'stroke-width': width, 'stroke-opacity': 0.9 });
  ring.appendChild(fillC);
  ring.appendChild(strokeC);
  host.insertBefore(ring, host.firstChild);
  if (prefersReducedMotion()) {
    fillC.setAttribute('r', n(r0 * 1.25));
    strokeC.setAttribute('r', n(r0 * 1.15));
    strokeC.setAttribute('stroke-opacity', 0.6);
    const tm = setTimeout(() => ring.remove(), duration);
    return { running: false, reduced: true, finished: new Promise((r) => setTimeout(r, duration)), stop() { clearTimeout(tm); ring.remove(); }, pause() {}, resume() {} };
  }
  let cycles = 0;
  const anim = {
    tick(t) {
      const total = (t * 1000) / duration;
      const p = total - cycles;
      if (p >= 1) {
        cycles++;
        if (cycles > repeat) { anim.handle.stop(); return; }
      }
      const q = clamp(total - cycles, 0, 1);
      const e = ease.inOutSine(q);
      const r = r0 * (1 + (scale - 1) * e);
      const o = Math.pow(Math.sin(Math.PI * Math.min(1, q * 1.15)), 0.9);
      fillC.setAttribute('r', n(r * 1.1));
      fillC.setAttribute('opacity', n(o));
      strokeC.setAttribute('r', n(r));
      strokeC.setAttribute('stroke-opacity', n(0.85 * o));
      strokeC.setAttribute('stroke-width', n(width * (1 - 0.6 * e)));
    },
    onStop() { ring.remove(); },
  };
  return start(anim, target);
}

// ---------------------------------------------------------------- apoptosis (kill)

const DYING = new WeakMap();

/**
 * Build (once) the extra nodes a dying cell needs; returns a controller whose apply(p) is a
 * pure function of p — no internal clock, so it is safe to scrub, reverse and jump.
 */
function prepareDying(cell, seed = 1) {
  let ctl = DYING.get(cell);
  if (ctl) return ctl;
  const info = cellInfo(cell) || { r: 30, stage: 'dark', color: '#B65FD8' };
  const R = rng(seed, 'apoptosis');
  const r = info.rEff || info.r || 30;
  const stage = info.stage || 'dark';
  const S = stageOf(stage);
  const color = resolve(info.color || '#B65FD8');
  const state0 = cell.getAttribute('data-state');
  // wrap content so we can scale it about the cell centre without touching cell.transform
  const wrap = el('g', { 'data-part': 'apoptosis' });
  while (cell.firstChild) wrap.appendChild(cell.firstChild);
  cell.appendChild(wrap);
  const { mem, sheen } = membranePaths(cell);
  const d0 = mem && mem.getAttribute('d');
  const glow = wrap.querySelector(':scope > [data-part="glow"]');
  const nucleus = [...wrap.querySelectorAll('[data-part="nucleus"]')];
  const fades = [...wrap.querySelectorAll('[data-part="receptors"], [data-part="microvilli"], [data-part="granules"], [data-part="cytokines"], [data-part="sheen"], [data-part="cytoplasm"], [data-part="vacuoles"], [data-part="ruffles"], [data-part="antigens"], [data-part="er"], [data-part="antibodies"], [data-part="virions"], [data-part="blebs"], [data-part="golgi"]')];
  // gray veil over the membrane = color draining away
  const veil = mem ? el('path', { 'data-part': 'veil', d: d0, fill: stage === 'light' ? '#E8E4DE' : '#3A3F52', 'fill-opacity': 0, 'pointer-events': 'none' }) : null;
  if (veil) mem.parentNode.appendChild(veil);
  const fragFill = stage === 'light' ? mix(color, S.ink, 0.5) : mix(shade(color, 0.7), S.bg, 0.2);
  // nuclear fragments: irregular, uneven beads (never a tidy row of dots)
  const frags = el('g', { 'data-part': 'fragments', opacity: 0 });
  const fragList = [];
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * TAU + R.range(-0.4, 0.4);
    const fr = r * R.range(0.07, 0.14);
    const rf = blobRadius({ r: fr, seed: `${seed}fr${i}`, irregularity: 0.5 });
    const c = el('path', { d: smoothPath(polarPoints(rf, 12)), fill: fragFill, stroke: stage === 'light' ? mix(color, S.ink, 0.6) : mix(color, '#FFFFFF', 0.2), 'stroke-width': n(Math.max(0.4, r * 0.015)), 'stroke-opacity': 0.6 });
    frags.appendChild(c);
    fragList.push({ c, a, d: r * R.range(0.1, 0.32) });
  }
  wrap.appendChild(frags);
  // apoptotic bodies (appear in the last phase), irregular cluster
  const bodiesG = el('g', { 'data-part': 'apoptotic-bodies', opacity: 0 });
  const bodies = [];
  const nb = 6;
  const a0 = R.range(0, TAU);
  for (let i = 0; i < nb; i++) {
    const a = a0 + (i / nb) * TAU + R.range(-0.5, 0.5);
    const br = r * (i === 0 ? 0.32 : R.range(0.12, 0.27));
    const rf = blobRadius({ r: br, seed: `${seed}b${i}`, irregularity: 0.25 });
    const p = el('path', {
      d: smoothPath(polarPoints(rf, 18)),
      fill: bodyFill(color, stage, { intensity: 0.6, desat: 0.5 }),
      stroke: stage === 'light' ? mix(color, S.ink, 0.35) : mix(color, '#FFFFFF', 0.15), 'stroke-opacity': 0.7, 'stroke-width': n(Math.max(0.6, r * 0.02)),
    });
    const bg = el('g', {}, [p]);
    if (i % 2 === 0) {
      const fr = blobRadius({ r: br * R.range(0.25, 0.4), seed: `${seed}f${i}`, irregularity: 0.6 });
      const ox = R.range(-0.3, 0.3) * br, oy = R.range(-0.3, 0.3) * br;
      bg.appendChild(el('path', { d: smoothPath(polarPoints(fr, 12).map(([x, y]) => [x + ox, y + oy])), fill: fragFill }));
    }
    bodiesG.appendChild(bg);
    bodies.push({ g: bg, a, d0: r * 0.2, d1: i === 0 ? r * 0.18 : r * R.range(0.42, 0.85) });
  }
  cell.appendChild(bodiesG);
  const blebs = Array.from({ length: 7 }, (_, i) => ({ angle: (i / 7) * TAU + R.range(-0.25, 0.25), dist: R.range(0.9, 1.0), radius: R.range(0.14, 0.22) }));
  // cells without a regenerable outline (e.g. polygonal healthy cells) bleb via a polar resample
  let regen = info.regen;
  if (!regen && info.outline && mem) {
    const pts = info.outline;
    const radAt = (th) => {
      const hit = rayHit(pts, th);
      return Math.hypot(hit.x, hit.y);
    };
    const base = Array.from({ length: 72 }, (_, i) => radAt((i / 72) * TAU));
    const rf = (th) => {
      const f = (wrapAngleLocal(th) / TAU) * 72;
      const i0 = Math.floor(f) % 72, i1 = (i0 + 1) % 72;
      return lerp(base[i0], base[i1], f - Math.floor(f));
    };
    regen = (t, extra) => {
      const rr = (th) => {
        let v = rf(th);
        for (const b of (extra && extra.blebs) || []) {
          const D = b.dist * r, rad = b.radius * r;
          const dA = Math.atan2(Math.sin(th - b.angle), Math.cos(th - b.angle));
          const sN = D * Math.sin(dA);
          if (Math.abs(sN) <= rad && Math.cos(dA) > 0) v = Math.max(v, D * Math.cos(dA) + Math.sqrt(rad * rad - sN * sN));
        }
        return v;
      };
      return { d: smoothPath(polarPoints(rr, 72)) };
    };
  }
  let current = 0;
  const setOp = (node, v) => { if (v >= 0.999) node.removeAttribute('opacity'); else node.setAttribute('opacity', n(v)); };
  const apply = (p, { remnants = true } = {}) => {
    p = clamp(+p || 0, 0, 1);
    current = p;
    if (p <= 0) {
      // exact original look
      wrap.removeAttribute('transform');
      if (glow) glow.removeAttribute('opacity');
      fades.forEach((f) => f.removeAttribute('opacity'));
      if (mem) { mem.setAttribute('d', d0); mem.parentNode.removeAttribute('opacity'); }
      if (sheen) sheen.setAttribute('d', d0);
      if (veil) { veil.setAttribute('d', d0); veil.setAttribute('fill-opacity', 0); }
      nucleus.forEach((nu) => { nu.removeAttribute('transform'); nu.removeAttribute('opacity'); });
      frags.setAttribute('opacity', 0);
      for (const f of fragList) f.c.removeAttribute('transform');
      bodiesG.setAttribute('opacity', 0);
      for (const b of bodies) b.g.removeAttribute('transform');
      if (state0 == null) cell.removeAttribute('data-state'); else cell.setAttribute('data-state', state0);
      cell.removeAttribute('data-dying');
      return;
    }
    const p1 = clamp(p / 0.45, 0, 1);          // shrink + bleb + drain
    const p2 = clamp((p - 0.3) / 0.35, 0, 1);  // nucleus condenses → fragments
    const p3 = clamp((p - 0.65) / 0.35, 0, 1); // break apart
    wrap.setAttribute('transform', `scale(${n(lerp(1, 0.82, ease.inOutSine(p1)))})`);
    if (glow) setOp(glow, 1 - p1);
    fades.forEach((f) => setOp(f, 1 - p1));
    if (mem && regen) {
      const scaled = blebs.map((b) => ({ ...b, radius: b.radius * ease.outCubic(p1) }));
      const { d } = regen(0, { blebs: scaled });
      mem.setAttribute('d', d);
      if (veil) veil.setAttribute('d', d);
      if (sheen) sheen.setAttribute('d', d);
    }
    if (veil) veil.setAttribute('fill-opacity', n(0.45 * p1));
    nucleus.forEach((nu) => {
      nu.setAttribute('transform', `scale(${n(lerp(1, 0.62, ease.inOutSine(p2)))})`);
      setOp(nu, 1 - clamp((p2 - 0.55) / 0.45, 0, 1));
    });
    frags.setAttribute('opacity', n(clamp((p2 - 0.4) / 0.4, 0, 1) * (1 - p3)));
    for (const f of fragList) {
      const dd = f.d * ease.outCubic(p2);
      f.c.setAttribute('transform', `translate(${n(Math.cos(f.a) * dd)} ${n(Math.sin(f.a) * dd)})`);
    }
    if (mem) setOp(mem.parentNode, 1 - ease.inCubic(p3));
    bodiesG.setAttribute('opacity', n(ease.outCubic(p3) * (remnants ? 1 : 1 - clamp((p - 0.85) / 0.15, 0, 1))));
    for (const b of bodies) {
      const dd = lerp(b.d0, b.d1, ease.outCubic(p3));
      b.g.setAttribute('transform', `translate(${n(Math.cos(b.a) * dd)} ${n(Math.sin(b.a) * dd)}) scale(${n(lerp(0.6, 1, ease.outCubic(p3)))})`);
    }
    cell.setAttribute('data-state', p >= 1 ? 'dead' : 'apoptotic');
    cell.setAttribute('data-dying', n(p));
  };
  ctl = { apply, get p() { return current; } };
  DYING.set(cell, ctl);
  return ctl;
}

function wrapAngleLocal(a) { a %= TAU; return a < 0 ? a + TAU : a; }

/**
 * Seekable apoptosis — the stepper-safe way to kill a cell. p = 0 (healthy; exactly the
 * original drawing) → 1 (broken into apoptotic bodies). Pure function of p: no clock, no
 * internal loop, so Back / dot-jump / scrubbing always give identical frames.
 *   setDying(cell, 0.5)
 *   gsap.to(dyingState(cell), { p: 1, duration: 2.6, ease: 'none' })   // tween it
 *   tl.to(dyingState(cell), { p: 1, duration: 2.6 }, 'kill')           // in a timeline
 * options: { remnants: true } — false fades the apoptotic bodies out at the very end
 * (crowds); { seed } varies the fragment layout (fixed on first call).
 * Phases: 0–0.45 shrink, round blebs, color drains · 0.3–0.65 nucleus condenses then
 * fragments · 0.65–1 the cell breaks into a loose cluster of apoptotic bodies.
 * Works on every cell factory. data-state becomes 'apoptotic' (0<p<1) / 'dead' (p=1).
 */
export function setDying(cell, p, { remnants = true, seed = 1 } = {}) {
  if (!(p > 0) && !DYING.has(cell)) return null; // p = 0 on a fresh cell: leave it untouched
  const ctl = prepareDying(cell, seed);
  ctl.apply(p, { remnants });
  return ctl;
}

/** A tweenable proxy: gsap.to(dyingState(cell, { remnants }), { p: 1 }). */
export function dyingState(cell, opts = {}) {
  return {
    get p() { const c = DYING.get(cell); return c ? c.p : 0; },
    set p(v) { setDying(cell, v, opts); },
  };
}

// ---------------------------------------------------------------- necrosis (messy death)

const NECRO = new WeakMap();

function prepareNecrosis(cell, seed = 1) {
  let ctl = NECRO.get(cell);
  if (ctl) return ctl;
  const info = cellInfo(cell) || { r: 30, stage: 'dark', color: '#E9C9A1' };
  const R = rng(seed, 'necrosis');
  const r = info.rEff || info.r || 30;
  const stage = info.stage || 'dark';
  const S = stageOf(stage);
  const color = resolve(info.color || '#E9C9A1');
  const state0 = cell.getAttribute('data-state');
  const wrap = el('g', { 'data-part': 'necrosis' });
  while (cell.firstChild) wrap.appendChild(cell.firstChild);
  cell.appendChild(wrap);
  const { mem } = membranePaths(cell);
  const glow = wrap.querySelector(':scope > [data-part="glow"]');
  const nucleus = [...wrap.querySelectorAll('[data-part="nucleus"]')];
  const fades = [...wrap.querySelectorAll('[data-part="receptors"], [data-part="microvilli"], [data-part="sheen"], [data-part="ruffles"], [data-part="antigens"], [data-part="cytokines"], [data-part="antibodies"]')];
  const inner = [...wrap.querySelectorAll('[data-part="granules"], [data-part="cytoplasm"], [data-part="vacuoles"], [data-part="virions"], [data-part="er"], [data-part="golgi"]')];
  const fill0 = mem && mem.getAttribute('fill-opacity');
  if (mem) mem.setAttribute('pathLength', '100');
  const veil = mem ? el('path', { 'data-part': 'veil', d: mem.getAttribute('d'), fill: stage === 'light' ? '#F4F1EC' : '#59607A', 'fill-opacity': 0, 'pointer-events': 'none' }) : null;
  if (veil) mem.parentNode.appendChild(veil);
  // rupture sites and the contents that spill out of them
  const sites = Array.from({ length: 3 }, (_, i) => (i / 3) * TAU + R.range(0, TAU / 3));
  const spill = el('g', { 'data-part': 'spill', opacity: 0 });
  const bits = [];
  const bitFill = stage === 'light' ? mix(color, '#FFFFFF', 0.25) : mix(color, S.bg, 0.35);
  const bitStroke = stage === 'light' ? mix(color, S.ink, 0.45) : mix(color, '#FFFFFF', 0.25);
  for (let i = 0; i < 12; i++) {
    const a = sites[i % 3] + R.range(-0.35, 0.35);
    const br = r * R.range(0.05, 0.11);
    const rf = blobRadius({ r: br, seed: `${seed}d${i}`, irregularity: 1.2, kMax: 4 });
    const p = el('path', { d: smoothPath(polarPoints(rf, 9)), fill: bitFill, stroke: bitStroke, 'stroke-width': n(Math.max(0.4, r * 0.012)), 'stroke-opacity': 0.7 });
    spill.appendChild(p);
    bits.push({ node: p, a, d0: r * R.range(0.55, 0.85), d1: r * R.range(1.15, 1.9), rot: R.range(-90, 90) });
  }
  const sparks = [];
  for (let i = 0; i < 5; i++) {
    const a = sites[i % 3] + R.range(-0.3, 0.3);
    const s = dangerSpark({ size: Math.max(5, r * 0.18) * R.range(0.8, 1.2), stage });
    spill.appendChild(s);
    sparks.push({ node: s, a, d0: r * 0.8, d1: r * R.range(1.4, 2.2) });
  }
  cell.appendChild(spill);
  let current = 0;
  const setOp = (node, v) => { if (v >= 0.999) node.removeAttribute('opacity'); else node.setAttribute('opacity', n(v)); };
  const apply = (p) => {
    p = clamp(+p || 0, 0, 1);
    current = p;
    if (p <= 0) {
      wrap.removeAttribute('transform');
      if (glow) glow.removeAttribute('opacity');
      fades.concat(inner).forEach((f) => f.removeAttribute('opacity'));
      if (mem) {
        mem.removeAttribute('stroke-dasharray'); mem.removeAttribute('stroke-dashoffset');
        if (fill0 == null) mem.removeAttribute('fill-opacity'); else mem.setAttribute('fill-opacity', fill0);
        mem.parentNode.removeAttribute('opacity');
      }
      if (veil) veil.setAttribute('fill-opacity', 0);
      nucleus.forEach((nu) => { nu.removeAttribute('transform'); nu.removeAttribute('opacity'); });
      spill.setAttribute('opacity', 0);
      for (const b of bits) b.node.removeAttribute('transform');
      for (const s of sparks) s.node.removeAttribute('transform');
      if (state0 == null) cell.removeAttribute('data-state'); else cell.setAttribute('data-state', state0);
      cell.removeAttribute('data-necrosis');
      return;
    }
    const p1 = clamp(p / 0.4, 0, 1);          // swelling, paling
    const p2 = clamp((p - 0.3) / 0.4, 0, 1);  // membrane ruptures, contents spill
    const p3 = clamp((p - 0.6) / 0.4, 0, 1);  // nucleus dissolves, debris scatters
    wrap.setAttribute('transform', `scale(${n(lerp(1, 1.16, ease.outCubic(p1)))})`);
    if (glow) setOp(glow, 1 - p1);
    fades.forEach((f) => setOp(f, 1 - p1));
    inner.forEach((f) => setOp(f, 1 - 0.8 * p2));
    if (veil) veil.setAttribute('fill-opacity', n(0.38 * p1));
    if (mem) {
      const gap = 1 + 22 * ease.inOutSine(p2);       // three widening tears (pathLength = 100)
      const seg = (100 - 3 * gap) / 3;
      if (p2 > 0) { mem.setAttribute('stroke-dasharray', `${n(seg)} ${n(gap)}`); mem.setAttribute('stroke-dashoffset', n(((sites[0] / TAU) * 100) + gap / 2)); }
      else { mem.removeAttribute('stroke-dasharray'); mem.removeAttribute('stroke-dashoffset'); }
      mem.setAttribute('fill-opacity', n(lerp(fill0 == null ? 1 : +fill0, 0.3, p2)));
      setOp(mem.parentNode, 1 - 0.45 * p3);
    }
    nucleus.forEach((nu) => {
      nu.setAttribute('transform', `scale(${n(lerp(1, 1.08, p1))})`);
      setOp(nu, 1 - 0.85 * ease.inOutSine(clamp((p - 0.45) / 0.55, 0, 1)));
    });
    spill.setAttribute('opacity', n(clamp(p2 * 1.6, 0, 1)));
    for (const b of bits) {
      const dd = lerp(b.d0, b.d1, ease.outCubic(clamp((p - 0.35) / 0.65, 0, 1)));
      b.node.setAttribute('transform', `translate(${n(Math.cos(b.a) * dd)} ${n(Math.sin(b.a) * dd)}) rotate(${n(b.rot * p)})`);
    }
    for (const s of sparks) {
      const dd = lerp(s.d0, s.d1, ease.outCubic(clamp((p - 0.4) / 0.6, 0, 1)));
      s.node.setAttribute('transform', `translate(${n(Math.cos(s.a) * dd)} ${n(Math.sin(s.a) * dd)})`);
    }
    cell.setAttribute('data-state', p >= 1 ? 'dead' : 'necrotic');
    cell.setAttribute('data-necrosis', n(p));
  };
  ctl = { apply, get p() { return current; } };
  NECRO.set(cell, ctl);
  return ctl;
}

/**
 * Seekable NECROSIS — messy, inflammatory death (injury, a burst infected cell, oncolysis),
 * deliberately unlike tidy apoptosis: the cell SWELLS and pales, its membrane TEARS open in
 * three places, contents and danger sparks SPILL out, the nucleus dissolves.
 * setNecrotic(cell, p) — p 0 (intact; restores the original exactly) → 1 (ruptured remains).
 * Pure function of p (stepper-safe). Tween with gsap.to(necrosisState(cell), { p: 1 }).
 */
export function setNecrotic(cell, p, { seed = 1 } = {}) {
  if (!(p > 0) && !NECRO.has(cell)) return null;
  const ctl = prepareNecrosis(cell, seed);
  ctl.apply(p);
  return ctl;
}

/** Tweenable proxy for setNecrotic: gsap.to(necrosisState(cell), { p: 1, duration: 3 }). */
export function necrosisState(cell, opts = {}) {
  return {
    get p() { const c = NECRO.get(cell); return c ? c.p : 0; },
    set p(v) { setNecrotic(cell, v, opts); },
  };
}

/**
 * Programmed cell death as a self-running one-shot (uses setDying under the hood).
 * apoptosis(cell, { duration:2800, remove:false, onComplete })  (alias: kill)
 * NOT stepper-safe (it owns a clock) — in steppers/timelines tween dyingState() instead.
 * Reduced motion → jumps straight to the end state.
 */
export function apoptosis(cell, { duration = 2800, remove = false, onComplete = null, seed = 1 } = {}) {
  const finish = () => {
    if (remove) cell.remove();
    onComplete && onComplete();
  };
  if (prefersReducedMotion()) {
    setDying(cell, 1, { remnants: !remove, seed });
    finish();
    return inert();
  }
  const from = DYING.has(cell) ? DYING.get(cell).p : 0;
  const anim = {
    tick(t) {
      const q = clamp((t * 1000) / duration, 0, 1);
      setDying(cell, lerp(from, 1, q), { remnants: !remove, seed });
      if (q >= 1) { anim.handle.stop(); finish(); }
    },
  };
  return start(anim, cell);
}

/** Alias for apoptosis — the visible result of a killer T cell or NK cell attack. */
export const kill = apoptosis;

// ---------------------------------------------------------------- GSAP interop

/**
 * transformOrigin that pins an art element's own (0,0) — a cell's centre or a molecule's
 * membrane anchor — for GSAP tweens (GSAP's SVG default is the bbox's top-left corner):
 *   gsap.to(glyph, { scale: 1.4, rotation: '+=15', transformOrigin: anchorOrigin(glyph) })
 * Compute it once, before the tween (the bbox changes as the element animates).
 */
export function anchorOrigin(node) {
  try {
    const b = node.getBBox();
    return `${-b.x}px ${-b.y}px`;
  } catch (e) {
    return '50% 50%';
  }
}
