// sources.html: filter box (POLISH S6). Loaded by site.js only on pages with
// [data-sources-filter]. Case- and accent-insensitive; every word must start a word
// in the source (authors, title, journal, year), e.g. "rosenberg 1985" or "nejm pd-1".
import { qs, qsa } from './dom.js';

const fold = (s) => s.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase();
const words = (s) => fold(s).replace(/[^a-z0-9]+/g, ' ').trim().split(' ').filter(Boolean);

export function initSourcesPage() {
  const input = qs('[data-sources-filter]');
  if (!input) return;
  const items = qsa('.sources-page .sources-list > li');
  // Each chapter is an h2 + count line + list (siblings in the prose grid).
  const sections = qsa('.sources-page .sources-list').map((ol) => {
    const els = [ol];
    for (let el = ol.previousElementSibling; el && !el.classList.contains('sources-list'); el = el.previousElementSibling) {
      els.push(el);
      if (el.matches('h2')) break;
    }
    return { ol, els };
  });
  const count = qs('[data-sources-count]');
  const empty = qs('[data-sources-empty]');
  const hay = new Map(items.map((li) => [li, ` ${words(li.textContent).join(' ')} `]));
  const total = items.length;

  const apply = () => {
    const raw = input.value.trim();
    const q = words(raw);
    let n = 0;
    for (const li of items) {
      const hit = !q.length || q.every((w) => hay.get(li).includes(` ${w}`));
      li.hidden = !hit;
      if (hit) n += 1;
    }
    for (const { ol, els } of sections) {
      const any = !!ol.querySelector(':scope > li:not([hidden])');
      for (const el of els) el.hidden = !any;
    }
    empty.hidden = n > 0;
    count.textContent = q.length ? `${n} of ${total} sources match “${raw}”` : '';
  };

  let t;
  input.addEventListener('input', () => { clearTimeout(t); t = setTimeout(apply, 80); });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && input.value) { input.value = ''; apply(); }
    if (e.key === 'Enter') {
      const first = items.find((x) => !x.hidden);
      if (first) first.scrollIntoView({ block: 'center' });
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.target.closest('input, textarea, [contenteditable]')) return;
    e.preventDefault();
    input.focus();
  });
  const q = new URLSearchParams(location.search).get('q');
  if (q) { input.value = q; apply(); }
}
