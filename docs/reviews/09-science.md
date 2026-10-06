# Science review: Chapter 9, "Antibodies as Medicine" (`content/drafts/09-antibodies.md`)

Reviewer: scientific review (antibody engineering, ADCs, bispecific T-cell engagers, clinical oncology). Line numbers refer to the draft as of 2026-10-05. Status claims are checked as of October 2026.

## Overall assessment

This is an unusually accurate, well-built chapter. All 31 citations exist. Authors, journal, year, volume, pages and DOI match PubMed for every one (PMIDs listed at the end). Almost every number traces to its cited paper, including:
- the KRAS/cetuximab medians;
- R-CHOP complete responses;
- DESTINY-Breast03 and -04, including the ILD rates;
- ASCENT and EV-302;
- TOWER and E1910;
- MajesTEC-1 and MajesTEC-3;
- DeLLphi-304;
- the tebentafusp 1-year survival and rash rate;
- the INN history (1991 scheme, 879 "-mab" names, source infix dropped 2016–17, "-ta-", October 2021 stems, "-fusp" in 2017);
- the "19 first approvals in 2025" count.

The mechanisms are sound and the figure specs are careful: Fc-silenced engager stems, the T-DM1 vs T-DXd linker and payload chemistry, local-only bystander killing, HER2 shown with no ligand. The problems are few but real:
- **One false sentence that contradicts Chapter 8:** checkpoint inhibitors "never touch the tumor", yet anti-PD-L1 drugs bind tumor cells.
- **A wrong example drug in the humanization figure:** panitumumab is IgG2, so the figure's NK cell docking on its stem teaches something untrue. The name parsing of panitumumab and ibritumomab is also wrong.
- **A misquoted cardiotoxicity figure:** 27% was all cardiac dysfunction, not serious dysfunction.
- **Missing 2024–2026 regulatory updates:**
  - tarlatamab's accelerated approval in May 2024 (needed for the timeline);
  - the March 2026 FDA approval of teclistamab plus daratumumab, the direct consequence of MajesTEC-3.

The rest is calibration: one citation mismatch, reconciling engagers with Chapter 4's "two-factor authentication", the "grip never changes" idealization, and trimming the source list.

---

## Must fix

**M1. "They never touch the tumor" is false for anti-PD-L1 drugs and contradicts Chapter 8 (line 15)**
- Quote: "The checkpoint inhibitors of Chapter 8 are antibodies that stick to the brakes on T cells. They never touch the tumor."
- Problem: atezolizumab, durvalumab and avelumab bind PD-L1, which sits largely on tumor cells (and myeloid cells). Chapter 8 says so explicitly: line 40, "cover PD-L1 on the tumor and the cells around it", and the guardrail at line 106, "anti-PD-L1 binds only PD-L1 (on the cancer cell)". A reader who has just finished Chapter 8 will spot the contradiction.
- Suggested rewrite: "The checkpoint inhibitors of Chapter 8 are antibodies that stick to the brakes on T cells, or to the tumor's half of the brake. Either way, they do no damage themselves; they only free T cells to act. This chapter is about antibodies that attack the cancer itself: …"

**M2. Humanization figure and naming line: panitumumab is the wrong "fully human" example, and two names are mis-parsed (lines 41, 95–96, 102, 110–111)**
- Problem 1 (mechanism): panitumumab is a **human IgG2** (Lu 2020 [^3], PMID 31894001: "panitumumab (Vectibix, Amgen, human IgG2/kappa)"). IgG2 barely engages FcγRIIIa (CD16) on NK cells. Panitumumab triggers ADCC only through myeloid cells (Schneider-Merck et al., *J Immunol* 2010;184:512–520, PMID 19949082). The spec shows Meter 3 "Recruits human immune cells: Strong" and an **NK cell docking on the gold stem** in the fully human state. With panitumumab named on screen, that is a specific, false depiction. It also implies that "more human" means "better effector function", when the IgG subclass decides that. Chapter 8 already teaches that IgG4 and IgG2 stems are weak.
- Problem 2 (naming): the INN source infixes are **-o-** (mouse) and **-u-** (human), not "mo" or "mu". The tumor infix was **-tu(m)-** (Guimaraes Koch 2022 [^5], Table 1). So the correct parses are ibri·tum·**o**·mab and pani·tum·**u**·mab. Bolding "mu" in panitu**mu**mab (line 41) and "ibritu·mo·mab" / "panitu·mu·mab" (lines 95–96) teaches a wrong rule. Ritu·**xi**·mab and trastu·**zu**·mab are correct.
- Fix:
  - Swap the fully human example for a human **IgG1**. **Daratumumab** fits best: anti-CD38 human IgG1, and it appears later in the chapter (MajesTEC-3). Ofatumumab and necitumumab also work.
  - Name chip: "daratum·**u**·mab"; mouse chip: "ibritum·**o**·mab".
  - Line 41: "Ritu**xi**mab, trastu**zu**mab, daratum**u**mab."
  - Add a tooltip or footnote to Meter 3: "Assumes the usual IgG1 stem. Some antibodies are deliberately built on IgG2 or IgG4 stems that recruit immune cells weakly (see Chapter 8)."
  - Fix the glossary EGFR line too if panitumumab stays there (that line itself is fine).

**M3. Trastuzumab cardiotoxicity: "serious heart dysfunction struck 27%" (line 537)**
- Quote: "in the pivotal 2001 trial serious heart dysfunction struck 27% of women given trastuzumab together with an anthracycline".
- Problem: in Slamon 2001 [^8], 27% is the incidence of **any** cardiac dysfunction, symptomatic or asymptomatic, with AC + trastuzumab. NYHA class III–IV (serious) heart failure occurred in **16%**. The paper's abstract conflates the two ("class III or IV, which occurred in 27 percent"), but the body and every later analysis give 27% overall and 16% class III–IV (e.g., the review "Trastuzumab-mediated cardiotoxicity: current understanding, challenges, and frontiers", PMC6131716; Herceptin label). Concurrent paclitaxel plus trastuzumab gave 13% any dysfunction.
- Suggested rewrite: "in the pivotal 2001 trial, 27% of women given trastuzumab at the same time as an anthracycline … developed heart dysfunction, and 16% developed serious heart failure; giving the two together is now avoided."

---

## Should fix

**S1. Teclistamab plus daratumumab is FDA-approved; say so (lines 420, 435)**
- The MajesTEC-3 numbers are all correct (Costa et al. *NEJM* 2026;394:739–752, PMID 41363801): 36-month PFS 83.4% vs 29.7%; HR 0.17; deaths from adverse events 7.1% vs 5.9%. But the paragraph stops at the trial.
- On **March 5, 2026** the FDA approved teclistamab plus subcutaneous daratumumab for relapsed or refractory myeloma after **at least one prior line** (including a proteasome inhibitor and an immunomodulatory drug). The same action converted teclistamab monotherapy to traditional approval (FDA: https://www.fda.gov/drugs/resources-information-approved-drugs/fda-approves-teclistamab-combination-daratumumab-hyaluronidase-fihj-relapsed-or-refractory-multiple). Other earlier-line approvals:
  - blinatumomab for consolidation in Ph-negative B-ALL in remission (2024, from E1910);
  - epcoritamab with lenalidomide–rituximab for relapsed follicular lymphoma (current Epkinly label).
- Suggested additions:
  - After the MajesTEC-3 sentence: "In March 2026 the FDA approved the combination for patients whose myeloma had relapsed after as little as one earlier treatment. Overall survival was also longer with the combination."
  - Line 420: change "often in patients who have exhausted other options" to "first in patients who had exhausted other options, and increasingly earlier".
  - Optionally after the E1910 sentence (line 418): "That result led to its approval for this use in 2024."

**S2. Tarlatamab timeline and toxicity (line 422)**
- Quote: "It received full FDA approval in November 2025."
- Problem: correct (19 Nov 2025), but read alone it suggests November 2025 was the first approval. Tarlatamab received **accelerated approval in May 2024** on response rate, and the Interlude says so. The paragraph also gives only the favorable safety comparison (grade ≥3 adverse events 54% vs 80%, correct per Mountzios 2025 [^26]). It omits that CRS was the most common treatment-related event: about half of patients, mostly grade 1–2, with first doses given under monitoring.
- Suggested rewrite: "…compared with chemotherapy. Severe side effects were less common than with chemotherapy (54% vs 80% of patients), although about half of patients had cytokine release syndrome, mostly mild. First approved on an accelerated basis in May 2024, tarlatamab received full FDA approval in November 2025."

**S3. Engagers vs Chapter 4's "two-factor authentication" (lines 408, 414)**
- Quote: "Bridged to a cancer cell, the T cell forms a tight contact and fires its killing machinery, just as it would after a true match." / "Any passing T cell can become a killer".
- Problem: Chapter 4 teaches that signal 1 without signal 2 leads to anergy. A careful reader will ask how an engager, which supplies only a CD3 (signal-1-like) trigger, avoids this. The answer: CD3 engagers mainly redirect **already-experienced (memory/effector) T cells**, which can kill without CD28 costimulation. Blinatumomab-induced killing was shown to be costimulation-independent (Dreier et al., *Int J Cancer* 2002;100:690–697, PMID 12209608). Naive T cells respond poorly.
- Suggested addition after line 408: "Unlike a T cell meeting a target for the first time, the T cells engagers mostly recruit are veterans of past infections, which can kill without the second 'confirmation' signal of Chapter 4."
- Soften "Any passing T cell" to "Almost any passing experienced T cell".

**S4. CD20 "blind spot" is cited to a source that does not state it (line 184)**
- Weiner 2010 [^11] covers mechanisms (direct signaling, CDC, ADCC). It does not discuss CD20's absence from stem cells or plasma cells, or B-cell recovery. The claim is correct. The rituximab label states that CD20 is "not found on hematopoietic stem cells, pro-B cells, normal plasma cells or other normal tissue", and that B-cell recovery begins about 6 months after treatment, with median levels normal by about 12 months.
- Fix: cite the Rituxan prescribing information (FDA label, BLA 103705), and change "grow back within months" to "grow back, usually within 6 to 12 months".
- Weiner also stresses that rituximab can trigger death signals directly. Optional: add "and, to some degree, triggers death signals directly" to the list at lines 180–182.

**S5. Humanization: "the grip never changes" is an idealization stated as fact (lines 85, 99, 128–130)**
- Spec: "Meter 1 'Grips the target': always full … This constancy is the point."
- Problem: pure CDR grafting often **reduces affinity**. Engineers usually restore it by keeping a few mouse framework residues that support the loops ("back-mutations"). This was true from the start: Jones 1986 and Riechmann 1988 both needed it. Humanized antibodies therefore keep slightly more than the six loops.
- Fix: keep the full meter (the teaching point is sound), but add one honest caption line to state 3: "In practice, engineers often keep a handful of extra mouse building blocks next to the loops so the grip stays as tight as the original." Also add "(plus a few supporting mouse residues)" to the humanized bullet at line 38, or put it in the INN box.

**S6. ch09-bridge: the "antibody-based" target is labeled CD19 on a solid tissue cluster that also shows gp100 (lines 454–458, 467, 508)**
- Problem: one cell cluster that displays both CD19 (a B-cell and leukemia marker; blinatumomab treats a blood cancer with no solid tissue cluster) and a melanoma gp100 peptide is a biological chimera. A biologist reader will notice.
- Fix: label the knobs generically ("tumor surface protein") and make the selector "Antibody-based (e.g., blinatumomab: CD19; tarlatamab: DLL3)". Caption: "The engager grabs a protein on the cancer cell's surface and CD3 on any T cell it meets…" Alternatively use tarlatamab/DLL3, at least a solid tumor.
- Also add a footnote to the "None" state: "One matching cell in ~40 is shown so you can find it; in reality about one in 100,000 to a million matches."

**S7. ch09-adc explorer: make toxicity honest beyond the bystander effect (lines 362–365, 371–373)**
- Problem: "Healthy cells harmed" can rise only when a healthy cell sits next to a dying cancer cell. That implies ADC toxicity is a local spillover problem. The chapter's own text (line 298) and Drago 2021 [^15] say much toxicity is systemic: linker deconjugation in blood, target-independent uptake (macropinocytosis, Fc receptors) and on-target uptake by healthy tissue. The ILD seen with T-DXd and the neutropenia seen with sacituzumab are not bystander effects.
- Fix: add one line to the explorer caption: "Not shown: payload that leaks into the blood or is taken up by healthy organs, the main source of side effects such as lung inflammation." Optionally add a fourth healthy cell "far from the tumor" that is occasionally hit regardless of drug, with "(off-tumor uptake)" in its tooltip.

**S8. ADC stepper step 4 caption is T-DXd-only, but the compare toggle offers T-DM1 (line 384)**
- Quote: "Enzymes there cut the linker, the fuse, and set the payload free."
- Problem: T-DM1's linker is never cut; the antibody is digested. The spec draws this correctly (line 340), but the caption does not change with it.
- Fix: add a T-DM1 caption variant: "T-DM1's linker never breaks. Instead, enzymes digest the antibody itself, freeing the payload with a charged scrap of linker still attached."

**S9. ASCENT population (line 310)**
- Quote: "In metastatic triple-negative breast cancer … it extended median survival from 6.7 to 12.1 months".
- ASCENT [^19] enrolled **relapsed or refractory** disease after at least two prior chemotherapies (all taxane-pretreated). Without the qualifier, readers may assume first-line use.
- Suggested rewrite: "In metastatic triple-negative breast cancer that had already been treated with chemotherapy, …"

**S10. Sources: trim and re-target (31 sources, against a PLAN guide of 8–20)**
- All 31 sources are genuine and match. Fixes:
  - Replace [^11] for the CD20 sentence (S4).
  - Add FDA sources for S1 and S2, and Dreier 2002 if S3 is adopted.
- Low-cost trims that lose no key content:
  - [^4] Jones 1986: fold into [^3], which covers CDR grafting history.
  - [^21] DESTINY-Breast06: cite the FDA T-DXd label or [^18] for "HER2-ultralow" in the clinic box.
  - [^24] E1910: drop the sentence or keep only the 2024 approval note.
  - [^29] Glofitamab: keep only if the 39%/35% numbers stay.
  - [^13] Hurwitz: could go if the bevacizumab sentence drops its medians.
  - [^9] Romond: could go if "roughly halved the risk" is cited to Loibl [^6], which reviews the adjuvant trials.
- These cuts reach about 23–25 sources. Getting to 20 would mean cutting content (e.g., ASCENT numbers, the talquetamab detail).
- Editorial note: trial acronyms in parentheses have been inserted into published titles, e.g., "for breast cancer (DESTINY-Breast03)". The real titles do not contain them. Move the acronym outside the title (e.g., "… *N Engl J Med* 2022;386:1143–1154 [DESTINY-Breast03]").

---

## Optional

- **O1. Nobel 2018 (line 39):** Smith and Winter shared **half** of the Chemistry prize; Frances Arnold received the other half. Suggest "shared in the 2018 Nobel Prize in Chemistry".
- **O2. EV-302 "first treatment to beat platinum chemotherapy on survival" (line 310):** the authors frame it this way, but nivolumab plus gemcitabine–cisplatin (CheckMate 901, *NEJM* 2023) also improved survival over platinum chemotherapy, though by adding to platinum. More precise: "the first treatment without platinum to outlive platinum chemotherapy".
- **O3. Karapetis comparator (line 170):** the comparison was cetuximab plus best supportive care versus **best supportive care alone**, not cetuximab versus chemotherapy. Add "compared with supportive care alone".
- **O4. Macrophages "bite pieces off it" (line 182):** this trogocytosis ("shaving") can strip CD20 off a live lymphoma cell and help it escape (Weiner 2010 [^11]). Either drop the phrase or note that it is double-edged.
- **O5. Bevacizumab honesty (lines 192–194):** add the serious if rarer harms (bleeding, bowel perforation, poor wound healing) and that its breast cancer approval was revoked in 2011, a good "no hype" anchor.
- **O6. Tebentafusp CRS:** cytokine-mediated events (fever 76%) were as characteristic as rash (Nathan 2021 [^31]). One clause would tie it to the CRS discussion.
- **O7. "-bart exists for exactly these engineered-stem antibodies" (line 285):** "-bart" covers any engineered constant region in a **single-target** antibody, including half-life-extending changes (e.g., picankibart's YTE mutations, ATW 2026 [^1]). Bispecific engagers with muted stems get "-mig", not "-bart". Also add "single-target" to the "-tug", "-bart" and "-ment" definitions (line 144–147), since that is what separates them from "-mig".
- **O8. "Chimeric 1994" year label (line 63):** abciximab, the first chimeric approval, is a Fab fragment with no stem. The label is technically right, but the drawn chimeric IgG with an NK-recruiting stem first arrived with rituximab in 1997. Consider "Chimeric 1994 (a fragment) · 1997 (full antibody)", or keep as is.
- **O9. Opening (line 9):** 12 of the 19 first approvals in 2025 were for non-cancer diseases (ATW 2026). Since the sentence follows "a modern cancer ward", consider "19 new antibody drugs, for cancer and many other diseases, …".
- **O10. ADC key idea (line 307):** "the target only has to be an address" also needs the address to be swallowed (internalized) and to be much more abundant on tumor than on vital tissue. Suggest "an address that the cell swallows".
- **O11. ch09-bridge cytokine panel (line 497):** rename "danger zone" to "severe CRS". Note in the spec that the first exposure releases the most cytokines and later doses less, which is why step-up works even at the same tumor burden. As written, the curve depends only on simultaneous engagements, which is acceptable for a schematic.
- **O12. Glossary:**
  - car-t: "A patient's own T cell" → "Usually a patient's own T cell" (allogeneic products exist; Ch 10).
  - complement: "cascade into holes punched … and flags for phagocytes" is ungrammatical; try "trigger a cascade that punches holes in the target's membrane and tags it for phagocytes".
- **O13. Catumaxomab:** the chapter consistently says "first … in the US", which is correct. A Go-deeper footnote could mention that the first T-cell-engaging bispecific approved anywhere was catumaxomab (EpCAM × CD3, EU 2009, for malignant ascites, later withdrawn). That would forestall "wasn't X first?" questions.
- **O14. Length:** the main narrative (excluding boxes, figures and quiz) is about 3,400 words, above the PLAN's 2,000–3,000. Trims could come from S10 content cuts (E1910 sentence, glofitamab numbers).

---

## Quiz

All four keyed answers are correct, and every distractor explanation is accurate. Q4's key ("a little HER2 lets the drug in … eight payload molecules … neighboring cells") matches Ogitani 2016 and Drago 2021. Its wrong-option explanation "plain trastuzumab … does not help them" is consistent with NSABP B-47. No changes needed.

## Glossary

Accurate apart from O12. CD20, BCMA, GPRC5D, DLL3, HLA, CDR, chimeric/humanized definitions and the HER2 figures (15–20%) are all correct.

---

## Verified as correct (safe to keep)

- Köhler & Milstein 1975, Cambridge; share of the 1984 Nobel (with Jerne). Muromonab-CD3 in 1986 was the first approved mAb (ATW 2026; Lu 2020).
- HAMA responses clear the drug and cause allergic reactions; mouse Fc recruits human effectors poorly (Lu 2020). Six CDRs per arm (3 VH, 3 VL).
- First approvals by type: chimeric 1994 (abciximab), humanized 1997 (daclizumab), fully human 2002 (adalimumab, phage display), first transgenic-mouse human mAb 2006 (panitumumab). Winter's CDR grafting dates to 1986.
- INN history (Guimaraes Koch 2022): first mAb scheme in April 1991; the source infix was discontinued in 2016 (scheme adopted April 2017) for the reasons given, including "no scientific basis for considering any infix per se superior" and marketing use; -t(u)- became -ta-. There were 879 "-mab" names. The 73rd Consultation (Oct 2021) adopted -tug/-bart/-mig/-ment with the definitions given; "-mig" applies "regardless of the format". "-fusp" was adopted in 2017.
- Becotatug vedotin (EGFR ADC, China, Oct 2025) and picankibart (IL-23p19, psoriasis, China, Nov 2025) were first approved in 2025. Sonesitatug vedotin (Claudin 18.2 ADC) is in phase 3 for gastric cancer. There were 19 first approvals in any country in 2025, and ATW 2026 discusses bispecific ADCs (izalontamab brengitecan).
- HER2 is amplified in about 15–20% of breast cancers. Slamon 1987 linked amplification to relapse and survival. Trastuzumab was approved in 1998. In 2001, median survival was 25.1 vs 20.3 months. In the adjuvant setting, disease-free survival HR was 0.48.
- KRAS exon 2 mutations occur in 42.3% of colorectal cancers. With wild-type KRAS, median OS was 9.5 vs 4.8 months (HR 0.55); with mutant KRAS there was no benefit (HR 0.98). The reasoning is sound. HER2 has no known ligand, and the figure note on this is correct.
- Rituximab, approved in 1997, was the first US anti-cancer mAb. Its effector mechanisms are ADCC (NK cells via CD16), CDC (C1q needs clustered Fc) and phagocytosis. CD20 is absent on stem cells and plasma cells (correct; see S4 for the citation). In R-CHOP, complete responses were 76% vs 63% and the risk ratio for death was 0.64.
- Bevacizumab: median OS 20.3 vs 15.6 months; grade 3 hypertension 11.0% vs 2.3%.
- Clynes 2000: FcRγ-deficient mice and Fc-mutant antibodies failed, while FcγRIIB-deficient mice showed more ADCC.
- From Drago 2021:
  - about 0.1% of an injected dose reaches the tumor;
  - approved ADCs have DARs of 2–8;
  - brentuximab vedotin with DAR 8 was cleared 5× faster than DAR 2 and had a worse therapeutic index, attributed to hydrophobicity;
  - a higher DAR helps sacituzumab;
  - gemtuzumab ozogamicin was approved in 2000, withdrawn in 2010 and re-approved in 2017;
  - brentuximab vedotin was approved in 2011 and T-DM1 in 2013;
  - linker classes include hydrazone (gemtuzumab), disulfide and cathepsin-cleaved peptide linkers;
  - T-DM1's non-cleavable linker leaves a charged lysine-linker payload.
- T-DM1 has a DAR of about 3.5 with a non-cleavable linker; T-DXd has about 8 with a cleavable linker and a membrane-permeable payload. Ogitani 2016 showed co-culture and in vivo bystander killing, but no effect on contralateral HER2-negative tumors.
- DESTINY-Breast03: 12-month PFS 75.8% vs 34.1%. DESTINY-Breast04: PFS 9.9 vs 5.1 months, OS 23.4 vs 16.8 months, drug-related ILD 12.1% with 0.8% grade 5. The HER2-low approval came in August 2022. DESTINY-Breast06 defines HER2-ultralow, and the FDA approval in January 2025 is consistent with the clinic box.
- ASCENT: OS 12.1 vs 6.7 months; grade ≥3 neutropenia 51%. EV-302: OS 31.5 vs 16.1 months.
- Blinatumomab was approved in the US on 3 Dec 2014. It is about 54 kDa (about a third of an IgG), has a half-life of about 2 h and is given by continuous infusion. TOWER: OS 7.7 vs 4.0 months. E1910: 3-year OS 85% vs 68%.
- MajesTEC-1: ORR 63.0%, ≥CR 39.4%, median of 5 prior lines, step-up doses 0.06 and 0.3 mg/kg, CRS 72.1% (grade 3: 0.6%), infections 76.4% (grade 3–4: 44.8%).
- Talquetamab: dysgeusia 57–63% and skin events 67–70% at the recommended doses.
- Glofitamab: complete responses in 39% overall and 35% after CAR-T, with obinutuzumab pretreatment.
- Lee 2023: biallelic BCMA or GPRC5D loss, and extracellular BCMA mutations with surface expression retained.
- US approvals listed in the roster are all correct: teclistamab, elranatamab, linvoseltamab (July 2025) and talquetamab for myeloma; mosunetuzumab, epcoritamab and glofitamab for lymphoma. Teclistamab and glofitamab are built on full IgG frames with silenced Fc, and tarlatamab is a half-life-extended BiTE.
- Tebentafusp was approved by the FDA on 25 Jan 2022, the first US engager for a solid tumor and the first TCR-based drug. It is a picomolar TCR against gp100 presented by HLA-A*02:01, fused to an anti-CD3 arm. It was the first therapy shown to improve OS in metastatic uveal melanoma (1-year OS 73% vs 59%, HR 0.51). Rash occurred in 83%.
- DeLLphi-304: OS 13.6 vs 8.3 months (HR 0.60); grade ≥3 adverse events 54% vs 80%. Full FDA approval came on 19 Nov 2025.
- MajesTEC-3: 1–3 prior lines; 36-month PFS 83.4% vs 29.7%; deaths from adverse events 7.1% vs 5.9%. The comparator was DPd or DVd ("a standard combination").

**Citation PMIDs (all verified):** [^1] 41560619 · [^2] 1172191 · [^3] 31894001 · [^4] 3713831 · [^5] 35584276 · [^6] 27939064 · [^7] 3798106 · [^8] 11248153 · [^9] 16236738 · [^10] 18946061 · [^11] 20350658 · [^12] 11807147 · [^13] 15175435 · [^14] 10742152 · [^15] 33558752 · [^16] 27166974 · [^17] 35320644 · [^18] 35665782 · [^19] 33882206 · [^20] 38446675 · [^21] 39282896 · [^22] 32242094 · [^23] 28249141 · [^24] 39047240 · [^25] 35661166 · [^26] 40454646 · [^27] 36507686 · [^28] 37653344 · [^29] 36507690 · [^30] 41363801 · [^31] 34551229.
