# Science review — Chapter 12, "The Frontier"

Reviewer: scientific review (oncology / tumor immunology). Draft reviewed: `content/drafts/12-frontier.md` (684 lines, 45 sources). Knowledge as of 5 October 2026.
Verification: PubMed (all 45 sources plus about 10 others), company and regulator press releases, conference news, and the WHO financial-impact report PDF. **Note:** the Amass account hit its subscription usage limit partway through the review (it resets 3 Nov 2026). Regulatory status was therefore checked against sponsor and FDA-reported news rather than Amass RegulatoryCore. Line numbers below refer to the draft.

## Overall assessment

This is a strong, careful closing chapter. Almost every number I checked is right, often to the decimal: Zaretsky, Sade-Feldman, Anagnostou, Shin, Chowell, Formenti, MASTERKEY-265, the STING trial, ECHO-301, PIVOT IO 001, OpACIN, NADINA, S1801, CheckMate 816, Cercek 2022 and 2025, the microbiome and FMT trials, TACITO, IMvigor011, TESLA, SKYSCRAPER-06, ENHANCE, ENHANCE-3, HARMONi-2, Patil, and the WHO price and patent data. Press-release-only results are labeled as such, and the patient section is responsible. The problems fall into three groups:

1. One date is wrong: ivonescimab's first approval in China was in **May 2024**, not 2025.
2. A few absolutes become false and contradict other chapters:
   - "Releasing the brake repairs only the last link" conflicts with Chapter 8's clonal-replacement story and with this chapter's own explanation of neoadjuvant therapy.
   - "T cells cannot see" B2M-null tumors is false for γδ and CD4 T cells, and false in exactly the dMMR cancers the chapter showcases.
3. The combinations game contains a logic error. "MHC-free killers" fail to bypass steps 1–2, which produces a false on-screen message and is inconsistent with Chapter 7's wheel data.

There are also several worthwhile updates and balance fixes:
- The FDA approved ctDNA-guided atezolizumab on 15 May 2026.
- Ivonescimab's results outside China are weaker than the draft suggests (US decision due 14 Nov 2026).
- The TACITO result is framed with its secondary endpoint first.
- The low-dose nivolumab result needs a caveat.
- The ctDNA lead time is unrealistic.
- The sources can be cut from 45 to about 30 without losing any traceable number.

---

## Must fix

### M1. Ivonescimab's first approval was in China in May 2024, not 2025 (the supervisor's extra item: confirmed)
- **Where:** line 509: "It was approved in China in 2025; international trials are still running.[^40]"
- **What's wrong:**
  - The NMPA first approved ivonescimab on **24 May 2024**, with chemotherapy, for EGFR-mutant non-squamous NSCLC that had progressed after an EGFR tyrosine-kinase inhibitor. That approval was based on HARMONi-A.
  - The **April 2025** approval was a *second* indication: first-line monotherapy for PD-L1-positive (TPS ≥1%) NSCLC, based on HARMONi-2. This is the trial the chapter describes.
  - A third indication followed on **12 Aug 2026**: first-line squamous NSCLC with chemotherapy, based on HARMONi-6.
  - The cited source [^40] (an ecancer WCLC news item) does not support any approval date.
- **Evidence:**
  - Dhillon S. *Ivonescimab: First Approval.* Drugs 2024;84:1135–1142, doi:10.1007/s40265-024-02073-w, PMID 39073550 ("In May 2024, ivonescimab … received its first approval in China…").
  - OncLive, 25 Apr 2025 (approval for first-line PD-L1+ NSCLC): https://www.onclive.com/view/ivonescimab-wins-nmpa-approval-in-china-for-first-line-pd-l1-advanced-nsclc
  - Summit press release, 12 Aug 2026 (HARMONi-6; "third NMPA-approved indication … since … initial approval in May 2024"): https://smmttx.com/news/press-releases/news-details/2026/Ivonescimab-in-Combination-with-Chemotherapy-Approved-in-China-by-NMPA-for-First-Line-Treatment-of-Patients-with-Squamous-Non-Small-Cell-Lung-Cancer/default.aspx
- **Suggested rewrite:** "…extending survival. China first approved it in 2024, for a different group of lung cancers, and in 2025 for the use tested in this trial. Elsewhere it is still under study; see the scoreboard below.[^39][new: Dhillon 2024]"
- **Also check other chapters.** Chapter 8 (line 383) and the interlude should not say 2025 either.

### M2. "Releasing the brake repairs only the last link" contradicts Chapter 8 and this chapter's own neoadjuvant logic
- **Where:**
  - line 21: "They release a brake on T cells that are already in the tumor and already recognize it."
  - line 153 (key idea): "releasing the brake repairs only the last link."
  - line 43 (figure goal): "releasing the PD-1 brake repairs only one of them."
  - line 584 (takeaway): "Releasing the brake fixes only one of these."
- **What's wrong:**
  - Chapter 8 (lines 139 and 232–236) teaches that PD-1 blockade acts largely by unleashing stem-like reserve T cells in the tumor, the lymph nodes and the blood. It also teaches that many of the clones that expand afterwards are newcomers to the tumor (Yost 2019 clonal replacement). Chapter 8 says outright that Chapter 12 "builds on" this.
  - This chapter's own neoadjuvant section depends on the same idea. S1801 gave pembrolizumab *alone* before surgery and explains the benefit as "a broad army of T-cell clones is primed and multiplies" (line 295).
  - The "only the last link" framing is therefore internally inconsistent. As a "key idea" it is also more absolute than the evidence allows.
- **Evidence:**
  - Yost KE et al. *Nat Med* 2019;25:1251–1259, doi:10.1038/s41591-019-0522-3 (already Chapter 8's [^6]).
  - Patel SP et al. *NEJM* 2023;388:813–823 (S1801; neoadjuvant pembrolizumab monotherapy).
- **Suggested rewrites:**
  - **Line 21:** "They mainly release a brake on T cells that have already been primed and can recognize the tumor, whether those cells are already inside it or, as Chapter 8 showed, fresh recruits arriving from lymph nodes and blood. If an earlier link is broken…"
  - **Key idea:** "…It is a broken link somewhere in a seven-step loop, and releasing the PD-1 brake mainly repairs the last one."
  - **Figure goal and takeaway:** change "repairs only one of them" to "mainly repairs one of them" and "fixes only one" to "mainly fixes one."
  - The chip-1 badge and the game can stay as they are (s7 only). That is a fair teaching simplification once the prose says "mainly."

### M3. "T cells cannot see" B2M- or MHC-I-null tumors is false as stated, and false in the chapter's own showcase setting
- **Where:**
  - line 143 (resistance step 4 caption): "T cells cannot see the cell at all."
  - line 131 (guardrail): "T cells cannot kill MHC-I-negative cells, NK cells can."
  - line 90 (badge 4): "✕ No effect — T cells can't see the cell."
  - lines 562–565 (quiz Q1, correct-answer explanation): "so T cells cannot recognize them however many brakes are released."
- **What's wrong:**
  - Only *CD8 killer* T cells need MHC class I. CD4 T cells (through MHC-II), γδ T cells and NK cells can still act.
  - Clinically, B2M inactivation does **not** make mismatch-repair-deficient cancers resistant. In de Vries et al., 20 of 21 (95%) MMR-deficient cancers with B2M inactivation still responded to checkpoint blockade, with γδ T cells implicated.
  - B2M mutations occur in about 24% of MSI-H colorectal cancers, and 11 of 13 such patients benefited from PD-1/PD-L1 blockade (Middha et al.).
  - The chapter's hero story, dMMR rectal cancer, is exactly this setting. As written, a reader could conclude that B2M loss means immunotherapy cannot work.
  - The melanoma data (Sade-Feldman) are real, so the quiz's "unlikely to help" can stay. Only the absolute wording needs to change.
- **Evidence:**
  - de Vries NL et al. *Nature* 2023;613:743–750, doi:10.1038/s41586-022-05593-1, PMID 36631610.
  - Middha S et al. *JCO Precis Oncol* 2019;3, doi:10.1200/PO.18.00321, PMID 31008436.
- **Suggested rewrites:**
  - **Step 4 caption:** "…the shop window is boarded up. Killer T cells cannot see the cell at all. Other defenders sometimes still can, such as NK cells, which hunt for missing MHC, and some unconventional T cells."
  - **Guardrail:** "CD8 T cells cannot recognize MHC-I-negative cells; NK cells (and γδ T cells) can."
  - **Badge 4:** "≈ Usually little effect — killer T cells can't see the cell."
  - **Quiz explanation:** "Without B2M, the cells cannot put MHC class I on their surface, so killer T cells cannot recognize them however many brakes are released."
  - **Resistance deep-dive (after the B2M sentence), one line:** "Context matters: in mismatch-repair-deficient cancers, most tumors that lose B2M still respond, apparently because other immune cells, such as γδ T cells, take over.[new: de Vries 2023]"

### M4. Combinations game: "MHC-free killers" must also bypass steps 1–2, or the game displays a false message
- **Where:** lines 229–230: "8 MHC-free killers … set s3 = max(s3,0.8) and s6 = max(s6,0.6)." This combines with the outcome message at line 267.
- **What's wrong:**
  - CAR-T cells, T-cell engagers and NK engagers need neither tumor antigen release (step 1) nor presentation by dendritic cells (step 2). They only need a surface target.
  - Chapter 7's wheel data already encodes them as "skips 1, 2, 3; replaces 6; entersAt 4" (07-escape.md, around line 421).
  - I simulated the specified model. For profile C ("Cold desert") plus MHC-free killers, with or without anti-PD-1, the minimum stays 0.15 at step 2. The game then tells the reader: "The cycle still breaks at step 2: Presentation. Nothing you've added repairs it." That statement is scientifically wrong; for comparison, the DLL3 T-cell engager tarlatamab works in small-cell lung cancer, a classic cold tumor.
- **Fix:** "set s1 = max(s1,0.8), s2 = max(s2,0.8), s3 = max(s3,0.8) and s6 = max(s6,0.6); s4/s5/s7 unchanged."
  - I re-ran every sanity check listed in the spec with this rule. All results are unchanged:
    - A+PD-1 → strong
    - A+PD-1+CTLA-4 → strong, substantial side effects
    - B+PD-1 → growing
    - B+PD-1+gate openers → partial
    - B+MHC-free → growing
    - C+PD-1 → growing
    - C+PD-1+vaccine → partial
    - C+PD-1+alarm+vaccine → partial
    - D without MHC-free → growing
    - D+MHC-free+PD-1 → partial (0.60)
  - Only C+MHC-free changes, to "partial" (0.40, limited at step 7). That outcome is defensible.
  - Add "C+MHC-free killers → partial (weakest: killing)" to the sanity list.
  - Floating-point note: D+MHC-free+PD-1 lands exactly on 0.60, the partial/strong boundary. Tell the builder to round to 2 decimals before comparing.

---

## Should fix

### S1. Ivonescimab: balance the China-only data with the global results (hype check)
- **Where:** line 509 ("…extending survival…") and line 523 (deep-dive). The deep-dive's "promising, with questions" is right, but its open questions miss the data that already exist.
- **What's missing:**
  - In the global HARMONi trial (EGFR-mutant NSCLC after a TKI, including Western patients), the overall-survival gain was **not statistically significant** (HR 0.79; median 16.8 vs 14.0 months; Summit, 2025).
  - In 2026 an interim PFS analysis of the global HARMONi-3 trial (squamous cohort) **did not cross its significance threshold**; the final analysis is expected in the second half of 2026 (news report, 1 May 2026).
  - The FDA accepted a BLA based on HARMONi, with a **PDUFA date of 14 Nov 2026**.
  - The HARMONi-2 OS result at WCLC 2026 was a *prespecified interim* analysis (HR 0.73; 95% CI 0.57–0.95).
- **Evidence:**
  - Summit press releases: https://smmttx.com/news/press-releases/news-details/2026/Ivonescimab-in-Combination-with-Chemotherapy-Approved-in-China-by-NMPA-for-First-Line-Treatment-of-Patients-with-Squamous-Non-Small-Cell-Lung-Cancer/default.aspx (BLA submitted Jan 2026; PDUFA 14 Nov 2026)
  - BioSpace (BLA acceptance): https://www.biospace.com/press-releases/summit-therapeutics-announces-u-s-fda-acceptance-of-biologics-license-application-bla-seeking-approval-for-ivonescimab-in-combination-with-chemotherapy-in-treatment-of-patients-with-egfrm-nsclc-post-tki-therapy
  - HARMONi-3 interim result: https://allsci.com/news/clinical-trials/summits-ivonescimab-heads-toward-november-fda-decision-as-harmoni-3-interim-pfs-misses-threshold/
  - HARMONi-2 OS: ecancer 15 Sep 2026 (already [^40])
- **Suggested addition to the deep-dive:** "Outside China the picture is less clear. In a global trial in EGFR-mutant lung cancer, adding ivonescimab to chemotherapy delayed growth, but the survival difference could still have been chance; an early look at a second global trial, in 2026, did not show a clear benefit. US regulators are due to decide on the EGFR-mutant indication in November 2026."
- **Bullet (line 509):** add "in an interim analysis" after "extending survival".

### S2. TACITO: lead with the missed primary endpoint
- **Where:** line 406: "the transplant group went a median of 24 months before their cancer progressed, against 9 months with a sham transplant — although the trial narrowly missed its main goal."
- **What's wrong:**
  - The numbers are correct (45 patients; median PFS 24.0 vs 9.0 months, HR 0.50, p=0.035; primary 12-month PFS 70% vs 41%, p=0.053).
  - Leading with a secondary endpoint and adding the miss as an afterthought is a classic hype pattern.
  - The trial is a phase 2a. It was first presented at ESMO 2024 and published in 2026.
  - "First placebo-controlled" is the investigators' own description. That is acceptable, but attribute it.
- **Evidence:** Porcari S et al. *Nat Med* 2026;32:1316–1324, doi:10.1038/s41591-025-04189-2, PMID 41606119.
- **Suggested rewrite:** "The first placebo-controlled trial, by its investigators' account, enrolled 45 people starting standard immunotherapy-based treatment for kidney cancer and was published in 2026. It narrowly missed its main goal: after a year, 70% of the transplant group versus 41% of the sham group were free of progression, a difference that could still be chance. On a secondary measure, the transplant group went a median of 24 months before their cancer progressed, against 9 months."

### S3. Low-dose nivolumab: say what the trial did not test (patient-safety nuance)
- **Where:** line 532: "a flat 20-milligram dose of nivolumab … added to inexpensive oral drugs. One-year survival rose from 16% to 43%."
- **What's wrong:**
  - The comparator was triple metronomic chemotherapy *without* immunotherapy, not full-dose nivolumab.
  - Lay readers, including patients who cannot afford standard doses, could infer that a twelfth of the dose works as well. The trial did not test that.
- **Evidence:** Patil VM et al. *JCO* 2023;41:222–232, PMID 36265101.
- **Suggested addition:** "The trial compared low-dose nivolumab with no immunotherapy, not with the standard dose, so it shows that a small dose is far better than none, not that it matches a full one."

### S4. ctDNA figure: realistic lead time, assay-specific detection limit, and serial testing
- **Where:**
  - line 464: "Shade the interval m1–m18 … 'Lead time: the blood knows first'"
  - lines 462–466: the hidden-leftover curve starts at 1.0, already above the blood-test line, immediately after surgery
  - line 451: "Below what any test can see"
  - line 487 (caption 3): "long before"
- **What's wrong:**
  1. **The lead time is unrealistic.** The illustrated lead time is about 17 months. In bladder cancer, the setting of the figure's own callout card, ctDNA preceded imaging by a **median of 96 days**. In colorectal cancer the mean was 8.7 months (range 0.8–16.5).
     - Christensen E et al. *JCO* 2019;37:1547–1557, PMID 31059311.
     - Reinert T et al. *JAMA Oncol* 2019;5:1124–1131, PMID 31070691.
  2. **The detection floor is assay-specific.** It depends on the assay and on how many genome copies a tube of blood contains. "Any test" overstates it.
  3. **Positivity often appears later.** After surgery, residual disease often sits *below* detection at first and turns positive during surveillance. That is why IMvigor011 tested repeatedly for a year.
  4. **Shedding varies.** Some tumors shed little DNA. In Reinert's study, even before surgery only 88.5% of tumors were detectable.
- **Fixes:**
  - **Hidden leftover:** start at −0.5 after surgery, cross the blood-test line about m3, and cross the scan line about m10–12. Label the lead time "months".
  - **Toggle:** start treatment where the blood test turns positive, and stop the curve at about 0 to −0.5 rather than drawing an obvious cure.
  - **Relapse after response:** blood rises about m12 and the scan crosses about m17.
  - Rename the hatched zone "Too little for this test to detect".
  - **Caption 3:** "…the blood test can reveal it months before the tumor grows large enough to show up on a scan."
  - **Caption 5:** change "Patients with tumor DNA in their blood lived longer with immunotherapy" to "…lived longer, on average, with immunotherapy".
  - Add a one-line caption or footnote: "Some tumors shed little DNA, so a negative test can miss them."
  - Keep everything else. The illustrative labeling and the "never perfect" guardrail are good.

### S5. Add the May 2026 FDA approval of ctDNA-guided atezolizumab (this also makes the takeaway accurate)
- **Where:** line 426, the IMvigor011 paragraph, and takeaway line 588 ("Blood tests for tumor DNA can now help decide who needs immunotherapy").
- **Evidence:** On **15 May 2026** the FDA approved atezolizumab (IV and subcutaneous) as adjuvant therapy for MIBC after cystectomy in adults with ctDNA molecular residual disease, with Signatera CDx (Natera) as companion diagnostic. https://ascopost.com/news/may-2026/fda-approves-atezolizumab-for-adjuvant-treatment-of-mrd-positive-mibc/
- **Suggested addition (after "…spared most of those who did not."):** "In May 2026 the US FDA approved this approach, the first time a blood test for leftover tumor DNA became the gatekeeper for an immunotherapy."
- **Takeaway:** "In bladder cancer, a blood test for tumor DNA now decides who receives immunotherapy after surgery; AI and neoantigen prediction are promising but still immature."
- **Context (optional):** in unselected patients, adjuvant atezolizumab had *failed* (IMvigor010). This makes the selection story even more striking. Verify the citation before adding it.

### S6. Dostarlimab in rectal cancer: name the trial, its design, the possible earlier decision, and current guideline use
- **Where:** line 305: "According to its sponsor, a larger international trial of 154 rectal-cancer patients has also met its main goal; US regulators are due to decide … around February 2027. As of the company's August 2026 statement, dostarlimab was not approved for rectal cancer anywhere.[^25]"
- **What is accurate (checked against GSK's 24 Aug 2026 release):**
  - The trial is AZUR-1: a single-arm, registrational phase 2 in 154 patients.
  - Its primary endpoint, sustained clinical complete response at 12 months, was met.
  - Priority review was granted with a PDUFA date in February 2027.
  - The release states "not currently approved anywhere in the world for locally advanced rectal cancer."
  - I found no approval up to early October 2026.
- **What is missing:**
  - The application qualifies for the FDA National Priority Voucher programme, so a decision could come earlier.
  - NCCN guidelines already list PD-1 blockade as a treatment option for dMMR/MSI-H locally advanced rectal cancer. A patient reading "not approved anywhere" might wrongly assume the treatment is unavailable.
- **Evidence:**
  - GSK release: https://www.gsk.com/en-gb/media/press-releases/jemperli-dostarlimab-accepted-for-priority-review-by-the-us-fda/
  - PCORI horizon scan: https://horizonscandb.pcori.org/report/topics/825
  - NCCN Guidelines, Rectal Cancer (cite the current version)
- **Suggested rewrite:** "According to its sponsor, a larger international trial, AZUR-1, has also met its main goal; it enrolled 154 rectal-cancer patients and had no comparison group. US regulators are due to decide on approval by February 2027, possibly sooner under a fast-track voucher. Even before approval, US treatment guidelines already list PD-1 blockade as an option for these patients."

### S7. "Neoadjuvant immunotherapy is now widely regarded as a standard option for operable stage III melanoma": true, but it needs a source and the regulatory caveat
- **Where:** line 299 (no citation; the writer flagged it as resting on news).
- **Evidence:**
  - NCCN Melanoma guidelines list neoadjuvant pembrolizumab and neoadjuvant ipilimumab plus nivolumab as *preferred* options; ipilimumab plus nivolumab is category 1 after NADINA. OncLive summary: https://www.onclive.com/view/neoadjuvant-therapy-nccn-recommendations-take-the-melanoma-field-in-a-new-direction
  - As of 2025, neither regimen had FDA or EMA approval for neoadjuvant use; the Netherlands approved it nationally.
  - The NADINA two-year update (ESMO 2025) reported 24-month EFS of 77.3% vs 55.7%.
- **Suggested rewrite:** "Major US guidelines now list neoadjuvant immunotherapy as a preferred option for operable stage III melanoma,[new: NCCN] even though regulators in the US and Europe have not formally approved it for this use."

### S8. STING does not detect DNA itself (main text line 176 and glossary line 615)
- **What's wrong:** cGAS detects misplaced DNA in the cytosol and makes a messenger molecule, cGAMP, which activates STING. STING agonist drugs are mimics of that messenger.
- **Suggested rewrite (text):** "STING is the relay in a cellular alarm that detects DNA in the wrong place, a sign of viral infection or damage, and triggers interferon."
- **Suggested rewrite (glossary):** "'Stimulator of interferon genes': a relay inside cells that is switched on when a partner sensor, cGAS, detects DNA in the wrong place (a sign of infection or damage), triggering an interferon alarm."

### S9. Combinations game: the strict "weakest link" contradicts the chapter's own caveat
- **Where:**
  - line 232: "Tumor control = the MINIMUM strength…"
  - line 21, the main text: "links are rarely all-or-nothing, and a weak one can sometimes be offset by strengthening another."
- **Assessment:**
  - The min-rule is a defensible teaching abstraction, essentially Chen and Mellman's "rate-limiting step."
  - But the game never lets a strong step offset a weak one, and the meter is labeled as if it predicts clinical response.
  - Only profile A can ever reach "strong"; I simulated all 129 one-to-three-drug combinations per profile. The on-screen prompt ("Can you get a strong response…?") therefore sets an impossible goal for B, C and D without saying so.
- **Fixes:**
  - **Footnote:** "A teaching model with made-up strengths, in which the weakest step sets the pace. Real tumors are messier: steps are rarely all-or-nothing, a strong step can partly make up for a weak one, and different parts of one tumor can fail differently. Not a prediction for any patient."
  - Rename the meter "Cycle strength" or "Tumor control (model)".
  - After about three tries on B, C or D, add to the outcome text: "For some tumors, no combination in this model reaches a strong response — as in real patients."
  - **Optional:** vaccines are encoded as "+0.3 to s1" (more antigen release), but Chapter 7 maps vaccines to steps 2–3. Describe the s1 effect as a bypass ("supplies antigen directly, so release from the tumor matters less") or move it to s2/s3. If moved, recheck C+PD-1+vaccine; with s1 left at 0.2 it becomes "growing".

### S10. Radiation real-world card: add the major approved radiation plus checkpoint success
- **Where:** line 253: "Results are mixed; dose and timing seem to matter. Responses far from the irradiated site remain uncommon."
- **What's missing:** the clearest success. Durvalumab (anti-PD-L1) given after chemoradiation for stage III lung cancer (PACIFIC) raised 5-year survival from 33.4% to 42.9% and is standard care. Other radiation combinations, for example in head and neck cancer, have failed.
- **Evidence:** Spigel DR et al. *JCO* 2022;40:1301–1311, doi:10.1200/JCO.21.01308, PMID 35108059.
- **Suggested card:** "Mixed. Anti-PD-L1 after chemoradiation is now standard for some stage III lung cancers, but other radiation pairings have failed, and responses far from the irradiated site remain uncommon."

### S11. Immune side-effect warning list: add the dangerous rare ones (patient safety)
- **Where:** line 547: "New diarrhea, cough or breathlessness, rash, severe fatigue, headaches or vision changes deserve a prompt call."
- **What's missing:** myocarditis and myositis are the most lethal immune-related adverse events, and diabetes, hepatitis and adrenal crisis can present acutely.
- **Suggested rewrite:** "New diarrhea, cough or breathlessness, rash, severe fatigue, headaches or vision changes, chest pain or a racing heartbeat, muscle weakness, yellowing skin or dark urine, or unusual thirst all deserve a prompt call."
- Also add one line pointing to the site's medical disclaimer (about.html).

### S12. Citation support gaps
- **[^40]** is cited for "approved in China in 2025". It does not support any approval. Replace with Dhillon 2024 (see M1).
- **[^36]** (SKYSCRAPER-06 only) is cited for "TIGIT … has failed in trial after trial" and "Most large TIGIT programs have since been halted." One trial cannot support "trial after trial." Point instead to Chapter 8, which covers SKYSCRAPER-01, Roche's 2025 discontinuation and Arcus/Gilead's December 2025 STAR-221 futility, or add a review.
- **Verification of the flagged claim:** "most TIGIT programs stopped" is **correct**:
  - Roche: tiragolumab ended July 2025.
  - Merck: vibostolimab ended.
  - GSK/iTeos: belrestotug dropped 2025.
  - BeiGene: ociperlimab terminated.
  - Arcus/Gilead: domvanalimab, STAR-221 futility, Dec 2025.
  - Exceptions worth one clause: SKYSCRAPER-08 (esophageal, Asia) was positive, and AstraZeneca's PD-1×TIGIT bispecific rilvegostomig remains in phase 3.
  - A 2026 review suitable as a citation: Smail SW et al. *Pharmaceutics* 2026;18:970, doi:10.3390/pharmaceutics18080970, PMID 42654087 (modest journal; Chapter 8's sources may be preferable).
- **[^18] (NADINA)** is used for the international consortium's pathologic-response categories (line 391). NADINA applies them, but the defining paper is Tetzlaff MT et al., *Ann Oncol* 2018. Acceptable as is; swap if you want the primary source.
- **[^14] (Upadhaya)** reports trial counts "as of December 2021", while line 182 says "by early 2022". Change to "by the end of 2021".

### S13. Takeaway and summary wording that is slightly stronger than the evidence
- **Line 586:** "in mismatch-repair-deficient rectal cancer it can replace surgery altogether." Change to "…it has, so far, let most patients in trials skip surgery altogether."
- **Line 586:** "has improved outcomes in melanoma and lung cancer". Add "and head and neck cancer", since KEYNOTE-689 is in the text.

---

## Optional

1. **Neoadjuvant figure (lines 348–350, 380):**
   - The adjuvant lane expands "triangle and circle" clones, but only micrometastasis A (triangle) supplies antigen. Drop the circle, or explain it.
   - Caption 2's "there is little left to teach T cells" should read "much less". Adjuvant anti-PD-1 still lowers relapse substantially.
2. **Line 159:** "so they leave PD-1 blockade nothing to release" should read "little to release". PD-L1 on immune cells still matters.
3. **Line 170:** "Most tumors that ignore checkpoint inhibitors are 'cold'" should read "Many". Some non-responders are inflamed but resistant, for example through JAK or B2M loss.
4. **Line 411:** "early FMT trials show that changing it can sometimes rescue a response" should read "suggest". The 2021 trials were single-arm.
5. **Line 13:** the 57%/20% figure is already in Chapter 8 (line 363); recap it ("Chapter 8's sobering estimate…").
   - The 20% is of *all* patients with advanced cancer, so about a third of those eligible. Consider "…only about 20% of all such patients (roughly a third of those eligible) were expected to respond."
   - "Careful estimate" should read "one widely cited estimate". It is a modeling estimate based on labels and mortality data.
6. **Line 532:** "Between countries, the gap is wider still" follows a US-to-Australia comparison. Use "Between rich and poorer countries…"
7. **Line 305:** "Two years in, 92% remained free of recurrence" applies to all 117 patients, with a median follow-up of 20 months. Better: "an estimated 92% were free of recurrence at two years."
8. **TIGIT deep-dive (line 517):**
   - Note that SKYSCRAPER-06 compared atezolizumab-based with pembrolizumab-based regimens, so it is not a pure test of TIGIT.
   - Mention the SKYSCRAPER-08 exception.
9. **Other perioperative approvals:** a single clause could note that perioperative immunotherapy has spread to bladder and stomach cancers (NIAGARA, MATTERHORN). Verify the approval dates before adding; I did not check them.
10. **Resistance figure, chip 9 halo "densest near steps 2–3":** HLA genotype also limits the tumor's own display (step 6). Consider a secondary density near step 6.
11. **ctDNA blood-panel tube:** add a tiny note, "in reality tumor fragments are far rarer than shown." Do not add numbers, in keeping with the guardrail.
12. **Opening (line 9):** "it worked for everyone" could read "everyone who finished treatment" (12 completers; more were enrolled).
13. **Clinical-trials paragraph (line 549):** "the experimental treatment is usually provided free" could add "though routine care may still be billed to insurance."

---

## Figure specs: summary verdict

- **ch12-resistance:**
  - The step mappings are correct and consistent with Chapter 7: brake → 7; low TMB → 1 and 6 weak; neoantigen loss → 1 and 6; B2M → 6; JAK1/2 → 6 and 7; exclusion → 5 (with 4 weak); no DCs → 2 and 3; suppressive myeloid cells and Tregs → 3 and 7.
  - The P/A tags match the evidence: B2M and JAK1/2 appear in both primary (Shin 2017; Sade-Feldman 2017) and acquired (Zaretsky 2016) resistance.
  - The only problem is the absolute "T cells can't see" wording (M3).
- **ch12-combinations:**
  - Mechanism-to-step mappings are reasonable and mostly match Chapter 7.
  - The MHC-free killers rule is wrong (M4).
  - The weakest-link rule needs an explicit caveat (S9).
  - The radiation card is incomplete (S10).
  - The real-world cards are otherwise accurate: T-VEC 692 patients; STING about 1 in 10; ECHO-301 706 patients; VEGF combinations approved in kidney, liver and endometrial cancer; INTerpath-001 company-reported.
- **ch12-neoadjuvant:** scientifically honest. It keeps the "illustrative" note, has a no-guarantee caption, and its S1801/NADINA numbers are correct with a "not directly comparable" note. See the minor items in Optional 1.
- **ch12-ctdna:** clearly labeled illustrative, with no numeric limits and a "never perfect" floor. The lead time and the "any test" wording need fixing (S4).

## Quiz and glossary
- **Quiz:**
  - Q2, Q3 and Q4 are correct. S1801 used 18 total doses in both arms and no chemotherapy. IMvigor011's conclusions are stated correctly.
  - Q1 needs only the "killer T cells" wording (M3).
- **Glossary:**
  - Accurate, except STING (S8).
  - Minor: "event-free survival" is defined as a share at a time point; strictly it is a time-to-event measure, but this is acceptable for lay readers.

---

## Citations: existence check and consolidation plan

**Existence:**
- All 45 sources exist. Authors, journals, years, volumes and pages match PubMed or the publisher for every journal article.
- Spot-checked PMIDs: 35660797, 39887747, 27433843, 28031159, 29070816, 29443960, 25970248, 29217585, 27903500, 37597750, 30397353, 35998300, 36282874, 35145263, 31221619, 37651676, 30297911, 38828984, 27663893, 36856617, 40454642, 39288781, 40532178, 40293177, 29097494, 29097493, 29302014, 33303685, 33542131, 41606119, 34941392, 31665575, 41124204, 33038342, 42060297, 42441929, 40233321, 40057343, 36265101, 37517865.
- The web sources were checked directly:
  - [^25] GSK, 24 Aug 2026
  - [^40] ecancer, 15 Sep 2026
  - [^41] ecancer, 20 Aug 2026
  - [^42] the WHO report (Schouten, Jan 2025). It gives pembrolizumab at $60.98/mg in the US vs $12.23/mg in Australia, and patent expiry in 2028 (US, China), Jan 2031 (Europe) and 2032 (Japan).
  - [^44] PAHO, 8 Sep 2025
- Minor: some print years differ from online years and do not need changing:
  - Chesney: online 2022, print 2023
  - Baruch: online 2020, print 2021
  - Shin and Anagnostou: online 2016, print 2017
  - Chowell: online 2017, print 2018

**Sentence support:** all [^n] support their sentences except [^40] and [^36] (S12) and the date in [^14] (S12).

**Consolidation to about 30.** Many trials are owned by Chapters 7, 8 and 11, and the global sources page will list them anyway.

| Action | Sources | Rationale |
|---|---|---|
| Cut; cross-reference Chapter 7 | [^7] Spranger | Chapter 7 cites it for the same point. |
| Cut | [^9] Shin 2017 | Fold "1 of 23 / 1 of 16" into a sentence without numbers, or keep it only if the deep-dive stays long. |
| Cut | [^10] bintrafusp | The point ("TGF-β drugs have disappointed") can stand with a cross-reference to Chapter 7. |
| Cut | [^19] Liu 2016 (mice) | OpACIN [^17] carries the human evidence; keep the mouse sentence uncited or merge it into the OpACIN sentence. |
| Cut | [^22] KEYNOTE-671, [^23] KEYNOTE-689 | Replace with "similar before-and-after approaches are approved for lung and head and neck cancers" and keep [^21]. |
| Cut | [^28] Matson | Routy plus Gopalakrishnan suffice for the "different microbes" point; or keep all three and cut elsewhere. |
| Cut; cross-reference Chapter 11 | [^35] Wells (TESLA) | Chapter 11 owns neoantigen prediction and cites it; Chapter 8 also cites it. |
| Cut; cross-reference Chapter 8 | [^36] SKYSCRAPER-06 | Chapter 8 owns TIGIT. |
| Cut | [^38] ENHANCE-3 | Keep ENHANCE [^37]; say "a second trial, in leukemia, was stopped early for futility." |
| Replace | [^40] ecancer | Use Dhillon 2024 (first approval) plus one Summit/Akeso release for the OS data. |
| Cut; cross-reference Chapter 11 | [^41] INTerpath ecancer | Chapter 11 already cites the primary Merck/Moderna release (19 Aug 2026). If kept, use that primary release, not the news rewrite. |
| Optional cut; cross-reference Chapter 8 | [^15] ECHO-301 | Shorten the epacadostat retelling; Chapter 8 tells it in full with the same source. Keep only if the 706/4.7/4.9 numbers stay. |
| Optional cut; cross-reference Chapter 11 | [^12] Chesney | Same logic as [^15]. |

The required cuts above remove 13 and the optional ones a further 2. Recommended additions: Dhillon 2024, de Vries 2023, an NCCN guideline citation, and FDA or ASCO Post for the May 2026 atezolizumab approval. Net result: about 30–34 sources.

---

## Claims verified as correct (compact)

- **Opening and overall response:**
  - Cercek 2022: 12 of 12 clinical complete responses, no chemoradiation or surgery.
  - Haslam 2025: 56.55% eligible and 20.13% responding in 2023.
  - Zaretsky 2016: about 75% of responses durable.
- **Resistance mechanisms:**
  - Zaretsky 2016: 2 of 4 with JAK1/2 loss, with loss of the wild-type allele; 1 of 4 with B2M loss.
  - Anagnostou 2017: 7–18 neoantigens lost; the lost peptides still expanded T cells.
  - Sade-Feldman 2017: B2M LOH in about 30% vs 10%, threefold; biallelic loss only in non-responders.
  - Mariathasan 2018: TGF-β signaling in fibroblasts and T-cell exclusion, plus the mouse combination result.
  - Spranger 2015: β-catenin and CD103+ DCs.
  - Chowell 2018: 1,535 patients; HLA-I homozygosity; HLA LOH.
  - Shin 2017: 1 of 23 melanomas and 1 of 16 MMR-deficient colon cancers.
  - Bintrafusp alfa: not better than pembrolizumab; grade 3–4 TRAEs 42.4% vs 13.2%.
- **Cold-to-hot and combinations:**
  - Formenti 2018: 18% responses.
  - MASTERKEY-265: 692 patients; no PFS or OS benefit.
  - MIW815 plus spartalizumab: 106 patients; ORR 10.4%.
  - Upadhaya: 5,683 trials, most in combination.
  - ECHO-301: 706 patients; PFS 4.7 vs 4.9 months.
  - PIVOT IO 001: 783 patients; ORR 27.7% vs 36.0%; grade 3–4 TRAEs 21.7% vs 11.5%.
- **Neoadjuvant therapy:**
  - OpACIN: 20 patients; 9/10 grade 3–4 adverse events in each arm; more tumor-resident clones expanded.
  - NADINA: 423 patients; EFS 83.7% vs 57.2%; MPR 59%; RFS 95.1%/76.1%/57.0% by response; grade ≥3 TRAEs 29.7% vs 14.7%.
  - Pathologic-response categories as defined by the international consortium.
  - S1801: 313 patients; 3+15 vs 18 doses; 2-year EFS 72% vs 49%.
  - Liu 2016 mouse data.
  - CheckMate 816: 5-year OS 65.4% vs 55.0%; with pCR 95.3% vs 55.7% without; ctDNA clearance 75.0% vs 52.6%.
  - KEYNOTE-671 OS benefit and KEYNOTE-689 EFS benefit.
  - Cercek 2025: 117 patients; 49/49 rectal completers with cCR, all choosing nonoperative management; 82/103 avoided surgery; 2-year RFS 92%; surgical option never compromised.
- **Microbiome:**
  - Routy, Gopalakrishnan and Matson, including the antibiotics and Akkermansia findings.
  - Baruch 2021: 3 of 10. Davar 2021: 6 of 15.
  - Spencer 2021: 128 patients; fiber association; probiotics impaired the response in mice.
  - DeFilipp 2019: ESBL E. coli transmission, one death.
- **ctDNA and AI:**
  - IMvigor011: 761 / 250 (167:83) / 357 patients; OS 32.8 vs 21.1 months; ctDNA-negative 88% disease-free at 2 years.
  - TESLA: 608 peptides, 37 recognized.
- **Next-generation scoreboard:**
  - SKYSCRAPER-06: OS 18.9 vs 23.1 months; trial terminated.
  - ENHANCE: 539 patients; CR 21.3% vs 23.6%; fatal adverse events 15.2% vs 9.8%.
  - ENHANCE-3: futility; more fatal adverse events (19.0% vs 11.4%).
  - Magrolimab priming dose.
  - HARMONi-2: 398 patients; PFS 11.1 vs 5.8 months.
  - HARMONi-2 OS at WCLC 2026 (15 Sep): 30.8 vs 22.6 months.
  - INTerpath-001 topline (Aug 2026) correctly labeled company-reported.
  - LAG-3 2022 approval as the first non-CTLA-4, non-PD-(L)1 checkpoint.
- **Cost and access:**
  - Pembrolizumab about $12,000 per 200 mg dose in the US vs about one-fifth per mg in Australia; more than $200,000 per year.
  - Patent expiry: 2028 (US, China), 2031 (Europe), 2032 (Japan).
  - Patil 2023: 1–3% access in low- and middle-income countries; 20 mg flat dose; 1-year OS 16.3% vs 43.4%.
  - WHO Essential Medicines List 2025: pembrolizumab for cervical, colorectal and lung cancer; atezolizumab and cemiplimab as alternatives for lung cancer.
- **Patient guidance:**
  - ISCT 2023 paper on "tokens of scientific legitimacy".
  - NCI Cancer Information Service number 1-800-4-CANCER.
- **Rectal-cancer regulatory status (as of the 24 Aug 2026 release):** GSK priority review, AZUR-1 with 154 patients, PDUFA Feb 2027, "not approved anywhere".
