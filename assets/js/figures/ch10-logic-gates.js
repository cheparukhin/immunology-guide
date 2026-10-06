// ch10-logic-gates — "Giving a CAR-T cell a safety check" (Chapter 10, Living Drugs).
// ONE idea: requiring two markers buys safety and costs escape resistance.
//
// A field of tissue on a canvas crowd (shared/agents.js): tumor cells (violet, irregular) carry
// marker A (square) AND marker B (triangle); healthy lung cells (sand, calm polygons) carry fewer
// A squares and no B (rule 4: antigens on stalks, shape = identity, A = square, B = triangle).
// CAR-T cells enter from the left and patrol.
//   • "Attack A": today's single-target CAR. Kills on A wherever it finds it — tumor and lung —
//     except the lowest-antigen lung cells (on-stage note: illustrative, depends on antigen density).
//   • "A AND B": synNotch-style two-step. Meeting A arms the cell (inner triangle glyph, a visible
//     pause standing in for hours of gene switching), and only then can it kill a cell carrying B.
// Antigen loss slider: that share of tumor cells lacks B. Under AND they survive and refill the
// space (chart.js population chart, dark-native, rule 1); under "Attack A" they die.
// Meters: shared/activity-meter (segments, words only, "Illustrative"). Crowd kills: contact ring +
// killSpecks (rule 6, crowd form).
import { cancerCell, healthyCell, tCell, car, antigen, placeOnMembrane, PALETTE, mix } from '../art/index.js';
import { rng, fixedStep, spatialHash, walk, relax, spriteStates, createEffects, killSpecks, contactRing } from './shared/agents.js';
import { C, scale, chartRoot, axis, pathD } from './shared/chart.js';
import { meter } from './shared/activity-meter.js';

const ID = 'ch10-logic-gates';
const RUN_S = 46;           // seconds of simulated time per run
const ARM_PAUSE = 1.1;      // the visible pause while the second receptor is switched on
const ARMED_FOR = 9;        // seconds an armed cell stays armed without meeting A again
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
const TAU = Math.PI * 2;

const LAYOUTS = {
  wide: {
    vb: [960, 540],
    field: { x: 16, y: 52, w: 664, h: 352 },
    grid: { cols: 10, rows: 5, r: 21, nest: { x: 476, y: 228, rx: 178, ry: 150 } },
    chart: { x0: 70, x1: 676, y0: 444, y1: 506, title: 432 },
    side: { x: 708, legendY: 74, meterY: [262, 330], w: 230 },
    note: { x: 716, y: 420, w: 236, lines: ['Illustrative: how much healthy', 'tissue is hit depends on how', 'much antigen those cells carry.'] },
    nT: 6, rt: 10.5,
  },
  compact: {
    vb: [400, 772],
    field: { x: 0, y: 136, w: 400, h: 330 },
    grid: { cols: 6, rows: 6, r: 18, nest: { x: 262, y: 306, rx: 120, ry: 124 } },
    chart: { x0: 72, x1: 388, y0: 556, y1: 612, title: 542 },
    side: { x: 16, legendY: 56, meterY: [664, 720], w: 368, compact: true },
    note: { x: 22, y: 494, w: 368, lines: ['Illustrative: how much healthy tissue is hit', 'depends on how much antigen those cells carry.'] },
    nT: 5, rt: 9.5,
  },
};

const STYLE = `
[data-figure="${ID}"] .lg-footer { display: inline-block; margin: 0.7rem 0 0; padding: 0.45rem 0.85rem;
  border-radius: var(--r-md, 10px); background: var(--paper-2); box-shadow: inset 0 0 0 1px var(--rule);
  font: 500 var(--text-xs, 13px)/1.35 var(--font-ui); color: var(--ink-2); }
[data-figure="${ID}"] .lg-footer b { color: var(--ink); font-weight: 650; }
[data-figure="${ID}"] .lg-hint { margin: 0.25rem 0 0; font: 400 var(--text-xs, 13px)/1.4 var(--font-ui); color: var(--ink-3); }
[data-figure="${ID}"] .lg-hint[hidden] { display: none; }
[data-figure="${ID}"] .slider.is-disabled { opacity: 0.5; }
[data-figure="${ID}"] .lg-svg { pointer-events: none; }
`;

export default async function mount(fig, ctx) {
  if (!document.getElementById('lg10-style')) document.head.append(ctx.h('style', { id: 'lg10-style', html: STYLE }));
  ctx.setAspect(16 / 9, 400 / 772);
  const cv = ctx.canvas();
  const fg = ctx.createSVG({ viewBox: '0 0 960 540', className: 'lg-svg' });
  const S = (tag, attrs, parent) => ctx.svg(tag, attrs, parent);
  ctx.tag('Illustrative', 'top-right');

  let layoutName = ctx.compact ? 'compact' : 'wide';
  let L = LAYOUTS[layoutName];
  let k = 1;
  let rule = 'a';            // 'a' (Attack A) | 'and' (A AND B)
  let loss = 0;              // 0..0.4 share of tumor cells without B
  const tried = { a: false, and: false };
  let sheet = null;
  let ready = false;
  const fx = createEffects();
  const hash = spatialHash(48);
  const near = [];

  // ------------------------------------------------------------------ sprites
  // Named factories (the sprite cache keys on the function name + params).
  function tumorCell(p) {
    const art = cancerCell({ r: p.r, seed: p.seed, mhc: 0, stage: 'dark' });
    const shapes = p.bneg ? ['square', 'square', 'square', 'square'] : ['square', 'triangle', 'square', 'triangle', 'square', 'triangle', 'square'];
    placeOnMembrane(art, (o, i) => antigen({ ...o, shape: shapes[i] }), { count: shapes.length, size: p.r * 0.78, seed: p.seed + 3, layer: 'antigens', detail: 'high' });
    return art;
  }
  function lungCell(p) {
    const art = healthyCell({ r: p.r, seed: p.seed, mhc: 0, shape: 'polygon', stage: 'dark' });
    placeOnMembrane(art, (o) => antigen({ ...o, shape: 'square' }), { count: p.nA, size: p.r * 0.78, seed: p.seed + 5, layer: 'antigens', detail: 'high', offset: 0.6 });
    return art;
  }
  function carTCell(p) {
    const art = tCell({ variant: 'cd8', r: p.r, state: 'activated', seed: p.seed, polarity: 0, receptors: false, stage: 'dark' });
    placeOnMembrane(art, (o) => car({ ...o, size: p.r * 0.62 }), { count: 5, size: p.r * 0.62, seed: p.seed, offset: 0.1, layer: 'cars' });
    return art;
  }
  async function buildSprites() {
    const G = L.grid;
    const sc = Math.min(3, (window.devicePixelRatio || 1) * Math.max(1, k));
    sheet = await spriteStates({
      tumor: { kind: tumorCell, params: { r: G.r }, seeds: 4 },
      escape: { kind: tumorCell, params: { r: G.r, bneg: true }, seeds: 3 },
      lung1: { kind: lungCell, params: { r: G.r, nA: 1 }, seeds: 3 },
      lung2: { kind: lungCell, params: { r: G.r, nA: 2 }, seeds: 3 },
      lung3: { kind: lungCell, params: { r: G.r, nA: 3 }, seeds: 3 },
      t: { kind: carTCell, params: { r: L.rt }, seeds: 3 },
    }, { scale: sc });
  }

  // ------------------------------------------------------------------ the field
  let slots, cells, ts, R, simT, series, firstArm, nTumor0, nLung0;
  function buildSlots() {
    const F = L.field, G = L.grid;
    const r0 = rng(77);
    const out = [];
    const dx = (F.w - 2 * G.r - 16) / (G.cols - 0.5), dy = (F.h - 2 * G.r - 16) / (G.rows - 1);
    for (let j = 0; j < G.rows; j++) {
      for (let i = 0; i < G.cols; i++) {
        const x = F.x + G.r + 8 + i * dx + (j % 2 ? dx / 2 : 0) + r0.range(-6, 6);
        const y = F.y + G.r + 8 + j * dy + r0.range(-5, 5);
        const nx = (x - G.nest.x) / G.nest.rx, ny = (y - G.nest.y) / G.nest.ry;
        out.push({ i: out.length, x, y, nest: nx * nx + ny * ny < 1, cell: null });
      }
    }
    // neighbours (for division into a freed space)
    for (const s of out) s.nb = out.filter((q) => q !== s && Math.hypot(q.x - s.x, q.y - s.y) < Math.max(dx, dy) * 1.25);
    return out;
  }
  function reset() {
    R = rng(rule === 'and' ? 911 : 313);
    simT = 0; firstArm = null; series = [];
    fx.clear();
    slots = buildSlots();
    cells = [];
    const G = L.grid;
    const rl = rng(2024);                 // same field (and same antigen-loss cells) for both rules
    const tumorSlots = slots.filter((s) => s.nest);
    const nLoss = Math.round(tumorSlots.length * loss);
    const lossSet = new Set(tumorSlots.map((s) => ({ s, k: rl() })).sort((a, b) => a.k - b.k).slice(0, nLoss).map((o) => o.s.i));
    let id = 1;
    for (const s of slots) {
      const c = { id: id++, slot: s, x: s.x, y: s.y, r: G.r, variant: s.i, fixed: true };
      if (s.nest) { c.type = 'tumor'; c.b = !lossSet.has(s.i); c.state = c.b ? 'tumor' : 'escape'; c.div = rl.range(7, 12); }
      else {
        const u = rl();
        c.type = 'lung'; c.b = false;
        c.nA = u < 0.26 ? 1 : u < 0.62 ? 2 : 3;   // a minority carry very little A
        c.state = `lung${c.nA}`;
      }
      s.cell = c;
      cells.push(c);
    }
    nTumor0 = cells.filter((c) => c.type === 'tumor').length;
    nLung0 = cells.length - nTumor0;
    ts = [];
    for (let i = 0; i < L.nT; i++) {
      const F = L.field;
      ts.push({ id: 1000 + i, x: F.x - 20 - i * 26, y: lerp(F.y + 40, F.y + F.h - 40, (i + 0.5) / L.nT), r: L.rt, heading: R.range(-0.4, 0.4), rng: rng(4000 + i), variant: i, busy: 0, armed: 0, arming: 0, ignore: new Map(), kind: 't' });
    }
    if (meters) { meters.tumor.set(1, { duration: 0 }); meters.dmg.set(0, { duration: 0 }); }
  }

  // ------------------------------------------------------------------ sim step
  function step(dt) {
    if (simT >= RUN_S) return;
    simT += dt;
    const F = L.field;
    const live = cells.filter((c) => !c.dead && !c.dying);
    hash.build(live);
    for (const a of ts) {
      // enter from the left edge first
      const inside = a.x > F.x + a.r;
      for (const [cid, until] of a.ignore) if (until < simT) a.ignore.delete(cid);
      if (a.arming > 0) {                       // the pause: the second receptor is being switched on
        a.arming -= dt;
        if (a.arming <= 0) { a.armed = ARMED_FOR; if (a.prey && a.prey.b && !a.prey.dying && !a.prey.claimed) startKill(a, a.prey); else a.prey = null; }
        continue;
      }
      if (a.armed > 0) a.armed -= dt;
      if (a.busy > 0) {
        a.busy -= dt;
        if (a.busy <= 0.3 && a.prey && !a.prey.dying) {
          killSpecks(fx, a.prey, { color: a.prey.type === 'tumor' ? PALETTE.cancer : PALETTE.healthy, seed: a.prey.id, life: 0.6 });
          a.prey.dying = 0.0001;
        }
        if (a.busy <= 0) a.prey = null;
        continue;
      }
      // where to go: the nearest cell this rule cares about
      let goal = null, bd = 1e9;
      const wantB = rule === 'and' && a.armed > 0;
      for (const c of live) {
        if (c.claimed || a.ignore.has(c.id)) continue;
        if (wantB && !c.b) continue;
        const d = Math.hypot(c.x - a.x, c.y - a.y);
        if (d < bd) { bd = d; goal = c; }
      }
      const bias = !inside ? { angle: 0, strength: 3 } : goal ? { x: goal.x, y: goal.y, strength: 1.8 } : null;
      walk(a, dt, { speed: inside ? 58 : 70, turn: 1.4, bias, bounds: inside ? { x0: F.x + 6, y0: F.y + 6, x1: F.x + F.w - 6, y1: F.y + F.h - 6 } : null });
      if (!inside) continue;
      // contact
      hash.near(a.x, a.y, a.r + L.grid.r + 3, near);
      for (const c of near) {
        if (c.dead || c.dying || c.claimed || a.ignore.has(c.id)) continue;
        if (rule === 'a') {
          if (c.type === 'lung' && c.nA === 1) {            // too little A to trigger the cell
            a.ignore.set(c.id, simT + 12);
            continue;
          }
          startKill(a, c);
          break;
        }
        // A AND B
        if (a.armed > 0) {
          if (c.b) { startKill(a, c); break; }
          a.armed = ARMED_FOR;                                   // meeting A again keeps it armed
          a.ignore.set(c.id, simT + 10);
          continue;
        }
        // not yet armed: A arms it (every cell here carries A) — then the pause
        a.arming = ARM_PAUSE;
        a.prey = c;
        a.armedAt = { x: (a.x + c.x) / 2, y: (a.y + c.y) / 2 };
        if (!c.b) a.ignore.set(c.id, simT + 10);
        contactRing(fx, (a.x + c.x) / 2, (a.y + c.y) / 2, { color: PALETTE.cd8, r: 11, life: 0.9 });
        if (!firstArm) firstArm = { a, t: simT };
        break;
      }
    }
    relax(ts.filter((a) => a.x > F.x), { strength: 0.5, pad: a0pad });
    // tumor growth: tumor cells divide into a freed neighbouring space
    for (const c of cells) {
      if (c.type !== 'tumor' || c.dead || c.dying) continue;
      c.div -= dt;
      if (c.div > 0) continue;
      c.div = R.range(5, 8.5);
      const free = c.slot.nb.filter((s) => !s.cell || s.cell.dead);
      if (!free.length) continue;
      const s = free[Math.floor(R() * free.length)];
      const d = { id: cells.length + 1, slot: s, x: s.x, y: s.y, r: c.r, variant: c.variant + 7, fixed: true, type: 'tumor', b: c.b, state: c.state, div: R.range(5, 8.5), born: 0.0001 };
      s.cell = d;
      cells.push(d);
    }
    for (const c of cells) {
      if (c.born) c.born = Math.min(1, c.born + dt / 0.9);
      if (c.dying >= 1 && !c.dead) c.dead = true;
    }
    fx.step(dt);
    // population series (tumor cells)
    if (!series.length || simT - series[series.length - 1][0] >= 0.25) series.push([simT, tumorCount()]);
    if (simT >= 10) tried[rule] = true;
    if (tried.a && tried.and) unlockLoss();
    if (simT >= RUN_S) onEnd();
  }
  const a0pad = 2;
  function startKill(a, c) {
    c.claimed = true;
    a.prey = c;
    a.busy = 0.8;
    contactRing(fx, (a.x + c.x) / 2, (a.y + c.y) / 2, { color: PALETTE.cd8, r: 11, life: 0.9 });
  }
  const tumorCount = () => cells.filter((c) => c.type === 'tumor' && !c.dead && !(c.dying > 0.5)).length;
  const lungDead = () => cells.filter((c) => c.type === 'lung' && (c.dead || c.dying)).length;

  // ------------------------------------------------------------------ render
  let A = {};
  function render() {
    const g = cv.g;
    cv.clear();
    if (!sheet) return;
    g.save();
    g.scale(k, k);
    const F = L.field;
    g.save();
    g.beginPath();
    if (g.roundRect && layoutName === 'wide') g.roundRect(F.x, F.y, F.w, F.h, 14); else g.rect(F.x, F.y, F.w, F.h);
    g.fillStyle = 'rgba(24, 32, 64, 0.5)';
    g.fill();
    g.clip();
    for (const c of cells) {
      if (c.dead) continue;
      sheet.draw(g, { x: c.x, y: c.y, variant: c.variant, dying: c.dying, scale: c.born ? 0.4 + 0.6 * c.born : 1, alpha: c.born ? Math.min(1, c.born * 1.5) : 1, r: c.r }, { state: c.state });
    }
    for (const a of ts) {
      sheet.draw(g, { x: a.x, y: a.y, variant: a.variant, rotation: a.heading, r: a.r }, { state: 't' });
      if (rule === 'and') drawArmGlyph(g, a);
    }
    fx.draw(g);
    g.restore();
    g.restore();
    renderSVG();
  }
  /** The "armed" inner glyph: a triangle receptor lighting up (plus a progress arc during the pause). */
  function drawArmGlyph(g, a) {
    const r = a.r;
    if (a.arming > 0) {
      const p = 1 - a.arming / ARM_PAUSE;
      g.save();
      g.strokeStyle = 'rgba(233, 236, 246, 0.85)';
      g.lineWidth = 1.6;
      g.beginPath();
      g.arc(a.x, a.y, r * 1.75, -Math.PI / 2, -Math.PI / 2 + TAU * p);
      g.stroke();
      g.restore();
    }
    const on = a.arming > 0 ? clamp(1 - a.arming / ARM_PAUSE, 0, 1) : a.armed > 0 ? clamp(a.armed / 1.5, 0.35, 1) : 0;
    if (on <= 0.01) return;
    const s = r * 0.62;
    g.save();
    g.globalAlpha = on;
    const grd = g.createRadialGradient(a.x, a.y, 0, a.x, a.y, s * 1.8);
    grd.addColorStop(0, 'rgba(255,255,255,0.75)');
    grd.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grd;
    g.beginPath(); g.arc(a.x, a.y, s * 1.8, 0, TAU); g.fill();
    g.beginPath();
    g.moveTo(a.x, a.y - s * 0.75);
    g.lineTo(a.x + s * 0.68, a.y + s * 0.45);
    g.lineTo(a.x - s * 0.68, a.y + s * 0.45);
    g.closePath();
    g.fillStyle = mix(PALETTE.antigen, '#FFFFFF', 0.5);
    g.strokeStyle = '#0B1024';
    g.lineWidth = 1.2;
    g.fill(); g.stroke();
    g.restore();
  }

  // ------------------------------------------------------------------ SVG overlay: legend, chart, meters, chips
  let meters = null;
  function drawSVG() {
    for (const n of [...fg.children]) if (n !== fg.defs) n.remove();
    fg.setAttribute('viewBox', `0 0 ${L.vb[0]} ${L.vb[1]}`);
    ctx.refreshTextScale();
    A = {};
    const F = L.field, SD = L.side;
    if (layoutName === 'wide') S('rect', { x: F.x + 0.5, y: F.y + 0.5, width: F.w - 1, height: F.h - 1, rx: 14, style: 'fill: none; stroke: var(--line); stroke-width: 1' }, fg);
    S('text', { class: 't-caps t-halo', x: F.x + 14, y: F.y - 10 + (layoutName === 'wide' ? 0 : 0), text: 'Lung tissue with a tumor', style: 'fill: var(--fg-3)' }, fg);

    // ---------- legend (named once each; shape + color)
    const lg = S('g', { class: 'lg-legend' }, fg);
    const item = (x, y, glyph, text, sub) => {
      const gG = S('g', { transform: `translate(${x} ${y})` }, lg);
      gG.append(glyph);
      S('text', { class: 't-small', x: 26, y: 0, text, style: 'fill: var(--fg); font-weight: 600' }, gG).setAttribute('dominant-baseline', 'central');
      if (sub) S('text', { class: 't-small', x: 26, y: 17, text: sub, style: 'fill: var(--fg-2)' }, gG).setAttribute('dominant-baseline', 'central');
      return gG;
    };
    const mini = (art) => { const w = S('g', {}); w.append(art); return w; };
    const ag = (shape) => { const w = S('g', {}); w.append(antigen({ size: 26, shape, stage: 'dark' })); w.setAttribute('transform', 'translate(0 11)'); return w; };
    if (!SD.compact) {
      S('text', { class: 't-caps', x: SD.x, y: SD.legendY - 18, text: 'Who is who' }, lg);
      item(SD.x + 12, SD.legendY + 10, mini(tumorCell({ r: 12, seed: 3 })), 'Tumor cell', 'carries A and B');
      item(SD.x + 12, SD.legendY + 52, mini(lungCell({ r: 12, seed: 4, nA: 2 })), 'Healthy lung cell', 'carries A only');
      item(SD.x + 12, SD.legendY + 94, mini(carTCell({ r: 9, seed: 2 })), 'CAR-T cell', null);
      item(SD.x + 4, SD.legendY + 132, ag('square'), 'Marker A', null);
      item(SD.x + 120, SD.legendY + 132, ag('triangle'), 'Marker B', null);
    } else {
      item(SD.x + 10, SD.legendY, mini(tumorCell({ r: 10, seed: 3 })), 'Tumor cell: A + B', null);
      item(SD.x + 210, SD.legendY, mini(carTCell({ r: 8, seed: 2 })), 'CAR-T cell', null);
      item(SD.x + 10, SD.legendY + 38, mini(lungCell({ r: 10, seed: 4, nA: 2 })), 'Lung cell: A only', null);
      item(SD.x + 214, SD.legendY + 32, ag('square'), 'A', null);
      item(SD.x + 290, SD.legendY + 32, ag('triangle'), 'B', null);
    }

    // ---------- the on-stage honesty note (Attack A) and the arming chip (AND)
    const N = L.note;
    A.note = S('g', { opacity: 0 }, fg);
    const noteLines = N.lines;
    const nh = noteLines.length * 16 + 14;
    S('rect', { x: N.x - 10, y: N.y - 22, width: N.w, height: nh, rx: 8, style: 'fill: rgb(11 16 36 / 0.82); stroke: var(--line); stroke-width: 1' }, A.note);
    noteLines.forEach((ln, i) => S('text', { class: 't-small', x: N.x, y: N.y - 4 + i * 16, text: ln, style: 'fill: var(--fg-2)' }, A.note));
    A.chip = S('g', { opacity: 0 }, fg);
    A.chipBg = S('rect', { x: 0, y: -14, width: 10, height: 28, rx: 14, style: 'fill: rgb(11 16 36 / 0.9); stroke: rgb(233 236 246 / 0.5); stroke-width: 1' }, A.chip);
    A.chipT = S('text', { class: 't-small', x: 12, y: 5, text: 'activated by A, now targets B', style: 'fill: var(--fg); font-weight: 600' }, A.chip);
    let w = 0; try { w = A.chipT.getComputedTextLength(); } catch (e) { /* not rendered */ }
    A.chipW = (w || 190) + 24;
    A.chipBg.setAttribute('width', A.chipW);

    // ---------- population chart (tumor cells over time), dark-native
    const CH = L.chart;
    const root = chartRoot(fg, { theme: 'stage-dark' });
    S('text', { class: 't-caps', x: CH.x0, y: CH.title, text: 'Tumor cells over time' }, root);
    A.x = scale({ domain: [0, RUN_S], range: [CH.x0, CH.x1] });
    A.y = scale({ domain: [0, 1.15], range: [CH.y1, CH.y0] });
    axis(root, { scale: A.y, orient: 'left', at: CH.x0, ticks: [0, 1], format: (v) => (v ? 'at start' : '0'), grid: [CH.x0, CH.x1], tickSize: 0 });
    axis(root, { scale: A.x, orient: 'bottom', at: CH.y1, ticks: [], labels: false, tickSize: 0 });
    S('text', { class: 't-small t-end', x: CH.x1, y: CH.y1 + 16, text: 'time →', style: 'fill: var(--fg-3)' }, root);
    A.pop = S('path', { d: '', style: `fill: none; stroke: ${C.stroke('cancer')}; stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round` }, root);
    A.popArea = S('path', { d: '', style: `fill: ${C.fill('cancer')}; fill-opacity: 0.12; stroke: none` }, root);

    // ---------- meters (activity-meter segments; tinted by the --fg token of their group)
    const MW = SD.w;
    S('text', { class: 't-caps t-muted', x: SD.x + MW, y: SD.meterY[0] - 16, 'text-anchor': 'end', text: 'Illustrative, not measured', style: 'fill: var(--fg-3)' }, fg);
    // Shared meter tones (POLISH B6): tumor burden = cancer-violet, harm = brake-crimson.
    const mT = S('g', {}, fg);
    const mD = S('g', {}, fg);
    meters = {
      tumor: meter(mT, { mode: 'segments', count: 6, title: 'Tumor cells remaining', tone: 'cancer', tag: null, x: SD.x, y: SD.meterY[0], width: MW, values: 1 }),
      dmg: meter(mD, { mode: 'segments', count: 6, title: 'Healthy tissue damage', tone: 'risk', tag: null, x: SD.x, y: SD.meterY[1], width: MW, values: 0 }),
    };
  }

  function renderSVG() {
    // honesty note: shown under "Attack A" once lung cells start to die
    A.note.setAttribute('opacity', rule === 'a' && lungDead() > 0 ? '1' : '0');
    // arming chip follows the first armed cell for a few seconds
    if (rule === 'and' && firstArm && simT - firstArm.t < 4.2) {
      const a = firstArm.a;
      const F = L.field;
      const x = clamp(a.x - A.chipW / 2, F.x + 6, F.x + F.w - A.chipW - 6);
      const y = clamp(a.y - a.r * 2.6, F.y + 20, F.y + F.h - 20);
      A.chip.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
      const age = simT - firstArm.t;
      A.chip.setAttribute('opacity', String(clamp(Math.min(age / 0.3, (4.2 - age) / 0.5), 0, 1).toFixed(2)));
    } else A.chip.setAttribute('opacity', '0');
    // population chart
    if (series.length) {
      const pts = series.map(([tt, n]) => [A.x(tt), A.y(n / nTumor0)]);
      A.pop.setAttribute('d', pathD(pts));
      A.popArea.setAttribute('d', `${pathD(pts)}L${pts[pts.length - 1][0]},${A.y(0)}L${pts[0][0]},${A.y(0)}Z`);
    } else { A.pop.setAttribute('d', ''); A.popArea.setAttribute('d', ''); }
  }
  let lastMeterAt = -1;
  function updateMeters(force) {
    if (!meters) return;
    if (!force && simT - lastMeterAt < 0.4) return;
    lastMeterAt = simT;
    meters.tumor.set(clamp(tumorCount() / nTumor0, 0, 1), { duration: force ? 0 : 0.35 });
    meters.dmg.set(clamp(lungDead() / nLung0, 0, 1), { duration: force ? 0 : 0.35 });
  }

  // ------------------------------------------------------------------ controls
  let ended = false;
  function onEnd() {
    ended = true;
    loop.pause();
    updateMeters(true);
    const tum = tumorCount(), dead = lungDead();
    const lungWord = dead === 0 ? 'no healthy lung cells were harmed' : dead > nLung0 * 0.5 ? 'most healthy lung cells were killed' : 'some healthy lung cells were killed';
    const tumWord = tum === 0 ? 'the tumor was cleared' : tum >= nTumor0 * 0.6 ? 'the tumor grew back from cells lacking marker B' : 'some tumor cells survived';
    ctx.announce(`${rule === 'a' ? 'Attack A' : 'A AND B'}: ${tumWord}, and ${lungWord}.`);
  }
  let ticks = 0;
  const stepFixed = fixedStep(step, { dt: 1 / 60, max: 6 });
  const loop = ctx.loop((dt) => {
    if (!ready) return;
    stepFixed(dt);
    render();
    if ((ticks++ & 7) === 0) updateMeters(false);
  });
  ctx.ui.playPause({ loop, onChange: (on) => { if (on && ended) restart(); } });
  ctx.ui.button({ label: 'Replay', icon: 'replay', variant: 'ghost', onClick: () => { restart(); if (!loop.playing) loop.play(); } });
  ctx.ui.segmented({
    label: 'Targeting rule',
    options: [{ value: 'a', label: 'Attack A' }, { value: 'and', label: 'A AND B' }],
    value: rule,
    onChange: (v) => { rule = v; restart(); if (!loop.playing && !ctx.reducedMotion) loop.play(); ctx.announce(v === 'a' ? 'Rule: attack any cell carrying marker A.' : 'Rule: marker A induces a receptor for marker B; only then can the cell kill a cell carrying B.'); },
  });
  const lossSlider = ctx.ui.slider({
    label: 'Antigen loss', min: 0, max: 40, step: 5, value: 0,
    format: (v) => `${v}% of tumor cells lack B`,
    describe: (v) => `${v} percent of tumor cells lack marker B`,
    onChange: (v) => { loss = v / 100; restart(); if (!loop.playing && !ctx.reducedMotion) loop.play(); },
  });
  lossSlider.input.disabled = true;
  lossSlider.el.classList.add('is-disabled');
  const hint = ctx.h('p', { class: 'lg-hint', text: 'Antigen loss unlocks after you have watched both targeting rules.' });
  lossSlider.el.after(hint);
  function unlockLoss() {
    if (!lossSlider.input.disabled) return;
    lossSlider.input.disabled = false;
    lossSlider.el.classList.remove('is-disabled');
    hint.hidden = true;
    ctx.announce('Antigen loss slider unlocked.');
  }
  const footer = ctx.h('p', { class: 'lg-footer', html: '<b>Experimental.</b> Two-marker CAR-T cells are experimental. Every approved product today uses a single target.' });
  ctx.controls.after(footer);

  function restart() {
    ended = false;
    reset();
    lastMeterAt = -1;
    if (ctx.reducedMotion) { stillFrame(); return; }
    render();
  }
  /** Reduced motion: a meaningful still (the run's end state); Play replays it. */
  function stillFrame() {
    const n = Math.round(RUN_S * 60);
    for (let i = 0; i < n && simT < RUN_S; i++) step(1 / 60);
    render();
    updateMeters(true);
  }

  // ------------------------------------------------------------------ layout
  k = cv.width / L.vb[0];
  drawSVG();
  await buildSprites();
  reset();
  ready = true;
  if (ctx.reducedMotion) stillFrame(); else render();

  ctx.onResize(async ({ compact }) => {
    const next = compact ? 'compact' : 'wide';
    if (next !== layoutName) {
      layoutName = next;
      L = LAYOUTS[layoutName];
      ready = false;
      k = cv.width / L.vb[0];
      drawSVG();
      await buildSprites();
      ready = true;
      restart();
      return;
    }
    const nk = cv.width / L.vb[0];
    if (Math.abs(nk - k) > 0.01) { k = nk; render(); }
  });

  return { destroy() { loop.pause(); footer.remove(); hint.remove(); } };
}
