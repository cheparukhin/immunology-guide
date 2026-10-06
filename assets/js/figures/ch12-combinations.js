// ch12-combinations — "Fix the cycle" (Chapter 12). FIGURE-AUDIT §2B: the book's only
// prescribing figure (ch07-cycle learns, ch12-resistance diagnoses, this one TREATS).
// Wheel-led: pick a tumor profile, add up to three treatments from a tray of seven.
//
//   • Every model number, mapping and status string comes from shared/cycle-data.js
//     (PROFILES, TRAY, evaluateCombination, STATUS), so Chapters 7 and 12 never disagree.
//   • The weakest step sets tumor control (min over steps), side effects add up; both are
//     shown as shared activity meters tagged "Illustrative, not measured" — never numbers.
//   • Strength bars sit beside the profile's weak steps (circle layout); on phones the
//     wheel's own thin strength arcs take their place.
//   • Real-world cards (verbatim) stack, most recent first, when their pairing is chosen.
import { cancerCell, antibody, tCell, car, virus, rna, PALETTE } from '../art/index.js';
import { createCycleWheel } from './shared/cycle-wheel.js';
import { meter } from './shared/activity-meter.js';
import * as CD from './shared/cycle-data.js';

const ID = 'ch12-combinations';
const f = (v) => String(Math.round(v * 100) / 100);
const NS = 'http://www.w3.org/2000/svg';

const PROMPT = 'Pick a tumor and add up to three treatments. Which breaks can you repair, and what does it cost in side effects?';
const FOOTNOTE = 'A teaching model with made-up numbers, in which the weakest step sets the pace. Real tumors are messier: steps are rarely all-or-nothing, a strong step can partly make up for a weak one, and different parts of one tumor can fail differently. Not a prediction for any patient.';
// Declutter (VISITOR-REVIEW-B #11): one visible line (it still names the weakest-link rule and
// says "Illustrative, not measured" once for both meters); the full footnote sits behind an
// info toggle, together with how to read the red rings.
const DISCLAIMER = 'Illustrative, not measured: a teaching model in which the weakest step sets the pace.';
const RING_KEY = 'A thicker red ring around a step means that step is weaker in this model; it thins as treatments strengthen the step.';
const TIER = {
  growing: { kind: 'no', label: 'Tumor keeps growing' },
  partial: { kind: 'partial', label: 'Partial control' },
  strong: { kind: 'yes', label: 'Strong response' },
};
const SIDE = {
  manageable: { kind: 'yes', label: 'Manageable' },
  substantial: { kind: 'partial', label: 'Substantial' },
  'too-much': { kind: 'no', label: 'Often too much to continue' },
};
const TOO_MUCH = 'In practice, a regimen like this would often be stopped because of side effects.';
const EXCLUDED_NOTE = 'No treatment on this tray fully lowers the barrier around an excluded tumor. Much current research is aimed at this problem.';

const CSS = `
[data-figure="${ID}"] .fig__stage { padding: clamp(12px, 2.2%, 24px); }
[data-figure="${ID}"] .c12 { position: relative; z-index: 1; display: grid; gap: 14px 26px;
  grid-template-columns: minmax(0, 55fr) minmax(0, 45fr); grid-template-areas: "head head" "wheel panel"; align-items: start;
  --ink: var(--fg); --ink-2: var(--fg-2); --ink-3: var(--fg-3); --rule-strong: rgb(169 177 204 / 0.4); --rule: rgb(169 177 204 / 0.22);
  --surface: #161E42; --paper: #0B1024; --paper-2: rgb(255 255 255 / 0.07); --accent: #A3B2FF; --accent-soft: rgb(163 178 255 / 0.2); color: var(--fg); }
[data-figure="${ID}"] .c12-head { grid-area: head; display: grid; gap: 8px; min-width: 0; }
[data-figure="${ID}"] .c12-head .chips__tray { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
[data-figure="${ID}"] .c12-head .chip--card { min-width: 0; padding: 0.55rem 0.7rem; }
/* radios (role=radio, aria-checked): the chips' pressed look, without the invalid aria-pressed */
[data-figure="${ID}"] .chip[role="radio"][aria-checked="true"] { background: var(--accent-soft); border-color: var(--accent); color: var(--ink); box-shadow: inset 0 0 0 1px var(--accent); }
[data-figure="${ID}"] .chip[role="radio"][aria-checked="true"] .chip__icon { color: var(--accent); }
[data-figure="${ID}"] .chip--card[role="radio"][aria-checked="true"] .chip__desc { color: var(--ink-2); }
[data-figure="${ID}"] .c12-head .chip__desc { color: var(--fg-3); }
[data-figure="${ID}"] .c12-head .chip__icon { color: var(--fg-2); }
[data-figure="${ID}"] .c12-head .chip__icon svg { width: 1.05rem; height: 1.05rem; }
[data-figure="${ID}"] .c12-select-wrap { display: none; align-items: center; gap: 10px; }
[data-figure="${ID}"] .c12-select-wrap label { font-family: var(--font-ui); font-size: var(--text-xs); font-weight: 600; color: var(--fg-2); }
[data-figure="${ID}"] .c12-select { flex: 1 1 auto; min-width: 0; min-height: 2.75rem; padding: 0 0.7rem; border-radius: 10px; border: 1px solid var(--rule-strong);
  background: #161E42; color: var(--fg); font-family: var(--font-ui); font-size: var(--text-sm); font-weight: 600; width: 0; flex-basis: 0; }
[data-figure="${ID}"] .c12-select:focus-visible { outline: 2px solid var(--stage-focus); outline-offset: 2px; }
[data-figure="${ID}"] .c12-desc { margin: 0; font-family: var(--font-ui); font-size: var(--text-sm); color: var(--fg-2); line-height: 1.45; }
[data-figure="${ID}"] .c12-desc b { color: var(--fg); font-weight: 650; margin-right: 0.4em; }
[data-figure="${ID}"] .c12-wheel { grid-area: wheel; min-width: 0; align-self: center; }
[data-figure="${ID}"] .c12-panel { grid-area: panel; min-width: 0; display: grid; gap: 14px; align-content: start; padding-top: 6px; }
[data-figure="${ID}"] .c12-meter { display: grid; gap: 6px; }
[data-figure="${ID}"] .c12-mh { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 2px 12px; }
[data-figure="${ID}"] .c12-mt { font-family: var(--font-ui); font-size: var(--text-2xs); font-weight: 650; letter-spacing: var(--tracking-caps); text-transform: uppercase; color: var(--fg); }
[data-figure="${ID}"] .c12-tag { font-family: var(--font-ui); font-size: 0.6875rem; font-weight: 650; letter-spacing: var(--tracking-caps); text-transform: uppercase; color: var(--fg-3); }
[data-figure="${ID}"] .c12-meter .so-meter-svg { width: 100%; height: auto; }
[data-figure="${ID}"] .c12-read { display: flex; align-items: center; gap: 8px; min-height: 1.6rem; }
[data-figure="${ID}"] .c12-read .badge { white-space: normal; }
[data-figure="${ID}"] .c12-msg { margin: 2px 0 0; font-family: var(--font-ui); font-size: var(--text-sm); line-height: 1.5; color: var(--fg); min-height: 3em; }
[data-figure="${ID}"] .c12-msg .c12-warn { display: block; margin-top: 0.35em; color: #FF9EA3; }
[data-figure="${ID}"] .c12-disc { display: flex; align-items: center; gap: 4px; margin: -4px 0 0; font-family: var(--font-ui); font-size: var(--text-2xs); line-height: 1.45; color: var(--fg-3); }
[data-figure="${ID}"] .c12-disc .c12-info { flex-shrink: 0; color: var(--fg-2); }
[data-figure="${ID}"] .c12-disc .c12-info[aria-expanded="true"] { color: var(--fg); }
[data-figure="${ID}"] .c12-more { display: grid; gap: 6px; padding: 8px 11px; border-radius: 10px; background: rgb(255 255 255 / 0.045); box-shadow: inset 0 0 0 1px rgb(169 177 204 / 0.18);
  font-family: var(--font-ui); font-size: var(--text-2xs); line-height: 1.5; color: var(--fg-2); }
[data-figure="${ID}"] .c12-more[hidden] { display: none; }
[data-figure="${ID}"] .c12-more p { margin: 0; }
[data-figure="${ID}"] .c12-strip { display: none; flex: 1 1 100%; flex-wrap: wrap; align-items: center; gap: 6px 8px; padding: 8px 10px; border-radius: 12px;
  background: var(--surface); box-shadow: 0 0 0 1px var(--rule), 0 6px 14px -10px rgb(0 0 0 / 0.35); font-family: var(--font-ui); font-size: var(--text-xs); color: var(--ink-2);
  position: sticky; top: calc(var(--header-h, 3.5rem) + 6px); z-index: 2; }
[data-figure="${ID}"] .c12-strip__k { font-weight: 650; color: var(--ink-3); font-size: var(--text-2xs); text-transform: uppercase; letter-spacing: var(--tracking-caps); }
[data-figure="${ID}"] .c12-strip__s { flex: 1 1 100%; font-weight: 600; color: var(--ink); }
[data-figure="${ID}"] .c12-cards { display: grid; gap: 10px; }
[data-figure="${ID}"] .c12-cards-h { margin: 4px 0 0; font-family: var(--font-ui); font-size: var(--text-2xs); font-weight: 650; letter-spacing: var(--tracking-caps); text-transform: uppercase; color: var(--fg-3); }
[data-figure="${ID}"] .c12-card { margin: 0; padding: 10px 12px; border-radius: 12px; background: rgb(255 255 255 / 0.045); box-shadow: inset 0 0 0 1px rgb(169 177 204 / 0.2);
  font-family: var(--font-body); font-size: var(--text-sm); line-height: 1.5; color: var(--fg-2); }
[data-figure="${ID}"] .c12-card.is-new { animation: fade-up var(--dur-3) var(--ease-out); }
[data-figure="${ID}"] .c12-card b { display: block; margin-bottom: 2px; font-family: var(--font-ui); font-size: var(--text-xs); font-weight: 650; color: var(--fg); }
[data-figure="${ID}"] .c12-card a { color: #B9C5FF; }
[data-figure="${ID}"] .c12-empty { margin: 0; font-family: var(--font-ui); font-size: var(--text-xs); color: var(--fg-3); font-style: italic; }
[data-figure="${ID}"] .c12-wheel .cw-gauge, [data-figure="${ID}"] .c12-wheel .cw-gauge-track { display: none; }
[data-figure="${ID}"] .c12-prompt { flex: 1 1 100%; margin: 0; font-family: var(--font-body); font-size: var(--text-sm); line-height: 1.5; color: var(--ink-2); }
[data-figure="${ID}"] .c12-tray { flex: 1 1 100%; }
[data-figure="${ID}"] .c12-tray .chips__tray { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
[data-figure="${ID}"] .c12-tray .chip--card { position: relative; min-width: 0; min-height: 3.9rem; padding: 0.6rem 1.9rem 0.6rem 0.65rem; }
[data-figure="${ID}"] .c12-tray .chip__icon { width: 2.4rem; height: 1.9rem; margin-top: 0; flex-shrink: 0; display: grid; place-items: center; }
[data-figure="${ID}"] .c12-tray .chip__icon svg { width: 2.4rem; height: 1.9rem; }
[data-figure="${ID}"] .c12-tray .chip[aria-pressed="true"] { background: color-mix(in srgb, #F2B33D 13%, var(--surface)); border-color: #C9962F; box-shadow: inset 0 0 0 1.5px #F2B33D; }
[data-figure="${ID}"] .c12-tray .chip[aria-pressed="true"]::after { content: ""; position: absolute; top: 0.45rem; right: 0.45rem; width: 1.1rem; height: 1.1rem; border-radius: 50%;
  background: #F2B33D url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230B1024' stroke-width='3.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 12.5l4.5 4.5L19 7.5'/%3E%3C/svg%3E") center / 0.75rem no-repeat; }
[data-figure="${ID}"] .c12-tray.is-full .chip[aria-pressed="false"] { opacity: 0.55; }
[data-figure="${ID}"] .c12-row { flex: 1 1 100%; display: flex; align-items: center; gap: 12px; }
[data-figure="${ID}"] .c12-count { font-family: var(--font-ui); font-size: var(--text-xs); font-weight: 600; color: var(--ink-2); font-variant-numeric: tabular-nums; }
@container fig (max-width: 899.98px) {
  [data-figure="${ID}"] .c12 { grid-template-columns: minmax(0, 1fr); grid-template-areas: "head" "wheel" "panel"; }
  [data-figure="${ID}"] .c12-wheel { max-width: 600px; justify-self: center; width: 100%; }
}
@container fig (max-width: 599.98px) {
  [data-figure="${ID}"] .fig__stage { padding: 12px 10px; }
  [data-figure="${ID}"] .c12-head .chips { display: none; }
  [data-figure="${ID}"] .c12-select-wrap { display: flex; }
  [data-figure="${ID}"] .c12-strip { display: flex; }
  [data-figure="${ID}"] .c12-wheel { max-width: 340px; }
  [data-figure="${ID}"] .c12-tray .chips__tray { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  [data-figure="${ID}"] .c12-tray .chip--card { min-height: 3.2rem; padding: 0.5rem 1.7rem 0.5rem 0.5rem; }
  [data-figure="${ID}"] .c12-tray .chip--card .chip__desc { display: none; }
  [data-figure="${ID}"] .c12-tray .chip--card[aria-pressed="true"] .chip__desc { display: block; }
  [data-figure="${ID}"] .c12-tray .chip__icon, [data-figure="${ID}"] .c12-tray .chip__icon svg { width: 2rem; height: 1.6rem; }
}
`;

function injectCSS() {
  if (document.getElementById(`${ID}-style`)) return;
  const s = document.createElement('style');
  s.id = `${ID}-style`;
  s.textContent = CSS;
  document.head.append(s);
}

const svgEl = (tag, attrs = {}, parent) => {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) if (v != null) e.setAttribute(k, String(v));
  if (parent) parent.append(e);
  return e;
};

/** "(Chapter 8)" → linked chapter references; the wording itself is unchanged. */
function linkChapters(text) {
  const esc = text.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  return esc.replace(/Chapters? (\d+)(?: and (\d+))?/g, (m, a, b) => {
    const link = (n) => (CD.CHAPTERS[n] ? `<a href="${CD.CHAPTERS[n].href}">${n}</a>` : n);
    return b ? `Chapters ${link(a)} and ${link(b)}` : `Chapter ${link(a)}`;
  });
}

export default function mount(fig, ctx) {
  injectCSS();
  const { gsap, h } = ctx;
  ctx.setAspect('auto');
  ctx.stage.classList.add('is-auto-height');
  const { PROFILES, TRAY, STEPS, STATUS, evaluateCombination } = CD;
  const mech = (id) => (CD.mechanism ? CD.mechanism(id) : CD.MECHANISMS.find((m) => m.id === id)) || {};

  // ---------------------------------------------------------------- state
  let profileId = PROFILES[0].id;
  let chosen = [];
  let cardOrder = [];
  let ev = evaluateCombination(profileId, chosen);
  let compact = ctx.compact;

  // ---------------------------------------------------------------- stage layout
  const grid = h('div', { class: 'c12' });
  const head = h('div', { class: 'c12-head' });
  const wheelBox = h('div', { class: 'c12-wheel' });
  const panel = h('div', { class: 'c12-panel' });
  grid.append(head, wheelBox, panel);
  ctx.stage.append(grid);

  // profile picker: card chips (desktop) + native select (phones), kept in sync
  const profileChips = ctx.ui.chips({
    label: 'Tumor profile',
    hideLabel: true,
    variant: 'card',
    required: true,
    value: profileId,
    parent: head,
    options: PROFILES.map((p) => {
      const m = mech(p.mechanism);
      return { value: p.id, label: p.label, desc: m.title ? `Resistance: ${m.title}` : p.term, icon: m.icon || 'figure' };
    }),
    onChange: (v) => { if (v) setProfile(v); },
  });
  const ptray = profileChips.el.querySelector('.chips__tray');
  ptray.setAttribute('role', 'radiogroup');
  ptray.setAttribute('aria-label', 'Tumor profile');
  const syncProfileRadios = () => PROFILES.forEach((p) => {
    const b = profileChips.buttons.get(p.id);
    b.setAttribute('role', 'radio');
    b.removeAttribute('aria-pressed');            // chips paint aria-pressed; it is invalid on role=radio (axe)
    b.setAttribute('aria-checked', String(p.id === profileId));
    b.tabIndex = p.id === profileId ? 0 : -1;
  });
  ptray.addEventListener('keydown', (e) => {
    const i = PROFILES.findIndex((p) => p.id === profileId);
    let j = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = (i + 1) % PROFILES.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = (i - 1 + PROFILES.length) % PROFILES.length;
    if (j == null) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    setProfile(PROFILES[j].id);
    profileChips.buttons.get(PROFILES[j].id).focus();
  }, { capture: true, signal: ctx.signal });

  const selId = `${ID}-sel-${Math.random().toString(36).slice(2, 7)}`;
  const select = h('select', { class: 'c12-select', id: selId });
  PROFILES.forEach((p) => select.append(h('option', { value: p.id }, `${p.id} · ${p.label}`)));
  select.addEventListener('change', () => setProfile(select.value), { signal: ctx.signal });
  head.append(h('div', { class: 'c12-select-wrap' }, h('label', { for: selId }, 'Tumor'), select));
  const desc = h('p', { class: 'c12-desc' });
  head.append(desc);

  // wheel
  const wheel = createCycleWheel(ctx, wheelBox, { density: 'full', size: 600, flow: 0.2, label: 'Cancer-immunity cycle: tumor profile and treatments' });

  // panel: meters, outcome, footnote, cards
  const mkMeter = (title, count, domain, tone) => {
    const box = h('div', { class: 'c12-meter' });
    const mh = h('div', { class: 'c12-mh' }, h('span', { class: 'c12-mt' }, title));
    const host = h('div');
    const read = h('div', { class: 'c12-read' });
    box.append(mh, host, read);
    panel.append(box);
    const m = meter(host, { mode: 'segments', count, width: 420, domain, tone, tag: null, title: '', values: domain[0] });
    const b = ctx.ui.badge({ kind: 'no', label: '', parent: read, size: 'md' });
    return { m, b };
  };
  const control = mkMeter('Tumor control (model)', 10, [0, 1], 'benefit');
  const side = mkMeter('Side effects', 12, [0, 6], 'risk');
  const footId = ctx.uid ? ctx.uid('foot') : `${ID}-foot`;
  const more = h('div', { class: 'c12-more', id: footId, hidden: true }, h('p', null, FOOTNOTE), h('p', null, RING_KEY));
  const disc = h('p', { class: 'c12-disc' }, h('span', null, DISCLAIMER));
  const info = ctx.ui.button({ label: 'About this model', icon: 'info', variant: 'ghost', small: true, iconOnly: true, parent: disc,
    onClick: () => { more.hidden = !more.hidden; info.el.setAttribute('aria-expanded', String(!more.hidden)); } });
  info.el.setAttribute('aria-expanded', 'false');
  info.el.setAttribute('aria-controls', footId);
  info.el.classList.add('c12-info');
  panel.append(disc, more);
  const msg = h('p', { class: 'c12-msg', 'aria-live': 'off' });
  panel.append(msg);
  const cardsBox = h('div', { class: 'c12-cards' });
  panel.append(cardsBox);

  // ---------------------------------------------------------------- tray (controls)
  ctx.controls.append(h('p', { class: 'c12-prompt' }, PROMPT));
  // phones (VISITOR-REVIEW-B #10): the wheel and meters scroll away above the tiles, so repeat
  // the result in one compact strip directly above them (hidden on wider stages)
  const strip = h('div', { class: 'c12-strip', 'aria-hidden': 'true' });
  ctx.controls.append(strip);
  const tray = ctx.ui.chips({
    label: 'Treatments',
    hideLabel: true,
    variant: 'card',
    multi: true,
    max: 3,
    options: TRAY.map((t) => ({ value: t.id, label: t.label, desc: t.subtitle, icon: 'plus' })),
    onChange: (v) => setChosen(v),
  });
  tray.el.classList.add('c12-tray');
  const row = h('div', { class: 'c12-row' });
  const count = h('span', { class: 'c12-count', 'aria-live': 'polite' });
  row.append(count);
  ctx.ui.button({ label: 'Reset', icon: 'reset', variant: 'ghost', small: true, parent: row, onClick: () => { tray.set([]); setChosen([]); } });
  ctx.controls.append(row);

  // tile icons: small art glyphs on the paper tray (palette rules: gold Ys with a white
  // outline for antibodies, a thin beam, a droplet and a red-coral virus, an mRNA strand,
  // a blue T cell with a synthetic receptor, a capsule)
  function tileIcon(id) {
    const stage = ctx.theme === 'dark' ? 'dark' : 'light';
    const s = svgEl('svg', { viewBox: '-30 -24 60 48', 'aria-hidden': 'true', focusable: 'false' });
    const put = (node, x, y, extra = '') => { node.setAttribute('transform', `translate(${x} ${y})${extra}`); s.append(node); return node; };
    const ink = stage === 'dark' ? '#C9D3E8' : '#4A5163';
    if (id === 'anti-pd1' || id === 'anti-ctla4') {
      put(antibody({ variant: 'therapeutic', size: 34, stage, detail: 'high' }), id === 'anti-pd1' ? 0 : 0, 17);
    } else if (id === 'kill-alert') {
      svgEl('path', { d: 'M-27 -20L-6 6', stroke: stage === 'dark' ? '#FFE6A6' : '#C9962F', 'stroke-width': 2.2, 'stroke-linecap': 'round' }, s);
      svgEl('path', { d: 'M-27 -20L-6 6', stroke: stage === 'dark' ? '#FFE6A6' : '#C9962F', 'stroke-width': 6, 'stroke-opacity': 0.22, 'stroke-linecap': 'round' }, s);
      svgEl('path', { d: 'M2 -18C7 -10 11 -6 11 -1A9 9 0 0 1 -7 -1C-7 -6 -3 -10 2 -18Z', fill: stage === 'dark' ? '#8FC8FF' : '#5B9BD5', 'fill-opacity': 0.85, stroke: ink, 'stroke-width': 1 }, s);
      put(virus({ r: 8, spikes: 10, seed: 3, stage, glow: false }), 19, 11);
    } else if (id === 'vaccine') {
      put(rna({ sequence: 'AUGGCUAG', rise: 6.4, stage }), 0, -3);
    } else if (id === 'gate-openers') {
      const c = stage === 'dark' ? '#D6C4AA' : '#8C7B66';
      for (const x of [-22, -16, 16, 22]) svgEl('path', { d: `M${x} -18C${x + 2} -8 ${x - 2} 8 ${x} 18`, stroke: c, 'stroke-width': 2.4, 'stroke-linecap': 'round', fill: 'none' }, s);
      svgEl('path', { d: 'M-12 0H11M5 -6L11 0L5 6', stroke: stage === 'dark' ? '#7FB0FF' : PALETTE.cd8, 'stroke-width': 2.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', fill: 'none' }, s);
    } else if (id === 'engineered') {
      put(tCell({ variant: 'cd8', r: 14, state: 'activated', seed: 6, stage, receptors: false, polarity: -90, glow: stage === 'dark' }), -6, 6);
      put(car({ size: 22, stage, generation: 2 }), -6, -9);
      put(car({ size: 18, stage, generation: 2 }), 9, -3, ' rotate(50)');
    } else if (id === 'ido-inhib') {
      const g = svgEl('g', { transform: 'rotate(-28)' }, s);
      svgEl('path', { d: 'M0 -8H-14A8 8 0 0 0 -14 8H0Z', fill: stage === 'dark' ? '#E9EEF8' : '#FFFFFF', stroke: ink, 'stroke-width': 1.2 }, g);
      svgEl('path', { d: 'M0 -8H14A8 8 0 0 1 14 8H0Z', fill: '#8FA2D6', stroke: ink, 'stroke-width': 1.2 }, g);
    }
    return s;
  }
  function paintTileIcons() {
    for (const t of TRAY) {
      const b = tray.buttons.get(t.id);
      const ic = b && b.querySelector('.chip__icon');
      if (!ic) continue;
      ic.replaceChildren(tileIcon(t.id));
    }
  }
  paintTileIcons();
  ctx.onThemeChange(() => paintTileIcons());

  // ---------------------------------------------------------------- wheel overlays (weakness rings, tumor icon)
  // Weakness = a soft red ring around the node, thicker the weaker the step (0 at ≥ 0.70, "ok");
  // drawn under the nodes so the wheel's own state ring and the gold drug rings stay on top.
  const shown = new Array(7).fill(0);                  // displayed strengths (animated)
  let barNodes = [];
  let tumorG = null, tumorS = null;
  let tumorScale = 0.85;
  const weakSteps = () => PROFILES.find((p) => p.id === profileId).strengths.map((v, i) => (v < 0.7 ? i + 1 : null)).filter(Boolean);
  const tierColor = (v) => (v < 0.4 ? '#E5484D' : v < 0.7 ? '#F2C14E' : '#3DDC97');

  function drawOverlays({ layout }) {
    const over = wheel.layers.over, under = wheel.layers.under;
    if (!over || !under) return;
    over.replaceChildren();
    under.querySelectorAll('[data-part="weak-ring"]').forEach((n) => n.remove());
    barNodes = [];
    const circle = layout === 'circle';
    const pts = [1, 2, 3, 4, 5, 6, 7].map((k) => wheel.nodePoint(k)).filter(Boolean);
    const c = { x: pts.reduce((a, q) => a + q.x, 0) / (pts.length || 1), y: pts.reduce((a, q) => a + q.y, 0) / (pts.length || 1) };
    // tumor icon in the middle of the loop
    tumorG = svgEl('g', { transform: `translate(${f(c.x)} ${f(circle ? c.y - 58 : c.y + 8)})`, 'data-ambient': '' }, over);
    tumorS = svgEl('g', {}, tumorG);
    tumorS.append(cancerCell({ r: circle ? 24 : 26, seed: 12, stage: 'dark', mhc: 3 }));
    paintTumor();
    for (const k of weakSteps()) {
      const p = wheel.nodePoint(k);
      if (!p) continue;
      const ring = svgEl('circle', { cx: f(p.x), cy: f(p.y), r: f(p.r), fill: 'none', stroke: '#E5484D', 'stroke-opacity': 0.42, 'data-part': 'weak-ring', 'aria-hidden': 'true' }, under);
      barNodes.push({ k, ring, r0: p.r });
    }
    paintBars();
  }
  function paintBars() {
    for (const b of barNodes) {
      const v = Math.max(0, Math.min(1, shown[b.k - 1]));
      const st = ev.states[b.k - 1].state;
      const weak = st === 'skipped' || st === 'replaced' ? 0 : Math.max(0, (0.7 - v) / 0.7);    // 1 at 0, 0 at ≥ 0.70
      const w = weak * b.r0 * 0.55;
      b.ring.setAttribute('stroke-width', f(w));
      b.ring.setAttribute('r', f(b.r0 * 1.14 + 3 + w / 2));                                   // outside the (selected) disc
      b.ring.setAttribute('opacity', w < 0.3 ? 0 : 1);
    }
  }
  function paintTumor() { if (tumorS) tumorS.setAttribute('transform', `scale(${f(tumorScale)})`); }
  wheel.onLayout(drawOverlays);

  let barTween = null;
  function animateBars(target, instant) {
    if (barTween) barTween.kill();
    if (instant || ctx.reducedMotion) { target.forEach((v, i) => { shown[i] = v; }); paintBars(); return; }
    const from = shown.slice();
    const st = { p: 0 };
    barTween = gsap.to(st, { p: 1, duration: 0.4, ease: 'so.out', onUpdate: () => { target.forEach((v, i) => { shown[i] = from[i] + (v - from[i]) * st.p; }); paintBars(); } });
  }

  // lap pulses and the tumor icon (strong: shrinks a little each lap; growing: slowly enlarges)
  let phase = 0;
  ctx.loop((dt) => {
    if (ev.tier === 'strong') {
      phase += (dt * 0.42 * Math.max(0.15, ev.control)) / 7;
      if (phase >= 1) { phase -= 1; wheel.pulse(7, 'lap'); tumorScale = Math.max(0.2, tumorScale * 0.86); }
    } else if (ev.tier === 'growing') {
      tumorScale = Math.min(1.3, tumorScale + dt * 0.01);
      phase = 0;
    } else phase = 0;
    paintTumor();
  });

  // ---------------------------------------------------------------- real-world cards
  const vaccineCard = () => {
    const st = STATUS['mrna-vaccine'] || STATUS.vaccine || {};
    if (st.card) return st.card;
    return `${st.text} (Chapter 11).`;
  };
  const CARDS = [
    { id: 'pd1-ctla4', title: 'Anti-PD-1 + Anti-CTLA-4', when: (s) => s.has('anti-pd1') && s.has('anti-ctla4'),
      text: 'Approved together for several cancers, including melanoma and kidney cancer. More effective in some settings — with markedly more side effects (Chapter 8).' },
    { id: 'pd1-kill', title: 'Anti-PD-1 + Kill and alert', when: (s) => s.has('anti-pd1') && s.has('kill-alert'),
      text: 'Chemotherapy plus a PD-1 or PD-L1 blocker is a standard first treatment for many lung cancers, and a PD-L1 blocker after chemoradiation is standard for some stage III lung cancers. But adding an oncolytic virus to pembrolizumab did not extend survival in a large melanoma trial (Chapter 11).' },
    { id: 'pd1-gates', title: 'Anti-PD-1 + Gate openers', when: (s) => s.has('anti-pd1') && s.has('gate-openers'),
      text: 'PD-1/PD-L1 blockers combined with VEGF-blocking drugs are approved for some kidney, liver and endometrial cancers. Drugs that block TGF-β have not yet succeeded in patients.' },
    { id: 'pd1-vaccine', title: 'Anti-PD-1 + Cancer vaccine', when: (s) => s.has('anti-pd1') && s.has('vaccine'), text: vaccineCard() },
    { id: 'engineered', title: 'Engineered killers', when: (s) => s.has('engineered'),
      text: 'They need a surface target that the cancer cells carry and healthy cells largely lack. Several are approved for blood cancers, and a T-cell engager for small-cell lung cancer, a ‘cold’ tumor (Chapters 9 and 10). Getting them into other solid tumors is the hard part.' },
    { id: 'ido', title: 'IDO inhibitor', when: (s) => s.has('ido-inhib'),
      text: 'It aimed at step 7 and looked impressive in an early trial without a comparison group. In a large randomized trial it added nothing (Chapter 8). A sensible mechanism is not proof.' },
  ];
  function paintCards() {
    const set = new Set(chosen);
    const active = CARDS.filter((c) => c.when(set)).map((c) => c.id);
    const fresh = active.filter((id) => !cardOrder.includes(id));
    cardOrder = [...fresh.reverse(), ...cardOrder.filter((id) => active.includes(id))];
    const prev = new Set([...cardsBox.querySelectorAll('.c12-card')].map((n) => n.dataset.id));
    cardsBox.replaceChildren();
    cardsBox.append(h('p', { class: 'c12-cards-h' }, 'What real trials found'));
    if (!cardOrder.length) {
      cardsBox.append(h('p', { class: 'c12-empty' }, 'Choose a tested pairing to see what real trials found.'));
      return;
    }
    for (const id of cardOrder) {
      const c = CARDS.find((x) => x.id === id);
      const p = h('p', { class: `c12-card${prev.has(id) || ctx.reducedMotion ? '' : ' is-new'}`, dataset: { id } });
      p.innerHTML = `<b>${c.title}</b>${linkChapters(c.text)}`;
      cardsBox.append(p);
    }
  }

  // ---------------------------------------------------------------- render the model
  function outcomeText() {
    const k = ev.limiting;
    const name = STEPS[k - 1] ? STEPS[k - 1].short : '';
    let t;
    if (ev.tier === 'growing') t = `The cycle still stalls at step ${k}: ${name}. Nothing chosen repairs it or makes it unnecessary.`;
    else if (ev.tier === 'partial') t = profileId === 'B' && chosen.includes('gate-openers') ? EXCLUDED_NOTE : `Better — but step ${k} is only partly repaired.`;
    else t = 'Every step works well enough in this model.';
    return t;
  }
  function render({ instant = false, announce = true } = {}) {
    ev = evaluateCombination(profileId, chosen);
    const p = PROFILES.find((x) => x.id === profileId);
    const m = mech(p.mechanism);
    // header
    desc.replaceChildren();
    desc.append(h('b', null, `${p.label}.`), h('span', null, p.description));
    select.value = profileId;
    profileChips.set(profileId);
    syncProfileRadios();
    // wheel
    const weak = new Set(weakSteps());
    wheel.setStates(ev.states.map((s) => ({ ...s, strength: weak.has(s.step) ? s.strength : null })), { instant });
    wheel.ring(ev.rings.acts.map((r) => (r.count >= 2 ? r : { step: r.step })), 'acts');
    wheel.ring(ev.rings.also, 'also');
    wheel.ring(ev.rings.entersAt, 'entersAt');
    wheel.setFlow(Math.max(0.15, ev.control));
    const lim = STEPS[ev.limiting - 1];
    wheel.setCenter(ev.tier === 'partial' ? `Slowed at step ${ev.limiting}:\n${lim.short}` : ev.tier === 'strong' ? 'Cycle running' : null);
    wheel.selectStep(ev.tier === 'strong' ? null : ev.limiting, { instant });
    animateBars(ev.strengths, instant);
    // meters
    const dur = instant ? 0 : 0.6;
    control.m.set(ev.control, { duration: dur });
    side.m.set(Math.min(6, ev.sideEffects), { duration: dur });
    control.b.set(TIER[ev.tier].kind, TIER[ev.tier].label);
    side.b.set(SIDE[ev.sideTier].kind, SIDE[ev.sideTier].label);
    if (ctx.reducedMotion) tumorScale = ev.tier === 'strong' ? 0.45 : ev.tier === 'partial' ? 0.8 : 1.1;
    paintTumor();
    // message
    msg.replaceChildren(document.createTextNode(outcomeText()));
    if (ev.sideEffects > 4) msg.append(h('span', { class: 'c12-warn' }, TOO_MUCH));
    // tray
    strip.innerHTML = `<span class="c12-strip__k">Tumor</span>${ctx.ui.badgeHTML(TIER[ev.tier].kind, TIER[ev.tier].label, 'sm')}`
      + `<span class="c12-strip__k">Side effects</span>${ctx.ui.badgeHTML(SIDE[ev.sideTier].kind, SIDE[ev.sideTier].label, 'sm')}`
      + `<span class="c12-strip__s">${ev.tier === 'strong' ? 'Cycle running' : `${ev.tier === 'partial' ? 'Slowed' : 'Stalled'} at step ${ev.limiting}: ${STEPS[ev.limiting - 1].short}`}</span>`;
    count.textContent = `${chosen.length} of 3 chosen`;
    tray.el.classList.toggle('is-full', chosen.length >= 3);
    paintCards();
    if (announce) ctx.announce(`Tumor control: ${TIER[ev.tier].label}. Side effects: ${SIDE[ev.sideTier].label}. ${msg.textContent}`);
  }

  function setProfile(id) {
    if (!PROFILES.some((p) => p.id === id)) return;
    profileId = id;
    tumorScale = 0.85;
    render();
    drawOverlays({ layout: wheel.layout });
  }
  function setChosen(list) {
    chosen = TRAY.map((t) => t.id).filter((id) => (list || []).includes(id));   // tray order
    render();
  }

  wheel.onStep((n) => {
    const s = ev.states[n - 1];
    const word = s.state === 'skipped' ? 'not needed' : s.state === 'replaced' ? 'done by engineered recognition' : s.state === 'broken' ? 'broken' : s.state === 'weak' ? 'weak' : 'working';
    const node = wheel.svg && wheel.svg.querySelector(`.cw-node[data-step="${n}"]`);
    if (node) ctx.tooltip.show(`<strong>Step ${n}</strong> · ${STEPS[n - 1].name} — ${word} in this model`, node);
    ctx.announce(`Step ${n}, ${STEPS[n - 1].name}: ${word}.`);
  });

  ctx.onResize(({ compact: c }) => { compact = c; });
  // "Try fixing this tumor ↓" in 12.1 asks for a profile (now, or before this figure mounted)
  const takeRequest = (id) => {
    if (!id || !PROFILES.some((p) => p.id === id)) return;
    delete document.documentElement.dataset.c12Profile;
    if (id !== profileId) { tray.set([]); chosen = []; setProfile(id); }
  };
  document.addEventListener('sao:c12-profile', (e) => takeRequest(e.detail && e.detail.profile), { signal: ctx.signal });
  render({ instant: true, announce: false });
  takeRequest(document.documentElement.dataset.c12Profile);

  return {
    destroy() { if (barTween) barTween.kill(); wheel.destroy(); },
  };
}
