# Verification pass 2: Chapter 9, "Antibodies as Medicine" (`content/drafts/09-antibodies.md`)

Verifier: second-pass fact check, 2026-10-06. Every claim in the prose, figure specs (`spec`, `steps`), the field-guide table, quiz, takeaways, glossary and sources was checked against primary sources. Tools: PubMed full text (PMC), Amass `regulatorycore` (FDA labels), FDA/ASCO Post notices. Line numbers refer to the current draft (593 lines).

**Status of the earlier review (`docs/reviews/09-science.md`).**
- All three Must-fixes are resolved correctly:
  - M1: line 15 now names "the tumor's half of the brake, PD-L1".
  - M2: daratumumab is now the fully human example. The name parses ibritum·o·mab / daratum·u·mab are correct, and the IgG2 panitumumab and the NK-cell docking have been removed.
  - M3: cardiotoxicity now reads 27% any heart dysfunction and 16% serious heart failure.
- The Should-fixes S1–S9 are resolved: teclistamab-plus-daratumumab FDA approval; tarlatamab accelerated then full approval; the Dreier costimulation point; Rituxan label for CD20; supporting mouse residues; generic "tumor surface protein"; ADC toxicity note; T-DM1 caption; ASCENT.
- Sources have been trimmed to 26.
- New material checks out (MajesTEC-3 approval and OS, the INN history, the 2025 first approvals), except the items below.

---

## 1. Errors (MUST fix)

**E1. Takeaway 2 says "since late 2021 new antibodies no longer end in -mab at all" (line 497).**
- Problem: as worded, this is false for what a reader will take "new antibodies" to mean, namely newly approved drugs. Names assigned before the change are kept: "Modifications to INN schemes are not implemented retrospectively" (Guimaraes Koch [4], PMC9122354). So antibodies approved in 2025–26 still overwhelmingly end in -mab. Examples from this chapter:
  - linvoseltamab (FDA, July 2025);
  - teclistamab plus daratumumab (FDA, March 2026).
- Only names assigned under the scheme adopted at the 73rd INN Consultation (October 2021) use the new stems. The first such drugs were approved in 2025, in China: siltartoxatug (Feb), firsekibart (June), becotatug vedotin (Oct) and picankibart (Nov) (Crescioli [1], PMC12826703).
- Suggested rewrite: "Newer names drop the source letters, and antibodies named under the rules adopted in late 2021 no longer end in -mab at all."

**E2. Takeaway 2 says "engineers kept only the gripping loops and swapped in human frames: chimeric (-xi-), humanized (-zu-), fully human (-u-)" (line 497).**
- Problem: this contradicts the chapter's own body text (lines 35–37) and figure. Chimeric antibodies keep the mouse's whole variable domains (arm tips), not only the loops. Fully human antibodies keep no mouse loops at all. Only humanized antibodies keep "only the gripping loops (plus a few supporting residues)".
- Suggested rewrite: "Mouse antibodies provoke immune reactions, so engineers replaced mouse parts step by step: chimeric (-xi-, mouse arm tips on a human frame), humanized (-zu-, only the gripping loops left), then fully human (-u-)."

---

## 2. Unsupported or weakly supported (SHOULD fix)

**U1. Clinic box omits HER2-ultralow (line 458).**
- Quote: "The score now separates candidates for trastuzumab (HER2-positive) from candidates for trastuzumab deruxtecan (HER2-positive or HER2-low)."
- On 27 Jan 2025 the FDA approved trastuzumab deruxtecan for HR-positive, **HER2-low or HER2-ultralow** metastatic breast cancer after endocrine therapy (DESTINY-Breast06; AstraZeneca/FDA notices). The label was current on 19 May 2026 (Amass), and that version also adds a neoadjuvant HER2-positive early-breast-cancer indication.
- Suggest: "…from candidates for trastuzumab deruxtecan (HER2-positive, HER2-low and, in some hormone-sensitive cancers, even 'HER2-ultralow')."

**U2. "Antibodies meant only to block, and most bispecific engagers, get muted stems" (Go-deeper box, line 218).**
- This overgeneralizes. Several blocking antibodies in this chapter carry unmodified IgG1 stems: cetuximab (which also mediates ADCC), bevacizumab and trastuzumab.
- Muted stems are typical of checkpoint blockers and engagers (Chapter 8; Goebeler [18]), but not universal.
- Suggest: "Antibodies whose stems would do harm, such as checkpoint blockers and most bispecific engagers, get muted stems."

**U3. "It was not gentle: 7.1% died of side effects, versus 5.9%" (line 329; precision, optional).**
- These are deaths from treatment-emergent adverse events of any cause. Investigators judged 4.2% vs 1.7% treatment-related, and most were early infections, including COVID-19 (Costa [22], full text PMC13218738).
- Suggest: "7.1% died of complications during treatment, mostly infections, versus 5.9%".

**U4. "Approved in 1997, it was the first antibody drug for cancer in the United States" (line 201; optional).**
- Lu [3] says "the first mAb with an oncologic indication". A diagnostic imaging antibody, satumomab pendetide (OncoScint, approved 1992 from my recollection; not checked in this pass), came earlier.
- Suggest: "the first antibody approved in the United States to treat cancer".

**U5. "Its payload, deruxtecan" (lines 235 and 296; optional).**
- Strictly, the payload is DXd, an exatecan-derived topoisomerase-I inhibitor. "Deruxtecan" names the linker plus payload. This is acceptable for lay readers; a Go-deeper reader may object.

---

## 3. Citation problems

**C1. 1984 Nobel cited to Lu [3] (line 27).**
- Quote: "The method won Köhler and Milstein a share of the 1984 Nobel Prize.[^3]"
- Lu 2020 (full text, PMC6939334) mentions Köhler and Milstein's 1975 hybridoma technique but not the Nobel Prize. The fact is correct: the 1984 Nobel Prize in Physiology or Medicine was shared with Niels Jerne.
- Cite nobelprize.org (https://www.nobelprize.org/prizes/medicine/1984/summary/) or drop the citation from this sentence.

**C2. "The two are no longer given together.[^6]" (line 447).**
- Slamon 2001 [6] reports the toxicity. It cannot attest to current practice.
- Move the citation to the preceding sentence, and cite Loibl [5] (review of HER2-positive breast cancer management) or the Herceptin label for the practice statement.

**C3. Muromonab "used to stop transplanted kidneys from being rejected.[^3]" (line 31; minor).**
- Lu [3] says only "treatment of acute transplant rejection", with no organ named. The kidney indication is correct (OKT3 was approved for acute renal-allograft rejection).
- Optional: cite Guimaraes Koch [4] or the OKT3 label, or say "transplanted organs".

No citation is fabricated or mismatched. All 26 entries resolve to the stated work, with correct author, journal, year, volume, pages and DOI. Re-checked in this pass:
- [1] Crescioli, *mAbs* 2026;18(1):2614669, PMID 41560619.
- [4] Guimaraes Koch, PMID 35584276.
- [12] Clynes, PMID 10742152.
- [19] Dreier, *Int J Cancer* 2002;100:690–697, PMID 12209608.
- [22] Costa, *NEJM* 2026;394(8):739–752, PMID 41363801.
- [3] Lu, PMID 31894001.

The other entries match the PMIDs listed in the earlier review. The trial acronyms now sit outside the titles.

---

## 4. Claims verified OK (claim → source)

**Opening and history**
- 19 antibody therapeutics had their first approval anywhere in 2025, for cancer and other diseases → Crescioli [1] abstract.
- The first new-stem drugs were approved in 2025 in China: siltartoxatug, firsekibart, becotatug vedotin, picankibart → [1] full text.
- Köhler and Milstein, 1975, hybridoma → [2]; [3].
- Muromonab-CD3 was the first approved mAb, in 1986 → [3]; [4].
- Human anti-mouse antibodies (HAMA) speed clearance and cause allergic reactions; mouse Fc gives poor ADCC → [3].
- Winter's CDR grafting, 1986; first chimeric approval 1994 (abciximab); first fully human approvals 2002 (adalimumab, phage display) and 2006 (panitumumab, transgenic mouse) → [3].
- Trastuzumab approved 1998; rituximab 1997, the first mAb with an oncologic indication → [3].
- Daratumumab is human IgG1κ → FDA label (Amass).

**INN naming → Guimaraes Koch [4] full text**
- First antibody naming scheme 1991; source infix dropped in 2016 (scheme adopted 2017).
- Reasons: "no scientific basis for considering any infix superior", marketing use, and overcrowded name space.
- The tumor infix became -ta-.
- 879 "-mab" names; the 73rd Consultation in October 2021 replaced -mab with -tug / -bart / -mig / -ment, defined as in the box.
- "-fusp" adopted 2017; changes are not retrospective.

**Block, flag, starve**
- HER2 amplified in 15–20% of breast cancers → Loibl [5].
- Slamon 2001 pivotal trastuzumab trial → [6]:
  - median OS 20.3 → 25.1 months;
  - with concurrent anthracycline, 27% any cardiac dysfunction and 16% NYHA III–IV.
- KRAS mutated in 42.3% of colorectal cancers; wild-type KRAS OS 9.5 vs 4.8 months vs supportive care; no benefit with mutant KRAS → Karapetis [7].
- Rituximab mechanisms: ADCC, complement, phagocytosis → Weiner [8].
- CD20 absent on stem cells and plasma cells; B-cell recovery at 6–12 months → Rituxan label [9].
- Blinatumomab half-life ~2 h; 28 days on, 14 days off → Blincyto label [9] (Amass).
- R-CHOP in older DLBCL patients: CR 76 vs 63%; risk ratio for death 0.64 → Coiffier [10].
- Bevacizumab: OS 20.3 vs 15.6 months; hypertension → Hurwitz [11].
- FcRγ-deficient mice and Fc-mutant antibodies "unable to arrest tumor growth"; FcγRIIB-deficient mice showed more ADCC → Clynes [12] abstract.

**ADCs → Drago [13] and Ogitani [14] unless noted**
- About 0.1% of the dose reaches the tumor; approved DARs range 2–8.
- Brentuximab vedotin at DAR 8 cleared 5× faster than at DAR 2.
- Linker classes; gemtuzumab ozogamicin approved 2000, withdrawn 2010, re-approved 2017; brentuximab vedotin 2011; T-DM1 2013.
- T-DM1: DAR about 3.5, non-cleavable linker, charged payload-linker scrap. T-DXd: DAR about 8, cleavable linker.
- Bystander killing in co-culture and in mixed tumors, with no effect on contralateral HER2-negative tumors → Ogitani [14].
- DESTINY-Breast03: 12-month PFS 75.8 vs 34.1% → [15].
- DESTINY-Breast04: OS 23.4 vs 16.8 months; drug-related ILD 12.1%, grade 5 0.8% → [16].
- HER2-low FDA approval August 2022 → [17].
- EV-302: OS 31.5 vs 16.1 months → [25].

**Engagers**
- CD3 is on all T cells; Fc-silenced, FcRn-retaining stems on newer engagers → Goebeler [18].
- Blinatumomab lysis is mainly by CD8+/CD45RO+ (antigen-experienced) T cells and is costimulation-independent → Dreier [19].
- Blinatumomab FDA approval Dec 2014; TOWER OS 7.7 vs 4.0 months → [17]; [20].
- MajesTEC-1 → [21]:
  - ORR 63%; CRS 72.1%, grade 3 in 0.6%;
  - infections 76.4%, grade 3–4 in 44.8%;
  - two step-up doses.
- MajesTEC-3 → Costa [22]:
  - 1–3 prior lines;
  - 36-month PFS 83.4 vs 29.7%;
  - deaths from TEAEs 7.1 vs 5.9%;
  - OS significantly longer (36-month OS 83.3 vs 65.0%).
- FDA approval 5 Mar 2026, ≥1 prior line, OS HR 0.46 (0.32–0.65) → FDA/ASCO Post; Tecvayli label s018 (Amass).
- Teclistamab is a humanized IgG4-PAA (full-size frame, muted Fc) → label (Amass).
- Tarlatamab → Mountzios [23]; Amass/FDA; Amgen; ASCO Post:
  - DeLLphi-304 OS 13.6 vs 8.3 months; grade ≥3 adverse events 54 vs 80%;
  - accelerated approval 16 May 2024; traditional approval 19 Nov 2025.
- Tebentafusp → Nathan [24]; [17]:
  - HLA-A*02:01 / gp100 TCR fused to anti-CD3;
  - FDA Jan 2022, the first US engager for a solid tumor;
  - 1-year OS 73 vs 59%; rash 83%, fever 76%.
- Biallelic BCMA/GPRC5D loss and extracellular epitope mutations with the protein retained on the surface → Lee [26].

**Field guide and the rest**
- Field-guide targets, drug classes and US approvals (including linvoseltamab, July 2025) → FDA.
- 2018 Chemistry Nobel to Smith and Winter (shared) → [3].
- Glossary entries, figure specs (`ch09-humanization` years 1986/1994/1997/2002; `ch09-wiring`; `ch09-adc`; `ch09-bridge` 1-in-~40 footnote) → consistent with the sources above.
- Quiz keys and explanations → correct.
