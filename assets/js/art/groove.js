// Self & Other — illustration library
// groove.js: the MHC class I groove up close (ch04-peptide-plus-groove) and the shared
// pocket / anchor vocabulary also used by mhc1({ pockets, anchors }).
//
// Shape carries the logic (color is secondary):
//   anchor bead shapes: 'circle' ●, 'square' ■, 'triangle' ▲
//   pocket types:       'round' fits ● · 'square' fits ■ · 'triangle' fits ▲ · 'wide' fits ● or ■
//   ridge patterns:     'A' | 'B' | 'C' (three bumps per wall; any other string is seeded)
//   up-facing patterns: 'x' | 'y' | 'z' (caps on peptide beads 4–6 that the TCR reads)

import { el, part, n, circleD, roundRectD, polygonD, clamp, lerp } from './svg.js';
import { PALETTE, glyphTones, resolve, mix, WHITE, stageOf } from './palette.js';
import { dotGlow } from './defs.js';
import { rng, smoothPath } from './shapes.js';
import { setInfo } from './registry.js';

export const POCKETS = Object.freeze(['round', 'square', 'triangle', 'wide']);
export const ANCHORS = Object.freeze(['circle', 'square', 'triangle']);

/** Does this anchor bead seat in this pocket? (the truth table's only rule) */
export function anchorFits(pocket, anchor) {
  if (pocket === 'wide') return anchor === 'circle' || anchor === 'square';
  return (pocket === 'round' && anchor === 'circle') || (pocket === 'square' && anchor === 'square') || (pocket === 'triangle' && anchor === 'triangle');
}
/** Both anchors seat → the peptide is displayed. */
export function peptideFits(pockets = [], anchors = []) {
  return anchors.length === 2 && pockets.length === 2 && anchorFits(pockets[0], anchors[0]) && anchorFits(pockets[1], anchors[1]);
}

const PEP = { self: PALETTE.selfPeptide, foreign: PALETTE.foreignPeptide, viral: PALETTE.foreignPeptide, neo: PALETTE.foreignPeptide };

/** Path for an anchor bead shape centred at (x, y) with radius r. */
export function anchorShapeD(shape, x, y, r) {
  if (shape === 'square') return roundRectD(x, y, r * 1.75, r * 1.75, r * 0.22);
  if (shape === 'triangle') return polygonD(x, y + r * 0.18, r * 1.22, 3, -Math.PI / 2);
  return circleD(x, y, r);
}

/**
 * Cavity path for a pocket type, opening upward at (x, y) (the floor line), width w, depth h.
 * Returned as a sub-path to be drawn as a dark socket.
 */
export function pocketD(type, x, y, w, h) {
  const hw = type === 'wide' ? w * 0.75 : w / 2;
  if (type === 'square') return `M${n(x - hw)} ${n(y)}V${n(y + h)}H${n(x + hw)}V${n(y)}Z`;
  if (type === 'triangle') return `M${n(x - hw * 1.1)} ${n(y)}L${n(x)} ${n(y + h * 1.1)}L${n(x + hw * 1.1)} ${n(y)}Z`;
  const hh = type === 'wide' ? h * 1.05 : h;
  return `M${n(x - hw)} ${n(y)}C${n(x - hw)} ${n(y + hh * 1.33)} ${n(x + hw)} ${n(y + hh * 1.33)} ${n(x + hw)} ${n(y)}Z`;
}

const RIDGES = {
  A: { pos: [0.24, 0.5, 0.76], h: [1, 1, 1], shape: 'round' },
  B: { pos: [0.2, 0.38, 0.72], h: [1.45, 0.7, 1.15], shape: 'round' },
  C: { pos: [0.3, 0.56, 0.82], h: [1, 1.2, 1], shape: 'square' },
};
function ridgeSpec(ridge) {
  if (ridge && typeof ridge === 'object') return ridge;
  if (RIDGES[ridge]) return RIDGES[ridge];
  const R = rng(String(ridge ?? 'A'), 'ridge');
  return { pos: [R.range(0.16, 0.32), R.range(0.42, 0.58), R.range(0.68, 0.84)], h: [R.range(0.7, 1.4), R.range(0.7, 1.4), R.range(0.7, 1.4)], shape: R.chance(0.5) ? 'round' : 'square' };
}

function capD(pattern, x, y, r) {
  // small marks on top of an up-facing bead: the "word" the TCR reads
  if (pattern === 'y') return `M${n(x - r * 0.45)} ${n(y - r * 1.05)}V${n(y - r * 1.75)}M${n(x + r * 0.45)} ${n(y - r * 1.05)}V${n(y - r * 1.75)}`;
  if (pattern === 'z') return `M${n(x - r * 0.6)} ${n(y - r * 1.05)}L${n(x)} ${n(y - r * 1.75)}L${n(x + r * 0.6)} ${n(y - r * 1.05)}`;
  return circleD(x, y - r * 1.4, r * 0.32); // 'x' (default): a dot
}

/**
 * Close-up of an MHC class I groove holding (or refusing) a 9-bead peptide.
 * mhcGroove({ view:'side'|'top', width:360, pockets:['round','round'], ridge:'A',
 *   peptide:{ kind:'self'|'foreign'|'viral'|'neo', color, anchors:['circle','circle'], pattern:'x'|'y'|'z' } | null,
 *   seated:true (anchors down in the pockets; false = hovering above), stage })
 * Beads 2 and 9 are anchors (pointing DOWN into the pockets), beads 4–6 point UP and carry
 * the pattern. Centred at (0,0). Parts: platform, wall-back/wall-a/wall-b, ridge, pockets
 * (pocket ×2, data-type), peptide (bead ×9, data-role 'anchor'|'up'|'plain'), backbone.
 * cellInfo(g) → { beads:[{x,y,role}], pockets:[{x,y,type}], ridge:[{x,y}], contacts:{ peptide, wallA, wallB }, fits }
 * (contacts = where the TCR's three loops touch: up-beads + one ridge on each wall).
 */
export function mhcGroove(o = {}) {
  const view = o.view === 'top' ? 'top' : 'side';
  const W = o.width ?? 360;
  const stage = o.stage === 'light' ? 'light' : 'dark';
  const dark = stage === 'dark';
  const S = stageOf(stage);
  const pockets = o.pockets || ['round', 'round'];
  const pep = o.peptide === null ? null : { kind: 'self', anchors: ['circle', 'circle'], pattern: 'x', ...(o.peptide || {}) };
  const seated = o.seated !== false;
  const T = glyphTones(PALETTE.mhc, stage);
  const pc = pep ? resolve(pep.color || PEP[pep.kind] || pep.kind) : null;
  const foreign = pep && (pep.kind === 'foreign' || pep.kind === 'viral' || pep.kind === 'neo');
  const rs = ridgeSpec(o.ridge ?? 'A');
  const g = el('g', { class: 'sao-mol sao-mhc-groove', 'data-mol': 'mhc-groove', 'data-view': view });
  const sp = W * 0.088, br = sp * 0.42;
  const xs = Array.from({ length: 9 }, (_, i) => (i - 4) * sp);
  const sw = clamp(W * 0.006, 0.8, 2.4);
  const silverFill = dark ? mix(PALETTE.mhc, S.bg, 0.55) : mix(PALETTE.mhc, WHITE, 0.35);
  const silverLight = dark ? mix(PALETTE.mhc, S.bg, 0.3) : mix(PALETTE.mhc, WHITE, 0.6);
  const cavity = dark ? mix(S.bg, '#000000', 0.25) : mix(PALETTE.mhc, S.ink, 0.45);
  const beadStroke = pc ? (dark ? mix(pc, WHITE, foreign ? 0.6 : 0.35) : mix(pc, S.ink, 0.5)) : null;
  const beadFill = pc ? (dark ? mix(pc, S.bg, foreign ? 0 : 0.1) : pc) : null;
  const beads = [], pocketInfo = [], ridgePts = [];
  const roleOf = (i) => (i === 1 || i === 8 ? 'anchor' : i >= 3 && i <= 5 ? 'up' : 'plain');
  const fits = pep ? [anchorFits(pockets[0], pep.anchors[0]), anchorFits(pockets[1], pep.anchors[1])] : [false, false];

  if (view === 'side') {
    const yf = br * 1.35; // floor line
    const depth = W * 0.14;
    // back wall (α-helix) with the ridge pattern on top
    const wallTop = -br * 2.1, wallH = br * 1.5;
    const wg = part('wall-back');
    wg.appendChild(el('path', { d: roundRectD(0, wallTop + wallH / 2, W * 0.94, wallH, wallH / 2), fill: silverLight, 'fill-opacity': dark ? 0.55 : 0.8, stroke: T.stroke, 'stroke-opacity': 0.5, 'stroke-width': n(sw) }));
    g.appendChild(wg);
    const rg = part('ridge');
    let dr = '';
    rs.pos.forEach((p, i) => {
      const x = lerp(-W * 0.42, W * 0.42, p), hh = br * 0.75 * rs.h[i];
      ridgePts.push({ x, y: wallTop - hh });
      dr += rs.shape === 'square' ? roundRectD(x, wallTop - hh / 2 + 1, br * 1.1, hh + 2, br * 0.18) : `M${n(x - br * 0.6)} ${n(wallTop + 1)}C${n(x - br * 0.6)} ${n(wallTop - hh * 1.33)} ${n(x + br * 0.6)} ${n(wallTop - hh * 1.33)} ${n(x + br * 0.6)} ${n(wallTop + 1)}Z`;
    });
    rg.appendChild(el('path', { d: dr, fill: silverLight, stroke: T.stroke, 'stroke-width': n(sw) }));
    g.appendChild(rg);
    // floor block with two pockets carved into it
    const pk = part('pockets');
    const floorD = roundRectD(0, yf + depth / 2, W, depth, W * 0.05);
    g.appendChild(el('path', { 'data-part': 'platform', d: floorD, fill: silverFill, stroke: T.stroke, 'stroke-width': n(sw) }));
    [1, 8].forEach((bi, k) => {
      const type = pockets[k];
      const pg = el('g', { 'data-part': 'pocket', 'data-type': type, 'data-index': String(k) });
      pg.appendChild(el('path', { d: pocketD(type, xs[bi], yf, br * 2.3, br * 1.9), fill: cavity, stroke: T.stroke, 'stroke-width': n(sw), 'stroke-linejoin': 'round' }));
      pk.appendChild(pg);
      pocketInfo.push({ x: xs[bi], y: yf + br, type });
    });
    g.appendChild(pk);
    if (pep) {
      const pos = xs.map((x, i) => {
        const role = roleOf(i);
        let y = 0;
        if (role === 'up') y = -br * 0.9;
        if (role === 'anchor' && seated && fits[i === 1 ? 0 : 1]) y = yf + br * 0.95;
        else if (role === 'anchor' && seated) y = yf - br * 0.85; // can't seat: rests on the rim
        return [x, y, role];
      });
      const pg = part('peptide', { 'data-peptide': pep.kind });
      if (foreign && dark) pg.appendChild(el('ellipse', { cx: 0, cy: n(-br * 0.3), rx: n(W * 0.46), ry: n(br * 3.2), fill: dotGlow(pc, 0.35) }));
      pg.appendChild(el('path', { 'data-part': 'backbone', d: smoothPath(pos.map(([x, y]) => [x, y]), { closed: false, smooth: 0.3 }), fill: 'none', stroke: beadStroke, 'stroke-width': n(br * 0.35), 'stroke-opacity': 0.75, 'stroke-linecap': 'round' }));
      pos.forEach(([x, y, role], i) => {
        const bg = el('g', { 'data-part': 'bead', 'data-role': role, 'data-index': String(i) });
        const shape = role === 'anchor' ? pep.anchors[i === 1 ? 0 : 1] : 'circle';
        bg.appendChild(el('path', { d: anchorShapeD(shape, x, y, br), fill: beadFill, stroke: beadStroke, 'stroke-width': n(sw) }));
        if (role === 'up') bg.appendChild(el('path', { d: capD(pep.pattern, x, y, br), fill: pep.pattern === 'x' ? beadStroke : 'none', stroke: beadStroke, 'stroke-width': n(sw * 1.2), 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
        pg.appendChild(bg);
        beads.push({ x, y, role });
      });
      g.appendChild(pg);
    }
    const upX = 0, upY = -br * 2.4;
    setInfo(g, {
      kind: 'mhcGroove', view, stage, width: W, beads, pockets: pocketInfo, ridge: ridgePts, fits: fits[0] && fits[1],
      contacts: { peptide: [upX, upY], wallA: [ridgePts[0].x, ridgePts[0].y], wallB: [ridgePts[2].x, ridgePts[2].y] },
    });
    return g;
  }

  // ---- top view: platform floor between two helical walls, seen from above
  const H = W * 0.42;
  const wallH = H * 0.24;
  g.appendChild(el('path', { 'data-part': 'platform', d: roundRectD(0, 0, W, H, H * 0.28), fill: silverFill, stroke: T.stroke, 'stroke-width': n(sw) }));
  const rg = part('ridge');
  let dr = '';
  for (const [name, sgn] of [['wall-a', -1], ['wall-b', 1]]) {
    const cy = sgn * (H / 2 - wallH / 2 - H * 0.04);
    g.appendChild(el('path', { 'data-part': name, d: roundRectD(0, cy, W * 0.92, wallH, wallH / 2), fill: silverLight, stroke: T.stroke, 'stroke-width': n(sw) }));
    // helix hint
    let dh = '';
    for (let k = 0; k < 12; k++) {
      const x = lerp(-W * 0.42, W * 0.42, k / 11);
      dh += `M${n(x - wallH * 0.18)} ${n(cy - wallH * 0.32)}L${n(x + wallH * 0.18)} ${n(cy + wallH * 0.32)}`;
    }
    g.appendChild(el('path', { d: dh, stroke: T.stroke, 'stroke-opacity': 0.3, 'stroke-width': n(sw * 0.8), 'stroke-linecap': 'round' }));
    rs.pos.forEach((p, i) => {
      const x = lerp(-W * 0.4, W * 0.4, sgn < 0 ? p : 1 - p);
      const rr = wallH * 0.32 * rs.h[i];
      ridgePts.push({ x, y: cy });
      dr += rs.shape === 'square' ? roundRectD(x, cy, rr * 1.7, rr * 1.7, rr * 0.25) : circleD(x, cy, rr);
    });
  }
  rg.appendChild(el('path', { d: dr, fill: dark ? mix(PALETTE.mhc, WHITE, 0.2) : WHITE, stroke: T.stroke, 'stroke-width': n(sw) }));
  g.appendChild(rg);
  const pk = part('pockets');
  [1, 8].forEach((bi, k) => {
    const type = pockets[k];
    const s = br * 2.4;
    const d = type === 'square' ? roundRectD(xs[bi], 0, s, s, s * 0.12)
      : type === 'triangle' ? polygonD(xs[bi], s * 0.12, s * 0.66, 3, -Math.PI / 2)
        : circleD(xs[bi], 0, type === 'wide' ? s * 0.68 : s * 0.5);
    pk.appendChild(el('path', { 'data-part': 'pocket', 'data-type': type, 'data-index': String(k), d, fill: cavity, stroke: T.stroke, 'stroke-width': n(sw) }));
    pocketInfo.push({ x: xs[bi], y: 0, type });
  });
  g.appendChild(pk);
  if (pep) {
    const pg = part('peptide', { 'data-peptide': pep.kind });
    if (foreign && dark) pg.appendChild(el('ellipse', { cx: 0, cy: 0, rx: n(W * 0.44), ry: n(br * 2.6), fill: dotGlow(pc, 0.35) }));
    pg.appendChild(el('path', { 'data-part': 'backbone', d: `M${n(xs[0])} 0H${n(xs[8])}`, stroke: beadStroke, 'stroke-width': n(br * 0.35), 'stroke-opacity': 0.75, 'stroke-linecap': 'round' }));
    xs.forEach((x, i) => {
      const role = roleOf(i);
      const bg = el('g', { 'data-part': 'bead', 'data-role': role, 'data-index': String(i) });
      const down = role === 'anchor';
      const shape = down ? pep.anchors[i === 1 ? 0 : 1] : 'circle';
      const r = role === 'up' ? br * 1.15 : down ? br * 0.85 : br;
      bg.appendChild(el('path', { d: anchorShapeD(shape, x, 0, r), fill: down ? mix(beadFill, dark ? S.bg : S.ink, 0.25) : beadFill, stroke: beadStroke, 'stroke-width': n(sw) }));
      if (role === 'up') bg.appendChild(el('path', { d: capD(pep.pattern, x, br * 1.4, br * 0.9), fill: pep.pattern === 'x' ? beadStroke : 'none', stroke: beadStroke, 'stroke-width': n(sw * 1.1), 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
      pg.appendChild(bg);
      beads.push({ x, y: 0, role });
    });
    g.appendChild(pg);
  }
  setInfo(g, {
    kind: 'mhcGroove', view, stage, width: W, beads, pockets: pocketInfo, ridge: ridgePts, fits: fits[0] && fits[1],
    contacts: { peptide: [0, 0], wallA: [ridgePts[0].x, ridgePts[0].y], wallB: [ridgePts[5].x, ridgePts[5].y] },
  });
  return g;
}

/**
 * Pockets + a mini peptide inside an mhc1() cup (called by mhc1 when `pockets` are given):
 * two shaped sockets in the cup floor; when anchors are given AND both fit, a 3-bead peptide
 * (anchor · body · anchor) lies in the groove with its anchors seated. Returns <g data-part="pockets">
 * and a flag telling mhc1 whether it drew the peptide itself.
 */
export function cupPockets(u, pockets, anchors, peptideColor, stage, sw, peptideKind) {
  const dark = stage !== 'light';
  const S = stageOf(stage);
  const T = glyphTones(PALETTE.mhc, stage);
  const g = el('g', { 'data-part': 'pockets' });
  const cavity = dark ? mix(S.bg, '#000000', 0.2) : mix(PALETTE.mhc, S.ink, 0.45);
  const y = -0.6 * u, dx = 0.13 * u;
  [-1, 1].forEach((s, k) => {
    const type = pockets[k] || 'round';
    g.appendChild(el('path', { 'data-part': 'pocket', 'data-type': type, d: pocketD(type, s * dx, y - 0.015 * u, 0.1 * u, 0.08 * u), fill: cavity, stroke: T.stroke, 'stroke-width': n(sw * 0.8), 'stroke-linejoin': 'round' }));
  });
  const seated = anchors && anchorFits(pockets[0], anchors[0]) && anchorFits(pockets[1], anchors[1]);
  if (seated) {
    const c = peptideColor || PALETTE.selfPeptide;
    const foreign = peptideKind === 'foreign' || peptideKind === 'viral' || peptideKind === 'neo';
    const fill = dark ? (foreign ? mix(c, WHITE, 0.12) : mix(c, '#0B1024', 0.1)) : c;
    const stroke = dark ? mix(c, WHITE, foreign ? 0.6 : 0.35) : mix(c, S.ink, 0.5);
    const pg = el('g', { 'data-part': 'peptide', 'data-peptide': peptideKind || 'self' });
    if (foreign && dark) pg.appendChild(el('ellipse', { cx: 0, cy: n(-0.68 * u), rx: n(0.26 * u), ry: n(0.13 * u), fill: dotGlow(c, 0.55) }));
    const pts = [[-dx, y + 0.02 * u], [0, -0.74 * u], [dx, y + 0.02 * u]];
    pg.appendChild(el('path', { d: `M${n(pts[0][0])} ${n(pts[0][1])}Q0 ${n(-0.8 * u)} ${n(pts[2][0])} ${n(pts[2][1])}`, fill: 'none', stroke, 'stroke-width': n(sw * 1.1), 'stroke-linecap': 'round' }));
    pg.appendChild(el('path', { d: anchorShapeD(anchors[0], pts[0][0], pts[0][1], 0.042 * u) + anchorShapeD(anchors[1], pts[2][0], pts[2][1], 0.042 * u), fill, stroke, 'stroke-width': n(sw * 0.7) }));
    pg.appendChild(el('path', { d: circleD(0, -0.74 * u, 0.075 * u), fill, stroke, 'stroke-width': n(sw * 0.8) }));
    if (foreign) pg.appendChild(el('path', { d: circleD(0, -0.74 * u, 0.028 * u), fill: dark ? WHITE : mix(c, S.ink, 0.45), 'fill-opacity': 0.85 }));
    g.appendChild(pg);
  }
  return { g, drewPeptide: !!seated };
}
