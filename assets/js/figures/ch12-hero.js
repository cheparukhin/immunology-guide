// ch12-hero — "The frontier": at the edge of a cold violet tumor nest, killer T cells trickle one by
// one out of a blood vessel and into the nest — a cold tumor slowly turning hot.
import { bloodVessel, cancerCell, tCell, breathe, crawl, cellInfo } from '../art/index.js';
import { heroScene, setPose } from './shared/hero-kit.js';

export default function mount(fig, ctx) {
  let vessel, nest = [], spots = [], count = 0, vx;

  function arrive(api, i, { still = false } = {}) {
    const k = api.k;
    const t = tCell({ variant: 'cd8', r: 25 * k, state: 'activated', polarity: 0, seed: 200 + i, stage: api.stage });
    const target = spots[i % spots.length];
    if (still) { setPose(t, { x: target[0], y: target[1], a: 0 }); api.main.appendChild(t); return; }
    // each newcomer leaves the vessel in its own lane, level with its spot, so paths never cross
    const y0 = api.cy + (target[1] - api.cy) * 0.85;
    setPose(t, { x: vx, y: y0, a: 0 });
    t.setAttribute('opacity', '0');
    api.main.appendChild(t);
    api.play(api.gsap.to(t, { opacity: 1, duration: 2 }));
    api.play(crawl(t, { path: [[vx + 75 * k, y0], [(vx + target[0]) / 2, (y0 + target[1]) / 2], target], speed: 13 }));
  }

  return heroScene(ctx, {
    seed: 120,
    density: 0.8,
    draw(api) {
      const { stage, k } = api;
      count = 0;
      vx = api.X(-205 * (api.band ? 1.25 : 1));
      vessel = bloodVessel({ length: api.H * 1.25, width: 118 * k, leaky: true, rbc: 9, seed: 3, stage });
      vessel.setAttribute('transform', `translate(${vx} ${api.cy}) rotate(90)`);
      api.main.appendChild(vessel);
      const cx = api.X(95 * (api.band ? 1.15 : 1));
      const offs = [[0, 0], [-62, -52], [64, -48], [-58, 62], [66, 58], [4, -112], [10, 118], [124, 4]];
      nest = offs.map(([dx, dy], i) => {
        const c = cancerCell({ r: 44 * k, seed: 300 + i, stage, receptors: false });
        api.put(c, cx + dx * k, api.cy + dy * k * api.ky);
        if (i < 3) api.track(breathe(c, { amplitude: 0.7 }));
        return c;
      });
      // where the T cells settle, in arrival order: deep in the nest first, then its edge, so no
      // newcomer has to cross a cell already in place (≥ 2 T-cell radii apart)
      spots = [[-15, -50], [-10, 62], [-100, 4], [-60, -110], [-70, 118]].map(([dx, dy]) => [cx + dx * k, api.cy + dy * k * api.ky]);
    },
    events: [{
      first: 3, every: [20, 26],
      run(api) {
        if (count >= 5) { api.refresh({ fade: 3.2 }); return; }
        arrive(api, count++);
      },
    }],
    still(api) { [0, 1, 2].forEach((i) => arrive(api, i, { still: true })); },
  });
}
