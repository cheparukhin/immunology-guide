# Second-pass verification: Chapter 4, "How T Cells See" (`content/drafts/04-presentation.md`)

Verifier: second-pass scientific fact-check, 2026-10-06. Draft not edited. Line numbers refer to the current draft (624 lines).

Sources used: PubMed metadata and abstracts; PMC full text of Rock 2016 (PMC5159193), Jenkins & Moon 2012 (PMC3334329); IPD-IMGT/HLA statistics page and release notes (v3.65); Amass biomedcore. Every one of the 22 sources was re-resolved by PMID.

**Summary:** 2 errors, 5 unsupported or weakly supported claims, 3 citation problems. All four Must-fix items and all eight Should-fix items from `docs/reviews/04-science.md` are correctly resolved. The new material is accurate: the Suchin 7% figure, the 45,421-allele count, the Bjorkman companion paper, the cross-presentation and lymph-node-search figure splits, and the calculator arithmetic all check out. Both errors are new, and both are one-sentence fixes.

---

## 1. Errors (must fix)

### E1. A false back-reference to Chapter 2 ("ID badge"). Line 37.
> "Chapter 2 called it an ID badge, because NK cells check that it is there. Up close, the badge turns out to be a **shop window**…"

- **What's wrong:** Chapter 2 never calls MHC class I an ID badge. It already introduces the shop window, with the metaphor's limits stated (`02-innate.md` line 361: "Think of them as the cell's **shop window**: it constantly shows fragments of the proteins the cell is making inside… Chapter 4 explains how."). The sentence describes something the reader never read, and the reveal ("turns out to be a shop window") is a reveal of what they already know.
- **Evidence:** `content/drafts/02-innate.md` lines 361–363. The word "badge" appears in Chapter 2 only as figure HUD badges.
- **Suggested rewrite:** "Chapter 2 introduced it as the cell's **shop window**, and showed that NK cells check that the window is there. Up close, the window is a continuously refreshed display of samples from whatever the cell is manufacturing inside."

### E2. "danger signals trigger the trip" rules out steady-state dendritic-cell migration, which the chapter's own tolerance argument depends on. Line 311; also the bullet list at lines 304–309.
> "*Where the analogy breaks:* a scout decides to report. A dendritic cell decides nothing; **danger signals trigger the trip.**"

- **What's wrong:** As an absolute this is false. Dendritic cells also migrate from tissues to the draining lymph node constantly at steady state, as "semi-mature" cells with low costimulation, carrying harmless self-material. That trickle is the main way tissue and tumor antigens reach naive T cells without an alarm.
- **Why it matters here:** The chapter's own argument depends on that trickle. The text at line 462 ("A dendritic cell that cross-presents tumor fragments without having been alarmed offers signal 1 with little signal 2"), the `ch04-three-signals` presets ("Resting dendritic cell, tumor debris" in a lymph node), and scored quiz Q4 ("a dendritic cell that **arrived without any danger signal**") all need an unalarmed dendritic cell in the lymph node. Line 311 says no such cell would make the trip. A biologist would spot the contradiction at once.
- **Evidence:** Ohl L et al. "CCR7 governs skin dendritic cell migration under inflammatory and steady-state conditions." *Immunity* 2004;21:279–288, PMID 15308107, doi:10.1016/j.immuni.2004.06.014. The paper describes a semimature, CD80/CD86-low migratory DC population in skin-draining nodes at steady state, "capable of initiating T cell proliferation under conditions known to induce tolerance".
- **Suggested rewrite (line 311):** "*Where the analogy breaks:* a scout decides to report. A dendritic cell decides nothing. Danger signals send it off in a hurry and change what it says on arrival, but a quiet trickle of unalarmed dendritic cells makes the same trip all the time, carrying harmless samples. That trickle will matter later in this chapter."
- **Optional:** In the bullet at line 309, change "and it **changes address**" to "and it **changes address in earnest**".

---

## 2. Unsupported or weakly supported (should fix)

### U1. "a near-twin of CD28". Line 466.
- **What's wrong:**
  - Chapter 5's review (S7) asked for this phrase to be changed in both chapters. Chapter 5 now says "a close relative of CD28" (05 line 238); Chapter 4 still says "near-twin".
  - The two proteins are clearly related. They are products of a gene duplication, share gene structure and the MYPPPY B7-binding motif, and are described as "strikingly similar" (Harper K et al., *J Immunol* 1991;147:1037–1044, PMID 1713603).
  - However, their amino-acid identity is only about 30%, and they act in opposite directions. "Near-twin" overstates the likeness and is now inconsistent across chapters.
- **Suggested rewrite:** "…it starts making CTLA-4, a close relative of CD28 that grips the same B7 molecules more tightly and pushes the other way."

### U2. Glossary `mhc-class-ii` says the opposite of the chapter's own correction. Line 583.
> "…showing longer fragments (roughly 13–25 amino acids), **mostly of material taken in from outside**: the evidence board."

- **What's wrong:**
  - The chapter's cited source found the opposite: of 20 sequenced HLA-DR1 peptides, "all but one were from self proteins", mostly MHC-related membrane molecules (Chicz 1992, PMID 1380674).
  - The chapter's own box at line 295 says so too: "Most of what sits on class II at any moment is the presenter's own protein."
  - The glossary pop-up will therefore contradict the main text. Chapter 5's glossary entry (05 line 453, "material collected from outside") has the same problem.
- **Suggested rewrite:** "…showing longer fragments (roughly 13–25 amino acids) of whatever reaches the cell's digestion compartments: material taken in from outside, alongside much of the cell's own protein. The evidence board. Read by CD4 helper T cells."

### U3. "these genes … more than 45,000 HLA alleles". Line 164.
- **What's wrong:**
  - "These genes" refers back to HLA-A, -B and -C (line 162).
  - The 45,421 figure counts alleles of all HLA genes. IPD-IMGT/HLA v3.65 (2026-07) lists 30,894 class I alleles (including non-classical genes) and 14,527 class II alleles. Barker 2026 counts 47 genes.
  - As written, a reader will attribute 45,000 versions to the three class I genes.
- **Suggested rewrite:** "Across humanity, HLA genes come in an extraordinary number of versions, called alleles… the reference catalog listed more than 45,000 HLA alleles by mid-2026, about 31,000 of them for class I, and it is still growing."
- The number itself is verified: https://www.ebi.ac.uk/ipd/imgt/hla/about/statistics/ shows "HLA alleles: 45421", release 3.65, July 2026.

### U4. ICP47 called "an early protein". Line 145.
- **What's wrong:** In herpesvirus biology "early" is a technical class. ICP47 is an *immediate-early* (α) protein, which is exactly why it can shut TAP before viral peptides are made.
- **Evidence:** Hill et al. 1995 (the chapter's source [^8], PMID 7760935): "HSV expresses an immediate early protein, ICP47".
- **Suggested rewrite:** "…makes one of its very first proteins, ICP47, whose job is to jam TAP."

### U5. An uncited mechanism. Line 458.
> "In a living body the same encounter can also end with the T cell dividing briefly and then dying."

- **What's wrong:** This sentence was added to resolve the earlier review's item 10. It is correct (abortive proliferation followed by deletion), but no citation is attached. [^21] covers only T-cell clones in culture.
- **Fix:** Optional. Cite a review of peripheral CD8 tolerance, or leave it as general knowledge. It is low risk.
- **Related, optional:** "it **stops eating**" (line 306) is accurate for cultured DCs (Sallusto 1995, "downregulation of macropinocytosis"). In vivo, matured DCs keep some capacity to capture antigen. The simplification is acceptable.

---

## 3. Citation problems

### C1. A claim with no supporting source. Line 295.
> "…and some reaches the board from inside the cell rather than from the scene.[^6][^7]"

- **What's wrong:** Neither cited source shows class II presentation of intracellular (cytosolic) proteins.
  - A full-text search of Rock 2016 finds no mention of autophagy or class II presentation of cytosolic antigen.
  - Chicz 1992 found mostly self *membrane* proteins.
- **Fix:** Add Dengjel J et al. "Autophagy promotes MHC class II presentation of peptides from intracellular source proteins." *PNAS* 2005;102:7922–7927, PMID 15894616, doi:10.1073/pnas.0501190102, and cite it on this clause.

### C2. The wording goes beyond the source. Line 145.
> "…almost every step the cell can live without **has been found** sabotaged by some virus.[^6]"

- **What's wrong:** Rock 2016 states a prediction, not a survey: "any step in the MHC class I antigen presentation pathway not interfering with cell viability **can be expected** to be manipulated by viruses."
- **Is the fact itself true?** Broadly yes. Examples: TAP (HSV ICP47, CMV US6), tapasin (US3), ER-to-cytosol dislocation (US2/US11), ER retention (adenovirus E3-19K), surface internalization (HIV Nef, KSHV K3/K5).
- **Fix (either):**
  - Reword: "…and virologists have found nearly every step the cell can live without targeted by one virus or another."
  - Add Hansen TH, Bouvier M. "MHC class I antigen presentation: learning from viral evasion strategies." *Nat Rev Immunol* 2009;9:503–513, PMID 19498380.

### C3. A minor attribution slip. Line 266.
> "About 5.6% of that cohort, which was 84% white…"

- **What's wrong:** In Mallal 2008 (PMID 18256392), 5.6% (109 of 1,956) is the whole cohort, but "84% white" describes "the patients receiving abacavir", not all 1,956.
- **Fix:** "About 5.6% of that cohort carried the allele; most participants were white…"

---

## 4. Claims verified OK (claim → source)

**Earlier Must-fixes**
- M1, the Zinkernagel wording ("busily making the same viral proteins"): resolved.
- M2, the empty groove: resolved. `ch04-peptide-plus-groove` has the failed peptide fall away inside the cell, a self peptide take the groove, and "never empty" at the surface.
- M3, readout scarcity: resolved. A permanent "Stylized…" line is under the slots, there is a "one in several thousand" note, and "do NOT label … scarce".
- M4, naive T cells in tissue: resolved. The presets are now resting DCs, quiz Q4 is set in a lymph node, and the `mhc1` figure says "activated killer T cell". (E2 above is a separate, new problem.)

**Earlier Should-fixes 5–12:** all resolved. These were the Townsend loophole paragraph, the CTLA-4 sequel, the evidence-board break, the B7 nubs, the abacavir footnotes, the anergy in-vivo clause, the APC glossary, and the Bjorkman companion paper plus [^18][^19]. The earlier optional items were also adopted: HLA count, lymphocyte 200,000, ERAP1 "eight or nine", priority claim softened, Golgi, neurons, ubiquitin, grid note, quiz Q2 wording.

**Shop window (class I pathway)**
- 0.02% ≈ 1 in 5,000 proteasome products presented → Rock 2016 (PMID 27614798), verbatim "0.02%".
- About 200,000 class I molecules on a lymphocyte, likely fewer than 10,000 distinct peptides → Rock 2016 ("around 200,000 MHC I … on cells such as B and T cells"; "likely less than 10,000").
- Class I peptides 8–10 amino acids, anchors, groove closed at both ends → Rock 2016.
- TAP, tapasin, calreticulin, ERp57 and the peptide-loading complex → Rock 2016.
- ERAP1 activated by peptides longer than 8–9 residues; unbound peptides returned to the cytosol and destroyed → Rock 2016.
- DRiPs allow rapid detection of infection; interferon-induced immunoproteasome → Rock 2016.
- Only peptide-loaded class I leaves the ER ("exporting only peptide-loaded MHC I complexes") → Rock 2016.
- Townsend 1986: CTLs lyse uninfected targets pulsed with short synthetic influenza NP peptides → PMID 2420472.
- HSV ICP47 binds TAP, class I retained in ER → Hill 1995, PMID 7760935. A "large majority" of people carry CMV/HSV → Rock 2016.
- CMV induces class I degradation in ER or plasma membrane → Rock 2016.
- Figure `ch04-mhc1-pathway` honesty notes (1 in 5 shown vs 1 in 5,000 real; 12 slots vs ~200,000) → consistent with Rock 2016.

**MHC restriction and structure**
- MHC restriction, 1974, LCMV, syngeneic vs allogeneic targets → Zinkernagel & Doherty, PMID 4133807. The 1996 Nobel Prize (shared) is correct.
- First human class I structure, HLA-A2, 1987, with unidentified density in the groove → Bjorkman 1987a, PMID 3309677.
- Polymorphic residues cluster in the groove → Bjorkman 1987b, PMID 2443855 ("Most of the polymorphic amino acids … are clustered … in a large groove").
- TCR binds diagonally, contacting peptide and both helices, 1996 (≈ "a decade later") → Garboczi 1996, PMID 8906788.
- Figure `ch04-peptide-plus-groove`: the truth table was recomputed from the specified pocket and anchor shapes and is internally consistent (P1: Ana, Ben; P2: Ben; P3: Chen; P1*: Ben only). "Three TCR loops instead of six" is a correctly labeled simplification.

**HLA diversity, transplants, abacavir**
- HLA-A, -B, -C, two copies each, at most six class I types → standard.
- HLA is "the most polymorphic genes in the human genome"; >43,000 alleles in 47 genes → Barker 2026, PMID 41251166 (metadata correct: NAR 54:D1152–D1158, doi:10.1093/nar/gkaf1218, authors as listed).
- 45,421 alleles, release 3.65 (2026-07) → IPD-IMGT/HLA statistics page. See U3 for the wording.
- An anchor change can hide a peptide in one person but not another → Rock 2016 (near-verbatim).
- About 7% of T cells alloreactive in vivo → Suchin 2001, PMID 11145675 (parent→F1 mouse model; "approximately 7%" was the authors' best estimate within a 0.7–21% assumption-dependent range). Metadata correct.
- Abacavir binds non-covalently in the floor of the HLA-B*57:01 groove (F-pocket) and alters the self-peptide repertoire, 2012 → Illing 2012, PMID 22722860.
- Mallal 2008, PMID 18256392: 1,956 patients; 0% vs 2.7% patch-test-confirmed; NPV 100%, PPV 47.9% ("about half"); clinically diagnosed 3.4% vs 7.8%; 5.6% carriage. All exact.

**Class II**
- Class II peptides 13–25 residues, average 15; groove open at both ends; mostly self proteins → Chicz 1992, PMID 1380674.
- Class II on epithelial cells after inflammation; invariant chain → CLIP → HLA-DM, with HLA-DO inhibiting DM; HLA-DQ2 presenting deamidated gluten; bare lymphocyte syndrome with "extreme susceptibility to infections … death at young age"; about 2 million class II on activated DCs → Rock 2016.
- CD8 binds class I and CD4 binds class II → standard.

**Dendritic cells and cross-presentation**
- Constitutive macropinocytosis; maturation within 1–2 days, irreversible, with downregulated uptake and raised costimulation → Sallusto 1995, PMID 7629501.
- Bevan 1976, cross-priming: F1 (H-2^d/b) mice primed by B10 (H-2^b) cells gave CTL against minor H antigens on H-2^d, which the injected cells lacked → PMID 1083422.
- Batf3^−/− mice (no CD8α⁺/cDC1) have defective cross-presentation, a weak antiviral CTL response, and fail to reject immunogenic tumors → Hildner 2008, PMID 19008445.
- cDC1 traffic tumor antigen to the draining node via CCR7 → Roberts 2016, PMID 27424807.
- Figure `ch04-cross-presentation` (new): Route B starts from eaten material, both T cells are in the lymph node, and the tumor never primes directly. All correct.

**The search**
- "About 1 in 200,000" matches Chapter 3 line 147.
- 0.8–10 per million (CD4) and 1–89 per million (CD8) naive cells, i.e. 1 in 10⁴ to 10⁶; 15 to 1,100 cells per mouse; human range similar; dominant populations about 10× larger → Jenkins & Moon 2012, PMID 22517866 (full text).
- More than 100-fold spread (0.6×10⁻⁶ to 1.3×10⁻⁴), conserved across humans → Alanio 2010, PMID 20200354.
- Contacts about 3 minutes; equal approach and departure velocities (random encounter, in the absence of antigen); up to 5,000 T cells per DC per hour → Miller 2004, PMID 14722354. "A few thousand" and the figure's 3,000/h are faithful.
- Calculator arithmetic: 100,000 ÷ 3,000/h ≈ 33 h; ÷10 ≈ 3.3 h; ÷100 ≈ 20 min. Correct. "Hundreds of times easier" holds: 250× at N=400, 667× at N=150.

**Signals**
- CD28 costimulation; anti-CD28 prevents anergy in T-cell clones → Harding 1992, PMID 1313950.
- IL-12 and type I IFN as the CD8 "third signal" → Curtsinger & Mescher 2010, PMID 20363604.
- CTLA-4 is induced after activation, binds B7 more tightly, and must not be drawn on naive T cells → Pardoll 2012 (see Chapter 5 checks).

**Glossary, takeaways, quiz**
- All other glossary entries are accurate: antigen presentation, class I, HLA, allele, ER, proteasome, TAP, anchor, neoantigen, CD8, CD4, professional APC, cross-presentation, naive T cell, costimulation, CD28, B7, anergy, CTLA-4.
- All six takeaways are accurate.
- All four keyed quiz answers are correct and all distractor explanations are sound.

**Sources:** all 22 resolve. Authors, titles, journals, years, volumes, pages and DOIs match PubMed (PMIDs 4133807, 2420472, 3309677, 2443855, 8906788, 27614798, 1380674, 7760935, 41251166, 11145675, 22722860, 18256392, 7629501, 1083422, 19008445, 27424807, 22517866, 20200354, 14722354, 1313950, 20363604) plus the IPD web page (#10).
