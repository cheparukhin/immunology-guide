# Self & Other — Master Plan

> An illustrated, interactive guide to the immune system and the new science of cancer immunotherapy, written for people with no biology background.

This document is the single source of truth for every contributor (human or agent). If something here conflicts with your instinct, follow this document and flag the conflict in your final report.

---

## 1. Vision

**Audience.** Intelligent, curious adults who are interested in the science itself and have little or no biology — popular-science readers (e.g. a software engineer, a designer, a journalist, a policy maker). Assume high-school biology has faded. Never assume they know what a protein, receptor or gene "does". The site is **not** primarily a patient guide: patients and families may read it, but the voice is that of explaining fascinating science, with honest, proportionate clinical context (no medical advice).

**Promise.** By the end, a reader can explain — accurately, in their own words — how the immune system tells self from non-self, why cancer is so hard for it to see, and how each major class of modern immunotherapy (checkpoint inhibitors, antibody drugs, bispecifics, ADCs, CAR-T/TIL/TCR-T, cancer vaccines, oncolytic viruses) works, what it achieves, and where it fails.

**Clear and deep — the layered model.**
1. **Main narrative**: readable on its own; a reader who never opens a box or touches a figure still gets the full story.
2. **Interactive figures**: each one teaches ONE idea that is easier to *see* or *play with* than to read. Never decoration.
3. **"Go deeper" boxes** (collapsible): molecular names, numbers, history, nuance, controversies, the edge cases. This is where real depth lives — a biologist should find nothing wrong and a few things new.
4. **Glossary popovers**: every technical term is defined on first use, and hover/tap shows a definition anywhere.

**Quality bar.** Bartosz Ciechanowski's explorables, Nicky Case, The Pudding, Distill, Kurzgesagt's clarity — but more elegant and calm. Beautiful, quiet, precise.

---

## 2. Voice & writing rules

> **Superseded in part (Oct 2026):** `docs/STYLE.md` is now the binding guide to language, voice and metaphors. Where it conflicts with this section (especially the "Canonical metaphors" table below, most of which has been retired), STYLE.md wins.

- Warm, precise, vivid. Short paragraphs (2–4 sentences). Concrete numbers and examples over abstractions.
- Write like Ed Yong or Siddhartha Mukherjee: story-driven, but every sentence carries information.
- Define every technical term on first use, in plain words, then use it consistently.
- Analogies are welcome but must be flagged as analogies, and important ones should state **where they break**.
- Prefer active voice; the cells are actors ("the dendritic cell carries…").
- No hype. Distinguish clearly between *established*, *promising*, and *speculative*. Give response rates honestly (most patients still don't respond to most immunotherapies).
- Drug names: generic first, brand in parentheses on first mention: "pembrolizumab (Keytruda)".
- Numbers: give orders of magnitude and ranges, with sources. If unsure of a precise number, use a range or say "roughly".
- State of knowledge: **as of October 2026** (today is 2026-10-05). Recent developments (2025–2026) are welcome when verified. For anything from 2024–2026, double-check it (PubMed / FDA / trial registries / Amass) and hedge if uncertain. Results known only from a company press release or topline announcement (not yet peer-reviewed) must be labeled as such ("the company reported…"). Never invent trial names, numbers, dates or citations. If you can't verify, leave it out.
- Verification tools (load via ToolSearch): PubMed ("pubmed"), Amass via REST helper `tools/amass.sh <core> "<query>" [param=value…]` (cores: regulatorycore for FDA/EMA approvals, trialcore for trials, biomedcore for literature, drugcore for drugs, genecore; key is read from ~/.env — never print it; 60 req/min), clinical trials ("c-trials"), plus WebSearch/WebFetch.
- Not medical advice. Chapters never tell a reader what treatment to choose.
- Avoid war metaphors as the *only* framing; they're fine occasionally ("defenders", "patrol") but the deeper story is about **recognition and information**.
- US English spelling.

**Binding style sheet:** the terminology table, canonical numbers and topic/story ownership in `docs/aggregate/EDITOR-REVIEW.md` → "Global decisions" (A–F) are binding for all writers and builders.

### Canonical metaphors (use these consistently across chapters)
| Concept | Metaphor | Where it breaks (mention in the chapter that introduces it) |
|---|---|---|
| Molecular recognition | Shape-fit, like a hand in a glove; binding strength = how snug the fit is (affinity) | Binding is dynamic: molecules constantly bind and let go |
| MHC class I | (Introduced lightly in Ch 2 for NK cells; Ch 4 owns the mechanism.) Every cell's **shop window**: it constantly displays chopped-up samples (peptides) of every protein it is making inside | MHC shows fragments, not whole proteins; only some fragments fit |
| MHC class II | The **evidence board** of professional presenter cells, showing what they have collected/eaten from outside | |
| Dendritic cell | **Scout and courier**: samples the scene, then travels to the lymph node to brief T cells | |
| Lymph node | **Briefing room / matchmaking hub** where rare matching T cells find their target | |
| T-cell receptor (TCR) | Each T cell carries one unique **search query**; the body holds a library of at least ~10^8 different ones (a sequencing-based statistical lower bound — not a direct count; one model suggests ~10^10) | |
| Clonal expansion | Find the one cell with the right query, then **photocopy** it millions of times | |
| Signal 1 + Signal 2 | **Two-factor authentication**: recognizing the target (1) isn't enough; a confirmation signal (2) is needed | |
| CTLA-4, PD-1 | **Brakes**; checkpoint inhibitors **release the brakes** | Brakes are not defects — they prevent autoimmunity, which is why side effects happen |
| Neoantigen | A **typo** in the cell's protein recipe that shows up in the shop window as a never-before-seen word | Most typos are invisible (not displayed, or not different enough) |
| Tumor microenvironment | A **fortified neighborhood** with walls (stroma), corrupt guards (Tregs, MDSCs, M2 macrophages) and poisoned air (TGF-β, adenosine, low oxygen) | |
| Hot / cold tumor | **Inflamed** (T cells inside) vs **ignored/desert** (no T cells) vs **excluded** (T cells stuck at the walls) | |
| Immunoediting | **Evolution under police pressure**: the visible get caught, the stealthy survive | |
| CAR-T | Giving T cells a **synthetic targeting system**; a **living drug** that multiplies | |
| Bispecific T-cell engager | A **molecular matchmaker / handcuff** that physically bridges a T cell to a cancer cell | |
| ADC | A **guided missile**: antibody = guidance, linker = fuse, payload = warhead | |

---

## 3. Structure (13 content pages + home, glossary, sources, about)

**Part I — The Defenders** (how the immune system works)
**Part II — The Enemy Within** (what cancer is and how it evades immunity)
**Part III — Turning the Tide** (immunotherapy)

| # | File | Title | Core question |
|---|---|---|---|
| 1 | `01-cells.html` | A Crash Course in Cells | What are cells, genes and proteins, and how do molecules "recognize" each other? |
| 2 | `02-innate.html` | The First Responders | How does the body react within minutes to anything that looks dangerous? |
| 3 | `03-adaptive.html` | A Library of Infinite Keys | How can the body make receptors for threats it has never seen? |
| 4 | `04-presentation.html` | How T Cells See | How do T cells know what is happening *inside* other cells? |
| 5 | `05-t-cells.html` | Killers, Helpers and Brakes | How do T cells kill, and what stops them from attacking us? |
| 6 | `06-cancer.html` | When Cells Go Rogue | What is cancer, and what makes a cancer cell look different? |
| 7 | `07-escape.html` | Hide and Seek | Why does the immune system usually win, and how do tumors escape? |
| — | `interlude-history.html` | 130 Years of Immunotherapy | From Coley's toxins to engineered cells: how did we get here? |
| 8 | `08-checkpoints.html` | Releasing the Brakes | How do checkpoint inhibitors work, for whom, and at what cost? |
| 9 | `09-antibodies.html` | Antibodies as Medicine | How do engineered antibodies, ADCs and bispecifics attack cancer? |
| 10 | `10-cell-therapy.html` | Living Drugs | How do CAR-T, TIL and TCR-T therapies work, and why are solid tumors hard? |
| 11 | `11-vaccines.html` | Teaching the Body to See | Can we vaccinate against cancer — preventively and therapeutically? |
| 12 | `12-frontier.html` | The Frontier | What limits immunotherapy today, and what's coming next? |

Also: `index.html` (home), `glossary.html`, `sources.html`, `about.html` (who it's for, how it was made — with AI assistance —, medical disclaimer).

### Chapter scopes (what each chapter MUST cover, and what it can assume)

Each chapter may assume everything in earlier chapters. Brief recaps ("Remember the shop window from Chapter 4?") with a link are encouraged. Do not re-teach in depth what an earlier chapter owns.

**Ch 1 — A Crash Course in Cells.** Scale (body → tissue → cell → protein); the cell as a city; DNA → RNA → protein (the recipe metaphor); proteins as shaped machines; receptors and signals; molecular recognition, affinity, binding/unbinding; what "self" means at molecular level; the immune system census (how many immune cells, where they live: blood, lymph nodes, spleen, bone marrow, tissues; ~1.8 trillion immune cells, Sender et al. 2023 PNAS). Sets up: a single-letter change in DNA can change a protein.
*Figure ideas:* ch01-scale (powers-of-ten zoom slider from hand to antibody); ch01-gene-to-protein (stepper: DNA→mRNA→protein folding, with a "mutate one letter" button); ch01-binding (play with shape fit & affinity; molecules bind/unbind over time); ch01-census (unit chart of immune cell types and where they live).

**Ch 2 — The First Responders (innate immunity).** Barriers; resident sentinels; pattern recognition (PAMPs/DAMPs, Toll-like receptors — the "alarm system for generic danger"); inflammation step-by-step (cytokines, vasodilation, neutrophil recruitment/extravasation; redness/heat/swelling/pain explained); phagocytosis; complement (briefly); interferons; NK cells and **missing-self** (directly relevant to cancer cells that drop MHC-I); limits of innate immunity (generic, no memory) — motivating adaptive immunity. Macrophage M1/M2 flexibility (preview of tumor-associated macrophages).
*Figures:* ch02-inflammation (stepper: splinter → bacteria → macrophage alarm → leaky vessel → neutrophils roll, stick, squeeze through → engulf); ch02-pattern-recognition (match danger patterns to receptors); ch02-nk-missing-self (sliders for MHC-I level and stress-ligand level; NK cell's balance tips to kill/spare).

**Ch 3 — A Library of Infinite Keys (adaptive immunity).** The problem of unpredictable pathogens; B and T cells; V(D)J recombination (gene-segment shuffling + junctional randomness → >10^15 possible receptors; ~10^7–10^8 distinct TCRs actually present in a person); clonal selection & expansion; antibodies (structure: variable tips, constant Fc stem; functions: neutralization, opsonization, complement, ADCC — set up Ch 9); affinity maturation (in Go deeper); memory and why vaccines work (primary vs secondary response). Note: T cells see differently — explained in Ch 4.
*Figures:* ch03-vdj (slot-machine style gene-segment shuffle that builds a unique receptor; shows combinatorics); ch03-clonal-selection (population sim: antigen arrives, matching clones expand, contract, leave memory; second exposure is faster/bigger, with a response-curve plot); ch03-antibody (explore antibody anatomy and switch between its four jobs).

**Ch 4 — How T Cells See (antigen presentation & activation).** MHC class I shop window (proteasome → TAP → ER → MHC-I → surface); healthy vs virus-infected vs mutated cell displays; HLA = human MHC, highly variable between people (why it matters for transplants and for personalized vaccines); MHC class II & professional antigen-presenting cells; dendritic cells: sampling, maturation, migration to lymph node, **cross-presentation** (crucial for cancer); the needle-in-a-haystack search in lymph nodes (~1 in 10^5–10^6 naive T cells match a given antigen); three signals (TCR–pMHC; CD28–B7 costimulation; cytokines) — two-factor authentication; anergy when signal 2 is missing.
*Figures:* ch04-mhc1-pathway (stepper inside a cell; toggle healthy/virus/cancer); ch04-dc-journey (DC travels from tissue to lymph node, T cells scan, one matches and multiplies); ch04-three-signals (toggle signals 1/2/3, see outcome: ignore / anergy / activation / effector differentiation).

**Ch 5 — Killers, Helpers and Brakes.** Thymic education (positive & negative selection, AIRE, most candidates die); CD8 cytotoxic T cells and the kill (immunological synapse, perforin, granzymes, Fas; serial killing); CD4 helpers as orchestrators (licensing DCs, helping B cells & CD8s; Th1 especially); regulatory T cells; peripheral tolerance; the brakes: CTLA-4 (competes with CD28 for B7, acts mainly in priming), PD-1 (with PD-L1/PD-L2, acts mainly in tissues); why brakes exist (autoimmunity — CTLA-4 knockout mice die of autoimmunity); **T-cell exhaustion** under chronic stimulation (progenitor-exhausted TCF1+ cells vs terminally exhausted — Go deeper).
*Figures:* ch05-thymus (sort candidate T cells: too weak → die by neglect; too strong vs self → deleted; just right → graduate); ch05-kill (stepper: synapse formation, granule polarization, perforin pores, granzyme entry, apoptosis, T cell detaches & moves on); ch05-accelerator-brakes (T-cell activity meter driven by TCR, CD28, CTLA-4, PD-1, cytokines; a time mode shows exhaustion under chronic stimulation).

**Ch 6 — When Cells Go Rogue (cancer biology).** Cancer as evolution inside the body; mutations (causes: copying errors, UV, tobacco, etc.); drivers vs passengers; oncogenes (accelerator stuck) & tumor suppressors (broken brakes) — careful not to confuse with immune brakes; hallmarks of cancer including **avoiding immune destruction** (Hanahan & Weinberg 2011/2022); clonal evolution and heterogeneity; why cancer is hard for immunity (it's "altered self"); tumor antigens: neoantigens (from mutations), tumor-associated antigens (overexpressed self, e.g., HER2), cancer-testis antigens (e.g., NY-ESO-1, MAGE-A4), viral antigens (HPV E6/E7); tumor mutational burden varies >1000-fold across cancers (melanoma & smoking-related lung cancer high; pediatric & many leukemias low); clonal vs subclonal neoantigens; mismatch-repair deficiency/MSI-H.
*Figures:* ch06-clonal-evolution (tissue sim: cells divide, mutations appear, a driver clone takes over, a branching tree/fish plot emerges); ch06-typo-to-target (choose a mutation and follow it: DNA → protein → peptide → MHC → does a T cell see it? most don't); ch06-tmb (dot/strip chart of mutational burden across cancer types, with sources).

**Ch 7 — Hide and Seek (immunosurveillance & escape).** Evidence the immune system controls cancer (immunodeficient mice & transplant patients get more cancers, especially virus-driven; tumors with more T cells do better); immunoediting's three Es — elimination, equilibrium, escape (Dunn & Schreiber); the **cancer-immunity cycle** (Chen & Mellman 2013; 7 steps) — this chapter owns it, later chapters reference it; escape mechanisms: hiding (MHC-I/B2M loss, antigen loss), braking (PD-L1), recruiting corrupt guards (Tregs, MDSCs, M2/tumor-associated macrophages), walls (cancer-associated fibroblasts, stroma), poisoning the air (TGF-β, IDO, adenosine, lactate, hypoxia), deafness to interferon (JAK1/2 loss); hot vs excluded vs cold tumors.
*Figures:* ch07-immunoediting (evolution sim: tumor cells with variable visibility; immune pressure slider; watch the three Es unfold with a population chart); ch07-cycle (interactive 7-step cancer-immunity cycle wheel: click a step → what happens, how tumors break it, which therapies fix it, with chapter links — reused in Ch 12); ch07-tme (switch between inflamed / excluded / desert tumors; reveal each suppressive player).

**Interlude — 130 Years of Immunotherapy.** A short, story-driven history: William Coley (1891); Ehrlich's "magic bullet" and immune surveillance (Burnet & Thomas); BCG for bladder cancer (1976); Köhler & Milstein monoclonal antibodies (1975); interferon & IL-2 (and Steven Rosenberg's work, TIL beginnings); rituximab (1997) & trastuzumab (1998); Honjo's PD-1 (1992) & Allison's CTLA-4 blockade (1996); the long winter of skepticism; ipilimumab (2011); anti-PD-1 (2014); first CAR-T (2017); first tissue-agnostic approval (pembrolizumab for MSI-H, 2017); Nobel Prize 2018; 2020s: TIL therapy (lifileucel, 2024), TCR-T (afamitresgene autoleucel, 2024), bispecifics for solid tumors, neoadjuvant immunotherapy, personalized mRNA vaccines in late-stage trials. Verify every date.
*Figures:* int-timeline (an interactive, beautiful horizontal timeline filterable by modality, each milestone opening a short card).

**Ch 8 — Releasing the Brakes (checkpoint inhibitors).** How blocking antibodies work physically; anti-CTLA-4 (ipilimumab; acts mostly in lymph node priming, possibly also Treg depletion — Go deeper) vs anti-PD-1/PD-L1 (pembrolizumab, nivolumab, atezolizumab…; acts mostly in tumor); the "tail of the curve" — durable responses (e.g., CheckMate 067 long-term survival in melanoma); which cancers respond; biomarkers (PD-L1, TMB, MSI-H/dMMR & tissue-agnostic approvals, T-cell inflamed signatures) and their limits; combinations (ipi+nivo; nivo+relatlimab/LAG-3); failures (e.g., TIGIT, IDO1 epacadostat) and what they taught; immune-related adverse events (why: the brakes protect organs — colitis, thyroiditis, hepatitis, pneumonitis, skin, hypophysitis, rare myocarditis), managed with steroids; patterns of response (pseudoprogression is rare but real); Jimmy Carter's story (2015) as human anchor — verify facts.
*Figures:* ch08-two-brakes (lymph node vs tumor scenes; add anti-CTLA-4 or anti-PD-1 and see which brake is released, and where); ch08-tail (stylized survival curves: chemo vs ipilimumab vs nivolumab+ipilimumab in metastatic melanoma, with real long-term numbers and sources; explain plateau); ch08-side-effects (body map of immune-related adverse events; hover organs).

**Ch 9 — Antibodies as Medicine.** Monoclonal antibodies: hybridoma → chimeric → humanized → fully human (the -omab/-ximab/-zumab/-umab naming, plus the 2021+ WHO INN scheme in Go deeper — verify); mechanisms: blocking growth signals (trastuzumab/HER2, cetuximab/EGFR), flagging for destruction (rituximab/CD20 via ADCC, complement, phagocytosis), blocking blood-vessel signals (bevacizumab, briefly), antibody–drug conjugates (trastuzumab deruxtecan; linker, payload, bystander effect, drug-to-antibody ratio), bispecific T-cell engagers (blinatumomab CD19×CD3; teclistamab/elranatamab BCMA×CD3; glofitamab/epcoritamab CD20×CD3; tarlatamab DLL3×CD3 in small-cell lung cancer; tebentafusp gp100–HLA×CD3 as first TCR-based bispecific in uveal melanoma); side effects (CRS for bispecifics, payload toxicities for ADCs).
*Figures:* ch09-humanization (slider morphs a mouse antibody to fully human; mouse parts colored; name suffix updates); ch09-mechanisms (tabbed gallery animating block / flag / deliver payload / bridge); ch09-adc (step-through: bind → internalize → linker cleaved → payload kills → bystander effect toggle).

**Ch 10 — Living Drugs (cell therapies).** CAR anatomy (scFv binder, hinge, transmembrane, costimulatory domain CD28 or 4-1BB, CD3ζ) and generations; manufacturing vein-to-vein (apheresis, viral transduction, expansion, lymphodepletion, infusion; weeks and costs); successes (CD19 in B-cell leukemia/lymphoma; BCMA in myeloma; long-term remissions incl. the first patients ~10+ years later — verify Emily Whitehead, Melenhorst 2022 Nature); toxicities: CRS (IL-6, tocilizumab), ICANS; antigen escape; secondary T-cell malignancy boxed warning (2024) — verify; why solid tumors are hard (antigen heterogeneity, on-target/off-tumor toxicity, trafficking, hostile TME, exhaustion); solutions: armored CARs, logic-gated CARs (AND/NOT, synNotch), allogeneic/off-the-shelf, CAR-NK, in vivo CAR-T (early 2025–26 data — hedge); TIL therapy (lifileucel, melanoma 2024); TCR-T (afami-cel, synovial sarcoma 2024, MAGE-A4, HLA-restricted) — CAR sees surface proteins without MHC, TCR sees intracellular peptides on HLA; CAR-T for autoimmune disease (lupus) as a fascinating Go deeper.
*Figures:* ch10-journey (vein-to-vein stepper with a day counter); ch10-build-a-car (assemble a CAR from domains; see generations and trade-offs); ch10-crs (cytokine cascade over time; give tocilizumab/steroids and see it settle); ch10-logic-gates (tumor + healthy cells with antigen combos; choose OR/AND/NOT logic and see who gets killed).

**Ch 11 — Teaching the Body to See (vaccines & oncolytic viruses).** Preventive vaccines against cancer-causing viruses (HPV → cervical & other cancers; HBV → liver cancer) — the biggest cancer-vaccine success; why therapeutic vaccines historically disappointed (wrong antigens, tolerance, weak adjuvants, suppressive TME, too-late disease); sipuleucel-T (2010) as a modest first; personalized neoantigen mRNA vaccines: sequencing tumor vs normal, predicting MHC binding (algorithms/AI), choosing up to ~34 neoantigens, LNP-mRNA, combined with anti-PD-1 (intismeran autogene / mRNA-4157 / V940 + pembrolizumab in melanoma, KEYNOTE-942 phase 2b and phase 3 status — verify; autogene cevumeran in pancreatic cancer, Rojas et al. Nature 2023 and follow-up — verify); off-the-shelf shared-antigen vaccines (e.g., KRAS); oncolytic viruses (T-VEC 2015 for melanoma) as in-situ vaccines; BCG for bladder cancer.
*Figures:* ch11-hpv (chart: cervical cancer reduction by vaccination age, sourced); ch11-personal-vaccine (pipeline explorer; the reader ranks candidate peptides by predicted binding and clonality, and sees which tumor clones are covered); ch11-oncolytic (virus infects only tumor cells, bursts them, releases antigens + danger signals, immune system joins in).

**Ch 12 — The Frontier.** Primary vs acquired resistance (antigen loss, B2M/MHC loss, JAK1/2 loss, exclusion); turning cold tumors hot (radiation, some chemotherapies, STING agonists, oncolytics); combinations (and why many fail); **neoadjuvant immunotherapy** — treating before surgery (e.g., NADINA trial in melanoma, NEJM 2024; dostarlimab in dMMR rectal cancer, Cercek et al. NEJM 2022 and later updates — verify); the gut microbiome & response (FMT trials, Baruch 2021, Davar 2021 Science); biomarkers, liquid biopsy (ctDNA) & AI; next-gen targets (myeloid cells, CD47 — and why magrolimab failed; NK engagers; cytokine engineering); cost and access; closing: questions a patient or family might ask a doctor, clinical trials (clinicaltrials.gov), warning about clinics selling unproven "immunotherapies". End on honest hope.
*Figures:* ch12-combinations (reuse the cancer-immunity cycle; select therapies and see which steps each boosts; flag known synergies); ch12-neoadjuvant (compare before-surgery vs after-surgery treatment: why the tumor in place acts as a vaccine — T-cell clone expansion visualization); ch12-resistance (map of resistance mechanisms; click to see how each breaks a step).

**Home (`index.html`).** Hero with an ambient animated scene (T cells patrolling tissue, one recognizing and killing a cancer cell); headline + one-paragraph pitch; "the big idea in 30 seconds" (a 3-step mini interactive: self vs non-self → cancer hides → therapy reveals); three Part sections with chapter cards; "How to read this guide" (layers); credits/disclaimer link.

---

## 4. Art direction

**Concept: "the luminous microscope".** The page is warm paper; figures are windows into a living, glowing microscopic world. Elegant, calm, scientific — not cartoonish. **No faces or eyes on cells.** Cells are recognizable by silhouette, texture and color, always with labels.

### Page palette (light theme)
- Paper `#FAF7F2`, surface `#FFFFFF`, ink `#1B1F2A`, ink-2 (secondary text) `#4A5163`, ink-3 (muted) `#7A8194`, rule `#E6E0D6`.
- Accent (links/UI) `#3D5AFE`-ish indigo, tuned for contrast. Final values are owned by the foundation (tokens.css).
- Dark theme: deep ink background (`#0E121B`), light text; the page must look equally good in both.

### Figure stages
- **Dark stage** (default for biology scenes): deep navy radial gradient `#0B1024 → #131B36`, subtle vignette, optional faint particle drift. Cells glow softly.
- **Light stage** (charts, timelines, schematics): paper/surface background with ink lines.
- Labels: Inter (or chosen UI sans), small caps optional, with thin leader lines. Keep in-SVG text minimal and large; long explanations go in the HTML caption below the stage.

### Cell & molecule palette (fluorescent on dark; must also read on light)
| Entity | Color | Silhouette cues |
|---|---|---|
| Healthy body cell | sand `#E9C9A1` | calm rounded polygon, neat round nucleus |
| Cancer cell | violet-magenta `#B65FD8` | irregular, lumpy membrane, large misshapen nucleus, sometimes 2 nuclei |
| CD8 killer T cell | electric blue `#4C8DFF` | round, small, fine microvilli fuzz, visible TCR glyphs |
| CD4 helper T cell | teal `#2EC4C9` | like CD8 but teal |
| Regulatory T cell | slate-lavender `#8C95C9` | like T cell, desaturated |
| B cell / plasma cell / antibodies | amber-gold `#F2B33D` | round with Y-shaped receptors; antibodies as gold Ys |
| NK cell | orange `#FF8A3D` | round, visible granules |
| Macrophage | coral `#FF7A6B` (M1) / dusky rose `#B7727E` (M2/TAM) | large, amoeboid, ruffled edges, vacuoles |
| Dendritic cell | green `#4FD18B` | star-shaped with long, waving dendrites |
| Neutrophil | pale pink `#F4A6C8` | round with multi-lobed nucleus, granules |
| MDSC | muted olive `#A7A35A` | small, irregular |
| Fibroblast / stroma | gray-beige `#9C8F80` | spindle-shaped |
| Bacteria | chartreuse `#B5D94A` | rods/cocci |
| Virus | red-coral `#FF4D5E` | small icosahedral with spikes |
| MHC molecule | pale silver `#D9DEEA` | small cup on the membrane |
| Self peptide | sand `#E9C9A1` | small bead held in MHC cup |
| Foreign / neo-peptide | hot pink `#FF3D7F` | bead held in MHC cup, glowing |
| Cytokines / signals | color of the sending cell | small glowing dots, drifting |
| Inhibitory signal (brakes) | crimson-red accent `#E5484D` + a "minus"/bar icon | never rely on color alone |
| Activating signal | bright green-cyan `#3DDC97` + a "plus"/arrow icon | never rely on color alone |
| Drugs (antibody-based) | gold (antibody family) with a white outline highlight | |

Colorblind safety: every distinction carried by color must also be carried by shape, icon, label or position.

### Motion
- Purposeful, physical, slow-ish easing (ease-in-out, gentle springs). Membranes may breathe subtly. Nothing flashes.
- Every animated figure honors `prefers-reduced-motion` (jump to end states; no ambient loops).
- Animations pause when off-screen and when the tab is hidden.

### Typography (foundation finalizes)
- Display: **Fraunces** (soft optical serif) for titles.
- Body: **Source Serif 4** (or Newsreader) at ~19–20px, line-height ~1.6, measure ~68ch.
- UI/labels/figures: **Inter**.
- Self-host fonts (woff2) under `assets/fonts/` so the site works offline.

---

## 5. Technical architecture

- **Static site, no build step.** Plain HTML + CSS + native ES modules. Must work served from any static host, from a subpath (e.g., GitHub Pages `/repo/`). → **All paths are relative. All HTML pages live at the repo root.**
- **Vendored libraries only** (no CDN at runtime): GSAP 3 (free, incl. plugins like MotionPath, MorphSVG, DrawSVG) under `assets/vendor/gsap/` for timelines/tweens. Everything else hand-written. No frameworks.
- SVG for most figures; Canvas 2D for crowds/particle simulations (>~150 moving objects). DPR-aware canvases, capped at 2×.
- Figures are **lazy-loaded** modules: `<figure class="fig" data-figure="ch04-mhc1-pathway">` → `assets/js/figures/ch04-mhc1-pathway.js` is imported when the figure nears the viewport; it exports a `mount()` function (exact contract defined by the foundation in `docs/FIGURES.md`).
- A no-JS / failure fallback: each figure contains a short text description (also used as screen-reader description).
- Responsive: phone (360px) to wide desktop. On narrow screens figures must stay legible — re-layout (portrait viewBox) instead of shrinking text to unreadable sizes. No horizontal page scroll. 16px side gutter on phones.
- Theming: CSS custom properties on `:root`; dark theme defined under `@media (prefers-color-scheme: dark)` guarded by `:root:not([data-theme="light"])`, and again under `:root[data-theme="dark"]`; `body` has an explicit background. A theme toggle sets `data-theme` on `<html>`.
- Accessibility: semantic HTML, keyboard-operable controls, visible focus, ARIA live regions for step captions, contrast ≥ 4.5:1 for text, `prefers-reduced-motion` honored.
- Performance: no figure runs animation loops while off-screen; total JS per page small; images are SVG.

### Repository layout
```
index.html, 01-cells.html … 12-frontier.html, interlude-history.html, glossary.html, sources.html, about.html
assets/css/        tokens.css, base.css, layout.css, components.css, figures.css (+ optional per-chapter css)
assets/js/site.js  page bootstrap: nav, TOC, progress, theme, glossary popovers, figure lazy-loader, quizzes
assets/js/ui/      reusable UI components (stepper, slider, toggle, segmented control, tooltip, …)
assets/js/art/     illustration library: parametric SVG cells & molecules (see docs/ART.md)
assets/js/figures/ one module per figure: <figure-id>.js
assets/data/       glossary.json, chapters.json (site map), sources.json
assets/vendor/     gsap
assets/fonts/      self-hosted woff2
content/drafts/    chapter drafts (Markdown with directives — see §6)
docs/              PLAN.md (this), DESIGN.md, FIGURES.md, ART.md, WRITING.md, REVIEW-*.md
tools/             dev-only QA tooling (Playwright screenshots etc.); not part of the site
```

### File ownership (many agents work in parallel — respect this strictly)
- Foundation agent owns: `assets/css/*`, `assets/js/site.js`, `assets/js/ui/*`, `assets/vendor/*`, `assets/fonts/*`, `assets/data/chapters.json`, `docs/DESIGN.md`, `docs/FIGURES.md`, `tools/*`, page template.
- Art agent owns: `assets/js/art/*`, `docs/ART.md`, `art-gallery.html` (dev page).
- Chapter writer for chapter N owns: `content/drafts/NN-*.md` only.
- Chapter builder for chapter N owns: `NN-*.html`, `assets/js/figures/chNN-*.js`, optional `assets/css/chapters/chNN.css`.
- Never edit files you don't own. If you need a change in a shared file, describe it precisely in your final report; the supervisor will route it.

---

## 6. Draft format (`content/drafts/NN-slug.md`)

Markdown plus a few fenced directives. The builder converts this to HTML.

```markdown
---
id: 04-presentation
title: How T Cells See
subtitle: One-sentence dek that makes someone want to read.
part: I
reading_time: 22
---

Opening hook paragraph(s)…

## Section heading

Text with glossary terms marked like {{mhc|MHC molecules}} (id|display text) on first use in the chapter.
Inline citations as [^3] referring to the numbered sources list.

:::figure ch04-mhc1-pathway
title: The shop window
goal: After using this, the reader understands that every cell displays fragments of its internal proteins, and that a mutated or viral protein produces a different display.
kind: stepper | simulation | explorer | chart
stage: dark | light
spec: |
  A precise, buildable description: what's on screen, layout, every element and its look,
  what the reader can do (controls), what changes in response, each step's state.
  Mention what should be emphasized visually. Mention mobile layout if non-obvious.
steps:            # for steppers: one line per step, the caption shown under the stage
  1. …
  2. …
data: |           # for charts: the numbers, with source for each
  …
alt: A 2–4 sentence textual description for screen readers and no-JS fallback.
:::

:::deep-dive Why only some peptides fit
Text…
:::

:::key-idea
One or two sentences that the reader must not miss.
:::

:::clinic
A short real-world/clinical connection.
:::

:::quiz
Q: Question?
- [ ] Wrong option — why it's wrong (one sentence)
- [x] Right option — why it's right (one sentence)
- [ ] Wrong option — why
:::

:::takeaways
- 4–6 bullets
:::

## Glossary
- mhc | MHC (major histocompatibility complex) | Plain-language definition, 1–2 sentences.

## Sources
1. Author A, et al. Title. *Journal* Year;vol:pages. doi:… (or PMID)
```

Length guide: main narrative ~2,000–3,000 words; Go-deeper boxes another ~800–1,500 words; 3–4 figures; 1 quiz (3–4 questions); 4–6 takeaways; 8–20 sources (prefer landmark papers and authoritative reviews; every specific number should be traceable).

---

## 7. Process

1. **Plan** (this doc) — supervisor.
2. **In parallel:** Foundation (design system, shell, components, QA tools) · Art library · Chapter drafts.
3. **Review drafts:** per chapter, science accuracy + reader clarity → revisions. Then an **aggregate whole-book pass**: the complete sequence read end-to-end, by an editor (arc, redundancy, gaps, consistency of terms/metaphors/numbers, cross-references, difficulty curve, voice) and by a naive reader (does understanding accumulate?) → coordinated revisions.
4. **Build:** one builder per chapter (HTML + figures) on top of foundation & art.
5. **QA:** visual (desktop + phone, light + dark), interaction, console errors, accessibility, science re-check of figures → fixes. Repeat until clean.
6. **Assemble:** home, glossary, sources, about; cross-links; final full-site pass.
