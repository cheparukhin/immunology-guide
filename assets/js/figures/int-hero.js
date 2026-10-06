// int-hero — "130 years": three silhouettes dissolve into one another at the center of the lens —
// a chartreuse bacterium (Coley's toxins), a white-outlined drug antibody, a CAR-T cell.
import { bacterium, antibody, tCell, car, placeOnMembrane, breathe, el } from '../art/index.js';
import { heroScene } from './shared/hero-kit.js';

export default function mount(fig, ctx) {
  let frames = [], cur = 0;

  return heroScene(ctx, {
    seed: 130,
    density: 0.75,
    draw(api) {
      const { stage, k } = api;
      const wrap = (node, scale = 1) => {
        const g = el('g', { transform: `translate(${api.cx} ${api.cy}) scale(${scale})`, opacity: 0 });
        g.appendChild(node);
        api.main.appendChild(g);
        return g;
      };
      const bug = wrap(bacterium({ r: 92 * k, angle: -18, flagella: 2, pili: true, seed: 3, stage }));
      const ab = wrap(antibody({ variant: 'therapeutic', size: 185 * k, anchor: 'center', stage }));
      const cell = tCell({ variant: 'cd8', r: 82 * k, seed: 4, stage, receptors: false });
      placeOnMembrane(cell, (o) => car({ ...o, size: 34 * k }), { count: 9, size: 34 * k, seed: 2 });
      api.track(breathe(cell, { amplitude: 0.8 }));
      const carT = wrap(cell);
      frames = [bug, ab, carT];
      frames[cur].setAttribute('opacity', '1');
    },
    events: [{
      first: 9, every: 20,
      run(api) {
        const a = frames[cur], b = frames[(cur + 1) % 3];
        cur = (cur + 1) % 3;
        api.play(api.gsap.to(a, { opacity: 0, duration: 3.2, ease: 'sine.inOut' }));
        api.play(api.gsap.fromTo(b, { opacity: 0 }, { opacity: 1, duration: 3.2, ease: 'sine.inOut', delay: 0.6 }));
      },
    }],
    still() {
      frames.forEach((f, i) => f.setAttribute('opacity', i === 1 ? '1' : '0'));
    },
  });
}
