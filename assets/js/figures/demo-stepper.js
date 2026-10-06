// demo-stepper — reference implementation of a STEPPER figure.
// "How a macrophage eats": patrol → recognize → engulf → digest → report.
//
// Copy this file when building a step-through figure. It shows:
//   • the mount(fig, ctx) contract and returning { destroy }   (docs/FIGURES.md)
//   • one scene drawn in a LOCAL frame, re-laid-out for phones by rotating the
//     whole scene (landscape ↔ portrait) instead of shrinking it
//   • ctx.ui.stepper with one enter(tl) per step, using only seek-safe tweens
//     (to / fromTo / set) so back, dot-jumps and reduced motion stay correct
//   • ambient idle motion on wrapper groups via ctx.ambient (auto-paused)
//   • labels in SVG user units sized to stay ≥ 13 px on a phone
//
// Art is drawn here with plain shapes because it is a self-contained demo.
// Real chapter figures should use the illustration library in assets/js/art/
// (docs/ART.md) so cells look the same across the site.

const TAU = Math.PI * 2;

// Two layouts. Everything biological is drawn in a local frame where the
// macrophage sits at (0,0) with radius R = 150 and faces +x (toward the
// bacterium). A layout only decides where that frame goes, how it is rotated
// and scaled, and where the (always horizontal) text labels sit.
const LAYOUTS = {
  wide: {
    viewBox: [960, 540],
    origin: [330, 284],
    rotate: 0,
    scale: 1,
    labels: {
      macrophage: { at: [-150, -95], text: [112, 104], anchor: 'start' },
      bacterium: { at: [372, -40], text: [742, 96], anchor: 'middle' },
      receptor: { at: [162, 0], text: [520, 470], anchor: 'middle' },
      phagosome: { at: [92, 26], text: [520, 470], anchor: 'middle' },
      lysosome: { at: [-12, 62], text: [190, 482], anchor: 'middle' },
      fragments: { at: [92, 26], text: [520, 470], anchor: 'middle' },
      mhc: { at: 'mhc', text: [560, 70], anchor: 'start' },
      tcell: { at: [356, -92], text: [686, 236], anchor: 'middle' },
    },
  },
  compact: {
    viewBox: [400, 560],
    origin: [200, 196],
    rotate: 90,
    scale: 0.74,
    labels: {
      macrophage: { at: [-150, 70], text: [18, 40], anchor: 'start' },
      bacterium: { at: [372, 40], text: [300, 470], anchor: 'middle' },
      receptor: { at: [162, 0], text: [200, 545], anchor: 'middle' },
      phagosome: { at: [92, 26], text: [200, 545], anchor: 'middle' },
      lysosome: { at: [-12, 62], text: [70, 345], anchor: 'middle' },
      fragments: { at: [92, 26], text: [200, 545], anchor: 'middle' },
      mhc: { at: 'mhc', text: [388, 352], anchor: 'end' },
      tcell: { at: [356, -92], text: [214, 548], anchor: 'end' },
    },
  },
};

// ---------------------------------------------------------------- geometry
const R = 150;           // macrophage radius in the local frame
const N = 64;            // outline sample points (same count for every shape → tweenable)
const BACT_AT = 181;     // bacterium center at contact (receptor tips at R + 12)
const PHAGO_AT = [92, 26];

const angDist = (a, b) => Math.atan2(Math.sin(a - b), Math.cos(a - b));
const gauss = (d, s) => Math.exp(-(d * d) / (2 * s * s));

/** Membrane radius at angle a for a given shape state. */
function radius(a, { reach = 0, wrap = 0 } = {}) {
  let r = R * (1 + 0.04 * Math.sin(5 * a + 1.3) + 0.028 * Math.sin(9 * a + 0.4) + 0.016 * Math.sin(14 * a + 2.2));
  r += reach * 80 * (gauss(angDist(a, 0.43), 0.075) + gauss(angDist(a, -0.43), 0.075)); // two pseudopods
  r += wrap * 82 * gauss(angDist(a, 0), 0.34);                                            // flow over the target
  return r;
}
function outlinePoints(state) {
  return Array.from({ length: N }, (_, i) => {
    const a = (i / N) * TAU;
    const r = radius(a, state);
    return [r * Math.cos(a), r * Math.sin(a)];
  });
}
/** Smooth closed path through points (Catmull-Rom → cubic Bézier). */
function smoothPath(pts) {
  const f = (v) => v.toFixed(1);
  const n = pts.length;
  let d = `M${f(pts[0][0])},${f(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const [p0, p1, p2, p3] = [pts[(i - 1 + n) % n], pts[i], pts[(i + 1) % n], pts[(i + 2) % n]];
    d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)},${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)},${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])},${f(p2[1])}`;
  }
  return `${d}Z`;
}

// The four membrane shapes the story moves through.
const SHAPES = {
  rest: { reach: 0, wrap: 0 },
  reach: { reach: 1, wrap: 0 },
  wrap: { reach: 0.55, wrap: 1 },
};
const SHAPE_PTS = Object.fromEntries(Object.entries(SHAPES).map(([k, s]) => [k, outlinePoints(s)]));
const SHAPE_D = Object.fromEntries(Object.entries(SHAPE_PTS).map(([k, p]) => [k, smoothPath(p)]));

// Receptors sit exactly on outline sample points, so tweening them between
// the same states keeps them glued to the membrane.
const RECEPTOR_IDX = [0, 3, -3, 6, -6, 10, -10, 15, -15, 21, -21, 27, -27, 32];
const MHC_IDX = [-4, -8, -12, 5];
const idx = (i) => ((i % N) + N) % N;
const angleOf = (i) => (idx(i) / N) * 360;

export default function mount(fig, ctx) {
  const { gsap } = ctx;
  const c = ctx.colors;
  const lysosomeColor = '#FFB4A6';

  ctx.setAspect(16 / 9, 5 / 7);   // landscape on desktop, portrait on phones
  ctx.addDust();

  const svg = ctx.createSVG({ viewBox: '0 0 960 540' });
  // Shared paint, created once (draw() may run again on rebuild): soft radial
  // gradients are much cheaper than blur filters.
  const g = {
    macroBody: ctx.radialGradient(svg, [[0, '#FFB3A8', 0.95], [0.55, c.macrophage, 0.82], [1, '#D9574A', 0.78]], { fx: '38%', fy: '34%' }),
    macroHalo: ctx.radialGradient(svg, [[0.55, c.macrophage, 0.32], [1, c.macrophage, 0]]),
    bact: ctx.linearGradient(svg, [[0, '#D9F07A'], [1, c.bacteria]], { x1: '0%', y1: '0%', x2: '0%', y2: '100%' }),
    bactHalo: ctx.radialGradient(svg, [[0.3, c.bacteria, 0.35], [1, c.bacteria, 0]]),
    tcell: ctx.radialGradient(svg, [[0, '#9FF3F0', 0.95], [0.6, c.cd4, 0.85], [1, '#178F94', 0.8]], { fx: '38%', fy: '34%' }),
    tcellHalo: ctx.radialGradient(svg, [[0.5, c.cd4, 0.3], [1, c.cd4, 0]]),
    contact: ctx.radialGradient(svg, [[0, '#FFFFFF', 1], [0.35, c.bacteria, 0.8], [1, c.bacteria, 0]]),
    lyso: ctx.radialGradient(svg, [[0, '#FFFFFF', 0.95], [0.45, lysosomeColor, 0.9], [1, lysosomeColor, 0.15]]),
    acid: ctx.radialGradient(svg, [[0, '#FFC9A8', 0.55], [1, '#FF8E6E', 0.18]]),
    neighbour: ctx.radialGradient(svg, [[0, c.healthy, 0], [0.72, c.healthy, 0.05], [0.93, c.healthy, 0.09], [1, c.healthy, 0]]),
  };
  const glow = ctx.glowFilter(svg, { blur: 5, strength: 1.4 });

  let layoutName = null;
  let L = null;
  let el = {};
  const ambients = [];

  // ------------------------------------------------------------------ draw
  // Called by the stepper (as `reset`) before every (re)build, so it always
  // draws a fresh scene in the "before step 1" state for the current layout.
  function draw() {
    ambients.splice(0).forEach((t) => t.kill());
    for (const child of [...svg.children]) if (child !== svg.defs) child.remove();
    const [vw, vh] = L.viewBox;
    svg.setAttribute('viewBox', `0 0 ${vw} ${vh}`);
    const S = (tag, attrs, parent) => ctx.svg(tag, attrs, parent);

    // Out-of-focus neighbours in the background, for depth: soft discs with a faint rim.
    const back = S('g', null, svg);
    for (const [x, y, r] of [[0.9, 0.16, 78], [0.05, 0.9, 96], [0.66, 0.97, 60], [0.99, 0.74, 46], [0.02, 0.12, 40]]) {
      S('circle', { cx: x * vw, cy: y * vh, r, fill: g.neighbour }, back);
    }

    // The local frame: macrophage at origin, facing +x.
    const scene = S('g', { transform: `translate(${L.origin[0]} ${L.origin[1]}) rotate(${L.rotate}) scale(${L.scale})` }, svg);

    // Helper T cell (enters in step 5).
    const tcell = S('g', { opacity: 0 }, scene);
    const tcellInner = S('g', { transform: 'translate(356 -150)' }, tcell);
    S('circle', { r: 86, fill: g.tcellHalo }, tcellInner);
    for (let k = 0; k < 28; k++) {
      const a = (k / 28) * TAU;
      S('line', { x1: Math.cos(a) * 46, y1: Math.sin(a) * 46, x2: Math.cos(a) * 52, y2: Math.sin(a) * 52, stroke: '#7FE6E3', strokeWidth: 1.4, strokeLinecap: 'round', opacity: 0.7 }, tcellInner);
    }
    S('circle', { r: 46, fill: g.tcell, stroke: '#A6F2EF', strokeWidth: 1.5 }, tcellInner);
    S('circle', { cx: 4, cy: 2, r: 27, fill: '#178F94', opacity: 0.55 }, tcellInner);
    for (const a of [2.3, 2.6, 2.9]) {   // T-cell receptors facing the macrophage
      const x = Math.cos(a) * 50; const y = Math.sin(a) * 50;
      const tcr = S('g', { transform: `translate(${x} ${y}) rotate(${(a * 180) / Math.PI})` }, tcellInner);
      S('path', { d: 'M0,0 L8,0 M8,0 L13,-4 M8,0 L13,4', stroke: '#C9FBF9', strokeWidth: 2, strokeLinecap: 'round', fill: 'none' }, tcr);
    }

    // Macrophage. `cell` breathes (ambient); children are driven by the timeline.
    const cell = S('g', null, scene);
    S('circle', { r: R * 1.42, fill: g.macroHalo }, cell);
    const body = S('path', { d: SHAPE_D.rest, fill: g.macroBody, stroke: '#FFC2B8', strokeWidth: 1.6, strokeOpacity: 0.9 }, cell);
    S('path', {   // kidney-shaped nucleus
      d: 'M-96,-20 C-104,-62 -60,-84 -30,-66 C-8,-54 -20,-30 -2,-18 C18,-4 6,34 -30,40 C-70,46 -90,18 -96,-20Z',
      fill: '#C9483D', fillOpacity: 0.5, stroke: '#FF9C8F', strokeOpacity: 0.55, strokeWidth: 1.2,
    }, cell);
    for (const [x, y, r] of [[-40, 78, 9], [-88, 62, 6], [30, -84, 7], [-12, -104, 5], [56, 70, 5]]) {
      S('circle', { cx: x, cy: y, r, fill: '#FFE1DB', fillOpacity: 0.18, stroke: '#FFD6CF', strokeOpacity: 0.35 }, cell);
    }
    const lysosomes = [[-30, 88], [12, 108], [-62, 30]].map(([x, y]) => S('circle', { cx: 0, cy: 0, r: 11, fill: g.lyso, transform: `translate(${x} ${y}) scale(1)` }, cell));
    const receptors = RECEPTOR_IDX.map((i) => {
      const [x, y] = SHAPE_PTS.rest[idx(i)];
      const r = S('g', { transform: `translate(${x} ${y}) rotate(${angleOf(i)})` }, cell);
      r.inner = S('g', null, r);
      S('path', { d: 'M0,0 L7,0 M13,-5 C8,-5 7,-2 7,0 C7,2 8,5 13,5', stroke: '#FFD9D2', strokeWidth: 2, strokeLinecap: 'round', fill: 'none' }, r.inner);
      return r;
    });
    const mhc = MHC_IDX.map((i) => {
      const [x, y] = SHAPE_PTS.rest[idx(i)];
      const m = S('g', { transform: `translate(${x} ${y}) rotate(${angleOf(i)})`, opacity: 0 }, cell);
      S('path', { d: 'M13,-8 L4,-8 Q0,-8 0,-4 L0,4 Q0,8 4,8 L13,8', stroke: c.mhc, strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' }, m);
      return m;
    });

    // Phagosome: the bubble that forms around the swallowed bacterium.
    const phago = S('g', { transform: `translate(${BACT_AT} 0)`, opacity: 0 }, scene);
    const phagoFill = S('circle', { r: 46, fill: g.acid, opacity: 0 }, phago);
    const phagoRing = S('circle', { r: 46, fill: 'none', stroke: '#FFD2CA', strokeWidth: 2, strokeDasharray: '4 5', opacity: 0.9 }, phago);

    // Bacterium: position group (timeline) → jiggle group (ambient) → drawing.
    const bact = S('g', { transform: 'translate(560 -60) rotate(98) scale(1)' }, scene);
    const bactJiggle = S('g', null, bact);
    const bactArt = S('g', null, bactJiggle);
    S('ellipse', { rx: 92, ry: 58, fill: g.bactHalo }, bactArt);
    const flagellum = S('path', { d: 'M-52,0 C-70,-6 -78,8 -94,2 C-108,-4 -112,10 -124,6', stroke: '#C8E46A', strokeWidth: 1.6, fill: 'none', strokeLinecap: 'round', opacity: 0.8 }, bactArt);
    S('rect', { x: -52, y: -19, width: 104, height: 38, rx: 19, fill: g.bact, stroke: '#E8F7A6', strokeWidth: 1.5 }, bactArt);
    S('rect', { x: -38, y: -8, width: 76, height: 16, rx: 8, fill: '#8FAE2E', opacity: 0.45 }, bactArt);
    const patterns = [-36, -18, 0, 18, 36].map((x) => S('circle', { cx: x, cy: 19, r: 3.2, fill: '#F4FFC9' }, bactArt));
    [-27, 9, 27].forEach((x) => S('circle', { cx: x, cy: -19, r: 3, fill: '#F4FFC9', opacity: 0.8 }, bactArt));

    // Digested fragments (step 4) that end up on MHC class II (step 5).
    const fragOffsets = [[-18, -14], [14, -18], [20, 10], [-14, 16], [2, -2], [-26, 2]];
    const frags = fragOffsets.map(([x, y]) => {
      const f = S('g', { transform: `translate(${PHAGO_AT[0] + x} ${PHAGO_AT[1] + y})`, opacity: 0 }, scene);
      f.dot = S('circle', { r: 4.5, fill: c.bacteria }, f);
      return f;
    });

    // The moment of recognition: a glow where receptor meets pattern.
    const contactAt = S('g', { transform: `translate(${R + 12} 0)` }, scene);
    const contact = S('circle', { r: 22, fill: g.contact, opacity: 0 }, contactAt);
    const pulse = S('circle', { r: 16, fill: 'none', stroke: '#F4FFC9', strokeWidth: 2, opacity: 0 }, contactAt);

    // Labels live outside the rotated scene so they stay horizontal.
    const labels = {};
    const toWorld = ([x, y]) => {
      const a = (L.rotate * Math.PI) / 180;
      return [L.origin[0] + L.scale * (x * Math.cos(a) - y * Math.sin(a)), L.origin[1] + L.scale * (x * Math.sin(a) + y * Math.cos(a))];
    };
    const texts = {
      macrophage: 'Macrophage', bacterium: 'Bacterium', receptor: 'Receptor fits a surface pattern',
      phagosome: 'Phagosome', lysosome: 'Lysosomes', fragments: 'Bacterial fragments',
      mhc: 'MHC class II', tcell: 'Helper T cell',
    };
    for (const [key, spec] of Object.entries(L.labels)) {
      const grp = S('g', { opacity: 0 }, svg);
      // 'mhc' → the second MHC cup, nudged outward so the dot sits on the cup.
      const at = spec.at === 'mhc'
        ? (() => { const [x, y] = SHAPE_PTS.rest[idx(MHC_IDX[1])]; const a = (angleOf(MHC_IDX[1]) * Math.PI) / 180; return [x + Math.cos(a) * 16, y + Math.sin(a) * 16]; })()
        : spec.at;
      const [ax, ay] = toWorld(at);
      const [tx, ty] = spec.text;
      // A thin leader from the label toward the thing it names.
      // Leader starts under (or above) the middle of the text, ends just short of the anchor.
      const w = texts[key].length * 7.6;            // ≈ width of 15px Inter
      const lx = spec.anchor === 'start' ? tx + Math.min(w / 2, 40) : spec.anchor === 'end' ? tx - Math.min(w / 2, 40) : tx;
      const ly = ty + (ay > ty ? 9 : -19);
      const dx = ax - lx; const dy = ay - ly; const len = Math.hypot(dx, dy);
      if (len > 24) {
        S('line', { class: 'leader', x1: lx, y1: ly, x2: ax - (dx / len) * 6, y2: ay - (dy / len) * 6 }, grp);
        S('circle', { class: 'leader-dot', cx: ax, cy: ay, r: 2.4 }, grp);
      }
      S('text', { class: 't-label t-halo', x: tx, y: ty, 'text-anchor': spec.anchor, text: texts[key] }, grp);
      labels[key] = grp;
    }

    el = { scene, cell, body, receptors, mhc, lysosomes, phago, phagoFill, phagoRing, bact, bactJiggle, flagellum, patterns, frags, contact, pulse, tcell, labels };

    // Idle life. Wrapper groups only — the timeline never touches these.
    ambients.push(
      ctx.ambient(gsap.to(cell, { scale: 1.012, transformOrigin: '50% 50%', duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1 })),
      ctx.ambient(gsap.to(bactJiggle, { rotation: 4, svgOrigin: '0 0', duration: 1.7, ease: 'sine.inOut', yoyo: true, repeat: -1 })),
    );
  }

  // Tween every receptor (and MHC cup) to where its sample point is in `shape`.
  const glue = (tl, list, idxs, shape, pos, opts = {}) => {
    list.forEach((node, k) => {
      const [x, y] = SHAPE_PTS[shape][idx(idxs[k])];
      tl.to(node, { attr: { transform: `translate(${x} ${y}) rotate(${angleOf(idxs[k])})` }, ...opts }, pos);
    });
  };
  const morph = (tl, shape, pos, opts = {}) => {
    tl.to(el.body, { attr: { d: SHAPE_D[shape] }, ...opts }, pos);
    glue(tl, el.receptors, RECEPTOR_IDX, shape, pos, opts);
    glue(tl, el.mhc, MHC_IDX, shape, pos, opts);
  };
  const show = (tl, node, pos, d = 0.6) => tl.to(node, { opacity: 1, duration: d, ease: 'power1.out' }, pos);
  const hide = (tl, node, pos, d = 0.4) => tl.to(node, { opacity: 0, duration: d, ease: 'power1.in' }, pos);

  // ------------------------------------------------------------------ steps
  // Each enter(tl) takes the scene from the END of the previous step to the
  // END of this one. Positions are relative to the step's own start.
  const steps = [
    { // 1 · Patrol
      enter(tl) {
        tl.fromTo(el.cell, { opacity: 0 }, { opacity: 1, duration: 1.1, ease: 'power2.out' }, 0)
          .fromTo(el.bact, { attr: { transform: 'translate(560 -60) rotate(98) scale(1)' }, opacity: 0 },
            { attr: { transform: 'translate(372 -40) rotate(96) scale(1)' }, opacity: 1, duration: 1.8, ease: 'so.out' }, 0.2);
        show(tl, el.labels.macrophage, 0.7);
        show(tl, el.labels.bacterium, 1.3);
      },
    },
    { // 2 · Recognize
      enter(tl) {
        hide(tl, el.labels.bacterium, 0);
        tl.to(el.bact, { attr: { transform: `translate(${BACT_AT} 0) rotate(90) scale(1)` }, duration: 1.6, ease: 'so.inOut' }, 0)
          .to(el.receptors[0].inner, { scale: 1.35, svgOrigin: '0 0', duration: 0.5, ease: 'back.out(2)' }, 1.4)
          .to(el.patterns[2], { attr: { r: 5, fill: '#FFFFFF' }, duration: 0.4 }, 1.5)
          .fromTo(el.contact, { opacity: 0, scale: 0.4, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }, 1.55)
          .fromTo(el.pulse, { opacity: 0.9, scale: 0.4, transformOrigin: '50% 50%' }, { opacity: 0, scale: 2.6, duration: 1.1, ease: 'power1.out' }, 1.6);
        show(tl, el.labels.receptor, 1.9);
      },
    },
    { // 3 · Engulf
      enter(tl) {
        hide(tl, el.labels.receptor, 0);
        hide(tl, el.labels.macrophage, 0);
        morph(tl, 'reach', 0.1, { duration: 1.3, ease: 'so.out' });
        morph(tl, 'wrap', 1.3, { duration: 1.1, ease: 'so.inOut' });
        tl.to(el.flagellum, { opacity: 0, duration: 0.8 }, 1.4)
          .to(el.contact, { opacity: 0, duration: 0.6 }, 1.2)
          .to(el.receptors[0].inner, { scale: 1, svgOrigin: '0 0', duration: 0.5 }, 1.2)
          .fromTo(el.phago, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 2.1)
          .fromTo(el.phagoRing, { drawSVG: '0% 0%' }, { drawSVG: '0% 100%', duration: 0.9, ease: 'power1.inOut' }, 2.1);
        // Pull the new bubble inward while the membrane relaxes.
        morph(tl, 'rest', 3.0, { duration: 1.6, ease: 'so.inOut' });
        tl.to(el.phago, { attr: { transform: `translate(${PHAGO_AT[0]} ${PHAGO_AT[1]})` }, duration: 1.6, ease: 'so.inOut' }, 3.0)
          .to(el.bact, { attr: { transform: `translate(${PHAGO_AT[0]} ${PHAGO_AT[1]}) rotate(70) scale(0.82)` }, duration: 1.6, ease: 'so.inOut' }, 3.0);
        show(tl, el.labels.phagosome, 4.1);
      },
    },
    { // 4 · Digest
      enter(tl) {
        hide(tl, el.labels.phagosome, 0);
        show(tl, el.labels.lysosome, 0.1, 0.4);
        el.lysosomes.forEach((ly, k) => {
          tl.to(ly, { attr: { transform: `translate(${PHAGO_AT[0] - 10 + k * 8} ${PHAGO_AT[1] + 6 - k * 6}) scale(0.4)` }, duration: 1.4, ease: 'so.inOut' }, 0.4 + k * 0.18)
            .to(ly, { opacity: 0, duration: 0.4 }, 1.6 + k * 0.18);
        });
        hide(tl, el.labels.lysosome, 1.7);
        tl.to(el.phagoFill, { opacity: 1, duration: 0.8 }, 1.6)
          .to(el.bact, { opacity: 0, attr: { transform: `translate(${PHAGO_AT[0]} ${PHAGO_AT[1]}) rotate(70) scale(0.5)` }, duration: 1.0, ease: 'power1.in' }, 1.9);
        el.frags.forEach((f, k) => {
          tl.fromTo(f, { opacity: 0 }, { opacity: 1, duration: 0.3 }, 2.3 + k * 0.08)
            .fromTo(f.dot, { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.5, ease: 'back.out(2)' }, 2.3 + k * 0.08);
        });
        show(tl, el.labels.fragments, 2.8);
      },
    },
    { // 5 · Report
      enter(tl) {
        hide(tl, el.labels.fragments, 0);
        el.mhc.forEach((m, k) => tl.fromTo(m, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0.2 + k * 0.1));
        // Four fragments ride out to the MHC cups and turn into displayed peptides.
        MHC_IDX.forEach((i, k) => {
          const [x, y] = SHAPE_PTS.rest[idx(i)];
          const a = (angleOf(i) * Math.PI) / 180;
          const px = x + Math.cos(a) * 7; const py = y + Math.sin(a) * 7;
          tl.to(el.frags[k], { attr: { transform: `translate(${px.toFixed(1)} ${py.toFixed(1)})` }, duration: 1.5, ease: 'so.inOut' }, 0.5 + k * 0.15)
            .to(el.frags[k].dot, { attr: { fill: c.neoPeptide, r: 5.5 }, duration: 1.2 }, 0.8 + k * 0.15)
            .set(el.frags[k].dot, { attr: { filter: glow } }, 1.6 + k * 0.15);
        });
        tl.to([el.frags[4], el.frags[5]], { opacity: 0, duration: 0.6 }, 0.8)
          .to(el.phago, { opacity: 0, duration: 0.8 }, 1.2)
          .fromTo(el.tcell, { opacity: 0, x: 120, y: -50 }, { opacity: 1, x: 0, y: 0, duration: 2.0, ease: 'so.out' }, 1.0);
        show(tl, el.labels.mhc, 1.9);
        show(tl, el.labels.tcell, 2.6);
      },
    },
  ];

  // ------------------------------------------------------------------ wire up
  const pick = (compact) => (compact ? 'compact' : 'wide');
  layoutName = pick(ctx.compact);
  L = LAYOUTS[layoutName];

  const stepper = ctx.ui.stepper({
    steps,
    reset: draw,
    // Grouped, labeled step dots (FIGURE-AUDIT §4 rule 16).
    phases: [
      { label: 'Find', steps: [0, 1] },
      { label: 'Eat', steps: [2, 3] },
      { label: 'Report', steps: [4] },
    ],
  });

  // Re-layout (not shrink) when the stage crosses the compact breakpoint.
  ctx.onResize(({ compact }) => {
    if (pick(compact) === layoutName) return;
    layoutName = pick(compact);
    L = LAYOUTS[layoutName];
    stepper.rebuild();   // calls draw() for the new layout and restores the current step
  });

  return {
    destroy() { ambients.forEach((t) => t.kill()); },
  };
}
