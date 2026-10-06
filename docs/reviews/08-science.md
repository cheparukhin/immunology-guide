# Science review: Chapter 8, "Releasing the Brakes" (`content/drafts/08-checkpoints.md`)

Reviewer: scientific review (medical oncology, tumor immunology, immune checkpoint inhibitors). Line numbers refer to the draft as of 2026-10-05. Knowledge cutoff for status claims: October 2026.

## Overall assessment

This is a strong, careful and honest chapter. The mechanism is right: which antibody binds which molecule on which cell, CTLA-4 at priming versus PD-1 in tissue, TCF1+ stem-like cells, and clonal replacement/revival. The framing of who benefits is unusually good ("fail most patients", ~20% respond, "only half had confirmed tumor shrinkage"). All 20 citations exist and match their authors, title, journal, year, volume, pages and DOI. That includes the 2026 SKYSCRAPER-01 JCO paper (PMID 42507968), which I confirmed. Nearly every number checks out against the primary source:
- every CheckMate 067 figure used in the text and in the `ch08-tail` data (10-year NEJM full text, PMC12080919);
- the 3-year CheckMate 067 numbers;
- dacarbazine 9.1 mo / 36.3 / 17.9 / 12.2%;
- Schadendorf 1,861 / 11.4 mo / 22% / 21% plateau;
- Haslam 11 drugs / 20 tumor types / 56.55% / 20.13%;
- Le 2015, Ansell 2015, KEYNOTE-158 TMB, McGrail, RELATIVITY-047 PFS, ECHO-301, Ferrara;
- the Wang 2018 fatality figures and the Barroso-Sousa thyroid and pituitary rates.

The problems are concentrated in three places.
1. **The side-effect body map** misclassifies adrenal insufficiency (4.2% with the combination, not "rare/under 1%") and combination pneumonitis. Its bands are also not actually derivable from the cited sources.
2. **The tail chart.** One caption ("Ipilimumab barely moved the median") contradicts what the chart visibly shows (CheckMate 067 ipilimumab median 19.9 vs chemotherapy 9.1 months). The chart also omits that most ipilimumab-arm patients later received anti-PD-1.
3. **Sourcing for the 2025–2026 events.** The fianlimab, domvanalimab and tiragolumab-discontinuation statements are correctly labeled as company-reported, but have no source entries.

The remaining items are calibration:
- RELATIVITY-047's non-significant overall survival;
- human evidence on Fc-mediated Treg depletion;
- a steroid-dose caveat;
- a glossary inconsistency on PD-1.

---

## Must fix

**M1. Side-effect body map: adrenal band and card are wrong for the combination; combination pneumonitis is under-banded; the bands lack a source (lines 431–444, 454, 451)**
- Quotes:
  - Band table: "adrenal glands   rare   rare   rare" and "lungs   uncommon   rare   uncommon".
  - Adrenal card: "Rarely, under 1% of patients, the adrenal glands themselves are damaged… [18]".
- Problem:
  - **Adrenal.** In the cited meta-analysis [18], primary adrenal insufficiency was 0.7% overall (43/5,831), but **4.2% (11/262) with PD-1 + CTLA-4 combination therapy**. "Rare" and "under 1%" are therefore wrong for "Both". Barroso-Sousa et al., *JAMA Oncol* 2018, full text: https://jamanetwork.com/journals/jamaoncology/fullarticle/2655010 (PMID 28973656).
  - **Lungs.** Combination pneumonitis is 6.6% all-grade, versus 1.6% for monotherapy in melanoma, which puts it in the "common" (5–20%) band, not "uncommon". Nishino M et al. *JAMA Oncol* 2016;2:1607–1616 (PMID 27540850). Anti-PD-1 at 2.7% ("uncommon") and anti-CTLA-4 ("rare") are fine.
  - **Sources.** The spec says the bands are "based on [9][17][18][19]", but [18] covers only endocrine organs, [19] covers only deaths, and [9] covers only one melanoma trial. Lungs, kidneys, joints, eyes and liver have no traceable incidence source.
- Fix:
  - Table: `adrenal glands   rare   rare   uncommon`; `lungs   uncommon   rare   common`.
  - Adrenal card: "Damage to the adrenal glands themselves is rare with a single drug (under 1% of patients) but affected about 4% of patients on the combination in one large analysis. Cortisol must then be replaced for life [18]."
  - Add sources and change the spec line to "based on [9][17][18][19][new]". Use Nishino 2016 (pneumonitis), plus a review with per-class incidence tables. Example: Martins F, et al. Adverse effects of immune-checkpoint inhibitors: epidemiology, management and surveillance. *Nat Rev Clin Oncol* 2019;16:563–580 (PMID 31092901).
  - Optional: see O5 on kidneys.

**M2. Tail chart, step 2 caption and survival-curve box: "Ipilimumab barely moved the median" contradicts the chart, and the ipilimumab tail is not purely ipilimumab's effect (lines 309, 345)**
- Quotes: step 2: "Ipilimumab barely moved the median, but its curve flattens after about three years. In CheckMate 067, 19% of patients given ipilimumab alone were alive ten years later…". Box (line 345): "Ipilimumab barely moved the median, yet it created a plateau."
- Problem 1 (contradiction): at step 2 the reader sees the chemotherapy curve (median 9.1 months, Robert 2011) next to the CheckMate 067 ipilimumab curve (median 19.9 months). On screen, ipilimumab appears to *double* the median, while the caption says it "barely moved" it. The real randomized gains were 3.6 months (10.0 vs 6.4; Hodi *NEJM* 2010;363:711, PMID 20525992) and 2.1 months (11.2 vs 9.1; Robert 2011 [8]). Most of the gap on screen is a cross-trial artifact: different patients, a later era and better follow-on treatment. "Barely" also undersells a 2–4 month gain that was the first survival benefit ever shown in the disease.
- Problem 2 (missing caveat): in CheckMate 067, 43% of ipilimumab-arm patients had received anti-PD-1 by the 3-year analysis ([9], "anti–PD-1 agents in the ipilimumab group (43%)"). 66.7% received some subsequent systemic therapy by year 10 ([4]). Part of the 19% ten-year tail therefore reflects later anti-PD-1, not ipilimumab alone. The "close to the pooled plateau" comparison is still reasonable, but should be hedged.
- Fix:
  - Step 2: "In randomized trials, ipilimumab added only a few months to the median. (Its median looks much longer here because CheckMate 067 was run years later, in different patients; compare curves from different trials with caution.) What changed was the tail: about one in five patients was still alive years later, in pooled data on nearly 1,900 patients and again in CheckMate 067, where many ipilimumab patients later also received a PD-1 blocker."
  - Line 345: "Ipilimumab moved the median by only a few months, yet it created a plateau."
  - Optional: cite Hodi 2010 at line 243 alongside or instead of [^9] for "the first drug shown in randomized trials to lengthen survival".

**M3. The 2025–2026 company-reported events have no sources (lines 381, 387)**
- Quotes: "in May 2026, Regeneron reported that fianlimab plus cemiplimab had narrowly missed its main goal…"; "Roche stopped developing the drug in 2025"; "in December 2025 the developers of one of the last, domvanalimab, reported that their large trial … had been stopped early…"
- Problem: PLAN §2 requires 2024–2026 claims to be verified and traceable. All three are correct, but none has an entry in Sources.
  - **Fianlimab.** In the phase 3 trial (n = 1,546), high-dose fianlimab + cemiplimab vs pembrolizumab gave PFS HR 0.845 (95% CI 0.709–1.008; P = 0.063) with median PFS 11.5 vs 6.4 months. The low-dose arm gave HR 0.931. Regeneron press release, May 2026: https://investor.regeneron.com/news-releases/news-release-details/regeneron-provides-update-phase-3-trial-fianlimab-lag-3; also https://www.targetedonc.com/view/fianlimab-plus-cemiplimab-falls-short-of-pfs-goal-in-first-line-melanoma.
  - **Domvanalimab.** STAR-221 was discontinued on Dec 12, 2025, on IDMC recommendation after a prespecified interim OS analysis showed no OS improvement versus nivolumab + chemotherapy in HER2-negative gastric/GEJ/esophageal adenocarcinoma. Sources: https://www.gilead.com/company/company-statements/2025/gilead-provides-update-on-phase-3-star-221-study; Arcus press release of the same date.
  - **Tiragolumab.** Roche discontinued the program in July 2025 after SKYSCRAPER-14 (IMbrave152) and -03 failed; https://www.apexonco.com/5000-patients-later-roche-scraps-its-tigit. The full data were presented at ESMO 2025.
- Fix: add three source entries (press releases/news, labeled as such).
  - Fianlimab sentence: "…Regeneron reported that adding fianlimab to cemiplimab did not significantly delay melanoma growth compared with pembrolizumab in a phase 3 trial (the difference fell just short of statistical significance)." Drop "narrowly", or keep it only with the HR stated.
  - "Domvanalimab… reported" is fine as written once it has a source. Strictly, the trial "did not improve overall survival at a planned interim analysis" is more accurate than "very unlikely to succeed".

---

## Should fix

**S1. RELATIVITY-047: overall survival was not significantly improved (line 381)**
- Quote: "adding the anti-LAG-3 antibody relatlimab to nivolumab lengthened the median time before the cancer grew from 4.6 to 10.1 months."
- Problem: correct ([14]), but the chapter cites survival for every other regimen and omits it here. At the prespecified analysis, OS HR was 0.80 (95% CI 0.64–1.01), which did not reach statistical significance (Long GV et al. *NEJM Evidence* 2023;2(4):EVIDoa2200239, PMID 38320023). The 3-year descriptive update showed a median of 51.0 vs 34.1 months, HR 0.80 (0.66–0.99) (Tawbi HA et al. *J Clin Oncol* 2025, doi:10.1200/JCO.24.01124).
- Fix: after "…10.1 months.", add: "People on the combination also tended to live longer, though that difference fell just short of statistical significance in the trial's planned analysis.[new]"

**S2. Treg-depletion box presents only the negative human evidence (lines 217–225)**
- Quote: "In people, the evidence is weaker. … the number of Tregs did not fall.[^3] … The question remains open."
- Problem: the conclusion ("open") is right, but the box cites only Sharma 2019, which says Tregs are not depleted. Two well-known human data sets point the other way:
  - Romano E et al. *PNAS* 2015;112:6140–6145 (PMID 25918390). Ipilimumab mediates killing of Tregs ex vivo by FcγRIIIA+ (CD16+) nonclassical monocytes. Responders had higher baseline CD16+ monocyte frequencies.
  - Arce Vargas F et al. *Cancer Cell* 2018;33:649–663 (PMID 29576375). In melanoma patients, response to ipilimumab was associated with the high-affinity FcγRIIIA (CD16a-V158F) allele, in inflamed tumors. Human-isotype anti-CTLA-4 depleted intratumoral Tregs in mice expressing human Fc receptors.
- Fix: after the Sharma paragraph, add: "Other studies hint the other way. In blood samples from patients, ipilimumab could direct a type of white blood cell (a monocyte carrying Fc receptors) to kill Tregs in the lab, and patients with more of these cells responded more often.[new] And patients who inherited a version of an Fc receptor that grips antibody stems more tightly were more likely to respond to ipilimumab.[new] Neither proves that Tregs disappear from tumors, but together they keep the question alive." Also, for the mouse sentence (line 220), cite a primary paper (Simpson TR et al. *J Exp Med* 2013;210:1695, PMID 23897981; or Arce Vargas 2018) instead of relying on the abstract of [^3].

**S3. Mouse TCF1 claim is uncited (line 230)**
- Quote: "In mice with chronic viral infections, the burst of T-cell division after PD-1 blockade comes almost entirely from the stem-like TCF1-positive cells; terminally exhausted cells barely respond."
- Correct per Im SJ et al. *Nature* 2016;537:417–421 (PMID 27501248): "The proliferative burst after PD-1 blockade came almost exclusively from this CD8+ T-cell subset". Add it as a source. Optional, for human relevance: Sade-Feldman M et al. *Cell* 2018;175:998, PMID 30388456 (TCF7+ CD8 T cells associated with response in melanoma).

**S4. "Did at least as well" after immune-suppressing medicines: specify the measure, flag post hoc, and add the steroid-dose caveat (line 403)**
- Quote: "patients who needed immune-suppressing medicines in their first six months did at least as well over ten years as those who did not.[^4]"
- What [4] shows: this is a post hoc, 6-month-landmark analysis of **melanoma-specific** survival. Combination 59% vs 56%, nivolumab 53% vs 46%, ipilimumab 27% vs 27%.
- Caveat: other data suggest that high steroid doses can blunt benefit. In ipilimumab-induced hypophysitis, high-dose versus low-dose glucocorticoids were associated with shorter OS (HR 0.24 favoring low dose; Faje AT et al. *Cancer* 2018;124:3706–3714, PMID 29975414).
- Fix: "In a later look back at CheckMate 067, patients who needed immune-suppressing medicines in their first six months were no less likely to escape death from melanoma over ten years than those who did not.[^4] (Some studies suggest that very high steroid doses may blunt the benefit, so doctors try to use no more than needed.[new])"

**S5. Tail chart: interpolation error between 3 and 7.5 years, and the "plateau" overstates how flat the OS curves are (data lines 321–324; button at 291; alt text 333)**
- Problem 1: published 5-year OS values exist and are not used. They are 52% (combination), 44% (nivolumab) and 26% (ipilimumab) (Larkin J et al. *NEJM* 2019;381:1535–1546, PMID 31562797). Monotone interpolation from (36.9, 50) to (90, 42) gives about 46–47% for nivolumab at 60 months, versus the published 44%. For ipilimumab, (36, 34) to (90, 22) gives about 28–29%, versus 26%. The 100-people readout would be off by 2–3 people at a commonly inspected time.
- Problem 2: the CheckMate 067 OS curves keep sloping down after year 3: combination 58 → 43%, nivolumab 52 → 37%, ipilimumab 34 → 19%. This is partly from deaths from other causes. The melanoma-specific curves are the flat ones. The ipilimumab arm in particular falls by almost half after year 3. A brace labeled "the tail" on all three OS curves, with "The flat stretch is the point" (line 311), invites a reader to see flat lines that are not flat.
- Fix:
  - Add `(60, 52) [L]`, `(60, 44) [L]` and `(60, 26) [L]` to the three CheckMate 067 series, with Larkin 2019 as a new source.
  - Reword the alt text and step 4 so the curves "fall much more slowly after about three years". Put the brace only on the two nivolumab-containing curves.
  - Optionally add a one-line caption under "Show the plateau": "Overall survival keeps drifting down slowly, partly because patients die of other causes; counting only melanoma deaths, the curves are flatter (52%, 44% and 23% at ten years)."

**S6. Carter opening paragraph is not supported by [^1] (line 9)**
- Quote: "In August 2015, surgeons in Atlanta removed a small tumor from the liver… scans soon found several small tumors in his brain. He was 90 years old."
- What is correct, and from where:
  - Liver-mass surgery at Emory University Hospital, Aug 3, 2015.
  - Melanoma with four brain lesions, announced Aug 20, 2015.
  - Born Oct 1, 1924, so 90 at the time.
  - [^1] (AP via STAT, Mar 7, 2016) supports only the treatment, the 3-weekly Keytruda schedule, the December scan and the March statement. It does not mention the Atlanta liver surgery.
- Fix: add a source to line 9. Example: CNN, "Jimmy Carter undergoes liver surgery," Aug 3, 2015, https://edition.cnn.com/2015/08/03/politics/jimmy-carter-surgery-mass-liver/index.html. Or the Emory News Center retrospective, July 2016: https://news.emory.edu/stories/2016/07/year-life-jimmy-carter-shares-his-cancer-experience. Optionally "four small tumors" instead of "several".

**S7. Glossary "PD-1" is inaccurate and contradicts the main text (line 553)**
- Quote: "A brake receptor on T cells that rises after prolonged stimulation."
- Problem: PD-1 is induced within about a day of T-cell activation. The main text (line 26) correctly says "It appears on T cells once they are activated and stays high when stimulation drags on."
- Fix: "A brake receptor that appears on T cells soon after they are activated and stays high when stimulation is prolonged. When it binds PD-L1 or PD-L2 on another cell, it damps the T cell's activity."

**S8. Subcutaneous approvals need sources (line 482)**
- Quote: "Since 2024, US regulators have also approved under-the-skin versions of atezolizumab, nivolumab and pembrolizumab, which take minutes to inject."
- Correct:
  - Atezolizumab–hyaluronidase (Tecentriq Hybreza): Sept 12, 2024, about 7 min.
  - Nivolumab–hyaluronidase (Opdivo Qvantig): Dec 27, 2024.
  - Pembrolizumab–berahyaluronidase alfa (Keytruda Qlex): Sept 19, 2025.
- Sources: https://www.onclive.com/view/fda-approves-subcutaneous-atezolizumab-and-hyaluronidase-tqjs-for-use-in-all-indications-of-iv-atezolizumab; https://ecancer.org/en/news/25848-fda-approves-nivolumab-and-hyaluronidase-nvhy-for-subcutaneous-injection; https://ascopost.com/news/september-2025/fda-approves-pembrolizumab-and-berahyaluronidase-alfa-pmph-for-subcutaneous-injection/
- Fix: add one source entry (FDA/ASCO Post notices). The text is fine.

**S9. Ivonescimab: unsourced and slightly out of date (line 383)**
- Quote: "held lung cancers in check longer than pembrolizumab in a large trial in China; whether that holds elsewhere is still being tested".
- Current status:
  - HARMONi-2 (n = 398, China, PD-L1-positive NSCLC): PFS 11.1 vs 5.8 months, HR 0.51. Xiong A et al. *Lancet* 2025;405:839–849, PMID 40057343.
  - At WCLC in September 2026, the investigators reported a significant OS benefit: 30.8 vs 22.6 months, HR 0.73 (0.57–0.95). This is a conference presentation, not yet peer-reviewed: https://www.iaslc.org/iaslc-news/press-release/late-breaking-harmoni-2-analysis-shows-ivonescimab-significantly-improves.
  - The global HARMONi-3 squamous cohort did not reach significance at an early interim PFS analysis (company-reported, Apr 30, 2026). The trial continues.
- Fix: cite Xiong 2025. Optionally: "…longer than pembrolizumab in a trial of about 400 patients in China, and the investigators reported in 2026 that patients also lived longer (not yet peer-reviewed). Whether that holds in global trials is still being tested."

---

## Optional

- **O1. "Eleven" vs nine named (line 40).** The text names 9 drugs and then says "eleven". Haslam's count (correct for 2023) includes newer agents. Suggest "…and several newer ones, such as toripalimab and retifanlimab." Or update: by October 2026 the US had approved more than a dozen. These are the PD-1 blockers above plus retifanlimab (2023), toripalimab (2023), tislelizumab (2024) and penpulimab (Apr 2025); cosibelimab (PD-L1, Dec 2024); and relatlimab (LAG-3, in Opdualag, 2022).
- **O2. "Best single predictor is … a 'hot' tumor" (line 375)** is uncited. Litchfield K et al. *Cell* 2021;184:596, PMID 33508232 (pan-cancer meta-analysis: CXCL9 expression and clonal TMB were the strongest predictors) supports it.
- **O3. Hypophysitis mechanism.** Pituitary endocrine cells themselves express CTLA-4, and ipilimumab may injure them partly through antibody and complement directly (Iwama S et al. *Sci Transl Med* 2014;6:230ra45, PMID 24695685). This is a nice "Go deeper" nuance for the "WHY?" toggle (line 463) and the pituitary card. It is still immune-mediated, so the key idea and Q4 stand.
- **O4. Confirmed vs. unconfirmed response (line 255).** "Only half had confirmed tumor shrinkage" is right (confirmed ORR 50.0%, post hoc). The trial's headline ORR is 58% (unconfirmed, investigator-assessed). A parenthetical would prevent "the paper says 58%" objections.
- **O5. Kidneys band.** In pooled trial data, immune-related acute kidney injury was roughly 1.4–2% with a single agent and about 5% with the combination (Cortazar FB et al. *Kidney Int* 2016;90:638–647, PMID 27282937). Single agents are arguably "uncommon" rather than "rare".
- **O6. Line 253, "stopped during the first weeks".** The analysis covers discontinuation during the four-dose induction phase (about the first 3 months), and it is post hoc. Suggest "during the first few months".
- **O7. Line 311, step 4: "very likely to stay that way".** The statistic is melanoma-specific survival, not freedom from progression. Suggest "…rarely died of melanoma later: 96–97%…".
- **O8. Liu 2022 (line 234).** Its "precursor exhausted" (Texp) cells were defined by high GZMK and low co-inhibitory receptors, which overlap with, but are not identical to, TCF1+ progenitor-exhausted cells. Also, 47 biopsies from 36 patients were not all paired, so "followed 36 patients … through treatment" is slightly generous. For Yost, "tumor-specific" was inferred mainly from the exhausted CD39+CD103+ phenotype.
- **O9. TMB-H approval scope (line 373).** As with MSI-H, it applies to previously treated tumors with no satisfactory alternatives, as measured by an FDA-approved test. FDA approval summaries could be cited: Marcus L et al. *Clin Cancer Res* 2019;25:3753 (MSI-H; PMID 30787022) and 2021;27:4685 (TMB-H; PMID 34083238). The "critics" sentence could cite Prasad V, Addeo A. *Ann Oncol* 2020;31:1112 (PMID 32771305).
- **O10. Line 17, "holds it still"** implies immobilization. "Covers it" matches the mitten metaphor.
- **O11. Line 491, "because what the drug leaves behind is … memory cells".** This is plausible but not proven in patients; "probably because".
- **O12. RECIST (line 494).** Progression is ≥20% growth of the summed diameters **over the smallest previous measurement** (and at least 5 mm), or new lesions.
- **O13. Lasting non-endocrine irAEs.** Beyond hormone glands, some irAEs (inflammatory arthritis, dry mouth/sicca) can persist for months to years, e.g. Patrinely JR et al. *JAMA Oncol* 2021;7:744 (PMID 33764387) (adjuvant anti-PD-1). A clause in the irAE section would complete the permanence picture.
- **O14. Blockade guardrail (line 106), "anti-PD-L1 binds only PD-L1 (on the cancer cell)".** In patients, PD-L1 on myeloid cells (dendritic cells, macrophages) matters as much or more. The main text already says "the tumor and the cells around it". Consider "(in this scene, on the cancer cell)".
- **O15. Pooled-ipilimumab overlay (lines 327–328).** The 21% plateau comes from the 4,846-patient analysis (median 9.5 months), while the median of 11.4 and the 22% come from the 1,861-patient analysis. Few patients were followed past about 7 years. Ending the flat segment at around 84–96 months, or keeping the "approximate" label as specified, is fine.
- **O16. Cold tumors (line 361).** "…apart from the minority that are mismatch-repair deficient" could add "or have very high TMB", since the 2020 tissue-agnostic TMB-H approval also covers them.

---

## Claims verified as correct

- **Carter.** Liver surgery at Emory, Aug 2015; melanoma with brain metastases; age 90; pembrolizumab first approved Sept 2014; stereotactic radiation; Keytruda every 3 weeks Aug–Feb; Dec 2015 clear scan announced at Sunday school; Mar 2016 "no more treatment"; died Dec 29, 2024, aged 100.
- **Drugs and isotypes.** Drug–target assignments and brand names. Nivolumab, pembrolizumab, cemiplimab and dostarlimab are IgG4. Atezolizumab and durvalumab are Fc-silenced IgG1. Avelumab is native IgG1. Ipilimumab is IgG1 and tremelimumab IgG2 ([3] abstract). PD-L1 also binds CD80 (B7-1). Every US-approved checkpoint inhibitor is an IgG monoclonal antibody.
- **Biology.** CTLA-4 has higher affinity for B7 than CD28; Tregs carry the most CTLA-4; Ctla4-knockout mice die within weeks. PD-1 ligands are PD-L1 and PD-L2, and PD-L1 is IFN-γ-inducible.
- **Dosing.** Nivolumab every 2 weeks and pembrolizumab 200 mg every 3 weeks for up to 35 cycles, as in CheckMate 067 and KEYNOTE-158.
- **Haslam 2025 [2].** 11 checkpoint inhibitors, 20 tumor types, eligibility 56.55%, response 20.13% (2023).
- **Sharma 2019 [3].** Ipilimumab: melanoma 19, prostate 17, bladder 9 (stage-matched); tremelimumab: paired melanoma 18. More CD4/CD8 infiltration, no FOXP3+ depletion.
- **Yost 2019 [6].** Stanford; 79,046 cells; BCC/SCC; expanded clones were novel clonotypes; "clonal replacement".
- **Liu 2022 [7].** 36 NSCLC patients; Texp accumulate in responders by local expansion plus peripheral replenishment with new and pre-existing clones ("clonal revival"); not from terminally exhausted cells.
- **Robert 2011 [8].** Dacarbazine + placebo arm, n = 252; median OS 9.1 months; 1-/2-/3-year OS 36.3/17.9/12.2%.
- **Schadendorf 2015 [10].** 1,861 patients from 12 studies; median 11.4 months; 3-year OS 22%; plateau from about year 3 with follow-up up to 10 years; 21% plateau in the 4,846-patient analysis.
- **CheckMate 067 [4][9].**
  - Design: N = 945, enrolled July 2013–March 2014, minimum follow-up 120 months, published online 2024.
  - Median OS 71.9 / 36.9 / 19.9 months; 10-year OS 43 / 37 / 19%; 90-month OS 48 / 42 / 22%; 2-year 64 / 59 / 45%; 3-year 58 / 52 / 34%.
  - HR 0.53 (combination vs ipilimumab); HR 0.85 (0.69–1.05) combination vs nivolumab, descriptive.
  - 10-year MSS 52 / 44 / 23%. Progression-free at 3 years: 31.8 / 24.7 / 6.7%, with 10-year MSS 96 / 97 / 88% in that subgroup.
  - Median treatment duration 2.8 months. 10-year OS 43% in those who discontinued for toxicity during induction. Confirmed ORR 50.0%.
  - Grade 3–4 TRAEs 59 / 21 / 28%. Any-grade skin AEs 62 / 46 / 56%; grade 3–4 GI AEs 15 / 4 / 12%. Most grade 3–4 select AEs resolved in 3–4 weeks, except endocrine. PD-L1 AUC 0.56–0.57 ("coin toss").
- **Le 2015 [11].** 1,782 vs 73 mutations; 4/10 vs 0/18 colorectal responses.
- **Ansell 2015 [12].** 20/23 (87%) responded.
- **Approvals.** MSI-H/dMMR, May 2017: first tissue-agnostic approval, previously treated. TMB-H ≥10 mut/Mb, June 2020.
- **KEYNOTE-158 TMB [5].** 10 tumor types; ORR 29% (30/102) vs 6% (43/688).
- **McGrail 2021 [13].** n = 1,551 for ORR; 39.8% vs 15.3%; lower ORR than TMB-low tumors in category II.
- **RELATIVITY-047 [14].** n = 714; PFS 10.1 vs 4.6 months; grade 3–4 TRAEs 18.9 vs 9.7%; Opdualag approved 2022.
- **ECHO-301 [15].** n = 706; PFS 4.7 vs 4.9 months; HR 1.00.
- **SKYSCRAPER-01 [16].** n = 521, PD-L1-high; PFS and OS not significant (OS HR 0.87).
- **Other recent events.** Tiragolumab discontinued in 2025. STAR-221 stopped in Dec 2025. Fianlimab phase 3 missed PFS in May 2026.
- **Endocrine and fatal irAEs.** Barroso-Sousa [18]: hypothyroidism 3.8 / 7.0 / 13.2% (ipilimumab / PD-1 / combination); hypophysitis 3.2 / 0.4 / 6.4%; insulin-deficient diabetes 0.2%. Wang 2018 [19]: 112 trials, 19,217 patients; fatality 0.36 / 0.38 / 1.08 / 1.23%; colitis 70% of anti-CTLA-4 deaths; pneumonitis 35%, hepatitis 22% and neurologic 15% of PD-1/PD-L1 deaths; combination deaths colitis 37% and myocarditis 25%; myocarditis case fatality 39.7%.
- **Ferrara 2018 [20].** 406 pretreated NSCLC; pseudoprogression 4.7%; HPD 13.8% vs 5.1% of 59 on chemotherapy; median OS 3.4 months in early HPD.
- **Subcutaneous approvals.** Atezolizumab (Sept 2024), nivolumab (Dec 2024) and pembrolizumab (Sept 2025).
- **Figures.**
  - `ch08-blockade`: anti-PD-1 on PD-1 on the T cell; anti-PD-L1 on PD-L1 on the cancer cell; no Fc engagement; ~15 nm synapse gap.
  - `ch08-two-brakes`: CTLA-4 vs CD28 for B7 on dendritic cells in the lymph node; Tregs with the most CTLA-4; anti-PD-1 on T cells only; stem-like cells respond while terminal cells do not; new clones arrive; Treg not depleted.
- **Quiz.** All four keyed answers and the distractor explanations are correct. ("More than half had died by ten years" matches 57%.)
- **Glossary.** Correct except PD-1 (S7).
- **Takeaways.** Consistent with the sources.
