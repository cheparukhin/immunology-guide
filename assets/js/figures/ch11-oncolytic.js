// ch11-oncolytic — "A virus that turns a tumor into a vaccine" (Chapter 11, oncolytic viruses).
//
// A short, self-running teaching simulation with a guided caption track:
//   1 a syringe releases virions into one tumor;
//   2 healthy cells sound their interferon alarm (sand halo + shield, hollow sand rings to the
//     neighbors — FIGURE-AUDIT §4 rule 12, sender's color) while cancer cells with a broken
//     alarm let the virus multiply;
//   3 full cancer cells burst (membrane fragments, new virions, hot-pink tumor proteins and
//     pale-gold danger sparks, rule 11); the wave stops with ~16 of 25 burst;
//   4 three immature dendritic cells collect the proteins, mature and walk the lymph route to
//     the node, where two resting T cells brighten and photocopy into eight;
//   5 the T cells ride the blood route to BOTH tumors and kill with the crowd form of the kill
//     grammar (contact ring, shrink + specks, rule 6). The distant tumor never sees a virion.
// The "Working" alarm variant shuts the virus down almost everywhere.
//
// Engine: the whole run is PLANNED up front (seeded, deterministic) and rendered as a pure
// function of sim time T (canvas sprites from the art library + agents.js effect drawers). So
// play / pause / replay are trivial, and reduced motion swaps the run for a ctx.ui.stepper whose
// steps simply seek T to each phase's end state.
//
// Path and lane grammar shared with ch12-neoadjuvant (one task builds both): lymph routes are
// pale-blue dotted lines with chevrons (DCs walk them), blood routes are soft rose tubes with
// drifting streaks (T cells ride them), "LYMPH" / "BLOOD" in t-caps, lymphNodeField interiors.
import { tissueField, lymphNodeField, cellInfo, drawSprite, PALETTE, mix } from '../art/index.js';
import { rng, spriteStates, createEffects, killSpecks, contactRing } from './shared/agents.js';

const ID = 'ch11-oncolytic';
const TAU = Math.PI * 2;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const clamp01 = (v) => clamp(v, 0, 1);
const lerp = (a, b, t) => a + (b - a) * t;
const seg = (t, a, b) => clamp01((t - a) / (b - a || 1e-6));
const eio = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const eo = (t) => 1 - Math.pow(1 - t, 3);
const f2 = (v) => String(Math.round(v * 100) / 100);
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

const END = 32;
const PHASES = [0, 2.8, 5.2, 12.4, 21.4];        // caption cues (sim seconds)
const SNAP = [2.9, 5.1, 12.3, 21.3, END];         // reduced-motion steps: end state of each phase
const GAP = 1.6;                                  // daughter offset (× T-cell radius) when dividing

const C = {
  cancer: PALETTE.cancer, healthy: PALETTE.healthy, virus: PALETTE.virus, pink: PALETTE.neoPeptide,
  cd8: PALETTE.cd8, dc: PALETTE.dendritic || PALETTE.dc, lymph: PALETTE.lymph || '#9FC3D9',
  blood: mix(PALETTE.rbc || '#C4505A', '#FFFFFF', 0.22), danger: PALETTE.danger || '#FFE6A6',
};
const ALT = 'If the cancer cells’ interferon response still works, they shut the virus down too: little lysis, few released proteins, and only a weak T-cell response.';
const NOTE = 'In the trial behind T-VEC’s approval, about two thirds of injected lesions shrank by at least half, as did about a third of uninjected lesions in the skin and lymph nodes and about one in seven tumors in internal organs. Many patients do not respond at all.';
const SHIELD = 'M12 2.8l7.5 3v5.6c0 4.6-3.2 8.4-7.5 9.8-4.3-1.4-7.5-5.2-7.5-9.8V5.8z';

// ------------------------------------------------------------------ layouts (viewBox units)
const LAYOUTS = {
  wide: {
    W: 960, H: 540, compact: false,
    inj: { cx: 280, cy: 318, rc: 19, rh: 19, nh: 12, ring: 16, seed: 3, needle: 208, label: [28, 112] },
    dist: { cx: 806, cy: 424, rc: 17, rh: 17, seed: 7, ring: [0, 48, 96, 144, 190, 330], label: [764, 318], labelAnchor: 'end' },
    ln: { x: 586, y: 44, w: 352, h: 178 },
    lymph: [[404, 226], [462, 158], [542, 128], [606, 138]],
    bloodA: [[668, 212], [642, 300], [614, 448], [558, 508], [420, 514], [40, 514]],
    bloodB: [[850, 214], [868, 262], [836, 314]],
    dcFrom: [[22, 250], [70, 500], [262, 88]],
    sizes: { rdc: 29, rt: 9.5, rv: 3.4, bead: 4.8, spark: 9, ifn: 8.5, shield: 12 },
    speed: { ride: 200, crawl: 46 },
    labelsAt: {
      cancer: { x: 478, y: 318, to: [386, 340], anchor: 'start' },   // clear of the healthy cell at ~(444, 358)
      healthy: { x: 452, y: 210, to: [400, 236], anchor: 'start' },
      tcell: { x: 930, y: 214, anchor: 'end' },
      lymph: { x: 496, y: 124 }, bloodA: { x: 300, y: 538 }, bloodB: { x: 888, y: 268, anchor: 'start' },
    },
    callouts: { virus: { x: 14, y: 300 }, alarm: { x: 14, y: 398 }, proteins: { x: 14, y: 300, two: 'and danger signals' } },
  },
  compact: {
    W: 400, H: 660, compact: true,
    inj: { cx: 210, cy: 170, rc: 12.5, rh: 12.5, nh: 12, ring: 8, seed: 3, needle: 208, label: [14, 296] },
    dist: { cx: 200, cy: 546, rc: 12, rh: 12, seed: 7, ring: [0, 40, 140, 180, 220, 320], label: [200, 650], labelAnchor: 'middle' },
    ln: { x: 36, y: 318, w: 328, h: 112 },
    lymph: [[294, 226], [348, 256], [374, 310], [352, 360]],
    bloodA: [[98, 404], [46, 384], [34, 336], [78, 308], [384, 306]],
    bloodB: [[250, 424], [258, 450], [236, 478]],
    dcFrom: [[14, 170], [88, 50], [214, 44]],
    sizes: { rdc: 21, rt: 7, rv: 2.6, bead: 3.8, spark: 7, ifn: 6.5, shield: 9 },
    speed: { ride: 130, crawl: 32 },
    labelsAt: {
      cancer: { x: 392, y: 132, to: [302, 152], anchor: 'end' },
      healthy: { x: 14, y: 262, to: [96, 236], anchor: 'start' },
      tcell: { x: 352, y: 444, anchor: 'end' },
      lymph: { x: 392, y: 236, anchor: 'end' }, bloodA: { x: 300, y: 324 }, bloodB: { x: 268, y: 448, anchor: 'start' },
    },
    callouts: { virus: { x: 10, y: 70 } },
  },
};

// ------------------------------------------------------------------ curves (pure geometry)
function bez(s, t) {
  const u = 1 - t;
  return {
    x: u * u * u * s[0].x + 3 * u * u * t * s[1].x + 3 * u * t * t * s[2].x + t * t * t * s[3].x,
    y: u * u * u * s[0].y + 3 * u * u * t * s[1].y + 3 * u * t * t * s[2].y + t * t * t * s[3].y,
  };
}
/** Smooth curve through points (Catmull-Rom → cubic Béziers) with an arc-length table. */
function curve(points, samples = 18) {
  const P = points.map((p) => (Array.isArray(p) ? { x: p[0], y: p[1] } : { x: p.x, y: p.y }));
  const segs = [];
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
    segs.push([p1, { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 }, { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 }, p2]);
  }
  const xs = [], ys = [], ls = [];
  let L = 0;
  if (!segs.length) { xs.push(P[0].x); ys.push(P[0].y); ls.push(0); }
  segs.forEach((s, si) => {
    for (let k = si ? 1 : 0; k <= samples; k++) {
      const p = bez(s, k / samples);
      if (xs.length) L += Math.hypot(p.x - xs[xs.length - 1], p.y - ys[ys.length - 1]);
      xs.push(p.x); ys.push(p.y); ls.push(L);
    }
  });
  return polyline(xs, ys, ls, segs);
}
function polyline(xs, ys, ls, segs = null) {
  const L = ls[ls.length - 1] || 0;
  const at = (u) => {
    const d = clamp01(u) * L;
    let lo = 0, hi = ls.length - 1;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (ls[m] < d) lo = m; else hi = m; }
    const k = ls[hi] - ls[lo] > 1e-9 ? (d - ls[lo]) / (ls[hi] - ls[lo]) : 0;
    return { x: lerp(xs[lo], xs[hi], k), y: lerp(ys[lo], ys[hi], k), a: Math.atan2(ys[hi] - ys[lo], xs[hi] - xs[lo]) };
  };
  const d = segs ? `M${f2(segs[0][0].x)} ${f2(segs[0][0].y)}` + segs.map((s) => `C${f2(s[1].x)} ${f2(s[1].y)} ${f2(s[2].x)} ${f2(s[2].y)} ${f2(s[3].x)} ${f2(s[3].y)}`).join('') : '';
  return { xs, ys, ls, length: L, at, d };
}
/** Join curves / point lists into one arc-length polyline (a journey). */
function join(parts) {
  const xs = [], ys = [], ls = [];
  let L = 0;
  for (const c of parts) {
    for (let i = 0; i < c.xs.length; i++) {
      const x = c.xs[i], y = c.ys[i];
      if (xs.length) {
        const d = Math.hypot(x - xs[xs.length - 1], y - ys[ys.length - 1]);
        if (d < 1e-6) continue;
        L += d;
      }
      xs.push(x); ys.push(y); ls.push(L);
    }
  }
  return polyline(xs, ys, ls);
}
/** Fraction (0..1) along a journey closest to point p. */
function nearestU(J, p) {
  let best = 0, bd = Infinity;
  for (let i = 0; i < J.xs.length; i++) {
    const d = (J.xs[i] - p.x) ** 2 + (J.ys[i] - p.y) ** 2;
    if (d < bd) { bd = d; best = i; }
  }
  return J.length ? J.ls[best] / J.length : 0;
}

/** Hexagonal packing of n cells into an irregular blob (centred at 0,0). */
function packHex(n, r, gap, seed) {
  const R = rng(seed);
  const d = 2 * r * gap;
  const pts = [];
  for (let j = -9; j <= 9; j++) {
    for (let i = -9; i <= 9; i++) {
      const x = (i + (j & 1 ? 0.5 : 0)) * d, y = j * d * 0.866;
      const a = Math.atan2(y, x);
      const wob = 1 + 0.1 * Math.sin(3 * a + seed) + 0.06 * Math.sin(5 * a + seed * 2);
      pts.push({ x, y, k: Math.hypot(x, y) / wob });
    }
  }
  pts.sort((a, b) => a.k - b.k);
  return pts.slice(0, n).map((p) => ({ x: p.x + R.range(-0.2, 0.2) * r, y: p.y + R.range(-0.2, 0.2) * r }));
}

// ------------------------------------------------------------------ styles
const STYLE = `
[data-figure="${ID}"] .onc-count {
  display: inline-flex; flex-wrap: wrap; align-items: center; gap: 0.35rem 0.5rem;
  padding: 0.3rem 0.6rem; border-radius: var(--r-pill);
  background: color-mix(in srgb, var(--halo) 72%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--line) 60%, transparent);
  font: 600 var(--text-xs)/1.25 var(--font-ui); color: var(--fg-2); font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
[data-figure="${ID}"] .onc-count b { color: var(--fg); font-weight: 650; }
[data-figure="${ID}"] .onc-count .fig-tag-caps { padding: 0.2rem 0.4rem; }
[data-figure="${ID}"] .onc-count--below {
  margin: 0 0 0.75rem; white-space: normal; background: var(--surface); color: var(--ink-2);
  box-shadow: inset 0 0 0 1px var(--rule); border-radius: var(--r-md, 10px);
  font-size: 0.8125rem;
}
[data-figure="${ID}"] .onc-count--below b { color: var(--ink); }
[data-figure="${ID}"] .onc-count--below .fig-tag-caps { color: var(--ink-3); background: color-mix(in srgb, var(--ink-3) 12%, transparent); }
[data-figure="${ID}"] .onc-alt-num { color: var(--ink-3); }
[data-figure="${ID}"] .onc-note {
  margin-top: 0.75rem; padding-top: 0.6rem; border-top: 1px solid var(--rule);
  font-family: var(--font-ui); font-size: 0.8125rem; line-height: 1.5; color: var(--ink-2);
}
[data-figure="${ID}"] .onc-note[hidden] { display: none; }
[data-figure="${ID}"] .onc-note b { color: var(--ink); font-weight: 650; }
[data-figure="${ID}"] .fig__controls .onc-hide { display: none; }
`;

export default async function mount(fig, ctx) {
  if (!document.getElementById(`${ID}-style`)) document.head.append(ctx.h('style', { id: `${ID}-style`, html: STYLE }));
  ctx.setAspect(16 / 9, 400 / 660);
  const RM = ctx.reducedMotion;

  // ---------------------------------------------------------------- layers: svg (back) · canvas · svg (front)
  const back = ctx.createSVG({ viewBox: '0 0 960 540', className: 'onc-back' });
  const cv = ctx.canvas();
  const front = ctx.createSVG({ viewBox: '0 0 960 540', className: 'onc-front' });
  const S = (tag, attrs, parent) => ctx.svg(tag, attrs, parent);

  // HUD: clock (top left) + counters under it; two stage tags (top right)
  const clock = ctx.ui.clock({ value: 'Time compressed: real events take days to weeks', corner: 'top-left' });
  ctx.tag('Illustrative', 'top-right');
  ctx.tag('Not to scale', 'top-right');
  const count = ctx.h('div', { class: 'onc-count', role: 'status', 'aria-live': 'off' });
  const countText = ctx.h('span');
  count.append(countText, ctx.h('span', { class: 'fig-tag-caps', text: 'Illustrative' }));
  clock.el.after(count);

  // caption track (same markup as the stepper's captions: one grid cell, no height jumps)
  ctx.caption.querySelector(':scope > .fig__steps[data-prerender]')?.remove();
  const capWrap = ctx.h('div', { class: 'fig__steps' });
  const capItems = [...ctx.steps.map((s, i) => ({ html: s.html, num: `Step ${i + 1} <span class="of">of ${ctx.steps.length}</span>` })),
    { html: ALT, num: '<span class="onc-alt-num">Interferon response working</span>' }];
  const capEls = capItems.map((it) => {
    const el = ctx.h('div', { class: 'fig__step', 'aria-hidden': 'true' },
      ctx.h('span', { class: 'fig__step-num', html: it.num }), ctx.h('p', { class: 'fig__step-text', html: it.html }));
    capWrap.append(el);
    return el;
  });
  const note = ctx.h('p', { class: 'onc-note', hidden: true, text: NOTE });
  ctx.caption.append(capWrap, note);
  let capIndex = -1;
  function setCaption(i, announce = true) {
    if (i === capIndex) return;
    capIndex = i;
    capEls.forEach((el, k) => { el.classList.toggle('is-active', k === i); el.setAttribute('aria-hidden', String(k !== i)); });
    if (announce && i >= 0) ctx.announce(capItems[i].html.replace(/<[^>]+>/g, ''));
  }
  const capFor = (t, started) => {
    if (!started) return 0;
    let i = 0;
    for (let k = 0; k < PHASES.length; k++) if (t >= PHASES[k] - 1e-6) i = k;
    return mode === 'working' && i >= 1 ? 5 : i;
  };

  // ---------------------------------------------------------------- state
  let mode = 'broken';
  let L = null;            // layout
  let cells = [];          // all tumor-area cells
  let plan = null;         // the scheduled run
  let T = 0;               // sim time
  let started = false, running = false, ended = false, everEnded = false;
  let wall = 0;            // ambient clock (bob)
  let sheet = null, sheetKey = '';
  let lnInfo = null;
  let routes = {};
  const deco = {};         // svg nodes updated per frame

  // ---------------------------------------------------------------- scene geometry
  function layoutCells() {
    const out = [];
    const Rr = rng(5);
    const add = (region, kind, x, y, r, i) => out.push({ id: out.length, region, kind, x, y, r, variant: i % 4, bob: Rr() * TAU,
      rot: kind === 'cancer' ? Rr.range(-0.9, 0.9) : Rr.range(-0.3, 0.3), sz: kind === 'cancer' ? Rr.range(0.93, 1.06) : Rr.range(0.96, 1.04) });
    const I = L.inj, D = L.dist;
    const m = packHex(25, I.rc, 1.06, I.seed);
    m.forEach((p, i) => add('inj', 'cancer', I.cx + p.x, I.cy + p.y, I.rc, i));
    const reach = Math.max(...m.map((p) => Math.hypot(p.x, p.y)));
    const step = 360 / I.nh;
    for (let k = 0; k < I.nh; k++) {
      const deg = I.needle + step / 2 + k * step + (k % 3 === 1 ? Rr.range(-7, 7) : Rr.range(-3, 3));
      const a = (deg * Math.PI) / 180;
      const rr = reach + I.rc + I.rh + 7 + Rr.range(0, I.ring);
      add('inj', 'healthy', I.cx + Math.cos(a) * rr, I.cy + Math.sin(a) * rr * 0.95, I.rh, k);
    }
    L.tip = { x: I.cx + Math.cos((I.needle * Math.PI) / 180) * (reach + I.rc * 0.2), y: I.cy + Math.sin((I.needle * Math.PI) / 180) * (reach + I.rc * 0.2) * 0.95 };
    const dm = packHex(12, D.rc, 1.08, D.seed);
    dm.forEach((p, i) => add('dist', 'cancer', D.cx + p.x, D.cy + p.y, D.rc, i + 1));
    const dreach = Math.max(...dm.map((p) => Math.hypot(p.x, p.y)));
    D.ring.forEach((deg, k) => {
      const a = (deg * Math.PI) / 180;
      const rr = dreach + D.rc + D.rh + 6 + Rr.range(0, 8);
      add('dist', 'healthy', D.cx + Math.cos(a) * rr, D.cy + Math.sin(a) * rr, D.rh, k + 2);
    });
    return out;
  }

  // ---------------------------------------------------------------- the plan (seeded, deterministic)
  function buildPlan(md) {
    const R = rng(md === 'broken' ? 101 : 202);
    const Z = L.sizes;
    for (const c of cells) Object.assign(c, { infectAt: null, burstAt: null, killAt: null, halo: [], shieldAt: null, dots: null, defended: false });
    const P = { virions: [], rings: [], beads: [], sparks: [], dcs: [], tcells: [], kills: [], end: END };
    const inj = cells.filter((c) => c.region === 'inj');
    const cancers = inj.filter((c) => c.kind === 'cancer');
    const tip = L.tip;
    const byTip = (list) => list.slice().sort((a, b) => dist(a, tip) - dist(b, tip));
    const neighbors = (c, k, filter = () => true) => inj.filter((o) => o !== c && filter(o)).sort((a, b) => dist(a, c) - dist(b, c)).slice(0, k);

    const addHalo = (c, t, k) => { c.halo.push({ t, k }); };
    const haloK = (c, t) => { let k = 0; for (const h of c.halo) if (h.t <= t) k = Math.max(k, h.k); return k; };
    const respondsToIFN = (c) => c.kind === 'healthy' || md === 'working';

    // a defended cell: halo + shield, the virion inside fades, rings go to 3 neighbors
    function defend(c, t) {
      if (c.defended) return;
      c.defended = true;
      addHalo(c, t + 0.15, 1);
      c.shieldAt = t + 0.5;
      neighbors(c, 3).forEach((nb, i) => {
        const t0 = t + 0.55 + i * 0.2, t1 = t0 + 1.1 + R.range(0, 0.35);
        P.rings.push({ x0: c.x, y0: c.y, x1: nb.x, y1: nb.y, r0: c.r, r1: nb.r, t0, t1, wob: R.range(-1, 1) * 8 });
        if (respondsToIFN(nb)) addHalo(nb, t1, 0.5);
      });
    }

    // 1 · injection: 20 virions from the needle tip
    const hT = byTip(inj.filter((c) => c.kind === 'healthy')).slice(0, 3);
    const cT = byTip(cancers).slice(0, 6);
    const aims = [hT[0], cT[0], hT[1], cT[1], cT[2], null, hT[0], cT[3], cT[0], null, hT[2], cT[4], cT[1], null, cT[2], cT[5] || null, null, cT[3], cT[4], null];
    const arrivals = new Map();
    aims.forEach((c, k) => {
      const t0 = 1.05 + k * 0.075 + R.range(0, 0.04);
      if (c) {
        const ang = Math.atan2(tip.y - c.y, tip.x - c.x) + R.range(-0.5, 0.5);
        const x1 = c.x + Math.cos(ang) * c.r * 0.38, y1 = c.y + Math.sin(ang) * c.r * 0.38;
        const t1 = t0 + 0.55 + Math.hypot(x1 - tip.x, y1 - tip.y) / 105;
        P.virions.push({ x0: tip.x, y0: tip.y, x1, y1, t0, t1, end: 'enter', cell: c, wob: R.range(-1, 1) * 14, fade: c.kind === 'healthy' ? 1.2 : 0.35 });
        if (!arrivals.has(c) || arrivals.get(c) > t1) arrivals.set(c, t1);
      } else {
        const a = R.range(-0.9, 0.9), d = R.range(40, 120) * (L.compact ? 0.65 : 1);
        const x1 = tip.x + Math.cos(a) * d, y1 = tip.y + Math.sin(a) * d;
        P.virions.push({ x0: tip.x, y0: tip.y, x1, y1, t0, t1: t0 + 1.3 + d / 160, end: 'free', wob: R.range(-1, 1) * 12, fade: R.range(2.2, 3.4) });
      }
    });

    // 2 · who defends, who lets the virus multiply
    const budget = md === 'broken' ? 16 : 2;
    let infected = 0;
    const queue = [];
    const infect = (c, t) => {
      if (c.infectAt != null) return false;
      c.infectAt = t;
      c.burstAt = t + 2.45 + R.range(0, 0.35);
      const Rd = rng(c.id * 7 + 3);
      c.dots = Array.from({ length: 8 }, () => { const a = Rd.range(0, TAU), rr = Math.sqrt(Rd()) * c.r * 0.5; return { x: Math.cos(a) * rr, y: Math.sin(a) * rr }; });
      infected++;
      queue.push(c);
      return true;
    };
    [...arrivals.entries()].sort((a, b) => a[1] - b[1]).forEach(([c, t]) => {
      if (c.kind === 'healthy') defend(c, t);
      else if (infected < budget) infect(c, t);
      else defend(c, t);   // (working mode: the alarm wins)
    });

    // 3 · bursts, in time order; each releases virions (some infect neighbors), proteins, sparks
    let healthyHits = inj.filter((c) => c.kind === 'healthy' && c.defended).length;
    while (queue.length) {
      queue.sort((a, b) => a.burstAt - b.burstAt);
      const c = queue.shift();
      const tb = c.burstAt;
      const cand = neighbors(c, 6, (o) => o.kind === 'cancer' && o.infectAt == null && !(o.defended)).filter((o) => dist(o, c) < c.r * 2.75);
      const nInf = md === 'broken' ? 2 : 0;
      let k = 0;
      const outs = [];
      for (const nb of cand) {
        if (k >= nInf || infected >= budget) break;
        const ang = Math.atan2(c.y - nb.y, c.x - nb.x) + R.range(-0.4, 0.4);
        const x1 = nb.x + Math.cos(ang) * nb.r * 0.35, y1 = nb.y + Math.sin(ang) * nb.r * 0.35;
        const t1 = tb + 0.7 + R.range(0, 0.3);
        const d0 = c.dots[k];
        P.virions.push({ x0: c.x + d0.x, y0: c.y + d0.y, x1, y1, t0: tb, t1, end: 'enter', cell: nb, wob: R.range(-1, 1) * 8, fade: 0.35 });
        infect(nb, t1);
        outs.push(nb);
        k++;
      }
      // a healthy neighbor may catch one too, and defends itself
      const hn = neighbors(c, 4, (o) => o.kind === 'healthy').find((o) => dist(o, c) < c.r * 3.2);
      if (hn && healthyHits < 8 && !hn.defended && md === 'broken') {
        const ang = Math.atan2(c.y - hn.y, c.x - hn.x);
        const x1 = hn.x + Math.cos(ang) * hn.r * 0.35, y1 = hn.y + Math.sin(ang) * hn.r * 0.35;
        const t1 = tb + 0.85 + R.range(0, 0.3);
        P.virions.push({ x0: c.x + c.dots[k].x, y0: c.y + c.dots[k].y, x1, y1, t0: tb, t1, end: 'enter', cell: hn, wob: R.range(-1, 1) * 8, fade: 1.2 });
        defend(hn, t1);
        healthyHits++;
        k++;
      }
      // the rest drift off and fade (or stop at a defended neighbor's halo)
      for (; k < 6; k++) {
        const d0 = c.dots[k % 8];
        const a = Math.atan2(d0.y, d0.x) + R.range(-0.3, 0.3);
        let dd = c.r * R.range(1.4, 2.6);
        let x1 = c.x + Math.cos(a) * dd, y1 = c.y + Math.sin(a) * dd;
        let end = 'free';
        const t1 = tb + 0.9 + R.range(0, 0.5);
        const block = inj.find((o) => o !== c && haloK(o, t1) > 0 && Math.hypot(o.x - x1, o.y - y1) < o.r * 1.45);
        if (block) {
          const bb = Math.atan2(y1 - block.y, x1 - block.x);
          x1 = block.x + Math.cos(bb) * block.r * 1.45; y1 = block.y + Math.sin(bb) * block.r * 1.45;
          end = 'blocked';
        }
        P.virions.push({ x0: c.x + d0.x, y0: c.y + d0.y, x1, y1, t0: tb, t1, end, wob: R.range(-1, 1) * 6, fade: end === 'blocked' ? 0.6 : R.range(1.4, 2.4) });
      }
      // tumor proteins (hot-pink beads) settle nearby; danger sparks drift and fade
      const nb = 3;
      for (let i = 0; i < nb; i++) {
        const a = (i / nb) * TAU + R.range(-0.5, 0.5), dd = c.r * R.range(0.45, 1.15);
        P.beads.push({ x0: c.x, y0: c.y, x1: c.x + Math.cos(a) * dd, y1: c.y + Math.sin(a) * dd, t0: tb + 0.05, t1: tb + 0.95, pick: null, burst: c });
      }
      for (let i = 0; i < 3; i++) {
        const a = (i / 3) * TAU + R.range(-0.6, 0.6), dd = c.r * R.range(1.4, 2.3);
        P.sparks.push({ x0: c.x, y0: c.y, x1: c.x + Math.cos(a) * dd, y1: c.y + Math.sin(a) * dd, t0: tb + 0.05, life: 2.6 + R.range(0, 0.6), rot: R.range(0, 90) });
      }
    }

    // 4 · dendritic cells collect proteins, mature, walk the lymph route to the node
    const nDC = md === 'broken' ? 3 : 1;
    const dcIdx = md === 'broken' ? [0, 1, 2] : [1];
    const ln = lnInfo;
    const N = (u, v) => ({ x: ln.cx + u * ln.rx, y: ln.cy + v * ln.ry });
    const dests = [N(-0.62, -0.06), N(-0.33, 0.42), N(-0.27, -0.44)];
    const lymph = routes.lymph;
    const free = new Set(P.beads);
    for (let n = 0; n < nDC; n++) {
      const i = dcIdx[n];
      const from = { x: L.dcFrom[i][0], y: L.dcFrom[i][1] };
      // greedy nearest beads from the entry point
      const picks = [];
      let at = from;
      const want = md === 'broken' ? 3 : 3;
      for (let k = 0; k < want; k++) {
        let best = null, bd = Infinity;
        for (const b of free) { const d = Math.hypot(b.x1 - at.x, b.y1 - at.y) + (k === 0 ? 0 : 0); if (d < bd) { bd = d; best = b; } }
        if (!best) break;
        free.delete(best);
        picks.push(best);
        at = { x: best.x1, y: best.y1 };
      }
      const pts = [[from.x, from.y], ...picks.map((b) => [b.x1, b.y1]), [lymph.xs[0], lymph.ys[0]]];
      const walk = curve(pts, 14);
      const dest = dests[n === 0 && nDC === 1 ? 1 : n];
      const settle = curve([[lymph.xs[lymph.xs.length - 1], lymph.ys[lymph.ys.length - 1]], [dest.x, dest.y]], 6);
      const J = join([walk, lymph, settle]);
      const t0 = 12.4 + n * 0.35, t1 = 18.3 + n * 0.25;
      const dc = { J, t0, t1, seed: i + 1, variant: i, picks: [], matureAt: null, enterU: 0 };
      // time at which the journey passes each bead (invert the eased arc-length param)
      const timeAtU = (u) => {
        let lo = t0, hi = t1;
        for (let it = 0; it < 30; it++) { const m = (lo + hi) / 2; if (eio(seg(m, t0, t1)) < u) lo = m; else hi = m; }
        return (lo + hi) / 2;
      };
      picks.forEach((b, k) => {
        const u = nearestU(J, { x: b.x1, y: b.y1 });
        const tp = Math.max(timeAtU(u), b.t1 + 0.2);
        const oa = (k / Math.max(1, picks.length)) * TAU + 0.6;
        b.pick = { dc, t: tp, ox: Math.cos(oa) * L.sizes.rdc * 0.42, oy: Math.sin(oa) * L.sizes.rdc * 0.42 };
        dc.picks.push(b);
      });
      dc.matureAt = (dc.picks[1] || dc.picks[0]) ? (dc.picks[1] || dc.picks[0]).pick.t + 0.2 : t0 + 2;
      dc.lymphU = [nearestU(J, { x: lymph.xs[0], y: lymph.ys[0] }), nearestU(J, { x: lymph.xs[lymph.xs.length - 1], y: lymph.ys[lymph.ys.length - 1] })];
      P.dcs.push(dc);
    }

    // T cells: six resting in the node; the ones that meet a DC brighten, step aside and photocopy
    const rest = [N(0.02, -0.6), N(0.4, -0.55), N(0.78, -0.15), N(0.74, 0.42), N(-0.06, 0.3), N(0.3, 0.52)].map((p, k) => ({ ...p, k }));
    const clusters = [N(0.17, -0.04), N(0.53, 0.14)];
    const rt = Z.rt;
    const nAct = md === 'broken' ? 2 : 1;
    const used = new Set();
    const acts = [];
    for (let n = 0; n < nAct; n++) {
      const dc = P.dcs[n];
      const dp = dc.J.at(1);
      let best = null, bd = Infinity;
      rest.forEach((p) => { if (used.has(p)) return; const d = Math.hypot(p.x - dp.x, p.y - dp.y); if (d < bd) { bd = d; best = p; } });
      used.add(best);
      const ang = Math.atan2(best.y - dp.y, best.x - dp.x);
      const reachD = Z.rdc * 0.5 + rt * 1.15;
      acts.push({ p: best, contact: { x: dp.x + Math.cos(ang) * reachD, y: dp.y + Math.sin(ang) * reachD },
        ring: { x: dp.x + Math.cos(ang) * (reachD - rt * 0.9), y: dp.y + Math.sin(ang) * (reachD - rt * 0.9) }, tc: 18.75 + n * 0.3, n });
    }
    rest.forEach((p) => {
      const act = acts.find((q) => q.p === p);
      const cell = { id: P.tcells.length, legs: [], home: { x: p.x, y: p.y }, start: { x: p.x, y: p.y }, born: -1, activeAt: null, variant: p.k % 3, resting: true, rest0: 0 };
      if (act) {
        const K = clusters[act.n];
        cell.legs.push({ t0: act.tc - 0.55, t1: act.tc, J: curve([[p.x, p.y], [act.contact.x, act.contact.y]], 6) });
        cell.legs.push({ t0: act.tc + 0.75, t1: act.tc + 1.35, J: curve([[act.contact.x, act.contact.y], [lerp(act.contact.x, K.x, 0.5), lerp(act.contact.y, K.y, 0.5) - 6], [K.x, K.y]], 8) });
        cell.home = { x: K.x, y: K.y };
        cell.activeAt = act.tc + 0.15;
        cell.contactAt = act.tc;
        cell.ringAt = act.ring;
      }
      P.tcells.push(cell);
    });
    // divisions ("photocopying"): 2 → 4 → 8 (broken) · 1 → 2 → 3 (working); daughters keep the clone
    const gapD = rt * GAP;
    const divide = (cell, td, ang) => {
      const pos = cell.home;
      cell.divAt = td; cell.divAng = ang;
      return [-1, 1].map((sgn) => {
        const k = { id: P.tcells.length, legs: [], home: { x: pos.x + Math.cos(ang) * gapD * sgn, y: pos.y + Math.sin(ang) * gapD * sgn },
          born: td + 0.8, activeAt: -1, variant: cell.variant, resting: false, rest0: ang + (sgn > 0 ? 0 : Math.PI) };
        P.tcells.push(k);
        return k;
      });
    };
    const army = [];
    P.tcells.filter((c) => c.activeAt != null).forEach((c, n) => {
      const a0 = n === 0 ? -0.35 : 0.5;
      const t1 = c.contactAt + 1.4;
      const [a, b] = divide(c, t1, a0);
      if (md === 'broken') army.push(...divide(a, t1 + 0.95, a0 + Math.PI / 2), ...divide(b, t1 + 1.05, a0 + Math.PI / 2));
      else army.push(b, ...divide(a, t1 + 0.95, a0 + Math.PI / 2));
    });

    // 5 · patrol: the blood routes to both tumors; crowd kills
    const survivorsInj = cancers.filter((c) => c.infectAt == null).sort((a, b) => b.y - a.y);
    const distC = cells.filter((c) => c.region === 'dist' && c.kind === 'cancer').sort((a, b) => a.y - b.y);
    const A = routes.bloodA, B = routes.bloodB;
    const toA = md === 'broken' ? army.slice(0, 5) : army.slice(0, 3);
    const toB = md === 'broken' ? army.slice(5, 8) : [];
    const killsA = md === 'broken' ? 4 : 1;
    const killsB = md === 'broken' ? 3 : 0;
    const taken = new Set();
    const pickTarget = (list) => {
      const best = list.find((c) => !taken.has(c)) || null;
      if (best) taken.add(best);
      return best;
    };
    const ride = (t, route, list, nKill, k, tStart) => {
      const exitBias = route === A ? 0 : 1;
      const start = { x: route.xs[0], y: route.ys[0] };
      const leave = curve([[t.home.x, t.home.y], [start.x, start.y]], 6);
      const target = k < nKill ? pickTarget(list) : null;
      let uExit = 1;
      if (route === A && target) {
        // ride the band until under the target
        let best = 0, bd = Infinity;
        for (let i = 0; i < route.xs.length; i++) { const d = Math.abs(route.xs[i] - target.x) + (route.ys[i] < route.ys[route.ys.length - 1] - 8 ? 400 : 0); if (d < bd) { bd = d; best = i; } }
        uExit = route.ls[best] / route.length;
      } else if (route === A) {
        const near = list.find((c) => !taken.has(c));
        let best = 0, bd = Infinity;
        const want = near ? near.x + rt * 3 : route.xs[0] - 200;
        for (let i = 0; i < route.xs.length; i++) { const d = Math.abs(route.xs[i] - want) + (route.ys[i] < route.ys[route.ys.length - 1] - 8 ? 400 : 0); if (d < bd) { bd = d; best = i; } }
        uExit = route.ls[best] / route.length;
        t.near = near;
      }
      const ridePart = sub(route, 0, uExit);
      const ex = ridePart.at(1);
      const t0 = tStart, tLeave = t0 + 0.7;
      const rideDur = ridePart.length / L.speed.ride + 0.5;
      t.legs.push({ t0, t1: tLeave, J: leave });
      t.legs.push({ t0: tLeave, t1: tLeave + rideDur, J: ridePart, lin: true });
      const tIn = tLeave + rideDur;
      if (target) {
        const ang = Math.atan2(ex.y - target.y, ex.x - target.x);
        const cpt = { x: target.x + Math.cos(ang) * (target.r + rt * 1.15), y: target.y + Math.sin(ang) * (target.r + rt * 1.15) };
        const crawl = curve([[ex.x, ex.y], [lerp(ex.x, cpt.x, 0.5) + (exitBias ? 6 : 0), lerp(ex.y, cpt.y, 0.5)], [cpt.x, cpt.y]], 10);
        const tArr = tIn + 0.3 + crawl.length / L.speed.crawl;
        t.legs.push({ t0: tIn, t1: tArr, J: crawl });
        const tKill = tArr + 0.55;
        target.killAt = tKill;
        P.kills.push({ cell: target, by: t, at: { x: (cpt.x + target.x) / 2 + Math.cos(ang) * target.r * 0.25, y: (cpt.y + target.y) / 2 + Math.sin(ang) * target.r * 0.25 }, tRing: tArr, tKill });
        // detach and move on a little
        const away = { x: cpt.x + Math.cos(ang) * rt * 1.4, y: cpt.y + Math.sin(ang) * rt * 1.4 };
        t.legs.push({ t0: tKill + 0.8, t1: tKill + 2.6, J: curve([[cpt.x, cpt.y], [away.x, away.y]], 6) });
      } else {
        // patrols, finds nothing in time
        let wander;
        if (route === A && t.near) {
          // stop short of the cell, on a spot that is not on top of a healthy neighbor
          const hs = inj.filter((c) => c.kind === 'healthy');
          wander = { x: ex.x, y: ex.y - rt * 3 };
          for (let k2 = 20; k2 >= 0; k2--) {
            const q = { x: lerp(ex.x, t.near.x, k2 / 20), y: lerp(ex.y, t.near.y, k2 / 20) };
            if (Math.hypot(q.x - t.near.x, q.y - t.near.y) < t.near.r + rt * 1.6) continue;
            if (hs.some((h) => Math.hypot(q.x - h.x, q.y - h.y) < h.r + rt * 1.1)) continue;
            wander = q; break;
          }
        } else wander = route === A ? { x: ex.x + 10, y: ex.y - (L.compact ? 30 : 46) } : { x: ex.x - (L.compact ? 30 : 34), y: ex.y + (L.compact ? 4 : 8) };
        t.legs.push({ t0: tIn, t1: tIn + 3.0, J: curve([[ex.x, ex.y], [wander.x, wander.y]], 6) });
      }
    };
    toA.forEach((t, k) => ride(t, A, survivorsInj, killsA, k, 22.0 + k * 0.26));
    toB.forEach((t, k) => ride(t, B, distC, killsB, k, 22.1 + k * 0.34));
    return P;
  }
  function sub(J, u0, u1) {
    const xs = [], ys = [];
    const n = Math.max(4, Math.ceil(((u1 - u0) * J.length) / 6));
    for (let i = 0; i <= n; i++) { const p = J.at(lerp(u0, u1, i / n)); xs.push(p.x); ys.push(p.y); }
    const ls = [0];
    for (let i = 1; i < xs.length; i++) ls.push(ls[i - 1] + Math.hypot(xs[i] - xs[i - 1], ys[i] - ys[i - 1]));
    return polyline(xs, ys, ls);
  }

  // ---------------------------------------------------------------- static drawing (svg back + front)
  function drawStatic() {
    for (const svg of [back, front]) {
      for (const n of [...svg.children]) if (n !== svg.defs) n.remove();
      svg.setAttribute('viewBox', `0 0 ${L.W} ${L.H}`);
    }
    ctx.refreshTextScale();
    const { W, H } = L;
    back.append(tissueField({ width: W, height: H, seed: 11, stage: 'dark', density: L.compact ? 0.5 : 0.65 }));
    // tumor beds (soft violet pools) group each mass
    const bed = ctx.radialGradient(back, [[0, C.cancer, 0.16], [0.6, C.cancer, 0.07], [1, C.cancer, 0]]);
    const I = L.inj, D = L.dist;
    const injR = Math.max(...cells.filter((c) => c.region === 'inj' && c.kind === 'cancer').map((c) => Math.hypot(c.x - I.cx, c.y - I.cy))) + I.rc * 2.2;
    const disR = Math.max(...cells.filter((c) => c.region === 'dist' && c.kind === 'cancer').map((c) => Math.hypot(c.x - D.cx, c.y - D.cy))) + D.rc * 2.2;
    S('ellipse', { cx: I.cx, cy: I.cy, rx: f2(injR), ry: f2(injR * 0.96), fill: bed }, back);
    S('ellipse', { cx: D.cx, cy: D.cy, rx: f2(disR), ry: f2(disR), fill: bed }, back);
    // lymph node interior
    const lnf = lymphNodeField({ x: L.ln.x, y: L.ln.y, width: L.ln.w, height: L.ln.h, seed: 4, stage: 'dark', follicles: L.compact ? 2 : 3, density: L.compact ? 0.65 : 0.8, label: false });
    back.append(lnf);
    lnInfo = cellInfo(lnf);
    // routes (same grammar as ch12-neoadjuvant)
    routes = { lymph: curve(L.lymph), bloodA: curve(L.bloodA), bloodB: curve(L.bloodB) };
    drawBlood(back, routes.bloodA, L.compact ? 11 : 15);
    drawBlood(back, routes.bloodB, L.compact ? 11 : 15);
    drawLymph(back, routes.lymph);

    // front: labels (always horizontal), syringe
    const lab = S('g', { class: 'onc-labels' }, front);
    const capsLabel = (text, x, y, anchor = 'start') => S('text', { class: 't-caps t-halo', x, y, 'text-anchor': anchor, text }, lab);
    capsLabel('Injected tumor', I.label[0], I.label[1]);
    if (L.compact) {
      capsLabel('Distant tumor · not injected', D.label[0], D.label[1], 'middle');
    } else {
      capsLabel('Distant tumor', D.label[0], D.label[1] - 14, 'middle');
      S('text', { class: 't-small t-halo', x: D.label[0], y: D.label[1], 'text-anchor': 'middle', text: 'not injected' }, lab);
    }
    const lnc = lnInfo;
    if (L.compact) capsLabel('Lymph node', lnc.cx + lnc.rx * 0.36, lnc.cy + lnc.ry * 0.86, 'middle');
    else capsLabel('Lymph node', lnc.cx - lnc.rx * 0.18, lnc.cy + lnc.ry * 0.8, 'middle');
    const LA = L.labelsAt;
    const routeLabel = (text, p) => S('text', { class: 't-caps t-halo', x: p.x, y: p.y, 'text-anchor': p.anchor || 'middle', text, style: 'fill: var(--fg-3)' }, lab);
    routeLabel('Lymph', LA.lymph);
    routeLabel('Blood', LA.bloodA);
    if (!L.compact) routeLabel('Blood', LA.bloodB);

    const leader = (text, p, cls = 't-label') => {
      const g = S('g', { opacity: 0 }, lab);
      if (p.to) {
        const tx = p.anchor === 'end' ? p.x + 4 : p.anchor === 'start' ? p.x - 4 : p.x;
        S('line', { class: 'leader', x1: tx, y1: p.y - 5, x2: p.to[0], y2: p.to[1] }, g);
        S('circle', { class: 'leader-dot', cx: p.to[0], cy: p.to[1], r: 2.4 }, g);
      }
      S('text', { class: `${cls} t-halo`, x: p.x, y: p.y, 'text-anchor': p.anchor || 'middle', text }, g);
      return g;
    };
    deco.labels = {
      cancer: leader('Cancer cells', LA.cancer),
      healthy: leader('Healthy cells', LA.healthy),
      tcell: leader('Resting T cells', LA.tcell, 't-small'),
    };
    // floating labels placed per frame
    const floatLabel = (text, cls = 't-small') => {
      const g = S('g', { opacity: 0 }, lab);
      S('text', { class: `${cls} t-halo`, x: 0, y: 0, 'text-anchor': 'middle', text }, g);
      return g;
    };
    deco.float = {
      dc: floatLabel('Dendritic cell'),
      killers: floatLabel('Killer T cells'),
    };
    // callouts: fixed text in a quiet margin + a leader that finds its (moving) subject
    const callout = (text, p, two) => {
      if (!p) return null;
      const g = S('g', { opacity: 0 }, lab);
      const line = S('line', { class: 'leader', x1: p.x, y1: p.y, x2: p.x, y2: p.y }, g);
      const dot = S('circle', { class: 'leader-dot', cx: p.x, cy: p.y, r: 2.4 }, g);
      S('text', { class: 't-small t-halo', x: p.x, y: p.y, text }, g);
      if (two) S('text', { class: 't-small t-halo', x: p.x, y: p.y + 16, text: two }, g);
      return { g, line, dot, p, w: Math.max(text.length, two ? two.length : 0) * 6.6 };
    };
    const CO = L.callouts || {};
    deco.callouts = {
      virus: callout('Virus (enlarged)', CO.virus),
      alarm: callout('Interferon', CO.alarm),
      proteins: callout('Tumor proteins', CO.proteins, CO.proteins && CO.proteins.two),
    };

    // syringe (single-use prop, drawn locally): barrel, plunger, needle pointing into the tumor
    const sy = S('g', { opacity: 0, class: 'onc-syringe' }, front);
    const k = L.compact ? 0.62 : 1;
    const sx = (v) => f2(v * k);
    const holder = S('g', { transform: `translate(${f2(L.tip.x)} ${f2(L.tip.y)}) rotate(${L.inj.needle - 180})` }, sy);
    const body = S('g', { transform: 'translate(0 0)' }, holder);
    S('line', { x1: sx(-30), y1: 0, x2: 0, y2: 0, style: 'stroke: #D9DEEA; stroke-width: 1.6; stroke-linecap: round' }, body);
    S('rect', { x: sx(-82), y: sx(-8), width: sx(52), height: sx(16), rx: sx(4), style: `fill: ${mix(C.virus, '#0B1024', 0.55)}; fill-opacity: 0.55; stroke: #D9DEEA; stroke-opacity: 0.85; stroke-width: 1.4` }, body);
    S('rect', { x: sx(-60), y: sx(-6), width: sx(29), height: sx(12), rx: sx(2.5), style: `fill: ${C.virus}; fill-opacity: 0.5` }, body);
    S('rect', { x: sx(-86), y: sx(-11), width: sx(4), height: sx(22), rx: sx(1.5), style: 'fill: #D9DEEA; fill-opacity: 0.85' }, body);
    S('line', { x1: sx(-104), y1: 0, x2: sx(-62), y2: 0, style: 'stroke: #D9DEEA; stroke-opacity: 0.8; stroke-width: 2.4; stroke-linecap: round' }, body);
    S('rect', { x: sx(-108), y: sx(-7), width: sx(4), height: sx(14), rx: sx(1.5), style: 'fill: #D9DEEA; fill-opacity: 0.8' }, body);
    deco.syringe = sy;
    deco.syringeBody = body;
  }

  function drawLymph(parent, J) {
    const g = S('g', { class: 'route route--lymph' }, parent);
    S('path', { d: J.d, fill: 'none', stroke: C.lymph, 'stroke-opacity': 0.07, 'stroke-width': 10, 'stroke-linecap': 'round' }, g);
    const dots = S('path', { d: J.d, fill: 'none', stroke: C.lymph, 'stroke-opacity': 0.75, 'stroke-width': 2.4, 'stroke-linecap': 'round', 'stroke-dasharray': '0.1 7' }, g);
    const step = L.compact ? 46 : 64;
    for (let s = step * 0.6; s < J.length - 10; s += step) {
      const p = J.at(s / J.length);
      S('path', { d: 'M-3.5 -4L1.5 0L-3.5 4', transform: `translate(${f2(p.x)} ${f2(p.y)}) rotate(${f2((p.a * 180) / Math.PI)})`, fill: 'none', stroke: C.lymph, 'stroke-opacity': 0.7, 'stroke-width': 1.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    }
    if (!RM) ctx.ambient(ctx.gsap.fromTo(dots, { strokeDashoffset: 0 }, { strokeDashoffset: -14.2, duration: 1.6, ease: 'none', repeat: -1 }));
  }
  function drawBlood(parent, J, w) {
    const g = S('g', { class: 'route route--blood' }, parent);
    S('path', { d: J.d, fill: 'none', stroke: C.blood, 'stroke-opacity': 0.08, 'stroke-width': w + 10, 'stroke-linecap': 'round' }, g);
    S('path', { d: J.d, fill: 'none', stroke: C.blood, 'stroke-opacity': 0.16, 'stroke-width': w, 'stroke-linecap': 'round' }, g);
    S('path', { d: J.d, fill: 'none', stroke: C.blood, 'stroke-opacity': 0.3, 'stroke-width': 1, 'stroke-linecap': 'round', transform: '' }, g);
    const flow = S('path', { d: J.d, fill: 'none', stroke: mix(C.blood, '#FFFFFF', 0.25), 'stroke-opacity': 0.5, 'stroke-width': Math.max(2, w * 0.2), 'stroke-linecap': 'round', 'stroke-dasharray': '2 16' }, g);
    if (!RM) ctx.ambient(ctx.gsap.fromTo(flow, { strokeDashoffset: 0 }, { strokeDashoffset: -36, duration: 2.4, ease: 'none', repeat: -1 }));
  }

  // ---------------------------------------------------------------- sprites
  let px = 2;             // device px per view unit (sprite raster scale)
  let haloImg = null, shieldImg = null;
  async function loadSprites() {
    const Z = L.sizes;
    const key = `${L.compact}-${px.toFixed(2)}`;
    if (key === sheetKey && sheet) return;
    sheetKey = key;
    const scale = clamp(px, 1, 3);
    sheet = await spriteStates({
      cancer: ['cancerCell', { r: L.inj.rc, stage: 'dark' }, 4],
      healthy: ['healthyCell', { r: L.inj.rh, stage: 'dark' }, 4],
      dcI: ['dendriticCell', { r: Z.rdc, state: 'immature', stage: 'dark' }, 3],
      dcM: ['dendriticCell', { r: Z.rdc, state: 'mature', stage: 'dark' }, 3],
      tR: ['tCell', { variant: 'cd8', r: Z.rt, state: 'resting', stage: 'dark' }, 3],
      tA: ['tCell', { variant: 'cd8', r: Z.rt, state: 'activated', polarity: 0, stage: 'dark' }, 3],
      vir: ['virus', { r: Z.rv, seed: 3, stage: 'dark' }],
      ifn: ['interferon', { color: C.healthy, size: Z.ifn, seed: 1, stage: 'dark' }],
      spark: ['dangerSpark', { size: Z.spark, seed: 1, stage: 'dark' }],
      bead: ['cytokine', { color: C.pink, size: Z.bead, seed: 1, stage: 'dark' }],
    }, { scale });
    // halo + shield bitmaps (sand = the sender's color, rule 12)
    const hr = Math.ceil(L.inj.rh * 1.75 * scale);
    haloImg = document.createElement('canvas');
    haloImg.width = haloImg.height = hr * 2;
    const hg = haloImg.getContext('2d');
    const grad = hg.createRadialGradient(hr, hr, 0, hr, hr, hr);
    const sand = (a) => `rgba(233,201,161,${a})`;
    grad.addColorStop(0, sand(0));
    grad.addColorStop(0.5, sand(0.0));
    grad.addColorStop(0.62, sand(0.34));
    grad.addColorStop(0.7, sand(0.22));
    grad.addColorStop(1, sand(0));
    hg.fillStyle = grad;
    hg.fillRect(0, 0, hr * 2, hr * 2);
    hg.strokeStyle = sand(0.55);
    hg.lineWidth = Math.max(1, 1.1 * scale);
    hg.setLineDash([3 * scale, 3 * scale]);
    hg.beginPath();
    hg.arc(hr, hr, hr * 0.64, 0, TAU);
    hg.stroke();
    const ss = Math.ceil(Z.shield * scale * 1.2);
    shieldImg = document.createElement('canvas');
    shieldImg.width = shieldImg.height = ss;
    const sg = shieldImg.getContext('2d');
    sg.scale(ss / 26, ss / 26);
    sg.translate(1, 1);
    const p = new Path2D(SHIELD);
    sg.fillStyle = 'rgba(11,16,36,0.9)';
    sg.fill(p);
    sg.strokeStyle = '#E9C9A1';
    sg.lineWidth = 2;
    sg.lineJoin = 'round';
    sg.stroke(p);
    sg.strokeStyle = 'rgba(233,201,161,0.9)';
    sg.lineWidth = 1.8;
    sg.beginPath(); sg.moveTo(8.6, 12.2); sg.lineTo(11.2, 14.8); sg.lineTo(15.8, 9.6); sg.stroke();
  }

  // ---------------------------------------------------------------- per-frame rendering (pure in T)
  const A = { x: 0, y: 0, variant: 0, scale: 1, alpha: 1, dying: 0, pinch: null, r: 10 };
  const fxTmp = createEffects();
  const effects = new WeakMap();
  function specksFor(k) {
    let e = effects.get(k);
    if (!e) {
      e = { ghost: { x: k.cell.x, y: k.cell.y, r: k.cell.r } };
      e.fx = killSpecks(fxTmp, e.ghost, { color: mix(C.cancer, '#FFFFFF', 0.15), seed: k.cell.id * 13 + 1 });
      e.ring = contactRing(fxTmp, k.at.x, k.at.y, { color: C.cd8, r: L.sizes.rt * 1.6, life: 0.9 });
      fxTmp.clear();
      effects.set(k, e);
    }
    return e;
  }
  function spr(g, state, variant, x, y, scale = 1, alpha = 1, rotation = 0) {
    if (alpha <= 0.01 || scale <= 0.01) return;
    const img = sheet.get(state, variant);
    if (img) drawSprite(g, img, x, y, { scale, alpha, rotation });
  }
  function virionAt(v, t) {
    const p = seg(t, v.t0, v.t1);
    const ang = Math.atan2(v.y1 - v.y0, v.x1 - v.x0);
    const w = Math.sin(Math.PI * p) * v.wob;
    return { x: lerp(v.x0, v.x1, eo(p)) - Math.sin(ang) * w, y: lerp(v.y0, v.y1, eo(p)) + Math.cos(ang) * w };
  }
  /** Position (and heading) of a walker at time t along its legs; `home` before the first leg. */
  function posOf(t, legs, home, rest0 = 0) {
    let p = { x: home.x, y: home.y, a: rest0 };
    for (const l of legs) {
      if (t < l.t0) break;
      const u = l.lin ? seg(t, l.t0, l.t1) : eio(seg(t, l.t0, l.t1));
      p = l.J.at(u);
    }
    return p;
  }

  function render() {
    if (!sheet || !plan) return;
    const g = cv.g;
    const dpr = cv.dpr || 1;
    const s = Math.min(cv.width / L.W, cv.height / L.H);
    const ox = (cv.width - L.W * s) / 2, oy = (cv.height - L.H * s) / 2;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, cv.width, cv.height);
    g.setTransform(dpr * s, 0, 0, dpr * s, dpr * ox, dpr * oy);
    const t = T;
    const P = plan;
    const Z = L.sizes;
    const bobOn = !RM;
    const bob = (c) => (bobOn ? Math.sin(wall * 0.7 + c.bob) * 0.45 : 0);

    // halos (under the cells)
    for (const c of cells) {
      if (!c.halo.length || c.infectAt != null) continue;
      let k = 0;
      for (const h of c.halo) k = Math.max(k, h.k * eo(seg(t, h.t, h.t + 0.7)));
      if (c.burstAt != null && t > c.burstAt) k *= 1 - seg(t, c.burstAt, c.burstAt + 0.4);
      if (k <= 0.01) continue;
      const hs = c.r * 1.75;
      g.globalAlpha = k;
      g.drawImage(haloImg, c.x - hs, c.y - hs + bob(c), hs * 2, hs * 2);
    }
    g.globalAlpha = 1;

    // cells
    let injLeft = 0, distLeft = 0;
    for (const c of cells) {
      const y = c.y + bob(c);
      if (c.kind === 'healthy') { spr(g, 'healthy', c.variant, c.x, y, c.region === 'dist' ? L.dist.rh / L.inj.rh : 1); continue; }
      const sc0 = c.region === 'dist' ? L.dist.rc / L.inj.rc : 1;
      let alive = true;
      if (c.burstAt != null && t >= c.burstAt - 0.2) {
        const p = seg(t, c.burstAt - 0.2, c.burstAt + 0.3);
        if (p < 1) spr(g, 'cancer', c.variant, c.x, y, sc0 * (1.08 + 0.1 * eo(p)), 1 - eio(p));
        if (t >= c.burstAt) alive = false;
      } else if (c.killAt != null && t >= c.killAt) {
        const k = P.kills.find((q) => q.cell === c);
        const e = specksFor(k);
        const lt = t - c.killAt;
        if (lt < 0.6) {
          A.x = c.x; A.y = y; A.variant = c.variant; A.scale = sc0; A.alpha = 1; A.dying = clamp01(lt / 0.6); A.pinch = null;
          sheet.draw(g, A, { state: 'cancer' });
          e.fx.t = lt; e.fx.step(e.fx); e.fx.draw(g, e.fx);
        }
        alive = false;
      } else {
        let sc = sc0;
        if (c.infectAt != null && t >= c.infectAt) sc *= 1 + 0.08 * eio(seg(t, c.infectAt + 0.3, c.burstAt - 0.2));
        spr(g, 'cancer', c.variant, c.x, y, sc);
      }
      if (alive) { if (c.region === 'inj') injLeft++; else distLeft++; }
      // virions multiplying inside (1 → 8)
      if (c.infectAt != null && t >= c.infectAt + 0.25 && t < c.burstAt + 0.02) {
        const n = 1 + Math.floor(7 * eio(seg(t, c.infectAt + 0.3, c.burstAt - 0.35)));
        for (let i = 0; i < n; i++) {
          const d = c.dots[i];
          const pop = i === 0 ? 1 : eo(seg(t, c.infectAt + 0.3 + (i / 8) * (c.burstAt - c.infectAt - 0.65), c.infectAt + 0.6 + (i / 8) * (c.burstAt - c.infectAt - 0.65)));
          spr(g, 'vir', 0, c.x + d.x, y + d.y, 0.8 * pop, 0.95);
        }
      }
    }
    // alarm halos on packed cancer cells (working alarm) sit above the crowd
    for (const c of cells) {
      if (c.kind !== 'cancer' || !c.halo.length || c.infectAt != null || c.killAt != null && t >= c.killAt) continue;
      let k = 0;
      for (const h of c.halo) k = Math.max(k, h.k * eo(seg(t, h.t, h.t + 0.7)));
      if (k <= 0.01) continue;
      const hs = c.r * 1.75;
      g.globalAlpha = k * 0.7;
      g.drawImage(haloImg, c.x - hs, c.y - hs + bob(c), hs * 2, hs * 2);
    }
    g.globalAlpha = 1;
    // kill specks continue after the cell is gone (drawn above), contact rings
    for (const k of P.kills) {
      const e = specksFor(k);
      if (t >= k.tRing && t < k.tRing + 0.9) { e.ring.t = t - k.tRing; e.ring.draw(g, e.ring); }
    }
    // shields
    for (const c of cells) {
      if (c.shieldAt == null || t < c.shieldAt) continue;
      let a = eo(seg(t, c.shieldAt, c.shieldAt + 0.5));
      if (c.burstAt != null && t > c.burstAt) a = 0;
      const sz = Z.shield;
      g.globalAlpha = a;
      g.drawImage(shieldImg, c.x + c.r * 0.5, c.y - c.r * 1.05 + bob(c), sz * 1.2, sz * 1.2);
    }
    g.globalAlpha = 1;

    // burst fragments (membrane pieces that drift apart and fade)
    g.lineCap = 'round';
    for (const c of cells) {
      if (c.burstAt == null || t < c.burstAt - 0.05 || t > c.burstAt + 1.3) continue;
      const p = seg(t, c.burstAt - 0.05, c.burstAt + 1.3);
      const n = 8;
      g.strokeStyle = mix(C.cancer, '#FFFFFF', 0.35);
      g.lineWidth = Math.max(1.2, c.r * 0.11);
      g.globalAlpha = 0.9 * (1 - eio(p));
      for (let i = 0; i < n; i++) {
        const a = (i / n) * TAU + c.id;
        const rr = c.r * (1.08 + 0.75 * eo(p));
        const span = (TAU / n) * 0.55 * (1 - 0.35 * p);
        const rot = (i % 2 ? 1 : -1) * 0.5 * p;
        g.beginPath();
        g.arc(c.x + Math.cos(a) * c.r * 0.5 * eo(p), c.y + Math.sin(a) * c.r * 0.5 * eo(p), rr * 0.62, a - span / 2 + rot, a + span / 2 + rot);
        g.stroke();
      }
    }
    g.globalAlpha = 1;

    // tumor proteins (beads): settle, wait, ride a dendritic cell once picked up
    const dcPos = new Map();
    for (const dc of P.dcs) dcPos.set(dc, dc.J.at(eio(seg(t, dc.t0, dc.t1))));
    for (const b of P.beads) {
      if (t < b.t0) continue;
      let x = lerp(b.x0, b.x1, eo(seg(t, b.t0, b.t1))), y = lerp(b.y0, b.y1, eo(seg(t, b.t0, b.t1)));
      let a = eo(seg(t, b.t0, b.t0 + 0.3));
      if (b.pick && t >= b.pick.t) {
        const d = dcPos.get(b.pick.dc);
        const q = eio(seg(t, b.pick.t, b.pick.t + 0.5));
        x = lerp(x, d.x + b.pick.ox, q); y = lerp(y, d.y + b.pick.oy, q);
      } else {
        a *= 1 - 0.7 * seg(t, 17, 26);
      }
      spr(g, 'bead', 0, x, y, 1, a);
    }
    // danger sparks
    for (const sp of P.sparks) {
      if (t < sp.t0 || t > sp.t0 + sp.life) continue;
      const p = seg(t, sp.t0, sp.t0 + sp.life);
      const x = lerp(sp.x0, sp.x1, eo(p)), y = lerp(sp.y0, sp.y1, eo(p));
      const img = sheet.get('spark', 0);
      if (img) drawSprite(g, img, x, y, { scale: 1, alpha: Math.min(eo(seg(p, 0, 0.12)), 1 - eio(seg(p, 0.45, 1))), rotation: ((sp.rot + p * 60) * Math.PI) / 180 });
    }
    // interferon rings (hollow, sand: the sender's color)
    for (const r of P.rings) {
      if (t < r.t0 || t > r.t1 + 0.4) continue;
      const p = seg(t, r.t0, r.t1);
      const ang = Math.atan2(r.y1 - r.y0, r.x1 - r.x0);
      const d = Math.hypot(r.x1 - r.x0, r.y1 - r.y0);
      const along = lerp(r.r0 * 0.9, d - r.r1 * 0.95, eo(p));
      const w = Math.sin(Math.PI * p) * r.wob;
      const x = r.x0 + Math.cos(ang) * along - Math.sin(ang) * w, y = r.y0 + Math.sin(ang) * along + Math.cos(ang) * w;
      spr(g, 'ifn', 0, x, y, 1, Math.min(eo(seg(p, 0, 0.15)), 1 - seg(t, r.t1, r.t1 + 0.4)));
    }
    // free virions
    for (const v of P.virions) {
      if (t < v.t0) continue;
      const ang = Math.atan2(v.y1 - v.y0, v.x1 - v.x0);
      let { x, y } = virionAt(v, t);
      let a = eo(seg(t, v.t0, v.t0 + 0.2)), sc = 1;
      if (t > v.t1) {
        const q = seg(t, v.t1, v.t1 + v.fade);
        if (v.end === 'enter') {
          if (v.cell.kind === 'cancer' && v.cell.dots && v.cell.infectAt != null) { if (q >= 1) continue; a *= 1 - q; sc = 1 - 0.2 * q; }
          else { a *= 1 - eio(q); sc = 1 - 0.5 * q; }
        } else if (v.end === 'blocked') { a *= 1 - eio(q); }
        else { x += Math.cos(ang) * 10 * q; y += Math.sin(ang) * 10 * q; a *= 1 - eio(q); }
        if (q >= 1) continue;
      }
      spr(g, 'vir', 0, x, y, sc, a);
    }

    // dendritic cells
    for (const dc of P.dcs) {
      if (t < dc.t0 - 0.01) continue;
      const p = dcPos.get(dc);
      const a = eo(seg(t, dc.t0, dc.t0 + 0.7));
      const m = eio(seg(t, dc.matureAt, dc.matureAt + 0.9));
      if (m < 1) spr(g, 'dcI', dc.variant, p.x, p.y, 1, a * (1 - m));
      if (m > 0) spr(g, 'dcM', dc.variant, p.x, p.y, 1, a * m);
    }
    // beads riding DCs are drawn above them
    for (const b of P.beads) {
      if (!b.pick || t < b.pick.t) continue;
      const d = dcPos.get(b.pick.dc);
      const q = eio(seg(t, b.pick.t, b.pick.t + 0.5));
      const x = lerp(b.x1, d.x + b.pick.ox, q), y = lerp(b.y1, d.y + b.pick.oy, q);
      spr(g, 'bead', 0, x, y, 1, 1);
    }

    // T cells
    for (const tc of P.tcells) {
      if (t < tc.born) continue;
      if (tc.divAt != null && t >= tc.divAt) {
        if (t >= tc.divAt + 0.8) continue;
        // photocopying: two identical copies pinch apart along the division axis
        const p = seg(t, tc.divAt, tc.divAt + 0.8);
        const off = Z.rt * GAP * eio(p);
        const ux = Math.cos(tc.divAng), uy = Math.sin(tc.divAng);
        const sc = lerp(1, 0.94, Math.sin(Math.PI * p) * 0.6);
        spr(g, 'tA', tc.variant, tc.home.x - ux * off, tc.home.y - uy * off, sc);
        spr(g, 'tA', tc.variant, tc.home.x + ux * off, tc.home.y + uy * off, sc);
        continue;
      }
      const pos = posOf(t, tc.legs, tc.start || tc.home, tc.rest0);
      const jig = tc.resting && bobOn ? Math.sin(wall * 0.9 + tc.id) * 0.6 : 0;
      if (tc.activeAt != null && tc.activeAt >= 0) {
        const q = eio(seg(t, tc.activeAt, tc.activeAt + 0.6));
        if (q < 1) spr(g, 'tR', tc.variant, pos.x + jig, pos.y, 1, 0.7 * (1 - q));
        if (q > 0) spr(g, 'tA', tc.variant, pos.x, pos.y, 1, q, pos.a);
      } else if (tc.activeAt === -1) {
        spr(g, 'tA', tc.variant, pos.x, pos.y, 1, 1, pos.a);
      } else {
        spr(g, 'tR', tc.variant, pos.x + jig, pos.y, 1, 0.7);
      }
    }
    // DC ↔ T-cell contact rings in the node (recognition, rule 5)
    for (const tc of P.tcells) {
      if (tc.contactAt == null || t < tc.contactAt || t > tc.contactAt + 1.0) continue;
      let e = effects.get(tc);
      if (!e) { e = contactRing(fxTmp, tc.ringAt.x, tc.ringAt.y, { color: C.cd8, r: Z.rt * 1.35, life: 1.0 }); fxTmp.clear(); effects.set(tc, e); }
      e.t = t - tc.contactAt;
      e.draw(g, e);
    }

    // ---------------- HTML/SVG overlays (counters, labels, syringe)
    const txt = `Cancer cells left — injected tumor: ${injLeft} / 25 · distant tumor: ${distLeft} / 12`;
    if (countText.textContent !== txt) {
      countText.innerHTML = `Cancer cells left — injected tumor: <b>${injLeft} / 25</b> · distant tumor: <b>${distLeft} / 12</b>`;
    }
    overlays(t, dcPos);
  }

  const setOp = (node, v) => {
    const s = f2(clamp01(v));
    if (node.getAttribute('opacity') !== s) node.setAttribute('opacity', s);
  };
  const win = (t, a, b, fi = 0.5, fo = 0.5) => Math.min(eo(seg(t, a, a + fi)), 1 - seg(t, b - fo, b));
  function overlays(t, dcPos) {
    const lb = deco.labels;
    const pre = started ? 0 : 1;
    setOp(lb.cancer, Math.max(pre, win(t, -1, 3.2, 0.5, 0.8)));
    setOp(lb.healthy, Math.max(pre, win(t, -1, 3.2, 0.5, 0.8)));
    setOp(lb.tcell, Math.max(pre, started ? win(t, -1, 18.4, 0.5, 0.8) : 1));
    // syringe: slides in, injects, leaves
    const sIn = eo(seg(t, 0, 0.9)), sOut = seg(t, 3.2, 4.0);
    setOp(deco.syringe, started ? sIn * (1 - sOut) : 0);
    const k = L.compact ? 0.6 : 1;
    const dx = (-34 * (1 - sIn) - 24 * sOut) * k;
    deco.syringeBody.setAttribute('transform', `translate(${f2(dx)} 0)`);
    // floating labels
    const P = plan;
    const fl = deco.float;
    const place = (g, x, y, op) => {
      const tr = `translate(${f2(x)} ${f2(y)})`;
      if (op > 0.01 && g.getAttribute('transform') !== tr) g.setAttribute('transform', tr);
      setOp(g, op);
    };
    const co = deco.callouts;
    const aim = (c, x, y, op) => {
      if (!c) return;
      setOp(c.g, op);
      if (op <= 0.01) return;
      const sx = c.p.x + c.w + 6, sy = c.p.y - 4;
      const dx = x - sx, dy = y - sy, d = Math.hypot(dx, dy) || 1;
      c.line.setAttribute('x1', f2(sx)); c.line.setAttribute('y1', f2(sy));
      c.line.setAttribute('x2', f2(x - (dx / d) * 3)); c.line.setAttribute('y2', f2(y - (dy / d) * 3));
      c.dot.setAttribute('cx', f2(x)); c.dot.setAttribute('cy', f2(y));
    };
    if (co.virus) {
      const v = P.virions[2];
      const p = v ? virionAt(v, Math.max(t, v.t0 + 0.3)) : L.tip;
      aim(co.virus, p.x, p.y, started ? win(t, 1.2, 4.4, 0.4, 0.6) : 0);
    }
    if (co.alarm) {
      const firstDef = cells.filter((c) => c.shieldAt != null && (mode === 'working' ? c.kind === 'cancer' : c.kind === 'healthy'))
        .sort((a, b) => (a.x - b.x) || (a.shieldAt - b.shieldAt))[0];
      if (firstDef) {
        const a = Math.atan2(co.alarm.p.y - firstDef.y, co.alarm.p.x - firstDef.x);
        aim(co.alarm, firstDef.x + Math.cos(a) * firstDef.r * 1.15, firstDef.y + Math.sin(a) * firstDef.r * 1.15, started ? win(t, firstDef.shieldAt, 10.5, 0.5, 0.8) : 0);
      } else setOp(co.alarm.g, 0);
    }
    if (co.proteins) {
      const bursts = cells.filter((c) => c.burstAt != null).sort((a, b) => a.burstAt - b.burstAt);
      const b0 = bursts[0];
      const bead = b0 && P.beads.filter((b) => b.burst === b0).sort((a, b) => (a.x1 - b.x1))[0];
      if (bead) aim(co.proteins, bead.x1, bead.y1, started && !(bead.pick && t > bead.pick.t) ? win(t, b0.burstAt + 0.9, 12.7, 0.5, 0.6) : 0);
      else setOp(co.proteins.g, 0);
    }
    const dc0 = P.dcs[0];
    if (dc0) {
      const p = dcPos.get(dc0);
      place(fl.dc, clamp(p.x, 56, L.W - 56), p.y - L.sizes.rdc - 8, started ? win(t, dc0.t0 + 0.4, dc0.t0 + 3.0, 0.5, 0.6) : 0);
    }
    const mover = P.tcells.find((q) => q.legs.length > 1 && q.born > 0);
    if (mover) {
      const p = posOf(t, mover.legs, mover.home);
      place(fl.killers, p.x, p.y - L.sizes.rt - 12, started ? win(t, 21.9, 25.5, 0.5, 0.8) : 0);
    } else setOp(fl.killers, 0);
  }

  // ---------------------------------------------------------------- controls
  const injectBtn = ctx.ui.button({ label: 'Inject virus', icon: 'syringe', variant: 'primary', onClick: () => start() });
  const replayBtn = ctx.ui.button({ label: 'Replay', icon: 'replay', variant: 'primary', onClick: () => start() });
  replayBtn.el.classList.add('onc-hide');
  let playBtn = null;
  if (!RM) {
    playBtn = ctx.ui.playPause({ playing: false, labels: { play: 'Play', pause: 'Pause' }, onChange: (on) => {
      if (on && (!started || ended)) start();
      else { running = on; ctx.announce(on ? 'Simulation playing' : 'Simulation paused'); }
    } });
  }
  const alarmSeg = ctx.ui.segmented({
    label: 'Cancer cells’ interferon response',
    options: [{ value: 'broken', label: 'Broken (common)' }, { value: 'working', label: 'Working' }],
    value: mode,
    onChange: (v) => { mode = v; resetRun(); ctx.announce(v === 'broken' ? 'Interferon response broken, as in many cancers. Press Inject virus.' : 'Interferon response working. Press Inject virus.'); },
  });
  // legend sits on the page (light or dark): pale sand/gold get their deep variants on paper
  const legendItems = () => {
    const light = ctx.theme === 'light';
    return [
      { label: 'Virus', color: C.virus, shape: 'circle' },
      { label: 'Interferon', color: light ? '#B08A5A' : C.healthy, shape: 'ring' },
      { label: 'Tumor proteins', color: C.pink, shape: 'glow' },
      { label: 'Danger signals', color: light ? '#B88A1E' : C.danger, icon: 'spark' },
    ];
  };
  const legend = ctx.ui.legend(legendItems(), { label: 'Particles' });
  ctx.onThemeChange(() => legend.set(legendItems()));

  function setButtons() {
    const showReplay = ended && !running;
    injectBtn.el.classList.toggle('onc-hide', showReplay || RM);
    replayBtn.el.classList.toggle('onc-hide', !showReplay || RM);
    if (playBtn) playBtn.set(running);
  }
  function start() {
    T = 0; started = true; running = true; ended = false;
    setCaption(0, true);
    setButtons();
    loop.play();
  }
  function finish() {
    running = false; ended = true; everEnded = true;
    note.hidden = false;
    setButtons();
    ctx.announce('Run complete.');
  }
  function resetRun() {
    plan = buildPlan(mode);
    T = 0; started = false; running = false; ended = false;
    setCaption(0, false);
    setButtons();
    if (stepper) { stepper.rebuild(); syncRM(); }
    render();
  }
  function syncRM() {
    const i = Math.max(0, stepper.index);
    setCaption(mode === 'working' && i >= 1 ? 5 : i, false);
  }

  // ---------------------------------------------------------------- layout + loop
  let layoutName = null;
  let pending = null;
  function relayout(compact) { pending = doRelayout(compact); return pending; }
  async function doRelayout(compact) {
    const name = compact ? 'compact' : 'wide';
    const s = Math.min((cv.width || ctx.width) / LAYOUTS[name].W, (cv.height || ctx.height) / LAYOUTS[name].H) || 1;
    const nextPx = Math.round(clamp((cv.dpr || 1) * s, 1, 3) * 4) / 4;
    const changed = name !== layoutName;
    if (!changed && nextPx === px && sheet) { render(); return; }
    layoutName = name;
    L = LAYOUTS[name];
    px = nextPx;
    if (changed) {
      cells = layoutCells();
      drawStatic();
      plan = buildPlan(mode);
      // counters: in the HUD on wide stages, under the stage on phones
      if (L.compact) { count.classList.add('onc-count--below'); ctx.caption.prepend(count); }
      else { count.classList.remove('onc-count--below'); clock.el.after(count); }
      clock.set(L.compact ? 'Time compressed: days to weeks' : 'Time compressed: real events take days to weeks');
    }
    await loadSprites();
    if (stepper && changed) { stepper.rebuild(); syncRM(); }
    render();
  }

  const loop = ctx.loop((dt) => {
    wall += dt;
    if (running) {
      T = Math.min(END, T + dt);
      const ci = capFor(T, started);
      setCaption(ci, true);
      if (T >= END) finish();
    }
    render();
  }, { autoplay: !RM });

  // reduced motion: a stepper whose steps seek the run to each phase's end state
  let stepper = null;
  if (RM) {
    const sim = {};
    let tv = 0;
    Object.defineProperty(sim, 't', { get: () => tv, set: (v) => { tv = v; T = v; started = true; render(); }, enumerable: true });
    stepper = ctx.ui.stepper({
      captions: false,
      steps: SNAP.map((tEnd, i) => ({
        enter(tl) { tl.fromTo(sim, { t: i ? SNAP[i - 1] : 0 }, { t: tEnd, duration: 1.2, ease: 'none', immediateRender: false }); },
      })),
      onChange(i) {
        setCaption(mode === 'working' && i >= 1 ? 5 : i, false);
        if (i === SNAP.length - 1) note.hidden = false;
      },
    });
  }

  // QA hook (only with ?figdebug in the URL): seek the run to any time
  if (/[?&]figdebug\b/.test(location.search)) {
    fig.__debug = {
      seek(t) { T = t; started = true; running = false; ended = t >= END; setCaption(capFor(T, true), false); render(); },
      mode(m) { mode = m; alarmSeg.set(m); resetRun(); },
      stats() {
        return { caps: ctx.caption.querySelectorAll('.fig__steps').length, bursts: cells.filter((c) => c.burstAt != null).map((c) => +c.burstAt.toFixed(2)).sort((x, y) => x - y),
          kills: plan.kills.map((k) => +k.tKill.toFixed(2)), dcs: plan.dcs.map((d) => [d.t0, d.t1, d.picks.length, +d.matureAt.toFixed(2)]), tcells: plan.tcells.length };
      },
    };
  }
  ctx.onResize(({ compact }) => { relayout(compact); });
  if (!pending) relayout(ctx.compact);
  await pending;
  if (!RM) setCaption(0, false);
  setButtons();
  render();

  return {
    destroy() { fxTmp.clear(); },
  };
}
