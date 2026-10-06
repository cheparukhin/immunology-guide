// demo-kit — reference for the FIGURE UI KIT (docs/FIGURES.md §6b) in an explorer.
// "Eat or spare?": pick a target; the macrophage's verdict depends on the balance
// of "eat me" and "don't eat me" signals on its surface.
//
// It shows:
//   • ctx.ui.chips (card variant, single choice; plus a multi-select overlay tray)
//   • ctx.ui.infoCard: beside the stage on wide figures, under it on phones
//   • outcome vocabulary ✓ ≈ ✕ ~ : ctx.ui.badgeHTML in the card, ctx.badgeSVG on stage
//   • ctx.tag('Illustrative') and art-library cells, signal icons and antibodies
//   • a portrait re-layout on phones
import { macrophage, bacterium, healthyCell, cancerCell, antibody, invert, placeOnMembrane, signalIcon } from '../art/index.js';

const TARGETS = [
  {
    value: 'bacterium', label: 'Bacterium', desc: 'Foreign patterns', outcome: 'yes', verdict: 'Eaten',
    eat: 3, spare: 0,
    body: '<p>Receptors on the macrophage recognize molecular patterns on the bacterium’s surface that our own cells never make. That is a strong “eat me” signal, and nothing holds the macrophage back.</p>',
  },
  {
    value: 'healthy', label: 'Healthy cell', desc: '“Don’t eat me”', outcome: 'no', verdict: 'Spared',
    eat: 0, spare: 3,
    body: '<p>Healthy cells carry CD47, a “don’t eat me” signal. It binds a receptor called SIRPα on the macrophage and holds it back, so our own cells are left alone.</p>',
  },
  {
    value: 'cd47', label: 'Cancer cell', desc: 'Extra CD47', outcome: 'partial', verdict: 'Often spared',
    eat: 1, spare: 4,
    body: '<p>Some cancer cells make extra CD47. Even when they also show some “eat me” signals, the brake can win, so many of them escape.</p>',
  },
  {
    value: 'coated', label: 'Coated cancer cell', desc: 'Drug antibodies', outcome: 'varies', verdict: 'Depends on the balance',
    eat: 3, spare: 3,
    body: '<p>Drug antibodies can coat cancer cells. Their stems are an “eat me” signal that macrophages grip. Whether the cell is eaten depends on the balance with its “don’t eat me” signals.</p>',
  },
];

export default function mount(fig, ctx) {
  const { gsap } = ctx;
  ctx.setAspect(16 / 9, 4 / 5);
  const svg = ctx.createSVG({ viewBox: '0 0 960 540' });
  ctx.tag('Illustrative');

  let current = null;
  let compact = ctx.compact;
  const show = new Set(['signals']);
  let el = {};

  // ------------------------------------------------------------------ scene
  const L = () => (compact
    ? { vb: [400, 500], mac: [200, 150], macR: 110, tgt: [200, 380], tgtR: 62 }
    : { vb: [960, 540], mac: [300, 280], macR: 150, tgt: [660, 280], tgtR: 76 });

  // `face` = direction (degrees, 0 = right, 90 = down) from the target toward the
  // macrophage. Antibodies sit on that side; signals on the far side; the verdict
  // disc on the flank, so nothing overlaps in either layout.
  function targetNode(t, r, face) {
    const stage = 'dark';
    if (t.value === 'bacterium') return bacterium({ r: r * 0.55, angle: -20, pamps: true, flagella: 1, seed: 4, stage });
    if (t.value === 'healthy') return healthyCell({ r, seed: 3, stage, mhc: 5 });
    const c = cancerCell({ r, seed: 6, stage, mhc: 3 });
    if (t.value === 'coated') {
      // Drug antibodies bind arm-tips first, Fc stems pointing out (FIGURE-AUDIT §4 rule 9).
      placeOnMembrane(c, (o) => invert(antibody({ ...o, variant: 'therapeutic' }), o.size), { count: 7, size: r * 0.34, arcStart: face - 65, arcEnd: face + 65, layer: 'antibodies' });
    }
    return c;
  }

  function draw() {
    const P = L();
    const face = compact ? -90 : 180;
    for (const n of [...svg.children]) if (n !== svg.defs) n.remove();
    svg.setAttribute('viewBox', `0 0 ${P.vb[0]} ${P.vb[1]}`);
    const mac = macrophage({ r: P.macR, seed: 3, stage: 'dark', state: 'resting', polarity: compact ? 90 : 0 });
    mac.setAttribute('transform', `translate(${P.mac[0]} ${P.mac[1]})`);
    svg.append(mac);
    const t = TARGETS.find((x) => x.value === current);
    el = { mac };
    if (!t) {
      ctx.svg('text', { class: 't-small t-mid', x: P.tgt[0], y: P.tgt[1], text: 'Choose a target' }, svg);
      return;
    }
    const g = ctx.svg('g', { transform: `translate(${P.tgt[0]} ${P.tgt[1]})` }, svg);
    g.append(targetNode(t, P.tgtR, face));
    const rad = (d) => (d * Math.PI) / 180;
    // Signals on the far side: green-cyan "+" = eat me, crimson "−" = don't eat me.
    const sig = ctx.svg('g', { opacity: show.has('signals') ? 1 : 0 }, g);
    const n = t.eat + t.spare;
    const R = P.tgtR * 1.3;
    for (let i = 0; i < n; i++) {
      const a = rad(face + 180 - 60 + (n > 1 ? (i / (n - 1)) * 120 : 60));
      sig.append(signalIcon({ type: i < t.eat ? 'activating' : 'inhibitory', size: compact ? 18 : 20, x: Math.cos(a) * R, y: Math.sin(a) * R }));
    }
    // Verdict disc on the flank.
    const va = rad(face - 90);
    ctx.badgeSVG(t.outcome, { x: Math.cos(va) * P.tgtR * 1.32, y: Math.sin(va) * P.tgtR * 1.32, r: compact ? 13 : 15 }, g);
    if (show.has('labels')) {
      ctx.svg('text', { class: 't-label t-mid t-halo', x: 0, y: P.tgtR * 1.3 + (compact ? 34 : 40), text: t.verdict }, g);
      ctx.svg('text', { class: 't-label t-mid t-halo', x: P.mac[0] - P.tgt[0], y: P.mac[1] - P.tgt[1] - P.macR * 0.82 - 10, text: 'Macrophage' }, g);
    }
    el = { mac, g };
    if (!ctx.reducedMotion) gsap.fromTo(g, { opacity: 0 }, { opacity: 1, duration: 0.45, ease: 'so.out' });
  }

  // ------------------------------------------------------------------ controls
  const card = ctx.ui.infoCard({ empty: 'Choose a target to see what the macrophage does.' });
  const select = (v) => {
    current = v;
    draw();
    const t = TARGETS.find((x) => x.value === v);
    if (t) card.show({ kicker: t.label, title: t.verdict, badge: { kind: t.outcome, label: '' }, body: t.body });
    else card.hide();
  };
  ctx.ui.chips({
    label: 'Target',
    variant: 'card',
    options: TARGETS.map((t) => ({ value: t.value, label: t.label, desc: t.desc })),
    onChange: (v) => select(v),
  });
  ctx.ui.chips({
    label: 'Show',
    multi: true,
    value: [...show],
    options: [{ value: 'signals', label: 'Signals', icon: 'plus' }, { value: 'labels', label: 'Labels', icon: 'note' }],
    onChange: (vals) => { show.clear(); vals.forEach((v) => show.add(v)); draw(); },
  });
  ctx.ui.legend([
    { label: '“Eat me” signal', color: ctx.colors.activate, icon: 'plus' },
    { label: '“Don’t eat me” signal', color: ctx.colors.inhibit, icon: 'minus' },
  ]);

  ctx.onResize(({ compact: c }) => { if (c !== compact || !el.mac) { compact = c; draw(); } });
  draw();
  return {};
}
