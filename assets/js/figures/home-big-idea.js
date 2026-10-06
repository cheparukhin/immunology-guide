// home-big-idea — "The big idea in 30 seconds" on the home page.
//
// Three steps on one stage:
//   1. Checking the shop window — a killer T cell crawls along three healthy
//      cells, touching each one's MHC display (self only) and moving on.
//   2. Altered self — the middle cell becomes a cancer cell: mostly self
//      fragments plus a few unfamiliar (pink) ones. The T cell docks and
//      recognizes one, but PD-L1 on the tumor grips PD-1 on the T cell: brake.
//   3. A helping hand — a drug antibody covers PD-1, the brake is released, the
//      T cell is activated and the cancer cell dies (apoptosis).
//
// The scene is drawn in one "frame" (desktop coordinates, 960×540). On phones
// the frame is scaled into a portrait viewBox and labels get their own
// positions, so text stays horizontal and readable.
import {
  tCell, healthyCell, cancerCell, mhc1, tcr, pd1, pdl1, antibody, antibodyTips, signalIcon,
  placeOnMembrane, cellInfo, rayHit, tissueField,
} from '../art/index.js';

const D2R = Math.PI / 180;
const R2D = 180 / Math.PI;

// Frame geometry (desktop units).
const CELLS = { L: [250, 380], C: [480, 380], R: [710, 380] };
const R_H = 58;          // healthy cells
const R_C = 66;          // cancer cell
const R_T = 28;          // T cell (activated cells are drawn ~18% larger)
const START = [60, 196];
const EXIT = [836, 196];

const LAYOUTS = {
  wide: {
    viewBox: [960, 540],
    frame: { x: 480 - 480 * 1.2, y: 344 - 380 * 1.2, s: 1.2 },
    exit: [796, 206],
    labels: {
      healthy: { text: [204, 492], anchor: 'middle' },
      window: { text: [28, 236], anchor: 'start', at: 'windowL' },
      cancer: { text: [480, 508], anchor: 'middle' },
      dies: { text: [480, 508], anchor: 'middle' },
      frag: { text: [318, 516], anchor: 'end', at: 'neo2' },
      brake: { text: [640, 196], anchor: 'start', at: 'brake' },
      drug: { text: [664, 92], anchor: 'start', at: 'drug' },
    },
  },
  compact: {
    viewBox: [400, 440],
    frame: { x: 200 - 480 * 0.64, y: 252 - 380 * 0.64, s: 0.64 },
    exit: [640, 196],
    labels: {
      healthy: { text: [200, 352], anchor: 'middle' },
      window: { text: [16, 96], anchor: 'start', at: 'windowL' },
      cancer: { text: [200, 356], anchor: 'middle' },
      dies: { text: [200, 356], anchor: 'middle' },
      frag: { text: [20, 404], anchor: 'start', at: 'neo2' },
      brake: { text: [386, 84], anchor: 'end', at: 'brake' },
      drug: { text: [386, 40], anchor: 'end', at: 'drug' },
    },
  },
};

const TEXT = {
  healthy: 'Healthy cells',
  window: 'Shop window: self only',
  cancer: 'Cancer cell',
  dies: 'The cancer cell dies',
  frag: 'Unfamiliar peptide',
  brake: 'Brake: PD-L1 binds PD-1',
  drug: 'Antibody blocks PD-1',
};

export default function mount(fig, ctx) {
  const { gsap } = ctx;
  ctx.setAspect(16 / 9, 400 / 440);
  ctx.addDust();
  const svg = ctx.createSVG({ viewBox: '0 0 960 540' });
  const glowPaint = ctx.radialGradient(svg, [[0, '#FFFFFF', 0.95], [0.3, '#BFD6FF', 0.7], [0.65, ctx.colors.cd8, 0.25], [1, ctx.colors.cd8, 0]], { id: `${ctx.id}-glow` });

  let layoutName = ctx.compact ? 'compact' : 'wide';
  let L = LAYOUTS[layoutName];
  let el = {};

  const S = (tag, attrs, parent) => ctx.svg(tag, attrs, parent);
  const tf = (x, y) => `translate(${x.toFixed(1)} ${y.toFixed(1)})`;
  const tr = (a) => `rotate(${a.toFixed(1)})`;

  // ------------------------------------------------------------------ geometry helpers
  /** Membrane point of a (non-rotated) cell at world angle `deg`. */
  const edge = (node, cx, cy, deg) => { const h = rayHit(cellInfo(node).outline, deg * D2R); return { x: cx + h.x, y: cy + h.y }; };

  // ------------------------------------------------------------------ draw (before step 1)
  function draw() {
    for (const ch of [...svg.children]) if (ch !== svg.defs) ch.remove();
    const [vw, vh] = L.viewBox;
    svg.setAttribute('viewBox', `0 0 ${vw} ${vh}`);
    const { x: fx, y: fy, s: fs } = L.frame;
    const toWorld = (p) => ({ x: fx + p.x * fs, y: fy + p.y * fs });

    svg.appendChild(tissueField({ width: vw, height: vh, seed: 17, density: 0.8 }));
    const frame = S('g', { transform: `translate(${fx.toFixed(1)} ${fy.toFixed(1)}) scale(${fs})` }, svg);

    // --- healthy cells, each with a "self" MHC right on top
    const healthy = {};
    for (const [key, seed] of [['L', 3], ['C', 5], ['R', 9]]) {
      const [x, y] = CELLS[key];
      const g = S('g', { transform: tf(x, y) }, frame);
      const node = healthyCell({ r: R_H, seed, mhc: false, sides: 6 });
      placeOnMembrane(node, (o) => mhc1({ ...o, peptide: 'self' }), { count: 1, arcStart: -91, arcEnd: -89, size: 17, seed });
      placeOnMembrane(node, (o) => mhc1({ ...o, peptide: 'self' }), { count: 7, arcStart: -45, arcEnd: 225, size: 15, seed });
      g.appendChild(node);
      healthy[key] = { g, node, top: edge(node, x, y, -90) };
    }

    // --- the cancer cell (appears in step 2) and its dying stages (step 3)
    const [cx, cy] = CELLS.C;
    const cancerG = S('g', { transform: `${tf(cx, cy)} scale(0.9)`, opacity: 0 }, frame);
    const cancer = cancerCell({ r: R_C, seed: 12, mhc: false, pdl1: false });
    placeOnMembrane(cancer, (o) => mhc1({ ...o, peptide: 'neo' }), { count: 1, arcStart: -91, arcEnd: -89, size: 18, seed: 2 });
    const pattern = ['self', 'self', 'self', 'self', 'self', 'neo', 'self', 'self'];
    const ring = placeOnMembrane(cancer, (o, i) => mhc1({ ...o, peptide: pattern[i] }), { count: 8, arcStart: -25, arcEnd: 225, size: 17, seed: 4 });
    cancerG.appendChild(cancer);
    // a soft pink halo on each unfamiliar fragment, so the eye finds them
    const neoHalo = ctx.radialGradient(svg, [[0, '#FF3D7F', 0.75], [0.45, '#FF3D7F', 0.3], [1, '#FF3D7F', 0]], { id: `${ctx.id}-neo` });
    for (const gl of cancer.querySelectorAll('[data-part="receptors"] > [data-peptide="neo"]')) {
      const a = +gl.getAttribute('data-angle') * D2R;
      const m = gl.getAttribute('transform').match(/translate\(([-\d.]+)[ ,]+([-\d.]+)\)/);
      const size = +(gl.getAttribute('data-size') || 17);
      const d = 0.74 * size;
      S('circle', { cx: +m[1] + Math.cos(a) * d, cy: +m[2] + Math.sin(a) * d, r: 9, fill: neoHalo }, cancerG);
    }
    const dying1 = cancerCell({ r: R_C, seed: 12, state: 'dying', progress: 0.45 });
    const dying2 = cancerCell({ r: R_C, seed: 12, state: 'dying', progress: 0.95 });
    const dying1G = S('g', { transform: tf(cx, cy), opacity: 0 }, frame);
    const dying2G = S('g', { transform: tf(cx, cy), opacity: 0 }, frame);
    dying1G.appendChild(dying1);
    dying2G.appendChild(dying2);
    const cTop = edge(cancer, cx, cy, -90);
    // the second neo-fragment (lower left) for the "unfamiliar fragment" label
    const neo2Glyph = ring[pattern.indexOf('neo')];
    const neo2 = (() => {
      const a = +neo2Glyph.getAttribute('data-angle') * D2R;
      const m = neo2Glyph.getAttribute('transform').match(/translate\(([-\d.]+)[ ,]+([-\d.]+)\)/);
      const d = 0.74 * 17;
      return { x: cx + +m[1] + Math.cos(a) * d, y: cy + +m[2] + Math.sin(a) * d };
    })();

    // --- the killer T cell: position group > rotation group > cell (+ dimming veil)
    const tPos = S('g', { transform: tf(...START), opacity: 0 }, frame);
    const tRot = S('g', { transform: tr(0) }, tPos);
    const tNode = tCell({ variant: 'cd8', state: 'activated', r: R_T, polarity: 0, seed: 4, receptors: false });
    const tInfo = cellInfo(tNode);
    const front = rayHit(tInfo.outline, 0);              // the front membrane point (local +x)
    placeOnMembrane(tNode, (o) => tcr({ ...o }), { count: 1, arcStart: -1, arcEnd: 1, size: 17, seed: 1 });
    placeOnMembrane(tNode, (o) => tcr({ ...o }), { count: 3, arcStart: -78, arcEnd: -22, size: 11, seed: 2, offset: 0.5 });
    placeOnMembrane(tNode, (o) => tcr({ ...o }), { count: 3, arcStart: 22, arcEnd: 78, size: 11, seed: 3, offset: 0.5 });
    placeOnMembrane(tNode, (o) => tcr({ ...o }), { count: 3, arcStart: 120, arcEnd: 240, size: 10, seed: 4 });
    tRot.appendChild(tNode);
    const rr = tInfo.rEff || R_T * 1.18;
    const veil = S('circle', { r: rr * 1.08, fill: '#0B1024', opacity: 0 }, tRot);
    const tLabel = S('text', { class: 't-label t-halo t-mid', x: 0, y: -rr - 30, opacity: 0, text: 'Killer T cell' }, tPos);
    // In compact layouts the frame is scaled down; keep the riding label legible.
    if (fs !== 1) tLabel.setAttribute('transform', `scale(${(1 / fs).toFixed(3)})`), tLabel.setAttribute('y', ((-rr - 26) * fs).toFixed(1));

    // Dock positions: the T cell's front TCR tip touching the top MHC of a cell.
    const GAP = 0.8 * 17 + 0.9 * 17 - 4;                   // TCR height + MHC height − a little interlock
    const dockOver = (top) => ({ x: top.x, y: top.y - GAP - front.x });
    const docks = { L: dockOver(healthy.L.top), C: dockOver(healthy.C.top), R: dockOver(healthy.R.top), cancer: { x: cTop.x, y: cTop.y - (GAP + 1) - front.x } };

    // Contact glow between TCR and MHC on the cancer cell
    const contact = { x: cTop.x, y: cTop.y - 0.9 * 18 + 2 };
    const glow = S('g', { transform: tf(contact.x, contact.y), opacity: 0 }, frame);
    const glowCore = S('circle', { r: 30, fill: glowPaint }, glow);

    // --- the brake: PD-1 (on the T cell) gripped by PD-L1 (on the tumor)
    const dock = docks.cancer;
    const tAt = (deg) => { const h = rayHit(tInfo.outline, (deg - 90) * D2R); const a = 90 * D2R; return { x: dock.x + h.x * Math.cos(a) - h.y * Math.sin(a), y: dock.y + h.x * Math.sin(a) + h.y * Math.cos(a) }; };
    const pT = tAt(50);                                      // T membrane, lower right (T faces down)
    const pC = edge(cancer, cx, cy, -48);                    // tumor membrane, upper right
    const dx = pC.x - pT.x, dy = pC.y - pT.y, dist = Math.hypot(dx, dy);
    const u = dist / 1.7;                                    // heads meet: 0.88u (PD-1) + 0.84u (PD-L1)
    const ang = Math.atan2(dy, dx) * R2D;
    const brake = S('g', { opacity: 0 }, frame);
    const pd1G = S('g', { transform: `${tf(pT.x, pT.y)} ${tr(ang + 90)}` }, brake);
    pd1G.appendChild(pd1({ size: u, icon: false }));
    const pdl1Outer = S('g', { transform: tf(pC.x, pC.y) }, brake);
    const pdl1G = S('g', { transform: `${tf(0, 0)} ${tr(ang - 90)}` }, pdl1Outer);
    pdl1G.appendChild(pdl1({ size: u }));
    const mid = { x: (pT.x + pC.x) / 2, y: (pT.y + pC.y) / 2 };
    const nrm = { x: -dy / dist, y: dx / dist };             // perpendicular, pointing away from the T cell side
    const side = nrm.x > 0 ? 1 : -1;
    const iconAt = { x: mid.x + nrm.x * side * (u * 0.55 + 12), y: mid.y + nrm.y * side * (u * 0.55 + 12) };
    const brakeIcon = S('g', { transform: tf(iconAt.x, iconAt.y) }, brake);
    brakeIcon.appendChild(signalIcon({ type: 'inhibitory', size: 18 }));

    // --- the drug antibody (step 3): one arm tip caps the PD-1 head from the open side,
    //     Fc pointing away from the contact (FIGURE-AUDIT §4 rule 9)
    const headP = { x: pT.x + (dx / dist) * u * 0.72, y: pT.y + (dy / dist) * u * 0.72 };
    const abSize = Math.max(30, u * 1.3);
    const dir = { x: -nrm.x * side, y: -nrm.y * side };      // from the antibody toward PD-1's head
    const abRot = Math.atan2(dir.y, dir.x) * R2D + 90 - 36;  // the right arm (36° off the stem) points at the head
    const tipR = antibodyTips(abSize).right;                  // base-anchored frame; +0.5·size for anchor:'center'
    const tx0 = tipR[0], ty0 = tipR[1] + 0.5 * abSize, th = abRot * D2R;
    const touch = { x: headP.x - dir.x * u * 0.18, y: headP.y - dir.y * u * 0.18 };
    const abC = { x: touch.x - (tx0 * Math.cos(th) - ty0 * Math.sin(th)), y: touch.y - (tx0 * Math.sin(th) + ty0 * Math.cos(th)) };
    const ab = S('g', { transform: `${tf(abC.x + 150, abC.y - 170)} ${tr(abRot - 40)}`, opacity: 0 }, frame);
    ab.appendChild(antibody({ variant: 'therapeutic', size: abSize, anchor: 'center' }));
    const plusAt = { x: contact.x - 26, y: contact.y - 2 };
    const plus = S('g', { transform: tf(plusAt.x, plusAt.y), opacity: 0 }, frame);
    plus.appendChild(signalIcon({ type: 'activating', size: 17 }));

    // --- labels (horizontal, outside the scaled frame)
    const anchors = {
      windowL: (() => { const p = edge(healthy.L.node, ...CELLS.L, 196); return toWorld({ x: p.x - 13, y: p.y - 5 }); })(),
      neo2: toWorld(neo2),
      brake: toWorld({ x: iconAt.x + nrm.x * side * 9, y: iconAt.y + nrm.y * side * 9 }),
      drug: toWorld({ x: abC.x + dir.x * -10, y: abC.y + dir.y * -10 }),
    };
    const labels = {};
    for (const [key, spec] of Object.entries(L.labels)) {
      const grp = S('g', { opacity: 0 }, svg);
      const [tx, ty] = spec.text;
      if (spec.at) {
        const a = anchors[spec.at];
        const w = TEXT[key].length * 7.4;
        const lx = spec.anchor === 'start' ? tx + Math.min(w / 2, 40) : spec.anchor === 'end' ? tx - Math.min(w / 2, 40) : tx;
        const ly = ty + (a.y > ty ? 9 : -19);
        const ddx = a.x - lx, ddy = a.y - ly, len = Math.hypot(ddx, ddy) || 1;
        if (len > 22) {
          S('line', { class: 'leader', x1: lx, y1: ly, x2: a.x - (ddx / len) * 6, y2: a.y - (ddy / len) * 6 }, grp);
          S('circle', { class: 'leader-dot', cx: a.x, cy: a.y, r: 2.4 }, grp);
        }
      }
      S('text', { class: `t-label t-halo${spec.anchor === 'middle' ? ' t-mid' : spec.anchor === 'end' ? ' t-end' : ''}`, x: tx, y: ty, text: TEXT[key] }, grp);
      labels[key] = grp;
    }
    // "Healthy cells" sits under L in the wide layout; in compact it is centred under the row.
    el = { frame, healthy, cancerG, dying1G, dying2G, tPos, tRot, veil, tLabel, docks, glow, glowCore, brake, brakeIcon, pdl1G, pd1G, pd1T: { x: pT.x, y: pT.y, rot: ang + 90 }, ab, abC, abRot, plus, labels, healthyCLabel: null };
  }

  const show = (tl, node, pos, d = 0.5) => tl.to(node, { opacity: 1, duration: d, ease: 'power1.out' }, pos);
  const hide = (tl, node, pos, d = 0.35) => tl.to(node, { opacity: 0, duration: d, ease: 'power1.in' }, pos);
  const move = (tl, p, rot, pos, d) => {
    tl.to(el.tPos, { attr: { transform: tf(p.x, p.y) }, duration: d, ease: 'so.inOut' }, pos);
    if (rot != null) tl.to(el.tRot, { attr: { transform: tr(rot) }, duration: Math.min(d, 0.8), ease: 'so.inOut' }, pos);
  };

  // ------------------------------------------------------------------ steps
  const steps = [
    { // 1 · Checking the shop window
      enter(tl) {
        const { docks } = el;
        tl.fromTo(el.tPos, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power1.out' }, 0);
        show(tl, el.tLabel, 0.2);
        show(tl, el.labels.healthy, 0.5);
        let t = 0.15;
        move(tl, docks.L, 62, t, 1.15); t += 1.15;
        tl.to(el.tRot, { attr: { transform: tr(90) }, duration: 0.35 }, t - 0.35);
        show(tl, el.labels.window, t - 0.2);
        t += 0.45;
        move(tl, { x: (CELLS.L[0] + CELLS.C[0]) / 2, y: docks.L.y - 58 }, -28, t, 0.7); t += 0.7;
        move(tl, docks.C, 90, t, 0.7); t += 0.7 + 0.45;
        move(tl, { x: (CELLS.C[0] + CELLS.R[0]) / 2, y: docks.C.y - 58 }, -28, t, 0.7); t += 0.7;
        move(tl, docks.R, 90, t, 0.7); t += 0.7 + 0.45;
        const exit = L.exit || EXIT;
        move(tl, { x: exit[0], y: exit[1] }, -12, t, 1.0);
      },
    },
    { // 2 · Altered self
      enter(tl) {
        hide(tl, el.labels.window, 0);
        hide(tl, el.labels.healthy, 0);
        tl.to(el.healthy.C.g, { opacity: 0, duration: 1.3, ease: 'so.inOut' }, 0.1)
          .fromTo(el.cancerG, { opacity: 0, attr: { transform: `${tf(...CELLS.C)} scale(0.9)` } },
            { opacity: 1, attr: { transform: `${tf(...CELLS.C)} scale(1)` }, duration: 1.4, ease: 'so.inOut' }, 0.1);
        show(tl, el.labels.cancer, 1.0);
        show(tl, el.labels.frag, 1.5);
        // the T cell turns around and comes to inspect
        tl.to(el.tRot, { attr: { transform: tr(170) }, duration: 0.8, ease: 'so.inOut' }, 0.3);
        tl.to(el.tPos, { attr: { transform: tf(el.docks.cancer.x + 40, el.docks.cancer.y - 30) }, duration: 1.5, ease: 'so.inOut' }, 0.5);
        tl.to(el.tRot, { attr: { transform: tr(90) }, duration: 0.7, ease: 'so.inOut' }, 1.6);
        tl.to(el.tPos, { attr: { transform: tf(el.docks.cancer.x, el.docks.cancer.y) }, duration: 0.7, ease: 'so.out' }, 1.8);
        // recognition…
        tl.fromTo(el.glow, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' }, 2.4)
          .fromTo(el.glowCore, { attr: { r: 12 } }, { attr: { r: 30 }, duration: 0.7, ease: 'so.out' }, 2.4);
        // …but the brake engages and the T cell stalls
        tl.fromTo(el.brake, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power1.out' }, 3.1);
        tl.to(el.glow, { opacity: 0.4, duration: 0.8, ease: 'so.inOut' }, 3.4)
          .to(el.veil, { opacity: 0.42, duration: 0.8, ease: 'so.inOut' }, 3.4);
        show(tl, el.labels.brake, 3.5);
      },
    },
    { // 3 · A helping hand
      enter(tl) {
        hide(tl, el.labels.frag, 0);
        hide(tl, el.labels.brake, 0);
        tl.to(el.ab, { opacity: 1, attr: { transform: `${tf(el.abC.x, el.abC.y)} ${tr(el.abRot)}` }, duration: 1.4, ease: 'so.out' }, 0.1);
        show(tl, el.labels.drug, 1.1);
        // PD-L1 lets go; the brake icon disappears
        tl.to(el.brakeIcon, { opacity: 0, duration: 0.4 }, 1.2)
          .to(el.pdl1G, { opacity: 0.5, duration: 0.6 }, 1.2);
        // the T cell wakes up: activation signal, bright recognition
        tl.to(el.veil, { opacity: 0, duration: 0.7, ease: 'so.inOut' }, 1.5)
          .to(el.glow, { opacity: 1, duration: 0.6, ease: 'power2.out' }, 1.6)
          .fromTo(el.plus, { opacity: 0 }, { opacity: 1, duration: 0.4 }, 1.7);
        // the kill: the cancer cell shrinks, blebs and falls apart
        hide(tl, el.labels.cancer, 2.4);
        tl.to(el.cancerG, { opacity: 0, duration: 1.0, ease: 'so.inOut' }, 2.4)
          .fromTo(el.dying1G, { opacity: 0 }, { opacity: 1, duration: 1.0, ease: 'so.inOut' }, 2.4)
          .to(el.pdl1G, { opacity: 0, duration: 0.8 }, 2.6)      // PD-L1 goes with the dying cell; PD-1 (capped) stays on the T cell
          .to(el.dying1G, { opacity: 0, duration: 1.2, ease: 'so.inOut' }, 3.5)
          .fromTo(el.dying2G, { opacity: 0 }, { opacity: 1, duration: 1.2, ease: 'so.inOut' }, 3.5)
          .to(el.glow, { opacity: 0, duration: 1.0 }, 3.6)
          .to(el.plus, { opacity: 0, duration: 0.6 }, 4.0);
        show(tl, el.labels.dies, 3.9);
        // the antibody stays on PD-1; the T cell lifts off and moves on
        tl.to(el.tPos, { attr: { transform: tf(el.docks.cancer.x + 18, el.docks.cancer.y - 22) }, duration: 1.4, ease: 'so.inOut' }, 4.2)
          .to(el.pd1G, { attr: { transform: `${tf(el.pd1T.x + 18, el.pd1T.y - 22)} ${tr(el.pd1T.rot)}` }, duration: 1.4, ease: 'so.inOut' }, 4.2)
          .to(el.ab, { attr: { transform: `${tf(el.abC.x + 18, el.abC.y - 22)} ${tr(el.abRot)}` }, duration: 1.4, ease: 'so.inOut' }, 4.2);
      },
    },
  ];

  const stepper = ctx.ui.stepper({ steps, reset: draw });

  ctx.onResize(({ compact }) => {
    const name = compact ? 'compact' : 'wide';
    if (name === layoutName) return;
    layoutName = name;
    L = LAYOUTS[name];
    stepper.rebuild();
    ctx.refreshTextScale();
  });

  return {};
}
