# Chapter 4, "How T Cells See": reader-experience review

Reviewed: `content/drafts/04-presentation.md` against PLAN §1-3 and the ch1-3 drafts. Reader persona: a software engineer whose parent has cancer, who has read chapters 1-3.

## Overall impression

The spine is excellent. The invisible infected cell, "strings, not sculptures", the shop window, the "mirror image" evidence board, and the anergy twist ("recognition without corroboration produces disarmament") are the kind of moments a non-biologist remembers. The abacavir box is a real hook. But the chapter asks for about ten new ideas, roughly 35 terms and three dense figures in one sitting, and the main text uses too many overlapping images for one molecule (hand, easel, card, cup, platform, groove). Attention sags in the pathway paragraph (new organelles plus four numbers in a row) and in the lymph-node search, where "random contact is still enough" is asserted rather than shown. The tumor/anergy argument also seems to contradict the cross-presentation story the reader just absorbed. Two figures (`ch04-dc-journey`, `ch04-two-keys`) each carry more than one idea and need splitting or staging. The ending is competent but does not pull the reader into Chapter 5.

Main prose is about 3,050 words, plus about 1,300 in boxes. The length is fine; the density is the problem.

---

## Must fix (would lose or confuse readers)

**M1. Too many images for one molecule, and "hand" collides with ch3.**
- Locations:
  - Para 1: antibodies are "each a hand looking for its glove".
  - "The window problem": "the display molecule is the easel"; MHC is "like a hand holding up a single card".
  - Shop window: class I molecules "held open like hands expecting a card".
  - Bjorkman paragraph: "The easel had come with the card still in place."
  - Figures: "cup".
  - ch3: "molecular platforms".
- Problem: in four paragraphs MHC is an easel, a hand, a groove, a cup and a platform, and a "card" is something it holds up or is plugged by. The reader cannot tell which image to keep. "Hand" is also the antibody in the opening paragraph, so one chapter has hands on both sides of the recognition event.
- Fix: pick one concrete image, a small cup with a groove (this matches the figure and the PLAN palette), and one noun for the peptide in it. Reserve hand-and-glove for ch3 antibodies. Suggested rewrite of the second half of "The window problem":
  > "T cells read *strings*, and only when a string is being held up for them. The holder is a molecule called MHC (*major histocompatibility complex*, a name inherited from transplant biology that tells you nothing about what it does). Picture a small cup on the cell surface with a groove running along its top. A peptide lies in that groove, facing outward, where a passing T cell can touch it."
- Then change "held open like hands expecting a card" to "Empty class I cups wait with their grooves open." Change the Bjorkman line to "The cup had come with something already lying in it."
- Related (ID badge): ch2 told the reader to think of class I as an "ID badge" and promised "Chapter 4 opens them up properly". Add one sentence to the shop-window opening: "In Chapter 2 we called class I an ID badge. It turns out to be a badge that carries a message." Without it the reader wonders whether badge and window are two different things.

**M2. "Anchors" and "chemistry" are used but never explained.**
- Locations:
  - "Fit means length and chemistry: a class I groove is closed at both ends…"
  - Step 4 caption: "the right chemistry stays put".
  - "Your personal edition": "If a virus mutates the residue that anchors a peptide in my groove, it has hidden from me and not from you."
- Problem: "chemistry" is a placeholder, "residue" is jargon, and "anchors" appears with no setup. The chapter's best insight (a viral typo hides it from some people and not others) rests on a concept the main text never gives.
- Fix, in the shop-window section:
  > "Fit means two things. First, length: a class I groove has walls at both ends, so it holds a peptide of a very specific length, usually 8 to 10 amino acids. Second, pegs: the groove has a few small pockets, and the peptide's end amino acids must slot into them. A fragment with the wrong pegs is released."
- Then in "Your personal edition": "If a virus changes one of the 'pegs' that holds a peptide in my groove, that peptide is no longer displayed for me. It may still be displayed for you." Change the step 4 caption to "…the right length, with the right end amino acids to fit the pockets…".

**M3. The TAP / ER sentence is hard to parse, and "ER" appears in the figure but not in the text.**
- Quote: "The survivors are pumped out of the cell's main compartment by {{tap-transporter|TAP}}, a gate in the wall of the endoplasmic reticulum — the internal workshop where new membrane proteins are assembled. Inside, empty class I molecules wait…"
- Problems:
  - "Pumped out of the main compartment by a gate in the wall of X" reads as if the peptides leave toward the outside.
  - "Inside" is ambiguous.
  - "Main compartment" is vague, and ch1 never introduces the ER (zero mentions).
  - The text never writes "(ER)", but the figure labels it "ER".
  - The ER is new, the empty class I molecules just appear there, and there is no glossary entry.
- Suggested rewrite:
  > "The survivors need to reach the cell's assembly area. A gate called TAP pumps them into the **endoplasmic reticulum (ER)**, the internal workshop where new surface molecules are built. Empty class I cups are waiting there, grooves open. They test peptide after peptide and release almost all of them; only a fragment that fits snugly stays."
- Add an ER glossary entry. Consider cutting "TAP" to a parenthetical, since the figure labels it.

**M4. The lymph-node search: the logic leaps, the numbers contradict the narrative, and the notation is hostile.**
- Quotes:
  - "the answer comes out at **one matching cell per 10⁴ to 10⁶ naive T cells** … in mice, somewhere between about 15 and 1,100 cells in the entire animal … with a strikingly similar range measured in humans."
  - "approaching and departing speeds were equal, so encounters happen by chance."
  - "Run that for a day across hundreds of nodes, and an impossible-sounding search becomes routine."
- Problems:
  - Scientific notation for a general reader. ch3 already said "1 in 200,000", yet this section says "we will put a number on it shortly" as if new.
  - "Strikingly similar range … in humans" is ambiguous: frequency or absolute count? A human has far more T cells than a mouse.
  - "Equal approach and departure speeds → chance" is a non-obvious inference, stated without its premise.
  - "Across hundreds of nodes" contradicts the previous section, where the dendritic cell crawls to *the nearest node*. A reader does the arithmetic (a few thousand contacts an hour against 1 in 100,000 odds) and finds the payoff is not shown.
  - "Two-photon microscopy" is jargon the reader does not need.
- Suggested rewrite of the first two paragraphs. Writer: confirm the human frequency framing and the dendritic-cell-per-node logic against refs 16-18.
  > "Chapter 3 gave one example: about 1 in 200,000. Across many peptides the range is roughly 1 in 10,000 to 1 in a million naive T cells. In a mouse, that is as few as 15 to about 1,100 cells in the entire animal for a given target."
  >
  > "The node solves this by brute force. Naive T cells stream in from the blood, wander through the node's dense mesh, and leave hours later. Dendritic cells stay put and reach out into the traffic. Under the microscope, contacts were brief, about three minutes. And the T cells were not being drawn in: if they were, they would arrive faster than they leave, and their speeds in and out were the same. They simply bump into each other. Even so, one dendritic cell touches a few thousand T cells an hour, tens of thousands in a day, and many dendritic cells carrying the same cargo share the work while fresh T cells keep arriving. Over a day or two, a node can screen millions of cells."
- Drop "two-photon microscopy" or move it to a box.

**M5. Figure `ch04-dc-journey` carries five ideas and five controls, sits far from the text it illustrates, and misrepresents the rarity it exists to convey.**
- Inventory (from the spec):
  - Three zones.
  - Danger toggle with four simultaneous maturation changes.
  - Source segmented control (infected vs ate tumor).
  - Cross-presentation switch.
  - Sampling slider (1x-20x).
  - "Find the match" and reset.
  - Two counters plus a "matching: 1" line.
  - CD4 and CD8 matches.
  - Class I and class II boards.
  - Clonal expansion.
- The `goal` has five "understands that…" clauses, against PLAN's "each figure teaches ONE idea".
- Placement: the figure sits after "The search", but its most important toggle (cross-presentation) belongs to the "Cross-presentation: the loophole" section, which has no figure at all.
- Scale problem: the sim has about 400 T cells with exactly one match (1 in 400), while the text says 1 in 100,000 to 1,000,000 and "a few thousand per hour". At the real rate the reader would find the match in minutes at 1x, so they would not "wait and feel the problem". The central quantitative message is undercut.
- Suggested split:
  - **Figure A, "Scout and courier"** (tissue → maturation → node). Danger toggle plus the four maturation annotations only. Cut the source control.
  - **Figure B, "Needle in a haystack"** (node crowd, sampling slider, find-the-match). Add a visible rarity label such as "In this demo: 1 in 400. In a real node: about 1 in 100,000. This demo is about 250x easier than reality." Consider letting the slider rescale the crowd instead of the speed.
  - **Cross-presentation**: a small two-state figure (OFF/ON) placed inside the cross-presentation section, with the dead-tumor-cell source only. This is the chapter's most important idea and currently has only a text box.
- If the figure stays whole, make "DC ate a dead tumor cell" the default, hide the sampling slider in a disclosure on desktop too, and use progressive reveal (maturation first, then the node).

**M6. Figure `ch04-two-keys` is the densest control surface in the chapter and mixes two lessons.**
- Inventory: a left panel with a groove, three pockets, a 8-10-bead peptide, anchor beads, and a six-loop TCR with three outcomes; a right panel with a 4x5 grid (20 icons); three preset TCRs; person, peptide and escape-toggle selectors; reset; and grid-click-to-select.
- The `goal` bundles two ideas (the TCR needs peptide and groove together; different people display and read differently, so transplants and vaccines must be personal).
- A non-biologist will not know where to start. The three teaching asymmetries are good, but the reader should reach them in order, not by wading through four selectors.
- Suggested staging (three steps, one control each):
  1. One person, one peptide: "Does it fit the groove?" Outcomes: displayed / "not displayed at all".
  2. Add one T cell: "Can it read what's displayed?" Outcomes: "recognized" / "displayed, but this T cell can't read it".
  3. Reveal the grid. Use 3 people x 3 peptides (not 4 x 5), one T cell, and a "Swap to a different T cell" button instead of three presets.
- Move "Show the virus's escape move" to a final step or a caption-driven demo.
- Keep the plain outcome labels as written; they are the best microcopy in the specs.
- Reduce pockets to two and TCR loops to three. "Shape not color" is already respected, so this loses nothing.

**M7. The transplant claim is a leap, and "allele" is undefined.**
- Quotes:
  - "the IPD-IMGT/HLA reference database passed **43,000 distinct alleles across 47 genes** by early 2026"
  - "HLA differences are the main reason transplanted organs and donor marrow are attacked, and why matching donors is so laborious."
- Problems:
  - "Allele" appears nowhere earlier (zero mentions in ch1-3).
  - The database name is clutter in the main text.
  - The transplant sentence is asserted as the payoff of the chapter ("the mechanical reason transplants are rejected" in the figure's `goal`), but nothing explains why a donor's HLA would be attacked, given that T cells are trained on *your* HLA. The reader is left with a non-sequitur.
- Suggested rewrite:
  > "Across humanity those genes come in thousands of versions, called alleles. Catalogs now list more than 43,000 variants of about 47 HLA genes, and the list is still growing."
  >
  > "A transplanted organ carries its donor's HLA. To the recipient's T cells, the donor's HLA holding ordinary donor peptides looks like a shape they have never seen, and a surprisingly large fraction of T cells react to it. That is why donors are matched as closely as possible, and why transplant patients take drugs that damp T cells."
- Writer: verify the "surprisingly large fraction" claim and the immunosuppression wording.

**M8. The tumor/anergy argument contradicts the cross-presentation story, and the figure and quiz inherit the problem.**
- Quote: "A young tumor is built of the patient's own cells, growing without necessarily causing alarm: a landscape rich in signal 1 and poor in signal 2. The T cells that could recognize it are not merely failing to find it; many are being actively taught that it is self."
- Problem: two sections earlier, the reader learned that dendritic cells prime killers against tumors via cross-presentation. Now tumors silence T cells. Which is it? The reader is also told naive T cells circulate between blood and lymph nodes. The figure's "Tumor cell" and "Healthy body cell" presets, and quiz Q4 ("meets its exact peptide on a resting cell in healthy, uninflamed tissue"), show a naive T cell meeting a tumor or body cell directly in the tissue, which this chapter's own geography says is not where naive cells go.
- Fix: say where the missing signal 2 occurs. Suggested rewrite:
  > "From a cancer patient's point of view, this safeguard cuts the wrong way. A tumor that grows quietly gives dendritic cells plenty of its material but no danger signals. A dendritic cell that carries tumor material without maturing offers signal 1 with no signal 2, and the T cells that read it can be put to sleep instead of switched on."
- Soften "many are being actively taught" to "some can be". Rename the figure presets "Resting dendritic cell carrying tumor debris" and "Resting dendritic cell carrying a harmless self-protein". Reframe quiz Q4 around a *resting dendritic cell* in quiet tissue. Flag this item to the science reviewer as well.

---

## Should fix

**S1. The "shuttered window" scenario and the NK pincer are essential but hidden in a box.**
- Location: the figure's fourth scenario and caption ("a cell that has stopped displaying altogether"); the box "How a virus shutters the window".
- Problem: the main text never says cells can hide their windows or why that is risky. The figure introduces it cold, and the cancer payoff ("a pathogen or tumor must solve both problems at once"; Chapter 7's theme) sits in a collapsed box.
- Fix: add 3 sentences after the neoantigen paragraph:
  > "Viruses and tumors know this. Many make their cells pull class I off the surface or jam the TAP pump, so the window goes dark. But a dark window is itself a signal: the NK cells from Chapter 2 attack cells whose windows go missing. Hiding from killer T cells exposes a cell to NK cells."
- The box keeps the HSV/ICP47 and cytomegalovirus detail.

**S2. Class I vs class II is the most confusable pair in the chapter and has no side-by-side.**
- Four contrasts (inside vs outside, 8-10 vs 13-25 amino acids, CD8 vs CD4, every cell vs professionals) are spread over 600 words and a box. The sentence calling the pairing "worth memorizing" is the right instinct, but nothing helps the reader memorize it.
- "Professional antigen-presenting cells" is never explained (why "professional"?).
- The shop-window section never says *who reads it*; CD8 first appears 900 words later.
- Fix:
  - Add a compact 2x2 table after the bullets: columns Class I / Class II. Rows: metaphor; found on; shows; peptide length; read by; what that T cell does.
  - Add to the class I opening: "(Its readers are the killer T cells, formally CD8 T cells; more below.)"
  - Add: "'Professional' because presenting is their full-time job: only these cells also carry the confirmation signals described later."

**S3. Where the metaphors break is buried in a box whose title mixes two topics.**
- The key caveat (no shopkeeper; not a fair sample; the display is mechanical) lives in the last paragraphs of "The class II assembly line, and where both metaphors break". PLAN §2 requires the introducing chapter to state where the analogy breaks. A reader who skips the class II box (as most will) misses the break.
- Fix: promote two sentences to the main text after the neoantigen paragraph:
  > "(Where the analogy breaks: no shopkeeper chooses what goes in the window. The display is the mechanical output of shredding and fitting, which is why a virus cannot be talked out of advertising itself.)"
- Split the box: "How class II is loaded" and a short "Where the metaphors break".

**S4. Two section headings are misleading.**
- "The window problem" appears *before* the shop window exists. The reader wonders what the "window" is. It also repeats the opening's "street" image in a muddier form. Rename it "Strings, not sculptures". The text already earns that title.
- Minor: also clarify the contrast. An epitope (ch3) is "a few amino acids on a protein's surface" and a peptide is "a handful of amino acids", which sound identical. Add: "The amino acids in a peptide are neighbors along the chain. An epitope's can be far apart along the chain and meet only after the protein folds." "Handful" also undercounts 8-25; say "roughly 8 to 25".
- "Two keys turned at once" collides with "Two-factor authentication" later, and with ch3's key/lock imagery. The reader will guess "two keys = signals 1 and 2". Rename the section and figure "One target, two parts" or "Peptide plus groove".

**S5. Maturation: text and figure disagree, and a cross-reference is wrong.**
- Quote: "it **pushes its display to the surface and keeps it there**, so a matured dendritic cell can carry on the order of two million class II molecules outside, and switches on a second set of surface molecules that provide {{costimulation}} — the subject of the next section".
- Problems:
  - The text lists three changes; the figure annotates four. The fourth is hidden inside bullet 2.
  - Costimulation is not "the next section" (that is "The search"); it is two sections away.
  - "A one-way, whole-personality switch" is cute but vague.
- Fix: split bullet 2 into two ("it **pushes its display to the surface and keeps it there**…" and "it **switches on confirmation signals** (costimulation, explained under 'Two-factor authentication' below)") so the text matches the figure's four changes. Replace the phrase with "a one-way switch that takes a day or two".

**S6. The cross-presentation history sentence is unreadable, and the claim is overstated.**
- Quote: "mice primed with cells from one strain mounted killer responses that only made sense if some of the host's own cells had taken up the foreign material and displayed it on their *own* class I molecules."
- Suggested rewrite:
  > "In 1976 Michael Bevan saw something that should not have worked. Killer T cells were being primed by material from foreign cells, yet only the host's own cells could have shown it to them. His conclusion: some host cells were taking up foreign material and displaying it on their own class I molecules."
- "Reoriented a field" is hype-adjacent.
- Hedging per PLAN §2: the takeaway says cross-presentation is "the only reason killer T cells can be primed against tumors", and the key-idea box says it makes anti-cancer immunity "possible at all". Direct presentation by infected dendritic cells exists for viruses, and the chapter itself says dendritic cells that make tumor protein are rare. Prefer "the main route".

**S7. The two-factor section has several small comprehension problems.**
- Heading says "two-factor" but then adds Signal 3. The figure is titled "Two-factor authentication" with three toggles. Add one sentence: "Signals 1 and 2 are the two factors. Signal 3 is not a security check; it is a briefing on what to do next."
- "The experiment that nailed this is clean and old." The experiment is never described. Add one sentence: "In a dish, T cells shown a peptide on cells that lacked B7 stopped responding; adding a CD28 signal prevented it."
- "a major part of peripheral {{tolerance|tolerance}}, the standing agreement not to attack the body." This defines tolerance, not "peripheral". Rewrite: "…a major part of *peripheral* tolerance, the silencing of self-reactive T cells out in the body, as a backstop to the screening in the thymus (Chapter 5)."
- "A brake beside the accelerator, competing for the same fuel." The mix of brake, accelerator and fuel is muddled. Replace with: "A brake wired to the same dock: two receptors competing for the same B7 molecules, one pressing go and one pressing stop." (PLAN canon is "brake".)

**S8. Figure 1 and its adjacent text repeat each other, and the numbers do not match.**
- Text paragraphs 2-4 of "The shop window" and the six step captions are near-verbatim (shredding, 0.02%, TAP, 8-10 aa, 200,000). The reader reads the pathway twice back to back.
- The text says "only about **0.02%** … survive" (about 1 in 5,000), while the spec says "roughly four in five beads should fade" (20% survive). Without a note, the reader sees 80% disappear and wonders about the 0.02%.
- Fix:
  - Keep the numbers in the text; let the captions carry the "what you're seeing" version.
  - Add to the step 2 caption: "Here about 1 in 5 survive so you can follow them; in a real cell it is closer to 1 in 5,000."
  - Say "about 1 in 5,000" beside 0.02%.
  - Split the step 6 caption into two sentences: "Now a passing killer T cell can read the display by touch." / "Switch between the four scenarios to see what the window says in each case."
- Also check that the first scenario ("Healthy") is the default on load, so the reader sees a normal window before any shock.

**S9. Quiz: ambiguity in Q2 and a coverage gap.**
- Q2 stem: "Two friends catch the same virus." The explanations then claim "the question specifies that both friends are infected" and "the same virus and the same peptide". The stem says neither. A careful reader can defend options 1 and 2 (the "wrong" explanations lean on facts the stem does not state). Those two distractors are also eliminated by re-reading the stem, which tests reading, not understanding.
- Suggested stem: "Two friends are infected with the same virus, and the infected cells of both make the same viral protein. A T-cell clone that reads one particular peptide from that protein in friend A is transferred to friend B, where it ignores the infected cells. Why?"
- Replace the two stem-eliminated distractors with ones that reflect real misconceptions:
  - "Friend B's proteasomes shred the protein into different pieces — wrong: the shredding is broadly similar; the difference is which fragments each person's HLA grooves can hold."
  - "T-cell receptors only work inside the body that made them — wrong: the receptor works anywhere; what differs is the holder it must read."
- Coverage: the chapter says class I/II and CD8/CD4 are "worth memorizing", yet no question tests it. Suggested Q5: "A dendritic cell eats a bacterium in a wound. Which T cell can read the fragments it displays, and on which molecule?" Correct answer: a CD4 helper T cell, on MHC class II.
- Minor: in Q1, the correct answer is the longest and most specific option. Shorten it or lengthen the distractors.

**S10. The ending is a single 90-word sentence, then a procedural teaser.**
- Quote: "Every cell publishes short samples of its own contents, using display molecules so variable between people … that cell commits only if recognition arrives with corroboration."
- Problem: the summary sentence is too long to hold. "…the one T cell in a hundred thousand" also silently drops the 1-in-10,000-to-1-in-a-million range. The close ("What they do next … is Chapter 5") announces, but does not promise, anything. ch3 ended on a cliffhanger; ch4 should too.
- Suggested rewrite:
  > "Every cell publishes short samples of its own contents. The display molecules vary so much between people that no two of us advertise quite the same thing. Dendritic cells collect samples, freeze them when danger confirms trouble, and carry them to a lymph node. There, a chance-driven search introduces the cargo to the one T cell in a hundred thousand that can read it, and that cell commits only if recognition arrives with corroboration."
  >
  > "It is a system for making decisions about the interiors of cells, built entirely out of touching."
  >
  > "Now a few thousand killers are dividing in the node. Each carries a receptor for one fragment, and a rule: never fire at the wrong target. How does a T cell kill a cell without spilling it, and what stops it turning on you? That is Chapter 5."
- Also: "licence" should be "license" (US spelling).

**S11. The "Inside the loading dock" box is a wall of names with little payoff.**
- It names TAP preferences, tapasin, calreticulin, ERp57, TAPBPR, ERAP1, defective ribosomal products and the immunoproteasome in seven paragraphs. Undefined in-box: "ATP-driven", "aminopeptidase", "conformational change", "ribosomal". (Neither ATP nor ER appears anywhere in ch1.)
- Fix: lead each paragraph with the "so what" and keep two or three names.
  - Keep: Townsend 1986 (history), "where peptides really come from" (the DRiP point is the most surprising idea), and the immunoproteasome (the inflammation link).
  - Compress tapasin/TAPBPR/ERAP1/quality control into one "editing" paragraph: "A team of chaperone proteins in the ER keeps the grooves open, trims peptides that arrive too long, and favors peptides that bind tightly."
  - Gloss ATP once: "ATP, the cell's energy currency".

---

## Optional

**O1. US spelling.** Line 13 "pavement" → "sidewalk" (also the only British image in the opening). Line 276 "Coeliac" → "Celiac". Line 501 "licence" → "license". "greyed" (figure 3 spec) → "grayed".

**O2. Make the scout and courier explicit.** The dendritic cell is never called a scout or courier in the main text of "The scouts". The heading and the closing paragraph do the work, but PLAN §2 asks analogies to be flagged and, where relevant, to say where they break. Suggested line: "Think of the dendritic cell as a scout who becomes a courier. (It doesn't decide to go: the trip is triggered by the danger signals it detects.)" Consider "briefing room" for the node once.

**O3. Gloss "strain" in the Zinkernagel-Doherty story.** "From a mouse strain genetically matched to the one the T cells came from" will lose a non-biologist. Rewrite: "The T cells killed virus-infected cells from the same inbred mouse line, but not infected cells from a different line, even when both carried the same virus."

**O4. Subtitle and opening overclaim.** The dek says the sample is "the only reason an infected or mutated cell can ever be caught". But ch2 has NK cells catching cells through missing self and stress ligands, and ch3 has antibodies catching surface proteins. Try "the main way T cells can catch an infected or mutated cell". The opening's "every cell in your body" vs "essentially every cell with a nucleus" later is a small inconsistency; use "nearly every cell" in the opening paragraph.

**O5. Sentence and paragraph length (PLAN: 2-4 sentences, plain).** Candidates:
- Opening para 3: split it. "This should be a fatal gap. Viruses live inside cells, and cancer begins as a change in a protein inside a cell. It isn't one, because of a strange arrangement: **every cell in your body is required to publish a continuous sample of its own interior.**"
- "The node solves this by brute-force sampling…" (five sentences, six numbers; see M4).
- The "Read that again" paragraph (five sentences; consider cutting "Read that again, because it is…" to "That is the opposite of what you would expect from a defense system.").
- "Which audience reads which board is fixed, and worth memorizing" intro.
- Tone: "the physics are lovely" and "reoriented a field" are the only two places the prose reaches for admiration. Cut or earn them.

**O6. Glossary gaps and duplicate IDs.** No entries for endoplasmic reticulum (ER) or allele. IDs `peptide`, `mhc`, `tcr`, `tolerance`, `lymph-node`, `clonal-expansion` are defined in both ch3 and ch4 with different wording. Pick one canonical wording and let the glossary builder dedupe, so the popover is the same everywhere.
