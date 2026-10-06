// shared/synapse.js — the molecular gap between two cells (platform task P4).
// API: docs/shared/synapse.md. Built on art `synapse` + `DOCK_GAP` / `HEAD_Y` geometry.
//
// Frame: the scene's own origin is the middle of the gap; the TOP cell (T cell) membrane's
// outer surface is at y = −gap/2 (its glyphs point down), the BOTTOM cell's at y = +gap/2.
// Every glyph sits in   pose (engage / cap) › display (setDisplay) › life (ambient) › glyph
// so stepper tweens and idle loops never drive the same attribute.
import { gsap } from '../../../vendor/gsap/index.js';
import * as ART from '../../art/index.js';

const { el, synapse: synapseArt, tcr, mhc1, pd1, pdl1, cd28, ctla4, b7, car, antigen, antibody, granzyme, perforin, signalIcon, PALETTE, mix, resolve } = ART;

const DEG = Math.PI / 180;
const WHITE = '#FFFFFF';
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const clamp01 = (v) => clamp(v, 0, 1);
const lerp = (a, b, t) => a + (b - a) * t;
const seg = (p, a, b) => clamp01((p - a) / (b - a || 1));
const f = (v) => String(Math.round(v * 100) / 100);
const E = {
  inOut: gsap.parseEase('so.inOut') || gsap.parseEase('power2.inOut'),
  out: gsap.parseEase('so.out') || gsap.parseEase('power2.out'),
  in: gsap.parseEase('so.in') || gsap.parseEase('power2.in'),
  sine: gsap.parseEase('sine.inOut'),
  back: gsap.parseEase('back.out(1.6)'),
};
const reducedMotion = () => (ART.prefersReducedMotion ? ART.prefersReducedMotion() : false);
const FOREIGN = new Set(['neo', 'viral', 'foreign']);

function prng(seed = 1) {
  let s = seed >>> 0;
  const r = () => {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  r.range = (a, b) => a + (b - a) * r();
  return r;
}

/** Seek-safe tween of a pure render(p) (see cell-actions drive()). */
function drive(tl, render, { duration = 1, ease = 'none', pos } = {}) {
  let v = 0;
  const proxy = {};
  Object.defineProperty(proxy, 'p', { get: () => v, set: (x) => { v = x; render(x); }, enumerable: true });
  tl.fromTo(proxy, { p: 0 }, { p: 1, duration: Math.max(0.001, duration), ease, immediateRender: false }, pos);
}
/** Run `fn(sub)` on a sub-timeline at `pos` of `tl`, or immediately (free-running). */
function timed(tl, pos, fn) {
  const sub = gsap.timeline({ paused: !tl });
  const extra = fn(sub) || {};
  if (tl) {
    tl.add(sub, pos);
    return { ...extra, start: sub.startTime(), end: sub.startTime() + sub.duration() };
  }
  if (reducedMotion()) sub.progress(1);
  else sub.play();
  sub.result = extra;
  return sub;
}

// ------------------------------------------------------------------ local glyphs
// LFA-1 / ICAM-1 (adhesion ring) and the CD8 co-receptor are not in the art library yet:
// drawn here with ART stroke conventions (anchor = membrane surface, extracellular = −y).

function tones(color, stage) { return ART.glyphTones ? ART.glyphTones(color, stage) : { fill: color, fill2: color, stroke: color, light: color }; }
function dom(d, T, sw, extra = {}) {
  return el('path', { d, fill: T.fill, stroke: T.stroke, 'stroke-width': f(sw), 'stroke-linejoin': 'round', ...extra });
}
function capsule(x1, y1, x2, y2, w) { return ART.capsuleD ? ART.capsuleD(x1, y1, x2, y2, w) : `M${x1} ${y1}L${x2} ${y2}`; }
function ellipse(cx, cy, rx, ry, rot = 0) { return ART.ellipseD ? ART.ellipseD(cx, cy, rx, ry, rot) : ''; }

const ADHESION = { lfa1: '#B9C3EA', icam1: '#D9C8EC' };

/** LFA-1 (integrin αL/β2): two legs, a bent knee, a head that grips ICAM-1. */
function lfa1({ size = 40, stage = 'dark', reach = 0.86 } = {}) {
  const u = size, T = tones(ADHESION.lfa1, stage), sw = clamp(u * 0.045, 0.6, 2);
  const g = el('g', { class: 'sao-mol sao-lfa1', 'data-mol': 'lfa1' });
  const top = -reach * u;
  for (const s of [-1, 1]) {
    g.appendChild(el('path', { d: `M${f(s * 0.06 * u)} ${f(0.12 * u)}L${f(s * 0.07 * u)} ${f(-0.3 * u)}Q${f(s * 0.16 * u)} ${f(-0.46 * u)} ${f(s * 0.08 * u)} ${f(top + 0.24 * u)}`, fill: 'none', stroke: T.stroke, 'stroke-width': f(sw * 1.5), 'stroke-linecap': 'round' }));
  }
  g.appendChild(dom(ellipse(-0.07 * u, top + 0.13 * u, 0.12 * u, 0.1 * u), T, sw));
  g.appendChild(dom(ellipse(0.08 * u, top + 0.12 * u, 0.11 * u, 0.11 * u), T, sw, { fill: T.fill2 }));
  return g;
}
/** ICAM-1: a gently bent stalk of five Ig-like beads. */
function icam1({ size = 40, stage = 'dark', height = 0.76 } = {}) {
  const u = size, T = tones(ADHESION.icam1, stage), sw = clamp(u * 0.04, 0.6, 2);
  const g = el('g', { class: 'sao-mol sao-icam1', 'data-mol': 'icam1' });
  const H = height * u;
  g.appendChild(el('path', { d: `M0 ${f(0.1 * u)}V${f(-0.04 * u)}`, stroke: T.stroke, 'stroke-width': f(sw * 1.4), 'stroke-linecap': 'round' }));
  for (let i = 0; i < 5; i++) {
    const y = -0.08 * u - (i + 0.5) * (H - 0.08 * u) / 5;
    const x = Math.sin(i * 0.7) * 0.03 * u;
    g.appendChild(dom(ellipse(x, y, 0.075 * u, (H - 0.08 * u) / 10 * 1.05), T, sw, i === 4 ? { fill: T.fill2 } : {}));
  }
  return g;
}
/** CD8 αβ co-receptor: two long stalks ending in Ig-like heads (lighter blue, no CDR arc). */
function cd8({ size = 40, length = 1, stage = 'dark', color = PALETTE.cd8 } = {}) {
  const u = size, T = tones(mix(resolve(color), WHITE, 0.42), stage), sw = clamp(u * 0.045, 0.7, 2.2);
  const L = length;
  const g = el('g', { class: 'sao-mol sao-cd8', 'data-mol': 'cd8' });
  for (const s of [-1, 1]) {
    g.appendChild(el('path', { d: `M${f(s * 0.04 * u)} ${f(0.12 * u)}C${f(s * 0.07 * u)} ${f(-0.3 * L)} ${f(s * 0.02 * u)} ${f(-0.6 * L)} ${f(s * 0.05 * u)} ${f(-(L - 0.26 * u))}`, fill: 'none', stroke: T.stroke, 'stroke-width': f(sw * 1.6), 'stroke-linecap': 'round' }));
  }
  g.appendChild(dom(ellipse(-0.075 * u, -(L - 0.15 * u), 0.095 * u, 0.15 * u, 10), T, sw));
  g.appendChild(dom(ellipse(0.08 * u, -(L - 0.14 * u), 0.09 * u, 0.14 * u, -10), T, sw, { fill: T.fill2 }));
  return g;
}
/** Tiny scissors (granzymes cut proteins). Centered. */
function scissors(size = 9, color = WHITE) {
  const s = size / 2;
  const g = el('g', { 'data-part': 'scissors', fill: 'none', stroke: color, 'stroke-width': f(Math.max(0.8, size * 0.11)), 'stroke-linecap': 'round' });
  g.appendChild(el('circle', { cx: f(-s * 0.55), cy: f(s * 0.62), r: f(s * 0.3) }));
  g.appendChild(el('circle', { cx: f(s * 0.55), cy: f(s * 0.62), r: f(s * 0.3) }));
  g.appendChild(el('path', { d: `M${f(-s * 0.36)} ${f(s * 0.38)}L${f(s * 0.55)} ${f(-s * 0.95)}M${f(s * 0.36)} ${f(s * 0.38)}L${f(-s * 0.55)} ${f(-s * 0.95)}` }));
  return g;
}

// ------------------------------------------------------------------ kinds

const GAPS = { 'tcr-mhc': 'tcr-mhc1', 'pd1-pdl1': 'pd1-pdl1', 'cd28-b7': 'cd28-b7', 'ctla4-b7': 'ctla4-b7', 'car-antigen': 'car-antigen' };
const SIGN = { 'tcr-mhc': '+', 'pd1-pdl1': '-', 'cd28-b7': '+', 'ctla4-b7': '-', 'car-antigen': '+', 'lfa1-icam1': null };
const HEAD = { tcr: 0.8, mhc1: 0.9, pd1: 0.88, pdl1: 0.95, cd28: 0.79, ctla4: 0.78, b7: 0.86, car: 1.04, antigen: 0.96, lfa1: 0.86, icam1: 0.76 };
function dockGap(kind) {
  if (kind === 'lfa1-icam1') return 1.62;
  const k = GAPS[kind];
  return (ART.DOCK_GAP && ART.DOCK_GAP[k]) || { 'tcr-mhc1': 1.62, 'pd1-pdl1': 1.72, 'cd28-b7': 1.65, 'ctla4-b7': 1.64, 'car-antigen': 2.0 }[k] || 1.7;
}
function headY(name) { return Math.abs((ART.HEAD_Y && ART.HEAD_Y[name]) ?? HEAD[name] ?? 0.9); }

function makePair(kind, i, o, ctx) {
  const { size, stage, topColor, peptide, antigenOpts } = o;
  switch (kind) {
    case 'tcr-mhc': return { top: tcr({ size, stage, color: topColor, cd3: true }), bottom: mhc1({ size, stage, peptide }), topName: 'tcr', bottomName: 'mhc1' };
    case 'pd1-pdl1': return { top: pd1({ size, stage, icon: false }), bottom: pdl1({ size, stage }), topName: 'pd1', bottomName: 'pdl1' };
    case 'cd28-b7': return { top: cd28({ size, stage, icon: false }), bottom: b7({ size, stage }), topName: 'cd28', bottomName: 'b7' };
    case 'ctla4-b7': return { top: ctla4({ size, stage, icon: false }), bottom: b7({ size, stage }), topName: 'ctla4', bottomName: 'b7' };
    case 'car-antigen': return { top: car({ size, stage }), bottom: antigen({ size, stage, shape: (antigenOpts && antigenOpts.shape) || 'circle', color: antigenOpts && antigenOpts.color }), topName: 'car', bottomName: 'antigen' };
    case 'lfa1-icam1': return { top: lfa1({ size, stage }), bottom: icam1({ size, stage }), topName: 'lfa1', bottomName: 'icam1' };
    default: throw new Error(`synapseScene: unknown pair kind "${kind}"`);
  }
}

// ------------------------------------------------------------------ scene

export function synapseScene(parent, opts = {}) {
  const {
    top = { color: 'cd8' }, bottom = { color: 'cancer' }, pairs: specs = [], size = 40, width = 480,
    thickness = 12, depth = 46, x = 0, y = 0, rotate = 0, stage = 'dark', seed = 1, life = [2, 4], ctx = null,
  } = opts;
  const topColor = resolve(top.color || 'cd8');
  const botColor = resolve(bottom.color || 'cancer');
  const kinds = [...new Set(specs.map((s) => s.kind))];
  const gap = opts.gap ?? Math.max(1.62, ...kinds.map(dockGap)) * size;
  const topY = -gap / 2, bottomY = gap / 2;
  const light = stage === 'light';
  const rnd = prng(seed * 977 + 13);

  const root = el('g', { class: 'so-synapse', transform: `translate(${f(x)} ${f(y)}) rotate(${f(rotate)})` });
  const art = synapseArt({ width, gap, thickness, depth, stage, top: { color: topColor }, bottom: { color: botColor } });
  root.appendChild(art);
  const layer = {
    pores: el('g', { 'data-part': 'pores' }),
    glyphs: el('g', { 'data-part': 'pairs' }),
    signals: el('g', { 'data-part': 'signals' }),
    fx: el('g', { 'data-part': 'fx' }),
    drugs: el('g', { 'data-part': 'drugs' }),
    delivery: el('g', { 'data-part': 'delivery' }),
  };
  root.append(layer.pores, layer.glyphs, layer.signals, layer.fx, layer.delivery, layer.drugs);
  if (parent) parent.appendChild(root);

  // ---------- layout
  const total = specs.reduce((a, s) => a + (s.x ? s.x.length : s.n ?? 1), 0);
  const span = width * 0.8;
  let slot = 0;
  const pairs = {};
  const all = [];
  const iconSize = clamp(size * 0.34, 11, 18);
  for (const s of specs) {
    const n = s.x ? s.x.length : s.n ?? 1;
    for (let i = 0; i < n; i++, slot++) {
      const px = s.x ? s.x[i] : -span / 2 + ((slot + 0.5) / total) * span;
      const peptide = Array.isArray(s.peptide) ? s.peptide[i % s.peptide.length] : s.peptide ?? 'neo';
      const corec = Array.isArray(s.coreceptor) ? s.coreceptor[i % s.coreceptor.length] : s.coreceptor;
      const made = makePair(s.kind, i, { size, stage, topColor, peptide, antigenOpts: s.antigen }, ctx);
      const G = dockGap(s.kind) * size;
      const engagedOff = (gap - G) / 2;                 // toward the midline when engaged
      const apartOff = (gap - G - 0.34 * size) / 2;     // heads ~0.34 size apart
      const tilt = (rnd() < 0.5 ? -1 : 1) * rnd.range(9, 17);
      const mk = (glyph, isTop) => {
        const pose = el('g', { 'data-part': 'pose' });
        const disp = el('g', { 'data-part': 'display' });
        const lifeG = el('g', { 'data-part': 'life' });
        lifeG.appendChild(glyph);
        disp.appendChild(lifeG);
        pose.appendChild(disp);
        layer.glyphs.appendChild(pose);
        return { pose, disp, life: lifeG, glyph, isTop };
      };
      const P = {
        kind: s.kind, i, x: px, peptide, sign: SIGN[s.kind],
        matched: s.kind === 'tcr-mhc' ? FOREIGN.has(peptide) || (typeof peptide === 'string' && peptide.toUpperCase() === PALETTE.foreignPeptide) : true,
        engagedOff, apartOff, tilt, G,
        T: mk(made.top, true), B: mk(made.bottom, false),
        topName: made.topName, bottomName: made.bottomName,
        plan: { e: 0, capped: false, shown: 1, capK: 0, capSide: 'top', capDir: 1 },
      };
      P.top = made.top;
      P.bottom = made.bottom;
      if (corec === 'cd8' || corec === 'cd4') {
        // co-receptor: from the T membrane beside the TCR down to the MHC's α3 (the stalk domain)
        const cx = px - 0.5 * size;
        const tx = px - 0.2 * size, ty = bottomY - engagedOff - 0.27 * size;
        const L = Math.hypot(tx - cx, ty - topY) + 0.02 * size;
        const ang = Math.asin(clamp((cx - tx) / L, -1, 1)) / DEG;
        const g = cd8({ size, length: L, stage, color: corec === 'cd4' ? PALETTE.cd4 : topColor });
        const pose = el('g', { 'data-part': 'coreceptor' });
        const lifeG = el('g', { 'data-part': 'life' });
        lifeG.appendChild(g);
        pose.appendChild(lifeG);
        layer.glyphs.appendChild(pose);
        P.C = { pose, life: lifeG, glyph: g, x: cx, engagedRot: 180 + ang, apartRot: 180 + ang - 14, L, tip: { x: tx, y: ty } };
        P.coreceptor = g;
      }
      // signal disc + pulse bead inside the top cell
      if (P.sign) {
        const sg = el('g', { 'data-part': 'signal', opacity: 0 });
        const iy = topY - thickness - iconSize * 0.95;
        const bead = el('g', { 'data-part': 'pulse', style: 'opacity: 0' });
        bead.appendChild(el('circle', { r: f(iconSize * 0.42), fill: ART.dotGlow ? ART.dotGlow(P.sign === '+' ? PALETTE.activating : PALETTE.inhibitory, 0.7) : WHITE }));
        bead.appendChild(el('circle', { r: f(iconSize * 0.13), fill: WHITE }));
        const ic = el('g', { transform: `translate(${f(px)} ${f(iy)})` });
        const icS = el('g', { transform: 'scale(0.01)' });
        icS.appendChild(signalIcon({ type: P.sign === '+' ? 'activating' : 'inhibitory', size: iconSize, stage }));
        ic.appendChild(icS);
        sg.append(bead, ic);
        layer.signals.appendChild(sg);
        P.S = { g: sg, icon: icS, bead, x: px, y0: 0, y1: iy };
      }
      // junction glow: the recognition ring (§4.5) belongs to antigen recognition only (TCR–MHC,
      // CAR–antigen). Brake and co-stimulation pairs (PD-1/PD-L1, CD28/B7, CTLA-4/B7) read by their
      // interlocked heads and their "+" / "−" disc (§4.7, §4.8), never by a ring.
      if (s.kind === 'tcr-mhc' || s.kind === 'car-antigen') {
        const jy = 0;
        const jg = el('g', { 'data-part': 'junction', transform: `translate(${f(px)} ${f(jy)})`, opacity: 0 });
        const r0 = size * 0.16;
        jg.appendChild(el('circle', { r: f(r0 * 1.7), fill: ART.dotGlow ? ART.dotGlow(s.kind === 'tcr-mhc' ? topColor : P.sign === '-' ? PALETTE.inhibitory : PALETTE.activating, light ? 0.3 : 0.55) : topColor }));
        const ring = el('circle', { r: f(r0), fill: 'none', stroke: light ? topColor : mix(topColor, WHITE, 0.3), 'stroke-width': f(clamp(size * 0.035, 1, 2.2)) });
        jg.appendChild(ring);
        jg.appendChild(el('circle', { r: f(r0 * 0.28), fill: WHITE, 'fill-opacity': 0.9 }));
        layer.fx.appendChild(jg);
        P.J = { g: jg, ring, r0 };
      }
      (pairs[s.kind] ||= []).push(P);
      all.push(P);
      writePose(P, 0, 0);
    }
  }

  // ---------- rendering of a pair's state: e = 0 apart … 1 engaged; d = display (bottom)
  function writePose(P, e, c = 0) {
    const offT = lerp(P.apartOff, P.engagedOff, e);
    const tilt = P.tilt * (1 - e);
    // c 0..1: a drug sits on one partner; the other is pushed aside (side/dir fixed when cap() is built)
    const capT = P.plan.capSide === 'top' ? 0 : c, capB = P.plan.capSide === 'top' ? c : 0;
    const push = -P.plan.capDir * 26;
    P.T.pose.setAttribute('transform', `translate(${f(P.x)} ${f(topY + offT - capT * size * 0.16)}) rotate(${f(180 + tilt * 0.6 * (1 - c) - capT * push)})`);
    P.B.pose.setAttribute('transform', `translate(${f(P.x)} ${f(bottomY - offT + capB * size * 0.16)}) rotate(${f(-tilt * (1 - c) + capB * push)})`);
    if (P.C) P.C.pose.setAttribute('transform', `translate(${f(P.C.x)} ${f(topY)}) rotate(${f(lerp(P.C.apartRot, P.C.engagedRot, e))})`);
    if (P.S) P.S.g.setAttribute('opacity', f(E.out(seg(e, 0.55, 1))));
    if (P.S) P.S.icon.setAttribute('transform', `scale(${f(Math.max(0.01, E.back(seg(e, 0.55, 1))))})`);
    if (P.J) P.J.g.setAttribute('opacity', f(e < 0.6 ? 0 : E.out(seg(e, 0.6, 1)) * 0.85));
  }
  function writeDisplay(P, d) {
    P.B.disp.setAttribute('transform', `translate(0 ${f((1 - d) * size * 0.7)})`);
    P.B.disp.setAttribute('opacity', f(E.inOut(d)));
  }
  all.forEach((P) => writeDisplay(P, 1));

  const pick = (kind, which) => (kind ? pairs[kind] || [] : all).filter((P) => (which ? which(P) : true));

  // ---------- engage
  function engage(kind, on = true, { tl, pos, duration = 1, stagger = 0.12, which } = {}) {
    return timed(tl, pos, (sub) => {
      const list = pick(kind, which);
      const moves = [];
      list.forEach((P) => {
        const target = on && !P.plan.capped && (P.kind !== 'tcr-mhc' || (P.matched && P.plan.shown > 0.5)) ? 1 : 0;
        if (target === P.plan.e) return;
        moves.push({ P, from: P.plan.e, to: target, ck: P.plan.capK });
        P.plan.e = target;
      });
      if (!moves.length) { sub.to({}, { duration: 0.001 }); return {}; }
      const dur = duration + stagger * (moves.length - 1);
      drive(sub, (p) => {
        moves.forEach((m, k) => {
          const t0 = (stagger * k) / dur, t1 = (stagger * k + duration) / dur;
          const q = E.inOut(seg(p, t0, t1));
          const e = lerp(m.from, m.to, q);
          writePose(m.P, e, m.ck);
          if (m.P.J && m.to === 1) {   // a recognition swell as the heads meet (never a flash)
            const k2 = seg(q, 0.55, 1);
            m.P.J.ring.setAttribute('r', f(m.P.J.r0 * (1 + 0.8 * Math.sin(Math.PI * k2))));
          }
        });
      }, { duration: dur });
      return {};
    });
  }

  // ---------- display (MHC shop windows)
  function setDisplay(on, { tl, pos, duration = 0.9 } = {}) {
    return timed(tl, pos, (sub) => {
      const list = pick('tcr-mhc');
      const d1 = on ? 1 : 0;
      const off = !on ? list.filter((P) => P.plan.e > 0) : [];
      if (!on && off.length) {
        const from = off.map((P) => P.plan.e), cks = off.map((P) => P.plan.capK);
        drive(sub, (p) => off.forEach((P, k) => writePose(P, lerp(from[k], 0, E.inOut(p)), cks[k])), { duration: duration * 0.6, pos: 0 });
        off.forEach((P) => { P.plan.e = 0; });
      }
      const from = list.map((P) => P.plan.shown);
      drive(sub, (p) => list.forEach((P, k) => writeDisplay(P, lerp(from[k], d1, E.inOut(p)))), { duration, pos: !on && off.length ? duration * 0.35 : 0 });
      list.forEach((P) => { P.plan.shown = d1; });
      return {};
    });
  }

  // ---------- drug caps
  function headPoint(P, side) {
    // head of the capped glyph: upright, apart
    if (side === 'top') return { x: P.x, y: topY + P.apartOff + headY(P.topName) * size, out: 90 };
    return { x: P.x, y: bottomY - P.apartOff - headY(P.bottomName) * size, out: -90 };
  }
  // `tilt` (degrees): the docked antibody is swung about its capping tip (the tip stays on the head)
  // so its free arm clears the pushed-aside partner; with the main axis exactly parallel to the
  // membranes the free arm pointed at the partner and one antibody read as gripping both.
  function cap(kind, side = 'top', abOpts = {}, { tl, pos, duration = 1.6, stagger = 0.2, which, tilt = 15 } = {}) {
    const list = pick(kind, which);
    const abs = [];
    timed(tl, pos, (sub) => {
      const u = abOpts.size ?? size * 0.72;
      const tips = ART.antibodyTips ? ART.antibodyTips(u) : { right: [0.41 * u, -0.95 * u], left: [-0.41 * u, -0.95 * u] };
      list.forEach((P, k) => {
        const from = P.plan.e;
        const c0 = P.plan.capK || 0;
        const dir = k % 2 ? -1 : 1;               // which side the antibody body lies on
        P.plan.capped = true;
        P.plan.capSide = side;
        P.plan.capDir = dir;
        P.plan.capK = 1;
        P.plan.e = 0;
        const H = headPoint(P, side);
        // main axis (Fc → hinge) parallel to the membranes, pointing back toward the head
        const main = dir > 0 ? 180 : 0;
        const into = H.out + 180;                  // direction into the head
        const cand = [{ arm: 'right', a: main + 36 }, { arm: 'left', a: main - 36 }];
        const best = cand.reduce((b, q) => (Math.cos((q.a - into) * DEG) > Math.cos((b.a - into) * DEG) ? q : b));
        const tip = tips[best.arm];
        const psi = main + 90;
        const cs = Math.cos(psi * DEG), sn = Math.sin(psi * DEG);
        const end = { x: H.x - (cs * tip[0] - sn * tip[1]), y: H.y - (sn * tip[0] + cs * tip[1]), r: psi };
        const start = { x: end.x + dir * size * 1.5, y: end.y + (side === 'top' ? 1 : -1) * size * 0.15, r: psi + dir * 35 };
        const wrap = el('g', { 'data-part': 'drug', opacity: 0, transform: `translate(${f(start.x)} ${f(start.y)}) rotate(${f(start.r)})` });
        const abArt = antibody({ variant: 'therapeutic', size: u, stage, ...abOpts });
        if (tilt) {
          const sgn = (side === 'top' ? 1 : -1) * (dir > 0 ? -1 : 1);   // away from the partner
          abArt.setAttribute('transform', `rotate(${f(sgn * tilt)} ${f(tip[0])} ${f(tip[1])})`);
        }
        wrap.appendChild(abArt);
        layer.drugs.appendChild(wrap);
        abs.push(wrap);
        drive(sub, (p) => {
          const q = E.out(p);
          wrap.setAttribute('transform', `translate(${f(lerp(start.x, end.x, q))} ${f(lerp(start.y, end.y, q))}) rotate(${f(lerp(start.r, end.r, q))})`);
          wrap.setAttribute('opacity', f(E.out(seg(p, 0, 0.3))));
          writePose(P, lerp(from, 0, E.inOut(seg(p, 0, 0.6))), lerp(c0, 1, E.inOut(seg(p, 0.1, 0.7))));
        }, { duration, pos: k * stagger });
        P.plan.capK = 1;
      });
      return {};
    });
    return abs;
  }

  // ---------- ambient life: bonds release and re-form every life[0]–life[1] s
  const ambient = [];
  if (ctx && !reducedMotion()) {
    all.forEach((P, k) => {
      const r = prng(seed * 31 + k * 7);
      const hold = r.range(life[0], life[1]);
      const tw = gsap.timeline({ repeat: -1, repeatDelay: hold, delay: r.range(0, life[1]) });
      P.T.life.setAttribute('data-ambient', '');
      P.B.life.setAttribute('data-ambient', '');
      tw.to(P.T.life, { attr: { transform: `translate(0 ${f(-size * 0.05)}) rotate(${f(r.range(-3, 3))})` }, duration: 0.45, ease: 'sine.inOut' })
        .to(P.B.life, { attr: { transform: `translate(0 ${f(size * 0.05)}) rotate(${f(r.range(-3, 3))})` }, duration: 0.45, ease: 'sine.inOut' }, '<')
        .to([P.T.life, P.B.life], { attr: { transform: 'translate(0 0) rotate(0)' }, duration: 0.6, ease: 'sine.inOut' });
      ambient.push(ctx.ambient(tw));
    });
  }

  // ---------- pulses (ambient, visible on engaged pairs only)
  let pulseTl = null;
  function pulses(on = true, { kinds: only, every = 1.4 } = {}) {
    if (pulseTl) { pulseTl.kill(); pulseTl = null; }
    const list = all.filter((P) => P.S && (!only || only.includes(P.kind)));
    list.forEach((P) => { P.S.bead.style.opacity = '0'; P.S.bead.setAttribute('data-ambient', ''); });
    if (!on || !list.length || reducedMotion()) return null;
    const tlp = gsap.timeline({ repeat: -1 });
    list.forEach((P, k) => {
      const t0 = (k * 0.37) % every;
      const proxy = { p: 0 };
      tlp.fromTo(proxy, { p: 0 }, {
        p: 1, duration: every * 0.8, ease: 'none',
        onUpdate: () => {
          const q = proxy.p;
          P.S.bead.setAttribute('transform', `translate(${f(P.x)} ${f(lerp(-size * 0.1, P.S.y1, E.inOut(q)))})`);
          P.S.bead.style.opacity = f(Math.min(seg(q, 0, 0.2), 1 - seg(q, 0.75, 1)));
        },
      }, t0);
    });
    tlp.to({}, { duration: every }, 0);
    pulseTl = ctx ? ctx.ambient(tlp) : tlp;
    return pulseTl;
  }

  // ---------- lens-scale delivery: granule → perforin pores → granzymes
  const delivery = { granule: null, pores: [], granzymes: [], rods: [] };
  // Perforin in three beats (lens scale): single molecules LATCH onto the target membrane surface,
  // GATHER into a ring (side view: a tight row of staves on the surface), then PLUNGE through the
  // bilayer to open a pore. Never darts or bullets.
  const PHASE = { glide: [0, 0.22], fuse: [0.22, 0.36], latch: [0.32, 0.56], gather: [0.58, 0.76], plunge: [0.8, 0.94] };
  function deliver({ tl, pos, x: gx = 0, pores: poreXs = [-18, 18], granzymes: nGz = 5, perPore = 5, duration = 3.6 } = {}) {
    const res = timed(tl, pos, (sub) => {
      const gr = size * 0.42;
      const y0 = topY - thickness - gr - size * 0.95, y1 = topY - thickness - gr * 0.72;
      const gG = el('g', { 'data-part': 'granule', opacity: 0, transform: `translate(${f(gx)} ${f(y0)})` });
      const shell = el('circle', { r: f(gr), fill: light ? mix(topColor, WHITE, 0.55) : mix(topColor, '#0B1024', 0.62), stroke: light ? mix(topColor, '#1B1F2A', 0.3) : mix(topColor, WHITE, 0.45), 'stroke-width': f(clamp(size * 0.04, 1, 2)) });
      gG.appendChild(shell);
      layer.delivery.appendChild(gG);
      const rnd2 = prng(seed * 53 + 5);
      const hw = thickness * 0.8;                   // pore half-width (pores are ~3× wider than the bilayer is thick)
      const rodLen = thickness * 0.95, rodW = clamp(size * 0.065, 1.8, 3.2);
      const pc = mix(topColor, WHITE, light ? 0.1 : 0.5);
      const rods = [];
      poreXs.forEach((px, k) => {
        for (let j = 0; j < perPore; j++) {
          const i = rods.length;
          const a = (i / (poreXs.length * perPore)) * Math.PI * 2 + rnd2.range(-0.3, 0.3), rr = gr * rnd2.range(0.22, 0.62);
          const rg = el('g', { 'data-part': 'perforin', opacity: 0 });
          rg.appendChild(el('path', { d: `M0 ${f(-rodLen / 2)}L0 ${f(rodLen / 2)}`, stroke: pc, 'stroke-width': f(rodW), 'stroke-linecap': 'round' }));
          layer.delivery.appendChild(rg);
          const latchX = px + rnd2.range(-1, 1) * size * 0.75;
          const rowX = px + lerp(-hw + rodW, hw - rodW, perPore > 1 ? j / (perPore - 1) : 0.5);
          rods.push({ g: rg, a, rr, rot: rnd2.range(0, 180), k, j, latchX, rowX, d: (j * 0.018) + k * 0.03 });
        }
      });
      const gzs = [];
      for (let i = 0; i < nGz; i++) {
        const a = (i / nGz) * Math.PI * 2 + 0.5 + rnd2.range(-0.3, 0.3), rr = gr * rnd2.range(0.2, 0.58);
        const gz = el('g', { opacity: 0, transform: `translate(${f(gx + Math.cos(a) * rr)} ${f(y0 + Math.sin(a) * rr)})` });
        gz.appendChild(granzyme({ size: clamp(size * 0.25, 6, 15), stage, rotation: rnd2.range(-60, 60) }));
        if (i % 2 === 0) { const sc = scissors(clamp(size * 0.22, 7, 12), light ? '#1B1F2A' : WHITE); sc.setAttribute('transform', `translate(${f(size * 0.19)} ${f(-size * 0.16)})`); gz.appendChild(sc); }
        layer.delivery.appendChild(gz);
        const cx = gx + lerp(-1, 1, nGz > 1 ? i / (nGz - 1) : 0.5) * size * 0.8 + rnd2.range(-3, 3);
        const cy = rnd2.range(-0.28, -0.02) * gap;
        gzs.push({ g: gz, a, rr, cleft: { x: cx, y: cy }, pore: i % poreXs.length });
      }
      const poreEls = poreXs.map((px) => {
        const pg = el('g', { 'data-part': 'pore', opacity: 0, transform: `translate(${f(px)} ${f(bottomY + thickness / 2)})` });
        const hole = el('rect', { x: f(-hw), y: f(-thickness / 2 - 0.5), width: f(hw * 2), height: f(thickness + 1), fill: light ? '#FFFFFF' : '#0B1024', 'fill-opacity': 0.92 });
        const Tp = tones(mix(topColor, WHITE, light ? 0.1 : 0.42), stage);
        const pfS = el('g', { transform: 'scale(1 0.01)' });
        for (const sd of [-1, 1]) {
          for (let j = 0; j < 3; j++) {
            const yy = -thickness * 0.75 + j * thickness * 0.5;
            pfS.appendChild(el('rect', { x: f(sd * hw - (sd < 0 ? thickness * 0.34 : 0)), y: f(yy), width: f(thickness * 0.34), height: f(thickness * 0.48), rx: f(thickness * 0.1), fill: Tp.fill, stroke: Tp.stroke, 'stroke-width': f(clamp(size * 0.03, 0.6, 1.4)) }));
          }
        }
        pg.append(hole, pfS);
        layer.pores.appendChild(pg);
        const patch = el('rect', { x: f(-hw - 2), y: f(-thickness / 2), width: f(hw * 2 + 4), height: f(thickness), rx: f(thickness * 0.3), fill: light ? mix(botColor, WHITE, 0.5) : mix(botColor, WHITE, 0.4), opacity: 0 });
        pg.appendChild(patch);
        return { g: pg, hole, pf: pfS, patch, x: px, hw };
      });
      Object.assign(delivery, { granule: gG, pores: poreEls, granzymes: gzs, rods, gx, y0, y1 });
      const surf = bottomY - rodW * 0.7;            // lying flat on the outer surface
      drive(sub, (p) => {
        const a = E.inOut(seg(p, ...PHASE.glide));
        const gy = lerp(y0, y1, a);
        const fuse = seg(p, ...PHASE.fuse);
        gG.setAttribute('transform', `translate(${f(gx)} ${f(gy + fuse * gr * 0.5)}) scale(${f(1 + fuse * 0.25)} ${f(1 - fuse * 0.7)})`);
        gG.setAttribute('opacity', f(Math.min(E.out(seg(p, 0, 0.08)), 1 - E.in(fuse))));
        for (const r of rods) {
          const inG = { x: gx + Math.cos(r.a) * r.rr, y: gy + Math.sin(r.a) * r.rr };
          const l = E.inOut(seg(p, PHASE.latch[0] + r.d, PHASE.latch[1] + r.d * 0.5));     // across the cleft, latch on flat
          const g2 = E.inOut(seg(p, PHASE.gather[0] + r.j * 0.012, PHASE.gather[1]));      // slide together, stand up
          const pl = E.inOut(seg(p, PHASE.plunge[0], PHASE.plunge[1]));                     // plunge through the bilayer
          let x = lerp(inG.x, r.latchX, l), y = lerp(inG.y, surf, l);
          let rot = lerp(r.rot, 90, l);
          x = lerp(x, r.rowX, g2);
          y = lerp(y, bottomY - rodLen / 2 - 0.5, g2);
          rot = lerp(rot, 0, g2);
          y = lerp(y, bottomY + thickness / 2, pl);
          r.g.setAttribute('transform', `translate(${f(x)} ${f(y)}) rotate(${f(rot)})`);
          r.g.setAttribute('opacity', f(Math.min(E.out(seg(p, 0, 0.08)), 1 - seg(p, 0.9, 0.99))));
        }
        for (const g of gzs) {
          const inG = { x: gx + Math.cos(g.a) * g.rr, y: gy + Math.sin(g.a) * g.rr };
          const q = E.out(seg(p, 0.34, 0.7));
          g.g.setAttribute('transform', `translate(${f(lerp(inG.x, g.cleft.x, q))} ${f(lerp(inG.y, g.cleft.y, q))})`);
          g.g.setAttribute('opacity', f(E.out(seg(p, 0, 0.08))));
        }
        poreEls.forEach((pe) => {
          const q = E.out(seg(p, PHASE.plunge[0] + 0.04, PHASE.plunge[1] + 0.05));
          pe.g.setAttribute('opacity', f(q));
          pe.pf.setAttribute('transform', `scale(1 ${f(Math.max(0.01, q))})`);
        });
      }, { duration });
      return { granule: gG, pores: poreEls.map((q) => q.g), granzymes: gzs.map((g) => g.g) };
    });
    if (tl) {
      const at = (fr) => res.start + duration * fr;
      res.marks = { fused: at(PHASE.fuse[1]), latched: at(PHASE.latch[1]), ring: at(PHASE.gather[1]), open: at(PHASE.plunge[1]) };
    }
    return res;
  }

  function admit({ tl, pos, duration = 2.4 } = {}) {
    return timed(tl, pos, (sub) => {
      const { granzymes: gzs, pores: poreEls } = delivery;
      if (!gzs.length) { sub.to({}, { duration: 0.001 }); return {}; }
      const rnd3 = prng(seed * 71 + 3);
      gzs.forEach((g) => { g.inside = { x: poreEls[g.pore].x + rnd3.range(-1, 1) * size * 0.55, y: bottomY + thickness + size * rnd3.range(0.35, 0.95) }; });
      drive(sub, (p) => {
        gzs.forEach((g, k) => {
          const t0 = k * 0.1;
          const pe = poreEls[g.pore];
          const q1 = E.inOut(seg(p, t0, t0 + 0.4));            // to the pore mouth
          const q2 = E.inOut(seg(p, t0 + 0.38, t0 + 0.62));    // through the pore
          const q3 = E.out(seg(p, t0 + 0.6, t0 + 0.9));        // drift inside
          const mouth = { x: pe.x, y: bottomY - size * 0.12 };
          const below = { x: pe.x, y: bottomY + thickness + size * 0.14 };
          let x = lerp(g.cleft.x, mouth.x, q1), y = lerp(g.cleft.y, mouth.y, q1);
          x = lerp(x, below.x, q2); y = lerp(y, below.y, q2);
          x = lerp(x, g.inside.x, q3); y = lerp(y, g.inside.y, q3);
          g.g.setAttribute('transform', `translate(${f(x)} ${f(y)})`);
        });
      }, { duration });
      return {};
    });
  }

  function repair({ tl, pos, stagger = 0.5 } = {}) {
    return timed(tl, pos, (sub) => {
      const poreEls = delivery.pores;
      if (!poreEls.length) { sub.to({}, { duration: 0.001 }); return {}; }
      const D = 1 + stagger * (poreEls.length - 1);
      drive(sub, (p) => {
        poreEls.forEach((pe, k) => {
          const t = (k * stagger) / D;
          const q = E.inOut(seg(p, t, t + 1 / D));
          pe.pf.setAttribute('transform', `scale(1 ${f(Math.max(0.01, 1 - q))})`);
          pe.hole.setAttribute('fill-opacity', f(0.9 * (1 - q)));
          pe.patch.setAttribute('opacity', f(Math.sin(Math.PI * q) * 0.85 + (q >= 1 ? 0 : 0)));
        });
      }, { duration: D });
      return {};
    });
  }

  // ---------- coordinates for labels
  const toParent = (lx, ly) => {
    const c = Math.cos(rotate * DEG), s = Math.sin(rotate * DEG);
    return { x: x + c * lx - s * ly, y: y + s * lx + c * ly };
  };
  function point(kind, i = 0, where = 'junction') {
    const P = (pairs[kind] || [])[i];
    if (!P) return toParent(0, 0);
    if (where === 'top') return toParent(P.x, topY + P.engagedOff + headY(P.topName) * size * 0.45);
    if (where === 'bottom') return toParent(P.x, bottomY - P.engagedOff - headY(P.bottomName) * size * 0.45);
    if (where === 'coreceptor' && P.C) return toParent(lerp(P.C.x, P.C.tip.x, 0.55), lerp(topY, P.C.tip.y, 0.55));
    return toParent(P.x, 0);
  }

  return {
    el: root,
    info: { topY, bottomY, gap, size, width, thickness },
    pairs,
    engage, cap, setDisplay, pulses, deliver, admit, repair,
    point,
    local: toParent,
    get delivery() { return delivery; },
    destroy() { ambient.forEach((t) => t.kill()); pulseTl && pulseTl.kill(); root.remove(); },
  };
}
