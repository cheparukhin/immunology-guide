# `shared/synapse.js`: the molecular gap between two cells

Owner: **P4**. Built on the art library's `synapse` + `placeAlong` + `DOCK_GAP` geometry. Users: ch08-blockade (primary), ch04-three-signals contact band, ch05-kill lens, ch10-build-a-car membrane. Live sandbox: `/_kit-demo.html`.

Two membranes face each other across a narrow gap: the **top** cell (the T cell or CAR-T cell, glyphs facing down) and the **bottom** cell (target or presenter, glyphs facing up). Receptor/ligand **pairs** sit across the gap and can be *apart* (tilted, heads separated) or *engaged* (upright, heads meeting at the `DOCK_GAP` geometry, with the pair's signal disc on the T-cell side). Only recognition pairs (`tcr-mhc`, `car-antigen`) also get the recognition ring at the junction (FIGURE-AUDIT §4.5); brake and co-stimulation pairs never do (§4.7, §4.8).

```js
import { synapseScene } from './shared/synapse.js';
```

## Signature

```js
synapseScene(parent, {
  top = { color: 'cd8' },          // T-cell side (membrane + TCR color)
  bottom = { color: 'cancer' },    // target / presenter side
  pairs = [],                      // [{ kind, n = 1, x, peptide = 'neo', coreceptor = null, antigen }]
  size = 40,                       // glyph height in user units (≥ 24 for high detail)
  width = 480,                     // membrane length
  gap,                             // membrane-to-membrane gap (default: max DOCK_GAP of the kinds × size)
  thickness = 12, depth = 46,      // bilayer thickness, cytoplasm tint depth
  x = 0, y = 0, rotate = 0,        // placement in `parent` (rotate -90: T cell on the left)
  stage = 'dark', seed = 1,
  life = [2, 4],                   // engaged bonds release and re-form every 2–4 s (ambient, needs ctx)
  ctx,                             // optional: registers idle motion with ctx.ambient (off-screen pause, reduced motion)
}) → Synapse
```

**Pair kinds** (top glyph – bottom glyph, signal):

| `kind` | Top (T side) | Bottom | Signal disc on the T side when engaged |
|---|---|---|---|
| `'tcr-mhc'` | `tcr` (+ CD3) | `mhc1({ peptide })` | green-cyan **+**. Only copies whose peptide is foreign (`'neo'`, `'viral'`, `'foreign'`, hot pink) engage; `'self'` copies stay apart (the TCR reads peptide + groove). `coreceptor: 'cd8'` adds a CD8 stalk that grips the side of the MHC ("a second grip"). |
| `'pd1-pdl1'` | `pd1` | `pdl1` | crimson **−** (rule 7: plug interlocked in socket, one "−" disc) |
| `'cd28-b7'` | `cd28` | `b7` | **+** (rule 8: the "+" belongs to CD28; B7 has no icon) |
| `'ctla4-b7'` | `ctla4` | `b7` | **−** |
| `'car-antigen'` | `car` | `antigen({ shape, color })` (`antigen` option; default circle) | **+** |
| `'lfa1-icam1'` | LFA-1 (bent integrin) | ICAM-1 (beaded stalk) | none: the adhesion ring that seals the synapse |

`n` copies per entry; `x: [..]` gives explicit positions along the membrane (else spread evenly over the middle 80 %, entries in order). `peptide` may be an array, one per copy.

## Returned object

| Member | |
|---|---|
| `el` | root `<g>` (positioned by `x`, `y`, `rotate`) |
| `info` | `{ topY, bottomY, gap, size, width, thickness }` in the scene's own frame |
| `pairs` | `{ [kind]: [{ kind, i, x, top, bottom, peptide, matched }] }` (`top`/`bottom` = the glyph elements) |
| `engage(kind, on = true, { tl, pos, duration = 1, stagger = 0.12, which })` | Heads meet (or part). `which: (pair) => bool` limits the copies. Capped pairs never engage. |
| `cap(kind, side = 'top', ab = {}, { tl, pos, duration = 1.6, stagger = 0.2, which, tilt = 15 })` → `<g>[]` | Drug antibodies (`antibody({ variant:'therapeutic', ...ab })`, rule 9) drift in and cap the `side` glyph's head with one arm tip, Fc pointing away; those pairs part and stay apart. Each docked antibody is swung `tilt`° about its capping tip, so its free arm clears the pushed-aside partner (it never reads as gripping both). |
| `setDisplay(on, { tl, pos, duration = 0.9 })` | The MHC "shop windows" (bottom of `'tcr-mhc'`) sink away (rule 3: a shut window is **absent** cups) or return. TCRs disengage while the display is off. |
| `pulses(on = true, { kinds, every = 1.4 })` | Ambient signal pulses (a bright bead travels from the junction into the T cell: + kinds green-cyan, − kinds crimson) on **engaged** pairs only. Loops run through `ctx.ambient` (needs `ctx`). |
| `deliver({ tl, pos, x = 0, pores = [-18, 18], granzymes = 5, perPore = 5, duration = 3.6 })` → Span & `{ granule, pores, granzymes, marks }` | Lens-scale kill (rule 6): a dark-blue granule (perforin + granzyme beads with scissors marks) docks at the T-cell membrane at `x` and fuses. Perforin then works in **three beats**: single molecules cross the cleft and **latch** flat onto the bottom membrane, **gather** into a ring (side view: a tight row of staves on the surface over each pore site in `pores`), then **plunge** through the bilayer to open a hole. Granzymes wait in the cleft. `marks: { fused, latched, ring, open }` are times on `tl` (sync labels, a top-view ring inset, the clock). |
| `admit({ tl, pos, duration = 2.4 })` → Span | Granzymes slip through the pores into the bottom cell. |
| `repair({ tl, pos, stagger = 0.5 })` → Span | The bottom cell patches its pores one by one. |
| `point(kind, i, where = 'junction')` → `{ x, y }` | A pair's junction / `'top'` / `'bottom'` / `'coreceptor'` head, in **parent** coordinates (labels, leaders). |
| `local(x, y)` → `{ x, y }` | Any scene-frame point in parent coordinates (`'pore'` positions etc.). |

Every animating method takes `{ tl, pos }`: with `tl` it appends to that timeline (**stepper-safe**: explicit from→to values on dedicated wrapper groups); without it, it animates immediately and returns the GSAP timeline (reduced motion: instant).

## Example (ch08-blockade style, ≤ 15 lines)

```js
const syn = synapseScene(svg, { ctx, x: 480, y: 270, width: 600, size: 44,
  top: { color: 'cd8' }, bottom: { color: 'cancer' },
  pairs: [{ kind: 'tcr-mhc', n: 2, peptide: 'neo' }, { kind: 'pd1-pdl1', n: 3 }] });
syn.pulses(true);
ctx.ui.stepper({ steps: [
  { enter: (tl) => syn.engage('tcr-mhc', true, { tl }) },
  { enter: (tl) => syn.engage('pd1-pdl1', true, { tl }) },
  { enter: (tl) => syn.cap('pd1-pdl1', 'top', {}, { tl }) },
] });
```

## Notes

* Labels are the figure's job; use `point()` for leader targets. Keep molecular names in a toggle or "i" chips (rule 22).
* Glyph sizes ≥ 24 give high detail; at the default 40 the CDR loops, sockets and plugs read clearly.
* Light stages: pass `stage: ctx.artStage` and rebuild on theme change.
* The scene draws at most ~40 molecule glyphs; fine for SVG.
* Wrapper structure per glyph: `pose` (engage/cap) › `display` (setDisplay) › `life` (ambient) › glyph. Don't tween those wrappers yourself; tween parts inside the glyph if needed.
