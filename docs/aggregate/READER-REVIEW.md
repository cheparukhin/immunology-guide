# Reader review: "Self & Other," read cover to cover

*Reader:* a curious software engineer who reads popular science and has no biology since high school. I read all 13 chapters in order across several evenings, with deep dives read selectively and figures imagined from their captions. My chapter-by-chapter notes are in `reader-journal.md`.

**Verdict in one line:** this is the best popular explanation of immunotherapy I've read. It is genuinely mechanistic and scrupulously honest. Its main weaknesses are a vocabulary cliff in Chapter 4, a few unpaid promises, and a lot of re-telling between the Interlude, Chapter 7, Chapter 8 and Chapter 12.

**Energy curve:** Ch1 4 · Ch2 3 · Ch3 4 · Ch4 3 · Ch5 4 · Ch6 5 · Ch7 5 · Interlude 4 · Ch8 5 · Ch9 4 · Ch10 5 · Ch11 4 · Ch12 4

---

## 1. Could I explain it now?

*Written from memory, without looking back.*

Every cell constantly shreds samples of the proteins it's making and displays the fragments on its surface in MHC molecules, its "shop window." Each T cell carries one receptor, made by randomly splicing gene pieces. The thymus kills off T cells that grip the body's own fragments too hard, so the survivors mostly ignore "self." Cancer is evolution inside the body: cells accumulate DNA typos, and the family that divides most wins. A few typos change a protein fragment that ends up in the shop window. That's a neoantigen, but only if the patient's inherited HLA grooves can hold it. A T cell whose receptor happens to match can then recognize and kill that cell.

Why it fails: a naive T cell is activated only when a dendritic cell, which has been alarmed by danger, presents the fragment in a lymph node *and* gives a confirmation signal (signal 2). Tumors are mostly self and raise little alarm, so T cells often get signal 1 alone and are switched off. Tumors that grow under immune pressure are pre-selected for stealth (immunoediting). They drop their MHC, display PD-L1 to press the T cells' PD-1 brake, recruit suppressive cells, build fibrous walls, acidify their surroundings, or go deaf to interferon. Chronic fighting exhausts T cells.

Treatments: **checkpoint inhibitors** are antibodies that block the PD-1/PD-L1 or CTLA-4 brakes. They teach nothing new. They free T cells that already recognize the tumor, mostly via a stem-like reserve that pumps out fresh killers. So they work best in inflamed, mutation-rich tumors and cause autoimmune side effects. **Antibody drugs** stick to a tumor surface protein and then either block a growth signal, flag the cell for NK cells and macrophages, deliver a poison (ADCs), or bridge *any* T cell to the cancer cell (bispecific engagers, which bypass MHC). **CAR-T** cells are a patient's T cells given an antibody-based receptor with signal 2 built in: a living drug that multiplies. It works in B-cell cancers because CD19 is expendable, and it's hard in solid tumors. **TIL** and **TCR-T** are variants. **Vaccines** that prevent cancer-causing viruses (HPV, hepatitis B) work superbly. Personal mRNA neoantigen vaccines plus anti-PD-1 look promising. **Oncolytic viruses** turn a tumor into its own vaccine.

**What I'm unsure about (in character):**
- Whether signal 2 matters only for the *first* activation of naive T cells or also for killing. I pieced this together from one sentence in Ch9.
- What CTLA-4 blockade really does: lets a *bigger* response happen (Ch5), or lets a *broader* set of weaker matches through (Ch8)? And does it also delete Tregs in humans? (The book says the evidence is mixed.)
- How helper T cells fit in. I left them out of my summary entirely.
- How a T-cell receptor makes precise decisions with such weak, brief binding. Ch1 promised this and I never got it.
- What MDSCs actually do, and the two kinds of interferon.
- Why kidney cancer responds despite few mutations, and what γδ T cells are.
- How chemotherapy itself works, and why it helps checkpoint drugs in lung cancer.

**Misconceptions my explanation reveals that the book may have caused (stepping out of character):**
1. **Where signal 2 applies.** Ch4 frames 2FA as the T cell asking "should it believe what it is reading?", and Ch6 says "T cells meeting tumor fragments without signal 2 are more likely to be switched off." A reader can easily conclude that killer T cells *at the tumor* need B7 confirmation. The only explicit statement that armed killers don't is Ch9's aside: "Engagers mostly recruit veteran T cells… and these can kill without it."
2. **CD8-centrism.** My summary has no helpers, because the main narrative is almost entirely about killers. Helpers get one section (Ch5, "The conductors"). Then Ch11's data show vaccine responses are mostly CD4 (60% vs 16%), which the main text never reconciles with "the route that primes killer CD8 T cells."
3. **PD-1 blockade's location.** The cycle mappings say "anti-PD-1 at killing" (Ch7) and "act mainly on the last link" (Ch12), while Ch8 says "The reserve also lives in lymph nodes and blood." The wheel teaches a location error that Ch8 then corrects.
4. **TMB as a reliable predictor.** The "lottery tickets" metaphor (Ch6) is stickier than the Ch8 caveat that high-TMB breast, prostate and glioma tumors respond *no better* than low-TMB ones. My "mutation-rich tumors" shorthand overgeneralizes.
5. **"Interferon" as one thing.** I wrote "deaf to interferon" loosely. Ch2 introduces antiviral interferon, mentions IFN-γ in a parenthesis, and never cleanly separates them.
6. **The NK "double bind."** Ch2's key idea ("A cancer cell can't easily hide from both") is taught three times, but NK cells play almost no role in the therapies. A reader may overestimate NK surveillance of solid tumors despite the hedges.

---

## 2. The learning curve

**Smooth:**
- Ch1 (one primitive: molecules touch, fit and let go).
- Ch3. Generate-then-select is an instantly graspable algorithm, and Pauling's wrong instructive theory is a perfect foil.
- Ch6 onward. Once cancer arrives, every new idea hangs on a Part I hook, and the parenthetical chapter recaps ("the scouts from Chapter 1," "(Chapter 4)") are perfectly dosed.
- Part III reads easily *because* Part I was hard.

**Cliffs:**
- **Ch4, "The shop window" → "The evidence board."** In about 1,500 words: proteasome, TAP, endoplasmic reticulum, anchor residues, 200,000 class I molecules, alleles, MHC restriction, HLA, class II, professional APCs, CD4/CD8. Then "Scouts and couriers" adds cross-presentation, cDC1, costimulation, CD28, B7, CD80, CD86, anergy, IL-12 and CTLA-4. The *story* survives; the *names* don't. This is where I stopped for the night.
- **Ch4, "Cross-presentation."** I needed two reads to see why eaten tumor debris can't brief a killer by default.
- **Ch5, "The conductors."** "CD40 ligand on the helper grips CD40 on the dendritic cell. The 'licensed' dendritic cell…" Mechanism by acronym.

**Lost and never recovered:**
- **Signal 3** ("Signals 1 and 2 are the two factors; signal 3 is not a security check but instructions") is never used again in a way that would consolidate it.
- **The CD-number zoo** (CD3, CD4, CD8, CD19, CD20, CD28, CD38, CD40, CD47, CD80, CD86). I recognized each in context, but couldn't sort them afterward.
- **MDSCs**, which "starve and silence T cells" (Ch7). That's a name and a verb, not a mechanism.
- **The two interferons** (Ch2 → Ch5).
- **γδ T cells and CD47.** Both first appear in Ch12 and get one sentence each.

---

## 3. Redundancy

Recaps with a pointer are good and I wanted them. The items below are full re-tellings.

| What | Where it's told |
|---|---|
| Stem-like TCF1 reserve, incl. the same LCMV mouse experiment | Ch5 main ("When the fight never ends") + Ch5 deep dive ("The reserve that checkpoint drugs tap") + Ch7 deep dive ("The cycle, revised") + Ch8 main ("Two brakes, two places") + Ch8 deep dive ("Where do the responding T cells come from?", first point repeats Ch5's LCMV box). **5 tellings.** |
| Epacadostat / IDO1 failure | Ch7 deep dive ("Molecules of the poisoned air"), Ch8 main ("More brakes…"), Ch12 main ("Why combinations are so hard"), Ch12 deep dive ("Why good ideas fail"). **4 tellings.** |
| IFN-γ → PD-L1 feedback loop | Ch5 "The brakes" + kill figure step 8, Ch7 "Brake", Ch8 "Brakes, briefly", Ch12 deep dive ("adaptive resistance"). |
| Escape routes (B2M, JAK1/2, walls, guards), incl. the same four relapsed melanomas | Ch7 "How tumors escape", then substantially again in Ch12 "How tumors fight back". |
| "57 of 100 eligible, ~20 respond" | Interlude ("The lessons of history"), Ch8 ("Who responds"), Ch12 opening. |
| Merck/Moderna Aug 2026 phase 3 press release | Interlude, Ch11 intro, Ch11 "Melanoma…", Ch11 takeaways, Ch12 scoreboard. |
| 1974 nude-mouse experiment | Ch7 main, Ch7 deep dive, Interlude main and takeaways. |
| Jimmy Carter | Interlude (with "Chapter 8" pointer), then Ch8 opener. |
| Emily Whitehead + tocilizumab | Interlude ("Results at last"), Ch10 twice ("What it actually does", "The bill the body presents"). |
| Köhler & Milstein; rituximab first (1997); Ehrlich's magic bullet; Mylotarg withdrawal | Interlude, then Ch9 (Mylotarg in both an Interlude clinic box and a Ch9 deep dive). |
| 2017 Boston vaccine: 60% CD4 / 16% CD8 | Ch6 deep dive, Ch11 main, Ch11 deep dive. |
| HPV E6/E7 disabling p53 and Rb | Ch6 main + deep dive, Ch11 main + deep dive. |
| Missing self / NK and the empty window | Ch2, Ch4 (main + deep dive), Ch7 "Hide", Ch12 figure. |
| V(D)J multiplication | Ch3 main, Ch3 figure, Ch3 "Counting the library" deep dive. |
| **Literal duplicate** | Ch10 "Three weeks, sometimes five": the cost paragraph appears twice in a row ("It is also expensive: US list prices launched between $373,000 and $475,000…" / "It is also expensive, as bespoke manufacturing tends to be. US list prices launched between $373,000 and $475,000…"). |

The pattern: the **Interlude front-runs** Ch8–11's best anecdotes, and **Ch12 back-runs** Ch7–8. Each chapter is written to stand alone, which costs the linear reader.

---

## 4. Missing: what a curious science reader wishes the book had told them

1. **The promised T-cell puzzle.** Ch1: "How T cells nonetheless make exquisitely precise decisions with such fleeting grips is one of the puzzles of Chapter 4." Ch4 never addresses it. Ch5's deep dive gives the sensitivity (1 peptide detected, ~3 to kill) but not the mechanism (kinetic proofreading, serial engagement, dwell time). For a technical reader this is the most interesting unanswered question in the book.
2. **A contrast with chemotherapy, radiation and targeted drugs.** "Chemotherapy" appears dozens of times as the comparator but is only ever described as poison. One box explaining *why* chemo and targeted-drug survival curves fall toward zero (resistant clones) while immunotherapy curves plateau (an adaptive, remembering opponent) would make "the tail of the curve" feel inevitable rather than empirical. It's also the natural place to explain why driver-addicted, low-mutation tumors (e.g. EGFR-mutant lung cancer, mentioned only in passing in Ch12's ivonescimab box) respond poorly to checkpoint drugs.
3. **What a durable response *is*, immunologically.** Ch8 gives one sentence: "probably because the drug leaves behind an expanded population of T cells, including long-lived memory cells." Is a ten-year survivor cured, or in a new equilibrium (Ch7's middle "E")? This is the book's central clinical phenomenon and its mechanism is under-explored.
4. **A back-of-envelope race.** Ch5 gives "2 to 16 infected cells per day" per killer T cell. How many T cells does it take to clear a 10⁹-cell tumor that doubles every few weeks? An engineer reader wants this arithmetic, and it would explain why "small tumor, early" keeps winning (neoadjuvant, adjuvant vaccines, ctDNA).
5. **Unconventional T cells and the innate arm as therapy.** γδ T cells appear only in Ch12's deep dive, and CD47/macrophage checkpoints get one paragraph. NK cells are set up three times (Ch2, Ch4, Ch7) but never pay off in Part III.
6. **The evolutionary "why" of PD-1/PD-L1.** Why does the body have a tissue-level "enough" signal? Chronic infection is covered; maternal–fetal tolerance (raised in Ch1's deep dive) and the placenta are never connected to it.
7. **A consolidated "open questions" list.** The honesty is distributed through the text. A closing list of what nobody yet knows (does anti-CTLA-4 deplete human Tregs? which microbes matter? is hyperprogression real? why kidney cancer responds?) would give the science reader a satisfying map of the frontier.
8. **A molecule cheat sheet** at the end of Part I (CD numbers, the brakes, their partners, and which drug hits which).
9. **Avidity.** Ch1: "Chapter 3 returns to it." It doesn't.

---

## 5. Trust and tone

**Honest about uncertainty without being discouraging? Yes, and exceptionally so.** Every analogy is flagged and broken. Numbers carry denominators ("1 in 270 … 1 in 90 … 1 in 80" fatal side effects; "22 cases … more than 27,000 doses"). Failures are told with sample sizes (MAGRIT, tremelimumab, TIGIT, bempegaldesleukin, CD47). Company-reported results are labeled. Correlation and causation are separated ("Responders versus non-responders is not vaccine versus no vaccine"; the microbiome "solid / not solid" box). Lines like "a plausible mechanism is where a drug's story starts, not where it ends," "Most survival gains in this chapter are measured in months, not cures," and "Both halves of that sentence are true" made me trust every simplification elsewhere.

**Hype:** none that I could find. The closest is Ch10's autoimmune box ("the first serious suggestion that some autoimmune diseases might be curable"), and it is immediately hedged.

**Where it tipped over:**
- **Hedging as a tic in Ch11–12.** "Company-reported / topline / not yet peer-reviewed" for the same Merck/Moderna trial in five places reads more like a disclaimer than a lesson. Say it once, well.
- **Status-report drift.** Ch11's "The evidence so far" and Ch12's "next-generation scoreboard" become a ticker of trial names (KEYNOTE-942, INTerpath-001, IMCODE003, ELI-002 7P, HARMONi-2, ENHANCE…). It's accurate, but for a science reader it's noise, and it will date the book fastest.
- **Overwhelming:** Ch4's vocabulary (above). Ch8's side-effect section is dense but fair.
- **Cold:** nowhere. The fatal cases (the HER2 CAR-T patient in respiratory failure "within fifteen minutes," the MAGE-A3/titin deaths) are told plainly and serve the argument. The Ch12 patient section shifts audience but is concrete and humane.

---

## 6. Best and worst

**Three most memorable moments:**
1. **Two-factor authentication and its payoff.** Ch4: "From a cancer patient's point of view, the safeguard cuts the wrong way." A quiet tumor silences its own attackers. Six chapters later, Ch10 turns the same idea into engineering: building signal 2 into the CAR made it work, "at the price of removing the independent check." It's the book's best idea arc.
2. **The KRAS G12D patient (Ch6, "A typo in the shop window").** All seven metastases shrank. Then one regrew, having lost the chromosome carrying HLA-C\*08:02. It teaches neoantigen, HLA restriction and immunoediting in one story.
3. **The tail of the curve (Interlude → Ch8).** Tremelimumab "failed" on medians while its responses lasted roughly three times longer than chemo's. Then CheckMate 067 at ten years, and the hazard-ratio box explaining why a CI of 0.69–1.05 means "cannot say for sure." This is statistical literacy taught through a story.

*Honorable mentions:* the eyelid-skin opener (Ch6), the cancer-immunity cycle as the organizing model (Ch7), HER2-low and "target as address" (Ch9), "The living drug is the match; the innate immune system is the fire" (Ch10), and the γδ T-cell surprise (Ch12).

**Three weakest stretches:**
1. **Ch12, "A loop with seven links" + "How tumors fight back."** About a third of the final chapter re-explains Ch7–8 (cycle, B2M, JAK, walls, guards, adaptive resistance, the four melanomas). The genuinely new findings (B2M loss frequencies, lab-validated neoantigen loss, the γδ exception, HLA heterozygosity) are buried among them.
2. **Ch4, "The shop window" through "The evidence board"** (including the long abacavir clinic box). This is the vocabulary cliff. The abacavir story is brilliant but costs three paragraphs at the point of maximum load.
3. **Ch11, "The evidence so far."** The chapter's ideas are excellent, but this section is a trial-by-trial status report with repeated press-release caveats.

*Also:* Ch2's first half (splinter → inflammation → complement → COVID box) delays the cancer thread. Ch6's hallmarks section and its version-history deep dive don't change anything downstream. And the duplicated paragraph in Ch10 is the one visible production error.

---

## 7. Top 10 recommendations (prioritized)

1. **Ch10, "Three weeks, sometimes five": fix the duplicate.** Delete one of the two consecutive cost paragraphs (keep the version with "as bespoke manufacturing tends to be" and merge the "A CAR-T treatment is made *from the patient*… the clock matters" sentence into it). Either explain "sometimes five" (manufacturing failures, bridging therapy, shipping) in one sentence or retitle the section "Three weeks from vein to vein."

2. **Pay off or remove the broken forward promises.**
   - Ch1 deep dive "Affinity by the numbers": either add a short Ch4 deep dive ("How a weak grip makes a sharp decision": dwell time, kinetic proofreading, serial engagement, the ~3-peptide sensitivity from Ch5) or change "one of the puzzles of Chapter 4" to "a puzzle immunologists are still working out."
   - Ch1 "…avidity… Chapter 3 returns to it": add one sentence in Ch3 "Antibodies: one molecule, four jobs" ("two arms holding two copies of the target, which is avidity from Chapter 1") or drop the pointer.
   - Ch4 "The shop window": replace "Chapter 2 called it an ID badge, because NK cells check that it is there" with "Chapter 2 introduced this shop window, and showed that NK cells check it is there."
   - Ch10 deep dive "The generations, and why 'more' stopped helping": after obe-cel's "fast release rate," add "(the off-rate of Chapter 1)."

3. **Ch4, "Two-factor authentication": state the scope of signal 2.** Add after the anergy paragraph: "This check guards the *first* activation of a naive T cell in the lymph node. Once armed, killer T cells in the tissues act on signal 1 alone." This removes misconception #1, makes Ch6's "Altered self" read correctly, and lets Ch9's "veteran T cells… can kill without it" and Ch10's "removed the independent check" land as payoffs rather than surprises.

4. **Ch12, "How tumors fight back": cut the re-run, keep the news.** Replace the B2M/JAK/walls/guards re-explanations with one sentence pointing to Ch7. Keep only what's new: the 30% vs 10% B2M figures, the lab test showing lost neoantigens had been real targets, and HLA heterozygosity. **Promote the γδ finding from the deep dive into the main text**, with two sentences on what γδ T cells are. Merge "adaptive resistance" into a pointer.

5. **De-duplicate the stem-like reserve.** In Ch8's deep dive "Where do the responding T cells come from?", delete the first point (the LCMV mouse experiment, already in Ch5's "The reserve that checkpoint drugs tap") and open with the 2019 clonal-replacement study. In Ch7's "The cycle, revised," cut the second bullet ("Checkpoint blockade is not simply a matter of reviving exhausted T cells") or reduce it to a pointer.

6. **Give each recurring anecdote and statistic one canonical home.**
   - Interlude: shorten "Does the body police cancer?" to two sentences ("…Chapter 7 tells how that doubt was overturned").
   - Interlude: shorten the Carter and Emily Whitehead mentions to a line each with a forward pointer, so Ch8 and Ch10 keep their openers fresh.
   - Ch10: tell Emily Whitehead once, in "The bill the body presents," and cut the duplicate in "What it actually does."
   - "57 eligible / ~20 respond": keep it in Ch8 and point back to it from the Interlude and Ch12.
   - Merck/Moderna phase 3: give the full caveat once in Ch11 "Melanoma…" and use bare pointers elsewhere.
   - Epacadostat: tell it in Ch8 and reduce the Ch7 box and both Ch12 mentions to one clause each.

7. **Flatten Ch4's vocabulary cliff and add a cast list.** In "The shop window," move TAP, the ER and anchor residues into the existing "Inside the loading dock" deep dive, leaving the main text at "shredder → loading bay → groove → window." Move the abacavir clinic box to a deep dive. Add a one-screen "Cast of molecules" table at the end of Ch5 (CD3, CD4, CD8, CD19, CD20, CD28, B7/CD80/86, CTLA-4, PD-1, PD-L1, IFN-γ, IL-2, IL-6) listing what each does and which Part III drug touches it, and link it from Ch8–10.

8. **Add a "How the older treatments work, and fail" box.** Place it in Ch8 "The tail of the curve," before CheckMate 067. Explain in about 150 words that chemo and targeted drugs kill dividing or driver-addicted cells, that resistant clones regrow so curves fall toward zero, and that an immune response adapts and remembers, which is the leading explanation for the plateau. Add one sentence on why driver-addicted, low-mutation tumors such as EGFR-mutant lung cancer usually get targeted drugs first and respond poorly to checkpoint inhibitors.

9. **Reconcile the two simplifications that conflict across chapters.**
   - CTLA-4: in Ch8 "Two brakes, two places," add one sentence bridging Ch5 ("capping how large a response grows") and Ch8 ("raises the bar, so only T cells with a strong match switch on"): both describe the same B7 starvation, seen as size and as breadth.
   - PD-1 on the wheel: in Ch7 "The cancer-immunity cycle" and Ch12 "A loop with seven links," change "anti-PD-1 at killing" / "mainly on the last link" to "mainly at killing, and by resupplying killers from a reserve in lymph nodes and blood (Chapter 8)."

10. **Ch11: resolve the CD4/CD8 tension and trim the ticker.** In "A vaccine written from one tumor," after "the route that primes killer CD8 T cells," add: "In practice, most measured responses so far come from CD4 helpers (Chapter 5), which is why newer designs deliberately include class II fragments." Then delete the duplicate 60%/16% in the "Inside the prediction machine" deep dive. In "The evidence so far," collapse the trial-name churn into the existing scorecard table and keep only the KEYNOTE-942 story and the pancreatic study in prose.

*Smaller fixes I'd also make:* in Ch5, connect IFN-γ back to Ch2's macrophage aside ("the same interferon-gamma that flipped Chapter 2's macrophages into fight mode"). Trim Ch6's hallmarks version-history deep dive. Close Ch12 with a short "What nobody knows yet" list (see Missing #7).
