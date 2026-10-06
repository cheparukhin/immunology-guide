// ch09-hero — "Antibodies as medicine": white-outlined drug antibodies settle tips-first onto a
// cancer cell's surface antigens, while a bispecific quietly bridges a passing T cell to it.
import { cancerCell, tCell, antigen, antibody, bite, placeOnMembrane, breathe, drift, crawl, glowPulse, cellInfo, rayHit, PALETTE } from '../art/index.js';
import { heroScene, setPose, glide, capPose, settle } from './shared/hero-kit.js';
import { run } from './shared/cell-actions.js';

export default function mount(fig, ctx) {
  let C, ags = [], drugs = [], tc, br, contact;

  const pickAntigen = (api, from) => ags
    .map((g) => { const a = (+g.getAttribute('data-angle') * Math.PI) / 180; return { g, d: Math.hypot(C.plan.x + Math.cos(a) * 80 - from.x, C.plan.y + Math.sin(a) * 80 - from.y) }; })
    .sort((a, b) => a.d - b.d)[0].g;

  function dockDrug(api, D, { still = false } = {}) {
    if (D.drift) { settle(D.node, D.drift); D.drift = null; }
    const p = D.node.transform.baseVal.consolidate().matrix;
    const target = pickAntigen(api, { x: p.e, y: p.f });
    ags = ags.filter((g) => g !== target);
    const to = capPose(target, api.main, { glyphSize: api.glyph, abSize: D.size, arm: 'right' });
    if (still) setPose(D.node, to); else glide(api, D.node, to, { duration: 5.5 });
  }
  function bridge(api, { still = false } = {}) {
    const showBite = () => {
      api.play(api.gsap.to(br, { opacity: 1, duration: still ? 0 : 1.6 }));
      if (!still) api.play(glowPulse(tc, { color: PALETTE.cd8, duration: 2400, scale: 1.6 }));
    };
    if (still) { setPose(tc, { x: contact.tx, y: contact.ty, a: 0 }); tc.setAttribute('opacity', '1'); showBite(); return; }
    api.play(api.gsap.to(tc, { opacity: 1, duration: 1.6 }));
    api.play(crawl(tc, { path: [[(api.X(-250) + contact.tx) / 2, contact.ty + 30 * api.ky], [contact.tx, contact.ty]], speed: 30, onArrive: () => {
      showBite();
      api.after(8, () => {
        api.play(api.gsap.to(br, { opacity: 0, duration: 1.4 }));
        api.play(crawl(tc, { path: [[contact.tx - 50, contact.ty - 80 * api.ky], [api.X(-200), api.Y(-140)]], speed: 30 }));
        api.after(6, () => api.play(api.gsap.to(tc, { opacity: 0, duration: 2 })));
      });
    } }));
  }

  return heroScene(ctx, {
    seed: 99,
    draw(api) {
      const { stage, k } = api;
      const cA = cancerCell({ r: 76 * k, seed: 12, stage, receptors: false });
      api.glyph = 24 * k;
      ags = placeOnMembrane(cA, (o) => antigen({ ...o, shape: 'diamond' }), { count: 11, size: api.glyph, seed: 4, layer: 'antigens' });
      C = api.rig(cA, { x: api.X(40), y: api.cy });
      api.track(breathe(cA, { amplitude: 0.8 }));
      drugs = [[-60, -200], [210, -150], [200, 160]].map(([dx, dy], i) => {
        const size = 36 * k;
        const node = antibody({ variant: 'therapeutic', size, stage });
        setPose(node, { x: api.X(dx * (api.band ? 1.25 : 1)), y: api.Y(dy), a: 160 + i * 40 });
        api.main.appendChild(node);
        return { node, size, drift: api.track(drift([node], { amplitude: 10, speed: 0.13, seed: 90 + i })) };
      });
      // the bridge site on the cancer cell's lower-left
      const a = (150 * Math.PI) / 180;
      const hit = rayHit(cellInfo(cA).outline, a);
      const L = 64 * k;
      const mx = C.plan.x + hit.x, my = C.plan.y + hit.y;
      const tr = 30 * k;
      contact = { tx: mx + Math.cos(a) * (L * 0.82 + tr), ty: my + Math.sin(a) * (L * 0.82 + tr) };
      br = bite({ size: L, targets: ['cd8', 'cancer'], stage });
      br.setAttribute('transform', `translate(${mx + Math.cos(a) * L * 0.42} ${my + Math.sin(a) * L * 0.42}) rotate(${(a * 180) / Math.PI + 180})`);
      br.setAttribute('opacity', '0');
      api.main.appendChild(br);
      tc = tCell({ variant: 'cd8', r: tr, seed: 3, stage, state: 'resting' });
      setPose(tc, { x: api.X(-250), y: api.Y(150), a: 0 });
      tc.setAttribute('opacity', '0');
      api.main.appendChild(tc);
    },
    events: [{
      first: 4, every: [32, 40],
      run(api) {
        dockDrug(api, drugs[0]);
        api.after(2.5, () => dockDrug(api, drugs[1]));
        api.after(3, () => bridge(api));
        api.after(28, () => api.refresh({ fade: 3 }));
      },
    }],
    still(api) {
      dockDrug(api, drugs[0], { still: true });
      dockDrug(api, drugs[1], { still: true });
      bridge(api, { still: true });
    },
  });
}
