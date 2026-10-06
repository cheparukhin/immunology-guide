# Figure QA, round 2: set R2 (chapters 4, 5, 6)

Reviewer brief: `docs/QA.md`. Set: ch04-mhc1-pathway, ch04-peptide-plus-groove, ch04-cross-presentation, ch04-lymph-node-search, ch04-three-signals, ch05-thymus, ch05-kill, ch05-brakes, ch05-exhaustion, ch06-clonal-evolution, ch06-typo-to-target, ch06-tmb, plus ch06-antigen-kinds (added by the supervisor mid-pass).

How each figure was walked: every step at 1440 and 390 (light page theme; dark page theme on the light-stage and below-stage parts), every scenario/preset/toggle that changes the drawing, the free-play end states, and reduced motion (`tools/shot.mjs`). `tools/stepper-check.mjs` passes on desktop **and** mobile for all 12 steppers after the fixes ("All paths agree", 24/24 runs). `tools/check.mjs 04 05 06`: 0 errors, 0 warnings. No console errors or warnings in any run.

Performance was measured with a Playwright probe (scratchpad `r2/probe.mjs`). It counts nodes under `[data-figure]`, samples rAF during the heaviest animation (a step playing or the sim running), and repeats the busiest figures under 4× CPU throttling. "Steps" are the stepper's label-to-label durations, in seconds.

| Figure | Status | Nodes (before → after) | fps (4× throttle) | Steps (s), after |
|---|---|---|---|---|
| ch04-mhc1-pathway | fixed | 824 | 60 | 3.7 · 2.0 · 4.4 · 3.0 · 3.5 · 6.4 |
| ch04-peptide-plus-groove | ✓ shipped | 297 | 60 | (control-driven) |
| ch04-cross-presentation | fixed | 663 | 60 | 7.0 · 6.0 · 6.5 |
| ch04-lymph-node-search | fixed (minor) | 230 + canvas | 60 (53) | sim |
| ch04-three-signals | fixed | 1,781 | 60 | 7.3 · **11 → 9.8** · 5.2 |
| ch05-thymus | fixed | **3,885 → 2,585** | 60 during the run | 3.2 · **8.6 → 7.4** · 6.8 · **11.2 → 9.4** · **12.2 → 10.3** · 8.3 |
| ch05-kill | fixed (minor) | 1,690 | 60 | 6.8 · 4.2 · 4.4 · 5.2 · 4.4 · 9.9 · 4.1 · 5.6 |
| ch05-brakes | fixed | 3,567 | 60 (60) | **10.0 → 9.1** · 3.7 · 3.3 · 4.4 · **15.8 → 10.4** · 8.6 |
| ch05-exhaustion | fixed | **4,749 → 3,951** | 60 (56–60) | 6.5 · 5.4 · 4.2 · 6.0 · 5.5 |
| ch06-clonal-evolution | ✓ shipped | 168 + canvas | 60 (52 at 16×) | 5.0 · 7.0 · 9.0 · 6.0 · 6.5 · 7.5 · 1.4 |
| ch06-antigen-kinds | fixed (science wording) | 253 | 60 | ≤ 1 s each |
| ch06-typo-to-target | fixed | 1,871 | 60 | 2.3 · 2.9 · 4.8 · 8.3 · 6.5 · 6.3 |
| ch06-tmb | ✓ shipped | 1,004 | 60 | 2.5 · 1.9 · 2.3 |

Steps that still run longer than ~8 s carry several story beats each:
- thymus 4 and 5: a new candidate arrives, builds its receptor, docks, reads the dial, dies, and is cleared.
- brakes 1: activation, then three divisions.
- brakes 5: three beats, kill → IFN-γ → PD-L1, as the spec asks.
- three-signals 2: maturation, docking, two signals, activation, two divisions.
- kill 6: the canonical death plus the macrophage clean-up.

All of these are under ~10 s, and nothing loops or waits idle.

---

## Cross-figure consistency (checked)

- **MHC class I** is drawn identically in ch02-nk-missing-self, ch04-mhc1-pathway and ch04-cross-presentation: the library `mhc1`, high detail, the same `['square','square']` pockets and anchors, self peptide in sand. ch04-three-signals uses the cell-scale `mhc1` on the DC, which is right at that scale. ch06-typo-to-target varies the pockets per patient on purpose (HLA). ✓
- **Recognition grammar** (ch05-kill is the reference, left untouched):
  - In three figures the T cell **overlapped the cup it was reading**, covering the very peptide it recognizes: ch04-mhc1-pathway, ch04-cross-presentation, and ch06-typo-to-target's pipeline endpoint.
  - In ch04-cross-presentation the helper's "+" disc also sat on the cell body instead of at the contact.
  - All three now dock head to head: the TCR tips meet the cup rim along the cup's outward axis, and the "+" disc sits beside the contact. Details per figure below.
- Kill grammar (ch05-brakes step 5 and 6 kills, ch05-thymus deaths via `die`/`clearUp`): no flashes, the killer detaches intact. ✓
- PD-1/PD-L1, CD28/CTLA-4/B7 glyphs and signs (ch05-brakes, ch04-three-signals), hollow blue IFN-γ rings, the ✓/≈/✕ badges, stage tags, clock HUDs and the Illustrative tags all match FIGURE-AUDIT §4. ✓
- STATUS strings: ch06-antigen-kinds takes `STATUS['mrna-vaccine'].text` verbatim from `shared/cycle-data.js`. ✓

---

## Per figure

### ch04-mhc1-pathway: fixed
- **Fixed, science/grammar (high).** The patrolling T cell docked at a 50° slant with its membrane on the cup head, so its body covered the viral or neo cup it was recognizing. Desktop: the pink/coral peptide was invisible at the moment of recognition. The T cell now faces the membrane (polarity 90° / −90°) and stops with its TCR tips on the cup rim, at reach 0.28 r (§4 rule 5). The shuttered scenario touches the bare membrane the same way.
- **Fixed (medium).** The "+" disc landed on top of the cup's origin icon. It now sits on the side away from the icon, which flips with the portrait layout.
- **Fixed (low).** In the healthy end state the T cell finished next to the "shop window" label and the stage tags. It now stops one slot earlier on desktop.
- Checked and correct: 1 in 5 vs 1 in 5,000, the 8–10 aa ruler, absent cups in the shuttered window (never empty ones), NK "missing self" callback, readout and notes verbatim.

### ch04-peptide-plus-groove: ✓ shipped
- The truth table matches the spec exactly (P1/P2/P3/P1* × Ana/Ben/Chen; T1 reads only P1 in Ana, T2 only P3 in Chen). The TCR always touches peptide and ridge together, anchors point down, the escape mutation changes an anchor only.
- Low, left as is: on phones the "pocket" label sits just below the dashed "inside the cell" line. Its leader still points to the pocket.

### ch04-cross-presentation: fixed
- **Fixed (high, grammar).** Both T cells docked with their membrane on the cup head, so the helper covered the class II cup it reads. The "+" disc sat inside the helper because `recognize()` got a point with no axis. Now the TCR reach is added to the docking distance, and the cup's outward angle is passed in, so the disc goes beside the contact.
- Science checked: route B starts in the eaten-material bubble and passes through a class I loading compartment. The DC makes no tumor protein, and both T cells are in the lymph node.
- Low, left as is: on phones the "evidence board" and "shop window" labels sit at the bottom of the node with long, faint leaders.

### ch04-lymph-node-search: fixed (minor)
- **Fixed (low).** On phones the afferent lymphatic was drawn through the "LYMPH NODE" label. It now enters at −138° and is clear of the label.
- Checked:
  - No homing.
  - The calculator gives 100,000 / 3,000 per hour ≈ 33 h, then 3.3 h and 20 min.
  - The clock is calibrated to the contact count.
  - The rarity label stays visible and updates to 1 in 150 on phones.
  - The reduced-motion still shows the match, 8 copies and the open odds panel.

### ch04-three-signals: fixed
- **Fixed (medium, timing).** Step 2 went from ~11 s to 9.8 s. The DC now matures while the anergic T cell parks and the fresh T cell is already approaching. The approach, the move to the cluster and the two divisions are slightly shorter. The order of events is unchanged.
- Science checked:
  - Signal 1 alone → anergy: the cell dims, its receptors thin, and a padlock badge stays.
  - The anergic cell stays parked and a new naive cell activates.
  - Signal 3 never rescues a cell that lacks signal 2.
  - No CTLA-4 appears.
  - B7 on a quiet DC is a stubby nub, never a grayed copy.

### ch05-thymus: fixed
- **Fixed (medium, performance).** The "Fate of every 100" strip stacks four shared unit grids, and each unit carries body, ring, hatch and check parts, so the grids alone took 2,400 nodes. Each layer only ever shows one look, so the module now prunes the parts it never uses. The never-used hatch, whose pattern ids depended on mount order, goes too. The figure drops to 2,585 nodes and the run still holds 60 fps.
- **Fixed (medium, timing).** Death now takes 2.0 s, as specced ("dims over ~2 s"), and the macrophage starts tidying as the last fragments form. The candidate arrives sooner in step 4 and the medulla walk is quicker in step 5. Result: step 2 7.4 s, step 4 9.4 s, step 5 10.3 s, down from 8.6, 11.2 and 12.2.
- **Phone stage height (~637 px), left as is (low).** Stage plus controls (~700 px) fit one phone screen. Step 6 uses the full height (cortex, medulla, body map, 100-unit tally), so shrinking it means re-laying out every compact coordinate. The cost is an empty band between cortex and the dimmed medulla in steps 1–4.
- Science checked:
  - The receptor is built in the thymus.
  - Selection never reshapes a receptor.
  - Neglect is the absence of a signal; deletion is a strong signal.
  - Macrophages only clean up.
  - The run gives about 3 in 100 with AIRE on and about 4 in 100 with AIRE off, with the escaped organ-reactive cells shown on the body map.
  - The "Illustrative" tag stays visible during the AIRE-off run.

### ch05-kill (canonical): fixed (minor; grammar untouched)
- **Fixed (low).** On phones the "5 micrometers" scale bar sat behind the "cells" thumbnail, so ghost text "…meters" peeked out while the lens was open. The compact layout now puts the bar bottom-right.
- Left as is: step 6 runs 9.9 s, because the death plus the macrophage clean-up is the reference grammar.

### ch05-brakes: fixed
- **Fixed (high, timing).** Step 5 went from 15.8 s to 10.4 s:
  - The killer polarizes as recognition starts, so `kill()` skips its 1.4 s re-aim.
  - The neighbours start displaying PD-L1 when the killer lets go.
  - The T cell crawls on while PD-L1 comes up.
  - One crawl speed (170 u/s) is used throughout. PD-1 still never slows the cell (spec guardrail).
- **Fixed (medium, timing).** Step 1 went from 10.0 s to 9.1 s, with slightly faster divisions.
- **Fixed (medium, legibility).** The ledger's zone words read "RESTING · FULL THROTTLE" with "ACTIVE" directly underneath, so they read as one label. Now "Resting · Active" share row 1 and "Full throttle" drops to row 2 with the meter's leader on its zone.
- **Fixed (medium).** In step 4 (No CTLA-4) the spilling T cells covered the "Many clones, many against self" label. The spill's angle range was trimmed, and it still spills past the node outline.
- Nodes: 3,567, about half of them in the hidden tissue scene. 60 fps even at 4× throttling, so left as is.

### ch05-exhaustion: fixed
- **Fixed (high, performance; the flagged item).** Every slot carried three full T-cell drawings (activated, resting, exhausted) at about 55 nodes each, plus four migrants. Slots now draw only the looks their group can ever show, derived from the keyframes:
  - stem-like slots never look exhausted;
  - lymph-node "E" and tissue-wave slots never look resting;
  - migrants only look activated.

  Down from 4,749 to 3,951 nodes, with identical pixels on every step and scenario. 56–60 fps at 4× throttling.
- Further cuts are possible but not done: per-group badge counts, and lighter receptor keys on the art side.
- Science checked:
  - TOX tags the whole lineage, stem-like cells included.
  - The padlock marks only terminal cells ("terminal (TCF1 lost)").
  - Stem-like cells carry PD-1.
  - After release the response re-exhausts at +25 d.
  - Without the reserve, release has only a small effect.
  - The footnote sits on the stage.
  - No antibodies are drawn.

### ch06-clonal-evolution: ✓ shipped
- Tuning targets hit on desktop and phone: "about a quarter" of cells carry a driver by step 3, next to the measured 18–32%. The violet cancer look appears only at 3 drivers, and only 3+ drivers cross the boundary layer. The trunk/branch view appears only at step 6, with letter + hatch branches (§4 rule 15). Free play resets to year 0.
- 52 fps at 16× under 4× throttling.

### ch06-antigen-kinds (added mid-pass): fixed
- **Fixed (high, science; supervisor item).** The KRAS G12D card called HLA-C*08:02 "the one validated in a treated patient", a uniqueness claim. It also said HLA-A*11:01 displays "a longer version of the same fragment". It does not: HLA-A*11:01 presents an overlapping G12D peptide spanning residues 7/8–16 (Wang et al., Cancer Immunol Res 2016, doi:10.1158/2326-6066.CIR-15-0188), not an extension of GADGVGKSA. The module now reads:
  > "The best-documented type, HLA-C*08:02, is carried by roughly 8% of white and 11% of Black Americans, and HLA-A*11:01 can display an overlapping fragment that carries the same mutation; many people's types display it poorly or not at all."

  The draft spec needs the same edit (see Requests).
- Checked:
  - HER2 is the library `antigen()` diamond on a stalk; peptide targets are beads, never on stalks (§4 rule 4).
  - Map positions are as specced and defensible. Neoantigen (0.92, 0.10) and KRAS (0.90, 0.55) are far right. HPV (0.95, 0.80) is the most specific and high. Cancer-testis antigens (0.78, 0.70) sit short of perfectly specific. HER2 (0.30, 0.78) is shared but also on healthy cells.
  - Marker size encodes how many cancers carry a target of that kind, with a legend.
  - The personalized-vaccine status is `STATUS['mrna-vaccine'].text` verbatim.
  - Other card facts check out: afami-cel (2024), the 2010 HER2 CAR-T death, KRAS ~45% pancreatic / ~13% colorectal, HLA-C*08:02 8% / 11%.
  - Mobile layout and both page themes are good.

### ch06-typo-to-target: fixed
- **Fixed (high, grammar).** At the pipeline endpoint the T cell landed centered *on* the mutant cup, covering the peptide it recognizes. Cause: the shared `approach()` ignores `gap`/`angle` when the target is a point (see Requests). The contact point is now computed locally along the cup's outward axis, with the TCR tips on the rim. On phones the strip under gate band 5 is short, so the T cell docks obliquely from the upper left and no longer covers band 5 (cell r 18 → 15 there).
- Science checked:
  - The KRAS DNA (NM_004985, codons 1–18) and protein (MTEYKLVVVGAGGVGKSA → G12D) are right.
  - The fragment is GADGVGKSA (residues 10–18).
  - Only HLA-C*08:02 is labeled, and Patient B never displays the fragment.
  - The scoreboard is a unit grid with the measured 1.6% (Parkhurst 2019) and its source line.
- Low, left as is:
  - On phones the "NOT TO SCALE" tag touches gate band 1's top border.
  - The "killer T cell" label stays at the cell's waiting spot after it docks.

### ch06-tmb: ✓ shipped
- Log axis 0.03–1,000, quantile dot strips, child/adult/MSI-high told apart by shape, both brackets, the sun/smoke tags, "≈ 11×" on the colorectal pair, and the source line all match the spec. "MSI-high" is used, never "MSI-H". No FDA cut-off line is drawn.
- Phone layout and the dark page theme are fine.

---

## Requests (shared code / drafts): not edited by me

1. **`assets/js/figures/shared/cell-actions.js`, `approach()` (line ~287), bug.**
   - What happens: `if (!isRig(target)) return move(tl, mover, { x: target.x, y: target.y, … })` ignores `gap` and `angle`, so the mover lands centered on a point target. `docs/shared/cell-actions.md` promises "move to just short of target (Rig or {x,y})".
   - Proposed fix: for points, `a = (angle ?? angleFromTargetToMover) * DEG`, `x = target.x + cos(a) * (mover.r + gap)`, `y = target.y + sin(a) * (mover.r + gap)`, and set `mover.plan.contact = { x: target.x, y: target.y, angle: a + 180 }`.
   - My figures no longer depend on it.
   - Owners to re-check after the fix: **ch08-two-brakes l.546/561** (`approach(tl, A, tgt, …)`) and **ch12-resistance l.431**, if their targets are points.
2. **`shared/activity-meter.js`, ledger zone labels (low).** When labels are crowded the meter always drops the *odd* ones (k = 1) to row 2. A `zoneRows` option, or "drop the narrowest zone", would replace the DOM rearrangement now in ch05-brakes.
3. **`shared/unit-grid.js` (low).** A `parts` option (e.g. `parts: ['body']`), so layered grids don't create unused ring/hatch/check paths. ch05-thymus prunes them itself today.
4. **Draft `content/drafts/06-cancer.md`, ch06-antigen-kinds spec, KRAS G12D "The catch".**
   - Replace: "The best-documented type, HLA-C\*08:02 — the one validated in a treated patient — is carried by roughly 8% of white and 11% of Black Americans, and HLA-A\*11:01 can display a longer version of the same fragment;"
   - With: "The best-documented type, HLA-C\*08:02, is carried by roughly 8% of white and 11% of Black Americans, and HLA-A\*11:01 can display an overlapping fragment that carries the same mutation;"
   - Same draft, ch06-typo-to-target SCIENTIFIC CARE (spec only, not on the page): "HLA-A\*11:01 displays the longer, ten-amino-acid version" → "HLA-A\*11:01 displays an overlapping fragment (residues 7/8–16)".

No step caption was found to be wrong.

---

## Polish round (POLISH.md → Figures → R2)

All items from POLISH.md R2 are done in my modules. After the changes:
- `stepper-check` passes on desktop and mobile for all 9 touched steppers (18 runs).
- `check.mjs` on chapters 4–6 reports 0 errors and 0 warnings.
- I re-ran `measure-figures` for chapters 4, 5 and 6 and rebuilt those pages.
- No console errors in any run.

The foundation's stepper changes (Play-all pacing, caption placement) haven't landed yet; I'll re-check once they do.

- **ch04-three-signals (A4/A6).**
  - The magnified contact now reads Signal 1 · 2 · 3, left to right, on both layouts.
  - The switches and presets are live from the start; the "step through to unlock" gating and its note are gone.
  - Using a switch or preset pauses Play-all.
  - While the reader's own switches or a preset are showing, a scenario line replaces the step caption: **SCENARIO** or **YOUR SWITCHES** plus one sentence per preset or outcome. The preset sentences are no longer repeated in the outcome card.
  - The stepper hides that line again.
- **ch04-mhc1-pathway (A6, palette).**
  - In the virus, mutated and shuttered scenarios, a one-line scenario note sits under the step caption, so the text matches the stage at every step.
  - The cell interior is now a light haze of the cell's own color (sand, or violet for cancer) over the navy stage, instead of the opaque dark-sand fill that read as muddy brown.
- **ch04-peptide-plus-groove (A7).**
  - From step 1 the readout shows three avatars: Ana (active), Ben and Chen (dimmed), with "Ben and Chen join at step 3".
  - At step 3 the grid fades in one person (column) at a time.
  - "Displayed, but this T cell can't read it" now uses a hollow-eye glyph instead of ≈, in the grid, the legend and the on-stage badge. The screen-reader text says "Displayed, not recognized".
- **ch05-brakes (A5, plus the B6 meter restyle).**
  - One focal panel at a time; the others dim to 38%:
    - step 1: the magnified window, then the node;
    - step 2: the window;
    - step 3: the window, then the ledger;
    - step 4: the node;
    - step 5: the cells, then the PD-1 window, then the cells;
    - step 6: the window, then the cells.
  - On phones, small-caps labels are now at least 13.5 px (they were 11 px).
  - The ledger passes `tone: 'benefit'`. Re-checked desktop and phone with the restyled meter (blue net bar, hairline tracks); my zone-word rearrangement still works.
  - Step 5 is now 10.9 s.
- **ch05-exhaustion (A5).**
  - The per-cell "badge soup" is gone (the TOX and TCF1 text pills, up to 3 "−" discs). Each cell now shows its glow plus at most one ring and two small glyphs:
    - glow = how well the cell works;
    - dashed silver ring = TOX on (the exhausted family);
    - mint ring = stem-like reserve (TCF1), also TOX on;
    - padlock = terminal (TCF1 lost);
    - one crimson "−" = the PD-1 brake, struck through on release.
  - One legend sits right under the stage, and its entries appear with their step.
  - One focal panel per step (the other panels are veiled):
    - step 1: everything;
    - step 2: the tissue;
    - step 3: both compartments;
    - step 4: the lymph node;
    - step 5: everything.
  - The "Simplified…" footnote moved out of the stage into the caption area. Stage aspect is now 960 × 604 (desktop) and 400 × 778 (phone).
  - Nodes 3,951 → 3,405; 60 fps under 4× throttling.
  - Guardrails kept:
    - TOX still marks the whole lineage, stem-like included (the mint ring stands for "TOX on" too, and the legend says so).
    - The padlock means terminal only.
    - Stem-like cells keep their PD-1 disc.
- **ch04-cross-presentation (A12).** The tumor panel now holds three living violet tumor cells (scenery), so it's no longer a void with "dying tumor cell" in it during steps 1–2. Both layouts updated.
- **ch04-lymph-node-search.** "Find the match" now fast-forwards: it rings the match and runs the same unbiased random walk at 16× until the encounter, then drops back to the reader's speed for the recognition and the copies. The match arrives about 1.6 s after the click (it used to take 8 s or more). Reduced motion is unchanged: a still with the match shown.
- **ch05-thymus.**
  - Both coral macrophages carry a "Macrophage" label for the whole figure.
  - Units now agree: the strip reads "Fate of 1,000 thymocytes · 1 dot = 10" (phones: 400, 1 dot = 4), so the waffle and the running counters measure the same thing.
- **ch05-kill.** The "Macrophage" label now stays on through steps 7–8 and drifts with the cell, so the coral cell beside "Next target" is never unlabeled. The kill grammar is untouched.
- **ch06-clonal-evolution (B13).** The driver scale now runs "none → all", so the "most" readout under faulty repair never sits against an end labeled "half". The measured 18–32% band is kept.

**Request (consistency, R3 owner):** ch08-two-brakes still draws the old exhaustion marks from `shared/exhaustion-marks.js`: TOX and TCF1 text pills and up to three "−" discs per cell. It should adopt the same ring vocabulary and legend as ch05-exhaustion, so the two read as one family. The words are unchanged.

---

## Final re-check (after foundation S1/S2/S8 landed)

All 13 R2 figures re-shot at 1440 and 390, light and dark (52 shots). No console errors or warnings, no overflow. `stepper-check` passes on desktop and mobile for all 12 steppers, and `check.mjs` on chapters 4–6 is clean. Figure sizes were re-measured and chapters 4–6 rebuilt.

- **Control vocabulary (S8):**
  - ch05-kill: "Replay step" → **Replay**.
  - ch05-exhaustion: "Restart" → **Replay**.
  - ch05-thymus: run button "Run again" / "Restart" → **Replay**.
  - ch06-antigen-kinds: "Clear" → **Reset** (with the reset icon).
- **Stage, stepper and caption stay together on phones:**
  - ch04-three-signals: the outcome card moves from under the stage to the top of the controls, right after the caption. On wide figures it stays beside the stage.
  - ch06-tmb: the row-card hint and the long source note move after the caption. The source line is still always visible; on desktop both stay where they were.
  - ch05-exhaustion: the marks legend and the cell-card hint now come after the caption at every width.
- **Small fixes:**
  - ch05-brakes: on phones the B7 "i" chip moves to the left of its label (it touched "B7" and "B7: 8").
  - ch04-cross-presentation: on phones only one tumor neighbour remains (the second crowded the bubble label and the stage tags).
- **Left as is (spec'd):** ch04-mhc1-pathway's "What's in the window" readout still sits between the stage and the stepper on phones. The spec puts it under the stage, and it is part of the figure's state, not a note.
