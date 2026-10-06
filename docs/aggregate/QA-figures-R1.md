# QA figures: set R1 (Ch 1, Ch 2, Ch 3, home)

Reviewer pass per `docs/QA.md`. Each figure was walked through every step, preset and toggle at 1440 and 390 wide, in light and dark page themes and with reduced motion (`tools/shot.mjs`, frame-by-frame captures, `tools/stepper-check.mjs`). FPS was sampled with rAF during the busiest animation (step play-all, kill, tour, Build 100). Node counts are `[data-figure=ID] *`.

**Summary:** 16 figures. 9 fixed in their modules, 7 shipped with no change. None needs a shared-code change. `tools/check.mjs` reports 0 errors and 0 warnings on 01, 02, 03 and index. No console errors or warnings in any run. Every stepper passes stepper-check: on desktop for all of them, and also on phone for gene-to-protein, inflammation, clonal-selection and big-idea. Page 01's sizes were re-measured and the page rebuilt.

| Figure | Status | fps (desktop / phone) | Nodes |
|---|---|---|---|
| ch01-scale | fixed | 60 (tour) | 2,812 |
| ch01-gene-to-protein | fixed | 60 (play-all) | 1,310 |
| ch01-binding | ✓ shipped | 60 / 60 (80 ligands) | 108 + canvas |
| ch01-census | ✓ shipped | 60 (re-layout) | 2,414 |
| ch02-pattern-recognition | ✓ shipped | 60 | 703 |
| ch02-inflammation | ✓ shipped (neutrophil verified) | 60 / 60 | 2,059 |
| ch02-nk-missing-self | ✓ shipped | 60 (kill) | 380 |
| ch02-macrophage-spectrum | fixed | 60 (tumor on) | 591 |
| ch03-vdj | ✓ shipped | 60 (build) | 1,292 |
| ch03-numbers | fixed | 60 | 280 |
| ch03-clonal-selection | fixed (known item) | 60 / 60 | 309 + canvas |
| ch03-antibody | fixed | 60 | 165 |
| home-hero | fixed | 60 / 60 | 1,728 + 2 canvases |
| home-big-idea | fixed (science) | 60 | 529 |
| home-vignette | ✓ shipped | 60 | 165 (×3) |
| home-window | ✓ shipped | 60 | 183 |

---

## Chapter 1 (01-cells.html)

### ch01-scale: fixed
- **Science:** all 8 stops match the spec ratios. The antibody binds the spike head by its arm tips. The viruses are enveloped, with sparse spikes. The T-cell nucleus fills most of the cell. Red blood cells and bacteria have no nucleus.
- **Fixed (legibility):** the "Width of view" readout (HTML, top left) sat directly on bright line art at stops 1–3 (hand, fingerprint, skin), and its text-shadow alone wasn't enough. It now has a soft stage-colored backing (`.s1-readout` background, `color-mix`).
- **Fixed (phone):** at stop 4 the "red blood cells" label crowded the capillary and the macrophage label. It moved to the left of the vessel (compact offset).
- **Remaining:** none. The node count (2.8k) is near the ~3k smell threshold, but the eight scenes crossfade and fps holds at 60. *Low:* if a later change adds detail, move the bead-level stop 8 to a cached bitmap.

### ch01-gene-to-protein: fixed
- **Known item verified:** mRNA export is 5′-first. Bases leave the hairpin lane in order, pass the pore 5′ end leading, and are laid along the cytoplasm line from the ribosome end (5′, left) outward. Frame captures across step 3 confirm this, and it matches the code.
- **Science:** HBB codons, START labelling and the 1–8 numbering are correct. The four chips give the correct verdicts (silent GAA, sickle GTG, HbC AAG, stop TAG → "5 amino acids"). Letter taps open an infoCard with three choices. The START codon is locked.
- **Fixed (terminology):** CSS `text-transform: uppercase` turned "mRNA" into "MRNA" in two places: the strip header "mRNA copy" and the in-stage "mRNA" label (the `t-caps` class). The header now spells its own capitals ("DNA · CODING STRAND" / "mRNA COPY"). The SVG label keeps the small caps style but with `text-transform: none`.
- **Fixed (layout):** the strip header now left-aligns to the strip instead of floating centered over codon 4. The strip is a centered grid column.
- **Fixed (phone):** the "mRNA" label sat at the bottom edge under the strip line and was clipped. It now sits at the line's start. The "+ 138 more amino acids" counter moved up so it no longer touches the mRNA line.
- stepper-check passes on desktop and phone. Sizes re-measured and page 01 rebuilt.

### ch01-binding: ✓ shipped
- **Tuning targets** (3 seeds, 60 simulated seconds, headless `simulateOccupancy`):
  - Desktop: snug@20 69%, look-alike@20 23%, look-alike@80 65%, wrong@80 4.5%. All within target.
  - Phone (8 receptors): 59%, 24%, 57% and 3.8%.
- **Science:** receptors are slate (#A9B1CC), not MHC silver, with a squared notch, and the caption says "Receptors (cups)". This resolves EDITOR-REVIEW Ch 1 #2. "Illustrative" and "Time compressed" tags are present. Reduced motion shows the equilibrium snapshot plus "Run 10 seconds".
- **Remaining (low):** snug occupancy at the phone default (59%) is a little under the spec's "≥ ~70%". It still reads as mostly occupied. Raise the phone default count from 14 to 16 if desired.

### ch01-census: ✓ shipped
- **Data:** squares per place and type match the draft's largest-remainder table. Weight view: 122 squares, macrophages 60, NK shown as a partial square. The source line is always visible, on phones too.
- **Interaction:** legend highlight dims the other groups (works for colorblind readers). "Show numbers" table is present. Light and dark themes re-render correctly. Phone: single column, 8-wide clusters.
- **Remaining:** none.

## Chapter 2 (02-innate.html)

### ch02-pattern-recognition: ✓ shipped
- **Science:** TLR4 and TLR5 sit on the surface. TLR8/7 and TLR9 sit in the bubble membrane. RIG-I, cGAS and NLRP3 sit in the interior. STING is on the ER strip. The P2X7 gate opens rather than binding, and NLRP3 assembles. The healthy cell lights nothing. Readouts are verbatim. "What if it dies messily?" works. Numbered badges show on every screen size.
- **Remaining:** none.

### ch02-inflammation: ✓ shipped (known item checked)
- **Known item:** the module already uses the updated library `neutrophil({ state: 'crawling' })`, with a broad ruffled lamellipodium and a uropod knob. It swaps to it after the cell squeezes out (steps 7–8) and polarizes toward its bacterium. That shape is better than the old lemon form, so it is adopted, and no change was needed. Neutrophils inside the vessel stay round, which is correct for rolling.
- **Science:**
  - The order is roll → stick → squeeze, between the endothelial cells.
  - Rolling and gripping molecules are drawn differently: hooks for rolling, a clamp for the strong grip.
  - Red blood cells stay inside the vessel.
  - The four-signs strip is correct.
  - The macrophage polarizes toward repair in step 9.
- 9 steps grouped in 3 phases. stepper-check passes on desktop and phone.
- **Remaining:** none.

### ch02-nk-missing-self: ✓ shipped
- **Model:** the presets give Spared, Killed, Spared, Killed exactly as the spec says. Absent cups (not empty cups) show an emptied window. The "Simplified model" tag is present. The T-cell notes and the "Hiding from T cells…" second line are correct.
- **Kill grammar:** shared `cell-actions` (dock, polarize, kill, `setDying`). "New target" appears after a kill. The phone layout matches the spec (balance on top, NK above the target).
- **Remaining (low, shared, optional):** after polarizing, the centrosome aster (`ensureMtoc`, bright white core and spokes) reads like a small white sparkle on the orange NK cell. The same aster appears in the ch03-antibody ADCC scene. *Option:* in `assets/js/figures/shared/cell-actions.js` `ensureMtoc`, lower the dark-stage core `fill-opacity` from 0.95 to about 0.6 and the spoke color mix from 0.82 to about 0.6.

### ch02-macrophage-spectrum: fixed
- **Science:** the slider is fully reversible. The tumor toggle glides to 0.85 once and labels "tumor-associated macrophage" (never "M2"). The four caption states are verbatim. The 'M1'/'M2' end labels and their footnote are present.
- **Fixed:** with the tumor on, the branch vessel toward the cancer cells was drawn on top of the parent vessel, so its root crossed over the parent's wall. It is now drawn beneath, so the junction reads as a sprout.
- **Remaining:** none.

## Chapter 3 (03-adaptive.html)

### ch03-vdj: ✓ shipped
- **Science:** D–J joins before V–DJ. RAG cuts and a repair glyph joins. Seam edits are random, with the frame decided by net length mod 3. The other parent's copy is a separate ribbon.
- **Tallies are honest:** Build 100 gave 103 built, 56 different and 47 failed. Light-chain families use 175/325, consistent with the "≈325" decision in FIGURE-AUDIT §7.9.
- Staged disclosure A → B → C works. stepper-check passes.
- **Remaining:** none.

### ch03-numbers: fixed
- **Numbers** are consistent with the draft and with the canonical numbers in EDITOR-REVIEW: ≈70; <20,000; ≈1.8 million (5,520 × 325); 10¹⁵; 4 × 10¹¹; ≥10⁸ with a dashed extension to 10¹⁰; "over 2,000 times"; ≈500 kg. The source line is visible.
- **Fixed (legibility):** rung labels sat directly on the hatched "the gap" band, and the hatch lines ran through the text, in both themes. Labels now carry `t-halo`.
- **Remaining:** none.

### ch03-clonal-selection: fixed (known item)
- **Known item:** the scene grows B-cell clones in follicles, while the measured panel was titled "Killer T cells in mice (measured)" with nothing in the panel itself bridging the two.
  - The panel is retitled **"Measured example: killer T cells in mice"**.
  - Its subtitle is **"the same expansion, counted for one viral fragment; log scale"** (phones: "same expansion, one viral fragment; log").
  - The field note now names its cells: "Only a few hundred of the lymph node's **B cells** are drawn."
  - With the on-stage disclosure line, which was kept verbatim, the panel now reads as a mouse T-cell dataset used to illustrate the same clonal-expansion pattern.
  - This matches the Ch 3 text, which uses Blattman's mouse killer-T-cell numbers (step 3 caption and the main text) for a general clonal-selection story. FIGURE-AUDIT §7.4 is still honored: the disclosure is on the stage and "mice" and "measured" stay in the title and the counter.
- **Fixed (phone):** the step 1 label "Each cell: its own receptor / a random notch…" ran off the field's right edge. It is now centered on phones.
- **Science:**
  - Exactly 3 clones answer germ A and 2 answer germ B.
  - Contraction leaves about 15–20 memory cells, more than the 3 that started.
  - Germ-A memory stays calm for germ B.
  - Second-exposure curves are dashed and labeled "stylized".
  - The HUD never runs backward.
- stepper-check passes on desktop and phone.
- **Remaining (low, caption, optional):** step 3's caption speaks of killer T cells while the field shows B cells. The on-stage panel and disclosure now bridge this, so no edit is required. If the writer wants it tighter: in `content/drafts/03-adaptive.md`, ch03-clonal-selection step 3, append "B cells multiply the same way." to the end.

### ch03-antibody: fixed
- **Science:**
  - Tips bind and the Fc stem points out.
  - Fc receptors grab only stems.
  - Complement starts on clustered stems; a lone antibody gets no complement.
  - NK killing uses the shared kill grammar.
  - Drug antibodies (white outline) appear only in the cancer-target mode.
  - The macrophage swallows the coat with the bacterium.
- **Fixed (desktop ADCC):** the "Fc receptors grab stems" label sat on top of the "Infected cell" label. It moved above the contact.
- **Fixed (phone ADCC):** the "NK cell" label was stranded in the bottom-left corner, far from the NK cell, and "Infected cell" floated with no leader. The NK label now rides with the NK cell, and the target label has a leader to its cell. Checked with both the infected and the cancer target.
- **Remaining:** see the optional aster note under ch02-nk-missing-self.

## Home (index.html)

### home-hero: fixed
- **Fixed:** T cells used soft steering only. In a 45-second capture they overlapped each other (two blue cells merged) and slid across healthy cells they weren't visiting, which breaks the "one focal plane" illusion. A hard non-overlap pass (`separate()`) now runs after steering:
  - T cells push apart, and a docked or inspecting cell holds its ground.
  - A patroller that drifts into a healthy cell other than the one it's visiting slides back out.
  - The hunter's dock on the cancer cell is untouched.
- **Story:** patrol, inspect, cancer emerges, seek, recognition ring, apoptosis, regrow. No flashing. Reduced motion shows the recognition still with a Play button. Paused off-screen.
- **Remaining:** none.

### home-big-idea: fixed (science)
- **Fixed (§4 rule 9):** in step 3 the drug antibody hovered with its fork around PD-1, so it was unclear what it was binding. It now caps PD-1's head with one arm tip and points its Fc away (library `antibodyTips`).
- **Fixed (science):** at the end of step 3 the T cell lifted off but left PD-1, still capped by the antibody, floating at the old contact, detached from any cell. PD-1 and its antibody now move with the T cell, and PD-L1 fades with the dying cancer cell.
- stepper-check passes on desktop and phone. Captions are verbatim.
- **Remaining:** none.

### home-vignette: ✓ shipped
- The three decorative eyepieces (defenders, enemy, tide) use canonical colors, and drug antibodies have white outlines. They are `aria-hidden` and use `breathe`/`drift` via `ctx.track`.

### home-window: ✓ shipped
- Healthy, Infected and Cancer windows use sand self peptides and hot-pink foreign or mutated peptides with glow. Viral particles are inside the infected cell. The labels and captions are correct.
- **Remaining (low):** on phones the "INFECTED CELL" caps label sits close to the "Self fragment" leader. It is still legible.

---

## Shared-code / caption requests
None required. Optional, both low priority:
1. `assets/js/figures/shared/cell-actions.js`, `ensureMtoc()`: soften the dark-stage centrosome core (`fill-opacity` 0.95 → ~0.6, spoke `mix(..., WHITE, 0.82)` → ~0.6). It reads as a white sparkle in NK and ADCC scenes.
2. `content/drafts/03-adaptive.md`, ch03-clonal-selection step 3 caption: optionally append "B cells multiply the same way."

---

## Polish round (POLISH.md → Figures → R1)

Every change below makes its figure simpler and quicker to reach the point, not busier.

| Item | Change |
|---|---|
| **A1 `ch03-vdj`** | **What changed:** after the guided first cell, "Build another" and "Same pieces, new seams" no longer replay the narrated tour (the reviewer measured about 60 s). Each build now plays the same timeline compressed into about 2.4–3.6 s (`fastForward`). The stepper stays on the build's final step: step 6, or step 5 when both copies fail and the cell dies, so the caption still matches. The tally increments when the thumbnail drops in. Any stepper interaction cancels the sweep, and reduced motion jumps straight to the result. Play all still runs the slow version.<br>**Also fixed:** on phones, in the out-of-frame state, the "V·D·J" name label overlapped the "New heavy-chain gene" title, so the title is now right-aligned.<br>**Not done:** I skipped the optional "Build 10" to avoid adding another button. |
| **A2 `ch03-clonal-selection`** | **One chart at a time:**<br>• Steps 1–5 show the measured mouse T-cell count (log), with direct labels "≈150 at the start", "≈10 million by day 8" and "≈500,000 remain as memory".<br>• At step 6 the chart crossfades to **"Germ and antibody in the blood (illustrative)"**. This has a single 0–30-day axis with no axis break. The first exposure appears as faint reference lines and the second exposure is drawn bold. A key row explains the shaded "enough germ to make you ill" band.<br>• At step 7, germ B traces the same shape as the faint first-exposure lines, which shows "a first response" at a glance.<br>**Counter:** the big "≈150 → ≈10 million killer T cells" counter, which didn't match the B-cell field, is gone. The germ card in the field now counts what the field shows, e.g. **"120 cells fit it"**.<br>**Disclosure:** reworded for the new layout; it is still on the stage.<br>**Text size:** every text in the stage now renders at 12 px or more, measured on desktop and phone. |
| **A12 1.2 `ch01-gene-to-protein`** | The info card now exists only in the sandbox (`placement: 'below'`, no empty hint). Steps 1–5 use the full stage width with no persistent gutter hint. In step 6 the card opens under the stage, directly below the sequence strip. |
| **A12 1.3 `ch01-binding`** | The readout panel is now top-aligned and only as tall as its content, so there is no empty band at the top. The order is: occupancy, then signal bar, then the shape key. |
| **A12 + A13 3.2 `ch03-numbers`** | **Layout:** no side column (`chartFrame({ card: false })`). The ladder now spans the full figure width (viewBox 1000 wide). A rung's source card opens inline under the chart only after a tap.<br>**Sources and hint:** the inline [n] references are gone. There is one sources line, which also carries the tap hint.<br>**Labels:** rendered at 13–14 px on desktop, 12 px or more on phone. The gap label is set to 12.5 px.<br>**Step 6:** step 5's "2,000×/500 kg" call-out fades out and earlier rungs drop to 35% opacity, so the gap and the two estimates have room. |

**Verification:**
- stepper-check passes on desktop and phone for vdj, numbers, clonal-selection, gene-to-protein and binding.
- `check.mjs`: 01 and 03 are clean.
- No console errors.
- 60 fps (clonal-selection 295 nodes plus canvas; vdj 1,245 nodes).
- Figure sizes were re-measured for 01 and 03 and the pages rebuilt.

**Pending:** a re-check of all R1 figures once the foundation's Play-all pacing and caption-placement changes (S1/S2) land.

## Final re-check after the foundation changes (S1 pacing, S2 caption placement, stepper `phases`)

All 16 R1 figures re-shot at desktop and phone, in light and dark. stepper-check passes on desktop and phone for all 7 steppers: gene-to-protein, binding, inflammation, vdj, numbers, clonal-selection and big-idea. `check.mjs` reports 0 errors and 0 warnings on 01, 02, 03 and index. Figure sizes for 01–03 were re-measured and the pages rebuilt.

- **`ch02-inflammation`:** the hand-made phase-pip bar is removed and the figure now uses the stepper's `phases` option (The alarm · The four signs · The reinforcements). Its custom 14–20 s dwell is also removed, so it follows the new 5–9 s pacing.
- **`ch03-clonal-selection`:** the dots are grouped with `phases` (First exposure · Germ A again · A new germ) instead of hand-set margins and tooltips. The custom dwell is removed. On phones the data-source disclosure moves out of the stage to just under the caption, before the legend, so the stepper sits right under the chart. It stays fully visible. This deviates from FIGURE-AUDIT §7.4 ("on the stage") on phones only, at the supervisor's request. Desktop keeps it on the stage.
- **Vocabulary (FIGURES.md S8):**
  - ch02-nk-missing-self: "New target" → **Replay**, which re-runs the decision.
  - ch01-scale: "Take the tour / Stop the tour" → **Play all / Pause**.
  - The existing Replay labels (ch03-antibody) and Reset labels (ch01-binding, ch01-gene-to-protein, ch03-vdj) already match.
- **Phones:** no auxiliary note or panel now sits between a stepper and its stage. ch02-nk-missing-self and ch02-pattern-recognition aren't steppers; their notes stay with their controls.
