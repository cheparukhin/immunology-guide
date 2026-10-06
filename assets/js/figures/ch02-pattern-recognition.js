// ch02-pattern-recognition — "Innate sensors and the cytokines they trigger" (Chapter 2, explorer, dark stage).
// A sentinel macrophage in cutaway with eight numbered sensors in three places (outer surface,
// digestion bubble, interior; STING on an ER strip). The reader offers it one suspect at a time
// (tap / keyboard only — FIGURE-AUDIT §5) and watches which sensors fire and which alarm it sends:
// solid coral dots = inflammatory cytokines, hollow coral rings = interferons (§4 rule 12).
//
// Layout: desktop = cell on the left ~62 %, the suspect tray (HTML buttons) over the right of the
// stage; phones = the same cell frame rotated 90° (its outer surface faces down) with the tray as a
// row of buttons under the stage. Numbered badges are drawn upright in an overlay; names live in
// the legend (with a "Show molecular names" toggle). Readout = ctx.ui.infoCard (below the stage).
//
// Each choice builds one GSAP timeline from the idle scene (deterministic, so the same suspect
// always gives the same response). Reduced motion / re-layout jump to its end (tl.progress(1)).
import {
  macrophage, cellInfo, vesicle, tlr, bacterium, virus, healthyCell, cancerCell, PALETTE, mix,
} from '../art/index.js';
import { emit, pulseAlong } from './shared/cell-actions.js';

const ID = 'ch02-pattern-recognition';
const SEED = 73;         // macrophage seed: broad, smooth face toward the tray
const ROT = 58;          // rotation that puts its nucleus lower-left
const SILVER = '#C9D3E8';
const GOLD = '#FFE6A6';
const GOLD_HI = '#FFF4D2';
const NAVY = '#0B1024';
const CORAL = PALETTE.m1;
const DEG = Math.PI / 180;

// ---------------------------------------------------------------- content (verbatim from the spec)

const SENSORS = [
  { n: 1, zone: 'surface', name: 'Bacterial-wall sensor', mol: 'TLR4' },
  { n: 2, zone: 'surface', name: 'Flagellum sensor', mol: 'TLR5' },
  { n: 3, zone: 'surface', name: 'ATP-gated channel', mol: 'P2X7' },
  { n: 4, zone: 'bubble', name: 'Viral-RNA sensor', mol: 'TLR8 (and TLR7)' },
  { n: 5, zone: 'bubble', name: 'Microbial-DNA sensor', mol: 'TLR9' },
  { n: 6, zone: 'interior', name: 'Interior RNA sensor', mol: 'RIG-I (and MDA5)' },
  { n: 7, zone: 'interior', name: 'Misplaced-DNA sensor', mol: 'cGAS, with its partner STING on the ER' },
  { n: 8, zone: 'interior', name: 'Damage sensor', mol: 'NLRP3 inflammasome' },
];
const ZONES = [
  { id: 'surface', label: 'Outer surface' },
  { id: 'bubble', label: 'Endosome' },
  { id: 'interior', label: 'Interior' },
];
const TOKEN_NAMES = {
  lps: 'LPS', flagellin: 'Flagellin', bdna: 'Bacterial DNA', ssrna: 'Viral RNA, single strand',
  dsrna: 'Viral RNA, double strand', atp: 'ATP', selfdna: 'The body’s own DNA', crystal: 'Uric-acid crystal',
};

const SUSPECTS = [
  {
    value: 'bacterium', label: 'Swimming bacterium', alarm: 'yes', tokens: ['lps', 'flagellin', 'bdna'],
    rows: [
      ['Detected', 'LPS from the outer wall, flagellin from the tail, and bacterial DNA once the bacterium is digested.'],
      ['Sensors', '1, 2 and 5: bacterial-wall, flagellum and microbial-DNA sensors.'],
      ['Where', 'On the surface first, then inside an endosome.'],
      ['Response', 'Inflammatory cytokines, which recruit more immune cells.'],
    ],
  },
  {
    value: 'virus', label: 'Virus', alarm: 'yes', tokens: ['ssrna', 'dsrna'],
    rows: [
      ['Detected', 'Viral RNA in forms our own cells rarely make: double strands, or strands with an unusual chemical group at one end.'],
      ['Sensors', '4 and 6: viral-RNA sensor in the endosome; interior RNA sensor.'],
      ['Where', 'Inside the cell. From the outside, a virus offers few patterns for sensors to bind.'],
      ['Response', 'Interferons, which put neighboring cells into an antiviral state; some inflammatory cytokines too.'],
    ],
  },
  {
    value: 'crushed', label: 'Crushed body cell', alarm: 'yes', tokens: ['atp', 'crystal', 'selfdna'],
    rows: [
      ['Detected', 'Molecules that belong inside cells (ATP, DNA, uric acid) spilled outside, where uric acid forms crystals.'],
      ['Sensors', '3, 8 and 7: ATP-gated channel, damage sensor, misplaced-DNA sensor.'],
      ['Where', 'At the surface and inside the sentinel. The damage sensor reacts to the disturbance these spilled molecules cause, not to the molecules themselves.'],
      ['Response', 'Inflammatory cytokines, with no microbe in sight. This is why injuries swell even without infection.'],
    ],
  },
  {
    value: 'healthy', label: 'Healthy body cell', alarm: 'no', tokens: [],
    rows: [
      ['Detected', 'Nothing. Every molecule here is ‘self’, and in its proper place.'],
      ['Response', 'None.'],
    ],
  },
  {
    value: 'cancer', label: 'Cancer cell', alarm: 'no', tokens: [],
    rows: [
      ['Detected', 'No microbial patterns. Cancer cells are built from the body’s own molecules.'],
      ['Response', 'None, so far.'],
    ],
  },
];
const RUPTURE_TEXT = 'Dying cancer cells can spill DNA that trips the misplaced-DNA sensor, producing interferons. In nearby dendritic cells, this is one way the immune system first notices a tumor (Chapter 7).';
const RUPTURE_TOKENS = ['atp', 'selfdna'];
const NOTE_TEXT = 'In human macrophages, TLR8 does most of the RNA sensing inside endosomes, and TLR9 works mainly in other immune cells (plasmacytoid dendritic cells and B cells). This sentinel is drawn with the full set for simplicity.';

// Which sensors each run lights (value = brightness, 1 = full).
const LIT = {
  bacterium: { 1: 1, 2: 1, 5: 1 },
  virus: { 4: 1, 6: 1 },
  crushed: { 3: 1, 8: 1, 7: 0.55 },
  healthy: {},
  cancer: {},
  rupture: { 3: 1, 8: 1, 7: 1 },
};

// ---------------------------------------------------------------- CSS (scoped, injected once)

const CSS = `
[data-figure="${ID}"] .pr-tray { position: absolute; z-index: 5; left: 64.5%; right: 2.4%; top: 12%; bottom: 4.5%; display: flex; }
[data-figure="${ID}"] .pr-tray .chips { flex: 1 1 auto; min-height: 0; gap: 0; }
[data-figure="${ID}"] .pr-tray .chips__tray { flex: 1 1 auto; min-height: 0; flex-direction: column; flex-wrap: nowrap; gap: clamp(4px, 1.6cqw, 9px); }
[data-figure="${ID}"] .pr-tray .chip {
  flex: 1 1 0; min-width: 0; min-height: 0; align-items: center; gap: 0.7rem;
  padding: 0.2rem 0.8rem 0.2rem 0.45rem; border-radius: 12px;
  background: rgb(19 27 54 / 0.62); border: 1px solid rgb(169 177 204 / 0.2);
  color: var(--stage-dark-ink); box-shadow: none; cursor: pointer;
  transition: background-color .2s, border-color .2s, box-shadow .2s;
}
[data-figure="${ID}"] .pr-tray .chip:hover { background: rgb(36 47 88 / 0.7); border-color: rgb(169 177 204 / 0.45); color: var(--stage-dark-ink); }
[data-figure="${ID}"] .pr-tray .chip[aria-pressed="true"] { background: rgb(163 178 255 / 0.16); border-color: #A3B2FF; box-shadow: inset 0 0 0 1px #A3B2FF, 0 0 18px rgb(163 178 255 / 0.22); }
[data-figure="${ID}"] .pr-tray .chip:focus-visible { outline: 2px solid #A3B2FF; outline-offset: 2px; }
[data-figure="${ID}"] .pr-tray .chip__label { font-size: clamp(0.8125rem, 0.62rem + 0.5cqw, 0.9375rem); font-weight: 600; color: var(--stage-dark-ink); line-height: 1.2; }
[data-figure="${ID}"] .pr-thumb { flex: 0 0 auto; height: min(100%, 4.2rem); aspect-ratio: 5 / 4; overflow: visible; }
[data-figure="${ID}"] .pr-tray.is-below { position: static; display: block; }
[data-figure="${ID}"] .pr-tray.is-below .chips__tray { flex-direction: row; flex-wrap: wrap; gap: 0.5rem; }
[data-figure="${ID}"] .pr-tray.is-below .chip {
  flex: 1 1 calc(33.333% - 0.5rem); min-height: 5.6rem; flex-direction: column; justify-content: center; gap: 0.25rem;
  padding: 0.45rem 0.35rem 0.55rem; text-align: center; background: linear-gradient(180deg, #151D3B, #0E1430);
  border-color: rgb(140 160 255 / 0.18);
}
[data-figure="${ID}"] .pr-tray.is-below .chip:nth-child(n+4) { flex-basis: calc(50% - 0.5rem); }
[data-figure="${ID}"] .pr-tray.is-below .chip__text { align-items: center; }
[data-figure="${ID}"] .pr-tray.is-below .chip__label { font-size: 0.8125rem; }
[data-figure="${ID}"] .pr-tray.is-below .pr-thumb { height: 2.9rem; }
[data-figure="${ID}"] .pr-rows { display: grid; grid-template-columns: max-content minmax(0, 1fr); gap: 0.45rem 1rem; margin: 0; }
[data-figure="${ID}"] .pr-rows dt { padding-top: 0.2rem; font-family: var(--font-ui); font-size: var(--text-2xs); font-weight: 650; letter-spacing: var(--tracking-caps); text-transform: uppercase; color: var(--ink-3); }
[data-figure="${ID}"] .pr-rows dd { margin: 0; color: var(--ink); }
[data-figure="${ID}"] .pr-tokens { display: flex; flex-wrap: wrap; gap: 0.3rem 0.9rem; margin: 0.35rem 0 0; padding: 0; list-style: none; font-family: var(--font-ui); font-size: var(--text-2xs); color: var(--ink-3); }
[data-figure="${ID}"] .pr-tokens li { display: inline-flex; align-items: center; gap: 0.4rem; }
[data-figure="${ID}"] .pr-tokens svg { width: 2rem; height: 1.25rem; border-radius: 6px; background: #121A36; flex-shrink: 0; }
[data-figure="${ID}"] .pr-more { margin-top: 0.9em; }
[data-figure="${ID}"] .pr-legend { flex: 1 1 100%; display: grid; gap: 0.7rem; font-family: var(--font-ui); }
[data-figure="${ID}"] .pr-legend__head { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.5rem 1rem; }
[data-figure="${ID}"] .pr-h { margin: 0; font-size: var(--text-2xs); font-weight: 650; letter-spacing: var(--tracking-caps); text-transform: uppercase; color: var(--ink-3); }
[data-figure="${ID}"] .pr-groups { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.6rem 1.4rem; }
[data-figure="${ID}"] .pr-group ol { list-style: none; margin: 0.35rem 0 0; padding: 0; display: grid; gap: 0.3rem; }
[data-figure="${ID}"] .pr-group li { display: flex; align-items: baseline; gap: 0.5rem; font-size: var(--text-xs); line-height: 1.35; color: var(--ink-2); }
[data-figure="${ID}"] .pr-num {
  flex-shrink: 0; display: inline-grid; place-items: center; width: 1.35rem; height: 1.35rem; border-radius: 50%;
  border: 1.5px solid var(--rule-strong); font-size: 0.75rem; font-weight: 700; color: var(--ink-2); font-variant-numeric: tabular-nums;
  transform: translateY(0.12rem); transition: background-color .3s, border-color .3s, color .3s, box-shadow .3s;
}
[data-figure="${ID}"] .pr-group li.is-lit { color: var(--ink); font-weight: 600; }
[data-figure="${ID}"] .pr-group li.is-lit .pr-num { background: ${GOLD}; border-color: #D9A93A; color: ${NAVY}; box-shadow: 0 0 0 3px rgb(242 179 61 / 0.25); }
[data-figure="${ID}"] .pr-mol { display: none; font-weight: 450; color: var(--ink-3); }
[data-figure="${ID}"] .pr-legend.show-mol .pr-mol { display: inline; }
[data-figure="${ID}"] .pr-note { display: none; margin: 0; max-width: 62ch; font-size: var(--text-2xs); line-height: 1.5; color: var(--ink-3); }
[data-figure="${ID}"] .pr-legend.show-mol .pr-note { display: block; }
[data-figure="${ID}"] .pr-legend .legend { margin: 0; }
@container fig (max-width: 759.98px) { [data-figure="${ID}"] .pr-groups { grid-template-columns: minmax(0, 1fr); } }
`;

function injectCSS() {
  if (document.getElementById(`${ID}-style`)) return;
  const s = document.createElement('style');
  s.id = `${ID}-style`;
  s.textContent = CSS;
  document.head.append(s);
}

// ---------------------------------------------------------------- small geometry helpers

const pol = (r, aDeg) => [Math.cos(aDeg * DEG) * r, Math.sin(aDeg * DEG) * r];
const add = (p, q, k = 1) => [p[0] + q[0] * k, p[1] + q[1] * k];
const f = (v) => Math.round(v * 100) / 100;
const lerp = (a, b, t) => a + (b - a) * t;

/** Nearest crossing of a ray from the origin with a closed outline. */
function rayHit(outline, aDeg) {
  const dx = Math.cos(aDeg * DEG), dy = Math.sin(aDeg * DEG);
  let best = Infinity;
  for (let i = 0; i < outline.length; i++) {
    const p = outline[i], q = outline[(i + 1) % outline.length];
    const ex = q[0] - p[0], ey = q[1] - p[1];
    const den = dx * ey - dy * ex;
    if (Math.abs(den) < 1e-9) continue;
    const t = (p[0] * ey - p[1] * ex) / den;
    const s = (p[0] * dy - p[1] * dx) / den;
    if (t > 1 && s >= 0 && s <= 1) best = Math.min(best, t);
  }
  return best === Infinity ? 200 : best;
}

/** Mulberry32: tiny seeded PRNG for scatter layouts. */
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

// ---------------------------------------------------------------- mount

export default function mount(fig, ctx) {
  injectCSS();
  const { gsap, h } = ctx;
  const S = (tag, attrs, parent) => ctx.svg(tag, attrs, parent);
  let uid = 0;
  const nextId = (k) => `${ID}-${k}${++uid}`;

  ctx.setAspect(1000 / 620, 420 / 560);
  ctx.addDust();
  ctx.tag('Not to scale');
  const svg = ctx.createSVG({ viewBox: '0 0 1000 620' });

  // Gradients shared by the drawing (ids are unique per page).
  const goldGlow = ctx.radialGradient(svg, [[0, GOLD_HI, 0.85], [0.45, GOLD, 0.35], [1, GOLD, 0]]);
  const nucGlow = ctx.radialGradient(svg, [[0, '#FFE9DF', 0.55], [0.55, CORAL, 0.3], [1, CORAL, 0]]);
  const veilFill = ctx.radialGradient(svg, [[0, NAVY, 0.66], [0.7, NAVY, 0.6], [1, NAVY, 0.4]]);
  const tokenGlow = {};
  const glowFor = (c) => (tokenGlow[c] ||= ctx.radialGradient(svg, [[0, c, 0.55], [1, c, 0]]));

  // ---------------------------------------------------------------- state
  let compact = ctx.compact;
  let L = null;            // layout: { cx, cy, rot, k, ... }
  let G = null;            // geometry in frame coords
  let N = null;            // persistent scene nodes
  let current = null;      // suspect value
  let ruptured = false;    // cancer: "What if it dies messily?"
  let tl = null;           // the current run
  let fadeTl = null;
  let pausedRun = false;
  let showMol = false;
  let trayInStage = null;

  // ---------------------------------------------------------------- layout
  const layoutFor = (c) => (c
    ? { vb: [420, 560], cx: 212, cy: 234, rot: 90, k: 0.74, badgeR: 12.5 }
    : { vb: [1000, 620], cx: 300, cy: 318, rot: 0, k: 1, badgeR: 11.5 });

  const toStage = ([x, y]) => {
    const c = Math.cos(L.rot * DEG), s = Math.sin(L.rot * DEG);
    return [L.cx + L.k * (x * c - y * s), L.cy + L.k * (x * s + y * c)];
  };
  const toFrame = ([X, Y]) => {
    const x = (X - L.cx) / L.k, y = (Y - L.cy) / L.k;
    const c = Math.cos(-L.rot * DEG), s = Math.sin(-L.rot * DEG);
    return [x * c - y * s, x * s + y * c];
  };

  // ---------------------------------------------------------------- tokens (pattern molecules)
  // Each pattern has its own SHAPE (color is never the only cue).
  const TOKEN_COLOR = {
    lps: mix(PALETTE.bacteria, '#FFFFFF', 0.2), flagellin: mix(PALETTE.bacteria, '#FFFFFF', 0.2),
    bdna: mix(PALETTE.bacteria, '#FFFFFF', 0.2), ssrna: mix(PALETTE.virus, '#FFFFFF', 0.25),
    dsrna: mix(PALETTE.virus, '#FFFFFF', 0.25), atp: PALETTE.selfPeptide, selfdna: PALETTE.selfPeptide,
    crystal: '#EEF5FF',
  };
  function tokenShape(kind, parent, k = 1) {
    const c = TOKEN_COLOR[kind];
    const sw = 1.5 * k;
    const line = (d, extra = {}) => S('path', { d, fill: 'none', stroke: c, strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round', ...extra }, parent);
    const wave = (y0, amp, x0 = -8, x1 = 8) => {
      let d = '';
      for (let i = 0; i <= 16; i++) {
        const t = i / 16, x = lerp(x0, x1, t) * k;
        d += `${i ? 'L' : 'M'}${f(x)} ${f((y0 + Math.sin(t * Math.PI * 3) * amp) * k)}`;
      }
      return d;
    };
    if (kind === 'lps') {                      // comb / fringe
      line(`M${-7 * k} ${-2 * k}H${7 * k}`);
      line([-6, -2, 2, 6].map((x) => `M${x * k} ${-2 * k}V${4.5 * k}`).join(''), { strokeWidth: sw * 0.85 });
    } else if (kind === 'flagellin') {         // short helical spring
      let d = '';
      for (let i = 0; i <= 24; i++) {
        const t = i / 24, a = t * Math.PI * 2 * 3.5;
        d += `${i ? 'L' : 'M'}${f((lerp(-8, 8, t) + Math.cos(a) * 1.6) * k)} ${f(Math.sin(a) * 3.6 * k)}`;
      }
      line(d, { strokeWidth: sw * 0.9 });
    } else if (kind === 'ssrna') {             // single wavy line
      line(wave(0, 3.2));
    } else if (kind === 'dsrna') {             // short double wavy line
      line(wave(-2.4, 2.2, -6.5, 6.5));
      line(wave(2.4, 2.2, -6.5, 6.5));
    } else if (kind === 'bdna' || kind === 'selfdna') {   // ladder (double strand with rungs)
      const top = [], bot = [];
      for (let i = 0; i <= 16; i++) {
        const t = i / 16, x = lerp(-8.5, 8.5, t), y = Math.sin(t * Math.PI * 2) * 3.3;
        top.push([x, y]); bot.push([x, -y]);
      }
      const P = (pts) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${f(x * k)} ${f(y * k)}`).join('');
      let rungs = '';
      for (let i = 1; i < 16; i += 2) rungs += `M${f(top[i][0] * k)} ${f(top[i][1] * k)}L${f(bot[i][0] * k)} ${f(bot[i][1] * k)}`;
      line(rungs, { strokeWidth: sw * 0.6, strokeOpacity: 0.75 });
      line(P(top)); line(P(bot));
    } else if (kind === 'atp') {               // small dot with a short three-bead tail
      S('circle', { cx: -3 * k, r: 3.4 * k, fill: c }, parent);
      [2.2, 5.2, 8.2].forEach((x) => S('circle', { cx: x * k, cy: 0, r: 1.35 * k, fill: c, opacity: 0.9 }, parent));
    } else if (kind === 'crystal') {           // sharp angular needle
      S('path', { d: `M${-9 * k} ${1.2 * k}L${-1 * k} ${-2.3 * k}L${9.5 * k} ${-0.6 * k}L${1.2 * k} ${2.4 * k}Z`, fill: mix(c, NAVY, 0.25), stroke: c, strokeWidth: 1 * k, strokeLinejoin: 'miter' }, parent);
      line(`M${-6 * k} ${0.4 * k}L${6 * k} ${-0.3 * k}`, { strokeWidth: 0.6 * k, strokeOpacity: 0.7 });
    }
  }
  function token(kind, parent, { k = 1, rot = 0 } = {}) {
    if (parent === N?.dyn && compact) k *= 1.3;            // the phone frame is drawn smaller: keep tokens legible
    const g = S('g', { 'data-token': kind }, parent);
    const sc = S('g', { transform: 'scale(1)' }, g);      // tween attr transform to resize about the centre
    S('circle', { r: 12 * k, fill: glowFor(TOKEN_COLOR[kind]), opacity: 0.6 }, sc);
    const inner = S('g', { transform: rot ? `rotate(${rot})` : null }, sc);
    tokenShape(kind, inner, k);
    g._s = sc;
    return g;
  }
  const tokenIcon = (kind) => {
    const s = ctx.svg('svg', { viewBox: '-13 -8 26 16', 'aria-hidden': 'true', focusable: 'false' });
    tokenShape(kind, s, 0.95);
    return s;
  };

  // ---------------------------------------------------------------- glyphs
  function receptorGlyph(parent, { pos, angle, u }) {
    const g = S('g', { transform: `translate(${f(pos[0])} ${f(pos[1])}) rotate(${f(angle + 90)})` }, parent);
    const idle = tlr({ size: u, color: SILVER, stage: 'dark', detail: 'high' });
    idle.setAttribute('opacity', '0.62');
    g.append(idle);
    const lit = S('g', { opacity: 0 }, g);
    S('circle', { cy: -0.62 * u, r: u * 0.78, fill: goldGlow }, lit);
    const on = tlr({ size: u, color: GOLD, stage: 'dark', detail: 'high' });
    const hs = on.querySelector('[data-part="horseshoe"] path');
    if (hs) {
      const under = hs.cloneNode(false);
      under.setAttribute('fill', 'none');
      under.setAttribute('stroke', GOLD_HI);
      under.setAttribute('stroke-width', f(u * 0.13));
      under.setAttribute('stroke-opacity', '0.6');
      lit.append(under);
    }
    lit.append(on);
    return { g, lit, head: add(pos, pol(0.62 * u, angle)) };
  }

  function gateGlyph(parent, { pos, angle }) {
    const g = S('g', { transform: `translate(${f(pos[0])} ${f(pos[1])}) rotate(${f(angle + 90)})` }, parent);
    const glow = S('ellipse', { cx: 0, cy: -2, rx: 10, ry: 22, fill: goldGlow, opacity: 0 }, g);
    const bars = [-1, 1].map((sx) => {
      const b = S('g', {}, g);
      gsap.set(b, { x: sx * 4.6 });
      const rect = (fill, stroke, op) => S('rect', { x: -3.4, y: -19, width: 6.8, height: 31, rx: 3.4, fill, stroke, strokeWidth: 1.3, opacity: op }, b);
      rect(mix(SILVER, NAVY, 0.55), SILVER, 0.62);
      const lit = rect(mix(GOLD, NAVY, 0.35), GOLD_HI, 0);
      return { b, lit, sx };
    });
    return { g, glow, bars, head: add(pos, pol(20, angle)) };
  }

  function assemblyGlyph(parent, { pos, seed = 9 }) {
    const g = S('g', { transform: `translate(${f(pos[0])} ${f(pos[1])})` }, parent);
    const glow = S('circle', { r: 26, fill: goldGlow, opacity: 0 }, g);
    const R = prng(seed);
    const n = 7;
    const pieces = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * 360 - 90;
      const ring = { x: f(Math.cos(a * DEG) * 10.5), y: f(Math.sin(a * DEG) * 10.5), r: f(a) };
      const sa = (i / n) * 360 + R.range(-25, 25), sr = R.range(15, 26);
      const scat = { x: f(Math.cos(sa * DEG) * sr), y: f(Math.sin(sa * DEG) * sr * 0.85), r: f(R.range(0, 360)) };
      const p = S('g', { transform: `translate(${scat.x} ${scat.y}) rotate(${scat.r})` }, g);
      const body = S('rect', { x: -5, y: -2.7, width: 10, height: 5.4, rx: 2.7, fill: mix(SILVER, NAVY, 0.5), stroke: SILVER, strokeWidth: 1.1, opacity: 0.7 }, p);
      pieces.push({ p, body, ring, scat });
    }
    return { g, glow, pieces };
  }

  function stingGlyph(parent, { pos, angle }) {
    const g = S('g', { transform: `translate(${f(pos[0])} ${f(pos[1])}) rotate(${f(angle + 90)})` }, parent);
    const draw = (stroke, fill, op) => {
      const q = S('g', { opacity: op }, g);
      S('path', { d: 'M0 4V-1', stroke, strokeWidth: 2.2, strokeLinecap: 'round' }, q);
      for (const sx of [-1, 1]) S('path', { d: `M${sx * 1.2} -1L${sx * 6.5} -12`, stroke, strokeWidth: 4.6, strokeLinecap: 'round' }, q);
      for (const sx of [-1, 1]) S('path', { d: `M${sx * 1.2} -1L${sx * 6.5} -12`, stroke: fill, strokeWidth: 2.2, strokeLinecap: 'round' }, q);
      return q;
    };
    draw(SILVER, mix(SILVER, NAVY, 0.55), 0.62);
    const glow = S('circle', { cy: -6, r: 15, fill: goldGlow, opacity: 0 }, g);
    g.insertBefore(glow, g.firstChild);
    const lit = draw(GOLD_HI, mix(GOLD, NAVY, 0.3), 0);
    return { g, glow, lit, head: add(pos, pol(9, angle)) };
  }

  // ---------------------------------------------------------------- suspects (art)
  const BODY_R = 46;
  function notchMask(parent, r, faceDeg, scale, run = true) {
    const id = nextId('m');
    const mask = S('mask', { id, maskUnits: 'userSpaceOnUse', x: -r * 3, y: -r * 3, width: r * 6, height: r * 6, 'data-run': run ? '1' : null }, svg.defs);
    S('rect', { x: -r * 3, y: -r * 3, width: r * 6, height: r * 6, fill: '#fff' }, mask);
    const outer = S('g', { transform: `rotate(${f(faceDeg - 180)})` }, mask);   // notch drawn at −x → faces faceDeg
    const notch = S('path', {
      d: `M${-r * 1.4} ${-r * 0.34}L${-r * 0.86} ${-r * 0.2}L${-r * 0.74} ${-r * 0.1}L${-r * 0.8} ${-r * 0.03}L${-r * 0.52} ${r * 0.04}L${-r * 0.7} ${r * 0.1}L${-r * 0.66} ${r * 0.18}L${-r * 0.88} ${r * 0.24}L${-r * 1.4} ${r * 0.36}Z`,
      fill: '#000',
      transform: notchT(r, scale),
    }, outer);
    parent.setAttribute('mask', `url(#${id})`);
    return { mask, notch };
  }
  function notchT(r, sc) { return `translate(${f(-r)} 0) scale(${sc}) translate(${f(r)} 0)`; }
  function cracks(parent, r, faceDeg) {
    const g = S('g', { transform: `rotate(${f(faceDeg - 180)})`, opacity: 0 }, parent);
    S('path', { d: `M${-r * 0.62} ${-r * 0.16}L${-r * 0.42} ${-r * 0.3}L${-r * 0.3} ${-r * 0.26}M${-r * 0.56} ${r * 0.24}L${-r * 0.36} ${r * 0.36}L${-r * 0.2} ${r * 0.33}`, fill: 'none', stroke: '#2A1B12', strokeOpacity: 0.55, strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round' }, g);
    return g;
  }
  function suspectArt(value, parent, { r = BODY_R, faceDeg = 180, thumb = false } = {}) {
    const outer = S('g', {}, parent);                      // positioned by GSAP x/y
    const g = S('g', { transform: 'scale(1)' }, outer);    // resized via attr transform
    outer._s = g;
    if (value === 'bacterium') {
      g.append(bacterium({ r: thumb ? 13 : 19, flagella: 1, pamps: true, angle: thumb ? -18 : 0, seed: 4, stage: 'dark' }));
    } else if (value === 'virus') {
      g.append(virus({ r: thumb ? 10 : 11, seed: 3, stage: 'dark' }));
    } else if (value === 'healthy' || value === 'crushed') {
      const art = S('g', {}, g);
      art.append(healthyCell({ r, seed: value === 'crushed' ? 12 : 5, stage: 'dark', mhc: false }));
      if (value === 'crushed') {
        notchMask(art, r, faceDeg, 1, !thumb);
        cracks(g, r, faceDeg).setAttribute('opacity', '1');
        if (thumb) {
          const sp = S('g', { transform: `rotate(${faceDeg - 180})` }, g);
          [[-1.25, -0.25, 'atp'], [-1.5, 0.2, 'selfdna'], [-1.2, 0.5, 'atp']].forEach(([x, y, kind]) => {
            const t = token(kind, sp, { k: 0.55 });
            t.setAttribute('transform', `translate(${f(x * r)} ${f(y * r)})`);
          });
        }
      }
    } else if (value === 'cancer') {
      const art = S('g', {}, g);
      art.append(cancerCell({ r, seed: 8, stage: 'dark', mhc: false, nuclei: 1 }));
      if (!thumb) {
        outer._notch = notchMask(art, r, faceDeg, 0.001).notch;
        outer._cracks = cracks(g, r, faceDeg);
        outer._art = art;
      }
    }
    return outer;
  }

  // ---------------------------------------------------------------- scene (persistent)
  function buildScene() {
    for (const n of [...svg.children]) if (n !== svg.defs) n.remove();
    svg.querySelectorAll('mask[data-run]').forEach((m) => m.remove());
    L = layoutFor(compact);
    svg.setAttribute('viewBox', `0 0 ${L.vb[0]} ${L.vb[1]}`);
    ctx.refreshTextScale();

    const frame = S('g', { transform: `translate(${L.cx} ${L.cy}) rotate(${L.rot}) scale(${L.k})` }, svg);
    const plumeG = S('g', { 'data-layer': 'plume' }, frame);
    const macG = S('g', { transform: `rotate(${ROT})` }, frame);
    const mac = macrophage({ r: 300, polarization: 0, seed: SEED, stage: 'dark', state: 'resting' });
    macG.append(mac);
    // Cutaway: a translucent veil over the cytoplasm so the compartments and sensors read clearly.
    const info = cellInfo(mac);
    const memb = mac.querySelector('[data-part="membrane"]');
    const vac = mac.querySelector('[data-part="vacuoles"]');
    if (vac) vac.setAttribute('opacity', '0');
    const inset = info.outline.map(([x, y]) => {
      const d = Math.hypot(x, y) || 1;
      const k = Math.max(0.5, (d - 9) / d);
      return [x * k, y * k];
    });
    const veil = S('path', { d: smooth(inset), fill: veilFill }, null);
    memb.after(veil);
    const nucEnv = mac.querySelector('[data-part="nucleus"] .sao-nucleus-envelope');

    // Geometry in frame coordinates (the macrophage is rotated by ROT inside the frame).
    const c = Math.cos(ROT * DEG), s = Math.sin(ROT * DEG);
    const rotP = ([x, y]) => [x * c - y * s, x * s + y * c];
    const outline = info.outline.map(rotP);
    const R = (a) => rayHit(outline, a);
    const bb = nucEnv.getBBox();
    const nuc = { c: rotP([bb.x + bb.width / 2, bb.y + bb.height / 2]), rx: bb.width / 2, ry: bb.height / 2 };
    const u = 28;
    const bubble = { c: [44, -98], r: 47 };
    const er = { c: [92, 128], w: 100, h: 26, rot: -16 };
    // Clearance: the farthest membrane point within ±hw° (so a large neighbour never overlaps a spike).
    const C = (a, hw = 14) => { let m = 0; for (let d = -hw; d <= hw; d += 2) m = Math.max(m, R(a + d)); return m; };
    G = { R, C, nuc, bubble, er, u, outline };

    const interior = S('g', { 'data-layer': 'interior' }, frame);
    // ER strip (unlabeled) and digestion bubble
    const erG = S('g', { transform: `translate(${er.c[0]} ${er.c[1]}) rotate(${er.rot})` }, interior);
    erG.append(vesicle({ kind: 'er', width: er.w, height: er.h, seed: 4, stage: 'dark' }));
    const bubG = S('g', { transform: `translate(${bubble.c[0]} ${bubble.c[1]})` }, interior);
    bubG.append(vesicle({ kind: 'endosome', r: bubble.r, seed: 2, stage: 'dark' }));
    const nucGlowEl = S('ellipse', { cx: f(nuc.c[0]), cy: f(nuc.c[1]), rx: f(nuc.rx * 1.25), ry: f(nuc.ry * 1.25), fill: nucGlow, opacity: 0 }, interior);

    // Sensor positions
    const surf = (a) => pol(R(a), a);
    const sens = {};
    const linesG = S('g', { 'data-layer': 'lines' }, frame);
    const sensG = S('g', { 'data-layer': 'sensors' }, frame);
    // 1, 2: surface receptors, heads outward
    for (const [n, a] of [[1, -31], [2, -11]]) {
      const pos = surf(a);
      const r = receptorGlyph(sensG, { pos, angle: a, u });
      sens[n] = { ...r, pos, angle: a, base: add(pos, pol(-0.32 * u, a)) };
    }
    // 3: ATP gate in the membrane
    {
      const a = 14, pos = surf(a);
      const r = gateGlyph(sensG, { pos, angle: a });
      sens[3] = { ...r, pos, angle: a, base: add(pos, pol(-13, a)) };
    }
    // 4, 5: in the bubble membrane, heads facing INTO the bubble
    for (const [n, b] of [[4, 196], [5, -22]]) {
      const pos = add(bubble.c, pol(bubble.r, b));
      const r = receptorGlyph(sensG, { pos, angle: b + 180, u: u * 0.92 });
      sens[n] = { ...r, pos, angle: b + 180, base: add(pos, pol(0.32 * u, b)) };
    }
    // 6, 7: free-floating receptors in the interior
    for (const [n, p, a] of [[6, [150, 22], -60], [7, [52, 74], -105]]) {
      const r = receptorGlyph(sensG, { pos: p, angle: a, u: u * 0.92 });
      sens[n] = { ...r, pos: p, angle: a, base: add(p, pol(-0.3 * u, a)) };
    }
    // STING on the ER strip (cytosolic face)
    const stingPos = add(er.c, rotateV([4, -er.h / 2 + 1], er.rot));
    const sting = stingGlyph(sensG, { pos: stingPos, angle: er.rot - 90 });
    // 8: damage sensor (assembly)
    const s8pos = [120, -34];
    const a8 = assemblyGlyph(sensG, { pos: s8pos });
    sens[8] = { ...a8, pos: s8pos, base: s8pos, head: s8pos };

    // Lines (sensor → nucleus; gate → damage sensor; cGAS → STING → nucleus)
    const toNuc = (p, bend = 0.18) => {
      const v = [nuc.c[0] - p[0], nuc.c[1] - p[1]];
      const d = Math.hypot(...v);
      const e = [nuc.c[0] - (v[0] / d) * nuc.rx * 0.82, nuc.c[1] - (v[1] / d) * nuc.ry * 0.82];
      const m = [(p[0] + e[0]) / 2 - v[1] * bend, (p[1] + e[1]) / 2 + v[0] * bend];
      return `M${f(p[0])} ${f(p[1])}Q${f(m[0])} ${f(m[1])} ${f(e[0])} ${f(e[1])}`;
    };
    const lineEl = (d, extra = {}) => S('path', { d, fill: 'none', stroke: GOLD, strokeWidth: 1.3, strokeDasharray: '2 4', strokeLinecap: 'round', opacity: 0, ...extra }, linesG);
    const lines = {
      1: lineEl(toNuc(sens[1].base, 0.12)),
      2: lineEl(toNuc(sens[2].base, -0.08)),
      4: lineEl(toNuc(sens[4].base, -0.1)),
      5: lineEl(toNuc(sens[5].base, 0.16)),
      6: lineEl(toNuc(sens[6].base, 0.1)),
      8: lineEl(toNuc(s8pos, 0.12)),
      g8: lineEl(`M${f(sens[3].base[0])} ${f(sens[3].base[1])}Q${f(175)} ${f(-6)} ${f(s8pos[0] + 14)} ${f(s8pos[1] + 8)}`),
      r8: lineEl(`M${f(bubble.c[0] + 40)} ${f(bubble.c[1] + 26)}Q${f(98)} ${f(-48)} ${f(s8pos[0] - 14)} ${f(s8pos[1] - 4)}`),
      7: lineEl(`M${f(sens[7].base[0])} ${f(sens[7].base[1])}L${f(stingPos[0] - 2)} ${f(stingPos[1] - 6)}`),
      st: lineEl(toNuc(add(stingPos, [-8, -4]), -0.12)),
    };
    // Faint dotted link between sensor 7 and its partner STING (always visible).
    const link = S('path', { d: `M${f(sens[7].head[0])} ${f(sens[7].head[1])}Q${f(stingPos[0] + 4)} ${f(sens[7].head[1] + 6)} ${f(stingPos[0] + 2)} ${f(stingPos[1] - 12)}`, fill: 'none', stroke: SILVER, strokeWidth: 1.2, strokeDasharray: '1 3.5', strokeLinecap: 'round', opacity: 0.4 }, linesG);
    linesG.after(sensG);

    const dyn = S('g', { 'data-layer': 'run' }, frame);

    // ------------------------------------------------ overlay (upright text: labels + badges)
    const over = S('g', { 'data-layer': 'overlay' }, svg);
    const labelSpecs = compact
      ? [
        { text: 'Endosome', at: [404, 64], anchor: 'end', to: add(bubble.c, pol(bubble.r, -150)) },
        { text: 'Interior', at: [16, 34], anchor: 'start', to: [-150, -40] },
        { text: 'Outer surface', at: [404, 546], anchor: 'end', to: surf(-24) },
      ]
      : [
        { text: 'Endosome', at: [318, 44], anchor: 'middle', to: add(bubble.c, pol(bubble.r, -100)) },
        { text: 'Outer surface', at: [568, 74], anchor: 'middle', to: surf(-44) },
        { text: 'Interior', at: [540, 602], anchor: 'start', to: [96, 164] },
      ];
    for (const sp of labelSpecs) {
      const tgt = toStage(sp.to);
      const ty = sp.at[1] + (sp.at[1] < tgt[1] ? 7 : -17);
      S('path', { class: 'leader', d: `M${f(sp.at[0] + (sp.anchor === 'end' ? -16 : sp.anchor === 'start' ? 16 : 0))} ${f(ty)}L${f(tgt[0])} ${f(tgt[1])}` }, over);
      S('circle', { class: 'leader-dot', cx: f(tgt[0]), cy: f(tgt[1]), r: 2.4 }, over);
      S('text', { class: `t-label t-halo${sp.anchor === 'middle' ? ' t-mid' : sp.anchor === 'end' ? ' t-end' : ''}`, x: sp.at[0], y: sp.at[1], text: sp.text }, over);
    }
    // Badge anchors (frame coords), chosen to sit clear of heads and pathways.
    const badgeAt = {
      1: add(sens[1].head, [-24, -14]),
      2: add(sens[2].head, [14, -22]),
      3: add(add(sens[3].pos, pol(28, sens[3].angle - 90)), pol(10, sens[3].angle)),
      4: add(bubble.c, pol(bubble.r + 26, 196)),
      5: add(bubble.c, pol(bubble.r + 25, -40)),
      6: add(sens[6].pos, [22, 16]),
      7: add(sens[7].pos, [-24, 4]),
      8: add(s8pos, [-6, -32]),
    };
    const badges = {};
    for (const s of SENSORS) {
      const p = toStage(badgeAt[s.n]);
      const g = S('g', { transform: `translate(${f(p[0])} ${f(p[1])})` }, over);
      const idle = S('g', {}, g);
      S('circle', { r: L.badgeR, fill: '#10183A', stroke: SILVER, strokeOpacity: 0.7, strokeWidth: 1.3 }, idle);
      S('text', { class: 't-small t-mid t-num pr-badge-num', y: 0.5, 'dominant-baseline': 'central', text: String(s.n), style: `fill:${SILVER};font-weight:700` }, idle);
      const lit = S('g', { opacity: 0 }, g);
      S('circle', { r: L.badgeR * 2, fill: goldGlow, opacity: 0.8 }, lit);
      S('circle', { r: L.badgeR, fill: GOLD, stroke: GOLD_HI, strokeWidth: 1.5 }, lit);
      S('text', { class: 't-small t-mid t-num', y: 0.5, 'dominant-baseline': 'central', text: String(s.n), style: `fill:${NAVY};font-weight:750` }, lit);
      badges[s.n] = { idle, lit };
    }
    N = { frame, plumeG, mac, interior, dyn, lines, link, sens, sting, nucGlowEl, badges, surf };
  }

  function rotateV([x, y], aDeg) {
    const c = Math.cos(aDeg * DEG), s = Math.sin(aDeg * DEG);
    return [x * c - y * s, x * s + y * c];
  }
  function smooth(pts) {
    // Catmull-Rom → cubic Bézier, closed
    let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
    const n = pts.length;
    for (let i = 0; i < n; i++) {
      const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += `C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
    }
    return `${d}Z`;
  }

  // ---------------------------------------------------------------- idle / reset
  function litTargets() {
    const t = [];
    for (const n of [1, 2, 4, 5, 6, 7]) t.push(N.sens[n].lit);
    t.push(N.sens[3].glow, N.sens[8].glow, N.sting.lit, N.sting.glow, N.nucGlowEl);
    for (const s of SENSORS) t.push(N.badges[s.n].lit);
    for (const k of Object.keys(N.lines)) t.push(N.lines[k]);
    for (const b of N.sens[3].bars) t.push(b.lit);
    return t;
  }
  function setIdle() {
    gsap.killTweensOf(litTargets());
    gsap.set(litTargets(), { opacity: 0 });
    for (const b of N.sens[3].bars) gsap.set(b.b, { x: b.sx * 4.6 });
    for (const p of N.sens[8].pieces) {
      gsap.set(p.p, { attr: { transform: `translate(${p.scat.x} ${p.scat.y}) rotate(${p.scat.r})` } });
      gsap.set(p.body, { attr: { fill: mix(SILVER, NAVY, 0.5), stroke: SILVER }, opacity: 0.7 });
    }
    gsap.set(N.link, { opacity: 0.4, attr: { stroke: SILVER } });
    N.dyn.replaceChildren();
    N.plumeG.replaceChildren();
    svg.querySelectorAll('mask[data-run]').forEach((m) => m.remove());
    gsap.set([N.dyn, N.plumeG], { opacity: 1 });
  }
  function fadeToIdle(d) {
    const t = gsap.timeline();
    t.to(litTargets(), { opacity: 0, duration: d, ease: 'so.inOut' }, 0);
    t.to([N.dyn, N.plumeG], { opacity: 0, duration: d, ease: 'so.inOut' }, 0);
    for (const b of N.sens[3].bars) t.to(b.b, { x: b.sx * 4.6, duration: d }, 0);
    for (const p of N.sens[8].pieces) {
      t.to(p.p, { attr: { transform: `translate(${p.scat.x} ${p.scat.y}) rotate(${p.scat.r})` }, duration: d }, 0);
      t.to(p.body, { attr: { fill: mix(SILVER, NAVY, 0.5), stroke: SILVER }, opacity: 0.7, duration: d }, 0);
    }
    t.to(N.link, { opacity: 0.4, attr: { stroke: SILVER }, duration: d }, 0);
    return t;
  }

  // ---------------------------------------------------------------- run building blocks
  const ease = 'so.inOut';
  function place(node, p) { gsap.set(node, { x: f(p[0]), y: f(p[1]) }); return node; }
  function light(t, n, at, v = 1) {
    const s = N.sens[n];
    if (n === 3) {
      for (const b of s.bars) {
        t.to(b.b, { x: b.sx * 8.6, duration: 0.45, ease }, at);
        t.to(b.lit, { opacity: v, duration: 0.45, ease }, at);
      }
      t.to(s.glow, { opacity: 0.9 * v, duration: 0.5, ease }, at);
    } else if (n === 8) {
      s.pieces.forEach((p, i) => {
        t.to(p.p, { attr: { transform: `translate(${p.ring.x} ${p.ring.y}) rotate(${p.ring.r})` }, duration: 0.6, ease: 'so.out' }, at + i * 0.03);
        t.to(p.body, { attr: { fill: mix(GOLD, NAVY, 0.3), stroke: GOLD_HI }, opacity: 1, duration: 0.4, ease }, at + 0.35);
      });
      t.to(s.glow, { opacity: v, duration: 0.5, ease }, at + 0.4);
      at += 0.4;
    } else {
      t.to(s.lit, { opacity: v, duration: 0.4, ease }, at);
    }
    t.to(N.badges[n].lit, { opacity: 1, duration: 0.4, ease }, at);
    if (n === 7) {
      t.to(N.sting.lit, { opacity: v, duration: 0.45, ease }, at + 0.25);
      t.to(N.sting.glow, { opacity: 0.9 * v, duration: 0.45, ease }, at + 0.25);
      t.to(N.link, { opacity: 0.55 + 0.4 * v, attr: { stroke: GOLD }, duration: 0.4, ease }, at + 0.1);
    }
  }
  function pulse(t, key, at, v = 1) {
    const line = N.lines[key];
    t.to(line, { opacity: 0.5 * v, duration: 0.3, ease }, at);
    pulseAlong(t, line, null, { duration: 0.55, size: 5.5, layer: N.dyn, pos: at + 0.1 });
  }
  function glowNucleus(t, at, v = 1) { t.to(N.nucGlowEl, { opacity: v, duration: 0.5, ease }, at); }
  function plume(t, at, { kind, n, seed, angles }) {
    const per = Math.max(1, Math.round(n / angles.length));
    angles.forEach((a, i) => {
      const o = pol(G.R(a) * 0.97, a);
      emit(t, { x: o[0], y: o[1] }, {
        kind, color: CORAL, n: per, r: kind === 'interferon' ? 96 : 86, duration: 1.8, angle: a, spread: 50,
        size: (kind === 'interferon' ? 12.5 : 8) * (compact ? 1.25 : 1), fade: false, seed: seed + i, layer: N.plumeG, pos: at + (i % 3) * 0.12,
      });
    });
  }
  /** A membrane wraps around something at the surface and pinches it inward: returns the ring. */
  function wrapRing(t, at, p, r) {
    const ring = S('circle', { r, fill: 'none', stroke: mix(CORAL, '#FFFFFF', 0.35), strokeWidth: 1.8, opacity: 0 }, N.dyn);
    place(ring, p);
    t.to(ring, { opacity: 0.95, duration: 0.15 }, at);
    t.fromTo(ring, { drawSVG: '50% 50%' }, { drawSVG: '0% 100%', duration: 0.5, ease, immediateRender: false }, at);
    return ring;
  }
  function startPoint(value) {
    if (trayInStage && trays.buttons.get(value)) {
      const thumb = trays.buttons.get(value).querySelector('.pr-thumb') || trays.buttons.get(value);
      const r = thumb.getBoundingClientRect();
      const m = svg.getScreenCTM();
      if (m && r.width) {
        const pt = svg.createSVGPoint();
        pt.x = r.left + r.width / 2; pt.y = r.top + r.height / 2;
        const q = pt.matrixTransform(m.inverse());
        return toFrame([q.x, q.y]);
      }
    }
    return toFrame(toStage([G.R(0) + 360, 30]));
  }
  function approach(t, node, from, to, { at = 0, duration = 1, via = 0 } = {}) {
    place(node, from);
    gsap.set(node, { opacity: 0 });
    const mid = [(from[0] + to[0]) / 2 + 10, (from[1] + to[1]) / 2 + via];
    t.to(node, { opacity: 1, duration: 0.3 }, at);
    t.to(node, { motionPath: { path: [{ x: from[0], y: from[1] }, { x: mid[0], y: mid[1] }, { x: to[0], y: to[1] }], curviness: 1.1 }, duration, ease: 'so.inOut' }, at);
  }

  // ---------------------------------------------------------------- choreographies
  const RUNS = {
    bacterium(t) {
      const a = -34;
      const dock = pol(G.R(a) + 18, a);
      const bact = suspectArt('bacterium', N.dyn);
      const tang = [-Math.sin(a * DEG), Math.cos(a * DEG)];
      bact._s.firstChild.setAttribute('transform', `rotate(${f(Math.atan2(-tang[1], -tang[0]) / DEG)})`);
      approach(t, bact, startPoint('bacterium'), dock, { duration: 1.0, via: -40 });
      // surface binding: LPS → 1, flagellin → 2
      const lps = token('lps', N.dyn, { rot: a + 90 });
      place(lps, add(dock, pol(-6, a)));
      gsap.set(lps, { opacity: 0 });
      const fl = token('flagellin', N.dyn, { rot: a + 90 + 12 });
      place(fl, add(dock, tang, 52));
      gsap.set(fl, { opacity: 0 });
      t.to([lps, fl], { opacity: 1, duration: 0.25 }, 1.0);
      t.to(lps, { x: N.sens[1].head[0], y: N.sens[1].head[1], duration: 0.4, ease }, 1.05);
      t.to(fl, { x: N.sens[2].head[0], y: N.sens[2].head[1], duration: 0.4, ease }, 1.05);
      light(t, 1, 1.4); light(t, 2, 1.4);
      pulse(t, 1, 1.75); pulse(t, 2, 1.8);
      glowNucleus(t, 2.3, 0.55);
      plume(t, 2.35, { kind: 'cytokine', n: 9, seed: 11, angles: [150, 205, 250] });
      // engulf → digestion bubble
      const inside = pol(G.R(a) - 34, a);
      const ring = wrapRing(t, 1.9, dock, 24);
      t.to([bact, ring], { x: inside[0], y: inside[1], duration: 0.55, ease }, 2.0);
      t.to(bact._s, { attr: { transform: 'scale(0.62)' }, duration: 0.55, ease }, 2.0);
      t.to([bact, ring], { x: G.bubble.c[0] + 8, y: G.bubble.c[1] + 4, duration: 0.7, ease }, 2.55);
      t.to(ring, { attr: { r: 18 }, duration: 0.7, ease }, 2.55);
      t.to(ring, { opacity: 0, duration: 0.3 }, 3.2);
      // breaks open, DNA → 5
      t.to(bact, { opacity: 0.22, duration: 0.35 }, 3.3);
      t.to(bact._s, { attr: { transform: 'scale(0.5)' }, duration: 0.35 }, 3.3);
      const dnaA = token('bdna', N.dyn, { k: 0.85, rot: 30 });
      place(dnaA, add(G.bubble.c, [8, 4]));
      gsap.set(dnaA, { opacity: 0 });
      const dnaB = token('bdna', N.dyn, { k: 0.75, rot: -40 });
      place(dnaB, add(G.bubble.c, [-6, 10]));
      gsap.set(dnaB, { opacity: 0 });
      t.to([dnaA, dnaB], { opacity: 1, duration: 0.3 }, 3.4);
      t.to(dnaA, { x: N.sens[5].head[0], y: N.sens[5].head[1], duration: 0.4, ease }, 3.7);
      t.to(dnaB, { x: G.bubble.c[0] - 14, y: G.bubble.c[1] + 18, duration: 0.6, ease }, 3.6);
      light(t, 5, 4.05);
      pulse(t, 5, 4.35);
      glowNucleus(t, 4.75, 1);
      plume(t, 4.8, { kind: 'cytokine', n: 18, seed: 21, angles: [120, 168, 195, 232, 268, -96] });
    },

    virus(t) {
      const aA = -18, aB = 6;
      const dA = pol(G.R(aA) + 15, aA), dB = pol(G.R(aB) + 15, aB);
      const vA = suspectArt('virus', N.dyn), vB = suspectArt('virus', N.dyn);
      const st = startPoint('virus');
      approach(t, vA, add(st, [-6, -6]), dA, { duration: 0.95, via: -30 });
      approach(t, vB, add(st, [6, 8]), dB, { duration: 1.0, via: 20 });
      // virion B fuses at the membrane and releases double-stranded RNA into the interior → 6
      const inB = pol(G.R(aB) - 8, aB);
      t.to(vB, { x: inB[0], y: inB[1], duration: 0.45, ease }, 1.25);
      t.to(vB, { opacity: 0, duration: 0.4 }, 1.55);
      t.to(vB._s, { attr: { transform: 'scale(0.7)' }, duration: 0.4 }, 1.55);
      const ds = token('dsrna', N.dyn, { rot: 20 });
      place(ds, pol(G.R(aB) - 22, aB));
      gsap.set(ds, { opacity: 0 });
      t.to(ds, { opacity: 1, duration: 0.3 }, 1.65);
      t.to(ds, { x: N.sens[6].head[0], y: N.sens[6].head[1], duration: 0.6, ease }, 1.85);
      light(t, 6, 2.4);
      pulse(t, 6, 2.7);
      // virion A is swallowed into the bubble; its RNA → 4
      const inA = pol(G.R(aA) - 30, aA);
      const ring = wrapRing(t, 1.3, dA, 17);
      t.to([vA, ring], { x: inA[0], y: inA[1], duration: 0.5, ease }, 1.45);
      t.to([vA, ring], { x: G.bubble.c[0] + 4, y: G.bubble.c[1] - 4, duration: 0.65, ease }, 1.95);
      t.to(ring, { opacity: 0, duration: 0.3 }, 2.55);
      t.to(vA, { opacity: 0, duration: 0.35 }, 2.7);
      t.to(vA._s, { attr: { transform: 'scale(0.6)' }, duration: 0.35 }, 2.7);
      const ss = token('ssrna', N.dyn, { rot: -30 });
      place(ss, add(G.bubble.c, [4, -4]));
      gsap.set(ss, { opacity: 0 });
      t.to(ss, { opacity: 1, duration: 0.3 }, 2.75);
      t.to(ss, { x: N.sens[4].head[0], y: N.sens[4].head[1], duration: 0.45, ease }, 2.95);
      light(t, 4, 3.35);
      pulse(t, 4, 3.6);
      glowNucleus(t, 3.1, 0.6);
      glowNucleus(t, 4.0, 1);
      plume(t, 3.25, { kind: 'interferon', n: 7, seed: 31, angles: [150, 205, 255] });
      plume(t, 4.05, { kind: 'interferon', n: 12, seed: 41, angles: [118, 178, 232, -100] });
      plume(t, 4.3, { kind: 'cytokine', n: 6, seed: 51, angles: [140, 210, 260] });
    },

    crushed(t) {
      const a = 33;
      const rest = pol(G.C(a) + BODY_R + 38, a);
      const face = 180 + a;
      const cell = suspectArt('crushed', N.dyn, { faceDeg: face });
      approach(t, cell, startPoint('crushed'), rest, { duration: 1.0, via: 10 });
      const tear = add(rest, pol(BODY_R * 0.82, face));
      // its contents spill out of the tear; uric acid forms crystals only once it is outside
      const sp = spill(t, 1.0, { tear, toward: face, seed: 5, kinds: ['atp', 'atp', 'selfdna', 'atp', 'selfdna', 'atp'] });
      const gm = N.sens[3].head;
      t.to(sp[0].node, { x: gm[0] + 4, y: gm[1] - 3, duration: 0.5, ease }, 1.78);
      t.to(sp[1].node, { x: gm[0] + 11, y: gm[1] + 7, duration: 0.55, ease }, 1.85);
      light(t, 3, 2.2);
      pulse(t, 'g8', 2.5);
      const sw = 25;
      const entry = pol(G.R(sw) + 11, sw);
      const crystals = [[entry, 70], [add(tear, pol(30, face - 48)), 20], [add(tear, pol(34, face + 44)), -35], [add(tear, pol(18, face + 8)), 110]]
        .map(([p, rot], i) => {
          const c = token('crystal', N.dyn, { rot, k: 1.1 });
          place(c, p);
          gsap.set(c, { opacity: 0 });
          c._s.setAttribute('transform', 'scale(0.2)');
          t.to(c, { opacity: 1, duration: 0.45 }, 1.35 + i * 0.13);
          t.to(c._s, { attr: { transform: 'scale(1)' }, duration: 0.5, ease: 'so.out' }, 1.35 + i * 0.13);
          return c;
        });
      const dna = sp[2].node;
      t.to(dna, { x: entry[0] + 7, y: entry[1] + 8, duration: 0.45, ease }, 1.92);
      // a crystal (with some DNA) is swallowed into the bubble, whose membrane tears
      const ring = wrapRing(t, 2.25, add(entry, [3, 4]), 21);
      const inside = pol(G.R(sw) - 30, sw);
      const grp = [crystals[0], dna, ring];
      const off = (i) => (i === 1 ? [7, 8] : i === 2 ? [3, 4] : [0, 0]);
      t.to(grp, { x: (i) => inside[0] + off(i)[0], y: (i) => inside[1] + off(i)[1], duration: 0.5, ease }, 2.4);
      const inBub = add(G.bubble.c, [12, 10]);
      t.to(grp, { x: (i) => inBub[0] + off(i)[0] * 0.6, y: (i) => inBub[1] + off(i)[1] * 0.6, duration: 0.75, ease }, 2.9);
      t.to(ring, { attr: { r: 17 }, duration: 0.75, ease }, 2.9);
      t.to(ring, { opacity: 0, duration: 0.3 }, 3.6);
      const rip = ripMark(N.dyn);
      t.to(rip, { opacity: 1, duration: 0.3 }, 3.65);
      pulse(t, 'r8', 3.85);
      light(t, 8, 4.05);
      // a few DNA strands escape into the interior → 7 (faintly)
      t.to(dna, { x: N.sens[7].head[0], y: N.sens[7].head[1], duration: 1.0, ease }, 3.9);
      light(t, 7, 4.85, LIT.crushed[7]);
      pulse(t, 8, 4.8);
      pulse(t, 7, 5.1, 0.6);
      pulse(t, 'st', 5.4, 0.6);
      glowNucleus(t, 5.2, 0.8);
      plume(t, 5.3, { kind: 'cytokine', n: 14, seed: 61, angles: [125, 165, 200, 235, 268, -100] });
    },

    healthy(t) {
      const a = -4;
      const touch = pol(G.C(a) + BODY_R - 4, a);
      const back = pol(G.C(a) + BODY_R + 16, a);
      const cell = suspectArt('healthy', N.dyn);
      approach(t, cell, startPoint('healthy'), touch, { duration: 1.1, via: 10 });
      t.to(cell, { x: back[0], y: back[1], duration: 1.0, ease }, 1.5);
    },

    cancer(t) {
      const a = 4;
      const touch = pol(G.C(a) + BODY_R - 4, a);
      const rest = pol(G.C(a) + BODY_R + 16, a);
      const cell = suspectArt('cancer', N.dyn, { faceDeg: 180 + a });
      approach(t, cell, startPoint('cancer'), touch, { duration: 1.1, via: 10 });
      t.to(cell, { x: rest[0], y: rest[1], duration: 0.8, ease }, 1.4);
      t.addLabel('rupture', 2.3);
      // ---- "What if it dies messily?": it bursts; ATP and its own DNA spill out
      const r0 = 2.3;
      t.to(cell._notch, { attr: { transform: notchT(BODY_R, 1) }, duration: 0.6, ease: 'so.out' }, r0);
      t.to(cell._cracks, { opacity: 1, duration: 0.4 }, r0 + 0.1);
      t.to(cell._art, { opacity: 0.72, duration: 0.6 }, r0);
      const tear = add(rest, pol(BODY_R * 0.82, 180 + a));
      const sp = spill(t, r0 + 0.3, { tear, toward: 180 + a, seed: 9, kinds: ['atp', 'selfdna', 'atp', 'selfdna', 'atp', 'selfdna'] });
      const gm = N.sens[3].head;
      t.to(sp[0].node, { x: gm[0] + 4, y: gm[1] - 3, duration: 0.55, ease }, r0 + 1.06);
      light(t, 3, r0 + 1.4);
      pulse(t, 'g8', r0 + 1.7);
      light(t, 8, r0 + 2.1);
      const sw = -18;
      const entry = pol(G.R(sw) + 12, sw);
      const dna = sp[1].node;
      t.to(dna, { x: entry[0], y: entry[1], duration: 0.4, ease }, r0 + 1.13);
      const ring = wrapRing(t, r0 + 1.45, entry, 16);
      const inside = pol(G.R(sw) - 30, sw);
      t.to([dna, ring], { x: inside[0], y: inside[1], duration: 0.5, ease }, r0 + 1.6);
      const near7 = add(N.sens[7].head, [28, -24]);
      t.to([dna, ring], { x: near7[0], y: near7[1], duration: 0.75, ease }, r0 + 2.1);
      t.to(ring, { opacity: 0, attr: { r: 24 }, duration: 0.4 }, r0 + 2.8);
      t.to(dna, { x: N.sens[7].head[0], y: N.sens[7].head[1], duration: 0.4, ease }, r0 + 2.85);
      light(t, 7, r0 + 3.2);
      pulse(t, 8, r0 + 2.5);
      pulse(t, 7, r0 + 3.5);
      pulse(t, 'st', r0 + 3.85);
      glowNucleus(t, r0 + 3.9, 0.85);
      plume(t, r0 + 4.05, { kind: 'interferon', n: 7, seed: 71, angles: [140, 195, 245] });
      plume(t, r0 + 4.3, { kind: 'cytokine', n: 5, seed: 81, angles: [170, 225] });
    },
  };

  function ripMark(parent) {
    const b = G.bubble;
    const a = 36;
    const p = add(b.c, pol(b.r, a));
    const g = S('g', { transform: `translate(${f(p[0])} ${f(p[1])}) rotate(${a + 90})`, opacity: 0 }, parent);
    // a torn gap in the bubble's membrane: the wall is cut and its edges curl outward
    S('path', { d: 'M-8 0L8 0', stroke: '#1A1630', strokeWidth: 7, strokeLinecap: 'round', opacity: 0.95 }, g);
    S('path', { d: 'M-9 1L-6 -2L-3 2L0 -2.5L3 2L6 -2L9 1', fill: 'none', stroke: GOLD_HI, strokeWidth: 1.2, strokeLinejoin: 'round', strokeLinecap: 'round' }, g);
    S('path', { d: 'M-12 1Q-11 -5 -7 -6M12 1Q11 -5 7 -6', fill: 'none', stroke: '#D5DEF2', strokeWidth: 1.4, strokeLinecap: 'round' }, g);
    return g;
  }
  /** Contents spill out of a torn cell into the space toward the macrophage. */
  function spill(t, at, { tear, toward, kinds, seed, spread = 50, dist = [18, 50] }) {
    const R = prng(seed);
    return kinds.map((kind, i) => {
      const node = token(kind, N.dyn, { rot: R.range(-70, 70), k: 1.05 });
      place(node, tear);
      gsap.set(node, { opacity: 0 });
      const ang = toward + lerp(-spread, spread, kinds.length > 1 ? i / (kinds.length - 1) : 0.5) + R.range(-8, 8);
      const end = add(tear, pol(R.range(dist[0], dist[1]), ang));
      t.to(node, { opacity: 1, duration: 0.25 }, at + i * 0.07);
      t.to(node, { x: end[0], y: end[1], duration: 0.75, ease: 'so.out' }, at + i * 0.07);
      return { node, end };
    });
  }

  // ---------------------------------------------------------------- running
  function build(value, { rupture = false } = {}) {
    setIdle();
    const t = gsap.timeline({ paused: true, defaults: { ease } });
    RUNS[value](t);
    if (value === 'cancer' && !rupture) {
      // stop before the rupture: everything after the label is for "What if it dies messily?"
      t.addPause('rupture');
    }
    return t;
  }
  function stopRun() {
    if (fadeTl) { fadeTl.kill(); fadeTl = null; }
    if (tl) { tl.kill(); tl = null; }
    pausedRun = false;
  }
  function start(value, { rupture = false, fromRupture = false, instant = false } = {}) {
    const go = () => {
      fadeTl = null;
      tl = build(value, { rupture });
      if (instant || ctx.reducedMotion) {
        if (value === 'cancer' && !rupture) tl.seek('rupture', false);
        else tl.progress(1, false);
        if (!instant) gsap.fromTo([N.dyn, N.plumeG], { opacity: 0 }, { opacity: 1, duration: 0.35 });
        return;
      }
      if (fromRupture) tl.seek('rupture', false);
      tl.play();
      if (!ctx.visible) { tl.pause(); pausedRun = true; }
    };
    const busy = N.dyn.childNodes.length || N.plumeG.childNodes.length;
    stopRun();
    if (busy && !instant && !ctx.reducedMotion && !fromRupture) {
      fadeTl = fadeToIdle(0.4);
      fadeTl.eventCallback('onComplete', go);
    } else go();
  }

  // ---------------------------------------------------------------- readout (info card)
  const card = ctx.ui.infoCard({ placement: 'below', closable: false, empty: 'Offer the macrophage something from the tray to see which of its sensors fire.' });
  function showCard(value) {
    const sp = SUSPECTS.find((x) => x.value === value);
    const rup = value === 'cancer' && ruptured;
    const body = h('div', null);
    if (rup) {
      body.append(h('p', null, RUPTURE_TEXT));
    } else {
      const dl = h('dl', { class: 'pr-rows' });
      for (const [k, v] of sp.rows) {
        const dd = h('dd', null, v);
        if (k === 'Detected' && sp.tokens.length) dd.append(tokenList(sp.tokens));
        dl.append(h('dt', null, k), dd);
      }
      body.append(dl);
    }
    if (rup) body.append(tokenList(RUPTURE_TOKENS));
    if (value === 'cancer' && !ruptured) {
      const more = h('div', { class: 'pr-more' });
      ctx.ui.button({ label: 'What if it dies messily?', small: true, parent: more, onClick: () => rupture() });
      body.append(more);
    }
    card.show({
      kicker: 'Offered to the macrophage',
      title: sp.label,
      badge: (sp.alarm === 'yes' || rup) ? { kind: 'yes', label: 'Alarm' } : { kind: 'no', label: 'No alarm' },
      body,
    });
  }
  function tokenList(kinds) {
    return h('ul', { class: 'pr-tokens', 'aria-label': 'Patterns shown on the stage' },
      ...kinds.map((k) => h('li', null, tokenIcon(k), h('span', null, TOKEN_NAMES[k]))));
  }

  // ---------------------------------------------------------------- legend (controls)
  const legendEl = h('div', { class: 'pr-legend' });
  const legendHead = h('div', { class: 'pr-legend__head' }, h('p', { class: 'pr-h' }, 'Sensors'));
  legendEl.append(legendHead);
  ctx.ui.toggle({ label: 'Show molecular names', parent: legendHead, onChange: (on) => { showMol = on; legendEl.classList.toggle('show-mol', on); } });
  const items = new Map();
  const groups = h('div', { class: 'pr-groups' });
  for (const z of ZONES) {
    const ol = h('ol', null);
    for (const s of SENSORS.filter((x) => x.zone === z.id)) {
      const li = h('li', { dataset: { n: String(s.n) } },
        h('span', { class: 'pr-num', 'aria-hidden': 'true' }, String(s.n)),
        h('span', null, h('span', { class: 'visually-hidden' }, `${s.n}. `), s.name, h('span', { class: 'pr-mol' }, ` · ${s.mol}`)));
      items.set(s.n, li);
      ol.append(li);
    }
    groups.append(h('div', { class: 'pr-group' }, h('p', { class: 'pr-h' }, z.label), ol));
  }
  legendEl.append(groups, h('p', { class: 'pr-note' }, NOTE_TEXT));
  const alarms = h('div', null, h('p', { class: 'pr-h' }, 'Cytokines the macrophage secretes'));
  legendEl.append(alarms);
  ctx.ui.legend([
    { label: 'Inflammatory cytokines: recruit immune cells', color: CORAL, shape: 'circle' },
    { label: 'Interferons (antiviral cytokines): protect neighboring cells', color: CORAL, shape: 'ring' },
  ], { parent: alarms, label: 'Cytokines' });
  ctx.controls.append(legendEl);
  function markLegend(map) {
    for (const [n, li] of items) li.classList.toggle('is-lit', !!map[n]);
  }

  // ---------------------------------------------------------------- tray (suspect buttons)
  const trayEl = h('div', { class: 'pr-tray' });
  const trays = ctx.ui.chips({
    label: 'Offer the macrophage',
    hideLabel: true,
    variant: 'card',
    required: true,
    parent: trayEl,
    options: SUSPECTS.map((s) => ({ value: s.value, label: s.label })),
  });
  for (const [v, b] of trays.buttons) {
    const th = ctx.svg('svg', { class: 'pr-thumb', viewBox: '-27 -21.6 54 43.2', 'aria-hidden': 'true', focusable: 'false' });
    suspectArt(v, th, { r: 19, faceDeg: 200, thumb: true });
    b.prepend(th);
    b.addEventListener('click', () => choose(v), { signal: ctx.signal });
  }
  function placeTray() {
    const inStage = !compact;
    if (inStage === trayInStage) return;
    trayInStage = inStage;
    trayEl.classList.toggle('is-below', !inStage);
    if (inStage) ctx.stage.append(trayEl);
    else ctx.stage.after(trayEl);
  }

  function choose(v) {
    current = v;
    ruptured = false;
    trays.set(v);
    showCard(v);
    markLegend(LIT[v]);
    start(v);
  }
  function rupture() {
    if (current !== 'cancer' || ruptured) return;
    ruptured = true;
    showCard('cancer');
    markLegend(LIT.rupture);
    stopRun();
    start('cancer', { rupture: true, fromRupture: true });
  }

  // ---------------------------------------------------------------- layout changes
  ctx.onResize(({ compact: c }) => {
    if (N && c === compact) return;
    compact = c;
    stopRun();
    buildScene();
    placeTray();
    if (current) start(current, { rupture: ruptured, instant: true });
  });

  return {
    pause() { if (tl && tl.isActive()) { tl.pause(); pausedRun = true; } },
    resume() { if (pausedRun && tl) { pausedRun = false; tl.play(); } },
    destroy() { stopRun(); },
  };
}
