// ch12-resistance — "Where the cycle breaks" (Chapter 12). FIGURE-AUDIT §2B: this figure
// DIAGNOSES (ch07-cycle learns the steps, ch12-combinations treats). It is led by its
// vignette; the shared cycle wheel (density 'locator', no tour) only locates the break.
//
//   • Seven mechanism chips (radiogroup). Titles, subtitles, wheel states and outcome badges
//     come from shared/cycle-data.js MECHANISMS (single source); captions are the writer's.
//   • One "Add anti-PD-1" switch (resets on every chip change): gold drug antibodies cap PD-1
//     on T cells only; the wheel shows the anti-PD-1 rings (acts 6–7, also 3) from cycle-data.
//   • Vignettes are small timelines built with shared/cell-actions (stepper-safe builders on
//     our own GSAP timelines). Reduced motion: every vignette shows its final (or key) frame.
//   • Vignette 2 is a short non-looping sequence with Replay; vignette 7 is a static icon trio.
import {
  tCell, cancerCell, nkCell, dendriticCell, macrophage, mdsc, fibroblast, bloodVessel, lymphNode,
  mhc1, pdl1, pd1, tcr, antibody, interferon, signalIcon, tissueField, bacterium, cellInfo, rayHit,
  antibodyTips, DOCK_GAP, HEAD_Y, PALETTE, setDying, breathe, dotGlow,
} from '../art/index.js';
import {
  rig, place, move, approach, probe, dock, recognize, kill, detach, die, divide, unpolarize, drive,
} from './shared/cell-actions.js';
import { meter } from './shared/activity-meter.js';
import { createCycleWheel } from './shared/cycle-wheel.js';
import * as CD from './shared/cycle-data.js';

const ID = 'ch12-resistance';
const DEG = Math.PI / 180;
const f = (v) => String(Math.round(v * 100) / 100);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

const CSS = `
[data-figure="${ID}"] .fig__stage { padding: clamp(12px, 2.2%, 22px); }
[data-figure="${ID}"] .r12 { position: relative; z-index: 1; display: grid; gap: 14px 22px;
  grid-template-columns: minmax(0, 35fr) minmax(0, 65fr); grid-template-rows: minmax(0, 1fr) auto auto;
  grid-template-areas: "wheel vig" "wheel bar" "wheel extra"; align-items: center; }
[data-figure="${ID}"] .r12-wheel { grid-area: wheel; align-self: center; min-width: 0; }
[data-figure="${ID}"] .r12-vig { grid-area: vig; position: relative; aspect-ratio: 4 / 3; min-width: 0; border-radius: 14px;
  background: radial-gradient(120% 100% at 50% 45%, rgb(26 34 70 / 0.55), rgb(6 9 22 / 0.55));
  box-shadow: inset 0 0 0 1px rgb(169 177 204 / 0.16), 0 10px 30px -18px rgb(0 0 0 / 0.8); overflow: hidden; }
[data-figure="${ID}"] .r12-vig > svg { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
[data-figure="${ID}"] .r12-bar { grid-area: bar; display: flex; flex-wrap: wrap; align-items: center; gap: 8px 14px; min-width: 0;
  --ink: var(--fg); --ink-2: var(--fg-2); --ink-3: var(--fg-3); --rule-strong: rgb(169 177 204 / 0.42);
  --surface: #182046; --paper: #0B1024; --paper-2: rgb(255 255 255 / 0.07); --accent: #F2B33D; --accent-soft: rgb(242 179 61 / 0.24);
  --accent-strong: #FFC861; --accent-ink: #0B1024; color: var(--fg); }
[data-figure="${ID}"] .r12-bar .switch { min-height: 2.75rem; font-size: var(--text-sm); font-weight: 600; color: var(--fg); padding-inline: 0.15rem 0.4rem; }
[data-figure="${ID}"] .r12-bar .switch__track { background: rgb(169 177 204 / 0.35); }
[data-figure="${ID}"] .r12-bar .switch[aria-checked="true"] .switch__track { background: #F2B33D; }
[data-figure="${ID}"] .r12-bar .switch__label { display: inline-flex; align-items: center; gap: 0.45rem; white-space: nowrap; }
[data-figure="${ID}"] .r12-ab { width: 1.15rem; height: 1.15rem; flex-shrink: 0; }
[data-figure="${ID}"] .r12-badge { display: inline-flex; min-width: 0; max-width: 100%; }
[data-figure="${ID}"] .r12-badge .badge { white-space: normal; font-size: var(--text-xs); line-height: 1.3; padding-block: 0.3rem; border-radius: 1rem; }
[data-figure="${ID}"] .r12-hint { font-family: var(--font-ui); font-size: var(--text-xs); color: var(--fg-3); font-style: italic; }
[data-figure="${ID}"] .r12-extra { grid-area: extra; display: flex; flex-wrap: wrap; align-items: center; gap: 6px 12px; min-width: 0; }
[data-figure="${ID}"] .r12-extra:empty { display: none; }
[data-figure="${ID}"] .r12-extra .btn { --btn-h: 2.5rem; font-size: var(--text-xs); }
[data-figure="${ID}"] .r12-extra .btn--ghost { color: var(--fg); }
[data-figure="${ID}"] .r12-note { margin: 0; flex: 1 1 14rem; font-family: var(--font-ui); font-size: var(--text-xs); line-height: 1.4; color: var(--fg-2); }
[data-figure="${ID}"] .r12-ringkey { flex-basis: 100%; color: var(--fg-3); }
[data-figure="${ID}"] .r12-select-wrap { display: none; flex: 1 1 100%; align-items: center; gap: 10px; }
[data-figure="${ID}"] .r12-select-wrap label { font-family: var(--font-ui); font-size: var(--text-xs); font-weight: 600; color: var(--ink-2); }
[data-figure="${ID}"] .r12-select { flex: 1 1 0; min-width: 0; width: 0; min-height: 2.75rem; padding: 0 0.7rem; border-radius: 10px; border: 1px solid var(--rule-strong);
  background: var(--surface); color: var(--ink); font-family: var(--font-ui); font-size: var(--text-sm); font-weight: 600; }
[data-figure="${ID}"] .r12-select:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
[data-figure="${ID}"] .r12-fix { font-family: var(--font-ui); font-size: var(--text-xs); font-weight: 600; white-space: nowrap; }
[data-figure="${ID}"] .r12-cap { flex: 1 1 100%; margin: 0; max-width: var(--measure); font-family: var(--font-body); font-size: var(--text-sm);
  line-height: 1.55; color: var(--ink-2); min-height: 3.1em; }
[data-figure="${ID}"] .r12-cap b { font-family: var(--font-ui); font-weight: 650; color: var(--ink); margin-right: 0.35em; }
/* radios (role=radio, aria-checked): the chips' pressed look, without the invalid aria-pressed */
[data-figure="${ID}"] .chip[role="radio"][aria-checked="true"] { background: var(--accent-soft); border-color: var(--accent); color: var(--ink); box-shadow: inset 0 0 0 1px var(--accent); }
[data-figure="${ID}"] .chip[role="radio"][aria-checked="true"] .chip__icon { color: var(--accent); }
[data-figure="${ID}"] .chip--card[role="radio"][aria-checked="true"] .chip__desc { color: var(--ink-2); }
[data-figure="${ID}"] .r12-chips { flex: 1 1 100%; }
[data-figure="${ID}"] .r12-chips .chips__tray { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
[data-figure="${ID}"] .r12-chips .chip--card { min-width: 0; min-height: 3.6rem; }
[data-figure="${ID}"] .r12-chips .chip__icon svg { width: 1.1rem; height: 1.1rem; }
[data-figure="${ID}"] .r12-chips .chip__num { font-variant-numeric: tabular-nums; color: var(--ink-3); font-weight: 650; margin-right: 0.3em; }
@media (pointer: coarse) { [data-figure="${ID}"] .r12-extra .btn { --btn-h: 2.75rem; } }
@container fig (max-width: 899.98px) { [data-figure="${ID}"] .r12 { grid-template-columns: minmax(0, 38fr) minmax(0, 62fr); } }
@container fig (max-width: 599.98px) {
  [data-figure="${ID}"] .fig__stage { padding: 12px 10px 12px; }
  [data-figure="${ID}"] .r12 { grid-template-columns: minmax(0, 52fr) minmax(0, 48fr); grid-template-rows: auto auto auto;
    grid-template-areas: "wheel bar" "vig vig" "extra extra"; gap: 10px 10px; align-items: center; }
  [data-figure="${ID}"] .r12-wheel { max-width: 240px; justify-self: center; width: 100%; }
  [data-figure="${ID}"] .r12-bar { flex-direction: column; align-items: flex-start; gap: 8px; }
  [data-figure="${ID}"] .r12-bar .switch { font-size: var(--text-xs); }
  [data-figure="${ID}"] .r12-vig { border-radius: 10px; }
  [data-figure="${ID}"] .r12-chips { display: none; }
  [data-figure="${ID}"] .r12-select-wrap { display: flex; }
}
`;

function injectCSS() {
  if (document.getElementById(`${ID}-style`)) return;
  const s = document.createElement('style');
  s.id = `${ID}-style`;
  s.textContent = CSS;
  document.head.append(s);
}

// ------------------------------------------------------------------ geometry helpers
/** x where a closed outline crosses the horizontal line y (side +1: rightmost, −1: leftmost). */
function xAtRow(pts, y, side) {
  let best = null;
  for (let i = 0; i < pts.length; i++) {
    const [x0, y0] = pts[i], [x1, y1] = pts[(i + 1) % pts.length];
    if ((y0 - y) * (y1 - y) > 0 || y0 === y1) continue;
    const x = x0 + ((y - y0) / (y1 - y0)) * (x1 - x0);
    if (best == null || x * side > best * side) best = x;
  }
  return best ?? 0;
}
const rot = (x, y, deg) => { const c = Math.cos(deg * DEG), s = Math.sin(deg * DEG); return { x: x * c - y * s, y: x * s + y * c }; };

export default function mount(fig, ctx) {
  injectCSS();
  const { gsap, h } = ctx;
  ctx.setAspect('auto');
  ctx.stage.classList.add('is-auto-height');
  const MECHS = CD.MECHANISMS;
  const PD1 = CD.PD1_RINGS || { acts: CD.therapy('anti-pd1').acts, also: CD.therapy('anti-pd1').also };
  const mk = (tag, attrs, parent) => ctx.svg(tag, attrs, parent);

  // ---------------------------------------------------------------- state
  let idx = 0;              // selected mechanism
  let drug = false;
  let nk = false;           // vignette 3: "Who else could see it?"
  let compact = ctx.compact;

  // ---------------------------------------------------------------- stage layout
  const grid = h('div', { class: 'r12' });
  const wheelBox = h('div', { class: 'r12-wheel' });
  const vigBox = h('div', { class: 'r12-vig' });
  const bar = h('div', { class: 'r12-bar' });
  grid.append(wheelBox, vigBox, bar);
  ctx.stage.append(grid);
  ctx.tag('Not to scale');

  // Circle geometry like 7.3 and 12.2 (VISITOR-REVIEW-B #12): the wheel's 'mini' layout keeps the
  // circle and shows step numbers (names in the tap tooltip and aria labels); zone names are drawn
  // inside the ring on wider stages (see drawZones).
  const wheel = createCycleWheel(ctx, wheelBox, { density: 'locator', layout: 'mini', size: 400, flow: 1, label: 'Cancer-immunity cycle: where this mechanism breaks it' });
  // zone names in the free middle of the small circle, each toward its own arc (anchor middle)
  const ZONES = [{ text: ['TUMOR'], at: [6, 7] }, { text: ['LYMPH', 'NODE'], at: [2, 3] }, { text: ['BLOOD'], at: [4, 4] }];
  function drawZones() {
    const g = wheel.layers.under;
    if (!g) return;
    g.querySelectorAll('[data-part="zone"]').forEach((n) => n.remove());
    if (compact) return;                                     // phones: the ring is too small; tints only
    const pts = [1, 2, 3, 4, 5, 6, 7].map((n) => wheel.nodePoint(n));
    if (pts.some((p) => !p)) return;
    const c = { x: pts.reduce((a, p) => a + p.x, 0) / 7, y: pts.reduce((a, p) => a + p.y, 0) / 7 };
    const R = Math.hypot(pts[0].x - c.x, pts[0].y - c.y);
    for (const z of ZONES) {
      const p0 = pts[z.at[0] - 1], p1 = pts[z.at[1] - 1];
      const a = Math.atan2((p0.y + p1.y) / 2 - c.y, (p0.x + p1.x) / 2 - c.x);
      const d = R * 0.42;
      const x = c.x + Math.cos(a) * d, y = c.y + Math.sin(a) * d + 4 - (z.text.length - 1) * 6;
      const t = mk('text', { x: f(x), y: f(y), class: 'cw-band-label', 'text-anchor': 'middle', 'data-part': 'zone' }, g);
      z.text.forEach((ln, i) => { const ts = mk('tspan', { x: f(x), dy: i ? '1.15em' : 0 }, t); ts.textContent = ln; });
    }
  }
  wheel.onLayout(drawZones);

  const svg = ctx.createSVG({ viewBox: '0 0 640 480', parent: vigBox, className: 'r12-svg' });
  const hatchId = `${ID}-hatch-${Math.random().toString(36).slice(2, 7)}`;
  {
    const p = mk('pattern', { id: hatchId, patternUnits: 'userSpaceOnUse', width: 6, height: 6, patternTransform: 'rotate(45)' }, svg.defs);
    mk('rect', { width: 6, height: 6, fill: 'none' }, p);
    mk('line', { x1: 1.5, y1: 0, x2: 1.5, y2: 6, stroke: '#F4E8FF', 'stroke-width': 1.3, 'stroke-opacity': 0.42 }, p);
  }

  // ---------------------------------------------------------------- bar: switch, badge, extras
  const abIcon = () => {
    const s = mk('svg', { viewBox: '-14 -26 28 28', class: 'r12-ab', 'aria-hidden': 'true' });
    s.append(antibody({ variant: 'therapeutic', size: 24, stage: 'dark', detail: 'low' }));
    return s;
  };
  const sw = ctx.ui.toggle({ label: 'Add anti-PD-1', parent: bar, onChange: (on) => setDrug(on) });
  sw.el.querySelector('.switch__label').prepend(abIcon());
  const badgeBox = h('div', { class: 'r12-badge', 'aria-live': 'off' });
  bar.append(badgeBox);
  const badge = ctx.ui.badge({ kind: 'no', label: '', parent: badgeBox });
  const hint = h('span', { class: 'r12-hint' }, 'Does releasing the brake help?');
  badgeBox.append(hint);
  const extra = h('div', { class: 'r12-extra' });
  grid.append(extra);

  // ---------------------------------------------------------------- caption + chips (controls)
  const cap = h('p', { class: 'r12-cap', 'aria-live': 'polite' });
  // phones: the seven tiles become one select right under the stage (VISITOR-REVIEW-B #10)
  const selId = ctx.uid ? ctx.uid('mech') : `${ID}-mech`;
  const mselect = h('select', { class: 'r12-select', id: selId });
  MECHS.forEach((m) => mselect.append(h('option', { value: m.id }, `${m.n} · ${m.title}`)));
  mselect.addEventListener('change', () => { const j = MECHS.findIndex((m) => m.id === mselect.value); if (j >= 0) { chips.set(MECHS[j].id); select(j); } }, { signal: ctx.signal });
  ctx.controls.append(h('div', { class: 'r12-select-wrap' }, h('label', { for: selId }, 'Mechanism'), mselect), cap);
  const chips = ctx.ui.chips({
    label: 'Resistance mechanism',
    hideLabel: true,
    variant: 'card',
    required: true,
    value: MECHS[0].id,
    options: MECHS.map((m) => ({ value: m.id, label: m.title, desc: m.subtitle, icon: m.icon })),
    onChange: (v) => { if (v) select(MECHS.findIndex((m) => m.id === v)); },
  });
  chips.el.classList.add('r12-chips');
  const tray = chips.el.querySelector('.chips__tray');
  tray.setAttribute('role', 'radiogroup');
  tray.setAttribute('aria-label', 'Resistance mechanism');
  MECHS.forEach((m) => {
    const b = chips.buttons.get(m.id);
    b.setAttribute('role', 'radio');
    const lab = b.querySelector('.chip__label');
    lab.prepend(h('span', { class: 'chip__num', 'aria-hidden': 'true' }, `${m.n}`));
  });
  const syncRadios = () => MECHS.forEach((m, i) => {
    const b = chips.buttons.get(m.id);
    b.removeAttribute('aria-pressed');            // chips paint aria-pressed; it is invalid on role=radio (axe)
    b.setAttribute('aria-checked', String(i === idx));
    b.tabIndex = i === idx ? 0 : -1;
  });

  // ---------------------------------------------------------------- player (one timeline at a time)
  const player = (() => {
    let tl = null;
    let away = false;
    const handle = {
      pause() { away = true; if (tl) tl.pause(); },
      resume() { away = false; if (tl && !ctx.reducedMotion) tl.play(); },
      stop() { if (tl) tl.kill(); tl = null; },
    };
    ctx.track(handle);
    return {
      start(next, still) {
        if (tl) tl.kill();
        tl = next;
        tl.pause();
        if (ctx.reducedMotion) {
          if (still === 'end' || still == null) tl.progress(1);
          else tl.seek(still);
          return;
        }
        tl.seek(0);
        if (!away) tl.play();
      },
      kill() { if (tl) tl.kill(); tl = null; },
    };
  })();
  const breathers = [];
  const stopBreath = () => { while (breathers.length) { try { breathers.pop().stop(); } catch { /* */ } } };
  const breatheCell = (art) => { if (!ctx.reducedMotion) breathers.push(ctx.track(breathe(art, { amplitude: 0.7 }))); };

  // ---------------------------------------------------------------- drawing helpers
  const layerOf = (cell, name = 'receptors') => {
    let g = cell.querySelector(`:scope > [data-part="${name}"]`);
    if (!g) { g = mk('g', { 'data-part': name }, cell); }
    return g;
  };
  /** Seat a membrane glyph on a cell at outline angle deg (outward). Coordinates: cell-local. */
  function seat(cell, fn, deg, size, { inset = 0, detail = 'high' } = {}) {
    const hit = rayHit(cellInfo(cell).outline, deg * DEG);
    const x = hit.x - Math.cos(deg * DEG) * inset, y = hit.y - Math.sin(deg * DEG) * inset;
    const g = fn({ size, stage: 'dark', detail });
    const r = deg + 90;
    g.setAttribute('transform', `translate(${f(x)} ${f(y)}) rotate(${f(r)})`);
    layerOf(cell).append(g);
    return { g, x, y, r, size };
  }
  /** Seat a glyph horizontally (pointing toward side ±1) where the outline crosses row y. */
  function seatRow(cell, fn, y, side, size, { shift = 0, detail = 'high' } = {}) {
    const x = xAtRow(cellInfo(cell).outline, y, side) + shift * side;
    const g = fn({ size, stage: 'dark', detail });
    const r = side > 0 ? 90 : -90;
    g.setAttribute('transform', `translate(${f(x)} ${f(y)}) rotate(${r})`);
    layerOf(cell).append(g);
    return { g, x, y, r, size };
  }
  const headOf = (s, name) => { const v = rot(0, (HEAD_Y[name] ?? -0.9) * s.size, s.r); return { x: s.x + v.x, y: s.y + v.y }; };
  /** Antibody pose: arm tip on `head`, Fc pointing toward awayDeg (rule 9). */
  function capPose(size, head, awayDeg, arm = 'right') {
    const T = antibodyTips(size)[arm];
    const a0 = Math.atan2(-T[1], -T[0]) / DEG;
    const psi = awayDeg - a0;
    const p = rot(T[0], T[1], psi);
    return { x: head.x - p.x, y: head.y - p.y, r: psi };
  }
  const poseStr = (P) => `translate(${f(P.x)} ${f(P.y)}) rotate(${f(P.r)})`;
  /** A drug antibody drifts in and caps a PD-1 head (pos on tl). Returns the node. */
  function capIn(tl, parent, size, head, awayDeg, pos, { arm = 'right', duration = 1.3 } = {}) {
    const P = capPose(size, head, awayDeg, arm);
    const a = awayDeg * DEG;
    const side = rot(1, 0, awayDeg + 90);
    const F = { x: P.x + Math.cos(a) * size * 1.5 + side.x * size * 0.5, y: P.y + Math.sin(a) * size * 1.5 + side.y * size * 0.5, r: P.r - 28 };
    const ab = antibody({ variant: 'therapeutic', size, stage: 'dark', detail: size >= 14 ? 'high' : 'low' });
    const g = mk('g', { transform: poseStr(F), opacity: 0, 'data-part': 'drug' }, parent);
    g.append(ab);
    tl.fromTo(g, { attr: { transform: poseStr(F), opacity: 0 } }, { attr: { transform: poseStr(P), opacity: 1 }, duration, ease: 'so.out' }, pos);
    return g;
  }
  function label(parent, text, x, y, { anchor = 'middle', cls = 't-label', leader = null, halo = true, opacity } = {}) {
    const g = mk('g', { 'data-part': 'label' }, parent);
    if (opacity != null) g.setAttribute('opacity', opacity);
    if (leader) {
      mk('line', { x1: f(leader[0]), y1: f(leader[1]), x2: f(leader[2]), y2: f(leader[3]), class: 'leader' }, g);
      mk('circle', { cx: f(leader[2]), cy: f(leader[3]), r: 2.2, class: 'leader-dot' }, g);
    }
    const lines = String(text).split('\n');
    const t = mk('text', { x: f(x), y: f(y), class: `${cls}${halo ? ' t-halo' : ''}`, 'text-anchor': anchor }, g);
    lines.forEach((ln, i) => { const ts = mk('tspan', { x: f(x), dy: i ? '1.2em' : 0 }, t); ts.textContent = ln; });
    return g;
  }
  const disc = (parent, type, x, y, size, opacity = 0) => {
    const g = mk('g', { transform: `translate(${f(x)} ${f(y)})`, opacity }, parent);
    g.append(signalIcon({ type, size, stage: 'dark' }));
    return g;
  };
  /** Crimson ⊣ disc (a blocked step), as on the wheel. */
  const blockDisc = (parent, x, y, r, opacity = 1) => {
    const g = mk('g', { transform: `translate(${f(x)} ${f(y)})`, opacity }, parent);
    mk('circle', { r: f(r), fill: '#E5484D', stroke: '#0B1024', 'stroke-width': 1.4 }, g);
    mk('path', { d: `M${f(-r * 0.5)} 0H${f(r * 0.28)}M${f(r * 0.42)} ${f(-r * 0.5)}V${f(r * 0.5)}`, stroke: '#fff', 'stroke-width': f(Math.max(1.6, r * 0.22)), 'stroke-linecap': 'round', fill: 'none' }, g);
    return g;
  };
  const hatch = (cell) => {
    const mem = cell.querySelector('path.sao-membrane') || cell.querySelector('[data-part="membrane"] path') || cell.querySelector('[data-part="membrane"]');
    if (!mem) return;
    const p = mk('path', { d: mem.getAttribute('d'), fill: `url(#${hatchId})`, 'data-part': 'cytoplasm', 'pointer-events': 'none' });
    const rec = cell.querySelector(':scope > [data-part="receptors"]');
    if (rec) cell.insertBefore(p, rec); else cell.append(p);
  };
  const bg = (root, W, H, seed, density = 0.55) => root.append(tissueField({ width: W, height: H, seed, stage: 'dark', density }));
  const fadeTo = (tl, nodes, opacity, pos, duration = 0.5) => tl.to([].concat(nodes).filter(Boolean), { attr: { opacity }, duration, ease: 'so.inOut' }, pos);
  const fadeIn = (tl, nodes, pos, duration = 0.5) => tl.fromTo([].concat(nodes).filter(Boolean), { attr: { opacity: 0 } }, { attr: { opacity: 1 }, duration, ease: 'so.out' }, pos);
  const granulesOf = (art) => art.querySelector('[data-part="granules"]');

  // ================================================================ VIGNETTES
  // Each builder draws into `root` (frame W×H) and returns { tl, still }.
  // k = position scale (1 desktop, 0.625 compact); U = size scale (1 or 0.88).

  // ---- 1. Brake on --------------------------------------------------------------------------
  function vBrake({ root, W, H, U: U0, compact: cmp }) {
    const U = cmp ? U0 : U0 * 1.14;
    bg(root, W, H, 11);
    const tl = gsap.timeline({ repeat: drug ? 0 : -1, repeatDelay: 0.4 });
    const s = 20 * U;
    const cx = W * 0.665, cy = H * 0.5;
    const cArt = cancerCell({ r: 92 * U, seed: 8, stage: 'dark', receptors: false, nuclei: 1 });
    const tArt = tCell({ variant: 'cd8', r: 38 * U, state: 'activated', seed: 3, stage: 'dark', receptors: false, polarity: 0 });
    const tO = cellInfo(tArt).outline, cO = cellInfo(cArt).outline;
    const rT = cellInfo(tArt).rEff || 38 * U * 1.18;
    const gapA = DOCK_GAP['tcr-mhc1'] * s, gapB = DOCK_GAP['pd1-pdl1'] * s;
    const xDock = cx + xAtRow(cO, 0, -1) - gapA - xAtRow(tO, 0, 1);
    const xStart = W * 0.13;
    // paired glyphs: TCR–MHC on the axis, PD-1–PD-L1 on a row above it
    const tcrS = seatRow(tArt, (o) => tcr(o), 0, 1, s);
    const mhcS = seatRow(cArt, (o) => mhc1({ ...o, peptide: 'neo' }), 0, -1, s);
    const row = -0.52 * rT;
    const xt = xDock + xAtRow(tO, row, 1), xc = cx + xAtRow(cO, row, -1);
    const d = Math.max(-3, ((xc - xt) - gapB) / 2);
    const pd1S = seatRow(tArt, (o) => pd1({ ...o, icon: false }), row, 1, s, { shift: d });
    const pdlS = seatRow(cArt, (o) => pdl1(o), row, -1, s, { shift: d });
    // other molecules
    for (const a of [128, 236, 292, 348, 42, 96]) seat(cArt, (o) => mhc1({ ...o, peptide: 'neo' }), a, s * 0.95);
    for (const a of [150, 264, 18, 70, 318]) seat(cArt, (o) => pdl1(o), a, s * 0.9);
    for (const a of [34, 64]) seat(tArt, (o) => tcr(o), a, s * 0.9);
    const free1 = seat(tArt, (o) => pd1({ ...o, icon: false }), -82, s * 0.9);
    const free2 = seat(tArt, (o) => pd1({ ...o, icon: false }), 152, s * 0.9);
    const C = rig(cArt, { x: cx, y: cy, parent: root, seed: 8 });
    const T = rig(tArt, { x: drug ? xDock : xStart, y: cy, parent: root, seed: 3 });
    unpolarize(T, { angle: 180 });
    const gran = granulesOf(tArt);
    // overlays in the T cell's own frame (move with it)
    const minus = disc(T.layers.over, 'inhibitory', pd1S.x - 0.42 * s, pd1S.y, 13 * U);
    label(T.layers.over, 'Killer T cell', -6 * U, rT + 30 * U, {});
    const cLab = label(root, 'Cancer cell', cx + 10 * U, cy + 92 * U + 30 * U, {});
    const mid = { x: (xDock + pd1S.x + cx + pdlS.x) / 2, y: cy + row };
    const brakeLab = label(root, 'PD-1 brake', mid.x - 44 * U, cy - 92 * U - 18 * U, { anchor: 'end', leader: [mid.x - 40 * U, cy - 92 * U - 22 * U, mid.x - 2, mid.y - s * 0.35], opacity: 0 });
    if (!drug) {
      move(tl, T, { x: xDock, y: cy, duration: 1.8, pos: 0.3, via: [[(xStart + xDock) / 2, cy - 10 * U]] });
      const rec = recognize(tl, T, mhcS.g, { pos: 1.85, duration: 1.6 });
      fadeIn(tl, [minus, brakeLab], 2.05, 0.5);
      fadeTo(tl, gran, 0.3, 2.05, 0.8);
      tl.addLabel('still', 3.6);
      fadeTo(tl, [minus, brakeLab, rec.badge], 0, 5.3, 0.45);
      fadeTo(tl, gran, 1, 5.4, 0.6);
      move(tl, T, { x: xStart, y: cy, duration: 1.9, pos: 5.5, via: [[(xStart + xDock) / 2, cy + 12 * U]] });
      return { tl, still: 'still' };
    }
    // ---- with anti-PD-1: start engaged (braked), then the drug releases the brake
    const plus = disc(root, 'activating', xDock + xAtRow(tO, 0, 1) + gapA / 2, cy + s * 0.95, 15 * U, 1);
    minus.setAttribute('opacity', 1);
    brakeLab.setAttribute('opacity', 1);
    gran.setAttribute('opacity', 0.3);
    const ab = 0.9 * s;
    // PD-L1 lets go: it slides back toward its cell as the antibody arrives
    const pdlFrom = pdlS.g.getAttribute('transform');
    const pdlTo = `translate(${f(pdlS.x + 0.42 * s)} ${f(pdlS.y - 0.12 * s)}) rotate(-72)`;
    tl.fromTo(pdlS.g, { attr: { transform: pdlFrom.replace('rotate(-90)', 'rotate(-90)') } }, { attr: { transform: pdlTo }, duration: 0.9, ease: 'so.inOut' }, 0.6);
    const capA = capIn(tl, T.layers.over, ab, headOf(pd1S, 'pd1'), -100, 0.55, { arm: 'right' });
    capIn(tl, T.layers.over, ab, headOf(free1, 'pd1'), -82, 0.85);
    capIn(tl, T.layers.over, ab, headOf(free2, 'pd1'), 152, 1.05);
    fadeTo(tl, [minus, brakeLab], 0, 1.7, 0.5);
    const hA = headOf(free1, 'pd1');
    // phones: the T cell sits near the left edge, so the label hangs from the edge (anchor start)
    const dly = cy - rT - 64 * U;
    const drugLab = cmp
      ? label(root, 'Anti-PD-1 (drug)', 10, dly, { anchor: 'start', opacity: 0, leader: [34, dly + 7, xDock + hA.x - 6 * U, cy + hA.y - 14 * U] })
      : label(root, 'Anti-PD-1 (drug)', xDock - 40 * U, dly, { anchor: 'end', opacity: 0, leader: [xDock - 36 * U, dly - 4 * U, xDock + hA.x - 6 * U, cy + hA.y - 14 * U] });
    fadeIn(tl, drugLab, 2.25, 0.5);
    fadeTo(tl, gran, 1, 2.0, 0.5);
    const k = kill(tl, T, C, { dock: false, duration: 2.6, pos: 2.3 });
    fadeTo(tl, plus, 0, k.marks.released, 0.5);
    fadeTo(tl, cLab, 0.45, k.marks.dying + 1.2, 0.8);
    void capA;
    return { tl, still: 'end' };
  }

  // ---- 2. Nothing new to see ----------------------------------------------------------------
  function vNothingNew({ root, W, H, U: U0, compact: cmp }) {
    const U = cmp ? U0 : U0 * 1.15;
    bg(root, W, H, 21);
    const tl = gsap.timeline();
    const r = 31 * U;
    const u = r;
    // two staggered rows; S = survivor (self peptides only, hatched)
    const slots = [
      ['A0', -3.15, -1.05, 0], ['A1', -1.05, -1.05, 1], ['A2', 1.05, -1.05, 0], ['A3', 3.15, -1.05, 1],
      ['B0', -2.1, 1.05, 0], ['B1', 0, 1.05, 1], ['B2', 2.1, 1.05, 0], ['B3', 4.2, 1.05, 0],
    ];
    const ox = W * 0.5 - 0.52 * u, oy = H * 0.58;
    const cells = {};
    const cup = 17 * U;
    for (const [id, gx, gy, surv] of slots) {
      const seed = 30 + slots.findIndex((q) => q[0] === id);
      const art = cancerCell({ r, seed, stage: 'dark', receptors: false, nuclei: 1, clone: surv ? 2 : 0 });
      const j = (seed * 37) % 60;
      for (const a of [-100 + j, 20 + j, 140 + j]) seat(art, (o) => mhc1({ ...o, peptide: surv ? 'self' : 'neo' }), a, cup);
      if (surv) hatch(art);
      cells[id] = rig(art, { x: ox + gx * u, y: oy + gy * u, parent: root, seed });
      cells[id].surv = !!surv;
    }
    // T cells
    const tr = 15 * U;
    const mkT = (seed, x, y, pol) => {
      const art = tCell({ variant: 'cd8', r: tr, state: 'activated', seed, stage: 'dark', receptors: false, polarity: pol });
      const p = seat(art, (o) => pd1({ ...o, icon: false }), pol + 180 - 40, 10 * U, { detail: 'low' });
      const R = rig(art, { x, y, parent: root, seed });
      R.pd1 = p;
      R.pol = pol;
      return R;
    };
    const T1 = mkT(5, W * 0.08, H * 0.12, 30);
    const T2 = mkT(6, W * 0.1, H * 0.95, -30);
    const T3 = mkT(7, W * 0.95, H * 0.97, -150);
    // counter
    const ctrG = mk('g', { 'data-part': 'counter' }, root);
    const lx = cmp ? 14 : 22, ly = cmp ? 24 : 32;
    const ctrLab = mk('text', { x: lx, y: ly, class: 't-small t-halo' }, ctrG);
    ctrLab.textContent = 'Cells showing a typo:';
    const ctrNum = mk('text', { x: lx, y: ly + (cmp ? 26 : 30), class: 't-title t-num t-halo', style: 'fill: #FF7AA8' }, ctrG);
    ctrNum.textContent = '5';
    // legend chips (pink typo vs hatched self) — bottom-left
    const lg = mk('g', {}, root);
    const lyy = H - (cmp ? 16 : 22);
    const sw1 = mhc1({ size: 15, stage: 'dark', peptide: 'neo', detail: 'high' });
    sw1.setAttribute('transform', `translate(${lx + 6} ${lyy + 3})`); lg.append(sw1);
    mk('text', { x: lx + 18, y: lyy + 4, class: 't-small t-halo' }, lg).textContent = 'typo';
    const hx = lx + (cmp ? 70 : 76);
    mk('circle', { cx: hx + 6, cy: lyy, r: 7, fill: PALETTE.cancer, 'fill-opacity': 0.55, stroke: '#D9A5EE', 'stroke-width': 1 }, lg);
    mk('circle', { cx: hx + 6, cy: lyy, r: 7, fill: `url(#${hatchId})` }, lg);
    mk('text', { x: hx + 19, y: lyy + 4, class: 't-small t-halo' }, lg).textContent = 'no typo: invisible';
    let start = 0.15;
    if (drug) {
      [T1, T2, T3].forEach((T, i) => capIn(tl, T.layers.over, 9 * U, headOf(T.pd1, 'pd1'), T.pol + 180 - 40, 0.1 + i * 0.15, { duration: 1 }));
      start = 1.2;
    }
    const killOne = (sub, T, target, angle) => {
      approach(sub, T, target, { gap: 2, angle, duration: 1.0 });
      dock(sub, T, target, { flatten: 0.1, duration: 0.4 });
      const rc = recognize(sub, T, undefined, { duration: 0.9, hold: false });
      const t0 = rc.end - 0.35;
      die(sub, target, { duration: 1.5, remnants: false, pos: t0 });
      detach(sub, T, { pos: t0 + 0.35, duration: 0.8 });
      return t0;
    };
    const deaths = [];
    const s1 = gsap.timeline();
    deaths.push(start + killOne(s1, T1, cells.A0, -120));
    probe(s1, T1, cells.A1, { match: false, angle: -92, gap: 2, hold: 0.35, duration: 0.9 });
    deaths.push(start + killOne(s1, T1, cells.A2, -80));
    move(s1, T1, { x: W * 0.62, y: -30, duration: 1.4 });
    tl.add(s1, start);
    const s2 = gsap.timeline();
    deaths.push(start + 0.25 + killOne(s2, T2, cells.B0, 115));
    deaths.push(start + 0.25 + killOne(s2, T2, cells.B2, 70));
    move(s2, T2, { x: W * 0.4, y: H + 30, duration: 1.4 });
    tl.add(s2, start + 0.25);
    const s3 = gsap.timeline();
    deaths.push(start + 0.5 + killOne(s3, T3, cells.B3, 40));
    move(s3, T3, { x: W + 30, y: H * 0.7, duration: 1.4 });
    tl.add(s3, start + 0.5);
    // the invisible survivors divide and refill the cluster
    const tDiv = Math.max(...deaths) + 1.0;
    divide(tl, cells.A1, 2, { angle: 0, spread: 2.1 * u, duration: 1.7, scale: 1, pos: tDiv });
    divide(tl, cells.B1, 2, { angle: 0, spread: 2.1 * u, duration: 1.7, scale: 1, pos: tDiv + 0.15 });
    divide(tl, cells.A3, 2, { angle: Math.atan2(2.1, 1.05) / DEG, spread: Math.hypot(1.05, 2.1) * u, duration: 1.7, scale: 1, pos: tDiv + 0.3 });
    // the counter is a pure function of time (seek-safe): one fewer typo-cell per death
    const total = tl.duration();
    drive(tl, (p) => { const t = p * total; ctrNum.textContent = String(5 - deaths.filter((d) => t >= d + 0.5).length); }, { duration: total, pos: 0 });
    return { tl, still: 'end' };
  }

  // ---- 3. Shop window shut ------------------------------------------------------------------
  function vShopWindow({ root, W, H, U, compact: cmp }) {
    bg(root, W, H, 31);
    const tl = gsap.timeline();
    const cx = W * 0.62, cy = H * 0.46;
    const cr = 88 * U;
    const cArt = cancerCell({ r: cr, seed: 14, stage: 'dark', receptors: false, nuclei: 1 });
    const cups = [];
    const pat = ['neo', 'self', 'self', 'neo', 'self', 'neo', 'self', 'self'];
    for (let i = 0; i < 8; i++) cups.push(seat(cArt, (o) => mhc1({ ...o, peptide: pat[i] }), -78 + i * 45, 20 * U));
    const C = rig(cArt, { x: cx, y: cy, parent: root, seed: 14 });
    const tStart = { x: W * 0.12, y: H * 0.28 };
    const tArt = tCell({ variant: 'cd8', r: 30 * U, state: 'activated', seed: 4, stage: 'dark', receptors: false, polarity: 20 });
    for (const a of [-10, 20, 50]) seat(tArt, (o) => tcr(o), a, 15 * U);
    // PD-1 on the trailing (left) side, clear of the label above the cell, so a capping drug never covers it
    const tp = seat(tArt, (o) => pd1({ ...o, icon: false }), 168, 14 * U);
    const T = rig(tArt, { x: tStart.x, y: tStart.y, parent: root, seed: 4 });
    label(T.layers.over, 'Killer T cell', 0, -(cellInfo(tArt).rEff || 35) - 14 * U);
    const nLab = label(root, cmp ? 'no B2M →\nno MHC class I on the surface' : 'no B2M → no MHC class I on the surface', cx, cy + cr + (cmp ? 26 : 34) * U, { cls: 't-label', opacity: 0 });
    label(root, 'Cancer cell', cx, cy - cr - 16 * U, { cls: 't-small' });
    const sink = (pos) => cups.forEach((c, i) => {
      const a = (c.r - 90) * DEG;
      const to = `translate(${f(c.x - Math.cos(a) * c.size * 0.9)} ${f(c.y - Math.sin(a) * c.size * 0.9)}) rotate(${f(c.r)})`;
      tl.to(c.g, { attr: { transform: to, opacity: 0 }, duration: 0.9, ease: 'so.in' }, pos + i * 0.17);
    });
    if (nk) {
      // start from the shut window, T cell gone; an NK cell arrives
      cups.forEach((c) => c.g.setAttribute('opacity', 0));
      T.el.setAttribute('opacity', 0);
      nLab.setAttribute('opacity', 1);
      const nArt = nkCell({ r: 32 * U, state: 'activated', seed: 9, stage: 'dark', polarity: 150 });
      const N = rig(nArt, { x: W + 40 * U, y: H * 0.16, parent: root, seed: 9 });
      unpolarize(N, { angle: -30 });
      label(N.layers.over, 'NK cell', 0, -(cellInfo(nArt).rEff || 35) - 14 * U);
      approach(tl, N, C, { angle: -38, gap: 0, duration: 1.6, pos: 0.2 });
      dock(tl, N, C, { flatten: 0.12, duration: 0.6 });
      const pc = { x: cx + Math.cos(-38 * DEG) * cr * 1.02, y: cy + Math.sin(-38 * DEG) * cr * 1.02 };
      const pk = { x: pc.x + Math.cos(52 * DEG) * 40 * U, y: pc.y + Math.sin(52 * DEG) * 40 * U };
      const chk = ctx.badgeSVG('yes', { x: f(pk.x), y: f(pk.y), r: 13 * U }, root);
      chk.setAttribute('opacity', 0);
      const chkLab = label(root, cmp ? 'missing\nMHC' : 'missing MHC', pk.x + 20 * U, pk.y + 5, { anchor: 'start', cls: 't-small', opacity: 0 });
      fadeIn(tl, [chk, chkLab], 2.3, 0.5);
      kill(tl, N, C, { dock: false, duration: 2.6, pos: 2.9 });
      return { tl, still: 'end' };
    }
    let t0 = 0.3;
    if (drug) { capIn(tl, T.layers.over, 13 * U, headOf(tp, 'pd1'), 168, 0.2); t0 = 0.6; }
    sink(t0);
    fadeIn(tl, nLab, t0 + 1.9, 0.6);
    probe(tl, T, C, { match: false, angle: 196, gap: 2, hold: 0.9, duration: 1.6, pos: t0 + 1.6 });
    move(tl, T, { x: W * 0.16, y: H * 0.86, via: [[W * 0.26, H * 0.62]], duration: 2.2 });
    return { tl, still: 'end' };
  }

  // ---- 4. Deaf to the alarm -----------------------------------------------------------------
  function vDeaf({ root, W, H, U, compact: cmp }) {
    bg(root, W, H, 41, 0.45);
    const tl = gsap.timeline();
    const PW = W / 2;
    mk('line', { x1: PW, y1: 14, x2: PW, y2: H - 14, stroke: 'rgb(169 177 204 / 0.32)', 'stroke-width': 1, 'stroke-dasharray': '3 5' }, root);
    const start = drug ? 1.1 : 0.2;
    for (const p of [0, 1]) {
      const before = p === 0;
      const ox = p * PW;
      const g = mk('g', {}, root);
      label(g, before ? 'BEFORE' : 'AFTER RELAPSE', ox + PW / 2, cmp ? 20 : 28, { cls: 't-caps', halo: true });
      const cr = 72 * U;
      const cx = ox + PW * 0.56, cy = H * (cmp ? 0.64 : 0.62);
      const tx = ox + PW * 0.24, ty = H * (cmp ? 0.22 : 0.23);
      const aR = Math.atan2(ty - cy, tx - cx) / DEG;          // receptor faces the T cell
      const cArt = cancerCell({ r: cr, seed: 52, stage: 'dark', receptors: false, nuclei: 1 });
      const cs = 18 * U;
      seat(cArt, (o) => mhc1({ ...o, peptide: 'neo' }), aR + 95, cs);
      seat(cArt, (o) => mhc1({ ...o, peptide: 'self' }), aR + 200, cs);
      seat(cArt, (o) => pdl1(o), aR + 150, cs * 0.95);
      // the interferon-gamma receptor: a forked receptor (single-use, local)
      const hit = rayHit(cellInfo(cArt).outline, aR * DEG);
      const rs = 28 * U;
      const rcp = mk('g', { transform: `translate(${f(hit.x)} ${f(hit.y)}) rotate(${f(aR + 90)})` }, layerOf(cArt));
      const rc = '#A9C2F2';
      mk('path', { d: `M0 ${f(0.1 * rs)}V${f(-0.48 * rs)}M0 ${f(-0.48 * rs)}C${f(-0.05 * rs)} ${f(-0.66 * rs)} ${f(-0.2 * rs)} ${f(-0.78 * rs)} ${f(-0.24 * rs)} ${f(-0.98 * rs)}M0 ${f(-0.48 * rs)}C${f(0.05 * rs)} ${f(-0.66 * rs)} ${f(0.2 * rs)} ${f(-0.78 * rs)} ${f(0.24 * rs)} ${f(-0.98 * rs)}`, stroke: rc, 'stroke-width': f(0.13 * rs), 'stroke-linecap': 'round', fill: 'none' }, rcp);
      mk('ellipse', { cx: 0, cy: f(-0.3 * rs), rx: f(0.12 * rs), ry: f(0.18 * rs), fill: '#2A3A66', stroke: rc, 'stroke-width': f(0.07 * rs) }, rcp);
      // JAK beads under the membrane
      const n = { x: Math.cos(aR * DEG), y: Math.sin(aR * DEG) }, tg = { x: -n.y, y: n.x };
      const jb = { x: hit.x - n.x * 0.55 * rs, y: hit.y - n.y * 0.55 * rs };
      const jr = 0.16 * rs;
      const jak = [-1, 1].map((sd) => {
        const jx = jb.x + tg.x * sd * 0.2 * rs, jy = jb.y + tg.y * sd * 0.2 * rs;
        const jg = mk('g', { transform: `translate(${f(jx)} ${f(jy)})` }, cArt);
        const glow = mk('circle', { r: f(jr * 2.4), fill: dotGlow ? dotGlow('#3DDC97', 0.75) : '#3DDC97', opacity: 0 }, jg);
        mk('circle', { r: f(jr), fill: '#4A5068', stroke: '#8D93A8', 'stroke-width': 1 }, jg);
        const lit = mk('circle', { r: f(jr), fill: '#3DDC97', stroke: '#C9FFE6', 'stroke-width': 1, opacity: 0 }, jg);
        return { jg, glow, lit, jx, jy };
      });
      // the relay path to the nucleus
      const nuc = { x: -n.x * cr * 0.18, y: -n.y * cr * 0.18 };
      const pth = mk('path', {
        d: `M${f(jb.x - n.x * jr * 1.6)} ${f(jb.y - n.y * jr * 1.6)}Q${f((jb.x + nuc.x) / 2 + tg.x * 10 * U)} ${f((jb.y + nuc.y) / 2 + tg.y * 10 * U)} ${f(nuc.x + n.x * cr * 0.06)} ${f(nuc.y + n.y * cr * 0.06)}`,
        fill: 'none', stroke: before ? '#C9FFE6' : '#8D93A8', 'stroke-width': 1.6, 'stroke-dasharray': before ? '4 4' : '2 5', 'stroke-linecap': 'round', opacity: before ? 0 : 0.35,
      }, cArt);
      const C = rig(cArt, { x: cx, y: cy, parent: g, seed: 52 });
      const tArt = tCell({ variant: 'cd8', r: 25 * U, state: 'activated', seed: 12 + p, stage: 'dark', receptors: false, polarity: Math.atan2(cy - ty, cx - tx) / DEG });
      const pol = Math.atan2(cy - ty, cx - tx) / DEG;
      for (const a of [pol - 30, pol, pol + 30]) seat(tArt, (o) => tcr(o), a, 12 * U, { detail: 'low' });
      const tp = seat(tArt, (o) => pd1({ ...o, icon: false }), pol + 150, 12 * U, { detail: 'low' });
      const T = rig(tArt, { x: tx, y: ty, parent: g, seed: 12 + p });
      if (drug) capIn(tl, T.layers.over, 12 * U, headOf(tp, 'pd1'), pol + 150, 0.15 + p * 0.2, { duration: 1 });
      // IFN-gamma rings travel from the T cell to the receptor fork
      const tipL = { x: cx + hit.x + n.x * 0.95 * rs, y: cy + hit.y + n.y * 0.95 * rs };
      const fromP = { x: tx + Math.cos(pol * DEG) * 30 * U, y: ty + Math.sin(pol * DEG) * 30 * U };
      const rings = [];
      for (let i = 0; i < 5; i++) {
        const rg = mk('g', { opacity: 0, transform: `translate(${f(fromP.x)} ${f(fromP.y)})` }, g);
        rg.append(interferon({ color: PALETTE.cd8, size: 13 * U, stage: 'dark' }));
        const last = i === 4;
        const wob = (i % 2 ? 1 : -1) * (10 + i * 4) * U;
        const mx = (fromP.x + tipL.x) / 2 + tg.x * wob, my = (fromP.y + tipL.y) / 2 + tg.y * wob;
        const end = last ? tipL : { x: tipL.x + tg.x * (i - 2) * 9 * U + n.x * 8 * U, y: tipL.y + tg.y * (i - 2) * 9 * U + n.y * 8 * U };
        drive(tl, (q) => {
          const e = q < 0.5 ? 2 * q * q : 1 - Math.pow(-2 * q + 2, 2) / 2;
          const x = (1 - e) * (1 - e) * fromP.x + 2 * (1 - e) * e * mx + e * e * end.x;
          const y = (1 - e) * (1 - e) * fromP.y + 2 * (1 - e) * e * my + e * e * end.y;
          rg.setAttribute('transform', `translate(${f(x)} ${f(y)})`);
          const o = q < 0.12 ? q / 0.12 : last ? 1 : q > 0.8 ? Math.max(0, 1 - (q - 0.8) / 0.2) : 1;
          rg.setAttribute('opacity', f(o));
        }, { duration: 1.7, pos: start + i * 0.28 });
        rings.push(rg);
      }
      const bound = start + 4 * 0.28 + 1.7;
      if (before) {
        jak.forEach((j, i) => { fadeIn(tl, [j.lit, j.glow], bound + i * 0.12, 0.45); });
        fadeIn(tl, pth, bound + 0.4, 0.4);
        // a relay pulse runs to the nucleus
        const pulse = mk('g', { opacity: 0 }, cArt);
        pulse.append(signalIcon({ type: 'activating', size: 12 * U, stage: 'dark' }));
        const L = () => pth.getTotalLength();
        drive(tl, (q) => {
          let pt = { x: 0, y: 0 };
          try { pt = pth.getPointAtLength(q * L()); } catch { /* not rendered */ }
          pulse.setAttribute('transform', `translate(${f(pt.x)} ${f(pt.y)})`);
          pulse.setAttribute('opacity', f(q < 0.15 ? q / 0.15 : q > 0.85 ? (1 - q) / 0.15 : 1));
        }, { duration: 1.1, pos: bound + 0.7 });
        // new shop windows and brakes appear
        const add = [[aR + 35, 'mhc'], [aR + 60, 'pdl1'], [aR + 120, 'mhc'], [aR + 175, 'mhc'], [aR + 225, 'pdl1'], [aR + 250, 'mhc'], [aR + 290, 'mhc']];
        add.forEach(([a, kind], i) => {
          const sg = seat(cArt, kind === 'mhc' ? (o) => mhc1({ ...o, peptide: i % 2 ? 'self' : 'neo' }) : (o) => pdl1(o), a, cs * (kind === 'mhc' ? 1 : 0.95));
          const base = sg.g.getAttribute('transform');
          sg.g.setAttribute('opacity', 0);
          tl.fromTo(sg.g, { attr: { opacity: 0, transform: `${base} scale(0.2)` } }, { attr: { opacity: 1, transform: `${base} scale(1)` }, duration: 0.7, ease: 'so.out' }, bound + 1.8 + i * 0.12);
        });
        label(g, 'interferon-gamma', ox + (cmp ? 8 : 16), ty + (cmp ? 46 : 58) * U, { cls: 't-small', anchor: 'start' });
        if (cmp) label(g, 'JAK', ox + 6, cy + hit.y + 30 * U, { cls: 't-small', anchor: 'start' });
        else label(g, 'JAK1 · JAK2', cx + hit.x - 16 * U, cy + hit.y + 34 * U, { cls: 't-small', anchor: 'end' });
      } else {
        blockDisc(cArt, jb.x - n.x * jr * 2.6, jb.y - n.y * jr * 2.6, jr * 1.35, 1);
        if (cmp) label(g, 'JAK lost', ox + 6, cy + hit.y + 30 * U, { cls: 't-small', anchor: 'start' });
        else label(g, 'JAK lost', cx + hit.x - 16 * U, cy + hit.y + 34 * U, { cls: 't-small', anchor: 'end' });
        const no = label(g, 'no response', cx, cy + cr + (cmp ? 22 : 30) * U, { cls: 't-small', opacity: 0 });
        fadeIn(tl, no, bound + 0.6, 0.6);
      }
      void C; void rings;
    }
    return { tl, still: 'end' };
  }

  // ---- 5. Excluded (looks like ch07-tme "Excluded") -----------------------------------------
  // ---- ch07-tme scene grammar, scaled to vignette size (FIGURE-AUDIT §2C) ------------------
  // Same nest (a jittered sunflower of 28 cancer cells), the same fibroblast layers and collagen
  // arcs, and the same players at the same angles and radii as ch07-tme's Excluded / Desert
  // profiles, so readers recognize the scenes. Units: ch07-tme "wide" units × k.
  const TME_GOLDEN = 137.508 * DEG;
  const TME_LAYERS = [148, 172, 196, 220];
  const TME_LAYER_ON = { excluded: [1, 1, 1, 1], desert: [1, 1, 0, 0] };
  const TME_STATICS = [   // [kind, angle, R, excluded, desert, state]
    ['treg', 248, 152, 1, 0], ['treg', 146, 200, 1, 0],
    ['mdsc', 62, 168, 1, 1], ['mdsc', 204, 206, 1, 1], ['mdsc', 288, 158, 0, 1], ['mdsc', 352, 176, 0, 1],
    ['tam', 172, 156, 1, 1], ['tam', 36, 150, 0, 1], ['tam', 306, 200, 1, 1], ['tam', 96, 200, 1, 0],
    ['dc', 128, 210, 1, 0, 'mature'], ['dc', 136, 196, 0, 1, 'immature'],
  ];
  function tmeScene(root, { C, k, mode, sq = [1.07, 0.95], vessel = true, haze = false }) {
    const P = (a, R) => ({ x: C.x + Math.cos(a * DEG) * R * k * sq[0], y: C.y + Math.sin(a * DEG) * R * k * sq[1] });
    const ex = mode === 'excluded';
    if (haze) {
      const rIn = 140 * k, rOut = 236 * k, q0 = rIn / rOut;
      const hz = ctx.radialGradient(root, [[0, '#C9B79A', 0], [q0 * 0.9, '#C9B79A', 0], [q0 + 0.06, '#C9B79A', 0.14], [0.86, '#C9B79A', 0.08], [1, '#C9B79A', 0]]);
      mk('ellipse', { cx: f(C.x), cy: f(C.y), rx: f(rOut * sq[0]), ry: f(rOut * sq[1]), fill: hz }, root);
    }
    // collagen: thin beige arcs roughly parallel to the nest edge
    const rnd = ctx.random(31);
    const col = mk('g', { fill: 'none', stroke: '#D6C4AA', 'stroke-linecap': 'round' }, root);
    for (let i = 0; i < 22; i++) {
      const R = 138 + (i / 21) * 90 + rnd.range(-3, 3);
      const a0 = rnd.range(0, 360), span = rnd.range(70, 160);
      if (!ex && R >= 186) continue;          // the desert's thinner wall
      let d = '';
      for (let j = 0; j <= 20; j++) { const q = P(a0 + (span * j) / 20, R + Math.sin(j * 0.8 + i) * 2.2); d += `${j ? 'L' : 'M'}${f(q.x)} ${f(q.y)}`; }
      mk('path', { d, 'stroke-width': f((0.8 + (i % 3) * 0.3) * Math.max(0.7, k)), 'stroke-opacity': f(0.2 + (i % 2) * 0.1) }, col);
    }
    // fibroblast layers (tangential spindles)
    const fibG = mk('g', {}, root);
    TME_LAYERS.forEach((R0, L0) => {
      if (!TME_LAYER_ON[mode][L0]) return;
      const fl = 24 * k;
      const n = Math.floor((2 * Math.PI * R0 * k * (sq[0] + sq[1]) / 2) / (fl * 2.08));
      for (let i = 0; i < n; i++) {
        const a = ((i + (L0 % 2) * 0.5) / n) * 360 + L0 * 9;
        const q = P(a, R0 + (((i * 7) % 5) - 2) * 1.2);
        const fa = fibroblast({ r: fl, seed: 500 + L0 * 40 + i, stage: 'dark', angle: a + 90 + (((i * 13) % 9) - 4), detail: L0 || fl < 18 ? 'low' : 'auto' });
        fa.setAttribute('transform', `translate(${f(q.x)} ${f(q.y)})`);
        fibG.append(fa);
      }
    });
    // blood vessel from the right (ch07-tme: x0 = +191, y = +111 units)
    let mouth = null;
    if (vessel) {
      const x0 = C.x + 191 * k, x1 = vessel === true ? C.x + 330 * k : vessel;
      const len = Math.max(20, x1 - x0);
      const v = bloodVessel({ length: len, width: 45 * k, wall: 5.4 * k, rbc: Math.max(2, Math.round(len / 45)), seed: 5, stage: 'dark' });
      const vy = C.y + 111 * k;
      v.setAttribute('transform', `translate(${f(x0 + len / 2)} ${f(vy)})`);
      root.append(v);
      mouth = { x: x0 + 8 * k, y: vy };
    }
    // the nest
    const nest = [];
    const nrnd = ctx.random(7);
    const RC = 21 * k, sp = 20.6 * k;
    const cells = mk('g', {}, root);
    for (let i = 0; i < 28; i++) {
      const rr = sp * Math.sqrt(i + 0.5), th = i * TME_GOLDEN + 0.5;
      const x = C.x + Math.cos(th) * rr * sq[0] + nrnd.range(-2.2, 2.2) * k, y = C.y + Math.sin(th) * rr * sq[1] + nrnd.range(-2.2, 2.2) * k;
      const art = cancerCell({ r: RC * nrnd.range(0.94, 1.06), seed: 300 + i * 7, stage: 'dark', mhc: ex ? 4 : 2, peptides: ['neo', 'self'] });
      art.setAttribute('transform', `translate(${f(x)} ${f(y)})`);
      cells.append(art);
      nest.push({ art, x, y, rr });
    }
    // the players
    const col2 = ex ? 3 : 4;
    for (const d of TME_STATICS) {
      if (!d[col2]) continue;
      const [kind, a, R] = d;
      const q = P(a, R);
      let art;
      if (kind === 'treg') art = tCell({ variant: 'treg', r: 12 * k, seed: 40 + a, stage: 'dark' });
      else if (kind === 'mdsc') art = mdsc({ r: 15 * k, seed: 60 + a, stage: 'dark' });
      else if (kind === 'tam') art = macrophage({ r: 31 * k, variant: 'tam', seed: 80 + a, stage: 'dark', receptors: false });
      else art = dendriticCell({ r: (d[5] === 'immature' ? 25 : 31) * k, state: d[5], seed: 20 + a, stage: 'dark', receptors: false });
      art.setAttribute('transform', `translate(${f(q.x)} ${f(q.y)})`);
      root.append(art);
      if (kind === 'dc') nest.dc = { x: q.x, y: q.y, r: (d[5] === 'immature' ? 25 : 31) * k };
    }
    return { P, nest, mouth };
  }

  // ---- 5. Excluded (ch07-tme "Excluded" at vignette scale) -----------------------------------
  function vExcluded({ root, W, H, compact: cmp }) {
    bg(root, W, H, 51, 0.4);
    const tl = gsap.timeline();
    const k = cmp ? 0.56 : 0.86;
    const C = { x: W * 0.42, y: H * 0.5 };
    const { P, mouth } = tmeScene(root, { C, k, mode: 'excluded', vessel: W + 20, haze: true });
    // T cells: 12 in the stroma band, 2 just inside the nest (as in ch07-tme), all with PD-1
    const tr = 12 * k;
    const Ts = [];
    const bandR = [160, 184, 208];
    const poses = [];
    for (let i = 0; i < 12; i++) { const a = i * 30 + 12 + ((i * 17) % 11) - 5; poses.push({ a, R: bandR[i % 3], band: true }); }
    poses.push({ a: 24, R: 76, band: false }, { a: 205, R: 78, band: false });
    poses.forEach((ps, i) => {
      const q0 = P(ps.a, ps.R);
      const art = tCell({ variant: 'cd8', r: tr, state: 'activated', seed: 80 + i, stage: 'dark', receptors: false, polarity: ps.a + 180 });
      const p = seat(art, (o) => pd1({ ...o, icon: false }), ps.a + 120, Math.max(6, 9 * k), { detail: 'low' });
      const T = rig(art, { x: q0.x, y: q0.y, parent: root, seed: 80 + i });
      T.pd1 = p;
      // wander a little along the band; inward steps bounce off the nest edge
      const sub = gsap.timeline({ repeat: -1 });
      const legs = ps.band
        ? [[ps.a + 9, ps.R + (i % 2 ? -14 : 12)], [ps.a + 4, Math.max(152, ps.R - 20)], [ps.a - 7, ps.R + 6]]
        : [[ps.a + 6, ps.R - 4], [ps.a - 4, ps.R + 3]];
      legs.forEach(([a, R]) => { const q = P(a, R); move(sub, T, { x: q.x, y: q.y, duration: 2.2 + (i % 4) * 0.35, stretch: 0.05 }); });
      move(sub, T, { x: q0.x, y: q0.y, duration: 2.2 });
      tl.add(sub, (i * 0.37) % 1.4);
      Ts.push(T);
    });
    // one more T cell leaves the vessel and joins the wall (loops)
    if (mouth) {
      const art = tCell({ variant: 'cd8', r: tr, state: 'activated', seed: 99, stage: 'dark', receptors: false, polarity: 180 });
      const p = seat(art, (o) => pd1({ ...o, icon: false }), -60, Math.max(6, 9 * k), { detail: 'low' });
      const T = rig(art, { x: mouth.x, y: mouth.y, parent: root, seed: 99, opacity: 0 });
      T.pd1 = p;
      const sub = gsap.timeline({ repeat: -1, repeatDelay: 0.6 });
      move(sub, T, { x: mouth.x, y: mouth.y, opacity: 1, duration: 0.7 });
      const q1 = P(22, 214), q2 = P(8, 196), q3 = P(18, 176);
      move(sub, T, { x: q1.x, y: q1.y, duration: 2.6 });
      move(sub, T, { x: q2.x, y: q2.y, duration: 2.4 });
      move(sub, T, { x: q3.x, y: q3.y, duration: 2.2 });
      move(sub, T, { x: q3.x, y: q3.y, opacity: 0, duration: 0.8 });
      move(sub, T, { x: mouth.x, y: mouth.y, opacity: 0, duration: 0.01 });
      tl.add(sub, 0.4);
      Ts.push(T);
    }
    if (drug) Ts.forEach((T, i) => capIn(tl, T.layers.over, Math.max(7, 10 * k), headOf(T.pd1, 'pd1'), (T.pd1.r - 90), 0.1 + i * 0.08, { duration: 1 }));
    // labels
    const Rout = 236 * k;
    if (!cmp) {
      const wl = P(232, 214);
      label(root, 'Fibroblast and collagen barrier', 14, 30, { anchor: 'start', leader: [70, 36, wl.x, wl.y] });
      const hz = P(-38, 232);
      label(root, 'TGF-β haze', hz.x + 14, hz.y - 14, { cls: 't-small', anchor: 'start', leader: [hz.x + 12, hz.y - 10, hz.x - 4, hz.y + 6] });
      label(root, 'Killer T cells', mouth.x + 10, mouth.y + 44 * k + 14, { anchor: 'start' });
      label(root, 'Cancer cells', C.x, C.y + 5, { cls: 't-small' });
    } else {
      label(root, 'Barrier', 8, 20, { anchor: 'start', cls: 't-small' });
      label(root, 'TGF-β', C.x + Rout * 0.72, 20, { cls: 't-small', anchor: 'start' });
      label(root, 'T cells', W - 6, mouth.y + 36, { anchor: 'end', cls: 't-small' });
    }
    return { tl, still: drug ? 1.7 : 0 };
  }

  // ---- 6. No scouts, corrupt guards ---------------------------------------------------------
  function vNoScouts({ root, W, H, U, compact: cmp }) {
    bg(root, W, H, 61, 0.35);
    const tl = gsap.timeline();
    const PW = W / 2;
    mk('line', { x1: PW, y1: 14, x2: PW, y2: H - 14, stroke: 'rgb(169 177 204 / 0.32)', 'stroke-width': 1, 'stroke-dasharray': '3 5' }, root);
    label(root, 'TOO LITTLE PRIMING', PW / 2, cmp ? 20 : 28, { cls: 't-caps' });
    label(root, 'SUPPRESSOR CELLS', PW + PW / 2, cmp ? 20 : 28, { cls: 't-caps' });
    // explicit layouts (re-layout on phones rather than shrink)
    const L = cmp ? {
      C: [98, 108], k: 0.35, dcLab: [4, 206], dcText: 'Idle\ndendritic cell', dcAnchor: 'start',
      inset: [154, 232, 20], lnLab: 200, lab: [100, 272], labText: 'few tumor-specific\nT cells',
      r: [300, 128], cR: 38, tR: 19, mR: 13, tam: [362, 178, 33], m1: [238, 64], m2: [228, 190], treg: [358, 56, 13],
      supLab: [292, 44], sigLab: [306, 216], meter: [222, 232, 158],   // label clear of the meter title and the MDSC
    } : {
      C: [150, 178], k: 0.56, dcLab: [40, 300], dcText: 'Idle dendritic cell', dcAnchor: 'start',
      inset: [186, 380, 36], lnLab: 330, lab: [176, 444], labText: 'few tumor-specific T cells',
      r: [480, 226], cR: 44, tR: 22, mR: 15, tam: [586, 290, 44], m1: [384, 110], m2: [500, 348], treg: [570, 104, 15],
      supLab: [476, 70], sigLab: [480, 392], meter: [354, 414, 252],
    };
    // left: ch07-tme's Desert at vignette scale — the same nest inside a two-layer wall, an
    // immature dendritic cell outside it, and two T cells near the vessel; a few edge cells die quietly
    const D = tmeScene(root, { C: { x: L.C[0], y: L.C[1] }, k: L.k, mode: 'desert', vessel: PW - 2 });
    D.nest.slice().sort((p, q) => q.rr - p.rr).filter((c) => c.x < L.C[0] && c.y > L.C[1] - 10).slice(0, 2)
      .forEach((c, i) => setDying(c.art, i ? 0.85 : 0.55));
    if (D.mouth) {
      [[177, 66], [250, 155]].forEach(([dx, dy], i) => {
        const x = Math.min(PW - 10, L.C[0] + dx * L.k), y = L.C[1] + dy * L.k;
        const t = tCell({ variant: 'cd8', r: Math.max(6, 12 * L.k), state: 'activated', seed: 30 + i, stage: 'dark', receptors: false, polarity: 200 });
        t.setAttribute('transform', `translate(${f(x)} ${f(y)})`);
        root.append(t);
      });
    }
    label(root, L.dcText, L.dcLab[0], L.dcLab[1], { cls: 't-small', anchor: L.dcAnchor, leader: D.nest.dc ? [L.dcLab[0] + (cmp ? 18 : 30), L.dcLab[1] - (cmp ? 13 : 14), D.nest.dc.x, D.nest.dc.y + D.nest.dc.r * 0.7] : null });
    // inset: the lymph node, with few tumor-specific T cells
    const [ix, iy, ir] = L.inset;
    mk('circle', { cx: ix, cy: iy, r: f(ir + 6), fill: 'rgb(10 14 32 / 0.65)', stroke: 'rgb(159 195 217 / 0.55)', 'stroke-width': 1.2, 'stroke-dasharray': '3 4' }, root);
    const ln = lymphNode({ r: ir * 0.86, seed: 4, stage: 'dark', cells: false, afferent: 2 });
    ln.setAttribute('transform', `translate(${f(ix)} ${f(iy)})`);
    root.append(ln);
    for (const [dx, dy] of [[-0.12, 0.05], [0.18, -0.08]]) {
      const t = tCell({ variant: 'cd8', r: ir * 0.1, seed: 5, stage: 'dark', receptors: false });
      t.setAttribute('transform', `translate(${f(ix + dx * ir * 2)} ${f(iy + dy * ir * 2)})`);
      root.append(t);
    }
    label(root, 'LYMPH NODE', ix, L.lnLab, { cls: 't-caps' });
    label(root, L.labText, L.lab[0], L.lab[1], { cls: 't-small' });
    // right: a T cell docked on a cancer cell amid suppressive cells
    const [rx, ry] = L.r;
    const hz = ctx.radialGradient(root, [[0, '#8E84B8', 0.32], [0.55, '#8E84B8', 0.16], [1, '#8E84B8', 0]]);
    mk('circle', { cx: rx, cy: ry, r: f(PW * 0.62), fill: hz }, root);
    const cArt = cancerCell({ r: L.cR, seed: 95, stage: 'dark', receptors: false, nuclei: 1 });
    for (const a of [160, 220, 280, 340, 40, 100]) seat(cArt, (o) => mhc1({ ...o, peptide: 'neo' }), a, L.cR * 0.3, { detail: 'low' });
    const cx2 = rx + L.cR * 0.55, cy2 = ry + 8 * U;
    const C = rig(cArt, { x: cx2, y: cy2, parent: root, seed: 95 });
    const tArt = tCell({ variant: 'cd8', r: L.tR, state: 'activated', seed: 13, stage: 'dark', receptors: false, polarity: 0 });
    const tp = seat(tArt, (o) => pd1({ ...o, icon: false }), -95, L.tR * 0.5, { detail: 'low' });
    seat(tArt, (o) => tcr(o), 0, L.tR * 0.5, { detail: 'low' });
    const T = rig(tArt, { x: cx2 - L.cR - L.tR * 1.28, y: cy2, parent: root, seed: 13 });
    const gran = granulesOf(tArt); if (gran) gran.setAttribute('opacity', 0.35);
    disc(T.layers.over, 'activating', L.tR * 1.36, L.tR * 0.72, L.tR * 0.5, 1);
    const sup = [];
    const put = (art, x, y) => { art.setAttribute('transform', `translate(${f(x)} ${f(y)})`); root.append(art); sup.push({ x, y }); breatheCell(art); return art; };
    put(mdsc({ r: L.mR, seed: 2, stage: 'dark' }), L.m1[0], L.m1[1]);
    put(mdsc({ r: L.mR * 0.93, seed: 7, stage: 'dark' }), L.m2[0], L.m2[1]);
    put(macrophage({ r: L.tam[2], variant: 'tam', seed: 4, stage: 'dark' }), L.tam[0], L.tam[1]);
    put(tCell({ variant: 'treg', r: L.treg[2], seed: 8, stage: 'dark' }), L.treg[0], L.treg[1]);
    // suppressive signals: small dots in each sender's color, drifting toward the T cell
    const dots = mk('g', {}, root);
    const cols = [PALETTE.mdsc, PALETTE.mdsc, PALETTE.tam, PALETTE.treg];
    sup.forEach((sp, i) => {
      for (let j = 0; j < 3; j++) {
        const t = 0.3 + j * 0.2;
        const x = sp.x + (T.plan.x - sp.x) * t + ((j * 7) % 5 - 2) * 3, y = sp.y + (T.plan.y - sp.y) * t + ((j * 11) % 5 - 2) * 3;
        mk('circle', { cx: f(x), cy: f(y), r: f(2.6 * U), fill: cols[i], opacity: 0.85 }, dots);
      }
    });
    label(root, 'suppressive molecules', L.sigLab[0], L.sigLab[1], { cls: 't-small' });
    // T-cell activity meter (Illustrative)
    const [mx, my, mw] = L.meter;
    const m = meter(root, { mode: 'segments', count: 6, width: mw, title: 'T-cell activity', tone: 'benefit', tag: cmp ? null : 'Illustrative', x: mx, y: my, values: 0.18 });
    if (cmp) label(root, 'ILLUSTRATIVE', mx + mw, my + 62, { cls: 't-caps', anchor: 'end', halo: false });
    // suppressive cells: one label, a leader to each
    const sg = label(root, 'suppressor cells', L.supLab[0], L.supLab[1], { cls: 't-small' });
    [sup[0], sup[3]].forEach((sp) => {
      const dx = sp.x - L.supLab[0], dy = sp.y - L.supLab[1], d = Math.hypot(dx, dy) || 1;
      const rr = L.mR * 1.3;
      mk('line', { x1: f(L.supLab[0] + dx * Math.min(0.5, 16 / d)), y1: f(L.supLab[1] + 7 + dy * Math.min(0.5, 16 / d)), x2: f(sp.x - (dx / d) * rr), y2: f(sp.y - (dy / d) * rr), class: 'leader' }, sg);
    });
    if (drug) {
      capIn(tl, T.layers.over, L.tR * 0.5, headOf(tp, 'pd1'), -95, 0.2);
      m.set(0.5, { tl, duration: 1.1, pos: 1.4 });
      if (gran) fadeTo(tl, gran, 0.65, 1.4, 1);
    }
    void C;
    return { tl, still: 'end' };
  }

  // ---- 7. Host factors (static icon trio) ---------------------------------------------------
  function vHost({ root, W, H, U, compact: cmp }) {
    bg(root, W, H, 71, 0.35);
    const tl = gsap.timeline();
    const lnx = W * (cmp ? 0.77 : 0.76), lny = H * 0.5, lnr = (cmp ? 54 : 78) * U;
    const ln = lymphNode({ r: lnr, seed: 2, stage: 'dark' });
    ln.setAttribute('transform', `translate(${f(lnx)} ${f(lny)})`);
    root.append(ln);
    label(root, 'LYMPH NODE', lnx, lny + lnr * 0.72 + (cmp ? 22 : 30), { cls: 't-caps' });
    const ix = W * (cmp ? 0.2 : 0.2);
    const rows = [H * 0.2, H * 0.5, H * 0.8];
    const arrows = mk('g', { fill: 'none', stroke: 'rgb(201 211 232 / 0.55)', 'stroke-width': 1.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, root);
    rows.forEach((y, i) => {
      const x0 = ix + (cmp ? 62 : 92) * U, x1 = lnx - lnr * 0.95, y1 = lny + (i - 1) * lnr * 0.32;
      const mx = (x0 + x1) / 2;
      mk('path', { d: `M${f(x0)} ${f(y)}C${f(mx)} ${f(y)} ${f(mx)} ${f(y1)} ${f(x1)} ${f(y1)}` }, arrows);
      mk('path', { d: `M${f(x1 - 9)} ${f(y1 - 6)}L${f(x1)} ${f(y1)}L${f(x1 - 9)} ${f(y1 + 6)}` }, arrows);
    });
    // HLA genes: two pairs of shop windows — one varied, one identical
    const hy = rows[0];
    const pairG = mk('g', {}, root);
    const cupS = (cmp ? 26 : 32) * U;
    const pair = (x, kinds, cap) => {
      mk('path', { d: `M${f(x - cupS * 0.9)} ${f(hy + 4)}H${f(x + cupS * 0.9)}`, stroke: '#D9DEEA', 'stroke-opacity': 0.4, 'stroke-width': 2, 'stroke-linecap': 'round' }, pairG);
      kinds.forEach(([pk, an], j) => {
        const g = mhc1({ size: cupS, stage: 'dark', detail: 'high', peptide: 'self', pockets: pk, anchors: an });
        g.setAttribute('transform', `translate(${f(x + (j ? 0.45 : -0.45) * cupS)} ${f(hy + 4)})`);
        pairG.append(g);
      });
      label(root, cap, x, hy + (cmp ? 26 : 30) * U, { cls: 't-small' });
    };
    const A = [['round', 'round'], ['circle', 'circle']], B = [['square', 'triangle'], ['square', 'triangle']];
    pair(ix - 44 * U, [A, B], 'varied');
    pair(ix + 44 * U, [A, A], 'identical');
    label(root, 'HLA alleles', ix, hy - cupS - (cmp ? 12 : 16), { cls: 't-label' });
    // gut microbes
    const my = rows[1];
    [[-26, -8, 20], [-4, 10, -25], [18, -10, 60], [32, 12, 5], [6, -24, 90]].forEach(([dx, dy, a], i) => {
      const b = bacterium({ shape: 'rod', r: 11 * U, angle: a, seed: 3 + i, stage: 'dark', flagella: i === 2 ? 1 : 0 });
      b.setAttribute('transform', `translate(${f(ix + dx * U)} ${f(my + dy * U)})`);
      root.append(b);
    });
    label(root, 'Gut microbes', ix, my + (cmp ? 40 : 46) * U, { cls: 't-label' });
    // medicines: a capsule
    const py = rows[2];
    const cap = mk('g', { transform: `translate(${f(ix)} ${f(py)}) rotate(-28)` }, root);
    const cw = 30 * U, ch = 12 * U;
    mk('path', { d: `M0 ${f(-ch)}H${f(-cw + ch)}A${f(ch)} ${f(ch)} 0 0 0 ${f(-cw + ch)} ${f(ch)}H0Z`, fill: '#E9EEF8', stroke: '#C9D3E8', 'stroke-width': 1.2 }, cap);
    mk('path', { d: `M0 ${f(-ch)}H${f(cw - ch)}A${f(ch)} ${f(ch)} 0 0 1 ${f(cw - ch)} ${f(ch)}H0Z`, fill: '#8FA2D6', stroke: '#C9D3E8', 'stroke-width': 1.2 }, cap);
    mk('path', { d: `M${f(-cw + ch * 0.9)} ${f(-ch * 0.45)}H${f(-ch * 0.4)}`, stroke: '#fff', 'stroke-opacity': 0.7, 'stroke-width': 2, 'stroke-linecap': 'round' }, cap);
    label(root, 'Medicines', ix, py + (cmp ? 34 : 40) * U, { cls: 't-label' });

    return { tl, still: 'end' };
  }

  const BUILDERS = { 'brake-on': vBrake, 'nothing-new': vNothingNew, 'shop-window': vShopWindow, deaf: vDeaf, excluded: vExcluded, 'walled-off': vExcluded, 'no-scouts': vNoScouts, host: vHost };

  // ================================================================ scene management
  let root = null;
  function buildScene({ fade = true } = {}) {
    player.kill();
    stopBreath();
    const m = MECHS[idx];
    const L = compact ? { W: 400, H: 300, U: 0.88 } : { W: 640, H: 480, U: 1 };
    svg.setAttribute('viewBox', `0 0 ${L.W} ${L.H}`);
    const old = root;
    root = mk('g', { 'data-vignette': m.id }, svg);
    if (old) old.remove();
    const fn = BUILDERS[m.id] || vHost;
    let out;
    try {
      out = fn({ root, ...L, compact });
    } catch (e) {
      console.error(`[figure ${ID}] vignette ${m.id} failed`, e);
      out = { tl: gsap.timeline(), still: 'end' };
    }
    ctx.refreshTextScale?.();
    if (fade && !ctx.reducedMotion) gsap.fromTo(root, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'so.out' });
    player.start(out.tl, out.still);
  }

  // ---------------------------------------------------------------- wheel + badge + extras
  function applyWheel() {
    const m = MECHS[idx];
    const on = drug;
    wheel.setStates(on ? m.pd1.states : m.states);
    wheel.halo(m.halo);
    wheel.ring(on ? PD1.acts : [], 'acts');
    wheel.ring(on ? PD1.also : [], 'also');
    if (m.id === 'host') wheel.setCenter('No single broken step');
    else wheel.setCenter(null);
    if (on && m.pd1.outcome === 'yes') wheel.pulse(7, 'repair');
  }
  function paintBadge() {
    const m = MECHS[idx];
    if (drug) badge.set(m.pd1.outcome, m.pd1.label || m.pd1.text.replace(/^[✓✕≈~]\s*/, ''));
    badge.el.hidden = !drug;
    hint.hidden = drug;
  }
  // what the gold rings on the wheel mean (anti-PD-1 acts mainly at 6–7; the thin ring at 3 is
  // the stem-like reserve refuelling priming — Chapters 8 and 12), shown only while the drug is on
  const ringKey = h('p', { class: 'r12-note r12-ringkey' }, 'Gold rings: where anti-PD-1 acts (thin ring: it also helps refuel priming).');
  function paintKey() {
    if (drug) { if (!ringKey.isConnected) extra.append(ringKey); } else ringKey.remove();
  }
  function paintExtras() {
    const m = MECHS[idx];
    extra.replaceChildren();
    if (m.id === 'nothing-new' || m.id === 'deaf' || m.id === 'shop-window') {
      ctx.ui.button({ label: 'Replay', icon: 'replay', variant: 'ghost', parent: extra, onClick: () => { nk = false; buildScene(); } });
    }
    if (m.id === 'shop-window') {
      ctx.ui.button({ label: 'Who else could detect it?', icon: 'spark', parent: extra, onClick: () => { nk = true; buildScene(); ctx.announce('An NK cell arrives. It checks for missing MHC class I, and kills.'); } });
      extra.append(h('p', { class: 'r12-note' }, 'NK cells and γδ T cells can sometimes attack cells that lack MHC class I.'));
    }
    paintKey();
  }
  function paintCaption() {
    const st = ctx.steps[idx];
    const m = MECHS[idx];
    cap.innerHTML = '';
    cap.append(h('b', null, `${m.n}. ${m.title}.`));
    const span = h('span', { html: st ? st.html : '' });
    cap.append(span);
    if (m.profile) {
      const a = h('a', { class: 'r12-fix', href: '#fig-12-2' }, 'Try fixing this tumor ↓');
      a.addEventListener('click', () => {
        // ch12-combinations picks this up now (if mounted) or when it mounts
        document.documentElement.dataset.c12Profile = m.profile;
        document.dispatchEvent(new CustomEvent('sao:c12-profile', { detail: { profile: m.profile } }));
      }, { signal: ctx.signal });
      cap.append(' ', a);
    }
  }

  function select(i) {
    if (i < 0 || i >= MECHS.length) return;
    idx = i;
    drug = false;
    nk = false;
    sw.set(false);
    mselect.value = MECHS[i].id;
    syncRadios();
    applyWheel();
    paintBadge();
    paintExtras();
    paintCaption();
    buildScene();
  }
  function setDrug(on) {
    drug = !!on;
    nk = false;
    applyWheel();
    paintBadge();
    paintKey();
    buildScene();
    const m = MECHS[idx];
    ctx.announce(drug ? `Anti-PD-1 added. ${m.pd1.text}` : 'Anti-PD-1 removed.');
  }

  // keyboard: arrows move the radio selection (roving tabindex)
  tray.addEventListener('keydown', (e) => {
    let j = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = (idx + 1) % MECHS.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = (idx - 1 + MECHS.length) % MECHS.length;
    else if (e.key === 'Home') j = 0;
    else if (e.key === 'End') j = MECHS.length - 1;
    if (j == null) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    chips.set(MECHS[j].id);
    select(j);
    chips.buttons.get(MECHS[j].id).focus();
  }, { capture: true, signal: ctx.signal });

  wheel.onStep((n) => ctx.announce(`Step ${n}: ${CD.STEPS[n - 1].name}`));

  ctx.onResize(({ compact: c }) => {
    if (c !== compact) { compact = c; buildScene({ fade: false }); drawZones(); }
  });

  syncRadios();
  applyWheel();
  paintBadge();
  paintExtras();
  paintCaption();
  buildScene({ fade: false });

  return {
    destroy() { player.kill(); stopBreath(); wheel.destroy(); },
  };
}
