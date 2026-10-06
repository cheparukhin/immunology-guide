// Theme: 'auto' (follow the OS), 'light' or 'dark'. Stored in localStorage
// (wrapped in try/catch — storage can be unavailable). The inline script in
// every page's <head> applies a stored choice before first paint.
// Fires `document` event 'so:themechange' with detail { mode, theme }.

const KEY = 'so-theme';
const mq = matchMedia('(prefers-color-scheme: dark)');

export function getMode() {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'light' || v === 'dark' ? v : 'auto';
  } catch {
    return 'auto';
  }
}

/** The theme actually in effect: 'light' | 'dark'. */
export function currentTheme() {
  const attr = document.documentElement.getAttribute('data-theme');
  if (attr === 'light' || attr === 'dark') return attr;
  return mq.matches ? 'dark' : 'light';
}

export function setMode(mode) {
  const root = document.documentElement;
  if (mode === 'light' || mode === 'dark') root.setAttribute('data-theme', mode);
  else root.removeAttribute('data-theme');
  try {
    if (mode === 'light' || mode === 'dark') localStorage.setItem(KEY, mode);
    else localStorage.removeItem(KEY);
  } catch { /* storage unavailable: the choice lasts for this page view */ }
  emit(mode);
}

function emit(mode = getMode()) {
  document.dispatchEvent(new CustomEvent('so:themechange', { detail: { mode, theme: currentTheme() } }));
}

/** Subscribe to effective theme changes (user choice or OS change). Returns unsubscribe. */
export function onThemeChange(fn) {
  const l = (e) => fn(e.detail.theme, e.detail.mode);
  document.addEventListener('so:themechange', l);
  return () => document.removeEventListener('so:themechange', l);
}

let wired = false;
export function initTheme() {
  if (wired) return;
  wired = true;
  mq.addEventListener('change', () => { if (getMode() === 'auto') emit('auto'); });
  // Keep tabs in sync.
  addEventListener('storage', (e) => {
    if (e.key !== KEY) return;
    const mode = getMode();
    if (mode === 'auto') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', mode);
    emit(mode);
  });
}
