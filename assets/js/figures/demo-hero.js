// demo-hero — reference implementation of a chapter HERO figure, drawn with the
// illustration library (assets/js/art/, docs/ART.md).
//
// A hero figure is ambient: no controls, no captions, no steps. CSS decides its
// shape (a round "lens" beside the title on wide screens, a soft 2:1 band under
// the dek on phones), so the module redraws for whatever aspect it gets.
//
// It shows:
//   • art-library factories (tissueField, macrophage, neutrophil, bacterium, label-free)
//   • ctx.artStage → the `stage` option every factory needs
//   • ctx.track(handle) → art animation helpers (breathe, drift, crawl) pause off-screen,
//     in hidden tabs and under reduced motion, and stop on destroy
//   • ctx.onResize → redraw for the stage's current aspect (viewBox matches it exactly)
import { tissueField, macrophage, neutrophil, bacterium, breathe, drift, crawl, cellInfo } from '../art/index.js';

export default function mount(fig, ctx) {
  const svg = ctx.createSVG({ viewBox: '0 0 600 600' });
  const handles = new Set();
  let lastKey = '';

  function draw({ width, height }) {
    // Match the viewBox to the stage aspect so nothing is letterboxed.
    const W = 600;
    const H = Math.round((W * height) / Math.max(1, width));
    const key = `${H}|${ctx.artStage}`;
    if (key === lastKey) return;
    lastKey = key;
    handles.forEach((h) => h.stop());
    handles.clear();
    for (const n of [...svg.children]) if (n !== svg.defs) n.remove();
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const stage = ctx.artStage;
    const s = Math.min(W, H) / 600;            // 1 in the square lens, 0.5 in the 2:1 band

    // Background tissue: fibres, out-of-focus cells, dust.
    svg.append(tissueField({ width: W, height: H, seed: 4, stage, density: 0.9 }));

    // The protagonist: a macrophage reaching for a bacterium.
    const cx = W * 0.47;
    const cy = H * 0.54;
    const m = macrophage({ r: 150 * s + 40 * (1 - s), state: 'engulfing', polarity: -25, seed: 3, stage });
    m.setAttribute('transform', `translate(${cx} ${cy})`);
    const { mouth } = cellInfo(m);
    const prey = bacterium({ r: 22 * s + 6, angle: 65, pamps: true, flagella: 1, seed: 2, stage });
    prey.setAttribute('transform', `translate(${cx + mouth.x * 1.08} ${cy + mouth.y * 1.08})`);
    svg.append(m, prey);
    handles.add(ctx.track(breathe(m, { amplitude: 1.2 })));

    // A few more bacteria drifting nearby.
    const spots = [[0.82, 0.2], [0.16, 0.24], [0.86, 0.78], [0.24, 0.86]];
    const free = spots.map(([x, y], i) => {
      const b = bacterium({ r: 15 * s + 5, angle: 30 + i * 50, seed: 10 + i, stage });
      b.setAttribute('transform', `translate(${W * x} ${H * y})`);
      return b;
    });
    const drifters = svg.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'g'));
    drifters.append(...free);
    handles.add(ctx.track(drift(free, { amplitude: 8, speed: 0.2, seed: 5 })));

    // A neutrophil crawling in from the edge (crawl owns the cell's transform).
    const n = neutrophil({ r: 30 * s + 10, state: 'crawling', polarity: 200, seed: 6, stage });
    svg.append(n);
    n.setAttribute('transform', `translate(${W * 1.04} ${H * 0.36})`);
    handles.add(ctx.track(crawl(n, { path: [[W * 1.04, H * 0.36], [W * 0.78, H * 0.42], [W * 0.7, H * 0.3]], speed: 14, loop: false })));
  }

  ctx.onResize(draw);
  ctx.onThemeChange(() => { lastKey = ''; draw({ width: ctx.width, height: ctx.height }); });
  return { destroy() { handles.forEach((h) => h.stop()); } };
}
