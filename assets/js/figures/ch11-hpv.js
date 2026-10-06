// ch11-hpv — "The earlier, the better" (Figure 11.1)
//
// Real population data on HPV vaccination and cervical cancer from three countries, one at a
// time (segmented control): England (Falcaro, Lancet 2021: % fewer cancers by age offered,
// with a 100-circle "out of every 100 expected cancers" grid), Sweden (Lei, NEJM 2020: % lower
// rate by age vaccinated) and Scotland (Palmer, JNCI 2024: rates per 100,000 women per year,
// with "0 cases recorded" among those vaccinated at 12–13). Bars carry 95% CI whiskers; bars
// are focusable rows (hover / tap / Tab + arrows) with a tooltip that repeats the source.
// Light stage, chart token --chart-1 (§4 rule 20), source line always visible (§4 rule 19).
// The countries never share an axis: different vaccines, methods and metrics.
import { C, scale, chartRoot, axis, bars, whisker, rows, chartFrame } from './shared/chart.js';
import { unitGrid } from './shared/unit-grid.js';

const ID = 'ch11-hpv';

// ------------------------------------------------------------------ data (verbatim from the spec)
const DATA = {
  england: {
    label: 'England', axis: 'pct', side: 'grid', short: 'Falcaro 2021', cite: 7,
    rows: [
      { id: 'e1', label: 'Offered at 12–13', v: 87, lo: 72, hi: 94, cin3: '97% fewer (96–98)', still: 13 },
      { id: 'e2', label: 'Offered at 14–16', v: 62, lo: 52, hi: 71, cin3: '75% fewer (72–77)', still: 38 },
      { id: 'e3', label: 'Offered at 16–18', v: 34, lo: 25, hi: 41, cin3: '39% fewer (36–41)', still: 66 },
    ],
    note: 'Bivalent vaccine, introduced in 2008. Women aged 20–29, data to mid-2019.',
    source: 'Source: <a href="#src-7">Falcaro et al., <em>Lancet</em> 2021</a>.',
  },
  sweden: {
    label: 'Sweden', axis: 'pct', side: null, short: 'Lei 2020', cite: 6,
    rows: [
      { id: 's1', label: 'Vaccinated before age 17', v: 88, lo: 66, hi: 100 },
      { id: 's2', label: 'Vaccinated at 17–30', v: 53, lo: 25, hi: 73 },
    ],
    note: 'Quadrivalent vaccine. 1.7 million girls and women aged 10–30 followed 2006–2017; 19 cancers among vaccinated and 538 among unvaccinated women (rates, adjusted for age and family background, are compared).',
    source: 'Source: <a href="#src-6">Lei et al., <em>NEJM</em> 2020</a>.',
  },
  scotland: {
    label: 'Scotland', axis: 'rate', side: 'zero', short: 'Palmer 2024', cite: 1,
    rows: [
      { id: 'c1', label: 'Not vaccinated', v: 8.4, lo: 7.2, hi: 9.6 },
      { id: 'c2', label: 'Vaccinated at 14–22, three doses', v: 3.2, lo: 2.1, hi: 4.6 },
      { id: 'c3', label: 'Vaccinated at 12–13, any number of doses', v: 0, none: true },
    ],
    note: 'Bivalent vaccine. Women born 1988–1996; data extracted July 2020, when those vaccinated at 12–13 were in their mid-twenties.',
    source: 'Source: <a href="#src-1">Palmer et al., <em>JNCI</em> 2024</a>.',
  },
};
const AXES = {
  pct: { domain: [0, 100], ticks: [0, 50, 100], fmt: (v) => `${v}%`, title: 'Fewer cervical cancers', value: (v) => `${v}%` },
  rate: { domain: [0, 10], ticks: [0, 5, 10], fmt: (v) => String(v), title: 'Cervical cancers per 100,000 women per year', titleLines: ['Cervical cancers per 100,000', 'women per year'], value: (v) => v.toFixed(1) },
};
const WHISKER_LEGEND = 'Thin line = range of plausible values (95% confidence interval).';
const FOOTNOTE = '<b>Why age matters:</b> the vaccine prevents infection but cannot clear an infection that is already there, so it protects best when given before any exposure to the virus.';
const GRID_TITLE = 'Out of every 100 cervical cancers expected without vaccination…';
const ZERO_TEXT = 'cases recorded among women vaccinated at 12 or 13. With so few of them yet old enough for cervical cancer, zero is not the same as no risk.';

const CSS = `
[data-figure="${ID}"] .hp-main { display: grid; grid-template-columns: minmax(0, 1fr); gap: 22px; align-items: center; }
[data-figure="${ID}"] .hp-main.is-wide { grid-template-columns: minmax(0, 3fr) minmax(0, 2fr); gap: 36px; min-height: var(--hp-min-h, 0); }
[data-figure="${ID}"] .hp-main.is-wide.is-solo { grid-template-columns: minmax(0, 1fr); }
[data-figure="${ID}"] .hp-chart { min-width: 0; }
[data-figure="${ID}"] .hp-chart > svg { display: block; width: 100%; height: auto; overflow: visible; }
[data-figure="${ID}"] .hp-side { min-width: 0; display: flex; flex-direction: column; align-items: center; gap: 10px; font-family: var(--font-ui); color: var(--fg); text-align: center; }
[data-figure="${ID}"] .hp-side[hidden] { display: none; }
[data-figure="${ID}"] .hp-side__title { margin: 0; max-width: 19rem; font-size: 15px; line-height: 1.35; font-weight: 600; text-wrap: balance; }
[data-figure="${ID}"] .hp-side__sel { margin: 0; font-size: 14px; color: var(--fg-2); }
[data-figure="${ID}"] .hp-side__sel b { color: var(--fg); font-weight: 650; }
[data-figure="${ID}"] .hp-units { display: block; width: 100%; max-width: 15.5rem; height: auto; overflow: visible; }
[data-figure="${ID}"].is-compact .hp-units { max-width: 13.5rem; }
[data-figure="${ID}"] .hp-units .ug-ring { stroke: var(--hp-faint) !important; }
[data-figure="${ID}"] .hp-units .ug-check { stroke: var(--fg-2) !important; }
[data-figure="${ID}"] .hp-count { margin: 0; display: flex; flex-wrap: wrap; justify-content: center; gap: 4px 14px; font-size: 15px; line-height: 1.35; font-variant-numeric: tabular-nums; }
[data-figure="${ID}"] .hp-count span { display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; }
[data-figure="${ID}"] .hp-count b { font-weight: 700; }
[data-figure="${ID}"] .hp-count svg { width: 14px; height: 14px; flex: none; overflow: visible; }
[data-figure="${ID}"] .hp-zero { display: grid; grid-template-columns: auto minmax(0, 1fr); align-items: center; gap: 4px 16px; max-width: 24rem; text-align: left; }
[data-figure="${ID}"] .hp-zero__num { font-family: var(--font-display); font-variation-settings: var(--fraunces-soft); font-weight: 300; font-size: 104px; line-height: 0.9; color: var(--fg-3); font-variant-numeric: lining-nums; }
[data-figure="${ID}"] .hp-zero p { margin: 0; font-size: 15px; line-height: 1.45; color: var(--fg-2); text-wrap: pretty; }
[data-figure="${ID}"].is-compact .hp-zero__num { font-size: 80px; }
[data-figure="${ID}"] .hp-notes { display: flex; flex-direction: column; gap: 8px; font-family: var(--font-ui); }
[data-figure="${ID}"] .hp-wleg { margin: 0; display: flex; align-items: center; gap: 10px; font-size: 13px; line-height: 1.4; color: var(--fg-2); }
[data-figure="${ID}"] .hp-wleg svg { flex: none; width: 34px; height: 14px; overflow: visible; }
[data-figure="${ID}"] .hp-note { margin: 0; max-width: 78ch; font-size: 13px; line-height: 1.5; color: var(--fg-2); text-wrap: pretty; }
[data-figure="${ID}"] .hp-foot { margin: 0; max-width: 78ch; padding: 8px 12px; border-radius: 8px; background: color-mix(in srgb, var(--fg) 4.5%, transparent);
  font-size: 14px; line-height: 1.5; color: var(--fg); text-wrap: pretty; }
[data-figure="${ID}"] .hp-foot b { font-weight: 650; }
[data-figure="${ID}"].is-compact .hp-note, [data-figure="${ID}"].is-compact .hp-wleg { font-size: 14px; }
[data-figure="${ID}"] .ck-source a { color: inherit; }
[data-figure="${ID}"].is-compact .ck-frame__toolbar .segmented, [data-figure="${ID}"].is-compact .ck-frame__toolbar .segmented__track { width: 100%; }
[data-figure="${ID}"].is-compact .ck-frame__toolbar .segmented__opt { flex: 1 1 0; justify-content: center; padding: 0 0.4rem; }
[data-figure="${ID}"] svg .hp-bar { fill: var(--ck-1); fill-opacity: 0.85; transition: fill-opacity var(--dur-2) ease; }
[data-figure="${ID}"] svg.has-sel .hp-bar { fill-opacity: 0.5; }
[data-figure="${ID}"] svg.has-sel .ck-row.is-selected .hp-bar { fill-opacity: 1; stroke: var(--fg); stroke-width: 1.5px; vector-effect: non-scaling-stroke; }
[data-figure="${ID}"] svg .hp-label { font-size: max(15px, calc(13px * var(--u, 1))); font-weight: 520; fill: var(--fg); }
[data-figure="${ID}"] svg .ck-row.is-selected .hp-label { font-weight: 720; }
[data-figure="${ID}"] svg .hp-val { font-size: max(15px, calc(13px * var(--u, 1))); font-weight: 650; fill: var(--fg); font-variant-numeric: tabular-nums; }
[data-figure="${ID}"] svg .hp-none { font-size: max(15px, calc(13px * var(--u, 1))); font-weight: 720; fill: var(--fg); }
[data-figure="${ID}"] svg .hp-zero-tick { stroke: var(--fg); stroke-width: 2.5px; stroke-linecap: round; vector-effect: non-scaling-stroke; }
[data-figure="${ID}"] .ck-frame { --hp-faint: color-mix(in srgb, var(--fg) 32%, transparent); }
[data-figure="${ID}"] .ck-frame svg .ck-row.is-selected .ck-row__band { fill: color-mix(in srgb, var(--fg) 3.5%, transparent); }
`;
function injectCSS() {
  if (document.getElementById(`${ID}-css`)) return;
  const s = document.createElement('style');
  s.id = `${ID}-css`;
  s.textContent = CSS;
  document.head.append(s);
}

const glyphFilled = '<svg viewBox="-7 -7 14 14" aria-hidden="true"><circle r="6" style="fill:var(--chart-1)"/></svg>';
const glyphCheck = '<svg viewBox="-7 -7 14 14" aria-hidden="true"><circle r="5.4" style="fill:none;stroke:var(--hp-faint);stroke-width:1.4"/><path d="M-2.8,0.2L-0.8,2.2L3,-1.9" style="fill:none;stroke:var(--fg-2);stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round"/></svg>';

export default function mount(fig, ctx) {
  injectCSS();
  const { gsap } = ctx;
  const F = chartFrame(ctx, { toolbar: true, source: ' ', card: false });

  let country = 'england';
  let selected = { england: 'e1', sweden: null, scotland: null };
  let wide = null;
  let chart = null;        // { svg, R, recs, x }
  let grid = null;
  let revealed = false;
  let lastW = 0;

  // ---------------------------------------------------------------- DOM scaffold
  const main = ctx.h('div', { class: 'hp-main' });
  const chartEl = ctx.h('div', { class: 'hp-chart' });
  const side = ctx.h('div', { class: 'hp-side' });
  main.append(chartEl, side);
  F.main.append(main);

  // Side panel A: the 100-cancer grid (England).
  const gTitle = ctx.h('p', { class: 'hp-side__title', text: GRID_TITLE });
  const gSel = ctx.h('p', { class: 'hp-side__sel' });
  // Built in the live side panel (not a detached node), with a page-unique def key, so the
  // unit grid's hatch <pattern> is created once instead of once per unit (QA R4).
  const gSvg = ctx.createSVG({ viewBox: '0 0 256 256', parent: side, className: 'hp-units', interactive: false });
  gSvg.dataset.ckKey = ctx.uid('units');
  const gCount = ctx.h('p', { class: 'hp-count', 'aria-hidden': 'true' });
  // Side panel B: Scotland's zero.
  const zero = ctx.h('div', { class: 'hp-zero' }, ctx.h('span', { class: 'hp-zero__num', 'aria-hidden': 'true', text: '0' }), ctx.h('p', null, ZERO_TEXT));
  zero.querySelector('p').setAttribute('aria-label', `Zero ${ZERO_TEXT}`);

  // Notes under the chart.
  const notes = ctx.h('div', { class: 'hp-notes' });
  const wleg = ctx.h('p', { class: 'hp-wleg' });
  wleg.innerHTML = `<svg viewBox="0 -7 34 14" aria-hidden="true"><g style="stroke:var(--fg-2);stroke-width:1.5;stroke-linecap:round;fill:none"><line x1="2" x2="32" y1="0" y2="0"/><line x1="2" x2="2" y1="-5" y2="5"/><line x1="32" x2="32" y1="-5" y2="5"/></g></svg><span>${WHISKER_LEGEND}</span>`;
  const note = ctx.h('p', { class: 'hp-note' });
  const foot = ctx.h('p', { class: 'hp-foot', html: FOOTNOTE });
  notes.append(wleg, note, foot);
  F.below.append(notes);

  // Country switch (arrow keys move between options).
  const seg = ctx.ui.segmented({
    label: 'Country', hideLabel: true, value: country, parent: F.toolbar,
    options: Object.entries(DATA).map(([value, d]) => ({ value, label: d.label })),
    onChange: (v) => setCountry(v),
  });

  // ---------------------------------------------------------------- unit grid (built once)
  const gRoot = chartRoot(gSvg);
  grid = unitGrid(gRoot, { count: 100, cols: 10, size: 20, gap: 6, shape: 'circle', x: 1, y: 1, color: C.s1, state: 'hidden', label: '' });
  const gridStates = (still) => (u, i) => (i < still ? 'filled' : 'check');

  // ---------------------------------------------------------------- chart (rebuilt per country / width)
  function tipHTML(d, it) {
    const ax = AXES[d.axis];
    if (it.none) return `<b>${it.label}</b><br>No cases recorded (no interval can be given)<br><span style="color:var(--ink-3);font-size:12px">${d.short}</span>`;
    const main = d.axis === 'pct'
      ? `${it.v}% fewer cervical cancers`
      : `${ax.value(it.v)} cervical cancers per 100,000 women per year`;
    const range = d.axis === 'pct' ? `${it.lo}–${it.hi}%` : `${ax.value(it.lo)}–${ax.value(it.hi)}`;
    return `<b>${it.label}</b><br>${main}<br><span style="color:var(--ink-2)">95% CI: ${range}</span>${it.cin3 ? `<br>Precancer (CIN3): ${it.cin3}` : ''}<br><span style="color:var(--ink-3);font-size:12px">${d.short}</span>`;
  }
  function describe(d, it) {
    if (it.none) return `${it.label}: no cases recorded`;
    if (d.axis === 'pct') {
      const base = `${it.label}: ${it.v}% fewer cervical cancers`;
      return it.still != null ? `${base}; ${it.still} of 100 expected cancers still occurred` : `${base}, plausible range ${it.lo} to ${it.hi}%`;
    }
    return `${it.label}: ${AXES.rate.value(it.v)} cervical cancers per 100,000 women per year, plausible range ${AXES.rate.value(it.lo)} to ${AXES.rate.value(it.hi)}`;
  }

  function buildChart(animate) {
    const d = DATA[country];
    const ax = AXES[d.axis];
    const W = Math.max(300, Math.round(chartEl.getBoundingClientRect().width || 600));
    const rowH = 62;
    const top = 6;
    const valW = d.axis === 'pct' ? 50 : 44;
    const x0 = 2; const x1 = W - valW;
    const x = scale({ domain: ax.domain, range: [x0, x1] });
    const axisY = top + d.rows.length * rowH + 6;
    const twoLine = ax.titleLines && W < 560;
    const H = axisY + (twoLine ? 76 : 58);
    chartEl.replaceChildren();
    const svg = ctx.createSVG({
      viewBox: `0 0 ${W} ${H}`, parent: chartEl, interactive: true,
      label: `${d.label}: bar chart. Tab to the bars and use the arrow keys to move between them.`,
    });
    const g = chartRoot(svg);
    // Light 0/50/100 reference only.
    axis(g, { scale: x, at: axisY, ticks: ax.ticks, format: ax.fmt, grid: [top - 2, axisY], tickSize: 4, title: twoLine ? ax.titleLines : ax.title, titleAlign: 'start' });
    const R = rows(g, {
      items: d.rows, x0: 0, x1: W, top, rowH, labelW: 0, labelPad: 0,
      label: () => '', name: `${d.label} bars`,
      ariaLabel: (it) => describe(d, it),
      onSelect: (it, row) => select(it ? it.id : null, { source: 'pointer', row }),
      onFocus: (it, row) => { R.select(it.id); showTip(it, row); },
    });
    const recs = {};
    const barY = 14;
    for (const r of R.rows) {
      const it = r.item;
      const c = r.content;
      const lab = ctx.svg('text', { class: 'hp-label', x: x0, y: -9, text: it.label }, c);
      const rec = { row: r, lab };
      if (it.none) {
        rec.tick = ctx.svg('line', { class: 'hp-zero-tick', x1: x(0), x2: x(0), y1: barY - 10, y2: barY + 10 }, c);
        rec.val = ctx.svg('text', { class: 'hp-none', x: x(0) + 12, y: barY, dy: '0.35em', text: 'No cases recorded' }, c);
      } else {
        const b = bars(c, [{ id: it.id, at: barY, from: x(0), to: x(it.v) }], { thickness: 22, radius: 4, color: C.s1 });
        b.items[0].bar.classList.add('hp-bar');
        b.items[0].bar.removeAttribute('style');
        rec.bars = b;
        rec.bar = b.items[0].bar;
        rec.wh = ctx.svg('g', { class: 'hp-whisker' }, c);
        whisker(rec.wh, { x0: x(it.lo), x1: x(it.hi), y: barY, cap: 12, color: C.surface, width: 4.5 });
        whisker(rec.wh, { x0: x(it.lo), x1: x(it.hi), y: barY, cap: 10, color: C.ink2, width: 1.6 });
        rec.val = ctx.svg('text', { class: 'hp-val', x: Math.max(x(it.v), x(it.hi)) + 9, y: barY, dy: '0.35em', text: ax.value(it.v) }, c);
      }
      recs[it.id] = rec;
    }
    chart = { svg, R, recs, x, W, H };
    const sel = selected[country];
    if (sel) R.select(sel, { silent: true });
    svg.classList.toggle('has-sel', !!sel);
    if (animate && !ctx.reducedMotion) grow();
    else if (!revealed) hideMarks();
  }
  function hideMarks() {
    for (const rec of Object.values(chart.recs)) gsap.set([rec.bar, rec.wh, rec.val, rec.tick].filter(Boolean), { opacity: 0 });
  }
  function grow() {
    Object.values(chart.recs).forEach((rec, i) => {
      const delay = 0.1 + i * 0.12;
      if (rec.bar) { gsap.set(rec.bar, { opacity: 1 }); rec.bars.grow({ duration: 0.8, delay }); }
      const fx = [rec.wh, rec.val, rec.tick].filter(Boolean);
      gsap.fromTo(fx, { opacity: 0 }, { opacity: 1, duration: 0.4, delay: delay + 0.6, ease: 'so.out' });
    });
  }
  function revealMarks() {
    for (const rec of Object.values(chart.recs)) gsap.set([rec.bar, rec.wh, rec.val, rec.tick].filter(Boolean), { opacity: 1 });
  }

  // ---------------------------------------------------------------- selection
  function showTip(it, row) {
    const rec = chart.recs[it.id];
    const anchor = rec.bar || rec.val;
    ctx.tooltip.show(tipHTML(DATA[country], it), anchor);
  }
  function select(id, { source = 'api', row } = {}) {
    const d = DATA[country];
    selected[country] = id;
    chart?.svg.classList.toggle('has-sel', !!id);
    if (!id) { ctx.tooltip.hide(); return; }
    const it = d.rows.find((r) => r.id === id);
    if (source === 'pointer' && row) showTip(it, row);
    if (country === 'england') updateGrid(it, source !== 'api');
    if (source !== 'api') ctx.announce(describe(d, it));
  }
  function updateGrid(it, animate) {
    const before = grid.count('filled');
    const changed = Math.abs(it.still - before) || 1;
    const run = animate && revealed && !ctx.reducedMotion;
    grid.setStates(gridStates(it.still), run ? { duration: 0.3, stagger: Math.min(0.03, 0.4 / changed), from: it.still > before ? 'start' : 'end' } : { duration: 0 });
    gSel.innerHTML = `<b>${it.label}</b>`;
    gCount.innerHTML = `<span>${glyphFilled}<span><b>${it.still}</b> still occurred</span></span><span>${glyphCheck}<span><b>${100 - it.still}</b> prevented</span></span>`;
    grid.el.setAttribute('aria-label', `${it.label}: ${it.still} of every 100 expected cervical cancers still occurred; ${100 - it.still} were prevented.`);
  }

  // ---------------------------------------------------------------- country switch
  function layoutSide() {
    const d = DATA[country];
    side.replaceChildren();
    side.hidden = !d.side;
    main.classList.toggle('is-solo', !d.side);
    if (d.side === 'grid') side.append(gTitle, gSel, gSvg, gCount);
    if (d.side === 'zero') side.append(zero);
    note.textContent = d.note;
    F.sourceEl.innerHTML = d.source;
  }
  function setCountry(v) {
    if (v === country) return;
    country = v;
    seg.set(v);
    ctx.tooltip.hide();
    const run = revealed && !ctx.reducedMotion;
    const swap = () => {
      layoutSide();
      buildChart(run);
      if (country === 'england') updateGrid(DATA.england.rows.find((r) => r.id === selected.england), false);
    };
    if (run) {
      gsap.to(main, { opacity: 0, duration: 0.18, ease: 'so.in', onComplete: () => { swap(); gsap.to(main, { opacity: 1, duration: 0.3, ease: 'so.out' }); } });
    } else swap();
    const d = DATA[v];
    ctx.announce(`${d.label}. ${d.note}`);
  }

  // ---------------------------------------------------------------- lifecycle
  function measureMinHeight() {
    // Desktop: keep the stage height steady across countries (England is the tallest).
    main.style.removeProperty('--hp-min-h');
    if (!wide) return;
    main.style.setProperty('--hp-min-h', `${Math.ceil(Math.max(main.getBoundingClientRect().height, 0))}px`);
  }
  ctx.onResize(() => {
    const w = F.main.getBoundingClientRect().width || ctx.width;
    const isWide = w >= 700;
    if (isWide !== wide) { wide = isWide; main.classList.toggle('is-wide', wide); main.style.removeProperty('--hp-min-h'); }
    if (Math.abs(w - lastW) < 4 && chart) return;
    lastW = w;
    layoutSide();
    buildChart(false);
    if (revealed) revealMarks();
    if (country === 'england' || !grid.count('filled')) updateGrid(DATA.england.rows.find((r) => r.id === selected.england), false);
    if (country === 'england') requestAnimationFrame(measureMinHeight);
  });
  // Grid starts hidden until the reveal.
  if (!revealed) grid.setStates('hidden', { duration: 0 });

  ctx.onceVisible(() => {
    revealed = true;
    if (ctx.reducedMotion) { revealMarks(); updateGrid(DATA.england.rows.find((r) => r.id === selected.england), false); return; }
    grow();
    const it = DATA.england.rows.find((r) => r.id === selected.england);
    grid.setStates('hidden', { duration: 0 });
    gsap.delayedCall(0.5, () => grid.setStates(gridStates(it.still), { duration: 0.35, stagger: 0.006 }));
  }, 0.3);

  // A tap on the already-selected bar still shows its details.
  ctx.on(chartEl, 'click', (e) => {
    const g = e.target.closest?.('.ck-row');
    if (!g || !chart) return;
    const it = DATA[country].rows.find((r) => r.id === g.dataset.id);
    if (it && selected[country] === it.id) showTip(it);
  });
  // Tabbing onto a bar (the roving tab stop lands on the selected one) also shows its tooltip.
  ctx.on(chartEl, 'focusin', (e) => {
    const g = e.target.closest?.('.ck-row');
    if (!g || !chart) return;
    const it = DATA[country].rows.find((r) => r.id === g.dataset.id);
    if (!it) return;
    if (selected[country] !== it.id) chart.R.select(it.id);
    else showTip(it);
  });
  ctx.on(chartEl, 'pointerleave', (e) => { if (e.pointerType === 'mouse') ctx.tooltip.hide(); });
  ctx.on(chartEl, 'focusout', (e) => { if (!chartEl.contains(e.relatedTarget)) ctx.tooltip.hide(); });
  ctx.on(window, 'scroll', () => ctx.tooltip.hide(), { passive: true });

  return { destroy() { ctx.tooltip.hide(); } };
}
