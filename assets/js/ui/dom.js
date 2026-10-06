// Self & Other — tiny DOM helpers shared by site.js, UI components and figures.
// No dependencies. Everything here is safe to import from a figure module:
//   import { h, svg, icon } from '../ui/dom.js';

/** Site root URL, resolved from this file's location (works from any subpath). */
export const ROOT = new URL('../../../', import.meta.url);
/** Resolve a path relative to the site root, e.g. asset('assets/data/glossary.json'). */
export const asset = (path) => new URL(path, ROOT).href;

const SVG_NS = 'http://www.w3.org/2000/svg';
// SVG attributes that must keep their camelCase spelling.
const SVG_CAMEL = new Set([
  'viewBox', 'preserveAspectRatio', 'gradientUnits', 'gradientTransform', 'patternUnits',
  'patternContentUnits', 'patternTransform', 'stdDeviation', 'markerWidth', 'markerHeight',
  'markerUnits', 'refX', 'refY', 'pathLength', 'textLength', 'lengthAdjust', 'startOffset',
  'clipPathUnits', 'maskUnits', 'maskContentUnits', 'filterUnits', 'primitiveUnits',
  'baseFrequency', 'numOctaves', 'tableValues', 'kernelMatrix', 'spreadMethod', 'xChannelSelector',
  'yChannelSelector', 'diffuseConstant', 'specularExponent', 'surfaceScale', 'edgeMode',
]);
const kebab = (k) => k.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());

function applyAttrs(el, attrs, isSvg) {
  if (!attrs) return el;
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === 'text') el.textContent = v;
    else if (k === 'html') el.innerHTML = v;
    else if (k === 'class' || k === 'className') el.setAttribute('class', Array.isArray(v) ? v.filter(Boolean).join(' ') : v);
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else if (k === 'dataset') Object.assign(el.dataset, v);
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'children') appendAll(el, v);
    else {
      const name = isSvg ? (SVG_CAMEL.has(k) || k.includes('-') || k.includes(':') ? k : kebab(k)) : k;
      if (name.startsWith('xlink:')) el.setAttributeNS('http://www.w3.org/1999/xlink', name, v);
      else el.setAttribute(name, v === true ? '' : v);
    }
  }
  return el;
}
function appendAll(el, children) {
  for (const c of [].concat(children)) {
    if (c == null || c === false) continue;
    el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
}

/** Create an HTML element: h('button', { class: 'btn', onClick }, 'Label', childNode) */
export function h(tag, attrs, ...children) {
  const el = applyAttrs(document.createElement(tag), attrs, false);
  appendAll(el, children);
  return el;
}

/**
 * Create an SVG element. camelCase attribute names become kebab-case
 * (strokeWidth → stroke-width) except real SVG camelCase ones (viewBox…).
 *   svg('circle', { cx: 10, cy: 10, r: 4, fill: 'red' }, parentGroup)
 */
export function svg(tag, attrs, parent) {
  const el = applyAttrs(document.createElementNS(SVG_NS, tag), attrs, true);
  if (parent) parent.append(el);
  return el;
}

/** Parse an HTML string into a DocumentFragment. */
export function frag(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content;
}

export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const qs = (sel, root = document) => root.querySelector(sel);
export const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const rmq = typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : null;
export const prefersReducedMotion = () => !!(rmq && rmq.matches);
export function onReducedMotionChange(fn) {
  if (!rmq) return () => {};
  const l = () => fn(rmq.matches);
  rmq.addEventListener('change', l);
  return () => rmq.removeEventListener('change', l);
}

/** rAF-throttled function (for scroll / resize handlers). */
export function rafThrottle(fn) {
  let queued = false;
  let lastArgs;
  return (...args) => {
    lastArgs = args;
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; fn(...lastArgs); });
  };
}

let uid = 0;
export const uniqueId = (prefix = 'so') => `${prefix}-${(++uid).toString(36)}`;

/** Fetch JSON once per URL (shared promise). */
const jsonCache = new Map();
export function fetchJSON(path) {
  const url = asset(path);
  if (!jsonCache.has(url)) {
    jsonCache.set(url, fetch(url).then((r) => {
      if (!r.ok) throw new Error(`${r.status} ${url}`);
      return r.json();
    }));
  }
  return jsonCache.get(url);
}

// ------------------------------------------------------------------ icons
// 24×24 stroke icons (1.75 stroke, round joins). icon('play') → SVG string.
const P = {
  prev: '<path d="M15 5l-7 7 7 7"/>',
  next: '<path d="M9 5l7 7-7 7"/>',
  play: '<path d="M8 5.5v13a.6.6 0 0 0 .9.5l10.2-6.5a.6.6 0 0 0 0-1L8.9 5a.6.6 0 0 0-.9.5z" fill="currentColor" stroke="none"/>',
  pause: '<rect x="6.5" y="5" width="3.6" height="14" rx="1" fill="currentColor" stroke="none"/><rect x="13.9" y="5" width="3.6" height="14" rx="1" fill="currentColor" stroke="none"/>',
  replay: '<path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4v5h5"/>',
  reset: '<path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4v5h5"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h10"/>',
  book: '<path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5z"/><path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H13v16h5.5a1.5 1.5 0 0 0 1.5-1.5z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4"/>',
  moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
  auto: '<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5v17a8.5 8.5 0 0 0 0-17z" fill="currentColor" stroke="none"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  figure: '<rect x="3.5" y="5" width="17" height="14" rx="2.5"/><circle cx="9" cy="11" r="2.2"/><path d="M20.5 15.5l-5-4.5-7.5 8"/>',
  arrowLeft: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  arrowUp: '<path d="M12 19V5M6 11l6-6 6 6"/>',
  chevronDown: '<path d="M6 9l6 6 6-6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l8-8M16 7l2 2M14 9l2 2"/>',
  clinic: '<path d="M9.5 3.5h5v6h6v5h-6v6h-5v-6h-6v-5h6z"/>',
  note: '<path d="M5 4h10l4 4v12H5z"/><path d="M15 4v4h4M8.5 12.5h7M8.5 16h5"/>',
  layers: '<path d="M12 3.5l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
  spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/>',
  // Figure vocabulary (FIGURE-AUDIT §3): treatments, conditions, outcomes
  scalpel: '<path d="M3.5 20.5l6-6"/><path d="M9.5 14.5L19 5c1.2 3.6-.9 7.8-6.3 12.6z"/>',
  syringe: '<path d="M17 3l4 4M19 5l-3 3"/><path d="M16 8L8 16l-2-2 8-8z"/><path d="M14 6l4 4M10 10l1.5 1.5M8 12l1.5 1.5"/><path d="M7 15l-3.5 3.5"/>',
  pill: '<path d="M10.6 20.4a4.9 4.9 0 0 1-7-7l9.8-9.8a4.9 4.9 0 0 1 7 7z"/><path d="M8.5 8.5l7 7"/>',
  plane: '<path d="M2.5 14.8l8-3.6V5.2a1.5 1.5 0 0 1 3 0v6l8 3.6v2.1l-8-2.4v4.4l2.5 1.8v1.6L12 21.4l-4 .9v-1.6l2.5-1.8v-4.4l-8 2.4z"/>',
  thermometer: '<path d="M14 14.8V4.5a2.5 2.5 0 0 0-5 0v10.3a4.5 4.5 0 1 0 5 0z"/><path d="M11.5 17.5V9"/>',
  drop: '<path d="M12 3.2l5.6 6a7.6 7.6 0 1 1-11.2 0z"/>',
  bolt: '<path d="M13 2.5L4.5 13.5h6.5l-1 8 8.5-11h-6.5z"/>',
  padlock: '<rect x="4.5" y="10.5" width="15" height="10.5" rx="2"/><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5M12 14.5v2.5"/>',
  smoke: '<path d="M7 21c-2.2-2.2 2.2-4.3 0-6.5s2.2-4.3 0-6.5"/><path d="M12 21c-2.2-2.2 2.2-4.3 0-6.5s2.2-4.3 0-6.5S14.2 3.7 12 2"/><path d="M17 21c-2.2-2.2 2.2-4.3 0-6.5s2.2-4.3 0-6.5"/>',
  shield: '<path d="M12 2.8l7.5 3v5.6c0 4.6-3.2 8.4-7.5 9.8-4.3-1.4-7.5-5.2-7.5-9.8V5.8z"/>',
  block: '<path d="M3.5 12h12.5" stroke-width="2.2"/><path d="M17.5 5.5v13" stroke-width="2.2"/>',
  tilde: '<path d="M4 13.5c2-3.2 4.6-3.6 7.6-1.2s5.4 2 8.4-1.2"/>',
  info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.6v.2"/>',
  approx: '<path d="M4 10c2-3.2 4.6-3.6 7.6-1.2s5.4 2 8.4-1.2"/><path d="M4 16.5c2-3.2 4.6-3.6 7.6-1.2s5.4 2 8.4-1.2"/>',
};
export function icon(name, cls = '') {
  const body = P[name] || P.spark;
  return `<svg class="ico ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;
}
export const ICONS = Object.keys(P);
/** Raw path markup of an icon (24×24 user space), for building SVG icons inside a stage. */
export const iconPaths = (name) => P[name] || P.spark;
