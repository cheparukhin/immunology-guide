// ch06-hero — "When cells go rogue": among calm sand cells, one violet cancer cell slowly pinches
// in two; its daughters, a shade apart in hue, nudge the healthy neighbors aside.
import { healthyCell, cancerCell, breathe } from '../art/index.js';
import { heroScene } from './shared/hero-kit.js';
import { run } from './shared/cell-actions.js';

export default function mount(fig, ctx) {
  let tumor, neighbors = [];
  const cancerArt = (api, extra = {}) => cancerCell({ r: 50 * api.k, seed: 3, stage: api.stage, receptors: false, ...extra });

  function cycle(api, { still = false } = {}) {
    const axis = -35;
    const ax = (axis * Math.PI) / 180;
    api.play(run.swap(tumor, cancerArt(api, { state: 'dividing' }), { duration: 2.6 }));
    const split = () => {
      const d = run.divide(tumor, 2, { angle: axis, duration: 2.8, spread: 50 * api.k * 1.05 });
      api.play(d);
      const [a, b] = d.result;
      const recolor = () => {
        api.play(run.swap(a, cancerArt(api, { clone: 1, seed: 4 }), { duration: 2.4 }));
        api.play(run.swap(b, cancerArt(api, { clone: 2, seed: 5 }), { duration: 2.4 }));
        for (const N of neighbors) {
          const dx = N.plan.x - api.cx, dy = N.plan.y - api.cy;
          const along = Math.abs(Math.cos(Math.atan2(dy, dx) - ax));
          const push = (10 + 16 * along) * api.k;
          const L = Math.hypot(dx, dy) || 1;
          api.play(run.move(N, { x: N.plan.x + (dx / L) * push, y: N.plan.y + (dy / L) * push * api.ky, duration: 5, stretch: 0 }));
        }
      };
      if (still) recolor(); else api.after(3, recolor);
    };
    if (still) split(); else api.after(3.2, split);
  }

  return heroScene(ctx, {
    seed: 46,
    tint: '#E9C9A1',
    density: 0.7,
    draw(api) {
      const { stage, k } = api;
      neighbors = [];
      const ring = [[-150, -10], [-80, -130], [70, -140], [160, -30], [125, 115], [-20, 150], [-140, 120], [-250, -110], [240, 130]];
      ring.forEach(([dx, dy], i) => {
        const art = healthyCell({ r: 52 * k, seed: 20 + i, stage, receptors: false });
        const N = api.rig(art, { x: api.X(dx * (api.band ? 1.3 : 1)), y: api.Y(dy) });
        neighbors.push(N);
      });
      tumor = api.rig(cancerArt(api), { x: api.cx, y: api.cy });
      api.track(breathe(tumor.art, { amplitude: 1.2 }));
    },
    events: [{
      first: 4, every: [28, 34],
      run(api) {
        cycle(api);
        api.after(22, () => api.refresh({ fade: 3 }));
      },
    }],
    still(api) { cycle(api, { still: true }); },
  });
}
