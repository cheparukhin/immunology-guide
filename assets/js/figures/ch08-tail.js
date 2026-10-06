// ch08-tail — "The tail of the curve" (Figure 8.3)
//
// Simplified overall-survival curves for advanced melanoma: CheckMate 067 (ipilimumab, nivolumab,
// nivolumab + ipilimumab) plus a faded dacarbazine curve from an earlier trial. Monotone curves
// through the published percentages (dots, with source tooltips), a time cursor + slider with a
// readout (published / approximate / no data), a "100 people" unit grid, and a "long tail" band.
// Real data on a light stage: chart tokens + line styles (FIGURE-AUDIT §4 rules 19–20), the
// smoothing footnote and source line always visible (§7.10). Guided 5-step tour, then free.
import { C, scale, chartRoot, axis, line, marker, threshold, band, directLabel, cursor, chartFrame, tweenTo } from './shared/chart.js';
import { unitGrid } from './shared/unit-grid.js';

const ID = 'ch08-tail';

// ------------------------------------------------------------------ data (verbatim from the spec)
// Months from randomization → % alive. `m: true` marks a median (50% by definition).
const SRC = {
  14: 'Robert 2011, <em>NEJM</em>',
  15: 'Wolchok 2017, <em>NEJM</em> (3-year analysis)',
  19: 'Larkin 2019, <em>NEJM</em> (5-year analysis)',
  7: 'Wolchok 2025, <em>NEJM</em> (10-year analysis)',
};
const SERIES = [
  { id: 'chemo', label: 'Chemotherapy (earlier trial)', short: 'Chemotherapy', color: C.s5, width: 2.2, dash: '0.5 5.5', n: 252,
    pts: [[0, 100], [9.1, 50, 14, true], [12, 36.3, 14], [24, 17.9, 14], [36, 12.2, 14]],
    who: 'dacarbazine chemotherapy (earlier trial)' },
  { id: 'ipi', label: 'Ipilimumab', short: 'Ipilimumab', color: C.s3, width: 2.6, dash: '10 6', n: 315,
    pts: [[0, 100], [19.9, 50, 7, true], [24, 45, 15], [36, 34, 15], [60, 26, 19], [90, 22, 7], [120, 19, 7]],
    who: 'ipilimumab' },
  { id: 'nivo', label: 'Nivolumab', short: 'Nivolumab', color: C.s2, width: 2.6, dash: null, n: 316,
    pts: [[0, 100], [24, 59, 15], [36, 52, 15], [36.9, 50, 7, true], [60, 44, 19], [90, 42, 7], [120, 37, 7]],
    who: 'nivolumab' },
  { id: 'combo', label: 'Nivolumab + ipilimumab', short: 'Nivolumab + ipilimumab', color: C.s1, width: 3.8, dash: null, n: 314,
    pts: [[0, 100], [24, 64, 15], [36, 58, 15], [60, 52, 19], [71.9, 50, 7, true], [90, 48, 7], [120, 43, 7]],
    who: 'nivolumab + ipilimumab' },
];
const BY = Object.fromEntries(SERIES.map((s) => [s.id, s]));
const FOOTNOTE = 'Simplified: smooth curves drawn through published survival percentages (dots), not the trials’ actual curves. Chemotherapy comes from a different, earlier trial, so compare with caution.';
const TAIL_NOTE = 'After year 3 the curves keep sloping down, but gently. Counting only deaths from melanoma, the ten-year figures are higher: 52%, 44% and 23%.';
const cite = (n) => `[<a href="#src-${n}" aria-label="Source ${n}">${n}</a>]`;
const SOURCE_HTML = `Sources: CheckMate 067 ${cite(15)}${cite(19)}${cite(7)}; chemotherapy ${cite(14)}.`;

// Step states: visible series, cursor time (years), grid series, long tail on.
const STEPS = [
  { show: ['chemo'], t: 3, sel: 'chemo', tail: false },
  { show: ['chemo', 'ipi'], t: 10, sel: 'ipi', tail: false },
  { show: ['chemo', 'ipi', 'nivo', 'combo'], t: 10, sel: 'combo', tail: false },
  { show: ['chemo', 'ipi', 'nivo', 'combo'], t: 3, sel: 'combo', tail: true },
  { show: ['chemo', 'ipi', 'nivo', 'combo'], t: 5, sel: 'combo', tail: true },
];

// ------------------------------------------------------------------ monotone interpolation
// Same Fritsch–Carlson tangents as chart.js pathD (affine-invariant), so readouts match the drawn curve.
function monotone(pts) {
  const n = pts.length;
  const dx = [], m = [];
  for (let i = 0; i < n - 1; i++) { dx[i] = pts[i + 1][0] - pts[i][0]; m[i] = (pts[i + 1][1] - pts[i][1]) / (dx[i] || 1e-9); }
  const t = new Array(n);
  t[0] = m[0]; t[n - 1] = m[n - 2];
  for (let i = 1; i < n - 1; i++) t[i] = m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2;
  for (let i = 0; i < n - 1; i++) {
    if (m[i] === 0) { t[i] = 0; t[i + 1] = 0; continue; }
    const a = t[i] / m[i], b = t[i + 1] / m[i], s2 = a * a + b * b;
    if (s2 > 9) { const tau = 3 / Math.sqrt(s2); t[i] = tau * a * m[i]; t[i + 1] = tau * b * m[i]; }
  }
  return (x) => {
    if (x <= pts[0][0]) return pts[0][1];
    if (x > pts[n - 1][0] + 1e-9) return null;
    let i = 0;
    while (i < n - 2 && x > pts[i + 1][0]) i++;
    const h = dx[i], s = (x - pts[i][0]) / h;
    const h00 = 2 * s ** 3 - 3 * s ** 2 + 1, h10 = s ** 3 - 2 * s ** 2 + s, h01 = -2 * s ** 3 + 3 * s ** 2, h11 = s ** 3 - s ** 2;
    return h00 * pts[i][1] + h10 * h * t[i] + h01 * pts[i + 1][1] + h11 * h * t[i + 1];
  };
}
for (const s of SERIES) {
  s.yrs = s.pts.map(([mo, v, src, med]) => ({ x: mo / 12, mo, v, src, med: !!med }));
  s.f = monotone(s.yrs.map((p) => [p.x, p.v]));
  s.last = s.yrs[s.yrs.length - 1].x;
}

/** { v, status: 'start' | 'published' | 'approximate' | 'none', src } for series s at t years. */
function valueAt(s, t) {
  if (t > s.last + 1e-9) return { v: null, status: 'none' };
  if (t <= 1e-9) return { v: 100, status: 'start' };
  const hit = s.yrs.find((p) => Math.abs(p.x - t) < 1e-6 && p.src);
  if (hit) return { v: hit.v, status: 'published', src: hit.src };
  return { v: s.f(t), status: 'approximate' };
}
const yearsText = (t) => (t === 1 ? '1 year' : `${String(Math.round(t * 10) / 10)} years`);
const monthsText = (mo) => `${String(Math.round(mo * 10) / 10)} months`;

// ------------------------------------------------------------------ layouts
const LAYOUTS = {
  wide: { vb: [720, 436], X0: 62, X1: 520, Y0: 34, Y1: 372, labelX: 530, xLabels: true, grid: { size: 21, gap: 5 },
    chemoLabel: { dx: 9, dy: 4, sub: 18 }, median: 'end1' },
  compact: { vb: [400, 344], X0: 46, X1: 302, Y0: 30, Y1: 280, labelX: 307, xLabels: [0, 2, 4, 6, 8, 10], grid: { size: 25, gap: 6 },
    chemoLabel: { dx: 8, dy: 4, sub: 16 }, median: 'end2' },
};

const CSS = `
[data-figure="${ID}"] .tl-grid { display: grid; grid-template-columns: minmax(0, 1fr) 17.5rem; grid-template-rows: auto auto 1fr; grid-template-areas: "chart side" "scrub side" "notes side"; gap: 14px 28px; align-items: start; }
[data-figure="${ID}"].is-compact .tl-grid { grid-template-columns: minmax(0, 1fr); grid-template-rows: auto; grid-template-areas: "chart" "notes"; gap: 14px; }
[data-figure="${ID}"] .tl-chart { grid-area: chart; min-width: 0; }
[data-figure="${ID}"] .tl-chart > svg { display: block; width: 100%; height: auto; overflow: visible; }
[data-figure="${ID}"] .tl-phone { flex: 1 1 100%; display: flex; flex-direction: column; gap: 14px; min-width: 0;
  --fg: var(--ink); --fg-2: var(--ink-2); --fg-3: var(--ink-3); --line: var(--rule-strong); --grid: var(--chart-grid); --halo: var(--surface); --stage-focus: var(--accent); }
[data-figure="${ID}"] .tl-scrub { grid-area: scrub; display: flex; flex-wrap: wrap; align-items: center; gap: 10px 20px; }
[data-figure="${ID}"] .tl-scrub .slider { flex: 1 1 16rem; }
[data-figure="${ID}"] .tl-notes { grid-area: notes; display: flex; flex-direction: column; gap: 6px; }
[data-figure="${ID}"] .tl-side { grid-area: side; display: flex; flex-direction: column; gap: 10px; font-family: var(--font-ui); color: var(--fg); }
[data-figure="${ID}"] .tl-count { margin: 0; font-size: 16px; line-height: 1.35; font-weight: 500; font-variant-numeric: tabular-nums; min-height: 2.7em; }
[data-figure="${ID}"] .tl-count b { font-weight: 680; }
[data-figure="${ID}"] .tl-who { margin: 0; display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--fg-2); }
[data-figure="${ID}"] .tl-people { display: block; width: 100%; max-width: 17.5rem; height: auto; }
[data-figure="${ID}"].is-compact .tl-people { max-width: 16.5rem; }
[data-figure="${ID}"] .tl-key { margin: 0; font-size: 12px; color: var(--fg-3); }
[data-figure="${ID}"] .tl-readout { list-style: none; margin: 4px 0 0; padding: 0; display: flex; flex-direction: column; gap: 2px; }
[data-figure="${ID}"] .tl-row { display: grid; grid-template-columns: 22px minmax(0, 1fr) auto; align-items: center; gap: 8px; width: 100%; min-height: 40px; padding: 4px 8px; border-radius: 8px; border: 1px solid transparent; background: none; text-align: left; font: inherit; font-size: 14px; line-height: 1.25; color: var(--fg); cursor: pointer; }
[data-figure="${ID}"] .tl-row:hover { background: color-mix(in srgb, var(--fg) 5%, transparent); }
[data-figure="${ID}"] .tl-row[aria-pressed="true"] { border-color: var(--line); background: color-mix(in srgb, var(--fg) 6%, transparent); }
[data-figure="${ID}"] .tl-row:focus-visible { outline: 2px solid var(--stage-focus); outline-offset: 1px; }
[data-figure="${ID}"] .tl-row[hidden] { display: none; }
[data-figure="${ID}"] .tl-row svg, [data-figure="${ID}"] .tl-who svg { flex: none; width: 22px; height: 12px; overflow: visible; }
[data-figure="${ID}"] .tl-val { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
[data-figure="${ID}"] .tl-val b { font-weight: 650; }
[data-figure="${ID}"] .tl-val span { display: block; font-size: 12px; color: var(--fg-3); }
[data-figure="${ID}"] .tl-val span a { color: inherit; }
[data-figure="${ID}"] .tl-foot, [data-figure="${ID}"] .tl-tailnote { margin: 0; max-width: 78ch; font: 400 13px/1.5 var(--font-ui); color: var(--fg-2); text-wrap: pretty; }
[data-figure="${ID}"] .tl-tailnote { display: flex; gap: 8px; align-items: baseline; padding: 6px 10px; border-radius: 8px; background: color-mix(in srgb, var(--fg) 5%, transparent); color: var(--fg); }
[data-figure="${ID}"] .tl-tailnote[hidden] { display: none; }
[data-figure="${ID}"] .tl-tailnote::before { content: ""; flex: none; width: 10px; height: 10px; border-radius: 2px; background: color-mix(in srgb, var(--fg) 18%, transparent); transform: translateY(1px); }
[data-figure="${ID}"] .tl-src { margin: 0; max-width: 78ch; font: 400 12px/1.5 var(--font-ui); color: var(--fg-3); }
[data-figure="${ID}"] .tl-src a { color: inherit; }
[data-figure="${ID}"] .tl-tailbtn[aria-pressed="true"] { background: var(--accent-soft); border-color: var(--accent); color: var(--ink); }
[data-figure="${ID}"] svg .tl-hit { fill: none; stroke: transparent; stroke-width: 16; pointer-events: stroke; cursor: pointer; }
[data-figure="${ID}"] svg .tl-dot-hit { fill: transparent; cursor: help; }
[data-figure="${ID}"] svg .tl-curve-label { cursor: pointer; }
[data-figure="${ID}"] svg .tl-brace { fill: none; stroke: var(--fg-2); stroke-width: 1.4; stroke-linecap: round; stroke-linejoin: round; vector-effect: non-scaling-stroke; }
[data-figure="${ID}"] svg .tl-sel .ck-line path { filter: drop-shadow(0 0 0.5px var(--fg)); }
@container (max-width: 880px) {
  [data-figure="${ID}"] .tl-grid { grid-template-columns: minmax(0, 1fr); grid-template-rows: auto; grid-template-areas: "chart" "scrub" "notes" "side"; }
  [data-figure="${ID}"] .tl-side { display: grid; grid-template-columns: minmax(0, 17.5rem) minmax(0, 1fr); grid-template-areas: "count count" "who list" "people list" "key list"; gap: 8px 28px; }
  [data-figure="${ID}"] .tl-count { grid-area: count; min-height: 0; }
  [data-figure="${ID}"] .tl-who { grid-area: who; }
  [data-figure="${ID}"] .tl-side > div { grid-area: people; }
  [data-figure="${ID}"] .tl-key { grid-area: key; }
  [data-figure="${ID}"] .tl-readout { grid-area: list; align-self: start; }
}
[data-figure="${ID}"].is-compact .tl-side { display: flex; }
`;
function injectCSS() {
  if (document.getElementById(`${ID}-css`)) return;
  const s = document.createElement('style');
  s.id = `${ID}-css`;
  s.textContent = CSS;
  document.head.append(s);
}

const keySVG = (s) => `<svg viewBox="0 0 22 12" aria-hidden="true"><line x1="1" x2="21" y1="6" y2="6" stroke-width="${Math.min(3.4, s.width)}" stroke-linecap="round" style="stroke:${s.color}"${s.dash ? ` stroke-dasharray="${s.id === 'chemo' ? '0.5 4.5' : '6 3.5'}"` : ''}/></svg>`;

export default function mount(fig, ctx) {
  injectCSS();
  const { gsap } = ctx;
  const F = chartFrame(ctx, { source: '', card: false });

  // ---------------------------------------------------------------- HTML scaffold
  const wrap = ctx.h('div', { class: 'tl-grid' });
  const chartBox = ctx.h('div', { class: 'tl-chart' });
  const scrub = ctx.h('div', { class: 'tl-scrub' });
  const notes = ctx.h('div', { class: 'tl-notes' });
  const side = ctx.h('div', { class: 'tl-side' });
  wrap.append(chartBox, scrub, notes, side);
  F.main.append(wrap);
  // Phones (POLISH, foundation S2): the stage keeps only the chart and its honesty notes (smoothing
  // footnote, sources, long-tail note) so the stepper and caption sit right under them; the time
  // slider and the 100-people panel move after the caption, with the figure's other controls.
  const phoneBox = ctx.h('div', { class: 'tl-phone ck ck--light' });
  function placeParts(c) {
    if (c) { phoneBox.append(scrub, side); if (!phoneBox.isConnected) ctx.controls.append(phoneBox); }
    else { wrap.append(scrub, side); phoneBox.remove(); }
  }

  const tailNote = ctx.h('p', { class: 'tl-tailnote', hidden: true }, TAIL_NOTE);
  const foot = ctx.h('p', { class: 'tl-foot' }, FOOTNOTE);
  const src = ctx.h('p', { class: 'tl-src', html: SOURCE_HTML });
  notes.append(tailNote, foot, src);

  const count = ctx.h('p', { class: 'tl-count', 'aria-live': 'polite' });
  const who = ctx.h('p', { class: 'tl-who' });
  const peopleBox = ctx.h('div');
  const key = ctx.h('p', { class: 'tl-key' }, 'Filled figure = alive · outline = had died');
  const readout = ctx.h('ul', { class: 'tl-readout', 'aria-label': 'Survival at the time marker' });
  side.append(count, who, peopleBox, key, readout);

  // ---------------------------------------------------------------- state
  let L = LAYOUTS.wide;
  let compact = null;
  let step = -1;
  let selected = 'combo';
  let shown = new Set(['chemo']);
  let tailUser = true;           // the free "Show the long tail" toggle (step 5)
  const tp = { t: 0 };           // cursor time (years), tweened by the stepper
  let curT = 0;
  const E = {};                  // drawn elements for the current layout
  let grids = {};
  let gridsBuilt = false;

  // ---------------------------------------------------------------- readout rows (HTML)
  const rowEls = {};
  for (const s of [...SERIES].reverse()) {
    const b = ctx.h('button', { type: 'button', class: 'tl-row', 'aria-pressed': 'false' });
    b.innerHTML = `${keySVG(s)}<span>${s.label}</span><span class="tl-val"></span>`;
    b.addEventListener('click', () => select(s.id), { signal: ctx.signal });
    const li = ctx.h('li');
    li.append(b);
    readout.append(li);
    rowEls[s.id] = b;
  }

  // ---------------------------------------------------------------- controls (in-stage)
  const slider = ctx.ui.slider({
    label: 'Time since starting treatment', min: 0, max: 10, step: 0.5, value: 0, parent: scrub,
    format: (v) => yearsText(Number(v)), describe: (v) => yearsText(Number(v)),
    onInput: (v) => setTime(Number(v), 'slider'),
  });
  const tailBtn = ctx.ui.button({ label: 'Show the long tail', parent: scrub, small: true, pressed: false, onClick: () => toggleTail() });
  const tailBtnEl = tailBtn.el;
  tailBtnEl.classList.add('tl-tailbtn');

  // ---------------------------------------------------------------- chart
  function draw() {
    chartBox.replaceChildren();
    const [W, H] = L.vb;
    const svg = ctx.createSVG({ viewBox: `0 0 ${W} ${H}`, parent: chartBox, interactive: true,
      label: 'Survival curves: percent of patients alive over ten years for chemotherapy, ipilimumab, nivolumab, and nivolumab plus ipilimumab. Use the time slider below the chart to read values.' });
    const g = chartRoot(svg, { theme: 'light' });
    const x = scale({ domain: [0, 10], range: [L.X0, L.X1] });
    const y = scale({ domain: [0, 100], range: [L.Y1, L.Y0] });
    E.svg = svg; E.g = g; E.x = x; E.y = y;

    // long-tail band (behind everything); outer group = stepper, inner group = reader toggle
    E.tailOuter = ctx.svg('g', { class: 'tl-tail', opacity: 0 }, g);
    E.tailInner = ctx.svg('g', {}, E.tailOuter);
    band(E.tailInner, { x0: x(3), x1: x(10), y0: L.Y0, y1: L.Y1, color: C.ink, opacity: 0.055 });

    axis(g, { scale: y, orient: 'left', at: L.X0, ticks: [0, 20, 40, 60, 80, 100], format: (v) => `${v}%`, grid: [L.X0, L.X1], tickSize: 0, title: '% of patients alive', line: false });
    axis(g, { scale: x, orient: 'bottom', at: L.Y1, ticks: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], labels: L.xLabels, tickSize: 4, title: 'Years since starting treatment' });

    // median threshold
    const thr = threshold(g, { y: y(50), x0: L.X0, x1: L.X1, color: C.ink3 });
    if (L.median === 'end1') {
      ctx.svg('text', { class: 't-small t-end', x: L.X1, y: y(50) - 7, text: 'half alive (median)' }, thr.el);
    } else {
      const tx = ctx.svg('text', { class: 't-small t-end', x: L.X1, y: y(50) - 22 }, thr.el);
      ctx.svg('tspan', { x: L.X1, dy: 0, text: 'half alive' }, tx);
      ctx.svg('tspan', { x: L.X1, dy: '1.15em', text: '(median)' }, tx);
    }

    // brace over the two nivolumab-containing tails
    const by = y(70), bx0 = x(3) + 4, bx1 = x(10) - 2, bm = (bx0 + bx1) / 2, bh = 9;
    ctx.svg('path', { class: 'tl-brace', d: `M${bx0} ${by - bh}Q${bx0} ${by} ${bx0 + 12} ${by}H${bm - 12}Q${bm} ${by} ${bm} ${by + bh}Q${bm} ${by} ${bm + 12} ${by}H${bx1 - 12}Q${bx1} ${by} ${bx1} ${by - bh}` }, E.tailInner);
    ctx.svg('text', { class: 't-label t-mid t-halo', x: bm, y: by - 14, text: 'the long tail' }, E.tailInner);

    // cursor (pointer/touch on the chart; the HTML slider is the keyboard control)
    E.cursor = cursor(ctx, g, { scale: x, step: 0.5, value: 0, y0: L.Y0, y1: L.Y1, label: 'Time marker', format: yearsText,
      onMove: (v, { source }) => { if (source !== 'api') setTime(v, 'chart'); } });
    E.cursor.el.setAttribute('tabindex', '-1');
    E.cursor.el.setAttribute('aria-hidden', 'true');

    // series
    E.series = {};
    for (const s of SERIES) {
      const sg = ctx.svg('g', { class: `tl-series tl-${s.id}`, opacity: 0 }, g);
      const pts = s.yrs.map((p) => [x(p.x), y(p.v)]);
      const ln = line(sg, pts, { curve: 'monotone', color: s.color, width: s.width, dash: s.dash || undefined, drawIn: true });
      const hit = ctx.svg('path', { class: 'tl-hit', d: ln.d }, sg);
      ctx.on(hit, 'click', () => select(s.id));
      const dots = ctx.svg('g', { class: 'tl-dots', opacity: 0 }, sg);
      for (const p of s.yrs) {
        if (!p.src) continue;
        marker(dots, { x: x(p.x), y: y(p.v), r: s.id === 'combo' ? 4.2 : 3.6, color: s.color });
        const h = ctx.svg('circle', { class: 'tl-dot-hit', cx: x(p.x), cy: y(p.v), r: 11 }, dots);
        const tip = () => {
          const lines = p.med
            ? `Median survival: <b>${monthsText(p.mo)}</b> — half of the patients were alive`
            : `${yearsText(p.x)} (${monthsText(p.mo)}): <b>${p.v}%</b> alive`;
          const extra = s.id === 'ipi' && p.src === 15 ? '<br>By this analysis, 43% of the ipilimumab group had received a PD-1 blocker.' : '';
          const note = p.mo === 90 ? ' (7.5-year survival, as reported in its introduction)' : '';
          return `<strong>${s.label}</strong><br>${lines}${extra}<br><span style="color:var(--ink-3)">Published value · ${SRC[p.src]} [${p.src}]${note}</span>`;
        };
        ctx.on(h, 'pointerenter', (e) => { if (e.pointerType === 'mouse') ctx.tooltip.show(tip(), h); });
        ctx.on(h, 'pointerleave', () => ctx.tooltip.hide());
        ctx.on(h, 'click', (e) => { e.stopPropagation(); ctx.tooltip.show(tip(), h); });
      }
      E.series[s.id] = { g: sg, ln, dots, hit };
    }
    // direct labels at line ends (no legend box); chemo's sits at its last point
    E.labels = {};
    const ends = ['combo', 'nivo', 'ipi'].map((id) => ({ id, y: y(BY[id].f(10)) + 4, h: compact ? (id === 'combo' ? 30 : 16) : 18 }));
    // nudge apart (two-line labels on phones take more room)
    ends.sort((a, b) => a.y - b.y);
    for (let i = 1; i < ends.length; i++) {
      const need = (ends[i - 1].h + ends[i].h) / 2 + 2;
      if (ends[i].y - ends[i - 1].y < need) ends[i].y = ends[i - 1].y + need;
    }
    if (compact) { const c = ends.find((e) => e.id === 'combo'); if (c) { c.y -= 6; } }
    for (const e of ends) {
      const s = BY[e.id];
      const lg = ctx.svg('g', { class: 'tl-curve-label', opacity: 0, role: 'presentation' }, g);
      const endY = y(s.f(10));
      if (Math.abs(e.y - 4 - endY) > 3) ctx.svg('line', { class: 'leader', x1: L.X1 + 3, y1: endY, x2: L.labelX - 2, y2: e.y - 5 }, lg);
      const text = compact && e.id === 'combo' ? ['Nivolumab +', 'ipilimumab'] : [s.short];
      const tx = ctx.svg('text', { class: `${compact ? 't-small' : 't-label'} t-halo`, style: 'fill: var(--fg)', x: L.labelX + 2, y: e.y - (text.length - 1) * 8 }, lg);
      text.forEach((ln, i) => ctx.svg('tspan', { x: L.labelX + 2, dy: i ? '1.1em' : 0, text: ln }, tx));
      ctx.on(lg, 'click', () => select(e.id));
      E.labels[e.id] = lg;
    }
    {
      const s = BY.chemo, last = s.yrs[s.yrs.length - 1];
      const lg = ctx.svg('g', { class: 'tl-curve-label', opacity: 0 }, g);
      directLabel(lg, { x: x(last.x) + L.chemoLabel.dx, y: y(last.v) + L.chemoLabel.dy, text: s.label, dx: 0, className: compact ? 't-small' : 't-label' });
      ctx.svg('text', { class: 't-small t-muted t-halo', x: x(last.x) + L.chemoLabel.dx, y: y(last.v) + L.chemoLabel.dy + L.chemoLabel.sub, text: 'no data after year 3' }, lg);
      ctx.on(lg, 'click', () => select('chemo'));
      E.labels.chemo = lg;
    }
  }

  // ---------------------------------------------------------------- people grid + readout
  // One grid per series, built once per layout (no ids churn on selection), only one shown.
  function buildGrids() {
    peopleBox.replaceChildren();
    const { size, gap } = L.grid;
    const span = size * 10 + gap * 9;
    const svg = ctx.createSVG({ viewBox: `-2 -2 ${span + 4} ${span + 4}`, parent: peopleBox, className: 'tl-people', label: '100 people' });
    svg.style.position = 'static';
    const g = chartRoot(svg, { theme: 'light' });
    grids = {};
    for (const s of SERIES) {
      const gg = ctx.svg('g', { display: 'none' }, g);
      grids[s.id] = unitGrid(gg, { count: 100, cols: 10, size, gap, shape: 'person', color: s.color, state: 'filled' });
      grids[s.id].host = gg;
    }
    gridsBuilt = true;
  }

  function setTime(t, source = 'step') {
    curT = Math.max(0, Math.min(10, t));
    const snapped = Math.round(curT * 2) / 2;
    E.cursor?.set(curT, { silent: true });
    if (source !== 'slider') slider.set(snapped, { silent: true });
    if (!gridsBuilt) buildGrids();
    const s = BY[selected];
    const r = valueAt(s, snapped);
    const n = r.v == null ? null : Math.round(r.v);
    for (const q of SERIES) {
      const G = grids[q.id];
      const rq = valueAt(q, snapped);
      const nq = rq.v == null ? null : Math.round(rq.v);
      G.setStates((u) => (nq == null ? 'dim' : u.i < nq ? 'filled' : 'outline'), { duration: 0 });
      G.host.setAttribute('display', q.id === selected ? 'inline' : 'none');
    }
    peopleBox.querySelector('svg')?.setAttribute('aria-label', n == null ? `No data for ${s.who} at this time` : `${n} of 100 people treated with ${s.who} alive`);
    const when = snapped === 0 ? 'At the start' : `At ${yearsText(snapped)}`;
    count.innerHTML = n == null
      ? `<b>${when}:</b> no data for ${s.short.toLowerCase()} (its trial reported up to year 3).`
      : snapped === 0 ? `<b>${when}:</b> all 100 alive.` : `<b>${when}:</b> about ${n} of 100 alive.`;
    who.innerHTML = `${keySVG(s)}<span>100 people on ${s.who}</span>`;
    for (const q of SERIES) {
      const row = rowEls[q.id];
      row.parentElement.hidden = !shown.has(q.id);
      row.setAttribute('aria-pressed', String(q.id === selected));
      const rv = valueAt(q, snapped);
      const val = row.querySelector('.tl-val');
      const st = rv.status === 'published' ? `published ${cite(rv.src)}` : rv.status === 'approximate' ? 'approximate' : rv.status === 'start' ? 'start of trial' : 'no data';
      val.innerHTML = rv.v == null ? `<b>—</b><span>${st}</span>` : `<b>${Math.round(rv.v)}%</b><span>${st}</span>`;
      row.setAttribute('aria-label', `${q.label}: ${rv.v == null ? 'no data' : `${Math.round(rv.v)}% alive, ${rv.status === 'published' ? 'published value' : rv.status}`}. Show in the 100-people grid.`);
    }
    for (const q of SERIES) E.series?.[q.id]?.g.classList.toggle('tl-sel', q.id === selected && shown.has(q.id));
  }

  function select(id) {
    if (!shown.has(id)) return;
    selected = id;
    setTime(curT, 'select');
    ctx.announce(`${BY[id].label} shown in the 100-people grid.`);
  }

  // ---------------------------------------------------------------- long tail (free toggle)
  function paintTail() {
    const stepOn = step >= 0 && STEPS[step].tail;
    const on = stepOn && tailUser;
    tailNote.hidden = !on;
    tailBtnEl.setAttribute('aria-pressed', String(on));
    tailBtnEl.disabled = step < STEPS.length - 1;
    const lab = tailBtnEl.querySelector('.btn__text') || tailBtnEl;
    if (lab === tailBtnEl) tailBtnEl.textContent = on ? 'Hide the long tail' : 'Show the long tail';
    else lab.textContent = on ? 'Hide the long tail' : 'Show the long tail';
  }
  function toggleTail() {
    if (step !== STEPS.length - 1) return;
    tailUser = !tailUser;
    tweenTo(E.tailInner, { opacity: tailUser ? 1 : 0 }, { duration: 0.4 });
    paintTail();
  }

  // ---------------------------------------------------------------- stepper
  function reset() {
    for (const s of SERIES) {
      const e = E.series[s.id];
      gsap.set(e.g, { opacity: 0 });
      gsap.set(e.dots, { opacity: 0 });
      gsap.set(E.labels[s.id], { opacity: 0 });
    }
    gsap.set(E.tailOuter, { opacity: 0 });
    gsap.set(E.tailInner, { opacity: 1 });
    tp.t = 0;
  }
  const reveal = (tl, id, at, dur = 1.5) => {
    const e = E.series[id];
    tl.fromTo(e.g, { opacity: 0 }, { opacity: 1, duration: 0.2 }, at);
    e.ln.drawIn({ tl, at, duration: dur });
    tl.fromTo(e.dots, { opacity: 0 }, { opacity: 1, duration: 0.5 }, at + dur * 0.55);
    tl.fromTo(E.labels[id], { opacity: 0 }, { opacity: 1, duration: 0.5 }, at + dur * 0.8);
  };
  const moveCursor = (tl, from, to, at, dur) => {
    tl.fromTo(tp, { t: from }, { t: to, duration: dur, ease: 'so.inOut', onUpdate: () => setTime(tp.t, 'step') }, at);
  };
  const stepDefs = [
    { enter(tl) { reveal(tl, 'chemo', 0, 1.4); moveCursor(tl, 0, 3, 0.1, 1.4); } },
    { enter(tl) {
      tl.fromTo(E.series.chemo.g, { opacity: 1 }, { opacity: 0.5, duration: 0.5 }, 0);
      tl.fromTo(E.labels.chemo, { opacity: 1 }, { opacity: 0.6, duration: 0.5 }, 0);
      reveal(tl, 'ipi', 0.2, 1.8); moveCursor(tl, 3, 10, 0.25, 1.8);
    } },
    { enter(tl) { reveal(tl, 'nivo', 0, 1.6); reveal(tl, 'combo', 0.25, 1.6); moveCursor(tl, 10, 10, 0, 0.1); } },
    { enter(tl) { tl.fromTo(E.tailOuter, { opacity: 0 }, { opacity: 1, duration: 0.7 }, 0); moveCursor(tl, 10, 3, 0.1, 1.2); } },
    { enter(tl) { moveCursor(tl, 3, 5, 0, 0.8); } },
  ];

  let stepper = null;
  function onStep(i) {
    step = i;
    const st = STEPS[i];
    shown = new Set(st.show);
    selected = st.sel;
    if (i < STEPS.length - 1 && !tailUser) { tailUser = true; gsap.set(E.tailInner, { opacity: 1 }); }
    paintTail();
    setTime(tp.t, 'step');
  }

  // ---------------------------------------------------------------- lifecycle
  ctx.onResize(({ compact: c }) => {
    if (c === compact) return;
    compact = c;
    placeParts(c);
    L = c ? LAYOUTS.compact : LAYOUTS.wide;
    draw();
    gridsBuilt = false;
    if (stepper) stepper.rebuild();
    setTime(tp.t, 'step');
  });
  if (compact == null) { compact = ctx.compact; placeParts(compact); L = compact ? LAYOUTS.compact : LAYOUTS.wide; draw(); }

  stepper = ctx.ui.stepper({ steps: stepDefs, reset, scene: wrap, onChange: (i) => onStep(i) });
  paintTail();
  setTime(0, 'step');

  return { destroy() { ctx.tooltip.hide(); } };
}
