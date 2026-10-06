// ch11-personal-vaccine — "Design a personal vaccine"
//
// A small design game on a dark stage, wrapped in the writer's four-step stepper:
//   1 Read the tumor   — the tumor family tree (trunk + branches B, C) and ~60 cancer cells
//                        animate in; eight candidate cards, ranked by predicted fit to this
//                        patient's HLA (tap a card to light up the cells that carry it).
//   2 Choose           — pick up to four; switch patient (same tumor, different HLA types:
//                        the fit bars change and the cards re-rank).
//   3 Make & test      — the picks slide onto one mRNA strand, which is wrapped in a fatty
//                        sphere; each picked card then shows whether T cells responded.
//   4 Months later     — killer T cells arrive; most cells carrying a recognized target die
//                        (a few survive), and any branch without one grows back.
//
// Stepper safety: the timeline only tweens plain proxies (intro, make, flip, arrive, kill,
// grow, outcome). One renderer draws everything from those proxies plus the reader's game
// state (patient, picks), which never changes inside steps 3–4 (cards lock there). With no
// picks, step 3 tests the four best-predicted fits (derived from the patient, not stored),
// so Back, dot jumps and reduced motion always land in the same state.
//
// Tree style: a local copy of ch06-clonal-evolution's createCloneTree() look (not exported):
// sand root "Original cell", a 9 px sand→violet TRUNK band labelled "TRUNK · in every cancer
// cell", rounded elbow links from a shared spine, lumpy hue-shifted branch nodes (B = clone 1
// + stripes, C = clone 2 + dots, as cancerCell({ clone }) tints them) with letters, faint
// passenger ticks. The candidate mutations sit on its edges as numbered discs.
//
// All numbers are the spec's fixed illustrative table (not real predictions): "Illustrative".
import { cancerCell, tCell, mhc1, cellInfo, PALETTE, mix, setDying, blobRadius, polarPoints, smoothPath, rng } from '../art/index.js';
import { STATUS } from './shared/cycle-data.js';

const ID = 'ch11-personal-vaccine';
const SEL = `[data-figure="${ID}"]`;

// ------------------------------------------------------------------ data (fixed, from the spec)
// loc: 'T' trunk · 'B' · 'C'; mut = index of the mutant letter; fit/resp per patient [1, 2].
const MUTS = [
  { id: 1, loc: 'T', pep: 'KMFEWLGRV', mut: 4, stands: true, fit: [85, 20], resp: [true, false] },
  { id: 2, loc: 'T', pep: 'VYRDPTQLF', mut: 4, stands: true, fit: [30, 86], resp: [false, true] },
  { id: 3, loc: 'T', pep: 'ALSEYKNIL', mut: 4, stands: false, fit: [88, 70], resp: [false, false] },
  { id: 4, loc: 'B', pep: 'FLDCRVETM', mut: 3, stands: true, fit: [82, 35], resp: [true, false] },
  { id: 5, loc: 'B', pep: 'QTWPHLAKY', mut: 4, stands: true, fit: [60, 84], resp: [false, true] },
  { id: 6, loc: 'B', pep: 'NVLKFSYRL', mut: 4, stands: true, fit: [25, 70], resp: [false, false] },
  { id: 7, loc: 'C', pep: 'GLWTEAFKV', mut: 2, stands: true, fit: [78, 30], resp: [false, false] },
  { id: 8, loc: 'C', pep: 'RYTDLVNQI', mut: 3, stands: true, fit: [45, 88], resp: [true, true] },
];
const MAX = 4;
const N_B = 33, N_C = 27;
const LOC_NAME = { T: 'Trunk', B: 'Branch B', C: 'Branch C' };
// Each patient's six class I "cups": pocket shapes differ (shape = HLA type, art library §5c).
const ANCHOR_FOR = { round: 'circle', square: 'square', triangle: 'triangle', wide: 'circle' };
const CUPS = [
  [['round', 'round'], ['square', 'triangle'], ['wide', 'round'], ['triangle', 'square'], ['round', 'wide'], ['square', 'square']],
  [['triangle', 'triangle'], ['wide', 'wide'], ['round', 'square'], ['square', 'round'], ['triangle', 'wide'], ['wide', 'triangle']],
];
const TXT = {
  micro: 'Same tumor, different HLA types: a thought experiment. Each person’s HLA molecules bind different peptides, so the predictions change.',
  stands: 'Yes = the tumor expresses this protein strongly, and the mutant peptide looks clearly different from the normal one.',
  full: 'The vaccine is full. Remove one first.',
  switched: 'Same tumor, different HLA types: choose again.',
  kinder: 'This game is kinder than reality. Here about one mutation in three works; in one pancreatic-cancer vaccine study, about one target in nine drew a T-cell response strong enough to detect directly in blood. That is why real vaccines carry up to 20 or 34 targets, not four.',
  all: 'Every cancer cell carried at least one target the T cells recognized.',
  some: (x) => `T cells attacked the branches they could see. Branch ${x} carried none of your successful targets, and grew back.`,
  none: 'None of your picks triggered T cells. In real trials, too, some patients’ vaccines produce no detectable response.',
  always: 'Even cells with a recognized target are not all killed: some stop displaying it, and some sit where T cells cannot work. Covering every branch helps; it does not guarantee a cure.',
};

// ------------------------------------------------------------------ palette (canonical; tree as ch06)
const SAND = PALETTE.healthy;
const VIOLET = PALETTE.cancer;
const BLEND = mix(SAND, VIOLET, 0.5);
const PALE = '#E4E9FA';
const PINK = PALETTE.neoPeptide || '#FF3D7F';
const BLUE = PALETTE.cd8 || '#4C8DFF';
const INK_DARK = '#141A33';
let HUES = null;
const branchHue = (k) => (HUES ||= [0, 1, 2].map((c) => cellInfo(cancerCell({ r: 10, clone: c, receptors: false, glow: false }))?.color || VIOLET))[k];
const BR = { B: { clone: 1, hatch: 'stripes', share: 55 }, C: { clone: 2, hatch: 'dots', share: 45 } };

// ------------------------------------------------------------------ style
const CSS = `
${SEL} .fig__stage { overflow: clip; }
${SEL} .pv { position: relative; z-index: 4; display: grid; gap: 14px 24px; padding: 16px 18px 18px;
  grid-template-columns: minmax(0, 0.94fr) minmax(0, 1.06fr); grid-template-areas: "bio pick" "res pick"; grid-template-rows: auto 1fr;
  font-family: var(--font-ui); color: var(--fg); }
${SEL} .pv.is-compact { grid-template-columns: minmax(0, 1fr); grid-template-areas: "bio" "res" "pick"; padding: 12px 12px 0; gap: 10px; }
${SEL} .pv-bio { grid-area: bio; min-width: 0; }
/* Phones (POLISH, after S2): the chooser (patients, cards, vaccine bar) moves out of the stage to
   below the stepper and its caption, in a dark panel that carries the stage's tokens, so the
   scene, the step controls and the caption stay together. */
${SEL} .pv-pickwrap { flex: 1 1 100%; min-width: 0; padding: 12px 12px 0; border-radius: var(--r-md, 12px); font-family: var(--font-ui);
  --fg: var(--stage-dark-ink); --fg-2: var(--stage-dark-ink-2); --fg-3: var(--stage-dark-ink-3); --line: var(--stage-dark-line); --halo: var(--stage-dark-a);
  --stage-focus: #A3B2FF; color: var(--fg); color-scheme: dark;
  background: radial-gradient(115% 95% at 50% 40%, var(--stage-dark-b) 0%, #0F1630 45%, var(--stage-dark-a) 85%);
  box-shadow: inset 0 0 0 1px var(--stage-dark-border); }
${SEL} .pv-bio > svg { display: block; width: 100%; height: auto; overflow: visible; }
${SEL} .pv-res { grid-area: res; min-width: 0; min-height: 10.5em; font-size: 13.5px; line-height: 1.5; color: var(--fg-2); }
${SEL} .is-compact .pv-res { min-height: 0; }
${SEL} .pv-res p { margin: 0; text-wrap: pretty; }
${SEL} .pv-res p + p { margin-top: 0.55em; }
${SEL} .pv-res .pv-res__sum { font-size: 15px; font-weight: 600; color: var(--fg); }
${SEL} .pv-res .pv-res__status { font-size: 12.5px; color: var(--fg-3); }
${SEL} .pv-res .pv-hint { display: flex; gap: 0.5em; align-items: flex-start; color: var(--fg-3); }
${SEL} .pv-res .pv-hint svg { flex: none; margin-top: 0.2em; }
${SEL} .pv-pick { grid-area: pick; min-width: 0; display: flex; flex-direction: column; gap: 12px; }
${SEL} .pv-caps { margin: 0; font-size: 11.5px; font-weight: 650; letter-spacing: 0.08em; text-transform: uppercase; color: var(--fg-2); }
${SEL} .pv-pts { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 6px; }
${SEL} .is-compact .pv-pts { grid-template-columns: 1fr; }
${SEL} .is-compact .pv-pt svg { max-width: 300px; }
${SEL} .pv-pt { display: flex; flex-direction: column; align-items: flex-start; gap: 2px; min-height: 44px; padding: 7px 10px 4px; border-radius: 10px;
  border: 1px solid rgb(233 236 246 / 0.16); background: rgb(233 236 246 / 0.04); color: var(--fg-2); font: 600 13.5px/1.2 var(--font-ui); cursor: pointer; text-align: left; }
${SEL} .pv-pt svg { display: block; width: 100%; max-width: 232px; height: auto; overflow: visible; }
${SEL} .pv-pt[aria-pressed="true"] { border-color: #A3B2FF; color: var(--fg); background: rgb(163 178 255 / 0.1); box-shadow: inset 0 0 0 1px #A3B2FF; }
${SEL} .pv-pt[aria-disabled="true"] { cursor: default; }
${SEL} .pv-pt[aria-disabled="true"]:not([aria-pressed="true"]) { opacity: 0.55; }
${SEL} .pv-micro { margin: 6px 0 0; font-size: 12.5px; line-height: 1.45; color: var(--fg-3); }
${SEL} .pv-head { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; }
${SEL} .pv-info { display: inline-flex; align-items: center; gap: 5px; min-height: 32px; padding: 0 8px; border: 0; border-radius: 8px; background: none;
  color: var(--fg-2); font: 560 12.5px/1 var(--font-ui); cursor: help; white-space: nowrap; }
@media (pointer: coarse) { ${SEL} .pv-info { min-height: 44px; } }
${SEL} .pv-info:hover { color: var(--fg); background: rgb(233 236 246 / 0.06); }
${SEL} .pv-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
${SEL} .pv-card { position: relative; display: grid; gap: 6px 8px; align-content: start; align-items: center;
  grid-template-columns: minmax(0, 1fr) auto; grid-template-areas: "name loc" "pep out" "fit fit" "res res"; min-height: 44px; padding: 9px 11px 8px; text-align: left;
  border-radius: 10px; border: 1px solid rgb(233 236 246 / 0.14); background: rgb(233 236 246 / 0.045); color: var(--fg);
  font: 500 13px/1.25 var(--font-ui); cursor: pointer; transition: border-color 160ms ease, box-shadow 160ms ease, background-color 160ms ease; }
${SEL} .pv-card:hover { border-color: rgb(233 236 246 / 0.3); }
${SEL} .pv-card[aria-disabled="true"] { cursor: default; }
${SEL} .pv-card.is-hot { border-color: rgb(233 236 246 / 0.42); background: rgb(233 236 246 / 0.08); }
${SEL} .pv-card[aria-pressed="true"] { border-color: ${PINK}; box-shadow: inset 0 0 0 1px ${PINK}, 0 0 16px rgb(255 61 127 / 0.32); background: rgb(255 61 127 / 0.07); }
${SEL} .pv-card__name { grid-area: name; font-weight: 650; font-size: 13.5px; white-space: nowrap; }
${SEL} .pv-loc { grid-area: loc; justify-self: end; }
${SEL} .pv-pep { grid-area: pep; }
${SEL} .pv-out { grid-area: out; justify-self: end; }
${SEL} .pv-fit { grid-area: fit; }
${SEL} .pv-resrow { grid-area: res; }
${SEL} .pv-loc__s { display: none; }
${SEL} .is-compact .pv-loc__l { display: none; }
${SEL} .is-compact .pv-loc__s { display: inline; }
${SEL} .is-compact .pv-card { grid-template-areas: "name loc" "pep pep" "fit fit" "out out" "res res"; padding: 9px 9px 7px; }
${SEL} .is-compact .pv-out { justify-self: start; }
${SEL} .is-compact .pv-pep { font-size: 14px; letter-spacing: 0.06em; }
${SEL} .is-compact .pv-fit { grid-template-columns: 1fr 2em; }
${SEL} .is-compact .pv-fit > span:first-child { display: none; }
${SEL} .pv-loc { display: inline-flex; align-items: center; gap: 5px; padding: 2px 7px 2px 3px; border-radius: 999px; background: rgb(233 236 246 / 0.08);
  font-size: 11.5px; font-weight: 600; color: var(--fg-2); white-space: nowrap; }
${SEL} .pv-loc__sw { width: 13px; height: 13px; border-radius: 50%; flex: none; }
${SEL} .pv-pep { font: 600 14.5px/1 var(--font-mono); letter-spacing: 0.1em; color: var(--fg-2); white-space: nowrap; }
${SEL} .pv-pep b { color: ${PINK}; font-weight: 800; text-decoration: underline; text-underline-offset: 3px; text-decoration-thickness: 2px; text-shadow: 0 0 8px rgb(255 61 127 / 0.55); }
${SEL} .pv-out { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; color: var(--fg-2); white-space: nowrap; }
${SEL} .pv-out svg { flex: none; }
${SEL} .pv-fit { display: grid; grid-template-columns: auto 1fr 2.1em; align-items: center; gap: 7px; font-size: 11.5px; color: var(--fg-3); }
${SEL} .pv-bar { position: relative; height: 7px; border-radius: 4px; background: rgb(233 236 246 / 0.1); overflow: hidden; }
${SEL} .pv-bar__fill { position: absolute; inset: 0 auto 0 0; border-radius: 4px; background: linear-gradient(90deg, #6F86E8, #A3B2FF); transition: width 400ms cubic-bezier(.45,.05,.35,1); }
${SEL} .pv-num { font: 650 12.5px/1 var(--font-ui); font-variant-numeric: tabular-nums; color: var(--fg); text-align: right; }
${SEL} .pv-resrow { display: flex; align-items: center; gap: 6px; min-height: 22px; font-size: 12.5px; font-weight: 600; color: var(--fg-2); transform-origin: 50% 0; }
${SEL} .pv-resrow .badge { font-size: 11px; }
${SEL} .pv-slot { position: absolute; top: -7px; left: -7px; width: 21px; height: 21px; border-radius: 50%; display: grid; place-items: center;
  background: ${PINK}; color: #fff; font: 750 11.5px/1 var(--font-ui); box-shadow: 0 0 0 2px #0F1630, 0 0 10px rgb(255 61 127 / 0.6); }
${SEL} .pv-slot[hidden] { display: none; }
${SEL} .pv-vax { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: 6px 12px; padding: 10px 12px; border-radius: 12px;
  background: rgb(16 23 50 / 0.92); box-shadow: inset 0 0 0 1px rgb(233 236 246 / 0.12); }
${SEL} .is-compact .pv-vax { z-index: 6; margin: 0 -12px; border-radius: 12px 12px 0 0; padding: 8px 12px 10px;
  box-shadow: 0 -8px 24px rgb(5 8 20 / 0.55), inset 0 1px 0 rgb(233 236 246 / 0.12); }
${SEL} .is-compact.is-choosing .pv-vax { position: sticky; bottom: 0; background: rgb(16 23 50); }   /* opaque while cards scroll under it */
${SEL} .is-compact:not(.is-choosing) .pv-vax { grid-template-columns: minmax(0, 1fr); }
${SEL} .is-compact:not(.is-choosing) .pv-vax__side { flex-direction: row; flex-wrap: wrap; align-items: center; justify-content: space-between; }
${SEL} .pv-vax > svg { display: block; width: 100%; height: auto; overflow: visible; }
${SEL} .pv-vax__side { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; }
${SEL} .pv-vax__btns { display: flex; gap: 6px; }
${SEL} .pv-vax__btns .btn[hidden] { display: none; }
${SEL} .pv-vax .btn--ghost { color: var(--fg-2); }
${SEL} .pv-vax .btn--ghost:hover { color: var(--fg); }
${SEL} .pv-vax__note { grid-column: 1 / -1; min-height: 1.3em; margin: 0; font-size: 12.5px; color: var(--fg-2); }
@media (prefers-reduced-motion: reduce) { ${SEL} .pv-bar__fill, ${SEL} .pv-card { transition: none; } }
`;
function injectCSS() {
  if (document.getElementById(`${ID}-css`)) return;
  const s = document.createElement('style');
  s.id = `${ID}-css`;
  s.textContent = CSS;
  document.head.append(s);
}

const f1 = (v) => Math.round(v * 10) / 10;
const clamp01 = (v) => Math.max(0, Math.min(1, v));
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const easeIO = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const local = (t, a, b) => clamp01((t - a) / (b - a));
const circleD = (r) => `M${-r} 0a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`;
const checkSVG = (c) => `<svg width="13" height="13" viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="${c}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const dashSVG = (c) => `<svg width="13" height="13" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 8h8" fill="none" stroke="${c}" stroke-width="2.2" stroke-linecap="round"/></svg>`;
const infoSVG = '<svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.6" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M8 7.2v4M8 4.9v.2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
const tcellSVG = `<svg width="18" height="18" viewBox="-9 -9 18 18" aria-hidden="true"><circle r="6.2" fill="${BLUE}" fill-opacity="0.85" stroke="#BFD4FF" stroke-width="1"/><circle r="3.4" cx="-0.6" cy="0.4" fill="#1C3E8A" fill-opacity="0.75"/>${[0, 45, 90, 135, 180, 225, 270, 315].map((a) => { const r = (a * Math.PI) / 180; return `<path d="M${f1(Math.cos(r) * 6.4)} ${f1(Math.sin(r) * 6.4)}L${f1(Math.cos(r) * 8.6)} ${f1(Math.sin(r) * 8.6)}" stroke="#9FC0FF" stroke-width="1.1" stroke-linecap="round"/>`; }).join('')}</svg>`;
const locBg = (loc) => (loc === 'T'
  ? `linear-gradient(90deg, ${SAND}, ${VIOLET})`
  : loc === 'B'
    ? `repeating-linear-gradient(135deg, rgb(255 255 255 / 0.62) 0 1.3px, transparent 1.3px 4px), ${branchHue(1)}`
    : `radial-gradient(circle, rgb(255 255 255 / 0.75) 0 1.15px, transparent 1.4px) 0 0 / 4.5px 4.5px, ${branchHue(2)}`);

// ================================================================== FIGURE
export default function mount(fig, ctx) {
  injectCSS();
  ctx.setAspect('auto');
  const { gsap } = ctx;
  ctx.tag('Illustrative', 'top-right');

  // ---------------------------------------------------------------- game state (outside the timeline)
  let patient = 0;              // 0 = Patient 1, 1 = Patient 2
  let picks = [];               // ordered mutation ids (slot order)
  let hot = null;               // card being hovered / last tapped in step 1 → highlight its cells
  let stepIx = -1;
  const ranked = () => [...MUTS].sort((a, b) => b.fit[patient] - a.fit[patient] || a.id - b.id);
  const autoPicks = () => ranked().slice(0, MAX).map((m) => m.id);
  const eff = () => (picks.length ? picks : autoPicks());
  function outcome() {
    const ids = eff();
    const ok = ids.filter((id) => MUTS[id - 1].resp[patient]);
    const locs = new Set(ok.map((id) => MUTS[id - 1].loc));
    const cov = { B: locs.has('T') || locs.has('B'), C: locs.has('T') || locs.has('C') };
    return { ids, ok, k: ok.length, n: ids.length, auto: !picks.length, cov, all: cov.B && cov.C, none: !cov.B && !cov.C };
  }

  // ---------------------------------------------------------------- timeline proxies
  let pending = false;
  const schedule = () => { if (!pending) { pending = true; queueMicrotask(() => { pending = false; render(); }); } };
  const proxy = () => { let v = 0; return { get p() { return v; }, set p(x) { v = x; schedule(); } }; };
  const S = { intro: proxy(), open: proxy(), make: proxy(), flip: proxy(), arrive: proxy(), kill: proxy(), grow: proxy(), outcome: proxy() };

  // ---------------------------------------------------------------- DOM skeleton
  const h = ctx.h;
  const root = h('div', { class: 'pv' });
  ctx.stage.append(root);
  const bio = h('div', { class: 'pv-bio' });
  const res = h('div', { class: 'pv-res', 'aria-live': 'polite' });
  const pick = h('div', { class: 'pv-pick' });
  root.append(bio, res, pick);
  const pickWrap = h('div', { class: 'pv-pickwrap' });   // phones: the chooser's home, after the stepper and caption
  const svg = ctx.createSVG({ viewBox: '0 0 500 560', parent: bio });

  // patients
  const ptBox = h('div', { class: 'pv-pts-wrap' });
  ptBox.append(h('p', { class: 'pv-caps', id: `${ID}-who` }, 'Whose tumor?'));
  const pts = h('div', { class: 'pv-pts', role: 'group', 'aria-labelledby': `${ID}-who` });
  const ptBtns = [0, 1].map((p) => {
    const b = h('button', { type: 'button', class: 'pv-pt', 'aria-pressed': String(p === 0), 'aria-label': `Patient ${p + 1}: six HLA class I types, drawn as differently shaped pockets` }, h('span', {}, `Patient ${p + 1}`));
    b.append(cupsSVG(p));
    b.addEventListener('click', () => choosePatient(p), { signal: ctx.signal });
    pts.append(b);
    return b;
  });
  ptBox.append(pts, h('p', { class: 'pv-micro' }, TXT.micro));
  // cards
  const head = h('div', { class: 'pv-head' });
  const headTitle = h('p', { class: 'pv-caps' }, 'Candidates, ranked by predicted HLA binding');
  const info = h('button', { type: 'button', class: 'pv-info', 'aria-label': `Stands out? ${TXT.stands}`, html: `${infoSVG}<span>Stands out?</span>` });
  const showTip = () => ctx.tooltip.show(TXT.stands, info);
  info.addEventListener('mouseenter', showTip, { signal: ctx.signal });
  info.addEventListener('focus', showTip, { signal: ctx.signal });
  info.addEventListener('click', showTip, { signal: ctx.signal });
  info.addEventListener('mouseleave', () => ctx.tooltip.hide(), { signal: ctx.signal });
  info.addEventListener('blur', () => ctx.tooltip.hide(), { signal: ctx.signal });
  head.append(headTitle, info);
  const cardsEl = h('div', { class: 'pv-cards', role: 'group', 'aria-label': 'Candidate mutations' });
  const cards = MUTS.map((m) => buildCard(m));
  cards.forEach((c) => cardsEl.append(c.el));
  // vaccine bar
  const vax = h('div', { class: 'pv-vax' });
  const vsvg = ctx.createSVG({ viewBox: '0 0 300 64', parent: vax });
  const side = h('div', { class: 'pv-vax__side' });
  const count = h('p', { class: 'pv-caps', style: 'margin:0' });
  const btns = h('div', { class: 'pv-vax__btns' });
  const makeBtn = ctx.ui.button({ label: 'Make & test', variant: 'primary', small: true, parent: btns, onClick: () => { if (stepIx === 1 && picks.length) stepper.go(2); } });
  // Control vocabulary (FIGURES.md S8): a verb for choosing again (step 2, same patient), Reset = back to step 1.
  const againBtn = ctx.ui.button({ label: 'Choose again', icon: 'replay', small: true, parent: btns, onClick: () => stepper.go(1) });
  const resetBtn = ctx.ui.button({ label: 'Reset', icon: 'reset', variant: 'ghost', small: true, parent: btns, onClick: () => { picks = []; patient = 0; hot = null; vnote.textContent = ''; applyPatient(false); stepper.go(0); } });
  side.append(count, btns);
  const vnote = h('p', { class: 'pv-vax__note', 'aria-live': 'polite' });
  vax.append(vsvg, side, vnote);
  pick.append(ptBox, head, cardsEl, vax);

  // ---------------------------------------------------------------- patients' shop windows (art mhc1 pocket variants, ≥ 14 px)
  function pocketGlyph(parent, x, y, type) {
    const st = `fill:none;stroke:${PALE};stroke-opacity:0.78;stroke-width:1.3;stroke-linejoin:round`;
    if (type === 'round') return ctx.svg('circle', { cx: f1(x), cy: y, r: 3.5, style: st }, parent);
    if (type === 'square') return ctx.svg('rect', { x: f1(x - 3.2), y: y - 3.2, width: 6.4, height: 6.4, rx: 0.8, style: st }, parent);
    if (type === 'triangle') return ctx.svg('path', { d: `M${f1(x)} ${y - 4}L${f1(x + 4.1)} ${y + 3.2}L${f1(x - 4.1)} ${y + 3.2}Z`, style: st }, parent);
    return ctx.svg('rect', { x: f1(x - 4.9), y: y - 3, width: 9.8, height: 6, rx: 3, style: st }, parent);   // 'wide'
  }
  function cupsSVG(p) {
    const s = ctx.svg('svg', { viewBox: '0 0 232 70', 'aria-hidden': 'true', focusable: 'false' });
    ctx.svg('path', { d: 'M4 50 Q116 44 228 50', style: `fill:none;stroke:${SAND};stroke-opacity:0.5;stroke-width:3;stroke-linecap:round` }, s);
    CUPS[p].forEach((pk, i) => {
      const c = mhc1({ size: 38, pockets: pk, anchors: pk.map((x) => ANCHOR_FOR[x]), peptide: 'self', stage: 'dark' });
      c.setAttribute('transform', `translate(${f1(22 + i * 37.6)} ${f1(48.5 - Math.abs(i - 2.5) * 0.9)})`);
      s.append(c);
      // The cup's two pocket shapes, enlarged under it: at this size the art's own pocket marks are
      // too small to compare, and the point is that the two patients' pockets differ (QA R4).
      pk.forEach((type, j) => pocketGlyph(s, 22 + i * 37.6 + (j ? 5.6 : -5.6), 62, type));
    });
    return s;
  }

  // ---------------------------------------------------------------- cards
  function buildCard(m) {
    const pep = m.pep.split('').map((ch, i) => (i === m.mut ? `<b>${ch}</b>` : ch)).join('');
    const el = h('button', { type: 'button', class: 'pv-card', 'aria-pressed': 'false', dataset: { id: String(m.id) } });
    el.innerHTML = `
      <span class="pv-slot" hidden></span>
      <span class="pv-card__name">Mutation ${m.id}</span>
      <span class="pv-loc"><span class="pv-loc__sw" style="background:${locBg(m.loc)}"></span><span class="pv-loc__l">${LOC_NAME[m.loc]}</span><span class="pv-loc__s">${m.loc === 'T' ? 'Trunk' : m.loc}</span></span>
      <span class="pv-pep" aria-hidden="true">${pep}</span>
      <span class="pv-out" title="${TXT.stands}">${m.stands ? checkSVG('#4FCF95') : dashSVG('#A9B1CC')}<span>Stands out? ${m.stands ? 'Yes' : 'No'}</span></span>
      <span class="pv-fit" title="Predicted binding to this patient’s HLA"><span>HLA binding</span><span class="pv-bar"><span class="pv-bar__fill"></span></span><span class="pv-num"></span></span>
      <span class="pv-resrow"></span>`;
    const c = { m, el, slot: el.querySelector('.pv-slot'), fill: el.querySelector('.pv-bar__fill'), num: el.querySelector('.pv-num'), resrow: el.querySelector('.pv-resrow'), resKey: '' };
    el.addEventListener('click', () => tapCard(m.id), { signal: ctx.signal });
    el.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') setHot(m.id); }, { signal: ctx.signal });
    el.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') setHot(null); }, { signal: ctx.signal });
    el.addEventListener('focus', () => setHot(m.id), { signal: ctx.signal });
    el.addEventListener('blur', () => setHot(null), { signal: ctx.signal });
    return c;
  }
  function cardLabel(c) {
    const m = c.m;
    return `Mutation ${m.id}, ${LOC_NAME[m.loc]}, peptide ${m.pep.split('').join(' ')}, mutant amino acid ${m.pep[m.mut]} at position ${m.mut + 1}. Predicted binding to this patient’s HLA: ${m.fit[patient]} out of 100. Stands out: ${m.stands ? 'yes' : 'no'}.`;
  }
  function setHot(id) {
    if (hot === id) return;
    hot = id;
    render();
  }
  function tapCard(id) {
    if (stepIx === 0) { hot = id; render(); return; }
    if (stepIx !== 1) return;
    const i = picks.indexOf(id);
    if (i >= 0) {
      picks.splice(i, 1);
      vnote.textContent = '';
      ctx.announce(`Mutation ${id} removed. ${picks.length} of ${MAX} chosen.`);
    } else if (picks.length >= MAX) {
      vnote.textContent = TXT.full;
      ctx.announce(TXT.full);
      return;
    } else {
      picks.push(id);
      vnote.textContent = '';
      ctx.announce(`Mutation ${id} added. ${picks.length} of ${MAX} chosen.`);
    }
    hot = id;
    render();
  }
  function choosePatient(p) {
    if (stepIx !== 1 || p === patient) return;
    patient = p;
    const had = picks.length;
    picks = [];
    vnote.textContent = TXT.switched;
    ctx.announce(`Patient ${p + 1}. ${TXT.switched}`);
    applyPatient(true);
    if (!had) render();
  }
  // rank order + fit bars (bars animate 400 ms by CSS; the grid re-flows with a FLIP glide)
  function applyPatient(animate) {
    const before = animate && !ctx.reducedMotion ? cards.map((c) => c.el.getBoundingClientRect()) : null;
    ranked().forEach((m, i) => { cards[m.id - 1].el.style.order = String(i); });
    cards.forEach((c) => { c.fill.style.width = `${c.m.fit[patient]}%`; c.num.textContent = String(c.m.fit[patient]); c.el.setAttribute('aria-label', cardLabel(c)); });
    ptBtns.forEach((b, i) => b.setAttribute('aria-pressed', String(i === patient)));
    headTitle.textContent = `Candidates, ranked by predicted binding to Patient ${patient + 1}’s HLA`;
    if (before) {
      cards.forEach((c, i) => {
        const a = c.el.getBoundingClientRect();
        const dx = before[i].left - a.left, dy = before[i].top - a.top;
        if (Math.abs(dx) + Math.abs(dy) < 1) return;
        gsap.fromTo(c.el, { x: dx, y: dy }, { x: 0, y: 0, duration: 0.5, ease: 'so.inOut', clearProps: 'transform' });
      });
    }
    render();
  }

  // ---------------------------------------------------------------- bio SVG (tree + tumor), rebuilt on resize
  let L = null;
  let B = null;   // built scene: { tree, cells, buds, tcells, ... }
  let uid = 0;
  function layout() {
    const W = Math.max(280, Math.round(bio.clientWidth || 480));
    const compact = root.classList.contains('is-compact');
    const tree = { x0: 0, x1: W, y0: 0, y1: compact ? 168 : 214 };
    const tH = compact ? Math.min(320, Math.round(W * 0.9)) : Math.min(380, Math.round(W * 0.74));
    const tumor = { x0: 0, x1: W, y0: tree.y1 + 8, y1: tree.y1 + 8 + 26 + tH };
    return { W, H: tumor.y1 + 4, compact, tree, tumor };
  }

  function buildBio() {
    L = layout();
    const { W, H, compact } = L;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    for (const n of [...svg.children]) if (n !== svg.defs) n.remove();
    svg.defs.replaceChildren();
    const mk = (tag, attrs, p) => ctx.svg(tag, attrs, p);
    const u = `${ID}-${++uid}`;
    // hatch patterns (white strokes over the branch color), exactly as the ch06 tree
    const pat = {};
    for (const kind of ['stripes', 'dots']) {
      const p = mk('pattern', { id: `${u}-${kind}`, patternUnits: 'userSpaceOnUse', width: 6, height: 6 }, svg.defs);
      if (kind === 'stripes') mk('path', { d: 'M-1 1 L1 -1 M0 6 L6 0 M5 7 L7 5', style: 'stroke:#fff;stroke-opacity:0.62;stroke-width:1.3;fill:none' }, p);
      else mk('circle', { cx: 3, cy: 3, r: 1.25, style: 'fill:#fff;fill-opacity:0.7' }, p);
      pat[kind] = `url(#${u}-${kind})`;
    }
    const trunkGrad = mk('linearGradient', { id: `${u}-trunk`, gradientUnits: 'userSpaceOnUse', x1: 0, y1: 0, x2: 100, y2: 0 }, svg.defs);
    mk('stop', { offset: 0, 'stop-color': SAND }, trunkGrad);
    mk('stop', { offset: 0.55, 'stop-color': BLEND }, trunkGrad);
    mk('stop', { offset: 1, 'stop-color': VIOLET }, trunkGrad);
    B = { pat, tree: buildTree(mk, trunkGrad, pat), ...buildTumor(mk, pat, u) };
    B.lastP = new Map();
    render();
  }

  const blobCache = new Map();
  function blob(r, seed) {
    const key = `${Math.round(r * 2)}|${seed}`;
    let d = blobCache.get(key);
    if (!d) {
      const rf = blobRadius({ r, seed, irregularity: 0.55, bumps: [{ angle: 0.7, amp: 0.09, width: 0.4 }, { angle: 3.4, amp: 0.07, width: 0.35 }] });
      d = smoothPath(polarPoints(rf, 28));
      blobCache.set(key, d);
    }
    return d;
  }

  function buildTree(mk, trunkGrad, pat) {
    const { tree: bx, compact } = L;
    const g = mk('g', { class: 'pv-tree' }, svg);
    mk('text', { x: bx.x0 + 2, y: bx.y0 + 14, class: 't-caps', text: 'Tumor family tree' }, g);
    const yc = Math.round((bx.y0 + 26 + bx.y1) / 2) - (compact ? 6 : 4);
    const rootR = compact ? 13 : 16;
    const xr = bx.x0 + rootR + 4;
    const xF = bx.x0 + (bx.x1 - bx.x0) * (compact ? 0.44 : 0.5);
    const rF = compact ? 12 : 14;
    const spine = xF + rF + (compact ? 10 : 14);
    const xN = bx.x1 - (compact ? 78 : 104);
    const rN = compact ? 12 : 15;
    const off = compact ? 46 : 56;
    const mr = compact ? 9.5 : 10.5;               // mutation disc radius
    const rc = 6;
    const rows = { B: yc - off, C: yc + off };
    // links (branches), trunk band, ticks, nodes, markers, labels
    const gLinks = mk('g', {}, g);
    const gTrunk = mk('g', {}, g);
    const gTicks = mk('g', {}, g);
    const gNodes = mk('g', {}, g);
    const gMarks = mk('g', {}, g);
    const gLab = mk('g', {}, g);
    const links = {};
    for (const k of ['B', 'C']) {
      const ey = rows[k], dir = Math.sign(ey - yc);
      const d = `M${f1(xF + rF * 0.5)} ${yc}H${f1(spine - rc)}Q${f1(spine)} ${yc} ${f1(spine)} ${f1(yc + dir * rc)}V${f1(ey - dir * rc)}Q${f1(spine)} ${f1(ey)} ${f1(spine + rc)} ${f1(ey)}H${f1(xN - rN)}`;
      links[k] = mk('path', { d, fill: 'none', stroke: branchHue(BR[k].clone), 'stroke-width': 3.2, 'stroke-linecap': 'round', opacity: 0.92 }, gLinks);
    }
    const trunkLen = xF - xr;
    trunkGrad.setAttribute('x1', f1(xr)); trunkGrad.setAttribute('x2', f1(xF));
    const tGlow = mk('path', { d: `M${f1(xr)} ${yc}H${f1(xF)}`, fill: 'none', stroke: BLUE, 'stroke-opacity': 0, 'stroke-width': 17, 'stroke-linecap': 'round' }, gTrunk);
    const tBand = mk('path', { d: `M${f1(xr)} ${yc}H${f1(xF)}`, fill: 'none', stroke: `url(#${trunkGrad.id})`, 'stroke-width': 9, 'stroke-linecap': 'round' }, gTrunk);
    mk('path', { d: `M${f1(xr + rootR)} ${f1(yc - 1.8)}H${f1(xF - rF)}`, fill: 'none', stroke: '#fff', 'stroke-opacity': 0.28, 'stroke-width': 1.4, 'stroke-linecap': 'round' }, gTrunk);
    // passenger ticks (faint, between the candidate discs) — the ch06 vocabulary
    let td = '';
    const tick = (x, y, hgt) => { td += `M${f1(x)} ${f1(y - hgt)}V${f1(y + hgt)}`; };
    const trunkSlots = [0.2, 0.5, 0.8].map((t) => xr + rootR + 10 + (xF - rF - 10 - (xr + rootR + 10)) * t);
    for (let i = 0; i < 9; i++) { const x = xr + rootR + 6 + ((i + 0.5) / 9) * (xF - rF - 6 - (xr + rootR + 6)); if (trunkSlots.every((s) => Math.abs(s - x) > mr + 3)) tick(x, yc, 6); }
    const runA = spine + rc + 4, runB = xN - rN - 6;
    const brSlots = { B: [0.17, 0.5, 0.83].map((t) => runA + (runB - runA) * t), C: [0.3, 0.72].map((t) => runA + (runB - runA) * t) };
    for (const k of ['B', 'C']) for (let i = 0; i < 6; i++) { const x = runA + ((i + 0.5) / 6) * (runB - runA); if (brSlots[k].every((s) => Math.abs(s - x) > mr + 3)) tick(x, rows[k], 3.8); }
    mk('path', { d: td, fill: 'none', stroke: PALE, 'stroke-width': 1.1, 'stroke-linecap': 'round', opacity: 0.55 }, gTicks);
    // root
    const rootG = mk('g', { transform: `translate(${f1(xr)} ${yc})` }, gNodes);
    mk('circle', { r: rootR, fill: SAND, stroke: 'rgba(255,255,255,0.4)', 'stroke-width': 0.8 }, rootG);
    mk('circle', { r: f1(rootR * 0.36), fill: '#8A6B4E', 'fill-opacity': 0.55 }, rootG);
    mk('text', { x: f1(xr), y: f1(yc + rootR + 15), class: 't-small', 'text-anchor': 'middle', text: 'Original' }, gLab);
    mk('text', { x: f1(xr), y: f1(yc + rootR + 29), class: 't-small', 'text-anchor': 'middle', text: 'cell' }, gLab);
    // cancer founder (end of the trunk)
    const fG = mk('g', { transform: `translate(${f1(xF)} ${yc})` }, gNodes);
    mk('path', { d: blob(rF, 3), fill: VIOLET, 'fill-opacity': 0.96, stroke: 'rgba(255,255,255,0.4)', 'stroke-width': 0.8 }, fG);
    if (!compact) mk('text', { x: f1(xF + rF * 0.4), y: f1(yc - rF - 8), class: 't-small', 'text-anchor': 'end', text: 'First cancer cell' }, gLab);
    // trunk label (small caps under the band)
    if (compact) mk('text', { x: f1(xr - rootR + 2), y: f1(yc - 17), class: 't-caps', text: 'Trunk · every cell', style: 'font-size:11px' }, gLab);
    else mk('text', { x: f1(xr + rootR + 24), y: f1(yc + 30), class: 't-caps', text: 'Trunk · in every cancer cell', style: 'font-size:11px' }, gLab);
    // branch nodes
    const nodes = {};
    for (const k of ['B', 'C']) {
      const ng = mk('g', { transform: `translate(${f1(xN)} ${f1(rows[k])})` }, gNodes);
      const ring = mk('circle', { r: rN + 5, fill: 'none', stroke: BLUE, 'stroke-width': 2.4, opacity: 0 }, ng);
      const shape = blob(rN, k === 'B' ? 11 : 17);
      mk('path', { d: shape, fill: branchHue(BR[k].clone), 'fill-opacity': 0.96, stroke: 'rgba(255,255,255,0.4)', 'stroke-width': 0.8 }, ng);
      mk('path', { d: shape, fill: pat[BR[k].hatch], 'pointer-events': 'none' }, ng);
      const lx = xN + rN + 6;
      mk('text', { x: f1(lx), y: f1(rows[k] + 5.5), class: 't-label', text: k, style: 'font-weight:720' }, gLab);
      const share = `${BR[k].share}% of cells`;
      if (compact) mk('text', { x: f1(lx + 14), y: f1(rows[k] + 5), class: 't-small', text: `${BR[k].share}%` }, gLab);
      else mk('text', { x: f1(lx + 17), y: f1(rows[k] + 5), class: 't-small', text: share }, gLab);
      nodes[k] = { g: ng, ring };
    }
    // candidate mutation discs on the edges
    const marks = {};
    const place = (id, x, y) => {
      const mg = mk('g', { transform: `translate(${f1(x)} ${f1(y)})` }, gMarks);
      const glow = mk('circle', { r: mr + 5, fill: PINK, opacity: 0 }, mg);
      const disc = mk('circle', { r: mr, fill: PALE, stroke: 'rgba(255,255,255,0.55)', 'stroke-width': 1 }, mg);
      const num = mk('text', { y: 4.4, 'text-anchor': 'middle', text: String(id), style: `font: 750 ${compact ? 11.5 : 12.5}px var(--font-ui); fill:${INK_DARK}` }, mg);
      const ok = ctx.badgeSVG('yes', { x: mr * 0.85, y: -mr * 0.85, r: 6.5 }, mg);
      const no = ctx.badgeSVG('no', { x: mr * 0.85, y: -mr * 0.85, r: 6.5 }, mg);
      marks[id] = { g: mg, glow, disc, num, ok, no };
    };
    [1, 2, 3].forEach((id, i) => place(id, trunkSlots[i], yc));
    [4, 5, 6].forEach((id, i) => place(id, brSlots.B[i], rows.B));
    [7, 8].forEach((id, i) => place(id, brSlots.C[i], rows.C));
    return { g, tBand, tGlow, links, nodes, marks, trunkLen, xr, xF, yc };
  }

  function buildTumor(mk, pat, u) {
    const { tumor: bx, compact } = L;
    const g = mk('g', { class: 'pv-tumor' }, svg);
    mk('text', { x: bx.x0 + 2, y: bx.y0 + 14, class: 't-caps', text: 'The tumor' }, g);
    const cx = (bx.x0 + bx.x1) / 2, cy = (bx.y0 + 26 + bx.y1) / 2;
    const p = compact ? 27 : 34;
    const rC = p * 0.56;
    const R = rng(7, 'pv-tumor');
    // hex lattice in an organic blob; the 60 most central sites are the tumor, the next ring is room to grow
    const sites = [];
    const ph1 = R.range(0, 6.28), ph2 = R.range(0, 6.28);
    const ax = (bx.x1 - bx.x0) * 0.4, ay = (bx.y1 - bx.y0 - 26) * 0.4;
    for (let j = -12; j <= 12; j++) {
      for (let i = -14; i <= 14; i++) {
        const x = (i + (j & 1) * 0.5) * p + R.range(-0.08, 0.08) * p;
        const y = j * p * 0.866 + R.range(-0.08, 0.08) * p;
        const a = Math.atan2(y, x);
        const d = Math.hypot(x / ax, y / ay) * (1 + 0.1 * Math.sin(3 * a + ph1) + 0.06 * Math.sin(5 * a + ph2));
        sites.push({ x: cx + x, y: cy + y, d });
      }
    }
    sites.sort((a, b) => a.d - b.d);
    const cellsPos = sites.slice(0, N_B + N_C);
    const rim = sites.slice(N_B + N_C, N_B + N_C + 16).filter((s) => s.x > bx.x0 + rC + 2 && s.x < bx.x1 - rC - 2 && s.y > bx.y0 + 26 + rC && s.y < bx.y1 - rC);
    // branches: B upper-left, C lower-right, intermixed along the boundary
    const vx = -0.78, vy = -0.62;
    cellsPos.forEach((s) => { s.score = -((s.x - cx) * vx + (s.y - cy) * vy) / ax + R.range(-0.32, 0.32); });
    const order = [...cellsPos].sort((a, b) => a.score - b.score);
    order.forEach((s, i) => { s.br = i < N_B ? 'B' : 'C'; });
    rim.forEach((s) => { let best = null; for (const c of cellsPos) { const dd = Math.hypot(c.x - s.x, c.y - s.y); if (!best || dd < best.dd) best = { dd, br: c.br }; } s.br = best.br; });
    // patch tint + faint outline (union of discs via a mask)
    const gPatch = mk('g', {}, g);
    const patchG = {};
    for (const k of ['B', 'C']) {
      const mid = `${u}-mask-${k}`;
      const mask = mk('mask', { id: mid, maskUnits: 'userSpaceOnUse', x: bx.x0 - 20, y: bx.y0 - 20, width: bx.x1 - bx.x0 + 40, height: bx.y1 - bx.y0 + 40 }, svg.defs);
      const ks = cellsPos.filter((s) => s.br === k);
      for (const s of ks) mk('circle', { cx: f1(s.x), cy: f1(s.y), r: f1(rC * 1.32 + 1.4), fill: '#fff' }, mask);
      for (const s of ks) mk('circle', { cx: f1(s.x), cy: f1(s.y), r: f1(rC * 1.32), fill: '#000' }, mask);
      const pg = mk('g', {}, gPatch);
      patchG[k] = pg;
      const tint = mk('g', { opacity: 0.12 }, pg);
      for (const s of ks) mk('circle', { cx: f1(s.x), cy: f1(s.y), r: f1(rC * 1.32), fill: branchHue(BR[k].clone) }, tint);
      mk('rect', { x: bx.x0 - 20, y: bx.y0 - 20, width: bx.x1 - bx.x0 + 40, height: bx.y1 - bx.y0 + 40, fill: branchHue(BR[k].clone), opacity: 0.55, mask: `url(#${mid})` }, pg);
    }
    // cells
    const gCells = mk('g', {}, g);
    const mkCell = (s, i, seedBase) => {
      const w = mk('g', { transform: `translate(${f1(s.x)} ${f1(s.y)})` }, gCells);
      const inner = mk('g', {}, w);
      const art = () => cancerCell({ r: rC, clone: BR[s.br].clone, seed: seedBase + i, stage: 'dark', receptors: false, glow: false, detail: 'low' });
      const cell = art();
      inner.append(cell);
      const hatch = mk('circle', { r: f1(rC * 0.66), fill: pat[BR[s.br].hatch], opacity: 0.55, 'pointer-events': 'none' }, inner);
      const ring = mk('circle', { r: f1(rC + 2.2), fill: 'none', stroke: BLUE, 'stroke-width': 2, opacity: 0 }, w);
      return { ...s, w, inner, cell, hatch, ring, i, art };
    };
    const cells = cellsPos.map((s, i) => mkCell(s, i, 100));
    // letter badges (two per patch, near its middle)
    const gBadges = mk('g', {}, g);
    const badges = [];
    for (const k of ['B', 'C']) {
      const ks = cells.filter((c) => c.br === k);
      const mx = ks.reduce((t, c) => t + c.x, 0) / ks.length, my = ks.reduce((t, c) => t + c.y, 0) / ks.length;
      const byD = [...ks].sort((a, b) => Math.hypot(a.x - mx, a.y - my) - Math.hypot(b.x - mx, b.y - my));
      const picksB = [byD[0], byD.slice(6).sort((a, b) => Math.hypot(b.x - byD[0].x, b.y - byD[0].y) - Math.hypot(a.x - byD[0].x, a.y - byD[0].y))[Math.floor(ks.length / 3)]];
      for (const c of picksB) {
        const bg = mk('g', { transform: `translate(${f1(c.x)} ${f1(c.y)})` }, gBadges);
        mk('circle', { r: 9, fill: 'rgb(14 20 44 / 0.86)', stroke: '#fff', 'stroke-opacity': 0.75, 'stroke-width': 1.2 }, bg);
        mk('text', { y: 4.2, 'text-anchor': 'middle', text: k, style: 'font: 750 12px var(--font-ui); fill:#fff' }, bg);
        badges.push({ k, g: bg });
      }
    }
    // buds (pre-built for every outcome; only the needed ones are shown)
    const gBuds = mk('g', {}, g);
    const budsAt = (list, brOf, seedBase) => list.map((s, i) => {
      const br = typeof brOf === 'string' ? brOf : s.br;
      const w = mk('g', { transform: `translate(${f1(s.x)} ${f1(s.y)})`, opacity: 0 }, gBuds);
      const inner = mk('g', {}, w);
      inner.append(cancerCell({ r: rC, clone: BR[br].clone, seed: seedBase + i, stage: 'dark', receptors: false, glow: false, detail: 'low' }));
      mk('circle', { r: f1(rC * 0.66), fill: pat[BR[br].hatch], opacity: 0.55 }, inner);
      return { x: s.x, y: s.y, br, w, inner };
    });
    // regrowth into the other branch's cleared space (nearest first) + the rim
    const into = {};
    for (const k of ['B', 'C']) {
      const other = k === 'B' ? 'C' : 'B';
      const mine = cells.filter((c) => c.br === k);
      const cand = cells.filter((c) => c.br === other).map((c) => ({ c, d: Math.min(...mine.map((q) => Math.hypot(q.x - c.x, q.y - c.y))) })).sort((a, b) => a.d - b.d).slice(0, 12).map((q) => q.c);
      into[k] = { cand, buds: budsAt(cand, k, 300 + (k === 'B' ? 0 : 50)) };
    }
    const rimBuds = budsAt(rim, null, 400);
    // T cells (up to four), entering from the left
    const gT = mk('g', {}, g);
    const tcells = [0, 1, 2, 3].map((i) => {
      const w = mk('g', { opacity: 0 }, gT);
      const t = tCell({ variant: 'cd8', r: compact ? 12 : 15, state: 'activated', polarity: 0, seed: 21 + i, stage: 'dark' });
      w.append(t);
      return { w };
    });
    return { tumorG: g, cells, badges, into, rimBuds, tcells, patchG, rC, p, cx, cy };
  }

  // per-outcome plan (who dies, who survives, where T cells go, which buds grow)
  let planKey = '';
  let plan = null;
  function getPlan() {
    const o = outcome();
    const key = `${patient}|${o.ids.join(',')}|${L.W}`;
    if (key === planKey && plan) return plan;
    planKey = key;
    const covered = B.cells.filter((c) => o.cov[c.br]);
    // T cells: farthest-point sampling over the covered cells
    const nT = o.none ? 0 : o.all ? 4 : 3;
    const tPos = [];
    if (covered.length) {
      const mx = covered.reduce((t, c) => t + c.x, 0) / covered.length, my = covered.reduce((t, c) => t + c.y, 0) / covered.length;
      let first = covered.reduce((b, c) => (Math.hypot(c.x - mx, c.y - my) < Math.hypot(b.x - mx, b.y - my) ? c : b), covered[0]);
      tPos.push(first);
      while (tPos.length < nT) {
        let best = null;
        for (const c of covered) { const d = Math.min(...tPos.map((q) => Math.hypot(q.x - c.x, q.y - c.y))); if (!best || d > best.d) best = { c, d }; }
        tPos.push(best.c);
      }
    }
    const tTargets = tPos.map((c, i) => ({ x: c.x + B.p * (i % 2 ? -0.38 : 0.42), y: c.y - B.p * 0.32 }));
    // survivors: 2–3 per cleared patch, deterministic, away from the T cells
    const survivors = new Set();
    for (const k of ['B', 'C']) {
      if (!o.cov[k]) continue;
      const ks = covered.filter((c) => c.br === k).map((c) => ({ c, d: Math.min(...tTargets.map((t) => Math.hypot(t.x - c.x, t.y - c.y))) })).sort((a, b) => b.d - a.d);
      const n = o.all ? (k === 'B' ? 2 : 1) : 3;
      for (let i = 0; i < n && i < ks.length; i++) survivors.add(ks[i * 3]?.c || ks[i].c);
    }
    const maxD = Math.max(1, ...covered.map((c) => Math.min(...tTargets.map((t) => Math.hypot(t.x - c.x, t.y - c.y)))));
    const delay = new Map(covered.map((c) => [c, (Math.min(...tTargets.map((t) => Math.hypot(t.x - c.x, t.y - c.y))) / maxD) * 0.5]));
    // regrowth
    let buds = [];
    if (o.none) buds = B.rimBuds;
    else if (!o.all) {
      const x = o.cov.B ? 'C' : 'B';
      buds = [...B.into[x].buds.filter((b, i) => !survivors.has(B.into[x].cand[i])).slice(0, 10), ...B.rimBuds.filter((b) => b.br === x).slice(0, 4)];
    }
    const allBuds = [...B.into.B.buds, ...B.into.C.buds, ...B.rimBuds];
    plan = { o, covered: new Set(covered), survivors, tTargets, delay, buds: new Set(buds), budOrder: buds, allBuds };
    return plan;
  }

  // ---------------------------------------------------------------- vaccine strand (SVG), rebuilt with the layout
  let V = null;
  function buildVax() {
    const W = L.compact ? 236 : 300, H = 64;
    vsvg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    vsvg.style.maxWidth = `${W}px`;
    for (const n of [...vsvg.children]) if (n !== vsvg.defs) n.remove();
    const mk = (tag, attrs, p) => ctx.svg(tag, attrs, p);
    const cy = 34;
    const g = mk('g', {}, vsvg);
    const strandG = mk('g', {}, g);
    let d = `M6 ${cy}`;
    for (let x = 6; x <= W - 6; x += 6) d += `L${x} ${f1(cy + Math.sin(x / 9) * 1.6)}`;
    mk('path', { d, fill: 'none', stroke: '#C9D3E8', 'stroke-width': 1.6, 'stroke-linecap': 'round', opacity: 0.85 }, strandG);
    mk('text', { x: 6, y: 13, class: 't-caps', text: 'mRNA vaccine', style: 'font-size:12px' }, g);
    const sw = (W - 24) / 4;
    const slots = [0, 1, 2, 3].map((i) => {
      const x = 12 + sw * i + sw / 2;
      const sg = mk('g', { transform: `translate(${f1(x)} ${cy})` }, strandG);
      const box = mk('rect', { x: f1(-sw / 2 + 4), y: -11, width: f1(sw - 8), height: 22, rx: 11, fill: '#1A2244', stroke: '#A9B1CC', 'stroke-opacity': 0.5, 'stroke-width': 1.2, 'stroke-dasharray': '3 3' }, sg);
      const lab = mk('text', { y: 4.2, 'text-anchor': 'middle', text: String(i + 1), style: 'font: 650 11.5px var(--font-ui); fill: #A9B1CC' }, sg);
      const beads = mk('g', { opacity: 0 }, sg);
      const br = Math.min(2.7, (sw - 16) / 20);
      for (let b = 0; b < 9; b++) mk('circle', { cx: f1((b - 4) * br * 2.15), cy: 0, r: f1(b === 4 ? br * 1.3 : br), fill: PINK, 'fill-opacity': b === 4 ? 1 : 0.78, stroke: '#FFD1E0', 'stroke-opacity': b === 4 ? 0.9 : 0, 'stroke-width': 0.8 }, beads);
      return { g: sg, box, lab, beads, x };
    });
    // lipid sphere
    const sph = mk('g', { transform: `translate(${f1(W / 2)} ${cy})`, opacity: 0 }, g);
    const R = 22;
    mk('circle', { r: R + 6, fill: 'rgb(242 179 61 / 0.08)' }, sph);
    for (let i = 0; i < 26; i++) { const a = (i / 26) * Math.PI * 2; mk('circle', { cx: f1(Math.cos(a) * R), cy: f1(Math.sin(a) * R), r: 2.3, fill: '#F3D9A8', 'fill-opacity': 0.9 }, sph); }
    for (let i = 0; i < 9; i++) { const a = (i / 9) * Math.PI * 2; mk('circle', { cx: f1(Math.cos(a) * 9), cy: f1(Math.sin(a) * 9), r: 2.2, fill: PINK, 'fill-opacity': 0.8 }, sph); }
    mk('path', { d: 'M-12 2 C-6 -10, 2 10, 9 -3 S 14 6, 12 -6', fill: 'none', stroke: '#C9D3E8', 'stroke-width': 1.3, 'stroke-linecap': 'round', opacity: 0.8 }, sph);
    const sphLab = mk('text', { x: f1(W / 2 + R + 14), y: cy + 4, class: 't-small', text: 'in a lipid nanoparticle', opacity: 0 }, g);
    V = { W, cy, strandG, slots, sph, sphLab };
  }

  // ---------------------------------------------------------------- render: proxies + game state → DOM
  function render() {
    if (!B || !V) return;
    const ix = stepIx;
    const o = outcome();
    const P = getPlan();
    const intro = S.intro.p, make = S.make.p, flip = S.flip.p, arrive = S.arrive.p, kill = S.kill.p, grow = S.grow.p, outP = S.outcome.p;
    const effIds = o.ids;
    const tested = (id) => effIds.includes(id) && flip > 0;
    // --- tree
    const T = B.tree;
    T.g.setAttribute('opacity', f1(local(intro, 0, 0.35) * 100) / 100);
    const tr = easeIO(local(intro, 0.05, 0.5));
    T.tBand.setAttribute('stroke-dasharray', `${f1(T.trunkLen * tr)} 4000`);
    for (const k of ['B', 'C']) {
      T.links[k].setAttribute('opacity', f1(0.92 * local(intro, 0.35, 0.6) * 100) / 100);
      T.nodes[k].g.setAttribute('opacity', f1(local(intro, 0.45, 0.65) * 100) / 100);
      T.nodes[k].ring.setAttribute('opacity', f1(o.cov[k] ? local(arrive, 0.3, 0.9) : 0) || 0);
    }
    const trunkHit = o.ok.some((id) => MUTS[id - 1].loc === 'T');
    T.tGlow.setAttribute('stroke-opacity', f1((trunkHit ? 0.35 * local(arrive, 0.3, 0.9) : 0) * 100) / 100);
    const hotLoc = hot != null && ix <= 1 ? MUTS[hot - 1].loc : null;
    MUTS.forEach((m, i) => {
      const mm = T.marks[m.id];
      const shown = local(intro, 0.5 + i * 0.04, 0.68 + i * 0.04);
      const picked = (ix <= 1 ? picks : effIds).includes(m.id);
      const fi = flipAt(m.id, effIds, flip);
      const succ = m.resp[patient];
      let fill = PALE, numFill = INK_DARK, glow = 0, okO = 0, noO = 0, op = shown;
      if (picked && ix >= 1) { fill = PINK; numFill = '#fff'; glow = 0.28; }
      if (ix >= 2 && effIds.includes(m.id)) {
        if (fi > 0.5) { if (succ) { okO = 1; } else { fill = '#3A4263'; numFill = '#A9B1CC'; glow = 0; noO = 1; } }
      } else if (ix >= 2) op = shown * 0.55;
      if (hot === m.id && ix <= 1) glow = Math.max(glow, 0.22);
      mm.disc.setAttribute('fill', fill);
      mm.num.style.fill = numFill;
      mm.glow.setAttribute('opacity', glow);
      mm.ok.setAttribute('opacity', okO);
      mm.no.setAttribute('opacity', noO);
      mm.g.setAttribute('opacity', f1(op * 100) / 100);
    });
    // --- tumor
    B.tumorG.setAttribute('opacity', f1(local(intro, 0.15, 0.45) * 100) / 100);
    const n = B.cells.length;
    B.cells.forEach((c, i) => {
      const a = local(intro, 0.2 + (i / n) * 0.45, 0.4 + (i / n) * 0.45);
      let dim = 1;
      if (hotLoc && hotLoc !== 'T' && hotLoc !== c.br) dim = 0.28;
      const isCov = P.covered.has(c);
      const surv = P.survivors.has(c);
      const dl = P.delay.get(c) ?? 0;
      const lk = isCov ? local(kill, dl, dl + 0.45) : 0;
      const ringO = isCov ? (surv ? local(kill, dl, dl + 0.15) : local(kill, dl, dl + 0.12) * (1 - local(kill, dl + 0.2, dl + 0.45))) : 0;
      const dieP = isCov && !surv ? local(lk, 0.18, 1) : 0;
      c.w.setAttribute('opacity', f1(a * dim * 100) / 100);
      const sc = 0.6 + 0.4 * easeOut(a);
      c.inner.setAttribute('transform', `scale(${Math.round(sc * 100) / 100})`);
      const hotOn = hotLoc && (hotLoc === 'T' || hotLoc === c.br) && ix <= 1;
      c.ring.setAttribute('stroke', hotOn ? '#FFD1E0' : BLUE);
      c.ring.setAttribute('stroke-width', hotOn ? 1.4 : 2);
      c.ring.setAttribute('opacity', f1((hotOn ? 0.55 : ringO) * 100) / 100);
      c.hatch.setAttribute('opacity', f1(0.55 * (1 - local(dieP, 0, 0.35)) * 100) / 100);
      const pk = Math.round(dieP * 100) / 100;
      const was = B.lastP.get(c) ?? 0;
      if (was !== pk) {
        B.lastP.set(c, pk);
        if (pk === 0) {
          // back to a living cell: a fresh drawing (same seed) so the DOM is exactly the original
          const fresh = c.art();
          c.inner.replaceChild(fresh, c.cell);
          c.cell = fresh;
        } else setDying(c.cell, pk, { remnants: false, seed: c.i + 1 });
      }
    });
    for (const k of ['B', 'C']) B.patchG[k].setAttribute('opacity', f1((o.cov[k] ? 1 - 0.82 * local(kill, 0.35, 0.95) : 1) * (hotLoc && hotLoc !== 'T' && hotLoc !== k ? 0.4 : 1) * 100) / 100);
    B.badges.forEach((b) => {
      const cleared = o.cov[b.k] && kill > 0.6;
      const dim = hotLoc && hotLoc !== 'T' && hotLoc !== b.k ? 0.3 : 1;
      b.g.setAttribute('opacity', f1(local(intro, 0.75, 0.95) * dim * (cleared ? 0.35 : 1) * 100) / 100);
    });
    // buds
    P.allBuds.forEach((b) => {
      const j = P.budOrder.indexOf(b);
      if (j < 0) { b.w.setAttribute('opacity', 0); b.inner.setAttribute('transform', 'scale(0.3)'); return; }
      const t = local(grow, (j / Math.max(1, P.budOrder.length)) * 0.6, (j / Math.max(1, P.budOrder.length)) * 0.6 + 0.4);
      b.w.setAttribute('opacity', f1(Math.min(1, t * 2.2) * 100) / 100);
      b.inner.setAttribute('transform', `scale(${Math.round((0.3 + 0.7 * easeOut(t)) * 100) / 100})`);
    });
    // T cells
    B.tcells.forEach((t, i) => {
      const tgt = P.tTargets[i];
      if (!tgt) { t.w.setAttribute('opacity', 0); t.w.setAttribute('transform', 'translate(-60 0)'); return; }
      const a = easeIO(local(arrive, i * 0.12, 0.64 + i * 0.12));
      const sx = L.tumor.x0 - 30, sy = tgt.y + (i % 2 ? 26 : -20);
      t.w.setAttribute('transform', `translate(${f1(sx + (tgt.x - sx) * a)} ${f1(sy + (tgt.y - sy) * a)})`);
      t.w.setAttribute('opacity', f1(Math.min(1, a * 4) * 100) / 100);
    });
    // --- cards
    cards.forEach((c) => {
      const m = c.m;
      const rk = ranked().findIndex((q) => q.id === m.id);
      const a = local(intro, 0.3 + rk * 0.05, 0.55 + rk * 0.05);
      const isPicked = (ix >= 2 ? effIds : picks).includes(m.id);
      const lockedOut = ix >= 2 && !effIds.includes(m.id);
      c.el.style.opacity = String(f1(a * (lockedOut ? 1 - 0.6 * local(make, 0, 0.4) : 1) * 100) / 100);
      c.el.setAttribute('aria-pressed', String(isPicked));
      c.el.setAttribute('aria-disabled', String(ix !== 1 && ix !== 0));
      c.el.classList.toggle('is-hot', hot === m.id && ix <= 1);
      const slotN = (ix >= 2 ? effIds : picks).indexOf(m.id);
      c.slot.hidden = slotN < 0;
      c.slot.textContent = slotN >= 0 ? String(slotN + 1) : '';
      // result row (flips in after "Make & test")
      const fi = flipAt(m.id, effIds, flip);
      const key = ix >= 2 && effIds.includes(m.id) && fi > 0.5 ? (m.resp[patient] ? 'yes' : 'no') : ix >= 2 && effIds.includes(m.id) ? 'wait' : '';
      if (key !== c.resKey) {
        c.resKey = key;
        c.resrow.innerHTML = key === 'yes' ? `${ctx.ui.badgeHTML('yes', '')}${tcellSVG}<span>T cells responded</span>`
          : key === 'no' ? `${ctx.ui.badgeHTML('no', '')}<span style="color:var(--fg-3)">No response</span>` : key === 'wait' ? '<span style="color:var(--fg-3)">In the vaccine</span>' : '';
      }
      const rot = key === 'yes' || key === 'no' ? (1 - easeOut(local(fi, 0.5, 1))) * 90 : 0;
      c.resrow.style.transform = rot ? `perspective(300px) rotateX(${f1(rot)}deg)` : '';
    });
    // --- vaccine strand
    V.slots.forEach((s, i) => {
      const id = (ix >= 2 ? effIds : picks)[i];
      const filled = id != null;
      s.box.setAttribute('stroke', filled ? PINK : '#A9B1CC');
      s.box.setAttribute('stroke-opacity', filled ? 0.9 : 0.5);
      s.box.setAttribute('stroke-dasharray', filled ? 'none' : '3 3');
      s.lab.textContent = filled ? `M${id}` : String(i + 1);
      s.lab.style.fill = filled ? '#FFD1E0' : '#A9B1CC';
      const slide = filled && ix >= 2 ? easeOut(local(make, i * 0.08, 0.3 + i * 0.08)) : 0;
      s.beads.setAttribute('opacity', f1(slide * 100) / 100);
      s.beads.setAttribute('transform', `translate(0 ${f1(-16 * (1 - slide))})`);
      s.lab.setAttribute('opacity', f1((1 - slide) * 100) / 100);
    });
    const wrap = easeIO(local(make, 0.5, 1));
    const sc = 1 - 0.82 * wrap;
    V.strandG.setAttribute('transform', `translate(${f1(V.W / 2 * (1 - sc))} ${f1(V.cy * (1 - (0.3 + 0.7 * sc)))}) scale(${Math.round(sc * 1000) / 1000} ${Math.round((0.3 + 0.7 * sc) * 1000) / 1000})`);
    V.strandG.setAttribute('opacity', f1((1 - local(make, 0.75, 1)) * 100) / 100);
    V.sph.setAttribute('opacity', f1(local(make, 0.55, 0.95) * 100) / 100);
    V.sphLab.setAttribute('opacity', f1(local(make, 0.8, 1) * 100) / 100);
    // --- side panel: count, buttons
    count.textContent = ix >= 2 ? (o.auto ? 'Best-predicted four' : `${o.n} of ${MAX} chosen`) : `${picks.length} of ${MAX} chosen`;
    makeBtn.el.hidden = ix >= 2;
    makeBtn.disabled = !(ix === 1 && picks.length > 0);
    againBtn.el.hidden = ix < 2;
    resetBtn.el.hidden = ix < 2;
    ptBtns.forEach((b) => b.setAttribute('aria-disabled', String(ix !== 1)));
    root.classList.toggle('is-choosing', ix === 1);
    pickWrap.classList.toggle('is-choosing', ix === 1);
    // --- results panel
    const rk = `${ix}|${o.ids.join(',')}|${patient}`;
    if (res.dataset.key !== rk) { res.dataset.key = rk; res.innerHTML = resultHTML(ix, o); }
    const rOp = ix <= 1 ? 1 : ix === 2 ? local(flip, 0.6, 1) : local(outP, 0, 1);
    res.style.opacity = String(f1(rOp * 100) / 100);
  }
  // per-card flip progress: picked cards flip one after another
  function flipAt(id, ids, flip) {
    const j = ids.indexOf(id);
    if (j < 0) return 0;
    const n = ids.length;
    const a = (j / n) * 0.55;
    return local(flip, a, a + 0.45);
  }
  const hintSVG = '<svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.6" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M8 7.2v4M8 4.9v.2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
  function resultHTML(ix, o) {
    if (ix <= 0) return `<p class="pv-hint">${hintSVG}<span>Tumor DNA was compared with normal DNA from blood: these eight protein-changing mutations are found only in the tumor. Tap a card${root.classList.contains('is-compact') ? ' (below)' : ''} to see which cancer cells carry it.</span></p>`;
    if (ix === 1) return `<p class="pv-hint">${hintSVG}<span>Choose up to four mutations${root.classList.contains('is-compact') ? ' below' : ''}, then press Make &amp; test.</span></p>`;
    if (ix === 2) {
      return `${o.auto ? '<p>You didn’t choose, so this vaccine used the four with the best predicted binding.</p>' : ''}`
        + `<p class="pv-res__sum">${o.k} of your ${o.n} ${o.n === 1 ? 'pick' : 'picks'} triggered a T-cell response.</p><p>${TXT.kinder}</p>`;
    }
    const msg = o.all ? TXT.all : o.none ? TXT.none : TXT.some(o.cov.B ? 'C' : 'B');
    return `<p class="pv-res__sum">${msg}</p><p>${TXT.always}</p><p class="pv-res__status">Where things stand: ${STATUS['mrna-vaccine'].text}.</p>`;
  }

  // ---------------------------------------------------------------- stepper
  const stepper = ctx.ui.stepper({
    scene: svg,
    steps: [
      { enter(tl) { tl.fromTo(S.intro, { p: 0 }, { p: 1, duration: 2.6, ease: 'none' }); } },
      { enter(tl) { tl.fromTo(S.open, { p: 0 }, { p: 1, duration: 0.5 }); } },
      {
        enter(tl) {
          tl.fromTo(S.make, { p: 0 }, { p: 1, duration: 1.3, ease: 'none' });
          tl.fromTo(S.flip, { p: 0 }, { p: 1, duration: 1.6, ease: 'none' }, 1.4);
        },
      },
      {
        enter(tl) {
          tl.fromTo(S.arrive, { p: 0 }, { p: 1, duration: 1.4, ease: 'none' });
          tl.fromTo(S.kill, { p: 0 }, { p: 1, duration: 1.8, ease: 'none' }, 1.1);
          tl.fromTo(S.grow, { p: 0 }, { p: 1, duration: 2.0, ease: 'none' }, 2.7);
          tl.fromTo(S.outcome, { p: 0 }, { p: 1, duration: 0.5, ease: 'none' }, 3.2);
        },
      },
    ],
    onChange(i) {
      stepIx = i;
      if (i !== 1) vnote.textContent = '';
      if (i >= 1 && hot != null && !picks.includes(hot)) hot = null;
      const o = outcome();
      if (i === 2) ctx.announce(`${o.k} of ${o.n} picks triggered a T-cell response.`);
      if (i === 3) ctx.announce(o.all ? TXT.all : o.none ? TXT.none : TXT.some(o.cov.B ? 'C' : 'B'));
      render();
    },
  });

  // ---------------------------------------------------------------- layout & lifecycle
  let lastKey = '';
  function relayout() {
    const compact = (ctx.width || 900) < 600;
    root.classList.toggle('is-compact', compact);
    pickWrap.classList.toggle('is-compact', compact);
    if (compact && pick.parentElement !== pickWrap) { pickWrap.append(pick); ctx.controls.append(pickWrap); }
    else if (!compact && pick.parentElement !== root) { root.append(pick); pickWrap.remove(); }
    const key = `${compact}|${Math.round(bio.clientWidth)}`;
    if (key === lastKey) return;
    lastKey = key;
    buildBio();
    buildVax();
    planKey = '';
    render();
  }
  ctx.onResize(() => relayout());
  applyPatient(false);
  relayout();
  if (document.fonts?.ready) document.fonts.ready.then(() => { if (!ctx.signal.aborted) render(); });
  return { stepper };
}
