// shared/exhaustion-marks.js — the exhaustion vocabulary used by ch05-exhaustion and ch08-two-brakes.
// Owner: figure task F13 (both figures). FIGURE-AUDIT §2A: ch08-two-brakes "reuses ch05-exhaustion's
// stem-like/terminal vocabulary verbatim", so both figures draw these marks with this one module.
// Local fallback until the art library offers the same marks (requested in the F13 report).
//
//   brakeBadge({ x, y, size })      crimson "−" disc = one inhibitory receptor (PD-1, TIM-3, LAG-3…);
//                                   setStruck(badge, k) greys it and strikes it through (brake released)
//   toxTag({ x, y, grow })          small "TOX" pill: every cell of the exhausted lineage, stem-like included
//                                   (grow: 'right' | 'left', the side it extends to when phones enlarge it)
//   tcf1Badge({ x, y })             sprout + "TCF1": the stem-like (progenitor) reserve
//   lockBadge(ctx, { x, y, r })     padlock disc: terminal differentiation (TCF1 lost), NOT "has TOX"
//   markLayout(R)                   where each mark sits around a cell of radius R (same in both figures)
//   MARK_CSS(scope)                 text styles for the marks, scoped to a figure
//   NAMES / CARDS                   the shared words (labels and info-card text)
import { signalIcon } from '../../art/index.js';

const NS = 'http://www.w3.org/2000/svg';
const n = (v) => String(Math.round(v * 100) / 100);
function S(tag, attrs = {}, parent) {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) if (k !== 'text' && attrs[k] != null) e.setAttribute(k, String(attrs[k]));
  if (attrs.text != null) e.textContent = attrs.text;
  if (parent) parent.appendChild(e);
  return e;
}

/** The words both figures use, verbatim. */
export const NAMES = Object.freeze({
  stem: 'stem-like (progenitor)',
  terminal: 'terminally exhausted',
  lock: 'terminal (TCF1 lost)',
  tox: 'TOX',
  tcf1: 'TCF1',
});

/** Info-card text (ch05-exhaustion spec, verbatim where the spec gives it). */
export const CARDS = Object.freeze({
  stem: 'TCF1 high, PD-1 moderate. Also TOX+: already committed to the exhausted family. Renews itself, sits mostly in lymphoid tissue, sends out new cells. Responds when PD-1 is released.',
  terminal: 'TCF1 lost; PD-1, TIM-3 and LAG-3 high. Still kills (in tumors these are the main killers) but rarely divides and is short-lived. Barely responds when PD-1 is released.',
  memory: 'Long-lived, fully functional, no inhibitory receptors.',
  functions: ['Proliferate', 'IL-2', 'TNF/IFN-γ', 'Kill'],
});

/**
 * Where the marks sit around a T cell of membrane radius R (cell centred at 0,0).
 * The TOX and TCF1 pills sit side by side under the cell with a 4-unit gap between their facing
 * edges; on phones they grow away from that gap (see .ex-k in MARK_CSS), so they never touch.
 */
export function markLayout(R) {
  const badges = [-160, -124, -88].map((deg) => {
    const a = (deg * Math.PI) / 180;
    return [Math.cos(a) * (R + 8), Math.sin(a) * (R + 8)];
  });
  // toxLeft: mirrored TOX spot (use with grow: 'left') for a cell whose right-hand neighbor is close
  return { badges, tox: [19, R + 9], toxLeft: [-19, R + 9], tcf1: [-29, R + 9.5], lock: [R + 5, -R + 3] };
}

/** Text styles for the marks (sizes in SVG user units, floors in rendered px like the .t-* classes). */
export function MARK_CSS(scope) {
  return `
${scope} svg .ex-tag { font-family: var(--font-ui); font-size: max(11px, calc(11px * var(--u, 1))); font-weight: 680; letter-spacing: 0.06em; fill: #E9ECF6; }
${scope} svg .ex-k { transform: scale(max(1, var(--u, 1))); transform-box: fill-box; }
${scope} svg .ex-k .ex-tag { font-size: 11px; }
${scope} svg .ex-tox .ex-k { transform-origin: 0% 50%; }
${scope} svg .ex-tcf1 .ex-k, ${scope} svg .ex-tox--left .ex-k { transform-origin: 100% 50%; }
${scope} svg .ex-pill { fill: rgb(11 16 36 / 0.86); stroke: rgb(201 211 232 / 0.62); stroke-width: 1; vector-effect: non-scaling-stroke; }
${scope} svg .ex-pill--tcf1 { stroke: rgb(143 227 176 / 0.8); }
${scope} svg .ex-sprout { fill: none; stroke: #8FE3B0; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
${scope} svg .ex-sprout-leaf { fill: #8FE3B0; stroke: none; }
${scope} svg .ex-lock-disc { fill: rgb(11 16 36 / 0.9); stroke: rgb(233 236 246 / 0.7); stroke-width: 1.1; vector-effect: non-scaling-stroke; }
`;
}

/** Crimson "−" disc (one inhibitory receptor). Strike-through overlay starts hidden. */
export function brakeBadge({ x = 0, y = 0, size = 13 } = {}) {
  const g = S('g', { class: 'ex-brake', transform: `translate(${n(x)} ${n(y)})` });
  g.appendChild(signalIcon({ type: 'inhibitory', size }));
  const r = size / 2;
  const over = S('g', { 'data-part': 'struck', opacity: 0 }, g);
  S('circle', { r: n(r), fill: '#4A5068', stroke: '#9AA1B5', 'stroke-width': n(Math.max(0.6, size * 0.07)) }, over);
  S('path', { d: `M${n(-r * 0.55)} 0H${n(r * 0.55)}`, stroke: '#C9CEDB', 'stroke-width': n(Math.max(0.8, size * 0.15)), 'stroke-linecap': 'round' }, over);
  S('path', { d: `M${n(-r * 1.15)} ${n(r * 1.15)}L${n(r * 1.15)} ${n(-r * 1.15)}`, stroke: '#E9ECF6', 'stroke-width': n(Math.max(1.2, size * 0.13)), 'stroke-linecap': 'round' }, over);
  g.struck = over;
  return g;
}

/** 0 = active brake, 1 = released (greyed and struck through). */
export function setStruck(badge, k) {
  if (badge && badge.struck) badge.struck.setAttribute('opacity', n(Math.max(0, Math.min(1, k))));
}

/** "TOX" pill, centered at (x, y); on phones it grows toward `grow` (away from a TCF1 badge on its left). */
export function toxTag({ x = 0, y = 0, grow = 'right' } = {}) {
  const g = S('g', { class: grow === 'left' ? 'ex-tox ex-tox--left' : 'ex-tox', transform: `translate(${n(x)} ${n(y)})` });
  const k = S('g', { class: 'ex-k' }, g);     // pill + text scale together with the text floor (phones)
  S('rect', { class: 'ex-pill', x: -17, y: -8.5, width: 34, height: 17, rx: 8.5 }, k);
  S('text', { class: 'ex-tag', x: 0, y: 4, 'text-anchor': 'middle', text: NAMES.tox }, k);
  return g;
}

/** Sprout badge "TCF1", centered at (x, y). */
export function tcf1Badge({ x = 0, y = 0 } = {}) {
  const g = S('g', { class: 'ex-tcf1', transform: `translate(${n(x)} ${n(y)})` });
  const k = S('g', { class: 'ex-k' }, g);
  S('rect', { class: 'ex-pill ex-pill--tcf1', x: -27, y: -9, width: 54, height: 18, rx: 9 }, k);
  const sp = S('g', { transform: 'translate(-17 0)' }, k);
  S('path', { class: 'ex-sprout', d: 'M0 6 V-1' }, sp);
  S('path', { class: 'ex-sprout-leaf', d: 'M0 -1 C-1 -5 -5 -6 -7 -5 C-6 -2 -3 -0.5 0 -1Z' }, sp);
  S('path', { class: 'ex-sprout-leaf', d: 'M0 0.5 C1 -4 5 -5.5 7 -4.5 C6 -1.5 3 0.5 0 0.5Z' }, sp);
  S('text', { class: 'ex-tag', x: 6, y: 4, 'text-anchor': 'middle', text: NAMES.tcf1 }, k);
  return g;
}

/** Padlock disc (terminal differentiation). Needs ctx for the UI icon set. */
export function lockBadge(ctx, { x = 0, y = 0, r = 9.5 } = {}) {
  const g = S('g', { class: 'ex-lock', transform: `translate(${n(x)} ${n(y)})` });
  S('circle', { class: 'ex-lock-disc', r: n(r) }, g);
  ctx.iconSVG('padlock', { x: 0, y: -0.3, size: r * 1.35, color: '#E9ECF6', strokeWidth: 2.1 }, g);
  return g;
}
