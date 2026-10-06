# Second-pass verification: Chapter 5, "Killers, Helpers and Brakes" (`content/drafts/05-t-cells.md`)

Verifier: second-pass scientific fact-check, 2026-10-06. Draft not edited. Line numbers refer to the current draft (517 lines).

Sources used:
- PubMed metadata and abstracts for all 22 sources.
- PMC full text of Pardoll 2012 (PMC4856023), Miller 2019 (PMC6673650), Liston 2025 (PMC12673964) and Ivanova 2022 (PMC8836823).
- Amass biomedcore (Alfei 2019: AMBC_Mlw224Y2EUoXwuKtNiIjKwiEMTl) and regulatorycore (Orencia, FDA BLA 125118: AMRC_Gvd897oZLlvYJDkSZwJ4dWEuAEb).
- Web, for the scurfy origin (1949, Oak Ridge).

**Summary:** 0 errors, 4 claims that are unsupported or weakly supported, 4 citation problems.

All four Must-fix items and all nine Should-fix items from `docs/reviews/05-science.md` are correctly resolved. The new material checks out:
- the 2025 Nobel Prize paragraph;
- the scurfy and IPEX history;
- Wing 2008 (Treg-specific CTLA-4);
- Pauken 2016 (re-exhaustion);
- Alfei 2019, which replaced Khan 2019 as the TOX source.

The remaining issues are mechanistic precision and citations that don't fully cover their sentences.

---

## 1. Errors (must fix)

None found. Every number, date, name and attribution in prose, figure specs, captions, data, alt text, quiz and glossary was traced to a source or confirmed as standard knowledge. See section 4.

---

## 2. Unsupported or weakly supported (should fix)

### U1. Perforin is described as inserting first and then assembling; the order is the reverse
- **Where:** line 139, kill figure step 4 caption (line 184), and the deep dive (line 201).
  - > "Perforin inserts into the target's membrane and assembles into rings that punch pores"
  - > "Perforin is released as single molecules that, in the calcium-rich space of the synapse, insert into the target's membrane and assemble into ring-shaped pores."
- **What's wrong:** Perforin monomers first *bind* the target membrane through their calcium-dependent C2 domain. They then assemble on the surface into rings (prepores), and the assembled ring then inserts to open the pore.
- **Evidence:**
  - Law et al. *Nature* 2010;468:447–451, PMID 21037563: "A C-terminal C2 domain mediates initial, Ca²⁺-dependent membrane binding".
  - Ivanova et al. *Sci Adv* 2022;8:eabk3147, PMID 35148176: "prepores form on the membrane surface with minimal conformational changes", before insertion.
- **Rewrites:**
  - Main text and step 4: "Perforin latches onto the target's membrane, assembles into rings and punches pores".
  - Deep dive: "…released as single molecules that, in the calcium-rich space of the synapse, latch onto the target's membrane, gather into rings and then plunge through it to open pores."

### U2. Kill figure spec: the perforin ring has the wrong number of subunits (line 161)
> "perforin assembling INTO the target membrane as ring-shaped pores (top view: a ring of ~16–20 small staves…"

- **What's wrong:** In cryo-EM, perforin pores are heterogeneous, from C15 to C26, "with most having 21- to 23-fold symmetry". The structure was solved as a 22-mer. Source: Ivanova 2022 (PMID 35148176), full text.
- **Fix:** "a ring of ~20–24 small staves". Stylization is fine, but the spec gives a number, so it should be the typical one.

### U3. Glossary `mhc-class-ii` contradicts Chapter 4 (line 453)
> "…displaying fragments of material collected from outside (the "evidence board")."

- **What's wrong:** Chapter 4's own box (04 line 295) says, and its source shows, that most class II peptides come from the presenting cell's own proteins. Chicz 1992 (PMID 1380674): "all but one were from self proteins". This glossary pop-up will contradict that. Chapter 4's glossary has the same problem (see `verify-04.md` U2).
- **Rewrite:** "…displaying fragments of whatever reaches its digestion compartments, including material collected from outside (the "evidence board")."
- **Also note:** Chapters 4 and 5 define CD8 T cell, CD4 T cell, MHC class I/II, costimulation, anergy, CTLA-4, cross-presentation, B7 and CD28 in different words. None of the pairs contradict each other except class II. If the site merges glossaries, pick one wording per term.

### U4. "ordinary self-peptides" in the cortex (optional, line 23)
- **What's wrong:** Cortical thymic epithelial cells cut proteins with a special thymoproteasome (subunit β5t) and present "unique" peptides that are critical for positive selection of CD8 T cells. Source: Rock 2016 (PMID 27614798), already cited in Chapter 4.
- "Ordinary" is acceptable shorthand for "nothing foreign". A Go-deeper clause would add real depth and remove the imprecision. The earlier review flagged this as optional item O10; it was not adopted.

---

## 3. Citation problems

### C1. The TOX epigenetic claim rests on sources that don't directly show it (line 327; deep dive line 396)
> "…switches on a protein called TOX, which changes which of the cell's genes can be read, and the change sticks[^19][^20]."
> "It commits the whole family to an epigenetic program of exhaustion."

- **What's wrong:**
  - [^20] Pauken 2016 shows that the exhausted epigenome is stable after PD-L1 blockade. It predates TOX and does not test it.
  - [^19] Alfei 2019 shows that TOX is induced by strong TCR stimulation and is required for exhausted cells to develop and persist. Its abstract does not show that TOX remodels chromatin; it mentions epigenetic enforcement only as background.
  - The earlier draft cited Khan 2019, which is the direct demonstration. It was swapped out.
- **Fix:** Add Khan O et al. "TOX transcriptionally and epigenetically programs CD8⁺ T cell exhaustion." *Nature* 2019;571:211–218, PMID 31207603, doi:10.1038/s41586-019-1325-x. The abstract says TOX "results in commitment to Tex by translating persistent stimulation into a distinct Tex transcriptional and epigenetic developmental program". Cite it on both sentences, alongside [^19]/[^20].

### C2. The PD-L2 tissue distribution is not in the cited review (line 314)
> "…and PD-L2, found mainly on dendritic cells and macrophages."

- **What's wrong:** The sentence is covered only by [^14], Pardoll 2012. A full-text search of Pardoll finds no statement of where PD-L2 is expressed; it discusses only PD-L2 upregulation in some B-cell lymphomas. The claim itself is correct.
- **Fix:** Add Latchman Y et al. "PD-L2 is a second ligand for PD-1 and inhibits T cell activation." *Nat Immunol* 2001;2:261–268, PMID 11224527 (PD-L2 on dendritic cells and macrophages).

### C3. "milder **and slower**" is only half-supported by [^14] (line 250; figure step 6 at line 295; figure chip at line 277)
- **What's wrong:** Pardoll 2012 says only "relatively mild phenotypes of Pd1… knockout mice". "Slower" (late onset) is correct but comes from the primary paper.
- **Fix:** Add Nishimura H et al. "Development of lupus-like autoimmune diseases by disruption of the PD-1 gene encoding an ITIM motif-carrying immunoreceptor." *Immunity* 1999;11:141–151, PMID 10485649 (late-onset lupus-like disease in aged C57BL/6 mice). This was also suggested in the earlier review's S5. Alternatively, drop "and slower".

### C4. The Treg mechanism sentence is broader than its citation; minor wording point on Wing (lines 121, 240)
- **Line 121:** "Tregs work in three ways. They soak up IL-2… release calming cytokines… They also use CTLA-4… to disarm dendritic cells[^8]."
  - Wing 2008 supports only the CTLA-4 piece.
  - IL-2 consumption and IL-10/TGF-β are standard knowledge but uncited. This is acceptable; optionally cite a Treg review.
- **Line 240:** "their Tregs can no longer **strip** B7 from dendritic cells[^8]"
  - Wing 2008 (PMID 18845758) showed impaired "Treg-mediated **down-regulation** of CD80 and CD86 expression on dendritic cells". The stripping mechanism (trans-endocytosis) is Qureshi 2011 [^15].
  - Suggest citing [^8][^15] here, as the deep dive at line 312 already does. Alternatively, say "can no longer lower B7 on dendritic cells".

---

## 4. Claims verified OK (claim → source)

**Earlier review items**
- M1 (hook: "lost much of its ability to recognize and reject what was foreign"): resolved.
- M2 (TOX tag on the whole lineage; padlock = "terminal (TCF1 lost)"; stem-like card "Also TOX+"): resolved.
- M3 (PD-1 braking drawn as fewer lasting contacts, explicitly "do NOT slow it down"): resolved.
- M4 (receptor built in the thymus): resolved.
- S1–S9 resolved:
  - S1: the kill clock is now "time since pores opened".
  - S2: terminal cells are "the main killers" in tumors.
  - S3: the CTLA-4 knockout is drawn as polyclonal, mostly CD4.
  - S4: Wing 2008 added.
  - S5: "depends on genetic background" removed, "in one strain" kept.
  - S6: Yu 2015 wording narrowed.
  - S7: "close relative" (but Chapter 4 still says "near-twin"; see `verify-04.md` U1).
  - S8: Pauken 2016 added.
  - S9: "small study … 25 patients".
- Earlier optional items O1, O4, O5, O6, O7 and O8 adopted.

**Thymus**
- Neonatal thymectomy (1961) led to lymphopenia, wasting, infections and acceptance of foreign skin grafts → Miller 1961, PMID 14474038; Miller's own retrospectives.
- AIRE drives peripheral-tissue antigens (including insulin) in medullary epithelium; Aire⁻/⁻ mice have a defined autoimmune profile; human AIRE defects cause multi-organ disease → Anderson 2002, PMID 12376594.
- Thymic epithelial cells express up to 19,293 protein-coding genes, "the highest number … in any cell type"; Aire alone regulates 3,980 (≈ one in five); expression is stochastic in single cells → Sansom 2014, PMID 25224068.
- Mature single-positive production is "only 3%" of double-positive production and matches export; tracer was [³H]thymidine ("radioactive tracer") → Egerton 1990, PMID 2138780.
- From Stritesky 2013, PMID 23487759 (Hogquist lab):
  - Bim⁻/⁻ Nur77-GFP mice;
  - "six times more cells undergo negative selection than complete positive selection";
  - 75% of deletion is cortical;
  - "more thymocytes are highly reactive to MHC than are weakly reactive … MHC biased";
  - deleted CD4 cells signal "only slightly stronger" than Treg precursors.
- Figure run proportions (3% / 18% / 79%) are consistent with those two studies.

**Peripheral tolerance and Tregs**
- Self-specific CD8 cells are present in healthy blood; SMCY-specific cells only 3-fold lower in males and anergic; the "holes in the repertoire" idea is the authors' suggestion → Yu 2015, PMID 25992863.
- Scurfy facts:
  - Arose in 1949 at Oak Ridge National Laboratory (ISB / Nobel popular-information materials; Liston 2025).
  - Hemizygous males die 16–25 days after birth, with CD4 T-cell overproliferation and multi-organ infiltration.
  - The gene was named Foxp3 by Brunkow, Ramsdell and colleagues in 2001 → Brunkow 2001, PMID 11138001.
- IPEX is caused by human FOXP3 mutations → Liston 2025 (citing Bennett 2001; Wildin 2001).
- The 2025 Nobel Prize in Physiology or Medicine went to Brunkow, Ramsdell and Sakaguchi "for their discoveries concerning peripheral immune tolerance". Sakaguchi identified CD25⁺ Tregs in 1995, and his group (with Ramsdell's and Rudensky's) linked Foxp3 to Tregs in 2003 → Liston 2025, PMID 41255104 (Dis Model Mech 18(11):dmm052725; metadata correct).
- Thymic Treg induction in self-reactive CD4 cells → Liston 2025; Stritesky 2013.
- Treg-specific CTLA-4 deficiency causes fatal autoimmunity, and CTLA-4 is needed for Tregs to down-regulate CD80/CD86 on DCs → Wing 2008, PMID 18845758.

**The kill**
- A CTL detects a single pMHC, needs ~10 for a full calcium signal and a mature synapse, and ~3 to kill → Purbhoo 2004, PMID 15048111.
- From Lopez 2013, PMID 23377437 (human primary cytotoxic lymphocytes):
  - target permeabilized "in as little as 30 seconds" after calcium influx in the killer;
  - repair "initiated within 20 seconds and … completed within 80 seconds";
  - target rounding "within 2 minutes of perforin permeabilization".
- From Halle 2016, PMID 26872694:
  - "on average, one CTL killed 2–16 virus-infected cells per day";
  - killing failed upon MHC-I downmodulation;
  - motile kinapses;
  - death probability rose with more than two CTL contacts.
- Synapse bull's-eye with LFA-1/ICAM-1 ring; secretory lysosomes; centrosome polarization; granzyme B → caspases plus a mitochondrial route; Fas/FasL; IFN-γ raises MHC-I and PD-L1; TNF → standard.

**Helpers**
- CD40L–CD40 licensing raises CD80/CD86/CD70 and IL-12; helper and killer can meet the same DC sequentially; cDC1 is the platform; "helpless" CTLs are weaker with poorer memory; maximizing help improves anti-tumor CTL responses → Borst 2018, PMID 30057419.
- Th1/Th2/Th17/Tfh/Treg descriptions and cytotoxic CD4 T cells → standard.

**Brakes**
- From Pardoll 2012, PMID 22437870 (full text):
  - CD28 and CTLA-4 share CD80/CD86, and CTLA-4 has "much higher overall affinity";
  - CTLA-4 is "induced … at the time of their initial response", regulates "early stages of T cell activation", is constitutive on Tregs (a FOXP3 target), and is also on CD8 effectors;
  - direct signaling is "under considerable debate";
  - the knockout phenotype "predicted a high degree of immune toxicity" for blockade, which supports line 242;
  - PD-1 is induced on activation and stays persistently high under chronic antigen; it acts via SHP2 and "inhibits the TCR 'stop signal'";
  - PD-L1 is induced by IFN-γ on tumor, epithelial and stromal cells and also binds CD80;
  - PD-1 is also on B and NK cells and "can also shift the balance … to tolerance at the early stages … within secondary lymphoid tissues".
- CTLA-4 captures, internalizes and degrades CD80/CD86 (trans-endocytosis) → Qureshi 2011, PMID 21474713.
- CTLA-4⁻/⁻ mice have lymphoproliferation with severe myocarditis and pancreatitis and die by 3–4 weeks → Tivol 1995, PMID 7584144.
- PD-1 cloned in 1992 in Honjo's Kyoto lab from cells undergoing programmed death → Ishida 1992, PMID 1396582.
- PD-1⁻/⁻ BALB/c mice develop dilated cardiomyopathy with sudden death from heart failure → Nishimura 2001, PMID 11209085.
- Abatacept is the CTLA-4 extracellular domain fused to modified IgG1 Fc, FDA-approved 2005 (RA); infection risk is on the label → Amass regulatorycore, Orencia BLA 125118.

**Exhaustion**
- Loss of function is hierarchical: IL-2 and lysis go first, then TNF, and IFN-γ is most resistant → Wherry 2003, PMID 12663797. This is consistent with the main text and the figure's dimming order.
- From Alfei 2019, PMID 31207605:
  - TOX is "induced by high antigen stimulation of the T cell receptor";
  - TOX is required for the development and maintenance of exhausted cells;
  - TOX-deficient cells "initially mediate increased effector function and cause more severe immunopathology, but ultimately undergo a massive decline … notably among the subset of TCF-1 self-renewing T cells".
  - This supports "fight harder … then dwindle away", the stem-like cells' dependence on TOX, and the "truce" framing.
- From Pauken 2016, PMID 27789795:
  - blockade-reinvigorated cells "became reexhausted if antigen concentration remained high and failed to become Tmem upon antigen clearance";
  - the epigenome was "minimally remodeled".
- From Im 2016, PMID 27501248 (Ahmed lab):
  - the subset is PD-1⁺ ICOS⁺ CD28⁺ and TCF1-dependent;
  - it sits in lymphoid T-cell zones, self-renews, and gives rise to terminal cells;
  - the burst after PD-1 blockade comes "almost exclusively" from this subset.
- From Miller 2019, PMID 30778252 (full text):
  - only progenitor-exhausted TILs respond to anti-PD-1;
  - terminal cells are "the primary cytotoxic CD8⁺ T cells in the TME but are short-lived" (granzyme B 80% vs 12%);
  - the human cohort was 25 melanoma patients on nivolumab plus ipilimumab;
  - progenitor frequency did not differ between responders and non-responders, but among responders it correlated with duration of response.

**Figures, takeaways, quiz, glossary**
- `ch05-thymus`, `ch05-kill`, `ch05-brakes` and `ch05-exhaustion` specs, step captions, data and alt text are consistent with the sources above, apart from U1 and U2.
- All six takeaways are accurate.
- All four keyed quiz answers are correct, and all distractor explanations are correct.
- All glossary entries except `mhc-class-ii` (U3) are accurate.

**Sources:** all 22 resolve. Authors, titles, journals, years, volumes, issues, pages and DOIs match PubMed (PMIDs 14474038, 12376594, 25224068, 2138780, 23487759, 25992863, 41255104, 18845758, 11138001, 15048111, 23377437, 26872694, 30057419, 22437870, 21474713, 7584144, 1396582, 11209085, 31207605, 27789795, 27501248, 30778252).
