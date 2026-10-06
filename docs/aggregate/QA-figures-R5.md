# QA figures — R5 (ch12 figures + 13 chapter heroes)

Reviewer pass per `docs/QA.md`. Walked every state at 1440 and 390 (plus 1280/1920/820/360 for heroes), light and dark page themes, reduced motion; filmstrips of every hero over 40–115 s of scene time; programmatic hero/title overlap test at 6 viewports. All numbers below are desktop unless noted; fps sampled with rAF over 2–3 s while animating.

Summary: **17 figures** — 12 fixed, 5 shipped as-is (✓). 0 console errors/warnings, 0 overflow, `check.mjs` clean on all 13 chapter pages, `stepper-check` "All paths agree" (ch12-neoadjuvant, desktop + mobile). One shared-code request, two draft (caption/alt) notes.

---

## ch12 figures

### ch12-resistance — fixed
Science/consistency verified: mechanisms, states and anti-PD-1 rings come from `cycle-data` (acts 6–7, also 3 = stem-like reserve refuelling priming; anti-CTLA-4 at 3 is in the same table). B2M loss = absent cups; NK rescue with missing-self ✓; interferon-γ hollow blue rings from the T cell; JAK beads ⊣ after relapse; excluded/desert match ch07-tme art; meter tagged Illustrative; antibodies never kill; badges ✓ ≈ ✕ ~ with words.
- **Fixed (shop window, with anti-PD-1):** the capping drug antibody sat on top of the "Killer T cell" label — PD-1 moved to the trailing side (168°), drug follows.
- **Fixed (brake on, phones):** "Anti-PD-1 (drug)" label ran off the left edge ("D-1 (drug)") — compact layout now anchors it inside the stage.
- **Fixed (no scouts, phones):** "suppressive signals" label collided with the "T-CELL ACTIVITY" meter title and an MDSC — moved the label and the MDSC.
- **Added:** when anti-PD-1 is on, a one-line key under the vignette: "Gold rings: where anti-PD-1 acts (thin ring: it also helps refuel priming)." The thin ring at step 3 had no explanation anywhere; this ties the wheel to the Ch 8/12 text (effector end + refuelling).
- Checked, not a bug: the no-scouts meter rises to half with the drug (a 0.35 s fade after each rebuild made one early screenshot look unchanged).
- Remaining (minor): the "Cells showing a typo: 5 → 0" counter counts on-stage cells, so no extra Illustrative tag was added (stage already has "Not to scale"; meter has its own tag).
- Perf: 960–1,609 nodes (no-scouts/excluded are the heaviest), 60 fps desktop and phone.

### ch12-combinations — fixed
Model verified in the browser: `cycle-data.selfTest()` returns `[]`; spot-checked A+PD-1 strong, B+PD-1 growing, B+PD-1+gates partial with the excluded note, B+engineered growing, C+engineered partial (step 7), C+engineered+PD-1 strong/substantial, D+engineered partial, D without engineered growing, IDO no change. Engineered killers show "not needed" on 1–3, "joins here" at 4, "engineered recognition" at 6 and still need 4, 5, 7. Both meters carry "Illustrative, not measured"; the weakest-link footnote stays visible on desktop and phone; vaccine card uses the STATUS string (company-reported, not yet approved).
- **Fixed (phones):** the "Bars beside weak steps…" legend was shown although phones draw no bars — hidden in the oval layout. Re-measured figure sizes and rebuilt ch12.
- Perf: ~1,005 nodes, 60 fps.

### ch12-neoadjuvant — ✓ shipped
All six steps + free "Surgery / No surgery" variant at 1440 and 390. Tags "Illustrative" + "Time compressed"; step-4 note visible through step 6; "one possible course" + "relapse" tags on the adjuvant lane at step 6; pathology card text matches spec; clone keys (triangle/star/diamond) match micrometastases; killing only by T cells. stepper-check passes on desktop and mobile.
- Remaining (minor): relapse clusters and patrolling T cells partly cover the A/B/C site letters at step 6. In the "No surgery" variant the step-6 caption still describes surgery (the extra box below explains the rectal-cancer no-surgery course) — see draft note 2.
- Perf: ~3,800 nodes (> 3k smell: two lanes × ~25 rigged cancer cells, rigged clone cells and key glyphs; cells already low-detail), 60 fps. Left as-is; a canvas rewrite is not justified at 60 fps.

### ch12-ctdna — fixed
Curves follow the spec points; the blood-test line sits below the scan line; the hatched "too little for this test to detect" zone stays in every scenario; lead time is months (3→11); the treated course levels off **below** the detection line (a negative test ≠ cured), and the source line says detection limits vary. y axis is "more/less", no numbers. **Callout numbers checked against PubMed:** IMvigor011 (250 randomized; OS 32.8 vs 21.1 months; 357 ctDNA-negative, 88% disease-free at 2 years; doi:10.1056/NEJMoa2511885) and CheckMate 816 (5-year OS 75.0% vs 52.6% with vs without presurgery ctDNA clearance; doi:10.1056/NEJMoa2502931). The FDA approval date (May 2026) could not be checked here; it stays flagged as in FIGURE-AUDIT §7.2.
- **Fixed:** a playhead parked at month 24 struck through the "24" tick label — the rule now skips the month-label row.
- **Fixed (phones):** "without early treatment" ran into the gutter beside "Visible on scans" — two lines inside the plot.
- Checked: dark page theme, keyboard slider, toggle only in "Hidden leftover", captions map to steps 2–5.
- Perf: 411–632 nodes, 60 fps.

---

## Chapter heroes (reviewed as a set)

Set-level checks: the shared tissue background, dark lens and palette are consistent; no labels; `aria-hidden`; reduced-motion stills are static (pixel-diffed 3 s apart) and show the key moment; **no overlap with header text at 1280/1440/1920/820/390/360** (bounding-box + lens-circle test), no overflow. All 13 ran at 60 fps with 155–692 nodes and no console output. Event cadence is now 20–42 s for every hero.

| Hero | Status | What changed / notes |
|---|---|---|
| ch01-hero | ✓ | Ligand docks/glows/lets go every 20–30 s. Receptors are teal notches, not silver cups (MHC-only rule respected). |
| ch02-hero | ✓ | Macrophage swallows a bacterium; neutrophil passes. Two event streams (24–32 s and 30–40 s) as specced; minor: combined cadence is livelier than the others. |
| ch03-hero | fixed | Receptors were long, sparse spikes (9 × 26u) that read as **viruses**; now 11 × 15u (library proportions for a keyed B cell). Daughters spread 47u so their key rows no longer interpenetrate. |
| ch04-hero | fixed | Patrolling T cells overlapped each other (lanes 45u apart with ±22u wobble) → lanes 80u apart, ±9u wobble, 12-point paths. In the phone band, outer-lane cells were cut by the top/bottom edge → y clamped inside the band. The reduced-motion still placed two cells on top of each other → explicit spread. |
| ch05-hero | ✓ | Helper on mature DC → teal cytokines → killer switches to activated form and crawls off. |
| ch06-hero | ✓ | Division into two hue-shifted daughters; no clone letters because heroes carry no labels (deliberate exception to §4 rule 15). |
| ch07-hero | fixed | The killer exited **through the cancer cells that still displayed neo-peptides**, ignoring them; also the 4-cell rotation sometimes hid a cell on the far side (killer had to reach through the cluster). Now only the cell the killer seeks shows its pink typo (neighbours show self), only the two near-side cells take turns hiding, and the killer turns back away from the cluster. |
| ch08-hero | fixed | **Science:** drug antibodies were placed by `capPose` while PD-L1 was still interlocked, so their arms sat inside PD-L1 and on the cancer cell's membrane, and the brake "−" discs stayed lit after release. Now: lock lets go (PD-L1 + cancer cell ease back 30u), antibodies cap PD-1 on the T cell only, Fc away, the "−" discs fade, then the T cell brightens and polarizes. Cells rescaled to the canonical T : cancer ratio (42 : 72, was 50 : 66). |
| ch09-hero | ✓ | Drug antibodies cap diamond antigens tips-first; bispecific bridges a resting T cell. |
| ch10-hero | fixed | **Science:** the CAR-T cell docked membrane-to-membrane (cell bodies overlapping, CAR glyphs buried) instead of binder-on-antigen. It now moves so one CAR binder tip meets one antigen knob, recognizes, backs off and divides; daughters no longer drift back through each other. Reduced-motion still = the contact, glowing (was the post-division frame with no contact). |
| ch11-hero | ✓ | Immature DC takes up particles, matures (longer dendrites, pink peptides). |
| ch12-hero | fixed | T cells settled on top of each other (some spots < 1 cell apart, paths crossing earlier arrivals) and arrived every 11–15 s. New spots ≥ 2 radii apart, filled deep-first, one exit lane per cell; cadence 20–26 s. |
| int-hero | fixed | Crossfade every 12 s → 20 s (calm-motion rule). |

---

## Requests (shared code / drafts)

1. **Shared — `assets/js/figures/shared/cycle-wheel.js`, `paintCenter()` (≈ line 652):** in the under-the-wheel branch the second line uses `dy: i ? 20 : 0` (user units). On the phone locator the text is scaled up, so "Stalled at step 2: / Presentation" lines touch (seen in ch12-resistance at 390 px). Change to `dy: i ? '1.2em' : 0`.
2. **Draft — 12-frontier.md, ch12-neoadjuvant:** the free "No surgery" variant keeps step 6's caption ("The neoadjuvant patient now has surgery…"). Either accept (the figure's extra box explains), or add a variant caption the module can show.
3. **Draft — 12-frontier.md, ch12-resistance `alt`:** "fixes the case where the PD-L1 brake is the main problem, but not the others" — chip 6 shows "≈ a little help at most". Suggest "…but helps little or not at all in the others."

---

## Polish round (POLISH.md → R5; VISITOR-REVIEW-B #10–12, VISITOR-REVIEW-A heroes)

All checks re-run: `check.mjs` clean on 03/04/05/12; 0 console errors; 60 fps; ch12 figure sizes re-measured and the page rebuilt. Shared request #1 above (`paintCenter` `dy: '1.2em'`) has landed; I made no shared edits this round.

- **B10 phone proximity.**
  - `ch12-resistance`: on phones the seven tiles are replaced by a **"Mechanism" select** placed directly under the stage, so the wheel, the badge and the vignette stay one glance away. Desktop keeps the tiles.
  - `ch12-combinations`: a **compact result strip** sits directly above the treatment tiles on phones (tumor-control badge, side-effects badge, "Stalled/Slowed at step k: name" or "Cycle running"). It is sticky under the header while the tiles are in view.
- **B11 `ch12-combinations` declutter.**
  - The two "Illustrative, not measured" meter tags and the footnote paragraph are now one line: "Illustrative, not measured: a teaching model in which the weakest step sets the pace." An ⓘ toggle (aria-expanded) reveals the full spec footnote and a ring key.
  - Weakness is now a **soft red ring around the node whose thickness grows as the step weakens**; it thins as treatments strengthen the step and disappears when the step is ≥ 0.70, skipped or replaced. The thermometer bars, their legend and the wheel's own strength arcs are gone.
  - A **"Try fixing this tumor ↓"** link sits in each 12.1 caption whose mechanism has a profile (1→A, 3→D, 5→B, 6→C). It jumps to `#fig-12-2` and switches 12.2 to that tab (a document event, or a pending dataset flag if 12.2 hasn't mounted yet), clearing chosen treatments.
- **B12 resistance wheel geometry.** The wheel now uses the shared wheel's existing `layout: 'mini'` (circle, number-only labels, names in the tap tooltip and aria), so it matches 7.3/12.2 instead of the tall oval. TUMOR / LYMPH NODE / BLOOD zone names are drawn inside the ring via `wheel.layers.under` on wider stages; phones show tints only. No change to `cycle-wheel.js` was needed.
- **ch03-hero.** The five B cells now wear five clearly different sockets (triangle, star, two deep notches, a step, three notches). They are drawn as the library's compact notched tip (`tcrKey form:'tip'`) on a short two-chain stalk, so each shape reads at lens size. The antigen is the matching triangle plug, sized to the exaggerated notch.
- **ch04 vs ch05 heroes.** ch04 stays the wide field: a central star-shaped DC with T cells patrolling and one docking. **ch05 is now a close-up of helper licensing.** A large mature DC body fills the lower lens, with a teal helper and a blue killer side by side on it at about 1.5× ch04's magnification. The helper recognizes its window and sends teal cytokines to the killer, which recognizes its own window, switches to its activated form, lets go and crawls off. The reduced-motion still shows both docked, with the killer activated.
- **Pending:**
  - Re-check the ch12 meters after the shared activity-meter restyle (B6). `activity-meter.js` is unchanged as of this pass.
  - Re-check after the foundation's caption-placement change. Both ch12 explorers append their prompt/caption to `ctx.controls`; the resistance select sits before its caption by design.
- **Meter restyle (B6) re-checked.** I now pass `tone` explicitly. In `ch12-combinations`, tumor control uses `benefit` (blue) and side effects use `risk` (crimson). In `ch12-resistance`, T-cell activity uses `benefit`. Desktop and phone screenshots show filled segments with hairline empty tracks and legible labels. 0 console errors, 60 fps.

## Final re-check (after foundation S1/S2 + Next cards + end-of-book panel)

- **Axe fix (critical, invalid ARIA).** The chip component paints `aria-pressed`, which is invalid on the `role="radio"` chips in `ch12-resistance` (mechanisms) and `ch12-combinations` (tumor profiles). Each sync now removes `aria-pressed` and sets `aria-checked`. Figure-scoped CSS gives `[role=radio][aria-checked=true]` the same selected look. `site-audit axe 12-frontier.html`: **0 violations** (desktop/phone × light/dark).
- **Replay/Reset vocabulary** already matches S8: resistance "Replay" re-runs the current vignette, combinations "Reset" clears the tray, and the neoadjuvant stepper uses the built-in controls. Nothing to change.
- **ch12 figures** at 1440/390 in light and dark: the step caption now sits directly under the stepper (neoadjuvant). The resistance phone select, the combinations result strip, the meters and the ctDNA chart all look right. `stepper-check` ch12-neoadjuvant: all paths agree, desktop and mobile. `check.mjs`: 13 chapter pages, 0 errors, 0 warnings.
- **Heroes in Next cards** (124 px desktop lens, 76 px phone lens; light/dark; reduced motion): all 12 mount with a square 600 × 600 viewBox and are not clipped. They run their quiet events while visible, and the reduced-motion stills are static. 0 console errors.
  - Thumbnails read fine. At 76 px the off-centre subjects (ch12 vessel + nest, ch07 cluster) are small but recognizable.
  - Optional later: a thumbnail-specific crop if the supervisor wants bigger subjects there.
- The ch12 end-of-book panel shows no hero (by design).
