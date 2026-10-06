// ch09-bridge — "The matchmaker" (Chapter 9, simulation, dark stage).
//
// One idea: who can recognize the tumor. ~40 experienced T cells (canvas crowd, shared
// agents.js kit) wander past a cluster of 8 cancer cells (SVG, library art). Each cancer cell
// shows circle-headed surface proteins (antigen) and MHC class I cups (mhc1), one of which holds
// the tumor peptide (hot pink, the matching epitopeKey).
//   • No engager: only the one T cell whose tcrKey matches can recognize (recognition ring +
//     green "+" at the contact), kill, detach and move on. Hidden class I → nobody can.
//   • Antibody-based engager (library bispecific antibody: gold, blue CD3 tip): studs every
//     surface protein; any T cell that touches the cell is bridged and kills. Class I is irrelevant.
//   • TCR-based (tebentafusp: a pale TCR head with an anti-CD3 arm, drawn locally — single use):
//     docks only on the pink-peptide cups in HLA-A*02:01; hide class I or switch HLA → no kills.
// Kill grammar (FIGURE-AUDIT §4.6): dock and flatten → the target dies by setDying (shrink, blebs,
// fragments) → the killer detaches intact. Engagers bridge only cells that touch; nothing is
// dragged. The counter is a teaching model ("Illustrative").
import {
  tissueField, cancerCell, antigen, mhc1, tcr, antibody, antibodyTips, placeOnMembrane, setDying,
  PALETTE, mix, DOCK_GAP,
} from '../art/index.js';
import { rng, fixedStep, spatialHash, walk, relax, spriteStates, createEffects, contactRing } from './shared/agents.js';
import * as ART from '../art/index.js';

const ID = 'ch09-bridge';
const DEG = Math.PI / 180;
const TAU = Math.PI * 2;
const MATCH = 7;                       // the tumor peptide's key; exactly one killer T cell carries it
const KEYS = [2, 3, 5, 9, 11, 13, 14, 17, 19, 21, 23, 26, 28, 30, 33, 35, 38, 40, 42, 44];
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
const f = (v) => (Math.round(v * 100) / 100).toString();

const CAPTIONS = {
  none: 'Without help, only a T cell whose receptor matches the tumor’s displayed peptide can recognize it. Here that is one cell in the crowd.',
  noneHidden: 'The tumor has stopped displaying MHC class I. Even the one matching T cell now finds nothing to recognize.',
  antibody: 'The engager binds a protein on the cancer cell’s surface and CD3 on any T cell it meets. Ordinary T cells become killers, and losing class I does not help the tumor.',
  tcr: 'Tebentafusp reads class I. It binds only the gp100 peptide presented on HLA-A*02:01, then binds CD3 on any passing T cell.',
  tcrHidden: 'With no class I on the surface, tebentafusp has nothing to read, so a TCR-based engager cannot recognize this tumor.',
  tcrOther: 'This patient’s HLA molecules display different peptides, or display them differently, so tebentafusp finds nothing it recognizes. That is why patients are tested for HLA-A*02:01 first.',
};

const LAYOUTS = {
  wide: {
    vb: [960, 540], rC: 36, rT: 12, nCD8: 36, nCD4: 6, cups: 4, ags: 5, cupSize: 16, agSize: 15,
    cluster: { x: 640, y: 272, d: 78, rot: 0 }, matchStart: [380, 300],
    labels: { ag: { angle: -100, dist: 56 }, pep: { dist: 52 }, cd3: { angle: 15 }, hla: { angle: 20 } },
  },
  compact: {
    vb: [360, 420], rC: 26, rT: 9.5, nCD8: 20, nCD4: 4, cups: 3, ags: 4, cupSize: 14, agSize: 12.5,
    cluster: { x: 192, y: 222, d: 55, rot: 90 }, matchStart: [70, 150],
    labels: { ag: { angle: -90, text: [14, 48] }, pep: { dist: 40 }, cd3: { angle: 10 }, hla: { angle: 170 } },
  },
};
// 8 cells in two staggered rows (every cell keeps an outer face T cells can reach)
const CLUSTER = [[-1, -0.433], [0, -0.433], [1, -0.433], [2, -0.433], [-1.5, 0.433], [-0.5, 0.433], [0.5, 0.433], [1.5, 0.433]];

const STYLE = `
[data-figure="${ID}"] .br-cap { color: var(--ink); min-height: 4.6em; }
[data-figure="${ID}"] .br-foot { font-family: var(--font-ui); font-size: var(--text-xs); color: var(--ink-3); }
[data-figure="${ID}"] .br-hla[hidden] { display: none; }
[data-figure="${ID}"] .br-count { display: inline-flex; align-items: center; gap: var(--s-2); }
[data-figure="${ID}"] .br-count .fig-tag-caps { position: static; }
[data-figure="${ID}"] .br-ill { font-family: var(--font-ui); font-size: 0.68rem; font-weight: 650; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-3); }
[data-figure="${ID}"].is-compact .br-engager .segmented__track { flex-direction: column; border-radius: var(--r-md); width: 100%; }
[data-figure="${ID}"].is-compact .br-engager { width: 100%; }
[data-figure="${ID}"].is-compact .br-engager .segmented__opt { height: auto; min-height: 2.75rem; white-space: normal; text-align: left; line-height: 1.25; padding: 0.45rem 0.9rem; border-radius: var(--r-md); }
`;

function injectStyle() {
  if (document.getElementById(`${ID}-style`)) return;
  const s = document.createElement('style');
  s.id = `${ID}-style`;
  s.textContent = STYLE;
  document.head.append(s);
}

/** Pose capping a glyph head with one antibody arm tip, Fc away (same math as dockAntibody). */
function capPose(head, u, arm = 'right') {
  const [tx, ty] = antibodyTips(u)[arm];
  const hx = 0.035 * u * (arm === 'left' ? -1 : 1), hy = -0.485 * u;
  const alpha = Math.atan2(ty - hy, tx - hx) / DEG;
  const psi = head.angle + 180 - alpha;
  const c = Math.cos(psi * DEG), s = Math.sin(psi * DEG);
  return { x: head.x - (c * tx - s * ty), y: head.y - (s * tx + c * ty), r: psi };
}

/** Tebentafusp (single use, drawn here): a pale TCR head + a small anti-CD3 binder with a blue tip.
 *  Anchor (0,0) = the TCR's binding face, glyph pointing UP (−y) away from what it binds. */
function tebentafusp(ctx, size) {
  const g = ctx.svg('g', { class: 'br-tebe' });
  const head = tcr({ size, color: '#B9C9EC', stage: 'dark', detail: 'high' });
  // tcr() points up from its anchor; flip it so its CDR face sits at (0,0) facing down
  head.setAttribute('transform', `translate(0 ${f(-0.8 * size)}) rotate(180)`);
  g.append(head);
  const arm = ctx.svg('g', { transform: `translate(0 ${f(-0.84 * size)})` }, g);
  ctx.svg('path', { d: `M0 0 C${f(size * 0.12)} ${f(-size * 0.12)} ${f(-size * 0.1)} ${f(-size * 0.22)} 0 ${f(-size * 0.32)}`, stroke: mix(PALETTE.antibody, '#FFFFFF', 0.2), strokeWidth: f(Math.max(1, size * 0.07)), fill: 'none', strokeLinecap: 'round' }, arm);
  for (const dx of [-0.07, 0.07]) {
    ctx.svg('rect', { x: f((dx - 0.06) * size), y: f(-0.62 * size), width: f(0.12 * size), height: f(0.3 * size), rx: f(0.06 * size), fill: mix(PALETTE.cd8, '#0B1024', 0.15), stroke: mix(PALETTE.cd8, '#FFFFFF', 0.45), strokeWidth: f(Math.max(0.6, size * 0.035)) }, arm);
  }
  return g;
}

export default async function mount(fig, ctx) {
  injectStyle();
  const C = ctx.colors;
  ctx.setAspect(960 / 540, 360 / 420);
  const bg = ctx.createSVG({ viewBox: '0 0 960 540' });
  const cv = ctx.canvas();
  const top = ctx.createSVG({ viewBox: '0 0 960 540' });
  ctx.tag('Not to scale');
  ctx.tag('Illustrative');

  const state = { mode: 'none', hidden: false, hla: 'a02' };
  let layoutName = ctx.compact ? 'compact' : 'wide';
  let L = LAYOUTS[layoutName];
  let sheet = null;
  let tips = {};
  let tcells = [];
  let cancers = [];
  let bridges = [];
  let fx = createEffects();
  let hash = spatialHash(40);
  let killed = 0;
  let simT = 0;
  let labels = {};
  let fieldSeed = 1;

  // ---------------------------------------------------------------- sprites
  async function buildSprites() {
    const k = (cv.width / L.vb[0]) || 1;
    const scale = Math.min(2, (window.devicePixelRatio || 1)) * Math.max(1, k);
    sheet = await spriteStates({
      cd8: ['tCell', { variant: 'cd8', r: L.rT, state: 'activated', polarity: 0, stage: 'dark', detail: 'low' }],
      cd4: ['tCell', { variant: 'cd4', r: L.rT, state: 'activated', polarity: 0, stage: 'dark', detail: 'low' }],
    }, { seeds: 4, scale });
    const list = [MATCH, ...KEYS];
    const imgs = await Promise.all(list.flatMap((key) => [
      ART.sprite('tcrKey', { key, form: 'tip', size: L.rT * 0.95, color: 'cd8', stage: 'dark' }, { scale }),
      ART.sprite('tcrKey', { key, form: 'tip', size: L.rT * 0.95, color: 'cd4', stage: 'dark' }, { scale }),
    ]));
    tips = {};
    list.forEach((key, i) => { tips[`cd8-${key}`] = imgs[i * 2]; tips[`cd4-${key}`] = imgs[i * 2 + 1]; });
  }

  // ---------------------------------------------------------------- scene (SVG: tissue + tumor)
  let cellLayer = null;
  function buildTumor() {
    for (const n of [...bg.children]) if (n !== bg.defs) n.remove();
    for (const n of [...top.children]) if (n !== top.defs) n.remove();
    const [W, H] = L.vb;
    bg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    top.setAttribute('viewBox', `0 0 ${W} ${H}`);
    ctx.refreshTextScale();
    bg.append(tissueField({ width: W, height: H, seed: 4, stage: 'dark', density: 0.7 }));
    cellLayer = ctx.svg('g', null, bg);
    const K = L.cluster;
    const rot = K.rot * DEG;
    cancers = CLUSTER.map(([qx, qy], i) => {
      const x0 = (qx - 0.25) * K.d, y0 = qy * K.d;
      const x = K.x + x0 * Math.cos(rot) - y0 * Math.sin(rot);
      const y = K.y + x0 * Math.sin(rot) + y0 * Math.cos(rot);
      const art = cancerCell({ r: L.rC, seed: 40 + i, stage: 'dark', receptors: false, nuclei: 1 });
      art.setAttribute('transform', `translate(${f(x)} ${f(y)})`);
      // surface proteins (antigen, circle head) and MHC class I cups, interleaved
      const ags = placeOnMembrane(art, (o) => antigen({ ...o, shape: 'circle' }), { count: L.ags, size: L.agSize, seed: i + 3, offset: 0.15, layer: 'antigens', detail: 'high' });
      // the tumor peptide sits in the cup on the cell's most exposed face (where T cells can reach)
      const probe = placeOnMembrane(art, () => ctx.svg('g'), { count: L.cups, size: L.cupSize, seed: i + 5, offset: 0.65, layer: 'probe' });
      const ox = x - K.x, oy = y - K.y, ol = Math.hypot(ox, oy) || 1;
      let pepAt = 0, best = -9;
      probe.forEach((g, k) => {
        const a = Number(g.getAttribute('data-angle')) * DEG;
        const sc = (Math.cos(a) * ox + Math.sin(a) * oy) / ol;
        if (sc > best) { best = sc; pepAt = k; }
      });
      probe[0].parentNode.remove();
      const cupOpts = (pockets) => (o, k) => mhc1({ ...o, pockets, peptide: k === pepAt ? 'neo' : 'self', ...(k === pepAt ? { key: MATCH, keySize: L.cupSize * 0.9 } : {}) });
      const cupsA = placeOnMembrane(art, cupOpts(['round', 'round']), { count: L.cups, size: L.cupSize, seed: i + 5, offset: 0.65, layer: 'receptors', detail: 'high' });
      const cupsB = placeOnMembrane(art, cupOpts(['square', 'triangle']), { count: L.cups, size: L.cupSize, seed: i + 5, offset: 0.65, layer: 'receptors-b', detail: 'high' });
      const gA = cupsA[0].parentNode, gB = cupsB[0].parentNode;
      gB.setAttribute('data-part', 'receptors');            // fades with the cell (setDying)
      gA.setAttribute('data-cups', 'a02');
      gB.setAttribute('data-cups', 'other');
      // engager studs (both kinds), shown per mode
      const abG = ctx.svg('g', { 'data-part': 'antibodies', 'data-studs': 'antibody' }, art);
      const uAb = L.agSize * 1.1;
      ags.forEach((g) => {
        const m = g.transform.baseVal.consolidate().matrix;
        const ang = Number(g.getAttribute('data-angle'));
        const h = { x: m.e + Math.cos(ang * DEG) * L.agSize * 0.99, y: m.f + Math.sin(ang * DEG) * L.agSize * 0.99, angle: ang };
        const P = capPose(h, uAb, 'right');
        const ab = antibody({ variant: 'bispecific', targets: ['cd8', PALETTE.antigen], size: uAb, stage: 'dark' });
        ab.setAttribute('transform', `translate(${f(P.x)} ${f(P.y)}) rotate(${f(P.r)})`);
        abG.append(ab);
      });
      const teG = ctx.svg('g', { 'data-part': 'antibodies', 'data-studs': 'tcr' }, art);
      {
        const cup = cupsA[pepAt];
        const m = cup.transform.baseVal.consolidate().matrix;
        const ang = Number(cup.getAttribute('data-angle'));
        const d = DOCK_GAP['tcr-mhc1'] * L.cupSize * 0.96;
        const te = tebentafusp(ctx, L.cupSize * 1.1);
        te.setAttribute('transform', `translate(${f(m.e + Math.cos(ang * DEG) * d)} ${f(m.f + Math.sin(ang * DEG) * d)}) rotate(${f(ang + 90)})`);
        teG.append(te);
      }
      cellLayer.append(art);
      return { i, x, y, r: L.rC, fixed: true, art, ags, cupsA, cupsB, gA, gB, abG, teG, alive: true, p: 0, target: null, dead: false, pepAt };
    });
    // prepare each cell's apoptosis once, with its own seed (stable remnants)
    cancers.forEach((c) => { setDying(c.art, 1e-4, { seed: 11 + c.i * 5 }); setDying(c.art, 0); });
    buildLabels();
    applyDisplay();
  }

  function glyphPoint(c, glyph, k = 1) {
    const m = glyph.transform.baseVal.consolidate().matrix;
    const ang = Number(glyph.getAttribute('data-angle'));
    return { x: c.x + m.e + Math.cos(ang * DEG) * k, y: c.y + m.f + Math.sin(ang * DEG) * k, ang };
  }
  const nearestGlyph = (list, angle) => list.reduce((best, g) => {
    const d = Math.abs(((Number(g.getAttribute('data-angle')) - angle + 540) % 360) - 180);
    return !best || d < best.d ? { g, d } : best;
  }, null).g;

  function labelAt(text, at, dir, dist, cls = 't-label', fixed = null) {
    const g = ctx.svg('g', null, top);
    let tx = at.x + Math.cos(dir * DEG) * dist, ty = at.y + Math.sin(dir * DEG) * dist;
    let anchor = Math.cos(dir * DEG) > 0.35 ? 'start' : Math.cos(dir * DEG) < -0.35 ? 'end' : 'middle';
    if (fixed) { [tx, ty] = fixed; anchor = 'start'; }
    const ly = ty + (Math.sin(dir * DEG) > 0 ? -13 : 5);
    ctx.svg('line', { class: 'leader', x1: tx, y1: ly, x2: at.x, y2: at.y }, g);
    ctx.svg('circle', { class: 'leader-dot', cx: at.x, cy: at.y, r: 2.2 }, g);
    ctx.svg('text', { x: tx, y: ty + (Math.sin(dir * DEG) > 0 ? 4 : 0), class: `${cls} t-halo`, 'text-anchor': anchor, text }, g);
    return g;
  }

  // Labels sit on intact cells; when a labeled cell starts to die, the label moves to another.
  const intact = () => cancers.filter((c) => c.p < 0.15);
  const pick = (list, score) => list.reduce((a, b) => (score(b) > score(a) ? b : a), list[0]);
  function buildLabels() {
    for (const k of ['ag', 'pep', 'cd3', 'hlaA', 'hlaB']) labels[k]?.remove();
    labels = {};
    const live = intact();
    if (!live.length) return;
    const lb = L.labels;
    const K = L.cluster;
    // surface protein: the intact cell closest to the preferred side (default: top)
    const ua = { x: Math.cos(lb.ag.angle * DEG), y: Math.sin(lb.ag.angle * DEG) };
    const c0 = pick(live, (c) => (c.x - K.x) * ua.x + (c.y - K.y) * ua.y);
    const ag = nearestGlyph(c0.ags, lb.ag.angle);
    labels.agCell = c0;
    labels.ag = labelAt('tumor surface protein', glyphPoint(c0, ag, L.agSize * 0.74), lb.ag.angle, lb.ag.dist, 't-label', lb.ag.text);
    // tumor peptide: the lowest intact cell's exposed pink cup
    const c1 = pick(live, (c) => c.y * 10 + c.x * 0.01);
    const pa = glyphPoint(c1, c1.cupsA[c1.pepAt], L.cupSize * 0.74);
    labels.pepCell = c1;
    labels.pep = labelAt('tumor peptide', pa, pa.ang, lb.pep.dist);
    // CD3 arm of an engager stud, and the HLA tag, on the side given per layout
    const uc = { x: Math.cos(lb.cd3.angle * DEG), y: Math.sin(lb.cd3.angle * DEG) };
    const c2 = pick(live, (c) => (c.x - K.x) * uc.x + (c.y - K.y) * uc.y);
    labels.cd3Cell = c2;
    const ab = c2.abG.children[c2.ags.indexOf(nearestGlyph(c2.ags, lb.cd3.angle))];
    {
      const m = ab.transform.baseVal.consolidate().matrix;
      const [lx, ly] = antibodyTips(L.agSize * 1.1).left;        // the blue CD3 tip
      const p = { x: c2.x + m.a * lx + m.c * ly + m.e, y: c2.y + m.b * lx + m.d * ly + m.f };
      labels.cd3 = labelAt('CD3 arm', p, lb.cd3.angle, 30, 't-small');
    }
    const uh = { x: Math.cos(lb.hla.angle * DEG), y: Math.sin(lb.hla.angle * DEG) };
    const c3 = pick(live, (c) => (c.x - K.x) * uh.x + (c.y - K.y) * uh.y);
    labels.hlaCell = c3;
    const hp = glyphPoint(c3, nearestGlyph(c3.cupsA, lb.hla.angle), L.cupSize * 0.5);
    labels.hlaA = labelAt('HLA-A*02:01', hp, lb.hla.angle, 34, 't-small');
    labels.hlaB = labelAt('other HLA', hp, lb.hla.angle, 34, 't-small');
  }

  /** Which studs, cups and labels show for the current settings. */
  function applyDisplay() {
    const { mode, hidden, hla } = state;
    const vis = (node, on) => node && node.setAttribute('display', on ? 'inline' : 'none');
    for (const c of cancers) {
      vis(c.gA, !hidden && !(mode === 'tcr' && hla === 'other'));
      vis(c.gB, !hidden && mode === 'tcr' && hla === 'other');
      vis(c.abG, mode === 'antibody');
      vis(c.teG, mode === 'tcr' && !hidden && hla === 'a02');
    }
    const alive = (c) => c && c.p < 0.15;
    if (['agCell', 'pepCell', 'cd3Cell', 'hlaCell'].some((k) => labels[k] && !alive(labels[k]))) buildLabels();
    vis(labels.ag, alive(labels.agCell));
    vis(labels.pep, alive(labels.pepCell) && !hidden && !(mode === 'tcr' && hla === 'other'));
    vis(labels.cd3, alive(labels.cd3Cell) && mode === 'antibody');
    vis(labels.hlaA, alive(labels.hlaCell) && mode === 'tcr' && !hidden && hla === 'a02');
    vis(labels.hlaB, alive(labels.hlaCell) && mode === 'tcr' && !hidden && hla === 'other');
  }

  const canKill = (t) => {
    const { mode, hidden, hla } = state;
    if (mode === 'antibody') return true;
    if (mode === 'tcr') return !hidden && hla === 'a02';
    return !hidden && t.match;
  };

  // ---------------------------------------------------------------- agents
  function seedAgents() {
    const R = rng(97 + fieldSeed);
    const [W, H] = L.vb;
    const K = L.cluster;
    const n = L.nCD8 + L.nCD4;
    const away = (x, y) => cancers.every((c) => Math.hypot(x - c.x, y - c.y) > c.r + L.rT + 14);
    tcells = [];
    let keyIdx = 0;
    for (let i = 0; i < n; i++) {
      const kind = i < L.nCD8 ? 'cd8' : 'cd4';
      const match = i === 0;
      let x, y, tries = 0;
      do {
        x = match ? L.matchStart[0] : R.range(L.rT + 6, W - L.rT - 6);
        y = match ? L.matchStart[1] : R.range(L.rT + 6, H - L.rT - 6);
        tries++;
      } while (!match && (!away(x, y) || Math.hypot(x - K.x, y - K.y) < 40) && tries < 50);
      const key = match ? MATCH : KEYS[keyIdx++ % KEYS.length];
      tcells.push({
        id: i, x, y, r: L.rT, kind, key, match, variant: i, heading: R.range(0, TAU), rng: rng(300 + i * 13),
        speed: R.range(24, 36) * (L.rT / 12), mode: 'walk', t: 0, cool: 0, target: null,
      });
    }
  }

  function restart() {
    fieldSeed++;
    buildTumor();
    seedAgents();
    for (const b of bridges) b.g.remove();
    bridges = [];
    fx = createEffects();
    killed = 0;
    simT = 0;
    counter.set(0);
    if (ctx.reducedMotion || !loop.playing) {
      // a still of the end state: run the model silently, then draw once
      if (ctx.reducedMotion) for (let i = 0; i < 60 * 18; i++) step(1 / 60);
      render();
    }
  }

  // ---------------------------------------------------------------- simulation
  const [bx0, by0] = [0, 0];
  function step(dt) {
    simT += dt;
    const [W, H] = L.vb;
    const bounds = { x0: bx0 + 4, y0: by0 + 4, x1: W - 4, y1: H - 4 };
    const live = cancers.filter((c) => !c.dead);
    for (const t of tcells) {
      t.cool = Math.max(0, t.cool - dt);
      if (t.mode === 'walk') {
        // T cells drift loosely toward the tumor (chemokines); near it they just mill around
        const K = L.cluster;
        const far = Math.hypot(t.x - K.x, t.y - K.y) > K.d * 1.9;
        let bias = far ? { x: K.x, y: K.y, strength: 0.45 } : null;
        if (t.match && state.mode === 'none' && !state.hidden) {
          // the matching cell follows faint chemical cues toward the nearest intact cancer cell
          const tgt = live.filter((c) => !c.target).sort((a, b) => Math.hypot(t.x - a.x, t.y - a.y) - Math.hypot(t.x - b.x, t.y - b.y))[0];
          if (tgt) bias = { x: tgt.x, y: tgt.y, strength: 0.9 };
        }
        walk(t, dt, { speed: t.speed, turn: 1.6, bounds, bias });
      } else if (t.mode === 'dock') {
        t.t += dt;
        const q = clamp(t.t / 0.45, 0, 1);
        t.x = lerp(t.from.x, t.dock.x, q);
        t.y = lerp(t.from.y, t.dock.y, q);
        const c = t.target;
        if (t.t > 1.0 && c.p === 0) c.p = 1e-4;
        if (c.p >= 0.5) {
          // detach intact, back off, and move on
          t.mode = 'detach';
          t.t = 0;
          t.heading = t.dockAngle;
          t.fixed = false;
          t.cool = 2.2;
        }
      } else if (t.mode === 'detach') {
        t.t += dt;
        t.x += Math.cos(t.heading) * 22 * dt;
        t.y += Math.sin(t.heading) * 22 * dt;
        if (t.t > 0.9) t.mode = 'walk';
      }
    }
    // dying targets
    for (const c of cancers) {
      if (c.p > 0 && c.p < 1) {
        c.p = Math.min(1, c.p + dt / 2.6);
        if (c.p >= 1) { c.dead = true; killed++; }
      }
    }
    // keep cells apart (cancer cells and docked T cells don't move)
    const all = [...tcells, ...live];
    hash.build(all);
    relax(all, { hash, iterations: 1, strength: 0.5, pad: 1.5 });
    // contacts
    for (const t of tcells) {
      if (t.mode !== 'walk' || t.cool > 0 || !canKill(t)) continue;
      for (const c of live) {
        if (c.target || c.p > 0) continue;
        const d = Math.hypot(t.x - c.x, t.y - c.y);
        if (d > t.r + c.r + 4) continue;
        dock(t, c);
        break;
      }
    }
    // bridges fade with their pair
    for (const b of bridges) {
      b.t += dt;
      const on = b.t < 0.35 ? b.t / 0.35 : b.cell.p < 0.45 ? 1 : Math.max(0, 1 - (b.cell.p - 0.45) / 0.1);
      b.o = on;
    }
    bridges = bridges.filter((b) => { if (b.o <= 0 && b.t > 0.4) { b.g.remove(); return false; } return true; });
    fx.step(dt);
  }

  function dock(t, c) {
    const ang = Math.atan2(t.y - c.y, t.x - c.x);
    const engaged = state.mode !== 'none';
    const gap = !engaged ? 1 : state.mode === 'tcr' ? L.rT * 1.3 : L.rT;
    c.target = t;
    t.mode = 'dock';
    t.target = c;
    t.t = 0;
    t.fixed = true;
    t.dockAngle = ang;
    t.from = { x: t.x, y: t.y };
    t.dock = { x: c.x + Math.cos(ang) * (c.r + t.r + gap - 2), y: c.y + Math.sin(ang) * (c.r + t.r + gap - 2) };
    const cx = c.x + Math.cos(ang) * (c.r + gap / 2), cy = c.y + Math.sin(ang) * (c.r + gap / 2);
    contactRing(fx, cx, cy, { color: t.kind === 'cd8' ? C.cd8 : C.cd4, r: L.rT * 0.9, life: 1.2 });
    if (!engaged) {
      // natural recognition: a green-cyan "+" at the contact (rule 5)
      fx.add({ t: 0, life: 1.8, x: cx + Math.cos(ang + 1.2) * L.rT * 1.2, y: cy + Math.sin(ang + 1.2) * L.rT * 1.2, draw: drawPlus });
    } else {
      const g = engagerGlyph(gap);
      top.insertBefore(g, top.firstChild?.nextSibling || null);
      bridges.push({ g, t: 0, o: 0, cell: c, x: cx, y: cy, ang });
    }
  }

  /** The engager spanning the gap. Frame: origin at the gap's middle, +x toward the T cell. */
  function engagerGlyph(gap) {
    const g = ctx.svg('g', { opacity: 0 });
    if (state.mode === 'antibody') {
      const u = gap / 0.7 + 2;
      const ab = antibody({ variant: 'bispecific', targets: ['cd8', PALETTE.antigen], size: u, stage: 'dark', anchor: 'center' });
      // the two arm tips straddle the gap: blue CD3 tip on the T cell (+x), the other on the cancer cell
      ab.setAttribute('transform', `translate(0 ${f(-0.45 * u)}) rotate(180)`);
      g.append(ab);
    } else {
      const size = gap / 1.45;
      const te = tebentafusp(ctx, size);
      // TCR face on the cancer cell (−x), anti-CD3 tip on the T cell (+x)
      te.setAttribute('transform', `translate(${f(-gap / 2)} 0) rotate(90)`);
      g.append(te);
    }
    return g;
  }

  function drawPlus(g, e) {
    const p = e.t / e.life;
    const a = Math.min(1, p * 5) * (1 - Math.max(0, (p - 0.7) / 0.3));
    const r = L.rT * 0.55;
    g.save();
    g.globalAlpha = a;
    g.fillStyle = mix(PALETTE.activating, '#0B1024', 0.15);
    g.strokeStyle = mix(PALETTE.activating, '#FFFFFF', 0.4);
    g.lineWidth = 1;
    g.beginPath(); g.arc(e.x, e.y, r, 0, TAU); g.fill(); g.stroke();
    g.strokeStyle = '#0B1024';
    g.lineWidth = Math.max(1.4, r * 0.32);
    g.lineCap = 'round';
    g.beginPath(); g.moveTo(e.x - r * 0.55, e.y); g.lineTo(e.x + r * 0.55, e.y); g.moveTo(e.x, e.y - r * 0.55); g.lineTo(e.x, e.y + r * 0.55); g.stroke();
    g.restore();
  }

  // ---------------------------------------------------------------- render
  let lastKilled = -1;
  function render() {
    if (!sheet) return;
    const [W, H] = L.vb;
    const g = cv.g;
    const k = Math.min(cv.width / W, cv.height / H);
    const ox = (cv.width - W * k) / 2, oy = (cv.height - H * k) / 2;
    cv.clear();
    g.save();
    g.translate(ox, oy);
    g.scale(k, k);
    // cancer cells (SVG): apoptosis by setDying
    let relabel = false;
    for (const c of cancers) {
      if (c.p > 0 && c.p !== c.drawnP) {
        if (c.drawnP == null || (c.drawnP < 0.15 && c.p >= 0.15)) relabel = true;
        setDying(c.art, c.p);
        c.art.setAttribute('opacity', f(1 - 0.5 * clamp((c.p - 0.7) / 0.3, 0, 1)));   // the dead recede
        c.drawnP = c.p;
      }
    }
    if (relabel) applyDisplay();
    // T cells
    for (const t of tcells) {
      const color = t.kind;
      if (t.match) {
        const grd = g.createRadialGradient(t.x, t.y, t.r * 0.8, t.x, t.y, t.r * 2.3);
        grd.addColorStop(0, 'rgba(255,255,255,0.0)');
        grd.addColorStop(0.45, 'rgba(210,230,255,0.28)');
        grd.addColorStop(1, 'rgba(210,230,255,0)');
        g.fillStyle = grd;
        g.beginPath(); g.arc(t.x, t.y, t.r * 2.3, 0, TAU); g.fill();
        g.strokeStyle = 'rgba(233,240,255,0.65)';
        g.lineWidth = 1.2;
        g.beginPath(); g.arc(t.x, t.y, t.r * 1.75, 0, TAU); g.stroke();
      }
      const h = t.mode === 'dock' ? t.dockAngle + Math.PI : t.heading;
      const squash = t.mode === 'dock' ? clamp(t.t / 0.45, 0, 1) : t.mode === 'detach' ? Math.max(0, 1 - t.t / 0.5) : 0;
      const img = sheet.get(color, t.variant);
      g.save();
      g.translate(t.x, t.y);
      g.rotate(h);
      g.scale(1 - 0.13 * squash, 1 + 0.07 * squash);
      ART.drawSprite(g, img, 0, 0);
      g.restore();
      const tip = tips[`${color}-${t.key}`];
      if (tip) {
        const d = t.r * (1.02 - 0.12 * squash);
        ART.drawSprite(g, tip, t.x + Math.cos(h) * d, t.y + Math.sin(h) * d, { rotation: h + Math.PI / 2 });
      }
    }
    fx.draw(g);
    g.restore();
    // bridges (SVG overlay, spanning both membranes)
    for (const b of bridges) {
      b.g.setAttribute('opacity', f(b.o));
      b.g.setAttribute('transform', `translate(${f(b.x)} ${f(b.y)}) rotate(${f(b.ang / DEG)})`);
    }
    if (killed !== lastKilled) { lastKilled = killed; counter.set(killed); }
  }

  // ---------------------------------------------------------------- controls, caption
  const capKey = () => {
    const { mode, hidden, hla } = state;
    if (mode === 'none') return hidden ? 'noneHidden' : 'none';
    if (mode === 'antibody') return 'antibody';
    if (hidden) return 'tcrHidden';
    return hla === 'other' ? 'tcrOther' : 'tcr';
  };
  const cap = ctx.h('p', { class: 'br-cap', 'aria-live': 'polite' }, CAPTIONS.none);
  const hlaBtn = ctx.h('button', { type: 'button', class: 'btn btn--ghost btn--sm br-hla', hidden: true }, 'What if the patient has a different HLA type?');
  const foot = ctx.h('p', { class: 'br-foot' }, 'One matching T cell in about 40 is shown so you can find it. In reality, about one T cell in 10,000 to a million matches a given target, usually toward the rare end.');
  ctx.caption.append(cap, hlaBtn, foot);

  function update({ restartSim = true } = {}) {
    hlaBtn.hidden = state.mode !== 'tcr';
    hlaBtn.textContent = state.hla === 'a02' ? 'What if the patient has a different HLA type?' : 'Back to HLA-A*02:01';
    cap.textContent = CAPTIONS[capKey()];
    if (restartSim) restart();
  }
  ctx.on(hlaBtn, 'click', () => { state.hla = state.hla === 'a02' ? 'other' : 'a02'; update(); });

  const advance = fixedStep(step, { dt: 1 / 60, max: 4 });
  const loop = ctx.loop((dt) => { advance(dt); render(); });
  ctx.ui.playPause({ loop, onChange: (on) => ctx.announce(on ? 'Simulation running' : 'Simulation paused') });
  const engSeg = ctx.ui.segmented({
    label: 'Engager',
    value: 'none',
    options: [
      { value: 'none', label: 'None' },
      { value: 'antibody', label: 'Antibody-based (e.g., blinatumomab, tarlatamab)' },
      { value: 'tcr', label: 'TCR-based (tebentafusp)' },
    ],
    onChange: (v) => { state.mode = v; if (v !== 'tcr') state.hla = 'a02'; update(); },
  });
  engSeg.el.classList.add('br-engager');
  ctx.ui.toggle({ label: 'Tumor loses MHC class I', onChange: (on) => { state.hidden = on; update(); } });
  const countWrap = ctx.h('div', { class: 'br-count' });
  ctx.controls.append(countWrap);
  const counter = ctx.ui.stat({ label: 'Cancer cells destroyed', value: 0, unit: ' / 8', parent: countWrap });
  countWrap.append(ctx.h('span', { class: 'br-ill' }, 'Illustrative'));
  ctx.ui.button({ label: 'Replay', icon: 'replay', variant: 'ghost', small: true, onClick: () => restart() });   // re-runs this setting from the start (POLISH S8)
  ctx.ui.legend([
    { label: 'Killer T cell', color: C.cd8, shape: 'circle' },
    { label: 'Helper T cell', color: C.cd4, shape: 'circle' },
    // the legend sits on the page, not the dark stage: a near-white ring vanished on paper
    { label: 'The one T cell whose receptor matches', color: 'var(--ink-2)', shape: 'ring' },
    { label: 'Cancer cell', color: C.cancer, shape: 'circle' },
  ]);

  // ---------------------------------------------------------------- layout
  async function relayout() {
    L = LAYOUTS[layoutName];
    cv.fit();
    await buildSprites();
    restart();
  }
  await relayout();
  ctx.onResize(({ compact }) => {
    const name = compact ? 'compact' : 'wide';
    if (name !== layoutName) { layoutName = name; relayout(); } else render();
  });

  return {
    destroy() { loop.pause(); },
  };
}
