// One floating panel, positioned next to an anchor and kept inside the
// viewport. Used for glossary definitions, citation previews and figure
// tooltips. Position: fixed, flips above/below, arrow tracks the anchor.
import { h, clamp, uniqueId } from './dom.js';

const MARGIN = 12;   // min distance from viewport edges
const GAP = 10;      // distance from anchor

export class Floating {
  constructor({ className = '', role = 'tooltip' } = {}) {
    this.el = h('div', { class: `popover ${className}`.trim(), role, id: uniqueId('pop'), hidden: true });
    this.anchor = null;
  }

  get isOpen() { return !this.el.hidden && this.el.classList.contains('is-open'); }

  /**
   * Show content next to an anchor element, or next to a point {x, y} (viewport px).
   * opts.point: prefer the anchor's client rect nearest to this point (multi-line links).
   */
  show(anchor, content, opts = {}) {
    if (!this.el.isConnected) document.body.append(this.el);
    if (typeof content === 'string') this.el.innerHTML = content;
    else { this.el.replaceChildren(content); }
    this.anchor = anchor;
    this.el.hidden = false;
    this.place(anchor, opts);
    // next frame → transition in
    requestAnimationFrame(() => this.el.classList.add('is-open'));
  }

  place(anchor, { point, prefer = 'bottom' } = {}) {
    const el = this.el;
    let rect;
    if (anchor && typeof anchor.getClientRects === 'function') {
      const rects = Array.from(anchor.getClientRects());
      rect = rects[0] || anchor.getBoundingClientRect();
      if (point && rects.length > 1) {
        rect = rects.reduce((best, r) => {
          const d = Math.abs((r.top + r.bottom) / 2 - point.y);
          const bd = Math.abs((best.top + best.bottom) / 2 - point.y);
          return d < bd ? r : best;
        }, rects[0]);
      }
    } else {
      const p = anchor || point;
      rect = { left: p.x, right: p.x, top: p.y, bottom: p.y, width: 0, height: 0 };
    }
    el.style.left = '0px';
    el.style.top = '0px';
    const vw = document.documentElement.clientWidth;
    const vh = innerHeight;
    const w = el.offsetWidth;
    const hgt = el.offsetHeight;
    const spaceBelow = vh - rect.bottom - GAP - MARGIN;
    const spaceAbove = rect.top - GAP - MARGIN;
    let side = prefer;
    if (side === 'bottom' && spaceBelow < hgt && spaceAbove > spaceBelow) side = 'top';
    if (side === 'top' && spaceAbove < hgt && spaceBelow > spaceAbove) side = 'bottom';
    const cx = rect.left + rect.width / 2;
    const left = clamp(cx - w / 2, MARGIN, Math.max(MARGIN, vw - w - MARGIN));
    const top = side === 'bottom' ? rect.bottom + GAP : rect.top - GAP - hgt;
    el.dataset.side = side;
    el.style.left = `${Math.round(left)}px`;
    el.style.top = `${Math.round(clamp(top, MARGIN, vh - hgt - MARGIN))}px`;
    el.style.setProperty('--arrow-x', `${Math.round(clamp(cx - left, 14, w - 14))}px`);
  }

  hide() {
    if (this.el.hidden) return;
    this.el.classList.remove('is-open');
    this.anchor = null;
    const el = this.el;
    clearTimeout(this._t);
    this._t = setTimeout(() => { if (!el.classList.contains('is-open')) el.hidden = true; }, 200);
  }

  contains(node) { return this.el.contains(node); }
}
