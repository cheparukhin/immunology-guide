# Verification pass 2 — Interlude, "130 Years of Immunotherapy" (`content/drafts/interlude-history.md`)

Second-pass, independent re-verification of every specific claim in the current draft: prose, callouts, Go-deeper boxes, the whole `int-timeline` figure (spec + **all 28 milestones** in `data`, every date, name, number and "first"), quiz, takeaways, glossary and the 20 sources. Line numbers = the draft as of 2026-10-06. Tools: the Nobel Assembly's 2018 Scientific Background PDF (read in full), McCarthy 2006 (full text), Rosenberg 2014 (full text), Grupp 2013 (full text), PubMed/PMC, **Amass regulatorycore for the approval dates**, and company/trade sources for the 2026 items.

**Headline:** every one of the first review's ten Must-fixes and ten Should-fixes is correctly resolved — all eight over-broad "firsts" are now scoped to the US or softened, the BioNTech item is accurately described and labeled, the PD-L1 credit is untangled, the Coley myth is fixed, and the cytokine lane problem is gone (the lane was merged into "Microbes, cytokines & vaccines", which now runs to 2026). I independently re-confirmed **12 approval dates against Amass FDA records**, to the day. I found **no factual errors**. What remains is one over-broad "every" claim, three precision/labeling softnesses, and three citation gaps.

---

## 1. Errors (MUST fix)

**None found.** Every date, number, name, attribution and approval in the current draft checks out. Specifically re-confirmed against Amass FDA regulatory records (agency, product, authorization date): Rituxan 1997-11-26; Herceptin 1998-09-25; Yervoy 2011-03-25; Keytruda 2014-09-04; Blincyto 2014-12-03; Opdivo 2014-12-22; Enhertu 2019-12-20; Kimmtrak 2022-01-25; Imjudo (tremelimumab) 2022-10-21; Imdelltra (tarlatamab) 2024-05-16; Proleukin (aldesleukin) 1992-05-05; Intron A (interferon alfa-2b) 1986-06-04; Mylotarg re-approval 2017-09-01. All match the draft and source [^8] exactly.

---

## 2. Unsupported or weakly supported (SHOULD fix)

**U1. Timeline `hybridoma-1975`, "why" (line 192) — "Every checkpoint inhibitor approved so far is a monoclonal antibody" is over-broad as of 2026.**
Strictly it is still defensible (no small-molecule or peptide checkpoint inhibitor is approved anywhere), but two **bispecific** checkpoint antibodies are now approved in China and an expert reader will object to "monoclonal": cadonilimab (AK104, PD-1×CTLA-4), approved by China's NMPA in June 2022 for relapsed/metastatic cervical cancer and described by its developer as the world's first dual-checkpoint bispecific; and ivonescimab (PD-1×VEGF), approved in China in 2024. Suggested rewrite: "Every checkpoint inhibitor approved so far is an antibody." (Keeps the Köhler–Milstein payoff and removes the attack surface.)

**U2. Line 93 and timeline `emily-2012` — Emily Whitehead's age differs between the two cited sources.**
The draft says "six-year-old Emily Whitehead". CHOP's account [^15] supports 6 at treatment (April 2012); the primary trial report [^14] describes Patient 1 as "a 7-year-old girl with a second recurrence of ALL" (Grupp SA, et al. *N Engl J Med* 2013;368:1509–1518, PMC4058440, verbatim). She turned 7 within weeks of the infusion, so both are defensible — but since both papers are cited side by side, consider "six-year-old (seven in the trial report)" or simply "Emily Whitehead, then six".

**U3. Line 95 — Jimmy Carter's treatment is described incompletely.**
Quote: "In 2015 former US president Jimmy Carter, then 90, was treated with radiation and pembrolizumab for melanoma that had reached his brain." Correct as far as it goes (and the age and timing are right: announced 20 Aug 2015, scans clear announced 6 Dec 2015, per [^15]), but his treatment also included surgical removal of a liver lesion. Either add "surgery" or write "treated with surgery, radiation and pembrolizumab".

**U4. Line 107 — "a small trial" would be better as "a 157-patient phase 2b trial".**
Quote: "Added to pembrolizumab after melanoma surgery, one cut the risk of recurrence or death by about 44% in a small trial, a statistically borderline result.[^18]" All three numbers are right — KEYNOTE-942: 157 patients, HR 0.561 (95% CI 0.309–1.017), two-sided p = 0.053 (Weber JS, et al. *Lancet* 2024;403:632–644, PMID 38246194) — and "borderline" is the honest word. Naming the phase makes the contrast with the 2026 phase 3 land harder, and matches the PLAN's preference for stated trial phases.

**U5. Line 21 — one sharp detail from the cited source is missing.**
"The trouble lay in the word 'some'." McCarthy [^1] also records that "two of his patients died of infection", which is the strongest single reason the toxins were abandoned. Optional, but it is in the source and would strengthen the paragraph.

---

## 3. Citation problems

**C1. [^6] (Rosenberg 2014) is cited for "Patient after patient received it without a single tumor shrinking" (line 49) — true, but of the *pre-recombinant, low-dose* era.**
Rosenberg 2014 says: "Levels of IFN and other cytokines were found in the serum, and although these interesting immunologic changes were seen, there was no evidence of tumor regression in any of these cancer patients treated with IL-2 alone" (PMC6293462) — this refers to the 1983–84 natural-IL-2 trials before recombinant high-dose IL-2 existed. The sentence is accurate but implies a continuous run of failures right up to November 1984; one clause ("at the low doses then available") would make it exact.

**C2. Stutman 1974 is cited only at second hand (line 35 and timeline `nude-1974`, source [3]).**
Dunn 2004 [^3] supports the claim, and the primary paper confirms it verbatim: Stutman O. *Science* 1974;183:534–536 (PMID 4588620, doi:10.1126/science.183.4124.534) — "Athymic-nude (nu/nu) mice and normal (nu/+) mice showed no differences in either latent period or incidence of local sarcomas or lung adenomas within 120 days". Same recommendation as in the Ch 7 report: add it as a primary citation, since both documents lean on this single experiment.

**C3. Timeline `pembro-2014` cites only [2] and [8] for the 2012 response rates.**
"After a 2012 trial showed lasting tumor shrinkage in about one in five to one in four patients with melanoma, lung or kidney cancer…" is supported by the Nobel Scientific Background [^2], verbatim: "20-25% of patients with advanced non-small-cell-lung cancer (NSCLC), melanoma, or renal cancer, most of which were durable". The primary paper is Topalian SL, et al. *N Engl J Med* 2012;366:2443–2454 (PMID 22658127), whose per-tumor rates are 18% (lung), 28% (melanoma), 27% (kidney) — worth adding, since the same figures are used twice (line 89 and the card).

---

## 4. Verified OK (claim → source)

**Coley (McCarthy 2006, PMC1888599 — read in full; all verbatim)**
- Coley born 1862 → 28 in 1890; Bessie Dashiell, 17, swelling in the hand, malignant bone tumor (probably Ewing sarcoma of a metacarpal), forearm amputation, "died of widespread metastases within ten weeks"; Stein, a German immigrant, found by "combing the tenements of Lower Manhattan" after weeks, "no evidence of residual cancer"; 1891 first streptococcal injection with tumor shrinkage; switch to heat-killed streptococci plus "a second organism that we now call *Serratia marcescens*"; "13 different preparations"; forty years and "almost 1,000 cases"; Parke-Davis stopped production by 1952; FDA refused to acknowledge the toxins in 1962; Helen Coley Nauts; Coley (1862–1936).
- German precursors — Busch 1868, Fehleisen 1882 (Nobel Scientific Background, verbatim: "the first attempts in this field were by German clinicians 150 years ago (Busch, 1868, Fehleisen, 1882)"); Bruns 1888 in [^1]. The card's "why" now credits them, so the Coley myth is corrected (Must-fix 1 resolved).
- James Ewing as critic, radiation as the rival technology → [^1].

**Immunosurveillance**
- Ehrlich 1909; Burnet 1957 and Thomas 1959; the 1974 setback and the ~25-year eclipse → [^2], [^3]; the Nobel background's Ehrlich passage confirms the 1909 framing.

**Antibodies, BCG, cytokines, TIL**
- Köhler & Milstein, Cambridge, *Nature* 7 Aug 1975, three pages (256:495–497), "shared the 1984 Nobel Prize with Niels Jerne" → [^4] + Nobel 1984 record (Should-fix 5 resolved).
- Rituximab first mAb approved **in the US** for cancer (1997), trastuzumab 1998 → Amass FDA (Must-fix 6 resolved).
- Morales, Eidinger & Bruce 1976, *J Urol* Aug 1976, 9 patients; TICE BCG licensed 1990 → [^5], [^8].
- Interferon-alfa approved 1986 for a rare leukemia (hairy cell) → Amass FDA: Intron A 1986-06-04.
- IL-2 (Rosenberg 2014, PMC6293462 — read in full; all verbatim): "In November 1984, a 33-year-old woman with metastatic melanoma… received the aggressive infusion of rIL-2. Within one month… biopsy of one of her tumors showed extensive necrosis… This patient has remained disease-free for the past 29 years"; FDA approval for metastatic renal cancer 1992 (first immunotherapy approved for cancer) and melanoma 1998; ~15–20% response with ~5–10% complete; the LAK detour settled by a randomized trial of 181 patients; 1988 TIL report, 20 patients, about half responded.
- Cancer vaccine trials: 440 patients, objective response rate 2.6% → Rosenberg 2004 (PMID 15340416, abstract verbatim).

**Checkpoints (Nobel Scientific Background, read in full; all verbatim)**
- CTLA-4 cloned 1987 in Pierre Golstein's laboratory (Brunet et al. 1987); function unknown; assumed costimulatory; Walunas/Bluestone/Thompson 1994 and Krummel & Allison 1995 showed it was a negative regulator → the draft's "In 1994–95 two groups, one of them James Allison's at Berkeley".
- "The first experiment was set up in his laboratory at the University of California, Berkeley in the end of 1994 with an immediate blinded repeat over the Christmas period"; Leach, Krummel & Allison, *Science* 22 Mar 1996 → [^9] (PMID 8596936).
- Allison's mother died of lymphoma when he was 11 (Alice, Texas; Nobel biography); ~5 years failing to interest pharma; Medarex's MDX-010 (1999) with Alan Korman; Nils Lonberg co-authored the ipilimumab development paper; The Checkpoints/harmonica.
- PD-1 identified and cloned by Honjo's group at Kyoto in 1992 (Ishida et al.) from cells undergoing programmed cell death; knockout mice revealed a brake, not a death switch.
- PD-L1 credit, now untangled and matching the source exactly: Dong et al. 1999 (B7-H1, Chen's lab, PD-1 binding not investigated); Freeman et al. 2000 with Honjo and Clive Wood; Dong 2002 (Chen) and Iwai 2002 (Minato/Honjo) showed tumor PD-L1 switches off attacking T cells (Must-fix 9 resolved).
- Tremelimumab phase 3: 655 patients, stopped April 2008; OS 12.6 vs 10.7 months; ~1 in 10 responding in each arm; response duration 35.8 vs 13.7 months → Ribas 2013 (PMID 23295794). Approved with durvalumab for liver cancer 2022 → Amass FDA 2022-10-21.
- Ipilimumab phase 3: median OS 10.0 months vs 6.4 with "a comparison vaccine alone" (gp100), previously treated patients → Hodi 2010 (PMID 20525992) (Should-fix 3 resolved); FDA 25 Mar 2011, "first therapy approved shown to help patients with metastatic melanoma live longer".
- 2012 PD-1 trial 20–25%, durable → [^2]; pembrolizumab first PD-1 blocker approved in the US (4 Sep 2014), nivolumab in December (22 Dec 2014) → Amass FDA.
- Nobel announcement 1 Oct 2018, citation wording "cancer therapy by inhibition of negative immune regulation"; the "curiosity-driven research, not primarily oriented towards cancer" quote correctly attached to the PD-1 discovery only, with Allison's leap distinguished (Should-fix 6 resolved).

**Cell therapy and later approvals**
- Gross, Waks & Eshhar, *PNAS* Dec 1989;86:10024 → [^12] (PMID 2513569); the 1987 Kuwana precedent and the 1993 single-chain template are credited via [^13] (June & Sadelain 2018, PMID 29972754); card title now "Antibody-guided T cells" and the portrait says "some of the first CARs" (Must-fix 7 resolved).
- CD19 CAR-T remissions in adults by 2010–11 → [^6], [^13] (Must-fix 7 / Should-fix 7 resolved); credit list now includes Sadelain, June, Campana, Rosenberg with Kochenderfer, plus Brentjens, Brenner, Porter and Grupp.
- Emily Whitehead, April 2012, second relapse, severe cytokine release syndrome reversed with etanercept plus tocilizumab, leukemia cleared, cancer-free at ten years → Grupp 2013 (PMC4058440, verbatim) + CHOP (May 2022); scoped to "the first child to receive the Philadelphia team's CAR-T cells" (Must-fix 8 resolved).
- Blinatumomab: "first bispecific T-cell engager approved **in the US**", 3 Dec 2014 → Amass FDA (Must-fix 5 resolved).
- T-VEC: "first oncolytic virus approved **in the US**", 27 Oct 2015 → [^8] (Must-fix 4 resolved).
- Tissue-agnostic pembrolizumab for MSI-H/dMMR, 23 May 2017, ~40% response (FDA ORR 39.6%), "progressed after earlier treatment" → [^8].
- Tisagenlecleucel 30 Aug 2017, 83% remission within three months (ELIANA), "which the FDA described as the first gene therapy available in the country" → [^8] (Should-fix 1 resolved); Amass confirms the product (EMA EPAR 2018-08-23 for the EU).
- T-DXd 20 Dec 2019; first US approval for HER2-low breast cancer 5 Aug 2022 → Amass FDA 2019-12-20.
- Lifileucel 16 Feb 2024, ~31% response (ORR 31.5%), "first T-cell therapy approved in the US for a solid tumor, more than 35 years after the first TIL report" (22 Dec 1988 → 16 Feb 2024 = 35.2 years) → [^8], [^6] (Must-fix 3 resolved; sipuleucel-T no longer contradicts it, since the claim is now about T-cell therapy).
- Tarlatamab 16 May 2024, 40% response; card reframed as "A T-cell engager for lung cancer" with tebentafusp (25 Jan 2022, Amass-confirmed) credited as the first in a solid tumor → Amass FDA (Should-fix 2 resolved).
- Afamitresgene autoleucel: approval letter 1 Aug / FDA announcement 2 Aug 2024, 43% response (ORR 43.2%), matching HLA type, "first engineered T-cell receptor therapy approved in the US", targets a MAGE-A4 fragment, can reach proteins made inside the cell → [^8].
- Gemtuzumab ozogamicin: first ADC approved in the US (2000), withdrawn 2010 after the confirmatory trial failed to confirm benefit **and showed more early deaths**, re-approved 2017 at a lower dose for different patients → [^8] + Amass FDA 2017-09-01 (Should-fix 8 resolved).

**2024–2026 material (the newest and most exposed claims)**
- NADINA: 423 patients, stage III melanoma, two cycles of neoadjuvant ipilimumab + nivolumab vs surgery then 12 cycles of adjuvant nivolumab; estimated 12-month event-free survival **83.7% vs 57.2%** → Blank CU, et al. *N Engl J Med* 2024;391:1696–1708 (PMID 38828984, abstract verbatim). The draft's "from 57% to 84%" and the card's "84% versus 57%" are both correct.
- KEYNOTE-942 → see U4; numbers verified.
- INTerpath-001: Merck and Moderna announced on **19 August 2026** that the phase 3 trial of intismeran autogene plus pembrolizumab in completely resected stage IIB–IV melanoma met its primary endpoint (recurrence-free survival) and its key secondary endpoint (distant metastasis-free survival); **1,137 patients**, randomized 2:1; **no hazard ratios released**; data to be presented at a future meeting; the companies called it the first positive phase 3 readout for an individualized neoantigen therapy and for an mRNA-based cancer therapy. The draft's prose, card and alt text all match, are attributed to the companies, and say it is not yet approved — exactly what the PLAN requires (Should-fix 4 resolved).
- BioNTech/autogene cevumeran: announced **28 August 2026** ("that same month" ✓); phase 2 BNT122-01 (NCT04486378) in ctDNA-positive resected stage II–III colorectal cancer, vaccine **as monotherapy** ("given alone" ✓); futility boundary crossed in **October 2025** with the trial continuing; termination followed a DSMB finding of a numerical imbalance in overall survival, with continuation unlikely to change the efficacy outcome; no new safety signals. The draft's three clauses match, and [^19] labels both items as company announcements, not peer-reviewed (Must-fix 2 resolved).
- Haslam, Olivier & Prasad: eligibility **56.55%** and response **20.13%** for US patients with advanced/metastatic cancer in 2023 → *Int J Cancer* 2025;156:2352–2359 (PMID 39887747, abstract verbatim). The draft's "about 57… about 20" and the hedge "That is one group's estimate, and other methods differ somewhat" are both right.

**Figure spec, internal consistency, and the rest**
- Milestone count: parsed the JSON — **28 milestones** across exactly the 5 declared lanes (checkpoints 8, microbes 6, cells 6, antibodies 5, ideas 3) and the 3 declared types (finding 14, approval 12, setback 2). The alt text's "28 milestones", "five lanes", and "before 1975 there are only three" all match the data. Every `chapter` value is a real chapter id and a sensible destination; every `sources` array points to an existing source number.
- Phone-view example gap "… 66 years …" for 1891 → 1957 is arithmetically right (the previous spec's "33 years" example, which matched no gap, is gone); axis 1885→2027 with a "Now (2026)" line is consistent with today's date; the "Tap any marker" hint sits at the 2011 ipilimumab marker.
- The cytokine-lane gap is resolved structurally: cytokines now share the "Microbes, cytokines & vaccines" lane, which carries milestones in 1891, 1976, 1984, 2006, 2015 and 2026, so the alt text's claim about lanes filling after 2010 is no longer contradicted (Should-fix 9 resolved).
- Source [^15] now carries the correct CHOP headline, "Emily Whitehead, First Pediatric Patient to Receive CAR T-Cell Therapy, Celebrates Cure 10 Years Later" (Should-fix 10 resolved).
- Arithmetic in the narrative: 1891→2011 = "about 120 years" ✓; Bessie Dashiell (1890) → 2024 = "more than 130 years" ✓.
- Clinic box definitions (phase 3, median survival, response ≈ a third shrinkage) and the glossary's RECIST 30% figure are consistent with each other and with standard criteria; the accelerated-approval box correctly states that confirmation is not guaranteed.
- Quiz: all three keyed answers and every distractor explanation are correct, including the tremelimumab "long tail" reading and the 2026 vaccine status ("a phase 3 trial was reported as positive by the companies in 2026, but the vaccine was not yet approved").
- Takeaways: all six trace to verified material, including the ~25-year eclipse and the 1997–98 antibody framing.
- Glossary: 26 entries, all accurate; `immunosurveillance` now says "well supported in mice and indirectly in people".
- Source list: 20 entries. All exist with correct authors/journal/year/volume/pages/DOI, verified by citation lookup (PMIDs 16789469, 15032581, 1172191, 820877, 24907378, 15340416, 8596936, 23295794, 20525992, 2513569, 29972754, 23527958, 24357284, 38828984, 38246194, 39887747), plus the three composite entries ([^2] Nobel background + Allison biography + 1984 prize; [^8] FDA announcements and records; [^15] institutional patient accounts; [^19] company announcements). No orphan markers.
