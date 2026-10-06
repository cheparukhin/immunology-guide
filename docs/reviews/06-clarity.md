# Review 06: Reader-experience and clarity
Chapter 6, "When Cells Go Rogue" (`content/drafts/06-cancer.md`). Reviewed as a non-biologist who has read Chapters 1-5, then with an editor's eye. Main text is 3,260 words (target 3,000); the five deep-dives total about 1,400; 35 sources.

## Overall impression
The best parts are very good. The eyelid-skin hook, the Rosenberg patient, "a neoantigen is a partnership between a mutation and an HLA type", the "two problems: context vs recognition" signpost and the closing "view from the T cell" are exactly the voice the PLAN wants. The chapter is accurate and its ideas are in a sensible order. Its weaknesses are (a) the accelerator/brake metaphor collides with Chapter 5's own use of the same words, and the disambiguation arrives late; (b) the main narrative leans on deep-dive boxes and figures in several places (APC/colon, G12D, the patient's relapse), so it is not quite self-sufficient; (c) the second half, especially "Counting the typos", turns into a data dump with three names for one concept; and (d) three of the four figures are overloaded for a first-time reader. The first half is mostly flat explanation after the hook (hallmarks, "society of cells") and the energy only returns at the Rosenberg story. Cuts of about 500 words are available without losing anything the reader needs, and the fixes below add back about 170.

---

## Must fix

**1. The accelerator/brake metaphor collides with Chapter 5, and the warning comes too late.**
Location: heading "Stuck accelerators and broken brakes"; the `key-idea` box that follows the "Two hits, many steps" deep-dive.
Problem: Chapter 5 already taught "accelerator" (CD28) and "brakes" (CTLA-4, PD-1), and its figure is literally titled "Accelerators and brakes". A reader meeting this heading will assume it continues Chapter 5. The clarifying box comes after about 450 words that use "brakes" six times, and after a collapsed deep-dive, so many readers will never see it. The box is also clear in content but long, and its closing parenthetical on CD28 is a third thing to hold.
Fix, in three parts.
(a) Flag it where the metaphor is introduced: "Biologists describe drivers with an analogy: a cell is a car with accelerators and brakes." becomes:
> "Biologists describe drivers with an analogy: a cell's growth is controlled by a gas pedal and brakes. (These are not the T-cell accelerators and brakes of Chapter 5. Those sit on immune cells; these sit inside the would-be cancer cell. A box below sorts them out.)"
(b) Move the box up to directly after the tumor-suppressor paragraph, and tighten it:
> "**Two kinds of brake, two sides of the fight.** Inside a cell, tumor suppressors such as p53 brake *growth*; when a cancer breaks them, the cancer gains. On a T cell, checkpoints such as PD-1 brake the *attack*; when a drug releases them (Chapter 8), the attack strengthens. Same metaphor, opposite effects."
(c) In this chapter say "growth brakes" for p53/RB (for example in the HPV sentence: "disable the cell's p53 and RB growth brakes") and call PD-1 and CTLA-4 "checkpoints" where possible. Optional: show the contrast as a 2 x 2 (where it sits / what it normally brakes / what happens when it fails) instead of prose.

**2. The first figure, and the main text around it, depend on a deep-dive the reader may skip.**
Location: `ch06-clonal-evolution` (story steps name "APC", "KRAS", "TP53" and call the tissue "a sheet of lining, like the colon"); the end of "Two hits, many steps": "...the pattern the next figure animates."
Problem: The colon sequence (APC to KRAS to TP53, polyp, invasion) appears only inside a collapsed box. A reader who skips it meets floating gene labels, "polyp" and "benign bulge" with no setup. The box also hands the figure's story to the reader by pointing forward.
Fix: Put the story in the main text after the "car analogy has limits" paragraph, and trim the same paragraph in the box:
> "Colon cancer shows the usual order. A first driver, in a gene called *APC*, lets one cell's family grow into a small, harmless lump called a polyp. A second, in *KRAS*, makes the lump grow faster. A third, in *TP53*, removes the cell's alarm, and the descendants push into the wall beneath: now it is a cancer. Each step is a round of mutation followed by expansion of the lucky family, as the figure below shows."
(About 65 words, replaced by cuts elsewhere; see item 20.) Alternatively, strip gene names from the figure and label the nodes "driver 1/2/3".

**3. "G12D" is never decoded, and "position 12 of the protein" blurs DNA and protein.**
Location: oncogene paragraph: "A single-letter change at position 12 of the protein locks it in the 'on' position"; Rosenberg paragraph: "Her tumor carried a single-letter KRAS mutation called G12D."
Problem: "Single-letter change" means a DNA letter in Chapter 1 but "position 12 of the protein" is an amino acid. The reader cannot tell what "G12D" encodes until a figure caption two sections later.
Fix: Decode it once, where the oncogene is introduced:
> "KRAS, for example, is a protein that relays 'grow' messages from the cell surface inward. In many cancers a single-letter change in its gene swaps one amino acid in the chain, the twelfth: glycine (G) becomes aspartic acid (D). Researchers call the change G12D. The protein jams in the 'on' position, and the cell hears 'grow' all the time."
Then the Rosenberg paragraph can say "Her tumor carried the KRAS change G12D."

**4. The Rosenberg patient's relapse is only in the figure; the main text wastes its best bridge to Chapter 7.**
Location: "A typo in the shop window", first paragraph; also the closing section.
Problem: The main text ends the story at "All seven lung metastases shrank." The figure's step 6 adds the payoff: one tumor came back, and its cells had lost the chromosome carrying HLA-C*08:02. A reader who skims past the figure gets a success story with no complication, and the chapter's close ("the window keeps changing") has no concrete example.
Fix: Add after "All seven lung metastases shrank.":
> "Months later, one tumor grew back. Its cells had lost the chromosome that carried HLA-C*08:02. The shop window that displayed the typo had been boarded up."
And in "The view from the T cell", after "The immune system becomes one more selective force.":
> "The woman's regrown tumor was this principle in miniature."

**5. Cancer-testis paragraph skips the logical step that makes it matter.**
Location: "A family of genes is normally switched on only in the developing sperm cells of the testis — and male germ cells carry no MHC class I, so they never display these proteins to T cells."
Problem: The sentence ends at "never display these proteins to T cells" and the next sentence says "Many cancers switch the genes back on." A reader asks: so what? The missing link is that T cells were never taught to ignore these proteins, and healthy tissue barely shows them.
Suggested rewrite:
> "**Cancer-testis antigens.** A family of genes is normally switched on only in developing sperm cells. Those cells display no MHC class I, so T cells never meet the proteins and were never taught to ignore them. Many cancers switch the genes back on, and the proteins appear in the shop window as if from nowhere. One of them, NY-ESO-1, ..."

**6. "Few antigens are both" contradicts the praise just given, and the text does not prepare two chips the figure uses.**
Location: closing lines of "Four ways to look different"; `ch06-antigen-kinds` chips "Shared hotspot neoantigen (KRAS G12D)" and "Differentiation antigen (gp100, MART-1)".
Problem: The text calls viral antigens "among the easiest tumor targets of all" and cancer-testis antigens "attractive", then says "Few antigens are both specific and shared." The figure places both near the ideal corner. The missing third dimension is that only a minority of cancers carry them. Separately, the main text says neoantigens are "mostly personal" and never mentions that some, like KRAS G12D, recur. And "differentiation antigen" and "gp100/MART-1" appear only in a deep-dive and in the figure.
Fix, text:
> In the neoantigen paragraph, after "most are personal": "A few recurring mutations, such as KRAS G12D, are shared by many patients, though only those whose HLA types can display them."
> Closing lines: "The ideal target would be specific (only on cancer cells), shared (the same in many patients) and present in most cancers. Nothing meets all three. Viral and cancer-testis antigens come closest, but only some cancers have them."
Fix, figure: drop the differentiation chip (see item 17), or add its name to the tumor-associated paragraph: "...like the pigment-making proteins (gp100, MART-1) of melanoma."

**7. The MSI paragraph needs three or four readings and uses three names for one thing.**
Location: "Then there are the outliers..." in "Counting the typos".
Problem: The reader gets "mismatch-repair deficiency", "microsatellite-unstable" and "MSI-high" for the same state, plus the microsatellite explanation (CACACACA), plus the 24 kinds of cancer and one-in-twenty figure. The last sentence ("nine times more likely ... to bind HLA molecules in a way the normal sequence could not") is the hardest in the chapter. A few sentences later "biomarkers" is used with no gloss, and "97% of MSI-high tumors had at least 10 mutations per megabase, but only 16% of tumors with very high TMB were MSI-high" cannot be followed without a pencil.
Suggested rewrite (about 190 words, replacing about 320):
> "Then there are the outliers. Some tumors have lost their DNA spell-checker, the mismatch-repair system. Copying slips go uncorrected, and these tumors, called MSI-high (for 'microsatellite instability', after the repeated-letter stretches where slips pile up), carry about ten times as many mutations as tumors with repair intact. The fault can be inherited, as in Lynch syndrome, or the tumor can silence the gene itself. Many of the slips insert or delete a letter, which scrambles the recipe from that point on (Chapter 1) and produces long stretches of entirely new protein. These frameshift neoantigens look especially foreign.
>
> More tickets improve the odds. Across 27 cancer types, a tumor type's typical mutation count explained roughly half of the differences in how often it responded to PD-1-blocking drugs. That is why MSI-high status and high counts became biomarkers, measurable signs that predict who is likely to benefit (Chapter 8). But a count is blunt: it does not say which mutations are displayed, and some cancers respond better than their counts predict, such as Merkel-cell carcinoma, a rare skin cancer often caused by a virus whose proteins give T cells something truly foreign."
Cut the 97%/16% sentence and the nine-times sentence (move the latter to a deep-dive if wanted). This also lets sources [30] and [32] go (see item 20).

**8. The TMB numbers are abstract, and "thousandfold" disagrees with the figure's own caption.**
Location: "It varies astonishingly. Across thousands of tumors, it spans more than a thousandfold: some childhood cancers carry about 0.1 mutations per megabase, while some melanomas and lung cancers exceed 100." Compare the figure's step 1: "Typical tumors differ about 150-fold ... Individual tumors differ more than a thousandfold."
Problem: "0.1 per megabase" means nothing to a non-biologist. Also, 0.1 (a typical childhood tumor) against 100 (an extreme adult tumor) mixes typical with extreme, and the figure is more careful than the text. The takeaway repeats the loose version.
Suggested rewrite:
> "It varies astonishingly. A typical childhood leukemia carries a handful of protein-changing mutations in all its coding DNA; a typical skin melanoma carries hundreds; the most extreme melanomas and lung cancers carry thousands. Counted per million DNA letters (a 'megabase'), the unit the chart below uses, typical tumors differ about 150-fold and individual tumors more than a thousandfold."
(The conversion uses about 30 megabases of coding DNA, so 0.1 gives about 3 mutations, 14.9 about 450, 100 about 3,000; check against the data table.)

**9. The `ch06-typo-to-target` figure, the chapter's centerpiece, carries three ideas and too many moving parts.**
Location: figure spec, goal and steps.
Problem: The goal bundles (i) the path from DNA to T-cell recognition, (ii) the HLA switch that makes one mutation visible or invisible, and (iii) why most mutations fail at one of five gates. The workbench therefore holds DNA codons, one-letter protein strings, a nine-bead peptide, six labeled HLA cups for each of two patients ("A*01, A*26, B*08, B*35, C*04, C*08:02"), a five-gate pipeline, a funnel and seven mutation cards. HLA allele names mean nothing to this audience and will read as noise. The funnel's intermediate drop-outs are admitted to be invented ("Intermediate steps illustrative; final share measured"). Readers will treat them as data.
Fix:
- Keep Part A as the figure. Show six unlabeled cups (shape or color only) and label only the matching cup "HLA-C*08:02".
- Make Part B a lighter strip of the seven cards on the same five gates, each stopping at its gate with its one-sentence caption (those captions are excellent).
- Replace the funnel with one bar: "100 protein-changing mutations, about 2 recognized (measured, 75 patients)". Describe the intermediate losses qualitatively in the caption.
- Step 3's "nine-letter fragment" becomes "a fragment nine amino acids long (GADGVGKSA in the one-letter code)".

---

## Should fix

**10. The "asymmetry" paragraph states a rule without its reason.**
Quote: "One faulty copy of an accelerator can be enough, but a brake usually fails only when both copies are broken."
Problem: The reader does not get why. The reason (one working copy of a brake is still enough to brake) is left to inference. It is also repeated, with more motivation, in the Knudson box.
Fix: Move it to the Knudson deep-dive and add the reason there ("a cell with one working copy still brakes"), or keep it in the main text with the missing clause. Cutting it saves about 45 words.

**11. DNA-repair genes are not brakes; "mountains" and the missing link from drivers to the two gene classes.**
Quotes: "Some brakes guard the DNA itself. *BRCA1*, *BRCA2* and the mismatch-repair genes..."; "one of the 'mountains' of cancer genetics"; the opening of the section: "A few are drivers: they alter a gene that controls growth, survival or the upkeep of DNA".
Problem: A repair gene is a proofreader, not a brake, and the car metaphor stretches. "Mountains" is unexplained insider slang. The text never says outright that drivers hit two kinds of gene, which is the point of the section. "Mismatch-repair genes" is the earlier "DNA 'spell-checking' genes" under a new name.
Fix:
> "...Drivers hit two kinds of gene. Oncogenes are growth genes stuck 'on'. Tumor suppressors normally restrain growth, repair damage or order a damaged cell to die." 
> "Some suppressors are less like brakes than like a repair crew: *BRCA1*, *BRCA2* and the 'spell-checking' (mismatch-repair) genes behind Lynch syndrome keep the genome tidy, and when they fail, mutations pile up faster everywhere."
Replace "one of the 'mountains' of cancer genetics" with "mutated in roughly half of all tumors" (check the number with the science review).

**12. Hallmarks section: the hinge question sets up the wrong puzzle, and the list is textbook-flat.**
Quote: "Why would a tumor need to escape the immune system at all, when it is made of you?" followed by "Altered self", which argues the opposite (the immune system mostly cannot see it).
Problem: The question implies "why bother hiding?". The next section answers "why can't T cells see it?". The reader feels whiplash. The answer to the question as posed only appears in the final paragraph of the chapter.
Fix:
> "Here is a puzzle. A cancer is made of you, so why would it need to hide from your immune system? Yet if it needs to hide, something about it must be visible. The next sections ask what."
Also trim the six-item list to the capabilities the guide uses later (growth signals, evading growth suppressors, resisting death, spreading) and send the rest to the box. That is about 35 words.

**13. "Clonal" collides with Chapter 3's clonal expansion; the tree has gone cold; the McGranahan paragraph is heavy.**
Location: "Trunk and branches": "A clonal neoantigen comes from a trunk mutation..."; quiz Q4; glossary entry.
Problem: In Chapter 3 "clonal expansion" meant T cells photocopying themselves. Now "clonal" means "present in every cancer cell". The tree itself last appeared about 1,800 words earlier, with a figure between. The McGranahan paragraph piles three findings and the chemotherapy aside into one block.
Fix: Lead with the plain words and recall the tree:
> "Remember the tree from the simulation? A neoantigen from a *trunk* mutation is on every cancer cell (immunologists call it clonal). One from a *branch* is on only some (subclonal). T cells that destroy one branch leave the rest to regrow."
Trim the study to two findings: patients with many trunk neoantigens lived longer, and such tumors responded better to checkpoint inhibitors. Cut the chemotherapy sentence (about 30 words), or move it to a box.

**14. The "numbers are sobering" paragraph mixes two hit rates; one cross-reference looks wrong.**
Quote: "...they found T cells against at least one neoantigen in 62 of them (83%). But only 1.6% of the patients' protein-changing mutations were recognized ... In a worldwide benchmark ... only 37 times out of 608 — about one in sixteen."
Problem: 83%, 1.6%, 99% and 1/16 in four sentences. Readers will wonder whether 1.6% and 6% conflict (they measure different things). The benchmark figure is already in the deep-dive ("Prediction is still poor", source [26]). Also hurdle 5 says "that T cell must be activated (Chapter 7)", but activation is Chapter 4 (signals 1 and 2).
Fix:
> "The numbers are sobering. In 75 people with common digestive-tract cancers, T cells recognized only 1.6% of the patients' protein-changing mutations, and 99% of the recognized neoantigens were unique to one patient."
Delete the 83% and benchmark sentences (about 55 words; the benchmark stays in the box). Change hurdle 5 to "(Chapters 3 and 4)".

**15. Terms used before they are defined, or more technical than the main text needs.**
- "a normal stem cell picks up roughly three new mistakes every time it divides": "stem cell" has not been defined for this use (Chapter 1 gave blood-forming stem cells only). Add "(a cell that keeps a tissue topped up)".
- "somatic" and "germline" and the Lynch definition in the inheritance bullet: Lynch syndrome is defined three times (bullet, accelerators paragraph, MSI paragraph); somatic and germline are used nowhere else. Say "acquired during life" versus "born with", name BRCA1/2 only, and drop the 8% statistic (source [7]).
- "the cell's p53 and RB brakes" in the viral-antigens paragraph: RB first appears here (it is in the Knudson box otherwise). Say "disable two growth brakes in the cell, p53 and RB".
- "overexpressed" (tumor-associated paragraph) versus the earlier "makes in excess". Pick one.
- "mutations in *TP53* or *EGFR*" and "the TRACERx study" in the trunk paragraph: EGFR is meaningless to the reader and TRACERx is only a label. Say "a UK study of 100 early lung cancers" and cut EGFR.
- "HLA-C*08:02": explain once that "HLA-C" is one of the three class I genes and "*08:02" a particular version (Chapter 4 named A, B, C but not the notation).
- "proteasome" in hurdle 3: add "(the cell's shredder, Chapter 4)".

**16. `ch06-clonal-evolution` teaches three things at once.**
Problem: Its goal covers (i) random mutation plus selection, (ii) accumulation of drivers in one lineage and (iii) trunk/branch trees. The panels are tissue, tree and a four-item counter strip, plus passenger tick marks on the tree, hollow extinct nodes, hatch patterns for branches and a 7-step story ending in free play with a repair toggle. This is a lot for a first look. Steps 1 to 5 are about the tissue; step 6 is a different lesson.
Fix: Run steps 1 to 5 with the tissue and a minimal tree (one node per driver clone, no passenger ticks). Introduce the trunk/branch view only in step 6, or make it a second tab. Cut the counters to "Time" and "Cells with at least one driver" (the eyelid callback). Step 5 caption reads awkwardly; replace with: "A third driver lands in the same lineage. Its cells now ignore the boundary layer and push into the tissue beneath. A growth that invades is a cancer."

**17. `ch06-antigen-kinds` is a map, a body map and a card at once.**
Problem: The target map (two plain-language axes) is excellent and carries the lesson. The body map with eight organ zones, cervix and testis insets, thymus "tolerance" tags and haloes adds a second chart that repeats the x-axis ("also on healthy cells"). Six chips for four kinds adds a different naming scheme ("differentiation antigen"). The first step asks the reader to drag chips to positions they cannot yet know.
Fix:
- Drop the body map. Keep the card's "Found in healthy tissue" line.
- Cut to five chips: personal neoantigen, shared neoantigen (KRAS G12D), viral, cancer-testis, tumor-associated (HER2). Name the kind on each chip, which removes the "Examples | Kinds" toggle.
- Default to "tap to reveal", with "try placing them first" as an option.
- Consider putting this figure after "A typo in the shop window", since it gives away the KRAS G12D/HLA point before the story. Otherwise item 6's added text covers it.

**18. `ch06-tmb` is dense for a first-time chart reader.**
Problem: 29 rows of 20 dots on a log axis, with medians, quantile cards, group and sort toggles, hollow/filled/diamond marks and a POLE note about a "broken proofreading enzyme" (a new term that is irrelevant to the chapter's argument). The "each dot is 5% of tumors" encoding is clever but unfamiliar. The log scale will lose some readers.
Fix: Default to about 12 rows (the story rows plus 2 or 3 anchors) with "Show all 29". On the axis, say "each gridline is ten times the one before". Drop the POLE note and the endometrial MSS row, or its top dots, and keep colorectal as the only MSS/MSI pair. Keep the three captions; they are clear and honest, especially the final "these are mutations, not visible neoantigens" line.

**19. Quiz: Q1 gives away its answer by length; Q3 is too easy; Q4's third distractor is a straw man; important ideas are untested.**
Quotes: Q1 correct option: "It releases a brake on T cells, which is the opposite side of the fight from the tumor-suppressor brakes that cancer cells break"; Q3: all three distractors are explicitly low-mutation cancers; Q4: "Clonal neoantigens are always derived from viruses".
Problem: Q1's right answer is much longer than the other two and mostly restates the stem. Q3 reduces to "pick the one not described as low", and the stem says "candidate neoantigens", slightly at odds with the chapter's "counts, not neoantigens" warning. Q4's virus option is not tempting. Nothing tests drivers/passengers, the four kinds of antigen or why cancer-testis antigens work.
Suggested rewrites:
> Q1 correct option: "It releases a brake on T cells — PD-1 sits on T cells; blocking it frees them to attack. Tumor-suppressor brakes like p53 sit inside cancer cells, and breaking those helps the cancer."
> Q3 (replace): "A colon cancer has lost its mismatch-repair system. Why does it carry roughly ten times more mutations than one with repair intact?" Correct: "Copying slips are no longer corrected, so they accumulate everywhere." Distractors: "It has been exposed to more sunlight"; "Its cells divide ten times faster"; "It contains more driver genes".
> Q4, third distractor: "Clonal neoantigens escape tolerance, while subclonal ones do not — both are absent from healthy tissue, so tolerance does not distinguish them."
> Add (a) "A tumor carries 2,000 mutations. Roughly how many are likely drivers?" (a few, about two to eight), and (b) "Why are cancer-testis antigens attractive targets even though they are made by normal sperm cells?" (germ cells carry no MHC class I, so T cells were never taught to ignore them; shared between patients).

**20. Length: about 500 words can go without losing anything the reader needs.**
Target: 3,260 to about 3,000 after the additions in items 1 to 7 (about 170 words). Suggested cuts:

| Cut | About words | Sources affected |
|---|---|---|
| "Counting the typos": rewrite per items 7-8 | -150 | drop [30], [32] |
| "Numbers are sobering": delete 83% and benchmark sentences (item 14) | -55 | none ([26] stays in box) |
| Pancreatic timeline sentence ("at least a decade...") | -45 | [2] still used for metastasis |
| Asymmetry paragraph, moved to the Knudson box | -45 | none |
| Inheritance bullet: drop somatic/germline and the 8% figure | -45 | drop [7] |
| Hallmarks: trim the six-item list | -35 | none |
| McGranahan chemotherapy sentence and EGFR/TRACERx detail | -45 | none |
| "Four ways": drop HER2 "15-20%" and the NY-ESO-1 "20 of 25" (keep patchiness stat in trunk section) | -30 | drop [22] |
| "Society of cells": tighten the four definitions | -35 | none |

That nets roughly -490 +170, or about 2,940 words and 32 to 33 sources. If more is needed, the "mutational signature / handwriting experts" sentence and the "Natural killer cells" parenthetical in "Altered self" are the next two, though both are good.

**21. The opening statistics do not match each other.**
Quote: "Roughly a quarter of the cells carried a mutation in a known cancer gene: about 140 such mutations in every square centimeter of skin."
Problem: "A quarter of cells" next to "140 per square centimeter" reads like a contradiction (a square centimeter holds far more than 560 cells). The 140 counts mutant families (clones), not cells.
Fix: "Roughly a quarter of the cells carried a mutation in a known cancer gene: about 140 separate mutant families in every square centimeter of skin."

---

## Optional

**22. Terminology drift and duplicate titles.** "Typo" means a DNA change in "Where the typos come from", but "typo made visible" for a neoantigen later, and "How many typos?" counts mutations, not visible neoantigens. Consider reserving "typo" for the mutation and always saying "typo that reaches the shop window" for neoantigens, or retitle the chart "How many mutations?". The section "Four ways to look different" and its figure share a title; rename the figure "The target map".

**23. Give "friendly fire" a face.** The tumor-associated paragraph says attacking shared self proteins "risks attacking healthy tissue" with no example, while the 2010 HER2 T-cell death sits only in the figure card. One sentence in the main text ("In 2010 a patient died after engineered T cells aimed at HER2 apparently attacked low levels of it in her lungs") is more memorable than the HER2 percentage it can replace. The figure's step 4 uses "friendly fire" before the text does.

**24. Smaller wording fixes.** Quiz Q2: "every nucleated cell has proteasomes" ("nucleated" is jargon) becomes "every cell has proteasomes"; its fourth option says "passenger genes" where it means "passenger mutations"; the stem uses pancreatic cancer while the story used colorectal, so use "two patients with the same cancer type". "Immunologists sum up the predicament in two words: altered self" is fine but check that "altered self" is how the literature phrases it. The car metaphor is "a car with accelerators and brakes", which is odd in the plural; "a gas pedal and brakes" is cleaner.

**25. Ending.** The close is strong and sets up Chapter 7. Two tweaks: (a) it hands over Chapter 7's answer ("the tumors that reach a doctor are the survivors of that hunt") on the last line; end instead on the puzzle itself, "why does anyone get cancer at all?"; (b) the "two problems" signpost promised that Chapter 7 would take up context (danger signals), but the ending mentions only selection. Add: "And recognition is only half the problem: even a visible tumor can be met with silence if no danger signal is raised."

*For the science reviewer (outside this review's remit):* footnote 27 (Le et al. 2017) supports both the "at least 24 kinds of cancer" statistic and the patient whose mutant fragment bound HLA more than 100-fold more tightly; the second claim may belong to another source. Source [2] (a pancreatic-cancer paper) also supports the general claim that metastasis is the most common cause of cancer death.
