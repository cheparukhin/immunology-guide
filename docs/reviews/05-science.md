# Science review: Chapter 5, "Killers, Helpers and Brakes" (`content/drafts/05-t-cells.md`)

Reviewer: scientific review (T-cell development, tolerance, cytotoxicity, checkpoints, exhaustion). Line numbers refer to the draft as of 2026-10-05.

## Overall assessment

This is an accurate, well-sourced chapter.

**What checks out**
- All 20 citations exist, and their authors, titles, journals, years, volumes and DOIs are correct.
- Almost every one supports the sentence it is attached to.
- The specific numbers all match the primary papers: Egerton's 3%, Stritesky's 6:1 ratio and 75% cortical deletion, Sansom's 19,293 and 3,980 genes, Yu's 3-fold, Purbhoo's 1/10/3, Lopez's 30 s/20 s/80 s/2 min, Halle's 2–16 per day, Tivol's 3–4 weeks, and scurfy's 16–25 days.
- The 2025 Nobel attribution is correct, and the Liston essay is real.
- The quiz answers are correct.

**What actually needs fixing**
1. The opening line says thymectomized mice "lost the ability to tell self from other". That misstates the experiment at the heart of the chapter.
2. The exhaustion figure puts the TOX "lock" only on terminally exhausted cells. In fact, stem-like progenitors are also TOX+ and need TOX.
3. The brakes figure shows PD-1 engagement slowing T-cell crawling. The evidence, including the chapter's own source, says the opposite.
4. The thymus figure has thymocytes arriving from the bone marrow already carrying a receptor and CD4/CD8.

The rest are precision issues:
- figure timings
- how the CTLA-4 knockout is drawn
- how cytotoxic terminally exhausted cells are
- a few citations that should point to the primary papers
- one over-generalization from Yu 2015

---

## Must fix

**M1. Hook misstates what neonatal thymectomy showed (line 11)**
- Quote: "Without a thymus, the body had lost the ability to tell self from other."
- Problem: Miller's mice had almost no T cells. They could not *respond* to foreign things: they were lymphopenic, wasted, picked up infections and accepted foreign skin. They did not lose self/non-self discrimination; they lost the "attack" arm. Ironically, removing the thymus slightly later (day 3) causes *autoimmunity*, because Tregs are lost (Nishizuka & Sakakura 1969, PMID 5823314). That observation led to Sakaguchi's Treg work. Miller's own account: "poorly developed lymphoid tissues, impaired immune responses and inordinate susceptibility to intercurrent infections" (Miller, *Immunol Rev* 2002;185:7–14, doi:10.1034/j.1600-065x.2002.18502.x, PMID 12190917).
- Rewrite: "Without a thymus, the body had lost much of its ability to recognize and reject what was foreign."
- Optional: in the Treg section, add one sentence saying that removing the thymus at day 3 instead caused autoimmune disease, the clue that led Sakaguchi to Tregs. Cite Sakaguchi et al., *J Immunol* 1995;155:1151–1164, PMID 7636184.

**M2. ch05-exhaustion: TOX "padlock" drawn only on terminally exhausted cells (lines 322–323, 331, 333, 337; step 3 at line 352; deep dive at line 363)**
- Problem: the spec gives the TOX padlock only to terminally exhausted cells. Stem-like (TCF1+) cells carry a sprout badge and no lock. "Padlocked cells change very little" after the brake is released. The deep dive opens "What keeps terminally exhausted cells from bouncing back? Part of the answer is TOX." Together these tell the reader that TOX is what separates terminal cells from the responsive reservoir. It is not.
  - TOX is expressed in, and required for, the TCF1+ progenitor pool. Without TOX's DNA-binding domain, the TCF1+ self-renewing subset collapses (Alfei et al., *Nature* 2019;571:265–269, doi:10.1038/s41586-019-1326-9, PMID 31207605).
  - TOX "was required for the programming of progenitor-like CD8+ T cells" (Yao et al., *Nat Immunol* 2019;20:890–901, doi:10.1038/s41590-019-0403-4, PMID 31209400).
  - Exhaustion "manifests first in TCF1+ precursor T cells" (Utzschneider et al., *Nat Immunol* 2020;21:1256–1266, PMID 32839610).
  - TOX locks the *whole lineage* into exhaustion, which is why even the progenitors' descendants re-exhaust and don't become normal memory cells after PD-1/PD-L1 blockade (Pauken et al., *Science* 2016;354:1160–1165, doi:10.1126/science.aaf2807, PMID 27789795).
  - What distinguishes terminal cells is loss of TCF1 and further differentiation (TIM-3 high, short-lived), not the presence of TOX.
- Fix:
  - Give every exhausted-lineage cell, stem-like ones included, a small "TOX" tag.
  - Reserve the padlock for *terminal* differentiation and label it "terminal" (or "TCF1 lost"), not "TOX". Rename the switch to "Show the locks".
  - Stem-like hover card: add "Also TOX+: already committed to the exhausted lineage."
  - Step 3 (line 352): "Persistent stimulation switches on TOX, which rewires which genes the cell can use and commits the whole responding family, reservoir included, to an exhausted identity."
  - Deep dive (line 363): "What keeps exhausted cells from returning to normal? Part of the answer is TOX… TOX is needed even by the stem-like reservoir: it commits the whole lineage. Once that program is in place, releasing a brake alone does not rewrite it: in mice, revived cells re-exhausted if antigen persisted and did not become normal memory cells [cite Pauken 2016]."

**M3. ch05-brakes Scene 2: PD-1 engagement makes the T cell "crawl more slowly" (line 260)**
- Quote: "PD-1 on the T cell engages PD-L1… the T cell crawls more slowly and kills less often."
- Problem: the best direct evidence shows the opposite. PD-1–PD-L1 interactions *block the TCR-induced stop signal*, so T cells keep moving. Blocking PD-1 or PD-L1 *lowered* T-cell motility and increased stable contacts (Fife et al., *Nat Immunol* 2009;10:1185–1192, doi:10.1038/ni.1790, PMID 19783989). The chapter's own source, Pardoll 2012 (ref 13), states that "PD1 engagement inhibits the TCR 'stop signal'". A figure that ties braking to slower crawling teaches the wrong mechanism, and Chapter 8 reuses it.
- Fix: replace "crawls more slowly" with "makes fewer lasting contacts, releases less IFN-γ and kills less often". Show this with a dimmer IFN-γ output and fewer completed kills, not with movement speed.

**M4. ch05-thymus: thymocytes arrive from bone marrow already carrying a TCR and CD4/CD8 (lines 48, 54, 80)**
- Quotes: step 1, "A new thymocyte arrives from the bone marrow carrying a freshly shuffled, random T-cell receptor"; THYMOCYTE ART, badges "4" and "8" shown from the start.
- Problem: bone-marrow progenitors enter the thymus with no TCR and without CD4 or CD8. They rearrange their receptor genes *inside* the thymus and only then become CD4+CD8+ ("double-positive") cells that face selection. The main text (line 21: "arrive from the bone marrow, build a random receptor…") is correct. The figure contradicts it.
- Fix:
  - Entry arrow label: "From bone marrow (receptor built here)".
  - Step 1 caption: "A young thymocyte, descended from a cell that came from the bone marrow, has just built its random T-cell receptor here in the thymus. Nobody knows yet…"
  - The cell can enter the stage already double-positive if the builder wants to skip the earlier stage. Just don't attribute the receptor to the bone marrow.

---

## Should fix

**S1. ch05-kill timer mixes reference points (lines 151, 160–162; steps 5–7)**
- Problem: Lopez 2013 times each event from a *different* start:
  - permeabilization ≤30 s after the killer cell's calcium signal;
  - repair "initiated within 20 seconds and completed within 80 seconds";
  - rounding "within 2 minutes of perforin permeabilization".

  A single running clock reading 30 s, then 80 s, then 2 min implies that repair is finished 80 s after the calcium signal. On a common clock it is roughly 110 s.
- Fix: label the clock "time since pores opened". Step 5: "0 s (pores open ~30 s after the T cell's calcium signal)". Step 6: "≤80 s: pores repaired". Step 7: "≤2 min: target rounds up". Also add a small note that DNA fragmentation and break-up take longer (tens of minutes), so step 7's end state shouldn't sit under the 2-min label. Source: Lopez et al., *Blood* 2013, PMID 23377437.

**S2. ch05-exhaustion understates terminally exhausted cells' killing (lines 331, 337)**
- Quote: hover card, "Terminally exhausted cell: … Still kills a little, rarely divides."
- Problem: in tumors, terminally exhausted CD8 cells are "the primary cytotoxic CD8+ T cells in the TME but are short-lived". About 80% of them express granzyme B, against 12% of progenitors, and progenitors "killed target cells no more efficiently than did naive CD8+ T cells" (Miller et al. 2019, ref 20, full text). The LCMV ordering (Wherry 2003, which loses lysis early) differs from this. Since the figure includes tumors, "kills a little" misleads.
- Fix: keep the terminal "Kill" light moderately lit and keep the stem-like "Kill" dim (already correct). New hover text: "Terminally exhausted cell: TCF1 lost; PD-1, TIM-3 and LAG-3 high. Still kills (in tumors these are the main killers) but rarely divides and is short-lived. Barely responds when PD-1 is released."

**S3. ch05-brakes CTLA-4 knockout drawn as one runaway clone (lines 248, 253)**
- Problem: Scene 1's T cell is CD8-blue, and in the knockout "daughter cells keep multiplying until they spill past the lymph-node outline". The knockout disease is polyclonal and driven by CD4 T cells: depleting CD4 cells prevented it, depleting CD8 cells did not (Chambers et al., *Immunity* 1997;7:885–895, PMID 9430233). Deleting CTLA-4 *only in Tregs* is enough to cause fatal autoimmunity (Wing et al., *Science* 2008;322:271–275, doi:10.1126/science.1160062, PMID 18845758). Pardoll (ref 13) likewise says CTLA-4's main physiological role is in CD4 helpers and Tregs.
- Fix:
  - In the knockout state, show many *different* T cells (varied TCR glyphs, mostly teal CD4) expanding, not only the primed clone. Alternatively, use a neutral T-cell color in Scene 1.
  - Change the chip to: "Mice born without CTLA-4: many T cells, mostly CD4 helpers, activate against self and invade organs; death by 3–4 weeks. Losing CTLA-4 from Tregs alone is enough to cause fatal disease."

**S4. Treg-mechanism claims cite a source that says the mechanism is unknown (lines 225, 294)**
- Quotes: "Regulatory T cells carry CTLA-4 permanently, which is one way they quietly disarm dendritic cells[^13]" and "That helps explain how Tregs… suppress responses[^13]".
- Problem: Pardoll supports the constitutive expression (CTLA-4 is a FOXP3 target). For the mechanism, though, it says "the mechanism by which CTLA4 enhances the immunosuppressive function of Treg cells is not known". The DC-disarming claim rests on Qureshi 2011 (ref 14) and Wing 2008.
- Fix: cite [^14] plus Wing 2008 (add it as a source) on both sentences.

**S5. PD-1 knockout "depends on genetic background" is cited only to the review (line 233)**
- Problem: Pardoll says only "relatively mild phenotypes". The strain dependence comes from the primary papers: lupus-like arthritis and glomerulonephritis in aged C57BL/6 mice (Nishimura et al., *Immunity* 1999;11:141–151, PMID 10485649), and the fatal dilated cardiomyopathy in BALB/c mice (ref 17).
- Fix: add Nishimura 1999 and cite it with [^17]: "…milder, slower and depends on genetic background: aged mice of one strain develop a lupus-like disease[new], while in another the attack targets heart muscle and can kill through heart failure[^17]."

**S6. Yu 2015 over-generalized (lines 111, 113)**
- Quotes: "The self-reactive cells found in healthy blood were, in fact, largely anergic[^6]" and "Removing every T cell that brushes against self would leave gaps in the repertoire that microbes could exploit[^6]."
- Problem: anergy was shown for the SMCY (male-antigen) specific CD8 cells in men, not for self-reactive cells in general. The "holes in the repertoire" point is the authors' *suggestion*, supported by an HCV-variant experiment. The study also covered only CD8 cells.
- Rewrite: "The male-protein-specific T cells in men, for example, were largely anergic[^6]." Then: "The authors argue that removing every T cell that brushes against self would leave gaps in the repertoire that microbes could exploit[^6]."

**S7. "CTLA-4… is a near-twin of CD28" (line 225; Chapter 4 line 426 uses the same phrase)**
- Problem: CD28 and CTLA-4 share only about 30% amino-acid identity. They are related family members that share the B7-binding MYPPPY motif. "Near-twin" implies near-identity.
- Rewrite: "It is a close relative of CD28 and binds the same B7 partners, but much more tightly." Flag the same fix to the Chapter 4 writer for continuity.

**S8. The epigenetic-stability claim lacks its primary source (line 363; figure line 333)**
- Problem: "Once that program is in place, releasing a brake alone appears unable to rewrite it" is cited implicitly to Khan 2019, which does not test blockade. So is the figure's "the new wave gradually dims… again". Pauken 2016 is the direct evidence: the exhausted epigenome was "minimally remodeled after PD-L1 blockade", and reinvigorated cells "became reexhausted if antigen concentration remained high".
- Fix: add Pauken KE et al., *Science* 2016;354:1160–1165, doi:10.1126/science.aaf2807, and cite it on both sentences.

**S9. Patient data in Miller 2019 is small and conditional (lines 309, 361)**
- Problem: the result comes from 25 melanoma patients treated with ipilimumab plus nivolumab. Progenitor frequency did *not* differ between responders and non-responders. Among responders, a higher share of progenitors correlated with longer response.
- Rewrite (main text): "…and in a small study of melanoma patients, responders whose tumors held more progenitor cells stayed in response longer[^20]." In the deep dive, add "in a study of 25 patients".

---

## Optional

- **O1.** Line 133 and the kill figure: Halle 2016 found that *in vivo*, killer T cells "remained migratory and formed motile kinapses rather than static synapses". Add half a sentence: "…and often happens during brief, moving contacts rather than a long, sealed embrace."
- **O2.** Line 129 ("usually a quiet, clean death"): the hedge is right. A Go-deeper line could note that granzymes can also cleave gasdermins and trigger *inflammatory* (pyroptotic) death in some tumor cells (Zhang et al., *Nature* 2020, PMID 32188940; Zhou et al., *Science* 2020, PMID 32299851). This is relevant to anti-tumor immunity later.
- **O3.** Line 296: PD-1/SHP2 preferentially dephosphorylates CD28, so both brakes converge on signal 2 (Hui et al., *Science* 2017, PMID 28280247; Kamphorst et al., *Science* 2017, PMID 28280249). This is a nice bridge to Chapter 8.
- **O4.** ch05-thymus AIRE-off organs (line 68): Aire-knockout mice characteristically attack retina, stomach, salivary gland and ovary (Anderson 2002). In APECED patients, the parathyroid, adrenal, skin (vitiligo/alopecia) and stomach are classic targets. Consider eye, stomach and salivary gland over thyroid. Many organ-specific genes are also AIRE-independent (e.g., Fezf2-controlled), so "keep about one in five" icons may understate what remains. "About a third" is safer.
- **O5.** ch05-thymus Treg output of 0.2 percentage points (about 7% of graduates) is on the high side: mouse thymic Foxp3+ cells are a few percent of CD4 single-positives. About 0.1 pp (1 per 1,000) would be closer. This is illustrative, so it's optional.
- **O6.** Line 123: "copied into thousands of clones" should be "copied thousands of times" (the copies together form one clone).
- **O7.** Subtitle "works relentlessly to make sure it never turns on you": autoimmune disease affects several percent of people. "…to keep it from turning on you" is more accurate.
- **O8.** Glossary `mhc-class-ii`: the thymus figure shows class II on thymic epithelial cells, so add "(and on thymic epithelial cells, where T cells are selected)". Glossary `effector-t-cell`: some effector CD4 cells (Tfh) stay in the node; "…ready to act, usually after leaving the lymph node" is safer.
- **O9.** If the builder relies on Wherry et al., *J Virol* 2003;77:4911–4927 (PMID 12663797) for the order of function loss (line 343), add it to Sources. It confirms that IL-2 and lysis go first, then TNF, with IFN-γ the most resistant. The figure merges TNF and IFN-γ into one light, which is fine.
- **O10.** Line 23, "ordinary self-peptides": cortical epithelial cells use a special thymoproteasome and proteases and display an unusual peptide set. Worth one clause in a Go-deeper box, not in the main text.
- **O11.** Line 192: contraction after acute infection is driven mainly by the intrinsic (Bim) pathway, with Fas contributing more under repeated stimulation. "Helps wind down" is acceptable as written.

---

## Verified as correct (safe to keep)

- All 20 sources exist with correct authors, titles, journals, years, volumes, pages and DOIs (PMIDs: 14474038, 12376594, 25224068, 2138780, 23487759, 25992863, 11138001, 41255104, 15048111, 23377437, 26872694, 30057419, 22437870, 21474713, 7584144, 1396582, 11209085, 31207603, 27501248, 30778252).
- Miller 1961: neonatal thymectomy caused lymphocyte deficiency, wasting, infections and failure to reject foreign skin grafts. "For centuries" the thymus's function was unknown (Miller 2002 retrospective).
- AIRE drives ectopic expression of peripheral-tissue antigens, including insulin, in medullary epithelium. Aire-deficient mice have a defined autoimmune profile, and human AIRE defects cause multi-organ disease (Anderson 2002).
- Thymic epithelial cells express up to 19,293 protein-coding genes, "the highest number known in any cell type". Aire alone induces 3,980. Expression in single cells is stochastic and at low frequency (Sansom 2014).
- Production of mature single-positive cells is 3% of double-positive production, matching thymic export (Egerton 1990).
- About 6 cells are deleted per complete positive selection; 75% of deletion happens at the cortical double-positive stage. TCR recognition is MHC-biased. Deleted CD4 cells signal only slightly more strongly than Treg precursors (Stritesky 2013). Its full text also gives about one-quarter of thymic apoptosis as negative selection, so the figure's 3/18/79 split is consistent.
- Self-specific CD8 cells occur in healthy blood at frequencies similar to foreign-specific ones. SMCY-specific cells are only 3-fold rarer in men (Yu 2015).
- Scurfy arose in 1949 at Oak Ridge. Hemizygous males die 16–25 days after birth. The cause, Foxp3, was identified in 2001. IPEX is the human counterpart.
- The 2025 Nobel Prize in Physiology or Medicine went to Brunkow, Ramsdell and Sakaguchi "for their discoveries concerning peripheral immune tolerance" (Liston 2025, real).
- A CTL detects a single pMHC, needs about 10 for a full calcium signal and a mature synapse, and about 3 to kill (Purbhoo 2004).
- Permeabilization within about 30 s; repair started within 20 s and finished within 80 s; rounding within 2 min. These were human primary cytotoxic lymphocytes (Lopez 2013).
- In vivo, one CTL kills 2–16 infected cells per day. Killing fails when MHC-I is downmodulated. Death is more likely after more than two CTL contacts (Halle 2016).
- The synapse is a bull's-eye with LFA-1/ICAM-1 ring. Lytic granules are secretory lysosomes delivered by centrosome polarization. Perforin binds membranes in a Ca2+-dependent way and oligomerizes into pores. Granzyme B activates caspases and acts on mitochondria through Bid.
- Help works through licensing via CD40L–CD40, which raises CD80/86/CD70 and IL-12. Helper and killer can meet the same DC sequentially. cDC1 cells are the help platform. "Helpless" CTLs are weaker and form poorer memory (Borst 2018).
- The Th1, Th2, Th17, Tfh and Treg descriptions are correct, and cytotoxic CD4 T cells exist.
- CTLA-4 has a much higher affinity for CD80/CD86. It is constitutive on Tregs, acts mainly at priming, and mostly sits inside the cell. Whether it signals directly is debated (Pardoll 2012).
- Trans-endocytosis and degradation of CD80/CD86 by CTLA-4 (Qureshi 2011).
- CTLA-4-knockout mice develop lymphoproliferation with severe myocarditis and pancreatitis and die by 3–4 weeks (Tivol 1995).
- PD-1 was cloned in 1992 in Honjo's Kyoto lab from cells undergoing programmed death (Ishida 1992). It is not itself a death inducer.
- PD-1 signals through SHP2. PD-L1 is induced by IFN-γ on tumor, epithelial and stromal cells. PD-L1 also binds CD80. PD-1 is also found on B and NK cells and can act early in lymphoid tissue (Pardoll 2012).
- PD-1-knockout BALB/c mice develop dilated cardiomyopathy with death from heart failure (Nishimura 2001).
- TOX is required for exhaustion, induced by calcineurin/NFAT2, and sustains itself in a feed-forward loop (Khan 2019).
- The PD-1+ stem-like subset (also ICOS+ and CD28+) depends on TCF1, sits in lymphoid T-cell zones, self-renews and supplies "almost exclusively" the burst after PD-1 blockade (Im 2016).
- Only progenitor exhausted TILs respond to anti-PD-1. Progenitors are polyfunctional and long-lived (Miller 2019).
- Function is lost in a hierarchy under chronic antigen: IL-2 and lysis first, then TNF, with IFN-γ last (Wherry 2003). The main text matches this.
- Abatacept is CTLA-4 extracellular domain fused to IgG1 Fc and is used in rheumatoid arthritis. Increased infections are a known risk.
- IFN-γ raises MHC-I and induces PD-L1. The feedback-loop framing matches Pardoll's "adaptive immune resistance".
- Quiz: all four keyed answers are correct, all distractors are wrong, and the explanations are accurate.
- Glossary: all definitions are accurate. See O8 for two small refinements.
