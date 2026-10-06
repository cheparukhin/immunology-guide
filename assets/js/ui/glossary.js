// Glossary popovers for <a class="term" data-term="id" href="glossary.html#id">
// and source previews for <sup class="cite"><a href="#src-3">3</a></sup>.
//
// Mouse: hover (with intent delay) shows, leaving hides (you can move into the
// popover). Keyboard: focus shows, blur/Escape hides; Enter follows the link.
// Touch: first tap shows, second tap on the same term follows the link, tap
// elsewhere hides. Popovers never trap focus and close on scroll.
import { h, qs, fetchJSON } from './dom.js';
import { Floating } from './popover.js';

const SHOW_DELAY = 140;
const HIDE_DELAY = 220;
const SELECTOR = 'a.term[data-term], sup.cite a[href^="#src-"]';

let pop;
let glossary = {};
let glossaryReady = null;
let showTimer;
let hideTimer;
let lastPointerType = 'mouse';
let lastCite = null;

function loadGlossary() {
  if (!glossaryReady) {
    // Page-local definitions (embedded by the build) win; the site glossary fills the rest.
    let local = {};
    const el = qs('script#page-glossary[type="application/json"]');
    if (el) { try { local = JSON.parse(el.textContent); } catch (e) { console.warn('[glossary] bad page glossary JSON', e); } }
    glossaryReady = fetchJSON('assets/data/glossary.json')
      .catch((err) => { console.warn('[glossary] could not load glossary.json', err); return {}; })
      .then((site) => { glossary = { ...site, ...local }; return glossary; });
  }
  return glossaryReady;
}

function termContent(a) {
  const id = a.dataset.term;
  const entry = glossary[id];
  const frag = document.createDocumentFragment();
  if (!entry) {
    console.warn(`[glossary] no definition for "${id}"`);
    frag.append(h('p', { class: 'popover__term' }, a.textContent.trim()), h('p', { class: 'popover__def' }, 'Definition coming soon.'));
    return frag;
  }
  frag.append(h('p', { class: 'popover__term', html: entry.term }), h('p', { class: 'popover__def', html: entry.def }));
  const more = h('p', { class: 'popover__more' });
  if (entry.chapterLabel) more.append(h('span', null, `Introduced in ${entry.chapterLabel}`));
  else more.append(h('span'));
  more.append(h('a', { href: a.getAttribute('href') || `glossary.html#${id}` }, 'Glossary →'));
  frag.append(more);
  return frag;
}

function citeContent(a) {
  const id = decodeURIComponent(a.hash.slice(1));
  const li = document.getElementById(id);
  const frag = document.createDocumentFragment();
  const n = id.replace('src-', '');
  frag.append(h('p', { class: 'popover__label caps' }, `Source ${n}`));
  if (!li) {
    frag.append(h('p', { class: 'popover__cite' }, 'Source not found on this page.'));
    console.warn(`[cite] missing #${id}`);
    return frag;
  }
  const body = li.cloneNode(true);
  body.querySelectorAll('.src-num, .src-back, .src-up').forEach((n2) => n2.remove());
  frag.append(h('p', { class: 'popover__cite', html: body.innerHTML.trim() }));
  if (lastPointerType === 'touch') {
    frag.append(h('p', { class: 'popover__more' }, h('span'), h('a', { href: `#${id}` }, 'Go to source ↓')));
  }
  return frag;
}

async function open(a, point) {
  clearTimeout(hideTimer);
  if (a.matches('a.term')) await loadGlossary();
  const content = a.matches('a.term') ? termContent(a) : citeContent(a);
  if (pop.anchor && pop.anchor !== a) pop.anchor.removeAttribute('aria-expanded');
  pop.show(a, content, { point });
  a.setAttribute('aria-describedby', pop.el.id);
  a.setAttribute('aria-expanded', 'true');
}

function close() {
  clearTimeout(showTimer);
  if (pop?.anchor) {
    pop.anchor.removeAttribute('aria-describedby');
    pop.anchor.removeAttribute('aria-expanded');
  }
  pop?.hide();
}

// glossary.html links "Introduced in…" to <chapter>.html#term-<id>. The build anchors the
// first use in the text; if the first use is inside a figure caption (rendered later),
// find it once figures mount.
function revealTermFromHash() {
  const m = location.hash.match(/^#term-([a-z0-9_-]+)$/i);
  if (!m || document.getElementById(location.hash.slice(1))) return;
  const id = m[1];
  const needle = `data-term=\\"${id}\\"`;   // how the term appears inside figure-data JSON
  let tries = 0;
  const attempt = () => {
    const el = document.querySelector(`a.term[data-term="${id}"]`)
      || [...document.querySelectorAll('figure.fig[data-figure]')].find((f) => (f.querySelector('script.fig-data')?.textContent || '').includes(needle));
    if (el) el.scrollIntoView({ block: 'center' });
    else if (++tries < 20) setTimeout(attempt, 150);
  };
  attempt();
}

export function initGlossary() {
  revealTermFromHash();
  if (!document.querySelector(SELECTOR) && !document.querySelector('.fig')) return;
  pop = new Floating({ className: 'popover--term' });
  // Warm the cache when the browser is idle so the first hover is instant.
  (window.requestIdleCallback || setTimeout)(() => { if (document.querySelector('a.term')) loadGlossary(); });

  document.addEventListener('pointerdown', (e) => {
    lastPointerType = e.pointerType || 'mouse';
    if (pop.isOpen && !pop.contains(e.target) && !e.target.closest(SELECTOR)) close();
  }, true);

  document.addEventListener('pointerover', (e) => {
    if (e.pointerType === 'touch') return;
    const a = e.target.closest(SELECTOR);
    if (a) {
      clearTimeout(hideTimer);
      if (pop.anchor === a && pop.isOpen) return;
      clearTimeout(showTimer);
      const point = { x: e.clientX, y: e.clientY };
      showTimer = setTimeout(() => open(a, point), pop.isOpen ? 40 : SHOW_DELAY);
    } else if (pop.contains(e.target)) {
      clearTimeout(hideTimer);
    }
  });
  document.addEventListener('pointerout', (e) => {
    if (e.pointerType === 'touch') return;
    const from = e.target.closest(SELECTOR) || (pop.contains(e.target) ? pop.el : null);
    if (!from) return;
    const to = e.relatedTarget;
    if (to && (pop.contains(to) || (pop.anchor && pop.anchor.contains(to)))) return;
    clearTimeout(showTimer);
    hideTimer = setTimeout(close, HIDE_DELAY);
  });

  document.addEventListener('focusin', (e) => {
    const a = e.target.closest?.(SELECTOR);
    if (a && lastPointerType !== 'touch' && e.target.matches(':focus-visible')) open(a);
  });
  document.addEventListener('focusout', (e) => {
    if (e.target.closest?.(SELECTOR) && !pop.contains(e.relatedTarget)) hideTimer = setTimeout(close, 60);
  });

  document.addEventListener('click', (e) => {
    const a = e.target.closest(SELECTOR);
    if (!a) return;
    const touchy = lastPointerType === 'touch' || lastPointerType === 'pen';
    if (touchy && !(pop.isOpen && pop.anchor === a)) {
      // First tap: show the definition instead of navigating.
      e.preventDefault();
      open(a, { x: e.clientX, y: e.clientY });
      return;
    }
    if (a.closest('sup.cite')) {
      lastCite = a;
      close();
      markBackLink(a);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && pop.isOpen) close();
  });
  addEventListener('scroll', () => { if (pop.isOpen && lastPointerType !== 'mouse') close(); }, { passive: true });
  addEventListener('scroll', () => {
    if (!pop.isOpen || lastPointerType !== 'mouse' || !pop.anchor) return;
    const r = pop.anchor.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) close();
    else pop.place(pop.anchor);
  }, { passive: true });
  addEventListener('resize', close, { passive: true });
}

// After jumping to a source, offer a way back to the sentence that cited it.
function markBackLink(a) {
  const li = document.getElementById(decodeURIComponent(a.hash.slice(1)));
  if (!li) return;
  if (!a.id) a.id = `cite-ref-${Math.random().toString(36).slice(2, 8)}`;
  li.querySelector('.src-back')?.remove();
  const back = h('a', { class: 'src-back', href: `#${a.id}`, 'aria-label': 'Back to the text' }, '↩ Back to text');
  back.addEventListener('click', (e) => {
    e.preventDefault();
    lastCite?.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    lastCite?.focus({ preventScroll: true });
    back.remove();
  });
  li.append(back);
}
