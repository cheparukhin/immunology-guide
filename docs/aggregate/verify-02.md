# Second-pass verification — Chapter 2, "The First Responders" (`content/drafts/02-innate.md`)

Verifier: second-pass scientific fact check, 2026-10-06. Line numbers refer to the current draft (654 lines). Scope: every claim in prose, figure specs (spec/steps/alt, including model rules and verbatim readouts), deep dives, clinic box, quiz, takeaways, glossary and sources. Primary checks used Amass (biomedcore), PubMed/E-utilities, and Europe PMC.

## Status of the earlier review's Must-fix items (`docs/reviews/02-science.md`)

| Item | Status |
|---|---|
| M1 sepsis defined as a bloodstream infection | **Resolved** (L209; glossary L613). Consistent with Sepsis-3 (Singer 2016). |
| M2 STING drawn free-floating | **Resolved**: sensor 7 is labeled cGAS, and STING sits on an ER strip (spec L56–58, L71–72, L145–146, L151–154; deep dive L186). |

All Should-fix items S1–S7 from round 1 are resolved:
- NLRP3 is no longer drawn binding ATP or crystals.
- The TLR8 note is added.
- The T-cell note is graded.
- Uric acid crystallizes only outside cells.
- Lipid A is named.
- Medzhitov 1997 is accurately limited to cultured cells and B7.1.
- The nerve distractor is gone.

Most Optional items were also adopted: complement/C5a, RBC note, TB in macrophages, interferon legend, Kärre wording, slider label.

---

## 1. Errors (MUST fix)

None found.

---

## 2. Unsupported or weakly supported (SHOULD fix)

**S1. "A tumor rarely raises the alarm" overstates the case and is contradicted by the chapter's own source (key idea L534; L547; quiz Q4 L575)**
- Quotes:
  - L534: "a tumor, built from the body's own molecules, rarely raises the alarm."
  - L547: "It largely misses cancer, which carries few danger signals of any kind."
  - Q4 key (L575): "so they rarely show microbial patterns or spill damage signals."
- Problem: tumors lack *microbial* patterns, but "rarely... spill damage signals" and "few danger signals of any kind" are too absolute.
  - The source cited for cancer sensing ([^6], Woo 2014, PMID 25517615) opens: "Spontaneous T cell responses against tumors occur frequently and have prognostic value in patients." It shows these responses depend on innate STING sensing of tumor DNA in host antigen-presenting cells.
  - The chapter itself describes tumors as Dvorak's inflamed "wounds that do not heal" (L470).
  - The defensible claim: the alarm a tumor raises is usually faint, of the wrong kind (repair rather than fight), or too late.
- Rewrites:
  - Key idea: "No danger signal, no response. The innate system decides whether the adaptive system acts at all, and a tumor, built from the body's own molecules, usually raises only a faint alarm, if any."
  - L547: "**It largely misses cancer**, which carries no microbial patterns and often only faint damage signals. NK cells and DNA sensors catch some tumors, but only partly."
  - Q4 key: "Tumor cells are built from the body's own molecules, so they show no microbial patterns and often only weak damage signals — a faint alarm is easily missed."

**S2. ch02-pattern-recognition virus readout does not match the labeled sensors (readout L120; names L145–146; note L147–149)**
- Quote: "Detected: 'Viral RNA in forms our own cells rarely make, such as long double strands.'"
- Problem: with "Show molecular names" on, the two lit sensors don't detect long double strands:
  - sensor 4 is TLR8/TLR7, which sense single-stranded RNA;
  - sensor 6 is RIG-I, which senses short double-stranded RNA carrying a 5′-triphosphate;
  - long dsRNA is the ligand of MDA5 (cytoplasm) and TLR3 (endosome).
- Also, the note "In human macrophages, TLR8 does most of the RNA sensing" is true only for RNA sensing inside endosomes, since cytoplasmic RIG-I-like receptors also sense RNA.
- Source: Takeuchi & Akira 2010 [^2], sections on TLRs and RLRs; the deep dive's own text at L186 assigns dsRNA to TLR3.
- Fixes:
  - Readout: "Viral RNA in forms our own cells rarely make: double strands, or strands with an unusual chemical tag at one end."
  - Or label sensor 6 "RIG-I / MDA5".
  - Note: "...TLR8 does most of the RNA sensing inside digestion bubbles...".

**S3. "Red blood cells, which have no MHC class I at all" (L459)**
- Problem: mature human red cells carry trace HLA class I, the Bennett–Goodspeed (Bg) antigens.
  - One immunoradiometric assay detected HLA-B7, -B17 and -A28 on the red cells of all individuals tested (Indian J Med Res 1991, PMID 1774100).
  - HLA class I (Bg) is expressed on RBCs "by some normal donors" (Transfusion 1990, doi:10.1046/j.1537-2995.1990.30290162897.x, PMID 1689515).
- The point being made (RBCs are spared because they lack "go" signals) stands.
- Rewrite: "Red blood cells, which carry little or no MHC class I, are spared for a related reason..."

**S4. Viruses called "living things" (L19; glossary `microbe` L594)**
- Quotes: "microbes (bacteria, viruses, fungi and other living things too small to see)"; glossary: "A living thing too small to see... such as a bacterium, virus...".
- Problem: this conflicts with Chapter 1 (L21: a virus is "not a cell at all... can only copy itself by hijacking a living cell"). Whether viruses are alive is contested, and this guide has already taken the "not a cell" line.
- Rewrite: "(bacteria, viruses, fungi and other agents too small to see)". Glossary: "A microscopic agent of infection or a tiny organism, such as a bacterium, virus, fungus or single-celled parasite..."

**S5. Inconsistent cell-size conventions in specs (NK spec L440; inflammation spec L277)**
- Quote (L440): "NK cell about 10–12 µm (slightly larger than a resting T cell)".
- Problem: Chapter 1 fixes a resting T cell at 7 µm (in suspension, Reth 2013), so 10–12 µm is ~1.5×, not "slightly larger". The neutrophil's "~12–15 µm" (L277) is likewise a stained-smear value. These are drawing constraints only, but the stated ratios contradict each other across chapters.
- Fix: state the ratios rather than mixed absolute values, e.g. "NK cell slightly larger than a resting T cell (both drawn ~7–9 µm)". Alternatively, keep the absolute values and change "slightly larger" to "about 1.5×". Low priority.

---

## 3. Citation problems

**C1. [^6] (Woo 2014) is cited for "cGAS, signals through STING, a partner protein anchored in the membrane of the endoplasmic reticulum" (L186)**
- What Woo shows: tumor-DNA sensing via cGAS→STING→IRF3 (supported by its abstract).
- What Woo does not show: STING's ER location, or cGAS as *the* sensor.
- Add Ishikawa H & Barber GN, *Nature* 2008;455:674–678 (doi:10.1038/nature07317, PMID 18724357): STING "predominantly resides in the endoplasmic reticulum".
- Optionally also add Sun L et al. *Science* 2013;339:786–791 (PMID 23258413) for cGAS.
- This was an Optional item in round 1 and is still open.

**C2. [^2] (Takeuchi & Akira 2010) carries the new NLRP3 mechanism sentence (L188)**
- The review covers NLRP3 activation models. I could not retrieve its full text (publisher 403), so the exact wording is unverified.
- The mechanism is correct and is directly shown by:
  - Mariathasan S et al. *Nature* 2006;440:228–232 (PMID 16407890): ATP activates "the P2X7 receptor to decrease intracellular K+";
  - Hornung V et al. *Nat Immunol* 2008;9:847–856 (doi:10.1038/ni.1631, PMID 18604214): crystals → phagocytosis → lysosomal damage → NALP3.
- Recommend adding one or both, since this sentence is new.

---

## 4. Claims verified OK (claim → source)

- **Opening**
  - Bacterial doubling every ~30 min; a few dozen → millions overnight (2¹⁶ × 30 ≈ 2 × 10⁶) → arithmetic, standard.
  - Adaptive response takes days, often a week or more → standard; Pollard 2021.
- **Barriers and sentinels**: acidic dead-cell skin layer; mucus, stomach acid, lysozyme in tears and saliva; resident macrophages, DCs and mast cells → standard.
- **Janeway 1989** PAMP/PRR prediction and the "dirty little secret" → [^1] (PMID 2700931).
- **PAMPs**
  - LPS on Gram-negative walls (*E. coli*), never made by human cells; flagellin; viral dsRNA → standard [^2].
  - 10 human TLRs; TLR4 = LPS, TLR5 = flagellin; endosomal TLR3/7/8/9 for nucleic acids; TLR10 on the surface with an unclear role → [^2].
  - Lipid A is the conserved part sensed by TLR4–MD-2 → Park 2009 (round 1).
- **DAMPs**: ATP, DNA, and uric acid crystallizing only outside cells → Shi 2003 (round 1); sterile inflammation → standard.
- **Figure ch02-pattern-recognition**
  - Sensor placements (TLR4/5 surface; TLR7/8/9 endosomal; RIG-I, cGAS and NLRP3 cytoplasmic; STING on ER; P2X7 surface gate) → [^2]; Ishikawa 2008; Mariathasan 2006.
  - NLRP3 assembles rather than binds → Hornung 2008.
  - TLR8 dominance in human monocytes/macrophages and TLR9 mainly in pDCs and B cells → Hornung 2002 (round 1).
  - Macrophage ~20 µm ≈ 1.5× a neutrophil; bacterium ≈ 1/12 → arithmetic.
  - Dying-tumor DNA → cGAS–STING → interferon in DCs → Woo 2014.
- **Toll history**
  - The "toll" exclamation (Nüsslein-Volhard) → standard.
  - Lemaitre/Hoffmann 1996, Strasbourg, antifungal defense, flies die of fungal infection → [^3].
  - Medzhitov & Janeway 1997: human Toll in cultured cells induces cytokines and B7.1 → [^4].
  - Poltorak/Beutler 1998: two LPS-resistant strains with *Tlr4* mutations, yet susceptible to Gram-negative infection → [^5].
  - 2011 Nobel to Beutler and Hoffmann with Steinman → verified.
  - NLRs/inflammasome → IL-1β; RLRs; C-type lectins for fungal sugars → [^2].
- **Inflammation**
  - Celsus's four signs, ~2,000 years ago; *tumor* = swelling → [^7].
  - Histamine within minutes; arteriolar dilation (redness, heat); venular leak (swelling); stasis and margination → standard; Ley 2007.
  - PGE2 and bradykinin sensitize nociceptors; aspirin and ibuprofen inhibit COX; fever via IL-1/IL-6/TNF → hypothalamic PGE2 → standard.
  - Neutrophils 5–10 × 10¹⁰/day; circulating half-life 6–8 h (classic) → Summers 2010 [^8].
  - Roll (selectins) → stick (chemokine-activated integrins LFA-1/Mac-1 binding ICAM-1; CXCL8) → mostly paracellular transmigration at postcapillary venules → Ley 2007 [^9].
  - LAD-1 = CD18 defect; neutrophilia with little or no pus → standard.
  - Pus = dead neutrophils plus bacteria; resolution → standard.
  - Sepsis as a dysregulated host response, often from lung, abdominal or urinary sources, not necessarily bacteremia → Sepsis-3 (Singer 2016, PMID 26903338).
  - CRS → Chapters 9–10 (consistent).
- **Phagocytosis**
  - Metchnikoff, Messina 1882, rose thorns in starfish larvae, 1908 Nobel shared → Gordon 2008 [^10].
  - Lysosome fusion and reactive oxygen; *M. tuberculosis* survives in macrophages; opsonin from Greek "to prepare food" → standard.
- **Complement**
  - Dozens of proteins, mostly made in the liver; named for complementing antibodies; amplifying cascade; tag/call/punch → [^11].
  - Classical (C1q; can also bind some microbes directly), lectin (MBL, ficolins) and alternative (tick-over) pathways → C3 convertase → C3b/C3a; C5a; MAC = C5b–C8 plus multiple C9 → [^11].
  - CD55/CD46/CD59 and factor H; high levels on persisting tumors; C5a recruiting suppressive myeloid cells → [^11] (round 1 confirmed).
- **Interferons**: "interfere"; translation shutdown (PKR) and RNA cleavage (OAS/RNase L); more MHC-I; NK activation; flu-like symptoms → standard.
- **Clinic (Bastard 2020)**: ≥101/987 (~1 in 10) with life-threatening pneumonia; 0/663 mild or asymptomatic; 4/1,227 healthy → [^12] (PMID 32972996).
- **NK cells**
  - Innate lymphocytes; perforin and granzymes → apoptosis → [^15].
  - Kärre: the "missing self" term (thesis 1981) and the 1986 paper rejecting MHC-deficient RMA-S lymphoma by non-adaptive means → [^13].
  - Viral MHC-I downregulation; selective outgrowth of MHC-I-loss tumor variants → [^14] Garrido 2016.
  - Inhibitory KIRs bind HLA-A/B/C groups; CD94/NKG2A binds HLA-E loaded with HLA leader peptides; NKG2D binds MICA/MICB/ULBPs; NKp30, NKp46, DNAM-1; CD16-mediated ADCC → [^15] Lanier 2005.
  - KIR (chr 19) and HLA (chr 6) inherited separately; education/licensing → [^15].
  - NK limits: poor solid-tumor infiltration; shedding of NKG2D ligands; HLA-E upregulation; NKG2A blockade; CAR-NK → standard.
- **NK model figure**: presets give Healthy −0.76 Spare; Infected +0.61 Kill; Cancer kept window −0.26 Spare; Cancer emptied +0.62 Kill; flags 100%/window 90% +0.10 Undecided → recomputed. The graded T-cell note is consistent with Sykulev 1996 (round 1).
- **Imai 2000**: 3,625 residents, 11-year follow-up; medium or high NK activity → ~40% lower cancer risk; correlational → [^16].
- **Macrophages**
  - IFN-γ from NK and T cells plus microbial products → "fight"; IL-4/IL-13, IL-10 and TGF-β → "repair"; M1/M2 as spectrum labels with plasticity → [^17] Murray 2014.
  - TAM signals CSF-1, IL-10, TGF-β, lactate, hypoxia → standard.
  - Dvorak 1986 "wounds that do not heal" (leaky vessels, fibrin, fibroblasts, angiogenesis) → [^18].
  - *H. pylori*/gastric, HBV/HCV/liver and IBD/colon cancer → [^19] Coussens & Werb 2002.
- **Bridge to adaptive immunity**: DCs migrate via lymph to lymph nodes after PRR triggering and upregulate costimulatory molecules; adjuvants → [^1]; standard.
- **Limits**: a few dozen sensor types; no strain-level discrimination; microbial evasion → standard.
- **Trained immunity**: BCG; monocytes, macrophages and bone-marrow progenitors; epigenetic and metabolic basis; non-specific; months rather than decades; possible role in chronic inflammatory disease → [^20] Netea 2020.
- **Quiz**: all keys correct and distractors wrong (see S1 for the Q4 wording).
- **Glossary**: accurate except `microbe` (S4); lymphocyte matches Chapter 1.
- **Sources 1–20**: all exist with correct metadata (re-checked: 2, 6, 20 via PubMed; the rest verified in round 1, unchanged).
