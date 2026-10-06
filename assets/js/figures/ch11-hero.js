// ch11-hero — "Teaching the body to see": an immature dendritic cell takes up a few tiny vaccine
// particles and slowly matures — its dendrites lengthen and pink peptides appear in its windows.
import { dendriticCell, vesicle, pamp, breathe, drift, el, cellInfo, PALETTE } from '../art/index.js';
import { heroScene, setPose, glide, settle } from './shared/hero-kit.js';

export default function mount(fig, ctx) {
  let dc, dcBreath, parts = [], holder;

  const draw = (api, m) => dendriticCell({ r: 136 * api.k, maturity: m, seed: 8, stage: api.stage });
  function setMaturity(api, m) {
    const next = draw(api, m);
    holder.replaceChildren(next);
    if (dcBreath) dcBreath.stop();
    dcBreath = api.track(breathe(next, { amplitude: 1.4 }));
    dc = next;
  }
  function particle(api, i) {
    const g = el('g', {});
    g.appendChild(vesicle({ kind: 'endosome', r: 8.5 * api.k + 1.5, seed: i, stage: api.stage, color: '#C9D3F0' }));
    g.appendChild(pamp({ kind: 'rna', size: 9 * api.k + 2, stage: api.stage, color: PALETTE.foreignPeptide, rotation: i * 50 }));
    return g;
  }

  return heroScene(ctx, {
    seed: 111,
    draw(api) {
      holder = el('g', { transform: `translate(${api.cx} ${api.cy})` });
      api.main.appendChild(holder);
      setMaturity(api, 0);
      const spots = [[-215, -120], [205, -140], [230, 80], [-225, 110], [40, 230], [-60, -235]];
      parts = spots.map(([dx, dy], i) => {
        const node = particle(api, i);
        setPose(node, { x: api.X(dx * (api.band ? 1.15 : 1)), y: api.Y(dy), a: 0 });
        api.main.appendChild(node);
        return { node, drift: api.track(drift([node], { amplitude: 11, speed: 0.16, seed: 120 + i })) };
      });
    },
    events: [{
      first: 4, every: [34, 40],
      run(api) {
        // three particles are taken up …
        parts.slice(0, 3).forEach((P, i) => {
          settle(P.node, P.drift);
          const a = i * 2.1 + 0.4, rr = cellInfo(dc).bodyR * 0.35;
          api.after(i * 1.3, () => glide(api, P.node, { x: api.cx + Math.cos(a) * rr, y: api.cy + Math.sin(a) * rr, a: 40 }, { duration: 5.5, scale: 0.6, opacity: 0 }));
        });
        // … and the cell slowly matures
        for (let s = 1; s <= 20; s++) api.after(7 + s * 0.42, () => setMaturity(api, s / 20));
        api.after(28, () => api.refresh({ fade: 3 }));
      },
    }],
    still(api) {
      setMaturity(api, 1);
      parts.slice(0, 3).forEach((P) => P.node.setAttribute('opacity', '0'));
    },
  });
}
