// glossary.html: live search/filter and A–Z state. Loaded by site.js only on
// pages with [data-glossary-search]. Matching is case- and accent-insensitive,
// against term, definition and id; every word must match ("t cell kill").
import { qs, qsa } from './dom.js';

const fold = (s) => s.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase();

export function initGlossaryPage() {
  const input = qs('[data-glossary-search]');
  if (!input) return;
  const entries = qsa('.glossary-entry');
  const sections = qsa('.glossary-letter');
  const count = qs('[data-glossary-count]');
  const empty = qs('[data-glossary-empty]');
  const letters = new Map(qsa('.az a[data-letter]').map((a) => [a.dataset.letter, a]));
  const total = entries.length;

  // Matching: every query word must START a word (so "t cell" doesn't match "the").
  // Term names win: definitions are searched only when no term name matches.
  const matches = (haystack, words) => words.every((w) => haystack.includes(` ${w}`));
  const apply = () => {
    const raw = input.value.trim();
    const words = fold(raw).replace(/[^a-z0-9]+/g, ' ').trim().split(' ').filter(Boolean);
    let inDefs = false;
    let hits = entries.filter((e) => !words.length || matches(e.dataset.name, words));
    if (words.length && !hits.length) {
      hits = entries.filter((e) => matches(e.dataset.search, words));
      inDefs = hits.length > 0;
    }
    const set = new Set(hits);
    for (const e of entries) e.hidden = !set.has(e);
    for (const sec of sections) {
      const any = sec.querySelector('.glossary-entry:not([hidden])');
      sec.hidden = !any;
      const letter = sec.querySelector('.glossary-letter__title')?.textContent.trim();
      letters.get(letter)?.classList.toggle('is-empty', !any);
    }
    empty.hidden = hits.length > 0;
    count.textContent = words.length
      ? `${hits.length} of ${total} terms ${inDefs ? 'mention' : 'match'} “${raw}”${inDefs ? ' in their definition' : ''}`
      : '';
  };

  let t;
  input.addEventListener('input', () => { clearTimeout(t); t = setTimeout(apply, 80); });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && input.value) { input.value = ''; apply(); }
    if (e.key === 'Enter') {
      // Jump to the first match.
      const first = entries.find((x) => !x.hidden);
      if (first) { first.scrollIntoView({ block: 'center' }); history.replaceState(null, '', `#${first.id}`); }
    }
  });
  // "/" focuses the search (unless typing somewhere else).
  document.addEventListener('keydown', (e) => {
    if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.target.closest('input, textarea, [contenteditable]')) return;
    e.preventDefault();
    input.focus();
  });
  // ?q=… prefills the search (shareable filtered views).
  const q = new URLSearchParams(location.search).get('q');
  if (q) { input.value = q; apply(); }
}
