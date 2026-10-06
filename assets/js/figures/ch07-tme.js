// ch07-tme — "Inside the fortified neighborhood" (Figure 7.4). FIGURE-AUDIT §2C, §4.
//
// A cross-section of one tumor neighborhood in three immune profiles. PRIMARY path: switch
// Inflamed / Excluded / Desert (T cells glide, the fibroblast wall thickens or thins, other
// cells fade) and add a PD-1 blocker once per profile (gold drug antibodies leave the vessel
// and cap PD-1 on T cells only). SECONDARY layer, "Who lives here?": five chips that light up
// one group of players (Hiding · Brakes · Corrupt guards · Walls · Poisoned air), dim the rest
// and show the writer's card; tapping any cell names it.
//
// Vocabulary (§4): library cells in canonical colors; TAMs = macrophage({ variant: 'tam' }),
// labeled "tumor-associated macrophage" (never "M2"); PD-1 (crimson socket) on T cells only,
// PD-L1 (light crimson plug) on cancer cells and macrophages; an engaged pair shows one crimson
// "−" disc on the T-cell side; IFN-γ = hollow blue rings; recognition = ring (cell-actions
// recognize), kills = cell-actions kill (setDying: shrink, blebs, fragments; nothing flashes).
// The Excluded fibroblast ring and the empty Desert field are the reference look for
// ch12-resistance vignettes 5 and 6 (§2C).
//
// Scenes are built from a seeded layout, so every profile is the same tumor seen with a
// different immune history. Every animation is a GSAP timeline built from cell-actions
// builders (explicit from → to values); before a new one starts the previous one is finished,
// so plans and pixels always agree. Reduced motion: no drift; switches and drug runs jump to
// their end states.
import {
  tCell, cancerCell, macrophage, mdsc, dendriticCell, fibroblast, bloodVessel, tissueField,
  mhc1, pdl1, pd1, antibody, interferon, signalIcon, cellInfo, rayHit, antibodyTips, HEAD_Y, breathe,
} from '../art/index.js';
import { rig, move, swap, dock, recognize, kill, approach, emit, drive, fxLayer } from './shared/cell-actions.js';

const ID = 'ch07-tme';
const DEG = Math.PI / 180;
const GOLDEN = 137.508 * DEG;
const MODES = ['inflamed', 'excluded', 'desert'];
const f = (v) => String(Math.round(v * 100) / 100);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const rot = (x, y, deg) => { const c = Math.cos(deg * DEG), s = Math.sin(deg * DEG); return { x: x * c - y * s, y: x * s + y * c }; };
const angDiff = (a, b) => Math.abs(((((b - a) % 360) + 540) % 360) - 180);

// Writer's text (spec, verbatim).
const CHIPS = [
  { value: 'hiding', label: 'Hiding', card: 'Some cancer cells stop displaying MHC class I, so killer T cells cannot detect them. NK cells, which detect missing MHC class I, can still kill some of them.' },
  { value: 'brakes', label: 'Brakes', card: 'Cancer cells and macrophages express PD-L1, which inhibits T cells that express PD-1. Much of it appears only after T cells arrive and secrete interferon-gamma, so brakes are often a sign that an attack was underway.' },
  { value: 'guards', label: 'Suppressor cells', card: 'Regulatory T cells, myeloid-derived suppressor cells and wound-healing macrophages suppress the immune response. They are doing their normal jobs; the tumor exploits them.' },
  { value: 'walls', label: 'Barriers', card: 'Cancer-associated fibroblasts deposit dense collagen, and TGF-β helps keep T cells out. In excluded tumors, T cells pile up at these barriers.' },
  { value: 'air', label: 'Suppressive molecules', card: 'Low oxygen, lactic acid, adenosine and TGF-β make the tumor a hostile place for T cells.' },
];
const DEAF_NOTE = 'The sixth escape route, ignoring interferon, happens inside cancer cells and can’t be seen at this scale.';
const WHO = {
  tcell: { name: 'Killer T cell', role: 'Searching for its target peptide.' },
  treg: { name: 'Regulatory T cell', role: 'Suppresses nearby killer T cells.' },
  tam: { name: 'Tumor-associated macrophage', role: 'Helps the tumor build vessels and suppress immune attack.' },
  mdsc: { name: 'MDSC', role: 'Starves and suppresses T cells.', full: 'Myeloid-derived suppressor cell' },
  fibro: { name: 'Cancer-associated fibroblast', role: 'Builds the collagen barrier.' },
  dc: { name: 'Dendritic cell', role: 'Takes up antigen and carries it to a lymph node.' },
  cancer: { name: 'Cancer cell', role: 'Presents peptides from its own proteins, some of them mutated, on MHC class I.' },
  hider: { name: 'Hiding cancer cell', role: 'Has stopped displaying MHC class I, so killer T cells cannot detect it.' },
};
const OUTCOME = {
  inflamed: { kind: 'partial', label: 'Partial response' },
  excluded: { kind: 'no', label: 'Little response' },
  desert: { kind: 'no', label: 'No response' },
};

const CSS = `
[data-figure="${ID}"] .tme-top { display: flex; flex-wrap: wrap; align-items: center; gap: var(--s-2) var(--s-4); margin: 0 0 var(--s-3); }
[data-figure="${ID}"] .tme-top .segmented__opt { font-size: var(--text-ui); padding-inline: 1.15rem; height: 2.4rem; }
[data-figure="${ID}"] .tme-top__hint { font-family: var(--font-ui); font-size: var(--text-xs); color: var(--ink-3); }
[data-figure="${ID}"] .tme-svg { cursor: default; }
[data-figure="${ID}"] .tme-svg [data-kind] { cursor: pointer; }
[data-figure="${ID}"] .tme-svg [data-kind]:focus { outline: none; }
[data-figure="${ID}"] .tme-svg [data-kind]:focus-visible { outline: 2px solid var(--stage-focus); outline-offset: 3px; border-radius: 50%; }
[data-figure="${ID}"] .tme-svg [opacity="0"] { pointer-events: none; }
[data-figure="${ID}"] .tme-svg .dz { transition: opacity 0.45s cubic-bezier(.4,0,.2,1); }
[data-figure="${ID}"] .tme-svg[data-focus] .dz { opacity: 0.42; }
[data-figure="${ID}"] .tme-svg[data-focus="hiding"] .dz.f-hiding,
[data-figure="${ID}"] .tme-svg[data-focus="brakes"] .dz.f-brakes,
[data-figure="${ID}"] .tme-svg[data-focus="guards"] .dz.f-guards,
[data-figure="${ID}"] .tme-svg[data-focus="walls"] .dz.f-walls,
[data-figure="${ID}"] .tme-svg[data-focus="air"] .dz.f-air { opacity: 1; }
[data-figure="${ID}"] .tme-svg .ovl { opacity: 0; transition: opacity 0.5s cubic-bezier(.4,0,.2,1); pointer-events: none; }
[data-figure="${ID}"] .tme-svg[data-focus="air"] .ovl-air,
[data-figure="${ID}"] .tme-svg[data-focus="air"] .ovl-haze,
[data-figure="${ID}"] .tme-svg[data-focus="walls"] .ovl-haze,
[data-figure="${ID}"] .tme-svg[data-focus="hiding"] .ovl-lens { opacity: 1; }
[data-figure="${ID}"] .tme-labels { pointer-events: none; }
[data-figure="${ID}"] .tme-labels > g { animation: tme-in 0.45s cubic-bezier(.2,.7,.2,1) both; }
@keyframes tme-in { from { opacity: 0; } to { opacity: 1; } }
@media (prefers-reduced-motion: reduce) {
  [data-figure="${ID}"] .tme-svg .dz, [data-figure="${ID}"] .tme-svg .ovl { transition: none; }
  [data-figure="${ID}"] .tme-labels > g { animation: none; }
}
[data-figure="${ID}"] .tme-row { display: flex; flex-wrap: wrap; align-items: center; gap: var(--s-2) var(--s-3); flex: 1 1 100%; }
[data-figure="${ID}"] .tme-drug { background: #F2B33D; border-color: #E0A12B; color: #1B1F2A; font-weight: 640; }
[data-figure="${ID}"] .tme-drug:hover:not(:disabled) { background: #FFC24F; border-color: #E0A12B; }
[data-figure="${ID}"] .tme-drug .tme-ab { width: 1.2rem; height: 1.2rem; flex-shrink: 0; }
[data-figure="${ID}"] .tme-badge:empty { display: none; }
[data-figure="${ID}"] .tme-kills { flex-direction: row; align-items: baseline; gap: 0.5rem; margin-left: var(--s-2); }
[data-figure="${ID}"] .tme-kills .stat__value { font-size: var(--text-ui); }
[data-figure="${ID}"] .tme-badge { display: inline-flex; }
[data-figure="${ID}"] .tme-caps { flex: 1 1 100%; display: grid; max-width: var(--measure); }
[data-figure="${ID}"] .tme-cap { grid-area: 1 / 1; margin: 0; font-family: var(--font-body); font-size: var(--text-sm); line-height: 1.55; color: var(--ink-2); visibility: hidden; opacity: 0; transition: opacity var(--dur-3) var(--ease-out), visibility 0s linear var(--dur-3); }
[data-figure="${ID}"] .tme-cap.is-on { visibility: visible; opacity: 1; transition: opacity var(--dur-3) var(--ease-out), visibility 0s; }
[data-figure="${ID}"] .tme-cap b { font-family: var(--font-ui); font-weight: 650; color: var(--ink); }
[data-figure="${ID}"] .tme-cap .k { display: block; margin-bottom: 0.2rem; font-family: var(--font-ui); font-size: var(--text-2xs); font-weight: 650; letter-spacing: var(--tracking-caps); text-transform: uppercase; color: var(--accent); }
[data-figure="${ID}"] .tme-who { flex: 1 1 100%; display: grid; gap: var(--s-3); padding-top: var(--s-3); border-top: 1px solid var(--rule); }
[data-figure="${ID}"] .tme-who__toggle { all: unset; box-sizing: border-box; display: inline-flex; align-items: center; gap: 0.5rem; justify-self: start; min-height: 2.75rem; padding: 0.2rem 0.5rem; margin: -0.2rem -0.5rem; border-radius: var(--r-sm); cursor: pointer; font-family: var(--font-ui); font-size: var(--text-ui); font-weight: 620; color: var(--ink); }
[data-figure="${ID}"] .tme-who__toggle:hover { background: var(--paper-2); }
[data-figure="${ID}"] .tme-who__toggle:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
[data-figure="${ID}"] .tme-who__toggle .ico { width: 1.1rem; height: 1.1rem; color: var(--ink-3); transition: transform var(--dur-2); }
[data-figure="${ID}"] .tme-who__toggle[aria-expanded="true"] .ico { transform: rotate(180deg); }
[data-figure="${ID}"] .tme-who__sub { font-weight: 450; color: var(--ink-3); font-size: var(--text-xs); }
[data-figure="${ID}"] .tme-who__body[hidden] { display: none; }
[data-figure="${ID}"] .tme-who__body { display: grid; gap: var(--s-2); }
[data-figure="${ID}"] .tme-note { margin: 0; font-family: var(--font-ui); font-size: var(--text-xs); color: var(--ink-3); }
@container fig (max-width: 599.98px) {
  [data-figure="${ID}"] .tme-top .segmented { width: 100%; }
  [data-figure="${ID}"] .tme-top .segmented__track { width: 100%; }
  [data-figure="${ID}"] .tme-top .segmented__opt { flex: 1 1 0; justify-content: center; padding-inline: 0.4rem; }
  [data-figure="${ID}"] .tme-top__hint { display: none; }
}
`;

function injectCSS() {
  if (document.getElementById(`${ID}-style`)) return;
  const s = document.createElement('style');
  s.id = `${ID}-style`;
  s.textContent = CSS;
  document.head.append(s);
}

// ------------------------------------------------------------------ layouts
// Desktop: 960 × 560, nest center-left, vessel from the right edge. Phones: 400 × 640 portrait,
// nest centered, vessel along the bottom edge. k scales cell sizes and ring radii.
const LAYOUTS = {
  wide: {
    W: 960, H: 560, C: { x: 420, y: 288 }, k: 1.12, sq: [1.07, 0.95],
    vessel: { x0: 634, x1: 990, y: 412, width: 50, horizontal: true },
    mouth: { x: 656, y: 412 },
    lens: { x: 690, y: 92, w: 250, h: 176 },
    legend: { x: 20, y: 22, rows: [['cancer', 'Cancer cell'], ['tcell', 'Killer T cell'], ['wall', 'Fibroblast and collagen barrier']] },
    desertT: [[618, 362], [700, 462]],
  },
  compact: {
    W: 400, H: 560, C: { x: 200, y: 290 }, k: 0.82, sq: [1.04, 0.98],
    vessel: { x0: -30, x1: 430, y: 532, width: 40, horizontal: true },
    mouth: { x: 200, y: 528 },
    lens: { x: 34, y: 392, w: 332, h: 128 },
    legend: { x: 14, y: 20, rows: [['cancer', 'Cancer cell'], ['tcell', 'Killer T cell'], ['wall', 'Fibroblast and collagen barrier']], twoLines: true },
    desertT: [[148, 486], [262, 480]],
  },
};

// Static (non-gliding) players: angle (deg, 0 = right, 90 = down) and radius from the nest
// center (wide-layout units), and visibility per profile [inflamed, excluded, desert].
const STATICS = [
  { kind: 'treg', a: 248, R: 152, m: [1, 1, 0] },
  { kind: 'treg', a: 338, R: 134, m: [1, 0, 0] },
  { kind: 'treg', a: 146, R: 200, m: [1, 1, 0] },
  { kind: 'mdsc', a: 62, R: 168, m: [1, 1, 1] },
  { kind: 'mdsc', a: 204, R: 206, m: [0, 1, 1] },
  { kind: 'mdsc', a: 288, R: 158, m: [0, 0, 1] },
  { kind: 'mdsc', a: 352, R: 176, m: [0, 0, 1] },
  { kind: 'tam', a: 172, R: 156, m: [1, 1, 1] },
  { kind: 'tam', a: 36, R: 150, m: [1, 0, 1] },
  { kind: 'tam', a: 306, R: 200, m: [0, 1, 1] },
  { kind: 'tam', a: 96, R: 200, m: [0, 1, 0] },
  { kind: 'dc', a: 112, R: 150, m: [1, 0, 0], state: 'mature' },
  { kind: 'dc', a: 222, R: 146, m: [1, 0, 0], state: 'mature' },
  { kind: 'dc', a: 128, R: 210, m: [0, 1, 0], state: 'mature' },
  { kind: 'dc', a: 136, R: 196, m: [0, 0, 1], state: 'immature' },
];
const LAYERS_R = [148, 172, 196, 220];          // fibroblast layers (wide units)
const LAYER_M = [[1, 1, 1], [0, 1, 1], [0, 1, 0], [0, 1, 0]];

export default function mount(fig, ctx) {
  injectCSS();
  const { gsap, h } = ctx;
  ctx.setAspect(960 / 560, 400 / 560);
  const mk = (tag, attrs, parent) => ctx.svg(tag, attrs, parent);

  // ---------------------------------------------------------------- state
  let mode = 'inflamed';
  let drugRan = false;
  let focus = null;            // chip value | null
  let picked = null;           // tapped actor | null
  let compact = ctx.compact;
  let S = null;                // the built scene

  // ---------------------------------------------------------------- frame: top bar, stage, card
  const top = h('div', { class: 'tme-top' });
  ctx.stage.before(top);
  const seg = ctx.ui.segmented({
    label: 'Tumor immune profile', hideLabel: true, parent: top, value: mode,
    options: [{ value: 'inflamed', label: 'Inflamed' }, { value: 'excluded', label: 'Excluded' }, { value: 'desert', label: 'Desert' }],
    onChange: (v) => setMode(v),
  });
  top.append(h('span', { class: 'tme-top__hint' }, 'Switch profiles, then try the drug in each.'));
  const card = ctx.ui.infoCard({ empty: 'Tap any cell to identify it.', width: '16.5rem' });
  const svg = ctx.createSVG({ viewBox: '0 0 960 560', className: 'tme-svg', interactive: true, label: 'A tumor and its surroundings: cancer cells, immune cells and a fibroblast barrier' });
  ctx.tag('Not to scale');
  ctx.tag('Illustrative');

  // ---------------------------------------------------------------- controls
  const row = h('div', { class: 'tme-row' });
  ctx.controls.append(row);
  const abIcon = () => {
    const s = mk('svg', { viewBox: '-14 -26 28 28', class: 'tme-ab', 'aria-hidden': 'true' });
    s.append(antibody({ variant: 'therapeutic', size: 24, stage: 'dark', detail: 'low' }));
    return s;
  };
  const drugBtn = ctx.ui.button({ label: 'Add a PD-1 blocker', parent: row, onClick: () => runDrug() });
  drugBtn.el.classList.add('tme-drug');
  drugBtn.el.prepend(abIcon());
  const resetBtn = ctx.ui.button({ label: 'Reset', icon: 'reset', variant: 'ghost', parent: row, onClick: () => reset() });
  const badgeBox = h('span', { class: 'tme-badge' });
  row.append(badgeBox);
  // Visitor review B5: make the drug's effect countable, as 9.4 does ("Cancer cells destroyed x / n").
  const killStat = ctx.ui.stat({ label: 'Cancer cells destroyed', value: 0, unit: ' / 28', parent: row });
  killStat.el.classList.add('tme-kills');
  let killedNow = 0;
  const setKilled = (v) => {
    killedNow = v;
    killStat.set(v);
    const u = killStat.el.querySelector('.stat__value small');
    if (u && S) u.textContent = ` / ${S.cancers.length}`;
  };
  // All six captions share one grid cell, so nothing below them jumps.
  const capBox = h('div', { class: 'tme-caps' });
  const capLive = h('span', { class: 'visually-hidden', 'aria-live': 'polite' });
  ctx.controls.append(capBox, capLive);
  const LABELS = { inflamed: 'Inflamed', excluded: 'Excluded', desert: 'Desert' };
  const capEls = [0, 1, 2, 3, 4, 5].map((i) => {
    const st = ctx.steps[i];
    const html = st ? st.html : '';
    const el = h('p', { class: 'tme-cap', html: i < 3 ? html.replace(/^(\w+\.)/, '<b>$1</b>') : `<span class="k">With a PD-1 blocker · ${LABELS[MODES[i - 3]]}</span>${html}` });
    capBox.append(el);
    return el;
  });
  let capShown = -1;

  const who = h('div', { class: 'tme-who' });
  const bodyId = `${ID}-who-${Math.random().toString(36).slice(2, 7)}`;
  const whoBtn = h('button', { type: 'button', class: 'tme-who__toggle', 'aria-expanded': 'false', 'aria-controls': bodyId,
    html: '<span>Escape routes</span><span class="tme-who__sub">optional layer</span><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' });
  const whoBody = h('div', { class: 'tme-who__body', id: bodyId, hidden: true });
  who.append(whoBtn, whoBody);
  ctx.controls.append(who);
  const chips = ctx.ui.chips({
    label: 'Show one escape route', hideLabel: true, parent: whoBody,
    options: CHIPS.map((c) => ({ value: c.value, label: c.label })),
    onChange: (v) => setFocus(v),
  });
  whoBody.append(h('p', { class: 'tme-note' }, DEAF_NOTE));
  ctx.on(whoBtn, 'click', () => {
    const open = whoBtn.getAttribute('aria-expanded') !== 'true';
    whoBtn.setAttribute('aria-expanded', String(open));
    whoBody.hidden = !open;
    if (!open && focus) { chips.set(null); setFocus(null); }
  });

  // ---------------------------------------------------------------- player: one timeline at a time
  const player = (() => {
    let tl = null;
    let away = false;
    ctx.track({
      pause() { away = true; if (tl) tl.pause(); },
      resume() { away = false; if (tl && tl.progress() < 1 && !ctx.reducedMotion) tl.play(); },
      stop() { if (tl) tl.kill(); tl = null; },
    });
    return {
      finish() { if (tl) { const t = tl; tl = null; t.progress(1); t.kill(); } },
      start(next) {
        tl = next;
        if (ctx.reducedMotion) { const t = tl; tl = null; t.progress(1); t.kill(); return; }
        if (away) tl.pause(); else tl.play(0);
      },
    };
  })();
  const ambients = [];           // T-cell idle drift (redone on every profile change)
  const sceneAmb = [];           // IFN-γ rings, poisoned-air dots (redone on every rebuild)
  const killAll = (arr) => { while (arr.length) { try { arr.pop().kill(); } catch { /* */ } } };
  const stopAmbient = () => killAll(ambients);
  const breathers = [];
  const stopBreath = () => { while (breathers.length) { try { breathers.pop().stop(); } catch { /* */ } } };

  // ================================================================ geometry helpers
  const layerOf = (cell, name = 'receptors') => {
    let g = cell.querySelector(`:scope > [data-part="${name}"]`);
    if (!g) g = mk('g', { 'data-part': name }, cell);
    return g;
  };
  /** Seat a glyph on a cell's membrane (cell-local), pointing outward at deg. */
  function seat(cell, fn, deg, size, { detail = 'low' } = {}) {
    const hit = rayHit(cellInfo(cell).outline, deg * DEG);
    const g = fn({ size, stage: 'dark', detail });
    g.setAttribute('transform', `translate(${f(hit.x)} ${f(hit.y)}) rotate(${f(deg + 90)})`);
    layerOf(cell).append(g);
    return { g, x: hit.x, y: hit.y, r: deg + 90, size };
  }
  /** Seat a glyph at a scene point (x, y) pointing toward deg. */
  function seatAt(parent, fn, x, y, deg, size, { detail = 'low' } = {}) {
    const g = fn({ size, stage: 'dark', detail });
    g.setAttribute('transform', `translate(${f(x)} ${f(y)}) rotate(${f(deg + 90)})`);
    parent.append(g);
    return { g, x, y, r: deg + 90, size, deg };
  }
  const headOf = (s, name) => { const v = rot(0, (HEAD_Y[name] ?? -0.9) * s.size, s.r); return { x: s.x + v.x, y: s.y + v.y }; };
  /** Antibody pose: one arm tip on `head`, Fc pointing toward awayDeg (rule 9). */
  function capPose(size, head, awayDeg, arm = 'right') {
    const T = antibodyTips(size)[arm];
    const a0 = Math.atan2(-T[1], -T[0]) / DEG;
    const psi = awayDeg - a0;
    const p = rot(T[0], T[1], psi);
    return { x: head.x - p.x, y: head.y - p.y, r: psi };
  }
  const poseStr = (P) => `translate(${f(P.x)} ${f(P.y)}) rotate(${f(P.r)})`;
  function label(parent, text, x, y, { anchor = 'middle', cls = 't-label', leader = null, dot = true } = {}) {
    const g = mk('g', { 'data-part': 'label' }, parent);
    if (leader) {
      mk('line', { x1: f(leader[0]), y1: f(leader[1]), x2: f(leader[2]), y2: f(leader[3]), class: 'leader' }, g);
      if (dot) mk('circle', { cx: f(leader[2]), cy: f(leader[3]), r: 2.2, class: 'leader-dot' }, g);
    }
    const lines = String(text).split('\n');
    const t = mk('text', { x: f(x), y: f(y), class: `${cls} t-halo`, 'text-anchor': anchor }, g);
    lines.forEach((ln, i) => { const ts = mk('tspan', { x: f(x), dy: i ? '1.15em' : 0 }, t); ts.textContent = ln; });
    return g;
  }

  // ================================================================ layout (pure, seeded)
  function computeLayout(L) {
    const { C, k, sq } = L;
    const rnd = ctx.random(7);
    const P = (a, R) => ({ x: C.x + Math.cos(a * DEG) * R * k * sq[0], y: C.y + Math.sin(a * DEG) * R * k * sq[1] });
    const angOf = (p) => Math.atan2(p.y - C.y, p.x - C.x) / DEG;
    const radOf = (p) => Math.hypot((p.x - C.x) / sq[0], (p.y - C.y) / sq[1]) / k;
    // nest: a jittered sunflower of 28 cancer cells
    const RC = 21 * k;
    const s = 20.6 * k;
    const nest = [];
    for (let i = 0; i < 28; i++) {
      const rr = s * Math.sqrt(i + 0.5);
      const th = i * GOLDEN + 0.5;
      nest.push({
        i, x: C.x + Math.cos(th) * rr * sq[0] + rnd.range(-2.2, 2.2) * k, y: C.y + Math.sin(th) * rr * sq[1] + rnd.range(-2.2, 2.2) * k,
        r: RC * rnd.range(0.94, 1.06), seed: 300 + i * 7, rr,
      });
    }
    nest.forEach((c) => { c.a = angOf(c); c.edge = c.rr > s * Math.sqrt(17); });
    const hiders = new Set([5, 15, 23]);
    // static players
    const statics = STATICS.map((d, i) => ({ ...d, i, ...P(d.a, d.R) }));
    return { C, k, RC, nest, hiders, statics, P, angOf, radOf };
  }

  // ================================================================ BUILD
  let sceneGrads = [];
  const sceneGrad = (stops) => { const u = ctx.radialGradient(svg, stops); const m = /url\(#([^)]+)\)/.exec(u); if (m) sceneGrads.push(m[1]); return u; };
  function build({ keep = null } = {}) {
    stopAmbient();
    killAll(sceneAmb);
    stopBreath();
    const L = compact ? LAYOUTS.compact : LAYOUTS.wide;
    svg.setAttribute('viewBox', `0 0 ${L.W} ${L.H}`);
    ctx.refreshTextScale();
    for (const n of [...svg.children]) if (n !== svg.defs && n !== keep) n.remove();
    // Drop this module's gradients that nothing references any more (each rebuild — every Reset —
    // used to leave its two gradients behind in <defs>); the kept crossfade scene keeps its own.
    sceneGrads = sceneGrads.filter((id) => {
      const used = svg.querySelector(`[fill="url(#${id})"]`);
      if (!used) svg.defs.querySelector(`[id="${id}"]`)?.remove();
      return !!used;
    });
    const G = computeLayout(L);
    const { C, k, P } = G;
    const root = mk('g', { class: 'tme-root' }, svg);
    const layer = (cls) => mk('g', { class: cls }, root);
    const lBg = layer('dz');
    const lHaze = layer('ovl ovl-haze');
    const lCollagen = layer('dz f-walls');
    const lFibro = layer('dz f-walls');
    const lVessel = layer('dz');
    const lCancer = layer('tme-cancer');
    const lMhc = layer('dz f-hiding');
    const lPdl = layer('dz f-brakes');
    const lAir = layer('ovl ovl-air');
    const lStatic = layer('tme-static');
    const lIfn = layer('dz f-brakes');
    const lT = layer('tme-t');
    const lFx = layer('tme-fx');
    fxLayer(lFx);
    const lLens = layer('ovl ovl-lens');
    const lLabels = layer('tme-labels');
    const lLegend = layer('tme-legend');
    lBg.append(tissueField({ width: L.W, height: L.H, seed: 71, stage: 'dark', density: 0.5 }));

    const mi = () => MODES.indexOf(mode);
    const S2 = { L, G, root, lLabels, lFx, lT, lLens, lLegend, lAir, actors: [], cancers: [], tcells: [], statics: [], fibroLayers: [], collagen: [], ifn: null };

    // ---- TGF-β haze (annulus over the stroma)
    {
      const rIn = 140 * k, rOut = 236 * k;
      const q0 = rIn / rOut;
      const hz = sceneGrad([[0, '#C9B79A', 0], [q0 * 0.9, '#C9B79A', 0], [q0 + 0.06, '#C9B79A', 0.17], [0.86, '#C9B79A', 0.1], [1, '#C9B79A', 0]]);
      mk('ellipse', { cx: C.x, cy: C.y, rx: f(rOut * L.sq[0]), ry: f(rOut * L.sq[1]), fill: hz }, lHaze);
    }

    // ---- collagen fibers: thin beige arcs roughly parallel to the nest edge
    {
      const rnd = ctx.random(31);
      const arcs = 22;
      for (let i = 0; i < arcs; i++) {
        const R = lerp(138, 228, i / (arcs - 1)) + rnd.range(-3, 3);
        const a0 = rnd.range(0, 360), span = rnd.range(70, 160);
        let d = '';
        for (let j = 0; j <= 20; j++) {
          const a = a0 + (span * j) / 20;
          const rr = R + Math.sin(j * 0.8 + i) * 2.2;
          const p = P(a, rr);
          d += `${j ? 'L' : 'M'}${f(p.x)} ${f(p.y)}`;
        }
        const m = R < 158 ? [1, 1, 1] : R < 186 ? [0, 1, 1] : [0, 1, 0];
        const g = mk('path', { d, fill: 'none', stroke: '#D6C4AA', 'stroke-linecap': 'round', 'stroke-width': f((0.8 + (i % 3) * 0.3) * Math.max(0.8, k)), 'stroke-opacity': f(0.2 + (i % 2) * 0.1), opacity: m[mi()] }, lCollagen);
        S2.collagen.push({ g, m });
      }
    }

    // ---- fibroblast layers (tangential spindles), one group per layer
    LAYERS_R.forEach((R0, L0) => {
      const g = mk('g', { opacity: LAYER_M[L0][mi()], 'data-kind': 'fibro' }, lFibro);
      const fl = 24 * k;
      const R = R0;
      const circ = 2 * Math.PI * R * k * (L.sq[0] + L.sq[1]) / 2;
      const n = Math.floor(circ / (fl * 2.08));
      for (let i = 0; i < n; i++) {
        const a = ((i + (L0 % 2) * 0.5) / n) * 360 + L0 * 9;
        const p = P(a, R + (((i * 7) % 5) - 2) * 1.2);
        const fa = fibroblast({ r: fl, seed: 500 + L0 * 40 + i, stage: 'dark', angle: a + 90 + (((i * 13) % 9) - 4), detail: L0 ? 'low' : 'auto' });
        fa.setAttribute('transform', `translate(${f(p.x)} ${f(p.y)})`);
        g.append(fa);
      }
      S2.fibroLayers.push({ g, m: LAYER_M[L0] });
    });

    // ---- blood vessel
    {
      const V = L.vessel;
      const len = V.x1 - V.x0;
      const v = bloodVessel({ length: len, width: V.width * (compact ? 1 : 1), wall: 6 * k, rbc: compact ? 6 : 5, seed: 5, stage: 'dark' });
      v.setAttribute('transform', `translate(${f(V.x0 + len / 2)} ${f(V.y)})`);
      lVessel.append(v);
    }

    // ---- cancer cells (rigs) + per-profile MHC / PD-L1 glyph overlays
    const engagedPlan = planTCells(G, L);
    G.nest.forEach((c) => {
      const art = cancerCell({ r: c.r, seed: c.seed, stage: 'dark', receptors: false });
      const wrap = mk('g', { class: `dz${G.hiders.has(c.i) ? ' f-hiding' : ''}`, 'data-kind': G.hiders.has(c.i) ? 'hider' : 'cancer' }, lCancer);
      const R = rig(art, { x: c.x, y: c.y, parent: wrap, seed: c.seed });
      const outline = cellInfo(art).outline;
      const A = { kind: G.hiders.has(c.i) ? 'hider' : 'cancer', wrap, R, c, outline, glyphs: [], x: c.x, y: c.y, r: c.r };
      // MHC slots: 5 around the membrane; visible counts differ by profile
      if (!G.hiders.has(c.i)) {
        const a0 = (c.seed * 37) % 72;
        for (let j = 0; j < 5; j++) {
          const deg = a0 + j * 72;
          const hit = rayHit(outline, deg * DEG);
          const m = [1, j < 4 ? 1 : 0, j === 0 || j === 2 ? 1 : 0];
          const s = seatAt(lMhc, (o) => mhc1({ ...o, peptide: j % 2 ? 'self' : 'neo' }), c.x + hit.x, c.y + hit.y, deg, 7.6 * k);
          s.g.setAttribute('opacity', m[mi()]);
          A.glyphs.push({ g: s.g, m });
        }
      }
      S2.cancers.push(A);
      S2.actors.push(A);
    });

    // PD-L1: inflamed = clustered next to T cells (adaptive resistance); excluded = a few
    // scattered ones; desert = almost none.
    const pdlSeat = (A, q, m) => {
      let x = q.x, y = q.y;
      if (x == null) { const hit = rayHit(A.outline, q.deg * DEG); x = A.x + hit.x; y = A.y + hit.y; }
      const s = seatAt(lPdl, (o) => pdl1(o), x, y, q.deg, q.size ?? 7.6 * k);
      s.g.setAttribute('opacity', m[mi()]);
      const e = { g: s.g, m, seat: s, pair: !!q.pair };
      A.glyphs.push(e);
      return e;
    };
    engagedPlan.pdl.forEach((q) => pdlSeat(S2.cancers[q.ci], q, [1, 0, 0]));
    engagedPlan.pdlExcluded.forEach((q) => pdlSeat(S2.cancers[q.ci], q, [0, 1, 0]));
    engagedPlan.pdlDesert.forEach((q) => pdlSeat(S2.cancers[q.ci], q, [0, 0, 1]));

    // ---- static players
    G.statics.forEach((d) => {
      let art;
      if (d.kind === 'treg') art = tCell({ variant: 'treg', r: 12 * k, seed: 40 + d.i, stage: 'dark', detail: 'high' });
      else if (d.kind === 'mdsc') art = mdsc({ r: 15 * k, seed: 60 + d.i, stage: 'dark', detail: 'high' });
      else if (d.kind === 'tam') art = macrophage({ r: 31 * k, variant: 'tam', seed: 80 + d.i, stage: 'dark', receptors: false });
      else art = dendriticCell({ r: (d.state === 'immature' ? 25 : 31) * k, state: d.state, seed: 20 + d.i, stage: 'dark', receptors: false });
      if (d.kind === 'tam') {
        const base = (d.i * 71) % 360;
        seat(art, (o) => pdl1(o), base, 7.6 * k);
        seat(art, (o) => pdl1(o), base + 140, 7.6 * k);
      }
      const cls = d.kind === 'dc' ? 'dz' : d.kind === 'tam' ? 'dz f-guards f-brakes' : 'dz f-guards';
      const wrap = mk('g', { class: cls, 'data-kind': d.kind }, lStatic);
      const inner = mk('g', { transform: `translate(${f(d.x)} ${f(d.y)})`, opacity: d.m[mi()] }, wrap);
      inner.append(art);
      const A = { kind: d.kind, wrap, inner, art, x: d.x, y: d.y, r: (d.kind === 'tam' ? 26 : d.kind === 'dc' ? 24 : d.kind === 'mdsc' ? 14 : 13) * k, m: d.m };
      S2.statics.push(A);
      S2.actors.push(A);
      if (!ctx.reducedMotion && (d.kind === 'tam' || d.kind === 'dc')) breathers.push(ctx.track(breathe(art, { amplitude: 0.7 })));
    });

    // ---- IFN-γ: hollow blue rings near the T cells that are fighting (inflamed only)
    S2.ifn = mk('g', { opacity: mode === 'inflamed' ? 1 : 0 }, lIfn);
    {
      const rnd = ctx.random(12);
      engagedPlan.ifnAround.forEach((p) => {
        for (let j = 0; j < 3; j++) {
          const a = rnd.range(0, 360), d = rnd.range(20, 34) * k;
          const g = interferon({ color: 'cd8', size: 6.4 * k, stage: 'dark' });
          g.setAttribute('transform', `translate(${f(p.x + Math.cos(a * DEG) * d)} ${f(p.y + Math.sin(a * DEG) * d)})`);
          S2.ifn.append(g);
        }
      });
      if (!ctx.reducedMotion) sceneAmb.push(ctx.ambient(gsap.to(S2.ifn.children, { x: '+=3', y: '-=4', duration: 3.4, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: { each: 0.2, from: 'random' } })));
    }

    // ---- killer T cells (rigs): one art per profile (polarity and glyphs differ)
    engagedPlan.t.forEach((tp, i) => {
      const wrap = mk('g', { class: 'dz f-brakes', 'data-kind': 'tcell' }, lT);
      const pose = tp.poses[mi()];
      const built = makeTArt(tp, mi(), k);
      const R = rig(built.art, { x: pose.x, y: pose.y, parent: wrap, seed: tp.seed, opacity: pose.o });
      const A = { kind: 'tcell', wrap, R, tp, built, arts: { [mi()]: built }, i };
      S2.tcells.push(A);
      S2.actors.push(A);
    });

    // ---- the "Hiding" lens: two cancer cells up close (cups ≥ 14 px, rule 3)
    buildLens(S2);

    // ---- legend (always on)
    buildLegend(S2);

    S = S2;
    buildAir();
    applyIdle();
    syncTabStops();
    drawLabels();
    return S2;
  }

  // ---------------------------------------------------------------- T-cell plan
  // Poses per profile ({ x, y, o, pol }), contacts for inflamed (engaged PD-1/PD-L1 pairs) and
  // the kill plan for the drug runs.
  function planTCells(G, L) {
    const { C, k, nest, P } = G;
    const RT = 12 * k;
    const tOutline = (seed, pol) => cellInfo(tCell({ variant: 'cd8', r: RT, state: 'activated', seed, stage: 'dark', receptors: false, polarity: pol, detail: 'high' })).outline;
    const cOutline = (c) => cellInfo(cancerCell({ r: c.r, seed: c.seed, stage: 'dark', receptors: false })).outline;
    const hitR = (o, deg) => { const h1 = rayHit(o, deg * DEG); return Math.hypot(h1.x, h1.y); };
    const usable = nest.filter((c) => !G.hiders.has(c.i));
    const used = new Set();
    const pickEdge = (a) => {
      let best = null, bd = 1e9;
      for (const c of usable) {
        if (!c.edge || used.has(c.i)) continue;
        const d = angDiff(a, c.a);
        if (d < bd) { bd = d; best = c; }
      }
      used.add(best.i);
      return best;
    };
    const t = [];
    const pdl = [];
    const ifnAround = [];
    let seed = 900;
    // 1) five engaged T cells on the nest surface (each faces one cancer cell)
    for (const a of [8, 78, 148, 196, 272]) {
      const c = pickEdge(a);
      const out = c.a;
      const pol = out + 180;
      const co = cOutline(c), to = tOutline(seed, pol);
      const d = hitR(co, out) + hitR(to, pol) + 3 * k;
      const x = c.x + Math.cos(out * DEG) * d, y = c.y + Math.sin(out * DEG) * d;
      // the locked PD-1/PD-L1 pair sits off-axis, where the two membranes are further apart
      const side = t.length % 2 ? -1 : 1;
      const th = pol + side * 54;
      const ht = rayHit(to, th * DEG);
      const Pt = { x: x + ht.x, y: y + ht.y };
      const thc = Math.atan2(Pt.y - c.y, Pt.x - c.x) / DEG;
      const hc = rayHit(co, thc * DEG);
      const Pc = { x: c.x + hc.x, y: c.y + hc.y };
      const u = Math.atan2(Pc.y - Pt.y, Pc.x - Pt.x) / DEG;
      const size = clamp(Math.hypot(Pc.x - Pt.x, Pc.y - Pt.y) / 1.72, 5.5 * k, 9.5 * k);
      const pair = { side, size, u, pd1: { x: ht.x, y: ht.y, deg: u }, minus: { x: ht.x - Math.cos(u * DEG) * 6 * k, y: ht.y - Math.sin(u * DEG) * 6 * k } };
      t.push({ seed: seed++, role: 'engaged', target: c.i, inflamed: { x, y, pol }, pair });
      pdl.push({ ci: c.i, x: Pc.x, y: Pc.y, deg: u + 180, size, pair: true });
      pdl.push({ ci: c.i, deg: out - side * 8 });
      pdl.push({ ci: c.i, deg: out + side * 62 });
      ifnAround.push({ x, y });
    }
    // 2) four T cells inside the nest, at junctions between cancer cells
    const inner = nest.filter((c) => !c.edge);
    const junctions = [];
    for (let a = 0; a < inner.length; a++) for (let b = a + 1; b < inner.length; b++) for (let c = b + 1; c < inner.length; c++) {
      const A = inner[a], B = inner[b], Cc = inner[c];
      const dd = (p, q) => Math.hypot(p.x - q.x, p.y - q.y);
      if (dd(A, B) > 48 * k || dd(B, Cc) > 48 * k || dd(A, Cc) > 48 * k) continue;
      const m = { x: (A.x + B.x + Cc.x) / 3, y: (A.y + B.y + Cc.y) / 3, tri: [A, B, Cc] };
      const rad = Math.hypot(m.x - C.x, m.y - C.y);
      if (rad < 22 * k || rad > 84 * k) continue;
      junctions.push(m);
    }
    const chosenJ = [];
    const jAngles = [-60, 40, 125, 220];
    for (const ja of jAngles) {
      let best = null, bd = 1e9;
      for (const m of junctions) {
        if (chosenJ.some((q) => Math.hypot(q.x - m.x, q.y - m.y) < 50 * k)) continue;
        const d = angDiff(ja, Math.atan2(m.y - C.y, m.x - C.x) / DEG) + Math.abs(Math.hypot(m.x - C.x, m.y - C.y) - 55 * k) * 0.3;
        if (d < bd) { bd = d; best = m; }
      }
      if (best) chosenJ.push(best);
    }
    chosenJ.forEach((m, j) => {
      const tgt = m.tri.filter((c) => !G.hiders.has(c.i) && !used.has(c.i)).sort((p, q) => Math.hypot(p.x - m.x, p.y - m.y) - Math.hypot(q.x - m.x, q.y - m.y))[0];
      const kills = j < 3 && tgt;
      if (kills) used.add(tgt.i);
      const pol = tgt ? Math.atan2(tgt.y - m.y, tgt.x - m.x) / DEG : 0;
      t.push({ seed: seed++, role: kills ? 'inner' : 'innerIdle', target: kills ? tgt.i : null, inflamed: { x: m.x, y: m.y, pol } });
      if (tgt) pdl.push({ ci: tgt.i, deg: pol + 180 + 25 });
      ifnAround.push({ x: m.x, y: m.y });
    });
    // 3) seven more in and around the nest edge / thin stroma
    for (const [a, R] of [[322, 132], [52, 134], [234, 162], [112, 168], [20, 166], [292, 170], [162, 188]]) {
      const p = P(a, R);
      t.push({ seed: seed++, role: 'around', target: null, inflamed: { x: p.x, y: p.y, pol: a + 180 } });
    }
    // second kills: two engaged T cells move on to a neighbor deeper in the nest
    const deeper = (ti) => {
      const T0 = t[ti];
      const c0 = nest[T0.target];
      const cand = usable.filter((c) => !used.has(c.i) && Math.hypot(c.x - c0.x, c.y - c0.y) < 50 * k && Math.hypot(c.x - C.x, c.y - C.y) < Math.hypot(c0.x - C.x, c0.y - C.y));
      cand.sort((p, q) => Math.hypot(p.x - c0.x, p.y - c0.y) - Math.hypot(q.x - c0.x, q.y - c0.y));
      if (cand[0]) { used.add(cand[0].i); T0.second = cand[0].i; }
    };
    deeper(0); deeper(3);

    // ---- excluded: 12 T cells in the stroma band, 2 just inside the nest
    const bandR = [160, 184, 208];
    const exAngles = [];
    for (let i = 0; i < 12; i++) exAngles.push(i * 30 + 12 + ((i * 17) % 11) - 5);
    const exPoses = exAngles.map((a, i) => { const p = P(a, bandR[i % 3]); return { x: p.x, y: p.y, o: 1, pol: a + 180 }; });
    const exIn = [];
    {
      const all = [];
      for (let a = 0; a < nest.length; a++) for (let b = a + 1; b < nest.length; b++) for (let c = b + 1; c < nest.length; c++) {
        const A = nest[a], B = nest[b], Cc = nest[c];
        const dd = (p, q) => Math.hypot(p.x - q.x, p.y - q.y);
        if (dd(A, B) > 48 * k || dd(B, Cc) > 48 * k || dd(A, Cc) > 48 * k) continue;
        all.push({ x: (A.x + B.x + Cc.x) / 3, y: (A.y + B.y + Cc.y) / 3, tri: [A, B, Cc] });
      }
      const cands = all.filter((m) => { const r2 = Math.hypot((m.x - C.x) / L.sq[0], (m.y - C.y) / L.sq[1]); return r2 > 62 * k && r2 < 90 * k; });
      for (const ja of [24, 205]) {
        let best = null, bd = 1e9;
        for (const m of cands) { const d = angDiff(ja, Math.atan2(m.y - C.y, m.x - C.x) / DEG); if (d < bd) { bd = d; best = m; } }
        if (best) exIn.push(best);
      }
    }
    // The excluded T cell that gets in and can kill one cancer cell with the drug
    const exKillTarget = exIn[0] ? exIn[0].tri.filter((c) => !G.hiders.has(c.i)).sort((p, q) => Math.hypot(p.x - C.x, p.y - C.y) - Math.hypot(q.x - C.x, q.y - C.y))[0] : null;
    const pdlExcluded = [];
    const pdlDesert = [];
    [3, 11, 20].forEach((ci, j) => { if (!G.hiders.has(ci)) pdlExcluded.push({ ci, deg: (ci * 53 + j * 40) % 360 }); });
    pdlDesert.push({ ci: 9, deg: 140 });

    // assign poses
    const hidden = { x: L.mouth.x, y: L.mouth.y, o: 0, pol: compact ? -90 : 180 };
    const order = t.map((_, i) => i);
    // excluded: the two inner ones first (the killer is the 'inner' with the matching index)
    order.forEach((ti, n) => {
      const T0 = t[ti];
      T0.poses = [{ ...T0.inflamed, o: 1 }];
      if (n < 2 && exIn[n]) {
        const m = exIn[n];
        const tgt = n === 0 && exKillTarget ? exKillTarget : m.tri[0];
        T0.poses[1] = { x: m.x, y: m.y, o: 1, pol: Math.atan2(tgt.y - m.y, tgt.x - m.x) / DEG };
        if (n === 0 && exKillTarget) T0.exTarget = exKillTarget.i;
      } else if (n >= 2 && n - 2 < exPoses.length) T0.poses[1] = exPoses[n - 2];
      else T0.poses[1] = { ...hidden };
      if (n < L.desertT.length) {
        const [x, y] = L.desertT[n];
        T0.poses[2] = { x, y, o: 1, pol: Math.atan2(C.y - y, C.x - x) / DEG };
      } else T0.poses[2] = { ...hidden };
    });
    relaxPoses(t, G, L);
    return { t, pdl, pdlExcluded, pdlDesert, ifnAround };
  }

  /** Push free T-cell poses away from static players and from each other (per profile). */
  function relaxPoses(t, G, L) {
    const RT = 12 * G.k;
    for (let m = 0; m < 3; m++) {
      const statics = G.statics.filter((d) => d.m[m]).map((d) => ({ x: d.x, y: d.y, r: (d.kind === 'tam' ? 28 : d.kind === 'dc' ? 22 : d.kind === 'mdsc' ? 14 : 13) * G.k }));
      const free = t.filter((T0) => T0.poses[m].o && !(m === 0 && T0.role !== 'around') && !(m === 1 && T0.exTarget != null));
      for (let it = 0; it < 30; it++) {
        for (const T0 of free) {
          const p = T0.poses[m];
          for (const s of statics) {
            const dx = p.x - s.x, dy = p.y - s.y, d = Math.hypot(dx, dy) || 1, min = s.r + RT + 4 * G.k;
            if (d < min) { p.x += (dx / d) * (min - d) * 0.5; p.y += (dy / d) * (min - d) * 0.5; }
          }
          for (const U of t) {
            if (U === T0 || !U.poses[m].o) continue;
            const q = U.poses[m];
            const dx = p.x - q.x, dy = p.y - q.y, d = Math.hypot(dx, dy) || 1, min = RT * 2.3;
            if (d < min) { p.x += (dx / d) * (min - d) * 0.5; p.y += (dy / d) * (min - d) * 0.5; }
          }
          p.x = clamp(p.x, 20, L.W - 20); p.y = clamp(p.y, 20, L.H - 20);
        }
      }
      for (const T0 of free) { const p = T0.poses[m]; p.pol = Math.atan2(G.C.y - p.y, G.C.x - p.x) / DEG; }
    }
  }

  /** One T-cell drawing for a profile: polarity, a free PD-1, and (inflamed, engaged) the
   *  PD-1 that is locked to PD-L1 plus its "−" disc. */
  function makeTArt(tp, m, k) {
    const pose = tp.poses[m];
    const art = tCell({ variant: 'cd8', r: 12 * k, state: 'activated', seed: tp.seed, stage: 'dark', receptors: false, polarity: pose.pol, detail: 'high' });
    const free = seat(art, (o) => pd1({ ...o, icon: false }), pose.pol + 150 * (tp.seed % 2 ? 1 : -1), 7 * k);
    let eng = null;
    if (m === 0 && tp.role === 'engaged' && tp.pair) {
      const { pd1: q, size, minus: mn, side, u } = tp.pair;
      const g = pd1({ size, stage: 'dark', detail: 'low', icon: false });
      g.setAttribute('transform', `translate(${f(q.x)} ${f(q.y)}) rotate(${f(q.deg + 90)})`);
      layerOf(art).append(g);
      const minus = mk('g', { 'data-part': 'brake-minus', transform: `translate(${f(mn.x)} ${f(mn.y)})` });
      minus.append(signalIcon({ type: 'inhibitory', size: 9 * Math.max(0.9, k), stage: 'dark' }));
      art.append(minus);
      eng = { g, x: q.x, y: q.y, r: q.deg + 90, size, minus, mx: mn.x, my: mn.y, away: u + side * 84 };
    }
    return { art, free, eng };
  }

  // ---------------------------------------------------------------- lens, legend
  function buildLens(S2) {
    const { L } = S2;
    const { x, y, w, h: hh } = L.lens;
    const g = S2.lLens;
    mk('rect', { x, y, width: w, height: hh, rx: 14, fill: 'rgb(8 11 28 / 0.9)', stroke: 'rgb(217 222 234 / 0.4)', 'stroke-width': 1.2 }, g);
    label(g, 'UP CLOSE', x + 14, y + 22, { anchor: 'start', cls: 't-caps' });
    const cr = compact ? 30 : 36;
    const cy = y + hh / 2 + (compact ? 6 : 4);
    const xs = [x + w * 0.29, x + w * 0.71];
    const vis = cancerCell({ r: cr, seed: 331, stage: 'dark', receptors: false, nuclei: 1 });
    [200, 240, 280, 320, 0, 160, 40].forEach((deg, j) => seat(vis, (o) => mhc1({ ...o, peptide: j % 2 ? 'self' : 'neo' }), deg, 15, { detail: 'high' }));
    vis.setAttribute('transform', `translate(${f(xs[0])} ${f(cy)})`);
    const hid = cancerCell({ r: cr, seed: 332, stage: 'dark', receptors: false, nuclei: 1 });
    hid.setAttribute('transform', `translate(${f(xs[1])} ${f(cy)})`);
    g.append(vis, hid);
    label(g, 'Displays MHC', xs[0], y + hh - 12, { cls: 't-small' });
    label(g, 'No MHC: hidden', xs[1], y + hh - 12, { cls: 't-small' });
  }
  function buildLegend(S2) {
    const { L } = S2;
    const g = S2.lLegend;
    const Lg = L.legend;
    const items = [];
    const glyph = (kind) => {
      if (kind === 'cancer') return cancerCell({ r: 8, seed: 12, stage: 'dark', receptors: false, detail: 'low', glow: false });
      if (kind === 'tcell') return tCell({ variant: 'cd8', r: 6.5, state: 'activated', seed: 4, stage: 'dark', receptors: false, polarity: 0, glow: false });
      const w = mk('g', {});
      const fb = fibroblast({ r: 11, seed: 3, stage: 'dark', angle: 0, glow: false, detail: 'low' });
      w.append(fb);
      mk('path', { d: 'M-12 6 Q0 3 12 6', fill: 'none', stroke: '#D6C4AA', 'stroke-width': 1, 'stroke-opacity': 0.6 }, w);
      return w;
    };
    if (Lg.twoLines) {
      const rowsXY = [[Lg.x, Lg.y], [Lg.x + 118, Lg.y], [Lg.x, Lg.y + 24]];
      Lg.rows.forEach(([kind, text], i) => items.push({ kind, text, x: rowsXY[i][0], y: rowsXY[i][1] }));
    } else {
      Lg.rows.forEach(([kind, text], i) => items.push({ kind, text, x: Lg.x, y: Lg.y + i * 24 }));
    }
    const bgW = Lg.twoLines ? 0 : 236, bgH = Lg.twoLines ? 0 : 76;
    if (bgW) mk('rect', { x: Lg.x - 10, y: Lg.y - 14, width: bgW, height: bgH, rx: 10, fill: 'rgb(8 11 28 / 0.5)' }, g);
    for (const it of items) {
      const gl = glyph(it.kind);
      gl.setAttribute('transform', `translate(${f(it.x + 8)} ${f(it.y)})`);
      g.append(gl);
      const t = mk('text', { x: f(it.x + 24), y: f(it.y + 4.5), class: 't-small t-halo' }, g);
      t.textContent = it.text;
      t.style.fill = 'var(--fg)';
    }
  }

  // ================================================================ idle motion
  function applyIdle() {
    if (!S) return;
    for (const A of S.tcells) {
      gsap.set(A.R.layers.idle, { x: 0, y: 0 });
    }
    stopAmbient();
    if (ctx.reducedMotion) return;
    const m = MODES.indexOf(mode);
    const { C } = S.G;
    S.tcells.forEach((A, i) => {
      const p = A.tp.poses[m];
      if (!p.o) return;
      let dx, dy;
      if (mode === 'excluded' && A.tp.exTarget == null) {
        // drift inward and bounce gently off the inner edge of the wall
        const a = Math.atan2(C.y - p.y, C.x - p.x);
        dx = Math.cos(a) * 6 * S.G.k; dy = Math.sin(a) * 6 * S.G.k;
        ambients.push(ctx.ambient(gsap.to(A.R.layers.idle, { x: dx, y: dy, duration: 1.7 + (i % 4) * 0.35, ease: 'power1.in', yoyo: true, repeat: -1, repeatDelay: 0.4 + (i % 3) * 0.3, delay: (i % 5) * 0.4 })));
      } else {
        const a = (i * 97) % 360;
        dx = Math.cos(a * DEG) * 3.2 * S.G.k; dy = Math.sin(a * DEG) * 3.2 * S.G.k;
        ambients.push(ctx.ambient(gsap.to(A.R.layers.idle, { x: dx, y: dy, duration: 2.8 + (i % 5) * 0.4, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: (i % 4) * 0.3 })));
      }
    });
  }

  // ================================================================ profile switch
  function transitionTo(next) {
    const m0 = MODES.indexOf(mode), m1 = MODES.indexOf(next);
    const tl = gsap.timeline({ paused: true });
    const D = 1.2;
    // glyph overlays and static players fade
    for (const A of S.cancers) for (const e of A.glyphs) if (e.m[m0] !== e.m[m1]) tl.to(e.g, { attr: { opacity: e.m[m1] }, duration: 0.6, ease: 'so.inOut' }, e.m[m1] ? 0.55 : 0);
    for (const A of S.statics) if (A.m[m0] !== A.m[m1]) tl.to(A.inner, { attr: { opacity: A.m[m1] }, duration: 0.7, ease: 'so.inOut' }, A.m[m1] ? 0.45 : 0);
    S.fibroLayers.forEach((F, i) => { if (F.m[m0] !== F.m[m1]) tl.to(F.g, { attr: { opacity: F.m[m1] }, duration: 0.8, ease: 'so.inOut' }, F.m[m1] ? 0.15 * i : 0.15 * (3 - i)); });
    for (const F of S.collagen) if (F.m[m0] !== F.m[m1]) tl.to(F.g, { attr: { opacity: F.m[m1] }, duration: 0.8, ease: 'so.inOut' }, 0.2);
    tl.to(S.ifn, { attr: { opacity: m1 === 0 ? 1 : 0 }, duration: 0.6 }, m1 === 0 ? 0.8 : 0);
    // T cells glide (and re-orient), emerge from or return to the vessel
    S.tcells.forEach((A, i) => {
      const p0 = A.tp.poses[m0], p1 = A.tp.poses[m1];
      const st = (i % 6) * 0.05;
      if (!p0.o && !p1.o) return;
      if (!p0.o && p1.o) {
        // from the vessel: start hidden at the mouth
        move(tl, A.R, { x: S.L.mouth.x, y: S.L.mouth.y, opacity: 0, duration: 0.01, pos: 0 });
      }
      if (p1.o) {
        if (!A.arts[m1]) A.arts[m1] = makeTArt(A.tp, m1, S.G.k);
        const nb = A.arts[m1];
        if (nb.art !== A.R.art) {
          nb.art.removeAttribute('opacity');
          swap(tl, A.R, nb.art, { duration: 0.7, pos: st + 0.15 });
          A.built = nb;
        }
      }
      const dist = Math.hypot(p1.x - A.R.plan.x, p1.y - A.R.plan.y);
      const dur = clamp(dist / 140, 0.9, D + 0.6);
      move(tl, A.R, { x: p1.x, y: p1.y, opacity: p1.o, duration: dur, pos: st + (!p0.o ? 0.2 : 0), stretch: 0.05 });
    });
    return tl;
  }

  function cleanArts() {
    if (!S) return;
    for (const A of S.tcells) {
      for (const n of [...A.R.layers.idle.children]) if (n !== A.R.art && n.classList?.contains('sao-cell')) n.remove();
      for (const key of Object.keys(A.arts)) if (A.arts[key].art !== A.R.art) delete A.arts[key];
    }
  }

  function setMode(next) {
    if (next === mode) return;
    player.finish();
    cleanArts();
    clearPick();
    if (drugRan) {
      drugRan = false;
      mode = next;
      crossfadeRebuild();
    } else {
      const tl = transitionTo(next);
      mode = next;
      tl.eventCallback('onComplete', () => { cleanArts(); applyIdle(); syncTabStops(); drawLabels(); });
      stopAmbient();
      for (const A of S.tcells) gsap.to(A.R.layers.idle, { x: 0, y: 0, duration: ctx.reducedMotion ? 0 : 0.4 });
      clearLabels();
      player.start(tl);
    }
    seg.set(mode);
    paintControls();
  }

  function crossfadeRebuild() {
    clearLabels();
    if (ctx.reducedMotion || !S) { build(); return; }
    const old = S.root;
    old.style.pointerEvents = 'none';
    build({ keep: old });
    svg.append(old);                       // the old scene fades out on top of the new one
    gsap.fromTo(S.root, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'so.out' });
    gsap.to(old, { opacity: 0, duration: 0.45, ease: 'so.inOut', onComplete: () => old.remove() });
  }

  // ================================================================ the PD-1 blocker
  function runDrug() {
    if (drugRan) return;
    player.finish();
    cleanArts();
    clearPick();
    drugRan = true;
    const m = MODES.indexOf(mode);
    const tl = gsap.timeline({ paused: true });
    const { G, L } = S;
    const k = G.k;
    const abSize = 11 * k;
    const V = L.vessel;
    const vesselPoint = (i, n) => {
      const t = (i + 0.5) / n;
      if (compact) return { x: lerp(40, L.W - 40, t), y: V.y - V.width * 0.3 };
      return { x: lerp(V.x0 + 30, L.W - 40, t * 0.85), y: V.y - V.width * 0.25 };
    };
    // a drug antibody flies from the vessel to a PD-1 head on a T cell, in that cell's frame
    const flyTo = (A, s, awayDeg, pos, from) => {
      const P = capPose(abSize, headOf(s, 'pd1'), awayDeg);
      const ab = antibody({ variant: 'therapeutic', size: abSize, stage: 'dark', detail: 'low' });
      const g = mk('g', { 'data-part': 'drug', opacity: 0 }, A.R.layers.idle);
      g.append(ab);
      const F = { x: from.x - A.R.plan.x, y: from.y - A.R.plan.y, r: P.r - 60 };
      const mid = { x: lerp(F.x, P.x, 0.5) + (P.y - F.y) * 0.12, y: lerp(F.y, P.y, 0.5) - (P.x - F.x) * 0.12 };
      const dur = clamp(Math.hypot(F.x - P.x, F.y - P.y) / 300, 0.9, 1.7);
      g.setAttribute('transform', poseStr(F));
      drive(tl, (p) => {
        const q = 1 - Math.pow(1 - p, 2.2);
        const a = (1 - q) * (1 - q), b = 2 * (1 - q) * q, c = q * q;
        g.setAttribute('transform', poseStr({ x: a * F.x + b * mid.x + c * P.x, y: a * F.y + b * mid.y + c * P.y, r: lerp(F.r, P.r, q) }));
        g.setAttribute('opacity', f(Math.min(1, p * 5)));
      }, { duration: dur, pos });
      return pos + dur;
    };
    const visibleT = S.tcells.filter((A) => A.tp.poses[m].o);
    let lastCap = 0;
    const capAt = new Map();
    visibleT.forEach((A, i) => {
      const b = A.built;
      const useEng = b.eng && m === 0;
      const s = useEng ? b.eng : b.free;
      const away = useEng ? b.eng.away : (s.r - 90);
      const end = flyTo(A, s, away, 0.15 + i * 0.05, vesselPoint(i, visibleT.length));
      lastCap = Math.max(lastCap, end);
      capAt.set(A, end);
      if (useEng) {
        // the "−" disc fades as the antibody caps PD-1; the partner PD-L1 lets go
        // the brake's "−" disc pops off (swells, then flies outward and fades) as the drug lands
        const mx = b.eng.mx, my = b.eng.my, ml = Math.hypot(mx, my) || 1, pop = 16 * k;
        const pose = (x, y, sc) => `translate(${f(x)} ${f(y)}) scale(${f(sc)})`;
        tl.fromTo(b.eng.minus, { attr: { transform: pose(mx, my, 1), opacity: 1 } }, { attr: { transform: pose(mx, my, 1.45) }, duration: 0.2, ease: 'back.out(2)' }, end - 0.35);
        tl.to(b.eng.minus, { attr: { transform: pose(mx + (mx / ml) * pop, my + (my / ml) * pop, 0.7), opacity: 0 }, duration: 0.6, ease: 'so.in' }, end - 0.15);
        const e = S.cancers[A.tp.target].glyphs.find((x) => x.pair);
        if (e) {
          const sd = e.seat;
          const back = { x: sd.x - Math.cos(sd.deg * DEG) * sd.size * 0.45, y: sd.y - Math.sin(sd.deg * DEG) * sd.size * 0.45 };
          tl.fromTo(e.g, { attr: { transform: `translate(${f(sd.x)} ${f(sd.y)}) rotate(${f(sd.r)})` } }, { attr: { transform: `translate(${f(back.x)} ${f(back.y)}) rotate(${f(sd.r + 22 * (A.tp.pair.side))})` }, duration: 0.8, ease: 'so.inOut' }, end - 0.55);
        }
      }
    });
    // Desert: the extra antibodies drift in and find nothing to bind
    if (m === 2) {
      const extra = compact ? 5 : 7;
      for (let j = 0; j < extra; j++) {
        const from = vesselPoint(j + 0.3, extra);
        const ab = antibody({ variant: 'therapeutic', size: abSize, stage: 'dark', detail: 'low' });
        const g = mk('g', { 'data-part': 'drug', opacity: 0 }, S.lFx);
        g.append(ab);
        const ang = (j / extra) * 300 + 120;
        const to = { x: G.C.x + Math.cos(ang * DEG) * 150 * k + ((j * 37) % 30), y: G.C.y + Math.sin(ang * DEG) * 120 * k };
        const r0 = (j * 53) % 360;
        drive(tl, (p) => {
          const q = 1 - Math.pow(1 - p, 2);
          g.setAttribute('transform', `translate(${f(lerp(from.x, to.x, q))} ${f(lerp(from.y, to.y, q))}) rotate(${f(r0 + q * 80)})`);
          g.setAttribute('opacity', f(p < 0.12 ? p / 0.12 : p > 0.7 ? Math.max(0, 1 - (p - 0.7) / 0.3) * 0.9 + 0.1 * 0 : 1));
        }, { duration: 3.6, pos: 0.2 + j * 0.15 });
      }
    }
    // Each T cell that touches a visible cancer cell: once its brake is capped, a recognition
    // ring, then the shared kill (it is already docked: braked T cells sit in contact).
    const kills = [];
    const deaths = [];
    if (m === 0) {
      visibleT.forEach((A) => { if (A.tp.target != null) kills.push({ A, ci: A.tp.target, second: A.tp.second }); });
    } else if (m === 1) {
      visibleT.forEach((A) => { if (A.tp.exTarget != null) kills.push({ A, ci: A.tp.exTarget }); });
    }
    kills.forEach((K, j) => {
      const C0 = S.cancers[K.ci];
      dock(tl, K.A.R, C0.R, { flatten: 0.12, pos: 0.1 + j * 0.05 });
      const start = Math.max(capAt.get(K.A) ?? lastCap, 1.25 + j * 0.05) + 0.05;
      recognize(tl, K.A.R, C0.R, { badge: false, duration: 1.2, pos: start });
      emit(tl, K.A.R, { kind: 'interferon', n: 3, r: 26 * k, duration: 1.8, size: 6 * k, fade: true, seed: j + 3, pos: start + 0.2 });
      const kk = kill(tl, K.A.R, C0.R, { duration: 1.9, pos: start + 0.25, back: 4 * k });
      fadeGlyphs(tl, C0, kk.marks.dying);
      move(tl, C0.R, { opacity: 0, duration: 1.2, pos: kk.marks.dead });
      deaths.push(kk.marks.dead);
      if (K.second != null) {
        const C1 = S.cancers[K.second];
        const t1 = kk.marks.released + 1.15;
        approach(tl, K.A.R, C1.R, { gap: 2 * k, pos: t1, duration: 1.1 });
        recognize(tl, K.A.R, C1.R, { badge: false, duration: 1.1, pos: t1 + 0.9 });
        const k2 = kill(tl, K.A.R, C1.R, { duration: 1.9, pos: t1 + 1.1, back: 4 * k });
        fadeGlyphs(tl, C1, k2.marks.dying);
        move(tl, C1.R, { opacity: 0, duration: 1.2, pos: k2.marks.dead });
        deaths.push(k2.marks.dead);
      }
    });
    tl.eventCallback('onUpdate', () => { const n = deaths.filter((t) => t <= tl.time() + 1e-3).length; if (n !== killedNow) setKilled(n); });
    tl.eventCallback('onComplete', () => { setKilled(deaths.length); syncTabStops(); drawLabels(); });
    clearLabels();
    player.start(tl);
    paintControls();
  }
  function fadeGlyphs(tl, A, pos) {
    const gs = A.glyphs.filter((e) => e.m[MODES.indexOf(mode)]).map((e) => e.g);
    if (gs.length) tl.to(gs, { attr: { opacity: 0 }, duration: 0.6 }, pos);
  }

  function reset() {
    player.finish();
    clearPick();
    if (!drugRan) { paintControls(); return; }
    drugRan = false;
    crossfadeRebuild();
    paintControls();
  }

  // ================================================================ secondary layer + taps
  function setFocus(v) {
    focus = v || null;
    clearPick(false);
    if (focus) svg.setAttribute('data-focus', focus); else svg.removeAttribute('data-focus');
    const c = CHIPS.find((x) => x.value === focus);
    if (c) card.show({ kicker: 'Escape route', title: c.label, body: `<p>${c.card}</p>` });
    else card.hide();
    drawLabels();
  }
  function clearLabels() { if (S) S.lLabels.replaceChildren(); }

  const posOf = (A) => (A.R ? { x: A.R.plan.x, y: A.R.plan.y } : { x: A.x, y: A.y });
  const visibleNow = (A) => {
    const m = MODES.indexOf(mode);
    if (A.R) return A.R.plan.o > 0.5;
    return !!A.m?.[m];
  };
  /** A callout outside the tumor toward angle a (from the nest center), pointing at p. */
  let placed = [];
  /** Areas labels must avoid (legend, stage tags, the lens when shown), in view units. */
  function obstacles() {
    const L = S.L;
    const o = compact
      ? [{ x: 0, y: 0, w: L.W, h: 58 }]
      : [{ x: 0, y: 0, w: 252, h: 92 }, { x: L.W - 160, y: 0, w: 160, h: 70 }];
    if (focus === 'hiding') { const Ls = L.lens; o.push({ x: Ls.x - 6, y: Ls.y - 6, w: Ls.w + 12, h: Ls.h + 12 }); }
    return o.concat(placed);
  }
  const hits = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  /** A label outside the tumor toward angle a (from the nest center), with a leader to p. */
  function callout(text, p, { a, R, cls = 't-label', r = 0 } = {}) {
    const { C, k } = S.G;
    const L = S.L;
    const ang0 = a ?? Math.atan2(p.y - C.y, p.x - C.x) / DEG;
    const RR0 = (R ?? 250) * k;
    const g = label(S.lLabels, text, 0, 0, { anchor: 'start', cls });
    const t = g.querySelector('text');
    let bb;
    try { bb = t.getBBox(); } catch { bb = { x: 0, y: -12, width: 8 * text.length, height: 16 }; }
    const w = bb.width, hh = bb.height, top = bb.y;
    const obs = obstacles();
    let best = null;
    const tries = [];
    for (const dr of [0, 22, -18, 44]) for (const da of [0, 10, -10, 20, -20, 32, -32, 46, -46, 62, -62]) tries.push([ang0 + da, RR0 + dr * k]);
    for (const [ang, RR] of tries) {
      const cx = C.x + Math.cos(ang * DEG) * RR * L.sq[0];
      const cy = C.y + Math.sin(ang * DEG) * RR * L.sq[1];
      const c = Math.cos(ang * DEG);
      const x0 = c > 0.25 ? cx : c < -0.25 ? cx - w : cx - w / 2;
      const box = { x: x0 - 3, y: cy + top - 3, w: w + 6, h: hh + 6 };
      if (box.x < 8 || box.x + box.w > L.W - 8 || box.y < 6 || box.y + box.h > L.H - 6) continue;
      if (obs.some((o) => hits(box, o))) continue;
      best = { x0, cy, box };
      break;
    }
    if (!best) {
      const x0 = clamp(p.x + 18 - w / 2, 10, L.W - 10 - w), cy = clamp(p.y - 22, 20 - top, L.H - 8 - hh - top);
      best = { x0, cy, box: { x: x0 - 3, y: cy + top - 3, w: w + 6, h: hh + 6 } };
    }
    t.setAttribute('x', f(best.x0)); t.setAttribute('y', f(best.cy));
    for (const ts of t.querySelectorAll('tspan')) ts.setAttribute('x', f(best.x0));
    placed.push(best.box);
    // leader: from the nearest point of the label box to the target
    const B = best.box;
    const lx = clamp(p.x, B.x + 2, B.x + B.w - 2), ly = clamp(p.y, B.y + 1, B.y + B.h - 1);
    const sx = p.x < B.x ? B.x : p.x > B.x + B.w ? B.x + B.w : lx;
    const sy = p.y < B.y ? B.y : p.y > B.y + B.h ? B.y + B.h : ly;
    const dx = p.x - sx, dy = p.y - sy, d = Math.hypot(dx, dy) || 1;
    if (d > r + 6) {
      const ex = p.x - (dx / d) * r, ey = p.y - (dy / d) * r;
      const ln = mk('line', { x1: f(sx), y1: f(sy), x2: f(ex), y2: f(ey), class: 'leader' });
      g.insertBefore(ln, t);
      g.insertBefore(mk('circle', { cx: f(ex), cy: f(ey), r: 2.2, class: 'leader-dot' }), t);
    }
    return g;
  }
  function drawLabels() {
    if (!S) return;
    clearLabels();
    placed = [];
    const m = MODES.indexOf(mode);
    const { C, k } = S.G;
    if (picked) { pickLabel(picked); }
    if (!focus) return;
    const first = (kind) => S.actors.find((A) => A.kind === kind && visibleNow(A));
    if (focus === 'hiding') {
      const hid = S.cancers.filter((A) => A.kind === 'hider' && visibleNow(A));
      const g = mk('g', {}, S.lLabels);
      for (const A of hid) mk('circle', { cx: f(A.x), cy: f(A.y), r: f(A.r + 4 * k), fill: 'none', stroke: 'rgb(233 236 246 / 0.8)', 'stroke-width': 1.3, 'stroke-dasharray': '3 3' }, g);
      const Ls = S.L.lens;
      const ax = compact ? Ls.x + Ls.w * 0.71 : Ls.x, ay = compact ? Ls.y : Ls.y + Ls.h * 0.62;
      const target = hid.sort((p, q) => Math.hypot(p.x - ax, p.y - ay) - Math.hypot(q.x - ax, q.y - ay))[0];
      if (target) {
        const dx = target.x - ax, dy = target.y - ay, d = Math.hypot(dx, dy) || 1, rr = target.r + 4 * k;
        mk('line', { x1: f(ax), y1: f(ay), x2: f(target.x - (dx / d) * rr), y2: f(target.y - (dy / d) * rr), class: 'leader' }, g);
      }
      return;
    }
    if (focus === 'brakes') {
      const engaged = S.tcells.filter((A) => m === 0 && A.built.eng && visibleNow(A));
      const nearest = (list, a) => list.slice().sort((p, q) => angDiff(a, S.G.angOf(posOf(p))) - angDiff(a, S.G.angOf(posOf(q))))[0];
      if (engaged.length) {
        const aB = compact ? 200 : 205, aP = compact ? -40 : -30;
        const eT = nearest(engaged, aB);
        const p = posOf(eT);
        const e = eT.built.eng;
        callout('PD-1 brake engaged', { x: p.x + e.mx, y: p.y + e.my }, { a: aB });
        const pT = nearest(engaged.filter((A) => A !== eT), aP);
        const g0 = pT && S.cancers[pT.tp.target].glyphs.find((x) => x.pair);
        if (g0) callout('PD-L1', { x: g0.seat.x, y: g0.seat.y }, { a: aP });
        const ring = S.ifn.children[4];
        if (ring) {
          const t = ring.transform.baseVal[0]?.matrix;
          if (t) callout('IFN-γ', { x: t.e, y: t.f }, { a: compact ? 60 : 70, cls: 't-small' });
        }
      } else {
        const pd = S.cancers.flatMap((A) => A.glyphs.filter((x) => x.seat && x.m[m]))[0];
        if (pd) callout('PD-L1: rare here', { x: pd.seat.x, y: pd.seat.y }, { a: -35 });
        const tam = first('tam');
        if (tam) callout('PD-L1 on a macrophage', posOf(tam), { a: compact ? 150 : 165, cls: 't-small', r: tam.r });
      }
      return;
    }
    if (focus === 'guards') {
      const tr = first('treg'), md = first('mdsc'), tam = first('tam');
      if (tr) callout('Regulatory T cell', posOf(tr), { r: tr.r });
      if (md) callout('MDSC', posOf(md), { r: md.r });
      if (tam) callout('Tumor-associated\nmacrophage', posOf(tam), { r: tam.r * 0.8 });
      return;
    }
    if (focus === 'walls') {
      const layers = LAYER_M.map((mm) => mm[m]).lastIndexOf(1);
      const Rw = LAYERS_R[Math.max(0, layers)];
      callout('Cancer-associated\nfibroblasts', S.G.P(-120, Rw), { a: -120 });
      callout('Collagen', S.G.P(-30, Rw - 10), { a: -32, cls: 't-small' });
      callout('TGF-β', S.G.P(150, Rw - 4), { a: 150, cls: 't-small' });
      return;
    }
    if (focus === 'air') {
      label(S.lLabels, 'Low oxygen', C.x, C.y + 5, { cls: 't-label' });
      callout('Lactate · adenosine', S.G.P(-60, 70), { a: -62, cls: 't-small' });
      callout('TGF-β', S.G.P(150, 190), { a: 150, cls: 't-small' });
    }
  }

  // ---- poisoned air overlays (built once per scene; shown by CSS when focus = air)
  function buildAir() {
    const { C, k } = S.G;
    const g = S.lAir;
    const grad = sceneGrad([[0, '#1A0B2E', 0.72], [0.55, '#2A1446', 0.42], [1, '#2A1446', 0]]);
    mk('ellipse', { cx: C.x, cy: C.y, rx: f(128 * k * S.L.sq[0]), ry: f(128 * k * S.L.sq[1]), fill: grad }, g);
    const dots = mk('g', {}, g);
    const rnd = ctx.random(5);
    for (let i = 0; i < 26; i++) {
      const a = rnd.range(0, Math.PI * 2), rr = Math.sqrt(rnd()) * 112 * k;
      mk('circle', { cx: f(C.x + Math.cos(a) * rr), cy: f(C.y + Math.sin(a) * rr * 0.95), r: f(rnd.range(1.4, 2.3) * Math.max(0.85, k)), fill: '#EDE6F7', opacity: f(rnd.range(0.5, 0.85)) }, dots);
    }
    if (!ctx.reducedMotion) sceneAmb.push(ctx.ambient(gsap.to(dots.children, { x: 'random(-6, 6)', y: 'random(-6, 6)', duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: { each: 0.08, from: 'random' } })));
  }

  // ---- taps on cells
  function actorFrom(node) {
    const w = node.closest?.('[data-kind]');
    if (!w || !S) return null;
    if (w.getAttribute('data-kind') === 'fibro') return { kind: 'fibro', wrap: w, layer: true };
    return S.actors.find((A) => A.wrap === w) || null;
  }
  function pick(A) {
    if (!A) return;
    if (focus) { chips.set(null); focus = null; svg.removeAttribute('data-focus'); }
    picked = A;
    const W = WHO[A.kind] || WHO.cancer;
    card.show({ kicker: W.full || 'In this tumor', title: W.name, body: `<p>${W.role}</p>`, scroll: compact });
    drawLabels();
    ctx.announce(`${W.name}: ${W.role}`);
  }
  function clearPick(redraw = true) {
    picked = null;
    if (redraw) drawLabels();
  }
  function pickLabel(A) {
    const W = WHO[A.kind] || WHO.cancer;
    if (A.layer) {
      const p = S.G.P(-120, 172);
      callout(W.name, p, { a: -120 });
      return;
    }
    const p = posOf(A);
    const r = (A.r || 14) + 5 * S.G.k;
    const g = mk('g', {}, S.lLabels);
    mk('circle', { cx: f(p.x), cy: f(p.y), r: f(r), fill: 'none', stroke: 'rgb(233 236 246 / 0.85)', 'stroke-width': 1.3, 'stroke-dasharray': '3 3' }, g);
    callout(W.name, p, { r });
  }
  ctx.on(svg, 'click', (e) => { const A = actorFrom(e.target); if (A) pick(A); });
  ctx.on(svg, 'keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const A = actorFrom(e.target);
    if (A) { e.preventDefault(); pick(A); }
  });
  /** One keyboard stop per kind of visible cell. */
  function syncTabStops() {
    if (!S) return;
    const seen = new Set();
    const wraps = [...S.actors.map((A) => ({ A, w: A.wrap })), ...S.fibroLayers.map((F) => ({ A: { kind: 'fibro', m: F.m }, w: F.g }))];
    for (const { A, w } of wraps) {
      const vis = A.kind === 'fibro' ? !!A.m[MODES.indexOf(mode)] : visibleNow(A);
      const kind = A.kind === 'hider' ? 'cancer-h' : A.kind;
      if (vis && !seen.has(kind)) {
        seen.add(kind);
        const W = WHO[A.kind] || WHO.cancer;
        w.setAttribute('tabindex', '0');
        w.setAttribute('role', 'button');
        w.setAttribute('aria-label', `${W.name}: show details`);
      } else {
        w.removeAttribute('tabindex');
        w.removeAttribute('role');
        w.removeAttribute('aria-label');
      }
    }
  }

  // ================================================================ controls + captions
  function paintControls() {
    if (!drugRan) setKilled(0);
    drugBtn.disabled = drugRan;
    drugBtn.label = drugRan ? 'PD-1 blocker added' : 'Add a PD-1 blocker';
    resetBtn.disabled = !drugRan;
    badgeBox.innerHTML = drugRan ? ctx.ui.badgeHTML(OUTCOME[mode].kind, OUTCOME[mode].label) : '';
    const m = MODES.indexOf(mode);
    const ci = drugRan ? 3 + m : m;
    capEls.forEach((el, i) => el.classList.toggle('is-on', i === ci));
    if (capShown !== -1 && capShown !== ci) capLive.textContent = capEls[ci].textContent;
    capShown = ci;
  }

  // ================================================================ mount
  const fullBuild = () => { player.finish(); build(); };
  ctx.onResize(({ compact: c }) => {
    if (c === compact && S) return;
    compact = c;
    picked = null;
    drugRan = false;
    fullBuild();
    if (focus) svg.setAttribute('data-focus', focus);
    paintControls();
  });
  if (!S) fullBuild();
  paintControls();

  return {
    destroy() { player.finish(); stopAmbient(); killAll(sceneAmb); stopBreath(); },
  };
}
