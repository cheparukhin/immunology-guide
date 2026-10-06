// ch09-humanization — "From mouse to human, one part at a time" (Chapter 9). Build task F9.
//
// One idea: the grip lives in six tiny loops at each arm tip; everything else is a swappable frame.
// One drug antibody (library antibody(), 12 domains, white outline) grips one target on a strip of
// cancer-cell membrane with its right tip; a permanent magnifier shows the six loops closing around
// the target head. A 4-stop slider (also four buttons) swaps mouse parts (slate + hatch, library
// origin:'mouse') for human ones by sweeping gold up from the stem; the grip never changes, fewer
// anti-drug antibodies (natural antibodies, gold, no outline) stick, and the name chip updates.
import { antibody, antibodyTips, antigen, cancerCell, cellInfo, rayHit, PALETTE, mix } from '../art/index.js';

const ID = 'ch09-humanization';
const DEG = Math.PI / 180;
const WHITE = '#FFFFFF';
const r2 = (v) => Math.round(v * 100) / 100;
const dirv = (a) => [Math.cos(a * DEG), Math.sin(a * DEG)];
const angOf = (dx, dy) => Math.atan2(dy, dx) / DEG;
const SLATE = PALETTE.mouse;

const STATES = [
  { id: 'mouse', label: 'Mouse', year: '1986', origin: 'mouse', name: ['ibritum', 'o', 'mab'], drug: 'ibritumomab',
    reaction: { word: 'High', pct: 90 } },
  { id: 'chimeric', label: 'Chimeric', year: '1994', origin: 'chimeric', name: ['ritu', 'xi', 'mab'], drug: 'rituximab',
    reaction: { word: 'Lower', pct: 52 } },
  { id: 'humanized', label: 'Humanized', year: '1997', origin: 'humanized', name: ['trastu', 'zu', 'mab'], drug: 'trastuzumab',
    reaction: { word: 'Low', pct: 20 } },
  { id: 'human', label: 'Fully human', year: '2002', origin: 'human', name: ['daratum', 'u', 'mab'], drug: 'daratumumab',
    reaction: { word: 'Low', pct: 20 } },
];
const KEY = [['o', 'mouse'], ['xi', 'chimeric'], ['zu', 'humanized'], ['u', 'human']];

// Where anti-drug antibodies stick, per state (ids of SITES below). Mostly on mouse-rendered parts.
const ADA_SETS = [
  ['tipL', 'vlL', 'fcL2', 'ch1R', 'vhL', 'fcR3', 'clL', 'vhR', 'fcL3', 'fcR2'],    // mouse: ~10, all over
  ['tipL', 'vlL', 'vhL', 'vhR'],                                                   // chimeric: 4, on the arm tips
  ['tipL', 'tipL2'],                                                               // humanized: 1–2, at the loops
  ['tipL'],                                                                        // fully human: now and then one
];

const CSS = `
[data-figure="${ID}"] .hz-panel { font-family: var(--font-ui); color: var(--ink-2); }
[data-figure="${ID}"] .hz-name { margin: 0; font-family: var(--font-display); font-variation-settings: var(--fraunces-soft);
  font-size: 1.85rem; line-height: 1.15; font-weight: 480; color: var(--ink); letter-spacing: 0.005em; }
[data-figure="${ID}"] .hz-name .dot { color: var(--ink-3); padding: 0 0.04em; }
[data-figure="${ID}"] .hz-name strong { font-weight: 760; text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: 0.16em; color: var(--ink); }
[data-figure="${ID}"] .hz-key { margin: 0.45rem 0 0; font-size: var(--text-xs); line-height: 1.5; color: var(--ink-3); }
[data-figure="${ID}"] .hz-key b { color: var(--ink); font-weight: 650; }
[data-figure="${ID}"] .hz-foot { margin: 0.35rem 0 0; font-size: var(--text-2xs); line-height: 1.45; color: var(--ink-3); }
[data-figure="${ID}"] .hz-meter { margin-top: 0.95rem; }
[data-figure="${ID}"] .hz-meter__head { display: flex; justify-content: space-between; gap: 0.6rem; align-items: baseline;
  font-size: var(--text-xs); font-weight: 560; color: var(--ink-2); }
[data-figure="${ID}"] .hz-meter__word { font-weight: 680; color: var(--ink); white-space: nowrap; }
[data-figure="${ID}"] .hz-meter__track { position: relative; height: 0.5rem; margin-top: 0.35rem; border-radius: 999px; background: var(--rule); overflow: hidden; }
[data-figure="${ID}"] .hz-meter__fill { position: absolute; inset: 0 auto 0 0; border-radius: inherit; transition: width var(--dur-4) var(--ease-in-out); }
[data-figure="${ID}"] .hz-meter--grip .hz-meter__fill { background: var(--c-antibody-deep, #B98320); }
[data-figure="${ID}"] .hz-meter--react .hz-meter__fill { background: var(--c-inhibit-deep, #C23B40); }
:root[data-theme="dark"] [data-figure="${ID}"] .hz-meter--grip .hz-meter__fill { background: var(--c-antibody); }
:root[data-theme="dark"] [data-figure="${ID}"] .hz-meter--react .hz-meter__fill { background: var(--c-inhibit); }
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) [data-figure="${ID}"] .hz-meter--grip .hz-meter__fill { background: var(--c-antibody); }
  :root:not([data-theme="light"]) [data-figure="${ID}"] .hz-meter--react .hz-meter__fill { background: var(--c-inhibit); } }
[data-figure="${ID}"] .hz-tag { display: inline-block; margin-top: 0.85rem; font-size: var(--text-2xs); font-weight: 650; letter-spacing: var(--tracking-caps); text-transform: uppercase; color: var(--ink-3); }
[data-figure="${ID}"] .hz-panel.is-fresh { animation: hz-in var(--dur-4) var(--ease-out); }
@keyframes hz-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
[data-figure="${ID}"] .hz-ctl { flex: 1 1 100%; min-width: 0; font-family: var(--font-ui); }
[data-figure="${ID}"] .hz-ctl .slider { --thumb: 1.25rem; width: 100%; }
[data-figure="${ID}"] .hz-ctl .slider__input { width: calc(75% + var(--thumb)); margin-left: calc(12.5% - var(--thumb) / 2); }
[data-figure="${ID}"] .hz-stops { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0.35rem; margin-top: 0.15rem; }
[data-figure="${ID}"] .hz-stop { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.05rem; min-height: 2.9rem;
  padding: 0.3rem 0.2rem; border: 1px solid transparent; border-radius: var(--r-md); background: transparent; color: var(--ink-2);
  font: inherit; cursor: pointer; -webkit-tap-highlight-color: transparent; transition: background-color var(--dur-1), border-color var(--dur-1), color var(--dur-1); }
[data-figure="${ID}"] .hz-stop:hover { background: var(--paper-3); color: var(--ink); }
[data-figure="${ID}"] .hz-stop[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); color: var(--ink); }
[data-figure="${ID}"] .hz-stop:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
[data-figure="${ID}"] .hz-stop__name { font-size: var(--text-xs); font-weight: 620; line-height: 1.2; text-align: center; }
[data-figure="${ID}"] .hz-stop__year { font-size: var(--text-2xs); font-variant-numeric: tabular-nums; color: var(--ink-3); }
[data-figure="${ID}"] .hz-note { margin: 0.45rem 0 0; font-size: var(--text-2xs); line-height: 1.45; color: var(--ink-3); text-align: center; }
`;
function injectCSS() {
  if (document.getElementById(`${ID}-css`)) return;
  const s = document.createElement('style');
  s.id = `${ID}-css`;
  s.textContent = CSS;
  document.head.append(s);
}

export default function mount(fig, ctx) {
  injectCSS();
  const gsap = ctx.gsap;
  const S = (tag, attrs, parent) => ctx.svg(tag, attrs, parent);

  let state = 0;
  let compact = ctx.compact;
  let revealed = false;           // name chip + meters fade in on the first slider move
  let G = null;                   // current geometry + layers
  const live = [];                // running tweens (killed on re-render / state jumps)

  ctx.setAspect(16 / 9, 360 / 540);
  ctx.tag('Illustrative');
  ctx.tag('Not to scale');
  const svg = ctx.createSVG({ viewBox: '0 0 960 540' });

  // ------------------------------------------------------------------ panel (name chip + meters)
  const card = ctx.ui.infoCard({ empty: 'Move the slider to swap the mouse parts for human ones.', closable: false });
  const panel = ctx.h('div', { class: 'hz-panel' });
  const nameEl = ctx.h('p', { class: 'hz-name', 'aria-live': 'off' });
  const keyEl = ctx.h('p', { class: 'hz-key' });
  const foot = ctx.h('p', { class: 'hz-foot', html: 'Names chosen since 2017 drop these letters. See “Go deeper” below.' });
  const meter = (cls, label) => {
    const word = ctx.h('span', { class: 'hz-meter__word' });
    const fill = ctx.h('span', { class: 'hz-meter__fill' });
    const el = ctx.h('div', { class: `hz-meter ${cls}` },
      ctx.h('div', { class: 'hz-meter__head' }, ctx.h('span', null, label), word),
      ctx.h('div', { class: 'hz-meter__track', 'aria-hidden': 'true' }, fill));
    return { el, word, fill };
  };
  const grip = meter('hz-meter--grip', 'Binding to the target');
  const react = meter('hz-meter--react', 'Patient’s immune reaction against the drug');
  panel.append(nameEl, keyEl, foot, grip.el, react.el, ctx.h('span', { class: 'hz-tag' }, 'Illustrative, not measured'));

  function paintPanel() {
    const st = STATES[state];
    nameEl.innerHTML = `<span>${st.name[0]}</span><span class="dot">·</span><strong>${st.name[1]}</strong><span class="dot">·</span><span>${st.name[2]}</span>`;
    nameEl.setAttribute('aria-label', `${st.drug}: the letters ${st.name[1]} mark a ${st.id === 'human' ? 'fully human' : st.id} antibody`);
    keyEl.innerHTML = KEY.map(([k, w], i) => `<span style="white-space:nowrap">${i === state ? `<b>-${k}- ${w}</b>` : `-${k}- ${w}`}</span>`).join(' · ');
    grip.word.textContent = 'Full';
    grip.fill.style.width = '100%';
    react.word.textContent = st.reaction.word;
    react.fill.style.width = `${st.reaction.pct}%`;
  }

  // ------------------------------------------------------------------ slider: 4 stops, also 4 buttons
  const ctl = ctx.h('div', { class: 'hz-ctl' });
  ctx.controls.append(ctl);
  const slider = ctx.ui.slider({
    label: 'Source of the antibody’s parts', min: 0, max: 3, step: 1, value: 0, parent: ctl,
    format: (v) => STATES[v].label, describe: (v) => `${STATES[v].label} antibody, ${STATES[v].drug}`,
    onInput: (v) => setState(v),
  });
  const stops = ctx.h('div', { class: 'hz-stops', role: 'group', 'aria-label': 'Antibody types' });
  const stopBtns = STATES.map((st, i) => {
    const b = ctx.h('button', { type: 'button', class: 'hz-stop', 'aria-pressed': String(i === 0), onClick: () => { slider.set(i); setState(i); } },
      ctx.h('span', { class: 'hz-stop__name' }, st.label), ctx.h('span', { class: 'hz-stop__year' }, st.year));
    stops.append(b);
    return b;
  });
  ctl.append(stops, ctx.h('p', { class: 'hz-note' }, 'Year of the first US approval of this kind of antibody, for any disease.'));

  // captions: the writer's four captions, one per stop
  const capWrap = ctx.h('div', { class: 'fig__steps' });
  const capEls = STATES.map((_, i) => {
    const c = ctx.h('div', { class: 'fig__step', 'aria-hidden': 'true' }, ctx.h('p', { class: 'fig__step-text', html: ctx.steps[i]?.html || '' }));
    capWrap.append(c);
    return c;
  });
  ctx.caption.prepend(capWrap);
  const syncCaption = () => capEls.forEach((c, k) => { c.classList.toggle('is-active', k === state); c.setAttribute('aria-hidden', String(k !== state)); });

  // ------------------------------------------------------------------ geometry
  function layout() {
    return compact
      ? { vb: [360, 540], u: 210, base: [150, 476], s: 76, lens: [298, 374, 54], ring: 0.52, cellR: 230, ada: 44,
        lab: { tip: [122, 240, 'start'], stem: [100, 440, 'end'], ada: [8, 190, 'start'] }, cap: [354, 450, 'end'] }
      : { vb: [960, 540], u: 318, base: [300, 504], s: 104, lens: [712, 292, 108], ring: 0.52, cellR: 300, ada: 62,
        lab: { tip: [250, 150, 'middle'], stem: [204, 470, 'end'], ada: [22, 116, 'start'] }, cap: [712, 426, 'middle'] };
  }
  /** Arm geometry in the antibody's own (base-anchored) frame — mirrors the library's antibody(). */
  function armGeom(u) {
    const hingeY = -0.47 * u, ang = 36 * DEG, La = 0.56 * u;
    const arm = (s) => {
      const d = [s * Math.sin(ang), -Math.cos(ang)], p = [s * Math.cos(ang), Math.sin(ang)];
      const ox = s * 0.035 * u, oy = hingeY - 0.015 * u;
      return { s, d, p, at: (t, off) => [ox + d[0] * La * t + p[0] * off, oy + d[1] * La * t + p[1] * off] };
    };
    return { L: arm(-1), R: arm(1) };
  }
  /** Anti-drug-antibody binding sites: [x, y] in the drug frame + outward normal (deg). */
  function sites(u) {
    const A = armGeom(u);
    const nOut = (a) => angOf(a.p[0], a.p[1]);
    const nIn = (a) => angOf(-a.p[0], -a.p[1]);
    const nTip = (a) => angOf(a.d[0], a.d[1]);
    return {
      fcL3: { p: [-0.122 * u, -0.12 * u], n: 180 }, fcL2: { p: [-0.122 * u, -0.33 * u], n: 180 },
      fcR3: { p: [0.122 * u, -0.12 * u], n: 0 }, fcR2: { p: [0.122 * u, -0.33 * u], n: 0 },
      clL: { p: A.L.at(0.34, 0.144 * u), n: nOut(A.L) }, vlL: { p: A.L.at(0.8, 0.144 * u), n: nOut(A.L) },
      vhL: { p: A.L.at(0.84, -0.076 * u), n: nIn(A.L) },
      tipL: { p: A.L.at(1.07, 0.1 * u), n: nTip(A.L) - (compact ? 8 : 40) }, tipL2: { p: A.L.at(1.07, -0.045 * u), n: nTip(A.L) + 45 },
      ch1R: { p: A.R.at(0.3, -0.076 * u), n: nIn(A.R) }, vhR: { p: A.R.at(0.74, -0.076 * u), n: nIn(A.R) },
    };
  }
  /** Pose that caps point P (outward normal n) with one arm tip of an antibody of size a (dockAntibody math). */
  function capPose(a, P, n, arm = 'right') {
    const t = antibodyTips(a)[arm];
    const hx = 0.035 * a * (arm === 'left' ? -1 : 1), hy = -0.485 * a;
    const alpha = angOf(t[0] - hx, t[1] - hy);
    const psi = n + 180 - alpha;
    const c = Math.cos(psi * DEG), s = Math.sin(psi * DEG);
    return { x: P[0] - (c * t[0] - s * t[1]), y: P[1] - (s * t[0] + c * t[1]), r: psi };
  }

  // ------------------------------------------------------------------ drawing
  function drugLayer(parent, u, st, { lens = false } = {}) {
    const g = S('g', {}, parent);
    const a = antibody({ size: u, detail: 'high', variant: 'therapeutic', origin: STATES[st].origin, stage: 'dark' });
    g.append(a);
    if (lens) {
      // inside the magnifier: the six loops are drawn in detail instead of the CDR arc, and the
      // drug's white outline (a whole-molecule cue) would only fill the lens with white
      for (const sel of ['[data-part="cdr"]', '[data-part="highlight"]']) a.querySelector(sel)?.setAttribute('opacity', '0');
    }
    if (STATES[st].id === 'humanized') specks(g, u, lens);
    return g;
  }
  /** Humanized: a few mouse "building blocks" in the frame right next to the loops. */
  function specks(g, u, lens) {
    const A = armGeom(u);
    const r = lens ? 0.011 * u : Math.max(2, 0.011 * u);
    for (const arm of [A.L, A.R]) {
      for (const [t, off] of [[0.9, 0.0], [0.86, 0.1 * u], [0.93, 0.05 * u]]) {
        const [x, y] = arm.at(t, off);
        S('circle', { cx: r2(x), cy: r2(y), r: r2(r), fill: SLATE, stroke: mix(SLATE, '#0B1024', 0.35), strokeWidth: r2(Math.max(0.6, r * 0.3)) }, g);
        if (lens) S('path', { d: `M${r2(x - r * 0.6)} ${r2(y + r * 0.6)}L${r2(x + r * 0.6)} ${r2(y - r * 0.6)}`, stroke: mix(SLATE, '#0B1024', 0.5), strokeWidth: r2(r * 0.22), strokeLinecap: 'round' }, g);
      }
    }
  }
  /** The six loops (three on the heavy chain's tip, three on the light chain's), in lens units:
   *  fingers from the two variable-domain ends that close around the near half of the target head. */
  function loops(parent, u, st, map, headC, headR) {
    const A = armGeom(u);
    const g = S('g', {}, parent);
    const mouse = STATES[st].origin !== 'human';
    const col = mouse ? mix(SLATE, WHITE, 0.12) : mix(PALETTE.antibody, WHITE, 0.3);
    const rim = mouse ? mix(SLATE, '#0B1024', 0.5) : mix(PALETTE.antibody, '#2A1D05', 0.55);
    const hw = 0.054 * u;
    const d = A.R.d;
    const back = angOf(-d[0], -d[1]);                      // from the head back toward the antibody
    const ends = [map(A.R.at(0.97, -0.02 * u)), map(A.R.at(0.97, 0.088 * u))];   // VH end, VL end (cap centres)
    const w = Math.max(4, 0.026 * hw * 10);
    // VH lies on the arm's inner side (−p), VL on the outer side (+p)
    const sides = [[22, 52, 82], [-22, -52, -82]];
    ends.forEach((E, k) => {
      sides[k].forEach((off, j) => {
        const qa = (back + off) * DEG;
        const Q = [headC[0] + Math.cos(qa) * (headR + w * 0.15), headC[1] + Math.sin(qa) * (headR + w * 0.15)];
        const vx = Q[0] - E[0], vy = Q[1] - E[1], dd = Math.hypot(vx, vy) || 1;
        const B = [E[0] + (vx / dd) * hw * 0.88, E[1] + (vy / dd) * hw * 0.88];
        const bend = (k === 0 ? 1 : -1) * (0.35 + 0.12 * j);
        const mx = (B[0] + Q[0]) / 2 + (-(Q[1] - B[1])) * bend * 0.5, my = (B[1] + Q[1]) / 2 + (Q[0] - B[0]) * bend * 0.5;
        const path = `M${r2(B[0])} ${r2(B[1])}Q${r2(mx)} ${r2(my)} ${r2(Q[0])} ${r2(Q[1])}`;
        S('path', { d: path, stroke: rim, strokeWidth: r2(w + 3), strokeLinecap: 'round', fill: 'none' }, g);
        S('path', { d: path, stroke: col, strokeWidth: r2(w), strokeLinecap: 'round', fill: 'none' }, g);
        if (mouse) S('path', { d: path, stroke: rim, strokeWidth: r2(w * 0.24), strokeLinecap: 'round', strokeDasharray: `${r2(w * 0.22)} ${r2(w * 0.62)}`, fill: 'none' }, g);
      });
    });
    return g;
  }

  function label(parent, { x, y, text, anchor = 'start', to = null, cls = 't-label' }) {
    const g = S('g', {}, parent);
    if (to) {
      const sx = anchor === 'end' ? x + 5 : anchor === 'start' ? x - 5 : x;
      const sy = anchor === 'middle' ? (to[1] > y ? y + 6 : y - 19) : y - 5;
      S('line', { class: 'leader', x1: r2(sx), y1: r2(sy), x2: r2(to[0]), y2: r2(to[1]) }, g);
      S('circle', { class: 'leader-dot', cx: r2(to[0]), cy: r2(to[1]), r: 2.4 }, g);
    }
    S('text', { class: `${cls} t-halo${anchor === 'middle' ? ' t-mid' : anchor === 'end' ? ' t-end' : ''}`, x: r2(x), y: r2(y), text }, g);
    return g;
  }

  function draw() {
    live.forEach((t) => t.kill());
    live.length = 0;
    for (const n of [...svg.children]) if (n !== svg.defs) n.remove();
    const L = layout();
    svg.setAttribute('viewBox', `0 0 ${L.vb[0]} ${L.vb[1]}`);
    const { u, s } = L;
    const [bx, by] = L.base;
    const W = (p) => [bx + p[0], by + p[1]];
    const A = armGeom(u);
    const tipR = W(antibodyTips(u).right);
    const dR = A.R.d;
    const axisOut = angOf(-dR[0], -dR[1]);                  // the target's "up": toward the antibody
    const agBase = [tipR[0] + dR[0] * 0.96 * s, tipR[1] + dR[1] * 0.96 * s];
    const rot = axisOut + 90;
    const [lx, ly, lr] = L.lens;
    const ringR = L.ring * s;
    const k = lr / ringR;                                     // magnification: the ring is exactly what the lens shows
    const F = [tipR[0] + dR[0] * 0.08 * s, tipR[1] + dR[1] * 0.08 * s];   // focus: the grip

    // a large library cancer cell at the upper right; its edge curves away from the magnifier
    const cellG = S('g', {}, svg);
    const cArt = cancerCell({ r: L.cellR, seed: 17, mhc: false, glow: false, stage: 'dark' });
    const th = axisOut * DEG;
    const hit = rayHit(cellInfo(cArt).outline, th);
    const rHit = Math.hypot(hit.x, hit.y);
    const cc = [agBase[0] - Math.cos(th) * rHit, agBase[1] - Math.sin(th) * rHit];
    const cw = S('g', { transform: `translate(${r2(cc[0])} ${r2(cc[1])})` }, cellG);
    cw.append(cArt);
    const ag = antigen({ size: s, shape: 'circle', stage: 'dark' });
    S('g', { transform: `translate(${r2(agBase[0])} ${r2(agBase[1])}) rotate(${r2(rot)})` }, cellG).append(ag);

    // connector lines run UNDER the antibody (outer tangents between the ring and the lens)
    const lensLines = S('g', {}, svg);
    const ddx = lx - F[0], ddy = ly - F[1], dist = Math.hypot(ddx, ddy);
    const phi = Math.atan2(ddy, ddx), beta = Math.asin(Math.min(0.98, (lr - ringR) / dist));
    for (const sgn of [-1, 1]) {
      const nx = Math.cos(phi + sgn * (Math.PI / 2 + beta)), ny = Math.sin(phi + sgn * (Math.PI / 2 + beta));
      S('line', { x1: r2(F[0] + nx * ringR), y1: r2(F[1] + ny * ringR), x2: r2(lx + nx * lr), y2: r2(ly + ny * lr), stroke: 'rgba(233,236,246,0.4)', strokeWidth: 1, vectorEffect: 'non-scaling-stroke' }, lensLines);
    }

    // the drug (two layers during a sweep: old under, new revealed from the stem up)
    const drugG = S('g', { transform: `translate(${bx} ${by})` }, svg);
    const cur = drugLayer(drugG, u, state);
    const clipId = `${ID}-sweep-${Math.random().toString(36).slice(2, 8)}`;
    const clip = S('clipPath', { id: clipId, clipPathUnits: 'userSpaceOnUse' }, svg.defs);
    const clipRect = S('rect', { x: -0.7 * u, y: 0.1 * u, width: 1.4 * u, height: 0 }, clip);

    // anti-drug antibodies layer
    const adaG = S('g', {}, svg);

    // magnifier: ring around the grip + lens
    const lensG = S('g', {}, svg);
    const map = (p) => [lx + k * (p[0] - F[0]), ly + k * (p[1] - F[1])];         // world → lens
    S('circle', { cx: r2(F[0]), cy: r2(F[1]), r: r2(ringR), fill: 'none', stroke: 'rgba(233,236,246,0.6)', strokeWidth: 1.2, vectorEffect: 'non-scaling-stroke' }, lensG);
    const lclip = `${ID}-lens-${Math.random().toString(36).slice(2, 8)}`;
    const lc = S('clipPath', { id: lclip }, svg.defs);
    S('circle', { cx: lx, cy: ly, r: lr }, lc);
    S('circle', { cx: lx, cy: ly, r: lr, fill: '#0D1330', 'fill-opacity': 0.96 }, lensG);
    const lensIn = S('g', { 'clip-path': `url(#${lclip})` }, lensG);
    const lagb = map(agBase);
    S('g', { transform: `translate(${r2(lagb[0])} ${r2(lagb[1])}) rotate(${r2(rot)})` }, lensIn).append(antigen({ size: s * k, shape: 'circle', stage: 'dark' }));
    const lbase = map([bx, by]);
    const lDrug = S('g', { transform: `translate(${r2(lbase[0])} ${r2(lbase[1])})` }, lensIn);
    const lCur = drugLayer(lDrug, u * k, state, { lens: true });
    const headC = map([tipR[0] + dR[0] * 0.22 * s, tipR[1] + dR[1] * 0.22 * s]);
    const headR = 0.22 * s * k;
    const loopG = S('g', {}, lensIn);
    loops(loopG, u * k, state, (p) => [lbase[0] + p[0], lbase[1] + p[1]], headC, headR);
    S('circle', { cx: lx, cy: ly, r: lr, fill: 'none', stroke: 'rgba(233,236,246,0.72)', strokeWidth: 1.6, vectorEffect: 'non-scaling-stroke' }, lensG);
    if (compact) {
      const t = S('text', { class: 't-small t-mid', x: lx, y: ly + lr + 20 }, lensG);
      S('tspan', { x: lx, dy: 0, text: 'six CDR loops' }, t);
      S('tspan', { x: lx, dy: 16, text: 'contact the target' }, t);
    } else S('text', { class: 't-small t-mid', x: L.cap[0], y: L.cap[1], text: 'six CDR loops contact the target' }, lensG);

    // labels (only "variable region" — "Fab arm" on phones, where the longer term would hit the target label — and "Fc region")
    const labG = S('g', {}, svg);
    const tipL = W(A.L.at(0.96, 0.03 * u));
    label(labG, { x: L.lab.tip[0], y: L.lab.tip[1], text: compact ? 'Fab arm' : 'variable region', anchor: L.lab.tip[2], to: compact ? [tipL[0] + 6, tipL[1] - 2] : [tipL[0] + 8, tipL[1] - 2] });
    const stemP = W([-0.07 * u, -0.2 * u]);
    label(labG, { x: L.lab.stem[0], y: L.lab.stem[1], text: 'Fc region', anchor: L.lab.stem[2], to: [stemP[0], stemP[1]] });
    const cl = [cc[0] + Math.cos(th) * rHit * 0.62, cc[1] + Math.sin(th) * rHit * 0.62];
    label(labG, compact ? { x: 352, y: Math.max(64, cl[1] - 40), text: 'Cancer cell', anchor: 'end', cls: 't-small' }
      : { x: cl[0] + 60, y: cl[1] - 10, text: 'Cancer cell', anchor: 'middle', cls: 't-small' });
    const agMid = [agBase[0] - dR[0] * 0.45 * s, agBase[1] - dR[1] * 0.45 * s];
    label(labG, compact ? { x: agMid[0] - 18, y: agMid[1] - 8, text: 'target', anchor: 'end', cls: 't-small', to: [agMid[0] - 3, agMid[1] - 2] }
      : { x: 586, y: 252, text: 'target', anchor: 'start', cls: 't-small', to: [agMid[0] + 6, agMid[1] + 2] });

    const adaLabG = S('g', {}, svg);
    G = { L, u, k, A, W, adaLabG, drugG, cur, clip, clipId, clipRect, adaG, lDrug, lCur, loopG, headC, headR, lbase, sitesMap: sites(u), ada: new Map() };
    placeADAs(state, { instant: true });
  }

  // ------------------------------------------------------------------ anti-drug antibodies
  function makeADA(id) {
    const { L, W, sitesMap } = G;
    const site = sitesMap[id];
    const a = L.ada;
    const P = W(site.p);
    const arm = id.length % 2 ? 'left' : 'right';
    const pose = capPose(a, P, site.n, arm);
    const g = S('g', {}, G.adaG);
    const inner = S('g', {}, g);
    inner.append(antibody({ size: a, detail: 'high', variant: 'generic', stage: 'dark' }));
    const out = dirv(site.n), perp = [-out[1], out[0]];
    const from = { x: pose.x + out[0] * a * 1.9 + perp[0] * a * 0.6, y: pose.y + out[1] * a * 1.9 + perp[1] * a * 0.6, r: pose.r - 26 };
    const rec = { id, g, inner, pose, from, P, n: site.n, a, arm };
    if (id === 'tipL') {
      const fc = [pose.x, pose.y];
      const at = L.lab.ada || [fc[0] - 8, fc[1] - 40, 'middle'];
      rec.label = label(G.adaLabG, { x: at[0], y: at[1], text: 'anti-drug antibody', anchor: at[2], cls: 't-small', to: [fc[0], fc[1] + (L.lab.ada ? 3 : -3)] });
    }
    return rec;
  }
  const poseAttr = (p) => `translate(${r2(p.x)} ${r2(p.y)}) rotate(${r2(p.r)})`;

  function placeADAs(st, { instant = false } = {}) {
    const want = ADA_SETS[st];
    const rm = instant || ctx.reducedMotion;
    // leaving: drift off along the normal and fade
    for (const [id, rec] of [...G.ada]) {
      if (want.includes(id)) continue;
      G.ada.delete(id);
      if (rm) { rec.g.remove(); rec.label?.remove(); continue; }
      const off = dirv(rec.n);
      const to = { x: rec.pose.x + off[0] * rec.a * 1.4, y: rec.pose.y + off[1] * rec.a * 1.4, r: rec.pose.r + 18 };
      const proxy = { p: 0 };
      live.push(gsap.to(proxy, { p: 1, duration: 0.9, ease: 'so.in', delay: 0.15 + Math.random() * 0.25,
        onUpdate: () => { const q = proxy.p; rec.inner.setAttribute('transform', poseAttr({ x: rec.pose.x + (to.x - rec.pose.x) * q, y: rec.pose.y + (to.y - rec.pose.y) * q, r: rec.pose.r + (to.r - rec.pose.r) * q })); rec.g.setAttribute('opacity', String(r2(1 - q))); },
        onComplete: () => rec.g.remove() }));
      if (rec.label) rec.label.remove();
    }
    // arriving: drift in from the fluid (left side), cap a site with one tip, stem away
    let i = 0;
    const span = st === 0 ? 2.8 : 1.2;
    const lead = st === 3 ? 1.4 : 0.35;
    for (const id of want) {
      if (G.ada.has(id)) continue;
      const rec = makeADA(id);
      G.ada.set(id, rec);
      if (rm) {
        rec.inner.setAttribute('transform', poseAttr(rec.pose));
        continue;
      }
      const delay = lead + (want.length > 1 ? (i / (want.length - 1)) * span : 0);
      i++;
      rec.inner.setAttribute('transform', poseAttr(rec.from));
      rec.g.setAttribute('opacity', '0');
      if (rec.label) rec.label.setAttribute('opacity', '0');
      const proxy = { p: 0 };
      live.push(gsap.to(proxy, { p: 1, duration: 1.5, ease: 'so.out', delay,
        onUpdate: () => {
          const q = proxy.p, f = rec.from, p = rec.pose;
          rec.inner.setAttribute('transform', poseAttr({ x: f.x + (p.x - f.x) * q, y: f.y + (p.y - f.y) * q, r: f.r + (p.r - f.r) * q }));
          rec.g.setAttribute('opacity', String(r2(Math.min(1, q * 3))));
          if (rec.label) rec.label.setAttribute('opacity', String(r2(Math.max(0, (q - 0.75) * 4))));
        } }));
    }
  }

  // ------------------------------------------------------------------ state changes
  function sweep(next) {
    const { u, drugG, clipId, clipRect, lDrug } = G;
    const old = G.cur, oldL = G.lCur, oldLoops = G.loopG.firstElementChild;
    const neu = drugLayer(drugG, u, next);
    const neuL = drugLayer(lDrug, u * G.k, next, { lens: true });
    const neuLoops = loops(G.loopG, u * G.k, next, (p) => [G.lbase[0] + p[0], G.lbase[1] + p[1]], G.headC, G.headR);
    G.cur = neu; G.lCur = neuL;
    const finish = () => { old.remove(); oldL.remove(); oldLoops?.remove(); neu.removeAttribute('clip-path'); neuL.removeAttribute('opacity'); neuLoops.removeAttribute('opacity'); };
    if (ctx.reducedMotion) { finish(); return; }
    neu.setAttribute('clip-path', `url(#${clipId})`);
    neuL.setAttribute('opacity', '0');
    neuLoops.setAttribute('opacity', '0');
    const top = -1.1 * u, bottom = 0.1 * u;
    const proxy = { p: 0 };
    live.push(gsap.to(proxy, { p: 1, duration: 0.85, ease: 'so.inOut',
      onUpdate: () => {
        const y = bottom + (top - bottom) * proxy.p;
        clipRect.setAttribute('y', r2(y));
        clipRect.setAttribute('height', r2(bottom - y));
        const q = Math.max(0, (proxy.p - 0.62) / 0.38);
        neuL.setAttribute('opacity', String(r2(q)));
        neuLoops.setAttribute('opacity', String(r2(q)));
      },
      onComplete: finish }));
  }

  function setState(v) {
    v = Math.max(0, Math.min(3, Math.round(v)));
    if (!revealed) {
      revealed = true;
      paintPanel();
      card.show({ kicker: 'Example drug', body: panel });
      panel.classList.add('is-fresh');
    }
    if (v === state) return;
    // finish any running sweep before starting the next one
    live.forEach((t) => t.progress(1));
    live.length = 0;
    state = v;
    stopBtns.forEach((b, i) => b.setAttribute('aria-pressed', String(i === v)));
    if (slider.value !== v) slider.set(v);
    paintPanel();
    syncCaption();
    sweep(v);
    placeADAs(v);
    ctx.announce(`${STATES[v].label}: ${STATES[v].drug}. ${ctx.steps[v]?.text || ''}`);
  }

  ctx.onResize(({ compact: c }) => {
    if (c === compact && G) return;
    compact = c;
    draw();
  });
  if (!G) draw();
  syncCaption();
  // the anti-drug antibodies arrive the first time the figure is seen (mouse: ~10 within 3 s)
  ctx.onceVisible(() => {
    if (ctx.reducedMotion || !G || state !== 0) return;
    for (const rec of G.ada.values()) { rec.g.remove(); rec.label?.remove(); }
    G.ada.clear();
    placeADAs(state);
  }, 0.4);

  return {
    pause() { live.forEach((t) => t.pause()); },
    resume() { live.forEach((t) => t.resume()); },
    destroy() { live.forEach((t) => t.kill()); },
  };
}
