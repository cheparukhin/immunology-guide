// ch09-wiring — "When blocking the doorbell stops working" (Chapter 9, explorer, dark stage).
//
// One idea, four states (drug off/on × KRAS normal/mutant): a blocking antibody on EGFR
// silences the "divide" signal only if nothing further down the chain is stuck on.
//
//   • EGFR is the one bespoke receptor in the book (FIGURE-AUDIT §4.4): two-lobed antenna,
//     a thin line through the membrane, a small box inside. Drawn locally (single use).
//   • Cetuximab = library antibody({ variant:'therapeutic' }) capping the antenna with one
//     arm tip, Fc pointing away (rule 9), via cell-actions dockAntibody.
//   • Pulses = cell-actions pulseAlong ('+' green-cyan discs, rule 10). The DIVIDE lamp is the
//     library signalIcon('activating') when lit, a gray outline when off.
//   • KRAS stuck on = a toggle-switch glyph jammed ON + "stuck on" (never a padlock).
//   • Idle motion (growth factors, pulses) runs as ctx.ambient timelines rebuilt per state;
//     reduced motion shows each state as a still with solid arrows.
import {
  membraneSurface, antibody, cytokine, signalIcon, glyphTones, vesicle, PALETTE, mix,
} from '../art/index.js';
import { dockAntibody, pulseAlong } from './shared/cell-actions.js';

const ID = 'ch09-wiring';

const CAPTIONS = {
  a: 'A growth factor binds EGFR, and a pulse runs down the chain of relay proteins inside the cell. The cell gets the signal to divide.',
  b: 'Cetuximab binds the receptor where the growth factor would bind. No binding, no pulse, no signal to divide.',
  c: 'This tumor’s KRAS is mutated and locked in its active state. It sends the divide signal nonstop, whatever happens at the receptor.',
  d: 'Cetuximab still blocks the receptor, but it no longer matters: the signal starts below the blockade. That is why colorectal tumors are tested for RAS mutations before this drug is used.',
};

const LAYOUTS = {
  wide: {
    vb: [900, 500], memY: 182, thick: 14, u: 84, rx: [270, 450, 630], arm: 'right',
    kras: [450, 246], krasR: 18, relays: [[450, 310], [450, 368]], relayR: 13,
    lamp: [450, 446], lampR: 19, nuc: [450, 560, 250, 136],
    gfStart: [[320, -24], [500, -24], [700, -24]],
    ghosts: [[150, 318, 24], [252, 398, 15], [760, 330, 30], [842, 420, 17], [640, 404, 12]],
    labels: {
      outside: [26, 36], inside: [26, 236], nucleus: [262, 486],
      gfKey: [34, 64], egfr: { text: [214, 118], anchor: 'end', at: 'egfr' },
      kras: [478, 251], stuck: { sw: [402, 246], text: [377, 251] },
      divide: [480, 452], drug: { text: [714, 52], anchor: 'start' },
    },
  },
  compact: {
    vb: [360, 540], memY: 205, thick: 12, u: 60, rx: [104, 204, 304], arm: 'left',
    kras: [204, 266], krasR: 16, relays: [[204, 326], [204, 380]], relayR: 12,
    lamp: [204, 478], lampR: 18, nuc: [204, 584, 205, 130],
    gfStart: [[150, -24], [240, -24], [330, -24]],
    ghosts: [[58, 400, 18], [316, 330, 20], [306, 420, 13], [110, 270, 11]],
    labels: {
      outside: [16, 28], inside: [16, 334], insideText: 'Inside the cell', nucleus: [58, 526],
      gfKey: [22, 56], egfr: { text: [12, 164], anchor: 'start', two: true },
      kras: [228, 271], stuck: { sw: [160, 266], text: [138, 271] },
      divide: [230, 484], drug: { text: [16, 90], anchor: 'start' },
    },
  },
};

const STYLE = `
[data-figure="${ID}"] .w9-cap { color: var(--ink); min-height: 3.1em; }
[data-figure="${ID}"] .w9-foot { font-family: var(--font-ui); font-size: var(--text-xs); color: var(--ink-3); }
[data-figure="${ID}"] .w9-kras { display: inline-flex; flex-wrap: wrap; align-items: center; gap: var(--s-2) var(--s-4); transition: opacity 0.6s ease, transform 0.6s ease; }
[data-figure="${ID}"] .w9-kras[hidden] { display: none; }
[data-figure="${ID}"] .w9-kras.is-new { opacity: 0; transform: translateY(4px); }
[data-figure="${ID}"] .w9-prompt { margin: 0; font-family: var(--font-ui); font-size: var(--text-sm); color: var(--ink-2); }
[data-figure="${ID}"] .w9-prompt::before { content: "→ "; color: var(--accent); }
@media (prefers-reduced-motion: reduce) { [data-figure="${ID}"] .w9-kras { transition: none; } }
`;

function injectStyle() {
  if (document.getElementById(`${ID}-style`)) return;
  const s = document.createElement('style');
  s.id = `${ID}-style`;
  s.textContent = STYLE;
  document.head.append(s);
}

/**
 * EGFR (bespoke, FIGURE-AUDIT §4.4): two-lobed antenna above the membrane, a thin line
 * through it, a small box (the kinase) inside. Anchor (0,0) = outer membrane surface.
 */
function egfrGlyph(ctx, u, thick) {
  const T = glyphTones(PALETTE.antigen, 'dark');
  const g = ctx.svg('g', { class: 'w9-egfr' });
  const sw = Math.max(1.2, u * 0.028);
  // stalk domain + thin transmembrane line + kinase box
  ctx.svg('path', { d: `M0 ${-u * 0.02} V${thick + 3}`, stroke: T.stroke, strokeWidth: sw * 1.1, strokeLinecap: 'round', fill: 'none' }, g);
  ctx.svg('ellipse', { cx: 0, cy: -u * 0.24, rx: u * 0.075, ry: u * 0.15, fill: T.fill, stroke: T.stroke, strokeWidth: sw }, g);
  const box = ctx.svg('rect', { x: -u * 0.13, y: thick + 3, width: u * 0.26, height: u * 0.22, rx: u * 0.05, fill: T.fill, stroke: T.stroke, strokeWidth: sw }, g);
  // the two lobes of the antenna, splayed into a cradle (where the growth factor lands)
  const lobes = ctx.svg('g', { 'data-part': 'head' }, g);
  for (const s of [-1, 1]) {
    ctx.svg('ellipse', {
      cx: s * u * 0.15, cy: -u * 0.62, rx: u * 0.12, ry: u * 0.25,
      transform: `rotate(${s * 24} ${s * u * 0.15} ${-u * 0.62})`,
      fill: T.fill2, fillOpacity: 0.78, stroke: T.stroke, strokeWidth: sw,
    }, lobes);
  }
  // a faint inner seam on each lobe (domain boundary)
  ctx.svg('path', {
    d: `M${-u * 0.21} ${-u * 0.5} q${u * 0.05} ${-u * 0.06} ${u * 0.12} ${-u * 0.04} M${u * 0.21} ${-u * 0.5} q${-u * 0.05} ${-u * 0.06} ${-u * 0.12} ${-u * 0.04}`,
    stroke: T.light, strokeOpacity: 0.45, strokeWidth: sw * 0.8, fill: 'none', strokeLinecap: 'round',
  }, lobes);
  g.box = box;
  g.boxY = thick + 3 + u * 0.11;          // centre of the box
  g.boxBottom = thick + 3 + u * 0.22;
  g.cradleY = -u * 0.8;                    // where a growth factor sits
  g.topY = -u * 0.92;
  return g;
}

/** "Stuck on" toggle-switch glyph: a pill track with the knob jammed at ON. */
function switchGlyph(ctx, parent) {
  const g = ctx.svg('g', null, parent);
  const on = PALETTE.activating;
  ctx.svg('rect', { x: -17, y: -9.5, width: 34, height: 19, rx: 9.5, fill: mix(on, '#0B1024', 0.35), stroke: mix(on, '#FFFFFF', 0.45), strokeWidth: 1.4 }, g);
  ctx.svg('text', { x: -8.5, y: 3.6, class: 'w9-on', 'text-anchor': 'middle', style: 'font: 700 8.5px var(--font-ui); fill: #0B1024; letter-spacing: 0.02em', text: 'ON' }, g);
  ctx.svg('circle', { cx: 8, cy: 0, r: 6.8, fill: '#F4FFFA', stroke: mix(on, '#0B1024', 0.2), strokeWidth: 1 }, g);
  return g;
}

export default function mount(fig, ctx) {
  injectStyle();
  const { gsap } = ctx;
  const C = ctx.colors;

  ctx.setAspect(900 / 500, 360 / 540);
  const svg = ctx.createSVG({ viewBox: '0 0 900 500' });
  ctx.tag('Illustrative');
  ctx.tag('Not to scale');

  const state = { drug: false, mutant: false };
  let layoutName = ctx.compact ? 'compact' : 'wide';
  let L = LAYOUTS[layoutName];
  let el = {};
  let drugTl = null;
  let krasTl = null;
  let loops = [];
  let lastKey = null;

  // ---------------------------------------------------------------- scene
  function draw() {
    killLoops();
    drugTl?.kill();
    krasTl?.kill();
    for (const n of [...svg.children]) if (n !== svg.defs) n.remove();
    const [W, H] = L.vb;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    ctx.refreshTextScale();
    const S = (tag, attrs, parent = svg) => ctx.svg(tag, attrs, parent);
    const memY = L.memY;
    const inner = memY + L.thick;

    // cell interior (cancer-cell cytoplasm) and the nucleus
    const cyto = ctx.linearGradient(svg, [[0, C.cancer, 0.2], [0.55, C.cancer, 0.08], [1, C.cancer, 0.05]], { x1: '0%', y1: '0%', x2: '0%', y2: '100%' });
    S('rect', { x: 0, y: inner, width: W, height: H - inner, fill: cyto });
    const [ncx, ncy, nrx, nry] = L.nuc;
    const nucFill = ctx.radialGradient(svg, [[0, mix(PALETTE.cancer, '#0B1024', 0.84), 0.95], [0.75, mix(PALETTE.cancer, '#0B1024', 0.78), 0.92], [1, mix(PALETTE.cancer, '#0B1024', 0.66), 0.9]], { cy: '30%' });
    S('ellipse', { cx: ncx, cy: ncy, rx: nrx, ry: nry, fill: nucFill, stroke: mix(PALETTE.cancer, '#FFFFFF', 0.3), strokeOpacity: 0.5, strokeWidth: 1.6 });
    S('ellipse', { cx: ncx, cy: ncy, rx: nrx - 6, ry: nry - 6, fill: 'none', stroke: mix(PALETTE.cancer, '#FFFFFF', 0.3), strokeOpacity: 0.28, strokeWidth: 1, strokeDasharray: '2 5' });
    // a few chromatin wisps, for texture
    const chrom = ctx.random(9);
    let dch = '';
    for (let k = 0; k < 14; k++) {
      const a = Math.PI * (1.15 + chrom() * 0.7), rr = 0.35 + chrom() * 0.5;
      const x = ncx + Math.cos(a) * nrx * rr, y = ncy + Math.sin(a) * nry * rr;
      dch += `M${x.toFixed(1)} ${y.toFixed(1)} q${(chrom() * 16 - 8).toFixed(1)} ${(chrom() * 8 - 4).toFixed(1)} ${(chrom() * 22 - 11).toFixed(1)} ${(chrom() * 6 - 3).toFixed(1)}`;
    }
    S('path', { d: dch, stroke: mix(PALETTE.cancer, '#FFFFFF', 0.2), strokeOpacity: 0.22, strokeWidth: 2, fill: 'none', strokeLinecap: 'round' });

    // out-of-focus organelles, for depth (context at low opacity)
    const ghosts = S('g', { opacity: 0.16 });
    L.ghosts.forEach(([x, y, r], k) => {
      const v = vesicle({ kind: 'endosome', r, seed: k + 3, stage: 'dark', color: mix(PALETTE.cancer, '#C9D3E8', 0.5) });
      v.setAttribute('transform', `translate(${x} ${y})`);
      ghosts.append(v);
    });

    // membrane
    const mem = membraneSurface({ width: W + 40, thickness: L.thick, color: 'cancer', depth: 0, stage: 'dark' });
    mem.setAttribute('transform', `translate(${W / 2} ${memY})`);
    svg.append(mem);

    // wires: receptor boxes → bus under the membrane → KRAS → relays → lamp
    const [kx, ky] = L.kras;
    const wires = S('g', { fill: 'none', stroke: '#C9D3F0', strokeOpacity: 0.32, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' });
    const rec = [];
    const recG = S('g');
    L.rx.forEach((x) => {
      const g = egfrGlyph(ctx, L.u, L.thick);
      g.setAttribute('transform', `translate(${x} ${memY})`);
      recG.append(g);
      rec.push({ g, x });
    });
    const boxY = memY + rec[0].g.boxY;
    const boxBottom = memY + rec[0].g.boxBottom;
    S('path', { d: `M${L.rx[0]} ${boxY} H${L.rx[2]} M${kx} ${boxBottom} V${ky - L.krasR}` }, wires);
    S('path', { d: `M${kx} ${ky + L.krasR} V${L.lamp[1] - L.lampR}` }, wires);
    // pulse paths (invisible)
    const paths = S('g', { fill: 'none', stroke: 'none' });
    const recPaths = L.rx.map((x) => S('path', { d: x === kx ? `M${x} ${boxY} V${ky}` : `M${x} ${boxY} H${kx} V${ky}` }, paths));
    const downPath = S('path', { d: `M${kx} ${ky} V${L.lamp[1] - L.lampR * 0.9}` }, paths);

    // KRAS: glow (steady when mutant), momentary flash (normal docking), bead, ring
    const krasT = glyphTones('#C9D3E8', 'dark');
    const actHalo = ctx.radialGradient(svg, [[0.35, PALETTE.activating, 0.55], [1, PALETTE.activating, 0]]);
    const krasGlow = S('circle', { cx: kx, cy: ky, r: L.krasR * 2.3, fill: actHalo, opacity: 0 });
    const krasFlash = S('circle', { cx: kx, cy: ky, r: L.krasR * 2.1, fill: actHalo, opacity: 0 });
    const beadFill = ctx.radialGradient(svg, [[0, '#F3F6FF', 1], [0.6, '#C9D3E8', 0.95], [1, '#8E9BC0', 0.9]], { fx: '38%', fy: '34%' });
    S('circle', { cx: kx, cy: ky, r: L.krasR, fill: beadFill, stroke: krasT.stroke, strokeWidth: 1.6 });
    const krasRim = S('circle', { cx: kx, cy: ky, r: L.krasR + 1.5, fill: 'none', stroke: PALETTE.activating, strokeWidth: 3, opacity: 0 });
    const ring = S('circle', { cx: kx, cy: ky, r: L.krasR + 4, fill: 'none', stroke: PALETTE.activating, strokeWidth: 3, opacity: 0 });
    const relays = L.relays.map(([x, y]) => {
      S('circle', { cx: x, cy: y, r: L.relayR, fill: beadFill, stroke: krasT.stroke, strokeWidth: 1.4, opacity: 0.92 });
      const hit = S('circle', { cx: x, cy: y, r: Math.max(22, L.relayR + 8), fill: 'transparent', 'data-hit': '' });
      ctx.on(hit, 'pointerenter', () => ctx.tooltip.show('Relay proteins: further links in the chain', hit));
      ctx.on(hit, 'pointerleave', () => ctx.tooltip.hide());
      ctx.on(hit, 'click', () => ctx.tooltip.show('Relay proteins: further links in the chain', hit));
      return hit;
    });

    // DIVIDE lamp: gray outline (off) + activating signal icon (on); two "on" layers
    const [lx, ly] = L.lamp;
    S('circle', { cx: lx, cy: ly, r: L.lampR, fill: '#0B1024', fillOpacity: 0.55, stroke: '#7480A0', strokeWidth: 2 });
    const lampOn = () => {
      const g = S('g', { opacity: 0 });
      S('circle', { cx: lx, cy: ly, r: L.lampR * 2.6, fill: actHalo }, g);
      const ic = signalIcon({ type: 'activating', size: L.lampR * 2, x: lx, y: ly });
      g.append(ic);
      return g;
    };
    const lampSteady = lampOn();
    const lampPulse = lampOn();

    // reduced-motion arrows (solid, with heads)
    const arrowId = `w9-arrow-${Math.random().toString(36).slice(2, 7)}`;
    const marker = S('marker', { id: arrowId, viewBox: '0 0 10 10', refX: 7, refY: 5, markerWidth: 5, markerHeight: 5, orient: 'auto-start-reverse' }, svg.defs);
    S('path', { d: 'M0 0 L10 5 L0 10 Z', fill: PALETTE.activating }, marker);
    const arrowStyle = { fill: 'none', stroke: PALETTE.activating, strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round', markerEnd: `url(#${arrowId})`, opacity: 0 };
    const recArrows = L.rx.map((x) => S('path', { ...arrowStyle, d: x === kx ? `M${x} ${boxBottom + 1} V${ky - L.krasR - 4}` : `M${x} ${boxY + 9} V${boxY + 9} H${x < kx ? kx - 14 : kx + 14} V${ky - L.krasR - 4}` }));
    const downArrow = S('path', { ...arrowStyle, d: `M${kx + L.krasR + 10} ${ky + 6} V${ly - L.lampR - 8}` });

    // drug antibodies (cetuximab), parked until docked by drugTl
    const abG = S('g');
    const abs = rec.map(() => {
      const ab = antibody({ variant: 'therapeutic', size: L.u * 0.86, stage: 'dark' });
      abG.append(ab);
      return ab;
    });

    // growth factors
    const gfG = S('g');
    const gfs = rec.map(() => {
      const g = S('g', { opacity: 0, transform: 'translate(0 -40)' }, gfG);
      g.append(cytokine({ color: PALETTE.healthy, size: L.u * 0.2, stage: 'dark' }));
      return g;
    });

    // switch glyph + labels
    const lab = L.labels;
    const T = (x, y, text, cls = 't-label', anchor) => S('text', { x, y, class: `${cls} t-halo`, 'text-anchor': anchor, text });
    T(...lab.outside, 'Outside the cell', 't-caps');
    T(...lab.inside, lab.insideText || 'Inside the cancer cell', 't-caps');
    T(...lab.nucleus, 'Nucleus', 't-caps');
    // growth-factor key
    const key = S('g', { transform: `translate(${lab.gfKey[0]} ${lab.gfKey[1]})` });
    key.append(cytokine({ color: PALETTE.healthy, size: L.u * 0.2, stage: 'dark' }));
    S('text', { x: 16, y: 5, class: 't-small t-halo', text: 'growth factor' }, key);
    // EGFR label with a leader to the left receptor's outer lobe
    {
      const g0 = rec[0];
      const ax = g0.x - L.u * 0.27, ay = memY - L.u * 0.62;
      const [tx, ty] = lab.egfr.text;
      if (lab.egfr.two) {
        T(tx, ty, 'EGFR', 't-label', 'start');
        T(tx, ty + 18, '(receptor)', 't-small', 'start');
        S('line', { class: 'leader', x1: tx + 44, y1: ty - 5, x2: ax, y2: ay });
      } else {
        S('line', { class: 'leader', x1: tx + 4, y1: ty - 5, x2: ax, y2: ay });
        T(tx, ty, 'EGFR (receptor)', 't-label', lab.egfr.anchor);
      }
      S('circle', { class: 'leader-dot', cx: ax, cy: ay, r: 2.4 });
    }
    T(...lab.kras, 'KRAS');
    const stuck = S('g', { opacity: 0 });
    const sw = switchGlyph(ctx, stuck);
    sw.setAttribute('transform', `translate(${lab.stuck.sw[0]} ${lab.stuck.sw[1]})`);
    S('text', { x: lab.stuck.text[0], y: lab.stuck.text[1], class: 't-label t-halo', 'text-anchor': 'end', text: 'locked active' }, stuck);
    T(...lab.divide, 'DIVIDE', 't-label');
    const drugLabel = S('g', { opacity: 0 });
    {
      const [tx, ty] = lab.drug.text;
      S('text', { x: tx, y: ty, class: 't-label t-halo', 'text-anchor': lab.drug.anchor, text: 'cetuximab' }, drugLabel);
      el.drugLabelAt = { tx, ty, anchor: lab.drug.anchor };
    }

    const fx = S('g');   // pulses live here (cleared on every rebuild)

    el = { ...el, rec, recPaths, downPath, krasGlow, krasFlash, krasRim, ring, relays, lampSteady, lampPulse, recArrows, downArrow, abs, gfs, stuck, drugLabel, fx };

    // drug: dock one antibody per receptor (one arm tip on the antenna, Fc away)
    drugTl = gsap.timeline({ paused: true });
    abs.forEach((ab, i) => dockAntibody(drugTl, ab, rec[i].g, { arm: L.arm, duration: 1.3, pos: i * 0.18 }));
    drugTl.fromTo(drugLabel, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 1.1);
    // leader from the label to the last antibody's stem (measured once it is docked)
    drugTl.progress(1);
    {
      const wrap = abs[L.arm === 'left' ? 0 : 2].parentNode;
      const m = wrap.transform.baseVal.consolidate()?.matrix;
      if (m) {
        const fx0 = m.e + m.c * -L.u * 0.25, fy0 = m.f + m.d * -L.u * 0.25;   // a point on the Fc
        const { tx, ty, anchor } = el.drugLabelAt;
        const sx = L.arm === 'left' ? tx + 40 : anchor === 'end' ? tx - 40 : tx - 4;
        const sy = L.arm === 'left' ? ty + 6 : anchor === 'end' ? ty + 8 : ty - 5;
        S('line', { class: 'leader', x1: sx, y1: sy, x2: fx0, y2: fy0 }, drugLabel);
        S('circle', { class: 'leader-dot', cx: fx0, cy: fy0, r: 2.4 }, drugLabel);
      }
    }
    drugTl.progress(0);

    // KRAS stuck on: steady glow, rim, switch glyph, lamp lit
    krasTl = gsap.timeline({ paused: true })
      .to(krasGlow, { opacity: 1, duration: 0.9, ease: 'so.inOut' }, 0)
      .to(krasRim, { opacity: 1, duration: 0.9 }, 0)
      .to(stuck, { opacity: 1, duration: 0.7 }, 0.2)
      .to(lampSteady, { opacity: 1, duration: 1.0 }, 0.6);

    drugTl.progress(state.drug ? 1 : 0);
    krasTl.progress(state.mutant ? 1 : 0);
    startLoops();
    renderStill();
  }

  // ---------------------------------------------------------------- idle motion per state
  function killLoops() {
    loops.forEach((t) => t.kill());
    loops = [];
    if (el.fx) el.fx.replaceChildren();
    if (el.gfs) gsap.set([...el.gfs, el.lampPulse, el.krasFlash], { opacity: 0 });
  }

  function startLoops() {
    killLoops();
    if (ctx.reducedMotion) return;
    const P = 6.6;                                  // seconds per growth-factor cycle
    const { memY, u } = L;
    el.gfs.forEach((gf, i) => {
      const r = el.rec[i];
      const side = L.arm === 'left' ? -1 : 1;      // drug antibodies lean away from this side
      const hitX = r.x + side * u * 0.3, hitY = memY + r.g.topY - u * 0.05;
      const sy = L.gfStart[i][1];
      const sx = state.drug ? hitX + side * u * 0.7 : L.gfStart[i][0];
      const tl = gsap.timeline({ repeat: -1, delay: i * (P / 3) + 0.3, defaults: { ease: 'sine.inOut' } });
      const cradle = memY + r.g.cradleY;
      tl.set(gf, { attr: { transform: `translate(${sx} ${sy})` }, opacity: 0 }, 0);
      if (!state.drug) {
        tl.to(gf, { opacity: 1, duration: 0.5 }, 0)
          .to(gf, { attr: { transform: `translate(${r.x} ${cradle})` }, duration: 2.2, ease: 'so.out' }, 0);
        pulseAlong(tl, el.recPaths[i], '+', { duration: 0.8, size: 13, layer: el.fx, pos: 2.3 });
        if (!state.mutant) {
          tl.fromTo(el.krasFlash, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power1.out' }, 3.0)
            .to(el.krasFlash, { opacity: 0, duration: 0.8 }, 3.35);
          pulseAlong(tl, el.downPath, '+', { duration: 1.2, size: 13, layer: el.fx, pos: 3.05 });
          tl.fromTo(el.lampPulse, { opacity: 0 }, { opacity: 1, duration: 0.45, ease: 'power1.out' }, 4.1)
            .to(el.lampPulse, { opacity: 0, duration: 1.0, ease: 'power1.in' }, 5.0);
        }
        tl.to(gf, { attr: { transform: `translate(${r.x + side * 26} ${cradle - u * 0.9})` }, duration: 1.3, ease: 'so.in' }, 3.4)
          .to(gf, { opacity: 0, duration: 0.6 }, 4.1);
      } else {
        // the antenna is capped: the growth factor arrives and bounces away
        tl.to(gf, { opacity: 1, duration: 0.5 }, 0)
          .to(gf, { attr: { transform: `translate(${hitX} ${hitY})` }, duration: 2.1, ease: 'so.out' }, 0)
          .to(gf, { attr: { transform: `translate(${hitX + side * u * 0.75} ${hitY - u * 0.9})` }, duration: 1.4, ease: 'so.out' }, 2.1)
          .to(gf, { opacity: 0, duration: 0.7 }, 2.8);
      }
      tl.set({}, {}, P);                             // pad the cycle to P
      loops.push(ctx.ambient(tl));
    });
    if (state.mutant) {
      // stuck on: pulses leave KRAS nonstop
      const tl = gsap.timeline({ repeat: -1 });
      pulseAlong(tl, el.downPath, '+', { duration: 1.3, size: 13, layer: el.fx, pos: 0 });
      pulseAlong(tl, el.downPath, '+', { duration: 1.3, size: 13, layer: el.fx, pos: 0.65 });
      tl.set({}, {}, 1.3);
      loops.push(ctx.ambient(tl));
    }
  }

  // Reduced motion: each state as a still (growth factors parked, arrows for active paths).
  function renderStill() {
    const rm = ctx.reducedMotion;
    const { memY, u } = L;
    el.recArrows.forEach((a) => a.setAttribute('opacity', rm && !state.drug ? 0.95 : 0));
    el.downArrow.setAttribute('opacity', rm && (state.mutant || !state.drug) ? 0.95 : 0);
    if (!rm) return;
    gsap.set(el.lampPulse, { opacity: !state.drug && !state.mutant ? 1 : 0 });
    el.gfs.forEach((gf, i) => {
      const r = el.rec[i];
      const x = state.drug ? r.x + (L.arm === 'left' ? -1 : 1) * u * 0.5 : r.x;
      const y = state.drug ? memY + r.g.topY + u * 0.1 : memY + r.g.cradleY;
      gsap.set(gf, { attr: { transform: `translate(${x} ${y})` }, opacity: 1 });
    });
  }

  // ---------------------------------------------------------------- state changes
  const stateKey = () => (state.mutant ? (state.drug ? 'd' : 'c') : (state.drug ? 'b' : 'a'));

  function apply({ ringOnce = false } = {}) {
    const rm = ctx.reducedMotion;
    const to = (tl, on) => {
      if (rm) { tl.progress(on ? 1 : 0); return; }
      if (on) tl.play(); else tl.reverse();
    };
    to(drugTl, state.drug);
    to(krasTl, state.mutant);
    startLoops();
    renderStill();
    const k = stateKey();
    if (ringOnce && k === 'd' && !rm) {
      gsap.fromTo(el.ring, { attr: { r: L.krasR + 4 }, opacity: 0.95 }, { attr: { r: L.krasR * 2.6 }, opacity: 0, duration: 1.8, ease: 'power1.out', delay: 0.9 });
    }
    if (k !== lastKey) {
      lastKey = k;
      cap.textContent = CAPTIONS[k];
    }
  }

  // ---------------------------------------------------------------- controls + caption
  const cap = ctx.h('p', { class: 'w9-cap', 'aria-live': 'polite' }, CAPTIONS.a);
  const foot = ctx.h('p', { class: 'w9-foot' }, 'Simplified: real cells split this signal into several parallel pathways.');
  ctx.caption.append(cap, foot);
  lastKey = 'a';

  let revealed = false;
  const krasWrap = ctx.h('div', { class: 'w9-kras', hidden: true });
  const prompt = ctx.h('p', { class: 'w9-prompt' }, 'Now try a tumor whose KRAS is mutated.');
  ctx.ui.toggle({
    label: 'Add cetuximab',
    onChange: (on) => {
      const wasD = stateKey();
      state.drug = on;
      apply({ ringOnce: wasD !== 'd' });
      if (on && !revealed) {
        revealed = true;
        krasWrap.hidden = false;
        krasWrap.classList.add('is-new');
        requestAnimationFrame(() => requestAnimationFrame(() => krasWrap.classList.remove('is-new')));
      }
    },
  });
  ctx.controls.append(krasWrap);
  ctx.ui.segmented({
    label: 'Tumor’s KRAS',
    parent: krasWrap,
    value: 'normal',
    options: [{ value: 'normal', label: 'Normal' }, { value: 'mutant', label: 'Mutant' }],
    onChange: (v) => {
      const wasD = stateKey();
      state.mutant = v === 'mutant';
      prompt.remove();
      apply({ ringOnce: wasD !== 'd' });
    },
  });
  krasWrap.append(prompt);

  // ---------------------------------------------------------------- layout
  draw();
  ctx.onResize(({ compact }) => {
    const name = compact ? 'compact' : 'wide';
    if (name === layoutName) return;
    layoutName = name;
    L = LAYOUTS[name];
    draw();
  });

  return {
    destroy() { killLoops(); drugTl?.kill(); krasTl?.kill(); },
  };
}
