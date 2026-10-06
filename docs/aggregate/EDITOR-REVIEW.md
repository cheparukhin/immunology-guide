# Self & Other: editor-in-chief's aggregate review

Scope: all 13 chapters, read in order from `docs/aggregate/book-reading-copy.md`. I confirmed cross-chapter claims by grepping `content/drafts/*.md`. The running notes are in `docs/aggregate/editor-ledger.md`.
Audience: the supervisor clarified mid-review that the primary reader is a curious popular-science adult, not a patient. This review is written for that reader.

---

## Executive summary

**Verdict: the book works and needs one coordinated revision pass, not a restructure.** Understanding builds cleanly from molecular touch (Ch 1) to the cancer-immunity cycle (Ch 7), and each therapy chapter maps back onto that cycle. Metaphors and recurring numbers are consistent, and every chapter hands off cleanly.

**Top 5 issues**
1. **Six broken promises or wrong cross-references:**
   - Ch 4 misquotes Ch 2 ("ID badge").
   - Ch 1's puzzle about weak T-cell receptors is never solved in Ch 4.
   - Ch 1's avidity promise to Ch 3 is never kept.
   - Ch 5's CTLA-4 toxicity story never reaches Ch 8.
   - Ch 6's cancer-testis deaths don't match Ch 10.
   - Ch 2's NK promise gets half a clause in Ch 12.
2. **The Interlude spends Part III's anchor stories** (Carter, Emily, NADINA, the vaccine trials). IDO1, Ott's CD4/CD8 split and two quiz concepts repeat 3–5×.
3. **Patient-guide drift.** Ch 12's ~550-word "If it's you…" section and the clinic boxes in Ch 8 and Ch 10 are off-audience.
4. **Drift where chapters meet:**
   - "excluded" becomes "walled off"
   - "cold tumor" is defined two ways
   - B2M and MSI are spelled several ways
   - Ch 8's "accelerator" contradicts Ch 5's
   - Ch 1 uses the MHC glyph for generic receptors
   - Ch 7 understates what CAR-T and engagers bypass
5. **Production defects.** Ch 10 has a duplicated paragraph under an empty heading, and Ch 4 and Ch 5 put takeaways before the quiz.

**Weakest chapter: Ch 12.** **Edits: 11 MUST, 40 SHOULD.**

---

## Arc, proportion and the reader's experience (brief)

- **Accumulation.** Nothing important is used before it is taught, except as a flagged preview: Chapter 2 previews the shop window and killer T cells, and Chapter 7 previews the therapies on its wheel. **Melanoma** is used undefined in Chapters 5 and 6, then defined in Chapter 7 and again inline in Chapter 8.
- **Difficulty curve.** It is smooth, with two steep stretches.
  - Chapter 4 carries the heaviest conceptual load: class I/II, HLA, cross-presentation and three signals. It is well scaffolded and needs no change.
  - Chapter 8 is the most number-dense chapter (survival curves, hazard ratios, many trials). I recommend moving two paragraphs into a deep dive.
- **Proportion.**
  - Part I is about 32k words, Part II about 13.7k, the Interlude about 3.9k, and Part III about 31.8k.
  - For a science-first reader this balance is right. Cancer is threaded through every Part I chapter via clinic boxes and closing hooks. **Do not rebalance.**
  - Every main narrative (about 3,800–4,400 words) exceeds PLAN's 2,000–3,000-word guide. Given the audience, **accept the current length and cut only the redundancy listed below.**
- **Voice.** It is consistent: warm, precise, honestly hedged, with no hype, and company-reported results are always labeled. Chapter 10 is punchier, which works well. Chapter 12's final section slips into second-person advice, and that is the one real voice break.
- **What a reader will remember.**
  - The shop window, the typo and the brakes.
  - "Self is learned."
  - The tail of the curve.
  - CAR-T as a living drug whose fever comes from the patient's own macrophages.
  - "Twelve out of twelve; one in five."
- **What a reader will wish they had learned.**
  - How a weak-gripping T-cell receptor makes razor-sharp decisions. This was promised in Chapter 1, and the engineers in the audience will want it most.
  - Where NK-cell and myeloid therapies stand.
  - Both are fixed below.
- **Why Chapter 12 is the weakest.** Its resistance and neoadjuvant sections are excellent. But its final 20% is a patient guide, now off-audience. "What's next" is a thin scoreboard with less mechanism than any other Part III section. It retells material others own (IDO1 a fourth time). And it under-delivers two inbound promises: NK cells (from Chapter 2) and the lymph-node supply (from Chapter 8, which is only implicit).
- **What to cut.** Cut only what is listed: Chapter 12's patient section, Chapter 10's duplicate, and the repeated stories and deep-dive retellings. That is about 1,300 words in total. No chapter should be cut wholesale.

---

## Global decisions

### A. Terminology style sheet

| Concept | Preferred form | Replace / avoid |
|---|---|---|
| CD8 T cell | **"killer T cell"** by default. Use "CD8 killer T cell" or "CD8 T cell" when contrasting with CD4 or in deep dives. | "cytotoxic T cell" (glossary alias only), "CTL", "CD8+" |
| CD4 T cell | "helper T cell"; "CD4 helper T cell" when contrasting | "Th cell" except Th1 and similar subsets |
| MHC | "MHC class I", then "class I"; "MHC class II", then "class II". Use **"HLA"** only for human genetic variation (types, alleles, matching). | "MHC-I", "MHC I", "MHC-II" in prose or figure labels |
| PD-1 ligand | "PD-L1" (and "PD-L2") | "PDL1", "B7-H1" (history only) |
| Neoantigen | "neoantigen"; "clonal" or "subclonal neoantigen" | "neoepitope", "neopeptide" |
| Repair defect | First use in a chapter: **"mismatch-repair deficient (MSI-high)"**. After that, either "mismatch-repair-deficient" or "MSI-high". | "dMMR" (glossary alias only), "MSI-H", "MSI" alone, "mismatch repair (also called MSI)" |
| Microsatellite status in charts | "MSI-high" / "MSS" | "MSI-H" |
| B2M | First use in the book (Chapter 7): **"beta-2-microglobulin (B2M)"**. After that, "B2M". | "β2-microglobulin", "β2m" |
| Tumor immune profiles | **inflamed / excluded / desert**. "Hot" means inflamed. "Cold" means desert, noting once that it is often stretched to cover excluded. | "walled off", "immune-desert", "non-inflamed" |
| Bispecific | "T-cell engager" (a bispecific antibody); "TCR-based engager" for tebentafusp | "BiTE" (brand-like), "bispecific T-cell engager" (use once at most) |
| Cell therapies | "CAR-T cell(s)", "TIL therapy", "TCR-T" | "CAR T", "CAR-T-cell" |
| Checkpoint drugs | "checkpoint inhibitor"; "anti-PD-1", "anti-PD-L1", "anti-CTLA-4" | "ICI", "immune checkpoint inhibitor" (once at most) |
| Melanoma | Define at first use (Chapter 5) through the glossary link | inline re-definitions after Chapter 7 |
| Spelling | US: "tumor" | "tumour" (allowed only in cited titles) |

### B. Metaphor canon: confirmations and fixes

> **Superseded (Oct 2026)** by the metaphor decisions in `docs/STYLE.md`.

- **Confirmed, used consistently:** hand-in-glove (Ch 1), shop window (introduced in **Ch 2** with its break, deepened in Ch 4), evidence board, scout/courier, briefing room, search query, photocopy, two-factor authentication, brakes (with "no empty road" break), typo, fortified neighborhood, police pressure, guided missile, matchmaker/handcuffs, living drug.
- **Accelerator means CD28 / signal 2 (Chapter 5).** Do not reuse "accelerator" for recognition (fix in Ch 8). Other uses are fine as named here:
  - "Pressing the accelerator" (Interlude) is fine; it means pushing T cells with cytokines or bacteria.
  - Oncogene gas pedals (Ch 6) are fine; Chapter 6 explicitly separates them from immune brakes.
- **Key/lock (Chapter 3)** is allowed because of the chapter title. Chapter 3 already ties it back to Chapter 1's glove.
- **Glyphs:** a silver cup means MHC only (see the figure notes).

### C. Canonical numbers

| Claim | Value | Owner | Must match |
|---|---|---|---|
| Immune cells in an adult | ~1.8 trillion, ~1.2 kg | Ch 1 | — |
| Human protein-coding genes | just under 20,000 | Ch 1 | Ch 3, Ch 10 ✔ |
| Possible TCRs | ~10^15 | Ch 3 | — |
| **Personal TCR repertoire** | **at least 10^8 by direct count; ~10^10 by one model** | Ch 3 | PLAN §2 (currently 10^7–10^8; update it) |
| Naive precursor frequency | roughly 1 in 100,000 (range 1 in 10^4 to 1 in 10^6); mouse example 1 in 200,000 | Ch 4 | Ch 3, Ch 9 ✔ |
| Class I / class II peptide length | 8–10 aa / ~13–25 aa | Ch 4 | Ch 6 ✔, **Ch 11 ✗ (says 8–11)** |
| HLA alleles | >45,000 (mid-2026) | Ch 4 | — |
| Thymocytes that graduate | ~3% | Ch 5 | — |
| CTLA-4 knockout mice | die by 3–4 weeks | Ch 5 | Ch 8 ✔ |
| **Cancers caused by infection** | **~2.2 million a year (2018), about 13%, "roughly one in eight"** | Ch 6 | **Ch 11 ✗ ("more than one in ten")** |
| TMB spread | typical types ~150-fold; individual tumors >1,000-fold | Ch 6 | — |
| Mutations in MSI-high tumors | ~10× more | Ch 6 | Ch 8 ✔ |
| Neoantigens actually recognized | ~1.6% of protein-changing mutations | Ch 6 | Ch 6 figure ✔ |
| HLA loss of heterozygosity (LOH) in non-small-cell lung cancer | ~40% | Ch 7 | — |
| US checkpoint eligibility / response (2023) | ~57% eligible / ~20% respond | Ch 8 | Interlude ✔, Ch 12 ✔ |
| CheckMate 067 | 10-yr overall survival 19 / 37 / 43%; median 19.9 / 36.9 / 71.9 months | Ch 8 | Ch 12 ✔ |
| Ipilimumab's first survival trials | 2010: 10.0 vs 6.4 months; 2011: 9.1 → 11.2 months | Ch 8 | Interlude ✔ (Ch 8 must name both) |
| Fatal immune side effects | ~1 in 270 / 1 in 90 / 1 in 80 | Ch 8 | — |
| CAR-T secondary T-cell cancers | 22 cases in >27,000 doses | Ch 10 | — |
| Emily Whitehead | April 2012, age 6 | Ch 10 | Interlude ✔ |
| Jimmy Carter | August 2015, age 90 | Ch 8 | Interlude (remove there) |
| KEYNOTE-942 | HR 0.56 (about 44% lower risk), borderline | Ch 11 | Interlude ✔ |
| INTerpath-001 | 1,137 pts; met primary endpoint in August 2026 (company-reported) | Ch 11 | Interlude ✔ |
| NADINA | 1-yr event-free survival 84% vs 57% | Ch 12 | Interlude ✔ |
| Relapsed melanomas on anti-PD-1 | 4 patients: 2 lost JAK1/2, 1 lost B2M | Ch 12 | Ch 7 ✔ |

### D. Ownership of recurring topics and stories

| Topic / story | Owner | Others shrink to |
|---|---|---|
| Shop window (MHC class I) | Ch 2 introduces it; Ch 4 owns the mechanism | Others: one-line recap |
| Accelerators and brakes, CTLA-4 vs PD-1 biology | Ch 5 | Ch 8 "Brakes, briefly" is already right-sized ✔ |
| Stem-like (TCF1) reserve and the LCMV burst | Ch 5 | Ch 8: one back-reference sentence; Ch 8 owns "clonal replacement and revival" |
| Cancer-immunity cycle | Ch 7 | Ch 12: one-paragraph recap ✔ |
| Jimmy Carter | Ch 8 | Interlude: remove |
| Emily Whitehead, CRS and tocilizumab | Ch 10 | Interlude: one clause, with no CRS or tocilizumab detail |
| IDO1/epacadostat | Ch 8 | Ch 7: one sentence ✔; Ch 12: one clause in main text, no deep-dive retelling |
| Mylotarg withdrawal and accelerated approval | Interlude | Ch 9: one clause |
| Ott 2017 CD4 60% / CD8 16% | Ch 11 (main text) | Ch 6: one clause; Ch 11 deep dive: no repeat of the numbers |
| Median survival and survival curves | Ch 8 | Interlude clinic box (keep, it is needed earlier); Ch 9: delete its parenthetical |
| NADINA / S1801 | Ch 12 | Interlude: drop the numbers |
| Personalized vaccine trials | Ch 11 | Interlude: drop the numbers |
| Rosenberg's KRAS G12D patient | Ch 6 | — (told once ✔) |
| Köhler & Milstein | Ch 9 | Interlude: brief ✔ |
| Immunosurveillance history and the 1974 nude mice | Ch 7 | Interlude: brief, with its pointer ✔ |
| Missing self / NK cells as backstop | Ch 2 | Ch 4 and Ch 7: one-liners ✔; Ch 12 adds the therapy status |

### E. Format conventions (for writers and the builder)

- Block order at a chapter's end: **quiz, then takeaways**. Chapters 4 and 5 must swap.
- Chapter links: writers may use plain "Chapter N" or markdown links. **The builder auto-links plain "Chapter N" and "the Interlude".** No writer action needed.
- Quiz rationales: the builder normalizes the separator (". No:", " — ", ". —"). No writer action needed.

### F. Glossary harmonization (for whoever assembles `glossary.json`)

Use the owner chapter's definition. Specific conflicts to resolve:
- **`cold-tumor`**: Ch 7 means desert only; Ch 8 means desert *or* excluded. Canonical text: *"Cold tumor: informal term for a tumor with few or no T cells inside. Strictly a 'desert', though often also used for 'excluded' tumors whose T cells are stuck at the edges."*
- **`msi-high`**: canonical head is *"Mismatch-repair deficient (MSI-high)"*, using Ch 6's definition plus "Also abbreviated dMMR."
- **`checkpoint`**: Ch 11 defines this id as "Checkpoint inhibitor". Point that text at `checkpoint-inhibitor` instead (Ch 11 edit #6).
- **`mhc-class-i`**: Ch 12's "The molecule every cell uses" is wrong. Use Ch 4's "nearly every cell with a nucleus".
- **`b2m`**: *"Beta-2-microglobulin (B2M)"*.
- **`neoantigen`**: use Ch 4's definition (it carries the typo metaphor).

### G. PLAN updates (for the supervisor)

- In PLAN §2, change the TCR "library of ~10^7–10^8" to "at least 10^8 different receptors (direct count), perhaps ~10^10".
- Note that the shop window is introduced in Ch 2, because NK cells need it.
- Record the audience clarification in §1, so that patient-facing material stays brief.

---

## Edits by chapter

Each edit gives the quote or location, the problem, and the fix. Paired edits are cross-referenced as "↔".

### 01-cells.md (0 MUST · 2 SHOULD)
1. **[SHOULD] Fallback, only if Ch 4 #2 is not done.**
   - Quote 1: *"How T cells nonetheless make exquisitely precise decisions with such fleeting grips is one of the puzzles of Chapter 4."*
   - Quote 2: *"That distinction matters for T cells (Chapter 4)."*
   - Problem: Ch 4 currently never addresses either point.
   - Preferred fix: Ch 4 #2 delivers both.
   - Fallback: replace the first sentence with *"How T cells nonetheless make exquisitely precise decisions with such fleeting grips is still being worked out."*, and delete the second.
2. **[SHOULD] Figure ch01-binding.**
   - Problem: the spec draws generic receptors as "pale silver (#D9DEEA)" cups, but from Ch 4 on, a silver cup *is* MHC ("In this book's figures, an MHC molecule is drawn as a small silver cup").
   - Fix: redraw generic receptors in a neutral slate or ink-2 tone with a different notch shape, and update step caption 1 ("Receptors (silver cups)") to *"Receptors (cups)"*.

### 02-innate.md (0 MUST · 1 SHOULD)
1. **[SHOULD] ↔ Ch 12 #5.**
   - Quotes: *"Boosting NK cells, with cytokines, NK-cell engagers, antibodies that block NKG2A, or engineered CAR-NK cells, is an active research area (Chapter 12)."* and *"NK cells often struggle to get inside solid tumors (Chapters 7 and 12)."*
   - Fix: no text change if Ch 12 #5 lands. If it doesn't, delete both "(Chapter 12)" pointers.

### 03-adaptive.md (1 MUST · 0 SHOULD)
1. **[MUST] Avidity: honor Ch 1's promise.**
   - Ch 1 says of avidity: "Chapter 3 returns to it." The word never appears again.
   - Quote: *"The two identical variable tips each grab the epitope, so one antibody can hold two copies of its target at once."*
   - Append: *"— the avidity of Chapter 1, which makes a two-armed antibody grip far harder than either arm alone."*

### 04-presentation.md (2 MUST · 1 SHOULD)
1. **[MUST] Wrong back-reference.**
   - Quote: *"Chapter 2 called it an ID badge, because NK cells check that it is there. Up close, the badge turns out to be a **shop window**: a continuously refreshed display…"*
   - Problem: Ch 2 never says "ID badge"; it already named and explained the shop window.
   - Fix: *"Chapter 2 introduced it as the cell's **shop window**, and showed that NK cells notice when it goes dark. Up close, the window is a continuously refreshed display…"*
2. **[MUST] Deliver Ch 1's T-cell-receptor affinity puzzle ↔ Ch 1 #1.**
   - Add a deep dive at the end of "Peptide plus groove". This content will appeal most to the science-first reader. Writer to verify and cite: McKeithan 1995 (kinetic proofreading), Valitutti 1995 (serial engagement), Purbhoo 2004 (already Ch 5 [^10]).
   - Suggested text:
   > :::deep-dive How a weak grip makes a sharp decision
   > Chapter 1 left a puzzle. A T-cell receptor grips its peptide–MHC a thousand to a million times more weakly than a mature antibody grips its target, and each contact lasts only seconds. How can so loose a grip make one of biology's most precise decisions? Three tricks seem to combine. **Time as a filter** ("kinetic proofreading"): binding starts a chain of chemical steps inside the T cell, and the signal goes through only if the receptor stays bound long enough for the chain to finish. A slightly wrong peptide that lets go a little sooner rarely completes it, so a small difference in how long a grip lasts becomes a large difference in signal. **Many brief contacts**: one peptide–MHC can engage several receptors in turn, so a handful of correct peptides among thousands of self peptides can still add up; a killer T cell can detect a single one and kill with about three (Chapter 5). **A steadying hand**: CD8 or CD4 grips the side of the MHC molecule, stabilizing the contact and bringing signaling enzymes close. The details are still debated. One consequence matters later: engineer a receptor to grip much harder (Chapter 10) and the time filter stops discriminating, so it can start reacting to the wrong targets.
   > :::
3. **[SHOULD] Block order.** Move `:::quiz` before `:::takeaways`.

### 05-t-cells.md (1 MUST · 2 SHOULD)
1. **[MUST] Broken forward promise ↔ Ch 8 #3.**
   - Quote: *"That lethal result led many researchers to expect that blocking CTLA-4 in patients would be dangerously toxic, a story [Chapter 8](08-checkpoints.html) picks up[^14]."*
   - Problem: Ch 8 never tells that story.
   - Fix: *"That lethal result led many researchers to expect that blocking CTLA-4 in patients would be dangerously toxic. It does cause serious autoimmune side effects, but a drug blocks the brake only partly and for a while, and most of those side effects can be controlled ([Chapter 8](08-checkpoints.html))[^14]."*
2. **[SHOULD] Melanoma is used undefined.**
   - Quote: *"in a small study of melanoma patients"* (main text) is its first appearance in the book.
   - Fix: mark it up as `{{melanoma|melanoma}}`, so the glossary carries it from here on.
3. **[SHOULD] Block order.** Move `:::quiz` before `:::takeaways`.

### 06-cancer.md (1 MUST · 5 SHOULD)
1. **[MUST] Forward reference doesn't match Ch 10 ↔ Ch 10 #4.**
   - Quote: *"though a few also appear at low levels in brain or placenta, which has cost patients their lives in trials (Chapter 10)."*
   - Problem: Ch 10 tells a *cross-reactivity* death (a MAGE-A3 receptor recognizing the heart protein titin), not brain or placenta expression.
   - Fix: *"— though engineered receptors aimed at them have recognized look-alike proteins in healthy organs, with fatal results in early trials (Chapter 10)."*
2. **[SHOULD] Define melanoma at its first Part II use.**
   - Quote: *"written all over the genomes of skin melanomas"*.
   - Fix: *"…skin {{melanoma|melanomas}} (cancers of the skin's pigment cells)"*.
3. **[SHOULD] Deduplicate Ott (Ch 11 owns it).**
   - Quote: deep dive "Not only killer T cells": *"In an early personal vaccine trial in six people with melanoma, vaccine-induced CD4 T cells recognized 60% of the 97 neoantigens used, and CD8 T cells only 16%.[^23] Chapter 11 returns to these vaccines."*
   - Fix: *"In early personalized-vaccine trials, most neoantigen responses came from CD4 helpers rather than killers (Chapter 11)."*
4. **[SHOULD] Trim tangential deep dives.** This is the book's longest chapter (15.6k-word draft). Cut each by about half:
   - "The hallmarks, version by version": keep the 2011 tumor-microenvironment point plus one sentence on 2022.
   - "Bad luck? The stem-cell debate": keep the headline misreading and the 66/29/5 split.
5. **[SHOULD] Figure ch06-tmb.** Chart labels "Colorectal, MSI-H" and "Endometrium (uterus), MSI-H", plus the legend and the toggle "Show MSI-H rows" → **"MSI-high"**.
6. **[SHOULD] Canonical infection figure ↔ Ch 11 #1.**
   - Quote: *"Together they cause about 2.2 million cancers a year worldwide, roughly one in eight"*.
   - Fix: add the year, *"…about 2.2 million cancers a year worldwide (in 2018), roughly one in eight"*.

### 07-escape.md (1 MUST · 3 SHOULD)
1. **[MUST] Understates what engineered T cells and engagers bypass.**
   - Quote: *"Engineered T cells and T-cell-engaging antibodies supply ready-made killers, skipping the first three steps — but those killers must still reach the tumor, get in and kill (Chapters 9 and 10)."*
   - Problem: this contradicts Ch 9 ("The tumor cannot hide by closing its shop window"), Ch 10 ("A CAR does not care"), and this chapter's own wheel data (`replaces: 6`).
   - Fix: *"Engineered T cells and T-cell-engaging antibodies supply ready-made killers, skipping the first three steps; CAR-T cells and most engagers also replace step 6, recognizing a surface protein without needing the shop window. But all of them must still reach the tumor, get in and kill (Chapters 9 and 10)."*
2. **[SHOULD] HLA loss told twice in this chapter.**
   - Problem: the deep dive "Immunoediting caught in the act" explains HLA loss of heterozygosity, and "Hide" explains it again with the 40% figure.
   - Fix: in the deep dive, replace from *"Each person inherits two copies…"* through *"…that only the lost HLA type could display."* with *"Human tumors carry similar scars: the HLA losses described under 'Hide' below"*. Keep the rest (*"It is often present in only part of a tumor…"*).
3. **[SHOULD] Continuity for the reader.**
   - Quote: *"In the late 1950s, the immunologist Macfarlane Burnet and others proposed…"*
   - Fix: *"In the late 1950s, Macfarlane Burnet (the author of clonal selection, Chapter 3) and others proposed…"*
4. **[SHOULD] Figure ch07-cycle, explore mode.** Show therapy chips as Part III *previews* (tag "Part III"). Do not invite the reader to "look for a treatment that repairs it", because that game belongs to ch12-combinations (see the figure notes). Edit step caption 9 accordingly.

### interlude-history.md (2 MUST · 2 SHOULD)
1. **[MUST] Remove the Carter paragraph sentence; Ch 8 owns him and opens with him.**
   - Delete: *"In 2015 former US president Jimmy Carter, then 90, was treated with radiation and pembrolizumab for melanoma that had reached his brain; within months his scans were clear (Chapter 8).[^15]"*
   - Keep the *Science* 2013 sentence.
2. **[MUST] Don't spend Ch 10's climax.** Replace the Emily paragraph with:
   > *In April 2012, six-year-old Emily Whitehead, whose leukemia had relapsed twice, became the first child to receive the Philadelphia team's CAR-T cells. She nearly died of the treatment's side effects (Chapter 10 tells how her doctors saved her); ten years later she was still cancer-free.[^14][^15]*
3. **[SHOULD] Strip numbers from "Many roads at once" (Ch 11 and Ch 12 own them).**
   - Neoadjuvant bullet → *"In stage III melanoma, giving ipilimumab plus nivolumab before surgery clearly beat standard treatment after it (Chapter 12)."*
   - Vaccine bullet → *"…Added to pembrolizumab after melanoma surgery, one looked promising in a small trial, and in August 2026 its makers reported that a large phase 3 trial had met its main goal (Chapter 11)."*
   - Shorten the BioNTech sentence to *"Not every attempt has worked: in the same month BioNTech ended a trial of another personalized vaccine given alone after colorectal-cancer surgery (Chapter 11)."*
4. **[SHOULD] Bispecific bullet.**
   - Quote: *"moved from leukemia into solid tumors, including small-cell lung cancer in 2024"*.
   - Fix: *"moved from leukemia into solid tumors, first an eye melanoma in 2022, then small-cell lung cancer in 2024"* (this matches Ch 9's tebentafusp).

### 08-checkpoints.md (0 MUST · 7 SHOULD)
1. **[SHOULD] Accelerator drift.** In Ch 5, the accelerator is CD28 (signal 2), not recognition.
   - Quote: *"Releasing a brake does nothing if no one presses the accelerator: a checkpoint inhibitor gives T cells no new ability to recognize cancer."*
   - Fix: *"Releasing a brake does nothing if the car has nowhere to go: a checkpoint inhibitor gives T cells no new ability to recognize cancer."*
2. **[SHOULD] Reconcile with the Interlude's 2010 trial.**
   - Quote: *"The gain in the median was modest: in that 2011 trial, adding ipilimumab to chemotherapy raised it from 9.1 to 11.2 months."*
   - Fix: *"The gain in the median was modest: about four months against a comparison vaccine in a 2010 trial (10.0 vs 6.4 months), and two months when added to chemotherapy in 2011 (11.2 vs 9.1)."* Cite the Hodi 2010 source the Interlude uses.
3. **[SHOULD] ↔ Ch 5 #1.** After the paragraph on fatal side effects in "The price of a released brake", add:
   > *This is far milder than Chapter 5's CTLA-4-less mice would predict: they lacked the brake in every cell from birth, while an antibody covers it only partly, and only while the drug is in the body.*
4. **[SHOULD] Cut a retelling (Ch 5 owns the LCMV burst).**
   - Location: deep dive "Where do the responding T cells come from?", first point, *"First, exhausted populations have a hierarchy. In mice with chronic viral infections… barely responded.[^10]"*
   - Fix: *"First, as Chapter 5 described, the burst after PD-1 blockade comes mainly from the stem-like, TCF1-positive reserve.[^10]"*
5. **[SHOULD] Lower the number density in "The tail of the curve".** Move *"Reaching year three free of cancer growth…"* and *"Patients who stopped the combination…"* into the deep dive "How to read a survival curve", under a new subhead "What the long tail looks like up close".
6. **[SHOULD] Audience: trim the clinic box "What treatment looks like"** to the science:
   > *For most patients, checkpoint therapy is an infusion every few weeks, for up to about two years. Because the drug works by letting an army grow, the first scans may show little change; and because the side effects are made by T cells, they can appear months after treatment, even after it ends.[^6][^26]*
7. **[SHOULD] Glossary `cold-tumor`.** Replace with the canonical text in Global §F.

### 09-antibodies.md (0 MUST · 2 SHOULD)
1. **[SHOULD]** Delete the parenthetical *"(Median survival is the time by which half of the patients have died.)"*. Ch 8 owns the definition and the glossary carries it.
2. **[SHOULD] Mylotarg is told twice (the Interlude owns it).**
   - Location: deep dive "Inside the missile", paragraph "A rocky history".
   - Fix: *"**A rocky history.** The first ADC, gemtuzumab ozogamicin (2000), was withdrawn and later re-approved (see the [Interlude](interlude-history.html)); brentuximab vedotin (2011) and T-DM1 (2013) restarted the field.[^13] Today ADCs are among the busiest areas of cancer drug development.[^1]"*

### 10-cell-therapy.md (1 MUST · 3 SHOULD)
1. **[MUST] Duplicated paragraph and an empty section.**
   - Problem: under "## Three weeks, sometimes five", draft lines 111 and 113 repeat the price sentence almost verbatim, and nothing explains the heading.
   - Fix: delete the paragraph at line 113 (*"It is also expensive, as bespoke manufacturing tends to be…"*). Then append to line 111:
   > *From blood draw to infusion usually takes about three weeks, and sometimes five or more; many patients need "bridging" treatment to hold the cancer back while they wait, and some become too ill to receive their cells.* (Writer to verify and cite.)
2. **[SHOULD] Harmonize with the Interlude.**
   - Quote: *"became the first child in the world to receive this therapy"*.
   - Fix: *"became the first child to receive the Penn team's CAR-T cells"*.
3. **[SHOULD] Audience: trim the REMS clinic box.**
   - Keep the June 2025 change in two sentences, ending with *"The toxicities have not changed; confidence in handling them has."*
   - Keep the December 2025 marginal-zone approval as a fact.
   - Delete *"so it is worth asking a treatment center what is currently approved for a particular situation."*
4. **[SHOULD] ↔ Ch 6 #1.** Optional enrichment that also makes Ch 6's original wording true. After the titin sentence, add:
   > *In a separate trial, a strengthened receptor against MAGE-A3 also recognized its cousin MAGE-A12, made at low levels in the brain, and two patients died of brain damage.* (Writer to verify: Morgan et al., *J Immunother* 2013.)

### 11-vaccines.md (0 MUST · 6 SHOULD)
1. **[SHOULD] ↔ Ch 6 #6.**
   - Quote: *"Infections cause more than one in ten new cancers worldwide, about 2.2 million cases in 2018"*.
   - Fix: *"Infections cause roughly one in eight new cancers worldwide, about 2.2 million cases in 2018"*.
2. **[SHOULD] Peptide length (Ch 4 is canonical).**
   - Quote: deep dive "Predicting display", *"They are good at class I fragments, which are 8 to 11 amino acids long"*.
   - Fix: *"…which are usually 8 to 10 amino acids long"*.
3. **[SHOULD] Terminology.**
   - Quote: *"having lost {{b2m|β2-microglobulin}}, an essential part of the MHC class I molecule"*.
   - Fix: *"having lost {{b2m|B2M}}, the small partner protein every MHC class I molecule needs (Chapter 7)"*.
4. **[SHOULD] Internal duplicate.**
   - Problem: Ott's 60% / 16% appears in the main text (*"In an earlier melanoma study, 60%… only 16%…"*) and again in the deep dive "A helper surprise".
   - Fix: keep the main text. Start the deep-dive paragraph with *"Most responses in that 2017 Boston study came from CD4 helpers rather than CD8 killers. Helpers matter…"*, dropping the repeated numbers.
5. **[SHOULD] Quiz Q2 repeats Ch 4 Q2 and Ch 6 Q2** (same mutation, different HLA). Replace with:
   > Q: A personalized vaccine encodes up to 34 neoantigens rather than only the single best-scoring one. Why?
   > - [ ] Each neoantigen must reach a different lymph node — They are strung together on one mRNA and travel together.
   > - [x] Predictions are unreliable and tumors are patchy, so many targets, ideally clonal ones, raise the odds that some work on every cancer cell — In the pancreatic study, only about 1 in 9 chosen neoantigens drew a detectable T-cell response.
   > - [ ] More neoantigens make the vaccine a stronger alarm — The alarm comes mainly from the mRNA and its fat packaging, not from the number of targets.
6. **[SHOULD] Glossary id collision.** The text *"usually with a {{checkpoint|checkpoint inhibitor}}"* and the glossary entry `checkpoint | Checkpoint inhibitor` should both use the id `checkpoint-inhibitor`.

### 12-frontier.md (2 MUST · 6 SHOULD)
1. **[MUST] Audience: replace the whole section "## If it's you, or someone you love"** (about 550 words) with a short clinic box placed just before "Honest hope". Keep [^34]. Drop the question list, the symptom list (which duplicates Ch 8), the phone number and the financing paragraph. This also removes the incorrect *"mismatch repair (also called MSI)"*.
   > :::clinic
   > **A note for readers facing treatment.** Nothing here is medical advice ([About](about.html)). Every advance in this chapter came from clinical trials, searchable at [ClinicalTrials.gov](https://clinicaltrials.gov), which is a registry, not a seal of approval. Be wary of clinics that sell "immunotherapy" for cash outside a proper trial: "activated" immune cells, dendritic-cell vaccines or stem cells, promoted with testimonials, promises of cure without side effects, no published results and large upfront fees.[^34] And because checkpoint side effects are autoimmune (Chapter 8), they can start months after treatment, even after it ends, so anyone who has had immunotherapy should report new symptoms promptly and tell every doctor they see.
   > :::
2. **[MUST] Terminology drift from the Ch 7 canon in both figures.**
   - In the ch12-resistance and ch12-combinations specs and alts, rename "Walled off" / "walled off" to **"Excluded"** (keep "(stroma keeps T cells at the edge)" as the subtitle), and "cold" to **"Desert (cold)"**.
   - In ch12-combinations, name the fourth type **"Inflamed but hidden (MHC loss)"**.
3. **[SHOULD] Last takeaway is patient advice.**
   - Quote: *"Ask about biomarkers, trials and side effects, read company headlines as provisional, and avoid clinics selling unproven 'immunotherapies'."*
   - Fix: *"Most patients still do not respond, and cost and access are deeply unequal. A plausible mechanism is where a drug's story starts, not where it ends, so company headlines are provisional until the data are published."*
4. **[SHOULD] IDO1, fourth telling.** In the deep dive "Why good ideas fail in the clinic", replace the IDO1 paragraph with:
   > *The IDO1 story (Chapter 8) left a second lesson: on the strength of single-arm results, several phase 3 trials were launched at once, and most were stopped or scaled back after the first one failed. Whether the target, the dose or the patients were wrong is still unclear.*
5. **[SHOULD] Deliver Ch 2's NK promise ↔ Ch 2 #1.** In the deep dive "The next-generation scoreboard", add after CD47:
   > ***NK cells: in trials.** Chapter 2's natural killers are the natural backstop for tumors that drop MHC class I. Antibodies that bridge NK cells to tumor cells, antibodies that block the NKG2A "stop" receptor, cytokines that expand NK cells and CAR-NK cells are all being tested; none is yet approved, and NK cells share the T cells' difficulty getting into solid tumors.* (Writer to cite a 2024–26 review.)
6. **[SHOULD] Link STING back to Ch 2.**
   - Quote: *"{{sting|STING}} is the relay in a cellular alarm that detects DNA in the wrong place"*.
   - Fix: *"{{sting|STING}} is the relay in the cGAS–STING alarm of [Chapter 2](02-innate.html), which detects DNA in the wrong place"*.
7. **[SHOULD] Quiz Q1 is the book's fifth "MHC-loss" question.** Replace it with a JAK question:
   > Q: A melanoma shrank on anti-PD-1 for two years, then regrew. Its cancer cells have lost both working copies of JAK1. What has changed?
   > - [x] The cancer cells no longer hear interferon-gamma, so T-cell attacks no longer make them show more MHC or stop dividing — They have gone deaf to the alarm.
   > - [ ] T cells can no longer get into the tumor — That is exclusion by stroma; JAK1 loss is a change inside the cancer cell.
   > - [ ] The T cells have become exhausted — Exhaustion is a T-cell state; JAK1 loss happens in the cancer cell.
8. **[SHOULD] Glossary.**
   - `mhc-class-i`: change *"The molecule every cell uses"* to *"The molecule nearly every cell with a nucleus uses"*.
   - `msi-high` and `cold-tumor`: use the canonical texts in Global §F.

---

## Figure-level notes (aggregate issues only)

1. **One glyph, one meaning: the silver cup is MHC.** ch01-binding draws generic receptors as pale-silver cups (see Ch 1 #2). From ch02 onward the cup must mean MHC only.
2. **Three cycle wheels, one game.**
   - ch07-cycle (explore mode) asks the reader to "break a step… then look for a treatment that repairs it". ch12-combinations asks the same with the full therapy list, and ch12-resistance breaks steps again.
   - Decisions:
     - **ch07-cycle** teaches the steps and how tumors break them. Therapy chips are display-only previews tagged "Part III" (Ch 7 #4).
     - **ch12-resistance** is diagnosis only: it reuses the ch07 module, as its spec already says, and keeps its single "Add anti-PD-1" switch.
     - **ch12-combinations** is the only figure where the reader prescribes.
3. **Tumor immune profiles must look and read the same everywhere.**
   - ch07-tme, ch12-resistance and ch12-combinations share the labels inflamed / excluded / desert, plus "inflamed but hidden" in Ch 12.
   - They also share the art: the same fibroblast ring for "excluded" and the same empty field for "desert" (Ch 12 #2).
4. **Brake scenes, continued, not redrawn.**
   - ch08-two-brakes should reuse ch05-brakes' lymph-node and tissue scenes and layout, so it reads as "the same scenes, now add the drug".
   - ch05-exhaustion step 5 already animates the stem-like burst on PD-1 release. ch08-two-brakes step 4 should emphasize what Ch 8 adds: **new clones arriving from the blood** (clonal replacement and revival).
5. **HLA personas.** ch04-peptide-plus-groove introduces Ana, Ben and Chen. Reuse them in ch06-typo-to-target (now "Patient A/B") and ch11-personal-vaccine ("a patient with different HLA types"), so the reader sees *the same people's* grooves deciding.
6. **The "empty window" state** (no MHC on the surface, not merely an empty cup) needs one shared rendering across:
   - ch02-nk-missing-self
   - ch04-mhc1-pathway (display-silenced)
   - ch07-cycle step 6
   - ch09-bridge (MHC hidden)
   - ch12-resistance step 3
7. **Signal icons.** The PLAN rule applies book-wide:
   - Every PD-1/PD-L1/CTLA-4 brake uses the crimson "−" or bar icon (ch05, ch07-tme, ch08-blockade, ch08-two-brakes, ch12).
   - The green "+" is reserved for activation, and "accelerator" artwork is used only for CD28.
8. **Receptor family glyphs must be visually distinct** across ch09-bridge and ch10-build-a-car:
   - natural TCR (two-chain, diagonal over MHC)
   - CAR (single chain with an scFv head)
   - T-cell engager (gold antibody with two different arms)
   - tebentafusp (TCR head with an anti-CD3 arm)
9. **Chart labels.** Use "MSI-high", not "MSI-H" (ch06-tmb; Ch 6 #5).
10. **Keep:** the lymph-node "bean / briefing room" art is consistent across ch03, ch04, ch08 and ch12-neoadjuvant. The log-scale conventions in ch06-tmb and ch07-evidence match.
