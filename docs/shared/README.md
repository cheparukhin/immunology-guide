# Shared figure components: API docs

Each platform task that builds a shared component in `assets/js/figures/shared/` publishes its API here, one file per component:

| File | Component | Owner |
|---|---|---|
| `chart.md` | `shared/chart.js` (scales, axes, lines, bars, bands, thresholds, rows, cursor) | P3 |
| `unit-grid.md` | `shared/unit-grid.js` | P3 |
| `cell-actions.md` | `shared/cell-actions.js` (stepper-safe dock / recognize / kill / divide / emit …) | P4 |
| `agents.md` | `shared/agents.js` (canvas crowds) | P4 |
| `activity-meter.md` | `shared/activity-meter.js` | P4 |
| `synapse.md` | `shared/synapse.js` | P4 |
| `cycle-wheel.md` | `shared/cycle-wheel.js` + `shared/cycle-data.js` | P5 |

Conventions for these docs: exact signatures first, then a minimal example (≤ 15 lines) that runs inside a figure `mount(fig, ctx)`, then stepper-safety notes, theme handling (light vs dark stage) and reduced-motion behavior. The `ctx` / `ctx.ui` API itself is documented in `docs/FIGURES.md` (owned by the foundation).
