// Self & Other — illustration library
// keys.js: clone identity. Every T-cell (or B-cell) clone carries one "search query": a
// notch cut into the tip of its receptor (tcrKey). The one antigen it recognizes carries the
// complementary plug (epitopeKey). ≥ 46 seeded, visibly distinct notches + three named keys
// ('triangle', 'star', 'diamond') whose plugs are those shapes.
//
//   tcrKey({ key: 7, size: 18, color: 'cd8' })        // receptor on a membrane (anchor = membrane)
//   tcrKey({ key: 'star', form: 'tip', size: 8 })     // compact notched tip for dots / sprites
//   epitopeKey({ key: 7, size: 18 })                  // matching plug (hot pink, glowing)
//   Dock: place the epitope at (0, tcrKey.dataset.dockY) in the receptor's frame.

import { el, n, TAU } from './svg.js';
import { PALETTE, glyphTones, resolve, mix, WHITE } from './palette.js';
import { dotGlow } from './defs.js';
import { hashSeed } from './shapes.js';

// ---------------------------------------------------------------- catalog

const SHAPES = ['rect', 'round', 'vee'];

function notchDepth(x, { c, w, h, s }) {
  const t = (x - c) / w;
  const a = Math.abs(t);
  if (a >= 1) return 0;
  if (s === 'rect') return h * (a < 0.72 ? 1 : (1 - a) / 0.28);
  if (s === 'round') return h * Math.sqrt(1 - t * t);
  return h * (1 - a);
}

function buildCatalog() {
  const list = [];
  for (const c of [-0.42, 0, 0.42]) for (const s of SHAPES) for (const [w, h] of [[0.3, 1], [0.52, 0.66]]) {
    list.push({ notches: [{ c, w, h, s }] });
  }
  for (const s1 of SHAPES) for (const s2 of SHAPES) for (const [h1, h2] of [[1, 1], [1, 0.5]]) {
    list.push({ notches: [{ c: -0.5, w: 0.27, h: h1, s: s1 }, { c: 0.5, w: 0.27, h: h2, s: s2 }] });
  }
  for (const s of SHAPES) for (const hs of [[0.55, 1, 0.55], [1, 0.45, 1]]) {
    list.push({ notches: [-0.64, 0, 0.64].map((c, i) => ({ c, w: 0.2, h: hs[i], s })) });
  }
  list.push({ ledge: 'left' }, { ledge: 'right' }, { ramp: 'left' }, { ramp: 'right' });
  // deterministic shuffle so consecutive seeds look very different
  return list
    .map((p, i) => ({ p, k: hashSeed(i, 'key-order') }))
    .sort((a, b) => a.k - b.k)
    .map((x, i) => ({ ...x.p, id: `k${i}` }));
}
const CATALOG = buildCatalog();

/** Number of distinct seeded keys (seeds 0 … KEY_COUNT−1 are guaranteed distinct). */
export const KEY_COUNT = CATALOG.length;
/** Named keys whose plugs are recognizable shapes (ch12 clones etc.). */
export const KEY_NAMES = Object.freeze(['triangle', 'star', 'diamond']);

/** Normalize a key (number | string | name) to its id: 'k0'…'k45' or 'triangle'|'star'|'diamond'. */
export function keyId(key) {
  if (KEY_NAMES.includes(key)) return key;
  const i = typeof key === 'number' && Number.isFinite(key)
    ? ((Math.round(key) % KEY_COUNT) + KEY_COUNT) % KEY_COUNT
    : hashSeed(String(key ?? 0), 'key') % KEY_COUNT;
  return CATALOG[i].id;
}

// Named shapes in units of the glyph size u (contact line at y = 0, +y = into the socket).
function namedPolygon(name) {
  if (name === 'triangle') return [[-0.2, 0], [0.2, 0], [0, 0.3]];
  if (name === 'diamond') return [[0, -0.2], [0.17, 0.05], [0, 0.3], [-0.17, 0.05]];
  // star (five points, one pointing away from the receptor)
  const pts = [];
  const cy = 0.07, R = 0.23, r = 0.098;
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r : R;
    pts.push([Math.cos(a) * rr, cy + Math.sin(a) * rr]);
  }
  return pts;
}

/** Part of a closed polygon with y ≥ 0, as a chain from its left mouth point to its right one. */
function cavityChain(poly) {
  const out = [];
  const N = poly.length;
  for (let i = 0; i < N; i++) {
    const a = poly[i], b = poly[(i + 1) % N];
    const ia = a[1] >= -1e-9, ib = b[1] >= -1e-9;
    if (ia) out.push(a);
    if (ia !== ib) {
      const t = a[1] / (a[1] - b[1]);
      out.push([a[0] + (b[0] - a[0]) * t, 0]);
    }
  }
  const mouth = out.map((p, i) => [p, i]).filter(([p]) => Math.abs(p[1]) < 1e-6);
  if (mouth.length < 2) return out;
  mouth.sort((a, b) => a[0][0] - b[0][0]);
  const iL = mouth[0][1], iR = mouth[mouth.length - 1][1];
  const walk = (dir) => {
    const res = [];
    for (let i = iL; ; i = (i + dir + out.length) % out.length) {
      res.push(out[i]);
      if (i === iR) break;
    }
    return res;
  };
  const f = walk(1), b = walk(-1);
  const deep = (c) => Math.max(...c.map((p) => p[1]));
  return deep(f) >= deep(b) ? f : b;
}

/**
 * Socket profile of a key in units of the glyph size u, as points from left to right along
 * the receptor's tip (y = 0 is the tip's top edge; +y goes into the receptor).
 */
export function keySocket(key) {
  const id = keyId(key);
  if (KEY_NAMES.includes(id)) return cavityChain(namedPolygon(id));
  const p = CATALOG.find((c) => c.id === id);
  const sw = 0.24, h = 0.2;
  const N = 44;
  const pts = [];
  for (let i = 0; i <= N; i++) {
    const x = -1 + (2 * i) / N;
    let d = 0;
    if (p.notches) for (const q of p.notches) d = Math.max(d, notchDepth(x, q));
    else if (p.ledge) {
      const s = p.ledge === 'left' ? -x : x;
      d = s > 0.08 ? 0.8 : s > -0.08 ? 0.8 * (s + 0.08) / 0.16 : 0;
      d *= Math.min(1, (1 - Math.abs(x)) / 0.12);
    } else if (p.ramp) {
      const s = p.ramp === 'left' ? -x : x;
      d = Math.max(0, 0.5 + 0.5 * s) * Math.min(1, (1 - Math.abs(x)) / 0.1);
    }
    pts.push([x * sw, d * h]);
  }
  return pts;
}

/** The epitope's plug polygon (units of u; contact line y = 0, plug toward +y, body toward −y). */
export function keyPlug(key) {
  const id = keyId(key);
  if (KEY_NAMES.includes(id)) return namedPolygon(id);
  const chain = keySocket(id);
  const sw = 0.24, bw = 0.29, bh = 0.13, rc = 0.04;
  // body above the contact line, plug below
  const body = [[bw, 0], [bw, -bh + rc], [bw - rc * 0.3, -bh + rc * 0.3], [bw - rc, -bh], [-bw + rc, -bh], [-bw + rc * 0.3, -bh + rc * 0.3], [-bw, -bh + rc], [-bw, 0], [-sw, 0]];
  return [...body, ...chain, [sw, 0]];
}

const pathOf = (pts, u, dx = 0, dy = 0, flip = 1) =>
  pts.map((p, i) => `${i ? 'L' : 'M'}${n(dx + p[0] * u)} ${n(dy + flip * p[1] * u)}`).join('') + 'Z';

// ---------------------------------------------------------------- glyphs

/**
 * Receptor with a clone-identity notch. key: number (0…KEY_COUNT−1 distinct) | string |
 * 'triangle' | 'star' | 'diamond'. form: 'receptor' (membrane glyph: two chains + notched
 * tip; anchor = membrane, data-dock-y = top of the tip) | 'tip' (just the notched tip,
 * centred; for crowd dots and sprites). color: the cell's color (default CD8 blue).
 * Parts: chains, tip.
 */
export function tcrKey(o = {}) {
  const size = o.size ?? 16;
  const u = size;
  const stage = o.stage === 'light' ? 'light' : 'dark';
  const form = o.form === 'tip' ? 'tip' : 'receptor';
  const T = glyphTones(o.color || PALETTE.cd8, stage);
  const id = keyId(o.key ?? 0);
  const low = o.detail === 'low' || (o.detail !== 'high' && size < 12);
  const sw = Math.max(0.5, Math.min(2, u * 0.045));
  const root = el('g', { class: 'sao-mol sao-tcr sao-tcr-key', 'data-mol': 'tcr', 'data-key': id });
  const tip = form === 'tip';
  const W = (tip ? 0.5 : 0.34) * u, rc = (tip ? 0.12 : 0.07) * u;
  const yt = tip ? -0.32 * u : -1.0 * u;
  const yb = tip ? 0.32 * u : -0.6 * u;
  const ks = tip ? 1.75 : 1; // the compact badge exaggerates the notch so it reads at 8–12 px
  const chain = keySocket(id).map(([x, y]) => [x * u * ks, yt + y * u * ks]);
  let d = `M${n(-W)} ${n(yt + rc)}Q${n(-W)} ${n(yt)} ${n(-W + rc)} ${n(yt)}`;
  d += `L${n(chain[0][0])} ${n(yt)}`;
  for (const p of chain) d += `L${n(p[0])} ${n(p[1])}`;
  d += `L${n(chain[chain.length - 1][0])} ${n(yt)}L${n(W - rc)} ${n(yt)}Q${n(W)} ${n(yt)} ${n(W)} ${n(yt + rc)}`;
  d += `L${n(W)} ${n(yb - rc * 1.6)}Q${n(W)} ${n(yb)} ${n(W - rc * 1.6)} ${n(yb)}L${n(-W + rc * 1.6)} ${n(yb)}Q${n(-W)} ${n(yb)} ${n(-W)} ${n(yb - rc * 1.6)}Z`;
  if (form === 'receptor') {
    const ws = low ? Math.max(0.9, 0.12 * u) : sw * 1.5;
    root.appendChild(el('path', {
      'data-part': 'chains',
      d: `M${n(-0.07 * u)} ${n(0.12 * u)}L${n(-0.1 * u)} ${n(yb + 0.02 * u)}M${n(0.07 * u)} ${n(0.12 * u)}L${n(0.1 * u)} ${n(yb + 0.02 * u)}`,
      stroke: T.stroke, 'stroke-width': n(ws), 'stroke-linecap': 'round', fill: 'none',
    }));
  }
  const tipFill = stage === 'light' ? T.fill : mix(T.base, '#0B1024', 0.25);
  root.appendChild(el('path', {
    'data-part': 'tip', d,
    fill: low ? (stage === 'light' ? T.stroke : mix(T.base, WHITE, 0.3)) : tipFill,
    stroke: low ? 'none' : (stage === 'light' ? T.stroke : mix(T.base, WHITE, 0.45)),
    'stroke-width': n(sw), 'stroke-linejoin': 'round',
  }));
  root.setAttribute('data-dock-y', n(yt));
  return root;
}

/**
 * The antigen piece that a keyed receptor recognizes: the exact complement of its notch.
 * Default hot pink with a glow (foreign / neo). Anchor (0,0) = contact line; facing:'down'
 * (default) puts the plug toward +y so it docks into a tcrKey of the same size placed in the
 * same frame at (0, dockY); facing:'up' flips it (e.g. presented on a surface).
 * Named keys ('triangle' | 'star' | 'diamond') are those shapes. Parts: plug, glow.
 */
export function epitopeKey(o = {}) {
  const size = o.size ?? 16;
  const u = size;
  const stage = o.stage === 'light' ? 'light' : 'dark';
  const c = resolve(o.color || PALETTE.foreignPeptide);
  const id = keyId(o.key ?? 0);
  const flip = o.facing === 'up' ? -1 : 1;
  const root = el('g', { class: 'sao-mol sao-epitope', 'data-mol': 'epitope', 'data-key': id });
  const poly = keyPlug(id);
  const dark = stage === 'dark';
  if (dark && o.glow !== false) root.appendChild(el('circle', { 'data-part': 'glow', cy: n(flip * 0.05 * u), r: n(0.36 * u), fill: dotGlow(c, 0.5) }));
  root.appendChild(el('path', {
    'data-part': 'plug', d: pathOf(poly, u, 0, 0, flip),
    fill: dark ? mix(c, WHITE, 0.12) : c,
    stroke: dark ? mix(c, WHITE, 0.55) : mix(c, '#1B1F2A', 0.5),
    'stroke-width': n(Math.max(0.5, Math.min(1.8, u * 0.035))), 'stroke-linejoin': 'round',
  }));
  return root;
}

/** Tiny key glyph for legends / chips: the named shape or a notched tip, centred. */
export function keyChip(o = {}) {
  const id = keyId(o.key ?? 0);
  if (KEY_NAMES.includes(id)) {
    const g = epitopeKey({ ...o, glow: false });
    g.firstChild.setAttribute('transform', `translate(0 ${n(-0.05 * (o.size ?? 16))})`);
    return g;
  }
  return tcrKey({ ...o, form: 'tip' });
}
