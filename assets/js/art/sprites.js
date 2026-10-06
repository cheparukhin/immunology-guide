// Self & Other — illustration library
// sprites.js: rasterize any factory output to a cached bitmap for Canvas 2D crowds.
//
//   const img = await sprite('tCell', { variant: 'cd8', r: 12, seed: 2 });
//   drawSprite(ctx, img, x, y, { rotation: 0.3, alpha: 0.9 });
//
// The bitmap is square and CENTRED on the factory's origin (0,0), so drawSprite places the
// cell's centre at (x, y). Bitmaps are rendered at devicePixelRatio (capped at 2) and cached
// by (kind, params, scale) — reuse a handful of seeds rather than one per cell.

import { SVG_NS } from './svg.js';
import { ensureDefs, referencedIds, defsMarkup } from './defs.js';
import { CELLS } from './cells.js';
import { MOLECULES } from './molecules.js';
import { PATHOGENS } from './pathogens.js';
import { ORGANELLES } from './organelles.js';

const FACTORIES = { ...CELLS, ...MOLECULES, ...PATHOGENS, ...ORGANELLES };
const cache = new Map();
const META = new WeakMap();

function stable(v) {
  if (Array.isArray(v)) return `[${v.map(stable).join(',')}]`;
  if (v && typeof v === 'object') return `{${Object.keys(v).sort().map((k) => `${k}:${stable(v[k])}`).join(',')}}`;
  return JSON.stringify(v);
}

/**
 * Rasterize a factory to an ImageBitmap (or a <canvas> where ImageBitmap is unavailable).
 * kind: factory name ('tCell', 'virus', 'antibody'…) or a factory function.
 * options: { scale (pixel ratio; default min(2, devicePixelRatio)), pad (px, default 3) }
 * Returns a Promise; results are cached (same arguments → same Promise).
 */
export function sprite(kind, params = {}, { scale, pad = 3 } = {}) {
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
  const sc = scale ?? Math.min(2, dpr);
  const name = typeof kind === 'function' ? kind.name : kind;
  const key = `${name}|${stable(params)}|${sc}|${pad}`;
  if (!cache.has(key)) cache.set(key, render(kind, params, sc, pad));
  return cache.get(key);
}

async function render(kind, params, sc, pad) {
  const f = typeof kind === 'function' ? kind : FACTORIES[kind];
  if (!f) throw new Error(`sprite: unknown factory "${kind}"`);
  const node = f(params);
  // measure inside the (rendered, zero-size) defs holder
  const defs = ensureDefs();
  const holder = defs.parentNode;
  holder.appendChild(node);
  let bb;
  try { bb = node.getBBox(); } finally { node.remove(); }
  const ext = Math.max(Math.abs(bb.x), Math.abs(bb.x + bb.width), Math.abs(bb.y), Math.abs(bb.y + bb.height)) + pad;
  const size = ext * 2;
  const px = Math.max(1, Math.ceil(size * sc));
  const markup =
    `<svg xmlns="${SVG_NS}" width="${px}" height="${px}" viewBox="${-ext} ${-ext} ${size} ${size}">` +
    defsMarkup(referencedIds(node)) +
    new XMLSerializer().serializeToString(node) +
    '</svg>';
  const url = URL.createObjectURL(new Blob([markup], { type: 'image/svg+xml' }));
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    const canvas = document.createElement('canvas');
    canvas.width = px;
    canvas.height = px;
    canvas.getContext('2d').drawImage(img, 0, 0, px, px);
    let out = canvas;
    if (typeof createImageBitmap === 'function') {
      try { out = await createImageBitmap(canvas); } catch (e) { /* keep canvas */ }
    }
    META.set(out, { size, ext, scale: sc, kind: typeof kind === 'function' ? kind.name : kind, params });
    return out;
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Metadata for a sprite: { size (logical px), ext (half-size), scale, kind, params }. */
export function spriteInfo(img) {
  return META.get(img) || null;
}

/**
 * Draw a sprite centred at (x, y) in logical (CSS) pixels.
 * drawSprite(ctx, img, x, y, { scale:1, rotation:0 (rad), alpha:1 })
 */
export function drawSprite(ctx, img, x, y, { scale = 1, rotation = 0, alpha = 1 } = {}) {
  const m = META.get(img);
  const s = (m ? m.size : img.width) * scale;
  const prevA = ctx.globalAlpha;
  if (alpha !== 1) ctx.globalAlpha = prevA * alpha;
  if (rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.drawImage(img, -s / 2, -s / 2, s, s);
    ctx.restore();
  } else {
    ctx.drawImage(img, x - s / 2, y - s / 2, s, s);
  }
  if (alpha !== 1) ctx.globalAlpha = prevA;
}

/** Preload many sprites: await preloadSprites([['tCell', {...}], ['virus', {...}]]). */
export function preloadSprites(list, opts) {
  return Promise.all(list.map(([k, p]) => sprite(k, p, opts)));
}

/** Drop cached sprites (e.g. after a theme/stage change). */
export function clearSprites() {
  cache.clear();
}
