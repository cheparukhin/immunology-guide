# `shared/agents.js`: canvas crowd kit

Owner: **P4**. Seeded, deterministic helpers for canvas simulations with dozens to hundreds of cells drawn as art-library sprites. Users: ch01-binding, ch03-clonal-selection, ch04-lymph-node-search, ch05-thymus, ch07-immunoediting, ch09-bridge, ch10-crs, ch10-logic-gates, ch11-oncolytic. Live sandbox: `/_kit-demo.html`.

The kit has no loop of its own: you call it from `ctx.loop((dt) => …)`. Everything random takes an explicit `rng`, and `fixedStep` makes a run identical on every machine and frame rate.

```js
import { rng, fixedStep, rateToP, spatialHash, walk, relax, spriteStates,
         createEffects, killSpecks, divisionPinch, contactRing } from './shared/agents.js';
```

## Signatures

| Function | |
|---|---|
| `rng(seed)` → `r()` | mulberry32 (same as `ctx.random`): `r()`, `r.range(a, b)`, `r.int(a, b)`, `r.pick(arr)`, `r.chance(p)`, `r.gauss()` |
| `fixedStep(fn, { dt = 1/60, max = 8 })` → `(realDt) => n` | Accumulates real time and calls `fn(dt)` in fixed steps (at most `max` per frame). Use it so a seeded run is reproducible. |
| `rateToP(k, dt)` | Probability that an event with rate `k` (per second) happens within `dt`: `1 − e^(−k·dt)`. Use it for every stochastic event (binding, killing, division) so behavior doesn't depend on frame rate. |
| `spatialHash(cell = 40)` → `hash` | Uniform grid for neighbor queries. `hash.build(agents)` (clear + insert all), `hash.insert(a)`, `hash.clear()`, `hash.near(x, y, r, out = [])` → agents whose centers are within `r` (no allocation if you pass `out`), `hash.each(x, y, r, fn)`. Agents need `x`, `y` (and `r` for `relax`). |
| `walk(a, dt, { speed = 30, turn = 1.4, bias, bounds, rng })` | Persistent random walk (amoeboid crawl): the heading `a.heading` (radians) diffuses by `turn` rad/√s; `bias` steers it: `{ x, y, strength }` (toward a point), `{ angle, strength }` (a drift) or a function `(a) => angle \| null`. `bounds`: `{ x0, y0, x1, y1 }` (reflect) or `(x, y) => bool` (inside test; the walker turns back). Uses `a.rng` when `rng` isn't given. Mutates and returns `a`. |
| `relax(agents, { hash, iterations = 1, strength = 0.5, pad = 0 })` | Pushes overlapping agents apart (using `a.r` + `pad`); agents with `a.fixed` don't move. Pass the hash you already built. |
| `spriteStates(defs, { seeds = 4, scale })` → `Promise<Sheet>` | Preload art sprites per state: `defs = { resting: ['tCell', { variant: 'cd8', r: 9 }], dying: ['cancerCell', { r: 14, state: 'dying' }], … }` (or `{ kind, params, seeds }` per state). Each state gets `seeds` variants (params `seed: 1..seeds`, unless the params fix a seed). |
| `sheet.get(state, variant)` | bitmap (variant wraps) |
| `sheet.draw(g, a, { state, scale, alpha, rotation })` | Draws agent `a` at `(a.x, a.y)` with `a.state`, `a.variant`, `a.scale`, `a.alpha`, `a.rotation`, and the effect fields below (`a.dying`, `a.pinch`). |
| `createEffects()` → `fx` | Effects store: `fx.step(dt)`, `fx.draw(g)`, `fx.clear()`, `fx.count`. Draw it after your agents. |
| `killSpecks(fx, a, { color, n = 5, life = 0.6, seed })` | **Crowd kill (rule 6):** `a` shrinks away (`a.dying` 0 → 1; set `a.dead` at the end) while 4–6 specks of its color drift out and fade over `life` s. Never a burst or flash. |
| `divisionPinch(fx, a, { angle, duration = 0.8, gap, onSplit })` | `a` pinches into two along `angle` (drawn by `sheet.draw` via `a.pinch`); at the end `onSplit(a, angle)` runs once so you can add the daughter (same `state`/`variant`/`key`: same clone). |
| `contactRing(fx, x, y, { color, r = 12, life = 0.9, core = true })` | **Rule 5 for crowds:** a swelling ring in the killer's color with a white core that fades over `life`. |

## Example (≤ 15 lines)

```js
const cv = ctx.canvas(), R = rng(7), fx = createEffects(), hash = spatialHash(32);
const sheet = await spriteStates({ t: ['tCell', { variant: 'cd8', r: 9 }], c: ['cancerCell', { r: 14 }] });
const cells = Array.from({ length: 120 }, (_, i) => ({ x: R.range(0, cv.width), y: R.range(0, cv.height),
  r: i < 20 ? 10 : 15, state: i < 20 ? 't' : 'c', variant: i, heading: R.range(0, 6.28), rng: rng(i) }));
const step = fixedStep((dt) => {
  for (const a of cells) if (a.state === 't') walk(a, dt, { speed: 40, bounds: { x0: 0, y0: 0, x1: cv.width, y1: cv.height } });
  hash.build(cells); relax(cells, { hash });
  for (const t of cells) if (t.state === 't') for (const c of hash.near(t.x, t.y, 26))
    if (c.state === 'c' && !c.dying && R() < rateToP(0.4, dt)) { contactRing(fx, c.x, c.y, { color: '#4C8DFF' }); killSpecks(fx, c); }
  fx.step(dt);
});
ctx.loop((dt) => { step(dt); cv.clear(); for (const a of cells) if (!a.dead) sheet.draw(cv.g, a); fx.draw(cv.g); });
```

## Notes

* **Determinism.** Same seed + `fixedStep` ⇒ the same run. Never call `Math.random()`. Give each agent its own `rng(seed)` if agents are added or removed mid-run, so one agent's randomness doesn't shift everyone else's.
* **Reduced motion.** `ctx.loop` does not autoplay; render a meaningful still (e.g. run N fixed steps silently, then draw once) and let the reader press Play.
* **Theme.** Sprites are bitmaps: on light stages call `clearSprites()` + `spriteStates()` again in `ctx.onThemeChange`. Effects read colors when you call them (pass `ctx.colors.*`).
* **Performance.** 300 agents with a hash and sprites run at 60 fps. Keep effects few (≤ ~60 alive); `fx.count` tells you.
