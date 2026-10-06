# Science review — Chapter 10, "Living Drugs" (`content/drafts/10-cell-therapy.md`)

**Reviewer role:** scientific accuracy (CAR-T / TIL / TCR-T, hematologic oncology, tumor immunology)
**Reviewed:** 2026-10-05 · draft as of 418 lines, 31 sources, 4 figures, 5 go-deeper boxes, 4-question quiz
**Verification tools used:** PubMed (all 28 journal citations resolved to PMIDs), Amass RegulatoryCore, FDA.gov, NMPA/company announcements, HMPI
**Scope note:** I did not edit the draft. All suggested rewrites below are proposals for the chapter writer.

---

## Overall assessment

This is an unusually strong draft — the best-sourced chapter I have reviewed in this project. Every one of the 31 sources exists, is correctly attributed, and is cited for a claim it actually supports; all 31 are used at least once; the historical attributions (Gross/Eshhar 1989, Maher/Sadelain 2002, Imai/Campana 2004, Porter/June 2011) are exact, including the verbatim "non-MHC-restricted manner" quote; and the headline trial numbers (ELIANA 81%/76%, ZUMA-1 83%/58%/31%/42.6%, ZUMA-7 54.6% vs 46.0%, CARTITUDE-4 75.9% vs 48.6%, FELIX 77%/2.4%/7.1%, CT041-ST-01 3.25 vs 1.77 months, Rohaan 49% vs 21% and 7.2 vs 3.1 months, SPEARHEAD-1 19/52, Müller 15 patients, An 4/5, Steffin 0% vs 33%, Hamilton 724/1, Verdun & Marks 22 cases) all check out against the primary sources, as do the regulatory dates (lifileucel 16 Feb 2024, afami-cel 2 Aug 2024, obe-cel 8 Nov 2024, boxed warning 18 Apr 2024, REMS elimination 26 Jun 2025, liso-cel for MZL 4 Dec 2025, satri-cel NMPA 22 Jun 2026, anito-cel PDUFA late 2026). The CAR anatomy, the signal-1/signal-2 story, the CRS cascade (CAR-T → IFN-γ/TNF → host macrophages → IL-6/IL-1/NO) and the synNotch AND gate are all mechanistically correct, and the hedging on in vivo CAR-T ("roughly ten patients behind it") is a model of the voice rules. What needs fixing is a short list of specific technical slips — tocilizumab's actual target, an ICANS incidence range that silently excludes the most neurotoxic product, a figure caption that contradicts the chapter's own cited data, a price range contradicted by its own source, one wrong cell type in the quiz, a "natural TCR" claim that is false for the only approved TCR-T product (and omits the two trials in which affinity-enhanced TCRs killed patients), and a day counter that runs backwards. Nothing here undermines the chapter's architecture; all of it is a half-day of edits.

---

## Must fix

### 1. Tocilizumab is an IL-6 **receptor** blocker, not an IL-6 blocker (4 places)

**Locations and quotes:**
- L186: "Carl June … knew of an approved **IL-6-blocking antibody** sitting in the hospital pharmacy for rheumatology patients: **tocilizumab**."
- L339 (quiz Q2 answer): "which is why an **IL-6-blocking antibody** treats it."
- L352 (quiz Q4 distractor): "**blocking IL-6** treats the fever without preventing CAR-T expansion"
- L359 (takeaway 4): "treatable with an **IL-6-blocking antibody**"

**What's wrong:** Tocilizumab is a humanized monoclonal antibody against the **IL-6 receptor** (IL-6R, both soluble and membrane-bound); it does not bind IL-6. The antibody that binds IL-6 itself is siltuximab — a different drug, with a different (and much weaker) evidence base in CRS. The chapter's own figure spec gets this right ("Tocilizumab (blocks IL-6 signaling)", L205), so this is an inconsistency as well as an error. It matters here because Chapter 1 teaches receptor–ligand recognition and Chapters 8–9 lean hard on "antibody blocks receptor vs antibody blocks signal", so the sloppy shorthand actively undoes earlier teaching.

**Evidence:** Giavridis et al., the chapter's own [^12], uses the correct phrasing twice: "CRS may respond to **IL-6 receptor blockade**" (PMID 29808005, doi:10.1038/s41591-018-0041-7). FDA label for Actemra (tocilizumab): "an interleukin-6 (IL-6) receptor antagonist", approved 30 Aug 2017 for CAR-T-induced severe or life-threatening CRS.

**Suggested rewrite (L186):**
> "…knew of an approved antibody sitting in the hospital pharmacy for rheumatology patients — **tocilizumab, which plugs the receptor that cells use to hear IL-6**. They gave it."

Then use "the IL-6-receptor blocker" or simply "tocilizumab" in the three downstream mentions. In the takeaway: "treatable with an antibody that blocks the IL-6 receptor".

---

### 2. The ICANS incidence range excludes the most neurotoxic approved product

**Location and quote (L216):** "It affects roughly **20–40%** of patients given CD19 products and is severe in about 10–30%, depending heavily on the product.[^7][^8][^9]"

**What's wrong:** Two of the three cited sources are axicabtagene ciloleucel trials, in which neurologic events occurred in **60–64%** of patients — well outside the stated range. The range as written would lead a reader to believe axi-cel neurotoxicity is uncommon, when it is the single most important product-level toxicity difference in the field (and the reason the chapter's own CD28-vs-4-1BB discussion matters clinically).

**Evidence:**
- ZUMA-1 (axi-cel): neurologic events 64%, grade ≥3 28% (Neelapu et al., *N Engl J Med* 2017;377:2531–2544, PMID 29226797; the 5-year follow-up cited as [^8] reports no new signals).
- ZUMA-7 (axi-cel, second line): neurologic events 60%, grade ≥3 21% ([^9], PMID 37272527).
- ELIANA (tisa-cel): neurologic events 40%, grade 3/4 13% ([^7], PMID 29385370).
- JULIET (tisa-cel): grade ≥3 ICANS 12%.
- FELIX (obe-cel): grade ≥3 ICANS 7.1% ([^31], PMID 39602653).
- CARTITUDE-4 (cilta-cel, BCMA): ICANS 4.5%, all grade 1–2 ([^10], PMID 37272512).

**Suggested rewrite:**
> "How often it happens depends enormously on the product: neurologic events affected 64% of patients given axicabtagene ciloleucel and 40% of the children given tisagenlecleucel, and were severe in roughly 7–28% across the approved products.[^7][^8][^9][^31] It is usually fully reversible, and frightening to witness."

(If you prefer one clean sentence, "between about 5% and 30% of patients have a severe neurological episode, depending almost entirely on which product they received" is defensible and keeps the register.)

---

### 3. Figure `ch10-journey`, step 11 states that B cells never return — contradicted by the chapter's own cited evidence

**Location and quotes:**
- Figure spec L133: "a note that **normal B cells stay absent** while CD19 CAR-T cells persist"
- Step caption L150: "In some patients the engineered cells stay detectable for years, and **the normal B cells they also kill never come back**."

**What's wrong:** The narrative four sections later says the opposite, correctly and with a citation: "B cells do often return eventually — in ZUMA-1's long-term follow-up, polyclonal B cells had come back in **91%** of evaluable patients, and lasting aplasia turned out not to be necessary for lasting remission.[^8]" (L220). The figure is the more memorable artifact; as written it will teach the false version.

**Evidence:** [^8] Neelapu et al., *Blood* 2023;141:2307–2315 (PMID 36821768): "Peripheral blood B cells were detectable in all evaluable patients at 3 years with polyclonal B-cell recovery in 91% of patients… Protracted B-cell aplasia was not required for durable responses."

**Suggested rewrite (step 11 caption):**
> "Day 28 and beyond. Response is assessed at about a month. In some patients the engineered cells stay detectable for years. Normal B cells are usually gone for months — in most patients they eventually grow back, and the remission can outlast their absence."

And in the spec, replace the note with: "a note that normal B cells are absent for months and, in most patients, return later — the remission does not depend on their staying away."

---

### 4. The US list-price range is contradicted by the source cited for it

**Location and quote (L309):** "reported list prices for the approved products run to roughly **$400,000–$500,000** in the US before hospitalization and care, which can push the total past a million[^29]"

**What's wrong:** [^29] is Pulice & Schulman's paper about price *escalation*, and its own Table 1 reports that 2025 wholesale acquisition costs run from **$462,000 (Tecartus) to $593,533 (Kymriah)** — the top of the draft's range is below the bottom half of the current distribution. The $373,000–$475,000 figures are the 2017–2022 *launch* prices. Citing an escalation paper for a stale range is the worst of both worlds. Separately, the paper does not address total cost of care, so it cannot support "can push the total past a million".

**Evidence:** Pulice TD, Schulman KA. CAR-T Therapy: Escalating Costs in an Expanding Market. *Health Management, Policy and Innovation* 2026;11(1), published 18 Feb 2026 — https://hmpi.org/2026/02/18/car-t-therapy-escalating-costs-in-an-expanding-market/ : "the launch price ranged from $373,000 to $475,000 for these products over the period of 2017–2022"; Table 1 2025 WAC $462,000–$593,533.

**Suggested rewrite:**
> "Making a product from each patient is slow, expensive — US list prices launched between $373,000 and $475,000 and have climbed every year since, reaching roughly $460,000 to $594,000 by 2025, before any of the hospitalization and monitoring that surrounds the infusion[^29] — and impossible for people too sick to wait."

If you want to keep the "past a million" line (it is true and worth saying), cite a cost-of-care source rather than [^29]; the cleanest option is a sentence labeled as an estimate: "Published estimates of the total cost of an episode of care run from roughly $500,000 to over $1 million."

---

### 5. Quiz Q1, fourth distractor: wrong cell type

**Location and quote (L334):** "Wrong: CAR-T cells kill by the same contact mechanism as **natural killer T cells**, with perforin and granzymes."

**What's wrong:** "Natural killer T cells" (NKT cells) are a specific, small, CD1d-restricted lineage — not what is meant, and a cell type the book has not introduced. The intended comparison is either natural killer (NK) cells (Chapter 2) or, better, ordinary cytotoxic T cells (Chapter 5), whose kill mechanism this chapter explicitly reuses ("same visual grammar as the Chapter 5 kill figure", L61).

**Suggested rewrite:**
> "- [ ] Because CAR-T cells kill by starving tumor cells rather than by contact — Wrong: a CAR-T cell kills exactly the way the killer T cell of Chapter 5 does, by forming a contact and delivering perforin and granzymes."

---

### 6. "The original leukemia trial" is the wrong description of [^7]

**Location and quote (L182):** "but close to half of **the children in the original leukemia trial**, who carried huge disease burdens and were graded on a stricter scale.[^7]"

**What's wrong:** [^7] is Maude et al. 2018 — **ELIANA**, the 25-centre global *pivotal* trial (75 infused patients), which the chapter itself correctly introduces two pages earlier as "the pivotal global trial of tisagenlecleucel" (L164). "The original leukemia trial" denotes Grupp et al. 2013 ([^6]) — two children. The number being quoted (grade 3/4 CRS in 46–47%) is ELIANA's, so the citation is right and only the label is wrong; but as written the sentence tells the reader that a near-50% severe-CRS rate came from a two-patient pilot.

**Evidence:** [^7] PMID 29385370: "a phase 2, single-cohort, 25-center, global study… 75 patients received an infusion… The cytokine release syndrome occurred in 77% of patients, 48% of whom received tocilizumab." (Grade 3/4 CRS 46%, Penn grading scale.)

**Suggested rewrite:**
> "…but close to half of the children in the pivotal pediatric trial, who carried huge disease burdens and were graded on the stricter Penn scale.[^7]"

---

### 7. TCR-T is described as receiving "a natural T-cell receptor" — false for the only approved product — and the fatal off-target history is missing

**Locations and quotes:**
- L293: "The cell receives **a natural T-cell receptor**, cloned from someone whose immune system recognized the target. **Because it is a real TCR**, it reads peptides in the MHC groove"
- Comparison table L297: "A **natural** T-cell receptor from another person, cloned in"
- Glossary L377: "A T cell engineered with a **natural** T-cell receptor cloned from someone whose immune system recognized a particular tumor peptide."

**What's wrong (two things, one fix):**
1. Afamitresgene autoleucel — the one approved TCR-T, and the chapter's own example — does not carry a natural TCR. It carries an **affinity-enhanced** receptor: Adaptimmune's platform is literally named SPEAR, "specific peptide enhanced affinity receptor", and the FDA approval summary describes "a high-affinity and specific TCR targeted against a MAGE-A4 230–239 peptide, GVYDGREHTV, presented by HLA-A*02". Nearly every clinical TCR-T product is affinity-matured, because natural tumor-reactive TCRs are usually too weak to be therapeutic — which is a genuinely interesting point the chapter has room for.
2. Because affinity enhancement breaks the specificity that thymic selection guaranteed, it has killed patients. An affinity-enhanced MAGE-A3 TCR cross-reacted with an unrelated peptide from **titin** in cardiac muscle and killed two patients from cardiogenic shock; a different MAGE-A3 TCR cross-reacted with MAGE-A12 in brain and caused two fatal neurotoxicities. This is the exact mirror image of the HER2 CAR death the chapter already tells so well — and omitting it leaves the reader with the impression that "a real TCR" is inherently safer than a CAR, which is the opposite of the historical record.

**Evidence:**
- FDA Approval Summary: Afamitresgene Autoleucel… (PMC12316539); Hong DS et al., *Nat Med* 2023;29:104–114 (phase 1, ADP-A2M4).
- Linette GP et al. Cardiovascular toxicity and titin cross-reactivity of affinity-enhanced T cells in myeloma and melanoma. *Blood* 2013;122:863–871 — PMID 23770775.
- Morgan RA et al. Cancer regression and neurological toxicity following anti-MAGE-A3 TCR gene therapy. *J Immunother* 2013;36:133–151 — PMID 23377668.

**Suggested rewrite (L293, and matching edits to the table cell and glossary entry):**
> "**{{tcr-t|TCR-T}} therapy** splits the difference. The cell receives a T-cell receptor cloned from someone whose immune system recognized the target — usually with its grip on the target deliberately strengthened in the laboratory, because natural tumor-reactive receptors are often too weak to be useful. Because it is a TCR, it reads peptides in the MHC groove and can therefore see *intracellular* proteins.
>
> That is the point, and it has two prices. The receptor only works in people with the matching {{hla|HLA}} type. And strengthening a receptor's grip removes the one guarantee a natural TCR carries — that it survived the thymus. Two trials of affinity-enhanced receptors against the testis antigen MAGE-A3 learned this the hard way: one receptor also recognized a fragment of titin, a muscle protein, and two patients died of heart failure; another recognized a related protein in the brain, and two patients died of neurological injury.[^new-a][^new-b] Every engineered receptor since has been screened against the human peptide repertoire for exactly this."

Table cell: "A T-cell receptor cloned from another person, usually affinity-enhanced in the laboratory".
Glossary: "…engineered with a T-cell receptor cloned from someone whose immune system recognized a particular tumor peptide, usually with its binding strength increased in the laboratory."

---

### 8. Figure `ch10-journey`: the day counter runs backwards between steps 7 and 8

**Location and quote (spec L129–130, captions L146–147):**
- step 7 — "**Day −4**: shipping back, frozen."
- step 8 — "**Days −5 to −3** (shown in the hospital zone, overlapping): lymphodepleting chemotherapy"

**What's wrong:** The figure's defining element is "a persistent DAY COUNTER in large numerals at top-left" on "a thin progress rail" (L118). A stepper that advances from Day −4 to Day −5 and then back to Day −3 will read as a bug, and will make a reader who is counting — which is precisely the reader this figure is built for — distrust the whole timeline. The clinical reality is simply that the two things overlap: the product travels while the patient is being lymphodepleted.

**Suggested rewrite:** make the chronology monotonic by swapping the two steps and letting one of them own the overlap explicitly:
- step 7 → "**Days −5 to −3**, hospital: lymphodepleting chemotherapy — fludarabine and cyclophosphamide; the patient's existing white cells visibly thin out. *Meanwhile*, in the facility zone, the frozen product is on its way back." (Draw the plane glyph on this step, in the facility lane, so the overlap is visual rather than numeric.)
- step 8 → "**Day −1**: the frozen product arrives at the hospital and is thawed at the bedside."

That also fixes a smaller realism problem: the product must be on site before lymphodepletion is committed to, so showing arrival *before* Day 0 rather than at Day −4 is both tidier and truer.

---

## Should fix

### 1. The secondary-cancer numbers: "patients" should be "doses", and "a small number" is knowable

**Location and quote (L229):** "22 reported cases of T-cell malignancy among more than **27,000 patients** treated in the US since 2017, with the CAR gene itself detectable in the malignant cells in **a small number** of those cases"

**What's wrong:** Verdun & Marks give the denominator as **doses administered**, not patients (patients can receive more than one dose, and the 22 reports came from trials as well as postmarketing, so the 22 are not strictly a subset of the US doses). And the "small number" is a published, citable **3** — in a chapter that is otherwise scrupulously specific, vagueness here reads as hedging rather than precision.

**Evidence:** Verdun N, Marks P. *N Engl J Med* 2024;390:584–586 (PMID 38265704, doi:10.1056/NEJMp2400209): 22 cases reported to the FDA as of 31 Dec 2023; more than 27,000 doses of the six approved products administered in the US; in 3 cases genetic sequencing found the CAR transgene in the malignant clone; of the 14 cases with adequate data, all arose within two years, roughly half within one year.

**Suggested rewrite:**
> "The agency's own account of the evidence: 22 cases of T-cell malignancy reported to the FDA by the end of 2023, against more than 27,000 doses of the approved products given in the US since 2017. In **three** of the 22, sequencing found the CAR gene inside the malignant cells — which means that in those three, the vector insertion plausibly contributed. Of the cases with enough data to judge, all appeared within two years of treatment, about half within one.[^15]"

### 2. The NOT gate / iCAR claim is uncited

**Location and quote (L278):** "A NOT gate adds an inhibitory receptor that vetoes killing when a healthy-tissue antigen is present. Both work impressively in mice."

[^17] (Roybal, *Cell* 2016) is attached to the AND-gate sentence and covers synNotch only; the NOT-gate sentence has no source, and the figure spec builds a whole interaction mode on it (rule 4, "B NOT C", L262). Add the primary paper, which is also pleasingly from the same lab as [^3] and [^12]:

> Fedorov VD, Themeli M, Sadelain M. PD-1- and CTLA-4-based inhibitory chimeric antigen receptors (iCARs) divert off-target immunotherapy responses. *Sci Transl Med* 2013;5:215ra172. doi:10.1126/scitranslmed.3006597 (PMID 24337479)

One nuance from that paper worth a clause, because it changes what a NOT gate promises: "The initial effect of the iCAR is **temporary**, thus enabling T cells to function upon a subsequent encounter with the antigen recognized by their activating receptor." So an iCAR postpones and restrains rather than permanently vetoes — suggest "**temporarily** vetoes killing" in the narrative, and in the figure spec add to the `WRONG to show` list: "the inhibitory receptor as a permanent off-switch — its effect is temporary, and the cell recovers."

### 3. satri-cel: the toxicity is missing, and the approval is conditional

**Location and quote (L273):** "In June 2026, China's regulator **approved** satricabtagene autoleucel… Median progression-free survival was 3.25 months, versus 1.77 months… That is a genuine randomized win in a setting with almost nothing to offer"

The PFS numbers are exactly right, and the "both halves of that sentence are true" framing is excellent. Two omissions pull against the chapter's own no-hype rule:
- **Toxicity.** In CT041-ST-01, grade ≥3 treatment-emergent adverse events occurred in **87 of 88 (99%)** satri-cel patients versus 30 of 48 (63%) on physician's choice, and CRS occurred in **84 of 88 (95%)** ([^20], PMID 40460847). A first-in-class solid-tumor CAR-T whose toxicity profile is near-universal is a material part of "be precise about what the trial behind it showed".
- **Conditional approval.** The NMPA granted satri-cel a *conditional* approval for CLDN18.2-positive, HER2-negative advanced gastric/GEJ adenocarcinoma after ≥2 prior lines, on 22 Jun 2026, with confirmatory requirements attached (CARsgen announcement; FiercePharma, 2026-06; OncLive, 2026-06). "Approved" without "conditionally" overstates the regulatory standing of the field's landmark result.

**Suggested rewrite:**
> "In June 2026, China's regulator granted **conditional** approval to satricabtagene autoleucel… Be precise about what the trial behind it showed. Median progression-free survival was 3.25 months, versus 1.77 months with the physician's choice of standard treatment; 22% of patients had a confirmed response, against 4%. Nearly every treated patient — 95% — had cytokine release syndrome, and 99% had a grade 3 or worse adverse event of some kind.[^20] That is a genuine randomized win in a setting with almost nothing to offer, bought at a real price, and it is a matter of weeks, not the decade-long remissions of CD19. All of that is true at once."

### 4. "Roughly half of lymphoma patients who respond will eventually relapse" understates it

**Location (L175, key-idea box).** By the chapter's own ZUMA-1 figures: 83% responded, and responses were ongoing in 31% of all treated patients at five years — so 31/83 ≈ **37%** of responders were still in response, i.e. about **60%** had relapsed or lost response. Suggest "**Around 60%** of lymphoma patients who respond will eventually relapse, and most myeloma patients will." The sentence loses nothing and gains accuracy.

### 5. Emily Whitehead received etanercept as well as tocilizumab

**Location and quote (L186):** "They gave it. Her fever broke within hours"

[^6] (Grupp et al., PMID 23527958) reports: "cytokine blockade with **etanercept and tocilizumab** was effective in reversing the syndrome and did not prevent expansion of chimeric antigen receptor T cells or reduce antileukemic efficacy." The chapter is citing this sentence, so the single-drug version is a small but real compression of its own source — and the fact that the team threw two cytokine blockers at it is part of what makes the story a story. Suggest: "They gave it, together with an anti-TNF antibody. Her fever broke within hours — and, crucially, it did not stop the CAR-T cells working.[^6] Tocilizumab, not the anti-TNF, is what became standard."

### 6. "Patients stop making their own antibodies" is too absolute

**Location and quote (L220):** "Patients stop making their own antibodies and need regular immunoglobulin infusions, sometimes for years."

CD19 is lost as B cells mature into long-lived plasma cells, which is why CD19 CAR-T does *not* abolish antibody production: pre-existing plasma-cell-derived IgG, including vaccine titers, often persists, and clinically significant hypogammaglobulinemia requiring replacement is common but far from universal. (This is also the mechanistic reason BCMA CAR-T, which does hit plasma cells, causes deeper hypogammaglobulinemia than CD19 CAR-T — a contrast worth one clause given the chapter covers both targets.)

**Suggested rewrite:**
> "Many patients' antibody levels fall far enough that they need regular immunoglobulin infusions, sometimes for years — though not all do, because the long-lived plasma cells that make most of our standing antibody have already switched CD19 off, and survive. It is tolerable only because antibodies can be replaced from donors."

### 7. "Infections are a leading cause of death unrelated to relapse" is uncited — and there is a perfect source

**Location (L218).** The claim is correct and important (it is the chapter's best "the least discussed toxicity" beat), but it carries no citation, while nearby claims carry three. Add:

> Cordas Dos Santos DM, Tix T, Shouval R, et al. A systematic review and meta-analysis of nonrelapse mortality after CAR T cell therapy. *Nat Med* 2024;30:2667–2678. doi:10.1038/s41591-024-03084-6 (PMID 38977912)

It supplies quotable numbers that would strengthen the paragraph: across 7,604 patients, non-relapse mortality was 6.1% in large B-cell lymphoma, 8.0% in myeloma and 10.6% in mantle-cell lymphoma; of 574 non-relapse deaths, **50.9% were from infection**, while CRS, ICANS and HLH together accounted for only 11.5%. Suggested addition: "Across nearly 8,000 treated patients, infection caused more than half of all deaths that were not from the cancer coming back — while CRS and neurotoxicity together caused about one in nine."

### 8. The CAR-NK claims are uncited

**Location (L309):** "{{car-nk|CAR-NK cells}} appear to cause far less cytokine release syndrome and little graft-versus-host disease… at the cost of persisting for weeks rather than years."

Correct and appropriately hedged, but unsourced in a chapter where everything else is sourced. The canonical first-in-human report is:

> Liu E, Marin D, Banerjee P, et al. Use of CAR-transduced natural killer cells in CD19-positive lymphoid tumors. *N Engl J Med* 2020;382:545–553. doi:10.1056/NEJMoa1910607 (PMID 32023374)

### 9. Figure `ch10-crs`: the "lag" claim needs tightening, and three timings disagree with each other

**Locations and quotes:**
- L200: "IL-6 (coral) — rises after the T-cell curve, **with a lag of a day or so. The lag must be visible; it is the point.**"
- L199: CAR-T curve "peaks **day 5–9**"
- `ch10-journey` L132: CAR-T cells "**peaking around day 7–14**"
- `ch10-journey` L132: "A shaded band labeled 'when fever usually starts' sits over **days 1–7**"
- `ch10-journey` step 10 caption L149: "Fever, in most patients, starts somewhere in **this window** [Days 3 to 14]"

**What's wrong:** (a) The IL-6 lag is relative to the *onset* of CAR-T expansion, not its peak — CRS classically coincides with the expansion peak, which the chapter's own [^12] states: "CRS usually occurs within days of T cell infusion **at the peak of CAR T cell expansion**." As written, "rises after the T-cell curve" invites a builder to draw IL-6 peaking after the CAR-T peak, which would be wrong. (b) The CAR-T peak is given as day 5–9 in one figure and day 7–14 in the other. (c) The fever band (days 1–7) and the caption that describes it (days 3–14) do not match; median CRS onset is ~2–3 days for axi-cel and tisa-cel and ~7 days for cilta-cel, so days 1–7 is the better band and the caption should follow it.

**Suggested rewrite (spec L200):** "IL-6 (coral) — begins to climb a day or so *after the CAR-T curve starts rising*, and peaks alongside it, not after it. The offset at the start is the point: the engineered cells move first, and the host's cytokines follow." Then harmonize the CAR-T peak to "day 7–14" in both figures, and change step 10's caption to "Fever, in most patients, starts in the first week."

### 10. "The fever is the drug working" needs one honest caveat

**Locations:** figure title L189 ("The fever is the drug working"); step caption L149 ("Fever… it is the sound of the therapy working").

This is a beautiful line and it is *mostly* true — but as a standalone claim it is the kind of oversimplification that becomes false, in two ways that matter to a reader who may be a patient's partner:
- **CRS severity does not predict benefit.** Patients with no CRS at all can have complete, durable responses; obe-cel's whole design premise ([^31], and the chapter's own deep-dive) is that you can cut severe CRS to 2.4% *without* losing remission rates. If fever were the sound of the drug working, obe-cel would not work.
- **Fever after CAR-T is also how infection and HLH present**, in a profoundly neutropenic, lymphodepleted patient — which is why every fever in this window triggers an infection workup, and why infection is the leading non-relapse cause of death (should-fix 7).

The chapter already has the material to say this in one sentence. Suggested addition after L186, and a shortened version in the figure caption:
> "One caution about that framing: a fever here is not a progress bar. Patients who never spike one can still go into complete remission, and the newest products were designed to cause less of it without working less well. A fever in a lymphodepleted patient is also how infection announces itself — which is why it is investigated, not celebrated."

### 11. The afami-cel paragraph is now a cycle behind

**Location (L293).** The chapter is dated October 2026. Tecelra's August 2024 approval was an **accelerated** approval; on 22 Jun 2026 US WorldMeds announced **full (traditional) FDA approval with an expanded indication extending it to patients aged 12 and older**, supported by a larger SPEARHEAD-1 dataset (137 patients, ORR 43.8%, CR 3.6%, median duration of response 5.3 months, ~32% of responders maintaining response ≥24 months). Suggest adding one clause — "approved on accelerated terms in August 2024 and confirmed, with the indication extended to adolescents, in June 2026" — and either keeping the [^22] cohort-1 numbers with the phrase "in the trial that supported it" or quoting the larger confirmatory dataset. Source: US WorldMeds press release, 22 Jun 2026 (PR Newswire). Note the same point does *not* apply to lifileucel, which also holds an accelerated approval; if you mention the status for one, mention it for both (one word: "on accelerated terms").

### 12. [^27] is doing the work of seven sources and carries no links

**Location (L413).** One footnote bundles seven distinct regulatory events and is cited at six different places in the text (L223, 225, 238, 273, 291, 293). A reader who clicks it after "the first CAR-T approval anywhere for a solid tumor came nearly a decade later, in June 2026, in China" lands in a 180-word block and has to find the relevant clause themselves — and none of the seven items has a URL, which breaks PLAN §2's "every specific number should be traceable". Suggest splitting into four linked entries (this is the one place where *increasing* the source count is the right call):

- **FDA approvals of cell therapies, 2024–2025** — Amtagvi (lifileucel), accelerated approval 16 Feb 2024; Tecelra (afamitresgene autoleucel), accelerated approval 2 Aug 2024 and full approval with expanded indication 22 Jun 2026; Aucatzyl (obecabtagene autoleucel), 8 Nov 2024; Breyanzi (lisocabtagene maraleucel) for relapsed/refractory marginal zone lymphoma after ≥2 prior lines, 4 Dec 2025 (ORR 95.5%, CR 62.1%, TRANSCEND FL). fda.gov/drugs/resources-information-approved-drugs
- **FDA safety and risk-management actions** — Drug safety communication requiring a boxed warning for T-cell malignancies on BCMA- and CD19-directed autologous CAR-T products, 18 Apr 2024 (Abecma, Breyanzi, Carvykti, Kymriah, Tecartus, Yescarta); elimination of the REMS for the approved autologous CAR-T products, 26 Jun 2025, with the proximity recommendation reduced from 4 weeks to 2 and the driving restriction from 8 weeks to 2. fda.gov/vaccines-blood-biologics/safety-availability-biologics
- **China NMPA / CARsgen** — conditional approval of satricabtagene autoleucel for CLDN18.2-positive, HER2-negative advanced gastric or gastro-oesophageal junction adenocarcinoma after ≥2 prior lines, announced 22 Jun 2026.
- **Company-reported, not peer-reviewed** — Arcellx/Kite (Gilead) iMMagine-1 interim data for anitocabtagene autoleucel presented at ASH, December 2025 (117 patients, ORR 96%, sCR/CR 74%, median follow-up 15.9 months); FDA PDUFA target action date 23 December 2026.

Note the attribution fix embedded above: the iMMagine-1 data are **Arcellx's** (co-developed with Kite/Gilead), not "Kite/Gilead's" as [^27] currently has it.

### 13. Morgan 2010: "concluded" overstates what the authors wrote

**Location and quote (L240):** "the investigators **concluded** the cells had recognized low levels of HER2 on normal lung tissue.[^14]"

The paper says: "**We speculate** that the large number of administered cells localized to the lung immediately following infusion and were triggered to release cytokine by the recognition of low levels of ERBB2 on lung epithelial cells" (PMID 20179677). Given how load-bearing this case is in the chapter, the hedge should survive the retelling. Suggested: "the investigators' interpretation — offered as a hypothesis, not a proof — was that the cells had recognized low levels of HER2 on normal lung tissue.[^14]"

Two optional specifics from the same paper that would strengthen the sentence: the dose was **10^10 cells**, and the construct was a **third-generation** CAR (CD28 + 4-1BB + CD3ζ) built on trastuzumab's binder — which ties the case directly to the deep-dive's "more signal is not better signal".

### 14. The glioblastoma product is not a plain CAR

**Location and quote (L280):** "CAR-T cells infused into the fluid spaces of the brain produced tumor regression within days in all three patients of a first-in-human glioblastoma study — though it lasted in only one.[^18]"

Accurate as to the result, but CARv3-TEAM-E is a CAR against EGFRvIII that *additionally* secretes a T-cell-engaging antibody against wild-type EGFR — i.e. it combines this chapter's mechanism with Chapter 9's bispecific engager, which is both a nice callback and the likely reason it worked against a heterogeneous tumor. One clause: "…cells that carry a CAR against a mutant form of EGFR *and* secrete a bispecific engager of the kind Chapter 9 described, infused into the fluid spaces of the brain…"

### 15. Two citation years are off by one

[^19] (Monje) and [^30] (Steffin) are both listed as *Nature* **2024** but both appear in volume 637, the January **2025** issues (they were published online in late 2024). The canonical citations are *Nature* 2025;637:708–715 and *Nature* 2025;637:940–946. Trivial, but the chapter's bibliography is otherwise clean.

### 16. Add the April 2024 date to the BCMA line-of-therapy expansions

**Location (L225):** "both BCMA products moved into earlier lines of myeloma treatment" — this happened in **April 2024** (Carvykti to ≥1 prior line on 5 Apr 2024, Abecma to ≥2 prior lines on 4 Apr 2024). The sentence is a list of dated events; this is the only undated member.

---

## Optional

- **Name ide-cel once.** PLAN §3 lists "BCMA in myeloma" for this chapter and the text says "both BCMA products" twice without ever naming idecabtagene vicleucel. One parenthetical in the myeloma paragraph ("the two approved BCMA products, idecabtagene vicleucel and ciltacabtagene autoleucel") closes the gap and makes the later "both BCMA products" legible.
- **"within two months" → "about two months".** [^6] says the CD19-negative relapse occurred "approximately 2 months after treatment"; L242 says "within two months".
- **In vivo lupus, one more specific.** [^26] is five patients given a CD8-targeted lipid nanoparticle (HN2301) carrying CD19 CAR mRNA, with complete depletion of circulating B cells and SLEDAI falling by up to 20 points, no neurotoxicity and no severe adverse events. Saying "five patients" rather than "a few patients" makes the "roughly ten patients behind it" arithmetic in the next sentence auditable, which is the whole rhetorical point.
- **The in vivo myeloma trial had a death.** [^25]: one patient developed grade 1 ICANS and died of spinal-cord compression from an extramedullary lesion. Not treatment-attributed, so omitting it is defensible — but a sentence noting it would make "read anything about it with the skepticism that number deserves" land harder.
- **Cite [^30] for the suicide switch.** L282 says suicide switches have "been used in patients" without a source; the chapter already cites the paper that demonstrates it — Steffin's CRS was "rapidly ameliorated by activation of the inducible caspase 9 safety switch". Adding [^30] to that sentence costs nothing.
- **One lovely nuance available for a go-deeper.** "MHC loss is irrelevant to it" (L102) is true for recognition, but Larson et al. (*Nature* 2022;604:563–570, PMID 35418687) showed that CAR-T killing of *solid* tumor cells — though not leukemia cells — requires intact interferon-γ receptor signaling in the target. So the tumor's "deafness to interferon" from Chapter 7 can blunt a CAR after all, in exactly the setting the chapter says is hardest. This would be a strong addition to "Why solid tumors have been so much harder".
- **Eshhar 1989, strictly.** The 1989 construct was a two-chain chimera (antibody V domains fused to TCR α/β constant domains) directed at a hapten, not a single-chain scFv–ζ CAR; the single-chain form came in 1993. The narrative handles this gracefully ("Today the molecule is a chimeric antigen receptor"), but the deep-dive's "First generation (**late 1980s**–2000s): binder + CD3ζ" dates a design to a paper that did not use it. "First generation (1993 onward)" or "first generation (from the early 1990s)" would be exact.
- **Length.** Narrative is ~3,860 words against PLAN's 2,000–3,000; go-deeper boxes ~1,560 against 800–1,500; figure specs ~3,200. Not a science issue, and the density is earned — flagging only because PLAN asks contributors to surface conflicts with the guide.

---

## Citation consolidation

Honest finding first: **all 31 sources exist, all 31 are cited at least once, and I found no [^n] attached to a sentence it does not support.** The count exceeds PLAN's "8–20 sources" guide, but very little of it is redundancy — it is 31 specific, checkable claims. So the recommendation is *not* to cut to 20 by deleting evidence. Two targeted moves get most of the way there without losing traceability:

1. **Split, don't merge, [^27]** (should-fix 12). It is the only genuine citation-integrity problem in the chapter: seven events, six call sites, zero URLs. Splitting it into the four linked entries above raises the nominal count but is the single highest-value change in this section.
2. **Fold [^28] into the FDA/institutional group.** The CHOP press release supports exactly one clause ("ten years later her physicians said publicly that they believed she was cured"); it belongs with the other non-journal announcements rather than as a standalone numbered source. Net: −1.
3. **Trim the multi-cite stacks.** Three places stack citations where one suffices once the numbers are corrected:
   - L216 ICANS `[^7][^8][^9]` → after the must-fix 2 rewrite, two sources carry the two products named.
   - L182 severe-CRS `[^8][^10][^31]` → these three *are* the range (11–13%, 1.1%, 2.4%), so keep; this one is justified.
   - L159 "the dose is not the dose" `[^5][^11]` → [^11] alone carries the decade-long persistence point.

That lands the chapter at roughly 22–24 bibliography entries with *better* traceability than 31, plus the three new sources recommended above (Fedorov 2013 for NOT gates, Cordas dos Santos 2024 for infection mortality, Liu 2020 for CAR-NK) and the two for the TCR-T safety history (Linette 2013, Morgan 2013). If a hard ceiling of ~20 is required, the three lowest-information entries relative to their claims are [^28] (press release, foldable), [^13] (Orlando — a 3-sentence research letter whose content could be absorbed into the [^6] sentence) and [^2] (Kershaw — though I would keep it: it is the only hard evidence for the "decade of failure", and the chapter's handling of its Fcγ-chain detail is one of its most careful moments).

---

## Verified correct (compact)

**Attributions and history** — Gross/Waks/Eshhar 1989, Weizmann, "non-MHC-restricted manner" quoted verbatim · Maher/Sadelain 2002, MSKCC, CD28 proximal to CD3ζ in a single chain, killing + vigorous proliferation · Imai/Campana 2004, St. Jude, anti-CD19-BB-ζ, superior expansion and persistence vs no-costim · Porter/June 2011 NEJM, August 2011, refractory CLL, ~1.5×10⁵ cells/kg ≈ 10⁷ cells, >1000-fold expansion, CR, cells persisting at 6 months with CAR still expressed · Kershaw 2006: abundant for 2 days, barely detectable at 1 month, no tumor reduction (and the Fcγ-chain caveat handled correctly) · Rosenberg/NIH 1980s origin of TIL · Carl June, his daughter's juvenile arthritis, and tocilizumab from the rheumatology pharmacy · Emily Whitehead: April 2012, age 6, after two relapses, first child treated, CHOP's 10-year "cure" statement (2022).

**Trial numbers** — ELIANA 81% remission within 3 months, all MRD-negative, 76% alive at 12 months; CRS 77%, grade 3/4 ~46% on the Penn scale · ZUMA-1 83% ORR / 58% CR / 31% ongoing at median 63 months / 42.6% 5-year OS / polyclonal B-cell recovery in 91% / protracted aplasia not required · ZUMA-7 4-year OS 54.6% vs 46.0%, second line vs salvage chemo + ASCT · CARTITUDE-4 12-month PFS 75.9% vs 48.6%, HR 0.26 ("roughly three-quarters") · Melenhorst 2022: two CLL patients treated 2010, >10 years in remission, CAR-T detectable, late dominance of CD4⁺ CAR-T with cytotoxic features · FELIX/obe-cel 77% remission, grade ≥3 CRS 2.4%, grade ≥3 ICANS 7.1%, intermediate-affinity/fast-off-rate premise · CT041-ST-01 median PFS 3.25 vs 1.77 months · Rohaan 2022 phase 3: 49% vs 21% response, 7.2 vs 3.1 months PFS, 86% anti-PD-1-refractory, grade ≥3 AEs in all TIL patients, toxicity mainly from lymphodepletion/IL-2 · SPEARHEAD-1: 19/52 (37%) overall, 39% in synovial sarcoma, HLA-A*02 + MAGE-A4 · Mackensen 2022: 5 lupus patients, DORIS remission in all by 3 months, anti-dsDNA seroconversion, mild CRS, naive non-class-switched B cells returning at ~110 days · Müller 2024: 15 patients across SLE/myositis/systemic sclerosis, all SLE in DORIS remission, all myositis with ACR-EULAR major response, immunosuppression stopped in all, grade 1 CRS in 10, B-cell aplasia 112±47 days · An 2026: 5 patients, no apheresis/manufacturing/lymphodepletion, 4/5 responses incl. 3 sCR, grade ≥3 AE in all, 3 grade 3 CRS, stopped early · Steffin: GPC3 CAR alone 0 objective responses, IL-15-armored 33% response / 66% disease control, more CRS, iCasp9 switch · Choi: 3/3 rapid radiographic regression, transient in 2 · Monje: 4 major volumetric reductions, 9 with neurological benefit, 1 CR ongoing >30 months · Hamilton: 724 patients, 1 secondary T-cell lymphoma, EBV-positive, clonal-hematopoiesis-associated, no oncogenic vector integration found · Orlando: CD19 mutations and LOH producing a truncated protein lacking a functional transmembrane domain → loss of surface antigen · Morgan 2010: 10¹⁰ cells, respiratory distress within 15 minutes, death at 5 days, cytokine storm.

**Regulatory** — tisagenlecleucel and axi-cel 2017 · lifileucel 16 Feb 2024, first cell therapy of any kind for a solid tumor · boxed warning for T-cell malignancies, 18 Apr 2024, on the six then-approved CD19/BCMA products · afami-cel 2 Aug 2024, first engineered-TCR T-cell therapy · obe-cel 8 Nov 2024 · REMS eliminated 26 Jun 2025, proximity 4→2 weeks and driving 8→2 weeks, with the pre-2025 restrictions (certified centers, tocilizumab on site, 2 hours' proximity for 4 weeks, no driving for 8) stated correctly · liso-cel for marginal zone lymphoma 4 Dec 2025, first for that indication, ORR 95.5% · satri-cel NMPA 22 Jun 2026, first solid-tumor CAR-T approval anywhere, CLDN18.2, gastric/GEJ, ≥2 prior lines · anito-cel company-reported December 2025 with a US decision around end-2026 · "every CAR-T product approved anywhere today is second generation" — checked against the US/EU products plus relma-cel, eque-cel, ina-cel, zevor-cel, satri-cel, ARI-0001 and NexCAR19; holds, including bivalent cilta-cel (two binders, one costimulatory domain).

**Mechanism and figures** — CAR domain order outside→inside (scFv → hinge → transmembrane → costimulatory → CD3ζ) correct, with CD3ζ C-terminal and the costimulatory domain membrane-proximal; CD3ζ = signal 1, CD28/4-1BB = signal 2; three ITAMs on CD3ζ correct · costimulation-only tail fails to trigger killing — correct · generation definitions (1st = ζ alone; 2nd = one costim; 3rd = two costim; 4th = armored/TRUCK) correct, as is "no third-generation product is broadly approved" · CD28 vs 4-1BB kinetics correctly assigned (axi-cel/brexu-cel CD28; tisa-cel/liso-cel 4-1BB) · hinge-length/epitope-height relationship correct · surfaceome "a few thousand of some twenty thousand" correct (~2,900 in silico human surfaceome) · CRS cascade correct and matches [^12] exactly, including IL-6, IL-1 *and* nitric oxide from recipient macrophages, tumor burden as the dominant severity driver, steroids blunting the therapy where tocilizumab does not, and the explicit "WRONG to show" list (CAR-T as main IL-6 source; CRS before expansion; tocilizumab killing CAR-T; ICANS as direct neuronal attack) · ICANS correctly described as less mechanistically settled, barrier-leak-associated, poorly responsive to IL-6 blockade, steroid-treated · synNotch AND gate exactly as in Roybal 2016, including that it requires new gene expression and takes hours · logic-gate trade-off (narrower rule → easier single-antigen escape) correct · lymphodepletion rationale (IL-7/IL-15 competition, Treg depletion, cytopenia toxicity) correct · "the dose is not the dose" correct · lentiviral/retroviral vector description, permanence of integration, and the link to the insertional-oncogenesis question correct · manufacturing arc (leukapheresis 3–4 h, bead activation of resting vs dividing T cells, expansion to hundreds of millions, release testing incl. sterility/identity/potency/transduction, batch failures, cryopreservation, 10–100 mL infusion over minutes, in-patient expansion peaking day 7–14) realistic · CAR-T/TCR-T/TIL comparison table correct on MHC-independence, intracellular visibility, HLA restriction, MHC-loss susceptibility, target number and best indication · all 34 glossary IDs referenced in the text resolve, either to this chapter's 20 definitions or to definitions in Chapters 1–9 · quiz questions 2, 3 and 4 and all their distractor explanations are correct (only Q1's fourth distractor needs the fix above).
