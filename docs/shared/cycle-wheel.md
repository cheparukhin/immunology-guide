# `shared/cycle-wheel.js` + `shared/cycle-data.js`: the cancer-immunity cycle

The seven-step cycle (Chen & Mellman 2013) drawn once and reused by three figures (FIGURE-AUDIT §2B). Owner: **P5**.

| Figure | Role | How it uses the wheel |
|---|---|---|
| `ch07-cycle` | *learns* the steps | `density: 'full'`, tour via `ctx.ui.stepper`, break / restore, display-only "Part III" previews (reference user) |
| `ch12-resistance` | *diagnoses* | `density: 'locator'` (~40 % wide; ~240 px on phones → `'mini'` layout), several broken + weak steps, `halo()` for host factors |
| `ch12-combinations` | *treats* | `density: 'full'`, `setStates` with `strength`, `setFlow(control)`, `ring(..., 'acts')` with counts |

```js
import { createCycleWheel } from './shared/cycle-wheel.js';
import { STEPS, THERAPIES, FAMILIES, MECHANISMS, PROFILES, TRAY, STATUS, CHAPTERS,
         step, therapy, mechanism, profile, statusOf, chapterLink, richText, plainText,
         therapyPreview, PD1_RINGS, evaluateCombination, statesFromStrengths } from './shared/cycle-data.js';
```

`cycle-data.js` is the **single source of truth** for step names, therapy mappings and every "approved / in trials / company-reported" phrase. Never retype these strings in a figure: import them.

---

## 1. `createCycleWheel(ctx, parent, options)` → handle

```js
const wheel = createCycleWheel(ctx, parent, {
  size: 600,            // max rendered width in CSS px; the wheel fills parent's width up to this (centered)
  density: 'full',      // 'full' | 'locator'  (locator: band labels hidden, lighter flow, tap a node → tooltip with its full name)
  layout: 'auto',       // 'auto' | 'circle' | 'oval' | 'mini'
                        //   auto: circle ≥ 540 px wide, oval 330–539 px (phones; locators), mini < 330 px.
                        //   circle: labels outside, status in the middle · oval: labels inside the loop, status under it ·
                        //   mini: step numbers only (names in aria-labels and the tap tooltip), status under it.
                        //   Forcing 'circle' below ~540 px clips the outside labels; prefer 'auto'.
  bands: true,          // soft location territories: TUMOR (steps 5–7, 1 and the first half of 2), LYMPH NODE (2nd half of 2, 3), BLOOD (4)
  flow: 1,              // initial flow speed 0..1, or false = no flow dots at all
  center: true,         // status text in the middle (circle) or under the wheel (oval); false = none
  label: 'The cancer-immunity cycle',   // aria-label of the node group
});
```

| Member | |
|---|---|
| `el` | `<div class="cw">`, already appended to `parent`. Width `100%` up to `size`; its height follows the layout's aspect ratio (circle 680 × 612, oval 380 × 556, mini 340 × 384). Put it in a container with a definite width (grid cell, flex item, the stage). |
| `svg` | the root `<svg>` (made with `ctx.createSVG`, so the `.t-*` text classes keep labels ≥ 13 px). |
| `layout` | `'circle' \| 'oval' \| 'mini'` currently drawn. |
| `selectStep(n, { instant })` | select step 1–7 (`null` clears). Node scales to 1.12 and its outline brightens. **Programmatic: does not fire `onStep`.** |
| `selected` | the selected step or `null`. |
| `setStates(list, { instant })` | `list: [{ step, state, strength?, broken?, tag?, glyph? }]`; unlisted steps are `'ok'`. Replaces the whole state (it is not a merge). See §1.1. |
| `states` | the resolved array of 7 `{ step, state, strength, broken, tag, glyph }`. |
| `setFlow(v)` | flow speed 0..1 (0 = dots stand still). Ignored when created with `flow: false`. |
| `ring(steps, kind = 'acts', { transient, source })` | gold therapy rings (`'acts'` main site, `'also'` secondary site, `'entersAt'` entry point), see §1.2. `ring([], kind)` clears that kind. |
| `halo(opts \| null)` | `{ dense: [2, 3], faint: [6] }`: a translucent halo around the wheel, densest near `dense`, weaker near `faint` (ch12 "Host factors"). `null` clears. |
| `setCenter(text \| null)` | status text; `'\n'` breaks the line (max 2 lines). `null` = automatic (see §1.3). |
| `onStep(fn)` | `fn(n, { via: 'pointer' \| 'keyboard' })` when the **reader** activates a node. Returns an unsubscribe function. |
| `pulse(n, kind = 'repair')` | one soft swelling ring at node `n` (`'repair'` green-cyan, `'neutral'` light, `'lap'` violet). Never a flash; a static ring under reduced motion. |
| `status` | `{ running, stalledAt, bypassFrom }` derived from states + rings (`stalledAt` = first broken step clockwise from 1 that no entry point bypasses, else `null`). |
| `nodePoint(n)` | `{ x, y, r }` of node `n` in SVG user units (for your own overlays). |
| `layers` | `{ under, over }`: empty `<g>`s below and above the nodes for figure-specific drawing. **Re-created on every layout change**: draw in `onLayout`. |
| `onLayout(fn)` | `fn({ layout, width, height })` after each (re)draw, including the first. Returns an unsubscribe function. |
| `destroy()` | stops the flow loop and removes `el` (also runs automatically on figure destroy). |

All methods accept being called before the first layout; the wheel applies them when it draws.

### 1.1 Step states (FIGURE-AUDIT §4: never color alone)

| `state` | Look | Flow |
|---|---|---|
| `'ok'` | dark lens, light 1.5 px outline, art glyph | dots pass |
| `'weak'` | **dashed** crimson outline + the word "weak" under the label | dots slow down and bunch before it |
| `'broken'` | solid crimson outline + crimson ⊣ disc on the node's inner rim | dots stop and pile up before it; nodes it starves fade to 40 % (in sequence around the wheel) |
| `'skipped'` | node at 45 %, dashed grey outline, tag "not needed" | dots pass faintly |
| `'replaced'` | gold dashed inner ring + tag "engineered / recognition" (two lines) | dots pass |
| `'repaired'` | like `'ok'` + a green-cyan "+" disc on the inner rim | dots pass |

* `strength` (0..1, optional, any state) adds a thin arc gauge around the node (arc length = strength). Omit it to hide the gauge.
* `broken: true` on a `'skipped'` or `'replaced'` entry keeps a faded ⊣ disc: the natural step is still broken but no longer needed (e.g. step 2 broken, CAR-T cells bypass 1–3).
* `tag` (string, `'\n'` for two lines) replaces the state's tag word, e.g. `{ step: 6, state: 'replaced', tag: 'no MHC needed' }` (ch07 preview). The mini layout shows only "weak".
* `glyph` swaps a node's art for a variant (crossfade). Step 6 has `'hidden'` (the shop window is shut: the MHC cup is **absent**, never empty; FIGURE-AUDIT §4.3) and `'self'` (the cup holds a sand self-peptide: nothing new to see). MECHANISMS already carry them (`shop-window` → hidden, `nothing-new` → self); ch07 uses `'hidden'` when the reader breaks step 6.
* **Starving.** A node fades to 40 % when no flow reaches it: walking backward (counter-clockwise) from it you meet a broken step before any `'entersAt'` ring. With one broken step and no entry ring that is every other node (the whole cycle stalls). Selected nodes never drop below 70 %.
* Map a model to states yourself or with `statesFromStrengths()` (§2.7): < 0.40 broken, 0.40–0.69 weak, ≥ 0.70 ok.

### 1.2 Rings (therapies)

```js
wheel.ring([6, 7], 'acts');                                // full gold ring: a therapy acts mainly here
wheel.ring([3], 'also');                                   // thin gold ring: it also acts here (secondary, "mainly/also")
wheel.ring([{ step: 7, count: 2 }, { step: 3, count: 1 }], 'acts');   // + gold count badge (ch12-combinations)
wheel.ring([4], 'entersAt');                               // gold ring + entry arrow + "joins here": ready-made killers join here
wheel.ring([4], 'entersAt', { source: false });            // same look, but display only (not a flow source; ch07 previews)
wheel.ring(THERAPIES_ACTS, 'acts', { transient: 2400 });   // shown, then fades after 2.4 s; does not touch the persistent set
wheel.ring([], 'acts');                                    // clear persistent 'acts' rings
```
Kinds are independent sets (`'also'` is skipped on a step that already has an `'acts'` ring). `'entersAt'` rings are also **flow sources** unless `source: false`: dots are emitted there, so the cycle runs downstream of the entry point even when an earlier step is broken (ch12-combinations "Engineered killers"). Use `source: false` when the figure must not imply an outcome.

### 1.3 Center status

`setCenter(null)` (the default) shows, from states and rings:
* nothing broken → "Cycle running"
* broken and not bypassed → "Stalled at step N:" / "<short name>" (N = `status.stalledAt`)
* broken but fed from an entry ring → "Running from step E" / "<short name of E>"

Pass your own text for anything else (`wheel.setCenter('Strong response\nevery step works')`). On the oval and mini layouts the status sits under the wheel: one line when it fits, else the two lines. It is not a live region: announce changes with `ctx.announce()`.

### 1.4 Interaction and accessibility

* Nodes are SVG buttons (`role="button"`, `tabindex="0"`) in tab order 1→7, with `aria-pressed` = selected and `aria-label` = "Step 1, Release: <what happens>" plus the state ("broken", "weak", "not needed", "engineered recognition", "repaired"). Enter/Space activate; ←/→ (and ↑/↓) move focus around the wheel. Hit areas are ≥ 44 px on phones.
* `density: 'locator'`: activating a node also shows `ctx.tooltip` with "Step N · <full name>" (ch12-resistance spec: "tapping a node shows its full name").
* Node labels are one word with the step number ("2 Presentation"); the full name is in `STEPS[i].name`.

### 1.5 Stepper safety, motion, themes

* The wheel animates itself with standalone GSAP tweens. **Call its methods from the stepper's `onChange(i)` (state that depends only on `i`), never inside `enter(tl)`.** End states are deterministic, so `tools/stepper-check.mjs` passes. Pass `{ instant: true }` to skip the animation.
* Flow dots run on `ctx.loop` (paused off-screen and in hidden tabs) and carry `data-ambient`, so stepper-check ignores them. They exist (hidden) under reduced motion too, so element trees match.
* **Reduced motion:** no dots; arrows become static dotted lines; state changes and fades are instant; `pulse()` and transient rings show a still ring for their duration.
* **Themes:** colors are CSS variables (`--fg`, `--line`, `--halo` …) and art uses `ctx.artStage`, so the wheel works on dark stages (identical in both page themes) and on light stages (it redraws on `ctx.onThemeChange`).
* **Phones:** below 540 px the wheel switches to the oval layout (labels inside the loop, status under it) and below 330 px to the mini layout, so text stays ≥ 13 px and nothing overflows at 390 px (or in a 240 px locator).
* Performance: 7 art glyphs (~150 SVG nodes), ≤ 30 flow dots moved by `transform` only, no filters except one shared glow gradient.

### 1.6 Minimal example (ch12-resistance style)

```js
import { createCycleWheel } from './shared/cycle-wheel.js';
import { mechanism } from './shared/cycle-data.js';

export default function mount(fig, ctx) {
  ctx.setAspect('auto');
  const box = ctx.h('div', { class: 'my-wheel-cell' });
  ctx.stage.append(box);
  const wheel = createCycleWheel(ctx, box, { density: 'locator', size: 420 });
  const show = (id) => { const m = mechanism(id); wheel.setStates(m.states); wheel.halo(m.halo); };
  show('excluded');                                 // step 5 broken, step 4 weak
  // "Add anti-PD-1" switch: wheel.setStates(m.pd1.states); wheel.ring(PD1_RINGS.acts, 'acts'); wheel.ring(PD1_RINGS.also, 'also');
  wheel.onStep((n) => ctx.announce(`Step ${n}`));
}
```

---

## 2. `cycle-data.js`

All arrays are frozen. Step numbers are **1-based** everywhere. Text marked `[[term|explanation]]` is rich text: render with `richText()` (dotted-underline term + tooltip) or strip with `plainText()`.

### 2.1 `STEPS` (7) and `step(n | id)`

```js
{ n: 1, id: 'release', short: 'Release', name: 'Release of cancer antigens',
  location: 'tumor' | 'tumor-node' | 'node' | 'blood', where: 'Tumor',          // where = display string
  what: 'Cancer cells die and spill …',  breaks: 'Some tumors have few … [[a low mutation count|…]] …',
  escapes: ['Hide'],                      // Chapter 7 escape routes that break or weaken this step
  chapter: 7 }
```
Ids are stable: `release, presentation, priming, trafficking, infiltration, recognition, killing`. `what` / `breaks` are the Chapter 7 spec text, verbatim.

`BANDS`: `[{ id: 'tumor', label: 'Tumor', from: 3.5, to: 8 }, { id: 'node', label: 'Lymph node', from: 1, to: 2.5 }, { id: 'blood', label: 'Blood', from: 2.5, to: 3.5 }]` in *positions* (step k sits at position k − 1; 7 ≡ 0).

### 2.2 `STATUS`: one string per claim

`STATUS[key] = { tag, text, chapter }`: `tag` is a short label for chips and badges, `text` the full status line. **Copy them verbatim** (FIGURE-AUDIT §7 red flags 1–2).

| key | `tag` | used by |
|---|---|---|
| `mrna-vaccine` | "Company-reported, not yet approved" | int-timeline, ch07-cycle, ch11-four-fixes, ch12-combinations (real-world card: `STATUS['mrna-vaccine'].text + ' (Chapter 11).'`). `text`: "A personalized mRNA vaccine given with pembrolizumab met its main goal in a phase 3 melanoma trial (company-reported, 2026); not yet approved" |
| `satri-cel` | "Approved in China, June 2026" | `text` (supervisor-verified, lower-case start for embedding): "approved in China (June 2026) for Claudin18.2-positive advanced stomach cancer — the first CAR-T approved for a solid tumor". Used inside `STATUS['car-t'].text` |
| one key per therapy (`radiation`, `vaccine`, `anti-pd1`, `car-t` …) | e.g. "Approved", "In trials", "Failed in phase 3" | ch07-cycle chips, ch12 tray |

`STATUS.vaccine.text` and `STATUS['car-t'].text` are **composed** from those two claim strings, so each claim exists once. `statusOf(therapyOrId)` → the STATUS entry for a therapy.

### 2.3 `THERAPIES` (15), `therapy(id)` and `FAMILIES`

```js
{ id: 'car-t', label: 'CAR-T cells', ch07: true, family: 'byo',
  acts: [],             // main sites (full gold ring)
  also: [],             // secondary sites (thin gold ring): anti-PD-1 → also: [3]
  skips: [1, 2, 3],     // steps it makes unnecessary
  replaces: [6],        // steps it performs by an engineered route (no MHC display needed)
  entersAt: 4,          // where its ready-made killers join the cycle (null if none)
  how: 'Ready-made T cells with a synthetic receptor …',          // one-line how (ch07 spec, verbatim)
  bypass: 'CAR-T cells are ready-made killers that join the cycle at step 4. They still have to travel, get in and kill.',
  status: 'car-t',      // STATUS key
  chapters: [10] }
```
Rule (checked at load): no therapy skips or replaces steps 4, 5 or 7.

**Anti-PD-1 / PD-L1** (SCIENCE-REVIEW M1, ch07 spec round 2): `acts: [6, 7]` (effector end, main), `also: [3]` (refuels priming/expansion from the stem-like reserve in lymph nodes and blood). Anti-CTLA-4 stays `acts: [3]`. `PD1_RINGS` = `{ acts: [6, 7], also: [3] }` for ch12-resistance's switch. Ids: `radiation, chemo-icd, oncolytic, vaccine, innate-agonist, anti-ctla4, il2, anti-vegf, tgfb-block, anti-pd1, anti-lag3, ido-inhib, car-t, til-tcrt, bispecific`. `ch07: true` marks the seven Chapter 7 chips.

`FAMILIES` (Chapter 7 tray order): `start` "Start the cycle" (radiation, vaccine) · `brakes` "Release the brakes" (anti-ctla4, anti-pd1) · `walls` "Lower the walls" (tgfb-block) · `byo` "Bring your own killers" (car-t, bispecific).

Chapter links (`chapters`): Ch 8 checkpoints (anti-CTLA-4, anti-PD-1, anti-LAG-3, IDO) · Ch 9 T-cell engagers · Ch 10 CAR-T, TIL/TCR-T · Ch 11 vaccines, oncolytic viruses · Ch 12 radiation, chemotherapy, innate stimulants (STING), IL-2, anti-VEGF, TGF-β blockers. `CHAPTERS[n]` → `{ n, href: '08-checkpoints.html', label: 'Chapter 8' }`; `chapterLink(n)` → `'→ Chapter 8'` HTML anchor string.

### 2.4 `therapyPreview(therapyId)` (Chapter 7 "Where Part III treatments act", display only)

Never computes an outcome (ch07 spec round 2: only ch12-combinations prescribes). Returns
```js
{ therapy,                       // the THERAPIES entry
  states,                        // engineered killers: skipped 1–3 ("not needed"), replaced 6 with tag "no MHC needed"; else []
  rings: { acts: [...], also: [...], entersAt: [...] },   // for wheel.ring(); show entersAt with { source: false }
  line,                          // "<label>: <how>", or the `bypass` text for engineered killers
  detail,                        // "It acts mainly at steps 6 and 7 (Recognition and Killing), and also at step 3, Priming." / "Still needed: 4 Trafficking, 5 Infiltration and 7 Killing."
  needs }                        // engineered killers: steps they still need ([4, 5, 7]; TIL/TCR-T [4, 5, 6, 7])
```

### 2.5 `MECHANISMS` (7, ch12-resistance chips) and `mechanism(id)`

```js
{ id: 'excluded', n: 5, title: 'Excluded', subtitle: 'Stroma keeps T cells at the edge',
  states: [{ step: 5, state: 'broken' }, { step: 4, state: 'weak' }],
  halo: null,                                     // host-factors: { dense: [2, 3], faint: [6] }
  pd1: { outcome: 'no', text: '✕ Not fixed — T cells still can’t get in', label: 'Not fixed — T cells still can’t get in', states: [...] },
                                                  // outcome: 'yes' | 'partial' | 'no' | 'varies' (ctx.ui.badge kinds); text = with glyph, label = without
  icon: 'shield',                                 // suggested ctx.iconSVG / icon() name (minus, x, padlock, bolt, shield, layers, tilde)
  ch07: 'Build walls', tme: 'excluded', profile: 'B', chapter: 12 }
```
Ids in chip order: `brake-on, nothing-new, shop-window, deaf, excluded, no-scouts, host` (titles and badge strings are the round-2 ch12-resistance spec's, verbatim; badge 6 is `'partial'` "≈ A little help at most — …"). `pd1.states` is the wheel state with the anti-PD-1 switch on (e.g. `brake-on` → step 7 `'repaired'`; `no-scouts` → step 7 weak with a higher `strength`); add the rings from `PD1_RINGS`.

### 2.6 `PROFILES` (A–D) and `TRAY` (7 tiles), ch12-combinations

```js
{ id: 'A', label: 'Inflamed but braked', term: 'Inflamed', mechanism: 'brake-on',
  strengths: [0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.2], description: 'T cells are inside and recognize the tumor, but PD-L1 brakes them.' }
```
B "Excluded" (mechanism `excluded`), C "Desert (cold)" (`no-scouts`), D "Inflamed but hidden (MHC loss)" (`shop-window`); labels and descriptions are the round-2 ch12-combinations spec's, verbatim. Show the mechanism's icon (A ↔ Brake on, B ↔ Excluded, C ↔ No scouts, D ↔ Shop window shut; FIGURE-AUDIT §2B).

```js
{ id: 'engineered', n: 6, label: 'Engineered killers', subtitle: 'CAR-T cells, T-cell engagers',
  therapies: ['car-t', 'bispecific'], add: {}, side: 2,
  acts: [], also: [], skips: [1, 2, 3], replaces: [6], entersAt: [4] }      // derived from THERAPIES
```
`add` = `{ step: delta }` (the spec's model numbers, exactly); `acts` / `also` / `skips` / `replaces` / `entersAt` are **derived from THERAPIES**, so the two chapters cannot disagree (e.g. the anti-PD-1 tile rings 6 and 7, thin-rings 3, but only adds to s7; the IDO tile rings 7 and adds nothing). `trayTile(id)` looks one up.

### 2.7 Model helpers

```js
evaluateCombination(profileId, tileIds) → {
  strengths,            // 7 numbers, capped at 1, rounded to 2 decimals; skipped / replaced = 1
  states,               // for wheel.setStates() (statesFromStrengths)
  control,              // min over steps
  tier: 'growing' | 'partial' | 'strong',      // < 0.40 | 0.40–0.69 | ≥ 0.70
  limiting,             // first step (clockwise from 1) at the minimum
  sideEffects, sideTier: 'manageable' | 'substantial' | 'too-much',   // ≤ 2 | 2.5–4 | > 4
  rings: { acts: [{ step, count }], also: [...], entersAt: [...] } }

statesFromStrengths(strengths, { skips = [], replaces = [] }) → [{ step, state, strength }]
```
All the spec's sanity checks hold (A + anti-PD-1 → strong; B never reaches strong; D + engineered killers + anti-PD-1 → strong 0.80; IDO adds nothing …); `selfTest()` asserts them (and the Chapter 7 preview mappings) and returns `[]` when all pass: `node -e "import('./assets/js/figures/shared/cycle-data.js').then(m => console.log(m.selfTest()))"`.

### 2.8 Text helpers

```js
richText('Walls. … the signal [[TGF-β|A scarring signal …]] helps …') → [{ text }, { term: 'TGF-β', note: 'A scarring signal …' }, { text }]
plainText(str) → string without markup (for aria-labels)
```
