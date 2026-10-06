# Review 05: Reader-experience and clarity
Chapter 5, "Killers, Helpers and Brakes" (`content/drafts/05-t-cells.md`). Reviewed as a non-biologist who has read Chapters 1-4, then with an editor's eye. Main text is about 3,090 words (top of the PLAN range), deep-dives about 1,460.

## Overall impression
This is a strong draft. The thymus hook, the "school where almost everyone fails" framing, the PD-1 feedback loop and the "here is where the metaphor breaks" paragraph are the kind of writing the PLAN asks for. The main narrative is mostly self-sufficient, and the Go-deeper boxes are well chosen. Three problems cost the reader most. First, the central logic of thymic selection (why a weak grip on self is good and a strong one is fatal) is never stated. Second, a handful of sentences lean on jargon or on terms that are not yet defined, mostly in the kill paragraph, the Tregs and the exhaustion section. Third, the thymus and exhaustion figures, and to a lesser degree the brakes and kill figures, ask the reader to track far too many elements at once. Attention sags in the middle of "Why school is not enough" (numbers, new cells and a Nobel Prize in four paragraphs) and in "The conductors" (stacked metaphors, no payoff). The exhaustion section is the densest. The ending teaser is good but overclaims, and it plants a misconception that Chapter 6 then has to undo.

---

## Must fix (would lose or confuse readers)

**1. The key logic of selection is missing: why is a weak grip on self good and a strong one fatal?**
Location: "Exam one" paragraph and "Exam two" paragraph. Quotes: "A receptor that grips weakly earns a 'keep going' signal." and "A strong signal at this stage means 'die'".
Problem: A reader's natural reaction is "both exams are about gripping self, so how can a little be good and a lot be death?" The text never says why weak is the sweet spot. This is the conceptual heart of the chapter. The figure's three-zone meter ("No fit | Weak fit | Too strong") shows it, but the prose does not.
Suggested rewrite (insert after the "death by neglect" paragraph, and re-open Exam two with the same dial):
> "Why weak? A receptor that can just feel the body's own MHC molecules, each holding a harmless self-peptide, is one that can read MHC at all. When a foreign peptide sits in the same window later, that grip will tighten. So the thymus keeps the middle of a dial: no grip, no signal, death by neglect; a gentle grip, survival; a hard grip on self, death."
> Exam two opener: "**Exam two: do you grip yourself too hard?** Now read the same dial from the other end."

**2. Tregs and FOXP3 appear in the thymus figure before the reader has met them, and the main text never says the thymus makes Tregs.**
Location: `ch05-thymus` step 6 ("switches on FOXP3 and leaves as a regulatory T cell, a peacekeeper"), the "Strong, not lethal" Treg band, and the "of which became Tregs" counter. The next section then introduces Tregs as if new.
Problem: Undefined terms in a figure caption, and a broken thread: the reader cannot connect "peacekeepers" back to the thymus.
Fix: Cut step 6 and the Treg band and counter from the figure (see #8). Add one sentence in "Why school is not enough", just before "The peacekeepers are regulatory T cells":
> "Some of them come straight from the thymus: a few strongly self-reactive CD4 cells are spared there and given a different job."
Keep the detail in the existing deep-dive.

**3. The Miller paragraph invites a wrong reading.**
Quote: "...failed to reject skin grafted from other strains of mice. Without a thymus, the body had lost the ability to tell self from other."
Problem: To a non-biologist, "failed to reject" sounds like a good thing. The conclusion is also off: the mice did not lose a sense of self, they lost most of their immune defenses. The hook should land cleanly.
Suggested rewrite:
> "They had few white blood cells, wasted away, caught infections easily, and even accepted skin grafted from other strains, which a healthy mouse's body rejects as foreign. Without a thymus, the immune system barely worked."
Optionally add "(the T stands for thymus)" to "T cells come from" in the next paragraph.

**4. The synapse paragraph needs two or more reads and is eight sentences long.**
Quote: "Inside the T cell, the hub that organizes its internal tracks swings around to face the target, hauling along granules packed with toxic proteins, chiefly perforin and granzymes."
Problem: "hub", "tracks" and "granules" are all undefined, and the circumlocution for centrosome and microtubules is harder to parse than the technical term would be. Step 4's caption repeats it.
Suggested rewrite (split into three short paragraphs):
> "What follows is fast and precise. The T cell flattens against its target and rings the contact with sticky adhesion molecules, sealing off a tiny pocket called the immunological synapse. Whatever the T cell releases now stays aimed at this one cell.
>
> Next it aims. The T cell's interior is threaded with rails, and the point where they converge swings around to face the target, pulling along small sacs called granules that are packed with toxic proteins. The granules empty into the pocket.
>
> Two proteins do the damage. Perforin inserts into the target's membrane and assembles into rings that punch pores. Granzymes, protein-cutting enzymes, slip through them. [Keep the 30 s / 80 s / 2 min sentences.]"
Step 4 caption: "Inside the T cell, the point where its internal rails converge swings around to face the target, pulling packets of toxic proteins along."

**5. "Accelerator" is never assigned to CD28 before the car analogy needs it.**
Location: "The brakes", paragraphs 1-2. Quote: "So T cells carry not only accelerators but also brakes."
Problem: CD28 is called "a confirmation signal", then suddenly "accelerators" (plural), and the CTLA-4 paragraph later says "the accelerator is still there". The reader has to infer that CD28 is the accelerator. The figure's step 1 ("The accelerator is down") is also ambiguous: it reads as "broken".
Suggested rewrite:
> "...delivered when CD28 on the T cell grips B7 on the dendritic cell. CD28 is the accelerator pedal. With both signals the T cell activates... A process this explosive needs a way to stop, so T cells carry brakes as well. (The car analogy has limits, which we'll come to.)"
Figure step 1: "The accelerator is pressed."

**6. The closing teaser overclaims and plants a misconception.**
Quote: "A cancer cell is built from your own genes, and many of the T cells that might have recognized it most strongly were deleted in the thymus long ago."
Problem: This is true only for things cancer cells share with healthy cells. A mutated protein never appeared in the thymus, so T cells for it were not deleted. Chapters 6 to 12 depend on exactly that loophole. As written, a reader concludes cancer is essentially invisible, which blurs the hook for Chapter 6.
Suggested rewrite:
> "Cancer is a far harder case. A cancer cell is built almost entirely from your own genes, so most of what it displays is ordinary self, and T cells that react strongly to ordinary self were removed in the thymus long ago. Anything truly new on its surface, such as a typo in one of its proteins, escaped that filter. In Chapter 6, we'll see what can make a cancer cell different enough to be seen at all."

**7. The exhaustion section's main text has jargon, a non-sequitur and no landing.**
Quotes: "This epigenetic program locks the cell into a distinct, stable identity; without TOX, exhausted T cells don't form at all." / "only these progenitors responded".
Problems:
- (a) "epigenetic" is a barrier word in main text. The preceding clause already gives the plain meaning.
- (b) "without TOX, exhausted T cells don't form" reads as "so removing TOX fixes it?" with no explanation. In the cited study, cells lacking TOX fail to persist (please verify against Khan 2019).
- (c) "progenitors" appears with no link to "stem-like".
- (d) The point the whole chapter builds toward, that checkpoint drugs wake the reserve and do not revive locked cells, is stated only in the figure's step 5 and the deep-dive. Quiz Q4 tests it.
Suggested rewrite:
> "Exhaustion is not tiredness that rest can cure. Persistent stimulation switches on a protein called TOX, which changes which of the cell's genes can be read, and the change sticks. The cell settles into a stable new identity. (Cells that cannot make TOX don't become exhausted, but they don't last either.)"
> "...only these stem-like, or progenitor, cells responded..."
> New closing sentence: "So when a drug releases the PD-1 brake in a long fight, it does not revive the locked cells. It wakes the reserve. Chapter 8 picks this up."
Add a `key-idea` box with the same message.

**8. `ch05-thymus` is likely to overwhelm and its labels contradict the text.**
Elements as specced: 3 cortical cells, 4 medullary cells, a dendritic cell, a macrophage, I/II tags on every MHC cup, "4" and "8" badges on every thymocyte, a 5-state binding meter including the Treg band, rotating organ icons, a body silhouette, 4 counters, a 10x10 unit chart, a 1,000-cell stream, AIRE toggle, speed and pause.
Problem: Too much for a first-time reader. The zone labels also say "Cortex · Exam 1" and "Medulla · Exam 2", yet step 4 (and the text) delete cells in the cortex.
Suggested simplifications:
- One 3-zone meter ("No fit | Weak fit | Too strong") and three fates.
- Drop the I/II tags and 4/8 badges; show CD8/CD4 choice as a single recolor with a caption.
- Drop the Treg band and counter (see #2).
- Reduce counters to three.
- Show the AIRE toggle and rotating organ icons only from step 5 onward.
- Relabel zones by question rather than place: "Exam 1: can it read MHC?" and "Exam 2: does it grip self too hard?", with a small note that deletion also happens early.

**9. `ch05-exhaustion` is the heaviest figure and the least likely to read at a glance.**
Specced: up to about 60 individual cells, each with a 4-light function strip, 0-3 receptor badges and a padlock, two compartments, a 3-line time chart, 4 hover cards, and controls (segmented control, play/pause, restart, speed, locks switch, release button, experiments drawer).
Suggested simplifications:
- Cap at about 10 cells per compartment.
- Show function as one glow level per cell; keep the four named functions in the hover card.
- Padlocks appear automatically at step 3 (drop the "Show the locks" switch).
- Put "Remove the stem-like reservoir" as a visible button at step 5, not in a drawer.
- Drop the speed control.
- Memory cells need no badge.
The reader should leave with two pictures: acute ends and chronic does not; releasing the brake makes the reservoir burst.

---

## Should fix

**10. `ch05-brakes`: two gauges for one idea, plus too many switches.**
Problem: The signal ledger and the activity dial both show net activity. On top of those sit the B7 counter, two time scrubbers, a Treg switch, an "Infection cleared" switch, two knockout switches and three info chips.
Fix: Keep the ledger (it shows who pushes and who pulls) and drop the dial. Drop "Add a regulatory T cell" and "Infection cleared", which are covered by the text and the deep-dive. Keep one knockout switch per scene. Trim captions 3 and 4 to about 30 words.

**11. `ch05-kill` has nine steps plus extras.**
Fix: Merge steps 3 and 4 ("seal and aim"). Drop the "Targets killed" counter and the Fas switch (Fas is one sentence in the text plus the deep-dive); keep the target-type toggle.
Wording in captions and alt text:
- "CD8 co-receptor clamps the MHC" becomes "a second grip (CD8) steadies the contact".
- "scavengers" becomes "macrophages".
- "next victim" in the alt text becomes "next target".
- Move the 2-16 kills/day figure into the chip only.

**12. "The conductors" stacks three metaphors, and the helper-to-killer logic gap is answered only in a box.**
Quotes: "If killer T cells are soloists, helpers are conductors." / "Think of it as a countersignature: the killer's orders are signed off by a helper."
Problem: Soloists/conductors, "license" and "countersignature" arrive within six sentences. A helper reads class II and a killer reads class I, so the reader wonders how a helper's approval reaches a killer. The answer ("on the same dendritic cell") is only in the Go-deeper box, and it is essential.
Suggested rewrite (drop "countersignature"; bold all three jobs):
> "A dendritic cell can show two kinds of displays at once: class II boards that helpers read, and class I windows (through cross-presentation) that killers read. When a helper and a killer find their matches on the same dendritic cell, the helper gives it a go-ahead through direct contact: CD40 ligand on the helper grips CD40 on the dendritic cell. The 'licensed' dendritic cell turns up its confirmation signals and releases stimulating cytokines, and primes the killer far more strongly."

**13. "PD-L1 is not limited to dendritic cells" refers to nothing.**
Quote: "Its main partner, PD-L1, is not limited to dendritic cells."
Problem: The text said B7 sits on dendritic cells; it never put PD-L1 there.
Suggested rewrite: "B7 sits mainly on dendritic cells. PD-L1 can appear on almost any cell, from organ linings to tumor cells, whenever it senses IFN-γ." Then split the feedback loop into its own short paragraph (this paragraph is six sentences).

**14. "As few as three" has no scale.**
Quote: "as few as three matching peptide–MHC complexes on a target cell were enough to trigger a kill".
Problem: "complexes" is not explained, and the number means nothing without the denominator.
Suggested rewrite: "...as few as three matching peptides, among many thousands of ordinary ones in the target's shop window, were enough to trigger a kill." (Verify the denominator from Purbhoo 2004 or a standard MHC copy-number reference before choosing "many thousands".)

**15. The AIRE numbers are heavy, uncontextualized and mixed with expert hedging.**
Quote: "Collectively, the thymus's structural cells in mice can switch on up to about 19,000 protein-coding genes, more than any other cell type known, and AIRE alone turns on roughly 4,000 of them. (AIRE isn't the only such switch, but it is the best understood.)"
Problem: There is no denominator (the reader has no idea how many genes a mouse has), a superlative cannot be checked, "structural cells" is vague (these are epithelial/supporting cells), and the parenthetical is for experts. "thyroglobulin" is also unnecessary jargon in the preceding paragraph.
Suggested rewrite: "Together, these cells in mice switch on nearly all of the roughly 20,000 genes that code for proteins, and AIRE alone accounts for about one in five of them." Move the parenthetical and the superlative into a deep-dive (the figure already encodes "AIRE isn't the only switch"). Replace "thyroglobulin in the thyroid" with "thyroid hormone precursors".

**16. Repetition.**
- "3 percent / 97 percent die inside" appears almost verbatim in the main text and again in the deep-dive's second paragraph. Let the deep-dive begin with what is new (the tracer method, double-positive cells).
- "Brakes protect organs, so releasing them causes autoimmune-like side effects" appears in the post-figure paragraph, the key-idea, the clinic box and the takeaways. Cut the clinic box's last clause or the key-idea's final sentence.

**17. Quiz: lopsided coverage and a recall question.**
Problem:
- Nothing tests the killing mechanism, helpers or Tregs. Two of four questions are about the thymus.
- Q2 (AIRE) tests the recall of a name. Distractor 3 ("kills infected cells inside the thymus") is a straw man and distractor 1 tests Chapter 3.
- In all four questions the correct option is the longest, and it is in position B in three of four (please randomize or reorder).
- Q4 option 2 uses "epigenetic", which the main text should no longer teach.
Suggested replacement for Q2:
> Q: A killer T cell has recognized an infected cell. Which description is right?
> - [ ] Perforin pores let the cell burst open and spill its contents — Perforin only makes pores; bursting would cause inflammation.
> - [x] Granzymes enter through the pores and switch on the target's own self-destruct program, and the T cell moves on unharmed — The target packages itself into tidy fragments that macrophages clear.
> - [ ] The T cell engulfs and digests the target — Killer T cells poison by contact; macrophages do the engulfing afterwards.
Fold AIRE into Q1, or add a scenario variant: "A child is born with a broken AIRE gene. Which is most likely?" (answer: T cells that attack several organs escape the thymus).

**18. The Treg paragraph is overloaded.**
Quote: "Tregs soak up a growth signal that other T cells need, release calming cytokines (...), and use a brake molecule, which we will meet shortly, to disarm the cells that activate T cells."
Problem: Three mechanisms, an inline definition and a forward reference share one sentence. "The cells that activate T cells" is dendritic cells, which the reader already knows by name. "IPEX" is an unexplained acronym. "Peacekeepers" is also in tension with PLAN §2, where Tregs are "corrupt guards" in tumors, so the reader gets no bridge.
Suggested rewrite: "Tregs work in three ways. They soak up IL-2, the growth signal other T cells need. They release calming cytokines. And they use CTLA-4, a brake molecule we'll meet shortly, to disarm dendritic cells." Add to the end of the paragraph: "(In Chapter 7 we'll see tumors recruit them.)" Drop "IPEX" or say "a rare disease called IPEX".

**19. Style: paragraph and caption length (PLAN §2).**
Paragraphs over four sentences: the T-cell receptor recap (5), "Exam one" (6), AIRE (5), "Even this exam leaks" (5), peripheral tolerance (5), scurfy (5), the kill paragraph (8), broadcasting (5), the three helper jobs (5), CTLA-4 (6), PD-L1 (6), "metaphor breaks" (6), "when the fight never ends" (7). Split at natural breaks.
Figure captions are mostly 40-55 words where 25-35 works better: thymus steps 2, 5, 6; kill steps 2, 5, 7, 8; brakes steps 3, 4; exhaustion steps 2, 4, 5. Move statistics into chips or hover cards.

**20. The male-protein example takes too much working memory.**
Quote: "For a protein made only by male cells, T cells that recognize it were only about three times rarer in men, for whom it is self, than in women, for whom it is foreign."
Suggested rewrite: "In one study, researchers counted T cells that recognize a male-specific protein. For men it is self; for women it is foreign. Yet men had only about three times fewer of these T cells than women." Then keep the next sentence ("Deletion prunes... it does not empty it.").

---

## Optional
- **Hype and hedging.** "The toll is staggering", "astonishingly sensitive", "cleverest trick", "elegant feedback loop" and "devastating autoimmunity" are mild but off-voice for "no hype"; plain verbs would do. The ending asserts that "exhaustion keeps an endless fight from consuming the body", while the earlier text hedges ("many immunologists now see"). Re-hedge: "exhaustion may keep...".
- **TNF** is named in the "broadcast" paragraph and appears in the exhaustion figure's lights, but is never explained. Add "(TNF, an inflammatory signal that can also kill some tumor cells)" or cut it from the main text.
- **Callback.** In "The kill", say the target switches on "the same self-destruct program thymocytes use" to tie the chapter's two halves together.
- **Th1.** Expand "Th" once ("T helper"). Soften takeaway 4 ("Th1 helpers matter most against tumors") to "are the helper type most associated with tumor control".
- **Reshuffling parenthetical** (the "school analogy needs one correction" paragraph) contradicts "no signal, death within days" for a reader who just learned it. Move it to the deep-dive.
- **Key-ideas.** There are only two key-idea boxes for 3,000 words. Add one after the kill ("A killer T cell kills by contact and talks the target into destroying itself; the T cell survives") and one for exhaustion (see #7). Also: the opening roadmap omits exhaustion, and gene names are italicized (*Foxp3*) without saying why.

## Keep as is
The Miller opening and "the dying was the point"; the school/exam framing (with the correction); "a rehearsal of the whole body"; "Deletion prunes; it does not empty"; the scurfy story; "Killing in real tissue is slower and more of a team effort than it looks in a dish"; the IFN-γ "remember this" hook; the PD-1 feedback-loop paragraph; "Here is where the metaphor breaks"; "negotiated truce". Metaphors match PLAN §2 (shop window, evidence board, search query, photocopy, two-factor authentication, brakes, with the break flagged).
