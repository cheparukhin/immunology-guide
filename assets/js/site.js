// Self & Other — page bootstrap (loaded on every page as an ES module).
//   <script type="module" src="assets/js/site.js"></script>
// Wires: theme, header (menu, progress, theme menu), table of contents,
// glossary & citation popovers, quizzes, and the figure lazy-loader.
// Each feature is isolated: if one throws, the others still run.
import { initTheme } from './ui/theme.js';
import { initHeader } from './ui/header.js';
import { initToc } from './ui/toc.js';
import { initGlossary } from './ui/glossary.js';
import { initQuizzes } from './ui/quiz.js';
import { initFigures } from './ui/figures.js';

document.documentElement.classList.add('js');

const features = [
  ['theme', initTheme],
  ['header', initHeader],
  ['toc', initToc],
  ['glossary', initGlossary],
  ['quiz', initQuizzes],
  ['figures', initFigures],
];

// Print: open every closed "Go deeper" (closed <details> print only their summary),
// and close them again afterwards.
function initPrint() {
  let opened = [];
  addEventListener('beforeprint', () => {
    opened = [...document.querySelectorAll('details:not([open])')];
    opened.forEach((d) => { d.open = true; });
  });
  addEventListener('afterprint', () => { opened.forEach((d) => { d.open = false; }); opened = []; });
}
features.push(['print', initPrint]);

// Links into a closed <details> (the collapsed chapter Sources, a Go deeper): open it first,
// so citation jumps (#src-n), the TOC's "Sources" and shared #anchors land on something visible.
function initDetailTargets() {
  const reveal = (hash, scroll) => {
    if (!hash || hash.length < 2) return false;
    let el = null;
    try { el = document.getElementById(decodeURIComponent(hash.slice(1))); } catch { return false; }
    if (!el?.closest('details:not([open])')) return false;
    for (let d = el.closest('details:not([open])'); d; d = d.parentElement?.closest('details:not([open])')) d.open = true;
    if (scroll) el.scrollIntoView({ block: 'start' });
    return true;
  };
  document.addEventListener('click', (e) => {
    const a = e.target.closest?.('a[href*="#"]');
    if (!a || a.origin !== location.origin || a.pathname !== location.pathname) return;
    reveal(a.hash, false);              // the browser's own jump then finds it open
  }, true);
  addEventListener('hashchange', () => reveal(location.hash, true));
  if (location.hash) reveal(location.hash, true);
}
features.push(['details', initDetailTargets]);

function boot() {
  for (const [name, init] of features) {
    try { init(); } catch (err) { console.error(`[site] ${name} failed to initialise`, err); }
  }
  // Page-specific behaviour, loaded only where needed.
  if (document.querySelector('[data-glossary-search]')) {
    import('./ui/glossary-page.js').then((m) => m.initGlossaryPage()).catch((err) => console.error('[site] glossary page failed', err));
  }
  if (document.querySelector('[data-sources-filter]')) {
    import('./ui/sources-page.js').then((m) => m.initSourcesPage()).catch((err) => console.error('[site] sources page failed', err));
  }
  // Reading progress for the home page's "Read ✓ / Continue" (owned by the home builder).
  // Chapter pages only, at idle time, never blocking rendering; the path is relative to this
  // module, so it works under any subpath.
  if (document.querySelector('article.chapter') && !document.querySelector('.page-reference')) {
    const record = () => import('./figures/home-progress.js').then((m) => m.recordProgress?.()).catch(() => {});
    if ('requestIdleCallback' in window) requestIdleCallback(record, { timeout: 3000 });
    else setTimeout(record, 1200);
  }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
else boot();
