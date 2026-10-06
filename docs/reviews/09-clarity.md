# Chapter 9 "Antibodies as Medicine": reader-experience review

Reviewed: `content/drafts/09-antibodies.md` (line numbers refer to that file). Reader persona: a software engineer who has read Chapters 1-8 and has a parent with cancer.

## Overall impression

The spine is strong. The puzzle in the opening ("a molecule that can only stick"), the parallel Block / Flag / Starve headings, the "here the missile analogy breaks down" paragraph, the T-DM1 vs T-DXd contrast, the tebentafusp-as-callback to Chapter 4, and the "borrowing to building" close all make me feel the author is in control. The chapter loses me in three places. The first ~900 words (manufacturing, humanization, naming) go by before a single cancer is treated. The ADC and engager sections turn into drug-name and number lists, with at least three drugs appearing in the main text before the chapter has introduced them. And all four figures are built as multi-mode toolkits, where the plan promised one idea each. The main text is ~3,190 words with ~25 inline citations; the fixes below should net out around 250-300 words shorter (about 2,900-2,950), mostly from cuts of names, trial labels and one-use jargon, even after adding the few missing hedges.

---

## Must fix

**1. Three drugs are first met in the "Price of precision" section, which is main text, after being introduced only in a collapsed box.**
- Location: l.537 "Talquetamab's target, GPRC5D, is also found in healthy hair follicles…"; l.537 "With teclistamab, 76% of patients had infections"; l.539 "Teclistamab starts with two small doses…" and "Glofitamab is preceded by a dose of a CD20 antibody…". In the main narrative (l.420) myeloma and lymphoma are covered with no drug names at all; teclistamab, talquetamab and glofitamab appear in the main text for the first time in this section.
- Problem: a reader who skips boxes meets three unexplained names, and a reader who reads everything has to hold three look-alike names for numbers that depend on which one it was.
- Fix: introduce one running example at l.420 and keep the rest generic. Rewrite l.420: "Engagers now also treat myeloma (teclistamab, for example, links a protein called BCMA on myeloma cells to CD3) and lymphoma (targeting CD20), often in patients who have exhausted other options. In the trial that won teclistamab its approval, more than six in ten heavily treated patients responded." At l.537: "A different myeloma engager targets GPRC5D, which also sits in healthy hair follicles and, it seems, parts of the tongue and nails…". At l.539: "One lymphoma engager is preceded by a dose of a CD20 antibody…". (Talquetamab and glofitamab then live only in the roster box.)

**2. The second key-idea box is false for the chapter's own flagging example.**
- Location: l.307, in the box after the HER2-low story. Quote: "For a naked antibody, the target has to *matter* to the cancer. For an ADC, the target only has to be an *address*."
- Problem: the reader has just read that rituximab flags CD20 cells for destruction, and CD20 is a handle, not a growth driver. Flagging antibodies, like ADCs, only need an address. The key-idea box overgeneralizes "naked" when it means "blocking".
- Fix: "A blocking antibody works only if the target *matters* to the cancer. A flagging antibody or an ADC only needs the target as an *address*: a protein on the surface that something else can use to get in."

**3. The naming code is taught as a decoder ring, then the opening list of names breaks it, and the takeaways cite material that is only in a box.**
- Location: l.9 opening list (Tarlatamab), l.41 "In the classic code, the letters before *-mab* give the source…", l.577 takeaways: "Since late 2021, new antibody names end in -tug, -bart, -mig or -ment instead of -mab."
- Problem: a reader who has just learned "-zumab = humanized" tries to decode "tarlatamab" and gets nothing. The main text never says why. The takeaway then mentions four stems the main narrative never taught (they live only in the deep-dive).
- Fix: add one sentence after l.41: "Names chosen since 2017 drop the source letters, which is why tarlatamab, from our opening list, does not reveal its origin. The box below tells the full story." In the takeaways, replace the stems sentence with "Newer names have dropped the source letters, and since late 2021 new antibodies no longer end in -mab at all."

**4. The "HER2-low" leap is stated as fact in the quiz but never explained in the main text.**
- Location: l.304 "Then came a conceptual leap…"; Quiz Q4 (l.568-572).
- Problem: the text gives a bystander effect, a DAR and a HER2-low trial result, and leaves the reader to connect them. A skeptic asks "so is it the bystander effect or the eight payloads or just a better drug?" The quiz then presents the three-part answer as settled, which the chapter never established (PLAN: distinguish established from plausible).
- Fix: after "…created a new treatment category almost overnight" add: "The likely explanation is the design just described: even a little HER2 gives an eight-payload antibody somewhere to stick, and a payload that can cross membranes reaches neighbors that have none. Plain trastuzumab, which only works if HER2 matters to the tumor, did not help these patients." Also see item 18 for the quiz.

**5. The front of the chapter sags: ~900 words of manufacturing, humanization and naming before the first cancer mechanism, and it contains the chapter's heaviest one-use jargon.**
- Location: l.23-43.
- Problems (each costs the reader a breath without paying off):
  - l.35 "called {{cdr|CDRs}} (complementarity-determining regions)": long form and acronym are never used again in the main text.
  - l.39: one bullet carries phage display, a virus-versus-library explanation, George Smith, Greg Winter, a Nobel Prize and "2002 and 2006, respectively". The reader never sees the word "phage" explained in the body (the glossary does it).
  - l.31 "muromonab-CD3": a name never used again, and "CD3" appears undefined four sections before CD3 is explained.
  - l.23: six defined terms (polyclonal, B cells, myeloma, plasma cells, hybridomas, monoclonal) in one paragraph; "polyclonal" is used once.
- Fix (rewrite l.31-41):
  "The first monoclonal antibody approved as a drug, in 1986, was used to stop transplanted kidneys from being rejected. It was pure mouse protein, and that caused problems. [keep l.33 as is]
  The engineering fix rests on one fact of antibody anatomy. The part that grips the target is tiny: six short loops at the tip of each arm. Everything else is a frame that holds the loops in place. So engineers swapped the mouse frame for a human one, stage by stage:
  - **Chimeric** antibodies keep the mouse's whole tips on a human frame. They are roughly two-thirds human. Rituximab and cetuximab are chimeric.
  - **Humanized** antibodies keep only the six mouse loops, grafted onto a human frame (Greg Winter's lab, 1986). They are about 90% human or more. Trastuzumab and pembrolizumab are humanized.
  - **Fully human** antibodies contain no mouse protein at all. They are fished out of libraries of human antibody fragments, or made by mice whose antibody genes have been swapped for human ones. The first approvals came in 2002 and 2006.
  The names record this history… [keep]"
  Drop "polyclonal" from l.23 ("a mixture of many different antibodies"). Move the Nobel/Smith detail into the naming box or the glossary entry for phage display. Net saving ~80-100 words, and the reader reaches the first cancer mechanism ~100 words sooner.

**6. The ADC and engager sections read like drug-and-trial rosters, and brand names are applied unevenly against the PLAN rule.**
- Location: l.302-312 (T-DM1, T-DXd, DESTINY-Breast03, DESTINY-Breast04, sacituzumab, enfortumab, EV-302), l.418-422 (DeLLphi-304).
- Problems:
  - Trial codes (DESTINY-Breast03/04, EV-302, DeLLphi-304) carry no meaning for this reader and the quiz leans on one of them.
  - The "idea is spreading" paragraph (l.310) adds two more drugs, two more targets (TROP2, nectin-4) and two more cancers, plus unexplained "triple-negative", "hormone receptors" and "platinum chemotherapy".
  - Counting numbers: l.298-312 contains roughly a dozen survival or event figures.
  - PLAN says generic first, brand in parentheses on first mention. The draft gives brands for some (Kadcyla, Enhertu, Trodelvy, Blincyto, Kimmtrak) but not others (enfortumab vedotin/Padcev, tarlatamab/Imdelltra, teclistamab/Tecvayli, pembrolizumab/Keytruda). The inconsistency is itself noise, and patient families do meet brand names in the clinic.
- Fix:
  - Replace trial codes with "a head-to-head trial", "a trial in HER2-low breast cancer", "a trial in untreated bladder cancer", "a trial in small-cell lung cancer". Keep the citation numbers.
  - Cut the sacituzumab sentences (l.310 and the l.312 side-effect sentence), about 80 words; drop the source 19 or keep sacituzumab as a one-liner in the linker box. Rewrite l.310: "The idea is spreading. Enfortumab vedotin (Padcev) targets nectin-4 on bladder cancer cells. Combined with the checkpoint inhibitor pembrolizumab in untreated advanced bladder cancer, it was the first treatment to beat platinum chemotherapy on survival, nearly doubling median survival from 16.1 to 31.5 months.[^20]" (This keeps the useful Chapter 8 tie.)
  - Cap numbers per paragraph at ~3. In l.304 drop the "9.9 vs 5.1 months" progression figure and keep the survival figure.
  - Decide the brand policy once: either a brand name for every first mention (as PLAN requires), or only for the handful a patient is likely to hear (Herceptin, Keytruda, Avastin, Rituxan, Enhertu, Blincyto). I would recommend the second and amending PLAN accordingly.
  - Suggested "keep list" of drugs in the main text: trastuzumab, cetuximab, rituximab, bevacizumab, T-DM1 and T-DXd, enfortumab vedotin (with pembrolizumab), blinatumomab, teclistamab, tarlatamab, tebentafusp. Everything else goes to boxes.

**7. `ch09-naked` is four lessons in one figure (and carries 11 pieces of vocabulary the text never uses).**
- Location: l.196-276 (the `goal` itself lists four ideas: block, flag, starve, and the KRAS exception).
- Problems: three tabs, each with its own controls, a four-state matrix in Block (drug on/off x KRAS normal/mutant), three effector buttons plus a "Remove the stem" toggle in Flag, three 5-6 second animations, and the labels RAF, MEK and ERK that appear nowhere in the text. The padlock glyph on "KRAS stuck on" will read as "locked, therefore off" to many readers. The Starve tab is the least important idea (PLAN: "briefly") and has the most animation.
- Fix:
  - Make the KRAS 2x2 the hero. Keep it as its own figure placed right after the Block section: Drug on/off, KRAS normal/mutant, one lamp, and four captions. Drop the RAF/MEK/ERK beads (show a plain "relay" with only KRAS labeled), drop the "division signals: n" counter, and replace the padlock with a jammed-switch or "stuck" glyph.
  - Flag: reduce to one animation and one toggle, "Remove the stem". Let NK cell, complement and macrophage act together as three small effectors rather than three separate buttons (the three jobs are already a bullet list in the text).
  - Starve: make it a still diagram or leave it to text. Do not give it a tab.
  - If the single tabbed figure is kept for PLAN compliance, at least reduce Flag to the stem toggle and Starve to one toggle, and keep Block's four states.

**8. `ch09-bridge` has too many dials for one idea.**
- Location: l.448-523 (`goal` contains four ideas: any T cell works, MHC loss does not matter, TCR-based engagers need MHC and HLA, and dosing controls cytokine surge).
- Problems: five controls (engager, MHC loss, HLA type, dosing, restart) give ~24 combinations. A separate cytokine chart with an invented "danger zone" line adds a fourth idea and a made-up scale. Reading the field already requires holding "T cell", "CD3", "MHC cup", "peptide bead" and "bridge" at once.
- Fix: keep **Engager** (None / Antibody-based / TCR-based) and the **"Tumor hides its shop window"** toggle; this pair already delivers the chapter's central contrast (rare matching T cell vs any T cell; MHC loss kills the one and not the other). For the HLA lesson, show the "other HLA" state as a third caption variant under TCR-based rather than a fourth control. Remove the Dosing control and cytokine chart; the text already explains step-up dosing in two sentences and Chapter 10 owns the CRS curve. If the chart is kept, move it to the blinatumomab box. Add a footnote that the real ratio is about one matching T cell in 100,000 or more, since the figure shows one in 42.

---

## Should fix

**9. Trastuzumab is filed under "Block" with no mechanism, and the box then undermines the filing.**
- Location: l.162-164 vs box l.278-286.
- Problem: the Block section gives trastuzumab the lead role but only cetuximab gets a mechanism (growth factor docks, antibody blocks it). A reader wonders how an antibody "jams" HER2 when no signal molecule is named; the box tells us the clean taxonomy is "messier". A reader who skips boxes keeps a tidier story than the evidence supports.
- Fix: after l.164 add: "Trastuzumab likely does more than block: it also flags HER2-covered cells for immune attack (see the box below)." And in l.166 change "Its sibling cetuximab" to "A related antibody, cetuximab" ("sibling" reads like a drug family).

**10. The doorbell/chime analogy maps unclearly and never says where it breaks.**
- Location: l.168 "A triggered EGFR passes its message inward along a relay of proteins, like a doorbell wired to a chime… In those tumors the chime rings whatever happens at the doorbell."
- Problem: EGFR is the doorbell, the chime is the nucleus, and KRAS is "wiring", yet the text says KRAS is a relay "protein" and the mutation "jams it on". The reader must infer "short circuit". PLAN requires analogies to flag their limit; the figure footnote does ("real cells branch this signal into several pathways"), but the main text does not.
- Fix: "A triggered EGFR passes its message inward along a chain of proteins, like a doorbell wired to a chime. One of the first proteins in the wire is KRAS. In about 40% of colorectal cancers a mutation jams KRAS 'on', like a short circuit: the chime rings whatever happens at the doorbell. (Real cells have several such wires; this is the simplest picture.)"

**11. The subtitle and hook say an antibody "can do only one thing, which is stick", but the chapter's second job relies on the stem.**
- Location: l.4 subtitle; l.11 "Its only talent is *sticking*."; l.176 "the stem becomes a handle". Ch3 taught four jobs, three of which use the stem.
- Problem: a careful reader feels a contradiction between "only sticks" and "the stem recruits killer cells".
- Fix: after l.11 add: "(Even the stem's job is more sticking: it is a handle that immune cells grip.)" Or reword the subtitle to "An antibody's only real skill is sticking. Here is how…".

**12. Word collisions: the same word means two things within a few sentences.**
- Quotes and fixes:
  - "mouse tips on a human body" (figure step 2, l.129): "body" will be read as the patient's body, which appears two sentences later ("the patient's immune system"). Use "human frame" throughout the text and figure.
  - "scaffolding" is used for the antibody frame (l.35 "Everything else is scaffolding") and for the cell's skeleton (l.296 "the scaffolding the cell needs to divide"; figure step 5). Keep "frame" for antibodies and use "the cell's internal skeleton" or "division machinery" for the payload.
  - "stem" is the antibody handle (l.176-182), then "bone marrow stem cells" (l.184) in the same subsection. Write "the blood-forming cells in bone marrow" to avoid it.
  - "variable tips" (figure steps 1-2): never defined in the main text. Use "the mouse's whole arm tips".

**13. The T-DM1 vs T-DXd paragraph asks the reader to track three differences at once, and one is puzzling ("a linker that never breaks").**
- Location: l.300 "Two design choices matter enormously…", l.302.
- Problem: l.300 promises two choices (DAR and membrane-crossing); l.302 slips in a third (linker type) and the reader wonders how poison escapes a linker that never breaks. The earlier sentence "enzymes cut the linker or digest the antibody" (l.296) is the only hint.
- Fix: "Two details decide how an ADC behaves: how many payloads each antibody carries, and whether the freed payload can cross cell membranes." Then l.302: "Trastuzumab emtansine (T-DM1, Kadcyla), approved in 2013, carries about 3.5 payloads per antibody. Its linker never opens; the cell digests the whole antibody to free the poison, which then stays trapped in that cell. Trastuzumab deruxtecan (T-DXd, Enhertu) carries about 8 payloads on a linker that snaps open, and its payload slips through membranes." Drop "(DAR)" from l.300; the box can introduce it.

**14. Cull the other one-use terms (each costs a defined word the reader never needs again).**
- "angiogenesis" (l.192, never reused), "R-CHOP" (l.186, an unexplained abbreviation), "full FDA approval" (l.422: "full" versus what?), "polyclonal" (l.23), "CDRs" (l.35, see item 5), the acronym DAR (l.300).
- Fixes: "This sprouting is called angiogenesis" -> "which coaxes nearby blood vessels to sprout new branches toward them." Delete "The combination, R-CHOP, became the standard treatment worldwide" or say "That combination became the standard treatment worldwide." For tarlatamab: "The FDA approved it in 2024 on early data and gave full approval in November 2025" or simply delete the last sentence.

**15. The "two-factor authentication" hole in the engager story.**
- Location: l.408 "Bridged to a cancer cell, the T cell forms a tight contact and fires its killing machinery, just as it would after a true match."
- Problem: Chapter 4 taught that a T cell needs Signal 1 and Signal 2. A reader who took that to heart asks "where does the confirmation signal come from?" The text is silent.
- Fix: one sentence (author should verify wording): "A true match supplies two signals; CD3 supplies only the recognition signal, but T cells that have already met their enemy are far less picky about confirmation than fresh ones, and the cancer cell itself often provides some." If the authors prefer not to go there, one hedge sentence in the roster box is the minimum.

**16. Micro-gaps in the blinatumomab and tebentafusp passages.**
- l.418 "added to chemotherapy for adults already in remission, it raised three-year survival from 68% to 85%": a reader will ask what the drug does if the cancer is gone. Add "to clear any cells too few to detect".
- l.442 "displayed in one particular HLA molecule, {{hla|HLA-A*02:01}}": add "(HLA is the human name for MHC)".
- l.444 "a type common in people of European ancestry but far from universal": give a number if verifiable (roughly four in ten carry it; confirm), per PLAN "concrete numbers".
- l.446 "an eye cancer with few mutations": add "which is partly why checkpoint inhibitors do little here" to tie to Chapter 8.
- l.541 "pushing designers toward drugs that hit two targets at once": every bispecific already hits two targets. Say "two different tumor proteins at once".
- l.530 "(or get T cells killed)": cryptic. Say "…so that NK cells and macrophages do not attack the T cells the drug has latched onto".

**17. The chapter never says plainly that most of these gains are measured in months and most patients are not cured.**
- Location: l.164 (20 to 25 months), l.194 (15.6 to 20.3), l.418 (4.0 to 7.7), l.422 (8.3 to 13.6). PLAN: "Give response rates honestly (most patients still don't respond…)". The only direct statement is in the roster box (l.435 "most patients' cancers eventually progressed").
- Problem: a reader with a sick parent can read "extended survival from 4.0 to 7.7 months" as either "huge" or "tiny". The hook promises medicines that "kill cancer".
- Fix: add to the start of "The price of precision" or the closing: "Most of these gains are measured in months, not cures, though a minority of patients, especially with newer combinations, do far better. Doctors compare treatments by median survival and by the share of patients still alive and progression-free at one or three years." (And fix the first paragraph of the Price section, which crams four side-effect examples and five statistics into six sentences; split it into "right protein, wrong place" and "healthy counterparts".)

**18. Quiz: the right answer is always the longest, distractors are strawmen, and key ideas are untested.**
- Location: l.549-573.
- Problems:
  - In every question the correct option is the longest (Q4's is a three-part compound). Test-wise readers can answer without reading the chapter.
  - Q2 ("Why did early mouse-derived antibody drugs often lose their effect?") tests verbatim recall; two of its distractors ("too large to leave the bloodstream", "the drugs mutated") are not plausible.
  - Q3's distractor "A naked antibody that blocks MHC" is implausible; a better distractor is "A checkpoint inhibitor that releases the brakes on T cells" (tie to Chapter 8; explanation: it still needs T cells that recognize a peptide in MHC).
  - Q4 depends on the unstated HER2-low mechanism (item 4) and a trial name.
  - Nothing tests the stem/flag idea, the chapter's other major mechanism.
- Fix:
  - Replace Q2 with the concept the humanization figure teaches: "Humanization swaps most of a mouse antibody for human parts without weakening its grip on the target. Why can it do that? (a) The grip comes from a small region at each tip, and the rest is a frame (correct); (b) Human parts bind more tightly; (c) The drug is re-tested against each patient; (d) Mouse parts are never needed."
  - Add or swap in a flag question: "If you removed the stem from rituximab but changed nothing else, it would still stick to B cells. Why would it kill far fewer? Immune cells and complement grab the stem."
  - Rewrite Q4 without trial name: "Plain trastuzumab does not help HER2-low tumors, but trastuzumab deruxtecan does. Which best explains why? For an ADC, HER2 only has to be an address that lets the drug in; the tumor does not need to depend on it." Distractors: "T-DXd blocks HER2 signaling more strongly"; "HER2-low tumors secretly depend on HER2"; "T-DXd works without binding HER2".
  - Shuffle correct positions (Q1 and Q2 are both option 2) and trim correct options to the length of the others.

**19. `ch09-adc` and `ch09-humanization` are each two figures in one, and the ADC explorer shows invented efficacy numbers.**
- `ch09-adc` (l.314-388):
  - Problem: a six-step stepper plus a separate "Run on a tumor" explorer (drug x tumor type x run) plus a compare toggle on steps 4-6. The goal has two ideas (how an ADC works; why the bystander effect matters). Step 5's DNA vs microtubule contrast adds a third. The explorer's "x / 14 cells destroyed" tallies (T-DM1 HER2-low about 2/14, T-DXd about 9/14) are invented, and readers will quote them even beside a "schematic" caption.
  - Fix: run the stepper only with T-DXd for steps 1-5 (merge "Circulate" and "Bind" into one), then show the T-DM1 vs T-DXd comparison only at the last step. Drop the DNA vs microtubule contrast (move to the box). Cut the explorer, or at least remove the tally and keep a qualitative "who dies" picture with two tumor types (HER2-positive, patchy). In steps 5-6 the caption names "deruxtecan" as the drug's payload without ever having said that the name denotes the payload; add "(deruxtecan is T-DXd's payload)".
- `ch09-humanization` (l.45-133):
  - Problem: the one idea (the grip lives in six small loops) competes with 12 domain names (VH, CH1…) in tooltips, three meters, an NK-cell ambient animation, a zoom toggle, and a naming footnote.
  - Fix: keep the slider, the name chip and two meters ("Grips the target": always full; "Patient's immune reaction": lower at each stage). Drop the third meter and the NK-cell animation. Make the tip zoom a permanent inset (a magnifier showing six loops) instead of a toggle, and drop the domain-name tooltips (VH, CH1, CH2); a one-line "tip" and "stem" label suffices. A tiny footnote that year labels are "first approval of this kind, for any disease" will stop readers comparing "Chimeric 1994" with rituximab (chimeric) in 1997.

**20. Boxes: one is mis-placed, one holds main-text content, and one lists names no one needs.**
- **Clinic box** (l.400-402): it interrupts the ADC-to-engager transition, previews tebentafusp ("below"), repeats the RAS-testing fact that is already in the text (l.170), the figure caption and the takeaways, and introduces "HER2-ultralow" and "hormone-receptor-positive" for no payoff. Move it to the end of "The price of precision" (where "who gets this drug" fits) and trim to three one-line examples (HER2 score, RAS mutations, HLA type). Cut HER2-ultralow and the IHC scoring details.
- **Roster box** (l.435): "Engagers are moving from last resort toward the front of the line" is a main-narrative fact (the main text at l.420 leaves "last resort" as the final impression). Add one sentence after l.420: "Trials are now testing them earlier, and in one trial of patients who had had one to three previous treatments, a combination kept many more people free of progression than the standard one." Also add "(a cell therapy covered in Chapter 10)" after "CAR-T" in the glofitamab bullet.
- **Naming box** (l.149): "Among antibodies first approved in 2025, both in China, were becotatug vedotin… picankibart, a psoriasis drug. Late-stage candidates include sonesitatug vedotin…": three names the reader will never see again, one a psoriasis drug in a cancer chapter, and "vedotin" never explained. Replace with: "These names are now appearing on new approvals and in late-stage trials. Drugs named under the old rules keep their names, so trastuzumab is not changing." Saves ~40 words.

---

## Optional

- **Padlock glyph (ch09-naked, l.224):** padlocks mean "off/secure"; use a stuck switch or a jammed lever. Mentioned in item 7; repeated here so it is not lost.
- **"Magic bullet" consistency:** the Interlude says monoclonal antibodies were "Ehrlich's magic bullets made real" (interlude l.292); this chapter says the ADC is "the closest thing yet" (l.290). Soften one: "closest yet to a bullet that also carries a warhead."
- **Fact-check flags I could not verify as a reader:** l.537 "serious heart dysfunction struck 27%": I recall 27% being cardiac dysfunction of any grade in that trial, with the severe (class III-IV) figure lower (~16%); l.39 "the two shared the 2018 Nobel Prize in Chemistry" (Smith and Winter shared half; Arnold took the other half; "shared a 2018 Nobel Prize" is safer); l.298 "only around 0.1% of an injected dose".
- **Hype or editorializing:** "created a new treatment category almost overnight" (l.304), "the most elegant link back to Part I" (l.440), "landmark 2002 trial" (l.186). Consider "recognized a new treatment category", "a direct link back to Part I", and "a 2002 trial".
- **Rhythm:** the chapter is built from lists of three (three jobs, three bullet effectors, three bullet humanization stages, three engager consequences, three ADC parts). After a few, the reader feels a template. Turn the ADCC/complement/phagocytosis bullets (l.180-182) into a single sentence ("the same routes Chapter 3 described: NK cells (ADCC), complement and macrophages") to vary it and save ~30 words, since Chapter 3 already taught them.
- **Human anchor:** nothing in the chapter is a person. A two-sentence HER2 vignette (Slamon's 1987 finding, then the first patients on the drug) or a patient-family framing in the Clinic box would give a reader with a sick parent something to hold.
