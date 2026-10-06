// home-window — the small "try it" figure in the home page's reading guide.
// One cell and its shop window (MHC class I). A segmented control switches
// between a healthy cell, a virus-infected cell and a cancer cell, so the
// reader sees which fragments each one puts on display.
import { healthyCell, cancerCell, mhc1, placeOnMembrane, tissueField } from '../art/index.js';

const STATES = {
  healthy: {
    label: 'Healthy',
    caption: 'A healthy cell displays peptides from its own proteins only: “self”. Killer T cells check the display and move on.',
    pattern: ['self'],
    odd: null,
  },
  infected: {
    label: 'Infected',
    caption: 'A virus-infected cell also displays peptides from viral proteins (pink). To a killer T cell, they are unmistakably foreign.',
    pattern: ['self', 'viral', 'self', 'self', 'viral'],
    odd: 'Viral peptide',
  },
  cancer: {
    label: 'Cancer',
    caption: 'A cancer cell displays mostly self, plus a few peptides from mutated proteins (pink). Those few are what T cells can find.',
    pattern: ['self', 'self', 'neo', 'self', 'self', 'self', 'self', 'neo', 'self', 'self'],
    odd: 'Mutated peptide',
  },
};

const LAYOUTS = {
  wide: { vb: [640, 360], cell: [320, 182], r: 106, self: { text: [70, 62], anchor: 'start' }, odd: { text: [578, 318], anchor: 'end' } },
  compact: { vb: [400, 400], cell: [200, 208], r: 92, self: { text: [24, 38], anchor: 'start' }, odd: { text: [376, 382], anchor: 'end' } },
};

export default function mount(fig, ctx) {
  const { gsap } = ctx;
  ctx.setAspect(16 / 9, 1);
  const svg = ctx.createSVG({ viewBox: '0 0 640 360' });
  let state = 'healthy';
  let L = ctx.compact ? LAYOUTS.compact : LAYOUTS.wide;
  let layoutName = ctx.compact ? 'compact' : 'wide';
  let current = null;

  const back = ctx.svg('g', null, svg);
  const cellLayer = ctx.svg('g', null, svg);
  const labelLayer = ctx.svg('g', null, svg);

  function beadPositions(cellG, cx, cy) {
    const out = { self: [], odd: [] };
    for (const g of cellG.querySelectorAll('[data-part="receptors"] > [data-peptide]')) {
      const m = (g.getAttribute('transform') || '').match(/translate\(([-\d.]+)[ ,]+([-\d.]+)\)\s*rotate\(([-\d.]+)\)/);
      if (!m) continue;
      const [x, y, rot] = [+m[1], +m[2], (+m[3] * Math.PI) / 180];
      const d = 0.735 * 24;
      const p = { x: cx + x + Math.sin(rot) * d, y: cy + y - Math.cos(rot) * d };
      (g.getAttribute('data-peptide') === 'self' ? out.self : out.odd).push(p);
    }
    return out;
  }

  function label(text, at, spec) {
    const grp = ctx.svg('g', null, labelLayer);
    const [tx, ty] = spec.text;
    const w = text.length * 7.4;
    const lx = spec.anchor === 'start' ? tx + Math.min(w * 0.5, 44) : tx - Math.min(w * 0.5, 44);
    const ly = ty + (at.y > ty ? 9 : -19);
    const dx = at.x - lx, dy = at.y - ly, len = Math.hypot(dx, dy) || 1;
    ctx.svg('line', { class: 'leader', x1: lx, y1: ly, x2: at.x - (dx / len) * 7, y2: at.y - (dy / len) * 7 }, grp);
    ctx.svg('circle', { class: 'leader-dot', cx: at.x, cy: at.y, r: 2.4 }, grp);
    ctx.svg('text', { class: 't-label t-halo', x: tx, y: ty, 'text-anchor': spec.anchor, text }, grp);
    return grp;
  }

  function nearest(list, x, y) {
    return list.slice().sort((a, b) => Math.hypot(a.x - x, a.y - y) - Math.hypot(b.x - x, b.y - y))[0];
  }

  function draw(animate) {
    const S = STATES[state];
    const [cx, cy] = L.cell;
    const g = ctx.svg('g', { transform: `translate(${cx} ${cy})` }, cellLayer);
    const node = state === 'cancer'
      ? cancerCell({ r: L.r * 1.05, seed: 11, mhc: false, pdl1: false, receptors: true })
      : healthyCell({ r: L.r, seed: 4, state: state === 'infected' ? 'infected' : 'healthy', mhc: false, sides: 6 });
    g.appendChild(node);
    placeOnMembrane(node, (o, i) => mhc1({ ...o, peptide: S.pattern[i % S.pattern.length] }), { count: 10, size: 24, seed: 3, offset: 0.15 });
    labelLayer.replaceChildren();
    const beads = beadPositions(node, cx, cy);
    const [sx, sy] = L.self.text;
    const [ox, oy] = L.odd.text;
    const selfBead = nearest(beads.self, sx, sy);
    const labels = [];
    if (selfBead) labels.push(label('Self peptide', selfBead, L.self));
    if (S.odd && beads.odd.length) labels.push(label(S.odd, nearest(beads.odd, ox, oy), L.odd));
    const cellName = state === 'cancer' ? 'Cancer cell' : state === 'infected' ? 'Infected cell' : 'Healthy cell';
    const nameAt = layoutName === 'wide' ? [cx, cy + L.r + 40] : [cx, cy - L.r - 44];
    const name = ctx.svg('text', { class: 't-caps t-mid', x: nameAt[0], y: nameAt[1], text: cellName }, labelLayer);
    labels.push(name);

    const old = current;
    current = g;
    if (animate && !ctx.reducedMotion) {
      gsap.fromTo(g, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'so.out' });
      gsap.fromTo(labels, { opacity: 0 }, { opacity: 1, duration: 0.5, delay: 0.25, ease: 'so.out' });
      if (old) gsap.to(old, { opacity: 0, duration: 0.45, ease: 'so.in', onComplete: () => old.remove() });
    } else if (old) old.remove();
    caption.textContent = S.caption;
  }

  function layout() {
    const [w, h] = L.vb;
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    back.replaceChildren(tissueField({ width: w, height: h, seed: 8, density: 0.7 }));
    cellLayer.replaceChildren();
    current = null;
    draw(false);
    ctx.refreshTextScale();
  }

  const seg = ctx.ui.segmented({
    label: 'Cell',
    value: state,
    options: Object.entries(STATES).map(([value, s]) => ({ value, label: s.label })),
    onChange: (v) => { state = v; draw(true); ctx.announce(STATES[v].caption); },
  });
  const caption = ctx.h('p', { class: 'demo-window__caption' });
  ctx.caption.append(caption);

  ctx.onResize(({ compact }) => {
    const name = compact ? 'compact' : 'wide';
    if (name === layoutName && current) return;
    layoutName = name;
    L = LAYOUTS[name];
    layout();
  });
  if (!current) layout();

  return { destroy() { seg.el.remove(); } };
}
