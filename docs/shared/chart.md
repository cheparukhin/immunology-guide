# `shared/chart.js`: the chart kit

Lightweight SVG primitives for every data chart on the site (ch03-numbers, ch03-clonal-selection, ch05-exhaustion, ch06-tmb, ch07-evidence, ch07-immunoediting, ch08-tail, ch10-crs, ch10-journey, ch10-logic-gates, ch11-hpv, ch12-ctdna). Owner: **P3**. Unit grids ("out of 100") live in [`unit-grid.md`](unit-grid.md).

Reference users: `assets/js/figures/ch07-evidence.js` (dot chart + stepper + re-sort + detail card) and `assets/js/figures/ch06-tmb.js` (quantile dot strips, 29 rows, show-all, sort/filter).

```js
import {
  C, fmt, scale, chartRoot, axis, line, pathD, bars, marker, markerPath, whisker, hatchFill, band, threshold,
  axisBreak, directLabel, placeLabels, rows, cursor, chartFrame, legendHTML, tweenTo, tweenFromTo,
} from './shared/chart.js';
```

The kit does **not** own the stage, the stepper or the controls: you still call `ctx.createSVG`, `ctx.ui.stepper`, `ctx.ui.segmented` … The kit draws marks and returns plain handles.

---

## 0. Conventions (read once)

* **Geometry is in SVG user units (px of your viewBox).** Primitives never guess a scale: map data with `scale()` and pass pixels. Only `axis` and `cursor` take a scale, because they need ticks / inversion.
* **Colors are CSS custom properties**, so a light-stage chart follows the page theme with no redraw, and the same code draws dark-native on a dark stage. Use the `C` tokens (below) or any CSS color string. Never `ctx.colors.*` hex values inside kit marks (they would freeze the theme).
* **Text uses the site classes** (`t-label`, `t-small`, `t-caps`, `t-num` …), so it never renders below ~13 px on phones. Never rotate text.
* **Animation.** Every method that moves or reveals something takes `{ tl, at, duration, ease, delay }`:
  * `tl` given → the tween is **appended to that GSAP timeline** at position `at` (stepper-safe: it uses `tl.to`/`tl.fromTo` only, no `call()` state);
  * no `tl`, `duration > 0` → a standalone tween (instant under `prefers-reduced-motion`);
  * otherwise → instant `gsap.set`.
* **Handles.** Every primitive returns its root element(s) so you can tween them yourself. Don't drive the same property from two systems (e.g. a row's `y` belongs to `rows`).
* Kit CSS (classes `ck-*`) is injected once by the module; you never write CSS for kit marks.
* **Ids are deterministic.** Every `<defs>` id the kit creates (hatch patterns, dashed-line clip wipes) is `ck-<figure id>-<svg index>-<kind>-<hash of the spec>`: independent of page load order, unique per figure and svg, and reused when the same def is requested again in the same svg. The svg gets a `data-ck-key` attribute. Use `defId()` for your own defs if you want the same guarantee (`ctx.radialGradient`/`ctx.linearGradient` ids come from a page-wide counter).

### Themes
`chartRoot(parent, { theme })` creates the `<g class="ck ck--light|ck--dark">` that every chart should live in. `theme: 'auto'` (default) reads the enclosing stage: `data-stage="dark"` → `'stage-dark'`, else `'light'`. All `C.*` tokens resolve inside it:

| Token | Light stage (follows page theme) | `stage-dark` (FIGURE-AUDIT §4.1) |
|---|---|---|
| `C.s1 … C.s5`, `C.series(i)` | `--chart-1…5` | dark-theme chart ramp (same hues, lifted) |
| `C.ink`, `C.ink2`, `C.ink3` | `--fg`, `--fg-2`, `--fg-3` | stage-dark inks |
| `C.grid`, `C.axis`, `C.muted` | `--chart-grid`, `--chart-axis`, `--chart-muted` | stage-dark equivalents |
| `C.surface` | stage background (`--halo`): marker rings, label halos | |
| `C.accent` | `--accent` | stage focus blue |
| `C.hover` | 5 % ink wash (row hover / selection band) | |
| `C.stroke(name)` | entity line/text color: `-deep` variant in the light page theme, base in the dark theme (e.g. `C.stroke('virus')`) | base color |
| `C.fill(name)` | entity fill (`--c-<name>`) | same |

Entity names are the palette keys in kebab case (`cd8`, `virus`, `neo-peptide`, …). FIGURE-AUDIT §4.20: series use `C.s1…5` unless the series *is* an entity.

If you also draw with `ctx.colors` (canvas, gradients), redraw in `ctx.onThemeChange`. Kit marks themselves need no redraw.

### Formatting: `fmt`
| | |
|---|---|
| `fmt.num(v, { digits })` | locale-free, thousands comma: `fmt.num(175732)` → `175,732`; `digits` = decimals |
| `fmt.smart(v)` | ≥ 10 → integer with commas; ≥ 1 → 1 decimal; < 1 → 2 significant figures (`0.03`, `0.85`) |
| `fmt.sig(v, n = 3, { max = 2 })` | n significant figures, at most `max` decimals: `14.9`, `0.10`, `1.20`, `36.7` |
| `fmt.times(v)` | `61×`, `2.1×`, `0.9×` (whole numbers from 10, one decimal below) |
| `fmt.range(a, b, { unit })` | `51–73×` (either end ≥ 10), `0.75–1.38×` (either end < 1: two decimals), else one decimal: `7.2–7.9×`; adds decimals until the ends differ (`2.06–2.14×`) |
| | All rounding is half-up and safe for binary fractions (`0.85` → `0.9`, unlike `toFixed`). |
| `fmt.minus(v)` | true minus sign for negatives |

---

## 1. Scales

```js
scale({ type = 'linear', domain: [d0, d1], range: [r0, r1], clamp = false }) → s
s(v) → px          s.invert(px) → value          s.type, s.domain, s.range
s.ticks(n = 5)     // linear: ~n "nice" values (1-2-5 steps)
s.ticks([1, 2, 5]) // log: every multiplier × each power of ten inside the domain → 0.5, 1, 2, 5, 10, 20, 50, 100
s.copy({ range })  // same scale, new options
```
`type: 'log'` needs a positive domain. Ranges can be reversed (`range: [400, 40]` for a y axis).

## 2. Root and axis

```js
chartRoot(parent, { theme = 'auto', className }) → <g class="ck …">

axis(g, {
  scale, orient = 'bottom',      // 'bottom' | 'top' | 'left' | 'right'
  at,                            // px position of the axis line (y for bottom/top, x for left/right)
  ticks,                         // array of values, or a count (default scale.ticks())
  format = String,               // (v) → label text
  labels = true,                 // true | false | array of values | (v, i) → bool   (thin labels on phones, keep gridlines)
  grid = null,                   // [from, to] px across the plot → hairline gridline per tick
  emphasize = [],                // tick values that get a heavier reference gridline (e.g. 1×)
  line = true, tickSize = 5,     // axis rule and tick marks (tickSize 0 = none)
  title, note,                   // title (t-caps) and a smaller muted line under it; either may be an array of lines (wrap on phones)
  titleAlign = 'middle',         // bottom/top: 'start' | 'middle' | 'end'; left/right titles sit above the axis, horizontal
  labelClass = 't-small t-num',
}) → { el, ticks: [{ value, pos, grid, tick, label }], title, note }
```
Left/right axis titles are placed **above** the axis, horizontally (DESIGN §8: never rotate text).

## 3. Marks

```js
line(g, pts, { curve = 'linear', color = C.s1, width = 2, dash, opacity, area, drawIn = false, className })
  // pts: [[x, y], …] or [{ x, y }, …] in px.  curve: 'linear' | 'monotone' | 'step'
  // area: { base: px, opacity = 0.1 } → a soft wash under the line (10 %, never a block)
  // drawIn: true → starts undrawn; reveal with handle.drawIn(opts) (solid: DrawSVG; dashed: a left-to-right clip wipe, so the dash survives)
  → { el, path, area, d, set(pts, anim), drawIn(anim = { duration: 1.4 }) }

pathD(pts, curve) → 'M…'    // the path string, for your own tweens (e.g. MorphSVG)

bars(g, items, { orient = 'h', thickness = 16, radius = 4, base, color = C.s1, whiskers = false, className })
  // items: [{ id, at, from = base, to, low, high, color }] — at = px center across; from/to = px along the value axis
  // Bars are ≤ 24 px thick, rounded only at the data end, square at the baseline. whiskers: draw low–high with caps.
  → { el, items: [{ id, el, bar, whisker }], grow(anim) }      // grow: from the baseline (stagger: anim.stagger)

marker(g, { shape = 'circle', x = 0, y = 0, r = 5, color = C.ink2, fill = true, width = 1.5, dash, ring = true, className })
  // shape: 'circle' | 'square' | 'diamond' | 'triangle' | 'ring'. fill: true (solid) | false (hollow outline)
  // ring: 2 px surface-colored halo so markers stay legible over lines and each other
  → <g class="ck-marker"> positioned with transform; .shape is the path

markerPath(shape, r) → path d centered on 0,0 (same geometry as marker(); used by legendHTML)

whisker(g, { x0, x1, y, cap = 6, color = C.ink2, width = 1.5 })      // horizontal range with end caps
whisker(g, { y0, y1, x, cap, color, width })                           // vertical
  → <g class="ck-whisker">

hatchFill(node, color = C.ink2, { spacing = 4, width = 1.2 }) → 'url(#…)'   // 45° hatch pattern, created once per <svg> and color
defId(node, kind, spec) → 'ck-<figure>-<svg#>-<kind>-<hash>'   // deterministic, collision-free id for your own <defs> in the kit's style

band(g, { x0, x1, y0, y1, label, hatch = false, color = C.ink, opacity = 0.05, labelPos = 'top-start' })
  // phases / regions behind a chart; label in t-caps inside the top edge
  → { el, rect, label }

threshold(g, { y, x0, x1, label, labelPos = 'end', dash = true, strong = false, color = C.ink2 })   // horizontal
threshold(g, { x, y0, y1, label, labelPos = 'top', dash, strong, color })                            // vertical
  // strong: heavier solid reference line (e.g. the 1× "no change" line)
  → { el, line, label }

axisBreak(g, { x, y, orient = 'h', size = 8 })   // two slanted strokes with a surface gap; orient = direction of the broken axis
  → <g>

directLabel(g, { x, y, text, sub, anchor = 'start', dx = 8, dy = 0, key, color, leader, className = 't-label', halo = true })
  // key: 'line' | 'dot' | null — a small colored mark before the text (text itself stays ink: never series-colored)
  // leader: [x, y] → thin leader line from the label to that point (ends in a leader-dot)
  // sub: second line in t-small
  → <g class="ck-label">

placeLabels(list, { minGap = 18, min = -Infinity, max = Infinity }) → list
  // list: [{ y, … }] → nudges y values apart (1-D relaxation, order kept). Use before directLabel for end labels.
```

## 4. Interactive rows: `rows(g, opts)`

Focusable row bands for dot charts, strips, bar lists. Each row is one keyboard stop in a roving group; the band spans the label column and the plot.

```js
const R = rows(g, {
  items,                    // [{ id, …anything }]
  x0 = 0, x1,               // band extent (px)
  top = 0, rowH = 30,       // initial layout: row i at top + i * rowH
  labelW = 180,             // label column width; labels are right-aligned at x0 + labelW - labelPad
  labelPad = 12,            // gap between label and plot (widen it to fit a tag column, as ch06-tmb's "C" tags)
  label = (it) => it.label, // string, or array of lines (2 lines max)
  wrap = 0,                 // > 0: auto-wrap labels at this many characters into ≤ 2 lines
  labelClass = (it) => '',  // extra classes per label (e.g. 'is-strong', 'is-muted')
  glyph = null,             // (it) → { el: <g>, width } drawn just left of the label (measured), or null
  ariaLabel = (it) => …,    // accessible name per row (default: label text)
  name = 'Rows',            // accessible name of the group
  selectable = () => true,  // (it, i) → bool; non-selectable rows are skipped by keys and ignore pointer
  hoverSelects = true,      // mouse hover selects (touch: tap; keyboard: Enter/Space)
  onSelect,                 // (item | null, row | null) → void
  onFocus,                  // (item, row) → void  (keyboard focus moved)
});
```
Returns:

| | |
|---|---|
| `R.el` | the group (`role="group"`) |
| `R.rows` | `[{ id, item, index, g, band, label, content, glyph, y }]`. **Draw your marks into `row.content`, whose y = 0 is the row's center line.** |
| `R.byId(id)` | row record |
| `R.select(id \| null, { silent })` | set the selected row (adds `is-selected`, `aria-pressed`); calls `onSelect` unless `silent` |
| `R.selected` | selected id or `null` |
| `R.focus(id)` | move keyboard focus |
| `R.place(fn, anim)` | `fn(row) → y` (px top of the row, or `null` to leave it); moves rows (stepper-safe with `anim.tl`; `anim.stagger` seconds per row) |
| `R.order(ids, { top, rowH, gaps = {} }, anim)` | convenience: stack `ids` in order from `top`; `gaps[id]` adds space *before* that row. Returns the bottom y |
| `R.yOf(id)` | the row's target top y (after the last `place`/`order`) |
| `R.setInteractive(fn)` | re-evaluate `selectable` (e.g. per step) |
| `R.labelWidth(id)` | rendered label width (first line) |

Row labels are 14 px (≥ 13 px rendered on phones); set `--ck-row-fs: 13px` on your `<svg>` for denser lists.

Keyboard (focus inside the group): ↑/↓ move by *visual* order, Home/End, Enter/Space select, Escape clears. Pointer: hover selects with a mouse (if `hoverSelects`), tap/click selects, tapping the selected row keeps it. The band shows hover/selected/focus states (`C.hover` wash, focus ring). Row positions are GSAP `y` transforms owned by `rows`; tween opacity on `row.g` freely.

## 5. Cursor (scrubber): `cursor(ctx, g, opts)`

An ARIA slider over a plot: pointer, touch and keys.

```js
const cur = cursor(ctx, g, {
  scale,                     // x scale (data → px)
  domain = scale.domain,     // allowed values
  step = 1,                  // snap + arrow-key step (Shift / PageUp/PageDown = × 10)
  value = null,              // initial value (null = rule hidden until used)
  y0, y1,                    // vertical extent of the rule and hit area (px)
  label = 'Cursor',          // aria-label
  format = String,           // aria-valuetext and announcements: (v) → 'Day 12'
  onMove,                    // (value, { source: 'pointer' | 'key' | 'api', clientPoint }) → void
});
// → { el, rule, value, set(v, { silent }), show(), hide() }
```
* The hit area uses `touch-action: pan-y`: vertical swipes still scroll the page; horizontal drags scrub.
* Keys: ←/→ step, Shift×10, PageUp/PageDown, Home/End, Escape hides. Values are announced (`ctx.announce`) on key moves only.
* `onMove` gets `clientPoint` (viewport px at the rule's top) for `ctx.tooltip.show(html, point)`.

## 6. HTML frame, legend, detail card, source line: `chartFrame(ctx, opts)`

Charts with real data need a source line, a legend and a detail card. `chartFrame` lays them out inside the stage and sets `ctx.setAspect('auto')` (the stage height comes from the content: legend, chart, slot, source):

```js
const F = chartFrame(ctx, {
  toolbar = false,     // true → a row at the top of the stage for in-stage controls (ctx.ui.* with { parent: F.toolbar })
  source = '',         // source line (ink-3, 12 px), always visible under the chart (FIGURE-AUDIT §4.19)
  cardHint = '',       // placeholder shown in the detail card when nothing is selected ('' = card collapses when empty)
  cardWidth = '18rem', // width of the card when it sits beside the stage
  card = true,         // false → no detail card
});
const svg = ctx.createSVG({ viewBox: '0 0 760 520', parent: F.main, interactive: true, label: '…' });
F.legend(items)                         // legend above the chart (items: see legendHTML); [] removes it
F.card.show({ title, lines: [html…], note, source, kicker }, { onClose })   // or F.card.show(htmlString)
F.card.hide({ silent })                 // calls the onClose you passed to show() unless silent
F.card.open                             // boolean
F.setSource(text)
F.el, F.toolbar, F.top, F.main, F.below, F.sourceEl   // slots: toolbar → top (legend) → main (svg) → below → source
```
* **The card is the foundation's `ctx.ui.infoCard`** (beside the stage when the figure is ≥ 900 px wide, an inline panel under the stage otherwise, × close button on phones). `lines` render in tabular Inter (`<span class="k">Label:</span>` for muted keys), `note` in the card's body face, `source` as a 12 px per-mark source line (§4.19). If `ctx.ui.infoCard` is missing, a local panel under the chart is used with the same calls.
* `onClose` runs when the reader closes the card (× button, or `hide()` without `silent`): deselect your row there.
* Card content is inserted as HTML from **your own constants only** (titles are escaped).
* Put anything else (sort controls, "Show all" buttons, a legend that appears later) into `F.top` / `F.below` or right after `F.main` (`F.main.after(el)`). Prefer **under** the chart for things that appear mid-stepper: nothing above the chart should move between steps.

`legendHTML(items)` → `<ul class="ck-legend">`; items `{ label, shape: 'circle'|'square'|'diamond'|'triangle'|'ring'|'line'|'tick', fill = true, color, dash }`. Shapes match `marker()` (and `tick` = a short vertical median mark), so the legend shows exactly what the chart draws. Use it instead of `ctx.ui.legend` when you need hollow/dashed/diamond keys. Text stays in ink colors; only the key carries the series color.

## 7. `tweenTo(target, vars, anim)`, `tweenFromTo(target, from, vars, anim)`
The kit's animation switch, exported for your own marks: `tweenTo(el, { opacity: 1 }, { tl, at: 0.2, duration: 0.6 })`. Follows the rules in §0.

---

## Example: a minimal log-scale dot chart with a stepper

```js
import { C, fmt, scale, chartRoot, axis, threshold, marker, rows, chartFrame, tweenTo } from './shared/chart.js';
export default function mount(fig, ctx) {
  const F = chartFrame(ctx, { source: 'Data: …', cardHint: 'Tap a row for details.' });
  const svg = ctx.createSVG({ viewBox: '0 0 760 300', parent: F.main, interactive: true, label: 'Dot chart' });
  const g = chartRoot(svg);
  const x = scale({ type: 'log', domain: [0.5, 100], range: [200, 720] });
  axis(g, { scale: x, at: 260, ticks: x.ticks([1, 2, 5]), format: (v) => fmt.times(v), grid: [20, 260], emphasize: [1], title: 'Times as common' });
  const R = rows(g, { items: DATA, x0: 0, x1: 740, top: 20, rowH: 30, labelW: 190, onSelect: (it) => it ? F.card.show({ title: it.label, lines: [fmt.times(it.v)] }) : F.card.hide() });
  const dots = R.rows.map((r) => marker(r.content, { x: x(1), r: 5, color: C.ink2 }));
  ctx.ui.stepper({ steps: [
    { enter(tl) { dots.forEach((d, i) => tl.fromTo(d, { x: x(1) }, { x: x(DATA[i].v), duration: 0.6, ease: 'so.out' }, i * 0.03)); } },
  ] });
}
```
(`marker` positions with GSAP `x`/`y`, so tween `x`/`y` on it, not `attr: transform`.)

## Stepper safety, reduced motion, performance
* All kit tweens appended to a stepper `tl` are `fromTo`/`to` with explicit end values; `stepper-check` passes as long as you don't also change the same property in `onChange`.
* Selection, hover and the detail card are **not** timeline state: keep them out of `enter()`. Clear or keep the selection in `onChange(i)` (deterministic per step).
* To re-sort outside the stepper (a "Sort" control after the last step), tween with `R.order(ids, …, { duration })`, then call `stepper.rebuild()` once the tween ends, with your step code reading the new order (see ch07-evidence). Or rebuild first and animate from the old positions with a standalone `fromTo` (see ch06-tmb `setView`): the rebuilt timeline already holds the end state.
* Reset such free-play variables to their defaults in `onChange(i)` when the reader goes back before the last step, then `rebuild()`.
* Under reduced motion every standalone kit tween becomes a `set`; stepper tweens are skipped by the stepper itself.
* SVG is fine for ~1,000 static marks (ch06-tmb draws ~600 dots). Animate groups (rows), not individual dots, when you can.
