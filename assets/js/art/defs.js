// Self & Other — illustration library
// defs.js: shared <defs> (gradients, filters) with collision-proof, de-duplicated ids.
//
// How it works
// ------------
// Factories ask for paints such as bodyFill('#4C8DFF', 'dark'); this registers a gradient
// definition (keyed by its content, ids prefixed "sao-") and returns "url(#sao-…)".
// In a page, every definition lives ONCE in a single hidden holder <svg id="sao-art-defs">
// appended to <body>. Any inline SVG in the document can reference it, so:
//   • there are no duplicate ids even with 20 figures on one page,
//   • figures hidden with display:none never break other figures' gradients
//     (a classic bug when defs live inside a hidden SVG),
//   • you normally never need to think about defs at all.
// For standalone SVG (download/export, sprites) call inlineDefs(svg) to copy the
// referenced definitions into that SVG.

import { SVG_NS } from './svg.js';
import { tones, mix, resolve, stageOf, WHITE } from './palette.js';

const PREFIX = 'sao-';
const HOLDER_ID = 'sao-art-defs';
const registry = new Map(); // id -> { tag, attrs, children: [{tag, attrs}] }
let holder = null;
let holderDefs = null;

function hash(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(36);
}

function build(doc, spec) {
  const node = doc.createElementNS(SVG_NS, spec.tag);
  for (const k in spec.attrs) if (spec.attrs[k] != null) node.setAttribute(k, String(spec.attrs[k]));
  for (const c of spec.children || []) node.appendChild(build(doc, c));
  return node;
}

/** Make sure the page-level holder exists (idempotent, cheap). */
export function ensureDefs(svgRoot) {
  const doc = (svgRoot && svgRoot.ownerDocument) || (typeof document !== 'undefined' ? document : null);
  if (!doc) return null;
  if (holder && holder.isConnected && holder.ownerDocument === doc) return holderDefs;
  holder = doc.getElementById(HOLDER_ID);
  if (!holder) {
    holder = doc.createElementNS(SVG_NS, 'svg');
    holder.setAttribute('id', HOLDER_ID);
    holder.setAttribute('aria-hidden', 'true');
    holder.setAttribute('focusable', 'false');
    holder.setAttribute('width', '0');
    holder.setAttribute('height', '0');
    holder.setAttribute(
      'style',
      'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none;left:-9999px;top:0'
    );
    holderDefs = doc.createElementNS(SVG_NS, 'defs');
    holder.appendChild(holderDefs);
    (doc.body || doc.documentElement).appendChild(holder);
  } else {
    holderDefs = holder.querySelector('defs') || holder.appendChild(doc.createElementNS(SVG_NS, 'defs'));
  }
  // (re)materialize everything registered so far
  for (const [id, spec] of registry) {
    if (!holderDefs.querySelector(`#${CSS.escape(id)}`)) holderDefs.appendChild(build(doc, spec));
  }
  if (svgRoot && svgRoot.setAttribute) svgRoot.setAttribute('data-sao-art', '');
  return holderDefs;
}

/** Register a definition; returns its id. spec = { tag, attrs, children }. */
export function define(kind, spec) {
  const body = JSON.stringify(spec);
  const id = `${PREFIX}${kind}-${hash(body)}`;
  if (!registry.has(id)) {
    const full = { ...spec, attrs: { ...spec.attrs, id } };
    registry.set(id, full);
    if (typeof document !== 'undefined') {
      const d = ensureDefs();
      if (d && !d.ownerDocument.getElementById(id)) d.appendChild(build(d.ownerDocument, full));
    }
  }
  return id;
}

export const url = (id) => `url(#${id})`;

function stops(list) {
  return list.map(([offset, color, opacity = 1]) => ({
    tag: 'stop',
    attrs: { offset, 'stop-color': color, 'stop-opacity': +(+opacity).toFixed(3) },
  }));
}

/** Generic radial gradient → url(). attrs override cx/cy/r/fx/fy/gradientUnits. */
export function radial(kind, stopList, attrs = {}) {
  return url(define(kind, { tag: 'radialGradient', attrs: { cx: 0.5, cy: 0.5, r: 0.5, ...attrs }, children: stops(stopList) }));
}
/** Generic linear gradient → url(). */
export function linear(kind, stopList, attrs = {}) {
  return url(define(kind, { tag: 'linearGradient', attrs: { x1: 0, y1: 0, x2: 0, y2: 1, ...attrs }, children: stops(stopList) }));
}

// ---------------------------------------------------------------- cell paints

/**
 * Cytoplasm fill. Default uses objectBoundingBox (works for any blob).
 * Pass { r } to get a userSpaceOnUse gradient centred on (0,0) with radius r —
 * used for cells with long arms (dendritic cells, fibroblasts) so the glow follows the body.
 */
export function bodyFill(color, stage = 'dark', { intensity = 1, desat = 0, r = null, cx = 0, cy = 0 } = {}) {
  const t = tones(color, stage, { intensity, desat });
  const list = stage === 'light'
    ? [[0, t.bodyIn], [0.65, t.bodyMid], [1, t.bodyOut]]
    : [[0, t.bodyIn, 0.86], [0.55, t.bodyMid, 0.9], [0.86, t.bodyOut, 0.95], [1, mix(t.bodyOut, WHITE, 0.12), 0.97]];
  const attrs = r
    ? { gradientUnits: 'userSpaceOnUse', cx, cy, r: Math.round(r), fx: cx - r * 0.12, fy: cy - r * 0.16 }
    : { cx: 0.5, cy: 0.5, r: 0.55, fx: 0.42, fy: 0.38 };
  return radial('body', list, attrs);
}

/** Soft outer glow (use on a circle of radius ≈ 1.5 × cell radius). Dark stage only. */
export function haloFill(color, stage = 'dark', { intensity = 1, desat = 0 } = {}) {
  const t = tones(color, stage, { intensity, desat });
  const o = t.haloOpacity;
  return radial('halo', [[0, t.halo, o], [0.55, t.halo, o * 0.85], [0.68, t.halo, o * 0.42], [0.84, t.halo, o * 0.12], [1, t.halo, 0]]);
}

/** Nucleus fill (bbox radial). */
export function nucleusFill(color, stage = 'dark', { intensity = 1, desat = 0 } = {}) {
  const t = tones(color, stage, { intensity, desat });
  return radial('nuc', [[0, t.nucIn], [0.7, t.nucIn], [1, t.nucOut]], { r: 0.55, fx: 0.45, fy: 0.42 });
}

/** A gentle top-left sheen to give volume (overlay on the body path). */
export function sheenFill(color, stage = 'dark') {
  const t = tones(color, stage);
  return radial('sheen', [[0, t.sheen, t.sheenOpacity], [0.6, t.sheen, t.sheenOpacity * 0.25], [1, t.sheen, 0]], {
    cx: 0.36, cy: 0.3, r: 0.55,
  });
}

/** Small glowing dot (cytokines, peptides). */
export function dotGlow(color, opacity = 0.7) {
  const c = resolve(color);
  return radial('dot', [[0, c, opacity], [0.4, c, opacity * 0.5], [1, c, 0]]);
}

/** Stage background (navy radial on dark; paper on light). */
export function stageFill(stage = 'dark') {
  const S = stageOf(stage);
  if (stage === 'light') return radial('stage', [[0, S.bg2], [1, S.bg]], { r: 0.75 });
  return radial('stage', [[0, S.bg2], [1, S.bg]], { cx: 0.5, cy: 0.45, r: 0.75 });
}

/** Vignette overlay for the dark stage. */
export function vignetteFill() {
  return radial('vig', [[0, '#000000', 0], [0.62, '#000000', 0], [1, '#02040C', 0.55]], { r: 0.72 });
}

// ---------------------------------------------------------------- filters (use sparingly)

/**
 * Soft glow filter for special emphasis (recognition events, selected item).
 * Filters are expensive: use on a handful of elements at most, never on crowds.
 */
export function glowFilter(strength = 3) {
  const s = Math.max(0.5, +strength);
  return url(define('glow', {
    tag: 'filter',
    attrs: { x: '-60%', y: '-60%', width: '220%', height: '220%', 'color-interpolation-filters': 'sRGB' },
    children: [
      { tag: 'feGaussianBlur', attrs: { in: 'SourceGraphic', stdDeviation: s, result: 'b' } },
      { tag: 'feColorMatrix', attrs: { in: 'b', type: 'matrix', values: '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1.4 0', result: 'g' } },
      { tag: 'feMerge', attrs: {}, children: [
        { tag: 'feMergeNode', attrs: { in: 'g' } },
        { tag: 'feMergeNode', attrs: { in: 'SourceGraphic' } },
      ] },
    ],
  }));
}

/** Defocus blur (depth-of-field for background cells). Expensive: few elements only. */
export function blurFilter(amount = 2) {
  return url(define('blur', {
    tag: 'filter',
    attrs: { x: '-30%', y: '-30%', width: '160%', height: '160%' },
    children: [{ tag: 'feGaussianBlur', attrs: { stdDeviation: Math.max(0.3, +amount) } }],
  }));
}

/** Small diagonal-stripe pattern (e.g. "mouse-derived" segments, hatched states). */
export function hatchPattern(color, { size = 4, opacity = 0.5, width = 1 } = {}) {
  const c = resolve(color);
  return url(define('hatch', {
    tag: 'pattern',
    attrs: { patternUnits: 'userSpaceOnUse', width: size, height: size, patternTransform: 'rotate(45)' },
    children: [{ tag: 'rect', attrs: { x: 0, y: 0, width: width, height: size, fill: c, 'fill-opacity': opacity } }],
  }));
}

// ---------------------------------------------------------------- export helpers

/** Ids of all sao- definitions referenced inside a node (recursively, incl. nested refs). */
export function referencedIds(node) {
  const ids = new Set();
  const scan = (str) => {
    if (!str) return;
    const re = /url\(#(sao-[^)\s"']+)\)/g;
    let m;
    while ((m = re.exec(str))) ids.add(m[1]);
  };
  const walk = (e) => {
    if (e.attributes) for (const a of e.attributes) scan(a.value);
    for (const c of e.children || []) walk(c);
  };
  walk(node);
  return [...ids].filter((id) => registry.has(id));
}

/** Copy referenced definitions into `svg` (for standalone export / rasterization). */
export function inlineDefs(svg) {
  const doc = svg.ownerDocument || document;
  let defs = svg.querySelector(':scope > defs[data-sao-inline]');
  if (!defs) {
    defs = doc.createElementNS(SVG_NS, 'defs');
    defs.setAttribute('data-sao-inline', '');
    svg.insertBefore(defs, svg.firstChild);
  }
  for (const id of referencedIds(svg)) {
    if (!defs.querySelector(`#${CSS.escape(id)}`)) defs.appendChild(build(doc, registry.get(id)));
  }
  return svg;
}

/** Serialized <defs> markup for a list of ids (used by sprites). */
export function defsMarkup(ids) {
  if (!ids.length) return '';
  const doc = document;
  const d = doc.createElementNS(SVG_NS, 'defs');
  for (const id of ids) if (registry.has(id)) d.appendChild(build(doc, registry.get(id)));
  return new XMLSerializer().serializeToString(d);
}
