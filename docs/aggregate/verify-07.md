# Verification pass 2 — Chapter 7, "Hide and Seek" (`content/drafts/07-escape.md`)

Second-pass, independent re-verification of every specific claim in the current draft (prose, callouts, Go-deeper boxes, all three figure specs including `spec`, `steps`, `data` — including every row of the transplant-evidence chart — quiz, takeaways, glossary, sources). Line numbers = the draft as of 2026-10-06. Tools: PubMed/PMC primary full texts (Engels 2011 Table 2 re-extracted row by row; Jin 2024 full text), Amass regulatorycore, web sources for the 2026 regulatory and company items.

**Headline:** all six Must-fixes and all eight Should-fixes from the first review are correctly resolved, and so are O2–O13. I found **no factual errors**. The `ch07-evidence` chart is now exact — I re-extracted Engels Table 2 and every one of the 14 SIRs, all 14 confidence intervals, and every organ-specific note matches. What remains is four soft spots (one understated trial result, three uncited mechanistic statements) and two small citation gaps.

---

## 1. Errors (MUST fix)

**None found.** Every number, name, date, mechanism and "first/only/most" claim in the current draft checks out against a primary source. In particular, the previously flagged items are now right:

- Liver row is encoded as an artifact, with the note "Mostly cancers already present in the diseased liver that was removed at transplant… Not raised in kidney or heart recipients; after the first 6 months, liver recipients' rate was about 2×" → Engels: 95.4% of liver cancers in liver recipients diagnosed in the first 6 months, "probably an artifact of delayed recognition or reporting"; SIR 2.22 (1.57–3.04) thereafter; "Among recipients of other organs, liver cancer risk showed no elevation" (PMC3310893, verbatim). Liver is also removed from the alt text's list of largest rises. (M1 resolved.)
- Transplant test now runs at **Strong** pressure with explicit tuning targets ("rejected in roughly 4–6 of 10", "grows in at least 9 of 10") and captions say "about 40%", not "usually" (M2 resolved).
- Line 312 now reads "skipping the first three steps — but those killers must still reach the tumor, get in and kill", matching the figure's own RULE (M3 resolved).
- Line 144: "Azathioprine and cyclosporine are classified as human carcinogens, causing lymphoma and skin squamous-cell carcinoma" — the unsupported bladder-cancer clause is gone (M4 resolved).
- Line 53 melanoma "about twofold" now cites [^4][^5] and adds "but not in people with HIV" (M5 resolved).
- CAR-T status pill: "Approved in blood cancers; first solid-tumor approval (stomach cancer, China, 2026)" — verified: China's NMPA approved satricabtagene autoleucel (satri-cel, Claudin18.2 CAR-T) on **22 June 2026** for CLDN18.2-positive, HER2-negative advanced gastric/gastro-oesophageal junction adenocarcinoma after ≥2 prior lines; it is the world's first CAR-T approved for a solid tumor (CARsgen announcement; OncLive, 22 Jun 2026). (M6 resolved.)

---

## 2. Unsupported or weakly supported (SHOULD fix)

**U1. Line 370 — the TGF-β translation result is understated.**
Quote: "when a drug that blocks both TGF-β and PD-L1 was tested in a large lung-cancer trial, it did no better than a standard PD-1 blocker.[^18]" True but soft: bintrafusp alfa was stopped for futility and was numerically **worse** — median PFS 7.0 vs 11.1 months against pembrolizumab in PD-L1-high NSCLC, with more grade 3–4 toxicity (Cho BC, et al. *J Thorac Oncol* 2023;18:1731–1742, PMID 37597750). Suggested: "…it did no better — in fact its results were numerically worse, with more severe side effects."

**U2. Line 308 — antigen spreading is stated without a source.**
Quote: "T cells release IFN-γ and other cytokines that help keep nearby dendritic cells alert. The debris can then be presented, recruiting T cells against new targets — antigen spreading." Mechanistically standard and consistent with [^12]/[^14], but no marker is attached to a paragraph that introduces a glossary term. Attach [^12] or [^14].

**U3. Line 334 — "Tumors have six main escape routes" is the chapter's own taxonomy.**
The six routes are individually well sourced (B2M/HLA loss [^11], PD-L1 [^15], suppressive cells [^16], CAFs/TGF-β [^17], metabolic [^19], JAK1/2 [^22]), but the count of six is editorial. Fine for a lay guide; just make sure Chapter 12 uses the same six, since the chapter presents it as a list a reader can memorize ("The sixth escape route, going deaf…" appears in the `ch07-tme` spec, so the number is load-bearing across two figures).

**U4. Line 342 — the NK "price of hiding" claim is uncited here.**
Quote: "A cell with an empty shop window is exactly what NK cells look for — 'missing self' (Chapter 2) — especially if it also shows signs of stress. A tumor that hides from T cells must find ways to dodge NK cells as well." Correct (and the stress-ligand caveat is the right one, matching quiz Q4), but it rests on Chapter 2's sources rather than any marker in this chapter. One citation would close it.

**U5. Line 51 — "Part of that is probably because the same immune cells keep the viruses themselves in check" is an interpretation, correctly hedged.**
Supported by Jin 2024's discussion; keep the hedge ("probably", "strongest for infection-driven cancers"). No change needed, noted for completeness.

---

## 3. Citation problems

**C1. Stutman 1974 is still not in the source list.** Lines 25 and 36 describe the 1974 nude-mouse experiment and its three confounders, citing [^2] (Dunn 2002) and [^3] (Shankaran 2001). Both support the claim, and the primary paper confirms it verbatim — Stutman O. *Science* 1974;183:534–536 (PMID 4588620, doi:10.1126/science.183.4124.534): "Athymic-nude (nu/nu) mice and normal (nu/+) mice showed no differences in either latent period or incidence of local sarcomas or lung adenomas within 120 days… These results argue against an active role of thymus-dependent immunity as a surveillance mechanism". Worth adding as a primary citation (first review O1, still open). Note also a small mismatch worth a glance: Stutman's abstract says **120 days**, while this chapter's 1974 sentence carries no interval (fine) — the "After 160 days" at line 29 belongs to Shankaran, not Stutman, and is correctly placed.

**C2. Line 148 — the "113 studies" figure is a sum the cited paper never prints.**
Quote: "a 2024 meta-analysis of 113 studies found eight cancers raised only in transplant recipients…" Jin 2024 states "46 studies in PLHIV and 67 in solid organ transplant recipients were included" (46 + 67 = 113) and "Eight types of cancer with no known viral cause showed an increased risk in solid organ transplant recipients only; no cancer type showed increased risk in PLHIV only" (PMC11246791, verbatim). The arithmetic is right and the chart's own source line says "67 transplant studies", so the two numbers in the chapter (67 and 113) refer to different things. Consider "a 2024 meta-analysis that pooled 113 studies — 67 in transplant recipients and 46 in people with HIV" so the figures can't read as inconsistent.

---

## 4. Verified OK (claim → source)

**Kidney-donor case (MacKie 2003, PMID 12571271)** — 62-year-old donor, melanoma excised 16 years earlier, died of a cerebral haemorrhage in 1998, "considered cured"; both recipients developed melanoma in/around the grafts within ~2 years with no primary of their own; the female recipient died in 2000; for the male, immunosuppression was stopped, interferon given, the graft rejected and removed, and he was well two years after the melanoma diagnosis. The revised line 13 ("which was then removed, tumor and all: he gave up his transplant to be rid of the cancer. Two years after his melanoma was found, he was well") and line 668 now credit surgery alongside immune restoration (S1 resolved). The parenthesis at line 15 about allogeneic rejection is a correct and important caveat.

**Mouse immunosurveillance**
- RAG-2 knockout removes T, B (and NKT) cells; the chapter says "no T cells or B cells at all" and the glossary says "no T or B cells" — correct, and it does not claim NK loss, so the NK argument in the deep dive stays consistent.
- "After 160 days, 58% of the RAG-deficient mice (30 of 52) had tumors, compared with 19% of normal mice (11 of 57)" → Shankaran 2001 (PMID 11323675): 30/52 vs 11/57, MCA monitored to 160 days; 30/52 = 57.7%, 11/57 = 19.3% ✓.
- IFN-γ-insensitive and perforin-deficient mice (late 1990s) began the revival; IFNGR/STAT1 knockouts; double-deficient mice develop more spontaneous epithelial tumors with age; "extrinsic tumor suppressor" → Shankaran 2001 abstract, verbatim.
- 1974 confounders (residual T cells, NK cells, high-activity carcinogen-activating enzyme in the strain used) → Dunn 2002.
- Three Es (elimination, equilibrium, escape) → Dunn 2002 / Dunn 2004.
- Equilibrium caught directly, released by T-cell depletion or IFN-γ blockade, **not** by NK depletion; cells in the masses divided slowly and were unedited until escape → Koebel 2007 (PMID 18026089) — and caption 2 plus the new SCIENTIFIC CARE note now say exactly this (S2 resolved).
- 40% of tumors from immunodeficient mice rejected in wild-type hosts, none of the wild-type-grown tumors → Shankaran 2001; captions 5 and 6 use "about 40%" correctly.
- Escape clones that never carried the mutant spectrin-β2 neoantigen → Matsushita 2012 (PMID 22318521).

**Human evidence — `ch07-evidence` chart, re-extracted from Engels 2011 Table 2 (PMC3310893)**
Every value and CI matches: All cancers 2.10 (2.06–2.14); Kaposi sarcoma 61.46 (50.95–73.49); Vulva 7.60 (5.77–9.83); NHL 7.54 (7.17–7.93); Anus 5.84 (4.70–7.18); Cervix 1.03 (0.75–1.38); Liver 11.56 (10.83–12.33); Lip 16.78 (14.02–19.92); Kidney 4.65 (4.32–4.99); Melanoma 2.38 (2.14–2.63); Lung 1.97 (1.86–2.08); Colorectum 1.24 (1.15–1.34); Prostate 0.92 (0.87–0.98); Breast 0.85 (0.77–0.93). Also verified: 175,732 transplants 1987–2008, 13 registries; EAR 719.3 per 100,000 person-years → "roughly 7 extra cancers per 1,000 recipients per year"; Kaposi incidence 15.5 per 100,000 person-years → "about 15 cases"; 32 malignancies significantly raised; NHL 18.73× in lung recipients ("about 19×"); lung cancer 6.13× in lung recipients; kidney cancer 6.66× in kidney recipients; cervical screening and pre-transplant screening explanations are Engels's own words. Source line additions and the breast/prostate/melanoma notes resolve S3; the omitted-cancer caveat (salivary gland 4.55, bile duct 5.76, leukemias) is now disclosed.
- cSCC ~46× in transplant recipients vs ~5× in people with HIV "based on a single high-quality study"; eight cancers raised in transplant recipients only; none in PLHIV only; breast/prostate raised in neither after four decades; Kaposi ~801× in PLHIV with the HHV-8 prevalence caveat; cervix raised in transplant recipients in the meta-analysis → Jin 2024 (PMC11246791), all verbatim (S4, O7 resolved).
- "virtually every virus-driven cancer rises in both groups" — correctly narrowed from "infection-related" (stomach/*H. pylori* is raised only in transplant recipients) (S4 resolved).

**Tumor-intrinsic evidence**
- Type, density and location of T cells beat standard staging → Galon 2006 (PMID 17008531); "many, though not all, cancers" hedge → Fridman 2017 (PMID 28741618) (S7 resolved in prose, key-idea and takeaway).
- Immunoscore: 2,681 patients, stage I–III colon cancer; training set 14/~180 high (8%) vs 51/~160 low (32%) five-year recurrence; confirmed in two validation sets; independent of stage, MSI and other factors → Pagès 2018 (PMID 29754777), verbatim.

**Cancer-immunity cycle and escape**
- Seven steps, correct order and names; anti-CTLA-4 at priming, anti-PD-1/PD-L1 and IDO inhibitors at killing → Chen & Mellman 2013 (PMID 23890059).
- Cancer-immune set point; inflamed/excluded/desert → Chen & Mellman 2017 (PMID 28102259).
- 2023 revisions: intratumoral DC niches as a local "training ground", stem-like progenitor T cells rather than simple exhaustion reversal, "immunotype" → Mellman 2023 (PMID 37820582), abstract verbatim.
- B2M required for surface MHC class I; both copies must be lost → standard, consistent with [^22].
- HLA loss of heterozygosity in ~40% of NSCLC, often subclonal, enriched in metastases → McGranahan 2017 (PMID 29107330).
- PD-L1 colocalized with TILs and IFN-γ: 98% vs 28% across melanocytic lesions, now correctly described as "melanomas and other pigment-cell growths" → Taube 2012 (PMID 22461641) (O4 resolved).
- Tregs, MDSCs (immature relatives of neutrophils and monocytes), M2-like TAMs with the "real tumor macrophages usually mix M1 and M2 features" caveat → Binnewies 2018 (PMID 29686425) (O6 resolved).
- CAFs, collagen, stroma; CD8 cells excluded to the stroma with a TGF-β fibroblast signature in atezolizumab-treated urothelial cancer; TGF-β + PD-L1 blockade in mice let T cells penetrate and tumors regress → Mariathasan 2018 (PMID 29443960).
- Metabolic barriers: CD39/CD73 → adenosine → A2A → cAMP, hypoxia raising both enzymes; IDO1 → kynurenine; HIF-1α; TGF-β blunting CTLs/NK and inducing Tregs → DePeaux & Delgoffe 2021 (PMID 33927375).
- Glucose competition correctly presented as debated, with the PET-tracer result (myeloid cells took up most glucose; cancer cells preferred glutamine; glucose not limiting) → Reinfeld 2021 (PMID 33828302) (S5 resolved).
- Epacadostat + pembrolizumab phase 3 failure cited directly → Long 2019 (PMID 31221619) (O10 resolved).
- IFN-γ raises MHC, can halt growth, signals through JAK1/2; 4 relapsed melanomas, 2 with JAK1/JAK2 loss, 1 with B2M truncation → Zaretsky 2016 (PMID 27433843).
- WNT/β-catenin excludes dendritic cells in some melanomas → Spranger 2015 (PMID 25970248).
- TLS structure (B-cell core, T cells, DCs, specialized vessels), 2020 melanoma/kidney/sarcoma studies, the correlation-vs-causation caveat, induction still experimental → Schumacher & Thommen 2022 (PMID 34990248).

**Figure specs**
- `ch07-immunoediting`: the model is honest about mechanism (visibility changes only by random inheritance plus selection; T cells must sometimes fail to kill a visible cell; 0-dot cells never killed; no "learning"; NK cells, brakes and suppressive cells explicitly not modeled), and the compression of Koebel's unedited-equilibrium finding is now disclosed in SCIENTIFIC CARE.
- `ch07-cycle`: all seven step descriptions and all 15 therapy rows are accurate, including statuses — anti-LAG-3 "Approved (with anti-PD-1, in melanoma)" (Opdualag, FDA 18 Mar 2022, confirmed in Amass); IDO inhibitors "Failed in a phase 3 trial"; TGF-β blockers "In trials; early attempts failed" (S6 resolved); cancer vaccines "a personalized mRNA vaccine met its main goal in a phase 3 melanoma trial (company-reported, 2026), not yet approved" — correctly labeled as company-reported (INTerpath-001, 19 Aug 2026, 1,137 patients, RFS and DMFS met, no hazard ratios released) (S8 resolved); the RULE that no therapy skips steps 4, 5 or 7, and the tebentafusp note, are both correct.
- `ch07-tme`: PD-1 on T cells only, PD-L1 on cancer cells and macrophages; MHC-less hiders now also present in Inflamed mode and low MHC throughout Desert mode; MDSC radius raised to ~1.25r (neutrophil-sized) (O8 resolved); value-label rule consistent with 0.9× (O9 resolved).

**Quiz, takeaways, glossary, sources**
- All four quiz items and every distractor rationale are correct, including the syngeneic-mice point in Q1 and the "missing MHC class I plus signs of stress" wording in Q4 (O13 resolved).
- Takeaways all trace to verified sources; the "in many cancers" hedge is applied.
- Glossary: all 48 entries accurate; `cold-tumor` now notes that "cold" is often stretched to excluded tumors (O11) and `immunosurveillance` now says "well supported in mice, and indirectly in people" (O12).
- Source list: 24 entries, all exist with correct authors/journal/year/volume/pages/DOI, verified by citation lookup (PMIDs 12571271, 12407406, 11323675, 22045767, 38936380, 17008531, 28741618, 29754777, 18026089, 22318521, 29107330, 23890059, 28102259, 37820582, 22461641, 29686425, 29443960, 37597750, 33927375, 31221619, 33828302, 27433843, 25970248, 34990248). No orphan markers; each supports the sentence citing it, subject to C1–C2 above.
