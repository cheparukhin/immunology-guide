// Self & Other — illustration library
// scenes.js: backgrounds and structures.
//
// Layout conventions
//   • AREA pieces fill a box { x = 0, y = 0, width, height } (top-left origin):
//       stageBackground, tissueField, ecmFibers, particleField
//   • OBJECT pieces are centred at (0,0) like cells; linear ones run along the x-axis:
//       bloodVessel, lymphaticVessel, lymphNode, membraneSurface, synapse
//   Rotate / translate them with a transform as needed.

import { el, part, n, circleD, ellipseD, capsuleD, TAU, clamp, lerp } from './svg.js';
import { PALETTE, STAGES, tones, mix, resolve, WHITE, stageOf, shade, rgba } from './palette.js';
import { stageFill, vignetteFill, bodyFill, haloFill, linear, radial, dotGlow } from './defs.js';
import { rng, smoothPath, polarPoints, blobRadius } from './shapes.js';
import { setInfo } from './registry.js';
import { redBloodCell } from './cells.js';

const dk = (stage) => stage !== 'light';

// ---------------------------------------------------------------- stage

/**
 * Stage background rectangle (navy radial + vignette on dark; paper on light).
 * Use when the stage must be part of the SVG (exports, sprites); otherwise the figure CSS
 * can paint it. stageBackground({ width, height, x:0, y:0, stage, vignette:true })
 */
export function stageBackground({ width = 600, height = 400, x = 0, y = 0, stage = 'dark', vignette = true } = {}) {
  const g = el('g', { class: 'sao-scene sao-stage', 'data-part': 'stage' });
  g.appendChild(el('rect', { x, y, width, height, fill: stageFill(stage) }));
  if (vignette && dk(stage)) g.appendChild(el('rect', { x, y, width, height, fill: vignetteFill(), 'pointer-events': 'none' }));
  return g;
}

// ---------------------------------------------------------------- ECM, particles, tissue

/**
 * Extracellular-matrix fibers: long, gently wavy strands (2 paths total — cheap).
 * ecmFibers({ width, height, x, y, count:18, seed, stage, angle:deg (main direction),
 *             spread:deg, waviness:0..1, opacity })
 */
export function ecmFibers({ width = 600, height = 400, x = 0, y = 0, count = 18, seed = 1, stage = 'dark', angle = -12, spread = 18, waviness = 0.5, opacity = 1, color } = {}) {
  const R = rng(seed, 'ecm');
  const c = resolve(color || (dk(stage) ? PALETTE.ecm : '#A89E90'));
  const g = el('g', { class: 'sao-scene sao-ecm', 'data-part': 'ecm' });
  let thin = '', thick = '';
  const diag = Math.hypot(width, height);
  for (let i = 0; i < count; i++) {
    const a = ((angle + R.range(-spread, spread)) * Math.PI) / 180;
    const cx = x + R.range(0, width), cy = y + R.range(0, height);
    const len = diag * R.range(0.35, 0.9);
    const steps = 10;
    const pts = [];
    const amp = R.range(4, 14) * waviness;
    const ph = R.range(0, TAU), fr = R.range(1.5, 3.5);
    for (let k = 0; k <= steps; k++) {
      const t = k / steps - 0.5;
      const px = cx + Math.cos(a) * len * t - Math.sin(a) * Math.sin(t * fr * TAU + ph) * amp;
      const py = cy + Math.sin(a) * len * t + Math.cos(a) * Math.sin(t * fr * TAU + ph) * amp;
      pts.push([px, py]);
    }
    const d = smoothPath(pts, { closed: false });
    if (R.chance(0.25)) thick += d; else thin += d;
  }
  g.appendChild(el('path', { d: thin, fill: 'none', stroke: c, 'stroke-opacity': n((dk(stage) ? 0.16 : 0.2) * opacity), 'stroke-width': 0.8, 'stroke-linecap': 'round' }));
  g.appendChild(el('path', { d: thick, fill: 'none', stroke: c, 'stroke-opacity': n((dk(stage) ? 0.1 : 0.12) * opacity), 'stroke-width': 2.4, 'stroke-linecap': 'round' }));
  return g;
}

/**
 * Soft particle field (drifting proteins / debris). Individual circles so animate.drift()
 * can move them. particleField({ width, height, x, y, count:40, seed, stage, color, size:[0.6,1.8] })
 */
export function particleField({ width = 600, height = 400, x = 0, y = 0, count = 40, seed = 1, stage = 'dark', color, size = [0.6, 1.8], opacity = 1 } = {}) {
  const R = rng(seed, 'particles');
  const c = resolve(color || (dk(stage) ? '#C9D3F0' : '#7A8194'));
  const g = el('g', { class: 'sao-scene sao-particles', 'data-part': 'particles' });
  for (let i = 0; i < count; i++) {
    g.appendChild(el('circle', {
      'data-part': 'particle', cx: n(x + R.range(0, width)), cy: n(y + R.range(0, height)), r: n(R.range(size[0], size[1])),
      fill: c, 'fill-opacity': n(R.range(0.12, 0.38) * opacity),
    }));
  }
  return g;
}

/**
 * Tissue background: ECM fibers + out-of-focus "ghost" cells + particles, all low-contrast
 * so foreground cells pop. tissueField({ width, height, x, y, seed, stage, density:1,
 *   tint: palette key/hex for ghost cells (default healthy sand), fibers, ghosts, particles })
 */
export function tissueField({ width = 600, height = 400, x = 0, y = 0, seed = 1, stage = 'dark', density = 1, tint, fibers = true, ghosts = true, particles = true } = {}) {
  const R = rng(seed, 'tissue');
  const g = el('g', { class: 'sao-scene sao-tissue', 'data-part': 'tissue' });
  if (fibers) g.appendChild(ecmFibers({ width, height, x, y, seed, stage, count: Math.round(14 * density * (width * height) / 240000) + 6 }));
  if (ghosts) {
    const gg = part('ghosts');
    const col = resolve(tint || PALETTE.healthy);
    const k = Math.round(((width * height) / 26000) * density);
    const fill = dk(stage)
      ? radial('ghost', [[0, col, 0.035], [0.6, col, 0.045], [0.85, col, 0.03], [1, col, 0]])
      : radial('ghost', [[0, col, 0.07], [0.65, col, 0.09], [0.88, col, 0.06], [1, col, 0]]);
    for (let i = 0; i < k; i++) {
      const r = R.range(28, 60);
      const rf = blobRadius({ r, seed: `${seed}g${i}`, irregularity: 0.5 });
      const cx = x + R.range(0, width), cy = y + R.range(0, height);
      gg.appendChild(el('path', { d: smoothPath(polarPoints(rf, 20).map(([px, py]) => [px + cx, py + cy])), fill }));
    }
    g.appendChild(gg);
  }
  if (particles) g.appendChild(particleField({ width, height, x, y, seed, stage, count: Math.round(((width * height) / 6000) * density) }));
  return g;
}

// ---------------------------------------------------------------- vessels

/**
 * Blood-vessel segment, horizontal, centred at (0,0).
 * bloodVessel({ length:500, width:110 (outer diameter), wall:14, seed, stage,
 *   leaky:false | true, gaps:[x…] (explicit gap positions, bottom wall),
 *   rbc:14 (count), endothelium:true, flow:1 (direction of RBC tilt) })
 * Parts: lumen, wall-top, wall-bottom (each holds endothelial cells), gaps, rbcs, basement.
 * cellInfo(g) → { lumenTop, lumenBottom, wallTop, wallBottom, gaps:[{x, wall:'bottom'|'top', width}] }.
 * Leaky gaps are where neutrophils squeeze through in the inflammation figure.
 */
export function bloodVessel(o = {}) {
  const { length = 500, width = 110, wall = 14, seed = 1, stage = 'dark', rbc = 14 } = o;
  const R = rng(seed, 'vessel');
  const dark = dk(stage);
  const S = stageOf(stage);
  const g = el('g', { class: 'sao-scene sao-vessel', 'data-part': 'vessel' });
  const half = width / 2, lt = -half + wall, lb = half - wall;
  const x0 = -length / 2, x1 = length / 2;
  // lumen (plasma)
  const plasma = dark
    ? linear('plasma', [[0, mix(PALETTE.rbc, S.bg, 0.82)], [0.5, mix(PALETTE.rbc, S.bg, 0.72)], [1, mix(PALETTE.rbc, S.bg, 0.82)]])
    : linear('plasma', [[0, mix(PALETTE.rbc, WHITE, 0.9)], [0.5, mix(PALETTE.rbc, WHITE, 0.84)], [1, mix(PALETTE.rbc, WHITE, 0.9)]]);
  g.appendChild(el('rect', { 'data-part': 'lumen', x: n(x0), y: n(lt), width: n(length), height: n(lb - lt), fill: plasma }));
  // flow streaks
  if (o.streaks !== false) {
    let ds = '';
    for (let i = 0; i < 6; i++) {
      const yy = lerp(lt + 8, lb - 8, R());
      const xs = R.range(x0, x1 - 60);
      ds += `M${n(xs)} ${n(yy)}h${n(R.range(30, 90))}`;
    }
    g.appendChild(el('path', { 'data-part': 'flow', d: ds, stroke: dark ? '#FFD9DC' : PALETTE.rbc, 'stroke-opacity': dark ? 0.06 : 0.12, 'stroke-width': 2, 'stroke-linecap': 'round' }));
  }
  // red blood cells
  const rbcG = part('rbcs');
  const rr = clamp((lb - lt) * 0.12, 4, 14);
  for (let i = 0; i < rbc; i++) {
    const view = R.pick(['face', 'tilted', 'side', 'tilted']);
    const cell = redBloodCell({ r: rr * R.range(0.9, 1.1), view, stage, seed: i, glow: false, angle: R.range(-35, 35) * (view === 'face' ? 0 : 1) });
    cell.setAttribute('transform', `translate(${n(R.range(x0 + rr, x1 - rr))} ${n(R.range(lt + rr * 1.1, lb - rr * 1.1))})`);
    rbcG.appendChild(cell);
  }
  g.appendChild(rbcG);
  // walls with endothelial cells
  const gapList = [];
  const explicit = Array.isArray(o.gaps) ? o.gaps : null;
  const leaky = !!o.leaky || !!explicit;
  const T = tones(o.wallColor || PALETTE.endothelium, stage);
  for (const side of ['top', 'bottom']) {
    const wg = part(`wall-${side}`);
    const y0 = side === 'top' ? -half : lb; // band from y0 to y0+wall
    let x = x0 - R.range(0, 40);
    let idx = 0;
    while (x < x1) {
      const L = R.range(70, 110);
      let gap = 1.5;
      const isGap = leaky && side === 'bottom' && (explicit ? explicit.some((gx) => gx > x + L - 8 && gx < x + L + 30) : R.chance(0.35));
      if (isGap) gap = R.range(16, 22);
      const ax = Math.max(x, x0), bx = Math.min(x + L, x1);
      if (bx - ax > 8) {
        const midY = y0 + wall / 2;
        const bulge = side === 'top' ? 1 : -1; // nucleus bulges into the lumen
        const nx = (ax + bx) / 2 + R.range(-10, 10);
        const cellG = el('g', { 'data-part': 'endothelial', 'data-index': String(idx++) });
        cellG.appendChild(el('path', {
          d: roundedBand(ax, bx, y0, wall, bulge, nx),
          fill: bodyFill(PALETTE.endothelium, stage, { intensity: 0.95 }), stroke: T.rim, 'stroke-opacity': dark ? 0.7 : 0.9, 'stroke-width': dark ? 1 : 1.2,
        }));
        cellG.appendChild(el('path', { d: ellipseD(nx, midY + bulge * wall * 0.18, Math.min(16, (bx - ax) * 0.22), wall * 0.26), fill: T.nucIn, stroke: T.nucRim, 'stroke-width': 0.8, 'stroke-opacity': 0.6 }));
        wg.appendChild(cellG);
      }
      if (isGap && bx < x1 - 10) gapList.push({ x: x + L + gap / 2, wall: side, width: gap });
      x += L + gap;
    }
    g.appendChild(wg);
  }
  // basement membrane: thin outer lines
  g.appendChild(el('path', {
    'data-part': 'basement', d: `M${n(x0)} ${n(-half - 1.5)}H${n(x1)}M${n(x0)} ${n(half + 1.5)}H${n(x1)}`,
    stroke: dark ? mix(PALETTE.endothelium, WHITE, 0.3) : mix(PALETTE.endothelium, S.ink, 0.4), 'stroke-opacity': dark ? 0.35 : 0.6, 'stroke-width': 1,
    'stroke-dasharray': leaky ? '6 3' : null,
  }));
  if (gapList.length) {
    const gp = part('gaps');
    for (const gq of gapList) gp.appendChild(el('rect', { x: n(gq.x - gq.width / 2), y: n(lb), width: n(gq.width), height: n(wall), fill: 'none', 'data-x': n(gq.x) }));
    g.appendChild(gp);
  }
  setInfo(g, { kind: 'bloodVessel', stage, lumenTop: lt, lumenBottom: lb, wallTop: -half, wallBottom: half, gaps: gapList, length });
  return g;
}

function roundedBand(ax, bx, y0, wall, bulge, nx) {
  const r = Math.min(wall / 2, (bx - ax) / 3);
  const yT = y0 + 0.8, yB = y0 + wall - 0.8;
  // nucleus bump toward the lumen
  const bump = wall * 0.35;
  const yIn = bulge > 0 ? yB : yT;
  const w = Math.min(26, (bx - ax) * 0.35);
  if (bulge > 0) {
    return `M${n(ax + r)} ${n(yT)}H${n(bx - r)}Q${n(bx)} ${n(yT)} ${n(bx)} ${n(yT + r)}V${n(yB - r)}Q${n(bx)} ${n(yB)} ${n(bx - r)} ${n(yB)}` +
      `H${n(nx + w)}C${n(nx + w * 0.5)} ${n(yIn)} ${n(nx + w * 0.4)} ${n(yIn + bump)} ${n(nx)} ${n(yIn + bump)}C${n(nx - w * 0.4)} ${n(yIn + bump)} ${n(nx - w * 0.5)} ${n(yIn)} ${n(nx - w)} ${n(yIn)}` +
      `H${n(ax + r)}Q${n(ax)} ${n(yB)} ${n(ax)} ${n(yB - r)}V${n(yT + r)}Q${n(ax)} ${n(yT)} ${n(ax + r)} ${n(yT)}Z`;
  }
  return `M${n(ax + r)} ${n(yB)}H${n(bx - r)}Q${n(bx)} ${n(yB)} ${n(bx)} ${n(yB - r)}V${n(yT + r)}Q${n(bx)} ${n(yT)} ${n(bx - r)} ${n(yT)}` +
    `H${n(nx + w)}C${n(nx + w * 0.5)} ${n(yIn)} ${n(nx + w * 0.4)} ${n(yIn - bump)} ${n(nx)} ${n(yIn - bump)}C${n(nx - w * 0.4)} ${n(yIn - bump)} ${n(nx - w * 0.5)} ${n(yIn)} ${n(nx - w)} ${n(yIn)}` +
    `H${n(ax + r)}Q${n(ax)} ${n(yT)} ${n(ax)} ${n(yT + r)}V${n(yB - r)}Q${n(ax)} ${n(yB)} ${n(ax + r)} ${n(yB)}Z`;
}

/**
 * Lymphatic vessel, horizontal, centred. Thin, translucent walls of overlapping flap cells
 * and V-shaped one-way valves. lymphaticVessel({ length:400, width:60, valves:2, seed, stage, flow:1 })
 * Parts: lumen, wall-top, wall-bottom, valves.
 */
export function lymphaticVessel(o = {}) {
  const { length = 400, width = 60, valves = 2, seed = 1, stage = 'dark', flow = 1 } = o;
  const R = rng(seed, 'lymphatic');
  const dark = dk(stage);
  const T = tones(PALETTE.lymph, stage);
  const g = el('g', { class: 'sao-scene sao-lymphatic', 'data-part': 'lymphatic' });
  const half = width / 2, x0 = -length / 2, x1 = length / 2;
  const wob = (x, s) => Math.sin(x * 0.02 + s) * 2.5;
  const top = [], bot = [];
  for (let k = 0; k <= 24; k++) {
    const x = x0 + (length * k) / 24;
    top.push([x, -half + wob(x, 1)]);
    bot.push([x, half + wob(x, 4)]);
  }
  const lumenD = smoothPath([...top, ...bot.slice().reverse()], { closed: true, smooth: 0.2 });
  g.appendChild(el('path', { 'data-part': 'lumen', d: lumenD, fill: dark ? linear('lymphlumen', [[0, PALETTE.lymph, 0.14], [0.5, PALETTE.lymph, 0.05], [1, PALETTE.lymph, 0.14]]) : linear('lymphlumen', [[0, PALETTE.lymph, 0.22], [0.5, PALETTE.lymph, 0.08], [1, PALETTE.lymph, 0.22]]) }));
  for (const [name, line, s] of [['wall-top', top, -1], ['wall-bottom', bot, 1]]) {
    const wg = part(name);
    // overlapping "oak-leaf" flap cells drawn as scalloped strokes
    let d = '';
    let x = x0;
    while (x < x1 - 10) {
      const L = R.range(40, 70);
      const xa = x, xb = Math.min(x1, x + L);
      const ya = s * half + wob(xa, s < 0 ? 1 : 4), yb = s * half + wob(xb, s < 0 ? 1 : 4);
      d += `M${n(xa)} ${n(ya)}Q${n((xa + xb) / 2)} ${n((ya + yb) / 2 - s * 5)} ${n(xb + 6)} ${n(yb + s * 1.5)}`;
      x += L;
    }
    wg.appendChild(el('path', { d, fill: 'none', stroke: T.rim, 'stroke-opacity': dark ? 0.75 : 0.9, 'stroke-width': 1.4, 'stroke-linecap': 'round' }));
    g.appendChild(wg);
  }
  const vg = part('valves');
  for (let i = 0; i < valves; i++) {
    const vx = x0 + ((i + 0.5) / valves) * length;
    const tip = vx + flow * width * 0.55;
    // two leaflets (thin crescents) pointing downstream — a one-way valve
    for (const sgn of [-1, 1]) {
      const y0 = sgn * (half - 1.5), yt = sgn * 2.5;
      const d = `M${n(vx - flow * 4)} ${n(y0)}Q${n(vx + flow * width * 0.32)} ${n(sgn * half * 0.55)} ${n(tip)} ${n(yt)}Q${n(vx + flow * width * 0.12)} ${n(sgn * half * 0.62)} ${n(vx + flow * 6)} ${n(y0)}Z`;
      vg.appendChild(el('path', { d, fill: dark ? rgba(PALETTE.lymph, 0.18) : rgba(PALETTE.lymph, 0.3), stroke: T.rim, 'stroke-opacity': dark ? 0.7 : 0.9, 'stroke-width': 1.1, 'stroke-linejoin': 'round' }));
    }
  }
  g.appendChild(vg);
  setInfo(g, { kind: 'lymphaticVessel', stage, top: -half, bottom: half, length });
  return g;
}

// ---------------------------------------------------------------- lymph node

/**
 * Lymph node (schematic cross-section), centred. lymphNode({ r:170 (half-width), seed, stage,
 *   follicles:5, afferent:3, cells:true })
 * Bean-shaped capsule with a subcapsular sinus; B-cell follicles (gold, dotted with B cells,
 * paler germinal centres) under the convex edge; T-cell paracortex (blue dots) deeper;
 * medullary cords toward the hilum (right, concave side) where the efferent lymphatic and
 * blood vessels leave; afferent lymphatics enter around the convex side.
 * Parts: capsule, sinus, follicles (follicle ×N), paracortex, medulla, afferent (×N), hilum, hev.
 * cellInfo(g) → { follicles:[{x,y,r}], paracortex:{x,y}, afferent:[{x,y,ox,oy,angle}], efferent:{x,y}, hev:[{x,y}] }
 */
export function lymphNode(o = {}) {
  const { r = 170, seed = 1, stage = 'dark' } = o;
  const R = rng(seed, 'ln');
  const dark = dk(stage);
  const S = stageOf(stage);
  const g = el('g', { class: 'sao-scene sao-lymph-node', 'data-part': 'lymph-node' });
  const sy = 0.72;
  const outline = blobRadius({ r, seed, irregularity: 0.12, bumps: [{ angle: 0, amp: -0.26, width: 0.42 }], kMax: 4 });
  const P = (a, k = 1) => { const rr = outline(a) * k; return [Math.cos(a) * rr, Math.sin(a) * rr * sy]; };
  const ring = (k) => Array.from({ length: 72 }, (_, i) => P((i / 72) * TAU, k));
  const pts = ring(1);
  const capT = tones(PALETTE.lymph, stage);
  const lymphInk = dark ? mix(PALETTE.lymph, WHITE, 0.25) : mix(PALETTE.lymph, S.ink, 0.35);
  const sw = clamp(r * 0.014, 1.2, 3);
  // afferent lymphatics (behind the capsule)
  const aff = part('afferent');
  const afferent = [];
  const na = o.afferent ?? 3;
  for (let i = 0; i < na; i++) {
    const a = Math.PI * 0.6 + (i / Math.max(1, na - 1)) * Math.PI * 0.8;
    const [ex, ey] = P(a, 0.99);
    const [ox, oy] = P(a + R.range(-0.12, 0.12), 1.38);
    afferent.push({ x: ex, y: ey, ox, oy, angle: (Math.atan2(ey - oy, ex - ox) * 180) / Math.PI });
    const mx = (ox + ex) / 2 + R.range(-12, 12), my = (oy + ey) / 2 + R.range(-12, 12);
    const vg = el('g', { 'data-part': 'vessel', 'data-index': String(i) });
    vg.appendChild(el('path', { d: `M${n(ox)} ${n(oy)}Q${n(mx)} ${n(my)} ${n(ex)} ${n(ey)}`, fill: 'none', stroke: lymphInk, 'stroke-opacity': dark ? 0.55 : 0.75, 'stroke-width': n(clamp(r * 0.05, 4, 9)), 'stroke-linecap': 'round' }));
    vg.appendChild(el('path', { d: `M${n(ox)} ${n(oy)}Q${n(mx)} ${n(my)} ${n(ex)} ${n(ey)}`, fill: 'none', stroke: dark ? S.bg : WHITE, 'stroke-opacity': dark ? 0.75 : 0.85, 'stroke-width': n(clamp(r * 0.05, 4, 9) - sw * 1.6), 'stroke-linecap': 'round' }));
    aff.appendChild(vg);
  }
  g.appendChild(aff);
  // body
  g.appendChild(part('capsule', {}, [el('path', {
    d: smoothPath(pts),
    fill: dark
      ? radial('lnbody', [[0, mix(PALETTE.lymph, S.bg, 0.88)], [0.75, mix(PALETTE.lymph, S.bg, 0.84)], [1, mix(PALETTE.lymph, S.bg, 0.74)]])
      : radial('lnbody', [[0, mix(PALETTE.lymph, WHITE, 0.93)], [1, mix(PALETTE.lymph, WHITE, 0.82)]]),
    stroke: capT.rim, 'stroke-width': n(sw * 1.6), 'stroke-opacity': dark ? 0.85 : 1,
  })]));
  // subcapsular sinus
  g.appendChild(el('path', { 'data-part': 'sinus', d: smoothPath(ring(0.93)), fill: 'none', stroke: lymphInk, 'stroke-opacity': dark ? 0.35 : 0.45, 'stroke-width': n(sw * 0.7), 'stroke-dasharray': `${n(sw * 3)} ${n(sw * 2.5)}` }));
  // paracortex (T zone)
  const paraR = blobRadius({ r: r * 0.66, seed: `${seed}p`, irregularity: 0.2, bumps: [{ angle: 0, amp: -0.42, width: 0.6 }] });
  const pp = polarPoints(paraR, 48).map(([x, y]) => [x - r * 0.08, y * sy]);
  const para = part('paracortex');
  para.appendChild(el('path', {
    d: smoothPath(pp),
    fill: radial('lnT', [[0, PALETTE.cd8, dark ? 0.1 : 0.08], [0.75, PALETTE.cd8, dark ? 0.12 : 0.1], [1, PALETTE.cd8, 0]]),
  }));
  g.appendChild(para);
  // medulla: branching cords converging on the hilum
  const med = part('medulla');
  let dm = '';
  const hx = outline(0) * 0.97;
  for (let i = 0; i < 6; i++) {
    const t = (i + 0.5) / 6;
    const endA = Math.PI * lerp(0.62, 1.38, t);
    const endR = r * R.range(0.18, 0.32);
    const ex = Math.cos(endA) * endR * 0.6 + r * 0.12, ey = Math.sin(endA) * endR * sy * 1.6;
    const c1 = [hx - r * 0.18, lerp(-r * 0.12, r * 0.12, t)];
    const c2 = [lerp(hx - r * 0.18, ex, 0.55) + R.range(-8, 8), lerp(c1[1], ey, 0.6) + R.range(-8, 8)];
    dm += smoothPath([[hx - r * 0.02, lerp(-r * 0.04, r * 0.04, t)], c1, c2, [ex, ey]], { closed: false });
    // a side branch
    const bx = lerp(c2[0], ex, 0.5), by = lerp(c2[1], ey, 0.5);
    dm += smoothPath([[bx, by], [bx - r * R.range(0.06, 0.12), by + R.sign() * r * R.range(0.06, 0.1)]], { closed: false });
  }
  med.appendChild(el('path', { d: dm, fill: 'none', stroke: lymphInk, 'stroke-opacity': dark ? 0.2 : 0.3, 'stroke-width': n(clamp(r * 0.04, 3, 9)), 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
  med.appendChild(el('path', { d: dm, fill: 'none', stroke: lymphInk, 'stroke-opacity': dark ? 0.35 : 0.45, 'stroke-width': n(sw * 0.6), 'stroke-linecap': 'round' }));
  g.appendChild(med);
  // follicles (B zones) along the convex edge
  const fol = part('follicles');
  const nf = o.follicles ?? 5;
  const follicles = [];
  const folFill = radial('lnB', [[0, PALETTE.bCell, dark ? 0.2 : 0.22], [0.7, PALETTE.bCell, dark ? 0.16 : 0.18], [1, PALETTE.bCell, 0]]);
  const gcFill = radial('lnGC', [[0, dark ? '#FFF3D6' : WHITE, dark ? 0.16 : 0.7], [1, dark ? '#FFF3D6' : WHITE, 0]]);
  for (let i = 0; i < nf; i++) {
    const a = Math.PI * 0.42 + (i / Math.max(1, nf - 1)) * Math.PI * 1.16;
    const [fx, fy] = P(a, 0.74);
    const fr = r * R.range(0.13, 0.16);
    follicles.push({ x: fx, y: fy, r: fr });
    const fg = el('g', { 'data-part': 'follicle', 'data-index': String(i) });
    fg.appendChild(el('circle', { cx: n(fx), cy: n(fy), r: n(fr * 1.15), fill: folFill }));
    fg.appendChild(el('circle', { 'data-part': 'germinal-centre', cx: n(fx - Math.cos(a) * fr * 0.18), cy: n(fy - Math.sin(a) * fr * 0.18), r: n(fr * 0.55), fill: gcFill }));
    fol.appendChild(fg);
  }
  g.appendChild(fol);
  // resident lymphocytes as fine dots: B cells in follicles, T cells in the paracortex
  if (o.cells !== false) {
    const dotR = clamp(r * 0.0085, 0.9, 2.2);
    let db = '', dtc = '';
    for (const f of follicles) {
      for (let k = 0; k < 34; k++) {
        const a = R.range(0, TAU), rr = Math.sqrt(R()) * f.r * 1.05;
        const x = f.x + Math.cos(a) * rr, y = f.y + Math.sin(a) * rr;
        if (Math.hypot(x - f.x, y - f.y) < f.r * 0.42 && R.chance(0.7)) continue; // sparser germinal centre
        db += circleD(x, y, dotR * R.range(0.8, 1.15));
      }
    }
    let placed = 0;
    for (let k = 0; k < 900 && placed < 230; k++) {
      const x = R.range(-r * 0.75, r * 0.5), y = R.range(-r * 0.5, r * 0.5) * sy;
      const a = Math.atan2(y / sy, x + r * 0.08);
      const rr = Math.hypot(x + r * 0.08, y / sy);
      if (rr > paraR(a) * 0.92) continue;
      if (follicles.some((f) => Math.hypot(x - f.x, y - f.y) < f.r * 1.2)) continue;
      dtc += circleD(x, y, dotR * R.range(0.8, 1.15));
      placed++;
    }
    g.appendChild(part('lymphocytes', {}, [
      el('path', { d: db, fill: dark ? mix(PALETTE.bCell, WHITE, 0.15) : mix(PALETTE.bCell, S.ink, 0.25), 'fill-opacity': dark ? 0.55 : 0.6 }),
      el('path', { d: dtc, fill: dark ? mix(PALETTE.cd8, WHITE, 0.25) : PALETTE.cd8, 'fill-opacity': dark ? 0.45 : 0.45 }),
    ]));
  }
  // HEVs: small vessel rings in the paracortex
  const hev = part('hev');
  const hevs = [];
  for (let i = 0; i < 4; i++) {
    const a = Math.PI * (0.65 + (i / 3) * 0.7) + R.range(-0.1, 0.1), rr = r * R.range(0.32, 0.45);
    const hx2 = Math.cos(a) * rr, hy2 = Math.sin(a) * rr * sy;
    hevs.push({ x: hx2, y: hy2 });
    hev.appendChild(el('circle', { cx: n(hx2), cy: n(hy2), r: n(r * 0.032), fill: dark ? rgba(PALETTE.rbc, 0.25) : rgba(PALETTE.rbc, 0.18), stroke: dark ? mix(PALETTE.rbc, WHITE, 0.3) : mix(PALETTE.rbc, S.ink, 0.3), 'stroke-width': n(sw * 0.8), 'stroke-opacity': 0.75 }));
  }
  g.appendChild(hev);
  // hilum: efferent lymphatic + artery + vein
  const hil = part('hilum');
  const eff = { x: hx + r * 0.36, y: 0 };
  const vw = clamp(r * 0.05, 4, 9);
  hil.appendChild(el('path', { 'data-part': 'efferent', d: `M${n(hx - r * 0.08)} 0C${n(hx + r * 0.08)} 2 ${n(hx + r * 0.22)} -5 ${n(eff.x)} 0`, fill: 'none', stroke: lymphInk, 'stroke-width': n(vw * 1.2), 'stroke-opacity': dark ? 0.7 : 0.85, 'stroke-linecap': 'round' }));
  hil.appendChild(el('path', { d: `M${n(hx - r * 0.04)} ${n(-r * 0.07)}C${n(hx + r * 0.1)} ${n(-r * 0.09)} ${n(hx + r * 0.22)} ${n(-r * 0.15)} ${n(eff.x)} ${n(-r * 0.17)}`, fill: 'none', stroke: PALETTE.rbc, 'stroke-width': n(vw * 0.7), 'stroke-opacity': 0.65, 'stroke-linecap': 'round' }));
  hil.appendChild(el('path', { d: `M${n(hx - r * 0.04)} ${n(r * 0.07)}C${n(hx + r * 0.1)} ${n(r * 0.09)} ${n(hx + r * 0.22)} ${n(r * 0.15)} ${n(eff.x)} ${n(r * 0.17)}`, fill: 'none', stroke: mix(PALETTE.rbc, '#5A6BC4', 0.55), 'stroke-width': n(vw * 0.8), 'stroke-opacity': 0.6, 'stroke-linecap': 'round' }));
  g.appendChild(hil);
  setInfo(g, { kind: 'lymphNode', stage, r, outline: pts, follicles, paracortex: { x: -r * 0.3, y: 0 }, afferent, efferent: eff, hev: hevs });
  return g;
}

/**
 * Lymph-node INTERIOR for scenes inside a node (T-cell search, clonal expansion): a soft
 * oval capsule filling the box, a fine reticular mesh (the fibroblast scaffolding T cells
 * crawl along), a central blue-tinted T-cell zone and gold B-cell follicles near the rim.
 * Area piece: lymphNodeField({ width, height, x, y, seed, stage, follicles:3, mesh:true,
 *   dots:true (faint resident T/B dots), density:1, label:false (draws "LYMPH NODE") })
 * cellInfo(g) → { cx, cy, rx, ry, tZone:{cx,cy,rx,ry}, follicles:[{x,y,r}], inside(x,y), randomPoint(R) }
 * Parts: capsule, sinus, tzone, follicles (follicle ×N), mesh, residents, label.
 */
export function lymphNodeField(o = {}) {
  const { width = 800, height = 480, x = 0, y = 0, seed = 1, stage = 'dark', follicles: nf = 3, density = 1 } = o;
  const R = rng(seed, 'lnfield');
  const dark = dk(stage);
  const S = stageOf(stage);
  const g = el('g', { class: 'sao-scene sao-ln-field', 'data-part': 'lymph-node-field' });
  const cx = x + width / 2, cy = y + height / 2;
  const rx = width / 2 - Math.max(6, width * 0.02), ry = height / 2 - Math.max(6, height * 0.03);
  const lymphInk = dark ? mix(PALETTE.lymph, WHITE, 0.2) : mix(PALETTE.lymph, S.ink, 0.35);
  const oval = blobRadius({ r: 1, seed, irregularity: 0.08, kMax: 4 });
  const ovalPts = (k) => Array.from({ length: 72 }, (_, i) => {
    const a = (i / 72) * TAU, f = oval(a) * k;
    return [cx + Math.cos(a) * rx * f, cy + Math.sin(a) * ry * f];
  });
  const inside = (px, py, k = 0.97) => {
    const a = Math.atan2((py - cy) / ry, (px - cx) / rx);
    return Math.hypot((px - cx) / rx, (py - cy) / ry) < oval(a) * k;
  };
  // capsule + subcapsular sinus
  g.appendChild(el('path', {
    'data-part': 'capsule', d: smoothPath(ovalPts(1)),
    fill: dark
      ? radial('lnfield', [[0, mix(PALETTE.lymph, S.bg, 0.9)], [0.8, mix(PALETTE.lymph, S.bg, 0.87)], [1, mix(PALETTE.lymph, S.bg, 0.8)]])
      : radial('lnfield', [[0, mix(PALETTE.lymph, WHITE, 0.95)], [1, mix(PALETTE.lymph, WHITE, 0.86)]]),
    stroke: lymphInk, 'stroke-opacity': dark ? 0.45 : 0.6, 'stroke-width': 1.6,
  }));
  g.appendChild(el('path', { 'data-part': 'sinus', d: smoothPath(ovalPts(0.955)), fill: 'none', stroke: lymphInk, 'stroke-opacity': dark ? 0.22 : 0.35, 'stroke-width': 1, 'stroke-dasharray': '5 4' }));
  // T-cell zone (paracortex)
  const tz = { cx: cx + rx * 0.06, cy: cy + ry * 0.12, rx: rx * 0.62, ry: ry * 0.56 };
  g.appendChild(el('ellipse', {
    'data-part': 'tzone', cx: n(tz.cx), cy: n(tz.cy), rx: n(tz.rx), ry: n(tz.ry),
    fill: radial('lnfT', [[0, PALETTE.cd8, dark ? 0.11 : 0.08], [0.7, PALETTE.cd8, dark ? 0.08 : 0.06], [1, PALETTE.cd8, 0]]),
  }));
  // B-cell follicles along the upper/outer rim
  const fol = part('follicles');
  const follicles = [];
  const folFill = radial('lnfB', [[0, PALETTE.bCell, dark ? 0.18 : 0.2], [0.65, PALETTE.bCell, dark ? 0.13 : 0.15], [1, PALETTE.bCell, 0]]);
  for (let i = 0; i < nf; i++) {
    const a = Math.PI * (1.12 + (nf === 1 ? 0.38 : (i / (nf - 1)) * 0.76)) + R.range(-0.08, 0.08);
    const fr = Math.min(rx, ry) * R.range(0.2, 0.26);
    const k = 0.76;
    const fx = cx + Math.cos(a) * rx * oval(a) * k, fy = cy + Math.sin(a) * ry * oval(a) * k;
    follicles.push({ x: fx, y: fy, r: fr });
    fol.appendChild(el('circle', { 'data-part': 'follicle', 'data-index': String(i), cx: n(fx), cy: n(fy), r: n(fr * 1.2), fill: folFill }));
  }
  g.appendChild(fol);
  // reticular mesh: jittered lattice, each node joined to its near neighbours
  if (o.mesh !== false) {
    const sp = Math.max(22, Math.min(width, height) / (9 * Math.sqrt(density)));
    const nodes = [];
    for (let yy = y + sp / 2; yy < y + height; yy += sp * 0.87) {
      for (let xx = x + sp / 2 + ((Math.round((yy - y) / (sp * 0.87)) % 2) * sp) / 2; xx < x + width; xx += sp) {
        const px = xx + R.range(-0.35, 0.35) * sp, py = yy + R.range(-0.35, 0.35) * sp;
        if (inside(px, py, 0.93)) nodes.push([px, py]);
      }
    }
    let dl = '', dn = '';
    for (let i = 0; i < nodes.length; i++) {
      const [ax, ay] = nodes[i];
      const near = nodes
        .map((p, j) => ({ j, d: Math.hypot(p[0] - ax, p[1] - ay) }))
        .filter((q) => q.j > i && q.d < sp * 1.45)
        .sort((a2, b2) => a2.d - b2.d)
        .slice(0, 3);
      for (const q of near) {
        const [bx, by] = nodes[q.j];
        const mx = (ax + bx) / 2 + R.range(-0.12, 0.12) * sp, my = (ay + by) / 2 + R.range(-0.12, 0.12) * sp;
        dl += `M${n(ax)} ${n(ay)}Q${n(mx)} ${n(my)} ${n(bx)} ${n(by)}`;
      }
      dn += ellipseD(ax, ay, sp * 0.07, sp * 0.035, R.range(0, 180));
    }
    const meshC = dark ? mix(PALETTE.fibroblast, WHITE, 0.25) : mix(PALETTE.fibroblast, S.ink, 0.2);
    g.appendChild(part('mesh', {}, [
      el('path', { d: dl, fill: 'none', stroke: meshC, 'stroke-opacity': dark ? 0.16 : 0.18, 'stroke-width': 0.8, 'stroke-linecap': 'round' }),
      el('path', { d: dn, fill: meshC, 'fill-opacity': dark ? 0.3 : 0.3 }),
    ]));
  }
  // faint resident lymphocytes (the crowd a figure animates is drawn on top)
  if (o.dots !== false) {
    const dr = Math.max(1, Math.min(width, height) * 0.004);
    let dt = '', db = '';
    const nT = Math.round(((width * height) / 2600) * density);
    for (let i = 0, k = 0; i < nT && k < nT * 6; k++) {
      const a = R.range(0, TAU), rr = Math.sqrt(R());
      const px = tz.cx + Math.cos(a) * rr * tz.rx, py = tz.cy + Math.sin(a) * rr * tz.ry;
      if (!inside(px, py, 0.9)) continue;
      dt += circleD(px, py, dr * R.range(0.8, 1.2));
      i++;
    }
    for (const f of follicles) {
      for (let i = 0; i < 26 * density; i++) {
        const a = R.range(0, TAU), rr = Math.sqrt(R()) * f.r;
        db += circleD(f.x + Math.cos(a) * rr, f.y + Math.sin(a) * rr, dr * R.range(0.8, 1.2));
      }
    }
    g.appendChild(part('residents', {}, [
      el('path', { d: dt, fill: dark ? mix(PALETTE.cd8, WHITE, 0.2) : PALETTE.cd8, 'fill-opacity': dark ? 0.22 : 0.25 }),
      el('path', { d: db, fill: dark ? mix(PALETTE.bCell, WHITE, 0.1) : mix(PALETTE.bCell, S.ink, 0.2), 'fill-opacity': dark ? 0.3 : 0.35 }),
    ]));
  }
  if (o.label) {
    g.appendChild(label({ x: cx - rx * 0.62, y: cy - ry * 0.86, text: 'LYMPH NODE', stage, size: 12, weight: 600, caps: true }));
  }
  const info = {
    kind: 'lymphNodeField', stage, cx, cy, rx, ry, tZone: tz, follicles,
    inside: (px, py) => inside(px, py, 0.95),
    randomPoint: (Rn = Math.random) => {
      const rnd = typeof Rn === 'function' ? Rn : Math.random;
      for (let k = 0; k < 200; k++) {
        const px = cx + (rnd() * 2 - 1) * rx, py = cy + (rnd() * 2 - 1) * ry;
        if (inside(px, py, 0.9)) return [px, py];
      }
      return [cx, cy];
    },
  };
  setInfo(g, info);
  return g;
}

// ---------------------------------------------------------------- membranes (molecular scale)

/**
 * Lipid-bilayer close-up, horizontal, centred on x. The OUTER surface is at y = 0 and the
 * extracellular side is up (−y); the cytoplasm (tinted with the cell's color) lies below.
 * side:'down' mirrors it (extracellular below, outer surface still at y = 0).
 * membraneSurface({ width:400, thickness:12, color:'cd8', stage, detail, depth:40, side:'up' })
 * Parts: cytoplasm, bilayer (heads-outer, heads-inner, tails).
 * Seat molecules with placeAlong(g, 'tcr', { y: 0, x0, x1, count }).
 */
export function membraneSurface(o = {}) {
  const { width = 400, thickness = 12, stage = 'dark', depth = 40, side = 'up' } = o;
  const color = resolve(o.color || PALETTE.healthy);
  const dark = dk(stage);
  const S = stageOf(stage);
  const detail = o.detail || (thickness >= 9 ? 'high' : 'low');
  const g = el('g', { class: 'sao-scene sao-membrane-surface', 'data-part': 'membrane-surface', 'data-side': side });
  const inner = el('g', { transform: side === 'down' ? 'scale(1 -1)' : null });
  g.appendChild(inner);
  const x0 = -width / 2;
  const cyto = dark
    ? linear('cyto', [[0, mix(shade(color, 0.45), S.bg, 0.35), 0.9], [1, mix(shade(color, 0.45), S.bg, 0.35), 0]])
    : linear('cyto', [[0, mix(color, WHITE, 0.7), 1], [1, mix(color, WHITE, 0.7), 0]]);
  if (depth > 0) inner.appendChild(el('rect', { 'data-part': 'cytoplasm', x: n(x0), y: n(thickness), width: n(width), height: n(depth), fill: cyto }));
  const head = dark ? mix(color, WHITE, 0.35) : mix(color, S.ink, 0.3);
  const bil = part('bilayer');
  bil.appendChild(el('rect', { x: n(x0), y: 0, width: n(width), height: n(thickness), fill: dark ? mix(shade(color, 0.6), S.bg, 0.3) : mix(color, WHITE, 0.82) }));
  if (detail === 'high') {
    const hr = thickness * 0.17;
    const step = hr * 2.25;
    let dh = '', dt = '';
    for (let x = x0 + hr; x < x0 + width; x += step) {
      dh += circleD(x, hr, hr);
      dh += circleD(x, thickness - hr, hr);
      dt += `M${n(x - hr * 0.35)} ${n(hr * 2)}V${n(thickness / 2 - 0.4)}M${n(x + hr * 0.35)} ${n(hr * 2)}V${n(thickness / 2 - 0.4)}`;
      dt += `M${n(x - hr * 0.35)} ${n(thickness - hr * 2)}V${n(thickness / 2 + 0.4)}M${n(x + hr * 0.35)} ${n(thickness - hr * 2)}V${n(thickness / 2 + 0.4)}`;
    }
    bil.appendChild(el('path', { 'data-part': 'tails', d: dt, stroke: head, 'stroke-opacity': 0.35, 'stroke-width': Math.max(0.4, thickness * 0.04) }));
    bil.appendChild(el('path', { 'data-part': 'heads', d: dh, fill: head, 'fill-opacity': dark ? 0.75 : 0.85 }));
  } else {
    bil.appendChild(el('path', { d: `M${n(x0)} 0.5H${n(x0 + width)}M${n(x0)} ${n(thickness - 0.5)}H${n(x0 + width)}`, stroke: head, 'stroke-width': 1.2 }));
  }
  inner.appendChild(bil);
  setInfo(g, { kind: 'membraneSurface', stage, surfaceY: 0, thickness, width, side });
  return g;
}

/**
 * Immune synapse close-up: two membranes facing each other across a narrow gap.
 * synapse({ width:420, gap:70, top:{ color:'cd8' }, bottom:{ color:'cancer' }, stage, thickness:12, depth:50 })
 * The TOP cell's outer surface is at y = −gap/2 (its glyphs point down: facing:'down');
 * the BOTTOM cell's outer surface is at y = +gap/2 (glyphs point up).
 * cellInfo(g) → { topY, bottomY }. Parts: membrane-top, membrane-bottom.
 */
export function synapse(o = {}) {
  const { width = 420, gap = 70, stage = 'dark', thickness = 12, depth = 50 } = o;
  const g = el('g', { class: 'sao-scene sao-synapse', 'data-part': 'synapse' });
  const top = membraneSurface({ width, thickness, depth, stage, color: (o.top && o.top.color) || PALETTE.cd8, side: 'down', detail: o.detail });
  top.setAttribute('transform', `translate(0 ${n(-gap / 2)})`);
  top.setAttribute('data-part', 'membrane-top');
  const bot = membraneSurface({ width, thickness, depth, stage, color: (o.bottom && o.bottom.color) || PALETTE.cancer, side: 'up', detail: o.detail });
  bot.setAttribute('transform', `translate(0 ${n(gap / 2)})`);
  bot.setAttribute('data-part', 'membrane-bottom');
  g.appendChild(top);
  g.appendChild(bot);
  setInfo(g, { kind: 'synapse', stage, topY: -gap / 2, bottomY: gap / 2, width });
  return g;
}

// ---------------------------------------------------------------- labels

/**
 * Figure label with optional thin leader line (keep in-SVG text minimal and large).
 * label({ x, y, text, anchor:'start'|'middle'|'end', leader:[x2,y2], stage, size:13,
 *         weight:500, color, dot:true })
 * Font: the site UI font via CSS var(--font-ui), falling back to Inter/system-ui.
 */
export function label({ x = 0, y = 0, text = '', anchor = 'start', leader = null, stage = 'dark', size = 13, weight = 500, color, dot = true, caps = false } = {}) {
  const S = stageOf(stage);
  const ink = color ? resolve(color) : dk(stage) ? S.ink : S.ink;
  const g = el('g', { class: 'sao-label', 'data-part': 'label' });
  if (leader) {
    const [lx, ly] = leader;
    g.appendChild(el('path', { d: `M${n(x)} ${n(y)}L${n(lx)} ${n(ly)}`, stroke: dk(stage) ? S.ink2 : S.ink3, 'stroke-width': 0.9, 'stroke-opacity': 0.8, fill: 'none' }));
    if (dot) g.appendChild(el('circle', { cx: n(lx), cy: n(ly), r: 1.8, fill: dk(stage) ? S.ink : S.ink2 }));
  }
  const t = el('text', {
    x: n(x), y: n(y), 'text-anchor': anchor, 'dominant-baseline': 'middle',
    fill: ink, 'font-size': size, 'font-weight': weight,
    style: `font-family: var(--font-ui, Inter, system-ui, -apple-system, sans-serif);${caps ? 'letter-spacing:0.06em;text-transform:uppercase;' : ''}`,
  }, text);
  // halo so labels stay legible over busy art
  t.setAttribute('paint-order', 'stroke');
  t.setAttribute('stroke', dk(stage) ? S.bg : S.bg2);
  t.setAttribute('stroke-width', Math.max(2, size * 0.28));
  t.setAttribute('stroke-opacity', 0.75);
  t.setAttribute('stroke-linejoin', 'round');
  g.appendChild(t);
  return g;
}

export const SCENES = { stageBackground, tissueField, ecmFibers, particleField, bloodVessel, lymphaticVessel, lymphNode, lymphNodeField, membraneSurface, synapse };
