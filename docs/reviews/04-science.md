# Science review — Chapter 4, "How T Cells See"

Draft reviewed: `content/drafts/04-presentation.md` (584 lines). Reviewer role: immunology (antigen processing/presentation, MHC/HLA, dendritic cells, T-cell activation). Verification via PubMed/E-utilities, the IPD-IMGT/HLA database and NobelPrize.org. Draft not edited.

## Overall assessment

This is an unusually strong draft: the mechanism is correct end to end, the numbers are real and nearly all traceable to the exact source cited, and the figure specs contain more scientific self-discipline than most textbook art (anchor residues pointing down, TCR contacting both peptide and groove, non-directed T-cell motility, "no killing here — that's Chapter 5"). All 20 sources exist and match on authors, title, journal, year and DOI; I found no invented citation, no hype, and no outdated framing. Every quantitative claim I could check — 0.02% of proteasome products presented, ~200,000 class I molecules, a few thousand distinct peptides, 8–10mers, class II 13–25 (mean ~15), ~2 million class II on a matured DC, >43,000 HLA alleles across 47 genes, 15–1,100 specific naive cells per mouse, ~3-minute contacts, a few thousand T cells scanned per hour, abacavir 0%/2.7% and 5.6% carriage — is accurately drawn from the cited paper. The problems are concentrated in four places: one historical sentence that states the opposite of the chapter's own central lesson, two figure specs that contradict their own "scientific care" clauses (an empty groove at the cell surface; a display readout that asserts scarcity while depicting 8%), and a location error that puts naive T cells in peripheral tissue in both a figure preset and a scored quiz answer. All four are small, local edits. Fix those and a biologist would find nothing wrong here.

---

## Must fix

**1. "displaying the same viral peptides" states the opposite of MHC restriction (§ "Two keys turned at once", line 162)**

> "Infected cells from a different strain, carrying the same virus and **displaying the same viral peptides**, were left untouched."

Wrong, and it contradicts the chapter's own payoff three paragraphs later ("Two people infected with the same virus display different fragments of it") and the whole premise of figure `ch04-two-keys`. A different mouse strain has a different H-2 haplotype, therefore different grooves, therefore a *different* set of displayed viral peptides — that is the explanation, not a control condition. (Peptides were not known to be the ligand until 1986: Townsend et al., *Cell* 1986, PMID 2420472, [doi:10.1016/0092-8674(86)90019-x](https://doi.org/10.1016/0092-8674(86)90019-x).) The 1974 experiment held the *virus* constant, not the peptides: Zinkernagel & Doherty, *Nature* 1974, PMID 4133807, [doi:10.1038/248701a0](https://doi.org/10.1038/248701a0); Nobel citation "for their discoveries concerning the specificity of the cell mediated immune defence" (nobelprize.org/prizes/medicine/1996).

*Suggested rewrite:* "Infected cells from a different strain, carrying the same virus and busily making the same viral proteins, were left untouched."

**2. `ch04-two-keys` instructs an empty groove on the cell surface, which its own "scientific care" clause forbids (lines 201–203 vs 234–236)**

> "· peptide does not fit the groove → the peptide is pushed out and falls away; **the slot shows an empty-outline state** and the label reads 'not displayed at all';"

versus, in the same spec: "it would be wrong to show … an MHC molecule reaching the surface with an empty groove" — and versus the deep-dive at line 141, which correctly states that only peptide-loaded class I is released from ER quality control (Rock, Reits & Neefjes, *Trends Immunol* 2016, PMID 27614798, [doi:10.1016/j.it.2016.08.010](https://doi.org/10.1016/j.it.2016.08.010)). Built as written, the left panel would show a surface MHC molecule with an empty groove.

*Suggested rewrite:* make the failure happen upstream and let the groove be taken: "· peptide does not fit the groove → it is pushed out and falls away **inside the loading compartment**; a different, sand-colored self peptide slides into the groove instead, and **this MHC molecule is never seen carrying our peptide at the surface**. Label: 'not displayed at all'." (A filled groove with the *wrong* peptide is the biologically true outcome and preserves the shape-carried distinction.)

**3. The "What's in the window" readout asserts scarcity while depicting roughly 1 in 12 (`ch04-mhc1-pathway`, lines 91–98)**

> "· Virus-infected: … a minority (**about 2 of 12 slots**) of the display becomes red-coral."
> "· Mutated (cancer): … exactly **ONE display slot out of twelve** glows hot pink. **The scarcity is the point**."

8% is not scarcity; it is roughly three to four orders of magnitude too generous for a neoantigen, and the spec's explicit claim ("the scarcity is the point") makes the figure dishonest rather than merely simplified. Benchmarks: a cell carries ~200,000 class I molecules presenting fewer than 10,000 distinct peptides (Rock 2016, [doi:10.1016/j.it.2016.08.010](https://doi.org/10.1016/j.it.2016.08.010)) — so one neoantigen species is of order 1 in 10³–10⁴ of the *distinct* peptides and far less of the *molecules*. Keeping one lit slot is fine for legibility; asserting it is scarce is not.

*Suggested fix (no redraw needed):* add a permanent line under the readout and in the step-6 caption: "Stylized. Twelve slots stand in for a few thousand different peptides on ~200,000 molecules — in a real tumor cell a single neoantigen would be about one slot in a thousand, which is exactly why it is so easy to miss." Keep "2 of 12" for the virus but label it the same way (viral peptides can be a few percent of the display; 17% is still high).

**4. Naive T cells are placed in peripheral tissue, in a figure preset and in a scored quiz answer (`ch04-three-signals` lines 466–469; quiz Q4 line 531)**

> "'Healthy body cell' → 1 only, presenting cell drawn sand-colored…"; "'Tumor cell' → 1 only…"
> "Q: A naive T cell meets its exact peptide **on a resting cell in healthy, uninflamed tissue**, with no costimulation available."

Naive T cells recirculate between blood and secondary lymphoid organs; they do not patrol parenchymal tissue, and a sand-colored body cell carries class I (read by CD8) but no class II and no B7, so it is not where signal-1-only tolerance happens. Peripheral tolerance to tissue and tumor antigens is driven mainly by steady-state/immature dendritic cells cross-presenting that antigen **in the draining lymph node** without costimulation — which is also the honest version of the chapter's own excellent point that tumor-specific T cells "are being actively taught that it is self". The fix keeps the lesson and the drama intact.

*Suggested rewrites:*
- Quiz Q4 stem: "A naive T cell meets its exact peptide **in a lymph node, presented by a dendritic cell that arrived with no danger signal**, so no costimulation is available."
- Figure presets: rename "Healthy body cell" → **"Steady-state dendritic cell carrying harmless tissue protein"** (keep the note that ordinary body cells never carry B7, as a side annotation), and for "Tumor cell" keep the violet cell but add the one-line note: "In reality the naive T cell usually meets this tumor peptide **on a quiet dendritic cell in the lymph node** — same arithmetic, same silence."

---

## Should fix

**5. Surface class I is presented as unable to pick up outside peptides (deep-dive "Inside the loading dock", line 141)**

> "…which is also a safety feature, since it makes it hard for a healthy cell to pick up stray peptides from outside and advertise someone else's contents."

Not supported by [^5] and not true as stated: surface class I does exchange peptide, and peptide-receptive/empty surface MHC-I is routine enough to be a standard laboratory technique (peptide pulsing; UV-cleavable conditional ligands — Rodenko et al., *Nat Protoc* 2006, PMID 17406393, [doi:10.1038/nprot.2006.121](https://doi.org/10.1038/nprot.2006.121)). *Suggested rewrite:* "…so class I almost always arrives at the surface already loaded. It is not a perfect seal — a short peptide floating past can still slip into a groove at the surface, which is how researchers load cells with a chosen peptide in the lab — but the cell's display is overwhelmingly a report on its own interior."

**6. CTLA-4 is drawn on a naive T cell at the moment of priming (`ch04-three-signals`, lines 472–476)**

> "when enabled on the 1+2 case, a second crimson glyph with a bar icon appears on the T cell and outcompetes CD28 for the B7 studs"

Resting naive T cells carry essentially no surface CTLA-4; it is induced *after* activation and held in intracellular vesicles that traffic to the synapse — it is negative feedback, not a competitor present at first contact (and much of its in-vivo effect runs through Tregs and B7 removal, which Ch 5/8 own). As drawn, a reader would conclude the brake is on before the accelerator. *Suggested fix:* have the control play as a short sequel — activation and the first divisions happen, **then** crimson CTLA-4 glyphs surface from inside the T cell and the response damps — with the caption "the brake is built in, and switches on only after the T cell has started."

**7. The evidence-board metaphor omits that most class II peptides are the presenter's own protein (§ "The evidence board", line 260; "Where the metaphors break", line 284)**

> "Think of class II as the evidence board: **not a sample of what the presenter is making**, but a pinboard of what it has collected from the scene."

The paper the chapter cites for class II peptide length found the opposite emphasis: "Predominant naturally processed peptides bound to HLA-DR1 are **derived from MHC-related molecules**… all but one were from self proteins" (Chicz et al., *Nature* 1992, PMID 1380674, [doi:10.1038/358764a0](https://doi.org/10.1038/358764a0)). Autophagy also routes cytosolic proteins into the class II pathway (Dengjel et al., *PNAS* 2005, PMID 16501849). The "where the metaphors break" box breaks the shop window beautifully but lets the evidence board off lightly. *Suggested addition to that box:* "And the evidence board is not only evidence. Most of what sits on class II at any moment is the presenter's own protein — its own membrane molecules, chewed up and re-displayed — and some arrives from inside the cell by self-digestion rather than from the scene at all. The foreign material is a minority tenant on a board mostly covered in house notices."

**8. "B7 is absent" is stated too absolutely (`ch04-three-signals` line 443; main text line 416)**

> "When off, the studs are absent from the presenting cell's surface (**not greyed out — absent, because that is the biology**)."

Resting dendritic cells and other APCs carry low but real CD80/CD86; maturation raises it by one to two orders of magnitude. Teaching "absent" is a fine simplification, but instructing the builder that absence *is* the biology will propagate into captions. *Suggested rewrite:* "When off, the studs are reduced to one or two faint, unlit nubs rather than greyed-out copies of the lit version — a resting presenter carries far too few to count, and that is the biology; it is a threshold, not a switch."

**9. The abacavir clinic box is slightly too clean (§ clinic, line 251)**

> "screening for HLA-B*57:01 and withholding abacavir from carriers **eliminated immunologically confirmed hypersensitivity entirely** — 0% in the screened group against 2.7% in the control group. About 5.6% of the people in that study carried the allele."

Every number is correct (Mallal et al., *NEJM* 2008, PMID 18256392, [doi:10.1056/NEJMoa0706135](https://doi.org/10.1056/NEJMoa0706135): n=1,956; prevalence 5.6%; 0% vs 2.7% patch-test-confirmed), but two caveats from the same abstract matter for honesty and for Ch 8's later discussion of biomarkers: *clinically diagnosed* hypersensitivity fell but was not eliminated (3.4% vs 7.8%), and the test's positive predictive value was only 47.9% — carrying the allele does not mean you would have reacted. The 5.6% figure is also cohort-specific (84% white); B*57:01 frequency varies several-fold by ancestry. *Suggested addition:* "Two honest footnotes: the test is a near-perfect *rule-out* and a mediocre *rule-in* — only about half of carriers would actually have reacted — and clinically suspected reactions fell sharply without vanishing, because other things also cause rashes and fevers in the first six weeks of HIV treatment. Carriage rates also differ by ancestry; 5.6% is the figure for that largely European cohort."

**10. Anergy is generalized from cultured CD4 clones to naive T cells in vivo (§ "Two-factor authentication", line 418)**

> "The experiment that nailed this is clean and old. T cells given signal 1 without signal 2 … are switched into a lasting unresponsive state called anergy…"

Accurately cited — Harding et al. is explicitly "prevents induction of anergy **in T-cell clones**" (*Nature* 1992, PMID 1313950, [doi:10.1038/356607a0](https://doi.org/10.1038/356607a0)) — but in vivo a naive T cell that meets antigen without costimulation also commonly undergoes abortive proliferation and deletion, and anergy is one of several tolerance outcomes. One clause protects the claim without weakening it. *Suggested rewrite:* append "The cleanest experiments were done on cultured T-cell clones; in a living animal the same encounter can also end in abortive division and deletion. Either way the lesson holds: recognition without corroboration subtracts a T cell from the repertoire rather than adding a response." (This also makes quiz Q4's "dies immediately by apoptosis" distractor safer — keep the word "immediately".)

**11. Glossary: "professional antigen-presenting cell" overstates macrophages and B cells (line 550)**

> "A cell equipped with MHC class II and costimulatory molecules, **able to activate naive T cells**. Dendritic cells, macrophages and B cells are the main ones."

Priming a *naive* T cell is effectively the dendritic cell's monopoly; macrophages and B cells present mostly to already-activated effector and memory CD4 cells (and B cells present to get help, which Ch 3 set up). *Suggested rewrite:* "A cell equipped with MHC class II and costimulatory molecules. Dendritic cells, macrophages and B cells are the main ones — but in practice only dendritic cells reliably wake up a *naive* T cell; macrophages and B cells mostly talk to T cells that are already activated."

**12. Two citation attributions should be widened (lines 176, 321)**

- Line 176: "the variation is not random — it clusters in and around the groove … [^3][^5]". The 1987 paper that mapped class I polymorphism onto the binding site is the **companion** to the structure paper: Bjorkman PJ, Saper MA, Samraoui B, Bennett WS, Strominger JL, Wiley DC. *The foreign antigen binding site and T cell recognition regions of class I histocompatibility antigens.* **Nature 1987;329:512–518**, PMID 2443855, [doi:10.1038/329512a0](https://doi.org/10.1038/329512a0). Add it as a new source and cite it here (keep [^3] for the structure itself).
- Line 321: "Some targets are served a hundred times better than others.[^16]" The >100-fold spread is Alanio's human measurement (0.6×10⁻⁶ to 1.3×10⁻⁴ — PMID 20200354, [doi:10.1182/blood-2009-10-251124](https://doi.org/10.1182/blood-2009-10-251124)); Jenkins & Moon report ~10-fold for dominant vs subdominant epitopes and 1–89 per million for CD8. Cite as [^16][^17].

---

## Optional

- **HLA allele count is already stale** (line 176). "Passed 43,000 distinct alleles across 47 genes by early 2026" matches the cited paper verbatim (">43 000 unique alleles from 47 genes", Barker et al., *NAR* 2026;54:D1152–D1158, PMID 41251166). The live database now lists **45,421 alleles** (release 3.65, July 2026, ebi.ac.uk/ipd/imgt/hla). Given the book's "as of mid-2026" rule, consider "more than 45,000 … and climbing by roughly a thousand a quarter", citing both the paper and the release.
- **"200,000 class I molecules"** (line 43) is Rock's figure "on cells such as B and T cells"; "on a lymphocyte, roughly 200,000" would be exact. Likewise "perhaps a few thousand *different* peptides" could be "a few thousand — probably under ten thousand", which is Rock's wording.
- **ERAP1 ruler** (line 139): Rock says the conformational change is triggered by peptides "longer than 8–9 residues"; "longer than about nine" → "longer than eight or nine".
- **Priority claim** (line 323): "when two-photon microscopy was first used to watch this inside an intact node" — the first two-photon lymph-node imaging was Miller et al., *Science* 2002; the cited 2004 PNAS paper is the DC-scanning study. Soften to "when researchers used two-photon microscopy to watch this inside an intact node".
- **Random encounter** (line 323 and `ch04-dc-journey` "scientific care", line 391): correct as a description of baseline repertoire scanning, but chemokine-guided recruitment of CD8 T cells to DCs does occur in antigen-specific responses (Castellino et al., *Nature* 2006). Half a sentence — "once a response gets going, chemical signals do start steering traffic" — would future-proof it against Ch 5.
- **`ch04-two-keys` grid** gives each person a single allotype. A one-line note ("each of these four people really has up to six class I molecules, so real coverage is broader than this grid — but the asymmetry is real") would prevent a reader concluding that one anchor mutation blinds a whole person.
- **Golgi** is omitted from the class I route; worth adding to the spec's "acceptable simplifications" list so a builder doesn't "fix" it.
- **"every cell … with a nucleus"** (line 37): true as a rule; neurons and some immune-privileged sites display very little class I. A Go-deeper clause would be a free piece of depth.
- **Proteasome substrates** (line 39) are mostly tagged with ubiquitin first — one clause in the deep-dive would add real mechanism.
- **Quiz Q2**: a T-cell clone transferred into an HLA-mismatched person would in reality also be alloreactive and rejected. Consider "a T cell with the same receptor" to keep the thought experiment clean.
- **`ch04-dc-journey`** counter "matching T cells in this node: 1" — fine for a mouse-scale node, worth labeling "stylized" alongside the existing honesty notes.

---

## Claims verified as correct

- All 20 sources exist, with authors, titles, journals, years, volumes, pages and DOIs matching exactly (PMIDs 4133807, 2420472, 3309677, 8906788, 27614798, 1380674, 7760935, 22722860, 18256392, 7629501, 1083422, 22790179, 19008445, 27424807, 22517866, 20200354, 14722354, 1313950, 20363604; source 8 = PMID 41251166). No fabricated or mismatched reference.
- 0.02% of proteasome-generated peptides survive for presentation — verbatim in Rock 2016.
- ~200,000 class I molecules per cell; fewer than ~10,000 distinct peptides — Rock 2016.
- Class I peptides "usually 8 to 10 amino acids"; groove closed at both ends — Rock 2016.
- Class II peptides 13–25 residues, average ~15, appearing as nested overlapping families; groove open at both ends — Chicz 1992, exact match.
- ~2 million class II molecules on a matured/activated dendritic cell — Rock 2016.
- Pathway order (proteasome → TAP → ER → peptide loading → surface) and the TAP/tapasin/calreticulin/ERp57/TAPBPR/ERAP1 descriptions — all correct.
- DRiPs (defective ribosomal products) as a major source of class I peptides, and the "advertise a virus within minutes" consequence — correct, current view.
- Immunoproteasome induced by interferon, altering the peptide set — correct.
- HSV ICP47 blocks TAP, class I retained in the ER with empty grooves — Hill 1995, exact match; HSV-1 carriage by a majority of adults is right.
- NK missing-self as the counter-move, and the pincer framing — correct and consistent with Ch 2.
- MHC restriction discovered 1974; Zinkernagel and Doherty shared the 1996 Nobel Prize in Physiology or Medicine — confirmed.
- HLA-A2 was the first class I structure (1987) with unidentified density in the groove — Bjorkman 1987, exact match.
- TCR binds diagonally across the groove, contacting peptide and both helices; six CDR loops — Garboczi 1996, exact match; "a decade later" is right.
- Three class I genes (A, B, C), one copy from each parent, at most six class I molecules — correct.
- HLA as the most polymorphic genes in the human genome; >43,000 alleles / 47 genes as of the cited early-2026 paper — exact match.
- Abacavir binds non-covalently in the floor of the HLA-B*57:01 groove (into the F-pocket), altering the self-peptide repertoire; mechanism published 2012 — Illing 2012, exact match.
- Abacavir trial figures: ~2,000 patients (1,956), 5.6% carriage, 0% vs 2.7% immunologically confirmed hypersensitivity — Mallal 2008, exact match.
- Class II restricted to professional APCs plus epithelium under inflammation; invariant chain → CLIP → HLA-DM → HLA-DO chain of events — correct.
- HLA-DQ2 and deamidated gluten in coeliac disease; MHC class II deficiency causing overwhelming infant infections — correct.
- CD8 binds class I, CD4 binds class II, each steadying its own class — correct; "not labels but molecules" is a good correction of a common misreading.
- Dendritic cell constitutive macropinocytosis at rest; maturation stops uptake, raises surface MHC and costimulation, is irreversible, takes 1–2 days — Sallusto 1995, exact match (including irreversibility, which the figure correctly enforces).
- Cross-priming discovered by Bevan in 1976 with H-2 congenic cells; cross-presentation defined as routing external material into class I — correct.
- Batf3-dependent CD8α⁺/cDC1 cells: defective cross-presentation, failed anti-viral CD8 response, failure to reject immunogenic tumors — Hildner 2008, exact match; cDC1 trafficking tumor antigen to the draining node via CCR7 — Roberts 2016, exact match.
- Naive precursor frequency 1 in 10⁴–10⁶, skewed to the rare end; 15–1,100 specific cells per mouse; similar range in humans despite ~10× greater human TCR diversity — Jenkins & Moon 2012 and Alanio 2010, exact match.
- Lymph-node scanning: ~3-minute contacts, equal approach and departure speeds (chance encounters, not chemotaxis), of order a few thousand T cells scanned per DC per hour (Miller: up to 5,000) — Miller 2004, exact match.
- Signal 1 / signal 2 / signal 3 framing; CD28–CD80/CD86; CD28 ligation prevents anergy — Harding 1992, exact match.
- IL-12 and type I interferon as the CD8 third signal, without which cells expand poorly and drift toward tolerance — Curtsinger & Mescher 2010, exact match.
- CTLA-4 binds the same B7 molecules more tightly than CD28 and opposes it — correct.
- Figure `ch04-mhc1-pathway`: compartments and order, fragments-only transport, no peptide loading outside the ER, TAP-blocked cell going dark and becoming an NK target — all scientifically correct.
- Figure `ch04-two-keys`: anchor residues pointing down into pockets, TCR-read residues pointing up, TCR always contacting peptide *and* groove, escape mutation blinding some HLA types and not others — all correct and well judged.
- Figure `ch04-three-signals`: signals 2 or 3 without 1 give no activation; signal 3 cannot rescue a cell lacking signal 2; anergy as a state, not death — all correct.
- Glossary entries for peptide, antigen presentation, MHC, HLA, class I, class II, proteasome, TAP, TCR, CD8, CD4, dendritic cell, cross-presentation, naive T cell, costimulation, CD28, B7, anergy, tolerance, lymph node, clonal expansion, CTLA-4 and neoantigen are all accurate (one wording fix at item 11).
- Quiz: all four keyed answers are correct and all twelve distractors are genuinely wrong; the explanations are accurate (two stem/wording refinements at items 4 and 10, and an optional one for Q2).
- Scope discipline against PLAN.md is good: killing deferred to Ch 5, MHC-I loss and tumor escape to Ch 7, CTLA-4 blockade to Ch 8, neoantigen prediction to Ch 11; the shop-window metaphor's breakage is stated as the plan requires.
