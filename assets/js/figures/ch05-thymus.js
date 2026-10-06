// ch05-thymus — Figure 5.1 "The thymus exam" (build task F12).
//
// One idea in stages: a three-zone GRIP DIAL decides every thymocyte's fate.
//   Steps 1–4  one candidate at a time in the cortex (stepper, cell-actions grammar).
//   Step 5     the medulla opens: AIRE-switched-on cells show organ proteins; a CD4 cell
//              that grips insulin hard is deleted.
//   Step 6     the scene makes room for a tally; the reader runs 1,000 candidates (400 on
//              phones) on canvas (≤ 20 foreground cells, the rest dots) and can switch AIRE off.
//
// Two layouts drawn from one description (re-layout, not shrink):
//   wide    960×620  cortex left → medulla right; dial band above the cells.
//   compact 400×712  cortex top → medulla middle → exit bottom; tally full width below.
// Static scene groups sit at their "guided" offsets during steps 1–5 and slide to their
// "run" offsets in step 6 (stepper-safe attr tweens). Actors (thymocytes, macrophages) are
// cell-actions rigs in absolute coordinates.
//
// Stepper safety: every step tween is to/fromTo/set or a cell-actions builder. The run and
// the AIRE switch live outside the timeline (own wrapper elements), and are reset whenever
// the reader leaves step 6.
import * as ART from '../art/index.js';
import { unitGrid } from './shared/unit-grid.js';
import { C } from './shared/chart.js';
import { rng, fixedStep, createEffects, killSpecks, spriteStates } from './shared/agents.js';
import { rig, move, recognize, die, clearUp, swap } from './shared/cell-actions.js';

const ID = 'ch05-thymus';
const DEG = Math.PI / 180;
const TAU = Math.PI * 2;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
const f2 = (v) => String(Math.round(v * 100) / 100);
const THY = '#AEB8CC';                 // undecided thymocyte: neutral pale blue-gray (spec)
const SAND = ART.PALETTE.healthy;      // thymic supporting cells
const AIRE_GLOW = '#FFF0D2';
const ORGAN_TARGETS = ['eye', 'stomach', 'salivary'];
const fmt = (v) => String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

// ---------------------------------------------------------------------------- layouts
// Scene coordinates = the RUN layout (step 6). shift[zone] = extra y offset during steps 1–5.
const LAYOUTS = {
  wide: {
    name: 'wide', W: 960, H: 620, N: 1000, release: 22, speed: 120,
    rT: 15, key: 11, cup: 14, rRun: 10,
    shift: { entry: 68, chead: 68, crow: 68, junc: 68, mhead: 68, mrow: 68, exit: 68 },
    entry: { dir: 'h', x0: 2, x1: 56, y: 270, l1: [10, 222], l2: [10, 240] },
    spawn: [-16, 338], staging: [118, 346],
    chead: { x: 82, y: 22, sub2: true },
    mhead: { x: 540, y: 22 },
    tec: { r: 82, body: 30, cups: 7 },
    tecs: [[165, 368], [295, 300], [420, 378]],
    med: { r: 46, body: 30, cups: 6 },
    meds: [[585, 350], [725, 412], [825, 328]],
    dc: { x: 690, y: 258, r: 60 },
    mac: { r: 38, c: [292, 428], m: [632, 432] },
    slots: [-38, 214],
    park: [512, 296], t4From: [518, 530], t4Via: [[520, 402], [548, 336]], t2Via: [[600, 262], [740, 250]],
    junction: 'M512 64 C 496 190, 522 330, 502 470',
    exit: { dir: 'h', x0: 886, x1: 950, y: 300, label: [918, 282] },
    dial: { w: 330, c: { y: 150, x0: 66, x1: 506 }, m: { y: 150, x0: 520, x1: 892 }, l1: 64, l2: 82, chip: 106 },
    labels: {
      thy: { dx: 26, dy: -18, anchor: 'start' }, tec: { at: [165, 368], text: [36, 500], anchor: 'start' },
      mac: { dy: 52 }, dcLab: { x: 690, y: 338, anchor: 'middle' },
    },
    body: { x: 890, y: 402, h: 164, label: [890, 512], anchor: 'middle' },
    strip: {
      grid: { x: 82, y: 488, cols: 10, size: 10, gap: 2 },
      title: [222, 505], sub: [222, 524], counters: { y: 566, xs: [222, 408, 566], stacked: false }, msg: [222, 605],
    },
    run: {
      spawn: [-12, 270], spread: 10, exitTo: [1000, 300], exitAt: (a, W) => a.x > W - 4,
      cortex: (x, y) => x < 498 && x > 60 && y > 150 && y < 470,
    },
  },
  compact: {
    name: 'compact', W: 400, H: 712, N: 400, release: 16, speed: 85,
    rT: 12, key: 9, cup: 12, rRun: 9,
    shift: { entry: 0, chead: 0, crow: 124, junc: 124, mhead: 124, mrow: 272, exit: 272 },
    entry: { dir: 'v', x: 26, y0: 0, y1: 40, l1: [40, 17], l2: [40, 35] },
    spawn: [26, -16], staging: [66, 150],
    chead: { x: 16, y: 62, sub2: false },
    mhead: { x: 16, y: 254 },
    tec: { r: 58, body: 24, cups: 8 },
    tecs: [[70, 160], [200, 146], [330, 162]],
    med: { r: 34, body: 23, cups: 5 },
    meds: [[64, 330], [252, 344], [340, 324]],
    dc: { x: 160, y: 318, r: 42 },
    mac: { r: 26, c: [136, 207], m: [204, 374] },
    slots: [-34, 216],
    park: [372, 358], t4From: [220, 360], t4Via: [[150, 470]], t2Via: [[388, 470]],
    junction: 'M8 232 C 140 240, 260 226, 392 236',
    exit: { dir: 'v', x: 372, y0: 386, y1: 424, label: [360, 410] },
    dial: { w: 368, c: { y: 92, x0: 16, x1: 384 }, m: { y: 408, x0: 16, x1: 384 }, l1: 62, l2: 80, chip: 100 },
    labels: {
      thy: { dx: 22, dy: 4, anchor: 'start' }, tec: { at: [70, 160], text: [16, 248], anchor: 'start' },
      mac: { dy: 40 }, dcLab: { x: 160, y: 282 },
    },
    body: { x: 52, y: 446, h: 92, label: [86, 426], anchor: 'start' },
    strip: {
      grid: { x: 31.5, y: 542, cols: 20, size: 14, gap: 3 },
      title: [16, 512], sub: [16, 530], counters: { y: 650, xs: [16, 146, 276], stacked: true }, msg: [16, 702],
    },
    run: {
      spawn: [26, -12], spread: 8, exitTo: [372, 470], exitAt: (a) => a.y > 426,
      cortex: (x, y) => y > 92 && y < 226 && x > 8 && x < 392,
    },
  },
};

const STYLE = `
[data-figure="${ID}"] .th-d1 { font-size: max(15px, calc(14px * var(--u, 1))); font-weight: 600; fill: var(--fg); }
[data-figure="${ID}"] .th-d2 { font-size: max(13px, calc(14px * var(--u, 1))); font-weight: 500; fill: var(--fg-2); }
[data-figure="${ID}"] .th-chip-t { font-size: max(13px, calc(13px * var(--u, 1))); font-weight: 560; fill: var(--fg); }
[data-figure="${ID}"] .th-num { font-size: max(21px, calc(17px * var(--u, 1))); font-weight: 650; fill: var(--fg); font-variant-numeric: tabular-nums; }
[data-figure="${ID}"] .th-chip-bg { fill: rgb(11 16 36 / 0.86); stroke-width: 1.2; }
[data-figure="${ID}"] .th-arrow { fill: none; stroke: var(--fg-2); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
[data-figure="${ID}"] .th-junction { fill: none; stroke: var(--fg-3); stroke-width: 1.2; stroke-dasharray: 2 7; stroke-linecap: round; opacity: 0.55; vector-effect: non-scaling-stroke; }
[data-figure="${ID}"] .th-lead { fill: none; stroke: var(--fg-2); stroke-width: 1; stroke-dasharray: 2 4; vector-effect: non-scaling-stroke; }
[data-figure="${ID}"] .th-run[hidden] { display: none !important; }
[data-figure="${ID}"] .th-run { display: flex; flex-wrap: wrap; align-items: center; gap: var(--s-3, 0.75rem); }
`;
function injectStyle() {
  if (document.getElementById(`${ID}-style`)) return;
  const s = document.createElement('style');
  s.id = `${ID}-style`;
  s.textContent = STYLE;
  document.head.append(s);
}

// ---------------------------------------------------------------------------- art helpers

/**
 * Thymic supporting (epithelial) cell: single-use art, drawn locally from library primitives.
 * cortex: branching, net-like processes; medulla: compact. MHC cups with sand self-peptides;
 * one "dock" cup at dockAngle where the thymocyte reads it.
 */
function thymicCell(ctx, { kind, r, body, seed, cup, dockAngle = -90, cups = 8, dockClass = 'mhc1' }) {
  const S = (t, a, p) => ctx.svg(t, a, p);
  const R = ART.rng(seed, 'tec');
  const T = ART.tones(SAND, 'dark');
  const cortex = kind === 'cortex';
  const bodyFn = ART.blobRadius({ r: body, seed, irregularity: 0.12, kMax: 4 });
  const da = dockAngle * DEG;
  const free = 0.72;
  const k = cortex ? 6 : 4;
  const arms = [];
  for (let i = 0; i < k; i++) {
    const a = da + free + ((i + 0.5) * (TAU - 2 * free)) / k + R.range(-0.16, 0.16);
    const L = (r - body) * (cortex ? R.range(0.84, 1) : R.range(0.5, 0.85));
    const branches = [];
    if (cortex) {
      branches.push({ at: R.range(0.35, 0.6), side: R.chance(0.5) ? 1 : -1, angle: R.range(0.55, 0.95), length: L * R.range(0.34, 0.5), base: body * 0.085, tip: 0.7, bend: R.range(-0.4, 0.4), taper: 1.6 });
      if (R.chance(0.6)) branches.push({ at: R.range(0.66, 0.82), side: R.chance(0.5) ? 1 : -1, angle: R.range(0.4, 0.8), length: L * 0.26, base: body * 0.06, tip: 0.6, bend: 0.2, taper: 1.5 });
    }
    arms.push({
      angle: a, length: L, base: body * (cortex ? R.range(0.19, 0.25) : R.range(0.32, 0.4)), tip: cortex ? 0.8 : 2.4,
      bend: R.range(-0.55, 0.55), taper: cortex ? 2.1 : 1.4, branches, curl: cortex ? R.range(0.04, 0.16) : 0, curlPhase: R.range(0, TAU),
    });
  }
  const pts = ART.armOutline((th, t) => bodyFn(th, t), arms, { step: 3 });
  const d = ART.smoothPath(pts, { smooth: 0.32 });
  const g = S('g', { class: 'th-tec', 'data-tec': kind });
  S('circle', { r: f2(body * 2.3), fill: ART.haloFill(SAND, 'dark'), opacity: cortex ? 0.55 : 0.8 }, g);
  S('path', {
    d, fill: ART.bodyFill(SAND, 'dark', { r: body * 1.15, intensity: cortex ? 1.3 : 1.15 }), fillOpacity: cortex ? 0.66 : 0.85,
    stroke: T.rim, strokeOpacity: cortex ? 0.5 : 0.7, strokeWidth: cortex ? 1 : 1.2, strokeLinejoin: 'round',
  }, g);
  const ncx = R.range(-3, 3), ncy = R.range(0, 4);
  S('ellipse', { cx: f2(ncx), cy: f2(ncy), rx: f2(body * 0.5), ry: f2(body * 0.43), fill: ART.nucleusFill(SAND, 'dark'), stroke: T.nucRim, strokeOpacity: 0.55, strokeWidth: 0.9 }, g);
  const chrom = ART.rng(seed, 'chrom');
  let cd = '';
  for (let i = 0; i < 7; i++) {
    const a = chrom.range(0, TAU), rr = Math.sqrt(chrom()) * body * 0.34, s = body * chrom.range(0.035, 0.06);
    cd += ART.circleD(ncx + Math.cos(a) * rr, ncy + Math.sin(a) * rr * 0.85, s);
  }
  S('path', { d: cd, fill: T.chromatin, opacity: 0.55 }, g);
  const glow = kind === 'medulla'
    ? S('circle', { cx: f2(ncx), cy: f2(ncy), r: f2(body * 0.78), fill: ART.dotGlow(AIRE_GLOW, 0.75), opacity: 0 }, g)
    : null;
  S('path', { d: ART.smoothPath(ART.polarPoints(bodyFn, 32)), fill: ART.sheenFill(SAND, 'dark'), pointerEvents: 'none' }, g);
  // cups
  const cupsG = S('g', { 'data-part': 'receptors' }, g);
  const rb = bodyFn(da, 0);
  const dock = { x: Math.cos(da) * rb, y: Math.sin(da) * rb };
  const dockCup = (dockClass === 'mhc2' ? ART.mhc2 : ART.mhc1)({ size: cup, peptide: 'self', stage: 'dark', detail: 'high' });
  dockCup.setAttribute('transform', `translate(${f2(dock.x)} ${f2(dock.y)}) rotate(${f2(dockAngle + 90)})`);
  // decorative cups on the cell body and the bases of its processes (not on thin tips)
  const near = ART.samplePerimeter(pts, 64, { offset: R.range(0, 1) })
    .filter((p) => Math.hypot(p.x, p.y) < body * 1.7 && Math.hypot(p.x - dock.x, p.y - dock.y) > cup * 2.2);
  const stepK = Math.max(1, near.length / cups);
  for (let j = 0; j < cups && Math.floor(j * stepK) < near.length; j++) {
    const sp = near[Math.floor(j * stepK)];
    const m = (j % 2 ? ART.mhc2 : ART.mhc1)({ size: cup * 0.82, peptide: 'self', stage: 'dark', detail: 'low' });
    m.setAttribute('transform', `translate(${f2(sp.x)} ${f2(sp.y)}) rotate(${f2((sp.angle * 180) / Math.PI + 90)})`);
    cupsG.append(m);
  }
  cupsG.append(dockCup);
  return { g, dock, glow, nucleus: { x: ncx, y: ncy }, rb };
}

/** Arrow (entry / exit). */
function arrow(ctx, parent, { dir, x0, x1, y, x, y0, y1 }) {
  const g = ctx.svg('g', null, parent);
  if (dir === 'h') {
    ctx.svg('path', { class: 'th-arrow', d: `M${x0} ${y}H${x1}M${x1 - 9} ${y - 7}L${x1} ${y}L${x1 - 9} ${y + 7}` }, g);
  } else {
    ctx.svg('path', { class: 'th-arrow', d: `M${x} ${y0}V${y1}M${x - 7} ${y1 - 9}L${x} ${y1}L${x + 7} ${y1 - 9}` }, g);
  }
  return g;
}

/** Text label with an optional leader (to [lx, ly]). */
function textLabel(ctx, parent, { x, y, text, anchor = 'start', cls = 't-label t-halo', leader = null, opacity = 0 }) {
  const g = ctx.svg('g', null, parent);
  if (leader) {
    const [lx, ly] = leader;
    const tx = x + (anchor === 'end' ? -6 : anchor === 'middle' ? 0 : 6);
    const ty = y + (ly > y ? 6 : -16);
    ctx.svg('line', { class: 'leader', x1: tx, y1: ty, x2: lx, y2: ly }, g);
    ctx.svg('circle', { class: 'leader-dot', cx: lx, cy: ly, r: 2.4 }, g);
  }
  ctx.svg('text', { class: cls, x, y, 'text-anchor': anchor, text }, g);
  ctx.gsap.set(g, { opacity });
  return g;
}

// ---------------------------------------------------------------------------- module

export default async function mount(fig, ctx) {
  const { gsap } = ctx;
  injectStyle();
  ctx.setAspect(LAYOUTS.wide.W / LAYOUTS.wide.H, LAYOUTS.compact.W / LAYOUTS.compact.H);
  ctx.tag('Illustrative');

  const L0 = ctx.compact ? LAYOUTS.compact : LAYOUTS.wide;
  const svg = ctx.createSVG({ viewBox: `0 0 ${L0.W} ${L0.H}` });
  const cv = ctx.canvas();
  cv.el.style.pointerEvents = 'none';
  const S = (t, a, p) => ctx.svg(t, a, p);
  const cssVar = (name, fb) => (getComputedStyle(ctx.stage).getPropertyValue(name).trim() || fb);
  const YES = cssVar('--yes', '#3DDC97');
  const NO = cssVar('--no', '#FF6B73');
  const P = ART.PALETTE;

  let L = ctx.compact ? LAYOUTS.compact : LAYOUTS.wide;
  let el = {};
  let ambients = [];
  const zoneShift = (z) => L.shift[z] || 0;
  const abs = (z, [x, y]) => [x, y + zoneShift(z)];

  // Thymocyte docking: center distance above the supporting cell's dock cup.
  const dockReach = (gap) => L.cup * 0.9 + L.key + L.rT + gap;

  // ------------------------------------------------------------------ sprites (run)
  const sheet = await spriteStates({
    thy: ['tCell', { variant: 'cd4', color: THY, r: 10, receptors: false, detail: 'high', stage: 'dark' }],
    cd8: ['tCell', { variant: 'cd8', r: 10, receptors: false, detail: 'high', stage: 'dark' }],
    cd4: ['tCell', { variant: 'cd4', r: 10, receptors: false, detail: 'high', stage: 'dark' }],
  }, { seeds: 3 });
  const organSprites = {};
  await Promise.all(ORGAN_TARGETS.map(async (n) => { organSprites[n] = await ART.sprite(ART.organIcon, { name: n, size: 15, stage: 'dark' }); }));
  const dotSprites = {};
  const makeDot = (color) => {
    const c = document.createElement('canvas');
    const s = 32;
    c.width = c.height = s;
    const g = c.getContext('2d');
    const gr = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    gr.addColorStop(0, ART.mix(color, '#FFFFFF', 0.35));
    gr.addColorStop(0.32, color);
    gr.addColorStop(0.5, ctx.alpha(color, 0.35));
    gr.addColorStop(1, ctx.alpha(color, 0));
    g.fillStyle = gr;
    g.fillRect(0, 0, s, s);
    return c;
  };
  dotSprites.thy = makeDot(THY);
  dotSprites.cd8 = makeDot(P.cd8);
  dotSprites.cd4 = makeDot(P.cd4);

  // ------------------------------------------------------------------ scene (reset)
  function killAmbients() { ambients.splice(0).forEach((t) => t.kill()); }

  function draw() {
    killAmbients();
    stopRun(true);
    for (const c of [...svg.children]) if (c !== svg.defs) c.remove();
    svg.setAttribute('viewBox', `0 0 ${L.W} ${L.H}`);
    ctx.refreshTextScale();
    const E = {};
    el = E;

    // --- static groups (zone offsets) ---
    const zoneG = (z) => S('g', { transform: `translate(0 ${zoneShift(z)})`, 'data-zone': z }, svg);
    E.zones = {};
    const back = S('g', null, svg);
    // faint crowd of out-of-focus thymocytes: the cortex is packed, the medulla sparser
    {
      const R = ART.rng(5, 'crowd');
      const crowdC = S('g', { transform: `translate(0 ${zoneShift('crow')})`, opacity: 0.9 }, back);
      const crowdM = S('g', { transform: `translate(0 ${zoneShift('mrow')})` }, back);
      E.zones.crowdC = crowdC; E.zones.crowdM = crowdM;
      let dc = '', dm = '';
      const box = L.name === 'wide'
        ? { c: [60, 120, 500, 470], m: [520, 120, 900, 470] }
        : { c: [8, 92, 392, 226], m: [8, 290, 392, 386] };
      for (let i = 0; i < (L.name === 'wide' ? 150 : 80); i++) {
        const x = R.range(box.c[0], box.c[2]), y = R.range(box.c[1], box.c[3]);
        dc += ART.circleD(x, y, R.range(3.5, 6.5) * (L.rT / 15));
      }
      for (let i = 0; i < (L.name === 'wide' ? 40 : 22); i++) {
        const x = R.range(box.m[0], box.m[2]), y = R.range(box.m[1], box.m[3]);
        dm += ART.circleD(x, y, R.range(3.5, 6.5) * (L.rT / 15));
      }
      S('path', { d: dc, fill: THY, opacity: 0.07 }, crowdC);
      S('path', { d: dm, fill: THY, opacity: 0.05 }, crowdM);
    }

    E.zones.junc = zoneG('junc');
    S('path', { class: 'th-junction', d: L.junction }, E.zones.junc);

    // entry
    E.zones.entry = zoneG('entry');
    arrow(ctx, E.zones.entry, L.entry);
    S('text', { class: 't-label t-halo', x: L.entry.l1[0], y: L.entry.l1[1], text: 'From bone marrow' }, E.zones.entry);
    S('text', { class: 't-small t-halo', x: L.entry.l2[0], y: L.entry.l2[1], text: 'no receptor yet' }, E.zones.entry);

    // cortex header
    E.zones.chead = zoneG('chead');
    S('text', { class: 't-caps', x: L.chead.x, y: L.chead.y, text: 'Cortex' }, E.zones.chead);
    S('text', { class: 't-small', x: L.chead.x, y: L.chead.y + 19, text: 'Test 1, positive selection: can it bind MHC?' }, E.zones.chead);
    if (L.chead.sub2) S('text', { class: 't-small t-muted', x: L.chead.x, y: L.chead.y + 36, text: 'plus a first round of Test 2' }, E.zones.chead);

    // cortex row: three net-like supporting cells
    E.zones.crow = zoneG('crow');
    E.tecs = L.tecs.map(([x, y], i) => {
      const t = thymicCell(ctx, { kind: 'cortex', r: L.tec.r, body: L.tec.body, seed: 11 + i * 7, cup: L.cup, cups: L.tec.cups, dockAngle: -90 });
      t.g.setAttribute('transform', `translate(${x} ${y})`);
      E.zones.crow.append(t.g);
      const [ax, ay] = abs('crow', [x, y]);
      return { ...t, x, y, ax, ay, dockAbs: { x: ax + t.dock.x, y: ay + t.dock.y } };
    });

    // medulla header (hidden until step 5)
    E.zones.mhead = zoneG('mhead');
    E.mheadIn = S('g', null, E.zones.mhead);
    S('text', { class: 't-caps', x: L.mhead.x, y: L.mhead.y, text: 'Medulla' }, E.mheadIn);
    S('text', { class: 't-small', x: L.mhead.x, y: L.mhead.y + 19, text: 'Test 2, negative selection: organ proteins via AIRE' }, E.mheadIn);
    gsap.set(E.mheadIn, { opacity: 0 });

    // medulla row (dim until step 5)
    E.zones.mrow = zoneG('mrow');
    E.mrowIn = S('g', null, E.zones.mrow);
    gsap.set(E.mrowIn, { opacity: 0.32 });
    const dcArt = ART.dendriticCell({ state: 'immature', r: L.dc.r, seed: 4, stage: 'dark', peptide: 'self' });
    const dcWrap = S('g', { transform: `translate(${L.dc.x} ${L.dc.y})` }, E.mrowIn);
    const dcIdle = S('g', null, dcWrap);
    dcIdle.append(dcArt);
    E.dcLabel = textLabel(ctx, E.mrowIn, { x: L.labels.dcLab.x, y: L.labels.dcLab.y, text: L.name === 'wide' ? 'Dendritic cell' : '', anchor: L.labels.dcLab.anchor || 'middle', cls: 't-small t-halo' });
    E.meds = L.meds.map(([x, y], i) => {
      const t = thymicCell(ctx, { kind: 'medulla', r: L.med.r, body: L.med.body, seed: 41 + i * 5, cup: L.cup, cups: L.med.cups, dockAngle: -90, dockClass: i === 0 ? 'mhc2' : 'mhc1' });
      t.g.setAttribute('transform', `translate(${x} ${y})`);
      E.mrowIn.append(t.g);
      // AIRE glow: switch wrapper (AIRE on/off) > timeline glow (step 5)
      const sw = S('g', null, t.g);
      sw.append(t.glow);
      const [ax, ay] = abs('mrow', [x, y]);
      return { ...t, x, y, ax, ay, glowSwitch: sw, dockAbs: { x: ax + t.dock.x, y: ay + t.dock.y } };
    });
    // AIRE label (on M2) + "AIRE off" twin
    {
      const m = E.meds[1];
      const nx = m.x + m.nucleus.x, ny = m.y + m.nucleus.y;
      const lx = L.name === 'wide' ? m.x + 56 : m.x - 22, ly = L.name === 'wide' ? m.y + 62 : m.y + 50;
      E.aireLab = S('g', null, E.mrowIn);
      gsap.set(E.aireLab, { opacity: 0 });
      S('line', { class: 'leader', x1: lx - 4, y1: ly - 14, x2: nx + 5, y2: ny + 5 }, E.aireLab);
      S('circle', { class: 'leader-dot', cx: nx + 4, cy: ny + 4, r: 2.4 }, E.aireLab);
      E.aireOn = S('text', { class: 't-label t-halo', x: lx, y: ly, text: 'AIRE' }, E.aireLab);
      E.aireOff = S('text', { class: 't-label t-halo t-muted', x: lx, y: ly, text: 'AIRE off' }, E.aireLab);
      gsap.set(E.aireOff, { opacity: 0 });
    }
    // organ-protein icons: slot (AIRE switch) > slotIn (step 5) > icons (ambient cycle)
    E.slots = [];
    {
      const sets = [[['pancreas'], ['eye', 'salivary', 'stomach']], [['stomach', 'eye', 'pancreas'], ['salivary', 'pancreas', 'eye']], [['eye', 'stomach', 'salivary'], ['pancreas', 'salivary', 'stomach']]];
      const keep = new Set(['1-0', '2-1']);    // AIRE-independent slots (about a third)
      const iconR = L.name === 'wide' ? 12 : 10.5;
      E.meds.forEach((m, mi) => {
        L.slots.forEach((angle, si) => {
          const rr = m.rb + iconR + 6;
          const x = m.x + Math.cos(angle * DEG) * rr, y = m.y + Math.sin(angle * DEG) * rr;
          const sw = S('g', { transform: `translate(${f2(x)} ${f2(y)})` }, E.mrowIn);
          const inner = S('g', null, sw);
          gsap.set(inner, { opacity: 0 });
          S('circle', { r: iconR, fill: '#0B1024', fillOpacity: 0.78, stroke: SAND, strokeOpacity: 0.55, strokeWidth: 1 }, inner);
          const names = sets[mi][si];
          const icons = names.map((n) => {
            const ic = ART.organIcon(n, { size: iconR * 1.45, stage: 'dark' });
            const w = S('g', null, inner);
            w.append(ic);
            gsap.set(w, { opacity: 0 });
            return w;
          });
          gsap.set(icons[0], { opacity: 1 });
          E.slots.push({ sw, inner, icons, names, keep: keep.has(`${mi}-${si}`), x, y, mi, si });
        });
      });
      // the insulin (pancreas) icon on M1 is the step-5 protagonist: labelled, never cycles
      const ins = E.slots[0];
      const lw = L.name === 'wide';
      E.insulinAt = ins;
      E.insulinLab = textLabel(ctx, svg, {
        x: ins.x, y: ins.y - (lw ? 19 : 17), text: 'Insulin', anchor: 'middle', cls: 't-small t-halo',
      });
    }

    // exit
    E.zones.exit = zoneG('exit');
    E.exitIn = S('g', null, E.zones.exit);
    gsap.set(E.exitIn, { opacity: 0.32 });
    arrow(ctx, E.exitIn, L.exit);
    S('text', { class: 't-label t-halo', x: L.exit.label[0], y: L.exit.label[1], 'text-anchor': L.exit.dir === 'h' ? 'middle' : 'end', text: 'To blood' }, E.exitIn);

    // --- actors (absolute guided coordinates) ---
    E.actors = S('g', { 'data-layer': 'actors' }, svg);

    const macC = rig(ART.macrophage({ variant: 'm1', r: L.mac.r, seed: 3, stage: 'dark' }), { x: abs('crow', L.mac.c)[0], y: abs('crow', L.mac.c)[1], parent: E.actors, name: 'mac-c' });
    const macM = rig(ART.macrophage({ variant: 'm1', r: L.mac.r, seed: 9, stage: 'dark' }), { x: abs('mrow', L.mac.m)[0], y: abs('mrow', L.mac.m)[1], parent: E.actors, opacity: 0.32, name: 'mac-m' });
    E.macC = macC; E.macM = macM;
    E.macHome = { c: abs('crow', L.mac.c), m: abs('mrow', L.mac.m) };
    // Polish: every coral cell carries its name from the start (coral = macrophage since Ch 2); the
    // label rides in the rig's unscaled 'over' layer, so it follows the cell and fades with it.
    for (const m of [macC, macM]) textLabel(ctx, m.layers.over, { x: 0, y: L.labels.mac.dy, text: 'Macrophage', anchor: 'middle', cls: 't-small t-halo', opacity: 1 });

    // thymocytes
    const mkThy = (name, { seed, keys, lineage = null, colored = null, from }) => {
      const art = ART.tCell({ variant: lineage || 'cd4', color: lineage ? undefined : THY, r: L.rT, seed, receptors: false, detail: 'high', stage: 'dark' });
      const R = rig(art, { x: from[0], y: from[1], parent: E.actors, opacity: 0, name });
      const info = ART.cellInfo(art);
      const slots = [];
      for (const a of [90, 44, 136, -6, 186, -90]) {
        const h = ART.rayHit(info.outline, a * DEG);
        const rm = Math.hypot(h.x, h.y) * 0.97;
        const outer = S('g', { transform: `translate(${f2(Math.cos(a * DEG) * rm)} ${f2(Math.sin(a * DEG) * rm)}) rotate(${a + 90})` }, R.layers.inner);
        const inner = S('g', null, outer);
        const glyphs = keys.map((k) => {
          const gk = ART.tcrKey({ key: k, size: L.key, color: lineage ? P[lineage] : THY, stage: 'dark' });
          inner.append(gk);
          gsap.set(gk, { opacity: lineage ? 1 : 0 });
          return gk;
        });
        let col = null;
        if (colored) {
          col = ART.tcrKey({ key: keys[keys.length - 1], size: L.key, color: P[colored], stage: 'dark' });
          inner.append(col);
          gsap.set(col, { opacity: 0 });
        }
        slots.push({ outer, inner, glyphs, col });
      }
      R.keySlots = slots;
      return R;
    };
    const spawn = L.spawn;
    E.T1 = mkThy('t1', { seed: 21, keys: [3, 17, 8, 29, 12], from: spawn });
    E.T2 = mkThy('t2', { seed: 22, keys: [5, 21, 33, 2, 40], colored: 'cd8', from: spawn });
    E.T3 = mkThy('t3', { seed: 23, keys: [9, 14, 26, 37, 6], from: spawn });
    E.T4 = mkThy('t4', { seed: 24, keys: [19], lineage: 'cd4', from: L.t4From });
    E.T2cd8 = ART.tCell({ variant: 'cd8', r: L.rT, seed: 22, receptors: false, detail: 'high', stage: 'dark' });
    E.fxAbove = S('g', null, E.actors);

    // labels for actors
    E.thyLab = textLabel(ctx, E.actors, {
      x: L.staging[0] + L.labels.thy.dx, y: L.staging[1] + L.labels.thy.dy, text: 'Thymocyte', anchor: L.labels.thy.anchor,
    });
    {
      const tA = E.tecs[0];
      E.tecLab = L.name === 'wide'
        ? textLabel(ctx, E.actors, { x: 34, y: tA.ay + 112, text: 'Epithelial cell', cls: 't-small t-halo', leader: [tA.ax - 22, tA.ay + 22] })
        : null;
    }

    // ✕ badges for deletions (absolute, attached to T3 / T4 dock positions later)
    E.xT3 = ctx.badgeSVG('no', { x: 0, y: 0, r: L.name === 'wide' ? 10 : 9 }, E.fxAbove);
    E.xT4 = ctx.badgeSVG('no', { x: 0, y: 0, r: L.name === 'wide' ? 10 : 9 }, E.fxAbove);
    gsap.set([E.xT3, E.xT4], { opacity: 0 });

    // labels that must stay above the actors (medulla zone offset)
    E.zones.mtop = S('g', { transform: `translate(0 ${zoneShift('mrow')})`, 'data-zone': 'mrow' }, svg);
    E.zones.mtop.append(E.insulinLab);

    // --- dials (absolute guided coordinates) ---
    E.dialC = buildDial(svg, 'c');
    E.dialM = buildDial(svg, 'm');
    E.leaders = S('g', null, svg);

    // --- body map + strip (run coordinates; hidden until needed) ---
    buildBodyMap();
    buildStrip();

    // --- idle life (ambient: never during reduced motion, paused off-screen) ---
    ambients.push(ctx.ambient(gsap.to(dcIdle, { rotation: 2.5, svgOrigin: '0 0', duration: 5.5, ease: 'sine.inOut', yoyo: true, repeat: -1 })));
    for (const m of [macC, macM]) {
      ambients.push(ctx.ambient(gsap.to(m.layers.idle, { scale: 1.02, rotation: 3, svgOrigin: '0 0', duration: 3.8 + (m === macM ? 0.7 : 0), ease: 'sine.inOut', yoyo: true, repeat: -1 })));
    }
    // organ icons: every ~4 s one cycling slot swaps its icon (each slot every 20 s)
    const cyc = E.slots.filter((s) => s.icons.length > 1);
    cyc.forEach((s, k) => {
      const period = 4 * cyc.length;            // 20 s
      const n = s.icons.length;
      const tl = gsap.timeline({ repeat: -1 });
      for (let j = 0; j < n; j++) {
        const at = k * 4 + j * period;           // icon j → j+1 change time
        tl.to(s.icons[j], { opacity: 0, duration: 0.8, ease: 'power1.inOut' }, at)
          .to(s.icons[(j + 1) % n], { opacity: 1, duration: 0.8, ease: 'power1.inOut' }, at + 0.3);
      }
      tl.set({}, {}, n * period);                // pad: the cycle is exactly n × period long
      s.icons.forEach((ic) => ic.setAttribute('data-ambient', ''));
      ambients.push(ctx.ambient(tl));
    });
  }

  // ------------------------------------------------------------------ the binding dial
  function buildDial(parent, zone) {
    const D = L.dial;
    const w = D.w;
    const g = S('g', { transform: `translate(0 ${D[zone].y})`, 'data-dial': zone }, parent);
    gsap.set(g, { opacity: 0 });
    S('text', { class: 't-caps', x: 0, y: 9, text: 'Binding to self' }, g);
    const zw = w / 3;
    const zones = [
      { l1: 'None', l2: '→ neglect', fill: '#7F89AB', icon: 'ring' },
      { l1: 'Weak', l2: 'sweet spot', fill: P.activate, icon: 'yes' },
      { l1: 'Strong', l2: '→ deletion', fill: P.inhibit, icon: 'no' },
    ].map((z, i) => {
      const zg = S('g', null, g);
      const x0 = i * zw + (i ? 2 : 0), x1 = (i + 1) * zw - (i < 2 ? 2 : 0);
      S('rect', { x: f2(x0), y: 26, width: f2(x1 - x0), height: 18, rx: 9, fill: z.fill, fillOpacity: 0.38, stroke: z.fill, strokeOpacity: 0.85, strokeWidth: 1.2 }, zg);
      const cx = i * zw + zw / 2;
      if (z.icon === 'ring') S('circle', { cx: f2(cx), cy: 35, r: 5.5, fill: 'none', stroke: 'var(--fg)', strokeWidth: 1.8 }, zg);
      else ctx.badgeSVG(z.icon, { x: cx, y: 35, r: 7.5 }, zg);
      S('text', { class: 'th-d1', x: f2(cx), y: D.l1, 'text-anchor': 'middle', text: z.l1 }, zg);
      S('text', { class: 'th-d2', x: f2(cx), y: D.l2, 'text-anchor': 'middle', text: z.l2 }, zg);
      return zg;
    });
    const needle = S('g', { transform: 'translate(0 0)' }, g);
    S('path', { d: 'M-6.5 12L6.5 12L0 22Z', fill: 'var(--fg)' }, needle);
    S('line', { x1: 0, y1: 22, x2: 0, y2: 48, stroke: 'var(--fg)', strokeWidth: 2.2, strokeLinecap: 'round' }, needle);
    const chips = S('g', null, g);
    return { g, zones, needle, chips, w, zone, y: D[zone].y };
  }

  /** Verdict chip inside a dial: pill with an outcome icon + text. */
  function dialChip(dial, kind, text) {
    const fs = L.name === 'wide' ? 13 : 14.6;
    const tw = text.length * fs * 0.54;
    const iconW = 22;
    const wPill = tw + iconW + 26;
    const cx = dial.w / 2;
    const cy = L.dial.chip;
    const g = S('g', { transform: `translate(${f2(cx - wPill / 2)} ${f2(cy - 13)})` }, dial.chips);
    const col = kind === 'yes' ? P.activate : kind === 'no' ? P.inhibit : '#A9B1CC';
    S('rect', { class: 'th-chip-bg', x: 0, y: 0, width: f2(wPill), height: 26, rx: 13, stroke: col, strokeOpacity: 0.75 }, g);
    if (kind === 'ring') S('circle', { cx: 15, cy: 13, r: 5.5, fill: 'none', stroke: 'var(--fg)', strokeWidth: 1.8 }, g);
    else ctx.badgeSVG(kind, { x: 15, y: 13, r: 8 }, g);
    S('text', { class: 'th-chip-t', x: iconW + 10, y: 17.5, text }, g);
    gsap.set(g, { opacity: 0 });
    return g;
  }

  function dialX(dial, x) {
    const z = L.dial[dial.zone];
    return clamp(x - dial.w / 2, z.x0, z.x1 - dial.w);
  }

  /**
   * A dial reading, appended at `pos`: place the (hidden) dial above x, fade in, sweep the
   * needle to `value` (0..1), highlight the zone, then show the verdict chip.
   * Returns times { shown, read, verdict }.
   */
  function reading(tl, dial, { x, dockY, value, chip, pos }) {
    const dx = dialX(dial, x);
    const zi = value < 1 / 3 ? 0 : value < 2 / 3 ? 1 : 2;
    tl.set(dial.g, { attr: { transform: `translate(${f2(dx)} ${dial.y})` } }, pos);
    tl.set(dial.needle, { attr: { transform: 'translate(0 0)' } }, pos);
    tl.set(dial.zones, { opacity: 1 }, pos);
    tl.to(dial.g, { opacity: 1, duration: 0.45, ease: 'power1.out' }, pos);
    // dotted leader from the dial down to the docked cell
    const top = dial.y + L.dial.chip + 16;
    const ld = S('path', { class: 'th-lead', d: `M${f2(x)} ${f2(top)}V${f2(Math.max(top + 1, dockY - L.rT - 5))}` }, el.leaders);
    gsap.set(ld, { opacity: 0 });
    tl.to(ld, { opacity: 0.9, duration: 0.45 }, pos + 0.1);
    tl.to(dial.needle, { attr: { transform: `translate(${f2(value * dial.w)} 0)` }, duration: 1.15, ease: 'so.inOut' }, pos + 0.5);
    dial.zones.forEach((z, i) => { if (i !== zi) tl.to(z, { opacity: 0.38, duration: 0.5 }, pos + 1.65); });
    tl.to(chip, { opacity: 1, duration: 0.5 }, pos + 1.95);
    return { shown: pos + 0.45, read: pos + 1.65, verdict: pos + 1.95, leader: ld };
  }
  function hideDial(tl, dial, chip, leader, pos) {
    tl.to([dial.g], { opacity: 0, duration: 0.45, ease: 'power1.in' }, pos);
    if (chip) tl.to(chip, { opacity: 0, duration: 0.3 }, pos);
    if (leader) tl.to(leader, { opacity: 0, duration: 0.3 }, pos);
  }

  // ------------------------------------------------------------------ body map + strip
  function buildBodyMap() {
    const B = L.body;
    const g = S('g', { transform: `translate(${B.x} ${B.y})` }, svg);
    gsap.set(g, { opacity: 0 });
    const map = ART.bodyMap({ height: B.h, stage: 'dark', organs: ['eye', 'salivary', 'stomach'] });
    g.append(map);
    const info = ART.cellInfo(map);
    const rings = {};
    const side = B.anchor === 'start' ? -1 : 1;          // badges away from the label
    const badgeAt = { eye: [-16, -8], salivary: [0, 6], stomach: [0, 0] };
    for (const name of ORGAN_TARGETS) {
      const a = info.anchors[name];
      const rg = S('g', null, g);
      const rr = Math.max(a.r * 1.35, 6.5);
      S('circle', { cx: f2(a.x), cy: f2(a.y), r: f2(rr), fill: 'none', stroke: P.inhibit, strokeWidth: 1.8 }, rg);
      const [ox, oy] = badgeAt[name];
      const bx = a.x + side * (B.h * 0.2 + 4), by = a.y + oy + (name === 'eye' ? ox * 0.5 : 0);
      S('line', { x1: f2(a.x + side * rr), y1: f2(a.y), x2: f2(bx - side * 7), y2: f2(by), stroke: P.inhibit, strokeWidth: 1.2, strokeOpacity: 0.8 }, rg);
      S('circle', { cx: f2(bx), cy: f2(by), r: 7, fill: P.inhibit, stroke: '#0B1024', strokeWidth: 1.5 }, rg);
      S('text', { x: f2(bx), y: f2(by + 4.2), 'text-anchor': 'middle', style: 'font-size:11.5px;font-weight:800;fill:#fff', text: '!' }, rg);
      gsap.set(rg, { opacity: 0 });
      rings[name] = rg;
    }
    const lab = S('g', null, svg);
    const anchor = B.anchor;
    S('text', { class: 't-small t-halo', x: B.label[0], y: B.label[1], 'text-anchor': anchor, text: 'Self-reactive' }, lab);
    S('text', { class: 't-small t-halo', x: B.label[0], y: B.label[1] + 17, 'text-anchor': anchor, text: 'T cells escaped' }, lab);
    const count = S('text', { class: 'th-num', x: B.label[0], y: B.label[1] + 44, 'text-anchor': anchor, text: '0' }, lab);
    gsap.set(lab, { opacity: 0 });
    el.body = { g, rings, lab, count };
  }

  function buildStrip() {
    const T = L.strip;
    const g = S('g', null, svg);
    gsap.set(g, { opacity: 0 });
    // Polish (units): the counters are running totals of the whole run, so the waffle says what one
    // dot is worth instead of "every 100" (1,000 candidates → 1 dot = 10; phones: 400 → 1 dot = 4).
    S('text', { class: 't-label', x: T.title[0], y: T.title[1], text: `Fate of ${fmt(L.N)} thymocytes · 1 dot = ${L.N / 100}` }, g);
    S('text', { class: 't-small', x: T.sub[0], y: T.sub[1], text: 'Illustrative proportions based on mouse studies' }, g);
    const gr = T.grid;
    const base = { count: 100, cols: gr.cols, size: gr.size, gap: gr.gap, shape: 'circle', x: gr.x, y: gr.y };
    const grids = {
      slot: unitGrid(g, { ...base, color: C.ink3, state: 'dim', label: `Fate of ${fmt(L.N)} thymocytes, one dot per ${L.N / 100}` }),
      N: unitGrid(g, { ...base, color: '#A9B1CC', state: 'hidden' }),
      D: unitGrid(g, { ...base, color: P.inhibit, state: 'hidden' }),
      G: unitGrid(g, { ...base, color: P.activate, state: 'hidden' }),
    };
    // Each layer only ever shows one look (slot: dim body · N: ring · D: body · G: ring + ✓), so
    // prune the stacked parts it never uses: ≈ 2,400 → ≈ 1,100 nodes. The 'hatch' part goes
    // everywhere (never used; its pattern ids also came from a page-wide counter, which made the
    // stage depend on mount order). Tweens on pruned parts are harmless no-ops.
    const KEEP = { slot: ['body'], N: ['ring'], D: ['body'], G: ['ring', 'check'] };
    for (const [k, grid] of Object.entries(grids)) {
      for (const u of grid.units) for (const part of ['body', 'ring', 'hatch', 'check']) if (!KEEP[k].includes(part)) u.parts[part].remove();
    }
    // white ✕ overlays for deleted units (the shared outcome glyph for "fails")
    const xs = S('g', { transform: `translate(${gr.x} ${gr.y})`, 'aria-hidden': 'true' }, g);
    const k = gr.size * 0.2;
    const xMarks = grids.slot.units.map((u) => {
      const p = S('path', { d: `M${f2(u.x - k)} ${f2(u.y - k)}L${f2(u.x + k)} ${f2(u.y + k)}M${f2(u.x + k)} ${f2(u.y - k)}L${f2(u.x - k)} ${f2(u.y + k)}`, stroke: '#0B1024', strokeWidth: Math.max(1.4, gr.size * 0.15), strokeLinecap: 'round', fill: 'none' }, xs);
      gsap.set(p, { opacity: 0 });
      return p;
    });
    // counters: icon + running count + label (never color alone)
    const cs = T.counters;
    const mk = (i, kind, label) => {
      const x = cs.xs[i];
      const cg = S('g', null, g);
      const iy = cs.y - 6;
      if (kind === 'ring') S('circle', { cx: x + 8, cy: iy, r: 6.5, fill: 'none', stroke: '#A9B1CC', strokeWidth: 2 }, cg);
      else ctx.badgeSVG(kind, { x: x + 8, y: iy, r: 8.5 }, cg);
      const num = S('text', { class: 'th-num', x: x + 22, y: cs.y + 1, text: '0' }, cg);
      if (cs.stacked) S('text', { class: 't-small', x, y: cs.y + 22, text: label }, cg);
      else S('text', { class: 't-small', x: x + 22, y: cs.y + 20, text: label }, cg);
      return num;
    };
    const counters = { N: mk(0, 'ring', 'Died of neglect'), D: mk(1, 'no', 'Deleted'), G: mk(2, 'yes', 'Left the thymus') };
    const msg = S('text', { class: 't-small', x: T.msg[0], y: T.msg[1], text: '' }, g);
    el.strip = { g, grids, xMarks, counters, msg, slots: new Array(100).fill(null) };
  }

  // ------------------------------------------------------------------ steps
  const show = (tl, n, pos, d = 0.5) => tl.to(n, { opacity: 1, duration: d, ease: 'power1.out' }, pos);
  const hide = (tl, n, pos, d = 0.4) => tl.to(n, { opacity: 0, duration: d, ease: 'power1.in' }, pos);

  /** Receptor assembly: the key glyph flickers through random shapes and settles. */
  function buildReceptor(tl, T, pos, dur = 1.5) {
    const K = T.keySlots[0].glyphs.length;
    const step = dur / K;
    T.keySlots.forEach((s) => {
      tl.fromTo(s.inner, { scale: 0.2, svgOrigin: '0 0' }, { scale: 1, svgOrigin: '0 0', duration: step * 1.4, ease: 'so.out' }, pos);
    });
    for (let j = 0; j < K; j++) {
      const list = T.keySlots.map((s) => s.glyphs[j]);
      tl.to(list, { opacity: 1, duration: step * 0.45, ease: 'none' }, pos + j * step);
      if (j < K - 1) tl.to(list, { opacity: 0, duration: step * 0.45, ease: 'none' }, pos + (j + 1) * step);
    }
    return pos + dur;
  }
  const keysOf = (T) => T.keySlots.map((s) => s.inner);

  function dockPoint(cell, gap) {
    return [cell.dockAbs.x, cell.dockAbs.y - dockReach(gap)];
  }

  function buildSteps() {
    const E = el;
    const [A, B, Cc] = E.tecs;
    const [M1, , M3] = E.meds;
    const wide = L.name === 'wide';
    const deathDur = 2.0;          // spec: the cell dims over ~2 s
    const clearDur = 2.2;          // the macrophage starts tidying as the last fragments form

    // chips (one per reading)
    const chips = {
      A: dialChip(E.dialC, 'ring', 'No signal → death by neglect'),
      B: dialChip(E.dialC, 'yes', 'Fits MHC class I → CD8 killer'),
      C: dialChip(E.dialC, 'no', 'Too self-reactive → deleted'),
      M1: dialChip(E.dialM, 'no', 'Too self-reactive → deleted'),
      M3: dialChip(E.dialM, 'yes', 'Never binds strongly → to blood'),
    };
    // floating chip for T4 (passed exam 1 off-stage)
    const t4chip = S('g', null, E.fxAbove);
    {
      const text = 'Fits MHC class II → CD4 helper';
      const fs = wide ? 13 : 14.6;
      const wP = text.length * fs * 0.54 + 48;
      const [x0, y0] = L.t4From;
      const cx = wide ? x0 : 200, cy = wide ? y0 + 36 : y0 - 30;
      const gg = S('g', { transform: `translate(${f2(clamp(cx - wP / 2, 8, L.W - wP - 8))} ${f2(cy - 13)})` }, t4chip);
      S('rect', { class: 'th-chip-bg', x: 0, y: 0, width: f2(wP), height: 26, rx: 13, stroke: P.cd4, strokeOpacity: 0.8 }, gg);
      ctx.badgeSVG('yes', { x: 15, y: 13, r: 8 }, gg);
      S('text', { class: 'th-chip-t', x: 32, y: 17.5, text }, gg);
      gsap.set(t4chip, { opacity: 0 });
    }

    const pA = dockPoint(A, 7);          // no binding: the receptor never seats
    const pB = dockPoint(B, 0.5);
    const pC = dockPoint(Cc, -0.5);
    const pM1 = dockPoint(M1, -0.5);
    const pM3 = dockPoint(M3, 0.5);
    const park = L.park;
    const stg = L.staging;
    const contactY = (cell) => cell.dockAbs.y - L.cup * 0.9;

    const recLayer = () => S('g', null, E.fxAbove);
    const recB = recLayer(), recC = recLayer(), recM1 = recLayer(), recM3 = recLayer();

    return [
      // 1 · a thymocyte arrives and builds its random receptor
      {
        enter(tl) {
          move(tl, E.T1, { x: stg[0], y: stg[1], opacity: 1, duration: 1.7, pos: 0 });
          show(tl, E.thyLab, 1.1);
          buildReceptor(tl, E.T1, 1.8, 1.6);
        },
      },
      // 2 · exam one: no grip → death by neglect, macrophage tidies up
      {
        enter(tl) {
          hide(tl, E.thyLab, 0);
          move(tl, E.T1, { x: pA[0], y: pA[1], via: [[lerp(stg[0], pA[0], 0.5), Math.min(stg[1], pA[1]) - 6]], duration: 1.6, pos: 0 });
          if (wide) show(tl, E.tecLab, 0.9);
          const r = reading(tl, E.dialC, { x: pA[0], dockY: pA[1], value: 0.11, chip: chips.A, pos: 1.5 });
          // no signal: the cell dims, then its own program takes it apart
          tl.to(keysOf(E.T1), { opacity: 0, duration: 0.8 }, r.verdict + 0.4);
          die(tl, E.T1, { duration: deathDur, pos: r.verdict + 0.3 });
          tl.to(r.leader, { opacity: 0, duration: 0.4 }, r.verdict + 1.4);
          clearUp(tl, E.macC, E.T1, { duration: clearDur, pos: r.verdict + deathDur - 0.3 });
        },
      },
      // 3 · weak grip on MHC class I: the sweet spot → CD8
      {
        enter(tl) {
          hideDial(tl, E.dialC, chips.A, null, 0);
          if (wide) hide(tl, E.tecLab, 0);
          move(tl, E.macC, { x: E.macHome.c[0], y: E.macHome.c[1], duration: 2, pos: 0.2 });
          move(tl, E.T2, { x: stg[0], y: stg[1], opacity: 1, duration: 1.4, pos: 0 });
          const t = buildReceptor(tl, E.T2, 1.3, 0.9);
          move(tl, E.T2, { x: pB[0], y: pB[1], via: [[lerp(stg[0], pB[0], 0.5), Math.min(stg[1], pB[1]) - 18]], duration: 1.5, pos: t });
          const r = reading(tl, E.dialC, { x: pB[0], dockY: pB[1], value: 0.5, chip: chips.B, pos: t + 1.45 });
          recognize(tl, E.T2, { x: pB[0], y: contactY(B), angle: 90 }, { color: THY, radius: L.rT * 0.62, badge: true, hold: true, layer: recB, pos: r.read - 0.3 });
          // commits to CD8: recolor the cell and its receptors
          swap(tl, E.T2, E.T2cd8, { duration: 1, pos: r.verdict });
          E.T2.keySlots.forEach((s) => {
            tl.to(s.glyphs[s.glyphs.length - 1], { opacity: 0, duration: 1 }, r.verdict);
            tl.to(s.col, { opacity: 1, duration: 1 }, r.verdict);
          });
          E.step3 = r;
        },
      },
      // 4 · strong grip on a common self-peptide → deleted (in the cortex)
      {
        enter(tl) {
          hideDial(tl, E.dialC, chips.B, E.step3.leader, 0);
          hide(tl, recB, 0);
          move(tl, E.T2, { x: park[0], y: park[1], duration: 2.2, pos: 0.2 });
          move(tl, E.T3, { x: stg[0], y: stg[1], opacity: 1, duration: 1.3, pos: 0.1 });
          const t = buildReceptor(tl, E.T3, 1.3, 0.9);
          move(tl, E.T3, { x: pC[0], y: pC[1], via: [[lerp(stg[0], pC[0], 0.45), Math.min(stg[1], pC[1]) - 30]], duration: 1.5, pos: t });
          const r = reading(tl, E.dialC, { x: pC[0], dockY: pC[1], value: 0.88, chip: chips.C, pos: t + 1.45 });
          recognize(tl, E.T3, { x: pC[0], y: contactY(Cc), angle: 90 }, { color: THY, radius: L.rT * 0.7, badge: false, layer: recC, pos: r.read - 0.3 });
          // a strong signal: the cell contracts, ✕, fragments
          tl.set(E.xT3, { attr: { transform: `translate(${f2(pC[0] + L.rT * 0.95)} ${f2(pC[1] - L.rT * 0.85)})` } }, 0);
          tl.fromTo(E.xT3, { opacity: 0 }, { opacity: 1, duration: 0.5 }, r.verdict);
          tl.to(keysOf(E.T3), { opacity: 0, duration: 0.6 }, r.verdict + 0.4);
          die(tl, E.T3, { duration: deathDur, pos: r.verdict + 0.2 });
          tl.to(r.leader, { opacity: 0, duration: 0.4 }, r.verdict + 1.2);
          clearUp(tl, E.macC, E.T3, { duration: clearDur, pos: r.verdict + deathDur - 0.4 });
          tl.to(E.xT3, { opacity: 0, duration: 0.8 }, r.verdict + deathDur + 0.6);
        },
      },
      // 5 · the medulla: AIRE puts organ proteins on show; a CD4 cell grips insulin → deleted
      {
        enter(tl) {
          hideDial(tl, E.dialC, chips.C, null, 0);
          hide(tl, recC, 0);
          tl.to(E.mrowIn, { opacity: 1, duration: 1.1 }, 0.1);
          tl.to(E.exitIn, { opacity: 1, duration: 1.1 }, 0.1);
          move(tl, E.macM, { opacity: 1, duration: 1.1, pos: 0.1 });
          move(tl, E.macC, { x: E.macHome.c[0], y: E.macHome.c[1], duration: 2, pos: 0.2 });
          show(tl, E.mheadIn, 0.6, 0.6);
          E.meds.forEach((m, i) => tl.to(m.glow, { opacity: 1, duration: 0.9 }, 0.8 + i * 0.12));
          show(tl, E.aireLab, 1.3);
          E.slots.forEach((s, i) => tl.fromTo(s.inner, { opacity: 0, scale: 0.6, svgOrigin: '0 0' }, { opacity: 1, scale: 1, svgOrigin: '0 0', duration: 0.6, ease: 'so.out' }, 1.5 + i * 0.1));
          show(tl, E.insulinLab, 2.3);
          show(tl, E.dcLabel, 2.0);
          // the CD4 thymocyte (passed exam 1 on MHC class II) walks in
          move(tl, E.T4, { x: L.t4From[0], y: L.t4From[1], opacity: 1, duration: 0.7, pos: 1.4 });
          show(tl, t4chip, 1.6);
          hide(tl, t4chip, 2.9);
          move(tl, E.T4, { x: pM1[0], y: pM1[1], via: L.t4Via, duration: 1.9, pos: 2.7 });
          const r = reading(tl, E.dialM, { x: pM1[0], dockY: pM1[1], value: 0.9, chip: chips.M1, pos: 4.5 });
          recognize(tl, E.T4, { x: pM1[0], y: contactY(M1), angle: 90 }, { radius: L.rT * 0.7, badge: false, layer: recM1, pos: r.read - 0.3 });
          tl.set(E.xT4, { attr: { transform: `translate(${f2(pM1[0] + L.rT * 0.95)} ${f2(pM1[1] - L.rT * 0.85)})` } }, 0);
          tl.fromTo(E.xT4, { opacity: 0 }, { opacity: 1, duration: 0.5 }, r.verdict);
          tl.to(keysOf(E.T4), { opacity: 0, duration: 0.6 }, r.verdict + 0.4);
          die(tl, E.T4, { duration: deathDur, pos: r.verdict + 0.2 });
          tl.to(r.leader, { opacity: 0, duration: 0.4 }, r.verdict + 1.2);
          clearUp(tl, E.macM, E.T4, { duration: clearDur, pos: r.verdict + deathDur - 0.4 });
          tl.to(E.xT4, { opacity: 0, duration: 0.8 }, r.verdict + deathDur + 0.6);
        },
      },
      // 6 · the CD8 cell graduates; the scene makes room for the tally
      {
        enter(tl) {
          hideDial(tl, E.dialM, chips.M1, null, 0);
          hide(tl, recM1, 0);
          hide(tl, E.insulinLab, 0);
          move(tl, E.T2, { x: pM3[0], y: pM3[1], via: L.t2Via, duration: 2.2, pos: 0.1 });
          const r = reading(tl, E.dialM, { x: pM3[0], dockY: pM3[1], value: 0.4, chip: chips.M3, pos: 2.0 });
          recognize(tl, E.T2, { x: pM3[0], y: contactY(M3), angle: 90 }, { color: P.cd8, radius: L.rT * 0.62, badge: true, hold: false, layer: recM3, pos: r.read - 0.3 });
          const out = r.verdict + 1.0;
          hideDial(tl, E.dialM, chips.M3, r.leader, out);
          const ex = L.exit;
          const exitAbs = ex.dir === 'h'
            ? [[ex.x0 - 10, ex.y + zoneShift('exit')], [L.W + 30, ex.y + zoneShift('exit')]]
            : [[ex.x + 8, ex.y0 + zoneShift('exit')], [ex.x, L.H + 30]];
          move(tl, E.T2, { x: exitAbs[1][0], y: exitAbs[1][1], via: [exitAbs[0]], opacity: 0, duration: 2.2, ease: 'so.in', pos: out });
          // relayout: scene groups slide to their run positions; tally appears
          const t6 = out + 1.8;
          for (const [z, g] of Object.entries(E.zones)) {
            const zz = z === 'crowdC' ? 'crow' : z === 'crowdM' || z === 'mtop' ? 'mrow' : z;
            if (!zoneShift(zz)) continue;
            tl.to(g, { attr: { transform: 'translate(0 0)' }, duration: 1.1, ease: 'so.inOut' }, t6);
          }
          move(tl, E.macC, { x: L.mac.c[0], y: L.mac.c[1], duration: 1.1, stretch: 0, pos: t6 });
          move(tl, E.macM, { x: L.mac.m[0], y: L.mac.m[1], duration: 1.1, stretch: 0, pos: t6 });
          show(tl, E.strip.g, t6 + 0.7, 0.8);
        },
      },
    ];
  }

  // ------------------------------------------------------------------ run (step 6)
  const fx = createEffects();
  let run = null;
  let aireOn = true;
  let runCount = 0;

  /** Run geometry (run coordinates = scene coordinates). */
  function geo() {
    return {
      tecs: L.tecs.map((p) => ({ x: p[0], y: p[1], body: L.tec.body })),
      meds: [...L.meds.map((p) => ({ x: p[0], y: p[1], body: L.med.body })), { x: L.dc.x, y: L.dc.y, body: L.dc.r * 0.35 }],
    };
  }

  function newRun() {
    const N = L.N;
    const G = Math.round(0.03 * N), D = Math.round(0.18 * N), Dc = Math.round(0.75 * D), Dm = D - Dc;
    const O = Math.round(0.02 * N), OdelOn = Math.round(0.9 * O), OdelOff = Math.round(0.3 * O);
    const DmU = Dm - OdelOn, Gn = G - (O - OdelOn), Nn = N - Dc - DmU - O - Gn;
    runCount++;
    const R = rng(1234 + N + runCount * 17);
    const deck = [];
    const push = (code, n) => { for (let i = 0; i < n; i++) deck.push(code); };
    push('N', Nn); push('DC', Dc); push('DM', DmU); push('O', O); push('G', Gn);
    for (let i = deck.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [deck[i], deck[j]] = [deck[j], deck[i]]; }
    // organ-reactive ranks (stratified tolerance draws) and targets
    const ranks = Array.from({ length: O }, (_, i) => i);
    for (let i = ranks.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [ranks[i], ranks[j]] = [ranks[j], ranks[i]]; }
    let oi = 0;
    const plan = deck.map((code, i) => {
      const p = { code, i, lineage: R() < 0.62 ? 'cd4' : 'cd8', t0: (i / N) * L.release + R.range(0, 0.6) * (L.release / N) };
      if (code === 'O') { p.rank = ranks[oi]; p.organ = ORGAN_TARGETS[oi % 3]; oi++; }
      return p;
    });
    return {
      N, O, OdelOn, OdelOff, plan, next: 0, time: 0, agents: [], marks: [], done: false,
      counts: { N: 0, D: 0, G: 0 }, resolved: 0, units: { N: 0, D: 0, G: 0 }, esc: 0, escOff: 0, escOrgans: new Set(),
      fg: 0, R: rng(77 + N), aireEver: !aireOn,
    };
  }

  function targetAround(cell, R, inMin, inMax) {
    const a = R.range(0, TAU), rr = cell.body + R.range(inMin, inMax);
    return [cell.x + Math.cos(a) * rr, cell.y + Math.sin(a) * rr];
  }

  function spawnAgent(p) {
    const R = run.R;
    const [sx, sy] = L.run.spawn;
    const sp = L.run.spread;
    const g = geo();
    const tec = g.tecs[Math.floor(R() * 3)];
    let tgt = targetAround(tec, R, 10, L.tec.r - L.tec.body - 4);
    for (let k = 0; k < 6 && !L.run.cortex(tgt[0], tgt[1]); k++) tgt = targetAround(tec, R, 10, L.tec.r - L.tec.body - 4);
    const fg = (p.i % 11 === 0) && run.fg < 13;
    if (fg) run.fg++;
    const a = {
      p, x: sx + (L.name === 'wide' ? 0 : R.range(-sp, sp)), y: sy + (L.name === 'wide' ? R.range(-sp, sp) : 0),
      tx: tgt[0], ty: tgt[1], phase: 'in', t: 0, timer: 0, fg, state: 'thy', mix: 0, alpha: 1, dim: 0,
      speed: L.speed * R.range(0.85, 1.15), wob: R.range(0, TAU), visits: 0, r: L.rRun, variant: p.i % 3,
    };
    run.agents.push(a);
  }

  function count(kind) {
    run.counts[kind]++;
    run.resolved++;
    el.strip.counters[kind].textContent = fmt(run.counts[kind]);
    const per = run.N / 100;
    const need = Math.floor(run.resolved / per + 1e-9);
    let changed = false;
    while (run.units.N + run.units.D + run.units.G < need) {
      let best = 'N', bd = -Infinity;
      for (const k of ['G', 'D', 'N']) {
        const def = run.counts[k] / per - run.units[k];
        if (def > bd + 1e-9) { bd = def; best = k; }
      }
      run.units[best]++;
      changed = true;
    }
    if (changed) paintGrid(ctx.reducedMotion ? 0 : 0.35);
  }

  function finalizeUnits() {
    const per = run.N / 100;
    const exact = ['G', 'D', 'N'].map((k) => ({ k, v: run.counts[k] / per }));
    const fl = exact.map((e) => ({ ...e, n: Math.floor(e.v), rem: e.v - Math.floor(e.v) }));
    let left = 100 - fl.reduce((s, e) => s + e.n, 0);
    fl.slice().sort((a, b) => b.rem - a.rem).forEach((e) => { if (left > 0) { e.n++; left--; } });
    for (const e of fl) run.units[e.k] = e.n;
    paintGrid(ctx.reducedMotion ? 0 : 0.35);
  }

  /** Slots in reading order: graduated ✓ first, then deleted ✕, then neglect ○, then empty. */
  function paintGrid(duration) {
    const st = el.strip;
    const u = run ? run.units : { N: 0, D: 0, G: 0 };
    const want = (i) => (i < u.G ? 'G' : i < u.G + u.D ? 'D' : i < u.G + u.D + u.N ? 'N' : null);
    const anim = { duration };
    st.grids.G.setStates((_, i) => (want(i) === 'G' ? 'check' : 'hidden'), anim);
    st.grids.D.setStates((_, i) => (want(i) === 'D' ? 'filled' : 'hidden'), anim);
    st.grids.N.setStates((_, i) => (want(i) === 'N' ? 'outline' : 'hidden'), anim);
    st.grids.slot.setStates((_, i) => (want(i) ? 'hidden' : 'dim'), anim);
    st.xMarks.forEach((m, i) => {
      const on = want(i) === 'D';
      if ((st.slots[i] === 'D') !== on) gsap.to(m, { opacity: on ? 1 : 0, duration, overwrite: true });
      st.slots[i] = want(i);
    });
  }

  function resetTally() {
    if (!el.strip) return;
    for (const k of ['N', 'D', 'G']) el.strip.counters[k].textContent = '0';
    el.strip.msg.textContent = '';
    const saved = run;
    run = { units: { N: 0, D: 0, G: 0 } };
    paintGrid(0);
    run = saved;
    el.body.count.textContent = '0';
    for (const n of ORGAN_TARGETS) gsap.set(el.body.rings[n], { opacity: 0 });
  }

  function resolveExam1(a) {
    const code = a.p.code;
    if (code === 'N') {
      a.phase = 'fade'; a.t = 0;
      count('N');
    } else if (code === 'DC') {
      deleteAgent(a);
    } else {
      a.phase = 'recolor'; a.t = 0;
      a.state = a.p.lineage;
      if (!a.fg && run.fg < 20) { a.fg = true; run.fg++; }
    }
  }

  function deleteAgent(a, organ) {
    a.phase = 'del'; a.t = 0;
    run.marks.push({ x: a.x, y: a.y - (a.fg ? 2 : 0), t: 0, life: 1.1, fg: a.fg, organ });
    count('D');
  }

  function toMedulla(a) {
    const R = run.R;
    const g = geo();
    const m = g.meds[Math.floor(R() * g.meds.length)];
    const [tx, ty] = targetAround(m, R, 10, 18);
    a.tx = tx; a.ty = ty; a.phase = 'toMed'; a.t = 0;
  }

  function resolveExam2(a) {
    const code = a.p.code;
    if (code === 'DM') { deleteAgent(a); return; }
    if (code === 'O') {
      const nDel = aireOn ? run.OdelOn : run.OdelOff;
      if (a.p.rank < nDel) { deleteAgent(a, a.p.organ); return; }
      a.organ = a.p.organ;
    }
    a.phase = 'exit'; a.t = 0;
    const [ex, ey] = L.run.exitTo;
    a.tx = ex + (L.name === 'wide' ? 0 : run.R.range(-6, 6));
    a.ty = ey + (L.name === 'wide' ? run.R.range(-8, 8) : 0);
  }

  function steer(a, dt, slow = 1) {
    const dx = a.tx - a.x, dy = a.ty - a.y;
    const d = Math.hypot(dx, dy);
    if (d < 1.5) return true;
    const v = Math.min(d, a.speed * slow * dt);
    a.wob += dt * 2.3;
    const wob = Math.sin(a.wob) * 0.35 * v;
    a.x += (dx / d) * v - (dy / d) * wob;
    a.y += (dy / d) * v + (dx / d) * wob;
    return false;
  }

  function stepRun(dt) {
    if (!run || run.done) return;
    run.time += dt;
    while (run.next < run.plan.length && run.plan[run.next].t0 <= run.time) spawnAgent(run.plan[run.next++]);
    const R = run.R;
    for (const a of run.agents) {
      if (a.dead) continue;
      a.t += dt;
      switch (a.phase) {
        case 'in':
          if (steer(a, dt)) { a.phase = 'probe'; a.t = 0; a.timer = R.range(0.5, 1.1); }
          break;
        case 'probe':
          a.x += Math.sin(a.t * 5 + a.wob) * 0.08; a.y += Math.cos(a.t * 4 + a.wob) * 0.08;
          if (a.t >= a.timer) resolveExam1(a);
          break;
        case 'fade':
          a.dim = clamp(a.t / 0.7, 0, 1);
          if (a.t >= 0.7 && !a.dying) killSpecks(fx, a, { color: '#8E97B0', n: a.fg ? 5 : 4, life: 0.6, seed: a.p.i });
          break;
        case 'del':
          if (a.t >= 0.3 && !a.dying) killSpecks(fx, a, { color: a.fg ? ART.mix(P[a.state] || THY, '#FFFFFF', 0.2) : '#C9A0A8', n: a.fg ? 5 : 4, life: 0.6, seed: a.p.i });
          break;
        case 'recolor':
          a.mix = clamp(a.t / 0.5, 0, 1);
          if (a.t >= 0.5) toMedulla(a);
          break;
        case 'toMed':
          if (steer(a, dt)) { a.phase = 'probeM'; a.t = 0; a.timer = R.range(0.7, 1.2); a.visits++; }
          break;
        case 'probeM':
          if (a.t >= a.timer) {
            if (a.visits < 2 && R() < 0.5) toMedulla(a);
            else resolveExam2(a);
          }
          break;
        case 'exit':
          steer(a, dt, 1.1);
          if (L.run.exitAt(a, L.W)) {
            a.dead = true; a.gone = true;
            if (a.fg) run.fg--;
            count('G');
            if (a.organ) {
              run.esc++;
              if (!aireOn) {
                run.escOff++;
                el.body.count.textContent = String(run.escOff);
                if (!run.escOrgans.has(a.organ)) {
                  run.escOrgans.add(a.organ);
                  gsap.to(el.body.rings[a.organ], { opacity: 1, duration: ctx.reducedMotion ? 0 : 0.6 });
                }
              }
            }
          }
          break;
        default: break;
      }
      if (a.dead && a.fg && !a.gone && !a.released) { a.released = true; run.fg--; }
    }
    // dying agents finished by killSpecks
    for (const a of run.agents) if (a.dead && a.fg && !a.released && !a.gone) { a.released = true; run.fg--; }
    fx.step(dt);
    for (const m of run.marks) m.t += dt;
    run.marks = run.marks.filter((m) => m.t < m.life);
    if (run.agents.length > 300) run.agents = run.agents.filter((a) => !a.dead || a.dying < 1);
    if (run.next >= run.plan.length && run.agents.every((a) => a.dead) && fx.count === 0 && run.marks.length === 0) finishRun();
  }

  function finishRun() {
    run.done = true;
    finalizeUnits();
    const g = run.counts.G;
    if (run.aireEver) {
      el.strip.msg.textContent = `With AIRE off, ${run.escOff} organ-reactive cell${run.escOff === 1 ? '' : 's'} escaped.`;
    } else {
      el.strip.msg.textContent = 'About 3 in 100 survive — close to the mouse estimate.';
    }
    runBtn.label = 'Replay';
    playBtn.set(false);
    playBtn.el.hidden = true;
    loop.pause();
    drawRun();
    ctx.announce(`Run complete. ${fmt(run.counts.N)} died of neglect, ${fmt(run.counts.D)} were deleted, ${fmt(g)} left the thymus. ${el.strip.msg.textContent}`);
  }

  function drawRun() {
    cv.clear();
    if (!run || !run.agents) return;
    const k = cv.width / L.W;
    const g = cv.g;
    g.save();
    g.scale(k, k);                       // draw in layout units
    const ds = L.name === 'wide' ? 12 : 11;
    // background stream: dots
    for (const a of run.agents) {
      if (a.fg) continue;
      if (a.dead && !(a.dying > 0 && a.dying < 1)) continue;
      const shrink = a.dying ? 1 - a.dying * 0.9 : 1;
      const al = 0.9 * (1 - a.dim * 0.55) * (a.dying ? 1 - a.dying : 1);
      const s = ds * shrink;
      if (s <= 0.2 || al <= 0.02) continue;
      if (a.mix < 1) { g.globalAlpha = al * (1 - a.mix); g.drawImage(dotSprites.thy, a.x - s / 2, a.y - s / 2, s, s); }
      if (a.mix > 0) { g.globalAlpha = al * a.mix; g.drawImage(dotSprites[a.state], a.x - s / 2, a.y - s / 2, s, s); }
    }
    g.globalAlpha = 1;
    // foreground cells (≤ 20 at a time)
    const sc = L.rRun / 10;
    for (const a of run.agents) {
      if (!a.fg) continue;
      if (a.dead && !(a.dying > 0 && a.dying < 1)) continue;
      const proxy = { x: a.x, y: a.y, variant: a.variant, dying: a.dying, alpha: 1 - a.dim * 0.55, scale: sc };
      if (a.mix < 1) sheet.draw(g, proxy, { state: 'thy', alpha: 1 - a.mix });
      if (a.mix > 0) sheet.draw(g, proxy, { state: a.state, alpha: a.mix });
    }
    // organ-reactive escapees carry their hidden target, revealed on the way out
    for (const a of run.agents) {
      if (!a.organ || a.dead) continue;
      const off = a.fg ? L.rRun * 1.05 : 6;
      drawOrgan(g, a.organ, a.x + off, a.y - off);
    }
    fx.draw(g);
    // deletions: ✕ (+ the organ that gave the cell away)
    for (const m of run.marks) {
      const p = m.t / m.life;
      const al = p < 0.15 ? p / 0.15 : p > 0.7 ? 1 - (p - 0.7) / 0.3 : 1;
      const r = m.fg ? 7.5 : 5.2;
      const x = m.x + (m.fg ? r * 0.9 : 0), y = m.y - (m.fg ? r * 0.9 : 0);
      g.globalAlpha = al;
      g.fillStyle = NO;
      g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
      g.strokeStyle = '#0B1024'; g.lineWidth = Math.max(1.2, r * 0.3); g.lineCap = 'round';
      const q = r * 0.42;
      g.beginPath(); g.moveTo(x - q, y - q); g.lineTo(x + q, y + q); g.moveTo(x + q, y - q); g.lineTo(x - q, y + q); g.stroke();
      if (m.organ) drawOrgan(g, m.organ, x + r + 10, y);
    }
    g.globalAlpha = 1;
    g.restore();
  }

  function drawOrgan(g, name, x, y) {
    const img = organSprites[name];
    if (!img) return;
    g.fillStyle = 'rgba(11,16,36,0.85)';
    g.beginPath(); g.arc(x, y, 8.5, 0, TAU); g.fill();
    g.strokeStyle = ctx.alpha(P.inhibit, 0.9); g.lineWidth = 1.2;
    g.stroke();
    ART.drawSprite(g, img, x, y, { scale: 11 / 15 });
  }

  const step = fixedStep(stepRun, { dt: 1 / 60, max: 6 });
  const loop = ctx.loop((dt) => { step(dt); drawRun(); }, { autoplay: false });

  function startRun() {
    fx.clear();
    run = newRun();
    resetTally();
    runBtn.label = 'Replay';
    if (ctx.reducedMotion) {
      // jump straight to the end state: same deck, statistically resolved
      for (const p of run.plan) {
        let kind = 'N';
        if (p.code === 'DC' || p.code === 'DM') kind = 'D';
        else if (p.code === 'G') kind = 'G';
        else if (p.code === 'O') {
          const del = p.rank < (aireOn ? run.OdelOn : run.OdelOff);
          kind = del ? 'D' : 'G';
          if (!del && !aireOn) { run.escOff++; run.escOrgans.add(p.organ); }
        }
        run.counts[kind]++;
      }
      run.resolved = run.N;
      for (const kk of ['N', 'D', 'G']) el.strip.counters[kk].textContent = fmt(run.counts[kk]);
      el.body.count.textContent = String(run.escOff);
      for (const n of run.escOrgans) gsap.set(el.body.rings[n], { opacity: 1 });
      run.next = run.plan.length;
      finishRun();
      return;
    }
    playBtn.set(true);
    playBtn.el.hidden = false;
    loop.play();
    ctx.announce(`Running ${fmt(run.N)} candidates${aireOn ? '' : ' with AIRE off'}.`);
  }

  function stopRun(silent) {
    loop?.pause?.();
    run = null;
    fx.clear();
    if (cv) cv.clear();
    if (!silent && el.strip) resetTally();
  }

  function setAire(on, { instant = false } = {}) {
    aireOn = on;
    if (run && !on) run.aireEver = true;
    const d = instant || ctx.reducedMotion ? 0 : 0.7;
    const E = el;
    if (!E.meds) return;
    for (const m of E.meds) gsap.to(m.glowSwitch, { opacity: on ? 1 : 0, duration: d });
    for (const s of E.slots) gsap.to(s.sw, { opacity: on ? 1 : s.keep ? 0.45 : 0, duration: d });
    gsap.to(E.aireOn, { opacity: on ? 1 : 0, duration: d });
    gsap.to(E.aireOff, { opacity: on ? 0 : 1, duration: d });
    gsap.to([E.body.g, E.body.lab], { opacity: on ? 0 : 1, duration: d });
    syncAireUI();
  }

  // ------------------------------------------------------------------ controls
  // Run controls are created first (detached) because the stepper may call onChange
  // synchronously (reduced motion); they are appended after the stepper.
  const runRow = ctx.ui.group({ className: 'th-run', parent: null });
  runRow.hidden = true;
  const runBtn = ctx.ui.button({ label: 'Run the thymus', icon: 'play', variant: 'primary', parent: runRow, onClick: () => startRun() });
  const playBtn = ctx.ui.playPause({
    playing: false, parent: runRow, labels: { play: 'Resume', pause: 'Pause' },
    onChange: (on) => {
      if (on) {
        if (!run || run.done) startRun();
        else { loop.play(); ctx.announce('Resumed'); }
      } else { loop.pause(); ctx.announce('Paused'); }
    },
  });
  loop.onChange?.((v) => { if (!v && run && !run.done) playBtn.set(false); });
  playBtn.el.hidden = true;
  const aireSw = ctx.ui.toggle({
    label: 'AIRE on', checked: true, parent: runRow,
    onChange: (on) => { setAire(on); ctx.announce(on ? 'AIRE on: organ proteins are on show in the medulla.' : 'AIRE off: most organ proteins vanish from the medulla.'); },
  });
  const syncAireUI = () => {
    aireSw.set(aireOn);
    const lab = aireSw.el.querySelector('.switch__label');
    if (lab) lab.textContent = aireOn ? 'AIRE on' : 'AIRE off';
  };

  const steps = [];
  const stepper = ctx.ui.stepper({
    reset() { draw(); steps.splice(0, steps.length, ...buildSteps()); },
    steps: new Array(6).fill(0).map((_, i) => ({ enter: (tl, o) => steps[i]?.enter(tl, o) })),
    onChange(i) {
      const now = i === 5;
      stopRun(false);
      if (!aireOn) setAire(true, { instant: true });
      runBtn.label = 'Run the thymus';
      playBtn.set(false);
      playBtn.el.hidden = true;
      runRow.hidden = !now;
    },
  });
  ctx.controls.append(runRow);

  // ------------------------------------------------------------------ layout changes
  let layoutName = L.name;
  ctx.onResize(({ compact }) => {
    const want = compact ? 'compact' : 'wide';
    if (want !== layoutName) {
      layoutName = want;
      L = LAYOUTS[want];
      aireOn = true;
      stepper.rebuild();
      runRow.hidden = stepper.index !== 5;
      runBtn.label = 'Run the thymus';
      playBtn.set(false);
      playBtn.el.hidden = true;
      syncAireUI();
    }
    if (run) drawRun();
  });

  return {
    destroy() { killAmbients(); loop.pause(); },
  };
}
