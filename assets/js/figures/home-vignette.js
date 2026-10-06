// home-vignette — the round "eyepiece" beside each Part on the home page.
// Decorative (the figure is aria-hidden): a few cells that set the mood of the
// Part, breathing gently. The variant comes from the figure's fig-data JSON:
//   defenders · enemy · tide
import {
  tCell, bCell, dendriticCell, cancerCell, healthyCell, antibody, tissueField, breathe, drift,
} from '../art/index.js';

export default function mount(fig, ctx) {
  ctx.setAspect(1, 1);
  const svg = ctx.createSVG({ viewBox: '0 0 200 200' });
  const variant = ctx.data.variant || 'defenders';
  const loops = [];
  // ctx.track pauses art-library loops off-screen / in hidden tabs and stops them on destroy.
  const keep = (h) => (ctx.track ? ctx.track(h) : h);

  svg.appendChild(tissueField({ width: 200, height: 200, seed: variant.length * 7, density: 0.7 }));
  const put = (node, x, y, extra = '') => {
    node.setAttribute('transform', `translate(${x} ${y})${extra}`);
    svg.appendChild(node);
    return node;
  };
  const dim = (node, o) => { node.setAttribute('opacity', o); return node; };

  if (variant === 'defenders') {
    // A dendritic cell briefing T cells, a B cell nearby: the cast of Part I.
    const dc = put(dendriticCell({ state: 'mature', r: 64, seed: 5 }), 82, 108);
    const killer = put(tCell({ variant: 'cd8', r: 18, seed: 3 }), 150, 70);
    const helper = put(tCell({ variant: 'cd4', r: 16, seed: 9 }), 146, 146);
    dim(put(bCell({ r: 14, seed: 4 }), 46, 34), 0.85);
    loops.push(keep(breathe(dc, { amplitude: 1.2, period: 7 })), keep(breathe(killer)), keep(breathe(helper, { period: 5 })));
  } else if (variant === 'enemy') {
    // A cancer cell dividing among healthy neighbours.
    dim(put(healthyCell({ r: 34, seed: 3, mhc: 7 }), 34, 40), 0.7);
    dim(put(healthyCell({ r: 30, seed: 8, mhc: 6 }), 172, 160), 0.7);
    dim(put(healthyCell({ r: 28, seed: 12, mhc: 6 }), 168, 36), 0.55);
    const tumor = put(cancerCell({ state: 'dividing', r: 46, seed: 6 }), 98, 112, ' rotate(-18)');
    dim(put(cancerCell({ r: 20, seed: 9 }), 38, 160), 0.85);
    loops.push(keep(breathe(tumor, { amplitude: 1.3, period: 6 })));
  } else {
    // A killer T cell docked on a cancer cell, drug antibodies drifting in.
    const tumor = put(cancerCell({ r: 44, seed: 14, pdl1: 3 }), 118, 118);
    const killer = put(tCell({ variant: 'cd8', state: 'activated', r: 21, polarity: 40, seed: 2 }), 56, 64);
    const abs = [
      put(antibody({ variant: 'therapeutic', size: 22, anchor: 'center' }), 160, 42, ' rotate(24)'),
      put(antibody({ variant: 'therapeutic', size: 18, anchor: 'center' }), 36, 150, ' rotate(-30)'),
      put(antibody({ variant: 'therapeutic', size: 15, anchor: 'center' }), 176, 176, ' rotate(60)'),
    ];
    loops.push(keep(breathe(tumor, { period: 7 })), keep(breathe(killer)), keep(drift(abs, { amplitude: 4, speed: 0.2 })));
  }

  return {
    destroy() { loops.forEach((l) => l.stop()); },
  };
}
