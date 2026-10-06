// ch03-numbers — "How big is the library?" (Figure 3.2)
//
// One vertical logarithmic ladder (10⁰ … 10¹⁶) revealed rung by rung with the
// stepper: ~70 heavy-chain segments → <20,000 genes → ~1.8 million segment
// combinations → ~10¹⁵ possible T-cell receptors → ~4 × 10¹¹ T cells in a body →
// ≥10⁸ receptors actually present (a sequencing-based minimum; one model ≈10¹⁰).
// Step 6 shades the gap between possible and present. Gold rungs = antibody
// numbers, blue = T-cell numbers, ink = the genome. Every revealed rung is a
// focusable row (shared chart kit `rows`): tap / hover / Enter shows its source in
// the info card. Light stage (follows the page theme). Phones: the ladder is
// taller than the stage and pans so the current rung sits mid-stage.
//
// Data and sources: content/drafts/03-adaptive.md (figure ch03-numbers `data`);
// chapter source numbers: IMGT [7], Amaral 2023 [4], Lythe 2016 [9], Qi 2014 [11].
import { C, scale, chartRoot, axis, band, rows, chartFrame } from './shared/chart.js';
import { tCell, tcrKey, antibody } from '../art/index.js';

const FIG = 'ch03-numbers';
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const sup = (n) => String(n).split('').map((d) => SUP[+d]).join('');
const pow = (n) => `10${sup(n)}`;
const WORDS = { 3: 'thousand', 6: 'million', 9: 'billion', 12: 'trillion', 15: 'quadrillion' };
const HUE = { V: '#45C1B3', D: '#F2A07A', J: '#B3A0F0' };

const SRC = {
  imgt: { n: 7, text: 'IMGT, the international ImMunoGeneTics information system: IMGT Repertoire, human IGH, IGK and IGL locus descriptions (functional gene counts; accessed October 2026).' },
  amaral: { n: 4, text: 'Amaral P, et al. The status of the human gene catalogue. <em>Nature</em> 2023;622:41–47.' },
  lythe: { n: 9, text: 'Lythe G, Callard RE, Hoare RL, Molina-París C. How many TCR clonotypes does a body maintain? <em>J Theor Biol</em> 2016;389:214–224.' },
  qi: { n: 11, text: 'Qi Q, et al. Diversity and clonal selection in the human T-cell repertoire. <em>Proc Natl Acad Sci USA</em> 2014;111:13139–13144.' },
};
const cite = (k) => `<a href="#src-${SRC[k].n}">[${SRC[k].n}]</a> ${SRC[k].text}`;

// Rungs in reveal order. kind: 'ab' (gold, antibodies) | 'tc' (blue, T cells) | 'ink' (genome).
const RUNGS = [
  {
    id: 'segments', v: 70, kind: 'ab', icon: 'tiles', value: '≈70', srcN: '7',
    label: 'V, D and J segments for an antibody heavy chain (≈40 + 23 + 6)',
    card: {
      title: 'About 70 gene segments',
      lines: ['For an antibody heavy chain your DNA holds about 40 working V segments, 23 D and 6 J: around 70 pieces. The number of working V segments differs a little between people (about 38–46).'],
      source: cite('imgt'),
    },
  },
  {
    id: 'genes', v: 2e4, kind: 'ink', icon: 'helix', value: '<20,000', srcN: '4', lt: true,
    label: 'protein-coding genes in your whole genome',
    card: {
      title: 'Fewer than 20,000 genes',
      lines: ['The whole human genome has fewer than 20,000 protein-coding genes, for everything from hemoglobin to hair. Drawn at 2 × 10⁴ with a “<” mark: the true number is a little lower.'],
      source: cite('amaral'),
    },
  },
  {
    id: 'combos', v: 1.8e6, kind: 'ab', icon: 'pair', value: '≈1.8 million', srcN: '7',
    label: 'heavy × light chain combinations from segment choice alone (calculated)',
    card: {
      title: 'About 1.8 million combinations',
      lines: [
        'Heavy chain: 40 × 23 × 6 = 5,520 choices.',
        'Light chain: κ ≈ 35 × 5 = 175 plus λ ≈ 30 × 5 = 150, about 325.',
        '5,520 × 325 ≈ 1.8 million, before any nucleotides change at the junctions.',
      ],
      note: 'Calculated from IMGT gene counts.',
      source: cite('imgt'),
    },
  },
  {
    id: 'possible', v: 1e15, kind: 'tc', icon: 'key', value: '≈10¹⁵', srcN: '9',
    label: 'possible T-cell receptors (classic estimate)',
    card: {
      title: 'About 10¹⁵ possible T-cell receptors',
      lines: ['A million billion. T cells build their receptors from their own V, D and J segments, and the random nucleotides at the junctions multiply the segment combinations many times over. This is the classic estimate; antibodies are more varied still.'],
      source: cite('lythe'),
    },
  },
  {
    id: 'cells', v: 4e11, kind: 'tc', icon: 'cluster', value: '≈4 × 10¹¹', srcN: '9',
    label: 'T cells in an adult body',
    card: {
      title: 'About 4 × 10¹¹ T cells',
      lines: [
        'A few hundred billion T cells in an adult. 10¹⁵ is over 2,000 times more: one T cell for each possible receptor would weigh about 500 kilograms.',
        'Chapter 1’s census gives about 4.7 × 10¹¹ (Sender et al. 2023); both fit “a few hundred billion”.',
      ],
      source: cite('lythe'),
    },
  },
  {
    id: 'present', v: 1e8, kind: 'tc', icon: 'tcell', value: '≥10⁸', srcN: '11',
    label: 'different T-cell receptor chains in a young adult (sequencing-based estimate; a minimum)',
    card: {
      title: 'At least 10⁸ receptors present',
      lines: [
        'Sequencing receptor genes from blood, then estimating statistically how many versions went unseen, puts a young adult’s naive T cells at no fewer than 100 million different β chains: a lower bound, not a count.',
        'One mathematical model suggests about 10¹⁰ distinct receptors, above every sequencing-based estimate. Either way, it is a sliver of what could be cut.',
      ],
      source: `${cite('qi')}<br>${cite('lythe')}`,
    },
  },
];
const SOURCE_LINE = 'Sources: IMGT; Amaral 2023; Qi 2014; Lythe 2016. Tap a rung to see where its number comes from.';

const LAYOUTS = {
  wide: {
    compact: false, W: 1000, H: 610, top: 92, dec: 30.5, axisX: 128, labelX: 200, wrap: 120,
    rowH: 44, window: null, wordsInline: true,
  },
  compact: {
    compact: true, W: 400, H: 600, top: 96, dec: 52, axisX: 86, labelX: 158, wrap: 25,
    rowH: 66, window: 600, wordsInline: false,
  },
};

const CSS = `
[data-figure="${FIG}"] svg .cn-val { font-weight: 700; fill: var(--fg); }
[data-figure="${FIG}"] svg .cn-sup { font-size: 0.7em; fill: var(--fg-3); font-weight: 600; }
[data-figure="${FIG}"] svg .cn-word { font-style: italic; }
[data-figure="${FIG}"] svg .cn-gap { font-size: calc(12.5px * var(--u, 1)); }
[data-figure="${FIG}"] .ck-info a { color: var(--accent); }
[data-figure="${FIG}"] svg .ck-row.is-selected { opacity: 1 !important; }
`;
function injectCSS() {
  if (document.getElementById(`${FIG}-css`)) return;
  const s = document.createElement('style');
  s.id = `${FIG}-css`;
  s.textContent = CSS;
  document.head.append(s);
}

/** Greedy word wrap into at most four lines. */
function wrapText(text, max) {
  const words = text.split(' ');
  const lines = [];
  let cur = '';
  for (const w of words) {
    if (cur && (cur + ' ' + w).length > max) { lines.push(cur); cur = w; } else cur = cur ? `${cur} ${w}` : w;
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 4);
}

export default function mount(fig, ctx) {
  injectCSS();
  const { gsap } = ctx;
  const S = (tag, attrs, parent) => ctx.svg(tag, attrs, parent);
  // No side column: the ladder takes the full figure width, and a rung's source card opens
  // inline under the chart only when the reader taps one.
  const F = chartFrame(ctx, { source: SOURCE_LINE, card: false });

  let L = ctx.compact ? LAYOUTS.compact : LAYOUTS.wide;
  let svg = null;
  let el = {};
  let step = -1;
  let selId = null;
  let stepper = null;

  const kindColor = (k) => (k === 'ab' ? C.stroke('antibody') : k === 'tc' ? C.stroke('cd8') : C.ink2);

  // ---------------------------------------------------------------- icons (art library where it exists)
  function icon(kind, parent, stage) {
    const g = S('g', null, parent);
    if (kind === 'tiles') {
      [['V', -12], ['D', 0], ['J', 12]].forEach(([t, x]) => S('rect', { x: x - 4.5, y: -8, width: 9, height: 16, rx: 2, fill: HUE[t], stroke: 'var(--fg-2)', 'stroke-width': 0.8, 'stroke-opacity': 0.6 }, g));
    } else if (kind === 'helix') {
      S('path', { d: 'M-14 -6C-7 -6 -7 6 0 6S7 -6 14 -6M-14 6C-7 6 -7 -6 0 -6S7 6 14 6', fill: 'none', stroke: C.ink2, 'stroke-width': 1.6 }, g);
      for (const x of [-10, -3.5, 3.5, 10]) S('line', { x1: x, x2: x, y1: -4, y2: 4, stroke: C.ink3, 'stroke-width': 1.2 }, g);
    } else if (kind === 'pair') {
      S('rect', { x: -15, y: -7, width: 18, height: 14, rx: 3, fill: C.fill('antibody'), stroke: C.stroke('antibody'), 'stroke-width': 1 }, g);
      S('rect', { x: 4, y: -5, width: 11, height: 10, rx: 3, fill: C.fill('antibody'), 'fill-opacity': 0.45, stroke: C.stroke('antibody'), 'stroke-width': 1 }, g);
    } else if (kind === 'key') {
      g.append(tcrKey({ key: 7, form: 'tip', size: 26, color: 'cd8', stage }));
    } else if (kind === 'cluster') {
      [[-9, 3], [3, -5], [9, 6]].forEach(([x, y], i) => {
        const c = tCell({ variant: 'cd8', r: 6.5, seed: 3 + i, stage, detail: 'low' });
        c.setAttribute('transform', `translate(${x} ${y})`);
        g.append(c);
      });
    } else if (kind === 'tcell') {
      g.append(tCell({ variant: 'cd8', r: 9, seed: 5, stage, detail: 'low' }));
    } else if (kind === 'y') {
      g.append(antibody({ size: 18, stage, anchor: 'center' }));
    }
    return g;
  }

  // ---------------------------------------------------------------- geometry
  const yScale = () => scale({ type: 'log', domain: [1, 1e16], range: [L.top + 16 * L.dec, L.top] });
  const ladderH = () => L.top + 16 * L.dec + 40;
  const panFor = (i) => {
    if (!L.window) return 0;
    const y = yScale();
    const focus = [y(70), y(2e4), y(1.8e6), y(1e15), (y(4e11) + y(1e15)) / 2, (y(1e8) + y(1e15)) / 2][i];
    return Math.max(0, Math.min(ladderH() - L.window, focus - L.window * 0.5));
  };

  // ---------------------------------------------------------------- draw (the "before step 1" scene)
  function draw() {
    F.main.replaceChildren();
    const W = L.W;
    const H = L.window || L.H;
    svg = ctx.createSVG({
      viewBox: `0 0 ${W} ${H}`, parent: F.main, interactive: true,
      label: 'A vertical log-scale ladder of counts, from 1 at the bottom to 10 to the 16th at the top. Tab to the rungs and press Enter for each number’s source.',
    });
    const stage = ctx.artStage;
    const root = chartRoot(svg);
    const y = yScale();
    const ax = L.axisX;
    svg.style.overflow = 'hidden';
    let host = root;
    if (L.window) {
      // phones: the ladder pans inside a window under the fixed legend
      const cid = `${FIG}-win`;
      const cp = S('clipPath', { id: cid }, svg.defs);
      S('rect', { x: 0, y: 62, width: W, height: H - 62 }, cp);
      host = S('g', { 'clip-path': `url(#${cid})` }, root);
    }
    const pan = S('g', { transform: 'translate(0 0)' }, host);
    el = { rungs: {}, pan };

    // axis: a tick every power of ten, words at thousand … quadrillion
    const ticks = Array.from({ length: 17 }, (_, i) => 10 ** i);
    const A = axis(pan, {
      scale: y, orient: 'left', at: ax, ticks, labels: true, tickSize: 6, grid: [ax, W - 8], labelOffset: 16,
      format: (v) => pow(Math.round(Math.log10(v))),
    });
    A.ticks.forEach((t) => {
      const p = Math.round(Math.log10(t.value));
      if (t.grid) t.grid.style.opacity = WORDS[p] ? 0.9 : 0.45;
      if (WORDS[p]) {
        if (L.wordsInline) S('text', { class: 't-small t-end t-muted cn-word', x: ax - 54, y: t.pos, dy: '0.35em', text: WORDS[p] }, pan);
        else S('text', { class: 't-small t-end t-muted cn-word', x: ax - 16, y: t.pos + 17, dy: '0.35em', text: WORDS[p] }, pan);
      }
    });

    // the gap band (step 6), behind the rungs
    const gap = S('g', { opacity: 0 }, pan);
    // hatch with a fixed id (the svg is rebuilt with each draw), so states compare equal
    const hid = `${FIG}-hatch`;
    const pat = S('pattern', { id: hid, width: 7, height: 7, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' }, svg.defs);
    S('line', { x1: 0, y1: 0, x2: 0, y2: 7, style: `stroke:${C.accent}`, 'stroke-width': 1.2 }, pat);
    band(gap, { x0: ax - 6, x1: W - 6, y0: y(1e15), y1: y(1e8), color: C.accent, opacity: 0.05 });
    S('rect', { x: ax - 6, y: y(1e15), width: W - ax, height: y(1e8) - y(1e15), fill: `url(#${hid})`, opacity: 0.3 }, gap);
    const gapLabelY = L.compact ? y(1e8) - 64 : (y(1e10) + y(1e8)) / 2 + 4;
    S('text', { class: 't-caps t-end cn-gap', x: W - 14, y: gapLabelY, text: 'the gap: possible vs. present', style: `fill:${C.accent}` }, gap);
    // bracket on the right edge
    S('path', { d: `M${W - 8} ${y(1e15)}h-6V${y(1e8)}h6`, fill: 'none', stroke: C.accent, 'stroke-width': 1.4, 'stroke-opacity': 0.7 }, gap);
    el.gap = gap;

    // the climb from 10⁶ to 10¹⁵ (step 4): seams multiply the combinations
    const climbG = S('g', { opacity: 0 }, pan);
    const cx = ax + 14;
    const climb = S('path', { d: `M${cx} ${y(1.8e6) - 10}V${y(1e15) + 14}`, fill: 'none', stroke: C.stroke('cd8'), 'stroke-width': 1.6, 'stroke-linecap': 'round' }, climbG);
    const climbHead = S('path', { d: `M${cx - 5} ${y(1e15) + 21}l5 -7 5 7`, fill: 'none', stroke: C.stroke('cd8'), 'stroke-width': 1.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, climbG);
    const climbT = S('text', { class: 't-small', x: cx + 10, y: (y(1e8) + y(1e10)) / 2, dy: '0.35em', text: '+ random junctions', style: `fill:${C.stroke('cd8')}` }, climbG);
    el.climb = { g: climbG, line: climb, head: climbHead, text: climbT };

    // "over 2,000×" between T cells in the body and possible receptors (step 5)
    const yb = y(4e11), yt = y(1e15);
    const xA = L.compact ? L.labelX - 22 : ax + 50;
    const ratio = S('g', { opacity: 0 }, pan);
    S('path', { d: `M${xA} ${yb - 14}V${yt + 16}M${xA - 4} ${yt + 22}l4 -6 4 6M${xA - 4} ${yb - 20}l4 6 4 -6`, fill: 'none', stroke: C.ink2, 'stroke-width': 1.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, ratio);
    const mid = (yb + yt) / 2;
    S('text', { class: 't-label', x: L.labelX, y: mid - (L.compact ? 16 : 8), text: 'over 2,000 times more' }, ratio);
    const callTxt = L.compact ? ['One T cell for each possible', 'receptor would weigh ≈500 kg.'] : ['One T cell for each possible receptor would weigh ≈500 kg.'];
    const cw = L.compact ? 236 : 372;
    const ch = 12 + callTxt.length * 17;
    const cy = mid + (L.compact ? 4 : 6);
    S('rect', { x: L.labelX - 8, y: cy, width: cw, height: ch, rx: 8, style: `fill:${C.hover};stroke:${C.grid}` }, ratio);
    callTxt.forEach((t, i) => S('text', { class: 't-small', x: L.labelX, y: cy + 20 + i * 17, text: t, style: 'fill:var(--fg)' }, ratio));
    el.ratio = ratio;

    // the model's estimate: dashed extension 10⁸ → 10¹⁰ (step 6)
    const ext = S('g', { opacity: 0 }, pan);
    const ex = ax + 30;
    S('path', { d: `M${ex} ${y(1e8) - 4}V${y(1e10)}M${ex - 6} ${y(1e10)}h12`, fill: 'none', stroke: C.stroke('cd8'), 'stroke-width': 2, 'stroke-dasharray': '4 4', 'stroke-linecap': 'round' }, ext);
    const extT = S('text', { class: 't-small', x: L.labelX, y: y(1e10), dy: '0.35em', style: 'fill:var(--fg)' }, ext);
    extT.textContent = '≈10¹⁰ ';
    S('tspan', { text: 'one model’s estimate', style: 'fill:var(--fg-2)' }, extT);
    S('line', { class: 'leader', x1: ex + 8, x2: L.labelX - 6, y1: y(1e10), y2: y(1e10) }, ext);
    el.ext = ext;

    // rungs as focusable rows (shared chart kit)
    const R = rows(pan, {
      items: RUNGS, x0: ax - 26, x1: W - 4, top: 0, rowH: L.rowH, labelW: 0, label: () => '',
      ariaLabel: (r) => `${r.value.replace('≈', 'about ').replace('≥', 'at least ').replace('<', 'fewer than ')}: ${r.label}`,
      name: 'Rungs of the ladder',
      selectable: (r) => RUNGS.indexOf(r) <= step,
      onSelect: (r) => { selId = r ? r.id : null; showCard(r); },
    });
    R.place((row) => y(row.item.v) - L.rowH / 2);
    R.rows.forEach((row) => {
      const r = row.item;
      const c = row.content;
      const col = kindColor(r.kind);
      const nLines = wrapText(r.label, L.wrap).length + (L.compact ? 1 : 0);
      const hh = Math.max(L.rowH - 6, nLines * 17 + 12);
      const hl = S('rect', { x: ax - 12, y: -hh / 2, width: W - ax + 4, height: hh, rx: 8, style: `stroke:${C.accent};fill:${C.accent};fill-opacity:0.045;stroke-opacity:0.75`, 'stroke-width': 1.4, opacity: 0 }, c);
      const bar = S('line', { x1: ax - 6, x2: ax + 32, y1: 0, y2: 0, style: `stroke:${col}`, 'stroke-width': 4, 'stroke-linecap': 'round' }, c);
      const ic = icon(r.icon, c, stage);
      ic.setAttribute('transform', `translate(${L.labelX - 30} 0)`);
      if (L.compact) ic.setAttribute('transform', `translate(${ax + 48} 0)`);
      const lines = wrapText(r.label, L.wrap);
      const n = lines.length + 0;
      const t = S('text', { class: 't-small t-halo', x: L.labelX, y: -((n) * 17) / 2 + 12 }, c);
      const v = S('tspan', { class: 'cn-val', x: L.labelX, text: r.value }, t);
      v.style.fill = col;
      // first label line continues after the value on wide layouts (sources: one line under the chart)
      if (!L.compact) {
        S('tspan', { text: `  ${lines[0]}`, style: 'fill:var(--fg)' }, t);
        lines.slice(1).forEach((ln) => S('tspan', { x: L.labelX, dy: 17, text: ln, style: 'fill:var(--fg-2)' }, t));
      } else {
        lines.forEach((ln, i) => S('tspan', { x: L.labelX, dy: i === 0 ? 18 : 17, text: ln, style: `fill:${i ? 'var(--fg-2)' : 'var(--fg)'}` }, t));
        t.setAttribute('y', -((lines.length + 1) * 17) / 2 + 12);
      }
      gsap.set(row.g, { opacity: 0 });
      el.rungs[r.id] = { row, hl, bar };
    });
    el.R = R;

    // legend (fixed, outside the pan group): gold = antibodies · blue = T cells
    const leg = S('g', { transform: `translate(${L.compact ? 16 : ax - 26} 26)` }, root);
    if (L.window) S('rect', { x: -16, y: -26, width: W, height: 48, style: `fill:${C.surface}` }, leg);
    const y1 = icon('y', leg, stage); y1.setAttribute('transform', 'translate(10 0)');
    S('text', { class: 't-small', x: 26, y: 0, dy: '0.35em', text: 'gold = antibodies', style: 'fill:var(--fg)' }, leg);
    const t1 = icon('tcell', leg, stage); t1.setAttribute('transform', `translate(${L.compact ? 172 : 172} 0) scale(0.8)`);
    S('text', { class: 't-small', x: L.compact ? 186 : 186, y: 0, dy: '0.35em', text: 'blue = T cells', style: 'fill:var(--fg)' }, leg);
    if (!L.compact) S('text', { class: 't-small t-muted', x: W - ax + 18, y: 0, dy: '0.35em', 'text-anchor': 'end', text: 'Each tick is 10 times the one below.' }, leg);
    else S('text', { class: 't-small t-muted', x: 0, y: 30, dy: '0.35em', text: 'Each tick is 10 times the one below.' }, leg);
    if (L.window) leg.setAttribute('transform', 'translate(16 22)');
    el.note = leg;

    // restore the selection (silently) after a rebuild
    if (selId && RUNGS.findIndex((r) => r.id === selId) <= step) R.select(selId, { silent: true });
  }

  function showCard(r) {
    if (!r) { F.card.hide({ silent: true }); return; }
    F.card.show({ kicker: r.kind === 'ab' ? 'Antibodies' : r.kind === 'tc' ? 'T cells' : 'Your genome', title: r.card.title, lines: r.card.lines, note: r.card.note, source: r.card.source });
  }

  // ---------------------------------------------------------------- steps
  const reveal = (tl, i) => {
    const r = RUNGS[i];
    const cur = el.rungs[r.id];
    // the previous current rung dims; earlier ones are already dim
    if (i > 0) {
      const prev = el.rungs[RUNGS[i - 1].id];
      tl.to(prev.row.g, { opacity: 0.5, duration: 0.5 }, 0);
      tl.to(prev.hl, { opacity: 0, duration: 0.4 }, 0);
      tl.to(prev.bar, { attr: { 'stroke-width': 4 }, duration: 0.4 }, 0);
    }
    if (L.window) tl.fromTo(el.pan, { attr: { transform: `translate(0 ${-panFor(Math.max(0, i - 1))})` } }, { attr: { transform: `translate(0 ${-panFor(i)})` }, duration: 0.9, ease: 'so.inOut' }, 0);
    const t0 = L.window ? 0.5 : 0.2;
    tl.fromTo(cur.row.g, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power1.out' }, t0);
    tl.fromTo(cur.bar, { attr: { x2: L.axisX - 14, 'stroke-width': 4 } }, { attr: { x2: L.axisX + 32, 'stroke-width': 6 }, duration: 0.6, ease: 'so.out' }, t0);
    tl.fromTo(cur.hl, { opacity: 0 }, { opacity: 1, duration: 0.5 }, t0 + 0.3);
    return t0 + 0.6;
  };
  const steps = [
    { enter(tl) { reveal(tl, 0); tl.fromTo(el.note, { opacity: 0.4 }, { opacity: 1, duration: 0.6 }, 0.1); } },
    { enter(tl) { reveal(tl, 1); } },
    { enter(tl) { reveal(tl, 2); } },
    {
      enter(tl) {
        tl.fromTo(el.climb.g, { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.1);
        tl.fromTo(el.climb.line, { drawSVG: '0% 0%' }, { drawSVG: '0% 100%', duration: 1.3, ease: 'so.inOut' }, 0.1);
        tl.fromTo([el.climb.head, el.climb.text], { opacity: 0 }, { opacity: 1, duration: 0.4 }, 1.2);
        reveal(tl, 3);
      },
    },
    { enter(tl) { reveal(tl, 4); tl.to(el.climb.g, { opacity: 0.3, duration: 0.4 }, 0); tl.fromTo(el.ratio, { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0.9); } },
    {
      enter(tl) {
        const t = reveal(tl, 5);
        tl.to(el.climb.g, { opacity: 0, duration: 0.4 }, 0);
        // let the gap breathe: step 5's call-out goes, the earlier rungs recede
        tl.to(el.ratio, { opacity: 0, duration: 0.5 }, 0);
        ['segments', 'genes', 'combos', 'cells'].forEach((id) => { if (el.rungs[id]) tl.to(el.rungs[id].row.g, { opacity: 0.35, duration: 0.5 }, 0); });
        tl.to(el.rungs.possible.row.g, { opacity: 1, duration: 0.6 }, t + 0.6);
        tl.fromTo(el.ext, { opacity: 0 }, { opacity: 1, duration: 0.6 }, t + 0.2);
        tl.fromTo(el.gap, { opacity: 0 }, { opacity: 1, duration: 0.8 }, t + 0.6);
      },
    },
  ];

  // ---------------------------------------------------------------- lifecycle
  draw();
  stepper = ctx.ui.stepper({
    steps,
    reset: draw,
    scene: F.main,
    onChange(i) {
      step = i;
      el.R.setInteractive((r) => RUNGS.indexOf(r) <= i);
      if (selId && RUNGS.findIndex((r) => r.id === selId) > i) { selId = null; F.card.hide({ silent: true }); }
    },
  });
  // keep the stepper and the rows in sync with layout and theme
  ctx.onResize(({ compact }) => {
    const next = compact ? LAYOUTS.compact : LAYOUTS.wide;
    if (next === L) return;
    L = next;
    stepper.rebuild();
  });
  ctx.onThemeChange(() => stepper.rebuild());

  return { destroy() { F.card.hide({ silent: true }); } };
}
