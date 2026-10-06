// ch05-kill — "Anatomy of a kill": the canonical contact kill (FIGURE-AUDIT §2E, §4 rule 6).
// Every later kill copies this grammar. Built on shared/cell-actions.js (cells) and
// shared/synapse.js (the molecular lens); spec in content/drafts/05-t-cells.md.
//
// One SVG scene in two layouts:
//   wide    960×540: tissue patch; the lens is an inset magnifier (top-center) with a leader
//           to the contact point.
//   compact 400×560: portrait, T cell above the target; the lens REPLACES the main view
//           (cross-fade) and a "cells" thumbnail lets the reader peek back.
// Everything the steps change is tweened (cell-actions / synapse builders are seek-safe);
// the clock text is a pure function of timeline time; the chip is derived from the index.
import { tCell, cancerCell, healthyCell, macrophage, tissueField, placeOnMembrane, pdl1, perforin, PALETTE, mix } from '../art/index.js';
import * as CA from './shared/cell-actions.js';
import { synapseScene } from './shared/synapse.js';

const ID = 'ch05-kill';
const DEG = Math.PI / 180;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
const seg = (p, a, b) => clamp((p - a) / (b - a || 1), 0, 1);
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const angDelta = (a, b) => ((((b - a) % 360) + 540) % 360) - 180;
const f = (v) => String(Math.round(v * 100) / 100);

let mounts = 0;
const CLOCK = ['0 s', '≤ 80 s: pores repaired', '≤ 2 min: target rounds up', 'Later'];

const LAYOUTS = {
  wide: {
    vb: [960, 540],
    rk: 46, rt: 92, rt2: 76, rm: 76, polarity: 0,
    by: [{ x: 250, y: 468, r: 58, seed: 31 }, { x: 96, y: 138, r: 56, seed: 32 }, { x: 896, y: 140, r: 46, seed: 33 }],
    probes: [1, 0],
    killer0: [-90, 318],
    t1: [652, 384], face: 180, nMhc: 14,
    t2From: [1110, 300], t2: [842, 302],
    via7: [[566, 250]],
    macFrom: [1060, 660], macDrift: [26, 18],
    lens: { x: 446, y: 172, r: 160, rot: -90, size: 56, labL: 276, labR: 616 },
    scale: { x: 786, y: 524, len: 160, text: '10 micrometers' },
    after: { mhc: 12, pdl1: 4, offset: 1 / 3 }, before: 6,
  },
  compact: {
    vb: [400, 560],
    rk: 34, rt: 70, rt2: 54, rm: 60, polarity: 90,
    by: [{ x: 74, y: 200, r: 40, seed: 31 }, { x: 322, y: 132, r: 38, seed: 32 }, { x: 58, y: 484, r: 34, seed: 33 }],
    probes: [1, 0],
    killer0: [190, -70],
    t1: [204, 424], face: -90, nMhc: 12,
    t2From: [490, 250], t2: [326, 250],
    via7: [],
    macFrom: [480, 650], macDrift: [18, 12],
    lens: { x: 200, y: 290, r: 166, rot: 0, size: 50, replace: true },
    scale: { x: 306, y: 546, len: 60, text: '5 micrometers' },   // bottom-right: the phone "cells" thumbnail sits bottom-left
    after: { mhc: 10, pdl1: 5, offset: 0.5 }, before: 5,
  },
};

const STYLE = `
[data-figure="${ID}"] .k-chip {
  position: absolute; left: 50%; top: 0.75rem; z-index: 5; width: max-content; max-width: min(24rem, 60%);
  padding: 0.6rem 0.8rem; border-radius: var(--r-md, 10px);
  background: color-mix(in srgb, var(--stage-dark-a, #0B1024) 84%, transparent);
  box-shadow: inset 0 0 0 1px var(--stage-dark-line, rgba(160,175,220,.25));
  color: var(--stage-dark-ink-2, #C9D3E8); font: 500 0.8125rem/1.45 var(--font-ui);
  opacity: 0; transform: translate(-50%, -6px); transition: opacity .5s ease, transform .5s ease; pointer-events: none;
}
[data-figure="${ID}"] .k-chip.is-on { opacity: 1; transform: translate(-50%, 0); }
[data-figure="${ID}"] .k-chip b { color: var(--stage-dark-ink, #EEF2FF); font-weight: 650; }
[data-figure="${ID}"] .k-chip .k-src { display: block; margin-top: 0.2rem; color: var(--stage-dark-ink-3, #8E9BC0); font-size: 0.75rem; }
[data-figure="${ID}"] .k-chip--below {
  position: static; width: auto; max-width: none; transform: none !important; margin: 0.6rem 0 0; background: var(--surface); color: var(--ink-2);
  box-shadow: inset 0 0 0 1px var(--rule); display: none;
}
[data-figure="${ID}"] .k-chip--below b { color: var(--ink); }
[data-figure="${ID}"] .k-chip--below .k-src { color: var(--ink-3); }
[data-figure="${ID}"] .k-chip--below.is-on { display: block; }
[data-figure="${ID}"] .k-clock-cap, [data-figure="${ID}"] .k-clock-note {
  font: 600 0.6875rem/1.35 var(--font-ui); color: var(--fg-2); max-width: 14rem;
  padding: 0 0.15rem; text-shadow: 0 0 6px var(--halo), 0 0 2px var(--halo);
}
[data-figure="${ID}"] .k-clock-cap { letter-spacing: 0.06em; text-transform: uppercase; color: var(--fg-3); }
[data-figure="${ID}"] .k-clock-note { font-weight: 500; font-size: 0.75rem; }
[data-figure="${ID}"] .k-thumb {
  position: absolute; left: 0.6rem; bottom: 0.6rem; z-index: 6; width: 4.6rem; height: 4.6rem; padding: 0;
  border-radius: 50%; border: 1px solid var(--stage-dark-line, rgba(160,175,220,.3)); overflow: hidden; cursor: pointer;
  background: var(--stage-dark-a, #0B1024); box-shadow: 0 4px 14px rgb(0 0 0 / .35);
  opacity: 0; visibility: hidden; transition: opacity .35s ease, visibility .35s;
}
[data-figure="${ID}"] .k-thumb[data-open="1"] { opacity: 1; visibility: visible; }
[data-figure="${ID}"] .k-thumb svg { width: 100%; height: 100%; display: block; pointer-events: none; }
[data-figure="${ID}"] .k-thumb span {
  position: absolute; left: 0; right: 0; bottom: 0.45rem; text-align: center; pointer-events: none;
  font: 650 0.625rem/1 var(--font-ui); letter-spacing: 0.08em; text-transform: uppercase; color: var(--stage-dark-ink, #EEF2FF);
  text-shadow: 0 0 4px #0B1024, 0 0 2px #0B1024;
}
[data-figure="${ID}"] .k-thumb:focus-visible { outline: 2px solid var(--stage-focus); outline-offset: 2px; }
[data-figure="${ID}"] .fig__stage.k-peek .k-lens-root, [data-figure="${ID}"] .fig__stage.k-peek .k-lens-labels { opacity: 0 !important; }
[data-figure="${ID}"] .fig__stage.k-peek .k-scene-wrap { opacity: 1 !important; }
[data-figure="${ID}"] svg .k-lens-root, [data-figure="${ID}"] svg .k-scene-wrap { transition: opacity .3s ease; }
`;

export default function mount(fig, ctx) {
  const { gsap } = ctx;
  if (!document.getElementById('k05-kill-style')) {
    document.head.append(ctx.h('style', { id: 'k05-kill-style', html: STYLE }));
  }
  ctx.setAspect(16 / 9, 5 / 7);
  ctx.addDust();
  const svg = ctx.createSVG({ viewBox: '0 0 960 540' });
  const S = (tag, attrs, parent) => ctx.svg(tag, attrs, parent);
  const uid = `k05-kill-${++mounts}`;   // deterministic, page-unique

  // HUD: stage tags + the shared clock (top left) with its caption and note
  ctx.tag('Not to scale', 'top-right');
  ctx.tag('Time compressed', 'top-right');
  const clock = ctx.ui.clock({ value: CLOCK[0], corner: 'top-left' });
  const clockCap = ctx.h('div', { class: 'k-clock-cap', text: 'time since pores opened' });
  const clockNote = ctx.h('div', { class: 'k-clock-note', text: 'Pores open ~30 s after the T cell’s calcium signal' });
  clock.el.after(clockCap);
  clockCap.after(clockNote);
  const clockEls = [clock.el, clockCap];

  // Step 7 chip (index-derived): over the stage on wide layouts, under the caption on phones
  const chipHTML = '<b>In living mice:</b> roughly 2–16 kills per T cell per day, often in brief, moving contacts; tough targets often need several T cells.<span class="k-src">Halle et al. 2016</span>';
  const chip = ctx.h('div', { class: 'k-chip', html: chipHTML, 'aria-hidden': 'true' });
  ctx.stage.append(chip);
  const chipBelow = ctx.h('div', { class: 'k-chip k-chip--below', html: chipHTML });
  ctx.caption.append(chipBelow);

  // Phone thumbnail: peek back at the cells while the lens fills the stage
  const thumb = ctx.h('button', { type: 'button', class: 'k-thumb', 'aria-label': 'Show the cells', 'aria-pressed': 'false', 'data-open': '0' });
  const thumbSvg = S('svg', { viewBox: '0 0 400 560', 'aria-hidden': 'true', focusable: 'false', preserveAspectRatio: 'xMidYMid slice' });
  thumb.append(thumbSvg, ctx.h('span', { text: 'cells' }));
  ctx.stage.append(thumb);
  const setPeek = (on) => {
    ctx.stage.classList.toggle('k-peek', on);
    thumb.setAttribute('aria-pressed', String(on));
    thumb.setAttribute('aria-label', on ? 'Back to the close-up' : 'Show the cells');
    thumb.querySelector('span').textContent = on ? 'close-up' : 'cells';
  };
  ctx.on(thumb, 'click', () => setPeek(!ctx.stage.classList.contains('k-peek')));

  let mode = 'virus';
  let layoutName = ctx.compact ? 'compact' : 'wide';
  let L = LAYOUTS[layoutName];
  let A = {};
  const ambients = [];

  // ------------------------------------------------------------------ drawing helpers
  function label(parent, { text, x, y, anchor = 'middle', to = null, from = null, cls = 't-label' }) {
    const g = S('g', { opacity: 0, 'data-label': text }, parent);
    if (to) {
      const w = text.length * (cls === 't-small' ? 6.6 : 7.6);
      let lx = x, ly = y - 5;
      if (anchor === 'start') lx = x - 6;
      else if (anchor === 'end') lx = x + 6;
      else { ly = to[1] > y ? y + 7 : y - 19; lx = clamp(to[0], x - w / 2 + 6, x + w / 2 - 6); }
      if (from) [lx, ly] = from;
      const dx = to[0] - lx, dy = to[1] - ly, len = Math.hypot(dx, dy);
      if (len > 14) {
        S('line', { class: 'leader', x1: f(lx), y1: f(ly), x2: f(to[0] - (dx / len) * 4), y2: f(to[1] - (dy / len) * 4) }, g);
        S('circle', { class: 'leader-dot', cx: f(to[0]), cy: f(to[1]), r: 2.4 }, g);
      }
    }
    S('text', { class: `${cls} t-halo`, x: f(x), y: f(y), 'text-anchor': anchor, text }, g);
    return g;
  }
  const show = (tl, nodes, pos, d = 0.5) => [].concat(nodes).forEach((n) => n && tl.fromTo(n, { attr: { opacity: 0 } }, { attr: { opacity: 1 }, duration: d, ease: 'power1.out' }, pos));
  const hide = (tl, nodes, pos, d = 0.35) => [].concat(nodes).forEach((n) => n && tl.fromTo(n, { attr: { opacity: 1 } }, { attr: { opacity: 0 }, duration: d, ease: 'power1.in' }, pos));
  const showHTML = (tl, nodes, pos, d = 0.45) => tl.fromTo(nodes, { autoAlpha: 0 }, { autoAlpha: 1, duration: d, ease: 'power1.out' }, pos);
  const hideHTML = (tl, nodes, pos, d = 0.35) => tl.fromTo(nodes, { autoAlpha: 1 }, { autoAlpha: 0, duration: d, ease: 'power1.in' }, pos);

  /** Target art with its few hot-pink cups facing `face` (built twice: same seed ⇒ same spots). */
  function targetArt(r, seed, face, n) {
    const P = mode === 'virus' ? 'viral' : 'neo';
    const make = (peptides) => (mode === 'virus'
      ? healthyCell({ r, seed, state: 'infected', mhc: n, peptides, stage: 'dark' })
      : cancerCell({ r, seed, mhc: n, peptides, stage: 'dark' }));
    const probe = make(Array(n).fill('self'));
    const angs = [...probe.querySelectorAll('[data-mol="mhc1"]')].map((g) => Number(g.getAttribute('data-angle')));
    const order = angs.map((a, i) => ({ i, d: Math.abs(angDelta(a, face)) })).sort((a, b) => a.d - b.d);
    const pink = new Set(order.slice(0, 3).map((o) => o.i));
    pink.add(order[Math.floor(order.length * 0.7)].i);
    const art = make(angs.map((_, i) => (pink.has(i) ? P : 'self')));
    const cups = [...art.querySelectorAll('[data-mol="mhc1"]')];
    return { art, lit: order.slice(0, 3).map((o) => cups[o.i]) };
  }

  /** World position of a membrane glyph on a rig (plan-based). */
  function glyphWorld(R, glyph, lift = 0) {
    const m = /translate\(([-\d.]+)[ ,]+([-\d.]+)\)/.exec(glyph.getAttribute('transform') || '');
    const a = Number(glyph.getAttribute('data-angle') || 0) * DEG;
    const x = m ? Number(m[1]) : 0, y = m ? Number(m[2]) : 0;
    return [R.plan.x + x + Math.cos(a) * lift, R.plan.y + y + Math.sin(a) * lift];
  }

  // ------------------------------------------------------------------ the scene (reset state)
  function draw() {
    ambients.splice(0).forEach((t) => t.kill());
    if (A.syn) A.syn.destroy();
    for (const n of [...svg.children]) if (n !== svg.defs) n.remove();
    L = LAYOUTS[layoutName];
    const [W, H] = L.vb;
    const wide = layoutName === 'wide';
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    ctx.refreshTextScale();
    thumbSvg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    setPeek(false);
    A = { wide };

    const sceneWrap = S('g', { class: 'k-scene-wrap', opacity: 1 }, svg);
    const sceneId = `${uid}-scene`;
    const scene = S('g', { id: sceneId }, sceneWrap);
    A.sceneWrap = sceneWrap;
    scene.append(tissueField({ width: W, height: H, seed: 5, stage: 'dark', density: 0.85 }));

    // scale bar (main view: micrometers)
    const sc = S('g', { class: 'k-scale' }, scene);
    S('path', { d: `M${L.scale.x} ${L.scale.y}h${L.scale.len}M${L.scale.x} ${L.scale.y - 4}v8M${L.scale.x + L.scale.len} ${L.scale.y - 4}v8`, style: 'stroke: var(--fg-2); stroke-width: 1.5; fill: none' }, sc);
    S('text', { class: 't-small t-halo', x: L.scale.x + L.scale.len / 2, y: L.scale.y - 9, 'text-anchor': 'middle', text: L.scale.text }, sc);

    // bystanders (+ their step-8 redraws: more MHC, then PD-L1 between the cups)
    A.by = L.by.map((b) => CA.rig(healthyCell({ r: b.r, seed: b.seed, mhc: L.before, stage: 'dark' }), { x: b.x, y: b.y, parent: scene, seed: b.seed }));
    A.after = L.by.map((b) => {
      const art = healthyCell({ r: b.r, seed: b.seed, mhc: L.after.mhc, stage: 'dark' });
      placeOnMembrane(art, (o) => pdl1(o), { count: L.after.pdl1, size: clamp(b.r * 0.26, 5, 18), seed: b.seed, offset: L.after.offset, layer: 'pdl1' });
      const layer = art.querySelector('[data-part="pdl1"]');
      layer.setAttribute('opacity', '0');
      return { art, pdl1: layer };
    });

    // target, second target, macrophage, killer
    const t1 = targetArt(L.rt, 7, L.face, L.nMhc);
    A.t1 = CA.rig(t1.art, { x: L.t1[0], y: L.t1[1], parent: scene, seed: 7 });
    A.lit = t1.lit;
    const t2 = targetArt(L.rt2, 11, 180, wide ? 12 : 10);
    A.t2 = CA.rig(t2.art, { x: L.t2From[0], y: L.t2From[1], parent: scene, seed: 11 });
    A.mac = CA.rig(macrophage({ r: L.rm, seed: 3, stage: 'dark' }), { x: L.macFrom[0], y: L.macFrom[1], parent: scene, seed: 3 });
    {
      const ang = Math.atan2(L.t1[1] - L.macFrom[1], L.t1[0] - L.macFrom[0]) / DEG;
      A.macEat = macrophage({ r: L.rm, seed: 3, stage: 'dark', state: 'engulfing', polarity: ang });
      A.macRest = macrophage({ r: L.rm, seed: 3, stage: 'dark' });
    }
    A.killer = CA.rig(tCell({ variant: 'cd8', r: L.rk, state: 'activated', polarity: L.polarity, seed: 21, stage: 'dark' }), { x: L.killer0[0], y: L.killer0[1], parent: scene, seed: 21 });
    CA.unpolarize(A.killer, { angle: L.polarity + 180 });
    A.fx = CA.fxLayer(scene);

    // the killer's name rides with it
    A.killerLabel = S('g', { opacity: 0 }, A.killer.layers.over);
    S('text', { class: 't-label t-halo', x: 0, y: f(-A.killer.r - (wide ? 16 : 14)), 'text-anchor': 'middle', text: 'Killer T cell' }, A.killerLabel);

    // executioner sparks inside the target (calm chain reaction, never a burst)
    A.sparks = [];
    {
      const r = A.t1.r;
      const fa = L.face * DEG;
      const ux = Math.cos(fa), uy = Math.sin(fa), px = -uy, py = ux;
      [-1, 0, 1].forEach((c, ci) => {
        for (let j = 0; j < 5; j++) {
          const t = j / 4;
          const along = r * (0.6 - 0.95 * t);
          const lat = c * r * 0.42 * Math.pow(t, 0.8) + (j % 2 ? 1 : -1) * r * 0.04;
          const g = S('g', { transform: `translate(${f(ux * along + px * lat)} ${f(uy * along + py * lat)})`, opacity: 0 }, A.t1.layers.over);
          S('circle', { r: 10, fill: `url(#${uid}-spark)` }, g);
          S('circle', { r: 2.6, style: 'fill: #FFF6DE' }, g);
          A.sparks.push({ g, delay: j * 0.3 + Math.abs(c) * 0.14 });
        }
      });
      if (!svg.defs.querySelector(`#${uid}-spark`)) {
        const rg = S('radialGradient', { id: `${uid}-spark` }, svg.defs);
        S('stop', { offset: 0, 'stop-color': '#FFF1CC', 'stop-opacity': 0.85 }, rg);
        S('stop', { offset: 1, 'stop-color': '#FFE6A6', 'stop-opacity': 0 }, rg);
      }
    }

    // ---------- the lens
    const LN = L.lens;
    const lensRoot = S('g', { class: 'k-lens-root', opacity: 0, transform: `translate(${LN.x} ${LN.y}) scale(0.06)` }, svg);
    const lensLeader = S('g', { opacity: 0 }, svg);
    if (!LN.replace) {
      lensRoot.before(lensLeader);
      A.leaderLine = S('line', { class: 'leader', x1: 0, y1: 0, x2: 0, y2: 0 }, lensLeader);
      A.sourceRing = S('circle', { r: 11, style: 'fill: none; stroke: var(--fg-2); stroke-width: 1.2', cx: 0, cy: 0 }, lensLeader);
    }
    const clipId = `${uid}-clip`;
    if (!svg.defs.querySelector(`#${clipId}`)) {
      const cp = S('clipPath', { id: clipId }, svg.defs);
      A.clipCircle = S('circle', { r: LN.r }, cp);
      const bg = S('radialGradient', { id: `${uid}-lensbg` }, svg.defs);
      S('stop', { offset: 0, 'stop-color': '#18224A' }, bg);
      S('stop', { offset: 1, 'stop-color': '#0A0F22' }, bg);
    } else {
      svg.defs.querySelector(`#${clipId} circle`).setAttribute('r', LN.r);
    }
    S('circle', { r: LN.r + 6, style: 'fill: #050816; opacity: 0.55' }, lensRoot);
    S('circle', { r: LN.r, fill: `url(#${uid}-lensbg)` }, lensRoot);
    const lensContent = S('g', { 'clip-path': `url(#${clipId})` }, lensRoot);
    const s = LN.size;
    const P = mode === 'virus' ? 'viral' : 'neo';
    A.syn = synapseScene(lensContent, {
      ctx, x: 0, y: 0, rotate: LN.rot, width: LN.r * 2.6, size: s, thickness: 15, stage: 'dark', seed: 5,
      top: { color: 'cd8' }, bottom: { color: mode === 'virus' ? PALETTE.healthy : PALETTE.cancer },
      pairs: [
        { kind: 'lfa1-icam1', x: [-2.56 * s, 2.56 * s] },
        { kind: 'tcr-mhc', x: [-1.76 * s, -0.6 * s, 1.88 * s], peptide: ['self', P, P], coreceptor: [null, 'cd8', null] },
      ],
    });
    S('circle', { r: LN.r, style: 'fill: none; stroke: #AFC0FF; stroke-opacity: 0.55; stroke-width: 1.6' }, lensRoot);
    S('circle', { r: LN.r - 4, style: 'fill: none; stroke: #FFFFFF; stroke-opacity: 0.08; stroke-width: 6' }, lensRoot);
    // lens scale word (nanometers), just inside the rim at the bottom
    if (LN.replace) S('text', { class: 't-caps', x: 0, y: f(LN.r - 22), 'text-anchor': 'middle', text: 'nanometers', style: 'fill: var(--fg-3)' }, lensRoot);
    else S('text', { class: 't-caps', x: f(-LN.r * 0.74 - 8), y: f(LN.r * 0.74 + 14), 'text-anchor': 'end', text: 'nanometers', style: 'fill: var(--fg-3)' }, lensRoot);
    A.lensRoot = lensRoot;
    A.lensLeader = lensLeader;
    A.lensPlan = 0;
    const lp = (sx, sy) => {   // synapse-frame point → svg coordinates (lens open)
      const q = A.syn.local(sx, sy);
      return [LN.x + q.x, LN.y + q.y];
    };
    A.lp = lp;
    const synPt = (kind, i, where) => { const q = A.syn.point(kind, i, where); return [LN.x + q.x, LN.y + q.y]; };

    // the thumbnail mirrors the cells (live <use>)
    thumbSvg.replaceChildren();
    S('use', { href: `#${sceneId}` }, thumbSvg);

    // ---------- labels (always horizontal, outside the moving cells)
    const labels = S('g', { class: 'k-labels' }, svg);
    const lensLabels = S('g', { class: 'k-lens-labels' }, svg);
    const B = A.by;
    const tName = mode === 'virus' ? 'Virus-infected cell' : 'Cancer cell';
    const pName = mode === 'virus' ? 'Viral peptide on MHC I' : 'Mutant peptide on MHC I';
    const synI = A.syn.info;
    const gx = 0.62 * s, pores = [0.2 * s, 1.14 * s];
    A.deliverAt = { x: gx, pores };
    const granuleAt = lp(gx, synI.topY - synI.thickness - s * 0.42 * 0.72);
    const poreAt = lp(pores[1], synI.bottomY + 6);
    const gzAt = lp(pores[0] - s * 0.2, synI.bottomY + synI.thickness + s * 0.65);
    if (wide) {
      const by1 = B[0].plan, t1 = A.t1.plan;
      A.lab = {
        body: label(labels, { text: 'Body cell', x: by1.x - 70, y: by1.y + 40, anchor: 'end', to: [by1.x - 52, by1.y + 26] }),
        target: label(labels, { text: tName, x: t1.x + 96, y: t1.y - 118, anchor: 'start', to: [t1.x + 62, t1.y - 76] }),
        handful: label(labels, { text: 'A handful of matches is enough', x: t1.x - 150, y: 522, to: [t1.x - 98, t1.y + 46] }),
        seal: label(labels, { text: 'Immunological synapse', x: t1.x - 78, y: t1.y + 132, anchor: 'start', from: [t1.x - 98, t1.y + 112], to: [t1.x - 101, t1.y + 44] }),
        granules: label(labels, { text: 'Granules', x: t1.x - 196, y: 476, anchor: 'end', to: [t1.x - 132, t1.y + 16] }),
        macro: label(labels, { text: 'Macrophage', x: 0, y: L.rm + 24 }),
        next: label(labels, { text: 'Next target', x: L.t2[0], y: L.t2[1] + 108 }),
        windows: label(labels, { text: 'IFN-γ: brighter windows… and a brake', x: by1.x + 40, y: by1.y - 86 }),
      };
      A.lens = {
        tcr: label(lensLabels, { text: 'T-cell receptor', x: LN.labL, y: 104, anchor: 'end', to: synPt('tcr-mhc', 1, 'top') }),
        cd8: label(lensLabels, { text: 'CD8 co-receptor', x: LN.labL, y: 238, anchor: 'end', to: synPt('tcr-mhc', 1, 'coreceptor') }),
        pmhc: label(lensLabels, { text: pName, x: LN.labR, y: 150, anchor: 'start', to: synPt('tcr-mhc', 1, 'bottom') }),
        adhesion: label(lensLabels, { text: 'Adhesion ring', x: LN.labR, y: 40, anchor: 'start', to: synPt('lfa1-icam1', 1, 'junction') }),
        granule: label(lensLabels, { text: 'Granule', x: LN.labL, y: 150, anchor: 'end', to: granuleAt }),
        perforin: label(lensLabels, { text: 'Perforin', x: LN.labR, y: 96, anchor: 'start', to: lp(pores[1], synI.bottomY - 4) }),
        pore: label(lensLabels, { text: 'Perforin pore', x: LN.labR, y: 96, anchor: 'start', to: poreAt }),
        patched: label(lensLabels, { text: 'Pore patched', x: LN.labR, y: 96, anchor: 'start', to: poreAt }),
        gzm: label(lensLabels, { text: 'Granzymes', x: LN.labR, y: 236, anchor: 'start', to: gzAt }),
      };
      A.ringAt = [LN.labR + 16, 136];
    } else {
      const t1 = A.t1.plan;
      A.lab = {
        body: label(labels, { text: 'Body cell', x: B[0].plan.x, y: B[0].plan.y + 62 }),
        target: label(labels, { text: tName, x: t1.x + 30, y: t1.y + 100 }),
        handful: label(labels, { text: 'A handful of matches is enough', x: 244, y: 540 }),
        seal: label(labels, { text: 'Synapse', x: t1.x + 62, y: t1.y - 118, anchor: 'start', from: [t1.x + 48, t1.y - 108], to: [t1.x + 34, t1.y - 76] }),
        granules: label(labels, { text: 'Granules', x: t1.x - 104, y: t1.y - 118, anchor: 'end', to: [t1.x - 14, t1.y - 92] }),
        macro: label(labels, { text: 'Macrophage', x: 0, y: L.rm + 20 }),
        next: label(labels, { text: 'Next target', x: L.t2[0], y: L.t2[1] + 80 }),
        windows: label(labels, { text: 'IFN-γ: brighter windows… and a brake', x: 200, y: 78 }),
      };
      A.lens = {
        tcr: label(lensLabels, { text: 'T-cell receptor', x: 18, y: 98, anchor: 'start', to: synPt('tcr-mhc', 1, 'top') }),
        cd8: label(lensLabels, { text: 'CD8 co-receptor', x: 384, y: 104, anchor: 'end', to: synPt('tcr-mhc', 1, 'coreceptor') }),
        pmhc: label(lensLabels, { text: pName, x: 236, y: 490, to: synPt('tcr-mhc', 1, 'bottom') }),
        adhesion: label(lensLabels, { text: 'Adhesion ring', x: 384, y: 104, anchor: 'end', to: synPt('lfa1-icam1', 1, 'junction') }),
        granule: label(lensLabels, { text: 'Granule', x: 18, y: 98, anchor: 'start', to: granuleAt }),
        perforin: label(lensLabels, { text: 'Perforin', x: 252, y: 490, anchor: 'start', to: lp(pores[1], synI.bottomY - 4) }),
        pore: label(lensLabels, { text: 'Perforin pore', x: 252, y: 490, anchor: 'start', to: poreAt }),
        patched: label(lensLabels, { text: 'Pore patched', x: 252, y: 490, anchor: 'start', to: poreAt }),
        gzm: label(lensLabels, { text: 'Granzymes', x: 112, y: 490, anchor: 'start', to: gzAt }),
      };
      A.ringAt = [150, 522];
    }
    // PD-L1 named once, on the bystander that answers last
    {
      const bi = wide ? 0 : 1;
      const b = A.by[bi].plan;
      const want = wide ? 20 : 200;
      const gl = [...A.after[bi].pdl1.children];
      const g = gl.reduce((best, q) => (Math.abs(angDelta(Number(q.dataset.angle), want)) < Math.abs(angDelta(Number(best.dataset.angle), want)) ? q : best));
      const m = /translate\(([-\d.]+)[ ,]+([-\d.]+)\)/.exec(g.getAttribute('transform'));
      const a = Number(g.dataset.angle) * DEG;
      const tip = [b.x + Number(m[1]) + Math.cos(a) * 11, b.y + Number(m[2]) + Math.sin(a) * 11];
      A.lab.pdl1 = label(labels, { text: 'PD-L1', x: tip[0] + Math.cos(a) * 34, y: tip[1] + Math.sin(a) * 30 + 5, anchor: Math.cos(a) >= 0 ? 'start' : 'end', to: tip, cls: 't-small' });
    }
    // the synapse seen face-on: a bull's-eye (adhesion ring around the receptor zone), left of the words
    {
      const t = A.lab.seal.querySelector('text');
      const be = S('g', { transform: `translate(${f(Number(t.getAttribute('x')) - 20)} ${f(Number(t.getAttribute('y')) - 5)})` }, A.lab.seal);
      S('circle', { r: 12, style: 'fill: #0B1024; fill-opacity: 0.6; stroke: #C4CCEE; stroke-width: 3.2; stroke-dasharray: 2.2 1.6' }, be);
      S('circle', { r: 6.2, style: `fill: ${mix(PALETTE.cd8, '#FFFFFF', 0.35)}; fill-opacity: 0.9` }, be);
      S('circle', { r: 2, style: 'fill: #FFFFFF' }, be);
    }
    A.labMacro0 = [0, 0];
    // perforin ring seen from above (~22 staves) beside the pore label: gathers stave by stave
    {
      const [rx, ry] = A.ringAt;
      const ring = S('g', { transform: `translate(${rx} ${ry})`, opacity: 0 }, lensLabels);
      const R0 = 15;
      const n = 22;
      A.staves = [];
      for (let i = 0; i < n; i++) {
        const a = (i / n) * 360;
        const st = S('rect', { x: f(R0 * 0.55), y: -1.5, width: f(R0 * 0.45), height: 3, rx: 1.4, transform: `rotate(${f(a)})`, opacity: 0, style: `fill: ${mix(PALETTE.cd8, '#FFFFFF', 0.5)}` }, ring);
        A.staves.push(st);
      }
      A.ringHole = S('circle', { r: f(R0 * 0.52), opacity: 0, style: 'fill: #050816' }, ring);
      S('text', { class: 't-small', x: f(R0 + 8), y: 4, text: 'seen from above' }, ring);
      A.ring = ring;
    }

    // idle life (wrappers only; the timeline never touches them)
    if (!ctx.reducedMotion) {
      [...A.by, A.t1, A.killer].forEach((R, i) => {
        ambients.push(ctx.ambient(gsap.to(R.layers.idle, { scale: 1.016, svgOrigin: '0 0', duration: 2.6 + i * 0.37, ease: 'sine.inOut', yoyo: true, repeat: -1 })));
      });
    }

    // HUD initial state (hidden until step 4)
    gsap.set([...clockEls, clockNote], { autoAlpha: 0 });
    clock.set(CLOCK[0]);
  }

  // ------------------------------------------------------------------ timeline helpers
  /** Open (1) or close (0) the lens. Wide: grows out of the contact point; compact: replaces the view. */
  function lens(tl, open, pos, duration = 0.95) {
    const v0 = A.lensPlan, v1 = open ? 1 : 0;
    A.lensPlan = v1;
    const LN = L.lens;
    const c = A.killer.plan.contact || { x: A.killer.plan.x, y: A.killer.plan.y };
    const src = [c.x, c.y];
    CA.drive(tl, (p) => {
      const v = lerp(v0, v1, easeInOut(p));
      const e = easeOut(v);
      if (LN.replace) {
        A.lensRoot.setAttribute('transform', `translate(${LN.x} ${LN.y}) scale(${f(lerp(0.9, 1, e))})`);
        A.lensRoot.setAttribute('opacity', f(clamp(v * 1.4, 0, 1)));
        A.sceneWrap.setAttribute('opacity', f(1 - 0.93 * v));
        thumb.setAttribute('data-open', v > 0.5 ? '1' : '0');
      } else {
        const x = lerp(src[0], LN.x, e), y = lerp(src[1], LN.y, e);
        A.lensRoot.setAttribute('transform', `translate(${f(x)} ${f(y)}) scale(${f(lerp(0.06, 1, e))})`);
        A.lensRoot.setAttribute('opacity', f(clamp(v * 2.2, 0, 1)));
        const dx = src[0] - LN.x, dy = src[1] - LN.y, d = Math.hypot(dx, dy) || 1;
        const ex = LN.x + (dx / d) * (LN.r + 3), ey = LN.y + (dy / d) * (LN.r + 3);
        A.leaderLine.setAttribute('x1', f(ex)); A.leaderLine.setAttribute('y1', f(ey));
        A.leaderLine.setAttribute('x2', f(src[0] - (dx / d) * 11)); A.leaderLine.setAttribute('y2', f(src[1] - (dy / d) * 11));
        A.sourceRing.setAttribute('cx', f(src[0])); A.sourceRing.setAttribute('cy', f(src[1]));
        A.lensLeader.setAttribute('opacity', f(seg(v, 0.55, 1)));
      }
    }, { duration, pos });
  }

  /** The clock phrase is a pure function of timeline time: tween an index proxy. */
  function clockTo(tl, from, to, pos) {
    let v = from;
    const proxy = {};
    Object.defineProperty(proxy, 'k', { get: () => v, set: (x) => { v = x; clock.set(CLOCK[clamp(Math.round(x), 0, CLOCK.length - 1)]); }, enumerable: true });
    tl.fromTo(proxy, { k: from }, { k: to, duration: 0.3, ease: 'none', immediateRender: false }, pos);
  }

  // ------------------------------------------------------------------ steps
  const steps = [
    { // 1 · Patrol: touch, read, move on; reach the target
      enter(tl) {
        const k = A.killer;
        show(tl, A.killerLabel, 0.4);
        const p1 = CA.probe(tl, k, A.by[L.probes[0]], { hold: 0.6, duration: 1.8, pos: 0 });
        if (p1.mark) {
          const m = /translate\(([-\d.]+) ([-\d.]+)\)/.exec(p1.mark.getAttribute('transform'));
          const nm = S('text', { class: 't-small t-halo', x: f(Number(m[1]) + 12), y: f(Number(m[2]) + 4), text: 'no match', opacity: 0 }, svg.querySelector('.k-labels'));
          tl.fromTo(nm, { attr: { opacity: 0 } }, { attr: { opacity: 1 }, duration: 0.25 }, p1.end - 0.75);
          tl.fromTo(nm, { attr: { opacity: 1 } }, { attr: { opacity: 0 }, duration: 0.3 }, p1.end - 0.05);
        }
        const p2 = CA.probe(tl, k, A.by[L.probes[1]], { hold: 0.55, duration: 1.5 });
        show(tl, A.lab.body, p2.end - 0.8);
        const ap = CA.approach(tl, k, A.t1, { gap: 3, angle: L.face, duration: 1.7 });
        show(tl, A.lab.target, ap.start + 0.6);
      },
    },
    { // 2 · Match: three pink windows light up; the lens shows TCR + peptide–MHC + CD8
      enter(tl) {
        const k = A.killer;
        hide(tl, [A.killerLabel, A.lab.body, A.lab.target], 0);
        A.lit.forEach((cup, i) => CA.recognize(tl, k, cup, { badge: false, duration: 1.6, radius: L.lens.replace ? 8 : 9, pos: 0.25 + i * 0.28 }));
        A.recog = CA.recognize(tl, k, A.t1, { duration: 1.9, pos: 1.0 });
        show(tl, A.lab.handful, 1.3);
        lens(tl, true, 1.7);
        A.syn.engage('tcr-mhc', true, { tl, pos: 2.5, duration: 1.3, stagger: 0.25 });
        show(tl, A.lens.tcr, 2.9);
        show(tl, A.lens.pmhc, 3.2);
        show(tl, A.lens.cd8, 3.7);
      },
    },
    { // 3 · Seal and aim: flatten + adhesion ring (bull's-eye), centrosome swings, granules cluster
      enter(tl) {
        const k = A.killer;
        hide(tl, [A.lens.tcr, A.lens.pmhc, A.lens.cd8, A.lab.handful], 0);
        lens(tl, false, 0.1, 0.8);
        if (A.recog.badge) hide(tl, A.recog.badge, 0.2, 0.5);
        A.syn.engage('lfa1-icam1', true, { tl, pos: 0.9, duration: 1.0, stagger: 0.1 });
        CA.dock(tl, k, A.t1, { seal: true, flatten: 0.16, duration: 1.3, pos: 0.7 });
        show(tl, A.lab.seal, 1.8);
        CA.polarize(tl, k, undefined, { duration: 2.2, pos: 2.2 });
        show(tl, A.lab.granules, 3.8);
      },
    },
    { // 4 · Fire: granules fuse; perforin binds, gathers into rings, forms pores. Clock "0 s"
      enter(tl) {
        const k = A.killer;
        hide(tl, [A.lab.seal, A.lab.granules], 0);
        CA.fire(tl, k, A.t1, { duration: 1.1, pos: 0.5 });
        lens(tl, true, 0.2);
        show(tl, A.lens.adhesion, 0.9);
        const d = A.syn.deliver({ tl, pos: 1.0, x: A.deliverAt.x, pores: A.deliverAt.pores, granzymes: 5, duration: 4.2 });
        show(tl, A.lens.granule, 1.3);
        hide(tl, A.lens.granule, d.marks.fused + 0.2);
        show(tl, A.lens.perforin, d.marks.latched - 0.5);
        show(tl, A.ring, d.marks.latched - 0.3);
        A.staves.forEach((st, i) => tl.fromTo(st, { attr: { opacity: 0 } }, { attr: { opacity: 1 }, duration: 0.2 }, lerp(d.marks.latched, d.marks.ring, i / A.staves.length)));
        tl.fromTo(A.ringHole, { attr: { opacity: 0 } }, { attr: { opacity: 1 }, duration: 0.5 }, d.marks.open - 0.5);
        hide(tl, A.lens.perforin, d.marks.open - 0.4, 0.3);
        show(tl, A.lens.pore, d.marks.open - 0.3);
        clockTo(tl, 0, 0, d.marks.open - 0.3);
        showHTML(tl, [...clockEls, clockNote], d.marks.open - 0.3);
      },
    },
    { // 5 · Enter and race: granzymes slip through; the target patches its pores. Clock "≤ 80 s"
      enter(tl) {
        hide(tl, [A.lens.adhesion, A.ring], 0);
        hideHTML(tl, clockNote, 0.2);
        A.syn.admit({ tl, pos: 0.2, duration: 2.6 });
        show(tl, A.lens.gzm, 1.0);
        const rp = A.syn.repair({ tl, pos: 2.6, stagger: 0.7 });
        hide(tl, A.lens.pore, rp.end - 0.6, 0.3);
        show(tl, A.lens.patched, rp.end - 0.4);
        clockTo(tl, 0, 1, rp.end - 0.4);
      },
    },
    { // 6 · Apoptosis: executioner sparks, rounding, blebs, fragments; a macrophage clears up
      enter(tl) {
        hide(tl, [A.lens.gzm, A.lens.patched], 0);
        lens(tl, false, 0.1, 0.8);
        A.sparks.forEach((sp) => {
          CA.drive(tl, (p) => sp.g.setAttribute('opacity', f(Math.sin(Math.PI * p) * 0.95)), { duration: 0.9, pos: 0.9 + sp.delay });
        });
        const dieAt = 2.4, dieDur = 4.4;
        CA.die(tl, A.t1, { duration: dieDur, pos: dieAt });
        clockTo(tl, 1, 2, dieAt + 0.4);
        clockTo(tl, 2, 3, dieAt + dieDur * 0.66);
        const cu = CA.clearUp(tl, A.mac, A.t1, { duration: 3.4, pos: dieAt + dieDur - 0.3 });
        CA.swap(tl, A.mac, A.macEat, { duration: 1.0, pos: cu.start + 1.0 });
        const mp = A.mac.plan;
        A.lab.macro.setAttribute('transform', `translate(${f(mp.x - A.labMacro0[0])} ${f(mp.y - A.labMacro0[1])})`);
        show(tl, A.lab.macro, cu.end - 1.2);
      },
    },
    { // 7 · Release and repeat: the T cell detaches, intact, and moves on
      enter(tl) {
        const k = A.killer;
        hideHTML(tl, clockEls, 0.1);
        CA.detach(tl, k, { duration: 1.3, pos: 0.2 });
        CA.move(tl, A.t2, { x: L.t2[0], y: L.t2[1], duration: 2.4, stretch: 0.02, pos: 0.3 });
        CA.swap(tl, A.mac, A.macRest, { duration: 1.2, pos: 0.6 });
        // polish: the macrophage keeps its name while it drifts off (an unlabeled coral cell next to
        // "Next target" read as if the next target were a macrophage)
        const m0 = { x: A.mac.plan.x, y: A.mac.plan.y };
        CA.move(tl, A.mac, { x: A.mac.plan.x + L.macDrift[0], y: A.mac.plan.y + L.macDrift[1], duration: 3.4, stretch: 0.02, pos: 0.4 });
        const labAt = (p) => `translate(${f(p.x - A.labMacro0[0])} ${f(p.y - A.labMacro0[1])})`;
        tl.fromTo(A.lab.macro, { attr: { transform: labAt(m0) } }, { attr: { transform: labAt(A.mac.plan) }, duration: 3.4, ease: 'so.inOut' }, 0.4);
        CA.approach(tl, k, A.t2, { gap: 3, angle: 180, via: L.via7, duration: 2.6, pos: 1.5 });
        show(tl, A.lab.next, 2.9);
      },
    },
    { // 8 · Ripples: IFN-γ (hollow blue rings) → more MHC, then PD-L1 on the neighbors
      enter(tl) {
        const k = A.killer;
        hide(tl, A.lab.next, 0);
        CA.emit(tl, k, { kind: 'interferon', n: 14, r: A.wide ? 230 : 150, duration: 2.6, pos: 0.2, seed: 3, size: 9 });
        CA.emit(tl, k, { kind: 'interferon', n: 26, r: A.wide ? 440 : 300, duration: 4.2, pos: 0.9, seed: 4, size: 10, fade: 0.6 });
        const kp = k.plan;
        const order = A.by.map((b, i) => ({ b, i, d: Math.hypot(b.plan.x - kp.x, b.plan.y - kp.y) })).sort((a, b) => a.d - b.d);
        const far = Math.max(...order.map((o) => o.d));
        order.forEach(({ b, i, d }) => {
          const t = 1.3 + (d / far) * 1.6;
          CA.swap(tl, b, A.after[i].art, { duration: 1.1, pos: t });
          tl.fromTo(A.after[i].pdl1, { attr: { opacity: 0 } }, { attr: { opacity: 1 }, duration: 0.9 }, t + 1.7);
        });
        show(tl, A.lab.windows, 2.4);
        show(tl, A.lab.pdl1, order[order.length - 1].d / far * 1.6 + 1.3 + 2.2);
      },
    },
  ];

  const stepper = ctx.ui.stepper({
    steps,
    reset: draw,
    dwell: 3.4,
    onChange(i) {
      setPeek(false);
      const on = i === 6;
      chip.classList.toggle('is-on', on && layoutName === 'wide');
      chipBelow.classList.toggle('is-on', on && layoutName === 'compact');
    },
  });

  ctx.ui.button({
    label: 'Replay', icon: 'replay', variant: 'ghost', small: true,
    onClick: () => {
      const i = stepper.index;
      if (i > 0) { stepper.go(i - 1, { instant: true }); stepper.next(); return; }
      const tl = stepper.timeline;
      const t0 = tl.labels['s0:start'] ?? 0, t1 = tl.labels.s0;
      tl.seek(t0, true);
      if (ctx.reducedMotion) tl.seek(t1, true);
      else gsap.to(tl, { time: t1, duration: t1 - t0, ease: 'none', overwrite: true });
    },
  });
  ctx.ui.segmented({
    label: 'Target',
    options: [
      { value: 'virus', label: 'Virus-infected cell', color: ctx.colors.healthy },
      { value: 'cancer', label: 'Cancer cell', color: ctx.colors.cancer },
    ],
    value: mode,
    onChange: (v) => { mode = v; stepper.rebuild(); ctx.announce(v === 'virus' ? 'Target: a virus-infected cell' : 'Target: a cancer cell'); },
  });

  ctx.onResize(({ compact }) => {
    const next = compact ? 'compact' : 'wide';
    if (next === layoutName) return;
    layoutName = next;
    stepper.rebuild();
    const i = stepper.index;
    chip.classList.toggle('is-on', i === 6 && layoutName === 'wide');
    chipBelow.classList.toggle('is-on', i === 6 && layoutName === 'compact');
  });

  return {
    destroy() { ambients.forEach((t) => t.kill()); A.syn && A.syn.destroy(); chip.remove(); chipBelow.remove(); thumb.remove(); },
  };
}
