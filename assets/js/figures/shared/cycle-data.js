// The cancer-immunity cycle: single source of truth for ch07-cycle,
// ch12-resistance and ch12-combinations (FIGURE-AUDIT §2B). Owner: P5.
// API + usage: docs/shared/cycle-wheel.md.
//
// Every reader-facing string about a step, a therapy's mapping or a regulatory
// status lives here. Figures import it; they never retype it.
//
// Sources in the drafts (October 2026):
//   steps & therapy table ............. content/drafts/07-escape.md, figure ch07-cycle (verbatim)
//   anti-CTLA-4 at priming, anti-PD-1 . 07-escape.md "The cancer-immunity cycle"; 08-checkpoints.md; 12-frontier.md
//   CAR-T / satri-cel ................. 10-cell-therapy.md; NMPA approval June 2026 (supervisor-verified, not "conditional")
//   TIL (lifileucel), TCR-T (afami-cel) 10-cell-therapy.md
//   T-cell engagers, tebentafusp ...... 09-antibodies.md
//   mRNA vaccine phase 3 .............. 11-vaccines.md (company-reported Aug 2026; not approved in US/EU)
//   resistance chips / profiles ....... 12-frontier.md, figures ch12-resistance / ch12-combinations
//   chapter links (supervisor check) .. Ch 8 checkpoints (CTLA-4, PD-1, LAG-3, IDO) · Ch 9 engagers · Ch 10 CAR-T/TIL/TCR-T ·
//                                       Ch 11 vaccines, oncolytic viruses · Ch 12 radiation, chemo, innate stimulants (STING), IL-2, anti-VEGF, TGF-β

const freeze = (o) => {
  Object.freeze(o);
  for (const v of Object.values(o)) if (v && typeof v === 'object' && !Object.isFrozen(v)) freeze(v);
  return o;
};

// ------------------------------------------------------------------ chapters
export const CHAPTERS = freeze({
  2: { n: 2, href: '02-innate.html', label: 'Chapter 2' },
  4: { n: 4, href: '04-presentation.html', label: 'Chapter 4' },
  5: { n: 5, href: '05-t-cells.html', label: 'Chapter 5' },
  6: { n: 6, href: '06-cancer.html', label: 'Chapter 6' },
  7: { n: 7, href: '07-escape.html', label: 'Chapter 7' },
  8: { n: 8, href: '08-checkpoints.html', label: 'Chapter 8' },
  9: { n: 9, href: '09-antibodies.html', label: 'Chapter 9' },
  10: { n: 10, href: '10-cell-therapy.html', label: 'Chapter 10' },
  11: { n: 11, href: '11-vaccines.html', label: 'Chapter 11' },
  12: { n: 12, href: '12-frontier.html', label: 'Chapter 12' },
});

/** '→ Chapter 8' as an HTML anchor (relative link: every chapter page sits at the site root). */
export function chapterLink(n, { arrow = true } = {}) {
  const c = CHAPTERS[n];
  if (!c) return '';
  return `<a class="cw-chapter-link" href="${c.href}">${arrow ? '→ ' : ''}${c.label}</a>`;
}

// ------------------------------------------------------------------ steps
// Positions: step k sits at position k − 1 on the loop (0..7, 7 ≡ 0).
export const BANDS = freeze([
  { id: 'tumor', label: 'Tumor', from: 3.5, to: 8 },        // steps 5, 6, 7, 1 and the first half of 2
  { id: 'node', label: 'Lymph node', from: 1, to: 2.5 },    // second half of 2, and 3
  { id: 'blood', label: 'Blood', from: 2.5, to: 3.5 },      // step 4
]);

export const STEPS = freeze([
  {
    n: 1, id: 'release', short: 'Release', name: 'Release of cancer antigens',
    location: 'tumor', where: 'Tumor',
    what: 'Cancer cells die and spill their contents, including neoantigens. Death that comes with danger signals alerts the immune system; quiet death does not.',
    breaks: 'Some tumors have few distinctive antigens to spill ([[a low mutation count|Fewer mutations means fewer neoantigens; Chapter 6]]), and their cells die quietly, without danger signals.',
    escapes: ['Hide'], chapter: 7,
  },
  {
    n: 2, id: 'presentation', short: 'Presentation', name: 'Antigen presentation',
    location: 'tumor-node', where: 'Tumor, then lymph node',
    what: 'Dendritic cells take up the debris, mature in response to danger signals, and carry the antigens to a nearby lymph node.',
    breaks: 'Some tumors keep the key dendritic cells out ([[in some melanomas|Through an overactive cancer-driving signal called WNT/β-catenin]]), or keep them too immature to activate T cells, so they induce tolerance instead of attack.',
    escapes: [], chapter: 7,
  },
  {
    n: 3, id: 'priming', short: 'Priming', name: 'Priming and activation',
    location: 'node', where: 'Lymph node',
    what: 'The rare T cells whose receptors fit the displayed antigen get signal 1 and signal 2, then multiply into large clones of killer cells.',
    breaks: 'Regulatory T cells damp priming. And T cells that react strongly to self-like tumor antigens were often removed by negative selection in the thymus long ago.',
    escapes: ['Recruit suppressor cells'], chapter: 7,
  },
  {
    n: 4, id: 'trafficking', short: 'Trafficking', name: 'Trafficking to the tumor',
    location: 'blood', where: 'Blood',
    what: 'Activated T cells leave the lymph node, travel in the blood, and leave the blood where the tumor’s vessel walls display the right adhesion molecules and chemokines.',
    breaks: 'Some tumors silence the [[chemokines|Small signaling proteins that make passing T cells stop, then guide them through the tissue along concentration gradients]] that would recruit T cells, strip their vessel walls of the adhesion molecules T cells need to stop, and grow leaky, chaotic vessels that are hard to cross.',
    escapes: ['Build barriers'], chapter: 7,
  },
  {
    n: 5, id: 'infiltration', short: 'Infiltration', name: 'Infiltration into the tumor',
    location: 'tumor', where: 'Tumor',
    what: 'T cells cross the walls of the tumor’s blood vessels (extravasation) and follow chemokine gradients through the surrounding tissue.',
    breaks: 'Barriers. Fibroblasts deposit dense collagen, and the cytokine [[TGF-β|A cytokine that promotes fibrosis (scarring) and suppresses immune cells]] helps hold T cells at the edges.',
    escapes: ['Build barriers'], chapter: 7,
  },
  {
    n: 6, id: 'recognition', short: 'Recognition', name: 'Recognition of cancer cells',
    location: 'tumor', where: 'Tumor',
    what: 'Each T cell checks the peptides on the cancer cells’ MHC class I for its one target.',
    breaks: 'Hiding. Cancer cells stop displaying MHC class I ([[for example by losing B2M|A small protein subunit that MHC class I needs to reach the surface]]), or lose the mutations that made them visible.',
    escapes: ['Hide', 'Ignore interferon'], chapter: 7,
  },
  {
    n: 7, id: 'killing', short: 'Killing', name: 'Killing of cancer cells',
    location: 'tumor', where: 'Tumor',
    what: 'T cells kill matching cancer cells, releasing more antigen and turning the cycle again.',
    breaks: 'Brakes and suppression. PD-L1 inhibits T cells, suppressor cells and suppressive molecules wear them down, and some cancer cells [[ignore interferon|They lose JAK1 or JAK2 and stop responding to interferon-gamma]].',
    escapes: ['Brake', 'Recruit suppressor cells', 'Release suppressive molecules', 'Ignore interferon'], chapter: 7,
  },
]);

/** step(3) or step('priming') → the STEPS entry (or undefined). */
export function step(key) {
  return typeof key === 'number' ? STEPS[key - 1] : STEPS.find((s) => s.id === key);
}

// ------------------------------------------------------------------ status strings
// One string per claim (FIGURE-AUDIT §7 red flags 1–2). `tag` = short label for chips
// and badges; `text` = the full status line. Copy verbatim; do not paraphrase.
const STATUS_ = {
  // Recent, fragile claims ---------------------------------------------------
  'mrna-vaccine': {
    tag: 'Company-reported, not yet approved',
    text: 'A personalized mRNA vaccine given with pembrolizumab met its main goal in a phase 3 melanoma trial (company-reported, 2026); not yet approved',
    chapter: 11,
  },
  // Verified by the supervisor (CARsgen release, OncLive, June 2026): a regular NMPA approval.
  'satri-cel': {
    tag: 'Approved in China, June 2026',
    text: 'approved in China (June 2026) for Claudin18.2-positive advanced stomach cancer — the first CAR-T approved for a solid tumor',
    chapter: 10,
  },
  // Per therapy (ch07-cycle table; Chapter 7 spec wording, corrected per §7) --
  radiation: { tag: 'Approved; immune effects under study', text: 'Approved as a cancer treatment; immune effects under study', chapter: 12 },
  'chemo-icd': { tag: 'Approved; immune effects under study', text: 'Approved as a cancer treatment; immune effects under study', chapter: 12 },
  oncolytic: { tag: 'Approved in a few cancers', text: 'Approved in a few cancers', chapter: 11 },
  vaccine: { tag: 'Approved in few cancers', text: 'Approved in few cancers; see mrna-vaccine', chapter: 11 },   // text composed below
  'innate-agonist': { tag: 'One approved; others in trials', text: 'One approved for skin use; others in trials', chapter: 12 },
  'anti-ctla4': { tag: 'Approved', text: 'Approved', chapter: 8 },
  il2: { tag: 'Approved; helps a minority', text: 'Approved; helps a minority, with heavy side effects', chapter: 12 },
  'anti-vegf': { tag: 'Approved in some combinations', text: 'Approved in some combinations', chapter: 12 },
  'tgfb-block': { tag: 'In trials', text: 'In trials; early attempts failed', chapter: 12 },
  'anti-pd1': { tag: 'Approved', text: 'Approved', chapter: 8 },
  'anti-lag3': { tag: 'Approved with anti-PD-1', text: 'Approved (with anti-PD-1, in melanoma)', chapter: 8 },
  'ido-inhib': { tag: 'Failed in phase 3', text: 'Failed in a phase 3 trial', chapter: 8 },
  'car-t': { tag: 'Approved in blood cancers', text: 'see satri-cel', chapter: 10 },                                   // text composed below
  'til-tcrt': { tag: 'Approved in a few cancers', text: 'Approved in a few cancers', chapter: 10 },
  bispecific: { tag: 'Approved', text: 'Approved', chapter: 9 },
};
// Lines that mention a recent claim are composed from that claim's single string.
const lcFirst = (t) => t.charAt(0).toLowerCase() + t.slice(1);
STATUS_.vaccine.text = `Approved in few cancers; ${lcFirst(STATUS_['mrna-vaccine'].text)}`;
STATUS_['car-t'].text = `Approved in blood cancers; one CAR-T (satri-cel) was ${STATUS_['satri-cel'].text}`;
export const STATUS = freeze(STATUS_);

// ------------------------------------------------------------------ therapies
// acts: main sites (full gold ring) · also: secondary sites (thin ring; "also acts here") ·
// skips: steps it makes unnecessary · replaces: steps it performs by an engineered route
// (no MHC display needed) · entersAt: where its ready-made killers join the cycle.
// Anti-PD-1 follows the science review (SCIENCE-REVIEW M1; Chapter 8): mainly the effector
// end (6–7), also priming/expansion (3) via the stem-like reserve in lymph nodes and blood.
// RULE: nothing skips or replaces steps 4, 5 or 7 (checked below).
// Tebentafusp (Chapter 9) is a T-cell engager that still needs HLA display: if it is
// ever added, give it replaces: [].
const T = (o) => ({ acts: [], also: [], skips: [], replaces: [], entersAt: null, bypass: '', ch07: false, ...o });
export const THERAPIES = freeze([
  T({ id: 'radiation', label: 'Radiation', ch07: true, family: 'start', acts: [1],
    how: 'Kills cancer cells in a way that can release antigens along with danger signals.',
    status: 'radiation', chapters: [12] }),
  T({ id: 'chemo-icd', label: 'Some chemotherapies', family: 'start', acts: [1],
    how: 'Certain drugs kill cancer cells in a way that can alert the immune system, at least in laboratory studies.',
    status: 'chemo-icd', chapters: [12] }),
  T({ id: 'oncolytic', label: 'Oncolytic viruses', family: 'start', acts: [1, 2],
    how: 'Viruses that infect and lyse (burst) cancer cells, releasing antigens and danger signals at once.',
    status: 'oncolytic', chapters: [11] }),
  T({ id: 'vaccine', label: 'Cancer vaccines', ch07: true, family: 'start', acts: [2, 3],
    how: 'Deliver chosen tumor antigens, with immune stimulants, to dendritic cells.',
    status: 'vaccine', chapters: [11] }),
  T({ id: 'innate-agonist', label: 'Innate immune stimulants', family: 'start', acts: [2],
    how: 'Molecules that mimic danger signals to mature dendritic cells.',
    status: 'innate-agonist', chapters: [12] }),
  T({ id: 'anti-ctla4', label: 'Anti-CTLA-4', ch07: true, family: 'brakes', acts: [3],
    how: 'Releases a brake that acts mainly during priming in the lymph node.',
    status: 'anti-ctla4', chapters: [8] }),
  T({ id: 'il2', label: 'Interleukin-2', family: 'brakes', acts: [3],
    how: 'A cytokine that drives T cells to proliferate.',
    status: 'il2', chapters: [12] }),
  T({ id: 'anti-vegf', label: 'Anti-VEGF drugs', family: 'walls', acts: [4, 5],
    how: 'Can normalize the tumor’s chaotic blood vessels, which may help T cells find and cross them.',
    status: 'anti-vegf', chapters: [12] }),
  T({ id: 'tgfb-block', label: 'TGF-β blockers', ch07: true, family: 'walls', acts: [5],
    how: 'Aim to lower the barriers by blocking the cytokine that helps keep T cells out.',
    status: 'tgfb-block', chapters: [12] }),
  T({ id: 'anti-pd1', label: 'Anti-PD-1 / PD-L1', ch07: true, family: 'brakes', acts: [6, 7], also: [3],
    how: 'Releases the PD-1 brake on T cells in the tumor, and refuels the response from a reserve of stem-like T cells in lymph nodes and blood.',
    status: 'anti-pd1', chapters: [8] }),
  T({ id: 'anti-lag3', label: 'Anti-LAG-3', family: 'brakes', acts: [7],
    how: 'Releases a second brake, used together with anti-PD-1.',
    status: 'anti-lag3', chapters: [8] }),
  T({ id: 'ido-inhib', label: 'IDO inhibitors', family: 'brakes', acts: [7],
    how: 'Block an enzyme that starves T cells of tryptophan.',
    status: 'ido-inhib', chapters: [8] }),
  T({ id: 'car-t', label: 'CAR-T cells', ch07: true, family: 'byo', skips: [1, 2, 3], replaces: [6], entersAt: 4,
    how: 'Ready-made T cells with a synthetic receptor that recognizes a surface protein without needing MHC. They still have to travel, get in and kill.',
    bypass: 'CAR-T cells are ready-made killers that join the cycle at step 4. They still have to travel, get in and kill.',
    status: 'car-t', chapters: [10] }),
  T({ id: 'til-tcrt', label: 'TIL and TCR-T cells', family: 'byo', skips: [1, 2, 3], entersAt: 4,
    how: 'Large numbers of tumor-reactive T cells grown or engineered outside the body. They still need the cancer cell’s MHC display.',
    bypass: 'TIL and TCR-T cells are ready-made killers that join the cycle at step 4. They still have to travel, get in, find their target on MHC class I and kill.',
    status: 'til-tcrt', chapters: [10] }),
  T({ id: 'bispecific', label: 'T-cell engagers', ch07: true, family: 'byo', skips: [1, 2, 3], replaces: [6], entersAt: 4,
    how: 'Antibodies that bridge a T cell to a cancer cell, so any T cell that reaches the tumor can kill it — no priming or MHC display needed.',
    bypass: 'T-cell engagers turn any T cell that reaches the tumor into a killer, from step 4 on. Those T cells still have to travel, get in and kill.',
    status: 'bispecific', chapters: [9] }),
]);

for (const t of THERAPIES) {
  for (const s of [...t.skips, ...t.replaces]) {
    if (s === 4 || s === 5 || s === 7) throw new Error(`cycle-data: ${t.id} may not skip or replace step ${s}`);
  }
  if (!STATUS[t.status]) throw new Error(`cycle-data: ${t.id} has no STATUS entry`);
}

/** therapy('anti-pd1') → THERAPIES entry. */
export const therapy = (id) => THERAPIES.find((t) => t.id === id);
/** statusOf('car-t' | therapyEntry) → { tag, text, chapter } */
export const statusOf = (t) => STATUS[(typeof t === 'string' ? therapy(t) : t)?.status];

/** Chapter 7 treatment tray: four labeled families, seven chips. */
export const FAMILIES = freeze([
  { id: 'start', label: 'Start the cycle', therapies: ['radiation', 'vaccine'] },
  { id: 'brakes', label: 'Release the brakes', therapies: ['anti-ctla4', 'anti-pd1'] },
  { id: 'walls', label: 'Lower the barriers', therapies: ['tgfb-block'] },
  { id: 'byo', label: 'Bring your own killers', therapies: ['car-t', 'bispecific'] },
]);

// ------------------------------------------------------------------ Chapter 7 rule
const and = (a) => (a.length > 1 ? `${a.slice(0, -1).join(', ')} and ${a[a.length - 1]}` : String(a[0]));
const listSteps = (arr) => (arr.length > 1
  ? `steps ${and(arr)} (${and(arr.map((n) => step(n).short))})`
  : `step ${arr[0]}, ${step(arr[0]).short}`);

/**
 * Where a therapy acts, for display only (Chapter 7 "Where Part III treatments act"; spec
 * round 2: no outcome is ever computed here — fixing things belongs to ch12-combinations).
 *   therapyPreview('car-t') → { therapy, states, rings, line, detail, needs }
 * states: for wheel.setStates (skipped steps "not needed"; replaced steps tagged "no MHC needed")
 * rings: { acts, also, entersAt } for wheel.ring (show entersAt with { source: false })
 */
export function therapyPreview(id) {
  const t = therapy(id);
  if (!t) throw new Error(`cycle-data: unknown therapy "${id}"`);
  const byo = t.entersAt != null;
  const needs = byo ? [4, 5, 6, 7].filter((k) => !t.skips.includes(k) && !t.replaces.includes(k)) : [];
  const parts = [];
  if (t.acts.length) parts.push(`It acts mainly at ${listSteps(t.acts)}`);
  if (t.also.length) parts.push(`also at ${listSteps(t.also)}`);
  return {
    therapy: t,
    states: byo ? [
      ...t.skips.map((s) => ({ step: s, state: 'skipped' })),
      ...t.replaces.map((s) => ({ step: s, state: 'replaced', tag: 'no MHC needed' })),
    ] : [],
    rings: { acts: t.acts.slice(), also: t.also.slice(), entersAt: byo ? [t.entersAt] : [] },
    line: byo ? t.bypass : `${t.label}: ${t.how}`,
    detail: byo
      ? `Still needed: ${and(needs.map((k) => `${k} ${step(k).short}`))}.`
      : `${parts.join(', and ')}.`,
    needs,
  };
}

// ------------------------------------------------------------------ Chapter 12: resistance
// Chips for ch12-resistance (spec order). States are what the wheel shows; pd1 = the
// "Add anti-PD-1" switch. Outcome kinds are the foundation badge kinds (FIGURE-AUDIT §2J).
export const MECHANISMS = freeze([
  {
    id: 'brake-on', n: 1, title: 'Brake on', subtitle: 'PD-L1 inhibits T cells',
    states: [{ step: 7, state: 'broken' }], halo: null,
    pd1: { outcome: 'yes', text: '✓ Fixed — the T cell kills', label: 'Fixed — the T cell kills', states: [{ step: 7, state: 'repaired' }] },
    icon: 'minus', ch07: 'Brake', tme: 'inflamed', profile: 'A', chapter: 12,
  },
  {
    id: 'nothing-new', n: 2, title: 'Nothing new to see', subtitle: 'Few neoantigens, or lost ones',
    states: [{ step: 1, state: 'broken' }, { step: 6, state: 'broken', glyph: 'self' }], halo: null,
    pd1: { outcome: 'no', text: '✕ Not fixed — little to recognize', label: 'Not fixed — little to recognize', states: [{ step: 1, state: 'broken' }, { step: 6, state: 'broken', glyph: 'self' }] },
    icon: 'x', ch07: 'Hide', tme: null, profile: null, chapter: 12,
  },
  {
    id: 'shop-window', n: 3, title: 'Shop window shut', subtitle: 'B2M loss: no MHC class I',
    states: [{ step: 6, state: 'broken', glyph: 'hidden' }], halo: null,
    pd1: { outcome: 'no', text: '✕ Usually not fixed — killer T cells can’t detect the cell (other immune cells sometimes can)', label: 'Usually not fixed — killer T cells can’t detect the cell (other immune cells sometimes can)', states: [{ step: 6, state: 'broken', glyph: 'hidden' }] },
    icon: 'padlock', ch07: 'Hide', tme: null, profile: 'D', chapter: 12,
  },
  {
    id: 'deaf', n: 4, title: 'Ignores interferon', subtitle: 'JAK1/2 loss: no signal past the receptor',
    states: [{ step: 6, state: 'broken' }, { step: 7, state: 'broken' }], halo: null,
    pd1: { outcome: 'no', text: '✕ Usually not fixed — the tumor still ignores interferon', label: 'Usually not fixed — the tumor still ignores interferon', states: [{ step: 6, state: 'broken' }, { step: 7, state: 'broken' }] },
    icon: 'bolt', ch07: 'Ignore interferon', tme: null, profile: null, chapter: 12,
  },
  {
    id: 'excluded', n: 5, title: 'Excluded', subtitle: 'Stroma keeps T cells at the edge',
    states: [{ step: 5, state: 'broken' }, { step: 4, state: 'weak' }], halo: null,
    pd1: { outcome: 'no', text: '✕ Not fixed — T cells still can’t get in', label: 'Not fixed — T cells still can’t get in', states: [{ step: 5, state: 'broken' }, { step: 4, state: 'weak' }] },
    icon: 'shield', ch07: 'Build barriers', tme: 'excluded', profile: 'B', chapter: 12,
  },
  {
    id: 'no-scouts', n: 6, title: 'Idle dendritic cells', subtitle: 'Too little priming; suppressor cells',
    states: [{ step: 2, state: 'broken' }, { step: 3, state: 'broken' }, { step: 7, state: 'weak', strength: 0.35 }], halo: null,
    pd1: {
      outcome: 'partial', text: '≈ A little help at most — too few T cells primed, and other suppressors remain', label: 'A little help at most — too few T cells primed, and other suppressors remain',
      states: [{ step: 2, state: 'broken' }, { step: 3, state: 'broken' }, { step: 7, state: 'weak', strength: 0.55 }],   // "the dashed step-7 ring brightens a little"
    },
    icon: 'layers', ch07: 'Recruit suppressor cells', tme: 'desert', profile: 'C', chapter: 12,
  },
  {
    id: 'host', n: 7, title: 'Host factors', subtitle: 'HLA alleles, gut microbes, medicines',
    states: [], halo: { dense: [2, 3], faint: [6] },
    pd1: { outcome: 'varies', text: '~ Varies from person to person', label: 'Varies from person to person', states: [] },
    icon: 'tilde', ch07: null, tme: null, profile: null, chapter: 12,
  },
]);
export const mechanism = (id) => MECHANISMS.find((m) => m.id === id);
/** Wheel rings for the ch12-resistance "Add anti-PD-1" switch (from THERAPIES, so the chapters agree). */
export const PD1_RINGS = freeze({ acts: therapy('anti-pd1').acts.slice(), also: therapy('anti-pd1').also.slice() });

// ------------------------------------------------------------------ Chapter 12: combinations
// Teaching model (spec ch12-combinations; arbitrary values, "Illustrative").
export const PROFILES = freeze([
  { id: 'A', label: 'Inflamed but braked', term: 'Inflamed', mechanism: 'brake-on',
    strengths: [0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.2],
    description: 'T cells are inside and recognize the tumor, but PD-L1 brakes them.' },
  { id: 'B', label: 'Excluded', term: 'Excluded', mechanism: 'excluded',
    strengths: [0.7, 0.7, 0.7, 0.6, 0.2, 0.8, 0.3],
    description: 'T cells are primed and arrive, but stroma keeps them at the edge.' },
  { id: 'C', label: 'Desert (cold)', term: 'Desert', mechanism: 'no-scouts',
    strengths: [0.2, 0.2, 0.2, 0.8, 0.7, 0.8, 0.5],
    description: 'Little antigen is released, dendritic cells stay idle, and few T cells are primed.' },
  { id: 'D', label: 'Inflamed but hidden (MHC loss)', term: 'Inflamed but hidden', mechanism: 'shop-window',
    strengths: [0.8, 0.8, 0.8, 0.8, 0.8, 0.05, 0.6],
    description: 'T cells arrive, but the cancer cells have lost MHC class I.' },
]);
export const profile = (id) => PROFILES.find((p) => p.id === id);

// Tray tiles. skips / replaces / entersAt come from THERAPIES, so Chapters 7 and 12 agree.
const fromTherapies = (ids, key) => [...new Set(ids.flatMap((id) => therapy(id)[key]))].sort();
const tile = (o) => ({
  add: {}, ...o,
  acts: fromTherapies(o.therapies, 'acts'),
  also: fromTherapies(o.therapies, 'also').filter((k) => !fromTherapies(o.therapies, 'acts').includes(k)),
  skips: fromTherapies(o.therapies, 'skips'),
  replaces: fromTherapies(o.therapies, 'replaces'),
  entersAt: [...new Set(o.therapies.map((id) => therapy(id).entersAt).filter(Boolean))],
});
export const TRAY = freeze([
  tile({ id: 'anti-pd1', n: 1, label: 'Anti-PD-1', subtitle: 'Releases the PD-1 brake', therapies: ['anti-pd1'], add: { 7: 0.5 }, side: 1 }),
  tile({ id: 'anti-ctla4', n: 2, label: 'Anti-CTLA-4', subtitle: 'Boosts priming in lymph nodes', therapies: ['anti-ctla4'], add: { 3: 0.4 }, side: 2 }),
  tile({ id: 'kill-alert', n: 3, label: 'Kill and alert', subtitle: 'Radiation, some chemotherapy, oncolytic viruses', therapies: ['radiation', 'chemo-icd', 'oncolytic'], add: { 1: 0.4, 2: 0.2 }, side: 1.5 }),
  tile({ id: 'vaccine', n: 4, label: 'Cancer vaccine', subtitle: 'Delivers tumor antigens to dendritic cells', therapies: ['vaccine'], add: { 2: 0.4, 3: 0.4 }, side: 0.5 }),
  tile({ id: 'gate-openers', n: 5, label: 'Gate openers', subtitle: 'Anti-VEGF drugs; TGF-β blockers (experimental)', therapies: ['anti-vegf', 'tgfb-block'], add: { 4: 0.2, 5: 0.3 }, side: 1 }),
  tile({ id: 'engineered', n: 6, label: 'Engineered killers', subtitle: 'CAR-T cells, T-cell engagers', therapies: ['car-t', 'bispecific'], side: 2 }),
  tile({ id: 'ido-inhib', n: 7, label: 'IDO inhibitor', subtitle: 'Aims to stop T cells being starved', therapies: ['ido-inhib'], side: 0.5 }),
]);
export const trayTile = (id) => TRAY.find((t) => t.id === id);

const r2 = (v) => Math.round(v * 100) / 100;

/** Strengths → wheel states: < 0.40 broken, 0.40–0.69 weak, ≥ 0.70 ok; skips/replaces win. */
export function statesFromStrengths(strengths, { skips = [], replaces = [] } = {}) {
  return strengths.map((v, i) => {
    const s = i + 1;
    if (skips.includes(s)) return { step: s, state: 'skipped', strength: 1 };
    if (replaces.includes(s)) return { step: s, state: 'replaced', strength: 1 };
    const x = r2(v);
    return { step: s, state: x < 0.4 ? 'broken' : x < 0.7 ? 'weak' : 'ok', strength: x };
  });
}

/** The ch12-combinations model, implemented exactly as specified. */
export function evaluateCombination(profileId, tileIds = []) {
  const p = profile(profileId);
  if (!p) throw new Error(`cycle-data: unknown profile "${profileId}"`);
  const tiles = tileIds.map((id) => trayTile(id)).filter(Boolean);
  const s = p.strengths.slice();
  const skips = new Set();
  const replaces = new Set();
  const acts = new Map();
  const also = new Set();
  const entersAt = new Set();
  for (const t of tiles) {
    for (const [k, d] of Object.entries(t.add)) s[k - 1] = Math.min(1, s[k - 1] + d);
    for (const k of t.acts) acts.set(k, (acts.get(k) || 0) + 1);
    t.also.forEach((k) => also.add(k));
    t.skips.forEach((k) => skips.add(k));
    t.replaces.forEach((k) => replaces.add(k));
    t.entersAt.forEach((k) => entersAt.add(k));
  }
  for (const k of [...skips, ...replaces]) s[k - 1] = 1;
  const strengths = s.map(r2);
  const control = r2(Math.min(...strengths));
  const limiting = strengths.indexOf(control) + 1;
  const sideEffects = r2(tiles.reduce((a, t) => a + t.side, 0));
  return {
    strengths,
    states: statesFromStrengths(strengths, { skips: [...skips], replaces: [...replaces] }),
    control,
    tier: control < 0.4 ? 'growing' : control < 0.7 ? 'partial' : 'strong',
    limiting,
    sideEffects,
    sideTier: sideEffects <= 2 ? 'manageable' : sideEffects <= 4 ? 'substantial' : 'too-much',
    rings: {
      acts: [...acts].map(([step, count]) => ({ step, count })).sort((a, b) => a.step - b.step),
      also: [...also].filter((k) => !acts.has(k)).sort(),
      entersAt: [...entersAt],
    },
  };
}

/** Spec sanity checks for the combination model and the therapy table. Returns failures ([] = all good). */
export function selfTest() {
  const fails = [];
  const want = (label, got, ok) => { if (!ok) fails.push(`${label}: got ${JSON.stringify(got)}`); };
  const ev = evaluateCombination;
  want('A + PD-1 strong', ev('A', ['anti-pd1']).tier, ev('A', ['anti-pd1']).tier === 'strong');
  const a2 = ev('A', ['anti-pd1', 'anti-ctla4']);
  want('A + PD-1 + CTLA-4 strong, substantial', [a2.tier, a2.sideTier], a2.tier === 'strong' && a2.sideTier === 'substantial');
  want('B + PD-1 growing', ev('B', ['anti-pd1']).tier, ev('B', ['anti-pd1']).tier === 'growing');
  const b2 = ev('B', ['anti-pd1', 'gate-openers']);
  want('B + PD-1 + gates partial 0.50', [b2.tier, b2.control], b2.tier === 'partial' && b2.control === 0.5);
  const ids = TRAY.map((t) => t.id);
  const combos = [];
  for (let i = 0; i < ids.length; i++) for (let j = i; j < ids.length; j++) for (let k = j; k < ids.length; k++) combos.push([...new Set([ids[i], ids[j], ids[k]])]);
  want('B never strong', null, combos.every((c) => ev('B', c).tier !== 'strong'));
  want('B + engineered growing', ev('B', ['engineered']).tier, ev('B', ['engineered']).tier === 'growing');
  want('C + PD-1 growing', ev('C', ['anti-pd1']).tier, ev('C', ['anti-pd1']).tier === 'growing');
  want('C + kill + vaccine partial', ev('C', ['kill-alert', 'vaccine']).tier, ev('C', ['kill-alert', 'vaccine']).tier === 'partial');
  want('C + kill + vaccine + PD-1 partial', ev('C', ['kill-alert', 'vaccine', 'anti-pd1']).tier, ev('C', ['kill-alert', 'vaccine', 'anti-pd1']).tier === 'partial');
  const c1 = ev('C', ['engineered']);
  want('C + engineered partial 0.50', [c1.tier, c1.control], c1.tier === 'partial' && c1.control === 0.5);
  const c2 = ev('C', ['engineered', 'anti-pd1']);
  want('C + engineered + PD-1 strong 0.70', [c2.tier, c2.control], c2.tier === 'strong' && c2.control === 0.7);
  want('D without engineered growing', null, combos.filter((c) => !c.includes('engineered')).every((c) => ev('D', c).tier === 'growing'));
  const d1 = ev('D', ['engineered']);
  want('D + engineered partial 0.60', [d1.tier, d1.control], d1.tier === 'partial' && d1.control === 0.6);
  const d2 = ev('D', ['engineered', 'anti-pd1']);
  want('D + engineered + PD-1 strong 0.80', [d2.tier, d2.control], d2.tier === 'strong' && d2.control === 0.8);
  for (const p of PROFILES) for (const c of combos) {
    if (c.includes('ido-inhib')) continue;
    const a = ev(p.id, c).control;
    const b = ev(p.id, [...c, 'ido-inhib']).control;
    if (a !== b) { fails.push(`IDO changed control for ${p.id} ${c}`); break; }
  }
  // Chapter 7 previews
  want('CAR-T preview skips 1-3, no MHC at 6, joins at 4', therapyPreview('car-t'), (() => { const p = therapyPreview('car-t'); return p.states.length === 4 && p.rings.entersAt[0] === 4 && p.needs.join() === '4,5,7'; })());
  want('TIL needs MHC display', therapyPreview('til-tcrt').needs, therapyPreview('til-tcrt').needs.join() === '4,5,6,7');
  want('anti-PD-1 rings 6,7 + also 3', therapyPreview('anti-pd1').rings, therapyPreview('anti-pd1').rings.acts.join() === '6,7' && therapyPreview('anti-pd1').rings.also.join() === '3');
  want('anti-CTLA-4 at priming', therapyPreview('anti-ctla4').rings.acts, therapyPreview('anti-ctla4').rings.acts.join() === '3');
  return fails;
}

// ------------------------------------------------------------------ text helpers
const TERM = /\[\[([^|\]]+)\|([^\]]+)\]\]/g;
/** '…the cytokine [[TGF-β|A cytokine that promotes fibrosis…]] helps…' → [{ text }, { term, note }, { text }] */
export function richText(str = '') {
  const out = [];
  let last = 0;
  for (const m of str.matchAll(TERM)) {
    if (m.index > last) out.push({ text: str.slice(last, m.index) });
    out.push({ term: m[1], note: m[2] });
    last = m.index + m[0].length;
  }
  if (last < str.length) out.push({ text: str.slice(last) });
  return out;
}
/** Strip [[term|note]] markup → plain text (aria-labels, announcements). */
export const plainText = (str = '') => str.replace(TERM, '$1');
