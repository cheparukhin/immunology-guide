// Self & Other — illustration library
// pathogens.js: bacteria, viruses, and a splinter (for the inflammation scene).
// Same conventions as cells: centred at (0,0), { r, seed, stage, detail, glow }.

import { el, part, n, circleD, polygonD, TAU, clamp, lerp } from './svg.js';
import { PALETTE, tones, mix, resolve, WHITE } from './palette.js';
import { bodyFill, haloFill, dotGlow } from './defs.js';
import { rng, smoothPath, polarPoints, blobRadius, samplePerimeter, extentOf } from './shapes.js';
import { setInfo } from './registry.js';
import { antibody, placeOnMembrane } from './molecules.js';

function opts(o, defR) {
  const r = o.r ?? defR;
  const stage = o.stage === 'light' ? 'light' : 'dark';
  const detail = !o.detail || o.detail === 'auto' ? (r >= 10 ? 'high' : 'low') : o.detail;
  return { r, stage, detail, hi: detail === 'high', seed: o.seed ?? 1, glow: o.glow !== false && stage === 'dark' };
}

function sw(c, k = 1) {
  return (c.stage === 'light' ? clamp(c.r * 0.07, 0.7, 2.2) : clamp(c.r * 0.06, 0.6, 2)) * k;
}

/** Closed outline points of a (slightly bent) capsule, for rods. */
function rodPoints(L, w, bend, count = 40) {
  const pts = [];
  const half = L / 2 - w / 2;
  const spine = (t) => [t * half, bend * (1 - t * t) * w * 0.6];
  // top edge (left→right), right cap, bottom edge (right→left), left cap
  const N = Math.round(count / 4);
  const norm = (t) => {
    const dx = half, dy = -2 * t * bend * w * 0.6;
    const l = Math.hypot(dx, dy);
    return [-dy / l, dx / l];
  };
  for (let i = 0; i <= N; i++) {
    const t = -1 + (2 * i) / N;
    const [x, y] = spine(t), [nx, ny] = norm(t);
    pts.push([x - nx * w / 2, y - ny * w / 2]);
  }
  for (let i = 1; i < N; i++) {
    const a = -Math.PI / 2 + (Math.PI * i) / N;
    const [x, y] = spine(1);
    pts.push([x + Math.cos(a) * w / 2, y + Math.sin(a) * w / 2]);
  }
  for (let i = N; i >= 0; i--) {
    const t = -1 + (2 * i) / N;
    const [x, y] = spine(t), [nx, ny] = norm(t);
    pts.push([x + nx * w / 2, y + ny * w / 2]);
  }
  for (let i = 1; i < N; i++) {
    const a = Math.PI / 2 + (Math.PI * i) / N;
    const [x, y] = spine(-1);
    pts.push([x + Math.cos(a) * w / 2, y + Math.sin(a) * w / 2]);
  }
  return pts;
}

/**
 * Bacterium. bacterium({ shape:'rod'|'coccus', r:14, seed, angle:deg, flagella:0..3,
 *   pili:false, pamps:false, arrangement:'single'|'pair'|'chain'|'cluster' (cocci),
 *   opsonized:false (coated with antibodies, Fc outward), stage, detail })
 * r = half-length for rods, radius for cocci. Color: chartreuse.
 * Parts: body, wall, nucleoid, flagella, pili, pamps, antibodies.
 */
export function bacterium(o = {}) {
  const shape = o.shape === 'coccus' ? 'coccus' : 'rod';
  const c = opts(o, shape === 'rod' ? 16 : 8);
  const color = o.color || PALETTE.bacteria;
  const T = tones(color, c.stage);
  const R = rng(c.seed, 'bact');
  const g = el('g', { class: `sao-pathogen sao-bacterium sao-${shape}`, 'data-pathogen': 'bacterium', 'data-shape': shape });
  const inner = el('g', { transform: o.angle ? `rotate(${n(o.angle)})` : null });
  g.appendChild(inner);
  const bodies = []; // outlines (for pamps / antibodies)
  if (shape === 'rod') {
    const w = c.r * 0.9;
    bodies.push(rodPoints(c.r * 2, w, R.range(-0.25, 0.25), c.hi ? 48 : 24));
  } else {
    const arr = o.arrangement || 'single';
    const k = arr === 'pair' ? 2 : arr === 'chain' ? R.int(3, 5) : arr === 'cluster' ? R.int(5, 7) : 1;
    const centers = [];
    if (arr === 'cluster') {
      centers.push([0, 0]);
      for (let i = 1; i < k; i++) {
        const a = (i / (k - 1)) * TAU + R.range(-0.3, 0.3);
        centers.push([Math.cos(a) * c.r * 1.75, Math.sin(a) * c.r * 1.75]);
      }
    } else {
      for (let i = 0; i < k; i++) centers.push([(i - (k - 1) / 2) * c.r * 1.85, Math.sin(i * 1.3) * c.r * 0.3 * (k > 2 ? 1 : 0)]);
    }
    for (const [x, y] of centers) {
      const rf = blobRadius({ r: c.r, seed: `${c.seed}${x}${y}`, irregularity: 0.06 });
      bodies.push(polarPoints(rf, c.hi ? 28 : 16).map(([px, py]) => [px + x, py + y]));
    }
  }
  // flagella first (behind the body)
  const nFl = o.flagella ?? 0;
  if (nFl && shape === 'rod') {
    let d = '';
    const L = c.r * 2.4;
    for (let i = 0; i < nFl; i++) {
      const y0 = (i - (nFl - 1) / 2) * c.r * 0.25;
      const phase = R.range(0, TAU);
      const pts = [];
      for (let k = 0; k <= 24; k++) {
        const t = k / 24;
        pts.push([-c.r * 0.92 - t * L, y0 + Math.sin(t * TAU * 1.8 + phase) * c.r * 0.22 * (0.4 + t) + t * y0]);
      }
      d += smoothPath(pts, { closed: false });
    }
    inner.appendChild(el('path', { 'data-part': 'flagella', d, fill: 'none', stroke: T.rim, 'stroke-opacity': 0.65, 'stroke-width': n(sw(c, 0.55)), 'stroke-linecap': 'round' }));
  }
  if (c.glow) inner.appendChild(el('circle', { 'data-part': 'glow', r: n(extentOf(bodies.flat()) * 1.35), fill: haloFill(color, c.stage) }));
  let pili = '';
  const bodyG = part('body');
  for (const pts of bodies) {
    const d = smoothPath(pts);
    if (o.pili && c.hi) {
      for (const s of samplePerimeter(pts, Math.round(pts.length * 0.9))) {
        const l = c.r * R.range(0.12, 0.22);
        pili += `M${n(s.x)} ${n(s.y)}L${n(s.x + s.nx * l)} ${n(s.y + s.ny * l)}`;
      }
    }
    bodyG.appendChild(el('path', { d, fill: bodyFill(color, c.stage), stroke: T.rim, 'stroke-width': n(sw(c)), 'stroke-opacity': n(T.rimOpacity), 'stroke-linejoin': 'round' }));
    if (c.hi) {
      // inner wall line: double membrane / cell wall
      const cx = pts.reduce((a, p) => a + p[0], 0) / pts.length, cy = pts.reduce((a, p) => a + p[1], 0) / pts.length;
      const k = 1 - clamp(2.2 / c.r, 0.08, 0.2);
      const din = smoothPath(pts.map(([x, y]) => [cx + (x - cx) * k, cy + (y - cy) * k]));
      bodyG.appendChild(el('path', { 'data-part': 'wall', d: din, fill: 'none', stroke: T.rim, 'stroke-opacity': 0.35, 'stroke-width': n(sw(c, 0.45)) }));
      // nucleoid: a coiled thread of DNA
      const len = shape === 'rod' ? c.r * 1.0 : c.r * 0.9;
      const amp = shape === 'rod' ? c.r * 0.16 : c.r * 0.2;
      const coil = coilPoints(cx - len / 2, cx + len / 2, cy, amp, shape === 'rod' ? 5 : 3.5, R.range(0, TAU));
      bodyG.appendChild(el('path', { 'data-part': 'nucleoid', d: smoothPath(coil, { closed: false }), fill: 'none', stroke: T.detail, 'stroke-opacity': n(T.detailOpacity * 1.5), 'stroke-width': n(sw(c, 0.4)), 'stroke-linecap': 'round' }));
    }
  }
  if (pili) inner.appendChild(el('path', { 'data-part': 'pili', d: pili, stroke: T.fuzz, 'stroke-opacity': 0.55, 'stroke-width': n(sw(c, 0.35)), 'stroke-linecap': 'round' }));
  inner.appendChild(bodyG);
  const outline = bodies.length === 1 ? bodies[0] : polarPoints(() => extentOf(bodies.flat()), 32);
  if (o.pamps && c.hi) {
    // pathogen-associated patterns (e.g. LPS): small bright motifs studding the surface
    let d = '';
    for (const pts of bodies) {
      for (const s of samplePerimeter(pts, Math.max(6, Math.round(pts.length / 3)))) {
        const x = s.x + s.nx * c.r * 0.08, y = s.y + s.ny * c.r * 0.08;
        d += polygonD(x, y, Math.max(0.8, c.r * 0.07), 3, Math.atan2(s.ny, s.nx));
      }
    }
    inner.appendChild(el('path', { 'data-part': 'pamps', d, fill: c.stage === 'light' ? mix(color, '#1B1F2A', 0.5) : mix(color, WHITE, 0.6) }));
  }
  const info = { kind: 'bacterium', shape, stage: c.stage, r: c.r, color, extent: extentOf(bodies.flat()), outline };
  setInfo(g, info);
  setInfo(inner, info);
  if (o.opsonized) {
    placeOnMembrane(inner, (op) => invert(antibody({ ...op, detail: 'low' }), op.size), {
      count: o.antibodies ?? Math.round(clamp(c.r / 2.5, 5, 12)), size: clamp(c.r * 0.55, 5, 16), seed: c.seed, layer: 'antibodies', stage: c.stage,
    });
  }
  return g;
}

/** Points of a looping thread (prolate trochoid) between x0 and x1 — reads as coiled DNA/RNA. */
export function coilPoints(x0, x1, y, amp, loops, phase = 0, samples = 0) {
  const N = samples || Math.round(loops * 10);
  const pts = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N, a = TAU * loops * t + phase;
    pts.push([lerp(x0, x1, t) - amp * 0.9 * Math.sin(a), y + amp * Math.cos(a)]);
  }
  return pts;
}

/** Flip a membrane glyph so its tips touch the anchor and its base points outward (opsonization). */
export function invert(glyph, size) {
  const w = el('g', { class: 'sao-inverted' });
  glyph.setAttribute('transform', `translate(0 ${n(-size * 1.02)}) rotate(180)`);
  w.appendChild(glyph);
  return w;
}

/**
 * Virus — small icosahedral capsid with spikes. virus({ r:10, seed, spikes:12, genome:true, stage })
 * Color: red-coral. Parts: spikes, capsid, facets, genome.
 */
export function virus(o = {}) {
  const c = opts(o, 10);
  const color = o.color || PALETTE.virus;
  const T = tones(color, c.stage, { intensity: 1.1 });
  const R = rng(c.seed, 'virus');
  const g = el('g', { class: 'sao-pathogen sao-virus', 'data-pathogen': 'virus' });
  const rot = R.range(0, Math.PI / 3);
  const verts = [];
  for (let i = 0; i < 6; i++) {
    const a = rot + (i / 6) * TAU;
    verts.push([Math.cos(a) * c.r, Math.sin(a) * c.r]);
  }
  if (c.glow) g.appendChild(el('circle', { 'data-part': 'glow', r: n(c.r * 2.1), fill: haloFill(color, c.stage, { intensity: 1.1 }) }));
  // spikes
  const k = o.spikes ?? 12;
  let ds = '', dk = '';
  for (let i = 0; i < k; i++) {
    const a = rot + (i / k) * TAU + Math.PI / k;
    const r0 = c.r * 0.86, r1 = c.r * 1.42;
    ds += `M${n(Math.cos(a) * r0)} ${n(Math.sin(a) * r0)}L${n(Math.cos(a) * r1)} ${n(Math.sin(a) * r1)}`;
    dk += circleD(Math.cos(a) * r1, Math.sin(a) * r1, Math.max(0.8, c.r * 0.13));
  }
  const sp = part('spikes');
  sp.appendChild(el('path', { d: ds, stroke: T.rim, 'stroke-width': n(sw(c, 0.7)), 'stroke-linecap': 'round', 'stroke-opacity': 0.9 }));
  sp.appendChild(el('path', { d: dk, fill: c.stage === 'light' ? T.rim : mix(color, WHITE, 0.35) }));
  g.appendChild(sp);
  // rounded hexagon capsid
  let d = '';
  for (let i = 0; i < 6; i++) {
    const p0 = verts[(i + 5) % 6], p1 = verts[i], p2 = verts[(i + 1) % 6];
    const a = [lerp(p1[0], p0[0], 0.14), lerp(p1[1], p0[1], 0.14)], b = [lerp(p1[0], p2[0], 0.14), lerp(p1[1], p2[1], 0.14)];
    d += (i ? 'L' : 'M') + n(a[0]) + ' ' + n(a[1]) + `Q${n(p1[0])} ${n(p1[1])} ${n(b[0])} ${n(b[1])}`;
  }
  d += 'Z';
  g.appendChild(part('capsid', {}, [el('path', { d, fill: bodyFill(color, c.stage, { intensity: 1.1 }), stroke: T.rim, 'stroke-width': n(sw(c)), 'stroke-linejoin': 'round' })]));
  if (c.hi) {
    // facets: icosahedron seen along a 3-fold axis
    const inner = verts.map(([x, y]) => [x * 0.42, y * 0.42]);
    let df = '';
    for (let i = 0; i < 6; i++) {
      const v = verts[i], w = inner[i];
      if (i % 2 === 0) df += `M${n(v[0] * 0.92)} ${n(v[1] * 0.92)}L${n(w[0])} ${n(w[1])}`;
      df += `M${n(w[0])} ${n(w[1])}L${n(inner[(i + 1) % 6][0])} ${n(inner[(i + 1) % 6][1])}`;
    }
    g.appendChild(el('path', { 'data-part': 'facets', d: df, fill: 'none', stroke: T.rim, 'stroke-opacity': 0.4, 'stroke-width': n(sw(c, 0.5)), 'stroke-linejoin': 'round' }));
    if (o.genome !== false && c.r >= 14) {
      const coil = coilPoints(-c.r * 0.35, c.r * 0.35, 0, c.r * 0.14, 3, R.range(0, TAU));
      g.appendChild(el('path', { 'data-part': 'genome', d: smoothPath(coil, { closed: false }), fill: 'none', stroke: c.stage === 'light' ? mix(color, '#1B1F2A', 0.3) : mix(color, WHITE, 0.55), 'stroke-opacity': 0.55, 'stroke-width': n(sw(c, 0.45)), 'stroke-linecap': 'round' }));
    }
  }
  setInfo(g, { kind: 'virus', stage: c.stage, r: c.r, color, extent: c.r * 1.5, outline: polarPoints(() => c.r, 24) });
  return g;
}

/**
 * Splinter — a wooden shard that breaks the skin (inflammation story). Centred; points
 * toward +x (rotate with `angle`). splinter({ length:160, seed, angle:deg, stage })
 * Parts: shard, grain.
 */
export function splinter(o = {}) {
  const L = o.length ?? 160;
  const stage = o.stage === 'light' ? 'light' : 'dark';
  const R = rng(o.seed ?? 1, 'splinter');
  const color = o.color || PALETTE.splinter;
  const w = L * 0.11;
  const top = [], bot = [];
  const K = 9;
  for (let i = 0; i <= K; i++) {
    const t = i / K;
    const x = -L / 2 + t * L;
    const taper = t < 0.75 ? 1 - t * 0.25 : (1 - t) / 0.25 * 0.81;
    top.push([x, -w / 2 * taper + R.range(-0.08, 0.08) * w]);
    bot.push([x, w / 2 * taper + R.range(-0.08, 0.08) * w]);
  }
  top[K] = [L / 2, 0];
  // ragged back end
  const back = [[-L / 2 - w * 0.25, w * 0.15], [-L / 2 + w * 0.15, -w * 0.05], [-L / 2 - w * 0.1, -w * 0.3]];
  const pts = [...top, ...bot.slice(0, K).reverse(), ...back];
  const dark = stage === 'dark';
  const g = el('g', { class: 'sao-pathogen sao-splinter', 'data-pathogen': 'splinter', transform: o.angle ? `rotate(${n(o.angle)})` : null });
  let d = '';
  pts.forEach((p, i) => (d += (i ? 'L' : 'M') + n(p[0]) + ' ' + n(p[1])));
  d += 'Z';
  g.appendChild(el('path', {
    'data-part': 'shard', d,
    fill: dark ? mix(color, '#0B1024', 0.15) : mix(color, WHITE, 0.35),
    stroke: dark ? mix(color, WHITE, 0.35) : mix(color, '#1B1F2A', 0.4), 'stroke-width': n(clamp(L * 0.01, 0.8, 2)), 'stroke-linejoin': 'round',
  }));
  let dg = '';
  for (let i = 0; i < 4; i++) {
    const y = (i - 1.5) * w * 0.2;
    dg += `M${n(-L / 2 + w * 0.3)} ${n(y)}C${n(-L * 0.1)} ${n(y + R.range(-1, 1) * w * 0.12)} ${n(L * 0.1)} ${n(y * 0.6)} ${n(L * 0.36 - Math.abs(y) * 2)} ${n(y * 0.3)}`;
  }
  g.appendChild(el('path', { 'data-part': 'grain', d: dg, fill: 'none', stroke: dark ? mix(color, WHITE, 0.25) : mix(color, '#1B1F2A', 0.3), 'stroke-opacity': 0.5, 'stroke-width': n(clamp(L * 0.006, 0.5, 1.2)) }));
  setInfo(g, { kind: 'splinter', stage, r: L / 2, extent: L / 2, outline: pts });
  return g;
}

export const PATHOGENS = { bacterium, virus, splinter };
