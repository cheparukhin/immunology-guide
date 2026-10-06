// Self & Other — illustration library
// molecules.js: schematic molecule glyphs + helpers to seat them on membranes.
//
// GLYPH CONVENTIONS (all molecules)
//   • Anchor (0,0) = the point where the molecule meets the outer membrane surface.
//   • The extracellular part points UP (−y). Anything at +y is inside the cell
//     (transmembrane stubs, CAR signalling domains, signal icons).
//   • `size` = height of the extracellular part in px (≈ the glyph's visual height).
//   • Free-floating molecules (antibody, cytokine, granzyme…) accept anchor:'center'.
//   • Every factory takes { size, stage:'dark'|'light', detail:'auto'|'high'|'low', color }.
//   • detail:'auto' → 'high' when size ≥ 22 px, else a lighter 1–3 node version.

import { el, part, n, capsuleD, ellipseD, roundRectD, circleD, polygonD, clamp, TAU, lerp } from './svg.js';
import { PALETTE, BASES, glyphTones, resolve, mix, stageOf, WHITE, luminance } from './palette.js';
import { dotGlow } from './defs.js';
import { rng, smoothPath, samplePerimeter, foldedPositions } from './shapes.js';
import { cellInfo } from './registry.js';
import { tcrKey, epitopeKey } from './keys.js';
import { cupPockets } from './groove.js';

// ---------------------------------------------------------------- shared helpers

function setup(name, o, defColor, autoAt = 22) {
  const size = o.size ?? 16;
  const stage = o.stage === 'light' ? 'light' : 'dark';
  const det = !o.detail || o.detail === 'auto' ? (size >= autoAt ? 'high' : 'low') : o.detail;
  const T = glyphTones(o.color || defColor, stage, { emphasis: o.emphasis || 0 });
  const sw = clamp(size * 0.045, 0.55, 2.2);
  const root = el('g', { class: `sao-mol sao-${name}`, 'data-mol': name });
  return { u: size, size, stage, det, T, sw, root };
}

function dom(d, T, sw, attrs = {}) {
  return el('path', {
    d, fill: T.fill, stroke: T.stroke, 'stroke-width': n(sw), 'stroke-linejoin': 'round', ...attrs,
  });
}

function stub(T, sw, x, y0, y1, w = 1.2) {
  return el('path', {
    d: `M${n(x)} ${n(y0)}V${n(y1)}`, stroke: T.stroke, 'stroke-width': n(sw * w), 'stroke-linecap': 'round', fill: 'none',
    'stroke-opacity': 0.8,
  });
}

function anchorCenter(root, dy) {
  const inner = el('g', { transform: `translate(0 ${n(dy)})` });
  while (root.firstChild) inner.appendChild(root.firstChild);
  root.appendChild(inner);
  return root;
}

/**
 * Small signal icon (never rely on color alone):
 *   type 'activating' → green-cyan disc with a plus; 'inhibitory' → crimson disc with a bar.
 * Centered at (0,0); `size` = diameter.
 */
export function signalIcon({ type = 'activating', size = 10, stage = 'dark', x = 0, y = 0 } = {}) {
  const act = type !== 'inhibitory';
  const c = act ? PALETTE.activating : PALETTE.inhibitory;
  const r = size / 2;
  const g = el('g', { class: 'sao-icon', 'data-part': act ? 'icon-plus' : 'icon-minus', transform: `translate(${n(x)} ${n(y)})` });
  g.appendChild(el('circle', {
    r: n(r), fill: stage === 'light' ? c : mix(c, stageOf(stage).bg, 0.15),
    stroke: stage === 'light' ? mix(c, '#1B1F2A', 0.35) : mix(c, WHITE, 0.4), 'stroke-width': n(Math.max(0.5, size * 0.07)),
  }));
  const k = r * 0.55, w = Math.max(0.8, size * 0.16);
  const mark = act ? `M${n(-k)} 0H${n(k)}M0 ${n(-k)}V${n(k)}` : `M${n(-k)} 0H${n(k)}`;
  g.appendChild(el('path', { d: mark, stroke: act ? '#0B1024' : WHITE, 'stroke-width': n(w), 'stroke-linecap': 'round' }));
  return g;
}

// ---------------------------------------------------------------- MHC

const PEPTIDE_COLORS = { self: PALETTE.selfPeptide, foreign: PALETTE.foreignPeptide, viral: PALETTE.foreignPeptide, neo: PALETTE.foreignPeptide };

function peptideBead(cx, cy, r, kind, stage, { capsule = null } = {}) {
  const g = el('g', { 'data-part': 'peptide', 'data-peptide': kind });
  if (!kind || kind === 'none') return g;
  const c = PEPTIDE_COLORS[kind] || resolve(kind);
  const foreign = kind === 'foreign' || kind === 'viral' || kind === 'neo' || (kind[0] === '#' && kind.toUpperCase() === PALETTE.foreignPeptide);
  const dark = stage !== 'light';
  if (foreign && dark) {
    const gr = capsule ? Math.max(capsule.len / 2, r) * 1.15 : r * 2.6;
    g.appendChild(el('circle', { cx: n(cx), cy: n(cy), r: n(gr), fill: dotGlow(c, 0.65), 'data-part': 'peptide-glow' }));
  }
  const fill = dark ? (foreign ? mix(c, WHITE, 0.12) : mix(c, '#0B1024', 0.12)) : c;
  const stroke = dark ? (foreign ? mix(c, WHITE, 0.6) : mix(c, WHITE, 0.35)) : mix(c, '#1B1F2A', 0.5);
  const sw = Math.max(0.5, r * 0.22);
  const d = capsule
    ? capsuleD(cx - capsule.len / 2, cy, cx + capsule.len / 2, cy, r * 2)
    : circleD(cx, cy, r);
  g.appendChild(el('path', { d, fill, stroke, 'stroke-width': n(sw) }));
  if (foreign) {
    // inner bright core: a second, shape-based cue besides color
    const cr = r * 0.38;
    const core = capsule
      ? capsuleD(cx - capsule.len / 2 + r * 0.3, cy, cx + capsule.len / 2 - r * 0.3, cy, cr * 2)
      : circleD(cx, cy, cr);
    g.appendChild(el('path', { d: core, fill: dark ? WHITE : mix(c, '#1B1F2A', 0.45), 'fill-opacity': dark ? 0.85 : 0.9 }));
  }
  return g;
}

function cupD(wo, wi, yb, yr, yib) {
  const rc = (wo - wi) / 2;
  return (
    `M${n(-wo)} ${n(yr)}C${n(-wo)} ${n(yb + (yr - yb) * 0.25)} ${n(-wo * 0.55)} ${n(yb)} 0 ${n(yb)}` +
    `C${n(wo * 0.55)} ${n(yb)} ${n(wo)} ${n(yb + (yr - yb) * 0.25)} ${n(wo)} ${n(yr)}` +
    `A${n(rc)} ${n(rc)} 0 0 0 ${n(wi)} ${n(yr)}` +
    `C${n(wi)} ${n(yib + (yr - yib) * 0.2)} ${n(wi * 0.55)} ${n(yib)} 0 ${n(yib)}` +
    `C${n(-wi * 0.55)} ${n(yib)} ${n(-wi)} ${n(yib + (yr - yib) * 0.2)} ${n(-wi)} ${n(yr)}` +
    `A${n(rc)} ${n(rc)} 0 0 0 ${n(-wo)} ${n(yr)}Z`
  );
}

/**
 * MHC class I — the "shop window": single stalk, side bead (β2-microglobulin), a cup
 * holding a short peptide bead.  peptide: 'self' | 'foreign' | 'viral' | 'neo' | 'none' | hex
 * key: show the peptide as the epitopeKey plug of that clone key (keySize = matching TCR size).
 * pockets: ['round'|'square'|'triangle'|'wide', …] draws the two groove-floor pockets (an HLA
 * "type"); anchors: ['circle'|'square'|'triangle', …] — if both fit, a 3-bead peptide lies in the
 * groove with its anchors seated; if not, the cup shows no peptide (high detail).
 * Parts: stalk, b2m, groove, peptide.
 */
export function mhc1(o = {}) {
  const { u, det, T, sw, root, stage } = setup('mhc1', o, PALETTE.mhc);
  const peptide = o.peptide ?? 'self';
  root.setAttribute('data-peptide', peptide);
  const keyed = o.key != null && peptide !== 'none';
  const keyPep = () => {
    // a keyed peptide: the plug (complement of a clone's tcrKey) pokes up out of the cup
    const g = el('g', { 'data-part': 'peptide', 'data-peptide': peptide, transform: `translate(0 ${n(-0.84 * u)})` });
    g.appendChild(epitopeKey({ key: o.key, size: o.keySize ?? u, stage, facing: 'up', color: PEPTIDE_COLORS[peptide] || resolve(peptide) }));
    return g;
  };
  if (det === 'low') {
    root.appendChild(el('path', {
      'data-part': 'groove',
      d: `M${n(-0.04 * u)} ${n(0.08 * u)}V${n(-0.5 * u)}` + '',
      stroke: T.stroke, 'stroke-width': n(Math.max(0.8, 0.12 * u)), 'stroke-linecap': 'round', fill: 'none',
    }));
    root.appendChild(el('path', { d: cupD(0.36 * u, 0.2 * u, -0.42 * u, -0.92 * u, -0.6 * u), fill: T.stroke, stroke: 'none' }));
    root.appendChild(keyed ? keyPep() : peptideBead(0, -0.74 * u, 0.12 * u, peptide, stage));
    return root;
  }
  root.appendChild(part('stalk', {}, [
    stub(T, sw, -0.05 * u, 0.13 * u, -0.08 * u, 1.6),
    dom(ellipseD(-0.05 * u, -0.26 * u, 0.13 * u, 0.165 * u), T, sw),
  ]));
  root.appendChild(part('b2m', {}, [dom(circleD(0.16 * u, -0.3 * u, 0.095 * u), T, sw, { fill: T.fill2, 'fill-opacity': 0.55 })]));
  root.appendChild(part('groove', {}, [dom(cupD(0.34 * u, 0.2 * u, -0.43 * u, -0.9 * u, -0.6 * u), T, sw)]));
  let drew = false;
  if (o.pockets) {
    const cp = cupPockets(u, o.pockets, peptide === 'none' ? null : o.anchors, PEPTIDE_COLORS[peptide] || resolve(peptide), stage, sw, peptide);
    root.appendChild(cp.g);
    drew = cp.drewPeptide;
  }
  if (!drew) {
    // pockets + anchors that don't fit: the peptide was rejected, so the cup shows none
    const shown = o.pockets && o.anchors ? 'none' : peptide;
    root.appendChild(keyed ? keyPep() : peptideBead(0, -0.735 * u, 0.105 * u, shown, stage));
  }
  return root;
}

/**
 * MHC class II — the "evidence board" of presenter cells: two stalks (α, β) and an
 * open-ended groove whose longer peptide overhangs both ends.
 * Parts: alpha, beta, groove, peptide.
 */
export function mhc2(o = {}) {
  const { u, det, T, sw, root, stage } = setup('mhc2', o, PALETTE.mhc);
  const peptide = o.peptide ?? 'self';
  root.setAttribute('data-peptide', peptide);
  if (det === 'low') {
    root.appendChild(el('path', {
      d: `M${n(-0.09 * u)} ${n(0.08 * u)}V${n(-0.48 * u)}M${n(0.09 * u)} ${n(0.08 * u)}V${n(-0.48 * u)}`,
      stroke: T.stroke, 'stroke-width': n(Math.max(0.7, 0.1 * u)), 'stroke-linecap': 'round', fill: 'none',
    }));
    root.appendChild(el('path', { 'data-part': 'groove', d: cupD(0.38 * u, 0.24 * u, -0.42 * u, -0.84 * u, -0.58 * u), fill: T.stroke }));
    root.appendChild(peptideBead(0, -0.69 * u, 0.08 * u, peptide, stage, { capsule: { len: 0.82 * u } }));
    return root;
  }
  root.appendChild(part('alpha', {}, [stub(T, sw, -0.09 * u, 0.13 * u, -0.08 * u, 1.4), dom(ellipseD(-0.115 * u, -0.26 * u, 0.1 * u, 0.155 * u), T, sw)]));
  root.appendChild(part('beta', {}, [stub(T, sw, 0.09 * u, 0.13 * u, -0.08 * u, 1.4), dom(ellipseD(0.115 * u, -0.26 * u, 0.1 * u, 0.155 * u), T, sw, { fill: T.fill2, 'fill-opacity': 0.55 })]));
  root.appendChild(part('groove', {}, [dom(cupD(0.37 * u, 0.235 * u, -0.43 * u, -0.83 * u, -0.585 * u), T, sw)]));
  root.appendChild(peptideBead(0, -0.69 * u, 0.075 * u, peptide, stage, { capsule: { len: 0.86 * u } }));
  return root;
}

// ---------------------------------------------------------------- TCR / CD3 / BCR

/**
 * T-cell receptor: two chains (α, β), each a constant + variable domain; the variable tips
 * (lighter) are the unique "search query". Default color: CD8 blue (pass color:'cd4' etc.).
 * cd3: true adds the CD3 signalling partners (small domains + intracellular ζ tails).
 * key: clone identity (see keys.js) → draws the notched-tip receptor instead (tcrKey).
 * Parts: alpha, beta, variable, cd3.
 */
export function tcr(o = {}) {
  if (o.key != null) return tcrKey({ ...o, form: 'receptor' });
  const { u, det, T, sw, root, stage } = setup('tcr', o, PALETTE.cd8);
  if (det === 'low') {
    const w = Math.max(0.9, 0.13 * u);
    root.appendChild(el('path', {
      d: `M${n(-0.07 * u)} ${n(0.1 * u)}L${n(-0.08 * u)} ${n(-0.4 * u)}L${n(-0.14 * u)} ${n(-0.72 * u)}M${n(0.07 * u)} ${n(0.1 * u)}L${n(0.08 * u)} ${n(-0.4 * u)}L${n(0.14 * u)} ${n(-0.72 * u)}`,
      stroke: T.stroke, 'stroke-width': n(w), 'stroke-linecap': 'round', 'stroke-linejoin': 'round', fill: 'none',
    }));
    root.appendChild(el('path', {
      'data-part': 'variable',
      d: `M${n(-0.11 * u)} ${n(-0.6 * u)}L${n(-0.15 * u)} ${n(-0.78 * u)}M${n(0.11 * u)} ${n(-0.6 * u)}L${n(0.15 * u)} ${n(-0.78 * u)}`,
      stroke: stage === 'light' ? T.fill : T.light, 'stroke-width': n(w * 1.15), 'stroke-linecap': 'round', fill: 'none',
    }));
  } else {
    for (const [side, s] of [['alpha', -1], ['beta', 1]]) {
      root.appendChild(part(side, {}, [
        stub(T, sw, s * 0.075 * u, 0.13 * u, -0.01 * u, 1.4),
        dom(ellipseD(s * 0.1 * u, -0.2 * u, 0.1 * u, 0.18 * u, s * -4), T, sw),
      ]));
    }
    const v = part('variable');
    for (const s of [-1, 1]) {
      v.appendChild(dom(ellipseD(s * 0.118 * u, -0.545 * u, 0.105 * u, 0.17 * u, s * -7), T, sw, { fill: T.fill2, 'fill-opacity': o.stage === 'light' ? 1 : 0.75 }));
    }
    // CDR loops: a bright arc across the binding face
    v.appendChild(el('path', {
      'data-part': 'cdr',
      d: `M${n(-0.19 * u)} ${n(-0.69 * u)}Q0 ${n(-0.8 * u)} ${n(0.19 * u)} ${n(-0.69 * u)}`,
      stroke: o.stage === 'light' ? T.dark : T.light, 'stroke-width': n(sw * 1.3), fill: 'none', 'stroke-linecap': 'round',
    }));
    root.appendChild(v);
  }
  if (o.cd3) root.appendChild(cd3Parts(u, glyphTones(o.cd3Color || mix(resolve(o.color || PALETTE.cd8), WHITE, 0.35), stage), sw, det));
  return root;
}

function cd3Parts(u, T, sw, det) {
  const g = part('cd3');
  const pairs = [[-0.34, -0.23], [0.23, 0.34]];
  for (const [a, b] of pairs) {
    g.appendChild(dom(ellipseD(a * u, -0.15 * u, 0.065 * u, 0.1 * u), T, sw * 0.8));
    g.appendChild(dom(ellipseD(b * u, -0.17 * u, 0.065 * u, 0.1 * u), T, sw * 0.8));
  }
  // ζζ tails inside the cell with ITAM marks
  const tail = `M${n(-0.03 * u)} ${n(0.02 * u)}V${n(0.48 * u)}M${n(0.03 * u)} ${n(0.02 * u)}V${n(0.48 * u)}`;
  g.appendChild(el('path', { d: tail, stroke: T.stroke, 'stroke-width': n(sw), 'stroke-opacity': 0.7, fill: 'none', 'stroke-linecap': 'round' }));
  if (det === 'high') {
    let dots = '';
    for (const y of [0.17, 0.29, 0.41]) for (const x of [-0.03, 0.03]) dots += circleD(x * u, y * u, 0.022 * u);
    g.appendChild(el('path', { 'data-part': 'itam', d: dots, fill: T.light }));
  }
  return g;
}

/** CD3 complex on its own (εγ, εδ domains + ζζ tails). */
export function cd3(o = {}) {
  const { u, det, T, sw, root } = setup('cd3', o, mix(PALETTE.cd8, WHITE, 0.35));
  root.appendChild(cd3Parts(u, T, sw, det));
  return root;
}

/** B-cell receptor: a membrane-anchored antibody (gold) with a short transmembrane tail. */
export function bcr(o = {}) {
  const g = antibody({ ...o, membrane: true });
  g.setAttribute('class', 'sao-mol sao-bcr');
  g.setAttribute('data-mol', 'bcr');
  return g;
}

// ---------------------------------------------------------------- antibodies

const ORIGIN_SEGMENTS = {
  human: { constant: 'human', variable: 'human', cdr: 'human' },
  mouse: { constant: 'mouse', variable: 'mouse', cdr: 'mouse' },
  chimeric: { constant: 'human', variable: 'mouse', cdr: 'mouse' },
  humanized: { constant: 'human', variable: 'human', cdr: 'mouse' },
};

/**
 * Antibody (IgG "Y"). Anchor: base of the Fc stem (or anchor:'center').
 * variant: 'generic' | 'therapeutic' (white outline = drug) | 'bispecific' | 'adc' | 'bite'
 * origin:  'human' | 'mouse' | 'chimeric' | 'humanized'   (humanization figure; mouse parts
 *          are slate-blue AND hatched in high detail, so it never relies on color alone)
 * targets: [colorA, colorB] for bispecific/BiTE arm tips (default ['cd8','cancer']).
 * dar: number of ADC payloads (default 4); cleaved: true → payloads released.
 * membrane: true → BCR-style transmembrane tail.
 * Parts: fc, hinge, fab-left, fab-right, variable-left, variable-right, cdr, linker, payload.
 */
export function antibody(o = {}) {
  const variant = o.variant || 'generic';
  if (variant === 'bite') return bite(o);
  const { u, det, sw, root, stage } = setup('antibody', o, PALETTE.antibody);
  root.setAttribute('data-variant', variant);
  const dark = stage !== 'light';
  const gold = resolve(o.color || PALETTE.antibody);
  const seg = ORIGIN_SEGMENTS[o.origin || 'human'] || ORIGIN_SEGMENTS.human;
  const colorFor = (kind) => (seg[kind] === 'mouse' ? PALETTE.mouse : gold);
  const Tc = glyphTones(colorFor('constant'), stage);
  const Tv = glyphTones(colorFor('variable'), stage);
  const Tcdr = glyphTones(colorFor('cdr'), stage);
  const targets = (o.targets || ['cd8', 'cancer']).map(resolve);
  const bisp = variant === 'bispecific';
  const TvL = bisp ? glyphTones(targets[0], stage) : Tv;
  const TvR = bisp ? glyphTones(targets[1], stage) : Tv;
  const hingeY = -0.47 * u;
  const ang = (36 * Math.PI) / 180;
  const La = 0.56 * u;
  const arm = (s) => {
    const dx = s * Math.sin(ang), dy = -Math.cos(ang);
    const px = s * Math.cos(ang), py = Math.sin(ang); // outward perpendicular
    const ox = s * 0.035 * u, oy = hingeY - 0.015 * u;
    return { dx, dy, px, py, ox, oy, at: (t, off) => [ox + dx * La * t + px * off, oy + dy * La * t + py * off] };
  };
  const therapeutic = variant === 'therapeutic' || o.highlight;

  // skeleton path (used for low detail and for the therapeutic outline)
  const L = arm(-1), R = arm(1);
  const tipL = L.at(1, 0.03 * u), tipR = R.at(1, 0.03 * u);
  const skel = `M0 ${n(-0.02 * u)}V${n(hingeY)}M${n(L.ox)} ${n(L.oy)}L${n(tipL[0])} ${n(tipL[1])}M${n(R.ox)} ${n(R.oy)}L${n(tipR[0])} ${n(tipR[1])}`;

  if (therapeutic) {
    const ow = det === 'low' ? Math.max(0.17 * u, 1.6) + Math.max(1.6, 0.09 * u) : 0.3 * u;
    root.appendChild(el('path', {
      'data-part': 'highlight', d: skel, stroke: dark ? WHITE : '#FFFFFF', 'stroke-opacity': dark ? 0.9 : 1,
      'stroke-width': n(ow), 'stroke-linecap': 'round', 'stroke-linejoin': 'round', fill: 'none',
    }));
    if (!dark) {
      root.insertBefore(el('path', {
        d: skel, stroke: mix(gold, '#1B1F2A', 0.55), 'stroke-width': n(ow + Math.max(1, 0.05 * u)),
        'stroke-linecap': 'round', 'stroke-linejoin': 'round', fill: 'none', 'stroke-opacity': 0.6,
      }), root.firstChild);
    }
  }

  if (o.membrane) root.appendChild(stub(Tc, sw, 0, 0.16 * u, -0.02 * u, 1.6));

  if (det === 'low') {
    const w = Math.max(0.17 * u, 1.6);
    root.appendChild(el('path', {
      'data-part': 'fc', d: skel, stroke: dark ? mix(Tc.base, WHITE, 0.08) : Tc.stroke,
      'stroke-width': n(w), 'stroke-linecap': 'round', 'stroke-linejoin': 'round', fill: 'none',
    }));
    const vL0 = L.at(0.55, 0.03 * u), vR0 = R.at(0.55, 0.03 * u);
    if (!bisp && seg.variable === seg.constant) {
      root.appendChild(el('path', {
        'data-part': 'variable', d: `M${n(vL0[0])} ${n(vL0[1])}L${n(tipL[0])} ${n(tipL[1])}M${n(vR0[0])} ${n(vR0[1])}L${n(tipR[0])} ${n(tipR[1])}`,
        stroke: dark ? Tv.light : Tv.fill, 'stroke-width': n(w * (dark ? 0.62 : 0.55)), 'stroke-linecap': 'round', fill: 'none',
      }));
    } else {
      root.appendChild(el('path', { 'data-part': 'variable-left', d: `M${n(vL0[0])} ${n(vL0[1])}L${n(tipL[0])} ${n(tipL[1])}`, stroke: dark ? TvL.light : TvL.stroke, 'stroke-width': n(w * 1.05), 'stroke-linecap': 'round' }));
      root.appendChild(el('path', { 'data-part': 'variable-right', d: `M${n(vR0[0])} ${n(vR0[1])}L${n(tipR[0])} ${n(tipR[1])}`, stroke: dark ? TvR.light : TvR.stroke, 'stroke-width': n(w * 1.05), 'stroke-linecap': bisp ? 'square' : 'round' }));
    }
  } else {
    // Fc: two heavy chains, CH2 + CH3 each
    const fc = part('fc');
    const cw = 0.115 * u;
    for (const s of [-1, 1]) {
      fc.appendChild(dom(capsuleD(s * 0.062 * u, -0.05 * u, s * 0.062 * u, -0.19 * u, cw), Tc, sw));
      fc.appendChild(dom(capsuleD(s * 0.062 * u, -0.25 * u, s * 0.062 * u, -0.4 * u, cw), Tc, sw));
    }
    root.appendChild(fc);
    root.appendChild(el('path', {
      'data-part': 'hinge',
      d: `M${n(-0.062 * u)} ${n(-0.44 * u)}L${n(L.ox)} ${n(L.oy)}M${n(0.062 * u)} ${n(-0.44 * u)}L${n(R.ox)} ${n(R.oy)}M${n(-0.04 * u)} ${n(-0.43 * u)}H${n(0.04 * u)}`,
      stroke: Tc.stroke, 'stroke-width': n(sw * 1.2), fill: 'none', 'stroke-linecap': 'round',
    }));
    const hatch = (T, d) => (T === Tc && seg.constant === 'mouse') || (T !== Tc && T.base === PALETTE.mouse)
      ? el('path', { d, fill: 'none', stroke: T.stroke, 'stroke-width': n(sw * 0.7), 'stroke-dasharray': `${n(sw * 0.6)} ${n(sw * 1.8)}`, 'stroke-linecap': 'round', 'stroke-opacity': 0.9 })
      : null;
    for (const [s, A, side, Tvx] of [[-1, L, 'left', TvL], [1, R, 'right', TvR]]) {
      const fab = part(`fab-${side}`);
      const hw = 0.054 * u;
      // heavy chain (inner) and light chain (outer)
      const h0 = A.at(0.06, -0.02 * u), h1 = A.at(0.5, -0.02 * u);
      const l0 = A.at(0.16, 0.088 * u), l1 = A.at(0.5, 0.088 * u);
      fab.appendChild(dom(capsuleD(h0[0], h0[1], h1[0], h1[1], hw * 2), Tc, sw));
      fab.appendChild(dom(capsuleD(l0[0], l0[1], l1[0], l1[1], hw * 2), Tc, sw, { fill: Tc.fill2, 'fill-opacity': dark ? 0.6 : 1 }));
      const v = part(`variable-${side}`);
      const vh0 = A.at(0.6, -0.02 * u), vh1 = A.at(0.97, -0.02 * u);
      const vl0 = A.at(0.6, 0.088 * u), vl1 = A.at(0.97, 0.088 * u);
      const vShape = (a, b) => (bisp && s > 0
        ? roundRectAlong(a, b, hw * 2, hw * 0.35)
        : capsuleD(a[0], a[1], b[0], b[1], hw * 2));
      const vd1 = vShape(vh0, vh1), vd2 = vShape(vl0, vl1);
      v.appendChild(dom(vd1, Tvx, sw, { fill: dark ? Tvx.fill : Tvx.fill2 }));
      v.appendChild(dom(vd2, Tvx, sw, { fill: dark ? Tvx.fill : Tvx.fill2, 'fill-opacity': dark ? 0.75 : 1 }));
      const hv = hatch(Tvx, vd1 + vd2);
      if (hv) v.appendChild(hv);
      fab.appendChild(v);
      const hc = hatch(Tc, '');
      if (hc && seg.constant === 'mouse') {
        hc.setAttribute('d', capsuleD(h0[0], h0[1], h1[0], h1[1], hw * 2) + capsuleD(l0[0], l0[1], l1[0], l1[1], hw * 2));
        fab.appendChild(hc);
      }
      root.appendChild(fab);
    }
    if (seg.constant === 'mouse') {
      const hc = hatch(Tc, fc.querySelectorAll('path')[0].getAttribute('d'));
      let d = '';
      fc.querySelectorAll('path').forEach((p) => (d += p.getAttribute('d')));
      hc.setAttribute('d', d);
      fc.appendChild(hc);
    }
    // CDR loops at the tips (the part that actually touches the target)
    const cdr = part('cdr');
    let dc = '';
    for (const A of [L, R]) {
      const a = A.at(1.02, -0.045 * u), b = A.at(1.02, 0.11 * u), m = A.at(1.12, 0.03 * u);
      dc += `M${n(a[0])} ${n(a[1])}Q${n(m[0])} ${n(m[1])} ${n(b[0])} ${n(b[1])}`;
    }
    const cdrMouse = seg.cdr === 'mouse' && seg.variable !== 'mouse';
    cdr.appendChild(el('path', {
      d: dc, fill: 'none', stroke: cdrMouse ? (dark ? mix(PALETTE.mouse, WHITE, 0.2) : mix(PALETTE.mouse, '#1B1F2A', 0.3)) : (dark ? Tcdr.light : Tcdr.stroke),
      'stroke-width': n(sw * (cdrMouse ? 2.6 : 1.4)), 'stroke-linecap': 'round',
    }));
    root.appendChild(cdr);
  }

  if (variant === 'adc') adcPayloads(root, u, o, stage, sw);
  if (o.anchor === 'center') anchorCenter(root, 0.5 * u);
  return root;
}

function roundRectAlong(a, b, w, r) {
  const cx = (a[0] + b[0]) / 2, cy = (a[1] + b[1]) / 2;
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]) + w;
  const ang = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
  // rotate a rounded rect: build with points
  const c = Math.cos((ang * Math.PI) / 180), s = Math.sin((ang * Math.PI) / 180);
  const hx = len / 2, hy = w / 2;
  const P = (x, y) => [cx + x * c - y * s, cy + x * s + y * c];
  const pts = [P(-hx + r, -hy), P(hx - r, -hy), P(hx, -hy + r), P(hx, hy - r), P(hx - r, hy), P(-hx + r, hy), P(-hx, hy - r), P(-hx, -hy + r)];
  const C = [P(hx, -hy), P(hx, hy), P(-hx, hy), P(-hx, -hy)];
  return `M${n(pts[0][0])} ${n(pts[0][1])}L${n(pts[1][0])} ${n(pts[1][1])}Q${n(C[0][0])} ${n(C[0][1])} ${n(pts[2][0])} ${n(pts[2][1])}L${n(pts[3][0])} ${n(pts[3][1])}Q${n(C[1][0])} ${n(C[1][1])} ${n(pts[4][0])} ${n(pts[4][1])}L${n(pts[5][0])} ${n(pts[5][1])}Q${n(C[2][0])} ${n(C[2][1])} ${n(pts[6][0])} ${n(pts[6][1])}L${n(pts[7][0])} ${n(pts[7][1])}Q${n(C[3][0])} ${n(C[3][1])} ${n(pts[0][0])} ${n(pts[0][1])}Z`;
}

function adcPayloads(root, u, o, stage, sw) {
  const dark = stage !== 'light';
  const count = clamp(o.dar ?? 4, 1, 8);
  const spots = [[-1, -0.33], [1, -0.33], [-1, -0.16], [1, -0.16], [-1, -0.5], [1, -0.5], [-1, -0.04], [1, -0.04]];
  const TL = glyphTones(PALETTE.linker, stage);
  const pc = PALETTE.payload;
  const linker = part('linker');
  const payloads = part('payloads');
  let dl = '';
  for (let i = 0; i < count; i++) {
    const [s, y] = spots[i];
    const x0 = s * 0.12 * u, y0 = y * u;
    const x1 = s * 0.2 * u, y1 = y0 - 0.035 * u, x2 = s * 0.27 * u;
    const free = o.cleaved;
    dl += free ? `M${n(x0)} ${n(y0)}L${n(x1 - s * 0.02 * u)} ${n(y1 + 0.01 * u)}` : `M${n(x0)} ${n(y0)}L${n(x1)} ${n(y1)}L${n(x2)} ${n(y0)}`;
    const px = free ? s * 0.42 * u : s * 0.33 * u, py = free ? y0 - 0.06 * u : y0;
    const pg = el('g', { 'data-part': 'payload', transform: `translate(${n(px)} ${n(py)})` });
    const pr = Math.max(1.2, 0.06 * u);
    if (dark) pg.appendChild(el('circle', { r: n(pr * 2.4), fill: dotGlow(pc, 0.55) }));
    pg.appendChild(el('path', {
      d: polygonD(0, 0, pr, 6, Math.PI / 6),
      fill: dark ? pc : '#FFFFFF', stroke: dark ? mix(pc, '#5AA9D6', 0.5) : '#1B1F2A', 'stroke-width': n(Math.max(0.5, sw * 0.8)),
    }));
    if (u >= 30) pg.appendChild(el('circle', { r: n(pr * 0.35), fill: dark ? '#5AA9D6' : '#1B1F2A' }));
    payloads.appendChild(pg);
  }
  linker.appendChild(el('path', { d: dl, fill: 'none', stroke: dark ? TL.stroke : TL.stroke, 'stroke-width': n(Math.max(0.6, sw * 0.9)), 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
  root.appendChild(linker);
  root.appendChild(payloads);
}

/**
 * BiTE (bispecific T-cell engager, e.g. blinatumomab): two single-chain binders joined
 * by a short flexible linker — no Fc. Anchor: centre; lies horizontally; size = length.
 * targets: [left color, right color] (default T cell blue, cancer violet). The right
 * binder has square-ish domains so the two ends differ by shape too.
 */
export function bite(o = {}) {
  const { u, det, sw, root, stage } = setup('bite', o, PALETTE.antibody, 30);
  root.setAttribute('data-variant', 'bite');
  root.setAttribute('class', 'sao-mol sao-antibody sao-bite');
  const targets = (o.targets || ['cd8', 'cancer']).map(resolve);
  const TA = glyphTones(targets[0], stage), TB = glyphTones(targets[1], stage);
  const TG = glyphTones(o.color || PALETTE.antibody, stage);
  const dark = stage !== 'light';
  const h = 0.12 * u;
  root.appendChild(el('path', {
    'data-part': 'linker',
    d: `M${n(-0.16 * u)} 0C${n(-0.1 * u)} ${n(-0.1 * u)} ${n(-0.05 * u)} ${n(0.1 * u)} 0 0S${n(0.1 * u)} ${n(-0.1 * u)} ${n(0.16 * u)} 0`,
    stroke: TG.stroke, 'stroke-width': n(Math.max(0.7, sw * 1.1)), fill: 'none', 'stroke-linecap': 'round',
  }));
  for (const [s, T, name] of [[-1, TA, 'binder-left'], [1, TB, 'binder-right']]) {
    const g = part(name);
    const x0 = s * 0.18 * u, x1 = s * 0.48 * u;
    const mk = (y) => (s > 0
      ? roundRectAlong([x0, y], [x1, y], h, h * 0.25)
      : capsuleD(x0, y, x1, y, h));
    g.appendChild(dom(mk(-0.065 * u), T, sw, { fill: dark ? T.fill : T.fill2 }));
    g.appendChild(dom(mk(0.065 * u), T, sw, { fill: dark ? T.fill : T.fill2, 'fill-opacity': 0.75 }));
    root.appendChild(g);
  }
  return root;
}

// ---------------------------------------------------------------- costimulation & checkpoints

function dimerHeads(o, name, color, { icon, spread = 0.2, head = [0.12, 0.17], stalkTop = 0.45 } = {}) {
  const { u, det, T, sw, root, stage } = setup(name, o, color);
  if (det === 'low') {
    root.appendChild(el('path', {
      d: `M${n(-0.05 * u)} ${n(0.08 * u)}L${n(-spread * u)} ${n(-stalkTop * u)}M${n(0.05 * u)} ${n(0.08 * u)}L${n(spread * u)} ${n(-stalkTop * u)}`,
      stroke: T.stroke, 'stroke-width': n(Math.max(0.7, 0.09 * u)), 'stroke-linecap': 'round', fill: 'none',
    }));
    root.appendChild(el('path', {
      'data-part': 'heads',
      d: ellipseD(-(spread + 0.03) * u, -(stalkTop + 0.17) * u, head[0] * u, head[1] * u, -15) + ellipseD((spread + 0.03) * u, -(stalkTop + 0.17) * u, head[0] * u, head[1] * u, 15),
      fill: T.stroke,
    }));
  } else {
    for (const s of [-1, 1]) {
      root.appendChild(part(s < 0 ? 'chain-a' : 'chain-b', {}, [
        el('path', { d: `M${n(s * 0.04 * u)} ${n(0.12 * u)}L${n(s * 0.05 * u)} 0L${n(s * spread * u)} ${n(-stalkTop * u)}`, stroke: T.stroke, 'stroke-width': n(sw * 1.5), fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
        dom(ellipseD(s * (spread + 0.03) * u, -(stalkTop + 0.17) * u, head[0] * u, head[1] * u, s * 15), T, sw),
      ]));
    }
  }
  if (icon && u >= 14) root.appendChild(signalIcon({ type: icon, size: Math.max(5, 0.26 * u), stage, y: 0.3 * u }));
  return root;
}

/** CD28 — the costimulatory "accelerator" (signal 2) on T cells. Green-cyan + plus icon. */
export function cd28(o = {}) {
  return dimerHeads(o, 'cd28', PALETTE.activating, { icon: o.icon === false ? null : 'activating' });
}

/** CTLA-4 — brake that out-competes CD28 for B7. Crimson + bar icon; bigger, grippier heads. */
export function ctla4(o = {}) {
  return dimerHeads(o, 'ctla4', PALETTE.inhibitory, { icon: o.icon === false ? null : 'inhibitory', spread: 0.16, head: [0.14, 0.19], stalkTop: 0.42 });
}

/** B7 (CD80/CD86) — costimulatory ligand on presenter cells: stalk + two round domains. */
export function b7(o = {}) {
  const { u, det, T, sw, root } = setup('b7', o, PALETTE.b7);
  if (det === 'low') {
    root.appendChild(el('path', { d: `M0 ${n(0.08 * u)}V${n(-0.4 * u)}`, stroke: T.stroke, 'stroke-width': n(Math.max(0.7, 0.1 * u)), 'stroke-linecap': 'round' }));
    root.appendChild(el('path', { 'data-part': 'head', d: circleD(0, -0.62 * u, 0.2 * u), fill: T.stroke }));
    return root;
  }
  root.appendChild(stub(T, sw, 0, 0.12 * u, -0.05 * u, 1.5));
  root.appendChild(part('igc', {}, [dom(ellipseD(0, -0.24 * u, 0.12 * u, 0.17 * u), T, sw)]));
  root.appendChild(part('head', {}, [dom(circleD(0, -0.66 * u, 0.2 * u), T, sw, { fill: T.fill2, 'fill-opacity': 0.6 })]));
  return root;
}

/** PD-1 — the brake on T cells: stalk + head with a square socket; crimson + bar icon. */
export function pd1(o = {}) {
  const { u, det, T, sw, root, stage } = setup('pd1', o, PALETTE.inhibitory);
  const hw = 0.2 * u, top = -0.88 * u, bot = -0.5 * u, nw = 0.075 * u, nd = 0.12 * u;
  const head = `M${n(-hw)} ${n(top + 0.06 * u)}Q${n(-hw)} ${n(top)} ${n(-hw + 0.06 * u)} ${n(top)}H${n(-nw)}V${n(top + nd)}H${n(nw)}V${n(top)}H${n(hw - 0.06 * u)}Q${n(hw)} ${n(top)} ${n(hw)} ${n(top + 0.06 * u)}V${n(bot - 0.1 * u)}Q${n(hw)} ${n(bot)} 0 ${n(bot)}Q${n(-hw)} ${n(bot)} ${n(-hw)} ${n(bot - 0.1 * u)}Z`;
  if (det === 'low') {
    root.appendChild(el('path', { d: `M0 ${n(0.08 * u)}V${n(bot)}`, stroke: T.stroke, 'stroke-width': n(Math.max(0.7, 0.1 * u)), 'stroke-linecap': 'round' }));
    root.appendChild(el('path', { 'data-part': 'head', d: head, fill: T.stroke }));
  } else {
    root.appendChild(part('stalk', {}, [el('path', { d: `M0 ${n(0.12 * u)}V${n(bot)}`, stroke: T.stroke, 'stroke-width': n(sw * 1.6), 'stroke-linecap': 'round' })]));
    root.appendChild(part('head', {}, [dom(head, T, sw)]));
  }
  if (o.icon !== false && u >= 14) root.appendChild(signalIcon({ type: 'inhibitory', size: Math.max(5, 0.26 * u), stage, y: 0.3 * u }));
  return root;
}

/** PD-L1 — ligand on tumor/presenter cells; square plug fits PD-1's socket. Light crimson. */
export function pdl1(o = {}) {
  const { u, det, T, sw, root } = setup('pdl1', o, mix(PALETTE.inhibitory, WHITE, 0.32));
  const hw = 0.19 * u, top = -0.84 * u, bot = -0.5 * u, pw = 0.065 * u, ph = 0.11 * u;
  const head = `M${n(-hw)} ${n(top + 0.06 * u)}Q${n(-hw)} ${n(top)} ${n(-hw + 0.06 * u)} ${n(top)}H${n(-pw)}V${n(top - ph)}H${n(pw)}V${n(top)}H${n(hw - 0.06 * u)}Q${n(hw)} ${n(top)} ${n(hw)} ${n(top + 0.06 * u)}V${n(bot - 0.06 * u)}Q${n(hw)} ${n(bot)} ${n(hw - 0.06 * u)} ${n(bot)}H${n(-hw + 0.06 * u)}Q${n(-hw)} ${n(bot)} ${n(-hw)} ${n(bot - 0.06 * u)}Z`;
  if (det === 'low') {
    root.appendChild(el('path', { d: `M0 ${n(0.08 * u)}V${n(bot)}`, stroke: T.stroke, 'stroke-width': n(Math.max(0.7, 0.1 * u)), 'stroke-linecap': 'round' }));
    root.appendChild(el('path', { 'data-part': 'head', d: head, fill: T.stroke }));
    return root;
  }
  root.appendChild(stub(T, sw, 0, 0.12 * u, -0.05 * u, 1.5));
  root.appendChild(part('igc', {}, [dom(ellipseD(0, -0.25 * u, 0.11 * u, 0.16 * u), T, sw)]));
  root.appendChild(part('head', {}, [dom(head, T, sw)]));
  return root;
}

// ---------------------------------------------------------------- CAR

const COSTIM = {
  cd28: { color: PALETTE.activating, shape: 'square', label: 'CD28' },
  '4-1bb': { color: mix(PALETTE.activating, '#4FD1C5', 0.5), shape: 'hex', label: '4-1BB' },
  ox40: { color: mix(PALETTE.activating, '#B5D94A', 0.4), shape: 'diamond', label: 'OX40' },
};

/**
 * Chimeric antigen receptor, modular. Anchor (0,0) = outer membrane surface.
 * Top → bottom: binder (scFv, gold — it comes from an antibody), hinge, transmembrane,
 * costim domain(s), CD3ζ (T-cell blue with 3 ITAM marks).
 * generation: 1 (no costim) | 2 (one; default) | 3 (two).  costim: ['cd28'] | ['4-1bb'] | …
 * parts: subset to draw, e.g. ['binder','hinge'] for an assembly figure.
 * membrane: true draws a short lipid-bilayer band for standalone display.
 * Parts: binder, hinge, transmembrane, costim-1, costim-2, cd3z, membrane.
 */
export function car(o = {}) {
  const size = o.size ?? 56;
  const { u, sw, root, stage } = setup('car', { ...o, size, detail: 'high' }, PALETTE.antibody);
  const dark = stage !== 'light';
  const gen = o.generation ?? (o.costim ? o.costim.length + 1 : 2);
  const costim = o.costim || (gen >= 3 ? ['cd28', '4-1bb'] : gen === 2 ? ['cd28'] : []);
  const want = new Set(o.parts || ['binder', 'hinge', 'transmembrane', 'costim-1', 'costim-2', 'cd3z', ...(o.membrane ? ['membrane'] : [])]);
  const m = 0.16 * u; // membrane thickness
  if (want.has('membrane') || o.membrane) {
    const Tm = glyphTones(o.membraneColor || PALETTE.cd8, stage);
    const mem = part('membrane');
    const w = 0.7 * u;
    mem.appendChild(el('rect', { x: n(-w), y: 0, width: n(2 * w), height: n(m), fill: dark ? mix(Tm.base, '#0B1024', 0.7) : mix(Tm.base, WHITE, 0.82), 'fill-opacity': 0.9 }));
    mem.appendChild(el('path', { d: `M${n(-w)} 0H${n(w)}M${n(-w)} ${n(m)}H${n(w)}`, stroke: dark ? mix(Tm.base, WHITE, 0.35) : mix(Tm.base, '#1B1F2A', 0.4), 'stroke-width': n(sw) }));
    root.appendChild(mem);
  }
  if (want.has('binder')) {
    // scFv = the two variable domains of an antibody tip (VH + VL), joined by a short linker
    const T = glyphTones(o.binderColor || PALETTE.antibody, stage);
    root.appendChild(part('binder', {}, [
      dom(capsuleD(-0.055 * u, -0.66 * u, -0.075 * u, -0.95 * u, 0.12 * u), T, sw),
      dom(capsuleD(0.065 * u, -0.69 * u, 0.085 * u, -0.96 * u, 0.12 * u), T, sw, { fill: T.fill2, 'fill-opacity': dark ? 0.7 : 1 }),
      el('path', { d: `M${n(-0.05 * u)} ${n(-0.64 * u)}Q0 ${n(-0.58 * u)} ${n(0.06 * u)} ${n(-0.66 * u)}`, stroke: T.stroke, 'stroke-width': n(sw), fill: 'none' }),
      el('path', { 'data-part': 'cdr', d: `M${n(-0.15 * u)} ${n(-1.0 * u)}Q0 ${n(-1.08 * u)} ${n(0.16 * u)} ${n(-1.01 * u)}`, stroke: dark ? T.light : T.dark, 'stroke-width': n(sw * 1.3), fill: 'none', 'stroke-linecap': 'round' }),
    ]));
  }
  if (want.has('hinge')) {
    const T = glyphTones(PALETTE.linker, stage);
    root.appendChild(part('hinge', {}, [dom(capsuleD(0, -0.64 * u, 0, -0.03 * u, 0.07 * u), T, sw)]));
  }
  if (want.has('transmembrane')) {
    const T = glyphTones('#9AA3B5', stage);
    root.appendChild(part('transmembrane', {}, [dom(roundRectD(0, m / 2, 0.11 * u, m + 0.06 * u, 0.03 * u), T, sw)]));
  }
  let y = m + 0.05 * u;
  costim.slice(0, 2).forEach((name, i) => {
    const key = `costim-${i + 1}`;
    const spec = COSTIM[name] || COSTIM.cd28;
    const h = 0.2 * u;
    if (want.has(key)) {
      const T = glyphTones(spec.color, stage);
      const cy = y + h / 2;
      const d = spec.shape === 'hex' ? polygonD(0, cy, h * 0.62, 6, 0)
        : spec.shape === 'diamond' ? polygonD(0, cy, h * 0.65, 4, 0)
        : roundRectD(0, cy, h * 1.15, h, h * 0.22);
      const g = part(key, { 'data-costim': name }, [dom(d, T, sw)]);
      // plus mark: costimulation is activating
      const k = h * 0.2;
      g.appendChild(el('path', { d: `M${n(-k)} ${n(cy)}H${n(k)}M0 ${n(cy - k)}V${n(cy + k)}`, stroke: dark ? T.light : T.stroke, 'stroke-width': n(sw * 1.2), 'stroke-linecap': 'round' }));
      root.appendChild(g);
    }
    y += h + 0.05 * u;
  });
  if (want.has('cd3z')) {
    const T = glyphTones(o.cd3zColor || PALETTE.cd8, stage);
    const h = 0.48 * u;
    const g = part('cd3z', {}, [dom(capsuleD(0, y + 0.04 * u, 0, y + h, 0.15 * u), T, sw)]);
    let d = '';
    for (let i = 0; i < 3; i++) {
      const yy = y + 0.13 * u + i * 0.13 * u;
      d += `M${n(-0.035 * u)} ${n(yy)}H${n(0.035 * u)}`;
    }
    g.appendChild(el('path', { 'data-part': 'itam', d, stroke: dark ? T.light : T.stroke, 'stroke-width': n(sw * 1.6), 'stroke-linecap': 'round' }));
    root.appendChild(g);
  }
  root.setAttribute('data-generation', String(gen));
  return root;
}

// ---------------------------------------------------------------- killing machinery

/**
 * Perforin pore. view:'top' → ring of subunits around a hole (size = diameter);
 * view:'side' → two pillars spanning a membrane with a gap (size = height).
 */
export function perforin(o = {}) {
  const { u, T, sw, root } = setup('perforin', o, o.color || mix(PALETTE.cd8, WHITE, 0.3));
  const view = o.view || 'top';
  root.setAttribute('data-view', view);
  if (view === 'side') {
    for (const s of [-1, 1]) {
      root.appendChild(part(s < 0 ? 'pillar-left' : 'pillar-right', {}, [
        dom(roundRectD(s * 0.2 * u, -0.25 * u, 0.16 * u, 0.48 * u, 0.06 * u), T, sw),
        dom(roundRectD(s * 0.2 * u, 0.25 * u, 0.16 * u, 0.48 * u, 0.06 * u), T, sw, { fill: T.fill2, 'fill-opacity': 0.6 }),
      ]));
    }
    return root;
  }
  const k = o.subunits || 16;
  const R0 = 0.5 * u, hole = 0.27 * u;
  let d = '';
  for (let i = 0; i < k; i++) {
    const a = (i / k) * TAU;
    const c = Math.cos(a), s = Math.sin(a);
    d += capsuleD(c * (hole + 0.03 * u), s * (hole + 0.03 * u), c * (R0 - 0.04 * u), s * (R0 - 0.04 * u), Math.max(1, ((TAU * hole) / k) * 0.9));
  }
  root.appendChild(part('ring', {}, [dom(d, T, sw * 0.8)]));
  root.appendChild(el('circle', { 'data-part': 'hole', r: n(hole * 0.92), fill: o.stage === 'light' ? '#FFFFFF' : '#0B1024', 'fill-opacity': 0.55 }));
  return root;
}

/** Granzyme — a small two-lobed protease bead with an active-site cleft. Anchor: centre. */
export function granzyme(o = {}) {
  const { u, T, sw, root } = setup('granzyme', { size: 6, ...o }, o.color || mix(PALETTE.cd8, WHITE, 0.45));
  const r = u / 2;
  const rot = o.rotation ?? -25;
  if (o.stage !== 'light') root.appendChild(el('circle', { r: n(r * 2.1), fill: dotGlow(T.base, 0.4) }));
  const g = el('g', { transform: `rotate(${n(rot)})` });
  // union of two lobes (stroke underneath, fill on top hides the inner seam)
  const d = circleD(-r * 0.36, 0, r * 0.68) + circleD(r * 0.38, 0, r * 0.6);
  const w = Math.max(0.4, sw * 0.8);
  g.appendChild(el('path', { d, fill: 'none', stroke: T.stroke, 'stroke-width': n(w * 2) }));
  g.appendChild(el('path', { d, fill: T.fill2, 'fill-opacity': 1 }));
  g.appendChild(el('path', { 'data-part': 'cleft', d: `M${n(0.02 * r)} ${n(-0.62 * r)}Q${n(-0.12 * r)} 0 ${n(0.02 * r)} ${n(0.62 * r)}`, fill: 'none', stroke: T.stroke, 'stroke-width': n(w), 'stroke-linecap': 'round', 'stroke-opacity': 0.8 }));
  root.appendChild(g);
  return root;
}

/** Cytokine — a small glowing dot in the color of the cell that sent it. Anchor: centre. */
export function cytokine(o = {}) {
  const size = o.size ?? 4;
  const stage = o.stage === 'light' ? 'light' : 'dark';
  const c = resolve(o.color || PALETTE.cd4);
  const root = el('g', { class: 'sao-mol sao-cytokine', 'data-mol': 'cytokine' });
  const r = size / 2;
  if (stage === 'dark') {
    root.appendChild(el('circle', { r: n(r * 2.8), fill: dotGlow(c, 0.5), 'data-part': 'glow' }));
    root.appendChild(el('circle', { r: n(r), fill: mix(c, WHITE, 0.45), 'data-part': 'core' }));
  } else {
    root.appendChild(el('circle', { r: n(r), fill: c, stroke: mix(c, '#1B1F2A', 0.45), 'stroke-width': n(Math.max(0.4, r * 0.25)), 'data-part': 'core' }));
  }
  return root;
}

/**
 * Interferon — a HOLLOW RING in the sender's color (cytokines are solid dots; interferons
 * are rings, so the two never rely on color alone). Anchor: centre. Default size 6.
 */
export function interferon(o = {}) {
  const size = o.size ?? 6;
  const stage = o.stage === 'light' ? 'light' : 'dark';
  const c = resolve(o.color || PALETTE.cd8);
  const root = el('g', { class: 'sao-mol sao-interferon', 'data-mol': 'interferon' });
  const r = size / 2;
  const w = Math.max(0.6, size * 0.2);
  if (stage === 'dark') {
    root.appendChild(el('circle', { r: n(r * 2.4), fill: dotGlow(c, 0.38), 'data-part': 'glow' }));
    root.appendChild(el('circle', { 'data-part': 'ring', r: n(r - w / 2), fill: 'none', stroke: mix(c, WHITE, 0.4), 'stroke-width': n(w) }));
  } else {
    root.appendChild(el('circle', { 'data-part': 'ring', r: n(r - w / 2), fill: 'none', stroke: mix(c, '#1B1F2A', 0.2), 'stroke-width': n(w) }));
  }
  return root;
}

/**
 * Danger signal (DAMP / alarm released by dying or burst cells): a pale-gold four-point
 * star with concave sides. Anchor: centre. Default size 8. Never use it for drug payloads.
 */
export function dangerSpark(o = {}) {
  const size = o.size ?? 8;
  const stage = o.stage === 'light' ? 'light' : 'dark';
  const c = resolve(o.color || PALETTE.danger);
  const root = el('g', { class: 'sao-mol sao-danger', 'data-mol': 'danger' });
  const R = size / 2, k = R * 0.2;
  const rot = ((o.rotation ?? 0) * Math.PI) / 180;
  let d = '';
  for (let i = 0; i < 4; i++) {
    const a = rot + (i * Math.PI) / 2 - Math.PI / 2;
    const b = a + Math.PI / 2;
    const p = [Math.cos(a) * R, Math.sin(a) * R];
    const q = [Math.cos(b) * R, Math.sin(b) * R];
    d += (i ? 'L' : 'M') + n(p[0]) + ' ' + n(p[1]);
    d += `Q${n(Math.cos(a + Math.PI / 4) * k)} ${n(Math.sin(a + Math.PI / 4) * k)} ${n(q[0])} ${n(q[1])}`;
  }
  d += 'Z';
  if (stage === 'dark') {
    root.appendChild(el('circle', { r: n(R * 1.6), fill: dotGlow(c, 0.45), 'data-part': 'glow' }));
    root.appendChild(el('path', { 'data-part': 'star', d, fill: mix(c, WHITE, 0.25) }));
  } else {
    root.appendChild(el('path', { 'data-part': 'star', d, fill: c, stroke: mix(c, '#7A5A10', 0.55), 'stroke-width': n(Math.max(0.5, size * 0.07)), 'stroke-linejoin': 'round' }));
  }
  return root;
}

/** A loose cloud around (0,0) of cytokines (solid dots), interferons (rings) or danger sparks: kind:'cytokine'|'interferon'|'danger'. */
export function cytokineCloud(o = {}) {
  const { count = 10, radius = 30, seed = 1, size = 4, color, stage, inner = 0, kind = 'cytokine' } = o;
  const make = kind === 'interferon' ? interferon : kind === 'danger' ? dangerSpark : cytokine;
  const R = rng(seed, 'cyto');
  const g = el('g', { class: 'sao-mol sao-cytokines', 'data-part': 'cytokines' });
  for (let i = 0; i < count; i++) {
    const a = R.range(0, TAU), rr = inner + Math.sqrt(R()) * (radius - inner);
    const c = make({ size: size * R.range(0.75, 1.15), color, stage, rotation: R.range(-20, 20) });
    c.setAttribute('transform', `translate(${n(Math.cos(a) * rr)} ${n(Math.sin(a) * rr)})`);
    g.appendChild(c);
  }
  return g;
}

// ---------------------------------------------------------------- shape-fit teaching glyphs

const PROFILES = {
  notch: (x) => (Math.abs(x) < 0.55 ? 1 : Math.abs(x) < 0.75 ? 1 - (Math.abs(x) - 0.55) / 0.2 : 0),
  round: (x) => Math.sqrt(Math.max(0, 1 - x * x)),
  triangle: (x) => 1 - Math.abs(x),
  wave: (x) => 0.55 + 0.45 * Math.cos(Math.PI * x * 1.5),
  step: (x) => (x < -0.1 ? 1 : x < 0.1 ? 1 - (x + 0.1) * 3 : 0.4),
};
const MISFIT = { notch: 'round', round: 'triangle', triangle: 'notch', wave: 'step', step: 'wave' };

function profilePoints(profile, fit, x0, x1, yTop, depth, invert, samples = 18) {
  const f = PROFILES[profile] || PROFILES.notch;
  const g = PROFILES[MISFIT[profile] || 'round'];
  const pts = [];
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const x = lerp(-1, 1, t);
    const v = f(x) * fit + g(x * 0.9) * (1 - fit) * 0.85;
    pts.push([lerp(x0, x1, t), yTop + (invert ? -1 : 1) * v * depth]);
  }
  return pts;
}

/**
 * Generic receptor for "shape fit" teaching: stalk + head with a socket.
 * profile: 'notch' | 'round' | 'triangle' | 'wave' | 'step'. The docking point is
 * (0, dockY) where dockY = -0.95*size (also stored as data-dock-y).
 */
export function receptor(o = {}) {
  const { u, T, sw, root } = setup('receptor', { ...o, detail: 'high' }, o.color || PALETTE.cd4);
  const profile = o.profile || 'notch';
  const top = -0.95 * u, w = 0.42 * u, sw2 = 0.24 * u, depth = 0.16 * u, bot = -0.55 * u;
  const sock = profilePoints(profile, 1, -sw2, sw2, top, depth, false);
  let d = `M${n(-w)} ${n(top + 0.05 * u)}Q${n(-w)} ${n(top)} ${n(-w + 0.05 * u)} ${n(top)}L${n(-sw2)} ${n(top)}`;
  for (const p of sock) d += `L${n(p[0])} ${n(p[1])}`;
  d += `L${n(w - 0.05 * u)} ${n(top)}Q${n(w)} ${n(top)} ${n(w)} ${n(top + 0.05 * u)}V${n(bot - 0.08 * u)}Q${n(w)} ${n(bot)} ${n(w - 0.1 * u)} ${n(bot)}H${n(-w + 0.1 * u)}Q${n(-w)} ${n(bot)} ${n(-w)} ${n(bot - 0.08 * u)}Z`;
  root.appendChild(part('stalk', {}, [el('path', { d: `M0 ${n(0.12 * u)}V${n(bot)}`, stroke: T.stroke, 'stroke-width': n(sw * 2.2), 'stroke-linecap': 'round' })]));
  root.appendChild(part('head', {}, [dom(d, T, sw)]));
  root.setAttribute('data-dock-y', n(top));
  root.setAttribute('data-profile', profile);
  return root;
}

/**
 * Ligand matching receptor(): anchor (0,0) is its contact line, body above (−y), plug below.
 * fit 0..1: 1 = perfect complement (snug), 0 = wrong shape. Place it at the receptor's
 * (0, dockY) to dock.  Parts: plug, body.
 */
export function ligand(o = {}) {
  const { u, T, sw, root } = setup('ligand', { ...o, detail: 'high' }, o.color || PALETTE.ligand);
  const profile = o.profile || 'notch';
  const fit = clamp(o.fit ?? 1, 0, 1);
  const sw2 = 0.24 * u, depth = 0.16 * u, w = 0.3 * u, h = 0.34 * u;
  // plug profile hangs below the contact line: points at y = +v*depth (inverted: into socket)
  const plug = profilePoints(profile, fit, -sw2 * 0.96, sw2 * 0.96, 0, depth * 0.97, false);
  let d = `M${n(-w)} ${n(-0.02 * u)}`;
  d += `L${n(-sw2)} 0`;
  for (const p of plug) d += `L${n(p[0])} ${n(p[1])}`;
  d += `L${n(sw2)} 0L${n(w)} ${n(-0.02 * u)}`;
  d += `V${n(-h + 0.1 * u)}Q${n(w)} ${n(-h)} ${n(w - 0.1 * u)} ${n(-h)}H${n(-w + 0.1 * u)}Q${n(-w)} ${n(-h)} ${n(-w)} ${n(-h + 0.1 * u)}Z`;
  root.appendChild(part('body', {}, [dom(d, T, sw, { fill: T.fill2, 'fill-opacity': o.stage === 'light' ? 1 : 0.7 })]));
  root.setAttribute('data-fit', String(fit));
  return root;
}

// ---------------------------------------------------------------- generic surface proteins

const HEAD_SHAPES = {
  circle: (r) => circleD(0, 0, r),
  diamond: (r) => polygonD(0, 0, r * 1.15, 4, -Math.PI / 2),
  triangle: (r) => polygonD(0, r * 0.2, r * 1.2, 3, -Math.PI / 2),
  square: (r) => roundRectD(0, 0, r * 1.75, r * 1.75, r * 0.25),
  hex: (r) => polygonD(0, 0, r * 1.05, 6, 0),
  star: (r) => {
    let d = '';
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (i / 10) * TAU, rr = i % 2 ? r * 0.55 : r * 1.2;
      d += (i ? 'L' : 'M') + n(Math.cos(a) * rr) + ' ' + n(Math.sin(a) * rr);
    }
    return d + 'Z';
  },
};

/**
 * Generic surface antigen (CD19, HER2, BCMA… in CAR / antibody figures).
 * shape: 'circle' | 'diamond' | 'triangle' | 'square' | 'hex' | 'star' — use shape, not
 * only color, to tell antigens apart.  Parts: stalk, head.
 */
export function antigen(o = {}) {
  const { u, det, T, sw, root } = setup('antigen', o, o.color || PALETTE.antigen);
  const shape = o.shape || 'circle';
  root.setAttribute('data-shape', shape);
  const r = 0.22 * u;
  root.appendChild(el('path', { 'data-part': 'stalk', d: `M0 ${n(0.1 * u)}V${n(-0.55 * u)}`, stroke: T.stroke, 'stroke-width': n(det === 'low' ? Math.max(0.7, 0.1 * u) : sw * 1.6), 'stroke-linecap': 'round' }));
  const head = el('path', { d: (HEAD_SHAPES[shape] || HEAD_SHAPES.circle)(r), transform: `translate(0 ${n(-0.74 * u)})` });
  if (det === 'low') head.setAttribute('fill', T.stroke);
  else { head.setAttribute('fill', T.fill); head.setAttribute('stroke', T.stroke); head.setAttribute('stroke-width', n(sw)); head.setAttribute('stroke-linejoin', 'round'); }
  root.appendChild(part('head', {}, [head]));
  return root;
}

/** CD25 (IL-2 receptor α) — small dot-on-stalk; dense on regulatory T cells. */
export function cd25(o = {}) {
  const { u, T, sw, root } = setup('cd25', o, o.color || mix(PALETTE.treg, WHITE, 0.35));
  root.appendChild(el('path', { d: `M0 ${n(0.05 * u)}V${n(-0.6 * u)}`, stroke: T.stroke, 'stroke-width': n(Math.max(0.6, sw * 1.3)), 'stroke-linecap': 'round' }));
  root.appendChild(el('path', { 'data-part': 'head', d: circleD(0, -0.78 * u, 0.2 * u), fill: T.stroke }));
  return root;
}

/** Toll-like receptor — horseshoe-shaped danger sensor. */
export function tlr(o = {}) {
  const { u, T, sw, root } = setup('tlr', o, o.color || '#7FD4C1');
  const r = 0.3 * u, cy = -0.62 * u, w = 0.13 * u;
  // horseshoe open to the right; the stalk joins at the bottom
  const a0 = Math.PI * 0.2, a1 = Math.PI * 1.8;
  const P = (a, rr) => [Math.cos(a) * rr, cy + Math.sin(a) * rr];
  const o0 = P(a0, r + w / 2), o1 = P(a1, r + w / 2), i1 = P(a1, r - w / 2), i0 = P(a0, r - w / 2);
  const d = `M${n(o0[0])} ${n(o0[1])}A${n(r + w / 2)} ${n(r + w / 2)} 0 1 1 ${n(o1[0])} ${n(o1[1])}A${n(w / 2)} ${n(w / 2)} 0 0 1 ${n(i1[0])} ${n(i1[1])}A${n(r - w / 2)} ${n(r - w / 2)} 0 1 0 ${n(i0[0])} ${n(i0[1])}A${n(w / 2)} ${n(w / 2)} 0 0 1 ${n(o0[0])} ${n(o0[1])}Z`;
  root.appendChild(el('path', { 'data-part': 'stalk', d: `M0 ${n(0.25 * u)}V${n(cy + r - w * 0.2)}`, stroke: T.stroke, 'stroke-width': n(sw * 1.6), 'stroke-linecap': 'round' }));
  // leucine-rich repeats: ribs across the solenoid make it read as a coiled protein, not a letter
  let ribs = '';
  const k = 11;
  for (let i = 1; i < k; i++) {
    const a = a0 + ((a1 - a0) * i) / k;
    const p1 = P(a, r - w * 0.38), p2 = P(a, r + w * 0.38);
    ribs += `M${n(p1[0])} ${n(p1[1])}L${n(p2[0])} ${n(p2[1])}`;
  }
  root.appendChild(part('horseshoe', {}, [
    dom(d, T, sw),
    el('path', { d: ribs, stroke: T.stroke, 'stroke-width': n(sw * 0.7), 'stroke-opacity': 0.55, 'stroke-linecap': 'round' }),
  ]));
  root.appendChild(dom(ellipseD(0, 0.3 * u, 0.1 * u, 0.07 * u), T, sw * 0.8, { 'data-part': 'tir' }));
  return root;
}

/** NK activating receptor (NKG2D-like): green-cyan dimer with a plus icon. */
export function nkActivating(o = {}) {
  return dimerHeads(o, 'nk-activating', PALETTE.activating, { icon: o.icon === false ? null : 'activating', spread: 0.12, head: [0.12, 0.12], stalkTop: 0.5 });
}

/** NK inhibitory receptor (KIR-like, reads MHC-I): crimson, two stacked domains + bar icon. */
export function nkInhibitory(o = {}) {
  const { u, det, T, sw, root, stage } = setup('nk-inhibitory', o, PALETTE.inhibitory);
  if (det === 'low') {
    root.appendChild(el('path', { d: `M0 ${n(0.08 * u)}V${n(-0.3 * u)}`, stroke: T.stroke, 'stroke-width': n(Math.max(0.7, 0.1 * u)), 'stroke-linecap': 'round' }));
    root.appendChild(el('path', { d: ellipseD(-0.04 * u, -0.45 * u, 0.12 * u, 0.16 * u, -20) + ellipseD(0.06 * u, -0.76 * u, 0.12 * u, 0.16 * u, 20), fill: T.stroke }));
  } else {
    root.appendChild(stub(T, sw, 0, 0.12 * u, -0.25 * u, 1.5));
    root.appendChild(dom(ellipseD(-0.04 * u, -0.43 * u, 0.12 * u, 0.17 * u, -20), T, sw));
    root.appendChild(dom(ellipseD(0.07 * u, -0.76 * u, 0.12 * u, 0.17 * u, 20), T, sw));
  }
  if (o.icon !== false && u >= 14) root.appendChild(signalIcon({ type: 'inhibitory', size: Math.max(5, 0.26 * u), stage, y: 0.3 * u }));
  return root;
}

/** Stress ligand (MICA/B-like) displayed by stressed / transformed cells — NK "eat me" flag. */
export function stressLigand(o = {}) {
  const { u, det, T, sw, root } = setup('stress-ligand', o, o.color || mix(PALETTE.activating, '#FFE36E', 0.45));
  root.appendChild(el('path', { d: `M0 ${n(0.1 * u)}V${n(-0.42 * u)}`, stroke: T.stroke, 'stroke-width': n(det === 'low' ? Math.max(0.7, 0.1 * u) : sw * 1.6), 'stroke-linecap': 'round' }));
  const d = circleD(-0.12 * u, -0.62 * u, 0.15 * u) + circleD(0.12 * u, -0.62 * u, 0.15 * u) + circleD(0, -0.84 * u, 0.12 * u);
  root.appendChild(el('path', { 'data-part': 'head', d, fill: det === 'low' ? T.stroke : T.fill, stroke: det === 'low' ? 'none' : T.stroke, 'stroke-width': n(sw) }));
  return root;
}

/** Fas ligand / Fas pair glyphs (trimers) for the second killing route. */
export function fasL(o = {}) {
  const { u, T, sw, root } = setup('fasl', o, o.color || mix(PALETTE.cd8, WHITE, 0.2));
  root.appendChild(el('path', { d: `M0 ${n(0.1 * u)}V${n(-0.45 * u)}`, stroke: T.stroke, 'stroke-width': n(sw * 1.5), 'stroke-linecap': 'round' }));
  root.appendChild(el('path', { 'data-part': 'head', d: polygonD(0, -0.68 * u, 0.24 * u, 3, -Math.PI / 2), fill: T.fill, stroke: T.stroke, 'stroke-width': n(sw), 'stroke-linejoin': 'round' }));
  return root;
}
export function fas(o = {}) {
  const { u, T, sw, root } = setup('fas', o, o.color || '#C9B6DA');
  root.appendChild(el('path', { d: `M0 ${n(0.12 * u)}V${n(-0.5 * u)}`, stroke: T.stroke, 'stroke-width': n(sw * 1.5), 'stroke-linecap': 'round' }));
  const cy = -0.7 * u, r = 0.22 * u;
  root.appendChild(el('path', { 'data-part': 'head', d: `M${n(-r)} ${n(cy - r)}L${n(-r * 0.3)} ${n(cy + r * 0.2)}H${n(r * 0.3)}L${n(r)} ${n(cy - r)}`, fill: 'none', stroke: T.stroke, 'stroke-width': n(sw * 2.4), 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
  return root;
}

// ---------------------------------------------------------------- peptides, DNA, RNA, proteasome

/**
 * Peptide / protein chain as beads. Anchor: centre.
 * length, beadR, fold 0..1 (0 = straight line, 1 = compact folded blob), seed,
 * colors: [hex per bead] or color, highlight: [indices] (hot pink "typo" beads).
 * Parts: backbone, bead (each). Use peptidePositions() to animate folding yourself.
 */
export function peptideChain(o = {}) {
  const { length = 9, beadR = 4, fold = 0, seed = 1, stage = 'dark', highlight = [], color = PALETTE.selfPeptide } = o;
  const dark = stage !== 'light';
  const root = el('g', { class: 'sao-mol sao-peptide-chain', 'data-mol': 'peptide-chain' });
  const pos = peptidePositions({ length, beadR, fold, seed });
  root.appendChild(el('path', {
    'data-part': 'backbone', d: smoothPath(pos, { closed: false, smooth: 0.3 }), fill: 'none',
    stroke: dark ? mix(resolve(color), WHITE, 0.3) : mix(resolve(color), '#1B1F2A', 0.5), 'stroke-width': n(Math.max(0.6, beadR * 0.35)), 'stroke-opacity': 0.7, 'stroke-linecap': 'round',
  }));
  const R = rng(seed, 'beads');
  const order = pos.map((p, i) => i).sort((a, b) => (highlight.includes(a) ? 1 : 0) - (highlight.includes(b) ? 1 : 0));
  const tints = pos.map(() => [R.chance(0.5), R.range(0, 0.18)]);
  order.forEach((i) => {
    const p = pos[i];
    const hi = highlight.includes(i);
    let c = o.colors && o.colors[i] ? resolve(o.colors[i]) : resolve(color);
    if (!o.colors && !hi) c = mix(c, tints[i][0] ? WHITE : '#7A5A3A', tints[i][1]);
    const b = peptideBead(0, 0, beadR, hi ? 'neo' : c, stage);
    b.setAttribute('data-part', 'bead');
    b.setAttribute('data-index', String(i));
    b.setAttribute('transform', `translate(${n(p[0])} ${n(p[1])})`);
    if (!hi) {
      const path = b.querySelector('path');
      if (path) path.setAttribute('fill', dark ? mix(c, '#0B1024', 0.1) : c);
    }
    root.appendChild(b);
  });
  return root;
}

/** Bead positions for peptideChain at a given fold (0..1). */
export function peptidePositions({ length = 9, beadR = 4, fold = 0, seed = 1 } = {}) {
  const sp = beadR * 2.15;
  const folded = foldedPositions(length, sp, seed);
  const R = rng(seed, 'wiggle');
  return Array.from({ length }, (_, i) => {
    const sx = (i - (length - 1) / 2) * sp;
    const sy = Math.sin(i * 0.9 + R.range(0, 0.4)) * beadR * 0.25;
    const f = clamp(fold, 0, 1);
    const e = f * f * (3 - 2 * f);
    return [lerp(sx, folded[i][0], e), lerp(sy, folded[i][1], e)];
  });
}

/**
 * DNA double helix, horizontal, centred. sequence: 'ATGC…' (top strand), rise: px per base
 * pair, width: helix diameter, letters: show base letters, highlight: [indices] (mutation).
 * Parts: backbone-a, backbone-b, pairs, pair (each, data-index), letters.
 */
export function dna(o = {}) {
  const { sequence = 'ATGGCTAGCAAGTTC', rise = 9, width = 22, stage = 'dark', letters = false, highlight = [], twist = 10.5 } = o;
  const dark = stage !== 'light';
  const S = stageOf(stage);
  const comp = { A: 'T', T: 'A', G: 'C', C: 'G' };
  const N = sequence.length;
  const root = el('g', { class: 'sao-mol sao-dna', 'data-mol': 'dna' });
  const x0 = (-(N - 1) / 2) * rise;
  const phaseB = Math.PI * 0.72;
  const ya = (x) => (width / 2) * Math.sin(((x - x0) / rise) * (TAU / twist));
  const yb = (x) => (width / 2) * Math.sin(((x - x0) / rise) * (TAU / twist) + phaseB);
  const ptsA = [], ptsB = [];
  const ext = rise * 0.6;
  for (let x = x0 - ext; x <= x0 + (N - 1) * rise + ext + 0.01; x += rise / 3) { ptsA.push([x, ya(x)]); ptsB.push([x, yb(x)]); }
  const bbColor = dark ? '#C9D3F0' : S.ink2;
  const pairs = part('pairs');
  const lettersG = letters ? part('letters') : null;
  for (let i = 0; i < N; i++) {
    const x = x0 + i * rise;
    const b1 = sequence[i].toUpperCase(), b2 = comp[b1] || 'N';
    const y1 = ya(x), y2 = yb(x);
    const mid = (y1 + y2) / 2;
    const hi = highlight.includes(i);
    const depth = Math.cos(((x - x0) / rise) * (TAU / twist) + phaseB / 2);
    const op = 0.55 + 0.45 * (depth * 0.5 + 0.5);
    const pg = el('g', { 'data-part': 'pair', 'data-index': String(i), 'data-base': b1 });
    const w = Math.max(1.4, rise * 0.42);
    const cA = BASES[b1] || '#999', cB = BASES[b2] || '#999';
    if (hi && dark) pg.appendChild(el('circle', { cx: n(x), cy: n(mid), r: n(width * 0.62), fill: dotGlow(PALETTE.foreignPeptide, 0.5) }));
    pg.appendChild(el('path', { d: `M${n(x)} ${n(y1)}V${n(mid)}`, stroke: dark ? cA : mix(cA, S.ink, 0.25), 'stroke-width': n(w), 'stroke-linecap': 'round', 'stroke-opacity': n(op) }));
    pg.appendChild(el('path', { d: `M${n(x)} ${n(mid)}V${n(y2)}`, stroke: dark ? cB : mix(cB, S.ink, 0.25), 'stroke-width': n(w), 'stroke-linecap': 'round', 'stroke-opacity': n(op) }));
    if (hi) pg.appendChild(el('rect', { x: n(x - rise * 0.45), y: n(-width / 2 - 2), width: n(rise * 0.9), height: n(width + 4), rx: n(rise * 0.3), fill: 'none', stroke: PALETTE.foreignPeptide, 'stroke-width': n(Math.max(0.8, rise * 0.12)) }));
    pairs.appendChild(pg);
    if (lettersG) {
      const fs = Math.max(7, rise * 0.95);
      lettersG.appendChild(el('text', { x: n(x), y: n(-width / 2 - fs * 0.55), 'text-anchor': 'middle', 'font-size': n(fs), 'font-family': 'Inter, system-ui, sans-serif', 'font-weight': hi ? 700 : 500, fill: hi ? PALETTE.foreignPeptide : (dark ? '#E9EDF7' : S.ink) }, b1));
      lettersG.appendChild(el('text', { x: n(x), y: n(width / 2 + fs * 1.05), 'text-anchor': 'middle', 'font-size': n(fs), 'font-family': 'Inter, system-ui, sans-serif', 'font-weight': 500, fill: dark ? '#AAB3CC' : S.ink2, 'fill-opacity': 0.85 }, b2));
    }
  }
  const bw = Math.max(1, rise * 0.24);
  root.appendChild(el('path', { 'data-part': 'backbone-b', d: smoothPath(ptsB, { closed: false }), fill: 'none', stroke: bbColor, 'stroke-width': n(bw), 'stroke-opacity': 0.55, 'stroke-linecap': 'round' }));
  root.appendChild(pairs);
  root.appendChild(el('path', { 'data-part': 'backbone-a', d: smoothPath(ptsA, { closed: false }), fill: 'none', stroke: bbColor, 'stroke-width': n(bw * 1.15), 'stroke-opacity': 0.95, 'stroke-linecap': 'round' }));
  if (lettersG) root.appendChild(lettersG);
  return root;
}

/** Single-stranded RNA: backbone with base stubs (U instead of T). Parts: backbone, base. */
export function rna(o = {}) {
  const { sequence = 'AUGGCUAGCAAG', rise = 9, stage = 'dark', letters = false, highlight = [] } = o;
  const dark = stage !== 'light';
  const S = stageOf(stage);
  const N = sequence.length;
  const root = el('g', { class: 'sao-mol sao-rna', 'data-mol': 'rna' });
  const x0 = (-(N - 1) / 2) * rise;
  const yAt = (x) => Math.sin((x - x0) / (rise * 2.2)) * rise * 0.35;
  const pts = [];
  for (let x = x0 - rise * 0.5; x <= x0 + (N - 1) * rise + rise * 0.51; x += rise / 3) pts.push([x, yAt(x)]);
  const g = part('bases');
  for (let i = 0; i < N; i++) {
    const x = x0 + i * rise, y = yAt(x);
    const b = sequence[i].toUpperCase();
    const c = BASES[b] || '#999';
    const hi = highlight.includes(i);
    const bg = el('g', { 'data-part': 'base', 'data-index': String(i), 'data-base': b });
    if (hi && dark) bg.appendChild(el('circle', { cx: n(x), cy: n(y + rise * 0.7), r: n(rise * 1.1), fill: dotGlow(PALETTE.foreignPeptide, 0.5) }));
    bg.appendChild(el('path', { d: `M${n(x)} ${n(y)}V${n(y + rise * 1.25)}`, stroke: dark ? c : mix(c, S.ink, 0.25), 'stroke-width': n(Math.max(1.4, rise * 0.42)), 'stroke-linecap': 'round' }));
    if (letters) {
      const fs = Math.max(7, rise * 0.95);
      bg.appendChild(el('text', { x: n(x), y: n(y + rise * 1.25 + fs * 1.1), 'text-anchor': 'middle', 'font-size': n(fs), 'font-family': 'Inter, system-ui, sans-serif', 'font-weight': hi ? 700 : 500, fill: hi ? PALETTE.foreignPeptide : (dark ? '#E9EDF7' : S.ink) }, b));
    }
    g.appendChild(bg);
  }
  root.appendChild(g);
  root.appendChild(el('path', { 'data-part': 'backbone', d: smoothPath(pts, { closed: false }), fill: 'none', stroke: dark ? '#C9D3F0' : S.ink2, 'stroke-width': n(Math.max(1, rise * 0.26)), 'stroke-linecap': 'round' }));
  return root;
}

/**
 * Proteasome — the cell's shredder: a barrel of four stacked rings (side view), with
 * optional regulatory caps. Anchor: centre; vertical; size = barrel height.
 * Parts: barrel, cap-top, cap-bottom, channel.
 */
export function proteasome(o = {}) {
  const { u, T, sw, root, stage } = setup('proteasome', { size: 40, ...o, detail: 'high' }, o.color || PALETTE.proteasome);
  const w = 0.62 * u, ringH = 0.25 * u;
  const barrel = part('barrel');
  for (let i = 0; i < 4; i++) {
    const cy = -0.5 * u + ringH * (i + 0.5);
    const inner = i === 1 || i === 2;
    let d = '';
    const k = 4;
    for (let j = 0; j < k; j++) {
      const cx = -w / 2 + (w / k) * (j + 0.5);
      d += roundRectD(cx, cy, (w / k) * 0.94, ringH * 0.86, ringH * 0.35);
    }
    barrel.appendChild(dom(d, T, sw, inner ? { fill: T.fill2, 'fill-opacity': stage === 'light' ? 0.9 : 0.55 } : {}));
  }
  root.appendChild(barrel);
  root.appendChild(el('path', { 'data-part': 'channel', d: `M0 ${n(-0.44 * u)}V${n(0.44 * u)}`, stroke: stage === 'light' ? '#1B1F2A' : '#05070F', 'stroke-opacity': 0.35, 'stroke-width': n(0.07 * u), 'stroke-linecap': 'round' }));
  if (o.caps !== false) {
    const Tc = glyphTones(o.capColor || mix(PALETTE.proteasome, '#8C95C9', 0.4), stage);
    for (const s of [-1, 1]) {
      const y0 = s * 0.5 * u;
      const d = `M${n(-0.36 * u)} ${n(y0 + s * 0.02 * u)}C${n(-0.42 * u)} ${n(y0 + s * 0.2 * u)} ${n(-0.15 * u)} ${n(y0 + s * 0.3 * u)} ${n(-0.05 * u)} ${n(y0 + s * 0.2 * u)}C${n(0.05 * u)} ${n(y0 + s * 0.32 * u)} ${n(0.4 * u)} ${n(y0 + s * 0.24 * u)} ${n(0.36 * u)} ${n(y0 + s * 0.02 * u)}Z`;
      root.appendChild(part(s < 0 ? 'cap-top' : 'cap-bottom', {}, [dom(d, Tc, sw)]));
    }
  }
  return root;
}

// ---------------------------------------------------------------- pattern tokens (PAMPs / DAMPs)

/**
 * Molecular danger patterns for pattern-recognition figures. Centred; size = overall length.
 * pamp({ kind, size:16, stage, color, rotation })
 *   'lps'       — lipopolysaccharide: two lipid tails, a sugar chain (bacteria)
 *   'flagellin' — a short wavy segment of bacterial flagellum
 *   'dna'       — a mini double helix (microbial or released self DNA)
 *   'rna'       — a single wavy strand with bases (viral RNA; red-coral by default)
 *   'atp'       — ATP spilled by damaged cells: base + sugar + three phosphates (pale gold)
 *   'uricAcid'  — needle-shaped crystals (alias 'crystal')
 * Parts: token.
 */
export function pamp(o = {}) {
  const kind = o.kind === 'crystal' ? 'uricAcid' : (o.kind || 'lps');
  const u = o.size ?? 16;
  const stage = o.stage === 'light' ? 'light' : 'dark';
  const dark = stage === 'dark';
  const defaults = { lps: PALETTE.bacteria, flagellin: PALETTE.bacteria, dna: '#A9B8FF', rna: PALETTE.virus, atp: PALETTE.danger, uricAcid: '#EEF1FA' };
  const T = glyphTones(o.color || defaults[kind], stage);
  const sw = Math.max(0.6, u * 0.06);
  const g = el('g', { class: 'sao-mol sao-pamp', 'data-mol': 'pamp', 'data-kind': kind, transform: o.rotation ? `rotate(${n(o.rotation)})` : null });
  const strokeC = dark ? mix(T.base, WHITE, 0.3) : T.stroke;
  const fillC = dark ? mix(T.base, '#0B1024', 0.15) : T.fill;
  const P = (attrs) => el('path', { 'data-part': 'token', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...attrs });
  if (dark && kind !== 'uricAcid') g.appendChild(el('circle', { r: n(u * 0.62), fill: dotGlow(T.base, 0.28) }));
  if (kind === 'lps') {
    let tails = '';
    for (const x of [-0.08, 0.08]) tails += `M${n(x * u)} ${n(0.5 * u)}q${n(-0.06 * u)} ${n(-0.1 * u)} 0 ${n(-0.2 * u)}t0 ${n(-0.15 * u)}`;
    g.appendChild(P({ d: tails, fill: 'none', stroke: strokeC, 'stroke-width': n(sw) }));
    let hex = '';
    for (let i = 0; i < 3; i++) hex += polygonD(0, (0.08 - i * 0.17) * u, 0.09 * u, 6, Math.PI / 6);
    g.appendChild(P({ d: hex, fill: fillC, stroke: strokeC, 'stroke-width': n(sw * 0.8) }));
    let beads = '';
    for (let i = 0; i < 3; i++) beads += circleD((i % 2 ? 0.05 : -0.04) * u, (-0.38 - i * 0.12) * u, 0.055 * u);
    g.appendChild(P({ d: beads, fill: strokeC }));
  } else if (kind === 'flagellin') {
    const pts = [];
    for (let i = 0; i <= 16; i++) { const t = i / 16; pts.push([(t - 0.5) * u, Math.sin(t * TAU * 1.5) * 0.14 * u]); }
    const d = smoothPath(pts, { closed: false });
    g.appendChild(P({ d, fill: 'none', stroke: strokeC, 'stroke-width': n(u * 0.16) }));
    g.appendChild(P({ d, fill: 'none', stroke: fillC, 'stroke-width': n(u * 0.07) }));
  } else if (kind === 'dna' || kind === 'rna') {
    const a = [], b = [];
    for (let i = 0; i <= 18; i++) { const t = i / 18; a.push([(t - 0.5) * u, Math.sin(t * TAU) * 0.18 * u]); b.push([(t - 0.5) * u, Math.sin(t * TAU + Math.PI) * 0.18 * u]); }
    let rungs = '';
    if (kind === 'dna') {
      for (const t of [0.12, 0.38, 0.62, 0.88]) rungs += `M${n((t - 0.5) * u)} ${n(Math.sin(t * TAU) * 0.18 * u)}V${n(Math.sin(t * TAU + Math.PI) * 0.18 * u)}`;
      g.appendChild(P({ d: rungs, stroke: strokeC, 'stroke-width': n(sw * 0.8), 'stroke-opacity': 0.7 }));
      g.appendChild(P({ d: smoothPath(b, { closed: false }), fill: 'none', stroke: strokeC, 'stroke-width': n(sw * 1.2), 'stroke-opacity': 0.6 }));
    } else {
      for (const t of [0.1, 0.3, 0.5, 0.7, 0.9]) { const y = Math.sin(t * TAU) * 0.18 * u; rungs += `M${n((t - 0.5) * u)} ${n(y)}v${n(0.18 * u)}`; }
      g.appendChild(P({ d: rungs, stroke: strokeC, 'stroke-width': n(sw), 'stroke-opacity': 0.75 }));
    }
    g.appendChild(P({ d: smoothPath(a, { closed: false }), fill: 'none', stroke: strokeC, 'stroke-width': n(sw * 1.3) }));
  } else if (kind === 'atp') {
    // adenine (fused rings) + ribose + three phosphates
    g.appendChild(P({ d: polygonD(-0.36 * u, -0.06 * u, 0.1 * u, 6, Math.PI / 6) + polygonD(-0.21 * u, -0.08 * u, 0.085 * u, 5, -Math.PI / 2) + polygonD(-0.12 * u, 0.1 * u, 0.08 * u, 5, Math.PI / 2), fill: fillC, stroke: strokeC, 'stroke-width': n(sw * 0.7) }));
    g.appendChild(P({ d: `M${n(-0.05 * u)} ${n(0.1 * u)}H${n(0.38 * u)}`, stroke: strokeC, 'stroke-width': n(sw) }));
    let ph = '';
    for (let i = 0; i < 3; i++) ph += circleD((0.06 + i * 0.15) * u, 0.1 * u, 0.06 * u);
    g.appendChild(P({ d: ph, fill: strokeC }));
  } else {
    // monosodium urate: slender needle crystals
    const needle = (x, y, len, w, rot) => {
      const c = Math.cos((rot * Math.PI) / 180), s = Math.sin((rot * Math.PI) / 180);
      const pts = [[-len / 2, 0], [-len / 2 + w, -w / 2], [len / 2 - w, -w / 2], [len / 2, 0], [len / 2 - w, w / 2], [-len / 2 + w, w / 2]];
      return pts.map(([px, py], i) => `${i ? 'L' : 'M'}${n(x + px * c - py * s)} ${n(y + px * s + py * c)}`).join('') + 'Z';
    };
    const d = needle(0, 0, u, u * 0.13, -28) + needle(0.05 * u, 0.05 * u, u * 0.78, u * 0.11, 18) + needle(-0.08 * u, 0.02 * u, u * 0.62, u * 0.1, 72);
    if (dark) g.appendChild(el('circle', { r: n(u * 0.55), fill: dotGlow('#FFFFFF', 0.18) }));
    g.appendChild(P({ d, fill: dark ? mix(T.base, '#0B1024', 0.1) : WHITE, 'fill-opacity': 0.9, stroke: dark ? WHITE : mix('#8C93A8', '#1B1F2A', 0.2), 'stroke-width': n(sw * 0.6) }));
  }
  return g;
}

// ---------------------------------------------------------------- adhesion & coreceptors

/**
 * LFA-1 — the integrin that grips ICAM-1 and holds a synapse together. state:'extended'
 * (active, upright, default) | 'bent' (resting, folded over). Two legs (α, β) + headpiece.
 */
export function lfa1(o = {}) {
  const { u, det, T, sw, root, stage } = setup('lfa1', o, o.color || mix(PALETTE.cd8, WHITE, 0.35));
  const bent = o.state === 'bent';
  root.setAttribute('data-state', bent ? 'bent' : 'extended');
  const legs = bent
    ? `M${n(-0.06 * u)} ${n(0.12 * u)}L${n(-0.08 * u)} ${n(-0.42 * u)}M${n(0.06 * u)} ${n(0.12 * u)}L${n(0.06 * u)} ${n(-0.4 * u)}`
    : `M${n(-0.06 * u)} ${n(0.12 * u)}L${n(-0.09 * u)} ${n(-0.6 * u)}M${n(0.06 * u)} ${n(0.12 * u)}L${n(0.08 * u)} ${n(-0.58 * u)}`;
  root.appendChild(el('path', { 'data-part': 'legs', d: legs, stroke: T.stroke, 'stroke-width': n(det === 'low' ? Math.max(0.8, 0.1 * u) : sw * 1.5), fill: 'none', 'stroke-linecap': 'round' }));
  const head = el('g', { 'data-part': 'head', transform: bent ? `translate(${n(0.02 * u)} ${n(-0.42 * u)}) rotate(115) translate(0 ${n(0.42 * u)})` : null });
  const hy = -0.72 * u;
  head.appendChild(dom(circleD(-0.08 * u, hy, 0.13 * u), T, sw));
  head.appendChild(dom(ellipseD(0.1 * u, hy + 0.02 * u, 0.1 * u, 0.12 * u), T, sw, { fill: T.fill2, 'fill-opacity': stage === 'light' ? 1 : 0.7 }));
  head.appendChild(dom(circleD(-0.1 * u, hy - 0.17 * u, 0.07 * u), T, sw, { 'data-part': 'i-domain' }));
  root.appendChild(head);
  return root;
}

/** ICAM-1 — LFA-1's partner on presenter / target / vessel cells: five Ig beads on a bent stalk. */
export function icam1(o = {}) {
  const { u, det, T, sw, root } = setup('icam1', o, o.color || '#C9B6DA');
  const pts = [[0, -0.12], [0.02, -0.3], [0.05, -0.48], [0.06, -0.66], [0.03, -0.84]];
  root.appendChild(el('path', { d: `M0 ${n(0.1 * u)}L0 ${n(-0.04 * u)}`, stroke: T.stroke, 'stroke-width': n(sw * 1.4), 'stroke-linecap': 'round' }));
  if (det === 'low') {
    root.appendChild(el('path', { 'data-part': 'beads', d: smoothPath(pts.map(([x, y]) => [x * u, y * u]), { closed: false }), stroke: T.stroke, 'stroke-width': n(Math.max(1, 0.15 * u)), fill: 'none', 'stroke-linecap': 'round' }));
  } else {
    let d = '';
    for (const [x, y] of pts) d += ellipseD(x * u, y * u, 0.075 * u, 0.095 * u, x * 200);
    root.appendChild(dom(d, T, sw * 0.8, { 'data-part': 'beads' }));
  }
  return root;
}

/** CD8 coreceptor (αβ heterodimer: two short stalks with Ig heads) — helps a killer T cell grip MHC class I. */
export function cd8(o = {}) {
  const { u, det, T, sw, root } = setup('cd8', o, o.color || mix(PALETTE.cd8, WHITE, 0.3));
  root.appendChild(el('path', { d: `M${n(-0.05 * u)} ${n(0.1 * u)}L${n(-0.1 * u)} ${n(-0.5 * u)}M${n(0.05 * u)} ${n(0.1 * u)}L${n(0.1 * u)} ${n(-0.5 * u)}`, stroke: T.stroke, 'stroke-width': n(det === 'low' ? Math.max(0.8, 0.09 * u) : sw * 1.3), fill: 'none', 'stroke-linecap': 'round' }));
  const d = ellipseD(-0.12 * u, -0.62 * u, 0.09 * u, 0.12 * u, -15) + ellipseD(0.12 * u, -0.62 * u, 0.09 * u, 0.12 * u, 15);
  root.appendChild(det === 'low' ? el('path', { 'data-part': 'heads', d, fill: T.stroke }) : dom(d, T, sw, { 'data-part': 'heads' }));
  return root;
}

/** CD4 coreceptor (one chain, four Ig domains in a row) — helps a helper T cell grip MHC class II. */
export function cd4(o = {}) {
  const { u, det, T, sw, root } = setup('cd4', o, o.color || mix(PALETTE.cd4, WHITE, 0.3));
  root.appendChild(el('path', { d: `M0 ${n(0.1 * u)}V${n(-0.06 * u)}`, stroke: T.stroke, 'stroke-width': n(sw * 1.4), 'stroke-linecap': 'round' }));
  let d = '';
  [[0, -0.15], [0.03, -0.37], [0.02, -0.59], [-0.02, -0.8]].forEach(([x, y]) => (d += ellipseD(x * u, y * u, 0.085 * u, 0.11 * u)));
  root.appendChild(det === 'low' ? el('path', { 'data-part': 'domains', d, fill: T.stroke }) : dom(d, T, sw * 0.8, { 'data-part': 'domains' }));
  return root;
}

// ---------------------------------------------------------------- docking geometry

/**
 * Top of each glyph's head, as a multiple of its size (y = HEAD_Y[name] * size, negative = out).
 * Useful to aim drugs or partners at a glyph's head.
 */
export const HEAD_Y = Object.freeze({
  mhc1: -0.9, mhc2: -0.83, tcr: -0.8, tcrKey: -1.0, cd28: -0.79, ctla4: -0.78, b7: -0.86, pd1: -0.88,
  pdl1: -0.95, antigen: -0.96, car: -1.04, nkInhibitory: -0.93, nkActivating: -0.79, stressLigand: -0.96,
  bcr: -0.98, antibody: -0.98, cd25: -0.98, receptor: -0.95, lfa1: -0.92, icam1: -0.94, cd8: -0.74, cd4: -0.91,
});

/**
 * Membrane-to-membrane distance (as a multiple of glyph size, both partners the same size) at
 * which two facing glyphs are ENGAGED: heads touching, PD-1/PD-L1 interlocked, TCR resting on
 * the MHC rim. Use for synapse scenes: synapse({ gap: DOCK_GAP['pd1-pdl1'] * size }).
 */
export const DOCK_GAP = Object.freeze({
  'tcr-mhc1': 1.62, 'tcr-mhc2': 1.56, 'tcrKey-mhc1Key': 1.84, 'pd1-pdl1': 1.72, 'cd28-b7': 1.65,
  'ctla4-b7': 1.64, 'car-antigen': 2.0, 'nkInhibitory-mhc1': 1.83, 'nkActivating-stressLigand': 1.75, 'lfa1-icam1': 1.84,
});

/**
 * Arm-tip positions of antibody({ size, anchor:'base' }) in its own frame — e.g. to cap a
 * target head with one tip while the Fc points away (FIGURE-AUDIT rule 9).
 * Returns { left:[x,y], right:[x,y], fc:[0,0] } (add 0.5*size to y for anchor:'center').
 */
export function antibodyTips(size = 16) {
  const ang = (36 * Math.PI) / 180, La = 0.56 * size, hy = -0.485 * size;
  const tip = (s) => [s * 0.035 * size + s * Math.sin(ang) * La * 1.06, hy - Math.cos(ang) * La * 1.06];
  return { left: tip(-1), right: tip(1), fc: [0, 0] };
}

// ---------------------------------------------------------------- registry

export const MOLECULES = {
  mhc1, mhc2, tcr, cd3, bcr, antibody, bite, cd28, ctla4, b7, pd1, pdl1, car, perforin, granzyme,
  cytokine, interferon, dangerSpark, tcrKey, epitopeKey, pamp, lfa1, icam1, cd8, cd4, receptor, ligand, antigen, cd25, tlr, nkActivating, nkInhibitory, stressLigand, fas, fasL,
  peptideChain, dna, rna, proteasome, signalIcon,
};

// ---------------------------------------------------------------- placement on membranes

function resolveFactory(f) {
  if (typeof f === 'function') return f;
  if (typeof f === 'string' && MOLECULES[f]) return MOLECULES[f];
  throw new Error(`placeOnMembrane: unknown glyph factory ${f}`);
}

/**
 * Seat N molecule glyphs evenly along a cell's membrane, facing outward.
 *
 * placeOnMembrane(cellG, 'tcr', { count: 10, arcStart: -60, arcEnd: 60, size: 12 })
 * placeOnMembrane(cellG, (o, i) => mhc1({ ...o, peptide: i % 3 ? 'self' : 'neo' }), { count: 12 })
 *
 * cellG: a cell from cells.js (uses its true outline), OR { outline:[[x,y]…], parent:<g> }.
 * Options: count, arcStart/arcEnd (degrees, 0 = +x/right, 90 = down; default full ring),
 *   size, sizeJitter (0..1), tilt (deg random lean), seed, inset (px, push base inward),
 *   stage (default: the cell's), detail, layer (data-part of the container, default 'receptors'),
 *   opts (extra options passed to the factory), offset (0..1 phase along the arc).
 * Returns the array of placed glyph <g>s. Each gets data-angle (deg) and data-base-transform.
 */
export function placeOnMembrane(cellG, factory, opts = {}) {
  const info = cellInfo(cellG);
  const outline = (info && info.outline) || (cellG && cellG.outline);
  const parent = (info ? cellG : cellG.parent) || cellG;
  if (!outline) throw new Error('placeOnMembrane: target has no outline');
  const {
    count = 8, arcStart = null, arcEnd = null, size = Math.max(5, Math.min(22, ((info && info.r) || 30) * 0.34)),
    sizeJitter = 0, tilt = 0, seed = 1, inset = 0, layer = 'receptors', offset = 0.5,
  } = opts;
  const stage = opts.stage || (info && info.stage) || 'dark';
  const fn = resolveFactory(factory);
  const R = rng(seed, 'place');
  const a0 = arcStart == null ? null : (arcStart * Math.PI) / 180;
  const a1 = arcEnd == null ? null : (arcEnd * Math.PI) / 180;
  const spots = samplePerimeter(outline, count, { a0, a1, offset });
  let container = parent.querySelector(`:scope > [data-part="${layer}"]`);
  if (!container) {
    container = el('g', { 'data-part': layer });
    parent.appendChild(container);
  }
  const placed = [];
  spots.forEach((s, i) => {
    const sz = size * (1 + (sizeJitter ? R.range(-sizeJitter, sizeJitter) : 0));
    const g = fn({ size: sz, stage, detail: opts.detail || (sz >= 24 ? 'high' : 'low'), ...(opts.opts || {}) }, i);
    const rot = (s.angle * 180) / Math.PI + 90 + (tilt ? R.range(-tilt, tilt) : 0);
    const t = `translate(${n(s.x - s.nx * inset)} ${n(s.y - s.ny * inset)}) rotate(${n(rot)})`;
    g.setAttribute('transform', t);
    g.setAttribute('data-base-transform', t);
    g.setAttribute('data-angle', n((s.angle * 180) / Math.PI));
    container.appendChild(g);
    placed.push(g);
  });
  return placed;
}

/**
 * Seat glyphs along a straight membrane segment (molecular close-ups, synapses).
 * placeAlong(g, 'tcr', { x0: -100, x1: 100, y: 40, count: 5, facing: 'up' | 'down' })
 */
export function placeAlong(parent, factory, opts = {}) {
  const { x0 = -50, x1 = 50, y = 0, count = 5, facing = 'up', size = 24, stage = 'dark', jitter = 0, seed = 1, layer = null } = opts;
  const fn = resolveFactory(factory);
  const R = rng(seed, 'along');
  let container = parent;
  if (layer) {
    container = parent.querySelector(`:scope > [data-part="${layer}"]`) || parent.appendChild(el('g', { 'data-part': layer }));
  }
  const out = [];
  for (let i = 0; i < count; i++) {
    const x = count === 1 ? (x0 + x1) / 2 : lerp(x0, x1, (i + 0.5) / count) + (jitter ? R.range(-jitter, jitter) : 0);
    const g = fn({ size, stage, detail: opts.detail, ...(opts.opts || {}) }, i);
    const t = `translate(${n(x)} ${n(y)})${facing === 'down' ? ' rotate(180)' : ''}`;
    g.setAttribute('transform', t);
    g.setAttribute('data-base-transform', t);
    container.appendChild(g);
    out.push(g);
  }
  return out;
}
