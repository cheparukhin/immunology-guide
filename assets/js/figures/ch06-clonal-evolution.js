// ch06-clonal-evolution — "Evolution in a patch of tissue" (Figure 6.1)
//
// A sheet of lining tissue (hex grid, canvas sprites from the art library) in which cells
// divide, pick up random mutations and compete (agent-based Moran model). Rare drivers make a
// family divide a little more often; three in one lineage make it invasive (a cancer). A family
// tree (SVG) grows beside the tissue: driver clones as nodes, passengers as ticks, then the
// cancer's thick "trunk" and its hue-shifted, lettered, hatched branches.
//
// Guided story (7 steps, seeded and partly scripted so it always plays out) via ctx.ui.stepper,
// then free play (play/pause, speed, replay, new run, DNA repair normal | faulty).
//
// Stepper safety: every step tweens a plain `story` object ({ t: years, trunk, ticks, hint, free }).
// The simulation is a pure function of (seed, script, tick): syncing to story.t restores the
// nearest snapshot and re-runs, so Back / dot jumps / reduced motion land in identical states.
//
// CANONICAL CLONE TREE: `createCloneTree()` below is the book's family-tree style
// (FIGURE-AUDIT §2G). ch11-personal-vaccine copies it; see the comment block above it.
//
// Science notes (teaching model, "Illustrative"): one tick ≈ one round of cell turnover
// (40 ticks = 1 "year"); ~2% of cells divide per tick; each daughter gets Poisson(3) new
// passengers (≈ "three new mistakes per division", ch06 text); drivers raise the division rate
// (×1.2, ×1.8, ×2.6 for 1, 2, 3 drivers — exaggerated so selection is visible in seconds);
// only 3+ driver cells may cross the boundary layer. Normal repair: a driver appears somewhere
// in the sheet every ~2.5 (desktop grid) / ~3.5 (phone grid) model years; faulty repair ×10.
// Tuned (headless, 400 runs): normal repair makes a cancer within 80 years in ~22–25% of runs;
// faulty repair in ~100%, at a median of ~30 years. Story: drivers are scripted (APC, then 7 / 6
// unnamed first drivers in step 3 so most visibly die out, KRAS, TP53) into random cells of the
// right lineage; seeds were chosen so every step plays out. Dev tuning panel: add ?ce-tune.

import { sprite, drawSprite, PALETTE, mix, cancerCell, cellInfo, blobRadius, polarPoints, smoothPath } from '../art/index.js';
import { fixedStep } from './shared/agents.js';
import { scale as ckScale, chartRoot, band as ckBand, marker as ckMarker } from './shared/chart.js';

const ID = 'ch06-clonal-evolution';
const SEL = `[data-figure="${ID}"]`;

// ============================================================================ MODEL

const TICKS_PER_YEAR = 40;
const BASE_DIV = 0.02;                         // share of cells that divide per tick in plain homeostasis
const FITNESS = [1, 1.2, 1.8, 2.6, 3.2, 3.6, 4];   // relative division rate by number of drivers
const PASSENGERS = 3;                          // mean new passengers per division (normal repair)
const FAULTY = 10;                             // faulty repair multiplies both mutation rates
const BRANCH_EVERY = 4;                        // ticks between branch re-evaluations (part of the sim state)
const BRANCH_SHOW = 0.05, BRANCH_KEEP = 0.03, BRANCH_MAX_SHOW = 0.8, BRANCH_MAX_KEEP = 0.88;
const LETTERS = 'BCDEFGH';
let STAMP = 0;                                 // scratch counter for branch counting (not sim state)

/** Resumable mulberry32 (agents.js' rng has no readable state; snapshots need one). */
function seededRng(seed = 1) {
  let s = seed >>> 0;
  const r = () => {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  r.get = () => s;
  r.set = (v) => { s = v >>> 0; };
  r.int = (n) => Math.floor(r() * n);
  r.poisson = (lam) => {
    if (lam <= 0) return 0;
    if (lam > 40) { const g = Math.sqrt(-2 * Math.log(r() || 1e-12)) * Math.cos(2 * Math.PI * r()); return Math.max(0, Math.round(lam + Math.sqrt(lam) * g)); }
    const L = Math.exp(-lam);
    let k = 0, p = 1;
    do { k++; p *= r(); } while (p > L);
    return k - 1;
  };
  return r;
}

/**
 * Agent-based Moran competition on a hex grid (odd rows shifted right).
 * Rows < epiRows are epithelium (always full); the rest is stroma (empty until invaded).
 * A dividing cell puts its daughter into a random neighboring epithelial site, replacing the
 * occupant; only cells with 3+ drivers may also place daughters into stroma sites.
 */
export function createTissue({ cols, rows, epiRows, seed = 1, muD = 0, faulty = false, randomDrivers = true, onEvent = null }) {
  const N = cols * rows;
  const nb = new Int32Array(N * 6).fill(-1);
  const nbDir = new Int8Array(N * 6).fill(-1);
  const nbN = new Uint8Array(N);
  const isEpi = new Uint8Array(N);
  // direction index: 0 E, 1 W, 2 NW, 3 NE, 4 SW, 5 SE (angles used by the outline drawer)
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const i = r * cols + c;
    isEpi[i] = r < epiRows ? 1 : 0;
    const d = r & 1
      ? [[1, 0, 0], [-1, 0, 1], [0, -1, 2], [1, -1, 3], [0, 1, 4], [1, 1, 5]]
      : [[1, 0, 0], [-1, 0, 1], [-1, -1, 2], [0, -1, 3], [-1, 1, 4], [0, 1, 5]];
    let k = 0;
    for (const [dc, dr, dir] of d) {
      const cc = c + dc, rr = r + dr;
      if (cc < 0 || cc >= cols || rr < 0 || rr >= rows) continue;
      nb[i * 6 + k] = rr * cols + cc;
      nbDir[i * 6 + k] = dir;
      k++;
    }
    nbN[i] = k;
  }
  const S = {
    occ: new Uint8Array(N), drv: new Uint8Array(N), clone: new Int32Array(N), pas: new Int32Array(N),
    born: new Int32Array(N), memb: new Int8Array(N).fill(-1), lin: new Array(N).fill(null),
    occList: [], tick: 0, maxD: 0, nodeId: 0, firstInvasion: -1,
    clones: [], cancer: null,      // cancer: { clone, root, founded, invaded, size, branches: [...] }
  };
  let nEpi = 0;
  for (let i = 0; i < N; i++) if (isEpi[i]) { S.occ[i] = 1; S.occList.push(i); nEpi++; }
  S.clones.push({ id: 0, parent: -1, depth: 0, label: 'Original cell', size: nEpi, t0: 0, p0: 0, dead: -1, inCancer: false });
  const R = seededRng(seed);
  const params = { muD, faulty, randomDrivers };
  const fit = (d) => FITNESS[Math.min(d, FITNESS.length - 1)];
  let quiet = false;
  const cand = new Int32Array(6);

  const newNode = (parent, p, driver) => ({ id: ++S.nodeId, parent, p, t: S.tick, driver, cnt: 0, stamp: -1, best: 0 });
  const rootOf = (node) => { while (node && node.parent) node = node.parent; return node; };

  function place(i, j, label) {
    const k = R.poisson(PASSENGERS * (params.faulty ? FAULTY : 1));
    let d = S.drv[i], cl = S.clone[i];
    const driver = label != null;
    const p = S.pas[i] + k;
    if (driver) {
      d += 1;
      const id = S.clones.length;
      S.clones.push({ id, parent: cl, depth: d, label, size: 0, t0: S.tick, p0: p, dead: -1, inCancer: !!S.clones[cl].inCancer });
      cl = id;
    }
    if (S.occ[j]) {
      const oc = S.clones[S.clone[j]];
      oc.size--;
      if (oc.size === 0) oc.dead = S.tick;
    } else {
      S.occ[j] = 1;
      S.occList.push(j);
    }
    S.drv[j] = d; S.clone[j] = cl; S.pas[j] = p; S.born[j] = S.tick;
    S.clones[cl].size++;
    if (d > S.maxD) S.maxD = d;
    if (d >= 3) {
      if (driver && d === 3) {
        const root = newNode(null, p, true);
        root.clone = cl;
        S.lin[j] = root;
        S.clones[cl].inCancer = true;
        if (!S.cancer) S.cancer = { clone: cl, root, founded: S.tick, invaded: -1, size: 1, branches: [] };
      } else {
        S.lin[j] = k > 0 || driver ? newNode(S.lin[i], p, driver) : S.lin[i];
      }
      S.memb[j] = S.memb[i];
      if (!isEpi[j]) {
        if (S.firstInvasion < 0) S.firstInvasion = S.tick;          // a growth that invades is a cancer
        if (S.cancer && S.cancer.invaded < 0 && rootOf(S.lin[j]) === S.cancer.root) S.cancer.invaded = S.tick;
      }
    } else {
      S.lin[j] = null;
      S.memb[j] = -1;
    }
    if (onEvent && !quiet) onEvent(j, k, label, i);
  }

  function divide(i, label = null) {
    const n = nbN[i];
    const inv = S.drv[i] >= 3;
    let m = 0;
    for (let q = 0; q < n; q++) { const j = nb[i * 6 + q]; if (isEpi[j] || inv) cand[m++] = j; }
    if (!m) return -1;
    const j = cand[R.int(m)];
    place(i, j, label);
    return j;
  }

  /** Re-count the cancer's lineage tree and choose which subclones ("branches") to show. */
  function updateBranches() {
    const list = S.occList;
    // if the tracked cancer lineage has died out, follow the largest living one (faulty repair can found several)
    {
      const counts = new Map();
      for (let q = 0; q < list.length; q++) {
        let top = S.lin[list[q]];
        if (!top) continue;
        while (top.parent) top = top.parent;
        counts.set(top, (counts.get(top) || 0) + 1);
      }
      if (!counts.get(S.cancer.root) && counts.size) {
        let best = null;
        for (const [r, n] of counts) if (!best || n > counts.get(best) || (n === counts.get(best) && r.id < best.id)) best = r;
        let inv = -1;
        for (const i of list) if (!isEpi[i] && S.lin[i] && rootOf(S.lin[i]) === best) { inv = S.tick; break; }
        S.cancer = { clone: best.clone, root: best, founded: best.t, invaded: inv, size: counts.get(best), branches: [] };
      }
    }
    const Cn = S.cancer;
    const stamp = ++STAMP;
    const visited = [];
    let total = 0;
    for (let q = 0; q < list.length; q++) {
      let node = S.lin[list[q]];
      if (!node) continue;
      let top = node;
      while (top.parent) top = top.parent;
      if (top !== Cn.root) continue;
      total++;
      while (node) {
        if (node.stamp !== stamp) { node.stamp = stamp; node.cnt = 0; node.best = 0; visited.push(node); }
        node.cnt++;
        node = node.parent;
      }
    }
    Cn.size = total;
    for (const nd of visited) if (nd.parent && nd.parent.stamp === stamp && nd.cnt > nd.parent.best) nd.parent.best = nd.cnt;
    const shownAnc = (nd, set) => { for (let a = nd.parent; a; a = a.parent) if (set.has(a)) return a; return null; };
    // keep the branches already shown while they stay between KEEP and MAX_KEEP …
    const shown = new Map();
    for (const b of Cn.branches) {
      const nd = b.node;
      if (nd.stamp === stamp && total && nd.cnt / total >= BRANCH_KEEP && nd.cnt / total <= BRANCH_MAX_KEEP) shown.set(nd, true);
    }
    // … and drop a nested branch that has become the same set as its parent branch
    for (const nd of [...shown.keys()]) { const a = shownAnc(nd, shown); if (a && nd.cnt >= 0.95 * a.cnt) shown.delete(nd); }
    if (total >= 20) {
      const cands = visited.filter((nd) => nd.parent && !shown.has(nd) && nd.cnt / total >= BRANCH_SHOW && nd.cnt / total <= BRANCH_MAX_SHOW && nd.best !== nd.cnt);
      cands.sort((a, b) => b.cnt - a.cnt || a.id - b.id);
      const eligible = (nd) => {
        for (const o of shown.keys()) for (let x = o.parent; x; x = x.parent) if (x === nd) return false;   // an ancestor of a shown branch
        const anc = shownAnc(nd, shown);
        if (!anc) return true;
        if (nd.cnt > 0.65 * anc.cnt) return false;                                                     // not a real split
        for (const o of shown.keys()) if (shownAnc(o, shown) === anc) return false;                     // one sub-branch each
        return true;
      };
      for (const nd of cands) {
        if (!eligible(nd)) continue;
        if (shown.size >= 4) {
          // a much bigger newcomer replaces the smallest leaf branch (old branches can shrink away)
          let small = null;
          for (const o of shown.keys()) if (![...shown.keys()].some((x) => shownAnc(x, shown) === o) && (!small || o.cnt < small.cnt)) small = o;
          if (!small || nd.cnt < 2 * small.cnt) break;
          shown.delete(small);
          if (!eligible(nd)) { shown.set(small, true); continue; }
        }
        shown.set(nd, true);
      }
    }
    const nodes = [...shown.keys()].sort((a, b) => a.id - b.id);
    const idx = new Map(nodes.map((nd, k) => [nd, k]));
    Cn.branches = nodes.map((nd, k) => {
      const par = shownAnc(nd, shown);
      const base = par || Cn.root;
      let drivers = 0;
      for (let y = nd; y && y !== base; y = y.parent) if (y.driver) drivers++;
      return { node: nd, letter: LETTERS[k], hue: (k % 4) + 1, parent: par ? idx.get(par) : -1, size: nd.cnt, passengers: nd.p - base.p, mut: nd.p, t: nd.t, drivers };
    });
    for (let q = 0; q < list.length; q++) {
      const i = list[q];
      let node = S.lin[i];
      if (!node) continue;
      let m = -1;
      while (node) { const k = idx.get(node); if (k != null) { m = k; break; } node = node.parent; }
      S.memb[i] = m;
    }
  }

  function step() {
    const fmax = fit(S.maxD);
    const lam = BASE_DIV * fmax * S.occList.length;
    let K = Math.floor(lam);
    if (R() < lam - K) K++;
    const mu = params.randomDrivers ? params.muD * (params.faulty ? FAULTY : 1) : 0;
    for (let a = 0; a < K; a++) {
      const i = S.occList[R.int(S.occList.length)];
      if (R() * fmax > fit(S.drv[i])) continue;
      divide(i, mu && R() < mu ? '' : null);
    }
    S.tick++;
    if (S.cancer && S.tick % BRANCH_EVERY === 0) updateBranches();
  }

  /** Scripted driver: a random cell passing `filter` divides; its daughter carries the driver. */
  function scriptDriver(filter, label, prefer = null) {
    let list = [];
    for (const i of S.occList) if (filter(i)) list.push(i);
    if (!list.length) return -1;
    if (prefer) list = prefer(list);
    return divide(list[R.int(list.length)], label);
  }

  function snapshot() {
    return {
      occ: S.occ.slice(), drv: S.drv.slice(), clone: S.clone.slice(), pas: S.pas.slice(), born: S.born.slice(), memb: S.memb.slice(),
      lin: S.lin.slice(), occList: S.occList.slice(), tick: S.tick, maxD: S.maxD, nodeId: S.nodeId, rng: R.get(), firstInvasion: S.firstInvasion,
      clones: S.clones.map((c) => ({ ...c })),
      cancer: S.cancer && { ...S.cancer, branches: S.cancer.branches.map((b) => ({ ...b })) },
      params: { ...params },
    };
  }
  function restore(sn) {
    S.occ.set(sn.occ); S.drv.set(sn.drv); S.clone.set(sn.clone); S.pas.set(sn.pas); S.born.set(sn.born); S.memb.set(sn.memb);
    S.lin = sn.lin.slice(); S.occList = sn.occList.slice(); S.tick = sn.tick; S.maxD = sn.maxD; S.nodeId = sn.nodeId; R.set(sn.rng); S.firstInvasion = sn.firstInvasion;
    S.clones = sn.clones.map((c) => ({ ...c }));
    S.cancer = sn.cancer && { ...sn.cancer, branches: sn.cancer.branches.map((b) => ({ ...b })) };
    Object.assign(params, sn.params);
  }

  function driverFraction() {
    let n = 0;
    for (let i = 0; i < N; i++) if (isEpi[i] && S.drv[i] > 0) n++;
    return n / nEpi;
  }

  return {
    S, N, cols, rows, epiRows, nEpi, nb, nbDir, nbN, isEpi, R, params,
    get tick() { return S.tick; },
    step, divide, scriptDriver, snapshot, restore, driverFraction, rootOf,
    setQuiet(q) { quiet = q; },
  };
}

// ============================================================================ STORY

// Grids: ~1,200 sites on wide stages, ~560 on phones (FIGURE-AUDIT: keep the phone grid small).
// driverYears: normal-repair driver interval for the whole sheet (tuned so that ~1 in 4 runs of
// 80 "years" make a cancer; faulty repair: nearly all, at a median of ~30 years).
export const GRIDS = {
  wide: { cols: 35, rows: 34, epiRows: 26, driverYears: 2.5, storySeed: 9367, apcYear: 5.5, extras: [20.5, 22, 24, 26.5, 29, 32, 35] },
  tall: { cols: 20, rows: 28, epiRows: 21, driverYears: 3.5, storySeed: 8096, apcYear: 11, extras: [21, 23, 25.5, 28, 31.5, 35] },
};
export const STEP_END = [5, 20, 44, 51, 57.5, 66];                   // model years at the end of steps 1–6
const STEP_SECONDS = [5, 7, 9, 6, 6.5, 7.5, 1.4];             // animation length of each step
const KRAS_YEAR = 45, TP53_YEAR = 52;
const FREE_YEARS = 80;
const TALL_BELOW = 900;          // stage width below which the portrait layout is used
const TALL_MAX_W = 540;          // tissue width cap in the portrait layout (tablets)
const SPEEDS = { 1: 0.5, 4: 2, 16: 8 };                       // model years per second

export function storyEvents(G) {
  return [
    { year: G.apcYear, label: 'APC', target: 'apc' },
    ...G.extras.map((year) => ({ year, label: '', target: 'extra' })),
    { year: KRAS_YEAR, label: 'KRAS', target: 'kras' },
    { year: TP53_YEAR, label: 'TP53', target: 'tp53' },
  ].map((e) => ({ ...e, tick: Math.round(e.year * TICKS_PER_YEAR) }));
}

export function applyStoryEvent(m, ev) {
  const S = m.S, cols = m.cols;
  const cloneBy = (lab) => S.clones.findIndex((c) => c.label === lab);
  const rc = (i) => [i % cols, Math.floor(i / cols)];
  const lowest = (frac) => (list) => {
    const rs = list.map((i) => Math.floor(i / cols));
    const sorted = [...rs].sort((a, b) => b - a);
    const cut = sorted[Math.max(0, Math.floor(sorted.length * frac) - 1)];
    return list.filter((i, k) => rs[k] >= cut);
  };
  if (ev.target === 'apc') {
    const cx = cols / 2, cy = m.epiRows * 0.6;
    return m.scriptDriver((i) => S.clone[i] === 0 && m.isEpi[i], ev.label,
      (list) => list.map((i) => [i, (rc(i)[0] - cx) ** 2 + (rc(i)[1] - cy) ** 2]).sort((a, b) => a[1] - b[1]).slice(0, 8).map((a) => a[0]));
  }
  if (ev.target === 'extra') {
    const apc = cloneBy('APC');
    let sx = 0, sy = 0, n = 0;
    for (const i of S.occList) if (S.clone[i] === apc) { const [c, r] = rc(i); sx += c; sy += r; n++; }
    const cx = n ? sx / n : cols / 2, cy = n ? sy / n : m.epiRows / 2;
    return m.scriptDriver((i) => {
      const [c, r] = rc(i);
      return S.clone[i] === 0 && m.isEpi[i] && (c - cx) ** 2 + (r - cy) ** 2 > 64 && c > 1 && c < cols - 2 && r > 1 && r < m.epiRows - 2;
    }, ev.label);
  }
  if (ev.target === 'kras') return m.scriptDriver((i) => S.clone[i] === cloneBy('APC'), ev.label, lowest(0.4));
  if (ev.target === 'tp53') return m.scriptDriver((i) => S.clone[i] === cloneBy('KRAS'), ev.label, lowest(0.4));
  return -1;
}

// ============================================================================ STYLE

const CSS = `
${SEL} .ce-layer > canvas, ${SEL} .ce-layer > svg { position: absolute; inset: 0; width: 100%; height: 100%; }
${SEL} .ce-layer > svg { pointer-events: none; overflow: visible; }
${SEL} .ce-layer > canvas { cursor: crosshair; touch-action: pan-y; }
${SEL} .ce-hit { pointer-events: all; cursor: pointer; outline: none; }
${SEL} .ce-hit:focus-visible .ce-focus { opacity: 1; }
${SEL} .ce-focus { opacity: 0; fill: none; stroke: var(--stage-focus); stroke-width: 2; pointer-events: none; }
${SEL} .ce-label { font-family: var(--font-ui); }
${SEL} .ce-gene { font-weight: 650; letter-spacing: 0.02em; fill: var(--fg); }
${SEL} .ce-letter { font-weight: 720; fill: var(--fg); }
${SEL} .ce-mut { fill: var(--fg-3); font-variant-numeric: tabular-nums; }
${SEL} .ce-hint { pointer-events: none; }
${SEL} .ce-hint rect { fill: rgb(14 20 44 / 0.86); stroke: rgb(245 198 90 / 0.75); stroke-width: 1; }
${SEL} .ce-hint text { fill: #FBE7B5; font-weight: 600; }
${SEL} .ce-card {
  position: absolute; z-index: 6; max-width: min(17.5rem, calc(100% - 24px));
  padding: 0.6rem 2.1rem 0.65rem 0.8rem; border-radius: 10px;
  background: rgb(12 17 38 / 0.94); color: var(--fg);
  box-shadow: 0 6px 24px rgb(0 0 0 / 0.45), inset 0 0 0 1px rgb(233 236 246 / 0.16);
  font: 450 0.82rem/1.42 var(--font-ui); pointer-events: auto;
}
${SEL} .ce-card[hidden] { display: none; }
${SEL} .ce-card__kicker { margin: 0 0 0.15rem; font-size: 0.68rem; font-weight: 650; letter-spacing: 0.08em; text-transform: uppercase; color: var(--fg-3); }
${SEL} .ce-card p { margin: 0; }
${SEL} .ce-card strong { font-weight: 650; }
${SEL} .ce-card__close {
  position: absolute; top: 2px; right: 2px; width: 32px; height: 32px; display: grid; place-items: center;
  border: 0; border-radius: 8px; background: none; color: var(--fg-2); cursor: pointer; font-size: 1.1rem; line-height: 1;
}
${SEL} .ce-card__close:hover { color: var(--fg); background: rgb(233 236 246 / 0.08); }
${SEL} .ce-swatch { display: inline-block; width: 0.8em; height: 0.8em; border-radius: 50%; vertical-align: -0.08em; margin-right: 0.3em; }
${SEL} .ce-free { display: contents; }
${SEL} .ce-free[hidden] { display: none; }
${SEL} .ce-note { font: 500 0.78rem/1.3 var(--font-ui); color: var(--ink-3); }
${SEL} .ce-tune { position: absolute; z-index: 7; left: 8px; bottom: 8px; padding: 8px; background: rgb(0 0 0 / 0.8); color: #fff; font: 12px/1.4 ui-monospace, monospace; border-radius: 6px; max-width: 320px; }
${SEL} .ce-tune input { width: 70px; }
`;
function injectCSS() {
  if (document.getElementById(`${ID}-css`)) return;
  const s = document.createElement('style');
  s.id = `${ID}-css`;
  s.textContent = CSS;
  document.head.append(s);
}

// Palette for the tissue and the tree (canonical cell colors; branch hues come from cancerCell({ clone })).
const SAND = PALETTE.healthy;
const VIOLET = PALETTE.cancer;
const BLEND = mix(SAND, VIOLET, 0.5);
const GOLD = '#F5C65A';
const PALE = '#E4E9FA';
const LINE = '#9FB0DC';
const FG3 = 'rgba(214,220,240,0.5)';
// sub-clone tints exactly as cancerCell({ clone }) draws them (computed lazily: needs the DOM)
let HUES = null;
const branchHue = (k) => (HUES ||= [0, 1, 2, 3, 4].map((c) => cellInfo(cancerCell({ r: 10, clone: c, receptors: false, glow: false }))?.color || VIOLET))[k];
const HATCHES = ['stripes', 'dots', 'bars', 'cross'];        // B, C, D, E (then repeat)
const hatchOf = (letterIndex) => HATCHES[letterIndex % HATCHES.length];
const colorFor = (drivers) => (drivers <= 0 ? SAND : drivers === 1 ? SAND : drivers === 2 ? BLEND : VIOLET);
const WORDS = [[0.04, 'hardly any'], [0.16, 'about one in ten'], [0.29, 'about a quarter'], [0.42, 'about a third'], [0.6, 'about half'], [1.01, 'most']];
const driverWords = (f) => WORDS.find(([lim]) => f < lim)[1];

// ============================================================================ CANONICAL CLONE TREE
//
// The book's family-tree style (ch06-clonal-evolution; copied by ch11-personal-vaccine):
//  • Left-to-right cladogram. The ROOT ("Original cell") is a sand disc at the left; every
//    family sits one column right of its parent (column = number of drivers), so the cancer's
//    founder is always column 3 and its branches fan out in column 4 (5 when nested).
//  • Every node is a family founded by a DRIVER: a disc whose area ∝ the family's size, filled
//    with the cell color for its driver count (sand · sand + violet rim · sand/violet blend ·
//    violet with a lumpy "cancer" outline). The driver is a small gold diamond at the end of the
//    incoming edge, named above it (APC, KRAS, TP53).
//  • Links are rectangular elbows with rounded corners: siblings share one vertical "spine" just
//    right of the parent; a family that continues its parent's lineage stays on the parent's row.
//    Rows alternate above/below the center line (branches B up, C down, D up…).
//  • TRUNK: the path from the root to the cancer's founder is one thick (9 px) rounded band on
//    the center line, sand → violet gradient with a thin white sheen, labeled in small caps
//    "TRUNK · in every cancer cell" under it (and "3 drivers + N passengers" on wide stages).
//    Tap it to light up every cancer cell.
//  • BRANCHES: sub-families of the cancer fan out right of the trunk's end, one per row,
//    hue-shifted ≤ ±25° from violet (cancerCell({ clone }) tints), each with a LETTER (B, C, D…)
//    and a HATCH (stripes, dots, bars, cross-hatch) so color is never the only cue.
//  • PASSENGERS: small pale ticks across each edge (≤ 12, then "+N"; white across the trunk).
//  • Extinct families stay as hollow gray circles on dashed links (history matters).
//
// API: const tree = createCloneTree(ctx, parentG, { onSelect });
//      tree.render(spec, box, { compact, ticks: 0..1, trunk: 0..1, selected });
// spec = { nodes: [{ id, parent, kind: 'root'|'clone'|'branch', size, drivers, dead, num, t0,
//                    gene, passengers, letter, letterIndex, order, color, aria }],
//          trunkEnd: id | null, focus: id | null, trunkText, stemLen, extraDead, note }
let treeCount = 0;
function createCloneTree(ctx, parent, { onSelect } = {}) {
  const mk = (tag, attrs = {}, p) => ctx.svg(tag, attrs, p);
  const root = mk('g', { class: 'ce-tree' }, parent);
  const defs = parent.ownerSVGElement.defs || mk('defs', {}, parent.ownerSVGElement);
  const uid = `ce-tree-${++treeCount}`;      // deterministic ids (QA snapshots compare attributes)
  // hatch patterns (white strokes over the branch color)
  const pat = {};
  for (const kind of HATCHES) {
    const p = mk('pattern', { id: `${uid}-${kind}`, patternUnits: 'userSpaceOnUse', width: 6, height: 6 }, defs);
    const st = 'stroke:#fff;stroke-opacity:0.62;stroke-width:1.3;fill:none';
    if (kind === 'stripes') mk('path', { d: 'M-1 1 L1 -1 M0 6 L6 0 M5 7 L7 5', style: st }, p);
    if (kind === 'bars') mk('path', { d: 'M0 3 H6', style: st }, p);
    if (kind === 'cross') mk('path', { d: 'M0 0 L6 6 M6 0 L0 6', style: st.replace('1.3', '1') }, p);
    if (kind === 'dots') mk('circle', { cx: 3, cy: 3, r: 1.25, style: 'fill:#fff;fill-opacity:0.7' }, p);
    pat[kind] = `url(#${uid}-${kind})`;
  }
  const trunkGrad = mk('linearGradient', { id: `${uid}-trunk`, gradientUnits: 'userSpaceOnUse', x1: 0, y1: 0, x2: 100, y2: 0 }, defs);
  mk('stop', { offset: 0, 'stop-color': SAND }, trunkGrad);
  mk('stop', { offset: 0.55, 'stop-color': BLEND }, trunkGrad);
  mk('stop', { offset: 1, 'stop-color': VIOLET }, trunkGrad);

  const gLinks = mk('g', {}, root);
  const gTrunk = mk('g', {}, root);
  const gTicks = mk('g', {}, root);
  const gNodes = mk('g', {}, root);
  const gLabels = mk('g', {}, root);
  const gHit = mk('g', {}, root);

  // trunk band (+ hit target)
  const trunkGlow = mk('path', { fill: 'none', stroke: '#fff', 'stroke-opacity': 0, 'stroke-width': 15, 'stroke-linecap': 'round' }, gTrunk);
  const trunkBand = mk('path', { fill: 'none', stroke: `url(#${uid}-trunk)`, 'stroke-width': 9, 'stroke-linecap': 'round' }, gTrunk);
  const trunkSheen = mk('path', { fill: 'none', stroke: '#fff', 'stroke-opacity': 0.28, 'stroke-width': 1.4, 'stroke-linecap': 'round' }, gTrunk);
  const trunkLabel = mk('text', { class: 't-caps ce-label', 'text-anchor': 'middle' }, gLabels);
  const trunkHit = mk('g', { class: 'ce-hit', tabindex: 0, role: 'button', 'aria-label': 'Trunk: mutations in every cancer cell. Light them up.' }, gHit);
  const trunkHitPath = mk('path', { fill: 'none', stroke: 'transparent', 'stroke-width': 36, 'stroke-linecap': 'round' }, trunkHit);
  const trunkFocus = mk('path', { class: 'ce-focus', 'stroke-linecap': 'round', 'stroke-width': 22 }, trunkHit);
  const fire = (sel) => onSelect && onSelect(sel);
  const bindHit = (el, sel) => {
    el.addEventListener('click', (e) => { e.stopPropagation(); fire(sel()); });
    el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fire(sel()); } });
  };
  bindHit(trunkHit, () => ({ type: 'trunk' }));

  const items = new Map();      // id → { g, link, ticks, disc, ring, hatch, mark, gene, letter, hit }
  let lastSpec = null;

  function ensure(id, kind) {
    let it = items.get(id);
    if (it) return it;
    it = { id, kind };
    it.link = mk('path', { fill: 'none', 'stroke-linecap': 'round' }, gLinks);
    it.ticks = mk('path', { fill: 'none', stroke: PALE, 'stroke-width': 1.1, 'stroke-linecap': 'round' }, gTicks);
    it.more = mk('text', { class: 't-small ce-mut ce-label' }, gLabels);
    it.g = mk('g', {}, gNodes);
    it.halo = mk('circle', { fill: 'none', stroke: '#fff', 'stroke-width': 2 }, it.g);
    it.disc = mk('path', {}, it.g);
    it.hatch = mk('path', { 'pointer-events': 'none' }, it.g);
    it.ring = mk('path', { fill: 'none' }, it.g);
    it.mark = mk('path', { fill: GOLD, stroke: '#2A2210', 'stroke-width': 0.8 }, gLabels);
    it.gene = mk('text', { class: 't-label ce-gene ce-label' }, gLabels);
    it.letter = mk('text', { class: 't-label ce-letter ce-label' }, gLabels);
    it.hit = mk('g', { class: 'ce-hit', tabindex: 0, role: 'button' }, gHit);
    it.hitC = mk('circle', { fill: 'transparent' }, it.hit);
    it.focus = mk('circle', { class: 'ce-focus' }, it.hit);
    bindHit(it.hit, () => it.sel);
    items.set(id, it);
    return it;
  }
  function drop(it) {
    for (const k of ['link', 'ticks', 'more', 'g', 'mark', 'gene', 'letter', 'hit']) it[k].remove();
    items.delete(it.id);
  }

  const blobCache = new Map();
  function blob(r, seed) {
    const key = `${Math.round(r * 2)}|${seed}`;
    let d = blobCache.get(key);
    if (!d) {
      const rf = blobRadius({ r, seed, irregularity: 0.55, bumps: [{ angle: 0.7, amp: 0.09, width: 0.4 }, { angle: 3.4, amp: 0.07, width: 0.35 }] });
      d = smoothPath(polarPoints(rf, 28));
      blobCache.set(key, d);
    }
    return d;
  }
  const circleD = (r) => `M${-r} 0a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`;
  const f1 = (v) => Math.round(v * 10) / 10;

  /**
   * Layout + draw. box: { x0, y0, x1, y1 }. opts: { compact, ticks: 0..1, trunk: 0..1, selected }.
   * Returns geometry for callers (positions, center line, trunk end, branch positions).
   */
  function render(spec, box, opts = {}) {
    lastSpec = spec;
    const { compact = false, ticks = 0, trunk = 0, selected: sel = null } = opts;
    const rowH = compact ? 24 : 30;
    const gapC = compact ? 16 : 28;              // extra room above/below the trunk for its labels
    const maxR = compact ? 13 : 17;
    const rc = 6;                                 // corner radius of the elbows
    const nodeR = (n) => (n.kind === 'root' ? maxR : n.dead ? 4.5 : Math.max(4.5, Math.min(maxR, 3 + 0.8 * Math.sqrt(Math.max(1, n.size)))));
    const byId = new Map(spec.nodes.map((n) => [n.id, n]));
    const rootN = spec.nodes.find((n) => n.kind === 'root');
    const rootR = maxR;
    const xr = box.x0 + rootR + (compact ? 10 : 12);
    const labelRoom = compact ? 22 : 30;
    // columns: root 0; every family one column right of its parent (= its number of drivers);
    // cancer branches one column per nesting level
    const colOf = new Map([[rootN.id, 0]]);
    const col = (n) => {
      if (colOf.has(n.id)) return colOf.get(n.id);
      const p = byId.get(n.parent);
      const c = p ? col(p) + 1 : 0;
      colOf.set(n.id, c);
      return c;
    };
    let nCols = 4;
    for (const n of spec.nodes) nCols = Math.max(nCols, col(n));
    // columns past the cancer's founder (branches) are a little narrower, leaving the trunk room for its label
    const colW = (c) => Math.min(c, 3) + 0.72 * Math.max(0, c - 3);
    const dx = (box.x1 - labelRoom - xr) / colW(nCols);
    const yc = Math.round((box.y0 + box.y1) / 2);
    const maxRows = Math.max(1, Math.floor(((box.y1 - box.y0) / 2 - gapC - 10) / rowH));
    const rowY = (row) => yc + row * rowH + Math.sign(row) * gapC;
    const spineX = (p) => (p.isRoot ? p.x + Math.max(p.r + 11, 32) : p.x + p.r + 8);
    // ---- rows: interval packing (row 0 = the main lineage)
    const rowsUsed = new Map();
    const fits = (row, a, b, parentId) => (rowsUsed.get(row) || []).every(([u0, u1, id]) => id === parentId || b < u0 - 6 || a > u1 + 6);
    const take = (row, a, b, id) => { if (!rowsUsed.has(row)) rowsUsed.set(row, []); rowsUsed.get(row).push([a, b, id]); };
    const pos = new Map();
    pos.set(rootN.id, { x: xr, y: yc, row: 0, r: rootR, isRoot: true });
    take(0, box.x0, xr + rootR, rootN.id);
    const trunkIds = new Set();
    if (spec.trunkEnd != null) for (let n = byId.get(spec.trunkEnd); n && n.kind !== 'root'; n = byId.get(n.parent)) trunkIds.add(n.id);
    const mainIds = new Set(trunkIds);
    if (!trunkIds.size && spec.focus != null) for (let n = byId.get(spec.focus); n && n.kind !== 'root'; n = byId.get(n.parent)) mainIds.add(n.id);
    const order = [
      ...spec.nodes.filter((n) => mainIds.has(n.id)).sort((a, b) => col(a) - col(b)),
      ...spec.nodes.filter((n) => n.kind === 'branch').sort((a, b) => col(a) - col(b) || a.order - b.order),
      ...spec.nodes.filter((n) => n.kind === 'clone' && !mainIds.has(n.id) && !n.dead).sort((a, b) => col(a) - col(b) || a.t0 - b.t0),
      ...spec.nodes.filter((n) => n.kind === 'clone' && !mainIds.has(n.id) && n.dead).sort((a, b) => b.t0 - a.t0),
    ];
    // cancer branches: depth-first in letter order, top to bottom, split evenly around the center line
    const brRow = new Map();
    {
      // groups = a top-level branch + its nested sub-branches, kept on one side of the center line
      const br = spec.nodes.filter((n) => n.kind === 'branch');
      const kids = (pid) => br.filter((n) => n.parent === pid).sort((a, b) => a.order - b.order);
      const groups = kids(spec.trunkEnd).map((top) => { const g = []; const visit = (n) => { g.push(n); kids(n.id).forEach(visit); }; visit(top); return g; });
      const total = groups.reduce((t, g) => t + g.length, 0);
      let split = 0, best = Infinity, acc = 0;
      for (let k = 0; k <= groups.length; k++) {
        const d = Math.abs(acc - (total - acc)) - (acc >= total - acc ? 0.5 : 0);
        if (d < best) { best = d; split = k; }
        if (k < groups.length) acc += groups[k].length;
      }
      const upN = groups.slice(0, split).reduce((t, g) => t + g.length, 0);
      groups.flat().forEach((n, k) => brRow.set(n.id, k < upN ? k - upN : k - upN + 1));
    }
    let hiddenDead = 0;
    for (const n of order) {
      const p = pos.get(n.parent);
      if (!p) { if (n.dead) hiddenDead++; continue; }
      const r = nodeR(n);
      const x = xr + colW(col(n)) * dx;
      const right = x + r + (n.kind === 'branch' ? 24 : 4);
      let row = null;
      if (mainIds.has(n.id)) row = 0;
      else {
        // a stable side: branches alternate up/down by letter; other families by id
        const s0 = p.row !== 0 ? Math.sign(p.row) : n.kind === 'branch' ? (n.order % 2 ? 1 : -1) : (n.num % 2 ? -1 : 1);
        const tries = [];
        if (brRow.has(n.id)) tries.push(brRow.get(n.id));
        if (p.row !== 0 && n.kind !== 'branch') tries.push(p.row);
        for (let k = 1; k <= maxRows; k++) tries.push(s0 * k);
        for (let k = 1; k <= maxRows; k++) tries.push(-s0 * k);
        for (const rw of tries) {
          const a = rw === p.row ? p.x : spineX(p) - 3;
          if (fits(rw, a, right, n.parent)) { row = rw; break; }
        }
      }
      if (row == null) { if (n.dead) { hiddenDead++; continue; } row = Math.sign(p.row || 1) * maxRows; }
      take(row, row === p.row ? p.x : spineX(p) - 3, right, n.id);
      pos.set(n.id, { x, y: rowY(row), row, r });
    }
    // ---- draw
    const seen = new Set();
    const isSel = (n) => sel && ((sel.type === 'trunk' && trunkIds.has(n.id)) || (sel.type === n.kind && sel.id === n.id));
    const dimOf = (n) => (sel && !isSel(n) ? 0.38 : 1);
    for (const n of spec.nodes) {
      if (n.kind === 'root') continue;
      const P = pos.get(n.id);
      if (!P) continue;
      const it = ensure(n.id, n.kind);
      seen.add(n.id);
      const pp = pos.get(n.parent);
      const onTrunk = trunkIds.has(n.id);
      const colr = n.kind === 'branch' ? n.color : colorFor(n.drivers);
      const op = dimOf(n);
      // link: straight when the family continues its parent's row, else an elbow from the parent's spine
      const ey = P.y, ex = P.x - P.r;
      let d, runStart;
      if (P.row === pp.row) { d = `M${f1(pp.x + pp.r)} ${f1(ey)}H${f1(ex)}`; runStart = pp.x + pp.r + 3; }
      else {
        const sx = spineX(pp), dir = Math.sign(ey - pp.y);
        d = `M${f1(pp.x + pp.r * 0.5)} ${f1(pp.y)}H${f1(sx - rc)}Q${f1(sx)} ${f1(pp.y)} ${f1(sx)} ${f1(pp.y + dir * rc)}V${f1(ey - dir * rc)}Q${f1(sx)} ${f1(ey)} ${f1(sx + rc)} ${f1(ey)}H${f1(ex)}`;
        runStart = sx + rc + 2;
      }
      it.link.setAttribute('d', d);
      it.link.setAttribute('stroke', n.dead ? 'rgba(214,220,240,0.55)' : colr);
      it.link.setAttribute('stroke-width', n.kind === 'branch' ? 3.2 : 2.2);
      it.link.setAttribute('stroke-dasharray', n.dead ? '3 4' : 'none');
      it.link.setAttribute('opacity', f1((onTrunk ? 1 - trunk : 1) * (n.dead ? 0.85 : 0.92) * op * 100) / 100);
      // passenger ticks (from step 6): ≤ 12 per edge, then "+N"
      const nPas = Math.max(0, n.passengers || 0);
      const runLen = ex - 12 - runStart;
      const nt = ticks > 0 && !n.dead ? Math.min(nPas, 12, Math.max(0, Math.floor(runLen / 4))) : 0;
      let td = '';
      const th = onTrunk ? 6 : 3.8;
      for (let k = 0; k < nt; k++) { const tx = runStart + ((k + 0.5) / nt) * runLen; td += `M${f1(tx)} ${f1(ey - th)}V${f1(ey + th)}`; }
      it.ticks.setAttribute('d', td);
      it.ticks.setAttribute('stroke', onTrunk ? '#FFFFFF' : PALE);
      it.ticks.setAttribute('stroke-width', onTrunk ? 1.2 : 1.1);
      it.ticks.setAttribute('opacity', f1(ticks * op * (onTrunk ? 0.8 : 0.85) * 100) / 100);
      const extra = nPas - nt;
      it.more.textContent = nt && extra > 0 && !onTrunk && runLen > 26 && (n.kind === 'branch' || P.row === 0) ? `+${extra}` : '';
      it.more.setAttribute('x', f1(runStart + 1));
      it.more.setAttribute('y', f1(ey + 15));
      it.more.setAttribute('opacity', f1(ticks * op * 100) / 100);
      // node
      it.g.setAttribute('transform', `translate(${f1(P.x)} ${f1(P.y)})`);
      it.g.setAttribute('opacity', op);
      const cancerish = n.kind === 'branch' || n.drivers >= 3;
      const shape = n.dead ? circleD(4.5) : cancerish ? blob(P.r, (n.num || 0) + (n.order || 0) * 5) : circleD(P.r);
      it.disc.setAttribute('d', shape);
      it.disc.setAttribute('fill', n.dead ? 'none' : colr);
      it.disc.setAttribute('fill-opacity', n.dead ? 0 : 0.96);
      it.disc.setAttribute('stroke', n.dead ? 'rgba(214,220,240,0.7)' : 'rgba(255,255,255,0.4)');
      it.disc.setAttribute('stroke-width', n.dead ? 1.4 : 0.8);
      it.hatch.setAttribute('d', n.kind === 'branch' ? shape : '');
      it.hatch.setAttribute('fill', n.kind === 'branch' ? pat[hatchOf(n.letterIndex)] : 'none');
      it.ring.setAttribute('d', !n.dead && n.drivers === 1 && n.kind === 'clone' ? circleD(P.r - 0.8) : '');
      it.ring.setAttribute('stroke', VIOLET);
      it.ring.setAttribute('stroke-width', 2);
      it.halo.setAttribute('r', f1(P.r + 4));
      it.halo.setAttribute('stroke-opacity', isSel(n) && sel.type !== 'trunk' ? 0.9 : 0);
      // driver: gold diamond at the end of the edge, gene name above it
      const showMark = n.kind === 'clone' || (n.kind === 'branch' && n.drivers > 0);
      const mx = ex - 7;
      it.mark.setAttribute('d', showMark ? `M${f1(mx)} ${f1(ey - 4.6)}L${f1(mx + 3.6)} ${f1(ey)}L${f1(mx)} ${f1(ey + 4.6)}L${f1(mx - 3.6)} ${f1(ey)}Z` : '');
      it.mark.setAttribute('opacity', (n.dead ? 0.5 : 1) * op);
      it.gene.textContent = n.gene || '';
      it.gene.setAttribute('x', f1(P.x));
      it.gene.setAttribute('y', f1(P.y - P.r - 6));
      it.gene.setAttribute('text-anchor', 'middle');
      it.gene.setAttribute('opacity', op);
      it.letter.textContent = n.kind === 'branch' ? n.letter : '';
      // letter right of the node; a branch with a nested sub-branch carries it left, above its edge
      const parentOf = spec.nodes.some((q) => q.parent === n.id && pos.has(q.id));
      it.letter.setAttribute('x', f1(parentOf ? P.x - P.r - 3 : P.x + P.r + 5));
      it.letter.setAttribute('y', f1(parentOf ? P.y - 5 : P.y + 5));
      it.letter.setAttribute('text-anchor', parentOf ? 'end' : 'start');
      it.letter.setAttribute('opacity', op);
      // hit target (≥ 40 px)
      it.hitC.setAttribute('cx', f1(P.x)); it.hitC.setAttribute('cy', f1(P.y)); it.hitC.setAttribute('r', Math.max(20, P.r + 6));
      it.focus.setAttribute('cx', f1(P.x)); it.focus.setAttribute('cy', f1(P.y)); it.focus.setAttribute('r', f1(P.r + 6));
      it.sel = { type: n.kind, id: n.id };
      it.hit.setAttribute('aria-label', n.aria || n.id);
      it.hit.style.display = n.dead ? 'none' : '';
    }
    for (const it of [...items.values()]) if (!seen.has(it.id)) drop(it);
    // root
    if (!root.rootG) {
      root.rootG = mk('g', {}, gNodes);
      root.rootDisc = mk('circle', { fill: SAND, stroke: 'rgba(255,255,255,0.4)', 'stroke-width': 0.8 }, root.rootG);
      root.rootNuc = mk('circle', { fill: '#8A6B4E', 'fill-opacity': 0.55 }, root.rootG);
      root.rootLabel = mk('text', { class: 't-small ce-label', 'text-anchor': 'middle' }, gLabels);
      root.rootLabel2 = mk('text', { class: 't-small ce-label', 'text-anchor': 'middle' }, gLabels);
      root.stem = mk('path', { fill: 'none', stroke: SAND, 'stroke-width': 2, 'stroke-dasharray': '2 4', 'stroke-linecap': 'round' }, gLinks);
      root.stemLabel = mk('text', { class: 't-small ce-label ce-mut' }, gLabels);
      root.deadNote = mk('text', { class: 't-small ce-label ce-mut', 'text-anchor': 'end' }, gLabels);
      root.trunkSub = mk('text', { class: 't-small ce-label ce-mut', 'text-anchor': 'middle' }, gLabels);
    }
    root.rootG.setAttribute('transform', `translate(${f1(xr)} ${f1(yc)})`);
    root.rootDisc.setAttribute('r', rootR);
    root.rootNuc.setAttribute('r', f1(rootR * 0.36));
    root.rootG.setAttribute('opacity', sel && sel.type !== 'trunk' ? 0.38 : 1);
    root.rootLabel.textContent = 'Original';
    root.rootLabel2.textContent = 'cell';
    root.rootLabel.setAttribute('x', f1(xr)); root.rootLabel.setAttribute('y', f1(yc + rootR + 15));
    root.rootLabel2.setAttribute('x', f1(xr)); root.rootLabel2.setAttribute('y', f1(yc + rootR + 29));
    // the original lineage's "lengthening edge", while no family sits on the center row
    const centerTaken = [...pos.values()].some((q) => q.row === 0 && !q.isRoot);
    const stemTo = Math.min(box.x1 - 90, xr + rootR + (spec.stemLen || 0) * dx);
    const showStem = !centerTaken && stemTo > xr + rootR + 4;
    root.stem.setAttribute('d', showStem ? `M${f1(xr + rootR + 3)} ${f1(yc)}H${f1(stemTo)}` : '');
    root.stemLabel.textContent = showStem && stemTo > xr + rootR + 30 ? 'normal cells' : '';
    root.stemLabel.setAttribute('x', f1(stemTo + 7));
    root.stemLabel.setAttribute('y', f1(yc + 4));
    const nDead = hiddenDead + (spec.extraDead || 0);
    root.deadNote.textContent = nDead ? `+${nDead} more ${nDead === 1 ? 'clone' : 'clones'} died out` : (spec.note || '');
    root.deadNote.setAttribute('x', f1(box.x1));
    root.deadNote.setAttribute('y', f1(box.y1 + (compact ? 4 : 12)));
    // trunk band
    const tEnd = spec.trunkEnd != null ? pos.get(spec.trunkEnd) : null;
    if (tEnd && trunk > 0) {
      const td = `M${f1(xr)} ${f1(yc)}H${f1(tEnd.x)}`;
      trunkGrad.setAttribute('x1', f1(xr)); trunkGrad.setAttribute('x2', f1(tEnd.x));
      trunkBand.setAttribute('d', td);
      trunkSheen.setAttribute('d', `M${f1(xr + rootR)} ${f1(yc - 1.8)}H${f1(tEnd.x - tEnd.r)}`);
      trunkGlow.setAttribute('d', td);
      trunkHitPath.setAttribute('d', `M${f1(xr + rootR + 6)} ${f1(yc)}H${f1(tEnd.x - tEnd.r - 4)}`);
      trunkFocus.setAttribute('d', td);
      const tOp = trunk * (sel && sel.type !== 'trunk' ? 0.38 : 1);
      trunkBand.setAttribute('opacity', f1(tOp * 100) / 100);
      trunkSheen.setAttribute('opacity', f1(tOp * 100) / 100);
      trunkGlow.setAttribute('stroke-opacity', sel && sel.type === 'trunk' ? 0.3 : 0);
      const lx0 = spineX(pos.get(rootN.id)) + 8, lx1 = tEnd.x + tEnd.r + 2;
      const txt = compact ? 'Trunk' : 'TRUNK · in every cancer cell';
      if (trunkLabel.textContent !== txt) { trunkLabel.textContent = txt; trunkLabel._w = 0; }
      if (!trunkLabel._w) { try { trunkLabel._w = Math.round(trunkLabel.getComputedTextLength() || 0); } catch (e) { /* not rendered yet */ } }
      const tw = trunkLabel._w || (compact ? 190 : 210);
      const mid = Math.max(lx0 + tw / 2, Math.min((lx0 + lx1) / 2, lx1 - tw / 2));
      trunkLabel.setAttribute('x', f1(mid));
      trunkLabel.setAttribute('y', f1(yc + (compact ? 22 : 30)));
      trunkLabel.setAttribute('opacity', f1(tOp * 100) / 100);
      root.trunkSub.textContent = !compact && spec.trunkText ? spec.trunkText : '';
      root.trunkSub.setAttribute('x', f1(mid));
      root.trunkSub.setAttribute('y', f1(yc + 45));
      root.trunkSub.setAttribute('opacity', f1(ticks * tOp * 100) / 100);
      trunkHit.style.display = trunk > 0.5 ? '' : 'none';
    } else {
      for (const q of [trunkBand, trunkSheen, trunkGlow, trunkHitPath, trunkFocus]) q.setAttribute('d', '');
      trunkGrad.setAttribute('x1', 0); trunkGrad.setAttribute('x2', 100);
      for (const q of [trunkBand, trunkSheen, trunkLabel, root.trunkSub]) q.setAttribute('opacity', 0);
      trunkGlow.setAttribute('stroke-opacity', 0);
      for (const q of [trunkLabel, root.trunkSub]) { q.setAttribute('x', 0); q.setAttribute('y', 0); }
      trunkLabel.textContent = '';
      root.trunkSub.textContent = '';
      trunkHit.style.display = 'none';
    }
    let maxY = yc + rootR + 30;
    for (const q of pos.values()) maxY = Math.max(maxY, q.y + q.r);
    return {
      pos, yc, xr, rowH, maxY, trunkEnd: tEnd,
      branchPos: spec.nodes.filter((n) => n.kind === 'branch').map((n) => pos.get(n.id)).filter(Boolean),
    };
  }
  return { el: root, render, pattern: (kind) => pat[kind], get spec() { return lastSpec; } };
}

// ============================================================================ FIGURE

export default async function mount(fig, ctx) {
  injectCSS();
  const gsap = ctx.gsap;
  const rm = () => ctx.reducedMotion;
  const params = new URLSearchParams(location.search);
  const TUNE = params.has('ce-tune');

  // ---------------------------------------------------------------- layers
  ctx.setAspect(16 / 9, 0.52);
  const layer = ctx.h('div', { class: 'fig__layer ce-layer' });
  ctx.stage.append(layer);
  const cv = ctx.canvas({ parent: layer });
  const g = cv.g;
  const svg = ctx.createSVG({ viewBox: '0 0 960 540', parent: layer, interactive: true, label: 'Family tree of the clones in the tissue' });
  svg.setAttribute('preserveAspectRatio', 'xMinYMin meet');
  const clock = ctx.ui.clock({ value: 'Year 0' });
  ctx.tag('Illustrative');
  ctx.tag('Time compressed');

  // card (in-stage HTML)
  const card = ctx.h('div', { class: 'ce-card', hidden: true, role: 'status', 'aria-live': 'polite' });
  const cardBody = ctx.h('div');
  const cardClose = ctx.h('button', { class: 'ce-card__close', type: 'button', 'aria-label': 'Close' }, '×');
  card.append(cardBody, cardClose);
  ctx.stage.append(card);

  // ---------------------------------------------------------------- layout state
  let L = null;               // current layout
  let gridKey = null;
  const story = { t: 0, trunk: 0, ticks: 0, hint: 0, free: 0 };

  function computeLayout(W, H) {
    const tall = W < TALL_BELOW;
    const G = GRIDS[tall ? 'tall' : 'wide'];
    const pad = tall ? 10 : 16;
    const top = tall ? 64 : 52;
    let s, ox, oy, gw, gh, tree, meter;
    const gridW = (k) => (G.cols + 0.5) * k;
    const gridH = (k) => ((G.rows - 1) * 0.866 + 1.04) * k;
    if (!tall) {
      const availW = W * 0.6 - pad;
      const availH = H - top - pad;
      s = Math.min(availW / (G.cols + 0.5), availH / ((G.rows - 1) * 0.866 + 1.04));
      gw = gridW(s); gh = gridH(s);
      ox = pad + (availW - gw) / 2; oy = top + (availH - gh) / 2;
      const rx0 = pad + availW + 26, rx1 = W - pad - 6;
      meter = { x0: rx0, x1: rx1, y0: H - 132, y1: H - pad };
      tree = { x0: rx0, x1: rx1, y0: top + 6, y1: meter.y0 - 22 };
    } else {
      // portrait: tissue on top (capped width on tablets), tree below, counters as text
      s = Math.min(W - 2 * pad, TALL_MAX_W) / (G.cols + 0.5);
      gw = gridW(s); gh = gridH(s);
      ox = (W - gw) / 2; oy = top;
      const tw = Math.min(W - 2 * pad - 4, 620), tx = (W - tw) / 2;
      tree = { x0: tx, x1: tx + tw, y0: oy + gh + 14, y1: oy + gh + 14 + 196 };
      meter = { x0: Math.max(pad, tx - 2), x1: W - pad, y0: tree.y1 + 6, y1: tree.y1 + 70 };
    }
    return { W, H, tall, G, s, ox, oy, gw, gh, tree, meter, cell: s * 0.6 };
  }
  const tallHeight = (W) => {
    const G = GRIDS.tall;
    const s = Math.min(W - 20, TALL_MAX_W) / (G.cols + 0.5);
    return Math.round(64 + ((G.rows - 1) * 0.866 + 1.04) * s + 14 + 196 + 6 + 64 + 8);
  };

  const siteXY = (i) => {
    const c = i % L.G.cols, r = (i / L.G.cols) | 0;
    return [L.ox + L.s * (0.5 + c + (r & 1) * 0.5), L.oy + L.s * (0.52 + r * 0.866)];
  };

  // ---------------------------------------------------------------- models
  let storyM = null, freeM = null;
  let snaps = new Map();
  let storyEv = [];
  let freeSeed = 1009;
  let freeFaulty = false;
  let freeOutcome = null;     // { cancerYear } once decided this run
  const tally = { normal: [0, 0], faulty: [0, 0] };   // [runs, with cancer]
  const fx = [];             // sparks: { x, y, t, life, kind, label }
  let fxTime = 0;
  let collectFx = false;

  const onEvent = (j, k, label) => {
    if (!collectFx || rm()) return;
    const fast = story.free >= 1 && speed >= 16;
    if (label != null) {
      if (fast) { let n = 0; for (const e of fx) if (e.kind === 'driver') n++; if (n >= 8) return; }
      // story drivers are named; free-play drivers say "driver" (at 16× only the gold ring shows)
      fx.push({ site: j, t: fxTime, life: label ? 2.4 : fast ? 0.9 : 1.6, kind: 'driver', label: fast ? '' : label || 'driver' });
      return;
    }
    if (k > 0) {
      let n = 0;
      for (const e of fx) if (e.kind === 'pas') n++;
      const cap = (L && L.tall ? 0.55 : 1) * (story.free < 1 ? 28 : speed >= 16 ? 12 : speed >= 4 ? 22 : 28);
      if (n < cap) fx.push({ site: j, t: fxTime, life: 0.55, kind: 'pas' });
    }
  };

  function muDFor(G) {
    const nEpi = G.cols * G.epiRows;
    return 1 / (G.driverYears * BASE_DIV * TICKS_PER_YEAR * nEpi);
  }
  function makeStory() {
    const G = L.G;
    storyM = createTissue({ cols: G.cols, rows: G.rows, epiRows: G.epiRows, seed: G.storySeed, randomDrivers: false, onEvent });
    storyEv = storyEvents(G);
    snaps = new Map([[0, storyM.snapshot()]]);
    // run the whole story once (≈ 2,600 ticks, a few tens of ms): snapshots at every step end
    storyM.setQuiet(true);
    runStoryTo(Math.round(STEP_END[STEP_END.length - 1] * TICKS_PER_YEAR));
    storyM.restore(snaps.get(0));
    storyM.setQuiet(false);
  }
  function runStoryTo(tick) {
    while (storyM.tick < tick) {
      for (const ev of storyEv) if (ev.tick === storyM.tick) applyStoryEvent(storyM, ev);
      storyM.step();
      const t = storyM.tick;
      if (t % 200 === 0 || STEP_END.some((y) => Math.round(y * TICKS_PER_YEAR) === t)) if (!snaps.has(t)) snaps.set(t, storyM.snapshot());
    }
  }
  function syncStory() {
    if (!storyM) return;
    const target = Math.round(story.t * TICKS_PER_YEAR);
    if (target === storyM.tick) return;
    const jump = target < storyM.tick || target - storyM.tick > 12;
    if (target < storyM.tick || target - storyM.tick > 400) {
      let best = 0;
      for (const k of snaps.keys()) if (k <= target && k > best) best = k;
      if (best > storyM.tick || target < storyM.tick) storyM.restore(snaps.get(best));
    }
    collectFx = !jump;
    if (jump) fx.length = 0;
    runStoryTo(target);
    collectFx = false;
  }
  function makeFree() {
    const G = L.G;
    freeM = createTissue({ cols: G.cols, rows: G.rows, epiRows: G.epiRows, seed: freeSeed, muD: muDFor(G), faulty: freeFaulty, onEvent });
    freeOutcome = null;
    fx.length = 0;
  }

  // ---------------------------------------------------------------- tree spec from a model
  function treeSpec(m, withBranches) {
    const S = m.S;
    const nodes = [];
    let normalMut = 0, normalN = 0;
    for (const i of S.occList) if (S.drv[i] === 0) { normalMut += S.pas[i]; normalN++; }
    const cancer = S.cancer;
    nodes.push({ id: 'n0', num: 0, parent: null, kind: 'root', size: S.clones[0].size, drivers: 0 });
    let focus = null;
    // a family is extinct only when neither it nor any of its sub-families has cells left
    const linSize = S.clones.map((c) => c.size);
    for (let k = S.clones.length - 1; k > 0; k--) linSize[S.clones[k].parent] += linSize[k];
    for (const c of S.clones) {
      if (c.id === 0) continue;
      const gone = linSize[c.id] === 0;
      if (c.depth >= 4) continue;      // drivers that arise inside a cancer show up as (part of) its branches
      nodes.push({
        id: `n${c.id}`, num: c.id, parent: `n${c.parent}`, kind: 'clone', size: c.size, drivers: c.depth, dead: gone,
        gene: c.label || '', t0: c.t0, passengers: c.p0 - S.clones[c.parent].p0,
        aria: `${c.label ? `Clone founded by ${c.label}` : 'A driver clone'}: ${c.depth} driver${c.depth > 1 ? 's' : ''}, ${gone ? 'died out' : `${c.size} cells`}`,
      });
      // the main lineage: deepest living family; the story's named lineage wins ties, then size
      const better = (a, b) => a.depth - b.depth || (a.label ? 1 : 0) - (b.label ? 1 : 0) || a.size - b.size;
      if (!gone && (!focus || better(c, focus) > 0)) focus = c;
    }
    if (cancer && withBranches) {
      for (const [k, b] of cancer.branches.entries()) {
        nodes.push({
          id: `b${b.node.id}`, parent: b.parent >= 0 ? `b${cancer.branches[b.parent].node.id}` : `n${cancer.clone}`, kind: 'branch',
          num: b.node.id, size: b.size, drivers: b.drivers, letter: b.letter, letterIndex: k, order: k, color: branchHue(b.hue),
          passengers: b.passengers, t0: b.t,
          aria: `Branch ${b.letter}: in ${b.size} of ${cancer.size} cancer cells. Light them up.`,
        });
      }
    }
    return {
      nodes,
      trunkEnd: cancer && linSize[cancer.clone] > 0 ? `n${cancer.clone}` : null,
      focus: focus ? `n${focus.id}` : null,
      stemLen: normalN ? normalMut / normalN / 12 : 0,       // ≈ 1 column after 5 model years
      trunkText: cancer ? `${S.clones[cancer.clone].depth} drivers + ${S.clones[cancer.clone].p0} passengers` : '',
      note: S.tick === 0 && S.clones.length === 1 ? 'Clones founded by drivers will appear here.' : '',
    };
  }

  // ---------------------------------------------------------------- sprites
  let sheet = null;
  let sheetS = 0;
  async function buildSprites() {
    const s = L.s;
    if (sheet && Math.abs(s - sheetS) / sheetS < 0.12) return;
    const r = s * 0.6;
    const base = { receptors: false, glow: false, stage: 'dark' };
    const seeds = [1, 2, 3, 4];
    const [n0, n2, c0, c1, c2, c3, c4, fib] = await Promise.all([
      Promise.all(seeds.map((seed) => sprite('healthyCell', { ...base, r, shape: 'polygon', sides: 6, seed }))),
      Promise.all(seeds.map((seed) => sprite('healthyCell', { ...base, r: r * 1.04, shape: 'polygon', sides: 6, seed, color: BLEND }))),
      ...[0, 1, 2, 3, 4].map((clone) => Promise.all([1, 2, 3].map((seed) => sprite('cancerCell', { ...base, r: r * 1.02, seed: seed + clone * 3, clone })))),
      Promise.all([1, 2, 3].map((seed) => sprite('fibroblast', { r: s * 2.2, seed, angle: [4, -8, 12][seed - 1], stage: 'dark', glow: false }))),
    ]);
    sheet = { n0, n2, c: [c0, c1, c2, c3, c4], fib, r };
    sheetS = s;
  }
  // canvas hatch tiles (same four patterns as the tree)
  const hatchTiles = {};
  function hatchPattern(kind) {
    const key = `${kind}|${cv.dpr}`;
    if (hatchTiles[key]) return hatchTiles[key];
    const d = cv.dpr, n = Math.round(6 * d);
    const t = document.createElement('canvas');
    t.width = n; t.height = n;
    const q = t.getContext('2d');
    q.scale(d, d);
    q.strokeStyle = 'rgba(255,255,255,0.75)';
    q.fillStyle = 'rgba(255,255,255,0.85)';
    q.lineWidth = 1.2;
    q.beginPath();
    if (kind === 'stripes') { q.moveTo(-1, 1); q.lineTo(1, -1); q.moveTo(0, 6); q.lineTo(6, 0); q.moveTo(5, 7); q.lineTo(7, 5); q.stroke(); }
    if (kind === 'bars') { q.moveTo(0, 3); q.lineTo(6, 3); q.stroke(); }
    if (kind === 'cross') { q.lineWidth = 1; q.moveTo(0, 0); q.lineTo(6, 6); q.moveTo(6, 0); q.lineTo(0, 6); q.stroke(); }
    if (kind === 'dots') { q.arc(3, 3, 1.3, 0, Math.PI * 2); q.fill(); }
    const p = g.createPattern(t, 'repeat');
    p.setTransform?.(new DOMMatrix().scale(1 / d));
    hatchTiles[key] = p;
    return p;
  }

  // ---------------------------------------------------------------- static background (stroma, fibers)
  let bg = null;
  let fibs = [];
  function buildBackground() {
    const { G, s, ox, oy } = L;
    const yB = oy + s * (0.52 + (G.epiRows - 0.5) * 0.866);
    L.yB = yB;
    const off = document.createElement('canvas');
    off.width = Math.round(cv.width * cv.dpr); off.height = Math.round(cv.height * cv.dpr);
    const q = off.getContext('2d');
    q.scale(cv.dpr, cv.dpr);
    // stroma: a softer, warmer-dark band with faint fibres
    const x0 = ox - s * 0.2, x1 = ox + L.gw + s * 0.2, y1 = oy + L.gh + s * 0.1;
    const grd = q.createLinearGradient(0, yB, 0, y1);
    grd.addColorStop(0, 'rgba(120,110,150,0.10)');
    grd.addColorStop(1, 'rgba(120,110,150,0.02)');
    q.fillStyle = grd;
    q.beginPath(); q.roundRect ? q.roundRect(x0, yB, x1 - x0, y1 - yB, 8) : q.rect(x0, yB, x1 - x0, y1 - yB); q.fill();
    const R = seededRng(77);
    q.lineCap = 'round';
    for (let k = 0; k < 26; k++) {
      const y = yB + 6 + R() * (y1 - yB - 10);
      const xa = x0 + R() * (x1 - x0) * 0.8, len = s * (3 + R() * 6);
      q.strokeStyle = `rgba(160,170,205,${0.06 + R() * 0.08})`;
      q.lineWidth = 0.8 + R() * 0.8;
      q.beginPath();
      q.moveTo(xa, y);
      q.bezierCurveTo(xa + len * 0.3, y - s * 0.5 * (R() - 0.5), xa + len * 0.7, y + s * 0.5 * (R() - 0.5), xa + len, y + s * 0.3 * (R() - 0.5));
      q.stroke();
    }
    bg = off;
    // fibroblasts: scenery in the stroma (pushed aside when cancer cells arrive)
    fibs = [];
    const stromaRows = G.rows - G.epiRows;
    const nF = L.tall ? 4 : 7;
    for (let k = 0; k < nF; k++) {
      const col = Math.max(2, Math.min(G.cols - 3, Math.round(((k + 0.5) / nF) * G.cols + (R() - 0.5) * 2)));
      const row = G.epiRows + 1 + Math.floor(R() * Math.max(1, stromaRows - 2));
      const i = Math.min(G.rows - 1, row) * G.cols + Math.max(0, Math.min(G.cols - 1, col));
      fibs.push({ i, v: k % 3, dx: (R() - 0.5) * s * 0.6, dy: (R() - 0.5) * s * 0.4 });
    }
  }

  // ---------------------------------------------------------------- render: tissue
  let highlight = null;       // Set of sites to light up (selection)
  let veil = false;           // pinned selections dim everything else
  let hover = null;          // transient (mouse-over) cell
  const hash = (i, t) => ((i * 73856093) ^ (t * 19349663)) >>> 0;
  const HEX_ANG = [0, 180, 240, 300, 120, 60].map((a) => (a * Math.PI) / 180);   // E, W, NW, NE, SW, SE

  function drawTissue(m, alpha, opts = {}) {
    if (!sheet || !m) return;
    const S = m.S, { s } = L;
    const branchesOn = opts.branches;
    g.save();
    g.globalAlpha = alpha;
    g.drawImage(bg, 0, 0, cv.width, cv.height);
    // fibroblasts (fade where the cancer has arrived)
    for (const f of fibs) {
      const [x, y] = siteXY(f.i);
      const a = S.occ[f.i] ? 0.12 : 0.7;
      drawSprite(g, sheet.fib[f.v], x + f.dx, y + f.dy, { alpha: a * alpha });
    }
    // boundary layer: glowing line, broken where cancer cells have crossed
    const { G } = L;
    const yB = L.yB;
    const broken = new Uint8Array(G.cols + 1);
    for (let c = 0; c < G.cols; c++) {
      const below = G.epiRows * G.cols + c;
      if (S.occ[below]) { broken[c] = 1; }
    }
    g.lineCap = 'round';
    for (const [w, a] of [[6, 0.1], [2.6, 0.22], [1.3, 0.85]]) {
      g.strokeStyle = w > 2 ? 'rgba(170,190,240,1)' : LINE;
      g.globalAlpha = alpha * a;
      g.lineWidth = w;
      g.beginPath();
      let pen = false;
      for (let c = 0; c < G.cols; c++) {
        const xa = L.ox + c * s, xb = xa + (c === G.cols - 1 ? s * 1.5 : s);
        if (broken[c]) { pen = false; continue; }
        if (!pen) { g.moveTo(xa + (c > 0 && broken[c - 1] ? s * 0.32 : 0), yB); pen = true; }
        g.lineTo(c < G.cols - 1 && broken[c + 1] ? xb - s * 0.32 : xb, yB);
      }
      g.stroke();
    }
    g.globalAlpha = alpha;
    // cells
    const n0 = sheet.n0, n2 = sheet.n2, cc = sheet.c;
    const rimPath = new Path2D();
    const hatchPaths = [];
    const list = S.occList;
    const sel = highlight;
    for (let q = 0; q < list.length; q++) {
      const i = list[q];
      const d = S.drv[i];
      const [x, y] = siteXY(i);
      const h = hash(i, S.born[i]);
      if (d === 0) drawSprite(g, n0[h & 3], x, y, {});
      else if (d === 1) { drawSprite(g, n0[h & 3], x, y, {}); rimPath.moveTo(x + s * 0.47, y); rimPath.arc(x, y, s * 0.47, 0, Math.PI * 2); }
      else if (d === 2) drawSprite(g, n2[h & 3], x + (((h >> 3) & 7) - 3.5) * s * 0.02, y + (((h >> 6) & 7) - 3.5) * s * 0.02, { scale: 1.1 });
      else {
        const mb = branchesOn ? S.memb[i] : -1;
        const hue = mb >= 0 && S.cancer && S.cancer.branches[mb] ? S.cancer.branches[mb].hue : 0;
        drawSprite(g, cc[hue][h % 3], x + (((h >> 3) & 7) - 3.5) * s * 0.03, y + (((h >> 6) & 7) - 3.5) * s * 0.03, { scale: 1.08, rotation: ((h >> 9) & 63) / 10 });
        if (mb >= 0) { (hatchPaths[mb] ||= new Path2D()).moveTo(x + s * 0.3, y); hatchPaths[mb].arc(x, y, s * 0.3, 0, Math.PI * 2); }
      }
    }
    g.strokeStyle = VIOLET;
    g.globalAlpha = alpha * 0.95;
    g.lineWidth = Math.max(1.3, s * 0.085);
    g.stroke(rimPath);
    if (branchesOn && S.cancer) {
      S.cancer.branches.forEach((b, k) => {
        if (!hatchPaths[k]) return;
        g.globalAlpha = alpha * 0.62;
        g.fillStyle = hatchPattern(hatchOf(k));
        g.fill(hatchPaths[k]);
      });
      // branch letters at each branch's centroid
      g.globalAlpha = alpha;
      g.font = `700 ${L.tall ? 13 : 14}px Inter, system-ui, sans-serif`;
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      S.cancer.branches.forEach((b, k) => {
        let sx = 0, sy = 0, n = 0;
        for (const i of list) if (S.memb[i] === k) { const [x, y] = siteXY(i); sx += x; sy += y; n++; }
        if (n < 6) return;
        const x = sx / n, y = sy / n;
        g.fillStyle = 'rgba(12,16,36,0.78)';
        g.beginPath(); g.arc(x, y, 10, 0, Math.PI * 2); g.fill();
        g.strokeStyle = branchHue(b.hue); g.lineWidth = 1.5; g.stroke();
        g.fillStyle = '#fff';
        g.fillText(b.letter, x, y + 0.5);
      });
    }
    // selection: veil everything else, re-draw the chosen cells, outline them
    if (sel && sel.size) {
      g.globalAlpha = alpha * (veil ? 0.55 : 0);
      g.fillStyle = '#070A18';
      g.fillRect(L.ox - s, L.oy - s, L.gw + 2 * s, L.gh + 2 * s);
      g.globalAlpha = alpha;
      for (const i of sel) {
        if (!S.occ[i]) continue;
        const d = S.drv[i];
        const [x, y] = siteXY(i);
        const h = hash(i, S.born[i]);
        if (d >= 3) {
          const mb = branchesOn ? S.memb[i] : -1;
          const hue = mb >= 0 && S.cancer && S.cancer.branches[mb] ? S.cancer.branches[mb].hue : 0;
          drawSprite(g, cc[hue][h % 3], x + (((h >> 3) & 7) - 3.5) * s * 0.03, y + (((h >> 6) & 7) - 3.5) * s * 0.03, { scale: 1.08, rotation: ((h >> 9) & 63) / 10 });
        } else drawSprite(g, d === 2 ? n2[h & 3] : n0[h & 3], x, y, { scale: d === 2 ? 1.1 : 1 });
      }
      const R = s / Math.sqrt(3) * 1.02;
      const path = new Path2D();
      for (const i of sel) {
        if (!S.occ[i]) continue;
        const [x, y] = siteXY(i);
        for (let q = 0; q < m.nbN[i]; q++) {
          if (sel.has(m.nb[i * 6 + q])) continue;
          const a = HEX_ANG[m.nbDir[i * 6 + q]];
          path.moveTo(x + R * Math.cos(a - Math.PI / 6), y + R * Math.sin(a - Math.PI / 6));
          path.lineTo(x + R * Math.cos(a + Math.PI / 6), y + R * Math.sin(a + Math.PI / 6));
        }
      }
      g.lineCap = 'round';
      g.strokeStyle = 'rgba(255,255,255,0.28)'; g.lineWidth = 5; g.stroke(path);
      g.strokeStyle = '#FFFFFF'; g.lineWidth = 1.6; g.stroke(path);
    }
    g.restore();
  }

  function drawFx(m, alpha) {
    if (!fx.length || !m) return;
    const { s } = L;
    g.save();
    for (let k = fx.length - 1; k >= 0; k--) {
      const e = fx[k];
      const p = (fxTime - e.t) / e.life;
      if (p >= 1 || p < 0) { fx.splice(k, 1); continue; }
      const [x, y] = siteXY(e.site);
      if (e.kind === 'pas') {
        // passenger: a small pale ring swells and fades (a soft pulse, never a flash)
        const r = s * (0.12 + 0.22 * p);
        const env = Math.sin(Math.PI * p);
        g.globalAlpha = alpha * 0.75 * env;
        g.strokeStyle = PALE; g.lineWidth = 1.1;
        g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.stroke();
        g.globalAlpha = alpha * 0.55 * env;
        g.fillStyle = PALE;
        g.beginPath(); g.arc(x, y, s * 0.06, 0, Math.PI * 2); g.fill();
      } else {
        const q = Math.min(1, p * 1.6);
        const r = s * (0.35 + 0.9 * (1 - (1 - q) ** 3));
        g.globalAlpha = alpha * (1 - q) * 0.95;
        g.strokeStyle = GOLD; g.lineWidth = 2;
        g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.stroke();
        g.globalAlpha = alpha * Math.max(0, 1 - p * 2.5);
        g.fillStyle = '#FFF6DA';
        g.beginPath(); g.arc(x, y, s * 0.2, 0, Math.PI * 2); g.fill();
        // floating label
        const la = p < 0.12 ? p / 0.12 : p > 0.7 ? (1 - p) / 0.3 : 1;
        g.globalAlpha = alpha * la;
        if (!e.label) continue;
        g.font = `650 ${L.tall ? 13 : 14}px Inter, system-ui, sans-serif`;
        g.textAlign = 'center'; g.textBaseline = 'alphabetic';
        const ly = y - s * 0.9 - p * s * 0.9;
        g.lineWidth = 3.5; g.strokeStyle = 'rgba(8,11,26,0.85)'; g.lineJoin = 'round';
        g.strokeText(e.label, x, ly);
        g.fillStyle = '#FFE7A8';
        g.fillText(e.label, x, ly);
      }
    }
    g.restore();
  }

  // ---------------------------------------------------------------- render: overlay (tree, meter, labels)
  const gTreeWrap = ctx.svg('g', {}, svg);
  let selected = null;        // { type: 'trunk' | 'branch' | 'clone' | 'cell', id, site }
  let hintStage = 'trunk';
  const tree = createCloneTree(ctx, gTreeWrap, { onSelect: (sel) => select(sel) });
  // hint pill
  const hint = ctx.svg('g', { class: 'ce-hint', opacity: 0 }, svg);
  const hintLead = ctx.svg('path', { fill: 'none', stroke: GOLD, 'stroke-opacity': 0.7, 'stroke-width': 1.2, 'stroke-dasharray': '2 3' }, hint);
  const hintRect = ctx.svg('rect', { rx: 12, ry: 12, height: 26 }, hint);
  const hintText = ctx.svg('text', { class: 't-small ce-label', 'text-anchor': 'middle' }, hint);
  // meter (counters strip)
  const gMeter = ctx.svg('g', {}, svg);
  const meterRoot = chartRoot(gMeter, { theme: 'stage-dark' });
  const meterTitle = ctx.svg('text', { class: 't-caps ce-label' }, meterRoot);
  const meterTrack = ctx.svg('rect', { rx: 3, ry: 3, height: 6, fill: 'rgba(233,236,246,0.12)' }, meterRoot);
  const meterBandG = ctx.svg('g', {}, meterRoot);
  const meterFill = ctx.svg('rect', { rx: 3, ry: 3, height: 6, fill: VIOLET, 'fill-opacity': 0.55 }, meterRoot);
  const meterMark = ckMarker(meterRoot, { shape: 'diamond', r: 7, color: '#F3E6FF' });
  const meterWord = ctx.svg('text', { class: 't-label ce-label', style: 'font-weight:650' }, meterRoot);
  const meterEnds = [ctx.svg('text', { class: 't-small ce-label ce-mut' }, meterRoot), ctx.svg('text', { class: 't-small ce-label ce-mut', 'text-anchor': 'end' }, meterRoot)];
  const meterReal = ctx.svg('text', { class: 't-small ce-label' }, meterRoot);
  const meterSrc = ctx.svg('text', { class: 'ce-label ce-mut', style: 'font-size:12px' }, meterRoot);
  let meterGeom = null;
  // tissue labels
  const boundaryLabel = ctx.svg('text', { class: 't-small t-halo ce-label', 'text-anchor': 'end' }, svg);
  const stromaLabel = ctx.svg('text', { class: 't-caps t-halo ce-label', 'text-anchor': 'end' }, svg);

  function layoutMeter() {
    const M = L.meter;
    meterBandG.replaceChildren();
    if (L.tall) {
      meterGeom = null;
      meterTitle.setAttribute('x', M.x0); meterTitle.setAttribute('y', M.y0 + 14);
      meterTitle.textContent = 'Cells carrying a driver';
      for (const el of [meterTrack, meterFill]) el.setAttribute('width', 0);
      gsap.set(meterMark, { opacity: 0 });
      meterEnds.forEach((t) => (t.textContent = ''));
      meterReal.setAttribute('x', M.x0); meterReal.setAttribute('y', M.y0 + 52); meterReal.setAttribute('text-anchor', 'start');
      meterReal.textContent = 'Measured in normal eyelid skin: 18–32%';
      meterSrc.setAttribute('x', M.x0); meterSrc.setAttribute('y', M.y0 + 68);
      meterSrc.textContent = 'Martincorena et al., Science 2015';
      meterWord.setAttribute('x', M.x0); meterWord.setAttribute('y', M.y0 + 33);
      return;
    }
    const x0 = M.x0, x1 = M.x1;
    // polish B13: the scale runs to "all", so the word "most" (faulty repair, late years) never
    // sits against an end labeled "half"
    const sc = ckScale({ domain: [0, 1], range: [x0, x1] });
    const ty = M.y0 + 50;
    meterGeom = { sc, ty };
    meterTitle.setAttribute('x', x0); meterTitle.setAttribute('y', M.y0 + 12);
    meterTitle.textContent = 'Cells carrying a driver';
    meterWord.setAttribute('x', x0); meterWord.setAttribute('y', M.y0 + 33);
    meterTrack.setAttribute('x', x0); meterTrack.setAttribute('y', ty - 3); meterTrack.setAttribute('width', x1 - x0);
    meterFill.setAttribute('x', x0); meterFill.setAttribute('y', ty - 3);
    const bd = ckBand(meterBandG, { x0: sc(0.18), x1: sc(0.32), y0: ty - 9, y1: ty + 9, color: '#E8EBF8', opacity: 0.1 });
    // hatch from the tree's own (deterministically named) pattern: measured data, not model output
    ctx.svg('rect', { x: sc(0.18), y: ty - 9, width: sc(0.32) - sc(0.18), height: 18, fill: tree.pattern('stripes'), opacity: 0.32 }, bd.el);
    gsap.set(meterMark, { opacity: 1, y: ty });
    meterEnds[0].setAttribute('x', x0); meterEnds[0].setAttribute('y', ty + 24); meterEnds[0].textContent = 'none';
    meterEnds[1].setAttribute('x', x1); meterEnds[1].setAttribute('y', ty + 24); meterEnds[1].textContent = 'all';
    meterReal.setAttribute('x', sc(0.25)); meterReal.setAttribute('y', ty + 24); meterReal.setAttribute('text-anchor', 'middle');
    meterReal.textContent = 'measured: 18–32%';
    meterSrc.setAttribute('x', x0); meterSrc.setAttribute('y', ty + 46);
    meterSrc.textContent = 'Measured in normal eyelid skin (Martincorena et al., Science 2015)';
  }

  function updateMeter(m, alpha) {
    const f = m ? m.driverFraction() : 0;
    const word = driverWords(f);
    gMeter.setAttribute('opacity', alpha);
    if (L.tall) { meterWord.textContent = `${word[0].toUpperCase()}${word.slice(1)} (model)`; return; }
    meterWord.textContent = `Model: ${word}`;
    const { sc, ty } = meterGeom;
    const x = sc(Math.min(1, f));
    meterFill.setAttribute('width', Math.max(0, Math.round((x - L.meter.x0) * 10) / 10));
    gsap.set(meterMark, { x: Math.round(x * 10) / 10, y: ty });
  }

  // ---------------------------------------------------------------- the frame
  const mode = () => (story.free >= 1 ? 'free' : 'story');

  function render() {
    if (!L || !sheet) return;
    cv.clear();
    const f = story.free;
    const showStory = f < 0.5;
    const m = showStory ? storyM : freeM;
    const a = showStory ? 1 - 2 * f : 2 * f - 1;
    const branchesOn = showStory ? story.ticks > 0.5 : true;
    if (selected || hover) refreshSelection(m); else highlight = null;
    drawTissue(m, a, { branches: branchesOn });
    drawFx(m, a);
    // clock
    const yr = Math.floor(m.tick / TICKS_PER_YEAR);
    const txt = `Year ${yr}`;
    if (clock.value !== txt) clock.set(txt);
    // tree
    const spec = treeSpec(m, branchesOn);
    const res = tree.render(spec, L.tree, {
      compact: L.tall,
      ticks: showStory ? story.ticks : 1,
      trunk: showStory ? story.trunk : 1,
      selected: selected && selected.type !== 'cell' ? selected : null,
    });
    gTreeWrap.setAttribute('opacity', Math.round(a * 100) / 100);
    // hint (step 6)
    const hintOn = showStory && story.hint > 0 && res.trunkEnd;
    const hintLabel = hintStage === 'trunk' ? 'Tap the trunk' : hintStage === 'branch' && res.branchPos.length ? 'Now tap a branch' : '';
    if (hintOn && hintLabel) {
      hintText.textContent = hintLabel;
      const w = hintLabel.length * 7.4 + 28;
      const hy = Math.min(L.tree.y1 - 6, res.maxY + 34);
      let hx, ty;
      if (hintStage === 'trunk') { hx = (res.xr + res.trunkEnd.x) / 2; ty = res.yc + (L.tall ? 26 : 41); }
      else {
        const bp = res.branchPos.reduce((a2, b) => (b.y > a2.y ? b : a2));
        hx = bp.x; ty = bp.y + bp.r + 4;
      }
      const px = Math.max(L.tree.x0 + w / 2, Math.min(L.tree.x1 - w / 2, hx));
      hintRect.setAttribute('x', Math.round(px - w / 2)); hintRect.setAttribute('y', Math.round(hy - 18)); hintRect.setAttribute('width', Math.round(w));
      hintText.setAttribute('x', Math.round(px)); hintText.setAttribute('y', Math.round(hy));
      hintLead.setAttribute('d', `M${Math.round(hx)} ${Math.round(hy - 19)}V${Math.round(ty)}`);
      hint.setAttribute('opacity', Math.round(story.hint * a * 100) / 100);
    } else {
      hint.setAttribute('opacity', 0);
      for (const [el, k] of [[hintRect, 'x'], [hintRect, 'y'], [hintRect, 'width'], [hintText, 'x'], [hintText, 'y']]) el.setAttribute(k, 0);
      hintLead.setAttribute('d', '');
    }
    // meter + labels
    updateMeter(m, Math.round(a * 100) / 100);
    const showLabels = a;
    boundaryLabel.setAttribute('x', Math.round(L.ox + L.gw - 4));
    boundaryLabel.setAttribute('y', Math.round(L.yB + 16));
    boundaryLabel.textContent = 'basement membrane';
    boundaryLabel.setAttribute('opacity', Math.round(showLabels * 100) / 100);
    stromaLabel.setAttribute('x', Math.round(L.ox + L.gw - 4));
    stromaLabel.setAttribute('y', Math.round(L.oy + L.gh - 6));
    stromaLabel.textContent = 'Tissue beneath';
    stromaLabel.setAttribute('opacity', Math.round(showLabels * 100) / 100);
  }

  let rafPending = false;
  function invalidate() {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => { rafPending = false; render(); positionCard(); });
  }

  // ---------------------------------------------------------------- selection + card
  const curModel = () => (story.free < 0.5 ? storyM : freeM);
  function siteSetFor(sel, m) {
    const S = m.S;
    const set = new Set();
    if (!sel) return set;
    if (sel.type === 'trunk') { for (const i of S.occList) if (S.lin[i] && S.cancer && m.rootOf(S.lin[i]) === S.cancer.root) set.add(i); }
    else if (sel.type === 'branch') {
      const k = S.cancer ? S.cancer.branches.findIndex((b) => `b${b.node.id}` === sel.id) : -1;
      if (k < 0) return set;
      // a branch includes its nested sub-branches
      const inB = (mb) => { for (let x = mb; x >= 0; x = S.cancer.branches[x].parent) if (x === k) return true; return false; };
      for (const i of S.occList) if (S.memb[i] >= 0 && inB(S.memb[i])) set.add(i);
    } else if (sel.type === 'clone') {
      const id = Number(sel.id.slice(1));
      for (const i of S.occList) if (S.clone[i] === id) set.add(i);
    } else if (sel.type === 'cell') {
      const c = S.clone[sel.site];
      if (c !== 0 && S.occ[sel.site]) for (const i of S.occList) if (S.clone[i] === c) set.add(i);
    }
    return set;
  }
  const names = (m, cloneId) => {
    const out = [];
    for (let c = m.S.clones[cloneId]; c && c.id !== 0; c = m.S.clones[c.parent]) out.unshift(c.label || 'a driver');
    return out;
  };
  const fracWords = (f) => (f >= 0.97 ? 'all' : f > 0.7 ? 'most' : f > 0.42 ? 'about half' : f > 0.29 ? 'about a third' : f > 0.16 ? 'about a quarter' : f > 0.07 ? 'about one in ten' : 'a few');
  function cardHTML(sel, m) {
    const S = m.S;
    if (sel.type === 'trunk' && S.cancer) {
      const cl = S.clones[S.cancer.clone];
      const nm = names(m, S.cancer.clone);
      return `<p class="ce-card__kicker">Trunk</p><p><strong>In every cancer cell</strong> (${S.cancer.size} of ${S.cancer.size}): ${nm.length} drivers (${nm.join(', ')}) and ${cl.p0} passengers, inherited from the cell that founded the cancer.</p>`;
    }
    if (sel.type === 'branch' && S.cancer) {
      const b = S.cancer.branches.find((x) => `b${x.node.id}` === sel.id);
      if (!b) return '';
      const f = b.size / Math.max(1, S.cancer.size);
      return `<p class="ce-card__kicker"><span class="ce-swatch" style="background:${branchHue(b.hue)}"></span>Branch ${b.letter}</p><p><strong>In only some cancer cells</strong> (${b.size} of ${S.cancer.size}, ${fracWords(f)}): ${b.passengers} passengers${b.drivers ? ` and ${b.drivers} new driver${b.drivers > 1 ? 's' : ''}` : ''} on top of the trunk.</p>`;
    }
    if (sel.type === 'clone') {
      const c = S.clones[Number(sel.id.slice(1))];
      if (!c) return '';
      const nm = names(m, c.id);
      if (c.size === 0) {
        let sub = 0;
        const desc = new Set([c.id]);
        for (const x of S.clones) if (desc.has(x.parent)) { desc.add(x.id); sub += x.size; }
        if (sub) return `<p class="ce-card__kicker">Clone founded by ${c.label || 'a driver'}</p><p>Every surviving descendant has since picked up more drivers: <strong>${sub} cells</strong> in its subclones.</p>`;
        return `<p class="ce-card__kicker">A clone that died out</p><p>Founded by ${c.label || 'a driver'} in year ${Math.floor(c.t0 / TICKS_PER_YEAR)}; gone by year ${Math.floor(c.dead / TICKS_PER_YEAR)}, by chance.</p>`;
      }
      return `<p class="ce-card__kicker">Clone founded by ${c.label || 'a driver'}</p><p>${c.depth} driver${c.depth > 1 ? 's' : ''} (${nm.join(', ')}). <strong>${c.size} cells</strong> today.</p>`;
    }
    if (sel.type === 'cell') {
      const i = sel.site;
      if (!S.occ[i]) return '';
      const d = S.drv[i], p = S.pas[i];
      const nm = d ? names(m, S.clone[i]) : [];
      const fam = d ? S.clones[S.clone[i]].size : null;
      const kind = d >= 3 ? 'Cancer cell' : d === 2 ? 'Cell with two drivers' : d === 1 ? 'Cell with one driver' : 'Normal cell';
      return `<p class="ce-card__kicker">${kind}</p><p>This cell carries <strong>${d + p} mutations</strong>: ${d ? `${d} driver${d > 1 ? 's' : ''} (${nm.join(', ')})` : 'no drivers'} and ${p} passengers.${fam ? ` Its clone: <strong>${fam} cells</strong>.` : ''}</p>`;
    }
    return '';
  }
  function refreshSelection(m) {
    const act = selected || hover;
    highlight = siteSetFor(act, m);
    veil = !!selected;
    const html = cardHTML(act, m);
    if (html !== cardBody.innerHTML) cardBody.innerHTML = html;
    card.hidden = !html;
  }
  function positionCard() {
    if (card.hidden || !L) return;
    const cw = card.offsetWidth, chh = card.offsetHeight;
    let x, y;
    const act = selected || hover;
    if (act && act.type === 'cell') {
      const [sx, sy] = siteXY(act.site);
      x = sx + L.s * 1.2; y = sy - chh / 2;
      if (x + cw > L.ox + L.gw && !L.tall) x = sx - L.s * 1.2 - cw;
      if (L.tall) { x = Math.max(8, Math.min(L.W - cw - 8, sx - cw / 2)); y = sy < L.oy + L.gh / 2 ? sy + L.s * 1.3 : sy - chh - L.s * 1.3; }
    } else if (L.tall) { x = 8; y = L.oy + L.gh - chh - 6; }
    else { x = L.tree.x0; y = L.tree.y1 - chh + 4; }
    x = Math.max(6, Math.min(L.W - cw - 6, x)); y = Math.max(44, Math.min(L.H - chh - 6, y));
    card.style.left = `${Math.round(x)}px`; card.style.top = `${Math.round(y)}px`;
  }
  function select(sel) {
    const same = sel && selected && sel.type === selected.type && sel.id === selected.id && sel.site === selected.site;
    selected = same ? null : sel;
    hover = null;
    if (selected && story.free < 0.5 && hintStage === 'trunk' && selected.type === 'trunk') hintStage = 'branch';
    else if (selected && story.free < 0.5 && hintStage === 'branch' && selected.type === 'branch') hintStage = 'done';
    if (!selected) { highlight = null; card.hidden = true; }
    render();
    positionCard();
    if (selected) ctx.announce(cardBody.textContent);
  }
  function setHover(i) {
    const next = i >= 0 ? { type: 'cell', site: i } : null;
    if ((next && hover && next.site === hover.site) || (!next && !hover)) return;
    hover = next;
    if (!hover && !selected) { highlight = null; card.hidden = true; }
    render();
    positionCard();
  }
  cardClose.addEventListener('click', () => select(null));
  ctx.on(card, 'keydown', (e) => { if (e.key === 'Escape') select(null); });
  ctx.on(ctx.stage, 'keydown', (e) => { if (e.key === 'Escape' && selected) select(null); });

  // tissue pointer: hover (mouse) previews a cell; tap / click pins it
  function siteAt(px, py) {
    const { s, G } = L;
    const r = Math.round((py - L.oy) / (s * 0.866) - 0.6);
    let best = -1, bd = Infinity;
    for (let rr = r - 1; rr <= r + 1; rr++) {
      if (rr < 0 || rr >= G.rows) continue;
      const c0 = Math.round((px - L.ox) / s - 0.5 - (rr & 1) * 0.5);
      for (let c = c0 - 1; c <= c0 + 1; c++) {
        if (c < 0 || c >= G.cols) continue;
        const i = rr * G.cols + c;
        const [x, y] = siteXY(i);
        const d = (x - px) ** 2 + (y - py) ** 2;
        if (d < bd) { bd = d; best = i; }
      }
    }
    return bd < s * s * 0.5 ? best : -1;
  }
  const local = (e) => { const b = cv.el.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; };
  ctx.on(cv.el, 'pointermove', (e) => {
    if (e.pointerType !== 'mouse' || !L || selected) return;
    const i = siteAt(...local(e));
    setHover(i >= 0 && curModel().S.occ[i] ? i : -1);
  });
  ctx.on(cv.el, 'pointerleave', () => { if (!selected) setHover(-1); });
  ctx.on(cv.el, 'click', (e) => {
    const i = siteAt(...local(e));
    if (i < 0 || !curModel().S.occ[i]) { if (selected) select(null); return; }
    select({ type: 'cell', site: i });
  });

  // ---------------------------------------------------------------- loop (sparks + free play)
  let rmAcc = 0;
  let frameSkip = 0;
  let speed = 4;
  const freeStep = fixedStep(() => {
    if (!freeM) return;
    freeM.step();
    const S = freeM.S;
    if (!freeOutcome && S.firstInvasion >= 0) {
      freeOutcome = { cancerYear: Math.floor(S.firstInvasion / TICKS_PER_YEAR) };
      ctx.announce(`Year ${freeOutcome.cancerYear}: a clone with three drivers broke through the basement membrane. That is a cancer.`);
    }
  }, { dt: 1 / TICKS_PER_YEAR, max: 400 });
  const loop = ctx.loop((dt) => {
    if (!L || !sheet) return;
    if (L.tall && (frameSkip = (frameSkip + 1) % 2)) { fxTime += dt; return; }       // ~30 fps on phones
    const step = L.tall ? dt * 2 : dt;
    fxTime += step;
    if (mode() === 'free' && freeM) {
      if (rm()) { rmAcc += step; if (rmAcc < 0.25) return; }
      const yrs = (rm() ? rmAcc : step) * SPEEDS[speed];
      rmAcc = 0;
      collectFx = !rm();
      const before = freeM.tick;
      const end = FREE_YEARS * TICKS_PER_YEAR;
      freeStep(Math.min(yrs, (end - freeM.tick) / TICKS_PER_YEAR + 1e-6));
      collectFx = false;
      if (freeM.tick >= end) finishRun();
      if (freeM.tick !== before || fx.length) invalidate();
      return;
    }
    // story mode: the stepper's tween moves story.t; sparks keep animating here
    syncStory();
    if (fx.length) invalidate();
  }, { autoplay: false });

  function finishRun() {
    loop.pause();
    const k = freeM.params.faulty ? 'faulty' : 'normal';
    tally[k][0]++;
    if (freeOutcome) tally[k][1]++;
    updateTally();
    ctx.announce(freeOutcome ? `Run complete. A cancer formed in year ${freeOutcome.cancerYear}.` : 'Run complete: 80 years and no cancer.');
  }

  // ---------------------------------------------------------------- stepper
  const ease = 'none';
  const stepSec = (i) => STEP_SECONDS[i];
  let stepper = null;
  const steps = [0, 1, 2, 3, 4, 5, 6].map((i) => ({
    enter(tl) {
      const upd = () => { syncStory(); invalidate(); };
      if (i < 6) tl.to(story, { t: STEP_END[i], duration: stepSec(i), ease, onUpdate: upd }, 0);
      if (i === 4) tl.to(story, { trunk: 1, duration: 1.2, ease: 'so.inOut', onUpdate: invalidate }, stepSec(i) - 1.3);
      if (i === 5) {
        tl.to(story, { ticks: 1, duration: 1.2, ease: 'so.inOut', onUpdate: invalidate }, 0.2);
        tl.to(story, { hint: 1, duration: 0.6, ease: 'so.inOut', onUpdate: invalidate }, stepSec(i) - 0.6);
      }
      if (i === 6) tl.to(story, { free: 1, duration: stepSec(i), ease: 'so.inOut', onUpdate: () => { syncStory(); invalidate(); } }, 0);
    },
  }));
  const freeRow = ctx.h('div', { class: 'ce-free', hidden: true });

  function setUpStepper() {
    stepper = ctx.ui.stepper({
      steps,
      reset() { Object.assign(story, { t: 0, trunk: 0, ticks: 0, hint: 0, free: 0 }); },
      onChange(i) {
        selected = null; hover = null; highlight = null; card.hidden = true;
        hintStage = 'trunk';
        const inFree = i === 6;
        freeRow.hidden = !inFree;
        if (inFree) { makeFree(); loop.pause(); }
        else if (!rm()) loop.play();
        syncStory();
        render();
      },
      onComplete() { freeRow.hidden = stepper.index !== 6; },
    });
    ctx.controls.insertBefore(stepper.el, freeRow);
  }

  // ---------------------------------------------------------------- free-play controls
  ctx.controls.append(freeRow);
  ctx.ui.playPause({ loop, parent: freeRow, onChange: (on) => {
    if (on && freeM && freeM.tick >= FREE_YEARS * TICKS_PER_YEAR) { freeSeed = (freeSeed * 7 + 13) % 99991; makeFree(); }
    ctx.announce(on ? 'Simulation running' : 'Simulation paused');
  } });
  ctx.ui.segmented({ label: 'Speed', parent: freeRow, value: 4, options: [{ value: 1, label: '1×' }, { value: 4, label: '4×' }, { value: 16, label: '16×' }], onChange: (v) => { speed = Number(v); } });
  ctx.ui.button({ label: 'Same run again', icon: 'replay', variant: 'ghost', parent: freeRow, onClick: () => { makeFree(); select(null); render(); loop.play(); } });
  ctx.ui.button({ label: 'New run', icon: 'reset', variant: 'ghost', parent: freeRow, onClick: () => { freeSeed = (freeSeed * 7 + 13) % 99991; makeFree(); select(null); render(); loop.play(); } });
  ctx.ui.segmented({
    label: 'DNA repair', parent: freeRow, value: 'normal',
    options: [{ value: 'normal', label: 'Normal' }, { value: 'faulty', label: 'Faulty (10× mutations)' }],
    onChange: (v) => { freeFaulty = v === 'faulty'; if (freeM) freeM.params.faulty = freeFaulty; ctx.announce(freeFaulty ? 'Faulty DNA repair: ten times more mutations from now on' : 'Normal DNA repair'); },
  });
  const tallyEl = ctx.h('span', { class: 'ce-note', 'aria-live': 'polite' });
  freeRow.append(tallyEl);
  function updateTally() {
    const parts = [];
    for (const [k, lab] of [['normal', 'normal repair'], ['faulty', 'faulty repair']]) if (tally[k][0]) parts.push(`${lab}, ${tally[k][1]} of ${tally[k][0]} ${tally[k][0] === 1 ? 'run' : 'runs'} made a cancer`);
    tallyEl.textContent = parts.length ? `Your runs — ${parts.join(' · ')}` : '';
  }

  // ---------------------------------------------------------------- resize
  let building = null;
  async function relayout() {
    const W = ctx.width, H = ctx.height;
    if (!W || !H) return;
    const tall = W < TALL_BELOW;
    if (tall) {
      const want = W / tallHeight(W);
      ctx.setAspect(want, want);
    } else ctx.setAspect(16 / 9, 16 / 9);
    L = computeLayout(W, ctx.height || H);
    svg.setAttribute('viewBox', `0 0 ${W} ${ctx.height || H}`);
    ctx.refreshTextScale();
    const key = tall ? 'tall' : 'wide';
    await buildSprites();
    buildBackground();
    layoutMeter();
    if (key !== gridKey) {
      gridKey = key;
      makeStory();
      makeFree();
      if (stepper) stepper.rebuild(); else setUpStepper();
      syncStory();
    }
    render();
  }
  ctx.onResize(() => { building = (building || Promise.resolve()).then(relayout); });
  await relayout();
  if (TUNE) setUpTuning();

  // ---------------------------------------------------------------- dev tuning panel (?ce-tune)
  function setUpTuning() {
    const box = ctx.h('div', { class: 'ce-tune' });
    box.innerHTML = `<div>dev tuning · grid ${L.G.cols}×${L.G.rows}</div>
      <label>runs <input type="number" value="100" data-k="runs"></label>
      <label>driver yrs <input type="number" step="0.1" value="${L.G.driverYears}" data-k="yrs"></label>
      <button type="button">batch</button><div data-out></div>`;
    ctx.stage.append(box);
    box.querySelector('button').addEventListener('click', () => {
      const runs = Number(box.querySelector('[data-k=runs]').value);
      L.G.driverYears = Number(box.querySelector('[data-k=yrs]').value);
      const out = [];
      for (const faulty of [false, true]) {
        let n = 0; const yrs = [];
        for (let r = 0; r < runs; r++) {
          const m = createTissue({ cols: L.G.cols, rows: L.G.rows, epiRows: L.G.epiRows, seed: 5000 + r, muD: muDFor(L.G), faulty });
          for (let t = 0; t < FREE_YEARS * TICKS_PER_YEAR; t++) { m.step(); if (m.S.firstInvasion >= 0) break; }
          if (m.S.firstInvasion >= 0) { n++; yrs.push(m.S.firstInvasion / TICKS_PER_YEAR); }
        }
        yrs.sort((a, b) => a - b);
        out.push(`${faulty ? 'faulty' : 'normal'}: ${n}/${runs} cancers, median year ${yrs.length ? yrs[yrs.length >> 1].toFixed(0) : '–'}`);
      }
      box.querySelector('[data-out]').textContent = out.join(' | ');
    });
  }

  return {
    destroy() { loop.pause(); },
  };
}
