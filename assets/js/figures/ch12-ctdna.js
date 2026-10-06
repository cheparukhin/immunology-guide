// ch12-ctdna — "Listening to the blood" (Figure 12.4)
//
// An ILLUSTRATIVE time chart of the amount of cancer in the body over 24 months, with two
// detection floors: what scans can see (upper dashed line) and what a sensitive blood test for
// circulating tumor DNA can detect (lower dashed line; below it a hatched "too little" zone that
// stays in every scenario: no test is perfect). Three scenarios (+ a "treat when the blood test
// turns positive" toggle in the second). A playhead (Play / drag / slider / keys) drives two
// badges (scan, blood test: icon + word) and a blood-sample panel whose violet tumor-DNA
// fragments track the curve. Real trial numbers appear only in the two callout cards (verbatim).
// Light stage; the curve is cancer (an entity, §4 rule 20) → cancer violet; "Illustrative" tag.
import { C, scale, chartRoot, line, pathD, band, hatchFill, chartFrame } from './shared/chart.js';
import { antibody } from '../art/index.js';

const ID = 'ch12-ctdna';

// ------------------------------------------------------------------ scenarios (illustrative units)
// y: 0 = blood-test floor, 3 = scan floor, 5 = top. Key points follow the spec; drawn monotone.
const SURGERY = 1;
const SCENARIOS = {
  clears: {
    label: 'Treatment clears it', cap: 1, surgery: true, doses: [2, 4, 6, 8],
    pts: [[0, 4.5], [0.9, 4.6], [1.15, 0.8], [2, 0.72], [3, 0.35], [4, -0.1], [6, -1.0], [8, -1.5], [12, -1.55], [24, -1.55]],
  },
  hidden: {
    label: 'Hidden leftover', cap: 2, surgery: true, doses: [], lead: [3, 11],
    pts: [[0, 4.5], [0.9, 4.6], [1.15, -0.5], [2, -0.36], [3, 0], [6, 1.5], [11, 3], [15, 3.8], [19, 3.86], [24, 3.88]],
  },
  hiddenTreated: {
    label: 'Hidden leftover', cap: 4, surgery: true, doses: [3, 5, 7, 9, 11, 13], lead: [3, 11],
    pts: [[0, 4.5], [0.9, 4.6], [1.15, -0.5], [2, -0.36], [3, 0], [4, 0.6], [5.5, 0.45], [7, 0.05], [9, -0.3], [12, -0.38], [24, -0.4]],
  },
  relapse: {
    label: 'Relapse after response', cap: 3, surgery: false, doses: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22], flag: 12,
    pts: [[0, 4.5], [1, 4.3], [2, 4.0], [3, 3.55], [4, 2.95], [5, 2.15], [6, 1.55], [7, 1.08], [8, 0.72], [9, 0.52], [10, 0.5], [11, 0.66],
      [12, 1.0], [14, 1.75], [17, 3.0], [20, 3.38], [24, 3.6]],
  },
};
const OPTIONS = [
  { value: 'clears', label: 'Treatment clears it' },
  { value: 'hidden', label: 'Hidden leftover' },
  { value: 'relapse', label: 'Relapse after response' },
];
const Y = { min: -2, max: 5.6, blood: 0, scan: 3 };

// ------------------------------------------------------------------ callout cards (verbatim)
const CARDS = [
  {
    kicker: 'Real trial · bladder cancer', title: 'IMvigor011',
    html: 'After surgery, patients had repeated blood tests for up to a year. 250 who turned ctDNA-positive were randomized: median survival <b>32.8 months</b> with atezolizumab vs <b>21.1 months</b> with placebo. Of 357 who stayed ctDNA-negative and received no immunotherapy, <b>88%</b> were disease-free at two years. The US FDA approved this approach in May 2026.',
    src: 'Powles et al., <em>N Engl J Med</em> 2025 <a href="#src-31" aria-label="Source 31">[31]</a>; FDA atezolizumab label, May 2026 <a href="#src-32" aria-label="Source 32">[32]</a>',
  },
  {
    kicker: 'Real trial · lung cancer', title: 'CheckMate 816',
    html: 'Exploratory analysis: among patients given nivolumab plus chemotherapy before surgery, <b>75%</b> of those whose ctDNA cleared were alive at five years, vs <b>53%</b> of those whose ctDNA did not clear.',
    src: 'Forde et al., <em>N Engl J Med</em> 2025 <a href="#src-18" aria-label="Source 18">[18]</a>',
  },
];
const SOURCE_HTML = 'The chart is illustrative: its curves and detection lines are not drawn from any dataset, and real detection limits vary by test and cancer type. Real trial results appear only in the two cards above. Sources: Powles et al. 2025 <a href="#src-31">[31]</a>; US FDA 2026 <a href="#src-32">[32]</a>; Forde et al. 2025 <a href="#src-18">[18]</a>.';

// ------------------------------------------------------------------ helpers
function monotone(pts) {
  const n = pts.length;
  const dx = []; const m = [];
  for (let i = 0; i < n - 1; i++) { dx[i] = pts[i + 1][0] - pts[i][0]; m[i] = (pts[i + 1][1] - pts[i][1]) / (dx[i] || 1e-9); }
  const t = new Array(n);
  t[0] = m[0]; t[n - 1] = m[n - 2];
  for (let i = 1; i < n - 1; i++) t[i] = m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2;
  for (let i = 0; i < n - 1; i++) {
    if (m[i] === 0) { t[i] = 0; t[i + 1] = 0; continue; }
    const a = t[i] / m[i]; const b = t[i + 1] / m[i]; const s2 = a * a + b * b;
    if (s2 > 9) { const tau = 3 / Math.sqrt(s2); t[i] = tau * a * m[i]; t[i + 1] = tau * b * m[i]; }
  }
  return (x) => {
    if (x <= pts[0][0]) return pts[0][1];
    if (x >= pts[n - 1][0]) return pts[n - 1][1];
    let i = 0;
    while (i < n - 2 && x > pts[i + 1][0]) i++;
    const h = dx[i]; const s = (x - pts[i][0]) / h;
    const h00 = 2 * s ** 3 - 3 * s ** 2 + 1; const h10 = s ** 3 - 2 * s ** 2 + s; const h01 = -2 * s ** 3 + 3 * s ** 2; const h11 = s ** 3 - s ** 2;
    return h00 * pts[i][1] + h10 * h * t[i] + h01 * pts[i + 1][1] + h11 * h * t[i + 1];
  };
}
for (const s of Object.values(SCENARIOS)) s.f = monotone(s.pts);
const fragmentsFor = (y) => (y < Y.blood ? 0 : Math.max(1, Math.min(20, Math.round(1 + 19 * (Math.min(y, 5) / 5) ** 1.25))));
const amountWord = (n) => (n === 0 ? 'none' : n <= 3 ? 'few' : 'some');
const monthText = (t) => `Month ${Number.isInteger(t) ? t : t.toFixed(1)}`;

// Seeded PRNG (mulberry32).
function rng(seed) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

const CSS = `
[data-figure="${ID}"] .ck-frame { --ct-gray: color-mix(in srgb, var(--fg) 34%, transparent); --ct-violet: var(--c-cancer); --ct-pink: var(--c-neo-peptide); }
[data-figure="${ID}"] .ck-frame__toolbar { padding-right: 7.5rem; gap: 10px 18px; }
[data-figure="${ID}"] .ct-main { display: grid; grid-template-columns: minmax(0, 3fr) minmax(0, 7fr); gap: 20px; align-items: start; }
[data-figure="${ID}"].is-compact .ct-main { grid-template-columns: minmax(0, 1fr); gap: 8px; }
[data-figure="${ID}"] .ct-blood { min-width: 0; display: flex; flex-direction: column; align-items: center; gap: 4px; font-family: var(--font-ui); }
[data-figure="${ID}"] .ct-blood > svg, [data-figure="${ID}"] .ct-chart > svg { display: block; width: 100%; height: auto; overflow: visible; }
[data-figure="${ID}"] .ct-chart { min-width: 0; }
[data-figure="${ID}"] .ct-blood > svg { max-width: 260px; }
[data-figure="${ID}"].is-compact .ct-blood > svg { max-width: none; }
[data-figure="${ID}"] .ct-blood__head { margin: 0 0 2px; align-self: stretch; text-align: center; font-size: 11px; font-weight: 650; letter-spacing: 0.08em; text-transform: uppercase; color: var(--fg-2); }
[data-figure="${ID}"].is-compact .ct-blood__head { text-align: left; }
[data-figure="${ID}"] .ct-amount { margin: 0; font-size: 14px; line-height: 1.35; color: var(--fg-2); text-align: center; }
[data-figure="${ID}"] .ct-amount b { color: var(--fg); font-weight: 680; }
[data-figure="${ID}"] .ct-real { margin: 0; max-width: 16rem; font-size: 12.5px; line-height: 1.4; color: var(--fg-3); text-align: center; text-wrap: balance; }
[data-figure="${ID}"].is-compact .ct-blood { flex-direction: column; }
[data-figure="${ID}"] .ct-play { display: flex; flex-wrap: wrap; align-items: center; gap: 10px 18px; margin-top: 2px; }
[data-figure="${ID}"] .ct-play .slider { flex: 1 1 14rem; min-width: 12rem; }
[data-figure="${ID}"] .ct-badges { display: flex; flex-wrap: wrap; gap: 8px; }
[data-figure="${ID}"] .ct-badge { display: inline-flex; align-items: center; gap: 7px; min-height: 34px; padding: 4px 12px 4px 8px; border-radius: 999px; border: 1px solid var(--line);
  font: 500 14px/1.2 var(--font-ui); color: var(--fg-2); background: transparent; transition: background-color var(--dur-2) ease, border-color var(--dur-2) ease, color var(--dur-2) ease; white-space: nowrap; }
[data-figure="${ID}"] .ct-badge b { font-weight: 680; color: var(--fg); }
[data-figure="${ID}"] .ct-badge svg { width: 18px; height: 18px; flex: none; overflow: visible; }
[data-figure="${ID}"] .ct-badge.is-on { border-color: color-mix(in srgb, var(--fg) 45%, transparent); background: color-mix(in srgb, var(--fg) 6%, transparent); color: var(--fg); }
[data-figure="${ID}"] .ct-badge--blood.is-on { border-color: color-mix(in srgb, var(--c-cancer) 70%, transparent); background: color-mix(in srgb, var(--c-cancer) 12%, transparent); }
[data-figure="${ID}"] .ct-cards { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
[data-figure="${ID}"].is-compact .ct-cards { grid-template-columns: minmax(0, 1fr); }
[data-figure="${ID}"] .ct-card { margin: 0; padding: 14px 16px; border-radius: 12px; background: color-mix(in srgb, var(--fg) 3.5%, transparent); box-shadow: inset 0 0 0 1px var(--line); font-family: var(--font-ui); }
[data-figure="${ID}"] .ct-card__kicker { margin: 0; font-size: 11px; font-weight: 650; letter-spacing: 0.08em; text-transform: uppercase; color: var(--fg-3); }
[data-figure="${ID}"] .ct-card__title { margin: 2px 0 6px; font-size: 16px; font-weight: 680; color: var(--fg); }
[data-figure="${ID}"] .ct-card__body { margin: 0; font-size: 14px; line-height: 1.5; color: var(--fg); text-wrap: pretty; font-variant-numeric: tabular-nums; }
[data-figure="${ID}"] .ct-card__body b { font-weight: 680; }
[data-figure="${ID}"] .ct-card__src { margin: 8px 0 0; font-size: 12px; line-height: 1.45; color: var(--fg-3); }
[data-figure="${ID}"] .ct-card__src a, [data-figure="${ID}"] .ck-source a { color: inherit; }
[data-figure="${ID}"].is-compact .ck-frame__toolbar { padding-right: 0; padding-top: 1.1rem; }
[data-figure="${ID}"].is-compact .ck-frame__toolbar .segmented, [data-figure="${ID}"].is-compact .ck-frame__toolbar .segmented__track { width: 100%; }
[data-figure="${ID}"].is-compact .ck-frame__toolbar .segmented__track { flex-direction: column; border-radius: 14px; padding: 4px; gap: 3px; }
[data-figure="${ID}"].is-compact .ck-frame__toolbar .segmented__opt { width: 100%; justify-content: center; height: 44px; border-radius: 10px; font-size: 14px; }
[data-figure="${ID}"] .switch[hidden] { display: none; }
[data-figure="${ID}"] svg .ct-frag .s { fill: none; stroke: var(--ct-gray); stroke-width: 1.15; stroke-linecap: round; transition: stroke var(--dur-3) ease; }
[data-figure="${ID}"] svg .ct-frag .tk { stroke: var(--ct-pink); stroke-width: 1.8; stroke-linecap: round; opacity: 0; transition: opacity var(--dur-3) ease; }
[data-figure="${ID}"] svg .ct-frag.is-tumor .s { stroke: var(--ct-violet); stroke-width: 1.5; }
[data-figure="${ID}"] svg .ct-frag.is-tumor .tk { opacity: 1; }
[data-figure="${ID}"] svg .ct-tube { fill: color-mix(in srgb, var(--fg) 3%, transparent); stroke: var(--fg-2); stroke-width: 1.5; vector-effect: non-scaling-stroke; }
[data-figure="${ID}"] svg .ct-cap { fill: color-mix(in srgb, var(--fg) 22%, var(--halo)); stroke: var(--fg-2); stroke-width: 1.2; vector-effect: non-scaling-stroke; }
[data-figure="${ID}"] svg .ct-lens { fill: var(--halo); stroke: var(--fg-2); stroke-width: 2; vector-effect: non-scaling-stroke; }
[data-figure="${ID}"] svg .ct-handle { stroke: var(--fg-3); stroke-width: 5; stroke-linecap: round; }
[data-figure="${ID}"] svg .ct-mag { transition: opacity var(--dur-3) ease; }
[data-figure="${ID}"] svg .ct-mag.is-off { opacity: 0; }
[data-figure="${ID}"] svg .ct-hatch-label { font-size: max(13px, calc(12px * var(--u, 1))); fill: var(--fg-2); }
[data-figure="${ID}"] svg .ct-thr { font-size: max(13px, calc(12px * var(--u, 1))); font-weight: 600; fill: var(--fg); }
[data-figure="${ID}"] svg .ct-lane { font-size: max(13px, calc(12px * var(--u, 1))); font-weight: 600; fill: var(--fg-2); }
[data-figure="${ID}"] svg .ct-period { stroke: var(--c-drug); stroke-width: 3; stroke-linecap: round; opacity: 0.45; }
[data-figure="${ID}"] svg .ct-more { font-size: max(13px, calc(12px * var(--u, 1))); font-weight: 600; fill: var(--fg-2); }
[data-figure="${ID}"] svg .ct-flag { font-size: max(13px, calc(12px * var(--u, 1))); font-weight: 650; fill: var(--fg); }
[data-figure="${ID}"] svg .ct-rule { stroke: var(--fg-2); stroke-width: 1; fill: none; vector-effect: non-scaling-stroke; }
[data-figure="${ID}"] svg .ct-hit { fill: transparent; cursor: ew-resize; touch-action: pan-y; }
`;
function injectCSS() {
  if (document.getElementById(`${ID}-css`)) return;
  const s = document.createElement('style');
  s.id = `${ID}-css`;
  s.textContent = CSS;
  document.head.append(s);
}

// Tiny double-helix dash (two crossing strands) of length L, centred at 0,0, horizontal.
function helixD(L, a) {
  let d1 = ''; let d2 = '';
  const N = 10;
  for (let k = 0; k <= N; k++) {
    const x = -L / 2 + (L * k) / N;
    const y = a * Math.sin((k / N) * Math.PI * 2.2);
    d1 += `${k ? 'L' : 'M'}${x.toFixed(2)},${y.toFixed(2)}`;
    d2 += `${k ? 'L' : 'M'}${x.toFixed(2)},${(-y).toFixed(2)}`;
  }
  return [d1, d2];
}

const ICON = {
  scanOn: '<svg viewBox="-9 -9 18 18" aria-hidden="true"><circle r="7.5" style="fill:none;stroke:currentColor;stroke-width:1.5"/><circle r="3.6" style="fill:currentColor"/></svg>',
  scanOff: '<svg viewBox="-9 -9 18 18" aria-hidden="true"><circle r="7.5" style="fill:none;stroke:currentColor;stroke-width:1.5"/><path d="M-3.5,0H3.5" style="stroke:currentColor;stroke-width:1.6;stroke-linecap:round"/></svg>',
  pos: '<svg viewBox="-9 -9 18 18" aria-hidden="true"><circle r="8" style="fill:var(--c-cancer)"/><path d="M-4,0H4M0,-4V4" style="stroke:#fff;stroke-width:1.9;stroke-linecap:round"/></svg>',
  neg: '<svg viewBox="-9 -9 18 18" aria-hidden="true"><circle r="7.5" style="fill:none;stroke:currentColor;stroke-width:1.5"/><path d="M-4,0H4" style="stroke:currentColor;stroke-width:1.9;stroke-linecap:round"/></svg>',
};

export default function mount(fig, ctx) {
  injectCSS();
  const { gsap } = ctx;
  const F = chartFrame(ctx, { toolbar: true, source: ' ', card: false });
  F.sourceEl.innerHTML = SOURCE_HTML;
  ctx.tag('Illustrative', 'top-right');

  let scen = 'clears';
  let treat = false;
  let t = 0;                 // playhead (months)
  let compact = null;
  let lastW = 0;
  let playTween = null;
  let wasPlaying = false;
  let started = false;
  let el = {};               // chart elements
  let blood = {};            // blood-panel elements
  let lastState = '';

  const current = () => SCENARIOS[scen === 'hidden' && treat ? 'hiddenTreated' : scen];

  // ---------------------------------------------------------------- scaffold
  const main = ctx.h('div', { class: 'ct-main' });
  const bloodEl = ctx.h('div', { class: 'ct-blood' });
  const chartEl = ctx.h('div', { class: 'ct-chart' });
  main.append(bloodEl, chartEl);
  F.main.append(main);
  const amount = ctx.h('p', { class: 'ct-amount', 'aria-live': 'off' });
  const real = ctx.h('p', { class: 'ct-real', text: 'In reality, tumor fragments are far rarer than shown.' });
  const head = ctx.h('p', { class: 'ct-blood__head', text: 'Blood sample' });

  // Toolbar: scenarios + the "treat early" toggle (hidden-leftover scenario only).
  const seg = ctx.ui.segmented({ label: 'Scenario', hideLabel: true, value: scen, parent: F.toolbar, options: OPTIONS, onChange: (v) => setScenario(v) });
  const toggle = ctx.ui.toggle({ label: 'Treat when the blood test turns positive', checked: false, parent: F.toolbar, onChange: (on) => { treat = on; scenarioChanged(); } });
  toggle.el.hidden = true;

  // Below the chart: playhead + badges, then the two real-trial cards.
  const playRow = ctx.h('div', { class: 'ct-play' });
  const play = ctx.ui.playPause({ playing: false, parent: playRow, onChange: (on) => (on ? startPlay({ fromStart: t >= 24 - 1e-6 }) : stopPlay()) });
  const slider = ctx.ui.slider({
    label: 'Time', min: 0, max: 24, step: 0.5, value: 0, parent: playRow,
    format: (v) => monthText(v), describe: (v) => `${monthText(v)}: ${statusText(v)}`,
    onInput: (v) => { stopPlay(); setT(v, { user: true }); },
  });
  const badges = ctx.h('div', { class: 'ct-badges', role: 'status', 'aria-live': 'off' });
  const scanBadge = ctx.h('span', { class: 'ct-badge ct-badge--scan' });
  const bloodBadge = ctx.h('span', { class: 'ct-badge ct-badge--blood' });
  badges.append(scanBadge, bloodBadge);
  playRow.append(badges);
  const cards = ctx.h('div', { class: 'ct-cards' });
  for (const c of CARDS) {
    cards.append(ctx.h('article', { class: 'ct-card', html: `<p class="ct-card__kicker">${c.kicker}</p><p class="ct-card__title">${c.title}</p><p class="ct-card__body">${c.html}</p><p class="ct-card__src">${c.src}</p>` }));
  }
  F.below.append(playRow, cards);

  // Captions: the intro (step 1) always leads; the active scenario's caption follows (steps 2–5).
  const intro = ctx.h('p', { html: ctx.steps[0]?.html || '' });
  const capWrap = ctx.h('div', { class: 'fig__steps' });
  const capEls = [1, 2, 3, 4].map((i) => {
    const c = ctx.h('div', { class: 'fig__step', 'aria-hidden': 'true' }, ctx.h('p', { class: 'fig__step-text', html: ctx.steps[i]?.html || '' }));
    capWrap.append(c);
    return c;
  });
  ctx.caption.append(intro, capWrap);
  const syncCaption = () => {
    const k = current().cap - 1;
    capEls.forEach((c, i) => { c.classList.toggle('is-active', i === k); c.setAttribute('aria-hidden', String(i !== k)); });
  };

  // ---------------------------------------------------------------- status
  function valueAt(x) { return current().f(x); }
  function statusText(x) {
    const y = valueAt(x);
    return `scan ${y >= Y.scan ? 'sees cancer' : 'clear'}, blood test ${y >= Y.blood ? 'positive' : 'negative'}`;
  }
  function paintBadges(y) {
    const scan = y >= Y.scan; const pos = y >= Y.blood;
    scanBadge.classList.toggle('is-on', scan);
    bloodBadge.classList.toggle('is-on', pos);
    scanBadge.innerHTML = `${scan ? ICON.scanOn : ICON.scanOff}<span>Scan: <b>${scan ? 'sees cancer' : 'clear'}</b></span>`;
    bloodBadge.innerHTML = `${pos ? ICON.pos : ICON.neg}<span>Blood test: <b>${pos ? 'positive' : 'negative'}</b></span>`;
  }

  // ---------------------------------------------------------------- blood-sample panel
  function buildBlood() {
    bloodEl.replaceChildren();
    const horiz = compact;
    const VW = horiz ? Math.max(300, Math.round(chartEl.getBoundingClientRect().width || 340)) : 260;
    const VH = horiz ? 106 : 380;
    const svg = ctx.createSVG({ viewBox: `0 0 ${VW} ${VH}`, parent: bloodEl, interactive: false });
    const g = ctx.svg('g', {}, svg);
    // Tube in a local frame (vertical: x 0..tw across, y 0..th along; cap at y < 0). Phones:
    // rotated so the cap is on the left and the tube runs to the right.
    const tw = horiz ? 50 : 74;
    const th = horiz ? VW - 128 : 300;
    const T0 = horiz ? { x: 36, y: 44 + tw / 2 } : { x: 30, y: 40 };
    const frame = ctx.svg('g', { transform: horiz ? `translate(${T0.x} ${T0.y}) rotate(-90)` : `translate(${T0.x} ${T0.y})` }, g);
    const r = tw / 2;
    ctx.svg('path', { class: 'ct-tube', d: `M0,0V${th - r}A${r},${r} 0 0 0 ${tw},${th - r}V0` }, frame);
    ctx.svg('rect', { class: 'ct-cap', x: -5, y: -24, width: tw + 10, height: 26, rx: 5 }, frame);
    // Fragments: seeded scatter with a minimum spacing.
    const N = horiz ? 78 : 120;
    const L = horiz ? 10 : 12;
    const R = rng(1207);
    const pts = [];
    const minD = horiz ? 9.2 : 11.5;
    let guard = 0;
    while (pts.length < N && guard++ < 20000) {
      const x = 7 + R() * (tw - 14); const y = 14 + R() * (th - 20);
      if (y > th - r && Math.hypot(x - r, y - (th - r)) > r - 8) continue;
      if (pts.some((p) => Math.hypot(p.x - x, p.y - y) < minD)) continue;
      pts.push({ x, y, a: R() * 180 });
    }
    const [d1, d2] = helixD(L, L * 0.2);
    const frags = pts.map((p) => {
      const fg = ctx.svg('g', { class: 'ct-frag', transform: `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${p.a.toFixed(0)})` }, frame);
      ctx.svg('path', { class: 's', d: d1 }, fg);
      ctx.svg('path', { class: 's', d: d2 }, fg);
      ctx.svg('path', { class: 'tk', d: `M${(L * 0.12).toFixed(1)},-3.2V3.2` }, fg);
      return { ...p, g: fg };
    });
    // Tumor fragments light up in a fixed order; the first one sits mid-tube (under the lens).
    const mid = { x: tw / 2, y: th * (horiz ? 0.5 : 0.42) };
    const order = frags.map((f, i) => i).sort((a, b) => Math.hypot(frags[a].x - mid.x, frags[a].y - mid.y) - Math.hypot(frags[b].x - mid.x, frags[b].y - mid.y));
    const first = order.shift();
    const shuffled = order.map((i) => ({ i, k: R() })).sort((a, b) => a.k - b.k).map((o) => o.i);
    const perm = [first, ...shuffled];
    // Magnifier over the first tumor fragment.
    const f0 = frags[first];
    const toSvg = (p) => (horiz ? { x: T0.x + p.y, y: T0.y - p.x } : { x: T0.x + p.x, y: T0.y + p.y });
    const at = toSvg(f0);
    const lensR = horiz ? 29 : 36;
    const lens = horiz ? { x: VW - lensR - 8, y: 44 } : { x: T0.x + tw + 36 + lensR, y: Math.max(96, at.y - 34) };
    const mag = ctx.svg('g', { class: 'ct-mag is-off' }, g);
    const dx = at.x - lens.x; const dy = at.y - lens.y; const dl = Math.hypot(dx, dy) || 1;
    ctx.svg('line', { class: 'leader', x1: lens.x + (dx / dl) * lensR, y1: lens.y + (dy / dl) * lensR, x2: at.x, y2: at.y }, mag);
    ctx.svg('circle', { class: 'leader-dot', cx: at.x, cy: at.y, r: 2.5 }, mag);
    const hx = lens.x + lensR * 0.72; const hy = lens.y + lensR * 0.72;
    ctx.svg('line', { class: 'ct-handle', x1: hx, y1: hy, x2: hx + lensR * 0.42, y2: hy + lensR * 0.42 }, mag);
    ctx.svg('circle', { class: 'ct-lens', cx: lens.x, cy: lens.y, r: lensR }, mag);
    const big = ctx.svg('g', { class: 'ct-frag is-tumor', transform: `translate(${lens.x} ${lens.y}) rotate(-18) scale(${horiz ? 3.6 : 4.2})` }, mag);
    const [b1, b2] = helixD(L, L * 0.2);
    ctx.svg('path', { class: 's', d: b1, style: 'stroke-width:0.55' }, big);
    ctx.svg('path', { class: 's', d: b2, style: 'stroke-width:0.55' }, big);
    ctx.svg('path', { class: 'tk', d: `M${(L * 0.12).toFixed(1)},-3V3`, style: 'stroke-width:0.8' }, big);
    // Lens label.
    const lines = horiz ? ['the tumor’s own mutation identifies it'] : ['the tumor’s own', 'mutation', 'identifies it'];
    const lx = horiz ? VW - 2 : lens.x;
    const ly = horiz ? lens.y + lensR + 21 : lens.y + lensR + 26;
    const tl = ctx.svg('text', { class: `t-small ${horiz ? 't-end' : 't-mid'}`, x: lx, y: ly }, mag);
    lines.forEach((ln, k) => ctx.svg('tspan', { x: lx, dy: k ? '1.25em' : 0, text: ln }, tl));
    bloodEl.prepend(head);
    bloodEl.append(amount, real);
    blood = { svg, frags, perm, mag, n: -1 };
  }
  function paintBlood(y) {
    const n = fragmentsFor(y);
    if (n === blood.n) return;
    blood.n = n;
    blood.perm.forEach((i, k) => blood.frags[i].g.classList.toggle('is-tumor', k < n));
    blood.mag.classList.toggle('is-off', n === 0);
    amount.innerHTML = `ctDNA fragments: <b>${amountWord(n)}</b>`;
  }

  // ---------------------------------------------------------------- chart
  function buildChart() {
    chartEl.replaceChildren();
    const W = Math.max(300, Math.round(chartEl.getBoundingClientRect().width || 700));
    const gutter = compact ? 80 : 150;
    const top = compact ? 56 : 46;
    const plotH = compact ? 236 : 292;
    const px0 = 6; const px1 = W - gutter;
    const py0 = top; const py1 = top + plotH;
    const H = py1 + (compact ? 92 : 96);
    const svg = ctx.createSVG({ viewBox: `0 0 ${W} ${H}`, parent: chartEl, interactive: true,
      label: 'Illustrative chart: the amount of cancer in the body over 24 months, with the levels that scans and a blood test can detect. Use the playhead slider below to move through time.' });
    const g = chartRoot(svg);
    const x = scale({ domain: [0, 24], range: [px0, px1] });
    const y = scale({ domain: [Y.min, Y.max], range: [py1, py0] });
    const S = (tag, a, p = g) => ctx.svg(tag, a, p);

    // Y-axis title (two lines on phones), never rotated.
    const title = S('text', { class: 't-caps', x: px0, y: compact ? 14 : 20 });
    (compact ? ['Amount of cancer in the body', '(illustrative)'] : ['Amount of cancer in the body (illustrative)'])
      .forEach((s, k) => S('tspan', { x: px0, dy: k ? '1.35em' : 0, text: s }, title));

    // Zones: blood-only band (faint violet), too-little band (hatched), floors (dashed).
    S('rect', { x: px0, y: y(Y.scan), width: px1 - px0, height: y(Y.blood) - y(Y.scan), style: `fill:${C.fill('cancer')};fill-opacity:0.06` });
    S('rect', { x: px0, y: y(Y.blood), width: px1 - px0, height: py1 - y(Y.blood), style: `fill:${hatchFill(g, C.ink3, { spacing: 6, width: 1 })};opacity:0.5` });
    for (const v of [Y.scan, Y.blood]) {
      S('line', { x1: px0, x2: px1 + 6, y1: y(v), y2: y(v), class: 'ck-ref', style: `stroke:${C.ink2}`, 'stroke-dasharray': '5 4' });
    }
    // Floor labels in the right gutter.
    const lab = (yy, rows, cls = 'ct-thr') => {
      const tx = px1 + 12;
      const te = S('text', { class: cls, x: tx, y: yy });
      rows.forEach((s, k) => S('tspan', { x: tx, dy: k ? '1.2em' : 0, text: s }, te));
      return te;
    };
    if (compact) {
      lab(y(Y.scan) - 18, ['Visible on', 'scans']);
      lab(y(Y.blood) - 32, ['Detectable', 'by this', 'blood test']);
      lab(y(Y.blood) + 20, ['Too little', 'for this test', 'to detect'], 'ct-hatch-label');
    } else {
      lab(y(Y.scan) + 4, ['Visible on scans']);
      lab(y(Y.blood) - 4, ['Detectable by', 'this blood test']);
      lab((y(Y.blood) + py1) / 2 - 4, ['Too little for this', 'test to detect'], 'ct-hatch-label');
    }
    // Axis: "more" / "less" instead of numbers.
    S('line', { class: 'ck-axis', x1: px0, x2: px0, y1: py0 - 4, y2: py1 });
    S('path', { d: `M${px0 - 4},${py0 + 2}L${px0},${py0 - 6}L${px0 + 4},${py0 + 2}`, style: `fill:none;stroke:${C.axis};stroke-width:1.3;stroke-linejoin:round` });
    S('text', { class: 'ct-more t-halo', x: px0 + 9, y: compact ? py0 - 1 : py0 + 8, text: 'more' });
    S('text', { class: 'ct-more t-halo', x: px0 + 9, y: py1 - 7, text: 'less' });
    // X axis: months.
    S('line', { class: 'ck-axis', x1: px0, x2: px1, y1: py1, y2: py1 });
    for (const m of [0, 6, 12, 18, 24]) {
      S('line', { class: 'ck-axis', x1: x(m), x2: x(m), y1: py1, y2: py1 + 5 });
      S('text', { class: 't-small t-mid t-num', x: x(m), y: py1 + 21, text: String(m) });
    }
    S('text', { class: 'ct-lane', x: px1 + 18, y: py1 + 21, text: 'Months' });
    // Event lanes (surgery, treatment), labelled in the gutter.
    const laneS = py1 + 46; const laneT = py1 + 74;
    S('text', { class: 'ct-lane', x: px1 + 18, y: laneS + 4, text: 'Surgery' });
    S('text', { class: 'ct-lane', x: px1 + 18, y: laneT + 4, text: 'Treatment' });
    S('line', { x1: px0, x2: px1, y1: laneS, y2: laneS, style: `stroke:${C.grid}` });
    S('line', { x1: px0, x2: px1, y1: laneT, y2: laneT, style: `stroke:${C.grid}` });

    const scenG = S('g', { class: 'ct-scen' });
    const headG = S('g', { class: 'ct-head' });
    // the rule skips the month-label row so a parked playhead never strikes through "24"
    const rule = S('path', { class: 'ct-rule', d: '', 'data-y': `${py0 - 4} ${py1 + 6} ${py1 + 28} ${laneT + 10}` }, headG);
    const dot = S('circle', { r: 6, style: `fill:${C.fill('cancer')};stroke:${C.surface};stroke-width:2.5` }, headG);
    const hit = S('rect', { class: 'ct-hit', x: px0, y: py0 - 6, width: px1 - px0, height: laneT + 14 - py0 });
    el = { svg, g, x, y, scenG, headG, rule, dot, hit, px0, px1, py0, py1, laneS, laneT };

    // Drag on the chart to scrub (the slider below is the keyboard-accessible control).
    let dragging = false;
    const toMonth = (e) => {
      const m = svg.getScreenCTM();
      if (!m) return t;
      const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
      return Math.max(0, Math.min(24, x.invert(p.x)));
    };
    hit.addEventListener('pointerdown', (e) => { dragging = true; try { hit.setPointerCapture(e.pointerId); } catch { /* ignore */ } stopPlay(); setT(toMonth(e), { user: true }); }, { signal: ctx.signal });
    hit.addEventListener('pointermove', (e) => { if (dragging) setT(toMonth(e), { user: true }); }, { signal: ctx.signal });
    const end = () => { dragging = false; };
    hit.addEventListener('pointerup', end, { signal: ctx.signal });
    hit.addEventListener('pointercancel', end, { signal: ctx.signal });
  }

  function drawScenario({ animate = false } = {}) {
    const { scenG, x, y, px0, py0, py1, laneS, laneT } = el;
    scenG.replaceChildren();
    const sc = current();
    const S = (tag, a, p = scenG) => ctx.svg(tag, a, p);
    const ink = ctx.svg('g', {}, scenG);
    // Lead-time band (hidden leftover): blood test positive → scan sees it.
    if (sc.lead) {
      const b = band(ink, { x0: x(sc.lead[0]), x1: x(sc.lead[1]), y0: py0 - 2, y1: py1, color: C.accent, opacity: 0.07 });
      b.rect.setAttribute('rx', 4);
      const cx = (x(sc.lead[0]) + x(sc.lead[1])) / 2;
      const lt = S('text', { class: 't-caps t-mid t-halo', x: cx, y: py0 + 16 }, ink);
      (compact ? ['Lead time:', 'months'] : ['Lead time: months']).forEach((ln, k) => S('tspan', { x: cx, dy: k ? '1.25em' : 0, text: ln }, lt));
      const by = py0 + (compact ? 41 : 26);
      S('path', { d: `M${x(sc.lead[0]) + 3},${by}H${x(sc.lead[1]) - 3}`, style: `stroke:${C.accent};stroke-width:1.4;fill:none`, 'stroke-linecap': 'round' }, ink);
      for (const m of sc.lead) S('line', { x1: x(m), x2: x(m), y1: by - 5, y2: by + 5, style: `stroke:${C.accent};stroke-width:1.4`, 'stroke-linecap': 'round' }, ink);
      lt.setAttribute('style', `fill:${C.accent}`);
    }
    // Untreated course as a ghost when the toggle is on.
    if (scen === 'hidden' && treat) {
      const ghost = SCENARIOS.hidden;
      line(ink, sample(ghost.f).map(([m, v]) => [x(m), y(v)]), { curve: 'linear', color: C.stroke('cancer'), width: 1.6, dash: '3 4', opacity: 0.45 });
      if (compact) {   // two short lines inside the plot, clear of the gutter labels
        const gt = S('text', { class: 't-small t-halo t-mid', x: x(18.5), y: y(ghost.f(18.5)) - 25 }, ink);
        ['without early', 'treatment'].forEach((ln, k) => S('tspan', { x: x(18.5), dy: k ? '1.15em' : 0, text: ln }, gt));
      } else S('text', { class: 't-small t-halo', x: x(15.5), y: y(ghost.f(15.5)) - 10, text: 'without early treatment' }, ink);
    }
    // The curve.
    const curve = line(scenG, sample(sc.f).map(([m, v]) => [x(m), y(v)]), { curve: 'linear', color: C.stroke('cancer'), width: 3, drawIn: true });
    // Flag (relapse): "blood test rises".
    if (sc.flag != null) {
      const fx = x(sc.flag); const fy = y(sc.f(sc.flag));
      const fg = S('g', { class: 'ct-flagg' });
      S('line', { x1: fx, x2: fx, y1: fy - 4, y2: fy - 38, style: `stroke:${C.ink2};stroke-width:1.3` }, fg);
      S('path', { d: `M${fx},${fy - 38}h11l-4,5l4,5h-11z`, style: `fill:${C.fill('cancer')}` }, fg);
      const ft = S('text', { class: 'ct-flag t-halo t-mid', x: fx, y: compact ? fy - 60 : fy - 46 }, fg);
      (compact ? ['blood test', 'rises'] : ['blood test rises']).forEach((ln, k) => S('tspan', { x: fx, dy: k ? '1.15em' : 0, text: ln }, ft));
      curve.flag = fg;
    }
    // Events: surgery (scalpel) and treatment doses (drug antibodies).
    const ev = S('g', { class: 'ct-events' });
    if (sc.surgery) ctx.iconSVG('scalpel', { x: x(SURGERY), y: laneS, size: compact ? 20 : 22, color: 'var(--fg)', strokeWidth: 1.9 }, ev);
    if (sc.doses.length > 1) S('line', { class: 'ct-period', x1: x(sc.doses[0]), x2: x(sc.doses[sc.doses.length - 1]), y1: laneT, y2: laneT }, ev);
    // Narrow plots: draw every other dose icon (the gold period line keeps the continuity).
    const thin = sc.doses.length > 6 && x(2) - x(0) < 26;
    for (const m of sc.doses.filter((_, k) => !thin || k % 2 === 0)) {
      const ab = antibody({ variant: 'therapeutic', size: compact ? 12 : 17, stage: ctx.artStage, anchor: 'center' });
      ab.setAttribute('transform', `translate(${x(m)} ${laneT})`);
      ev.append(ab);
    }
    el.curve = curve;
    if (animate && !ctx.reducedMotion) {
      curve.drawIn({ duration: 0.7 });
      const extras = [ink, ev, curve.flag].filter(Boolean);
      gsap.fromTo(extras, { opacity: 0 }, { opacity: 1, duration: 0.45, delay: 0.35, ease: 'so.out' });
    } else {
      curve.drawIn({ duration: 0 });
    }
  }
  const sample = (f) => { const out = []; for (let m = 0; m <= 24 + 1e-9; m += 0.1) out.push([m, f(m)]); return out; };

  function renderHead() {
    const { x, y, rule, dot } = el;
    const v = valueAt(t);
    const [a, b, c, d] = rule.getAttribute('data-y').split(' ').map(Number);
    const X = Math.round(x(t) * 100) / 100;
    rule.setAttribute('d', `M${X} ${a}V${b}M${X} ${c}V${d}`);
    dot.setAttribute('cx', x(t)); dot.setAttribute('cy', y(Math.max(Y.min, Math.min(Y.max, v))));
    paintBadges(v);
    paintBlood(v);
  }

  // ---------------------------------------------------------------- playhead
  function setT(v, { user = false } = {}) {
    t = Math.max(0, Math.min(24, v));
    slider.set(Math.round(t * 2) / 2, { silent: true });
    renderHead();
    const st = statusText(t);
    if (user && st !== lastState) ctx.announce(`${monthText(Math.round(t))}: ${st}`);
    lastState = st;
  }
  function startPlay({ fromStart = true } = {}) {
    stopPlay();
    if (fromStart) setT(0);
    play.set(true);
    const proxy = { v: t };
    playTween = gsap.to(proxy, {
      v: 24, duration: 6 * ((24 - t) / 24), ease: 'none',
      onUpdate: () => setT(proxy.v),
      onComplete: () => { playTween = null; play.set(false); ctx.announce(`${monthText(24)}: ${statusText(24)}`); },
    });
  }
  function stopPlay() {
    if (playTween) { playTween.kill(); playTween = null; }
    play.set(false);
  }

  // ---------------------------------------------------------------- scenarios
  function setScenario(v) {
    if (v === scen) return;
    scen = v;
    seg.set(v);
    scenarioChanged();
  }
  function scenarioChanged() {
    toggle.el.hidden = scen !== 'hidden';
    syncCaption();
    stopPlay();
    drawScenario({ animate: started });
    const capIdx = current().cap;
    ctx.announce(`${current().label}${scen === 'hidden' && treat ? ', treated when the blood test turns positive' : ''}. ${ctx.steps[capIdx]?.text || ''}`);
    if (!started) { setT(ctx.reducedMotion ? 24 : 0); return; }
    if (ctx.reducedMotion) setT(24);
    else { setT(0); gsap.delayedCall(0.35, () => startPlay({ fromStart: true })); }
  }

  // ---------------------------------------------------------------- lifecycle
  function rebuild() {
    buildBlood();
    buildChart();
    drawScenario({ animate: false });
    blood.n = -1;
    renderHead();
  }
  ctx.onResize(({ compact: c }) => {
    const w = F.main.getBoundingClientRect().width || ctx.width;
    if (c === compact && Math.abs(w - lastW) < 6 && el.svg) return;
    compact = c;
    lastW = w;
    main.prepend(bloodEl);
    rebuild();
  });
  ctx.onThemeChange(() => { drawScenario({ animate: false }); renderHead(); });
  syncCaption();
  setT(ctx.reducedMotion ? 24 : 0);
  if (!ctx.reducedMotion) gsap.set(el.curve.path, { drawSVG: '0%' });

  ctx.onceVisible(() => {
    started = true;
    if (ctx.reducedMotion) { setT(24); return; }
    el.curve.drawIn({ duration: 0.7 });
    gsap.delayedCall(0.4, () => startPlay({ fromStart: true }));
  }, 0.4);

  return {
    pause() { if (playTween) { wasPlaying = true; playTween.pause(); } },
    resume() { if (wasPlaying && playTween) playTween.resume(); wasPlaying = false; },
    destroy() { stopPlay(); },
  };
}
