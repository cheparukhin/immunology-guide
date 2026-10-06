// Table of contents: builds the list from h2s if the page didn't ship one,
// highlights the current section (scroll-spy), opens itself as a rail on
// wide screens and steps aside whenever a wide figure scrolls past.
import { h, icon, qs, qsa, rafThrottle } from './dom.js';

const WIDE = matchMedia('(min-width: 75rem)');

export function initToc() {
  const prose = qs('.prose');
  if (!prose || prose.dataset.toc === 'off') return;
  let toc = qs('.toc');
  const heads = qsa(':scope > h2[id], :scope > .takeaways > h2[id]', prose);
  if (!heads.length) { toc?.remove(); return; }

  if (!toc) {
    // Hand-written pages: create the same markup the build produces.
    toc = h('details', { class: 'toc', id: 'toc' });
    prose.prepend(toc);
  }
  if (!qs('.toc__list', toc)) {
    toc.innerHTML = '';
    toc.append(
      h('summary', { class: 'toc__summary', html: `<span>In this chapter</span><span class="count">${heads.length} sections</span>${icon('chevronDown', 'chev')}` }),
      h('p', { class: 'toc__title', 'aria-hidden': 'true' }, 'In this chapter'),
      h('ol', { class: 'toc__list', role: 'list' },
        ...heads.map((hd) => h('li', null, h('a', { href: `#${hd.id}` }, hd.dataset.tocTitle || hd.textContent.replace(/#$/, '').trim())))));
  }

  const links = new Map(qsa('.toc__list a', toc).map((a) => [decodeURIComponent(a.hash.slice(1)), a]));

  // Wide: rail always open. Narrow: a collapsed disclosure.
  const applyMode = () => {
    if (WIDE.matches) toc.open = true;
    else if (!toc.dataset.userToggled) toc.open = false;
  };
  toc.addEventListener('toggle', () => { if (!WIDE.matches) toc.dataset.userToggled = '1'; });
  WIDE.addEventListener('change', applyMode);
  applyMode();
  toc.addEventListener('click', (e) => {
    if (e.target.closest('a') && !WIDE.matches) toc.open = false;
  });

  // Elements that should push the rail out of the way.
  const blockers = () => qsa('.hero, .fig--wide, .fig--full, .chapter-body > .is-wide, .chapter-body > .is-full, .pager, .site-footer');
  let blockList = blockers();
  let lastActive = null;
  const update = () => {
    // Scroll-spy: the last heading above 30% of the viewport.
    const line = innerHeight * 0.3;
    let active = null;
    for (const hd of heads) {
      if (hd.getBoundingClientRect().top <= line) active = hd;
      else break;
    }
    if (active !== lastActive) {
      lastActive = active;
      for (const a of links.values()) a.removeAttribute('aria-current');
      if (active) links.get(active.id)?.setAttribute('aria-current', 'true');
    }
    if (!WIDE.matches) return;
    // Rail visibility: hidden over the hero; faded when a wide block overlaps it.
    const hero = qs('.hero');
    const pastHero = !hero || hero.getBoundingClientRect().bottom < 120;
    toc.classList.toggle('is-active', pastHero);
    const r = toc.getBoundingClientRect();
    const top = r.top - 16;
    const bottom = r.top + Math.max(r.height, 160) + 16;
    const occluded = blockList.some((el) => {
      if (el.classList.contains('hero')) return false;
      const b = el.getBoundingClientRect();
      return b.bottom > top && b.top < bottom && b.left < r.right + 24;
    });
    toc.classList.toggle('is-occluded', occluded);
  };
  const onScroll = rafThrottle(update);
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', () => { blockList = blockers(); onScroll(); }, { passive: true });
  document.addEventListener('so:figure-mounted', () => { blockList = blockers(); onScroll(); });
  update();
}
