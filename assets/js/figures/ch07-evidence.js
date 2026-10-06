// ch07-evidence — "Which cancers rise when immunity falls"
// Real data (Engels et al., JAMA 2011, Table 2): standardized incidence ratios
// of selected cancers in ~176,000 US organ-transplant recipients, on a log
// scale. A three-step reveal (overall → uneven spread → grouped by cause),
// then free exploration: tap/hover/keyboard rows for a detail card with the
// 95% range, the cause and notes. Built on shared/chart.js.
import { C, fmt, scale, chartRoot, axis, threshold, marker, markerPath, whisker, rows, chartFrame, legendHTML, tweenTo } from './shared/chart.js';

const SRC_ENGELS = 'Engels 2011 (<em>JAMA</em>), Table 2';
const SRC_JIN = 'Jin 2024 (<em>Lancet Oncol</em>)';

// group: all | infection | artifact | none. Verbatim from the draft's data block.
const DATA = [
  { id: 'all', label: 'All cancers', v: 2.10, lo: 2.06, hi: 2.14, group: 'all', cause: null,
    note: 'About twice the expected number of cancers: roughly 7 extra cancers per 1,000 recipients per year.' },
  { id: 'kaposi', label: 'Kaposi sarcoma', v: 61.46, lo: 50.95, hi: 73.49, group: 'infection', cause: 'Human herpesvirus 8',
    note: 'Still rare: about 15 cases per 100,000 recipients per year. In people living with HIV it is several hundred times more common, partly because the virus is more widespread in the groups most affected by HIV (Jin 2024).' },
  { id: 'vulva', label: 'Vulva', v: 7.60, lo: 5.77, hi: 9.83, group: 'infection', cause: 'Human papillomavirus (HPV)', note: null },
  { id: 'nhl', label: 'Non-Hodgkin lymphoma', v: 7.54, lo: 7.17, hi: 7.93, group: 'infection', cause: 'Epstein–Barr virus (many cases)',
    note: 'The most common cancer with a raised rate. Highest in lung-transplant recipients (about 19×), who typically receive the strongest immunosuppression.' },
  { id: 'anus', label: 'Anus', v: 5.84, lo: 4.70, hi: 7.18, group: 'infection', cause: 'Human papillomavirus (HPV)', note: null },
  { id: 'cervix', label: 'Cervix', v: 1.03, lo: 0.75, hi: 1.38, group: 'infection', cause: 'Human papillomavirus (HPV)',
    note: 'Not raised in this study, possibly because recipients are regularly screened and precancers treated early. A 2024 meta-analysis of 67 transplant studies did find a raised rate (Jin 2024).' },
  { id: 'liver', label: 'Liver', v: 11.56, lo: 10.83, hi: 12.33, group: 'artifact', cause: 'Hepatitis B and C viruses (many cases)',
    note: 'Mostly cancers already present in the diseased liver that was removed at transplant, recorded in the first months afterwards. Not raised in kidney or heart recipients; after the first 6 months, liver recipients’ rate was about 2×.' },
  { id: 'lip', label: 'Lip', v: 16.78, lo: 14.02, hi: 19.92, group: 'none', cause: 'No established infectious cause (sun-exposed skin)',
    note: 'Behaves much like sun-induced skin cancer; some transplant drugs (azathioprine, cyclosporine) are themselves known causes of skin squamous-cell carcinoma (Jin 2024).' },
  { id: 'kidney', label: 'Kidney', v: 4.65, lo: 4.32, hi: 4.99, group: 'none', cause: 'No established infectious cause',
    note: 'Highest in kidney-transplant recipients (about 6.7×). Closer medical checks may explain part of the rise.' },
  { id: 'melanoma', label: 'Melanoma', v: 2.38, lo: 2.14, hi: 2.63, group: 'none', cause: 'No established infectious cause (mostly sunlight)',
    note: 'Not raised in people living with HIV (Jin 2024). Closer skin checks and the drugs may explain part of the rise.' },
  { id: 'lung', label: 'Lung', v: 1.97, lo: 1.86, hi: 2.08, group: 'none', cause: 'No established infectious cause',
    note: 'Highest in lung-transplant recipients (about 6×).' },
  { id: 'colorectum', label: 'Colorectum', v: 1.24, lo: 1.15, hi: 1.34, group: 'none', cause: 'No established infectious cause',
    note: 'Raised in transplant recipients but not in people living with HIV, which points to the drugs rather than weakened immunity (Jin 2024).' },
  { id: 'prostate', label: 'Prostate', v: 0.92, lo: 0.87, hi: 0.98, group: 'none', cause: 'No established infectious cause',
    note: 'Slightly below 1×, partly because people are screened for cancer before a transplant. Not raised in people living with HIV either (Jin 2024).' },
  { id: 'breast', label: 'Breast', v: 0.85, lo: 0.77, hi: 0.93, group: 'none', cause: 'No established infectious cause',
    note: 'Slightly below 1×, partly because people are screened for cancer before a transplant. Not raised in people living with HIV either (Jin 2024).' },
];
const SOURCE = 'Data: Engels et al., JAMA 2011 — 175,732 US organ transplants, 1987–2008. Selected cancers: 32 types were significantly raised, including some with no known infectious cause (for example salivary-gland and bile-duct cancers, and some leukemias). Common skin squamous-cell carcinomas are not recorded by US cancer registries; other studies find them tens of times more common in transplant recipients.';
const HEADERS = { infection: 'Linked to a known infection', none: 'No established infectious cause' };
const LEGEND_DAGGER = '† mostly cancers found in the removed liver — tap for details';

const byValue = (a, b) => b.v - a.v;
const OTHERS = DATA.filter((d) => d.id !== 'all');
const ORDER_VALUE = ['all', ...[...OTHERS].sort(byValue).map((d) => d.id)];
const INFECTION = [...OTHERS.filter((d) => d.group === 'infection').sort(byValue), DATA.find((d) => d.id === 'liver')].map((d) => d.id);
const NONE = OTHERS.filter((d) => d.group === 'none').sort(byValue).map((d) => d.id);
const SPOT = ['breast', 'prostate'];
const PULSE = [1, 2, 5, 10];

const LAYOUTS = {
  wide: { w: 760, labelW: 190, px0: 206, px1: 712, top: 50, rowH: 30, headerH: 30, ruleGap: 10, groupGap: 8, wrap: 0,
    tickLabels: null, values: true },
  compact: { w: 360, labelW: 106, px0: 116, px1: 344, top: 50, rowH: 36, headerH: 28, ruleGap: 10, groupGap: 8, wrap: 12,
    tickLabels: [0.5, 1, 10, 100], values: false },
};

const CSS = `
[data-figure="ch07-evidence"] .ev-key { display: grid; grid-template-rows: 1fr; }
[data-figure="ch07-evidence"] .ev-phone { flex: 1 1 100%; display: flex; flex-direction: column; gap: 14px; min-width: 0;
  --fg: var(--ink); --fg-2: var(--ink-2); --fg-3: var(--ink-3); --line: var(--rule-strong); --grid: var(--chart-grid); --halo: var(--surface); --stage-focus: var(--accent); }
[data-figure="ch07-evidence"] .ev-key__in { min-height: 0; overflow: hidden; display: flex; flex-direction: column; gap: 14px; }
[data-figure="ch07-evidence"] .ev-sort.is-off { visibility: hidden; }
[data-figure="ch07-evidence"] svg .ev-val { font-variant-numeric: tabular-nums; }
[data-figure="ch07-evidence"] svg .ev-val.is-dagger { font-style: italic; }
[data-figure="ch07-evidence"] svg .ev-q { font-weight: 600; fill: var(--fg-3); }
[data-figure="ch07-evidence"] svg .ev-head { font-weight: 650; }
`;
function injectCSS() {
  if (document.getElementById('ch07-evidence-css')) return;
  const s = document.createElement('style');
  s.id = 'ch07-evidence-css';
  s.textContent = CSS;
  document.head.append(s);
}

const causeMarker = (d) => {
  if (d.group === 'all') return { shape: 'square', color: C.ink, fill: true };
  if (d.group === 'infection') return { shape: 'circle', color: C.s1, fill: true };
  if (d.group === 'artifact') return { shape: 'circle', color: C.s1, fill: false, dash: '2.4 1.9', width: 1.6 };
  return { shape: 'diamond', color: C.ink2, fill: false, width: 1.5 };
};

export default function mount(fig, ctx) {
  injectCSS();
  const { gsap } = ctx;
  const F = chartFrame(ctx, {
    source: SOURCE,
    cardHint: 'Hover over or tap any row to see its likely range, its cause and notes.',
  });

  let L = LAYOUTS.wide;
  let sortMode = 'cause';
  let svg = null;
  let el = {};          // everything the steps animate (rebuilt on re-layout)
  let stepper = null;
  let step = -1;

  // ---------------------------------------------------------------- layout maths
  function causeLayout() {
    const pos = { all: L.top };
    let y = L.top + L.rowH + L.ruleGap;
    const heads = {};
    heads.infection = y; y += L.headerH;
    for (const id of INFECTION) { pos[id] = y; y += L.rowH; }
    y += L.groupGap;
    heads.none = y; y += L.headerH;
    for (const id of NONE) { pos[id] = y; y += L.rowH; }
    return { pos, heads, bottom: y };
  }
  function valueLayout() {
    const { bottom } = causeLayout();
    const start = L.top + L.rowH + L.ruleGap;
    const sp = (bottom - start) / OTHERS.length;
    const pos = { all: L.top };
    ORDER_VALUE.slice(1).forEach((id, k) => { pos[id] = start + k * sp + (sp - L.rowH) / 2; });
    return { pos, bottom };
  }

  // ---------------------------------------------------------------- draw
  function draw() {
    const prevSel = el.R?.selected ?? null;
    F.main.replaceChildren();
    const { bottom } = causeLayout();
    const axisY = bottom + 8;
    const H = axisY + (L.values ? 78 : 112);
    svg = ctx.createSVG({
      viewBox: `0 0 ${L.w} ${H}`, parent: F.main, interactive: true,
      label: 'Dot chart: how many times more common each cancer was in transplant recipients than in the general population. Tab to the rows, use the arrow keys to move and Enter for details.',
    });
    const g = chartRoot(svg);
    const x = scale({ type: 'log', domain: [0.5, 100], range: [L.px0, L.px1] });
    const ticks = x.ticks([1, 2, 5]);
    const label = (v) => (v === 0.5 ? '½×' : `${v}×`);
    const gridTop = L.top - 6;

    // Axes: tick labels on top (near the first rows) and at the bottom with title and note.
    const ax = axis(g, { scale: x, orient: 'bottom', at: axisY, ticks, format: label, labels: L.tickLabels || true, grid: [gridTop, axisY], tickSize: 4,
      title: L.values ? 'Times as common as in the general population' : ['Times as common as in', 'the general population'],
      note: L.values ? 'Each gridline to the right is a bigger multiple.' : ['Each gridline to the right', 'is a bigger multiple.'] });
    const axTop = axis(g, { scale: x, orient: 'top', at: gridTop, ticks, format: label, labels: L.tickLabels || true, line: false, tickSize: 0, labelOffset: 8 });
    const ref = threshold(g, { x: x(1), y0: gridTop, y1: axisY, strong: true, color: C.axis });
    // "no change" sits just above the top "1×" label.
    const noChange = ctx.svg('text', { class: 't-small t-mid t-muted', x: x(1), y: gridTop - 26, text: 'no change' }, g);

    // Pulse overlays for step 1 (1× → 2× → 5× → 10×).
    const pulseG = ctx.svg('g', { class: 'ev-pulse', 'aria-hidden': 'true' }, g);
    const pulses = PULSE.map((v) => ctx.svg('line', { x1: x(v), x2: x(v), y1: gridTop, y2: axisY, style: `stroke:${C.accent};stroke-width:2;opacity:0`, 'stroke-linecap': 'round' }, pulseG));
    const pulseLabels = PULSE.map((v) => axTop.ticks.find((t) => t.value === v)?.label).filter(Boolean);

    // Rule under "All cancers".
    const ruleY = L.top + L.rowH + L.ruleGap / 2;
    ctx.svg('line', { class: 'ck-axis', x1: 0, x2: L.px1, y1: ruleY, y2: ruleY, style: 'opacity:0.5' }, g);

    // Group headers (step 3), each with its legend key.
    const cl = causeLayout();
    const headG = ctx.svg('g', { class: 'ev-heads' }, g);
    const heads = Object.entries(HEADERS).map(([key, text]) => {
      const hg = ctx.svg('g', { transform: `translate(0 ${cl.heads[key] + L.headerH / 2 + 2})` }, headG);
      const mk = causeMarker({ group: key });
      ctx.svg('path', { d: markerPath(mk.shape, 4.5), transform: 'translate(6 -4)', style: mk.fill ? `fill:${mk.color}` : `fill:none;stroke:${mk.color};stroke-width:1.5` }, hg);
      ctx.svg('text', { class: 't-caps t-halo ev-head', x: 18, y: 0, text }, hg);
      return hg;
    });

    // Rows.
    const R = rows(g, {
      items: ORDER_VALUE.map((id) => DATA.find((d) => d.id === id)),
      x0: 0, x1: L.w, top: L.top, rowH: L.rowH, labelW: L.labelW, wrap: L.wrap,
      label: (d) => (d.id === 'liver' && !L.values ? 'Liver †' : d.label),
      labelClass: (d) => (d.id === 'all' ? 'is-strong' : ''),
      ariaLabel: (d) => `${d.label}: about ${fmt.times(d.v).replace('×', ' times')} as common`,
      name: 'Cancers',
      selectable: (d) => step >= 1 || d.id === 'all',
      onSelect: (d) => showDetails(d),
    });

    const recs = {};
    for (const r of R.rows) {
      const d = r.item;
      const rec = { d, row: r };
      const c = r.content;
      rec.spot = SPOT.includes(d.id)
        ? ctx.svg('rect', { x: 0, y: -L.rowH / 2 + 2, width: L.px1 + (L.values ? 34 : 8), height: L.rowH - 4, rx: 4, style: `fill:${C.accent};fill-opacity:0.08;opacity:0` }, c)
        : null;
      rec.whisker = ctx.svg('g', { class: 'ev-whisker' }, c);
      if (d.id !== 'all') {
        rec.q = ctx.svg('text', { class: 't-small t-mid t-halo ev-q', x: x(1), y: 0, dy: '0.35em', text: '?' }, c);
        rec.neutral = marker(c, { x: x(1), r: 5, color: C.ink2 });
      }
      const mk = causeMarker(d);
      rec.cause = marker(c, { ...mk, x: x(d.v), r: d.group === 'all' ? 5.5 : 5 });
      if (L.values) {
        const vx = x(d.v) + 10;
        rec.vx = vx;
        rec.val = ctx.svg('text', { class: 't-small t-halo ev-val', x: vx, y: 0, dy: '0.35em', text: fmt.times(d.v) }, c);
        if (d.id === 'liver') rec.val2 = ctx.svg('text', { class: 't-small t-halo ev-val is-dagger', x: vx, y: 0, dy: '0.35em', text: `${fmt.times(d.v)}†` }, c);
      }
      recs[d.id] = rec;
    }
    el = { svg, g, x, R, recs, heads, pulses, pulseLabels, ax, axTop, ref, noChange };
    if (prevSel) R.select(prevSel, { silent: true });
    if (prevSel) drawWhisker(prevSel);
  }

  // ---------------------------------------------------------------- selection
  function drawWhisker(id) {
    for (const rec of Object.values(el.recs)) {
      rec.whisker.replaceChildren();
      if (rec.val) rec.val.setAttribute('x', rec.vx);
      if (rec.val2) rec.val2.setAttribute('x', rec.vx);
    }
    if (!id) return;
    const rec = el.recs[id];
    const { d } = rec;
    whisker(rec.whisker, { x0: el.x(d.lo), x1: el.x(d.hi), y: 0, cap: 9, color: C.ink2, width: 1.5 });
    const vx = Math.max(rec.vx, el.x(d.hi) + 9);
    if (rec.val) rec.val.setAttribute('x', vx);
    if (rec.val2) rec.val2.setAttribute('x', vx);
  }
  function showDetails(d) {
    drawWhisker(d?.id || null);
    if (!d) { F.card.hide({ silent: true }); return; }
    const jin = /Jin 2024/.test(d.note || '');
    F.card.show({
      title: d.label,
      lines: [
        `About ${fmt.times(d.v)} as common <span class="k">(likely range ${fmt.range(d.lo, d.hi)})</span>`,
        ...(d.cause ? [`<span class="k">Cause:</span> ${d.cause}`] : []),
      ],
      note: d.note ? `<span class="k">Note:</span> ${d.note}` : null,
      source: `Source: ${SRC_ENGELS}${jin ? `; ${SRC_JIN}` : ''}. Likely range: the 95% confidence interval.`,
    }, { onClose: () => { el.R.select(null, { silent: true }); drawWhisker(null); } });
  }

  // ---------------------------------------------------------------- legend + sort (appear at step 3)
  // One block under the chart that unfolds at step 3 (so nothing above the chart
  // ever moves, and steps 1–2 carry no empty reserved space).
  const keyIn = ctx.h('div', { class: 'ev-key__in' });
  const key = ctx.h('div', { class: 'ev-key' }, keyIn);
  keyIn.append(legendHTML([
    { shape: 'circle', color: C.s1, label: HEADERS.infection },
    { shape: 'diamond', fill: false, color: C.ink2, label: HEADERS.none },
    { shape: 'circle', fill: false, dash: '2.4 1.9', color: C.s1, label: LEGEND_DAGGER },
  ]));
  const sortWrap = ctx.h('div', { class: 'ev-sort is-off' });
  keyIn.append(sortWrap);
  F.main.after(key);
  // Phones (POLISH, foundation S2): the long source paragraph and the step-3 legend/sort block move
  // after the caption, so the stepper sits right under the chart. Both stay visible (rule 19).
  const sourceEl = ctx.stage.querySelector('.ck-source');
  const phoneBox = ctx.h('div', { class: 'ev-phone ck ck--light' });
  function placeParts(c) {
    if (c) { phoneBox.append(key, sourceEl); if (!phoneBox.isConnected) ctx.controls.append(phoneBox); }
    else { F.main.after(key); key.after(sourceEl); phoneBox.remove(); }
  }
  const sortCtl = ctx.ui.segmented({
    label: 'Sort', parent: sortWrap, value: 'cause',
    options: [{ value: 'size', label: 'By size' }, { value: 'cause', label: 'By cause' }],
    onChange: (v) => {
      sortMode = v;
      applyStep3({ duration: 0.7 });
      gsap.delayedCall(ctx.reducedMotion ? 0 : 0.75, () => stepper.rebuild());
    },
  });
  // Stable ids (ctx.ui ids come from a page-wide counter that depends on load order).
  { const lab = sortCtl.el.querySelector('.segmented__label'); lab.id = 'ch07-evidence-sort-label'; sortCtl.el.querySelector('[role="radiogroup"]').setAttribute('aria-labelledby', lab.id); }

  // ---------------------------------------------------------------- step states
  function reset() {
    const { recs, heads, pulses } = el;
    const vp = valueLayout().pos;
    el.R.place((r) => vp[r.id]);
    gsap.set(heads, { opacity: 0 });
    gsap.set(pulses, { opacity: 0 });
    for (const rec of Object.values(recs)) {
      const all = rec.d.id === 'all';
      gsap.set(rec.row.label, { opacity: all ? 1 : 0.3 });
      if (rec.q) gsap.set(rec.q, { opacity: 1 });
      if (rec.neutral) gsap.set(rec.neutral, { x: el.x(1), opacity: 0, scale: 1, transformOrigin: '50% 50%' });
      gsap.set(rec.cause, { opacity: 0, scale: all ? 0.4 : 0.6, transformOrigin: '50% 50%' });
      if (rec.val) gsap.set(rec.val, { opacity: 0 });
      if (rec.val2) gsap.set(rec.val2, { opacity: 0 });
      if (rec.spot) gsap.set(rec.spot, { opacity: 0 });
    }
    gsap.set(key, { opacity: 0, gridTemplateRows: '0fr' });
  }

  function applyStep3(anim) {
    const { recs, heads } = el;
    const byCause = sortMode === 'cause';
    const target = byCause ? causeLayout().pos : valueLayout().pos;
    el.R.place((r) => target[r.id], { ...anim, ease: 'so.inOut' });
    tweenTo(heads, { opacity: byCause ? 1 : 0 }, { ...anim, duration: anim.tl ? 0.5 : anim.duration, at: (anim.at || 0) + (byCause ? 0.35 : 0) });
    return recs;
  }

  const STEPS = [
    { // 1 — the overall number; teach the multiplying scale
      enter(tl) {
        const { recs, pulses, pulseLabels } = el;
        const all = recs.all;
        tl.fromTo(all.cause, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'so.out' }, 0);
        if (all.val) tl.fromTo(all.val, { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.35);
        pulses.forEach((p, k) => {
          tl.fromTo(p, { opacity: 0 }, { opacity: 0.85, duration: 0.28, ease: 'so.out' }, 0.9 + k * 0.42);
          tl.to(p, { opacity: 0, duration: 0.55, ease: 'so.in' }, 0.9 + k * 0.42 + 0.3);
        });
        pulseLabels.forEach((lab, k) => {
          tl.fromTo(lab, { opacity: 1 }, { opacity: 0.35, duration: 0.2 }, 0.9 + k * 0.42);
          tl.to(lab, { opacity: 1, duration: 0.4 }, 0.9 + k * 0.42 + 0.3);
        });
      },
    },
    { // 2 — all dots slide out from 1×; breast and prostate stay put
      enter(tl) {
        const { recs, x } = el;
        ORDER_VALUE.slice(1).forEach((id, k) => {
          const rec = recs[id];
          tl.to(rec.row.label, { opacity: 1, duration: 0.4 }, 0);
          tl.to(rec.q, { opacity: 0, duration: 0.2 }, 0.05 + k * 0.03);
          tl.fromTo(rec.neutral, { opacity: 0, x: x(1) }, { opacity: 1, x: x(rec.d.v), duration: 0.6, ease: 'so.out' }, 0.1 + k * 0.03);
          if (rec.val) tl.fromTo(rec.val, { opacity: 0 }, { opacity: 1, duration: 0.35 }, 0.62 + k * 0.03);
        });
        for (const id of SPOT) tl.fromTo(recs[id].spot, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 1.0);
      },
    },
    { // 3 — encode by cause, then regroup
      enter(tl) {
        const { recs } = el;
        for (const id of ORDER_VALUE.slice(1)) {
          const rec = recs[id];
          tl.to(rec.neutral, { opacity: 0, scale: 0.6, duration: 0.35 }, 0);
          tl.fromTo(rec.cause, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'so.out' }, 0.15);
          if (rec.spot) tl.to(rec.spot, { opacity: 0, duration: 0.3 }, 0);
        }
        if (recs.liver.val2) {
          tl.to(recs.liver.val, { opacity: 0, duration: 0.3 }, 0.2);
          tl.fromTo(recs.liver.val2, { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.3);
        }
        // The legend and sort control unfold under the chart.
        tl.fromTo(key, { gridTemplateRows: '0fr', opacity: 0 }, { gridTemplateRows: '1fr', opacity: 1, duration: 0.6 }, 0.1);
        applyStep3({ tl, at: 0.65, duration: 0.7 });
      },
    },
  ];

  // ---------------------------------------------------------------- lifecycle
  let placed = null;
  ctx.onResize(({ compact }) => {
    if (placed !== compact) { placed = compact; placeParts(compact); }
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
      sortWrap.classList.toggle('is-off', i < 2);
      if (i < 2 && sortMode !== 'cause') { sortMode = 'cause'; sortCtl.set('cause'); stepper.rebuild(); }
      el.R.setInteractive((d) => i >= 1 || d.id === 'all');
      if (el.R.selected == null) { drawWhisker(null); if (F.card.open) F.card.hide({ silent: true }); }
    },
  });

  return { destroy() { F.card.hide({ silent: true }); } };
}
