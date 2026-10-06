// ch01-hero — "Recognized by touch": a sand body cell breathes at the center while pale
// ligands drift past its receptors; now and then one docks with a soft glow and later lets go.
import { healthyCell, placeOnMembrane, receptor, ligand, breathe, drift, glowPulse } from '../art/index.js';
import { heroScene, settle } from './shared/hero-kit.js';

const RECEPTOR = '#9FE3D4';
const LIGAND = '#E8EEFB';

export default function mount(fig, ctx) {
  let cell, receptors = [], ligands = [];

  const transformOf = (node) => {
    const m = node.transform.baseVal.consolidate();
    const M = m ? m.matrix : { a: 1, b: 0, e: 0, f: 0 };
    return { x: M.e, y: M.f, a: (Math.atan2(M.b, M.a) * 180) / Math.PI };
  };
  const setT = (node, s) => node.setAttribute('transform', `translate(${s.x.toFixed(1)} ${s.y.toFixed(1)}) rotate(${s.a.toFixed(1)})`);
  /** where a ligand must sit to dock on receptor glyph `rec` (scene coordinates) */
  const dockPose = (rec, frame) => {
    const M = frame.getCTM().inverse().multiply(rec.getCTM());
    const dy = +rec.getAttribute('data-dock-y');
    return { x: M.c * dy + M.e, y: M.d * dy + M.f, a: (Math.atan2(M.b, M.a) * 180) / Math.PI };
  };
  const tweenPose = (api, node, to, duration, onComplete) => {
    const from = transformOf(node);
    let da = to.a - from.a;
    da = ((da + 540) % 360) - 180;
    const st = { ...from };
    return api.play(api.gsap.to(st, {
      x: to.x, y: to.y, a: from.a + da, duration, ease: 'sine.inOut',
      onUpdate: () => setT(node, st), onComplete,
    }));
  };

  function dock(api, L, rec, { instant = false } = {}) {
    if (L.drift) { settle(L.node, L.drift); L.drift = null; }
    L.busy = true;
    rec.busy = true;
    const pose = dockPose(rec, api.main);
    const glow = () => api.play(glowPulse(L.node, { color: '#EAF4FF', radius: 15, duration: 2600, scale: 1.9, width: 1.4 }));
    if (instant) { setT(L.node, pose); return; }
    tweenPose(api, L.node, pose, 4.2, () => {
      glow();
      api.after(9 + api.rng.range(0, 4), () => release(api, L, rec));
    });
  }
  function release(api, L, rec) {
    const pose = transformOf(L.node);
    const a = Math.atan2(pose.y - api.cy, pose.x - api.cx);
    const out = { x: pose.x + Math.cos(a) * 70, y: pose.y + Math.sin(a) * 70 * api.ky, a: pose.a + api.rng.range(-60, 60) };
    tweenPose(api, L.node, out, 5, () => {
      L.busy = false; rec.busy = false;
      L.drift = api.track(drift([L.node], { amplitude: 10, speed: 0.12, seed: L.seed }));
    });
  }

  return heroScene(ctx, {
    seed: 11,
    tint: '#E9C9A1',
    draw(api) {
      const stage = api.stage;
      const r = 104 * api.k;
      cell = healthyCell({ r, seed: 7, stage, receptors: false, shape: 'round' });
      receptors = placeOnMembrane(cell, (o) => receptor({ ...o, profile: 'notch', color: RECEPTOR }), { count: 10, size: 32 * api.k, seed: 3 });
      api.put(cell, api.cx, api.cy);
      api.track(breathe(cell, { amplitude: 0.8 }));
      // pale ligands adrift around the cell
      const spots = [[-200, -150], [195, -160], [235, 40], [-240, 70], [140, 205], [-120, 215], [20, -245]];
      ligands = spots.map(([dx, dy], i) => {
        const node = ligand({ profile: 'notch', fit: 1, size: 32 * api.k, stage, color: LIGAND });
        setT(node, { x: api.X(dx * (api.band ? 1.12 : 1)), y: api.Y(dy), a: api.rng.range(0, 360) });
        api.main.appendChild(node);
        const L = { node, seed: 20 + i, busy: false, drift: null };
        L.drift = api.track(drift([node], { amplitude: 10, speed: 0.12, seed: L.seed }));
        return L;
      });
    },
    events: [{
      first: 3.5, every: [20, 30],
      run(api) {
        const free = ligands.filter((L) => !L.busy);
        if (!free.length) return;
        const L = free[Math.floor(api.rng() * free.length)];
        const p = (() => { const t = L.node.transform.baseVal.consolidate().matrix; return { x: t.e, y: t.f }; })();
        const aL = Math.atan2(p.y - api.cy, p.x - api.cx);
        const rec = receptors
          .filter((r) => !r.busy)
          .map((r) => ({ r, d: Math.abs(Math.atan2(Math.sin(aL - (+r.getAttribute('data-angle') * Math.PI) / 180), Math.cos(aL - (+r.getAttribute('data-angle') * Math.PI) / 180))) }))
          .sort((a, b) => a.d - b.d)[0];
        if (rec) dock(api, L, rec.r);
      },
    }],
    still(api) {
      // the key moment: one ligand bound, glowing softly
      const L = ligands[2];
      const rec = receptors[1];
      dock(api, L, rec, { instant: true });
      glowPulse(L.node, { color: '#EAF4FF', radius: 15, duration: 1e9, scale: 1.9 });
    },
  });
}
