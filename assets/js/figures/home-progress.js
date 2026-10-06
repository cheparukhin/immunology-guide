// home-progress — per-reader reading progress, kept in this browser only.
//
// Not a figure module: chapter pages call recordProgress() (one line in
// site.js); the home page reads the same localStorage key with a small inline
// script so its cards can say "Read ✓" / "Continue" and its hero can offer
// "Continue where you left off". Storage may be missing, full or blocked
// (private windows): every access is wrapped, and nothing depends on it.
//
// Stored under 'so-progress':
//   { v: 1, last: '04-presentation',
//     pages: { '04-presentation': { p: 0.42, sec: 'the-shop-window', done: false, t: 1760000000000 } } }
//   p    furthest point reached in the article, 0..1
//   sec  id of the section heading the reader was in when they left
//   done the reader reached the takeaways (or 90% of the article)

export const PROGRESS_KEY = 'so-progress';

export function loadProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    const d = raw ? JSON.parse(raw) : null;
    return d && typeof d === 'object' && d.pages && typeof d.pages === 'object' ? d : { v: 1, pages: {} };
  } catch {
    return null;                      // storage unavailable: record nothing
  }
}

function save(d) {
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(d)); } catch { /* full or blocked: fine */ }
}

/** Remember how far the reader gets on a chapter page (body[data-page], article.chapter). */
export function recordProgress() {
  const article = document.querySelector('article.chapter');
  const id = document.body && document.body.dataset.page;
  if (!article || !id || id.startsWith('_') || !loadProgress()) return;

  let furthest = 0;
  let sec = null;
  let done = false;
  const headings = () => article.querySelectorAll('h2[id]');
  const takeaways = () => document.getElementById('takeaways');

  const measure = () => {
    const r = article.getBoundingClientRect();
    const total = r.height - innerHeight;
    const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 1;
    furthest = Math.max(furthest, p);
    let current = null;
    for (const h of headings()) { if (h.getBoundingClientRect().top < innerHeight * 0.35) current = h.id; else break; }
    sec = current;
    const tk = takeaways();
    if (furthest >= 0.9 || (tk && tk.getBoundingClientRect().top < innerHeight * 0.6)) done = true;
  };

  const commit = () => {
    const d = loadProgress();
    if (!d) return;
    const prev = d.pages[id] || {};
    d.pages[id] = {
      p: Math.round(Math.max(prev.p || 0, furthest) * 1000) / 1000,
      sec: sec || prev.sec || null,
      done: !!prev.done || done,
      t: Date.now(),
    };
    d.v = 1;
    d.last = id;
    save(d);
  };

  let timer = 0;
  addEventListener('scroll', () => {
    measure();
    clearTimeout(timer);
    timer = setTimeout(commit, 700);
  }, { passive: true });
  addEventListener('pagehide', () => { measure(); commit(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) { measure(); commit(); } });
  measure();
  commit();
}
