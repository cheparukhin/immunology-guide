// ch08-hero — "Releasing the brakes": a dim T cell sits docked to a cancer cell, PD-1 locked into
// PD-L1; drug antibodies drift in, the lock lets go, the drugs cap PD-1 (its "−" brake signal fades),
// and the T cell brightens and turns its granules toward the target.
import { tCell, cancerCell, pd1, pdl1, antibody, breathe, drift, cellInfo, rayHit, DOCK_GAP } from '../art/index.js';
import { heroScene, setPose, poseOf, glide, capPose, settle } from './shared/hero-kit.js';
import { run } from './shared/cell-actions.js';

export default function mount(fig, ctx) {
  let T, C, pd1s = [], pdl1s = [], drugs = [];
  const tArt = (api, state) => tCell({ variant: 'cd8', r: 42 * api.k, seed: 5, stage: api.stage, state, polarity: 0, receptors: false });

  function cap(api, { still = false } = {}) {
    // 1 · the lock lets go: PD-L1 releases and the cancer cell eases back just enough for the
    //     drug to fit (a capped PD-1 can no longer reach PD-L1; FIGURE-AUDIT rule 9: the drug sits
    //     on PD-1 only and never overlaps the cancer cell).
    const shift = 30 * api.k;
    const release = () => {
      api.play(run.move(C, { x: C.plan.x + shift, y: C.plan.y, duration: 2.6, stretch: 0 }));
      pdl1s.forEach((g) => {
        const p = poseOf(g);
        if (still) setPose(g, { ...p, x: p.x + shift });
        else glide(api, g, { ...p, x: p.x + shift }, { duration: 2.6 });
      });
    };
    // 2 · drug antibodies cap PD-1 (one arm tip on the head, Fc pointing away from the T cell)
    drugs.forEach((D, i) => {
      if (D.drift) { settle(D.node, D.drift); D.drift = null; }
      const to = capPose(pd1s[i], api.main, { glyphSize: api.glyph, abSize: D.size, arm: i === 1 ? 'left' : 'right' });
      if (still) setPose(D.node, to);
      else api.after(i * 1.4, () => glide(api, D.node, to, { duration: 5 }));
    });
    // 3 · no brake signal any more: the crimson "−" discs fade (rule 7: only an engaged pair shows one)
    const unbrake = () => pd1s.forEach((g) => {
      const icon = g.querySelector('[data-part="icon-minus"]');
      if (!icon) return;
      if (still) icon.setAttribute('opacity', '0');
      else api.play(api.gsap.to(icon, { opacity: 0, duration: 1.6, ease: 'sine.inOut' }));
    });
    // 4 · the T cell brightens and turns its granules toward the target
    const wake = () => api.play(run.swap(T, tArt(api, 'activated'), { duration: 2.6 }));
    if (still) { release(); unbrake(); wake(); } else { api.after(2.6, release); api.after(5.6, unbrake); api.after(8, wake); }
  }

  return heroScene(ctx, {
    seed: 88,
    draw(api) {
      const { stage, k } = api;
      const size = 26 * k;
      api.glyph = size;
      const gap = DOCK_GAP['pd1-pdl1'] * size;
      const tA = tArt(api, 'exhausted');
      const cA = cancerCell({ r: 72 * k, seed: 8, stage, receptors: false });   // T : cancer ≈ 0.6 (HERO_R 30 : 54)
      const rT = Math.hypot(...Object.values(rayHit(cellInfo(tA).outline, 0)).slice(0, 2));
      const rC = Math.hypot(...Object.values(rayHit(cellInfo(cA).outline, Math.PI)).slice(0, 2));
      const mid = api.cx + 6;
      T = api.rig(tA, { x: mid - gap / 2 - rT + 3, y: api.cy });
      C = api.rig(cA, { x: mid + gap / 2 + rC - 3, y: api.cy });
      api.track(breathe(cA, { amplitude: 0.8 }));
      pd1s = []; pdl1s = [];
      for (const dy of [-24, 0, 24]) {
        const y = api.cy + dy * k;
        const p = pd1({ size, stage }); setPose(p, { x: mid - gap / 2, y, a: 90 }); api.main.appendChild(p); pd1s.push(p);
        const l = pdl1({ size, stage }); setPose(l, { x: mid + gap / 2, y, a: -90 }); api.main.appendChild(l); pdl1s.push(l);
      }
      drugs = [[-60, -165], [-30, 175], [120, -175]].map(([dx, dy], i) => {
        const size2 = 30 * k;
        const node = antibody({ variant: 'therapeutic', size: size2, stage });
        setPose(node, { x: api.X(dx * (api.band ? 1.3 : 1)), y: api.Y(dy), a: 150 + i * 60 });
        api.main.appendChild(node);
        return { node, size: size2, drift: api.track(drift([node], { amplitude: 10, speed: 0.14, seed: 80 + i })) };
      });
    },
    events: [{
      first: 5, every: [30, 36],
      run(api) {
        cap(api);
        api.after(22, () => api.refresh({ fade: 3 }));
      },
    }],
    still(api) { cap(api, { still: true }); },
  });
}
