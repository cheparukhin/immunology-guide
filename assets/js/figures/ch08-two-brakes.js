// ch08-two-brakes — "Two brakes, two places" (figure task F13, built with ch05-exhaustion).
//
// Where each drug mainly acts, and what the combination costs (FIGURE-AUDIT §2A):
//   left  LYMPH NODE — a mature dendritic cell primes four naive killer T cells (clone identity =
//         tcrKey notch, §4 rule 13); a regulatory T cell's CTLA-4 grips most of the B7, so only the
//         strong match gets CD28 "go" signal. Anti-CTLA-4 (gold, white outline: rule 9) caps CTLA-4,
//         freed B7 reaches the weak matchers, including one that sees a self peptide.
//   right TUMOR — PD-L1 on cancer cells engages PD-1 (rule 7); the ch05 cast (stem-like reserve,
//         terminally exhausted cells, shared marks from ./shared/exhaustion-marks.js). Anti-PD-1
//         caps PD-1 on T cells only; new clones arrive from the vessel and kill (cell-actions.kill).
//   step 5 replays both panels for the chosen drugs (toggles), with two shared activity meters.
//
// Stepper-safe: every motion is a cell-actions builder or an explicit fromTo on a timeline.
import {
  tCell, cancerCell, dendriticCell, lymphNodeField, tissueField, bloodVessel, mhc1, tcr, cd28, ctla4, b7, pd1, pdl1, cd25,
  antibody, keyChip, placeOnMembrane, cellInfo, DOCK_GAP, PALETTE, mix,
} from '../art/index.js';
import { rig, move, approach, recognize, kill, divide, dockAntibody, swap, drive } from './shared/cell-actions.js';
import { meter } from './shared/activity-meter.js';
import { brakeBadge, lockBadge, markLayout, MARK_CSS, NAMES } from './shared/exhaustion-marks.js';

const FIG = 'ch08-two-brakes';
const NS = 'http://www.w3.org/2000/svg';
const PW = 480;                 // one panel (user units); desktop = two panels side by side
const PH = 540;
const TOP_C = 30;               // compact: extra headroom so panel titles clear the stage tag
const DEG = Math.PI / 180;
const clamp01 = (v) => Math.max(0, Math.min(1, v));
const lerp = (a, b, t) => a + (b - a) * t;
const r2 = (v) => Math.round(v * 100) / 100;

// Molecule sizes chosen so every engaged pair spans the same membrane gap.
const GAP = 31;
const SZ = { tcr: GAP / DOCK_GAP['tcrKey-mhc1Key'], cd28: GAP / DOCK_GAP['cd28-b7'], ctla4: GAP / DOCK_GAP['ctla4-b7'], pd1: GAP / DOCK_GAP['pd1-pdl1'] };

// Clone keys (tcrKey notches): one per clone, matching epitopeKey on the peptide it fits.
const KEYS = { strong: 4, weak: 11, self: 23, none: 31, decoy: 17, a1: 36, a2: 8, a3: 42, stem: 27 };

// ------------------------------------------------------------------ geometry
/** First hit of the ray o + s·d (s > 0) with a closed polygon. */
function rayHit(pts, ox, oy, dx, dy) {
  let best = Infinity;
  for (let i = 0; i < pts.length; i++) {
    const [ax, ay] = pts[i], [bx, by] = pts[(i + 1) % pts.length];
    const ex = bx - ax, ey = by - ay;
    const den = dx * ey - dy * ex;
    if (Math.abs(den) < 1e-9) continue;
    const s = ((ax - ox) * ey - (ay - oy) * ex) / den;
    const t = ((ax - ox) * dy - (ay - oy) * dx) / den;
    if (s > 1e-6 && t >= 0 && t <= 1 && s < best) best = s;
  }
  return best === Infinity ? 0 : best;
}

/**
 * Contact between an anchor cell A (centre Ac, outline in its own frame) and a partner B docked
 * along angle theta (deg, from A toward B). pairs: [{ t, gap }] = tangent offsets of engaged glyph
 * pairs. Returns the partner centre and, per pair, the A-membrane point and the partner glyph base.
 */
function contactPlan(Aout, Ac, Bout, theta, pairs, lift = 0, fit = false) {
  const u = [Math.cos(theta * DEG), Math.sin(theta * DEG)], v = [-u[1], u[0]];
  const rows = pairs.map((p) => {
    const sA = rayHit(Aout, p.t * v[0], p.t * v[1], u[0], u[1]);
    const sB = rayHit(Bout, p.t * v[0], p.t * v[1], -u[0], -u[1]);
    return { ...p, sA, sB };
  });
  // fit: every pair spans its own membrane gap (glyphs sized to it), none embedded in a membrane
  const D = (fit ? Math.max(...rows.map((r) => r.sA + r.gap + r.sB)) : Math.min(...rows.map((r) => r.sA + r.gap + r.sB))) + lift;
  if (fit) rows.forEach((r) => { r.gap = D - r.sA - r.sB; });
  const C = [Ac[0] + u[0] * D, Ac[1] + u[1] * D];
  return {
    C, u, v, D,
    pairs: rows.map((r) => {
      const a = [Ac[0] + r.t * v[0] + r.sA * u[0], Ac[1] + r.t * v[1] + r.sA * u[1]];
      const b = [a[0] + u[0] * (r.gap + lift), a[1] + u[1] * (r.gap + lift)];
      return { ...r, a, b, bl: [b[0] - C[0], b[1] - C[1]], al: [a[0] - Ac[0], a[1] - Ac[1]] };
    }),
  };
}
const put = (glyph, [x, y], rot) => { glyph.setAttribute('transform', `translate(${r2(x)} ${r2(y)}) rotate(${r2(rot)})`); return glyph; };

const CSS = `
[data-figure="${FIG}"] svg .tb-title { font-family: var(--font-ui); }
[data-figure="${FIG}"] svg .tb-noev { pointer-events: none; }
[data-figure="${FIG}"] .tb-tabs { margin: 0 0 10px; }
[data-figure="${FIG}"] .tb-tabs[hidden], [data-figure="${FIG}"] .tb-free[hidden] { display: none; }
[data-figure="${FIG}"] .tb-free { display: flex; flex-direction: column; gap: 12px; width: 100%; }
[data-figure="${FIG}"] .tb-row { display: flex; flex-wrap: wrap; align-items: center; gap: 10px 22px; }
[data-figure="${FIG}"] .tb-meters { display: flex; flex-wrap: wrap; align-items: flex-end; gap: 14px 34px;
  --fg: var(--ink); --fg-2: var(--ink-2); --fg-3: var(--ink-3); --line: var(--rule); --halo: var(--surface); }
[data-figure="${FIG}"] .tb-meter { display: flex; flex-direction: column; gap: 2px; }
[data-figure="${FIG}"] .tb-meter__now { font: 600 14px/1.3 var(--font-ui); color: var(--fg, var(--ink)); }
[data-figure="${FIG}"] .tb-tag { font: 650 11px/1.3 var(--font-ui); letter-spacing: 0.08em; text-transform: uppercase; color: var(--fg-3, var(--ink-3)); }
${MARK_CSS(`[data-figure="${FIG}"]`)}
[data-figure="${FIG}"] .tb-legend { display: flex; flex-wrap: wrap; gap: 6px 16px; margin: var(--s-2) 0 0; padding: 0; list-style: none; font-family: var(--font-ui); font-size: var(--text-xs); color: var(--ink-2); }
[data-figure="${FIG}"] .tb-legend li { display: inline-flex; align-items: center; gap: 7px; }
[data-figure="${FIG}"] .tb-legend[hidden], [data-figure="${FIG}"] .tb-legend li[hidden] { display: none; }
[data-figure="${FIG}"] .tb-legend svg { width: 26px; height: 26px; flex-shrink: 0; border-radius: 7px; background: #0F1630; }
`;

const TIERS = {
  attack: ['Low', 'Moderate', 'Strong', 'Strongest'],
  risk: ['Low', 'Modest', 'Raised', 'Highest'],
};
const tierOf = (ctla, pd) => ({
  attack: ctla && pd ? 3 : pd ? 2 : ctla ? 1 : 0,
  risk: ctla && pd ? 3 : ctla ? 2 : pd ? 1 : 0,
});

export default function mount(fig, ctx) {
  const { gsap } = ctx;
  if (!document.getElementById('tb-style')) document.head.append(ctx.h('style', { id: 'tb-style', text: CSS }));
  ctx.setAspect(960 / PH, PW / (PH + TOP_C));
  const svg = ctx.createSVG({ viewBox: `0 0 960 ${PH}` });
  ctx.tag('Not to scale');

  const S = (tag, attrs = {}, parent) => {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) if (k !== 'text' && attrs[k] != null) e.setAttribute(k, String(attrs[k]));
    if (attrs.text != null) e.textContent = attrs.text;
    if (parent) parent.appendChild(e);
    return e;
  };
  const haloPaint = ctx.radialGradient(svg, [[0, PALETTE.cd8, 0.55], [0.55, PALETTE.cd8, 0.2], [1, PALETTE.cd8, 0]], { id: 'tb-halo' });
  const vesselGlow = ctx.radialGradient(svg, [[0, PALETTE.rbc, 0.25], [1, PALETTE.rbc, 0]], { id: 'tb-vglow' });

  let compact = ctx.compact;
  const drugs = { ctla4: true, pd1: true };      // step-5 toggles (default both ON)
  let tab = 'tumor';                             // compact step-5 view
  let el = null;
  let iconFixers = [];                           // end-anchored label icons, re-placed after text rescales

  // ---------------------------------------------------------------- small art helpers
  const label = (parent, text, [x, y], { anchor = 'start', cls = 't-label', leader, opacity = 0, icon } = {}) => {
    const g = S('g', { class: 'tb-noev', opacity }, parent);
    let endIcon = null;
    if (icon) {   // icon before the text (e.g. the padlock), as in ch05-exhaustion's callout
      const tw0 = [].concat(text)[0].length * 7.6;
      const ix = anchor === 'end' ? x - tw0 - 12 : x + 8;
      const ic = ctx.iconSVG(icon, { x: ix, y: y - 5, size: 15, color: '#E9ECF6' }, g);
      if (anchor !== 'end') x += 20;
      else endIcon = ic;   // re-placed below from the rendered text width (phones scale the text up)
    }
    if (leader) {
      const [ax, ay] = leader;
      const tw = [].concat(text)[0].length * 7.2;
      const lx = anchor === 'start' ? x + Math.min(tw / 2, 40) : anchor === 'end' ? x - Math.min(tw / 2, 40) : x;
      const nl = [].concat(text).length;   // a leader that leaves downward starts below the last line
      const ly = y + (ay > y ? 6 + (nl - 1) * 21 : -16);
      const dx = ax - lx, dy = ay - ly, len = Math.hypot(dx, dy);
      if (len > 14) {
        S('line', { class: 'leader', x1: r2(lx), y1: r2(ly), x2: r2(ax - (dx / len) * 4), y2: r2(ay - (dy / len) * 4) }, g);
        S('circle', { class: 'leader-dot', cx: r2(ax), cy: r2(ay), r: 2.3 }, g);
      }
    }
    const tx = S('text', { class: `${cls} t-halo${anchor === 'end' ? ' t-end' : anchor === 'middle' ? ' t-mid' : ''}`, x: r2(x), y: r2(y) }, g);
    [].concat(text).forEach((line, i) => S('tspan', { x: r2(x), dy: i ? '1.25em' : 0, text: line }, tx));
    if (endIcon) {
      const place = () => {
        let w = 0;
        try { w = tx.firstChild.getComputedTextLength(); } catch { /* not rendered yet */ }
        if (w > 0) endIcon.setAttribute('transform', `translate(${r2(x - w - 13 - 7.5)} ${r2(y - 5 - 7.5)}) scale(${15 / 24})`);
      };
      place();
      requestAnimationFrame(place);   // after the stage's text scale is applied (phones enlarge labels)
      iconFixers.push(place);
    }
    return g;
  };
  const show = (tl, node, at, d = 0.5, to = 1) => tl.fromTo(node, { attr: { opacity: Number(node.getAttribute('opacity') ?? 0) } }, { attr: { opacity: to }, duration: d, ease: 'power1.out' }, at);
  const fade = (tl, node, from, to, at, d = 0.5) => { if (node) tl.fromTo(node, { attr: { opacity: from } }, { attr: { opacity: to }, duration: d, ease: 'power1.inOut' }, at); };

  /** A T cell drawn without library receptors, so we control which glyph faces the contact. */
  function tArt({ r = 22, seed, key, state = 'resting', variant = 'cd8', decor = 6, avoid = 0, pd1s = 0 }) {
    const art = tCell({ variant, r, state, seed, tcrKey: key, receptors: false, stage: 'dark' });
    const rec = S('g', { 'data-part': 'receptors' }, art);
    const span = 300;   // decorative TCRs around the cell, leaving the contact side (avoid°) free
    const a0 = avoid + 30, a1 = avoid + 30 + span;
    if (decor) {
      const glyph = (o, i) => (variant === 'treg'
        ? (i % 3 === 0 ? tcr({ ...o, color: 'treg' }) : i % 3 === 1 ? ctla4({ ...o, icon: false }) : cd25(o))
        : pd1s && i % 2 ? pd1({ ...o, icon: false }) : tcr({ ...o, key, color: 'cd8' }));
      const list = placeOnMembrane({ outline: cellInfo(art).outline, parent: rec }, glyph,
        { count: decor, arcStart: a0, arcEnd: a1, size: variant === 'treg' ? 12 : 11, seed });
      list.forEach((g) => rec.appendChild(g));
    }
    return { art, rec };
  }

  // Same marks as ch05-exhaustion after its declutter (polish A5), explained once in the legend under
  // the stage: glow = function · dashed silver ring = TOX on (the exhausted family) · mint ring =
  // stem-like reserve (TCF1, also TOX on) · padlock = terminal (TCF1 lost) · ONE crimson "−" = the PD-1
  // brake, struck through when released. No text pills on the cells.
  function marksFor(R, layer, { stem = false, lock = false, badges = 1 } = {}) {
    const ML = markLayout(R);
    const g = S('g', { class: 'tb-noev' }, layer);
    if (stem) S('circle', { r: R + 6, fill: 'none', stroke: '#8FE3B0', 'stroke-width': 2.4 }, g);
    else S('circle', { r: R + 6, fill: 'none', stroke: '#C9D3E8', 'stroke-width': 1.7, 'stroke-dasharray': '3.2 3.6', 'stroke-linecap': 'round' }, g);
    const bs = badges ? [ML.badges[1]].map(([x, y]) => { const b = brakeBadge({ x, y, size: 12.5 }); g.append(b); return b; }) : [];
    if (lock) g.append(lockBadge(ctx, { x: ML.lock[0], y: ML.lock[1], r: 9 }));
    return { g, badges: bs };
  }
  const struck = (tl, badges, at, d = 0.6) => badges.forEach((b) => tl.fromTo(b.struck, { attr: { opacity: 0 } }, { attr: { opacity: 1 }, duration: d }, at));

  // ---------------------------------------------------------------- LYMPH NODE panel
  function buildLN(parent, { combo = false } = {}) {
    const P = { kind: 'ln', combo };
    const g = S('g', {}, parent);
    P.g = g;
    g.append(lymphNodeField({ width: PW - 12, height: PH - 48, x: 6, y: 42, seed: 7, stage: 'dark', follicles: 3, density: 0.7 }));
    S('text', { class: 't-caps tb-title', x: 16, y: 26, text: 'Lymph node — where T cells are primed' }, g);
    const cells = S('g', {}, g);
    const fx = S('g', {}, g);
    const labels = S('g', {}, g);
    P.cells = cells; P.fx = fx; P.labels = labels;

    const DCC = [206, 300];
    const dcArt = dendriticCell({ state: 'mature', r: 158, seed: 60, receptors: false, stage: 'dark' });
    const dcG = S('g', { transform: `translate(${DCC[0]} ${DCC[1]})` }, cells);
    dcG.append(dcArt);
    const dcOut = cellInfo(dcArt).outline;
    const dcGlyphs = S('g', {}, dcG);
    P.dcG = dcG; P.dcGlyphs = dcGlyphs; P.DCC = DCC;

    // the four naive killer T cells + the Treg
    const specs = [
      { id: 'strong', theta: 143, key: KEYS.strong, peptide: 'neo', b7: true, seed: 21 },
      { id: 'weak', theta: 240, key: KEYS.weak, peptide: 'neo', b7: false, seed: 22 },
      { id: 'self', theta: 353, key: KEYS.self, peptide: 'self', b7: false, seed: 23 },
      { id: 'none', theta: 93, key: KEYS.none, peptide: 'neo', pepKey: KEYS.decoy, b7: false, seed: 24, lift: 5 },
    ];
    P.t = {};
    for (const sp of specs) {
      const { art, rec } = tArt({ r: 26, seed: sp.seed, key: sp.key, decor: 5, avoid: sp.theta + 180 });
      const pl = contactPlan(dcOut, DCC, cellInfo(art).outline, sp.theta, [{ t: -10, gap: GAP }, { t: 10, gap: GAP }], sp.lift || 0);
      const [pt, pc] = pl.pairs;
      // dendritic-cell side: MHC-I cup with the (keyed) peptide, and B7 when present
      const mhc = put(mhc1({ size: SZ.tcr, peptide: sp.peptide, key: sp.pepKey ?? sp.key, keySize: SZ.tcr, stage: 'dark' }), pt.al, sp.theta + 90);
      dcGlyphs.append(mhc);
      if (sp.id === 'self') {   // the "self" tag sits on the sand peptide
        const tg = S('g', { class: 'tb-noev' }, dcGlyphs);
        const tx = pt.al[0] + pl.u[0] * 12 + pl.v[0] * 40, ty = pt.al[1] + pl.u[1] * 12 + pl.v[1] * 40;
        S('rect', { x: r2(tx - 17), y: r2(ty - 9), width: 34, height: 17, rx: 8.5, fill: 'rgb(11 16 36 / 0.86)', stroke: PALETTE.healthy, 'stroke-opacity': 0.8 }, tg);
        S('text', { class: 'ex-tag', x: r2(tx), y: r2(ty + 4), 'text-anchor': 'middle', text: 'self', style: `fill: ${PALETTE.healthy}` }, tg);
      }
      let b7g = null;
      if (sp.b7) { b7g = put(b7({ size: SZ.cd28, stage: 'dark' }), pc.al, sp.theta + 90); dcGlyphs.append(b7g); }
      // T-cell side: the keyed TCR and one CD28 (its "+" shows only when it meets B7)
      const tc = put(tcr({ size: SZ.tcr, key: sp.key, color: 'cd8', stage: 'dark' }), pt.bl, sp.theta - 90);
      const c28 = put(cd28({ size: SZ.cd28, stage: 'dark' }), pc.bl, sp.theta - 90);
      const plus = c28.querySelector('[data-part="icon-plus"]');
      if (plus) plus.setAttribute('opacity', sp.b7 ? '0' : '0');
      rec.append(tc, c28);
      if (sp.id === 'self') {    // dashed outline marks the self-reactive clone (kept by its copies)
        art.append(S('circle', { r: 35, fill: 'none', stroke: PALETTE.healthy, 'stroke-width': 1.4, 'stroke-dasharray': '4 4', opacity: 0.85 }));
      }
      art.setAttribute('opacity', '0.5');
      const R = rig(art, { x: pl.C[0], y: pl.C[1], parent: cells, tcrKey: sp.key, seed: sp.seed });
      R.r = 26;
      const halo = S('circle', { r: 54, fill: haloPaint, opacity: 0 }, R.layers.under);
      P.t[sp.id] = { ...sp, R, art, mhc, b7: b7g, tcr: tc, cd28: c28, plus, plan: pl, halo };
    }

    // regulatory T cell, CTLA-4 gripping B7
    {
      const theta = 300;
      const { art, rec } = tArt({ r: 28, seed: 30, variant: 'treg', decor: 9, avoid: theta + 180 });
      const pairs = [-16, -5.5, 5.5, 16].map((t) => ({ t, gap: GAP }));
      const pl = contactPlan(dcOut, DCC, cellInfo(art).outline, theta, pairs, 0, true);
      const sz = (p) => p.gap / DOCK_GAP['ctla4-b7'];
      const b7s = pl.pairs.map((p) => { const b = put(b7({ size: sz(p), stage: 'dark' }), p.al, theta + 90); dcGlyphs.append(b); return { g: b, al: p.al, rot: theta + 90 }; });
      const c4s = pl.pairs.map((p) => { const c = put(ctla4({ size: sz(p), stage: 'dark' }), p.bl, theta - 90); rec.append(c); return c; });
      const R = rig(art, { x: pl.C[0], y: pl.C[1], parent: cells, seed: 30 });
      P.treg = { R, art, b7s, ctla4s: c4s, plan: pl, theta };
    }
    // one more B7 elsewhere on the dendritic cell (6 in all: most are held by the Treg)
    for (const th of [193]) {
      const s = rayHit(dcOut, 0, 0, Math.cos(th * DEG), Math.sin(th * DEG));
      dcGlyphs.append(put(b7({ size: SZ.cd28, stage: 'dark' }), [Math.cos(th * DEG) * s, Math.sin(th * DEG) * s], th + 90));
    }
    // where freed B7 must land: the CD28 partner points of the weak and self contacts
    P.b7Targets = {
      weak: { al: P.t.weak.plan.pairs[1].al, rot: P.t.weak.theta + 90 },
      self: { al: P.t.self.plan.pairs[1].al, rot: P.t.self.theta + 90 },
    };
    P.dcOut = dcOut;

    // exit arrow + tray of clone keys that have left
    const EX = [452, 300];
    P.EX = EX;
    const exit = S('g', { class: 'tb-noev' }, g);
    S('path', { d: `M${EX[0] - 18} ${EX[1] - 16} L${EX[0]} ${EX[1]} L${EX[0] - 18} ${EX[1] + 16}`, fill: 'none', stroke: 'rgb(233 236 246 / 0.75)', 'stroke-width': 2.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, exit);
    S('text', { class: 't-caps t-end', x: EX[0] + 4, y: EX[1] - 28, text: 'Exit' }, exit);
    P.tray = S('g', { class: 'tb-noev' }, g);
    P.trayLabel = S('text', { class: 't-caps t-end', x: EX[0] + 14, y: EX[1] + 172, text: 'Clones sent out', opacity: 0 }, P.tray);
    P.trayN = 0;

    // labels
    const t = P.t;
    P.lab = {
      dc: label(labels, 'Dendritic cell', [20, 510], { leader: [DCC[0] - 30, DCC[1] + 36] }),
      treg: label(labels, 'Regulatory T cell', [P.treg.plan.C[0] + 60, P.treg.plan.C[1] - 70], { anchor: 'middle', leader: [P.treg.plan.C[0] + 14, P.treg.plan.C[1] - 26] }),
      strong: label(labels, 'strong match', [t.strong.plan.C[0] - 2, t.strong.plan.C[1] + 62], { anchor: 'middle', cls: 't-small' }),
      weak: label(labels, 'weak match', [t.weak.plan.C[0] + 6, t.weak.plan.C[1] - 50], { anchor: 'middle', cls: 't-small' }),
      self: label(labels, 'weak match', [t.self.plan.C[0] - 6, t.self.plan.C[1] + 62], { anchor: 'middle', cls: 't-small' }),
      none: label(labels, 'no match', [t.none.plan.C[0] + 8, t.none.plan.C[1] + 62], { anchor: 'middle', cls: 't-small' }),
    };
    return P;
  }

  /** Step-1 grammar: only the strong match gets enough "go"; it brightens and copies itself. */
  function lnPrime(tl, P, { at = 0, k = 1 } = {}) {
    const s = P.t.strong;
    for (const key of ['dc', 'treg', 'strong', 'weak', 'self', 'none']) fade(tl, P.lab[key], 0, 1, at + 0.1 * k, 0.6);
    recognize(tl, s.R, s.mhc, { pos: at + 0.6 * k, duration: 1.4 * k, badge: true, hold: false });
    fade(tl, s.plus, 0, 1, at + 0.9 * k, 0.5);
    tl.fromTo(s.art, { attr: { opacity: 0.5 } }, { attr: { opacity: 1 }, duration: 0.8 * k }, at + 1.2 * k);
    fade(tl, s.halo, 0, 0.9, at + 1.2 * k, 0.8 * k);
    fade(tl, s.halo, 0.9, 0, at + 2.3 * k, 0.4);
    fade(tl, P.lab.strong, 1, 0, at + 2.1 * k, 0.4);
    const kids = divide(tl, s.R, 3, { angle: 0, spread: 34, duration: 1.6 * k, pos: at + 2.3 * k });
    leave(tl, P, kids, s.key, at + 3.9 * k, k);
    return at + 6 * k;
  }

  /** Copies drift to the exit arrow and leave; one key chip per copy joins the tray. */
  function leave(tl, P, kids, key, at, k = 1, { dashed = false } = {}) {
    kids.forEach((d, i) => {
      const [ex, ey] = P.EX;
      move(tl, d, { x: ex - 30, y: ey - 30 + i * 30, duration: 1.6 * k, pos: at + i * 0.18 * k });
      move(tl, d, { x: ex + 44, y: ey - 30 + i * 30, opacity: 0, duration: 0.9 * k, pos: at + 1.7 * k + i * 0.18 * k });
      const n = P.trayN++;
      const chip = S('g', { opacity: 0, transform: `translate(${P.EX[0] - 2 - (n % 2) * 24} ${P.EX[1] + 64 + Math.floor(n / 2) * 24})` }, P.tray);
      chip.append(keyChip({ key, size: 18, color: 'cd8', stage: 'dark' }));
      if (dashed) S('circle', { r: 12, fill: 'none', stroke: PALETTE.healthy, 'stroke-width': 1.2, 'stroke-dasharray': '2.5 2.5' }, chip);
      if (n === 0) fade(tl, P.trayLabel, 0, 1, at + 2.2 * k, 0.4);
      fade(tl, chip, 0, 1, at + 2.2 * k + i * 0.18 * k, 0.4);
    });
  }

  /** Step-2 grammar: anti-CTLA-4 caps CTLA-4; freed B7 lets the weak matchers switch on too. */
  function lnCTLA4(tl, P, { at = 0, k = 1 } = {}) {
    const T = P.treg;
    const back = 26;
    move(tl, T.R, { x: T.plan.C[0] + T.plan.u[0] * back, y: T.plan.C[1] + T.plan.u[1] * back, duration: 1.1 * k, pos: at });
    T.ctla4s.forEach((c, i) => {
      const ab = antibody({ variant: 'therapeutic', size: 19, stage: 'dark' });
      P.fx.append(ab);
      dockAntibody(tl, ab, c, { pos: at + (1.0 + i * 0.22) * k, duration: 1.2 * k });
    });
    // two freed B7 glide over the dendritic cell's surface to the weak matchers' contacts
    ['weak', 'self'].forEach((id, i) => {
      const from = T.b7s[id === 'weak' ? 0 : 3], to = P.b7Targets[id];
      const a0 = Math.atan2(from.al[1], from.al[0]), a1raw = Math.atan2(to.al[1], to.al[0]);
      let a1 = a1raw; while (a1 - a0 > Math.PI) a1 -= 2 * Math.PI; while (a1 - a0 < -Math.PI) a1 += 2 * Math.PI;
      const arc = (a) => { const s = rayHit(P.dcOut, 0, 0, Math.cos(a), Math.sin(a)); return [Math.cos(a) * s, Math.sin(a) * s]; };
      const e0 = arc(a0), e1 = arc(a1);
      const c0 = [from.al[0] - e0[0], from.al[1] - e0[1]], c1 = [to.al[0] - e1[0], to.al[1] - e1[1]];
      let r1 = to.rot; while (r1 - from.rot > 180) r1 -= 360; while (r1 - from.rot < -180) r1 += 360;
      const ez = gsap.parseEase('so.inOut');
      drive(tl, (p) => {
        const q = ez(p);
        const b = arc(lerp(a0, a1, q));
        from.g.setAttribute('transform', `translate(${r2(b[0] + lerp(c0[0], c1[0], q))} ${r2(b[1] + lerp(c0[1], c1[1], q))}) rotate(${r2(lerp(from.rot, r1, q))})`);
      }, { duration: 1.8 * k, pos: at + (1.6 + i * 0.3) * k });
    });
    // weak matchers: CD28 meets B7 (+), recognition, brighten, copy, leave
    ['weak', 'self'].forEach((id, i) => {
      const c = P.t[id];
      const t0 = at + (3.4 + i * 0.4) * k;
      fade(tl, c.plus, 0, 1, t0, 0.5);
      recognize(tl, c.R, c.mhc, { pos: t0 + 0.2 * k, duration: 1.3 * k, badge: true, hold: false });
      tl.fromTo(c.art, { attr: { opacity: 0.5 } }, { attr: { opacity: 1 }, duration: 0.8 * k }, t0 + 0.6 * k);
      fade(tl, c.halo, 0, 0.9, t0 + 0.6 * k, 0.7 * k);
      fade(tl, c.halo, 0.9, 0, t0 + 1.6 * k, 0.4);
      fade(tl, P.lab[id], 1, 0, t0 + 1.4 * k, 0.4);
      const kids = divide(tl, c.R, id === 'self' ? 2 : 3, { angle: id === 'self' ? 60 : -60, spread: 32, duration: 1.5 * k, pos: t0 + 1.6 * k });
      leave(tl, P, kids, c.key, t0 + 3.1 * k, k, { dashed: id === 'self' });
    });
    return at + 8.5 * k;
  }

  // ---------------------------------------------------------------- TUMOR panel
  function buildTU(parent, { combo = false } = {}) {
    const P = { kind: 'tu', combo };
    const g = S('g', {}, parent);
    P.g = g;
    const clipId = `tb-clip-${combo ? 'c' : 'g'}`;
    svg.defs.querySelector(`#${clipId}`)?.remove();
    const cp = S('clipPath', { id: clipId }, svg.defs);
    S('rect', { x: 6, y: 42, width: PW - 12, height: PH - 48, rx: 26 }, cp);
    const bgG = S('g', { 'clip-path': `url(#${clipId})` }, g);
    S('rect', { x: 6, y: 42, width: PW - 12, height: PH - 48, fill: mix(PALETTE.cancer, '#0B1024', 0.9), opacity: 0.5 }, bgG);
    bgG.append(tissueField({ width: PW - 12, height: PH - 48, x: 6, y: 42, seed: 12, stage: 'dark', density: 0.6 }));
    // blood vessel along the right edge
    const vg = S('g', { transform: `translate(444 ${PH / 2 + 18}) rotate(90)` }, bgG);
    S('ellipse', { rx: 250, ry: 52, fill: vesselGlow }, vg);
    vg.append(bloodVessel({ length: 520, width: 60, wall: 9, rbc: 7, seed: 3, stage: 'dark' }));
    S('rect', { x: 6.5, y: 42.5, width: PW - 13, height: PH - 49, rx: 26, fill: 'none', stroke: 'rgb(233 236 246 / 0.16)', 'vector-effect': 'non-scaling-stroke' }, g);
    S('text', { class: 't-caps tb-title', x: 16, y: 26, text: 'Tumor — where T cells do the work' }, g);
    const cells = S('g', {}, g);
    const fx = S('g', {}, g);
    const labels = S('g', {}, g);
    P.cells = cells; P.fx = fx; P.labels = labels;
    P.VX = 444;

    // cancer cells, PD-L1 on their surface (rule 7: PD-L1 never on T cells)
    const CR = 38;
    const cancerAt = [[80, 118], [205, 152], [96, 302], [226, 292], [158, 446]];
    P.c = cancerAt.map(([x, y], i) => {
      const art = cancerCell({ r: CR, seed: 40 + i, receptors: false, stage: 'dark' });
      const rec = S('g', { 'data-part': 'receptors' }, art);
      const out = cellInfo(art).outline;
      placeOnMembrane({ outline: out, parent: rec }, (o, j) => (j % 2 ? pdl1(o) : mhc1({ ...o, peptide: 'neo' })), { count: 8, size: 13, seed: 40 + i, offset: 0.2 })
        .forEach((q) => rec.appendChild(q));
      const R = rig(art, { x, y, parent: cells, seed: 40 + i });
      return { R, art, rec, out, x, y };
    });

    // terminally exhausted cells docked to cancer cells: TCR meets MHC, PD-1 meets PD-L1
    const term = (ci, theta, seed, key) => {
      const C = P.c[ci];
      const { art, rec } = tArt({ r: 26, seed, key, state: 'exhausted', decor: 10, avoid: theta + 180, pd1s: 5 });
      const pl = contactPlan(C.out, [C.x, C.y], cellInfo(art).outline, theta, [{ t: -10, gap: GAP }, { t: 10, gap: GAP }]);
      const [pt, pp] = pl.pairs;
      C.rec.append(put(mhc1({ size: SZ.tcr, peptide: 'neo', key, keySize: SZ.tcr, stage: 'dark' }), pt.al, theta + 90));
      C.rec.append(put(pdl1({ size: SZ.pd1, stage: 'dark' }), pp.al, theta + 90));
      const tc = put(tcr({ size: SZ.tcr, key, color: 'cd8', stage: 'dark' }), pt.bl, theta - 90);
      const p1 = put(pd1({ size: SZ.pd1, stage: 'dark' }), pp.bl, theta - 90);
      const minus = p1.querySelector('[data-part="icon-minus"]');
      if (minus) minus.setAttribute('opacity', '0');
      rec.append(tc, p1);
      const start = [pl.C[0] + pl.u[0] * 30, pl.C[1] + pl.u[1] * 30];
      const R = rig(art, { x: start[0], y: start[1], parent: cells, seed, tcrKey: key });
      const halo = S('circle', { r: 52, fill: haloPaint, opacity: 0 }, R.layers.under);
      const mk = marksFor(26, R.layers.over, { lock: true });
      const extraPd1 = [...rec.querySelectorAll('.sao-pd1')].filter((q) => q !== p1).slice(0, 1);
      return { R, art, plan: pl, start, pd1: p1, minus, caps: [p1, ...extraPd1], marks: mk, halo };
    };
    P.x1 = term(1, 10, 61, 14);
    P.x2 = term(3, 38, 62, 19);

    // stem-like (progenitor) cell: resting look, medium glow, one PD-1, TCF1 + TOX + one brake badge
    {
      const { art, rec } = tArt({ r: 26, seed: 70, key: KEYS.stem, decor: 6, avoid: 140 });
      const a = -40 * DEG, sr = rayHit(cellInfo(art).outline, 0, 0, Math.cos(a), Math.sin(a));
      const p1 = put(pd1({ size: 13, icon: false, stage: 'dark' }), [Math.cos(a) * sr, Math.sin(a) * sr], -40 + 90);
      rec.appendChild(p1);
      const R = rig(art, { x: 356, y: 452, parent: cells, seed: 70, tcrKey: KEYS.stem });
      S('circle', { r: 54, fill: haloPaint, opacity: 0.45 }, R.layers.under);
      const mk = marksFor(26, R.layers.over, { stem: true });
      P.stem = { R, art, pd1: p1, marks: mk };
    }
    // offspring of the stem-like cell (hidden until a division)
    const bud = (seed, act = false) => {
      const art = tCell({ variant: 'cd8', r: 26, state: act ? 'activated' : 'resting', seed, tcrKey: KEYS.stem, stage: 'dark', polarity: 180 });
      const R = rig(art, { x: 356, y: 452, parent: cells, seed, tcrKey: KEYS.stem, opacity: 0 });
      const mk = marksFor(26, R.layers.over, { badges: 0 });
      return { R, art, mk };
    };
    P.bud1 = bud(71, false, true);   // parks just left of the stem-like cell: its TOX sits on its far side, clear of TCF1
    P.bud2 = bud(72, true);

    // arrivals: new clones from the vessel (activated killers, new tcrKey notches)
    const arrival = (seed, key, y) => {
      const art = tCell({ variant: 'cd8', r: 25, state: 'activated', seed, tcrKey: key, stage: 'dark', polarity: 180 });
      return rig(art, { x: P.VX, y, parent: cells, seed, tcrKey: key, opacity: 0 });
    };
    P.arr = [arrival(81, KEYS.a1, 250), arrival(82, KEYS.a2, 380), arrival(83, KEYS.a3, 300)];
    P.extra = [arrival(84, KEYS.weak, 200), arrival(85, KEYS.strong, 120)];

    P.lab = {
      cancer: label(labels, 'Cancer cell', [22, 524], { leader: [P.c[4].x - 30, P.c[4].y + 22] }),
      // Two lines in the clear strip between the two terminal cells and the vessel: at [218, 258]
      // the step-4 arrival that kills cancer cell 3 docked right on top of it, so the fresh killer
      // read as "terminal".
      term: label(labels, NAMES.lock.replace(' (', '\n(').split('\n'), [412, 246], { anchor: 'end', icon: 'padlock', leader: [P.x2.plan.C[0] + 31, P.x2.plan.C[1] - 23] }),
      stem: label(labels, 'Stem-like (progenitor)', [404, 530], { anchor: 'end', leader: [P.stem.R.plan.x + 4, P.stem.R.plan.y + 46] }),
      vessel: label(labels, 'Blood vessel', [412, 64], { anchor: 'end', cls: 't-caps' }),
      arrive: label(labels, ['new clones arrive', 'from nodes and blood'], [404, 92], { anchor: 'end', cls: 't-small' }),
    };
    // movement arrow (also carries the meaning when motion is reduced)
    S('path', { d: 'M410 128 H360 M369 121.5 L360 128 L369 134.5', fill: 'none', stroke: 'rgb(233 236 246 / 0.8)', 'stroke-width': 1.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, P.lab.arrive);
    return P;
  }

  /** Step-3 grammar: PD-L1 presses PD-1; exhausted cells stall; the reserve trickles; the tumor grows. */
  function tuBrake(tl, P, { at = 0, k = 1 } = {}) {
    for (const key of ['cancer', 'term', 'stem', 'vessel']) fade(tl, P.lab[key], 0, 1, at + 0.1, 0.6);
    [P.x1, P.x2].forEach((X, i) => {
      move(tl, X.R, { x: X.plan.C[0], y: X.plan.C[1], duration: 1.4 * k, pos: at + (0.4 + i * 0.3) * k });
      fade(tl, X.minus, 0, 1, at + (1.7 + i * 0.3) * k, 0.5);
    });
    // the stem-like cell divides; its offspring soon dims
    const b = P.bud1;
    const sx = P.stem.R.plan.x, sy = P.stem.R.plan.y;
    move(tl, b.R, { x: sx - 90, y: sy + 8, opacity: 1, duration: 1.6 * k, pos: at + 1.8 * k });
    swap(tl, b.R, tCell({ variant: 'cd8', r: 26, state: 'exhausted', seed: 71, tcrKey: KEYS.stem, stage: 'dark' }), { duration: 1.4 * k, pos: at + 3.6 * k });
    // a cancer cell divides
    P.c0kids = divide(tl, P.c[0].R, 2, { angle: 240, spread: 40, duration: 2 * k, pos: at + 2.2 * k });
    return at + 5.2 * k;
  }

  /** Step-4 grammar: anti-PD-1 caps PD-1 on T cells; new clones arrive and kill; the reserve speeds up. */
  function tuPD1(tl, P, { at = 0, k = 1, arrivals = 3, extra = 0, extraKill = true, path = null } = {}) {
    // exhausted cells let go a little, PD-1 gets capped, badges are released (struck), slight brightening
    [P.x1, P.x2].forEach((X, i) => {
      move(tl, X.R, { x: X.plan.C[0] + X.plan.u[0] * 12, y: X.plan.C[1] + X.plan.u[1] * 12, duration: 0.9 * k, pos: at + i * 0.2 * k });
      fade(tl, X.minus, 1, 0, at + i * 0.2 * k, 0.4);
      X.caps.forEach((c, j) => {
        const ab = antibody({ variant: 'therapeutic', size: 21, stage: 'dark' });
        P.fx.append(ab);
        dockAntibody(tl, ab, c, { pos: at + (0.9 + j * 0.3 + i * 0.2) * k, duration: 1.1 * k });
      });
      struck(tl, X.marks.badges, at + 1.6 * k);
      fade(tl, X.halo, 0, 0.3, at + 1.6 * k, 0.8);      // brightens only slightly
    });
    {
      const ab = antibody({ variant: 'therapeutic', size: 21, stage: 'dark' });
      P.fx.append(ab);
      dockAntibody(tl, ab, P.stem.pd1, { pos: at + 1.1 * k, duration: 1.1 * k });
      struck(tl, P.stem.marks.badges, at + 1.8 * k);
    }
    // the reserve divides again: a fresh killer
    const b = P.bud2;
    const sx = P.stem.R.plan.x, sy = P.stem.R.plan.y;
    move(tl, b.R, { x: sx - 8, y: sy - 68, opacity: 1, duration: 1.4 * k, pos: at + 1.6 * k });
    let t = at + 2.2 * k;
    // new clones arrive from the vessel and kill
    fade(tl, P.lab.arrive, 0, 1, t, 0.6);
    fade(tl, P.lab.cancer, 1, 0, t + 2.4 * k, 0.6);
    const targets = [[3, -62], [4, -40], ['k1', 60]];   // [4, -10] docked on top of the stem-like cell's dimmed offspring
    P.arr.slice(0, arrivals).forEach((A, i) => {
      const [ci, ang] = targets[i];
      const C = ci === 'k1' ? { R: P.c0kids[1] } : P.c[ci];
      const t0 = t + i * 0.9 * k;
      move(tl, A, { x: P.VX - 46, y: A.plan.y, opacity: 1, duration: 1.0 * k, pos: t0 });
      approach(tl, A, C.R, { angle: ang, gap: 3, duration: 1.4 * k, pos: t0 + 1.0 * k });
      kill(tl, A, C.R, { duration: 2.2 * k, pos: t0 + 2.4 * k });
    });
    // the reserve's fresh killer joins in
    approach(tl, b.R, P.c[2].R, { angle: 50, gap: 3, duration: 1.3 * k, pos: t + 1.0 * k });
    kill(tl, b.R, P.c[2].R, { duration: 2.2 * k, pos: t + 2.4 * k });
    // (step 5) more varied clones, primed thanks to anti-CTLA-4, arrive along the path
    P.extra.slice(0, extra).forEach((A, i) => {
      const t0 = t + (1.4 + i * 0.8) * k;
      const tgt = i === 0 ? P.c0kids[0] : P.c[1].R;
      if (path) {   // along the dotted route from the node's exit, into the vessel
        place0(A, path.from[0], path.from[1]);
        const end = path.via[path.via.length - 1];
        move(tl, A, { x: end[0], y: end[1] + 14, via: path.via.slice(0, -1), opacity: 1, duration: 2.6 * k, pos: t0 - 2.8 * k + i * 0.5 * k });
        move(tl, A, { x: P.VX - 46, y: (i ? 150 : 210), opacity: 1, duration: 1.0 * k, pos: t0 });
      } else move(tl, A, { x: P.VX - 46, y: A.plan.y, opacity: 1, duration: 1.0 * k, pos: t0 });
      approach(tl, A, tgt, { angle: i === 0 ? 10 : -80, gap: 3, duration: 1.4 * k, pos: t0 + 1.0 * k });
      if (i === 0) kill(tl, A, tgt, { duration: 2.2 * k, pos: t0 + 2.4 * k });
      else recognize(tl, A, tgt, { pos: t0 + 2.4 * k, duration: 1.4 * k, badge: true });
    });
    return t + 6.2 * k;
  }
  const place0 = (A, x, y) => { A.plan.x = x; A.plan.y = y; A.el.setAttribute('transform', `translate(${r2(x)} ${r2(y)})`); };

  /** CTLA-4 only, in step 5: more varied clones reach the tumor, but PD-L1 still brakes most of them. */
  function tuBraked(tl, P, { at = 0, k = 1 } = {}) {
    fade(tl, P.lab.arrive, 0, 1, at, 0.6);
    P.extra.forEach((A, i) => {
      const t0 = at + i * 0.9 * k;
      const tgt = i === 0 ? P.c0kids[0] : P.c[1].R;
      move(tl, A, { x: P.VX - 46, y: A.plan.y, opacity: 1, duration: 1.0 * k, pos: t0 });
      approach(tl, A, tgt, { angle: i === 0 ? 10 : -80, gap: 3, duration: 1.4 * k, pos: t0 + 1.0 * k });
      if (i === 0) { kill(tl, A, tgt, { duration: 2.2 * k, pos: t0 + 2.4 * k }); return; }
      // braked: PD-L1 meets PD-1 at the contact (one crimson "−")
      const sig = brakeBadge({ x: (A.plan.x + tgt.plan.x) / 2, y: (A.plan.y + tgt.plan.y) / 2, size: 15 });
      sig.setAttribute('opacity', '0');
      P.fx.append(sig);
      fade(tl, sig, 0, 1, t0 + 2.4 * k, 0.5);
    });
    return at + 5.6 * k;
  }

  // ---------------------------------------------------------------- scene build
  function buildScene() {
    iconFixers = [];
    for (const c of [...svg.children]) if (c !== svg.defs) c.remove();
    gsap.killTweensOf(svg.querySelectorAll('*'));
    compact = ctx.compact;
    svg.setAttribute('viewBox', compact ? `0 0 ${PW} ${PH + TOP_C}` : `0 0 960 ${PH}`);
    const shift = S('g', { transform: compact ? `translate(0 ${TOP_C})` : 'translate(0 0)' }, svg);
    const cam = S('g', {}, shift);        // stepper camera (compact: which panel)
    const tabG = S('g', {}, cam);         // compact step 5 tab offset (outside the timeline)
    const world = S('g', {}, tabG);
    const guided = S('g', {}, world);
    const combo = S('g', { opacity: 0 }, world);
    const lnG = S('g', {}, guided), tuG = S('g', { transform: `translate(${PW} 0)` }, guided);
    const lnC = S('g', {}, combo), tuC = S('g', { transform: `translate(${PW} 0)` }, combo);
    const LN = buildLN(lnG), TU = buildTU(tuG);
    const LNc = buildLN(lnC, { combo: true }), TUc = buildTU(tuC, { combo: true });
    // divider (desktop)
    const divider = S('line', { x1: PW, x2: PW, y1: 44, y2: PH - 8, stroke: 'rgb(233 236 246 / 0.14)', 'stroke-width': 1, 'vector-effect': 'non-scaling-stroke', opacity: compact ? 0 : 1 }, world);
    // the dotted route from the node's exit to the tumor's vessel (step 5, both drugs)
    const route = S('g', { class: 'tb-noev' }, world);
    const routePts = [[LN.EX[0] + 8, LN.EX[1]], [498, 214], [560, 104], [680, 72], [820, 70], [PW + TU.VX - 34, 100]];
    const curvePt = (q) => {   // Catmull-Rom through routePts
      const n = routePts.length - 1, k = Math.min(n - 1, Math.floor(q * n)), t = q * n - k;
      const p0 = routePts[Math.max(0, k - 1)], p1 = routePts[k], p2 = routePts[k + 1], p3 = routePts[Math.min(n, k + 2)];
      const c = (a, b, c2, d) => 0.5 * (2 * b + (-a + c2) * t + (2 * a - 5 * b + 4 * c2 - d) * t * t + (-a + 3 * b - 3 * c2 + d) * t * t * t);
      return [c(p0[0], p1[0], p2[0], p3[0]), c(p0[1], p1[1], p2[1], p3[1])];
    };
    const dots = [];
    for (let i = 0; i <= 34; i++) {
      const [x, y] = curvePt(i / 34);
      dots.push(S('circle', { cx: r2(x), cy: r2(y), r: 2.4, fill: '#E9ECF6', opacity: 0 }, route));
    }
    el = { cam, tabG, world, guided, combo, lnG, tuG, LN, TU, LNc, TUc, divider, dots, route,
      routeFrom: [routePts[0][0] - PW, routePts[0][1]], routeVia: routePts.slice(1).map(([x, y]) => [x - PW, y]) };
    applyTab();
    ctx.refreshTextScale();
  }

  function applyTab() {
    if (!el) return;
    el.tabG.setAttribute('transform', compact && stepIdx === 4 && tab === 'ln' ? `translate(${PW} 0)` : 'translate(0 0)');
  }

  // ---------------------------------------------------------------- steps
  const camTo = (tl, x, at = 0, d = 1.2) => {
    if (!compact) return;
    tl.fromTo(el.cam, { attr: { transform: `translate(${x === 0 ? -PW : 0} 0)` } }, { attr: { transform: `translate(${x} 0)` }, duration: d, ease: 'so.inOut' }, at);
  };
  const steps = [
    { enter(tl) {
      if (compact) tl.set(el.cam, { attr: { transform: 'translate(0 0)' } }, 0);
      else fade(tl, el.tuG, 1, 0.4, 0, 0.6);
      lnPrime(tl, el.LN, { at: 0.3 });
    } },
    { enter(tl) { lnCTLA4(tl, el.LN, { at: 0.2 }); } },
    { enter(tl) {
      if (compact) camTo(tl, -PW, 0, 1.2);
      else { fade(tl, el.tuG, 0.4, 1, 0, 0.7); fade(tl, el.lnG, 1, 0.4, 0, 0.7); }
      tuBrake(tl, el.TU, { at: compact ? 1.0 : 0.5 });
    } },
    { enter(tl) { tuPD1(tl, el.TU, { at: 0.2 }); } },
    { enter(tl) {
      // both panels, replayed for the chosen drugs
      fade(tl, el.guided, 1, 0, 0, 0.7);
      fade(tl, el.combo, 0, 1, 0.3, 0.8);
      const t0 = 1.1;
      const lnEnd = lnPrime(tl, el.LNc, { at: t0, k: 0.7 });
      if (drugs.ctla4) lnCTLA4(tl, el.LNc, { at: lnEnd - 0.4, k: 0.7 });
      const tuEnd = tuBrake(tl, el.TUc, { at: t0, k: 0.75 });
      const both = drugs.ctla4 && drugs.pd1;
      if (drugs.pd1) {
        if (both && !compact) el.dots.forEach((d, i) => fade(tl, d, 0, 0.75, tuEnd - 1.2 + i * 0.04, 0.3));
        tuPD1(tl, el.TUc, { at: tuEnd, k: 0.75, extra: both ? 2 : 0, path: both && !compact ? { from: el.routeFrom, via: el.routeVia } : null });
      } else if (drugs.ctla4) {
        tuBraked(tl, el.TUc, { at: tuEnd, k: 0.75 });
      }
    } },
  ];

  // ---------------------------------------------------------------- step-5 controls
  // ONE legend for the tumor panel's cell marks, right under the stage — the same entries and swatches
  // as ch05-exhaustion. It appears with the tumor panel (step 3 on) and stays through free play.
  const sw = (inner) => `<svg viewBox="-13 -13 26 26" aria-hidden="true">${inner}</svg>`;
  const LEG = [
    { html: sw('<circle r="9" fill="#4C8DFF" opacity="0.28"/><circle r="5.5" fill="#4C8DFF"/>'), text: 'Glow: how well a cell works' },
    { html: sw('<circle r="6.5" fill="#E5484D"/><path d="M-3.4 0H3.4" stroke="#fff" stroke-width="2" stroke-linecap="round"/>'), text: 'PD-1 brake' },
    { html: sw('<circle r="8.5" fill="none" stroke="#C9D3E8" stroke-width="1.7" stroke-dasharray="3 3.3"/><circle r="4" fill="#4C8DFF" opacity="0.7"/>'), text: 'Ring: TOX on (exhausted family)' },
    { html: sw('<rect x="-4.5" y="-1.5" width="9" height="7" rx="1.5" fill="none" stroke="#E9ECF6" stroke-width="1.6"/><path d="M-2.8 -1.5V-3.6a2.8 2.8 0 0 1 5.6 0V-1.5" fill="none" stroke="#E9ECF6" stroke-width="1.6"/>'), text: NAMES.lock },
    { html: sw('<circle r="8.5" fill="none" stroke="#8FE3B0" stroke-width="2.4"/><circle r="4" fill="#4C8DFF" opacity="0.7"/>'), text: 'Mint ring: stem-like reserve (TCF1), also TOX on' },
  ];
  const legendEl = ctx.h('ul', { class: 'tb-legend', 'aria-label': 'What the marks on the tumor T cells mean' });
  LEG.forEach((it) => legendEl.append(ctx.h('li', { html: `${it.html}<span>${it.text}</span>` })));
  legendEl.hidden = true;
  ctx.stage.after(legendEl);

  const tabs = ctx.h('div', { class: 'tb-tabs' });
  tabs.hidden = true;
  ctx.stage.before(tabs);
  ctx.ui.segmented({
    label: 'Show', hideLabel: true, value: 'tumor', parent: tabs,
    options: [{ value: 'ln', label: 'Lymph node' }, { value: 'tumor', label: 'Tumor' }],
    onChange: (v) => { tab = v; applyTab(); ctx.announce(v === 'ln' ? 'Showing the lymph node.' : 'Showing the tumor.'); },
  });
  const free = ctx.h('div', { class: 'tb-free' });
  free.hidden = true;
  ctx.controls.append(free);
  const row = ctx.h('div', { class: 'tb-row' });
  free.append(row);
  const tgl = {
    ctla4: ctx.ui.toggle({ label: 'Anti-CTLA-4', checked: true, parent: row, onChange: (on) => { drugs.ctla4 = on; replay(); } }),
    pd1: ctx.ui.toggle({ label: 'Anti-PD-1 / PD-L1', checked: true, parent: row, onChange: (on) => { drugs.pd1 = on; replay(); } }),
  };
  const mWrap = ctx.h('div', { class: 'tb-meters' });
  free.append(mWrap);
  const mk = (title, words) => {
    const box = ctx.h('div', { class: 'tb-meter' });
    mWrap.append(box);
    const m = meter(box, { mode: 'segments', count: 4, title, tag: null, width: 330,
      zones: words.map((w, i) => ({ from: i / 4, to: (i + 1) / 4, label: w })), values: 0 });
    m.now = ctx.h('span', { class: 'tb-meter__now' });
    box.append(m.now);
    return m;
  };
  const meters = { attack: mk('Attack on the tumor', TIERS.attack), risk: mk('Risk to healthy tissue', TIERS.risk) };
  mWrap.append(ctx.h('span', { class: 'tb-tag' }, 'Illustrative, not measured'));
  function setMeters(animate = true) {
    const t = tierOf(drugs.ctla4, drugs.pd1);
    meters.attack.set((t.attack + 1) / 4, { duration: animate ? 0.8 : 0 });
    meters.risk.set((t.risk + 1) / 4, { duration: animate ? 0.8 : 0 });
    meters.attack.now.textContent = `Attack: ${TIERS.attack[t.attack].toLowerCase()}`;
    meters.risk.now.textContent = `Risk: ${TIERS.risk[t.risk].toLowerCase()}`;
    return `Attack on the tumor: ${TIERS.attack[t.attack].toLowerCase()}. Risk to healthy tissue: ${TIERS.risk[t.risk].toLowerCase()}.`;
  }

  let stepIdx = 0;
  let replayTw = null;
  function replay() {
    const msg = setMeters(true);
    ctx.announce(`${drugs.ctla4 ? 'Anti-CTLA-4 on' : 'Anti-CTLA-4 off'}, ${drugs.pd1 ? 'anti-PD-1 on' : 'anti-PD-1 off'}. ${msg}`);
    replayTw?.kill();
    stepper.rebuild();
    if (ctx.reducedMotion) return;
    const m = stepper.timeline;
    const a = m.labels['s4:start'], b = m.labels.s4;
    m.seek(a, true);
    replayTw = gsap.to(m, { time: b, duration: b - a, ease: 'none', onComplete: () => { replayTw = null; } });
  }

  const stepper = ctx.ui.stepper({
    steps,
    reset: buildScene,
    onChange(i) {
      stepIdx = i;
      replayTw?.kill(); replayTw = null;
      legendEl.hidden = i < 2;
      const last = i === 4;
      free.hidden = !last;
      tabs.hidden = !(last && compact);
      if (!last) tab = 'tumor';
      applyTab();
      if (last) setMeters(false);
    },
  });
  void tgl;

  ctx.onResize(({ compact: c }) => {
    requestAnimationFrame(() => iconFixers.forEach((fn) => fn()));
    if (c === compact) return;
    compact = c;
    tabs.hidden = !(stepIdx === 4 && compact);
    stepper.rebuild();
  });

  return { destroy() { replayTw?.kill(); } };
}
