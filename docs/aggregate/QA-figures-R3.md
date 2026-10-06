# Figure QA: set R3 (chapters 7, 8, 9)

Reviewer brief: `docs/QA.md`. Set: ch07-evidence, ch07-immunoediting, ch07-cycle, ch07-tme, ch08-blockade, ch08-two-brakes, ch08-tail, ch08-side-effects, ch09-humanization, ch09-wiring, ch09-adc, ch09-bridge. (int-timeline was not in scope.)

**How each figure was walked**
- Every step, preset and toggle at 1440 and 390 wide, in light and dark page themes, plus reduced motion (`tools/shot.mjs`).
- Simulations and longer animations: frame sequences captured with a scratchpad Playwright script (`r3/seq.mjs`).
- Stepper consistency: `tools/stepper-check.mjs` says "All paths agree" on desktop **and** mobile for all five steppers (ch07-evidence, ch07-cycle, ch08-two-brakes, ch08-tail, ch09-adc).
- Page checks: `tools/check.mjs 07 08 09` reports 0 errors and 0 warnings. No console errors or warnings in any run.

**How performance was measured**
- A scratchpad probe (`r3/perf.mjs`) counts nodes under `[data-figure]` and samples rAF while the busiest animation plays.
- The heaviest figures were repeated under 4× and 6× CPU throttling.
- Node growth was tracked across repeated toggles to catch leaks.

**Summary.** 12 figures:
- 7 fixed in their modules.
- 5 shipped unchanged.
- 3 have follow-ups that need shared code (`synapse.js`, `cycle-wheel.js`, `exhaustion-marks.js`), but each figure is already correct or worked around locally.
- No caption needs changing. One spec/audit wording inconsistency is noted under ch09-adc.

| Figure | Status | fps (desktop) | Nodes |
|---|---|---|---|
| ch07-evidence | ✓ shipped | 60 | 321 |
| ch07-immunoediting | ✓ shipped (tuning verified) | 60 | 170 + canvas |
| ch07-cycle | fixed; shared follow-up (wheel labels, phones) | 60 | 815 |
| ch07-tme | fixed (defs leak) | 60 (59.6 at 4× throttle) | 3,413 (3,876 during the drug run) |
| ch08-blockade | fixed (vocabulary + science); shared follow-up (`synapse.js`) | 60 | 346–438 |
| ch08-two-brakes | fixed (label/overlap); minor shared follow-up | 60 (also at 6× throttle, phone) | 4,770 |
| ch08-tail | ✓ shipped (data exact) | 60 | 2,726 |
| ch08-side-effects | fixed (phone badge fit) | 60 | 383 |
| ch09-humanization | ✓ shipped | 60 | 422 |
| ch09-wiring | ✓ shipped | 60 | 270 |
| ch09-adc | ✓ shipped (bystander logic verified) | 60 | 2,253 |
| ch09-bridge | fixed (legend) | 60 | 1,818 + canvas |

**Cross-figure checks (the known items)**
- **PD-1/PD-L1 glyphs.** ch07-tme, ch08-blockade and ch08-two-brakes all use the library `pd1` (crimson socket, T cells only) and `pdl1` (light-crimson plug, cancer cells and TAMs). An engaged pair shows interlocked heads plus one crimson "−" disc on the T-cell side. ch08-blockade also drew a blue recognition ring on every brake pair; that is fixed (see below).
- **Drug-antibody capping.**
  - All three figures draw the drug as a gold, white-outlined therapeutic antibody that caps the target head with one arm tip, Fc pointing away, and binds only PD-1 or PD-L1, never a cancer cell itself.
  - ch07-tme and ch08-two-brakes use `cell-actions.dockAntibody`. ch08-blockade uses `synapse.cap`, whose free arm read as also gripping the partner; that is fixed locally.
- **Anti-PD-1 acts in the tumor AND refuels from the reserve.**
  - ch07-cycle rings steps 6 and 7 as the main sites and step 3 with the thin "also" ring. Its how-line names the stem-like reserve in lymph nodes and blood.
  - ch08-two-brakes step 4 brings three new clones in from the vessel, labeled "new clones arrive from nodes and blood", while the stem-like cell divides.
  - ch07-tme shows release in place only, which is what its spec and captions ask for.
- **Status strings.** Only ch07-cycle shows trial or approval status, and it reads every one from `cycle-data` `STATUS` via `statusOf()`. That covers the CAR-T string ("approved in China (June 2026) …"), the "Part III" tags and the "In trials; early attempts failed" line for TGF-β. No other module in this set hard-codes an approval or trial status.
- **ch08-tail data.** Matches the spec's data block exactly, as does the verbatim text:
  - every point and its source number, the 36.9-month and 71.9-month medians, and the 90-month values;
  - the footnote, the source line and the long-tail caption;
  - the series tokens and line styles;
  - the step states (cursor 3 / 10 / 10 / 3 / 5 years).

  The `#src-N` links resolve on the page.

---

## Chapter 7 (07-escape.html)

### ch07-evidence: ✓ shipped
- The data matches the draft's data block exactly (Engels 2011 Table 2 values and 95% CIs; Jin 2024 notes, which add the second source to their cards). The verbatim source line is in place, and the shapes plus chart tokens follow §4.20.
- All three steps were checked, plus sort by size/cause, cards on desktop and phone, and both themes.
- Remaining (cosmetic): the legend and sort control sit under the chart instead of top right. This is deliberate, so nothing above the chart moves at step 3.

### ch07-immunoediting: ✓ shipped
I walked the guided run (elimination → equilibrium → escape), the transplant test, reduced-motion snapshots and phone. I then checked the model headlessly against the spec's tuning targets, in the page context via the exported `createSim`:

| Target | Result |
|---|---|
| Off: reaches the cap in ~20 s | 18–20 s |
| On: fall, then plateau, then escape | 3 of 5 seeds did this (min N 4–35; final mean v 0.06); 2 were eliminated |
| Strong: eliminated in roughly 6 of 10 | 6 of 10 |
| Transplanted unedited tumor rejected in roughly 4–6 of 10 | 5 of 10 |
| Transplanted edited tumor grows | 10 of 10 |

The escape band is drawn retroactively from the last quiet point, so for a few seconds the "Equilibrium" band covers visible regrowth before it switches. That is acceptable.

### ch07-cycle: fixed; shared follow-up
- **Fixed:**
  - On phones the final "Your turn" card said "Choose a step on the wheel **or in this list**", but the module's CSS hides that list below 600 px.
  - The text now drops the list clause when the stage is compact and re-renders when that changes.
- **Verified:**
  - Tour steps 1–9, break and restore (the stall is shown with ⊣ and faded nodes).
  - All seven previews: anti-PD-1 rings plus the also-ring; CAR-T with "not needed", "joins here" and "no MHC needed"; statuses from STATUS.
  - Phone and dark theme.
- **Needs a shared change (low):** on phones (oval layout), node labels collide with the gold preview rings. "7 Killing", "6 Recognition", "3 Priming" and "4 Trafficking" sit under or against a selected node's `nodeR + 8` ring. The exact change is in the shared requests below.

### ch07-tme: fixed
- **Fixed (robustness):** every Reset or rebuild left its two scene gradients (the TGF-β haze and poisoned air) in `<defs>`, so each drug run plus reset added 10 nodes.
  - The scene now tracks its own gradients and removes unreferenced ones on the next build.
  - The kept crossfade scene keeps its own gradients.
  - Measured afterwards: stable across repeated drug runs, resets and profile switches.
- **Verified:**
  - The three profiles: inflamed with PD-L1 clustered at T-cell contacts; excluded with a thick fibroblast ring and few PD-L1 inside; desert with near-zero PD-L1 and fewer MHC cups.
  - Drug runs give captions 4, 5 and 6 and the badges ≈ / ✕ / ✕. About 6 cancer cells die in inflamed (kill grammar, nothing flashes).
  - The "Who lives here?" chips, including the Hiding up-close lens with cups ≥ 14 px and the hidden cell with no cups; the Brakes leaders.
  - Phone, reduced motion and both themes.
- **Remaining (low):** 3,413 SVG nodes (125 MHC/PD-L1 glyphs at about 6 nodes each, plus a 4-layer fibroblast wall). It runs at 60 fps on desktop and 59.6 under 4× CPU throttle, so it was left as is. At this crowd scale (~8 px), PD-L1 plugs and MHC cups are hard to tell apart; the Brakes chip and its labels carry the distinction.

## Chapter 8 (08-checkpoints.html)

### ch08-blockade: fixed (science + vocabulary); shared follow-up
- **Fixed: a blue recognition ring on every PD-1–PD-L1 pair** (§4.5, §4.7).
  - The shared synapse scene draws its junction ring (T-cell blue, white core) for every pair kind except LFA-1, so each engaged brake pair carried a "recognition" ring.
  - The module now hides that ring on `pd1-pdl1` pairs, so an engaged pair reads exactly as rule 7 says. The TCR–MHC ring stays.
- **Fixed: the antibody appeared to grip both partners.**
  - `synapse.cap()` lays the antibody's main axis parallel to the membranes, so the free arm pointed straight at the pushed-aside partner. Anti-PD-1 looked as if it also held PD-L1, and anti-PD-L1 as if it also held PD-1.
  - The module now rotates each docked antibody 15° about its capping tip (`tiltFreeArm`), so the tip stays on its target head and the free arm clears the partner.
  - Checked on all drug switches, in transitions, on phone and with reduced motion.
- **Verified:**
  - All 3 drugs × display on/off, with verbatim captions.
  - The gauge reaches "killing" only with the drug and with the neoantigen displayed. Blebs appear only then.
  - With display off, cups are absent (none drawn empty).
- **Needs a shared change:** see `synapse.js` below. Other synapse users (ch08-hero, ch04-three-signals, ch05-kill lens, ch10-build-a-car) may show the same ring on brake pairs.

### ch08-two-brakes: fixed; perf noted; minor shared follow-up
- **Fixed: the label read as attached to the wrong cell.**
  - In step 4 (and in the step-5 replay), the new clone that kills cancer cell 3 docks at about (257, 234) in panel units. That put it directly over the "terminal (TCF1 lost)" label at (218, 258), so the fresh killer read as "terminal".
  - The label now sits as two lines in the clear strip between the two terminal cells and the vessel, at (412, 246), anchored at the end. Its leader now leaves below the second line (the label helper handles multi-line text).
  - On phones the padlock icon overlapped "terminal" because its spacing was estimated from desktop glyph widths. It is now placed from the measured text width, after the text scale is applied and again on resize.
- **Fixed: overlapping cells.** The second arrival docked on cancer cell 4 at −10°, on top of the stem-like cell's dimmed offspring. It now docks at −40°.
- **Verified:**
  - Steps 1–5 on desktop and phone (one panel at a time plus tabs on phones).
  - Step 5 with every toggle combination. The meter tiers match the spec: none = low/low, CTLA-4 = moderate/raised, PD-1 = strong/modest, both = strongest/highest.
  - Anti-CTLA-4 caps CTLA-4 on the Treg, which is not destroyed. Anti-PD-1 caps PD-1 on T cells only.
  - Exhausted cells brighten only slightly. Kills follow the shared kill grammar.
- **Performance (known item):**
  - 4,770 SVG nodes: the guided panels and the step-5 "combo" panels are both prebuilt (about 48 T-cell drawings, 354 tcrKey glyphs).
  - Animation runs at 60 fps on desktop, and at 60 fps on a phone viewport under 6× CPU throttle in step 4.
  - The real cost is the rebuild when a step-5 toggle is flipped: about 57 ms on desktop, estimated 200–300 ms on mid-range phones.
  - Not changed in this pass. If it matters, build the combo copy lazily, or hide the invisible copy with `visibility: hidden` to save paint.
- **Remaining (low):** the dimmed offspring of the stem-like cell keeps its library PD-1 receptors uncapped in step 4.

### ch08-tail: ✓ shipped
- **Verified:**
  - Data, footnote, source line and long-tail caption match the spec exactly. Both the footnote and the source line stay visible on phones (§7.10).
  - Readout statuses (published / approximate / no data), the 100-people grid, "Show the long tail", both themes, and stepper-check on desktop and mobile.
- **Remaining, for the editor (low):** the nivolumab curve has a visible kink at year 3. The spec's points 36 mo = 52% [15] and 36.9 mo = 50% (median) [7] come from different data cuts, which forces a steep drop over 0.9 months. The smoothing footnote covers it honestly.
  - Option: keep the 36.9-month median as a tooltip only and leave it off the drawn curve. That would be a spec change; I did not make it.

### ch08-side-effects: fixed
- **Fixed:** on phones the right-column "often permanent" badge (Adrenals) ran to the stage's right edge (its width estimate assumed 0.56 em per character). It is now measured, and pulled left if it would overflow; the badge now ends 15 px inside the stage.
- **Verified:**
  - All 13 bands × 3 drugs match the spec table. The header lines and footnote are verbatim.
  - The "why" toggle draws a "−" disc on every hotspot and shows the verbatim caption.
  - The phone "Head & neck" chooser, list view, keyboard order and both themes.

## Chapter 9 (09-antibodies.html)

### ch09-humanization: ✓ shipped
- **Verified:**
  - Four stops (a 12-domain library antibody, `origin: 'mouse'` parts): grip "Full" throughout; reaction High · Lower · Low · Low.
  - Anti-drug antibodies are natural antibodies (no white outline) and dock mostly on mouse parts.
  - Name chips are bold and underlined; first-approval years 1986 / 1994 / 1997 / 2002; the magnifier shows the same grip at every stop.
  - Phone and reduced motion.

### ch09-wiring: ✓ shipped
- **Verified:** all four states with verbatim captions; the "stuck on" toggle glyph (not a padlock); the KRAS ring in state d; progressive disclosure of the KRAS control; the footnote; phone and reduced motion.

### ch09-adc: ✓ shipped (bystander logic verified honest)
- **Steps 1–4:** the ADC caps a HER2 diamond with an arm tip. Hexagon payloads hang on the stem and constant parts, never the tips.
- **Step 5, T-DXd:**
  - Rich and poor cells take up ADCs. Hexagons cross only into touching neighbors (R3/P1 → Z1).
  - All HER2-expressing cells die, and so does Z1 (HER2-0, touching them).
  - Z2 (HER2-0, two cells from any HER2-expressing cell) survives, labeled "out of reach". Payload never reaches distant cells. No counts are shown.
- **Step 5, T-DM1:** the inset shows the antibody being digested and payloads freed with charged "+" scraps; payload stays inside. Only rich cells die; poor and "0" cells survive.
- **Spec/audit note (wording, not code):**
  - The spec says the edge "0" cell touches "only the other '0' cell, so no dying cell touches it". FIGURE-AUDIT §7.5 says the survivor "touches no dying cell".
  - Both are false in the specified arrangement: Z1 dies and touches Z2.
  - The figure follows the spec's geometry, and the caption ("a cell out of reach survives") is right.
  - Suggested audit/spec wording: "a HER2-0 cell two cells away from any HER2-expressing cell survives".

### ch09-bridge: fixed
- **Fixed:** the legend swatch for "The one T cell whose receptor matches" was a near-white ring (#E9F0FF) on the page background. It was invisible in the light theme (legends sit on paper, not on the dark stage). It now uses `var(--ink-2)`.
- **Verified:**
  - All 3 engagers × class I on/off × HLA swap. Verbatim captions; the counter is tagged Illustrative; the footnote with the real precursor frequency.
  - The engager glyphs are distinct from the TCR. TCR-based engagers dock only on pink cups in A*02:01.
  - Phone and reduced motion (a still with the counter).

---

## Shared-code changes requested (not made; owners: P4 / P5 / F13)

1. **`assets/js/figures/shared/synapse.js` line 247: junction ring on brake pairs.**
   - The current code is `if (s.kind !== 'lfa1-icam1') { … P.J … }`. It draws a T-cell-blue recognition ring with a white core on **every** engaged pair, including `pd1-pdl1` and `ctla4-b7`, which contradicts §4.5 and §4.7.
   - Change it to `if (s.kind === 'tcr-mhc' || s.kind === 'car-antigen') {`, so only recognition gets the ring.
   - ch08-blockade currently hides `P.J.g` on brake pairs locally. Once this lands, drop the loop in its `makeScene()`.
2. **`synapse.js` `cap()`, lines 355–363: free arm points at the partner.**
   - The main axis is laid parallel to the membranes and the partner is pushed only 26° (line 270, `push = -P.plan.capDir * 26`), so the uncapped arm's tip lands next to the pushed-aside partner. It looks as if one antibody grips both.
   - Fix: rotate the docked pose by about 15° about the capping tip, away from the partner. The sign is `(side === 'top' ? 1 : -1) * (dir > 0 ? -1 : 1)` applied in the antibody's local frame, i.e. `end.r` plus the rotation about `tip`.
   - ch08-blockade does exactly this locally (`tiltFreeArm`). Remove it once `cap()` handles it.
3. **`assets/js/figures/shared/cycle-wheel.js` `labelPos()`, oval (phone) layout.**
   - Line 467: `(nodeR + 8)` → `(nodeR + 15)`, so side labels clear the gold ring (radius `nodeR + 8`) and its glow.
   - Line 472: `y: q.y + nodeR + 19` → `y: q.y + nodeR + 25`, for bottom labels such as "4 Trafficking".
   - Recheck the center text ("Cycle running" / "Stalled at …") in the oval layout afterwards. It sits just below the bottom labels.
   - This affects ch07-cycle, and also ch12-resistance and ch12-combinations on phones.
4. **`assets/js/figures/shared/exhaustion-marks.js` line 49 `markLayout()` (minor).**
   - On phones the enlarged pills touch, reading "TCF1TOX" (ch08-two-brakes; check ch05-exhaustion).
   - Widen the spacing: `tox: [19, R + 9], tcf1: [-28, R + 9.5]`. Or size the pills from measured text.

## Caption / spec changes
None required. For the editor's information, two notes above: the ch08-tail nivolumab data-cut kink, and the ch09-adc "touches no dying cell" wording in the spec and FIGURE-AUDIT §7.5.

---

## Polish round (POLISH.md → Figures → R3; visitor review B3–B6)

**B3: ch07-cycle steps by name. Done.**
- The caption label now reads Overview · 1 · Release … 7 · Killing · Your turn, so "STEP 4 OF 9" no longer appears above "Step 3, Priming".
- Dot tooltips and aria-labels use the same names.
- The phone counter shows the name ("3 · Priming") instead of "4 / 9".
- The screen-reader announcement uses the step's caption text, not "Step 4 of 9".
- All of this is done in the module, over the stepper's DOM. The `cycle-wheel.js` change was not needed.
- stepper-check passes on desktop and phone.

**B4: ch07-immunoediting payoff ≤ 25 s. Done.**
- The default speed is now 2×. The guided seed changed from 14 (wide) / 1 (compact) to 85 on both layouts, chosen by a 120-seed scan for a clean elimination → equilibrium → escape sequence.
- Measured from Play: Equilibrium caption at 9.3 s, Escape at 22.2–22.6 s (desktop and phone). Before, they came at about 30 s and about 60 s.
- Phase chips (Elimination · Equilibrium · Escape) now sit next to Play/Pause on every screen. They follow the run, and tapping one fast-forwards a fresh guided run to that phase and keeps playing. Under reduced motion they still show snapshots.
- Speed (1× / 2× / 4×) has moved out of "More", which now holds New random tumor, Replay this run and Strong pressure.
- The tuning targets are unchanged: the model was not touched.

**B5: ch07-tme, the drug's effect is visible. Done.**
- A "Cancer cells destroyed x / 28" counter sits beside the outcome badge and counts up as cells die. Results: Inflamed 8/28 (phone 10/28), Excluded 1/28, Desert 0/28. It resets on Reset or a profile change.
- Killed cells now shrink, bleb and fade **fully** (opacity 0 instead of 0.12), leaving visible holes in the nest.
- Each engaged T cell's crimson "−" brake disc pops off as the antibody caps PD-1: it swells, then flies outward and fades.
- Still 60 fps. Re-measured and page 07 rebuilt.

**B6: shared `activity-meter.js`, one fill grammar. Done; the API is unchanged and the change is additive.**
- Filled = tone color:
  - benefit / activity / attack = killer-blue `--c-cd8`;
  - risk / damage / side effects = brake-crimson `--c-inhibit`;
  - tumor burden = cancer-violet.
- Empty = a hairline track (outlined, nearly transparent fill), the same on dark and light stages and in both page themes.
- Gauge: tone-colored arc over a hairline band.
- Ledger: rows keep their + / − sign colors; the net bar takes the tone, or crimson when the net is below zero.
- New optional `tone` / `color` options. By default the tone is read from the title, or, for an untitled HTML meter, from the heading just before it. Documented in `docs/shared/activity-meter.md`.
- Re-checked on desktop and phone:

| Figure | Meter(s) | Result |
|---|---|---|
| ch05-brakes | ledger | blue net bar; stepper-check OK |
| ch08-blockade | gauge / phone segments | blue |
| ch08-two-brakes | Attack / Risk | blue / crimson in both page themes; this fixes the "all-charcoal reads as off" problem; stepper-check OK |
| ch10-build-a-car | both meters plus ghosts | blue |
| ch10-logic-gates | Tumor cells remaining / Healthy tissue damage | violet / crimson |
| ch12-resistance | vignette 6 | blue |
| ch12-combinations | Tumor control / Side effects | blue / crimson, via the heading heuristic |
| ch11-four-fixes | — | does not use the shared meter; its own unit dots are already killer-blue, so nothing to change |

  `check.mjs` on 05, 07, 08, 10, 12 and `_kit-demo` shows 0 errors and 0 warnings.
- **Request for R5 (low):** in `ch12-combinations.js` `mkMeter()`, pass `tone: 'risk'` for "Side effects" and `tone: 'benefit'` for "Tumor control". It works now through the heading heuristic, but explicit is safer.
- **Pending:** re-check once the foundation's Play-all pacing and caption-placement changes land.

**Follow-up: ch08-two-brakes now uses ch05-exhaustion's decluttered marks.**
- In the tumor panel, the TOX and TCF1 text pills and the three "−" discs per cell are gone. Each cell now carries:
  - a dashed silver ring = TOX on (exhausted family), shown on the terminal cells and the stem-like cell's offspring;
  - a mint ring = stem-like reserve (TCF1, also TOX on);
  - a padlock = terminal (TCF1 lost);
  - one crimson "−" brake disc, struck through when anti-PD-1 caps PD-1.

  New clones arriving from the blood carry no ring.
- One legend sits under the stage, with the same entries and swatches as ch05-exhaustion. It appears from step 3, when the tumor panel becomes active.
- Checks:
  - stepper-check passes on desktop and phone;
  - re-measured and page 08 rebuilt;
  - `check.mjs` on 08: clean;
  - screenshots in both themes at 1440 and 390.
- Shared request #4 above (TOX/TCF1 pill spacing) is now moot. I removed the module's use of `toxTag` and `tcf1Badge`; ch05-exhaustion no longer uses them either.

**Final re-check after the foundation changes (S1 pacing, S2 caption placement, S8 vocabulary).**
- **ch08-tail on phones.**
  - The stage now holds only the chart and its honesty notes: the smoothing footnote, the sources line and the step-4 long-tail note, all still visible.
  - The time slider, "Show the long tail", the 100-people grid and the readout moved after the caption.
  - The stepper now sits right under the chart: the stage went from about 1,350 to 445 px tall at 390 px wide.
  - Desktop is unchanged.
- **ch07-evidence on phones.**
  - The long source paragraph and the step-3 legend/sort block moved after the caption. Both are still visible (rule 19).
  - Desktop is unchanged.
- **Vocabulary (S8).**
  - ch09-bridge "Restart" → **Replay** (replay icon).
  - ch07-immunoediting "Replay this run" → **Replay**.
  - ch07-tme keeps **Reset** (back to before the drug).
  - "Try again" (ch07-immunoediting transplant) is verbatim from the spec, and it draws a new sample, so it is not a replay. Kept.
- **All 12 figures:**
  - Screenshotted at 1440 and 390 wide, in light and dark (48 runs), all `ok`.
  - stepper-check passes on desktop and phone for ch07-evidence, ch07-cycle, ch08-two-brakes, ch08-tail and ch09-adc.
  - Re-measured and rebuilt pages 07 and 08. `check.mjs` on 07, 08 and 09: 0 errors, 0 warnings.
