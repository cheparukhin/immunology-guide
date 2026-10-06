// Self & Other — illustration library
// organelles.js: compartments inside cells for antigen-processing figures
// (ch04-mhc1-pathway, ch04-cross-presentation): vesicles (endosome, lysosome), the ER, and the
// TAP gate that pumps peptides into the ER.

import { el, part, n, circleD, ellipseD, roundRectD, capsuleD, TAU, clamp, lerp } from './svg.js';
import { PALETTE, glyphTones, resolve, mix, WHITE, stageOf } from './palette.js';
import { radial } from './defs.js';
import { rng, blobRadius, polarPoints, smoothPath, samplePerimeter, scatterInDisc } from './shapes.js';
import { setInfo } from './registry.js';

const VESICLE = {
  endosome: { color: '#B8C4E0', fill: 0.12, rim: 1, dots: 0 },  // bubble of eaten material
  lysosome: { color: '#C3A6D9', fill: 0.38, rim: 0.9, dots: 9 }, // small, dense, enzyme-filled
  er: { color: '#A9C7E8', fill: 0.16, rim: 1, dots: 0 },         // smooth compartment, rough outside
};

/**
 * Membrane-bound compartment inside a cell. Centred at (0,0).
 * vesicle({ kind:'endosome'|'lysosome'|'er', r:24 (or width/height for 'er'), seed, stage,
 *   color, cargo:0 (debris bits inside), tagged:0 (of which hot-pink tagged tumor protein),
 *   ribosomes:true ('er': dots studding the outer surface) })
 *  • endosome — a clear bubble (double membrane line) holding eaten debris
 *  • lysosome — smaller, denser, granular (digestive enzymes)
 *  • er       — the endoplasmic reticulum as one smooth, soft-edged compartment (an honest
 *               simplification), studded with ribosomes; mount tapGate() in its wall
 * Parts: membrane, lumen, cargo, ribosomes. cellInfo(g) → { outline, rx, ry }.
 */
export function vesicle(o = {}) {
  const kind = VESICLE[o.kind] ? o.kind : 'endosome';
  const spec = VESICLE[kind];
  const stage = o.stage === 'light' ? 'light' : 'dark';
  const dark = stage === 'dark';
  const S = stageOf(stage);
  const R = rng(o.seed ?? 1, `vesicle-${kind}`);
  const c = resolve(o.color || spec.color);
  const isER = kind === 'er';
  const rx = isER ? (o.width ?? 220) / 2 : (o.r ?? (kind === 'lysosome' ? 12 : 24));
  const ry = isER ? (o.height ?? 150) / 2 : rx;
  const rf = blobRadius({ r: 1, seed: o.seed ?? 1, irregularity: isER ? 0.35 : 0.12, kMax: isER ? 5 : 3 });
  const pts = polarPoints((a) => rf(a), isER ? 64 : 32).map(([x, y]) => [x * rx, y * ry]);
  const d = smoothPath(pts);
  const sw = clamp(Math.min(rx, ry) * 0.05, 0.7, 2);
  const g = el('g', { class: `sao-organelle sao-${kind}`, 'data-organelle': kind });
  const rim = dark ? mix(c, WHITE, 0.35) : mix(c, S.ink, 0.45);
  const lumen = dark
    ? radial(`ves-${kind}`, [[0, c, spec.fill * 0.5], [0.8, c, spec.fill], [1, c, spec.fill * 1.6]])
    : radial(`ves-${kind}`, [[0, mix(c, WHITE, 0.6)], [1, mix(c, WHITE, 0.35)]]);
  g.appendChild(el('path', { 'data-part': 'lumen', d, fill: lumen }));
  if (isER && o.ribosomes !== false) {
    let dr = '';
    for (const s of samplePerimeter(pts, Math.round((Math.PI * (rx + ry)) / 9))) {
      dr += circleD(s.x + s.nx * sw * 2.2, s.y + s.ny * sw * 2.2, sw * 0.9);
    }
    g.appendChild(el('path', { 'data-part': 'ribosomes', d: dr, fill: rim, 'fill-opacity': 0.6 }));
  }
  if (kind === 'lysosome') {
    let dd = '';
    for (let i = 0; i < spec.dots; i++) {
      const a = R.range(0, TAU), rr = Math.sqrt(R()) * rx * 0.7;
      dd += circleD(Math.cos(a) * rr, Math.sin(a) * rr, rx * R.range(0.06, 0.1));
    }
    g.appendChild(el('path', { d: dd, fill: rim, 'fill-opacity': 0.55 }));
  }
  // cargo: irregular debris bits (some carrying a hot-pink tumor-protein tag)
  const nc = o.cargo ?? 0, nt = Math.min(nc, o.tagged ?? 0);
  if (nc) {
    const cg = part('cargo');
    const list = scatterInDisc(R.fork('cargo'), { count: nc, radius: Math.min(rx, ry) * 0.72, size: Math.min(rx, ry) * 0.13, sizeJitter: 0.4 });
    list.forEach((q, i) => {
      const rfc = blobRadius({ r: q.r, seed: `${o.seed ?? 1}c${i}`, irregularity: 0.9, kMax: 4 });
      const tagged = i < nt;
      const bd = smoothPath(polarPoints(rfc, 10).map(([x, y]) => [x + q.x, y + q.y]));
      const bit = el('g', { 'data-part': tagged ? 'cargo-tagged' : 'cargo-bit' });
      bit.appendChild(el('path', { d: bd, fill: dark ? mix(PALETTE.cancer, S.bg, 0.35) : mix(PALETTE.cancer, WHITE, 0.45), stroke: dark ? mix(PALETTE.cancer, WHITE, 0.3) : mix(PALETTE.cancer, S.ink, 0.4), 'stroke-width': n(sw * 0.6) }));
      if (tagged) bit.appendChild(el('circle', { cx: n(q.x + q.r * 0.3), cy: n(q.y - q.r * 0.3), r: n(Math.max(1, q.r * 0.42)), fill: PALETTE.foreignPeptide }));
      cg.appendChild(bit);
    });
    g.appendChild(cg);
  }
  // membrane (double line for endosome/ER)
  const mem = part('membrane');
  mem.appendChild(el('path', { d, fill: 'none', stroke: rim, 'stroke-width': n(sw), 'stroke-opacity': spec.rim }));
  if (kind !== 'lysosome') {
    const k = 1 - Math.min(0.12, (sw * 2.2) / Math.min(rx, ry));
    mem.appendChild(el('path', { d: smoothPath(pts.map(([x, y]) => [x * k, y * k])), fill: 'none', stroke: rim, 'stroke-width': n(sw * 0.6), 'stroke-opacity': 0.45 }));
  }
  g.appendChild(mem);
  setInfo(g, { kind: 'vesicle', organelle: kind, stage, rx, ry, outline: pts, r: Math.max(rx, ry), extent: Math.max(rx, ry) });
  return g;
}

/**
 * TAP gate — the transporter that pumps peptides from the cytosol into the ER. Two pale-silver
 * halves around a channel; set it into a membrane line. Anchor (0,0) = centre of the channel
 * at the membrane; the channel runs along y (cytosol at −y, ER lumen at +y by default; rotate
 * as needed). tapGate({ size:28, stage, state:'open'|'closed'|'blocked', peptide:false })
 * blocked → a crimson bar across the mouth (the ⊣ "blocked gate" of FIGURE-AUDIT rule 10).
 * Parts: halves, channel, peptide, block.
 */
export function tapGate(o = {}) {
  const u = o.size ?? 28;
  const stage = o.stage === 'light' ? 'light' : 'dark';
  const dark = stage === 'dark';
  const state = o.state || 'open';
  const T = glyphTones(o.color || PALETTE.mhc, stage);
  const sw = clamp(u * 0.045, 0.6, 2);
  const g = el('g', { class: 'sao-mol sao-tap', 'data-mol': 'tap', 'data-state': state });
  const open = state === 'open';
  const gap = open ? 0.1 * u : 0.025 * u;
  const halves = part('halves');
  for (const s of [-1, 1]) {
    const cx = s * (gap / 2 + 0.17 * u);
    halves.appendChild(el('path', {
      d: `M${n(cx - 0.17 * u)} ${n(-0.42 * u)}Q${n(cx)} ${n(-0.56 * u)} ${n(cx + 0.17 * u)} ${n(-0.42 * u)}L${n(cx + 0.15 * u)} ${n(0.42 * u)}Q${n(cx)} ${n(0.52 * u)} ${n(cx - 0.15 * u)} ${n(0.42 * u)}Z`,
      fill: s < 0 ? T.fill : T.fill2, 'fill-opacity': s < 0 ? 1 : (dark ? 0.6 : 1), stroke: T.stroke, 'stroke-width': n(sw), 'stroke-linejoin': 'round',
    }));
    // nucleotide-binding domains on the cytosolic side
    halves.appendChild(el('path', { d: ellipseD(cx + s * 0.03 * u, -0.6 * u, 0.13 * u, 0.09 * u), fill: T.fill, stroke: T.stroke, 'stroke-width': n(sw) }));
  }
  g.appendChild(halves);
  g.appendChild(el('path', { 'data-part': 'channel', d: `M0 ${n(-0.4 * u)}V${n(0.4 * u)}`, stroke: dark ? '#05070F' : mix(PALETTE.mhc, S_INK, 0.6), 'stroke-opacity': open ? 0.55 : 0.25, 'stroke-width': n(gap * 0.9 + sw), 'stroke-linecap': 'round' }));
  if (o.peptide && open) {
    const pc = PALETTE.selfPeptide;
    let dp = '';
    for (let i = 0; i < 4; i++) dp += circleD(0, -0.3 * u + i * 0.15 * u, 0.045 * u);
    g.appendChild(el('path', { 'data-part': 'peptide', d: dp, fill: dark ? pc : mix(pc, S_INK, 0.2) }));
  }
  if (state === 'blocked') {
    const b = part('block');
    const c = PALETTE.inhibitory;
    b.appendChild(el('path', { d: `M${n(-0.36 * u)} ${n(-0.74 * u)}H${n(0.36 * u)}M${n(-0.36 * u)} ${n(-0.86 * u)}V${n(-0.62 * u)}M${n(0.36 * u)} ${n(-0.86 * u)}V${n(-0.62 * u)}`, stroke: dark ? c : mix(c, S_INK, 0.15), 'stroke-width': n(Math.max(1.4, u * 0.075)), 'stroke-linecap': 'round' }));
    g.appendChild(b);
  }
  return g;
}
const S_INK = '#1B1F2A';

export const ORGANELLES = { vesicle, tapGate };
