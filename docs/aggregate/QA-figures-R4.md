# QA pass R4: cell therapy, vaccines, history timeline

**Set:** ch10-build-a-car, ch10-journey, ch10-crs, ch10-logic-gates (10-cell-therapy.html) · ch11-hpv, ch11-four-fixes, ch11-oncolytic, ch11-personal-vaccine (11-vaccines.html; added mid-pass) · int-timeline (interlude-history.html).

**Method:** I walked each figure through every step, preset, toggle and end state at 1440 and 390 px, in the light and dark page themes, and with reduced motion (shot.mjs plus a scripted Playwright probe). I also ran `stepper-check` on desktop and mobile, measured fps with rAF sampling and counted figure nodes, and checked keyboard paths and focus.

**After the fixes:** `measure-figures` and `build-content --only 10,11` were rerun, and `check.mjs` on 10, 11 and the interlude reports **0 errors and 0 warnings**. No figure logs a console error or warning.

| Figure | Status | fps (desktop) | Nodes |
|---|---|---|---|
| ch10-build-a-car | fixed | 60 | 418 idle → 918 after runs |
| ch10-journey | fixed | 60 | 6,353 → **4,709** (phone 4,099) |
| ch10-crs | fixed | 60 | 236 → 396 (canvas crowd) |
| ch10-logic-gates | ✓ shipped | 60 | ~260 (canvas crowd) |
| ch11-hpv | fixed | static | 935 → **737** |
| ch11-four-fixes | ✓ shipped | 60 | 1,516 idle → 2,955 (preset B) |
| ch11-oncolytic | fixed | 60–61 | ~250 (canvas) |
| ch11-personal-vaccine | fixed | 60 | 1,827 → 3,297 at step 4 |
| int-timeline | ✓ shipped | static | 431 (phone list 593) |

---

## ch10-build-a-car: fixed
- **Science checked:**
  - Tail options: CD3ζ only, CD28 + CD3ζ, and 4-1BB + CD3ζ. CD28 is a green-cyan rounded "+" square and 4-1BB a "+" hexagon (§4 rule 9).
  - The CAR binds circle antigens on stalks, with no MHC.
  - Signal 1 alone: the cell kills once, then dims. Signal 1 + 2: it kills, divides and keeps hunting.
  - Meters are words and segments, with no numbers.
- **Fixed:** on phones the meters sit below the stage, out of reach of its "Illustrative" tag. The first meter now carries its own tag (rule 19). The meters also had no gap under the run button; the margin is now 0.75rem.
- **Remaining (low):**
  - One run lasts about 13–14 s: four beats, plus the shared kill grammar.
  - The "anchor" label sits on the bilayer. It stays legible thanks to its halo.
  - The history line says "first option" where the spec says "top option". That is right for a horizontal control.

## ch10-journey: fixed
- **Timing checked against the captions:**
  - Step 5 (days −6 to −3): the plane lands and the vial goes into the hospital freezer (timeline 0.3–2.0 s). Only then do the fludarabine and cyclophosphamide bags appear (from 2.0 s), and the white cells thin out. The rail shows the flight leg at days −6 to −5.5 and the hospital bar at −5.5 to −3.
  - Step 6: a rest on days −2 to −1, with the vial waiting frozen; the clock ends at "Day −1".
  - Step 7: thaw and infusion on Day 0.
  - The clock never runs backwards.
  - Step 8: a log chart with a fever band over the first week and a CAR-T peak of about ×300 around day 10.
  - Step 9: the axis compresses, with "Time compressed", and B cells return by about year 1.
- **Fixed:**
  1. The rail's tick marks cut through the day labels ("−2|1", "1|4"), most visibly on phones. The labels moved down (tickY 122→126 on desktop, 124→131 on phones).
  2. Step 9 on phones: the "Year 1" and "Year 3" axis labels collided. "Year 1" now keeps only its tick.
  3. At the end of step 8, the chart playhead sat on day 14 and cut through the "Cancer cells" label. It is now hidden while the counter rests at day 14.
  4. Node count: the 36-cell culture crowd in step 4 rebuilt a full art-library CAR-T cell for each cell. Each of its 6 seeds is now drawn once in `<defs>` and placed with `<use>`. That saves about 1,650 nodes on desktop; the visuals are unchanged.
- **Checks:** stepper-check passes ("All paths agree") on desktop and mobile after the fixes. With "What can go wrong" on, the amber notes appear on steps 4 and 5; toggling rebuilds with no leaked clipPaths.
- **Remaining:**
  - (med-low) About 4.7k nodes: all nine vignettes are built at reset and only one is visible at a time. Building them lazily, or reusing more art through `<use>`, would get it under 3k. It holds 60 fps.
  - (low) Step 8 runs 8.0 s.

## ch10-crs: fixed
- **Science checked:**
  - Tocilizumab is drawn as gold drug antibodies capping the **IL-6 receptors** on the strip of body cells. The control reads "Block the IL-6 receptor (tocilizumab)", and the announcement says "the drug covers the IL-6 receptors".
  - The macrophages keep making IL-6; the IL-6 curve is unchanged and only the temperature falls, within about 7 simulated hours.
  - The CAR-T curve keeps rising and the killing continues.
  - IL-6 starts rising about a day after the CAR-T curve and peaks 0.6 days before the CAR-T peak, never after it.
  - High tumor burden gives a much higher IL-6 peak.
  - The steroid footer is verbatim.
  - Reduced motion shows a meaningful still at day 9.
- **Fixed:**
  1. Phones: the "tocilizumab" marker label collided with the "IL-6 and temperature" title. The title moved up (titleB 516→503) and the label tucked in.
  2. Phones: the "Bone marrow" label sat on the receptor strip's drug antibodies. It is lifted on phones.
  3. The scene clipPath id came from `Math.random()`, and a new one was added on every re-layout. It is now a stable `${ctx.id}-scene-clip` that replaces the old one.

## ch10-logic-gates: ✓ shipped
- **Checked:**
  - "Attack A" kills every tumor cell and most healthy lung cells; a minority of the lowest-antigen healthy cells survive. The on-stage note "Illustrative: how much healthy tissue is hit…" appears (§7.6).
  - "A AND B" shows the arming glyph, a pause of about 1.1 s, and no healthy damage.
  - The antigen-loss slider unlocks only after each rule has run for 10 s or more. At 40% loss, the tumor regrows to its starting level under AND.
  - The meters are tagged "Illustrative, not measured", and the footer chip is verbatim.
  - The footer, "Every approved product today uses a single target", stays consistent with satri-cel, a single-target claudin-18.2 CAR-T.
- **Remaining (low):**
  - Each run lasts 46 s.
  - Phones: there is an empty band of about 60 px between the field and the chart, and a few edge cells are clipped.

## ch11-hpv: fixed
- **Known bug (fixed):** the 100-unit grid was built in an SVG inside a detached `<div>`. Because of that, `chart.js` `hatchFill()` → `defId()` could not find the existing pattern through `document.getElementById`, and created **100 `<pattern>`s that all shared the id `ck-svg1-hatch-…`**, one per unit. The grid SVG is now created in the live side panel, with `dataset.ckKey = ctx.uid('units')`. Result: 1 pattern (`ck-ch11-hpv-units-1-hatch-…`), no duplicate ids on the page, and 198 fewer nodes.
- **Also fixed:** tabbing onto a bar (the roving tab stop lands on the selected one) now shows its tooltip. The spec says focusing a bar selects it and shows the tooltip; before, only the arrow keys did.
- **Checked:**
  - Data and CIs for England 87/62/34, Sweden 88/53 and Scotland 8.4/3.2/0, all as in the spec. The tooltips carry the CIN3 line and the short source. The grid reads 13/38/66, and announcements are verbatim.
  - Each country has its own axis, the source line is always visible, and both page themes work.

## ch11-four-fixes: ✓ shipped
- **Checked:**
  - The tier is min(P, K) across the presets and individual switches: B gives ✓; turning the brakes back on gives ≈; a shared target gives ≈; a large tumor gives ✕.
  - The dot counts are 1/3/3/8.
  - Preset B's caption ends with `STATUS['mrna-vaccine'].text` verbatim.
  - Anti-PD-1 is drawn on the T cells. In the microscopic tier-2 case, one tumor cell survives.
  - The disclaimer is verbatim, and reduced motion is fine.
- **Remaining (low, cosmetic):** the reserved micro-caption block leaves an empty band of about 90 px between the stage and the switches while a preset caption shows below.

## ch11-oncolytic: fixed
- **Fixed:** the "Cancer cells" leader label sat on top of a healthy (sand) cell beside the mass, so it read as labeling that cell. It moved into empty space at (478, 318), with its leader into the mass.
- **Checked:**
  - Broken alarm: the end state is 5/25 injected and 9/12 distant. Working alarm: 22/25 and 12/12, with the alternative caption verbatim.
  - The distant tumor never contains virus, and neither tumor is cleared completely.
  - Interferons are drawn as hollow sand rings, and dendritic cells mature on contact.
  - The counter carries an "Illustrative" tag, and the T-VEC note is verbatim.
  - Phones and reduced motion (a Back/Next caption track) are fine.
- **Remaining (low):** the reduced-motion step track is local rather than `ctx.ui.stepper`, as the spec asked, so `stepper-check` reports "no stepper" and cannot verify it.

## ch11-personal-vaccine: fixed (added mid-pass)
- **Checked against the spec and the supervisor's points:**
  - The 8-mutation table is verbatim: peptides, mutant positions, stands-out flags, and fit and response for both patients.
  - Each patient has exactly 3 responders out of 8 and one responding trunk mutation.
  - Cards re-rank by the selected patient's fit.
  - Coverage logic:
    - Patient 2 with picks 5 + 8: "Every cancer cell…"
    - Patient 1 with picks 4 + 7: "Branch C carried none…", and C regrows.
    - With no picks, the four best-predicted fits are tested, and the figure says so.
  - "Kinder than reality" (1 in 3 here, beside 1 in 9 in the pancreatic study, 20 or 34 targets) is verbatim.
  - Step 4: T cells, not the vaccine, do the killing, and some recognized cells survive.
  - The "Where things stand" line is `STATUS['mrna-vaccine'].text` verbatim (company-reported, not yet approved).
  - The tree matches ch06's: a sand-to-violet trunk, and hue-shifted B (stripes) and C (dots) branches with letters.
  - The max-4 notice works, and Enter/Space toggle the cards with a visible focus ring.
  - stepper-check passes on desktop and mobile.
- **Fixed:**
  1. **The two patients' HLA cups looked identical.** At 38 units, the art library's pocket marks are about 3 px, so the "different HLA" hook was invisible. I added enlarged pocket-shape glyphs (○ □ △ ⬭, matching each cup's `pockets`) under every cup. On phones the two patient panels now stack, so the cups render about 1.3× larger. The difference is clearly readable on both.
  2. Phones: the sticky vaccine bar was 92% opaque, so the patient panels and caption showed through as it scrolled over them. It is now opaque while sticky.
  3. Phones, steps 3–4: the "wrapped in fat" label ran under the Try again and Reset buttons. When not sticky, the strand now sits on its own row with the buttons below it.
  4. The "mRNA vaccine" caps label grew from 11 to 12 px.
- **Remaining (low):** about 3.3k nodes at step 4, the cell crowd plus T cells. It holds 60 fps.

## int-timeline: ✓ shipped
- **Data:** the module's `DATA` is **deep-equal to the spec JSON**, checked programmatically: 28 milestones, plus the lanes, types and note.
- **STATUS:** the interpath card's tag and "What happened" come from `STATUS['mrna-vaccine']` (`.tag`, `.text`).
- **Interaction:**
  - ←/→ move chronologically, ↑/↓ move to the nearest milestone in the adjacent lane, and Esc closes the card.
  - Filters fade the other lanes to about 15%, and forced labels get leaders.
  - On phones, the list shows gap dividers ("… 66 years …" and "… 17 years …") and inline cards, with no horizontal overflow.
  - Both themes work.
- **Note (info):**
  - Afami-cel's "2 Aug 2024" matches the FDA OCE announcement, but the FDA approval letter is dated 1 Aug 2024. Either is defensible.
  - The spec mentions `STATUS['mrna-vaccine'].card`, which does not exist. The module falls back to `.text` (see request 1).

---

## Requests (shared code / spec), none blocking
1. **Spec or `cycle-data.js`:** the interlude spec (`content/drafts/interlude-history.md`, int-timeline spec, CARD bullet) refers to `STATUS['mrna-vaccine'].card`. Either add a `card` field to STATUS, or change the spec text to `.text`, which is what the module uses.
2. **`shared/chart.js` `hatchFill()` (around l. 517):** checking for an existing pattern with `document.getElementById(id)` fails for SVGs that are not attached yet, so a pattern gets created on every call. Suggested change: check `defsOf(root).querySelector('#' + CSS.escape(id))` first. Optionally, `shared/unit-grid.js` could create the per-unit hatch layer lazily, only when a `hatch` state is used: it currently adds 100 hatch paths to every grid.
3. **Optional, art (`mhc1` with `pockets`):** the pocket marks cannot be read below about 60 px of cup size. A `pocketScale` option would let small shop windows show HLA differences without local glyphs.

---

## Polish round (POLISH.md → R4: B7, B8, B9)

### B7 ch10-crs: pre-armed treatment, done
- **Pre-armed control.** The treatment control is now a plan for the run, always enabled: "Do nothing" | "Block the IL-6 receptor at fever (tocilizumab)" (on phones, "Block IL-6 receptor at fever"; the aria-label is full). With the block chosen, the drug is given automatically at the 38 °C crossing, and the temperature band barely clears 38° before it drops.
- **Choosing during a run.**
  - Before the crossing: the drug waits for it.
  - Between the crossing and the fever's peak (model peak at tPeak − 0.6 d): given immediately.
  - **After the peak, or once the run is over: the run auto-replays from day 0 with the drug.**
  - Choosing "Do nothing" after the drug was given replays without it.
  - Each case is announced.
- **Persistence.** The plan survives Replay and a change of tumor burden.
- **Science unchanged.** The drug caps the IL-6 receptors, the macrophages keep making IL-6, and the CAR-T cells keep expanding.
- **Verified:** desktop, phone, dark theme and reduced motion. The reduced-motion still shows the drug at the crossing.

### B8 ch10-build-a-car: payoff in about 5 s, done
- **Retimed run.** The killer docks and turns its granules toward the contact while the signals light up. The kill starts at 2.6 s, and both meters are full by about 5 s (they used to start at about 9 s and finish at about 15 s). The whole run lasts about 6.5 s.
- **Meter timing.** "Kills on first contact" starts filling at contact (1.5 s), and the weeks-later meter fills right after the kill.
- **Time jump labeled.** A clock icon and "Weeks later" appear under the meters as the second one fills (SVG on desktop, HTML on phones).
- **Ghost bars.** When the tail is switched, the last finished run with a different tail stays as faint bars under the live meters (a second meter instance at 40% opacity, same geometry, text hidden). It carries the note "Faint bars: last run, CD28 + CD3ζ". Example: after a CD28 run, a CD3ζ-only run shows a full faint weeks-later bar against a near-empty live one.
- **Re-check after the shared restyle (B6 in POLISH.md).** The ghosts rely on the meter's empty tracks being translucent (today 10% fill; B6's "hairline tracks" keeps this). If B6 makes the tracks opaque, the ghost meter should move above the live one.

### B9 int-timeline: "Zoom to 1975–2026" plus labels in the dense zone, done
- **Toggle.** A segmented control beside the marker legend, "1890–2026" | "Zoom to 1975–2026", desktop only (the phone list is unchanged). The default stays the full linear span, which is the spec's point.
- **Zoomed axis.** Ticks every 5 years with labels every 10. Era bands are clipped to the shown span (the sliver of "Hunches" is dropped). A note reads "← 3 earlier milestones, 1891–1974". Markers before 1975 leave the tab order, the arrow-key paths and the card's Earlier/Later.
- **Labels.** In the zoomed view every marker tries for a label: beside the marker, then just above or below it within its own lane, nudged sideways with a short leader if needed. 20 of the 25 markers are labeled at 1440 px, up from 13. The rest show on hover or focus, or when their lane chip is chosen, which forces labels with leaders.
- Choosing a lane chip in the full view still forces that lane's labels, as before.

**After the polish:** `measure-figures` and `build-content` reran for chapter 10 and the interlude. `check.mjs` on chapters 10 and 11 and the interlude reports 0 errors and 0 warnings, and nothing logs to the console. Pending: re-check the meters in ch10-build-a-car and ch10-logic-gates once B6 lands, and every figure here once the foundation's pacing and caption-placement changes land (S1, S2).

### Re-check after the shared meter restyle (B6)
- **ch10-build-a-car:** the meters now pass `tone: 'benefit'` (killer-blue). The ghost bars still work: the new empty tracks are hairlines with a 4% fill, so the faint previous-tail bars show through. Checked on desktop (dark stage) and phone (light HTML).
- **ch10-logic-gates:** I removed the old `--fg` wrapper overrides, which also recolored the meter titles and tracks. The meters now pass `tone: 'cancer'` (tumor cells remaining, violet) and `tone: 'risk'` (healthy tissue damage, crimson). Checked on desktop and phone.
- `check.mjs` on chapter 10 is clean.

### Final re-check after the foundation changes (S1 pacing, S2 caption placement, phases)
- **All 9 figures:** shot again at desktop and phone, light and dark. Nothing logs to the console and nothing overflows.
  - `check.mjs` (chapters 10, 11 and the interlude) reports 0 errors and 0 warnings.
  - `stepper-check` passes on desktop and mobile for ch10-journey, and on desktop for ch11-personal-vaccine; the phone result for the vaccine figure is a tool artifact (see below).
  - Under S2 the step captions sit directly under the stepper bars, and the figure controls follow.
- **ch11-personal-vaccine on phones:**
  - **Layout:** the chooser (patients, candidate cards, the sticky vaccine bar) moves out of the stage into a dark panel after the stepper and its caption. That panel carries the stage's color tokens. Stage, stepper and caption now sit together. The step 1–2 hints say "(below)" and "below" on phones.
  - **Desktop:** unchanged.
  - **Vocabulary (S8):** "Try again" became **"Choose again"**, a verb for going back to step 2 with the same patient, rather than Replay. **Reset** now has the reset icon.
  - Note for the copy editor: the draft spec still says "Try again".
- **Stepper-check on phones is a tool artifact.** The stock tool centers the whole figure. This figure is now about 2.5 viewports tall on phones, so the stage sits above the viewport during the check and the stage-based `onceVisible(0.35)` intro never fires. With the stage centered (a scratch copy of the tool), **all paths agree** on mobile; desktop passes with the stock tool. Readers scroll the stage into view first, so it plays normally for them.
  - Request (tools): `stepper-check` could center `.fig__stage` rather than the figure.
- **ch10-journey:** now uses `phases`: Collect · Manufacture · Prepare · Infuse · Inside the body. Phones read "Manufacture · 3 / 9", and stepper-check passes on desktop and mobile.
- **Vocabulary checked:**
  - Replay restarts the current run in ch10-crs, ch10-logic-gates and ch11-oncolytic.
  - The sandbox verbs ("Meet a target cell", "Inject virus") are fine.
- **Refreshed:** `measure-figures` and the 10/11 rebuild were rerun.
