# Science review: Chapter 2, "The First Responders" (`content/drafts/02-innate.md`)

Reviewer: scientific review (innate immunity: inflammation, pattern recognition, NK cells, macrophages). Line numbers refer to the draft as of 2026-10-05.

## Overall assessment

This is a strong, accurate chapter. All 20 citations exist, and every one matches its authors, title, journal, year, DOI and PMID. Each also supports the sentence it is attached to. The key numbers check out against the primary sources: neutrophil output and half-life, the Bastard 2020 COVID autoantibody counts, the Imai 2000 cohort, and the 10 human TLRs. The history is correct: Janeway 1989, Lemaitre/Hoffmann 1996, Medzhitov 1997, Poltorak/Beutler 1998, the 2011 Nobel, Metchnikoff, Kärre 1986 and Dvorak 1986. M1/M2 is handled exactly as it should be, as labels for the ends of a spectrum, and the figure spec bakes in plasticity. The quiz answers are correct. I found two things that are actually wrong and need fixing. First, the main-text definition of sepsis ("an infection spreads through the blood"). Second, a "SCIENCE: DO NOT CHANGE" rule in the pattern-recognition figure that would draw cGAS–STING as one free-floating molecule. The remaining issues are figure-level precision: how NLRP3 and ATP are sensed, TLR7/9 in a human macrophage, and T cells shown as "blind" at partial MHC-I loss. There are also a few one-line corrections.

---

## Must fix

**M1. Sepsis is defined as a bloodstream infection (line 189)**
- Quote: "When an infection spreads through the blood and the alarm sounds everywhere at once, vessels leak all over the body, blood pressure falls and organs can fail. This is {{sepsis|sepsis}}."
- Problem: this reinforces the common "blood poisoning" misconception. The current consensus definition (Sepsis-3) is "life-threatening organ dysfunction caused by a dysregulated host response to infection". Bloodstream infection is not required: sepsis often starts from pneumonia or from abdominal or urinary infections, with negative blood cultures. Sepsis-3 also explicitly criticizes the older "excessive focus on inflammation". Singer M et al. *JAMA* 2016;315:801-810, doi:10.1001/jama.2016.0287, PMID 26903338. The glossary entry (line 595) is already essentially correct.
- Suggested rewrite: "Sometimes the response to an infection, often one that started in the lungs, belly or urinary tract, spirals out of control and starts harming the body's own organs. Alarm signals flood the bloodstream, vessels leak all over the body, blood pressure falls and organs can fail. This is {{sepsis|sepsis}}. The microbes need not be in the blood; the danger is the body's runaway response." (Optionally add Singer 2016 as a source.)

**M2. ch02-pattern-recognition: STING drawn as a free-floating cytoplasmic sensor (lines 64–65, 135, 139–140)**
- Quotes: "Free-floating in the INTERIOR (not attached to any membrane): … 7 'Misplaced-DNA sensor' (cGAS–STING)". The "SCIENCE: DO NOT CHANGE" rule says: "RIG-I, cGAS and NLRP3 are in the cytoplasm and are not membrane-bound."
- Problem: cGAS is the DNA sensor. STING is its downstream adapter and a multi-pass transmembrane protein of the endoplasmic reticulum (Ishikawa & Barber, *Nature* 2008;455:674-678, doi:10.1038/nature07317, PMID 18724357; cGAS: Sun L et al., *Science* 2013;339:786-791, doi:10.1126/science.1232458, PMID 23258413). A free-floating glyph labeled "cGAS–STING" is a visible error to any biologist, and the rule tells the builder to enforce it.
- Fix: make the molecular-name label for sensor 7 "cGAS". The readout and Go-deeper text can say "signals through STING". Reword the rule: "TLR4, TLR5 and Dectin-1 sit on the outer surface; TLR7/8 and TLR9 sit in the digestion-bubble membrane. RIG-I, cGAS and NLRP3 work in the cell interior (cytoplasm), never inside the bubble or on the outer surface. If STING is drawn at all, it sits on a small ER-membrane fragment, not free." (Also see S1 for NLRP3.)

---

## Should fix

**S1. ch02-pattern-recognition: NLRP3 shown gripping ATP and crystals, sensed "inside" (lines 66, 85, 92, 119–123; analogy at line 33)**
- Problem: NLRP3 does not bind ATP or uric-acid crystals.
  - Extracellular ATP is detected at the cell surface by the P2X7 channel. The resulting potassium efflux activates NLRP3 (Mariathasan S et al., *Nature* 2006;440:228-232, doi:10.1038/nature04515, PMID 16407890).
  - Crystals are swallowed and rupture the digestion bubble, and that disturbance trips NLRP3.
  - The spec's "sensor head closes around the token" therefore misdepicts the one sensor that works by monitoring cell disturbance rather than by binding a ligand. Line 33 also says "each pattern-recognition receptor fits its target molecule as snugly as any receptor in Chapter 1", which is not true of NLRP3.
- Fix:
  - Crushed-cell animation: ATP dots touch the outer membrane (optionally a small "ATP gate"), and a pulse travels inward. The crystal shard is engulfed and its bubble ruptures. NLRP3 then assembles and glows without grabbing any token.
  - Change the readout "Where" to: "At the surface and inside the sentinel. The damage sensor reacts to the disturbance these spilled molecules cause, not to the molecules themselves."
  - Line 33: "most pattern-recognition receptors fit their target molecule as snugly as any receptor in Chapter 1".

**S2. ch02-pattern-recognition: TLR7 and TLR9 placed in a human macrophage (lines 63, 135)**
- Problem: the "Show molecular names" toggle invites scrutiny. Human monocytes lack TLR7 and express little TLR9. In human blood, TLR7 and TLR9 are mainly in plasmacytoid dendritic cells and B cells (Hornung V et al., *J Immunol* 2002;168:4531-4537, doi:10.4049/jimmunol.168.9.4531, PMID 11970999). Human monocytes and macrophages sense single-stranded RNA mainly through TLR8. Mouse macrophages do use TLR7 and TLR9. The "acceptable simplifications" line (149) covers this in principle, but readers never see that line.
- Fix: label sensor 4 "TLR8 (and TLR7)". Add a one-line legend note under the toggle: "In humans, TLR9 works mainly in other immune cells (plasmacytoid dendritic cells, B cells); macrophages are shown with the full set for simplicity."

**S3. ch02-nk-missing-self: killer T cells "Blind" whenever badges are below 30% (line 400)**
- Quote: "Any type & badges < 30%: 'Blind: the window is nearly empty.'"
- Problem: CD8 T cells are extraordinarily sensitive. About 3 peptide–MHC complexes per target gave half-maximal killing, and a single complex can trigger lysis (Sykulev Y et al., *Immunity* 1996;4:565-571, doi:10.1016/S1074-7613(00)80483-5, PMID 8673703). Partial MHC-I loss impairs T-cell recognition; only complete loss (for example, B2M loss) makes a cell invisible. Showing "Blind" at 15% teaches the wrong threshold.
- Fix: graded logic:
  - badges = 0: "Blind: there is no window at all."
  - 0 < badges < 30%: "Struggling: only a few windows left to read; it may miss this cell."
  - Keep the ≥30% texts as they are.

**S4. Uric acid "crystals" spilling out of cells (line 37; glossary line 584; figure readout line 121)**
- Quote: "spill molecules that belong inside them, such as the energy molecule ATP, DNA or crystals of uric acid."
- Problem: uric acid is dissolved inside cells. Released in large amounts by dying cells, it crystallizes as monosodium urate in the fluid outside them (Shi Y, Evans JE, Rock KL, *Nature* 2003;425:516-521, doi:10.1038/nature01991, PMID 14520412).
- Rewrites:
  - Line 37: "…such as the energy molecule ATP, DNA, or uric acid, which forms tiny needle-like crystals once it is outside."
  - Glossary: "…such as ATP, DNA or uric acid (which crystallizes once outside the cell)…"
  - Readout: "Molecules that belong inside cells (ATP, DNA, uric acid) spilled outside, where uric acid forms crystals."

**S5. "LPS looks much the same on thousands of bacterial species" (line 33)**
- Problem: the outer sugar chain of LPS (the O-antigen) varies enormously. It is the basis of hundreds of serotypes, such as *E. coli* O157. TLR4–MD-2 recognizes the conserved fatty anchor, lipid A, which is a "common pattern in structurally diverse LPS molecules" (Park BS et al., *Nature* 2009;458:1191-1195, doi:10.1038/nature07830, PMID 19252480).
- Rewrite: "The part of LPS that TLR4 senses, a fatty anchor called lipid A, looks much the same on thousands of bacterial species, so one receptor covers them all."
- Bonus example for "Microbes evolve around it" (line 526): the plague bacterium *Yersinia pestis* remodels its lipid A at body temperature so TLR4 barely sees it (Montminy SW et al., *Nat Immunol* 2006;7:1066-1073, PMID 16980981).

**S6. Medzhitov 1997 overstated (line 516)**
- Quote: "In 1997, Medzhitov and Janeway showed that switching on a human Toll-like receptor does exactly this.[^4]"
- Problem: the paper expressed a constitutively active human Toll (TLR4) in human cell lines. It showed NF-κB activation, induction of IL-1, IL-6 and IL-8, and expression of B7.1. It did not study dendritic cells, migration or lymph nodes (PMID 9237759).
- Rewrite: "In 1997, Medzhitov and Janeway showed that switching on a human Toll-like receptor in cultured cells turns on one such confirmation molecule, B7.1.[^4]"

**S7. Quiz Q2 distractor explanation (line 549)**
- Quote: "Nerves pump extra fluid into the area — nerves produce the pain, not the leak."
- Problem: the explanation is partly false. Sensory nerve endings release neuropeptides (substance P, CGRP) that widen vessels and can increase leakage, a process called neurogenic inflammation (Chiu IM, von Hehn CA, Woolf CJ, *Nat Neurosci* 2012;15:1063-1067, doi:10.1038/nn.3144, PMID 22837035). The distractor itself is still wrong, because nerves do not pump fluid.
- Rewrite of the explanation: "— nerves don't pump fluid; the swelling is plasma leaking out through loosened blood-vessel walls."

---

## Optional

- **NK model and red blood cells (lines 345, 388–391).** The model kills any cell with zero badges, because of the 0.2 "everyday activating signals". The cleanest counter-example also teaches the two-signal logic: red blood cells carry no MHC class I, but NK cells leave them alone because they also lack activating ligands. Consider one sentence in the main text, and possibly let a "red blood cell" case set the everyday signal to 0.
- **Complement cuts both ways in cancer (line 318).** The draft's own source, Ricklin 2010, notes that complement fragments (C5a) can promote tumor growth by recruiting suppressive myeloid cells. One clause would add honest nuance.
- **Macrophage slider label (line 480).** "All clear: IL-4, IL-10, TGF-β": IL-4 and IL-13 are type-2 (anti-worm or allergy) signals rather than "all clear" signals. Suggest "Calm-down and repair signals: IL-4, IL-10, TGF-β".
- **NK memory.** The text says NK cells "kill without prior training" and that innate cells lack specific memory. Consider one sentence in the trained-immunity box: NK cells can form long-lived, memory-like populations after cytomegalovirus infection (Sun JC, Beilke JN, Lanier LL, *Nature* 2009;457:557-561, PMID 19136945).
- **"Few bacteria survive the trip" (line 293).** Add "…though some, like the tuberculosis bacterium, have evolved to live inside macrophages."
- **Glossary MHC class I (line 603).** "fragments of the cell's own proteins" → "fragments of the proteins the cell is making, including any viral or mutated ones". The current wording undercuts the point of the window.
- **Interferon legend (lines 99–101).** "Inflammatory alarm (cytokines)" vs "Antiviral alarm (interferon)" implies interferons are not cytokines. Use "Inflammatory cytokines" vs "Interferons (antiviral cytokines)".
- **Sizes.** Macrophage size differs across specs: about 18 µm in Ch 1, "≥20 µm" here (line 144), and "≥2× a neutrophil", i.e. about 25–30 µm (line 255). Suggest "about 1.5× a neutrophil or more". NK cells (large granular lymphocytes) are slightly larger than resting T cells (line 420).
- **Pattern figure rule (line 143).** "exactly the same response" conflicts slightly with trained immunity and endotoxin tolerance. Suggest "the macrophage does not learn the specific suspect".
- **Inflammation figure, step 3 (line 227).** The widening vessel is a venule. The deep-dive correctly says small arteries relax. The caption could add "upstream small arteries relax, so more blood pours into vessels like this one."
- **Line 327.** "chop up foreign-looking RNA": the interferon-induced RNase L, once triggered by viral double-stranded RNA, cuts RNA indiscriminately. "chop up RNA to stall the virus" is safer.
- **Line 168.** Cite Sun 2013 (PMID 23258413) for "cGAS signals through STING" instead of, or alongside, Woo 2014.
- **Quiz Q4, option 2 (line 558).** "Tell dendritic cells that the adaptive immune system should respond" reads oddly, because DCs are themselves innate cells. Suggest "Switch on dendritic cells so they tell the adaptive immune system to respond".
- **Line 343.** "They called the principle missing self": Kärre coined the term in his 1981 thesis, and the 1986 paper supplied the evidence. "Kärre called the principle…" is more precise.

---

## Claims verified as correct

- Refs 1–20: all exist; authors, titles, journals, years, volumes/pages, DOIs and PMIDs match PubMed; each supports its sentence. Ricklin 2010 explicitly supports "majority of persisting tumors express high amounts of membrane-bound complement regulators".
- Janeway 1989 PAMP/PRR prediction and the "immunologist's dirty little secret" (PMID 2700931).
- Lemaitre/Hoffmann 1996, Strasbourg: the Toll pathway controls the antifungal response, and mutant flies die of fungal infection (PMID 8808632).
- Medzhitov 1997: human Toll induces NF-κB, IL-1/6/8 and B7.1 (PMID 9237759).
- Poltorak/Beutler 1998: C3H/HeJ (missense) and C57BL/10ScCr (null) *Tlr4* mutants are LPS-resistant yet susceptible to Gram-negative infection (PMID 9851930).
- 2011 Nobel: Beutler and Hoffmann shared it with Steinman (dendritic cells).
- Humans have 10 TLRs; the surface vs endosomal assignments and ligands (TLR3 dsRNA, TLR7/8 ssRNA, TLR9 CpG DNA, TLR4 LPS, TLR5 flagellin) are correct.
- Celsus's four cardinal signs, about 2,000 years ago (Medzhitov 2010).
- Mechanisms of redness/heat, swelling and pain; PGE2 in the hypothalamus causes fever; COX inhibition by aspirin and ibuprofen.
- Neutrophils: 5–10 × 10^10 made per day; circulating half-life 6–8 h by classic estimates (Summers 2010, PMID 20620114).
- Leukocyte adhesion cascade: selectins, then chemokine (CXCL8) activation of integrins (LFA-1, Mac-1), then ICAM-1 and mostly paracellular transmigration; exit at postcapillary venules (Ley 2007).
- LAD-1: CD18 defect, neutrophilia, little or no pus.
- Metchnikoff: Messina 1882, rose thorns in starfish larvae, 1908 Nobel shared with Ehrlich.
- Complement: three pathways converge on C3; C3b/C3a, C5a, MAC = C5b–C9 with multiple C9; CD55, CD46, CD59 and factor H regulators; "microbes normally lack complement regulators" (Ricklin 2010).
- Type I interferon effects: translation shutdown, more MHC-I, NK activation, flu-like symptoms.
- Bastard 2020: ≥101/987 critical patients; 0/663 mild or asymptomatic; 4/1,227 healthy; 95/101 men (PMID 32972996).
- Woo 2014: tumor DNA in host APCs drives cGAS–STING–IRF3 and is needed for spontaneous CD8 priming in mice (PMID 25517615).
- Kärre 1986: H-2-deficient lymphoma variants are rejected by a non-adaptive mechanism (PMID 3951539).
- NK biology: perforin and granzymes; KIRs bind HLA-A/B/C groups; NKG2A binds HLA-E loaded with HLA leader peptides; NKG2D binds MICA/MICB/ULBPs; CD16 mediates ADCC; education/licensing; KIR and HLA are inherited separately.
- Imai 2000: 3,625 residents "mostly older than 40", 11-year follow-up, RR 0.63 (high) and 0.59 (medium), i.e. about 40% lower risk (PMID 11117911).
- NK decision model: the presets give the stated verdicts (Healthy −0.76 Spare; Infected +0.61 Kill; Cancer kept badges −0.26 Spare; Cancer dropped badges +0.62 Kill; flags 100%/badges 90% +0.10 Undecided).
- M1/M2 presented as the ends of a spectrum with plasticity (Murray 2014); TAM-polarizing signals (CSF-1, IL-10, TGF-β, lactate, hypoxia) are appropriate.
- Dvorak 1986, "wounds that do not heal"; Coussens & Werb 2002; *H. pylori*/HBV/HCV/IBD and cancer risk.
- Trained immunity: BCG, monocytes and bone-marrow progenitors, epigenetic and metabolic basis, non-specific, possible downside in chronic inflammation (Netea 2020).
- Quiz: all four keyed answers are correct and all distractors are wrong (see S7 for one explanation).
- Glossary: all entries are accurate apart from DAMP (S4) and the MHC class I nuance (Optional).
