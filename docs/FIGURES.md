# Building figures: the module contract

Every interactive figure on the site is one ES module, `assets/js/figures/<figure-id>.js`, loaded only when the reader scrolls near it. This document is the contract between those modules and the page. The reference implementations are worth reading in full before you start:

| File | Shows |
|---|---|
| `assets/js/figures/demo-stepper.js` | A step-through SVG explanation: GSAP timeline per step, phone re-layout, ambient idle motion, labels with leader lines |
| `assets/js/figures/demo-sim.js` | A canvas simulation with 200 art-library neutrophil sprites: `ctx.loop`, `ctx.canvas`, async `mount`, slider, play/pause, stats, legend, compact layout |
| `assets/js/figures/demo-chart.js` | A chart on a **light** stage that follows the page theme: axes, direct labels, draw-in, segmented control, and a pointer/touch/keyboard scrubber with a tooltip |
| `assets/js/figures/demo-kit.js` | The **UI kit** (§6b) in an explorer: card chips, a multi-select chip tray, `infoCard` beside/under the stage, ✓ ≈ ✕ ~ badges (card + on stage), `ctx.tag`, art cells with signal icons and drug antibodies. `demo-sim.js` also shows `ctx.ui.clock`, two stage tags and `playPause({ loop })` |
| `assets/js/figures/demo-hero.js` | A chapter **hero** figure drawn entirely with the art library (`tissueField`, `macrophage`, `bacterium`, `neutrophil`), with art animation helpers registered via `ctx.track` |

All of them run on `_sample.html` (built from `content/drafts/_sample.md`). Visual rules (stage types, colors, label sizes, phones) are in `docs/DESIGN.md` §8. Cells and molecules come from the illustration library in `assets/js/art/`, documented in `docs/ART.md` (see §14 below). `demo-stepper` draws its macrophage by hand only because its membrane morphs procedurally; use the library for everything it covers.

---

## 1. Quick start

```js
// assets/js/figures/ch04-example.js
export default function mount(fig, ctx) {
  ctx.setAspect(16 / 9, 4 / 5);                       // landscape on desktop, portrait on phones
  const svg = ctx.createSVG({ viewBox: '0 0 960 540' });
  const cell = ctx.svg('circle', { cx: 480, cy: 270, r: 90, fill: ctx.colors.cd8 }, svg);
  ctx.svg('text', { x: 480, y: 400, class: 't-label t-mid', text: 'Killer T cell' }, svg);

  ctx.ui.button({ label: 'Pulse', icon: 'play', onClick: () => {
    ctx.gsap.fromTo(cell, { scale: 1, transformOrigin: '50% 50%' }, { scale: 1.1, yoyo: true, repeat: 1, duration: 0.4 });
  } });

  return { destroy() {} };                            // optional
}
```

Then:

```bash
node tools/build-content.mjs --only 04          # (re)generate the page from the draft
node tools/shot.mjs --page 04-presentation.html --figure ch04-example --viewport desktop,mobile --theme light,dark
```

---

## 2. Where figures come from

Writers declare figures in their draft (`content/drafts/NN-slug.md`, format in PLAN §6):

```markdown
:::figure ch04-mhc1-pathway
title: The shop window
kind: stepper
stage: dark
steps:
  1. **Make** — The cell builds proteins from its genes.
  2. **Chop** — The proteasome cuts some of them into short peptides.
alt: A cell shown in cross-section…
:::
```

The build (`tools/build-content.mjs`) turns that into:

```html
<figure class="fig fig--wide" id="fig-4-2" data-figure="ch04-mhc1-pathway" data-stage="dark"
        data-kind="stepper" aria-labelledby="fig-4-2-title" aria-describedby="fig-4-2-desc">
  <header class="fig__head">
    <span class="fig__label">Figure 4.2</span>
    <span class="fig__title" id="fig-4-2-title">The shop window</span>
  </header>
  <div class="fig__stage" data-stage="dark">
    <div class="fig__fallback" id="fig-4-2-desc"><p>…alt text…</p></div>
  </div>
  <div class="fig__controls"></div>
  <figcaption class="fig__caption"></figcaption>
  <script type="application/json" class="fig-data">{ "id", "number", "title", "kind", "stage", "steps": [...] }</script>
</figure>
```

| Draft field | Where it goes |
|---|---|
| `title` | figure header (and `ctx.title`) |
| `stage` | `data-stage` → dark or light stage styling |
| `alt` | the fallback text. It is shown if JS fails, and is the screen-reader description once mounted |
| `steps` | `ctx.steps`: `[{ title, html, text }]`. Use them verbatim as stepper captions (`**Title** — caption` gives a title) |
| `caption` *(optional)* | a static caption paragraph under the figure |
| `width` *(optional)* | `wide` (default, up to 72rem), `text` (column width) or `full` (edge to edge) |
| `aspect` *(optional)* | initial stage aspect, e.g. `aspect: 16:9 4:5` (desktop, phone). Prevents layout shift before mount |
| `goal`, `spec`, `data`, `kind` | for you, the builder. `spec`, `goal` and `data` never reach the page |

Hero figures: frontmatter `hero: <figure-id>` puts a figure under the chapter title. If a `:::figure` block with that id exists, its alt text is used. Otherwise the hero is decorative (`aria-hidden`), so it must not contain controls.

Never hand-edit the generated HTML. If you need per-chapter CSS, create `assets/css/chapters/chNN.css` (the interlude uses `chapters/interlude-history.css`) and re-run the build. It gets linked automatically, and `tools/check.mjs` warns if it isn't.

---

## 3. The mount contract

```js
export default function mount(figureEl, ctx) → api | Promise<api> | undefined
// api (all optional): { destroy(), pause(), resume() }
```

* Called once, when the figure comes within ~900px of the viewport. `mount` may be `async`.
* The loader adds `is-loading` → `is-mounted` (or `is-failed`) classes to the `<figure>`.
* **Errors are contained.** If the module 404s, throws, or rejects, the figure shows its fallback text, the error is logged as `[figure <id>] failed to mount`, and the rest of the page keeps working.
* `pause()`/`resume()` are called when the figure leaves/enters the viewport or the tab is hidden/shown. You only need them for motion you manage yourself. `ctx.loop` and `ctx.ambient` pause on their own.
* `destroy()` is for completeness; pages never unmount figures today.

---

## 4. `ctx` reference

### Elements and data
| | |
|---|---|
| `ctx.el` | the `<figure>` |
| `ctx.stage` | `div.fig__stage`: draw here. `position: relative; overflow: hidden` |
| `ctx.controls` | `div.fig__controls`: `ctx.ui.*` factories append here by default |
| `ctx.caption` | `figcaption.fig__caption`: the stepper renders step captions here |
| `ctx.id`, `ctx.number`, `ctx.title` | e.g. `'ch04-mhc1-pathway'`, `'4.2'`, `'The shop window'` |
| `ctx.uid(kind)` | a page-unique id that does not depend on load order: `'<figure-id>-<kind>-<n>'` (n counts per kind, in call order). `ctx.ui.*` controls and the gradient/filter helpers use it; use it for your own SVG `<defs>`, labels and `aria-*` references instead of a module-level counter |
| `ctx.steps` | writer's step captions `[{ title, html, text }]` (HTML may contain glossary links; popovers work there) |
| `ctx.data` | the whole `fig-data` JSON |

### State (live getters)
| | |
|---|---|
| `ctx.reducedMotion` | `prefers-reduced-motion: reduce` |
| `ctx.compact` | stage narrower than 600px → use your phone layout |
| `ctx.width`, `ctx.height` | stage size in CSS px |
| `ctx.visible` | any part of the figure on screen |
| `ctx.theme` | page theme `'light' \| 'dark'` (the dark stage looks the same in both) |
| `ctx.colors` | palette read from CSS tokens (see below) |
| `ctx.artStage` | `'dark' \| 'light'`: the `stage` option for art-library factories (= `stageFor(fig)`; follows the page theme on light stages) |
| `ctx.hero` | `true` for a chapter-hero figure (§13) |

### Drawing helpers
| | |
|---|---|
| `ctx.createSVG({ viewBox, className, interactive, label })` | root `<svg>` that fills the stage. `svg.defs` is ready. `aria-hidden` unless `interactive: true` |
| `ctx.svg(tag, attrs, parent)` | create an SVG element. camelCase attrs become kebab-case (`strokeWidth` → `stroke-width`), and `text:` sets textContent |
| `ctx.h(tag, attrs, ...children)` | create an HTML element (`onClick`, `class`, `style`, `dataset`, `html`, `text`) |
| `ctx.radialGradient(svg, stops, opts)` / `ctx.linearGradient(...)` | returns `url(#id)`. `stops: [[offset, color, opacity?], …]` |
| `ctx.glowFilter(svg, { blur, strength })` | returns `url(#id)` for a soft glow. Use it on a few elements; prefer gradient halos for crowds |
| `ctx.canvas({ maxDpr = 2 })` | `{ el, g, width, height, dpr, clear(), fit() }`: canvas filling the stage, DPR ≤ 2, auto-resized before your `onResize` handlers. Draw in CSS px |
| `ctx.setAspect(desktop, compact?)` | stage aspect: numbers or `'16/9'`. `'auto'` = height from content |
| `ctx.addDust()` | faint drifting dust behind the drawing (dark stages); off for reduced motion and off-screen. **Heavy on full-width (`fig--full`) and very tall stages** (one large animated layer): use it on wide/text figures only, and skip it when the art library's `tissueField` / `particleField` already provides texture |
| `ctx.pxPerUnit(svg)` | rendered CSS px per SVG user unit |
| `ctx.refreshTextScale()` | call after changing an SVG's viewBox outside `onResize` |
| `ctx.alpha(color, a)`, `ctx.mix(hexA, hexB, t)` | color helpers |
| `ctx.random(seed)` | seeded PRNG: `r()`, `r.range(a,b)`, `r.int(a,b)`, `r.pick(arr)`, `r.gauss()` |
| `ctx.clamp(v, a, b)` | |
| `ctx.gsap` | GSAP with MotionPath, MorphSVG, DrawSVG, CustomEase registered (§7) |
| `ctx.tooltip.show(html, elementOrPoint)` / `.hide()` | small floating tooltip, viewport-clamped. `point` = `{ x, y }` in viewport px |

### Lifecycle
| | |
|---|---|
| `ctx.onResize(({ width, height, compact }) => …)` | called immediately, then whenever the stage width changes. **Re-layout here.** |
| `ctx.onVisible(v => …)` | figure entered/left the viewport |
| `ctx.onceVisible(fn, ratio = 0.35)` | first time ≥ ratio of the stage is visible (start intro animations here) |
| `ctx.onThemeChange(theme => …)` | page theme changed (re-render canvases that read `ctx.colors`) |
| `ctx.loop((dt, t) => …, { autoplay })` | rAF loop → `{ play(), pause(), toggle(on?), tick(dt?), playing, running, time }`. Runs only while visible and the tab is shown. `autoplay` defaults to `!reducedMotion`. `dt` is in seconds, capped at 0.05 |
| `ctx.ambient(tween)` | register an idle GSAP loop (`repeat: -1`): paused off-screen, never runs under reduced motion, and its targets get `data-ambient` (QA tools ignore them) |
| `ctx.track(handle)` | register any handle with `pause()/resume()/stop()` (e.g. the art library's `breathe`, `drift`, `crawl`, `jitter`): paused off-screen, in hidden tabs and under reduced motion, resumed when visible, stopped on destroy. Returns the handle |
| `ctx.on(target, type, fn, opts)` | event listener removed on destroy |
| `ctx.cleanup(fn)` | teardown hook |
| `ctx.signal` | `AbortSignal` aborted on destroy |
| `ctx.announce(text)` | polite screen-reader announcement (e.g. "Simulation paused") |
| `ctx.ui` | control factories (§6) |

### `ctx.colors`
Cell & molecule palette (PLAN §4), always the same: `healthy, cancer, cd8, cd4, treg, bcell, antibody, nk, macrophage, m2, dc, neutrophil, mdsc, fibroblast, bacteria, virus, mhc, selfPeptide, neoPeptide, inhibit, activate, drug, drugOutline`.
`ctx.colors.deep.<name>` gives darker variants (≥ 4.6:1 on paper). **`ctx.colors.stroke.<name>`** is the right color for *lines and text* of an entity on this stage in the current theme: the deep variant on a light stage in the light theme, the base color otherwise. A light stage turns dark in the dark theme, so always use `stroke.*` (and re-draw in `ctx.onThemeChange`).
Stage-aware: `fg, fg2, fg3, line, grid, halo` (light on the dark stage, ink on the light stage).
Page: `paper, surface, ink, ink2, ink3, rule, accent, success, danger, stageA, stageB`, plus charts: `chart[0..4], chartMuted, chartGrid, chartAxis`.

In SVG, prefer CSS variables so themes switch for free: `fill="var(--fg)"` won't work as an attribute, but `style="fill: var(--fg)"` or the `.t-*` / `.leader` classes will.

---

## 5. Steppers (`ctx.ui.stepper`)

Most figures are step-through explanations. The stepper owns one GSAP timeline per figure. Each step contributes the tweens that take the scene from the **end state of the previous step** to the **end state of this step**. Steps sit end to end with labels; "at step i" means the playhead rests on label `s{i}`. Every navigation is a seek and/or a play between labels, so Back, dot jumps, rapid clicking, Replay and reduced motion all land in exactly the designed state. `tools/stepper-check.mjs` verifies this for you.

```js
const stepper = ctx.ui.stepper({
  steps: [
    { enter(tl) { tl.fromTo(cell, { opacity: 0 }, { opacity: 1 }); } },              // caption = ctx.steps[0]
    { enter(tl) { tl.to(cell, { attr: { transform: 'translate(600 270)' } })
                    .to(label, { opacity: 1, duration: 0.4 }, '-=0.2'); } },
    { title: 'Custom', caption: 'Override the writer’s caption (rarely needed).', enter(tl) { … } },
  ],
  reset() { /* draw the scene in its "before step 1" state (called before every (re)build) */ },
  onChange(i, { direction, instant, from, initial }) { /* side effects that depend only on i */ },
  autoplay: false,   // true: play all steps the first time the figure scrolls into view
  loop: false,       // play-all wraps around
  dwell: undefined,  // pause after a step's animation during play-all (default: reading pace, below)
  maxStep: 9,        // play-all cap per step at 1× (animation + pause); raise only if a step truly needs it
  scene: undefined,  // element veiled during jumps (default: the stage's first svg/canvas)
  phases: undefined, // grouped, labeled dots: [{ label: 'The alarm', short: 'Alarm', steps: [0, 1] }, …]
                     // (or { label, count } for consecutive groups); phones show "Alarm · 2 / 9"
  onComplete() {},   // once, when the last step is first reached: unlock free controls (§4 rule 21)
});
// → { el, go(i, { instant }), next(), prev(), play(), pause(), replay(), rebuild(),
//     index, count, playing, timeline }
```

**Phases** (FIGURE-AUDIT §4 rule 16): pass `phases` instead of hand-rolling grouped pips. Each group gets a small-caps label above its dots, the current phase is highlighted, a hairline separates groups, the caption reads "Step 3 of 9 · The four signs", and phones show `Four signs · 3 / 9`. Phases must cover every step once, in order (console warning otherwise). Reference: `demo-stepper.js`.

What the reader gets: ‹ Back, step dots with titles (a "2 / 5" counter on phones), Next ›, Play all / Pause / Replay, ←/→/Home/End when focus is on the controls, and captions with "Step 2 of 5 · Title". Each change is announced to screen readers. The first step animates in when the figure is 35% visible. Any interaction stops play-all, and play-all pauses while off-screen.

**Caption placement** (POLISH S2). In chapters, the step caption always sits **directly under the stepper bar, before your own controls**. After `mount()` returns, the frame moves the stepper and its caption into a `.fig__stepbar` slot between the stage and `ctx.controls`: stage → stepper → caption → your controls (legends, toggles, notes) → `figcaption` (anything you appended to `ctx.caption`). You don't need to do anything. Keep creating the stepper with the default `parent`. While `mount()` runs, the captions are still in `ctx.caption` (`ctx.caption.querySelectorAll('.fig__steps > .fig__step')` works). After mount, look them up under `ctx.el`. The home page keeps its own layout.

**Caption height** (POLISH S5). The caption box is as tall as the active caption, but never shorter than the median caption. Short captions leave no big gap, and a long one grows the box smoothly, which only moves content below the Next button. Before mount, the page reserves the first caption only.

**Play-all pacing** (POLISH S1). Each step gets its animation plus about 0.25 s per caption word: **5–9 s in all at 1×** (`maxStep`), never slower than a reader. A custom `dwell` is the pause after the animation, and it is capped the same way. Short custom dwells are kept. While playing, the active dot fills as a thin progress bar (on phones, a line under "3 / 9"), and a **1× / 2×** toggle appears next to Pause. 2× halves both the animation and the pause and is remembered per viewer. Don't pass long dwells to "slow the story down". If a step needs more time, make its animation say less.

### Rules for `enter(tl, { index, ctx, compact })`
`tl` is a fresh sub-timeline (defaults: `duration 0.9, ease 'so.inOut'`). Positions inside it are relative to the step's start.

1. **Use `tl.to`, `tl.fromTo`, `tl.set` only. Never `tl.from`.** A `from()` records the wrong end state when a step is rebuilt or jumped to (you'll get a console warning).
2. **One driver per element and property.** Don't mix GSAP transform props (`x`, `scale`, `rotation`) and `attr: { transform: '…' }` on the same element. Nest groups instead: an outer `<g>` positioned by attr-transform strings, and an inner `<g>` scaled by GSAP (see `demo-stepper.js`).
3. **Keep attr-transform strings structurally identical** across tweens (`'translate(a b) rotate(c) scale(d)'` everywhere) so GSAP can interpolate every number.
4. **No infinite repeats in steps.** Idle motion goes in `ctx.ambient(gsap.to(wrapper, { …, repeat: -1, yoyo: true }))` on a wrapper the steps never touch.
5. **No state in `tl.call()`.** Callbacks also fire during seeks. If something isn't tweenable (text content, which canvas mode to draw), derive it from the index in `onChange(i)`, or tween a plain object that your renderer reads (`tl.to(state, { t: 1 })` + `ctx.loop` or `onUpdate`).
6. Use the writer's captions verbatim (`ctx.steps`). If your step count differs, you'll see a console warning: tell the supervisor rather than inventing captions.

### Re-layout and variants
When the layout or a variant toggle changes what `enter()` draws, call `stepper.rebuild()`. It reverts the old timeline, calls your `reset()` (redraw for the new layout), rebuilds, and restores the current step:

```js
ctx.onResize(({ compact }) => { if (compact !== wasCompact) { wasCompact = compact; stepper.rebuild(); } });
ctx.ui.segmented({ label: 'Cell', options: [...], onChange: (v) => { variant = v; stepper.rebuild(); } });
```

---

## 6. Controls (`ctx.ui`)

All factories append to `ctx.controls` unless you pass `parent` (an element, or `null` to place it yourself). They are keyboard-accessible, themed, and touch-sized.

```js
const play = ctx.ui.playPause({ playing: loop.playing, onChange: (on) => loop.toggle(on) });   // → { el, playing, set(v) }
const s = ctx.ui.slider({ label: 'Signal strength', min: 0, max: 100, step: 1, value: 60,
                          format: (v) => `${v}%`, describe: (v) => `${v} percent`,
                          onInput: (v) => …, onChange: (v) => …, ticks: ['Off', 'Max'] });     // → { el, input, value, set(v, { silent }) }
const t = ctx.ui.toggle({ label: 'Show antibodies', checked: true, onChange: (on) => … });     // → { el, checked, set(v) }
const seg = ctx.ui.segmented({ label: 'Cell', hideLabel: false, value: 'healthy',
  options: [{ value: 'healthy', label: 'Healthy', color: ctx.colors.healthy }, { value: 'virus', label: 'Infected' }],
  onChange: (v) => … });                                                                         // → { el, value, set(v) }
ctx.ui.button({ label: 'Reset', icon: 'reset', variant: 'ghost', onClick: () => … });           // variants: default | primary | ghost; small; iconOnly
ctx.ui.spacer();                                                                                 // pushes what follows to the right
const stat = ctx.ui.stat({ label: 'At the site', value: 0, unit: ' / 200' });                   // → { el, set(v) }
ctx.ui.legend([{ label: 'Killer T cell', color: ctx.colors.cd8, shape: 'circle' },              // shapes: circle | square | ring | line | dashed | glow
               { label: 'PD-1 brake', color: ctx.colors.inhibit, icon: 'minus' }]);             // → { el, set(items) }
const row = ctx.ui.group();                                                                      // keep a few controls on one line
ctx.ui.button({ label: 'A', parent: row });
```

Icons available: `prev next play pause replay reset check x close menu sun moon auto clock figure arrowLeft arrowRight arrowUp chevronDown plus minus key clinic note layers spark` (`import { icon } from '../ui/dom.js'`).

On phones (stage < 600px), sliders take a full row and stepper button labels collapse to icons. Order your controls so that still reads well: play first, then the main slider, then secondary buttons, the stat, and the legend last.

### Control vocabulary (POLISH S8)
Every figure uses the same words, so no figure feels like learning a new app:

| Label | Icon | Means | Not |
|---|---|---|---|
| **Replay** | `replay` | Re-run the **current** step, sim or animation from its own start | "Replay step", "Restart", "Again" |
| **Reset** | `reset` | Back to the **start** of the figure: step 1, default settings, empty tally | "Restart", "Start over", "Clear" |
| **Play all** / **Pause** | `play` / `pause` | The stepper's tour (built in), or a sim's run | "Run", "Go" (except a sandbox's one action verb, e.g. "Build a B cell") |
| **Next** / **Back** | `next` / `prev` | Stepper navigation (built in) | — |
| **Show answer** | — | Quiz reveal (built in) | — |

* **Grouped steps** use `phases` (labeled dot groups), not a hand-made segmented bar or tabs over the steps. Segmented controls are for **variants** of one scene (cell type, scenario, drug), and chips for picking items.
* Sandbox actions are verbs about the science ("Build another", "Add a T cell"), followed by the same Reset.
* After a stepper ends, unlock free controls with `onComplete` (guided-then-free). Don't grey out controls with a hint. If a control has to wait, say why in one short line.

---

## 6b. Figure UI kit additions

Added for the figure build (FIGURE-AUDIT §3/§4). Signatures are **frozen**; options marked *optional* have the defaults shown. All factories follow the §6 conventions: `parent` defaults to `ctx.controls` (pass `null` to place it yourself) unless noted, and handles expose `el`.

### Chips (`ctx.ui.chips`): card/chip tray, toggle buttons with `aria-pressed`
```js
const chips = ctx.ui.chips({
  label: 'Target',                          // group label (visually hidden with hideLabel: true)
  options: [{ value: 'bact', label: 'Bacterium', icon?, color?, desc?, disabled?, title? }],
  multi: false,                             // false: single choice; true: any number up to `max`
  max: Infinity,                            // multi only; extra presses are refused + announced
  value: null,                              // single: a value or null; multi: an array
  required: false,                          // single only: the active chip can't be un-pressed
  variant: 'chip',                          // 'chip' (pills) | 'card' (tiles with an optional `desc` line)
  parent, hideLabel: false,
  onChange(value, { option, pressed }) {},  // value: array (multi) or value|null (single); user actions only
});
// → { el, value, set(value, { silent = true }), toggle(value, on?), disable(value, on = true), buttons /* Map value → <button> */ }
```
Keyboard: Tab to the tray, ←/→ move between chips, Space/Enter toggles.

### Info card (`ctx.ui.infoCard`): detail panel (replaces every "bottom sheet")
```js
const card = ctx.ui.infoCard({
  placement: 'auto',        // 'auto': BESIDE the stage when the figure is ≥ 900px wide (the stage keeps ≥ 600px,
                            // i.e. its non-compact layout), an inline panel UNDER the stage otherwise
                            // 'below': always under the stage
  width: '18rem',           // side-panel width when beside
  empty: 'Choose a target to see what happens.',   // what shows when nothing is selected:
                            //   string → a compact one-line hint (ⓘ icon, top-aligned, no box)
                            //   { kicker, title, body } → a short default summary card (e.g. how to read the chart)
                            //   null → nothing, and on wide figures no side column until the first show()
  closable: true,           // × button in the 'below' layout (calls hide())
});
card.show({
  kicker?: 'Bacterium',     // small caps line above the title
  title: 'Eaten',
  badge?: { kind: 'yes', label: 'Eaten' },     // a ctx.ui.badge, rendered inline before the title
  body: '<p>…</p>' | Node,  // HTML string or node
  scroll?: false,           // phones: scroll the card into view after showing
});
card.hide();                // back to the `empty` state (hint, summary, or nothing)
// → { el, show(content), hide(), isOpen }
```
The card is announced politely (`aria-live`) and never takes focus. It wraps the stage in `div.fig__main`; the stage element itself (`ctx.stage`) is unchanged. Reference: `demo-kit.js`.

### Outcome badges (`ctx.ui.badge`, `ctx.ui.badgeHTML`, `ctx.badgeSVG`): ✓ ≈ ✕ ~
```js
ctx.ui.badge({ kind: 'yes' | 'partial' | 'no' | 'varies', label?: 'Recognized', size?: 'sm' | 'md', parent }) // → { el, set(kind, label?) }
ctx.ui.badgeHTML('partial', 'Sometimes')      // → HTML string (for info cards, tooltips, captions)
ctx.badgeSVG('no', { x, y, r: 11 }, parent?)  // → SVG <g> disc with glyph, for use inside the stage
```
Vocabulary (§4 rule 10): **yes ✓** passes / recognized / works · **partial ≈** partly · **no ✕** fails / dies / blocked outcome · **varies ~** depends. Shape *and* color carry meaning (green · amber · crimson · slate).

### Stage tags (`ctx.tag`): "Illustrative", "Not to scale", "Time compressed"
```js
const t = ctx.tag('Illustrative', 'top-right');   // corner: 'top-right' (default) | 'top-left' | 'bottom-right' | 'bottom-left'
// → { el, set(text), remove() }
```
Small caps, `--fg-3`, overlaid on the stage (no pointer events). Two at most per figure (§4 rule 17).

### Clock HUD (`ctx.ui.clock`): time/phase badge, top-left of the stage
```js
const clock = ctx.ui.clock({ value: 'Day 0', icon: 'clock', corner: 'top-left' });   // parent: the stage overlay
clock.set('Day 12');        // any string or number; tabular Inter
// → { el, set(value), value }
```
Use phrases ("Hours", "Day 3", "Week 6") and pair with `ctx.tag('Time compressed')` when time is compressed. Never count backward (§4 rule 16).

### Icons
New names for `icon(name)` (HTML) and `ctx.iconSVG(name, { x, y, size = 20, color }, parent?)` (in-stage `<g>`):
`scalpel syringe pill plane thermometer drop bolt padlock sun smoke shield block` (⊣, a blocked step) `tilde approx` plus the existing set (§6).

### Loops and play buttons
* `ctx.loop(fn, opts)` now also stops when the reader switches on reduced motion at runtime and resumes (if it was playing) when they switch it off. `loop.onChange(playing => …)` fires whenever its play state changes.
* `ctx.ui.playPause({ loop })` binds a button to a loop both ways (no `onChange` needed).

### Stepper: guided-then-free
`ctx.ui.stepper({ …, onComplete(){} })` fires once the reader reaches the last step (any route). Use it to unlock free controls (§4 rule 21).

---

## 6c. Shared components (`docs/shared/`)

Larger building blocks shared by many figures live in `assets/js/figures/shared/`. Import them from a figure as `./shared/<name>.js`, and read their doc before use. Each owner documents its component in `docs/shared/` (index: [`docs/shared/README.md`](shared/README.md)):

| Doc | Module | What it gives you |
|---|---|---|
| [`chart.md`](shared/chart.md) | `shared/chart.js` | scales, axes, lines, bars, bands, thresholds, direct labels, focusable rows, cursor; `theme: 'light' \| 'stage-dark'` |
| [`unit-grid.md`](shared/unit-grid.md) | `shared/unit-grid.js` | unit charts (squares, circles, people, beads) with states and re-layout |
| [`cell-actions.md`](shared/cell-actions.md) | `shared/cell-actions.js` | stepper-safe approach / dock / recognize / kill / divide / emit builders |
| [`agents.md`](shared/agents.md) | `shared/agents.js` | canvas crowd kit: walks, spatial hash, sprite states, kill and division effects |
| [`activity-meter.md`](shared/activity-meter.md) | `shared/activity-meter.js` | ledger / gauge / segment meters with + / − signs |
| [`synapse.md`](shared/synapse.md) | `shared/synapse.js` | the molecular gap between two cells (TCR–MHC, PD-1–PD-L1, CD28–B7…) |
| [`cycle-wheel.md`](shared/cycle-wheel.md) | `shared/cycle-wheel.js` + `cycle-data.js` | the cancer-immunity cycle wheel and its shared data/status strings |

Their APIs are frozen once published; request changes rather than forking.

---

## 7. GSAP

Vendored GSAP 3.15 (ES modules, minified per file) lives in `assets/vendor/gsap/`.

* `ctx.gsap` is the instance with **MotionPathPlugin, MorphSVGPlugin, DrawSVGPlugin, CustomEase** registered, plus the house eases `'so.inOut'` (default for steps), `'so.out'` (arrivals), `'so.in'` (departures).
* Direct import, same instance: `import { gsap, MorphSVGPlugin } from '../../vendor/gsap/index.js';`
* Also vendored (import and register them yourself): `Draggable.js`, `InertiaPlugin.js`, `Flip.js`, `TextPlugin.js`, `EasePack.js`, e.g. `import { Draggable } from '../../vendor/gsap/Draggable.js'; ctx.gsap.registerPlugin(Draggable);`
* SVG transforms: use `svgOrigin: 'x y'` (in the element's own user space) or `transformOrigin: '50% 50%'` (bounding-box center).
* Motion feel: slow-ish, physical, calm. Typical durations 0.6–1.8 s; never flash or bounce hard (`back.out(2)` for small pops at most).
* Kill your own non-ambient tweens in `destroy()` if they can outlive the figure.

---

## 8. Motion, reduced motion and off-screen rules

| Situation | What you do |
|---|---|
| Idle motion (breathing membranes, jiggling bacteria) | `ctx.ambient(tween)` on wrapper groups. It stops off-screen and never runs under reduced motion. |
| Continuous simulation | `ctx.loop(fn)`. It doesn't autoplay under reduced motion; render one static frame with `loop.tick(0)` or your own `render()`, and let the reader press Play (user-initiated motion is fine). |
| Step animations | Automatic: the stepper jumps straight to end states when `ctx.reducedMotion`. |
| CSS animations inside the stage | Pause them under `.fig.is-offscreen` and `@media (prefers-reduced-motion: reduce)`. |
| Your own timers | Pause in `api.pause()`, resume in `api.resume()`. |

Nothing may animate while off-screen or in a hidden tab.

---

## 9. Layout on phones

* Call `ctx.setAspect(desktop, compact)`. Common pairs: `16/9 + 4/5` (scenes), `16/9 + 1` (charts), `21/9 + 4/3` (wide timelines).
* **Re-layout, don't shrink.** Switch to a portrait arrangement in `ctx.onResize(({ compact }) => …)`. The cheapest trick is in `demo-stepper.js`: draw biology in a local frame and rotate/scale the whole frame, while labels stay horizontal with their own per-layout positions.
* SVG text: use the classes `t-title` (18u), `t-label` (15u), `t-small` (13u), `t-caps` (12u), plus modifiers `t-mid`, `t-end`, `t-halo` (outline for busy backgrounds), `t-muted`, `t-num`, `t-serif`. They grow automatically when the stage shrinks, so text never renders below ~13px (labels). Design the viewBox so that 1 unit ≈ 1 CSS px at full width (e.g. 960 wide for wide figures, ~400 wide for phone layouts).
* Leader lines: `class="leader"` (non-scaling 1px) and `class="leader-dot"`.
* Touch: tap targets ≥ 40px. Make hit areas generous (`<circle r="24" fill="transparent" data-hit>` over small art) and never rely on hover alone.

### No layout shift
Figures load lazily, so the page must not jump when they mount. The build reserves each figure's mounted shape before its module loads:
1. **Stage aspect:** taken from your module's first literal `ctx.setAspect(a, b)` call (numbers or simple arithmetic such as `16 / 9, 400 / 640`). If your aspect is computed at runtime, it comes from the measurements in step 3. Otherwise the draft's `aspect:` applies, else defaults (dark 16:9 / 4:5 on phones).
2. **Steppers:** the stepper row is reserved, and the writer's first step caption is pre-rendered (all captions are in the HTML for no-JS readers and print). On mount, the stepper takes over that space (§5: caption placement and height).
3. **Everything else** (extra control rows, legends, info cards below the stage, computed aspects) is **measured**: `node tools/measure-figures.mjs <page>.html` records each mounted figure's stage aspect and its extra height at desktop and phone widths in `assets/data/figure-sizes.json`. The build turns that into reserved space.

When your figure's layout is final: `node tools/measure-figures.mjs NN-slug.html && node tools/build-content.mjs --only NN`. Keep `ctx.setAspect` near the top of `mount` (before any `await`).

---

## 10. Accessibility

* The `alt` text from the draft is the figure's description (`aria-describedby`). Keep the drawing `aria-hidden` (the `createSVG` default) unless it contains focusable elements.
* Anything the reader can do with a pointer must work with the keyboard: use `ctx.ui` controls, or give SVG hit targets `tabindex="0"`, `role="button"`, an `aria-label`, and handle Enter/Space.
* Announce meaningful state changes that aren't otherwise visible to screen readers with `ctx.announce()`. The stepper already announces steps.
* Never encode meaning by color alone: add shape, icon, label or position (PLAN §4).

---

## 11. Performance

* SVG for most figures; Canvas when more than ~150 things move. Pre-render glows into sprites (`demo-sim.js`).
* No work while hidden (`ctx.loop`/`ctx.ambient` handle it). No layout reads inside animation loops.
* Few blur filters: one `ctx.glowFilter` on a handful of nodes is fine, not on hundreds.
* Keep modules small. Import only the GSAP plugins you use beyond the default four.

---

## 12. Testing: the builder checklist

Run these before you report a figure as done:

```bash
# 1. Desktop + phone, light + dark page themes (the dark stage must look identical in both)
node tools/shot.mjs --page 04-presentation.html --figure ch04-mhc1-pathway --viewport desktop,mobile --theme light,dark
# 2. Step through (screenshot after each click; use a --wait longer than your longest step)
node tools/shot.mjs --page 04-presentation.html --figure ch04-mhc1-pathway --click next --times 4 --wait 3000
# 3. Stepper state consistency (Back, dot jumps, rapid clicks, reduced motion)
node tools/stepper-check.mjs --page 04-presentation.html --figure ch04-mhc1-pathway
# 4. Reduced motion
node tools/shot.mjs --page 04-presentation.html --figure ch04-mhc1-pathway --reduced-motion
# 5. Keyboard focus
node tools/shot.mjs --page 04-presentation.html --figure ch04-mhc1-pathway --focus next --key ArrowRight --times 2
# 6. Whole page
node tools/check.mjs 04-presentation.html
# 7. Reserve its space so the page doesn't jump while figures load (§9), then rebuild
node tools/measure-figures.mjs 04-presentation.html && node tools/build-content.mjs --only 04
```

- [ ] Looks right at 1440px and 390px wide, in light and dark page themes. Labels are readable on a phone (≥ 13px), nothing is clipped, and there is no horizontal scroll.
- [ ] Teaches the draft's `goal`, and follows its `spec`. Step captions are the writer's, verbatim.
- [ ] `stepper-check` says "All paths agree" (steppers).
- [ ] Reduced motion: no ambient motion and no autoplaying loops, but the figure is still complete and usable.
- [ ] Keyboard: every control is reachable, with visible focus. Arrows step through steppers.
- [ ] No console errors or warnings, and no failed requests (`shot.mjs` JSON `"ok": true`).
- [ ] Colors from `ctx.colors` / CSS tokens only. Meaning never relies on color alone.
- [ ] Off-screen: nothing animates (scroll away and check `ctx.loop`/`ctx.ambient` usage).
- [ ] Art comes from `assets/js/art/` where an entity exists, without restyling it.

---

## 13. Hero figures

Frontmatter `hero: <figure-id>` puts an **ambient** figure in the chapter hero: a round lens beside the title on wide screens (≥ 75rem), and a soft 2:1 band under the dek on phones. If the draft also has a `:::figure <same id>` block, its alt text describes the hero; otherwise the hero is decorative (`aria-hidden`).

* No controls, no captions, no steps: `ctx.ui.*` controls would be hidden anyway. Motion is ambient (`ctx.track` / `ctx.ambient` / `ctx.loop`).
* **CSS decides the shape.** Don't call `ctx.setAspect`; redraw in `ctx.onResize(({ width, height }) => …)` with a viewBox matching `width / height`. Keep the subject near the center (the lens is a circle; corners are cut).
* `ctx.hero` is `true`, so one module can serve both as a hero and as a normal figure.
* Reference: `demo-hero.js` (the `_sample.html` hero).

---

## 14. Using the art library in a figure

Cells, molecules, pathogens and scenes come from `assets/js/art/` (`docs/ART.md`, live gallery `art-gallery.html`). It works directly with `ctx`:

```js
import { tCell, cancerCell, tissueField, breathe, label } from '../art/index.js';

export default function mount(fig, ctx) {
  ctx.setAspect(16 / 9, 4 / 5);
  const svg = ctx.createSVG({ viewBox: '0 0 960 540' });
  const draw = () => {
    for (const n of [...svg.children]) if (n !== svg.defs) n.remove();
    const stage = ctx.artStage;                                   // 'dark' | 'light'
    svg.append(tissueField({ width: 960, height: 540, seed: 2, stage }));
    const killer = tCell({ variant: 'cd8', r: 40, state: 'activated', polarity: 0, seed: 3, stage });
    const tumor = cancerCell({ r: 70, pdl1: true, seed: 8, stage });
    ctx.gsap.set(killer, { x: 330, y: 270 });
    ctx.gsap.set(tumor, { x: 600, y: 270 });
    svg.append(killer, tumor, label({ x: 600, y: 380, text: 'Cancer cell', anchor: 'middle', stage }));
    ctx.track(breathe(killer));                                   // pauses off-screen, stops on destroy
    ctx.track(breathe(tumor));
  };
  draw();
  ctx.onThemeChange(draw);                                         // light stages follow the page theme
}
```

* **Stage:** pass `stage: ctx.artStage` to every factory. On light stages, redraw in `ctx.onThemeChange`; dark stages never change.
* **Animation helpers** (`breathe`, `wobble`, `drift`, `jitter`, `crawl`, `glowPulse`, `apoptosis`) already pause off-screen and in hidden tabs, and do nothing under reduced motion. Still wrap long-running ones in `ctx.track(...)`, so they stop on destroy and also pause when the figure's `pause()` runs.
* **GSAP + art:** never let two systems drive the same attribute. `crawl()` owns a cell's `transform`; position other cells with `ctx.gsap.set(cell, { x, y })`; wrap in a `<g>` when both are needed. In steppers, animate art nodes with `to`/`fromTo` like any other node. State changes are rebuilds with the same seed plus a crossfade (ART.md §9 recipe B), which you can express as `tl.fromTo(next, { opacity: 0 }, { opacity: 1 })` / `tl.to(old, { opacity: 0 })` inside an `enter()`.
* **Canvas crowds:** `await preloadSprites([...])` inside an `async mount`, then `drawSprite(cv.g, img, x, y, { rotation, scale })` each frame (`demo-sim.js`).
* **Labels:** the library's `label()` and the `.t-label` classes are interchangeable. Either way keep text ≥ 13px rendered.

---

## 15. Gotchas

* **The scene "snaps" when going back.** That's expected: Back and dot jumps veil the scene for 0.15 s, seek to the end of the previous step, then play the target step's animation.
* **Element screenshots and smooth scrolling.** `tools/shot.mjs` disables smooth scrolling and hides fixed chrome during captures. Use `--figure`/`--selector` rather than writing your own Playwright clip.
* **`ctx.colors` on canvas** is read once and cached until the theme changes. Re-render in `ctx.onThemeChange`.
* **Text in canvas** must use `13px+` and the page font: `g.font = '600 13px Inter, system-ui, sans-serif'`.
* **IDs inside SVG** must be unique on the page. Use `ctx.radialGradient` & co (they generate ids) or `ctx.uid('kind')` instead of hard-coding `id="glow"` or keeping a module-level counter (ids that depend on load order make stepper-check fail).
