// ch06-antigen-kinds — "The target map"
//
// A light-stage trade-off map: x = how tumor-specific a target is, y = how many patients
// share it, marker size = how many cancers carry a target of that kind. Five example
// antigens start as chips in a tray; tapping one glides its marker onto the map and opens
// its detail card (foundation infoCard: beside the stage on wide figures, under it on
// phones). "Let me guess first" switches to drag mode (drop, then the marker glides to its
// real spot, with a one-line note when the guess was far off). "Show all" places the rest.
//
// The four writer captions run through ctx.ui.stepper; each step places the chips its
// caption describes. Stepper safety: every step tweens plain proxy objects (axes, focus
// band, per-chip "placed" progress); one renderer draws the scene from those proxies plus
// the reader's own placements (which live outside the timeline), so Back, dot jumps and
// reduced motion always land in the same state.
//
// Shares chip / card / axis styling with ch11-personal-vaccine (FIGURE-AUDIT §2G, same task).
// FIGURE-AUDIT §4 rule 4 overrides the spec's "HER2 = sand bead": HER2 is the library
// antigen() diamond on a stalk (a surface protein); peptide targets are beads, never on stalks.
import { virus, antigen, PALETTE } from '../art/index.js';
import { C, scale, chartRoot } from './shared/chart.js';
import { STATUS } from './shared/cycle-data.js';

const ID = 'ch06-antigen-kinds';
const SEL = `[data-figure="${ID}"]`;

// ------------------------------------------------------------------ chapter links
const CH = { 8: '08-checkpoints.html', 9: '09-antibodies.html', 10: '10-cell-therapy.html', 11: '11-vaccines.html' };
const ch = (n) => `<a href="${CH[n]}">Chapter ${n}</a>`;

// ------------------------------------------------------------------ the five targets (card text verbatim from the spec)
// x, y in 0–1 from the bottom-left; rx/ry = plausible range (halo); big = most cancers carry
// something of this kind. `step` = the caption (1-based) that places it.
const KINDS = [
  {
    id: 'neo', name: 'Personal neoantigen', kind: 'Neoantigen', glyph: 'bead', x: 0.92, y: 0.10, rx: [0.87, 0.97], ry: [0.05, 0.25], big: true, step: 2,
    pref: ['left', 'above-left', 'above'],
    what: 'A peptide from a mutated protein, unique to this patient’s tumor.',
    found: 'Nowhere — the mutation exists only in the tumor.',
    catch: 'Different in almost every patient, and most typos never reach the shop window.',
    // FIGURE-AUDIT §7.2: one string per recent claim — the phase 3 status comes from cycle-data STATUS.
    used: `<p>Personalized vaccines (${ch(11)}): ${STATUS['mrna-vaccine'].text}.</p><p>Also the target of much of the T-cell attack that checkpoint inhibitors make possible (approved, ${ch(8)}).</p>`,
  },
  {
    id: 'kras', name: 'KRAS G12D', kind: 'Shared neoantigen', glyph: 'beads', x: 0.90, y: 0.55, rx: [0.85, 0.95], ry: [0.47, 0.63], big: true, step: 2,
    pref: ['right', 'left', 'below-left', 'far-below-left'],
    what: 'A mutation that recurs at the same spot in many cancers: roughly 45% of pancreatic and 13% of colorectal cancers.',
    found: 'Nowhere.',
    // QA R2: no uniqueness claim for HLA-C*08:02 (HLA-A*11:01 presents G12D too, as an overlapping
    // fragment: Wang et al. 2016); the spec's wording is logged for the writer.
    catch: 'Each person’s HLA molecules decide whether the mutant peptide is displayed at all. The best-documented type, HLA-C*08:02, is carried by roughly 8% of white and 11% of Black Americans, and HLA-A*11:01 can display an overlapping peptide that carries the same mutation; many people’s types display it poorly or not at all.',
    used: `<p>Engineered T cells and vaccines (in trials, Chapters <a href="${CH[10]}">10</a>–<a href="${CH[11]}">11</a>).</p>`,
  },
  {
    id: 'hpv', name: 'HPV E6/E7', kind: 'Viral antigen', glyph: 'virus', x: 0.95, y: 0.80, rx: [0.91, 0.99], ry: [0.73, 0.87], big: false, step: 3,
    pref: ['right', 'left', 'above-left'],
    what: 'Proteins of a virus that drives the cancer.',
    found: 'Only in infected cells — never in healthy, uninfected tissue.',
    catch: 'Only virus-driven cancers have them, a minority of all cancers, and the tumors express them at low levels.',
    used: `<p>Therapeutic vaccines aimed at E6/E7 (in trials, ${ch(11)}); engineered T cells aimed at them are also in trials. Preventive HPV vaccines work differently: they are built from the virus’s shell protein and stop the infection in the first place (${ch(11)}).</p>`,
  },
  {
    id: 'ct', name: 'NY-ESO-1, MAGE-A4', lines: ['NY-ESO-1,', 'MAGE-A4'], kind: 'Cancer-testis antigen', glyph: 'crescent', x: 0.78, y: 0.70, rx: [0.70, 0.86], ry: [0.62, 0.78], big: false, step: 3,
    pref: ['left', 'below-left', 'far-below-left', 'above-left'],
    what: 'Proteins expressed almost nowhere in a healthy adult except in developing sperm cells, and reactivated in many cancers.',
    found: 'Sperm cells in the testis, which carry no MHC class I and so never display them; a few of this family also appear at low levels in the brain or placenta.',
    catch: 'Present in only some tumors, and often in only some of their cells.',
    used: `<p>Engineered T cells — afamitresgene autoleucel, which targets MAGE-A4, was approved in 2024 for synovial sarcoma (${ch(10)}).</p>`,
  },
  {
    id: 'her2', name: 'HER2', kind: 'Tumor-associated antigen', glyph: 'diamond', x: 0.30, y: 0.78, rx: [0.18, 0.42], ry: [0.70, 0.86], big: true, step: 4,
    pref: ['above', 'below', 'right'],
    what: 'A normal growth-signal receptor that some cancers express in huge excess.',
    found: `At low levels on many normal tissues — the lining of the lung and gut, and heart muscle, which is why HER2 drugs are watched for effects on the heart (${ch(9)}).`,
    catch: 'Attacking it can harm healthy tissue; in 2010 a patient died after engineered T cells aimed at HER2 apparently attacked the low levels of it in her lungs.',
    used: `<p>Antibody drugs such as trastuzumab (approved, ${ch(9)}). Melanoma’s pigment-making proteins (gp100, MART-1) belong to the same corner of the map: shared between patients, but present on healthy cells too.</p>`,
  },
];
const N = KINDS.length;
const STEP_CHIPS = [0, 1, 2, 3].map((i) => KINDS.map((k, j) => (k.step === i + 1 ? j : -1)).filter((j) => j >= 0));
// Guided focus per step: a soft dashed region on the map (0–1 coordinates), none on step 1.
const BANDS = [
  { x: [0.78, 1.0], y: [0.0, 1.0], o: 0 },
  { x: [0.80, 1.0], y: [0.0, 1.0], o: 1 },
  { x: [0.66, 1.0], y: [0.56, 1.0], o: 1 },
  { x: [0.0, 0.56], y: [0.58, 1.0], o: 1 },
];

// Entity colors per glyph (CSS tokens, so the light stage follows the page theme with no redraw).
const TONE = {
  bead: { fill: C.fill('neo-peptide'), stroke: C.stroke('neo-peptide') },
  beads: { fill: C.fill('neo-peptide'), stroke: C.stroke('neo-peptide') },
  virus: { fill: C.fill('virus'), stroke: C.stroke('virus') },
  crescent: { fill: C.fill('cancer'), stroke: C.stroke('cancer') },
  diamond: { fill: PALETTE.antigen, stroke: C.stroke('cancer') },
};

// ------------------------------------------------------------------ style (scoped, injected once)
const CSS = `
${SEL} .fig__stage { overflow: hidden; }
${SEL} .ak-wrap { position: relative; z-index: 1; display: flex; flex-direction: column; }
${SEL} .ak-wrap > svg { display: block; width: 100%; height: auto; overflow: visible; }
${SEL} .ak-top { padding: 14px 18px 0; }
${SEL} .ak-wrap.is-compact .ak-top { padding: 4px 12px 14px; }
${SEL} .ak-tray .chips__tray { gap: 8px; }
${SEL} .ak-tray .chip--card { flex: 0 0 auto; min-width: 0; padding: 6px 12px 6px 8px; align-items: center; gap: 8px; min-height: 48px; border-radius: 999px; text-align: left; touch-action: manipulation; }
${SEL} .ak-tray .chip--card .chip__label, ${SEL} .ak-tray .chip--card .chip__desc { white-space: nowrap; }
${SEL} .ak-wrap.is-compact .ak-tray .chips__tray { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
${SEL} .ak-wrap.is-compact .ak-tray .chip--card { padding: 6px 8px 6px 6px; gap: 6px; border-radius: 14px; }
${SEL} .ak-wrap.is-compact .ak-tray .chip--card .chip__label { font-size: 13px; white-space: normal; }
${SEL} .ak-wrap.is-compact .ak-tray .chip--card .chip__desc { font-size: 10px; letter-spacing: 0.04em; white-space: normal; }
${SEL} .ak-wrap.is-compact .ak-tray .ak-pill-glyph { width: 26px; height: 26px; }
${SEL} .ak-wrap.is-compact .ak-tray .ak-pill-check { display: none; }
${SEL} .ak-tray .chip--card .chip__label { font-size: 14px; line-height: 1.2; }
${SEL} .ak-tray .chip--card .chip__desc { font-size: 10.5px; font-weight: 650; letter-spacing: 0.08em; text-transform: uppercase; color: var(--fg-3); line-height: 1.2; }
${SEL} .ak-tray .chip[aria-pressed="true"] { background: color-mix(in srgb, var(--fg) 3%, transparent); border-color: var(--rule); box-shadow: none; }
${SEL} .ak-tray .chip[aria-pressed="true"] .chip__label { color: var(--fg-2); }
${SEL} .ak-tray .chip[aria-pressed="true"] .ak-pill-glyph { opacity: 0.35; }
${SEL} .ak-tray .chip.is-selected { border-color: var(--accent); box-shadow: inset 0 0 0 1px var(--accent); }
${SEL} .ak-tray .ak-pill-glyph { flex: none; width: 30px; height: 30px; overflow: visible; }
${SEL} .ak-tray .ak-pill-check { flex: none; width: 16px; height: 16px; margin-left: 2px; color: var(--yes); opacity: 0; }
${SEL} .ak-tray .chip[aria-pressed="true"] .ak-pill-check { opacity: 1; }
${SEL} .ak-wrap.is-drag .ak-tray .chip:not([aria-pressed="true"]) { cursor: grab; touch-action: none; }
${SEL} .ak-wrap.is-dragging, ${SEL} .ak-wrap.is-dragging * { cursor: grabbing !important; }
${SEL} .ak-note { min-height: 1.35em; margin: 6px 2px 0; font: 500 13px/1.35 var(--font-ui); color: var(--fg-2); }
${SEL} .ak-note:empty::before { content: "\\00a0"; }
${SEL} .ak-marker { cursor: pointer; }
@container fig (min-width: 900px) {
  ${SEL} .fig__main.has-side > .info-card.is-open { align-self: stretch; height: 0; min-height: 100%; overflow: auto; }
}
${SEL} .ak-card dl { margin: 0; }
${SEL} .ak-card dt { margin: 0.7em 0 0.1em; font: 650 0.7rem/1.3 var(--font-ui); letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-3); }
${SEL} .ak-card dt:first-child { margin-top: 0.2em; }
${SEL} .ak-card dd { margin: 0; }
${SEL} .ak-card dd p { margin: 0; }
${SEL} .ak-card dd p + p { margin-top: 0.4em; }
${SEL} .ak-card .ak-size { display: flex; align-items: center; gap: 0.45em; margin: 0 0 0.2em; font: 500 0.8rem/1.35 var(--font-ui); color: var(--ink-2); }
${SEL} .ak-card .ak-size svg { flex: none; }
`;
function injectCSS() {
  if (document.getElementById(`${ID}-css`)) return;
  const s = document.createElement('style');
  s.id = `${ID}-css`;
  s.textContent = CSS;
  document.head.append(s);
}

// ------------------------------------------------------------------ glyphs
const NS = 'http://www.w3.org/2000/svg';
const f1 = (v) => Math.round(v * 10) / 10;
function sv(tag, attrs = {}, parent) {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) if (v != null) e.setAttribute(k, v);
  if (parent) parent.append(e);
  return e;
}
/** A peptide bead with a small notch (a "typo"), centered, radius r. */
function notchedBeadD(r) {
  const pts = [];
  const notch = -Math.PI / 3;             // upper right
  for (let i = 0; i < 40; i++) {
    const a = notch + (i / 40) * Math.PI * 2;
    const d = Math.abs(Math.atan2(Math.sin(a - notch), Math.cos(a - notch)));
    const rr = d < 0.32 ? r * (0.62 + 0.38 * (d / 0.32)) : r;
    pts.push([Math.cos(a) * rr, Math.sin(a) * rr]);
  }
  return `M${pts.map((p) => `${f1(p[0])} ${f1(p[1])}`).join('L')}Z`;
}
/**
 * Draw the glyph of one target kind, centered at (0,0), fitting radius r.
 * Peptide-derived targets are beads (never on stalks); HER2 is the library antigen() diamond
 * on a stalk with a scrap of membrane; HPV uses the library virus().
 */
function glyph(kind, r, stage) {
  const g = sv('g', { class: `ak-glyph ak-glyph--${kind}` });
  const T = TONE[kind];
  if (kind === 'bead' || kind === 'beads') {
    const br = kind === 'beads' ? r * 0.5 : r * 0.62;
    if (kind === 'beads') {
      // "shared by many": the same bead, stacked
      for (const [dx, dy] of [[-0.46, 0.34], [0.46, 0.34]]) {
        sv('circle', { cx: f1(dx * r), cy: f1(dy * r), r: f1(br * 0.86), style: `fill:${T.fill};fill-opacity:0.42;stroke:${T.stroke};stroke-width:1` }, g);
      }
    }
    const oy = kind === 'beads' ? -r * 0.16 : 0;
    sv('path', { d: notchedBeadD(br), transform: `translate(0 ${f1(oy)})`, style: `fill:${T.fill};stroke:${T.stroke};stroke-width:1.2;stroke-linejoin:round` }, g);
    sv('circle', { cx: f1(-br * 0.3), cy: f1(oy - br * 0.32), r: f1(br * 0.26), style: 'fill:#fff;fill-opacity:0.55' }, g);
  } else if (kind === 'virus') {
    const v = virus({ r: r * 0.56, spikes: 10, seed: 3, stage, glow: false });
    g.append(v);
  } else if (kind === 'crescent') {
    const R = r * 0.66;
    const d = `M${f1(R * 0.25)} ${f1(-R)}A${f1(R)} ${f1(R)} 0 1 0 ${f1(R * 0.25)} ${f1(R)}A${f1(R * 0.78)} ${f1(R * 0.78)} 0 1 1 ${f1(R * 0.25)} ${f1(-R)}Z`;
    sv('path', { d, transform: `rotate(-18) translate(${f1(-R * 0.12)} 0)`, style: `fill:${T.fill};stroke:${T.stroke};stroke-width:1.2;stroke-linejoin:round` }, g);
  } else if (kind === 'diamond') {
    const size = r * 1.32;
    const yb = r * 0.6;
    sv('path', { d: `M${f1(-r * 0.62)} ${f1(yb + 1.5)}Q0 ${f1(yb - 1.5)} ${f1(r * 0.62)} ${f1(yb + 1.5)}`, style: `fill:none;stroke:${C.fill('healthy')};stroke-width:3;stroke-linecap:round` }, g);
    const a = antigen({ shape: 'diamond', size, stage, detail: 'high' });
    a.setAttribute('transform', `translate(0 ${f1(yb)})`);
    g.append(a);
  }
  return g;
}

// ------------------------------------------------------------------ text measuring (label placement)
let mctx = null;
function textW(text, font, spacingEm = 0, px = 12) {
  mctx ||= document.createElement('canvas').getContext('2d');
  mctx.font = font;
  return mctx.measureText(text).width + spacingEm * px * text.length;
}

// ================================================================== FIGURE
export default function mount(fig, ctx) {
  injectCSS();
  ctx.setAspect('auto');
  const { gsap } = ctx;
  ctx.tag('Illustrative', 'bottom-right');

  // ---------------------------------------------------------------- DOM: wrapper, tray, svg, note
  const wrap = ctx.h('div', { class: 'ak-wrap' });
  ctx.stage.append(wrap);
  const top = ctx.h('div', { class: 'ak-top' });
  const tray = ctx.h('div', { class: 'ak-tray' });
  const note = ctx.h('p', { class: 'ak-note', 'aria-live': 'polite' });
  top.append(tray, note);
  const svg = ctx.createSVG({ viewBox: '0 0 800 520', parent: wrap });
  svg.classList.add('ak-map');
  const root = chartRoot(svg, { theme: 'light' });

  // ---------------------------------------------------------------- state
  // Timeline-owned proxies (stepper): axes, band, placed[k]. Reader-owned: manual[k] (standalone
  // tweens), drop points and the drag ghost. Rendering reads both; nothing else holds state.
  let pending = false;
  const schedule = () => { if (!pending) { pending = true; queueMicrotask(() => { pending = false; render(); }); } };
  const proxy = (v0 = 0) => { let v = v0; return { get p() { return v; }, set p(x) { v = x; schedule(); } }; };
  const S = { axes: proxy(0), band: proxy(0) };
  const placed = KINDS.map(() => proxy(0));
  const manual = KINDS.map(() => proxy(0));
  const manualTw = KINDS.map(() => null);
  const drop = KINDS.map(() => null);       // { x, y } svg coords of a guessed drop (glide starts there)
  let drag = null;                           // { k, x, y } while dragging
  let selected = -1;
  let dragMode = false;
  const reduced = () => ctx.reducedMotion;

  // ---------------------------------------------------------------- tray (foundation chips, card variant)
  const chips = ctx.ui.chips({
    label: 'Targets to place on the map',
    hideLabel: true,
    variant: 'card',
    multi: true,
    parent: tray,
    options: KINDS.map((k) => ({ value: k.id, label: k.name, desc: k.kind })),
    onChange: (vals, { option }) => {
      const k = KINDS.findIndex((x) => x.id === option?.value);
      paintPills();                 // aria-pressed mirrors "on the map", never the click toggle
      if (k < 0 || suppressClick) return;
      if (isOn(k)) select(k, { user: true });
      else placeManual(k, { open: true });
    },
  });
  let suppressClick = false;
  const pillGlyphs = [];
  KINDS.forEach((k, i) => {
    const b = chips.buttons.get(k.id);
    b.setAttribute('aria-label', `${k.name}, ${k.kind}`);
    // never break inside "NY-ESO-1" or "Tumor-associated" when the pill text wraps on phones
    for (const sel of ['.chip__label', '.chip__desc']) {
      const t = b.querySelector(sel);
      if (t) t.innerHTML = t.textContent.split(' ').map((w) => `<span style="white-space:nowrap">${w}</span>`).join(' ');
    }
    const s = sv('svg', { class: 'ak-pill-glyph ck ck--light', viewBox: '-15 -15 30 30', 'aria-hidden': 'true', focusable: 'false' });
    b.prepend(s);
    pillGlyphs[i] = s;
    const chk = sv('svg', { class: 'ak-pill-check', viewBox: '0 0 16 16', 'aria-hidden': 'true', focusable: 'false' });
    sv('path', { d: 'M3.5 8.5l3 3 6-7', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, chk);
    b.append(chk);
    bindDrag(b, i);
  });

  // ---------------------------------------------------------------- info card
  const card = ctx.ui.infoCard({ width: '23rem', empty: 'Tap a target to place it on the map and read its card.' });
  card.el.classList.add('ak-card');
  const sizeIcon = (big) => `<svg width="22" height="22" viewBox="-11 -11 22 22" aria-hidden="true"><circle r="${big ? 9.5 : 6}" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`;
  function cardBody(k) {
    return `<p class="ak-size">${sizeIcon(k.big)}<span>${k.big ? 'Large marker: most cancers carry a target of this kind.' : 'Small marker: only some cancers carry it.'}</span></p>`
      + `<dl><dt>What it is</dt><dd><p>${k.what}</p></dd><dt>Found in healthy tissue</dt><dd><p>${k.found}</p></dd>`
      + `<dt>The catch</dt><dd><p>${k.catch}</p></dd><dt>Used by</dt><dd>${k.used}</dd></dl>`;
  }
  function select(k, { user = false } = {}) {
    selected = k;
    if (k < 0) card.hide();
    else card.show({ kicker: KINDS[k].kind, title: KINDS[k].name, body: cardBody(KINDS[k]), scroll: user && ctx.compact });
    paintPills();
    schedule();
  }

  // ---------------------------------------------------------------- controls (after the stepper)
  const isOn = (k) => Math.max(placed[k].p, manual[k].p) > 0.5;
  function placeManual(k, { open = false, delay = 0, from = null } = {}) {
    drop[k] = from;
    manualTw[k]?.kill();
    if (reduced()) { manual[k].p = 1; manualTw[k] = null; }
    else manualTw[k] = gsap.fromTo(manual[k], { p: 0 }, { p: 1, duration: from ? 0.55 : 0.42, delay, ease: 'so.inOut' });
    if (open) select(k, { user: true });
    ctx.announce(`${KINDS[k].name} placed on the map.`);
  }
  function showAll() {
    let d = 0;
    KINDS.forEach((k, i) => { if (!isOn(i)) { placeManual(i, { delay: d }); d += 0.12; } });
    paintPills();
  }
  function clearMine() {
    KINDS.forEach((k, i) => {
      manualTw[i]?.kill();
      drop[i] = null;
      if (reduced() || manual[i].p === 0) manual[i].p = 0;
      else manualTw[i] = gsap.to(manual[i], { p: 0, duration: 0.35, ease: 'so.inOut' });
    });
    note.textContent = '';
    if (selected >= 0 && placed[selected].p < 0.5) select(-1);
    paintPills();
  }

  // ---------------------------------------------------------------- map geometry
  let L = null;
  function layout() {
    const W = Math.max(300, Math.round(wrap.clientWidth || ctx.width || 800));
    const compact = W < 600;
    let x0, x1, y0, y1, H, legend;
    if (!compact) {
      x0 = 54;
      const pw = Math.min(500, W - x0 - 250);
      x1 = x0 + pw;
      y0 = 40;
      y1 = y0 + Math.round(Math.min(pw * 0.8, 390));
      H = y1 + 92;
      legend = { x: x1 + 44, y: y1 - 78, row: false };
    } else {
      x0 = 14;
      x1 = W - 14;
      y0 = 46;
      y1 = y0 + Math.round(Math.min(x1 - x0, 360));
      H = y1 + 168;
      legend = { x: x0, y: y1 + 112, row: true };
    }
    const sx = scale({ domain: [0, 1], range: [x0, x1] });
    const sy = scale({ domain: [0, 1], range: [y1, y0] });
    return { W, H, compact, x0, x1, y0, y1, sx, sy, legend, R: compact ? [17, 10.5] : [21, 13] };
  }

  // ---------------------------------------------------------------- static map (rebuilt on resize / theme)
  let G = {};
  function build() {
    L = layout();
    const { W, H, compact, x0, x1, y0, y1, sx, sy } = L;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    wrap.classList.toggle('is-compact', compact);
    if (compact) wrap.append(top); else wrap.prepend(top);
    root.replaceChildren();
    for (const n of [...svg.defs.children]) n.remove();
    const mk = (tag, attrs, p = root) => ctx.svg(tag, attrs, p);
    // ideal corner: a faint gold wash (radial gradient from the top-right corner)
    const wash = ctx.radialGradient(svg, [[0, ctx.colors.antibody, 0.34], [0.55, ctx.colors.antibody, 0.12], [1, ctx.colors.antibody, 0]], { cx: '100%', cy: '0%', r: '100%' });
    const gAxes = mk('g', { class: 'ak-axes' });
    mk('rect', { x: x0, y: y0, width: x1 - x0, height: y1 - y0, rx: 6, style: `fill:color-mix(in srgb, var(--fg) 2.2%, transparent)` }, gAxes);
    const ww = (x1 - x0) * 0.46, wh = (y1 - y0) * 0.5;
    mk('rect', { x: x1 - ww, y: y0, width: ww, height: wh, fill: wash, rx: 6 }, gAxes);
    // quiet midlines
    mk('line', { x1: sx(0.5), x2: sx(0.5), y1: y0 + 4, y2: y1 - 4, style: `stroke:${C.grid};stroke-dasharray:3 5;stroke-width:1` }, gAxes);
    mk('line', { x1: x0 + 4, x2: x1 - 4, y1: sy(0.5), y2: sy(0.5), style: `stroke:${C.grid};stroke-dasharray:3 5;stroke-width:1` }, gAxes);
    // axes with arrowheads
    const ax = `stroke:${C.ink2};stroke-width:1.4;fill:none;stroke-linecap:round;stroke-linejoin:round`;
    mk('path', { d: `M${x0} ${y1}H${x1 + 10}M${x1 + 4} ${y1 - 5}L${x1 + 10} ${y1}L${x1 + 4} ${y1 + 5}`, style: ax }, gAxes);
    mk('path', { d: `M${x0} ${y1}V${y0 - 10}M${x0 - 5} ${y0 - 4}L${x0} ${y0 - 10}L${x0 + 5} ${y0 - 4}`, style: ax }, gAxes);
    // axis words (plain language, no numeric ticks)
    const txt = (x, y, text, cls, anchor = 'start', p = gAxes) => mk('text', { x, y, class: cls, 'text-anchor': anchor, text }, p);
    txt(x0, y1 + 20, 'Also on healthy cells', 't-small');
    txt(x1 + 10, y1 + 20, 'Only on cancer cells', 't-small', 'end');
    txt((x0 + x1) / 2, y1 + 44, 'Where else is it found?', 't-caps', 'middle');
    txt(x0 - (compact ? 4 : 10), y0 - 22, 'How many patients share it?', 't-caps');
    txt(x0 + 10, y0 + 18, 'Many patients', 't-small');
    txt(x0 + 10, y1 - 10, 'One patient', 't-small');
    // ideal corner label (inside the wash)
    const star = (cx, cy, r) => { const p = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5; const rr = i % 2 ? r * 0.45 : r; p.push(`${f1(cx + Math.cos(a) * rr)} ${f1(cy + Math.sin(a) * rr)}`); } return `M${p.join('L')}Z`; };
    const iw = textW('IDEAL TARGETS', '650 12px Inter', 0.08, 12);
    mk('path', { d: star(x1 - 12 - iw - 12, y0 + 14, 6.5), style: `fill:${C.fill('antibody')};stroke:${C.stroke('antibody')};stroke-width:1` }, gAxes);
    txt(x1 - 12, y0 + 18, 'Ideal targets', 't-caps', 'end');
    // note under the map
    if (compact) {
      txt(x0, y1 + 68, 'Positions are approximate and vary by', 't-small t-muted');
      txt(x0, y1 + 86, 'tumor and patient.', 't-small t-muted');
    } else txt(x0, y1 + 68, 'Positions are approximate and vary by tumor and patient.', 't-small t-muted');
    // size legend
    const lg = mk('g', { class: 'ak-legend' }, gAxes);
    const { x: lx, y: ly, row } = L.legend;
    txt(lx, ly, 'Marker size', 't-caps', 'start', lg);
    const [RB, RS] = L.R;
    const disc = (cx, cy, r) => mk('circle', { cx, cy, r, style: `fill:none;stroke:${C.ink2};stroke-width:1.4` }, lg);
    if (!row) {
      disc(lx + RB, ly + 14 + RB, RB);
      txt(lx + RB * 2 + 10, ly + 14 + RB + 5, 'Most cancers carry one', 't-small', 'start', lg);
      disc(lx + RB, ly + 14 + RB * 2 + 10 + RS, RS);
      txt(lx + RB * 2 + 10, ly + 14 + RB * 2 + 10 + RS + 5, 'Only some cancers', 't-small', 'start', lg);
    } else {
      disc(lx + RB, ly + 12 + RB, RB);
      txt(lx + RB * 2 + 8, ly + 12 + RB + 5, 'Most cancers carry one', 't-small', 'start', lg);
      const x2 = lx + RB * 2 + 8 + textW('Most cancers carry one', '500 13px Inter') + 18;
      disc(x2 + RS, ly + 12 + RB, RS);
      txt(x2 + RS * 2 + 8, ly + 12 + RB + 5, 'Only some', 't-small', 'start', lg);
    }
    // guided focus band
    const gBand = mk('rect', { rx: 10, style: `fill:${C.accent};fill-opacity:0.045;stroke:${C.accent};stroke-opacity:0.42;stroke-width:1.3;stroke-dasharray:5 5`, opacity: 0 });
    // halos (behind), markers, labels
    const gHalo = mk('g', {});
    const gMark = mk('g', {});
    const gLab = mk('g', {});
    const items = KINDS.map((k, i) => {
      const T = TONE[k.glyph];
      const R = k.big ? L.R[0] : L.R[1];
      const halo = mk('ellipse', {
        cx: f1((sx(k.rx[0]) + sx(k.rx[1])) / 2), cy: f1((sy(k.ry[0]) + sy(k.ry[1])) / 2),
        rx: f1(Math.max(R + 6, (sx(k.rx[1]) - sx(k.rx[0])) / 2)), ry: f1(Math.max(R + 6, (sy(k.ry[0]) - sy(k.ry[1])) / 2)),
        style: `fill:${T.fill};fill-opacity:0.13;stroke:${T.stroke};stroke-opacity:0.32;stroke-width:1;stroke-dasharray:2 3`, opacity: 0,
      }, gHalo);
      const m = mk('g', { class: 'ak-marker', 'data-chip': k.id, opacity: 0 }, gMark);
      const inner = mk('g', {}, m);
      mk('circle', { r: R + 7, fill: 'transparent' }, inner);           // hit area (≥ 40 px with the disc)
      const ring = mk('circle', { r: R + 4.5, style: `fill:none;stroke:${C.accent};stroke-width:2`, opacity: 0 }, inner);
      mk('circle', { r: R, style: `fill:${C.surface};stroke:${T.stroke};stroke-opacity:0.6;stroke-width:1.5` }, inner);
      inner.append(glyph(k.glyph, R * 1.0, ctx.artStage));
      m.addEventListener('click', () => select(i, { user: true }));
      const lab = mk('g', { opacity: 0, class: 'ak-label' }, gLab);
      return { k, R, halo, m, inner, ring, lab };
    });
    // label placement: greedy, most constrained first, avoiding markers, other labels and edges;
    // a label that can't sit beside its marker moves diagonally and gets a leader line
    const boxes = [];
    const markerBox = (it) => ({ x: sx(it.k.x) - it.R - 3, y: sy(it.k.y) - it.R - 3, w: it.R * 2 + 6, h: it.R * 2 + 6 });
    const fixed = [
      { x: x0 + 6, y: y0 + 2, w: textW('Many patients', '500 13px Inter') + 8, h: 22 },
      { x: x0 + 6, y: y1 - 26, w: textW('One patient', '500 13px Inter') + 8, h: 22 },
      { x: x1 - 12 - iw - 22, y: y0 + 2, w: iw + 24, h: 22 },
    ];
    const ov = (a, b) => Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));
    const order = ['hpv', 'her2', 'ct', 'kras', 'neo'];
    for (const id of order) {
      const it = items.find((q) => q.k.id === id);
      const { k, R } = it;
      const mx = sx(k.x), my = sy(k.y);
      const lines = compact && k.lines ? k.lines : [k.name];
      const nameW = Math.max(...lines.map((t) => textW(t, '560 15px Inter')));
      // phones: names only on the map (the tray right below and the card carry the kind)
      const kindW = compact ? 0 : textW(k.kind.toUpperCase(), '650 11px Inter', 0.08, 11);
      const w = Math.max(nameW, kindW), h = lines.length * 17 + (compact ? 1 : 15);
      const g = 8;
      const cands = [
        ['right', { x: mx + R + g, y: my - h / 2 }],
        ['left', { x: mx - R - g - w, y: my - h / 2 }],
        ['above', { x: mx - w / 2, y: my - R - 6 - h }],
        ['below', { x: mx - w / 2, y: my + R + 6 }],
        ['below-left', { x: mx - R * 0.4 - w, y: my + R * 0.7 }, true],
        ['above-left', { x: mx - R * 0.4 - w, y: my - R * 0.7 - h }, true],
        ['below-right', { x: mx + R * 0.4, y: my + R * 0.7 }, true],
        ['above-right', { x: mx + R * 0.4, y: my - R * 0.7 - h }, true],
        ['far-below-left', { x: mx - R * 0.4 - w, y: my + R + 10 }, true],
        ['far-left', { x: mx - R - 34 - w, y: my - h / 2 }, true],
      ];
      let best = null;
      cands.forEach(([side, b, diag], ci) => {
        b.w = w; b.h = h;
        const pi = k.pref.indexOf(side);
        let score = (pi >= 0 ? pi * 30 : 160 + ci * 12);
        for (const o of boxes) score += ov(b, o) * 6;
        for (const o of fixed) score += ov(b, o) * 4;
        for (const q of items) score += ov(b, markerBox(q)) * (q === it ? 8 : 6);
        score += Math.max(0, 4 - b.x) * 500 + Math.max(0, b.x + b.w - (W - 4)) * 500 + Math.max(0, y0 - 30 - b.y) * 500;
        score += Math.max(0, b.y + b.h - (y1 - 2)) * 40;
        if (!best || score < best.score) best = { ...b, side, diag, score };
      });
      boxes.push(best);
      const leftish = best.side.includes('left'), rightish = best.side.includes('right');
      const anchor = leftish ? 'end' : rightish ? 'start' : 'middle';
      const tx = leftish ? best.x + best.w : rightish ? best.x : best.x + best.w / 2;
      if (best.diag) {
        // leader from the marker's rim to the nearest corner of the label block
        const cx = leftish ? best.x + best.w + 3 : best.x - 3;
        const cy = best.y + (best.y > my ? 4 : best.h - 4);
        const a = Math.atan2(cy - my, cx - mx);
        mk('path', { class: 'leader', d: `M${f1(mx + Math.cos(a) * (R + 3))} ${f1(my + Math.sin(a) * (R + 3))}L${f1(cx)} ${f1(cy)}` }, it.lab);
      }
      lines.forEach((t, li) => mk('text', { x: f1(tx), y: f1(best.y + 13 + li * 17), class: 't-label t-halo', 'text-anchor': anchor, text: t }, it.lab));
      if (!compact) mk('text', { x: f1(tx), y: f1(best.y + 28), class: 't-caps t-halo ak-kind', 'text-anchor': anchor, text: k.kind, style: 'font-size:11px' }, it.lab);
    }
    G = { gAxes, gBand, items };
    // pills' glyphs (art follows the page theme)
    pillGlyphs.forEach((s, i) => { s.replaceChildren(glyph(KINDS[i].glyph, 13.5, ctx.artStage)); });
    requestAnimationFrame(() => { measureTray(); render(); });
    render();
  }

  // tray glyph centers in svg coordinates (1 unit = 1 px)
  let trayPos = KINDS.map(() => ({ x: 0, y: -40 }));
  function measureTray() {
    const r = svg.getBoundingClientRect();
    if (!r.width) return;
    const u = (L?.W || r.width) / r.width;
    trayPos = pillGlyphs.map((s) => {
      const b = s.getBoundingClientRect();
      return { x: (b.left + b.width / 2 - r.left) * u, y: (b.top + b.height / 2 - r.top) * u };
    });
  }

  // ---------------------------------------------------------------- render (pure: proxies + reader state → DOM)
  const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  const clamp01 = (v) => Math.max(0, Math.min(1, v));
  function render() {
    if (!L || !G.items) return;
    const { sx, sy } = L;
    G.gAxes.setAttribute('opacity', f1(S.axes.p * 100) / 100);
    // focus band
    const b = Math.max(0, Math.min(BANDS.length - 1, S.band.p));
    const i0 = Math.floor(b), i1 = Math.min(BANDS.length - 1, i0 + 1), t = b - i0;
    const A = BANDS[i0], B = BANDS[i1];
    const lerp = (a, c) => a + (c - a) * t;
    const bx0 = lerp(A.x[0], B.x[0]), bx1 = lerp(A.x[1], B.x[1]), by0 = lerp(A.y[0], B.y[0]), by1 = lerp(A.y[1], B.y[1]);
    const pad = 6;
    G.gBand.setAttribute('x', f1(sx(bx0) - pad + (bx0 === 0 ? pad + 2 : 0)));
    G.gBand.setAttribute('y', f1(sy(by1) - pad + (by1 === 1 ? pad + 2 : 0)));
    G.gBand.setAttribute('width', f1(sx(bx1) - sx(bx0) + 2 * pad - (bx0 === 0 ? pad + 2 : 0) - (bx1 === 1 ? pad + 2 : 0)));
    G.gBand.setAttribute('height', f1(sy(by0) - sy(by1) + 2 * pad - (by1 === 1 ? pad + 2 : 0) - (by0 === 0 ? pad + 2 : 0)));
    G.gBand.setAttribute('opacity', f1(lerp(A.o, B.o) * S.axes.p * 100) / 100);
    // markers
    G.items.forEach((it, i) => {
      const k = it.k;
      const tx = sx(k.x), ty = sy(k.y);
      let x, y, sc, op, lab, halo;
      if (drag && drag.k === i) {
        x = drag.x; y = drag.y; sc = 1; op = 1; lab = 0; halo = 0;
      } else {
        const pm = manual[i].p, ps = placed[i].p;
        const p = Math.max(pm, ps);
        const from = pm >= ps && drop[i] ? drop[i] : trayPos[i];
        const e = ease(clamp01(p));
        x = from.x + (tx - from.x) * e;
        y = from.y + (ty - from.y) * e;
        const r0 = from === drop[i] ? it.R : 13.5;
        sc = (r0 + (it.R - r0) * e) / it.R;
        op = clamp01(p * 6);
        lab = clamp01((p - 0.78) / 0.22);
        halo = clamp01((p - 0.55) / 0.45);
      }
      it.m.setAttribute('transform', `translate(${f1(x)} ${f1(y)}) scale(${Math.round(sc * 100) / 100})`);
      it.m.setAttribute('opacity', f1(op * 100) / 100);
      it.m.style.pointerEvents = op > 0.5 ? '' : 'none';
      it.lab.setAttribute('opacity', f1(lab * 100) / 100);
      it.halo.setAttribute('opacity', f1(halo * (selected === i ? 1 : 0.75) * 100) / 100);
      it.ring.setAttribute('opacity', selected === i && lab > 0.5 ? 1 : 0);
    });
    paintPills();
  }
  function paintPills() {
    const on = KINDS.filter((k, i) => isOn(i)).map((k) => k.id);
    const cur = chips.value || [];
    if (on.length !== cur.length || on.some((v) => !cur.includes(v))) chips.set(on);
    KINDS.forEach((k, i) => chips.buttons.get(k.id).classList.toggle('is-selected', selected === i));
  }

  // ---------------------------------------------------------------- drag mode ("Let me guess first")
  function bindDrag(btn, k) {
    let start = null;
    btn.addEventListener('pointerdown', (e) => {
      if (!dragMode || isOn(k) || e.button > 0) return;
      start = { x: e.clientX, y: e.clientY, id: e.pointerId };
    }, { signal: ctx.signal });
    btn.addEventListener('pointermove', (e) => {
      if (!start || e.pointerId !== start.id) return;
      if (!drag && Math.hypot(e.clientX - start.x, e.clientY - start.y) < 6) return;
      if (!drag) { try { btn.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ } wrap.classList.add('is-dragging'); }
      const p = toSvg(e.clientX, e.clientY);
      drag = { k, x: p.x, y: p.y };
      e.preventDefault();
      render();
    }, { signal: ctx.signal });
    const end = (e) => {
      if (!start || (e && e.pointerId !== start.id)) return;
      start = null;
      wrap.classList.remove('is-dragging');
      if (!drag) return;
      const d = drag;
      drag = null;
      suppressClick = true;
      setTimeout(() => { suppressClick = false; }, 0);
      const { x0, x1, y0, y1 } = L;
      const inside = e && e.type === 'pointerup' && d.x > x0 - 20 && d.x < x1 + 20 && d.y > y0 - 20 && d.y < y1 + 20;
      if (!inside) { note.textContent = 'Drop it inside the map.'; render(); return; }
      const gx = clamp01((d.x - x0) / (x1 - x0)), gy = clamp01((y1 - d.y) / (y1 - y0));
      const kk = KINDS[k];
      const off = Math.hypot(gx - kk.x, gy - kk.y);
      note.textContent = off > 0.25 ? farNote(kk, gx, gy) : `Good guess: ${kk.name} belongs close to where you put it.`;
      manual[k].p = 0;
      placeManual(k, { open: true, from: { x: d.x, y: d.y }, delay: reduced() ? 0 : 0.3 });
    };
    btn.addEventListener('pointerup', end, { signal: ctx.signal });
    btn.addEventListener('pointercancel', end, { signal: ctx.signal });
  }
  function farNote(k, gx, gy) {
    const parts = [];
    if (k.x - gx > 0.15) parts.push('further right (more specific to cancer)');
    else if (gx - k.x > 0.15) parts.push('further left (healthy cells carry it too)');
    if (k.y - gy > 0.15) parts.push('higher (shared by more patients)');
    else if (gy - k.y > 0.15) parts.push('lower (shared by fewer patients)');
    return `Not quite: ${k.name} sits ${parts.join(' and ') || 'elsewhere'}.`;
  }
  function toSvg(cx, cy) {
    const r = svg.getBoundingClientRect();
    const u = L.W / r.width;
    return { x: (cx - r.left) * u, y: (cy - r.top) * u };
  }

  // ---------------------------------------------------------------- stepper (guided), then free
  const stepper = ctx.ui.stepper({
    scene: svg,
    steps: [
      { enter(tl) { tl.fromTo(S.axes, { p: 0 }, { p: 1, duration: 0.8, ease: 'so.out' }); tl.fromTo(S.band, { p: 0 }, { p: 0, duration: 0.01 }, 0); } },
      ...[1, 2, 3].map((s) => ({
        enter(tl) {
          tl.fromTo(S.band, { p: s - 1 }, { p: s, duration: 0.7 }, 0);
          STEP_CHIPS[s].forEach((j, n) => tl.fromTo(placed[j], { p: 0 }, { p: 1, duration: 0.6, ease: 'so.inOut' }, 0.15 + n * 0.18));
        },
      })),
    ],
    onChange(i) {
      const first = STEP_CHIPS[i][0];
      select(first ?? -1);
    },
  });

  const row = ctx.ui.group({ className: 'ak-actions' });
  const guessBtn = ctx.ui.button({
    label: 'Let me guess first', variant: 'ghost', small: true, parent: row, pressed: false,
    onClick: () => {
      dragMode = !dragMode;
      wrap.classList.toggle('is-drag', dragMode);
      guessBtn.pressed = dragMode;
      guessBtn.label = dragMode ? 'Place them for me' : 'Let me guess first';
      note.textContent = dragMode ? 'Drag a target onto the map where you think it belongs.' : '';
    },
  });
  ctx.ui.button({ label: 'Show all', variant: 'ghost', small: true, parent: row, onClick: showAll });
  ctx.ui.button({ label: 'Reset', icon: 'reset', variant: 'ghost', small: true, parent: row, onClick: clearMine });

  // ---------------------------------------------------------------- lifecycle
  let lastW = 0;
  ctx.onResize(() => {
    const W = Math.round(wrap.clientWidth || ctx.width);
    if (Math.abs(W - lastW) < 2) { measureTray(); render(); return; }
    lastW = W;
    build();
  });
  ctx.onThemeChange(() => build());
  if (document.fonts?.ready) document.fonts.ready.then(() => { if (!ctx.signal.aborted) build(); });
  build();
  ctx.cleanup(() => { manualTw.forEach((t) => t?.kill()); });
  return { stepper };
}
