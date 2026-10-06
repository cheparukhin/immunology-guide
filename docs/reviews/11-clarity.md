# Chapter 11 "Teaching the Body to See": reader-experience review

Reviewed: `content/drafts/11-vaccines.md` (line numbers refer to that file). Reader persona: an intelligent non-biologist who has read Chapters 1-10 and came in because of headlines about "mRNA cancer vaccines". Main text is about 3,330 words (including the clinic box) against a target of 3,000.

## Overall impression

The first half is excellent. The Scotland zero is a hook that earns its place, the HPV/hepatitis B story is concrete, and the "four broken links" passage gives a reader a real mental model of why old vaccines failed. The honesty is better than most popular writing: company-reported results are flagged, the colorectal stop and the missed KRAS trial are included, and the ELI-002 subgroups are called "a hypothesis". The chapter sags in the middle. The six-step pipeline, then four trial summaries in a row (melanoma, pancreatic, colorectal, KRAS), then three tongue-twister oncolytic virus names are a run of numbers and names. Two of the three explorer figures are overloaded for a non-biologist. A reader who finishes the main text still cannot say, in one breath, which of these things are proven, which are promising and which are failed. The takeaways also slip into mild hype in places where the body text is careful. The fixes below are mostly local, and most of them also shorten the text.

---

## Must fix

**1. The takeaways overstate what the body text says (one factual slip, one hype slip).**
- Location: l.459 and l.462.
- Quotes: "HPV vaccination at age 12–13 has cut cervical cancer among young women by about 87–88% in England and Sweden" and "adding a personalized mRNA vaccine to pembrolizumab cut the risk of recurrence or death roughly in half in a 157-patient randomized trial".
- Problems:
  - Sweden's 88% is for vaccination before age 17 (l.47), not 12–13.
  - "Roughly in half" turns a hazard ratio into a risk cut. The body text calls the first result "statistically borderline" and the deep-dive (l.341) warns that 0.5 "does not mean half the patients are cured." The trial was also open-label with 50 control patients. The takeaway drops every one of those hedges.
- Fix for bullet 2: "...has cut cervical cancer among women in their twenties by about 87% in England (offered at 12–13) and 88% in Sweden (vaccinated before 17), with no cases recorded in the 12–13 group in Scotland."
- Fix for bullet 5: "In a small, open-label, 157-patient trial of high-risk melanoma, 22% of patients given a personalized mRNA vaccine plus pembrolizumab relapsed or died by about two years, versus 40% with pembrolizumab alone; the first result was statistically borderline, though it held at five years. In August 2026 the companies reported that a ~1,100-patient phase 3 trial met its main goal. Those topline results are not yet peer-reviewed, survival data are pending, and no such vaccine is approved."

**2. The key preventive-vs-therapeutic logic has a leap in it: "That design explains its one big limitation".**
- Location: l.43. Quote: "That design explains its one big limitation: it prevents infection but does not cure it."
- Problem: the reader has just been told the vaccine makes antibodies that stop virus entering cells. Nothing in the main text says why that means it cannot treat an existing infection. The reason ("coat versus cargo") sits only in the deep-dive (l.113, l.115). This is the single most important idea for the chapter's central distinction, and the one a reader will be asked about in Quiz Q1.
- Fix: "That design explains its one big limitation. Antibodies catch virus in transit, but once HPV is inside cells it is mostly hiding, and the cells it has infected are not displaying the coat protein the antibodies were trained on. So the vaccine prevents infection but does not cure it."
- Also: the sentence "age is everything" (l.45) overclaims, since the 17–30 group still had 53% fewer cancers. Use "So timing matters, as three national studies show:".

**3. MAGRIT is introduced as an example of the four broken links, but the deep-dive says it does not fit, and the figure's preset B builds a causal story the evidence does not support.**
- Locations: l.122 and l.126-132 (main text), l.214 (deep-dive), preset B at l.188.
- Quotes: main text, "MAGE-A3, a protein made by many tumors"; link 1, "proteins that tumors overproduce but that normal cells also make"; deep-dive, "MAGRIT's failure shows that tolerance is not the whole story"; preset B, "Shared, Strong, Microscopic, On (tier 1)".
- Problems:
  - MAGRIT had a potent adjuvant (link 2 fixed), patients with resected disease (link 3 fixed) and a cancer-testis target. So it fits none of links 1-3, and "brakes on" is a guess.
  - The figure's min(P, K) rule labels it "shared normal protein", which contradicts the deep-dive, and implies the explanation is settled when the deep-dive says the weights are "still debated".
  - A careful reader will feel the chapter's own best example undermines its tidy chain.
- Fix (main text): after the MAGRIT sentence add "Why it failed is still debated; it did not fit the simple story below, which explains the earlier failures better than this one."
- Fix (figure): either swap preset B for a clean example, or rewrite its caption to end "...as with a placebo. Why is still debated; in this cartoon, the shared target and the active brakes are two candidate explanations." Do not label the MAGRIT-like state "tier 1" as if the cartoon predicts it.

**4. The "four links" model is the author's synthesis, but it is presented as established fact in the goal, the tier text and the takeaways.**
- Locations: figure goal (l.138), tier 2 text (l.169), takeaway (l.460), l.427.
- Quotes: "needs four things at once"; "The combination behind recent trial successes"; "Modern approaches attack all four together"; "Vaccines work best when...".
- Problem: the chapter's own evidence section contradicts "trial successes". The phase 2b result is borderline, the phase 3 is a press release, pancreatic is single-arm, the colorectal trial was stopped, and ELI-002 missed. Under PLAN §2 ("promising, not established") this needs a hedge. It is a helpful framework, not a finding.
- Fix: l.124 "In hindsight, researchers point to four links in a chain that kept breaking." Tier 2 text becomes "The combination now being tested; early results are promising, not proven." Takeaway becomes "Modern designs try to fix all four at once; whether that works is still being tested." l.427 "The pattern so far suggests that therapeutic vaccines may work best when...".

**5. Trial vocabulary is never explained, and it carries the whole "proven vs promising" message.**
- Locations: l.322 ("phase 2b"), l.324 ("phase 3", "placebo", "interim analysis"), l.330 and l.358 ("randomized", "single-arm"), l.358 ("accelerated approval").
- Problem: a non-biologist cannot weigh "a phase 2b randomized trial of 157" against "a single-arm trial" against "a phase 3". Ch12 defines `clinical-trial` and the interlude defines `accelerated-approval`, but this chapter uses neither popover, and the reader meets the terms before the glossary entry. Because this is the chapter that reports trials, a two-line trial primer belongs here.
- Fix: gloss on first use, e.g. "The phase 2b trial KEYNOTE-942 (a mid-sized randomized trial, the step after safety testing and before the decisive phase 3)..." and "...a single-arm trial (everyone got the drug; there was no comparison group)". Use {{accelerated-approval|accelerated approval}} with "(provisional approval on early evidence, pending proof of benefit)". Cut "(NCT05933577)" from the main text (l.324); it is in the sources.

**6. The melanoma paragraph is the densest in the chapter and buries the one number a reader needs.**
- Location: l.322.
- Problem: about 160 words carry nine statistics (157, two to one, 22%, 40%, HR 0.56, 44%, 25% vs 18%, HR 0.51, five-year). The hazard ratio was already taught in Chapter 8, so this reader knows it, and the deep-dive at l.341-345 repeats the intervals.
- Suggested rewrite (about 95 words): "The phase 2b trial KEYNOTE-942 randomly assigned 157 people with completely removed stage IIIB–IV melanoma, two to one, to the vaccine plus pembrolizumab or to pembrolizumab alone. After about two years the cancer had returned, or the patient had died, in 22% of the vaccine group and 40% of the comparison group. With so few patients the result was statistically borderline, and severe side effects were somewhat more common with the combination (25% versus 18%). At five years the gap had held, though the trial was too small to show a survival benefit.[^19][^20]" The two hazard ratios stay in the deep-dive.

**7. The preventive/therapeutic split is crisp at the top, but it breaks down in the chapter's own examples, and the chapter never signals that.**
- Locations: l.19, l.25-27, l.205, l.350.
- Quote: "The enemy ... is built from the body's own cells, so almost everything about it looks like self" (therapeutic) vs the Leiden HPV16 trial (l.205), the Papzimeos approval (l.115) and the oncolytic viruses (l.350).
- Problems:
  - The Leiden and Papzimeos vaccines are therapeutic yet target foreign viral proteins, so "therapeutic = looks like self" is wrong for them. The real dividing line is timing and mechanism (antibodies stopping entry vs T cells attacking infected cells).
  - BCG, sipuleucel-T and oncolytic viruses fit neither box, but l.19 promises "both kinds of vaccine" and oncolytic viruses appear as a surprise at l.348.
- Fix: add to l.27 "(unless the cancer is caused by a virus, in which case some of its proteins are foreign)". Replace l.19 with: "This chapter follows both kinds of vaccine, and a third idea that skips the target altogether: viruses that turn a tumor into its own vaccine." After the Leiden result (l.205) add: "Note that this was a therapeutic vaccine aimed at the same virus the preventive vaccine blocks: the difference is not the target but what the immune system is asked to do, block entry or attack infected cells."

**8. The hook is strong but slightly oversells the zero and withholds who and how many.**
- Location: l.13 and l.17.
- Quotes: "in public health, a zero is about as loud as a signal gets"; "the companies behind the first large trial of this approach announced that it had met its main goal".
- Problems:
  - A skeptic asks "zero out of how many, and how many would you expect?" Neither number is given, and the chart gives only a rate for unvaccinated women.
  - Naming Moderna and Merck would instantly connect with what the reader heard in the news.
  - The hook states the phase 3 result flatly, and the "company-reported" hedge arrives 2,500 words later.
- Fix: l.13 "...a zero among that many women, at an age when cervical cancer is still rare, is not proof, but it is a very strong signal." (Insert the study's group size.) l.17 "...In August 2026, Moderna and Merck announced that a large trial of the approach had met its main goal. (So far, only a press release.)"

---

## Should fix

**9. "Infections cause a surprising share of cancer" gives no denominator (l.35).** 2.2 million means nothing without the total. Rewrite: "Infections cause about one in eight new cancer cases worldwide: roughly 2.2 million of about 18 million in 2018, including about 690,000 caused by HPV and 360,000 by hepatitis B virus." (Confirm the one-in-eight against ref 3.)

**10. "Brakes" now means three things (l.39, l.132, l.336 glossary).** Tumor suppressors are "the brakes on cell division", PD-1 is the T-cell "brake", and the oncogene popover says "stuck accelerator", while link 4 uses "accelerator" for the vaccine. PLAN §2 flags this confusion risk. Fix l.39: "...disabling the cell's tumor suppressors, the safeguards that stop damaged cells from dividing (Chapter 6)". Reserve "brakes" for T cells in this chapter.

**11. The "wanted poster" analogy is non-canonical, then immediately negated (l.23).** "Think of it as a wanted poster, with one caveat: the immune system doesn't learn from the poster." The reader must absorb and discard an analogy in one breath. PLAN's canonical metaphor is the library of search queries plus photocopying, which this paragraph already half-uses. Rewrite: "A vaccine is a rehearsal (Chapter 3). It shows the immune system a harmless version of a threat. The rare T and B cells whose receptors fit are found, photocopied and kept on file as memory cells. The vaccine does not teach them; it only finds and multiplies the ones that already match." If you keep the poster for the BCG line (l.203) and the ending (l.433), introduce it there instead.

**12. Oncolytic mechanism: one sentence needs two reads, and the in-patient evidence for "in situ vaccination" is missing (l.352-354, l.356).**
- Quote: "engineers delete viral genes needed to overpower a healthy cell's defenses but not a cancer cell's weakened ones."
- Rewrite: "So engineers delete the viral genes that let a virus defeat a healthy cell's alarm. In a healthy cell the weakened virus is shut down; in a cancer cell with a broken alarm it still thrives."
- Evidence gap: the main text asserts that T cells "patrol the whole body" but never says whether non-injected tumors really shrink in patients. That caveat lives only in the figure's final note (l.398), yet Quiz Q4 assumes it. Add after l.356: "In some patients, tumors the needle never touched also shrank, which is the clue that the immune system had joined in. The effect is real but inconsistent, and many patients do not respond at all." Drop the term "immunogenic cell death" (l.354); "in situ vaccination" is enough.

**13. Oncolytic approvals are a name soup (l.356-358).** Three tongue-twisting generic names, three brand names and two codes in three sentences, in a section the reader will skim. Keep T-VEC and the 2026 RP1 approval, and move teserpaturev to the deep-dive. For the glioma result, "16 of 19 alive at a year" has no baseline, so it cannot be judged; give the historical comparison or cut it. "Tumors shrank in 24% of evaluable patients" needs one phrase for "single-arm". Suggested: "A virus called RP1 (Tudriqev), given with nivolumab, received accelerated approval in August 2026 for melanoma that had stopped responding to anti-PD-1 drugs; tumors shrank in 24% of evaluable patients in a trial with no comparison group, and further trials must confirm the benefit." Saves about 60 words and removes the takeaway conflict in item 22.

**14. The pancreatic paragraph has ambiguous words and a hard-to-parse control (l.328-330).**
- "vaccine-made T-cell clones ... cancer-cell clones" uses "clone" for two different things in one sentence.
- "median time to recurrence not reached" means "more than half had not relapsed yet".
- "(7.7 on average)" lacks a unit; per the abstract it is an estimated 7.7 years.
- "although both groups answered a COVID-19 mRNA vaccine equally well" is a subtle inference a lay reader will not follow.
- "the tumors that did return had been 'pruned'" generalizes from two relapsed patients (per the PubMed abstract of the paper cited as ref 21: "Two responders recurred").
- Fix: "Half of the 16 vaccinated patients made strong new T-cell responses, and their cancers stayed away longer (more than half had not relapsed at the time of analysis, versus 13.4 months in non-responders). The vaccine-trained T cells were estimated to survive an average of 7.7 years. In the two responders whose cancer returned, the tumors had lost the cancer-cell lineages the vaccine targeted: evolution under police pressure, caught in the act." And the caution: "A caution: responders versus non-responders is not vaccine versus no vaccine. Responders might simply have stronger immune systems, though both groups responded equally well to a COVID-19 mRNA vaccine, which argues against that."

**15. The colorectal stop (l.332) leaves a worst-case blank.** "noted a numerical imbalance in overall survival between the groups" does not say which way, and the reader will assume the vaccine arm did worse. State what is known: "The statement did not say which arm fared worse, and no data have been published." Also gloss "blood still carried tumor DNA" as "(a sign that microscopic cancer remained)".

**16. The ELI-002 result is company-reported but not attributed (l.338).** "a randomized phase 2 trial ... reported in June 2026, missed its main goal" is from a press release (ref 24). Per PLAN §2, write "the company reported in June 2026 that a randomized phase 2 trial...". Trim the 25-patient phase 1 sentence to "84% made KRAS-specific T cells", or cut, to save about 40 words.

**17. Main text never says that the same mutation can work in one patient and not another, but Quiz Q3 and the figure goal depend on it (l.229, l.230, l.446).** HLA is taught in Chapter 4, but this chapter should recall it in one sentence. Add after the pipeline step 3: "Because HLA differs from person to person, a mutation that is a good target in one patient can be invisible in another." Add to step 4: "...clonal mutations over those in only one branch of the family tree, because a vaccine aimed at one branch leaves the other branches free to grow back."

**18. The mRNA paragraph brings in terms that are not needed (l.229, l.234).** Cut "{{epitope-prediction|epitope prediction}}" (never used again) and cut "fragments can also reach MHC class II for helper CD4 T cells" (the deep-dive "A helper surprise" covers it). That removes three terms and about 40 words. Then complete the lottery line: "When most tickets are blanks, you buy many tickets: at 6% a hit, 34 targets should yield around two that work."

**19. Figure ch11-personal-vaccine is overloaded, and its hit rate contradicts the 6% line it ends on.**
- Overload: 12 cards each with four attributes (location, predicted fit, "made by tumor", "change from normal"), a family tree with proportions, a toggle with six allele names (A*02:01...), an 80-cell tumor and a four-phase stepper. A non-biologist will not know what to optimize.
- Contradiction: in the fixed table about a third of mutations "work" (4 of 12 in each HLA set), and picks often yield 2-3 successes of 6, yet the closing caption says "only a small minority trigger T cells: about 6%". The reader will think the game and the data disagree.
- Suggested simplifications:
  - Cut to eight cards and two clones (trunk plus B and C).
  - Replace allele names with "Patient 1 / Patient 2" and a picture of two shop windows.
  - Merge "Made by the tumor" and "Change from normal" into a single "Looks foreign and abundant enough?" indicator, or keep just two attributes.
  - Make the final caption honest about the game: "This game is far kinder than reality: here about one in three mutations works; in real tests, about one in sixteen."

**20. Figure ch11-four-fixes crowds two scenes, four switches, three presets and a score into one view.** The lymph-node and tumor scenes carry dendritic cell, MHC cups, TCR glyphs, MDSCs, Tregs, PD-L1 glyphs and antibodies. Consider a one-scene stepper, "add one fix at a time", with a single running meter. If you keep two scenes, drop the MDSCs and Tregs (the guardrails already call them "scenery"). The micro-captions are plain and good; keep them. See Must 3 and 4 for the preset B and tier-2 wording problems.

---

## Must/Should: other figure, quiz and flow notes (merged)

**21. Figure ch11-hpv is good but has four extra layers.** The CIN3 toggle (precancer is a second concept), the whiskers ("95% CI" is explained only later, in the hazard-ratio box), the switch from "% reduction" to "per 100,000 woman-years" in the Scotland view, and the unit grid that repeats the bar. Suggestions: (a) show CIN3 only in the tooltip; (b) add a legend "thin line = range of plausible values"; (c) in the Scotland view say "per 100,000 women per year"; (d) keep the unit grid, because it makes "87%" tangible, but make England the only view that has it.

**22. The quiz has weak distractors and misses the two ideas that matter most.**
- Q1 (l.436): options a and c are easy eliminations ("contains live virus" contradicts the chapter). Note also that younger adolescents do mount stronger antibody responses, so a is not wholly false.
- Q2 (l.441): the correct answer is the longest option by far, and the two distractors ("Tumors don't display any proteins", "T cells cannot kill cancer cells") were already refuted in earlier chapters. The stem also presents the chapter's hypothesis as fact (see item 4).
- Q4 (l.451): distractors c and a are straw. The tempting wrong answer ("the virus itself spread through the blood to the distant tumor") is missing.
- Gap: nothing tests the preventive vs therapeutic distinction directly, and nothing tests proven-vs-promising.
- Suggested replacements:
  - Q2 as an application question: "A new vaccine targets a shared normal protein, with a strong adjuvant, given right after surgery, with no checkpoint inhibitor. Which weakness is most likely to remain? [correct: the target is a protein T cells were largely trained to ignore, and the brakes are still on]".
  - Add Q5: "Which statement best describes personalized mRNA vaccines in October 2026? a) approved after a successful phase 3 b) a randomized phase 2 was promising but borderline; the phase 3 has only topline company results; none is approved [correct] c) abandoned after failure."
  - Q4: add the distractor "The virus spread through the blood and infected the distant tumor itself."

**23. Flow and placement.**
- Move the clinic box (l.106-108) up to follow the HPV caveat (l.98); at the moment it sits after the hepatitis B section but talks about HPV.
- Delete the last paragraph of the first deep-dive (l.117), which repeats l.104.
- The hazard-ratio deep-dive (l.341-345) repeats Chapter 8's definition. Link to it and keep only the KEYNOTE-942 specifics.
- The "Two modest wins, and a clue" heading (l.199) mislabels BCG, which is a standard of care. Rename "Two early wins, and a clue". Add a back-link to the interlude on BCG. Define "progression" for sipuleucel-T: "yet the time until scans showed the cancer growing did not change".
- The Leiden "clue" (l.205) rests on a 20-patient uncontrolled study; add "in a small study with no comparison group". The 2017 proof-of-concept papers (l.300) also had no control group, so say so: "several patients stayed free of relapse, though with no comparison group nobody could tell how much credit the vaccine deserved".

**24. Two similar drug names will blur: "intismeran autogene" and "autogene cevumeran" (l.230, l.322, l.328).** After the first introduction in step 4, refer to them by what the reader already half-knows: "Moderna and Merck's vaccine (melanoma)" and "BioNTech and Genentech's vaccine (pancreatic)". Keep the generic names in the first mention and in the figures.

**25. The ending (l.427-433).**
- "The chapter's threads form a pattern" is meta; start with the substance: "So far, therapeutic vaccines seem to work best when..." and include the missing fourth link (a strong alarm).
- "The breakthroughs came" is a stronger word than the evidence supports for therapeutic vaccines; use "The successes".
- The last line leaves out oncolytic viruses entirely. Suggested close: "...a virus before it arrived, a typo it had never been taught to ignore, or, with oncolytic viruses, a tumor made to show its own proteins in the middle of a fire."
- Optional but valuable: replace the "pattern" paragraph with a six-row "Where things stand, October 2026" table: HPV and hepatitis B vaccines (proven, standard); BCG and T-VEC (approved, modest); sipuleucel-T (approved, modest); personalized mRNA with anti-PD-1 (promising: randomized phase 2 borderline, phase 3 topline only, not approved); pancreatic (promising, tiny and non-randomized); colorectal and KRAS (setbacks). It does the proven-vs-promising job in about 90 words.

---

## Optional (brief)

- **Hepatitis B date (l.104):** Taiwan's program began in July 1984 for newborns of carrier mothers; verify that "every newborn" in 1984 matches ref 8 (universal coverage may have followed in 1986).
- **TESLA (l.309):** the model "filtered out 98% of non-immunogenic peptides with a precision above 0.70" per the abstract. Consider adding what that costs (true hits lost); I could not confirm the figure from the abstract.
- **Hook structure:** "The strange part: this vaccine prevents cancer without ever showing the immune system a cancer cell" (l.15) may not read as strange to a reader who knows HPV causes cervical cancer. Suggest "The mechanism is almost disappointingly simple:".
- **Oncolytic figure:** Phase 6 and Step 6 (antibodies mop up the virus) add an extra idea not in the goal; the deep-dive already carries it (l.422). Cut it from the figure to keep one idea.
- **Interlude link:** add "(see the interlude)" for BCG (l.203) and Rosenberg (l.122).
- **Date fragility:** "(a presentation was scheduled for October 24)" will go stale; fine if the build is dated.

---

## Suggested cuts toward 3,000 words (about 340 words)

| Where | Cut | Words saved |
|---|---|---|
| l.43 WHO single-dose sentence | duplicated by the clinic box | 25 |
| l.45-49 Scotland bullet and "Caution is due" paragraph | already in the opening and the figure | 30 |
| l.17 melanoma pipeline description in the hook | compress by half | 25 |
| l.23 "adaptive immune system", photocopy clause | already taught in Chapter 3 | 20 |
| l.106-108 clinic box | compress to two sentences | 30 |
| l.229, l.234 epitope prediction, MHC II/CD4 | see item 18 | 40 |
| l.322 hazard ratios and five-year detail | see item 6 | 50 |
| l.324 NCT number and detail | see item 5 | 10 |
| l.338 KRAS phase 1 numbers | see item 16 | 40 |
| l.356-358 oncolytic names and glioma | see item 13 | 60 |
| l.427 "chapter's threads form a pattern" sentence | see item 25 | 20 |

Net: about 350 words cut. Add back about 150 for the fixes in Must 2, 5 and 7 and items 12 and 17, so the net is roughly 3,130. To land at 3,000, the table (item 25) can replace the "pattern" paragraph, and the clinic box could move into a "Go deeper" box.
