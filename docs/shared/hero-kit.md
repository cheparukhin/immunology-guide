# `shared/hero-kit.js`: chapter hero vignettes

Owner: **H**. The frame that every chapter hero (`chNN-hero`, `int-hero`) is built on (FIGURE-AUDIT §6). A hero is an ambient, decorative window into the microscope: a dark lens with no labels and no controls (`aria-hidden`), where a few cells live calmly and one quiet event happens every 20–40 s. Wire it with frontmatter `hero: <figure-id>` (docs/FIGURES.md §13).

```js
import { heroScene, HERO_R, poseOf, setPose, poseIn, glide, capPose, settle } from './shared/hero-kit.js';
```

## `heroScene(ctx, opts)` → figure api (return it from `mount`)

| opt | |
|---|---|
| `seed` | background and scene randomness (`api.rng`) |
| `draw(api)` | build the resting scene. Called on every (re)build: resize between the lens and the band, theme change, `api.refresh()` |
| `events: [{ every: [min,max] \| sec, first, run(api) }]` | quiet events on the **scene clock**, which only advances while the hero is visible and the tab is shown. They never fire under reduced motion |
| `still(api)` | reduced motion: called right after `draw` to compose the key moment as a still. Run the same actions instantly (`run.*` twins jump to their end under reduced motion) |
| `frame(t, dt, api)` | optional per-frame hook |
| `background` | `'tissue'` (default: `tissueField`) · `false` · `(api) => node` |
| `density`, `tint` | for the default tissue background |

### `api`
| | |
|---|---|
| `svg`, `back`, `main`, `front` | the SVG and its three layers. Put cells in `main` |
| `W`, `H`, `cx`, `cy` | viewBox size (W = 600; H = 600 in the round desktop lens, ≈300 in the phone band) and its centre |
| `band`, `k`, `ky` | `band` is true in the phone band. `k` is the size multiplier (1 in the lens, 0.7 in the band), so multiply every `r`/`size` by it. `ky` compresses vertical offsets |
| `X(dx)`, `Y(dy)` | lens-centred coordinates (`Y` applies `ky`) |
| `stage` | `ctx.artStage` (`'dark'`) |
| `rng` | seeded PRNG |
| `put(node, x, y)` | place an art node in `main` |
| `rig(art, { x, y })` | a `cell-actions` rig in `main`, so the cell-actions `run.*` twins can move it |
| `track(h)` | long-lived art helper (`breathe`, `drift`, `crawl` loops): pauses off-screen, stops on rebuild |
| `play(h)` | short-lived handle (a `run.*` twin, a GSAP tween, `glowPulse`, a one-way `crawl`): pauses with the figure, stops on rebuild |
| `after(sec, fn)`, `every(sec, fn)` | scene-clock scheduling inside an event |
| `refresh({ fade })` | crossfade back to a freshly drawn resting scene. Use it to end a cycle (division, death, docking) so the vignette loops forever without drifting |
| `gsap` | `ctx.gsap` |

### Pose helpers (for free molecules)
`poseOf(node)` / `setPose(node, {x,y,a})` read and write `translate() rotate()`. `poseIn(node, frame, lx, ly)` maps a point of a glyph into a frame (e.g. a receptor's dock point into `api.main`). `glide(api, node, pose, { duration, scale, opacity, onComplete })` tweens to a pose (shortest turn). `capPose(glyph, frame, { glyphSize, abSize, arm })` is where a drug antibody (`anchor: 'base'`) must sit to cap a glyph's head with one tip, Fc pointing away (rule 9). `settle(node, driftHandle)` stops a `drift()` without the snap back.

### Scale
`HERO_R` lists consistent radii across heroes (lens units): lymphocyte 30, NK 33, neutrophil 36, healthy 50, cancer 54, macrophage 104 (extent), dendritic 124 (extent) … Keep the subject inside the central circle; the lens cuts the corners.

### Example (≤ 15 lines)
```js
export default function mount(fig, ctx) {
  let t, c;
  return heroScene(ctx, {
    seed: 3,
    draw(api) {
      c = api.rig(cancerCell({ r: 60 * api.k, seed: 4, stage: api.stage }), { x: api.X(60), y: api.cy });
      t = api.rig(tCell({ r: 30 * api.k, seed: 2, stage: api.stage }), { x: api.X(-150), y: api.cy });
      api.track(breathe(c.art));
    },
    events: [{ first: 4, every: [26, 34], run(api) {
      api.play(run.approach(t, c));
      api.after(6, () => api.refresh());
    } }],
    still(api) { run.approach(t, c); },
  });
}
```

## Notes
* **Never repeat the home hero** (patrol and kill). Each chapter's vignette is listed in FIGURE-AUDIT §6.
* **Reduced motion:** no loops, no events. `still()` shows the key moment.
* **Theme:** heroes are dark stages, so they look the same in both page themes.
* **Performance:** ≤ ~10 animated cells. `breathe` only on the 1–3 subjects.
