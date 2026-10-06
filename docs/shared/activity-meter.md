# `shared/activity-meter.js`: push/pull ledgers, gauges and segment meters

Owner: **P4**. One look for every "how active is this cell / how strong is this effect" readout. Users: ch05-brakes (ledger), ch08-blockade (gauge), ch08-two-brakes, ch10-build-a-car, ch10-logic-gates, ch11-four-fixes, ch12-resistance, ch12-combinations. Live sandbox: `/_kit-demo.html`.

Teaching-model outputs are **words, meters or tiers labeled "Illustrative", never percentages** (FIGURE-AUDIT §4 rules 17 and 19), so the meter carries an on-stage `Illustrative` tag by default and shows no numbers. Signs render as the site's **+** (green-cyan) and **−** (crimson bar) discs, so meaning never rests on color alone (rule 10).

```js
import { meter } from './shared/activity-meter.js';
```

## Signature

```js
meter(parent, {
  mode = 'ledger',            // 'ledger' | 'gauge' | 'segments'
  orient = 'h',               // 'h' | 'v' (ledger and segments)
  segments = [],              // ledger rows / named segment blocks: [{ id, label, sign: '+' | '-' | null }]
  zones = [],                 // bands along the net/value axis: [{ from, to, label }]
  domain,                     // value axis: ledger net [-1, 1]; gauge and segments [0, 1]
  count = 5,                  // 'segments' without named segments: number of blocks
  title = '',                 // small caps heading (1–4 words)
  net = 'Net effect',         // ledger: label of the summary row (null hides the row)
  tag = 'Illustrative',       // on-meter tag (null to hide it, e.g. when the stage already shows one)
  tone,                       // fill grammar (POLISH B6): 'benefit' (killer-blue; attack, activity, control) ·
                              // 'risk' (brake-crimson; harm, damage, side effects) · 'cancer' (violet; tumor burden) ·
                              // 'go' (green-cyan) · 'neutral'. Default: read from `title` ("risk", "damage", "side effect"
                              // → risk; "tumor cells" → cancer; else benefit), or, for an untitled HTML meter, from the
                              // heading element just before its host. Pass it explicitly when the title is ambiguous.
  color,                      // a CSS color overriding the tone (rarely needed)
  x = 0, y = 0,               // position when `parent` is an SVG element
  width,                      // default 300 (ledger h), 220 (gauge), 260 (segments)
  values,                     // initial values (see set)
}) → { el, width, height, set(values, opts), values, describe() }
```

* **`parent`**: an SVG element (the meter is drawn as a `<g>` in that frame, using the figure's `.t-*` text classes, so text stays ≥ 13 px) or an HTML element (the meter makes its own `<svg>`, 1 unit = 1 CSS px).
* **ledger**: one row per segment: sign disc, label, and a bar from a center line: `'+'` segments push right, `'-'` segments pull left. The summary row shows the net (Σ sign × value, clamped to `domain`) as a needle over the labeled `zones`.
* **gauge**: a half dial; `zones` are labeled arcs, the needle shows the value. Pass `segments` to show the + / − contributors as small discs under the dial (optional).
* **segments**: a row (or column) of blocks; named `segments` light individually (`values[id]` 0..1), otherwise `count` blocks fill up to the value.

### `set(values, { duration = 0.8, ease = 'so.inOut', tl, pos })`
* ledger / named segments: `{ [id]: 0..1, net? }` (net defaults to the signed sum; give it explicitly to decouple).
* gauge and plain segments: a number in `domain` (or `{ value }`).
* With `tl`, the tweens are appended to that timeline (**stepper-safe**: explicit from→to from the planned values, so back/jumps agree); without it, the meter animates now (reduced motion: instantly).

`describe()` returns a sentence for `ctx.announce()` ("TCR signal: strong push. PD-1: medium pull. Net effect: held back."), built from words (none / weak / medium / strong), never numbers.

## Example (≤ 15 lines)

```js
const ledger = meter(svg, {
  mode: 'ledger', x: 600, y: 60, title: 'T-cell activity',
  segments: [{ id: 'tcr', label: 'TCR signal', sign: '+' }, { id: 'cd28', label: 'CD28', sign: '+' },
             { id: 'pd1', label: 'PD-1', sign: '-' }],
  zones: [{ from: -1, to: 0, label: 'Off' }, { from: 0, to: 0.45, label: 'Held back' }, { from: 0.45, to: 1, label: 'Attack' }],
  values: { tcr: 0.7, cd28: 0.4, pd1: 0 },
});
ctx.ui.stepper({ steps: [
  { enter: (tl) => ledger.set({ tcr: 0.7, cd28: 0.4, pd1: 0 }, { tl }) },
  { enter: (tl) => ledger.set({ tcr: 0.7, cd28: 0.4, pd1: 0.8 }, { tl }) },
] });
```

## Notes

* **One look everywhere (POLISH B6).** Filled = the tone color; empty = a hairline track (outlined, nearly transparent), on dark and light stages alike. Ledger rows keep their sign colors (+ green-cyan, − crimson); the ledger's net bar takes the tone, or crimson when the net pulls below zero. Gauge: tone-colored arc over a hairline band.

* Colors come from CSS tokens (`--c-activate`, `--c-inhibit`, `--fg*`, `--line`), so the meter is right on dark stages, light stages and both page themes without redrawing.
* Keep labels to 1–3 words; the caption explains. Don't add numbers.
* The meter is `aria-hidden` like the rest of the stage; announce changes with `ctx.announce(m.describe())`.
* Size on phones: in an SVG with `.t-*` classes, re-create the meter in your compact layout (it is cheap) rather than scaling it down.
