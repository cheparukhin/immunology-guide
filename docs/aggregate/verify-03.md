# Second-pass verification — Chapter 3, "A Library of Infinite Keys" (`content/drafts/03-adaptive.md`)

Verifier: second-pass scientific fact check, 2026-10-06. Line numbers refer to the current draft (511 lines). Scope: every claim in prose, figure specs (ch03-vdj, ch03-numbers, ch03-clonal-selection, ch03-antibody: spec/steps/data/alt), deep dives, clinic box, quiz, takeaways, glossary and sources. Primary checks used PubMed/E-utilities (abstracts of Blattman, Qi, Lythe, Wooldridge, Wardemann, Long, Amanna, Briney), Europe PMC full text (Pollard & Bijker 2021), and Amass.

## Status of the earlier review's Must-fix items (`docs/reviews/03-science.md`)

| Item | Status |
|---|---|
| M1 "B" = bone marrow | **Resolved** (L35; glossary L445). |
| M2 Briney's 10¹⁶–10¹⁸ called "possible" diversity | **Resolved** (L59, deep dive L378; the Briney rung was removed from ch03-numbers). |
| M3 clonal-selection figure: wrong cell type, "clone" mislabel | **Resolved** (spec L223–224, L239, L242: three different matching clones; panel labeled as mouse killer-T-cell data covering "all clones that fit"; the caption sentence explains the B-cell field). |

Should-fix items:
- **Resolved:** S1 (RAG cuts, repair joins: main text and figure), S2 (Wooldridge "estimated"), S4 (tetanus), S5 (honest tally), S6 (lymphocyte glossary).
- **Partly resolved:**
  - S3 ("class or subclass") was fixed at L279 and in the glossary, but not in the Anatomy hotspot (see S1 below).
  - The RAG wording survives in one deep-dive sentence (S4 below).

---

## 1. Errors (MUST fix)

None found.

---

## 2. Unsupported or weakly supported (SHOULD fix)

**S1. Anatomy hotspot still says the stem is the same "in every antibody of a given class" (ch03-antibody spec, L310)**
- Quote: "Fc stem — essentially the same in every antibody of a given class; it is the handle..."
- Problem: this is the round-1 S3 fix, not carried into the figure. It contradicts L281 of the same chapter ("its four subclasses call for help with different strength") and Chapter 8's IgG1 vs IgG4 discussion. The source is Lu 2018 [^18].
- Rewrite: "Fc stem — essentially the same in every antibody of a given class or subclass; it is the handle..."

**S2. Qi 2014's lower bound is called a "direct count" (L139, L166, L179, L188, L376, L429)**
- Quotes:
  - L139: "researchers have counted... with the most thorough count finding at least 100 million";
  - rung 6 (L166): "(direct count; a minimum)";
  - step 6 (L179): "by the most thorough direct count";
  - alt (L188): "by direct count";
  - L376: "minimums from direct measurement";
  - takeaway (L429): "by direct count".
- Problem: Qi et al. "used next-generation sequencing and nonparametric statistical analysis to *estimate a lower bound*" (abstract, PMID 25157137). The figure is a statistical extrapolation from sampled sequences, not a count. The chapter's own deep dive (L374) says this correctly ("estimated a minimum"). "Direct" is meant to contrast with Lythe's model, but it overstates the method.
- Rewrites:
  - "sequencing-based estimate (a minimum)" for rung 6, step 6 and the alt text;
  - L139: "Sequencing blood samples, researchers have estimated how many versions of one of the T-cell receptor's two protein chains a person carries...";
  - L376: "minimums from sequencing";
  - takeaway: "at least 100 million different T-cell receptors per person by sequencing-based estimates".

**S3. Maternal antibody: "so little remains after two to three months" (L398)**
- Quote: "Their half-life is about 30 to 40 days, so little remains after two to three months [^15]."
- Problem: the arithmetic doesn't support "little remains". After 60–90 days with a 30–40-day half-life, roughly 20–35% of the antibody is still present. The source makes a claim about *protection*: "maternal antibody has a half-life of around 30–40 days, so very little protection is afforded to infants from the mother beyond 8–12 weeks of age" (Pollard & Bijker 2021, PMC7754704). Protection fades because levels fall below protective thresholds, not because the antibody is gone.
- Rewrite: "Their half-life is about 30 to 40 days, so the protection they give fades over the first two to three months [^15]."

**S4. "RAG1 and RAG2 will only join..." (deep dive "Inside the cut", L362)**
- Quote: "RAG1 and RAG2 will only join a segment with a 12-letter spacer to one with a 23-letter spacer, the '12/23 rule'".
- Problem: this is the last remnant of round-1 S1. RAG pairs and cuts the two signals; joining is done by NHEJ repair. The chapter says so at L51 and L364, and the figure forbids showing RAG "gluing" (L112).
- Rewrite: "RAG1 and RAG2 will only pair, and cut, a segment with a 12-letter spacer together with one carrying a 23-letter spacer, the '12/23 rule' [^8]."

**S5. "Some countries therefore recommend adult tetanus boosters" (L394)**
- Problem: "therefore" re-creates the causal link that round-1 S4 flagged. Neither Amanna 2007 nor Pollard 2021 attributes national booster policy to the 11-year half-life. Pollard says that five or six childhood doses give lifelong protection, "and so booster doses... are not routine in most countries that can achieve high coverage."
- Rewrite: drop "therefore": "Some countries recommend adult tetanus boosters, while others consider five or six childhood doses enough for life [^15]."

---

## 3. Citation problems

**C1. [^13] (Blattman 2002) is cited for "carrying a variety of different receptors that all fit" (L147)**
- What Blattman supports: the 1 in 2 × 10⁵ frequency and the 100–200 cells per uninfected mouse ("in an uninfected mouse containing approximately 2–4 × 10⁷ naive CD8 T cells we estimate there to be 100–200 epitope-specific cells", PMID 11877489).
- What it does not support: the diversity of those precursors' receptors. The claim is true and important (round-1 M3), but needs its own source.
- Suggested addition: Moon JJ et al. *Immunity* 2007;27:203–213 (doi:10.1016/j.immuni.2007.07.007, PMID 17707129): naive epitope-specific populations of 20–200 cells per mouse, whose size "predicted the size and TCR diversity of the primary... response".
- For CD8 precursor counts, also consider Obar JJ et al. *Immunity* 2008;28:859–869 (PMID 18499487; ~80–1,200 per mouse).

No other citation problems. All 20 sources exist, and the metadata re-checked against PubMed (2, 9, 10, 11, 12, 13, 15, 17, 19) are correct.

---

## 4. Claims verified OK (claim → source)

- **Landsteiner**
  - Vienna, then Rockefeller (from 1923); haptens coupled to proteins → standard (round-1 O1 adopted).
  - The 1928 mirror-image (stereoisomer) discrimination → [^1].
- **Long 2020**: 285 patients; 100% IgG-positive within 19 days of symptom onset → [^2] abstract.
- **Background facts**
  - Annual flu vaccine updates due to antigenic drift → [^3].
  - <20,000 protein-coding genes → [^4].
  - Pauling's 1940 template theory → [^5].
- **Lymphocyte basics**
  - T for thymus; B for the bursa of Fabricius (human B cells mature in bone marrow) → standard.
  - BCR = membrane antibody; TCR never secreted; one receptor per cell "as a rule"; epitope ~a dozen-plus residues → standard.
- **Discovery of rearrangement**: Hozumi & Tonegawa 1976 (V and C apart in embryo DNA, joined in a plasmacytoma); Tonegawa's 1987 Nobel → [^6].
- **Segment counts and combinatorics**
  - ~40 V, 23 D, 6 J (IMGT IGHV 38–46 functional); IGKV 31–36/IGKJ 5; IGLV 29–33/IGLJ 4–5 → [^7] (round 1).
  - 40 × 23 × 6 = 5,520; κ 175 + λ 150 ≈ 325; 5,520 × 325 ≈ 1.8 × 10⁶.
  - ~144 segments in total, so "fewer than 200" holds.
  - ~70 heavy-chain segments (rung 1) → arithmetic.
- **Recombination mechanics**
  - D–J before V–DJ; RAG cuts and NHEJ joins (main text and figure).
  - Nibbling plus non-templated additions at seams; CDR3 at the center of the binding site.
  - Two-thirds of joins out of frame; second allele; allelic exclusion; deleted DNA lost; not germline → [^8] Roth 2014, standard.
- **New "rough multiplication" (L57)**
  - Three seams (two heavy, one light).
  - (a few × 10³)³ × 2 × 10⁶ ≈ 10¹⁶–10¹⁷, i.e. "fifteen or more zeros" → arithmetic (fair; light-chain seams carry fewer N additions, but the wording is hedged).
- **Figure ch03-vdj**
  - Frame check from actual seam lengths → ~1/3 success per attempt (sum of several trim/add variables mod 3 ≈ uniform).
  - (2/3)² ≈ 4/9 failure, correctly labeled a model property.
  - Honest duplicate tally; IGH locus ~1.25 Mb ("roughly a million letters").
- **Potential vs actual repertoire**
  - ~10¹⁵ possible TCRs; ~4 × 10¹¹ T cells; 10¹⁵ T cells ≈ 500 kg → [^9] Lythe 2016.
  - The model's distinct clonotypes are ~1 order of magnitude below naive T-cell numbers (≈10¹⁰), with lifetime mean clone size ~10 → Lythe abstract.
  - Sequencing estimates from millions to >10⁸ → [^9][^11].
  - Qi: ≥10⁸ TCRβ in naive repertoires of young adults; elderly 2–5-fold fewer → [^11] abstract.
  - 10¹⁵ / (4–4.7 × 10¹¹) ≈ 2,100–2,500, so "over 2,000 times" holds.
- **Cross-reactivity (Wooldridge 2012)**
  - One type-1-diabetes CD8 clone recognizes >10⁶ decamers.
  - RQFGPDFPTI is >100-fold more potent than the index ALWGPDPAAA and differs at 7/10 positions (re-counted: positions 1, 2, 3, 7, 8, 9, 10).
  - 20¹⁰ ≈ 1.0 × 10¹³ ("ten trillion") → 10⁶/10¹³ = 1 in 10⁷ → [^12] abstract plus arithmetic.
- **Precursors and expansion (Blattman 2002)**
  - 1 in 2 × 10⁵; 100–200 per mouse; >14 divisions in 1 week to ~10⁷ ("tens of thousands per starting cell": 10⁷/150 ≈ 67,000).
  - ~5% survive as ~5 × 10⁵ memory cells; >1,000-fold increase.
  - The figure's ~150 → 10⁷ (day ~8) → 5 × 10⁵ (day ~30) → [^13] abstract.
- **Clonal selection**: Burnet 1957, building on Jerne → [^14]. Primary response in 1–2 weeks → [^13][^15].
- **Panum (Faroe Islands)**
  - 1846 outbreak, 65 years after 1781; 7,782 inhabitants; ~6,000 cases; 98 previously infected elderly seen, none reinfected; elderly without prior measles were infected → [^16] (round 1).
- **Amanna 2007**: 45 subjects followed for up to 26 years; VZV half-life ~50 y; measles and mumps >200 y; tetanus 11 y; diphtheria 19 y → [^17] abstract.
- **Pollard & Bijker 2021** (full text)
  - Primary antibody rise over ~2 weeks.
  - Long-lived plasma cells in bone marrow make antibody "for decades".
  - Memory B cells need 3–4 days to reach protective titers.
  - Rapidly invasive Hib and MenC can cause disease despite memory.
  - Passive antibody infusion protects; maternal IgG protects "for a few months"; half-life 30–40 days (see S3).
  - Five or six childhood tetanus doses give lifelong protection → [^15].
- **Antibody structure and functions**
  - Two heavy and two light chains; identical tips; Fc; five classes (IgM, IgG, IgA, IgE, IgD); IgG the most abundant in blood and the backbone of most antibody drugs; four IgG subclasses with different effector strength → [^18] Lu 2018.
  - Neutralization, opsonization via Fc receptors, complement triggered by clustered IgG, NK-cell ADCC → [^18].
  - Size order in the antibody figure; complement pores most effective on Gram-negative envelopes; antibodies don't enter cells on their own → standard.
- **Clinic box**: monoclonal = a single kind of antibody, named after single-clone (hybridoma) origin; Fc recruitment vs blocking a signal or a T-cell brake; most approved antibody drug names end in "-mab" → standard.
- **Self-reactivity**: 55–75% of early immature B-cell antibodies are self-reactive, and most are removed at two checkpoints → [^19] Wardemann 2003 abstract.
- **What T cells see**: TCRs read peptide–MHC and can't bind free antigen (for conventional αβ T cells; "typical" hedge OK) → standard.
- **Deep dive "Inside the cut"**
  - RSS: heptamer, 12/23 spacer, nonamer; heavy-chain V and J carry 23-bp spacers, D carries 12-bp, so D cannot be skipped → [^8].
  - Hairpins opened by Artemis → P nucleotides; TdT → N nucleotides; signal joint on an excision circle → [^8].
  - RAG transposase ancestry and in-vitro transposition; oncogenic misrecombination in lymphomas/leukemias → [^8].
- **Deep dive "Counting the library"**
  - Missing-species estimators; Qi; Lythe, as above.
  - Briney: ~3 × 10⁹ heavy-chain sequences from 10 people; largely unique repertoires plus universally shared clonotypes; 10¹⁶–10¹⁸ cohort estimate including SHM under a random-pairing assumption.
  - "Rearranged antibody and TCR genes in one person exceed the human genome by >4 orders of magnitude" is a background statement in Briney's abstract, correctly introduced as "they also noted" → [^10] abstract.
- **Deep dive on affinity maturation**: Tfh-dependent germinal centers in lymph nodes and spleen; AID-driven SHM; selection by antigen capture and T-cell help; class-switch recombination preserving V regions; output of long-lived plasma cells and memory B cells; TCRs don't hypermutate → [^20] Victora & Nussenzweig 2022.
- **Quiz**: all keys correct; distractors wrong with accurate explanations.
- **Takeaways**: accurate (see S2 for "direct count").
- **Glossary**: all entries accurate; Fc-region entry correctly says "class or subclass"; lymphocyte and B-cell entries match the main text.
