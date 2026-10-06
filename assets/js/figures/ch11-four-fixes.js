// ch11-four-fixes — "Four weak links" (Figure 11.2). FIGURE-AUDIT §2D, §2J, §4.
//
// A switchboard for a useful framework (not a settled verdict): four two-position switches
// (Target · Alarm · Tumor at vaccination · Brakes) drive two linked scenes.
//   LEFT  "Lymph node: training": a dendritic cell (immature = weak alarm, mature = strong)
//         holds MHC class I cups with a sand self peptide or a hot-pink neoantigen; matching
//         naive killer T cells dock TCR to cup (loose or snug), receive signal 2 ("+" discs,
//         strong alarm only) and photocopy themselves (cell-actions divide); the trained copies
//         leave for the tumor.
//   RIGHT "Tumor: the fight": the trained T cells enter from the left edge (top on phones) and
//         meet a large mass or a few scattered cancer cells carrying PD-L1. Brakes on: the
//         PD-1/PD-L1 pair locks (one crimson "−" disc on the T-cell side) and the T cell dims.
//         Released: a white-outlined gold anti-PD-1 caps PD-1 on the T cell, and T cells kill
//         by the shared grammar (recognition ring, setDying). Large masses also hide: some
//         touches end in a gray "no match" tick (cell-actions probe).
// Outcome = the spec's rule, implemented exactly: P (priming) = target + alarm, K (killing) =
// size + brakes, tier = min(P, K); trained T cells 1 / 3 / 3 / 8. Outcomes use the foundation
// badges ✕ ≈ ✓ (§2J); everything is a labeled cartoon ("Illustrative", disclaimer).
import {
  tCell, cancerCell, dendriticCell, lymphNodeField, tissueField, mhc1, tcr, pd1, pdl1, antibody,
  signalIcon, cellInfo, rayHit, antibodyTips, HEAD_Y, DOCK_GAP, breathe,
} from '../art/index.js';
import { rig, move, dock, polarize, recognize, kill, probe, divide } from './shared/cell-actions.js';
import { unitGrid } from './shared/unit-grid.js';
import { chartRoot } from './shared/chart.js';
import { STATUS } from './shared/cycle-data.js';

const ID = 'ch11-four-fixes';
const DEG = Math.PI / 180;
const GOLDEN = 137.508 * DEG;
const f = (v) => String(Math.round(v * 100) / 100);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const rot = (x, y, deg) => { const c = Math.cos(deg * DEG), s = Math.sin(deg * DEG); return { x: x * c - y * s, y: x * s + y * c }; };

// ---------------------------------------------------------------- writer's text (verbatim)
const SWITCHES = [
  { id: 'target', label: 'Target', opts: ['Tumor-associated antigen', 'Tumor mutations (neoantigens)'],
    caps: ['T cells that recognize proteins the body already makes are rarer and usually bind with lower affinity; many of the highest-affinity ones were removed by negative selection in the thymus.',
      'The mutation is new to the body, so T cells that bind it with high affinity were never deleted.'] },
  { id: 'alarm', label: 'Alarm', opts: ['Weak', 'Strong'],
    caps: ['Without a strong danger signal, dendritic cells give T cells signal 1 but not signal 2. Few T cells multiply.',
      'A strong adjuvant fully activates the dendritic cells, and matching T cells multiply.'] },
  { id: 'size', label: 'Tumor at vaccination', opts: ['Large, spread', 'Microscopic, after surgery'],
    caps: ['Billions of cancer cells, many of them able to hide: the newly primed T cells are outnumbered.',
      'After surgery, only scattered cancer cells remain, and the T cells can outnumber them.'] },
  { id: 'brakes', label: 'Brakes', opts: ['On', 'Released (anti-PD-1)'],
    caps: ['Cancer cells express PD-L1, which binds the PD-1 brake on T cells and inhibits them.',
      'Anti-PD-1 antibodies block the brake, and the T cells keep killing.'] },
];
const TIERS = [
  { kind: 'no', text: 'Little or no effect' },
  { kind: 'partial', text: 'A response, no clear benefit' },
  { kind: 'yes', text: 'The combination now in trials: early results suggest fewer relapses than anti-PD-1 alone, but this is not yet proven.' },
];
const PRESETS = [
  { id: 'A', label: 'A typical 1990s vaccine', cfg: [0, 0, 0, 0],
    caption: 'Peptides from normal proteins, a mild adjuvant, and patients with advanced disease. In one large tally of such trials, fewer than 3 in 100 patients saw their tumors shrink.' },
  { id: 'B', label: 'Personal mRNA vaccine + anti-PD-1 after surgery', cfg: [1, 1, 1, 1],
    // The last sentence is the single shared status string (cycle-data STATUS, FIGURE-AUDIT §7.2).
    caption: `Neoantigens, mRNA, early disease and released brakes. In a 157-patient melanoma trial, relapses were less common with the vaccine than with anti-PD-1 alone, a borderline result. ${STATUS['mrna-vaccine'].text}.` },
];
const DISCLAIMER = 'A cartoon of a framework, not a simulation of any real trial. Anti-PD-1 after surgery lowers the risk of relapse on its own; trials measure what a vaccine adds. Real outcomes depend on many more factors.';

// ---------------------------------------------------------------- the rule (spec, exactly)
const scoreP = (c) => c[0] + c[1];
const scoreK = (c) => c[2] + c[3];
const tierOf = (c) => Math.min(scoreP(c), scoreK(c));
const trainedOf = (c) => [[1, 3], [3, 8]][c[0]][c[1]];
// copies made by each matched T cell (sums to the trained count; 0 = shut down, signal 1 alone)
const copiesOf = (c) => (c[0] ? (c[1] ? [2, 2, 2, 2] : [1, 1, 1, 0]) : (c[1] ? [2, 1] : [1, 0]));

const CSS = `
[data-figure="${ID}"] .fig__stage { padding: clamp(10px, 1.6%, 18px); }
[data-figure="${ID}"] .ff { position: relative; z-index: 1; display: grid; gap: 10px; }
[data-figure="${ID}"] .ff > svg.fig__svg { position: relative; width: 100%; height: auto; display: block; }
[data-figure="${ID}"] .ff-strip { display: grid; grid-template-columns: minmax(0, 0.9fr) minmax(0, 0.8fr) minmax(0, 2.1fr); gap: 10px 20px; align-items: start;
  padding: 12px 16px 12px; border-radius: 12px; background: rgb(255 255 255 / 0.045); box-shadow: inset 0 0 0 1px rgb(169 177 204 / 0.16);
  font-family: var(--font-ui); color: var(--fg); }
[data-figure="${ID}"] .ff-k { display: block; margin-bottom: 6px; font-size: var(--text-2xs); font-weight: 650; letter-spacing: var(--tracking-caps); text-transform: uppercase; color: var(--fg-2); }
[data-figure="${ID}"] .ff-dots svg { display: block; width: 100%; max-width: 13rem; height: auto; }
[data-figure="${ID}"] .ff-fit { display: inline-flex; align-items: center; gap: 8px; font-size: var(--text-ui); font-weight: 600; }
[data-figure="${ID}"] .ff-fit svg { width: 3.2rem; height: 2.2rem; flex-shrink: 0; }
[data-figure="${ID}"] .ff-out { display: flex; align-items: flex-start; gap: 10px; font-size: var(--text-xs); line-height: 1.4; }
[data-figure="${ID}"] .ff-out .badge { flex-shrink: 0; }
[data-figure="${ID}"] .ff-out__t { font-size: var(--text-sm); font-weight: 560; color: var(--fg); line-height: 1.35; padding-top: 2px; }
[data-figure="${ID}"] .ff-caps { flex: 1 1 100%; display: grid; max-width: var(--measure); }
[data-figure="${ID}"] .ff-cap { grid-area: 1 / 1; margin: 0; align-self: start; font-family: var(--font-body); font-size: var(--text-sm); line-height: 1.55; color: var(--ink-2); visibility: hidden; opacity: 0; transition: opacity var(--dur-3) var(--ease-out), visibility 0s linear var(--dur-3); }
[data-figure="${ID}"] .ff-cap.is-on { visibility: visible; opacity: 1; transition: opacity var(--dur-3) var(--ease-out), visibility 0s; }
[data-figure="${ID}"] .ff-cap .k { display: block; margin-bottom: 0.2rem; font-family: var(--font-ui); font-size: var(--text-2xs); font-weight: 650; letter-spacing: var(--tracking-caps); text-transform: uppercase; color: var(--accent); }
[data-figure="${ID}"] .ff-cap .hint { font-family: var(--font-ui); font-size: var(--text-xs); color: var(--ink-3); }
[data-figure="${ID}"] .ff-preset-cap { flex: 1 1 100%; margin: 0; max-width: var(--measure); padding: 0.7rem 0.95rem; border-radius: var(--r-md); background: var(--paper-2); border: 1px solid var(--rule); font-family: var(--font-body); font-size: var(--text-sm); line-height: 1.55; color: var(--ink-2); }
[data-figure="${ID}"] .ff-preset-cap[hidden] { display: none; }
[data-figure="${ID}"] .ff-preset-cap.is-new { animation: fade-up var(--dur-3) var(--ease-out); }
[data-figure="${ID}"] .ff-preset-cap .k { display: block; margin-bottom: 0.2rem; font-family: var(--font-ui); font-size: var(--text-2xs); font-weight: 650; letter-spacing: var(--tracking-caps); text-transform: uppercase; color: var(--accent); }
[data-figure="${ID}"] .ff-switches { flex: 1 1 100%; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--s-3); }
[data-figure="${ID}"] .ff-sw { min-width: 0; padding: 0.6rem 0.65rem 0.7rem; border: 1px solid var(--rule); border-radius: var(--r-md); background: var(--surface); }
[data-figure="${ID}"] .ff-sw .chips__label { display: flex; align-items: center; gap: 0.4rem; margin: 0 0 0.45rem; font-family: var(--font-ui); font-size: var(--text-2xs); font-weight: 650; letter-spacing: var(--tracking-caps); text-transform: uppercase; color: var(--ink-3); }
[data-figure="${ID}"] .ff-sw .chips__label .n { color: var(--accent); }
[data-figure="${ID}"] .ff-sw .chips__tray { display: grid; grid-template-rows: auto auto; gap: 4px; }
[data-figure="${ID}"] .ff-sw .chip { width: 100%; justify-content: flex-start; border-radius: var(--r-sm); min-height: 2.75rem; padding: 0.35rem 0.6rem; font-size: var(--text-xs); line-height: 1.25; }
[data-figure="${ID}"] .ff-sw .chip::before { content: ""; flex-shrink: 0; width: 0.8rem; height: 0.8rem; border-radius: 50%; box-shadow: inset 0 0 0 1.5px var(--ink-3); }
[data-figure="${ID}"] .ff-sw .chip[aria-pressed="true"]::before { box-shadow: inset 0 0 0 1.5px var(--accent), inset 0 0 0 4px var(--surface); background: var(--accent); }
[data-figure="${ID}"] .ff-presets { flex: 1 1 100%; display: flex; flex-wrap: wrap; align-items: center; gap: var(--s-2) var(--s-3); }
[data-figure="${ID}"] .ff-presets__k { font-family: var(--font-ui); font-size: var(--text-xs); font-weight: 600; color: var(--ink-3); }
[data-figure="${ID}"] .ff-presets .btn { height: auto; min-height: var(--btn-h); padding-block: 0.35rem; white-space: normal; text-align: left; }
[data-figure="${ID}"] .ff-presets .btn .tag { font-weight: 700; color: var(--accent); margin-right: 0.35rem; }
[data-figure="${ID}"] .ff-disc { flex: 1 1 100%; margin: 0; max-width: var(--measure); font-family: var(--font-ui); font-size: var(--text-xs); line-height: 1.5; color: var(--ink-3); }
@container fig (max-width: 899.98px) {
  [data-figure="${ID}"] .ff-switches { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@container fig (max-width: 599.98px) {
  [data-figure="${ID}"] .fig__stage { padding: 8px; }
  [data-figure="${ID}"] .ff-strip { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); padding: 10px 12px; gap: 12px 14px; }
  [data-figure="${ID}"] .ff-strip > :last-child { grid-column: 1 / -1; }
  [data-figure="${ID}"] .ff-switches { gap: var(--s-2); }
  [data-figure="${ID}"] .ff-sw { padding: 0.5rem 0.5rem 0.55rem; }
}
`;

function injectCSS() {
  if (document.getElementById(`${ID}-style`)) return;
  const s = document.createElement('style');
  s.id = `${ID}-style`;
  s.textContent = CSS;
  document.head.append(s);
}

// Panels: frame origin, size and a size scale u. Wide: side by side; phones: stacked.
const LAYOUTS = {
  wide: { vb: [960, 410], L: { ox: 0, oy: 0, W: 470, H: 410, u: 1 }, R: { ox: 490, oy: 0, W: 470, H: 410, u: 1 }, entry: 'left' },
  compact: { vb: [400, 540], L: { ox: 0, oy: 0, W: 400, H: 262, u: 0.8 }, R: { ox: 0, oy: 276, W: 400, H: 264, u: 0.8 }, entry: 'top' },
};

export default function mount(fig, ctx) {
  injectCSS();
  const { gsap, h } = ctx;
  ctx.setAspect('auto');
  ctx.stage.classList.add('is-auto-height');
  const mk = (tag, attrs, parent) => ctx.svg(tag, attrs, parent);

  // ---------------------------------------------------------------- state
  let cfg = [0, 0, 0, 0];
  let compact = ctx.compact;
  let leftCfg = null;          // [target, alarm] the left panel was built for
  let scene = null;            // { left, right }

  // ---------------------------------------------------------------- stage: scenes + outcome strip
  const wrap = h('div', { class: 'ff' });
  ctx.stage.append(wrap);
  const svg = ctx.createSVG({ viewBox: '0 0 960 410', parent: wrap, label: 'Lymph node and tumor scenes' });
  ctx.tag('Illustrative');
  const strip = h('div', { class: 'ff-strip', 'aria-live': 'polite' });
  wrap.append(strip);
  const cellDots = h('div', { class: 'ff-dots' }, h('span', { class: 'ff-k' }, 'T cells primed'));
  const cellFit = h('div', {}, h('span', { class: 'ff-k' }, 'Affinity'));
  const cellOut = h('div', {}, h('span', { class: 'ff-k' }, 'Outcome (cartoon)'));
  strip.append(cellDots, cellFit, cellOut);
  const dotsSvg = mk('svg', { viewBox: '0 0 152 18', 'aria-hidden': 'true' });
  cellDots.append(dotsSvg);
  const dotsSr = h('span', { class: 'visually-hidden' });
  cellDots.append(dotsSr);
  const grid = unitGrid(chartRoot(dotsSvg, { theme: 'stage-dark' }), { count: 8, cols: 8, size: 14, gap: 5.4, shape: 'circle', x: 2, y: 2, color: 'var(--c-cd8)', state: 'outline' });
  const fitBox = h('span', { class: 'ff-fit' });
  cellFit.append(fitBox);
  const outBox = h('div', { class: 'ff-out' });
  cellOut.append(outBox);

  // ---------------------------------------------------------------- controls
  // All captions share one grid cell, so the controls below never jump (the stepper's trick).
  const capBox = h('div', { class: 'ff-caps' });
  const capLive = h('span', { class: 'visually-hidden', 'aria-live': 'polite' });
  ctx.controls.append(capBox, capLive);
  const capEls = new Map();
  const addCap = (key, html, cls = '') => { const el = h('p', { class: `ff-cap ${cls}`.trim(), html }); capBox.append(el); capEls.set(key, el); };
  addCap('start', '<span class="k">Starting point: the settings of a typical 1990s vaccine</span><span class="hint">Flip any switch to see what it changes, or try a preset below.</span>');
  addCap('none', '');
  SWITCHES.forEach((S, i) => S.opts.forEach((o, v) => addCap(`sw${i}-${v}`, `<span class="k">${S.label}: ${o}</span>${S.caps[v]}`)));
  let presetCap = null;
  const showCap = (key, announce = true) => {
    for (const [k, el] of capEls) el.classList.toggle('is-on', k === key);
    if (announce && capEls.get(key)?.textContent) capLive.textContent = capEls.get(key).textContent;
    if (presetCap && key !== 'none') presetCap.hidden = true;
  };
  showCap('start', false);
  const swBox = h('div', { class: 'ff-switches' });
  ctx.controls.append(swBox);
  const switches = SWITCHES.map((S, i) => {
    const box = h('div', { class: 'ff-sw' });
    swBox.append(box);
    const ch = ctx.ui.chips({
      label: S.label, parent: box, required: true, value: 0,
      options: S.opts.map((o, j) => ({ value: j, label: o })),
      onChange: (v) => { const next = cfg.slice(); next[i] = v; apply(next, { caption: { sw: i } }); },
    });
    const lab = ch.el.querySelector('.chips__label');
    lab.prepend(h('span', { class: 'n', 'aria-hidden': 'true' }, String(i + 1)));
    return ch;
  });
  const pre = h('div', { class: 'ff-presets' }, h('span', { class: 'ff-presets__k' }, 'Presets'));
  ctx.controls.append(pre);
  PRESETS.forEach((P) => {
    const b = ctx.ui.button({ label: P.label, parent: pre, onClick: () => { switches.forEach((s, i) => s.set(P.cfg[i])); apply(P.cfg.slice(), { caption: { preset: P } }); } });
    b.el.querySelector('.btn__text').prepend(h('span', { class: 'tag', 'aria-hidden': 'true' }, P.id));
  });
  presetCap = h('p', { class: 'ff-preset-cap', hidden: true });
  ctx.controls.append(presetCap);
  ctx.controls.append(h('p', { class: 'ff-disc' }, DISCLAIMER));
  const showPreset = (P) => {
    showCap('none', false);
    presetCap.innerHTML = `<span class="k">Preset ${P.id} · ${P.label}</span>${P.caption}`;
    presetCap.hidden = false;
    presetCap.classList.remove('is-new'); void presetCap.offsetWidth; presetCap.classList.add('is-new');
    capLive.textContent = presetCap.textContent;
  };

  // ---------------------------------------------------------------- player (one master timeline)
  const player = (() => {
    let tl = null, away = false, started = false;
    ctx.track({
      pause() { away = true; if (tl) tl.pause(); },
      resume() { away = false; if (tl && started && tl.progress() < 1 && !ctx.reducedMotion) tl.play(); },
      stop() { if (tl) tl.kill(); tl = null; },
    });
    return {
      finish() { if (tl) { const t = tl; tl = null; t.progress(1); t.kill(); } },
      start(next, { hold = false } = {}) {
        tl = next;
        if (ctx.reducedMotion) { const t = tl; tl = null; t.progress(1); t.kill(); return; }
        started = !hold;
        tl.pause(0);
        if (started && !away) tl.play(0);
      },
      go() { if (tl && !started) { started = true; if (!away && !ctx.reducedMotion) tl.play(); } },
    };
  })();
  const ambients = [];
  const killAmb = () => { while (ambients.length) { const a = ambients.pop(); try { if (a.kill) a.kill(); else a.stop(); } catch { /* */ } } };

  // ================================================================ helpers
  const layerOf = (cell, name = 'receptors') => {
    let g = cell.querySelector(`:scope > [data-part="${name}"]`);
    if (!g) g = mk('g', { 'data-part': name }, cell);
    return g;
  };
  const hitR = (o, deg) => { const p = rayHit(o, deg * DEG); return Math.hypot(p.x, p.y); };
  function seatLocal(cell, fn, x, y, deg, size, detail = 'low') {
    const g = fn({ size, stage: 'dark', detail });
    g.setAttribute('transform', `translate(${f(x)} ${f(y)}) rotate(${f(deg + 90)})`);
    layerOf(cell).append(g);
    return { g, x, y, r: deg + 90, size, deg };
  }
  function seatAngle(cell, fn, deg, size, detail = 'low') {
    const p = rayHit(cellInfo(cell).outline, deg * DEG);
    return seatLocal(cell, fn, p.x, p.y, deg, size, detail);
  }
  const headOf = (s, name) => { const v = rot(0, (HEAD_Y[name] ?? -0.9) * s.size, s.r); return { x: s.x + v.x, y: s.y + v.y }; };
  function capPose(size, head, awayDeg, arm = 'right') {
    const T = antibodyTips(size)[arm];
    const a0 = Math.atan2(-T[1], -T[0]) / DEG;
    const psi = awayDeg - a0;
    const p = rot(T[0], T[1], psi);
    return { x: head.x - p.x, y: head.y - p.y, r: psi };
  }
  function text(parent, str, x, y, cls = 't-caps', anchor = 'start') {
    const t = mk('text', { x: f(x), y: f(y), class: `${cls} t-halo`, 'text-anchor': anchor }, parent);
    t.textContent = str;
    return t;
  }
  let clipN = 0;
  function panel(F, title) {
    const id = `${ID}-clip-${(clipN += 1)}-${Math.random().toString(36).slice(2, 6)}`;
    const cp = mk('clipPath', { id }, svg.defs);
    mk('rect', { x: F.ox, y: F.oy, width: F.W, height: F.H, rx: 14 }, cp);
    const root = mk('g', { class: 'ff-panel' }, svg);
    const body = mk('g', { 'clip-path': `url(#${id})` }, root);
    mk('rect', { x: F.ox, y: F.oy, width: F.W, height: F.H, rx: 14, fill: 'rgb(6 9 24 / 0.35)' }, body);
    const frame = mk('rect', { x: F.ox + 0.5, y: F.oy + 0.5, width: F.W - 1, height: F.H - 1, rx: 14, fill: 'none', stroke: 'rgb(169 177 204 / 0.18)' }, root);
    const titleT = text(root, title, F.ox + 16, F.oy + 26, 't-caps');
    return { root, body, frame, title: titleT, clipId: id };
  }

  // ================================================================ LEFT: lymph node
  function buildLeft(c) {
    const lay = compact ? LAYOUTS.compact : LAYOUTS.wide;
    const F = lay.L, u = F.u;
    const P = panel(F, 'Lymph node: priming');
    const g = P.body;
    g.append(lymphNodeField({ x: F.ox + 6, y: F.oy + 36, width: F.W - 12, height: F.H - 40, seed: 3, stage: 'dark', follicles: 2, density: 0.8 }));
    const fx = mk('g', { 'data-fx': '' });
    const tl = gsap.timeline();
    const neo = !!c[0], strong = !!c[1];
    // dendritic cell holding MHC class I cups with the vaccine peptide
    const dcX = F.ox + F.W * (compact ? 0.24 : 0.25), dcY = F.oy + F.H * (compact ? 0.57 : 0.56);
    const dc = dendriticCell({ r: (strong ? 64 : 54) * u, state: strong ? 'mature' : 'immature', seed: 6, stage: 'dark', receptors: false });
    dc.setAttribute('transform', `translate(${f(dcX)} ${f(dcY)})`);
    if (!strong) dc.setAttribute('opacity', '0.78');
    g.append(dc);
    if (!ctx.reducedMotion) ambients.push(ctx.track(breathe(dc, { amplitude: 0.8 })));
    const s = 12.5 * u;
    const cupAngles = compact ? [-58, -20, 20, 58] : [-54, -18, 18, 54];
    const dco = cellInfo(dc).outline;
    const cups = cupAngles.map((a) => {
      const body = Math.min(hitR(dco, a), 26 * u);
      const x = Math.cos(a * DEG) * body, y = Math.sin(a * DEG) * body;
      const seat = seatLocal(dc, (o) => mhc1({ ...o, peptide: neo ? 'neo' : 'self' }), x, y, a, s, 'high');
      return { a, bx: dcX + x, by: dcY + y, seat };
    });
    // naive killer T cells: a loose crowd to the right
    const rnd = ctx.random(compact ? 21 : 11);
    const crowd = [];
    const rT = 12 * u;
    const box = compact ? { x0: 0.5, x1: 0.94, y0: 0.24, y1: 0.9 } : { x0: 0.53, x1: 0.92, y0: 0.18, y1: 0.9 };
    for (let tries = 0; crowd.length < 12 && tries < 4000; tries++) {
      const x = F.ox + F.W * rnd.range(box.x0, box.x1), y = F.oy + F.H * rnd.range(box.y0, box.y1);
      if (crowd.every((p) => Math.hypot(p.x - x, p.y - y) > rT * 2.9)) crowd.push({ x, y });
    }
    crowd.sort((p, q) => p.x - q.x);
    const nMatch = neo ? 4 : 2;
    const useCups = neo ? [0, 1, 2, 3] : [1, 2];
    const matched = crowd.slice(0, nMatch).sort((p, q) => p.y - q.y);
    const others = crowd.slice(nMatch);
    const cellsG = mk('g', {}, g);
    g.append(fx);
    others.forEach((p, i) => {
      const art = tCell({ variant: 'cd8', r: rT, state: 'resting', seed: 50 + i, stage: 'dark', receptors: false });
      const a0 = (i * 83) % 360;
      seatAngle(art, (o) => tcr(o), a0, 9 * u);
      seatAngle(art, (o) => tcr(o), a0 + 150, 9 * u);
      const R = rig(art, { x: p.x, y: p.y, parent: cellsG, seed: 50 + i });
      if (!ctx.reducedMotion) ambients.push(ctx.ambient(gsap.to(R.layers.idle, { x: (i % 2 ? 3 : -3) * u, y: (i % 3 ? 2.5 : -2.5) * u, duration: 2.6 + (i % 4) * 0.4, ease: 'sine.inOut', yoyo: true, repeat: -1 })));
    });
    const copies = copiesOf(c);
    const exits = [];
    const trained = trainedOf(c);
    for (let k = 0; k < trained; k++) {
      exits.push(compact
        ? { x: F.ox + F.W * (0.58 + 0.38 * ((k + 0.5) / trained)), y: F.oy + F.H + 18 }
        : { x: F.ox + F.W + 18, y: F.oy + F.H * (0.2 + 0.62 * ((k + 0.5) / trained)) });
    }
    let exitIdx = 0;
    let travelAt = 0;
    matched.forEach((p, i) => {
      const cup = cups[useCups[i]];
      const face = cup.a + 180;                            // the T cell faces the dendritic cell
      const seed = 70 + i;
      const art = tCell({ variant: 'cd8', r: rT, state: 'resting', seed, stage: 'dark', receptors: false });
      const to = cellInfo(art).outline;
      seatAngle(art, (o) => tcr(o), face, s, 'high');
      seatAngle(art, (o) => tcr(o), face + 140, 9 * u);
      if (!neo) art.setAttribute('opacity', '0.72');       // low-affinity binders: dimmer
      const R = rig(art, { x: p.x, y: p.y, parent: cellsG, seed });
      // dock: TCR head to cup head; snug = DOCK_GAP, loose = a visible gap
      const gap = (DOCK_GAP['tcr-mhc1'] + (neo ? 0 : 0.42)) * s;
      const d = hitR(to, face) + gap;
      const dock = { x: cup.bx + Math.cos(cup.a * DEG) * d, y: cup.by + Math.sin(cup.a * DEG) * d };
      const t0 = 0.2 + i * 0.1;
      move(tl, R, { x: dock.x, y: dock.y, duration: 0.95, pos: t0, stretch: 0.05 });
      const head = { x: cup.bx + Math.cos(cup.a * DEG) * s * 0.95, y: cup.by + Math.sin(cup.a * DEG) * s * 0.95 };
      const ringHost = neo ? fx : mk('g', { opacity: 0.45 }, fx);
      recognize(tl, R, { x: head.x + Math.cos(cup.a * DEG) * gap * 0.5, y: head.y + Math.sin(cup.a * DEG) * gap * 0.5 }, { badge: false, radius: 8 * u, duration: 1.1, layer: ringHost, pos: t0 + 0.9 });
      // signal 2: a "+" disc beside each contact (strong alarm only)
      if (strong) {
        const n = { x: -Math.sin(cup.a * DEG), y: Math.cos(cup.a * DEG) };
        const side = i % 2 ? 1 : -1;
        const px = cup.bx + Math.cos(cup.a * DEG) * gap * 0.55 + n.x * side * 15 * u;
        const py = cup.by + Math.sin(cup.a * DEG) * gap * 0.55 + n.y * side * 15 * u;
        const plus = mk('g', { transform: `translate(${f(px)} ${f(py)})`, opacity: 0 }, fx);
        plus.append(signalIcon({ type: 'activating', size: 11 * u, stage: 'dark' }));
        tl.to(plus, { attr: { opacity: 1 }, duration: 0.4 }, t0 + 1.25);
      }
      // photocopying: the matched cell divides; one daughter stays docked, the copies leave
      const n = copies[i] || 0;
      const tDiv = t0 + (strong ? 1.75 : 1.6);
      if (n > 0) {
        const kids = divide(tl, R, n + 1, { angle: cup.a + 90, spread: 2.2 * rT, duration: 1.15, pos: tDiv });
        move(tl, kids[0], { x: dock.x, y: dock.y, duration: 0.8, pos: tDiv + 1.15 });
        for (let k = 1; k < kids.length; k++) {
          const ex = exits[exitIdx++] || exits[exits.length - 1];
          const mid = { x: lerp(kids[k].plan.x, ex.x, 0.5), y: lerp(kids[k].plan.y, ex.y, 0.5) + (compact ? 0 : (k % 2 ? -12 : 12)) * u };
          const tm = tDiv + 1.2 + k * 0.1;
          move(tl, kids[k], { x: ex.x, y: ex.y, via: [[mid.x, mid.y]], duration: 1.35, pos: tm, stretch: 0.06 });
          travelAt = Math.max(travelAt, tm + 0.5);
        }
      } else {
        // signal 1 alone: this one shuts down
        move(tl, R, { x: dock.x, y: dock.y, opacity: 0.32, duration: 0.8, pos: tDiv });
      }
    });
    // arrow from the lymph node to the tumor (between the panels)
    const arrow = mk('g', { opacity: 0.55 }, svg);
    if (compact) {
      const y = F.oy + F.H + 7, x = F.ox + F.W * 0.78;
      mk('path', { d: `M${x - 7} ${y - 4}L${x} ${y + 3}L${x + 7} ${y - 4}`, fill: 'none', stroke: 'rgb(169 177 204 / 0.9)', 'stroke-width': 1.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, arrow);
    } else {
      const x = F.ox + F.W + 10, y = F.oy + F.H * 0.5;
      mk('path', { d: `M${x - 4} ${y - 8}L${x + 3} ${y}L${x - 4} ${y + 8}`, fill: 'none', stroke: 'rgb(169 177 204 / 0.9)', 'stroke-width': 1.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, arrow);
    }
    tl.fromTo(arrow, { attr: { opacity: 0.35 } }, { attr: { opacity: 0.95 }, duration: 0.5, yoyo: true, repeat: 3 }, Math.max(0.5, travelAt - 0.8));
    // label the contact
    const c0 = cups[cups.length - 1];
    const hx = c0.bx + Math.cos(c0.a * DEG) * s * 0.9, hy = c0.by + Math.sin(c0.a * DEG) * s * 0.9;
    const labX = dcX - 18 * u, labY = F.oy + F.H - (compact ? 22 : 34);
    const lg = mk('g', {}, P.root);
    mk('line', { x1: f(labX + 4), y1: f(labY - 15), x2: f(hx), y2: f(hy + 3), class: 'leader' }, lg);
    mk('circle', { cx: f(hx), cy: f(hy + 3), r: 2.2, class: 'leader-dot' }, lg);
    text(lg, neo ? 'Neoantigen in MHC' : 'Self peptide in MHC', labX, labY, 't-small', 'middle');
    text(P.root, strong ? 'Mature dendritic cell' : 'Immature dendritic cell', dcX, dcY - (compact ? 56 : 74) * u, 't-small', 'middle');
    return { P, tl, travelAt: travelAt || 2.4, arrow };
  }

  // ================================================================ RIGHT: tumor
  function buildRight(c) {
    const lay = compact ? LAYOUTS.compact : LAYOUTS.wide;
    const F = lay.R, u = F.u;
    const P = panel(F, 'Tumor: the attack');
    const g = P.body;
    g.append(tissueField({ x: F.ox, y: F.oy, width: F.W, height: F.H, seed: 9, stage: 'dark', density: 0.4 }));
    const tl = gsap.timeline();
    const large = !c[2], braked = !c[3], neo = !!c[0];
    const tier = tierOf(c);
    const N = trainedOf(c);
    const cancersG = mk('g', {}, g);
    const tG = mk('g', {}, g);
    mk('g', { 'data-fx': '' }, g);
    // ---- cancer cells
    const cells = [];
    const entryDeg = compact ? -90 : 180;               // direction the T cells come from
    if (large) {
      const cx = F.ox + F.W * (compact ? 0.5 : 0.6), cy = F.oy + F.H * (compact ? 0.6 : 0.56);
      const sV = 11.6 * u, rc = 13 * u;
      for (let i = 0; i < 52; i++) {
        const rr = sV * Math.sqrt(i + 0.5), th = i * GOLDEN + 0.3;
        const x = cx + Math.cos(th) * rr * 1.08, y = cy + Math.sin(th) * rr * 0.94;
        cells.push({ x, y, r: rc * (0.94 + ((i * 7) % 5) * 0.03), seed: 400 + i, edge: rr > sV * Math.sqrt(36), out: Math.atan2(y - cy, x - cx) / DEG, cx, cy });
      }
    } else {
      const spots = compact
        ? [[0.24, 0.42], [0.5, 0.36], [0.36, 0.72], [0.66, 0.66], [0.8, 0.4], [0.88, 0.8]]
        : [[0.3, 0.34], [0.34, 0.72], [0.56, 0.46], [0.66, 0.8], [0.76, 0.28], [0.9, 0.62]];
      spots.forEach(([fx0, fy0], i) => cells.push({ x: F.ox + F.W * fx0, y: F.oy + F.H * fy0, r: 17 * u, seed: 460 + i, edge: true, out: entryDeg }));
    }
    const arts = cells.map((cc) => {
      const art = cancerCell({ r: cc.r, seed: cc.seed, stage: 'dark', receptors: false });
      cc.outline = cellInfo(art).outline;
      cc.art = art;
      return art;
    });
    // ---- who goes where
    const kills = tier === 2 ? (large ? 4 : 5) : tier === 1 ? 2 : 0;
    let order;
    if (large) {
      order = cells.map((cc, i) => i).filter((i) => cells[i].edge)
        .sort((a, b) => Math.abs(((cells[a].out - entryDeg + 540) % 360) - 180) - Math.abs(((cells[b].out - entryDeg + 540) % 360) - 180));
    } else {
      order = cells.map((cc, i) => i).sort((a, b) => (compact ? cells[a].y - cells[b].y : cells[a].x - cells[b].x));
    }
    const plans = [];
    const visits = new Map();
    for (let i = 0; i < N; i++) {
      let ci;
      if (large) ci = order[i % order.length];
      else {
        const reach = order.slice(0, tier === 2 ? 5 : 6);          // tier 2 leaves the farthest cell alone
        const rest = reach.slice(kills);
        ci = i < kills ? reach[i] : rest.length ? rest[(i - kills) % rest.length] : reach[(i - kills) % reach.length];
      }
      const v = visits.get(ci) || 0;
      visits.set(ci, v + 1);
      const cc = cells[ci];
      const phi = large ? cc.out + (v ? (v % 2 ? 40 : -40) : 0) : entryDeg + [0, 55, -55, 110][v % 4];
      const role = i < kills ? 'kill' : braked ? 'brake' : (large || !neo) ? 'probe' : 'patrol';
      plans.push({ i, ci, phi, kill: i < kills, v, role });
    }
    const T = [];
    const rT = 12 * u;
    const sP = 7.5 * u;
    plans.forEach((pl) => {
      const cc = cells[pl.ci];
      const pol = pl.phi + 180;
      const seed = 600 + pl.i;
      const art = tCell({ variant: 'cd8', r: rT, state: 'activated', seed, stage: 'dark', receptors: false, polarity: pol, detail: 'high', glow: neo });
      const to = cellInfo(art).outline;
      const gap = neo ? 3 * u : 7 * u;
      const d = hitR(cc.outline, pl.phi) + hitR(to, pol) + gap;
      const x = cc.x + Math.cos(pl.phi * DEG) * d, y = cc.y + Math.sin(pl.phi * DEG) * d;
      // the PD-1/PD-L1 pair on the flank of the contact
      const side = pl.i % 2 ? -1 : 1;
      const th = pol + side * 56;
      const ht = rayHit(to, th * DEG);
      const Pt = { x: x + ht.x, y: y + ht.y };
      const thc = Math.atan2(Pt.y - cc.y, Pt.x - cc.x) / DEG;
      const hc = rayHit(cc.outline, thc * DEG);
      const Pc = { x: cc.x + hc.x, y: cc.y + hc.y };
      const uDeg = Math.atan2(Pc.y - Pt.y, Pc.x - Pt.x) / DEG;
      const size = clamp(Math.hypot(Pc.x - Pt.x, Pc.y - Pt.y) / DOCK_GAP['pd1-pdl1'], 5 * u, 9 * u);
      const pdS = seatLocal(art, (o) => pd1({ ...o, icon: false }), ht.x, ht.y, uDeg, size);
      // PD-L1 on the cancer cell (retracted when anti-PD-1 blocks the contact)
      const back = braked ? 0 : 0.45 * size;
      seatLocal(cc.art, (o) => pdl1(o), hc.x - Math.cos((uDeg + 180) * DEG) * back, hc.y - Math.sin((uDeg + 180) * DEG) * back, uDeg + 180 + (braked ? 0 : 20 * side), size);
      let minus = null;
      if (braked) {
        minus = mk('g', { 'data-part': 'brake-minus', opacity: 0, transform: `translate(${f(ht.x - Math.cos(uDeg * DEG) * 6 * u)} ${f(ht.y - Math.sin(uDeg * DEG) * 6 * u)})` });
        minus.append(signalIcon({ type: 'inhibitory', size: 10 * u, stage: 'dark' }));
        art.append(minus);
      } else {
        // anti-PD-1 rides in on the T cell, capping PD-1 (Fc pointing away, rule 9)
        const abS = 11 * u;
        const Pp = capPose(abS, headOf(pdS, 'pd1'), uDeg + side * 84);
        const ab = antibody({ variant: 'therapeutic', size: abS, stage: 'dark', detail: 'low' });
        const ag = mk('g', { transform: `translate(${f(Pp.x)} ${f(Pp.y)}) rotate(${f(Pp.r)})` });
        ag.append(ab);
        art.append(ag);
      }
      const start = compact ? { x: x + (pl.i % 2 ? 14 : -14) * u, y: F.oy - 22 } : { x: F.ox - 22, y: y + (pl.i % 2 ? 16 : -16) * u };
      T.push({ pl, art, x, y, start, minus, cc });
    });
    // seat a few more PD-L1 so every cancer cell carries 1–2
    cells.forEach((cc, i) => { if (cc.edge || !large) seatAngle(cc.art, (o) => pdl1(o), (cc.out + 150 + i * 47) % 360, 7 * u); });
    // rigs (cancer first, so T cells draw on top)
    const CR = cells.map((cc, i) => rig(cc.art, { x: cc.x, y: cc.y, parent: cancersG, seed: cc.seed + i }));
    const TR = T.map((t) => rig(t.art, { x: t.start.x, y: t.start.y, parent: tG, seed: 600 + t.pl.i }));
    // ---- choreography
    let end = 0;
    T.forEach((t, k) => {
      const R = TR[k];
      const C = CR[t.pl.ci];
      const t0 = 0.15 + k * 0.16;
      const dur = 1.5 + (k % 3) * 0.12;
      const arrive = t0 + dur;
      if (t.pl.role === 'patrol') {
        // armed and free, but there is no one left within reach: it keeps searching
        const px = lerp(t.start.x, t.x, 0.78), py = lerp(t.start.y, t.y, 0.78) + (k % 2 ? 10 : -10) * u;
        move(tl, R, { x: px, y: py, duration: dur + 0.3, pos: t0 });
        end = Math.max(end, arrive + 0.4);
        return;
      }
      if (t.pl.role === 'probe') {
        // a touch that finds nothing it recognizes (hidden or loosely bound): no kill
        probe(tl, R, C, { match: false, gap: neo ? 3 * u : 7 * u, angle: t.pl.phi, duration: dur, pos: t0, hold: 0.9 });
        move(tl, R, { x: lerp(t.x, t.start.x, 0.12) + (k % 2 ? 6 : -6) * u, y: lerp(t.y, t.start.y, 0.12), duration: 1.4, pos: arrive + 1.2 });
        end = Math.max(end, arrive + 2.6);
        return;
      }
      move(tl, R, { x: t.x, y: t.y, duration: dur, pos: t0, stretch: 0.05 });
      if (t.pl.kill) {
        polarize(tl, R, t.pl.phi + 180, { duration: 1, pos: t0 + dur * 0.4 });
        dock(tl, R, C, { duration: 0.55, pos: arrive });
        recognize(tl, R, C, { badge: false, duration: 1.1, pos: arrive - 0.05, layer: neo ? undefined : dimFx(g) });
        const kk = kill(tl, R, C, { duration: 1.6, pos: arrive + 0.6, back: 5 * u });
        move(tl, C, { opacity: 0.16, duration: 0.9, pos: kk.marks.dead });
        end = Math.max(end, kk.marks.dead + 0.9);
      } else if (braked) {
        tl.to(t.minus, { attr: { opacity: 1 }, duration: 0.45 }, arrive + 0.05);
        tl.to(t.art, { attr: { opacity: 0.5 }, duration: 0.7 }, arrive + 0.2);
        end = Math.max(end, arrive + 1);
      }
    });
    // tier 0: the tumor keeps growing (a few cells bud)
    if (tier === 0) {
      const buds = large
        ? cells.map((cc, i) => i).filter((i) => cells[i].edge).sort((a, b) => Math.abs(((cells[b].out - entryDeg + 540) % 360) - 180) - Math.abs(((cells[a].out - entryDeg + 540) % 360) - 180)).slice(0, 3)
        : [order[2], order[4], order[5]].filter((i) => i != null).slice(0, 2);
      buds.forEach((bi, j) => {
        const cc = cells[bi];
        const ang = large ? cc.out : (j ? 30 : -150);
        divide(tl, CR[bi], 2, { angle: ang, spread: cc.r * 1.05, duration: 1.6, pos: Math.max(end, 2.2) + j * 0.35 });
      });
      end = Math.max(end, 2.2) + 2.4;
    }
    return { P, tl, end };
  }
  const dimFx = (g) => {
    let d = g.querySelector(':scope > g[data-dimfx]');
    if (!d) d = mk('g', { 'data-dimfx': '', opacity: 0.45 }, g);
    return d;
  };

  // ================================================================ readouts
  function fitIcon(snug) {
    const s = mk('svg', { viewBox: '-22 -15 44 30', 'aria-hidden': 'true' });
    const sz = 15;
    const gap = (DOCK_GAP['tcr-mhc1'] + (snug ? 0 : 0.42)) * sz;
    const cup = mhc1({ size: sz, stage: 'dark', peptide: snug ? 'neo' : 'self', detail: 'high' });
    cup.setAttribute('transform', `translate(${f(-gap / 2)} 0) rotate(90)`);
    const rec = tcr({ size: sz, stage: 'dark', detail: 'high' });
    rec.setAttribute('transform', `translate(${f(gap / 2)} 0) rotate(-90)`);
    s.append(cup, rec);
    return s;
  }
  function paintReadouts(c, { tl, at = 0 } = {}) {
    const N = trainedOf(c);
    grid.setStates((uu, i) => (i < N ? 'filled' : 'outline'), tl ? { tl, at, duration: 0.35, stagger: 0.05 } : { duration: ctx.reducedMotion ? 0 : 0.35, stagger: 0.04 });
    dotsSr.textContent = `${N} of 8`;
    fitBox.replaceChildren(fitIcon(!!c[0]), document.createTextNode(c[0] ? 'High' : 'Low'));
    const T = TIERS[tierOf(c)];
    outBox.innerHTML = `${ctx.ui.badgeHTML(T.kind, '', 'md')}<span class="ff-out__t">${T.text}</span>`;
  }

  // ================================================================ apply a configuration
  function apply(next, { caption = null, initial = false } = {}) {
    player.finish();
    const same = next.every((v, i) => v === cfg[i]);
    if (same && !initial && scene) { paintCaption(caption); return; }
    cfg = next;
    const needLeft = initial || !scene || !leftCfg || leftCfg[0] !== cfg[0] || leftCfg[1] !== cfg[1];
    const master = gsap.timeline({ paused: true });
    const old = [];
    if (scene) {
      old.push(scene.right.P.root);
      if (needLeft) { old.push(scene.left.P.root, scene.left.arrow); }
    }
    let left = scene?.left;
    if (needLeft) {
      if (left) killAmb();
      left = buildLeft(cfg);
      leftCfg = [cfg[0], cfg[1]];
      master.add(left.tl, 0.1);
    }
    const right = buildRight(cfg);
    const rStart = needLeft ? Math.max(0.3, left.travelAt - 0.5) : 0.25;
    master.add(right.tl, rStart);
    // crossfade: the old panels fade out over the new ones
    for (const o of old) { svg.append(o); o.style.pointerEvents = 'none'; }
    if (old.length) {
      master.to(old, { opacity: 0, duration: 0.4, ease: 'so.inOut' }, 0);
      master.set(old, { display: 'none' }, 0.41);
      const fresh = needLeft ? [left.P.root, right.P.root] : [right.P.root];
      master.fromTo(fresh, { opacity: 0 }, { opacity: 1, duration: 0.45, ease: 'so.out' }, 0);
    }
    master.eventCallback('onComplete', () => { for (const o of old) o.remove(); });
    scene = { left, right };
    paintReadouts(cfg);
    paintCaption(caption);
    player.start(master, { hold: initial });
  }
  function paintCaption(caption) {
    if (!caption) return;
    if (caption.preset) showPreset(caption.preset);
    else if (caption.sw != null) showCap(`sw${caption.sw}-${cfg[caption.sw]}`);
  }

  function rebuildAll() {
    player.finish();
    killAmb();
    for (const n of [...svg.children]) if (n !== svg.defs) n.remove();
    for (const n of [...svg.defs.querySelectorAll('clipPath')]) n.remove();
    const lay = compact ? LAYOUTS.compact : LAYOUTS.wide;
    svg.setAttribute('viewBox', `0 0 ${lay.vb[0]} ${lay.vb[1]}`);
    ctx.refreshTextScale();
    scene = null;
    leftCfg = null;
  }

  let ready = false;
  ctx.onResize(({ compact: cpt }) => {
    if (cpt === compact && scene) return;
    compact = cpt;
    rebuildAll();
    apply(cfg.slice(), { initial: true });
    if (ready) player.go();
  });
  if (!scene) { rebuildAll(); apply(cfg.slice(), { initial: true }); }
  ctx.onceVisible(() => { ready = true; player.go(); }, 0.35);

  return { destroy() { player.finish(); killAmb(); } };
}
