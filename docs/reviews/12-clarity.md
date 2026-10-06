# Chapter 12 "The Frontier": reader-experience review

Reviewed: `content/drafts/12-frontier.md` (line numbers refer to that file). Persona: an intelligent non-biologist whose family member was just diagnosed, who has read Chapters 1-11.

## Overall impression

The chapter has a great spine: the 12-of-12 versus 1-in-5 hook, the "broken link in a seven-step loop" frame, the shop-window / deaf / walls vocabulary, "Mice are not small people", "A plausible mechanism is where a drug's story starts, not where it ends", the watch-and-wait box, and the final "mostly self" paragraph all feel earned. The honesty about failures (STING, T-VEC, epacadostat, magrolimab, TIGIT) is exactly what this reader needs. Where it loses me: the second half of the chapter drifts into a roster of trials and drug names, much of which Chapters 8 and 11 already told (epacadostat, TIGIT, T-VEC, personalized vaccine), and the "What's next" bullets are then repeated again in the deep-dive scoreboard. The hook compares two numbers that are not like-for-like, and a few claims (ctDNA "spared those who did not need it", "showed exactly this", the low-dose nivolumab trial) are stated more strongly than the evidence supports. The patient guidance is useful but thin on cost help, goals of care, and an explicit "not medical advice" line. The two heaviest figures (combinations game, neoadjuvant stepper) try to do more than "one idea". Main text is about 3,350-3,500 words depending on how you count headings and bullets (target 3,000), with 45 citations; I think a net cut of 400-500 words is realistic without losing anything the reader needs.

---

## Must fix

**1. The hook compares unlike things, and the 20% has an unstated denominator.**
- Location: l.9-15. "Twelve people with rectal cancer received six months of dostarlimab..." / "about 57% of Americans with advanced cancer were eligible ... yet only about 20% — one patient in five — were expected to respond" / "Same family of drugs. One small trial at 100%; the field as a whole at about 20%."
- Problem: (a) The twelve all had mismatch-repair-deficient tumors, a rare, mutation-riddled type (Ch 6/8). That is not mentioned until l.305-307, about 300 lines later, so for the whole chapter's first third the reader thinks the gap is about "the drug" rather than "the tumor". A skeptical reader will feel manipulated when they finally learn this. (b) "yet only about 20%" reads as 20% of the 57% who were eligible; if the source's 20% is of all patients (so roughly one in three of those eligible), the sentence misleads. Please confirm the denominator in ref 2.
- Fix: l.9 "Twelve people with a rare, mutation-riddled kind of rectal cancer (mismatch-repair deficient, from Chapter 6) received six months of dostarlimab..." l.13: state the denominator explicitly ("only about 20% of all such patients"). l.15: "Same family of drugs. One tiny trial at 100%; the field as a whole at about 20%. It is not a fair comparison: those twelve tumors were unusually easy for T cells to see. But the gap is the point, and this last chapter is about what lies in it: why immunotherapy ... "

**2. The low-dose nivolumab trial can be read as "a tiny dose works as well as a full one", which the trial did not test.**
- Location: l.532. "Its investigators tried something pragmatic: a flat 20-milligram dose of nivolumab ... added to inexpensive oral drugs. One-year survival rose from 16% to 43%." Also l.530 "the same milligram cost about a fifth as much in Australia."
- Problem: the comparison was against the cheap oral drugs alone, not against full-dose nivolumab. A patient's relative who reads this might ask an oncologist to cut the dose. Also "the same milligram" is awkward (the milligram is not what is priced).
- Fix: "...a flat 20-milligram dose of nivolumab — a small fraction of the usual dose — added to inexpensive oral chemotherapy. Compared with the oral drugs alone, one-year survival rose from 16% to 43%. The trial did not compare low with full doses; that question is still being studied, and it is not something to try on one's own." l.530: "...and the same dose cost about a fifth as much in Australia."

**3. The ctDNA paragraph overclaims and has an arithmetic gap.**
- Location: l.426. "In other words, a blood test both found the people who needed immunotherapy and spared most of those who did not." Also "761 people ... The 250 ... The 357 ...".
- Problem: (a) Nobody gave the drug to the ctDNA-negative group, so the trial cannot show they "did not need" it, only that 88% did well without it. (b) 761 tested, 250 + 357 = 607: a numerate reader asks where the other ~154 went. (c) The CheckMate 816 sentence (75% vs 53%) is an exploratory association stacked into the same already-dense paragraph; the figure's card says "Exploratory analysis" but the main text does not.
- Fix: "...with the drug, median survival rose from 21 to 33 months. A further 357 people stayed ctDNA-negative and received no immunotherapy; 88% were still disease-free two years later. [One clause on the remaining ~150, or drop the 761.] So the test picked out people who gained from the drug, and most of the rest did well without it — though without a comparison group we cannot say whether they might have done even better with it." Move the CheckMate 816 numbers to the figure card only (or label them "an exploratory analysis" in one short sentence).

**4. The neoadjuvant mechanism is presented as settled, and NADINA is used as if it isolated timing.**
- Location: l.295 "The reasoning is elegant."; l.297 "In 2016, mouse experiments showed exactly this"; l.299 NADINA; figure goal (l.315) and steps 3-5, 7 captions (l.381-385).
- Problem: S1801 shows that timing helps. Why it helps (tumor-as-vaccine broadens the T-cell response) rests on mouse work and a 20-patient pilot. The PLAN asks us to separate established from plausible. Second, NADINA compared ipilimumab plus nivolumab before surgery with nivolumab alone after, so it changed the drugs as well as the timing; step 7's "The NADINA trial found a similar advantage" invites the wrong inference. The analogy ("personal vaccine") also never says where it breaks (the tumor is simultaneously suppressing T cells).
- Fix: l.295 "...A tumor left in place may work like a personal vaccine. (The analogy has a limit: the tumor is also suppressing T cells, which is why the drug matters.)" l.297 "...mouse experiments supported this idea". After the NADINA sentence add: "NADINA changed both the drugs and the timing, so S1801, where only the order differed, is the cleaner test. Both show that order matters; the vaccine idea is the leading explanation, not yet proof." Step 3 caption: "...the tumor is acting as a vaccine — the leading hypothesis for why timing matters." Step 7: "NADINA, which also changed the drugs, found a similar advantage."

**5. Word budget and "list of trials" feel (main text ~3,400, target 3,000).** Net cuts of ~450 words, all of them names and numbers the reader will not retain:
- l.299-305 (neoadjuvant): keep SWOG S1801 and NADINA by name (the figure uses them). Replace l.301 (CheckMate 816, KEYNOTE-671, head and neck; ~70 words, three trial names) with: "Lung cancer followed: adding immunotherapy to chemotherapy before surgery (and in one trial continuing it afterward) improved survival, and both approaches are now approved. Head and neck cancer has seen similar gains.[^21][^22][^23]" (-35). The five-year 55% to 65% figure is already in the pathology box.
- l.305 (MSK follow-up, 154-patient trial, FDA date, company statement): this is the single hardest paragraph in the chapter (117, 49, 82 of 103, 92%, 154, February 2027). Rewrite: "In 2025, the same team reported 117 patients with early-stage tumors of this type, in the rectum and elsewhere. Every rectal-cancer patient who completed treatment had a clinical complete response (no sign of cancer on any examination, scan or biopsy) and chose to skip surgery; two years in, 92% across all tumor types remained free of recurrence.[^24] A larger international trial has, according to its sponsor, met its main goal, and US regulators are expected to decide on approval around February 2027; as of August 2026, dostarlimab was not approved for rectal cancer anywhere.[^25]" (-45)
- l.172-176: tighten radiation/T-VEC/STING (-60). Drop "a disease where anti-CTLA-4 had shown little effect on its own" or explain it; T-VEC was told in Ch 11 (see item 6).
- l.186: epacadostat to two sentences with a Ch 8 pointer (-45); see item 6.
- l.406 and l.426: remove the city list (Paris, Houston, Chicago, Israel, Pittsburgh) and the CheckMate 816 sentence (-70).
- l.428 (AI): keep the 608-peptide benchmark, shorten the first two sentences (-30).
- l.506-510: What's-next bullets, see item 6 (-60).
- Naming: drop "led by Antoni Ribas" (l.31), "Cercek and Diaz" (l.9) is fine to keep once as the hook's human touch.
This frees room for the ~120 words of additions in items 1-4, 8 and 9.

**6. The chapter repeats stories already told in Chapters 8 and 11, and repeats itself within the chapter.**
- Epacadostat: Ch 8 (l.385, same 706 patients, 4.7 vs 4.9 months), here l.186, again in the "Why good ideas fail" box (l.282), again in the game's card (l.258-259). That is four tellings.
- T-VEC + pembrolizumab (692 patients): Ch 11 l.356, here l.176, and the game card (l.255).
- Bempegaldesleukin: box l.284, "Better cytokines" bullet l.508, scoreboard l.521.
- TIGIT, LAG-3: Ch 8 covers both; here bullet l.506 plus scoreboard l.515-517. Magrolimab, ivonescimab and the personalized vaccine are each told in a bullet and again in the scoreboard box (l.507, 509, 519, 523, 525), plus the vaccine in the game card and Ch 11.
- Problem: a reader who reads linearly feels the déjà vu; "What's next" therefore reads as a recap of failures rather than a frontier.
- Fix: (a) In the main text, tell epacadostat once (here or Ch 8, not both): "Recall epacadostat from Chapter 8: impressive in an early trial with no comparison group, nothing in a 706-patient randomized one." Keep the details only in the "Why good ideas fail" box. (b) Reduce "What's next" bullets to one sentence each and drop LAG-3 and TIGIT (point to Ch 8) and the NK/vaccine/CAR-T bullet (it is a table of contents). Keep CD47, ivonescimab, and "better cytokines" (name the drug once). (c) Make the scoreboard box the only place for numbers (SKYSCRAPER-06 medians, ENHANCE rates). (d) Delete the "Better cytokines" bullet and let the "Why good ideas fail" box own bempegaldesleukin.

**7. The combinations game is overloaded, and by my reading of the model only one of the four tumors can ever reach "Strong response".**
- Location: l.195-279.
- Problem: (a) The reader faces 4 profiles, 9 therapies, a 3-pick limit, 7 strength bars, 2 meters, particle animation, a real-world card for 8 pairs, and a footnote. That is not "one idea". (b) Working the numbers: B (excluded) tops out at 0.5 ("Partial"), C and D also tops at "Partial"; only A (Inflamed but braked) reaches "Strong" with a single click. The prompt "Can you get a strong response without making side effects unbearable?" implies it is possible for each tumor, so a reader will feel they are failing. The honest lesson (most broken tumors stay hard) is good, but the game never says so. (c) The model takes the minimum of the 7 steps, which embodies exactly the all-or-nothing reading the main text warns against at l.21 ("links are rarely all-or-nothing"). (d) The IDO tile has the subtitle "Blocks a T-cell-starving enzyme" yet does nothing, so the model bakes in the conclusion before the reader sees the real-world card.
- Fix: cut to six tiles (Anti-PD-1, Anti-CTLA-4, "Kill-and-alert: radiation, chemotherapy or an injected alarm", Cancer vaccine, Gate openers, Engineered killers). Show strength bars only on the broken steps, not all seven. Keep IDO as a "trap" tile but make its real-world card say why the reader's intuition failed. Replace the prompt with "Pick a tumor and add up to three treatments. Which breaks can you repair, and what does it cost in side effects?" and add an outcome for the best-possible-but-still-partial case: "No treatment on the tray fully repairs this tumor. That is where much of the real research is." Add one line to the footnote: "Real links are rarely all-or-nothing; this model uses the weakest link for simplicity." Rename "MHC-free killers" (jargon) to "Engineered killers (CAR-T, engagers)".

**8. Patient guidance: useful and humane in parts, but missing an explicit "not medical advice" line, and the symptom list can falsely reassure.**
- Location: l.538, l.540, l.547, l.549-551.
- Problems: (a) l.538 "This guide cannot tell anyone which treatment to choose" is close, but the section never says it is not medical advice or that the details depend on the cancer, stage and the person. (b) l.547 lists seven symptoms; a partial list can imply "if mine is not on it, I can wait". (c) Missing questions a family would actually want: What is the goal of this treatment (cure, long-term control, comfort)? Is a second opinion at a specialist center reasonable? (d) "MSI" is unexplained. (e) Cost: the chapter spends three paragraphs on price and then gives the reader nothing to do about it. (f) l.549 "usually provided free" omits that routine care and travel costs may not be. (g) The clinic warning (l.551) is stern; the person tempted by a clinic is usually scared, not foolish.
- Fix: l.538: "Nothing here is medical advice, and no chapter can account for your cancer, your stage or your health. But understanding the science helps in asking better questions. Some worth bringing to an oncologist:" Add bullets: "What is the goal of this treatment: cure, long-term control, or comfort?" and "Would a second opinion at a specialized center be reasonable?" Reword the first bullet: "...mismatch repair (also called MSI)...". l.547: "Immune side effects can begin weeks or months after treatment starts, and sometimes after it ends. Any new or worsening symptom, for example diarrhea, cough or breathlessness, rash, severe fatigue, headaches or vision changes, is worth a same-day call to the care team; don't wait for the next appointment or try to judge whether it is 'immune-related'. Tell any doctor ..., including in an emergency room..." Add to the cost section or guidance: "In the US, most cancer centers have financial counselors, and drug makers and charities run assistance programs; ask early." l.549: "...the experimental drug is usually provided free; routine care is billed as usual and travel often is not." l.551: add "Wanting to try everything is human, not foolish. Bring what you are considering to your oncologist as a question, not a confession." Also add: "Tell your team about any supplements or probiotics before starting them (the gut-bacteria section above says why)."

**9. The ending: strong final paragraph, but "Every advance" overreaches, "melt away" risks false hope, and the hook is not closed.**
- Location: l.555, l.557, l.559.
- Problems: (a) l.555 "Some rectal cancers now melt away without surgery." The earlier text hedges (trial, rare subtype, not approved); the closing line drops all of it, and it is the line a worried reader will carry away. (b) l.557 "Cold tumors, such as most pancreatic and prostate cancers" is uncited and not established earlier in the chapter. (c) l.559 "Every advance in this chapter is, at heart, a way of helping the body see what is already there. That is a solvable problem." Not true of ctDNA tests, cost reductions, or low-dose regimens, and "solvable" is stronger than the evidence (PLAN: no hype). (d) The opening 12-of-12 versus 1-in-5 is never revisited.
- Fix: l.555 "In trials, some people with one rare kind of rectal cancer have been spared surgery." l.557 add a citation or hedge: "Tumors that are mostly cold, such as most pancreatic cancers, remain stubborn." l.559: "...Cancer is hard because it is mostly self. Much of this chapter is, at heart, an effort to help the body see what is already there, or to find out sooner whether it has. Whether that can be fully achieved nobody yet knows; the last fifteen years suggest it is worth the effort. The distance between twelve out of twelve and one in five is the work that remains."

---

## Should fix

**10. The neoadjuvant figure tries to teach three ideas and has an internal inconsistency.**
- Location: l.313-388.
- Problem: (a) Goal is "timing primes more clones". But step 7 adds a bar chart (numbers already in the main text and in step 7's own caption: three tellings of 72/49 and 84/57), and step 8 adds a different idea (no surgery). That is 8 steps, 3 hidden metastases, 6 glyph shapes, 2 clone counters, 2 timelines and a results panel. (b) Step 1 caption says "a tumor in a lymph node", but the figure draws a primary tumor in tissue and a separate lymph node as the briefing room (Ch 4), so the reader sees the lymph node twice with different meanings. (c) Spec step 4: the adjuvant lane expands "triangle and circle" clones "because only scant antigen from micrometastasis A reached the node": the triangle is A, but nothing explains the circle.
- Fix: keep six steps (end at the pathology report). Move the 72%/49%, 84%/57% bars out of the figure (they are in the text) or drop them from the caption. Move the "no surgery" scenario to the text and the clinic box. Use three antigen shapes only (triangle, star, diamond) with clone counters of 3 versus 1. Step 1 caption: "Two patients have the same melanoma: a visible tumor and, invisible to any scan, a few stray cancer cells that have already settled elsewhere."

**11. The resistance figure duplicates the text and adds a layer nobody asked for.**
- Location: l.41-150, spec.
- Problem: the main text names six mechanisms; the figure has nine chips (text merges "Few typos" with "Typos deleted", and "No scouts" with "Corrupt guards"), so the reader maps six onto nine. The P/A (primary/acquired) tags add a second dimension that the text never uses again; the evidence for several tags is thin (is "walls" only primary?). The three outcome badges (check, approximately, cross) distinguish "Little effect" from "No effect" in a way the reader cannot reconstruct.
- Fix: match the text: seven chips (Brake on, Nothing new to see, Shop window shut, Deaf to the alarm, Walled off, No scouts or corrupt guards, Host factors). Drop the P/A tags (or move them into the Go-deeper box). Use two outcomes only: "Fixed" or "No fix". Optionally move the figure up so that it comes right after the cycle recap (l.21), where the wheel is fresh, and let the six paragraphs read as the figure's commentary.

**12. Terms used before defined or never glossed in plain words.**
- "clinical complete response" (l.305, l.310): defined only in the glossary popover. Add the plain gloss inline: "no sign of cancer on any examination, scan or biopsy".
- "mismatch-repair deficient" (l.305) is used a paragraph before its explanation (l.307) and never at the hook (item 1).
- "randomized" and "uncontrolled" (l.192, bullet "Uncontrolled trials mislead"; l.186): plain gloss needed in the main text. "In a randomized trial, chance decides who gets the new drug, so the groups are comparable; without that comparison group, a drug can look good simply because the patients enrolled were doing well anyway."
- "T-cell clones" (l.295, l.297): recall in one clause ("groups of T cells that share the same receptor, Chapter 3").
- "median" appears repeatedly (l.186, l.426, l.509) and is never glossed; add once: "the middle patient".
- The "Why good ideas fail" box (l.286) uses "neoadjuvant" and "NADINA" before the main text introduces them at l.293-299. Move that paragraph into the neoadjuvant section or its pathology box.
- "T-VEC" (l.176) first appears as an acronym; "the oncolytic virus T-VEC (Chapter 11)".

**13. Sentences I had to read twice.**
- l.31 "about 30% of non-responders' tumors had lost a copy of B2M, against about 10% of responders'" Rewrite: "had lost one of their two copies of the B2M gene".
- l.39 "those with the most varied HLA class I genes survived longer than those with two identical copies of at least one" Rewrite: "People inherit two versions of each HLA gene, one from each parent. Patients whose two versions differed at every HLA class I gene survived longer than patients with a matching pair at one or more of them." Also "Gut bacteria and medicines matter too." is a dangling sentence: "Gut bacteria and some medicines matter too (more on gut bacteria below)."
- l.299 "alive, with no relapse, no growth of the cancer and nothing that derailed their planned treatment" Rewrite: "alive and cancer-free, with no relapse and no complication that stopped treatment or surgery".
- l.172 "shrank tumors in 18% of patients" Which tumors? State "tumors outside the irradiated area" if that is what the source measured.
- l.532 "reach only 1-3% of patients" Rewrite: "are given to only 1-3% of patients who need them".

**14. "Link 1 and 6" tags make the reader flip back.**
- Location: l.29-37, headings "(links 1 and 6)", etc.; l.523 "(links 4 and 5)"; figure uses "step". The numbered tags only work if the reader remembers the numbering from the one-sentence recap at l.19.
- Fix: use names instead of numbers in the prose ("Nothing new to see (antigen release and recognition)") or number consistently as "step" everywhere. Pick one of link/step.

**15. Microbiome section: non-parallel numbers, and "narrowly missed its main goal" is unexplained.**
- Location: l.404-408.
- Problem: "Tumors shrank in 3 of 10 patients in Israel, and 6 of 15 benefited in Pittsburgh" uses two different measures ("shrank" vs "benefited", probably including stable disease). "A median of 24 months ... against 9 months ... although the trial narrowly missed its main goal" reads as a contradiction; the reader cannot tell if 24 vs 9 months is good or noise. "more diverse, or richer in particular bacterial families and species" is muddy.
- Fix: use one measure for both small trials (e.g., "responded" or "responded or stayed stable") and add "neither had a control group". For TACITO: "...24 months versus 9 with a sham transplant. The difference narrowly missed the trial's formal goal, meaning chance could still explain it, so treat it as a hint." Replace the place names with "Teams in France and the United States".

**16. The "Turning cold tumors hot" section has no bottom line, and one sentence contradicts the section before it.**
- Location: l.168-178.
- Problem: l.170 "Most tumors that ignore checkpoint inhibitors are 'cold'" follows a section arguing resistance has nine causes, only some of them cold. Three of four strategies (radiation, T-VEC, STING) are followed by "mixed" or "disappointing", and then there is no takeaway. The STING "about one in ten responded" needs a benchmark ("no better than PD-1 blockade alone would be expected to give").
- Fix: l.170 "Many tumors that ignore checkpoint inhibitors are 'cold'...". Add a closing sentence: "So far: strong in mice, mostly modest in people; chemotherapy plus PD-1 blockade is the main exception."

**17. The chapter has no signpost after the combination section; the middle sags.**
- Location: between l.193 and l.293. After combinations (all failure and difficulty) the reader gets a long failure-heavy stretch before the neoadjuvant lift.
- Fix: add a two-sentence bridge before l.293: "So far the story is that the cycle breaks in many places, and patching one link rarely suffices. The rest of this chapter looks at three ways around that problem: changing the timing of treatment, changing the body's ecosystem, and measuring more cleverly."

**18. Quiz: distractors are weak, the correct answer is always the longest, and one explanation relies on facts the chapter did not give.**
- Q1: "T cells have used up their PD-1" and "tumor grows too fast for any drug" are implausible. Better traps: "PD-L1 is gone, so there is no brake left to release" and "B2M loss walls T cells out of the tumor" (confusion with exclusion).
- Q2: the stem already says "same total number of doses", so the "dose" distractor is ruled out by the question itself. Rewrite stem: "Both groups received pembrolizumab. What did the SWOG S1801 trial vary, and why might it matter?"
- Q4: the explanation for the second option claims "ctDNA-positive patients relapsed far more often than ctDNA-negative ones"; the chapter never says that (it gives median survival for the positive group and a disease-free rate for the negative group). Change to "ctDNA-positive patients on placebo did much worse than ctDNA-negative patients who were left untreated".
- Coverage: nothing on combinations, cold tumors, or how to read a trial headline, which is arguably what a reader most needs after this chapter. Add a fifth question: "A company announces that a new drug 'met its main goal' in a phase 3 trial but has released no data. Most careful reading? [x] Promising but provisional: wait for the full results, the size of the benefit and the side effects; [ ] It will soon be approved; [ ] It cures patients who take it." Also trim the correct answers so they are not always the longest.

**19. The ctDNA figure is mostly good, but "Cured" overclaims and "log scale / decades" adds noise.**
- Location: l.430-500. Scenario label "Cured" contradicts step 2's own message that a negative test "lowers the risk of relapse rather than ruling it out". Rename: "Treatment clears it". Drop "log scale" from the axis label (the spec already says no numeric ticks); the dashed resistant-clone sub-curve in scenario 3 can go. Step 5 "patients whose tests stayed negative were spared it" should echo item 3: "...did well without it".

**20. Takeaways overreach.**
- Location: l.586, l.588. "in mismatch-repair-deficient rectal cancer it can replace surgery altogether" (add "in trials, for a small group, and not yet approved"). "Blood tests for tumor DNA can now help decide who needs immunotherapy" (add "in one bladder cancer trial so far"). "thousands of trials have been run" (5,683 were testing PD-1/PD-L1 drugs, many ongoing; say "thousands of trials are testing").

---

## Optional

**21. Cut glossary terms used once.** `abscopal-effect`, `immunogenic-cell-death`, `sting`, `mdsc`, `biosimilar` appear once each. Use "alarm" language or "suppressive immune cells" in the main text and drop the terms; each saves a popover and a thought. (The abscopal effect is a fun fact; keep it as a plain-language sentence without the Latin.)

**22. Name-dropping and place-dropping:** "led by Antoni Ribas" (l.31), "Paris ... Houston and Chicago ... Israel ... Pittsburgh" (l.404-406) carry no information for this reader.

**23. International readers:** l.549 gives the US hotline only. Add "elsewhere, national cancer societies often run similar lines."

**24. Give the hook a human face.** One sentence from the patient's side ("after six months of infusions and clear scans, the surgery they had been told to expect never came") would anchor the persona's own situation before the numbers. Only if a documented source exists.

**25. Verify and soften three claims.** "Failures far outnumber them" (l.184, no source); "so no T cells are primed at all" (l.37; ref 7 shows few T cells, not none; "so few T cells are primed"); and that ref 40 (a conference news item) really supports "approved in China in 2025" (l.509).
