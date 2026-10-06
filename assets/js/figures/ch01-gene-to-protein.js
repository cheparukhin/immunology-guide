// ch01-gene-to-protein — "From recipe to machine".
// DNA → mRNA → protein for the real start of the human HBB gene (beta-globin), then a
// "change one letter" sandbox (chips first, free letter tapping second).
//
// Structure
//   • The stage holds one SVG scene (nucleus left / cytoplasm right on desktop; stacked on
//     phones) and, under it, an HTML SEQUENCE STRIP of 27 letter tiles (real buttons).
//   • Steps 1–6 run on ctx.ui.stepper: every visual change in the guided path is a tween.
//   • The sandbox (step 6) runs on its own timeline and never touches anything the stepper
//     animates: it recolors bases, swaps one bead's drawing (an inner group), and moves the
//     chain's wrapper. Leaving step 6 reverts it instantly.
//
// Science: sequence = NM_000518.5 CDS 1–27 (ATG GTG CAT CTG ACT CCT GAG GAG AAG). The folded
// chain is all 146 residues of the mature beta chain, laid out by an offline 2D fold
// (sequence-aware compact walk + relaxation) that puts oily residues inside and most charged
// residues on the rim. It is a schematic, not a structure.
import { redBloodCell, BASES } from '../art/index.js';

const ID = 'ch01-gene-to-protein';

// ---------------------------------------------------------------- sequence data
const CDS = 'ATGGTGCATCTGACTCCTGAGGAGAAG';
const MATURE = 'VHLTPEEKSAVTALWGKVNVDEVGGEALGRLLVVYPWTQRFFESFGDLSTPDAVMGNPKVKAHGKKVLGAFSDGLAHLDNLKGTFATLSELHCDKLHVDPENFRLLGNVLVCVLAHHFGKEFTPPVQAAYQKVVAGVANALAHKYH';
const CHAIN = `M${MATURE}`;              // bead 0 = the start methionine (trimmed in step 5)
const NB = CHAIN.length;                   // 147

const CODE = {};
for (const [aa, list] of Object.entries({
  F: 'TTT TTC', L: 'TTA TTG CTT CTC CTA CTG', I: 'ATT ATC ATA', M: 'ATG', V: 'GTT GTC GTA GTG',
  S: 'TCT TCC TCA TCG AGT AGC', P: 'CCT CCC CCA CCG', T: 'ACT ACC ACA ACG', A: 'GCT GCC GCA GCG',
  Y: 'TAT TAC', '*': 'TAA TAG TGA', H: 'CAT CAC', Q: 'CAA CAG', N: 'AAT AAC', K: 'AAA AAG',
  D: 'GAT GAC', E: 'GAA GAG', C: 'TGT TGC', W: 'TGG', R: 'CGT CGC CGA CGG AGA AGG', G: 'GGT GGC GGA GGG',
})) for (const c of list.split(' ')) CODE[c] = aa;

const AA = {
  A: ['Ala', 'alanine'], R: ['Arg', 'arginine'], N: ['Asn', 'asparagine'], D: ['Asp', 'aspartic acid'],
  C: ['Cys', 'cysteine'], Q: ['Gln', 'glutamine'], E: ['Glu', 'glutamic acid'], G: ['Gly', 'glycine'],
  H: ['His', 'histidine'], I: ['Ile', 'isoleucine'], L: ['Leu', 'leucine'], K: ['Lys', 'lysine'],
  M: ['Met', 'methionine'], F: ['Phe', 'phenylalanine'], P: ['Pro', 'proline'], S: ['Ser', 'serine'],
  T: ['Thr', 'threonine'], W: ['Trp', 'tryptophan'], Y: ['Tyr', 'tyrosine'], V: ['Val', 'valine'],
  '*': ['Stop', 'stop'],
};
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const klass = (a) => ('GAVLIMFWP'.includes(a) ? 'oily' : 'KRH'.includes(a) ? 'pos' : 'DE'.includes(a) ? 'neg' : a === '*' ? 'stop' : 'other');
const COMP = { A: 'T', T: 'A', G: 'C', C: 'G' };
const rnaOf = (b) => (b === 'T' ? 'U' : b);

// Offline fold of the 146-residue chain (units of one bond length, ×10).
const FOLD = '48,-6 55,-13 46,-15 53,-22 44,-25 51,-31 50,-41 42,-35 41,-45 33,-38 35,-29 36,-19 39,-9 29,-12 28,-22 26,-32 24,-42 32,-48 30,-58 23,-51 16,-58 8,-51 6,-42 15,-46 17,-36 19,-26 21,-16 13,-10 12,-20 10,-30 3,-23 4,-13 -5,-8 -10,-16 -6,-25 0,-33 -10,-33 -5,-42 -1,-51 3,-60 -7,-59 -11,-49 -16,-58 -21,-49 -16,-41 -21,-32 -26,-41 -31,-50 -36,-41 -30,-33 -25,-24 -15,-25 -20,-16 -14,-8 -24,-7 -30,-15 -35,-24 -39,-15 -44,-23 -40,-32 -45,-40 -49,-31 -54,-23 -49,-14 -59,-14 -54,-6 -44,-6 -34,-7 -28,1 -18,1 -8,1 2,0 12,0 21,-5 31,-2 40,0 50,3 43,10 52,12 55,22 45,19 48,29 39,26 36,16 34,7 24,4 27,14 30,23 31,33 41,35 46,44 36,43 26,41 30,50 27,60 21,52 18,61 12,54 6,62 2,53 -4,61 -14,61 -7,53 -17,52 -11,44 -1,44 9,44 17,39 22,30 20,20 17,11 7,8 -3,8 -13,9 -23,9 -33,9 -43,10 -38,1 -48,2 -58,4 -58,14 -50,19 -40,19 -30,18 -20,18 -10,18 0,17 10,17 14,26 9,35 4,26 -1,35 -5,26 -10,35 -15,26 -25,26 -20,35 -24,44 -29,35 -34,27 -38,36 -33,44 -43,45 -48,37 -43,28 -53,28'
  .split(' ').map((p) => p.split(',').map((v) => Number(v) / 10));

// Sandbox presets (the "Try this" chips). Codon numbers follow hemoglobin numbering (START, 1–8).
const PRESETS = [
  { value: 'silent', label: 'A silent change', k: 6, j: 2, b: 'A' },
  { value: 'sickle', label: 'The sickle-cell change', k: 6, j: 1, b: 'T' },
  { value: 'hbc', label: 'Hemoglobin C', k: 6, j: 0, b: 'A' },
  { value: 'stop', label: 'A stop', k: 6, j: 0, b: 'T' },
];

// Bead look (dark stage). Class is carried by shape + glyph as well as color.
const BEAD = {
  oily: { fill: '#CDB596', rim: '#F3E4C8' },
  pos: { fill: '#5D8FF2', rim: '#B9CFFF' },
  neg: { fill: '#EE7F4C', rim: '#FFC3A0' },
  other: { fill: '#79CFD8', rim: '#CDF4F7' },
};
const TYPO = '#FF3D7F';              // the "typo" marker (hot pink, as in the art library)
const RNA_BB = '#F1D49B';            // mRNA backbone (pale gold; DNA backbones are periwinkle)
const DNA_BB = '#C9D3F0';
const FLANK = '#69718E';             // bases outside the shown segment (not lettered → neutral)
const RIBO = '#A796B9';

// ---------------------------------------------------------------- layouts
function layout(compact) {
  if (!compact) {
    return {
      compact: false,
      vb: [840, 408],
      nuc: { cx: 172, cy: 196, r: 150 },
      dnaY: 196, rise: 7.2, bpC: 14.5, half: 17, stub: 15, bowTop: 40, bowBot: 8,
      peelY: 246,
      line: { y: 352, x0: 420, rise: 14 },
      lane: 18, exitOut: [50, 0], landIn: [-60, -10], exportSpeed: 270,
      ribo: { w: 46, top: 50, bot: 26 },
      beadR: 8, hook: { R: 44, sp: 16.5 },
      fly: [46, -96],
      trailY: 0, trailSp: 16.5, parkX: 880,
      blob: { cx: 560, cy: 168, bond: 13.4 },
      rbc: { x: 758, y: 160, r: 50 },
      legend: { x: 352, y: 28, gap: 104 },
      labels: {
        nucleus: [172, 70], dna: { at: [44, 216], text: [84, 262] }, gene: [172, 118],
        pore: { at: [312, 258], text: [334, 230] }, mrna: [378, 380],
        counter: [834, 232], folded: [560, 300],
        rbc: [758, 232], oxygen: [560, 130],
      },
      fiber: { x0: 476, y: 176, dx: 42, n: 5 },
    };
  }
  return {
    compact: true,
    vb: [400, 512],
    nuc: { cx: 196, cy: 126, r: 104 },
    dnaY: 126, rise: 5.2, bpC: 14.5, half: 13, stub: 11, bowTop: 28, bowBot: 6,
    peelY: 160,
    line: { y: 452, x0: 58, rise: 11 },
    lane: 14, exitOut: [40, 40], landIn: [-30, -50], exportSpeed: 230,
    ribo: { w: 36, top: 40, bot: 21 },
    beadR: 6.6, hook: { R: 34, sp: 13.5 },
    fly: [36, -78],
    trailY: 0, trailSp: 13.5, parkX: 430,
    blob: { cx: 128, cy: 334, bond: 9.6 },
    rbc: { x: 318, y: 318, r: 40 },
    legend: { x: 26, y: 248, gap: 92 },
    labels: {
      nucleus: [196, 50], dna: { at: [96, 141], text: [118, 186] }, gene: [196, 74],
      pore: { at: [292, 170], text: [334, 140] }, mrna: [50, 456],
      counter: [392, 362], folded: [128, 420],
      rbc: [318, 378], oxygen: [128, 300],
    },
    fiber: { x0: 56, y: 340, dx: 36, n: 5 },
  };
}

// ---------------------------------------------------------------- small geometry helpers
function cubic(p0, p1, p2, p3, t) {
  const u = 1 - t;
  return [u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
    u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]];
}
/** Dense polyline with arc-length lookup from [['M',x,y],['L',x,y],['C',x1,y1,x2,y2,x,y]]. */
function polyline(segs) {
  const pts = [];
  let cur = null;
  for (const s of segs) {
    if (s[0] === 'M') { cur = [s[1], s[2]]; pts.push(cur); continue; }
    if (s[0] === 'L') {
      const end = [s[1], s[2]];
      const n = Math.max(2, Math.ceil(Math.hypot(end[0] - cur[0], end[1] - cur[1]) / 6));
      for (let i = 1; i <= n; i++) pts.push([cur[0] + (end[0] - cur[0]) * (i / n), cur[1] + (end[1] - cur[1]) * (i / n)]);
      cur = end;
    } else {
      const p1 = [s[1], s[2]], p2 = [s[3], s[4]], p3 = [s[5], s[6]];
      for (let i = 1; i <= 48; i++) pts.push(cubic(cur, p1, p2, p3, i / 48));
      cur = p3;
    }
  }
  const acc = [0];
  for (let i = 1; i < pts.length; i++) acc.push(acc[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const at = (s) => {
    s = Math.max(0, Math.min(acc[acc.length - 1], s));
    let lo = 0, hi = acc.length - 1;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (acc[m] <= s) lo = m; else hi = m; }
    const t = (s - acc[lo]) / ((acc[hi] - acc[lo]) || 1);
    return [pts[lo][0] + (pts[hi][0] - pts[lo][0]) * t, pts[lo][1] + (pts[hi][1] - pts[lo][1]) * t];
  };
  // arc length of the first point whose x ≥ x on the first (straight) run
  return { pts, length: acc[acc.length - 1], at };
}
const smooth = (t) => t * t * (3 - 2 * t);
const f1 = (v) => Math.round(v * 10) / 10;
const dOf = (pts) => `M${pts.map(([x, y]) => `${f1(x)} ${f1(y)}`).join('L')}`;

// ---------------------------------------------------------------- CSS (scoped, injected once)
const CSS = `
[data-figure="${ID}"] .g2p { position: relative; z-index: 1; }
[data-figure="${ID}"] .g2p > svg { display: block; position: relative; width: 100%; height: auto; }
[data-figure="${ID}"] .g2p-skip { display: inline-flex; align-items: center; gap: .3rem; margin: 0 0 var(--s-2); padding: .35rem 0; min-height: 2.25rem;
  border: 0; background: none; color: var(--accent); font: 560 var(--text-xs)/1.2 var(--font-ui); cursor: pointer; text-decoration: underline; text-decoration-color: var(--accent-line); text-underline-offset: .2em; }
[data-figure="${ID}"] .g2p-skip:hover { text-decoration-color: currentColor; }
[data-figure="${ID}"] .g2p-skip[aria-hidden="true"] { visibility: hidden; }
[data-figure="${ID}"] .g2p-try { display: flex; flex-wrap: wrap; align-items: center; gap: .5rem .75rem; padding: .25rem 1rem .6rem; }
[data-figure="${ID}"] .g2p-try[hidden] { display: none; }
[data-figure="${ID}"] .g2p-try .chips { flex-direction: row; align-items: center; flex-wrap: wrap; gap: .4rem .6rem; }
[data-figure="${ID}"] .g2p-try .chips__label { color: var(--fg-2); font-size: var(--text-xs); }
[data-figure="${ID}"] .g2p-try .chip { background: rgb(233 236 246 / .05); border-color: rgb(233 236 246 / .26); color: var(--fg); min-height: 2.5rem; }
[data-figure="${ID}"] .g2p-try .chip:hover:not(:disabled) { border-color: rgb(233 236 246 / .62); color: var(--fg); }
[data-figure="${ID}"] .g2p-try .chip[aria-pressed="true"] { background: rgb(142 162 255 / .2); border-color: #9DB0FF; box-shadow: inset 0 0 0 1px #9DB0FF; }
[data-figure="${ID}"] .g2p-try .btn { color: var(--fg-2); border-color: rgb(233 236 246 / .2); background: transparent; min-height: 2.5rem; }
[data-figure="${ID}"] .g2p-try .btn:hover { color: var(--fg); border-color: rgb(233 236 246 / .5); background: rgb(233 236 246 / .06); }
[data-figure="${ID}"] .g2p-strip { container-type: inline-size; display: grid; justify-content: center; padding: .1rem .75rem .9rem; }
[data-figure="${ID}"] .g2p-head { position: relative; display: grid; justify-items: start; margin: 0 0 .45rem; padding-inline: .15rem; font: 650 12px/1.2 var(--font-ui); letter-spacing: .08em; color: var(--fg-2); }
[data-figure="${ID}"] .g2p-head > span { grid-area: 1 / 1; }
[data-figure="${ID}"] .g2p-codons { display: grid; grid-template-columns: repeat(3, auto); justify-content: center; gap: .25rem .9rem; --tw: 32px; --th: 40px; --tf: 20px; }
@container (min-width: 764px) { [data-figure="${ID}"] .g2p-codons { grid-template-columns: repeat(9, auto); gap: 0 6px; --tw: clamp(22px, calc((100cqi - 170px) / 27), 30px); --th: 36px; --tf: 18px; } }
[data-figure="${ID}"] .g2p-codon { position: relative; display: grid; justify-items: center; gap: .3rem; padding: .3rem 3px .25rem; border-radius: 10px; }
[data-figure="${ID}"] .g2p-hl { position: absolute; inset: 0; border-radius: inherit; pointer-events: none; opacity: 0;
  background: rgb(233 236 246 / .08); box-shadow: inset 0 0 0 1px rgb(233 236 246 / .45), 0 0 18px rgb(157 176 255 / .25); }
[data-figure="${ID}"] .g2p-num { font: 650 11px/1 var(--font-ui); letter-spacing: .07em; text-transform: uppercase; color: var(--fg-3); opacity: 0; font-variant-numeric: tabular-nums; }
[data-figure="${ID}"] .g2p-tiles { display: flex; gap: 2px; }
[data-figure="${ID}"] .g2p-tile { position: relative; display: grid; place-items: center; width: var(--tw); height: var(--th); padding: 0 0 5px; margin: 0;
  border-radius: 6px; border: 1px solid var(--bd); background: var(--bg); color: var(--fc); font: 650 var(--tf)/1 var(--font-ui); cursor: default;
  transition: border-color var(--dur-1), box-shadow var(--dur-2), background-color var(--dur-2); -webkit-tap-highlight-color: transparent; }
[data-figure="${ID}"] .g2p-tile::after { content: ""; position: absolute; left: 5px; right: 5px; bottom: 4px; height: 3px; border-radius: 2px; background: var(--bar); opacity: .9; }
[data-figure="${ID}"] .g2p-tile > span { grid-area: 1 / 1; }
[data-figure="${ID}"] .g2p-tile:disabled { opacity: 1; }
[data-figure="${ID}"] .g2p.is-live .g2p-tile:not(:disabled) { cursor: pointer; }
[data-figure="${ID}"] .g2p.is-live .g2p-tile:not(:disabled):hover { border-color: rgb(255 255 255 / .85); background: var(--bgh); }
[data-figure="${ID}"] .g2p.is-live .g2p-tile[aria-expanded="true"] { border-color: #fff; box-shadow: 0 0 0 2px rgb(157 176 255 / .7); }
[data-figure="${ID}"] .g2p-tile.is-changed { box-shadow: 0 0 0 2px ${TYPO}, 0 0 14px rgb(255 61 127 / .45); }
[data-figure="${ID}"] .g2p-tile.is-flash { animation: g2p-flash .9s ease-out; }
@keyframes g2p-flash { 0% { box-shadow: 0 0 0 2px ${TYPO}, 0 0 28px 6px rgb(255 61 127 / .7); } 100% { box-shadow: 0 0 0 2px ${TYPO}, 0 0 14px rgb(255 61 127 / .45); } }
@media (prefers-reduced-motion: reduce) { [data-figure="${ID}"] .g2p-tile.is-flash { animation: none; } }
[data-figure="${ID}"] .g2p-aa { min-height: 1.1rem; font: 620 14px/1.1 var(--font-ui); color: var(--fg); opacity: 0; white-space: nowrap; }
[data-figure="${ID}"] .g2p-aa.is-changed { color: #FF8DB4; }
[data-figure="${ID}"] .g2p-aa.is-stop { color: #FF8DB4; text-transform: uppercase; letter-spacing: .06em; font-size: 12px; }
[data-figure="${ID}"] .g2p-codon.is-silent .g2p-tiles, [data-figure="${ID}"] .g2p-codon.is-skipped { opacity: .32; transition: opacity var(--dur-3); }
[data-figure="${ID}"] .g2p-choices { display: grid; grid-template-columns: repeat(3, 1fr); gap: .5rem; margin-top: .2rem; }
[data-figure="${ID}"] .g2p-choice { display: grid; justify-items: center; gap: .15rem; min-height: 3.6rem; padding: .45rem .3rem; border-radius: var(--r-md);
  border: 1px solid var(--rule-strong); background: var(--surface); color: var(--ink); font: 650 1.35rem/1 var(--font-ui); cursor: pointer; }
[data-figure="${ID}"] .g2p-choice small { font: 500 var(--text-2xs)/1.2 var(--font-ui); color: var(--ink-3); letter-spacing: .04em; }
[data-figure="${ID}"] .g2p-choice:hover { border-color: var(--accent); }
[data-figure="${ID}"] .g2p-choice .sw { display: block; width: 1.4rem; height: 3px; border-radius: 2px; }
[data-figure="${ID}"] .info-card .g2p-codonline { font: 600 var(--text-xs)/1.4 var(--font-ui); color: var(--ink-2); letter-spacing: .02em; }
@container fig (max-width: 599.98px) {
  [data-figure="${ID}"] .g2p-strip { padding: .1rem .5rem .8rem; }
  [data-figure="${ID}"] .g2p-try { padding: .2rem .6rem .55rem; gap: .4rem; }
  [data-figure="${ID}"] .g2p-try .chips__label { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
  [data-figure="${ID}"] .g2p-try .btn { padding-inline: .7rem; }
  [data-figure="${ID}"] .g2p-try .btn .btn__text { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
}
`;
function injectCSS() {
  if (document.getElementById(`${ID}-css`)) return;
  const s = document.createElement('style');
  s.id = `${ID}-css`;
  s.textContent = CSS;
  document.head.append(s);
}

// ---------------------------------------------------------------- the figure
export default function mount(fig, ctx) {
  const { gsap } = ctx;
  injectCSS();
  ctx.setAspect('auto');
  ctx.tag('Not to scale');

  const wrap = ctx.h('div', { class: 'g2p' });
  ctx.stage.append(wrap);
  const svg = ctx.createSVG({ viewBox: '0 0 840 400', parent: wrap });
  const S = (tag, attrs, parent) => ctx.svg(tag, attrs, parent);

  // Paints (created once; draw() may run again on rebuild)
  const paint = {
    nucBody: ctx.radialGradient(svg, [[0, '#2A3A72', 0.5], [0.75, '#1C2752', 0.42], [1, '#24336A', 0.5]], { id: `${ID}-nucBody` }),
    nucHalo: ctx.radialGradient(svg, [[0.82, '#7F95E6', 0], [0.92, '#7F95E6', 0.1], [1, '#7F95E6', 0]], { id: `${ID}-nucHalo` }),
    band: ctx.linearGradient(svg, [[0, '#FFFFFF', 0], [0.08, '#FFFFFF', 0.075], [0.92, '#FFFFFF', 0.075], [1, '#FFFFFF', 0]], { id: `${ID}-band` }),
    riboL: ctx.radialGradient(svg, [[0, '#D7CBE6', 0.95], [0.7, RIBO, 0.9], [1, '#7D6C92', 0.9]], { id: `${ID}-riboL`, fx: '40%', fy: '30%' }),
    riboS: ctx.radialGradient(svg, [[0, '#CFC3DE', 0.95], [0.7, '#9A89AE', 0.9], [1, '#6F5F84', 0.9]], { id: `${ID}-riboS`, fx: '40%', fy: '30%' }),
    riboHalo: ctx.radialGradient(svg, [[0.4, RIBO, 0.22], [1, RIBO, 0]], { id: `${ID}-riboHalo` }),
    blobHalo: ctx.radialGradient(svg, [[0.55, '#E8D8B8', 0.12], [1, '#E8D8B8', 0]], { id: `${ID}-blobHalo` }),
    sickle: ctx.radialGradient(svg, [[0, '#7A3440', 0.95], [0.6, '#8E3A46', 0.95], [1, '#B4505C', 0.95]], { id: `${ID}-sickle` }),
    unitA: ctx.radialGradient(svg, [[0, '#E2D6F2', 0.95], [1, '#9C8DBA', 0.95]], { id: `${ID}-unitA`, fx: '38%', fy: '32%' }),
    unitB: ctx.radialGradient(svg, [[0, '#F1E2C6', 0.95], [1, '#B79E78', 0.95]], { id: `${ID}-unitB`, fx: '38%', fy: '32%' }),
    glow: ctx.radialGradient(svg, [[0, TYPO, 0.55], [1, TYPO, 0]], { id: `${ID}-glow` }),
  };

  let L = layout(ctx.compact);
  let el = {};                 // scene nodes (rebuilt by draw)
  let G = null;                // derived geometry for the current layout

  // ================================================================ strip (HTML, built once)
  const tryRow = ctx.h('div', { class: 'g2p-try', hidden: true });
  const strip = ctx.h('div', { class: 'g2p-strip' });
  wrap.append(tryRow, strip);
  const head = ctx.h('div', { class: 'g2p-head', 'aria-hidden': 'true' },
    ctx.h('span', { class: 'g2p-head__dna' }, 'DNA · CODING STRAND'),
    ctx.h('span', { class: 'g2p-head__rna', style: { opacity: 0 } }, 'mRNA COPY'));
  const codonsEl = ctx.h('div', { class: 'g2p-codons', role: 'group', 'aria-label': 'Sequence strip: the first 27 bases of the beta-globin gene' });
  strip.append(head, codonsEl);

  const codons = [];          // { el, hl, num, aa, tiles: [{ btn, dna, rna }] }
  for (let k = 0; k < 9; k++) {
    const hl = ctx.h('span', { class: 'g2p-hl', 'aria-hidden': 'true' });
    const num = ctx.h('span', { class: 'g2p-num', 'aria-hidden': 'true' }, k === 0 ? 'Start' : String(k));
    const tilesEl = ctx.h('span', { class: 'g2p-tiles' });
    const tiles = [];
    for (let j = 0; j < 3; j++) {
      const b = CDS[k * 3 + j];
      const dna = ctx.h('span', { class: 'g2p-l' }, b);
      const rna = ctx.h('span', { class: 'g2p-l', style: { opacity: 0 } }, rnaOf(b));
      const btn = ctx.h('button', { type: 'button', class: 'g2p-tile', disabled: true, 'aria-label': tileLabel(k, j, b) }, dna, rna);
      styleTile(btn, b);
      btn.addEventListener('click', () => onTile(k, j));
      btn.addEventListener('focus', () => showAaTip(k, btn));
      btn.addEventListener('blur', () => ctx.tooltip.hide());
      tilesEl.append(btn);
      tiles.push({ btn, dna, rna });
    }
    const aa = ctx.h('span', { class: 'g2p-aa' }, AA[CODE[CDS.slice(k * 3, k * 3 + 3)]][0]);
    aa.addEventListener('pointerenter', () => { if (aa.style.opacity !== '0' && stepIndex >= 3) showAaTip(k, aa); });
    aa.addEventListener('pointerleave', () => ctx.tooltip.hide());
    const cEl = ctx.h('div', { class: 'g2p-codon' }, hl, num, tilesEl, aa);
    codonsEl.append(cEl);
    codons.push({ el: cEl, hl, num, aa, tiles });
  }
  function tileLabel(k, j, b) { return `${k === 0 ? 'start codon' : `codon ${k}`}, base ${j + 1}, ${b}`; }
  function styleTile(btn, b) {
    const c = BASES[b];
    btn.style.setProperty('--bg', ctx.alpha(c, 0.14));
    btn.style.setProperty('--bgh', ctx.alpha(c, 0.26));
    btn.style.setProperty('--bd', ctx.alpha(c, 0.5));
    btn.style.setProperty('--fc', ctx.mix(c, '#FFFFFF', 0.62));
    btn.style.setProperty('--bar', c);
  }
  function showAaTip(k, anchor) {
    if (stepIndex < 3) return;
    const cod = currentCodon(k);
    const a = CODE[cod];
    const name = a === '*' ? 'stop: the chain ends here' : AA[a][1] + (k === 0 ? ' (start)' : '');
    ctx.tooltip.show(`<strong>${k === 0 ? 'Start codon' : `Codon ${k}`}</strong> · ${cod} → ${name}`, anchor);
  }

  // ================================================================ scene geometry
  function derive() {
    const g = {};
    const { nuc, rise, bpC } = L;
    g.xb = (b) => nuc.cx + (b - bpC) * rise;                     // DNA base-pair x
    g.lineX = (b) => L.line.x0 + b * L.line.rise;                 // mRNA base x in the cytoplasm
    g.codonX = (k) => g.lineX(3 * k + 1);                         // ribosome center over codon k
    g.BP = []; for (let b = -4; b <= 33; b++) g.BP.push(b);       // DNA shown: 38 bp
    g.CARS = []; for (let b = -2; b <= 31; b++) g.CARS.push(b);   // mRNA: 34 bases (2 + 27 + 5)
    // Transcription bubble (b from -2 to 31) → bow factor per x
    const xa = g.xb(-3), xz = g.xb(32), ramp = rise * 3.2;
    g.bow = (x) => smooth(Math.max(0, Math.min(1, (x - xa) / ramp))) * smooth(Math.max(0, Math.min(1, (xz - x) / ramp)));
    g.topY = (x, u) => L.dnaY - L.half - u * L.bowTop * g.bow(x);
    g.botY = (x, u) => L.dnaY + L.half + u * L.bowBot * g.bow(x);
    // mRNA car y while paired in the bubble: its stub tip meets the template's stub tip
    g.carBubbleY = (x) => g.botY(x, 1) - L.stub * 2 - 2;
    // Export, 5′ end first: the copy folds into a hairpin (moving part on a lane just below it),
    // leaves through a pore at the lane's right end, and is laid along the cytoplasm line from
    // the ribosome end (5′, left) outward.
    g.laneY = L.peelY + L.lane;
    g.poreX = L.nuc.cx + Math.sqrt(L.nuc.r ** 2 - (g.laneY - L.nuc.cy) ** 2);
    g.route = (b) => {
      const x = g.xb(b), ex = Math.min(x + L.lane * 0.8, g.poreX - 10);
      const out = [g.poreX + 18, g.laneY];
      const F = [g.lineX(b), L.line.y];
      const toPore = polyline([['M', x, L.peelY], ['C', x, L.peelY + L.lane * 0.6, ex - L.lane * 0.3, g.laneY, ex, g.laneY], ['L', out[0], out[1]]]);
      const all = polyline([['M', x, L.peelY], ['C', x, L.peelY + L.lane * 0.6, ex - L.lane * 0.3, g.laneY, ex, g.laneY], ['L', out[0], out[1]],
        ['C', out[0] + L.exitOut[0], out[1] + L.exitOut[1], F[0] + L.landIn[0], F[1] + L.landIn[1], F[0], F[1]]]);
      return { toPore: toPore.length, path: all };
    };
    // ribosome / chain
    g.ribY = L.line.y;
    g.tunnel = (rx) => [rx - L.ribo.w * 0.18, g.ribY - L.ribo.top - L.beadR + 1];
    g.slot = (rx, j) => {
      const [tx, ty] = g.tunnel(rx);
      const R = L.hook.R, phi = (j * L.hook.sp) / R;
      return [tx - R + R * Math.cos(phi), ty - R * Math.sin(phi)];
    };
    const sc = L.blob.bond;
    g.blobPos = (i) => { const f = FOLD[Math.max(0, i - 1)]; return [L.blob.cx + f[0] * sc, L.blob.cy + f[1] * sc]; };
    g.blobScale = (sc * 0.47) / L.beadR;
    return g;
  }

  // Chain states: positions of all 147 beads after codon k (0..8), after the fast run, folded.
  function chainState(k) {
    const rx = G.codonX(k);
    const out = [];
    for (let i = 0; i < NB; i++) out.push(i <= k ? G.slot(rx, k - i) : G.tunnel(rx));
    return out;
  }
  function fastState() {
    const base = chainState(8);
    const [tx, ty] = G.tunnel(G.codonX(8));
    for (let i = 9; i < NB; i++) {
      const j = i - 8;
      const x = tx + j * L.trailSp;
      base[i] = x < L.parkX ? [x, ty + Math.sin(j * 0.9) * 2] : [L.parkX + (i - 9) * 1.5, ty + Math.sin(i) * 3];
    }
    return base;
  }
  const foldState = () => CHAIN.split('').map((_, i) => G.blobPos(i));

  // ================================================================ draw (stepper reset)
  function beadArt(cls, r) {
    const g = S('g', null);
    const c = BEAD[cls] || BEAD.other;
    if (cls === 'other') {
      const s = r * 1.72;
      S('rect', { x: -s / 2, y: -s / 2, width: s, height: s, rx: r * 0.42, fill: c.fill, stroke: c.rim, strokeWidth: 1, strokeOpacity: 0.75 }, g);
    } else if (cls === 'stop') {
      S('circle', { r: r * 0.9, fill: 'none', stroke: TYPO, strokeWidth: 1.6, strokeDasharray: '2 2.5' }, g);
    } else {
      S('circle', { r, fill: c.fill, stroke: c.rim, strokeWidth: 1, strokeOpacity: 0.75 }, g);
      if (cls === 'oily') S('circle', { cx: -r * 0.3, cy: -r * 0.32, r: r * 0.3, fill: '#FFF6E6', opacity: 0.35 }, g);
      const w = r * 0.52, sw = Math.max(1.5, r * 0.27);
      if (cls === 'pos') S('path', { d: `M${-w} 0H${w}M0 ${-w}V${w}`, stroke: '#fff', strokeWidth: sw, strokeLinecap: 'round' }, g);
      if (cls === 'neg') S('path', { d: `M${-w} 0H${w}`, stroke: '#fff', strokeWidth: sw, strokeLinecap: 'round' }, g);
    }
    return g;
  }

  function draw() {
    for (const n of [...svg.children]) if (n !== svg.defs) n.remove();
    L = layout(ctx.compact);
    G = derive();
    const [vw, vh] = L.vb;
    svg.setAttribute('viewBox', `0 0 ${vw} ${vh}`);
    ctx.refreshTextScale();
    const { nuc } = L;
    el = {};

    // ---- cytoplasm texture: a few faint organelle ghosts
    const ghosts = S('g', { opacity: 0.45 }, svg);
    const R = ctx.random(11);
    for (let i = 0; i < 7; i++) {
      const x = L.compact ? R.range(20, 380) : R.range(360, 820), y = L.compact ? R.range(250, 480) : R.range(30, 380);
      if (!L.compact && Math.hypot(x - nuc.cx, y - nuc.cy) < nuc.r + 30) continue;
      S('ellipse', { cx: x, cy: y, rx: R.range(14, 30), ry: R.range(7, 12), transform: `rotate(${R.range(-40, 40).toFixed(0)} ${x.toFixed(0)} ${y.toFixed(0)})`, fill: 'none', stroke: '#8E9BC0', strokeOpacity: 0.09, strokeWidth: 1 }, ghosts);
    }

    // ---- nucleus
    const nucG = S('g', { opacity: 0 }, svg);
    S('circle', { cx: nuc.cx, cy: nuc.cy, r: nuc.r * 1.1, fill: paint.nucHalo }, nucG);
    S('circle', { cx: nuc.cx, cy: nuc.cy, r: nuc.r, fill: paint.nucBody }, nucG);
    // chromatin: faint loose threads
    const chrom = S('g', { fill: 'none', stroke: '#9AA8D8', strokeOpacity: 0.08, strokeWidth: 1.2, strokeLinecap: 'round' }, nucG);
    const RC = ctx.random(5);
    for (let i = 0; i < 9; i++) {
      const a = RC.range(0, Math.PI * 2), rr = RC.range(0.35, 0.82) * nuc.r;
      const x = nuc.cx + Math.cos(a) * rr, y = nuc.cy + Math.sin(a) * rr * 0.92;
      if (Math.abs(y - L.dnaY) < L.half + L.bowTop + 6) continue;
      let d = `M${f1(x)} ${f1(y)}`;
      let cx = x, cy = y;
      for (let k = 0; k < 5; k++) { const nx = cx + RC.range(-26, 26), ny = cy + RC.range(-12, 12); d += `Q${f1((cx + nx) / 2 + RC.range(-10, 10))} ${f1((cy + ny) / 2 + RC.range(-10, 10))} ${f1(nx)} ${f1(ny)}`; cx = nx; cy = ny; }
      S('path', { d }, chrom);
    }
    // envelope: two membranes with a gap at the pore
    const poreA = Math.atan2(G.laneY - nuc.cy, Math.sqrt(nuc.r ** 2 - (G.laneY - nuc.cy) ** 2));
    const gap = 0.07;
    const arc = (r) => {
      const a0 = poreA + gap, a1 = poreA - gap + Math.PI * 2;
      return `M${f1(nuc.cx + r * Math.cos(a0))} ${f1(nuc.cy + r * Math.sin(a0))}A${r} ${r} 0 1 1 ${f1(nuc.cx + r * Math.cos(a1))} ${f1(nuc.cy + r * Math.sin(a1))}`;
    };
    S('path', { d: arc(nuc.r), fill: 'none', stroke: '#9DB0EA', strokeOpacity: 0.55, strokeWidth: 1.6 }, nucG);
    S('path', { d: arc(nuc.r - 5), fill: 'none', stroke: '#9DB0EA', strokeOpacity: 0.32, strokeWidth: 1.2 }, nucG);
    for (const s of [-1, 1]) {
      const a = poreA + s * (gap + 0.012);
      S('ellipse', { cx: f1(nuc.cx + (nuc.r - 2.5) * Math.cos(a)), cy: f1(nuc.cy + (nuc.r - 2.5) * Math.sin(a)), rx: 4, ry: 2.6, transform: `rotate(${f1((a * 180) / Math.PI + 90)} ${f1(nuc.cx + (nuc.r - 2.5) * Math.cos(a))} ${f1(nuc.cy + (nuc.r - 2.5) * Math.sin(a))})`, fill: '#C6D1F2', fillOpacity: 0.8 }, nucG);
    }
    S('text', { class: 't-caps t-mid', x: L.labels.nucleus[0], y: L.labels.nucleus[1], text: 'Nucleus' }, nucG);
    el.nucG = nucG;

    // ---- DNA ladder
    const dnaG = S('g', { opacity: 0 }, svg);
    const segX0 = G.xb(0) - L.rise * 0.7, segX1 = G.xb(26) + L.rise * 0.7;
    el.band = S('rect', { x: f1(segX0), y: L.dnaY - L.half - 10, width: f1(segX1 - segX0), height: L.half * 2 + 20, rx: 8, fill: paint.band }, dnaG);
    const bbPts = (u, top) => {
      const pts = [];
      for (let x = G.xb(-4) - L.rise * 3; x <= G.xb(33) + L.rise * 3 + 0.1; x += L.rise / 2) pts.push([x, top ? G.topY(x, u) : G.botY(x, u)]);
      return pts;
    };
    el.bbD = { top: [dOf(bbPts(0, true)), dOf(bbPts(1, true))], bot: [dOf(bbPts(0, false)), dOf(bbPts(1, false))] };
    const sw = Math.max(1.4, L.rise * 0.3);
    el.bbTop = S('path', { d: el.bbD.top[0], fill: 'none', stroke: DNA_BB, strokeWidth: sw, strokeLinecap: 'round', strokeOpacity: 0.9 }, dnaG);
    el.bbBot = S('path', { d: el.bbD.bot[0], fill: 'none', stroke: DNA_BB, strokeWidth: sw, strokeLinecap: 'round', strokeOpacity: 0.7 }, dnaG);
    el.top = []; el.bot = [];
    const stubW = Math.max(2.2, L.rise * 0.56);
    for (const b of G.BP) {
      const x = G.xb(b);
      const inSeg = b >= 0 && b <= 26;
      const base = inSeg ? CDS[b] : null;
      const op = inSeg ? 1 : Math.max(0.25, 0.75 - Math.abs(b < 0 ? b : b - 26) * 0.1);
      const t = S('g', { opacity: op }, dnaG);
      t.rect = S('rect', { x: -stubW / 2, y: 0, width: stubW, height: L.stub, rx: stubW / 2, fill: inSeg ? BASES[base] : FLANK }, t);
      const u = S('g', { opacity: op }, dnaG);
      u.rect = S('rect', { x: -stubW / 2, y: -L.stub, width: stubW, height: L.stub, rx: stubW / 2, fill: inSeg ? BASES[COMP[base]] : FLANK, fillOpacity: inSeg ? 0.85 : 1 }, u);
      gsap.set(t, { x, y: G.topY(x, 0) });
      gsap.set(u, { x, y: G.botY(x, 0) });
      el.top.push(t); el.bot.push(u);
    }
    el.dnaG = dnaG;
    // labels
    const dl = L.labels.dna;
    el.dnaLabel = S('g', { opacity: 0 }, svg);
    S('line', { class: 'leader', x1: dl.text[0], y1: dl.text[1], x2: dl.at[0], y2: dl.at[1] + 4 }, el.dnaLabel);
    S('circle', { class: 'leader-dot', cx: dl.at[0], cy: dl.at[1], r: 2.4 }, el.dnaLabel);
    S('text', { class: 't-label t-halo', x: dl.text[0], y: dl.text[1] + 14, 'text-anchor': 'middle', text: 'DNA' }, el.dnaLabel);
    el.geneLabel = S('text', { class: 't-label t-mid t-halo', x: L.labels.gene[0], y: L.labels.gene[1], opacity: 0, text: 'HBB gene (beta-globin)' }, svg);
    const pl = L.labels.pore;
    el.poreLabel = S('g', { opacity: 0 }, svg);
    S('line', { class: 'leader', x1: pl.text[0] - 2, y1: pl.text[1] + 5, x2: pl.at[0] + 2, y2: pl.at[1] - 3 }, el.poreLabel);
    S('text', { class: 't-small t-halo', x: pl.text[0] - 10, y: pl.text[1], text: 'Pore' }, el.poreLabel);

    // ---- mRNA cars
    const mrnaG = S('g', null, svg);
    el.cars = G.CARS.map((b) => {
      const inSeg = b >= 0 && b <= 26;
      const base = inSeg ? rnaOf(CDS[b]) : null;
      const g = S('g', { opacity: 0 }, mrnaG);
      const seg = L.line.rise + 0.6;
      S('line', { x1: -seg / 2, y1: 0, x2: seg / 2, y2: 0, stroke: RNA_BB, strokeWidth: Math.max(1.8, L.rise * 0.36), strokeLinecap: 'butt', strokeOpacity: inSeg ? 0.95 : 0.55 }, g);
      g.rect = S('rect', { x: -stubW / 2, y: 0, width: stubW, height: L.stub, rx: stubW / 2, fill: inSeg ? BASES[base] : FLANK, fillOpacity: inSeg ? 1 : 0.6 }, g);
      const x = G.xb(b);
      gsap.set(g, { x, y: G.carBubbleY(x) });
      return g;
    });
    el.mrnaG = mrnaG;
    el.mrnaLabel = S('text', { class: 't-caps t-end', style: 'text-transform: none', x: L.labels.mrna[0], y: L.labels.mrna[1], opacity: 0, text: 'mRNA' }, svg);

    // ---- legend (bead classes)
    const lg = S('g', { opacity: 0, transform: `translate(${L.legend.x} ${L.legend.y})` }, svg);
    const lr = L.compact ? 6 : 6.5;
    const items = [['charged', 'Charged'], ['other', 'Other'], ['oily', 'Hydrophobic']];   // longest label last, so it never runs into the next item
    items.forEach(([cls, text], i) => {
      const x = i * L.legend.gap;
      if (cls === 'charged') {
        const a = beadArt('pos', lr); a.setAttribute('transform', `translate(${x} 0)`); lg.append(a);
        const b2 = beadArt('neg', lr); b2.setAttribute('transform', `translate(${x + lr * 2.4} 0)`); lg.append(b2);
        S('text', { class: 't-small', x: x + lr * 4.2, y: 4.5, text }, lg);
      } else {
        const a = beadArt(cls, lr); a.setAttribute('transform', `translate(${x} 0)`); lg.append(a);
        S('text', { class: 't-small', x: x + lr * 1.9, y: 4.5, text }, lg);
      }
    });
    el.legend = lg;

    // ---- chain (wrapper → backbone + beads). The wrapper belongs to the sandbox.
    el.chainWrap = S('g', null, svg);
    el.bbWrap = S('g', null, el.chainWrap);
    const st0 = chainState(0);
    el.chainD = dOf(st0);
    el.backbone = S('path', { d: el.chainD, fill: 'none', stroke: '#B5BEDA', strokeWidth: L.compact ? 1.6 : 2, strokeOpacity: 0.55, strokeLinejoin: 'round', opacity: 0 }, el.bbWrap);
    const beadsG = S('g', null, el.chainWrap);
    el.beads = [];
    for (let i = 0; i < NB; i++) {
      const b = S('g', null, beadsG);
      b.inner = S('g', null, b);
      b.art = beadArt(klass(CHAIN[i]), L.beadR);
      b.inner.append(b.art);
      gsap.set(b, { x: st0[i][0], y: st0[i][1], opacity: 0, scale: 1, transformOrigin: '50% 50%' });
      el.beads.push(b);
    }

    // ---- ribosome (outer: x position; inner groups: clamp)
    const rib = S('g', null, svg);
    gsap.set(rib, { x: G.codonX(0), y: G.ribY });
    const w = L.ribo.w, top = L.ribo.top, bot = L.ribo.bot;
    el.ribHalo = S('ellipse', { cx: 0, cy: -top * 0.3, rx: w * 1.6, ry: top * 1.25, fill: paint.riboHalo, opacity: 0 }, rib);
    el.ribLarge = S('g', { opacity: 0 }, rib);
    const ld = `M${-w} ${-4}C${-w - 6} ${-top * 0.55} ${-w * 0.62} ${-top - 2} ${-w * 0.08} ${-top}`
      + `C${-w * 0.02} ${-top + 7} ${w * 0.02} ${-top + 7} ${w * 0.1} ${-top}`
      + `C${w * 0.7} ${-top - 3} ${w + 7} ${-top * 0.55} ${w} ${-4}Z`;
    S('path', { d: ld, fill: paint.riboL, stroke: '#E4DAF0', strokeOpacity: 0.55, strokeWidth: 1 }, el.ribLarge);
    S('path', { d: `M${-w * 0.55} ${-top * 0.45}Q0 ${-top * 0.62} ${w * 0.55} ${-top * 0.45}`, fill: 'none', stroke: '#6D5C82', strokeOpacity: 0.35, strokeWidth: 1.2 }, el.ribLarge);
    el.ribSmall = S('g', { opacity: 0 }, rib);
    const sd = `M${-w * 0.86} ${L.stub + 3}C${-w * 0.95} ${bot + L.stub * 0.6} ${-w * 0.4} ${bot + L.stub + 2} 0 ${bot + L.stub}`
      + `C${w * 0.4} ${bot + L.stub + 2} ${w * 0.95} ${bot + L.stub * 0.6} ${w * 0.86} ${L.stub + 3}Z`;
    S('path', { d: sd, fill: paint.riboS, stroke: '#DCD1EA', strokeOpacity: 0.5, strokeWidth: 1 }, el.ribSmall);
    el.ribLabel = S('text', { class: 't-label t-halo', x: w + 12, y: -top * 0.95, opacity: 0, text: 'Ribosome' }, rib);
    el.rib = rib;
    el.counter = S('text', { class: 't-small t-end t-halo', x: L.labels.counter[0], y: L.labels.counter[1], opacity: 0, text: '+ 138 more amino acids' }, svg);

    // ---- step 5: folded chain label + red blood cell
    el.foldLabel = S('text', { class: 't-label t-mid t-halo', x: L.labels.folded[0], y: L.labels.folded[1], opacity: 0, text: 'Folded chain' }, svg);
    el.rbcG = S('g', { opacity: 0 }, svg);
    gsap.set(el.rbcG, { x: L.rbc.x, y: L.rbc.y });
    el.rbcN = S('g', null, el.rbcG);              // normal cell (sandbox crossfades it)
    el.rbcN.append(redBloodCell({ r: L.rbc.r, view: 'face', seed: 3, stage: 'dark' }));
    el.rbcS = S('g', { opacity: 0 }, el.rbcG);    // sickled cell (sandbox)
    drawSickle(el.rbcS, L.rbc.r);
    el.rbcLabel = S('g', { opacity: 0 }, svg);
    const rl = L.labels.rbc;
    const lines = L.compact ? ['Hemoglobin (four', 'chains like this)', 'fills red blood cells'] : ['Hemoglobin (four chains', 'like this) fills', 'red blood cells'];
    lines.forEach((t, i) => S('text', { class: 't-small t-mid t-halo', x: rl[0], y: rl[1] + i * (L.compact ? 15 : 16), text: t }, el.rbcLabel));
    el.sandbox = S('g', null, svg);               // sandbox-only extras (fiber, labels)
  }

  function drawSickle(g, r) {
    // A rigid crescent, same reds as the library's red blood cell, with fibers inside.
    const R1 = r * 1.18, R2 = r * 1.02;
    const d = `M${f1(-R1 * 0.98)} ${f1(r * 0.28)}`
      + `C${f1(-R1 * 0.7)} ${f1(-r * 0.95)} ${f1(R1 * 0.7)} ${f1(-r * 0.95)} ${f1(R1 * 0.98)} ${f1(r * 0.28)}`
      + `C${f1(R1 * 0.82)} ${f1(r * 0.36)} ${f1(R1 * 0.7)} ${f1(r * 0.32)} ${f1(R2 * 0.62)} ${f1(r * 0.1)}`
      + `C${f1(R2 * 0.3)} ${f1(-r * 0.32)} ${f1(-R2 * 0.3)} ${f1(-r * 0.32)} ${f1(-R2 * 0.62)} ${f1(r * 0.1)}`
      + `C${f1(-R1 * 0.7)} ${f1(r * 0.32)} ${f1(-R1 * 0.82)} ${f1(r * 0.36)} ${f1(-R1 * 0.98)} ${f1(r * 0.28)}Z`;
    S('path', { d, fill: paint.sickle, stroke: '#E58A93', strokeOpacity: 0.7, strokeWidth: 1.2 }, g);
    for (const k of [-0.42, -0.18, 0.06]) {
      S('path', { d: `M${f1(-R1 * 0.72)} ${f1(r * (0.12 + k * 0.2))}Q0 ${f1(r * (-0.9 - k * 0.6))} ${f1(R1 * 0.72)} ${f1(r * (0.12 + k * 0.2))}`, fill: 'none', stroke: '#F4B3B9', strokeOpacity: 0.32, strokeWidth: 1, strokeDasharray: '5 3' }, g);
    }
  }

  // ================================================================ steps
  const nIdx = (b) => G.BP.indexOf(b);
  const show = (tl, node, pos, d = 0.5) => tl.to(node, { opacity: 1, duration: d, ease: 'power1.out' }, pos);
  const hide = (tl, node, pos, d = 0.4) => tl.to(node, { opacity: 0, duration: d, ease: 'power1.in' }, pos);

  const steps = [
    { // 1 · DNA in the nucleus
      enter(tl) {
        show(tl, el.nucG, 0, 0.9);
        show(tl, el.dnaG, 0.3, 0.9);
        show(tl, el.dnaLabel, 0.9);
        show(tl, el.geneLabel, 1.1);
        tl.fromTo(el.ribLarge, { opacity: 0, y: -L.ribo.top * 0.7 }, { opacity: 0.6, y: -L.ribo.top * 0.7, duration: 0.8 }, 0.6)
          .fromTo(el.ribSmall, { opacity: 0, y: L.ribo.bot * 0.45 }, { opacity: 0.6, y: L.ribo.bot * 0.45, duration: 0.8 }, 0.6);
        show(tl, el.ribLabel, 1.2);
        codons.forEach((c, k) => c.tiles.forEach((t, j) => {
          tl.fromTo(t.btn, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power1.out' }, 0.5 + (k * 3 + j) * 0.025);
        }));
      },
    },
    { // 2 · transcription
      enter(tl) {
        tl.to(el.bbTop, { attr: { d: el.bbD.top[1] }, duration: 1.0 }, 0)
          .to(el.bbBot, { attr: { d: el.bbD.bot[1] }, duration: 1.0 }, 0);
        G.BP.forEach((b, i) => {
          const x = G.xb(b);
          tl.to(el.top[i], { y: G.topY(x, 1), duration: 1.0 }, 0);
          tl.to(el.bot[i], { y: G.botY(x, 1), duration: 1.0 }, 0);
        });
        hide(tl, el.dnaLabel, 0, 0.3);
        const t0 = 0.75, dt = 0.055;
        el.cars.forEach((car, c) => {
          const x = G.xb(G.CARS[c]);
          tl.fromTo(car, { opacity: 0, y: G.carBubbleY(x) - 10 }, { opacity: 1, y: G.carBubbleY(x), duration: 0.32, ease: 'so.out' }, t0 + c * dt);
        });
        tl.to(head.children[0], { opacity: 0, duration: 0.4 }, t0)
          .to(head.children[1], { opacity: 1, duration: 0.4 }, t0 + 0.2);
        for (let p = 0; p < 27; p++) {
          if (CDS[p] !== 'T') continue;
          const t = codons[(p / 3) | 0].tiles[p % 3];
          const at = t0 + (p + 2) * dt;
          tl.to(t.dna, { opacity: 0, duration: 0.25 }, at).to(t.rna, { opacity: 1, duration: 0.25 }, at + 0.1);
        }
      },
    },
    { // 3 · export through the pore
      enter(tl) {
        // peel the copy off, re-zip the DNA
        el.cars.forEach((car, c) => {
          const x = G.xb(G.CARS[c]);
          tl.to(car, { y: L.peelY, x, duration: 0.7, ease: 'so.inOut' }, c * 0.008);
        });
        tl.to(el.bbTop, { attr: { d: el.bbD.top[0] }, duration: 1.0 }, 0.25)
          .to(el.bbBot, { attr: { d: el.bbD.bot[0] }, duration: 1.0 }, 0.25);
        G.BP.forEach((b, i) => {
          const x = G.xb(b);
          tl.to(el.top[i], { y: G.topY(x, 0), duration: 1.0 }, 0.25);
          tl.to(el.bot[i], { y: G.botY(x, 0), duration: 1.0 }, 0.25);
        });
        show(tl, el.poreLabel, 0.6);
        // 5′ end first through the pore: each base sets off so the strand passes the pore in order
        const v = L.exportSpeed, gapT = (L.rise * 1.35) / v;
        const routes = el.cars.map((_, c) => G.route(G.CARS[c]));
        const starts = routes.map((r, c) => c * gapT - r.toPore / v);
        const t0 = Math.min(...starts), T = 0.85;
        let end = 0;
        el.cars.forEach((car, c) => {
          const { path } = routes[c];
          const K = Math.max(12, Math.round(path.length / 10));
          const xs = [], ys = [];
          for (let i = 0; i <= K; i++) { const [x, y] = path.at(path.length * (i / K)); xs.push(f1(x)); ys.push(f1(y)); }
          const at = T + starts[c] - t0, dur = path.length / v;
          tl.to(car, { keyframes: { x: xs, y: ys, easeEach: 'none' }, duration: dur, ease: 'none' }, at);
          end = Math.max(end, at + dur);
        });
        show(tl, el.mrnaLabel, end - 0.2);
        show(tl, el.dnaLabel, end - 0.4);
      },
    },
    { // 4 · translation
      enter(tl) {
        const rx0 = G.codonX(0);
        tl.to(el.ribLarge, { opacity: 1, y: 0, duration: 0.8, ease: 'so.inOut' }, 0)
          .to(el.ribSmall, { opacity: 1, y: 0, duration: 0.8, ease: 'so.inOut' }, 0)
          .to(el.ribHalo, { opacity: 1, duration: 0.8 }, 0.1);
        hide(tl, el.poreLabel, 0, 0.4);
        codons.forEach((c, k) => tl.to(c.num, { opacity: 1, duration: 0.4 }, 0.5 + k * 0.03));
        show(tl, el.legend, 0.9, 0.6);
        let prev = chainState(0);
        // put every unmade bead at the (moving) tunnel; the first bead flies in at codon 0
        for (let k = 0; k <= 8; k++) {
          const T = 1.0 + k * 0.52;
          const rx = G.codonX(k);
          const cur = chainState(k);
          if (k > 0) tl.to(el.rib, { x: rx, duration: 0.28, ease: 'so.inOut' }, T);
          const [fx, fy] = [rx + L.fly[0], G.ribY + L.fly[1]];
          tl.fromTo(el.beads[k], { opacity: 0, x: fx, y: fy }, { opacity: 1, x: cur[k][0], y: cur[k][1], duration: 0.36, ease: 'so.inOut' }, T + 0.06);
          for (let i = 0; i < k; i++) tl.to(el.beads[i], { x: cur[i][0], y: cur[i][1], duration: 0.3, ease: 'so.inOut' }, T + 0.08);
          for (let i = k + 1; i < NB; i++) if (k > 0 && i <= 14) tl.to(el.beads[i], { x: cur[i][0], y: cur[i][1], duration: 0.28 }, T);
          if (k === 1) tl.to(el.backbone, { opacity: 1, duration: 0.3 }, T + 0.1);
          tl.fromTo(el.backbone, { attr: { d: dOf(prev) } }, { attr: { d: dOf(cur) }, duration: 0.3, ease: 'so.inOut' }, T + 0.08);
          tl.fromTo(codons[k].hl, { opacity: 0 }, { opacity: 1, duration: 0.14 }, T)
            .to(codons[k].hl, { opacity: 0, duration: 0.2 }, T + 0.46)
            .fromTo(codons[k].aa, { opacity: 0, y: -4 }, { opacity: 1, y: 0, duration: 0.25 }, T + 0.22);
          prev = cur;
        }
        hide(tl, el.ribLabel, 2.6);
        // the rest of the chain, quickly
        const TF = 1.0 + 9 * 0.52 + 0.2;
        const fast = fastState();
        show(tl, el.counter, TF, 0.4);
        tl.to(el.rib, { x: G.codonX(8) + (L.compact ? 150 : 240), duration: 1.5, ease: 'so.in' }, TF + 0.2)
          .to(el.ribHalo, { opacity: 0, duration: 0.6 }, TF + 0.9);
        for (let i = 9; i < NB; i++) {
          const j = i - 9;
          if (i <= 14) tl.to(el.beads[i], { opacity: 1, x: fast[i][0], y: fast[i][1], duration: 0.35, ease: 'so.out' }, TF + 0.35 + j * 0.16);
          else tl.set(el.beads[i], { opacity: 1, x: fast[i][0], y: fast[i][1] }, TF + 1.2);
        }
        tl.fromTo(el.backbone, { attr: { d: dOf(prev) } }, { attr: { d: dOf(fast) }, duration: 1.1, ease: 'so.out' }, TF + 0.35);
      },
    },
    { // 5 · folding
      enter(tl) {
        const fold = foldState();
        const fast = fastState();
        hide(tl, el.counter, 0, 0.3);
        tl.to(el.mrnaG, { opacity: 0.4, duration: 0.8 }, 0.2)
          .to(el.mrnaLabel, { opacity: 0.5, duration: 0.8 }, 0.2);
        for (let i = 0; i < NB; i++) {
          tl.to(el.beads[i], { x: fold[i][0], y: fold[i][1], scale: G.blobScale, opacity: i === 0 ? 0 : 1, duration: 2.0, ease: 'so.inOut' }, 0.15);
        }
        tl.fromTo(el.backbone, { attr: { d: dOf(fast) } }, { attr: { d: dOf(fold) }, duration: 2.0, ease: 'so.inOut' }, 0.15);
        show(tl, el.foldLabel, 2.0);
        tl.fromTo(el.rbcG, { opacity: 0, scale: 0.92, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.9, ease: 'so.out' }, 2.2);
        show(tl, el.rbcLabel, 2.6, 0.6);
      },
    },
    { // 6 · sandbox
      enter(tl) {
        tl.to(head.children[1], { opacity: 0, duration: 0.35 }, 0)
          .to(head.children[0], { opacity: 1, duration: 0.35 }, 0.15);
        for (let p = 0; p < 27; p++) {
          if (CDS[p] !== 'T') continue;
          const t = codons[(p / 3) | 0].tiles[p % 3];
          tl.to(t.rna, { opacity: 0, duration: 0.3 }, 0.1 + p * 0.012).to(t.dna, { opacity: 1, duration: 0.3 }, 0.2 + p * 0.012);
        }
        tl.to(el.foldLabel, { opacity: 0, duration: 0.4 }, 0.1);
      },
    },
  ];

  // ================================================================ sandbox
  let stepIndex = -1;
  let mut = null;              // { k, j, b }
  let mutTl = null;
  let openTile = null;

  const currentCodon = (k) => {
    const cod = CDS.slice(k * 3, k * 3 + 3);
    if (mut && mut.k === k) return cod.slice(0, mut.j) + mut.b + cod.slice(mut.j + 1);
    return cod;
  };

  // The card exists only in the sandbox (step 6): earlier steps get the full stage width,
  // and the card opens under the stage, right below the sequence strip it explains.
  const card = ctx.ui.infoCard({ placement: 'below', empty: null, closable: false });
  const chips = ctx.ui.chips({
    label: 'Try this', parent: tryRow,
    options: PRESETS.map((p) => ({ value: p.value, label: p.label })),
    onChange(v) {
      if (!v) { applyChange(null); return; }
      const p = PRESETS.find((x) => x.value === v);
      applyChange({ k: p.k, j: p.j, b: p.b });
    },
  });
  const resetBtn = ctx.ui.button({ label: 'Reset', icon: 'reset', variant: 'ghost', parent: tryRow, onClick: () => { applyChange(null); ctx.announce('Original sequence restored'); } });
  resetBtn.el.setAttribute('aria-label', 'Reset to the original sequence');
  chips.el.querySelector('.chips__tray')?.append(resetBtn.el);
  { // stable ids inside the stage (the kit's counters differ between page loads)
    const lab = chips.el.querySelector('.chips__label'), tray = chips.el.querySelector('.chips__tray');
    if (lab && tray) { lab.id = `${ID}-try-label`; tray.setAttribute('aria-labelledby', lab.id); }
  }

  const skip = ctx.h('button', { type: 'button', class: 'g2p-skip' }, 'Skip to the sandbox ›');
  skip.addEventListener('click', () => stepper.go(5));
  (ctx.el.querySelector('.fig__head') || ctx.stage).after(skip);

  function sandboxIntro() {
    card.show({ kicker: 'Change one base', title: 'Edit the gene', body: '<p>Try one of the suggestions above the letters, or tap any letter to pick a replacement. One change at a time.</p>' });
  }

  function onTile(k, j) {
    if (stepIndex !== 5) return;
    for (const c of codons) for (const t of c.tiles) t.btn.setAttribute('aria-expanded', 'false');
    const t = codons[k].tiles[j];
    t.btn.setAttribute('aria-expanded', 'true');
    openTile = { k, j };
    if (k === 0) {
      card.show({ kicker: 'Start codon · ATG', title: 'Locked', badge: { kind: 'no', label: '' }, body: '<p>Changing the start signal would stop the protein being made at all.</p>', scroll: ctx.compact });
      return;
    }
    const cod = currentCodon(k);
    const now = cod[j];
    const body = ctx.h('div', null,
      ctx.h('p', { class: 'g2p-codonline' }, `Codon ${k} reads ${cod}. Replace base ${j + 1} (${now}) with:`));
    const row = ctx.h('div', { class: 'g2p-choices' });
    for (const b of 'ACGT') {
      if (b === now) continue;
      const next = cod.slice(0, j) + b + cod.slice(j + 1);
      const btn = ctx.h('button', { type: 'button', class: 'g2p-choice', 'aria-label': `Change to ${b}, making ${next}` },
        ctx.h('span', null, b), ctx.h('span', { class: 'sw', style: { background: BASES[b] } }), ctx.h('small', null, next));
      btn.addEventListener('click', () => {
        const orig = CDS[k * 3 + j];
        applyChange(b === orig ? null : { k, j, b });
        t.btn.focus({ preventScroll: true });
      });
      row.append(btn);
    }
    body.append(row);
    card.show({ kicker: `Codon ${k} · base ${j + 1}`, title: 'Choose a new base', body, scroll: ctx.compact });
  }

  function verdict(m) {
    const orig = CDS.slice(m.k * 3, m.k * 3 + 3);
    const next = orig.slice(0, m.j) + m.b + orig.slice(m.j + 1);
    const a0 = CODE[orig], a1 = CODE[next];
    const kicker = `Codon ${m.k} · ${orig} → ${next}`;
    if (a1 === a0) return { kind: 'silent', kicker, badge: 'yes', title: 'Silent', text: `Silent. ${orig}→${next} still means ${AA[a0][1]}: several codons can stand for the same amino acid. The protein is unchanged.` };
    if (a1 === '*') return { kind: 'stop', kicker, badge: 'no', title: 'Stop', text: `Stop codon. The ribosome halts here, so the chain ends after ${m.k - 1} amino acids instead of 146. No working beta-globin can be made from this copy of the gene.` };
    if (m.k === 6 && next === 'GTG') return { kind: 'sickle', kicker, badge: 'no', title: 'The sickle-cell mutation', text: 'This is the sickle-cell mutation. Valine, a hydrophobic amino acid, replaces glutamic acid, a charged one, on the protein’s surface. When oxygen is low, the altered hemoglobin molecules bind to one another and stack into long fibers that bend red blood cells into rigid sickles. The disease develops mainly when both copies of the gene, one from each parent, carry this change.' };
    if (m.k === 6 && next === 'AAG') return { kind: 'hbc', kicker, badge: 'partial', title: 'Hemoglobin C', text: 'Same position, another real variant: lysine instead of glutamic acid. This is hemoglobin C. Lysine is charged (positively, where glutamic acid is negative), not hydrophobic, so hemoglobin C does not form sickle fibers. It is less soluble than normal hemoglobin, though, and can form crystals inside red cells. One copy causes no symptoms; two usually cause only mild anemia. Inherited together with the sickle-cell change from the other parent, it causes a form of sickle-cell disease (HbSC).' };
    return { kind: 'swap', kicker, badge: 'varies', title: 'One amino acid swapped', text: `One amino acid swapped: ${cap(AA[a0][1])} → ${cap(AA[a1][1])}. Whether this matters depends on where it sits in the folded protein and how different the new amino acid is. Many swaps like this are harmless; some are not.` };
  }

  // -- revert everything the sandbox changed (instant)
  function revert() {
    mutTl?.kill(); mutTl = null;
    if (!mut) return;
    const { k, j } = mut;
    const p = k * 3 + j;
    const b0 = CDS[p];
    const t = codons[k].tiles[j];
    t.dna.textContent = b0; t.rna.textContent = rnaOf(b0);
    styleTile(t.btn, b0);
    t.btn.classList.remove('is-changed', 'is-flash');
    t.btn.setAttribute('aria-label', tileLabel(k, j, b0));
    codons[k].aa.textContent = AA[CODE[CDS.slice(k * 3, k * 3 + 3)]][0];
    codons[k].aa.classList.remove('is-changed', 'is-stop');
    codons.forEach((c) => c.el.classList.remove('is-skipped'));
    // scene
    const i = nIdx(p);
    if (el.top[i]) { el.top[i].rect.setAttribute('fill', BASES[b0]); el.bot[i].rect.setAttribute('fill', BASES[COMP[b0]]); }
    const car = el.cars[G.CARS.indexOf(p)];
    if (car) car.rect.setAttribute('fill', BASES[rnaOf(b0)]);
    el.svgMarks?.forEach((m) => m.remove());
    el.svgMarks = [];
    const bead = el.beads[k];
    if (bead) {
      bead.art.remove();
      bead.art = beadArt(klass(CHAIN[k]), L.beadR);
      bead.inner.prepend(bead.art);
    }
    gsap.killTweensOf([el.chainWrap, el.bbWrap, el.rbcN, el.rbcS, ...el.beads.map((x) => x.inner)]);
    gsap.set(el.chainWrap, { clearProps: 'transform,opacity' });
    gsap.set(el.bbWrap, { opacity: 1 });
    el.beads.forEach((x) => gsap.set(x.inner, { clearProps: 'transform,opacity' }));
    gsap.set(el.rbcN, { opacity: 1 });
    gsap.set(el.rbcS, { opacity: 0, rotation: 0 });
    el.sandbox.replaceChildren();
    mut = null;
  }

  function mark(parent, r) {
    const g = S('g', null, parent);
    S('circle', { r: r * 2.6, fill: paint.glow }, g);
    S('circle', { r: r * 1.5, fill: 'none', stroke: TYPO, strokeWidth: 2 }, g);
    el.svgMarks.push(g);
    return g;
  }

  function applyChange(m, { instant = false, quiet = false } = {}) {
    revert();
    if (!m) {
      chips.set(null);
      if (!quiet) sandboxIntro();
      return;
    }
    mut = { ...m };
    el.svgMarks = [];
    const rm = instant || ctx.reducedMotion;
    const { k, j, b } = m;
    const p = k * 3 + j;
    const v = verdict(m);
    const preset = PRESETS.find((x) => x.k === k && x.j === j && x.b === b);
    chips.set(preset ? preset.value : null);

    // strip
    const t = codons[k].tiles[j];
    t.dna.textContent = b; t.rna.textContent = rnaOf(b);
    styleTile(t.btn, b);
    t.btn.setAttribute('aria-label', tileLabel(k, j, b));
    t.btn.classList.add('is-changed');
    if (!rm) { t.btn.classList.remove('is-flash'); void t.btn.offsetWidth; t.btn.classList.add('is-flash'); }
    const next = currentCodon(k);
    const a1 = CODE[next];
    const aaEl = codons[k].aa;
    aaEl.textContent = AA[a1][0];
    aaEl.classList.toggle('is-changed', a1 !== CODE[CDS.slice(k * 3, k * 3 + 3)]);
    aaEl.classList.toggle('is-stop', a1 === '*');
    if (a1 === '*') for (let q = k + 1; q < 9; q++) codons[q].el.classList.add('is-skipped');

    // card (announced politely)
    card.show({ kicker: v.kicker, title: v.title, badge: { kind: v.badge, label: '' }, body: `<p>${v.text}</p>` });

    // scene ripple: DNA → mRNA → protein
    const tl = gsap.timeline();
    mutTl = tl;
    const i = nIdx(p);
    const top = el.top[i], bot = el.bot[i];
    top.rect.setAttribute('fill', BASES[b]);
    bot.rect.setAttribute('fill', BASES[COMP[b]]);
    const mk1 = mark(top, L.rise * 0.9);
    gsap.set(mk1, { y: L.half - 1 });
    const car = el.cars[G.CARS.indexOf(p)];
    car.rect.setAttribute('fill', BASES[rnaOf(b)]);
    const mk2 = mark(car, L.line.rise * 0.42);
    gsap.set(mk2, { y: L.stub * 0.5 });
    const bead = el.beads[k];
    const mk3 = mark(bead.inner, L.beadR);
    const newArt = beadArt(klass(a1), L.beadR);
    if (rm) {
      bead.art.remove(); bead.art = newArt; bead.inner.prepend(newArt);
    } else {
      [mk1, mk2, mk3].forEach((n, q) => tl.fromTo(n, { opacity: 0, scale: 0.4, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(1.6)' }, q * 0.35));
      const old = bead.art;
      bead.inner.prepend(newArt);
      bead.art = newArt;
      tl.fromTo(newArt, { opacity: 0 }, { opacity: 1, duration: 0.45 }, 0.75)
        .to(old, { opacity: 0, duration: 0.45, onComplete: () => old.remove() }, 0.75);
    }
    if (v.kind === 'stop') truncate(tl, k, rm);
    if (v.kind === 'sickle') sickle(tl, rm);
    if (rm) {
      tl.progress(1);
      // reduced motion: the sickling morph becomes a plain crossfade
      if (v.kind === 'sickle' && !instant) {
        gsap.fromTo(el.rbcS, { opacity: 0 }, { opacity: 1, duration: 0.6 });
        gsap.fromTo(el.rbcN, { opacity: 1 }, { opacity: 0, duration: 0.6 });
      }
    }
    if (!quiet) ctx.announce(`${v.kicker}. ${v.title}.`);
  }

  // Stop: everything after the stop disappears; the short fragment can't fold.
  function truncate(tl, k, rm) {
    const n = k - 1;                                   // residues made (1..n)
    const at = 1.1;
    const fold = foldState();
    const cx = L.blob.cx, cy = L.blob.cy;
    tl.to(el.bbWrap, { opacity: 0, duration: 0.5 }, at);
    for (let i = k; i < NB; i++) tl.to(el.beads[i].inner, { opacity: 0, duration: 0.6 }, at + Math.min(0.5, (i - k) * 0.004));
    tl.to(el.beads[0].inner, { opacity: 0, duration: 0.2 }, at);
    // fragment: a short loose chain at the blob's center
    const sp = L.beadR * 2.4 * G.blobScale + 2;
    const frag = S('path', { fill: 'none', stroke: '#B5BEDA', strokeOpacity: 0.6, strokeWidth: 2, opacity: 0 }, el.sandbox);
    const pts = [];
    for (let i = 1; i <= n; i++) {
      const tx = cx + (i - (n + 1) / 2) * sp, ty = cy + Math.sin(i * 1.3) * sp * 0.35;
      pts.push([tx, ty]);
      tl.to(el.beads[i].inner, { x: tx - fold[i][0], y: ty - fold[i][1], duration: 0.9, ease: 'so.inOut' }, at + 0.2);
    }
    frag.setAttribute('d', dOf(pts));
    tl.to(frag, { opacity: 1, duration: 0.4 }, at + 1.0);
    const lab = S('text', { class: 't-small t-mid t-halo', x: cx, y: cy + sp * 1.6 + 8, opacity: 0, text: `Only ${n} amino acids` }, el.sandbox);
    tl.to(lab, { opacity: 1, duration: 0.4 }, at + 1.1);
  }

  // Sickle: four chains → one hemoglobin unit → units stick into a fiber; the cell sickles.
  function sickle(tl, rm) {
    const at = 1.2;
    const { cx, cy } = L.blob;
    const F = L.fiber;
    const u = L.compact ? 17 : 20;                     // half-size of one hemoglobin unit
    const unit = (x, y, rot) => {
      const g = S('g', { opacity: 0 }, el.sandbox);
      gsap.set(g, { x, y, rotation: rot, transformOrigin: '50% 50%' });
      const blob = (bx, by, fill) => S('ellipse', { cx: bx, cy: by, rx: u * 0.52, ry: u * 0.46, fill, stroke: '#FFF', strokeOpacity: 0.25, strokeWidth: 0.8 }, g);
      blob(-u * 0.48, -u * 0.44, paint.unitA); blob(u * 0.48, u * 0.44, paint.unitA);
      blob(u * 0.48, -u * 0.44, paint.unitB); blob(-u * 0.48, u * 0.44, paint.unitB);
      for (const [px, py] of [[u * 0.98, -u * 0.44], [-u * 0.98, u * 0.44]]) S('circle', { cx: px, cy: py, r: u * 0.17, fill: BEAD.oily.fill, stroke: TYPO, strokeWidth: 1.4 }, g);
      return g;
    };
    const n = F.n;
    const fx = (i) => F.x0 + i * F.dx;
    const units = [];
    // the detailed chain shrinks into one of four chains of the first unit
    tl.to(el.chainWrap, { scale: (u * 0.5) / (7 * L.blob.bond), x: u * 0.48, y: -u * 0.44, opacity: 0, svgOrigin: `${cx} ${cy}`, duration: 1.0, ease: 'so.inOut' }, at);
    const first = unit(cx, cy, 0);
    units.push(first);
    tl.to(first, { opacity: 1, duration: 0.6 }, at + 0.55);
    for (let i = 1; i < n; i++) {
      const R = ctx.random(40 + i);
      const g = unit(cx + R.range(-1, 1) * 110, cy + R.range(-1, 1) * 70, R.range(-60, 60));
      units.push(g);
      tl.to(g, { opacity: 1, duration: 0.5 }, at + 0.9 + i * 0.12);
    }
    // they bind end to end into a fiber
    const ox = L.labels.oxygen;
    const oxy = S('text', { class: 't-caps t-mid t-halo', x: ox[0], y: ox[1], opacity: 0, text: 'Low oxygen' }, el.sandbox);
    tl.to(oxy, { opacity: 1, duration: 0.5 }, at + 1.3);
    units.forEach((g, i) => tl.to(g, { x: fx(i), y: F.y + (i % 2 ? 2 : -2), rotation: 0, duration: 1.2, ease: 'so.inOut' }, at + 1.7 + i * 0.08));
    const lab = S('text', { class: 't-small t-mid t-halo', x: fx((n - 1) / 2), y: F.y + u * 2.3, opacity: 0, text: 'Hemoglobin stacks into a fiber' }, el.sandbox);
    tl.to(lab, { opacity: 1, duration: 0.5 }, at + 2.7);
    // the red blood cell becomes a rigid crescent
    tl.to(el.rbcN, { opacity: 0, duration: rm ? 0.01 : 0.9 }, at + 2.4)
      .fromTo(el.rbcS, { opacity: 0, rotation: -8, transformOrigin: '50% 50%' }, { opacity: 1, rotation: 0, duration: rm ? 0.01 : 0.9 }, at + 2.4);
  }

  // ================================================================ stepper
  const stepper = ctx.ui.stepper({
    steps,
    scene: wrap,
    reset() {
      draw();
      head.children[0].style.opacity = '';
      head.children[1].style.opacity = '0';
    },
    onChange(i) {
      const was = stepIndex;
      stepIndex = i;
      const live = i === 5;
      wrap.classList.toggle('is-live', live);
      tryRow.hidden = !live;
      skip.setAttribute('aria-hidden', String(live));
      skip.tabIndex = live ? -1 : 0;
      for (const c of codons) for (const t of c.tiles) { t.btn.disabled = !live; t.btn.setAttribute('aria-expanded', 'false'); }
      if (!live) {
        if (mut || mutTl) revert();
        chips.set(null);
        if (was === 5) card.hide();
      } else if (!mut) sandboxIntro();
    },
  });

  // Re-layout (not shrink) across the phone breakpoint.
  let wasCompact = ctx.compact;
  ctx.onResize(({ compact }) => {
    if (compact === wasCompact) return;
    wasCompact = compact;
    const keep = mut;
    if (mut || mutTl) revert();
    stepper.rebuild();
    if (keep && stepIndex === 5) applyChange(keep, { instant: true, quiet: true });
  });

  return {
    destroy() { mutTl?.kill(); ctx.tooltip.hide(); },
  };
}
