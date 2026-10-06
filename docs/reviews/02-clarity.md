# Chapter 2 "The First Responders": reader-experience review

Reviewer: clarity / flow editor. Draft reviewed: `content/drafts/02-innate.md`. Measured main text (excluding figures, Go-deeper boxes, quiz, takeaways, glossary, sources, but including the two key-idea boxes and the clinic box): about 3,380 words, roughly 12% over the PLAN ceiling of 3,000.

## Overall impression

The chapter has a strong spine: a splinter, the question "how do you recognize an enemy you can't identify?", then a payoff that lands on cancer (nothing to detect, so no alarm; and missing-self as the one place the innate system catches a tumor). The opening hook, the Metchnikoff thorn-to-splinter callback, Kärre's "look for what is missing" turn, the honest "correlation, not proof" hedge, and the closing bridge to Chapter 3 all work and should be kept. Where I got lost or tired: (1) the chapter uses two metaphors for MHC class I (badge and shop window) and one of them contradicts the canon and Chapters 4 and 7; (2) the first figure uses words (cytokines, interferon, swallowing) the text hasn't taught yet; (3) the central NK "stop vs go" paragraph is logically muddled; (4) the middle stretch (phagocytosis, complement, antiviral alarm, about 730 words with no figure and three mini-catalogs) sags, and a few figures and boxes are heavier than they need to be. The main narrative is self-sufficient without the boxes; the boxes are correctly placed, and nothing essential is hidden in them.

**Keep as is:** opening three paragraphs; "Good inflammation is short, and it ends on purpose"; the complement-regulators sentence that foreshadows missing self; the "dirty little secret"/adjuvant paragraph and its link to cancer (the best paragraph in the chapter); "Tumors: wounds that do not heal"; the final paragraph.

---

## Must fix

**1. Two metaphors for one molecule: "ID badge" vs "shop window".**
Locations: NK section ("For now, think of MHC class I as an *ID badge* that healthy cells always wear... A cell that hides its badge..."); antiviral section ("the 'ID badges' called MHC class I"); Figure 3 labels and slider ("ID badges (MHC class I)"); key-idea box; quiz Q3 explanation; takeaway 4; glossary entry for `mhc-class-i` ("shop window, or ID badge").
Problem: PLAN §2 canon is **shop window**. Chapter 4 teaches only the shop window, and Chapter 7 (line 466 of its draft) already says "A cell with an empty shop window is exactly what NK cells look for ... (Chapter 2)". This chapter even needs a "where the analogy breaks" note for the badge because it is the weaker metaphor, then switches to "window" in the next sentence ("Killer T cells read *what* is in the window"). A reader holds two images at once.
Fix: use shop window everywhere; "ID badge" disappears.
- NK section: "Almost every cell with a nucleus displays MHC class I molecules on its surface. Think of them as the cell's **shop window**: it constantly shows fragments of the proteins the cell is making inside. (*Where the analogy breaks:* the window shows chopped-up fragments, not whole proteins; Chapter 4 explains how.) Killer T cells read *what* is in the window. NK cells notice when the window is *missing*."
- "A cell that hides its badge escapes T cells" becomes "A cell with an empty window escapes T cells, and looks suspicious to NK cells."
- Antiviral section: "...and they put more MHC class I on display (the cell's 'shop window', explained below), so killer T cells can inspect them later (Chapter 4)."
- Figure 3: slider "Shop-window displays (MHC class I) on the target"; draw the cups as "display slots in the shop window"; update key idea, Q3 and takeaway 4 to match.

**2. Figure 1 uses words the text hasn't taught: cytokines, interferon, and the cell "swallowing" things.**
Location: the paragraph just before `ch02-pattern-recognition`, and the figure's legend ("Inflammatory alarm (cytokines)", "Antiviral alarm (interferon)"). "Cytokine" is defined only in the next section; "interferon" three sections later; phagocytosis (the membrane wrapping and pinching a microbe into a "digestion bubble") four sections later. The goal also promises that readers see "a matching alarm (inflammatory or antiviral)", but the text has only ever mentioned "alarm signals".
Fix: replace the last paragraph of the section with: "When a pattern-recognition receptor grabs its target, it flips a molecular switch, and within minutes the cell starts reading the genes for alarm signals. There are two main kinds. {{cytokine|Cytokines}} call for help (more in the next section). {{interferon|Interferons}} warn neighboring cells of a virus (see 'The antiviral alarm'). The figure below shows both. Notice that the macrophage swallows the microbe into an internal bubble first; we'll look at that process shortly." Then drop the duplicate definition at "The alarm." in the next section, or keep it as a brief reminder.

**3. The NK "stop vs go" paragraph contradicts itself.**
Quote: "But NK cells also need a positive reason to attack, so they weigh two kinds of signals... Most cells carry a few activating molecules anyway, so losing badges usually tips the balance, and stress tips it further."
Problem: the previous paragraph says missing self is the trigger; this one opens with "But" and says a positive reason is also needed, then says losing the display "usually tips the balance". A reader cannot tell whether missing self alone is enough. This is the chapter's key mechanism and the reader's last chance to get it before the figure.
Fix: "An NK cell decides by adding up two kinds of signals. *Inhibitory* receptors detect MHC class I and say **stop**. *Activating* receptors detect {{stress-ligand|stress ligands}}, molecules that cells display when they are infected, damaged or turning cancerous, and say **go**. Healthy cells show plenty of 'stop' and only a faint, constant 'go', so they are spared. Take away the 'stop' and the 'go' wins. Add stress and it wins by more." (Also say once that the figure draws stress ligands as "flags".)

**4. The smoke-detector analogy's "where it breaks" undercuts itself.**
Quote: "*Where the analogy breaks:* a smoke detector reacts to anything smoky, whereas each pattern-recognition receptor fits its target molecule as snugly as any receptor in Chapter 1. What is generic is the target, not the receptor."
Problem: the analogy's point is "responds to a general sign, not the culprit"; the break note says receptors are precise. A reader is left unsure whether these receptors are vague or specific, and "reacts to anything smoky" sounds like a flaw to avoid, not a contrast.
Fix (keeps the analogy): "*An analogy:* a smoke detector doesn't know whether the toaster or the curtains caught fire, only that smoke means trouble. *Where it breaks:* smoke is a vague by-product of fire. A receptor is not vague: it is a precise lock for one specific molecule, fitting as snugly as any receptor in Chapter 1. What is broad is the target's reach, not the receptor's sensitivity: LPS looks much the same on thousands of bacterial species, so one lock covers them all." (A "uniform" analogy, recognizing a whole class by its uniform without knowing each member's name, fits "signature" better, if you want to swap.)

**5. The PAMP paragraph has two sentences that need rereading and one unexplained claim.**
Quotes: "Ignore the details, he suggested, and look for *signatures*: molecular features that are shared by whole classes of microbes, too essential to them to change easily, and absent from our own cells." And: "Many viruses make RNA with shapes and chemical ends that our own RNA rarely has."
Problems: "too essential to them to change easily" parses as "too essential [for them] to change", but it reads like a dangling modifier. "Ignore the details" is vague (details of what?). For viruses, a non-biologist will ask: RNA is RNA, so how can it be foreign? "Shapes and chemical ends" explains nothing.
Fix: "Stop trying to tell each species apart, he suggested, and look for *signatures* instead: molecular features that whole classes of microbes share, that are so essential to the microbe it can't easily change them, and that our own cells lack." and "Viruses often make RNA in forms our own cells rarely produce, such as long double strands." (Science reviewer to confirm wording; the figure readout "chemical ends" should be reworded the same way.)

**6. Quiz Q4, option B is factually muddled, and the stem is a "NOT" question.**
Quote: "Tell dendritic cells that the adaptive immune system should respond — this permission comes from innate sensing."
Problem: dendritic cells are themselves innate sensors that carry the message to T cells (the chapter's own bridge section). Option B as written suggests innate cells "tell" dendritic cells, which contradicts the text a careful reader just read. "Which can the innate system NOT do" also invites misreads.
Fix: replace Q4 with a cancer-linked, positively phrased question, which also tests the chapter's takeaway for this audience: "Q: Why does the innate system usually fail to sound the alarm about a growing tumor? - [ ] NK cells are unable to kill any cancer cell — NK cells can kill cancer cells in a dish and in mice; they just often struggle inside solid tumors. - [x] Tumor cells are built from the body's own molecules, so they rarely show microbial patterns or spill damage signals — no pattern, no alarm. - [ ] Innate receptors only work inside the bloodstream — they work in tissues, where most tumors grow."

**7. Why would a cancer cell lose MHC class I? The text asserts it, the reader will think "that's dumb".**
Quote: "Many cancers do the same, reducing or losing MHC class I as they evolve under pressure from T cells."
Problem: "evolve under pressure" is the entire logic, but the reader hasn't met immunoediting (Chapter 7) and may not connect natural selection to a tumor. This is the sentence that connects missing self to cancer, the chapter's payoff.
Fix: "Many cancers do the same. T cells kill the tumor cells whose windows show abnormal fragments, while cells that happen to have lost their windows survive and multiply. Over time the tumor fills up with hiders. (Chapter 7 returns to this.)"

---

## Should fix

**8. Figure `ch02-inflammation`: 9 steps is on the edge; autoplay is too fast; two captions are overloaded.**
This is the chapter's centerpiece and each step is one idea, so I would not cut steps. But: (a) group the dots into three labeled phases, "The alarm (1-2)", "The four signs (3-5)", "The reinforcements (6-9)", so readers see three chunks, not nine. (b) "Play all" at about 6 s per step is too short for 35-45 word captions (reading time about 10-12 s); use 2.5 s plus 0.35 s per word, or 10 s flat. (c) Step 2 packs four ideas, and step 4 carries a detail (slowed blood) that matters only later. Suggested captions:
- Step 2: "A resident macrophage detects the bacteria and sounds the alarm: cytokines call for help, chemokines lay a scent trail. A nearby mast cell empties its histamine."
- Step 3: "Cytokines and histamine widen the nearby blood vessels. More warm blood flows in from the body's core, so the skin turns red and hot."
- Step 4: "The cells lining the vessel loosen their grip on each other, and fluid leaks into the tissue. That leak is the swelling, and it carries defensive blood proteins to the site."
- Step 6: "Blood flow has slowed. Near the infection, the vessel lining puts out sticky molecules; passing neutrophils catch on them, let go and catch again, so they roll along the wall."

**9. Swelling paragraph: "notice where they are" and the unnamed "defensive proteins".**
Quote: "The blood left behind thickens and slows, which gives passing white blood cells time to notice where they are." and "the fluid carries defensive proteins from the blood".
"Notice where they are" is vague and personified; "defensive proteins" are never named, though complement is two sections away. Fix: "The blood left behind slows down, so passing white blood cells drift close to the vessel wall, where they can be caught. The leaked fluid also carries defensive proteins from the blood, such as complement (below), straight to the site."

**10. Fever / sepsis / CRS paragraph does three jobs in four sentences.**
Quote: "Not always, though. When alarm cytokines spill into the blood... This is sepsis. A similar cytokine storm can follow cancer treatments..."
"Cytokine storm" is never defined and the paragraph interrupts the inflammation arc just before the figure. Tighten to: "Not always, though. If alarm cytokines spill into the blood, they reach the brain and raise its thermostat: fever. If an infection spreads through the blood, the alarm sounds everywhere at once, vessels leak all over the body, blood pressure falls and organs can fail: {{sepsis|sepsis}}. Some immunotherapies can trigger a similar surge, called {{crs|cytokine release syndrome}} (Chapters 9 and 10)."

**11. Clinic box (COVID autoantibodies): number overload; the one-line takeaway is buried.**
Six numbers plus "95 of the 101 patients were men" in about 110 words, and "type I interferons" is a term the main text hasn't earned. Keep the story (it makes the system's importance vivid) but trim: "In 2020, a team led by Paul Bastard and Jean-Laurent Casanova asked why some people become critically ill with COVID-19 while most do not. About 1 in 10 of 987 patients with life-threatening COVID-19 pneumonia carried antibodies against their own interferons, which neutralized the antiviral alarm. None of 663 people with mild infections had them, and only 4 of 1,227 healthy people did.[^12] In these patients, the first responders' alarm had been silenced in advance by the body's own antibodies." (Drop "type I" and the sex ratio from the main text; the latter can go in a Go-deeper note.)

**12. Figure `ch02-macrophage-spectrum` is the busiest figure for the least payoff.**
It has a slider, seven output vignettes, two toggles, an unlabeled y-axis scatter and a self-moving slider thumb. Suggestions: (a) the thumb that "drifts back right after release" fights the reader's control, is a keyboard/screen-reader trap, and will read as a bug. Instead, "Place it in a tumor" should glide the slider to about 0.85 once and show a small "tumor signals push right" arrow; leave it draggable. (b) Cut vignette (g) "Clears debris quietly" (not needed here) to leave three per side. (c) Consider dropping "Show the real picture": the main text already says "a dial, not a switch", and an abstract scatter with an unlabeled axis is the figure's hardest moment for non-biologists; if kept, move it to a Go-deeper note.

**13. Figure `ch02-nk-missing-self`: the "Who can see this cell?" inset adds a third mini-model, and terms drift from the text.**
The slider/beam/verdict model is good and teaches the idea. The inset (two rows, three status strings, a 30% threshold) restates the key idea, and a first-time reader will not know the Killer T row is the point. Option: replace it with a single line under the verdict that changes only for the "dropped badges" preset ("A killer T cell would be blind to this cell. The NK cell is not."), which then doubles as the banner. Also reconcile vocabulary: the text says "stress ligands", the figure says "stress flags"; add "(drawn as flags in the figure)" in the main text.

**14. Repetition and jargon that don't earn their place (also the route back to about 3,000 words).**
Estimated cuts, about 300-350 words:
- Janeway's 1989 prediction appears three times (main text, box, bridge), and the "dirty little secret" is explained in both the box and the bridge. Keep the bridge version in the main text; remove "dirty little secret" from the box; drop "In 1997, Medzhitov and Janeway showed..." from the bridge (it is in the box).
- Walls paragraph: drop lysozyme and antimicrobial peptides (neither is used again; a glossary entry for one-use terms is clutter).
- Terms used once: "extravasation" (the roll/stick/squeeze description is enough; put the term in the box), "C3b", "interferon-alpha and interferon-beta" and "type I", "TLR4/TLR5" (the figure's name toggle carries them).
- Japanese NK cohort: cut "most of them over 40".
- Fever/sepsis paragraph (item 10), COVID box (item 11).

**15. Quiz Q1 and Q2 have weak distractors.**
Q1 option A ("exact species, remembered from a past infection") is ruled out by the stem ("never encountered before"). Replace with "Which species it is, using a dedicated receptor for each species — a body can't carry a receptor per species; innate sensors are limited in number and recognize broad patterns." Q2 option C ("Nerve endings pump extra fluid") is a straw man no reader would pick. Use the real confusion instead: "More blood flows in because the vessels widen — that is what makes the area red and warm; swelling is fluid leaking out of the vessels."

**16. Ordering: neutrophils "kill" before phagocytosis is explained; complement is named before it exists.**
"Neutrophils kill fast and die fast" (inflammation section) and "complement, which is there from the start" (opsonization paragraph). Add pointers: "...neutrophils ... eat bacteria (how, in the next section) ..." and "...and complement, a chain reaction in your blood (next section)". Also open "Eating the enemy" with a one-line signpost that returns to the chapter's thread: "Recognition raises the alarm. Now, what do the responders actually do to a microbe?" That helps the sagging middle.

**17. Bridge section: the chapter's most important idea is not emphasized, and "two-factor authentication" is dropped without a gloss.**
Quote: "Chapter 4 explains this *two-factor authentication* in detail." Add a clause so non-software readers get it: "...display 'confirmation' molecules that T cells require before they will respond, like a login that needs a code from your phone as well as a password." Consider a third key-idea box for "No danger signal, no response: the innate system decides whether the adaptive system acts at all, and cancer rarely raises the alarm." This is the book's hinge from innate to adaptive and to cancer.

**18. Style: hype, a dangling metaphor, an overclaim.**
- "one of the most elegant ideas in biology" and "It's a beautiful division of labor": PLAN says no hype; use "a simple idea with large consequences" and "an efficient division of labor".
- "the window is exactly what a sick cell is tempted to hide": cells don't have intent; "is exactly what viruses and tumors gain by hiding".
- "The trap is leaky, though": which trap? The metaphor was never set up. Use "That double bind has holes, though".
- "like night watchmen who sleep in the building": "who live in the building".
- "That is why a bruise becomes inflamed": overclaims; use "That is why a sprained ankle swells even with no microbe in sight".

---

## Optional

- **Celsus aside:** *tumor* (Latin for swelling) is the same word as the cancer term; one clause ("yes, the same word") is a hook and heads off confusion.
- **Figure 1 simplification:** the yeast card and Dectin-1 add a seventh/eighth sensor and fifth suspect that never return in the story. Cutting them leaves bacterium, virus, damage, healthy, cancer. Also consider dropping the 2-3 antiviral rings for the bacterium (a first-time reader will ask why a bacterium triggers an *antiviral* alarm). The final cancer readout switches actor from macrophage to "dendritic cells"; say "a nearby dendritic cell" or relabel the figure's cell "sentinel cell".
- **Undefined small terms:** "microbe" (never defined; add "bacteria, viruses and fungi" at first use), "lymphoma" (Kärre paragraph; "a cancer of lymphocytes"), "granules".
- **Apoptosis numbers:** "Vast numbers of the body's cells die every day" could carry a magnitude ("tens of billions"; science reviewer to confirm and cite).
- **Takeaways:** bullet 1 is three lines; split or cut to "Innate immunity acts in minutes, using inherited sensors that detect broad molecular signatures of microbes (PAMPs) and of damaged cells (DAMPs)."

---

*Counts: Must fix 7, Should fix 11, Optional 5 bullets (23 items). Revised main-text target after item 14 and items 9-11: about 3,000-3,100 words, which also brings the stated 24-minute reading time to about 22.*
