// ch08-side-effects — "When the brakes come off everywhere" (Figure 8.4)
//
// A body map (art `bodyMap`) with 13 organ hotspots. For the chosen drug class each hotspot shows
// a sourced frequency band twice over: ring thickness on the organ AND a text tag on its label
// (rare · uncommon · common · very common = thick + tint). The four hormone glands carry a pill
// badge, "often permanent". Hover (desktop), tap or focus a hotspot for its card (ctx.ui.infoCard:
// beside the stage on wide figures, under it on phones). A switch overlays the brake ("−") that
// healthy tissue relies on; a list view offers the same cards as buttons. Phones merge eyes,
// pituitary and thyroid into one "Head & neck" hotspot with a chooser in the card.
// Real numbers on a light stage with source links (FIGURE-AUDIT §4 rule 19); crimson = brakes.
import { bodyMap, signalIcon, stageFor } from '../art/index.js';
import { C, chartRoot } from './shared/chart.js';

const ID = 'ch08-side-effects';
const cite = (n) => `<sup class="cite"><a href="#src-${n}" aria-label="Source ${n}">${n}</a></sup>`;
const cites = (s) => s.replace(/\s?\[(\d+)\]/g, (_, n) => cite(n));

const DRUGS = [
  { value: 'pd1', label: 'PD-1 or PD-L1 blocker alone', short: 'PD-1 or PD-L1 blocker' },
  { value: 'ctla4', label: 'CTLA-4 blocker alone', short: 'CTLA-4 blocker' },
  { value: 'both', label: 'Both together', short: 'Both together' },
];
const DI = { pd1: 0, ctla4: 1, both: 2 };

// Bands: ring stroke width (thickness carries the band) + text tag. 'UC' = "uncommon–common" (thicker ring).
const BAND = {
  R: { tag: 'rare', w: 1.4, fill: 0, rank: 0 },
  U: { tag: 'uncommon', w: 2.8, fill: 0, rank: 1 },
  UC: { tag: 'uncommon–common', w: 4.8, fill: 0, rank: 2 },
  C: { tag: 'common', w: 4.8, fill: 0, rank: 2 },
  V: { tag: 'very common', w: 4.8, fill: 0.2, rank: 3 },
};

// Hotspots, head to toe. (x, y) ring centre in body units (height 1, head top 0, midline 0);
// r ring radius in body units; side: label column. Card text verbatim from the draft spec.
const ORGANS = [
  { id: 'eye', name: 'Eyes', organ: 'eye', x: 0.031, y: 0.068, r: 0.017, side: 'R', bands: ['R', 'R', 'R'],
    card: 'Inflammation inside the eye (uveitis) is rare, under 1% of patients [32].' },
  { id: 'pituitary', name: 'Pituitary', organ: 'pituitary', x: -0.008, y: 0.081, r: 0.015, side: 'L', gland: true, bands: ['R', 'U', 'C'],
    card: 'Hypophysitis, inflammation of the master hormone gland at the base of the brain, causes headaches and fatigue. It is typical of ipilimumab: about 3% of patients on ipilimumab and 6% on both, but under 1% on PD-1 blockers [33]. Lost hormones, especially cortisol, usually need lifelong replacement [32].' },
  { id: 'thyroid', name: 'Thyroid', organ: 'thyroid', x: 0, y: 0.148, r: 0.022, side: 'L', gland: true, bands: ['C', 'U', 'C'],
    card: 'The most common hormone problem. The thyroid may first become overactive for a few weeks, then underactive, often for good. An underactive thyroid affected about 4% of patients on ipilimumab, 7% on PD-1 blockers and 13% on both [33]. Treated with a daily thyroid-hormone pill, usually for life.' },
  { id: 'lungs', name: 'Lungs', organ: 'lungs', x: -0.048, y: 0.252, r: 0.032, side: 'L', bands: ['U', 'R', 'C'],
    card: 'Pneumonitis, inflammation of the lungs, causes cough and breathlessness. It affects about 1–3% of patients on a PD-1 or PD-L1 blocker, more in lung cancer [32], and 6.6% of melanoma patients on the combination [36]. It was the leading cause of reported deaths linked to PD-1 or PD-L1 blockers, at 35% [32].' },
  { id: 'muscle', name: 'Nerves & muscles', organ: 'muscle', x: -0.118, y: 0.295, r: 0.021, side: 'L', bands: ['R', 'R', 'R'],
    card: 'Serious inflammation of muscles (myositis) or of the nerve–muscle junction (a myasthenia-like weakness) is rare, affecting well under 1% of patients [32][37]. It can occur together with myocarditis.' },
  { id: 'heart', name: 'Heart', organ: 'heart', x: 0.019, y: 0.279, r: 0.024, side: 'R', bands: ['R', 'R', 'R'],
    card: 'Myocarditis, inflammation of the heart muscle, is rare but the most dangerous side effect. Severe cases were reported in about 1 in 1,700 patients on nivolumab and 1 in 370 on the combination, usually within weeks of starting [35]; nearly half of reported cases have been fatal [32].' },
  { id: 'liver', name: 'Liver', organ: 'liver', x: -0.04, y: 0.33, r: 0.026, side: 'L', bands: ['U', 'UC', 'C'],
    card: 'Hepatitis (any severity) usually shows up on routine blood tests before it causes symptoms. It affects about 1–6% of patients on PD-1 or PD-L1 blockers and 17–22% on the combination [32].' },
  { id: 'adrenals', name: 'Adrenal glands', organ: 'adrenals', x: 0.05, y: 0.343, r: 0.015, side: 'R', gland: true, bands: ['R', 'R', 'U'],
    card: 'Damage to the adrenal glands themselves is rare with a single drug (about 1% or less) but affected about 4% of patients on the combination in one large analysis. Cortisol must then be replaced for life [33].' },
  { id: 'pancreas', name: 'Pancreas', organ: 'pancreas', x: 0.004, y: 0.369, r: 0.018, side: 'L', gland: true, bands: ['R', 'R', 'R'],
    card: 'Very rarely, about 0.2% of patients, T cells destroy the insulin-making cells, causing sudden diabetes that needs insulin for life [33].' },
  { id: 'kidneys', name: 'Kidneys', organ: 'kidneys', x: 0.052, y: 0.392, r: 0.017, side: 'R', bands: ['U', 'U', 'U'],
    card: 'Kidney inflammation is uncommon (kidney injury in about 2% of patients overall) and is usually found on blood tests [32].' },
  { id: 'skin', name: 'Skin', organ: 'skin', x: -0.146, y: 0.43, r: 0.021, side: 'L', bands: ['V', 'V', 'V'],
    card: 'The most common target. Rash and itching are frequent, and in melanoma, patches of skin can lose their color as T cells attack pigment cells, healthy and cancerous alike. Usually mild. In CheckMate 067, skin side effects of any severity affected 46% of patients on nivolumab, 56% on ipilimumab and 62% on both [15].' },
  { id: 'gut', name: 'Gut (colon)', organ: 'gut', x: 0, y: 0.455, r: 0.036, side: 'R', bands: ['U', 'C', 'C'],
    card: 'Diarrhea is common (any severity: about 20% of patients on a PD-1 blocker, 35% on ipilimumab, over 40% on both), but diagnosed inflammation of the colon (colitis) affects about 1%, 12% and 14% [32]. Colitis is the hallmark of ipilimumab and caused about 70% of reported deaths linked to CTLA-4 blockers [32]. Treated with corticosteroids and, if needed, other immunosuppressive drugs.' },
  { id: 'joints', name: 'Joints', organ: 'joints', x: 0.054, y: 0.728, r: 0.024, side: 'R', bands: ['U', 'U', 'U'],
    card: 'Joint aches affect about 8% of patients; true arthritis about 1% [32].' },
];
const OB = Object.fromEntries(ORGANS.map((o) => [o.id, o]));
const HEAD = ['eye', 'pituitary', 'thyroid'];
// Phones: eyes, pituitary and thyroid merge into one hotspot.
const HEADNECK = { id: 'headneck', name: 'Head & neck', x: 0.004, y: 0.112, r: 0.058, side: 'L', gland: true, members: HEAD };

const HEADER = [
  { html: 'Any treatment-related side effect in one melanoma trial (CheckMate 067): <span data-d="pd1">nivolumab 86%</span> · <span data-d="ctla4">ipilimumab 86%</span> · <span data-d="both">both 96%</span>. Severe (grade 3–4): <span data-d="pd1">21%</span> · <span data-d="ctla4">28%</span> · <span data-d="both">59%</span>' + cite(15) },
  { html: 'Deaths from side effects, pooled across trials: about <span data-d="pd1">1 in 270 patients on a PD-1 or PD-L1 blocker</span> · <span data-d="ctla4">1 in 90 on a CTLA-4 blocker</span> · <span data-d="both">1 in 80 on both</span>' + cite(32) },
];
const FOOTNOTE = 'Bands count patients diagnosed with inflammation of that organ, of any severity — not symptoms such as tiredness or diarrhea alone. Skin figures come from one melanoma trial; most others are pooled across trials and cancer types, and real rates vary with dose and cancer. Rare: under 1% of patients. Uncommon: 1–5%. Common: 5–20%. Very common: over 20%.';
const WHY = 'Healthy tissues use the same brakes. Many express PD-L1, especially when inflamed — in two patients who died of heart inflammation, the injured heart muscle expressed it [35] — and CTLA-4 keeps T cells that could attack them from being activated. A checkpoint inhibitor releases these brakes everywhere it reaches.';
const SOURCES = `Sources: CheckMate 067 ${cite(15)}; pooled reviews and analyses ${cite(32)}${cite(33)}${cite(36)}; case and safety reports ${cite(35)}${cite(37)}.`;

const LAYOUTS = {
  // The body is cropped below the knees (a soft fade): vb height = top margin + crop × H.
  wide: { W: 720, H: 600, cx: 360, top: 14, crop: 0.84, colL: 238, colR: 482, anchorL: 'end', merge: false, oneLine: true, lineH: 18, pad: 3, hitW: 196 },
  compact: { W: 400, H: 480, cx: 200, top: 12, crop: 0.84, colL: 4, colR: 284, anchorL: 'start', merge: true, oneLine: false, lineH: 16, pad: 8, hitW: 108 },
};

const CSS = `
[data-figure="${ID}"] .se-wrap { position: relative; z-index: 1; display: flex; flex-direction: column; gap: 12px; padding: clamp(14px, 2.4cqi, 24px) clamp(12px, 2.6cqi, 28px) clamp(14px, 2cqi, 20px); container-type: inline-size; }
[data-figure="${ID}"] .se-bar { display: flex; flex-wrap: wrap; gap: 8px 16px; align-items: center; }
[data-figure="${ID}"] .se-head { margin: 0; display: flex; flex-direction: column; gap: 4px; font: 400 13.5px/1.5 var(--font-ui); color: var(--fg-2); max-width: 78ch; }
[data-figure="${ID}"] .se-head p { margin: 0; }
[data-figure="${ID}"] .se-head span[data-d] { transition: color var(--dur-2); }
[data-figure="${ID}"] .se-head span.is-on { color: var(--fg); font-weight: 650; }
[data-figure="${ID}"] .se-map > svg { display: block; width: 100%; height: auto; max-height: 44rem; overflow: visible; }
[data-figure="${ID}"] .se-foot { margin: 0; max-width: 78ch; font: 400 13px/1.5 var(--font-ui); color: var(--fg-2); text-wrap: pretty; }
[data-figure="${ID}"] .se-src { margin: 0; font: 400 12px/1.5 var(--font-ui); color: var(--fg-3); }
[data-figure="${ID}"] .se-src a, [data-figure="${ID}"] .se-head a { color: inherit; }
[data-figure="${ID}"] svg .se-hot { cursor: pointer; outline: none; }
[data-figure="${ID}"] svg .se-hot .se-hit { fill: transparent; }
[data-figure="${ID}"] svg .se-hot:focus-visible .se-focus { stroke: var(--stage-focus); stroke-width: 2; opacity: 1; }
[data-figure="${ID}"] svg .se-focus { fill: none; opacity: 0; vector-effect: non-scaling-stroke; }
[data-figure="${ID}"] svg .se-ring { fill: var(--c-inhibit); stroke: var(--ck-stroke-inhibit); }
[data-figure="${ID}"] svg .se-hot.is-active .se-name { text-decoration: underline; text-decoration-thickness: 1.5px; text-underline-offset: 3px; }
[data-figure="${ID}"] svg .se-hot.is-active .se-ring-hi { opacity: 1; }
[data-figure="${ID}"] svg .se-ring-hi { fill: none; stroke: var(--fg); stroke-width: 1.2; opacity: 0; vector-effect: non-scaling-stroke; }
[data-figure="${ID}"] svg .se-tag { fill: var(--ck-stroke-inhibit); font-weight: 650; }
[data-figure="${ID}"] svg .se-perm { fill: var(--fg-2); }
[data-figure="${ID}"] .se-list { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr)); gap: 6px; }
[data-figure="${ID}"] .se-list[hidden] { display: none; }
[data-figure="${ID}"] .se-li { display: flex; flex-direction: column; align-items: flex-start; gap: 2px; width: 100%; min-height: 44px; padding: 8px 12px; border: 1px solid var(--line); border-radius: 10px; background: none; font: 500 15px/1.3 var(--font-ui); color: var(--fg); text-align: left; cursor: pointer; }
[data-figure="${ID}"] .se-li:hover, [data-figure="${ID}"] .se-li[aria-pressed="true"] { background: color-mix(in srgb, var(--fg) 5%, transparent); }
[data-figure="${ID}"] .se-li small { font-size: 13px; font-weight: 650; color: var(--c-inhibit-deep); }
:root[data-theme="dark"] [data-figure="${ID}"] .se-li small { color: var(--c-inhibit); }
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) [data-figure="${ID}"] .se-li small { color: var(--c-inhibit); } }
[data-figure="${ID}"] .se-li em { font-style: normal; font-size: 12px; color: var(--fg-2); }
[data-figure="${ID}"] .se-cmp { margin: 0; padding: 0; list-style: none; display: grid; gap: 2px; font-family: var(--font-ui); font-size: 13px; }
[data-figure="${ID}"] .se-cmp li { display: flex; justify-content: space-between; gap: 12px; padding: 2px 6px; border-radius: 6px; color: var(--ink-2); }
[data-figure="${ID}"] .se-cmp li.is-on { background: color-mix(in srgb, var(--ink) 6%, transparent); color: var(--ink); font-weight: 600; }
[data-figure="${ID}"] .se-cmp b { font-weight: 650; }
[data-figure="${ID}"] .se-perm-note { display: flex; align-items: center; gap: 6px; font-family: var(--font-ui); font-size: 13px; font-weight: 600; color: var(--ink); }
[data-figure="${ID}"] .se-perm-note svg { width: 16px; height: 16px; }
[data-figure="${ID}"] .se-choose { display: flex; flex-wrap: wrap; gap: 6px; margin: 0 0 4px; }
[data-figure="${ID}"] .se-choose button { min-height: 44px; padding: 4px 12px; border: 1px solid var(--rule-strong); border-radius: 999px; background: var(--surface); font: 560 14px/1.2 var(--font-ui); color: var(--ink); cursor: pointer; }
[data-figure="${ID}"] .se-choose button[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); }
[data-figure="${ID}"] .se-why-cap[hidden] { display: none; }
[data-figure="${ID}"].is-compact .se-bar .segmented { display: grid; width: 100%; }
[data-figure="${ID}"].is-compact .se-bar .segmented__track { display: grid; grid-template-columns: repeat(3, 1fr); border-radius: 14px; }
[data-figure="${ID}"].is-compact .se-bar .segmented__opt { height: auto; min-height: 2.9rem; white-space: normal; justify-content: center; text-align: center; line-height: 1.2; padding: 4px 6px; border-radius: 11px; }
[data-figure="${ID}"].is-compact .se-head { font-size: 12.5px; }
`;
function injectCSS() {
  if (document.getElementById(`${ID}-css`)) return;
  const s = document.createElement('style');
  s.id = `${ID}-css`;
  s.textContent = CSS;
  document.head.append(s);
}

const pillSVG = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10.6 20.4a4.9 4.9 0 0 1-7-7l9.8-9.8a4.9 4.9 0 0 1 7 7z"/><path d="M8.5 8.5l7 7"/></svg>';

/** Band of a hotspot for drug index d (merged hotspots: the highest band; tag shows the range). */
function bandOf(h, d) {
  if (!h.members) return { ...BAND[h.bands[d]] };
  const bs = h.members.map((id) => BAND[OB[id].bands[d]]);
  const lo = bs.reduce((a, b) => (b.rank < a.rank ? b : a));
  const hi = bs.reduce((a, b) => (b.rank > a.rank ? b : a));
  return { ...hi, tag: lo.tag === hi.tag ? hi.tag : `${lo.tag}–${hi.tag}` };
}

export default function mount(fig, ctx) {
  injectCSS();
  const { gsap } = ctx;
  ctx.setAspect('auto');

  // ---------------------------------------------------------------- scaffold
  const wrap = ctx.h('div', { class: 'se-wrap' });
  const bar = ctx.h('div', { class: 'se-bar' });
  const head = ctx.h('div', { class: 'se-head' });
  HEADER.forEach((l) => head.append(ctx.h('p', { html: l.html })));
  const mapBox = ctx.h('div', { class: 'se-map' });
  const list = ctx.h('ul', { class: 'se-list', hidden: true, 'aria-label': 'Organs, head to toe' });
  const foot = ctx.h('p', { class: 'se-foot' }, FOOTNOTE);
  const src = ctx.h('p', { class: 'se-src', html: SOURCES });
  wrap.append(bar, head, mapBox, list, foot, src);
  ctx.stage.append(wrap);

  let drug = 'pd1';
  let L = LAYOUTS.wide;
  let compact = null;
  let active = null;          // hotspot id shown in the card
  let headPick = 'thyroid';   // phones: which head & neck organ the card shows
  let why = false;
  const E = {};

  ctx.ui.segmented({
    label: 'Drug', value: drug, parent: bar,
    options: DRUGS.map((d) => ({ value: d.value, label: d.label })),
    onChange: (v) => { drug = v; paintBands(); refreshCard(); paintHead(); ctx.announce(`${DRUGS[DI[v]].label}.`); },
  });

  const card = ctx.ui.infoCard({ empty: 'Hover over, tap or tab to an organ to see what can happen there.', width: '19rem' });

  // ---------------------------------------------------------------- body map
  function hotspots() {
    return L.merge ? [HEADNECK, ...ORGANS.filter((o) => !HEAD.includes(o.id))] : ORGANS;
  }

  function draw() {
    mapBox.replaceChildren();
    const W = L.W, Hh = Math.round(L.top + L.crop * L.H + 6);
    L.cy = L.top + L.H / 2;
    const svg = ctx.createSVG({ viewBox: `0 0 ${W} ${Hh}`, parent: mapBox, interactive: true, label: 'Body map of organs that checkpoint inhibitors can inflame. Tab to an organ for details.' });
    svg.style.position = 'static';
    const g = chartRoot(svg, { theme: 'light' });
    const H = L.H;
    const P = (ux, uy) => ({ x: L.cx + ux * H, y: L.cy + uy * H - H / 2 });
    const body = bodyMap({ height: H, stage: stageFor(fig), organs: ['eye', 'pituitary', 'thyroid', 'lungs', 'heart', 'liver', 'adrenals', 'pancreas', 'kidneys', 'gut', 'skin', 'joints', 'muscle'] });
    body.setAttribute('transform', `translate(${L.cx} ${L.cy})`);
    body.setAttribute('aria-hidden', 'true');
    // fade the legs out below the knees
    const mid = `se-fade-${(ctx.number || '0').replace(/\W/g, '')}`;
    svg.defs.replaceChildren();
    const lg = ctx.svg('linearGradient', { id: `${mid}-g`, x1: 0, y1: 0, x2: 0, y2: 1, gradientUnits: 'objectBoundingBox' }, svg.defs);
    const f0 = (L.top + (L.crop - 0.1) * L.H) / Hh, f1 = (L.top + (L.crop - 0.01) * L.H) / Hh;
    ctx.svg('stop', { offset: f0, 'stop-color': '#fff', 'stop-opacity': 1 }, lg);
    ctx.svg('stop', { offset: f1, 'stop-color': '#fff', 'stop-opacity': 0 }, lg);
    const mk = ctx.svg('mask', { id: mid, maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: W, height: Hh }, svg.defs);
    ctx.svg('rect', { x: 0, y: 0, width: W, height: Hh, fill: `url(#${mid}-g)` }, mk);
    const bodyWrap = ctx.svg('g', { mask: `url(#${mid})` }, g);
    bodyWrap.append(body);

    const ringLayer = ctx.svg('g', { class: 'se-rings' }, g);
    const leaderLayer = ctx.svg('g', { class: 'se-leaders' }, g);
    const hotLayer = ctx.svg('g', { class: 'se-hots' }, g);
    const whyLayer = ctx.svg('g', { class: 'se-why', opacity: why ? 1 : 0 }, g);
    E.whyLayer = whyLayer;
    E.hots = {};

    // Label layout: two columns. Each label sits at its ring's height when it can (horizontal
    // leaders thread between neighbouring rings), and is pushed apart only where labels collide.
    const nameOf = (h) => (compact && h.id === 'muscle' ? ['Nerves &', 'muscles'] : [compact && h.id === 'adrenals' ? 'Adrenals' : compact && h.id === 'gut' ? 'Gut' : h.name]);
    const hs = hotspots().map((h) => {
      const c = P(h.x, h.y);
      const names = nameOf(h);
      const lines = (L.oneLine ? 1 : names.length + 1) + (h.gland ? 1 : 0);
      return { h, c, r: h.r * H, names, lines, hgt: lines * L.lineH + L.pad };
    });
    // Place each column with a small DP: labels keep their order and never overlap; each prefers
    // its ring's height; leaders must not pass through another ring or cross a neighbour's leader.
    const u = 1 / (ctx.pxPerUnit(svg) || 1);
    const fsL = Math.max(15, 13 * u), fsS = Math.max(13, 12 * u);
    const textW = (str, size) => str.length * size * 0.56;
    const leaderStart = (q) => {
      const left = q.h.side === 'L';
      if (left && L.anchorL === 'end') return L.colL + 6;
      if (left) return L.colL + textW(q.names[0], fsL) + 6;
      return L.colR - 6;
    };
    // approximate text box of a label block at baseline ly
    const boxOf = (q, ly) => {
      const w = Math.max(...q.names.map((n) => textW(n, fsL)), textW('uncommon–common', fsS), q.h.gland ? textW('often permanent', fsS) + 16 : 0);
      const x0 = q.h.side === 'L' ? (L.anchorL === 'end' ? L.colL - w : L.colL) : L.colR;
      return { x0, x1: x0 + w, y0: ly - L.lineH + 3, y1: ly - L.lineH + q.hgt };
    };
    const segHitsBox = (s, b) => {
      const [[x1, y1], [x2, y2]] = s;
      for (let k = 0; k <= 40; k++) {
        const t = k / 40, x = x1 + (x2 - x1) * t, y = y1 + (y2 - y1) * t;
        if (x > b.x0 - 5 && x < b.x1 + 5 && y > b.y0 - 4 && y < b.y1 + 3) return true;
      }
      return false;
    };
    const segHitsRing = (x1, y1, x2, y2, o, pad) => {
      const dx = x2 - x1, dy = y2 - y1, l2 = dx * dx + dy * dy || 1;
      const t = Math.max(0, Math.min(1, ((o.c.x - x1) * dx + (o.c.y - y1) * dy) / l2));
      return Math.hypot(x1 + t * dx - o.c.x, y1 + t * dy - o.c.y) < o.r + pad;
    };
    const cross = (a, b) => {
      const d = (p, q, r) => (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]);
      return d(a[0], a[1], b[0]) * d(a[0], a[1], b[1]) < 0 && d(b[0], b[1], a[0]) * d(b[0], b[1], a[1]) < 0;
    };
    const leaderOf = (q, ly) => {
      const sx = leaderStart(q), sy = ly - 5;
      const ang = Math.atan2(sy - q.c.y, sx - q.c.x);
      return [[sx, sy], [q.c.x + Math.cos(ang) * (q.r + 2), q.c.y + Math.sin(ang) * (q.r + 2)]];
    };
    for (const side of ['L', 'R']) {
      const col = hs.filter((q) => q.h.side === side).sort((a, b) => a.c.y - b.c.y);
      const cand = col.map((q) => {
        const out = [];
        const lo = Math.max(L.lineH, q.c.y + 5 - 90), hi = Math.min(Hh - (q.hgt - L.lineH) - 2, q.c.y + 5 + 110);
        for (let y = lo; y <= hi; y += 2) {
          const [s0, s1] = leaderOf(q, y);
          let cost = Math.abs(y - (q.c.y + 5)) + Math.abs(s0[1] - s1[1]) * 0.25;
          for (const o of hs) if (o !== q && segHitsRing(s0[0], s0[1], s1[0], s1[1], o, 6)) cost += 400;
          out.push({ y, cost, seg: [s0, s1] });
        }
        return out;
      });
      // DP over the ordered column
      let prev = cand[0].map((c) => ({ cost: c.cost, from: -1 }));
      const back = [prev];
      for (let i = 1; i < col.length; i++) {
        const cur = cand[i].map((c) => {
          let best = { cost: Infinity, from: -1 };
          cand[i - 1].forEach((p, j) => {
            if (prev[j].cost === Infinity || c.y < p.y + col[i - 1].hgt) return;
            const hitBox = segHitsBox(c.seg, boxOf(col[i - 1], p.y)) || segHitsBox(p.seg, boxOf(col[i], c.y));
            const tot = prev[j].cost + c.cost + (cross(p.seg, c.seg) ? 300 : 0) + (hitBox ? 300 : 0);
            if (tot < best.cost) best = { cost: tot, from: j };
          });
          return best;
        });
        back.push(cur);
        prev = cur;
      }
      let k = prev.reduce((bi, v, i) => (v.cost < prev[bi].cost ? i : bi), 0);
      for (let i = col.length - 1; i >= 0; i--) {
        col[i].ly = cand[i][k] ? cand[i][k].y : col[i].c.y + 5;
        k = back[i][k] ? back[i][k].from : -1;
      }
    }

    for (const q of hs) {
      const { h, c, r, names } = q;
      const left = h.side === 'L';
      const anchor = left ? L.anchorL : 'start';
      const tx = left ? L.colL : L.colR;
      // ring (thickness = band) + highlight ring for the active hotspot
      const ring = ctx.svg('circle', { class: 'se-ring', cx: c.x, cy: c.y, r, 'fill-opacity': 0, 'stroke-width': 1.4 }, ringLayer);
      const hi = ctx.svg('circle', { class: 'se-ring-hi', cx: c.x, cy: c.y, r: r + 5 }, ringLayer);
      // why: a brake disc on every hotspot
      const wd = signalIcon({ type: 'inhibitory', size: compact ? 15 : 16, stage: stageFor(fig), x: c.x + r * 0.74, y: c.y - r * 0.74 });
      whyLayer.append(wd);

      // label block: name + band tag (one line on wide stages), then the gland badge
      const grp = ctx.svg('g', { class: 'se-hot', tabindex: 0, role: 'button', 'data-id': h.id }, hotLayer);
      const txt = ctx.svg('text', { class: `t-label${anchor === 'end' ? ' t-end' : ''}`, x: tx, y: q.ly }, grp);
      names.forEach((ln, i) => ctx.svg('tspan', { class: 'se-name', x: tx, dy: i ? `${L.lineH}` : 0, text: ln }, txt));
      const tag = L.oneLine
        ? ctx.svg('tspan', { class: 'se-tag t-small', dx: 7, text: '' }, txt)
        : ctx.svg('tspan', { class: 'se-tag t-small', x: tx, dy: `${L.lineH}`, text: '' }, txt);
      if (h.gland) {
        const permY = q.ly + L.lineH * (q.lines - 1) - (L.oneLine ? 1 : 2);
        const pw = 106;
        const px = anchor === 'end' ? tx - pw : tx;
        const permG = ctx.svg('g', {}, grp);
        const ic = ctx.iconSVG('pill', { x: px + 6, y: permY - 4, size: 13, color: 'currentColor' }, permG);
        ic.style.color = 'var(--fg-2)';
        const pt = ctx.svg('text', { class: 't-small se-perm', x: px + 15, y: permY, text: 'often permanent' }, permG);
        if (!left) {
          // phones: the right column's badge can run past the stage edge (Adrenals); pull it in
          const fit = () => {
            let w = 0;
            try { w = pt.getComputedTextLength(); } catch { /* not rendered */ }
            const over = px + 15 + w - (L.W - 3);
            permG.setAttribute('transform', `translate(${over > 0 ? -Math.ceil(over) : 0} 0)`);
          };
          fit();
          requestAnimationFrame(fit);
        }
      }
      // hit target: the whole label block plus the ring (≥ 44 px on phones)
      const top = q.ly - L.lineH + 1;
      const bh = Math.max(q.hgt, compact ? 48 : 22);
      const hx = anchor === 'end' ? tx - L.hitW : tx - 4;
      ctx.svg('rect', { class: 'se-hit', x: hx, y: top - (bh - q.hgt) / 2, width: L.hitW + 8, height: bh, rx: 6 }, grp);
      ctx.svg('rect', { class: 'se-focus', x: hx, y: top - 2, width: L.hitW + 8, height: q.hgt, rx: 6 }, grp);
      ctx.svg('circle', { class: 'se-hit', cx: c.x, cy: c.y, r: Math.max(r + 6, 14) }, grp);

      // leader from the label's near end to the ring edge
      const lyy = q.ly - 5;
      let sx;
      if (anchor === 'end') sx = tx + 6;
      else if (left) {
        let w = 0;
        try { w = txt.firstChild.getComputedTextLength(); } catch { /* not rendered yet */ }
        sx = tx + (w || measure(names[0])) + 6;
      } else sx = tx - 6;
      const a = Math.atan2(lyy - c.y, sx - c.x);
      const ex = c.x + Math.cos(a) * (r + 2), ey = c.y + Math.sin(a) * (r + 2);
      ctx.svg('line', { class: 'leader', x1: sx, y1: lyy, x2: ex, y2: ey }, leaderLayer);
      ctx.svg('circle', { class: 'leader-dot', cx: ex, cy: ey, r: 2 }, leaderLayer);

      const open = (via) => show(h.id, via);
      ctx.on(grp, 'pointerenter', (e) => { if (e.pointerType === 'mouse') open('hover'); });
      ctx.on(grp, 'click', () => open('tap'));
      ctx.on(grp, 'focus', () => open('focus'));
      ctx.on(grp, 'keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open('key'); } });
      E.hots[h.id] = { h, ring, hi, grp, tag };
    }
    paintBands(true);
    paintActive();
  }
  // rough text width for leader starts (labels are short; 15 px Inter ≈ 7.6 px per char)
  const measure = (s) => s.length * 7.4;

  function paintBands(instant = false) {
    const d = DI[drug];
    for (const { h, ring, grp, tag } of Object.values(E.hots || {})) {
      const b = bandOf(h, d);
      tag.textContent = b.tag;
      const vars = { attr: { 'stroke-width': b.w, 'fill-opacity': b.fill } };
      if (instant || ctx.reducedMotion) gsap.set(ring, vars);
      else gsap.to(ring, { ...vars, duration: 0.4, ease: 'so.inOut', overwrite: true });
      const name = h.members ? 'Head and neck (eyes, pituitary, thyroid)' : h.name;
      grp.setAttribute('aria-label', `${name}: ${b.tag} with ${DRUGS[d].short.toLowerCase()}${h.gland ? '. Hormone damage often permanent' : ''}. Show details.`);
    }
    paintList();
  }

  function paintHead() {
    head.querySelectorAll('span[data-d]').forEach((s) => s.classList.toggle('is-on', s.dataset.d === drug));
  }

  // ---------------------------------------------------------------- list view
  const listBtns = {};
  for (const o of ORGANS) {
    const b = ctx.h('button', { type: 'button', class: 'se-li', 'aria-pressed': 'false' });
    b.addEventListener('click', () => show(o.id, 'tap'), { signal: ctx.signal });
    const li = ctx.h('li');
    li.append(b);
    list.append(li);
    listBtns[o.id] = b;
  }
  function paintList() {
    const d = DI[drug];
    for (const o of ORGANS) {
      const b = BAND[o.bands[d]];
      listBtns[o.id].innerHTML = `<span>${o.name}</span><small>${b.tag}</small>${o.gland ? '<em>often permanent</em>' : ''}`;
      listBtns[o.id].setAttribute('aria-pressed', String(active === o.id || (active === 'headneck' && headPick === o.id)));
    }
  }

  // ---------------------------------------------------------------- cards
  function organBody(o) {
    const rows = DRUGS.map((dd, i) => `<li class="${dd.value === drug ? 'is-on' : ''}"><span>${dd.label}</span><b>${BAND[o.bands[i]].tag}</b></li>`).join('');
    const perm = o.gland ? `<p class="se-perm-note">${pillSVG}<span>Often permanent</span></p>` : '';
    return `<ul class="se-cmp" aria-label="How often, by drug">${rows}</ul>${perm}<p>${cites(o.card)}</p>`;
  }
  function show(id, via) {
    if (id === 'headneck' && active !== 'headneck') headPick = headPick || 'thyroid';
    if (via === 'hover' && active === id) return;
    active = id;
    paintActive();
    refreshCard(via === 'tap' && compact);
  }
  function refreshCard(scroll = false) {
    if (!active) return;
    const d = DI[drug];
    if (active === 'headneck') {
      const o = OB[headPick];
      const chooser = ctx.h('div', { class: 'se-choose', role: 'group', 'aria-label': 'Head and neck organs' });
      for (const id of HEAD) {
        const b = ctx.h('button', { type: 'button', 'aria-pressed': String(id === headPick) }, OB[id].name);
        b.addEventListener('click', () => { headPick = id; refreshCard(); paintList(); }, { signal: ctx.signal });
        chooser.append(b);
      }
      const body = ctx.h('div');
      body.append(chooser);
      body.insertAdjacentHTML('beforeend', organBody(o));
      card.show({ kicker: `${DRUGS[d].short}: ${BAND[o.bands[d]].tag}`, title: `Head & neck · ${o.name}`, body, scroll });
    } else {
      const o = OB[active];
      card.show({ kicker: `${DRUGS[d].short}: ${BAND[o.bands[d]].tag}`, title: o.name, body: organBody(o), scroll });
    }
    paintList();
  }
  function paintActive() {
    for (const [id, e] of Object.entries(E.hots || {})) e.grp.classList.toggle('is-active', id === active);
  }

  // ---------------------------------------------------------------- "why?" switch + list view
  const whyCap = ctx.h('p', { class: 'se-why-cap', hidden: true, 'aria-live': 'polite', html: cites(WHY) });
  ctx.caption.append(whyCap);
  ctx.ui.toggle({
    label: 'Show the brakes in healthy tissue', checked: false,
    onChange: (on) => {
      why = on;
      whyCap.hidden = !on;
      if (E.whyLayer) gsap.to(E.whyLayer, { opacity: on ? 1 : 0, duration: ctx.reducedMotion ? 0 : 0.4, overwrite: true });
    },
  });
  ctx.ui.toggle({
    label: 'List view', checked: false,
    onChange: (on) => { list.hidden = !on; mapBox.hidden = on; },
  });

  // ---------------------------------------------------------------- lifecycle
  ctx.onResize(({ compact: c }) => {
    if (c === compact) return;
    compact = c;
    L = c ? LAYOUTS.compact : LAYOUTS.wide;
    if (active && c && HEAD.includes(active)) { headPick = active; active = 'headneck'; }
    if (active === 'headneck' && !c) active = headPick;
    draw();
    ctx.refreshTextScale();
  });
  ctx.onThemeChange(() => { draw(); ctx.refreshTextScale(); });
  if (compact == null) { compact = ctx.compact; L = compact ? LAYOUTS.compact : LAYOUTS.wide; draw(); }
  paintHead();

  return {};
}
