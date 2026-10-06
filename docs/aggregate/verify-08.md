# Verification pass 2: Chapter 8, "Releasing the Brakes" (`content/drafts/08-checkpoints.md`)

Verifier: second-pass fact check, 2026-10-06. Every claim in the prose, tables, boxes, figure specs (`spec`, `steps`, `data`), quiz, takeaways, glossary and sources was checked against primary sources. Tools: PubMed full text (PMC), Amass `regulatorycore` (FDA labels), company releases and news. Line numbers refer to the current draft (622 lines).

**Status of the earlier review (`docs/reviews/08-science.md`).**
- All three Must-fixes are resolved correctly:
  - M1: the adrenal and lung bands, the adrenal card and the sources now match Barroso-Sousa [27] and Nishino [30].
  - M2: the step-2 caption, the "moved the median" wording and the 43% crossover caveat are fixed.
  - M3: the fianlimab, tiragolumab and STAR-221 sources are present, dated and labeled as company-reported.
- All Should-fixes S1–S9 are resolved. S2 was resolved with Arce Vargas only, which is adequate. S8 and S9 were resolved by removal or by moving the material to Ch 12.
- All new material checks out except the items below. That includes Ramos-Casals [26] as the new pooled source for the body map, Johnson [29], Faje [28], Larkin [15], Long 2023 [20], Reck 2021 [14], the Emory source, and the 2025–26 events.

---

## 1. Errors (MUST fix)

**E1. "So the PD-1 blockers are built on the IgG4 subclass" (deep-dive "Anatomy of a checkpoint drug", line 126) is no longer true of all US-approved PD-1 blockers.**
- Problem: penpulimab-kcqx was FDA-approved on 23 Apr 2025 (nasopharyngeal carcinoma). Its label describes it as "a humanized monoclonal IgG1 antibody", Fc-engineered to remove effector function. Source: Amass regulatorycore, FDA label §11; Drugs@FDA. Every drug in the table is IgG4, so the sentence is true of the table but false as a general statement.
- Suggested rewrite: "So the PD-1 blockers in the table are built on the IgG4 subclass, which engages these destroy-signals only weakly (a newer one, penpulimab, uses an IgG1 stem engineered to be silent), and atezolizumab and durvalumab are IgG1 antibodies engineered to switch them off."

**E2. "Every approved checkpoint inhibitor is an IgG antibody" (line 115) is false worldwide.**
- Problem: envafolimab (KN035) is a PD-L1 inhibitor approved in China in November 2021. It is a single-domain (camelid-type) antibody fused to an IgG1 Fc, not a conventional IgG. Source: Markham A, "Envafolimab: First Approval", *Drugs* 2022, PMID 35122636.
- The rest of the box is about US approvals ("The main ones approved in the United States"). The statement is true for the US.
- Suggested rewrite: "Every checkpoint inhibitor approved in the United States is an IgG antibody, the most common type in blood, …"

**E3. Body-map "nerves & muscles" band contradicts its own basis and card (figure `ch08-side-effects`, lines 438 and 455).**
- Quote, band: "nerves & muscles rare · rare · rare — serious forms (myasthenia ~1%, myositis ~0.6%) [26]".
- Quote, card: "…is rare, affecting around 1% of patients or fewer [26]."
- Problem: the figure defines "rare" as "under 1% of patients". The stated basis for myasthenia, "~1%" (Ramos-Casals [26] says 1.2%), would put it in "uncommon". The "rare" band is probably the correct call. Large datasets put immune-checkpoint myasthenia at about 0.1–0.2%: for example, 12 of 9,869 nivolumab-treated patients (0.12%) in a Japanese post-marketing survey (Suzuki S et al., *Neurology* 2017;89:1127–1134, PMID 28821685). The 1.2% in [26] is an outlier. Myositis at 0.6% [26] is correctly "rare".
- Fix (keep the band "rare · rare · rare"):
  - Basis line: "serious forms are rare: myositis ~0.6% [26]; myasthenia about 0.1–0.2% in large safety databases [new: Suzuki 2017] (one review gives ~1% [26])".
  - Card: "Serious inflammation of muscles (myositis) or of the nerve–muscle junction (a myasthenia-like weakness) is rare, affecting well under 1% of patients [26][new]. It can occur together with myocarditis."

---

## 2. Unsupported or weakly supported (SHOULD fix)

**U1. Definition of grade 3–4 (line 392).**
- Quote: "'grade 3 or 4,' meaning serious enough to need hospital care, or life-threatening".
- In the standard grading system (CTCAE v5), grade 3 is "severe or medically significant but not immediately life-threatening; hospitalization … indicated; disabling; limiting self-care". Many grade 3 events, such as laboratory abnormalities, need no admission.
- Suggest: "'grade 3 or 4,' meaning severe (often needing hospital care) or life-threatening".

**U2. "Anti-PD-L1 … also blocks PD-L1 from pairing with B7 molecules" (line 128).**
- PD-L1's second partner is CD80 (B7-1) only, not CD86 (B7-2). The chapter glossary defines B7 as "CD80/CD86", so the plural misleads.
- Suggest: "…also blocks PD-L1 from pairing with one of the B7 molecules, CD80."

**U3. Body-map band footnote overstates pooling (lines 424–426 vs 429 and 432).**
- The footnote says the bands are "pooled across trials and cancer types". The skin band comes from one melanoma trial (CheckMate 067 [12]). The combination lung value (6.6% [30]) comes from melanoma studies only.
- Suggest adding to the footnote: "Skin figures come from one melanoma trial; most others are pooled across trials and cancer types."

**U4. Adrenal "under 1% with one drug" is derived, not stated (band, line 435; card, line 452).**
- Barroso-Sousa [27] reports primary adrenal insufficiency of 0.7% overall (43/5,831) and 4.2% with the combination (11/262). It gives no per-drug monotherapy figures. Excluding the combination gives (43−11)/(5,831−262) ≈ 0.6%, so "under 1%" is defensible.
- Ramos-Casals [26] gives a 0.6–2.6% range for primary adrenal insufficiency.
- Suggest "about 1% or less with one drug" or "rare with one drug", and keep "4.2% with both [27]".

**U5. Ambiguous HPV wording (line 346).**
- Quote: "some throat and cervical cancers caused by the human papillomavirus (HPV)".
- This reads as if only some cervical cancers are HPV-driven, when virtually all are.
- Suggest: "throat cancers caused by the human papillomavirus (HPV), and cervical cancers, nearly all of which HPV causes".

**U6. Tail chart: the first two years are unconstrained (data, lines 313–315; low priority).**
- Each CheckMate 067 series goes straight from (0, 100) to (24, …).
- I recomputed the specified Fritsch–Carlson monotone interpolation. At 12 months it gives about 79% (combination), 76% (nivolumab) and 66% (ipilimumab).
- My recollection of the published 1-year Kaplan–Meier estimates (Wolchok 2017 [12], Fig. 1B; not stated in the text or caption) is about 73% / 74% / 67%. If those values are right, the combination curve at 1 year is overstated by about 6 points and wrongly drawn above nivolumab (the published curves cross early).
- I could not confirm these 1-year values from text. Before adding 12-month points, read them off the published figure (Fig. 1B of [12]; the 4-year Lancet Oncol 2018 report may tabulate them). If they cannot be verified, leave the readout's existing "approximate" label as is. It is honest but imprecise.

**U7. Quiz Q3 distractor rationale (line 519; optional nuance).**
- Quote: "the damage comes from T cells attacking healthy tissue, not from the drug molecule."
- For pituitary inflammation, the anterior pituitary itself expresses CTLA-4. Ipilimumab may injure it partly through antibody and complement directly (Iwama S et al., *Sci Transl Med* 2014;6:230ra45, PMID 24695685; also noted in Ramos-Casals [26]).
- The keyed answer still stands. A softer wording avoids an expert objection: "No: the damage is immune-mediated (mainly T cells attacking healthy tissue), not a chemical poisoning."

---

## 3. Citation problems

**C1. Isotype sentence cited only to Sharma [4] (line 126).**
- [4] states only that ipilimumab is IgG1 and tremelimumab IgG2. Nothing in [4] supports the other claims:
  - the IgG4 subclass of the PD-1 blockers;
  - the Fc-silenced IgG1 of atezolizumab and durvalumab;
  - avelumab's active IgG1.
- The claims are correct (FDA labels, §11). Add a source, e.g. the FDA labels via Drugs@FDA, or a review of checkpoint antibody isotypes.

**C2. Carter opening (line 9) is only partly supported by [1].**
- The Emory News Center piece supports the liver tumor's removal by Winship (Emory, Atlanta) doctors, metastatic melanoma, and "four additional tumors on his brain".
- It does not give the August 2015 date or his age. Both are correct: surgery on 3 Aug 2015; born 1 Oct 1924, so aged 90.
- Optional: add CNN, 3 Aug 2015 (surgery date), or let [2] carry the timeline.

**C3. Regulatory facts without a source (lines 360, 362, 370).**
- Uncited: the 2017 MSI-H/dMMR tissue-agnostic approval, the 2020 TMB-H approval and the 2022 Opdualag approval. All are correct.
- Optional: cite the FDA approval summaries, Marcus L et al. *Clin Cancer Res* 2019;25:3753 (PMID 30787022) and 2021;27:4685 (PMID 34083238), or FDA notices.

**C4. "Several companies are developing anti-CTLA-4 antibodies with Fc stems engineered to grip Fc receptors harder" (line 217) is uncited.**
- Correct (e.g., botensilimab; non-fucosylated ipilimumab, BMS-986218). Optional source.

No citation is fabricated or mismatched. All 31 entries resolve to the stated work, and author, journal, year, volume, pages and DOI match PubMed. The PMIDs are 39887747, 30054281, 39282897, 32919526, 31359002, 35121991, 29576375, 27501248, 21639810, 28889792, 25667295, 33872070, 31562797, 26028255, 25482239, 33736924, 34986285, 38320023, 31221619, 42507968, 32382051, 28973656, 29975414, 27806233, 27540850 and 30193240. The web sources for [1], [2], [23], [24] and [25] were fetched, and their dates match.

---

## 4. Claims verified OK (claim → source)

**Carter**
- Liver tumor removed by Emory/Winship doctors; melanoma; four brain tumors; pembrolizumab; December 2015 clear scan; March 2016 no more treatment → [1] Emory; [2] STAT/AP.
- Pembrolizumab approved for melanoma in Sept 2014; died 29 Dec 2024, aged 100 → public record.

**Checkpoint drugs**
- 11 checkpoint inhibitors for 20 tumor types by 2023; 56.55% eligible and 20.13% responding (≈57/100 and 20/100, about one in three of those eligible) → Haslam [3], PMID 39887747.
- Table drugs, targets and brands, including cosibelimab (IgG1λ, Dec 2024) → FDA labels (Amass).
- Ipilimumab IgG1 and tremelimumab IgG2 → [4].
- Nivolumab every 2 weeks → [5]; pembrolizumab every 3 weeks for up to 35 cycles → [6], [14].

**Fc and Tregs**
- Human-FcγR mice: ipilimumab- and tremelimumab-isotype antibodies deplete intratumoral Tregs, and enhanced-FcγR versions work better → Arce Vargas [9] abstract.
- CD16a-V158F allele associated with response in inflamed tumors → [9].
- Melanoma 19, prostate 17, bladder 9 (ipilimumab) and paired melanoma 18 (tremelimumab); more CD4 and CD8 cells; FOXP3+ cells not depleted → Sharma [4].

**Where responding T cells come from**
- LCMV: burst "almost exclusively" from TCF1+ cells found in lymphoid tissues → Im [10].
- Stanford; BCC/SCC; 28,371 T cells with paired TCRs (79,046 cells in total); expanded clones were novel clonotypes → Yost [7] (full text).
- 47 biopsies from 36 NSCLC patients; Texp expand by local expansion plus peripheral replenishment with new and pre-existing clones ("clonal revival") → Liu [8].

**The tail of the curve**
- Dacarbazine: median 9.1 months; OS 36.3% / 17.9% / 12.2% at 1 / 2 / 3 years; 11.2 months with ipilimumab → Robert [11].
- Ipilimumab was the first therapy to prolong OS in randomized phase 3 trials → [12] introduction.
- Pooled 1,861 patients; plateau from about year 3 at ~21–22%; follow-up up to 10 years → Schadendorf [13].
- CheckMate 067, from the 10-year NEJM full text, PMC12080919 [5]:
  - N = 945, enrolled July 2013–March 2014, minimum follow-up 120 months;
  - median OS 71.9 / 36.9 / 19.9 months; 10-year OS 43 / 37 / 19%; 7.5-year OS 48 / 42 / 22%;
  - HR 0.53 (combination vs ipilimumab) and 0.85 (0.69–1.05) (combination vs nivolumab, descriptive);
  - 10-year MSS 52 / 44 / 23%;
  - progression-free at 3 years 31.8 / 24.7 / 6.7%, with 10-year MSS 96 / 97 / 88% in that group;
  - stopped during induction for toxicity: 10-year OS 43%;
  - immune-modulating medicines in the first 6 months: MSS 59 vs 56% (combination) and 53 vs 46% (nivolumab);
  - confirmed ORR 50.0%, unconfirmed 58.3%;
  - nivolumab MSS by PD-L1: 54% (≥5%) vs 43% (<5%);
  - "half die from melanoma".
- CheckMate 067 3-year paper [12]:
  - OS 64 / 59 / 45% at 2 years and 58 / 52 / 34% at 3 years;
  - 43% of the ipilimumab arm later received anti-PD-1;
  - PD-L1 AUC 0.56–0.57;
  - any-grade TRAEs 96 / 86 / 86%; grade 3–4 TRAEs 59 / 21 / 28%;
  - skin 62 / 46 / 56%;
  - severe events mostly resolved in 3–4 weeks, except endocrine.
- Five-year OS 52 / 44 / 26% → Larkin [15].
- "About two points a year after year 3": 58→43, 52→37 and 34→19 over 7 years, about 2.1 points a year per arm (arithmetic).
- KEYNOTE-024: 305 patients; 5-year OS 31.9% vs 16.3%; 66.0% effective crossover → Reck [14].

**Who responds, and biomarkers**
- dMMR: 1,782 vs 73 mutations; 4/10 vs 0/18 colorectal responses → Le [16].
- Hodgkin lymphoma: 20/23 responded → Ansell [17].
- KEYNOTE-158: 10 tumor types; ORR 29% (TMB-high) vs 6% → Marabelle [6].
- More than 1,500 patients (N = 1,551): ORR 39.8% in melanoma, lung and bladder; 15.3% in breast, prostate and glioma, lower than TMB-low (OR 0.46) → McGrail [18].
- MSI-H tissue-agnostic approval 2017; TMB-H (≥10 mut/Mb) 2020 → FDA.

**Add-ons**
- RELATIVITY-047: n = 714; PFS 10.1 vs 4.6 months; grade 3–4 TRAEs 18.9 vs 9.7% → Tawbi [19].
- RELATIVITY-047 OS HR 0.80 (0.64–1.01), P = 0.059 vs a threshold of 0.043 → Long 2023 [20].
- Opdualag approved 2022 → FDA.
- ECHO-301: n = 706; PFS 4.7 vs 4.9 months → Long 2019 [21].
- SKYSCRAPER-01: 521 randomized; PFS and OS not significant (OS HR 0.87) → Peters [22] (PMID 42507968).
- Fianlimab: 15 May 2026; n = 1,546; PFS 11.5 vs 6.4 months; HR 0.845, P = 0.063; not significant; head-to-head vs Opdualag ongoing → Regeneron release [23] (fetched).
- Tiragolumab program stopped July 2025 after about 5,000 patients; liver and lung trials failed → ApexOnco [24] (fetched).
- STAR-221 stopped 12 Dec 2025 at interim OS vs nivolumab plus chemotherapy; HER2-negative gastric/esophageal cancer → Gilead [25] (fetched).

**Side effects (prose)**
- Ipilimumab more often colitis and hypophysitis; PD-1 blockers more often hypothyroidism and pneumonitis → Ramos-Casals [26] (odds ratios).
- Onset can come ≥1 year after therapy; steroids plus other immunosuppressants; fibrotic lung damage → [26].
- Fatality 0.36% / 0.38% / 1.08% / 1.23% (≈1 in 270, 1 in 90, 1 in 80) → [26].
- Myocarditis mortality 48% ("nearly half") → [26].
- Hypothyroidism 3.8 / 7.0 / 13.2%; hypophysitis 3.2 / 0.4 / 6.4%; adrenal 4.2% with the combination; insulin-deficient diabetes 0.2% → Barroso-Sousa [27].
- High-dose steroids for ipilimumab hypophysitis associated with shorter OS (HR 0.24 favoring low dose) → Faje [28].
- Severe myocarditis 0.06% (nivolumab) and 0.27% (combination) (≈1 in 1,700 and 1 in 370); median onset 17 days; PD-L1 on injured myocytes in two patients → Johnson [29] (full text).

**Body-map bands (all correct except E3)**
- Colitis 1 / 12 / 14%; diarrhea ~20 / 35 / >40% → [26].
- Hepatitis 1–6 / 1–25 / 17–22% → [26].
- Pneumonitis ~1–3% with PD-1/PD-L1 monotherapy → [26]; 6.6% with the combination in melanoma → [30].
- 70% of CTLA-4 deaths from colitis; 35% of PD-(L)1 deaths from pneumonitis → [26].
- Arthralgia 8%, arthritis 1%; AKI 2.2%; ocular <1%; type 1 diabetes ≤1% → [26].

**Pseudo- and hyperprogression**
- RECIST definition of progression → standard.
- Pseudoprogression 4.7%; hyperprogression 13.8% vs 5.1% in 59 chemotherapy patients; median OS 3.4 months → Ferrara [31].

**Biology and glossary**
- CTLA-4 binds B7 more tightly than CD28; Tregs carry the most CTLA-4; Ctla4-knockout mice die within weeks; PD-L1 is interferon-γ inducible; immune-synapse gap ~15 nm → standard immunology.
- Glossary definitions → consistent with the sources above.
- Quiz keys → correct.
- Takeaways → consistent with the text.
