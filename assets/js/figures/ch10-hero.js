// ch10-hero — "Living drugs": a CAR-T cell, studded with gold binders, touches a cancer cell's
// antigen knob (binder tip on knob, membranes apart), lights up, then copies itself — two CAR-T
// cells drift apart. Reduced motion: the contact, glowing.
import { tCell, cancerCell, car, antigen, placeOnMembrane, breathe, glowPulse, HEAD_Y, PALETTE } from '../art/index.js';
import { heroScene, poseIn } from './shared/hero-kit.js';
import { run } from './shared/cell-actions.js';

const U = 24;                                     // CAR / antigen glyph size (lens units)
const wrap = (a) => ((a % 360) + 540) % 360 - 180;

export default function mount(fig, ctx) {
  let carT, C, home, cars = [], ags = [];

  /** Where the CAR-T must stand so one CAR's binder tip meets one antigen knob (the pair that
   *  already face each other best) — binders touch the antigen, membranes never overlap. */
  function contact(api) {
    let best = null;
    for (const c of cars) {
      const ac = wrap(+c.getAttribute('data-angle'));
      for (const g of ags) {
        const m = Math.abs(ac) + Math.abs(wrap(+g.getAttribute('data-angle') - 180));
        if (!best || m < best.m) best = { c, g, m };
      }
    }
    const u = U * api.k;
    const tip = poseIn(best.c, api.main, 0, HEAD_Y.car * u);
    const knob = poseIn(best.g, api.main, 0, HEAD_Y.antigen * u);
    return { x: carT.plan.x + knob.x - tip.x, y: carT.plan.y + knob.y - tip.y, at: { x: knob.x, y: knob.y } };
  }

  function cycle(api) {
    const touch = contact(api);
    api.play(run.move(carT, { x: touch.x, y: touch.y, duration: 4.5, stretch: 0.03 }));
    api.after(4.8, () => api.play(run.recognize(carT, touch.at, { color: PALETTE.cd8, badge: false, duration: 2.4 })));
    api.after(8, () => api.play(run.move(carT, { x: home.x + 40 * api.k, y: home.y, duration: 3.5 })));
    api.after(12, () => {
      const d = run.divide(carT, 2, { angle: 90, duration: 2.8, spread: 60 * api.k });
      api.play(d);
      // each daughter keeps drifting the way it split (never back through its sister)
      api.after(3.4, () => d.result.forEach((c) => api.play(run.move(c, { x: home.x - 30 * api.k, y: home.y + Math.sign(c.plan.y - home.y || 1) * 112 * api.k * api.ky, duration: 6 }))));
    });
  }

  return heroScene(ctx, {
    seed: 110,
    draw(api) {
      const { stage, k } = api;
      const tA = tCell({ variant: 'cd8', r: 42 * k, seed: 6, stage, receptors: false });
      cars = placeOnMembrane(tA, (o) => car({ ...o, size: U * k }), { count: 8, size: U * k, seed: 1 });
      home = { x: api.X(-140 * (api.band ? 1.3 : 1)), y: api.cy };
      carT = api.rig(tA, home);
      api.track(breathe(tA, { amplitude: 0.8 }));
      const cA = cancerCell({ r: 66 * k, seed: 4, stage, receptors: false });
      ags = placeOnMembrane(cA, (o) => antigen({ ...o, shape: 'circle' }), { count: 10, size: U * k, seed: 2, layer: 'antigens' });
      C = api.rig(cA, { x: api.X(115 * (api.band ? 1.3 : 1)), y: api.cy });
      api.track(breathe(cA, { amplitude: 0.8 }));
    },
    events: [{
      first: 4, every: [32, 38],
      run(api) {
        cycle(api);
        api.after(27, () => api.refresh({ fade: 3 }));
      },
    }],
    still(api) {
      // the key moment: binder on antigen, the CAR-T cell switched on
      const touch = contact(api);
      run.move(carT, { x: touch.x, y: touch.y });
      glowPulse(carT.art, { color: PALETTE.cd8, duration: 1e9, scale: 1.5 });
    },
  });
}
