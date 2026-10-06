# Review: Interlude, scientific and historical accuracy
Draft: `content/drafts/interlude-history.md` ("130 Years of Immunotherapy"). Reviewed October 2026 against PLAN.md. All 35 timeline milestones, the narrative, the Go-deeper boxes, the quiz, the glossary and the 20 sources were checked. Sources used: PubMed, FDA.gov pages and approval records, Amass RegulatoryCore (the account hit its usage limit partway through, so the remaining checks used FDA.gov and PubMed), the Nobel 2018 Scientific Background PDF and Allison's Nobel biography (read in full), McCarthy 2006 and Rosenberg 2014 (read in full), and the company releases and trade coverage for August 2026.

## Overall assessment
This is a strong, well-sourced interlude. Almost every date, number and US approval checks out, sometimes to the day. Ipilimumab, pembrolizumab, blinatumomab, T-DXd, tebentafusp and tarlatamab were confirmed against FDA records, and the trial figures (Hodi 2010, Ribas 2013, Topalian 2012, NADINA, KEYNOTE-942, Haslam 2025) match their papers. It is also fair-minded: it covers Coley's weaknesses, the LAK detour, the patients who did not benefit and the honest response rates. The main problem is "firsts". Eight claims say "first" without saying "in the US", or give priority where it is contested. Two of them are contradicted by the draft's own sources: Coley as the first deliberate attempt (sources [1] and [2] both name earlier German clinicians), and Eshhar's 1989 receptor as the first CAR (source [13] cites the 1987 Kuwana paper and not Gross 1989). One of the late-2026 items is also misdescribed. The BioNTech colorectal trial was not stopped "after crossing a futility boundary". The boundary was crossed in October 2025 and the trial continued. It was ended in August 2026 after the safety board saw an imbalance in overall survival, and it tested the vaccine alone, without a checkpoint inhibitor. The PD-L1 credits are muddled, and the RAG-knockout mice are said to lack all lymphocytes, which contradicts the NK-cell point the same box has just made. Every fix is a short wording change.

---

## Must fix

**1. Coley as "the first deliberate attempt" (timeline `coley-1891`, "why")**
Quote: "The first deliberate attempt to turn an immune reaction against cancer."
Problem: The draft's own sources say otherwise. McCarthy [1]: "in 1888, Bruns intentionally injected a cancer patient with the streptococcus organism to induce erysipelas". The Nobel Scientific Background [2]: "the first attempts in this field were by German clinicians 150 years ago (Busch, 1868, Fehleisen, 1882)". The framing is also anachronistic: Coley did not think in terms of immunity. This is the classic Coley myth.
Rewrite ("why"): "The first sustained, systematic attempt to treat cancer by provoking an infection-like reaction. German doctors (Busch, Fehleisen, Bruns) had tried deliberate erysipelas infections before him. It was dramatic in some patients, inconsistent overall and never properly tested, and radiation eventually eclipsed it."
Optional, for the narrative ("A surgeon's hunch"): "Coley was not the first to try this: German surgeons had deliberately infected cancer patients with erysipelas in the 1860s–80s. But he pursued it for 40 years."

**2. The BioNTech colorectal trial is misdescribed and not labeled (narrative, "Personalized vaccines" bullet)**
Quote: "The same month, a trial of another personalized vaccine, autogene cevumeran, in colorectal cancer was stopped after crossing a futility boundary.[^19]"
Problem: Per the company announcement of 28 Aug 2026 (BNT122-01, NCT04486378), "the futility boundary was crossed in October 2025". The safety board then judged the data immature, and the trial continued. The August 2026 termination followed a board finding of "a numerical imbalance in overall survival between treatment arms", with continuation "unlikely to change the efficacy outcome". The direction of the imbalance was not disclosed. The trial also tested the vaccine as **monotherapy** against watchful waiting in ctDNA-positive resected stage II–III colorectal cancer. Intismeran was tested **with pembrolizumab**. That contrast is the scientifically important point, and the draft does not label the result as company-reported. Sources: [BioNTech statement](https://www.biontech.com/int/en/home/mediaroom/news/statements/2026/08/BioNTech-Provides-Update-on-Phase-2-Clinical-Trial-of-Autogene-Cevumeran-in-Resected-Colorectal-Cancer.html); [6-K text](https://www.stocktitan.net/sec-filings/BNTX/6-k-bio-n-tech-se-current-report-foreign-issuer-8221558b3929.html); [CancerNetwork](https://www.cancernetwork.com/view/autogene-cevumeran-trial-terminated-in-resected-colorectal-cancer).
Rewrite: "Not every attempt has worked. In August 2026 BioNTech reported that it had ended a phase 2 trial of another personalized mRNA vaccine, autogene cevumeran, given on its own (without a checkpoint inhibitor) after colorectal-cancer surgery. The trial had crossed a pre-set futility boundary in October 2025, and its monitoring board later saw an imbalance in overall survival between the arms.[^19] A pancreatic-cancer trial that combines the vaccine with a checkpoint inhibitor continues."

**3. Lifileucel as "the first cell therapy approved for a solid tumor" (timeline `lifileucel-2024`, "why")**
Problem: Sipuleucel-T (Provenge, April 2010), which is on this same timeline, is an autologous cellular immunotherapy for prostate cancer, a solid tumor. FDA lists it among approved cellular and gene therapy products ([FDA list](https://www.fda.gov/vaccines-blood-biologics/cellular-gene-therapy-products/approved-cellular-and-gene-therapy-products)). FDA's own wording for Amtagvi was "the first cellular therapy indicated for... melanoma" and "the first FDA-approved tumor-derived T cell immunotherapy" ([FDA, 16 Feb 2024](https://www.fda.gov/news-events/press-announcements/fda-approves-first-cellular-therapy-treat-patients-unresectable-or-metastatic-melanoma)).
Rewrite: "The first T-cell therapy approved for a solid tumor, about 35 years after the first TIL report."
Cross-chapter note for the supervisor: `10-cell-therapy.md` line ~291 has the same error ("the first cell therapy of any kind approved for a solid tumor").

**4. T-VEC as "the first approved oncolytic virus" (timeline `tvec-2015` "why"; narrative "In 2015: the first oncolytic virus, T-VEC")**
Problem: Oncorine (H101), an oncolytic adenovirus, was approved in China in November 2005 for head-and-neck cancer with chemotherapy (Liang, *Curr Cancer Drug Targets* 2018, PMID 29189159). Rigvir was registered in Latvia in 2004 (later controversial). T-VEC was the first approved in the US, which is how Chapter 11 already phrases it.
Rewrite (card): "The first oncolytic virus approved in the US, a living drug designed to make a tumor help immunize the body against itself." Narrative: "In 2015: the first oncolytic virus approved in the US, T-VEC (Imlygic)."

**5. Blinatumomab as "the first approved bispecific T-cell engager" (timeline `blinatumomab-2014`; narrative "the first bispecific T-cell engager, blinatumomab")**
Problem: Catumaxomab (Removab), an EpCAM×CD3 bispecific antibody, was approved in the EU in April 2009 for malignant ascites (Seimetz et al., *Cancer Treat Rev* 2010, PMID 20347527; Linke et al., *mAbs* 2010, PMID 20190561).
Rewrite (card "why"): "The first bispecific T-cell engager approved in the US (Europe had approved one, catumaxomab, for fluid buildup caused by abdominal cancers in 2009). Others followed, at first mostly for blood cancers." Narrative: "...and the first US-approved bispecific T-cell engager, blinatumomab (Blincyto)."

**6. Rituximab as "the first monoclonal antibody approved to treat cancer" (timeline `rituximab-1997`; narrative "the first approvals for cancer arrived: rituximab...")**
Problem: Edrecolomab (Panorex, anti-17-1A/EpCAM) was approved in Germany in 1995 for adjuvant colorectal cancer (White et al., *Annu Rev Med* 2001, PMID 11160771, which also calls rituximab "the first such therapy approved in the United States").
Rewrite (card): "...becomes the first monoclonal antibody approved in the US to treat cancer." Narrative: "...the first US approvals for cancer arrived: rituximab..."

**7. "The first CAR" (timeline `car-1989` title and "what"; narrative "the first chimeric antigen receptor, or CAR"; portrait "Zelig Eshhar built the first CAR in 1989")**
Problem: The priority is contested, and the draft presents it as settled. Kuwana, Kurosawa and colleagues (Fujita Health University, Japan) published antibody-V/TCR-C chimeric receptors in T cells in December 1987 (*BBRC* 149:960, PMID 3122749). The draft's own source [13] (June & Sadelain 2018) cites Kuwana 1987 and Eshhar 1993 as the founding CAR papers and does not cite Gross 1989. Eshhar's group made the decisive further step in 1993: the single-chain "T-body" (antibody fragment fused to CD3ζ), which is the template of modern CARs (*PNAS* 90:720).
Rewrite (card title): "Early CARs" or "Antibody-guided T cells". "What": "Gideon Gross, Tova Waks and Zelig Eshhar at the Weizmann Institute attach antibody parts to a T-cell receptor, giving T cells antibody-like targeting, one of the first chimeric antigen receptors (CARs). A Japanese team had reported a similar design in 1987, and Eshhar's 1993 single-chain version became the template for today's CARs." Narrative: "...had fitted T cells with a synthetic receptor built from antibody parts, one of the first chimeric antigen receptors, or CARs." Portrait: "Zelig Eshhar built some of the first CARs (1989) and the single-chain design used today (1993)." Add Kuwana 1987 and Eshhar 1993 to Sources.

**8. Emily Whitehead as "the first child to receive CAR-T cells" (narrative, "The dam breaks")**
Problem: Children with neuroblastoma received GD2-targeted CAR-T cells at Baylor years earlier (Pule et al., *Nat Med* 2008, PMID 18978797). The timeline card's wording ("first child treated with CD19-targeted CAR-T cells") is more defensible. CHOP's own claim is "first pediatric patient ever to receive the treatment", meaning Penn's CTL019.
Rewrite: "In April 2012, six-year-old Emily Whitehead, whose leukemia had relapsed twice, became the first child to receive CD19-targeted CAR-T cells."

**9. PD-L1 credit is garbled (narrative, "The brakes nobody was looking for")**
Quote: "With Gordon Freeman, Arlene Sharpe, Lieping Chen and others, its partner molecule PD-L1 was identified."
Problem: This implies that Honjo, Sharpe and Chen worked together. Per the Nobel Scientific Background [2], Honjo's lab identified PD-1's ligand "together with the groups of Gordon Freeman and Clive Wood (Freeman et al, 2000)". Lieping Chen's lab had independently cloned the same molecule in 1999 as B7-H1, without linking it to PD-1. Arlene Sharpe co-identified the second ligand, PD-L2 (Latchman 2001).
Rewrite: "In 1999 Lieping Chen's lab described a molecule it called B7-H1. In 2000 Honjo's lab, working with Gordon Freeman and Clive Wood, showed that this molecule, renamed PD-L1, is PD-1's partner. By 2002, two groups (Chen's and Honjo's) had shown that tumors can display PD-L1 to switch off the T cells attacking them."

**10. RAG-knockout mice "lack... other lymphocytes completely" (deep-dive "The nude mouse that fooled a field")**
Quote: "with mice engineered to lack T cells, B cells and other lymphocytes completely."
Problem: Shankaran et al. 2001 (*Nature* 410:1107, PMID 11323675) used RAG2-knockout mice, which lack T, B and NKT cells but keep NK cells. The previous paragraph has just argued that nude mice's NK cells confounded Stutman's result. Claiming that these mice lack all lymphocytes is wrong, and the logic of the two paragraphs then conflicts.
Rewrite: "...with mice engineered to lack T cells, B cells and NKT cells entirely (they still have NK cells), and with mice that could not respond to the immune signal interferon-gamma."

---

## Should fix

**1. Kymriah as "the first gene therapy approved in the US" (timeline `kymriah-2017` "why"; narrative "It was also the first gene therapy approved in the US")**
Problem: This is FDA's own 2017 framing ("first gene therapy available in the United States"), but it is contested. T-VEC (2015, on this timeline) is a genetically engineered virus, and FDA lists Imlygic among approved cellular and gene therapy products.
Rewrite: "...the first CAR-T therapy, which the FDA described as the first gene therapy available in the US."

**2. Tarlatamab card: "T-cell engagers reach solid tumors" / "had long been confined to blood cancers" (and the narrative bullet)**
Problem: Tebentafusp (January 2022) was the first T-cell engager the FDA approved for a solid tumor ([ASCO Post](https://ascopost.com/issues/february-25-2022/fda-approves-tebentafusp-tebn-for-the-treatment-of-unresectable-or-metastatic-uveal-melanoma/)). Catumaxomab (EU 2009) treated fluid buildup from carcinomas. A 2024 card titled "reach solid tumors" therefore misdates the event. Tebentafusp is also a soluble T-cell receptor fused to an anti-CD3 fragment, not an antibody, so "These bispecific antibodies... Tebentafusp" is inaccurate.
Rewrite: card title "A T-cell engager for lung cancer". "Why": "Tebentafusp (2022) had shown that T-cell engagers could work in a rare solid tumor. Tarlatamab brought them to a common, aggressive one." Narrative: "These bispecific molecules physically link T cells to cancer cells. Tebentafusp (Kimmtrak), built from a T-cell receptor rather than an antibody, was approved for a rare eye cancer in 2022..."

**3. Ipilimumab comparator (timeline `ipilimumab-2011` "what"; narrative "Median survival rose from 6.4 to 10 months")**
Quote: "...was 10 months, versus 6.4 months without it."
Problem: The control arm received a gp100 peptide vaccine alone, and all 676 patients had previously treated, HLA-A*02:01-positive disease (Hodi 2010, PMID 20525992).
Rewrite: "...median survival was 10 months with ipilimumab, versus 6.4 months with an experimental peptide vaccine alone, in previously treated patients."

**4. INTerpath-001 and KEYNOTE-942: labeling and the combination (narrative "Personalized vaccines" bullet; `interpath-2026` "why")**
The facts check out. Merck and Moderna announced on 19 Aug 2026 that the trial (1,137 patients, randomized 2:1, stage IIB–IV resected melanoma) met its RFS primary endpoint and its key secondary endpoint, DMFS. No hazard ratio was released, and the companies say the data will be presented at a meeting ([AJMC](https://www.ajmc.com/view/moderna-merck-mrna-cancer-vaccine-succeeds-in-late-stage-trial), [CancerNetwork](https://www.cancernetwork.com/view/novel-cancer-vaccine-meets-primary-secondary-end-points-in-resected-melanoma)). KEYNOTE-942: 157 patients, HR 0.561 (95% CI 0.309–1.017; two-sided p = 0.053), *Lancet* 2024 (PMID 38246194). Three problems remain. (a) PLAN requires "the company reported" wording, but the narrative says "was announced as positive". (b) Both trials added the vaccine to pembrolizumab, which the narrative never says. (c) "The first positive phase 3 result for a vaccine built from each patient's own tumor mutations" is the companies' claim.
Rewrite (narrative): "Added to pembrolizumab, mRNA vaccines built from each patient's own tumor mutations (neoantigens) reduced melanoma recurrence in a 157-patient trial, a statistically borderline result (hazard ratio 0.56).[^18] In August 2026 Merck and Moderna reported that a 1,137-patient phase 3 trial of the same combination had met its main goal of longer recurrence-free survival; detailed results had not yet been released.[^19]" Card "why": "The companies called it the first positive phase 3 result for a vaccine built from each patient's own tumor mutations..."

**5. Köhler and Milstein's Nobel (timeline `hybridoma-1975`)**
Quote: "The pair shared the 1984 Nobel Prize."
Problem: The 1984 prize was shared three ways, with Niels Jerne.
Rewrite: "They shared the 1984 Nobel Prize with Niels Jerne."

**6. The Nobel quote is misapplied (portrait deep-dive)**
Quote: "Both discoveries came from what the Nobel committee called basic, curiosity-driven research 'not primarily oriented towards cancer.'"
Problem: In [2] the phrase describes the PD-1 discovery ("The second discovery... also originated in basic, curiosity-driven research, not primarily oriented towards cancer"). Allison's blockade experiment was explicitly aimed at cancer. [2] says he "intended to find a cure for cancer."
Rewrite: "Both brakes were first found in basic research on how T cells work. Of PD-1, the Nobel committee wrote that it came from 'curiosity-driven research, not primarily oriented towards cancer.' Allison's leap was to aim that knowledge at tumors."

**7. CAR-T credit and timing (narrative "Cell therapy turned the same year"; portrait on Sadelain and June; "Others essential" list)**
Problems:
- The first CD19 CAR-T remissions came before 2012: Kochenderfer, Rosenberg and colleagues at NCI in lymphoma (*Blood* 2010, PMID 20668228), and Porter, June and colleagues at Penn in CLL (*NEJM* 2011, PMID 21830940).
- "one engineering the receptor and choosing its target, the other learning to manufacture T cells at scale" oversimplifies. The CTL019/Kymriah receptor uses the 4-1BB costimulatory design from Dario Campana's lab (St. Jude).
- The "others" list omits the cell-therapy side.
Rewrite (narrative): "Cell therapy was turning too. In 2010–11, teams at the US National Cancer Institute and the University of Pennsylvania reported that CD19-targeted CAR-T cells could clear lymphoma and leukemia in adults. In April 2012..." Portrait: "Michel Sadelain, Carl June, Dario Campana and Steven Rosenberg's NCI team (with James Kochenderfer) led several of the groups that turned it into a living drug, by adding costimulatory signals, choosing CD19 as the target and learning to manufacture cells at scale." Add Campana, Kochenderfer, Renier Brentjens and Malcolm Brenner to the "others" list.

**8. Gemtuzumab withdrawal leaves out the safety signal (timeline `gemtuzumab-2000`; clinic box)**
Problem: FDA states that the confirmatory SWOG S0106 trial "did not confirm the clinical benefit, and fatal induction toxicity was significantly higher" (5.8% vs 1.3%) ([FDA ODAC briefing](https://www.fda.gov/media/106500/download); [FDA 2017 approval](https://www.fda.gov/drugs/informationondrugs/approveddrugs/ucm574518.htm)).
Rewrite: "...withdrawn in 2010 when a follow-up trial failed to confirm benefit and showed more early deaths..."

**9. The cytokine lane has no milestone after 1992, but the spec and alt text say every lane fills after 2010**
Quotes: spec, "every lane lighting up after 2010"; alt, "After 2010 every lane fills rapidly with approvals: checkpoint inhibitors from 2011, CAR-T cells in 2017, bispecific antibodies, antibody–drug conjugates, TIL and TCR-T therapies in 2024".
Problems: (a) The cytokine lane ends in 1992. (b) The alt sentence reads as if bispecifics and ADCs first arrived in 2024, but the timeline has gemtuzumab in 2000 and blinatumomab in 2014.
Fix, choose one:
- add `anktiva-2024`: nogapendekin alfa inbakicept (Anktiva), an IL-15 "superagonist", approved with BCG on 22 Apr 2024 for BCG-unresponsive non-muscle-invasive bladder cancer (FDA BLA 761336), lane `cytokines`, chapter `12-frontier`;
- or add a setback card for the failure of engineered IL-2 (bempegaldesleukin, 2022; Chapter 12 already covers it; verify the date from ch12's source [16]).

Then change the alt text to: "...After 2010 most lanes fill rapidly: checkpoint inhibitors from 2011, the first US-approved T-cell engager in 2014, CAR-T cells in 2017, newer antibody–drug conjugates and T-cell engagers for solid tumors, TIL and TCR-T therapies in 2024..."

**10. Source [15] cites the wrong title for the CHOP article**
The actual title is "Emily Whitehead, First Pediatric Patient to Receive CAR T-Cell Therapy, Celebrates Cure 10 Years Later" ([CHOP](https://www.chop.edu/news/emily-whitehead-first-pediatric-patient-receive-car-t-cell-therapy-celebrates-cure-10-years)). The draft quotes a different title.

---

## Optional
- **Coley's danger:** McCarthy [1] notes that two of his early patients died of the infection. One clause would sharpen "The trouble lay in the word 'some'".
- **IL-2, "first reproducible proof... purely immune-based":** this is Rosenberg's framing [6]. Interferon-α (1986) and BCG (1990) were approved earlier. Consider "Rosenberg called it the first convincing proof..."
- **"36 years"** (TIL card and narrative): 22 Dec 1988 to 16 Feb 2024 is a little over 35 years. Use "35 years" or "more than three decades".
- **Afami-cel date:** the FDA approval letter is dated 1 Aug 2024 and the FDA announcement 2 Aug 2024 ([FDA Tecelra page](https://www.fda.gov/vaccines-blood-biologics/cellular-gene-therapy-products/tecelra)). Either is defensible. Keep it consistent with ch10 (2 Aug).
- **PD-1 firsts:** nivolumab was approved in Japan in July 2014, before pembrolizumab's US approval ([2]: "The first marketing and manufacturing approval was granted 2014 in Japan"). The card's "first... in the US" is correct. The narrative "the first PD-1 blockers" could add "in the US".
- **pd1trial-2012** cites only [2]. Add Topalian et al., *NEJM* 2012;366:2443 (PMID 22658127). Its actual rates were 18% in lung cancer, 28% in melanoma and 27% in kidney cancer.
- **HBV vaccine:** the hepatitis B vaccine (US 1981) prevents liver cancer and predates HPV. It could be a card, or a clause on the HPV card.
- **Lesson 1** ("Every strategy pressed the accelerator... Pushing harder mostly produced side effects"): CAR-T and T-cell engagers are accelerator successes. Consider "Pushing harder with blunt tools mostly produced side effects."
- **MSI-H approval scope:** add "that had progressed after earlier treatment" (narrative). Chapter 8 already says this.
- **Glossary, immunosurveillance:** "now well supported" holds for mice. Human evidence is more indirect. Suggest "now well supported in mice, and indirectly in people".
- **Spec details:** the example gap label "33 years" matches no gap in the data (the largest is 48 years, 1909→1957). The "Today" line sits at the last milestone (Aug 2026), not at today (Oct 2026). Consider labeling it "Now".
- **Fairness extras:** Morales built on Lloyd Old's 1959 BCG–mouse tumor work. The 1989 gene-marking trial was led jointly with W. French Anderson and R. Michael Blaese. Allison credits Alan Korman and Nils Lonberg at Medarex.
- **Coley card chapter link** (`02-innate`): no chapter mentions Coley, but Ch 2 explains LPS and pattern-recognition receptors, so the link works.

---

## Verified as correct (compact)
- **Coley story** (McCarthy [1]): Coley was 28 in 1890. Bessie Dashiell, 17, had a bone tumor of the hand (probably Ewing sarcoma), had a forearm amputation and died within ten weeks. Stein, a German immigrant, was found after weeks of searching the tenements of Lower Manhattan. Also confirmed: *Serratia*, "almost 1,000" patients, 13 preparations, poorly controlled follow-up, Ewing and radiation, Parke-Davis stopping in 1952, FDA in 1962, Helen Coley Nauts.
- **Immunosurveillance and nude mice:** Ehrlich 1909; Burnet 1957 and Thomas 1959; Stutman, *Science*, Feb 1974. The CBA/H high-activity aryl hydrocarbon hydroxylase explanation and the residual T cells and NK cells of nude mice are confirmed by Dunn/Old/Schreiber and Shankaran 2001. Shankaran 2001 also confirms the immunoediting transplant result.
- **Antibodies and BCG:** Köhler & Milstein, *Nature*, 7 Aug 1975. Morales 1976 (*J Urol* Aug 1976, 9 patients). TICE BCG licensed May 1990. Interferon-α for hairy cell leukemia, 1986.
- **IL-2 and TIL** (Rosenberg 2014 [6]): November 1984, a 33-year-old woman, disease-free 29 years later. IL-2 approved for kidney cancer 1992 and melanoma 1998, with ORR ~15–20% and CR ~5–10%. The LAK cell story ("only before vascularized"; 30 patients with no responses; randomized trial of 181 patients). TIL in NEJM Dec 1988 (11 of 20 responded). Gene marking in 1989 (published NEJM 1990, 5 patients).
- **Checkpoint discoveries** ([2] and Allison's biography): CTLA-4 cloned by Golstein in 1987; Walunas/Bluestone/Thompson 1994 and Krummel & Allison 1995. First blockade experiment at the end of 1994, with a blinded repeat over Christmas. Leach, Krummel & Allison, *Science*, 22 Mar 1996. "Over the next 5 years" of failing to interest pharma. Medarex MDX-010 in 1999. Allison's mother died when he was 11; he plays harmonica in The Checkpoints. PD-1: Ishida, *EMBO J*, Nov 1992; lupus-like disease and cardiomyopathy in knockout mice; Dong 2002 and Iwai 2002.
- **Trials:** tremelimumab phase 3 (655 patients; OS 12.6 vs 10.7 months; ORR 10.7% vs 9.8%; response duration 35.8 vs 13.7 months; stopped April 2008 for futility). Hodi 2010 (676 patients, 10.0 vs 6.4 months). Topalian 2012 (296 patients, "one in four to one in five"). Grupp 2013 (etanercept plus tocilizumab, second relapse). NADINA (423 patients, 12-month EFS 83.7% vs 57.2%). KEYNOTE-942 (157 patients, HR 0.561). Haslam 2025 (56.55% eligible and 20.13% responding in 2023).
- **US approvals** (month and year, plus day where given): rituximab 26 Nov 1997; trastuzumab with HercepTest 25 Sep 1998; gemtuzumab May 2000, withdrawn 2010, re-approved 1 Sep 2017; Gardasil 8 Jun 2006; sipuleucel-T 29 Apr 2010; ipilimumab 25 Mar 2011; T-DM1 22 Feb 2013; pembrolizumab 4 Sep 2014; blinatumomab 3 Dec 2014; nivolumab 22 Dec 2014; T-VEC 27 Oct 2015; MSI-H/dMMR 23 May 2017 (ORR 39.6%); tisagenlecleucel 30 Aug 2017 (83%); T-DXd 20 Dec 2019 and HER2-low 5 Aug 2022; tebentafusp 25 Jan 2022; tremelimumab with durvalumab 21 Oct 2022; lifileucel 16 Feb 2024 (31.5%); tarlatamab 16 May 2024 (40%); afami-cel Aug 2024 (43.2%, the first TCR gene therapy).
- **Recognition and people:** Science Breakthrough of the Year, 20 Dec 2013. Nobel announcement, 1 Oct 2018. Emily Whitehead treated in April 2012, cancer-free at 10 years. Jimmy Carter was 90 in August 2015, scans were clear in December 2015, and he died 29 Dec 2024.
- **INTerpath-001** (19 Aug 2026, 1,137 patients, met its RFS endpoint) is correctly dated and correctly marked as not approved.
- **Quiz:** all three keyed answers are correct and the distractor explanations are accurate. **Glossary:** accurate, apart from the optional nuance above. **Chapter links:** all valid IDs, and each links to a chapter that covers the topic. **Milestone count:** 35, matching the spec, alt text and pace-strip footnote.
