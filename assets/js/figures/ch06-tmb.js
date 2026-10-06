// ch06-tmb — "How many mutations?"
// Quantile dot strips of tumor mutational burden (protein-changing mutations per
// megabase; TCGA PanCancer Atlas + Gröbner et al. 2018 via cBioPortal): one row
// per cancer type, 20 dots per row at the 2.5th…97.5th percentiles (each dot =
// 5% of tumors), median tick, log axis. Three guided steps (spread, causes,
// mismatch repair), then free exploration: show all 29 rows, sort, hide MSI-high rows,
// tap/hover/keyboard rows for a detail card. Built on shared/chart.js.
import { C, fmt, scale, chartRoot, axis, rows, chartFrame, legendHTML, tweenTo } from './shared/chart.js';

// group: child | adult | msi. Verbatim from the draft's data block.
const RAW = `
child|ball|Childhood B-cell leukemia (B-ALL)|42|0.03|0.04|0.10|0.22|0.36|0.03 0.03 0.03 0.03 0.03 0.07 0.07 0.07 0.10 0.10 0.10 0.12 0.13 0.17 0.20 0.23 0.27 0.32 0.49 0.60|Often driven by large chromosome changes rather than many small mutations.
child|retino|Retinoblastoma (eye, children)|29|0.03|0.07|0.10|0.17|0.23|0.03 0.03 0.03 0.03 0.07 0.07 0.07 0.07 0.07 0.10 0.10 0.10 0.13 0.13 0.14 0.17 0.17 0.20 0.23 0.24|Usually caused by the loss of both copies of a single brake gene, RB1.
child|wilms|Wilms tumor (kidney, children)|44|0.07|0.13|0.20|0.27|0.47|0.03 0.07 0.08 0.10 0.12 0.13 0.13 0.17 0.17 0.18 0.20 0.20 0.23 0.23 0.27 0.28 0.32 0.43 0.49 0.53|
child|neuro|Neuroblastoma (children)|46|0.03|0.07|0.25|0.49|0.60|0.03 0.03 0.03 0.03 0.07 0.07 0.10 0.13 0.20 0.21 0.27 0.30 0.37 0.43 0.47 0.50 0.54 0.57 0.72 1.51|
child|medullo|Medulloblastoma (brain, children)|215|0.07|0.20|0.33|0.60|0.93|0.03 0.07 0.07 0.13 0.17 0.20 0.23 0.27 0.30 0.30 0.33 0.40 0.43 0.48 0.57 0.63 0.70 0.84 1.16 2.09|
child|osteo|Osteosarcoma (bone, children)|32|0.03|0.06|0.15|0.48|0.60|0.03 0.03 0.03 0.03 0.03 0.07 0.07 0.07 0.07 0.11 0.18 0.23 0.37 0.43 0.47 0.50 0.55 0.57 0.62 1.50|
adult|thyroid|Thyroid|484|0.17|0.23|0.33|0.53|0.82|0.10 0.13 0.17 0.20 0.23 0.23 0.27 0.30 0.30 0.33 0.37 0.40 0.40 0.47 0.50 0.53 0.60 0.70 0.97 2.19|
adult|testis|Testicular germ-cell|143|0.23|0.30|0.40|0.63|0.83|0.15 0.20 0.26 0.27 0.30 0.30 0.33 0.37 0.40 0.40 0.43 0.50 0.53 0.57 0.60 0.67 0.70 0.77 0.93 1.31|Mostly young men.
adult|uveal|Uveal melanoma (eye)|80|0.23|0.30|0.40|0.51|0.63|0.20 0.23 0.23 0.27 0.29 0.30 0.30 0.33 0.37 0.37 0.40 0.43 0.45 0.47 0.50 0.53 0.57 0.60 0.67 0.70|Same cell type as skin melanoma, but shielded from sunlight.
adult|aml|Acute myeloid leukemia (adult)|199|0.13|0.27|0.53|0.97|1.65|0.07 0.10 0.17 0.20 0.27 0.30 0.33 0.40 0.47 0.50 0.53 0.63 0.72 0.87 0.93 1.03 1.13 1.38 1.87 10.7|
adult|prostate|Prostate|491|0.47|0.70|0.90|1.20|1.77|0.17 0.40 0.50 0.60 0.67 0.70 0.74 0.80 0.83 0.87 0.93 0.97 1.03 1.07 1.13 1.26 1.40 1.60 2.00 3.10|
adult|pancreas|Pancreas|174|0.31|0.90|1.20|1.60|2.27|0.04 0.23 0.40 0.58 0.76 0.92 1.00 1.06 1.10 1.17 1.20 1.27 1.37 1.46 1.53 1.67 1.90 2.07 2.47 3.02|
adult|breast|Breast|1009|0.63|0.90|1.40|2.40|4.43|0.43 0.59 0.70 0.77 0.87 0.93 1.00 1.10 1.20 1.33 1.44 1.63 1.80 2.00 2.23 2.63 3.15 4.10 4.99 10.9|
adult|kidney|Kidney (clear cell)|356|0.97|1.30|1.80|2.30|2.95|0.56 0.85 1.05 1.17 1.27 1.37 1.43 1.53 1.63 1.73 1.87 1.90 2.00 2.12 2.23 2.40 2.50 2.75 3.13 3.66|Responds to checkpoint inhibitors fairly often despite this modest count; one proposed reason is its unusually high share of frameshift mutations (Turajlic et al. Lancet Oncol 2017).
adult|gbm|Glioblastoma (brain)|394|1.07|1.37|1.72|2.23|3.21|0.67 0.97 1.13 1.23 1.33 1.40 1.47 1.53 1.60 1.70 1.77 1.83 1.90 2.07 2.17 2.30 2.53 2.86 3.94 10.5|
adult|ovary|Ovary (high-grade serous)|409|0.97|1.60|2.30|3.43|4.89|0.41 0.83 1.10 1.31 1.53 1.67 1.82 1.93 2.10 2.23 2.37 2.53 2.73 2.90 3.23 3.57 3.97 4.63 5.73 7.59|
adult|liver|Liver|358|1.49|2.10|2.87|3.97|5.59|0.76 1.26 1.59 1.77 2.00 2.17 2.30 2.43 2.62 2.80 2.97 3.17 3.47 3.63 3.80 4.07 4.50 5.25 6.23 9.93|
adult|cervix|Cervix|281|1.37|1.90|2.97|5.13|10.33|0.73 1.23 1.40 1.57 1.77 1.97 2.07 2.13 2.40 2.80 3.10 3.47 3.70 4.13 4.93 5.30 6.37 8.67 12.0 37.3|Almost always driven by HPV, whose proteins are foreign antigens.
adult|hnsc|Head and neck (squamous)|502|1.28|2.20|3.62|6.12|11.13|0.77 1.17 1.60 1.87 2.13 2.36 2.76 3.03 3.20 3.50 3.80 4.17 4.50 5.04 5.73 6.65 8.23 10.4 13.1 18.7|Includes tobacco-related and HPV-driven tumors.
adult|esoph|Esophagus (adenocarcinoma)|182|1.94|2.75|3.53|5.13|7.16|1.48 1.80 2.03 2.40 2.59 2.83 3.00 3.13 3.30 3.47 3.67 3.97 4.13 4.49 5.03 5.50 6.30 6.90 7.69 13.5|
adult|stomach|Stomach|435|1.51|2.43|3.90|8.52|39.59|0.69 1.30 1.63 1.97 2.29 2.54 2.80 3.13 3.41 3.77 4.23 4.69 5.20 6.37 7.67 10.3 21.3 32.5 43.4 72.1|The long right tail is mostly MSI-high tumors (about one in five here).
adult|crc|Colorectal, MSS|442|1.90|2.57|3.30|4.37|5.67|0.57 1.70 2.04 2.30 2.47 2.67 2.80 2.90 3.07 3.23 3.37 3.50 3.73 3.97 4.20 4.53 4.87 5.33 6.03 12.2|Mismatch repair intact (microsatellite stable).
msi|crcmsi|Colorectal, MSI-high|84|4.09|25.91|36.65|54.46|75.01|2.08 3.24 4.49 7.29 21.2 27.2 30.3 32.6 35.2 36.3 37.1 39.3 40.6 47.3 52.0 58.2 64.1 66.8 79.4 115.3|Mismatch-repair deficient; about 11x the MSS median.
adult|endo|Endometrium (uterus), MSS|352|1.10|1.40|1.83|2.75|42.97|0.83 1.01 1.13 1.31 1.37 1.43 1.50 1.63 1.70 1.80 1.90 2.03 2.17 2.36 2.58 3.10 4.28 7.76 115.2 343.5|The top dots are "ultramutated" tumors with a broken proofreading enzyme (POLE), not mismatch-repair defects.
msi|endomsi|Endometrium (uterus), MSI-high|161|9.90|13.73|20.00|33.23|155.63|6.17 8.73 10.1 11.3 12.5 14.2 14.8 15.9 18.2 19.4 21.0 22.0 24.3 26.9 29.8 34.2 43.9 90.0 216.4 383.9|Mismatch-repair deficient; about 11x the MSS median.
adult|bladder|Bladder|409|1.93|3.07|5.77|10.40|16.87|0.90 1.63 2.10 2.53 2.90 3.33 3.75 4.33 4.91 5.59 6.05 6.87 7.63 8.43 9.72 11.1 12.8 14.3 20.0 28.9|
adult|luad|Lung adenocarcinoma|561|1.33|2.83|6.73|13.70|23.07|0.67 1.13 1.63 2.07 2.53 3.17 3.70 4.27 5.03 6.27 7.13 8.20 9.27 10.8 12.7 14.6 16.7 20.2 26.5 41.2|Very wide spread: includes both smokers and never-smokers; smokers’ lung cancers carry about 10x more mutations (Vogelstein et al. 2013).
adult|lusc|Lung squamous-cell|469|3.76|5.60|7.93|11.33|17.23|1.67 3.30 4.20 4.96 5.40 5.85 6.20 6.67 7.13 7.61 8.17 8.90 9.65 10.5 11.1 11.8 12.7 15.1 19.8 30.5|Strongly tied to smoking.
adult|skcm|Melanoma (skin)|440|2.52|7.04|14.88|31.39|54.30|0.77 2.00 3.49 5.00 6.31 7.65 9.26 10.7 12.3 13.7 15.7 18.2 20.8 23.3 28.2 32.7 40.8 50.3 63.6 103.1|Sunlight’s signature dominates; the highest single tumor in these data lies above 1,000 per megabase, beyond the axis.
`;
const DATA = RAW.trim().split('\n').map((ln, order) => {
  const [group, id, label, n, p10, p25, median, p75, p90, dots, note] = ln.split('|');
  return { order, group, id, label, n: Number(n), p10: +p10, p25: +p25, median: +median, p75: +p75, p90: +p90,
    dots: dots.split(' ').map(Number), note: (note || '').replace(/(\d)x\b/g, '$1×') || null };
});
const BY = Object.fromEntries(DATA.map((d) => [d.id, d]));
const DEFAULT_IDS = new Set(['ball', 'medullo', 'thyroid', 'uveal', 'pancreas', 'breast', 'crc', 'crcmsi', 'bladder', 'luad', 'lusc', 'skcm']);
const SORTED = [...DATA].sort((a, b) => b.median - a.median || a.order - b.order).map((d) => d.id);
const FLOOR = 0.03;
// Phone labels: two short lines (the C tag and the legend already say "children").
const SHORT = {
  ball: ['B-cell leukemia', '(B-ALL)'], retino: ['Retinoblastoma', '(eye)'], wilms: ['Wilms tumor', '(kidney)'],
  neuro: ['Neuroblastoma'], medullo: ['Medulloblastoma', '(brain)'], osteo: ['Osteosarcoma', '(bone)'], testis: ['Testicular', 'germ-cell'],
  uveal: ['Uveal melanoma', '(eye)'], aml: ['Acute myeloid', 'leukemia (adult)'], kidney: ['Kidney', '(clear cell)'],
  gbm: ['Glioblastoma', '(brain)'], ovary: ['Ovary, high-', 'grade serous'], hnsc: ['Head and neck', '(squamous)'],
  esoph: ['Esophageal', 'adenocarcinoma'], crc: ['Colorectal,', 'MSS'], crcmsi: ['Colorectal,', 'MSI-high'],
  endo: ['Endometrium,', 'MSS'], endomsi: ['Endometrium,', 'MSI-high'], luad: ['Lung', 'adenocarcinoma'],
  lusc: ['Lung', 'squamous-cell'], skcm: ['Melanoma', '(skin)'],
};

const SOURCE = 'Adult cancers: 32 of the 33 studies in The Cancer Genome Atlas PanCancer Atlas (about 10,000 tumors, whole-exome sequencing), via cBioPortal; its skin-melanoma samples are mostly metastases, which carry more mutations than primary tumors. Cancers of children and young adults: Gröbner et al., Nature 2018 (961 tumors of 24 types; the 795 primary tumors with mutation calls in cBioPortal). Each dot = 5% of tumors of that type. Counts depend on method: the published median for this younger cohort is 0.13 mutations per megabase against 1.8 for TCGA adults, and clinical tests report different absolute numbers again.';
const SRC_ADULT = 'TCGA PanCancer Atlas (Hoadley et al., <em>Cell</em> 2018; MC3 mutation calls) via cBioPortal';
const SRC_CHILD = 'Gröbner et al., <em>Nature</em> 2018 (primary tumors) via cBioPortal';
const SRC_MSI = 'TCGA PanCancer Atlas via cBioPortal; MSI-high = MANTIS score above 0.4 (Bonneville et al. 2017)';

const LAYOUTS = {
  wide: { w: 760, labelW: 246, labelPad: 26, px0: 258, px1: 694, medX: 756, top: 72, rowH: 26, values: true, wrap: 0,
    tickLabels: (v) => v === FLOOR || [0.1, 1, 10, 100, 1000].includes(v), tagText: true },
  compact: { w: 360, labelW: 140, labelPad: 24, px0: 150, px1: 346, medX: null, top: 76, rowH: 34, values: false, wrap: 0,
    tickLabels: (v) => [0.1, 1, 10, 100, 1000].includes(v), tagText: false },
};
const STEP_ROWS = [
  ['skcm', 'lusc', 'ball', 'medullo'],
  ['skcm', 'uveal', 'luad', 'lusc'],
];

const CSS = `
[data-figure="ch06-tmb"] svg { --ck-row-fs: 13px; }
[data-figure="ch06-tmb"] .tmb-tools { display: flex; flex-wrap: wrap; align-items: center; gap: 10px 18px; }
[data-figure="ch06-tmb"] .tmb-more { display: grid; grid-template-rows: 1fr; }
[data-figure="ch06-tmb"] .tmb-more__in { min-height: 0; overflow: hidden; display: flex; flex-wrap: wrap; align-items: center; gap: 10px 18px; }
[data-figure="ch06-tmb"] .tmb-tools.is-compact .tmb-more { flex-basis: 100%; }
[data-figure="ch06-tmb"] .fig__controls > .tmb-aux { flex: 1 1 100%; margin: 0; }
[data-figure="ch06-tmb"] .tmb-more.is-off { visibility: hidden; }
[data-figure="ch06-tmb"] .tmb-c { display: inline-grid; place-items: center; flex: none; width: 15px; height: 15px; margin-right: 6px; border-radius: 50%;
  background: var(--fg-2); color: var(--halo); font: 700 9.5px/1 var(--font-ui); vertical-align: -2px; }
[data-figure="ch06-tmb"] svg .tmb-c-text { font: 700 9.5px/1 var(--font-ui); fill: var(--halo); }
[data-figure="ch06-tmb"] svg .tmb-med { font-variant-numeric: tabular-nums; }
[data-figure="ch06-tmb"] svg .tmb-ann { font-weight: 600; }
`;
function injectCSS() {
  if (document.getElementById('ch06-tmb-css')) return;
  const s = document.createElement('style');
  s.id = 'ch06-tmb-css';
  s.textContent = CSS;
  document.head.append(s);
}

export default function mount(fig, ctx) {
  injectCSS();
  const { gsap } = ctx;
  const F = chartFrame(ctx, {
    source: SOURCE,
    cardHint: 'Hover over or tap a row to see how many tumors were analyzed, the median, and how widely they spread.',
  });

  // Phones (final polish): the long source note and the row-card hint sat between the chart and the
  // stepper, pushing the stepper and caption a screen down. There they move after the caption (into
  // the controls row, source last, still visible); on wide figures they return to their places.
  const auxHome = { card: F.card.el.parentElement, cardNext: F.card.el.nextSibling, source: F.sourceEl.parentElement };
  F.card.el.classList.add('tmb-aux');
  F.sourceEl.classList.add('tmb-aux');
  function placeAux(compact) {
    if (compact) {
      if (F.card.el.parentElement !== ctx.controls) ctx.controls.append(F.card.el);
      if (F.sourceEl.parentElement !== ctx.controls) ctx.controls.append(F.sourceEl);
    } else {
      if (F.card.el.parentElement !== auxHome.card) auxHome.card.append(F.card.el);
      if (F.sourceEl.parentElement !== auxHome.source) auxHome.source.append(F.sourceEl);
    }
  }

  let L = LAYOUTS.wide;
  const view = { all: false, sort: 'median', msi: true };
  let svg = null;
  let el = {};
  let stepper = null;
  let step = -1;

  // ---------------------------------------------------------------- layout maths
  const slotsFor = (all) => (all ? DATA.length : DEFAULT_IDS.size) + 2;   // +2: room for the two group headers
  const inView = (id, v) => (v.all || DEFAULT_IDS.has(id)) && (v.msi || BY[id].group !== 'msi');
  /** Row positions for a view. Hidden rows collapse onto a visible neighbour (so they can fade in among them). */
  function layout(v) {
    const order = v.sort === 'group'
      ? [...SORTED.filter((id) => BY[id].group !== 'child'), ...SORTED.filter((id) => BY[id].group === 'child')]
      : SORTED;
    const vis = order.filter((id) => inView(id, v));
    const pos = {};
    const heads = {};
    const total = slotsFor(v.all) * L.rowH;
    if (v.sort === 'group') {
      let y = L.top;
      const adults = vis.filter((id) => BY[id].group !== 'child');
      const kids = vis.filter((id) => BY[id].group === 'child');
      heads.adult = y; y += L.rowH;
      for (const id of adults) { pos[id] = y; y += L.rowH; }
      heads.child = y; y += L.rowH;
      for (const id of kids) { pos[id] = y; y += L.rowH; }
    } else {
      const sp = total / Math.max(1, vis.length);
      vis.forEach((id, k) => { pos[id] = L.top + k * sp + (sp - L.rowH) / 2; });
    }
    // Hidden rows: on the nearest visible row below them in the order (else above).
    order.forEach((id, k) => {
      if (pos[id] != null) return;
      const below = order.slice(k + 1).find((o) => pos[o] != null && inView(o, v));
      const above = [...order.slice(0, k)].reverse().find((o) => pos[o] != null && inView(o, v));
      pos[id] = pos[below ?? above] ?? L.top;
    });
    return { pos, vis: new Set(vis), heads, bottom: L.top + total };
  }

  // ---------------------------------------------------------------- draw
  function draw() {
    const prevSel = el.R?.selected ?? null;
    F.main.replaceChildren();
    const base = layout({ ...view, sort: 'median', msi: true });
    const axisY = base.bottom + 6;
    const H = axisY + (L.values ? 80 : 112);
    svg = ctx.createSVG({
      viewBox: `0 0 ${L.w} ${H}`, parent: F.main, interactive: true,
      label: 'Quantile dot strips: protein-changing mutations per megabase for each kind of cancer, on a log scale. Tab to the rows, use the arrow keys to move and Enter for details.',
    });
    const g = chartRoot(svg);
    const x = scale({ type: 'log', domain: [FLOOR, 1000], range: [L.px0, L.px1] });
    const X = (v) => x(Math.max(FLOOR, v));
    const ticks = x.ticks([1, 3]);
    axis(g, {
      scale: x, orient: 'bottom', at: axisY, ticks, labels: L.tickLabels, grid: [L.top - 4, axisY], tickSize: 4,
      format: (v) => (v === FLOOR ? '≤0.03' : fmt.num(v, { digits: v < 1 ? 1 : 0 })),
      title: L.values ? 'Protein-changing mutations per million DNA bases' : ['Protein-changing mutations', 'per million DNA bases'],
      note: L.values ? 'Log scale: each labeled step (0.1, 1, 10 …) is ten times the one before' : ['Log scale: each labeled step', 'is ten times the one before'],
    });
    if (L.medX) ctx.svg('text', { class: 't-caps t-end', x: L.medX, y: L.top - 10, text: 'Median' }, g);

    // Group headers ("Children / adults" sort).
    const headG = ctx.svg('g', { class: 'tmb-heads' }, g);
    const heads = {
      adult: ctx.svg('text', { class: 't-caps t-halo', x: 4, y: 0, text: 'Adults' }, headG),
      child: ctx.svg('text', { class: 't-caps t-halo', x: 4, y: 0, text: 'Children and young adults' }, headG),
    };

    // Annotation layer (step 1 brackets, step 2 connector + tags, step 3 arrows).
    const annBack = ctx.svg('g', { class: 'tmb-ann-back' }, g);

    const R = rows(g, {
      items: SORTED.map((id) => BY[id]),
      x0: 0, x1: L.w, top: L.top, rowH: L.rowH, labelW: L.labelW, labelPad: L.labelPad, wrap: L.wrap,
      label: (d) => (L.values ? d.label : SHORT[d.id] || d.label),
      labelClass: (d) => (d.group === 'child' ? 'is-muted' : ''),
      ariaLabel: (d) => `${d.label}: median ${fmt.sig(d.median)} mutations per megabase, ${d.n} tumors`,
      name: 'Cancer types',
      selectable: (d) => inView(d.id, view),
      onSelect: (d) => showDetails(d),
    });

    const recs = {};
    for (const r of R.rows) {
      const d = r.item;
      const c = r.content;
      const rec = { d, row: r };
      rec.band = ctx.svg('rect', { x: 0, y: -L.rowH / 2 + 1, width: L.w, height: L.rowH - 2, rx: 4, style: `fill:${C.s1};fill-opacity:0.08;opacity:0` }, c);
      if (d.group === 'child') {
        const cg = ctx.svg('g', { transform: `translate(${L.labelW - 13} ${L.rowH / 2 + (r.lines.length > 1 ? -7.5 : 0)})`, 'aria-hidden': 'true' }, r.g);
        ctx.svg('circle', { r: 7, style: `fill:${C.ink2}` }, cg);
        ctx.svg('text', { class: 'tmb-c-text t-mid', y: 0, dy: '0.36em', text: 'C' }, cg);
      }
      // 20 quantile dots; exact duplicates are dodged vertically so every 5% stays visible.
      const dots = ctx.svg('g', { class: 'tmb-dots' }, c);
      const seen = new Map();
      for (const v of d.dots) {
        const k = Math.max(FLOOR, v).toFixed(3);
        const n = seen.get(k) || 0;
        seen.set(k, n + 1);
        const dy = n === 0 ? 0 : (n % 2 ? -1 : 1) * Math.ceil(n / 2) * 3.2;
        const cx = X(v);
        if (d.group === 'msi') ctx.svg('path', { d: `M${cx},${dy - 4.6}L${cx + 4.6},${dy}L${cx},${dy + 4.6}L${cx - 4.6},${dy}Z`, style: `fill:${C.s1};fill-opacity:0.72` }, dots);
        else if (d.group === 'child') ctx.svg('circle', { cx, cy: dy, r: 3.3, style: `fill:none;stroke:${C.ink2};stroke-width:1.2;stroke-opacity:0.85` }, dots);
        else ctx.svg('circle', { cx, cy: dy, r: 3.5, style: `fill:${C.ink2};fill-opacity:0.7` }, dots);
      }
      const half = Math.min(11, L.rowH * 0.4);
      ctx.svg('line', { x1: X(d.median), x2: X(d.median), y1: -half, y2: half, strokeWidth: 2, strokeLinecap: 'round', style: `stroke:${C.ink}` }, c);
      if (L.medX) ctx.svg('text', { class: 't-small t-end tmb-med', x: L.medX, y: 0, dy: '0.35em', text: fmt.sig(d.median) }, c);
      recs[d.id] = rec;
    }

    // Step annotations (geometry is set in layoutAnnotations, which runs on every rebuild).
    const ann = ctx.svg('g', { class: 'tmb-ann' }, g);
    const mk = (tag, attrs) => ctx.svg(tag, attrs, ann);
    const A = {
      b1: mk('path', { fill: 'none', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round', style: `stroke:${C.ink}` }),
      b1t: mk('text', { class: 't-small t-mid t-halo tmb-ann', text: 'about 150-fold between typical tumors' }),
      b2: mk('path', { fill: 'none', strokeWidth: 1, strokeLinecap: 'round', strokeLinejoin: 'round', style: `stroke:${C.ink2}` }),
      b2t: mk('text', { class: 't-small t-mid t-halo', text: 'more than 1,000-fold between individual tumors' }),
      drops: mk('path', { fill: 'none', class: 'leader', 'stroke-dasharray': '2 3' }),
      conn: mk('path', { fill: 'none', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round', style: `stroke:${C.ink2}` }),
      connHead: mk('path', { style: `fill:${C.ink2}` }),
      connT: mk('text', { class: 't-small t-halo tmb-ann' }),
      sun: mk('g', {}),
      smoke1: mk('g', {}),
      smoke2: mk('g', {}),
      arrow: mk('path', { fill: 'none', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', style: `stroke:${C.s1}` }),
      head: mk('path', { style: `fill:${C.s1}` }),
      arrowT: mk('text', { class: 't-label t-halo tmb-ann', text: '≈ 11×' }),
      arrow2: mk('path', { fill: 'none', strokeWidth: 1.3, strokeLinecap: 'round', strokeLinejoin: 'round', style: `stroke:${C.s1};stroke-opacity:0.6` }),
      head2: mk('path', { style: `fill:${C.s1};fill-opacity:0.6` }),
    };
    // connector label: two lines
    const connLines = L.values ? ['same cell type —', 'sunlight makes the difference'] : ['same cell type —', 'sunlight makes', 'the difference'];
    connLines.forEach((t, k) => ctx.svg('tspan', { dy: k ? '1.25em' : 0, text: t }, A.connT));
    drawTag(A.sun, 'sun', L.tagText ? 'sunlight' : null);
    drawTag(A.smoke1, 'smoke', L.tagText ? 'tobacco smoke' : null);
    drawTag(A.smoke2, 'smoke', L.tagText ? 'tobacco smoke' : null);

    el = { svg, g, x, X, R, recs, heads, A, annBack, axisY };
    if (prevSel && inView(prevSel, view)) R.select(prevSel, { silent: true });
  }

  function drawTag(gEl, kind, text) {
    const s = ctx.svg('g', { style: `stroke:${C.ink2};fill:none`, strokeWidth: 1.3, strokeLinecap: 'round', strokeLinejoin: 'round' }, gEl);
    if (kind === 'sun') {
      ctx.svg('circle', { r: 3.4 }, s);
      for (let k = 0; k < 8; k++) {
        const a = (k * Math.PI) / 4;
        ctx.svg('line', { x1: Math.cos(a) * 5.6, y1: Math.sin(a) * 5.6, x2: Math.cos(a) * 7.6, y2: Math.sin(a) * 7.6 }, s);
      }
    } else {
      ctx.svg('rect', { x: -8, y: 0.5, width: 13, height: 4, rx: 1 }, s);
      ctx.svg('rect', { x: -8, y: 0.5, width: 4, height: 4, rx: 1, style: `fill:${C.ink2}` }, s);
      ctx.svg('path', { d: 'M4,-1.5c2,-1.6 -1.2,-2.8 0.6,-4.6c1.2,-1.2 0.4,-2.2 -0.4,-3' }, s);
    }
    if (text) ctx.svg('text', { class: 't-small t-end t-halo', x: -12, y: 0, dy: '0.35em', text, style: 'stroke-width:4px' }, gEl);
  }

  // Annotation geometry for the current view (runs before every timeline build).
  function layoutAnnotations() {
    const { A, X } = el;
    const p1 = layout({ ...view, sort: 'median', msi: true }).pos;          // steps 1–2 positions
    const p3 = layout(view).pos;                                              // step 3 positions
    const rowMid = (pos, id) => pos[id] + L.rowH / 2;
    // Step 1: brackets above the plot.
    const vis = DATA.filter((d) => inView(d.id, { ...view, msi: true }));
    const lo = Math.min(...vis.map((d) => Math.max(FLOOR, d.dots[0])));
    const hi = Math.max(...vis.map((d) => d.dots[19]));
    const yb2 = L.top - (L.values ? 40 : 46); const yb1 = L.top - (L.values ? 14 : 16);
    const br = (xa, xb, y) => `M${xa},${y + 5}V${y}H${xb}V${y + 5}`;
    A.b2.setAttribute('d', br(X(lo), X(hi), yb2));
    A.b1.setAttribute('d', br(X(BY.ball.median), X(BY.skcm.median), yb1));
    const clampX = (cx, w) => Math.max(w / 2 + 2, Math.min(L.w - w / 2 - 2, cx));
    const wTxt = (t) => t.textContent.length * (L.values ? 6.4 : 6.9);
    A.b2t.setAttribute('x', clampX((X(lo) + X(hi)) / 2, wTxt(A.b2t))); A.b2t.setAttribute('y', yb2 - 6);
    A.b1t.setAttribute('x', clampX((X(BY.ball.median) + X(BY.skcm.median)) / 2, wTxt(A.b1t))); A.b1t.setAttribute('y', yb1 - 6);
    A.drops.setAttribute('d', `M${X(BY.ball.median)},${yb1 + 5}V${rowMid(p1, 'ball') - 9}M${X(BY.skcm.median)},${yb1 + 5}V${rowMid(p1, 'skcm') - 9}`);
    // Step 2: connector from the end of the uveal strip, along its (empty) row, up a clear column
    // (right of every strip in between) to the skin-melanoma row.
    const rr = 8;
    const between = SORTED.slice(SORTED.indexOf('skcm') + 1, SORTED.indexOf('uveal')).filter((id) => inView(id, { ...view, msi: true }));
    const clear = Math.max(...between.map((id) => BY[id].dots[19]), 30) * 1.7;
    const xu = X(BY.uveal.dots[19]) + 8; const xc = X(clear);
    const yu = rowMid(p1, 'uveal'); const ym = rowMid(p1, 'skcm') + 9;
    A.conn.setAttribute('d', `M${xu},${yu}H${xc - rr}Q${xc},${yu} ${xc},${yu - rr}V${ym + 7}`);
    A.connHead.setAttribute('d', `M${xc},${ym}L${xc + 4},${ym + 7.5}L${xc - 4},${ym + 7.5}Z`);
    const ct = A.connT;
    const cy = (yu + ym) / 2;
    const nLines = ct.children.length;
    ct.setAttribute('x', xc - 10); ct.setAttribute('y', cy - 6 - (nLines - 2) * 8); [...ct.children].forEach((t) => t.setAttribute('x', xc - 10));
    ct.setAttribute('text-anchor', 'end');
    const tagAt = (gEl, id) => gEl.setAttribute('transform', `translate(${X(BY[id].dots[0]) - 12} ${rowMid(p1, id)})`);
    tagAt(A.sun, 'skcm'); tagAt(A.smoke1, 'luad'); tagAt(A.smoke2, 'lusc');
    // Step 3: arrow from the MSS median along its row, then up to the MSI-high median (×11 is a length on this axis).
    const arrowPath = (from, to) => {
      const xa = X(BY[from].median); const xb = X(BY[to].median);
      const ya = rowMid(p3, from) - (L.rowH * 0.5 - 3); const yb = rowMid(p3, to) + 12;
      return { d: `M${xa},${ya}H${xb - rr}Q${xb},${ya} ${xb},${ya - rr}V${yb + 7}`, head: `M${xb},${yb}L${xb + 4.5},${yb + 8}L${xb - 4.5},${yb + 8}Z`, xa, xb, ya };
    };
    const a1 = arrowPath('crc', 'crcmsi');
    A.arrow.setAttribute('d', a1.d); A.head.setAttribute('d', a1.head);
    A.arrowT.setAttribute('x', a1.xb + 9); A.arrowT.setAttribute('y', a1.ya + 5);
    const a2 = arrowPath('endo', 'endomsi');
    A.arrow2.setAttribute('d', a2.d); A.head2.setAttribute('d', a2.head);
    // Group headers for the step-3 layout.
    const l3 = layout(view);
    for (const k of ['adult', 'child']) el.heads[k].setAttribute('y', (l3.heads[k] ?? L.top) + L.rowH / 2 + 4);
  }

  // ---------------------------------------------------------------- details card
  function showDetails(d) {
    if (!d) { F.card.hide({ silent: true }); return; }
    const s = (v) => fmt.sig(v);
    const src = d.group === 'child' ? SRC_CHILD : d.group === 'msi' || d.id === 'crc' || d.id === 'endo' ? SRC_MSI : SRC_ADULT;
    F.card.show({
      title: d.label,
      lines: [
        `<span class="k">Tumors analyzed:</span> ${fmt.num(d.n)}`,
        `<span class="k">Median:</span> ${s(d.median)} per megabase`,
        `<span class="k">Middle half of tumors:</span> ${s(d.p25)}–${s(d.p75)}`,
        `<span class="k">80% of tumors between</span> ${s(d.p10)} and ${s(d.p90)}`,
      ],
      note: d.note,
      source: `Source: ${src}. Counts of protein-changing mutations, not neoantigens.`,
    }, { onClose: () => el.R.select(null, { silent: true }) });
  }

  // ---------------------------------------------------------------- legend
  const legend = legendHTML([
    { shape: 'circle', fill: false, color: C.ink2, label: 'cancer of children or young adults' },
    { shape: 'circle', color: C.ink2, label: 'adult cancer' },
    { shape: 'diamond', color: C.s1, label: 'mismatch-repair deficient (MSI-high)' },
    { shape: 'tick', color: C.ink, label: 'median' },
  ]);
  const childLabel = legend.querySelector('li span');
  childLabel.prepend(ctx.h('span', { class: 'tmb-c', 'aria-hidden': 'true', text: 'C' }));
  F.top.append(legend);

  // ---------------------------------------------------------------- tools under the chart
  const tools = ctx.h('div', { class: 'tmb-tools' });
  const moreIn = ctx.h('div', { class: 'tmb-more__in' });
  const more = ctx.h('div', { class: 'tmb-more is-off' }, moreIn);
  F.below.prepend(tools);
  const allBtn = ctx.ui.button({
    label: 'Show all 29', icon: 'chevronDown', small: true, parent: tools,
    onClick: () => setView({ all: !view.all }),
  });
  allBtn.el.setAttribute('aria-pressed', 'false');
  tools.append(more);
  const sortCtl = ctx.ui.segmented({
    label: 'Sort', parent: moreIn, value: 'median',
    options: [{ value: 'median', label: 'By median' }, { value: 'group', label: 'Children / adults' }],
    onChange: (v) => setView({ sort: v }),
  });
  // Stable ids (ctx.ui ids come from a page-wide counter that depends on load order).
  { const lab = sortCtl.el.querySelector('.segmented__label'); lab.id = 'ch06-tmb-sort-label'; sortCtl.el.querySelector('[role="radiogroup"]').setAttribute('aria-labelledby', lab.id); }
  const msiCtl = ctx.ui.toggle({ label: 'Show MSI-high rows', checked: true, parent: moreIn, onChange: (on) => setView({ msi: on }) });

  // ---------------------------------------------------------------- view changes (outside the stepper)
  function setView(patch, { animate = true } = {}) {
    const before = { ...view };
    const oldY = Object.fromEntries(SORTED.map((id) => [id, el.R.yOf(id)]));
    const oldVis = new Set(SORTED.filter((id) => inView(id, before)));
    Object.assign(view, patch);
    if ('all' in patch) {
      allBtn.label = view.all ? 'Show fewer' : 'Show all 29';
      allBtn.el.setAttribute('aria-pressed', String(view.all));
      allBtn.el.querySelector('svg')?.style.setProperty('transform', view.all ? 'rotate(180deg)' : '');
      ctx.announce(view.all ? 'Showing all 29 kinds of cancer' : 'Showing 12 kinds of cancer');
    }
    const redraw = before.all !== view.all;
    if (redraw) draw();
    stepper.rebuild();
    if (el.R.selected && !inView(el.R.selected, view)) { el.R.select(null, { silent: true }); F.card.hide({ silent: true }); }
    if (!animate || ctx.reducedMotion) return;
    // Animate from the old arrangement to the new one (the rebuilt timeline already holds the end state).
    const shrinking = redraw && !view.all;
    for (const r of el.R.rows) {
      const id = r.id;
      const wasVis = oldVis.has(id);
      const isVis = inView(id, view);
      if (shrinking) { if (isVis) gsap.fromTo(r.g, { opacity: 0.4 }, { opacity: 1, duration: 0.35 }); continue; }
      const toY = el.R.yOf(id);
      const fromY = wasVis ? oldY[id] : (oldY[id] ?? toY);
      gsap.fromTo(r.g, { y: fromY, opacity: wasVis ? 1 : 0 }, { y: toY, opacity: isVis ? 1 : 0, duration: 0.7, ease: 'so.inOut', overwrite: 'auto' });
    }
    const annEls = Object.values(el.A).concat(Object.values(el.heads));
    const targets = annEls.filter((n) => Number(gsap.getProperty(n, 'opacity')) > 0.01);
    const ops = targets.map((n) => Number(gsap.getProperty(n, 'opacity')));
    if (targets.length) gsap.fromTo(targets, { opacity: 0 }, { opacity: (i) => ops[i], duration: 0.4, delay: 0.55 });
  }

  // ---------------------------------------------------------------- step states
  const ROWPARTS = (rec) => [rec.row.label, rec.row.content];
  function reset() {
    const { recs, A, heads } = el;
    layoutAnnotations();
    const l1 = layout({ ...view, sort: 'median', msi: true });
    el.R.place((r) => l1.pos[r.id]);
    for (const rec of Object.values(recs)) {
      gsap.set(rec.row.g, { opacity: l1.vis.has(rec.d.id) ? 1 : 0 });
      gsap.set(ROWPARTS(rec), { opacity: 1 });
      gsap.set(rec.band, { opacity: 0 });
    }
    gsap.set(Object.values(A), { opacity: 0 });
    gsap.set([A.b1, A.b2, A.drops, A.conn, A.arrow, A.arrow2], { drawSVG: '100%' });
    gsap.set(Object.values(heads), { opacity: 0 });
    gsap.set(more, { gridTemplateRows: ctx.compact ? '0fr' : '1fr', opacity: 0 });
  }
  const dimTo = (tl, keep, at, dim = 0.2) => {
    for (const rec of Object.values(el.recs)) tl.to(ROWPARTS(rec), { opacity: keep.includes(rec.d.id) ? 1 : dim, duration: 0.6 }, at);
  };

  const STEPS = [
    { // 1 — the spread: ~150× between typical tumors, >1,000× between individual tumors
      enter(tl) {
        const { A } = el;
        dimTo(tl, STEP_ROWS[0], 0);
        tl.fromTo(A.b1, { opacity: 1, drawSVG: '50% 50%' }, { drawSVG: '0% 100%', duration: 0.8, ease: 'so.out' }, 0.45);
        tl.fromTo(A.drops, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0.9);
        tl.fromTo(A.b1t, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0.9);
        tl.fromTo(A.b2, { opacity: 1, drawSVG: '50% 50%' }, { drawSVG: '0% 100%', duration: 0.9, ease: 'so.out' }, 1.5);
        tl.fromTo(A.b2t, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 2.0);
      },
    },
    { // 2 — causes: sunlight (skin vs eye melanoma) and tobacco
      enter(tl) {
        const { A } = el;
        tl.to([A.b1, A.b1t, A.b2, A.b2t, A.drops], { opacity: 0, duration: 0.4 }, 0);
        dimTo(tl, STEP_ROWS[1], 0.1);
        tl.fromTo(A.conn, { opacity: 1, drawSVG: '0%' }, { drawSVG: '100%', duration: 1.1, ease: 'so.inOut' }, 0.6);
        tl.fromTo(A.connHead, { opacity: 0 }, { opacity: 1, duration: 0.25 }, 1.6);
        tl.fromTo(A.connT, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 1.4);
        tl.fromTo([A.sun, A.smoke1, A.smoke2], { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: 0.15 }, 1.0);
      },
    },
    { // 3 — mismatch repair: ≈ 11× on the colorectal pair (and the endometrial pair in the full view)
      enter(tl) {
        const { A, recs, heads } = el;
        tl.to([A.conn, A.connHead, A.connT, A.sun, A.smoke1, A.smoke2], { opacity: 0, duration: 0.4 }, 0);
        dimTo(tl, SORTED, 0.1);
        const l3 = layout(view);
        const l1 = layout({ ...view, sort: 'median', msi: true });
        el.R.place((r) => l3.pos[r.id], { tl, at: 0.2, duration: 0.7, ease: 'so.inOut' });
        for (const rec of Object.values(recs)) {
          const was = l1.vis.has(rec.d.id);
          const now = l3.vis.has(rec.d.id);
          if (was !== now) tl.to(rec.row.g, { opacity: now ? 1 : 0, duration: 0.5 }, 0.2);
        }
        if (view.sort === 'group') tl.to(Object.values(heads), { opacity: 1, duration: 0.5 }, 0.7);
        const pairs = view.msi ? [['crc', 'crcmsi', A.arrow, A.head, A.arrowT]] : [];
        if (view.msi && view.all) pairs.push(['endo', 'endomsi', A.arrow2, A.head2, null]);
        pairs.forEach(([a, b, path, head, txt], k) => {
          const at = 0.9 + k * 0.5;
          tl.to([recs[a].band, recs[b].band], { opacity: 1, duration: 0.5 }, at);
          tl.fromTo(path, { opacity: 1, drawSVG: '0%' }, { drawSVG: '100%', duration: 1.0, ease: 'so.inOut' }, at + 0.2);
          tl.fromTo(head, { opacity: 0 }, { opacity: 1, duration: 0.25 }, at + 1.1);
          if (txt) tl.fromTo(txt, { opacity: 0 }, { opacity: 1, duration: 0.4 }, at + 0.7);
        });
        tl.fromTo(more, { opacity: 0, gridTemplateRows: ctx.compact ? '0fr' : '1fr' }, { opacity: 1, gridTemplateRows: '1fr', duration: 0.6 }, 0.4);
      },
    },
  ];

  // ---------------------------------------------------------------- lifecycle
  ctx.onResize(({ compact }) => {
    tools.classList.toggle('is-compact', compact);
    placeAux(compact);
    const next = compact ? LAYOUTS.compact : LAYOUTS.wide;
    if (next === L && svg) return;
    L = next;
    draw();
    if (stepper) stepper.rebuild();
  });
  if (!svg) draw();

  stepper = ctx.ui.stepper({
    steps: STEPS,
    reset,
    scene: F.main,
    onChange(i) {
      step = i;
      more.classList.toggle('is-off', i < 2);
      if (i < 2 && (view.sort !== 'median' || !view.msi)) {
        sortCtl.set('median'); msiCtl.set(true);
        view.sort = 'median'; view.msi = true;
        stepper.rebuild();
      }
    },
  });

  return { destroy() { F.card.hide({ silent: true }); } };
}
