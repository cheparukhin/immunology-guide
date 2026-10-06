// ch08-blockade — "Jamming the handshake" (Figure 8.1)
//
// The book's only drug close-up (FIGURE-AUDIT §2A). The gap between a killer T cell (top) and a
// cancer cell (bottom), built on the shared synapse scene: one TCR reads a neoantigen on an MHC
// cup; PD-1 (T cell only) meets PD-L1 (cancer cell) in four handshakes that come and go. Signal
// discs show the arithmetic: green "+" discs rise from the TCR toward the activity gauge, crimson
// "−" discs from every engaged PD-1 converge on the same point and damp them. A drug antibody
// (gold, white outline) caps PD-1 or PD-L1, the "−" stream stops, and the gauge climbs to
// "killing" — but only while the neoantigen is on display.
//
// Shared kits: synapse.js (scene, engage, cap, setDisplay), activity-meter.js (gauge on wide
// stages, a horizontal bar on phones), art signalIcon/tones. FIGURE-AUDIT §4 rules 3, 5, 6, 7, 9,
// 10, 17, 22 apply. The meter is a teaching model: "Illustrative" stays on stage.
import { synapseScene } from './shared/synapse.js';
import { meter } from './shared/activity-meter.js';
import { signalIcon, tones, PALETTE } from '../art/index.js';

const ID = 'ch08-blockade';

// Reader-facing captions (verbatim from the draft spec).
const CAPTIONS = {
  noneOn: 'The T cell recognizes the cancer cell, but every PD-1–PD-L1 contact sends an inhibitory (brake) signal, holding the attack below the level needed to kill.',
  pd1On: 'Antibodies bind PD-1 on the T cell, so PD-L1 cannot bind it. With the brake blocked, the recognition signal gets through, and the T cell attacks.',
  pdl1On: 'This time the antibodies bind PD-L1 on the cancer cell. The contact is blocked from the other side, with the same result.',
  drugOff: 'With no neoantigen on display, the drug has no effect: releasing the brake cannot help a T cell that cannot recognize the cancer.',
  noneOff: 'This cancer cell has stopped displaying its neoantigen. The T cell has no reason to attack, brake or no brake.',
};
const captionFor = (s) => (s.shown
  ? (s.drug === 'none' ? CAPTIONS.noneOn : s.drug === 'pd1' ? CAPTIONS.pd1On : CAPTIONS.pdl1On)
  : (s.drug === 'none' ? CAPTIONS.noneOff : CAPTIONS.drugOff));

// Gauge: three zones low → high. The needle drops BELOW "alert" when nothing is recognized.
const ZONES = [{ from: 0.08, to: 0.4, label: 'alert' }, { from: 0.4, to: 0.7, label: 'multiplying' }, { from: 0.7, to: 1, label: 'killing' }];
const gaugeValue = (s) => (!s.shown ? 0 : s.drug === 'none' ? 0.24 : 0.9);
const wantsKill = (s) => s.shown && s.drug !== 'none';     // never a killing step without displayed neoantigen

const LAYOUTS = {
  // pd1X order matters: synapse cap() lays antibody k on side (k % 2 ? left : right), and we cap
  // each |x| group in one call, so every drug's Fc stem points outward, away from the TCR.
  wide: {
    vb: [960, 540], size: 72, cx: 420, gapY: 300, width: 1120, depth: 230,
    pd1X: [130, -130, 262, -262], disc: 18, intY: 92, ab: 0.9,
    meter: { mode: 'gauge', x: 708, y: 84, width: 184, tag: null },
    granules: { n: 14, x0: -190, x1: 190, y0: 58, y1: 186, r: [3.6, 5.4] },
    tLabel: [28, 44], cLabel: [28, 516],
    pdLabel: { k: 1, top: [28, 46], bottom: [28, -30] },
    tcrLabel: [34, 54], abLabel: { k: 1, anchor: 'end', top: [-36, -58], bottom: [-36, 74] },
  },
  compact: {
    vb: [400, 560], size: 56, cx: 200, gapY: 262, width: 520, depth: 150,
    pd1X: [124, -124], disc: 16, intY: 76, ab: 0.9,
    meter: { mode: 'segments', x: 24, y: 470, width: 352, count: 10, tag: 'Illustrative' },
    granules: { n: 9, x0: -130, x1: 130, y0: 58, y1: 160, r: [3, 4.6] },
    tLabel: [20, 36], cLabel: [20, 430],
    pdLabel: { k: 1, top: [22, 40], bottom: [22, -26] },
    tcrLabel: [20, 60], abLabel: { k: 1, anchor: 'start', top: [-22, -54], bottom: [-22, 62] },
  },
};

const CSS = `
[data-figure="${ID}"] .bk-label { font-size: max(15px, calc(13.5px * var(--u, 1))); font-weight: 560; }
[data-figure="${ID}"] .bk-cell { font-size: max(15px, calc(14px * var(--u, 1))); font-weight: 650; letter-spacing: 0.06em; text-transform: uppercase; fill: var(--fg-2); }
[data-figure="${ID}"] .bk-meter-title { font-size: max(12px, calc(11px * var(--u, 1))); font-weight: 650; letter-spacing: 0.08em; text-transform: uppercase; fill: var(--fg-2); }
[data-figure="${ID}"] .bk-path { fill: none; stroke: var(--fg); stroke-opacity: 0.09; stroke-width: 1.4; stroke-dasharray: 2 5; stroke-linecap: round; vector-effect: non-scaling-stroke; }
[data-figure="${ID}"] .bk-cap { min-height: 3.2em; }
[data-figure="${ID}"].is-compact .fig__controls { flex-direction: column; align-items: stretch; }
[data-figure="${ID}"].is-compact .fig__controls .segmented { display: grid; grid-template-columns: 1fr; }
[data-figure="${ID}"].is-compact .fig__controls .segmented__track { display: grid; grid-template-columns: repeat(3, 1fr); }
[data-figure="${ID}"].is-compact .fig__controls .segmented__opt { justify-content: center; padding: 0 0.4rem; }
[data-figure="${ID}"].is-compact .fig__controls .switch { width: 100%; }
`;
function injectCSS() {
  if (document.getElementById(`${ID}-css`)) return;
  const s = document.createElement('style');
  s.id = `${ID}-css`;
  s.textContent = CSS;
  document.head.append(s);
}

// ------------------------------------------------------------------ small geometry helpers
const lerp = (a, b, t) => a + (b - a) * t;
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const seg = (p, a, b) => clamp01((p - a) / (b - a || 1));
const smooth = (t) => t * t * (3 - 2 * t);
const easeOut = (t) => 1 - (1 - t) * (1 - t);
const f2 = (v) => String(Math.round(v * 100) / 100);
const quad = (a, c, b, t) => ({ x: (1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * c.x + t * t * b.x, y: (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * c.y + t * t * b.y });
const cubic = (a, c1, c2, b, t) => {
  const u = 1 - t;
  return { x: u * u * u * a.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * b.x, y: u * u * u * a.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * b.y };
};
const parseTR = (s) => {
  const m = /translate\(\s*([-\d.e]+)[ ,]+([-\d.e]+)\s*\)\s*rotate\(\s*([-\d.e]+)/.exec(s || '');
  return m ? { x: +m[1], y: +m[2], r: +m[3] } : { x: 0, y: 0, r: 0 };
};

export default function mount(fig, ctx) {
  injectCSS();
  const { gsap } = ctx;
  ctx.setAspect(16 / 9, 400 / 560);
  const svg = ctx.createSVG({ viewBox: '0 0 960 540' });
  ctx.tag('Not to scale');
  ctx.tag('Illustrative');

  // ---------------------------------------------------------------- state
  const state = { drug: 'none', shown: true };
  let L = LAYOUTS.wide;
  let compact = null;
  const V = {};                   // everything drawn for the current layout
  const model = { tcr: false, pd: [] };   // what is engaged right now (drives the signal discs)
  let current = null;             // running user transition
  const lifeTls = new Set();      // running PD-1 bind/unbind events
  const kill = { k: 0 };          // 0 calm … 1 granules gathered + blebbing

  // ---------------------------------------------------------------- caption (live)
  const capP = ctx.h('p', { class: 'bk-cap', 'aria-live': 'polite' });
  ctx.caption.append(capP);
  const setCaption = () => { capP.textContent = captionFor(state); };

  // ---------------------------------------------------------------- scene
  // gauge pivot (activity-meter gauge geometry: R = 0.4 W, centre 14 + R below the top when untitled)
  const pivotOf = () => [L.meter.x + L.meter.width / 2, L.meter.y + 14 + L.meter.width * 0.4];
  const geo = () => {
    const gap = 1.72 * L.size;
    const topY = L.gapY - gap / 2, bottomY = L.gapY + gap / 2;
    const thick = 12;
    const icon = Math.min(18, Math.max(11, L.size * 0.34));
    const iconY = topY - thick - icon * 0.95;
    return { gap, topY, bottomY, thick, iconY, I: { x: L.cx, y: topY - thick - L.intY } };
  };

  function makeScene(parent) {
    const S = synapseScene(parent, {
      ctx, x: L.cx, y: L.gapY, width: L.width, size: L.size, depth: L.depth, seed: 8,
      top: { color: 'cd8' }, bottom: { color: 'cancer' }, stage: 'dark',
      pairs: [{ kind: 'tcr-mhc', x: [0], peptide: 'neo' }, { kind: 'pd1-pdl1', x: L.pd1X }],
    });
    // §4.5/§4.7: synapseScene draws the recognition ring on TCR–MHC only; an engaged PD-1–PD-L1
    // pair is interlocked heads + one crimson "−" disc on the T-cell side.
    return S;
  }
  const abOpts = () => ({ size: L.size * L.ab });
  const capSide = (drug) => (drug === 'pd1' ? 'top' : 'bottom');

  /**
   * Cap every PD-1 (or PD-L1) with a drug antibody. Pairs are capped one |x| group per call, so
   * synapse cap()'s alternating sides send each Fc stem outward, away from the TCR.
   * Returns the antibody wrappers indexed like L.pd1X.
   */
  function capAll(S, side, { tl, pos = 0, duration = 1.15, stagger = 0.16 }) {
    const groups = [...new Set(L.pd1X.map((x) => Math.abs(x)))];
    const byK = [];
    groups.forEach((ax, gi) => {
      const ks = L.pd1X.map((x, k) => (Math.abs(x) === ax ? k : -1)).filter((k) => k >= 0);
      // cap() swings each docked antibody ~15° about its capping tip, so the free arm clears the partner
      const abs = S.cap('pd1-pdl1', side, abOpts(), { tl, pos: pos + gi * stagger * 1.5, duration, stagger, which: (P) => Math.abs(P.x) === ax });
      ks.forEach((k, j) => { byK[k] = abs[j]; });
    });
    return byK;
  }
  const capSpan = (duration = 1.15, stagger = 0.16) => {
    const groups = new Set(L.pd1X.map((x) => Math.abs(x))).size;
    return (groups - 1) * stagger * 1.5 + stagger + duration;
  };

  /** Bring a fresh scene to a state instantly. Returns the antibody wrappers (if capped). */
  function settleScene(S, s, { pd = true } = {}) {
    const tl = gsap.timeline({ paused: true });
    let abs = [];
    if (s.shown) S.engage('tcr-mhc', true, { tl, duration: 0.01 });
    else S.setDisplay(false, { tl, duration: 0.01 });
    if (pd) {
      if (s.drug === 'none') S.engage('pd1-pdl1', true, { tl, duration: 0.01, stagger: 0 });
      else abs = capAll(S, capSide(s.drug), { tl, duration: 0.01, stagger: 0 });
    }
    tl.progress(1);
    tl.kill();
    return abs;
  }

  // ---------------------------------------------------------------- draw (per layout)
  function draw() {
    for (const n of [...svg.children]) if (n !== svg.defs) n.remove();
    if (V.scene) V.scene.destroy();
    const [W, H] = L.vb;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const G = geo();
    V.geo = G;

    V.sceneLayer = ctx.svg('g', { class: 'bk-scene' }, svg);
    V.scene = makeScene(V.sceneLayer);
    V.abs = settleScene(V.scene, state);

    // the T cell's cytotoxic granules (they gather at the contact when it attacks)
    const T = tones(PALETTE.cd8, 'dark');
    const rnd = ctx.random(31);
    V.granLayer = ctx.svg('g', { class: 'bk-granules' }, svg);
    V.granules = [];
    const g = L.granules;
    for (let i = 0; i < g.n; i++) {
      const hx = L.cx + lerp(g.x0, g.x1, (i + rnd.range(0.15, 0.85)) / g.n);
      const hy = rnd.range(g.y0, g.y1);
      const r = rnd.range(g.r[0], g.r[1]);
      // polarized: clustered either side of the signal column, just inside the contact
      const side = i % 2 ? 1 : -1;
      const sc = L.size / 72;
      const tx = L.cx + side * rnd.range(13, 44) * sc;
      const ty = G.topY - G.thick - rnd.range(16, 50) * sc;
      const c = ctx.svg('circle', { r, cx: hx, cy: hy, fill: T.granule, stroke: T.granuleEdge, 'stroke-width': Math.max(0.6, r * 0.28), 'fill-opacity': 0.85 }, V.granLayer);
      V.granules.push({ c, hx, hy, tx, ty });
    }

    // blebs: the cancer membrane beside the contact starts to bulge (partial apoptosis, ~setDying 0.3)
    const Tc = tones(PALETTE.cancer, 'dark');
    const clipId = `bk-bleb-clip-${ctx.number || 'x'}`.replace(/\W/g, '-');
    svg.defs.querySelector(`#${clipId}`)?.remove();
    const clip = ctx.svg('clipPath', { id: clipId }, svg.defs);
    ctx.svg('rect', { x: 0, y: 0, width: L.vb[0], height: G.bottomY + 1.5 }, clip);
    V.blebLayer = ctx.svg('g', { class: 'bk-blebs', 'clip-path': `url(#${clipId})` }, svg);
    V.blebs = [[-0.78, 0.2], [-1.3, 0.15], [0.74, 0.19], [1.26, 0.14]].map(([k, rr]) => {
      const x = L.cx + k * L.size;
      const rMax = L.size * rr;
      const b = ctx.svg('circle', { cx: x, cy: G.bottomY, r: 0.01, fill: Tc.bodyMid, stroke: Tc.rim, 'stroke-width': 2.2, 'stroke-opacity': 0.85 }, V.blebLayer);
      return { b, x, rMax };
    });

    // signal "wiring" (very faint) and the disc pools
    V.sigLayer = ctx.svg('g', { class: 'bk-signals' }, svg);
    V.paths = buildPaths(G);
    for (const p of V.paths.guides) ctx.svg('path', { class: 'bk-path', d: p }, V.sigLayer);
    V.plusPool = [];
    V.minusPool = [];
    for (let i = 0; i < 12; i++) V.minusPool.push(poolDisc('inhibitory'));
    for (let i = 0; i < 10; i++) V.plusPool.push(poolDisc('activating'));

    // meter
    V.meterLayer = ctx.svg('g', { class: 'bk-meter' }, svg);
    if (L.meter.mode === 'gauge') {
      V.meter = meter(V.meterLayer, { mode: 'gauge', x: L.meter.x, y: L.meter.y, width: L.meter.width, tag: null, zones: ZONES, values: gaugeValue(state) });
      ctx.svg('text', { class: 'bk-meter-title t-mid', x: pivotOf()[0], y: pivotOf()[1] + 28, text: 'T-cell activity' }, V.meterLayer);
    } else {
      V.meter = meter(V.meterLayer, { mode: 'segments', x: L.meter.x, y: L.meter.y, width: L.meter.width, count: L.meter.count, title: 'T-cell activity', tag: 'Illustrative', zones: ZONES.map((z) => ({ ...z })), values: gaugeValue(state) });
    }

    // labels
    V.labelLayer = ctx.svg('g', { class: 'bk-labels' }, svg);
    ctx.svg('text', { class: 'bk-cell t-halo', x: L.tLabel[0], y: L.tLabel[1], text: 'Killer T cell' }, V.labelLayer);
    ctx.svg('text', { class: 'bk-cell t-halo', x: L.cLabel[0], y: L.cLabel[1], text: 'Cancer cell' }, V.labelLayer);
    const pdk = L.pdLabel.k;
    const px = L.cx + L.pd1X[pdk];
    V.pdLabels = [
      leaderLabel(px + L.pdLabel.top[0], G.topY + L.pdLabel.top[1], 'PD-1', [px + 6, G.topY + L.pdLabel.top[1] - 5], 'start', { side: true }),
      leaderLabel(px + L.pdLabel.bottom[0], G.bottomY + L.pdLabel.bottom[1], 'PD-L1', [px + 6, G.bottomY + L.pdLabel.bottom[1] - 5], 'start', { side: true }),
    ];
    const jn = V.scene.point('tcr-mhc', 0, 'junction');
    V.tcrLabel = leaderLabel(L.cx + L.tcrLabel[0], G.bottomY + L.tcrLabel[1], tcrText(), [jn.x + 4, jn.y + L.size * 0.24], 'start');
    V.abLabel = leaderLabel(0, 0, 'Drug antibody', [0, 0], L.abLabel.anchor);
    V.abLabel.g.setAttribute('opacity', 0);
    placeAbLabel(true);

    model.tcr = state.shown;
    model.pd = L.pd1X.map(() => ({ on: state.drug === 'none' }));
    kill.k = wantsKill(state) ? 1 : 0;
    renderKill();
    sim.reset();
    renderSignals();
  }

  function poolDisc(type) {
    const g = ctx.svg('g', { opacity: 0 }, V.sigLayer);
    g.append(signalIcon({ type, size: L.disc, stage: 'dark' }));
    return g;
  }

  // Labels: 1–4 words (rule 22). `text` may hold '\n' for a second line (phones).
  const tcrText = () => (state.shown
    ? (compact ? 'TCR recognizes\na neoantigen' : 'TCR recognizes a neoantigen')
    : (compact ? 'No neoantigen\ndisplayed' : 'No neoantigen displayed'));
  function leaderLabel(x, y, text, to, anchor, { side = false } = {}) {
    const g = ctx.svg('g', {}, V.labelLayer);
    const line = ctx.svg('line', { class: 'leader' }, g);
    const dot = ctx.svg('circle', { class: 'leader-dot', r: 2.4 }, g);
    const t = ctx.svg('text', { class: `bk-label t-halo${anchor === 'end' ? ' t-end' : anchor === 'middle' ? ' t-mid' : ''}` }, g);
    const api = {
      g, line, dot, t,
      text(str) {
        t.replaceChildren();
        str.split('\n').forEach((ln, i) => ctx.svg('tspan', { x: t.getAttribute('x'), dy: i ? '1.2em' : 0, text: ln }, t));
        api.lines = str.split('\n').length;
      },
      set(nx, ny, nto) {
        t.setAttribute('x', nx); t.setAttribute('y', ny);
        for (const ts of t.children) ts.setAttribute('x', nx);
        const below = ny > nto[1];
        // side labels: the leader leaves the text's near end; others leave above/below the text
        const lx = side ? nx - 4 : nx + (anchor === 'end' ? -6 : 6);
        const ly = side ? ny - 5 : below ? ny - 15 : ny + 6 + (api.lines - 1) * 17;
        line.setAttribute('x1', lx); line.setAttribute('y1', ly);
        line.setAttribute('x2', nto[0]); line.setAttribute('y2', nto[1]);
        dot.setAttribute('cx', nto[0]); dot.setAttribute('cy', nto[1]);
        line.style.display = dot.style.display = Math.hypot(lx - nto[0], ly - nto[1]) < 8 ? 'none' : '';
      },
      lines: 1,
    };
    t.setAttribute('x', x); t.setAttribute('y', y);
    api.text(text);
    api.set(x, y, to);
    return api;
  }

  /** Point the "Drug antibody" label at the docked antibody of pair abLabel.k. */
  function placeAbLabel(instant) {
    const lab = V.abLabel;
    const ab = state.drug !== 'none' ? V.abs[L.abLabel.k] : null;
    if (!ab) { gsap.to(lab.g, { opacity: 0, duration: instant || ctx.reducedMotion ? 0 : 0.3, overwrite: true }); return; }
    let cx = 0, cy = 0;
    try {
      const b = ab.getBBox();
      const m = svg.getScreenCTM().inverse().multiply(ab.getScreenCTM());
      const p = new DOMPoint(b.x + b.width * 0.5, b.y + b.height * 0.5).matrixTransform(m);
      cx = p.x; cy = p.y;
    } catch { const t = parseTR(ab.getAttribute('transform')); cx = t.x + L.cx; cy = t.y + L.gapY; }
    const side = capSide(state.drug);
    const off = L.abLabel[side];
    const G = V.geo;
    const ly = side === 'top' ? G.topY + off[1] : G.bottomY + off[1];
    lab.set(cx + off[0], ly, [cx, cy]);
    gsap.to(lab.g, { opacity: 1, duration: instant || ctx.reducedMotion ? 0 : 0.45, overwrite: true });
  }

  // ---------------------------------------------------------------- signal paths
  function buildPaths(G) {
    const I = G.I;
    const tcrStart = { x: L.cx, y: G.iconY };
    const minus = L.pd1X.map((dx) => {
      const a = { x: L.cx + dx, y: G.iconY };
      const c = { x: L.cx + dx * 0.92, y: I.y + 6 };
      const b = { x: I.x + Math.sign(dx) * 10, y: I.y + 2 };
      return { a, c, b, len: Math.abs(dx) + (G.iconY - I.y) };
    });
    let toGauge;
    if (L.meter.mode === 'gauge') {
      const [px0, py0] = pivotOf();
      const P = { x: px0, y: py0 };
      toGauge = { a: I, c1: { x: I.x + 60, y: I.y - 56 }, c2: { x: P.x - 150, y: P.y - 4 }, b: { x: P.x - 8, y: P.y } };
    } else {
      toGauge = { a: I, c1: { x: I.x, y: I.y - 20 }, c2: { x: I.x, y: 30 }, b: { x: I.x, y: 18 } };
    }
    const d = (q) => `M${f2(q.a.x)} ${f2(q.a.y)}Q${f2(q.c.x)} ${f2(q.c.y)} ${f2(q.b.x)} ${f2(q.b.y)}`;
    const guides = [
      `M${f2(tcrStart.x)} ${f2(tcrStart.y)}L${f2(I.x)} ${f2(I.y)}`,
      `M${f2(toGauge.a.x)} ${f2(toGauge.a.y)}C${f2(toGauge.c1.x)} ${f2(toGauge.c1.y)} ${f2(toGauge.c2.x)} ${f2(toGauge.c2.y)} ${f2(toGauge.b.x)} ${f2(toGauge.b.y)}`,
      ...minus.map(d),
    ];
    return { I, tcrStart, minus, toGauge, guides };
  }

  // ---------------------------------------------------------------- signal simulation
  // "+" discs leave the engaged TCR every 0.6 s and rise to the meeting point; "−" discs leave
  // every engaged PD-1 pair and wait there. A "+" that meets a waiting "−" fades (damping);
  // otherwise it flows on to the gauge. Deterministic (seeded), so reduced motion gets a still.
  const T_PLUS = 0.6, A_DUR = 0.95, B_DUR = 1.5, M_DUR = 1.25, WAIT = 1.0, KILL_DUR = 0.4;
  const sim = {
    rng: null, t: 0, plus: [], minus: [], plusTimer: 0, minusTimers: [], lifeTimers: [],
    reset(seed = 5) {
      this.rng = ctx.random(seed);
      this.t = 0; this.plus = []; this.minus = []; this.plusTimer = 0.2;
      this.minusTimers = L.pd1X.map((_, k) => 0.15 + k * 0.33 + this.rng.range(0, 0.4));
      this.lifeTimers = L.pd1X.map(() => this.rng.range(1.2, 4));
    },
    step(dt, { life = true } = {}) {
      this.t += dt;
      // spawn
      if (model.tcr) {
        this.plusTimer -= dt;
        if (this.plusTimer <= 0) { this.plusTimer += T_PLUS; this.plus.push({ p: 0, phase: 'A', a: 0 }); }
      } else this.plusTimer = Math.min(this.plusTimer, 0.25);
      model.pd.forEach((m, k) => {
        if (!m.on) { this.minusTimers[k] = Math.min(this.minusTimers[k], 0.3 + k * 0.15); return; }
        this.minusTimers[k] -= dt;
        if (this.minusTimers[k] <= 0) { this.minusTimers[k] += 1.3 + this.rng.range(0, 0.35); this.minus.push({ k, p: 0, phase: 'go', w: 0 }); }
      });
      // move
      for (const m of this.minus) {
        if (m.phase === 'go') { m.p += dt / M_DUR; if (m.p >= 1) { m.p = 1; m.phase = 'wait'; m.w = 0; } }
        else if (m.phase === 'wait') { m.w += dt; if (m.w >= WAIT) m.phase = 'gone'; }
        else if (m.phase === 'damp') { m.w += dt; if (m.w >= KILL_DUR) m.phase = 'gone'; }
      }
      for (const q of this.plus) {
        if (q.phase === 'A') {
          q.p += dt / A_DUR;
          if (q.p >= 1) {
            const brake = this.minus.filter((m) => m.phase === 'wait').sort((a, b) => b.w - a.w)[0];
            if (brake) { brake.phase = 'damp'; brake.w = 0; q.phase = 'damp'; q.p = 1; q.w = 0; }
            else { q.phase = 'B'; q.p = 0; }
          }
        } else if (q.phase === 'B') { q.p += dt / B_DUR; if (q.p >= 1) q.phase = 'gone'; }
        else if (q.phase === 'damp') { q.w += dt; if (q.w >= KILL_DUR) q.phase = 'gone'; }
      }
      this.plus = this.plus.filter((q) => q.phase !== 'gone');
      this.minus = this.minus.filter((m) => m.phase !== 'gone');
      // PD-1 handshakes come and go (life 2–4 s); capped molecules never pair
      if (life && !current) {
        model.pd.forEach((m, k) => {
          if (!m.on || m.busy) return;
          this.lifeTimers[k] -= dt;
          if (this.lifeTimers[k] <= 0) { this.lifeTimers[k] = this.rng.range(2, 4); unbindOnce(k, this.rng.range(0.25, 0.6)); }
        });
      }
    },
  };

  function renderSignals() {
    const P = V.paths;
    if (!P) return;
    const I = P.I;
    let mi = 0, pi = 0;
    const put = (node, x, y, o, s = 1) => {
      node.setAttribute('transform', `translate(${f2(x)} ${f2(y)})${s !== 1 ? ` scale(${f2(s)})` : ''}`);
      node.setAttribute('opacity', f2(o));
    };
    // waiting brakes sit in a small cluster around the meeting point
    let wi = 0;
    for (const m of sim.minus) {
      const node = V.minusPool[mi++];
      if (!node) break;
      const path = P.minus[m.k];
      if (m.phase === 'go') {
        const pt = quad(path.a, path.c, path.b, smooth(m.p));
        put(node, pt.x, pt.y, Math.min(easeOut(seg(m.p, 0, 0.18)), 1));
      } else {
        const slot = wi++;
        const ox = (slot % 2 ? 1 : -1) * (8 + Math.floor(slot / 2) * 9) * (L.disc / 18);
        const oy = -2 - Math.floor(slot / 2) * 4;
        const x = lerp(path.b.x, I.x + ox, 0.8), y = lerp(path.b.y, I.y + oy, 0.8);
        if (m.phase === 'wait') put(node, x, y, 1 - seg(m.w, WAIT - 0.35, WAIT));
        else put(node, lerp(x, I.x, m.w / KILL_DUR), y, 1 - smooth(m.w / KILL_DUR), 1 - 0.3 * (m.w / KILL_DUR));
      }
    }
    for (; mi < V.minusPool.length; mi++) V.minusPool[mi].setAttribute('opacity', 0);
    const A = P.tcrStart, B = P.toGauge;
    for (const q of sim.plus) {
      const node = V.plusPool[pi++];
      if (!node) break;
      if (q.phase === 'A') {
        const t = smooth(q.p);
        put(node, lerp(A.x, I.x, t), lerp(A.y, I.y, t), Math.min(1, easeOut(seg(q.p, 0, 0.2))));
      } else if (q.phase === 'B') {
        const pt = cubic(B.a, B.c1, B.c2, B.b, q.p);
        put(node, pt.x, pt.y, 1 - seg(q.p, 0.78, 1), 1 - 0.25 * seg(q.p, 0.8, 1));
      } else {
        const k = q.w / KILL_DUR;
        put(node, I.x, I.y, 1 - smooth(k), 1 - 0.55 * k);
      }
    }
    for (; pi < V.plusPool.length; pi++) V.plusPool[pi].setAttribute('opacity', 0);
  }

  /** Reduced motion: a representative still of the current state. */
  function renderStill() {
    sim.reset(11);
    for (let i = 0; i < 90; i++) sim.step(0.05, { life: false });
    renderSignals();
  }

  const loop = ctx.loop((dt) => { sim.step(dt); renderSignals(); });

  // ---------------------------------------------------------------- PD-1 life (bind / unbind)
  function unbindOnce(k, hold) {
    const S = V.scene;
    const which = (P) => P.i === k;
    const tl = gsap.timeline({ onComplete: () => { lifeTls.delete(tl); model.pd[k].busy = false; } });
    model.pd[k].busy = true;
    S.engage('pd1-pdl1', false, { tl, which, duration: 0.4, stagger: 0 });
    tl.call(() => { model.pd[k].on = false; }, null, 0.12);
    S.engage('pd1-pdl1', true, { tl, which, duration: 0.5, stagger: 0, pos: 0.4 + hold });
    tl.call(() => { model.pd[k].on = true; }, null, 0.4 + hold + 0.42);
    lifeTls.add(tl);
  }
  function settleLife() {
    for (const tl of [...lifeTls]) tl.progress(1);
    lifeTls.clear();
    model.pd.forEach((m) => { m.busy = false; });
  }

  // ---------------------------------------------------------------- kill visuals (k: 0 → 1)
  function renderKill() {
    const k = kill.k;
    const gk = smooth(seg(k, 0, 0.42));
    for (const g of V.granules || []) {
      g.c.setAttribute('cx', f2(lerp(g.hx, g.tx, gk)));
      g.c.setAttribute('cy', f2(lerp(g.hy, g.ty, gk)));
    }
    const bk = smooth(seg(k, 0.68, 1));
    for (const b of V.blebs || []) {
      const r = Math.max(0.01, b.rMax * bk);
      b.b.setAttribute('r', f2(r));
      b.b.setAttribute('cy', f2(V.geo.bottomY + r * 0.38));
      b.b.setAttribute('opacity', f2(Math.min(1, bk * 3)));
    }
  }

  // ---------------------------------------------------------------- transitions
  function settle() {
    if (current) { const c = current; current = null; c.progress(1); c.kill(); }
    settleLife();
  }

  /** Drug antibodies drift out and capped glyphs straighten; then a fresh scene takes over. */
  function uncap(tl, S2, pos) {
    const S1 = V.scene;
    const D = 0.85;
    V.abs.forEach((ab, k) => {
      if (!ab) return;
      const t = parseTR(ab.getAttribute('transform'));
      const dir = Math.sign(t.x - L.pd1X[k]) || 1;
      tl.to(ab, { attr: { transform: `translate(${f2(t.x + dir * L.size * 1.6)} ${f2(t.y + (capSide(state.prevDrug) === 'top' ? 1 : -1) * L.size * 0.1)}) rotate(${f2(t.r + dir * 30)})`, opacity: 0 }, duration: D, ease: 'so.in' }, pos + k * 0.06);
    });
    const P1 = S1.pairs['pd1-pdl1'] || [], P2 = S2.pairs['pd1-pdl1'] || [];
    P1.forEach((P, k) => {
      const Q = P2[k];
      if (!Q) return;
      for (const side of ['top', 'bottom']) {
        const a = P[side].closest('[data-part="pose"]'), b = Q[side].closest('[data-part="pose"]');
        if (a && b) tl.to(a, { attr: { transform: b.getAttribute('transform') }, duration: 0.7, ease: 'so.inOut' }, pos + 0.25);
      }
    });
    tl.call(() => swapScene(S2), null, pos + 0.96);
    return pos + 0.96;
  }

  function swapScene(S2) {
    const S1 = V.scene;
    S2.el.style.display = '';
    V.scene = S2;
    V.abs = [];
    if (S1 && S1 !== S2) S1.destroy();
  }

  function go(next) {
    settle();
    const prev = { ...state };
    state.prevDrug = prev.drug;
    Object.assign(state, next);
    setCaption();
    const tl = gsap.timeline({ paused: true, onComplete: () => { if (current === tl) current = null; } });
    let gaugeAt = 0.15;
    let killAt = null;

    if (prev.drug !== state.drug) {
      let S = V.scene;
      let t = 0;
      if (prev.drug !== 'none') {
        tl.to(V.abLabel.g, { opacity: 0, duration: 0.25 }, 0);
        // local fallback for the missing synapse `uncap()`: swap to a fresh scene in the freed pose
        const S2 = makeScene(V.sceneLayer);
        S2.el.style.display = 'none';
        V.sceneLayer.prepend(S2.el);
        settleScene(S2, state, { pd: false });
        t = uncap(tl, S2, 0);
        S = S2;
        if (state.drug === 'none') { gaugeAt = 0.4; }
      }
      if (state.drug !== 'none') {
        const stagger = 0.16, dur = 1.15, span = capSpan(dur, stagger);
        const abs = capAll(S, capSide(state.drug), { tl, pos: t, duration: dur, stagger });
        tl.call(() => { V.abs = abs; }, null, t + 0.01);
        L.pd1X.forEach((_, k) => tl.call(() => { model.pd[k].on = false; }, null, t + 0.25 + (k % 2) * stagger + Math.floor(k / 2) * stagger * 1.5));
        tl.call(() => placeAbLabel(false), null, t + span);
        gaugeAt = t + span - 0.35;
        if (wantsKill(state)) killAt = gaugeAt + 0.6;
      } else {
        const stagger = 0.12, dur = 0.9;
        S.engage('pd1-pdl1', true, { tl, pos: t, duration: dur, stagger });
        L.pd1X.forEach((_, k) => tl.call(() => { model.pd[k].on = true; }, null, t + k * stagger + dur * 0.7));
        placeAbLabel(false);
      }
    }

    if (prev.shown !== state.shown) {
      const S = V.scene;
      if (!state.shown) {
        S.setDisplay(false, { tl, pos: 0, duration: 0.9 });
        tl.call(() => { model.tcr = false; }, null, 0.05);
        gaugeAt = 0.2;
      } else {
        S.setDisplay(true, { tl, pos: 0, duration: 0.9 });
        S.engage('tcr-mhc', true, { tl, pos: 0.75, duration: 0.9 });
        tl.call(() => { model.tcr = true; }, null, 1.45);
        gaugeAt = 1.3;
        if (wantsKill(state)) killAt = gaugeAt + 0.6;
      }
      const lab = V.tcrLabel;
      tl.to(lab.g, { opacity: 0, duration: 0.25 }, 0);
      tl.call(() => { lab.text(tcrText()); lab.set(+lab.t.getAttribute('x'), +lab.t.getAttribute('y'), [+lab.dot.getAttribute('cx'), +lab.dot.getAttribute('cy')]); }, null, 0.26);
      tl.to(lab.g, { opacity: 1, duration: 0.35 }, 0.3);
    }

    V.meter.set(gaugeValue(state), { tl, pos: gaugeAt, duration: 0.8 });
    if (wantsKill(state) && kill.k < 1) {
      tl.fromTo(kill, { k: kill.k }, { k: 1, duration: 3.4, ease: 'none', onUpdate: renderKill }, killAt ?? gaugeAt + 0.6);
    } else if (!wantsKill(state) && kill.k > 0) {
      tl.fromTo(kill, { k: kill.k }, { k: 0, duration: 0.8, ease: 'so.inOut', onUpdate: renderKill }, 0);
    }
    tl.call(() => ctx.announce(V.meter.describe()), null, tl.duration());

    current = tl;
    if (ctx.reducedMotion) { tl.progress(1); current = null; renderStill(); }
    else tl.play();
  }

  // ---------------------------------------------------------------- controls
  ctx.ui.segmented({
    label: 'Drug', value: 'none',
    options: [{ value: 'none', label: 'None' }, { value: 'pd1', label: 'Anti-PD-1' }, { value: 'pdl1', label: 'Anti-PD-L1' }],
    onChange: (v) => go({ drug: v }),
  });
  ctx.ui.toggle({
    label: 'Cancer cell displays its neoantigen', checked: true,
    onChange: (on) => go({ shown: on }),
  });

  // ---------------------------------------------------------------- lifecycle
  ctx.onResize(({ compact: c }) => {
    if (c === compact) return;
    settle();
    compact = c;
    L = c ? LAYOUTS.compact : LAYOUTS.wide;
    draw();
    ctx.refreshTextScale();
    if (ctx.reducedMotion) renderStill();
  });
  if (compact == null) { compact = ctx.compact; L = compact ? LAYOUTS.compact : LAYOUTS.wide; draw(); }
  setCaption();
  if (ctx.reducedMotion) renderStill();

  return {
    destroy() {
      settle();
      loop.pause();
      V.scene?.destroy();
    },
  };
}
