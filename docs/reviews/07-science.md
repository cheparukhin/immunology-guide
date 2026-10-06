# Science review: Chapter 7, "Hide and Seek" (`content/drafts/07-escape.md`)

Reviewer: scientific review (tumor immunology, immunosurveillance and escape). Line numbers refer to the draft as of 2026-10-05. Knowledge cutoff for status claims: October 2026.

## Overall assessment

This is an accurate, well-sourced chapter that covers everything the PLAN gives it. All 20 citations exist and match their authors, title, journal, year, volume, pages and DOI (PMIDs are listed below). Each citation supports the sentence it is attached to, with one mismatch (M5). The key numbers check out against primary sources:
- every SIR, confidence interval and case count used in the ch07-evidence chart (Engels 2011, Table 2);
- the Jin 2024 meta-analysis figures;
- the Immunoscore recurrence rates (8% vs 32%);
- the 40% rejection of unedited sarcomas;
- spectrin-β2 escape clones that truly lacked the mutation;
- HLA LOH in about 40% of NSCLC;
- the Zaretsky JAK1/JAK2/B2M cases.

The real problems are in three places. First, one chart row: liver cancer is shown as an 11.6-fold "infection-driven" rise, but that excess is mostly explanted-liver cancers recorded after transplant (an artifact). Second, the immunoediting simulation: as specified, its transplant test cannot produce the outcome it promises. Third, the main text says cell therapies and engagers "skip straight to recognition", which contradicts the chapter's own figure spec and hides why solid tumors are hard. Two status claims are now out of date as of October 2026. China approved a CAR-T for a solid tumor in June 2026, and a personalized mRNA vaccine had a positive phase 3 in August 2026. The rest are calibration fixes: the kidney-donor survivor's cure, glucose competition, TGF-β blockade, and "T cells predict survival".

**Supervisor's extra item (Stutman / nude mice):** Ch7 does **not** cite Dobosz & Dzieciątkowski 2019. The 1974 sentence (line 25) cites [^2], Dunn et al. 2002, which correctly reports Stutman's null result, and Shankaran 2001 [^3] states it in its abstract. The primary paper confirms it. Stutman O. *Science* 1974;183:534–536 (PMID 4588620, doi:10.1126/science.183.4124.534) found "no differences in either latent period or incidence of local sarcomas or lung adenomas within 120 days" between nu/nu and nu/+ mice. The sentence is correct and supported. Optional: add Stutman 1974 as a primary citation (O1).

---

## Must fix

**M1. ch07-evidence: the liver-cancer row is mostly an artifact but is shown as a large infection-driven rise (line 120; also step 3 caption line 113 and alt text line 137)**
- Quote: "Liver | 11.56 | … | infection | Hepatitis B and C viruses (many cases) | Almost all of the excess is in liver-transplant recipients (about 44×), whose original liver disease set the stage; their risk was highest in the first six months after transplant." The alt text lists "liver cancer" among "the largest increases … in infection-driven cancers".
- Problem: Engels et al. report that 95.4% of liver cancers in liver recipients were diagnosed in the first 6 months (SIR 509). They judge this "probably an artifact of delayed recognition or reporting"; the "vast majority of early cancers were prevalent cases from the explanted liver". In recipients of other organs, liver-cancer risk "showed no elevation" (Engels 2011, PMC3310893). The Jin 2024 meta-SIR for liver cancer in transplant recipients is only 2.74 (95% CI 1.14–6.59). Plotted as the third-highest red "infection" dot, the row overstates the evidence for the chart's thesis.
- Fix (pick one):
  - (a) Drop the row.
  - (b) Keep it, but encode it as "excluded/artifact": a hollow red marker with a dashed whisker, sorted to the bottom of its group. Use this note: "Mostly cancers already present in the diseased liver that was removed at transplant, recorded in the first months afterwards. Not raised in kidney or heart recipients; after the first 6 months, liver recipients' risk was about 2×."
  - In either case, remove "liver cancer" from the alt text's list of largest increases.

**M2. ch07-immunoediting: the "transplant test" cannot produce the outcome the spec promises (lines 250–254, with tuning targets lines 227–232)**
- Quote: "seeds those 40 cells, sets pressure to Medium … a tumor that grew with pressure Off (unedited, mean v ~0.6) is usually rejected; an escaped tumor … grows."
- Problem:
  - A tumor grown with pressure Off keeps the starting distribution: mean v ≈ 0.6, with about 30% of cells at v ≈ 0.05–0.4. Seeding 40 such cells under Medium pressure is the same situation as the default start. The spec explicitly tunes Medium so that this start goes elimination → equilibrium → **escape**. So "usually rejected" will not emerge from the model as written. The builder will either see escape, or quietly add a special case.
  - Also, the real figure was 40% rejection, so "usually" is too strong. Caption 4's "often" is fine.
- Fix: run the transplant test at **High** pressure (label: "a fresh host whose immune system has never been dampened"), or narrow the initial low-visibility fraction. Add explicit tuning targets: "Unedited (Off-grown) tumor: rejected (N→0) in roughly 4–6 of 10 transplant runs. Edited (escaped, mean v < 0.2) tumor: grows in ≥9 of 10." Change "is usually rejected" to "is often rejected".

**M3. "Skip straight to recognition" contradicts the figure spec and misstates how cell therapies work (line 300)**
- Quote: "Engineered T cells and T-cell-engaging antibodies skip straight to recognition (Chapters 9 and 10)."
- Problem: these therapies make release, presentation and priming (steps 1–3) unnecessary. But infused or redirected T cells still have to traffic to the tumor, get in, and kill (steps 4, 5, 7). The chapter's own cycle spec states this as "IMPORTANT" (line 363) and calls it "the real reason they struggle in many solid tumors". The main-text sentence teaches the opposite.
- Rewrite: "Engineered T cells and T-cell-engaging antibodies bypass the first three steps — no antigen release, presentation or priming needed — but the T cells they supply or redirect still have to reach the tumor, get in, and kill (Chapters 9 and 10)."

**M4. Cyclosporine is not an established cause of bladder cancer (line 143)**
- Quote: "Azathioprine and cyclosporine are classified as human carcinogens for lymphoma and non-melanoma skin cancers, and cyclosporine also for bladder cancer."
- Problem: the clause repeats a sentence in Jin 2024's discussion, but it does not match IARC. IARC's "List of classifications by cancer sites" (Vols 1–141) lists ciclosporin under non-Hodgkin lymphoma, skin (squamous-cell carcinoma) and "multiple sites (unspecified)". It does not list it under urinary bladder. The bladder agent among immunosuppressive/cytotoxic drugs is **cyclophosphamide**. Source: https://monographs.iarc.who.int/wp-content/uploads/2019/07/Classifications_by_cancer_site.pdf
- Rewrite: "Azathioprine and cyclosporine are classified as human carcinogens, causing lymphoma and skin squamous-cell carcinoma."

**M5. Wrong citation for "melanoma about 2.4-fold" (line 47)**
- Quote: "Some non-viral cancers do rise in transplant recipients — melanoma about 2.4-fold, for example — but the drugs themselves muddy that picture.[^5]"
- Problem: 2.4 (2.38) is the Engels figure [^4]. Jin 2024 [^5] gives a cutaneous-melanoma meta-SIR of 2.20 (1.88–2.57), and finds it raised in transplant recipients only, not in people with HIV. Engels also notes that heightened skin surveillance may inflate melanoma, kidney and thyroid SIRs.
- Rewrite: "Some non-viral cancers do rise in transplant recipients — melanoma about twofold, for example — but it does not rise in people with HIV, and the drugs (and closer skin checks) muddy that picture.[^4][^5]"

**M6. CAR-T status is out of date (cycle data, line 420)**
- Quote: "car-t | CAR-T cells | … | Approved in blood cancers".
- Problem: on 22 June 2026, China's NMPA approved satricabtagene autoleucel (satri-cel, a Claudin18.2 CAR-T) for CLDN18.2-positive, HER2-negative advanced gastric/GEJ adenocarcinoma after ≥2 prior lines. It is the first CAR-T approved anywhere for a solid tumor (OncLive, 22 Jun 2026: https://www.onclive.com/view/china-s-nmpa-approves-first-car-t-cell-therapy-for-cldn18--2-her2-advanced-gastric-gej-adenocarcinoma). This module is reused in Ch 12, so the status pill should be right.
- Rewrite status: "Approved in blood cancers; first solid-tumor approval (stomach cancer, China, 2026)". Ch 10 should own the detail; the writer may want to flag this to the Ch 10/12 writers.

---

## Should fix

**S1. The kidney-recipient's cure owed as much to surgery as to "restored defenses" (lines 13, 15, 637)**
- Quotes: "Three years after his transplant, he showed no sign of melanoma." "And when one recipient's defenses were restored, he recovered." "In the man who survived, doctors restored the hunt."
- Problem: per the MacKie letter, scans showed the man's melanoma confined to the transplanted kidney. Immunosuppression was stopped and interferon was given *to provoke rejection of the graft*. After 13 weeks rejection began, and the kidney (with the tumor) was removed. The letter reports him well "two years after the diagnosis of melanoma", which is about four years after transplant. The woman also had immunosuppression stopped and a trial of interferon, and still died (March 2000). The narrative credits immune restoration alone.
- Rewrite line 13 end: "…which was then removed, tumor and all. Two years after his melanoma was found, he was well, with no sign of it." Line 15: "And when one recipient's defenses were restored and the kidney carrying the tumor was removed, he recovered." Line 637: "In the man who survived, doctors removed the tumor-bearing kidney and let his defenses return."

**S2. The simulation's equilibrium caption contradicts the chapter's own evidence (line 271; spec "SCIENTIFIC CARE" lines 259–265)**
- Quote: "2. Equilibrium. The survivors are harder to see. T cells destroy them about as fast as they divide…"
- Problem: Koebel 2007 [^8] (correctly described in the deep-dive at line 279) found that cells in equilibrium divided slowly and were still **unedited**; editing was seen only on escape. The model's equilibrium is a pure kill-versus-divide balance with editing already under way.
- Fix:
  - Caption: "Equilibrium. The tumor neither grows nor disappears: T cells kill some cells and hold back the growth of others about as fast as new ones appear — in people, possibly for years. Meanwhile, selection quietly favors the less visible."
  - Optional model tweak: T-cell proximity halves the division rate (cytostasis), which also helps produce the plateau.
  - Add to SCIENTIFIC CARE: "In the one direct mouse study, cells in equilibrium were still highly visible; this model compresses that into gradual editing."

**S3. ch07-evidence row selection and notes make the pattern look cleaner than the data (lines 71–73, 114–136)**
- Problem: Engels found 32 cancer types significantly raised. Several non-infection cancers omitted from the chart are raised as much as the shown "infection" rows:
  - intrahepatic bile duct 5.76×;
  - salivary gland 4.55×;
  - chronic myeloid leukemia 3.47×;
  - acute myeloid leukemia 3.01×;
  - eye 2.78×.
  
  The largest omitted category, "skin, non-epithelial" at 13.85×, is mostly Merkel cell carcinoma, which is largely polyomavirus-driven and so would *support* the thesis. Engels also attributes part of the breast/prostate *decrease* to screening before transplant, and part of the melanoma/kidney/thyroid excess to closer surveillance.
- Fix:
  - Add to the source line: "Selected sites; 32 cancer types were significantly raised, including some with no known infectious cause (e.g., salivary gland, bile duct, some leukemias)."
  - Add a note to Breast/Prostate: "Partly because people are screened for cancer before transplant."
  - Add a note to Melanoma/Thyroid: "Not raised in people with HIV; closer medical checks and the drugs may explain part of it (Engels 2011; Jin 2024)."
  - Optionally add a Merkel-cell row: Jin meta-SIR in transplant recipients 5.51 (2.84–10.70).

**S4. "Virtually every known infection-related cancer rises in both groups" (line 149)**
- Problem: Jin 2024 lists stomach cancer (H. pylori; shown in the chart as "infection") among the eight cancers raised **only** in transplant recipients. HPV-related oropharyngeal cancer was not significantly raised in people with HIV (SIR 1.37, 0.86–2.19, two studies).
- Rewrite: "virtually every virus-driven cancer rises in both groups…"

**S5. "T cells lose the competition for glucose" is contested (lines 492, 509, 587)**
- Problem: PET-tracer work found myeloid cells, then T cells, took up the most intratumoral glucose; cancer cells dominated glutamine uptake. Glucose was not limiting in those models (Reinfeld BI et al. *Nature* 2021;593:282–288, doi:10.1038/s41586-021-03442-1, PMID 33828302). Competition has support in some models (e.g., Chang 2015), but stating it as fact overreaches.
- Rewrite line 509: "…Activated killer T cells rely on the same fuel. In some tumors they may lose the competition for it, though recent measurements suggest nutrient use is divided up more by each cell's own programming than by a simple race; the acidic, lactate-rich fluid further blunts their production of IFN-γ." Line 587 card: "…make the tumor a hostile place for T cells."

**S6. TGF-β blockade: add the clinical reality (lines 488, 416)**
- Problem: the mouse result is presented without noting that translation has so far failed. The lead bifunctional TGF-β trap/anti-PD-L1, bintrafusp alfa, was stopped for futility in a phase 3 against pembrolizumab in PD-L1-high NSCLC. PFS was 7.0 vs 11.1 months, with more grade 3–4 toxicity (Cho BC et al. *J Thorac Oncol* 2023;18:1731–1742, doi:10.1016/j.jtho.2023.08.018, PMID 37597750).
- Fix: after line 488 add "Translating this into people has proved hard: the first TGF-β-blocking drug to reach a large trial did no better than a standard PD-1 blocker." Change the chip status to "In trials (early attempts failed)".

**S7. "T cells in a tumor predict better survival" needs "in many cancers" (lines 159, 668)**
- Problem: the association is strong in colorectal, lung, ovarian and other cancers. But it is not universal: in clear-cell renal cell carcinoma, dense CD8 infiltration is linked to *worse* prognosis (Fridman WH et al. *Nat Rev Clin Oncol* 2017;14:717–734, doi:10.1038/nrclinonc.2017.101, PMID 28741618).
- Rewrite: "…and in many cancers, patients whose tumors are full of T cells tend to do better."

**S8. Vaccine chip status could note the 2026 phase 3 (line 411)**
- "Approved in some cancers; personalized vaccines in trials" is still technically true. But on 19 Aug 2026, Merck/Moderna announced that INTerpath-001 met its RFS and DMFS endpoints. This was the phase 3 of intismeran autogene plus pembrolizumab vs pembrolizumab in 1,137 patients with resected stage IIB–IV melanoma (company release: https://www.merck.com/news/merck-and-moderna-announce-phase-3-interpath-001-trial-of-intismeran-autogene-plus-keytruda-met-endpoints-of-recurrence-free-survival-rfs-and-distant-metastasis-free-survival-dmfs-in-patient/). Suggested status: "Approved in some cancers; a personalized mRNA vaccine succeeded in a phase 3 melanoma trial (2026), not yet approved". Coordinate the wording with Ch 11.

---

## Optional

- **O1.** Add Stutman 1974 (PMID 4588620) as the primary source for line 25. The draft is already correct (see supervisor item above).
- **O2.** Line 27: "a RAG gene — one of the enzymes that cut and paste…". A gene is not an enzyme; use "a RAG gene, which encodes one of the enzymes that cut and paste…".
- **O3.** Line 27, "It came back in 2001": the revival began in the late 1990s, with IFN-γ-insensitive and perforin-deficient mice (1996–1998), as the deep-dive implies. Consider "It came back around the turn of the millennium; the decisive experiment was published in 2001."
- **O4.** Line 472, "In one study of melanomas, 98%…": the 98% (56/57) vs 28% (26/93) figures cover all 150 melanocytic lesions, including benign moles (Taube 2012). For melanomas alone the PD-L1+ figure is 42/43. Use "In one study of pigment-cell lesions, mostly melanomas,…".
- **O5.** Line 470, "often because T cells made them do it": this is fine. Optionally add that some tumors make PD-L1 on their own through cancer-driving changes (e.g., 9p24.1 amplification in Hodgkin lymphoma).
- **O6.** Line 482, M1/M2 as "its two ends": single-cell data show TAMs often co-express both programs. Consider "(M1 and M2 are useful labels, but real tumor macrophages usually mix features of both.)"
- **O7.** Kaposi sarcoma at about 800× in people with HIV: the CI is 200–3,208. Jin attributes part of it to higher HHV-8 prevalence among gay and bisexual men with HIV, not only immune loss. Consider "hundreds of times more common" plus that caveat.
- **O8.** ch07-tme: MDSC radius 0.9r makes them smaller than T cells. Granulocytic MDSCs are roughly neutrophil-sized (~10–12 µm, versus ~7 µm for a lymphocyte); use ~1.2–1.3r. Also: MHC-less "hiding" cells appear only in Desert mode. MHC loss is selected *by* T-cell pressure, so show a few in Inflamed mode too. In Desert mode, show generally low MHC (no IFN-γ to raise it).
- **O9.** Figure label format: "0.85×" breaks the stated "one decimal below 10" rule. Use "0.9×" (or allow two decimals below 1).
- **O10.** Line 507: cite the epacadostat failure directly, as ECHO-301/KEYNOTE-252: Long GV et al. *Lancet Oncol* 2019;20:1083–1097, PMID 31221619.
- **O11.** Glossary "cold-tumor": "cold" is often used for both desert *and* excluded (non-inflamed) tumors. One clause would prevent confusion with other sources.
- **O12.** Glossary "immunosurveillance": change "now well supported" to "now well supported in mice, and indirectly in people".
- **O13.** Quiz Q4: NK cells also need activating "stress" signals, not just missing MHC. Use "most likely to recognize it, if it also shows stress signals". The correct answer stays correct.

---

## Verified as correct (safe to keep)

- All 20 sources exist and match in authors, title, journal, year, volume, pages and DOI. PMIDs:
  - 1 = 12571271, 2 = 12407406, 3 = 11323675, 4 = 22045767, 5 = 38936380
  - 6 = 17008531, 7 = 29754777, 8 = 18026089, 9 = 22318521, 10 = 29107330
  - 11 = 23890059, 12 = 28102259, 13 = 37820582, 14 = 22461641, 15 = 29686425
  - 16 = 29443960, 17 = 33927375, 18 = 27433843, 19 = 25970248, 20 = 34990248
- MacKie case: 62-year-old donor, melanoma treated 1982, died 1998 of a hemorrhage, "considered cured". Transplants in May 1998. Both recipients had melanoma within ~2 years, with no primary found. The female recipient died in 2000. The male recipient: immunosuppression stopped, interferon given, graft rejected and removed, melanoma-free at follow-up.
- Stutman 1974: nude mice showed no excess MCA tumors. Caveats correct: residual T cells, NK cells, and the CBA/H strain's high-activity carcinogen-activating enzyme.
- Shankaran 2001: RAG2−/−, IFNGR/STAT1−/− and double-deficient mice develop more MCA sarcomas and spontaneous epithelial tumors. 40% of tumors from RAG2−/− mice were rejected in wild-type hosts; none from wild-type mice were. "Extrinsic tumor suppressor" is correctly paraphrased. The 30/52 vs 11/57 at 160 days is consistent with the paper, but I could not open the full text; confirm against Fig. 1a if convenient.
- Engels 2011: 175,732 transplants, 1987–2008, 13 registries. Every chart value matches Table 2: SIR, 95% CI and observed n for all 19 rows. The organ-specific notes are correct: NHL ~19× in lung recipients, lung cancer ~6× in lung recipients, kidney cancer ~6.7× in kidney recipients, liver cancer ~44× in liver recipients.
- Jin 2024: 46 HIV and 67 transplant studies (113). KS ~801× in HIV. cSCC ~46× in transplant recipients vs ~5× in HIV (single study). Eight cancers raised only in transplant recipients (incl. melanoma, colorectal, kidney, bladder, thyroid); none raised only in HIV. Cervix raised in transplant recipients. Breast and prostate not raised in either group.
- Galon 2006: type, density and location of T cells predicted survival better than standard staging.
- Pagès 2018: 2,681 patients with stage I–III colon cancer. 5-year recurrence 8% (high) vs 32% (low) in the training set, independent of stage and other factors.
- Koebel 2007: occult masses held in equilibrium by adaptive immunity (T cells, IFN-γ), not NK cells. Cells in the masses divided slowly and were unedited until escape.
- Matsushita 2012: mutant spectrin-β2 was the rejection antigen. Escape tumors grew from pre-existing clones that lacked the mutation at the DNA level, so "never carried that mutation" is accurate.
- McGranahan 2017: HLA LOH in 40% of NSCLC, often subclonal, enriched in metastases.
- Chen & Mellman 2013: seven-step cycle, correctly named and ordered. Anti-CTLA-4 at priming; anti-PD-1/PD-L1 and IDO inhibitors at killing.
- Chen & Mellman 2017: set point; inflamed / excluded / desert profiles.
- Mellman et al. 2023: intratumoral DC niches, stem-like T cells, "immunotype".
- Taube 2012: PD-L1 next to TILs and IFN-γ ("adaptive resistance"); the 98% vs 28% figures (but see O4).
- Mariathasan 2018: urothelial cancer treated with atezolizumab; non-response linked to TGF-β in fibroblasts and CD8 cells excluded to the stroma. In mice, TGF-β + PD-L1 blockade let T cells penetrate and tumors regress.
- Zaretsky 2016: 4 patients; JAK1 or JAK2 loss in 2, B2M truncation in 1.
- Spranger 2015: tumor-intrinsic WNT/β-catenin excludes the key dendritic cells and T cells in melanoma.
- Three 2020 studies (melanoma, renal cancer, sarcoma) link B cells/TLS to checkpoint response, as summarized by Schumacher & Thommen 2022.
- Mechanism statements are correct:
  - B2M is required for surface MHC-I.
  - IFN-γ induces PD-L1 and MHC and acts through JAK1/2.
  - CD39/CD73 convert ATP to adenosine, which acts on A2A receptors and raises cAMP; hypoxia induces both enzymes.
  - IDO1 converts tryptophan to kynurenine (AhR, Treg skewing).
  - HIF-1α programs; TGF-β suppresses CTLs and NK cells and induces Tregs.
  - MDSCs are related to neutrophils and monocytes.
  - CAFs and collagen form the "walls".
- Therapy statuses that remain correct:
  - anti-LAG-3 approved with nivolumab in melanoma (relatlimab, 2022);
  - IDO1 inhibitor failed (ECHO-301);
  - lifileucel and afami-cel approved (2024);
  - T-VEC approved;
  - imiquimod approved topically;
  - high-dose IL-2 approved;
  - bevacizumab-based immunotherapy combinations approved;
  - CD73/A2AR blockers still investigational.
- Quiz: all four keyed answers are correct and all distractors are wrong for the stated reasons. In Q1, the mice were syngeneic, so ordinary graft rejection is correctly excluded.
- Glossary: all definitions are accurate, apart from the small wording points in O11–O12.
