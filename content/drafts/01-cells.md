---
id: 01-cells
title: Cells, Proteins and Molecular Recognition
subtitle: Cells, genes, proteins and molecular binding: the basic biology behind every act of immune recognition.
part: I
reading_time: 23
hero: ch01-hero
---

Somewhere between 1.5 and 2 trillion immune {{cell|cells}} are at work in your body.[^1] None of them has a brain or a list of targets, yet they leave alone the tens of trillions of cells that make up the rest of you and attack the few things that do not belong: a bacterium in a cut, a virus in your throat or, hardest to detect, one of your own cells that has turned cancerous.

Cells have no eyes; they recognize things by contact. Every act of recognition in the {{immune-system|immune system}} comes down to one molecule meeting another and either fitting it or not. That holds for a {{white-blood-cell|white blood cell}} detecting a microbe, for an {{antibody|antibody}} binding a virus, and for a modern {{cancer|cancer}} drug binding its target.

The central question of this chapter is **how anything in your body can recognize anything else**. Answering it needs some background: the sizes of cells and molecules, how a cell builds proteins from its genes, what it means for two molecules to bind, and the main types of immune cell.

## Seven powers of ten

The figure below starts at a hand and magnifies ten times at each step. Two steps in, the skin resolves into tightly packed cells, the smallest units of life: self-contained compartments of chemistry, each enclosed by a thin membrane.

:::figure ch01-scale
title: Seven powers of ten
goal: After using this, the reader has a felt sense of the size ladder (tissue → cell, ~10 µm → bacterium, ~1–2 µm → a typical virus, ~100 nm → antibody, ~10–15 nm → amino acid, under 1 nm) and understands that decisions made by whole immune cells rest on contacts between molecules a few nanometers across.
kind: explorer
stage: dark
spec: |
  CONCEPT. A "Powers of Ten" zoom. Cells and molecules come from the art library in canonical colors
  (redBloodCell, macrophage, tCell, antibody() with 12 domains); only the hand, fingerprint and skin
  slice are single-use props drawn locally. One continuous zoom parameter z runs from 0 to 7. The stage's
  width of view is 10 cm × 10^(−z). There are eight stops at whole-number z values: 10 cm, 1 cm,
  1 mm, 100 µm, 10 µm, 1 µm, 100 nm and 10 nm. Each stop has its own scene. Each scene contains a
  thin dashed square (1/10 of the view wide) marking where the next scene sits, so zooming feels
  continuous. Suggested technique: draw each scene k as its own SVG group scaled by 10^(z−k), and
  crossfade it in during the last ~30% of the approach. It should fade out about one step after you
  pass it. Raster textures are fine as long as they stay crisp at 2×.

  SCENES (labels in Inter, minimal, with thin leader lines). Within each scene, objects ARE drawn to
  scale relative to each other; only the label text is not to scale.
  0 · 10 cm: A hand silhouette in soft sand (#E9C9A1) line work on the dark stage. The dashed square
      sits on the index fingertip. Label: "Fingertip".
  1 · 1 cm: Fingertip skin surface with gently curving fingerprint ridges. Dashed square on a ridge.
  2 · 1 mm: The skin, sliced. Show layered epidermis: flattened cells near the top, rounder cells
      deeper, and a looping capillary beneath. Each cell is a sand polygon with a neat round nucleus.
      Draw cells at ~10–20 µm, so about 50–100 fit across the view (a fine mosaic). Dashed square on
      the dermis next to the capillary. Label: "Skin, in cross-section".
  3 · 100 µm: Individual cells (sand polygons, 10–20 µm, 5–10 across). A capillary carries red blood
      cells (library redBloodCell): biconcave discs 7–8 µm wide, NO nucleus. Between the tissue cells: a
      macrophage (coral #FF7A6B, ~18 µm, amoeboid with ruffled edges and a kidney-shaped nucleus) and a
      T cell (electric blue #4C8DFF, 7 µm, round, with fine microvilli fuzz and a large round nucleus
      that fills most of the cell). Labels: "red blood cells", "macrophage", "T cell", "body cells".
      Dashed square around the T cell and the edge of a neighboring body cell.
  4 · 10 µm: The T cell (7 µm) beside an E. coli rod (chartreuse #B5D94A, 2 µm × 1 µm, no nucleus;
      omit flagella, which in reality are longer than the cell). The edge of a sand body cell is on
      one side. A few virus particles near its membrane are tiny specks (100 nm = 1% of the view) and
      should be barely visible, which is the point. Labels: "T cell", "bacterium", "virus particles".
      Dashed square on the body-cell membrane where the specks are.
  5 · 1 µm: A curved stretch of body-cell membrane (sand) with 4–6 virus particles (red-coral
      #FF4D5E). Each is a sphere ~90–100 nm across, bounded by a thin fatty envelope drawn as a fine
      double line. Club-shaped spikes stand ~25 nm tall, about a quarter of the particle's diameter.
      They are irregularly spaced (nearest neighbors ~25 nm apart) and tilted at varying angles; for
      legibility, show only 6–10 around each outline (a stylized, sparse rendering). Two particles touch the membrane. Keep the styling
      generic and label "virus particles (~100 nm)". Dashed square on part of one particle.
  6 · 100 nm: Part of one virus particle. Its curved envelope crosses the lower part of the stage;
      the whole particle, ~90–100 nm plus spikes, is wider than this view. Show 3–4 spikes, each
      ~25 nm tall: a club-shaped head (~16 nm tall, ~13 nm wide) on a thin ~9 nm stalk, at varying
      tilts. 2–3 gold antibodies (library antibody(), natural: gold with NO white outline, which is
      reserved for drug antibodies), each ~14 nm across, bind spike heads BY THEIR ARM TIPS. Each
      antibody is a Y of 12 compact lumps (protein "domains"): 4 per arm and 4 in the stem, with a
      short flexible hinge where the arms meet the stem. An antibody is about 0.6× a spike's height. Label: "antibodies (~10–15 nm)". Dashed
      square around one antibody–spike contact.
  7 · 10 nm: Only the tip of one antibody arm (two compact domains, each a tight ball of ~110 small
      gold beads, ~0.5 nm each) pressed against the top of a spike head (also tightly packed beads,
      red-coral). The ~15–20 beads at the contact patch glow softly. Labels: "each bead = one amino
      acid (<1 nm)" and "the contact: where recognition happens".

  SCIENCE CONSTRAINTS (do not violate): bacteria, red blood cells and viruses have no nucleus. A
  lymphocyte's nucleus fills most of the cell. These viruses are enveloped (a membrane, not a hard
  shell) with sparse spikes. Antibodies bind with their arm tips, never the stem. Keep these
  ratios: an antibody is ~7× smaller than the virus diameter, a spike is ~1.5–2× an antibody's size,
  and a T cell is ~3–4× longer than E. coli. Proteins are compact folded lumps, never straight
  strings of beads. No faces or eyes anywhere.

  CONTROLS. A full-width horizontal slider under the stage with 8 ticks labeled with the stop widths.
  On release it snaps gently to the nearest stop, but any in-between value is allowed while dragging.
  "−" and "+" buttons at either end step one stop. Keyboard: Left/Right arrows step and Home/End jump.
  Do NOT capture the mouse wheel or pinch on the page. A "Take the tour" button animates z from its
  current value to 7 over ~10 s, pausing ~1.2 s at each stop; any user input stops the tour.

  READOUTS. Top-left of the stage: "Width of view: 100 µm" with a plain equivalent beneath ("a tenth
  of a millimeter"). Bottom-right: a scale bar of fixed pixel length whose label updates
  continuously (e.g. "20 µm").

  CAPTION. Below the stage, show the caption for the nearest stop (steps 1–8 below), in an aria-live
  polite region. Under it, add a small collapsed disclosure, closed by default: "What if a T cell
  were your height?" When open, it shows the comparison line for the current stop (text in data).

  MOBILE. Use a 4:5 portrait stage. The slider is full width; label only the 10 cm, 1 mm, 10 µm and
  100 nm ticks and leave the others unlabeled. Buttons are at least 44 px. Keep in-stage labels at
  least 13 px. Thin or drop labels at small sizes rather than shrinking them.

  REDUCED MOTION. The slider and buttons jump between stops with a short crossfade, with no
  continuous scaling animation. The tour is disabled.
steps:
  1. A hand. Each step magnifies ten times.
  2. A fingertip, showing the ridges of a fingerprint. Every part of it was built by cells.
  3. A speck of skin in cross-section: tightly packed layers of cells, with small blood vessels beneath.
  4. Individual cells, most of them 10–20 micrometers across. Red blood cells squeeze through a capillary, and two kinds of immune cell, a large macrophage and a small T cell, move through the tissue.
  5. A T cell, about 7 micrometers wide, beside a bacterium about 2 micrometers long. Bacteria are complete living cells, far smaller and simpler than ours. The faint specks are viruses.
  6. Viruses at a cell's surface. Each is about 100 nanometers across, so some seventy would fit across a T cell. A virus is not a cell but genetic material in a protein coat, here wrapped in a membrane envelope studded with spikes.
  7. Part of a single virus. Its spike proteins stand about 25 nanometers tall. Y-shaped antibodies, each about 10–15 nanometers across, have bound the spike heads with the binding sites at the tips of their arms.
  8. The tip of one antibody arm bound to the head of one spike. Each bead is a single amino acid, less than a nanometer wide, and the beads are packed into compact folded lumps. Recognition happens in this contact patch, a few nanometers across.
data: |
  Sizes used (all approximate; nature varies):
  - Typical human body cell: ~10–20 µm across [2]
  - Red blood cell: 7–8 µm diameter [2]
  - Resting lymphocyte (T cell): ~7 µm diameter [4]
  - Macrophage: ~15–20 µm; varies by tissue. Derived from [1]: ~600 g of macrophages / ~2×10^11 cells ≈ 3 ng per cell ≈ 2,800 µm³ ≈ 17–18 µm sphere.
  - E. coli: ~2 µm long × ~1 µm wide [2]
  - SARS-CoV-2 virion (enveloped): ~90 nm average envelope diameter (89.8 ± 13.7 nm); spikes ~25 nm tall measured from the envelope (trimer head ~16 nm tall and ~13 nm wide, on a ~9 nm stalk); nearest-neighbor spike spacing ~24 nm; on average ~48 spikes per virion (range 25–127) [5]. The scenes draw fewer spikes than this, for legibility.
  - IgG antibody: ~14.5 × 8.5 × 4 nm; antigen-binding tips ~13.7 nm apart [6]; ~1,300 amino acids folded into 12 domains of ~110 each [16]
  - Typical protein: 3–6 nm diameter [2]; one amino acid: well under 1 nm (~110 Da)
  "What if a T cell were your height?" (scale factor 1.7 m / 7 µm ≈ 240,000; arithmetic only):
  - stop 1–3: You would stand about 400 km tall, roughly the altitude at which the International Space Station orbits.
  - stop 4: A red blood cell would be about as wide as you are tall; a macrophage would be as tall as a giraffe (4–5 m).
  - stop 5: The bacterium would be the size of a house cat (~0.5 m).
  - stop 6: Each virus particle would be the size of a grape (~2.5 cm).
  - stop 7: Each antibody would be the size of a sesame seed (~3 mm).
  - stop 8: Each amino acid would be about the size of the finest grains of sand (~0.15 mm).
alt: An interactive zoom from a human hand down to single molecules, in eight steps of ten. It passes through fingerprint ridges, a slice of skin, individual cells about 10–20 micrometers wide, a 7-micrometer T cell beside a 2-micrometer bacterium, enveloped viruses about 100 nanometers wide with sparse spikes, Y-shaped antibodies 10–15 nanometers across bound to the spike heads, and finally the amino acids where an antibody's arm tip touches its target. A scale bar and captions give the size at each step.
:::

A typical human cell is 10 to 20 micrometers (µm, thousandths of a millimeter) across,[^2] and your body contains about 30 trillion of them, of many specialized kinds, organized into {{tissue|tissues}} such as muscle and skin.[^3] A resting {{lymphocyte|lymphocyte}}, the family of immune cells that includes {{t-cell|T cells}} and {{b-cell|B cells}}, is about 7 µm across;[^4] a bacterium such as *E. coli*, a complete but far simpler cell, is a rod about 2 µm long.[^2]

A virus is not a cell. It is a small amount of genetic material in a coat of {{protein|protein}} (proteins, described below, are the molecules that do most of the work in cells), often wrapped in an envelope of membrane taken from the last cell it left, and it can copy itself only inside a living cell, which it uses to build new virus particles. The coronavirus behind COVID-19 is roughly 90–100 nanometers (millionths of a millimeter) wide.[^5] An antibody, the Y-shaped molecule your immune system makes to bind specific targets, spans about 10–15 nm,[^6] and each of its building blocks, small molecules called {{amino-acid|amino acids}}, is well under one.

So an immune cell hundreds of times wider than an antibody decides whether to kill or spare another cell on the basis of contacts between molecules a few nanometers across.

:::deep-dive How many cells are you?
For decades, textbooks claimed that the bacteria living in and on you outnumber your own cells ten to one. In 2016, Ron Sender, Shai Fuchs and Ron Milo recounted both for a "reference" 70-kilogram man. They found about 30 trillion human cells and about 38 trillion bacteria, mostly in the colon: roughly one to one, with the bacteria weighing only about 0.2 kilograms in total.[^3]

Most of the human cells, about 25 trillion or some 84% of the total, are red blood cells,[^3] which are among the smallest cells in the body and carry no nucleus. Dividing the same group's 2023 count of 1.8 trillion immune cells by the 30-trillion total puts immune cells at roughly 6% of all your cells, about one in seventeen.[^1][^3]

These are figures for a standard adult, and they scale with body size: the 2023 study estimates that a 60-kilogram reference woman carries about 1.5 trillion immune cells, and a 10-year-old child about 1 trillion.[^1] Every such number is an estimate with error bars, built by multiplying measured cell densities by organ sizes, and is more likely to be refined than overturned.
:::

## Inside a cell

A cell is enclosed by its {{cell-membrane|cell membrane}}, which separates inside from outside. The membrane is a {{lipid-bilayer|lipid bilayer}}: two layers of fatty molecules, mostly phospholipids. Each phospholipid has a hydrophilic (water-attracting) head and two {{hydrophobic|hydrophobic}} (water-repelling) tails. In water, these molecules line up in a double sheet, with the tails pointing inward toward each other and the heads facing the water on either side. Proteins embedded in the membrane serve as channels, sensors and identity markers, and this surface is where the immune system does its recognizing.

The {{nucleus|nucleus}} holds the cell's DNA, its genetic information, and {{ribosome|ribosomes}} outside the nucleus build proteins from copies of its genes. Proteins do nearly every job in the cell, and a typical human cell holds billions of them.[^2]

Most of the molecules in a cell are not steered anywhere. Cells do move some large cargo along internal tracks, but the molecules that matter in this guide are pushed about by the constant random motion of the surrounding water. By this motion alone, a typical protein crosses the width of a human cell in about ten seconds.[^2]

Every act of recognition in this guide happens the same way: molecules meet at random and bind if they fit.

## Genes and how they are read

{{dna|DNA}} is a long molecule shaped like a twisted ladder, the double helix. Each side of the ladder is a strand built from units called {{nucleotide|nucleotides}}, and each nucleotide carries one of four bases: adenine, cytosine, guanine or thymine, written A, C, G and T. The bases of the two strands pair across the middle, A with T and C with G, to form the rungs. The order of the bases along a strand encodes information, as the order of letters does in a sentence.

Your full set of DNA, your {{genome|genome}}, runs to about 3 billion base pairs.[^7] Nearly every cell with a nucleus carries two copies, one from each parent. (Red blood cells, the most numerous cells of all, carry none.) Stretched out, the DNA in one such cell would be about two meters long.[^2]

Along the DNA lie {{gene|genes}}, stretches whose sequence of bases specifies how to build a particular protein. Humans have just under 20,000 of them.[^8]

The DNA stays in the nucleus. To make a protein, the cell copies the relevant gene into {{rna|RNA}}, a closely related molecule that uses the base uracil (U) in place of thymine (T). This short-lived copy, called {{mrna|messenger RNA (mRNA)}}, leaves the nucleus and travels to a ribosome.

The ribosome reads the mRNA three bases at a time. Each group of three, called a {{codon|codon}}, specifies one of 20 kinds of amino acid. The ribosome links the amino acids into a chain in the order the codons dictate, until it reaches a codon that means "stop." The finished chain is a protein. This whole process is called {{gene-expression|gene expression}}, and a cell that makes a particular protein is said to express it.

COVID-19 mRNA vaccines rely on this process: they deliver mRNA for a viral protein, and your own ribosomes make the protein. Chapter 11 applies the idea to cancer.

## Machines made of shape

A newly made protein is a floppy chain. Its amino acids differ in size, from small to bulky, and in their chemistry. Some are hydrophobic, like the tails of membrane lipids. Others are hydrophilic: either polar, with slight positive and negative charges on different atoms, or fully charged, positive or negative. Water molecules are themselves polar, so they surround the charged and polar amino acids and leave the hydrophobic ones to cluster together.

As the chain moves about in the watery cell, its hydrophobic amino acids pack into the interior and the charged ones stay on the surface, and the chain folds into a precise three-dimensional shape. The order of the amino acids determines the shape,[^9] and the shape determines the job.

**Proteins are machines made of shape.** {{enzyme|Enzymes}} have pockets that bind particular molecules and cut or join them. {{hemoglobin|Hemoglobin}}, which fills red blood cells, is shaped to pick up oxygen in the lungs and release it in the tissues. Antibodies are shaped to bind one particular target. {{receptor|Receptors}}, described below, are shaped to detect what is happening outside the cell.

Proteins are not rigid. They flex, and many change shape when something binds to them, which is how a signal can pass from the outside of a cell to the inside. When immunologists say a cell "senses" or "recognizes" something, they almost always mean that one of its proteins has bound it.

:::deep-dive How a chain finds its shape
In the late 1950s and early 1960s, the biochemist Christian Anfinsen unfolded a small enzyme, ribonuclease, with harsh chemicals, turning it into a limp, inactive chain. When he gently removed the chemicals, the chain refolded by itself and the enzyme worked again. The conclusion, that the information needed to fold a protein is contained in its amino-acid sequence, earned him a share of the 1972 Nobel Prize in Chemistry.[^9]

Cells do assist folding. Proteins called chaperones shelter some chains while they fold, and many proteins are trimmed, decorated with sugars or paired with partners after they are made. Misfolded proteins that clump together are a hallmark of several diseases, including Alzheimer's.

Knowing that sequence determines shape is not the same as predicting the shape from the sequence, and for half a century this "protein folding problem" defeated computers. In 2020–2021, the AI system AlphaFold began predicting many protein structures with accuracy close to that of laboratory methods.[^10] Such tools are now used across biology, including to model antibodies and immune receptors. Predicting exactly how two molecules will bind each other remains harder than predicting a single folded shape.
:::

## One letter can change everything

Because shape follows sequence, and sequence follows DNA, a change in a single DNA base, one kind of {{mutation|mutation}}, can alter an amino acid, a protein's shape, a cell's behavior and sometimes a person's health.

The classic example is hemoglobin, built from four protein chains: two "alpha" and two "beta." In 1957, the biochemist Vernon Ingram showed that the hemoglobin of people with sickle-cell disease differs from normal hemoglobin by a single amino acid.[^11] The difference is at position 6 of each beta chain, where glutamic acid, which carries a negative charge, is replaced by valine, which is hydrophobic. The cause is a change in a single DNA base that turns the codon GAG into GTG.

That hydrophobic patch sits on the protein's surface. When oxygen runs low, it lets hemoglobin molecules bind to their neighbors and stack into long, stiff fibers, which bend the red blood cell into a rigid crescent, or sickle.

The disease develops mainly in people who inherit the change from both parents. Their sickled cells break apart early and clog small blood vessels, causing anemia, severe pain and organ damage. Hundreds of thousands of babies are born with it each year, most of them in sub-Saharan Africa.[^12]

Most single-base changes have smaller effects. Some are silent, because several codons can specify the same amino acid, so the protein is unchanged. Others swap in a similar amino acid with little effect on the protein. What a base changes to matters as much as where it falls. At the sickle position itself, a different typo, GAG to AAG, puts in lysine, which is charged (positively, where glutamic acid is negative) rather than hydrophobic. The result, hemoglobin C, does not form sickle fibers, though it is less soluble than normal hemoglobin and can form crystals inside red cells. People with one copy have no symptoms, and those with two usually have only mild anemia.[^13] The figure below lets you make each of these changes.

:::figure ch01-gene-to-protein
title: From gene to protein
goal: After using this, the reader understands the flow DNA → mRNA → protein: the recipe is copied, read three letters at a time into amino acids, and folded into a working shape. They also see that a single-letter change can do nothing, swap one amino acid, or stop the protein short. The real sickle-cell change turns one charged amino acid into an oily one with dramatic consequences, while a different change at the same spot is far milder.
kind: stepper
stage: dark
spec: |
  REAL SEQUENCE. Use the true start of the human HBB gene (hemoglobin subunit beta; NCBI RefSeq
  NM_000518.5, coding sequence). Use the first 27 coding letters, i.e. 9 codons, on the DNA coding
  strand:
    ATG GTG CAT CTG ACT CCT GAG GAG AAG
    START Val His Leu Thr Pro Glu Glu Lys
  The mRNA reads identically with U for T: AUG GUG CAU CUG ACU CCU GAG GAG AAG.
  Numbering convention: label the ATG codon "START", not a number. Number the following codons 1–8
  (Val = 1 ... Lys = 8). This matches standard hemoglobin numbering, because the starting methionine
  is trimmed off as the chain is made. So the sickle position is codon "6", the first GAG.

  LAYOUT (desktop 16:9). Build the steps with ctx.ui.stepper; the last step unlocks the sandbox
  (guided, then free). A small "Skip to the sandbox" text link sits above the stage and jumps to
  step 6. "Not to scale" stage tag. Left 40% of the stage: the nucleus, a large softly glowing circle with a faint
  double-layered border and one visible pore. Inside it is a short DNA double helix, drawn as a
  flattened ladder for legibility: two backbones with letter-rungs. Right 60%: the cytoplasm, with a
  ribosome (two-lobed bean shape, warm gray-violet; not cell-coded). Across the bottom of the stage
  runs the SEQUENCE STRIP: 9 codon groups of 3 large monospace letter tiles (Inter Mono or similar,
  ≥18 px), with small gaps between codons. Under each codon is its amino-acid label (3-letter code),
  shown once it has been translated; hover or focus shows the full name (e.g. "valine"). Base
  colors: A, C, G and T/U each get a distinct muted hue AND the letter itself (never color alone).

  AMINO-ACID BEADS. Three visual classes, carried by color AND shape/glyph, with a 3-item legend on
  the stage:
    oily (G A V L I M F W P): round bead, warm amber-gray, no glyph
    charged (K R H positive; D E negative): round bead with a "+" glyph (blue) or a "−" glyph
      (red-orange)
    other (S T C Y N Q): rounded square, soft cyan
  (Histidine is only weakly charged in the body. Grouping it with the positives is an accepted
  simplification.)

  STEP STATES (Next/Back buttons plus a step dot indicator; each transition is a 1–2 s GSAP tween):
  1. DNA helix in the nucleus. The 27-letter segment is highlighted, and the strip shows the DNA
     letters. A label reads "HBB gene (beta-globin)".
  2. The helix unzips locally. An mRNA strand (single backbone, distinct color) grows letter by
     letter along the TEMPLATE strand. Complementary pairing: mRNA A pairs with DNA T, U with A, G
     with C, C with G. The resulting mRNA sequence equals the coding strand with U for T. The strip
     morphs T→U.
  3. The mRNA slides out through the nuclear pore to the ribosome in the cytoplasm. The DNA re-zips
     and stays in the nucleus.
  4. The ribosome clamps onto the mRNA and steps codon by codon (~0.4 s per codon). At each codon,
     the matching bead flies in and joins the growing chain. The amino-acid label appears under that
     codon in the strip. After codon 8, a counter reads "+ 138 more amino acids", and the chain
     lengthens quickly offscreen; the finished beta chain has 146. The STOP codon itself (TAA, at
     the end of the real gene) is not shown in the strip; only mention it in the caption.
  5. The chain folds into ONE compact globular blob, with oily beads moving inward and charged beads
     facing outward. A smooth biconcave red blood cell fades in beside it, labeled "hemoglobin (four
     chains like this) fills red blood cells". Do not animate the four-chain assembly here.
  6. SANDBOX: "Change one letter." The PRIMARY path is four "Try this" chips above the strip
     (ctx.ui.chips), each applying one change in a tap: "A silent change" (codon 6 GAG→GAA),
     "The sickle-cell change" (codon 6 GAG→GTG), "Hemoglobin C" (codon 6 GAG→AAG) and "A stop"
     (codon 6 GAG→TAG). SECONDARY: the strip's tiles also become tappable (hover/focus states);
     tapping a letter shows its 3 alternative letters in the infoCard (ctx.ui.infoCard: beside the
     stage on desktop, an inline panel under the stage on phones). The START codon is locked; its
     note reads "Changing the start signal would stop the protein being made at all." Only ONE
     letter may differ from the original at a time: choosing a new change reverts the previous one.
     A "Reset" button restores the original. On each change: the tile flashes, the codon is re-translated using the standard genetic code
     (table below), the bead in the chain at that position swaps class/glyph, and a VERDICT CARD
     (text below, shown verbatim) appears. For the sickle case only, show four simplified blobs
     joined as one hemoglobin unit, then several such units sticking end to end into a fiber under a
     "low oxygen" label, and morph the red blood cell into a rigid crescent. For every other case,
     keep the red blood cell normal.

  VERDICT CARD TEXT (pick by rule; fill in amino-acid names):
  • Same amino acid (synonymous): "Silent. GAG→GAA still means glutamic acid: several codons can
    stand for the same amino acid. The protein is unchanged." (Substitute the actual codons and
    amino acid.)
  • Codon 6, GAG→GTG: "This is the sickle-cell mutation. Valine, an oily amino acid, replaces glutamic
    acid, a charged one, on the protein's surface. When oxygen is low, the altered hemoglobin
    molecules stick together into long fibers that bend red blood cells into rigid sickles. The
    disease develops mainly when both copies of the gene, one from each parent, carry this change."
  • Codon 6, GAG→AAG: "Same position, another real variant: lysine instead of glutamic acid. This is
    hemoglobin C. Lysine is charged (positively, where glutamic acid is negative), not oily, so
    hemoglobin C does not form sickle fibers. It is less soluble than normal hemoglobin, though,
    and can form crystals inside red cells. One copy causes no symptoms; two usually cause only
    mild anemia. Inherited together with the sickle-cell change from the other parent, it causes a
    form of sickle-cell disease (HbSC)."
  • New codon is TAA, TAG or TGA (possible at codons 6, 7 and 8): "Stop! The ribosome halts here, so
    the chain ends after [n] amino acids instead of 146. No working beta-globin can be made from this
    copy of the gene." (n = codon number − 1.)
  • Any other amino-acid change: "One amino acid swapped: [Old] → [New]. Whether this matters depends
    on where it sits in the folded protein and how different the new amino acid is. Many swaps like
    this are harmless; some are not." (Do NOT invent clinical consequences for these.)

  STANDARD GENETIC CODE (DNA coding-strand codons):
    Phe TTT TTC | Leu TTA TTG CTT CTC CTA CTG | Ile ATT ATC ATA | Met ATG | Val GTT GTC GTA GTG
    Ser TCT TCC TCA TCG AGT AGC | Pro CCT CCC CCA CCG | Thr ACT ACC ACA ACG | Ala GCT GCC GCA GCG
    Tyr TAT TAC | STOP TAA TAG TGA | His CAT CAC | Gln CAA CAG | Asn AAT AAC | Lys AAA AAG
    Asp GAT GAC | Glu GAA GAG | Cys TGT TGC | Trp TGG | Arg CGT CGC CGA CGG AGA AGG
    Gly GGT GGC GGA GGG
  In captions and cards, use full amino-acid names (glutamic acid, valine ...) and 3-letter codes
  only in the strip.

  MOBILE (≤480 px). The strip wraps into 3 rows of 3 codons, with tiles ≥32 px. The nucleus and
  cytoplasm stack vertically in a 4:5 stage, nucleus on top. The "Try this" chips wrap to two rows.
  The infoCard (letter choices as 3 large buttons, then the verdict card) sits inline below the
  stage, never over it.

  ACCESSIBILITY. Every tile is a button with an aria-label ("codon 6, letter 2, A"). The verdict card
  is an aria-live polite region. Reduced motion: transitions become instant state swaps, and the
  sickling morph becomes a crossfade.
steps:
  1. A short stretch of DNA: the start of the gene for beta-globin, one of the protein chains that make up hemoglobin. Its bases are written as four letters, A, C, G and T.
  2. To use a gene, the cell first copies it. The two DNA strands part, and a matching strand of messenger RNA is built base by base. The copy reads like the gene, except that RNA uses U (uracil) where DNA uses T (thymine).
  3. The mRNA copy leaves the nucleus through a pore and travels to a ribosome, the cell's protein-building machine. The DNA stays in the nucleus.
  4. The ribosome reads the mRNA three bases at a time. Each codon specifies one amino acid: AUG means "start" (methionine), GUG means valine, CAU means histidine, and so on. The chain grows one amino acid at a time until a "stop" codon ends it.
  5. As it grows, the chain folds into a compact shape: hydrophobic amino acids pack into the interior, and charged ones face the surrounding water. Four chains like this one make a hemoglobin molecule, the oxygen carrier that fills red blood cells.
  6. Change one base: tap any letter and pick a replacement, or start with one of the suggestions, and see what happens to the amino acid and the protein.
data: |
  Sequence: Homo sapiens HBB, NCBI RefSeq NM_000518.5, CDS positions 1–27 (ATG GTG CAT CTG ACT CCT GAG GAG AAG). Mature beta chain = 146 amino acids.
  Sickle mutation: codon 6 GAG→GTG, Glu→Val [11, 12].
  Hemoglobin C: codon 6 GAG→AAG, Glu→Lys; less soluble than normal hemoglobin; carriers (AC) asymptomatic, CC mild chronic hemolysis; SC is a sickle-cell disease genotype [12, 13].
alt: A step-by-step animation of how a cell makes a protein chain of hemoglobin. A stretch of DNA from the beta-globin gene is copied into messenger RNA, the copy leaves the nucleus, and a ribosome reads it three bases at a time, adding one amino acid per codon. The chain folds into a compact shape. In the final step the reader can change any single DNA base. Some changes are silent, some swap one amino acid, and some stop the chain early. The real sickle-cell change (GAG to GTG) makes hemoglobin molecules bind to one another and bends red blood cells into sickles, while the hemoglobin C change at the same spot does not.
:::

:::deep-dive Reading the genetic code
Four bases read three at a time give 4 × 4 × 4 = 64 possible codons, far more than 20 amino acids need. Three codons mean "stop." The other 61 are shared out, so most amino acids have several synonyms. GAA and GAG both mean glutamic acid, and leucine has six codons. That redundancy is why many single-base changes are "silent."

Almost every gene's protein-coding sequence begins with AUG (ATG in the DNA), which means "start" and also codes for the amino acid methionine. In the beta chain of hemoglobin, that first methionine is trimmed off as the chain is made, which is why the sickle-cell change is called "position 6" even though it sits in the seventh codon of the gene.

Most human genes are interrupted: protein-coding stretches (exons) alternate with non-coding stretches (introns). The cell cuts the introns out of the RNA copy and splices the exons together before the message leaves the nucleus. It can splice the same gene in different ways, making several related proteins from one gene. The protein-coding sequences of all our genes add up to only a small fraction of the genome. The rest includes those interruptions, regulatory sequences that control when genes are expressed, and much whose role is still unclear.

Single-base swaps are only one kind of mutation. Bases can also be inserted or deleted. Because the ribosome reads in fixed groups of three, adding or removing one base shifts the "reading frame" and scrambles every codon downstream. Such frameshifts usually destroy the protein's function. In cancer cells, they can also produce stretches of entirely new protein sequence that may be conspicuous to the immune system (Chapter 6).
:::

Cancer, as Chapter 6 explains, is driven by mutations that accumulate in a cell's DNA, and some of them change proteins in ways the immune system can, in principle, detect.

:::clinic
In December 2023, the US Food and Drug Administration approved the first gene therapies for sickle-cell disease.[^14] One of them, exagamglogene autotemcel (Casgevy), was the first medicine based on CRISPR gene editing to be approved in the US. Doctors collect the patient's own blood-forming stem cells, edit them in the lab, and return them after high-dose chemotherapy clears out the old ones.

The edit does not correct the mutation. It restores production of fetal hemoglobin, a form the body largely stops making in infancy, which counters sickling. Chapter 10 describes the same approach (remove a patient's cells, modify them, return them) applied to immune cells that attack cancer.
:::

## Receptors: how a cell feels its world

Because a cell is sealed inside its membrane, it detects what is outside (nutrients, a neighbor in trouble, an invader) through receptors: proteins that typically span the membrane, with one end outside the cell and one inside.

The outer end carries a binding site, a pocket or patch of surface shaped to fit one particular kind of molecule, called its {{ligand|ligand}} (from the Latin *ligare*, "to bind"). When the ligand binds, the receptor changes shape slightly. The change passes through the membrane to the inner end, which sets off a cascade of chemical reactions inside the cell, called a signal. Insulin works this way: when it binds receptors on muscle and fat cells, those cells take up sugar from the blood.

The ligand does not need to enter the cell; only the signal crosses the membrane. And sensing is not all-or-nothing. A cell carries many copies of each receptor, often thousands, and responds to how many are occupied, and for how long.

A molecule with nearly the right shape can occupy a receptor's binding site without activating it, blocking the natural ligand. Caffeine works largely this way: it occupies the brain's receptors for adenosine, a natural signal that dampens nerve activity.[^15] Several major cancer immunotherapies use the same blocking principle: they are antibodies that stop an immune receptor from binding its ligand (Chapter 8).

Immune cells carry many kinds of receptor. Some detect generic signs of trouble, such as molecules typical of bacteria; others, on T and B cells, are highly specific. Nearly everything in this guide comes down to receptors and what they bind.

## How molecules bind

A ligand fits a receptor when two things match: shape and chemistry. The two surfaces must nestle closely together, *and* their chemical features must complement each other, with a positive charge opposite a negative one or a hydrophobic patch against a hydrophobic patch. Each contact is a weak, reversible attraction, not a permanent chemical bond, but dozens of them across a well-matched surface add up to tight binding.[^16]

The classic image for this is a lock and key, in which only a key of the right shape will turn. The image is too rigid: both partners often flex as they meet and mold to each other, a refinement called "induced fit."[^16] The strength with which two molecules bind is their {{affinity|affinity}}. High affinity means a tight, well-matched fit; low affinity means a loose one.

Unlike a key in a lock, **molecules never stay bound for good.** Buffeted by the surrounding water, even a well-matched pair eventually comes apart, or dissociates, and then rebinds or binds something else. Binding and dissociation alternate continually, and affinity sets the balance: the better the fit, the larger the share of time a pair spends bound. A better fit raises that share mainly by making each binding event last longer. The more contacts a pair shares, the less likely they are to all break at once; a poorly matched pair dissociates almost immediately.

Affinity is usually measured as a {{dissociation-constant|dissociation constant}}, K<sub>D</sub>: the concentration of ligand at which half the receptors are occupied at any moment. The smaller the K<sub>D</sub>, the tighter the binding, because less ligand is needed to fill half the receptors.[^16]

Two consequences recur throughout this guide:

- **What a cell senses is a fraction.** At any moment, some receptors are occupied and some are empty. The fraction depends on affinity *and* on how many ligand molecules are around, so a weak binder at high concentration can match a strong binder at low concentration.
- **Recognition is a matter of degree.** A receptor tuned to one target will usually also bind close look-alikes, just more weakly. This property, called {{cross-reactivity|cross-reactivity}}, is both useful (one receptor can cover several threats) and dangerous (a receptor can bind a self molecule that resembles its target).

:::figure ch01-binding
title: Fit, bind, release
goal: After using this, the reader understands that molecules recognize each other by shape and chemical fit; that bound partners constantly let go and rebind; that the snugger the fit (the higher the affinity), the longer partners tend to stay together; that the fraction of receptors occupied depends on both affinity and the number of ligand molecules; and that look-alikes bind, but more weakly.
kind: simulation
stage: dark
spec: |
  SCENE (Canvas 2D; DPR-aware, capped at 2×). The bottom ~22% of the stage is a cell membrane: a
  softly undulating sand-colored band (#E9C9A1) with the cell interior below it. Twelve receptors
  (eight on phones) stand evenly spaced in the membrane. Each has a short stalk crossing the membrane,
  an inner "tail" below the membrane, and on top a cup-shaped binding pocket. The pocket has a
  distinctive notch profile (a squared-off notch, unlike the rounded MHC cup used from Chapter 2 on)
  and a small "−" charge mark on its inner wall. Receptors are a neutral slate/ink-2 tone, NOT pale
  silver: in this book a silver cup always means MHC. They are generic, not a specific immune
  molecule. Above the membrane, ligand molecules
  drift with Brownian motion (small random steps, bouncing softly off the stage edges). Ligands are
  bright cyan-green (#3DDC97). They are drawn ~60% of a pocket's width, so binding is legible.
  Stage tags (top right): "Illustrative" and "Time compressed".

  LIGAND SHAPES (selected by the "Fit" control; a shape change morphs over 0.4 s):
    Snug        — a knob whose profile exactly complements the pocket notch, with a "+" mark that
                  lines up with the pocket's "−".
    Look-alike  — roughly right, but one bump is missing and the "+" mark is offset, so the fit is
                  visibly imperfect.
    Wrong shape — a clearly mismatched profile (e.g. a flat block), with no complementary mark.

  RULES. Specify every random event as a RATE per simulated second and convert it per frame as
  p = 1 − exp(−k·dt) (shared/agents.js rateToP), so behavior does not depend on the display's frame
  rate. Run at ~1 simulated
  second per real second. Clamp dt to ≤ 50 ms (for example, after the tab regains focus).
  - Capture: while a free ligand's tip is inside the capture zone of an EMPTY pocket, it binds at rate
    k_cap: Snug 30 s⁻¹, Look-alike 30 s⁻¹, Wrong shape 1.5 s⁻¹. Equal capture rates for Snug and
    Look-alike are deliberate. For most protein binding, affinity differences come mostly from how
    long a complex lasts, not how fast it forms. That is an accepted simplification; please keep it.
  - Dwell: on binding, draw a dwell time from an exponential distribution with mean τ: Snug 8 s,
    Look-alike 0.8 s, Wrong shape 0.08 s. At the end of the dwell, the ligand releases with a small
    upward kick and a faint puff, and resumes drifting. NOTHING stays bound forever, not even Snug.
  - Bound ligands snap into the pocket over 150 ms and glow softly. While a receptor is occupied,
    its inner tail glows with a small "+" activation glyph (#3DDC97). This is the signal reaching the
    inside of the cell.

  CONTROLS (below the stage):
  - Segmented control "Fit": Snug | Look-alike | Wrong shape (default Snug). Each option shows a tiny
    icon of the ligand shape (not color alone).
  - Slider "Ligand molecules": 4 → 80, default 20 (phones: 3 → 54, default 14). Adding or removing
    molecules fades them in or out at random free positions.
  - Play/Pause and Reset buttons.

  READOUTS (to the right of the stage on desktop, below it on phones):
  - Big number: "Receptors occupied: 9 of 12".
  - "Signal inside the cell": a horizontal bar equal to the occupied fraction, with a "+" icon.

  TUNING TARGETS. Tune the capture-zone size and drift speed, never the τ ratios. Check the targets
  numerically: run each setting for 60 simulated seconds headless and log mean occupancy.
  - Snug at default count: ≥ ~70% occupied, yet individual ligands visibly come and go.
  - Look-alike at default count: ~15–30%.
  - Look-alike at the maximum count: ≥ ~55%, so concentration visibly compensates for a weak fit.
  - Wrong shape at the maximum count: < 5%.
  (A mass-action estimate with ligand depletion, using a 10× difference in τ, gives about 70%,
  25% and 60% for the first three. The targets are mutually consistent.)

  MOBILE. Use a 4:5 stage with 8 receptors. Controls stack vertically, with touch targets ≥44 px.
  Readouts sit below the controls.

  PERFORMANCE / MOTION. Pause the loop when the figure is off-screen or the tab is hidden. With
  prefers-reduced-motion, do not autoplay. Show a static snapshot sampled at equilibrium for the
  current settings, plus a "Run 10 seconds" button that animates once and stops. Changing a control
  recomputes the snapshot.
steps:
  1. Receptors (cups) sit in a cell's membrane while ligand molecules drift by at random. When a ligand's shape and charges match a receptor's binding site, it binds, and the receptor's inner tail lights up to pass the signal inside.
  2. Even a snug-fitting ligand eventually dissociates. Each receptor cycles between bound and free, and the snugger the fit (the higher the affinity), the longer each binding tends to last.
  3. Switch to the look-alike: it binds with lower affinity, so fewer receptors are occupied at any moment. This is how one receptor can respond to several similar targets, sometimes including the wrong one. Adding more ligand molecules raises occupancy, so many weak binders can do what a few strong ones do.
  4. Try the wrong shape: almost nothing binds, however many molecules you add.
data: |
  Simulation parameters are illustrative, chosen to make relative effects visible; time is compressed and not to scale. Real dwell times range from about a second (T-cell receptors) to hours (high-affinity antibodies) [17, 18]. Only a few ligand molecules are shown, so they can run out; the textbook occupancy formula in the Go-deeper box assumes ligand is in excess.
alt: A simulation of receptor molecules in a cell membrane and ligand molecules drifting above them. Ligands with a snug fit stay bound for a long time and keep most receptors occupied, though each one eventually dissociates. Look-alike ligands stay bound only briefly, so fewer receptors are occupied unless many more ligand molecules are added. Wrongly shaped ligands almost never bind. A meter shows the fraction of receptors occupied, which sets the strength of the signal inside the cell.
:::

:::key-idea
Molecular recognition happens by contact and depends on shape plus chemistry. Affinity, the strength of a fit, is the balance between binding and dissociation; for most immune molecules it shows up mainly in how long partners stay bound. No binding lasts forever, so what a cell senses is the fraction of its receptors occupied at any moment.
:::

:::deep-dive Affinity by the numbers
When ligand is plentiful, the fraction of receptors occupied follows a simple rule: [L] / ([L] + K<sub>D</sub>), where [L] is the ligand concentration. Far below K<sub>D</sub>, doubling the ligand roughly doubles the occupancy. Far above it, the receptors are nearly full, and adding more changes little.[^16]

Affinity combines two rates: how quickly partners find each other and bind (the on-rate) and how quickly they dissociate (the off-rate). K<sub>D</sub> is the off-rate divided by the on-rate. How long a pair stays together depends on the off-rate alone. Usually a tighter pair also stays together longer, which is the intuition in the main text. But two pairs with the same affinity can still behave differently, one meeting and parting quickly, the other slowly. That distinction matters for T cells (Chapter 4).

Immune receptors span a wide range. Antibodies made late in a strong immune response typically bind with K<sub>D</sub> values in the nanomolar range or below. (A nanomolar is a billionth of a mole per liter, and a mole is a fixed, enormous count of molecules, about 6 × 10<sup>23</sup>.) Researchers have proposed a practical ceiling near 0.1 nanomolar for antibodies made in the body. Beyond that point, a B cell can no longer tell a very good antibody from an even better one.[^17]

The receptors of T cells are far weaker. Their K<sub>D</sub> is typically 1–100 micromolar, roughly a thousand to a million times weaker than a mature antibody. A single contact lasts from about a second to about a minute.[^18] How T cells nonetheless make precise decisions with such brief contacts is taken up in Chapter 4.

Tighter binding is not always better. In the laboratory, engineers have evolved T-cell receptors that bind with picomolar affinity, up to about a million times tighter than natural ones, but raising a receptor's affinity can also make it less selective.[^18] That trade-off matters for the engineered cell therapies of Chapter 10.

Several weak binding sites can also add up to strong binding. An antibody has two identical arms. When one arm dissociates, the other may still be bound, and the free arm can bind again before the molecule drifts away. This combined strength, called {{avidity|avidity}}, can far exceed the affinity of either arm alone; Chapter 3 returns to it.[^16]
:::

## What "self" means to a molecule

Your body is built from proteins encoded by your own genes. Bacteria, viruses and fungi carry proteins, sugars and lipids in many shapes your body never makes. To the immune system, {{self|self}} means the collection of molecular shapes your own body makes, and "non-self" is everything else. Anything the immune system can specifically recognize is called an {{antigen|antigen}}. Usually that is a protein, or a fragment of one.

The immune system is not born knowing which shapes are self, and much of this guide follows from that. Its most specific receptors, on T cells and B cells, are generated partly at random (Chapter 3), so some of them inevitably fit your own molecules. The body has to *learn* to leave those shapes alone, mostly by eliminating or silencing self-reactive cells as they mature. This learned restraint is called {{tolerance|tolerance}} (Chapter 5). When it fails, the immune system attacks the body's own tissues, a condition called {{autoimmunity|autoimmunity}}; type 1 diabetes and multiple sclerosis are examples.

Self also differs from person to person. Small differences in many proteins, especially in a family of "display" molecules described in Chapter 4, make each person's self unique. That is why an organ transplanted from anyone but an identical twin is attacked unless drugs suppress the recipient's immune system.

For the immune system's most specific cells, then, self is not a list stored anywhere but whatever they have learned to ignore. That makes the system adaptable, but it also means that anything that looks enough like self, including a cancer cell, may be ignored.

:::key-idea
To the immune system, "self" means the molecular shapes your body makes and has learned to tolerate. It is not stored as a list: the immune system's most specific cells have to learn it.
:::

:::deep-dive Self, non-self, or danger?
The idea that self must be learned rests largely on a 1953 experiment by Rupert Billingham, Leslie Brent and Peter Medawar. They injected unborn mice with cells from a different mouse strain. As adults, those mice accepted skin grafts from the donor strain that their immune systems would normally have rejected.[^19] Early exposure had taught their immune systems to treat foreign tissue as self. Medawar shared the 1960 Nobel Prize in Physiology or Medicine for this "acquired tolerance" with Macfarlane Burnet, who had predicted it.

The self/non-self rule has many exceptions. We tolerate trillions of foreign bacteria in our gut (Chapter 5 shows how) and many kilograms of foreign food protein every year, and a pregnant woman tolerates a fetus that carries the father's genes. Meanwhile, the immune system routinely clears away our own dying cells, and in autoimmune disease it attacks healthy self. In 1994, the immunologist Polly Matzinger proposed that what triggers an immune response is not foreignness but danger: alarm signals released by damaged or stressed tissue.[^20]

Most immunologists today hold a synthesis: whether the immune system attacks depends both on *what* it recognizes and on the *context*, such as infection, damage or inflammation. This requirement for two conditions returns in Chapter 4 as the immune system's "two-factor authentication." It is also central to cancer, which is mostly self and often grows without producing the kind of alarm that triggers an attack (Chapter 2).
:::

## The cells of the immune system

The immune system is a network of about 1.8 trillion cells, weighing about 1.2 kilograms (2.6 pounds) in an adult man.[^1]

Almost all of them trace their ancestry to rare {{hematopoietic-stem-cell|blood-forming stem cells}} in the {{bone-marrow|bone marrow}}, the soft tissue inside bones. Many then mature or multiply elsewhere, and many tissue macrophages renew themselves on the spot. (Some, such as the brain's macrophages, descend from cells that settled in their tissues before birth.)[^16] Immunologists sort the cells into two branches.

The first branch, {{innate-immunity|innate immunity}}, acts within minutes to hours and recognizes broad categories of trouble rather than specific microbes.

- {{neutrophil|Neutrophils}} are the most numerous immune cells, more than a third of the total.[^1] Short-lived and fast, they pour into infected tissue and engulf bacteria.
- {{macrophage|Macrophages}} ("big eaters") live in nearly every tissue, clearing debris and microbes and raising the alarm. They are large: a tenth of immune cells by number, but nearly half by weight.[^1]
- {{dendritic-cell|Dendritic cells}} sample the tissue around them and carry what they collect to the {{lymph-node|lymph nodes}}, where they activate T cells.
- {{nk-cell|Natural killer (NK) cells}} kill body cells that are stressed, infected or abnormal.

The second branch, {{adaptive-immunity|adaptive immunity}}, is slower to start but highly specific, and it remembers targets it has met before.

- T cells, about a quarter of all immune cells,[^1] each carry a receptor tuned to one particular target. Some kill infected or cancerous cells; others coordinate the response.
- B cells make antibodies. Once activated, some become {{plasma-cell|plasma cells}}, which secrete antibodies in large quantities. About 70% of plasma cells live in the wall of the gut.[^1]

Most immune cells live outside the blood:[^1]

- **About 40% are in the bone marrow**, mostly neutrophils held in reserve.
- **About 39% are in the other lymphoid organs.** Lymph nodes are bean-sized organs, hundreds of them, along the vessels that drain {{lymph|lymph}} (the clear fluid that seeps out of tissues) back toward the blood. T and B cells pass through them, checking for the one shape their receptors fit, and move on. The {{spleen|spleen}} plays a similar role for the blood, which it filters. The {{thymus|thymus}}, behind the breastbone, is where T cells mature; the "T" stands for thymus.[^16]
- **About 19% live in tissues** such as the skin, lungs, gut and liver.
- **Only about 2% are in the blood** at any moment, mostly in transit between these sites.

:::figure ch01-census
title: Where your immune cells live
goal: After using this, the reader knows that the immune system is about 1.8 trillion cells and that most live in the bone marrow and lymphoid organs, with only ~2% in the blood. They also learn that neutrophils and T cells are the most numerous, while large macrophages dominate by weight.
kind: chart
stage: light
spec: |
  FORM. A unit (waffle) chart built with shared/unit-grid.js. In COUNT modes, there are 184 small squares, each = 10 billion
  (10^10) immune cells. In WEIGHT mode, there are 122 squares, each = 10 grams of cells. Squares are
  ~14 px on desktop and ~11 px on phones, with 2 px gaps and 2 px corner radius. Each square is
  colored by cell group (palette below). There are 9 groups: 8 named types plus "Other"
  (eosinophils, monocytes and basophils, which the text does not introduce).

  VIEWS (segmented control "By place | By type | By weight"; default "By place"). Squares ANIMATE
  between layouts (GSAP, ~900 ms, slight stagger, ease-in-out). Each square should be the same
  object moving, so the reader sees regrouping.
  1. By place (default): 10 location clusters, colored by cell group so composition is visible.
     Order: Bone marrow, Lymph nodes, Spleen, Thymus, Skin, Lungs, Gut, Liver, Elsewhere, Blood.
     Blood goes last and is visually set apart with a thin outline and the label "Blood: only ~2%".
     Add a small bracket spanning Lymph nodes + Spleen + Thymus labeled "lymphoid organs, 39%".
     Each cluster is a block of squares 10 wide, labeled above with name + share ("Bone marrow,
     40%").
  2. By type: the same 184 squares regroup into 9 clusters, one per group, in descending order.
     Each is labeled above with name + count to two significant figures ("Neutrophils, ≈ 660
     billion"); the exact value appears in the tooltip.
  3. By weight: the squares re-flow into 122 weight squares, clustered by group as in view 2. Create
     or remove squares with a fade; it's fine if objects don't map 1:1 here. Macrophages (60
     squares) should visibly dominate.

  INTERACTION. Hover/tap a square for a tooltip: "T cells in lymph nodes: ~220 billion (Sender et
  al. 2023)" (count views) or "Macrophages: ~600 g (Sender et al. 2023)" (weight view). The legend lists the 9 groups with a one-line
  description each (text below). Hover/tap a legend item to HIGHLIGHT that group: its squares stay
  full opacity, and the others dim to 20%. This carries the information for colorblind readers. Use
  keyboard focus with Enter for the same effect. A "Show numbers" disclosure reveals an accessible
  HTML table of the full 11-type × 10-place data below (eosinophils, monocytes and basophils listed
  separately there).

  LEGEND DESCRIPTIONS (verbatim):
    Neutrophils — fast first responders that swallow bacteria
    T cells — specific hunters and coordinators (all kinds combined)
    B cells — antibody makers
    Macrophages — large, tissue-resident eaters and alarm-raisers
    Mast cells — sentinels in skin, airways and gut; behind many allergy symptoms
    Dendritic cells — scouts that carry samples to lymph nodes
    Plasma cells — antibody factories, most of them in the gut wall
    NK cells — natural killers of stressed or infected cells
    Other — eosinophils, monocytes and basophils

  COLORS. Use the PLAN §4 palette where defined: Neutrophils #F4A6C8, T cells #4C8DFF, B cells
  #F2B33D, Plasma cells B-gold with a diagonal hatch, Macrophages #FF7A6B, Dendritic cells #4FD18B,
  NK cells #FF8A3D. Mast cells: the art library's palette key `mast`. Other: a neutral warm gray
  with a darker stroke. On the light stage, give pale fills a darker 1 px
  stroke, so every square has ≥3:1 contrast against the background.

  CAPTION under the chart: the caption for the active view (steps 1–3), in an aria-live region.
  Source line, always visible on the stage (ink-3, 12 px), including on phones: "Estimates for a
  reference 73-kg adult man (Sender et al., 2023). Each number has wide error bars. Blank
  combinations mean 'not estimated', not 'absent'. For example, dendritic cells also live in the
  gut and lungs."

  MOBILE. Clusters are 8 squares wide and stack vertically in a single column, with labels above
  each cluster. The segmented control is full width. Tooltips become an inline infoCard
  (ctx.ui.infoCard) under the chart.

  REDUCED MOTION. Views switch with an instant re-layout or a 150 ms crossfade, with no flying
  squares.
steps:
  1. Each square is 10 billion immune cells, about 1.8 trillion in all, sorted by where they live. Four in five are in the bone marrow and the other lymphoid organs: lymph nodes, spleen and thymus. Only about 2% are in the blood at any moment.
  2. The same squares, sorted by cell type. Neutrophils and T cells are the most numerous. Tap a cell type in the legend to highlight it.
  3. Now each square is 10 grams of cells, about 1.2 kilograms in all. Macrophages are only a tenth of immune cells by number, but they are so large that they make up nearly half the weight.
data: |
  Source: Sender R, et al. PNAS 2023 [1]; type-by-location values from the authors' public dataset (gitlab.com/milo-lab-public/distribution-of-immune-cells, Data/Interim results/summary_immune_cells.csv and Data/Final results/total_w_unc.xlsx, sheet cell_type_densities, column tot_man). Reference 73-kg man. "Lymph nodes" here = lymph nodes + tonsils + lymph vessels; "Elsewhere" = muscle, brain, fat, kidneys, connective tissue and other organs.

  CELL COUNTS, billions, all 11 types (for the "Show numbers" table; columns = Bone marrow | Lymph nodes | Spleen | Thymus | Skin | Lungs | Gut | Liver | Elsewhere | Blood | TOTAL):
  Neutrophils     591.8 |   1.2 |  44.1 |  0.7 |  1.9 |  2.2 |  0.5 |  0.0 |  0.0 | 22.1 | 664.5
  T cells          21.5 | 219.9 | 113.6 | 29.5 | 26.5 | 12.7 | 17.6 |  7.9 | 10.8 |  7.9 | 467.8
  B cells          14.4 | 165.7 |  66.5 |  0.6 |  0.6 |  2.2 |  7.7 |  1.8 |  0.6 |  1.3 | 261.5
  Macrophages      48.6 |   8.5 |  17.0 |  0.2 | 12.0 | 28.6 |  4.6 | 36.0 | 47.5 |  0.0 | 203.0
  Mast cells        0.9 |   0.0 |   0.0 |  0.0 | 28.4 | 21.8 |  9.0 |  0.0 | 29.2 |  0.0 |  89.1
  Dendritic cells   0.0 |  15.1 |  22.7 |  0.1 |  9.6 |  0.0 |  0.0 |  0.0 |  0.0 |  0.1 |  47.5
  Eosinophils      29.0 |   0.0 |   2.3 |  0.1 |  0.0 |  1.3 |  0.6 |  0.0 |  0.0 |  1.0 |  34.3
  Monocytes        23.0 |   0.9 |   6.2 |  0.0 |  0.0 |  0.0 |  0.0 |  0.0 |  0.0 |  3.0 |  33.1
  Plasma cells      2.2 |   0.2 |   1.0 |  0.0 |  0.0 |  1.4 | 12.2 |  0.0 |  0.6 |  0.0 |  17.7
  NK cells          3.3 |   0.3 |   0.4 |  0.1 |  1.9 |  0.7 |  0.8 |  5.5 |  3.1 |  1.6 |  17.7
  Basophils         1.5 |   0.0 |   0.0 |  0.0 |  0.0 |  0.0 |  0.0 |  0.0 |  0.0 |  0.2 |   1.7
  TOTAL           736.2 | 411.8 | 273.8 | 31.3 | 81.0 | 70.9 | 52.9 | 51.2 | 91.8 | 37.1 | 1838.0
  Shares of total: bone marrow 40%, lymph nodes 22%, spleen 15%, thymus 2%, skin 4%, lungs 4%, gut 3%, liver 3%, elsewhere 5%, blood 2%.

  SQUARES FOR COUNT VIEWS (each = 10 billion; 9 groups, "Other" = eosinophils + monocytes + basophils = 69.0 billion; group totals by largest-remainder rounding to 184, then split across places by largest remainder; same column order):
  Neutrophils      59 |  0 |  5 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 66
  T cells           2 | 22 | 11 | 3 | 3 | 1 | 2 | 1 | 1 | 1 | 47
  B cells           1 | 17 |  7 | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 26
  Macrophages       5 |  1 |  2 | 0 | 1 | 3 | 0 | 3 | 5 | 0 | 20
  Mast cells        0 |  0 |  0 | 0 | 3 | 2 | 1 | 0 | 3 | 0 |  9
  Other             6 |  0 |  1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |  7
  Dendritic cells   0 |  2 |  2 | 0 | 1 | 0 | 0 | 0 | 0 | 0 |  5
  Plasma cells      0 |  0 |  0 | 0 | 0 | 0 | 2 | 0 | 0 | 0 |  2
  NK cells          1 |  0 |  0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 |  2
  TOTAL            74 | 42 | 28 | 3 | 8 | 6 | 6 | 5 | 9 | 3 | 184

  WEIGHT BY GROUP, grams (authors' dataset, total_w_unc.xlsx, sheet mass_by_cell_type; Table 1 of [1] gives these rounded to one significant figure; total ≈ 1,224 g) → squares of 10 g (largest remainder, total 122):
  Macrophages 601 → 60 · Neutrophils 210 → 21 · Dendritic cells 106 → 11 · T cells 100 → 10 · Mast cells 96 → 10 · B cells 56 → 5 · Plasma cells 27 → 3 · Other 25 (eosinophils 11, monocytes 13, basophils 0.7) → 2 · NK cells 3.8 → 0 (show as a partial square, "~4 g").
  Headline values from the paper: total 1.8 × 10^12 cells (95% CI 1.5–2.3 × 10^12); 1.2 kg (95% CI 0.8–1.9 kg); lymphocytes ~40% of number and ~15% of mass; macrophages ~10% of number and ~49% of mass.
alt: A unit chart of the roughly 1.8 trillion immune cells in an adult man, each square representing 10 billion cells. Sorted by location, about 40% are in the bone marrow, 39% in the lymph nodes, spleen and thymus, 19% in tissues such as skin, lungs, gut and liver, and only about 2% in the blood. Sorted by type, neutrophils (about 660 billion) and T cells (about 470 billion) are the largest groups. Sorted by weight, macrophages make up nearly half of the immune system's 1.2 kilograms.
:::

:::clinic
A routine blood test counts white blood cells per microliter of blood, typically several thousand. That is useful but limited: at any moment, only about 2% of your immune cells, and fewer than 2% of your T cells, are in circulation,[^1] so a blood count samples only the small fraction of the immune system that is in transit.
:::

## The problem ahead

Among some 30 trillion cells that sense one another only through molecular contact, the immune system's job is a problem of **recognition**: telling self from non-self quickly and reliably, among countless possible shapes.

The next four chapters explain how it does this, and a single flu infection shows the sequence. A flu virus infects the cells lining your airway. Within hours, infected cells release signaling proteins, and the fast, generic cells of the innate branch respond (Chapter 2). Over the next day or two, dendritic cells carry pieces of the virus to the nearest lymph node, where the rare T and B cells whose receptors happen to fit are found among millions and multiply into thousands of copies (Chapters 3 and 4).

About a week in, killer T cells destroy infected cells, recognizing the virus fragments those cells display, while antibodies bind free virus; helper T cells coordinate both, and brakes keep the attack from overshooting (Chapter 5). Once the virus is gone, most of the expanded T and B cells die, and memory cells remain (Chapter 3). Throughout, the slow, specific branch joins in only after the fast one has raised the alarm. The end of Chapter 5 shows the whole sequence in one diagram.

Cancer is the hardest case. A cancer cell is not an invader but one of your own cells, built from your own genes, with a scattering of mutations. To the immune system it is *altered self*: almost entirely familiar, different only in small details that may or may not be visible. Whether the immune system can detect those details, and how medicine can help it, is the subject of this guide.

:::quiz
Q: What is messenger RNA?
- [ ] The cell's permanent store of genetic information, kept in the nucleus — that is DNA, which stays in the nucleus; mRNA is a short-lived copy that leaves it.
- [x] A short-lived copy of one gene, carried from the nucleus to a ribosome — ribosomes read mRNA three bases (one codon) at a time to build a protein.
- [ ] The finished chain of amino acids, folded into its working shape — that is the protein.
- [ ] The machine that reads the genetic code and links amino acids into a chain — that is the ribosome, which reads mRNA.

Q: A single DNA base in a gene changes. What happens to the protein?
- [ ] It always stops working, because every base in a gene counts — many changes are silent, and many amino-acid swaps barely matter.
- [ ] Nothing, because one base out of billions is too small to matter — the sickle-cell change is a single base.
- [x] It depends on which base changes and what it becomes — the protein may be unchanged, have one amino acid swapped, or be cut short.
- [ ] The whole protein is rebuilt with a new sequence — a single-base swap usually changes at most one amino acid or ends the chain early; rarer changes that hit a start, stop or splicing signal can alter longer stretches.

Q: A receptor's ligand fits only loosely (low affinity). How can the cell still get a strong signal?
- [ ] It can't: loose-fitting ligands never bind, however many there are — they do bind, just less firmly; recognition is a matter of degree.
- [x] More ligand molecules, so more receptors are occupied at any moment — what a cell senses is the fraction of receptors occupied, which depends on both affinity and concentration.
- [ ] Once a ligand binds it stays for good, so the receptors fill up — every binding is temporary, even for a snug fit.
- [ ] The receptor permanently reshapes itself to fit the ligand — proteins flex as they bind, but the change is not permanent, and the binding still comes undone.

Q: To the immune system's most specific cells, what is "self"?
- [ ] A list of approved molecules written into your DNA before birth — their receptors are generated partly at random, so they must learn what to ignore.
- [x] The shapes your body makes, which they have learned to tolerate — self is learned, which is why the learning can fail (autoimmunity) and why look-alikes such as cancer cells can slip through.
- [ ] Anything located inside the body, including whatever lives in your cells — a virus inside your cells is still non-self.
- [ ] Any molecule made of protein, since your own body is built from proteins — microbes are full of proteins too; what matters is whether the shape is your own.
:::

:::takeaways
- Immune decisions are made at the scale of molecules. An immune cell hundreds of times wider than an antibody acts on contacts a few nanometers across.
- Genes in DNA are copied into mRNA, which ribosomes read to build proteins. A protein's amino-acid sequence sets its shape, and its shape sets its job.
- A change in a single DNA base can transform a protein, as in sickle-cell disease, or do nothing at all. Cancer is driven by an accumulation of such changes.
- Cells sense their surroundings through receptors. Recognition is shape plus chemistry; affinity is the strength of binding, seen mostly in how long partners stay bound; and every binding is temporary.
- The immune system is about 1.8 trillion cells weighing about 1.2 kg. Most live in the bone marrow and the other lymphoid organs, and only about 2% are in the blood.
- The immune system's core problem is telling self from non-self, and its most specific cells must learn where that line falls. Cancer, as altered self, is the hardest case.
:::

## Glossary
- cell | Cell | The basic unit of life: a microscopic compartment wrapped in a membrane that uses energy, responds to its surroundings and, usually, can divide. An adult human has roughly 30 trillion.
- immune-system | Immune system | The body's network of cells, molecules and organs that detects and responds to infection, damage and abnormal cells. It comprises about 1.8 trillion cells in an adult man.
- white-blood-cell | White blood cell (leukocyte) | Any immune cell. The name comes from their pale color compared with red blood cells. Most white blood cells live outside the blood, in the bone marrow, the other lymphoid organs and the tissues.
- antibody | Antibody | A Y-shaped protein made by B cells that binds one specific target with the tips of its arms. It can block that target or mark it for destruction.
- cancer | Cancer | A disease in which the body's own cells, altered by accumulated mutations, multiply out of control and can invade other tissues.
- tissue | Tissue | A group of similar cells working together, such as muscle, skin or the lining of the gut.
- lymphocyte | Lymphocyte | The family of small, round immune cells that includes T cells, B cells and natural killer cells.
- t-cell | T cell | A lymphocyte that matures in the thymus and carries a receptor for one specific target. Some T cells kill infected or cancerous cells; others coordinate the immune response.
- b-cell | B cell | A lymphocyte that carries a unique antibody on its surface as a receptor and, when activated, produces antibodies.
- protein | Protein | A chain of amino acids folded into a specific three-dimensional shape. Proteins do most of the work in cells, and their shape determines what they do and what they bind.
- cell-membrane | Cell membrane | The lipid bilayer that surrounds every cell, separating inside from outside. Proteins embedded in it act as channels, sensors and identity markers.
- lipid-bilayer | Lipid bilayer | The double layer of fatty molecules, mostly phospholipids, that forms cell membranes. Each phospholipid has a hydrophilic head and two hydrophobic tails; in water they line up in two sheets with the tails facing inward and the heads facing the water on either side.
- hydrophobic | Hydrophobic and hydrophilic | Hydrophobic (water-repelling) molecules, or parts of molecules, mix poorly with water and cluster together in it. Hydrophilic (water-attracting) ones are charged or polar (carrying slight positive and negative charges) and mix readily with water. The difference shapes cell membranes and drives protein folding.
- nucleus | Nucleus | The compartment inside a cell that holds its DNA.
- ribosome | Ribosome | The cell's protein-building machine. It reads messenger RNA one codon (three bases) at a time and links the matching amino acids into a chain.
- dna | DNA | The long, double-stranded molecule that stores genetic information as a sequence of four bases, written A, C, G and T. Each strand is a chain of nucleotides, and the bases of the two strands pair up, A with T and C with G.
- nucleotide | Nucleotide | One of the units that link into chains to form DNA and RNA. Each carries one of four bases, written as letters: adenine (A), cytosine (C), guanine (G) and thymine (T) in DNA, with uracil (U) in place of thymine in RNA. The order of the bases encodes genetic information.
- genome | Genome | The complete set of an organism's DNA. In humans it is about 3 billion base pairs, present in two copies in nearly every cell that has a nucleus.
- gene | Gene | A stretch of DNA that contains the instructions for making a protein (or, for some genes, a working RNA molecule).
- gene-expression | Gene expression | The use of a gene to make its product: the gene is copied into RNA and, for a protein-coding gene, the RNA is read to build the protein. A cell is said to express the proteins it makes.
- rna | RNA | A single-stranded chemical cousin of DNA that uses the base uracil (U) in place of thymine (T). Cells use it mainly as working copies of genes and in building proteins, for example as part of ribosomes.
- mrna | Messenger RNA (mRNA) | A short-lived RNA copy of a single gene, carried from the nucleus to the ribosomes and read to build a protein. mRNA vaccines deliver such copies directly.
- codon | Codon | A group of three bases in DNA or RNA that specifies one amino acid, or the start or end of a protein.
- amino-acid | Amino acid | One of 20 small molecules that link into chains to make proteins. They differ in size, in charge and in how hydrophobic they are, which governs how a chain folds.
- enzyme | Enzyme | A protein that speeds up a specific chemical reaction, such as cutting or joining other molecules.
- mutation | Mutation | A change in the DNA sequence, from a single changed base to large rearrangements. Many have no effect; some alter a protein.
- hemoglobin | Hemoglobin | The oxygen-carrying protein that fills red blood cells. In adults, it is made of two alpha and two beta chains.
- receptor | Receptor | A protein, often spanning the cell membrane, that binds a specific molecule (its ligand) and relays a signal into the cell.
- ligand | Ligand | Any molecule that binds to a specific receptor.
- affinity | Affinity | The strength of binding between two molecules at a single binding site, usually measured as a dissociation constant (K<sub>D</sub>). It reflects the balance between binding and dissociation; for most immune molecules, mainly how long partners stay bound.
- dissociation-constant | Dissociation constant (K<sub>D</sub>) | The usual measure of affinity: the concentration of ligand at which half the receptors are occupied at any moment. The smaller the K<sub>D</sub>, the tighter the binding. It equals the off-rate (how quickly bound partners separate) divided by the on-rate (how quickly they bind).
- cross-reactivity | Cross-reactivity | The ability of a receptor or antibody to bind molecules that resemble its intended target, usually more weakly.
- avidity | Avidity | The overall binding strength of a molecule that binds its target at several sites at once, such as a two-armed antibody. It can be far greater than the affinity of any single site. See Chapter 3.
- self | Self | To the immune system, the molecules made by your own body that it has learned to tolerate. "Non-self" is everything else.
- antigen | Antigen | Anything the immune system's specific receptors (on T cells, B cells or antibodies) can recognize. Usually it is a protein or a fragment of one.
- tolerance | Tolerance | The immune system's learned restraint toward the body's own molecules, and toward some harmless foreign ones such as food.
- autoimmunity | Autoimmunity | An immune attack on the body's own healthy tissues, as in type 1 diabetes, multiple sclerosis or rheumatoid arthritis.
- hematopoietic-stem-cell | Hematopoietic (blood-forming) stem cell | A rare cell in the bone marrow that can produce every type of blood cell throughout life: red cells, platelets and the ancestors of all immune cells.
- bone-marrow | Bone marrow | The soft tissue inside bones where blood cells are made, including the ancestors of all immune cells. It holds about 40% of the body's immune cells.
- innate-immunity | Innate immunity | The fast, built-in branch of the immune system. It recognizes broad signs of danger, such as molecules common to bacteria, within minutes to hours.
- adaptive-immunity | Adaptive immunity | The slower, highly specific branch of the immune system (T cells, B cells and antibodies) that learns to recognize particular targets and remembers them.
- neutrophil | Neutrophil | The most abundant immune cell: a short-lived cell that is the first to arrive at an infection, where it engulfs bacteria.
- macrophage | Macrophage | A large immune cell found in nearly every tissue that engulfs microbes and debris and raises the alarm. The name means "big eater."
- dendritic-cell | Dendritic cell | A branching immune cell that samples its surroundings and carries what it finds to lymph nodes to activate T cells.
- lymph-node | Lymph node | A bean-sized organ, one of hundreds along the lymphatic vessels, where immune cells gather and T and B cells meet their targets.
- nk-cell | Natural killer (NK) cell | An innate lymphocyte that kills stressed, infected or abnormal cells without needing prior exposure to that target.
- plasma-cell | Plasma cell | A fully activated B cell that secretes large amounts of a single antibody.
- lymph | Lymph | The clear fluid that drains from tissues through lymphatic vessels and lymph nodes back into the blood.
- spleen | Spleen | An organ in the upper left abdomen that filters the blood and hosts large numbers of T and B cells.
- thymus | Thymus | An organ behind the breastbone where T cells mature and learn to ignore the body's own molecules.

## Sources
1. Sender R, Weiss Y, Navon Y, Milo I, Azulay N, Keren L, Fuchs S, Ben-Zvi D, Noor E, Milo R. The total mass, number, and distribution of immune cells in the human body. *Proc Natl Acad Sci U S A* 2023;120(44):e2308511120. doi:10.1073/pnas.2308511120. Data: gitlab.com/milo-lab-public/distribution-of-immune-cells
2. Milo R, Phillips R. *Cell Biology by the Numbers*. New York: Garland Science; 2015. Online at book.bionumbers.org
3. Sender R, Fuchs S, Milo R. Revised estimates for the number of human and bacteria cells in the body. *PLoS Biol* 2016;14(8):e1002533. doi:10.1371/journal.pbio.1002533
4. Reth M. Matching cellular dimensions with molecular sizes. *Nat Immunol* 2013;14(8):765–767. doi:10.1038/ni.2621
5. Klein S, Cortese M, Winter SL, Wachsmuth-Melm M, Neufeldt CJ, Cerikan B, et al. SARS-CoV-2 structure and replication characterized by in situ cryo-electron tomography. *Nat Commun* 2020;11:5885. doi:10.1038/s41467-020-19619-7
6. Tan YH, Liu M, Nolting B, Go JG, Gervay-Hague J, Liu GY. A nanoengineering approach for investigation and regulation of protein immobilization. *ACS Nano* 2008;2(11):2374–2384. doi:10.1021/nn800508f
7. Nurk S, Koren S, Rhie A, et al. The complete sequence of a human genome. *Science* 2022;376(6588):44–53. doi:10.1126/science.abj6987
8. Amaral P, Carbonell-Sala S, De La Vega FM, et al. The status of the human gene catalogue. *Nature* 2023;622(7981):41–47. doi:10.1038/s41586-023-06490-x
9. Anfinsen CB. Principles that govern the folding of protein chains. *Science* 1973;181(4096):223–230. doi:10.1126/science.181.4096.223
10. Jumper J, Evans R, Pritzel A, et al. Highly accurate protein structure prediction with AlphaFold. *Nature* 2021;596(7873):583–589. doi:10.1038/s41586-021-03819-2
11. Ingram VM. Gene mutations in human haemoglobin: the chemical difference between normal and sickle cell haemoglobin. *Nature* 1957;180(4581):326–328. doi:10.1038/180326a0
12. Kato GJ, Piel FB, Reid CD, et al. Sickle cell disease. *Nat Rev Dis Primers* 2018;4:18010. doi:10.1038/nrdp.2018.10
13. Karna B, Jha SK, Al Zaabi E. Hemoglobin C disease. In: *StatPearls*. Treasure Island (FL): StatPearls Publishing; updated 2023 May 29. PMID:32644469
14. US Food and Drug Administration. FDA approves first gene therapies to treat patients with sickle cell disease [press release]. December 8, 2023. https://www.fda.gov/news-events/press-announcements/fda-approves-first-gene-therapies-treat-patients-sickle-cell-disease
15. Fredholm BB, Bättig K, Holmén J, Nehlig A, Zvartau EE. Actions of caffeine in the brain with special reference to factors that contribute to its widespread use. *Pharmacol Rev* 1999;51(1):83–133. PMID:10049999
16. Murphy K, Weaver C, Berg LJ. *Janeway's Immunobiology*. 10th ed. New York: W. W. Norton; 2022.
17. Foote J, Eisen HN. Kinetic and affinity limits on antibodies produced during immune responses. *Proc Natl Acad Sci U S A* 1995;92(5):1254–1256. doi:10.1073/pnas.92.5.1254
18. Stone JD, Chervin AS, Kranz DM. T-cell receptor binding affinities and kinetics: impact on T-cell activity and specificity. *Immunology* 2009;126(2):165–176. doi:10.1111/j.1365-2567.2008.03015.x
19. Billingham RE, Brent L, Medawar PB. 'Actively acquired tolerance' of foreign cells. *Nature* 1953;172(4379):603–606. doi:10.1038/172603a0
20. Matzinger P. Tolerance, danger, and the extended family. *Annu Rev Immunol* 1994;12:991–1045. doi:10.1146/annurev.iy.12.040194.005015
