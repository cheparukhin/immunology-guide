// Figure UI kit additions (FIGURE-AUDIT §3/§4): chips, info card, outcome badges,
// clock HUD. Merged into ctx.ui by controls.js. API: docs/FIGURES.md §6b.
import { h, icon } from './dom.js';

// Outcome vocabulary (§4 rule 10): shape AND color carry meaning.
export const OUTCOMES = {
  yes: { glyph: 'check', word: 'Yes' },
  partial: { glyph: 'approx', word: 'Partly' },
  no: { glyph: 'x', word: 'No' },
  varies: { glyph: 'tilde', word: 'Varies' },
};
const kindOf = (k) => (OUTCOMES[k] ? k : 'varies');

export function badgeHTML(kind, label, size = 'md') {
  const k = kindOf(kind);
  const text = label ?? OUTCOMES[k].word;
  return `<span class="badge badge--${k} badge--${size}"><span class="badge__glyph" aria-hidden="true">${icon(OUTCOMES[k].glyph)}</span>${text ? `<span class="badge__label">${text}</span>` : `<span class="visually-hidden">${OUTCOMES[k].word}</span>`}</span>`;
}

/** The stage overlay that holds tags and HUD items, one stack per corner. */
export function hudCorner(stage, corner = 'top-right') {
  const c = ['top-left', 'top-right', 'bottom-left', 'bottom-right'].includes(corner) ? corner : 'top-right';
  let hud = stage.querySelector(':scope > .fig__hud');
  if (!hud) { hud = h('div', { class: 'fig__hud' }); stage.append(hud); }
  let slot = hud.querySelector(`:scope > .fig__hud-${c}`);
  if (!slot) { slot = h('div', { class: `fig__hud-slot fig__hud-${c}` }); hud.append(slot); }
  return slot;
}

export function createKit(ctx, put) {
  return {
    // ------------------------------------------------------------ chips
    chips({ label = '', options = [], multi = false, max = Infinity, value = multi ? [] : null, required = false, variant = 'chip', parent, hideLabel = false, onChange } = {}) {
      let selected = new Set(multi ? [].concat(value ?? []) : value == null ? [] : [value]);
      const labelId = ctx.uid('chips');
      const tray = h('div', { class: `chips__tray chips__tray--${variant}`, role: 'group', 'aria-labelledby': labelId });
      const buttons = new Map();
      for (const o of options) {
        const b = h('button', {
          type: 'button',
          class: ['chip', variant === 'card' && 'chip--card'],
          'aria-pressed': 'false',
          title: o.title || null,
          disabled: o.disabled || null,
          dataset: { value: String(o.value) },
        },
        o.color ? h('span', { class: 'chip__swatch', 'aria-hidden': 'true', style: { background: o.color } }) : null,
        o.icon ? h('span', { class: 'chip__icon', html: icon(o.icon) }) : null,
        h('span', { class: 'chip__text' },
          h('span', { class: 'chip__label' }, o.label),
          variant === 'card' && o.desc ? h('span', { class: 'chip__desc' }, o.desc) : null));
        b.addEventListener('click', () => toggle(o.value, undefined, true), { signal: ctx.signal });
        tray.append(b);
        buttons.set(o.value, b);
      }
      const current = () => (multi ? [...selected] : selected.size ? [...selected][0] : null);
      const paint = () => { for (const [v, b] of buttons) b.setAttribute('aria-pressed', String(selected.has(v))); };
      function toggle(v, on, user = false) {
        const option = options.find((o) => o.value === v);
        if (!option || buttons.get(v)?.disabled) return;
        const want = on ?? !selected.has(v);
        if (multi) {
          if (want && !selected.has(v) && selected.size >= max) {
            if (user) ctx.announce(`You can choose up to ${max}. Deselect one first.`);
            return;
          }
          want ? selected.add(v) : selected.delete(v);
        } else {
          if (!want && required) return;
          selected = new Set(want ? [v] : []);
        }
        paint();
        if (user) onChange?.(current(), { option, pressed: selected.has(v) });
      }
      // Arrow keys move focus along the tray (Space/Enter toggle natively).
      tray.addEventListener('keydown', (e) => {
        const list = [...buttons.values()].filter((b) => !b.disabled);
        const i = list.indexOf(document.activeElement);
        if (i < 0) return;
        let j = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = (i + 1) % list.length;
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = (i - 1 + list.length) % list.length;
        else if (e.key === 'Home') j = 0;
        else if (e.key === 'End') j = list.length - 1;
        if (j == null) return;
        e.preventDefault();
        list[j].focus();
      }, { signal: ctx.signal });
      paint();
      const el = h('div', { class: `chips chips--${variant}` },
        h('span', { class: ['chips__label', (hideLabel || !label) && 'visually-hidden'], id: labelId }, label || 'Options'),
        tray);
      put(el, parent);
      return {
        el,
        buttons,
        get value() { return current(); },
        set(v, { silent = true } = {}) {
          selected = new Set(multi ? [].concat(v ?? []) : v == null ? [] : [v]);
          paint();
          if (!silent) onChange?.(current(), { option: null, pressed: null });
        },
        toggle: (v, on) => toggle(v, on, false),
        disable(v, on = true) { const b = buttons.get(v); if (b) b.disabled = !!on; },
      };
    },

    // ------------------------------------------------------------ info card
    infoCard({ placement = 'auto', width = '18rem', empty = null, closable = true } = {}) {
      // Wrap the stage so the card can sit beside it (grid) or under it.
      let main = ctx.stage.parentElement.classList.contains('fig__main') ? ctx.stage.parentElement : null;
      if (!main) {
        main = h('div', { class: 'fig__main' });
        ctx.stage.before(main);
        main.append(ctx.stage);
      }
      main.classList.toggle('has-side', placement === 'auto');
      main.style.setProperty('--info-w', width);
      const body = h('div', { class: 'info-card__content' });
      const close = h('button', { type: 'button', class: 'info-card__close btn btn--ghost btn--icon btn--sm', 'aria-label': 'Close details', html: icon('close') });
      const el = h('aside', { class: 'info-card', 'aria-live': 'polite', 'data-placement': placement }, close, body);
      main.append(el);
      let open = false;
      // Empty state: a string → a compact one-line hint (top-aligned, no box);
      // an object { kicker, title, body } → a short default summary card;
      // null → no card (and no reserved side column) until show().
      const renderEmpty = () => {
        open = false;
        el.classList.remove('is-open', 'is-empty', 'is-summary');
        if (empty == null) { el.hidden = true; return; }
        el.hidden = false;
        if (typeof empty === 'object') {
          el.classList.add('is-summary');
          fill(empty);
        } else {
          el.classList.add('is-empty');
          body.innerHTML = `<p class="info-card__empty">${icon('info')}<span>${empty}</span></p>`;
        }
      };
      function fill({ kicker, title, badge, body: content } = {}) {
        body.replaceChildren();
        if (kicker) body.append(h('p', { class: 'info-card__kicker' }, kicker));
        if (title || badge) {
          body.append(h('p', { class: 'info-card__title', html: `${badge ? badgeHTML(badge.kind, badge.label ?? '', 'sm') : ''}<span>${title ?? ''}</span>` }));
        }
        if (content != null) {
          const wrap = h('div', { class: 'info-card__body' });
          if (typeof content === 'string') wrap.innerHTML = content; else wrap.append(content);
          body.append(wrap);
        }
      }
      close.hidden = !closable;
      close.addEventListener('click', () => renderEmpty(), { signal: ctx.signal });
      renderEmpty();
      return {
        el,
        get isOpen() { return open; },
        show({ kicker, title, badge, body: content, scroll = false } = {}) {
          open = true;
          el.hidden = false;
          el.classList.remove('is-empty', 'is-summary');
          el.classList.add('is-open');
          fill({ kicker, title, badge, body: content });
          if (scroll && !ctx.reducedMotion) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
          else if (scroll) el.scrollIntoView({ block: 'nearest' });
        },
        hide: renderEmpty,
      };
    },

    // ------------------------------------------------------------ badges
    badge({ kind = 'yes', label, size = 'md', parent } = {}) {
      const el = h('span', { class: 'badge-host', html: badgeHTML(kind, label, size) });
      put(el, parent);
      return { el, set(k, l) { el.innerHTML = badgeHTML(k, l ?? label, size); } };
    },
    badgeHTML,

    // ------------------------------------------------------------ clock HUD
    clock({ value = '', icon: ic = 'clock', corner = 'top-left' } = {}) {
      const text = h('span', { class: 'fig-clock__value' });
      const el = h('div', { class: 'fig-clock' }, h('span', { class: 'fig-clock__icon', html: icon(ic) }), text);
      hudCorner(ctx.stage, corner).prepend(el);
      let v = value;
      const set = (x) => { v = x; text.textContent = String(x); };
      set(value);
      return { el, set, get value() { return v; } };
    },
  };
}
