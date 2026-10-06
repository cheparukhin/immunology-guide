// ch02-hero — "First responders": a coral macrophage reaches around a chartreuse bacterium and
// swallows it; another bacterium drifts in; now and then a neutrophil crawls past.
import { macrophage, neutrophil, bacterium, breathe, drift, crawl, cellInfo } from '../art/index.js';
import { heroScene, poseOf, setPose, glide, settle } from './shared/hero-kit.js';

export default function mount(fig, ctx) {
  let mac, mouth, prey, free, neut, neutPath;

  function spawnBacterium(api, i, edge = false) {
    const b = bacterium({ r: 17 * api.k + 4, angle: 20 + i * 47, seed: 30 + i, stage: api.stage, flagella: i % 2 });
    const spots = [[0.82, 0.2], [0.17, 0.25], [0.86, 0.8], [0.22, 0.84], [0.62, 0.12]];
    const [sx, sy] = spots[i % spots.length];
    const x = edge ? api.W * (sx > 0.5 ? 1.08 : -0.08) : api.W * sx;
    setPose(b, { x, y: api.H * sy, a: 0 });
    api.main.appendChild(b);
    const B = { node: b, drift: api.track(drift([b], { amplitude: 9, speed: 0.16, seed: 40 + i })) };
    if (edge) glide(api, b, { x: api.W * sx, y: api.H * sy, a: 0 }, { duration: 9 });
    return B;
  }

  function swallow(api) {
    if (!prey) return;
    const p = prey;
    prey = null;
    // drawn into the cup, then dissolving inside the macrophage
    glide(api, p, { x: mac.x + mouth.x * 0.25, y: mac.y + mouth.y * 0.25, a: poseOf(p).a + 30 }, { duration: 4.5, scale: 0.55, opacity: 0, onComplete: () => p.remove() });
    api.after(7, () => {
      const B = free.shift();
      if (!B) return;
      settle(B.node, B.drift);
      prey = B.node;
      glide(api, prey, { x: mac.x + mouth.x * 1.08, y: mac.y + mouth.y * 1.08, a: 65 }, { duration: 8 });
      free.push(spawnBacterium(api, Math.floor(api.rng() * 5), true));
    });
  }

  function passNeutrophil(api) {
    setPose(neut, { x: neutPath[0][0], y: neutPath[0][1], a: 0 });
    neut.setAttribute('opacity', '1');
    api.play(crawl(neut, { path: neutPath.slice(1), speed: 17, onArrive: () => neut.setAttribute('opacity', '0') }));
  }

  return heroScene(ctx, {
    seed: 4,
    draw(api) {
      const { stage } = api;
      const x = api.X(-22), y = api.Y(30);
      mac = { x, y };
      const m = macrophage({ r: 150 * api.k, state: 'engulfing', polarity: -25, seed: 3, stage });
      api.put(m, x, y);
      ({ mouth } = cellInfo(m));
      api.track(breathe(m, { amplitude: 1.2 }));
      prey = bacterium({ r: 22 * api.k + 4, angle: 65, pamps: true, flagella: 1, seed: 2, stage });
      setPose(prey, { x: x + mouth.x * 1.08, y: y + mouth.y * 1.08, a: 0 });
      api.main.appendChild(prey);
      free = [0, 1, 2, 3].map((i) => spawnBacterium(api, i));
      neut = neutrophil({ r: 30 * api.k + 6, state: 'crawling', polarity: 195, seed: 6, stage });
      neutPath = [[api.W * 1.08, api.Y(-150)], [api.X(170), api.Y(-120)], [api.X(-60), api.Y(-175)], [-api.W * 0.08, api.Y(-150)]];
      setPose(neut, { x: neutPath[0][0], y: neutPath[0][1], a: 0 });
      api.main.appendChild(neut);
    },
    events: [
      { first: 12, every: [24, 32], run: swallow },
      { first: 6, every: [30, 40], run: passNeutrophil },
    ],
    still(api) {
      setPose(neut, { x: api.X(150), y: api.Y(-125), a: 0 });
    },
  });
}
