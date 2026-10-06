// ch07-cycle — "The cycle and where it breaks". The seven-step cancer-immunity cycle on the
// shared wheel (shared/cycle-wheel.js, data in shared/cycle-data.js; FIGURE-AUDIT §2B).
// Guided tour (ctx.ui.stepper, 9 writer captions) → free play (spec round 2):
//   • Tour step 1 = whole wheel; steps 2–8 select steps 1–7; step 9 = "your turn".
//   • Tapping a node jumps the tour to that step, so caption, card and wheel always agree.
//   • "Break this step" stalls the whole cycle; "Restore" clears it. One break at a time.
//   • "Where Part III treatments act": display-only previews (rings, "not needed", "joins here").
//     They never fix a break and no outcome is computed — prescribing belongs to ch12-combinations.
import { createCycleWheel } from './shared/cycle-wheel.js';
import { STEPS, FAMILIES, therapy, statusOf, chapterLink, richText, therapyPreview } from './shared/cycle-data.js';

const ID = 'ch07-cycle';
const CSS = `
[data-figure="${ID}"] .c7-wheel { position: relative; z-index: 1; padding: clamp(10px, 2.4%, 22px) clamp(6px, 2%, 18px) clamp(8px, 2%, 16px); }
[data-figure="${ID}"] .c7-tray { flex: 1 1 100%; display: grid; gap: var(--s-3); padding-top: var(--s-3); border-top: 1px solid var(--rule); }
[data-figure="${ID}"] .c7-tray__toggle { all: unset; box-sizing: border-box; display: flex; align-items: center; gap: 0.6rem; min-height: 2.75rem; padding: 0.2rem 0.4rem; margin: -0.2rem -0.4rem; border-radius: var(--r-sm); cursor: pointer; font-family: var(--font-ui); font-size: var(--text-ui); font-weight: 620; color: var(--ink); }
[data-figure="${ID}"] .c7-tray__toggle:hover { background: var(--paper-2); }
[data-figure="${ID}"] .c7-tray__toggle:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
[data-figure="${ID}"] .c7-tray__toggle .ico { width: 1.1rem; height: 1.1rem; color: var(--ink-3); transition: transform var(--dur-2); }
[data-figure="${ID}"] .c7-tray__toggle[aria-expanded="true"] .ico { transform: rotate(180deg); }
[data-figure="${ID}"] .c7-part { padding: 0.15rem 0.45rem; border-radius: var(--r-pill); background: color-mix(in srgb, var(--c-drug) 16%, transparent); color: var(--c-drug-deep); font-size: var(--text-2xs); font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; }
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) [data-figure="${ID}"] .c7-part { color: var(--c-drug); } }
:root[data-theme="dark"] [data-figure="${ID}"] .c7-part { color: var(--c-drug); }
[data-figure="${ID}"] .c7-tray__body[hidden] { display: none; }
[data-figure="${ID}"] .c7-tray__body { display: grid; gap: var(--s-3); }
[data-figure="${ID}"] .c7-tray__body.is-new { animation: fade-up var(--dur-3) var(--ease-out); }
[data-figure="${ID}"] .c7-tray__hint { margin: 0; font-family: var(--font-ui); font-size: var(--text-xs); color: var(--ink-3); }
[data-figure="${ID}"] .c7-tray__families { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--s-3) var(--s-4); }
[data-figure="${ID}"] .c7-tray .chips__label { font-size: var(--text-2xs); font-weight: 650; letter-spacing: 0.04em; color: var(--ink-3); }
@container fig (max-width: 899.98px) { [data-figure="${ID}"] .c7-tray__families { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@container fig (max-width: 419.98px) { [data-figure="${ID}"] .c7-tray__families { grid-template-columns: minmax(0, 1fr); } }
[data-figure="${ID}"] .c7-sec + .c7-sec { margin-top: 0.75em; }
[data-figure="${ID}"] .c7-h { margin: 0 0 0.2rem; font-family: var(--font-ui); font-size: var(--text-2xs); font-weight: 650; letter-spacing: var(--tracking-caps); text-transform: uppercase; color: var(--ink-3); }
[data-figure="${ID}"] .c7-sec p { margin: 0; }
[data-figure="${ID}"] .c7-term { cursor: help; color: inherit; text-decoration: underline dotted; text-decoration-thickness: 1.5px; text-underline-offset: 0.18em; text-decoration-color: var(--ink-3); border-radius: 3px; }
[data-figure="${ID}"] .c7-term:hover { text-decoration-color: var(--accent); color: var(--ink); }
[data-figure="${ID}"] .c7-term:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
[data-figure="${ID}"] .c7-actions { display: flex; flex-wrap: wrap; gap: var(--s-2); margin-top: 0.9em; }
[data-figure="${ID}"] .c7-break .ico { color: var(--c-inhibit); }
[data-figure="${ID}"] .c7-restore .ico { color: var(--ink-3); }
[data-figure="${ID}"] .c7-broken-note { display: flex; flex-wrap: wrap; align-items: center; gap: 0.3rem 0.6rem; margin: 0.8em 0 0; font-family: var(--font-ui); font-size: var(--text-xs); color: var(--ink-2); }
[data-figure="${ID}"] .c7-broken-note b { color: var(--c-inhibit); font-weight: 700; }
[data-figure="${ID}"] .c7-list { list-style: none; margin: 0.4em 0 0; padding: 0; display: grid; gap: 0.15rem; }
[data-figure="${ID}"] .c7-list button { all: unset; box-sizing: border-box; display: flex; align-items: baseline; gap: 0.55rem; width: 100%; min-height: 2.25rem; padding: 0.3rem 0.5rem; border-radius: var(--r-sm); cursor: pointer; font-family: var(--font-ui); font-size: var(--text-xs); color: var(--ink-2); }
[data-figure="${ID}"] .c7-list button:hover { background: var(--paper-2); color: var(--ink); }
[data-figure="${ID}"] .c7-list button:focus-visible { outline: 2px solid var(--accent); outline-offset: 1px; }
[data-figure="${ID}"] .c7-list .n { min-width: 1.1em; font-weight: 700; color: var(--ink-3); font-variant-numeric: tabular-nums; }
[data-figure="${ID}"] .c7-list .t { font-weight: 600; color: var(--ink); }
[data-figure="${ID}"] .c7-list .w { margin-left: auto; color: var(--ink-3); font-size: var(--text-2xs); white-space: nowrap; }
[data-figure="${ID}"] .c7-list .is-broken .t::after { content: " ⊣"; color: var(--c-inhibit); font-weight: 700; }
@media (pointer: coarse) { [data-figure="${ID}"] .c7-list button { min-height: 2.75rem; } }
@container fig (max-width: 599.98px) { [data-figure="${ID}"] .c7-list { display: none; } }   /* phones: the wheel's own labels suffice */
[data-figure="${ID}"] .c7-result { margin-top: 1em; padding-top: 0.85em; border-top: 1px solid var(--rule); }
[data-figure="${ID}"] .c7-result--solo { margin-top: 0; padding-top: 0; border-top: 0; }
[data-figure="${ID}"] .c7-broken-note + .c7-result--solo { margin-top: 1em; padding-top: 0.85em; border-top: 1px solid var(--rule); }
[data-figure="${ID}"] .c7-result__head { display: flex; align-items: center; flex-wrap: wrap; gap: 0.4rem 0.55rem; margin: 0 0 0.35rem; font-family: var(--font-ui); font-size: var(--text-xs); font-weight: 650; color: var(--ink); }
[data-figure="${ID}"] .c7-result p { margin: 0; }
[data-figure="${ID}"] .c7-result p + p { margin-top: 0.45em; }
[data-figure="${ID}"] .c7-detail { color: var(--ink-3); }
[data-figure="${ID}"] .c7-meta { display: flex; flex-wrap: wrap; align-items: baseline; gap: 0.25rem 0.75rem; font-family: var(--font-ui); font-size: var(--text-xs); color: var(--ink-3); }
[data-figure="${ID}"] .c7-status { display: inline-flex; gap: 0.35rem; align-items: baseline; }
[data-figure="${ID}"] .c7-status b { font-weight: 650; color: var(--ink-2); }
[data-figure="${ID}"] .cw-chapter-link { font-weight: 600; white-space: nowrap; }
[data-figure="${ID}"] .c7-legend { display: flex; flex-wrap: wrap; gap: 0.35rem 1rem; margin: 0.9em 0 0; padding: 0; list-style: none; font-family: var(--font-ui); font-size: var(--text-2xs); color: var(--ink-3); }
[data-figure="${ID}"] .c7-legend li { display: inline-flex; align-items: center; gap: 0.35rem; }
[data-figure="${ID}"] .c7-legend i { display: inline-block; width: 0.6rem; height: 0.6rem; border-radius: 50%; }
[data-figure="${ID}"] .stepper .step-count { display: none; }
[data-figure="${ID}"] .c7-stepname { display: none; margin-inline: 0.5rem 0.75rem; font-family: var(--font-ui); font-size: var(--text-xs); font-weight: 600; color: var(--ink-2); white-space: nowrap; }
@container fig (max-width: 599.98px) { [data-figure="${ID}"] .c7-stepname { display: inline-block; } }
`;

function injectCSS() {
  if (document.getElementById(`${ID}-style`)) return;
  const s = document.createElement('style');
  s.id = `${ID}-style`;
  s.textContent = CSS;
  document.head.append(s);
}

export default function mount(fig, ctx) {
  injectCSS();
  const { h } = ctx;
  ctx.setAspect('auto');
  ctx.addDust();

  // ---------------------------------------------------------------- state
  let broken = null;          // 1–7 or null (one break at a time)
  let preview = null;         // therapy id shown in "Where Part III treatments act", or null
  let selected = null;        // mirrors the wheel
  let stepper = null;

  // ---------------------------------------------------------------- stage + card
  const card = ctx.ui.infoCard({ placement: 'auto', width: '21rem', closable: false, empty: null });
  const cell = h('div', { class: 'c7-wheel' });
  ctx.stage.append(cell);
  const wheel = createCycleWheel(ctx, cell, { size: 640, density: 'full' });

  // ---------------------------------------------------------------- card content
  function richNode(str) {
    const p = h('p');
    for (const part of richText(str)) {
      if (part.text) { p.append(part.text); continue; }
      // a focusable span (not a <button>) so long terms wrap with the sentence
      const b = h('span', { class: 'c7-term', role: 'button', tabindex: '0', 'aria-label': `${part.term}: ${part.note}` }, part.term);
      const show = () => ctx.tooltip.show(part.note, b);
      b.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(); } else if (e.key === 'Escape') ctx.tooltip.hide(); }, { signal: ctx.signal });
      b.addEventListener('mouseenter', show, { signal: ctx.signal });
      b.addEventListener('focus', show, { signal: ctx.signal });
      b.addEventListener('click', show, { signal: ctx.signal });
      b.addEventListener('mouseleave', () => ctx.tooltip.hide(), { signal: ctx.signal });
      b.addEventListener('blur', () => ctx.tooltip.hide(), { signal: ctx.signal });
      p.append(b);
    }
    return p;
  }

  function previewNode() {
    if (!preview) return null;
    const pv = therapyPreview(preview);
    const t = pv.therapy;
    const box = h('div', { class: 'c7-result' });
    if (selected) box.append(h('p', { class: 'c7-result__head', html: `<span class="c7-part">Part III</span><span>${t.label}</span>` }));
    else box.classList.add('c7-result--solo');
    box.append(h('p', null, pv.line));
    if (pv.detail) box.append(h('p', { class: 'c7-detail' }, pv.detail));
    const links = t.chapters.map((n) => chapterLink(n)).join(' ');
    box.append(h('p', { class: 'c7-meta', html: `<span class="c7-status"><b>Status</b> ${statusOf(t).text}</span>${links}` }));
    return box;
  }

  function breakButton(k) {
    const isBroken = broken === k;
    const b = ctx.ui.button({
      label: isBroken ? 'Restore' : 'Break this step',
      icon: isBroken ? 'reset' : 'block',
      small: true,
      parent: null,
      onClick: () => setBreak(isBroken ? null : k),
    });
    b.el.classList.add(isBroken ? 'c7-restore' : 'c7-break');
    return b.el;
  }

  function brokenNote() {
    if (!broken) return null;
    const restore = ctx.ui.button({ label: 'Restore', icon: 'reset', variant: 'ghost', small: true, parent: null, onClick: () => setBreak(null) });
    restore.el.classList.add('c7-restore');
    return h('p', { class: 'c7-broken-note' }, h('span', { html: `<b>⊣</b> Step ${broken}, ${STEPS[broken - 1].short}, is broken.` }), restore.el);
  }

  function overviewNode(final) {
    const wrap = h('div');
    // Phones hide the list (the wheel's own labels suffice), so don't point at it there.
    wrap.append(h('p', null, final
      ? `Choose a step on the wheel${ctx.compact ? '' : ' or in this list'}, then break it and watch the whole cycle stall.`
      : 'Seven steps, one loop. Tap a step to see what happens there and how tumors break it.'));
    const list = h('ul', { class: 'c7-list' });
    for (const s of STEPS) {
      const b = h('button', { type: 'button', class: broken === s.n ? 'is-broken' : '', 'aria-label': `Step ${s.n}, ${s.short}${broken === s.n ? ', broken' : ''}` },
        h('span', { class: 'n' }, String(s.n)), h('span', { class: 't' }, s.short), h('span', { class: 'w' }, s.where));
      b.addEventListener('click', () => goStep(s.n), { signal: ctx.signal });
      list.append(h('li', null, b));
    }
    wrap.append(list);
    const legend = h('ul', { class: 'c7-legend', 'aria-label': 'Where each step happens' });
    for (const [label, color] of [['Tumor', 'var(--c-cancer)'], ['Lymph node', '#9FC3D9'], ['Blood', '#C9A9A6']]) {
      legend.append(h('li', null, h('i', { style: { background: color }, 'aria-hidden': 'true' }), label));
    }
    wrap.append(legend);
    return wrap;
  }

  function renderCard() {
    const body = h('div');
    if (selected) {
      const s = STEPS[selected - 1];
      const what = h('div', { class: 'c7-sec' }, h('p', { class: 'c7-h' }, 'What happens'), richNode(s.what));
      const how = h('div', { class: 'c7-sec' }, h('p', { class: 'c7-h' }, 'How tumors break it'), richNode(s.breaks));
      body.append(what, how, h('div', { class: 'c7-actions' }, breakButton(selected)));
      if (broken && broken !== selected) body.append(brokenNote());
      const r = previewNode();
      if (r) body.append(r);
      card.show({ kicker: s.where, title: `Step ${s.n} — ${s.name}`, body });
    } else {
      const final = stepper && stepper.index === stepper.count - 1;
      if (!preview) body.append(overviewNode(final));
      const note = brokenNote();
      if (note) body.append(note);
      const r = previewNode();
      if (r) body.append(r);
      card.show(preview
        ? { kicker: 'Where Part III treatments act', title: therapy(preview).label, body }
        : { kicker: final ? 'Your turn' : 'The cancer-immunity cycle', title: final ? 'Break a step' : 'Every link must hold', body });
    }
  }

  // ---------------------------------------------------------------- wheel state
  // The break and the preview are two independent layers; on the broken step the break wins.
  function applyWheel() {
    const pv = preview ? therapyPreview(preview) : null;
    const states = (pv ? pv.states : []).filter((s) => s.step !== broken);
    if (broken) states.push({ step: broken, state: 'broken', glyph: broken === 6 ? 'hidden' : undefined });
    wheel.setStates(states);
    wheel.ring(pv ? pv.rings.acts : [], 'acts');
    wheel.ring(pv ? pv.rings.also : [], 'also');
    wheel.ring(pv ? pv.rings.entersAt : [], 'entersAt', { source: false });   // display only: not a flow source
    wheel.setCenter(null);
  }

  function setBreak(k) {
    broken = k;
    applyWheel();
    renderCard();
    ctx.announce(k ? `Step ${k}, ${STEPS[k - 1].short}, is broken. The whole cycle stalls, because the steps after it have nothing to work with.` : 'Restored. Cycle running.');
  }

  function goStep(k) {
    if (stepper) stepper.go(k);           // tour step k+1 (index k) selects wheel step k
  }

  // ---------------------------------------------------------------- "Where Part III treatments act"
  const tray = h('section', { class: 'c7-tray', 'aria-label': 'Where Part III treatments act' });
  const bodyId = `${ctx.id}-previews`;
  const toggle = h('button', { type: 'button', class: 'c7-tray__toggle', 'aria-expanded': 'false', 'aria-controls': bodyId },
    h('span', null, 'Where Part III treatments act'), h('span', { class: 'c7-part' }, 'Part III'),
    h('span', { html: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>' }));
  const trayBody = h('div', { class: 'c7-tray__body', id: bodyId, hidden: '' });
  const hint = h('p', { class: 'c7-tray__hint' }, 'Tap a treatment to see where on the wheel it works. These are previews; Part III covers each treatment in detail.');
  const families = h('div', { class: 'c7-tray__families' });
  trayBody.append(hint, families);
  tray.append(toggle, trayBody);
  const trayChips = [];
  for (const f of FAMILIES) {
    const chips = ctx.ui.chips({
      label: f.label,
      options: f.therapies.map((id) => ({ value: id, label: therapy(id).label })),
      parent: families,
      onChange: (v) => {
        for (const c of trayChips) if (c !== chips) c.set(null);
        preview = v;
        applyWheel();
        renderCard();
        if (v) {
          const pv = therapyPreview(v);
          ctx.announce(`${pv.therapy.label}. ${pv.detail}`);
        }
      },
    });
    trayChips.push(chips);
  }
  function openTray(open = true, { focus = false } = {}) {
    const was = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(open));
    trayBody.hidden = !open;
    if (open && !was && !ctx.reducedMotion) { trayBody.classList.add('is-new'); setTimeout(() => trayBody.classList.remove('is-new'), 600); }
    if (!open && preview) { preview = null; trayChips.forEach((c) => c.set(null)); applyWheel(); renderCard(); }
    if (focus) trayChips[0]?.buttons.values().next().value?.focus();
  }
  toggle.addEventListener('click', () => openTray(toggle.getAttribute('aria-expanded') !== 'true'), { signal: ctx.signal });

  // ---------------------------------------------------------------- tour (guided → free)
  const n = Math.max(9, ctx.steps.length || 9);
  const LABELS = ['Overview', ...STEPS.map((s) => `${s.n} · ${s.short}`), 'Your turn'];
  const nameNow = h('span', { class: 'c7-stepname', 'aria-hidden': 'true' });
  stepper = ctx.ui.stepper({
    steps: Array.from({ length: n }, () => ({ enter() {} })),
    onChange(i, info = {}) {
      selected = i >= 1 && i <= 7 ? i : null;
      wheel.selectStep(selected);
      renderCard();
      nameNow.textContent = LABELS[i] || '';
      // the stepper announced "Step i+1 of 9"; say the step's own name instead (last write wins)
      if (!info.initial && ctx.steps[i]) ctx.announce(i === 0 ? `Overview. ${ctx.steps[i].text}` : ctx.steps[i].text);
    },
    onComplete() { openTray(true); },
  });
  // Steps by name, not "Step 4 of 9" above "Step 3, Priming" (visitor review B3):
  // Overview · 1 Release … 7 Killing · Your turn — on the caption label, the dots and the phone counter.
  ctx.caption.querySelectorAll('.fig__step .fig__step-num').forEach((el, i) => { if (LABELS[i]) el.textContent = LABELS[i]; });
  stepper.el.querySelectorAll('.step-dot').forEach((d, i) => { if (LABELS[i]) { d.setAttribute('aria-label', LABELS[i]); d.dataset.tip = LABELS[i]; } });
  stepper.el.querySelector('.stepper__count')?.prepend(nameNow);
  nameNow.textContent = LABELS[stepper.index] || '';
  ctx.controls.append(tray);
  // The tour has no step animations, so start it at step 1 right away: on phones the card
  // pushes the controls far below the stage, and Next must work even when the stage is off-screen.
  stepper.go(0, { instant: true, initial: true });

  wheel.onStep((k) => goStep(k));
  applyWheel();
  renderCard();
  let wasCompact = ctx.compact;
  ctx.onResize(({ compact }) => { if (compact !== wasCompact) { wasCompact = compact; renderCard(); } });

  return {
    destroy() { wheel.destroy(); },
  };
}
