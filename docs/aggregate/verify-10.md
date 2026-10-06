# Second-pass verification — Chapter 10, "Living Drugs" (`content/drafts/10-cell-therapy.md`)

**Verified:** 2026-10-06 · current draft (425 lines, 33 sources, 4 figures, 5 go-deeper boxes, 4-question quiz)
**Tools:** PubMed/E-utilities (every journal citation re-resolved to a PMID and checked against its abstract or full text), Amass RegulatoryCore (FDA/EMA label and authorization records), FDA.gov, ClinicalTrials.gov API, company/NMPA announcements, HMPI.
**Scope:** every number, date, product–target pairing, approval, trial result, attribution, "first/only" claim and mechanistic statement in prose, tables, callouts, go-deeper boxes, figure `spec`/`steps`/meters, quiz and glossary. No draft edits made.

Summary: **6 errors, 8 unsupported/weak, 6 citation problems.** The chapter's trial arithmetic is essentially flawless on re-check; the problems are a duplicated paragraph left by the revision, one toxicity range that still excludes the most neurotoxic approved product (the earlier review's Must-fix 2, only half-fixed), one trial mislabeled (Must-fix 6, re-broken with new wording), and two absolute/dated claims that 2026 has overtaken.

---

## 1. Errors (MUST fix)

### E1. The price paragraph is duplicated verbatim (revision artifact)
**Location:** L111 and L113.
> L111: "It is also expensive: US list prices launched between $373,000 and $475,000 and have risen every year since, reaching roughly $462,000 to $594,000 by 2025, before any of the hospital care around the infusion.[^27]"
> L113: "It is also expensive, as bespoke manufacturing tends to be. US list prices launched between $373,000 and $475,000 and have risen every year since, reaching roughly $462,000 to $594,000 by 2025 — before any of the hospital care around the infusion.[^27]"

**What's wrong:** the same claim, numbers and citation appear twice in consecutive paragraphs (the earlier review's Must-fix 4 rewrite was pasted in without deleting the sentence it replaced). Both sit between the section heading and the `ch10-journey` figure, so a reader meets the price twice in fifteen seconds.
**Fix:** delete L113 and keep L111 (with the correction in E2).

### E2. "have risen every year since" is contradicted by the source cited for it
**Location:** L111 (and L113), citing [^27].
**What's wrong:** Pulice & Schulman's own Table 1 shows Tecartus held its 2024 price ($462,000) unchanged into 2025 — so not every product rose every year. The launch range ($373,000–$475,000 over 2017–2022) and the 2025 range ($462,000 Tecartus to $593,533 Kymriah) are both reproduced correctly.
**Evidence:** Pulice TD, Schulman KA. *Health Management, Policy and Innovation* 2026;11(1), 18 Feb 2026 — https://hmpi.org/2026/02/18/car-t-therapy-escalating-costs-in-an-expanding-market/ (verbatim: "the launch price ranged from $373,000 to $475,000 for these products over the period of 2017–2022"; 2025 WAC $462,000–$593,533; Tecartus flat 2024→2025).
**Fix:** "…and have climbed since, reaching roughly $462,000 to $594,000 by 2025". (Optional: the chapter's own obe-cel, launched at a $525,000 WAC, is *not* in that paper's analysis, so "the approved products" rather than a complete list.)

### E3. The severe-neurotoxicity ceiling still excludes axicabtagene ciloleucel
**Location:** L216.
> "neurological events affected 60% of patients given axi-cel and 40% of the children given tisa-cel, and were severe in roughly 7% to 21% across the approved products.[^7][^9][^20]"

**What's wrong:** the upper bound is axi-cel's *second-line* figure (ZUMA-7, grade ≥3 21%), but axi-cel's registrational trial — which the chapter cites three paragraphs earlier as [^8] — reports grade ≥3 neurologic events in **28%** (primary analysis) and **30%** (5-year follow-up). "Roughly 7% to 21% across the approved products" therefore understates the single most important product-level difference in the field, which is exactly the error the first review flagged (Must-fix 2); the revision fixed the all-grade sentence but left a too-low severe range.
**Evidence:** Neelapu SS et al. *N Engl J Med* 2017;377:2531–2544, PMID 29226797 ("Grade 3 or higher cytokine release syndrome and neurologic events occurred in 13% and 28%"); Neelapu SS et al. *Blood* 2023;141:2307–2315, PMID 36821768 ([^8]; "Neurologic events occurred in 65 patients (64%) with grade ≥3 events in 30 patients (30%)"); Locke FL et al. *N Engl J Med* 2022;386:640–654, PMID 34891224 (ZUMA-7: grade ≥3 neurologic events 21%); Maude SL et al. *N Engl J Med* 2018;378:439–448, PMID 29385370 (ELIANA: neurologic events 40%); Roddie C et al. *N Engl J Med* 2024;391:2219–2230, PMID 39602653 (FELIX: grade ≥3 ICANS 7.1%).
**Fix:** "…and were severe in roughly 7% to 30% across the approved products.[^7][^8][^20]" (and see C1 on the 60% figure's citation).

### E4. "the first children's trial" still mislabels [^7] (ELIANA)
**Location:** L184.
> "Severe cases run from about 1% to 13% with the approved adult products,[^8][^10][^20] and were far more common in the first children's trial, whose patients carried enormous amounts of disease.[^7]"

**What's wrong:** [^7] is Maude 2018 — ELIANA, the 25-centre global **pivotal** paediatric trial (75 infused patients). The first trial in children was Grupp 2013 ([^6]), two patients. The earlier review flagged this sentence when it read "the original leukemia trial"; the revision swapped in an equally inaccurate label, and as written it tells the reader that a ~46% severe-CRS rate came from a two-patient pilot.
**Evidence:** PMID 29385370 — "a phase 2, single-cohort, 25-center, global study… 75 patients received an infusion"; CRS 77%, grade 3/4 46% on the Penn scale.
**Fix:** "…and were far more common in the pivotal paediatric trial, whose patients carried enormous amounts of disease and were graded on the stricter Penn scale.[^7]"

### E5. "the first T-cell therapy of any kind approved for a solid tumor" is false as an absolute
**Location:** L293 (lifileucel paragraph).
**What's wrong:** lifileucel (Amtagvi, FDA 16 Feb 2024) is the first *US-licensed* cell therapy for a solid tumour and the first TIL product anywhere — FDA's own press release claims only "first cellular therapy to treat patients with unresectable or metastatic melanoma". A licensed autologous T-cell product for a solid tumour predates it by seventeen years: **Immuncell-LC** (autologous activated T lymphocytes / cytokine-induced killer cells) was approved by Korea's KFDA in **2007** as adjuvant therapy for hepatocellular carcinoma and is still marketed there.
**Evidence:** GC Cell product page (http://gccell.com/en/product/immuncellLc.do: "approved by KFDA in 2007"); Lee JH et al. *Gastroenterology* 2015;148:1383–1391 (PMID 25747273, randomized adjuvant CIK trial in HCC); Yoon JS et al. *BMC Cancer* 2019;19:523 (PMC6543598) for real-world adjuvant use.
**Fix:** "It is the first TIL therapy — and the first T-cell therapy of any kind licensed in the US — for a solid tumour."

### E6. "most recently marginal zone lymphoma… in December 2025" is out of date
**Location:** L227 (clinic box).
**What's wrong:** the chapter is dated October 2026. Breyanzi's marginal-zone-lymphoma approval (4 Dec 2025) is correctly reported, but it is no longer the most recent expansion of what these products may be used for: on **6 February 2026** the FDA removed the Limitations of Use for axicabtagene ciloleucel in relapsed/refractory **primary CNS lymphoma**, the one population the label previously excluded.
**Evidence:** Gilead/Kite press release, 6 Feb 2026 — https://www.gilead.com/news/news-details/2026/fda-approves-label-update-for-kites-yescarta-for-relapsedrefractory-primary-central-nervous-system-lymphoma ("Yescarta is the only CAR T-cell therapy approved for R/R large B-cell lymphoma to have this Limitations of Use removed"); FDA MZL approval, 4 Dec 2025 — https://www.fda.gov/news-events/press-announcements/fda-approves-first-car-t-cell-therapy-marginal-zone-lymphoma-us (66 patients, ORR 95.5%, CR 62.1%).
**Fix:** either drop "most recently" ("The list of approved uses also keeps growing — marginal zone lymphoma… in December 2025, and in February 2026 the restriction that kept these cells out of lymphoma in the brain was lifted.[^25]") or make the clause time-stamped rather than superlative.

---

## 2. Unsupported or weakly supported (SHOULD fix)

### U1. "Steroids… can blunt the therapy — which is why they are not the first choice" (figure `ch10-crs` footer, L210)
This is the field's conventional rationale, but the clinical evidence is mixed: early and prophylactic corticosteroid cohorts (e.g. ZUMA-1 cohorts 4 and 6) did not show reduced response rates, and current consensus guidance uses steroids early for ICANS without an efficacy penalty. The chapter asserts it flatly in a reader-facing footer.
**Fix:** "Steroids also settle this syndrome; because they act on T cells directly, they are used second for fever and first for the neurological syndrome." Or hedge: "may blunt the therapy".

### U2. CAR-NK claims remain uncited (narrative L313 and glossary `car-nk`)
"Early studies suggest less cytokine release syndrome and less risk from donor cells, at the cost of persisting for a shorter time" is correct and appropriately hedged, but carries no source in a chapter where every other quantitative claim does. The earlier review's should-fix 8 was not acted on.
**Add:** Liu E et al. Use of CAR-transduced natural killer cells in CD19-positive lymphoid tumors. *N Engl J Med* 2020;382:545–553. doi:10.1056/NEJMoa1910607 (PMID 32023374).

### U3. Allogeneic gene-edited products: "early results that look encouraging but shorter-lived than a patient's own cells" (L313)
Uncited. True of published allogeneic CD19 experience, but it is a comparative persistence claim and the chapter sources far smaller claims. Either cite an allogeneic series or soften to "early results that look encouraging, with the engineered cells so far disappearing sooner than a patient's own".

### U4. "A potentially field-changing idea with roughly ten patients behind it" (L315) understates the 2026 record
The two cited studies do total ten patients, but by October 2026 in-vivo CAR-T has substantially more human exposure, almost all of it company-reported: Kelonia's inMMyCAR phase 1 of KLN-1010 (in vivo BCMA CAR) reported **18 patients dosed** at ASCO 2026.
**Evidence:** Kelonia Therapeutics press release, 31 May 2026 (ASCO abstract 7509, *J Clin Oncol* 2026;44(16_suppl):7509) — https://www.businesswire.com/news/home/20260531412768/en/
**Fix:** "A potentially field-changing idea with a few dozen patients behind it, most of them in datasets the companies have announced but not published."

### U5. "In 2010 a patient given ten billion HER2-targeted CAR-T cells…" (L242)
[^16] is a 2010 publication and does not date the infusion; the dose (10^10 cells), the 15-minute respiratory failure, the death at day 5 and the hypothesis-not-proof framing are all exact. Safer: "In a 2010 case report, a patient given ten billion…". (Worth one clause: the construct was a *third-generation* CAR built on trastuzumab's binder — it ties the case to the deep-dive's "more signal is not better signal".)

### U6. satri-cel toxicity denominators (L275)
"Nearly every treated patient had cytokine release syndrome, and 99% had a grade 3 or worse side effect of some kind" is exact — but those are the **safety set (88 infused patients)**, while the PFS comparison is intention-to-treat (104 vs 52 randomized, 88 vs 48 treated). One clause ("among the 88 who actually received the cells") keeps the chapter's usual precision. The randomized response contrast (confirmed ORR ~22% vs 4%) is still absent, which the first review recommended.
**Evidence:** Qi C et al. *Lancet* 2025;405:2049–2060, PMID 40460847.

### U7. "roughly 60% eventually relapse or lose the response" (key-idea, L177)
Correct arithmetic, but it is derived from one product in one trial (ZUMA-1: 83% ORR, responses ongoing in 31% of all treated at median 63 months → ~37% of responders still in response). As a general statement about "lymphoma patients who respond" it should be attributed ("in the trial with the longest follow-up").

### U8. Figure `ch10-journey`: "This example runs three weeks. Five is common."
Defensible, but the three-week example is faster than any product's real-world median: meta-analysed vein-to-vein medians are 30.6 days (axi-cel), 35.9 days (liso-cel) and 48.4 days (tisa-cel), and a real-world Indian series reports a median of 29 days with a centralized coordination unit.
**Evidence:** Locke FL et al. *Blood Adv* 2025;9:2663–2676, PMID 39883946; Karulkar A et al. *Blood Cancer J* 2026, PMID 42463637.
**Fix:** "This example is a fast one — three weeks. Four to seven is more typical." (The day counter is now monotonic; the earlier review's Must-fix 8 is resolved.)

---

## 3. Citation problems

- **C1. [^9] (Westin 2023) does not report the 60% figure attached to it (L216).** The all-grade (60%) and grade ≥3 (21%) neurologic-event rates for second-line axi-cel are in the ZUMA-7 primary report; Westin's 5-year survival analysis reports only "No new treatment-related deaths had occurred since the primary analysis". Replace or add: **Locke FL et al. *N Engl J Med* 2022;386:640–654, PMID 34891224.**
- **C2. The "13%" ceiling of the severe-CRS range (L184) is not in the sources cited.** [^8] (5-year ZUMA-1) reports grade ≥3 CRS **11%**; the 13% figure is from Neelapu 2017 (PMID 29226797, uncited). Either write "about 1% to 11%" with the present citations, or add the 2017 paper.
- **C3. [^25] is still a seven-item bundle cited at five places** (L293, L299, L227, and the regulatory sentences). URLs were added — good — but (a) the US WorldMeds full-approval item has no link, and (b) "marketing-authorization application withdrawn during review, record last updated 14 Sep 2026" gives a database retrieval date rather than the event date. The EMA withdrawal was **22 July 2025** (EMA withdrawal letter and Q&A for Amtagvi; Amass record `AMRC_1CN9mMpU2DNWdEkefGN1duujmcm`, authorizationStatus WITHDRAWN_DURING_REVIEW). Give the date, and split the FDA approvals from the EMA withdrawal from the company announcement.
- **C4. [^24] points at a news index, not the announcement.** `https://www.carsgen.com/en/news/` is a rolling list; a reader cannot land on the 22 June 2026 NMPA item. Cite the dated release (or OncLive/FiercePharma coverage of 22–26 June 2026) alongside [^17] for the trial.
- **C5. The Breyanzi MZL response rate inside [^25] ("response rate 95.5%") needs its denominator.** FDA's release: 95.5% of the **66 patients treated**, CR 62.1%, median follow-up 21.6 months. As written the number floats free of its population.
- **C6. No citation for the in-vivo-CAR-T framing claims in the narrative** ("potentially a fraction of the cost", L315) — opinion-grade and fine, but note that [^31]'s product needed no lymphodepletion while [^32]'s is an mRNA-LNP given repeatedly; "no lymphodepletion" is true of [^31] only.

---

## 4. Verified correct (compact: claim → source)

**Opening/history** — Aug 2011 Penn CLL report, ~10^7 cells (1.5×10^5/kg), >1000-fold expansion, CR, CAR⁺ cells at 6 months → Porter PMID 21830940 · Gross/Waks/Eshhar 1989 anti-hapten chimera, MHC-independent killing, Weizmann → PMID 2513569 · Kershaw 2006 ovarian FR-CAR with Fcγ chain: abundant 2 days, barely detectable at 1 month, no tumour reduction → PMID 17062687 · Maher/Sadelain 2002 CD28–ζ single chain → PMID 11753365 · Imai/Campana 2004 4-1BB → PMID 14961035 · Emily Whitehead April 2012, age 6, two prior relapses, first child, CHOP 10-year "cure" statement → [^6][^28] · etanercept + tocilizumab reversed the syndrome without impairing expansion or efficacy → PMID 23527958 · CD19-negative relapse ~2 months in the second child → PMID 23527958.

**Trial numbers** — ELIANA 81% remission ≤3 months, all MRD-negative, 76% alive at 12 months, CRS 77% → PMID 29385370 · ZUMA-1 5-year ORR 83%, CR 58%, 31% ongoing, 42.6% OS, polyclonal B-cell recovery 91% ("B cells return") → PMID 36821768 · CARTITUDE-4 12-month PFS 75.9% vs 48.6%, grade 3/4 CRS 1.1%, ICANS all grade 1–2 → PMID 37272512 · FELIX/obe-cel 77% remission, grade ≥3 CRS 2.4%, grade ≥3 ICANS 7.1%, intermediate-affinity/fast-off-rate premise → PMID 39602653 · Melenhorst: two 2010-treated CLL patients, decade-long remissions, CD4-dominant CAR-T → PMID 35110735 · non-relapse mortality across 7,604 patients, infection 50.9% of 574 deaths, CRS+ICANS+HLH 11.5% ("one in nine") → PMID 38977912 · Verdun & Marks: 22 reported T-cell malignancies, >27,000 US doses since 2017, CAR transgene in 3, all within 2 years and about half within 1 → PMID 38265704 · Hamilton: 724 patients, one secondary T-cell lymphoma, EBV-positive, DNMT3A/TET2 clonal haematopoiesis, no oncogenic vector integration → PMID 38865660 (full text PMC11338600) · satri-cel CT041-ST-01 median PFS 3.25 vs 1.77 months (≈6 weeks), CRS 95%, grade ≥3 TEAE 99% → PMID 40460847 · Rohaan TIL vs ipilimumab 49% vs 21%, grade ≥3 AEs in all TIL patients → PMID 36477031 · Morgan 2010 HER2 CAR: 10^10 cells, respiratory distress within 15 minutes, death day 5, "we speculate… low levels of ERBB2 on lung epithelial cells" → PMID 20179677 · Linette: affinity-enhanced HLA-A*01 MAGE-A3 TCR, **the first two treated patients** died of cardiogenic shock within days, cross-reactivity with a titin peptide → PMID 23770775 · SPEARHEAD-1 and the June 2026 confirmatory dataset (137 patients, ORR 43.8% ≈ "four in ten") → PMID 38554725 + US WorldMeds release 22 Jun 2026 · Steffin: GPC3 CAR alone 0 objective responses, IL-15-armoured 33% response/66% disease control, more CRS, iCasp9 switch worked → PMID 39604730 · Choi: intraventricular CARv3-TEAM-E (EGFRvIII CAR secreting an EGFR engager), 3/3 rapid regression, durable in one → PMID 38477966 · Monje: GD2-CAR IV then intracranial, 4 major volumetric reductions, 9 with neurological benefit, one CR >30 months → PMID 39537919 · Roybal synNotch AND gate, requires new gene expression → PMID 26830879 · Müller: 15 patients (SLE/myositis/SSc), all SLE in DORIS remission, all myositis ACR-EULAR major response, immunosuppression stopped in all, grade 1 CRS in 10, B-cell aplasia 112±47 days (≈3–4 months), naive returning B cells → PMID 38381673 · An: in-vivo anti-BCMA (ESO-T01), 5 patients, no apheresis/manufacturing/lymphodepletion, 4/5 responses incl. 3 sCR, grade ≥3 AEs in all, stopped early 2025 → PMID 41882404 · in-vivo CD19 CAR mRNA-LNP in 5 refractory SLE patients, B-cell depletion and falling disease activity → PMID 40961420 · randomized CD19 CAR-T autoimmune trials are indeed running → ClinicalTrials.gov NCT06193889, NCT06655896, NCT06868290, NCT07335562.

**Regulatory** — tisa-cel/axi-cel 2017 · lifileucel 16 Feb 2024, ORR 31.5% in 73 patients · afami-cel accelerated 2 Aug 2024, full approval + ages ≥12 on 22 Jun 2026 · obe-cel 8 Nov 2024 · boxed warning for T-cell malignancies 18 Apr 2024 · REMS eliminated 26 Jun 2025 with proximity 4→2 weeks and driving 8→2 weeks · liso-cel for MZL 4 Dec 2025 · satri-cel NMPA **conditional** approval 22 Jun 2026, CLDN18.2⁺/HER2⁻ gastric/GEJ after ≥2 lines, first solid-tumour CAR-T approval anywhere · Amtagvi EMA application withdrawn during review (Amass EMA record) · "every approved CAR-T product is second generation" holds.

**Mechanism, figures, quiz, glossary** — CAR domain order and CD3ζ/CD28/4-1BB assignment; three ITAMs; generations 1–4 and "no third-generation product broadly approved"; CD28 vs 4-1BB kinetics mapped to the right products; hinge/anchor geometry and binder-affinity trade-off; surfaceome "a few thousand of some twenty thousand"; CRS cascade (CAR-T → IFN-γ/TNF → host macrophages → IL-6), tumour burden as severity driver, tocilizumab as **IL-6 receptor** blocker (earlier Must-fix 1 resolved everywhere, including quiz and takeaways), IL-6 rising a day after expansion *starts* and peaking alongside it (earlier should-fix 9 resolved), fever-is-not-a-progress-bar caveat present (should-fix 10 resolved); `ch10-journey` day counter now monotonic and step 9 now says B cells usually return (Must-fix 3 and 8 resolved); logic-gate trade-off and "every approved product uses a single target"; lymphodepletion rationale (IL-7/IL-15 competition, Treg depletion, cytopenias); "the dose is not the dose"; lentiviral permanence; CAR/TIL/TCR-T comparison table (MHC-independence, intracellular visibility, HLA restriction, MHC-loss susceptibility, target number, indications); quiz Q1 distractor now names the Chapter 5 killer T cell (Must-fix 5 resolved); all 20 chapter glossary entries accurate.
