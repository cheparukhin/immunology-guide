---
id: 05-t-cells
title: T Cells: Selection, Killing and Regulation
subtitle: How the body builds T cells that can recognize almost anything, and keeps them from attacking its own tissues.
part: I
reading_time: 29
hero: ch05-hero
---

Behind the breastbone, just in front of the heart, sits the {{thymus|thymus}}. For centuries its purpose was unknown: it was crowded with small white blood cells, many of them dying, and it shrank with age, so some suspected it was little more than a graveyard.

In 1961, a young researcher named Jacques Miller removed the thymus from newborn mice[^1]. They grew up with few white blood cells, wasted away, caught infections easily and even accepted skin grafted from other strains, which healthy mice reject. Without a thymus, they had lost much of the ability to recognize and reject what was foreign.

The thymus, it turned out, is where {{t-cell|T cells}} develop (the T stands for thymus), and the mass death inside it is part of how it works. The question behind this chapter is **how the body can build T cells that recognize almost anything, yet keep them from attacking its own tissues.**

## Positive and negative selection

Each T cell carries a {{tcr|T-cell receptor}} of a single specificity, assembled by randomly shuffling gene segments ([Chapter 3](03-adaptive.html)). The randomness prepares the body for threats it has never met, but it also produces useless and dangerous receptors.

The thymus removes both. Its developing T cells, called {{thymocyte|thymocytes}}, descend from precursors that arrive from the {{bone-marrow|bone marrow}}. Each builds its receptor in the thymus and is then tested twice.

**The first test: positive selection.** T cells recognize short protein fragments, {{peptide|peptides}}, held by {{mhc|MHC molecules}} ([Chapter 4](04-presentation.html)). In the thymus's outer layer, the cortex, thymocytes contact the organ's supporting cells, called thymic epithelial cells, which display MHC loaded with the body's own peptides (self-peptides).

A receptor that binds these self-peptide–MHC complexes weakly gives its cell a survival signal; this is {{positive-selection|positive selection}}. A receptor that binds none of them gives no signal, and within a few days the cell dies by {{apoptosis|apoptosis}}, the orderly, programmed cell death described in Chapter 2. This death by neglect is the most common fate in the thymus.

Weak binding is the right result. A receptor that binds a harmless self-peptide–MHC complex with low {{affinity|affinity}}, a loose but real fit, has shown that it works with the display system. When a foreign peptide later sits in the same kind of MHC molecule, the receptor can bind that complex with high enough affinity to count as a match. The thymus selects for the middle of the affinity range, between no binding and strong binding to self.

Positive selection also sets each cell's type. A receptor that binds {{mhc-class-i|MHC class I}}, the shop window, commits its cell to becoming a {{cd8-t-cell|CD8 killer T cell}}. One that binds {{mhc-class-ii|MHC class II}}, which displays fragments of what a cell has taken up from outside, makes a {{cd4-t-cell|CD4 helper T cell}}.

**The second test: negative selection.** A thymocyte whose receptor binds a self-peptide–MHC complex with high affinity could attack the body's own tissue, and the strong signal triggers its apoptosis. This removal, {{negative-selection|negative selection}} (also called clonal deletion), happens first in the cortex, against proteins every cell makes, and again in the thymus's core, the medulla.

## AIRE and proteins from other organs

Many proteins are made in only one place, such as insulin in the pancreas or light-sensing proteins in the eye. T cells are tested against these too, because of a protein called {{aire|AIRE}} (autoimmune regulator). In specialized epithelial cells of the medulla, AIRE activates genes that are otherwise expressed only in other organs, so these cells display fragments of insulin and many other organ-specific proteins[^2]. Together, the thymic epithelial cells of mice express about 19,000 protein-coding genes, the large majority of the mouse's total; AIRE alone accounts for about one in five[^3].

Each cell displays only a small, random selection at a time, but thymocytes spend days moving from cell to cell, so together the displays cover proteins from across the body.

Without working AIRE, whole organs go untested: mice lacking it develop autoimmune attacks on tissues such as the eye and stomach, and people born with faulty AIRE develop autoimmunity against several organs at once[^2].

:::figure ch05-thymus
title: Selection in the thymus
goal: After using this, the reader understands that each new T cell's receptor is random; that the thymus keeps only receptors that grip the body's MHC weakly (no grip means death by neglect, a strong grip on self means deletion); that only a few percent pass; and that AIRE extends the safety test to proteins from organs all over the body.
kind: simulation
stage: dark
spec: |
  CONCEPT. One idea, revealed in stages: a three-zone "grip dial" decides every thymocyte's fate. Steps 1–4 show one candidate at a time in the cortex. Step 5 opens the medulla and introduces AIRE. Step 6 runs 1,000 candidates and offers the AIRE switch. Keep the stage uncluttered: elements appear only when their step needs them (progressive disclosure). Stage tag (top right, t-caps): "Illustrative"; it stays visible in every state, including the AIRE-off run.

  LAYOUT (desktop, landscape ~16:9).
  - Left edge: entry arrow labeled "Precursors from bone marrow (receptors are built here, in the thymus)".
  - Left ~45%: CORTEX zone. Label: "Cortex" with subtitle "Exam 1: can it read MHC? (plus a first round of Exam 2)". Contains 3 large cortical supporting cells: pale sand (#E9C9A1 at ~60% opacity), branching and net-like, each roughly 6x the diameter of a thymocyte, with MHC cups (pale silver #D9DEEA) holding sand-colored self-peptide beads. No class I/II tags.
  - Right ~40%: MEDULLA zone, dimmed and unlabeled until step 5. Then label "Medulla" with subtitle "Exam 2: organ proteins, thanks to AIRE". Contains 3 medullary cells (sand, more compact; each nucleus has a soft glow labeled "AIRE") and 1 dendritic cell (green #4FD18B, star-shaped). From step 5, each medullary cell displays 1–2 small organ icons standing for organ-specific proteins currently on show: pancreas (insulin), eye (retina), stomach, salivary gland. Every ~4 s one icon on one random cell fades out and another fades in: each cell shows only a random few at a time.
  - Right edge: exit arrow labeled "To blood".
  - Bottom strip (from step 6 only): a 10 x 10 unit chart titled "Fate of every 100 thymocytes", subtitle "Illustrative proportions based on mouse studies", and exactly three counters with icons (never color alone): "Died of neglect" (gray, hollow-circle icon), "Deleted" (crimson #E5484D, ✕ icon), "Graduated" (green-cyan #3DDC97, ✓ icon). Use the shared `unitGrid` component.

  THYMOCYTE ART. A small round T-cell silhouette, neutral pale blue-gray, with no CD4/CD8 badges. At step 1 it appears at the entry and its receptor (a small notched key glyph; reuse Chapter 3's "search query" glyph if available) assembles with a brief shuffle animation, to show the receptor is built in the thymus. On passing Exam 1, the cell simply recolors, with a short caption chip: "Fits MHC class I → CD8 killer" (electric blue #4C8DFF) or "Fits MHC class II → CD4 helper" (teal #2EC4C9).

  THE GRIP DIAL. When a thymocyte docks on a cell, one horizontal meter appears above it (large, in-SVG), with exactly three labeled zones, left to right: "No grip → neglect" | "Weak grip ✓ sweet spot" | "Strong grip on self ✕". Labels and icons, not color alone. A needle sweeps to the candidate's hidden self-binding strength. The same dial is used in the medulla.

  FATES (slow, calm; nothing flashes):
  - Neglect: needle in "No grip". The cell dims over ~2 s and shrinks into 3–4 small fragments; a coral macrophage (#FF7A6B) glides in and absorbs them. Chip: "No signal → death by neglect".
  - Deleted: needle in "Strong grip on self". The cell contracts, a crimson ✕ appears (the shared outcome icon for "fails"; not the brake "−"), it fragments; the macrophage clears it. Chip: "Too self-reactive → deleted". Deletion happens in both zones.
  - Passes: needle in "Weak grip". The cell recolors (CD8 or CD4), moves into the medulla, visits 1–2 cells there with a new dial reading each time, and exits to blood if it never grips hard.

  CONTROLS (HTML controls below the stage, styled by the foundation).
  - Steps 1–5: a stepper with Prev/Next and "Replay". Each step's candidate auto-plays its journey.
  - Step 6 reveals: "Run the thymus" (releases 1,000 candidates; render the stream as small dots on canvas, with at most 20 individually animated cells in the foreground), Pause, and the switch "AIRE: on / off" (default on). No speed control.
  - Run probabilities: graduate 3%; deleted 18% (three-quarters of deletions in the cortex, one-quarter in the medulla); neglect the remainder (~79%). The unit chart fills proportionally and the counters show running counts (not percentages). End overlay, placing the measured figure beside the demo: "About 3 in 100 survive — close to the mouse estimate."
  - AIRE switch: about 2% of all candidates (~20 per run) are organ-reactive: they pass Exam 1 but carry a hidden organ target (eye, stomach or salivary gland), revealed as a tiny organ icon only when they exit or are deleted. With AIRE ON, such a candidate is deleted in the medulla when it meets a cell showing its organ (~90% of the time, not 100%: tolerance is imperfect). With AIRE OFF, medullary cells lose most organ icons (keep about a third, drawn fainter, because AIRE is not the only gene switch), the nucleus glow turns off and its label reads "AIRE off". Most organ-reactive candidates now pass. A small body silhouette (shared `bodyMap` art) appears beside the exit and outlines the matching organs in crimson with a "!" icon; label: "Self-reactive T cells escaped".

  SCIENTIFIC GUARDRAILS (please keep):
  - Precursors arrive from the bone marrow WITHOUT a receptor; the receptor is built inside the thymus.
  - The exam selects; it does not teach. Never show a receptor being reshaped by an encounter. (We omit that a cell failing Exam 1 can sometimes reshuffle one chain of its receptor and try again.)
  - Thymocytes are not attacked by other cells. They die by their own apoptosis program: neglect is the ABSENCE of a survival signal; deletion is a STRONG signal that triggers death. Macrophages only clean up.
  - Do not show regulatory T cells or FOXP3 in this figure. (Some strongly self-reactive CD4 cells become Tregs instead of being deleted; this is covered later in the text. In the run they are simply counted as graduates.)
  - Proportions are illustrative, assembled from two mouse studies (about 3% of thymocytes mature; about six deleted per one that graduates; most deletion happens in the cortex). Keep the "Illustrative" tag and subtitle.
  MOBILE (<600px): stack vertically: cortex (top), medulla (middle), exit (bottom); the unit chart goes full-width below the stage. Dial labels ≥14px. Large Prev/Next buttons. Reduce the run to 400 candidates (same percentages).
  REDUCED MOTION: each step shows its end state with the dial reading and fate label; "Run the thymus" jumps straight to the filled unit chart and final counters; the AIRE switch swaps states without animation.
steps:
  1. A thymocyte has just built its random T-cell receptor in the thymus. The receptor may be useful, useless or dangerous; two tests decide which.
  2. Positive selection, in the cortex. This receptor can't bind the body's own peptide–MHC complexes at all, so the cell gets no survival signal and dies by apoptosis within days: death by neglect, the most common fate.
  3. This receptor binds a self-peptide on MHC class I weakly, the sweet spot. The cell passes positive selection and commits to becoming a CD8 killer T cell.
  4. Negative selection. This receptor binds a common self-peptide with high affinity, and the strong signal triggers the cell's apoptosis. Most deletions happen here, in the cortex.
  5. Negative selection continues in the medulla, where AIRE makes epithelial cells display proteins from other organs, such as insulin. This CD4 cell binds an insulin peptide strongly and is deleted.
  6. Run a thousand candidates: only about 3 in 100 survive. Then switch AIRE off to see which organ-reactive cells get through.
alt: An animation of T-cell selection in the thymus. Each developing T cell builds a random receptor and is tested on a three-zone dial of binding strength: no binding to the body's MHC means death by neglect, strong binding to self means deletion, and weak binding means survival as a CD4 or CD8 T cell. In the medulla, AIRE makes cells display proteins from other organs, so T cells that react to them are deleted. About 3 in 100 candidates survive; with AIRE off, organ-reactive T cells escape.
:::

In a classic mouse study, mature T cells left the thymus at only about 3 percent of the rate at which new thymocytes were being made[^4]; roughly 97 percent die inside. Most die of neglect, but a later count found about six thymocytes deleted for every one that survives[^5]. The thymus only keeps or discards cells; it never improves a receptor.

:::key-idea
A new T cell survives the thymus only if its receptor binds the body's own peptide–MHC complexes weakly. No binding means death by neglect (failed positive selection); strong binding to self means deletion (negative selection). Only a few percent pass.
:::

:::deep-dive Counting deaths in the thymus
Death in the thymus is hard to measure, because macrophages clear dying thymocytes so efficiently that few remain to be counted.

In 1990, Egerton, Scollay and Shortman labeled dividing thymocytes in mice with a radioactive tracer and followed them as they matured. They compared how fast mature T cells appeared with how fast "double-positive" thymocytes (immature cells still carrying both CD4 and CD8) were made. The result, about 3 percent, matched the rate at which new T cells leave the thymus[^4].

In 2013, Kristin Hogquist's group bred mice lacking Bim, a protein that thymocytes need in order to undergo apoptosis after a strong signal, and added a fluorescent reporter that glows after strong receptor signaling, so that cells that would have been deleted survived and could be counted. About six cells were marked for deletion for every one that completed positive selection, and roughly three-quarters of deletions happened early, in the cortex[^5]. More thymocytes reacted strongly to MHC than weakly, which the authors argued is inconsistent with purely random recognition: T-cell receptors seem inherently biased toward MHC.

A randomly built receptor could just as well bind a whole protein drifting past, as an antibody does. Requiring MHC recognition focuses the entire T-cell population on MHC displays, and so on information antibodies never get: fragments of what is going on inside cells. The receptors' built-in bias is not enough; the thymus enforces the focus. In mice lacking both MHC and the CD4 and CD8 {{co-receptor|co-receptors}} (which bind MHC alongside the receptor), the thymus produced T cells that recognized their targets with no MHC involved, one of them an ordinary surface protein[^25][^26]. Normally, CD4 and CD8 carry the enzyme that launches the receptor's signal and bring it to the receptor only when they too bind MHC, so only MHC-focused receptors pass. A CAR ([Chapter 10](10-cell-therapy.html)) is, in effect, the kind of receptor positive selection would have screened out.

A thymocyte that fails positive selection can sometimes reshuffle one chain of its receptor and try again, which is a fresh random draw, not learning. AIRE, for its part, is only the best-understood of several gene regulators that let thymic epithelial cells display organ proteins; collectively, mouse thymic epithelial cells express more genes than any other cell type known[^3].

These numbers come from mice. Human thymic selection follows the same rules, but its proportions are much harder to measure. The human thymus is most active early in life and shrinks with age, though it keeps producing some new T cells in adults.
:::

## Tolerance outside the thymus

{{tolerance|Tolerance}} is the immune system's restraint toward the body's own molecules. The part established in the thymus, mainly by negative selection, is called central tolerance, and it is incomplete. In one study of healthy people's blood, T cells recognizing a protein made only by male cells (self for men, foreign for women) were only about three times rarer in men than in women[^6]. Deletion prunes self-reactive T cells without eliminating them; eliminating them all, the authors argue, would leave gaps that microbes could exploit[^6].

The body has further safeguards outside the thymus, together called peripheral tolerance, and they work in layers. The first is *ignorance*: many self-reactive T cells never meet their target. Naive T cells keep mostly to the blood, lymph and lymph nodes ([Chapter 4](04-presentation.html)), and a protein made only in, say, the pancreas reaches a node in tiny amounts, if at all, and without an alarm.

Ignorance can be broken. In mice engineered to make a viral protein in their insulin-making cells, T cells against that protein ignored the cells until infection with the virus activated them; they then destroyed the cells, and the mice became diabetic[^27].

The second layer is {{anergy|anergy}}, the lasting unresponsive state described in [Chapter 4](04-presentation.html): a T cell that recognizes its target without {{costimulation|costimulation}}, the confirming signal 2, stays alive but stops responding. The male-protein-specific T cells in men were largely anergic[^6].

The third layer is {{regulatory-t-cell|regulatory T cells}}, or Tregs: a small minority of CD4 T cells that suppress immune responses rather than drive them. Some come straight from the thymus, where a few CD4 cells whose affinity for self is high, but not quite high enough for deletion, are spared and take on this role[^5][^7]. Their identity is set by {{foxp3|FOXP3}}, a {{transcription-factor|transcription factor}}: a protein that binds DNA and controls which genes a cell expresses. Because of FOXP3, a Treg recognizing its self-target suppresses the response instead of joining the attack[^7].

Tregs work in three ways. They consume {{il-2|IL-2}}, a growth signal other T cells need; they secrete suppressive {{cytokine|cytokines}}, the signaling proteins immune cells use to instruct each other; and they use {{ctla-4|CTLA-4}}, one of the brakes described below, to make {{dendritic-cell|dendritic cells}} less able to activate other T cells[^8][^9]. Tumors recruit Tregs too ([Chapter 7](07-escape.html)).

Tregs are especially active in the gut, where a single layer of cells separates the body from tens of trillions of bacteria and some bacteria always get across. There, local signals such as {{tgf-beta|TGF-β}}, and in mice butyrate, a fatty acid that gut bacteria make from fiber, induce newly activated helper T cells to differentiate into Tregs[^28]. Chapters 8 and 12 return to this balance.

A mouse strain showed what happens without Tregs. In the late 1940s, a colony at Oak Ridge, Tennessee, produced scaly, stunted "scurfy" males that die 16 to 25 days after birth, their organs infiltrated by T cells. In 2001, Mary Brunkow, Fred Ramsdell and colleagues traced the cause to a broken gene they named Foxp3[^10].

Boys born with a faulty human FOXP3 gene develop the corresponding rare disease, IPEX, with severe {{autoimmunity|autoimmunity}} in infancy. Brunkow and Ramsdell shared the 2025 Nobel Prize in Physiology or Medicine with Shimon Sakaguchi, who had identified regulatory T cells in 1995 and later showed that FOXP3 controls them, for discoveries about peripheral immune tolerance[^7].

The last layer is built into every T cell: inhibitory receptors called {{checkpoint|immune checkpoints}}, or brakes, covered later in this chapter.

:::key-idea
Self-tolerance is defense in depth: central tolerance in the thymus removes the most dangerous T cells; peripheral tolerance (ignorance, anergy, Tregs and the brakes) catches most of the rest. No layer is perfect, but together they usually hold.
:::

## The kill

A CD8 T cell that leaves the thymus, is primed in a {{lymph-node|lymph node}} by a dendritic cell displaying its peptide ([Chapter 4](04-presentation.html)) and multiplies into thousands of copies becomes an {{effector-t-cell|effector T cell}} that patrols the tissues, checking the shop window of each cell it touches.

Unlike its first activation, a kill needs no costimulation from the target, only recognition, and very little of that: in lab experiments, as few as three matching peptides among many thousands of molecules on display triggered a kill[^11].

The T cell flattens against its target and surrounds the contact with a ring of {{adhesion-molecule|adhesion molecules}}, sealing off a narrow cleft. This organized contact zone is the {{immunological-synapse|immunological synapse}}, and the seal ensures that whatever the T cell releases reaches only this one cell. The T cell's centrosome, the hub of its internal protein filaments, then moves to face the target. It brings along the cytotoxic granules, vesicles packed with toxic proteins, which fuse with the T cell's membrane and empty into the cleft.

Two of those proteins do the damage. {{perforin|Perforin}} binds the target's membrane, assembles into rings and forms pores through it, and {{granzyme|granzymes}}, a family of proteases (enzymes that cleave other proteins), pass through the pores. Filmed under a microscope, human killer cells made their targets' membranes leaky in as little as 30 seconds. The targets repaired the pores within about 80 seconds, but by then enough granzymes were inside, and the targets began rounding up within two minutes of the pores opening[^12].

Granzymes mostly do not destroy the cell directly; they activate its own apoptosis program, the same programmed death that failed thymocytes undergo. The target cleaves its DNA into fragments, dismantles its internal structures, including any virus it is producing, and packages itself into membrane-wrapped fragments that {{macrophage|macrophages}} engulf without triggering inflammation. Bursting would spill virus and debris; apoptosis usually does not.

Killer T cells have a second route: a surface protein called {{fas|Fas ligand}}, which binds a "death receptor" called Fas on the target and triggers the same apoptosis program.

The T cell then detaches, unharmed, and moves on. In virus-infected mice, single killer T cells eliminated roughly 2 to 16 infected cells per day, slower than in a dish and often in brief contacts while moving, and cells hit by more than two T cells were more likely to die, which suggests that damage adds up across hits from different cells[^13]. When a virus made its host cells hide their MHC class I, the T cells failed[^13]; {{tumor|tumors}} use the same trick ([Chapter 7](07-escape.html)).

Killer T cells also secrete {{ifn-gamma|interferon-gamma}} (IFN-γ) and {{tnf|tumor necrosis factor}} (TNF), an inflammatory cytokine that can kill some tumor cells directly. IFN-γ diffuses into the surrounding tissue, where it makes nearby cells display more MHC, activates macrophages to kill the microbes they engulf ([Chapter 2](02-innate.html)) and slows the growth of some tumor cells. It also triggers one of the brakes, described below.

:::figure ch05-kill
title: How a killer T cell kills
goal: After stepping through, the reader understands that a killer T cell kills by direct contact (recognize, seal and aim, perforate, deliver granzymes), that the target dies by its own tidy self-destruct program, and that the T cell survives and moves on.
kind: stepper
stage: dark
spec: |
  CAST AND SCALE. The main view is a patch of tissue roughly 60 x 35 micrometers.
  - Killer T cell (CD8): electric blue #4C8DFF, round, ~8 µm, fine microvilli fuzz, TCR glyphs on its surface. Starts on the left.
  - Target, on the right, ~1.6–2x the T cell's diameter. One segmented toggle switches its identity: "Virus-infected cell" (healthy sand #E9C9A1 body with a few small red-coral #FF4D5E virus particles inside) or "Cancer cell" (violet-magenta #B65FD8, lumpy outline, large irregular nucleus). The steps are identical in both modes; only the target's look and the peptide label change ("viral peptide" vs "mutant peptide"). This is the only extra control.
  - 2–3 bystander tissue cells (sand) in the background.
  - Every target and bystander shows MHC class I cups (pale silver #D9DEEA). Bystanders hold only sand self-peptides; the target holds a few hot-pink #FF3D7F peptides among many sand ones.

  INSET LENS. For the molecular steps (2, 4, 5) a circular magnifier (~35% of stage width, top-center, with a thin leader line to the contact point) shows the synapse at molecular scale: the TCR bound to a pink peptide in MHC class I; a CD8 glyph steadying the side of the MHC (label "CD8: a second grip"); an outer ring of adhesion molecules ("adhesion ring"); granules (dark-blue vesicles containing tiny perforin rods and small granzyme dots marked with a scissors icon); perforin in three beats: single perforin molecules latch onto the target's membrane surface, gather there into a ring (top view: a ring of ~20–24 small staves), then the ring plunges through the membrane to open a pore (side view: a hole through the membrane). Lens scale label "nanometers"; main view "micrometers". Never draw perforin as darts or bullets: it is released into the narrow cleft and assembles itself on the target's membrane.

  STAGE TAG. "Not to scale" (top right, t-caps).

  CLOCK. The shared time HUD (top left), labeled "time since pores opened", appears only on steps 4–6: step 4 "0 s" with a small note "pores open ~30 s after the T cell's calcium signal"; step 5 "≤ 80 s: pores repaired"; step 6 "≤ 2 min: target rounds up". The later break-up into fragments takes longer: when the fragments appear, the clock changes to "later". (Source for the builder: Lopez et al. 2013, human killer lymphocytes in culture; each timing has its own reference point, hence "since pores opened".)

  CONTROLS. Prev / Next; Play all (auto-advance ~6 s per step); Replay step; the target-type toggle. No counter, no extra switches.

  STATES PER STEP (main view):
  1. Patrol. The T cell crawls along the bystanders, briefly touching each (tiny gray "no match" ticks), then reaches the target.
  2. Match. The lens opens on TCR + pink peptide–MHC class I + CD8. Three matched complexes light up among many sand ones; label "A handful of matches is enough".
  3. Seal and aim. The T cell flattens against the target; an adhesion ring forms (bull's-eye: outer ring, inner zone); label "sealed pocket". Then, inside the T cell, the centrosome (a small star of microtubule lines) swings to the contact face and 6–10 granules slide along the lines to cluster there.
  4. Fire. Granules fuse with the T-cell membrane at the center of the synapse, releasing perforin and granzymes into the cleft; perforin pores appear in the target membrane (lens). Clock "0 s".
  5. Enter and race. Granzymes slip through the pores. The target patches the pores one by one, but granzymes are already inside. Clock "≤ 80 s".
  6. Self-destruct. Inside the target, granzymes switch on its own executioner enzymes (a calm chain reaction of small sparks, not an explosion). The target rounds up (clock "≤ 2 min"), its surface blebs, its nucleus condenses and fragments; virus particles (virus mode) are dismantled with the cell's machinery. It ends as several neat membrane-wrapped fragments (clock "later"); a coral macrophage (#FF7A6B) drifts in and engulfs them. No contents spill.
  7. Release and repeat. The T cell detaches, intact, and crawls toward a second pink-peptide target entering from the right. Chip: "In living mice: roughly 2–16 kills per T cell per day, often in brief, moving contacts; tough targets often need several T cells" (Halle et al. 2016).
  8. Ripples. The T cell releases IFN-γ (hollow rings in its blue, the shared interferon glyph) that diffuse outward. Bystanders respond: their MHC class I cups multiply (brighter shop windows), and after a short delay PD-L1 molecules appear on their surfaces (library `pdl1`: light-crimson stalks with a plug head; no icon, since nothing is engaged yet). Label: "IFN-γ: brighter windows… and a brake". This hands off to the brakes figure.

  ACCURACY GUARDRAILS: the T cell is not harmed and does not engulf the target; perforin makes pores, it does not blow the cell apart; the death is the target's own apoptosis program; granzymes are delivered into the target through the synapse, while IFN-γ diffuses widely. No flashes, no gore, no war imagery.
  MOBILE (<600px): portrait viewBox with the T cell above and the target below. For molecular steps the lens REPLACES the main view (cross-fade) instead of overlaying it, with a small "back to cells" thumbnail. Captions below the stage.
  REDUCED MOTION: show each step's end state; no crawling, particle drift or spark animation.
steps:
  1. A killer T cell crawls through the tissue, checking the peptides on each cell's MHC class I. Almost all are ordinary self-peptides, so it moves on.
  2. The T-cell receptor binds a foreign or mutant peptide in MHC class I, and CD8, the co-receptor, binds the side of the same MHC molecule and stabilizes the contact. A handful of matching peptides is enough.
  3. The T cell surrounds the contact with a ring of adhesion molecules, sealing a narrow cleft, the immunological synapse. It then moves its cytotoxic granules up to the synapse.
  4. The granules fuse with the T cell's membrane and release their contents into the cleft. Perforin binds the target's membrane, assembles into rings and forms pores.
  5. Granzymes, proteases that cleave the target's proteins, pass through the pores. The target repairs the pores within about 80 seconds, but by then enough granzymes are inside.
  6. Granzymes activate the target's own apoptosis program. It rounds up within minutes, then breaks into membrane-wrapped fragments that macrophages clear without inflammation.
  7. The T cell detaches, unharmed, and moves on to its next target. In living tissue, killing is slower than in a dish and often takes several T cells.
  8. The T cell also secretes interferon-gamma. Neighboring cells display more MHC and soon also PD-L1, the ligand of a brake receptor on T cells.
alt: A step-by-step animation of a killer T cell destroying an infected or cancerous cell. The T cell recognizes a foreign peptide on the target's MHC class I, seals a tight contact called the immunological synapse and moves its cytotoxic granules to it. Perforin forms pores and granzymes enter, activating the target's own apoptosis program; the target breaks into fragments that a macrophage engulfs, and the unharmed T cell moves on. Its interferon-gamma makes neighboring cells display more MHC and PD-L1, the ligand of a brake receptor.
:::

:::key-idea
A killer T cell kills by contact: it forms an immunological synapse with its target and delivers perforin and granzymes, which trigger the target's apoptosis. The T cell survives and moves on to the next.
:::

:::deep-dive Inside the lethal hit
Seen face-on, a mature immunological synapse looks like a bull's-eye. T-cell receptors bound to peptide–MHC cluster in the center, surrounded by a ring of adhesion molecules (the {{integrin|integrin}} LFA-1 on the T cell binding ICAM-1 on the target). The granules are modified {{lysosome|lysosomes}}, the digestive compartments described in Chapter 2, and the centrosome moves up against the synapse to deliver them along its microtubules, the filaments that radiate from it.

A perfect bull's-eye isn't required. Using single-molecule labeling, Purbhoo and colleagues found that killer T cells could detect even a single foreign peptide–MHC, needed about ten to form a mature synapse with a full calcium signal, but only about three to kill[^11].

Perforin is released as single molecules that, in the calcium-rich space of the synapse, bind the target's membrane, assemble into rings and then insert through it to form pores. The target repairs its membrane, so timing matters. In human cells, pores formed within about 30 seconds of the killer cell's calcium signal; repair began within 20 seconds of pore formation and was complete within 80, yet enough granzyme had already diffused in to kill[^12]. Granzyme B, the best-studied granzyme, cleaves and activates the target's caspases (the proteases that carry out apoptosis) and also damages its mitochondria by a second route. That redundancy makes the death hard for viruses to block.

Experiments on mouse killer cells, published in 2019, suggest why perforin spares the killer itself, which lets one killer attack target after target. At the synapse, the killer's own membrane is packed with tightly ordered lipids that perforin has difficulty entering, and a lipid exposed on its surface there, phosphatidylserine, binds and inactivates stray perforin[^29].

The Fas route works differently: Fas ligand on the T cell engages Fas on the target, which directly activates the target's caspases. The Fas system also prunes T cells that are stimulated over and over. Children born with faulty *FAS* genes accumulate huge numbers of lymphocytes, their lymph nodes swell, and they develop autoimmunity, a condition called autoimmune lymphoproliferative syndrome (ALPS)[^30]. Fas is not what mainly ends the response to a short infection, however: in mice, the contraction (die-off) of an acute response needed only Bim, the internal trigger of apoptosis that deleted thymocytes also use; Fas joined in mainly during a chronic infection and in preventing autoimmunity[^31].
:::

## The helpers

Helper (CD4) T cells rarely kill. They recognize peptides on the MHC class II of {{antigen-presenting-cell|antigen-presenting cells}} and coordinate other immune cells through cytokines and direct contact.

AIDS shows what happens without them. HIV infects and destroys helper T cells. Before effective drugs, people whose helper cells had dwindled fell ill with infections that a healthy immune system easily controls[^14], even though their killer T cells had not disappeared.

Three of the helpers' jobs matter most here. **First, they license dendritic cells.** A dendritic cell can display peptides on class II, which helpers recognize, and, through {{cross-presentation|cross-presentation}} ([Chapter 4](04-presentation.html)), on class I, which killers recognize. When a helper finds its match on such a cell, it delivers an activating signal by direct contact. The "licensed" dendritic cell raises its costimulatory molecules and cytokine output, and primes (first activates) killer T cells far more strongly[^15].

**Second, helpers enable {{b-cell|B cells}}** to make strong, long-lasting {{antibody|antibodies}} ([Chapter 3](03-adaptive.html)). A B cell internalizes whatever its receptor binds and presents fragments of it on class II. A helper that recognizes one of those fragments binds the B cell through the same contact it uses for licensing, CD40 ligand to {{cd40|CD40}}. It adds cytokines that drive the B cell to multiply, to refine its antibody by {{somatic-hypermutation|somatic hypermutation}} and to change the antibody's constant region by {{class-switching|class switching}}. Two different cells must therefore recognize the same microbe: the B cell an {{epitope|epitope}} on the intact microbe, the helper a peptide fragment of it.

**Third, they sustain killers**, in part through IL-2. Killer T cells primed without help respond more weakly and form poorer {{memory-cell|memory}}, so they protect less well when the same infection returns[^15].

Helpers differentiate into several types. Against viruses and tumors, the most important are {{th1|Th1 ("T helper 1") cells}}, which secrete IFN-γ, activate macrophages and support killer T cells. In mouse tumor models, increasing help markedly strengthens the killer response[^15].

:::deep-dive Types of helper T cells
Which type a helper becomes depends mostly on the cytokines present when it is activated (signal 3 of [Chapter 4](04-presentation.html)), and these reflect what the dendritic cell's {{pattern-recognition-receptor|pattern-recognition receptors}} detected: IL-12, made after sensing many viruses and bacteria, steers new helpers toward Th1, while other mixtures favor other types. Once a type is established it tends to reinforce itself, because each type's cytokines favor its own kind and suppress the others: IFN-γ from Th1 cells dampens the Th2 program, and IL-4 from Th2 cells dampens the Th1 program[^32]. Because most cytokines act over short distances, this reinforcement is local, so different sites in the body can run different programs at the same time. The main types are:

- **Th1** cells make IFN-γ (their defining transcription factor is T-bet). They act against viruses and microbes that live inside cells, activate macrophages, support killer T cells, and are the helper type most associated with tumor control.
- **Th2** cells make IL-4, IL-5 and IL-13. They organize defenses against parasitic worms and drive allergies.
- **Th17** cells make IL-17 and defend barrier surfaces against fungi and some bacteria. When overactive, they contribute to autoimmune diseases such as psoriasis.
- **T follicular helper (Tfh)** cells work inside lymph nodes, selecting which B cells continue to refine their antibodies by somatic hypermutation. Most vaccines depend on them.
- **Regulatory T cells**, described above, restrain other immune cells.

These categories are useful, not rigid: cells can show mixed features and shift with circumstances. Some CD4 T cells can even kill directly, recognizing MHC class II on their targets.

In licensing, CD40 ligand on the helper binds CD40 on the dendritic cell. CD40 signaling makes the dendritic cell raise costimulatory molecules (CD80, CD86 and CD70) and secrete IL-12, a cytokine that drives killer T cells toward full effector function. In cancer, a dendritic-cell subset specialized in cross-presentation is thought to be the main platform where help reaches tumor-specific killers[^15].

Licensing once seemed to require an improbable meeting, since a matching helper, a matching killer and a dendritic cell carrying their target are all rare and all moving. Experiments in mice found two solutions. A helper can first condition a dendritic cell, which can then prime a killer on its own[^33]. And a helper and a dendritic cell that have found each other release {{chemokine|chemokines}}, attractant signals that draw passing killer T cells toward them[^34].

The same CD40 contact is essential for B cells. Boys born with a faulty gene for CD40 ligand, which sits on the X chromosome, make plenty of IgM, the early-response antibody of [Chapter 3](03-adaptive.html), but very little IgG, IgA or IgE: their B cells are normal but never get the signal for class switching. The condition is called hyper-IgM syndrome[^35].
:::

## The brakes

A naive T cell activates only when its receptor recognizes a peptide (signal 1) and {{cd28|CD28}} on the T cell binds {{b7|B7}} on the dendritic cell (signal 2, costimulation), the two-factor authentication of [Chapter 4](04-presentation.html). In the car analogy that gives the brakes their name, CD28 is the accelerator. The T cell then starts dividing ({{clonal-expansion|clonal expansion}}), and within about a week one cell can give rise to thousands.

Expansion this fast needs a way to stop, and mostly it stops itself. As the infection clears, fewer activated dendritic cells bring fresh antigen to the lymph nodes, and effector T cells, which are short-lived by design, die by apoptosis[^31]. About 95 percent of the expanded T cells die this way, in the phase called contraction ([Chapter 3](03-adaptive.html)).

The brakes are a second control, active while the response is under way: inhibitory receptors on the T cell that keep the response from overshooting and limit damage to the tissue. The two best-understood brakes, CTLA-4 and PD-1, act at different times and places[^16].

**CTLA-4: a brake on priming.** CTLA-4 appears on T cells after activation and builds up over the following days. It is a close relative of CD28 and binds the same B7 partners, but with much higher affinity[^16]. As it accumulates, it outcompetes CD28, which is still present but finds less B7 to bind.

CTLA-4 can also remove B7 molecules from the dendritic cell's surface and degrade them[^9]. Because B7 sits mainly on dendritic cells in lymph nodes, CTLA-4 acts mainly during priming, capping how large a response grows[^16]. Regulatory T cells carry CTLA-4 permanently, and they need it: mice whose Tregs alone lack CTLA-4 develop fatal autoimmunity, and their Tregs can no longer lower B7 on dendritic cells[^8].

Mice born without CTLA-4 show how much this brake matters: they develop massive T-cell proliferation, their heart, pancreas and other organs are invaded and destroyed, and they die by three to four weeks of age[^17]. That lethal result led many researchers to expect that blocking CTLA-4 in patients would be dangerously toxic[^16]. It does cause serious autoimmune side effects, but a drug blocks the brake only partly and for a while, and most of those side effects can be controlled ([Chapter 8](08-checkpoints.html)).

**PD-1: a brake in the tissues.** {{pd-1|PD-1}} was discovered in 1992 in Tasuku Honjo's laboratory in Kyoto, in cells undergoing programmed death, hence its name, "programmed death-1"[^18]. Despite the name, PD-1 does not kill T cells; it dampens their signaling. It appears on T cells after activation and stays high as long as they keep meeting their antigen[^16].

B7 sits mainly on dendritic cells, but PD-1's main {{ligand|ligand}}, {{pd-l1|PD-L1}}, can be expressed by many kinds of cells, from organ linings to tumor cells, whenever they sense IFN-γ[^16].

That creates a negative feedback loop. A T cell attacks and secretes IFN-γ, the surrounding tissue expresses more PD-L1, PD-1 on the T cell binds it, and the T cell's activity falls. Because the attack itself triggers the loop, PD-1 acts mainly in tissues, during the attack (the effector phase)[^16].

Mice without PD-1 develop autoimmunity too, but milder[^16]; in one strain, an autoimmune disease of the heart muscle can kill them through heart failure[^19].

:::figure ch05-brakes
title: Accelerators and brakes
goal: After stepping through, the reader understands that a T cell's activity is a running balance of go and stop signals; that CTLA-4 brakes mainly during priming in the lymph node, by out-competing CD28 for B7 and stripping B7 off dendritic cells; that PD-1 brakes mainly in tissues, when IFN-γ released by the attack makes cells display PD-L1; and that removing either brake causes autoimmunity, catastrophically in the case of CTLA-4.
kind: stepper
stage: dark
spec: |
  STRUCTURE. A six-step stepper (shared `ctx.ui.stepper`) over two scenes: steps 1–4 show "Lymph node: priming", steps 5–6 show "Tissue: the attack" (a short cross-fade between them, with the scene name in the time HUD). There are no time scrubbers: each step plays a short, fixed animation to its end state, with Replay. This figure shows NO drugs or antibodies; it owns why brakes exist and how they work (Chapter 8's ch08-two-brakes is a separate figure that adds drugs).
  Stage tags (top right, t-caps, two at most): "Illustrative" and "Time compressed". Time HUD (top left): "Day 0", "Day 1", "Days 2–3" in scene 1; "Hours 0–6", "Hours 6–24", "Days 1–2" in scene 2.
  SIGNAL LEDGER (above the scene, shared `activity-meter` in mode 'ledger', tag 'Illustrative'): a horizontal bar centered on zero. Activating contributions stack to the right as green-cyan "+" segments labeled "TCR (signal 1)" and "CD28 (signal 2)"; inhibitory contributions stack to the left as crimson "−" segments labeled "CTLA-4" and "PD-1". A marker shows the net value over three word zones, "Resting · Active · Full throttle" (words, never numbers). The T cell's look tracks the net value (more active = larger, more ruffled membrane).
  GLYPHS (shared library, per the visual rules): `cd28` green-cyan stalk with "+"; `ctla4` crimson stalk with bar; `b7` pale mint knob with no icon; `pd1` crimson stalk with socket head, on T cells only; `pdl1` light-crimson stalk with plug head, on tissue cells; an engaged PD-1/PD-L1 pair shows interlocked heads plus one crimson "−" disc on the T-cell side. IFN-γ is drawn as hollow blue rings.

  KNOCKOUT TOGGLES. Step 4 shows a toggle "Normal mouse | No CTLA-4" (opens on "No CTLA-4", so the reader can flip back to compare). Step 6 shows a toggle "Normal mouse | No PD-1" (opens on "No PD-1"). After step 6, the stepper unlocks: both scenes become tabs and both toggles stay available (guided, then free).

  SCENE 1: LYMPH NODE (shared `lymphNodeField` background).
  - Left: dendritic cell (green, star-shaped, mature). On its surface: MHC (pale silver cup) holding a hot-pink peptide, and 8 B7 knobs, with a small counter "B7: 8".
  - Right: a naive helper T cell (teal), labeled "T cell", with a TCR and CD28 stalks.
  - Step 1: the TCR meets the peptide–MHC (recognition ring); CD28 grips B7. The ledger moves to "Active"; the T cell enlarges, then divides (2 → 4 → 8 daughters, small, clustering in the node).
  - Step 2: CTLA-4 appears, first as faint vesicles inside the activated T cell, then at the contact face. CD28–B7 pairs are displaced by CTLA-4–B7 pairs. Ledger: CD28 shrinks, CTLA-4 grows.
  - Step 3: some CTLA-4–B7 pairs are pulled into the T cell and dissolve (trans-endocytosis); the DC's counter drops from 8 to ~4. The net marker levels off and eases back within "Active": the response is capped, not cancelled. Division slows.
  - Step 4 ("No CTLA-4"): CTLA-4 never appears and B7 stays at 8. Many DIFFERENT T cells (varied TCR keys, mostly teal helpers, a few blue killers) dock on dendritic cells, including ones recognizing ordinary sand self-peptides, and expand until they spill past the lymph-node outline. The net marker sits at "Full throttle". A small shared `bodyMap` silhouette appears with heart, pancreas, liver and lungs outlined in crimson with "!" icons. Chip: "Mice born without CTLA-4: many T cells, mostly helpers, activate against self and invade organs; death by 3–4 weeks. Losing CTLA-4 from Tregs alone is enough to cause fatal disease." Flipping to "Normal mouse" restores the step 3 end state.

  SCENE 2: TISSUE.
  - A strip of sand-colored tissue cells; 2–3 are infected (pink peptides in MHC class I cups). One or two activated killer T cells (blue) carry unengaged PD-1.
  - Step 5, in three beats: (a) a T cell stops on an infected cell and kills it (short kill grammar, no lens) and releases IFN-γ rings that drift through the tissue; (b) tissue cells reached by IFN-γ display PD-L1 and extra MHC cups; (c) PD-1 on the T cell engages PD-L1. The PD-1 ledger segment grows and the net marker falls. Show the braking as FEWER LASTING CONTACTS, SMALLER IFN-γ OUTPUT AND FEWER COMPLETED KILLS: the T cell keeps crawling at the same speed (do NOT slow it down) but rarely settles into a stable contact. Chip: "The tissue says: that's enough." (Biology note for the builder: PD-1 engagement blocks the "stop" signal that normally makes a T cell halt on its target, so engaged T cells keep moving; Pardoll 2012; Fife et al., Nat Immunol 2009.)
  - Step 6 ("No PD-1"): PD-1 stalks are absent; PD-L1 still appears but nothing engages it; the net marker stays high; T cells keep stopping and attacking, and healthy tissue cells near the attack start showing damage (cracked outlines, dimming). Chip: "Mice without PD-1 develop autoimmunity too, but milder than without CTLA-4 (in one strain, a fatal disease of the heart muscle)." Flipping to "Normal mouse" restores the step 5 end state.

  INFO CHIPS (tap "i"; keep to these two): "B7 = two proteins, CD80 and CD86. CD28 and CTLA-4 bind both; CTLA-4 binds much more tightly." · "Simplification: each brake mostly works where shown, but also acts in the other place to some extent."

  ACCURACY GUARDRAILS:
  - Brakes dampen signaling; they never kill the T cell.
  - CD28 is present on the naive T cell before activation; CTLA-4 appears only after activation (Tregs, not shown, always carry it).
  - B7 sits on the dendritic cell, not on ordinary tissue cells. PD-L1 can appear on many cell types when they sense IFN-γ.
  - PD-1 engagement must not be drawn as slowing the T cell's crawling.
  MOBILE (<600px): the ledger full width above the scene; the scene in a portrait viewBox; the knockout toggle as one large segmented control under the caption.
  REDUCED MOTION: each step shows its end state; toggles swap end states without animation; no particle drift.
steps:
  1. In the lymph node, a dendritic cell presents a matching peptide. The receptor supplies signal 1; CD28, binding B7, supplies signal 2. The T cell activates and starts dividing.
  2. Over the next days, the T cell expresses CTLA-4. It binds the same B7 molecules as CD28, but with much higher affinity, outcompeting CD28.
  3. CTLA-4 can also remove B7 from the dendritic cell and degrade it. With less B7 available, the response levels off instead of growing without limit.
  4. Remove CTLA-4 and nothing caps the response. In mice born without it, many T cells, mostly helpers, attack the body's organs, and the animals die within three to four weeks.
  5. In the tissue, the attack sets off its own negative feedback. Interferon-gamma from killer T cells makes surrounding cells display PD-L1. When PD-1 binds PD-L1, the T cell makes fewer lasting contacts and kills less.
  6. Remove PD-1 and the feedback loop is broken: T cells keep attacking. Mice without PD-1 also develop autoimmunity, though milder than without CTLA-4.
alt: A six-step animation of a T cell's activating and inhibitory signals. In a lymph node, a T cell activated through CD28 and B7 later expresses CTLA-4, which binds B7 with higher affinity than CD28 and even removes it from the dendritic cell, capping the response; without CTLA-4, many T cells activate against self and invade organs. In an infected tissue, interferon-gamma released by attacking T cells makes surrounding cells display PD-L1, which engages PD-1 so that T cells make fewer lasting contacts and kill less; without PD-1, healthy tissue is damaged.
:::

The car analogy has one limit: a car on an empty road could do without brakes, but a T-cell response always runs in or near healthy tissue, so its brakes are never optional. They keep your heart, gut, skin and glands intact every time your T cells respond. That is why releasing them as a cancer treatment ([Chapter 8](08-checkpoints.html)) can cause side effects that look like autoimmune disease, and why tumors that engage the brakes, for instance by displaying PD-L1, can survive ([Chapter 7](07-escape.html)).

:::key-idea
CTLA-4 and PD-1 are brakes that work at different times and places: CTLA-4 mainly during priming in the lymph node, by depriving CD28 of B7; PD-1 mainly in the tissues, when IFN-γ from the attack makes cells display PD-L1.
:::

:::clinic
**Brakes as medicine, in both directions.** A drug called abatacept (Orencia) is the B7-binding part of CTLA-4 fused to the {{fc-region|Fc region}} of an antibody. It binds B7 on antigen-presenting cells, depriving CD28 of its ligand, and is used to treat rheumatoid arthritis, an autoimmune disease of the joints, at the cost of a higher risk of infections. Checkpoint inhibitors for cancer do the reverse: antibodies that block CTLA-4 or PD-1 release the brakes so T cells attack tumors harder ([Chapter 8](08-checkpoints.html)).
:::

:::deep-dive How the two brakes work
CTLA-4 spends most of its life inside the cell, cycling between the surface and {{endosome|endosomes}}, the internal vesicles that receive material taken in from the surface. At the contact zone it outcompetes CD28 for the two B7 molecules, CD80 and CD86, because it binds them with much higher affinity[^16]. Qureshi and colleagues showed that CTLA-4 does more than block: it captures CD80 and CD86 from the opposing cell, internalizes them and degrades them, a process called trans-endocytosis[^9]. Because this removes B7 from the dendritic cell itself, one CTLA-4-bearing cell can reduce signal 2 for *every* T cell that later visits that dendritic cell. That helps explain how Tregs, which carry CTLA-4 permanently, suppress responses: without CTLA-4, Tregs fail to lower CD80 and CD86 on dendritic cells[^8]. Whether CTLA-4 also sends a direct inhibitory signal into its own cell is still debated[^16].

PD-1 works by signaling. Its tail inside the cell recruits SHP2, a phosphatase: an enzyme that removes phosphate groups from proteins. Activating signals work largely by attaching such groups to signaling proteins (phosphorylation), so SHP2 damps the cascade launched by the T-cell receptor and its partners. PD-1 engagement also blocks the "stop" signal that normally makes a T cell halt on its target, so the cell makes fewer lasting contacts[^16]. PD-1 has a second ligand, PD-L2, besides PD-L1, and PD-L1 can also bind CD80, adding another layer of cross-talk[^16].

The division of labor (CTLA-4 at priming, PD-1 in tissues) describes where each brake matters most, not the only place it works: PD-1 can also tilt early responses in lymph nodes toward tolerance, CTLA-4 is present on effector T cells too, and PD-1 appears on activated B cells and natural killer cells as well[^16].
:::

## When antigen never goes away

In chronic infections such as HIV or hepatitis B and C, and in many tumors, the antigen never goes away, so T cells keep receiving signal 1 week after week. The usual end of a response, contraction once the antigen runs out, never comes, and restraint falls to the brakes and to a change in the T cells themselves.

The T cells gradually lose functions. Their capacity to proliferate and to secrete IL-2 fades early; other cytokines and killing decline too, though rarely to zero. They also accumulate inhibitory receptors: PD-1, plus others such as TIM-3 and LAG-3. This state is called T-cell {{exhaustion|exhaustion}}.

Exhaustion is not fatigue that rest can reverse. Strong, persistent stimulation induces {{tox|TOX}}, a transcription factor that changes which of the cell's genes can be read. The change is {{epigenetic|epigenetic}}, written into the packaging of the DNA rather than its sequence, and it is stable[^20][^21][^22]. T cells lacking TOX at first respond more strongly and cause more tissue damage, then die out[^21].

For this reason many immunologists see exhaustion as an adaptation rather than a failure: it keeps T cells alive and still exerting some pressure, without destroying the surrounding tissue in a response that cannot clear the antigen. Against a chronic virus, that compromise may be the best available outcome; against a tumor, it is the stalemate that treatments try to break.

Exhausted T cells are not all alike. A small reserve of {{stem-like-t-cell|stem-like T cells}}, marked by the transcription factor TCF1, keeps renewing itself and producing new cells, which then differentiate into more deeply exhausted cells. These stem-like cells express TOX too: they belong to the exhausted family, but they can still divide[^21].

In mice with chronic viral infections, when the PD-1 brake was blocked, the burst of new T cells came almost entirely from this reserve[^23]. In mouse tumors, too, only these stem-like (or "progenitor") cells responded; the most exhausted cells could not. And in a small study of patients with {{melanoma|melanoma}}, responders whose tumors held more progenitor cells had longer-lasting responses[^24]; [Chapter 8](08-checkpoints.html) returns to this in patients.

:::figure ch05-exhaustion
title: Exhaustion and the stem-like reserve
goal: After using this, the reader leaves with two pictures. First, an acute response ends, while a chronic one never does and drives T cells into exhaustion, a stable state set up by TOX. Second, releasing the PD-1 brake makes a small stem-like reserve burst into new cells, while the most exhausted cells barely respond.
kind: simulation
stage: dark
spec: |
  MODEL. Deterministic and keyframed, not a random simulation: each mode is a short list of keyframes (below), and the figure tweens cell counts, glows, badges and chart lines between them. The same input always gives the same picture. Stage tags (top right, t-caps): "Illustrative" and "Time compressed". Time HUD (top left): "Day N".

  LAYOUT (desktop). Upper ~60%: two compartments side by side: left "LYMPH NODE" (shared `lymphNodeField`), right "Infected tissue / tumor" (a tissue patch with a few target cells carrying hot-pink peptides). Lower ~40%: a time chart drawn dark-native on the same stage (shared `chart.js` with theme 'stage-dark'; no paper inset), x = days 0–60, y = relative level (no units, no numbers on the y-axis), with a playhead.

  CELLS. Sparse: at most ~10 drawn cells per compartment; larger populations are shown as a soft density haze plus a word label ("many", "few"), never a number. All are blue killer T cells from one clone (one `tcrKey`). Exhausted cells use `tCell({ state: 'exhausted' })`. Each cell's overall function is ONE property: its glow (bright = fully functional, faint = hypofunctional). Details live in tap cards (shared infoCard), not on the cells.
  Markers (each appears only when its step introduces it):
  - Inhibitory-receptor badges (crimson "−" discs), 0–3 per cell, from step 2.
  - A small "TOX" tag on EVERY cell of the exhausted lineage, stem-like cells included, from step 3.
  - A padlock labeled "terminal (TCF1 lost)" on terminally exhausted cells only, from step 3. The padlock means terminal differentiation, NOT "has TOX".
  - Stem-like cells (from step 4): a small sprout badge labeled "TCF1"; they sit in the lymph-node compartment, carry one PD-1 badge, a TOX tag and a medium glow.
  - Memory cells (acute mode): plain bright cells, no badges.

  TIME CHART (illustrative curves, not data): three directly labeled lines, distinguished by color AND dash style: "Antigen" (hot pink, dashed), "Specific T cells" (blue, solid), "Function per cell" (green-cyan, dotted).

  KEYFRAMES (relative levels 0–1; illustrative).
  - Acute: day 0 (antigen 0.1, T cells 0.05, function 1); day 6 (antigen 1, T cells 0.5, function 1); day 10 (antigen 0.2, T cells 1, function 1); day 14 (antigen 0, T cells 0.8, function 1); day 30 (antigen 0, T cells 0.1, function 1; a few bright memory cells in both compartments); day 60 (same as day 30).
  - Chronic: day 0 and day 6 as acute; day 10 (antigen 0.9, T cells 0.9, function 0.8); day 20 (antigen 0.8, T cells 0.6, function 0.5; TOX tags on all; first padlocks); day 35 (antigen 0.8, T cells 0.5, function 0.3; most tissue cells padlocked; a small stem-like group in the lymph node); day 60 (same as day 35).
  - Release (chronic, triggered from the day 35 state): +5 days (stem-like group dividing, lymph node filling; PD-1 badges greyed with a strike-through); +10 days (T cells 0.9, function 0.6, antigen 0.4; a wave of new, brighter, TOX-tagged cells in the tissue; padlocked cells unchanged); +25 days, if antigen persists (T cells 0.6, function 0.35, antigen 0.6; the new wave has faded and gained badges and padlocks: re-exhaustion).
  - Release with the reserve removed: +10 days (T cells 0.55, function 0.35, antigen 0.75): only a small, brief effect.
  In the stem-like group, show self-renewal once per keyframe interval: one cell divides, one daughter stays (short loop arrow), the other drifts to the tissue.

  CONTROLS (few, revealed with the steps): segmented control "Acute infection | Chronic infection or tumor"; Play / Pause (plays through the keyframes); Restart. At step 5, a button "Release the PD-1 brake" appears (chronic mode, from the day 35 state). After it has been used once, a second button appears: "Remove the stem-like reserve, then try again". No speed control, no drawer, no extra switches. After step 5 all controls stay unlocked (guided, then free).

  TAP CARDS (shared infoCard):
  - Stem-like (progenitor) exhausted cell: "TCF1 high, PD-1 moderate. Also TOX+: already committed to the exhausted family. Renews itself, sits mostly in lymphoid tissue, sends out new cells. Responds when PD-1 is released."
  - Terminally exhausted cell: "TCF1 lost; PD-1, TIM-3 and LAG-3 high. Still kills (in tumors these are the main killers) but rarely divides and is short-lived. Barely responds when PD-1 is released."
  - Memory cell: "Long-lived, fully functional, no inhibitory receptors."
  - Any exhausted cell, functions list: "Multiply · IL-2 · TNF/IFN-γ · Kill", with the first two dimmed first (order follows Wherry et al., J Virol 2003, for the builder's reference).

  ACCURACY GUARDRAILS:
  - Exhaustion is a distinct, stable cell state, not a temporary lack of energy, and it arises from PERSISTENT antigen.
  - TOX marks the whole exhausted lineage, including the stem-like reserve; the padlock marks only terminal differentiation (loss of TCF1).
  - Stem-like cells are PD-1-positive (moderate), not PD-1-negative.
  - Re-exhaustion after release follows Pauken et al., Science 2016.
  - Footnote on the stage under the chart: "Simplified. In chronic viral infection in mice, stem-like cells sit mainly in lymphoid tissue; in tumors they are also found in niches inside the tumor. Curves are illustrative."
  - This figure shows the biology of releasing the PD-1 brake, not a specific drug; don't draw antibodies. (Chapter 8's ch08-two-brakes reuses this figure's names verbatim: "stem-like (progenitor)", "terminally exhausted", the TOX tag and the "terminal (TCF1 lost)" padlock.)
  MOBILE (<600px): compartments stacked (lymph node above, tissue below), chart below; at most ~6 drawn cells per compartment; buttons full width.
  REDUCED MOTION: no tweening; Play steps through the keyframes as static snapshots.
data: |
  Illustrative shapes only; no real data plotted. The keyframes in the spec define every curve.
steps:
  1. In an acute infection, the virus is cleared within days to weeks. Killer T cells expand, clear the infected cells, and most then die, leaving a small population of fully functional memory cells.
  2. In a chronic infection or a tumor, the antigen never goes away. Week by week, the T cells lose functions and accumulate inhibitory receptors such as PD-1.
  3. Persistent stimulation induces TOX, a transcription factor that commits all the responding cells, the reserve included, to an exhausted state. The most exhausted cells lose TCF1 and become terminally exhausted.
  4. The response does not collapse: a small reserve of stem-like T cells, marked by TCF1, renews itself and keeps producing new cells.
  5. Release the PD-1 brake. The burst of new T cells comes almost entirely from the stem-like reserve; terminally exhausted cells barely respond. Then remove the reserve and try again.
alt: A keyframed animation comparing an acute infection with a chronic infection or tumor. In the acute case, killer T cells expand, clear the antigen and leave a few fully functional memory cells. In the chronic case, the antigen persists, T cells lose function and accumulate inhibitory receptors such as PD-1, and TOX commits them to exhaustion, while a small reserve of stem-like TCF1-positive cells in the lymph node keeps supplying new cells. Releasing the PD-1 brake triggers a burst of new T cells almost entirely from this reserve, with little effect once the reserve is removed.
:::

:::key-idea
When antigen persists, T cells become exhausted: a stable, restrained state, not fatigue. Releasing the PD-1 brake works mainly by expanding a small stem-like reserve, not by reviving the most exhausted cells.
:::

:::deep-dive The reserve that checkpoint drugs tap
In 2016, Rafi Ahmed's group studied mice chronically infected with lymphocytic choriomeningitis virus (LCMV), the standard model of exhaustion. Among the virus-specific killer T cells, they found a subset that carried PD-1 but also costimulatory molecules such as CD28 and ICOS, depended on the transcription factor TCF1, and lived in the T-cell zones of lymphoid tissues. These cells renewed themselves and gave rise to the more exhausted cells found throughout the body. When PD-1 signaling was blocked, the proliferative burst came almost exclusively from this subset[^23].

Miller and colleagues found the same split in mouse tumors. "Progenitor exhausted" cells kept several functions, persisted long-term and gave rise to "terminally exhausted" cells, which kill but are short-lived; only the progenitors responded to anti-PD-1 antibodies. In 25 melanoma patients treated with a combination of two checkpoint drugs, progenitor frequency did not separate responders from non-responders, but among responders, a higher share of progenitor cells went with longer-lasting responses[^24].

TOX is part of what keeps exhausted cells from returning to normal. Strong, persistent stimulation of the T-cell receptor induces TOX, and TOX is needed both to form exhausted cells and to keep them alive; even the stem-like reserve depends on it[^21]. It commits the whole family to an {{epigenetic|epigenetic}} program of exhaustion[^20]. Once that program is in place, releasing a brake alone does not rewrite it. In mice, revived exhausted cells became exhausted again if antigen stayed high and did not turn into normal memory cells once it was cleared; their epigenetic landscape was barely remodeled[^22].

Three consequences matter for treatment. Checkpoint blockade works best when a reserve of stem-like, tumor-specific T cells already exists. Its effect relies largely on generating new cells rather than reviving old ones. And because those new cells face the same persistent antigen, lasting control may require clearing the antigen or combining approaches, questions taken up in [Chapter 8](08-checkpoints.html) and [Chapter 12](12-frontier.html).

Names vary between papers (stem-like, progenitor exhausted, TCF1+ PD-1+, or "Tpex"), but they describe the same family of cells.
:::

## What comes next

The figure below follows one virus infection from its first hour to the years afterward, drawing on all of Part I: the innate alarm and the cells that respond within hours (Chapter 2); dendritic cells carrying viral proteins to a lymph node, where the rare matching T and B cells are found and multiply (Chapters 3 and 4); killer T cells and antibodies about a week later; and the contraction that ends the response, leaving memory cells (Chapters 3 and 5). The adaptive response starts only after the innate alarm and takes about a week, so for the first days the innate defenses act alone.

:::figure ch05-whole-team
title: One infection, start to finish
goal: After stepping through, the reader can retell one immune response in order. They see that the fast innate branch both holds the line and gives the adaptive branch permission to start, that the adaptive branch needs about a week, and that the response ends mainly in die-off once the virus is gone, with memory left behind.
kind: stepper
stage: dark
spec: |
  CONCEPT. Part I's consolidation map: one virus infection, told in place (airway tissue, lymph, lymph node, blood) and in time (hours to years), one step at a time. Every element is a one-line recap that links to the chapter that owns it; nothing is re-taught. Calm and uncluttered: each player enters only at its step, and earlier players dim (but stay) when the action moves elsewhere. Never more than a few arrows at once. Stage tag (top right, t-caps): "Illustrative · timings vary by germ"; visible in every state. Time HUD (top left) shows each step's time label.

  LAYOUT (desktop, landscape ~16:9).
  - Left ~45%: "AIRWAY TISSUE" (shared `tissueField` background). A row of sand (#E9C9A1) lining cells (shared `healthyCell`). One is infected (`healthyCell({ state: 'infected' })`): red-coral (#FF4D5E) virus particles inside (shared `virus`) and hot-pink (#FF3D7F) peptides in pale-silver (#D9DEEA) MHC class I cups. A capillary (shared `bloodVessel`) runs along the bottom edge.
  - Right ~40%: "LYMPH NODE": the shared `lymphNode` art already used in ch03, ch04 and ch08, so readers recognize it. It starts with a sparse crowd of resting T cells (teal and blue, varied receptor keys) and a few B cells.
  - Between them, two thin channels with direction chevrons: an upper lymph vessel (shared `lymphaticVessel`), labeled "lymph", flowing tissue → node; and a lower blood vessel, labeled "blood", flowing node → tissue and joining the capillary.
  - Bottom ~22%: a "WHO'S WORKING" ribbon drawn dark-native on the stage (shared `chart.js`, theme 'stage-dark'; no paper inset). A stretched time axis with five equal-width zones: "Hours" | "Days 1–3" | "Days 4–7" | "Weeks 2–3" | "Months–years". No y-axis and no numbers. Three directly labeled illustrative bands, distinguished by color AND dash pattern:
    - "Innate" (coral #FF7A6B, solid): rises within hours, peaks around days 1–3, falls through days 4–7 and is low by weeks 2–3.
    - "T cells" (blue #4C8DFF, dashed): near zero until about day 4, peaks around a week, then contracts through weeks 2–3 to a low but clearly non-zero memory floor.
    - "Antibodies" (gold #F2B33D, dotted): rises from about a week, stays high through weeks 2–3, then settles to a raised floor.
    The bands overlap (the innate band is still well above zero when the adaptive bands rise): there is no hard handover. A vertical playhead moves to each step's time (step 4 sits on the boundary between "Days 1–3" and "Days 4–7"); the band(s) active in that step brighten, the others dim.

  CAST (shared art library, canonical colors). Each player enters only at its step:
  - infected lining cell (step 1); macrophage, coral, and an immature dendritic cell, green (step 2); NK cell, orange (shared `nkCell`; step 3); the dendritic cell matures at step 3 (`dendriticCell({ state: 'mature' })`);
  - helper T cell (teal #2EC4C9) and killer T cell (blue #4C8DFF), from the node's resting crowd (step 4);
  - B cell (gold), then plasma cells (shared `plasmaCell`) and gold antibodies (shared `antibody`) (steps 4–5);
  - memory cells (step 8): the same T- and B-cell art with a thin bright outer ring and a small "M", matching ch03-clonal-selection's memory marker.

  STATES PER STEP (main view).
  1. "Hour 0". Virus particles enter one lining cell and multiply inside it; a few new particles bud off toward a neighbor. Chip: "Inside cells: out of antibodies' reach".
  2. "Hours". The infected cell releases type I interferon (hollow coral rings, shared `interferon` glyph) that reach its neighbors. A macrophage and the immature dendritic cell near it sense the virus (shared `dangerSpark`) and release inflammatory cytokines (small coral dots). The capillary widens slightly and the tissue tint warms; label "inflamed". The innate band starts rising.
  3. "Days 1–3". An NK cell arrives from the capillary and kills an infected cell whose MHC class I cups have thinned (the cell shrinks into tidy fragments; no gore). The dendritic cell matures (dendrites extend), carries viral protein into the lymph channel and drifts with the chevrons to the node. The innate band peaks.
  4. "Days 2–5". In the node, the mature dendritic cell displays hot-pink peptides on both MHC class I and class II. Among the resting crowd, one helper and one killer fit: each gets a recognition ring (signal 1) and a green-cyan "+" (signal 2). The helper touches the dendritic cell (chip "licensed"); the killer docks on the same dendritic cell a moment later (they don't need to be there together). A B cell that has caught whole virus particles on its receptors shows viral peptide on class II; the same helper touches it (chip "help").
  5. "Days 4–7". Each matching cell photocopies itself: helper, killer and B cell each become a cluster of identical copies (draw ~8–12 per clone, then a soft density haze labeled "thousands"). Several killer copies leave along the blood channel toward the tissue. Some B-cell copies become plasma cells and release the first gold antibodies into the blood. The T-cell band rises; the antibody band starts.
  6. "About a week". Killer T cells leave the capillary into the airway, read shop windows (tiny gray "no match" ticks on healthy cells) and destroy infected cells (short kill grammar from ch05-kill; no lens). Gold antibodies coat free virus particles between cells so they can't enter new ones. A macrophage clears the fragments. The innate band is still present but falling. Chip: "Until now, the innate branch held the line."
  7. "Weeks 2–3". The virus and the infected cells are gone. Most killer and helper copies, in the tissue and in the node, dim and fade (shrink, then specks fading; calm, nothing flashes); chip: "No virus, no signal: most of the new army dies". In the tissue, one or two PD-1–PD-L1 contacts show the crimson "−" disc (#E5484D) with a small chip "brakes limit tissue damage". The T-cell band contracts; the antibody band stays high.
  8. "Months–years". A few memory T and B cells (ring badge) remain in the node and the tissue, more than the matching cells the node started with; a small label at the node's edge reads "long-lived plasma cells (bone marrow)"; antibodies sit at a low, steady level in the blood. Chip: "Same virus again: a response within days". Then the closing chip appears below the ribbon: "Swap the virus for a tumor and the same sequence must run, usually without step 2's alarm. Chapter 7 calls it the cancer-immunity cycle."

  CONTROLS. Prev / Next / Replay (shared `ctx.ui.stepper`). After step 8, free exploration unlocks:
  - Tap any cell for a one-line card (shared infoCard): what it does here, plus "Introduced in Chapter N" with a link. Infected cell and NK cell: Chapter 2; macrophage: Chapter 2; dendritic cell: Chapters 2 and 4; helper and killer T cells: Chapter 5; B cell, plasma cell and antibodies: Chapter 3; memory cells: Chapter 3.
  - Optional toggle "Show the handshakes": leader-line labels on five contacts, each placed where it happens in the scene: "TCR + peptide–MHC"; "CD28–B7 · anti-CTLA-4 acts here"; "CD40L–CD40"; "PD-1–PD-L1 · anti-PD-1/PD-L1"; "Fc–Fc receptor · antibody drugs".

  SCIENTIFIC GUARDRAILS (please keep):
  - Innate and adaptive activity overlap; there is no hard handover.
  - NK cells are innate: orange, no T-cell receptor.
  - Antibodies never reach virus inside cells.
  - Helpers coordinate and never kill in this figure.
  - The die-off is mainly programmed death once the virus is gone; the brakes only keep the attack in proportion. Never show brakes killing cells.
  - The silver cup means MHC only; brakes use the crimson "−" glyph.
  - Don't re-chart T-cell numbers (ch05-exhaustion's acute mode does) or the second-exposure curve (ch03-clonal-selection does).
  - Use only the site's canonical timings: innate within hours; dendritic-cell maturation a day or two; an army within about a week, full strength in one to two weeks; about 95% die-off; a second response within three to four days.
  MOBILE (<600px): portrait: tissue above, node below, the two channels vertical (lymph flowing down on the left, blood flowing up on the right); ribbon full-width below the stage; captions below. Cards open as bottom sheets.
  REDUCED MOTION: each step shows its end state; no particle drift; the playhead jumps.
steps:
  1. Hour 0. A virus gets into cells lining the airway and starts copying itself inside them, where antibodies can't reach it.
  2. Hours. Infected cells release interferons, the antiviral alarm, and macrophages and dendritic cells in the tissue sense the virus's molecular signatures (PAMPs). The area becomes inflamed. (Chapter 2)
  3. Days 1–3. NK cells kill infected cells that display less MHC class I. Dendritic cells, activated by the alarm, carry viral proteins through the lymph to the nearest node. (Chapters 2 and 4)
  4. Days 2–5. In the node, the rare helper and killer T cells whose receptors fit get both signals. Helpers license dendritic cells to prime killers, and help the B cells that bound the virus. (Chapters 3–5)
  5. Days 4–7. Each matching cell divides into thousands of copies. Killer T cells leave through the blood; B cells become plasma cells, and the first antibodies appear. (Chapter 3)
  6. About a week in. Killer T cells reach the airway, check the cells' MHC class I and destroy infected ones. Antibodies stop free virus from entering new cells. Until now, the innate defenses have done most of the work in the airway. (Chapters 3 and 5)
  7. Weeks 2–3. As the virus disappears, antigen runs out and most of the expanded T cells die. The brakes help keep the attack from overshooting and limit damage to the tissue. (Chapters 3 and 5)
  8. Months to years. Memory cells and long-lived plasma cells remain. If the same virus returns, the response starts within days. A vaccine sets off this sequence without the illness. (Chapter 3)
alt: A map of one virus infection over time, with airway tissue on one side and a lymph node on the other. Within hours, infected cells raise an alarm and innate cells respond. Over days, dendritic cells carry viral proteins to the lymph node, where rare matching T and B cells are activated and multiply. About a week in, killer T cells and antibodies clear the virus. Die-off ends the response, leaving memory cells. A timeline shows innate activity first and adaptive activity from about a week.
:::

This system is good at detecting *foreign* things. Cancer is harder: a cancer cell is built almost entirely from your own genes, so most of what it displays is ordinary self, and most T cells that react strongly to ordinary self were removed or silenced long ago. A protein changed by a typo in its gene, however, was never part of that selection. [Chapter 6](06-cancer.html) covers what can make a cancer cell different enough to be recognized at all, and why, unlike a virus, it rarely triggers the right kind of alarm.

:::quiz
Q: A thymocyte's newly built receptor cannot bind any of the body's own peptide–MHC complexes. What happens to it?
- [ ] It is deleted for being too self-reactive — Deletion is for receptors that bind self too strongly; this one binds nothing at all.
- [ ] It leaves the thymus but stays inactive in the blood — Cells that fail positive selection never leave; they die inside the thymus.
- [x] It gets no survival signal and dies of neglect — Without even weak binding to self-MHC, it fails positive selection.
- [ ] It becomes a regulatory T cell — Tregs come from cells with fairly high affinity for self, not from cells that bind nothing.

Q: A killer T cell has recognized an infected cell. Which description of what happens next is right?
- [x] Granzymes enter through perforin pores and trigger the target's apoptosis — The target packages itself into fragments that macrophages clear, and the T cell moves on unharmed.
- [ ] Perforin pores make the target burst open and spill its contents — Perforin only forms small pores; bursting would spread virus and inflammation.
- [ ] The T cell engulfs the target whole and digests it inside — Killer T cells act by contact and cytotoxic granules; macrophages engulf the remains afterwards.

Q: Which statement about the two main T-cell brakes is correct?
- [ ] PD-1 works mainly in lymph nodes, by removing B7 from dendritic cells to deprive CD28 — That describes CTLA-4, not PD-1.
- [x] CTLA-4 works mainly during priming; PD-1 mainly in tissues showing PD-L1 — The two brakes act at different times and places.
- [ ] Both brakes work the same way: by killing overactive T cells outright — Brakes dampen signaling; despite its name, PD-1 doesn't kill T cells.

Q: Why can releasing the PD-1 brake revive a T-cell response against a chronic infection or tumor?
- [ ] Exhaustion is simple tiredness, and releasing the brake cures it — Exhaustion is a stable state set up by TOX, not fatigue.
- [ ] It returns the most exhausted cells to normal — Terminally exhausted cells barely respond; their program largely remains.
- [x] A stem-like reserve responds with a burst of new cells — The burst comes almost entirely from these TCF1+ cells.
:::

:::takeaways
- The thymus selects T cells without modifying their receptors: positive selection keeps cells whose receptors bind the body's own peptide–MHC weakly (no binding means death by neglect), and negative selection deletes those that bind self strongly. AIRE extends the test to proteins from organs all over the body. Only a few percent survive.
- Thymic selection (central tolerance) is incomplete, so peripheral tolerance backs it up outside the thymus: ignorance, anergy, regulatory T cells (defined by FOXP3; without them, fatal autoimmunity follows) and inhibitory checkpoints.
- Killer (CD8) T cells kill by contact: an immunological synapse, perforin pores and granzymes trigger the target's apoptosis, and the T cell moves on unharmed.
- Helper (CD4) T cells coordinate the response: they license dendritic cells, enable strong antibody responses and sustain killers. Th1 helpers are the type most associated with tumor control.
- CTLA-4 brakes mainly during priming in lymph nodes (mice without it die within weeks); PD-1 brakes mainly in tissues, triggered by PD-L1 that IFN-γ induces. Brakes protect organs, which is why releasing them causes autoimmune-like side effects.
- When antigen persists, chronic stimulation drives T cells into exhaustion, a stable state set up by TOX. A small stem-like (TCF1+) reserve within the exhausted family keeps the response going and is what releasing the PD-1 brake mainly mobilizes.
:::

## Glossary
- thymus | Thymus | A small organ behind the breastbone, in front of the heart, where T cells develop and are selected. It is most active early in life and gradually shrinks with age.
- t-cell | T cell | A white blood cell that recognizes peptides displayed on MHC molecules using its T-cell receptor. Named after the thymus, where it develops.
- tcr | T-cell receptor (TCR) | The recognition molecule on a T cell, unique to each T cell and its copies, that binds a specific peptide held in an MHC molecule.
- thymocyte | Thymocyte | A developing T cell inside the thymus, before it has passed selection.
- bone-marrow | Bone marrow | The soft tissue inside bones where blood and immune cells, including the precursors of T cells, are made.
- peptide | Peptide | A short chain of amino acids: a fragment of a protein. T cells recognize peptides, not whole proteins.
- mhc | MHC (major histocompatibility complex) molecule | A cell-surface molecule that holds up peptides for T cells to inspect. In humans, MHC molecules are called HLA.
- positive-selection | Positive selection | The thymic test that keeps only thymocytes whose receptors can bind the body's own peptide–MHC complexes at least weakly; the rest get no survival signal and die of neglect.
- apoptosis | Apoptosis | Programmed cell death: an orderly process in which a cell dismantles itself into membrane-wrapped fragments that phagocytes engulf without triggering inflammation.
- mhc-class-i | MHC class I | The MHC molecule on nearly every cell that displays fragments of proteins made inside that cell (its "shop window"). Read by CD8 T cells.
- cd8-t-cell | CD8 T cell (killer T cell) | A T cell that recognizes peptides on MHC class I and kills cells displaying foreign or abnormal peptides. Also called a cytotoxic T cell.
- mhc-class-ii | MHC class II | The MHC molecule on professional presenting cells such as dendritic cells, macrophages and B cells (and on thymic cells, where T cells are selected), displaying fragments of whatever reaches their endosomes and lysosomes, including material taken up from outside. Read by CD4 T cells.
- cd4-t-cell | CD4 T cell (helper T cell) | A T cell that recognizes peptides on MHC class II and coordinates immune responses through cytokines and contact signals.
- negative-selection | Negative selection | The thymic test that deletes, by apoptosis, thymocytes whose receptors bind self-peptide–MHC complexes with high affinity. Also called clonal deletion.
- aire | AIRE (autoimmune regulator) | A protein in specialized epithelial cells of the thymic medulla that activates genes otherwise expressed only in other organs, so developing T cells can be tested against those proteins.
- tolerance | Tolerance | The immune system's non-response to the body's own molecules, maintained in the thymus (central tolerance) and throughout the body (peripheral tolerance).
- costimulation | Costimulation (signal 2) | The confirmation signal a T cell needs, in addition to recognizing its peptide, to become fully activated; classically delivered by CD28 binding B7.
- anergy | Anergy | A lasting unresponsive state a T cell enters when it recognizes its target without receiving the confirming costimulatory signal (signal 2). The cell stays alive but no longer responds.
- regulatory-t-cell | Regulatory T cell (Treg) | A type of CD4 T cell, defined by FOXP3, that suppresses other immune cells and prevents autoimmunity.
- foxp3 | FOXP3 | The transcription factor that gives regulatory T cells their identity. Mutations in its gene cause the scurfy disease in mice and IPEX in humans.
- transcription-factor | Transcription factor | A protein that binds DNA and controls which genes a cell expresses. Some set a cell's type and keep it stable, such as FOXP3 in regulatory T cells, T-bet in Th1 cells and TOX in exhausted T cells.
- il-2 | IL-2 (interleukin-2) | A cytokine that drives T cells to multiply. Regulatory T cells consume it, which restrains other T cells.
- cytokine | Cytokine | A small signaling protein that immune cells release to instruct other cells, for example to multiply, attack, move or suppress a response.
- ctla-4 | CTLA-4 | An inhibitory receptor that appears on activated T cells (and permanently on regulatory T cells). It outcompetes CD28 for B7 and can remove B7 from antigen-presenting cells, braking T-cell priming.
- dendritic-cell | Dendritic cell | An immune cell that samples tissues, carries antigens to lymph nodes and activates T cells there.
- autoimmunity | Autoimmunity | An immune attack on the body's own tissues.
- checkpoint | Immune checkpoint | An inhibitory pathway, such as CTLA-4 or PD-1, that limits T-cell activity to prevent autoimmunity and tissue damage.
- lymph-node | Lymph node | A small bean-shaped organ where dendritic cells present antigens to T cells and immune responses are launched.
- effector-t-cell | Effector T cell | An activated T cell ready to act, usually after leaving the lymph node; for a CD8 T cell, ready to kill.
- immunological-synapse | Immunological synapse | The tight, organized contact zone between a T cell and the cell it recognizes, through which signals pass and the contents of cytotoxic granules are released.
- perforin | Perforin | A protein released by killer T cells and natural killer cells that assembles into pores in the target cell's membrane, letting granzymes in.
- granzyme | Granzyme | A protease (an enzyme that cleaves proteins) that enters target cells through perforin pores and triggers apoptosis.
- macrophage | Macrophage | A large immune cell that engulfs microbes, debris and dying cells and can either promote or dampen inflammation.
- fas | Fas and Fas ligand | A "death receptor" (Fas) found on many cells and its ligand (Fas ligand) on killer T cells; their binding triggers apoptosis in the Fas-bearing cell.
- tumor | Tumor | An abnormal mass of cells. Malignant tumors (cancers) can invade surrounding tissue and spread.
- ifn-gamma | Interferon-gamma (IFN-γ) | A cytokine made by activated T cells and natural killer cells. It makes nearby cells display more MHC, activates macrophages, slows some tumor cells and induces PD-L1.
- tnf | Tumor necrosis factor (TNF) | An inflammatory cytokine released by T cells and macrophages that activates blood vessels and immune cells and can kill some tumor cells.
- cross-presentation | Cross-presentation | The ability of certain dendritic cells to display fragments of proteins they picked up from outside on MHC class I, so they can activate CD8 killer T cells.
- cd40 | CD40 and CD40 ligand | A receptor on dendritic cells, B cells and macrophages (CD40) and its partner on activated helper T cells (CD40 ligand). Their binding lets helpers "license" these cells.
- b-cell | B cell | A white blood cell that makes antibodies after recognizing its target with its B-cell receptor.
- antibody | Antibody | A Y-shaped protein made by B cells that binds a specific target, neutralizing it or marking it for destruction.
- memory-cell | Memory cell | A long-lived T or B cell left after an immune response that reacts faster and more strongly if the same threat returns.
- th1 | Th1 (T helper 1) cell | A type of helper T cell that makes IFN-γ, activates macrophages and supports killer T cells; important against viruses and tumors.
- cd28 | CD28 | The main costimulatory receptor on T cells (the "accelerator" opposed by the brakes): it delivers the confirmation signal (signal 2) when it binds B7 on a dendritic cell.
- b7 | B7 (CD80 and CD86) | Two related proteins on activated dendritic cells and other presenting cells that bind CD28 (activating) or CTLA-4 (inhibitory).
- clonal-expansion | Clonal expansion | The rapid division of a T or B cell that has found its target, producing many identical copies.
- pd-1 | PD-1 | An inhibitory receptor on activated T cells that dampens their signaling when it binds PD-L1 or PD-L2; acts mainly in tissues.
- pd-l1 | PD-L1 | The main partner of PD-1, displayed by many cell types, including tumor cells, especially in response to interferon-gamma.
- exhaustion | T-cell exhaustion | A stable state of reduced function and high inhibitory-receptor levels that T cells enter under chronic stimulation, as in chronic infection or cancer.
- tox | TOX | A transcription factor induced by strong, persistent T-cell receptor signaling that sets up the exhausted state and is needed for exhausted T cells, including the stem-like reserve, to persist.
- stem-like-t-cell | Stem-like T cell (progenitor exhausted T cell) | A TCF1-expressing T cell in chronic infections and tumors that also expresses TOX, renews itself and produces more exhausted descendants; the main source of new T cells after the PD-1 brake is released.
- melanoma | Melanoma | A cancer of melanocytes, the pigment-producing cells of the skin (and, more rarely, the eye and mucous membranes). It usually carries many mutations, often caused by sunlight.
- epigenetic | Epigenetic | Describes chemical and structural marks on DNA and its packaging that control which genes a cell can use, without changing the DNA sequence. They can make a cell's identity stable.
- tgf-beta | TGF-β (transforming growth factor beta) | A signaling protein that promotes scarring and tissue repair and suppresses immune responses; tumors use it to build barriers against T cells and to suppress them.
- chemokine | Chemokine | A type of cytokine that attracts cells, forming a chemical trail that immune cells follow toward its source.

## Sources
1. Miller JF. Immunological function of the thymus. *Lancet* 1961;2(7205):748–749. doi:10.1016/s0140-6736(61)90693-6
2. Anderson MS, Venanzi ES, Klein L, et al. Projection of an immunological self shadow within the thymus by the aire protein. *Science* 2002;298(5597):1395–1401. doi:10.1126/science.1075958
3. Sansom SN, Shikama-Dorn N, Zhanybekova S, et al. Population and single-cell genomics reveal the Aire dependency, relief from Polycomb silencing, and distribution of self-antigen expression in thymic epithelia. *Genome Res* 2014;24(12):1918–1931. doi:10.1101/gr.171645.113
4. Egerton M, Scollay R, Shortman K. Kinetics of mature T-cell development in the thymus. *Proc Natl Acad Sci USA* 1990;87(7):2579–2582. doi:10.1073/pnas.87.7.2579
5. Stritesky GL, Xing Y, Erickson JR, et al. Murine thymic selection quantified using a unique method to capture deleted T cells. *Proc Natl Acad Sci USA* 2013;110(12):4679–4684. doi:10.1073/pnas.1217532110
6. Yu W, Jiang N, Ebert PJR, et al. Clonal deletion prunes but does not eliminate self-specific αβ CD8+ T lymphocytes. *Immunity* 2015;42(5):929–941. doi:10.1016/j.immuni.2015.05.001
7. Liston A. An education in tolerance: the 2025 Nobel Prize in Physiology or Medicine. *Dis Model Mech* 2025;18(11):dmm052725. doi:10.1242/dmm.052725
8. Wing K, Onishi Y, Prieto-Martin P, et al. CTLA-4 control over Foxp3+ regulatory T cell function. *Science* 2008;322(5899):271–275. doi:10.1126/science.1160062
9. Qureshi OS, Zheng Y, Nakamura K, et al. Trans-endocytosis of CD80 and CD86: a molecular basis for the cell-extrinsic function of CTLA-4. *Science* 2011;332(6029):600–603. doi:10.1126/science.1202947
10. Brunkow ME, Jeffery EW, Hjerrild KA, et al. Disruption of a new forkhead/winged-helix protein, scurfin, results in the fatal lymphoproliferative disorder of the scurfy mouse. *Nat Genet* 2001;27(1):68–73. doi:10.1038/83784
11. Purbhoo MA, Irvine DJ, Huppa JB, Davis MM. T cell killing does not require the formation of a stable mature immunological synapse. *Nat Immunol* 2004;5(5):524–530. doi:10.1038/ni1058
12. Lopez JA, Susanto O, Jenkins MR, et al. Perforin forms transient pores on the target cell plasma membrane to facilitate rapid access of granzymes during killer cell attack. *Blood* 2013;121(14):2659–2668. doi:10.1182/blood-2012-07-446146
13. Halle S, Keyser KA, Stahl FR, et al. In vivo killing capacity of cytotoxic T cells is limited and involves dynamic interactions and T cell cooperativity. *Immunity* 2016;44(2):233–245. doi:10.1016/j.immuni.2016.01.010
14. Okoye AA, Picker LJ. CD4+ T-cell depletion in HIV infection: mechanisms of immunological failure. *Immunol Rev* 2013;254(1):54–64. doi:10.1111/imr.12066
15. Borst J, Ahrends T, Bąbała N, Melief CJM, Kastenmüller W. CD4+ T cell help in cancer immunology and immunotherapy. *Nat Rev Immunol* 2018;18(10):635–647. doi:10.1038/s41577-018-0044-0
16. Pardoll DM. The blockade of immune checkpoints in cancer immunotherapy. *Nat Rev Cancer* 2012;12(4):252–264. doi:10.1038/nrc3239
17. Tivol EA, Borriello F, Schweitzer AN, Lynch WP, Bluestone JA, Sharpe AH. Loss of CTLA-4 leads to massive lymphoproliferation and fatal multiorgan tissue destruction, revealing a critical negative regulatory role of CTLA-4. *Immunity* 1995;3(5):541–547. doi:10.1016/1074-7613(95)90125-6
18. Ishida Y, Agata Y, Shibahara K, Honjo T. Induced expression of PD-1, a novel member of the immunoglobulin gene superfamily, upon programmed cell death. *EMBO J* 1992;11(11):3887–3895. doi:10.1002/j.1460-2075.1992.tb05481.x
19. Nishimura H, Okazaki T, Tanaka Y, et al. Autoimmune dilated cardiomyopathy in PD-1 receptor-deficient mice. *Science* 2001;291(5502):319–322. doi:10.1126/science.291.5502.319
20. Khan O, Giles JR, McDonald S, et al. TOX transcriptionally and epigenetically programs CD8+ T cell exhaustion. *Nature* 2019;571(7764):211–218. doi:10.1038/s41586-019-1325-x
21. Alfei F, Kanev K, Hofmann M, et al. TOX reinforces the phenotype and longevity of exhausted T cells in chronic viral infection. *Nature* 2019;571(7764):265–269. doi:10.1038/s41586-019-1326-9
22. Pauken KE, Sammons MA, Odorizzi PM, et al. Epigenetic stability of exhausted T cells limits durability of reinvigoration by PD-1 blockade. *Science* 2016;354(6316):1160–1165. doi:10.1126/science.aaf2807
23. Im SJ, Hashimoto M, Gerner MY, et al. Defining CD8+ T cells that provide the proliferative burst after PD-1 therapy. *Nature* 2016;537(7620):417–421. doi:10.1038/nature19330
24. Miller BC, Sen DR, Al Abosy R, et al. Subsets of exhausted CD8+ T cells differentially mediate tumor control and respond to checkpoint blockade. *Nat Immunol* 2019;20(3):326–336. doi:10.1038/s41590-019-0312-6
25. Van Laethem F, Sarafova SD, Park JH, et al. Deletion of CD4 and CD8 coreceptors permits generation of αβT cells that recognize antigens independently of the MHC. *Immunity* 2007;27(5):735–750. doi:10.1016/j.immuni.2007.10.007
26. Van Laethem F, Tikhonova AN, Pobezinsky LA, et al. Lck availability during thymic selection determines the recognition specificity of the T cell repertoire. *Cell* 2013;154(6):1326–1341. doi:10.1016/j.cell.2013.08.009
27. Ohashi PS, Oehen S, Buerki K, et al. Ablation of "tolerance" and induction of diabetes by virus infection in viral antigen transgenic mice. *Cell* 1991;65(2):305–317. doi:10.1016/0092-8674(91)90164-t
28. Furusawa Y, Obata Y, Fukuda S, et al. Commensal microbe-derived butyrate induces the differentiation of colonic regulatory T cells. *Nature* 2013;504(7480):446–450. doi:10.1038/nature12721
29. Rudd-Schmidt JA, Hodel AW, Noori T, et al. Lipid order and charge protect killer T cells from accidental death. *Nat Commun* 2019;10(1):5396. doi:10.1038/s41467-019-13385-x
30. Fisher GH, Rosenberg FJ, Straus SE, et al. Dominant interfering Fas gene mutations impair apoptosis in a human autoimmune lymphoproliferative syndrome. *Cell* 1995;81(6):935–946. doi:10.1016/0092-8674(95)90013-6
31. Hughes PD, Belz GT, Fortner KA, Budd RC, Strasser A, Bouillet P. Apoptosis regulators Fas and Bim cooperate in shutdown of chronic immune responses and prevention of autoimmunity. *Immunity* 2008;28(2):197–205. doi:10.1016/j.immuni.2007.12.017
32. Zhu J, Yamane H, Paul WE. Differentiation of effector CD4 T cell populations. *Annu Rev Immunol* 2010;28:445–489. doi:10.1146/annurev-immunol-030409-101212
33. Ridge JP, Di Rosa F, Matzinger P. A conditioned dendritic cell can be a temporal bridge between a CD4+ T-helper and a T-killer cell. *Nature* 1998;393(6684):474–478. doi:10.1038/30989
34. Castellino F, Huang AY, Altan-Bonnet G, Stoll S, Scheinecker C, Germain RN. Chemokines enhance immunity by guiding naive CD8+ T cells to sites of CD4+ T cell–dendritic cell interaction. *Nature* 2006;440(7086):890–895. doi:10.1038/nature04651
35. Allen RC, Armitage RJ, Conley ME, et al. CD40 ligand gene defects responsible for X-linked hyper-IgM syndrome. *Science* 1993;259(5097):990–993. doi:10.1126/science.7679801
