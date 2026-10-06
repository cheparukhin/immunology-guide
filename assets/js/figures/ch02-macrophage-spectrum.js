// ch02-macrophage-spectrum — "Fight mode, repair mode" (Chapter 2, explorer, dark stage).
// One macrophage on a continuous fight ↔ repair dial (art library `polarization` = s, rebuilt as
// the slider moves; fully reversible). Six output vignettes fade with the dial: fight outputs at
// opacity 1 − s (kills microbes, calls reinforcements, wakes T cells), repair outputs at s (grows
// blood vessels, rebuilds tissue, calms T cells). "Place it in a tumor" brings in cancer cells
// whose signals drift toward the macrophage and glides the dial once to 0.85; the cell is then
// labeled "Tumor-associated macrophage" (never "M2", FIGURE-AUDIT §4 rule 2).
// Desktop: fight on the left, repair on the right; phones: fight above, repair below.
import {
  macrophage, bacterium, tCell, fibroblast, cancerCell, bloodVessel, cytokine, signalIcon, breathe, PALETTE, mix,
} from '../art/index.js';

const ID = 'ch02-macrophage-spectrum';
const CORAL = PALETTE.m1;
const S0 = 0.3;          // default dial position
const TUMOR_S = 0.85;    // where tumor signals push it

const CAPTIONS = {
  fight: 'Fight mode. Surrounded by microbial signals and IFN-γ, the macrophage kills what it engulfs and recruits other immune cells.',
  mid: 'In between. Real macrophages often run parts of both programs at once; ‘M1’ and ‘M2’ are just labels for the two ends.',
  repair: 'Repair mode. After the danger has passed, the macrophage damps inflammation, grows blood vessels and rebuilds tissue.',
  tumor: 'Inside a tumor, signals from cancer cells push the macrophage toward repair mode. The tumor is inflamed, but in the wrong way: it feeds the tumor’s blood supply and suppresses T cells, like a wound that never heals.',
};

const CSS = `
[data-figure="${ID}"] .ms-dial { flex: 1 1 100%; display: grid; gap: 0.15rem; font-family: var(--font-ui); }
[data-figure="${ID}"] .ms-push { justify-self: end; display: inline-flex; align-items: center; gap: 0.35rem; font-size: var(--text-xs); font-weight: 600; color: var(--c-cancer-deep, #8E3FB0); visibility: hidden; opacity: 0; transition: opacity .4s; }
[data-figure="${ID}"] .ms-push.is-on { visibility: visible; opacity: 1; }
[data-figure="${ID}"] .ms-push svg { width: 1rem; height: 1rem; }
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) [data-figure="${ID}"] .ms-push { color: #D9A3F0; } }
:root[data-theme="dark"] [data-figure="${ID}"] .ms-push { color: #D9A3F0; }
[data-figure="${ID}"] .ms-dial .slider { flex: none; }
[data-figure="${ID}"] .ms-dial .slider__input::-webkit-slider-runnable-track { height: 6px; background: linear-gradient(90deg, ${CORAL}, ${PALETTE.m2}); }
[data-figure="${ID}"] .ms-dial .slider__input::-webkit-slider-thumb { margin-top: calc(3px - 0.625rem); }
[data-figure="${ID}"] .ms-dial .slider__input::-moz-range-track { height: 6px; background: linear-gradient(90deg, ${CORAL}, ${PALETTE.m2}); }
[data-figure="${ID}"] .ms-dial .slider__input::-moz-range-progress { background: transparent; }
[data-figure="${ID}"] .ms-ends { display: flex; justify-content: space-between; gap: 1.5rem; margin-top: 0.15rem; font-size: var(--text-xs); line-height: 1.35; color: var(--ink-2); }
[data-figure="${ID}"] .ms-end { display: grid; gap: 0.1rem; max-width: 48%; }
[data-figure="${ID}"] .ms-end--r { text-align: right; justify-items: end; }
[data-figure="${ID}"] .ms-end b { font-weight: 620; color: var(--ink); }
[data-figure="${ID}"] .ms-m { font-size: var(--text-2xs); color: var(--ink-3); font-variant-numeric: tabular-nums; }
[data-figure="${ID}"] .ms-foot { margin: 0.2rem 0 0; text-align: center; font-size: var(--text-2xs); color: var(--ink-3); }
[data-figure="${ID}"] .ms-row { flex: 1 1 100%; display: flex; flex-wrap: wrap; align-items: center; gap: 0.6rem 1.6rem; }
[data-figure="${ID}"] .ms-row .legend { flex: 1 1 18rem; flex-basis: auto; }
`;

function injectCSS() {
  if (document.getElementById(`${ID}-style`)) return;
  const s = document.createElement('style');
  s.id = `${ID}-style`;
  s.textContent = CSS;
  document.head.append(s);
}

const f = (v) => Math.round(v * 100) / 100;
const DEG = Math.PI / 180;

/** Seeded PRNG (mulberry32). */
function prng(seed) {
  let a = seed >>> 0;
  const r = () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  r.range = (lo, hi) => lo + (hi - lo) * r();
  return r;
}

// Layouts: stage coordinates. Fight = left (desktop) / top (phone); repair = right / bottom.
const LAYOUTS = {
  wide: {
    vb: [1000, 560],
    mac: [500, 250], macR: 178, macLabel: [500, 58],
    bacteria: [[292, 142, 19, -24], [246, 206, 14, 30]], frags: [306, 214],
    killLabel: [268, 92, 'middle'],
    stream: [[352, 300], [220, 262], [40, 352]], callLabel: [44, 410, 'start'],
    tcell: [500, 492], plus: [-46, -8], minus: [46, -8],
    wakeLabel: [432, 498, 'end'], calmLabel: [568, 498, 'start'],
    vessel: { from: [1016, 92], to: [664, 192], width: 50 }, vesselLabel: [850, 50, 'middle'],
    branch: { at: 0.32, to: [972, 258], width: 32 },
    fib: [842, 352, 86, -8], fibers: { x0: 724, x1: 976, y: 352, spread: 52 }, fibLabel: [842, 462, 'middle'],
    cancers: [[30, 48], [16, 300], [128, 552], [706, 556], [990, 270], [968, 548]],
  },
  compact: {
    vb: [420, 600],
    mac: [190, 292], macR: 128, macLabel: [236, 450],
    bacteria: [[64, 112, 15, -24], [32, 160, 11, 30]], frags: [82, 170],
    killLabel: [16, 64, 'start'],
    stream: [[248, 196], [300, 150], [312, 34]], callLabel: [404, 96, 'end'],
    tcell: [372, 290], plus: [-32, -28], minus: [-32, 28],
    wakeLabel: [408, 240, 'end'], calmLabel: [408, 354, 'end'],
    vessel: { from: [-20, 486], to: [96, 410], width: 40 }, vesselLabel: [16, 540, 'start'],
    branch: { at: 0.4, to: [12, 304], width: 26 },
    fib: [312, 512, 72, -12], fibers: { x0: 222, x1: 412, y: 512, spread: 40 }, fibLabel: [312, 586, 'middle'],
    cancers: [[228, -10], [10, 304], [408, 176], [414, 432], [140, 610], [406, 604]],
  },
};

export default function mount(fig, ctx) {
  injectCSS();
  const { gsap, h } = ctx;
  const S = (tag, attrs, parent) => ctx.svg(tag, attrs, parent);
  ctx.setAspect(1000 / 560, 420 / 600);
  ctx.tag('Illustrative');
  const svg = ctx.createSVG({ viewBox: '0 0 1000 560' });

  const state = { s: S0, tumor: 0 };     // tumor: 0..1 (fade)
  let tumorOn = false;
  let compact = ctx.compact;
  let L = null;
  let N = null;
  let macP = null;
  let breatheH = null;
  let glide = null;
  let tumorTw = null;
  let capKey = null;

  // ---------------------------------------------------------------- scene
  function vesselSprout(parent, { from, to, width }, seed) {
    const dx = from[0] - to[0], dy = from[1] - to[1];
    const len = Math.hypot(dx, dy);
    const ang = Math.atan2(dy, dx) / DEG;          // local +x points back to the stage edge
    const cx = (from[0] + to[0]) / 2, cy = (from[1] + to[1]) / 2;
    const g = S('g', { transform: `translate(${f(cx)} ${f(cy)}) rotate(${f(ang)})` }, parent);
    const id = `${ID}-clip-${seed}-${compact ? 'c' : 'w'}`;
    const cp = S('clipPath', { id }, svg.defs);
    const rect = S('rect', { x: len / 2, y: -width, width: width, height: width * 2, rx: width / 2 }, cp);
    const inner = S('g', { 'clip-path': `url(#${id})` }, g);
    inner.append(bloodVessel({ length: len + 30, width, wall: Math.max(6, width * 0.22), rbc: Math.round(len / 60), seed, stage: 'dark' }));
    return {
      g, len, ang, cx, cy,
      set(p) {   // p 0..1 = fraction of the length grown from the edge
        const w = Math.max(0.001, p * len) + width / 2;
        rect.setAttribute('x', f(len / 2 + 15 - w));
        rect.setAttribute('width', f(w + 20));
      },
      point(t) {   // stage point at fraction t from the edge
        return [from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t];
      },
    };
  }

  function build() {
    for (const n of [...svg.children]) if (n !== svg.defs) n.remove();
    svg.defs.querySelectorAll('clipPath').forEach((c) => c.remove());
    L = compact ? LAYOUTS.compact : LAYOUTS.wide;
    svg.setAttribute('viewBox', `0 0 ${L.vb[0]} ${L.vb[1]}`);
    ctx.refreshTextScale();

    const tumorG = S('g', { opacity: 0, 'data-layer': 'tumor' });
    svg.append(tumorG);
    const repair = S('g', { 'data-layer': 'repair' }, svg);
    const fight = S('g', { 'data-layer': 'fight' }, svg);
    const tumorSignals = S('g', { opacity: 0 }, svg);
    const macG = S('g', { transform: `translate(${L.mac[0]} ${L.mac[1]})` }, svg);
    const tG = S('g', { transform: `translate(${L.tcell[0]} ${L.tcell[1]})` }, svg);
    const labels = S('g', { 'data-layer': 'labels' }, svg);

    // ---- tumor: cancer cells around the edges + violet signals drifting toward the macrophage
    const cancers = L.cancers.map(([x, y], i) => {
      const c = cancerCell({ r: compact ? 30 : 40, seed: 20 + i, stage: 'dark', mhc: false });
      c.setAttribute('transform', `translate(${x} ${y})`);
      tumorG.append(c);
      return [x, y];
    });
    const R = prng(7);
    const tdots = [];
    cancers.forEach(([x, y], i) => {
      for (let k = 0; k < 4; k++) {
        const g = S('g', null, tumorSignals);
        g.append(cytokine({ color: PALETTE.cancer, size: compact ? 6 : 7, stage: 'dark' }));
        tdots.push({ g, from: [x, y], phase: (k / 4 + R.range(0, 0.2)) % 1, wob: R.range(-1, 1) * 18, speed: R.range(0.07, 0.1) });
      }
    });

    // ---- repair outputs
    // the tumor branch is drawn first, so its root tucks under the parent vessel (a clean junction)
    const branchG = S('g', { opacity: 0 }, repair);
    const vessel = vesselSprout(repair, L.vessel, 3);
    const bfrom = vessel.point(L.branch.at);
    const branch = vesselSprout(branchG, { from: bfrom, to: L.branch.to, width: L.branch.width }, 5);
    const fibG = S('g', null, repair);
    const fib = fibroblast({ r: L.fib[2], angle: L.fib[3], seed: 4, stage: 'dark' });
    const fibers = S('g', null, fibG);
    const FR = prng(11);
    const fiberPaths = [];
    for (let i = 0; i < 5; i++) {
      const y0 = L.fibers.y + (i - 2) * (L.fibers.spread / 4) + FR.range(-4, 4);
      const pts = [];
      for (let k = 0; k <= 8; k++) {
        const x = L.fibers.x0 + ((L.fibers.x1 - L.fibers.x0) * k) / 8;
        pts.push([x, y0 + Math.sin(k * 0.9 + i) * 5 + (x - L.fib[0]) * Math.tan(L.fib[3] * DEG)]);
      }
      const d = pts.map(([x, y], k) => `${k ? 'L' : 'M'}${f(x)} ${f(y)}`).join('');
      fiberPaths.push(S('path', { d, fill: 'none', stroke: mix(PALETTE.ecm, '#FFFFFF', 0.15), strokeWidth: 1.2, strokeOpacity: 0.75, strokeLinecap: 'round', pathLength: 1, strokeDasharray: '0 1' }, fibers));
    }
    fib.setAttribute('transform', `translate(${L.fib[0]} ${L.fib[1]})`);
    fibG.append(fib);

    // ---- fight outputs
    const bact = S('g', null, fight);
    L.bacteria.forEach(([x, y, r, a], i) => {
      const b = bacterium({ r, angle: a, seed: 3 + i, pamps: true, stage: 'dark' });
      b.setAttribute('transform', `translate(${x} ${y})`);
      if (i === 1) b.setAttribute('opacity', '0.55');
      bact.append(b);
    });
    // the third one is already being broken down: a few fading fragments
    const FG = prng(5);
    for (let i = 0; i < 4; i++) {
      S('ellipse', {
        cx: f(L.frags[0] + FG.range(-9, 9)), cy: f(L.frags[1] + FG.range(-7, 7)), rx: f(FG.range(2, 3.6)), ry: f(FG.range(1.3, 2.4)),
        transform: `rotate(${f(FG.range(0, 180))} ${f(L.frags[0])} ${f(L.frags[1])})`, fill: PALETTE.bacteria, opacity: f(FG.range(0.25, 0.45)),
      }, bact);
    }
    const streamPath = S('path', {
      d: `M${L.stream[0][0]} ${L.stream[0][1]}Q${L.stream[1][0]} ${L.stream[1][1]} ${L.stream[2][0]} ${L.stream[2][1]}`, fill: 'none', stroke: 'none',
    }, fight);
    const stream = [];
    const SR = prng(13);
    for (let i = 0; i < 18; i++) {
      const g = S('g', null, fight);
      g.append(cytokine({ color: CORAL, size: (compact ? 7 : 8.5) * SR.range(0.8, 1.15), stage: 'dark' }));
      stream.push({ g, phase: (i / 18 + SR.range(-0.02, 0.02) + 1) % 1, lane: SR.range(-1, 1) * (compact ? 11 : 15), wob: SR.range(0, 6) });
    }
    const streamLen = streamPath.getTotalLength();

    // ---- the T cell (shared by "activates" and "quiets")
    const tAct = tCell({ variant: 'cd8', r: compact ? 20 : 23, state: 'activated', polarity: compact ? 180 : 270, seed: 6, stage: 'dark' });
    const tRest = tCell({ variant: 'cd8', r: compact ? 20 : 23, state: 'resting', seed: 6, stage: 'dark' });
    const tRestG = S('g', null, tG);
    tRestG.append(tRest);
    tG.append(tAct);
    const plus = signalIcon({ type: 'activating', size: compact ? 18 : 20, stage: 'dark', x: L.plus[0], y: L.plus[1] });
    const minus = signalIcon({ type: 'inhibitory', size: compact ? 18 : 20, stage: 'dark', x: L.minus[0], y: L.minus[1] });
    tG.append(plus, minus);

    // ---- labels
    const text = (x, y, anchor, t, cls = 't-label t-halo') => S('text', { class: `${cls}${anchor === 'middle' ? ' t-mid' : anchor === 'end' ? ' t-end' : ''}`, x, y, text: t }, labels);
    const lab = {
      kill: text(L.killLabel[0], L.killLabel[1], L.killLabel[2], 'Kills microbes'),
      call: text(L.callLabel[0], L.callLabel[1], L.callLabel[2], 'Recruits more cells'),
      wake: text(L.wakeLabel[0], L.wakeLabel[1], L.wakeLabel[2], 'Activates T cells'),
      vessel: text(L.vesselLabel[0], L.vesselLabel[1], L.vesselLabel[2], 'Grows blood vessels'),
      fib: text(L.fibLabel[0], L.fibLabel[1], L.fibLabel[2], 'Rebuilds tissue'),
      calm: text(L.calmLabel[0], L.calmLabel[1], L.calmLabel[2], 'Quiets T cells'),
      mac: text(L.macLabel[0], L.macLabel[1], 'middle', 'Macrophage'),
    };

    N = { tumorG, tumorSignals, tdots, repair, fight, macG, vessel, branch, branchG, fiberPaths, fibG, bact, stream, streamPath, streamLen, tAct, tRestG, plus, minus, lab };
    macP = null;
    render();
    tick(0);
  }

  // ---------------------------------------------------------------- render (pure function of state)
  function drawMac(s) {
    const p = Math.round(s * 50) / 50;
    if (p === macP) return;
    macP = p;
    if (breatheH) { breatheH.stop(); breatheH = null; }
    const m = macrophage({ r: L.macR, polarization: p, seed: 9, stage: 'dark', state: 'resting' });
    N.macG.replaceChildren(m);
    breatheH = ctx.track(breathe(m, { amplitude: 0.8, period: 7 }));
  }

  function render() {
    if (!N) return;
    const { s } = state;
    const tu = state.tumor;
    drawMac(s);
    const fightO = 1 - s, repairO = s;
    // fight vignettes
    N.bact.setAttribute('opacity', f(fightO));
    N.lab.kill.setAttribute('opacity', f(0.35 + 0.65 * fightO));
    N.lab.call.setAttribute('opacity', f(0.35 + 0.65 * fightO));
    N.lab.wake.setAttribute('opacity', f(0.35 + 0.65 * fightO));
    N.stream.forEach((q) => q.g.setAttribute('visibility', fightO < 0.02 ? 'hidden' : 'visible'));
    N.fight.setAttribute('opacity', f(fightO));
    // repair vignettes
    N.vessel.set(0.12 + 0.88 * repairO);
    N.vessel.g.setAttribute('opacity', f(repairO));
    N.branch.set(repairO);
    N.branchG.setAttribute('opacity', f(tu * repairO));
    N.fibG.setAttribute('opacity', f(repairO));
    N.fiberPaths.forEach((p, i) => p.setAttribute('stroke-dasharray', `${f(Math.max(0, Math.min(1, repairO * 1.25 - i * 0.06)))} 1`));
    N.lab.vessel.setAttribute('opacity', f(0.35 + 0.65 * repairO));
    N.lab.fib.setAttribute('opacity', f(0.35 + 0.65 * repairO));
    N.lab.calm.setAttribute('opacity', f(0.35 + 0.65 * repairO));
    // the shared T cell: bright and "+" at the fight end, dim and "−" at the repair end
    N.tAct.setAttribute('opacity', f(fightO));
    N.tRestG.setAttribute('opacity', f(s * 0.55));
    N.plus.setAttribute('opacity', f(fightO));
    N.minus.setAttribute('opacity', f(repairO));
    // tumor
    N.tumorG.setAttribute('opacity', f(tu));
    N.tumorSignals.setAttribute('opacity', f(tu));
    N.lab.mac.textContent = tumorOn ? 'Tumor-associated macrophage' : 'Macrophage';
    if (!loop.running) tick(lastT);
    caption();
  }

  // Ambient motion: cytokines stream out; tumor signals drift in. A pure function of time.
  function tick(t) {
    if (!N) return;
    for (const q of N.stream) {
      const u = (q.phase + t * 0.06) % 1;
      const pt = N.streamPath.getPointAtLength(u * N.streamLen);
      const o = Math.min(1, u / 0.12, (1 - u) / 0.2);
      const spread = q.lane * (0.25 + u) + Math.sin(u * 7 + q.wob) * 3;   // the stream widens as it spreads out
      q.g.setAttribute('transform', `translate(${f(pt.x)} ${f(pt.y + spread)})`);
      q.g.setAttribute('opacity', f(Math.max(0, o)));
    }
    lastT = t;
    {
      const [mx, my] = L.mac;
      for (const q of N.tdots) {
        const u = (q.phase + t * q.speed) % 1;
        const [x0, y0] = q.from;
        const x1 = mx + (x0 - mx) * 0.42, y1 = my + (y0 - my) * 0.42;   // fade out as they reach the cell
        const nx = -(y1 - y0), ny = x1 - x0, nl = Math.hypot(nx, ny) || 1;
        const w = Math.sin(u * Math.PI) * q.wob;
        const x = x0 + (x1 - x0) * u + (nx / nl) * w, y = y0 + (y1 - y0) * u + (ny / nl) * w;
        q.g.setAttribute('transform', `translate(${f(x)} ${f(y)})`);
        q.g.setAttribute('opacity', f(Math.max(0, Math.min(1, u / 0.15, (1 - u) / 0.25))));
      }
    }
  }
  let lastT = 0;
  const loop = ctx.loop((dt, t) => tick(t));

  // ---------------------------------------------------------------- caption
  function caption() {
    const k = tumorOn ? 'tumor' : state.s < 0.33 ? 'fight' : state.s <= 0.66 ? 'mid' : 'repair';
    if (k === capKey) return;
    const first = capKey == null;
    capKey = k;
    capEl.textContent = CAPTIONS[k];
    if (!first) ctx.announce(CAPTIONS[k]);
  }
  const capEl = h('p', { class: 'ms-caption' });
  ctx.caption.replaceChildren(capEl);

  // ---------------------------------------------------------------- controls
  const word = (v) => (v < 0.2 ? 'Fight end' : v < 0.4 ? 'Mostly fight' : v <= 0.6 ? 'Mixed' : v <= 0.8 ? 'Mostly repair' : 'Repair end');
  const dial = h('div', { class: 'ms-dial' });
  const push = h('div', { class: 'ms-push', 'aria-hidden': 'true' }, 'tumor signals push this way →');
  dial.append(push);
  const slider = ctx.ui.slider({
    label: 'Signals in the neighborhood', min: 0, max: 1, step: 0.01, value: S0, parent: dial,
    format: word, describe: (v) => `${word(v)}: ${v < 0.5 ? 'toward danger signals' : v > 0.5 ? 'toward anti-inflammatory and repair signals' : 'halfway'}`,
    onInput: (v) => { stopGlide(); state.s = v; render(); },
    onChange: (v) => { stopGlide(); state.s = v; render(); },
  });
  dial.append(
    h('div', { class: 'ms-ends' },
      h('div', { class: 'ms-end' }, h('b', null, 'Danger: microbes, IFN-γ'), h('span', { class: 'ms-m' }, '‘M1’')),
      h('div', { class: 'ms-end ms-end--r' }, h('b', null, 'Anti-inflammatory and repair signals: IL-4, IL-10, TGF-β'), h('span', { class: 'ms-m' }, '‘M2’'))),
    h('p', { class: 'ms-foot' }, 'Textbook labels for the two ends of a spectrum.'),
  );
  ctx.controls.append(dial);
  const row = h('div', { class: 'ms-row' });
  ctx.controls.append(row);
  ctx.ui.toggle({ label: 'Place it in a tumor', parent: row, onChange: (on) => setTumor(on) });
  const LEG_BASE = [{ label: 'Inflammatory cytokines', color: CORAL, shape: 'circle' }];
  const LEG_TUMOR = { label: 'Tumor signals: CSF-1, IL-10, TGF-β, lactate, low oxygen', color: PALETTE.cancer, shape: 'circle' };
  const legend = ctx.ui.legend(LEG_BASE, { parent: row });

  function stopGlide() { if (glide) { glide.kill(); glide = null; } }
  function setTumor(on) {
    tumorOn = on;
    push.classList.toggle('is-on', on);
    legend.set(on ? [...LEG_BASE, LEG_TUMOR] : LEG_BASE);
    if (tumorTw) tumorTw.kill();
    stopGlide();
    if (ctx.reducedMotion) {
      state.tumor = on ? 1 : 0;
      if (on && state.s < TUMOR_S) { state.s = TUMOR_S; slider.set(TUMOR_S); }
      render();
      return;
    }
    tumorTw = gsap.to(state, { tumor: on ? 1 : 0, duration: 0.8, ease: 'so.inOut', onUpdate: render });
    if (on && state.s < TUMOR_S) {
      // the dial glides ONCE to 0.85, then stays fully under the reader's control
      glide = gsap.to(state, {
        s: TUMOR_S, duration: 2, ease: 'so.inOut', delay: 0.3,
        onUpdate: () => { slider.set(state.s); render(); },
        onComplete: () => { glide = null; },
      });
    }
    render();
  }

  // ---------------------------------------------------------------- layout
  ctx.onResize(({ compact: c }) => {
    if (N && c === compact) return;
    compact = c;
    build();
  });

  return {
    pause() { if (glide) glide.pause(); if (tumorTw) tumorTw.pause(); },
    resume() { if (glide) glide.resume(); if (tumorTw) tumorTw.resume(); },
    destroy() { stopGlide(); if (tumorTw) tumorTw.kill(); if (breatheH) breatheH.stop(); loop.pause(); },
  };
}
