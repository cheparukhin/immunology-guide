# Chapter 7 "Hide and Seek": reader-experience review

Reviewed: `content/drafts/07-escape.md` (line numbers below refer to that file). Reader persona: a software engineer who has read Chapters 1-6 and has a parent with cancer.

## Overall impression

The opening is the best hook in the guide so far. The kidney story is concrete, strange and personal, and the first half (the 1974 miss, the 2001 mouse comeback, the three Es, "evolution under police pressure") reads smoothly and builds well. The chapter sags in the second half. Three consecutive list-shaped sections (seven-step cycle, six escape routes, three tumor types) carry heavy jargon, and two of the four figures (the cycle explorer and the immunoediting simulation) are far too busy for someone with no biology. A few places would make a sharp skeptic push back: the equilibrium story contradicts its own Go-deeper box, the transplant evidence ignores an obvious confound, and the kidney anchor case is slightly overclaimed. Fixing those, trimming the figures, and mapping each escape route back to the wheel would make this a strong chapter.

---

## Must fix

**1. Equilibrium is told two incompatible ways (simulation captions vs. Go-deeper box).**
- Locations: sim step 2 (l.271), step 5 (l.274), box "Immunoediting caught in the act" (l.279), main text l.171.
- Quotes. Step 2: "Equilibrium. The survivors are harder to see." Step 5: "the hidden tumor grew out quickly." Box: "Cells in the stable masses divided slowly, and they were still highly visible — 'unedited.' Only when a tumor broke out did its cells turn out to be edited."
- Problem: an attentive reader who opens the box learns that the simulation's story (editing happens, then a plateau of already-hidden cells) is not what the 2007 mice showed. The step 5 caption then cites those same mice as support.
- Fix: Step 2 becomes "Equilibrium. The tumor neither grows nor disappears: T cells keep the remaining cells in check while the survivors are slowly being shaped. In people, this standoff may last for years." Step 5 becomes "…and the dormant tumor grew out quickly…". Add one box sentence: "The simulation compresses this: in the real mice, the cells were still visible during the standoff and became edited only at breakout."

**2. The "transplant test" is missing the one fact that makes it fair (and Quiz Q1 depends on it).**
- Location: l.166. Quote: "When the researchers moved tumors that had grown in immunodeficient mice into normal mice, about 40% of them were rejected."
- Problem: this reader has just read about transplant rejection. Moving tissue between animals and having it rejected looks like ordinary rejection, not evidence of editing. The reassurance ("the mice were genetically matched") appears only in a quiz explanation.
- Fix: "All the mice were inbred, as genetically identical as twins, so ordinary transplant rejection was not at issue. Even so, when the researchers moved tumors that had grown in immunodeficient mice into normal mice, about 40% were rejected. None of the tumors that had grown in normal mice were."

**3. The transplant/HIV evidence has an unacknowledged confound, and the implication for common cancers is hidden in a box.**
- Location: l.47 and the box at l.149. Quote: "Take the patrol away, and virus-driven cancers flourish. Cancers built from mutated self are harder to see in the first place, so losing the patrol changes their risk less."
- Problem: a skeptic asks whether these cancers rise because T cells normally kill early tumor cells, or because T cells normally keep EBV, HPV and the Kaposi virus in check. The text offers only the first reading. It also never says what the flat breast and prostate numbers mean. The honest bridge ("the best human evidence for common cancers comes from elsewhere") sits in the last sentences of the box, so a main-text-only reader may conclude immunity ignores breast cancer.
- Fix: "Take the patrol away, and virus-driven cancers flourish. Part of that is probably because the same immune cells normally keep these viruses in check, so this evidence is strongest for infection-driven cancers. Cancers built from mutated self are harder to see, so losing the patrol changes their risk less. That does not mean the immune system ignores breast or prostate cancer, only that any effect is too small to show in registry data. For those cancers, the evidence comes from inside tumors." Move the box's closing "What survives this scrutiny…" paragraph into this bridge. Also change l.152 "The second line of evidence" to "A different kind of evidence", since mice, then people, then tumors makes this the third.

**4. The anchor story overclaims and leaves an obvious objection open.**
- Locations: l.13-17. Quotes: "That 'something' was almost certainly her immune system." / "And when one recipient's defenses were restored, he recovered." / "His body began rejecting the kidney, which was then removed."
- Problems: (a) "recovered" rests on three years of follow-up in one patient. (b) The melanoma cells were foreign to the recipients, so a skeptic asks whether this is surveillance or just rejection of foreign tissue. (c) "almost certainly" comes before any evidence. (d) A reader will wonder what losing the kidney meant.
- Fix: "Something held them in check. The likeliest explanation is her immune system, and this chapter builds the case." / "…which was then removed, and he went back to dialysis. Three years after his transplant, he showed no sign of melanoma." / "In the one recipient whose defenses were restored, the cancer did not return." Add one sentence after "…took off": "(The cells were foreign to the recipients too, so this is a messier experiment than it first looks. The sixteen quiet years in the donor are the striking part.)" Confirm the dialysis detail against the source.

**5. The `ch07-cycle` figure will overwhelm a non-biologist, and its panel text front-runs jargon the chapter has not yet introduced.**
- Location: l.302-436.
- Problems:
  - Fifteen therapy chips, many unmet (anti-LAG-3, IDO inhibitors, innate stimulants, TGF-β blockers, TIL/TCR-T, T-cell engagers).
  - Break, repair and bypass mechanics, each with different outlines, tags, a center glyph, dashed arrows and "not needed" tags.
  - Location bands, particle flow and seven custom glyphs.
  - The "How tumors break it" panel is full of WNT/β-catenin, B2M, JAK1/2, MDSCs, adenosine, lactate and CAFs, but the figure sits before "How tumors escape" explains any of it.
- Fix:
  - Move the figure to the end of "How tumors escape", where "break a step" is the payoff of the catalogue. Alternatively keep it where it is but make "Break this step" available only after the tour.
  - In Chapter 7 mode, show about six chips in four families (start the cycle: radiation, vaccines; release brakes: anti-CTLA-4, anti-PD-1; lower walls: TGF-β blockers; bring your own T cells: CAR-T, T-cell engagers).
  - Drop the bypass rendering in explore mode. A gold ring on "acts here" plus one line ("adds killers downstream; they still must travel, get in and kill") is enough. Keep the full chip set and bypass visuals for the existing `combine` mode in Chapter 12.
  - Cut each "How tumors break it" entry to at most two plain sentences, with pathway names as tooltips.

**6. Main text contradicts the cycle figure's own rule about which steps therapies skip.**
- Location: l.300. Quote: "Vaccines boost presentation (Chapter 11). Engineered T cells and T-cell-engaging antibodies skip straight to recognition (Chapters 9 and 10)."
- Problem: the figure data says vaccines act on steps 2 and 3, and CAR-T and engagers enter at trafficking and "still have to reach the tumor, get in, and kill". "Skip straight to recognition" teaches the opposite of why these therapies struggle in solid tumors (Chapter 10).
- Fix: "Vaccines boost presentation and priming (Chapter 11). Engineered T cells and T-cell-engaging antibodies supply ready-made killers, skipping the first three steps, but those killers must still reach the tumor, get in and kill (Chapters 9 and 10)." In the preceding sentence, say "anti-CTLA-4 at priming, anti-PD-1 at killing" rather than "priming and killing".

**7. The `ch07-immunoediting` simulation has too many controls and encodings for a first-time viewer.**
- Location: l.180-276.
- Problem: about 12 controls (Play/Pause, Reset, Replay, three speeds, four pressure levels, Transplant test, Guided run), a dual-axis line chart, a five-bin histogram, and three redundant visibility encodings (pink dots, rim glow, missing MHC cups). "Visibility" also silently merges two different tricks: fewer neoantigens and no shop window.
- Fix:
  - Open in Guided mode with three visible controls: "Play guided run", "Immune pressure: Off / On" (High under "More"), and "Transplant test" (appears only after escape).
  - Move Reset, Replay and Speed behind a "…" menu.
  - Remove the dual axis. Show the survivors' make-up with a three-bin histogram (conspicuous / faint / hidden).
  - Add a permanent legend line: "Pink dots = neoantigens on display. More dots, easier for T cells to spot."
  - Add a footnote that "hidden" stands for several tricks (fewer neoantigens, lost MHC).

---

## Should fix

**8. "Poison the air" paragraph is too dense and duplicates its box (l.492 vs. l.502-515).**
- Quote: "Stressed and dying cells release ATP, the cell's energy currency, which enzymes on cell surfaces convert into adenosine… Some tumors make an enzyme, IDO, that breaks down the amino acid tryptophan…"
- Problem: six new ideas in one paragraph, and the box then explains the same molecules.
- Fix: "A tumor's interior is a harsh place to work. Cancer cells hog glucose, outgrow their blood supply (leaving pockets short of oxygen) and pour out lactic acid. T cells need the same fuel and work poorly in the acid and thin air. Tumors also make molecules that tell T cells to stand down or starve them, such as adenosine and IDO (see the box). Add TGF-β and other calming signals, and even T cells that get inside struggle." Leave the ATP and tryptophan mechanics to the box.

**9. "How tumors escape" opens awkwardly and never ties the six routes back to the wheel (l.456-500).**
- Quote: "…they are easiest to remember through this guide's image for the tumor microenvironment — everything inside a tumor that is not a cancer cell…"
- Problems: the antecedent is garbled, since it reads as if the microenvironment were the image. Hide and Go deaf are not "environment" at all. The six routes are never numbered or mapped to the seven steps, so the cycle and the escape list feel like separate lists. The most vivid human case (the relapsed melanoma patients, l.498) is buried at the end.
- Fix:
  - Open: "Escape means at least one link in the cycle breaks and stays broken. Tumors have six main ways to do it."
  - Define the microenvironment in its own sentence, then give the analogy.
  - End each subsection with a tag: Hide breaks step 6; Brake, step 7; Corrupt guards, steps 3 and 7; Walls, step 5; Poisoned air, step 7; Go deaf, steps 6 and 7.
  - Consider opening the section with the relapse patients.

**10. "Adaptive resistance" collides with "adaptive immunity" (l.474).**
- Quote: "This is called adaptive resistance, and it hides good news."
- Problem: this reader learned in Chapter 3 that "adaptive" means the B/T-cell side.
- Fix: "This is called adaptive resistance. 'Adaptive' here means the tumor adapts to the attack, and it has nothing to do with adaptive immunity. It also hides good news."
- Related: "escape" is used for the third phase of immunoediting and, in l.456, for any broken link. Say "escape routes" for the latter.

**11. Terms that change names mid-chapter.**
- (a) l.21 introduces "immunological surveillance"; l.43, 45 and elsewhere use "immunosurveillance" with no bridge. Fix: 'Burnet called it "immunological surveillance," or immunosurveillance for short.'
- (b) The section title is "Hot, excluded and cold", the bullets say Inflamed/hot, Desert/cold, the figure says Inflamed/Excluded/Desert, l.528 says "turning excluded and cold tumors hot", and the quiz says "desert, or cold". Six labels for three states. Pick Inflamed / Excluded / Desert as the working terms and mention "hot" and "cold" once as the press terms. In the field, "cold" often covers both excluded and desert; say so. Retitle: "Inflamed, excluded and desert tumors".
- (c) l.464 "as in the spectrin-β2 mice" is jargon for what was one tumor. Fix: "as in the mouse tumor described earlier".

**12. The human-evidence paragraph has too many numbers, repeats the figure, and says nothing about absolute risk (l.45).**
- Problem: seven statistics in one paragraph, almost all repeated in the figure's step 1-2 captions. All of them are ratios, so a family member could over-read "60 times".
- Fix: "Among about 176,000 US transplant recipients, cancer overall was about twice as common as in the general population, but the rise was uneven. Kaposi sarcoma, a rare cancer driven by a herpesvirus, was about 60 times more common; lymphomas, often driven by the Epstein–Barr virus, about 7.5 times. Breast and prostate cancer were not increased. (These are ratios, not personal risks: a 60-fold rise in a very rare cancer is still a small number of people.)" Leave the rest to the figure. Move the 2024 "800 times" sentence to the figure tooltip or box.

**13. `ch07-evidence` is heavier than it needs to be, and two captions overstate.**
- Location: l.49-138.
- Problems: 19 rows, a log axis (first one in the guide, and not explained), whiskers, a two-way encoding, a sort toggle, and a "95% CI" tooltip.
- Fixes:
  - Cut to about 11-12 rows (drop Penis, Vulva, Hodgkin, Oropharynx, Thyroid, Stomach or fold them into the tooltip notes).
  - Teach the log scale in step 1: "Each step to the right multiplies: 1×, 2×, 5×, 10×…".
  - Hide the whiskers until a row is tapped, and say "likely range" instead of "95% CI".
  - Step 2: "Some cancers became dozens of times more common" overstates, since only Kaposi (61×) qualifies. Rewrite: "Kaposi sarcoma became about 60 times more common and several others 5 to 17 times, while breast and prostate cancer, among the most common of all, did not rise."
  - Step 3: "cancers driven by viruses" conflicts with the stomach/H. pylori row. Use "driven by infections".

**14. `ch07-tme` teaches three ideas at once, and its scene is unlabeled (l.530-619).**
- Problem: the profiles, the five suppressor layers and the drug test are three separate goals. PLAN §1 says one idea per figure. With about eight unlabeled cell types and labels shown only on demand, a lay reader sees violet, olive and rose blobs with no key.
- Fix:
  - Make the primary path the three modes plus "Add a PD-1 blocker". That is the payoff of the section.
  - Put the five chips under a secondary "Who lives here?" toggle.
  - Add an always-on three-item legend (cancer cell, killer T cell, wall).
  - Order the chips to match the text (Hiding, Brakes, Corrupt guards, Walls, Poisoned air).
  - Consider a sixth chip for "Deaf", or a note that it cannot be drawn.

**15. The seven-step list is dense where it matters most, and one point is unreconciled with Chapter 5 (l.290-298).**
- Problems:
  - Step 2 packs four ideas into one list item: danger signals, maturation, cross-presentation and tolerance.
  - Step 1 says dying cancer cells restart the cycle, but Chapter 5 told the reader that T-cell killing is a quiet death that "raises no alarm". Step 7 then says killing "start[s] the cycle again". The figure adds "quiet death does not [alert the immune system]", but the main text never reconciles this. Ask the science reviewer how to word it.
  - The figure's tour captions (steps 2-8) repeat the same seven descriptions nearly verbatim.
- Fix:
  - Step 2: "Presentation. Dendritic cells, the scouts and couriers of Chapter 4, collect this debris. If danger signals are present, they mature and carry the fragments to a nearby lymph node. Without them, they teach tolerance instead." Move "cross-presentation" to a "(Chapter 4)" pointer or the box.
  - Add one sentence on where the alarm comes from.
  - Make the tour captions add something new, such as how each step breaks, instead of repeating the list. Or shorten the main-text list to one line per step.

**16. Five sentences I had to read twice.**
- l.27 "used mice lacking a RAG gene — one of the enzymes that cut and paste…": a gene is not an enzyme. Fix: "…lacking a RAG gene, which codes for an enzyme that cuts and pastes receptor gene segments (Chapter 3)."
- l.29 "works as a cancer-suppressing system that operates from outside the cell": this is cryptic, since "tumor suppressor" is a Chapter 6 idea about the cell's own brakes. Fix: "In effect, the immune system is a tumor suppressor that works from the outside, a second layer of protection beyond the cell's own brakes (Chapter 6)."
- l.481 MDSC bullet: the subject is separated from its verb by two nested parentheticals. Split: "MDSCs are immature relatives of neutrophils and monocytes (the blood-borne precursors of macrophages). The bone marrow pours them out in large numbers during cancer, and they starve and silence T cells."
- l.472 "98% of PD-L1-positive tumors had T cells nearby, compared with 28% of PD-L1-negative ones": clarify the unit ("tissue samples") and the direction ("T cells were nearby in 98% of PD-L1-positive samples but only 28% of PD-L1-negative ones").
- l.498 "Two had lost… a third had lost B2M": the fourth patient is left dangling. Fix: "Three of the four had a clear explanation: two had lost JAK1 or JAK2 and become deaf to IFN-γ, and one had lost B2M and, with it, its shop window." Also l.155 "in the first group analyzed" is unclear; say "in the main analysis".

**17. Quiz: one recall question, two gaps, and some cues.**
- Q3 ("In an excluded tumor, where are most of the killer T cells?") is definition recall, and it has only three options.
- No question covers the cycle (the chapter's centerpiece) or the transplant evidence.
- Q2 option 4's explanation ("the classic signature of adaptive resistance") gives the answer away.
- Q1: "often rejected" overstates the 40%; the correct option is the longest in Q1 and Q2; Q1 relies on the inbred-mouse fact absent from the main text (see #2).
- Q4 option 3 is a drug, not a "defender".
- Suggested replacements:
  - Q3: "A biopsy shows killer T cells packed along a thick band of collagen around a tumor, with almost none among the cancer cells. A PD-1 blocker is started. What is most likely? [x] Little response: the brake can be released, but the T cells still cannot reach the cancer cells. [ ] A strong response, because PD-1 blockers dissolve walls. [ ] No effect, because there are no T cells to act on."
  - New Q: "A tumor stops making B2M. Which step of the cancer-immunity cycle does this break? [x] Recognition (step 6)…"
  - Optional new Q on why virus-driven cancers rise most in transplant recipients while breast cancer does not.

**18. Unglossed or late-glossed terms.**
- Kaposi sarcoma, Epstein–Barr virus (say "the virus behind mononucleosis") and collagen (l.486) are not defined or tagged. "Together with abnormal blood vessels, this stroma forms walls" tags stroma but never says what it is. Fix: "this fibrous scaffolding, called stroma."
- Galon's "invasive edge" (l.152) is undefined. Fix: "its invasive margin, where the tumor pushes into healthy tissue."
- "immunotherapy" first appears in the l.149 box and "checkpoint inhibitors" at l.300, both before their glossary tags.
- Add glossary entries for Kaposi sarcoma, collagen, invasive margin and Epstein–Barr virus.

**19. Main text vs. box balance: names and details.**
- Eight researcher names plus an institution in the main text (Thomas, Burnet, Schreiber, Old, Dunn, Galon, Chen, Mellman, "Washington University in St. Louis"). A lay reader retains two at most. Keep Burnet and Schreiber; use "researchers" or "a Paris team" elsewhere.
- Technical details that belong in boxes: WNT/β-catenin (l.524), spectrin-β2 (l.176).
- Duplication: the HLA-loss "about 40% of non-small-cell lung cancers" appears in both the Hide section (l.464) and the box (l.281). Drop one.
- The kidney case is retold in the opening, equilibrium bullet, sim caption 5, box paragraph 3 (l.283) and the closing. Delete box paragraph 3.
- The main text says the 1974 idea "dead" without saying why. One clause ("the 'T-cell-free' mice turned out not to be") keeps it self-sufficient.

---

## Optional

- **O1. Stronger pull at the end (l.641).** After "…lucky accidents", add a question: "If the immune system could hold one melanoma at bay for sixteen years, why did medicine take another century to learn to help it?" The Interlude then reads as an answer, not a detour.
- **O2. "Rather than poisoning or cutting out cancer cells directly" (l.639)** clashes with "poison the air" and with the ADCs and chemotherapy later. Use "Rather than only cutting, burning or poisoning cancer".
- **O3. Style trims.** "Sit with that for a moment." (l.15) and "a remarkable variety of ways" (l.456) lean toward hype. The equilibrium bullet (l.171) is five sentences; move the 2007 experiment to its own short paragraph. Add percentages to "30 of 52 vs 11 of 57" (58% vs 19%).
- **O4. Key idea 3 ("one of the strongest clues")** and takeaway 1 (a three-clause sentence) could each be one plainer sentence. Key idea 1 says "do better"; say "tend to survive longer".
- **O5. "Real tumors are messier than three boxes" (l.526)** is a good honesty hook; consider placing the T-cell/prognosis link from the Galon section (inflamed means better prognosis) here too, to join the two halves.
- **O6. Spelling and voice** are consistent with PLAN §2 (US spelling, active voice, numbers with context), apart from the items above. No change needed.
