# `shared/unit-grid.js`: unit grids ("out of 100")

One small mark per unit (a cell, a person, a mutation, a T-cell candidate) in a grid, with tweenable states. FIGURE-AUDIT §4.18: show attrition *in the scene*, then show the endpoint as a unit grid. Users: ch01-census, ch05-thymus, ch06-typo-to-target (100-bead scoreboard), ch08-tail, ch11-hpv, ch11-four-fixes. Owner: **P3**. Works on light and dark stages (colors are CSS custom properties; see [`chart.md`](chart.md) §0 for the `C` tokens).

```js
import { unitGrid } from './shared/unit-grid.js';
import { C } from './shared/chart.js';
```

## Signature

```js
const grid = unitGrid(g, {
  count,                       // number of units
  cols,                        // units per row (default: ceil(sqrt(count)))
  size = 10,                   // unit cell size (px of your viewBox)
  gap = 3,                     // space between cells
  shape = 'square',            // 'square' | 'circle' | 'person' | 'bead'
  x = 0, y = 0,                // top-left of the grid
  order = 'rows',              // fill direction: 'rows' (left→right, then down) | 'columns' (top→bottom, then right)
  group = () => 0,             // (i) → group key (string or number) for unit i
  color = C.s1,                // CSS color, or { [group]: color }, or (group, i) → color
  state = 'filled',            // initial state for all units (or any form accepted by setStates)
  radius,                      // square corner radius (default size × 0.18)
  label,                       // optional accessible description of the whole grid (role="img")
});
```

Returns:

| | |
|---|---|
| `grid.el` | `<g class="ug">` |
| `grid.units` | `[{ i, group, g, x, y, state }]`; `x`, `y` = cell center relative to the grid origin |
| `grid.width`, `grid.height` | grid size in px (for the initial layout) |
| `grid.setStates(states, anim)` | change unit states (below) |
| `grid.highlight(sel, anim)` | spotlight a group: `sel` = group key, array of keys, `(unit) → bool`, or `null` to clear. Others fade to `anim.dim` (default 0.22) |
| `grid.relayout(fn, anim)` | move units: `fn(unit, i) → { x, y }` (new center, grid-relative) or `null` to stay. Returns nothing |
| `grid.stateOf(i)` | target state of unit `i` after the last `setStates` call |
| `grid.count(state)` | how many units are in `state` (targets) |
| `grid.cols`, `grid.rows`, `grid.pitch` | layout (`pitch` = size + gap) |
| `grid.cellCenter(i, cols = grid.cols)` | grid-relative center of cell `i` in a `cols`-wide arrangement: handy for `relayout` (e.g. re-flow 100 units from 10 to 20 columns) |

If `g` is not inside a `chartRoot()` group, `unitGrid` creates one, so the `C.*` tokens always resolve.

`anim` = `{ tl, at = 0, duration = 0.45, ease = 'so.inOut', stagger = 0, from = 'start' }`: with `tl` the tweens are appended to that timeline (stepper-safe); without `tl` and with `duration` they run standalone (instant under reduced motion); `{ duration: 0 }` sets instantly. `stagger` = seconds between consecutive units (in reading order, or `from: 'end' | 'center' | 'random'`, seeded so it is the same every time); only units whose state actually changes take part in the wave.

## States

| State | Look | Use |
|---|---|---|
| `'filled'` | solid shape in the unit color | counted / present |
| `'outline'` | hollow outline | possible but not realized |
| `'check'` (alias `'outline+check'`) | outline with a ✓ inside | passed a test / recognized |
| `'dim'` | solid at ~20 % | context, the rest of the 100 |
| `'hatch'` | 45° hatch + outline | uncertain / partial / "illustrative" share |
| `'hidden'` | nothing | units that fall away (fade out) |

`states` can be:
* a string (all units), e.g. `'dim'`;
* an array of states, one per unit;
* an object `{ [group]: state }` (groups not listed keep their state);
* a function `(unit, i) → state | undefined`.

Every state is a set of opacities on stacked shapes, so any change is an ordinary tween and steppers can seek through it. Meaning never rests on color alone: pair colors with states (fill vs outline vs check vs hatch) or with direct labels.

## Shapes
* `square`: rounded square (default).
* `circle`: dot.
* `person`: head + shoulders pictogram, sized to the cell (people in a trial, ch08-tail / ch11-hpv).
* `bead`: a dot with a soft highlight, like the peptide beads in the art library (ch06-typo scoreboard).

## Example: "about 2 in 100 mutations are recognized"

```js
const svg = ctx.createSVG({ viewBox: '0 0 760 120' });
const g = chartRoot(svg);                                    // from chart.js: sets the theme tokens
const grid = unitGrid(g, { count: 100, cols: 50, size: 11, gap: 3, shape: 'bead', x: 20, y: 30,
  group: (i) => (i === 17 || i === 62 ? 'seen' : 'rest'),
  color: { seen: C.fill('neo-peptide'), rest: C.ink3 }, state: 'hidden' });
ctx.ui.stepper({ steps: [
  { enter(tl) { grid.setStates('outline', { tl, stagger: 0.008 }); } },
  { enter(tl) { grid.setStates({ seen: 'filled', rest: 'dim' }, { tl, duration: 0.6 }); grid.highlight('seen', { tl, at: 0.3 }); } },
] });
```

## Notes
* Up to ~500 units animate smoothly in SVG (each unit is a `<g>` with up to four small shapes). For thousands, draw on canvas.
* `relayout` moves the unit `<g>` with GSAP `x`/`y`; `highlight` tweens the unit `<g>` opacity; `setStates` tweens the inner shapes. These never fight, so you can combine them in one step.
* Hatch patterns are created once per color in the owning `<svg>`'s `<defs>` (unique ids).
* Add direct labels with `directLabel()` from `chart.js` (e.g. "about 2 in 100") rather than a legend.
