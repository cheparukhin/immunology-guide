// shared/hero-kit.js — the frame every chapter hero vignette is built on (owner: H).
//
//   import { heroScene, HERO_R } from './shared/hero-kit.js';
//   export default function mount(fig, ctx) {
//     return heroScene(ctx, {
//       seed: 4,
//       draw(api)  { … build cells around (api.cx, api.cy) … },
//       events: [{ every: [22, 34], first: 5, run(api) { … one quiet event … } }],
//       still(api) { … the key moment, for reduced motion … },
//     });
//   }
//
// What it does for you (docs/shared/hero-kit.md):
//   • one decorative (aria-hidden) SVG with a 600-unit-wide viewBox matched to the stage's aspect:
//     600 × 600 in the round desktop lens, 600 × 300 in the phone band (no letterboxing);
//   • the shared background (tissueField: fibres, defocused ghosts, dust) so every hero matches;
//   • a scheduler on the scene clock: events fire only while the hero is visible and the tab is
//     shown, never under reduced motion; `after()` for sequencing inside an event;
//   • lifecycle: art helpers (`api.track`) and short-lived GSAP timelines (`api.play`) pause
//     off-screen and stop on rebuild/destroy; rebuilds on resize (lens ↔ band) and theme change;
//   • reduced motion: draw() then still() — a single composed key moment, no loops.

import { tissueField, rng, antibodyTips, HEAD_Y } from '../../art/index.js';
import { rig as makeRig } from './cell-actions.js';

/** Consistent cell scale across all heroes (scene units; the lens is 600 wide). */
export const HERO_R = Object.freeze({
  lymphocyte: 30, tCell: 30, bCell: 31, nk: 33, neutrophil: 36, mast: 34, plasma: 40,
  healthy: 50, cancer: 54, macrophage: 104, dendritic: 124, fibroblast: 120,
});

const SVG_NS = 'http://www.w3.org/2000/svg';

/**
 * Build an ambient hero scene.
 * opts: { seed, draw(api), events:[{ every:[min,max]|sec, first, run(api) }], still(api),
 *         frame(t, dt, api), background: 'tissue' | false | (api) => node, density, tint }
 * Returns the figure api ({ destroy, pause, resume }) — return it from mount().
 */
export function heroScene(ctx, opts = {}) {
  const svg = ctx.createSVG({ viewBox: '0 0 600 600' });
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.classList.add('hero-scene');
  const long = new Set();       // art helpers (breathe, drift, crawl…) for this build
  const short = new Set();      // short-lived timelines/handles (events)
  let timers = [];
  let clock = 0;
  let paused = false;
  let lastKey = '';
  let api = null;

  // one tracked handle that pauses/resumes every short-lived timeline with the figure
  ctx.track({
    pause() { paused = true; short.forEach((h) => h.pause && h.pause()); },
    resume() { paused = false; short.forEach((h) => h.resume && h.resume()); },
    stop() { short.forEach(stopHandle); short.clear(); },
  });

  function stopHandle(h) {
    try { if (h.stop) h.stop(); else if (h.kill) h.kill(); } catch (e) { /* already gone */ }
  }
  const pick = (v, R) => (Array.isArray(v) ? R.range(v[0], v[1]) : v);

  const loop = ctx.loop((dt) => {
    clock += dt;
    // prune finished timelines
    for (const h of short) {
      if (typeof h.progress === 'function' && h.progress() >= 1 && !(h.isActive && h.isActive())) short.delete(h);
      else if (h.running === false && typeof h.progress !== 'function') short.delete(h);
    }
    for (const t of timers.slice()) {
      if (clock < t.next) continue;
      if (t.period == null) timers = timers.filter((x) => x !== t);
      else t.next = clock + pick(t.period, t.R);
      try { t.fn(api); } catch (e) { console.error(`[figure ${ctx.id}] hero event failed`, e); }
    }
    if (opts.frame && api) opts.frame(clock, dt, api);
  });

  function build({ width, height }) {
    const W = 600;
    const H = Math.max(240, Math.round((W * Math.max(1, height)) / Math.max(1, width)));
    const stage = ctx.artStage;
    const key = `${H}|${stage}`;
    if (key === lastKey) return;
    lastKey = key;
    // tear down the previous build
    long.forEach(stopHandle); long.clear();
    short.forEach(stopHandle); short.clear();
    timers = [];
    for (const n of [...svg.children]) if (n !== svg.defs) n.remove();
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    const mk = (name) => { const g = document.createElementNS(SVG_NS, 'g'); g.setAttribute('data-layer', name); svg.appendChild(g); return g; };
    const back = mk('back'), main = mk('main'), front = mk('front');
    const R = rng(opts.seed ?? 1, `hero-${ctx.id}`);
    const band = H < W * 0.75;
    const ky = Math.max(0.5, Math.min(1, H / W));
    api = {
      svg, back, main, front, W, H, cx: W / 2, cy: H / 2, R: Math.min(W, H) / 2, band, ky, stage,
      /** size multiplier: 1 in the lens, smaller in the phone band */
      k: band ? 0.7 : 1,
      rng: R, reduced: !!ctx.reducedMotion,
      get time() { return clock; },
      /** x / y from lens offsets (dy is compressed in the phone band so subjects stay in frame). */
      X: (dx) => W / 2 + dx,
      Y: (dy) => H / 2 + dy * ky,
      put(node, x, y, parent = api.main) {
        node.setAttribute('transform', `translate(${Math.round(x * 10) / 10} ${Math.round(y * 10) / 10})`);
        parent.appendChild(node);
        return node;
      },
      rig(art, { x = W / 2, y = H / 2, parent = api.main, ...rest } = {}) { return makeRig(art, { x, y, parent, ...rest }); },
      /** long-lived art helper (breathe, drift, crawl, jitter): paused off-screen, stopped on rebuild */
      track(h) { if (h) { long.add(h); ctx.track(h); } return h; },
      /** short-lived handle (a run.* twin, a gsap timeline, glowPulse…) */
      play(h) { if (h) { short.add(h); if (paused && h.pause) h.pause(); } return h; },
      /** fn(api) after `sec` seconds of visible scene time */
      after(sec, fn) { timers.push({ next: clock + sec, period: null, fn, R }); },
      /** fn(api) every `sec` (or [min,max]) seconds of visible scene time */
      every(sec, fn, { first } = {}) { timers.push({ next: clock + (first ?? pick(sec, R)), period: sec, fn, R }); },
      gsap: ctx.gsap,
      /**
       * Crossfade the whole foreground back to a freshly drawn initial scene (for vignettes
       * that cycle): fades `main` out, stops this build's handles, calls draw() again, fades in.
       */
      refresh({ fade = 2.4 } = {}) {
        const g = ctx.gsap;
        const old = api.main;
        api.play(g.to(old, { opacity: 0, duration: fade / 2, ease: 'sine.inOut' }));
        api.after(fade / 2 + 0.05, () => {
          long.forEach(stopHandle); long.clear();
          for (const h of [...short]) { stopHandle(h); short.delete(h); }
          const fresh = document.createElementNS(SVG_NS, 'g');
          fresh.setAttribute('data-layer', 'main');
          fresh.setAttribute('opacity', '0');
          old.replaceWith(fresh);
          api.main = fresh;
          api.front.replaceChildren();
          opts.draw && opts.draw(api);
          api.play(g.to(fresh, { opacity: 1, duration: fade / 2, ease: 'sine.inOut' }));
        });
      },
    };
    // background
    if (opts.background !== false) {
      const bg = typeof opts.background === 'function'
        ? opts.background(api)
        : tissueField({ width: W, height: H, seed: (opts.seed ?? 1) + 101, stage, density: opts.density ?? 0.85, tint: opts.tint });
      if (bg) back.appendChild(bg);
    }
    opts.draw && opts.draw(api);
    if (ctx.reducedMotion) {
      opts.still && opts.still(api);
    } else {
      for (const ev of opts.events || []) {
        timers.push({ next: clock + (ev.first ?? 4), period: ev.every ?? [22, 34], fn: ev.run, R });
      }
    }
  }

  ctx.onResize(build);
  ctx.onThemeChange(() => { lastKey = ''; build({ width: ctx.width, height: ctx.height }); });
  return {
    destroy() { long.forEach(stopHandle); short.forEach(stopHandle); loop.pause(); },
  };
}

// ------------------------------------------------------------------ pose helpers
// A "pose" is { x, y, a } (scene units, degrees) written as `translate(x y) rotate(a)`.

/** Current pose of a node from its transform attribute. */
export function poseOf(node) {
  const t = node.transform && node.transform.baseVal;
  const m = t && t.numberOfItems ? t.consolidate().matrix : null;
  return m ? { x: m.e, y: m.f, a: (Math.atan2(m.b, m.a) * 180) / Math.PI } : { x: 0, y: 0, a: 0 };
}
export function setPose(node, p) {
  node.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${(p.a || 0).toFixed(1)})`);
  return node;
}
/** Pose (in `frame`'s coordinates) of the point (lx, ly) of `node`'s local frame, with node's rotation. */
export function poseIn(node, frame, lx = 0, ly = 0) {
  const M = frame.getCTM().inverse().multiply(node.getCTM());
  return { x: M.a * lx + M.c * ly + M.e, y: M.b * lx + M.d * ly + M.f, a: (Math.atan2(M.b, M.a) * 180) / Math.PI };
}
/** Glide `node` to pose `to` (shortest turn), as a short-lived hero timeline. */
export function glide(api, node, to, { duration = 4, ease = 'sine.inOut', scale, opacity, onComplete } = {}) {
  const from = poseOf(node);
  let da = (((to.a ?? from.a) - from.a + 540) % 360) - 180;
  const st = { ...from, s: 1, o: +(node.getAttribute('opacity') ?? 1) };
  const write = () => {
    node.setAttribute('transform', `translate(${st.x.toFixed(1)} ${st.y.toFixed(1)}) rotate(${st.a.toFixed(1)})${st.s !== 1 ? ` scale(${st.s.toFixed(3)})` : ''}`);
    if (opacity != null) node.setAttribute('opacity', st.o.toFixed(3));
  };
  return api.play(api.gsap.to(st, {
    x: to.x, y: to.y, a: from.a + da, s: scale ?? 1, o: opacity ?? st.o, duration, ease, onUpdate: write, onComplete,
  }));
}

/**
 * Pose for a drug antibody (anchor 'base', size abSize) that caps the head of `glyph` (a membrane
 * glyph of size glyphSize, kind = its data-mol, e.g. 'pd1', 'antigen') with one arm tip, Fc pointing
 * away (FIGURE-AUDIT rule 9). Returns { x, y, a } in `frame` coordinates — feed it to glide().
 */
export function capPose(glyph, frame, { glyphSize, abSize, arm = 'right', headY } = {}) {
  const kind = glyph.getAttribute('data-mol') || 'antigen';
  const hy = headY ?? (HEAD_Y[kind] ?? -0.95) * glyphSize;
  const H = poseIn(glyph, frame, 0, hy);
  const out = H.a - 90;                                  // glyph "up" (-y) in frame degrees
  const tips = antibodyTips(abSize);
  const [tx, ty] = tips[arm] || tips.right;
  const hx = 0.035 * abSize * (arm === 'left' ? -1 : 1), hyA = -0.485 * abSize;
  const alpha = (Math.atan2(ty - hyA, tx - hx) * 180) / Math.PI;
  const psi = out + 180 - alpha;
  const c = Math.cos((psi * Math.PI) / 180), si = Math.sin((psi * Math.PI) / 180);
  return { x: H.x - (c * tx - si * ty), y: H.y - (si * tx + c * ty), a: psi };
}

/** Stop a drift() handle without the snap back: the node keeps its current drifted pose. */
export function settle(node, handle) {
  const p = poseOf(node);
  if (handle) handle.stop();
  setPose(node, p);
  return p;
}
