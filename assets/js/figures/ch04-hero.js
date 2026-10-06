// ch04-hero — "How T cells see": a mature dendritic cell waves dendrites studded with pink
// peptides; T cells brush past, and now and then one docks and lights up.
import { dendriticCell, tCell, breathe, crawl, glowPulse, cellInfo, PALETTE } from '../art/index.js';
import { heroScene, setPose, poseOf } from './shared/hero-kit.js';

export default function mount(fig, ctx) {
  let dc, ts = [], center;

  const loopPath = (api, i) => {
    const pts = [];
    // two lanes far enough apart (and a small wobble) that passing T cells never overlap
    const base = 170 + (i % 2) * 80;
    const ph = i * (Math.PI / 2) + 0.4;
    // phone band: wider in x, and never closer than one cell (plus margin) to the top/bottom edge
    const yMax = api.H / 2 - 27 * api.k - 16;
    for (let j = 0; j < 12; j++) {
      const a = ph + (j / 12) * Math.PI * 2 * (i % 2 ? 1 : -1);
      const rr = base + Math.sin(j * 2.1 + i) * 9;
      const dy = Math.sin(a) * rr * api.ky;
      pts.push([api.X(Math.cos(a) * rr * (api.band ? 1.15 : 1)), api.cy + Math.max(-yMax, Math.min(yMax, dy))]);
    }
    return pts;
  };
  const patrol = (api, T) => {
    if (T.h) T.h.stop();
    T.h = api.track(crawl(T.node, { path: T.path, speed: 13, loop: true }));
  };

  return heroScene(ctx, {
    seed: 21,
    draw(api) {
      const { stage, k } = api;
      center = { x: api.cx, y: api.cy };
      dc = dendriticCell({ r: 140 * k, state: 'mature', seed: 5, stage });
      api.put(dc, center.x, center.y);
      api.track(breathe(dc, { amplitude: 1.8 }));
      ts = ['cd8', 'cd4', 'cd8', 'cd4'].map((variant, i) => {
        const node = tCell({ variant, r: 27 * k, seed: 10 + i, stage });
        const path = loopPath(api, i);
        setPose(node, { x: path[0][0], y: path[0][1], a: 0 });
        api.main.appendChild(node);
        const T = { node, path, variant, h: null };
        patrol(api, T);
        return T;
      });
    },
    events: [{
      first: 5, every: [24, 34],
      run(api) {
        const T = ts[Math.floor(api.rng() * ts.length)];
        T.h.stop();
        const p = poseOf(T.node);
        const a = Math.atan2(p.y - center.y, p.x - center.x);
        const reach = cellInfo(dc).bodyR + 27 * api.k * 1.05;
        T.h = api.track(crawl(T.node, {
          to: [center.x + Math.cos(a) * reach, center.y + Math.sin(a) * reach], speed: 15,
          onArrive: () => {
            api.play(glowPulse(T.node, { color: PALETTE[T.variant], duration: 2400, scale: 1.7 }));
            api.after(7, () => patrol(api, T));
          },
        }));
      },
    }],
    still(api) {
      // the others patrol at rest, spread around the lens
      ts.slice(1).forEach((U, j) => {
        if (U.h) U.h.stop();
        const i = j + 1, a = [2.6, 1.25, 4.35][j], rr = 170 + (i % 2) * 80;
        const yMax = api.H / 2 - 27 * api.k - 16;
        const dy = Math.max(-yMax, Math.min(yMax, Math.sin(a) * rr * api.ky));
        setPose(U.node, { x: api.X(Math.cos(a) * rr * (api.band ? 1.15 : 1)), y: api.cy + dy, a: 0 });
      });
      const T = ts[0];
      const a = -0.4;
      const reach = cellInfo(dc).bodyR + 27 * api.k * 1.05;
      setPose(T.node, { x: center.x + Math.cos(a) * reach, y: center.y + Math.sin(a) * reach, a: 0 });
      glowPulse(T.node, { color: PALETTE.cd8, duration: 1e9, scale: 1.6 });
    },
  });
}
