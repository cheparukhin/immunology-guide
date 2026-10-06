// Figure controls: button, playPause, slider, toggle (switch), segmented,
// legend, stat, group, spacer — plus stepper (see stepper.js).
// Every factory appends to ctx.controls by default (pass `parent` to put it
// elsewhere, or parent: null to place it yourself) and returns a small
// handle { el, … }. All are keyboard-accessible and themed by components.css.
import { h, icon, clamp } from './dom.js';
import { createStepper } from './stepper.js';
import { createKit } from './kit.js';

export function createUI(ctx) {
  const put = (el, parent) => {
    const p = parent === undefined ? ctx.controls : parent;
    if (p) p.append(el);
    return el;
  };

  const ui = {
    /** Plain button. variant: 'default' | 'primary' | 'ghost'; icon: name from dom.js icons. */
    button({ label, icon: ic, variant = 'default', onClick, title, parent, small = false, iconOnly = false, pressed } = {}) {
      const el = h('button', {
        type: 'button',
        class: ['btn', variant !== 'default' && `btn--${variant}`, small && 'btn--sm', iconOnly && 'btn--icon'],
        title: title || (iconOnly ? label : null),
        'aria-label': iconOnly ? label : null,
        'aria-pressed': pressed == null ? null : String(!!pressed),
        html: `${ic ? icon(ic) : ''}${iconOnly ? '' : `<span class="btn__text">${label}</span>`}`,
      });
      if (onClick) el.addEventListener('click', (e) => onClick(e), { signal: ctx.signal });
      put(el, parent);
      return {
        el,
        set label(v) { const t = el.querySelector('.btn__text'); if (t) t.textContent = v; else el.setAttribute('aria-label', v); },
        set disabled(v) { el.disabled = !!v; },
        set pressed(v) { el.setAttribute('aria-pressed', String(!!v)); },
      };
    },

    /**
     * Play/pause toggle. onChange(playing) fires on user clicks only.
     * Pass `loop` (a ctx.loop handle) to bind button and loop both ways.
     */
    playPause({ playing = false, onChange, loop, labels = { play: 'Play', pause: 'Pause' }, parent, small = false, iconOnly = false } = {}) {
      let state = loop ? loop.playing : !!playing;
      const el = h('button', { type: 'button', class: ['btn', 'btn--play', small && 'btn--sm', iconOnly && 'btn--icon'] });
      const paint = () => {
        const lbl = state ? labels.pause : labels.play;
        el.innerHTML = `${icon(state ? 'pause' : 'play')}${iconOnly ? '' : `<span class="btn__text">${lbl}</span>`}`;
        el.setAttribute('aria-label', lbl);
      };
      paint();
      el.addEventListener('click', () => {
        state = !state;
        paint();
        if (loop) loop.toggle(state);
        onChange?.(state);
      }, { signal: ctx.signal });
      if (loop?.onChange) loop.onChange((v) => { if (v !== state) { state = v; paint(); } });
      put(el, parent);
      return {
        el,
        get playing() { return state; },
        set(v) { state = !!v; paint(); },
      };
    },

    /**
     * Range slider.
     *   ctx.ui.slider({ label: 'Signal strength', min: 0, max: 100, step: 1, value: 40,
     *                   format: v => `${v}%`, onInput: v => …, onChange: v => … })
     * onInput fires continuously while dragging; onChange when released / on keyboard.
     */
    slider({ label, min = 0, max = 1, step = 0.01, value = (min + max) / 2, format = (v) => String(v), describe, onInput, onChange, ticks, parent, color, id } = {}) {
      const inputId = id || ctx.uid('slider');
      const out = h('output', { class: 'slider__value', for: inputId });
      const input = h('input', { class: 'slider__input', type: 'range', id: inputId, min, max, step, value });
      const el = h('div', { class: 'slider' },
        h('label', { class: 'slider__label', for: inputId }, label),
        out,
        input,
        ticks ? h('div', { class: 'slider__ticks', 'aria-hidden': 'true' }, ...ticks.map((t) => h('span', null, t))) : null);
      if (color) el.style.setProperty('--fill-color', color);
      const paint = () => {
        const v = Number(input.value);
        out.textContent = format(v);
        input.setAttribute('aria-valuetext', describe ? describe(v) : format(v));
        el.style.setProperty('--fill', `${((v - min) / (max - min || 1)) * 100}%`);
      };
      paint();
      input.addEventListener('input', () => { paint(); onInput?.(Number(input.value)); }, { signal: ctx.signal });
      input.addEventListener('change', () => { onChange?.(Number(input.value)); }, { signal: ctx.signal });
      put(el, parent);
      return {
        el, input,
        get value() { return Number(input.value); },
        set(v, { silent = true } = {}) {
          input.value = String(clamp(v, min, max));
          paint();
          if (!silent) { onInput?.(Number(input.value)); onChange?.(Number(input.value)); }
        },
      };
    },

    /** On/off switch (role="switch"). */
    toggle({ label, checked = false, onChange, parent } = {}) {
      let state = !!checked;
      const el = h('button', { type: 'button', class: 'switch', role: 'switch', 'aria-checked': String(state) },
        h('span', { class: 'switch__track', 'aria-hidden': 'true' }),
        h('span', { class: 'switch__label' }, label));
      el.addEventListener('click', () => { state = !state; el.setAttribute('aria-checked', String(state)); onChange?.(state); }, { signal: ctx.signal });
      put(el, parent);
      return {
        el,
        get checked() { return state; },
        set(v, { silent = true } = {}) { state = !!v; el.setAttribute('aria-checked', String(state)); if (!silent) onChange?.(state); },
      };
    },

    /**
     * Segmented control (single choice, radiogroup with roving tabindex).
     *   ctx.ui.segmented({ label: 'Cell', options: [{ value: 'healthy', label: 'Healthy', color }, …],
     *                      value: 'healthy', onChange: v => … })
     */
    segmented({ label, options = [], value, onChange, parent, hideLabel = false } = {}) {
      let current = value ?? options[0]?.value;
      const labelId = ctx.uid('segmented');
      const track = h('div', { class: 'segmented__track', role: 'radiogroup', 'aria-labelledby': labelId });
      const buttons = options.map((o) => {
        const b = h('button', { type: 'button', class: 'segmented__opt', role: 'radio', dataset: { value: String(o.value) } },
          o.color ? h('span', { class: 'segmented__swatch', style: { background: o.color }, 'aria-hidden': 'true' }) : null,
          o.icon ? h('span', { html: icon(o.icon) }) : null,
          o.label);
        b.addEventListener('click', () => select(o.value, true), { signal: ctx.signal });
        track.append(b);
        return b;
      });
      const paint = () => buttons.forEach((b, i) => {
        const on = options[i].value === current;
        b.setAttribute('aria-checked', String(on));
        b.tabIndex = on ? 0 : -1;
      });
      const select = (v, user) => {
        if (v === current) return;
        current = v;
        paint();
        if (user) onChange?.(v);
      };
      track.addEventListener('keydown', (e) => {
        const i = options.findIndex((o) => o.value === current);
        let j = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = (i + 1) % options.length;
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = (i - 1 + options.length) % options.length;
        else if (e.key === 'Home') j = 0;
        else if (e.key === 'End') j = options.length - 1;
        if (j == null) return;
        e.preventDefault();
        select(options[j].value, true);
        buttons[j].focus();
      }, { signal: ctx.signal });
      paint();
      const el = h('div', { class: 'segmented' },
        h('span', { class: ['segmented__label', hideLabel && 'visually-hidden'], id: labelId }, label),
        track);
      put(el, parent);
      return {
        el,
        get value() { return current; },
        set(v, { silent = true } = {}) { const prev = current; current = v; paint(); if (!silent && prev !== v) onChange?.(v); },
      };
    },

    /**
     * Legend chips. items: [{ label, color, shape: 'circle'|'square'|'ring'|'line'|'dashed'|'glow', icon }]
     */
    legend(items = [], { parent, label = 'Legend' } = {}) {
      const el = h('ul', { class: 'legend', role: 'list', 'aria-label': label });
      const render = (list) => {
        el.replaceChildren(...list.map((it) => h('li', { class: 'legend__item', style: { '--sw': it.color } },
          it.icon
            ? h('span', { class: 'legend__icon', html: icon(it.icon) })
            : h('span', { class: `legend__swatch legend__swatch--${it.shape || 'circle'}`, style: { '--sw': it.color }, 'aria-hidden': 'true' }),
          h('span', null, it.label))));
        // CSS custom properties can't be set through Object.assign(style): set them explicitly.
        el.querySelectorAll('.legend__item').forEach((li, i) => li.style.setProperty('--sw', list[i].color));
      };
      render(items);
      put(el, parent);
      return { el, set: render };
    },

    /** Small numeric readout: ctx.ui.stat({ label: 'Neutrophils', value: 0 }).set(42) */
    stat({ label, value = '', unit = '', parent } = {}) {
      const v = h('span', { class: 'stat__value' });
      const el = h('div', { class: 'stat' }, h('span', { class: 'stat__label' }, label), v);
      const set = (val) => { v.innerHTML = `${val}${unit ? `<small>${unit}</small>` : ''}`; };
      set(value);
      put(el, parent);
      return { el, set };
    },

    /** A wrapper to keep controls together on one line: ui.group().append(…) */
    group({ parent, className = '' } = {}) { return put(h('div', { class: `group ${className}`.trim() }), parent); },
    /** Flexible space that pushes following controls to the right. */
    spacer({ parent } = {}) { return put(h('span', { class: 'spacer', 'aria-hidden': 'true' }), parent); },

    /** Step-through controller (see stepper.js / docs/FIGURES.md). */
    stepper(opts) { return createStepper(ctx, opts); },
  };
  // Figure UI kit additions: chips, infoCard, badge, badgeHTML, clock (kit.js).
  Object.assign(ui, createKit(ctx, put));
  return ui;
}
