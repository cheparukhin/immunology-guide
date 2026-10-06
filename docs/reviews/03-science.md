# Science review: Chapter 3, "A Library of Infinite Keys"

Reviewer: scientific review (lymphocyte development, V(D)J, B-cell biology, antibodies, memory).
Draft: `content/drafts/03-adaptive.md`. Line numbers refer to the draft as reviewed.

## Overall assessment

This is a strong, carefully sourced chapter. I checked all 20 citations (authors, titles, journals, years, volumes, pages and DOIs), and every one exists and matches. Nearly every specific number traces correctly to its source, including the IMGT segment counts, the Blattman expansion and memory numbers, Qi's ≥10⁸, Lythe's 4 × 10¹¹, 10¹⁵, 500 kg and 10¹⁰, Wooldridge's 7/10 positions and >100-fold, Wardemann's 55–75%, the Amanna half-lives, the Pollard "3–4 days" and maternal IgG half-life of 30–40 days, and Panum's 7,782 inhabitants, ~6,000 cases and 98 people. The V(D)J mechanics are correct, including the D-then-V order, the 12/23 rule, hairpins and Artemis, TdT, the excision circle and C joining at the RNA stage, as are the antibody functions.

There are three must-fix problems:
- **"B cells are named for where they grow up."** This is false: the B stands for the bursa of Fabricius.
- **Briney's 10¹⁶–10¹⁸ is described as recombinatorial "possible" diversity.** It is actually an estimate of sequence diversity in circulating repertoires across a group of people, and it includes somatic hypermutation.
- **The clonal-selection figure mixes cell types.** It drives amber B-cell dots with numbers from mouse CD8 T cells, and it calls the ~150 polyclonal precursors a single "clone".

The rest are precision fixes. None of the oversimplifications elsewhere crosses into falsehood.

---

## Must fix

**M1. "B" does not stand for bone marrow** (line 31, "They come in two main kinds, named after where they grow up.", followed by line 33, "B cells mature in the bone marrow").
- **Problem:** Read together, these lines tell the reader that B means bone marrow. T cells are named for the thymus, but B cells are named for the *bursa of Fabricius*. This chicken organ was shown to be required for antibody production by Glick, Chang & Jaap (*Poultry Science* 1956;35:224–225). In humans, B cells happen to mature in the bone marrow, a convenient coincidence. Biologists will flag this immediately.
- **Rewrite:** "They come in two main kinds. **T cells** are named for the thymus, where they mature. **B cells** were named for the bursa of Fabricius, the organ in birds where they were discovered; in humans they mature in the bone marrow, which conveniently also starts with B."

**M2. Briney's 10¹⁶–10¹⁸ is mislabeled as "possible" antibodies created at the seams.**
- **Where it appears:** line 49 ("Count everything, seams included… one estimate is 10¹⁶ to 10¹⁸ possible pairs of chains [^9]"), figure ch03-numbers rung 8 ("possible antibodies (estimate)"), step 4 ("Add the random letters at the seams… an estimated 10¹⁶ to 10¹⁸ antibodies"), the data line ("Possible paired antibodies…") and the alt text.
- **Problem:** Briney et al. did not compute recombinatorial potential. They estimated **cohort-wide heavy-chain sequence diversity**: ~10¹⁰–10¹¹ unique heavy-chain sequences pooled across 10 people, including mutated memory sequences. They then multiplied by a light-chain term, assuming random pairing, and concluded "the paired antibody diversity available to the circulating repertoire is very large, perhaps in the region of 10¹⁶–10¹⁸ unique antibody sequences" (PMC6411386; doi:10.1038/s41586-019-0879-y).
- **Why it matters:** The number therefore includes somatic hypermutation, not only seam randomness. It is not comparable to the theoretical ~10¹⁵ figure for TCRs placed beside it.
- **Main-text rewrite (line 49):** "Count everything, seams included, and the possibilities explode. For T-cell receptors, the classic estimate is about 10¹⁵ possible receptors, a million billion [^10]. Antibodies are more varied still, partly because B cells keep mutating their receptors after they are made (see Go deeper). One sequencing study put the diversity of antibodies circulating across a group of people at 10¹⁶ to 10¹⁸ different heavy–light pairs [^9]."
- **Figure fixes:** Relabel rung 8 as "antibody variety in circulation, a sequencing-based estimate (includes later mutations)". In step 4, attach only the TCR 10¹⁵ to "random letters at the seams". Fix the data line to "Estimated paired diversity of the circulating antibody repertoire (cohort of 10; includes somatic hypermutation; assumes random H/L pairing) — Briney 2019". Also update the alt text and the takeaway (line 435), which can keep "10¹⁵ or more possible".

**M3. ch03-clonal-selection uses the wrong cell type's data and calls a polyclonal response a "clone"** (spec lines 215–245; steps 3 and 5).
- **(a) Wrong cell type:** Every dot in the field is an amber B cell, but the cell-number curve comes from Blattman 2002: **naive CD8 T cells** specific for one LCMV epitope, going from 100–200 cells to ~10⁷ and then to ~5 × 10⁵ memory cells (PMID 11877489; doi:10.1084/jem.20001021). Readers will conclude that B-cell clones expand from ~150 to 10 million. That is not what the data show, and B-cell numbers are not well described by these values. The annotation "cell numbers based on a mouse virus infection" hides the mismatch.
- **(b) "Clone" mislabel:** The 100–200 precursors in Blattman are many *different* clonotypes that all recognize the same epitope. A single naive clone has only a handful of cells (Lythe 2016 estimates the lifetime-mean human clone size at "order 10"). The label "matching clone: 1 dot ≈ 100 cells → 10 million" therefore teaches something false.
- **Fixes:**
  1. Rename the left axis and scale label to "matching cells (all clones that fit)".
  2. Give the 2 matching dots *different* receptor glyphs that both fit germ A, which also reinforces "each germ offers many locks". Optionally use 3 dots.
  3. Change the chart annotation to: "Stylized. Cell numbers from killer T cells responding to a virus in mice; B-cell responses follow the same pattern with different numbers. Antibody timing from human vaccine data."
  4. Alternatively, keep the B-cell field but drop the true-scale clone numbers from the field label. Show the true numbers only on the chart, labeled as T-cell data.
  5. Update the CONTRACTION note ("memory: ~1,000× more matching cells…") to say it comes from the T-cell data.

---

## Should fix

**S1. RAG cuts but does not stitch** (line 43, "picks one D and one J, cuts out the DNA between them and stitches the ends together"; figure ch03-vdj step 2, "…cut out the DNA between them and join the ends").
- **Problem:** The joining is done by the cell's general DNA-repair machinery (non-homologous end joining), not by RAG. The deep dive (line 371) already says this correctly, so the main text contradicts it.
- **Rewrite:** "…a pair of enzymes called RAG1 and RAG2 picks one D and one J and cuts out the DNA between them; the cell's DNA-repair machinery then stitches the ends together." Make the same change in step 2.

**S2. Wooldridge's "more than a million" is an estimate, not a count of tested targets** (line 135, "One T-cell receptor tested in detail in the lab responded to more than a million different targets"; line 387, "recognized more than a million…"; ch03-numbers step 7 and the fan label).
- **Problem:** The number comes from a combinatorial peptide-library scan plus statistical sampling. The authors estimate "in the order of one million agonists… at least as good as the index peptide", with ~1.3 × 10⁶ within 100-fold of the optimal agonist (PMC3256900; doi:10.1074/jbc.M111.289488).
- **Rewrite:** "One T-cell receptor studied in detail was estimated, from lab tests and statistics, to respond to more than a million different protein fragments, snugly to a few and loosely to most [^12]." Use "was estimated to recognize" in the deep dive and in the figure.

**S3. "Constant: the same in every antibody of a given class"** (line 272; also the Anatomy hotspot, line 303).
- **Problem:** IgG has four subclasses (IgG1–4) whose stems engage Fc receptors and complement with very different strength. Chapter 8 (line 124 of 08-checkpoints.md) depends on exactly this: IgG4 or Fc-silenced IgG1 for anti-PD-1/PD-L1, versus IgG1 ipilimumab. Lu et al. [^16], the chapter's own source, stresses that the stem's instructions vary by subclass and glycosylation.
- **Rewrite:** "It is essentially the same in every antibody of a given class or subclass, whatever the tips bind." Add one sentence to the classes paragraph: "IgG itself comes in four subclasses whose stems call for help with different strength, a detail antibody-drug designers exploit (Chapters 8 and 9)."

**S4. Tetanus booster claim** (line 348, "half-life of about 11 years, which is why many countries recommend boosters for adults [^18]").
- **Problem:** The causal link is not in Amanna 2007. The chapter's own source [^15] says the opposite for many settings: "five or six doses of tetanus… in childhood provides lifelong protection, and so booster doses… throughout adult life are not routine in most countries that can achieve high coverage" (Pollard & Bijker 2021, PMC7754704). Tetanus is also protected by antitoxin threshold levels that stay high for decades even with an 11-year half-life.
- **Rewrite:** "Tetanus antibodies, by contrast, have an estimated half-life of about 11 years [^18]. Some countries therefore recommend adult boosters, while others consider five or six childhood doses enough for life [^15]."

**S5. ch03-vdj forces the "Different receptors" tally** (spec line 81, "The 'Different receptors' tally always equals the number of successful cells").
- **Problem:** Forcing the tally is dishonest simulation logic. Identical receptors can arise: zero-edit seams with the same V/D/J, and convergent recombination is real. Briney's shared "public" clonotypes, mentioned in the deep dive, are a real-world consequence.
- **Fix:** Compute the tally from the actual sequences (V, D, J and seam letters, plus the light-chain V/J and seam). Collisions will be vanishingly rare, so the teaching point survives honestly. Drop "(show that no two are the same)" and use "(duplicates are possible but astronomically rare)".

**S6. Glossary `lymphocyte` contradicts itself** (line 446, "A small white blood cell of the adaptive immune system; mainly B cells and T cells (NK cells are innate lymphocytes)").
- **Rewrite:** "A small, round white blood cell. B cells and T cells are the lymphocytes of adaptive immunity; NK cells are innate lymphocytes." Also check consistency with Chapter 1, which defines `lymphocyte` first.

---

## Optional

- **O1. Landsteiner chronology** (line 9). His hapten/azoprotein work began in Vienna (~1917) and The Hague (1919–22). The mirror-image experiment (1928) was at Rockefeller, where he moved in 1923. Suggested wording: "Through the 1910s and 1920s, first in Vienna and later at the Rockefeller Institute in New York…". Note that the 1928 isomers were l- and d-phenyl(p-aminobenzoylamino)acetic acids, so "mirror images" is correct.
- **O2. Burnet's sources** (line 189). His paper's title is "A modification of *Jerne's* theory…". Consider "building on Niels Jerne's 1955 idea (and, independently, David Talmage)".
- **O3. TCR potential diversity** (line 49, rung 7). 10¹⁵ is the classic figure. Newer estimates exceed 10²⁰ (Zarnitsyna et al., *Front Immunol* 2013;4:485, doi:10.3389/fimmu.2013.00485), which only strengthens "possible ≫ present". Wording such as "at least 10¹⁵" is safe.
- **O4. T-cell count across chapters.** Chapter 3 says "roughly 400 billion" (Lythe 2016), while Chapter 1's census says "about 470 billion" (Sender 2023). Harmonize to "roughly 400–500 billion" or cite Sender.
- **O5. Class switching** (line 395). Most class switching happens *before* B cells enter germinal centers (Roco et al., *Immunity* 2019;51:337, doi:10.1016/j.immuni.2019.07.001). Add "often even before the germinal center forms".
- **O6. Epitope size** (line 37, "often just a few amino acids"). Antibody epitopes typically involve ~15–20 contact residues, and T-cell peptides are 8–10+ amino acids. Use "a small patch, often a dozen or so amino acids".
- **O7. "Looking for one particular fragment"** (line 366) sits awkwardly with the chapter's own cross-reactivity point. Use "looking for fragments that match its query".
- **O8. ch03-antibody constraints.**
  - "Antibodies never enter cells" (line 316) conflicts with mode 3, where the coated bacterium is swallowed. Use "Antibodies never cross into cells on their own".
  - If the IgM chip is built, note that a single surface-bound IgM pentamer can trigger C1, unlike a lone IgG.
  - The complement pore is most effective against Gram-negative bacteria, so draw a rod with a thin envelope rather than a thick-walled coccus.
- **O9. Quiz Q2.** "peaks within days" should be "rises within days". Secondary titers pass protective levels in 3–4 days but peak around a week or later.
- **O10. Clinic box** (line 333). Use "a single *kind* of antibody, mass-produced". "Blocks a signal the cancer needs" misses checkpoint inhibitors, which block a brake on T cells; add "or a brake on T cells (Chapter 8)".
- **O11. ch03-clonal-selection details.** Step 6 should say "*often* cleared before it can make you feel ill", matching line 344. The long-lived plasma cells "parked at the field edge" of a lymph node and labeled bone marrow could confuse readers; use a small inset or an arrow labeled "→ bone marrow".
- **O12. Lythe's 10¹⁰** (rung 5, line 383) comes from a model of the naive CD4 compartment and sits above all sequencing estimates. Wooldridge 2012 itself assumes "<10⁸". The dashed "estimate" treatment is good; consider "(one model; contested)". The PLAN's canonical "10⁷–10⁸" and Chapter 4's "library of millions" are compatible with this chapter's "at least 10⁸", but the supervisor may want to update the PLAN metaphor table to "at least 10⁸ (direct counts)".
- **O13. Briney's shared sequences** (line 385). What turned up in everyone were shared *clonotypes* (near-identical heavy-chain CDR3/V/J), not identical full sequences.
- **O14. Glossary `clone`** (line 466). Add "(B-cell clones later diversify by mutation)" so it does not contradict affinity maturation.
- **O15. Panum citation** (#17). Add the volume and pages: *Bibliothek for Læger* 3R, 1:270–344 (1847).

---

## Claims verified as correct

- Landsteiner & van der Scheer, *J Exp Med* 1928;48:315–320, doi:10.1084/jem.48.3.315 (PMID 19869486): antisera distinguished l- from d- (mirror-image) isomers. Done at Rockefeller.
- Long et al., *Nat Med* 2020;26:845–848 (PMID 32350462): 285 patients, 100% IgG-positive within 19 days of symptom onset.
- Krammer et al., *Nat Rev Dis Primers* 2018;4:3 (PMID 29955068): vaccines are reformulated yearly because of antigenic drift.
- Amaral et al., *Nature* 2023;622:41–47 (PMID 37794265): "fewer than 20,000" protein-coding genes.
- Pauling, *JACS* 1940;62(10):2643–2657, doi:10.1021/ja01867a018: instructive (template) theory. Citation correct.
- Hozumi & Tonegawa, *PNAS* 1976;73:3628–3632 (PMID 824647): embryo vs MOPC-321 plasmacytoma DNA, with V and C separated in the embryo and joined in the tumor (kappa light chain). Tonegawa received the 1987 Nobel.
- IMGT human IGH: 38–46 functional IGHV, 23 IGHD and 6 IGHJ; locus 1,250 kb (so "roughly a million letters" is fine).
- IMGT IGK: 31–36 IGKV and 5 IGKJ. IGL: 29–33 IGLV and 4–5 IGLJ. The ~320 light-chain and ~1.8 × 10⁶ combination arithmetic is correct.
- Lefranc, *Front Immunol* 2014;5:22: exists and matches.
- Roth, *Microbiol Spectr* 2014;2(6), doi:10.1128/microbiolspec.MDNA3-0041-2014 (PMID 26104458): supports TdT, P/N nucleotides, transposase ancestry and oncogenic misrecombination.
- V(D)J mechanics are correct: D–J before V–DJ; heavy V and J segments carry 23-bp spacers and D segments 12-bp spacers, so a heavy chain cannot skip its D; RAG hairpins opened by Artemis; signal joint lost on an excision circle; C attached by splicing; fewer N additions in light chains; the 2/3 out-of-frame logic; allelic exclusion "as a rule".
- Lythe et al., *J Theor Biol* 2016;389:214–224 (PMID 26546971): ~4 × 10¹¹ T cells; ~10¹⁵ possible TCRs; "10¹⁵ T cells would weigh about 500 kg"; sequencing estimates 10⁶–10⁸; model estimate ~10¹⁰ clonotypes (9%, about 10× fewer than naive T cells); mean clone size of order 10.
- Qi et al., *PNAS* 2014;111:13139–13144 (PMID 25157137): ≥10⁸ unique TCRβ in naive repertoires of young adults; two- to fivefold lower in the elderly.
- Wooldridge et al., *JBC* 2012;287:1168–1177 (PMID 22102287): T1D-patient CD8 clone, >10⁶ decamers; RQFGPDFPTI was >100-fold more potent than ALWGPDPAAA and differs at 7 of 10 positions.
- Blattman et al., *J Exp Med* 2002;195:657–664 (PMID 11877489): 1 in 2 × 10⁵; 100–200 cells; >14 divisions in 1 week; ~10⁷ cells; ~5% survive; ~5 × 10⁵ memory; >1,000-fold increase.
- Burnet 1957, *Aust J Sci* 20:67–69; reprint *CA Cancer J Clin* 1976;26:119–121, doi:10.3322/canjclin.26.2.119 (PMID 816431).
- Pollard & Bijker, *Nat Rev Immunol* 2021;21:83–100 (PMID 33353987): primary antibody rise over ~2 weeks; long-lived plasma cells in bone marrow for decades; memory B cells need 3–4 days; rapidly invasive bacteria (Hib, MenC) can cause disease despite memory; maternal antibody half-life 30–40 days with little left after 8–12 weeks; passive antibody infusion protects.
- Lu et al., *Nat Rev Immunol* 2018;18:46–61 (PMID 29063907): supports the four effector functions.
- Panum (Delta Omega translation): measles was absent since 1781 and broke out in early April 1846; 7,782 inhabitants, ~6,000 cases; 98 elderly people with prior measles were seen, none reinfected; elderly people without prior measles were attacked.
- Amanna et al., *NEJM* 2007;357:1903–1915 (PMID 17989383): 45 subjects followed up to 26 years; half-lives of VZV ~50 years, measles and mumps >200 years, tetanus 11 years, diphtheria 19 years.
- Wardemann et al., *Science* 2003;301:1374–1377 (PMID 12920303): 55–75% of early immature B-cell antibodies self-reactive; removed at two checkpoints.
- Victora & Nussenzweig, *Annu Rev Immunol* 2022;40:413–442 (PMID 35113731): supports germinal-center content (AID, SHM, Tfh-driven selection, plasma-cell and memory output).
- Briney et al., *Nature* 2019;566:393–397 (PMID 30664748): almost 3 billion heavy-chain sequences from 10 people; largely unique repertoires plus universally shared clonotypes; "more than four orders of magnitude" information statement (the 10¹⁶–10¹⁸ framing is covered in M2).
- Antibody anatomy, the five classes and their roles, IgM pentamer, IgA at mucosa, IgD on naive B cells, the four jobs, NK-cell ADCC by granules, and the figure size ordering (antibody < virus < bacterium < cell) are all correct.
- Quiz answer keys are correct and distractors are truly wrong (except the wording nit in O9). The glossary is otherwise accurate.
