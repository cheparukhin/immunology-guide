// ch05-hero — "Helpers and killers", seen up close. Two big lymphocytes, a teal helper and a blue
// killer, sit side by side on a dendritic cell whose body fills the bottom of the lens (a green
// landscape, not the centred star of ch04-hero). The helper recognizes its window and lights up;
// its teal cytokine dots cross to the killer, which recognizes its own window, switches on
// (activated form), lets go and crawls away to hunt. Help is given on the same presenting cell,
// as in Chapter 5. Reduced motion: both docked, helper's ring on, killer activated.
import { dendriticCell, tCell, breathe, cellInfo, PALETTE } from '../art/index.js';
import { heroScene } from './shared/hero-kit.js';
import { run, place } from './shared/cell-actions.js';

const RT = 44;                  // lymphocytes at higher magnification than ch04 (27): a close-up
const A_HELPER = -122, A_KILLER = -58;   // docking angles on the DC body (degrees; -90 = top)

export default function mount(fig, ctx) {
  let helper, killer, dc, home, hContact, kContact;

  const killerArt = (api, state) => tCell({ variant: 'cd8', r: RT * api.k, seed: 6, stage: api.stage, state, polarity: state === 'activated' ? -35 : A_KILLER + 180 });

  return heroScene(ctx, {
    seed: 33,
    draw(api) {
      const { stage, k } = api;
      // the dendritic cell: a large mature cell, centred low so its body is the ground the two
      // T cells stand on and its dendrites reach up around them
      dc = { x: api.cx, y: api.cy + (api.band ? 70 : 150) };   // the two T cells sit near the lens centre
      const art = dendriticCell({ r: (api.band ? 250 : 300) * k, state: 'mature', seed: 12, stage });
      api.put(art, dc.x, dc.y);
      api.track(breathe(art, { amplitude: 0.45 }));        // big cell: small wave, so its MHC-II windows stay on the dendrites
      const rb = cellInfo(art).bodyR;
      const at = (deg, d) => ({ x: dc.x + Math.cos((deg * Math.PI) / 180) * d, y: dc.y + Math.sin((deg * Math.PI) / 180) * d });
      const spread = api.band ? 1.25 : 1;                      // the band is wide and short
      const ah = -90 + (A_HELPER + 90) * spread, ak = -90 + (A_KILLER + 90) * spread;
      hContact = at(ah, rb * 0.97);
      kContact = at(ak, rb * 0.97);
      const r = RT * k;
      helper = api.rig(tCell({ variant: 'cd4', r, state: 'activated', polarity: ah + 180, seed: 4, stage }), at(ah, rb + r * 0.98));
      api.track(breathe(helper.art));
      home = at(ak, rb + r * 0.98);
      killer = api.rig(killerArt(api, 'resting'), home);
      api.track(breathe(killer.art));
    },
    events: [{
      first: 5, every: [28, 36],
      run(api) {
        // 1 · the helper recognizes its window on the dendritic cell
        api.play(run.recognize(helper, hContact, { color: PALETTE.cd4, badge: false, duration: 2.4 }));
        // 2 · its cytokines (teal dots, sender's colour) cross the short gap to the killer
        const ang = (Math.atan2(home.y - helper.plan.y, home.x - helper.plan.x) * 180) / Math.PI;
        const dist = Math.hypot(home.x - helper.plan.x, home.y - helper.plan.y) - RT * api.k * 0.9;
        api.after(2, () => api.play(run.emit(helper, { kind: 'cytokine', color: PALETTE.cd4, n: 9, r: dist, angle: ang, spread: 26, duration: 4.5, size: 5 * api.k + 1, seed: Math.floor(api.time) })));
        // 3 · the killer recognizes its own window and switches on
        api.after(6, () => api.play(run.recognize(killer, kContact, { color: PALETTE.cd8, badge: false, duration: 2.4 })));
        api.after(7, () => api.play(run.swap(killer, killerArt(api, 'activated'), { duration: 2.4 })));
        // 4 · it lets go and crawls off to hunt
        api.after(10.5, () => api.play(run.move(killer, { x: api.W + 80, y: api.band ? api.cy - 40 : api.cy - 150, opacity: 0, duration: 9 })));
        // 5 · a fresh resting killer drifts back into place for the next cycle
        api.after(22, () => {
          killer.art.remove();
          const fresh = killerArt(api, 'resting');
          killer.layers.idle.appendChild(fresh);
          killer.art = fresh;
          killer.info = cellInfo(fresh);
          api.track(breathe(fresh));
          place(killer, { x: home.x + 50, y: home.y - 30, opacity: 0 });
          api.play(run.move(killer, { x: home.x, y: home.y, opacity: 1, duration: 3.5 }));
        });
      },
    }],
    still(api) {
      run.recognize(helper, hContact, { color: PALETTE.cd4, badge: false });
      run.swap(killer, killerArt(api, 'activated'));
    },
  });
}
