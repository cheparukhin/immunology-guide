// ch01-census — "Where your immune cells live" (Figure 1.4)
//
// A unit (waffle) chart of the body's ~1.8 trillion immune cells (Sender et al., PNAS 2023):
// 184 squares of 10 billion cells, sorted by place (default) or by cell type, then 122
// squares of 10 g of cells (by weight). The same square objects fly between layouts.
// Hover/tap a square for its value; hover/tap/Enter a legend item to highlight a group
// (others dim to 20%). A "Show numbers" table carries the full 11-type × 10-place data.
// Real data on a light stage: entity colors (each series IS a cell type, §4 rule 20), a
// darker 1 px stroke on every square (≥ 3:1), always-visible source line (§4 rule 19).
// Built on shared/unit-grid.js + shared/chart.js; cell icons from the art library.
import { C, chartFrame } from './shared/chart.js';
import { unitGrid } from './shared/unit-grid.js';
import {
  PALETTE, neutrophil, tCell, bCell, macrophage, mastCell, dendriticCell, plasmaCell, nkCell, genericCell,
} from '../art/index.js';

const ID = 'ch01-census';

// ------------------------------------------------------------------ data (verbatim from the spec)
const PLACES = [
  { id: 'marrow', name: 'Bone marrow', share: 40, in: 'in the bone marrow' },
  { id: 'nodes', name: 'Lymph nodes', share: 22, in: 'in lymph nodes' },
  { id: 'spleen', name: 'Spleen', share: 15, in: 'in the spleen' },
  { id: 'thymus', name: 'Thymus', share: 2, in: 'in the thymus' },
  { id: 'skin', name: 'Skin', share: 4, in: 'in the skin' },
  { id: 'lungs', name: 'Lungs', share: 4, in: 'in the lungs' },
  { id: 'gut', name: 'Gut', share: 3, in: 'in the gut' },
  { id: 'liver', name: 'Liver', share: 3, in: 'in the liver' },
  { id: 'elsewhere', name: 'Elsewhere', share: 5, in: 'elsewhere in the body' },
  { id: 'blood', name: 'Blood', share: 2, in: 'in the blood' },
];
const PLACE_TOTALS = [736.2, 411.8, 273.8, 31.3, 81.0, 70.9, 52.9, 51.2, 91.8, 37.1];
// Cell counts, billions (11 types × 10 places + total) — for the "Show numbers" table.
const TABLE = [
  ['Neutrophils', [591.8, 1.2, 44.1, 0.7, 1.9, 2.2, 0.5, 0.0, 0.0, 22.1], 664.5],
  ['T cells', [21.5, 219.9, 113.6, 29.5, 26.5, 12.7, 17.6, 7.9, 10.8, 7.9], 467.8],
  ['B cells', [14.4, 165.7, 66.5, 0.6, 0.6, 2.2, 7.7, 1.8, 0.6, 1.3], 261.5],
  ['Macrophages', [48.6, 8.5, 17.0, 0.2, 12.0, 28.6, 4.6, 36.0, 47.5, 0.0], 203.0],
  ['Mast cells', [0.9, 0.0, 0.0, 0.0, 28.4, 21.8, 9.0, 0.0, 29.2, 0.0], 89.1],
  ['Dendritic cells', [0.0, 15.1, 22.7, 0.1, 9.6, 0.0, 0.0, 0.0, 0.0, 0.1], 47.5],
  ['Eosinophils', [29.0, 0.0, 2.3, 0.1, 0.0, 1.3, 0.6, 0.0, 0.0, 1.0], 34.3],
  ['Monocytes', [23.0, 0.9, 6.2, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 3.0], 33.1],
  ['Plasma cells', [2.2, 0.2, 1.0, 0.0, 0.0, 1.4, 12.2, 0.0, 0.6, 0.0], 17.7],
  ['NK cells', [3.3, 0.3, 0.4, 0.1, 1.9, 0.7, 0.8, 5.5, 3.1, 1.6], 17.7],
  ['Basophils', [1.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.2], 1.7],
];
const row = (name) => TABLE.find((r) => r[0] === name)[1];
const sumRows = (...names) => PLACES.map((_, p) => Math.round(names.reduce((s, n) => s + row(n)[p], 0) * 10) / 10);

// 9 groups in descending order of count (the "By type" order). sq = squares per place (each
// = 10 billion cells, largest-remainder rounding to 184); wsq = squares of 10 g (total 122).
const GROUPS = [
  { id: 'neutrophil', name: 'Neutrophils', desc: 'short-lived, fast cells that engulf bacteria',
    sq: [59, 0, 5, 0, 0, 0, 0, 0, 0, 2], bn: row('Neutrophils'), total: 664.5, grams: 210, wsq: 21 },
  { id: 'tcell', name: 'T cells', desc: 'specific killers and coordinators (all kinds combined)',
    sq: [2, 22, 11, 3, 3, 1, 2, 1, 1, 1], bn: row('T cells'), total: 467.8, grams: 100, wsq: 10 },
  { id: 'bcell', name: 'B cells', desc: 'antibody makers',
    sq: [1, 17, 7, 0, 0, 0, 1, 0, 0, 0], bn: row('B cells'), total: 261.5, grams: 56, wsq: 5 },
  { id: 'macrophage', name: 'Macrophages', desc: 'large, tissue-resident cells that clear debris and microbes and raise the alarm',
    sq: [5, 1, 2, 0, 1, 3, 0, 3, 5, 0], bn: row('Macrophages'), total: 203.0, grams: 601, wsq: 60 },
  { id: 'mast', name: 'Mast cells', desc: 'sentinels in skin, airways and gut; behind many allergy symptoms',
    sq: [0, 0, 0, 0, 3, 2, 1, 0, 3, 0], bn: row('Mast cells'), total: 89.1, grams: 96, wsq: 10 },
  { id: 'other', name: 'Other', desc: 'eosinophils, monocytes and basophils', label: 'Other cells',
    sq: [6, 0, 1, 0, 0, 0, 0, 0, 0, 0], bn: sumRows('Eosinophils', 'Monocytes', 'Basophils'), total: 69.0, grams: 25, wsq: 2 },
  { id: 'dc', name: 'Dendritic cells', desc: 'cells that sample tissue and carry what they collect to lymph nodes',
    sq: [0, 2, 2, 0, 1, 0, 0, 0, 0, 0], bn: row('Dendritic cells'), total: 47.5, grams: 106, wsq: 11 },
  { id: 'plasma', name: 'Plasma cells', desc: 'cells that secrete antibodies in bulk, most of them in the gut wall',
    sq: [0, 0, 0, 0, 0, 0, 2, 0, 0, 0], bn: row('Plasma cells'), total: 17.7, grams: 27, wsq: 3 },
  { id: 'nk', name: 'NK cells', desc: 'natural killers of stressed or infected cells',
    sq: [1, 0, 0, 0, 0, 0, 0, 1, 0, 0], bn: row('NK cells'), total: 17.7, grams: 3.8, wsq: 0 },
];
const LOWER = { neutrophil: 'neutrophils', tcell: 'T cells', bcell: 'B cells', macrophage: 'macrophages', mast: 'mast cells', other: 'other cells', dc: 'dendritic cells', plasma: 'plasma cells', nk: 'NK cells' };
const GBY = Object.fromEntries(GROUPS.map((g) => [g.id, g]));
for (const G of GROUPS) {
  G.count = G.sq.reduce((a, b) => a + b, 0);
  G.placeOf = [];
  G.sq.forEach((n, p) => { for (let k = 0; k < n; k++) G.placeOf.push(p); });
}

const SOURCE_HTML = 'Estimates for a reference 73-kg adult man (<a href="#src-1">Sender et al., 2023</a>). Each number has wide error bars. Blank combinations mean ‘not estimated’, not ‘absent’. For example, dendritic cells also live in the gut and lungs.';
const CITE = 'Sender et al. 2023';
const VIEWS = [
  { value: 'place', label: 'By place' },
  { value: 'type', label: 'By type' },
  { value: 'weight', label: 'By weight' },
];
const KEY = {
  place: { unit: '10 billion cells', all: '184 squares ≈ 1.8 trillion cells' },
  type: { unit: '10 billion cells', all: '184 squares ≈ 1.8 trillion cells' },
  weight: { unit: '10 grams of cells', all: '122 squares ≈ 1.2 kg' },
};

// ------------------------------------------------------------------ formatting
/** Two significant figures, as words-friendly text: 591.8 → '590', 66.5 → '67', 8.5 → '8.5', 9.0 → '9'. */
function sig2(v) {
  if (v >= 100) return String(Math.round(v / 10) * 10);
  if (v >= 10) return String(Math.round(v + 1e-9));
  return String(Math.round(v * 10 + 1e-9) / 10);
}
const gramsText = (G) => (G.grams < 10 ? '4' : sig2(G.grams));
const one = (v) => (v === 0 ? '' : v.toFixed(1));

// ------------------------------------------------------------------ units (one per square object)
// Each group owns max(count squares, weight squares) units; unit k of a group is the k-th
// square of that group in every view (so most squares keep their identity across views).
const UNITS = [];
for (const G of GROUPS) {
  const n = Math.max(G.count, G.wsq);
  for (let k = 0; k < n; k++) UNITS.push({ grp: G.id, k });
}

// Cluster membership per view: [{ key, members: [unitIndex…] }] in cluster order.
function clustersFor(view) {
  if (view === 'place') {
    return PLACES.map((P, p) => ({
      key: P.id,
      members: UNITS.map((u, i) => [u, i]).filter(([u]) => GBY[u.grp].placeOf[u.k] === p && u.k < GBY[u.grp].count).map(([, i]) => i),
    }));
  }
  return GROUPS.map((G) => ({
    key: G.id,
    members: UNITS.map((u, i) => [u, i]).filter(([u]) => u.grp === G.id && u.k < (view === 'weight' ? G.wsq : G.count)).map(([, i]) => i),
  }));
}
const CLUSTERS = { place: clustersFor('place'), type: clustersFor('type'), weight: clustersFor('weight') };

// ------------------------------------------------------------------ colors (figure-scoped CSS)
// Fill = canonical entity color; 1 px stroke = the deep variant in the light theme (≥ 3:1 on
// the surface), the fill itself in the dark theme (where base colors already read).
const SWATCH = {
  neutrophil: { fill: 'var(--c-neutrophil)', light: 'var(--c-neutrophil-deep)', dark: 'var(--c-neutrophil)' },
  tcell: { fill: 'var(--c-cd8)', light: 'var(--c-cd8-deep)', dark: 'var(--c-cd8)' },
  bcell: { fill: 'var(--c-bcell)', light: 'var(--c-bcell-deep)', dark: 'var(--c-bcell)' },
  macrophage: { fill: 'var(--c-macrophage)', light: 'var(--c-macrophage-deep)', dark: 'var(--c-macrophage)' },
  mast: { fill: null, light: PALETTE.mastGranule, dark: PALETTE.mast },            // fill: granule pattern
  other: { fill: 'var(--cz-other)', light: '#7E776C', dark: 'var(--cz-other)' },
  dc: { fill: 'var(--c-dc)', light: 'var(--c-dc-deep)', dark: 'var(--c-dc)' },
  plasma: { fill: null, light: 'var(--c-bcell-deep)', dark: 'var(--c-bcell)' },    // fill: B-gold hatch pattern
  nk: { fill: 'var(--c-nk)', light: 'var(--c-nk-deep)', dark: 'var(--c-nk)' },
};
const strokeVars = (dark) => Object.entries(SWATCH).map(([k, sw]) => `--cz-s-${k}: ${dark ? sw.dark : sw.light};`).join(' ');

const CSS = `
[data-figure="${ID}"] { --cz-other: #BDB5A9; --cz-mast: ${PALETTE.mast}; --cz-granule: ${PALETTE.mastGranule}; ${strokeVars(false)} }
:root[data-theme="dark"] [data-figure="${ID}"] { --cz-other: #8F887D; --cz-granule: #8C8FE0; ${strokeVars(true)} }
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) [data-figure="${ID}"] { --cz-other: #8F887D; --cz-granule: #8C8FE0; ${strokeVars(true)} } }
${Object.keys(SWATCH).map((k) => `[data-figure="${ID}"] svg .ug-unit[data-group="${k}"] .ug-body path { stroke: var(--cz-s-${k}); stroke-width: 1px; vector-effect: non-scaling-stroke; }`).join('\n')}
[data-figure="${ID}"] .cz-defs { position: absolute; width: 0; height: 0; overflow: hidden; }
[data-figure="${ID}"] .ck-frame__toolbar { justify-content: space-between; }
[data-figure="${ID}"] .cz-key { margin: 0; display: flex; flex-wrap: wrap; align-items: center; gap: 4px 8px; font: 500 13px/1.35 var(--font-ui); color: var(--fg-2); font-variant-numeric: tabular-nums; }
[data-figure="${ID}"] .cz-key svg { flex: none; width: 14px; height: 14px; }
[data-figure="${ID}"] .cz-key b { font-weight: 650; color: var(--fg); }
[data-figure="${ID}"] .cz-key .sep { color: var(--fg-3); }
[data-figure="${ID}"] .cz-key > span { white-space: nowrap; }
[data-figure="${ID}"].is-compact .cz-key .sep { display: none; }
[data-figure="${ID}"].is-compact .cz-key > span:last-child { flex-basis: 100%; padding-left: 22px; color: var(--fg-3); }
[data-figure="${ID}"] .ck-frame__main > svg { touch-action: manipulation; }
[data-figure="${ID}"] svg .ug-unit { cursor: default; }
[data-figure="${ID}"] svg .ug-unit.cz-off { pointer-events: none; }
[data-figure="${ID}"] svg .ug-unit.is-hot .ug-body path { stroke: var(--fg); stroke-width: 2px; }
[data-figure="${ID}"] svg .cz-name { font-size: max(15px, calc(13px * var(--u, 1))); font-weight: 600; fill: var(--fg); }
[data-figure="${ID}"] svg .cz-row-name { font-size: max(14px, calc(13px * var(--u, 1))); font-weight: 600; fill: var(--fg); }
[data-figure="${ID}"] svg .cz-val { font-size: max(13px, calc(12px * var(--u, 1))); font-weight: 500; fill: var(--fg-2); font-variant-numeric: tabular-nums; }
[data-figure="${ID}"] svg .cz-val b, [data-figure="${ID}"] svg .cz-strong { font-weight: 680; fill: var(--fg); }
[data-figure="${ID}"] svg .cz-bracket { fill: none; stroke: var(--fg-3); stroke-width: 1; vector-effect: non-scaling-stroke; }
[data-figure="${ID}"] svg .cz-blood-box { fill: none; stroke: var(--fg-3); stroke-width: 1; vector-effect: non-scaling-stroke; }
[data-figure="${ID}"] svg .cz-partial-out { fill: none; stroke: var(--cz-s-nk); stroke-width: 1; stroke-dasharray: 2.5 1.5; vector-effect: non-scaling-stroke; }
[data-figure="${ID}"] svg .cz-partial-note { font-size: max(12px, calc(11px * var(--u, 1))); fill: var(--fg-3); }
[data-figure="${ID}"] svg .cz-partial-in { fill: var(--c-nk); stroke: none; }
[data-figure="${ID}"] .cz-legend { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 4px 14px; }
[data-figure="${ID}"].is-compact .cz-legend { grid-template-columns: minmax(0, 1fr); gap: 2px; }
[data-figure="${ID}"] .cz-leg { display: grid; grid-template-columns: 14px 30px minmax(0, 1fr); align-items: center; gap: 4px 8px; width: 100%; min-height: 44px; padding: 5px 8px;
  border: 1px solid transparent; border-radius: 10px; background: none; text-align: left; font: inherit; color: var(--fg); cursor: pointer;
  transition: background-color var(--dur-1) ease, border-color var(--dur-1) ease, opacity var(--dur-2) ease; }
[data-figure="${ID}"] .cz-leg:hover { background: color-mix(in srgb, var(--fg) 5%, transparent); }
[data-figure="${ID}"] .cz-leg[aria-pressed="true"] { border-color: var(--line); background: color-mix(in srgb, var(--fg) 6%, transparent); }
[data-figure="${ID}"] .cz-legend.has-focus .cz-leg:not(.is-on) { opacity: 0.5; }
[data-figure="${ID}"] .cz-leg:focus-visible { outline: 2px solid var(--stage-focus); outline-offset: 1px; }
[data-figure="${ID}"] .cz-leg__sw { width: 14px; height: 14px; overflow: visible; }
[data-figure="${ID}"] .cz-leg__icon { width: 30px; height: 30px; overflow: visible; }
[data-figure="${ID}"] .cz-leg__text { min-width: 0; font-family: var(--font-ui); font-size: 13px; line-height: 1.35; color: var(--fg-2); text-wrap: pretty; }
[data-figure="${ID}"] .cz-leg__text b { display: block; font-size: 14px; font-weight: 650; color: var(--fg); }
[data-figure="${ID}"] .cz-numbers { font-family: var(--font-ui); }
[data-figure="${ID}"] .cz-numbers > summary { display: inline-flex; align-items: center; gap: 6px; min-height: 40px; padding: 0 12px; border: 1px solid var(--rule-strong, var(--line)); border-radius: 999px;
  font-size: 13px; font-weight: 600; color: var(--fg-2); cursor: pointer; list-style: none; }
[data-figure="${ID}"] .cz-numbers > summary::-webkit-details-marker { display: none; }
[data-figure="${ID}"] .cz-numbers > summary::before { content: ""; width: 0; height: 0; border-left: 5px solid currentColor; border-top: 4px solid transparent; border-bottom: 4px solid transparent; transition: transform var(--dur-2) ease; }
[data-figure="${ID}"] .cz-numbers[open] > summary::before { transform: rotate(90deg); }
[data-figure="${ID}"] .cz-numbers > summary:hover { color: var(--fg); }
[data-figure="${ID}"] .cz-table-wrap { margin-top: 10px; max-width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; border: 1px solid var(--line); border-radius: 10px; }
[data-figure="${ID}"] .cz-table { border-collapse: collapse; font-size: 12.5px; line-height: 1.3; color: var(--fg); font-variant-numeric: tabular-nums; white-space: nowrap; min-width: 100%; }
[data-figure="${ID}"] .cz-table-cap { margin: 10px 0 0; font-size: 12px; line-height: 1.45; color: var(--fg-3); }
[data-figure="${ID}"] .cz-table th, [data-figure="${ID}"] .cz-table td { padding: 5px 8px; text-align: right; border-top: 1px solid var(--line); }
[data-figure="${ID}"] .cz-table thead th { font-weight: 600; color: var(--fg-2); border-top: 0; vertical-align: bottom; white-space: normal; min-width: 3.6em; }
[data-figure="${ID}"] .cz-table th[scope="row"] { text-align: left; font-weight: 600; position: sticky; left: 0; background: var(--halo); }
[data-figure="${ID}"] .cz-table .is-total { font-weight: 650; }
[data-figure="${ID}"].is-compact .ck-frame__toolbar .segmented, [data-figure="${ID}"].is-compact .ck-frame__toolbar .segmented__track { width: 100%; }
[data-figure="${ID}"].is-compact .ck-frame__toolbar .segmented__opt { flex: 1 1 0; justify-content: center; padding: 0 0.4rem; }
`;
function injectCSS() {
  if (document.getElementById(`${ID}-css`)) return;
  const s = document.createElement('style');
  s.id = `${ID}-css`;
  s.textContent = CSS;
  document.head.append(s);
}

// ------------------------------------------------------------------ cell icons (art library)
function cellIcon(id, r, stage) {
  // Drawn at high detail (r = 20) and scaled down, so small icons keep their texture cues.
  const R = 20;
  const o = { r: R, seed: 7, stage, glow: stage === 'dark', detail: 'high', receptors: false };
  let c;
  switch (id) {
    case 'neutrophil': c = neutrophil({ ...o, lobes: 3 }); break;
    case 'tcell': c = tCell({ ...o, variant: 'cd8' }); break;
    case 'bcell': c = bCell(o); break;
    case 'macrophage': c = macrophage({ ...o, r: R * 1.25, variant: 'm1' }); break;
    case 'mast': c = mastCell(o); break;
    case 'dc': c = dendriticCell({ ...o, r: R * 1.3, state: 'immature' }); break;
    case 'plasma': c = plasmaCell({ ...o, r: R * 1.05, antibodies: 0, secreting: false }); break;
    case 'nk': c = nkCell(o); break;
    default: c = genericCell({ ...o, color: '#B3AA9E', nucleusShape: 'kidney', nucleus: 0.42, granules: 6 });
  }
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  const inner = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  inner.setAttribute('transform', `scale(${r / R})`);
  inner.append(c);
  g.append(inner);
  return g;
}

// ------------------------------------------------------------------ layouts
// Wide: 10-wide blocks (one row = 100 billion cells) in two rows, labels above.
// Stacked (phones / narrow stages): one block per line, label on the left, value right-aligned.
const WIDE = { W: 1060, s: 14, gap: 2 };
const NARROW_MAX = 720;

export default function mount(fig, ctx) {
  injectCSS();
  const { gsap } = ctx;
  const F = chartFrame(ctx, { toolbar: true, source: '', card: false });
  F.sourceEl.innerHTML = SOURCE_HTML;
  F.sourceEl.hidden = false;

  let view = 'place';
  let svg = null;
  let grid = null;
  let L = null;            // current layout record
  let layoutKey = '';
  let hl = null;           // sticky highlight (group id)
  let hover = null;        // hover highlight (group id)
  let tl = null;           // running view transition
  let revealed = false;    // intro reveal played
  let card = null;

  // Patterns (plasma hatch, mast granules) in a figure-owned hidden <svg>, so legend swatches
  // and the chart can both reference them, and ids survive chart rebuilds.
  const uid = `${ID}-${Math.random().toString(36).slice(2, 7)}`;
  const defsSvg = ctx.svg('svg', { class: 'cz-defs', width: 0, height: 0, 'aria-hidden': 'true', focusable: 'false' });
  const defs = ctx.svg('defs', {}, defsSvg);
  const plasmaPat = ctx.svg('pattern', { id: `${uid}-plasma`, patternUnits: 'userSpaceOnUse', width: 4, height: 4, patternTransform: 'rotate(45)' }, defs);
  ctx.svg('rect', { width: 4, height: 4, style: 'fill: var(--c-bcell)' }, plasmaPat);
  ctx.svg('line', { x1: 1, y1: 0, x2: 1, y2: 4, style: 'stroke: var(--c-bcell-deep); stroke-width: 1.3' }, plasmaPat);
  const mastPat = ctx.svg('pattern', { id: `${uid}-mast`, patternUnits: 'userSpaceOnUse', width: 5, height: 5 }, defs);
  ctx.svg('rect', { width: 5, height: 5, style: 'fill: var(--cz-mast)' }, mastPat);
  ctx.svg('circle', { cx: 1.25, cy: 1.25, r: 0.95, style: 'fill: var(--cz-granule)' }, mastPat);
  ctx.svg('circle', { cx: 3.75, cy: 3.75, r: 0.95, style: 'fill: var(--cz-granule)' }, mastPat);
  F.el.append(defsSvg);
  const FILL = {
    ...Object.fromEntries(Object.entries(SWATCH).map(([k, s]) => [k, s.fill])),
    plasma: `url(#${uid}-plasma)`,
    mast: `url(#${uid}-mast)`,
  };

  // ---------------------------------------------------------------- toolbar: view switch + key
  const seg = ctx.ui.segmented({
    label: 'Sort the squares', hideLabel: true, value: view, parent: F.toolbar, options: VIEWS,
    onChange: (v) => setView(v),
  });
  const key = ctx.h('p', { class: 'cz-key', 'aria-live': 'off' });
  F.toolbar.append(key);
  const paintKey = () => {
    const k = KEY[view];
    key.innerHTML = `<svg viewBox="0 0 14 14" aria-hidden="true"><rect x="0.5" y="0.5" width="13" height="13" rx="2" style="fill: var(--chart-muted); stroke: var(--fg-3)"/></svg><span>1 square = <b>${k.unit}</b></span><span class="sep" aria-hidden="true">·</span><span>${k.all}</span>`;
  };
  paintKey();

  // ---------------------------------------------------------------- legend (HTML, under the chart)
  const legend = ctx.h('ul', { class: 'cz-legend', role: 'list', 'aria-label': 'Cell types: hover, tap or press Enter to highlight' });
  const legendBtns = new Map();
  function legendSwatch(id) {
    return `<svg class="cz-leg__sw" viewBox="0 0 14 14" aria-hidden="true"><rect x="0.5" y="0.5" width="13" height="13" rx="2" style="fill:${FILL[id]};stroke:var(--cz-s-${id});stroke-width:1"/></svg>`;
  }
  function buildLegend() {
    legend.replaceChildren();
    for (const G of GROUPS) {
      const b = ctx.h('button', { type: 'button', class: 'cz-leg', 'aria-pressed': String(hl === G.id), dataset: { group: G.id } });
      b.innerHTML = `${legendSwatch(G.id)}<svg class="cz-leg__icon" viewBox="-15 -15 30 30" aria-hidden="true"></svg><span class="cz-leg__text"><b>${G.name}</b>${G.desc}</span>`;
      b.querySelector('.cz-leg__icon').append(cellIcon(G.id, 11, ctx.artStage));
      b.addEventListener('click', () => { setHighlight(hl === G.id ? null : G.id); }, { signal: ctx.signal });
      b.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') { hover = G.id; applyHighlight(); } }, { signal: ctx.signal });
      b.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse' && hover === G.id) { hover = null; applyHighlight(); } }, { signal: ctx.signal });
      legend.append(ctx.h('li', null, b));
      legendBtns.set(G.id, b);
    }
  }
  buildLegend();
  F.below.append(legend);

  // ---------------------------------------------------------------- "Show numbers" table
  const numbers = ctx.h('details', { class: 'cz-numbers' });
  numbers.innerHTML = `<summary>Show numbers</summary><p class="cz-table-cap" id="${ID}-tcap">Immune cells by type and place, in billions of cells (Sender et al. 2023). Blank = not estimated.</p><div class="cz-table-wrap" tabindex="0" role="region" aria-labelledby="${ID}-tcap"><table class="cz-table" aria-labelledby="${ID}-tcap">
<thead><tr><th scope="col">Cell type</th>${PLACES.map((P) => `<th scope="col">${P.name}</th>`).join('')}<th scope="col" class="is-total">Total</th></tr></thead>
<tbody>${TABLE.map(([name, vals, tot]) => `<tr><th scope="row">${name}</th>${vals.map((v) => `<td>${one(v)}</td>`).join('')}<td class="is-total">${tot.toFixed(1)}</td></tr>`).join('')}
<tr class="is-total"><th scope="row">Total</th>${PLACE_TOTALS.map((v) => `<td>${v.toFixed(1)}</td>`).join('')}<td>1,838.0</td></tr></tbody></table></div>`;
  F.sourceEl.after(numbers);

  // ---------------------------------------------------------------- captions (one per view)
  const capWrap = ctx.h('div', { class: 'fig__steps' });
  const capEls = VIEWS.map((v, i) => {
    const c = ctx.h('div', { class: 'fig__step', 'aria-hidden': 'true' }, ctx.h('p', { class: 'fig__step-text', html: ctx.steps[i]?.html || '' }));
    capWrap.append(c);
    return c;
  });
  ctx.caption.append(capWrap);
  const syncCaption = () => {
    const i = VIEWS.findIndex((v) => v.value === view);
    capEls.forEach((c, k) => { c.classList.toggle('is-active', k === i); c.setAttribute('aria-hidden', String(k !== i)); });
  };
  syncCaption();

  // ---------------------------------------------------------------- layout maths
  // Returns { W, H, s, gap, pitch, slots: { view: { key: { x, y } } }, labels: fn(g, view) }.
  function wideLayout() {
    const { W, s, gap } = WIDE;
    const pitch = s + gap;
    const cw = 10 * pitch - gap;
    const yA = 80; const yB = 312;          // squares top, rows A and B
    const place = {};
    const xA = [0, 204, 382, 560];
    ['marrow', 'nodes', 'spleen', 'thymus'].forEach((k, i) => { place[k] = { x: xA[i], y: yA }; });
    const xB = [0, 178, 356, 534, 712];
    ['skin', 'lungs', 'gut', 'liver', 'elsewhere'].forEach((k, i) => { place[k] = { x: xB[i], y: yB }; });
    place.blood = { x: 922, y: yB };
    const typed = {};
    GROUPS.forEach((G, i) => { typed[G.id] = i < 4 ? { x: i * 186, y: yA } : { x: (i - 4) * 186, y: yB }; });
    return { mode: 'wide', W, H: yB + 2 * pitch + 14, s, gap, pitch, cw, yA, yB, slots: { place, type: typed, weight: typed } };
  }

  function narrowLayout(width) {
    const W = Math.round(Math.max(300, Math.min(width, 600)));
    const s = 11; const gap = 2; const pitch = s + gap;
    const cw = 10 * pitch - gap;
    const bx = W - cw;
    const rowGap = 10; const headH = 26; const lineH = 16;
    const heightOf = (n) => Math.max(lineH, Math.ceil(n / 10) * pitch - gap);
    const stack = (keys, counts, heads = {}, extra = {}) => {
      const out = {};
      let y = 4;
      keys.forEach((k, i) => {
        if (heads[k]) { out[`head:${k}`] = { y: y + 13 }; y += headH; }
        if (extra[k]) y += extra[k];
        out[k] = { x: bx, y };
        y += heightOf(counts[i]) + rowGap;
      });
      return { slots: out, bottom: y };
    };
    const P = stack(PLACES.map((p) => p.id), PLACES.map((_, p) => GROUPS.reduce((a, G) => a + G.sq[p], 0)),
      { nodes: 'LYMPHOID ORGANS · 39%', skin: 'TISSUES · 19%' }, { blood: 10 });
    const T = stack(GROUPS.map((g) => g.id), GROUPS.map((g) => g.count));
    const Wt = stack(GROUPS.map((g) => g.id), GROUPS.map((g) => Math.max(1, g.wsq)));
    const heights = { place: P.bottom - 4, type: T.bottom - 4, weight: Wt.bottom - 4 };
    const H = Math.max(...Object.values(heights));
    return { mode: 'narrow', W, H, heights, s, gap, pitch, cw, bx, slots: { place: P.slots, type: T.slots, weight: Wt.slots } };
  }

  // Phones: the chart's height follows the view (the stacked lists differ a lot in length).
  function viewBoxFor(v) {
    const H = L.mode === 'wide' ? L.H : L.heights[v];
    return `${L.mode === 'wide' ? 0 : -2} -2 ${L.W + 4} ${H + 4}`;
  }

  // Target centre of unit i in a view (null = not shown in this view).
  function targets(v) {
    const out = new Array(UNITS.length).fill(null);
    for (const cl of CLUSTERS[v]) {
      const slot = L.slots[v][cl.key];
      // Order inside a cluster: by group (descending order), then by k.
      const members = [...cl.members].sort((a, b) => (GROUPS.findIndex((g) => g.id === UNITS[a].grp) - GROUPS.findIndex((g) => g.id === UNITS[b].grp)) || (UNITS[a].k - UNITS[b].k));
      members.forEach((i, j) => {
        out[i] = { x: slot.x + (j % 10) * L.pitch + L.s / 2, y: slot.y + Math.floor(j / 10) * L.pitch + L.s / 2 };
      });
    }
    return out;
  }

  // ---------------------------------------------------------------- labels per view
  function text(parent, attrs, str) { return ctx.svg('text', { ...attrs, text: str }, parent); }

  function drawLabelsWide(layers) {
    const { slots, yA, yB, cw } = L;
    const nameDy = -30; const valDy = -12;
    // Place view.
    const gp = layers.place;
    for (const P of PLACES) {
      const sl = slots.place[P.id];
      if (P.id === 'blood') {
        text(gp, { class: 'cz-name', x: sl.x, y: sl.y + nameDy }, 'Blood');
        text(gp, { class: 'cz-val', x: sl.x, y: sl.y + valDy }, 'only ~2%');
        ctx.svg('rect', { class: 'cz-blood-box', x: sl.x - 12, y: sl.y + nameDy - 22, width: 120, height: -nameDy + 22 + L.s + 12, rx: 8 }, gp);
        continue;
      }
      text(gp, { class: 'cz-name', x: sl.x, y: sl.y + nameDy }, P.name);
      text(gp, { class: 'cz-val', x: sl.x, y: sl.y + valDy }, `${P.share}%`);
    }
    const bracket = (x0, x1, y, label) => {
      text(gp, { class: 't-caps', x: x0, y: y - 8 }, label);
      ctx.svg('path', { class: 'cz-bracket', d: `M${x0},${y + 6}V${y}H${x1}V${y + 6}` }, gp);
    };
    bracket(slots.place.nodes.x, slots.place.thymus.x + cw, yA - 62, 'Lymphoid organs · 39%');
    bracket(slots.place.skin.x, slots.place.elsewhere.x + cw, yB - 62, 'Tissues · 19%');
    // Type + weight views: icon + name + value.
    for (const v of ['type', 'weight']) {
      const g = layers[v];
      for (const G of GROUPS) {
        const sl = slots[v][G.id];
        const ic = cellIcon(G.id, 10, ctx.artStage);
        ic.setAttribute('transform', `translate(${sl.x + 10} ${sl.y + nameDy + 5})`);
        g.append(ic);
        text(g, { class: 'cz-name', x: sl.x + 26, y: sl.y + nameDy }, G.name);
        const val = v === 'type' ? `≈ ${sig2(G.total)} billion` : `≈ ${gramsText(G)} g`;
        text(g, { class: 'cz-val', x: sl.x + 26, y: sl.y + valDy }, val);
      }
    }
  }

  function drawLabelsNarrow(layers) {
    const { slots, bx, s } = L;
    const vx = bx - 10;
    const baseDy = s / 2 + 5;
    const gp = layers.place;
    for (const P of PLACES) {
      const sl = slots.place[P.id];
      if (P.id === 'blood') {
        ctx.svg('rect', { class: 'cz-blood-box', x: -7, y: sl.y - 8, width: L.W + 14, height: L.s + 16, rx: 8 }, gp);
        text(gp, { class: 'cz-row-name', x: 0, y: sl.y + baseDy }, 'Blood');
        text(gp, { class: 'cz-val t-end', x: vx, y: sl.y + baseDy }, 'only ~2%');
        continue;
      }
      text(gp, { class: 'cz-row-name', x: 0, y: sl.y + baseDy }, P.name);
      text(gp, { class: 'cz-val t-end', x: vx, y: sl.y + baseDy }, `${P.share}%`);
    }
    for (const [k, label] of [['nodes', 'Lymphoid organs · 39%'], ['skin', 'Tissues · 19%']]) {
      const hd = slots.place[`head:${k}`];
      const t = text(gp, { class: 't-caps', x: 0, y: hd.y }, label);
      t.dataset.head = k;
      ctx.svg('line', { class: 'cz-bracket', x1: 0, x2: L.W, y1: hd.y + 7, y2: hd.y + 7 }, gp);
    }
    for (const v of ['type', 'weight']) {
      const g = layers[v];
      for (const G of GROUPS) {
        const sl = slots[v][G.id];
        text(g, { class: 'cz-row-name', x: 0, y: sl.y + baseDy }, G.name);
        const val = v === 'type' ? `≈ ${sig2(G.total)} billion` : `≈ ${gramsText(G)} g`;
        text(g, { class: 'cz-val t-end', x: vx, y: sl.y + baseDy }, val);
      }
    }
  }

  // NK cells weigh ~4 g: less than one 10 g square, drawn as a partial square (weight view).
  function drawPartial(parent) {
    const sl = L.slots.weight.nk;
    const g = ctx.svg('g', { class: 'cz-partial', transform: `translate(${sl.x} ${sl.y})` }, parent);
    const f = 0.38;
    ctx.svg('rect', { class: 'cz-partial-in', x: 0, y: L.s * (1 - f), width: L.s, height: L.s * f, rx: 1 }, g);
    ctx.svg('rect', { class: 'cz-partial-out', x: 0.5, y: 0.5, width: L.s - 1, height: L.s - 1, rx: 2 }, g);
    ctx.svg('text', { class: 'cz-partial-note', x: L.s + 6, y: L.s - 2, text: 'less than one square' }, g);
    return g;
  }

  // ---------------------------------------------------------------- build (per layout)
  function build(width) {
    if (tl) { tl.progress(1).kill(); tl = null; }
    L = width < NARROW_MAX ? narrowLayout(width) : wideLayout();
    F.main.replaceChildren();
    svg = ctx.createSVG({ viewBox: viewBoxFor(view), parent: F.main, interactive: false });
    const root = ctx.svg('g', { class: 'cz-root' }, svg);
    const layers = {};
    const labelsG = ctx.svg('g', { class: 'cz-labels' }, root);
    for (const v of ['place', 'type', 'weight']) layers[v] = ctx.svg('g', { class: `cz-l-${v}`, opacity: v === view ? 1 : 0 }, labelsG);
    if (L.mode === 'wide') drawLabelsWide(layers); else drawLabelsNarrow(layers);
    const partial = drawPartial(root);
    gsap.set(partial, { opacity: view === 'weight' ? 1 : 0 });
    grid = unitGrid(root, {
      count: UNITS.length, cols: 10, size: L.s, gap: L.gap, shape: 'square', radius: 2,
      group: (i) => UNITS[i].grp, color: (grp) => FILL[grp], state: 'hidden',
    });
    // Place every unit at its current-view target (hidden units at their next likely spot).
    const t = targets(view);
    const fallback = targets(view === 'weight' ? 'type' : 'weight');
    grid.units.forEach((u, i) => {
      const p = t[i] || fallback[i] || { x: 0, y: 0 };
      gsap.set(u.g, { x: p.x, y: p.y });
      u.x = p.x; u.y = p.y;
      unitOf.set(u.g, i);
    });
    syncPointer(t);
    const shown = (i) => (t[i] ? 'filled' : 'hidden');
    grid.setStates(grid.units.map((u, i) => (revealed || ctx.reducedMotion ? shown(i) : 'hidden')), { duration: 0 });
    // Unit opacity (highlight) is applied without animation after a rebuild.
    el = { root, layers, partial };
    applyHighlight(true);
  }
  let el = {};
  const unitOf = new WeakMap();
  // Squares not shown in the current view must not catch the pointer (they may sit on top).
  function syncPointer(t) { grid.units.forEach((u, i) => u.g.classList.toggle('cz-off', !t[i])); }

  // ---------------------------------------------------------------- view transitions
  function setView(v) {
    if (v === view) return;
    const from = view;
    view = v;
    seg.set(v);
    paintKey();
    syncCaption();
    ctx.announce(`${VIEWS.find((x) => x.value === v).label}. ${ctx.steps[VIEWS.findIndex((x) => x.value === v)]?.text || ''}`);
    hideTip();
    card?.hide();
    if (tl) { tl.progress(1).kill(); tl = null; }
    const now = targets(v);
    const before = targets(from);
    const { layers, partial, root } = el;
    syncPointer(now);

    if (ctx.reducedMotion || !revealed) {
      // Instant re-layout under a short (150 ms) crossfade: no flying squares.
      const apply = () => {
        grid.units.forEach((u, i) => { if (now[i]) { gsap.set(u.g, { x: now[i].x, y: now[i].y }); u.x = now[i].x; u.y = now[i].y; } });
        grid.setStates((u, i) => (now[i] ? 'filled' : 'hidden'), { duration: 0 });
        for (const k of Object.keys(layers)) gsap.set(layers[k], { opacity: k === v ? 1 : 0 });
        gsap.set(partial, { opacity: v === 'weight' ? 1 : 0 });
        svg.setAttribute('viewBox', viewBoxFor(v));
      };
      if (!revealed) { apply(); return; }
      tl = gsap.timeline();
      tl.to(root, { opacity: 0, duration: 0.075, ease: 'none' }).add(apply).to(root, { opacity: 1, duration: 0.075, ease: 'none' });
      return;
    }

    tl = gsap.timeline({ defaults: { ease: 'so.inOut' } });
    // 1. Squares leaving this view fade out where they are.
    grid.setStates((u, i) => (before[i] && !now[i] ? 'hidden' : undefined), { tl, at: 0, duration: 0.3 });
    tl.to(layers[from], { opacity: 0, duration: 0.3 }, 0);
    if (from === 'weight') tl.to(partial, { opacity: 0, duration: 0.3 }, 0);
    // 2. Squares in both views fly to their new place (same object → the reader sees regrouping).
    const movers = [];
    grid.units.forEach((u, i) => { if (before[i] && now[i]) movers.push(i); });
    movers.forEach((i, k) => {
      const u = grid.units[i];
      tl.to(u.g, { x: now[i].x, y: now[i].y, duration: 0.9 }, 0.12 + k * Math.min(0.0024, 0.38 / movers.length));
      u.x = now[i].x; u.y = now[i].y;
    });
    // 3. Squares new to this view appear in place once the movers have arrived.
    grid.units.forEach((u, i) => {
      if (!before[i] && now[i]) { tl.set(u.g, { x: now[i].x, y: now[i].y }, 0); u.x = now[i].x; u.y = now[i].y; }
    });
    grid.setStates((u, i) => (!before[i] && now[i] ? 'filled' : undefined), { tl, at: 0.85, duration: 0.45 });
    tl.to(layers[v], { opacity: 1, duration: 0.45 }, 0.7);
    if (v === 'weight') tl.to(partial, { opacity: 1, duration: 0.45 }, 0.9);
    if (L.mode === 'narrow') tl.to(svg, { attr: { viewBox: viewBoxFor(v) }, duration: 0.8 }, L.heights[v] < L.heights[from] ? 0.35 : 0.05);
    tl.eventCallback('onComplete', () => { tl = null; });
  }

  // ---------------------------------------------------------------- highlight (legend)
  function setHighlight(id) {
    hl = id;
    for (const [gid, b] of legendBtns) b.setAttribute('aria-pressed', String(gid === hl));
    applyHighlight();
    if (id) {
      const G = GBY[id];
      ctx.announce(`${G.name} highlighted: about ${sig2(G.total)} billion cells, about ${gramsText(G)} grams.`);
    }
  }
  function applyHighlight(instant = false) {
    const id = hover || hl;
    if (!grid) return;
    grid.highlight(id, { duration: instant || ctx.reducedMotion ? 0 : 0.3, dim: 0.2 });
    if (el.partial) gsap.to(el.partial.querySelectorAll('rect'), { opacity: !id || id === 'nk' ? 1 : 0.2, duration: instant ? 0 : 0.3 });
    legend.classList.toggle('has-focus', !!id);
    for (const [gid, b] of legendBtns) b.classList.toggle('is-on', gid === id);
  }

  // ---------------------------------------------------------------- tooltips / detail card
  function describe(i) {
    const u = UNITS[i];
    const G = GBY[u.grp];
    const who = G.label || G.name;
    if (view === 'weight') {
      return { title: `${G.name}: ~${gramsText(G)} g`, lines: [], announce: `${G.name}: about ${gramsText(G)} grams` };
    }
    const p = G.placeOf[u.k];
    const P = PLACES[p];
    const v = G.bn[p];
    const lines = view === 'type'
      ? [`All ${LOWER[G.id]}: ${G.id === 'other' ? '≈ 69' : G.total.toFixed(1)} billion`]
      : [`All immune cells ${P.in}: ${PLACE_TOTALS[p].toFixed(1)} billion`];
    return { title: `${who} ${P.in}: ~${sig2(v)} billion`, lines, announce: `${who} ${P.in}: about ${sig2(v)} billion` };
  }
  function tipHTML(d) {
    return `<b>${d.title}</b>${d.lines.map((l) => `<br>${l}`).join('')}<br><span style="color:var(--ink-3);font-size:12px">${CITE}</span>`;
  }
  let tipFor = -1;
  let hot = null;
  const setHot = (i) => {
    const g = i >= 0 ? grid.units[i].g : null;
    if (g === hot) return;
    hot?.classList.remove('is-hot');
    hot = g;
    hot?.classList.add('is-hot');
  };
  function showTip(i, point, touch) {
    const d = describe(i);
    tipFor = i;
    setHot(i);
    if (touch && L.mode === 'narrow') {
      if (!card) {
        card = ctx.ui.infoCard({ placement: 'below', empty: null, closable: true });
        F.main.after(card.el);          // directly under the chart, above the legend
        card.el.style.marginTop = '4px';
      }
      card.show({ kicker: VIEWS.find((x) => x.value === view).label, title: d.title, body: `${d.lines.map((l) => `<p>${l}</p>`).join('')}<p style="color:var(--ink-3);font-size:12px">${CITE}</p>` });
      return;
    }
    ctx.tooltip.show(tipHTML(d), point);
  }
  function hideTip() { tipFor = -1; setHot(-1); ctx.tooltip.hide(); }
  const unitAt = (target) => {
    const g = target?.closest?.('.ug-unit');
    if (!g) return -1;
    const i = unitOf.get(g);
    return i != null && grid.stateOf(i) !== 'hidden' ? i : -1;
  };
  ctx.on(F.main, 'pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    const i = unitAt(e.target);
    if (i < 0) { if (tipFor >= 0) hideTip(); return; }
    showTip(i, { x: e.clientX, y: e.clientY - 6 }, false);
  });
  ctx.on(F.main, 'pointerleave', (e) => { if (e.pointerType === 'mouse') hideTip(); });
  ctx.on(F.main, 'click', (e) => {
    const i = unitAt(e.target);
    if (i < 0) { hideTip(); return; }
    const touch = e.pointerType ? e.pointerType !== 'mouse' : matchMedia('(pointer: coarse)').matches;
    showTip(i, { x: e.clientX, y: e.clientY - 6 }, touch);
    ctx.announce(describe(i).announce);
  });
  ctx.on(window, 'scroll', () => { if (tipFor >= 0) hideTip(); }, { passive: true });

  // ---------------------------------------------------------------- lifecycle
  ctx.onResize(() => {
    const w = F.main.getBoundingClientRect().width || ctx.width;
    const k = w < NARROW_MAX ? `n${Math.round(Math.max(300, Math.min(w, 600)) / 8)}` : 'w';
    if (k === layoutKey && svg) return;
    layoutKey = k;
    build(w);
  });
  ctx.onThemeChange(() => {
    buildLegend();
    const w = F.main.getBoundingClientRect().width || ctx.width;
    build(w);
  });
  // Intro: the squares fill in, row by row, the first time the chart is seen.
  ctx.onceVisible(() => {
    if (revealed) return;
    revealed = true;
    const t = targets(view);
    if (ctx.reducedMotion) { grid.setStates((u, i) => (t[i] ? 'filled' : 'hidden'), { duration: 0 }); return; }
    const order = grid.units.map((u, i) => i).filter((i) => t[i]).sort((a, b) => (t[a].y - t[b].y) || (t[a].x - t[b].x));
    const rank = new Map(order.map((i, r) => [i, r]));
    const intro = gsap.timeline();
    grid.setStates((u, i) => (t[i] ? 'filled' : undefined), { tl: intro, at: 0, duration: 0.35 });
    // Re-time the per-unit tweens into a gentle top-to-bottom wave.
    intro.getChildren(false, true, false).forEach((tw) => {
      const g = tw.targets()[0]?.closest?.('.ug-unit');
      const i = g ? unitOf.get(g) : null;
      if (i != null) tw.startTime(rank.get(i) * 0.004);
    });
  }, 0.3);

  return {
    destroy() { if (tl) tl.kill(); ctx.tooltip.hide(); },
  };
}
