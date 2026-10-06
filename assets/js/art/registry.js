// Self & Other — illustration library
// registry.js: metadata attached to generated elements (outline geometry, regeneration).
// Kept in a WeakMap so DOM nodes stay clean and garbage collection works.

const INFO = new WeakMap();

/**
 * Info about a cell / scene element produced by a factory:
 * { kind, variant, state, stage, r, extent, color, outline: [[x,y],…],
 *   regen(t, extra) → { body: d }   (used by animate.js),
 *   opts }
 */
export function cellInfo(node) {
  return node ? INFO.get(node) || null : null;
}

export function setInfo(node, info) {
  INFO.set(node, info);
  return node;
}
