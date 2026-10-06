// ch07-hero — "Hide and seek": a killer T cell approaches a small cancer cluster; one cell's shop
// window quietly sinks away (its MHC-I windows are lost), and the T cell passes it by.
import { cancerCell, tCell, mhc1, placeOnMembrane, breathe, crawl } from '../art/index.js';
import { heroScene, setPose } from './shared/hero-kit.js';
import { run } from './shared/cell-actions.js';

export default function mount(fig, ctx) {
  let cluster = [], killer, hideIdx = 2;
  const OFFS = [[-50, -62], [62, -48], [-40, 66], [70, 58]];
  const art = (api, i, hidden = false) => {
    const c = cancerCell({ r: 50 * api.k, seed: 50 + i, stage: api.stage, receptors: false });
    // only the cell the killer is after shows its typo (pink); its neighbours show self (sand), so
    // the killer ignoring them is right — and when that one window shutters, nothing is left to see
    if (!hidden) placeOnMembrane(c, (o, j) => mhc1({ ...o, peptide: i === hideIdx && j % 2 ? 'neo' : 'self' }), { count: 8, size: 17 * api.k, seed: i });
    return c;
  };
  const besideHidden = (api) => {
    const H = cluster[hideIdx];
    return [H.plan.x - 50 * api.k * 1.32 - 30 * api.k, H.plan.y + 8];
  };

  return heroScene(ctx, {
    seed: 71,
    draw(api) {
      const { stage, k } = api;
      const ox = api.X(80 * (api.band ? 1.2 : 1)), oy = api.cy;
      cluster = OFFS.map(([dx, dy], i) => {
        const R = api.rig(art(api, i), { x: ox + dx * k * (api.band ? 1.15 : 1), y: oy + dy * k });
        api.track(breathe(R.art, { amplitude: 0.9 }));
        return R;
      });
      killer = tCell({ variant: 'cd8', r: 30 * k, state: 'activated', polarity: 0, seed: 2, stage });
      setPose(killer, { x: api.X(-265), y: api.Y(30), a: 0 });
      killer.setAttribute('opacity', '0');
      api.main.appendChild(killer);
    },
    events: [{
      first: 3, every: [36, 42],
      run(api) {
        const H = cluster[hideIdx];
        const near = besideHidden(api);
        api.play(api.gsap.to(killer, { opacity: 1, duration: 2 }));
        // it checks the now-blank cell, finds nothing to recognize and turns away — out of the
        // lens on the far side from the cluster, never brushing past the cells that still display
        const s = H.plan.y < api.cy ? -1 : 1;
        api.play(crawl(killer, {
          path: [[api.X(-170), api.Y(24)], near], speed: 30,
          onArrive: () => api.after(3.2, () => api.play(crawl(killer, {
            path: [[near[0] - 26 * api.k, near[1] + s * 70 * api.ky], [api.X(-150), api.Y(s * 190)], [api.X(-250), s > 0 ? api.H + 70 : -70]], speed: 30,
          }))),
        }));
        // the window shutters while the killer is on its way
        api.after(4, () => api.play(run.swap(H, art(api, hideIdx, true), { duration: 3.5 })));
        // only the two cells facing the killer's side (0 top-left, 2 bottom-left) take turns hiding
        api.after(30, () => { hideIdx = hideIdx === 2 ? 0 : 2; api.refresh({ fade: 3 }); });
      },
    }],
    still(api) {
      run.swap(cluster[hideIdx], art(api, hideIdx, true));
      const [x, y] = besideHidden(api);
      setPose(killer, { x, y, a: 0 });
      killer.setAttribute('opacity', '1');
    },
  });
}
