// home-hero — the ambient scene behind the home page title.
//
// A calm microscope view of tissue. Killer T cells crawl between healthy
// cells, now and then pausing against one to check its shop window (and
// moving on: self). Every half-minute or so, one healthy cell turns into a
// cancer cell whose shop window shows unfamiliar (hot-pink) fragments. The
// nearest T cell finds it, a recognition glow blooms at the contact, and the
// cancer cell quietly dies by apoptosis. Its fragments fade, the tissue
// heals, and the patrol goes on.
//
// Composition: the stage holds three SVG layers, each on its own compositing
// layer so that moving T cells never force the rest to repaint:
//   back — defocused tissue (static, blurred)
//   mid  — the in-focus healthy cells (static except when a site changes)
//   live — cancer cell, recognition glow, T cells (redrawn every frame)
// The in-focus "focal zone" sits beside the hero text on wide screens and
// above it on tall ones; the page tells us which via --hero-layout.
//
// Motion runs in one ctx.loop (paused off-screen and in hidden tabs). Under
// reduced motion the figure shows a single still — the moment of recognition —
// and a Play button lets the reader start the animation if they want it.
import { tCell, cancerCell, healthyCell, tissueField, cellInfo, blurFilter, apoptosis, rng, inlineDefs } from '../art/index.js';

const TAU = Math.PI * 2;
const DEG = 180 / Math.PI;

// Sizes in scene units (≈ CSS px on a laptop; scaled up on phones so cells stay small).
const R_HEALTHY = 46;
const R_CANCER = 62;
const R_TCELL = 25;

const ease = {
  inOut: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  out: (t) => 1 - Math.pow(1 - t, 3),
  sine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
};
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const wrapA = (a) => Math.atan2(Math.sin(a), Math.cos(a));
const f1 = (v) => (Math.round(v * 10) / 10).toString();

export default function mount(fig, ctx) {
  const hero = fig.closest('.home-hero');
  const textEl = hero ? hero.querySelector('.home-hero__text') : null;
  const svgNS = 'http://www.w3.org/2000/svg';

  const layers = {
    back: ctx.createSVG({ className: 'home-hero__layer home-hero__layer--back' }),
    mid: ctx.createSVG({ className: 'home-hero__layer home-hero__layer--mid' }),
    live: ctx.createSVG({ className: 'home-hero__layer home-hero__layer--live' }),
    front: ctx.createSVG({ className: 'home-hero__layer home-hero__layer--front' }),
  };
  for (const s of Object.values(layers)) s.setAttribute('preserveAspectRatio', 'xMidYMid slice');
  // The defocused layers never change between rebuilds, so they are drawn once
  // into bitmaps: blur filters then cost nothing while the T cells move.
  const flat = {
    back: ctx.h('canvas', { class: 'home-hero__layer home-hero__layer--back', 'aria-hidden': 'true' }),
    front: ctx.h('canvas', { class: 'home-hero__layer home-hero__layer--front', 'aria-hidden': 'true' }),
  };
  layers.back.before(flat.back);
  layers.front.before(flat.front);
  let flatToken = 0;

  // Paints shared by every rebuild.
  const c = ctx.colors;
  const paint = {
    glow: ctx.radialGradient(layers.live, [[0, '#FFFFFF', 0.95], [0.28, '#BFD6FF', 0.75], [0.62, c.cd8, 0.28], [1, c.cd8, 0]]),
    hit: ctx.radialGradient(layers.live, [[0, '#FFFFFF', 1], [0.5, '#BFD6FF', 0.9], [1, c.cd8, 0]]),
  };

  let W = 0, H = 0, k = 1, tall = false;
  let world = null;
  let loop = null;
  let userPaused = false;
  let lastKey = '';
  const handles = new Set();        // art-library animations (apoptosis) to pause with the loop

  // ------------------------------------------------------------------ layout
  function measure(width, height) {
    const mode = hero ? getComputedStyle(hero).getPropertyValue('--hero-layout').trim() : '';
    tall = mode ? mode === 'tall' : width / height < 1.1;
    // Scene units per CSS px: cells keep a pleasant size from phones to wide screens.
    k = tall ? clamp(1000 / width, 1, 1.75) : clamp(1280 / width, 0.78, 1.75);
    W = Math.round(width * k);
    H = Math.round(height * k);
    const st = ctx.stage.getBoundingClientRect();
    const tr = textEl ? textEl.getBoundingClientRect() : null;
    let F;
    if (!tall) {
      const textRight = tr && tr.width ? (tr.right - st.left) * k : W * 0.45;
      const x0 = Math.min(textRight + 30 * k, W * 0.62);
      F = { x: (x0 + W) / 2, y: H * 0.5, ax: Math.max(180, (W - x0) / 2) * 0.98, ay: H * 0.47 };
    } else {
      const textTop = tr && tr.height ? (tr.top - st.top) * k : H * 0.5;
      const y1 = Math.max(H * 0.36, textTop - 10 * k);
      F = { x: W / 2, y: y1 * 0.5 + 8, ax: W * 0.56, ay: y1 * 0.5 + 6 };
    }
    return F;
  }
  const ell = (F, x, y) => Math.hypot((x - F.x) / F.ax, (y - F.y) / F.ay);

  // ------------------------------------------------------------------ build
  function clear() {
    for (const h of handles) h.stop();
    handles.clear();
    for (const s of Object.values(layers)) for (const ch of [...s.children]) if (ch !== s.defs) ch.remove();
  }

  function build(width, height) {
    clear();
    const F = measure(width, height);
    for (const s of Object.values(layers)) s.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const R = rng(23, 'home-hero');
    const g = (parent, attrs = {}) => { const e = document.createElementNS(svgNS, 'g'); for (const [a, v] of Object.entries(attrs)) e.setAttribute(a, v); parent.appendChild(e); return e; };

    // --- backdrop: tissue texture + defocused cells, dimmer with distance from focus
    layers.back.appendChild(tissueField({ width: W, height: H, seed: 31, density: 0.85 }));
    const near = g(layers.back, { filter: blurFilter(2.2), opacity: 0.62 });
    const far = g(layers.back, { filter: blurFilter(4.5), opacity: 0.4 });

    // Poisson-ish scatter over the whole stage (a little beyond its edges).
    const pts = [];
    const pad = 60;
    for (let i = 0; i < 4000 && pts.length < 140; i++) {
      const x = R.range(-pad, W + pad), y = R.range(-pad, H + pad);
      const d = ell(F, x, y);
      const r = R_HEALTHY * R.range(0.9, 1.1) * (d < 1 ? 1 : R.range(0.8, 1.05));
      const minD = r * (d < 1 ? R.range(2.7, 3.6) : R.range(3.0, 4.2));
      if (pts.every((p) => Math.hypot(p.x - x, p.y - y) > Math.max(minD, p.minD))) pts.push({ x, y, r, d, minD });
    }

    const healthy = [];
    for (const p of pts) {
      const seed = 100 + healthy.length + pts.indexOf(p);
      if (p.d < 1) {
        const outer = g(layers.mid, { transform: `translate(${f1(p.x)} ${f1(p.y)})`, opacity: f1(clamp(1.12 - p.d * 0.42, 0.62, 1)) });
        const node = healthyCell({ r: p.r, seed, mhc: 8 });
        outer.appendChild(node);
        healthy.push({ x: p.x, y: p.y, r: p.r, d: p.d, seed, outer, node, baseOpacity: +outer.getAttribute('opacity'), busy: false });
      } else {
        const node = healthyCell({ r: p.r, seed, detail: p.d < 1.5 ? 'high' : 'low', mhc: p.d < 1.5 ? 6 : false });
        node.setAttribute('transform', `translate(${f1(p.x)} ${f1(p.y)})`);
        if (p.d < 1.45) { node.setAttribute('opacity', f1(clamp(1.4 - p.d * 0.5, 0.35, 0.8))); near.appendChild(node); }
        else { node.setAttribute('opacity', f1(clamp(1.3 - p.d * 0.35, 0.25, 0.7))); far.appendChild(node); }
      }
    }

    // --- foreground bokeh: a few big, very defocused cells near the edges (depth)
    const fg = g(layers.front, { filter: blurFilter(9), opacity: 0.42 });
    const spots = tall
      ? [[W * 0.02, H * 0.05, 1.9], [W * 1.0, H * 0.34, 1.5]]
      : [[W * 0.985, H * 0.02, 2.4], [W * 0.6, H * 1.03, 1.9], [W * 1.01, H * 0.66, 1.4]];
    spots.forEach(([x, y, s], i) => {
      const node = healthyCell({ r: R_HEALTHY * s, seed: 300 + i, detail: 'low', mhc: false });
      node.setAttribute('transform', `translate(${f1(x)} ${f1(y)})`);
      fg.appendChild(node);
    });

    // --- sites where cancer will appear: in-focus cells near the middle, spread apart
    const candidates = healthy.filter((h) => h.d < 0.62).sort((a, b) => a.d - b.d);
    const sites = [];
    for (const h of candidates) {
      if (sites.length >= 3) break;
      if (sites.every((s) => Math.hypot(s.x - h.x, s.y - h.y) > R_HEALTHY * 4)) sites.push(h);
    }
    if (!sites.length && healthy.length) sites.push(healthy[0]);

    // --- live layer
    const cancerLayer = g(layers.live);
    const fxLayer = g(layers.live);
    const tLayer = g(layers.live);

    const fx = {
      root: g(fxLayer, { opacity: 0 }),
    };
    fx.core = ctx.svg('circle', { r: 44, fill: paint.glow }, fx.root);
    fx.ring = ctx.svg('circle', { r: 20, fill: 'none', stroke: '#CFE0FF', strokeWidth: 2, opacity: 0 }, fx.root);
    fx.ring2 = ctx.svg('circle', { r: 20, fill: 'none', stroke: '#CFE0FF', strokeWidth: 1.4, opacity: 0 }, fx.root);
    fx.hits = Array.from({ length: 6 }, () => ctx.svg('circle', { r: 2.6, fill: paint.hit, opacity: 0 }, fxLayer));

    // T cells: one hunter (the first) + patrollers.
    const nT = tall ? 3 : 4;
    const tcells = [];
    const site0 = sites[0];
    const dock0 = site0 ? dockFor(site0, R_CANCER, healthy, F, tall ? -Math.PI / 2 + 0.9 : Math.PI * 0.85) : null;
    for (let i = 0; i < nT; i++) {
      const seed = 7 + i * 13;
      const outer = g(tLayer);
      const node = tCell({ variant: 'cd8', state: 'activated', r: R_TCELL * R.range(0.94, 1.06), polarity: 0, seed });
      outer.appendChild(node);
      const info = cellInfo(node);
      const mem = node.querySelector('[data-part="membrane"] > path');
      const sheenEl = node.querySelector('[data-part="sheen"] > path');
      const t = {
        i, outer, node, info, mem, sheen: sheenEl && mem && sheenEl.getAttribute('d') === mem.getAttribute('d') ? sheenEl : null,
        rEff: info.rEff || R_TCELL * 1.18, x: 0, y: 0, heading: 0, wander: 0,
        mode: 'patrol', target: null, timer: R.range(3, 9), phase: R.range(0, TAU), jitter: R.range(0, 100),
        speedK: R.range(0.85, 1.12), lastMem: -1,
      };
      tcells.push(t);
    }
    // Place: hunter near the first site, patrollers spread through the focal zone.
    const placed = [];
    tcells.forEach((t, i) => {
      if (i === 0 && dock0) {
        t.x = dock0.x; t.y = dock0.y; t.heading = dock0.face;
      } else {
        let best = null;
        for (let k2 = 0; k2 < 60; k2++) {
          const a = R.range(0, TAU), rr = Math.sqrt(R.range(0.05, 0.75));
          const x = F.x + Math.cos(a) * F.ax * rr, y = F.y + Math.sin(a) * F.ay * rr;
          const sep = Math.min(...placed.map((p) => Math.hypot(p.x - x, p.y - y)), dock0 ? Math.hypot(dock0.x - x, dock0.y - y) * 0.8 : 1e9);
          const onCell = Math.min(...healthy.map((h) => Math.hypot(h.x - x, h.y - y) - h.r));
          const score = Math.min(sep, 400) + Math.min(onCell, 30) * 2;
          if (!best || score > best.score) best = { x, y, score };
        }
        t.x = best.x; t.y = best.y;
        t.heading = R.range(0, TAU);
      }
      t.wander = t.heading;
      placed.push(t);
    });

    world = { F, healthy, sites, siteIdx: 0, tcells, cancerLayer, fx, cancer: null, cycle: null, regrow: [], time: 0, R };
    // The still frame (also the reduced-motion composition): recognition at site 0.
    if (site0) {
      spawnCancer(site0, 1);
      site0.outer.setAttribute('opacity', '0');
      site0.busy = true;
      world.cycle = { phase: 'still', t: 0, site: site0, hunter: tcells[0], dock: dock0 };
      tcells[0].mode = 'engaged';
      tcells[0].target = dock0;
      setGlow(dock0.cx, dock0.cy, 0.9, 0.5, 58);
    }
    tcells.forEach(renderT);
    world.lastRender = 0;

    // Bitmap the static, blurred layers (keep the SVGs visible until the bitmaps are ready).
    const token = ++flatToken;
    for (const name of ['back', 'front']) {
      layers[name].style.display = '';
      flat[name].style.visibility = 'hidden';
      flatten(name, width, height, token);
    }
  }

  /** Rasterize a static SVG layer into its canvas, then hide the SVG. */
  async function flatten(name, widthPx, heightPx, token) {
    const svgEl = layers[name], cv = flat[name];
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const pw = Math.max(1, Math.round(widthPx * dpr)), ph = Math.max(1, Math.round(heightPx * dpr));
    try {
      const clone = svgEl.cloneNode(true);
      clone.setAttribute('xmlns', svgNS);
      clone.setAttribute('width', pw);
      clone.setAttribute('height', ph);
      clone.removeAttribute('class');
      clone.removeAttribute('style');
      inlineDefs(clone);
      const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)], { type: 'image/svg+xml' }));
      const img = new Image();
      img.src = url;
      try { await img.decode(); } finally { URL.revokeObjectURL(url); }
      if (token !== flatToken) return;
      cv.width = pw; cv.height = ph;
      cv.getContext('2d').drawImage(img, 0, 0, pw, ph);
      cv.style.visibility = '';
      svgEl.style.display = 'none';
    } catch (err) {
      // Keep the live SVG version if rasterizing fails; it only costs speed.
      if (token === flatToken) { svgEl.style.display = ''; cv.style.visibility = 'hidden'; }
    }
  }

  // Where a T cell should sit to touch a cell at `site` (radius rc): the free
  // direction (away from neighbours) closest to `prefer`.
  function dockFor(site, rc, healthy, F, prefer) {
    const reach = rc * 1.27 + R_TCELL * 1.18 + 2;
    let best = null;
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * TAU;
      const x = site.x + Math.cos(a) * reach, y = site.y + Math.sin(a) * reach;
      let clearance = 1e9;
      for (const h of healthy) if (h !== site) clearance = Math.min(clearance, Math.hypot(h.x - x, h.y - y) - h.r);
      const inside = ell(F, x, y);
      const score = Math.min(clearance, 60) - Math.abs(wrapA(a - prefer)) * 14 - Math.max(0, inside - 0.95) * 200;
      if (!best || score > best.score) best = { a, x, y, score };
    }
    const cx = site.x + Math.cos(best.a) * (rc * 1.12), cy = site.y + Math.sin(best.a) * (rc * 1.12);
    return { x: best.x, y: best.y, face: wrapA(best.a + Math.PI), cx, cy, a: best.a };
  }

  function spawnCancer(site, opacity) {
    const outer = document.createElementNS(svgNS, 'g');
    const node = cancerCell({
      r: R_CANCER, seed: 40 + site.seed, mhc: 10,
      peptides: ['self', 'neo', 'self', 'self', 'neo', 'self', 'self', 'self', 'neo', 'self'],
    });
    outer.appendChild(node);
    world.cancerLayer.appendChild(outer);
    const info = cellInfo(node);
    const mem = node.querySelector('[data-part="membrane"] > path');
    const sh = node.querySelector('[data-part="sheen"] > path');
    world.cancer = {
      site, outer, node, info, mem, sheen: sh && mem && sh.getAttribute('d') === mem.getAttribute('d') ? sh : null,
      dying: false, scale: 1, opacity, lastMem: -1,
    };
    setCancer(1, opacity);
    return world.cancer;
  }
  function setCancer(scale, opacity) {
    const ca = world.cancer;
    if (!ca) return;
    ca.scale = scale; ca.opacity = opacity;
    ca.outer.setAttribute('transform', `translate(${f1(ca.site.x)} ${f1(ca.site.y)}) scale(${scale.toFixed(3)})`);
    ca.outer.setAttribute('opacity', opacity.toFixed(3));
  }
  function setGlow(x, y, core, ring, ringR) {
    const fx = world.fx;
    fx.root.setAttribute('transform', `translate(${f1(x)} ${f1(y)})`);
    fx.root.setAttribute('opacity', '1');
    fx.core.setAttribute('opacity', core.toFixed(3));
    fx.ring.setAttribute('r', f1(ringR));
    fx.ring.setAttribute('opacity', ring.toFixed(3));
  }
  function hideGlow() {
    world.fx.root.setAttribute('opacity', '0');
    world.fx.hits.forEach((h) => h.setAttribute('opacity', '0'));
  }

  function renderT(t) {
    t.outer.setAttribute('transform', `translate(${f1(t.x)} ${f1(t.y)}) rotate(${f1(t.heading * DEG)})`);
  }

  // ------------------------------------------------------------------ motion
  const noise = (x) => (Math.sin(x * 1.7) + 0.6 * Math.sin(x * 0.73 + 1.3) + 0.4 * Math.sin(x * 2.9 + 0.4)) / 2;

  function obstacles() {
    const list = world.healthy.filter((h) => !(world.cancer && h === world.cancer.site && h.busy));
    if (world.cancer && !world.cancer.dying) list.push({ x: world.cancer.site.x, y: world.cancer.site.y, r: R_CANCER * 1.1, cancer: true });
    return list;
  }

  function stepT(t, dt, time, obs) {
    const F = world.F;
    t.timer -= dt;
    let vx = 0, vy = 0;
    let speed = 19 * t.speedK;
    let turn = 0.9;
    let arrive = null;

    if (t.mode === 'patrol' || t.mode === 'leave') {
      t.wander += noise(time * 0.11 + t.jitter) * 0.9 * dt;
      vx = Math.cos(t.wander); vy = Math.sin(t.wander);
      if (t.mode === 'leave' && t.timer <= 0) { t.mode = 'patrol'; t.timer = 4 + world.R.range(2, 6); }
      if (t.mode === 'patrol' && t.timer <= 0) startInspect(t, obs);
    } else if (t.mode === 'inspect-go' || t.mode === 'seek') {
      arrive = t.target;
      vx = arrive.x - t.x; vy = arrive.y - t.y;
      const L = Math.hypot(vx, vy) || 1;
      vx /= L; vy /= L;
      if (t.mode === 'seek') { speed = 34; turn = 1.6; }
      else turn = 1.2;
      if (t.mode === 'inspect-go' && t.timer <= -14) { t.mode = 'patrol'; t.timer = 5; }
    } else if (t.mode === 'inspect' || t.mode === 'engaged') {
      speed = 0;
      const want = t.target.face;
      t.heading += clamp(wrapA(want - t.heading), -dt * 1.2, dt * 1.2);
      if (t.mode === 'inspect' && t.timer <= 0) {
        t.mode = 'leave';
        t.wander = t.target.face + Math.PI + world.R.range(-0.9, 0.9);
        t.timer = 3;
        t.target.cell.busy = false;
        t.target = null;
      }
      return;
    }

    // Soft avoidance: other cells (healthy, cancer) and other T cells.
    const near = arrive ? Math.hypot(arrive.x - t.x, arrive.y - t.y) : 1e9;
    const avoidK = near < 90 ? 0.15 : 1;
    for (const o of obs) {
      if (arrive && o === arrive.cell) continue;
      if (arrive && arrive.cancer && o.cancer) continue;
      const dx = t.x - o.x, dy = t.y - o.y;
      const dist = Math.hypot(dx, dy) || 1;
      // Patrollers give a live cancer cell a wide berth: in this story only the hunter finds it.
      const reach = o.cancer ? (o.r + t.rEff + 46) * 1.4 : (o.r + t.rEff + 14) * 1.25;
      if (dist < reach) {
        const w = Math.pow((reach - dist) / reach, 2) * 2.4 * avoidK;
        vx += (dx / dist) * w; vy += (dy / dist) * w;
      }
    }
    for (const o of world.tcells) {
      if (o === t) continue;
      const dx = t.x - o.x, dy = t.y - o.y;
      const dist = Math.hypot(dx, dy) || 1;
      const reach = (t.rEff + o.rEff) * 1.9;
      if (dist < reach) { const w = Math.pow((reach - dist) / reach, 2) * 3; vx += (dx / dist) * w; vy += (dy / dist) * w; }
    }
    // Stay within the focal zone (gently).
    const ex = (t.x - F.x) / F.ax, ey = (t.y - F.y) / F.ay;
    const d = Math.hypot(ex, ey);
    if (d > 0.72) {
      const w = (d - 0.72) * 4;
      vx -= (ex / d) * w; vy -= (ey / d) * w;
      if (!arrive) t.wander += clamp(wrapA(Math.atan2(-ey, -ex) - t.wander), -1, 1) * dt * 0.8;
    }

    const want = Math.atan2(vy, vx);
    t.heading += clamp(wrapA(want - t.heading), -dt * turn, dt * turn);

    // Inch-worm rhythm: push, then follow.
    t.phase += dt * TAU / 1.9;
    let v = speed * (0.5 + 0.5 * Math.max(0, Math.sin(t.phase)));
    if (arrive) v *= clamp(near / 50, 0.3, 1);
    const step = arrive ? Math.min(v * dt, near) : v * dt;
    t.x += Math.cos(t.heading) * step;
    t.y += Math.sin(t.heading) * step;

    if (arrive && Math.hypot(arrive.x - t.x, arrive.y - t.y) < 2.5) {
      if (t.mode === 'seek') { t.mode = 'engaged'; t.arrivedAt = time; }
      else { t.mode = 'inspect'; t.timer = world.R.range(1.4, 2.2); }
    }
  }

  // Hard constraint after the soft steering: cells in one focal plane never overlap.
  // T cells push apart (a docked or inspecting cell holds its ground), and a T cell
  // that drifts into a healthy cell other than the one it is visiting slides out.
  function separate() {
    const T = world.tcells;
    const still = (t) => t.mode === 'inspect' || t.mode === 'engaged';
    for (let i = 0; i < T.length; i++) {
      const a = T[i];
      for (let j = i + 1; j < T.length; j++) {
        const b = T[j];
        const dx = b.x - a.x, dy = b.y - a.y;
        const d = Math.hypot(dx, dy) || 0.01;
        const min = (a.rEff + b.rEff) * 0.98;
        if (d >= min) continue;
        const sa = still(a), sb = still(b);
        if (sa && sb) continue;
        const over = min - d, ux = dx / d, uy = dy / d;
        const ka = sa ? 0 : sb ? 1 : 0.5, kb = 1 - ka;
        a.x -= ux * over * ka; a.y -= uy * over * ka;
        b.x += ux * over * kb; b.y += uy * over * kb;
      }
      if (still(a)) continue;
      const own = a.target && a.target.cell;
      for (const h of world.healthy) {
        if (h === own || (world.cancer && h === world.cancer.site && h.busy)) continue;
        const dx = a.x - h.x, dy = a.y - h.y;
        const d = Math.hypot(dx, dy) || 0.01;
        const min = h.r + a.rEff * 0.8;
        if (d < min) { a.x = h.x + (dx / d) * min; a.y = h.y + (dy / d) * min; }
      }
    }
  }

  function startInspect(t, obs) {
    const F = world.F;
    const options = world.healthy
      .filter((h) => !h.busy && h.d < 0.9 && !(world.cancer && Math.hypot(world.cancer.site.x - h.x, world.cancer.site.y - h.y) < R_CANCER * 3.2))
      .map((h) => ({ h, dist: Math.hypot(h.x - t.x, h.y - t.y) }))
      .filter((o) => o.dist < 260)
      .sort((a, b) => a.dist - b.dist);
    if (!options.length) { t.timer = 4; return; }
    const h = options[Math.min(options.length - 1, world.R.int(0, 1))].h;
    const prefer = Math.atan2(t.y - h.y, t.x - h.x);
    const dock = dockFor(h, h.r * 0.95, world.healthy, F, prefer);
    dock.cell = h;
    h.busy = true;
    t.target = dock;
    t.mode = 'inspect-go';
    t.timer = 0;
  }

  // The story, one cycle at a time.
  function direct(dt, time) {
    const cy = world.cycle;
    if (!cy) return;
    cy.t += dt;
    const ca = world.cancer;
    switch (cy.phase) {
      case 'still': {           // first frame of the motion version: back the hunter off and let it approach
        const h = cy.hunter;
        h.x = cy.dock.x + Math.cos(cy.dock.face + Math.PI) * 120;
        h.y = cy.dock.y + Math.sin(cy.dock.face + Math.PI) * 120;
        h.heading = cy.dock.face;
        h.mode = 'seek';
        h.target = { ...cy.dock, cancer: true };
        hideGlow();
        cy.phase = 'seek';
        cy.t = 0;
        break;
      }
      case 'emerge': {
        const p = clamp(cy.t / 6, 0, 1);
        cy.site.outer.setAttribute('opacity', (cy.site.baseOpacity * (1 - ease.sine(clamp(p * 1.2, 0, 1)))).toFixed(3));
        setCancer(lerp(0.8, 1, ease.out(p)), ease.sine(clamp(p * 1.15, 0, 1)));
        if (cy.t > 2.6 && cy.hunter.mode !== 'seek' && cy.hunter.mode !== 'engaged') {
          cy.hunter.mode = 'seek';
          cy.hunter.target = { ...cy.dock, cancer: true };
          if (cy.hunter.prevTarget) cy.hunter.prevTarget.busy = false;
        }
        if (p >= 1) { cy.phase = 'seek'; cy.t = 0; }
        break;
      }
      case 'seek': {
        if (cy.hunter.mode === 'engaged') { cy.phase = 'recognize'; cy.t = 0; }
        else if (cy.t > 30) { cy.hunter.x = cy.dock.x; cy.hunter.y = cy.dock.y; }
        break;
      }
      case 'recognize': {
        const T = 2.8;
        const p = clamp(cy.t / T, 0, 1);
        const pulse = (q) => { const e = clamp(q, 0, 1); return { r: 16 + 72 * ease.out(e), o: Math.sin(Math.PI * e) * 0.9 }; };
        const a = pulse(cy.t / 1.5), b = pulse((cy.t - 0.9) / 1.5);
        setGlow(cy.dock.cx, cy.dock.cy, ease.out(clamp(p * 2, 0, 1)) * 0.9, a.o, a.r);
        world.fx.ring2.setAttribute('r', f1(b.r));
        world.fx.ring2.setAttribute('opacity', b.o.toFixed(3));
        if (p >= 1) { cy.phase = 'kill'; cy.t = 0; startDeath(); }
        break;
      }
      case 'kill': {
        // the lethal hit: a few granule sparks cross into the target
        const u = { x: Math.cos(cy.dock.a), y: Math.sin(cy.dock.a) };
        world.fx.hits.forEach((hEl, i) => {
          const q = clamp((cy.t - i * 0.12) / 1.1, 0, 1);
          const spread = (i - 2.5) * 6;
          const x = cy.dock.cx + u.x * lerp(14, -34, ease.out(q)) - u.y * spread * q;
          const y = cy.dock.cy + u.y * lerp(14, -34, ease.out(q)) + u.x * spread * q;
          hEl.setAttribute('cx', f1(x)); hEl.setAttribute('cy', f1(y));
          hEl.setAttribute('opacity', (Math.sin(Math.PI * q) * 0.95).toFixed(3));
        });
        world.fx.core.setAttribute('opacity', (0.9 * (1 - ease.sine(clamp(cy.t / 4, 0, 1)))).toFixed(3));
        world.fx.ring.setAttribute('opacity', '0');
        world.fx.ring2.setAttribute('opacity', '0');
        if (cy.t > 3.4 && cy.hunter.mode === 'engaged') {
          cy.hunter.mode = 'leave';
          cy.hunter.wander = cy.dock.face + Math.PI + world.R.range(-0.7, 0.7);
          cy.hunter.timer = 5;
          cy.hunter.target = null;
        }
        if (cy.t > 6.2) { cy.phase = 'clear'; cy.t = 0; hideGlow(); }
        break;
      }
      case 'clear': {           // apoptotic bodies fade (in life, a phagocyte would tidy them up)
        const p = clamp(cy.t / 5, 0, 1);
        setCancer(ca.scale, 1 - ease.sine(p));
        if (p >= 1) {
          ca.outer.remove();
          for (const h of handles) h.stop();
          handles.clear();
          world.cancer = null;
          world.regrow.push({ site: cy.site, t: 0 });
          nextCycle();
        }
        break;
      }
      default: break;
    }
  }

  function startDeath() {
    const ca = world.cancer;
    if (!ca) return;
    ca.dying = true;
    const h = apoptosis(ca.node, { duration: 5600, seed: ca.site.seed });
    handles.add(h);
    if (userPaused || !loop?.playing) h.pause();
  }

  function nextCycle() {
    const sites = world.sites;
    world.siteIdx = (world.siteIdx + 1) % sites.length;
    const site = sites[world.siteIdx];
    if (site.busy) { site.busy = false; }
    // the nearest T cell that isn't busy becomes the hunter
    const free = world.tcells.filter((t) => t.mode === 'patrol' || t.mode === 'leave' || t.mode === 'inspect-go');
    const pool = free.length ? free : world.tcells;
    const hunter = pool.slice().sort((a, b) => Math.hypot(a.x - site.x, a.y - site.y) - Math.hypot(b.x - site.x, b.y - site.y))[0];
    if (hunter.mode === 'inspect-go' && hunter.target) { hunter.target.cell.busy = false; hunter.target = null; hunter.mode = 'patrol'; }
    const dock = dockFor(site, R_CANCER, world.healthy, world.F, Math.atan2(hunter.y - site.y, hunter.x - site.x));
    site.busy = true;
    spawnCancer(site, 0);
    setCancer(0.8, 0);
    world.cycle = { phase: 'emerge', t: 0, site, hunter, dock };
  }

  function regrowStep(dt) {
    for (const rg of world.regrow) {
      if (rg.t === 0) {
        // a fresh healthy cell takes the empty place
        const node = healthyCell({ r: rg.site.r, seed: rg.site.seed + 500 + Math.round(world.time), mhc: 8 });
        rg.site.outer.replaceChildren(node);
      }
      rg.t += dt;
      const p = clamp(rg.t / 7, 0, 1);
      rg.site.outer.setAttribute('opacity', (rg.site.baseOpacity * ease.sine(p)).toFixed(3));
      rg.site.outer.setAttribute('transform', `translate(${f1(rg.site.x)} ${f1(rg.site.y)}) scale(${lerp(0.82, 1, ease.out(p)).toFixed(3)})`);
      if (p >= 1) { rg.done = true; rg.site.busy = false; }
    }
    world.regrow = world.regrow.filter((r) => !r.done);
  }

  function membranes(time) {
    // ~15 fps is plenty for slow membrane ripples
    const frame = Math.floor(time * 15);
    for (const t of world.tcells) {
      if (!t.mem || !t.info.regen || frame === t.lastMem) continue;
      t.lastMem = frame;
      const moving = t.mode !== 'inspect' && t.mode !== 'engaged';
      const reach = moving ? 0.035 + 0.035 * Math.sin(t.phase + Math.PI / 2) : 0.05;
      const { d } = t.info.regen(0.45 * Math.sin(time * 0.6 + t.jitter), { bumps: [{ angle: 0, amp: reach, width: 0.6 }], waveT: time + t.jitter });
      t.mem.setAttribute('d', d);
      if (t.sheen) t.sheen.setAttribute('d', d);
    }
    const ca = world.cancer;
    if (ca && !ca.dying && ca.mem && ca.info.regen && frame !== ca.lastMem && frame % 2 === 0) {
      ca.lastMem = frame;
      const { d } = ca.info.regen(0.6 * Math.sin(time * 0.35), { waveT: time * 0.5 });
      ca.mem.setAttribute('d', d);
      if (ca.sheen) ca.sheen.setAttribute('d', d);
    }
  }

  function tick(dt) {
    if (!world) return;
    world.time += dt;
    const time = world.time;
    direct(dt, time);
    const obs = obstacles();
    for (const t of world.tcells) stepT(t, dt, time, obs);
    separate();
    regrowStep(dt);
    membranes(time);
    world.tcells.forEach(renderT);
  }

  // ------------------------------------------------------------------ wiring
  const btn = ctx.ui.playPause({
    parent: ctx.stage, iconOnly: true, small: true,
    playing: !ctx.reducedMotion,
    labels: { play: 'Play the animation', pause: 'Pause the animation' },
    onChange: (on) => { userPaused = !on; on ? play() : pause(); },
  });
  btn.el.classList.add('home-hero__toggle');

  function play() {
    if (!loop) return;
    loop.play();
    for (const h of handles) h.resume();
  }
  function pause() {
    if (!loop) return;
    loop.pause();
    for (const h of handles) h.pause();
  }

  loop = ctx.loop((dt) => tick(dt), { autoplay: !ctx.reducedMotion });

  ctx.onResize(({ width, height }) => {
    const key = `${Math.round(width / 40)}x${Math.round(height / 40)}`;
    if (key === lastKey && world) return;
    lastKey = key;
    build(width, height);
  });

  // Respect a reduced-motion switch made while the page is open.
  const mq = matchMedia('(prefers-reduced-motion: reduce)');
  ctx.on(mq, 'change', () => {
    if (mq.matches) { pause(); btn.set(false); }
  });

  return {
    pause() { for (const h of handles) h.pause(); },
    resume() { if (!userPaused && loop.playing) for (const h of handles) h.resume(); },
    destroy() { for (const h of handles) h.stop(); handles.clear(); },
  };
}
