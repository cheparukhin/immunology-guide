// ch10-journey — "Vein to vein" (Chapter 10).
//
// ONE idea: CAR-T is a manufacturing process wrapped around one person (as little as three
// weeks from blood draw to infusion, typically four to seven), and the drug's real expansion
// happens inside the patient, not in the factory.
//
// Layout: a time HUD (ctx.ui.clock, enlarged) whose day counter only ever counts forward
// (FIGURE-AUDIT §4 rule 16); under it a two-row journey rail (hospital / manufacturing facility,
// one shared day axis) showing where the cells are and the two flights (the product is back and
// stored before the lymphodepleting chemotherapy starts, then a short rest before the thaw and
// infusion); below, one large vignette per step.
// Past stations stay on the rail at 35 % opacity. Step 8 draws a log-scale chart (shared/chart.js
// scale + path helpers) that reveals in step with the counter; step 9 compresses its axis to
// months and years ("Time compressed"). One toggle, "What can go wrong", adds amber notes to
// steps 4 and 5. Cells come from the art library; bags, boxes, machines and the patient
// silhouette are simple local props. Everything the timeline shows is a pure function of the
// stepper's timeline (drive()), so Back, dot jumps and reduced motion land in identical states.
import {
  tCell, bCell, nkCell, neutrophil, cancerCell, car, antigen, placeOnMembrane, PALETTE, mix,
} from '../art/index.js';
import { rig, move, approach, dock, polarize, kill, divide, swap, die, drive } from './shared/cell-actions.js';
import { scale, chartRoot, pathD } from './shared/chart.js';

const ID = 'ch10-journey';
const NOTE = 'This example is a fast one. Measured medians run from about a month to seven weeks, depending on the product.';
const MINUS = '−';
const fmtDay = (d) => `${d < 0 ? MINUS : ''}${Math.abs(d)}`;
const clamp01 = (v) => Math.max(0, Math.min(1, v));
const lerp = (a, b, t) => a + (b - a) * t;
const seg = (p, a, b) => clamp01((p - a) / (b - a));
const easeIO = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
const f1 = (v) => (Math.round(v * 10) / 10).toString();

// Where each step sits on the rail (H = hospital row, F = facility row).
const STATIONS = [
  { d0: -21, row: 'H' }, { d0: -20, row: 'F' }, { d0: -18, row: 'F' }, { d0: -17, d1: -6, row: 'F' },
  { d0: -5.5, d1: -3, row: 'H' }, { d0: -2, d1: -1, row: 'H' }, { d0: 0, row: 'H', big: true }, { d0: 3, d1: 14, row: 'H' }, { d0: 28, row: 'H' },
];
// Clock track per step: the day counted during that step (always forward).
const TRACK = [[-21, -21], [-21, -20], [-20, -18], [-18, -6], [-6, -3], [-3, -1], [-1, 0], [0, 14], [14, 1095]];   // step 5 = days −6…−3, step 6 = −2…−1
const YEARS3 = 1095;

// Step-9 phases (fractions of its driver): A day 14→28 · B compress the axis · C months → years.
function phase9(p) {
  const a = easeIO(seg(p, 0, 0.26));
  const k = easeIO(seg(p, 0.32, 0.52));
  const c = seg(p, 0.56, 1);
  const day = c > 0 ? 28 * (YEARS3 / 28) ** easeIO(c) : 14 + 14 * a;
  return { day, k };
}
function clockText(day) {
  if (day <= 28.5) return `Day ${fmtDay(Math.round(day))}`;
  if (day >= YEARS3 - 1) return 'Years later';
  if (day < 365) return `Month ${Math.max(2, Math.round(day / 30.44))}`;
  return `Year ${Math.floor(day / 365)}`;
}

// Illustrative curves (fold change since day 0). Not patient data; the panel says so.
const CART = [[0, 1], [2, 2.2], [4, 9], [6, 40], [8, 150], [10, 300], [12, 250], [14, 150], [17, 70], [21, 35], [24, 22], [28, 15]];
const CART_LATE = [[28, 15], [40, 10], [60, 6], [90, 4.2], [180, 3.2], [365, 2.6], [730, 2.2], [1095, 2.1]];
const TUMOR = [[0, 1], [2, 0.95], [4, 0.75], [6, 0.45], [8, 0.2], [10, 0.08], [12, 0.04], [14, 0.022], [17, 0.013], [20, 0.0102]];
const BCELLS = [[0, 1], [3, 0.5], [6, 0.12], [9, 0.04], [12, 0.02], [15, 0.0145], [28, 0.0135], [60, 0.0135], [150, 0.0145], [210, 0.03], [300, 0.14], [365, 0.3], [540, 0.6], [730, 0.8], [1095, 0.9]];

const CSS = `
[data-figure="${ID}"] .jr-note { margin: -0.15rem 0 0.7rem; font: 450 14px/1.5 var(--font-ui); color: var(--ink-2); max-width: 62ch; text-wrap: pretty; }
[data-figure="${ID}"] .jr-note small { display: block; margin-top: 2px; font-size: 12px; color: var(--ink-3); }
[data-figure="${ID}"] .jr-note a { color: inherit; text-decoration: underline; text-decoration-color: var(--rule-strong, var(--rule)); text-underline-offset: 2px; }
[data-figure="${ID}"] .fig-clock { padding: 0.42rem 0.85rem 0.42rem 0.62rem; gap: 0.5rem; }
[data-figure="${ID}"] .fig-clock__value { font-size: 1.45rem; font-weight: 650; letter-spacing: -0.01em; }
[data-figure="${ID}"] .fig-clock__icon svg { width: 1.15rem; height: 1.15rem; }
[data-figure="${ID}"].is-compact .fig-clock__value { font-size: 1.2rem; }
[data-figure="${ID}"] .jr-svg { touch-action: pan-y; }
[data-figure="${ID}"] svg .jr-zone { fill: var(--fg-3); }
[data-figure="${ID}"] svg .jr-lbl { fill: var(--fg); }
[data-figure="${ID}"] svg .jr-sub { fill: var(--fg-2); }
[data-figure="${ID}"] svg .jr-warn-t { fill: var(--fg); font-weight: 520; }
[data-figure="${ID}"] svg .jr-num { font-variant-numeric: tabular-nums; }
`;
function injectCSS() {
  if (document.getElementById(`${ID}-css`)) return;
  const s = document.createElement('style');
  s.id = `${ID}-css`;
  s.textContent = CSS;
  document.head.append(s);
}

export default function mount(fig, ctx) {
  injectCSS();
  const { gsap } = ctx;
  const S = (tag, attrs, parent) => ctx.svg(tag, attrs, parent);

  // Standing note + source line under the title.
  if (!fig.querySelector('.jr-note')) {
    const note = ctx.h('p', { class: 'jr-note' }, NOTE,
      ctx.h('small', null, 'Medians: Locke et al., ',
        ctx.h('em', null, 'Blood Advances'), ' 2025 (',
        ctx.h('a', { href: '#src-30' }, 'source 30'),
        '). The day-by-day rail is an illustrative example, not measured data.'));
    fig.querySelector('.fig__head')?.after(note);
  }

  ctx.setAspect(960 / 548, 400 / 750);
  const svg = ctx.createSVG({ viewBox: '0 0 960 548', className: 'jr-svg' });
  const clock = ctx.ui.clock({ value: 'Day −21' });
  ctx.tag('Illustrative');
  const tcTag = ctx.tag('Time compressed');
  tcTag.el.hidden = true;

  let compact = ctx.compact;
  let warn = false;
  let L = null;                 // layout constants
  let R = null;                 // rail handles
  let CH = null;                // chart handles
  let V = [];                   // vignette groups
  let prog = [];                // per-step driver progress (0..1)
  let measureProbe = null;

  // ------------------------------------------------------------------ helpers
  const T = (parent, x, y, text, cls = 't-label jr-lbl', extra = {}) => S('text', { x, y, class: cls, text, ...extra }, parent);
  const lines = (parent, x, y, arr, cls = 't-small jr-sub', dy = 16, extra = {}) => {
    const t = S('text', { x, y, class: cls, ...extra }, parent);
    arr.forEach((ln, i) => S('tspan', { x, dy: i ? dy : 0, text: ln }, t));
    return t;
  };
  const G = (parent, attrs = {}) => S('g', attrs, parent);
  const at = (x, y, s = 1) => (s === 1 ? `translate(${f1(x)} ${f1(y)})` : `translate(${f1(x)} ${f1(y)}) scale(${s})`);
  const measure = (text, cls = 't-small') => {
    if (!measureProbe || !measureProbe.isConnected) measureProbe = S('text', { x: -9999, y: -9999, 'aria-hidden': 'true' }, svg);
    measureProbe.setAttribute('class', cls);
    measureProbe.textContent = text;
    let w = 0;
    try { w = measureProbe.getComputedTextLength(); } catch (e) { /* not rendered */ }
    return w || text.length * 7;
  };
  const wrap = (text, maxW, cls = 't-small') => {
    const words = text.split(' ');
    const out = [];
    let cur = '';
    for (const w of words) {
      const t = cur ? `${cur} ${w}` : w;
      if (measure(t, cls) > maxW && cur) { out.push(cur); cur = w; } else cur = t;
    }
    if (cur) out.push(cur);
    return out;
  };
  const fadeIn = (tl, el, pos, d = 0.5) => tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: d, ease: 'so.out' }, pos);
  const fadeOut = (tl, el, pos, d = 0.45) => tl.fromTo(el, { opacity: 1 }, { opacity: 0, duration: d, ease: 'so.in' }, pos);
  const hide = (...els) => els.forEach((e) => e && gsap.set(e, { opacity: 0 }));
  const col = () => ctx.colors;
  const stage = () => ctx.artStage;
  const ink = (a) => `color-mix(in srgb, var(--fg) ${a}%, transparent)`;
  const tint = (hex, a) => `color-mix(in srgb, ${hex} ${a}%, var(--halo))`;

  // ------------------------------------------------------------------ props (single-use, local)
  // A group positioned by an attribute transform, with an inner group GSAP may move (x/y/scale).
  const nest = (parent, x, y) => {
    const outer = G(parent, { transform: at(x, y) });
    return { outer, inner: G(outer, {}) };
  };
  function snowflake(parent, x, y, r, color = 'var(--fg-2)') {
    const g = G(parent, { transform: at(x, y), style: `stroke:${color};stroke-width:1.6;stroke-linecap:round;fill:none` });
    for (let k = 0; k < 3; k++) {
      const a = (k * Math.PI) / 3;
      const c = Math.cos(a) * r;
      const s = Math.sin(a) * r;
      S('path', { d: `M${f1(-c)} ${f1(-s)}L${f1(c)} ${f1(s)}` }, g);
      for (const e of [-1, 1]) {
        const bx = e * c * 0.62;
        const by = e * s * 0.62;
        const n = a + Math.PI / 2;
        const tx = Math.cos(n) * r * 0.28;
        const ty = Math.sin(n) * r * 0.28;
        S('path', { d: `M${f1(bx + e * c * 0.25 + tx)} ${f1(by + e * s * 0.25 + ty)}L${f1(bx)} ${f1(by)}L${f1(bx + e * c * 0.25 - tx)} ${f1(by + e * s * 0.25 - ty)}` }, g);
      }
    }
    return g;
  }
  // A seated person in a treatment chair, facing right; no face. Returns { g, hand }.
  function patient(parent, x, y, s = 1) {
    const g = G(parent, { transform: at(x, y, s) });
    const chair = G(g, { style: `fill:${ink(11)}` });
    S('rect', { x: -86, y: -132, width: 22, height: 136, rx: 11, transform: 'rotate(-12 -75 0)' }, chair);
    S('rect', { x: -74, y: -8, width: 130, height: 18, rx: 9 }, chair);
    S('rect', { x: -6, y: -62, width: 66, height: 11, rx: 5.5 }, chair);
    S('rect', { x: 44, y: -54, width: 8, height: 48, rx: 4 }, chair);
    S('path', { d: 'M-52 10 L-60 62 M38 10 L46 62', style: `stroke:${ink(13)};stroke-width:6;stroke-linecap:round;fill:none` }, chair);
    const body = G(g, { style: 'fill:var(--fg-3)', opacity: 0.45 });
    S('circle', { cx: -38, cy: -150, r: 18 }, body);
    S('path', { d: 'M-66 -120 Q-44 -134 -22 -120 L-12 -20 Q-34 -6 -58 -12 Z' }, body);
    S('rect', { x: -50, y: -32, width: 100, height: 28, rx: 14 }, body);
    S('rect', { x: 32, y: -26, width: 24, height: 88, rx: 12, transform: 'rotate(-8 44 -22)' }, body);
    S('path', { d: 'M-50 -110 L-14 -72 L40 -74', style: 'fill:none;stroke:var(--fg-3);stroke-width:16;stroke-linecap:round;stroke-linejoin:round' }, body);
    return { g, hand: [x + 44 * s, y - 74 * s] };
  }
  // IV-style bag. Content level 0..1. Returns { g, fill, frost, h, w }.
  let uid = 0;
  function bag(parent, x, y, w, h, color, { level = 0.8, frost = false, port = true } = {}) {
    const g = G(parent, { transform: at(x, y) });
    const r = Math.min(w, h) * 0.28;
    const d = `M${-w / 2 + r} ${-h / 2}H${w / 2 - r}Q${w / 2} ${-h / 2} ${w / 2} ${-h / 2 + r}V${h / 2 - r}Q${w / 2} ${h / 2} ${w / 2 - r} ${h / 2}H${-w / 2 + r}Q${-w / 2} ${h / 2} ${-w / 2} ${h / 2 - r}V${-h / 2 + r}Q${-w / 2} ${-h / 2} ${-w / 2 + r} ${-h / 2}Z`;
    const id = `jr-clip-${ctx.id}-${uid++}`;
    const cp = S('clipPath', { id }, svg.defs);
    S('path', { d }, cp);
    S('path', { d, style: 'fill:var(--halo)' }, g);
    const fill = S('rect', { x: -w / 2, y: h / 2 - h * level, width: w, height: h * level, style: `fill:${color}`, 'clip-path': `url(#${id})` }, g);
    S('path', { d, style: 'fill:none;stroke:var(--fg-3);stroke-width:1.5' }, g);
    S('rect', { x: -w * 0.18, y: -h / 2 - 7, width: w * 0.36, height: 7, rx: 3, style: `fill:${ink(14)}` }, g);
    if (port) S('rect', { x: -3, y: h / 2, width: 6, height: 9, rx: 2, style: `fill:${ink(20)}` }, g);
    let fr = null;
    if (frost) {
      fr = G(g, {});
      S('path', { d, style: `fill:${ink(5)};stroke:var(--fg-2);stroke-width:1;stroke-dasharray:1.5 3` }, fr);
      snowflake(fr, 0, 0, Math.min(w, h) * 0.22, 'var(--fg-2)');
      const rr = ctx.random(w * 7 + h);
      for (let i = 0; i < 9; i++) S('circle', { cx: f1(rr.range(-w / 2 + 5, w / 2 - 5)), cy: f1(rr.range(-h / 2 + 5, h / 2 - 5)), r: 1.4, style: 'fill:var(--fg-2)', opacity: 0.6 }, fr);
    }
    return { g, fill, frost: fr, h, w };
  }
  function clipRect(x, y, w, h, rx) {
    const id = `jr-clip-${ctx.id}-${uid++}`;
    const cp = S('clipPath', { id }, svg.defs);
    S('rect', { x, y, width: w, height: h, rx }, cp);
    return `url(#${id})`;
  }
  function coldBox(parent, x, y, s = 1) {
    const g = G(parent, { transform: at(x, y, s) });
    S('rect', { x: -56, y: -38, width: 112, height: 76, rx: 9, style: `fill:${tint('#9FC3D9', 22)};stroke:var(--fg-3);stroke-width:1.5` }, g);
    S('rect', { x: -60, y: -50, width: 120, height: 16, rx: 6, style: `fill:${tint('#9FC3D9', 36)};stroke:var(--fg-3);stroke-width:1.5` }, g);
    S('path', { d: 'M-16 -50 V-58 H16 V-50', style: 'fill:none;stroke:var(--fg-3);stroke-width:2' }, g);
    snowflake(g, 0, 2, 17, 'var(--fg-2)');
    return g;
  }
  function plane(parent, x, y, size = 24) {
    const g = G(parent, { transform: at(x, y) });
    const ic = ctx.iconSVG('plane', { x: 0, y: 0, size, color: 'var(--fg-2)' });
    ic.setAttribute('transform', `rotate(90) ${ic.getAttribute('transform')}`);
    g.append(ic);
    return g;
  }
  function carT(r, seed, state = 'activated', { carSize, count } = {}) {
    const art = tCell({ variant: 'cd8', r, state, seed, polarity: 0, receptors: false, stage: stage() });
    const sz = carSize ?? Math.max(10, Math.min(20, r * 0.46));
    placeOnMembrane(art, (o) => car({ ...o, size: sz }), { count: count ?? (r > 30 ? 9 : r > 16 ? 6 : 4), size: sz, seed, offset: 0.12, layer: 'cars' });
    return art;
  }
  function lymph(kind, r, seed) {
    const st = stage();
    if (kind === 't') return tCell({ variant: 'cd8', r, seed, stage: st });
    if (kind === 'b') return bCell({ r, seed, stage: st });
    if (kind === 'nk') return nkCell({ r, seed, stage: st });
    return neutrophil({ r, seed, stage: st });
  }
  const zoneLabel = (parent, text) => T(parent, compact ? 12 : 30, M().y0 + 12, text, 't-caps jr-zone');
  const facilityWash = (parent) => S('rect', { x: M().x0, y: M().y0 - 4, width: M().x1 - M().x0, height: M().y1 - M().y0, rx: 16, style: `fill:${ink(3)}` }, parent);
  function warnBox(parent, x, y, text, maxW, anchor = 'start') {
    const ls = wrap(text, maxW - 46);
    const w = Math.max(...ls.map((l) => measure(l))) + 48;
    const h = ls.length * 17 + 15;
    const x0 = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x;
    const g = G(parent, {});
    S('rect', { x: x0, y, width: w, height: h, rx: 9, style: 'fill:color-mix(in srgb, var(--partial) 11%, var(--halo));stroke:var(--partial);stroke-width:1.4' }, g);
    const tri = G(g, { transform: at(x0 + 18, y + 17), style: 'fill:none;stroke:var(--partial);stroke-width:1.7;stroke-linejoin:round;stroke-linecap:round' });
    S('path', { d: 'M0 -8 L8 6 H-8 Z M0 -2.5 V1.5 M0 3.8 V4' }, tri);
    lines(g, x0 + 34, y + 21, ls, 't-small jr-warn-t', 17);
    return g;
  }
  function chip(parent, x, y, text, kind = 'yes') {
    const w = measure(text) + 46;
    const { inner } = nest(parent, x, y);
    S('rect', { x: 0, y: -15, width: w, height: 30, rx: 15, style: `fill:var(--halo);stroke:${kind === 'yes' ? 'var(--line)' : 'var(--partial)'};stroke-width:1.3` }, inner);
    ctx.badgeSVG(kind, { x: 16, y: 0, r: 9.5 }, inner);
    T(inner, 32, 4.6, text, 't-small jr-lbl');
    return inner;
  }
  function cancer(r, seed) {
    const a = cancerCell({ r, seed, mhc: 0, stage: stage() });
    placeOnMembrane(a, (o) => antigen({ ...o, shape: 'circle' }), { count: 7, size: r * 0.5, seed: seed + 3, layer: 'antigens' });
    return a;
  }

  // ------------------------------------------------------------------ layouts
  function layout() {
    return compact
      ? {
        vb: [400, 750],
        rail: { x0: 94, x1: 338, sx0: 352, sx1: 390, yH: 80, yF: 102, lblX: 8, tickY: 131 },
        main: { x0: 6, x1: 394, y0: 146, y1: 744 },
      }
      : {
        vb: [960, 548],
        rail: { x0: 150, x1: 836, sx0: 862, sx1: 934, yH: 72, yF: 98, lblX: 24, tickY: 126 },
        main: { x0: 20, x1: 940, y0: 140, y1: 540 },
      };
  }
  const dayX = (d) => {
    const r = L.rail;
    if (d <= 28) return r.x0 + ((d + 21) / 49) * (r.x1 - r.x0);
    return r.sx0 + (r.sx1 - r.sx0) * clamp01(Math.log(d / 28) / Math.log(YEARS3 / 28));
  };
  const M = () => L.main;

  // ------------------------------------------------------------------ rail
  function drawRail(root) {
    const r = L.rail;
    const g = G(root, { class: 'jr-rail' });
    T(g, r.lblX, r.yH + 4, 'HOSPITAL', 't-caps jr-zone');
    T(g, r.lblX, r.yF + 4, 'FACILITY', 't-caps jr-zone');
    S('line', { x1: r.x0, x2: r.x1, y1: r.yH, y2: r.yH, style: 'stroke:var(--line);stroke-width:1.2' }, g);
    S('line', { x1: dayX(-20), x2: dayX(-6), y1: r.yF, y2: r.yF, style: 'stroke:var(--line);stroke-width:1.2' }, g);
    for (const d of [-21, -14, -7, 0, 7, 14, 21, 28]) {
      const x = dayX(d);
      S('line', { x1: x, x2: x, y1: r.yF + 8, y2: r.yF + (d === 0 ? 15 : 12), style: `stroke:var(--fg-3);stroke-width:${d === 0 ? 1.5 : 1}` }, g);
      T(g, x, r.tickY, fmtDay(d), `t-small t-mid jr-num ${d === 0 ? 'jr-lbl' : 'jr-sub'}`);
    }
    T(g, r.lblX, r.tickY, 'DAY', 't-caps jr-zone');
    // The cells' route: hospital → (flight) → facility → (flight) → hospital.
    const route = `M${dayX(-21)} ${r.yH}L${dayX(-20)} ${r.yF}L${dayX(-6)} ${r.yF}L${dayX(-5.5)} ${r.yH}L${dayX(28)} ${r.yH}`;
    S('path', { d: route, style: 'fill:none;stroke:var(--fg-3);stroke-width:1.4;stroke-dasharray:3 4;opacity:.7' }, g);
    const id = `jr-clip-${ctx.id}-${uid++}`;
    const cp = S('clipPath', { id }, svg.defs);
    const clip = S('rect', { x: r.x0 - 6, y: r.yH - 20, width: 0, height: r.yF - r.yH + 40 }, cp);
    S('path', { d: route, 'clip-path': `url(#${id})`, style: `fill:none;stroke:${col().stroke.cd8};stroke-width:3;stroke-linejoin:round;stroke-linecap:round` }, g);
    // Planes on the two legs. The product lands and is stored before the chemotherapy starts.
    plane(g, (dayX(-21) + dayX(-20)) / 2 + (compact ? 11 : 14), (r.yH + r.yF) / 2, compact ? 16 : 19);
    plane(g, (dayX(-6) + dayX(-5.5)) / 2 + (compact ? 11 : 14), (r.yH + r.yF) / 2, compact ? 16 : 19);
    const st = STATIONS.map((s) => {
      const y = s.row === 'H' ? r.yH : r.yF;
      const sg = G(g, {});
      let mark;
      let halo;
      if (s.d1 != null) {
        const x0 = dayX(s.d0);
        const x1 = dayX(s.d1);
        halo = S('rect', { x: x0 - 8, y: y - 8.5, width: x1 - x0 + 16, height: 17, rx: 8.5, style: `fill:${col().stroke.cd8}`, opacity: 0 }, sg);
        mark = S('rect', { x: x0 - 4, y: y - 4.5, width: x1 - x0 + 8, height: 9, rx: 4.5 }, sg);
      } else {
        halo = S('circle', { cx: dayX(s.d0), cy: y, r: 10, style: `fill:${col().stroke.cd8}`, opacity: 0 }, sg);
        mark = S('circle', { cx: dayX(s.d0), cy: y, r: s.big ? 6 : 4.6 }, sg);
      }
      return { g: sg, mark, halo };
    });
    const stub = G(g, { opacity: 0 });
    S('path', { d: `M${r.x1 + 9} ${r.yH - 6}l-4 12M${r.x1 + 15} ${r.yH - 6}l-4 12`, style: 'stroke:var(--fg-3);stroke-width:1.3' }, stub);
    S('line', { x1: r.sx0, x2: r.sx1, y1: r.yH, y2: r.yH, style: 'stroke:var(--line);stroke-width:1.2' }, stub);
    T(stub, r.sx1, r.tickY, 'years', 't-small t-end jr-sub');
    const stubRoute = S('line', { x1: r.sx0, x2: r.sx0, y1: r.yH, y2: r.yH, style: `stroke:${col().stroke.cd8};stroke-width:3;stroke-linecap:round` }, stub);
    const head = G(g, { opacity: 0 });
    S('line', { x1: 0, x2: 0, y1: r.yH - 14, y2: r.yF + 8, style: 'stroke:var(--accent);stroke-width:1.6' }, head);
    S('path', { d: `M-5 ${r.yH - 19} H5 L0 ${r.yH - 13} Z`, style: 'fill:var(--accent)' }, head);
    return { g, st, clipRect: clip, head, stub, stubRoute };
  }

  // ------------------------------------------------------------------ chart (steps 8–9)
  function drawChart(root) {
    const C0 = compact
      ? { x0: 62, x1: 382, y0: 400, y1: 618 }
      : { x0: 486, x1: 914, y0: 194, y1: 440 };
    const g = chartRoot(root);
    const ys = scale({ type: 'log', domain: [0.01, 1000], range: [C0.y1, C0.y0] });
    const xsFor = (k) => {
      const xa = lerp(C0.x1, C0.x0 + (C0.x1 - C0.x0) * 0.4, k);
      const xb = xa + 16 * k;
      return (d) => (d <= 28 ? C0.x0 + (Math.max(0, d) / 28) * (xa - C0.x0) : xb + (C0.x1 - xb) * clamp01(Math.log(d / 28) / Math.log(YEARS3 / 28)));
    };
    T(g, C0.x0 - 52, C0.y0 - 26, 'CHANGE SINCE DAY 0 (LOG SCALE)', 't-caps jr-zone');
    const yTicks = [[0.01, '÷100'], [0.1, '÷10'], [1, '×1'], [10, '×10'], [100, '×100'], [1000, '×1,000']];
    for (const [v, lab] of yTicks) {
      S('line', { class: `ck-grid${v === 1 ? ' is-strong' : ''}`, x1: C0.x0, x2: C0.x1, y1: ys(v), y2: ys(v) }, g);
      T(g, C0.x0 - 8, ys(v) + 4.5, lab, 't-small t-end jr-num ck-tick-label');
    }
    // Fever band: the first week.
    const band = S('rect', { y: C0.y0, height: C0.y1 - C0.y0, style: 'fill:color-mix(in srgb, var(--partial) 12%, transparent)' }, g);
    const bandLbl = G(g, {});
    bandLbl.append(ctx.iconSVG('thermometer', { x: 0, y: -24, size: 18, color: 'var(--partial)' }));
    lines(bandLbl, -8, -2, ['When fever', 'usually starts'], 't-small jr-sub t-halo', 15);
    S('line', { class: 'ck-axis', x1: C0.x0, x2: C0.x1, y1: C0.y1, y2: C0.y1 }, g);
    const dayTicks = [0, 7, 14, 21, 28].map((d) => ({
      d, line: S('line', { y1: C0.y1, y2: C0.y1 + 5, class: 'ck-axis' }, g),
      text: T(g, 0, C0.y1 + 20, d === 0 ? 'Day 0' : String(d), 't-small t-mid jr-num ck-tick-label'),
    }));
    const lateTicks = [[90, 'Month 3'], [365, 'Year 1'], [1095, 'Year 3']].map(([d, lab]) => ({
      d, line: S('line', { y1: C0.y1, y2: C0.y1 + 5, class: 'ck-axis' }, g),
      text: T(g, 0, C0.y1 + 20, lab, `t-small ${d === YEARS3 ? 't-end' : 't-mid'} jr-num ck-tick-label`),
    }));
    const brk = S('path', { style: 'stroke:var(--fg-2);stroke-width:1.3;fill:none' }, g);
    const resp = G(g, { opacity: 0 });
    const respLine = S('line', { y1: C0.y0 - 4, y2: C0.y1, style: 'stroke:var(--fg-2);stroke-width:1;stroke-dasharray:3 3' }, resp);
    const respText = T(resp, 0, C0.y0 - 9, 'Response check', 't-small t-mid jr-lbl t-halo');
    const id = `jr-clip-${ctx.id}-${uid++}`;
    const cp = S('clipPath', { id }, svg.defs);
    const clip = S('rect', { x: C0.x0 - 6, y: C0.y0 - 30, width: 0, height: C0.y1 - C0.y0 + 36 }, cp);
    const head = S('line', { y1: C0.y0, y2: C0.y1, style: 'stroke:var(--accent);stroke-width:1.2', opacity: 0 }, g);
    const lg = G(g, { 'clip-path': `url(#${id})` });
    const bPath = S('path', { style: `fill:none;stroke:${col().stroke.bcell};stroke-width:2.6;stroke-linecap:round`, opacity: 0 }, lg);
    const tPath = S('path', { style: `fill:none;stroke:${col().stroke.cancer};stroke-width:3;stroke-linecap:round` }, lg);
    const cPath = S('path', { style: `fill:none;stroke:${col().stroke.cd8};stroke-width:3.4;stroke-linecap:round` }, lg);
    const cLate = S('path', { style: `fill:none;stroke:${col().stroke.cd8};stroke-width:2.2;stroke-dasharray:5 4;stroke-linecap:round` }, lg);
    const lC = T(g, 0, 0, 'CAR-T cells in blood', 't-label t-end t-halo', { style: `fill:${col().stroke.cd8}`, opacity: 0 });
    const lT = T(g, 0, 0, 'Cancer cells', 't-label t-halo', { style: `fill:${col().stroke.cancer}`, opacity: 0 });
    const lTlead = S('path', { class: 'leader', opacity: 0 }, g);
    const lB = lines(g, 0, 0, ['Normal B cells:', 'gone for months,', 'usually return'], 't-small t-halo', 15, { style: `fill:${col().stroke.bcell}`, opacity: 0 });
    const lP = lines(g, 0, 0, ['Still detectable', 'in some patients'], 't-small t-end t-halo', 15, { style: `fill:${col().stroke.cd8}`, opacity: 0 });
    T(g, C0.x1, C0.y1 + 42, compact ? 'Shapes illustrative, not patient data.' : 'Curve shapes are illustrative, not patient data.', 't-small t-end t-muted');

    const P = (pts, xs) => pathD(pts.map(([d, v]) => [xs(d), ys(v)]), 'monotone');
    let lastK = -1;
    let xs = xsFor(0);
    function render(day, k) {
      if (k !== lastK) {
        lastK = k;
        xs = xsFor(k);
        cPath.setAttribute('d', P(CART, xs));
        cLate.setAttribute('d', P(CART_LATE, xs));
        tPath.setAttribute('d', P(TUMOR, xs));
        bPath.setAttribute('d', P(BCELLS, xs));
        band.setAttribute('x', C0.x0);
        band.setAttribute('width', f1(xs(7) - C0.x0));
        bandLbl.setAttribute('transform', at(C0.x0 + 18, C0.y1 - 30));
        bandLbl.setAttribute('opacity', f1(1 - k));
        for (const t of dayTicks) {
          const x = xs(t.d);
          t.line.setAttribute('x1', f1(x)); t.line.setAttribute('x2', f1(x));
          const keep = t.d === 0 || t.d === 28;
          t.text.setAttribute('x', f1(t.d === 0 ? lerp(x, C0.x0 + 14, k) : x));
          t.text.setAttribute('opacity', f1(keep ? 1 : 1 - k));
          t.line.setAttribute('opacity', f1(keep ? 1 : 1 - k * 0.6));
        }
        for (const t of lateTicks) {
          const x = xs(t.d);
          t.line.setAttribute('x1', f1(x)); t.line.setAttribute('x2', f1(x));
          t.text.setAttribute('x', f1(t.d === YEARS3 ? C0.x1 + (compact ? 10 : 2) : x));
          // Phones: "Year 1" would collide with "Year 3" (and "Month 3"); keep its tick only.
          t.text.setAttribute('opacity', f1(compact && t.d === 365 ? 0 : k));
          t.line.setAttribute('opacity', f1(k));
        }
        const xa = xs(28);
        brk.setAttribute('d', `M${f1(xa + 6)} ${C0.y1 - 6}l-4 12M${f1(xa + 12)} ${C0.y1 - 6}l-4 12`);
        brk.setAttribute('opacity', f1(k));
        respLine.setAttribute('x1', f1(xa)); respLine.setAttribute('x2', f1(xa));
        respText.setAttribute('x', f1(Math.min(xa, C0.x1 - 52)));
        bPath.setAttribute('opacity', f1(k));
        // CAR-T label: left of the peak, sliding to the empty top right once compressed.
        lC.setAttribute('x', f1(lerp(xs(9.2) - 6, C0.x1, k)));
        lC.setAttribute('y', f1(lerp(ys(300) + 4, ys(400), k)));
        lT.setAttribute('x', f1(lerp(xs(9.5) + 4, xs(28) + 18, k)));
        lT.setAttribute('y', f1(lerp(ys(0.22), ys(0.04), k)));
        lTlead.setAttribute('d', `M${f1(xs(28) + 14)} ${f1(ys(0.034))}L${f1(xs(19.6))} ${f1(ys(0.0112))}`);
        lTlead.setAttribute('opacity', f1(k));
        lB.setAttribute('transform', at(xs(compact ? 32 : 34), ys(0.55)));
        lP.setAttribute('transform', at(C0.x1, ys(26)));
      }
      const x = day < 0 ? C0.x0 - 6 : xs(day);
      clip.setAttribute('width', f1(Math.max(0, x - (C0.x0 - 6))));
      head.setAttribute('x1', f1(x)); head.setAttribute('x2', f1(x));
      // Hidden while resting at day 14 (end of step 8), where it would cut through the "Cancer cells" label.
      head.setAttribute('opacity', day >= 0 && day < 27.5 && Math.abs(day - 14) > 0.15 ? 0.85 : 0);
      lC.setAttribute('opacity', f1(seg(day, 7, 9)));
      lT.setAttribute('opacity', f1(seg(day, 6, 8)));
      lTlead.style.visibility = day >= 27 ? 'visible' : 'hidden';
      resp.setAttribute('opacity', f1(seg(day, 25, 28)));
      lB.setAttribute('opacity', f1(seg(day, 330, 420) * k));
      lP.setAttribute('opacity', f1(seg(day, 500, 650) * k));
    }
    return { g, render };
  }

  // ------------------------------------------------------------------ vignettes
  // Each builder returns { g, steps(tl) }: the step's own tweens, after the fade-in.
  function v1(root) {
    const g = G(root, {});
    const c = compact;
    zoneLabel(g, 'HOSPITAL · APHERESIS');
    const pat = patient(g, c ? 104 : 196, c ? 350 : 404, c ? 0.82 : 1);
    const mx = c ? 268 : 452;
    const my = c ? 300 : 312;
    const ms = c ? 0.8 : 1;
    const mach = G(g, { transform: at(mx, my, ms) });
    S('rect', { x: -64, y: -84, width: 128, height: 168, rx: 12, style: `fill:${ink(5)};stroke:var(--fg-3);stroke-width:1.5` }, mach);
    S('rect', { x: -46, y: -70, width: 92, height: 30, rx: 5, style: `fill:${ink(10)}` }, mach);
    const drum = G(mach, { transform: at(0, 12) });
    S('circle', { r: 34, style: 'fill:var(--halo);stroke:var(--fg-3);stroke-width:1.5' }, drum);
    // Spinning separation bowl: red cells outside, a pale ring of white cells, plasma inside.
    const bowl = G(drum, {});
    S('circle', { r: 25, style: `fill:${tint(PALETTE.rbc, 55)}` }, bowl);
    S('circle', { r: 15, style: `fill:${tint('#F3E3C8', 95)}` }, bowl);
    S('circle', { r: 11, style: `fill:${tint('#F2DC9A', 55)}` }, bowl);
    S('circle', { cx: 0, cy: -20, r: 2.2, style: 'fill:var(--halo)' }, bowl);
    S('circle', { cx: -34, cy: 64, r: 10, style: 'fill:none;stroke:var(--fg-3);stroke-width:1.5' }, mach);
    S('circle', { cx: 34, cy: 64, r: 10, style: 'fill:none;stroke:var(--fg-3);stroke-width:1.5' }, mach);
    ambient(gsap.to(bowl, { rotation: 360, svgOrigin: '0 0', duration: 3.2, ease: 'none', repeat: -1 }));
    T(g, mx, my + 84 * ms + 24, 'Apheresis machine', 't-label t-mid jr-lbl');
    const [hx, hy] = pat.hand;
    const inX = mx - 64 * ms;
    const tubes = G(g, {});
    const tOut = S('path', { d: `M${hx + 4} ${hy - 4} C${hx + 40} ${hy - 30}, ${inX - 40} ${my - 40}, ${inX} ${my - 34 * ms}`, style: `fill:none;stroke:${PALETTE.rbc};stroke-width:3.2;stroke-linecap:round` }, tubes);
    const tBack = S('path', { d: `M${inX} ${my + 24 * ms} C${inX - 40} ${my + 30}, ${hx + 40} ${hy + 26}, ${hx + 4} ${hy + 6}`, style: `fill:none;stroke:${mix(PALETTE.rbc, '#ffffff', 0.3)};stroke-width:3.2;stroke-linecap:round` }, tubes);
    for (const [t, dir] of [[tOut, 1], [tBack, 1]]) {
      const flow = t.cloneNode();
      flow.setAttribute('style', 'fill:none;stroke:var(--halo);stroke-width:1.4;stroke-dasharray:2 10;stroke-linecap:round;opacity:.85');
      tubes.append(flow);
      ambient(gsap.fromTo(flow, { strokeDashoffset: 24 * dir }, { strokeDashoffset: 0, duration: 1.1, ease: 'none', repeat: -1 }));
    }
    const mid = (hx + inX) / 2;
    T(g, mid, Math.min(hy, my) - (c ? 40 : 36), 'Blood out', 't-small t-mid jr-sub t-halo');
    T(g, mid, Math.max(hy, my) + (c ? 52 : 50), 'Rest returned', 't-small t-mid jr-sub t-halo');
    const bx = c ? 354 : 584;
    const by = c ? 290 : 300;
    S('path', { d: `M${mx + 64 * ms} ${my - 46 * ms} C${bx - 10} ${my - 70}, ${bx} ${by - 80}, ${bx} ${by - (c ? 38 : 47)}`, style: `fill:none;stroke:${tint('#E9C9A1', 85)};stroke-width:3;stroke-linecap:round` }, g);
    const b = bag(g, bx, by, c ? 40 : 52, c ? 62 : 80, tint(mix('#E9C9A1', PALETTE.rbc, 0.3), 75), { level: 0.08 });
    T(g, bx, by + (c ? 54 : 66), 'White cells', 't-label t-mid jr-lbl');
    // Inset: the bag holds a mixture.
    const ix = c ? 200 : 788;
    const iy = c ? 548 : 312;
    const ir = c ? 104 : 112;
    const { outer: insetO, inner: inset } = nest(g, ix, iy);
    S('circle', { r: ir, style: 'fill:var(--halo);stroke:var(--fg-3);stroke-width:1.5' }, inset);
    if (!c) S('line', { x1: -ir * 0.97, y1: -ir * 0.2, x2: bx + 30 - ix, y2: by - 10 - iy, style: 'stroke:var(--fg-3);stroke-width:1;stroke-dasharray:3 3' }, inset);
    const kinds = [['t', -50, -40, 1], ['t', 16, -56, 2], ['t', 50, 2, 3], ['t', -16, 26, 4], ['b', -66, 28, 5], ['nk', 26, 60, 6], ['n', 66, -46, 7]];
    const k = c ? 0.92 : 1;
    const cellEls = kinds.map(([kk, x, y, s]) => {
      const a = lymph(kk, kk === 'n' ? 25 * k : 22 * k, s + 20);
      a.setAttribute('transform', at(x * k, y * k));
      inset.append(a);
      return a;
    });
    T(inset, 0, -ir - 12, 'A MIXTURE', 't-caps t-mid jr-zone');
    const tLbl = G(inset, {});
    S('path', { class: 'leader', d: `M${-16 * k} ${26 * k + 22}L${-40} ${ir + 16}` }, tLbl);
    T(tLbl, -44, ir + 30, 'T cells', 't-label t-end jr-lbl');
    const oLbl = G(inset, {});
    S('path', { class: 'leader', d: `M${26 * k} ${60 * k + 22}L${44} ${ir + 16}` }, oLbl);
    T(oLbl, 48, ir + 30, 'Other white cells', 't-small jr-sub');
    hide(inset, tLbl, oLbl);
    cellEls.forEach((e) => hide(e));
    void insetO;
    return {
      g,
      steps(tl) {
        tl.fromTo(b.fill, { attr: { y: b.h / 2 - b.h * 0.08, height: b.h * 0.08 } }, { attr: { y: b.h / 2 - b.h * 0.72, height: b.h * 0.72 }, duration: 2.2, ease: 'power1.inOut' }, 0.6);
        tl.fromTo(inset, { opacity: 0, scale: 0.86, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, transformOrigin: '50% 50%', duration: 0.8, ease: 'so.out' }, 1.2);
        cellEls.forEach((e, i) => fadeIn(tl, e, 1.6 + i * 0.12, 0.45));
        fadeIn(tl, tLbl, 2.5);
        fadeIn(tl, oLbl, 2.7);
      },
    };
  }

  function v2(root) {
    const g = G(root, {});
    const c = compact;
    facilityWash(g);
    zoneLabel(g, 'MANUFACTURING FACILITY · ACTIVATION');
    const boxP = c ? [92, 250, 0.8] : [140, 320, 1];
    const box = coldBox(g, ...boxP);
    T(g, boxP[0], boxP[1] + (c ? 52 : 66), 'Cold box', 't-label t-mid jr-lbl');
    const { inner: pl } = nest(g, boxP[0] - (c ? 30 : 46), boxP[1] - (c ? 74 : 92));
    plane(pl, 0, 0, c ? 22 : 26);
    // The mixture: other white cells are removed; the T cells stay.
    const mxC = c ? [262, 256] : [380, 300];
    const kinds = [['t', -30, -26, 1], ['t', 22, -36, 2], ['t', 34, 16, 3], ['t', -10, 22, 4], ['b', -48, 16, 5], ['nk', 12, 52, 6], ['n', 54, -12, 7]];
    const sc = c ? 0.95 : 1.15;
    const others = [];
    const ts = [];
    const cellLayer = G(g, {});
    for (const [kk, x, y, s] of kinds) {
      const art = lymph(kk, kk === 'n' ? 22 : 19, s + 20);
      const r0 = rig(art, { x: mxC[0] + x * sc, y: mxC[1] + y * sc, parent: cellLayer, seed: s + 20 });
      (kk === 't' ? ts : others).push(r0);
    }
    const remLbl = T(g, mxC[0], mxC[1] + (c ? 112 : 128), 'Other cells removed', 't-small t-mid jr-sub');
    const act = c ? [[110, 470], [210, 430], [300, 486], [214, 556]] : [[630, 264], [730, 344], [620, 410], [820, 420]];
    const beadEls = act.slice(0, 3).map(([x, y], i) => {
      const ang = ([-40, 200, 60][i] * Math.PI) / 180;
      const { inner } = nest(g, x + Math.cos(ang) * 32, y + Math.sin(ang) * 32);
      S('circle', { r: c ? 9 : 10, style: 'fill:#7E6F64;stroke:var(--halo);stroke-width:1.5' }, inner);
      S('circle', { cx: -3, cy: -3, r: 3, style: 'fill:#ffffff', opacity: 0.35 }, inner);
      return inner;
    });
    const beadLbl = G(g, {});
    const bl = c ? [376, 404] : [790, 236];
    const b0 = act[0];
    S('path', { class: 'leader', d: c ? `M${bl[0] - 70} ${bl[1] + 6}L${act[2][0] + 18} ${act[2][1] - 8}` : `M${bl[0] - 56} ${bl[1] + 4}L${b0[0] + 34} ${b0[1] - 22}` }, beadLbl);
    T(beadLbl, bl[0], bl[1], 'Activating beads', 't-small t-end jr-sub');
    const wakeLbl = T(g, c ? 200 : 720, c ? 640 : 500, 'Activated: enlarging, dividing', 't-label t-mid jr-lbl');
    hide(beadLbl, wakeLbl, remLbl, ...beadEls);
    return {
      g,
      steps(tl) {
        tl.fromTo(pl, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.8, ease: 'so.out' }, 0.2);
        tl.to(pl, { opacity: 0, duration: 0.5 }, 1.3);
        others.forEach((o, i) => move(tl, o, { x: o.plan.x + (i - 1) * 16, y: o.plan.y + 64, opacity: 0.16, duration: 1.1, pos: 1.4 + i * 0.1 }));
        fadeIn(tl, remLbl, 1.8);
        ts.forEach((t, i) => move(tl, t, { x: act[i][0], y: act[i][1], duration: 1.2, pos: 2.3 + i * 0.08 }));
        beadEls.forEach((bd, i) => tl.fromTo(bd, { opacity: 0, x: 26, y: -26 }, { opacity: 1, x: 0, y: 0, duration: 0.8, ease: 'so.out' }, 3.4 + i * 0.12));
        fadeIn(tl, beadLbl, 3.7);
        ts.forEach((t, i) => swap(tl, t, tCell({ variant: 'cd8', r: 19, state: 'activated', seed: t.seed, polarity: -90, stage: stage() }), { duration: 0.9, pos: 4.3 + i * 0.1 }));
        divide(tl, ts[1], 2, { angle: 15, duration: 1.8, pos: 5.3 });
        fadeIn(tl, wakeLbl, 5.6);
        void box;
      },
    };
  }

  function v3(root) {
    const g = G(root, {});
    const c = compact;
    facilityWash(g);
    zoneLabel(g, 'MANUFACTURING FACILITY · GENE TRANSFER');
    const cx = c ? 168 : 384;
    const cy = c ? 476 : 330;
    const r0 = c ? 66 : 78;
    const tc = tCell({ variant: 'cd8', r: r0, state: 'activated', seed: 41, polarity: 0, stage: stage() });
    const cellG = G(g, { transform: at(cx, cy) });
    cellG.append(tc);
    const carsArt = carT(r0, 41);   // the same cell redrawn with its CARs, crossfaded in later
    carsArt.setAttribute('opacity', 0);
    cellG.append(carsArt);
    // The cell's DNA (drawn above the cell art, inside the nucleus).
    const nuc = tc.querySelector('[data-part="nucleus"]');
    let nb = { x: -r0 * 0.4, y: -r0 * 0.4, width: r0 * 0.8, height: r0 * 0.8 };
    try { const bb = nuc?.getBBox(); if (bb && bb.width) nb = bb; } catch (e) { /* not rendered */ }
    const ncx = nb.x + nb.width / 2;
    const ncy = nb.y + nb.height / 2;
    const dnaW = nb.width * 0.7;
    const dnaG = G(cellG, {});
    S('path', { d: `M${f1(ncx - dnaW / 2)} ${f1(ncy)} q${dnaW / 8} -9 ${dnaW / 4} 0 t${dnaW / 4} 0 t${dnaW / 4} 0 t${dnaW / 4} 0`, style: 'fill:none;stroke:#6E5A8C;stroke-width:2.6;stroke-linecap:round', opacity: 0.8 }, dnaG);
    const gene = (parent, len, w = 5) => {
      const gg = G(parent, {});
      const cols = [PALETTE.antibody, '#AEB7C8', PALETTE.activate, PALETTE.cd8];
      cols.forEach((cc, i) => S('line', { x1: -len / 2 + (i * len) / 4, x2: -len / 2 + ((i + 1) * len) / 4, y1: 0, y2: 0, style: `stroke:${cc};stroke-width:${w};stroke-linecap:${i === 0 || i === 3 ? 'round' : 'butt'}` }, gg));
      return gg;
    };
    const inserted = gene(dnaG, dnaW * 0.34, 4.2);
    inserted.setAttribute('transform', at(ncx, ncy));
    // Vector: a disabled virus carrying the CAR gene.
    const vStart = c ? [318, 236] : [700, 260];
    const vDock = c ? [cx + 40, cy - r0 * 1.18 - 26] : [cx + r0 * 1.18 + 28, cy - 30];
    const vec = G(g, { transform: at(...vStart) });
    S('circle', { r: 26, style: `fill:${tint('#AEB7C8', 30)};stroke:#8C95A8;stroke-width:1.6` }, vec);
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      S('circle', { cx: f1(Math.cos(a) * 29), cy: f1(Math.sin(a) * 29), r: 3.2, style: 'fill:#8C95A8' }, vec);
    }
    const vGene = gene(vec, 26, 4.4);
    const vLbl = G(g, {});
    const vl = c ? [cx - 160 + 18, 214] : [vStart[0] - 34, vStart[1] + 64];
    T(vLbl, vl[0], vl[1], 'Viral vector', 't-label jr-lbl');
    lines(vLbl, vl[0], vl[1] + 18, ['carries the CAR gene,', 'cannot replicate'], 't-small jr-sub', 16);
    const travel = G(g, { transform: at(...vDock) });
    gene(travel, 30, 5);
    const geneLbl = G(g, {});
    const gl = c ? [cx + r0 + 40, cy + 20] : [cx + r0 + 70, cy + 64];
    S('path', { class: 'leader', d: `M${gl[0] - (c ? 4 : 6)} ${gl[1] - (c ? 12 : 14)}L${cx + ncx + dnaW * 0.2} ${cy + ncy + 4}` }, geneLbl);
    lines(geneLbl, gl[0], gl[1], c ? ['CAR gene', 'joins its DNA'] : ['CAR gene joins', 'the cell’s DNA'], 't-label jr-lbl', 18);
    const carLbl = T(g, c ? 20 : cx - r0 - 34, c ? cy + r0 + 54 : cy - r0 - 18, 'CAR on the surface', `t-label ${c ? '' : 't-end'} jr-lbl`);
    hide(travel, geneLbl, inserted, carLbl);
    return {
      g,
      steps(tl) {
        tl.fromTo(vec, { attr: { transform: at(...vStart) } }, { attr: { transform: at(...vDock) }, duration: 1.3, ease: 'so.inOut' }, 0.9);
        if (!c) {
          tl.to(vLbl, { opacity: 0, duration: 0.35 }, 0.9);
          tl.fromTo(vLbl, { attr: { transform: 'translate(0 0)' } }, { attr: { transform: `translate(${f1(vDock[0] - vStart[0] + 86)} ${f1(vDock[1] - vStart[1] - 100)})` }, duration: 0.01 }, 1.3);
          tl.to(vLbl, { opacity: 1, duration: 0.4 }, 2.2);
        }
        tl.to(vGene, { opacity: 0, duration: 0.3 }, 2.5);
        tl.fromTo(travel, { opacity: 0, attr: { transform: at(...vDock) } }, { opacity: 1, attr: { transform: at(cx + ncx, cy + ncy - 16) }, duration: 1.3, ease: 'so.inOut' }, 2.5);
        tl.to(travel, { opacity: 0, duration: 0.5 }, 3.9);
        fadeIn(tl, inserted, 3.9, 0.6);
        fadeIn(tl, geneLbl, 4.0);
        tl.fromTo(carsArt, { opacity: 0 }, { opacity: 1, duration: 1.0, ease: 'so.out' }, 4.7);
        tl.to(tc, { opacity: 0, duration: 1.0 }, 4.9);
        fadeIn(tl, carLbl, 5.2);
        tl.to(vec, { opacity: 0.45, duration: 0.6 }, 5.4);
      },
    };
  }

  function v4(root) {
    const g = G(root, {});
    const c = compact;
    facilityWash(g);
    zoneLabel(g, 'MANUFACTURING FACILITY · GROWTH AND TESTING');
    const bx = c ? 200 : 280;
    const by = c ? 236 : 262;
    const bw = c ? 300 : 280;
    const bh = c ? 120 : 150;
    const cb = G(g, { transform: at(bx, by) });
    S('path', { d: `M${-bw / 2 - 14} ${bh / 2 + 16}H${bw / 2 + 14}M0 ${bh / 2 + 16}l-12 18h24z`, style: `fill:${ink(12)};stroke:var(--fg-3);stroke-width:1.5` }, cb);
    S('rect', { x: -bw / 2, y: -bh / 2, width: bw, height: bh, rx: 22, style: `fill:${tint('#E7A2B4', 26)};stroke:var(--fg-3);stroke-width:1.5` }, cb);
    S('path', { d: `M${-bw / 2 + 30} ${-bh / 2}v-10M${-bw / 2 + 50} ${-bh / 2}v-10`, style: 'stroke:var(--fg-3);stroke-width:3;stroke-linecap:round' }, cb);
    const inner = G(cb, { 'clip-path': clipRect(-bw / 2, -bh / 2, bw, bh, 22) });
    const rr = ctx.random(7);
    const crowd = [];
    const n = c ? 30 : 36;
    // The crowd uses six seeds: draw each tiny CAR-T cell once in <defs> and place <use> copies
    // (~2,600 fewer SVG nodes; QA R4). Ids carry the jr- prefix, so reset() clears them.
    const protos = new Map();
    const protoFor = (seed) => {
      if (!protos.has(seed)) {
        const id = `jr-proto-${ctx.id}-${seed}`;
        const art = carT(c ? 8 : 9, seed, 'resting', { carSize: 6.5, count: 3 });
        art.removeAttribute('transform');
        art.setAttribute('id', id);
        svg.defs.append(art);
        protos.set(seed, id);
      }
      return protos.get(seed);
    };
    for (let i = 0; i < n; i++) {
      const u = S('use', { href: `#${protoFor(60 + (i % 6))}`, transform: at(rr.range(-bw / 2 + 16, bw / 2 - 16), rr.range(-bh / 2 + 14, bh / 2 - 14)) }, inner);
      crowd.push(u);
    }
    hide(...crowd);
    const big = [rig(carT(c ? 15 : 17, 51), { x: -34, y: -4, parent: inner, seed: 51 }), rig(carT(c ? 15 : 17, 52), { x: 36, y: 8, parent: inner, seed: 52 })];
    T(g, bx, by + bh / 2 + 56, 'Culture bag', 't-label t-mid jr-lbl');
    // Log gauge: millions → hundreds of millions.
    const gx = c ? 30 : 470;
    const gy0 = c ? 524 : 352;
    const gy1 = c ? 410 : 198;
    const gauge = G(g, {});
    S('rect', { x: gx - 6, y: gy1, width: 12, height: gy0 - gy1, rx: 6, style: 'fill:var(--line)' }, gauge);
    const gFill = S('rect', { x: gx - 6, width: 12, rx: 6, y: gy0 - 14, height: 14, style: `fill:${col().stroke.cd8}` }, gauge);
    for (const [fr, lab] of [[0.08, 'Millions'], [0.5, 'Tens of millions'], [0.92, 'Hundreds of millions']]) {
      const y = gy0 - fr * (gy0 - gy1);
      S('line', { x1: gx + 9, x2: gx + 15, y1: y, y2: y, style: 'stroke:var(--fg-3);stroke-width:1' }, gauge);
      T(gauge, gx + 20, y + 4.5, lab, 't-small jr-sub');
    }
    T(gauge, gx - 8, gy1 - 14, 'CELLS (LOG SCALE)', 't-caps jr-zone');
    // Release tests.
    const chipX = c ? 204 : 690;
    const chipY = c ? 418 : 216;
    const chipGap = c ? 35 : 42;
    const tests = ['Sterile', 'This patient’s cells', 'Enough carry the CAR', 'Kills its target'];
    const testHdr = T(g, chipX, chipY - 30, 'RELEASE TESTS', 't-caps jr-zone');
    const chips = tests.map((t, i) => chip(g, chipX, chipY + i * chipGap, t, warn && i === 2 ? 'partial' : 'yes'));
    // Frozen product.
    const fx = c ? 310 : 740;
    const fy = c ? 590 : 420;
    const fb = bag(g, fx, fy, c ? 40 : 46, c ? 56 : 64, tint(PALETTE.cd8, 18), { level: 0.85, frost: true });
    const frLbl = lines(g, fx + (c ? -30 : 40), fy - 2, ['Frozen', 'until shipping'], `t-small ${c ? 't-end' : ''} jr-sub`, 16);
    frLbl.firstChild.setAttribute('class', 'jr-lbl');
    frLbl.firstChild.style.fontWeight = 600;
    let warns = [];
    if (warn) {
      warns = c
        ? [warnBox(g, 12, 634, 'Manufacturing can fail, or fall short of the intended dose.', 376), warnBox(g, 12, 688, 'Patients can deteriorate while they wait, so bridging chemotherapy is often given.', 376)]
        : [warnBox(g, 40, 426, 'Manufacturing can fail, or fall short of the intended dose.', 300), warnBox(g, 350, 426, 'Patients can deteriorate while they wait, so bridging chemotherapy is often given.', 330)];
      hide(...warns);
    }
    hide(fb.g, frLbl, testHdr, ...chips);
    return {
      g,
      steps(tl) {
        big.forEach((b, i) => divide(tl, b, 2, { angle: i ? 70 : -30, duration: 1.6, pos: 0.9 + i * 0.2 }));
        tl.fromTo(gFill, { attr: { y: gy0 - 14, height: 14 } }, { attr: { y: gy1 + 4, height: gy0 - gy1 - 4 }, duration: 3.4, ease: 'power1.in' }, 1.0);
        crowd.forEach((e, i) => fadeIn(tl, e, 1.6 + (i / crowd.length) * 2.6, 0.35));
        fadeIn(tl, testHdr, 4.2, 0.4);
        chips.forEach((ch, i) => tl.fromTo(ch, { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.4, ease: 'so.out' }, 4.4 + i * 0.42));
        fadeIn(tl, fb.g, 6.2, 0.5);
        fadeIn(tl, frLbl, 6.4, 0.4);
        warns.forEach((w, i) => fadeIn(tl, w, 6.6 + i * 0.2, 0.5));
      },
    };
  }

  // Steps 5–6 share one hospital scene: the freezer (product stored first) and the blood field.
  function freezer(parent, x, y, s = 1) {
    const g = G(parent, { transform: at(x, y, s) });
    S('rect', { x: -42, y: -64, width: 84, height: 128, rx: 9, style: `fill:${tint('#9FC3D9', 20)};stroke:var(--fg-3);stroke-width:1.5` }, g);
    S('line', { x1: -42, x2: 42, y1: -22, y2: -22, style: 'stroke:var(--fg-3);stroke-width:1.2' }, g);
    S('rect', { x: 30, y: -50, width: 4, height: 18, rx: 2, style: 'fill:var(--fg-3)' }, g);
    snowflake(g, -10, -42, 11, 'var(--fg-2)');
    S('rect', { x: -30, y: -10, width: 60, height: 62, rx: 6, style: `fill:${tint('#9FC3D9', 10)};stroke:var(--fg-3);stroke-width:1` }, g);
    return g;
  }
  const FREEZER = () => (compact ? { x: 54, y: 266, s: 0.8, lbl: 336 } : { x: 110, y: 318, s: 1, lbl: 412 });
  const FIELD = () => (compact ? { x: 18, y: 372, w: 364, h: 196 } : { x: 470, y: 186, w: 430, h: 240 });
  const KEEP = () => new Set(compact ? [0, 11, 14] : [0, 11, 19]);
  // Blood field with the patient's white cells. which: 'all' | 'kept'. Returns { cells, kept, capsules, F0 }.
  function bloodField(g, which) {
    const c = compact;
    const F0 = FIELD();
    S('rect', { x: F0.x, y: F0.y, width: F0.w, height: F0.h, rx: 20, style: `fill:${tint(PALETTE.rbc, 8)};stroke:var(--fg-3);stroke-width:1.4` }, g);
    T(g, F0.x + 14, F0.y + 24, 'PATIENT’S WHITE CELLS', 't-caps jr-zone');
    const field = G(g, { 'clip-path': clipRect(F0.x, F0.y, F0.w, F0.h, 20) });
    const rr = ctx.random(c ? 31 : 32);
    const cols = c ? 6 : 6;
    const rows = c ? 3 : 4;
    const keep = KEEP();
    const kinds = ['t', 'b', 't', 'nk', 't', 'b'];
    const cells = [];
    const kept = [];
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const x = F0.x + 28 + (i + 0.5) * ((F0.w - 56) / cols) + rr.range(-9, 9);
        const y = F0.y + 44 + (j + 0.5) * ((F0.h - 56) / rows) + rr.range(-7, 7);
        const idx = j * cols + i;
        if (which === 'kept' && !keep.has(idx)) continue;
        const a = lymph(kinds[(i + j * 2) % kinds.length], c ? 13 : 14, 80 + idx);
        a.setAttribute('transform', at(x, y));
        field.append(a);
        (keep.has(idx) ? kept : cells).push(a);
      }
    }
    // The chemotherapy itself: small gold capsules spread through the field.
    const cr = ctx.random(77);
    const capsules = [];
    for (let i = 0; i < (c ? 14 : 18); i++) {
      const cg = G(field, { transform: `${at(cr.range(F0.x + 20, F0.x + F0.w - 20), cr.range(F0.y + 40, F0.y + F0.h - 14))} rotate(${f1(cr.range(0, 180))})` });
      S('rect', { x: -5, y: -2.4, width: 10, height: 4.8, rx: 2.4, style: `fill:${PALETTE.drug};stroke:${mix(PALETTE.drug, '#000000', 0.25)};stroke-width:.8` }, cg);
      capsules.push(cg);
    }
    return { cells, kept, capsules, F0 };
  }

  function v5(root) {
    const g = G(root, {});
    const c = compact;
    zoneLabel(g, 'HOSPITAL · STORED, THEN MAKING ROOM');
    // 1. The frozen product lands and goes into the hospital freezer first.
    const FZ = FREEZER();
    freezer(g, FZ.x, FZ.y, FZ.s);
    const stLbl = lines(g, FZ.x, FZ.lbl, c ? ['Stored', 'frozen'] : ['Arrived first:', 'stored frozen'], 't-small t-mid jr-sub', 16);
    stLbl.firstChild.setAttribute('class', 'jr-lbl');
    stLbl.firstChild.style.fontWeight = 600;
    const { inner: pl } = nest(g, FZ.x - (c ? 4 : 10), FZ.y - (c ? 92 : 112));
    plane(pl, 0, 0, c ? 22 : 26);
    const vIn = [FZ.x, FZ.y + 20 * FZ.s];
    const vFrom = [FZ.x - (c ? 4 : 10), FZ.y - (c ? 70 : 86)];
    const vial = G(g, { transform: at(...vFrom) });
    bag(vial, 0, 0, c ? 18 : 22, c ? 24 : 30, tint(PALETTE.cd8, 18), { level: 0.85, frost: true, port: false });
    // 2. Then the chemotherapy.
    const bagsP = c ? [[176, 262], [310, 262]] : [[250, 306], [370, 306]];
    const names = ['Fludarabine', 'Cyclophosphamide'];
    const bh = c ? 58 : 70;
    const chemo = G(g, {});
    bagsP.forEach(([x, y], i) => {
      bag(chemo, x, y, c ? 40 : 48, bh, tint(PALETTE.drug, 52), { level: 0.75 });
      T(chemo, x, y - bh / 2 - 18, names[i], 't-small t-mid jr-lbl');
    });
    const F = bloodField(g, 'all');
    const F0 = F.F0;
    const jy = c ? F0.y - 26 : F0.y + F0.h * 0.84;
    const endX = c ? bagsP[1][0] + 40 : F0.x;
    const drips = bagsP.map(([x, y]) => S('path', {
      d: c
        ? `M${x} ${y + bh / 2 + 9}V${jy - 12}Q${x} ${jy} ${x + 12} ${jy}H${endX}V${F0.y}`
        : `M${x} ${y + bh / 2 + 9}V${jy - 14}Q${x} ${jy} ${x + 14} ${jy}H${endX}`,
      style: `fill:none;stroke:${tint(PALETTE.drug, 75)};stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round`,
    }, g));
    const room = T(g, F0.x + F0.w / 2, F0.y + F0.h / 2 + 8, 'Room for the new cells', 't-label t-mid jr-lbl t-halo');
    let warns = [];
    if (warn) {
      warns = [c ? warnBox(g, 12, 592, 'This chemotherapy itself causes low blood counts and infection risk.', 376) : warnBox(g, F0.x + F0.w, F0.y + F0.h + 20, 'This chemotherapy itself causes low blood counts and infection risk.', 560, 'end')];
      hide(...warns);
    }
    hide(room, stLbl, chemo, ...F.capsules);
    return {
      g,
      steps(tl) {
        tl.fromTo(pl, { opacity: 0, x: -50, y: -10 }, { opacity: 1, x: 0, y: 0, duration: 0.8, ease: 'so.out' }, 0.3);
        tl.to(pl, { opacity: 0, duration: 0.4 }, 1.3);
        tl.fromTo(vial, { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.9);
        tl.fromTo(vial, { attr: { transform: at(...vFrom) } }, { attr: { transform: at(...vIn) }, duration: 0.8, ease: 'so.inOut' }, 1.2);
        fadeIn(tl, stLbl, 1.8);
        fadeIn(tl, chemo, 2.0, 0.5);
        drips.forEach((d, i) => tl.fromTo(d, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.9, ease: 'so.inOut' }, 2.3 + i * 0.15));
        F.capsules.forEach((cp, i) => fadeIn(tl, cp, 2.9 + (i % 9) * 0.08, 0.4));
        F.cells.forEach((a, i) => die(tl, a, { duration: 1.5, remnants: false, pos: 3.1 + (i % 7) * 0.2 }));
        fadeIn(tl, room, 4.9);
        warns.forEach((w) => fadeIn(tl, w, 5.1, 0.5));
      },
    };
  }

  function v6(root) {
    const g = G(root, {});
    const c = compact;
    zoneLabel(g, 'HOSPITAL · A SHORT REST');
    const FZ = FREEZER();
    freezer(g, FZ.x, FZ.y, FZ.s);
    bag(g, FZ.x, FZ.y + 20 * FZ.s, c ? 18 : 22, c ? 24 : 30, tint(PALETTE.cd8, 18), { level: 0.85, frost: true, port: false });
    const wl = lines(g, FZ.x, FZ.lbl, ['Cells wait,', 'frozen'], 't-small t-mid jr-sub', 16);
    wl.firstChild.setAttribute('class', 'jr-lbl');
    wl.firstChild.style.fontWeight = 600;
    const F = bloodField(g, 'kept');
    const F0 = F.F0;
    const clr = T(g, F0.x + F0.w / 2, F0.y + F0.h / 2 + 8, 'The chemotherapy clears', 't-label t-mid jr-lbl t-halo');
    const sub = T(g, F0.x + F0.w / 2, F0.y + F0.h / 2 + 28, 'so it will not harm the new cells', 't-small t-mid jr-sub t-halo');
    hide(clr, sub);
    return {
      g,
      steps(tl) {
        F.capsules.forEach((cp, i) => tl.fromTo(cp, { opacity: 1 }, { opacity: 0, duration: 0.7, ease: 'so.in' }, 0.8 + (i % 9) * 0.16));
        fadeIn(tl, clr, 1.0);
        fadeIn(tl, sub, 1.3);
      },
    };
  }

  function v7(root) {
    const g = G(root, {});
    const c = compact;
    zoneLabel(g, 'HOSPITAL · THAW AND INFUSE');
    // Water bath at the bedside.
    const wb = c ? { x: 110, y: 274, w: 170, h: 86 } : { x: 180, y: 350, w: 220, h: 104 };
    const bath = G(g, { transform: at(wb.x, wb.y) });
    S('path', { d: `M${-wb.w / 2} ${-wb.h / 2}V${wb.h / 2 - 14}Q${-wb.w / 2} ${wb.h / 2} ${-wb.w / 2 + 14} ${wb.h / 2}H${wb.w / 2 - 14}Q${wb.w / 2} ${wb.h / 2} ${wb.w / 2} ${wb.h / 2 - 14}V${-wb.h / 2}`, style: 'fill:var(--halo);stroke:var(--fg-3);stroke-width:1.6' }, bath);
    bath.append(ctx.iconSVG('thermometer', { x: wb.w / 2 - 24, y: -wb.h / 2 - 20, size: 22, color: 'var(--fg-2)' }));
    T(bath, wb.w / 2 - 10, -wb.h / 2 - 14, '37 °C', 't-small jr-sub jr-num');
    const thawLbl = T(g, wb.x, wb.y + wb.h / 2 + 28, 'Thawed at the bedside', 't-label t-mid jr-lbl');
    // IV pole and patient.
    const pat = patient(g, c ? 146 : 470, c ? 612 : 430, c ? 0.95 : 1.05);
    const px = c ? 346 : 700;
    const pTop = c ? 222 : 182;
    const pBot = c ? 712 : 500;
    S('path', { d: `M${px} ${pTop}V${pBot}M${px - 30} ${pBot}H${px + 30}M${px} ${pTop}h-26`, style: 'fill:none;stroke:var(--fg-3);stroke-width:3;stroke-linecap:round' }, g);
    const hang = [px - 26, pTop + 46];
    const bw = c ? 36 : 44;
    const bhh = c ? 50 : 62;
    const inBath = [wb.x - (c ? 6 : 10), wb.y - 2];
    const lift = [lerp(inBath[0], hang[0], 0.45), Math.min(inBath[1], hang[1]) - (c ? 30 : 50)];
    const pb = G(g, { transform: at(...inBath) });
    const b = bag(pb, 0, 0, bw, bhh, tint(PALETTE.cd8, 18), { level: 0.8, frost: true });
    // Water in front of the bag's lower half.
    const wy = -wb.h / 2 + 22;
    const water = G(g, { transform: at(wb.x, wb.y) });
    S('path', { d: `M${-wb.w / 2 + 1.5} ${wy} q${wb.w / 8} -7 ${wb.w / 4} 0 t${wb.w / 4} 0 t${wb.w / 4} 0 t${wb.w / 4 - 3} 0 V${wb.h / 2 - 14} Q${wb.w / 2 - 1.5} ${wb.h / 2 - 1.5} ${wb.w / 2 - 14} ${wb.h / 2 - 1.5} H${-wb.w / 2 + 14} Q${-wb.w / 2 + 1.5} ${wb.h / 2 - 1.5} ${-wb.w / 2 + 1.5} ${wb.h / 2 - 14} Z`, style: 'fill:#9FC3D9;fill-opacity:.38;stroke:#7FA9C4;stroke-width:1.4' }, water);
    const chamberY = hang[1] + bhh / 2 + 16;
    const chamber = S('rect', { x: hang[0] - 6, y: chamberY - 12, width: 12, height: 24, rx: 4, style: 'fill:var(--halo);stroke:var(--fg-3);stroke-width:1.3' }, g);
    const [hx, hy] = pat.hand;
    const line = S('path', { d: `M${hang[0]} ${chamberY + 12} C${hang[0]} ${chamberY + 90}, ${hx + 70} ${hy - 30}, ${hx + 4} ${hy - 2}`, style: `fill:none;stroke:${tint(PALETTE.cd8, 45)};stroke-width:2.6;stroke-linecap:round` }, g);
    const drops = [0, 1, 2].map(() => S('circle', { cx: hang[0], cy: chamberY - 6, r: 2.4, style: `fill:${col().stroke.cd8}`, opacity: 0 }, g));
    const l1 = G(g, {});
    const lp = c ? [hang[0] - 22, chamberY + 52, 't-end'] : [hang[0] + 60, hang[1] - 4, ''];
    T(l1, lp[0], lp[1], 'One small bag', `t-label ${lp[2]} jr-lbl`);
    T(l1, lp[0], lp[1] + 19, '10–100 mL', `t-small ${lp[2]} jr-sub jr-num`);
    const l2 = G(g, {});
    const l2p = c ? [118, 740] : [px + 40, chamberY + 70];
    l2.append(ctx.iconSVG('clock', { x: l2p[0] + 9, y: l2p[1] - 5, size: 18, color: 'var(--fg-2)' }));
    T(l2, l2p[0] + 24, l2p[1], 'A few minutes', 't-label jr-lbl');
    hide(thawLbl, l1, l2, chamber, line);
    return {
      g,
      steps(tl) {
        tl.to(b.frost, { opacity: 0, duration: 1.3, ease: 'power1.inOut' }, 0.6);
        fadeIn(tl, thawLbl, 1.1);
        tl.fromTo(pb, { attr: { transform: at(...inBath) } }, { attr: { transform: at(...lift) }, duration: 0.7, ease: 'so.out' }, 2.0);
        tl.to(pb, { attr: { transform: at(...hang) }, duration: 0.8, ease: 'so.inOut' }, 2.7);
        fadeIn(tl, chamber, 3.3, 0.3);
        tl.fromTo(line, { opacity: 1, drawSVG: '0%' }, { drawSVG: '100%', duration: 0.9, ease: 'so.inOut' }, 3.4);
        fadeIn(tl, l1, 3.5);
        drops.forEach((d, i) => tl.fromTo(d, { opacity: 0, attr: { cy: chamberY - 8 } }, { opacity: 1, attr: { cy: chamberY + 8 }, duration: 0.6, ease: 'power1.in' }, 4.2 + i * 0.7).to(d, { opacity: 0, duration: 0.2 }, 4.8 + i * 0.7));
        tl.to(b.fill, { attr: { y: b.h / 2 - b.h * 0.25, height: b.h * 0.25 }, duration: 2.4, ease: 'power1.inOut' }, 4.2);
        fadeIn(tl, l2, 4.6);
      },
    };
  }

  // Step 8: inside the body, the CAR-T cells find, kill and multiply (the chart is its own group).
  const WINDOW = () => (compact ? { x: 12, y: 170, w: 376, h: 176 } : { x: 34, y: 166, w: 340, h: 320 });
  function v8(root) {
    const g = G(root, {});
    const c = compact;
    zoneLabel(g, 'HOSPITAL · INSIDE THE BODY');
    const W0 = WINDOW();
    S('rect', { x: W0.x, y: W0.y, width: W0.w, height: W0.h, rx: 20, style: `fill:${tint(PALETTE.rbc, 7)};stroke:var(--fg-3);stroke-width:1.4` }, g);
    const layer = G(g, {});
    const cx = W0.x + W0.w / 2;
    const cy = W0.y + W0.h / 2;
    const k = c ? 0.78 : 1.25;
    const t1 = c ? [cx - 46, cy - 6] : [cx + 34, cy - 66];
    const t2 = c ? [cx + 118, cy + 22] : [cx + 70, cy + 86];
    const ca = rig(cancer(27 * k, 71), { x: t1[0], y: t1[1], parent: layer, seed: 71 });
    const cb = rig(cancer(25 * k, 72), { x: t2[0], y: t2[1], parent: layer, seed: 72 });
    const killer = rig(carT(21 * k, 73), { x: c ? t1[0] - 58 : t1[0] - 88, y: c ? t1[1] + 8 : t1[1] + 26, parent: layer, seed: 73 });
    const lbl = T(g, c ? W0.x + W0.w - 14 : cx, W0.y + W0.h - 16, 'Find, kill, multiply', `t-label ${c ? 't-end' : 't-mid'} jr-lbl t-halo`);
    hide(lbl);
    return {
      g,
      steps(tl) {
        dock(tl, killer, ca, { duration: 0.6, pos: 0.9 });
        polarize(tl, killer, ca, { duration: 0.8, pos: 1.5 });
        const k1 = kill(tl, killer, ca, { duration: 1.3, pos: 2.3 });
        fadeIn(tl, lbl, 2.6);
        const d1 = divide(tl, killer, 2, { angle: c ? 0 : 60, spread: killer.r * 1.5, duration: 1.3, pos: k1.end });
        approach(tl, d1[1], cb, { duration: 0.8, pos: d1.span.end });
        dock(tl, d1[1], cb, { duration: 0.5, pos: d1.span.end + 0.8 });
        polarize(tl, d1[1], cb, { duration: 0.6, pos: d1.span.end + 1.3 });
        kill(tl, d1[1], cb, { duration: 1.2, pos: d1.span.end + 1.9 });
        divide(tl, d1[0], 2, { angle: c ? 90 : 150, spread: killer.r * 1.4, duration: 1.3, pos: d1.span.end + 0.2 });
      },
    };
  }

  // Step 9: months later. A few CAR-T cells remain; normal B cells return.
  function v9(root) {
    const g = G(root, {});
    const c = compact;
    zoneLabel(g, 'MONTHS TO YEARS LATER');
    const W0 = WINDOW();
    S('rect', { x: W0.x, y: W0.y, width: W0.w, height: W0.h, rx: 20, style: `fill:${tint(PALETTE.rbc, 7)};stroke:var(--fg-3);stroke-width:1.4` }, g);
    const cx = W0.x + W0.w / 2;
    const cy = W0.y + W0.h / 2;
    const k = c ? 0.8 : 1;
    (c ? [[cx - 120, cy - 4], [cx - 62, cy + 32]] : [[cx - 90, cy - 60], [cx - 30, cy + 10]]).forEach(([x, y], i) => {
      const a = carT(18 * k, 90 + i, 'resting');
      a.setAttribute('transform', at(x, y));
      g.append(a);
    });
    const bs = (c ? [[cx + 60, cy - 18], [cx + 116, cy + 24], [cx + 26, cy + 40]] : [[cx + 60, cy - 30], [cx + 100, cy + 46], [cx + 20, cy + 90], [cx - 70, cy + 96]]).map(([x, y], i) => {
      const a = bCell({ r: 18 * k, seed: 95 + i, stage: stage() });
      a.setAttribute('transform', at(x, y));
      g.append(a);
      return a;
    });
    T(g, W0.x + 16, W0.y + (c ? 28 : 34), 'A few CAR-T cells remain', 't-label jr-lbl t-halo', { style: `fill:${col().stroke.cd8}` });
    const l2 = T(g, W0.x + W0.w - 16, W0.y + W0.h - 16, 'Normal B cells return', 't-label t-end jr-lbl t-halo', { style: `fill:${col().stroke.bcell}` });
    hide(l2, ...bs);
    return {
      g,
      steps(tl) {
        bs.forEach((b, i) => fadeIn(tl, b, 4.8 + i * 0.25, 0.6));
        fadeIn(tl, l2, 5.4);
      },
    };
  }

  // ------------------------------------------------------------------ time render (pure)
  function timeState() {
    let i = -1;
    for (let k = prog.length - 1; k >= 0; k--) if (prog[k] > 0) { i = k; break; }
    if (i < 0) return { i, day: -21, k: 0 };
    if (i === 8) return { i, ...phase9(prog[8]) };
    const [a, b] = TRACK[i];
    return { i, day: lerp(a, b, prog[i]), k: 0 };
  }
  let lastClock = '';
  function renderTime() {
    if (!R) return;
    const { i, day, k } = timeState();
    const txt = clockText(day);
    if (txt !== lastClock) { lastClock = txt; clock.set(txt); }
    const r = L.rail;
    const x = dayX(Math.min(day, 28));
    R.clipRect.setAttribute('width', f1(Math.max(0, x - (r.x0 - 6))));
    R.head.setAttribute('opacity', i >= 0 ? 1 : 0);
    const hx = day > 28 ? dayX(day) : x;
    R.head.setAttribute('transform', `translate(${f1(hx)} 0)`);
    R.stub.setAttribute('opacity', f1(k));
    R.stubRoute.setAttribute('x2', f1(day > 28 ? dayX(day) : r.sx0));
    R.st.forEach((s, j) => {
      const state = j < i ? 'past' : j === i ? 'cur' : 'future';
      const fill = state === 'future' ? 'var(--halo)' : col().stroke.cd8;
      s.mark.setAttribute('style', `fill:${fill};stroke:${state === 'future' ? 'var(--fg-3)' : col().stroke.cd8};stroke-width:1.4`);
      s.g.setAttribute('opacity', state === 'past' ? 0.35 : state === 'future' ? 0.7 : 1);
      s.halo.setAttribute('opacity', state === 'cur' ? 0.18 : 0);
      if (s.barHalo) s.barHalo.setAttribute('opacity', state === 'cur' ? 0.16 : 0);
    });
    CH?.render(day, k);
  }

  // ------------------------------------------------------------------ build
  let scene = null;
  let loops = [];
  const ambient = (tw) => { loops.push(tw); return ctx.ambient(tw); };
  function reset() {
    loops.forEach((tw) => tw.kill());
    loops = [];
    uid = 0;
    for (const n of [...svg.children]) if (n !== svg.defs) n.remove();
    for (const n of [...svg.defs.children]) if (n.id?.startsWith('jr-')) n.remove();
    measureProbe = null;
    L = layout();
    svg.setAttribute('viewBox', `0 0 ${L.vb[0]} ${L.vb[1]}`);
    ctx.refreshTextScale();
    scene = G(svg, {});
    R = drawRail(scene);
    const main = G(scene, {});
    V = [v1(main), v2(main), v3(main), v4(main), v5(main), v6(main), v7(main)];
    const s8 = v8(main);
    V.push(s8);
    V.push(v9(main));
    const chartG = G(main, {});
    CH = drawChart(chartG);
    CH.wrap = chartG;
    V.forEach((v) => gsap.set(v.g, { opacity: 0 }));
    gsap.set(chartG, { opacity: 0 });
    prog = STATIONS.map(() => 0);
    lastClock = '';
    renderTime();
  }

  // Durations of each step's clock driver: [start, duration].
  const DRIVE = [[0.2, 0.5], [0.3, 1.4], [0.3, 1.8], [0.3, 6.4], [0.3, 4.6], [0.3, 1.6], [0.3, 1.2], [0.8, 7.2], [0.2, 6.4]];
  const steps = STATIONS.map((_, i) => ({
    enter(tl) {
      if (i > 0) fadeOut(tl, V[i - 1].g, 0, 0.4);
      fadeIn(tl, V[i].g, 0.25, 0.55);
      if (i === 7) tl.fromTo(CH.wrap, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'so.out' }, 0.3);
      const [p0, d] = DRIVE[i];
      drive(tl, (p) => { prog[i] = p; renderTime(); }, { duration: d, pos: p0, ease: i === 8 ? 'none' : 'power1.inOut' });
      V[i].steps(tl);
    },
  }));

  const stepper = ctx.ui.stepper({
    steps,
    // Grouped dots (FIGURES.md phases): where the cells are; phones read "Manufacture · 3 / 9".
    phases: [
      { label: 'Collect', steps: [0] },
      { label: 'Manufacture', steps: [1, 2, 3] },
      { label: 'Prepare', steps: [4, 5] },
      { label: 'Infuse', steps: [6] },
      { label: 'Inside the body', short: 'In the body', steps: [7, 8] },
    ],
    reset,
    onChange(i) {
      tcTag.el.hidden = i !== 8;
      renderTime();
    },
  });
  ctx.ui.toggle({ label: 'What can go wrong', checked: false, onChange: (on) => { warn = on; stepper.rebuild(); renderTime(); } });

  // Swipe to advance on touch screens.
  let sx = null;
  let sy = null;
  ctx.on(svg, 'pointerdown', (e) => { if (e.pointerType !== 'mouse') { sx = e.clientX; sy = e.clientY; } });
  ctx.on(svg, 'pointerup', (e) => {
    if (sx == null) return;
    const dx = e.clientX - sx;
    const dy = e.clientY - sy;
    sx = null;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) (dx < 0 ? stepper.next : stepper.prev)();
  });
  ctx.on(svg, 'pointercancel', () => { sx = null; });

  ctx.onResize(({ compact: cmp }) => {
    if (cmp !== compact) { compact = cmp; stepper.rebuild(); renderTime(); }
  });
  ctx.onThemeChange(() => { stepper.rebuild(); renderTime(); });
  return {};
}
