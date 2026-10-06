# Visitor review B: Part II–III, interlude and reference pages, as built

*Visitor:* a first-time reader who has already finished Part I: a software engineer who likes Kurzgesagt and Ciechanowski, with no biology training. I also read as an editorial design critic.
*Route:* Ch 6 → Ch 7 → Interlude → Ch 8 → 9 → 10 → 11 → 12 → glossary → sources → about, at desktop 1440×900 in light theme. I scrolled every page screen by screen and drove each of the 34 figures through several states (steppers, toggles, sandboxes, timed runs of up to 60 s). I checked the phone layout (390 px) on Ch 7, 10 and 12, dark theme on Ch 11, and Ch 5 for consistency with Part I.
*Tooling:* `tools/shot.mjs` plus small Playwright scripts. Screenshots are in the session scratchpad (`visitorB/`). `tools/check.mjs` passes these 11 pages with 0 errors and 0 warnings, and I saw no console errors.

---

## Overall verdict

This is remarkable explanatory publishing, and the second half is its best half. The pages read like a well-set book, with a live contents rail and popovers for terms and citations. The figures are dark "luminous microscope" windows with one consistent cast of cells. Most teach their idea in seconds, and several are worth sending to friends (6.3, 8.1, 8.3, 11.2, 11.3). Nothing is broken.

The weaknesses are about polish and pacing:
- The quiz can be gamed.
- Some figures are slow to pay off (7.2, 10.1) or make their key change too quietly (7.4, 8.2 meters).
- Two numbering systems collide in 7.3.
- On phones, some controls end up a screen away from the thing they change.
- The guide has no real ending. The final line of Ch 12 is good, but the page closes on 45 citations and a lone "Previous" card.

---

## What is genuinely excellent (don't break it)

- **Reading experience.**
  - Body type is comfortable, with good line length and generous spacing. The drop caps work.
  - The scrolled header shows a breadcrumb ("Ch. 10 Living Drugs"), and a thin progress bar runs along the top.
  - The left TOC rail highlights the current section.
  - The callout family is clearly differentiated: Key idea, In the clinic, Go deeper (as + cards), and the quiz and takeaways cards.
- **Popovers.**
  - The glossary popover (e.g., *cancer immunoediting* in Ch 7) gives a definition, then "Introduced in Chapter 7 · Glossary →".
  - The citation popover shows the full reference with its DOI on hover.
  - Both are fast and unobtrusive.
- **Honesty markers.**
  - Figures carry ILLUSTRATIVE / NOT TO SCALE / TIME COMPRESSED badges.
  - Real-data figures have source lines.
  - The "measured: 18–32%" band in 6.1 and the "One matching T cell in about 40 is shown… in reality 1 in 10,000 to a million" note in 9.4 are exactly right for this audience.
- **Standout figures.** Keep these exactly as they are:
  - **6.3 From typo to target.** Five gates, a codon strip, and then the real 2016 patient whose tumor lost HLA-C\*08:02. It also seeds Ch 7.
  - **6.4 How many mutations?** A beautiful log strip chart with the ≈11× MSI-high arrow.
  - **7.1 Which cancers rise when immunity falls.** A clean forest plot; sorting it "by cause" makes the point by itself.
  - **8.1 Jamming the handshake.** The T-cell activity gauge, plus the "Cancer cell displays its neoantigen" toggle, teaches that a blocker only works if the T cell can see the cancer. That was my favorite single interaction.
  - **8.3 The tail of the curve.** The time scrubber with a 100-person icon array.
  - **9.1 Mouse to human.** The slider plus the "trastu·**zu**·mab" naming card.
  - **10.2 Vein to vein.** The hospital/facility rail and log-scale curves; the last step's "Normal B cells return" lands well.
  - **11.1 HPV.** Country tabs and a dot array.
  - **11.2 Four weak links.** Preset A (a 1990s vaccine) against preset B (the modern combination) is a perfect "flip four switches" explorable.
  - **11.3 Design a personal vaccine.** Choosing four mutations and pressing "Make & test" is real agency, with an honest outcome.
  - **12.3 Before or after surgery.** The step groups are labeled (TWO PATIENTS / ANTIGEN SUPPLY / T CELLS / OUTCOME), and the two lanes compare well.
  - **12.4 Listening to the blood.** The illustrative curve is clearly separated from the real-trial cards.
- **Consistency with Part I.** 5.3 in Ch 5 uses the same dark stage, step dots, "Play all", "STEP n OF m" caption and cell styling. The hero lenses for Ch 5–12 are one family.
- **Dark theme.** Ch 11 looks native, not inverted. The HPV chart and the personal-vaccine board read well.
- **The about page.** It is candid about AI authorship and states "Errors are possible". It has a not-medical-advice section and a clinical-trial finder, and it explains the cell-color legend.

---

## Top 15 issues, prioritized

| # | Sev. | Where | What I saw | Suggested fix |
|---|---|---|---|---|
| 1 | **High** | Quizzes, all chapters | **The correct answer is the longest visible option in 43 of 51 questions**, and in 28 of 30 across Ch 6–12. In Ch 8, 9, 10 and 11 it is the longest in every question. It is also position **B** in 28 of 51 questions: all four in Ch 11 and Ch 2, and three of four in Ch 10. A test-savvy engineer notices by the second chapter, and the quiz stops checking anything. | Rewrite distractors so at least one is as long and as specific as the key. Assign option order at build time with a seeded shuffle. Add a `build-content` warning when the key is the longest option in more than half of a chapter's questions. |
| 2 | **High** | Ch 12 end of page | "Honest hope" ends well ("The distance between twelve out of twelve and one in five is the work that remains"). After it come the quiz, takeaways, 45 sources, and a single "← Previous: Chapter 11" card with an empty slot where "Next" would be. The guide just stops. The "note for readers facing treatment" also sits directly before the finale and interrupts it. | Add a closing coda after the takeaways: a short "You've reached the end" panel with a callback visual. One option is the 7.3 wheel with all seven links lit; another is the 12-of-12 / 1-in-5 contrast. Fill the empty pager slot with cards for Glossary, Sources, About and "Start again". Move the clinic note above "What nobody knows yet". |
| 3 | **High** | 7.3 *The cycle and where it breaks* | Two numbering systems collide. The caption reads **"STEP 4 OF 9"** directly above **"Step 3, Priming."** This is the figure that teaches the seven numbered steps. | Label the stepper by name, as 12.3 does: Overview · 1 Release … 7 Killing · Your turn. Or drop "STEP n OF 9" for this figure. |
| 4 | Med | 7.2 *Evolution under police pressure* | The guided run takes about 30 s to reach Equilibrium and about 60 s to reach Escape. The Speed control is hidden under "More". The module also has Elimination / Equilibrium / Escape jump chips, but I never saw them. Most readers will scroll away before the payoff. | Shorten the run to about 25 s, or default to 2×. Show the three phase chips next to Pause. Move Speed out of the "More" menu. |
| 5 | Med | 7.4 *Inside the fortified neighborhood*, Inflamed + PD-1 blocker | Before and after look almost the same: a few gold Ys and slightly fewer violet cells. Only the "Partial response" chip says what happened. (Excluded and Desert read better because the wall carries the story.) | Add a cancer-cell counter or bar, as 9.4 does with "Cancer cells destroyed 3/8". Make killed cells visibly shrink and fade. Show brake badges popping off T cells when the drug lands. |
| 6 | Med | 8.2 *Two brakes, two places*, step 5 meters | Filled segments are near-black charcoal and empty ones are pale beige. At "Attack: strongest / Risk: highest" all eight slabs are dark, which reads as off or disabled, not full. The meters in 10.1 and 12.2 use different styling again (pale on dark). | Use one meter component everywhere. Fill attack in killer-blue or go-green and risk in brake-crimson, the site's own color grammar. Draw empty segments as hairline tracks. |
| 7 | Med | 10.3 *A fever you can switch off* | The figure autoplays on scroll, and the drug is given whenever the reader clicks. I read the caption first and clicked about day 10.5, after the fever had already peaked, so the "switch off" barely shows. | Make the choice pre-armed: "Block IL-6 when fever starts" applies the drug at the 38 °C crossing. If the reader picks it after the peak, auto-replay with the drug. Or hold autoplay until a treatment is chosen. |
| 8 | Med | 10.1 *One signal, or two* | After "Meet a target cell", both meters stay empty for about 9 s and fill only around 15 s. At 7 s the CD3ζ-only and 4-1BB runs look identical, both with empty bars. The comparison across the three tails is the point, but you have to remember the last run. | Start filling "Kills on first contact" at contact (about 2 s). Label the time jump on the weeks-later meter. Keep the previous run's bars as ghosts when switching tails. Aim for a payoff in 6 s or less. |
| 9 | Med | Interlude, Figure 1 timeline | The axis is linear from 1890 to 2026. About 60% of the width (1890–1970) holds two markers, while 20 or so markers crowd into the last ~15% (2000–2026), mostly unlabeled diamonds. | Compress the axis before 1970 (piecewise or broken axis), or add a "Zoom to 1975–2026" toggle. Label approvals in the dense zone, or offer a list view. |
| 10 | Med | Phone (390 px): 12.1, 12.2, also 10.3 | Controls sit a screen away from what they change. In 12.2, tapping "Anti-PD-1" updates the wheel and meters, which are scrolled off above. The 12.1 resistance tiles stack in four rows under the scene. | On narrow screens, keep the stage sticky while the controls scroll. Alternatively, repeat a compact result strip (stall label plus tumor-control meter) directly above the buttons, or turn the tiles into a select, like the tumor dropdown 12.2 already uses on phone. |
| 11 | Med-Low | 12.2 *Fix the cycle* | It is overloaded: 4 tumor tabs, 7 treatments, two meters, "ILLUSTRATIVE, NOT MEASURED" twice, a disclaimer paragraph, a key for tiny "thermometer" bars beside the weak steps, and a "What real trials found" panel. It comes straight after another wheel (12.1) and re-teaches 7.3's "Where Part III treatments act". | Reduce the disclaimer to one line with an info tooltip. Show step weakness as ring thickness on the node instead of the thermometers. Link the two Ch 12 wheels: each 12.1 tile gets a "Try fixing this tumor ↓" link to the matching 12.2 tab. |
| 12 | Low-Med | Wheel family: 7.3, 12.1, 12.2 | Node order and icons match, which is good. But the 12.1 wheel is an **ellipse** (taller than wide) with labels inside the ring and no TUMOR / LYMPH NODE / BLOOD zones. 7.3 and 12.2 are circles with outside labels and zones. Side by side in Ch 12, the difference is noticeable. | Share the geometry. When space is tight, keep the circle and use number-only labels, as the phone layout already does. |
| 13 | Low | 6.1 sandbox (step 7, faulty repair, year 80) | The readout says "Model: **most**", but the scale's right end is labeled "**half**" and the marker is pinned against it. | Extend the scale to "all", or relabel the right end. Keep the measured band. |
| 14 | Low | Interlude, reading | After the timeline there are about 10 screens of unbroken prose, from "Magic bullets" through "The brakes nobody was looking for". The history is good, but it is the only stretch of the site with no visual anchor. | Add a sticky year marker in the margin that tracks the era being read and matches the timeline lanes. Add one or two pull-quotes, or inline milestone chips that open the matching timeline card. |
| 15 | Low | Chapter source lists and `sources.html` | Citations point down to the sources (`#src-n`), but sources don't link back up, even though the `ref-n` ids exist. The sources page is about 41,000 px tall with no search. | Add ↩ backlinks on each source. Add a filter box like the glossary's search. |

---

## Per-page notes

**Ch 6 · When Cells Go Rogue**
- The hero lens (one violet cell among sand-colored ones) captures the chapter's idea instantly. The opening (eyelid skin full of mutant cell families) is a great hook.
- 6.1 clonal evolution:
  - Steps 1–6 are clear. The sandbox, with faulty repair and the tree's "+121 more families died out", is genuinely fun. See issue 13 for the scale label.
  - The floating "driver" label in step 3 has no leader line.
- 6.2 target map:
  - Good. "Let me guess first" is a nice touch.
  - The HER2 card says "Large marker: most cancers carry a target of this kind", which reads oddly for HER2 specifically; consider "this class of target".
- 6.3 and 6.4 are excellent.
- The quiz feedback is good: each wrong option has its own explanation, plus "Try again" and "Show answer".

**Ch 7 · Hide and Seek**
- The kidney-transplant opening is gripping.
- 7.1 is excellent.
- 7.2 is the right idea, but the run is too long (issue 4). The "Who is left?" bars are good.
- 7.3: the content is excellent, and breaking a step then choosing a treatment shows where each drug acts well (Anti-PD-1 lights steps 3, 6 and 7 while step 5 stays broken). The numbering clashes (issue 3).
- 7.4:
  - Excluded and Desert read well, and "releasing brakes does not move walls" is a perfect line.
  - The Inflamed change is too quiet (issue 5).
  - The "Tap any cell" hint sits in the right margin, far from the stage.
- On phone, the wheel and its info card stack well.

**Interlude · 130 Years of Immunotherapy**
- The prose is strong and well cited.
- The timeline's lane chips and marker detail card (with Earlier/Later navigation and "Read more → Chapter 11") are well designed. The axis crowding is issue 9, and the text-only stretch is issue 14.

**Ch 8 · Releasing the Brakes**
- The Jimmy Carter opening works.
- 8.1 is the best figure on the site.
- 8.2: the split view of lymph node and tumor is clear, but the step labels are small and the meters look off (issue 6).
- 8.3 is excellent.
- 8.4 body map:
  - Very informative.
  - The data line at the top of the figure is a dense run of percentages in small type. Move it into the side card, or show it only for the selected drug.
- The Go-deeper boxes are rich. Two sit back to back after "Two brakes, two places", which is fine because they're collapsed.

**Ch 9 · Antibodies as Medicine**
- 9.1 and 9.2 are crisp. Cetuximab plus the "Mutant KRAS" follow-up is a great two-step lesson.
- 9.3 ADC: good story beats (lysosome, bystander effect). The T-DXd / T-DM1 switch works.
- 9.4 matchmaker:
  - Busy: about 50 T cells drift across the scene.
  - In antibody mode, the "tumor peptide" label sits by the cluster, which muddies the contrast with the TCR mode. Show it only in TCR mode.
  - The "Cancer cells destroyed n/8" counter is the right device; reuse it in 7.4.

**Ch 10 · Living Drugs**
- 10.2 is a model stepper: nine steps, but each one is a clear place and time.
- 10.1 is slow to pay off (issue 8). 10.3's drug timing is issue 7.
- 10.4 logic gates:
  - Clear. "Healthy tissue damage" against "Tumor cells remaining" makes the trade-off visible.
  - "Antigen loss unlocks after you have watched both targeting rules" is a gate that will frustrate explorers. Let the slider work at any time, with a nudge instead.
- The results table ("What it actually does") is compact and readable.

**Ch 11 · Teaching the Body to See**
- The best-paced chapter: four figures, four different interaction types, each earned.
- 11.4 oncolytic: "Inject virus" (primary) and "Play" sit side by side, and before injection it isn't clear what Play does. Merge them into one "Inject virus and play" action.
- In dark theme the hero loses its lens frame and becomes a glow on dark. That looks fine and probably intentional.

**Ch 12 · The Frontier**
- The 12-of-12 opening and closing bookend is strong.
- 12.1 resistance is a good diagnosis tool. Every tile has an "Add anti-PD-1" check, and the MHC-loss tile's "Who else could see it?" adds depth.
- 12.2 is overloaded (issue 11). 12.3 and 12.4 are excellent.
- The ending needs a coda (issue 2).
- At desktop width the TOC rail lists 13 entries, which makes it a long column; it's still useful.

**Glossary**
- Useful: 303 terms, search with a "/" shortcut, a sticky A–Z bar, and "Introduced in Chapter n" links.
- The three-column serif cards are dense but scannable.
- Consider "Also used in…" chapter chips, and making the letter jump bar indicate the current letter.

**Sources**
- Clean: 377 sources with a sticky chapter rail, and company-reported results are labeled as such.
- It needs search and backlinks (issue 15).

**About**
- Exemplary candor (AI authorship, possible errors, not medical advice) and a practical "Finding a clinical trial" section. The cell-color legend is a nice touch.
- It would be even more useful with a one-screen "map of the guide" (three parts, 13 stops) linking to each chapter.

**Phone (Ch 7, 10, 12)**
- Reading is excellent: about 18 px serif, a collapsible "In this chapter" menu, and the hero turns into a rounded banner.
- Figures reflow sensibly: 12.2 swaps its tabs for a select, and 12.1's wheel becomes number-only.
- The main problem is control–feedback distance (issue 10). I saw no horizontal overflow.

**Dark theme (Ch 11)**
- High quality. The paper turns to ink without washing out the figures, and chart colors keep their contrast.
