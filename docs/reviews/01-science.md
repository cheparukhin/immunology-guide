# Science review: Chapter 1, "A Crash Course in Cells" (`content/drafts/01-cells.md`)

Reviewer: scientific review (cell and molecular biology, immunology). Line numbers refer to the draft as of 2026-10-05. Scratch checks (sequence translation, census arithmetic, avidity simulation) are in the session scratchpad under `ch01-sci/`.

## Overall assessment

This is a careful, well-sourced chapter, and most of its hardest numbers are right. All 20 sources exist and match their authors, titles, journals, years and DOIs. I checked the gene figure against NCBI RefSeq NM_000518.5. The 27 coding letters, the translation (M-VHLTPEEK), the 146-residue mature chain, the TAA stop, the codon-6 numbering, the 64-codon table (no errors) and the "stops possible only at codons 6, 7 and 8" rule are all correct. Every immune-census value in the figure data matches the authors' public dataset to 0.1 billion: the type × location table and its "lymph nodes = nodes + tonsils + vessels" split, the 40/39/19/2% shares, the 184-square largest-remainder allocation and the weights. Sender 2023 confirms the 73-kg reference man, 1.8 × 10^12 cells, 1.2 kg, the woman and child figures, and "~70% of plasma cells in the GI tract". The deep-dive numbers for TCR and antibody affinity agree with Stone 2009 and Foote & Eisen 1995. The problems are a handful of simplifications that have tipped into being false. The most important is that affinity is *defined* as dwell time in the key-idea box, glossary, quiz and takeaways, which contradicts the chapter's own K<sub>D</sub> = k<sub>off</sub>/k<sub>on</sub>. Others: "almost all immune cells are made in the bone marrow"; the COVID virus called "genetic material in a protein shell" (it is enveloped); "almost every cell carries two copies" of the genome (84% of your cells carry none, as the chapter itself says); and the scale figure's spike length, which is half the real value. The optional "Two arms" mode of the binding simulation is mis-specified: as written, two-armed snug binders would stay bound for tens of minutes, and how long depends on the screen's frame rate.

---

## Must fix

**M1. Affinity is defined as "how long two molecules stay together" (lines 338, 348, 419, 428, 627, 642, 675)**
- Quotes:
  - L338: "so affinity is really about *time*."
  - Key idea, L428: "Affinity measures how long two molecules tend to stay together".
  - Glossary, L675: "in practice, how long they tend to stay together before letting go".
  - Quiz Q3, L627: "Affinity is essentially about how long a well-fitted pair holds on."
  - Takeaway, L642: "affinity is how long partners stay together".
  - Figure goal (L348) and step 2 (L419): "affinity sets how long each embrace lasts".
- Problem: affinity is an equilibrium quantity, K<sub>D</sub> = k<sub>off</sub>/k<sub>on</sub>, as the chapter's own deep-dive correctly says (L434). How long a complex lasts (mean lifetime 1/k<sub>off</sub>, half-life ln2/k<sub>off</sub>) is set by the off-rate alone. Two pairs with the same affinity can have very different dwell times (fast-on/fast-off versus slow-on/slow-off). The difference matters later in this guide. TCR signaling is often argued to track the half-life of the TCR–pMHC bond better than K<sub>D</sub>, a distinction Stone et al. 2009 [18] discuss directly. If Chapter 1 makes "affinity = time" the canonical definition, Chapter 4 cannot draw that distinction without contradicting it. The underlying intuition is sound: for antibodies and most protein–protein binding, affinity differences come mostly from the off-rate. Keep the intuition and drop the false equation.
- Suggested rewrites:
  - L338: "...so affinity is largely about *time*. Partners meet at broadly similar rates, so what mostly separates a strong pair from a weak one is how long they hold on. A high-affinity pair stays together, on average, for a long while..."
  - Key idea (L428): "Molecular recognition is touch: shape plus chemistry. Affinity is the overall strength of a fit, and for most immune molecules it mostly reflects how long partners stay together. No two molecules stay together forever. What a cell senses is the fraction of its receptors occupied at any moment."
  - Glossary (L675): "The strength of binding between two molecules at a single binding site. It depends on how quickly they meet and, usually above all, on how long they stay together before letting go."
  - Quiz Q3 explanation: "High affinity usually means a well-fitted pair holds on a long time before letting go."
  - Takeaway (L642): "...affinity is the strength of the fit (mostly, how long partners stay together), and every binding is temporary."
  - Figure goal and step 2: "...that the tighter the fit, the longer partners stay together..." (true in this simulation by design, because p_on is equal for Snug and Loose).

**M2. "Almost all of them are made in the bone marrow" (line 471; glossary L672)**
- Quotes: L471: "Almost all of them are made in the bone marrow, from rare blood-forming stem cells." Glossary bone-marrow (L672): "where blood cells, including nearly all immune cells, are made."
- Problem: this is true of lineage *origin*, but not of where the cells are *made*.
  - T cells are about a quarter of the census. They are made in the thymus (the chapter says so at L489).
  - In adults, the naive T-cell pool is maintained almost entirely by cell division in the periphery, not by new output. den Braber I et al. *Immunity* 2012;36:288-297, doi:10.1016/j.immuni.2012.02.006, PMID 22365666: "the maintenance of the adult human naive T cell pool occurred almost exclusively through peripheral T cell division."
  - Memory lymphocytes and plasma cells arise from division in lymphoid organs.
  - Many tissue-resident macrophages self-renew locally, and mast cells finish maturing in tissues.
  - Together these are well over a third of the immune cells counted in the census.
- Suggested rewrite (L471): "Almost all of them trace their ancestry to rare blood-forming stem cells in the bone marrow. Many then mature or multiply elsewhere: T cells are made in the thymus and, in adults, are topped up mostly by division of existing cells, and many tissue macrophages renew themselves on the spot. (Some descend from cells that settled in their tissues before birth.)[^16]"
- Glossary (L672): "The soft tissue inside bones where blood cells are made, including the ancestors of all immune cells. It holds about 40% of the body's immune cells." Optionally add den Braber 2012 as a source.

**M3. The COVID virus is described as "only genetic material in a protein shell" (line 21; scale-figure step 6, L107)**
- Quotes: L21: "It is just a little genetic material in a {{protein|protein}} shell... The coronavirus behind COVID-19 is roughly 100 nanometers". Step 6 (L107): "They are not cells, only genetic material in a protein shell." (This caption accompanies the SARS-CoV-2-like particles.)
- Problem: SARS-CoV-2, the one virus the chapter names and draws, is an enveloped virus. Its RNA is packaged by nucleocapsid protein inside a lipid bilayer taken from the host cell, and the spike, M and E proteins are embedded in that bilayer. Ke Z et al. *Nature* 2020;588:498-502 (doi:10.1038/s41586-020-2665-2, PMID 32805734): "virions are surrounded by a lipid bilayer from which spike (S) protein trimers protrude." The draft's own source [5] calls it "an enveloped virus ≈0.1 μm in diameter." The "protein shell only" description fits non-enveloped viruses (polio, HPV), not the virus shown.
- Suggested rewrite (L21): "It is just a little genetic material packed in a protein coat, often wrapped in a fatty envelope stolen from the last cell it left, and it can only copy itself by hijacking a living cell."
- Step 6: "They are not cells: just genetic material in a protein coat, wrapped (for this virus) in a fatty envelope."

**M4. Scale figure: spike length is half the real value, so the to-scale scenes 6–7 come out wrong (lines 64–67, 75, 117)**
- Quotes:
  - Scene 6: "One virus particle about 100 nm in diameter, ringed with spikes ~10 nm long."
  - Data (L117): "spikes ~9–12 nm long [5]".
- Problem: the 9–12 nm figure comes from the first negative-stain EM description (Zhu et al. *NEJM* 2020, as quoted in Bar-On [5]). Cryo-electron tomography of intact virions measured prefusion spikes at an average length of 23.4 nm (SD 2.3) protruding from the membrane, on virions 91 ± 11 nm in diameter, with 25 ± 9 spikes each (Ke 2020, doi:10.1038/s41586-020-2665-2). Turoňová et al. (*Science* 2020;370:203-208, doi:10.1126/science.abd5223) also describe a flexible ~20-nm club on a slender stalk.
- Consequences for a figure that promises "objects ARE drawn to scale relative to each other":
  - (a) An IgG (~14.5 nm) is about two-thirds the length of a spike, not longer.
  - (b) A 90–100 nm virion plus 23-nm spikes on both sides spans ~140 nm, so it cannot fit inside the 100-nm field of view of scene 6.
  - (c) A "ring" of spikes overstates the density: with ~25 per virion, a cross-section shows about 6–10 around the outline, irregularly spaced and tilted.
- Fix:
  - Data line: "SARS-CoV-2 virion: ~90–100 nm (60–140 nm) [5, Ke 2020]; spikes ~20–25 nm long, ~25 per virion, flexibly hinged [Ke 2020]." Add Ke 2020 to the sources.
  - Scene 6: "Part of one virus particle fills the frame (its curved envelope crossing the stage; the full particle, ~90–100 nm, is wider than the 100-nm view). 4–5 spikes, each ~20–25 nm long, tilted at varying angles on thin stalks. Gold antibodies (~14 nm) bind spike heads by their arm tips; each antibody is about two-thirds of a spike's length."
  - Science constraints: keep "antibody ~7× smaller than the virus diameter" and add "spike ~1.5–2× an antibody's length".

**M5. "Almost every cell carries two copies" of the genome (line 154; glossary L662)**
- Quotes: L154: "Almost every cell carries two copies, one inherited from each parent." Glossary genome (L662): "present in two copies in most cells."
- Problem: the chapter's own deep-dive (L133) says about 84% of your cells are red blood cells, which have no nucleus and no DNA (Sender 2016 [3]). By count, then, most of your cells carry *zero* copies. A careful reader who opens the deep-dive will see the contradiction.
- Suggested rewrite (L154): "Almost every cell with a nucleus carries two copies, one inherited from each parent. (Red blood cells, the most numerous cells of all, carry none; eggs and sperm carry one.)"
- Glossary: "...present in two copies in nearly every cell that has a nucleus."

---

## Should fix

**S1. Binding simulation: the "Two arms" rules make snug binders near-permanent, and probabilities are per frame (lines 370–385, 390, 401–408)**
- Quotes:
  - "the second tip binds a free neighboring pocket within reach with p = 0.8 per frame"
  - "Two arms (if built): average stay is several times longer than single-arm"
  - "NOTHING stays bound forever, not even at Snug."
- Problem: a per-frame p = 0.8 is an effective rebinding rate of about 100 s⁻¹ at 60 fps, and about 190 s⁻¹ on a 120 Hz display. A two-armed binder leaves only when the second arm happens to release during the ~10 ms the first arm is free. Its expected stay is roughly τ(1.5 + k<sub>rebind</sub>·τ/2).
  - Monte Carlo of the spec's rules at 60 fps: Snug τ = 8 s gives a mean stay of about 27 minutes (≈200× τ); Loose τ = 0.8 s gives about 16 s (≈20×). Both roughly double at 120 fps.
  - So Snug Y's would effectively never leave during a visit. That contradicts the figure's own lesson ("nothing stays bound forever") and its stated expectation ("several times longer").
  - The single-arm capture rule ("p_on per contact", evaluated each frame) has the same frame-rate dependence.
- Second issue, ligand depletion: the default is 12 ligands for 12 receptors, so Snug occupancy can never exceed the number of ligands. A simple mass-action estimate shows that if Loose@12 is tuned to 20–30%, Snug@12 tops out around 55–67%, which is borderline for "most receptors occupied most of the time". The deep-dive's [L]/([L]+K<sub>D</sub>) also assumes ligand in excess, which this sim is not.
- Fix:
  - (a) Specify all stochastic events as rates per simulated second, converted per frame as p = 1 − exp(−k·dt), so behavior is frame-rate independent.
  - (b) Set second-arm (re)binding to k ≈ 1–2 s⁻¹. That gives Snug two-arm stays ≈5–10× single-arm (about 45–75 s) and Loose ≈2×.
  - (c) Change the expectation text to: "Two arms: snug binders stay several times longer; in real antibodies the gain can be a hundred-fold or more."
  - (d) Raise the default ligand count to about 20. State the tuning targets as Snug@default ≥ 70%, Loose@default 15–30%, Loose@max ≥ 60%, and ask the builder to verify them numerically.
  - (e) Add to the data note: "Few ligand molecules are shown, so they can run out; the textbook formula assumes ligand in excess."

**S2. Sickle-cell births: outdated figure (line 188)**
- Quote: "Some 300,000 to 400,000 babies are born with the disease each year.[^12]"
- Problem: this correctly quotes Kato 2018 [12], but a newer and broader estimate exists. The GBD 2021 Sickle Cell Disease Collaborators (*Lancet Haematol* 2023;10:e585-e599, doi:10.1016/S2352-3026(23)00118-7, PMID 37331373) estimate that 515,000 babies (95% UI 425,000–614,000) were born with sickle-cell disease in 2021.
- Suggested rewrite: "Roughly half a million babies are born with the disease each year, most of them in sub-Saharan Africa.[^12][new]" Add the GBD 2021 source.

**S3. Gene figure: the most famous neighbor of the sickle change, hemoglobin C, falls into the generic verdict (lines 255–270, 294)**
- Problem: step 6 tells readers to "Start with codon 6, GAG." The obvious first-letter change, GAG→AAG (Glu→Lys), is hemoglobin C, a common real variant in West Africa. Under the current rules it gets the generic "Many swaps like this are harmless; some are not." That is not false, but it misses a teaching point and leaves the impression that its effect is unknown.
  - Hb C carriers (AC) are healthy, and two copies (CC) cause mild anemia.
  - Inherited together with the sickle gene, it causes HbSC disease, a common form of sickle-cell disease. HbSC is one of the three genotype groups modeled by GBD 2021 (doi:10.1016/S2352-3026(23)00118-7), and Kato 2018 [12] describes it as a sickle-cell disease genotype.
- Suggested verdict card (codon 6, GAG→AAG): "Same position, another real variant: lysine instead of glutamic acid. This is hemoglobin C, common in West Africa. One copy causes no symptoms; two copies cause mild anemia. Paired with the sickle-cell gene from the other parent, it causes a form of sickle-cell disease (HbSC)." This also fixes a small gap at L188 ("develops mainly in people who inherit the change from both parents"): the card shows the other route.

**S4. "They fill only a small fraction of the genome" (line 156)**
- Problem: "genes" is defined at L156 as recipe stretches, but the deep-dive (L315) then shows that genes include introns. Counting introns, protein-coding genes span a large share of the genome, on the order of a third or more. The small fraction is the protein-coding part: the non-redundant protein-coding transcriptome is ~59 Mbp, about 2% of the genome *including* untranslated ends (Piovesan A et al. *BMC Res Notes* 2019;12:315, doi:10.1186/s13104-019-4343-8, PMID 31164174), and the coding sequence itself is about 1–1.5%.
- Suggested rewrite: "The protein-coding parts of these recipes add up to only about 1–2% of the genome. The rest includes switches that control when genes are used, stretches that interrupt the recipes (more on that below), and much whose role is still unclear."

**S5. "1.8 trillion immune cells make up roughly 6% of all your cells" is attributed to a source that does not say it (lines 133, 469)**
- Quotes: L133: "By the same group's later estimate, the 1.8 trillion immune cells make up roughly 6% of all your cells, about one in seventeen.[^1][^3]" L469: "roughly one in every seventeen cells in your body."
- Problem: Sender 2023 [1] does not state a fraction of total body cells. The 6% is the draft's own division of a 73-kg (2023) count by a 70-kg (2016) total. A newer whole-body census estimates ≈36 trillion cells in a reference man (Hatton IA et al. *PNAS* 2023;120:e2303077120, doi:10.1073/pnas.2303077120, PMID 37722043), which gives ≈5% (one in twenty).
- Suggested rewrite (L133): "Set against that total, the 1.8 trillion immune cells counted by the same group in 2023 are roughly 5–6% of all your cells: about one in every 17 to 20.[^1][^3]" At L469: "roughly one in every twenty of your cells".

**S6. Takeaway: "viruses about 100 nanometers" (line 639)**
- Problem: this overgeneralizes from one virus. Viruses range from ~20–30 nm (parvoviruses, poliovirus) to ~300 nm (poxviruses), and giant viruses are larger than some bacteria. The main text correctly ties 100 nm to the COVID virus.
- Suggested rewrite: "Cells are about 10 micrometers across, bacteria 1–2 µm, most viruses tens to a few hundred nanometers (the COVID virus about 100 nm), and antibodies 10–15 nm." Mirror this in the ch01-scale goal (L29: "virus, ~100 nm") by saying "a typical virus".

**S7. Scale figure, scene 7: an antibody drawn as "chains of small beads" (lines 68–71)**
- Quote: "Draw its arms and stem as chains of small beads, each bead ~0.5 nm (one amino acid)."
- Problem: a 12–15 nm antibody drawn as single-file bead chains would hold only a few dozen beads. An IgG is ~150 kDa, about 1,300 amino acids (two ~450-residue heavy chains and two ~214-residue light chains). They are folded into 12 compact domains of ~110 residues, four per arm and four in the stem. A string-of-beads drawing tells readers that proteins are linear strands, which contradicts the chapter's own "machines made of shape" section.
- Fix: "Draw the antibody as 12 compact lumps (domains), 4 per arm and 4 in the stem, each a tight ball of ~110 small beads (~0.5 nm each, one amino acid); ~1,300 beads in all. A short flexible hinge joins the arms to the stem. Highlight the ~15–20 beads at one arm tip that touch the spike."

**S8. Census data provenance labels (lines 508, 595)**
- Quotes: L595: "WEIGHT BY TYPE, grams (published Table 1 means [1]...)". L508: "'≈ 660 billion' style counts (one significant figure in the label...)".
- Problem: the gram values (601, 210, 106, 100, 96, 56, 27, 13, 11, 3.8, 0.7) are correct, but they come from the authors' dataset (`total_w_unc.xlsx`, sheet `mass_by_cell_type`). The published Table 1 rounds them to one significant figure (600, 200, 100, 100, 100, 60, 30, 13, 10, 4, 0.7). Separately, "≈660 billion" has two significant figures, not one.
- Fix: "WEIGHT BY TYPE, grams (authors' dataset, total_w_unc.xlsx sheet mass_by_cell_type; Table 1 of [1] gives these rounded to one significant figure)". In the label spec: "two significant figures in the label".

---

## Optional

- **O1. Ingram (L186).** The 1957 paper identified the Glu→Val swap in one tryptic peptide. The assignment to the β chain came in 1958–59 (Hunt & Ingram). Consider "showed that sickle-cell hemoglobin differs from normal hemoglobin by a single amino acid", and keep "in the beta chain" as present-day knowledge.
- **O2. Casgevy "first approved medicine based on CRISPR" (L307).** This is true worldwide: the UK approved it in November 2023, before the FDA. Source [14] supports only "first FDA-approved therapy utilizing CRISPR/Cas9". Either cite the MHRA approval or say "the first CRISPR-based medicine approved in the US".
- **O3. Lyfgenia boxed warning.** The FDA release notes a boxed warning for hematologic malignancy. One clause would foreshadow the Chapter 10 discussion of secondary malignancy after engineered-cell therapy.
- **O4. Gene sandbox.**
  - START tooltip: "...stop the protein being made at all. In this gene, such changes cause beta-thalassemia."
  - Stop verdict: optionally add "Early 'stop' changes elsewhere in this gene (for example at codon 17 or 39) are common causes of beta-thalassemia, another inherited anemia."
  - L313: the first methionine is removed *as* the chain is being made (co-translationally), not after.
- **O5. Scene 4 (L56–57).** E. coli flagella are long, about 5–10 µm, longer than the cell body, so "a few short flagella" is wrong. Draw them long and wavy or omit them. Scenes 4–6 also put coronavirus-like particles on fingertip dermal cells, which SARS-CoV-2 does not infect. Keep the virus generic in scenes 4–5 (no "corona" styling), or accept it as a stylized example and say so in the caption.
- **O6. Cell totals (L19).** "About 30 trillion" (Sender 2016) is fine. Hatton 2023 (doi:10.1073/pnas.2303077120) estimates ≈36 trillion, so "30–40 trillion" is safer. "Hundreds of kinds" is not supported by [3]; Hatton 2023 (~400 cell types) supports it.
- **O7. Food protein (L462).** "Kilograms of foreign food protein every year" understates it: at 70–100 g/day it is tens of kilograms.
- **O8. Transplants (L451).** "Attacked unless drugs suppress..." could add "(unless the donor is an identical twin)".
- **O9. Antibody affinity ceiling (L436).** This is fine as hedged. Poulsen et al. *J Immunol* 2007;179:3841 (doi:10.4049/jimmunol.179.6.3841) found human anti-tetanus antibodies with median affinities "close to the proposed affinity ceilings". "A proposed practical ceiling" would be slightly more precise.
- **O10. TCR dwell times (L438).** Stone 2009 [18] Table 1 lists natural TCR half-lives of ~0.7–77 s, so "about a second to about a minute" is accurate. Note that these are mostly solution measurements at 25 °C, and in-membrane (2D) kinetics differ. That belongs in Chapter 4.
- **O11. Thymus sentence (L489).** "Here T and B cells gather in vast numbers, scanning for a match" follows the thymus sentence and reads as if it applies to the thymus. Move it after the spleen sentence.
- **O12. Glossary nits.**
  - avidity (L677): "can be far greater" (geometry permitting).
  - nk-cell (L689): "without needing prior exposure to that target". NK cells do undergo a kind of education, which Chapter 2 may cover.
  - white-blood-cell (L650): the name comes from their pale color compared with red cells (the whitish layer when blood is spun), not from blood tests.
  - hemoglobin (L669): "in adults, two alpha and two beta chains", since the clinic box mentions fetal hemoglobin.
- **O13. Opening line (L9).** 1.8 trillion is for a 73-kg man; women average ~1.5 trillion (Sender 2023). "About 1.5 to 2 trillion" covers most readers.
- **O14. Billingham/Medawar (L460).** Correct as written. If space allows, Ray Owen's 1945 observation of tolerance in cattle twin chimeras was the natural experiment that prompted Burnet's prediction.

---

## Claims verified as correct

- **HBB sequence:** NM_000518.5 CDS = 444 nt (147 codons + TAA stop). The first 27 nt are ATG GTG CAT CTG ACT CCT GAG GAG AAG, translating to M-V-H-L-T-P-E-E-K. The mature chain is 146 aa after Met removal, so "+138 more" is correct. The sickle change is codon 6 GAG→GTG (HGVS c.20A>T, p.Glu7Val), and the "seventh codon" explanation is correct.
- **Genetic code and sandbox:** the 64-codon table in the spec matches the standard code exactly. From the 27-letter strip, the only single-letter stops are GAG→TAG (codons 6 and 7) and AAG→TAG (codon 8). Synonymous options exist at every codon from 1 to 8. The stop-length rule n = codon − 1 is right.
- **Hb G-Makassar:** β6 Glu→Ala, GAG→GCG; heterozygotes are asymptomatic and hematologically normal (Viprakasit 2002, PMID 12403489).
- **Sickle mechanism:** a surface valine on deoxy-Hb drives polymerization into fibers. Kato 2018 states 300,000–400,000 births per year (true for that source; see S2).
- **FDA, 8 Dec 2023:** Casgevy and Lyfgenia approved for patients ≥12 years with myeloablative conditioning. Casgevy raises fetal hemoglobin and is the first FDA-approved CRISPR/Cas9 therapy; Lyfgenia adds HbA<sup>T87Q</sup>.
- **Sender 2023 census:** 73-kg reference man, 20–30 y, 176 cm. 1.8 × 10^12 cells (95% CI 1.5–2.3); 1.2 kg (0.8–1.9). Woman 1.5 × 10^12 (~1 kg); 10-y child 1 × 10^12. Lymphocytes 40% by number and 15% by mass; macrophages ~10% by number and ~50% by mass. Locations: bone marrow 40%, lymphatic 39%, ~2% blood, skin/lungs/GI 3–4% each. ~70% of plasma cells are in the GI tract.
- **Census figure data:** every cell of the type × location table matches the dataset (`summary_immune_cells.csv`, `cell_type_densities`). Row and column totals and shares, the 184-square type and location allocations (largest remainder), the 122 weight squares and 1,224.5 g, and the blood share of T cells (1.7%) all check out. Neutrophils 36%, T cells 25%, macrophages 11% / 49% by mass.
- **Sender 2016:** 70-kg reference man; 3.0 × 10^13 human cells, 3.8 × 10^13 bacteria, 0.2 kg of bacteria; red blood cells 84% of cells.
- **Sizes:**
  - Resting lymphocyte ~7 µm (Reth 2013, resting B cell; also consistent with the 199 fL T-cell volume in the Sender dataset).
  - Macrophage 15–20 µm (dataset volumes 1,350–3,700 fL).
  - E. coli ~2 × 1 µm; RBC 7–8 µm; typical cell 10–20 µm.
  - SARS-CoV-2 ~100 nm (60–140 nm).
  - IgG 14.5 × 8.5 × 4 nm with antigen-binding sites 13.7 nm apart (Tan 2008, from PDB 1IGT).
  - Typical protein 3–6 nm.
- **Scale ratios and quiz arithmetic:** T cell / E. coli ≈ 3.5×; virus / antibody ≈ 7×; 7 µm / 12 nm ≈ 580 (Q1, and all its distractor explanations); 70 viruses across a lymphocyte.
- **"If a T cell were your height" (×243,000):** you ≈ 413 km (ISS altitude); RBC ≈ 1.8 m; macrophage ≈ 4.4 m (giraffe); E. coli ≈ 0.5 m (cat); virus ≈ 2.4 cm (grape); antibody ≈ 3 mm (sesame); amino acid ≈ 0.15 mm.
- **Cell Biology by the Numbers:** a protein crosses a HeLa cell in ~10 s (D ≈ 10 µm²/s); ~10^10 proteins per mammalian cell ("billions"); ~2 m of DNA per cell.
- **Genome:** T2T genome 3.055 Gbp (Nurk 2022); protein-coding genes "fewer than 20,000" (Amaral 2023).
- **Anfinsen:** RNase refolding experiments; 1972 Nobel Prize in Chemistry (shared); sequence determines structure.
- **AlphaFold:** CASP14 2020 and Jumper 2021, with accuracy competitive with experiment in most cases.
- **Genetic code facts:** 64 codons, 3 stops, 61 sense codons, Leu with six codons, introns and exons, alternative splicing, frameshifts.
- **Caffeine:** adenosine receptor antagonist (Fredholm 1999, PMID 10049999).
- **Affinity numbers:**
  - K<sub>D</sub> definition and the [L]/([L]+K<sub>D</sub>) occupancy.
  - Antibody affinity ceiling ~0.1 nM (Foote & Eisen 1995; Poulsen 2007).
  - TCR K<sub>D</sub> 1–100 µM, natural half-lives ~1 s to ~1 min, engineered TCRs 30 nM to 26 pM, and loss of specificity at high affinity (Stone 2009).
- **History:** Billingham, Brent & Medawar 1953 (in utero injection, later graft acceptance); Medawar and Burnet, 1960 Nobel; Matzinger 1994 danger model.
- **Remaining glossary entries:** accurate.
- **Citations:** all 20 sources exist, and every bibliographic detail checked matches. Each [^n] supports its sentence, except the derived "6%" (S5) and "hundreds of kinds" (O6).
