# Focus redraw: guide-wide pass

This plan redraws every figure stage in the Focus language (Polychromie palette, Jost type, flat shapes on a cream plate). Each figure keeps its steps, captions, facts and controls.

**The bar:** the three pilots (Figures 5.1, 7.4 and 8.1) met it, and every figure must too. A figure is more legible than the live one, clearly, in blind judging.

The evidence and the kit live in `explorations/round6/focus-build/` (`NOTES.md`, `assets/js/focus/README.md`), which is untracked.

This is a working plan. When the pass merges, its lasting rules will already be in `PLAN.md` §4, `DESIGN.md`, `ART.md` and `FIGURE-AUDIT.md` §4, and this file is deleted.

## Decisions

Each has a default, which applies unless changed:

1. **Branch.** All work goes on a `focus-redraw` branch, merged once every figure passes. The alternative, merging chapter by chapter, would leave the live site in two styles for weeks.
2. **Dark theme.** The cream plates look the same in both themes, as dark stages do today. A dark Focus variant would double the palette and judging work.
3. **Effort.** xhigh for illustrated figures, heroes and the home-page hero; high for charts and the small home figures.
4. **Judging.** Every figure in batch 1. After that, one figure per batch at random, plus any figure whose builder or reviewer flags a trade-off.
5. **Pacing.** No new batch starts while the account's weekly usage is above 80%, so other projects keep headroom.

## Scope

| Kind | Count | Modules | Treatment |
|---|---|---|---|
| Illustrated figures | 38 | listed under Batches | redraw from scratch |
| Charts | 10 | `ch01-census`, `ch03-numbers`, `ch06-antigen-kinds`, `ch06-tmb`, `ch07-evidence`, `ch08-tail`, `ch08-side-effects`, `ch11-hpv`, `ch12-ctdna`, `int-timeline` | restyle through `shared/chart.js` and the chart tokens, checked one by one; `ch06-antigen-kinds` draws cells, so its packet decides whether it needs a redraw |
| Heroes | 13 | `ch01-hero` … `ch12-hero`, `int-hero` (each is placed twice and built once) | redraw on a Focus hero kit |
| Home page | 4 | `home-hero`, `home-big-idea`, `home-vignette`, `home-window` | redraw |
| Already built | 3 | `ch05-thymus`, `ch07-tme`, `ch08-blockade` | port in Phase 0 |

**Two kinds of figure won't fit the measured hour per figure:**
- **Canvas figures,** which need a Focus sprite path: `ch04-lymph-node-search`, `ch06-clonal-evolution`, `ch06-antigen-kinds`, `ch07-immunoediting`, `ch10-crs`, `ch11-oncolytic`, `home-hero`.
- **The largest modules:** `ch01-scale` (1,856 lines) and `ch06-clonal-evolution` (1,722).

## Phase 0: foundation (once, on the branch)

**Kit,** moved from `explorations/round6/focus-build/assets/js/focus/` to `assets/js/focus/`:
- **Complete the roster.** The kit has 12 cell factories; the guide uses about 20 cell types and 24 molecule families. Add the missing ones, then draw a roster sheet and check it against the palette test (`explorations/round6/palette-test/`).
- **A canvas sprite path** for crowds, drawn with the same flat glyphs.
- **A hero kit.** Prototype one hero first.
- **What the pilot builders asked for:**
  - a tablet layout for 600–1151 px;
  - settable `dial`, `bar` and `tally`;
  - a leader-target chooser;
  - a hover/tap naming helper;
  - an animatable `tcr` lift;
  - loupe labels at fixed pixel offsets;
  - a distinct PD-L1 head;
  - a hollow "−" chip.
- **Audit:** add the 768 px width, and catch text that sits on membranes or molecules.

**Site:**
- Jost and Didact Gothic go into `assets/fonts/`.
- The entity palette goes into `tokens.css`, both themes.
- The plate and hairline frame and the Jost type classes go into `figures.css`.
- `chart.js` gets the new palette and type.

**Pilots:**
- Port the three modules into `assets/js/figures/`.
- Their caption and accuracy changes go into the `:::figure` blocks in `content/drafts/NN-*.md`, not into JS strings. Pages are built from the drafts by `tools/build-content.mjs`.
- Rebuild the three pages.

**Documents, amended in place:**
- `aggregate/FIGURE-AUDIT.md` §4 is binding and mostly about style (dark stages, glow, hex colours). Keep its content rules:
  - a hidden cell shows no MHC cups, rather than empty cups on its surface;
  - the recognition ring;
  - attrition is shown in the scene;
  - real numbers are kept apart from stylized ones.

  Restate the style rules for Focus.
- `BUILD.md`: its builder brief allows imports only from `../art/`. Rewrite it as the Focus builder brief, adapted from the pilot workflow prompts.
- `PLAN.md` §4, `DESIGN.md` §2 and §8, and `ART.md`, which points to the kit reference. Change `FIGURES.md` only if `ctx` changes.

**Tools:** `tools/shot.mjs` gains the kit's label audit and the 768 px width, plus a live-vs-build compare mode.

**Gate:** the three ported figures pass the audit in the real chapter pages, at 390, 768 and 1440 px, in both themes, and the roster sheet reads cleanly. Run `codex-review` on the kit and the ports, then commit.

## Per-figure pipeline

| Step | Who | Output |
|---|---|---|
| 1. Content packet | Opus, medium | `explorations/redraw/<id>/CONTENT.md`: steps, verbatim captions, facts, controls and states, taken from the draft's `:::figure` block, the surrounding prose and the live module. Design-neutral; plus `states.json` |
| 2. Prototype | Opus, medium | static key states at desktop and phone width, designed from the packet without seeing the live drawing |
| 3. Check | supervisor | compared with the live shots; one redo if the staging is weak |
| 4. Build | Opus, xhigh | `assets/js/figures/<id>.js` on the kit; shots; audit |
| 5. Accuracy review | Opus, immunologist | `explorations/redraw/<id>/ACCURACY.md` |
| 6. Fix | Opus, xhigh | fixes in the module; caption changes in the draft |
| 7. Verify | supervisor | the checks under "Done for a figure" below |
| 8. Judge | two Opus judges, A/B swapped | sampled, per decision 4 |

**Done for a figure:**
- the audit passes at 390, 768 and 1440 px in both themes;
- `tools/stepper-check.mjs` and `tools/check.mjs` are clean, and the console has no errors;
- every control has been tested with real clicks;
- every review item is applied, or rejected with a reason;
- the captions match the draft;
- the supervisor has looked at every key state.

## Batches

Three figures run in parallel per batch, which is the measured unit. After each batch:
1. **Kit curation:** parts that recur move into the kit, and every figure built so far is reshot to catch regressions.
2. `codex-review`.
3. One commit on the branch.
4. Merge `main` into the branch.
5. Check usage before the next launch.

**Order:** the chapters around the pilots come first, because the kit already has their vocabulary. Then chapters 4 → 1, which extend the kit from molecules out to the cell roster. Then the rest.

| Batch | Figures |
|---|---|
| 1 (calibration, all judged) | `ch05-kill`, `ch05-brakes`, `ch08-two-brakes` |
| 2 | `ch05-exhaustion`, `ch05-whole-team`, `ch07-cycle` |
| 3 | `ch07-immunoediting`, `ch04-peptide-plus-groove`, `ch04-three-signals` |
| 4 | `ch04-mhc1-pathway`, `ch04-cross-presentation`, `ch04-lymph-node-search` |
| 5 | `ch03-antibody`, `ch03-vdj`, `ch03-clonal-selection` |
| 6 | `ch02-pattern-recognition`, `ch02-inflammation`, `ch02-nk-missing-self` |
| 7 | `ch02-macrophage-spectrum`, `ch01-gene-to-protein`, `ch01-binding` |
| 8 | `ch01-scale`, `ch06-typo-to-target`, `ch09-humanization` |
| 9 | `ch06-clonal-evolution`, `ch09-wiring`, `ch09-adc` |
| 10 | `ch09-bridge`, `ch10-build-a-car`, `ch10-logic-gates` |
| 11 | `ch10-journey`, `ch10-crs`, `ch11-four-fixes` |
| 12 | `ch11-personal-vaccine`, `ch11-oncolytic`, `ch12-resistance` |
| 13 | `ch12-combinations`, `ch12-neoadjuvant` |
| 14–15 | heroes |
| 16 | charts |
| 17 | home page |

**Prose colour pass:** once a chapter's figures are done, one agent updates that chapter's draft. The drafts name colours about 450 times, and those names must match the new palette.

**Before the merge:**
- full-site QA with `tools/check.mjs` and shots of every page in both themes;
- one blind judge pair on a sample of figures across the chapters;
- the documents checked against what was built.

## Stop rules

- **A judged figure that is not clearly more legible than the live one:** stop, find out why, and fix the process before the next batch.
- **Weekly usage above the pacing threshold:** start no new batch. A batch cut off by the limit resumes from the workflow cache.
- **After batch 1:** re-estimate the budget from the usage before and after the batch, and report it before batch 2.

## Budget

Shares of one weekly limit (all models).

**The measured anchor:** three figures, built, reviewed and fixed on a finished kit, plus six judges and supervision, used at most 9% of a weekly limit. Another session shared that window, so this is an upper bound.

| Item | Share | Basis |
|---|---|---|
| Phase 0 | 20–30% | estimate |
| Content packets (55) | 5–8% | estimate |
| Prototypes and checks (38) | 15–23% | estimate (pilot prototypes took 7–30 min at medium) |
| Build, review, fix (38) | 105–125% | measured: ≤ 3% per figure, plus extra for canvas and large modules |
| Heroes (13) | 13–20% | estimate |
| Charts (10) and home page (4) | 10–16% | estimate |
| Prose colour pass | 3–5% | estimate |
| Judging | 9–10% | measured: about 2% for six judges |
| Kit curation, regression shots, `codex-review` | 8–10% | estimate |
| Supervision | 10–15% | estimate |
| **Total** | **about 200–260%** | |

That is about **2–2.6 weekly limits**, or roughly three weeks at the 80% pacing threshold. The earlier figure of 2–2.5 did not count the per-figure prototypes or the larger canvas figures.

## Risks

- **The live-site accuracy fixes** (a separate task on `main`) touch the three pilot modules and their drafts. When merging `main` into the branch, keep the Focus modules and the drafts' new captions.
- **Kit changes can break built figures.** The regression reshoot after each batch catches this.
- **Consistency across about 40 builders.** It rests on:
  - one builder brief;
  - the rule that the kit comes first: no local copies of a part the kit has;
  - kit curation after each batch;
  - the supervisor looking at every figure.
- **The branch drifts from `main`** while the prose is still being edited. Merging `main` after each batch keeps the drift small.
