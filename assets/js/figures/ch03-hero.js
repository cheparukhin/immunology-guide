// ch03-hero — "A library of keys": gold B cells drift, each wearing its own receptor-tip key —
// five clearly different notch shapes (one per clone), drawn as the library's compact notched tip
// (form 'tip', exaggerated notch) on a short stalk so the shapes read at lens size. A passing
// antigen fits one; that cell glows and copies itself into a small clone of identical keys.
import { bCell, epitopeKey, placeOnMembrane, tcrKey, breathe, drift, el, glyphTones, PALETTE } from '../art/index.js';
import { heroScene, setPose, poseIn, glide } from './shared/hero-kit.js';
import { run } from './shared/cell-actions.js';

// visibly different sockets: a triangle, two deep notches, a star, a step, three notches
const KEYS = ['triangle', 9, 'star', 12, 26];
const U = 16;          // tip width (lens units); the notch is exaggerated 1.75× in the 'tip' form
const PLUG = 1.75;     // epitope size = PLUG × U fits the exaggerated notch
const SPOTS = [[0, 0], [-185, -95], [180, -110], [-175, 120], [190, 105]];
const MATCH = 0;
const SPREAD = 47;   // daughters sit side by side, keys just touching (no interpenetrating spikes)

/** A B-cell receptor: two short chains and the notched tip of its clone. Anchor = membrane. */
function keyReceptor(key, u, stage) {
  const T = glyphTones(PALETTE.bCell, stage);
  const g = el('g', { class: 'sao-mol sao-tcr', 'data-mol': 'tcr' });
  const stalk = 0.45 * u;
  g.appendChild(el('path', {
    d: `M${-0.08 * u} ${0.1 * u}L${-0.11 * u} ${-stalk}M${0.08 * u} ${0.1 * u}L${0.11 * u} ${-stalk}`,
    stroke: T.stroke, 'stroke-width': Math.max(1, 0.1 * u), 'stroke-linecap': 'round', fill: 'none',
  }));
  const tip = tcrKey({ key, form: 'tip', size: u, color: PALETTE.bCell, stage, detail: 'high' });
  const cy = -(stalk + 0.3 * u);
  tip.setAttribute('transform', `translate(0 ${cy.toFixed(2)})`);
  g.appendChild(tip);
  g.setAttribute('data-dock-y', (cy - 0.32 * u).toFixed(2));   // the tip's top edge (the socket mouth)
  return g;
}

export default function mount(fig, ctx) {
  let cells = [], antigen = null;

  return heroScene(ctx, {
    seed: 9,
    draw(api) {
      const { stage, k } = api;
      cells = KEYS.map((key, i) => {
        const art = bCell({ r: 34 * k, seed: 3 + i, stage, receptors: false, key });
        const recs = placeOnMembrane(art, () => keyReceptor(key, U * k, stage), { count: 7, size: U * k, seed: i });
        const [dx, dy] = SPOTS[i];
        const R = api.rig(art, { x: api.X(dx * (api.band ? 1.25 : 1)), y: api.Y(dy) });
        api.track(breathe(art, { amplitude: 0.8 }));
        api.track(drift([R.layers.idle], { amplitude: 7, speed: 0.09, seed: 60 + i }));
        R.recs = recs;
        return R;
      });
      antigen = epitopeKey({ key: KEYS[MATCH], size: PLUG * U * k, stage });
      setPose(antigen, { x: api.W * 1.06, y: api.Y(-30), a: -90 });
      api.main.appendChild(antigen);
    },
    events: [{
      first: 5, every: [30, 38],
      run(api) {
        const B = cells[MATCH];
        // the receptor facing the incoming antigen
        const rec = B.recs.slice().sort((a, b) => Math.abs(+a.getAttribute('data-angle') - 10) - Math.abs(+b.getAttribute('data-angle') - 10))[0];
        const dock = poseIn(rec, api.main, 0, +rec.getAttribute('data-dock-y'));
        glide(api, antigen, { x: dock.x + 40, y: dock.y - 30, a: dock.a }, { duration: 5, ease: 'sine.out' });
        api.after(5.2, () => glide(api, antigen, dock, { duration: 2.2 }));
        api.after(7.6, () => api.play(run.recognize(B, { x: dock.x, y: dock.y }, { color: PALETTE.bCell, badge: false, duration: 2.2 })));
        api.after(9.6, () => {
          api.play(api.gsap.to(antigen, { opacity: 0, duration: 1.2 }));
          const d = run.divide(B, 2, { angle: 0, duration: 2.8, spread: SPREAD * api.k });
          api.play(d);
          api.after(5.5, () => d.result.forEach((c) => api.play(run.divide(c, 2, { angle: 90, duration: 2.8, spread: SPREAD * api.k * 0.92 }))));
        });
        api.after(24, () => api.refresh({ fade: 3 }));
      },
    }],
    still(api) {
      const B = cells[MATCH];
      const d = run.divide(B, 2, { angle: 0, spread: SPREAD * api.k });
      d.result.forEach((c) => run.divide(c, 2, { angle: 90, spread: SPREAD * api.k * 0.92 }));
      antigen.setAttribute('opacity', '0');
    },
  });
}
