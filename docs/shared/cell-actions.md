# `shared/cell-actions.js`: the cell kit (contact, recognize, kill, divide, signal)

Owner: **P4**. The animation grammar every SVG cell figure uses (FIGURE-AUDIT §2E, §4 rules 5–13). The reference figure is **`ch05-kill`**: copy its grammar for every later kill. Live sandbox of every action, with a seek-consistency test: `/_kit-demo.html` (dev only).

Every action is a **stepper-safe builder**: it *appends* tweens to a timeline you pass (a `ctx.ui.stepper` step's `tl`, or any GSAP timeline). Rendering is a pure function of timeline time (explicit from→to values, no state in `call()`), so Back, dot jumps, Replay and reduced motion all land in identical frames. Each builder also has a **free-running twin** under `run.*` that returns a playing GSAP timeline for ambient use (heroes, sims).

```js
import { rig, approach, dock, recognize, polarize, kill, detach, divide, emit, run } from './shared/cell-actions.js';
```

---

## 1. Rigs: how cells are held

Actions move, flatten and fade cells through a **rig**: a few wrapper groups around a library cell, so the art itself is never restyled and nothing fights over its `transform`.

```js
rig(art, { x = 0, y = 0, parent, tcrKey, name }) → Rig
```
| | |
|---|---|
| `art` | a cell from `../art/index.js` (`tCell`, `cancerCell`, `nkCell`, `macrophage` …), centered at (0,0), **no transform of its own** |
| `parent` | where `rig.el` is appended (an `<svg>` or `<g>`; omit and append `rig.el` yourself) |
| `tcrKey` | clone identity carried to daughters by `divide()` (defaults to `art.dataset.key`) |

```
rig.el          <g data-rig transform="translate(x y)" opacity>     ← owned by cell-actions
  layers.under  <g>   halos/rings under the cell (world-oriented, centered on the cell)
  layers.body   <g transform="rotate(a) scale(sx sy) rotate(-a)">  ← squash (flatten / pinch / stretch)
    layers.idle <g>   free for YOUR idle motion (ctx.ambient on it), contains the art
      art
    layers.inner <g>  overlays in the art's own frame (centrosome, seal ring)
  layers.over   <g>   badges over the cell
```
Rig fields: `el, art, info (cellInfo), r (effective radius), color, stage, kind, seed, tcrKey, layers, plan`.
`rig.plan` is the **planned** state at the end of everything built so far (`{ x, y, angle, sx, sy, s, o, contact, docked, polarized, dying }`); builders read it to compute their from→to values. Treat it as read-only.

**Rules.** Never set `rig.el`'s `transform`/`opacity` yourself. Use `place()` during setup and `move()` in steps. Tween `rig.art`'s parts (or `rig.layers.idle`) freely. Create rigs inside the stepper's `reset()`: each rebuild then starts from fresh plans. `breathe(rig.art)` is fine (it only rewrites the membrane path).

```js
place(rig, { x, y, opacity })          // immediate; setup / reset() only
fxLayer(parent) → <g data-fx>          // where effects go (created at the end of `parent` on first use;
                                       //  call it yourself early to choose its z-order)
contact(a, b, { gap = 0, angle }) → { x, y, angle, distance }   // planned contact point between two rigs
```

---

## 2. Builders

All builders: `(tl, …, opts) → Span`, where `Span = { start, end }` (seconds on `tl`) unless noted. Common options: **`pos`** = GSAP position parameter (default: the end of `tl`; `'<'`, `'>'`, `'+=0.3'`, labels and numbers all work), `duration`, `ease`. Positions are in the frame of the rig's parent. Angles are degrees (0 = +x/right, 90 = down).

| Builder | What it draws |
|---|---|
| `move(tl, rig, { x, y, via = [], opacity, duration, ease = 'so.inOut', stretch = 0.04, pos })` | Crawl to (x, y), optionally through `via: [[x,y]…]` (smooth curve). The body stretches a little along the heading and relaxes on arrival. `duration` defaults to distance / 120 u/s (0.8–3 s). |
| `approach(tl, mover, target, { gap = 4, angle, via, duration, stretch, pos })` | `move` to just short of `target` (Rig or `{x,y}`): membranes `gap` apart along `angle` (default: the current line between centers, measured from the target). A point target counts as zero radius: the mover's membrane stops `gap` short of it (use `move` to land on a point). |
| `probe(tl, killer, cell, { match = false, gap = 1, angle, hold = 0.5, mark = true, pos })` → Span & `{ mark }` | A brief patrol touch: approach, pause, and (when `match` is false) a tiny gray **✕ "no match" tick** at the contact that fades as the killer leaves. Does not dock. |
| `dock(tl, killer, target, { flatten = 0.14, angle, seal = false, duration = 1.1, pos })` → Span & `{ seal }` | Close contact: the killer's face flattens against the target. `seal: true` draws the synapse bull's-eye edge-on at the interface (outer adhesion ring + inner zone in the killer's color). Records `plan.contact`. |
| `recognize(tl, killer, at, { color, radius, duration = 1.8, badge = true, hold = true, badgeOffset, layer, pos })` → Span & `{ ring, badge }` | **Rule 5.** A swelling, fading ring in the T cell's color with a white core (a tween, never a flash), plus a green-cyan **"+" disc** (`signalIcon`). `at`: a Rig (its contact with the killer), a `{x,y}` point, a glyph element (e.g. a pink-peptide MHC cup: ring on its head), or `undefined` (the killer's docked contact). `hold: false` fades the badge after the ring. |
| `polarize(tl, killer, toward, { duration = 1.6, mtoc = true, pos })` | The centrosome (a small star of microtubule rails, drawn when `mtoc`) swings around the nucleus to face `toward` (Rig, `{x,y}`, an angle, or `undefined` = contact), then the granules ride the rails and cluster at that face. Works on any cell with `[data-part=granule]`s (CD8 T cells, NK cells). |
| `unpolarize(rig, { angle = 180 })` | **Immediate setup** (call in `reset()`): granules scattered around the cytoplasm, centrosome at `angle` (the rear for a migrating T cell). Makes the later `polarize` swing visible. |
| `fire(tl, killer, target, { perforin = false, duration = 0.9, pos })` | The delivery moment alone (for figures that split the kill across steps, like ch05-kill): the granules nearest the contact fuse with the membrane (shrink and fade at the face); `perforin: true` adds the lens-scale puff. |
| `kill(tl, killer, target, { perforin = false, duration = 3.2, dock = true, flatten, seal = false, detach = true, back, pos })` → Span & `{ marks }` | **Rule 6, the canonical kill:** dock + flatten (if not docked) → granules slide to the contact (if not polarized) → granules fuse at the membrane (with `perforin: true`, lens-scale only: a puff of perforin specks and granzyme beads crosses into the target) → the target dies by `setDying` (shrink, blebs, fragments; `duration` = dying time) → halfway through the death the killer **detaches intact**. `marks: { docked, aimed, fired, dying, released, dead }` are times on `tl` for syncing labels/clocks. Never an explosion, never engulfing, nothing flashes. NK cells: same call (orange). |
| `detach(tl, killer, { from, distance, duration = 1.1, pos })` | Unflatten, back off `distance` (default 0.6 r) away from the contact, granules re-scatter (rearmed). |
| `die(tl, cell, { duration = 3, to = 1, remnants = true, pos })` | Seekable apoptosis on a Rig or bare art node (`dyingState` underneath); virions inside (`[data-part=virions]`) are dismantled with the cell. Use for deaths without a killer (neglect, deletion). |
| `clearUp(tl, macrophage, dead, { duration = 2.6, pos })` | The optional tidy-up: a macrophage rig drifts onto the apoptotic bodies, which shrink into it and fade. No contents spill. |
| `swap(tl, rig, next, { duration = 0.8, pos })` | State change as a crossfade to a redrawn art node (same seed, ART §9 recipe B). Later builders use `next` as `rig.art`. |
| `divide(tl, cell, n = 2, { angle, spread, duration = 1.8, scale = 0.94, pos })` → `Rig[]` | "Photocopying": the cell elongates, pinches, and becomes `n` daughters that drift apart (`spread` default 1.15 r). Daughters are clones of the parent drawing: **same seed and same `tcrKey`**. The array also has `.span`. Daughters can be divided again. |
| `dockAntibody(tl, ab, glyph, { from, arm = 'right', size, duration = 1.5, pos })` | **Rule 9.** A drug antibody (`antibody({ variant:'therapeutic' })`, either anchor) drifts in and caps the head of `glyph` (e.g. a PD-1 seated on a rigged T cell) with one arm tip, Fc pointing away. `ab` must live in the same coordinate frame as the rig's parent (or any static group: converted with `getCTM`). `from: { x, y, rotation }` (default: 1.6 sizes out along the glyph's axis, faded in). |
| `emit(tl, from, { kind = 'cytokine', color, n = 8, r = 90, duration = 2.4, size, spread = 360, angle, fade = true, seed, layer, pos })` → Span & `{ particles }` | **Rules 11–12.** Signal molecules leave the sender's membrane and diffuse out to ~`r` units with a gentle wander, staggered. `kind`: `'cytokine'` (solid dots, sender's color), `'interferon'` (hollow rings, sender's color), `'danger'` (pale-gold four-point `dangerSpark`s; only from dying/burst cells). `from`: Rig, or `{ x, y }` together with `layer` (the group to draw in); `color` defaults to the sender's. `spread`/`angle` aim a cone. `fade: false` leaves them visible at the end; a number (0..1) is their final opacity (e.g. `0.4`: a lingering haze). |
| `pulseAlong(tl, path, sign = '+', { duration = 1.2, size = 12, reverse = false, layer, pos })` | A signal disc travels along an SVG `<path>`: `'+'` green-cyan plus disc, `'-'` crimson bar disc (rule 10), `null` a bright neutral dot. Fades in at the start and out at the end. |

Also exported: `setDying`, `dyingState` (re-exported from the art library) and the internal `drive(tl, render, { duration, ease, pos })` (tween a pure `render(p)` function of 0..1; use it for your own non-attribute state).

### Free-running twins: `run.*`
```js
const h = run.kill(killer, target, { duration: 2.6 });   // → gsap timeline, already playing
ctx.track(h);                                            // paused off-screen, stopped on destroy (h.stop() = kill)
h.result                                                 // what the builder returned (Span, daughters …)
```
Every builder has a twin with the same arguments minus `tl`. Under reduced motion a twin jumps straight to its end state. Twins append to the rigs' plans, so successive twins chain naturally (each starts where the last one ends); don't start a twin while another one is still moving the same rig.

---

## 3. Example: a full contact kill in a stepper (≤ 15 lines)

```js
import { tCell, cancerCell } from '../art/index.js';
import { rig, unpolarize, approach, dock, recognize, polarize, kill } from './shared/cell-actions.js';

let killer, target;
const reset = () => {
  svg.replaceChildren(svg.defs);
  target = rig(cancerCell({ r: 80, seed: 5, stage: ctx.artStage }), { x: 620, y: 300, parent: svg });
  killer = rig(tCell({ variant: 'cd8', r: 44, state: 'activated', seed: 3, stage: ctx.artStage }), { x: 140, y: 300, parent: svg });
  unpolarize(killer);
};
ctx.ui.stepper({ reset, steps: [
  { enter: (tl) => { approach(tl, killer, target); recognize(tl, killer, target); } },
  { enter: (tl) => { dock(tl, killer, target, { seal: true }); polarize(tl, killer); } },
  { enter: (tl) => kill(tl, killer, target) },
] });
```

---

## 4. Notes

**Stepper safety.** Each builder captures the plan's "from" state when it runs and writes explicit values, so steps can be rebuilt (`stepper.rebuild()`), jumped and reversed. Actions that *move or squash the same rig* must not overlap in time (append them in sequence, or offset with `pos`); effects (`recognize`, `emit`, `pulseAlong`) may overlap anything. Effect nodes (rings, badges, particles, the centrosome) are created when the builder runs and stay hidden until their tween plays, so the DOM is identical on every path (`tools/stepper-check.mjs` passes).

**Theme.** Effects take the rig's art `stage` (`'dark'` luminous / `'light'` crisp). On light stages, redraw (rebuild the stepper) on `ctx.onThemeChange`, as for any art.

**Reduced motion.** Steppers jump to end states on their own. `run.*` twins jump to their end state. Builders never start loops.

**Scale.** Perforin/granzyme puffs appear only with `kill({ perforin: true })` (lens-scale scenes). Cell-scale kills show the granules fusing at the contact and nothing else (rule 6). For canvas crowds use `shared/agents.js` `killSpecks` (shrink + 4–6 specks over 0.6 s). For the molecular view of a synapse use `shared/synapse.js`.

**Performance.** A rig adds 5 groups. Effects are a few nodes each. Keep ≤ ~60 animated SVG cells per figure; beyond that use `agents.js`.
