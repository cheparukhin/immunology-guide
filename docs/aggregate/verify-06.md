# Verification pass 2 — Chapter 6, "When Cells Go Rogue" (`content/drafts/06-cancer.md`)

Second-pass, independent re-verification of **every** specific claim in the current draft (prose, callouts, Go-deeper boxes, all four figure specs including `spec`, `steps`, `data`, quiz, takeaways, glossary, sources). Line numbers = the draft as of 2026-10-06. Tools: PubMed/PMC primary full texts, NCBI nuccore (KRAS reference sequence), cBioPortal API (the `ch06-tmb` data were **recomputed from scratch**), Amass regulatorycore, web sources for FDA records.

**Headline:** the first review's five Must-fixes (M1 HLA-A\*02 in Patient B, M2 short DNA strip, M3 CRUK 42%, M4 driver-counter band, M5 pediatric cohort description) are all correctly resolved, as are S1–S16 except S2. The `ch06-tmb` data block is exact: I independently recomputed 13 of its rows from cBioPortal and every p10/p25/median/p75/p90, every n, and every zero-exclusion count matched to the digit. Two new errors remain (one a number introduced in revision, one an "only" claim inside a figure card), plus five citation problems.

---

## 1. Errors (MUST fix)

**E1. Line 617 — the NY-ESO-1 synovial-sarcoma numbers are misstated**
- Quote: "Shared antigens are patchy too: of 25 synovial sarcomas carrying NY-ESO-1, 6 carried it on only some of their cells.[^28]"
- What's wrong: only **20 of the 25** sarcomas carried NY-ESO-1 at all. The 6 heterogeneous cases are 6 of those 20 positives, not 6 of 25 carriers. As written the sentence states that all 25 carried the antigen, which the cited paper contradicts.
- Correct fact: Jungbluth AA, et al. *Int J Cancer* 2001;94:252–256 — "NY-ESO-1 immunoreactivity was found in 20/25 (80%) cases, and antigen expression was homogeneous in 14/20 NY-ESO-1-positive cases." (PMID 11668506, doi:10.1002/ijc.1451)
- Suggested rewrite: "Shared antigens are patchy too: of 25 synovial sarcomas, 20 carried NY-ESO-1 — and in 6 of those it was on only some of the cells.[^28]"

**E2. Figure `ch06-antigen-kinds`, KRAS G12D detail card (line 292) — "the one type proven to display it" is false**
- Quote: "The catch: Each person's HLA molecules decide whether the mutant fragment is displayed at all; the one type proven to display it, HLA-C\*08:02, is carried by roughly 8% of white and 11% of Black Americans."
- What's wrong: HLA-C\*08:02 is the clinically validated presenter (Tran 2016), but it is **not** the only HLA type proven to present KRAS G12D. **HLA-A\*11:01** presents the G12D decamer VVVGADGVGK: an affinity-matured TCR against that pMHC was characterized with crystal structures and used to build a bispecific (Poole A, et al. *Nat Commun* 2022;13:5333, PMID 36088370, doi:10.1038/s41467-022-32811-1), and HLA-A\*11:01-restricted TCRs against G12D recognized HLA-A\*11:01⁺ human tumor lines and controlled an established G12D⁺ pancreatic xenograft (Wang QJ, et al. *Cancer Immunol Res* 2016;4:204–214, PMID 26701267, doi:10.1158/2326-6066.CIR-15-0188). The card also contradicts this draft's own builder note in `ch06-typo-to-target` (lines 437–440: "peptides spanning codon-12 mutant KRAS have published reports of binding all three [A\*02, A\*03, A\*11]").
- Suggested rewrite: "…The catch: Each person's HLA molecules decide whether the mutant fragment is displayed at all. The best-documented type, HLA-C\*08:02 — the one validated in a treated patient — is carried by roughly 8% of white and 11% of Black Americans; HLA-A\*11:01 can display a longer version of the same fragment. Many people's types display it poorly or not at all."
- (The main-text sentences at lines 349 and 362 are correctly hedged — "one particular version of one display gene", "most likely have been invisible" — and need no change.)

---

## 2. Unsupported or weakly supported (SHOULD fix)

**U1. Line 232 — why HPV-driven cancers occur in immunocompetent people has no source.**
Quote: "They are not free wins: such cancers do arise in people with working immune systems, because the viral proteins are made in small amounts and the tumors learn to dim their displays (Chapter 7)." Correct in substance, but no citation supports either half. Add a source for HPV⁺ tumor immune evasion (HLA loss / low interferon signaling) or explicitly flag it as forward-looking to Chapter 7.

**U2. Line 608 (clinic box) — the sporadic/Lynch split is slightly off, and the stage-IV number is rounded the wrong way.**
Quote: "About 15% of them turn out to be deficient: roughly three-quarters of those because the tumor silenced a repair gene by itself, and the rest because of an inherited fault — Lynch syndrome… (In cancers that have already spread, the share is smaller, closer to one in twenty.[^21])" The conventional decomposition is ~12% sporadic (usually *MLH1* promoter hypermethylation) + ~3% Lynch out of ~15% — i.e. **four-fifths / one-fifth**, not three-quarters. And Le 2017 reports "8% of stage I to stage III cancers and **4%** of stage IV cancers were MMR-deficient" (across 11 tumor types) — i.e. about 1 in 25, not 1 in 20. Suggested: "roughly four-fifths of those because the tumor silenced a repair gene itself… (In cancers that have already spread, the share is about 4%.)"

**U3. Line 478 — "roughly ten times as many mutations" is sourced to a paper that gives no fold change.**
[^21] (Le 2017) says only that MMR-deficient genomes "harbor hundreds to thousands of somatic mutations". The ~11× figure comes from this chapter's own `ch06-tmb` data (colorectal 36.65 vs 3.30; endometrium 20.00 vs 1.83 per Mb — both recomputed and confirmed). Point the reader at the figure, or add a fold-change source.

**U4. Line 241 — the NY-ESO-1 discovery story is accurate but uncited at the primary level.**
"In 1997, Lloyd Old's group found NY-ESO-1 by a different route, screening tumor proteins against a patient's own antibodies." True (SEREX on an esophageal squamous-cell carcinoma; Old senior author) — Chen YT, et al. *PNAS* 1997;94:1914–1918, PMID 9050879, doi:10.1073/pnas.94.5.1914 — but neither [^16] nor [^17] names that paper or Old. Add the primary citation (same point was O1 in the first review, still open).

**U5. `ch06-tmb` data block, summary line (line 602) — the only figure numbers I could not reproduce.**
"all 32 TCGA cancer types together (n = 10,105 after excluding zeros) median 2.0". Every per-row value I checked is exact, so this is almost certainly right (and Gröbner's published TCGA-adult median of 1.8 is consistent), but it is the one number in the block not verifiable from the rows shown. Worth a second internal check before publication.

**U6. Figure `ch06-antigen-kinds`, personal-neoantigen card (line 288) — status wording now lags the interlude.**
"Used by: Personalized vaccines (in trials, Chapter 11)". Still true (no approval), but as of August 2026 a personalized neoantigen mRNA vaccine has a **company-reported** positive phase 3 (INTerpath-001). For cross-chapter consistency with the interlude and Ch 11, consider "in trials — one met its main goal in a phase 3 melanoma trial in 2026 (company-reported), not yet approved".

---

## 3. Citation problems

**C1. [^2] (Yachida 2010) still cited for "the most common cause of death from cancer" (line 21).** Carried over unresolved from the first review (S2). Yachida S, et al. *Nature* 2010;467:1114–1117 is about the *timing* of pancreatic metastasis and says nothing about the share of cancer deaths. (Its two other uses, lines 76 and 78, are correct.) Fix: cite Dillekås H, Rogers MS, Straume O. *Cancer Med* 2019;8:5574–5576 (PMID 31397113, doi:10.1002/cam4.2474), or drop the marker and keep the unquantified wording.

**C2. [^6] (de Martel 2020) cited for EBV latency (line 232).** Quote: "Epstein–Barr virus drives some lymphomas and nasopharyngeal cancers similarly, but those are craftier still, keeping only one or two viral proteins that T cells happen to see badly.[^6]" de Martel C, et al. *Lancet Glob Health* 2020;8:e180–e190 is a worldwide incidence analysis of infection-attributable cancers; it contains nothing about restricted latency programs or epitope visibility. Fix: cite an EBV-latency source (e.g. Young LS, Rickinson AB. *Nat Rev Cancer* 2004;4:757–768) for that clause and keep [^6] only for EBV *causation*.

**C3. [^5] + [^25] cited for the uveal-vs-skin melanoma contrast (line 476).** Quote: "melanomas of sun-exposed skin and lung cancers of smokers sit at the top, while melanoma of the eye sits near the bottom — the same kind of cell, shielded from sunlight.[^5][^25]" I searched both full texts: **neither mentions uveal or ocular melanoma** (Vogelstein 2013, PMC3749880: 0 hits; Gröbner 2018 is a childhood-cancer cohort containing retinoblastoma, not uveal melanoma). The claim is true and is supported by this chapter's own figure data (TCGA-UVM median 0.40 vs skin melanoma 14.88 per Mb — both recomputed), but not by the two markers attached. Fix: cite the figure, or add a uveal-TMB source.

**C4. [^24] (Lawrence 2013) attached to the "150-fold" clause (line 474).** Quote: "typical tumors of different kinds differ about 150-fold, and individual tumors more than a thousandfold.[^24]" Lawrence's own wording is the opposite for the first clause: "the median frequency of non-synonymous mutations varied by **more than 1000-fold across cancer types**"; it also says "Mutation frequencies vary more than 1000-fold between lowest and highest mutation rates across cancer and also within several tumor types" (PMC3919509). The 150× figure is this chapter's own computation on one consistent method (B-ALL 0.10 → skin melanoma 14.88 = 149×). Fix: attribute 150× to the figure and keep [^24] for ">1,000-fold between individual tumors".

**C5. Figure `ch06-antigen-kinds` data block (line 333) — check the Loibl & Gianni page range.** The block cites "Loibl S, Gianni L. Lancet 2017;389:2415–2429"; this matches *HER2-positive breast cancer* (PMID 27939064). Fine as a figure-internal reference, but it is not in the chapter's numbered source list while being load-bearing for the HER2 cardiac-expression claim in the card — consider promoting it or cross-referencing [^16].

---

## 4. Verified OK (claim → source)

**Opening / mutation sources**
- 2015 study, 74 cancer genes sequenced (not whole genomes), 234 biopsies, four donors aged 55–73, eyelid (blepharoplasty), "patchwork of thousands of evolving clones", ~140 driver mutations/cm², "over a quarter" / 18–32% of cells → Martincorena 2015, PMC4471149 (verbatim checks on all six).
- ~6 billion DNA letters; ~3 new mutations per stem-cell division → Tomasetti 2017, PMC5852673 ("about three mutations occur every time a normal cell divides").
- Smokers' lung cancers ~10× mutations; 2–8 drivers; 20–30 years; *TP53* most frequently mutated; APC→KRAS→TP53 colorectal sequence → Vogelstein 2013, PMC3749880 (all verbatim).
- 2.2 M infection-attributable cancers, ~1 in 8, led by *H. pylori*/HPV/HBV/HCV → de Martel 2020 (13%).
- UV and tobacco mutational signatures → Alexandrov 2013 [^4] (correctly re-pointed since review S3).
- HER2 "more than twentyfold in some tumors" → Slamon 1987 ("2- to >20-fold").
- *BRCA1/2*, mismatch-repair genes, Lynch syndrome framing → standard; consistent with [^27].

**Bad-luck deep dive**
- 31 tissues, r = 0.81, "only about a third of the variation among tissues" → Tomasetti & Vogelstein 2015 (PMC4446723).
- Wu 2016: intrinsic factors "<~10–30% of lifetime risk" (PMC4836858).
- 69 countries, median correlation 0.80; 32 UK cancer types; **66% / 29% / 5% of *driver* mutations** (review S1 correctly applied) → Tomasetti 2017, verbatim: "29% … attributable to E, 5% … to H, and 66% … to R".
- "about 4 in 10 UK cancers — 38%" → Brown 2018 (PMC5931106; 37.7% UK 2015) — review M3 resolved, and the obsolete 42% is gone.
- The lung-adenocarcinoma "one of three hits" argument → Tomasetti 2017's own worked example (89% preventable, 35% of drivers from R).

**Two hits / evolution**
- Knudson 1971: "48 cases", carriers average ~3 tumors → PMC389051 (review O9 applied).
- HPV E6/E7 disable p53 and RB → zur Hausen 2002 (PMID 12044010).
- Nowell 1976, American pathologist, variation–selection–expansion → PMID 959840.
- TRACERx: 100 early NSCLC, 327 regions, clonal major drivers, subclonal drivers in >75% → Jamal-Hanjani 2017 (PMID 28445112, abstract verbatim).
- Hallmarks 2000 (six) / 2011 ("provisionally added two") / 2022 new dimensions incl. phenotypic plasticity, non-mutational epigenetic reprogramming, polymorphic microbiomes, senescent cells, framed as provisional → PMIDs 10647931, 21376230, 35022204 (review O2 applied).

**Tumor antigens**
- Four-kind taxonomy, melanocyte differentiation antigens → Coulie 2014 (PMID 24457417).
- ">200 proteins", male germ cells devoid of HLA class I, testis-selective/testis-brain classes, brain/placenta expression, thymic epithelial expression, MAGE-A12/brain deaths, MAGE-A1/A4 20%/9% primaries vs 51%/44% metastases, MAGE-1 found by autologous typing in a patient with a favorable course → Gjerstorff 2015, PMC4599236 (all verbatim; review S7 applied).
- MAGE-A1 1991 discovery, Brussels, silent in normal tissues examined → van der Bruggen 1991 (PMID 1840703).
- Vitiligo in 3.4% of 5,737 melanoma patients, better outcomes → Teulings 2015 (PMID 25605840).
- HER2 low-level normal expression incl. heart muscle → Loibl & Gianni 2017 (review S9 applied).
- 2010 HER2-CAR death attributed to low ERBB2 on lung epithelium; Mol Ther 2010;18:843–851, doi:10.1038/mt.2010.24 → Morgan 2010 (PMID 20179677).
- Afamitresgene autoleucel (Tecelra), MAGE-A4, HLA-A\*02 types, accelerated approval early Aug 2024 → FDA (approval letter 1 Aug / announcement 2 Aug 2024).
- Preventive HPV vaccines built from L1, not E6/E7 → correct.

**KRAS case and the five gates**
- Tran 2016 in full: 50-year-old woman, metastatic colorectal, KRAS G12D, HLA-C\*08:02-restricted, four clonotypes, GADGVGKSA (9-mer) + GADGVGKSAL (10-mer), ~1.11×10¹¹ cells ("about a hundred billion"), all seven lung metastases regressed, one lesion progressed at 9 months with loss of the chromosome 6 haplotype carrying HLA-C\*08:02, G12D in ~45% of pancreatic / 13% of colorectal, "approximately 8% of whites and 11% of blacks" → PMC5178827 (every item verbatim; review S5 applied in both places).
- **`ch06-typo-to-target` DNA strip re-verified against the reference sequence**: NM_004985 CDS codons 1–18 = `ATG ACT GAA TAT AAA CTT GTG GTA GTT GGA GCT GGT GGC GTA GGC AAG AGT GCC` — character-for-character identical to the spec (NCBI nuccore efetch), and identical in NM_033360, as the spec claims. Codon 12 GGT→GAT = G→D ✓; protein MTEYKLVVVGAGGVGKSA ✓; GADGVGKSA = residues 10–18 ✓ (review M2 fully resolved).
- 1.6% of protein-changing mutations immunogenic; 99% unique; 75 gastrointestinal-cancer patients → Parkhurst 2019 (PMID 31164343, abstract verbatim).
- TESLA: 608 peptides tested, 37 immunogenic; four-feature model "filtering out 98% of non-immunogenic peptides while preserving 45% of immunogenic ones"; immunogenic peptides "significantly less hydrophobic"; 10-mers enriched for mutations at presented positions 3–7 → Wells 2020, PMC7652061 (review S8 applied exactly, including the "more than half of the real ones" cost).
- Anchor-creating mutation: wild-type counterpart differing in the two carboxy-terminal amino acids bound HLA ">100 fold lower affinity than the mutant" → Le 2017, PMC5576142.
- Class II neoantigens: 6 melanoma patients, CD4 responses to 58 (60%) and CD8 to 15 (16%) of 97 neoantigens → Ott 2017, PMC5577644 (verbatim).
- TAP named once in the deep dive (review O3 applied); frameshift/NMD caveat added (S11); "the mutant KRAS gene is switched on… cannot afford to switch it off" (S12).

**TMB chart — recomputed independently from cBioPortal (every value matched)**
- Skin melanoma (n=440): 2.52 / 7.04 / **14.88** / 31.39 / 54.30, max 1052 → matches the row and the note "the highest single tumor… lies above 1,000 per megabase, beyond the axis" (review O7 resolved).
- Uveal melanoma (n=80): 0.23/0.30/**0.40**/0.51/0.63 → 37× below skin melanoma, matching "about forty times fewer" in the alt text.
- Lung squamous (n=469): 3.76/5.60/**7.93**/11.33/17.23. Lung adeno (n=561): 1.33/2.83/**6.73**/13.70/23.07.
- Colorectal MSS (n=442) **3.30** vs MSI-H (n=84) **36.65** = 11.1× ✓; endometrium MSS (n=352) **1.83** vs MSI-H (n=161) **20.00** = 10.9× ✓ (MANTIS > 0.4, Bonneville threshold).
- Breast (n=1009, 57 zeros), ovary (n=409, 114 zeros), kidney clear cell (n=356, 46 zeros), stomach (n=435) — all match, including the stated zero-exclusion counts.
- Stomach MSI-H share = 19.1% → "about one in five here" ✓.
- Childhood rows from `pediatric_dkfz_2017`: B-ALL (n=42) median 0.10; retinoblastoma (n=29) 0.10; medulloblastoma (n=215) 0.33 — all match; 879 primary tumors in the study, **795** with mutation calls, **771** nonzero, median 0.233 → exactly the figures in the revised source line and summary row.
- Cohort description now correct: 961 tumors / 24 molecular types / children, adolescents and young adults, and the published 0.13 vs 1.8 per Mb reconciliation → Gröbner 2018 (PMID 29489754, abstract verbatim) — review M5 fully resolved.
- 150-fold bracket (0.10 → 14.9) and 29 rows = 27 types with colorectal and endometrium split → internally consistent; 12-row default list matches the captions (review S10 resolved).
- Kidney row note (highest indel share, ninefold indel-neoantigen enrichment) → Turajlic 2017; MSI threshold → Bonneville 2017 (review O5 applied); "32 of the 33 studies" (O6 applied); metastatic-melanoma caveat now in the visible source line (O10 applied).

**Biomarkers, trunk/branch, clinic**
- 27 tumor types, r = 0.74 → "55% of the differences in the objective response rate"; Merkel-cell carcinoma above the line as a viral-antigen outlier → Yarchoan 2017, PMC6549688 (verbatim).
- Clonal-neoantigen burden and survival in lung adenocarcinoma; better checkpoint-blockade sensitivity in clonal-neoantigen-rich advanced NSCLC and melanoma → McGranahan 2016 (PMID 26940869).
- Universal dMMR testing of newly diagnosed colorectal cancer recommended by ASCP/CAP/AMP/ASCO → Sepulveda 2017 (PMID 28185757); ~15% dMMR overall is the standard figure (see U2 for the split).

**Quiz, takeaways, glossary, sources**
- All four quiz items and every distractor rationale are scientifically correct (p53 vs PD-1; HLA type decides display; mismatch repair vs division rate; cancer-testis antigens are human proteins and often patchy).
- Takeaways all trace to verified numbers (2–8 drivers; 1.6%; >1,000-fold; four antigen kinds; "avoiding immune destruction" as a recognized hallmark).
- Glossary: all 45 entries accurate as written; the two entries flagged in the first review (`cancer-testis-antigen`, `tumor-mutational-burden`) are correctly rewritten.
- Source list: 28 entries (down from 35), all exist with correct authors/journal/year/volume/pages/DOI — verified by DOI→PMID resolution and citation lookup for every entry (PMIDs: 25999502, 20981102, 25554788+28336671, 23945592, 23539594, 31862245, 26675728, 29567982, 3798106, 5279523, 12044010, 959840, 28445112+26940869, 10647931+21376230, 35022204, 24457417, 26158218, 25605840, 27959684, 31164343, 28596308, 33038342, 28678778, 23770567, 29489754, 29262275, 28185757, 11668506). No orphan markers.
