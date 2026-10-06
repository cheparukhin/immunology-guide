// Site header: scroll states, chapter-context title, reading progress,
// chapter menu drawer (built from assets/data/chapters.json) and theme menu.
import { h, icon, fetchJSON, rafThrottle, qs, qsa } from './dom.js';
import { getMode, setMode, onThemeChange } from './theme.js';

const THEME_LABELS = { auto: 'Auto', light: 'Light', dark: 'Dark' };
const THEME_ICONS = { auto: 'auto', light: 'sun', dark: 'moon' };

/** File name of the current page ("04-presentation.html"); "" → index.html. */
export function currentFile() {
  const last = location.pathname.split('/').pop();
  return last && last.includes('.') ? decodeURIComponent(last) : 'index.html';
}

export function initHeader() {
  const header = qs('.site-header');
  if (!header) return;
  initScrollStates(header);
  initProgress();
  initThemeMenu(header);
  initMenu(header);
}

// ------------------------------------------------------------ scroll states
function initScrollStates(header) {
  let lastY = scrollY;
  const context = qs('.site-header__context', header);
  const heroTitle = qs('.hero__title');

  const update = rafThrottle(() => {
    const y = scrollY;
    header.classList.toggle('is-scrolled', y > 4);
    // Tuck the header away while reading downwards; bring it back on any upward scroll.
    const menuOpen = header.querySelector('[aria-expanded="true"]');
    const noTuck = document.body.classList.contains('no-tuck');   // pages with their own sticky bar
    if (y > lastY + 6 && y > 320 && !menuOpen && !noTuck) header.classList.add('is-tucked');
    else if (y < lastY - 6 || y < 120) header.classList.remove('is-tucked');
    lastY = y;
  });
  addEventListener('scroll', update, { passive: true });
  update();

  if (context && heroTitle && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(([e]) => {
      context.classList.toggle('is-shown', !e.isIntersecting && e.boundingClientRect.top < 0);
    }, { rootMargin: '-56px 0px 0px 0px' });
    io.observe(heroTitle);
  }
}

// ------------------------------------------------------------ progress bar
function initProgress() {
  const bar = qs('.progress__bar');
  if (!bar) return;
  const article = qs('.chapter') || document.body;
  const update = rafThrottle(() => {
    const r = article.getBoundingClientRect();
    const total = r.height - innerHeight;
    const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
    bar.style.transform = `scaleX(${p.toFixed(4)})`;
  });
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update, { passive: true });
  update();
}

// ------------------------------------------------------------ theme menu
function initThemeMenu(header) {
  const btn = qs('[data-theme-toggle]', header);
  if (!btn) return;
  let menu = null;

  const paint = () => {
    const mode = getMode();
    btn.innerHTML = icon(THEME_ICONS[mode]);
    btn.setAttribute('aria-label', `Color theme: ${THEME_LABELS[mode]}`);
    btn.title = `Theme: ${THEME_LABELS[mode]}`;
    if (menu) qsa('[role="menuitemradio"]', menu).forEach((it) => it.setAttribute('aria-checked', String(it.dataset.mode === mode)));
  };
  paint();
  onThemeChange(paint);

  const close = (focusBtn = false) => {
    if (!menu) return;
    menu.remove();
    menu = null;
    btn.setAttribute('aria-expanded', 'false');
    document.removeEventListener('pointerdown', outside, true);
    if (focusBtn) btn.focus();
  };
  const outside = (e) => { if (menu && !menu.contains(e.target) && !btn.contains(e.target)) close(); };

  const open = () => {
    menu = h('div', { class: 'theme-menu', role: 'menu', 'aria-label': 'Color theme' });
    for (const mode of ['light', 'dark', 'auto']) {
      const item = h('button', {
        type: 'button', class: 'theme-menu__item', role: 'menuitemradio', tabindex: '-1',
        'aria-checked': String(getMode() === mode), dataset: { mode },
        html: `${icon(THEME_ICONS[mode])}<span>${THEME_LABELS[mode]}${mode === 'auto' ? ' <span style="color:var(--ink-3);font-weight:450">· system</span>' : ''}</span>`,
      });
      item.addEventListener('click', () => { setMode(mode); close(true); });
      menu.append(item);
    }
    menu.addEventListener('keydown', (e) => {
      const items = qsa('[role="menuitemradio"]', menu);
      const i = items.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length].focus(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
      else if (e.key === 'Escape') { e.preventDefault(); close(true); }
      else if (e.key === 'Tab') close();
    });
    btn.after(menu);
    btn.setAttribute('aria-expanded', 'true');
    const checked = qs('[aria-checked="true"]', menu) || menu.firstElementChild;
    checked.focus();
    document.addEventListener('pointerdown', outside, true);
  };
  btn.addEventListener('click', () => (menu ? close() : open()));
}

// ------------------------------------------------------------ chapter menu
function initMenu(header) {
  const btn = qs('[data-menu-toggle]', header);
  if (!btn) return;
  let dialog = null;

  const build = async () => {
    const data = await fetchJSON('assets/data/chapters.json');
    const here = currentFile();
    dialog = h('dialog', { class: 'drawer', 'aria-label': 'Chapters' });
    const body = h('div', { class: 'drawer__body' });
    const partsById = Object.fromEntries(data.parts.map((p) => [p.id, p]));

    let currentPart;
    let list;
    for (const page of data.pages) {
      if (page.part !== currentPart || !list) {
        currentPart = page.part;
        const part = partsById[page.part];
        const section = h('section', { class: 'drawer__part' });
        if (part) {
          section.append(h('p', { class: 'drawer__part-label' },
            h('span', { class: 'caps' }, `Part ${part.id}`),
            h('span', { class: 'drawer__part-sub' }, `${part.title}`)));
        }
        list = h('ol', { class: 'drawer__list', role: 'list' });
        section.append(list);
        body.append(section);
      }
      const isHere = page.file === here;
      const link = h('a', { class: 'drawer__link', href: page.file, 'aria-current': isHere ? 'page' : null },
        h('span', { class: `drawer__num${page.number == null ? ' drawer__num--interlude' : ''}`, 'aria-hidden': 'true' }, page.number == null ? '✦' : String(page.number)),
        h('span', { class: 'drawer__ctitle' },
          page.number == null ? `${page.label}: ` : h('span', { class: 'visually-hidden' }, `${page.label}: `),
          page.title,
          isHere ? h('span', { class: 'drawer__here' }, 'Here') : null),
        h('span', { class: 'drawer__desc' }, page.description || ''));
      const li = h('li', null, link);
      if (isHere) {
        const heads = qsa('.prose > h2[id], .prose .takeaways > h2[id]');
        if (heads.length) {
          const sub = h('ol', { class: 'drawer__sections', role: 'list', 'aria-label': 'Sections' });
          for (const hd of heads) {
            const a = h('a', { href: `#${hd.id}` }, hd.dataset.tocTitle || hd.textContent.replace(/#$/, '').trim());
            a.addEventListener('click', () => dialog.close());
            sub.append(h('li', null, a));
          }
          li.append(sub);
        }
      }
      list.append(li);
    }

    const closeBtn = h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Close menu', html: icon('close') });
    closeBtn.addEventListener('click', () => dialog.close());
    const extras = (data.extras || []).map((x) => h('a', { href: x.file, 'aria-current': x.file === here ? 'page' : null }, x.title));
    dialog.append(h('div', { class: 'drawer__inner' },
      h('div', { class: 'drawer__head' },
        h('p', { class: 'drawer__title caps', style: { color: 'var(--ink-2)' } }, 'Contents'),
        closeBtn),
      body,
      h('div', { class: 'drawer__foot' }, h('nav', { class: 'drawer__links', 'aria-label': 'More' }, ...extras))));

    // Click on the backdrop closes the dialog.
    dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => { btn.setAttribute('aria-expanded', 'false'); document.documentElement.style.overflow = ''; btn.focus(); });
    document.body.append(dialog);
    return dialog;
  };

  btn.addEventListener('click', async () => {
    try {
      if (!dialog) await build();
      dialog.showModal();
      btn.setAttribute('aria-expanded', 'true');
      document.documentElement.style.overflow = 'hidden';
      const cur = qs('[aria-current="page"]', dialog);
      if (cur) cur.scrollIntoView({ block: 'center' });
      (cur || qs('a', dialog))?.focus({ preventScroll: true });
    } catch (err) {
      console.error('[menu] could not open chapter menu', err);
      location.href = 'index.html';
    }
  });
}
