# Review: Chapter 1, "A Crash Course in Cells" (reader-experience and clarity)

Reviewed: `content/drafts/01-cells.md`, against PLAN §1–3. Persona: a smart non-biologist (a software engineer whose parent has just been diagnosed). Main-text word count measured with figures, boxes, quiz, takeaways and glossary stripped: **about 3,130 words (about 3,200 with the two key-idea callouts)**, against a target of 3,000 or fewer.

## Overall impression

This is a strong, welcoming opener. The hook ("None of them has eyes… they do it by touch") gives the whole guide a single organizing idea. The two analogies that carry the chapter, the city and the glove, both say where they break, and the closing "altered self" paragraph lands the stakes without hype. The tone is never patronizing. The risks are cumulative load and a few precise stumbles. The middle of the chapter asks a newcomer to absorb about 20 new terms. The handshake section alone brings in affinity, concentration, cross-reactivity and avidity in about 340 words. "Meet the defenders" then reads as a catalogue just before the finish. Several figures carry more controls than their one idea needs (the binding sim, the sandbox, the zoom). A handful of sentences need a second read, and the main text depends on a Go-deeper box for the idea of "synonyms". All of these are fixable without changing the chapter's shape.

---

## Must fix

**1. Over budget: about 3,130 words against 3,000 or fewer.** Cuts worth about 250 words, none of which hurt the story:
- Mast-cell bullet (about 22 words). The figure legend already covers it.
- Parenthetical "(Some tissue-resident macrophages instead descend from cells that settled in their tissues before birth.)" (about 21 words). Cut it or move it to a box. It is a distraction at this point.
- "They fill only a small fraction of the genome. The rest includes switches… still unclear." (about 28 words). Move it to the "Reading the genetic code" box.
- The avidity bullet (about 55 words). See #5.
- "The problem ahead," first paragraph (about 60 words). It recaps the chapter. Trim to two sentences, because the next paragraph restates it anyway.
- Lymph-node bullet (about 30 words). See the rewrite in #2.
- "Drugs exploit this…" paragraph (about 20 words). Keep caffeine, tighten the rest.
- Section 1, "Cells of one kind working together form a tissue, such as muscle or skin." Fold it into the previous sentence (about 15 words).

**2. Ambiguous "Here" in the lymphatic-organs bullet.**
Quote: "The thymus, behind the breastbone, is where T cells finish their training; the 'T' stands for thymus. **Here** T and B cells gather in vast numbers, scanning for a match."
Problem: "Here" reads as the thymus, which is wrong (the gathering happens in lymph nodes and spleen). "Scanning for a match" is also left hanging: a match for what?
Rewrite: "**About 39% are in the lymphatic organs.** Lymph nodes are bean-sized hubs, hundreds of them, strung along the vessels that drain {{lymph|lymph}} (the clear fluid that seeps out of tissues) back toward the blood. T and B cells crowd into them, waiting for the one shape they were built to recognize. The spleen does the same job for the blood itself. The thymus, behind the breastbone, is where T cells finish their training; the 'T' stands for thymus."

**3. "Synonyms" is unexplained in the main text, and the explanation lives only in a Go-deeper box.**
Quote: "Because the genetic code has synonyms, some leave the amino acid untouched."
Problem: A reader who skips boxes (which the PLAN promises is allowed) has no idea what this means. It is the key to why some changes are silent, and the first verdict card in the sandbox repeats it.
Rewrite: "Some changes are silent: several different three-letter words can stand for the same amino acid, like 'big' and 'large', so the swap leaves the protein untouched."

**4. The alanine counterexample undercuts the explanation just given.**
Quote: "Even at the sickle position, a different swap (to alanine instead of valine) produces a real variant that causes no symptoms… What a change turns into matters as much as where it falls."
Problem: The text explained sickling as charged → *oily*. Alanine is also oily (the figure's bead scheme even puts Ala and Val in the same class). A sharp reader will ask why alanine is harmless, and nothing answers. They are left thinking the lesson is arbitrary.
Rewrite (a domain reviewer should confirm the mechanism): "Even at the sickle position, a different swap, to alanine, is harmless.[^13] Alanine is oily too, but much smaller than valine, and it doesn't make the same sticky contact with the neighboring hemoglobin molecule. A lookalike change is not an identical one." If that cannot be stated confidently in one line, cut G-Makassar from the main text and drop its verdict card in the sandbox. Keep the generic "one amino acid swapped" card.

**5. Avidity is too much for Chapter 1, and the binding figure promises it without delivering it.**
Quote: bullet 3, "Many weak grips make a strong one… This combined strength is called avidity."
Problem: This is the fourth new binding term in about 340 words (affinity, cross-reactivity, avidity, plus concentration). Avidity is not needed until Chapter 3 (antibodies) and Chapter 9 (bispecifics). The figure's "Two arms" toggle is marked "build if time allows", so the bullet may have no visual support. The figure's `goal` lists avidity, but the step captions and `alt` never mention it.
Fix: Change the lead-in to "Two consequences follow, and both recur throughout this guide:". Delete bullet 3. Move a 40-word version into the "Affinity by the numbers" box ("Antibodies have two arms, so when one lets go the other holds… called avidity"). Remove "Two arms" from the spec, and remove avidity from the figure's `goal`. Keep the glossary entry but mark it "see Chapter 3".

**6. The section-ending claim is hard to parse.**
Quote: "That makes self powerful and adaptable, and, as we'll see, exploitable."
Problem: It is ambiguous what is powerful (the concept "self"?) and who exploits what. This is the payoff sentence of the section that sets up cancer, so it should be crisp.
Rewrite: "That makes the system adaptable, but it leaves a gap: anything that looks enough like self, including a cancer cell, may simply be ignored."

---

## Should fix

**7. Opening zoom is hard to picture.**
Quotes: "Start at your fingertip and zoom in, ten times at a time. Two jumps in, the skin becomes… each wrapped in a thin, oily skin."
Problems: (a) "ten times at a time" can be misread as "ten times, one at a time." (b) "skin" is used for two things in one sentence (fingertip skin and the cell's membrane). (c) "Two jumps in" does not match the figure. The figure starts at the hand, and the cell mosaic appears at stop 2.
Rewrite: "Start with your hand and zoom in, magnifying tenfold at each step. Two steps in, your skin resolves into a tightly packed pavement of cells, the smallest units of life: self-contained droplets of chemistry, each wrapped in a thin, oily film."

**8. Terms and cell types introduced cold in section 1 and the scale figure.**
Quotes:
- "Immune cells are among the smaller ones: a resting lymphocyte…" This is inaccurate (the figure's macrophage is 15–20 µm) and introduces lymphocyte, T cells and B cells with no hint of what they do. Rewrite: "Some immune cells are small: a resting {{lymphocyte}}, the family that includes {{t-cell|T cells}} and {{b-cell|B cells}}, is about 7 µm across."
- "Its building blocks are each well under a nanometer wide" then, in the figure, step 8: "Each bead is a single amino acid." Amino acids are not introduced until two sections later. Rewrite the text: "Its building blocks, small molecules called amino acids, are each well under a nanometer wide."
- Figure step 4: "…a large macrophage and a small T cell patrol the tissue." Add "two kinds of immune cell,": "…two kinds of immune cell, a large macrophage and a small T cell, patrol the tissue."

**9. Zoom figure (ch01-scale): trim the extras, fix a geometry slip.**
- The "If a T cell were your height" switch adds a second hypothetical scale on top of the real one. Fun, but it competes with the single idea. Cut it, or demote it to a post-tour easter egg. The "ladder" icon column (desktop only) is redundant with the slider ticks; cut it too. Keep: slider, +/−, "Take the tour", and the caption.
- The on-stage readout "Field of view: 100 µm" is jargon. Use "Width of view: 100 µm — a tenth of a millimeter".
- Stop 7: the spec says "One antibody fills most of the frame", but the FOV is 10 nm and an antibody is 12–15 nm, so it cannot fit. Show the arm tip meeting the spike tip. Rewrite step 8: "The very tip of one antibody arm gripping the tip of one spike. Each bead is a single amino acid, less than a nanometer wide. This patch, a few nanometers across, is where recognition happens."

**10. Two small overstatements in the city section.**
Quotes: "A city has planners, roads and traffic lights; a cell has none, and nothing inside is steered." and "most of the immune system's action happens here, at the surface."
Problems: Cells do have tracks and motor proteins that haul big cargo, and a biologist will notice. Killing, for instance, happens inside the target cell, so "most of the action" is loose.
Rewrite: "…a cell has no planner, and the small molecules that matter in this guide aren't steered at all. (Cells do run delivery tracks for big cargo.) They simply jiggle…" and "…As you'll see, the immune system does its recognizing here, at the surface."

**11. Sickle-cell paragraph: tighten for first-timers, and plant the "typo" metaphor.**
Quotes: "built from four protein chains, two of them 'beta' chains of 146 amino acids" and "There, a glutamic acid… is replaced by valine."
Problems: The other two chains are never named. It is not said that glutamic acid and valine are amino acids. "Typo" (the PLAN's canonical metaphor) first appears only after the figure.
Rewrite: "…a {{mutation|mutation}}, a typo in the recipe, can ripple all the way up…", "…built from four protein chains, two 'alpha' and two 'beta'. Each beta chain is 146 amino acids long.", "There, one amino acid, glutamic acid, which carries a negative charge and sits comfortably in water, is replaced by another, valine, which is oily."

**12. Opening: soften one hype phrase and add a confidence-builder.**
Quote: "…or the most dangerous thing of all: one of your own cells gone rogue."
Problems: "Most dangerous" conflicts with the PLAN's no-hype rule and with the chapter's own framing, where cancer is "the hardest case". The chapter is number-heavy for a first read. A sentence of reassurance would help a nervous reader.
Rewrite: "…and, hardest to spot of all, one of your own cells gone rogue." Add to the third paragraph: "You don't need to memorize any of the numbers: every idea returns, and every term is a hover away."

**13. Logic gap: why does a snug fit last longer?**
Quote: "Binding is a continuous dance of on and off, so affinity is really about *time*."
Problem: The text moves from "snugness" to "time" without saying why they are linked. It is the chapter's most important inference. The Go-deeper box says affinity blends on-rate and off-rate, so a pointer would also reconcile the simplification.
Rewrite: "…so affinity is really about *time*: the more contacts a pair shares, the less likely they are to shake apart all at once."

**14. Gene-to-protein sandbox: simplify and guide.**
- Bead classes: the spec has four (oily, polar, positive, negative). The text only teaches oily and charged. Use three (oily / charged / other) with an on-stage legend. Show full names (valine, histidine…) on hover or focus, since the strip uses 3-letter codes.
- Add three "try this" chips: a silent swap (GAG→GAA), the sickle change, and a stop (GAG→TAG). The current caption says only "Start with codon 6, GAG." A newcomer is faced with 27 tappable letters. Add a "Skip to the sandbox" link, because steps 1–5 re-narrate "The recipe book" almost verbatim.
- Step 5: drop the alpha chains and oxygen dots from the passive animation. Fold into one blob, and show four-chain assembly only when sickling needs it.
- Verdict cards: five rules is one too many (see #4). Keep silent, swap, stop and sickle.

**15. Binding sim: trim readouts and link to cross-reactivity.**
- Drop the rolling sparkline and its dashed "average" line (or tuck it under "Show history"). The big "7 of 12" number and the signal bar already show the idea. Ligands visibly coming and going shows the "dance".
- Rename "Loose" to "Look-alike (loose fit)" and "Wrong" to "Wrong shape". This gives cross-reactivity (bullet 2) a visible example. Add to step 3: "A look-alike binds, just less firmly. This is why one receptor can cover several targets, and sometimes mistake friend for foe."

**16. Census waffle chart: 11 cell types is too many to learn on first sight.**
- Default to "by place" (the surprising view: only about 2% in blood). Show "by type" second.
- In the default legend, merge the types the prose never introduces (eosinophils, basophils, monocytes) into "Other". Show the full 11 in the "Show numbers" table. The prose names about 8 types and the legend 11.
- Drop the optional body outline. Consider folding the weight view into one caption sentence unless an engineer can use it as a "wow".

**17. Quiz does not test the chapter's spine.**
Two of four questions are numeric recall: the 7 µm ÷ 12 nm arithmetic, and the census location question. Neither self/non-self, receptors, nor the one-letter→shape idea is tested. As the first quiz a reader ever sees, Q1 is also a unit-conversion trap, which is an unfriendly start.
Fix: Swap Q4 for a "self" question: "To the immune system's most specific cells, 'self' is…" → *the molecular shapes the body makes and has learned to tolerate* (distractors: a list written in DNA; anything inside the body). Swap Q1 for a conceptual scale item, or reword it as an easier ratio (e.g., "How many viruses fit across a T cell?"). Add a one-letter item: "A single DNA letter changes. What can happen?" → *Nothing, one amino acid changes, or the protein is cut short, depending on which letter and what it becomes.* Keep Q2 and Q3, which work well.

**18. Box placement and clinic-box intimidation.**
- "Reading the genetic code" (about 4 paragraphs on codons, start/stop, introns, frameshifts) belongs directly after the sandbox figure. Right now it sits after the sickle-cell clinic box, away from the figure it explains.
- The clinic box introduces "Lovotibeglogene autotemcel (Lyfgenia)" and "Exagamglogene autotemcel (Casgevy)" in a first chapter. Keep only the CRISPR one: "In December 2023 the FDA approved the first gene therapies for sickle-cell disease. One, Casgevy (exagamglogene autotemcel), is the first approved CRISPR medicine…" The take-away stays intact: take cells out, edit them, put them back, and Chapter 10 does this for immune cells.

**19. Glossary tags are spent in boxes, not in the main text.**
"Almost all of them are made in the bone marrow, from rare blood-forming stem cells" has no popover, because the tags `bone-marrow` and `hematopoietic-stem-cell` first appear in the clinic box. A box-skipper meets "bone marrow" and "stem cell" cold. Tag them at their first main-text occurrence. Also give "protein" a quick gloss at first use in section 1: "a protein shell (proteins are the cell's all-purpose molecular machines; more soon)".

---

## Optional

**20. Metaphor drift.** City: nucleus is the library, ribosomes are factories. Recipe: ribosome is the kitchen. Pick one (for example "ribosome kitchen" in the recipe section). The heading "The molecular handshake" and then "a hand in a glove" also mixes a mutual gesture with a one-sided fit.

**21. Unit anchors.** Add an everyday anchor at the first µm: "(a human hair is roughly 70 µm thick)". In the K<sub>D</sub> box, define "mole" ("a fixed, huge count of molecules, about 6×10²³"). A software engineer will want it.

**22. Ending.** The last paragraph is excellent. A single line opening a door into Chapter 2 would sustain momentum: "First, the fastest responders." Also soften "work *exactly* this way" for mRNA vaccines to "work this way".

**23. Repetition.** The census facts (2% in blood, macrophages about half the weight, 1.8 trillion) are stated in prose, figure steps, `alt`, clinic box, quiz, takeaways and glossary. Trim at least one prose repetition. Takeaway 1 is a string of numbers; better "Immune decisions are made at the scale of molecules, a few nanometers across."

**24. Paragraph length.** The sickle paragraph (6 sentences) and the third receptor paragraph (5) exceed the PLAN's 2–4 sentence guide. Split the sickle one at "That oily patch…".

**25. Minor overstatement.** "the most important idea in molecular biology" is hedged by "For our purposes", but "the most important idea in this guide" is safer.

---

## What to keep untouched

- The first paragraph and the "touch" thesis.
- "A cell is always counting."
- The caffeine example.
- The blood-count-as-cars-on-highways clinic box.
- The closing "altered self" paragraph.
- The sickle-cell storyline (once #4 is resolved).
