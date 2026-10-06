---
id: 03-adaptive
title: Adaptive Immunity
subtitle: Your genes cannot anticipate tomorrow's pathogens, so your body makes millions of random receptors in advance and multiplies the cells whose receptors fit.
part: I
reading_time: 27
hero: ch03-hero
---

Through the 1910s and 1920s, first in Vienna and later at the Rockefeller Institute in New York, the physician Karl Landsteiner made small chemical groups in the laboratory, attached them to proteins and injected them into animals. No animal had ever encountered these molecules, so evolution could not have prepared the immune system for them.

The animals made {{antibody|antibodies}} against them anyway: Y-shaped proteins that bound the new chemicals and little else. In one 1928 experiment, the antibodies even distinguished the left- and right-handed forms of a molecule, two versions that are mirror images of each other [^1].

In 2020 a coronavirus new to every human immune system repeated the test worldwide. In one early study of 285 people with COVID-19, all had antibodies against the virus within 19 days of falling ill [^2].

**How can a body make a precise fit for a shape it has never seen, one that may not have existed when its genome evolved?** Its immune cells do it by cutting and rejoining pieces of their own DNA in random combinations.

## The impossible problem

{{innate-immunity|Innate immunity}} (Chapter 2) relies on receptors encoded directly in your genes, which recognize broad danger patterns that {{pathogen|pathogens}} (disease-causing microbes, such as viruses and bacteria) find hard to change. These receptors cannot tell one strain of flu from another, and they do not learn.

Recognizing a *particular* virus takes a receptor that fits *its* surface, and that surface keeps changing: microbes can alter their coats within months, while the human genome changes only over many generations. Flu changes its surface so steadily that its vaccine is updated every year [^3].

There is also a numbers problem. With one gene per receptor, recognizing millions of shapes would take millions of genes, but the genome contains fewer than 20,000 protein-coding genes, which must cover everything from hemoglobin to hair [^4].

For decades the leading explanation was that the invader *shapes* the antibody. In 1940 the chemist Linus Pauling proposed that a newly made antibody folds around the foreign molecule and sets in the matching shape [^5]. The theory was wrong.

In fact the body makes an enormous collection of different receptors *in advance*, at random, and an arriving pathogen instructs nothing: it *selects* the few cells whose receptors happen to fit. This is {{adaptive-immunity|adaptive immunity}}: the branch of the immune system that answers each invader with receptors that match it, and remembers it afterward.

## Two kinds of lymphocyte

Adaptive immunity depends on two kinds of {{lymphocyte|lymphocytes}}, small white blood cells that travel in blood and lymph and gather in the {{lymph-node|lymph nodes}} and {{spleen|spleen}}. (The NK cells of Chapter 2 are innate lymphocytes.)

{{t-cell|T cells}} are named for the {{thymus|thymus}}, the small organ behind the breastbone where they mature. {{b-cell|B cells}} were named for the bursa of Fabricius, an organ in birds where they were first found; in people they mature in the {{bone-marrow|bone marrow}}, which happens to start with B as well.

Each B cell carries many copies of a {{bcr|B-cell receptor}}, which is an antibody anchored to the cell. B cells recognize intact shapes, such as a patch on a virus coat or one of Landsteiner's chemicals, and once activated they secrete their antibody in large quantities.

Each T cell carries many copies of a {{tcr|T-cell receptor}}, which never leaves the cell. T cells kill infected cells and coordinate other immune cells, and, as the last section explains, they recognize targets differently.

Anything a B- or T-cell receptor can recognize is an {{antigen|antigen}}; the exact patch it binds, often a dozen or so amino acids, is an {{epitope|epitope}}.

**As a rule, each lymphocyte carries just one kind of receptor**, so it recognizes a narrow range of epitopes and ignores nearly everything else.

## Shuffling the deck

An antibody is a Y-shaped protein made of four chains: two identical long {{heavy-chain|heavy chains}} and two identical short {{light-chain|light chains}}. Each chain begins with a **{{variable-region|variable region}}**, whose amino-acid sequence differs from one antibody to the next. The rest of the chain is its **{{constant-region|constant region}}**, which comes in only a few standard types. At the end of each arm of the Y, the variable regions of one heavy and one light chain together form an antigen-binding site, the part that binds the target; the stem of the Y is built from heavy-chain constant regions alone. Making a new antibody means making new variable regions.

In 1976 Nobumichi Hozumi and Susumu Tonegawa found that the DNA encoding the variable region of an antibody chain and the DNA encoding its constant region lie far apart in mouse embryo cells, but had been brought together in a tumor of antibody-secreting cells, where every cell makes the same antibody [^6]. Lymphocytes, it turned out, cut and rejoin their own DNA as they mature, a discovery that won Tonegawa the 1987 Nobel Prize.

For the variable region of the heavy chain, your DNA holds not one complete gene but rows of {{gene-segment|gene segments}}, alternative versions in three families: about 40 working **V** (variable) segments, 23 **D** (diversity) segments and 6 **J** (joining) segments [^7]. In each young B cell, a pair of enzymes, {{rag|RAG1 and RAG2}}, binds beside one D segment and one J segment and cuts the DNA at both; the stretch between them is removed, and the cell's DNA-repair enzymes join the cut ends. The same process then brings in one V. This cutting and joining is called {{vdj-recombination|V(D)J recombination}}.

The choices alone give about 40 × 23 × 6 ≈ 5,500 different heavy chains. The light chain is assembled the same way from V and J segments only, which is why the D in V(D)J is in parentheses; with two families of light chain to draw on, that gives roughly 325 combinations. Pairing any heavy chain with any light chain gives nearly 2 million antibodies from fewer than 200 gene segments.

The joins are imprecise. At each junction between two segments, a few nucleotides (DNA letters) are trimmed from the cut ends, and an enzyme adds a few random nucleotides that were never in your genome [^8]. This {{junctional-diversity|junctional diversity}} falls at the center of the antigen-binding site, where it often makes the closest contact with the target.

:::deep-dive Inside the cut
Each V, D and J segment is flanked by a short DNA signal called a recombination signal sequence: a 7-nucleotide motif and a 9-nucleotide motif separated by a spacer of either 12 or 23 nucleotides. RAG1 and RAG2 bring two signal sequences together and cut only a pair in which one has a 12-nucleotide spacer and the other a 23-nucleotide spacer, the "12/23 rule" [^8]. In the heavy-chain locus, V and J segments both carry 23-nucleotide spacers while D segments carry 12-nucleotide ones, which is why a heavy chain cannot skip its D.

RAG cuts the DNA in a way that seals the cut end of each gene segment into a hairpin. Another enzyme, Artemis, then reopens the hairpin, often off-center, which can leave a few extra nucleotides that mirror the adjacent sequence (P nucleotides, for palindromic). The enzyme TdT (terminal deoxynucleotidyl transferase) adds nucleotides that are not copied from any template (N nucleotides), and non-homologous end joining, a general pathway that cells use to repair broken DNA, joins the pieces [^8]. The resulting junction encodes a loop called {{cdr3|CDR3}} (complementarity-determining region 3), the most variable part of the receptor, which sits at the center of its antigen-binding site. The cut-out DNA between the segments, with its signal sequences joined neatly end to end, is usually lost from the cell.

The chemistry of the RAG cut resembles that of transposases, the enzymes that transposons ("jumping genes") use to move around genomes, and RAG proteins can move DNA in the same way in the test tube. Many researchers think the whole system began as a transposon that our distant ancestors domesticated [^8].

Deliberately breaking {{chromosome|chromosomes}} is risky. Mistakes in V(D)J recombination can place a cancer-promoting gene next to the strong DNA control regions that drive antibody production, and some lymphomas and leukemias carry chromosome rearrangements traced to such mistakes [^8].
:::

Each junction can come out in thousands of different ways, depending on how many nucleotides are trimmed and added, and which. A heavy chain has two junctions and a light chain one, so roughly a few thousand cubed, times 2 million segment combinations, gives a number with fifteen or more zeros.

T-cell receptors are built the same way from their own segments, and the classic estimate is about 10¹⁵ possible T-cell receptors: a million billion [^9]. Antibodies are more varied still, because B cells keep mutating their receptor genes after assembling them: one study estimated that the antibodies circulating in a group of ten people could span 10¹⁶ to 10¹⁸ versions [^10].

The process is wasteful. DNA is read in three-nucleotide {{codon|codons}}, and the number of nucleotides trimmed and added at each junction is random, so roughly two joins in three shift the gene out of its reading frame, and it then encodes no working protein. Each cell has two copies of these genes, one from each parent (Chapter 1). A cell that fails on one copy tries again on the other; if it runs out of attempts, it dies.

Once a cell succeeds, it stops rearranging that chain, so every receptor it carries is identical. The change is permanent and passes to every descendant of the cell, which later allows a useful receptor to be multiplied. It never happens in eggs or sperm: you inherit the gene segments, not the finished receptors, so every person builds a personal set of receptors, a {{repertoire|repertoire}}, from scratch.

:::figure ch03-vdj
title: Shuffle the deck
goal: After using this, the reader understands that each developing B cell builds its receptor by picking one V, one D and one J segment at random and joining them with random edits at the seams; that this yields a practically unlimited variety from a few dozen pieces; that each cell ends up with one receptor, inherited by all its descendants; and that many attempts fail.
kind: simulation
stage: dark
spec: |
  PURPOSE: a "slot machine" that assembles an antibody heavy chain from gene segments, shows the random seams, and drops the finished B cell into a growing "library" shelf. The reader should feel both the combinatorial explosion and the waste. Keep the first encounter simple and reveal more only after the reader has built a cell.

  PROGRESSIVE DISCLOSURE (three stages):
  - STAGE A (on load): only the DNA band, the B-cell area (an empty amber outline labeled "a young B cell") and one primary button "Build a B cell". The step caption (HTML, aria-live) reads step 1.
  - STAGE B (after the first successful build): fade in the small COUNTER line and the LIBRARY shelf, and two more buttons: "Build another" and "Same pieces, new seams".
  - STAGE C (after three builds): add a fourth button "Build 100".
  A small "Reset" link appears from Stage B on and returns to Stage A.

  LAYOUT (desktop, landscape viewBox ~960×560):
  1. DNA BAND (top), labeled "Inherited DNA (the same in every young B cell)". A horizontal DNA ribbon (soft double line, pale silver) carrying small rectangular segment tiles in four groups, left to right:
     - V group: 40 slim tiles in ONE hue (teal), varied only by three subtle shade bands so neighbors are distinguishable; group label "V ≈40".
     - D group: 23 narrower tiles in one hue (apricot; not the B-cell amber); label "D 23".
     - J group: 6 tiles in one hue (lilac); label "J 6".
     - C block: one wider muted gray tile; label "C (constant part)". No extra notes on C.
     Small "//" break marks between groups signal that the real segments are spread over roughly a million DNA letters; do not draw to scale.
     Only CHOSEN tiles get a text label (e.g., "V17", "D4", "J2"), which appears when RAG picks them, so color is never the only cue.
     The rearrangement happens IN PLACE on this ribbon (loops are cut out, the ribbon closes up). For each new build, a fresh, complete ribbon slides in from the left with the caption tag "next young B cell: same inherited DNA".
  2. SEAM LENS: a circular magnifier that appears over whichever seam is being joined. Inside, DNA letters are small round beads with A/C/G/T glyphs. Existing letters are white-outlined; trimmed letters turn gray and drop away; added random letters pop in as bright white beads with a tiny "+" badge.
  3. B-CELL AREA (bottom left): the finished B cell (art `bCell`, amber #F2B33D, soft glow) with 6–8 identical Y-shaped receptors (art `antibody()`, natural: gold, no white outline) around its membrane. All receptors on one cell carry one tip glyph (see "Tip shape"); a subtle synchronized pulse emphasizes that they are identical. The light chain is drawn as a paler outer strip on each arm.
  4. LIBRARY SHELF (bottom right, Stage B+): built with the shared `unitGrid`; each unit is a small B-cell thumbnail with its own tip glyph. Failed cells are faint gray outlines with the ✕ badge. Stage tag "Illustrative" (top right) appears with the shelf: the mix of successes and failures comes from the simplified model.
  5. COUNTER LINE (top right, Stage B+; small Inter text). Keep it short; the orders of magnitude belong to ch03-numbers, the next figure:
     - "Heavy-chain choices: ≈40 × 23 × 6 = 5,520"
     - Live tallies: "Cells built: n · Different receptors: n · Failed: m"
     - A text link "How big is the library? ↓" that scrolls to ch03-numbers.
     Compute "Different receptors" honestly by comparing full builds (heavy V, D, J and both seams' letters, plus light V, J and seam letters). Duplicates are possible but astronomically rare; never force the tally.

  TIP SHAPE (important for the teaching): draw tips with the art library's `tcrKey` notch glyph (the book's clone-identity glyph, also used for B-cell receptors), seeded deterministically from a hash of the build. If the glyph accepts a composite seed, let the outer notches follow the V choice (cells sharing a V look like relatives) and the CENTER notch follow the seam letters. Either way, "Same pieces, new seams" must visibly change the glyph: same segments + different seams = a different receptor.

  BUILD ANIMATION (heavy chain; the order is scientifically required). Each phase is tied to one step caption. Phases auto-advance (~1.5 s each); a small Pause/Next control under the caption lets the reader hold or step through.
  Phase 1 (step 1): the ribbon is shown whole; tiles shimmer briefly.
  Phase 2 (step 2): two small pale "RAG" glyphs (paired clamps, labeled "RAG") settle on one random D tile and one random J tile; those tiles brighten and show their labels. The DNA between them bows up into a loop; RAG snips at the loop's base; a small "repair" glyph (a stitch mark) seals the ribbon; the loop closes into a small circle and drifts up and fades ("cut out and lost").
  Phase 3 (step 3): the seam lens opens over the D–J join: 0–4 letters trimmed from each end, then 0–6 random letters added. Randomize per build.
  Phase 4 (step 4): the same for V: RAG picks a random V and the D–J unit; the DNA between them loops out, is snipped and fades; repair seals; seam lens over the V–D join.
  Phase 5 (step 5): reading-frame check. A thin "reading frame" bar slides along the new gene in three-letter ticks. Decide in-frame vs out-of-frame from the actual seam letter counts (net length change mod 3 = 0 → in frame), which naturally gives about 1 in 3 success per attempt. If out of frame, the bar breaks into a jagged dashed line with the ✕ badge and the message "Out of frame: this gene makes gibberish." A second, ghosted ribbon labeled "copy from the other parent" slides up and the build repeats quickly. If that also fails, the B-cell outline turns gray, shrinks and fades, and a failed thumbnail drops into the library. (The roughly 4-in-9 failure rate this produces is a property of the simplified model; never display it as a measured biological rate.)
  Phase 6 (step 6): if in frame, the reading-frame bar shows the ✓ badge, the caption notes that the light chain is built the same way; do NOT animate the light chain (simplification: in the figure it always succeeds). Receptors appear on the B cell; a thumbnail drops into the library.
  "Same pieces, new seams" reuses the same V, D and J but re-randomizes all seam letters; a one-line note appears: "Same V, D and J, different seams: a different receptor."
  "Build 100" skips the animation and fills the library with 100 results in ~2 s (staggered pop-in), updating the tallies. Failures (gray) should make up a visible fraction.

  SCIENTIFIC CONSTRAINTS for the builder:
  - Heavy chain: D joins J first, then V joins DJ. One V, one D, one J per heavy chain.
  - RAG cuts; the cell's repair machinery joins. Do not show RAG "gluing".
  - Random letter changes occur only at the seams, never inside segments.
  - The cut-out DNA is permanently lost from that cell; the edited gene is inherited by all its descendants.
  - All segments are on one chromosome ribbon; the "other parent's copy" is a second, separate ribbon.
  - Choosing segments with equal probability is an acceptable simplification (real usage is uneven).
  - Never show two different receptor shapes on the same cell.

  MOBILE (portrait, ≤600px): the V group wraps onto two rows of 20; D, J and C sit on the next row. The seam lens appears as a centered overlay. The B cell sits below the DNA; the counter line below the cell; the library becomes a 5-column grid ("Build 100" shows the first 50 with "+50 more"). Buttons full width, stacked.
  REDUCED MOTION: "Build a B cell" jumps to the end state with a static before/after of the DNA and the finished cell; seam edits are listed as text ("−2 letters, +4 random letters").
steps:
  1. Every young B cell starts with the same inherited DNA: rows of alternative V, D and J gene segments, far more pieces than one receptor needs.
  2. The RAG enzymes pick one D and one J at random and cut out the DNA between them; DNA-repair enzymes join the ends. The removed DNA is gone from this cell for good.
  3. At the junction, a few nucleotides (DNA letters) are trimmed away and a few random new ones are added. These added nucleotides exist nowhere in your genome.
  4. The same cut, trim and add brings in one V segment. The cell now has a heavy-chain gene that has probably never existed before.
  5. About two out of three joins throw the gene out of its three-nucleotide reading frame. The cell then tries again on the copy it inherited from its other parent; if that fails too, it dies.
  6. A successful cell builds its light chain the same way, from one V and one J, and displays many copies of a single receptor. Every cell it gives rise to inherits that receptor.
alt: An animated diagram of an antibody gene being assembled. From rows of about 40 V, 23 D and 6 J gene segments, enzymes pick one of each and cut out the DNA in between, DNA-repair enzymes join the pieces, and at each junction a few nucleotides are trimmed and random ones added. Many joins fail because they disrupt the gene's reading frame. Each successful B cell ends up with one receptor, and a growing library of simulated cells shows that no two receptors come out alike, while a visible share of cells fail.
:::

:::key-idea
The immune system does not design receptors for the threats it meets. It generates a vast library of random receptors in advance, one kind per lymphocyte, and multiplies the cells whose receptors turn out to fit.
:::

## A library with gaps

The result is a library of receptors, each made at random and carried by its own lymphocyte, but it is far from infinite. An adult has a few hundred billion T cells, and one T cell for each of 10¹⁵ possible receptors would weigh about 500 kilograms [^9].

So each person carries a random sample. By sequencing receptor genes from blood and estimating statistically how many versions went unseen, researchers put a young adult's T cells at no fewer than 100 million (10⁸) different versions of one of the receptor's two protein chains, a lower bound rather than a count [^11]. One mathematical model puts the true number of distinct receptors nearer 10 billion (10¹⁰) [^9]. Either figure is a small fraction of what is possible, and no two people carry the same collection.

:::deep-dive Counting the library
A person's receptor genes can be sequenced only from a blood sample, so researchers estimate how many receptors went unseen with "missing species" statistics borrowed from ecologists counting rare animals.

Using these methods, Qi and colleagues estimated a minimum of about 100 million distinct T-cell receptor β chains in the naive T cells of young adults. Healthy elderly people had only two- to five-fold fewer, although the thymus shrinks with age [^11]. Because every β chain can pair with different α chains, the number of complete receptors is higher still.

Lythe and colleagues modeled how T-cell clones arise in the thymus and slowly die out. They estimated that a human body may hold about one distinct receptor for every ten naive T cells, on the order of 10¹⁰, with an average clone of around ten cells over its lifetime [^9]. That is one model's result, higher than every sequencing-based estimate. The figures of 10⁷ to 10⁸ quoted in many textbooks are best read as sequencing-based minimums.

For antibodies, Briney and colleagues sequenced almost 3 billion antibody heavy-chain genes from ten people. Each person's repertoire was largely unique, yet a small set of near-identical heavy chains, with the same gene segments and junctions, turned up in everyone. Their 10¹⁶ to 10¹⁸ figure is an estimate of the variety circulating across the whole group, including changes B cells make after selection, and it assumes heavy and light chains pair at random [^10]. They also noted that the total information in all the rearranged receptor genes of one person exceeds the size of the human genome by more than four orders of magnitude [^10].

Cross-reactivity is what makes a finite sample work. In Wooldridge's study, a single T-cell receptor from a person with type 1 diabetes was estimated to recognize more than a million different ten-amino-acid peptides. One of them, differing from the natural target at 7 of 10 positions, stimulated the cell more than 100 times more strongly than the natural target did [^12]. So the receptor that responds to an infection is probably the best fit available in your library, rarely the best possible one. The same flexibility helps explain how a receptor raised against a microbe can occasionally attack the body's own tissue.
:::

A sample can still cover the range of infections a person meets, for three reasons.

- **Each receptor fits many targets.** Recognition is a matter of degree, the {{cross-reactivity|cross-reactivity}} of Chapter 1. One T-cell receptor studied in detail was estimated to respond to more than a million different protein fragments, strongly to a few and weakly to most. Ten-amino-acid fragments come in about ten trillion versions, though, so even this receptor responds to only about one in ten million of them [^12].
- **Each pathogen offers many targets.** A virus is coated in proteins, each with many patches, and the immune system needs to match only some of them.
- **The fit improves during an infection.** Activated B cells introduce small random mutations into the DNA encoding their variable regions, a process called {{somatic-hypermutation|somatic hypermutation}}, and the daughter cells whose antibodies bind more tightly are selected (T-cell receptors are fixed once made). The invader still instructs nothing; it only selects (see the Go deeper box on affinity maturation).

The cost of sampling is that the cells matching any one target are rare. In mice, only about 1 in 200,000 never-activated killer T cells recognized one particular viral fragment: roughly 100 to 200 cells in the whole animal, carrying a variety of different receptors that all fit [^13][^14].

:::figure ch03-numbers
title: How big is the library?
goal: After using this, the reader grasps the orders of magnitude involved: a few dozen gene segments, about 2 million segment combinations, around 10¹⁵ possible receptors, far more than the body has cells, so each person carries a random sample of at least 10⁸ receptors.
kind: chart
stage: light
spec: |
  PURPOSE: make huge numbers intuitive with a single vertical logarithmic "ladder" revealed step by step.

  LAYOUT: a tall vertical axis on the left third of the stage, labeled with powers of ten from 10⁰ at the bottom to 10¹⁶ at the top (tick every power; also label 10³, 10⁶, 10⁹, 10¹², 10¹⁵ in words: "thousand", "million", "billion", "trillion", "quadrillion"). A one-time note beside the axis: "Each tick is 10 times the one below." Each data point is a "rung": a short horizontal bar crossing the axis at its value, with a small icon and a one-line label to the right. Unrevealed rungs are invisible; revealed rungs stay visible but dim when not current. The current rung is highlighted (bolder, accent outline). On desktop the whole axis fits; on phones the stage scrolls gently so the current rung sits mid-stage.
  Two rung colors, with matching icons, so the switch from antibody numbers to T-cell numbers is visible: gold rungs with a small Y icon for antibody numbers; blue rungs with a small T-cell icon for T-cell numbers; neutral ink for the genome rung. A tiny legend sits at the top: "gold = antibodies · blue = T cells".

  RUNGS (value · label · icon · source tag shown as a tiny superscript link to the chapter's source list):
  1. ~70 · "V, D and J segments for an antibody heavy chain (≈40 + 23 + 6)" · three small tiles · gold · [IMGT]
  2. <20,000 (drawn at 2 × 10⁴ with a "<" mark) · "protein-coding genes in your whole genome" · DNA helix · neutral · [Amaral 2023]
  3. ~1.8 × 10⁶ · "heavy × light chain combinations from segment choice alone (calculated)" · two tiles joined · gold · [IMGT, calculation]
  4. ~10¹⁵ · "possible T-cell receptors (classic estimate)" · glowing key glyph · blue · [Lythe 2016]
  5. ~4 × 10¹¹ · "T cells in an adult body" · cluster of T-cell glyphs · blue · [Lythe 2016]; callout bubble: "One T cell for each possible receptor would weigh ≈500 kg."
  6. ≥10⁸ · "different T-cell receptor chains in a young adult (sequencing-based estimate; a minimum)" · single T-cell glyph · blue · [Qi 2014]. From this rung draw a dashed vertical extension up to 10¹⁰ labeled "one model's estimate" · [Lythe 2016].
  A soft hatched band between rung 6 (10⁸) and rung 4 (10¹⁵) appears at step 6, labeled "the gap: possible vs. present".

  CONTROLS: "Next" / "Back" buttons and a step-dot indicator (6 steps). Keyboard arrows also advance. Tapping any revealed rung shows its full source citation in an infoCard (ctx.ui.infoCard). A visible source line (ink-3, 12 px) sits under the ladder: "Sources: IMGT; Amaral 2023; Qi 2014; Lythe 2016."

  MOBILE: the ladder fits portrait; axis on the left at ~25% width, labels wrap to two lines; the infoCard appears as an inline panel under the stage.
  REDUCED MOTION: no scrolling animation; rungs simply appear.
steps:
  1. For an antibody's heavy chain, your genome holds about 40 V, 23 D and 6 J segments: around 70 pieces. On this scale, each step up is ten times the one below.
  2. Your whole genome has fewer than 20,000 protein-coding genes. Giving every possible receptor its own gene was never an option.
  3. Choosing one V, one D and one J, and pairing the result with a light chain built the same way, gives roughly 1.8 million combinations.
  4. Nucleotides trimmed and added at random at the junctions multiply that many times over. T cells build their receptors the same way, and the classic estimate is about 10¹⁵ possible T-cell receptors: a million billion.
  5. No body could hold them all: an adult has a few hundred billion T cells; 10¹⁵ is over 2,000 times more, and that many T cells would weigh about 500 kilograms.
  6. So each person carries a random sample: at least 100 million different T-cell receptors by sequencing-based estimates, which are minimums, and perhaps ten billion by one model. It works because each receptor can recognize many related targets.
data: |
  Heavy-chain segments, functional, human (per haploid genome): IGHV 38–46 (varies by person), IGHD 23, IGHJ 6 — IMGT Repertoire, human IGH locus description (imgt.org, accessed Oct 2026).
  Light-chain segments: IGKV 31–36, IGKJ 5; IGLV 29–33, IGLJ 4–5 — IMGT Repertoire, human IGK and IGL locus descriptions.
  Combinations (calculation): heavy 40 × 23 × 6 = 5,520; light κ ≈ 35 × 5 = 175 plus λ ≈ 30 × 5 = 150, total ≈ 325; 5,520 × 325 ≈ 1.8 × 10⁶.
  Protein-coding genes: "fewer than 20,000" — Amaral P et al., Nature 2023;622:41–47.
  Naive TCRβ diversity ≥1 × 10⁸ unique sequences in young adults (statistical lower bound from sequencing, not a count) — Qi Q et al., PNAS 2014;111:13139–13144.
  Total T cells ≈ 4 × 10¹¹; possible TCRs ≈ 10¹⁵; 10¹⁵ T cells ≈ 500 kg; model estimate of distinct clonotypes ≈ 10¹⁰ (≈9% of naive CD4 T cells, a model result above all sequencing-based estimates) — Lythe G et al., J Theor Biol 2016;389:214–224. (Chapter 1's census gives ≈4.7 × 10¹¹ T cells from Sender et al. 2023; both fit "a few hundred billion".)
  Ratio: 10¹⁵ / 4–4.7 × 10¹¹ ≈ 2,100–2,500 ("over 2,000 times").
alt: A vertical logarithmic ladder comparing numbers. About 70 gene segments for an antibody heavy chain and fewer than 20,000 genes in the genome sit at the bottom, followed by about 1.8 million segment combinations. Higher up, an adult's few hundred billion T cells sit far below the roughly 10¹⁵ possible T-cell receptors (one T cell for each would weigh about 500 kilograms). Each person's actual library, at least 100 million different T-cell receptors by sequencing-based estimates and perhaps ten billion by one model, is a small sample of what is possible.
:::

## Clonal selection

In 1957 the Australian virologist Frank Macfarlane Burnet, building on an idea from the immunologist Niels Jerne, set out the theory in a short paper [^15]. If every lymphocyte carries a different, ready-made receptor, an invader need not teach the immune system anything; it only has to *find* the cells that already fit it, and those cells multiply. Burnet called this {{clonal-selection|clonal selection}}. A {{clone|clone}} here is a family of cells descended from one ancestor, all inheriting its receptor.

The process resembles natural selection on a timescale of days, except that all the variety exists before the pathogen appears. It has four stages.

**Selection.** {{naive-lymphocyte|Naive lymphocytes}}, which have never met their target, circulate constantly through the lymph nodes. During an infection, pieces of the microbe arrive there, carried in with the lymph or by {{dendritic-cell|dendritic cells}} (Chapter 2). A lymphocyte whose receptor binds those pieces firmly enough, and which gets a second signal confirming that the threat is real, activates. For a T cell, the dendritic cell supplies it (the two-factor authentication of Chapter 4); most B cells get theirs from a helper T cell (Chapter 5).

**Expansion.** The activated cell divides, and its daughters divide, many times over. This is {{clonal-expansion|clonal expansion}}. In mice infected with a virus, the 100 to 200 killer T cells that recognized one viral fragment divided more than 14 times in a week, together reaching about 10 million cells, or tens of thousands of descendants for every starting cell [^13].

**Action.** Most of the new cells become {{effector-cell|effector cells}}. T cells kill infected cells or direct other immune cells (Chapter 5). B cells become {{plasma-cell|plasma cells}}, which secrete large amounts of their antibody into the blood.

**Contraction and memory.** Once the infection is cleared, most of the expanded population dies by programmed cell death, or {{apoptosis|apoptosis}}: in the same mouse study, about 95% of it. The surviving 5% became {{memory-cell|memory cells}}, about 500,000 of them, more than 1,000 times as many as the matching cells the mouse started with [^13].

All this takes time: a first adaptive response needs one to two weeks to reach full strength [^13][^16], and in the meantime the innate immune system has to contain the infection.

:::figure ch03-clonal-selection
title: Select, copy, remember
goal: After using this, the reader understands that an antigen selects the rare lymphocytes whose pre-made receptors fit it; that those cells multiply enormously, then mostly die, leaving a much larger pool of memory cells; that a second exposure to the same germ produces a faster, bigger response; and that a different germ starts from scratch.
kind: stepper
stage: dark
spec: |
  PURPOSE: a step-driven population scene linked to a two-panel chart, so readers watch clonal selection happen in a "lymph node" and see the same events as curves. The seven step captions ARE the controls: no separate scenario buttons.

  LAYOUT (desktop): two panels side by side on ONE dark stage. LEFT (≈55%): the lymph-node field, drawn in Canvas on the art library's `lymphNodeField` interior (label "LYMPH NODE" in t-caps), with agents from `shared/agents.js`. RIGHT (≈45%): a dark-native chart (`shared/chart.js`, theme 'stage-dark'; no paper inset) with TWO STACKED PANELS sharing one time axis (see CHART). Directly under the chart, ON THE STAGE, sits the data-source disclosure line (see CHART). Under the stage: the step caption (HTML, aria-live), then the controls.
  HUD (top left, `ctx.ui.clock`): clock icon plus "Day n" in tabular Inter; it never runs backward within an exposure and shows "Months or years later" at the axis break. Stage tags (top right): "Time compressed" and "Illustrative".
  MOBILE (portrait): field on top (square), chart below at full width with the disclosure line under it, controls below the caption.

  CONTROLS: built on `ctx.ui.stepper`: "Back" / "Next", step dots (1–7, grouped as "first exposure" 1–5, "second exposure" 6, "different germ" 7), and a "Play" toggle that auto-advances (~4 s per step). Each step runs its own short animation, then holds its end state. Keyboard arrows also step. After step 7 all steps stay freely selectable.

  FIELD CONTENTS:
  - ~300 small amber (#F2B33D) B-cell dots wander slowly (gentle drift). Each dot carries a tiny receptor glyph, the art `tcrKey` notch (≥40 seeded shapes), so the population is visibly diverse; germ epitopes use the matching `epitopeKey`.
  - A small fixed note in the field corner: "Only a few hundred of the lymph node's cells are drawn."
  - GERM A displays three different epitope glyphs on its surface. Exactly 3 dots match germ A, each with a DIFFERENT receptor glyph that complements a DIFFERENT one of germ A's epitopes (this shows that several clones respond to one germ). Exactly 2 other dots match germ B. None are highlighted until their germ arrives.
  - Dots never change scale or meaning. During expansion, each responding dot's descendants form a growing cluster that keeps the parent's receptor glyph, so the reader can see three families (clones) growing side by side, up to ~120 dots in total. Non-matching dots dim slightly so the clusters stand out.

  GERMS: GERM A = red-coral virus particles (#FF4D5E, small icosahedra with spikes). GERM B = chartreuse bacteria (#B5D94A rods) with their own epitope glyphs. Germ pieces enter the field from its left edge, some drifting in and some carried by 2–3 mature dendritic cells (art `dendriticCell({ state:'mature' })`, green #4FD18B).

  STEP-BY-STEP STATES (simulated days shown on a day counter above the field):
  1. Rest. The diverse population drifts. No germs.
  2. Day 0–3: germ A pieces arrive (drifting in and on dendritic cells). The 3 matching dots light up: a bright ring plus a "match" tag (non-color cue) when they touch a matching piece. Every other dot ignores the germ.
  3. Day 3–8: EXPANSION. The 3 matching dots divide (each division uses the shared `divisionPinch` effect: one dot pinching into two) into three growing clusters.
  4. Day 6–14: ACTION. Some cluster dots become plasma cells (larger amber ovals with an off-center nucleus) that emit tiny gold Y-shaped antibodies drifting toward germ pieces; coated germs fade. By ~day 12 germ A is gone. A small arrow at the field edge labeled "some plasma cells → bone marrow" shows a few leaving.
  5. Day 10–35: CONTRACTION. About 95% of cluster dots die with the crowd version of the book's death cue (shrink, then 4–6 specks fading over 0.6 s; nothing flashes). The remaining dots become MEMORY cells: amber dots with a thin bright outer ring and a small "M" glyph. Show ~15–20 memory dots across the three families, clearly more than the 3 that started.
  6. "Months or years later": germ A returns. Memory dots respond within ~1 simulated day; clusters regrow faster; plasma cells and antibodies appear by day ~3–4; germ A is cleared by ~day 5. An even larger memory pool remains.
  7. Germ B arrives. Its 2 matching naive dots light up and a full, slow first response replays from scratch, while germ-A memory dots stay calm and do not respond.

  CHART (dark-native, theme 'stage-dark'; Inter labels; colorblind-safe: distinct line styles plus direct labels; one shared x-axis):
  - X axis: days. First exposure 0–60; an axis break labeled "months or years later"; then 0–30 for the step 6 or step 7 exposure.
  - TOP PANEL, titled "Killer T cells in mice (measured)", subtitle "all clones that fit one viral fragment; log scale", ticks 10¹ to 10⁸. Solid line in T-cell blue (the series is an entity). For the first exposure use the measured mouse numbers: ~150 at day 0, ~10⁷ around day 8, ~5 × 10⁵ by day ~30, then flat. A large live counter above the panel shows the current value ("≈150 cells" → "≈10 million" → "≈500,000"). For step 6, start at the memory level and rise faster to a modestly higher, unlabeled peak, drawn dashed and labeled "stylized". For step 7, a new dashed line for germ B starts again at ~150, labeled "stylized".
  - BOTTOM PANEL, "Germ and antibody (Illustrative)", arbitrary units, linear; series use chart tokens plus line styles. Germ: dashed red-coral line; first exposure rises from day 0, peaks ~day 5–7, cleared by ~day 12; in step 6 it stays low and is cleared by ~day 5. Antibody in blood: dotted gold line; first exposure near zero until ~day 6–7, peaks ~day 14–21, then declines to a low plateau above zero; in step 6 it begins rising by day 3–4 and peaks earlier and clearly higher (unlabeled). A pale shaded band across the germ scale labeled "enough germ to make you ill (illustrative)": the first-exposure germ curve enters it; the step 6 curve does not.
  - A vertical playhead synced to the field's day counter.
  - DISCLOSURE LINE, on the stage directly under the chart (fg-2 on dark, ≥12 px, never collapsed on phones): "The field shows B cells, which make antibodies. Top panel: killer T cells in mice (Blattman 2002), which follow the same pattern. Bottom panel: stylized; antibody timing from human vaccine data (Pollard & Bijker 2021)."

  SCIENTIFIC CONSTRAINTS:
  - Only cells whose receptors fit the germ respond; non-matching cells never divide in response.
  - The germ does not change any cell's receptor (selection, not instruction).
  - Several different clones respond to one germ; each cluster keeps its own receptor glyph.
  - Memory cells belong to the same clones as the expanded cells.
  - Contraction is large (~95%) but not total; memory exceeds the starting number.
  - Germ B's response must look like a first response (slow, smaller), regardless of germ-A memory.
  REDUCED MOTION: each step shows its end state as a still, with the chart fully drawn up to that step.
steps:
  1. Before infection, every lymphocyte carries its own random receptor. For any one pathogen, only a tiny handful fit, and they fit different parts of it.
  2. Pathogen A invades. Pieces of it reach the lymph node, some drifting in and some carried by dendritic cells. Only the cells whose receptors fit are selected; every other cell ignores it.
  3. The selected cells divide again and again, a process called clonal expansion. In mice, the hundred or so killer T cells that recognized one viral fragment became about ten million in a week; B cells multiply the same way.
  4. Many of the new B cells become plasma cells that secrete large amounts of antibody into the blood. Within about two weeks, the virus is cleared.
  5. With the threat gone, about 95% of the expanded cells die. The survivors become memory cells, still far more numerous than the handful that started.
  6. Months or years later, pathogen A returns. Memory cells respond within days, faster and stronger, and it is often cleared before it can make you feel ill. This is what a vaccine sets up.
  7. A different pathogen gets no head start: its own rare matching cells must be found and multiplied from scratch. Memory is specific.
alt: A step-by-step simulation of a lymph node full of lymphocytes, each with a different receptor, next to a two-panel chart. When a pathogen arrives, only the few matching cells respond; they multiply enormously (in a measured mouse example, from about 150 killer T cells to about ten million in a week), produce antibodies that clear the infection, and then about 95 percent die, leaving a large pool of memory cells. A second exposure to the same pathogen produces a faster, larger antibody response that clears the infection before it causes illness; a different pathogen starts a slow first response from scratch.
:::

## Memory: why the second time is different

In the spring of 1846, measles reached the remote Faroe Islands for the first time in 65 years. A young Danish physician, Peter Panum, went to help. Of the 7,782 islanders, about 6,000 caught it [^17].

Many elderly islanders had lived through the previous epidemic in 1781. As far as Panum could find, not one of those who had had measles then fell ill a second time; he saw 98 of them himself. Age alone gave no protection: elderly people who had escaped measles in 1781 caught it in 1846 [^17].

Clonal selection explains what Panum saw. After an infection, the body keeps far more matching cells than it started with. Some plasma cells also settle in the bone marrow, where they can keep secreting antibody for decades [^16]. One study estimated that antibody levels against measles fall so slowly that their half-life, the time to drop by half, exceeds 200 years [^18].

Memory cells are also easier to activate than naive ones. In mouse studies, memory T cells responded to smaller amounts of their target, relied less on the confirming second signal, and acted within a day, without first going through many rounds of division [^22][^23]. Some memory T cells stay in the tissue where the pathogen last entered, ready if it returns [^24]. The strict checks on a naive cell guard against starting a response by mistake; a memory cell has already passed them once.

:::deep-dive Where memory lives
**Two layers of antibody memory.** Long-lived plasma cells, mostly in the bone marrow, secrete antibody continuously, and they are a selected group: in one mouse study, only B cells whose receptors had come to bind the target more tightly went on to become plasma cells [^25]. Memory B cells make no antibody until their target returns, and they are more varied. After mice recovered from West Nile virus, their plasma cells' antibodies were directed at one important epitope on the virus and barely blocked a variant mutated there, while many memory B cells recognized both versions [^26].

**Three kinds of T-cell memory.** Central memory T cells circulate through the lymph nodes and, when reactivated, multiply to rebuild a large population. Effector memory T cells travel in the blood, ready to enter inflamed tissue and act at once [^27]. Tissue-resident memory T cells settle where an infection once entered, in places such as the skin, lungs and gut, and stay there; taken together, they may be the most numerous memory T cells of all [^24].

**A cancer connection.** Killer T cells with tissue-resident features turn up inside many tumors. In lung cancer, and in early triple-negative breast cancer (an aggressive type), patients whose tumors were rich in them tended to live longer [^30][^31].
:::

More memory cells, each easier to activate, make the difference between a {{primary-response|primary response}} and a {{secondary-response|secondary response}}. On first exposure, antibody levels take about two weeks to rise [^16]. On a second exposure, memory B cells raise antibodies to protective levels within three to four days [^16], usually to higher levels than before and with higher-affinity antibodies, often clearing the pathogen before you notice you were infected.

A {{vaccine|vaccine}} exposes the immune system to a harmless version or piece of a pathogen, so the slow primary response happens without the disease. When the real virus or bacterium arrives, it meets a secondary response.

Protection lasts longer against some infections than others (see Go deeper). Flu keeps changing its surface proteins, so last year's antibodies bind this year's virus less well [^3].

:::deep-dive How long does memory last, and can you borrow it?
Memory varies widely by pathogen. Following 45 adults for up to 26 years, Amanna and colleagues estimated antibody half-lives of about 50 years for chickenpox virus and more than 200 years for measles and mumps, effectively lifelong. Antibodies against the toxins of tetanus and diphtheria, induced by vaccines made from inactivated toxins, waned faster, with half-lives of about 11 and 19 years [^18]. Some countries recommend adult tetanus boosters, while others consider five or six childhood doses enough for life [^16].

Vaccine studies give similar time scales. After smallpox vaccination, antibody levels held steady for up to 75 years, while T-cell memory faded slowly, losing half its strength every 8 to 15 years [^28]. Memory killer T cells made by the yellow fever vaccine divide less than once a year, yet a decade later they can still respond quickly [^29].

Memory also takes time to act: memory B cells need three to four days to raise antibodies to protective levels, which is enough against infections with a long incubation period. Against bacteria that can cause severe disease within hours or days, such as some causes of meningitis, people can fall ill despite having immune memory; against these, what counts is antibody already circulating in the blood [^16].

Antibodies can also be borrowed. During pregnancy, a mother's antibodies of one class, IgG (see the next section), cross the placenta and protect her newborn. Their half-life is about 30 to 40 days, so the protection fades over the first two to three months [^16]. Infusions of antibodies made outside the body can protect against some infections in the same way [^16]. Borrowed antibodies give immediate protection but no memory, because the recipient's own lymphocytes never went through selection. The same holds for antibody drugs, which usually have to be given repeatedly (Chapter 9).
:::

## Antibodies: one molecule, four jobs

An antibody is a B-cell receptor that a plasma cell secretes into the blood and tissue fluid. The two identical arms of the Y are its {{fab|Fab arms}} (Fab stands for "fragment, antigen-binding"), and each carries an antigen-binding site for the epitope, so one antibody can bind two copies of its target at once. This is the {{avidity|avidity}} of Chapter 1: when one arm dissociates from the target, the other is still bound, so a two-armed antibody binds far more strongly than either arm alone. IgM, an early-response antibody built from five Ys with ten antigen-binding sites, depends on this most: each site binds with low affinity, but the ten together bind strongly. The stem of the Y, formed by the lower parts of the two heavy chains' constant regions, is the {{fc-region|Fc region}}, and it is essentially the same in every antibody of a given class or subclass, whatever the Fab arms bind. **The variable regions determine what the antibody binds; the Fc region determines what the rest of the immune system does about it.**

Antibodies come in five {{antibody-class|classes}}, or isotypes (IgG, IgA, IgM, IgE and IgD), which share the same kind of variable regions but differ in the constant regions of their heavy chains, and so in their Fc regions. An activated B cell can change the class of antibody it makes, for example from IgM to IgG, while keeping the same variable regions, a process called {{class-switching|class switching}}. IgG, the most common in blood, is the basis of most antibody drugs, and its four subclasses recruit the rest of the immune system with different strength, which drug designers exploit (Chapters 8 and 9).

:::deep-dive Affinity maturation and class switching
Unlike T cells, B cells keep changing their receptors after selection. Activated B cells with help from a specialized kind of helper T cell gather in temporary structures inside lymph nodes and the spleen called {{germinal-center|germinal centers}} [^21].

There, an enzyme called AID drives somatic hypermutation, introducing mutations into the DNA encoding the antibody's variable regions. Most mutations lower the receptor's affinity or make no difference, and a few raise it. B cells whose receptors bind more tightly capture more antigen, present more of it to helper T cells and receive more survival signals; the rest die. Repeated rounds of mutation and selection gradually raise the antibodies' affinity [^21]. This {{affinity-maturation|affinity maturation}} is Darwinian selection inside a single lymph node, over a period of weeks.

Dependence on help also helps stop this process from producing self-reactive B cells. A B cell whose mutated receptor now prefers one of the body's own proteins to the foreign antigen collects too little of that antigen to present to its helper, and loses its survival signal [^32].

AID also initiates class switching. The B cell cuts out the stretch of DNA holding its current heavy-chain constant-region gene, which brings a different constant-region gene next to its variable-region gene. The antibody changes class, for example from IgM to IgG, IgA or IgE, while its variable regions, and so what it binds, stay exactly the same.

Each class has its own functions, set by its Fc region [^33]. IgM, the early-response antibody, is good at triggering complement. IgG, the main antibody of blood and tissues, recruits phagocytes and NK cells, and it is the class that crosses the placenta. IgA acts at the body's linings: it is exported across the walls of the gut and airways and into breast milk, it is made by most of the gut wall's plasma cells (Chapter 1), and it works mainly by neutralizing rather than by triggering complement [^33][^34]. IgE binds to {{mast-cell|mast cells}}, preparing them to respond to parasitic worms, and is the antibody behind allergies. What IgD does is still unclear.

Which class a B cell switches to is determined largely by {{cytokine|cytokines}}, signaling proteins released by its helper T cell and other nearby cells [^35]. The helper T cells that respond to worms (Chapter 5) push B cells toward IgE, while signals common in the gut lining push them toward IgA. As a result, the antibody's class, and so its Fc region, tends to suit both the threat and the location.

The B cells selected in the germinal center become long-lived plasma cells and memory B cells [^21], which is one reason a second response produces higher-affinity antibodies than the first. A T cell's receptor, by contrast, never mutates after the cell leaves the thymus. That limitation matters in Chapter 10, where T-cell receptors are redesigned in the lab.
:::

Antibodies do four main jobs [^19]:

1. **{{neutralization|Neutralization}}.** By coating the proteins a virus uses to attach to cells, or the active part of a toxin, antibodies block them. This is the only one of the four jobs that antibodies do on their own.
2. **{{opsonization|Opsonization}}.** Phagocytes such as macrophages and neutrophils (Chapter 2) carry {{fc-receptor|Fc receptors}} that bind the Fc region of antibodies. A microbe coated in antibodies, Fc regions pointing outward, becomes far easier for them to bind and engulf (phagocytosis).
3. **Complement activation.** Antibodies clustered on a surface trigger the {{complement|complement}} cascade from Chapter 2: blood proteins that coat the target, opsonizing it, and can form pores in bacterial membranes.
4. **Antibody-dependent cellular cytotoxicity ({{adcc|ADCC}}).** {{nk-cell|Natural killer (NK) cells}} also carry Fc receptors. When they bind the Fc regions of antibodies attached to an infected cell, they kill it.

In the last three jobs, the antibody acts as an adapter, connecting a specific target to a general-purpose way of destroying it.

:::figure ch03-antibody
title: One molecule, four jobs
goal: After using this, the reader can point to an antibody's variable tips and its constant Fc stem, explain that the tips bind a specific epitope while the stem recruits other immune players, and describe neutralization, opsonization, complement activation and ADCC.
kind: explorer
stage: dark
spec: |
  PURPOSE: an explorer with five modes. Each "job" mode is a short animated scene that first shows the problem without antibodies, then lets the reader add antibodies, so the reader sees exactly what the antibody adds.

  CONTROLS: a segmented control across the top: "Anatomy" | "Block" | "Flag for eating" | "Complement" | "Recruit NK cells". In each job mode: the scene starts in the "Without antibodies" state and plays once; then a prominent button "Add antibodies" replays the scene with antibodies. After that, a two-state toggle "Without / With antibodies" and a Replay button let the reader compare. On phones the segmented control becomes horizontally scrollable chips.

  GLOBAL VISUAL RULES:
  - Antibodies are the art library's `antibody()` (shared with ch09-humanization): natural antibodies are gold with NO white outline (the outline marks drug antibodies). Variable tips are highlighted with a brighter glow AND a distinct notched outline; the Fc stem is plain gold with a subtle darker tone. Never rely on glow alone; label tips and stem (1–4 words in the SVG) on first appearance in every mode.
  - Target proteins on cell surfaces use art `antigen()` on a stalk (generic target = circle). Complement proteins and the pore are single-use props drawn locally from palette tokens.
  - Relative sizes (not to scale, but keep the ORDER; stage tag "Not to scale"): antibody (≈10–15 nm) < virus (≈100 nm) < bacterium (≈1–2 µm) < human cells (≈10–20 µm). Draw antibodies small relative to cells (a cell should have room for dozens of antibodies on its surface).
  - Antibody tips always bind the target; the stem always points away from the target, toward the recruited cell or protein.

  MODE 1 — ANATOMY: one large IgG centered. Show the four chains: two heavy chains (deeper gold) running from tip to the bottom of the stem, two light chains (paler gold) along the outer side of each arm. The hinge (where arms meet stem) is flexible: animate a slow, gentle swivel of the arms (±15–20°). Interactive hotspots (hover/tap, keyboard focusable) whose text opens in the shared infoCard:
    • "Variable tips — built by gene shuffling; both tips are identical and grab the same epitope. With two arms, one can let go while the other holds, so the antibody grips far harder than either arm alone (avidity, Chapter 1)."
    • "Hinge — flexible, lets the arms reach targets at different distances."
    • "Fc stem — essentially the same in every antibody of a given class or subclass; it is the handle that other immune cells and proteins grab."
    • "Heavy and light chains — two of each; each arm has one light chain and part of one heavy chain."
  No antibody-class chips.

  MODE 2 — BLOCK (neutralization): a sand-colored body cell (#E9C9A1) on the right with small receptor "docks" on its membrane; red-coral virus particles (#FF4D5E) drift in from the left. WITHOUT antibodies: a virus attaches its spike to a dock and sinks into the cell (entry animation). WITH antibodies: antibodies bind the spikes by their tips; coated viruses bump against the cell but cannot dock and drift away.

  MODE 3 — FLAG FOR EATING (opsonization): a chartreuse bacterium (#B5D94A) and a large coral macrophage (#FF7A6B, amoeboid, ruffled edge) with small cup-shaped Fc receptors on its membrane. WITHOUT antibodies: the macrophage's edge touches the bacterium, slips, and engulfment is slow or partial. WITH antibodies: the bacterium is coated with antibodies (tips on bacterium, stems outward); the macrophage's Fc-receptor cups grab the stems, the membrane wraps around, and the bacterium (with its antibody coat) is engulfed into a vacuole.

  MODE 4 — COMPLEMENT: an antibody-coated bacterium drawn as a rod with a thin outer envelope (complement pores work best on this kind of bacterium); small pale-lilac complement protein dots drifting in the fluid, labeled simply "complement proteins". The first complement proteins bind only where several antibody stems are CLUSTERED close together (not on a lone antibody). This triggers a cascade: more complement dots deposit on the bacterial surface (tagging), then a ring-shaped pore assembles in the bacterial membrane; the bacterium leaks (tiny particles escape) and collapses. WITHOUT antibodies: complement dots drift past with little binding.

  MODE 5 — RECRUIT NK CELLS (ADCC): a target cell, by default a virus-infected body cell (sand, with small red-coral viral proteins studding its surface). An orange NK cell (#FF8A3D, round, visible granules) approaches. WITHOUT antibodies: the NK cell touches the target and moves on. WITH antibodies: antibodies bind the viral proteins on the target; the NK cell's Fc receptors (small cups) grab the stems; then the book's shared kill grammar (`cell-actions.kill`, in orange): the NK cell docks and flattens, its granules slide to the contact zone, the target dies by `setDying` (shrink, blebs, fragments) and the NK cell detaches intact. Nothing flashes. A small secondary toggle "Target: infected cell / cancer cell" swaps the target to a violet-magenta cancer cell (art `cancerCell`, #B65FD8, with a circle `antigen()` on a stalk), same mechanics; in this mode the antibodies are drawn as drug antibodies (`antibody({ variant:'therapeutic' })`, white outline), with the caption note "Several antibody drugs against cancer rely partly on this route (Chapter 9)."

  SCIENTIFIC CONSTRAINTS:
  - Antibodies never cross into cells on their own (in mode 3 they are swallowed together with the bacterium).
  - Antibodies themselves do not kill in modes 3–5; they connect the target to the killer (macrophage, complement, NK cell).
  - Fc receptors bind the stem (Fc), never the tips.
  - Complement starts on clustered antibodies on a surface, not on free-floating single antibodies.
  - NK-cell killing is by released granules leading to the target's self-destruction, not by engulfing it.
  MOBILE: portrait stage; target on top, recruited cell below (vertical layout) so scenes read top-to-bottom; hotspot texts use the shared infoCard (an inline panel under the stage on phones).
  REDUCED MOTION: each job shows a two-panel before/after still for both states.
steps:
  1. Anatomy: the two identical Fab arms end in variable regions, shaped by gene rearrangement, that bind one specific epitope. The stem, the Fc region, is built from constant regions; Fc receptors and complement proteins bind it.
  2. Block (neutralization): antibodies coat the proteins a virus uses to attach to cells. A coated virus can bump into a cell but cannot get in.
  3. Mark for engulfment (opsonization): a microbe coated in antibodies, Fc regions facing out, is easy for a macrophage to bind with its Fc receptors and engulf.
  4. Complement: where antibodies cluster on a bacterium, complement proteins in the blood bind, coat the target and can form pores in its membrane.
  5. Recruit NK cells (ADCC): antibodies bound to an infected cell let an NK cell bind their Fc regions and trigger apoptosis in the target. Several antibody drugs against cancer rely partly on this route.
alt: An interactive antibody. In anatomy mode, a Y-shaped molecule shows two identical arms whose variable regions bind a specific target, and a stem called the Fc region. Four animated scenes compare what happens without and with antibodies: viruses blocked from entering a cell; a bacterium coated with antibodies and engulfed by a macrophage; complement proteins forming a pore in an antibody-coated bacterium; and a natural killer cell binding the Fc regions of antibodies on an infected or cancer cell and killing it.
:::

:::clinic
Most antibody drugs in Chapters 8 and 9 are built on this design. A {{monoclonal-antibody|monoclonal antibody}} is a single kind of antibody, mass-produced; the name comes from the first ones, which were made by a single clone of antibody-making cells, and it is why the generic names of most antibody drugs approved so far end in "-mab". The variable regions are chosen to bind one target, often a protein on a cancer cell. The Fc region may recruit NK cells, macrophages or complement; other antibody drugs block a signal the cancer needs, or a brake on T cells (Chapter 8).
:::

## The price of randomness

A process that can produce a receptor for almost any shape will also produce receptors for *your own* molecules — your insulin, the sheaths around your nerves, your DNA — and often does. When researchers isolated and tested antibodies from very young human B cells, still in the bone marrow, 55 to 75% of them reacted with the body's own molecules. Most of these self-reactive cells were removed at two quality-control steps before the B cells matured, yet about one in five mature B cells still reacted [^20].

A second safeguard usually keeps those cells inactive. To make strong, lasting antibodies, a B cell needs a go-ahead from a helper T cell that recognizes part of the same target, and helpers that react to the body's own proteins are mostly removed in the thymus (Chapter 5) [^32].

The body's ability to leave its own tissues alone is called {{tolerance|tolerance}}. When it fails, the result is {{autoimmunity|autoimmune disease}}, such as type 1 diabetes or lupus.

For cancer, this safety system is a problem. A cancer cell is built from the body's own molecules, so the same rules that stop lymphocytes from attacking your organs also make cancer hard to recognize.

## What T cells see

T cells rearrange their receptor genes the same way and go through the same selection, expansion and memory, but their receptor recognizes a different kind of target. Antibodies bind intact shapes, and only on the outside of things. A typical T-cell receptor cannot bind a free-floating virus, toxin or chemical at all. It recognizes short fragments of proteins, called {{peptide|peptides}}, that cells display on their surface in {{mhc|MHC molecules}}, such as the class I "shop window" of Chapter 2. Each T cell carries one receptor specificity and responds only to displayed fragments that match it.

Because MHC molecules display pieces of the proteins a cell is making *inside*, T cells can detect what is happening within a cell: whether it is infected, or turning cancerous. Chapter 4 explains how a cell puts samples of its contents on display, and how one rare T cell finds, among billions of cells, the display that matches its receptor.

:::quiz
Q: Where does the enormous variety of antibody and T-cell receptors come from?
- [ ] Each receptor has its own inherited gene, one for every possible threat — the genome has fewer than 20,000 protein-coding genes, far too few for millions of receptors.
- [ ] The invader molds each new receptor around itself, and the receptor sets in that shape — that was Pauling's 1940 template idea, and it turned out to be wrong.
- [x] Young lymphocytes join random gene segments and edit the junctions — segment choice times junctional edits gives 10¹⁵ or more possibilities.
- [ ] Mutations pile up in every body cell, lymphocytes included, over a lifetime — gene-segment rearrangement happens only in young lymphocytes, using the RAG enzymes.

Q: About 10¹⁵ T-cell receptors are possible, but one person holds far fewer. Why can that smaller library still catch a pathogen it has never met?
- [ ] The library is rebuilt around each new pathogen within the first few days — receptors are made in advance; the pathogen only selects among them.
- [x] Each receptor fits many related shapes, and each pathogen offers many patches — so some cell is likely to fit well enough.
- [ ] Every possible receptor is present somewhere, just in very small numbers — one T cell for each would weigh about 500 kilograms.
- [ ] Innate immunity covers any microbe that the receptor library happens to miss — innate cells help, but they cannot supply pathogen-specific receptors.

Q: You were vaccinated against a virus years ago and now meet the real thing. Why do you usually stay well?
- [ ] The vaccine reshaped your lymphocytes' receptors to fit the virus exactly — vaccines select cells that already fit; they never reshape receptors.
- [x] It left a large pool of memory cells, so antibody levels rise within days — this secondary response often clears the virus before you feel ill.
- [ ] Antibodies made after the vaccine stay at their peak level for the rest of your life — levels fall after the first weeks; memory cells and long-lived plasma cells do the lasting work.
- [ ] Your innate immune system memorized the virus and attacks it on sight — innate immunity lacks this kind of virus-specific memory.

Q: An antibody drug's variable regions bind a protein on cancer cells, and it works mainly by recruiting NK cells. Which part of the antibody do the NK cells bind?
- [ ] The variable regions — they are already bound to the protein on the cancer cell.
- [x] The Fc region — NK cells' Fc receptors bind it and trigger killing (ADCC).
- [ ] The hinge — it lets the Fab arms flex; Fc receptors bind mainly the Fc region below it.
- [ ] The cancer protein itself — then the drug would add nothing; the NK cell needs the antibody's Fc region to bind.
:::

:::takeaways
- Your genome cannot hold a gene for every threat, so each young lymphocyte builds its receptor by randomly joining V, D and J gene segments and editing the junctions (V(D)J recombination).
- As a rule, each B or T cell carries one kind of receptor. Together they form a random sample: at least 100 million (10⁸) different T-cell receptors per person by sequencing-based estimates, perhaps 10¹⁰ by one model, out of 10¹⁵ or more possible. It works because each receptor fits many related shapes.
- A pathogen selects the rare cells that already fit it (clonal selection). Those cells multiply into millions of copies (clonal expansion); most die once the infection is cleared, leaving a larger pool of memory cells.
- Antibodies are secreted B-cell receptors. The variable regions at the ends of the two Fab arms bind a specific epitope, and the Fc region recruits the rest of the immune system. Their four jobs are neutralization, opsonization, complement activation and ADCC. During a response, somatic hypermutation followed by selection raises their affinity, and class switching changes their class.
- Memory makes the second response faster and stronger: there are more matching cells, each easier to activate, and some are already stationed where the pathogen entered. Vaccines provide the first encounter without the disease.
- Randomness inevitably creates self-reactive receptors, so the body must enforce tolerance. T cells read protein fragments displayed on MHC rather than whole shapes, which lets them detect what is happening inside cells.
:::

## Glossary
- antibody | Antibody | A Y-shaped protein made by B cells; the secreted form of the B-cell receptor. Its two identical Fab arms bind a specific epitope with their variable regions, and its stem, the Fc region, is bound by Fc receptors and complement proteins.
- innate-immunity | Innate immunity | The fast, built-in branch of the immune system that recognizes broad danger patterns using receptors encoded directly in the genome; it does not learn or form specific memory.
- adaptive-immunity | Adaptive immunity | The branch of the immune system, run by B and T cells, that answers each invader with receptors that match it, multiplies the cells that fit, and remembers the invader afterward.
- lymphocyte | Lymphocyte | A small, round white blood cell. B cells and T cells are the lymphocytes of adaptive immunity; NK cells are innate lymphocytes.
- lymph-node | Lymph node | A bean-sized organ where immune cells gather and where pieces of microbes from nearby tissues are brought, so rare matching lymphocytes can find them.
- spleen | Spleen | An organ in the upper left abdomen that filters blood and hosts many lymphocytes; it plays for the blood the role lymph nodes play for tissues.
- t-cell | T cell | A lymphocyte that matures in the thymus and carries one kind of T-cell receptor; T cells kill infected or abnormal cells and coordinate other immune cells.
- thymus | Thymus | A small organ behind the breastbone where T cells develop and are tested before release.
- b-cell | B cell | A lymphocyte that carries one kind of antibody on its surface as a receptor and can become an antibody-secreting plasma cell. Named for the bursa of Fabricius, the bird organ where B cells were discovered; in humans they mature in the bone marrow.
- bone-marrow | Bone marrow | The soft tissue inside bones where blood cells, including B cells, are made; also home to long-lived plasma cells.
- bcr | B-cell receptor (BCR) | An antibody anchored in a B cell's membrane; each B cell carries many copies of one kind.
- tcr | T-cell receptor (TCR) | The receptor on a T cell, built by the same V(D)J recombination as antibodies; it recognizes protein fragments displayed on MHC molecules and is never released from the cell.
- antigen | Antigen | Anything that a B-cell or T-cell receptor can recognize, such as part of a virus, a toxin or a protein from a cancer cell.
- epitope | Epitope | The exact small patch on an antigen that a particular receptor or antibody binds.
- heavy-chain | Heavy chain | The longer of the two kinds of protein chain in an antibody. Each antibody has two identical heavy chains; their variable regions are assembled from V, D and J segments, and their constant regions set the antibody's class, with their lower parts forming the Fc region.
- light-chain | Light chain | The shorter of the two kinds of protein chain in an antibody. Each antibody has two identical light chains, whose variable regions are assembled from V and J segments.
- variable-region | Variable region | The part of an antibody or T-cell receptor chain whose amino-acid sequence differs from one receptor to the next, encoded by rearranged V, (D) and J gene segments. At the end of each antibody arm, the variable regions of one heavy and one light chain together form the antigen-binding site.
- constant-region | Constant region | The part of an antibody chain that comes in only a few standard versions and does not bind the target. The heavy chain's constant region sets the antibody's class (IgG, IgA and so on), and the lower parts of the two heavy chains' constant regions form the Fc region.
- gene-segment | Gene segment | One of many alternative pieces of DNA (V, D or J) that lymphocytes cut and join to build a complete receptor gene.
- rag | RAG1 and RAG2 | The pair of enzymes, active only in developing lymphocytes, that cut DNA so that V, D and J gene segments can be joined.
- vdj-recombination | V(D)J recombination | The process by which a developing lymphocyte cuts its DNA and joins one V, (one D) and one J gene segment, creating a new receptor gene.
- junctional-diversity | Junctional diversity | Extra variety created at the junctions of V(D)J recombination, where a few nucleotides are trimmed away and random nucleotides are added.
- repertoire | Repertoire | The full set of different receptors carried by one person's B cells or T cells.
- cross-reactivity | Cross-reactivity | The ability of a receptor or antibody to bind molecules that resemble its intended target, usually more weakly.
- avidity | Avidity | The overall binding strength of a molecule that binds its target at several sites at once, such as a two-armed antibody. It can be far greater than the affinity of any single site.
- dendritic-cell | Dendritic cell | A branching immune cell that samples the tissue around it and carries what it collects to a lymph node, where it presents fragments to T cells.
- cdr3 | CDR3 | The most variable loop of an antibody or T-cell receptor, created at the V(D)J junctions and sitting at the center of the antigen-binding site.
- clonal-selection | Clonal selection | The principle that an antigen activates only the pre-existing lymphocytes whose receptors already fit it, which then multiply.
- clone | Clone | A family of cells descended from a single ancestor cell; in immunology, all cells sharing the same receptor (B-cell clones later diversify slightly by mutation).
- naive-lymphocyte | Naive lymphocyte | A B or T cell that has never yet encountered the antigen its receptor fits.
- clonal-expansion | Clonal expansion | The rapid, repeated division of selected lymphocytes, producing thousands to millions of identical copies.
- effector-cell | Effector cell | An activated lymphocyte that does the immune work, such as a killer T cell or an antibody-secreting plasma cell.
- plasma-cell | Plasma cell | A B cell specialized to secrete large amounts of one antibody; some live for decades in the bone marrow.
- apoptosis | Apoptosis | Programmed cell death, an orderly process in which a cell dismantles itself without spilling its contents.
- memory-cell | Memory cell | A long-lived B or T cell left behind after an immune response, ready to respond faster and more strongly to the same antigen.
- primary-response | Primary response | The first adaptive response to an antigen; slow, because rare matching cells must be found and multiplied, typically taking one to two weeks.
- secondary-response | Secondary response | A repeat response to an antigen seen before; faster and larger, with higher-affinity antibodies, because memory cells give it a head start.
- vaccine | Vaccine | A harmless version or piece of a pathogen (or instructions to make one) that trains the adaptive immune system and leaves memory, without causing the disease.
- fab | Fab arm | Either of the two identical arms of an antibody's Y (Fab stands for "fragment, antigen-binding"). Each is made of one light chain and part of one heavy chain, and carries one antigen-binding site, formed by their variable regions, at its end.
- fc-region | Fc region | The stem of an antibody's Y, formed by the lower parts of its two heavy chains' constant regions (Fc stands for "fragment, crystallizable"). It does not bind the target; Fc receptors and complement proteins bind it, which determines how the immune system responds. It is essentially the same within each antibody class or subclass.
- antibody-class | Antibody class (isotype) | One of five antibody types (IgG, IgA, IgM, IgE, IgD), set by the heavy chain's constant region. Classes share the same kind of variable regions but have different Fc regions and therefore different jobs.
- neutralization | Neutralization | Blocking a pathogen or toxin directly, by covering the parts it needs to attach to or damage cells.
- opsonization | Opsonization | Coating a microbe with antibodies or complement proteins so that phagocytes can bind and engulf it more easily.
- fc-receptor | Fc receptor | A receptor on immune cells such as macrophages, neutrophils and NK cells that binds the Fc region of antibodies bound to a target.
- complement | Complement | A set of blood proteins that, once triggered, coat microbes so phagocytes engulf them (opsonization) and can form pores in their membranes.
- adcc | ADCC (antibody-dependent cellular cytotoxicity) | Killing of an antibody-coated cell by an immune cell, usually an NK cell, that binds the antibodies' Fc regions with its Fc receptors.
- nk-cell | NK (natural killer) cell | An innate lymphocyte that kills stressed, infected or cancerous cells; antibodies can also direct it to targets.
- monoclonal-antibody | Monoclonal antibody | Many identical copies of a single kind of antibody, made in the laboratory or at industrial scale; the basis of antibody drugs.
- tolerance | Tolerance | The immune system's learned restraint toward the body's own molecules, enforced by removing or silencing self-reactive lymphocytes.
- autoimmunity | Autoimmunity | An immune attack on the body's own tissues, caused by a failure of tolerance.
- peptide | Peptide | A short chain of amino acids, for example a fragment cut from a larger protein.
- mhc | MHC (major histocompatibility complex) molecule | A molecule on the surface of cells that displays protein fragments (peptides) for T cells to inspect.
- germinal-center | Germinal center | A temporary structure that forms in lymph nodes and the spleen during an immune response, where B cells mutate their antibody genes and compete to be selected.
- somatic-hypermutation | Somatic hypermutation | Targeted mutation of the DNA encoding antibody variable regions in activated B cells, creating variants that are then selected for higher affinity.
- affinity-maturation | Affinity maturation | The gradual improvement in how tightly antibodies bind their target during an immune response, through rounds of mutation and selection.
- class-switching | Class switching | A DNA change in an activated B cell that joins its variable-region gene to a different heavy-chain constant-region gene, changing the antibody's class (for example from IgM to IgG) and its Fc region without changing what it binds.
- chromosome | Chromosome | One of the long DNA molecules, wrapped around packaging proteins, into which a genome is divided. Most human cells carry 46, half from each parent.
- mast-cell | Mast cell | A tissue-resident immune cell packed with granules of histamine and other chemicals that it releases within minutes of injury or infection.
- cytokine | Cytokine | A small signaling protein that cells, especially immune cells, release to signal to one another: to call for help, multiply, attack, move or calm down. Interferons and interleukins are examples.

## Sources
1. Landsteiner K, van der Scheer J. Serological differentiation of steric isomers. *J Exp Med* 1928;48(3):315–320. doi:10.1084/jem.48.3.315
2. Long QX, Liu BZ, Deng HJ, et al. Antibody responses to SARS-CoV-2 in patients with COVID-19. *Nat Med* 2020;26(6):845–848. doi:10.1038/s41591-020-0897-1
3. Krammer F, Smith GJD, Fouchier RAM, et al. Influenza. *Nat Rev Dis Primers* 2018;4(1):3. doi:10.1038/s41572-018-0002-y
4. Amaral P, Carbonell-Sala S, De La Vega FM, et al. The status of the human gene catalogue. *Nature* 2023;622(7981):41–47. doi:10.1038/s41586-023-06490-x
5. Pauling L. A theory of the structure and process of formation of antibodies. *J Am Chem Soc* 1940;62(10):2643–2657. doi:10.1021/ja01867a018
6. Hozumi N, Tonegawa S. Evidence for somatic rearrangement of immunoglobulin genes coding for variable and constant regions. *Proc Natl Acad Sci USA* 1976;73(10):3628–3632. doi:10.1073/pnas.73.10.3628
7. IMGT, the international ImMunoGeneTics information system. IMGT Repertoire: locus descriptions for human IGH, IGK and IGL (functional V, D and J gene counts). https://www.imgt.org (accessed October 2026). See also: Lefranc MP. Immunoglobulin and T cell receptor genes: IMGT and the birth and rise of immunoinformatics. *Front Immunol* 2014;5:22. doi:10.3389/fimmu.2014.00022
8. Roth DB. V(D)J recombination: mechanism, errors, and fidelity. *Microbiol Spectr* 2014;2(6):MDNA3-0041-2014. doi:10.1128/microbiolspec.MDNA3-0041-2014
9. Lythe G, Callard RE, Hoare RL, Molina-París C. How many TCR clonotypes does a body maintain? *J Theor Biol* 2016;389:214–224. doi:10.1016/j.jtbi.2015.10.016
10. Briney B, Inderbitzin A, Joyce C, Burton DR. Commonality despite exceptional diversity in the baseline human antibody repertoire. *Nature* 2019;566(7744):393–397. doi:10.1038/s41586-019-0879-y
11. Qi Q, Liu Y, Cheng Y, et al. Diversity and clonal selection in the human T-cell repertoire. *Proc Natl Acad Sci USA* 2014;111(36):13139–13144. doi:10.1073/pnas.1409155111
12. Wooldridge L, Ekeruche-Makinde J, van den Berg HA, et al. A single autoimmune T cell receptor recognizes more than a million different peptides. *J Biol Chem* 2012;287(2):1168–1177. doi:10.1074/jbc.M111.289488
13. Blattman JN, Antia R, Sourdive DJD, et al. Estimating the precursor frequency of naive antigen-specific CD8 T cells. *J Exp Med* 2002;195(5):657–664. doi:10.1084/jem.20001021
14. Moon JJ, Chu HH, Pepper M, McSorley SJ, Jameson SC, Kedl RM, Jenkins MK. Naive CD4(+) T cell frequency varies for different epitopes and predicts repertoire diversity and response magnitude. *Immunity* 2007;27(2):203–213. doi:10.1016/j.immuni.2007.07.007
15. Burnet FM. A modification of Jerne's theory of antibody production using the concept of clonal selection. *Aust J Sci* 1957;20:67–69. Reprinted in *CA Cancer J Clin* 1976;26(2):119–121. doi:10.3322/canjclin.26.2.119
16. Pollard AJ, Bijker EM. A guide to vaccinology: from basic principles to new developments. *Nat Rev Immunol* 2021;21(2):83–100. doi:10.1038/s41577-020-00479-7
17. Panum PL. Iagttagelser, anstillede under Maeslinge-Epidemien paa Færøerne i Aaret 1846. *Bibliothek for Læger* (Copenhagen) 1847;3R(1):270–344. English translation: Observations made during the epidemic of measles on the Faroe Islands in the year 1846. New York: Delta Omega Society, distributed by the American Public Health Association; 1940.
18. Amanna IJ, Carlson NE, Slifka MK. Duration of humoral immunity to common viral and vaccine antigens. *N Engl J Med* 2007;357(19):1903–1915. doi:10.1056/NEJMoa066092
19. Lu LL, Suscovich TJ, Fortune SM, Alter G. Beyond binding: antibody effector functions in infectious diseases. *Nat Rev Immunol* 2018;18(1):46–61. doi:10.1038/nri.2017.106
20. Wardemann H, Yurasov S, Schaefer A, Young JW, Meffre E, Nussenzweig MC. Predominant autoantibody production by early human B cell precursors. *Science* 2003;301(5638):1374–1377. doi:10.1126/science.1086907
21. Victora GD, Nussenzweig MC. Germinal centers. *Annu Rev Immunol* 2022;40:413–442. doi:10.1146/annurev-immunol-120419-022408
22. London CA, Lodge MP, Abbas AK. Functional responses and costimulator dependence of memory CD4+ T cells. *J Immunol* 2000;164(1):265–272. doi:10.4049/jimmunol.164.1.265
23. Veiga-Fernandes H, Walter U, Bourgeois C, McLean A, Rocha B. Response of naïve and memory CD8+ T cells to antigen stimulation in vivo. *Nat Immunol* 2000;1(1):47–53. doi:10.1038/76907
24. Masopust D, Soerens AG. Tissue-resident T cells and other resident leukocytes. *Annu Rev Immunol* 2019;37:521–546. doi:10.1146/annurev-immunol-042617-053214
25. Phan TG, Paus D, Chan TD, et al. High affinity germinal center B cells are actively selected into the plasma cell compartment. *J Exp Med* 2006;203(11):2419–2424. doi:10.1084/jem.20061254
26. Purtha WE, Tedder TF, Johnson S, Bhattacharya D, Diamond MS. Memory B cells, but not long-lived plasma cells, possess antigen specificities for viral escape mutants. *J Exp Med* 2011;208(13):2599–2606. doi:10.1084/jem.20110740
27. Sallusto F, Lenig D, Förster R, Lipp M, Lanzavecchia A. Two subsets of memory T lymphocytes with distinct homing potentials and effector functions. *Nature* 1999;401(6754):708–712. doi:10.1038/44385
28. Hammarlund E, Lewis MW, Hansen SG, et al. Duration of antiviral immunity after smallpox vaccination. *Nat Med* 2003;9(9):1131–1137. doi:10.1038/nm917
29. Akondy RS, Fitch M, Edupuganti S, et al. Origin and differentiation of human memory CD8 T cells after vaccination. *Nature* 2017;552(7685):362–367. doi:10.1038/nature24633
30. Ganesan AP, Clarke J, Wood O, et al. Tissue-resident memory features are linked to the magnitude of cytotoxic T cell responses in human lung cancer. *Nat Immunol* 2017;18(8):940–950. doi:10.1038/ni.3775
31. Savas P, Virassamy B, Ye C, et al. Single-cell profiling of breast cancer T cells reveals a tissue-resident memory subset associated with improved prognosis. *Nat Med* 2018;24(7):986–993. doi:10.1038/s41591-018-0078-7
32. Brink R, Phan TG. Self-reactive B cells in the germinal center reaction. *Annu Rev Immunol* 2018;36:339–357. doi:10.1146/annurev-immunol-051116-052510
33. Schroeder HW Jr, Cavacini L. Structure and function of immunoglobulins. *J Allergy Clin Immunol* 2010;125(2 Suppl 2):S41–S52. doi:10.1016/j.jaci.2009.09.046
34. Macpherson AJ, McCoy KD, Johansen FE, Brandtzaeg P. The immune geography of IgA induction and function. *Mucosal Immunol* 2008;1(1):11–22. doi:10.1038/mi.2007.6
35. Stavnezer J, Guikema JEJ, Schrader CE. Mechanism and regulation of class switch recombination. *Annu Rev Immunol* 2008;26:261–292. doi:10.1146/annurev.immunol.26.021607.090248
