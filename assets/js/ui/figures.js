// Figure lazy-loader and the `ctx` object handed to every figure module.
//
//   <figure class="fig" data-figure="ch04-mhc1-pathway" data-stage="dark"> … </figure>
//   → when it nears the viewport: import('assets/js/figures/ch04-mhc1-pathway.js')
//   → await module.default(figureEl, ctx)  → optional { destroy, pause, resume }
//
// The full contract is documented in docs/FIGURES.md. Keep this file
// backwards-compatible: dozens of figure modules depend on it.
import { h, svg as svgEl, asset, clamp, prefersReducedMotion, onReducedMotionChange, qs, iconPaths } from './dom.js';
import { hudCorner, OUTCOMES } from './kit.js';
import { currentTheme, onThemeChange } from './theme.js';
import { Floating } from './popover.js';

export const COMPACT_BELOW = 600;          // px of stage width; mirrors the CSS container query
const LOAD_MARGIN = '900px 0px';            // start loading this far before a figure scrolls in
const GSAP_URL = asset('assets/vendor/gsap/index.js');
const FIGURE_DIR = asset('assets/js/figures/');

const registry = new Map();                 // figureEl → { id, status, ctx, api, promise }
let gsapPromise = null;
let uiPromise = null;

export function loadGsap() {
  if (!gsapPromise) gsapPromise = import(GSAP_URL).then((m) => m.gsap || m.default);
  return gsapPromise;
}
function loadUI() {
  if (!uiPromise) uiPromise = Promise.all([import('./controls.js'), import('./stepper.js')]).then(([c, s]) => ({ ...c, ...s }));
  return uiPromise;
}

// ------------------------------------------------------------------ loader
export function initFigures() {
  const figs = Array.from(document.querySelectorAll('figure.fig[data-figure]'));
  for (const fig of figs) registry.set(fig, { id: fig.dataset.figure, status: 'pending' });

  if (!('IntersectionObserver' in window)) { figs.forEach(mount); return exposeDebug(); }
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      io.unobserve(e.target);
      mountWhenCalm(e.target);
    }
  }, { rootMargin: LOAD_MARGIN });
  figs.forEach((f) => io.observe(f));
  exposeDebug();
}

// Some figures take a few hundred ms of main-thread work to mount on a phone. Within
// LOAD_MARGIN the module (and GSAP, UI) are fetched and evaluated at once, but mount()
// itself waits for a pause in scrolling, for the figure to come within NEAR_MARGIN of
// the viewport, or MAX_WAIT_MS, whichever is first, so it rarely lands mid-fling.
const NEAR_MARGIN = '250px 0px';
const CALM_MS = 140;
const MAX_WAIT_MS = 2500;
function mountWhenCalm(fig) {
  const id = registry.get(fig)?.id || fig.dataset.figure;
  if (/^[a-z0-9][a-z0-9-]*$/i.test(id)) {
    import(`${FIGURE_DIR}${id}.js`).catch(() => {});   // errors surface in doMount()
    loadGsap().catch(() => {});
    loadUI().catch(() => {});
  }
  let done = false;
  let quiet = 0;
  let cap = 0;
  let near = null;
  const onScroll = () => { clearTimeout(quiet); quiet = setTimeout(go, CALM_MS); };
  function go() {
    if (done) return;
    done = true;
    near?.disconnect();
    removeEventListener('scroll', onScroll);
    clearTimeout(quiet);
    clearTimeout(cap);
    mount(fig);
  }
  near = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) go(); }, { rootMargin: NEAR_MARGIN });
  near.observe(fig);
  addEventListener('scroll', onScroll, { passive: true });
  quiet = setTimeout(go, CALM_MS);
  cap = setTimeout(go, MAX_WAIT_MS);
}

/** Mount one figure (idempotent). Resolves when mounted or failed. */
export function mount(fig) {
  const rec = registry.get(fig) || { id: fig.dataset.figure, status: 'pending' };
  registry.set(fig, rec);
  if (rec.promise) return rec.promise;
  rec.promise = doMount(fig, rec);
  return rec.promise;
}

async function doMount(fig, rec) {
  const id = rec.id;
  rec.status = 'loading';
  fig.classList.add('is-loading');
  const parts = ensureStructure(fig);
  const spinner = h('div', { class: 'fig__spinner', 'aria-hidden': 'true' });
  parts.stage.append(spinner);
  let ctx;
  try {
    if (!/^[a-z0-9][a-z0-9-]*$/i.test(id)) throw new Error(`invalid figure id "${id}"`);
    const t0 = performance.now();
    const [mod, gsap, ui] = await Promise.all([import(`${FIGURE_DIR}${id}.js`), loadGsap(), loadUI()]);
    rec.loadMs = Math.round(performance.now() - t0);
    if (typeof mod.default !== 'function') throw new Error(`module assets/js/figures/${id}.js has no default export mount(fig, ctx)`);
    spinner.remove();
    ctx = createContext(fig, parts, gsap, ui);
    rec.ctx = ctx;
    const t1 = performance.now();
    const api = (await mod.default(fig, ctx)) || {};
    rec.mountMs = Math.round(performance.now() - t1);   // QA tools: figures whose mount blocks scrolling
    rec.api = api;
    ctx._attach(api);
    rec.status = 'mounted';
    if (fig.getAttribute('aria-hidden') === 'true' && fig.querySelector('button, input, select, a[href], [tabindex]')) {
      console.warn(`[figure ${id}] is decorative (aria-hidden) but contains focusable controls; give it a :::figure block with alt text instead`);
    }
    fig.classList.remove('is-loading');
    fig.classList.add('is-mounted');
    fig.dispatchEvent(new CustomEvent('so:figure-mounted', { bubbles: true, detail: { id } }));
  } catch (err) {
    rec.status = 'failed';
    rec.error = String(err && err.stack || err);
    console.error(`[figure ${id}] failed to mount:`, err);
    spinner.remove();
    try { ctx?._destroy(); } catch { /* ignore */ }
    // Remove anything the module drew; keep the fallback description.
    for (const child of Array.from(parts.stage.children)) if (!child.classList.contains('fig__fallback')) child.remove();
    parts.controls.replaceChildren();
    fig.classList.remove('is-loading');
    fig.classList.add('is-failed');
    fig.dispatchEvent(new CustomEvent('so:figure-failed', { bubbles: true, detail: { id, error: rec.error } }));
  }
}

/** Make sure the figure has stage / controls / caption elements (hand-written pages may omit them). */
function ensureStructure(fig) {
  const stageType = fig.dataset.stage || 'dark';
  let stage = qs(':scope > .fig__stage', fig);
  if (!stage) {
    stage = h('div', { class: 'fig__stage', 'data-stage': stageType });
    const head = qs(':scope > .fig__head', fig);
    head ? head.after(stage) : fig.prepend(stage);
  }
  if (!stage.dataset.stage) stage.dataset.stage = stageType;
  let controls = qs(':scope > .fig__controls', fig);
  if (!controls) { controls = h('div', { class: 'fig__controls' }); stage.after(controls); }
  let caption = qs(':scope > .fig__caption', fig);
  if (!caption) { caption = h('figcaption', { class: 'fig__caption' }); controls.after(caption); }
  return { stage, controls, caption };
}

function exposeDebug() {
  // Used by tools/shot.mjs and tools/check.mjs.
  window.__so = window.__so || {};
  window.__so.figures = () => Array.from(registry.values()).map(({ id, status, error, loadMs, mountMs }) => ({ id, status, error, loadMs, mountMs }));
  window.__so.mountAll = () => Promise.all(Array.from(registry.keys()).map(mount));
  window.__so.figure = (id) => {
    for (const [el, rec] of registry) if (rec.id === id) return { el, ...rec };
    return null;
  };
}

// ------------------------------------------------------------------ ctx
function readData(fig) {
  const el = qs(':scope > script.fig-data[type="application/json"]', fig);
  if (!el) return {};
  try { return JSON.parse(el.textContent); } catch (e) { console.warn(`[figure ${fig.dataset.figure}] bad fig-data JSON`, e); return {}; }
}

const camel = (s) => s.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());

/** Read the palette from CSS custom properties (as resolved on the stage). */
function readColors(stage) {
  const cs = getComputedStyle(stage);
  const v = (name) => cs.getPropertyValue(name).trim();
  const names = ['healthy', 'cancer', 'cd8', 'cd4', 'treg', 'bcell', 'antibody', 'nk', 'macrophage', 'm2', 'dc',
    'neutrophil', 'mast', 'mdsc', 'fibroblast', 'bacteria', 'virus', 'mhc', 'self-peptide', 'neo-peptide', 'inhibit', 'activate', 'drug'];
  // stroke.<name>: the right color for LINES and TEXT of an entity on this stage:
  // the -deep variant on a light stage in the light theme, the base color otherwise.
  const lightSurface = stage.dataset.stage === 'light' && currentTheme() === 'light';
  const colors = { deep: {}, stroke: {} };
  for (const n of names) {
    colors[camel(n)] = v(`--c-${n}`);
    colors.deep[camel(n)] = v(`--c-${n}-deep`);
    colors.stroke[camel(n)] = lightSurface ? colors.deep[camel(n)] : colors[camel(n)];
  }
  Object.assign(colors, {
    drugOutline: v('--c-drug-outline'),
    mastGranule: v('--c-mast-granule'),
    // stage-aware (dark stage values on a dark stage, page values on a light stage)
    fg: v('--fg'), fg2: v('--fg-2'), fg3: v('--fg-3'), line: v('--line'), grid: v('--grid'), halo: v('--halo'),
    // page
    paper: v('--paper'), surface: v('--surface'), ink: v('--ink'), ink2: v('--ink-2'), ink3: v('--ink-3'),
    rule: v('--rule'), accent: v('--accent'), success: v('--success'), danger: v('--danger'),
    stageA: v('--stage-dark-a'), stageB: v('--stage-dark-b'),
    chart: [v('--chart-1'), v('--chart-2'), v('--chart-3'), v('--chart-4'), v('--chart-5')],
    chartMuted: v('--chart-muted'), chartGrid: v('--chart-grid'), chartAxis: v('--chart-axis'),
  });
  return colors;
}

/** Hex/rgb color with alpha → rgba() string. ctx.alpha('#4C8DFF', 0.3) */
export function alpha(color, a) {
  const c = (color || '').trim();
  if (c.startsWith('#')) {
    let hex = c.slice(1);
    if (hex.length === 3) hex = hex.split('').map((x) => x + x).join('');
    const n = parseInt(hex.slice(0, 6), 16);
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
  }
  const m = c.match(/rgba?\(([^)]+)\)/);
  if (m) {
    const [r, g, b] = m[1].split(/[\s,/]+/).filter(Boolean);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
  return c;
}
/** Mix two hex colors (t = 0 → a, 1 → b). */
export function mix(a, b, t) {
  const p = (x) => { let s = x.replace('#', ''); if (s.length === 3) s = s.split('').map((c) => c + c).join(''); const n = parseInt(s, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
  const [A, B] = [p(a), p(b)];
  return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join('');
}

/** Deterministic PRNG (mulberry32) so simulations look the same on every load. */
export function random(seed = 1) {
  let s = seed >>> 0;
  const next = () => {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  next.range = (a, b) => a + (b - a) * next();
  next.int = (a, b) => Math.floor(a + (b - a + 1) * next());
  next.pick = (arr) => arr[Math.floor(next() * arr.length)];
  next.gauss = () => { let u = 0, v = 0; while (!u) u = next(); while (!v) v = next(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  return next;
}

function parseRatio(r) {
  if (r == null || r === 'auto') return null;
  if (typeof r === 'number') return r;
  const m = String(r).match(/^\s*([\d.]+)\s*[/:]\s*([\d.]+)\s*$/);
  return m ? Number(m[1]) / Number(m[2]) : Number(r) || null;
}

function createContext(fig, { stage, controls, caption }, gsap, uiLib) {
  const id = fig.dataset.figure;
  const data = readData(fig);
  const abort = new AbortController();
  const cleanups = [];
  const resizeFns = [];
  const visibleFns = [];
  const themeFns = [];
  const loops = new Set();
  const ambients = new Set();
  const tracked = new Map();   // handle → paused by us?
  let api = {};
  let visible = false;
  let size = { width: stage.clientWidth, height: stage.clientHeight };
  let compact = size.width > 0 && size.width < COMPACT_BELOW;
  let colorsCache = null;
  let destroyed = false;
  let rm = prefersReducedMotion();

  const isRunnable = () => visible && !document.hidden && !destroyed;

  // ----- live region for announcements
  const live = h('p', { class: 'visually-hidden', 'aria-live': 'polite' });
  fig.append(live);

  // ----- resize
  let lastW = -1;
  let lastCompact = null;
  const fireResize = () => {
    const w = Math.round(stage.clientWidth);
    const hgt = Math.round(stage.clientHeight);
    if (!w) return;
    const cmp = w < COMPACT_BELOW;
    if (w === lastW && cmp === lastCompact && hgt === size.height) return;
    lastW = w; lastCompact = cmp;
    size = { width: w, height: hgt };
    compact = cmp;
    fig.classList.toggle('is-compact', cmp);
    const info = { width: w, height: hgt, compact: cmp };
    for (const fn of resizeFns) {
      try { fn(info); } catch (e) { console.error(`[figure ${id}] onResize handler threw`, e); }
    }
    updateTextScale();
  };
  // Publish --u (SVG user units per CSS px) on every root SVG so the .t-* text
  // classes in figures.css can keep labels ≥ ~13 px however small the stage gets.
  const svgRoots = new Set();
  function updateTextScale() {
    for (const root of svgRoots) {
      if (!root.isConnected) { svgRoots.delete(root); continue; }
      const vb = root.viewBox?.baseVal;
      const r = root.getBoundingClientRect();
      if (!vb || !vb.width || !r.width) continue;
      const ppu = Math.min(r.width / vb.width, r.height / vb.height || Infinity);
      root.style.setProperty('--u', (1 / ppu).toFixed(3));
    }
  }
  const ro = new ResizeObserver(() => requestAnimationFrame(fireResize));
  ro.observe(stage);

  // ----- visibility (any pixel on screen) + tab visibility
  const setVisible = (v) => {
    if (v === visible) return;
    visible = v;
    fig.classList.toggle('is-offscreen', !v);
    syncRunning();
    for (const fn of visibleFns) { try { fn(v); } catch (e) { console.error(`[figure ${id}] onVisible handler threw`, e); } }
  };
  // Several entries can queue for the figure in one callback (e.g. a layout shift during mount moves
  // it off-screen and back within a frame): only the newest one is current.
  const vio = new IntersectionObserver((entries) => setVisible(entries[entries.length - 1].isIntersecting), { threshold: 0 });
  vio.observe(fig);
  const onDocVis = () => syncRunning();
  document.addEventListener('visibilitychange', onDocVis, { signal: abort.signal });

  function syncRunning() {
    const run = isRunnable();
    for (const l of loops) l._sync();
    for (const t of ambients) {
      if (run && !rm) t.paused() && t.resume();
      else !t.paused() && t.pause();
    }
    for (const [h, pausedByUs] of tracked) {
      if (run && !rm && pausedByUs) { h.resume?.(); tracked.set(h, false); }
      else if ((!run || rm) && !pausedByUs) { h.pause?.(); tracked.set(h, true); }
    }
    try { run ? api.resume?.() : api.pause?.(); } catch (e) { console.error(`[figure ${id}] pause/resume threw`, e); }
  }

  const offRM = onReducedMotionChange((v) => {
    rm = v;
    // Loops stop when the reader turns reduced motion on mid-session, and resume
    // (if they were playing) when it is turned off again.
    for (const l of loops) {
      if (v && l.playing) { l._rmPaused = true; l.pause(); }
      else if (!v && l._rmPaused) { l._rmPaused = false; l.play(); }
    }
    syncRunning();
  });
  const offTheme = onThemeChange((theme) => {
    colorsCache = null;
    for (const fn of themeFns) { try { fn(theme); } catch (e) { console.error(`[figure ${id}] onThemeChange handler threw`, e); } }
  });

  // ----- loops
  function loop(fn, { autoplay } = {}) {
    let wanted = autoplay ?? !rm;
    let raf = 0;
    let last = 0;
    let t = 0;
    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      t += dt;
      try { fn(dt, t); } catch (e) { console.error(`[figure ${id}] loop threw; stopping`, e); handle.pause(); }
    };
    const listeners = new Set();
    const setWanted = (v) => {
      if (v === wanted) { handle._sync(); return handle; }
      wanted = v;
      handle._sync();
      for (const f of listeners) { try { f(v); } catch (e) { console.error(e); } }
      return handle;
    };
    const handle = {
      play() { handle._rmPaused = false; return setWanted(true); },
      pause() { return setWanted(false); },
      /** Subscribe to play-state changes (user or automatic). Returns an unsubscribe function. */
      onChange(f) { listeners.add(f); return () => listeners.delete(f); },
      toggle(force) { return (force ?? !wanted) ? handle.play() : handle.pause(); },
      /** Render one frame without running (e.g. after a slider change while paused). */
      tick(dt = 0) { try { fn(dt, t); } catch (e) { console.error(`[figure ${id}] loop threw`, e); } return handle; },
      get playing() { return wanted; },
      get running() { return raf !== 0; },
      get time() { return t; },
      _sync() {
        const should = wanted && isRunnable();
        if (should && !raf) { last = 0; raf = requestAnimationFrame(frame); }
        else if (!should && raf) { cancelAnimationFrame(raf); raf = 0; }
      },
      _kill() { cancelAnimationFrame(raf); raf = 0; wanted = false; listeners.clear(); loops.delete(handle); },
    };
    loops.add(handle);
    handle._sync();
    return handle;
  }

  // ----- tooltip (shared floating element per figure)
  let tip = null;
  const tooltip = {
    show(content, anchorOrPoint) {
      if (!tip) tip = new Floating({ className: 'popover--tip' });
      const isEl = anchorOrPoint && typeof anchorOrPoint.getBoundingClientRect === 'function';
      tip.show(isEl ? anchorOrPoint : null, content, isEl ? {} : { point: anchorOrPoint });
      if (!isEl) tip.place(null, { point: anchorOrPoint, prefer: 'top' });
    },
    hide() { tip?.hide(); },
  };
  cleanups.push(() => { tip?.el.remove(); });

  // Figure-scoped ids: `<figure-id>-<kind>-<n>`, numbered per kind in call order, so they
  // don't depend on which figures loaded first (stepper-check compares them). If the id is
  // already taken outside this figure (same figure on a page twice), a suffix is added.
  const idCounts = new Map();
  const idBase = String(id || 'fig').replace(/[^\w-]/g, '-');
  const uid = (kind = 'id') => {
    const k = String(kind).replace(/[^\w-]/g, '-') || 'id';
    const n = (idCounts.get(k) || 0) + 1;
    idCounts.set(k, n);
    const base = `${idBase}-${k}-${n}`;
    let out = base;
    for (let j = 2; ; j++) {
      const found = document.getElementById(out);
      if (!found || fig.contains(found)) return out;
      out = `${base}-${j}`;
    }
  };

  // POLISH S2: in chapters the step caption sits directly under the stepper bar, before the
  // figure's own controls: stage → .fig__stepbar (stepper, step caption) → controls → figcaption.
  // Runs once mount() has returned (modules may still query ctx.caption for .fig__steps while
  // mounting) and again for a stepper created later. Hand-made layouts (home) keep their order.
  let mounted = false;
  function arrangeSteps() {
    if (!fig.closest('.chapter-body') || fig.classList.contains('fig--hero')) return;
    const bar = controls.querySelector(':scope > .stepper');
    if (!bar) return;
    let slot = fig.querySelector(':scope > .fig__stepbar');
    if (!slot) { slot = h('div', { class: 'fig__stepbar' }); controls.before(slot); }
    slot.append(bar);
    const steps = caption.querySelector(':scope > .fig__steps:not([data-prerender])');
    if (steps) slot.append(steps);
  }

  const ctx = {
    id,
    /** A page-unique id that is stable across loads: `<figure-id>-<kind>-<n>`. */
    uid,
    el: fig,
    stage,
    controls,
    caption,
    data,
    /** Writer's step captions: [{ title, html, text }] (from the draft's `steps:`). */
    steps: Array.isArray(data.steps) ? data.steps : [],
    number: data.number || '',
    title: data.title || '',
    gsap,
    signal: abort.signal,

    get reducedMotion() { return rm; },
    get theme() { return currentTheme(); },
    get compact() { return compact; },
    get width() { return size.width; },
    get height() { return size.height; },
    get visible() { return visible; },
    get colors() { return (colorsCache ||= readColors(stage)); },
    /** 'dark' | 'light': the `stage` option for art-library factories (same as stageFor(fig)). */
    get artStage() { return stage.dataset.stage === 'dark' ? 'dark' : currentTheme(); },
    /** true for the ambient figure in a chapter hero (no controls, no captions, any aspect). */
    hero: fig.classList.contains('fig--hero'),

    // DOM helpers
    h,
    svg: (tag, attrs, parent) => svgEl(tag, attrs, parent),
    alpha,
    mix,
    random,
    clamp,

    /**
     * Create the root <svg> inside the stage.
     *   ctx.createSVG({ viewBox: '0 0 960 540', className, interactive })
     * Returns the <svg>; `svg.defs` is a ready <defs> element.
     */
    createSVG({ viewBox = '0 0 960 540', className = '', interactive = false, parent = stage, label } = {}) {
      const root = svgEl('svg', {
        viewBox, class: `fig__svg ${className}`.trim(), preserveAspectRatio: 'xMidYMid meet',
        role: interactive ? 'group' : null, 'aria-hidden': interactive ? null : 'true', 'aria-label': interactive ? (label || data.title || null) : null,
        focusable: 'false',
      });
      root.defs = svgEl('defs', null, root);
      parent.append(root);
      svgRoots.add(root);
      requestAnimationFrame(updateTextScale);
      return root;
    },

    /**
     * Soft glow: an SVG filter you can apply with filter="url(#id)".
     * Prefer radial-gradient halos for many elements (cheaper); use this for a few hero shapes.
     */
    glowFilter(root, { id: fid = uid('glow'), blur = 6, strength = 1 } = {}) {
      const f = svgEl('filter', { id: fid, x: '-50%', y: '-50%', width: '200%', height: '200%', colorInterpolationFilters: 'sRGB' }, root.defs || root);
      svgEl('feGaussianBlur', { in: 'SourceGraphic', stdDeviation: blur, result: 'b' }, f);
      const ct = svgEl('feComponentTransfer', { in: 'b', result: 'g' }, f);
      svgEl('feFuncA', { type: 'linear', slope: strength }, ct);
      const m = svgEl('feMerge', null, f);
      svgEl('feMergeNode', { in: 'g' }, m);
      svgEl('feMergeNode', { in: 'SourceGraphic' }, m);
      return `url(#${fid})`;
    },

    /** Radial gradient for cell bodies and halos. stops: [[offset, color, opacity?], …] */
    radialGradient(root, stops, { id: gid = uid('rg'), cx = '50%', cy = '50%', r = '50%', fx, fy } = {}) {
      const g = svgEl('radialGradient', { id: gid, cx, cy, r, fx, fy }, root.defs || root);
      for (const [offset, color, opacity = 1] of stops) svgEl('stop', { offset, stopColor: color, stopOpacity: opacity }, g);
      return `url(#${gid})`;
    },

    linearGradient(root, stops, { id: gid = uid('lg'), x1 = '0%', y1 = '0%', x2 = '100%', y2 = '0%' } = {}) {
      const g = svgEl('linearGradient', { id: gid, x1, y1, x2, y2 }, root.defs || root);
      for (const [offset, color, opacity = 1] of stops) svgEl('stop', { offset, stopColor: color, stopOpacity: opacity }, g);
      return `url(#${gid})`;
    },

    /** Re-measure text scale after changing an SVG's viewBox outside onResize. */
    refreshTextScale: () => updateTextScale(),

    /** Rendered CSS px per SVG user unit (use to keep text ≥ 13px on phones). */
    pxPerUnit(root) {
      const vb = root.viewBox?.baseVal;
      if (!vb || !vb.width) return 1;
      const r = root.getBoundingClientRect();
      return Math.min(r.width / vb.width, r.height / vb.height) || 1;
    },

    /**
     * Canvas that fills the stage, DPR-aware (capped at 2) and auto-resized.
     *   const cv = ctx.canvas();  cv.g is the 2D context in CSS-pixel units.
     */
    canvas({ parent = stage, alpha: hasAlpha = true, maxDpr = 2 } = {}) {
      const el = h('canvas', { class: 'fig__canvas', 'aria-hidden': 'true' });
      parent.append(el);
      const g = el.getContext('2d', { alpha: hasAlpha });
      const cv = { el, g, width: 0, height: 0, dpr: 1 };
      const fit = () => {
        const w = Math.max(1, Math.round(el.clientWidth || stage.clientWidth));
        const hgt = Math.max(1, Math.round(el.clientHeight || stage.clientHeight));
        const dpr = Math.min(maxDpr, window.devicePixelRatio || 1);
        if (w === cv.width && hgt === cv.height && dpr === cv.dpr) return;
        Object.assign(cv, { width: w, height: hgt, dpr });
        el.width = Math.round(w * dpr);
        el.height = Math.round(hgt * dpr);
        g.setTransform(dpr, 0, 0, dpr, 0, 0);
      };
      cv.fit = fit;
      cv.clear = () => g.clearRect(0, 0, cv.width, cv.height);
      fit();
      resizeFns.unshift(fit);   // canvas is resized before user onResize handlers run
      return cv;
    },

    /** Stage aspect ratio (desktop, compact). Numbers or '16/9' strings; 'auto' = content height. */
    setAspect(desktop, compactRatio) {
      const d = parseRatio(desktop);
      const c = parseRatio(compactRatio ?? desktop);
      stage.classList.toggle('is-auto-height', d == null);
      if (d != null) fig.style.setProperty('--fig-aspect', String(d));
      if (c != null) fig.style.setProperty('--fig-aspect-compact', String(c));
      else fig.style.removeProperty('--fig-aspect-compact');
      requestAnimationFrame(fireResize);
    },

    /**
     * Stage tag ("Illustrative", "Not to scale", "Time compressed"): small caps in a
     * corner of the stage, no pointer events. Two at most per figure.
     */
    tag(text, corner = 'top-right') {
      const el = h('span', { class: 'fig-tag-caps' }, text);
      hudCorner(stage, corner).append(el);
      return { el, set(t) { el.textContent = t; }, remove() { el.remove(); } };
    },

    /** Outcome disc for use inside the stage: kind 'yes' ✓ | 'partial' ≈ | 'no' ✕ | 'varies' ~. */
    badgeSVG(kind, { x = 0, y = 0, r = 11 } = {}, parent) {
      const k = OUTCOMES[kind] ? kind : 'varies';
      const g = svgEl('g', { class: `o-badge o-badge--${k}`, transform: `translate(${x} ${y})` });
      svgEl('circle', { r }, g);
      const s2 = (r * 1.25) / 24;
      const glyph = svgEl('g', { class: 'o-badge__glyph', transform: `translate(${-12 * s2} ${-12 * s2}) scale(${s2})`, fill: 'none', 'stroke-width': 2.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
      glyph.innerHTML = iconPaths(OUTCOMES[k].glyph);
      if (parent) parent.append(g);
      return g;
    },

    /** Icon from the UI set as an SVG group centered at (x, y), for use inside the stage. */
    iconSVG(name, { x = 0, y = 0, size = 20, color = 'currentColor', strokeWidth = 1.75 } = {}, parent) {
      const sc = size / 24;
      const g = svgEl('g', { class: 'fig-icon', transform: `translate(${x - size / 2} ${y - size / 2}) scale(${sc})`, fill: 'none', stroke: color, 'stroke-width': strokeWidth, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
      g.innerHTML = iconPaths(name);
      if (parent) parent.append(g);
      return g;
    },

    /** Faint drifting dust behind the drawing (dark stages). Off for reduced motion. */
    addDust() {
      if (!qs(':scope > .fig__dust', stage)) stage.prepend(h('div', { class: 'fig__dust', 'aria-hidden': 'true' }));
    },

    // Lifecycle hooks
    onResize(fn) { resizeFns.push(fn); if (size.width) { try { fn({ ...size, compact }); } catch (e) { console.error(e); } } return () => resizeFns.splice(resizeFns.indexOf(fn), 1); },
    onVisible(fn) { visibleFns.push(fn); return () => visibleFns.splice(visibleFns.indexOf(fn), 1); },
    /** Run fn once, the first time at least `ratio` of the figure is visible. */
    onceVisible(fn, ratio = 0.35) {
      const io = new IntersectionObserver((entries) => {
        const e = entries[entries.length - 1];   // newest entry (see vio above)
        if (e.intersectionRatio >= ratio || (e.isIntersecting && e.intersectionRect.height > innerHeight * 0.5)) {
          io.disconnect();
          try { fn(); } catch (err) { console.error(`[figure ${id}] onceVisible handler threw`, err); }
        }
      }, { threshold: [0, ratio, Math.min(1, ratio + 0.2)] });
      io.observe(stage);
      cleanups.push(() => io.disconnect());
    },
    onThemeChange(fn) { themeFns.push(fn); },
    cleanup(fn) { cleanups.push(fn); },
    on(target, type, fn, opts = {}) { target.addEventListener(type, fn, { ...opts, signal: abort.signal }); },

    loop,
    /** Register an infinite GSAP tween/timeline: paused off-screen, never runs under reduced motion. */
    ambient(tween) {
      ambients.add(tween);
      // Mark idle-loop targets so QA tools (tools/stepper-check.mjs) can ignore them.
      for (const t of tween.targets?.() || []) if (t && t.setAttribute) t.setAttribute('data-ambient', '');
      const kill = tween.kill.bind(tween);
      tween.kill = (...args) => { ambients.delete(tween); return kill(...args); };
      if (rm || !isRunnable()) tween.pause();
      return tween;
    },
    /**
     * Track any animation handle with pause()/resume()/stop() (e.g. the art library's
     * breathe/drift/crawl/jitter helpers, or your own). It is paused off-screen, in hidden
     * tabs and under reduced motion, resumed when visible again, and stopped on destroy.
     */
    track(handle) {
      if (!handle || typeof handle.pause !== 'function') return handle;
      tracked.set(handle, false);
      if (!isRunnable() || rm) { handle.pause(); tracked.set(handle, true); }
      return handle;
    },
    tooltip,
    /** Announce a short status message to screen readers. */
    announce(text) { live.textContent = ''; requestAnimationFrame(() => { live.textContent = text; }); },

    _attach(a) { api = a || {}; mounted = true; syncRunning(); arrangeSteps(); },
    _arrangeSteps() { if (mounted) arrangeSteps(); },
    _destroy() {
      if (destroyed) return;
      destroyed = true;
      try { api.destroy?.(); } catch (e) { console.error(e); }
      for (const l of [...loops]) l._kill();
      for (const t of ambients) t.kill();
      for (const h of tracked.keys()) { try { h.stop?.(); } catch { /* ignore */ } }
      for (const fn of cleanups.reverse()) { try { fn(); } catch (e) { console.error(e); } }
      abort.abort();
      ro.disconnect();
      vio.disconnect();
      offRM();
      offTheme();
      gsap.killTweensOf(stage.querySelectorAll('*'));
      live.remove();
    },
  };

  ctx.ui = uiLib.createUI(ctx);
  // Fire initial size once the module had a chance to set things up.
  requestAnimationFrame(fireResize);
  return ctx;
}

/** Programmatic access for pages/tools. */
export function figureRecord(el) { return registry.get(el); }
export function destroyFigure(el) {
  const rec = registry.get(el);
  rec?.ctx?._destroy();
  registry.delete(el);
}
