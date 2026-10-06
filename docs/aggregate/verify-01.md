# Second-pass verification — Chapter 1, "A Crash Course in Cells" (`content/drafts/01-cells.md`)

Verifier: second-pass scientific fact check, 2026-10-06. Line numbers refer to the current draft (717 lines). Scope: every number, name, date, mechanism and citation in prose, callouts, deep dives, figure specs (spec/steps/data/alt), quiz, takeaways and glossary. Primary checks used Amass (biomedcore), PubMed/E-utilities, and Europe PMC full text. Scratch arithmetic (census table, square allocation, binding-sim mass action, scale factors) is in the session scratchpad under `verify-1/`.

## Status of the earlier review's Must-fix items (`docs/reviews/01-science.md`)

| Item | Status |
|---|---|
| M1 affinity defined as dwell time | **Resolved** everywhere (L351, key idea L433, glossary L675, takeaway L644, ch01-binding goal/step 2; quiz Q3 rewritten). |
| M2 "almost all made in the bone marrow" | **Resolved in substance** (L476 now says "trace their ancestry"). The suggested parenthetical on cells seeded before birth was dropped; see S1. |
| M3 COVID virus as "protein shell" | **Resolved** (L21, step 6 L113). |
| M4 spike length half the real value | **Resolved** (scenes 5–6, data L123). The source attribution for "23–25 nm" is slightly off; see C1. |
| M5 "almost every cell carries two copies" | **Resolved** (L160, glossary L664). |

The Should-fix items S1–S8 are all addressed. S3 (the hemoglobin C chip) was added, but the new text introduces the mechanism error in E2.

---

## 1. Errors (MUST fix)

**E1. Quiz Q2 distractor explanation states a false general rule (L625)**
- Quote: "No: a single-letter swap changes at most one amino acid, or ends the chain early."
- Problem: the question asks about any single DNA letter "in a gene", and the rule is categorical. A single-letter change can also:
  - **Abolish a stop codon**, so the chain grows longer. The textbook hemoglobin example is Hb Constant Spring: one letter in the α2-globin stop codon changes, and the chain gains 31 amino acids (Clegg JB, Weatherall DJ, Milner PF. *Nature* 1971;234:337–340, doi:10.1038/234337a0, PMID 4944483).
  - **Abolish the start codon.**
  - **Break or create a splicing signal**, which removes or adds whole stretches of protein. Splice-site changes are a common cause of β-thalassemia, a disease of the very gene in the figure.
- Fix: "No: a single-letter swap usually changes at most one amino acid or ends the chain early. (Rarer changes that hit the start or stop signal, or a splicing signal, can alter much longer stretches.)"

**E2. Hemoglobin C: "no sticky patch", and lysine "charged like glutamic acid" (L196; verdict card L273–276; alt L312)**
- Quotes:
  - L196: "puts in lysine, which is charged like glutamic acid rather than oily. The result, hemoglobin C, does not sickle."
  - Card: "Lysine is charged, not oily, so there is no sticky patch and no sickling."
- Problem 1, the charge: lysine carries the *opposite* charge (positive) to glutamic acid (negative). "Charged like glutamic acid" reads as "same charge".
- Problem 2, the mechanism: HbC is not free of stickiness. The chapter's own source [13] says the Glu→Lys substitution makes HbC "less soluble than Hb A" (StatPearls, Karna et al., PMID 32644469). Oxygenated HbC tends to crystallize inside red cells, which is why two copies cause chronic mild hemolysis. In HbSC disease, HbC-driven cell dehydration concentrates HbS and promotes sickling. "No sticky patch" is therefore a false mechanism. "No sickling" (for HbC alone) is correct.
- Rewrites:
  - L196: "...puts in lysine, which is charged (positively, where glutamic acid is negative) rather than oily. The result, hemoglobin C, does not form sickle fibers, though it is less soluble than normal hemoglobin. People with one copy have no symptoms, and those with two usually have only mild anemia.[^13]"
  - Card: "Same position, another real variant: lysine instead of glutamic acid. This is hemoglobin C. Lysine is charged, not oily, so hemoglobin C does not form sickle fibers. It is less soluble than normal hemoglobin, though, and can form crystals inside red cells. One copy causes no symptoms; two usually cause only mild anemia. Inherited together with the sickle-cell change from the other parent, it causes a form of sickle-cell disease (HbSC)."
  - The alt text ("while the hemoglobin C change at the same spot does not") can stay as written.

---

## 2. Unsupported or weakly supported (SHOULD fix)

**S1. Origin of immune cells (L476): the qualifier from the M2 fix was dropped**
- Quote: "Almost all of them trace their ancestry to rare blood-forming stem cells in the bone marrow... and many tissue macrophages renew themselves on the spot."
- Problem: the very macrophages said to "renew themselves on the spot" mostly did *not* come from bone-marrow stem cells. In mice, adult Kupffer cells, microglia, Langerhans cells and alveolar macrophages largely derive from yolk-sac erythro-myeloid progenitors that are distinct from HSCs (Gomez Perdiguero E et al. *Nature* 2015;518:547–551, doi:10.1038/nature13989, PMID 25470051). Microglia derive from primitive macrophages that arise before embryonic day 8 (Ginhoux F et al. *Science* 2010;330:841–845, doi:10.1126/science.1194637, PMID 20966214). These are only a few percent of the census, so "almost all" survives. But as written, readers will infer that self-renewing macrophages came from the marrow.
- Fix (restores the earlier reviewer's wording): "...and many tissue macrophages renew themselves on the spot. (Some, such as the brain's macrophages, descend from cells that settled in their tissues before birth.)[^16]"

**S2. Nit, scale data stop 8 (L132)**
- Quote: "smaller than a grain of fine sand (~0.15 mm)".
- Problem: 0.6 nm × 243,000 ≈ 0.15 mm, which lies *within* the fine-sand range (0.125–0.25 mm), not below it.
- Fix: "about the size of the finest grains of sand (~0.15 mm)".

---

## 3. Citation problems

**C1. ch01-scale data line (L123) attributes "prefusion spikes ~23–25 nm tall" to [5] (Klein 2020)**
- What Klein reports (verified in full text, PMC7676268):
  - virion diameter 89.8 nm (SD 13.7, n = 74);
  - spike "total height of approximately 25 nm measured from the virion envelope", width 13 nm;
  - trimer density 16 nm tall, with an unresolved ~9 nm stalk gap;
  - nearest-neighbor spacing 23.6 nm (SD 8.1).
- The "23" comes from Ke et al. 2020 (23.4 ± 2.3 nm; *Nature* 588:498–502, doi:10.1038/s41586-020-2665-2), which the sources do not list.
- Fix: cite Ke 2020 as well, or write "~25 nm tall [5]".
- Spike density: Klein estimates **~48 spikes per virion (range 25–127)**, so scene 5's "sparse... only 6–10 show around an outline" is at the sparse end. That is acceptable for a stylized drawing, but the sparseness should not be attributed to [5] (Ke's ~25 per virion fits it better).

---

## 4. Claims verified OK (claim → source)

- **Opening and cell totals**
  - 1.5–2 trillion immune cells; reference woman 60 kg → 1.5 × 10¹², child of 10 (32 kg) → 1 × 10¹² → Sender 2023 full text (PMC10623016).
  - "Tens of trillions" of your own cells; ~30 trillion cells → Sender 2016.
- **Sizes and the zoom**
  - Seven powers of ten, 10 cm → 10 nm → arithmetic.
  - Cell 10–20 µm, 50–100 per mm → [2].
  - Resting lymphocyte ~7 µm → Reth 2013.
  - *E. coli* ~2 µm → [2].
  - SARS-CoV-2 90–100 nm, enveloped; ~70 virions across 7 µm (7000/95 ≈ 74) → Klein 2020.
  - IgG 10–15 nm (14.5 × 8.5 × 4; tips 13.7 nm apart) → Tan 2008 (metadata verified: ACS Nano 2:2374, PMID 19206405).
  - IgG ~1,300 aa in 12 domains (2 × ~450 + 2 × ~214; 4 per Fab, 4 in Fc) → standard structure [16].
  - Antibody ≈ 0.6× spike; spike ≈ 1.5–2× antibody; virus ≈ 7× antibody; T cell ≈ 3.5× *E. coli*; spike ≈ ¼ of virion diameter → arithmetic.
  - Macrophage ~17–18 µm from 601 g / 2.03 × 10¹¹ cells ≈ 2.96 ng ≈ 2,800–3,000 µm³ → arithmetic on the [1] dataset.
  - Amino acid ~110 Da, well under 1 nm → standard.
- **"If a T cell were your height"** (×243,000): you 413 km (ISS orbit ~400–420 km); RBC ~1.8 m; macrophage ~4.4 m; *E. coli* ~0.5 m; virus ~2.4 cm; antibody ~3 mm → arithmetic.
- **Deep dive "How many cells"**
  - Sender 2016: 70-kg reference man; ~30 T human cells; ~38 T bacteria, mostly colon; 0.2 kg; RBC ~25 T = 84%; RBCs anucleate.
  - The 6% / 1-in-17 figure is now explicitly framed as the reader-visible division 1.8/30 (OK). A newer total of ~36 T (Hatton 2023) would give ~5%. This is optional.
- **City and recipe sections**
  - Billions of proteins per cell; a protein crosses a cell in ~10 s; ~2 m of DNA per diploid cell → [2].
  - Genome ~3 Gbp → Nurk 2022.
  - "Just under 20,000" protein-coding genes → Amaral 2023.
  - RBCs carry no DNA → Sender 2016.
  - 20 amino acids; 64 codons, 3 stops, 61 sense; Leu has 6 codons; GAA/GAG = Glu; introns, splicing, frameshifts → standard.
- **Folding deep dive**
  - Anfinsen's RNase refolding (late 1950s–1961), 1972 Chemistry Nobel (shared) → [9].
  - AlphaFold 2020–21 → [10].
  - Misfolding and Alzheimer's → standard.
- **Sickle-cell section**
  - Ingram 1957: a single amino-acid difference → [11] (metadata correct).
  - Position 6 of the β chain; GAG→GTG; Glu→Val; surface valine polymerizes deoxy-Hb → standard; Kato 2018.
  - "Hundreds of thousands... most in sub-Saharan Africa" → Kato 2018 abstract (PMID 29542687: "300,000 and 400,000... the majority in sub-Saharan Africa").
  - HbC Glu→Lys at β6; AC asymptomatic; CC mild hemolysis; SC is a sickle-cell disease genotype → StatPearls PMID 32644469 (authors Karna B, Jha SK, Al Zaabi E verified; see E2 for the solubility point).
- **Gene figure**
  - NM_000518.5: first 27 nt ATG GTG CAT CTG ACT CCT GAG GAG AAG = M-V-H-L-T-P-E-E-K; mature chain 146 aa (8 + 138); TAA stop; Met removed co-translationally → verified in round 1; re-checked arithmetic.
  - Single-letter stops are possible only at codons 6, 7 and 8 (GAG→TAG, AAG→TAG), with n = codon − 1.
  - The 64-codon table matches the standard code.
  - Chips: GAG→GAA silent; GTG sickle; AAG HbC; TAG stop.
- **Clinic (Casgevy)**: FDA, 8 Dec 2023; first gene therapies for SCD; patients ≥12 y; Casgevy is the first US-approved CRISPR medicine; autologous HSC editing after myeloablative chemotherapy; raises fetal Hb rather than correcting the letter → [14].
- **Receptors**
  - Insulin → GLUT4 sugar uptake in muscle and fat → standard.
  - Caffeine as an adenosine-receptor antagonist → Fredholm 1999.
  - Thousands of receptor copies per cell → standard.
- **Binding figure**
  - Rate-based rules, p = 1 − exp(−k·dt) → frame-rate independent (fixes S1 of round 1).
  - Tuning targets 70% / 25% / 60%: reproduced by mass action with ligand depletion (Snug K ≈ 5 molecules, Look-alike K ≈ 50; 12 receptors, 20 or 80 ligands). Wrong shape at 80 gives ~1%.
  - "Real dwell times from ~1 s (TCR) to hours (high-affinity antibodies)" → Stone 2009; Foote & Eisen 1995 (koff ~10⁻⁴ s⁻¹ ≈ 2 h half-life).
- **Affinity deep dive**
  - KD = koff/kon; [L]/([L]+KD); KD = the ligand concentration at half occupancy; dwell time set by koff alone → standard [16].
  - Antibody ceiling ~0.1 nM → Foote & Eisen 1995.
  - TCR KD 1–100 µM, 10³–10⁶× weaker than mature antibodies; contacts ~1 s to ~1 min; engineered pM TCRs ~10⁶× tighter, with a loss of selectivity → Stone 2009.
  - Mole ≈ 6 × 10²³; induced fit; avidity → standard.
- **Self deep dive**
  - Billingham, Brent & Medawar 1953 (in utero injection; later grafts accepted) → [19].
  - Medawar and Burnet, 1960 Nobel → verified.
  - Matzinger 1994 → [20].
  - Trillions of gut bacteria and many kg of food protein per year → Sender 2016; arithmetic.
- **Census prose**
  - 1.8 T cells, 1.2 kg (2.6 lb) → [1].
  - Neutrophils 36%; macrophages 11% by number and 49% by mass; T cells 25%; plasma cells in the gut 69% ("~70% in GI tract", Sender full text).
  - Location shares: bone marrow 40%, of which 80% neutrophils; lymphatic organs 39%; tissues 18.9%; blood 2.0%; T cells in blood 1.7%.
  - "Four in five" in marrow plus lymphatic organs = 79%.
- **Census figure data**
  - Every column total checks.
  - Mast-cell row sums to 89.3 against 89.1 printed (rounding only).
  - The 184 count squares reproduce exactly by largest remainder (group totals and per-place splits; row and column sums verified).
  - Weight 1,224.8 g → 122 squares; macrophages 60.
- **Clinic (blood count)**: several thousand WBC/µL; ~2% of immune cells and <2% of T cells in blood → [1].
- **Glossary**: all entries are accurate. The bone-marrow entry ("ancestors of all immune cells") is true at the level of cell *types* (see S1). The lymphocyte entry is consistent with Ch 2 and Ch 3.
- **Sources 1–20**: all exist, and the metadata re-checked (1, 4, 5, 6, 11, 12, 13, 14) are correct. Each supports its sentence except as noted in C1.
