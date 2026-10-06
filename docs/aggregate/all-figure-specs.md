

# ===== 01-cells (4 figures) =====

:::figure ch01-scale
title: Seven powers of ten
goal: After using this, the reader has a felt sense of the size ladder (tissue → cell, ~10 µm → bacterium, ~1–2 µm → a typical virus, ~100 nm → antibody, ~10–15 nm → amino acid, under 1 nm) and understands that decisions made by whole immune cells rest on contacts between molecules a few nanometers across.
kind: explorer
stage: dark
spec: |
  CONCEPT. A "Powers of Ten" zoom. One continuous zoom parameter z runs from 0 to 7. The stage's
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
      cells: biconcave discs 7–8 µm wide, matte deep red, NO nucleus. Between the tissue cells: a
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
      double line. Sparse, club-shaped spikes stand ~23–25 nm tall, about a quarter of the particle's
      diameter. They are irregularly spaced (neighbors ~25 nm apart, so only 6–10 show around an
      outline) and tilted at varying angles. Two particles touch the membrane. Keep the styling
      generic and label "virus particles (~100 nm)". Dashed square on part of one particle.
  6 · 100 nm: Part of one virus particle. Its curved envelope crosses the lower part of the stage;
      the whole particle, ~90–100 nm plus spikes, is wider than this view. Show 3–4 spikes, each
      ~23–25 nm tall: a club-shaped head (~16 nm tall, ~13 nm wide) on a thin ~9 nm stalk, at
      varying tilts. 2–3 gold antibodies (#F2B33D, white outline highlight), each ~14 nm across, bind
      spike heads BY THEIR ARM TIPS. Draw each antibody as a Y of 12 compact lumps (protein
      "domains"): 4 per arm and 4 in the stem, with a short flexible hinge where the arms meet the
      stem. An antibody is about 0.6× a spike's height. Label: "antibodies (~10–15 nm)". Dashed
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
  1. Your hand. Everything you can see here is built from units far too small to see. Let's zoom in, magnifying tenfold at each step.
  2. A fingertip, magnified ten times. The ridges of your fingerprint come into view. Every bit of this landscape was built by cells.
  3. A speck of skin, sliced open. It is made of tightly packed layers of cells, with tiny blood vessels running beneath.
  4. Individual cells, most of them 10–20 micrometers across. Red blood cells squeeze through a capillary, while two kinds of immune cell, a large macrophage and a small T cell, patrol the tissue.
  5. A T cell, about 7 micrometers wide, beside a bacterium about 2 micrometers long. Bacteria are complete living cells, but far smaller and simpler than ours. Those faint specks are viruses.
  6. Viruses at a cell's surface. Each is about 100 nanometers across, so some seventy would fit across a T cell. A virus is not a cell: just genetic material in a protein coat, here wrapped in a fatty envelope studded with spikes.
  7. Part of a single virus. Its spike proteins stand about 25 nanometers tall. Y-shaped antibodies, each about 10–15 nanometers across, have latched onto the spike heads with the tips of their arms.
  8. The very tip of one antibody arm gripping the head of one spike. Each bead is a single amino acid, less than a nanometer wide, packed into compact folded lumps. This patch, a few nanometers across, is where recognition happens.
data: |
  Sizes used (all approximate; nature varies):
  - Typical human body cell: ~10–20 µm across [2]
  - Red blood cell: 7–8 µm diameter [2]
  - Resting lymphocyte (T cell): ~7 µm diameter [4]
  - Macrophage: ~15–20 µm; varies by tissue. Derived from [1]: ~600 g of macrophages / ~2×10^11 cells ≈ 3 ng per cell ≈ 2,800 µm³ ≈ 17–18 µm sphere.
  - E. coli: ~2 µm long × ~1 µm wide [2]
  - SARS-CoV-2 virion (enveloped): ~90 nm average envelope diameter (89.8 ± 13.7 nm); prefusion spikes ~23–25 nm tall (trimer head ~16 nm tall and ~13 nm wide, on a ~9 nm stalk); nearest-neighbor spike spacing ~24 nm [5]
  - IgG antibody: ~14.5 × 8.5 × 4 nm; antigen-binding tips ~13.7 nm apart [6]; ~1,300 amino acids folded into 12 domains of ~110 each [16]
  - Typical protein: 3–6 nm diameter [2]; one amino acid: well under 1 nm (~110 Da)
  "What if a T cell were your height?" (scale factor 1.7 m / 7 µm ≈ 240,000; arithmetic only):
  - stop 1–3: You would stand about 400 km tall, roughly the altitude at which the International Space Station orbits.
  - stop 4: A red blood cell would be about as wide as you are tall; a macrophage would be as tall as a giraffe (4–5 m).
  - stop 5: The bacterium would be the size of a house cat (~0.5 m).
  - stop 6: Each virus particle would be the size of a grape (~2.5 cm).
  - stop 7: Each antibody would be the size of a sesame seed (~3 mm).
  - stop 8: Each amino acid would be smaller than a grain of fine sand (~0.15 mm).
alt: An interactive zoom from a human hand down to single molecules, in eight steps of ten. It passes through fingerprint ridges, a slice of skin, individual cells about 10–20 micrometers wide, a 7-micrometer T cell beside a 2-micrometer bacterium, enveloped viruses about 100 nanometers wide with sparse spikes, Y-shaped antibodies 10–15 nanometers across gripping the spike heads, and finally the amino acids where an antibody's arm tip touches its target. A scale bar and captions give the size at each step.
:::

:::figure ch01-gene-to-protein
title: From recipe to machine
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

  LAYOUT (desktop 16:9). A small "Skip to the sandbox" text link sits above the stage and jumps to
  step 6. Left 40% of the stage: the nucleus, a large softly glowing circle with a faint
  double-layered border and one visible pore. Inside it is a short DNA double helix, drawn as a
  flattened ladder for legibility: two backbones with letter-rungs. Right 60%: the cytoplasm, with a
  ribosome (two-lobed bean shape, warm gray-violet; not cell-coded). Across the bottom of the stage
  runs the SEQUENCE STRIP: 9 codon groups of 3 large monospace letter tiles (Inter Mono or similar,
  ≥18 px), with small gaps between codons. Under each codon is its amino-acid label (3-letter code),
  shown once it has been translated; hover or focus shows the full name (e.g. "valine"). Base
  colors: A, C, G and T/U each get a distinct muted hue AND the letter itself (never color alone).
  "Not to scale" tag in a stage corner.

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
  6. SANDBOX: "Change one letter." The strip becomes interactive (tiles get hover/focus states). The
     START codon is locked; its tooltip reads "Changing the start signal would stop the protein being
     made at all." Tapping any other letter opens a small popover with the 3 alternative letters.
     Only ONE letter may differ from the original at a time: choosing a new change reverts the
     previous one. Above the strip, four "Try this" chips apply a change in one tap: "A silent
     change" (codon 6 GAG→GAA), "The sickle-cell change" (codon 6 GAG→GTG), "Hemoglobin C"
     (codon 6 GAG→AAG) and "A stop" (codon 6 GAG→TAG). A "Reset" button restores the original. On
     each change: the tile flashes, the codon is re-translated using the standard genetic code
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
    hemoglobin C. Lysine is charged, not oily, so there is no sticky patch and no sickling. One copy
    causes no symptoms; two usually cause only mild anemia. But inherited together with the
    sickle-cell change from the other parent, it causes a form of sickle-cell disease (HbSC)."
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
  The popover becomes a bottom sheet with 3 large buttons. The verdict card sits below the stage,
  not over it.

  ACCESSIBILITY. Every tile is a button with an aria-label ("codon 6, letter 2, A"). The verdict card
  is an aria-live polite region. Reduced motion: transitions become instant state swaps, and the
  sickling morph becomes a crossfade.
steps:
  1. This is a short stretch of your DNA: the start of the gene for beta-globin, one of the protein chains that make up hemoglobin. The recipe is written in four letters, A, C, G and T.
  2. To use a recipe, the cell first copies it. The two DNA strands part, and a matching strand of messenger RNA is built letter by letter. The copy reads like the recipe, except that RNA uses U where DNA uses T.
  3. The mRNA copy leaves the nucleus through a pore and travels to a ribosome, the cell's protein-building machine. The DNA original stays safely behind.
  4. The ribosome reads the message three letters at a time. Each codon calls for one amino acid: AUG means "start" (methionine), GUG means valine, CAU means histidine, and so on. The chain grows bead by bead until a "stop" codon ends it.
  5. As it grows, the chain folds into a compact shape: oily amino acids tuck inside, and charged ones face the surrounding water. Four chains like this one make a hemoglobin molecule, the oxygen carrier that fills red blood cells.
  6. Now change one letter. Tap any letter and pick a replacement, or start with one of the suggestions. Watch what happens to the amino acid and the protein.
data: |
  Sequence: Homo sapiens HBB, NCBI RefSeq NM_000518.5, CDS positions 1–27 (ATG GTG CAT CTG ACT CCT GAG GAG AAG). Mature beta chain = 146 amino acids.
  Sickle mutation: codon 6 GAG→GTG, Glu→Val [11, 12].
  Hemoglobin C: codon 6 GAG→AAG, Glu→Lys; carriers (AC) asymptomatic, CC mild chronic hemolysis; SC is a sickle-cell disease genotype [12, 13].
alt: A step-by-step animation of how a cell makes a protein chain of hemoglobin. A stretch of DNA from the beta-globin gene is copied into messenger RNA, the copy leaves the nucleus, and a ribosome reads it three letters at a time, adding one amino acid per codon. The chain folds into a compact shape. In the final step the reader can change any single DNA letter. Some changes are silent, some swap one amino acid, and some stop the chain early. The real sickle-cell change (GAG to GTG) makes hemoglobin stick together and bends red blood cells into sickles, while the hemoglobin C change at the same spot does not.
:::

:::figure ch01-binding
title: Fit, stick, let go
goal: After using this, the reader understands that molecules recognize each other by shape and chemical fit; that bound partners constantly let go and rebind; that the snugger the fit (the higher the affinity), the longer partners tend to stay together; that the fraction of receptors occupied depends on both affinity and the number of ligand molecules; and that look-alikes bind, but more weakly.
kind: simulation
stage: dark
spec: |
  SCENE (Canvas 2D; DPR-aware, capped at 2×). The bottom ~22% of the stage is a cell membrane: a
  softly undulating sand-colored band (#E9C9A1) with the cell interior below it. Twelve receptors
  (eight on phones) stand evenly spaced in the membrane. Each has a short stalk crossing the membrane,
  an inner "tail" below the membrane, and on top a cup-shaped binding pocket. The pocket has a
  distinctive notch profile and a small "−" charge mark on its inner wall. Receptors are pale silver
  (#D9DEEA). They are generic, not a specific immune molecule. Above the membrane, ligand molecules
  drift with Brownian motion (small random steps, bouncing softly off the stage edges). Ligands are
  bright cyan-green (#3DDC97). They are drawn ~60% of a pocket's width, so binding is legible.
  "Not to scale; time slowed down" tag in a corner.

  LIGAND SHAPES (selected by the "Fit" control; a shape change morphs over 0.4 s):
    Snug        — a knob whose profile exactly complements the pocket notch, with a "+" mark that
                  lines up with the pocket's "−".
    Look-alike  — roughly right, but one bump is missing and the "+" mark is offset, so the fit is
                  visibly imperfect.
    Wrong shape — a clearly mismatched profile (e.g. a flat block), with no complementary mark.

  RULES. Specify every random event as a RATE per simulated second and convert it per frame as
  p = 1 − exp(−k·dt), so behavior does not depend on the display's frame rate. Run at ~1 simulated
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
  1. Receptors (silver cups) sit in a cell's membrane while ligand molecules drift by at random. When a ligand's shape and charges match a receptor's pocket, it sticks, and the receptor's inner tail lights up to pass the signal inside.
  2. Watch any single ligand: even a snug fit lets go eventually. Binding is a constant dance of on and off, and the snugger the fit, the longer each embrace tends to last.
  3. Switch to the look-alike. It binds, just less firmly, so fewer receptors are occupied at any moment. That is why one receptor can respond to several similar targets, and sometimes mistake friend for foe. Add more ligand molecules and occupancy climbs: a crowd of weak binders can do what a few strong ones do.
  4. Try the wrong shape: almost nothing sticks, however many molecules you add. Recognition depends on fit.
data: |
  Simulation parameters are illustrative, chosen to make relative effects visible; time is compressed and not to scale. Real dwell times range from about a second (T-cell receptors) to hours (high-affinity antibodies) [17, 18]. Only a few ligand molecules are shown, so they can run out; the textbook occupancy formula in the Go-deeper box assumes ligand is in excess.
alt: A simulation of receptor molecules in a cell membrane and ligand molecules drifting above them. Ligands with a snug fit stick for a long time and keep most receptors occupied, though each one eventually lets go. Look-alike ligands stick only briefly, so fewer receptors are occupied unless many more ligand molecules are added. Wrongly shaped ligands almost never stick. A meter shows the fraction of receptors occupied, which sets the strength of the signal inside the cell.
:::

:::figure ch01-census
title: Where your immune cells live
goal: After using this, the reader knows that the immune system is about 1.8 trillion cells and that most live in the bone marrow and lymphatic organs, with only ~2% in the blood. They also learn that neutrophils and T cells are the most numerous, while large macrophages dominate by weight.
kind: chart
stage: light
spec: |
  FORM. A unit (waffle) chart. In COUNT modes, there are 184 small squares, each = 10 billion
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
     Add a small bracket spanning Lymph nodes + Spleen + Thymus labeled "lymphatic organs, 39%".
     Each cluster is a block of squares 10 wide, labeled above with name + share ("Bone marrow,
     40%").
  2. By type: the same 184 squares regroup into 9 clusters, one per group, in descending order.
     Each is labeled above with name + count to two significant figures ("Neutrophils, ≈ 660
     billion"); the exact value appears in the tooltip.
  3. By weight: the squares re-flow into 122 weight squares, clustered by group as in view 2. Create
     or remove squares with a fade; it's fine if objects don't map 1:1 here. Macrophages (60
     squares) should visibly dominate.

  INTERACTION. Hover/tap a square for a tooltip: "T cells in lymph nodes: ~220 billion" (count
  views) or "Macrophages: ~600 g" (weight view). The legend lists the 9 groups with a one-line
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
  NK cells #FF8A3D. Other: a neutral warm gray with a darker stroke. Mast cells are not in the
  palette; the art agent should assign a hue that clashes with no defined entity (avoid the cancer
  violet, Treg lavender and fibroblast beige). On the light stage, give pale fills a darker 1 px
  stroke, so every square has ≥3:1 contrast against the background.

  CAPTION under the chart: the caption for the active view (steps 1–3), in an aria-live region.
  Footnote in small type: "Estimates for a reference 73-kg adult man (Sender et al., 2023). Each
  number has wide error bars. Blank combinations mean 'not estimated', not 'absent'. For example,
  dendritic cells also live in the gut and lungs."

  MOBILE. Clusters are 8 squares wide and stack vertically in a single column, with labels above
  each cluster. The segmented control is full width. Tooltips become a tap-to-show info row pinned
  under the chart.

  REDUCED MOTION. Views switch with an instant re-layout or a 150 ms crossfade, with no flying
  squares.
steps:
  1. Each square is 10 billion immune cells, about 1.8 trillion in all, sorted by where they live. Four in five are in the bone marrow and the lymphatic organs: lymph nodes, spleen and thymus. Only about 2% are in the blood at any moment.
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


# ===== 02-innate (4 figures) =====

:::figure ch02-pattern-recognition
title: Alarm bells for generic danger
goal: After using this, the reader understands that innate sensors recognize broad molecular signatures shared by whole classes of microbes (or released by damaged cells), that different sensors sit in different places in the cell, that each kind of threat triggers a matching alarm (inflammatory cytokines or antiviral interferons), and that healthy cells, and most cancer cells, trigger nothing.
kind: explorer
stage: dark
spec: |
  CONCEPT. A "sensor panel" game. The reader offers different things to a sentinel cell (a macrophage) and
  watches which of its sensors light up, where in the cell they are, and which alarm the cell sends out.

  LAYOUT (desktop, landscape viewBox about 1000x620).
  - Left ~62%: one large macrophage (coral #FF7A6B; amoeboid outline with soft ruffles; translucent
    cytoplasm) drawn as a cutaway so three zones are visible, each labeled with a thin leader line:
    (a) "Outer surface": the membrane edge facing right, toward the tray.
    (b) "Digestion bubble": ONE round internal compartment (an endosome), about 22% of the cell's diameter,
        upper middle of the cell, with its own thin membrane.
    (c) "Interior": the cytoplasm around it. In the interior, also draw one short, curved strip of
        internal membrane (a fragment of the endoplasmic reticulum, ER), unlabeled in plain mode; it carries
        the small STING glyph described below.
    A rounded nucleus (darker coral) sits lower-left inside the cell.
  - Eight sensor glyphs, neutral silver-gray (#D9DEEA at 60% opacity) when idle. Three different glyph types:
    RECEPTOR glyphs (a stem with a cupped head, like a tiny "C" clamp, about 1/20 of the cell's diameter);
    a GATE glyph (a short channel through the membrane, two parallel bars with a gap); and an ASSEMBLY glyph
    (6–7 small scattered pieces that snap together into a ring when triggered).
      On the OUTER SURFACE (spanning the membrane, heads facing outward):
        1 "Bacterial-wall sensor" (receptor glyph)   2 "Flagellum sensor" (receptor glyph)
        3 "ATP gate" (gate glyph)
      In the DIGESTION BUBBLE's membrane (heads facing INTO the bubble):
        4 "Viral-RNA sensor" (receptor glyph)   5 "Microbial-DNA sensor" (receptor glyph)
      In the INTERIOR (cytoplasm):
        6 "Interior RNA sensor" (receptor glyph, free-floating)
        7 "Misplaced-DNA sensor" (receptor glyph, free-floating). Next to it, on the ER membrane strip, a
          small partner glyph (STING) that glows when sensor 7 fires; a faint dotted line links them.
        8 "Damage sensor" (assembly glyph: scattered pieces that assemble into a ring when triggered)
  - Right ~38%: the "tray", five cards stacked vertically, each with a small illustration and a name:
    "Swimming bacterium", "Virus", "Crushed body cell", "Healthy body cell", "Cancer cell".
  - Below the stage (HTML, not SVG): a readout panel with four rows (Detected / Sensors / Where / Alarm),
    a legend, and a toggle "Show molecular names".

  SUSPECT ILLUSTRATIONS.
  - Swimming bacterium: chartreuse #B5D94A rod with rounded ends and one long wavy tail (flagellum);
    a faint fringe on its outer surface represents LPS.
  - Virus: red-coral #FF4D5E small icosahedral particle with short spikes. Drawn hugely enlarged:
    put a small "not to scale" note in a stage corner.
  - Crushed body cell: sand #E9C9A1, broken outline with a gap; small particles spilling out.
  - Healthy body cell: sand #E9C9A1, intact rounded polygon with a neat round nucleus.
  - Cancer cell: violet-magenta #B65FD8, lumpy irregular outline, large misshapen nucleus.

  PATTERN TOKENS. Each pattern has a unique SHAPE, so color is never the only cue:
  LPS = tiny comb/fringe; flagellin = short helical spring; viral RNA = single wavy line;
  microbial DNA = double wavy line (ladder); ATP = small dot; the body's own DNA = double wavy line in sand
  color; uric-acid crystal = small angular needle (crystals appear only OUTSIDE cells, after spilling).

  INTERACTION. Tap/click a card, or drag it onto the cell (both must work; cards are keyboard-focusable
  buttons). One suspect at a time; choosing another fades the scene back to idle (0.4 s) and starts again.

  ANIMATION (about 3 s, eased; physical, never flashing):
  1. The suspect floats from the tray to the cell's outer surface.
  2. Matching SURFACE receptors bind their tokens: the receptor head closes around the token and glows (warm
     white-gold glow, plus a thicker outline so the change is not color-only).
  3. Bacterium: the membrane wraps around it and pinches it into the digestion bubble, where it breaks open
     and reveals DNA tokens; sensor 5 lights. Virus: part of it enters the digestion bubble (sensor 4 lights)
     and part releases its RNA into the interior (sensor 6 lights).
  4. Each lit sensor sends a soft pulse along a thin line to the nucleus (0.5 s).
  5. The nucleus brightens and the cell releases a plume of output particles into the stage background:
     - Small coral DOTS. Legend: "Inflammatory cytokines: call for help".
     - Small HOLLOW RINGS in pale blue #9FD3FF (shape differs from the dots). Legend: "Interferons (antiviral
       cytokines): warn the neighbors".
  Lit sensors stay lit until the next suspect is chosen.
  IMPORTANT: sensors 3 (ATP gate) and 8 (damage sensor) never "grab" a token. The gate OPENS (its bars part)
  and lets a pulse through; the damage sensor ASSEMBLES (its pieces snap into a ring) and then glows.

  OUTCOMES (implement exactly; readout text is shown to readers verbatim):
  - Swimming bacterium: sensors 1 and 2 at the surface; after engulfing, sensor 5 in the bubble.
    Output: inflammatory cytokines only.
    Detected: "LPS from the outer wall, flagellin from the tail, and bacterial DNA once the bacterium is digested."
    Sensors: "Bacterial-wall, flagellum and microbial-DNA sensors."
    Where: "On the surface first, then inside the digestion bubble."
    Alarm: "Inflammatory cytokines: call for reinforcements."
  - Virus: sensors 4 (bubble) and 6 (interior). Output: strong interferon plume plus a smaller cytokine plume.
    Detected: "Viral RNA in forms our own cells rarely make, such as long double strands."
    Sensors: "Viral-RNA sensor in the bubble; interior RNA sensor."
    Where: "Inside the cell. From the outside, a virus offers few patterns to grab."
    Alarm: "Interferons warn the neighbors; some inflammatory cytokines too."
  - Crushed body cell: as its particles spill, small needle-shaped crystals form outside it. ATP dots touch
    the outer surface: the ATP gate (3) opens and a pulse runs inward. A crystal is swallowed into the
    digestion bubble, and the bubble's membrane tears (a small visible rip). Both events converge on the
    damage sensor (8), which assembles into its ring and glows. A few DNA strands reach the interior and
    sensor 7 lights faintly. Output: moderate inflammatory-cytokine plume.
    Detected: "Molecules that belong inside cells (ATP, DNA, uric acid) spilled outside, where uric acid forms crystals."
    Sensors: "ATP gate, damage sensor, misplaced-DNA sensor."
    Where: "At the surface and inside the sentinel. The damage sensor reacts to the disturbance these spilled molecules cause, not to the molecules themselves."
    Alarm: "Inflammatory cytokines, with no microbe in sight. This is why injuries swell even without infection."
  - Healthy body cell: it drifts up, touches the macrophage, and drifts back. NOTHING lights.
    Detected: "Nothing. Every molecule here is 'self', and in its proper place." Alarm: "None."
  - Cancer cell: it drifts up and touches; nothing lights.
    Detected: "Almost nothing. Cancer cells are built from the body's own molecules and rarely carry
    microbial patterns." Alarm: "None, so far."
    Then show a secondary button inside the readout: "What if it dies messily?" Pressing it ruptures the
    cancer cell; DNA and ATP tokens spill. The ATP gate opens, the damage sensor assembles, and the
    misplaced-DNA sensor (7) lights, with its STING partner glowing on the ER strip. A small interferon plume
    and a small cytokine plume appear. Readout becomes: "Dying cancer cells can spill DNA that trips the
    misplaced-DNA sensor, producing interferons. In nearby dendritic cells, this is one way the immune
    system first notices a tumor (Chapter 7)."

  "Show molecular names" toggle swaps the plain labels for: 1 TLR4, 2 TLR5, 3 P2X7, 4 TLR8 (and TLR7),
  5 TLR9, 6 RIG-I, 7 cGAS (and its partner STING, labeled on the ER strip), 8 NLRP3 inflammasome.
  When the toggle is on, show one line under the legend: "In human macrophages, TLR8 does most of the RNA
  sensing, and TLR9 works mainly in other immune cells (plasmacytoid dendritic cells and B cells). This
  sentinel is drawn with the full set for simplicity." Plain labels are the default.

  SCIENCE: DO NOT CHANGE.
  - TLR4 and TLR5 sit on the outer surface; TLR8/7 and TLR9 sit in the digestion-bubble membrane, never on
    the outer surface. RIG-I, cGAS and NLRP3 work in the cell interior (cytoplasm), never inside the bubble
    or on the outer surface. STING is NOT free-floating: it sits on the ER membrane strip.
  - NLRP3 (damage sensor) does not bind ATP or crystals. ATP is detected at the surface by the P2X7 gate;
    crystals act by rupturing the digestion bubble; NLRP3 responds to these disturbances by assembling.
  - Uric acid is dissolved inside cells; it forms crystals only after release. Do not draw crystals inside
    the intact or crushed cell.
  - The healthy cell must trigger nothing.
  - Sensors recognize CLASSES of molecules, not species. Never label a sensor "E. coli sensor" or "flu sensor".
  - The macrophage does not learn the specific suspect: offering the same suspect twice gives the same
    response.
  - Scale: macrophage about 20 µm across (roughly 1.5× a neutrophil); bacterium about 1–2 µm (≈1/12 of the
    macrophage); virus about 0.1 µm (drawn hugely enlarged, hence "not to scale"). Body cells are roughly
    macrophage-sized; on tray cards they can be drawn small, and only part of them needs to touch the macrophage.
  - Acceptable simplifications (leave out): helper proteins (e.g., MD-2 for TLR4), the many signaling steps,
    and the inflammasome's need for a "priming" signal.

  MOBILE (≤600 px). Portrait viewBox (about 420x640): the cell fills the top ~65% of the stage at full width,
  with the three zone labels kept. The tray becomes a row of five HTML buttons (wrapping to 3+2) below the
  stage; the readout sits below the tray. If sensor labels crowd, show numbered sensor badges in the SVG and
  list the names in a compact legend under the stage (minimum font 12 px).
  REDUCED MOTION: skip travel and engulfing tweens; cross-fade straight to the end state (sensors lit, plume static).
alt: A large macrophage is shown in cutaway with sensors on its outer surface, inside an internal digestion bubble, and in its interior. The reader offers it a bacterium, a virus, a crushed body cell, a healthy cell or a cancer cell. The bacterium and virus light up specific sensors and make the macrophage release inflammatory cytokines or antiviral interferons; the crushed cell triggers a damage sensor; the healthy cell and the intact cancer cell trigger nothing.
:::

:::figure ch02-inflammation
title: Anatomy of an inflammation
goal: After stepping through this, the reader can explain each of the four classic signs of inflammation (redness, heat, swelling, pain) by its mechanism, and describe how neutrophils leave the blood (roll, stick, squeeze through) to reach bacteria, in the right order and on roughly the right time scale.
kind: stepper
stage: dark
spec: |
  LAYOUT (desktop, landscape viewBox about 1000x600). A side-on cross-section through skin, NOT to scale
  (say so in a small corner label).
  - Top band (~15% of height): the skin surface, layered sand/beige strata. A splinter (warm brown wooden
    shard, only its tip visible; it is millimeters long while cells are micrometers) pierces it diagonally
    from the upper left.
  - Middle (~50%): loose connective tissue (faint wavy fibers on the dark stage). In it: one resident
    macrophage (coral #FF7A6B, amoeboid, ruffled edge), one mast cell (pale lilac-gray #C9C2D6 body densely
    packed with deep-indigo #5B5FA8 granules, round nucleus; it must look clearly different from the
    neutrophil), and one fine nerve ending (thin, pale, branching line ending near the splinter).
  - Bottom (~35%): a small blood vessel (a postcapillary venule) running horizontally across the stage. Its
    wall is a row of flat endothelial cells (thin tiles with visible junctions). Inside, blood flows left to
    right carrying red blood cells (wine-red #9E2B3A biconcave discs, seen side-on as rounded lozenges) and a
    few neutrophils (pale pink #F4A6C8, round, with a multi-lobed nucleus of 3–4 connected lobes, and fine granules).
  - HUD, top right: four badges, each an icon plus a word: Redness (drop icon), Heat (thermometer),
    Swelling (outward arrows), Pain (lightning-bolt nerve icon). Unlit = outline only; lit = filled plus glow.
    Never rely on color alone.
  - HUD, top left: an approximate clock label that changes per step ("0 min", "first minutes", "first hour",
    "hours", "first day", "days"). Use these phrases only; no precise times.

  CONTROLS (HTML under the stage): Back / Next buttons and step dots (clickable), with the dots GROUPED into
  three labeled phases: "The alarm" (steps 1–2), "The four signs" (steps 3–5), "The reinforcements" (steps 6–9).
  "Play all" auto-advances with a per-step hold of 2.5 s + 0.35 s per caption word (≈10–12 s per step);
  it pauses on any interaction. "Restart". Caption region is an ARIA live region. Each step animates into its
  state in 1.5–2.5 s, then holds a calm idle loop (blood flowing, cells breathing). Going Back restores the
  previous state exactly.

  STEP STATES.
  1. Splinter enters; about 12 bacteria (chartreuse #B5D94A, small rods and spheres, ~1/10 of a neutrophil's
     diameter) spill into the tissue near the tip and drift slightly. Clock "0 min". All badges unlit.
  2. Macrophage's surface sensors glow briefly (echo of the previous figure). It releases coral dots
     (cytokines) that spread, plus smaller dots arranged as a gradient (chemokines), densest near the bacteria.
     Mast cell empties its granules: indigo dots (histamine) burst outward gently. Clock "first minutes".
  3. The vessel widens smoothly (diameter ×1.4). More red blood cells stream through. The tissue background
     warms (a soft warm tint radiating from the vessel). Badges Redness and Heat light. Clock "first minutes".
  4. Gaps open between some endothelial tiles near the site. Translucent pale-blue fluid particles seep out
     into the tissue (red blood cells stay inside). The tissue region expands, and the skin surface above it
     bulges upward slightly. Inside the vessel, the red cells crowd together and the flow slows to about half
     speed. Badge Swelling lights. Clock "first hour".
  5. Small pale-yellow dots (prostaglandins) reach the nerve ending; it brightens and sends a few slow pulses
     upward along its length. Badge Pain lights. Clock "first hour".
  6. Endothelial cells near the site sprout tiny hook-shaped "sticky" molecules on their inner surface.
     Passing neutrophils catch on them and ROLL: they rotate while moving slowly along the wall, much slower than
     the red cells streaming past. Clock "hours".
  7. Chemokine dots on the wall touch a rolling neutrophil; it flattens and stops (firm arrest). It then
     squeezes through a gap between two endothelial cells, deforming into an hourglass shape, and emerges into
     the tissue. Stagger 3–5 neutrophils doing this one after another. Clock "hours".
  8. Neutrophils crawl up the chemokine gradient to the bacteria and engulf them: membrane wraps around a
     bacterium, which ends up inside a bubble in the neutrophil and fades. Several neutrophils then turn gray
     and break apart; their remains collect near the splinter as a pale-yellow cluster labeled "pus".
     Clock "first day".
  9. Bacteria gone. The macrophage eats dead neutrophils; its color shifts slowly from coral #FF7A6B toward
     dusky rose #B7727E (repair mode, previewing a later figure). The vessel narrows back, gaps close, the
     swelling subsides, the warm tint fades, and all four badges dim to outline. Clock "days".

  SCIENCE: DO NOT CHANGE.
  - Neutrophils leave at small venules, never through an artery. Order is fixed: roll → stick → squeeze through.
  - Rolling uses weak, fast on/off bonds (selectins); firm sticking uses a different, stronger grip
    (integrins) that is switched on by chemokines. Show these as visually distinct molecules.
  - Neutrophils mostly squeeze BETWEEN endothelial cells (showing that is fine).
  - Red blood cells do not leave the vessel.
  - Sizes: red blood cell ~7.5 µm; neutrophil ~12–15 µm (about 1.7× a red cell); macrophage about 1.5× a
    neutrophil or more; bacteria ~1–2 µm. The vessel may be drawn wider than real for clarity.
  - Swelling is mainly fluid leaking out of vessels; heat and redness are mainly more blood flowing through.
  MOBILE: portrait viewBox (about 420x700) with the same top-to-bottom layering (skin, tissue, vessel); the
  vessel runs horizontally across the full width. Badges become a single row of four icons above the stage;
  the clock sits at the stage's top left. Phase labels sit above the step dots. Controls stay as large touch targets.
  REDUCED MOTION: jump to each step's end state; no idle loops (blood shown static).
steps:
  1. A splinter breaks the skin and carries bacteria into the tissue below. Warm and well fed, they begin to multiply.
  2. A resident macrophage detects the bacteria and sounds the alarm: cytokines call for help, and chemokines lay a scent trail. A nearby mast cell empties its histamine.
  3. Cytokines and histamine widen the blood vessels. Small arteries upstream relax, so more warm blood from the body's core pours into vessels like this one, and the skin turns red and hot.
  4. The cells lining the vessel loosen their grip on each other, and fluid leaks into the tissue. That leak is the swelling, and it carries defensive blood proteins to the site.
  5. Chemicals such as prostaglandins make nerve endings fire more easily, and the swelling adds pressure. Pain is the body asking you to protect the injured spot.
  6. Blood flow has slowed. Near the infection, the vessel lining puts out sticky molecules; passing neutrophils catch on them, let go and catch again, so they roll along the wall.
  7. Chemokines on the vessel wall switch on a much stronger grip. The neutrophil stops, flattens, and squeezes out between the lining cells into the tissue.
  8. Neutrophils follow the chemokine trail to the bacteria and swallow them. Many neutrophils die in the process; their remains, mixed with dead bacteria, are pus.
  9. Once the bacteria are gone, macrophages clear away the dead neutrophils and switch toward repair. The vessels tighten, the swelling drains, and the four signs fade.
alt: A cross-section of skin with a splinter, tissue and a blood vessel. In nine steps grouped into three phases, bacteria enter; a macrophage and a mast cell release alarm signals; the vessel widens (redness, heat) and leaks fluid (swelling); nerve endings are sensitized (pain); neutrophils roll along the vessel wall, stick, squeeze out, and eat the bacteria, forming pus; finally macrophages clean up and the signs fade.
:::

:::figure ch02-nk-missing-self
title: The missing-self balance
goal: After playing with this, the reader understands that an NK cell weighs "stop" signals (MHC class I in the shop window) against "go" signals (stress ligands), kills when go outweighs stop, and that a cancer cell which empties its shop window to hide from killer T cells can thereby become visible to NK cells.
kind: explorer
stage: dark
spec: |
  LAYOUT (desktop, landscape viewBox about 1000x560).
  - Left: an NK cell (orange #FF8A3D, round, visible darker-orange granules inside, fine surface texture).
    Right: the TARGET cell (about the same size or slightly larger), whose look depends on the target type:
    Healthy = sand #E9C9A1 calm rounded polygon with neat nucleus; Infected = the same sand cell with 4–6
    small red-coral #FF4D5E virus particles visible inside; Cancer = violet-magenta #B65FD8, lumpy outline,
    large misshapen nucleus. The two cells nearly touch in the middle (the "contact zone").
  - On the target's surface: up to 8 SHOP-WINDOW DISPLAYS (MHC class I: pale silver #D9DEEA small cups, each
    holding a sand-colored bead) and up to 8 STRESS FLAGS (stress ligands: small pennant glyphs in green-cyan
    #3DDC97 with a "+" mark). Both are spread around the WHOLE target outline (counts scale with the sliders);
    only those in the contact zone pair up with the NK cell.
  - On the NK cell's facing surface: inhibitory receptors (crimson #E5484D, flat-topped "T"/bar shape with a
    "−" mark) and activating receptors (green-cyan #3DDC97, arrow-head shape with a "+" mark). When a receptor
    meets its partner, a short bond line forms and glows. Inhibitory pairs with displays; activating with flags.
  - Top center: a BALANCE (a beam on a fulcrum). Left pan "STOP (−)" fills with small crimson weights (one per
    bound display, each with a "−"). Right pan "GO (+)" holds two small hollow green weights labeled "everyday
    activating signals" plus one solid green weight per bound flag (each with a "+"). The beam tilts smoothly
    with the net signal. Under the beam, a verdict chip: "Spare", "Undecided" or "Kill" (text plus icon:
    open hand / question mark / target ring).
  - Under the verdict chip, ONE line of text: the "T-cell note" (rules below). No other inset.
    No faces or eyes on any cell.

  CONTROLS (HTML below the stage):
  - Slider A: "Shop window: MHC class I on display", 0–100%.
  - Slider B: "Stress ligands (flags)", 0–100%.
  - Preset buttons (each sets target type and both sliders, then automatically runs the decision):
      "Healthy cell" → Healthy, window 100%, flags 5%
      "Virus-infected cell hiding from T cells" → Infected, window 15%, flags 70%
      "Cancer cell that kept its window" → Cancer, window 90%, flags 55%
      "Cancer cell that emptied its window" → Cancer, window 10%, flags 65%
  - Button "Let the NK cell decide" (runs the decision animation for the current slider values).
  Moving sliders updates displays, flags, bonds, beam tilt, verdict chip and T-cell note LIVE; the kill/spare
  animation runs only on preset or button press. Sliders keep the current target type.

  MODEL (a deliberate simplification; implement exactly):
    I (stop) = window            (0..1)
    A (go)   = 0.2 + 0.8 × flags (0.2 = everyday activating signals most nucleated cells carry)
    net = A − I
    verdict = "Kill" if net ≥ 0.15; "Spare" if net ≤ −0.10; otherwise "Undecided".
    Beam tilt = clamp(net, −1, 1) × 18°. Visible display count = round(window × 8); flag count = round(flags × 8).
  Check: Healthy → Spare; Infected hiding → Kill; Cancer kept window → Spare; Cancer emptied window → Kill;
  flags 100% with window 90% → Undecided (strong stress can partly override the window).

  T-CELL NOTE (shown verbatim; one line):
    Healthy target (any window value > 0): "A killer T cell would see only normal fragments and move on."
    Infected/Cancer, window ≥ 30%: "A killer T cell can read this window and may spot the abnormal fragments (Chapters 4–5)."
    Infected/Cancer, 0 < window < 30%: "With few windows left, a killer T cell may miss this cell."
    Any target, window = 0: "With no window at all, a killer T cell cannot see this cell."
  When the preset "Cancer cell that emptied its window" is active and the verdict is Kill, add a second line:
  "Hiding from T cells made it visible to NK cells."

  DECISION ANIMATION.
  - Kill (≈2.5 s): granules inside the NK cell glide to the contact side (0.6 s); a small puff crosses the gap:
    tiny ring shapes (perforin) settle into the target's membrane, tiny dots (granzymes) pass inside. The
    target shrinks slightly, its outline buckles into 3–5 rounded blebs that separate (apoptosis) and fade.
    The NK cell detaches and glides a little away, ready for the next target (it survives and can kill again).
    Then show "New target" to restore the target with current settings.
  - Spare (≈1.2 s): the bonds release and the NK cell drifts slightly away, then settles.
  - Undecided: the NK cell stays in contact; the contact zone pulses slowly (no flashing).

  SCIENCE: DO NOT CHANGE.
  - NK inhibitory receptors care mainly THAT MHC class I is present, not which fragment it holds. Do not
    show NK cells reading the bead in the window.
  - Killer T cells are extremely sensitive: a handful of displays can be enough. Never describe a T cell as
    blind unless the window is completely empty (0%).
  - The NK cell needs no prior exposure to the target. Its tools are perforin and granzymes, causing
    apoptosis (an orderly shrink-and-fragment death), not an explosion.
  - Real NK cells integrate many receptor types; the two-slider balance is an acknowledged simplification.
  - Sizes: NK cell about 10–12 µm (slightly larger than a resting T cell); body cells about 10–20 µm.
  MOBILE: portrait viewBox (about 420x620): the balance across the top of the stage; NK cell top-center and
  target bottom-center with the contact zone between them; verdict chip and T-cell note below the stage as
  HTML. Sliders full-width; presets as a 2x2 grid of buttons.
  REDUCED MOTION: no idle pulsing; decisions cross-fade directly to the end state (target fragmented or intact).
alt: An NK cell faces a target cell. Two sliders set how much MHC class I the target shows in its "shop window" and how many stress ligands (flags) it displays; a balance weighs stop signals from the window against go signals from the flags. Healthy cells with a full window are spared; infected or cancerous cells that have emptied their window and show stress flags are killed. A note explains that an emptied window makes the cell hard for killer T cells to see but exposes it to NK cells.
:::

:::figure ch02-macrophage-spectrum
title: Fight mode, repair mode
goal: After using this, the reader understands that a macrophage's behavior is set by the signals around it along a continuum from "fight" to "repair", that "M1" and "M2" are textbook labels for the two ends of that continuum, and that tumors push macrophages toward the repair end, where they feed the tumor and quiet T cells.
kind: explorer
stage: dark
spec: |
  LAYOUT (desktop, landscape viewBox about 1000x560).
  - Let s be the slider value, from 0 (fight end) to 1 (repair end); the default on load is s = 0.3.
  - Center: one large macrophage. Its fill interpolates continuously from coral #FF7A6B (s = 0) to dusky rose
    #B7727E (s = 1). Its outline morphs too: fight end = more ruffled and spiky, with small vacuoles; repair
    end = smoother, slightly elongated, calmer. Interpolate shape and color smoothly; never snap between states.
  - Around it, six labeled "output" vignettes, three per side, whose opacity follows the slider:
      FIGHT outputs (opacity = 1 − s), on the left:
        (a) "Kills microbes": two or three chartreuse #B5D94A bacteria near the cell with tiny spark marks;
            they fade as if destroyed.
        (b) "Calls reinforcements": coral dots streaming outward (inflammatory cytokines).
        (c) "Wakes T cells": a small blue #4C8DFF T cell at the lower edge brightens, with a "+" mark.
      REPAIR outputs (opacity = s), on the right:
        (d) "Grows blood vessels": a thin vessel sprout (wine-red #9E2B3A lined tube) grows from the stage
            edge toward the macrophage.
        (e) "Rebuilds tissue": a spindle-shaped fibroblast (gray-beige #9C8F80) lays down a few fine fibers.
        (f) "Calms T cells": the same blue T cell dims, with a "−" mark (crimson #E5484D bar icon).
    At mid-slider, both sets are partly visible: mixed states are real, so this is intended.
  - Slider (HTML, full width under the stage): "Signals in the neighborhood". Left end label: "Danger:
    microbes, interferon-gamma". Right end label: "Calm-down and repair signals: IL-4, IL-10, TGF-β". Under
    the two ends, small gray labels in quotes: "'M1'" and "'M2'", with a footnote line: "Textbook labels for
    the two ends of a spectrum."
  - One toggle, "Place it in a tumor": violet-magenta #B65FD8 cancer cells (lumpy, 5–7 of them) fade in
    around the edges and emit small violet dots that drift toward the macrophage (legend: "tumor signals:
    CSF-1, IL-10, TGF-β, lactate, low oxygen"). A small arrow above the slider reads "tumor signals push this
    way →". When the toggle is switched ON, the slider thumb glides ONCE (over ~2 s) to s = 0.85; after that it
    stays fully under the reader's control (never auto-drifts again). The macrophage gets the label
    "tumor-associated macrophage"; the vessel sprout grows toward the cancer cells. Switching the toggle OFF
    removes the cancer cells and the label but leaves the slider where it is.
  CAPTION STATES (HTML caption under the stage; shown verbatim; pick by state):
    Toggle off, s < 0.33: "Fight mode. Surrounded by microbial signals and interferon-gamma, the macrophage kills what it eats and calls for help."
    Toggle off, 0.33 ≤ s ≤ 0.66: "In between. Real macrophages often run parts of both programs at once; 'M1' and 'M2' are just labels for the two ends."
    Toggle off, s > 0.66: "Repair mode. After the danger has passed, the macrophage calms inflammation, grows blood vessels and rebuilds tissue."
    Toggle on (any s): "Inside a tumor, signals from cancer cells push the macrophage toward repair mode. It feeds the tumor's blood supply and quiets T cells: a wound that never heals."

  SCIENCE: DO NOT CHANGE.
  - The same macrophage can move in either direction; the slider must be fully reversible (plasticity).
  - Repair mode is not "bad": it is essential for healing. Only its hijacking by tumors is harmful.
  - IFN-γ plus microbial products push toward fight; IL-4/IL-13, IL-10 and TGF-β push toward repair.
  - Do not label the tumor-associated macrophage "M2"; it sits toward, not at, the repair end.
  MOBILE: portrait viewBox (about 420x600) with the macrophage centered, fight vignettes above it and repair
  vignettes below; the slider and toggle stack full-width below the stage.
  REDUCED MOTION: no drifting particles; outputs change opacity instantly; the tumor toggle sets s = 0.85 instantly.
alt: A single macrophage changes color and shape as a slider moves from danger signals to calm-down and repair signals. At the fight end it kills bacteria, releases inflammatory cytokines and activates a T cell; at the repair end it grows blood vessels, helps rebuild tissue and quiets the T cell; in between, it does some of both. Placing it in a tumor pushes it toward the repair end.
:::


# ===== 03-adaptive (4 figures) =====

:::figure ch03-vdj
title: Shuffle the deck
goal: After using this, the reader understands that each developing B cell builds its receptor by picking one V, one D and one J segment at random and joining them with random edits at the seams; that this yields a practically unlimited variety from a few dozen pieces; that each cell ends up with one receptor, inherited by all its descendants; and that many attempts fail.
kind: simulation
stage: dark
spec: |
  PURPOSE: a "slot machine" that assembles an antibody heavy chain from gene segments, shows the random seams, and drops the finished B cell into a growing "library" shelf. The reader should feel both the combinatorial explosion and the waste. Keep the first encounter simple and reveal more only after the reader has built a cell.

  PROGRESSIVE DISCLOSURE (three stages):
  - STAGE A (on load): only the DNA band, the B-cell area (an empty amber outline labeled "a young B cell") and one primary button "Build a B cell". The step caption (HTML, aria-live) reads step 1.
  - STAGE B (after the first successful build): fade in the COUNTER panel and the LIBRARY shelf, and two more buttons: "Build another" and "Same pieces, new seams".
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
  3. B-CELL AREA (bottom left): the finished B cell (amber #F2B33D, round, soft glow) with 6–8 identical Y-shaped receptors around its membrane. All receptors on one cell share one procedurally generated tip silhouette (see "Tip shape"); a subtle synchronized pulse emphasizes that they are identical. The light chain is drawn as a paler outer strip on each arm.
  4. LIBRARY SHELF (bottom right, Stage B+): a grid of small B-cell thumbnails, each with its own tip silhouette. Failed cells appear as faint gray outlines with an "×" glyph.
  5. COUNTER PANEL (top right, Stage B+; small Inter text):
     - "Heavy-chain choices: ≈40 × 23 × 6 = 5,520"
     - "× light-chain choices ≈320 → ≈1.8 million"
     - "× thousands of ways each seam can come out → 10¹⁵ or more (rough multiplication)"
     - Live tallies: "Cells built: n · Different receptors: n · Failed: m"
     Compute "Different receptors" honestly by comparing full builds (heavy V, D, J and both seams' letters, plus light V, J and seam letters). Duplicates are possible but astronomically rare; never force the tally.

  TIP SHAPE (important for the teaching): derive the tip silhouette deterministically from the build, using a small hash. The outer edges of the tip come mostly from the V choice (cells sharing a V look like relatives), while the CENTER notch comes from the seam letters. This makes the key lesson visible: same segments + different seams = a visibly different center of the binding tip.

  BUILD ANIMATION (heavy chain; the order is scientifically required). Each phase is tied to one step caption. Phases auto-advance (~1.5 s each); a small Pause/Next control under the caption lets the reader hold or step through.
  Phase 1 (step 1): the ribbon is shown whole; tiles shimmer briefly.
  Phase 2 (step 2): two small pale "RAG" glyphs (paired clamps, labeled "RAG") settle on one random D tile and one random J tile; those tiles brighten and show their labels. The DNA between them bows up into a loop; RAG snips at the loop's base; a small "repair" glyph (a stitch mark) seals the ribbon; the loop closes into a small circle and drifts up and fades ("cut out and lost").
  Phase 3 (step 3): the seam lens opens over the D–J join: 0–4 letters trimmed from each end, then 0–6 random letters added. Randomize per build.
  Phase 4 (step 4): the same for V: RAG picks a random V and the D–J unit; the DNA between them loops out, is snipped and fades; repair seals; seam lens over the V–D join.
  Phase 5 (step 5): reading-frame check. A thin "reading frame" bar slides along the new gene in three-letter ticks. Decide in-frame vs out-of-frame from the actual seam letter counts (net length change mod 3 = 0 → in frame), which naturally gives about 1 in 3 success per attempt. If out of frame, the bar breaks into a jagged dashed line with a "frame shift" icon and the message "Out of frame: this gene makes gibberish." A second, ghosted ribbon labeled "copy from the other parent" slides up and the build repeats quickly. If that also fails, the B-cell outline turns gray, shrinks and fades, and a failed thumbnail drops into the library. (The roughly 4-in-9 failure rate this produces is a property of the simplified model; never display it as a measured biological rate.)
  Phase 6 (step 6): if in frame, the caption notes that the light chain is built the same way; do NOT animate the light chain (simplification: in the figure it always succeeds). Receptors appear on the B cell; a thumbnail drops into the library.
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

  MOBILE (portrait, ≤600px): the V group wraps onto two rows of 20; D, J and C sit on the next row. The seam lens appears as a centered overlay. The B cell sits below the DNA; the counter panel below the cell; the library becomes a 5-column grid ("Build 100" shows the first 50 with "+50 more"). Buttons full width, stacked.
  REDUCED MOTION: "Build a B cell" jumps to the end state with a static before/after of the DNA and the finished cell; seam edits are listed as text ("−2 letters, +4 random letters").
steps:
  1. Every young B cell starts with the same inherited DNA: rows of alternative V, D and J segments, far more pieces than one receptor needs.
  2. The RAG enzymes pick one D and one J at random and cut out the DNA between them; the cell's repair machinery joins the ends. The removed DNA is gone from this cell for good.
  3. At the seam, a few DNA letters are trimmed away and a few random new ones are added. These letters exist nowhere in your genome.
  4. The same cut, trim and add brings in one V segment. The cell now has a heavy-chain gene that has probably never existed before.
  5. About two out of three joins throw the gene out of its three-letter reading frame. The cell then tries again on the copy it inherited from its other parent; if that fails too, it dies.
  6. A successful cell builds its light chain the same way, from one V and one J, and displays many copies of a single receptor. Every cell it gives rise to inherits that receptor.
alt: An animated diagram of an antibody gene being assembled. From rows of about 40 V, 23 D and 6 J gene segments, enzymes pick one of each and cut out the DNA in between, the cell's repair machinery joins the pieces, and random DNA letters are trimmed and added at each seam. Many joins fail because they disrupt the gene's reading frame. Each successful B cell ends up with one receptor, and a counter shows that about 1.8 million segment combinations, multiplied by the many ways each seam can come out, give 10¹⁵ or more possibilities.
:::

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
  6. ≥10⁸ · "different T-cell receptor chains in a young adult (direct count; a minimum)" · single T-cell glyph · blue · [Qi 2014]. From this rung draw a dashed vertical extension up to 10¹⁰ labeled "one model's estimate" · [Lythe 2016].
  A soft hatched band between rung 6 (10⁸) and rung 4 (10¹⁵) appears at step 6, labeled "the gap: possible vs. present".

  CONTROLS: "Next" / "Back" buttons and a step-dot indicator (6 steps). Keyboard arrows also advance. Tapping any revealed rung shows its full source citation in a small popover.

  MOBILE: the ladder fits portrait; axis on the left at ~25% width, labels wrap to two lines; popovers open as a bottom sheet.
  REDUCED MOTION: no scrolling animation; rungs simply appear.
steps:
  1. Start small. For an antibody's heavy chain, your genome holds about 40 V, 23 D and 6 J segments: around 70 pieces. On this scale, each step up is ten times the one below.
  2. Your whole genome has fewer than 20,000 protein-coding genes. Giving every possible receptor its own gene was never an option.
  3. Choosing one V, one D and one J, and pairing the result with a light chain built the same way, gives roughly 1.8 million combinations.
  4. Random letters at the seams multiply that many times over. T cells build their receptors the same way, and the classic estimate is about 10¹⁵ possible T-cell receptors: a million billion.
  5. No body could hold them all. An adult has a few hundred billion T cells; 10¹⁵ is over 2,000 times more, and that many T cells would weigh about 500 kilograms.
  6. So each person carries a random sample: at least 100 million different T-cell receptors by the most thorough direct count, perhaps ten billion by one model. It works because each receptor can recognize many related targets.
data: |
  Heavy-chain segments, functional, human (per haploid genome): IGHV 38–46 (varies by person), IGHD 23, IGHJ 6 — IMGT Repertoire, human IGH locus description (imgt.org, accessed Oct 2026).
  Light-chain segments: IGKV 31–36, IGKJ 5; IGLV 29–33, IGLJ 4–5 — IMGT Repertoire, human IGK and IGL locus descriptions.
  Combinations (calculation): heavy 40 × 23 × 6 = 5,520; light κ ≈ 35 × 5 = 175 plus λ ≈ 30 × 5 = 150, total ≈ 325; 5,520 × 325 ≈ 1.8 × 10⁶.
  Protein-coding genes: "fewer than 20,000" — Amaral P et al., Nature 2023;622:41–47.
  Naive TCRβ diversity ≥1 × 10⁸ unique sequences in young adults (lower bound) — Qi Q et al., PNAS 2014;111:13139–13144.
  Total T cells ≈ 4 × 10¹¹; possible TCRs ≈ 10¹⁵; 10¹⁵ T cells ≈ 500 kg; model estimate of distinct clonotypes ≈ 10¹⁰ (≈9% of naive CD4 T cells, a model result above all direct counts) — Lythe G et al., J Theor Biol 2016;389:214–224. (Chapter 1's census gives ≈4.7 × 10¹¹ T cells from Sender et al. 2023; both fit "a few hundred billion".)
  Ratio: 10¹⁵ / 4–4.7 × 10¹¹ ≈ 2,100–2,500 ("over 2,000 times").
alt: A vertical logarithmic ladder comparing numbers. About 70 gene segments for an antibody heavy chain and fewer than 20,000 genes in the genome sit at the bottom, followed by about 1.8 million segment combinations. Higher up, an adult's few hundred billion T cells sit far below the roughly 10¹⁵ possible T-cell receptors (one T cell for each would weigh about 500 kilograms). Each person's actual library, at least 100 million different T-cell receptors by direct count and perhaps ten billion by one model, is a small sample of what is possible.
:::

:::figure ch03-clonal-selection
title: Select, copy, remember
goal: After using this, the reader understands that an antigen selects the rare lymphocytes whose pre-made receptors fit it; that those cells multiply enormously, then mostly die, leaving a much larger pool of memory cells; that a second exposure to the same germ produces a faster, bigger response; and that a different germ starts from scratch.
kind: stepper
stage: dark
spec: |
  PURPOSE: a step-driven population scene linked to a two-panel chart, so readers watch clonal selection happen in a "lymph node" and see the same events as curves. The seven step captions ARE the controls: no separate scenario buttons.

  LAYOUT (desktop): two panels side by side. LEFT (≈55%): the "lymph node" field, a large soft rounded-oval region (faint outline, labeled "lymph node") on the dark stage, drawn in Canvas. RIGHT (≈45%): a light inset chart card (paper background) with TWO STACKED PANELS sharing one time axis (see CHART). Under both: the step caption (HTML, aria-live), then the controls.
  MOBILE (portrait): field on top (square), chart below at full width, controls below the caption.

  CONTROLS: "Back" / "Next" buttons, step dots (1–7), and a "Play" toggle that auto-advances through the steps (~4 s per step). Each step runs its own short animation, then holds its end state. Keyboard arrows also step.

  FIELD CONTENTS:
  - ~300 small amber (#F2B33D) B-cell dots wander slowly (gentle drift). Each dot carries a tiny receptor glyph: one of ~40 distinct notch shapes at a random rotation, so the population is visibly diverse.
  - A small fixed note in the field corner: "Only a few hundred of the lymph node's cells are drawn."
  - GERM A displays three different epitope glyphs on its surface. Exactly 3 dots match germ A, each with a DIFFERENT receptor glyph that complements a DIFFERENT one of germ A's epitopes (this shows that several clones respond to one germ). Exactly 2 other dots match germ B. None are highlighted until their germ arrives.
  - Dots never change scale or meaning. During expansion, each responding dot's descendants form a growing cluster that keeps the parent's receptor glyph, so the reader can see three families (clones) growing side by side, up to ~120 dots in total. Non-matching dots dim slightly so the clusters stand out.

  GERMS: GERM A = red-coral virus particles (#FF4D5E, small icosahedra with spikes). GERM B = chartreuse bacteria (#B5D94A rods) with their own epitope glyphs. Germ pieces enter the field from its left edge, some drifting in and some carried by 2–3 green dendritic cells (#4FD18B, star-shaped).

  STEP-BY-STEP STATES (simulated days shown on a day counter above the field):
  1. Rest. The diverse population drifts. No germs.
  2. Day 0–3: germ A pieces arrive (drifting in and on dendritic cells). The 3 matching dots light up: a bright ring plus a "match" tag (non-color cue) when they touch a matching piece. Every other dot ignores the germ.
  3. Day 3–8: EXPANSION. The 3 matching dots divide (each division animates as one dot pinching into two) into three growing clusters.
  4. Day 6–14: ACTION. Some cluster dots become plasma cells (larger amber ovals with an off-center nucleus) that emit tiny gold Y-shaped antibodies drifting toward germ pieces; coated germs fade. By ~day 12 germ A is gone. A small arrow at the field edge labeled "some plasma cells → bone marrow" shows a few leaving.
  5. Day 10–35: CONTRACTION. About 95% of cluster dots fade with a brief apoptosis cue (shrink, edge blebs, fade). The remaining dots become MEMORY cells: amber dots with a thin bright outer ring and a small "M" glyph. Show ~15–20 memory dots across the three families, clearly more than the 3 that started.
  6. "Months or years later": germ A returns. Memory dots respond within ~1 simulated day; clusters regrow faster; plasma cells and antibodies appear by day ~3–4; germ A is cleared by ~day 5. An even larger memory pool remains.
  7. Germ B arrives. Its 2 matching naive dots light up and a full, slow first response replays from scratch, while germ-A memory dots stay calm and do not respond.

  CHART (light inset; Inter labels; colorblind-safe: distinct line styles plus direct labels; one shared x-axis):
  - X axis: days. First exposure 0–60; an axis break labeled "months or years later"; then 0–30 for the step 6 or step 7 exposure.
  - TOP PANEL, "Matching cells (log scale)", ticks 10¹ to 10⁸. Solid line. For the first exposure use the measured mouse numbers: ~150 at day 0, ~10⁷ around day 8, ~5 × 10⁵ by day ~30, then flat. A large live counter above the panel shows the current value ("≈150 cells" → "≈10 million" → "≈500,000"). Panel label: "Measured example: killer T cells in mice (all clones that fit one viral fragment)." For step 6, start at the memory level and rise faster to a modestly higher, unlabeled peak (stylized). For step 7, a new dashed line for germ B starts again at ~150.
  - BOTTOM PANEL, "Germ and antibody (stylized)", arbitrary units, linear. Germ: dashed red-coral line; first exposure rises from day 0, peaks ~day 5–7, cleared by ~day 12; in step 6 it stays low and is cleared by ~day 5. Antibody in blood: dotted gold line; first exposure near zero until ~day 6–7, peaks ~day 14–21, then declines to a low plateau above zero; in step 6 it begins rising by day 3–4 and peaks earlier and clearly higher (unlabeled). A pale shaded band across the germ scale labeled "enough germ to make you ill (illustrative)": the first-exposure germ curve enters it; the step 6 curve does not.
  - A vertical playhead synced to the field's day counter.
  - One plain sentence under the chart (normal caption size, not small caps): "The field shows B cells, which make antibodies; the cell counts in the top panel come from killer T cells in mice, which follow the same pattern. Antibody timing is based on human vaccine data; curves are stylized."

  SCIENTIFIC CONSTRAINTS:
  - Only cells whose receptors fit the germ respond; non-matching cells never divide in response.
  - The germ does not change any cell's receptor (selection, not instruction).
  - Several different clones respond to one germ; each cluster keeps its own receptor glyph.
  - Memory cells belong to the same clones as the expanded cells.
  - Contraction is large (~95%) but not total; memory exceeds the starting number.
  - Germ B's response must look like a first response (slow, smaller), regardless of germ-A memory.
  REDUCED MOTION: each step shows its end state as a still, with the chart fully drawn up to that step.
steps:
  1. Before infection, every lymphocyte carries its own random receptor. For any one germ, only a tiny handful fit, and they fit different parts of it.
  2. Germ A invades. Pieces of it reach the lymph node, some drifting in and some carried by dendritic cells. Only the cells whose receptors fit are selected; every other cell ignores it.
  3. The selected cells divide again and again. In mice, the hundred or so killer T cells that recognized one viral fragment became about ten million in a week.
  4. Many of the B-cell copies become plasma cells that flood the blood with antibodies. Within about two weeks, the germ is cleared.
  5. With the threat gone, about 95% of the expanded cells die. The survivors become memory cells, still far more numerous than the handful that started.
  6. Months or years later, germ A returns. Memory cells respond within days, faster and stronger, and the germ is often cleared before it can make you feel ill. This is what a vaccine sets up.
  7. A different germ gets no head start: its own rare matching cells must be found and multiplied from scratch. Memory is specific.
alt: A step-by-step simulation of a lymph node full of lymphocytes, each with a different receptor, next to a two-panel chart. When a germ arrives, only the few matching cells respond; they multiply enormously (in a measured mouse example, from about 150 killer T cells to about ten million in a week), produce antibodies that clear the germ, and then about 95 percent die, leaving a large pool of memory cells. A second exposure to the same germ produces a faster, larger antibody response that clears the germ before it causes illness; a different germ starts a slow first response from scratch.
:::

:::figure ch03-antibody
title: One molecule, four jobs
goal: After using this, the reader can point to an antibody's variable tips and its constant Fc stem, explain that the tips bind a specific epitope while the stem recruits other immune players, and describe neutralization, opsonization, complement activation and ADCC.
kind: explorer
stage: dark
spec: |
  PURPOSE: an explorer with five modes. Each "job" mode is a short animated scene that first shows the problem without antibodies, then lets the reader add antibodies, so the reader sees exactly what the antibody adds.

  CONTROLS: a segmented control across the top: "Anatomy" | "Block" | "Flag for eating" | "Complement" | "Recruit NK cells". In each job mode: the scene starts in the "Without antibodies" state and plays once; then a prominent button "Add antibodies" replays the scene with antibodies. After that, a two-state toggle "Without / With antibodies" and a Replay button let the reader compare. On phones the segmented control becomes horizontally scrollable chips.

  GLOBAL VISUAL RULES:
  - Antibodies are gold Y shapes (#F2B33D family). Variable tips are highlighted with a brighter glow AND a distinct notched outline; the Fc stem is plain gold with a subtle darker tone. Never rely on glow alone; label tips and stem on first appearance in every mode.
  - Relative sizes (not to scale, but keep the ORDER and add a small "not to scale" note): antibody (≈10–15 nm) < virus (≈100 nm) < bacterium (≈1–2 µm) < human cells (≈10–20 µm). Draw antibodies small relative to cells (a cell should have room for dozens of antibodies on its surface).
  - Antibody tips always bind the target; the stem always points away from the target, toward the recruited cell or protein.

  MODE 1 — ANATOMY: one large IgG centered. Show the four chains: two heavy chains (deeper gold) running from tip to the bottom of the stem, two light chains (paler gold) along the outer side of each arm. The hinge (where arms meet stem) is flexible: animate a slow, gentle swivel of the arms (±15–20°). Interactive hotspots (hover/tap, keyboard focusable) with short popover text:
    • "Variable tips — built by gene shuffling; both tips are identical and grab the same epitope."
    • "Hinge — flexible, lets the arms reach targets at different distances."
    • "Fc stem — essentially the same in every antibody of a given class; it is the handle that other immune cells and proteins grab."
    • "Heavy and light chains — two of each; each arm has one light chain and part of one heavy chain."
  No antibody-class chips.

  MODE 2 — BLOCK (neutralization): a sand-colored body cell (#E9C9A1) on the right with small receptor "docks" on its membrane; red-coral virus particles (#FF4D5E) drift in from the left. WITHOUT antibodies: a virus attaches its spike to a dock and sinks into the cell (entry animation). WITH antibodies: antibodies bind the spikes by their tips; coated viruses bump against the cell but cannot dock and drift away.

  MODE 3 — FLAG FOR EATING (opsonization): a chartreuse bacterium (#B5D94A) and a large coral macrophage (#FF7A6B, amoeboid, ruffled edge) with small cup-shaped Fc receptors on its membrane. WITHOUT antibodies: the macrophage's edge touches the bacterium, slips, and engulfment is slow or partial. WITH antibodies: the bacterium is coated with antibodies (tips on bacterium, stems outward); the macrophage's Fc-receptor cups grab the stems, the membrane wraps around, and the bacterium (with its antibody coat) is engulfed into a vacuole.

  MODE 4 — COMPLEMENT: an antibody-coated bacterium drawn as a rod with a thin outer envelope (complement pores work best on this kind of bacterium); small pale-lilac complement protein dots drifting in the fluid, labeled simply "complement proteins". The first complement proteins bind only where several antibody stems are CLUSTERED close together (not on a lone antibody). This triggers a cascade: more complement dots deposit on the bacterial surface (tagging), then a ring-shaped pore assembles in the bacterial membrane; the bacterium leaks (tiny particles escape) and collapses. WITHOUT antibodies: complement dots drift past with little binding.

  MODE 5 — RECRUIT NK CELLS (ADCC): a target cell, by default a virus-infected body cell (sand, with small red-coral viral proteins studding its surface). An orange NK cell (#FF8A3D, round, visible granules) approaches. WITHOUT antibodies: the NK cell touches the target and moves on. WITH antibodies: antibodies bind the viral proteins on the target; the NK cell's Fc receptors (small cups) grab the stems; the NK cell flattens against the target, its granules move to the contact zone and are released as tiny dots; the target cell shrinks, blebs and breaks into fragments (apoptosis). A small secondary toggle "Target: infected cell / cancer cell" swaps the target to a violet-magenta cancer cell (#B65FD8, irregular, with a surface protein), same mechanics, with the caption note "Several antibody drugs against cancer rely partly on this route (Chapter 9)."

  SCIENTIFIC CONSTRAINTS:
  - Antibodies never cross into cells on their own (in mode 3 they are swallowed together with the bacterium).
  - Antibodies themselves do not kill in modes 3–5; they connect the target to the killer (macrophage, complement, NK cell).
  - Fc receptors bind the stem (Fc), never the tips.
  - Complement starts on clustered antibodies on a surface, not on free-floating single antibodies.
  - NK-cell killing is by released granules leading to the target's self-destruction, not by engulfing it.
  MOBILE: portrait stage; target on top, recruited cell below (vertical layout) so scenes read top-to-bottom; popovers become bottom sheets.
  REDUCED MOTION: each job shows a two-panel before/after still for both states.
steps:
  1. Anatomy: two identical arms end in variable tips, shaped by gene shuffling, that grab one specific epitope. The constant stem, the Fc region, is the handle the rest of the immune system grabs.
  2. Block: antibodies coat the proteins a virus uses to dock onto cells. A coated virus can bump into a cell but cannot get in.
  3. Flag for eating: a microbe coated in antibodies, stems facing out, is easy for a macrophage to grip with its Fc receptors and swallow.
  4. Complement: where antibodies cluster on a bacterium, complement proteins in the blood latch on, tag the target and can punch holes in its membrane.
  5. Recruit NK cells: antibodies stuck to an infected cell let an NK cell grab the antibodies' stems and trigger the target's self-destruction. Several antibody drugs against cancer rely partly on this route.
alt: An interactive antibody. In anatomy mode, a Y-shaped molecule shows two identical variable tips that bind a specific target and a constant stem called the Fc region. Four animated scenes compare what happens without and with antibodies: viruses blocked from entering a cell; a bacterium coated with antibodies and swallowed by a macrophage; complement proteins building a hole in an antibody-coated bacterium; and a natural killer cell grabbing antibody stems on an infected or cancer cell and killing it.
:::


# ===== 04-presentation (5 figures) =====

:::figure ch04-mhc1-pathway
title: The shop window
goal: After using this, the reader understands that every cell continuously shreds its own internal proteins and displays short samples on its surface, and that a virus or a single mutation changes what appears in that display — which is what a patrolling killer T cell reads.
kind: stepper
stage: dark
spec: |
  A single large body cell fills most of the stage, drawn in cross-section: sand-colored
  (#E9C9A1) rounded polygon, round nucleus, and a band of membrane along the top where the
  display appears. Outside the membrane, in a strip along the top of the stage, an ACTIVATED
  CD8 killer T cell (electric blue #4C8DFF, round, fine microvilli fuzz, three or four TCR
  glyphs on its leading edge) drifts slowly left to right. Label it "activated killer T cell"
  — naive T cells never patrol tissues (they are activated in lymph nodes, later in the
  chapter).

  Inside the cell, left to right, a short production line:
  (a) a cluster of folded protein glyphs, visibly larger and lumpier than peptides;
  (b) the proteasome, a squat silver-gray barrel with a channel through it;
  (c) a scatter of peptide chains emerging from the barrel, most of which fade out;
  (d) the TAP gate (pale silver) set into the wall of a large soft-edged compartment
      labeled "ER", occupying the right third of the interior;
  (e) inside the ER, two or three empty MHC class I molecules drawn as small silver cups
      (#D9DEEA) with a groove along the rim and two small pockets in the groove floor;
  (f) a transport arrow from the ER to the membrane, where loaded cups dock facing outward.

  Peptides are short chains of 8–10 small sub-beads, with a tiny "8–10 amino acids" ruler
  beside the first one the reader sees. Two sub-beads in each chain (the 2nd and the last)
  are "anchors", drawn with a distinct small shape that drops DOWN into the cup's pockets
  when loaded. Color by origin: self = sand #E9C9A1; viral = red-coral #FF4D5E;
  mutated/neo = hot pink #FF3D7F with a soft glow. Origin must also be carried by a small
  icon on the readout chip (self = plain dot, viral = small spiked hexagon, neo = small
  asterisk) so color is never the only cue.

  CONTROLS. (1) Segmented control with four scenarios, "Healthy" (DEFAULT on load) ·
  "Virus-infected" · "Mutated (cancer)" · "Window shuttered". (2) Stepper (Back / Next /
  Play) through the six steps below; caption in an ARIA live region. (3) A persistent
  readout panel, bottom-right, titled "What's in the window": a row of twelve slots that
  updates as soon as the scenario changes. Directly under the twelve slots, ALWAYS VISIBLE,
  a small-print line: "Stylized: 12 slots stand in for a few thousand different peptides
  on ~200,000 molecules."

  PER SCENARIO.
  · Healthy: all protein glyphs and all slots sand. The T cell touches the cell, pauses,
    moves on. Inline note: "Nothing to report."
  · Virus-infected: a small red-coral icosahedral virus inside the cell; 2 of 12 slots
    become viral. The T cell stops and a green-cyan "+" recognition badge (with a plus
    icon) appears at the contact. No killing — that is Chapter 5.
  · Mutated (cancer): cell silhouette slightly irregular and violet-tinted (#B65FD8) with a
    misshapen nucleus; exactly one protein glyph carries a small pink "typo" mark; exactly
    one slot glows hot pink. Add a second readout note for this scenario only: "In a real
    tumor cell, one neoantigen would be about one in several thousand different peptides —
    which is why it is so easy to miss." Do NOT label the single lit slot as "scarce"; the
    note carries the honesty.
  · Window shuttered: violet cell, TAP drawn crossed out, cups stay inside the ER and never
    reach the surface; all slots empty outlines. The T cell touches and drifts away with no
    badge. Then an NK cell (orange #FF8A3D, visible granules) enters from the right and a
    "missing self" badge appears — a two-second callback to Chapter 2.

  EMPHASIS AND HONESTY. At step 2 about four in five fragments fade out, and the caption
  says the real figure is far more extreme. Only fragments move — never a whole folded
  protein. No peptide binds a cup outside the ER. A cup never reaches the surface empty.
  Acceptable simplifications: one proteasome instead of thousands; twelve slots instead of
  ~200,000 molecules; chaperones omitted; the Golgi omitted from the route between ER and
  surface (do not "fix" this by adding it); the ER as one smooth compartment.

  MOBILE. Below 700px use a portrait viewBox and stack the line vertically: proteins and
  proteasome at the top, TAP and ER in the middle, membrane and display near the bottom,
  T-cell lane pinned to the bottom edge. Scenario control becomes a two-by-two button grid
  above the stage; the readout becomes a full-width strip under the stage, above the
  caption, with its stylization note kept. In-SVG labels ≥13px.
steps:
  1. Inside every cell, proteins are constantly being retired. Worn-out, faulty and surplus proteins are fed into the proteasome, a barrel-shaped shredder that cuts them into short fragments.
  2. Most fragments are destroyed and recycled. Here about 1 in 5 survive so you can follow them; in a real cell it is closer to 1 in 5,000.
  3. The survivors are pumped through a gate called TAP into the endoplasmic reticulum (ER), where new surface molecules are assembled.
  4. Empty MHC class I molecules wait in the ER. Each tests peptide after peptide. Only a fragment of the right length — usually 8 to 10 amino acids — whose anchor amino acids fit the pockets in the groove stays put.
  5. Loaded molecules travel to the surface and face outward. A real cell carries a couple of hundred thousand of them; the twelve slots in the readout stand in for a few thousand different peptides.
  6. An activated killer T cell patrolling the tissue reads the display by touch. Switch between the four scenarios to see what the window says in each case.
alt: A cross-section of a cell showing how it displays samples of its proteins. Proteins enter a barrel-shaped proteasome and emerge as short fragments, most of which are destroyed; survivors pass through the TAP gate into the endoplasmic reticulum, settle into cup-shaped MHC class I molecules, and travel to the surface. A readout shows what is on display. Switching between a healthy, a virus-infected, a mutated and a display-silenced cell changes the display; a patrolling killer T cell reacts only to foreign fragments, and an NK cell attacks the cell whose display has gone dark.
:::

:::figure ch04-peptide-plus-groove
title: Peptide plus groove
goal: After using this, the reader understands that a T-cell receptor recognizes a peptide and the MHC groove holding it as one combined target — so the same virus looks different to different people's T cells.
kind: explorer
stage: dark
spec: |
  A staged explorer: four steps revealed one at a time (Back / Next), each adding exactly
  one control. Two panels on desktop: the DETAIL view (left, large) and, from step 3, the
  GRID (right). Before step 3 the detail view fills the stage.

  DRAWING VOCABULARY. An MHC molecule is a silver cup (#D9DEEA) seen slightly from above,
  with a groove along its rim. The groove floor has exactly TWO pockets. The tops of the
  two groove walls carry a short "ridge pattern" (three small bumps in a person-specific
  arrangement) — this is what the TCR touches besides the peptide. A peptide is a chain of
  nine beads; bead 2 and bead 9 are ANCHORS that point DOWN into the pockets; beads 4–6
  point UP and carry a small pattern the TCR reads. A TCR is a flat paddle with three short
  loops on its underside; when it docks it lies DIAGONALLY across the groove, with one loop
  on the peptide's up-facing beads and one on each wall's ridge.

  POCKET AND ANCHOR SHAPES (shape must carry the logic; color is secondary).
  Anchor bead shapes: circle (●), square (■), triangle (▲).
  Pocket types: "round" fits ● only; "square" fits ■ only; "triangle" fits ▲ only;
  "wide" (a visibly larger rounded socket) fits ● or ■.
  People (each shown with ONE class I type for simplicity):
  · Ana:  pocket 1 = round, pocket 2 = round; ridge pattern A
  · Ben:  pocket 1 = wide,  pocket 2 = round; ridge pattern B
  · Chen: pocket 1 = square, pocket 2 = triangle; ridge pattern C
  Peptides from ONE viral protein (anchor 1, anchor 2; up-facing pattern):
  · P1: ●, ● ; pattern x
  · P2: ■, ● ; pattern y
  · P3: ■, ▲ ; pattern z
  · P1* (the virus's escape variant of P1, step 4 only): ■, ● ; pattern x (only anchor 1
    changed; the up-facing beads are identical to P1)
  T cells: T1 reads pattern x on ridge A. T2 reads pattern z on ridge C.

  Resulting truth table — the build MUST reproduce exactly this:
  Displayed?        Ana   Ben   Chen
    P1              yes   yes   no
    P2              no    yes   no
    P3              no    no    yes
    P1* (step 4)    no    yes   no
  T1 recognizes only P1 in Ana. T2 recognizes only P3 in Chen. Every other displayed
  combination is "displayed, but this T cell can't read it".

  THREE OUTCOMES, each with distinct shape cues and these exact labels:
  · "Not displayed" — the peptide's anchors fail to seat; it is pushed out and falls away
    INSIDE the loading compartment (draw the event below a faint dashed line labeled
    "inside the cell"), and a plain sand-colored self peptide slides into the groove
    instead. The cup that reaches the surface is never empty; it simply never carries our
    peptide.
  · "Displayed, but this T cell can't read it" — peptide seated; TCR descends, touches,
    lifts off; no glow.
  · "Recognized" — TCR docks diagonally; all three contacts glow; a green-cyan "+" badge
    with a plus icon appears; the paddle stays docked.

  STEPS AND CONTROLS (caption for each step in an ARIA live region; see `steps`).
  Step 1 "Does it fit?" — person fixed to Ana. Control: peptide picker P1 / P2 / P3.
  Step 2 "Can this T cell read it?" — T1 appears above Ana's display. Same peptide picker
  stays; add ONE button: "Swap to a different T cell" (toggles T1 ↔ T2).
  Step 3 "Different people" — the GRID appears: 3 rows (P1–P3) × 3 columns (Ana, Ben,
  Chen), each cell a small icon of its outcome for the current T cell. Clicking a cell
  animates the detail view to that case. Under the grid, one line of small print: "Each
  real person has up to six class I types, so real coverage is broader than this grid —
  but the differences between people are real."
  Step 4 "The virus mutates" — ONE button: "Change one anchor in P1". Row P1 becomes P1*:
  Ana's cell flips to "Not displayed" (animate the peptide falling out of her groove),
  Ben's stays displayed. Caption explains.

  SCIENTIFIC CARE. The TCR always contacts BOTH peptide and groove, never the peptide
  alone. Anchors point down; TCR-read beads point up. The escape mutation changes an anchor
  only and hides P1 from Ana but not from Ben. Acceptable simplifications: two pockets
  instead of several; three TCR loops instead of six; one class I type per person; nine-bead
  peptides throughout.

  MOBILE. Below 760px, stack: detail view first (landscape viewBox, scaled), controls in a
  single column under it, then (from step 3) the grid full width with column headers as
  initials (A, B, C) plus a legend, then the caption. Grid icons ≥28px tap targets.
steps:
  1. Here is one person's class I groove, with two pockets in its floor. Pick a peptide from the virus. It is displayed only if its two anchor amino acids fit the pockets; otherwise it is dropped inside the cell, and an ordinary self peptide takes the groove instead.
  2. Now a T cell arrives. Its receptor lies across the groove and touches the peptide and the groove walls at the same time. It responds only if both match — try swapping in a different T cell.
  3. The same virus in three people. Each person's grooves hold a different subset of its peptides, and the same peptide in a different person's groove can look unfamiliar to the same T cell.
  4. The virus changes one anchor in a peptide. Ana's grooves can no longer hold it, so it vanishes from her windows — but Ben's wider pocket still holds it. One mutation can hide a virus from one person and not from another.
alt: An interactive showing a peptide seated in the groove of an MHC molecule, with two anchor amino acids fitting pockets in the groove floor, and a T-cell receptor lying across the top touching both the peptide and the groove walls. A grid of three people against three viral peptides shows that each person displays a different subset of the same virus's fragments and that a given T cell recognizes only one peptide-and-groove combination. A final step shows a single mutation hiding a peptide from one person but not another.
:::

:::figure ch04-cross-presentation
title: Cross-presentation
goal: After using this, the reader understands that a dendritic cell that merely ate tumor debris can brief a killer (CD8) T cell only by cross-presentation — routing the eaten material onto its own class I molecules.
kind: stepper
stage: dark
spec: |
  A small, three-step figure (about half a day to build). Two panels side by side,
  joined by a faint lymphatic channel:

  LEFT PANEL, "In the tumor": a violet (#B65FD8), irregular tumor cell breaking apart into
  debris; some debris fragments carry a hot-pink (#FF3D7F) tag (a tumor protein). A green
  (#4FD18B) star-shaped dendritic cell, labeled "cDC1 — specialist dendritic cell",
  engulfs debris into an internal bubble.

  RIGHT PANEL, "In the lymph node": the same dendritic cell (matured: green "+" studs on its
  surface), now displaying on two kinds of cup: class II cups (labeled "evidence board")
  and class I cups (labeled "shop window"). Two T cells wait nearby: a teal (#2EC4C9) CD4
  helper, labeled "reads class II", and a blue (#4C8DFF) CD8 killer, labeled "reads
  class I".

  Inside the dendritic cell, the eaten material follows routes drawn as glowing paths:
  · Route A (always on): bubble → class II cups. Hot-pink beads appear on the evidence
    board. The CD4 helper docks and shows a green-cyan "+" badge.
  · Route B (cross-presentation): bubble → class I pathway → class I cups. Shown only in
    step 3.

  STEP STATES.
  Step 1: left panel animates the eating; the dendritic cell then travels along the
  channel to the right panel. Class I cups show only sand self beads; class II cups show
  pink.
  Step 2 ("Without cross-presentation"): CD4 helper recognizes class II (badge). CD8
  killer touches the class I cups, finds only sand self beads, and drifts away; inline note
  "The killer is never briefed."
  Step 3 ("With cross-presentation"): Route B lights; pink beads move onto some class I
  cups; the CD8 killer docks and gets a "+" badge. A small toggle "Cross-presentation:
  off / on" appears on this step only, so the reader can flip back and forth between the
  step-2 and step-3 outcomes.

  SCIENTIFIC CARE. Route B must start from the eaten material in the bubble, not from the
  dendritic cell's own nucleus or protein-making machinery: the dendritic cell is not
  infected and makes no tumor protein. The tumor cell never presents directly to the
  T cells. Both T cells are in the lymph node, not the tumor. Acceptable simplifications:
  one dendritic cell; Route B drawn as a single path (real cells use more than one
  route); the journey compressed to a second or two.

  MOBILE. Below 700px, stack the panels vertically (tumor above, lymph node below) with the
  channel running downward. Toggle full width under the stage.
steps:
  1. In the tumor, a specialist dendritic cell eats debris from a dying tumor cell, then carries it to the nearest lymph node. It makes none of the tumor's proteins itself.
  2. By the ordinary rules, eaten material goes onto the evidence board (class II). A helper T cell can read it there, but the killer T cell reads only the shop window (class I), which shows nothing unusual. The killer is never briefed.
  3. Cross-presentation routes some of the eaten material into the class I pathway, so tumor fragments appear in the shop window too. Now the killer T cell can recognize them. Use the switch to compare.
alt: A two-panel figure. In a tumor, a dendritic cell eats debris from a dying cancer cell and travels to a lymph node. There it displays the tumor fragments on MHC class II, where a CD4 helper T cell recognizes them. Without cross-presentation, its MHC class I molecules show only self peptides and a CD8 killer T cell passes by; with cross-presentation, tumor fragments also appear on class I and the killer T cell recognizes them.
:::

:::figure ch04-lymph-node-search
title: Needle in a haystack
goal: After using this, the reader understands how rare the matching T cell is, and how random, brief contacts at a high rate — shared among many dendritic cells — still find it.
kind: simulation
stage: dark
spec: |
  A lymph-node scene. Canvas 2D for the crowd; SVG overlay for labels, counters and
  controls.

  OPENING BEAT (about 3 seconds, plays once when the figure enters the viewport): a
  matured green (#4FD18B) star-shaped dendritic cell, with green-cyan "+" studs, enters
  from an afferent lymphatic at the top-left and settles near the center of a rounded
  capsule labeled "lymph node". With prefers-reduced-motion it is simply shown in place.

  THE CROWD. 400 small T cells (3px dots; blue #4C8DFF for CD8, teal #2EC4C9 for CD4) on
  independent random walks through a faint mesh. The dendritic cell's dendrites wave
  slowly into the traffic. A T cell that brushes a dendrite pauses briefly (faint ring),
  then moves on at the same speed it arrived. EXACTLY ONE T cell is the match; it is not
  marked until contact. When it touches a dendrite, the contact holds, a green-cyan "+"
  badge appears, and after a beat it divides — 2, 4, 8 — ending in a small labeled cluster
  "8 shown; real: thousands within days".

  ALWAYS-VISIBLE RARITY LABEL (top of stage, computed from the actual crowd size N):
  "In this demo: 1 matching T cell among N. In your body: roughly 1 in 100,000 (range
  about 1 in 10,000 to 1 in a million). This demo is hundreds of times easier than
  reality."

  COUNTERS: "contacts made" and "simulated time" (scaled so that one dendritic cell makes
  about 3,000 contacts per simulated hour).

  CONTROLS: (1) speed slider 1×–20×; (2) "Find the match" button that highlights the
  matching T cell for readers who do not want to wait; (3) reset.

  PROGRESSIVE DISCLOSURE — "Now the real odds". After the match is found (or revealed), a
  small panel slides in below the stage. It is a back-of-the-envelope calculator, not a
  simulation. Fixed assumptions are printed in it: "odds 1 in 100,000; about 3,000
  contacts per dendritic cell per hour; every contact a different T cell". One control: a
  segmented picker "dendritic cells carrying this cargo: 1 · 10 · 100". Readout: "expected
  time to the first match: about 33 hours · about 3 hours · about 20 minutes". Footnote:
  "Real numbers vary; the point is that many dendritic cells and a constant inflow of fresh
  T cells make a hopeless-looking search routine."

  SCIENTIFIC CARE. T cells must not home toward the dendritic cell; approach and departure
  speeds are equal (this is the finding, not a simplification). Contacts are brief (the
  visual pause is short). The match is singular and unmarked until contact. Acceptable
  simplifications: one dendritic cell on screen; 400 T cells instead of millions;
  expansion to eight cells.

  prefers-reduced-motion: no drift or random walk; the crowd is static, the match is
  highlighted at once, expansion is a still frame, and the real-odds panel is open.

  MOBILE. Below 760px, crowd drops to 150 cells (the rarity label updates to "1 among
  150"); counters sit in a sticky bar under the stage; the slider moves into a disclosure;
  the real-odds panel is full width. Canvas capped at 2× DPR; pause when off-screen.
steps:
  1. A dendritic cell carrying fragments from an infection arrives in a lymph node and settles in, its arms reaching into the passing crowd of T cells.
  2. T cells wander at random. Each one that brushes the dendritic cell pauses for a few minutes, then moves on. Somewhere in the crowd is a single T cell whose receptor matches the cargo.
  3. In this demo the match is 1 in a few hundred. In your body it is closer to 1 in 100,000. Open "the real odds" to see why the search still succeeds.
alt: A simulation of a lymph node. A dendritic cell settles among hundreds of T cells that wander at random, each pausing briefly when it touches the dendritic cell. One unmarked T cell carries a matching receptor; when it touches the dendritic cell it locks on and begins to divide. A label contrasts the demo's odds with the real odds of roughly 1 in 100,000, and a small calculator shows how many dendritic cells sharing the work turn a search of days into one of minutes.
:::

:::figure ch04-three-signals
title: Two-factor authentication, plus a briefing
goal: After using this, the reader can predict a naive T cell's fate from the signals it receives — nothing, switched off, or activated — and understands that signal 1 without signal 2 is an active shutdown, not a neutral result.
kind: explorer
stage: dark
spec: |
  A single contact scene in a lymph node (a faint label "lymph node" in a corner): a
  presenting dendritic cell along the bottom of the stage meets one naive T cell above it.
  Three signal channels run across the contact zone, each independently switchable:

  · SIGNAL 1 (center) — a TCR paddle on the T cell meeting an MHC cup holding a peptide.
  · SIGNAL 2 (left) — a CD28 glyph on the T cell meeting B7 studs on the dendritic cell,
    drawn with explicit plus icons in activating green-cyan (#3DDC97). When signal 2 is
    OFF, the studs shrink to one or two faint, unlit nubs (not grayed-out copies of the lit
    version): a resting presenter carries far too little B7 to count. It is a threshold,
    not a switch.
  · SIGNAL 3 (right) — small drifting cytokine dots in the dendritic cell's green, arriving
    at a receptor on the T cell, labeled "IL-12 / type I interferon".
  A legend line under the stage: "Signals 1 and 2 are the two factors. Signal 3 is the
  briefing."

  OUTCOME readout at the right edge (below the stage on mobile), with icon, title and one
  line:
  · Signal 1 off → "Walks on by": the T cell detaches unchanged.
  · 1 alone → "Switched off (anergy)": the T cell dims, its receptors thin out, a padlock
    icon appears, and a small persistent badge stays on it. Line: "Alive, but it will no
    longer respond — even to proper presentation later. In a living body, some such cells
    divide briefly and die instead." Animate the dimming so it reads as something that
    HAPPENED, not an absence. Do not kill the cell.
  · 1 + 2 → "Activated": the T cell brightens, swells slightly and divides a few times.
  · 1 + 2 + 3 → "Activated and briefed": as above, plus daughter cells acquire granule
    glyphs and an "effector killers" label; the division counter runs higher.
  Signals 2 and/or 3 without signal 1 always give "Walks on by". Signal 3 never rescues a
  cell that lacks signal 2.

  CONTROLS. (1) Three independent toggles, keyboard-operable, with on/off stated in text.
  (2) Scenario presets (segmented control), each setting the toggles and redrawing the
  presenting cell:
  · "Matured dendritic cell (danger detected)" → 1+2+3; full B7 studs.
  · "Resting dendritic cell, harmless self-protein" → 1 only; sand-colored peptide.
  · "Resting dendritic cell, tumor debris" → 1 only; hot-pink (#FF3D7F) peptide; one-line
    note: "Cross-presented tumor material without danger signals: the T cells that could
    fight the tumor are switched off instead."
  A small side annotation, always visible: "Naive T cells meet presenters in lymph nodes.
  Ordinary body cells carry essentially no B7."
  (3) A memory strip along the bottom recording the last four outcomes as chips.
  (4) A sequel button, "Then what?", enabled only after an "Activated" or "Activated and
  briefed" outcome and visually separated from the toggles. Pressing it plays: the first
  divisions happen; THEN crimson (#E5484D) CTLA-4 glyphs with a bar icon rise from vesicles
  inside the T cell to its surface, grip the B7 studs more tightly than CD28, and an
  activity meter damps. Caption line: "The brake is built in and switches on only after
  the T cell has started. Chapter 5 takes it apart; Chapter 8 is about a drug that blocks
  it." CTLA-4 must never be drawn on the naive T cell before activation.

  Acceptable simplifications: three channels instead of dozens of molecular pairs; CD80
  and CD86 merged as "B7"; division shown as a handful of cells; the dendritic cell's
  maturation shown only through its B7 studs and shape.

  MOBILE. Below 700px, portrait viewBox: dendritic cell as a wide band at the bottom, T
  cell above, the three channels side by side across the contact band with abbreviated
  labels and a legend. Outcome readout directly beneath the stage, then the toggles as a
  three-row list (label left, switch right), presets as a stacked list, memory strip kept.
steps:
  1. Signal 1 is recognition: the T cell's receptor finds its peptide in an MHC groove. On its own, it switches the T cell off.
  2. Signal 2 is confirmation: CD28 on the T cell grips B7 on a dendritic cell that has been alarmed by danger. With both factors, the T cell activates and begins to divide.
  3. Signal 3 is the briefing: cytokines tell the activated T cell what kind of response to mount, here turning its daughters into killers. Try the presets to see why a tumor that raises no alarm can silence its own attackers.
alt: An interactive contact in a lymph node between a dendritic cell and a naive T cell, with three switchable signals: receptor recognition of a peptide in an MHC groove, CD28 gripping B7 confirmation molecules, and instructive cytokines. Recognition alone switches the T cell off; adding confirmation activates it; adding cytokines turns its descendants into killers. Presets compare a danger-alarmed dendritic cell with resting ones carrying self or tumor material, and a final sequence shows the CTLA-4 brake appearing only after activation.
:::


# ===== 05-t-cells (4 figures) =====

:::figure ch05-thymus
title: The thymus exam
goal: After using this, the reader understands that each new T cell's receptor is random; that the thymus keeps only receptors that grip the body's MHC weakly (no grip means death by neglect, a strong grip on self means deletion); that only a few percent pass; and that AIRE extends the safety test to proteins from organs all over the body.
kind: simulation
stage: dark
spec: |
  CONCEPT. One idea, revealed in stages: a three-zone "grip dial" decides every thymocyte's fate. Steps 1–4 show one candidate at a time in the cortex. Step 5 opens the medulla and introduces AIRE. Step 6 runs 1,000 candidates and offers the AIRE switch. Keep the stage uncluttered: elements appear only when their step needs them (progressive disclosure).

  LAYOUT (desktop, landscape ~16:9).
  - Left edge: entry arrow labeled "Precursors from bone marrow (receptors are built here, in the thymus)".
  - Left ~45%: CORTEX zone. Label: "Cortex" with subtitle "Exam 1: can it read MHC? (plus a first round of Exam 2)". Contains 3 large cortical supporting cells: pale sand (#E9C9A1 at ~60% opacity), branching and net-like, each roughly 6x the diameter of a thymocyte, with MHC cups (pale silver #D9DEEA) holding sand-colored self-peptide beads. No class I/II tags.
  - Right ~40%: MEDULLA zone, dimmed and unlabeled until step 5. Then label "Medulla" with subtitle "Exam 2: organ proteins, thanks to AIRE". Contains 3 medullary cells (sand, more compact; each nucleus has a soft glow labeled "AIRE") and 1 dendritic cell (green #4FD18B, star-shaped). From step 5, each medullary cell displays 1–2 small organ icons standing for organ-specific proteins currently on show: pancreas (insulin), eye (retina), stomach, salivary gland. Every ~4 s one icon on one random cell fades out and another fades in: each cell shows only a random few at a time.
  - Right edge: exit arrow labeled "To blood".
  - Bottom strip (from step 6 only): a 10 x 10 unit chart titled "Fate of every 100 thymocytes", subtitle "Illustrative proportions based on mouse studies", and exactly three counters with icons (never color alone): "Died of neglect" (gray, hollow-circle icon), "Deleted" (crimson #E5484D, minus icon), "Graduated" (green-cyan #3DDC97, check icon).

  THYMOCYTE ART. A small round T-cell silhouette, neutral pale blue-gray, with no CD4/CD8 badges. At step 1 it appears at the entry and its receptor (a small notched key glyph; reuse Chapter 3's "search query" glyph if available) assembles with a brief shuffle animation, to show the receptor is built in the thymus. On passing Exam 1, the cell simply recolors, with a short caption chip: "Fits MHC class I → CD8 killer" (electric blue #4C8DFF) or "Fits MHC class II → CD4 helper" (teal #2EC4C9).

  THE GRIP DIAL. When a thymocyte docks on a cell, one horizontal meter appears above it (large, in-SVG), with exactly three labeled zones, left to right: "No grip → neglect" | "Weak grip ✓ sweet spot" | "Strong grip on self ✕". Labels and icons, not color alone. A needle sweeps to the candidate's hidden self-binding strength. The same dial is used in the medulla.

  FATES (slow, calm; nothing flashes):
  - Neglect: needle in "No grip". The cell dims over ~2 s and shrinks into 3–4 small fragments; a coral macrophage (#FF7A6B) glides in and absorbs them. Chip: "No signal → death by neglect".
  - Deleted: needle in "Strong grip on self". The cell contracts, a crimson minus icon appears, it fragments; the macrophage clears it. Chip: "Too self-reactive → deleted". Deletion happens in both zones.
  - Passes: needle in "Weak grip". The cell recolors (CD8 or CD4), moves into the medulla, visits 1–2 cells there with a new dial reading each time, and exits to blood if it never grips hard.

  CONTROLS (HTML controls below the stage, styled by the foundation).
  - Steps 1–5: a stepper with Prev/Next and "Replay". Each step's candidate auto-plays its journey.
  - Step 6 reveals: "Run the thymus" (releases 1,000 candidates; render the stream as small dots on canvas, keeping ~20 individually animated cells in the foreground), Pause, and the switch "AIRE: on / off" (default on). No speed control.
  - Run probabilities: graduate 3%; deleted 18% (three-quarters of deletions in the cortex, one-quarter in the medulla); neglect the remainder (~79%). The unit chart fills proportionally and the counters show percentages. End overlay: "About 3 in 100 survive."
  - AIRE switch: about 2% of all candidates (~20 per run) are organ-reactive: they pass Exam 1 but carry a hidden organ target (eye, stomach or salivary gland), revealed as a tiny organ icon only when they exit or are deleted. With AIRE ON, such a candidate is deleted in the medulla when it meets a cell showing its organ (~90% of the time, not 100%: tolerance is imperfect). With AIRE OFF, medullary cells lose most organ icons (keep about a third, drawn fainter, because AIRE is not the only gene switch), the nucleus glow turns off and its label reads "AIRE off". Most organ-reactive candidates now pass. A small body silhouette appears beside the exit and outlines the matching organs in crimson with a "!" icon; label: "Self-reactive T cells escaped".

  SCIENTIFIC GUARDRAILS (please keep):
  - Precursors arrive from the bone marrow WITHOUT a receptor; the receptor is built inside the thymus.
  - The exam selects; it does not teach. Never show a receptor being reshaped by an encounter. (We omit that a cell failing Exam 1 can sometimes reshuffle one chain of its receptor and try again.)
  - Thymocytes are not attacked by other cells. They die by their own apoptosis program: neglect is the ABSENCE of a survival signal; deletion is a STRONG signal that triggers death. Macrophages only clean up.
  - Do not show regulatory T cells or FOXP3 in this figure. (Some strongly self-reactive CD4 cells become Tregs instead of being deleted; this is covered later in the text. In the run they are simply counted as graduates.)
  - Proportions are illustrative, assembled from two mouse studies (about 3% of thymocytes mature; about six deleted per one that graduates; most deletion happens in the cortex). Keep the "Illustrative" subtitle.
  MOBILE (<600px): stack vertically: cortex (top), medulla (middle), exit (bottom); the unit chart goes full-width below the stage. Dial labels ≥14px. Large Prev/Next buttons. Reduce the run to 400 candidates (same percentages).
  REDUCED MOTION: each step shows its end state with the dial reading and fate label; "Run the thymus" jumps straight to the filled unit chart and final counters; the AIRE switch swaps states without animation.
steps:
  1. A young thymocyte has just built its random T-cell receptor here in the thymus. Nobody knows yet whether that receptor is useful, useless or dangerous. Two exams will decide.
  2. Exam one, in the cortex. This receptor can't grip the body's MHC at all. With no "keep going" signal, the cell self-destructs within days: death by neglect, the most common fate.
  3. This receptor grips MHC class I weakly: the sweet spot. The cell passes exam one and commits to becoming a CD8 killer T cell.
  4. This one grips a common self-peptide far too hard. A strong grip on self is dangerous, so the cell self-destructs on the spot. Most deletions happen here, in the cortex.
  5. Exam two continues in the medulla. Thanks to AIRE, these cells display proteins from other organs, such as insulin. This CD4 cell grips insulin hard and is deleted.
  6. Now run a thousand candidates and watch the tally: only about 3 in 100 survive. Then switch AIRE off and see which organ-reactive cells slip through.
alt: An animated exam inside the thymus. Each developing T cell builds a random receptor and is tested on a three-zone dial: cells whose receptors cannot grip the body's MHC molecules die of neglect, cells that grip self strongly are deleted, and cells with a weak grip pass and become CD4 or CD8 T cells. In the medulla, cells switched on by AIRE display proteins from other organs, so T cells that react to them are deleted. Only about 3 in 100 candidates graduate; with AIRE off, organ-reactive T cells escape.
:::

:::figure ch05-kill
title: Anatomy of a kill
goal: After stepping through, the reader understands that a killer T cell kills by direct contact (recognize, seal and aim, perforate, deliver granzymes), that the target dies by its own tidy self-destruct program, and that the T cell survives and moves on.
kind: stepper
stage: dark
spec: |
  CAST AND SCALE. The main view is a patch of tissue roughly 60 x 35 micrometers.
  - Killer T cell (CD8): electric blue #4C8DFF, round, ~8 µm, fine microvilli fuzz, TCR glyphs on its surface. Starts on the left.
  - Target, on the right, ~1.6–2x the T cell's diameter. One segmented toggle switches its identity: "Virus-infected cell" (healthy sand #E9C9A1 body with a few small red-coral #FF4D5E virus particles inside) or "Cancer cell" (violet-magenta #B65FD8, lumpy outline, large irregular nucleus). The steps are identical in both modes; only the target's look and the peptide label change ("viral peptide" vs "mutant peptide"). This is the only extra control.
  - 2–3 bystander tissue cells (sand) in the background.
  - Every target and bystander shows MHC class I cups (pale silver #D9DEEA). Bystanders hold only sand self-peptides; the target holds a few hot-pink #FF3D7F peptides among many sand ones.

  INSET LENS. For the molecular steps (2, 4, 5) a circular magnifier (~35% of stage width, top-center, with a thin leader line to the contact point) shows the synapse at molecular scale: the TCR bound to a pink peptide in MHC class I; a CD8 glyph steadying the side of the MHC (label "CD8: a second grip"); an outer ring of adhesion molecules ("adhesion ring"); granules (dark-blue vesicles containing tiny perforin rods and small granzyme dots marked with a scissors icon); perforin assembling INTO the target membrane as ring-shaped pores (top view: a ring of ~16–20 small staves; side view: a hole through the membrane). Lens scale label "nanometers"; main view "micrometers". Never draw perforin as darts or bullets: it is released into the narrow cleft and assembles itself in the target's membrane.

  CLOCK. A small readout (top-right), labeled "time since pores opened", appears only on steps 4–6: step 4 "0 s" with a small note "pores open ~30 s after the T cell's calcium signal"; step 5 "≤ 80 s: pores repaired"; step 6 "≤ 2 min: target rounds up". The later break-up into fragments takes longer: when the fragments appear, the clock changes to "later". (Source for the builder: Lopez et al. 2013, human killer lymphocytes in culture; each timing has its own reference point, hence "since pores opened".)

  CONTROLS. Prev / Next; Play all (auto-advance ~6 s per step); Replay step; the target-type toggle. No counter, no extra switches.

  STATES PER STEP (main view):
  1. Patrol. The T cell crawls along the bystanders, briefly touching each (tiny gray "no match" ticks), then reaches the target.
  2. Match. The lens opens on TCR + pink peptide–MHC class I + CD8. Three matched complexes light up among many sand ones; label "A handful of matches is enough".
  3. Seal and aim. The T cell flattens against the target; an adhesion ring forms (bull's-eye: outer ring, inner zone); label "sealed pocket". Then, inside the T cell, the centrosome (a small star of microtubule lines) swings to the contact face and 6–10 granules slide along the lines to cluster there.
  4. Fire. Granules fuse with the T-cell membrane at the center of the synapse, releasing perforin and granzymes into the cleft; perforin pores appear in the target membrane (lens). Clock "0 s".
  5. Enter and race. Granzymes slip through the pores. The target patches the pores one by one, but granzymes are already inside. Clock "≤ 80 s".
  6. Self-destruct. Inside the target, granzymes switch on its own executioner enzymes (a calm chain reaction of small sparks, not an explosion). The target rounds up (clock "≤ 2 min"), its surface blebs, its nucleus condenses and fragments; virus particles (virus mode) are dismantled with the cell's machinery. It ends as several neat membrane-wrapped fragments (clock "later"); a coral macrophage (#FF7A6B) drifts in and engulfs them. No contents spill.
  7. Release and repeat. The T cell detaches, intact, and crawls toward a second pink-peptide target entering from the right. Chip: "In living mice: roughly 2–16 kills per T cell per day, often in brief, moving contacts; tough targets often need several T cells" (Halle et al. 2016).
  8. Ripples. The T cell releases IFN-γ (small glowing dots in its blue) that diffuse outward. Bystanders respond: their MHC class I cups multiply (brighter shop windows), and after a short delay small crimson (#E5484D) bar-shaped PD-L1 molecules with a minus icon appear on their surfaces. Label: "IFN-γ: brighter windows… and a brake". This hands off to the brakes figure.

  ACCURACY GUARDRAILS: the T cell is not harmed and does not engulf the target; perforin makes pores, it does not blow the cell apart; the death is the target's own apoptosis program; granzymes are delivered into the target through the synapse, while IFN-γ diffuses widely. No flashes, no gore, no war imagery.
  MOBILE (<600px): portrait viewBox with the T cell above and the target below. For molecular steps the lens REPLACES the main view (cross-fade) instead of overlaying it, with a small "back to cells" thumbnail. Captions below the stage.
  REDUCED MOTION: show each step's end state; no crawling, particle drift or spark animation.
steps:
  1. A killer T cell patrols the tissue, touching cell after cell to read their shop windows. Almost every window shows ordinary self-peptides, so it moves on.
  2. A match. The T-cell receptor locks onto a foreign or mutant peptide in MHC class I, and a second grip (CD8) steadies the contact. A handful of matches is enough.
  3. Seal and aim. The T cell rings the contact with adhesion molecules, sealing a tiny pocket, then swings its internal machinery around to bring granules of toxic proteins to it.
  4. The granules empty into the pocket. Perforin inserts into the target's membrane and assembles into rings, punching pores.
  5. Granzymes, protein-cutting enzymes, slip through the pores. The target patches the holes within about 80 seconds, but too late: enough granzymes are already inside.
  6. Granzymes switch on the target's own self-destruct program, apoptosis. It rounds up within minutes, then breaks into tidy fragments that macrophages clear without raising an alarm.
  7. The T cell lets go, unharmed, and moves on to its next target. In living tissue, killing is slower than in a dish and often takes several T cells.
  8. The T cell also releases interferon-gamma. Neighbors display more MHC, brightening their shop windows, and soon raise PD-L1, a molecule that will tell T cells to ease off.
alt: A step-by-step animation of a killer T cell destroying an infected or cancerous cell. The T cell recognizes a foreign peptide on the target's MHC class I, seals a tight contact called the immunological synapse, and aims granules at it. Perforin punches pores and granzymes enter, switching on the target's own self-destruct program; the target breaks into fragments that a macrophage eats, while the unharmed T cell moves on to its next target. The T cell's interferon-gamma makes neighboring cells display more MHC and the brake molecule PD-L1.
:::

:::figure ch05-brakes
title: Accelerators and brakes
goal: After using this, the reader understands that a T cell's activity is a running balance of go and stop signals; that CTLA-4 brakes mainly during priming in the lymph node, by out-competing CD28 for B7 and stripping B7 off dendritic cells; that PD-1 brakes mainly in tissues, when IFN-γ released by the attack makes cells display PD-L1; and that removing either brake causes autoimmunity, catastrophically in the case of CTLA-4.
kind: explorer
stage: dark
spec: |
  STRUCTURE. Two scenes in tabs: "1 · Lymph node: priming" and "2 · Tissue: the attack". Above both scenes, one shared readout:
  - SIGNAL LEDGER: a horizontal bar centered on zero. Activating contributions stack to the right as green-cyan (#3DDC97) segments with "+" icons and labels: "TCR (signal 1)", "CD28 (signal 2)". Inhibitory contributions stack to the left as crimson (#E5484D) segments with "−" icons: "CTLA-4", "PD-1". A marker shows the net value, with three zone labels under the bar: "Resting · Active · Full throttle". Never rely on color alone. (No separate dial: the ledger is the only gauge.) The T cell's look tracks the net value (more active = larger, more ruffled membrane).
  Build both scenes as reusable components: Chapter 8's figure (ch08-two-brakes) will reuse them and add drugs. This figure must NOT show any drugs or antibodies.
  Per scene there is exactly one time scrubber (with Play) and one knockout switch. No other switches.

  SCENE 1: LYMPH NODE (PRIMING).
  - Left: dendritic cell (green #4FD18B, star-shaped). On its surface: MHC (pale silver) holding a hot-pink peptide; 8 B7 molecules drawn as small knobs, with a visible "B7: 8" counter.
  - Right: a naive helper T cell (teal #2EC4C9; label "T cell") with a TCR glyph and CD28 stalks (green-cyan, "+" tip).
  - TIME SCRUBBER 0 → 72 h, ticks "contact", "day 1", "day 2", "day 3".
  - 0–24 h: TCR binds pMHC (signal 1); CD28 binds B7 (signal 2). The ledger moves to Active; the T cell enlarges; from ~24 h it starts dividing (daughters appear: 2 → 4 → 8 → 16, small, clustering in the node).
  - 24–72 h: CTLA-4 (crimson stalks, "−" tip) appears first as faint vesicles inside the T cell, then at the contact face. Animate CD28–B7 pairs being displaced by CTLA-4–B7 pairs (CTLA-4 wins because it binds B7 much more tightly). Some CTLA-4–B7 pairs are pulled into the T cell and dissolve (trans-endocytosis): the DC's B7 counter drops from 8 to ~4. Ledger: the CD28 segment shrinks, the CTLA-4 segment grows; the net marker levels off and eases back within "Active". The response is capped, not cancelled.
  - Switch "Remove CTLA-4 (knockout)": CTLA-4 never appears and B7 stays at 8. Now MANY DIFFERENT T cells (varied TCR glyphs, mostly teal helpers, a few blue killers) dock on dendritic cells, including ones recognizing ordinary sand self-peptides, and expand until they spill past the lymph-node outline. The net marker sits at Full throttle. A small body silhouette appears with heart, pancreas, liver and lungs outlined in crimson with "!" icons. Chip: "Mice born without CTLA-4: many T cells, mostly CD4 helpers, activate against self and invade organs; death by 3–4 weeks. Losing CTLA-4 from Tregs alone is enough to cause fatal disease."

  SCENE 2: TISSUE (THE ATTACK).
  - A strip of sand-colored tissue cells (#E9C9A1); 2–3 of them are infected (pink peptides in MHC class I). One or two effector killer T cells (blue #4C8DFF) carry PD-1 stalks (crimson, "−" tip), initially unengaged.
  - TIME SCRUBBER 0 → 48 h.
  - Attack (0–6 h): a T cell stops on an infected cell, kills it (short version of the kill; no lens) and releases IFN-γ (small blue glowing dots that diffuse through the tissue).
  - Response (6–24 h): tissue cells reached by IFN-γ raise PD-L1 (crimson bar icons with "−") and display extra MHC.
  - Brake (24–48 h): PD-1 on the T cell engages PD-L1. The PD-1 ledger segment grows and the net marker falls. Show the braking as FEWER LASTING CONTACTS, DIMMER IFN-γ OUTPUT AND FEWER COMPLETED KILLS: the T cell keeps crawling at the same speed (do NOT slow it down) but rarely settles into a stable contact, and its IFN-γ puffs get smaller. Chip: "The tissue says: that's enough." (Biology note for the builder: PD-1 engagement blocks the "stop" signal that normally makes a T cell halt on its target, so engaged T cells keep moving; Pardoll 2012; Fife et al., Nat Immunol 2009.)
  - Switch "Remove PD-1 (knockout)": PD-1 stalks disappear; PD-L1 still appears but nothing engages it; the net marker stays high; T cells keep stopping and attacking, and healthy tissue cells near the attack start showing damage (cracked outlines, dimming). Chip: "Mice without PD-1 develop autoimmunity too: milder and slower than without CTLA-4 (in one strain, a fatal disease of the heart muscle)."

  INFO CHIPS (tap/hover "i" icons; keep to these two): "B7 = two proteins, CD80 and CD86. CD28 and CTLA-4 bind both; CTLA-4 binds much more tightly." · "Simplification: each brake mostly works where shown, but also acts in the other place to some extent."

  ACCURACY GUARDRAILS:
  - Brakes dampen signaling; they never kill the T cell.
  - CD28 is present on the naive T cell before activation; CTLA-4 appears only after activation (Tregs, not shown here, always carry it).
  - B7 is on the dendritic cell, not on ordinary tissue cells. PD-L1 can appear on many cell types when they sense IFN-γ.
  - PD-1 engagement must not be drawn as slowing the T cell's crawling.
  - Brakes = crimson + minus icon; accelerators = green-cyan + plus icon.
  MOBILE (<600px): tabs at top; the ledger full width above the scene; scrubber full width below; the knockout switch as one large toggle.
  REDUCED MOTION: scrubber positions jump between states; no particle drift; knockout states shown as static end states.
steps:
  1. In the lymph node, a dendritic cell presents a match. The receptor supplies signal 1; CD28, gripping B7, supplies signal 2. The accelerator is pressed, and the T cell starts photocopying itself.
  2. Over the next days, the T cell makes CTLA-4. It binds the same B7 molecules as CD28, but much more tightly, crowding the accelerator out.
  3. CTLA-4 can even pull B7 off the dendritic cell and destroy it. With less B7 to go around, the response levels off instead of running away.
  4. Remove CTLA-4 and nothing caps the response. In mice born without it, many T cells, mostly helpers, attack the body's organs, and the animals die within three to four weeks.
  5. In the tissue, the attack brings its own feedback. Interferon-gamma from killer T cells makes surrounding cells display PD-L1. When PD-1 meets PD-L1, the T cell makes fewer lasting contacts and kills less.
  6. Remove PD-1 and the tissue loses its way of saying "enough". Mice without PD-1 also develop autoimmunity, though milder and slower than without CTLA-4.
alt: An interactive pair of scenes showing a T cell's go and stop signals. In a lymph node, a T cell activated through CD28 and B7 later makes CTLA-4, which grabs B7 more tightly than CD28 and even strips it off the dendritic cell, capping the response; without CTLA-4, many T cells activate against self and invade organs. In an infected tissue, interferon-gamma released by attacking T cells makes surrounding cells display PD-L1, which engages PD-1 so that T cells make fewer lasting contacts and kill less; without PD-1, healthy tissue is damaged.
:::

:::figure ch05-exhaustion
title: When the fight never ends
goal: After using this, the reader leaves with two pictures. First, an acute response ends, while a chronic one never does and drives T cells into exhaustion, a stable state set up by TOX. Second, releasing the PD-1 brake makes a small stem-like reserve burst into new cells, while the most exhausted cells barely respond.
kind: simulation
stage: dark
spec: |
  LAYOUT (desktop). Upper ~60%: a scene with two compartments side by side: left "Lymph node" (rounded outline), right "Infected tissue / tumor" (irregular tissue patch with a few target cells carrying pink peptides). Lower ~40%: a time chart on a light inset panel (paper background, ink lines), x = days 0–60, y = relative level (no units), with a playhead that moves as the simulation runs.

  CELLS. Keep it sparse: at most ~10 drawn cells per compartment; larger populations are shown by a soft density haze plus a number label ("×100"). All cells are electric blue (#4C8DFF) killer T cells from one clone. Each cell's overall function is shown by ONE property: its glow (bright = fully functional, faint = hypofunctional). Details live in hover/tap cards, not on the cells.
  Small markers (appear only when their step introduces them):
  - Inhibitory-receptor badges (crimson #E5484D, "−" icon), 0–3 per cell, from step 2.
  - A small "TOX" tag on EVERY cell of the exhausted lineage, stem-like cells included, from step 3.
  - A padlock labeled "terminal (TCF1 lost)" on terminally exhausted cells only, appearing automatically at step 3. The padlock means terminal differentiation, NOT "has TOX".
  - Stem-like cells (from step 4): a small sprout badge labeled "TCF1"; they sit in the lymph-node compartment, carry one PD-1 badge, a TOX tag and a medium glow.
  - Memory cells (acute mode): plain bright cells, no badges.

  TIME CHART (illustrative curves, not data): three directly labeled lines, distinguished by color AND dash style: "Antigen" (hot pink #FF3D7F, dashed), "Specific T cells" (blue, solid), "Function per cell" (green-cyan, dotted).

  CONTROLS (few, revealed with the steps): segmented control "Acute infection | Chronic infection or tumor"; Play / Pause; Restart. At step 5, a button "Release the PD-1 brake" appears (chronic mode; enabled after day 30); after the reader has used it once, a second button appears: "Remove the stem-like reserve, then try again". No speed control, no drawer, no locks switch.

  BEHAVIOR: ACUTE. Antigen peaks around day 5–7 and is cleared by about day 10–14. T cells expand strongly (days 3–10), all glowing brightly; a PD-1 badge appears briefly during activation, then disappears. After clearance most cells fade away (contraction), leaving a few bright memory cells in both compartments. "Function per cell" stays high.

  BEHAVIOR: CHRONIC. Antigen rises and settles on a plateau (partly controlled, never cleared). T cells expand, then over weeks their glow fades to faint (never off), and they gain 1 → 2 → 3 inhibitory badges. From about day 10, every cell in the responding family carries a TOX tag. From about day 20, cells in the tissue that have lost TCF1 gain the "terminal" padlock. The stem-like reserve in the lymph node stays small but stable: every few sim-days a stem-like cell divides, one daughter stays (self-renewal; a short loop arrow), the other migrates to the tissue, starts moderately bright, then fades and eventually gains a padlock. "Function per cell" drifts down to roughly a third; T-cell numbers settle below the acute peak.

  RELEASE THE PD-1 BRAKE (chronic only). All PD-1 badges grey out with a strike-through. Over ~7–10 sim-days, stem-like cells divide rapidly (a burst; the lymph-node compartment fills), sending a wave of new, brighter cells (still TOX-tagged) into the tissue; antigen dips on the chart and "Function per cell" rises. Padlocked cells change very little. If antigen is still present, the new wave gradually fades and gains badges and padlocks again over the following weeks (re-exhaustion). After "Remove the stem-like reserve, then try again", releasing the brake produces only a small, brief effect, because the burst has no source.

  HOVER/TAP CARDS:
  - Stem-like (progenitor) exhausted cell: "TCF1 high, PD-1 moderate. Also TOX+: already committed to the exhausted family. Renews itself, sits mostly in lymphoid tissue, sends out new cells. Responds when PD-1 is released."
  - Terminally exhausted cell: "TCF1 lost; PD-1, TIM-3 and LAG-3 high. Still kills (in tumors these are the main killers) but rarely divides and is short-lived. Barely responds when PD-1 is released."
  - Memory cell: "Long-lived, fully functional, no inhibitory receptors."
  - Any exhausted cell, functions list: "Multiply · IL-2 · TNF/IFN-γ · Kill", with the first two dimmed first (order follows Wherry et al., J Virol 2003, for the builder's reference).

  ACCURACY GUARDRAILS:
  - Exhaustion is a distinct, stable cell state, not a temporary lack of energy, and it arises from PERSISTENT antigen.
  - TOX marks the whole exhausted lineage, including the stem-like reserve; the padlock marks only terminal differentiation (loss of TCF1).
  - Stem-like cells are PD-1-positive (moderate), not PD-1-negative.
  - Re-exhaustion after release follows Pauken et al., Science 2016.
  - Footnote under the scene: "Simplified. In chronic viral infection in mice, stem-like cells sit mainly in lymphoid tissue; in tumors they are also found in niches inside the tumor. Curves are illustrative."
  - This figure shows the biology of releasing the PD-1 brake, not a specific drug; don't draw antibodies.
  MOBILE (<600px): compartments stacked (lymph node above, tissue below), chart below; at most ~6 drawn cells per compartment; buttons full width.
  REDUCED MOTION: replace continuous play with a 4-position segmented control showing static snapshots at days 0, 10, 30 and 45 (plus "after release" in chronic mode).
data: |
  Illustrative shapes only; no real data plotted. Acute: antigen peaks ~day 5–7, cleared ~day 10–14; T cells peak ~day 8–10, then contract ~90% over the following weeks; function stays high. Chronic: antigen plateaus from ~day 10; T cells peak, then settle at a lower plateau; function per cell declines to ~30% by day 30–40. After release (if triggered at day 35): T cells rise sharply over ~7–10 days, antigen dips by roughly half and function rises, then both drift back if antigen persists.
steps:
  1. In an acute infection, the virus is cleared within days to weeks. Killer T cells expand, do their job, and most then die, leaving a small, fully functional memory force.
  2. In a chronic infection or a tumor, the antigen never goes away. Week by week, the T cells lose abilities and pile up inhibitory receptors such as PD-1.
  3. Persistent stimulation switches on TOX, which commits the whole responding family, reserve included, to an exhausted identity. The most worn-out cells become locked in for good.
  4. The response doesn't collapse: a small reserve of stem-like T cells, marked by TCF1, renews itself and keeps sending out fresh recruits. Exhaustion is a truce, not a surrender.
  5. Release the PD-1 brake. The burst of new T cells comes almost entirely from the stem-like reserve; locked cells barely respond. Then remove the reserve and try again.
alt: A simulation comparing an acute infection with a chronic infection or tumor. In the acute case, killer T cells expand, clear the antigen and leave a few fully functional memory cells. In the chronic case, the antigen persists and T cells fade in function, accumulate inhibitory receptors such as PD-1, and are committed to exhaustion by TOX, while a small reserve of stem-like TCF1-positive cells in the lymph node keeps supplying new cells. Releasing the PD-1 brake triggers a burst of new T cells that comes almost entirely from this reserve, and has little effect once the reserve is removed.
:::


# ===== 06-cancer (4 figures) =====

:::figure ch06-clonal-evolution
title: Evolution in a patch of tissue
goal: After using this, the reader understands that cancer arises from random mutation plus selection — most mutations are harmless passengers, rare drivers let one family of cells out-compete its neighbors, several drivers must pile up in the same lineage — and that the result is a branching family tree in which trunk mutations are in every cancer cell and branch mutations in only some.
kind: simulation
stage: dark
spec: |
  WHAT IT IS. An honest, simplified evolution simulator of a sheet of lining tissue (an epithelium, like the lining of
  the colon), with a guided "story" mode (7 steps, seeded and partly scripted so the story always plays out) and a
  free-play mode. The reader watches mutations appear at random, sees selection enlarge some families of cells, and
  sees a family tree grow alongside the tissue.

  LAYOUT (desktop, ~16:9 stage). Left ~62%: the TISSUE panel (Canvas 2D). Right ~38%: the FAMILY TREE panel (SVG)
  on top and a COUNTERS strip below it. Under the stage (HTML, not canvas): the step caption (ARIA live region) and
  the controls. MOBILE (< 700 px): portrait. Tissue panel on top (full width, aspect ~3:4), family tree below it
  (full width, ~220 px tall), counters as one line of small text. No horizontal page scroll; the tree compresses to
  fit the width (labels drop to single letters, full names in a tap tooltip).

  TISSUE PANEL. A hexagonal grid (desktop ~44 x 28 ≈ 1,200 sites; mobile ~26 x 36 ≈ 940). The top ~75% of rows are
  the epithelium. A thin, softly glowing horizontal line marks the BASEMENT MEMBRANE (label once: "boundary layer").
  The bottom ~25% is STROMA: dark background with a few static spindle-shaped fibroblasts (gray-beige #9C8F80),
  scenery only. Each epithelial site holds one cell drawn as a slightly irregular rounded hexagon with a small
  nucleus.
  - Cell look by number of drivers in its lineage (color AND shape, never color alone):
    0 drivers: sand #E9C9A1, calm outline, round nucleus.
    1 driver: sand with a thin violet rim; small "1" badge visible only when zoomed/hovered.
    2 drivers: blended sand-violet fill (~50% toward #B65FD8), slightly enlarged nucleus.
    3+ drivers ("cancer"): violet-magenta #B65FD8, lumpy irregular outline, large misshapen nucleus (the art
    library's cancer-cell silhouette at small scale).
  - New-mutation flash: whenever a division produces a mutation, a tiny white spark appears on the daughter for
    ~300 ms. Passenger = small neutral spark; driver = a larger spark with a gold ring and a brief floating label
    naming the gene ("APC", "KRAS", "TP53" in story mode; generic "driver" in free play).
  - Tapping/hovering a cell opens a small card: "This cell carries N mutations: D drivers (names) and P passengers.
    Its family: X cells." The cell's whole clone is outlined.

  MODEL (agent-based Moran-style competition on the grid; one "tick" ≈ one round of cell turnover; suggested
  parameters, tune to the targets below; provide a dev-only tuning panel behind a URL flag).
  - Homeostasis: each tick, ~2% of epithelial cells attempt to divide. A dividing cell places its daughter into a
    randomly chosen neighboring epithelial site, replacing (killing) the occupant — the tissue stays full, as a real
    lining does. Division probability per tick = base x (1 + s)^d, where d = number of drivers, base ≈ 0.02 and
    s ≈ 0.25 (each driver = 25% more division; exaggerated for visibility, and said so in the scientific note; tune
    s so that a first-driver clone usually grows into a patch rather than sweeping the whole sheet).
  - Mutation: each division gives the daughter Poisson(1) new passenger mutations (counted, not individually drawn)
    and, with a small probability μd, one new driver. Set μd from the timescale rather than as a fixed number: with
    "normal repair", a new driver should appear somewhere in the sheet roughly once every 3–6 "years"; "faulty repair"
    multiplies both passenger and driver rates by 10.
    In story mode, drivers are placed by script at the moments described in the steps (see below), always into a
    random cell of the right lineage, so the story is reproducible but still looks random.
  - Invasion: only cells with 3+ drivers may place daughters into stroma sites below the boundary layer (they can
    also invade empty or fibroblast sites, pushing scenery aside). Cells with fewer drivers never cross the line.
  - Each mutation has an id; each cell stores the ids it inherited. A clone = cells sharing the same most recent
    driver.
  - Use a seeded RNG ("Replay" reproduces a run). Pause the loop when off-screen or the tab is hidden.

  FAMILY TREE PANEL. A left-to-right tree: the root (left) is "the original cell". Each node is a clone founded by a
  driver mutation; the edge leading to it is labeled with that driver's gene name and its length grows with the
  number of passengers that accumulated on it (passengers shown as small tick marks along the edge, at most ~12
  ticks per edge, then a "+N"). Node circle area ∝ current clone size; color = the cell color for that driver count.
  Extinct clones stay in the tree as hollow gray circles (history matters — most driver clones die out by chance).
  Within the cancer, sub-clones defined by new passengers + any further driver form BRANCHES: once the cancer clone
  exceeds ~150 cells, the simulation starts tracking new passenger mutations that arise in cancer cells; the
  descendants of a cell carrying a tracked mutation form a "branch" (label B1, B2, B3…), drawn as a new edge off the
  cancer node only once it exceeds ~5% of the cancer — as in real sequencing, tiny branches are invisible. Branches
  may nest (a branch within a branch). They are colored by small hue shifts of violet plus a distinct hatch/dot
  pattern so they are distinguishable without color.
  - TRUNK HIGHLIGHT: the path from the root to the founding cancer cell is drawn thicker and labeled "trunk".
  - Tapping the trunk lights up (outline glow) every cancer cell in the tissue; tapping a branch lights up only that
    branch's cells. This is the key interaction of step 6.

  COUNTERS STRIP. Two counters only: "Time: N years (illustrative)" (map ticks to years so that the story-mode
  cancer appears at ~40–60 "years") and "Cells with ≥1 driver: X%" (the eyelid callback). Average mutations per cell
  and drivers in the largest family belong in the tapped-cell card instead.

  CONTROLS. Stepper (Back / Next, step dots) for story mode; after step 7, free play unlocks: Play/Pause; Speed 1x /
  4x / 16x; Reset (new seed); Replay; segmented control "DNA repair: normal | faulty (10x mutations)".

  STORY MODE (each step plays a short scripted stretch, then holds; captions below are verbatim):
  1. Healthy tissue turns over at a steady rate. Sparks of passengers appear constantly; nothing changes visibly.
     Tree: a single root with a lengthening edge of ticks.
  2. Script a first driver ("APC") into one cell near the center. Its family slowly enlarges into a patch. Tissue
     still looks normal (cells keep their shape; thin violet rims only).
  3. Script two more first-driver clones elsewhere; run until at least one of them goes extinct by chance (show it
     turning hollow gray in the tree) while the APC patch persists. The "Cells with ≥1 driver" counter climbs into
     the 20–30% band measured in normal eyelid skin, where it must sit when this caption appears.
  4. Script a second driver ("KRAS") inside the APC patch. A faster-growing sub-patch forms and bulges (cells there
     drawn slightly crowded, as in a benign polyp). Tree: a new node branching off the APC node.
  5. Script a third driver ("TP53") inside the KRAS patch. Its cells become violet cancer cells and begin pushing
     through the boundary layer into the stroma (animate the line breaking where they cross). Tree: cancer node,
     trunk highlighted.
  6. Run on until 2–4 branches (B1–B3) exist within the cancer. Prompt the reader to tap the trunk, then a branch.
  7. Hand over to free play.

  TUNING TARGETS (more important than exact numbers):
  - In free play with normal repair, at 16x speed, a run of "80 years" produces a cancer in only a minority of runs
    (roughly 1 in 4), so readers see that cancer needs several unlucky hits in one lineage. With faulty repair,
    most runs produce a cancer, and sooner.
  - Most single-driver clones remain small or die out; a few take over patches of tens to hundreds of cells.
  - At the end of step 3 the "Cells with ≥1 driver" counter reads between 20% and 30% — the range measured in normal
    eyelid skin (Martincorena et al. 2015: 18–32% of cells).
  - PROGRESSIVE DISCLOSURE: steps 1–5 are about the tissue, and the tree panel shows only one node per driver clone
    (no passenger tick marks, no branches). Passenger ticks and the trunk/branch view appear only at step 6, when the
    caption asks for them.

  SCIENTIFIC CARE (what the builder must not get wrong).
  - Mutations are random and appear in normal and cancer cells alike; a driver is not "chosen" because the cell
    needs it. Selection shows up only as different division rates.
  - No single mutation turns a cell into cancer; the violet cancer look appears only at 3+ drivers. (Real cancers
    need roughly two to eight; three is a simplification, mentioned in the caption.)
  - Benign growth (2 drivers) never crosses the boundary layer; crossing it is what makes a growth malignant.
  - Passengers vastly outnumber drivers; the tree must make that visible (many ticks, few named nodes).
  - Time is compressed and illustrative; selective advantages are exaggerated so change is visible within seconds.
  - Do not draw immune cells in this figure (immunity enters in Chapter 7's simulation).
  - Reduced motion: no sparks or bulging animation; advance the simulation in larger jumps (redraw ~4 times per
    second) and let each story step jump to its end state.
steps:
  1. A healthy lining renews itself all the time: cells divide just fast enough to replace those that are lost. Every division leaves a few copying errors behind. Almost all are passengers that change nothing.
  2. By chance, one cell picks up a driver mutation. Its descendants divide a little more often than their neighbors, so the family slowly takes over a patch. The tissue still looks normal.
  3. Most driver families go nowhere — some simply die out by chance. But in an older body, normal-looking tissue becomes a patchwork of mutant families, just like the eyelid skin.
  4. Inside the enlarged family, a second driver strikes. The new sub-family grows faster still and forms a small, benign bulge, like a polyp in the colon.
  5. A third driver lands in the same lineage. Its cells now ignore the boundary layer and push into the tissue beneath. A growth that invades is a cancer. (Real cancers usually need between two and eight drivers.)
  6. The cancer keeps mutating as it grows, so its family tree branches. Tap the trunk: its mutations are in every cancer cell. Tap a branch: its mutations are in only some.
  7. Now run it yourself. Most runs never produce a cancer, because several rare hits must land in the same lineage. Switch to faulty DNA repair and watch what changes.
alt: A simulation of a sheet of tissue in which cells divide and occasionally pick up random mutations. Most mutations are harmless passengers; rare driver mutations let a family of cells grow slightly faster and take over a patch. After three drivers accumulate in one lineage, its cells become cancerous and push through the boundary layer beneath the tissue. A family tree beside the tissue shows the trunk mutations shared by every cancer cell and later branches found in only some of them.
:::

:::figure ch06-antigen-kinds
title: The target map
goal: After using this, the reader can name the kinds of tumor antigen, and understands the three-way trade-off between targets that are tumor-specific, targets shared between patients, and targets present in most cancers — and why nothing scores well on all three.
kind: explorer
stage: light
spec: |
  PURPOSE. One idea, one picture: every tumor antigen is a compromise. The reader reveals five example antigens on a
  two-axis map and reads, for each, where it is found in healthy tissue and what the catch is.

  LAYOUT (desktop ~820 x 520, light stage = paper/surface background, ink lines). Left ~60%: the TARGET MAP (SVG).
  Right ~40%: the DETAIL CARD. MOBILE (< 700 px): map on top (square, full width, max 360 px), chips in a wrapped row
  below it, card below that. No horizontal page scroll.

  TARGET MAP. A square plot with plain-language axes and no numeric ticks.
  - x axis (bottom): "Where else is it found?" from "Also on healthy cells" (left) to "Only on cancer cells" (right).
  - y axis (left): "How many patients share it?" from "One patient" (bottom) to "Many patients" (top).
  - The top-right corner carries a faint gold wash labeled "Ideal targets" with a small star. A small note under the
    map reads: "Positions are approximate and vary by tumor and patient."
  - Five chips (rounded pills, each with a glyph, the example name, and the kind in small caps beneath it):
      "Personal neoantigen — NEOANTIGEN": hot-pink #FF3D7F bead with a tiny notch. Position (0.92, 0.10).
      "KRAS G12D — SHARED NEOANTIGEN": same bead with a small "x many" mark. Position (0.90, 0.55).
      "HPV E6/E7 — VIRAL ANTIGEN": red-coral #FF4D5E icosahedron. Position (0.95, 0.80).
      "NY-ESO-1, MAGE-A4 — CANCER-TESTIS ANTIGEN": small violet crescent. Position (0.78, 0.70).
      "HER2 — TUMOR-ASSOCIATED ANTIGEN": sand #E9C9A1 bead with a "+". Position (0.30, 0.78).
    Positions are (x, y) in 0–1 from the bottom-left corner. Each placed chip keeps a soft halo ellipse showing its
    plausible range (widest for the personal neoantigen in y, 0.05–0.25).
  - A third dimension, "how many cancers carry it", is shown as chip SIZE, with a legend: large = most cancers carry
    something of this kind (the two neoantigen chips, HER2), small = only some cancers (viral, cancer-testis). This
    is what stops the top-right corner from looking like a solved problem.
  - DEFAULT INTERACTION is tap-to-reveal: chips start in a tray above (desktop) or below (mobile) the map; tapping
    one glides it (400 ms) to its place and opens its card. A link "Let me guess first" switches to drag mode, in
    which the reader drops a chip and it then glides to its correct spot, with a one-line note if the drop was more
    than a quarter of the plot away. Keyboard: chips are buttons; Enter places the focused chip and opens its card.
    A "Show all" link places the rest.

  DETAIL CARD (verbatim text; four short fields): "What it is", "Found in healthy tissue", "The catch", "Used by"
  (with chapter links; keep the status words exactly as given).
  - Personal neoantigen — What it is: A fragment of a mutated protein, unique to this patient's tumor. Found in
    healthy tissue: Nowhere — the mutation exists only in the tumor. The catch: Different in almost every patient,
    and most typos never reach the shop window. Used by: Personalized vaccines (in trials, Chapter 11); much of the
    T-cell attack that checkpoint inhibitors unleash (approved, Chapter 8).
  - KRAS G12D — What it is: A mutation that recurs at the same spot in many cancers: roughly 45% of pancreatic and
    13% of colorectal cancers. Found in healthy tissue: Nowhere. The catch: Each person's HLA molecules decide
    whether the mutant fragment is displayed at all; the one type proven to display it, HLA-C*08:02, is carried by
    roughly 8% of white and 11% of Black Americans. Used by: Engineered T cells and vaccines (in trials,
    Chapters 10–11).
  - HPV E6/E7 — What it is: Proteins of a virus that drives the cancer. Found in healthy tissue: Only in infected
    cells — never in healthy, uninfected tissue. The catch: Only virus-driven cancers have them, a minority of all
    cancers, and the tumors make them in small amounts. Used by: Therapeutic vaccines and engineered T cells aimed at
    E6/E7 (in trials, Chapters 10–11). Preventive HPV vaccines work differently: they are built from the virus's
    shell protein and stop the infection in the first place (Chapter 11).
  - NY-ESO-1, MAGE-A4 — What it is: Proteins made almost nowhere in a healthy adult except in developing sperm cells,
    switched back on in many cancers. Found in healthy tissue: Sperm cells in the testis, which carry no MHC class I
    and so never display them; a few of this family also appear at low levels in the brain or placenta. The catch:
    Present in only some tumors, and often in only some of their cells. Used by: Engineered T cells —
    afamitresgene autoleucel, which targets MAGE-A4, was approved in 2024 for synovial sarcoma (Chapter 10).
  - HER2 — What it is: A normal growth-signal receptor that some cancers make in huge excess. Found in healthy
    tissue: At low levels on many normal tissues — the lining of the lung and gut, and heart muscle, which is why
    HER2 drugs are watched for effects on the heart (Chapter 9). The catch: Attacking it can harm healthy tissue; in
    2010 a patient died after engineered T cells aimed at HER2 apparently attacked the low levels of it in her lungs.
    Used by: Antibody drugs such as trastuzumab (approved, Chapter 9). Melanoma's pigment-making proteins (gp100,
    MART-1) belong to the same corner of the map: shared between patients, but present on healthy cells too.

  CAPTIONS. A caption area under the stage (aria-live) shows the step captions below, verbatim, with Back / Next
  buttons. Next places whichever chips the next caption describes, so the captions always match what is on the map.

  SCIENTIFIC CARE.
  - Positions are qualitative; the note under the map says so.
  - Do not imply a neoantigen is automatically visible: the first card says most never reach the window.
  - Cancer-testis antigens are not perfectly tumor-specific (hence x = 0.78, not 0.95) and are often patchy.
  - Viral antigens are tumor-specific only in the sense that healthy, uninfected cells lack them.
  - Reduced motion: chips jump to their places without gliding.
steps:
  1. Every tumor target is a compromise. Left to right: how tumor-specific it is. Bottom to top: how many patients share it. The size of each marker shows how many cancers carry a target of that kind.
  2. Neoantigens sit far to the right — only the tumor has them — but most are personal, near the bottom. A recurring mutation such as KRAS G12D climbs higher, and even then only for patients whose HLA molecules can display it.
  3. Viral and cancer-testis antigens come closest to the ideal corner: foreign, or hidden from the body, and shared by many patients. Their markers are small because only some cancers carry them.
  4. Self proteins such as HER2 are shared and easy to find, but healthy cells carry them too. That means weaker T cells, thanks to tolerance, and a risk of friendly fire.
data: |
  Sources for the card facts (the chapter's numbered list carries the main ones):
  - KRAS G12D in ~45% of pancreatic and ~13% of colorectal cancers; HLA-C*08:02 in ~8% of white and ~11% of Black
    Americans; the fragments GADGVGKSA / GADGVGKSAL displayed by HLA-C*08:02: Tran E, et al. N Engl J Med
    2016;375:2255–2262.
  - Male germ cells lack HLA class I; a minority of cancer-testis antigens are also expressed in brain or placenta,
    and some in thymic epithelium: Gjerstorff MF, et al. Oncotarget 2015;6:15772–15787.
  - HER2 (ERBB2) at low levels in normal tissues including heart muscle, the basis of trastuzumab's cardiac
    monitoring: Loibl S, Gianni L. Lancet 2017;389:2415–2429.
  - The 2010 death after HER2-directed engineered T cells, attributed to low ERBB2 on lung epithelial cells:
    Morgan RA, et al. Mol Ther 2010;18:843–851. doi:10.1038/mt.2010.24
  - Afamitresgene autoleucel (Tecelra), MAGE-A4-directed TCR T cells: FDA accelerated approval, early August 2024,
    for synovial sarcoma in patients with particular HLA-A*02 types.
  - HPV E6/E7 disable p53 and RB: zur Hausen H. Nat Rev Cancer 2002;2:342–350. Preventive HPV vaccines are built
    from the virus's L1 shell protein, not E6/E7 (Chapter 11).
alt: An interactive map that places five example tumor antigens by how tumor-specific they are and how widely they are shared between patients, with marker size showing how many cancers carry that kind of target. Personal neoantigens are highly specific but unique to each patient; the recurring mutation KRAS G12D is specific and shared, but displayed only by some HLA types; viral antigens such as HPV E6/E7 and cancer-testis antigens such as NY-ESO-1 are both specific and shared, but only some cancers carry them; self proteins such as HER2 are shared and common but are also found on healthy cells, including heart muscle.
:::

:::figure ch06-typo-to-target
title: From typo to target
goal: After using this, the reader understands that a mutation becomes visible to a T cell only if it clears five hurdles in turn — and that the third hurdle, display by one of the patient's own HLA molecules, is decided by what that patient inherited, not by the tumor.
kind: stepper
stage: dark
spec: |
  ONE IDEA: most typos never reach the shop window. The figure follows one real mutation, KRAS G12D, along the five
  gates, with a patient switch at gate 3 that makes it visible or invisible; afterwards the reader can send five
  other typos down the same pipeline and watch where each one stops. Everything else is deliberately left out.

  LAYOUT (desktop ~880 x 500, dark stage). Upper ~45%: the PIPELINE, five softly glowing arches left to right,
  numbered and labeled: 1 "Changes the protein?", 2 "Is it made?", 3 "Displayed by this person's HLA?", 4 "Looks
  new?", 5 "A matching T cell?". Beyond gate 5, a CD8 killer T cell (electric blue #4C8DFF, round, microvilli fuzz,
  TCR glyphs on its leading edge) waits beside a stretch of cancer-cell membrane (violet-magenta #B65FD8) carrying
  MHC class I cups (pale silver #D9DEEA). Lower ~55%: the WORKBENCH, showing one thing at a time, large.
  MOBILE (< 700 px): the pipeline becomes a vertical stack of five labeled bands; the workbench sits below it; the
  card strip (part B) wraps below that. No horizontal page scroll; in-SVG labels at 13 px minimum.

  PROGRESSIVE DISCLOSURE. Part B is hidden until the reader finishes part A (or presses "Skip to the other typos").
  Only the gate currently in play is at full brightness; gates already passed show a small green-cyan #3DDC97 check,
  gates not yet reached are dim.

  PART A — FOLLOW ONE TYPO (six steps; captions verbatim below).
  - Step 1 (DNA): a strip of KRAS coding DNA in triplets, 18 codons:
    ATG ACT GAA TAT AAA CTT GTG GTA GTT GGA GCT GGT GGC GTA GGC AAG AGT GCC
    (the start of the KRAS coding sequence, NCBI reference NM_004985; the first 18 codons are the same in both KRAS transcript variants). Codon 12, GGT, is highlighted;
    animate its middle letter G changing to A, giving GAT. Label: "codon 12: GGT → GAT".
  - Step 2 (protein): the amino-acid chain in one-letter code, residues 1–18:
    M T E Y K L V V V G A G G V G K S A, with residue 12's G morphing into D in hot pink #FF3D7F, giving
    M T E Y K L V V V G A D G V G K S A. A small folded-protein glyph labeled "KRAS — jammed 'on'". Gate 1 ✓.
  - Step 3 (made and cut): the mutant KRAS gene is switched on in every cancer cell and the cancer cannot afford to
    switch it off, so gate 2 ✓. Copies enter a silver-gray proteasome barrel; many short fragments emerge and most
    fade (as in Chapter 4); one survives, drawn as nine beads: G A D G V G K S A, the D bead hot pink, with a small
    ruler "9 amino acids". Underline residues 10–18 of the protein (and codons 10–18 of the DNA strip, kept visible
    as a thin reference line) so the fragment is traceable back to the letters.
  - Step 4 (display): the workbench shows this patient's six MHC class I cups — unlabeled, differing only in the
    shape of their grooves, because the names mean nothing to the reader. A two-option switch: "Patient A" (default)
    | "Patient B". With Patient A the fragment is tried in cup after cup and clicks into the sixth, which then gets
    the only label on screen: "HLA-C*08:02". Gate 3 ✓, and the loaded cup travels to the cancer-cell membrane. With
    Patient B the fragment slides out of all six cups and fades; gate 3 shows a crimson #E5484D "⊣" bar icon with
    "not displayed", and the gates beyond dim.
  - Step 5 (looks new, and a matching T cell): Patient A only. Side by side at the membrane: a healthy sand-colored
    cell displaying the normal fragment G A G G V G K S A, and the cancer cell displaying G A D G V G K S A. The T
    cell drifts past the healthy cell with no badge, stops at the cancer cell, and a green-cyan "+" badge appears at
    the contact. One soft pulse; no killing (that is Chapter 5).
  - Step 6 (what happened next): a small case card over the workbench — a lung outline with seven violet dots that
    shrink after "T cells infused", then one dot regrowing, with a callout showing that cell's cups missing the
    labeled one: "this tumor lost the chromosome carrying HLA-C*08:02". Link: "How tumors hide → Chapter 7".

  PART B — THE OTHER TYPOS. A strip of five cards. Selecting one sends its token down the same pipeline; it stops at
  the first gate it fails, which shows the crimson "⊣", and the caption area shows that card's sentence (verbatim):
  - "A silent typo" → gate 1: "The DNA letter changed, but the new codon still means the same amino acid. The protein
    is untouched."
  - "A typo in a gene this cell never uses" → gate 2: "The gene is switched off in this kind of cell, so the mutant
    protein is never made."
  - "A typo nobody can hold" → gate 3: "The mutant protein is made and chopped up, but none of the fragments fits any
    of this person's six grooves."
  - "A typo hidden in the groove" → gate 4: "The fragment is displayed, but the changed amino acid points down into
    the groove. From above it looks just like the normal fragment, which T cells learned long ago to ignore."
  - "A frameshift" → passes all five gates, with a flourish: the workbench shows the protein chain continuing past
    the mutation as a long run of hot-pink beads, several of which fit grooves. "A missing letter shifts the reading
    frame, so every amino acid after it is new — many new fragments, and a much better chance that one is seen.
    (Often the cell spots the broken recipe and shreds the message before any protein is made, so this is the best
    bet, not a sure thing.)"

  THE SCOREBOARD (replaces any funnel). Under the card strip, one horizontal bar of 100 small beads labeled
  "100 protein-changing mutations in a tumor". Two of them glow, labeled "about 2 are recognized by the patient's own
  T cells". Source line beneath, small: "Measured in 75 patients with digestive-tract cancers: 1.6% of
  protein-changing mutations were recognized (Parkhurst et al. 2019)." The losses at each gate are described in
  words in the caption, not drawn as numbers, because only the final share is measured.

  SCIENTIFIC CARE.
  - Patients A and B are hypothetical, and only HLA-C*08:02 is labeled. Do not give Patient B any of HLA-A*02,
    A*03 or A*11: peptides spanning codon-12 mutant KRAS have published reports of binding all three, so a reader
    could rightly object. The caption says "none of their six grooves holds this fragment well enough to display it",
    not that no HLA type anywhere could.
  - Peptides are 8–10 amino acids and are drawn as short strings of beads, never as folded proteins.
  - HLA type, not the mutation alone, decides display: never show the mutant fragment in one of Patient B's cups.
  - The healthy cell's normal fragment is there to make the contrast; T cells tolerant to it ignore it.
  - Gate 4's "hidden in the groove" is the common case, not a rule: a mutation can also create an anchor and so make
    a fragment displayable that never was before (the deep-dive text covers this). Do not state it as a rule on screen.
  - CD4 T cells and MHC class II also see neoantigens; this figure shows only the class I route, by choice.
  - Reduced motion: tokens jump from gate to gate; no bead animation.
steps:
  1. Start with one letter. In this tumor, the twelfth codon of the KRAS gene has changed from GGT to GAT.
  2. The cell's ribosomes read the changed codon and put aspartic acid (D) where glycine (G) belongs. The protein jams in its "on" position, driving the cancer — so the cancer keeps making it.
  3. Like every protein, KRAS is eventually shredded. Most fragments are destroyed, but one nine-amino-acid fragment — GADGVGKSA, written in the one-letter code — carries the change.
  4. Now the patient's own display molecules decide. One of Patient A's six grooves, the one called HLA-C*08:02, holds this fragment snugly and carries it to the surface. Switch to Patient B: none of their six grooves holds it well enough to display it, and the typo stays invisible.
  5. In Patient A, a passing T cell ignores the normal fragment on healthy cells and stops at the mutant one. The typo has become a target.
  6. This really happened. In 2016, T cells like these shrank all seven lung metastases of a woman with colorectal cancer. Months later one grew back — and its cells had lost the chromosome carrying HLA-C*08:02. Now try the other typos.
alt: A step-by-step journey of one mutation, KRAS G12D, from a changed DNA letter to a changed protein, a fragment nine amino acids long, display on an HLA molecule and recognition by a T cell. A switch shows that the fragment is displayed in a patient who carries HLA-C*08:02 but not in a patient whose grooves cannot hold it. The reader can then send other typos down the same five gates — changing the protein, being made, being displayed, looking new, and meeting a matching T cell — and see where each one stops. A scoreboard shows that of 100 protein-changing mutations, about two are recognized by the patient's own T cells.
:::

:::figure ch06-tmb
title: How many mutations?
goal: After using this, the reader understands that the number of mutations varies more than a thousandfold between and within cancer types; that sunlight and tobacco drive the highest counts while childhood cancers have the lowest; and that broken mismatch repair multiplies the count roughly tenfold — while knowing these are counts of mutations, not of visible neoantigens.
kind: chart
stage: light
spec: |
  PURPOSE. An honest, sourced "quantile dot strip" chart: one row per cancer type, each row a strip of 20 dots
  placed at the 2.5th, 7.5th, …, 97.5th percentiles of that type's tumor mutational burden (so each dot stands for
  one-twentieth — 5% — of the tumors). This shows both the typical value and the spread without plotting thousands
  of points. A guided three-step reveal, then free exploration.

  LAYOUT (desktop ~820 x 820 px, light stage = paper/surface background, ink lines).
  - Horizontal rows, one per cancer type (29 rows; data below), row height ~22 px, sorted by median (lowest at the
    bottom, highest at the top) within the current view. DEFAULT VIEW: only the twelve rows the captions need —
    Childhood B-cell leukemia, Medulloblastoma, Thyroid, Uveal melanoma, Pancreas, Breast, Colorectal MSS,
    Colorectal MSI-H, Bladder, Lung adenocarcinoma, Lung squamous-cell and Melanoma (skin) — with a "Show all 29"
    button beneath the chart; the remaining rows fade in among their neighbors when it is pressed. Left column (~230 px): row label, right-aligned, Inter
    13 px, ink. Rows for cancers of children and young adults carry a small tag glyph (a filled circle with "C")
    before the label, and their labels are set in ink-2.
  - X axis: LOG10 scale from 0.03 to 1,000 protein-changing mutations per megabase. Ticks and labels at 0.03, 0.1, 0.3,
    1, 3, 10, 30, 100, 300, 1,000 (label 0.03 as "≤0.03"). Light vertical gridlines. Axis title: "Protein-changing
    mutations per million DNA letters", with a smaller second line: "each labeled gridline is about ten times the one
    before it".
  - Each row: 20 dots (r = 3.5 px, 70% opacity, so overlapping dots darken), plus a short vertical tick (ink, 2 px,
    row-height tall) at the median and a small value label right of the strip ("median 14.9"). Values below 0.03
    are drawn at 0.03 (the smallest nonzero value in these data is 1 mutation per ~30 megabases).
  - Dot fill by group (ALWAYS paired with shape): childhood cancers = hollow circles (ink-2 stroke); adult cancers =
    filled circles in ink-2; mismatch-repair-deficient (MSI-H) rows = filled diamonds in accent (#3D5AFE-ish indigo,
    or the theme accent) — diamonds carry the distinction.
  - Source line under the chart (ink-3, 12 px): "Adult cancers: 32 of the 33 studies in The Cancer Genome Atlas
    PanCancer Atlas (about 10,000 tumors, whole-exome sequencing), via cBioPortal; its skin-melanoma samples are
    mostly metastases, which carry more mutations than primary tumors. Cancers of children and young adults:
    Gröbner et al., Nature 2018 (961 tumors of 24 types; the 795 primary tumors with mutation calls in cBioPortal).
    Each dot = 5% of tumors of that type. Counts depend on method: the published median for this younger cohort is
    0.13 mutations per megabase against 1.8 for TCGA adults, and clinical tests report different absolute numbers
    again."
  - Legend at top: hollow circle "cancer of children or young adults", filled circle "adult cancer", diamond "mismatch-repair
    deficient (MSI-high)".

  STEPS (shared stepper UI; captions verbatim below):
  - Step 1: All rows drawn at low opacity (20%), except four highlighted rows at full opacity: "Melanoma (skin)",
    "Lung squamous-cell", "Childhood B-cell leukemia (B-ALL)", "Medulloblastoma (brain, children)". A bracket above
    the axis spans from the B-ALL median (0.10) to the skin-melanoma median (14.9) with the label "about 150-fold
    between typical tumors"; a second, thinner bracket spans the lowest dot to the highest dot on the whole chart
    with "more than 1,000-fold between individual tumors".
  - Step 2: Full-opacity rows for "Melanoma (skin)" and "Uveal melanoma (eye)"; animate a soft connector between
    them labeled "same cell type — sunlight makes the difference". Also highlight "Lung adenocarcinoma" and "Lung
    squamous-cell" with a small sun/smoke icon tag ("sunlight", "tobacco smoke") next to the skin melanoma and lung
    rows respectively. Note the very wide spread of lung adenocarcinoma (it includes many never-smokers).
  - Step 3: Highlight the paired rows "Colorectal, MSS" and "Colorectal, MSI-H" and draw an arrow from the MSS
    median to the MSI-H median, labeled "≈ 11x". In the "Show all 29" view, draw the same arrow, unlabeled, on the
    endometrial pair.
  - After step 3: all rows at full opacity; a segmented control "Sort: by median | group childhood/adult" and a
    toggle "Show MSI-H rows" (on by default).

  INTERACTION. Hover/tap a row → highlight it and show a card: name; "Tumors analyzed: n"; "Median: x per
  megabase"; "Middle half of tumors: p25–p75"; "80% of tumors between p10 and p90"; plus the per-row note if any
  (data). Keyboard: rows focusable (arrow keys move; Enter opens the card; Escape closes).

  MOBILE (< 600 px): label column 120 px with labels wrapping to two lines (row height ~32 px); x axis labels only at
  0.1, 1, 10, 100, 1,000 (gridlines at all ticks); hide the median value labels (shown in the card); the card becomes
  a bottom sheet. Keep the twelve-row default view and the "Show all 29" button.

  SCIENTIFIC CARE.
  - Label these as counts of protein-changing mutations, NOT neoantigens; the caption of step 3 and the source line
    carry that caveat.
  - The log scale is essential; label it as log scale.
  - Do not compare these numbers with the FDA's "10 mutations per megabase" cut-off (Chapter 8): clinical panels
    count differently. Do not draw that line on this chart.
  - Do not put a "broken proofreading enzyme (POLE)" label on the chart; the note in the data block explains the
    endometrial row's long tail for the builder only.
  - Childhood and adult data come from different studies processed by the same portal method (protein-changing
    mutations divided by ~30 megabases of exome); the source line says so.
  - Reduced motion: no animated connectors; show highlighted states directly.
steps:
  1. Each row is one kind of cancer, and each dot stands for 5% of its tumors. Typical tumors differ about 150-fold — from childhood leukemias, with almost no protein-changing mutations, to skin melanomas. Individual tumors differ more than a thousandfold.
  2. Causes leave their mark. Melanomas of sun-exposed skin carry dozens of times more mutations than melanomas of the eye, which sunlight barely reaches. Lung cancers, mostly in smokers, rank near the top.
  3. A broken mismatch-repair system multiplies the count about tenfold, whatever the organ. Remember, though: these are mutations, not visible neoantigens — and only a small minority of mutations ever become targets.
data: |
  Units: protein-changing (nonsynonymous) somatic mutations per megabase, as computed by cBioPortal
  (TMB_NONSYNONYMOUS = count of nonsynonymous mutations / ~30 Mb exome). Childhood rows: primary tumors only. TCGA
  rows: all samples in each PanCancer Atlas study, almost always one per patient (skin melanoma in TCGA is mostly
  metastatic samples). Tumors recorded with
  zero mutations were excluded (in TCGA these are mostly samples whose mutation calls were filtered out; ovary had
  114 such samples, breast 57, kidney 46; childhood 24 in total).
  MSI status for colorectal and endometrial rows: MANTIS score > 0.4 = MSI-H (threshold of Bonneville et al. 2017),
  scores from the same cBioPortal studies.
  Sources: TCGA PanCancer Atlas 2018 studies on cBioPortal (Hoadley et al. Cell 2018; mutation calls from the MC3
  project, Ellrott et al. Cell Syst 2018); childhood: study "pediatric_dkfz_2017" on cBioPortal (Gröbner et al.
  Nature 2018). Computed for this guide on 5 Oct 2026.
  Columns: group | label | n | p10 | p25 | median | p75 | p90 | 20 quantile dots (2.5th … 97.5th percentiles) | note
  child | Childhood B-cell leukemia (B-ALL) | 42 | 0.03 | 0.04 | 0.10 | 0.22 | 0.36 | 0.03 0.03 0.03 0.03 0.03 0.07 0.07 0.07 0.10 0.10 0.10 0.12 0.13 0.17 0.20 0.23 0.27 0.32 0.49 0.60 | Often driven by large chromosome changes rather than many small mutations.
  child | Retinoblastoma (eye, children) | 29 | 0.03 | 0.07 | 0.10 | 0.17 | 0.23 | 0.03 0.03 0.03 0.03 0.07 0.07 0.07 0.07 0.07 0.10 0.10 0.10 0.13 0.13 0.14 0.17 0.17 0.20 0.23 0.24 | Usually caused by the loss of both copies of a single brake gene, RB1.
  child | Wilms tumor (kidney, children) | 44 | 0.07 | 0.13 | 0.20 | 0.27 | 0.47 | 0.03 0.07 0.08 0.10 0.12 0.13 0.13 0.17 0.17 0.18 0.20 0.20 0.23 0.23 0.27 0.28 0.32 0.43 0.49 0.53 | —
  child | Neuroblastoma (children) | 46 | 0.03 | 0.07 | 0.25 | 0.49 | 0.60 | 0.03 0.03 0.03 0.03 0.07 0.07 0.10 0.13 0.20 0.21 0.27 0.30 0.37 0.43 0.47 0.50 0.54 0.57 0.72 1.51 | —
  child | Medulloblastoma (brain, children) | 215 | 0.07 | 0.20 | 0.33 | 0.60 | 0.93 | 0.03 0.07 0.07 0.13 0.17 0.20 0.23 0.27 0.30 0.30 0.33 0.40 0.43 0.48 0.57 0.63 0.70 0.84 1.16 2.09 | —
  child | Osteosarcoma (bone, children) | 32 | 0.03 | 0.06 | 0.15 | 0.48 | 0.60 | 0.03 0.03 0.03 0.03 0.03 0.07 0.07 0.07 0.07 0.11 0.18 0.23 0.37 0.43 0.47 0.50 0.55 0.57 0.62 1.50 | —
  adult | Thyroid | 484 | 0.17 | 0.23 | 0.33 | 0.53 | 0.82 | 0.10 0.13 0.17 0.20 0.23 0.23 0.27 0.30 0.30 0.33 0.37 0.40 0.40 0.47 0.50 0.53 0.60 0.70 0.97 2.19 | —
  adult | Testicular germ-cell | 143 | 0.23 | 0.30 | 0.40 | 0.63 | 0.83 | 0.15 0.20 0.26 0.27 0.30 0.30 0.33 0.37 0.40 0.40 0.43 0.50 0.53 0.57 0.60 0.67 0.70 0.77 0.93 1.31 | Mostly young men.
  adult | Uveal melanoma (eye) | 80 | 0.23 | 0.30 | 0.40 | 0.51 | 0.63 | 0.20 0.23 0.23 0.27 0.29 0.30 0.30 0.33 0.37 0.37 0.40 0.43 0.45 0.47 0.50 0.53 0.57 0.60 0.67 0.70 | Same cell type as skin melanoma, but shielded from sunlight.
  adult | Acute myeloid leukemia (adult) | 199 | 0.13 | 0.27 | 0.53 | 0.97 | 1.65 | 0.07 0.10 0.17 0.20 0.27 0.30 0.33 0.40 0.47 0.50 0.53 0.63 0.72 0.87 0.93 1.03 1.13 1.38 1.87 10.7 | —
  adult | Prostate | 491 | 0.47 | 0.70 | 0.90 | 1.20 | 1.77 | 0.17 0.40 0.50 0.60 0.67 0.70 0.74 0.80 0.83 0.87 0.93 0.97 1.03 1.07 1.13 1.26 1.40 1.60 2.00 3.10 | —
  adult | Pancreas | 174 | 0.31 | 0.90 | 1.20 | 1.60 | 2.27 | 0.04 0.23 0.40 0.58 0.76 0.92 1.00 1.06 1.10 1.17 1.20 1.27 1.37 1.46 1.53 1.67 1.90 2.07 2.47 3.02 | —
  adult | Breast | 1009 | 0.63 | 0.90 | 1.40 | 2.40 | 4.43 | 0.43 0.59 0.70 0.77 0.87 0.93 1.00 1.10 1.20 1.33 1.44 1.63 1.80 2.00 2.23 2.63 3.15 4.10 4.99 10.9 | —
  adult | Kidney (clear cell) | 356 | 0.97 | 1.30 | 1.80 | 2.30 | 2.95 | 0.56 0.85 1.05 1.17 1.27 1.37 1.43 1.53 1.63 1.73 1.87 1.90 2.00 2.12 2.23 2.40 2.50 2.75 3.13 3.66 | Responds to checkpoint inhibitors fairly often despite this modest count; one proposed reason is its unusually high share of frameshift mutations (Turajlic et al. Lancet Oncol 2017).
  adult | Glioblastoma (brain) | 394 | 1.07 | 1.37 | 1.72 | 2.23 | 3.21 | 0.67 0.97 1.13 1.23 1.33 1.40 1.47 1.53 1.60 1.70 1.77 1.83 1.90 2.07 2.17 2.30 2.53 2.86 3.94 10.5 | —
  adult | Ovary (high-grade serous) | 409 | 0.97 | 1.60 | 2.30 | 3.43 | 4.89 | 0.41 0.83 1.10 1.31 1.53 1.67 1.82 1.93 2.10 2.23 2.37 2.53 2.73 2.90 3.23 3.57 3.97 4.63 5.73 7.59 | —
  adult | Liver | 358 | 1.49 | 2.10 | 2.87 | 3.97 | 5.59 | 0.76 1.26 1.59 1.77 2.00 2.17 2.30 2.43 2.62 2.80 2.97 3.17 3.47 3.63 3.80 4.07 4.50 5.25 6.23 9.93 | —
  adult | Cervix | 281 | 1.37 | 1.90 | 2.97 | 5.13 | 10.33 | 0.73 1.23 1.40 1.57 1.77 1.97 2.07 2.13 2.40 2.80 3.10 3.47 3.70 4.13 4.93 5.30 6.37 8.67 12.0 37.3 | Almost always driven by HPV, whose proteins are foreign antigens.
  adult | Head and neck (squamous) | 502 | 1.28 | 2.20 | 3.62 | 6.12 | 11.13 | 0.77 1.17 1.60 1.87 2.13 2.36 2.76 3.03 3.20 3.50 3.80 4.17 4.50 5.04 5.73 6.65 8.23 10.4 13.1 18.7 | Includes tobacco-related and HPV-driven tumors.
  adult | Esophagus (adenocarcinoma) | 182 | 1.94 | 2.75 | 3.53 | 5.13 | 7.16 | 1.48 1.80 2.03 2.40 2.59 2.83 3.00 3.13 3.30 3.47 3.67 3.97 4.13 4.49 5.03 5.50 6.30 6.90 7.69 13.5 | —
  adult | Stomach | 435 | 1.51 | 2.43 | 3.90 | 8.52 | 39.59 | 0.69 1.30 1.63 1.97 2.29 2.54 2.80 3.13 3.41 3.77 4.23 4.69 5.20 6.37 7.67 10.3 21.3 32.5 43.4 72.1 | The long right tail is mostly MSI-high tumors (about one in five here).
  adult | Colorectal, MSS | 442 | 1.90 | 2.57 | 3.30 | 4.37 | 5.67 | 0.57 1.70 2.04 2.30 2.47 2.67 2.80 2.90 3.07 3.23 3.37 3.50 3.73 3.97 4.20 4.53 4.87 5.33 6.03 12.2 | Mismatch repair intact (microsatellite stable).
  msi | Colorectal, MSI-H | 84 | 4.09 | 25.91 | 36.65 | 54.46 | 75.01 | 2.08 3.24 4.49 7.29 21.2 27.2 30.3 32.6 35.2 36.3 37.1 39.3 40.6 47.3 52.0 58.2 64.1 66.8 79.4 115.3 | Mismatch-repair deficient; about 11x the MSS median.
  adult | Endometrium (uterus), MSS | 352 | 1.10 | 1.40 | 1.83 | 2.75 | 42.97 | 0.83 1.01 1.13 1.31 1.37 1.43 1.50 1.63 1.70 1.80 1.90 2.03 2.17 2.36 2.58 3.10 4.28 7.76 115.2 343.5 | The top dots are "ultramutated" tumors with a broken proofreading enzyme (POLE), not mismatch-repair defects.
  msi | Endometrium (uterus), MSI-H | 161 | 9.90 | 13.73 | 20.00 | 33.23 | 155.63 | 6.17 8.73 10.1 11.3 12.5 14.2 14.8 15.9 18.2 19.4 21.0 22.0 24.3 26.9 29.8 34.2 43.9 90.0 216.4 383.9 | Mismatch-repair deficient; about 11x the MSS median.
  adult | Bladder | 409 | 1.93 | 3.07 | 5.77 | 10.40 | 16.87 | 0.90 1.63 2.10 2.53 2.90 3.33 3.75 4.33 4.91 5.59 6.05 6.87 7.63 8.43 9.72 11.1 12.8 14.3 20.0 28.9 | —
  adult | Lung adenocarcinoma | 561 | 1.33 | 2.83 | 6.73 | 13.70 | 23.07 | 0.67 1.13 1.63 2.07 2.53 3.17 3.70 4.27 5.03 6.27 7.13 8.20 9.27 10.8 12.7 14.6 16.7 20.2 26.5 41.2 | Very wide spread: includes both smokers and never-smokers; smokers' lung cancers carry about 10x more mutations (Vogelstein et al. 2013).
  adult | Lung squamous-cell | 469 | 3.76 | 5.60 | 7.93 | 11.33 | 17.23 | 1.67 3.30 4.20 4.96 5.40 5.85 6.20 6.67 7.13 7.61 8.17 8.90 9.65 10.5 11.1 11.8 12.7 15.1 19.8 30.5 | Strongly tied to smoking.
  adult | Melanoma (skin) | 440 | 2.52 | 7.04 | 14.88 | 31.39 | 54.30 | 0.77 2.00 3.49 5.00 6.31 7.65 9.26 10.7 12.3 13.7 15.7 18.2 20.8 23.3 28.2 32.7 40.8 50.3 63.6 103.1 | Sunlight's signature dominates; the highest single tumor in these data lies above 1,000 per megabase, beyond the axis.
  Summary rows (optional, for a footnote): all 32 TCGA cancer types together (n = 10,105 after excluding zeros) median 2.0; all tumors of children and young adults in the study (n = 771) median 0.23 by this method, against the 0.13 per megabase published by Gröbner et al. for the same cohort.
  Method references for the builder: MSI calls use the MANTIS average-distance threshold of 0.4 from Bonneville R, et al. Landscape of microsatellite instability across 39 cancer types. *JCO Precis Oncol* 2017. doi:10.1200/PO.17.00073. Adult mutation calls come from Hoadley KA, et al. *Cell* 2018;173:291–304 and the MC3 project, Ellrott K, et al. *Cell Syst* 2018;6:271–281. The kidney row's note follows Turajlic S, et al. *Lancet Oncol* 2017;18:1009–1021, in which renal cell carcinoma had the highest share of insertion/deletion mutations and indel-derived neoantigens were nine times more enriched for mutant-specific HLA binding than those from single-letter swaps.
alt: A chart of how many protein-changing mutations tumors carry, per million DNA letters, on a logarithmic scale, for 27 kinds of cancer (colorectal and endometrial cancers are each split by mismatch-repair status), with each dot representing 5% of tumors of that kind. Childhood cancers such as leukemia and retinoblastoma have the fewest, with medians around 0.1; skin melanoma and smoking-related lung cancers have the most, with medians around 7 to 15 and some tumors above 100. Melanoma of the eye carries about forty times fewer mutations than melanoma of the skin, and colorectal and endometrial tumors with broken mismatch repair carry about eleven times more than those whose repair is intact.
:::


# ===== 07-escape (4 figures) =====

:::figure ch07-evidence
title: Which cancers rise when immunity falls
goal: After using this, the reader understands that suppressing the immune system raises the risk of infection-driven cancers dramatically while most common cancers barely change — evidence that immunosurveillance is real, and clearest for cells that display truly foreign peptides.
kind: chart
stage: light
spec: |
  PURPOSE. A three-step "reveal" chart of real data from one large study (Engels et al. 2011, JAMA): how many times
  more common selected cancers were in US organ-transplant recipients than in the general population. The reader
  first sees the overall number, then the uneven spread, then the pattern by cause. Then they can tap rows.

  LAYOUT (desktop, ~760 x 520 px, light stage = paper/surface background, ink lines).
  - Horizontal dot chart. One row per cancer (14 rows including "All cancers"), row height ~30 px.
  - Left column (~170 px): cancer name, right-aligned, Inter 14 px, ink. "All cancers" row in semibold, separated
    from the others by a thin rule.
  - Plot area: x axis is a LOG scale from 0.5 to 100. Ticks and labels at 0.5, 1, 2, 5, 10, 20, 50, 100, labeled
    "½×", "1×", "2×", "5×", "10×", "20×", "50×", "100×". Axis title: "Times as common as in the general population".
    Under the axis, a small permanent note (ink-3, 12 px): "Each gridline to the right is a bigger multiple."
  - A heavier vertical reference line at 1× with a small label at the top: "no change".
  - Each row: a dot (r = 5 px) at the value. Right of the dot, a value label in ink-2, 12 px: one decimal below 10
    ("2.1×", "0.9×"), whole numbers at 10 and above ("61×").
  - The uncertainty range (95% confidence interval) is NOT drawn by default. When a row is selected, draw it as a
    thin horizontal whisker with end caps, and show it in the card as "likely range a–b×".
  - Source line under the chart (ink-3, 12 px), verbatim: "Data: Engels et al., JAMA 2011 — 175,732 US organ
    transplants, 1987–2008. Selected cancers: 32 types were significantly raised, including some with no known
    infectious cause (for example salivary-gland and bile-duct cancers, and some leukemias). Common skin squamous-cell
    carcinomas are not recorded by US cancer registries; other studies find them tens of times more common in
    transplant recipients."

  ENCODING BY CAUSE (step 3 onward; never color alone):
  - "Linked to a known infection": filled circle, virus red-coral #FF4D5E (darken to about #D93445 on the light stage
    if needed for 3:1 contrast).
  - "No established infectious cause": hollow diamond, 1.5 px stroke in ink-2 (#4A5163).
  - "Mostly a recording artifact" (the Liver row only): hollow red-coral circle with a dashed outline, and the value
    label in italics with a small "†" mark. It sorts to the bottom of the infection group. Legend entry:
    "† mostly cancers found in the removed liver — tap for details".
  - "All cancers": filled square in ink.
  - Legend at top right (on mobile: above the chart, full width) with each shape and its text label.

  STEPS (shared stepper UI; Back/Next and step dots; captions below are verbatim):
  - Step 1: only the "All cancers" row at full opacity (dot at 2.10). Other rows show their names at 30% opacity and
    a small gray "?" where the dot will be. Briefly pulse the gridlines left to right (1× → 2× → 5× → 10×) once, to
    teach the multiplying scale.
  - Step 2: all dots animate in, sliding from the 1× line to their values (600 ms, staggered 30 ms, ease-out). All
    rows use the same neutral marker (filled circle, ink-2), sorted by value, highest at top. Briefly highlight the
    Breast and Prostate rows (soft band behind the row, 1 s).
  - Step 3: markers morph into the cause encoding; rows then re-sort into two labeled blocks — "Linked to a known
    infection" (top) and "No established infectious cause" (bottom) — each sorted by value, with a group header row.
    Animate the re-sort with a 700 ms vertical slide so the reader can follow rows.
  - After step 3, a small toggle appears above the chart: "Sort: by size | by cause" (default "by cause").

  INTERACTION (after step 1): hovering or tapping anywhere on a row band selects it, draws its range whisker and opens
  a card: cancer name (bold); "About N× as common (likely range a–b×)"; "Cause:" text; optional "Note:". Rows are
  focusable (Tab / arrow keys move; Enter opens; Escape closes). On desktop the card sits to the right of the dot,
  never covering it; on mobile it is a bottom sheet with a close button.

  MOBILE (< 600 px): label column 104 px (names may wrap to two lines; row height ~36 px); tick labels only at ½×, 1×,
  10× and 100× (keep all gridlines); hide per-row value labels (values appear in the card).

  SCIENTIFIC CARE. These are standardized incidence ratios (observed ÷ expected cases), not personal risks; never label
  the axis "risk %". Do not imply that every case of an infection-linked cancer is caused by that infection (the cause
  text says "many cases" where appropriate). Reduced motion: no slides or pulses; jump to each step's end state.
steps:
  1. Transplant recipients take drugs that damp down their T cells for life. Across about 176,000 US transplants, cancer overall was about twice as common as in the general population. Note the scale: each gridline to the right is a bigger multiple.
  2. But the rise was uneven. Kaposi sarcoma became about 60 times more common and several others roughly 5 to 17 times, while breast and prostate cancer — among the most common cancers of all — did not rise.
  3. Group the cancers by cause and a pattern appears. Most of the biggest rises are in cancers driven by infections, whose cells display truly foreign peptides. A few others rise too — probably partly because of the drugs, closer medical checks, or the disease that led to the transplant. Tap any row for details.
data: |
  Source for all values: Engels EA, et al. JAMA 2011;306:1891–1901, Table 2 (US transplant registry linked to 13
  cancer registries, 1987–2008). Notes marked (Jin 2024) come from Jin F, et al. Lancet Oncol 2024;25:933–944.
  Columns: cancer | value (SIR) | likely range (95% CI) | group | cause text | note.
  All cancers | 2.10 | 2.06–2.14 | all | — | About twice the expected number of cancers: roughly 7 extra cancers per 1,000 recipients per year.
  Kaposi sarcoma | 61.46 | 50.95–73.49 | infection | Human herpesvirus 8 | Still rare: about 15 cases per 100,000 recipients per year. In people living with HIV it is several hundred times more common, partly because the virus is more widespread in the groups most affected by HIV (Jin 2024).
  Vulva | 7.60 | 5.77–9.83 | infection | Human papillomavirus (HPV) | —
  Non-Hodgkin lymphoma | 7.54 | 7.17–7.93 | infection | Epstein–Barr virus (many cases) | The most common cancer with a raised rate. Highest in lung-transplant recipients (about 19×), who typically receive the strongest immunosuppression.
  Anus | 5.84 | 4.70–7.18 | infection | Human papillomavirus (HPV) | —
  Cervix | 1.03 | 0.75–1.38 | infection | Human papillomavirus (HPV) | Not raised in this study, possibly because recipients are regularly screened and precancers treated early. A 2024 meta-analysis of 67 transplant studies did find a raised rate (Jin 2024).
  Liver † | 11.56 | 10.83–12.33 | artifact | Hepatitis B and C viruses (many cases) | Mostly cancers already present in the diseased liver that was removed at transplant, recorded in the first months afterwards. Not raised in kidney or heart recipients; after the first 6 months, liver recipients' rate was about 2×.
  Lip | 16.78 | 14.02–19.92 | none | No established infectious cause (sun-exposed skin) | Behaves much like sun-induced skin cancer; some transplant drugs (azathioprine, cyclosporine) are themselves known causes of skin squamous-cell carcinoma (Jin 2024).
  Kidney | 4.65 | 4.32–4.99 | none | No established infectious cause | Highest in kidney-transplant recipients (about 6.7×). Closer medical checks may explain part of the rise.
  Melanoma | 2.38 | 2.14–2.63 | none | No established infectious cause (mostly sunlight) | Not raised in people living with HIV (Jin 2024). Closer skin checks and the drugs may explain part of the rise.
  Lung | 1.97 | 1.86–2.08 | none | No established infectious cause | Highest in lung-transplant recipients (about 6×).
  Colorectum | 1.24 | 1.15–1.34 | none | No established infectious cause | Raised in transplant recipients but not in people living with HIV, which points to the drugs rather than weakened immunity (Jin 2024).
  Prostate | 0.92 | 0.87–0.98 | none | No established infectious cause | Slightly below 1×, partly because people are screened for cancer before a transplant. Not raised in people living with HIV either (Jin 2024).
  Breast | 0.85 | 0.77–0.93 | none | No established infectious cause | Slightly below 1×, partly because people are screened for cancer before a transplant. Not raised in people living with HIV either (Jin 2024).
alt: A dot chart of how many times more common 13 cancers were in about 176,000 US organ-transplant recipients than in the general population, on a multiplying scale. Cancer overall was about 2.1 times as common. The largest rises were mostly in infection-driven cancers such as Kaposi sarcoma (about 61 times), non-Hodgkin lymphoma and HPV-related cancers; breast and prostate cancer were not increased. A high figure for liver cancer is flagged as mostly a recording artifact.
:::

:::figure ch07-immunoediting
title: Evolution under police pressure
goal: After using this, the reader understands that immune attack on a varied tumor selects for less visible cells, producing the three phases of immunoediting — elimination, equilibrium and escape — and that an escaped tumor has been "edited" to resist immunity, while a tumor grown without immune pressure has not.
kind: simulation
stage: dark
spec: |
  PURPOSE. A live simulation: a small, varied tumor grows in a patch of tissue while killer T cells patrol it. The
  reader watches the tumor's size over time and the shift in its make-up toward hidden cells, then runs a
  "transplant test" that mirrors the 2001 mouse experiment. Keep the first view simple: one guided run, three
  controls.

  LAYOUT (desktop): left, a square Canvas 2D stage (~460 x 460 px, dark stage gradient #0B1024 → #131B36, soft
  vignette); right, a column (~280 px) with (1) a small line chart "Tumor cells over time" and (2) a three-bar chart
  "Who is left?". Under the stage: the controls, then the caption (verbatim from steps) in an aria-live region.
  A permanent legend line under the stage (Inter 13 px): "Pink dots = neoantigens on display. More dots, easier for
  T cells to spot." A footnote under the charts (ink-3, 12 px): "'Hidden' stands for several real tricks — fewer
  neoantigens, or a shuttered shop window (lost MHC)."
  MOBILE (< 600 px): stage full width (square, max 360 px); the two charts side by side below it (~150 px tall
  each); controls as one row of large buttons (44 px tap targets); caption below. Cap cell count at 400 on mobile.

  CONTROLS (progressive disclosure — only three visible at first):
  1. Primary button "Play guided run" (becomes Pause / Resume while running).
  2. Toggle "Immune pressure: Off | On" (default On). On = the Medium setting below.
  3. "Transplant test" button — hidden until the Escape phase is detected or N > 100; then it fades in.
  A small "…" menu holds everything else: "New random tumor", "Replay this run", "Speed 1× / 2× / 4×", and
  "Strong immune pressure" (the High setting). No other controls.

  ELEMENTS ON THE STAGE.
  - Background: faint sand (#E9C9A1 at ~12% opacity) outlines of healthy cells, static. A soft-edged band along the
    left edge stands for a blood vessel; T cells enter from it.
  - Cancer cells: violet-magenta #B65FD8 lumpy circles, radius ~6 px (5 px on mobile). Each has a VISIBILITY value v
    in [0, 1] shown by ONE encoding: the number of small glowing hot-pink #FF3D7F dots on its rim,
    dots = round(v x 4), so 0–4 dots. Cells with 0 dots are drawn with a slightly dimmer, matte outline ("hidden").
  - Killer T cells: electric blue #4C8DFF, radius ~4 px (real T cells are smaller than most tumor cells), fine fuzz.
  - Kill animation: the cancer cell shrinks and breaks into 4–6 tiny violet specks that fade over ~0.6 s; the T cell
    pauses briefly, then moves on.

  MODEL (agent-based; rates per simulated second at 1× speed; a dev-only tuning panel behind a URL flag is
  recommended).
  - Start: N0 = 40 cancer cells near the center. Initial visibility: 70% of cells from uniform[0.4, 1.0], 30% from
    uniform[0.05, 0.4] (the tumor is varied from the start, Chapter 6).
  - Division: probability per second p = b x (1 − N/K), b = 0.25, K = 600 (400 on mobile). A cell within ~15 px of a
    T cell divides at half that rate (T cells also slow growth, not just kill). Daughter visibility =
    clamp(parent v + Normal(0, 0.04), 0, 1); with probability 0.003 per division a "big loss" sets v' = 0.1 x v
    (standing for a lost shop window or a lost dominant neoantigen). The daughter appears touching the parent; push
    neighbors apart with a simple relaxation step.
  - T cells: count by pressure: Off = 0, On (Medium) = 12, Strong (High) = 20. They move at ~40 px/s with a random
    walk biased toward the nearest cancer cell within ~80 px (otherwise toward the tumor's center of mass). On
    contact, kill with probability q = 0.9 x v². After a kill, pause 0.8 s; after a miss, move on. A cell with v = 0 can
    never be killed.
  - Optional, if it helps produce a visible plateau: each kill adds +0.25 T cell up to 2× the base count, decaying back
    at 5% per second.
  - Seeded random number generator (so "Replay this run" reproduces it) and a spatial hash for contact checks.

  CHARTS.
  - Line chart: x = time (no units; a small note "compressed — in people, this can take years"); y = number of
    cancer cells (0 to the cap). One line only. Phase bands shade behind the line as phases are detected, with tiny
    labels "Elimination", "Equilibrium", "Escape".
  - "Who is left?": three bars showing the share of living cells that are "Easy to spot" (3–4 dots), "Faint"
    (1–2 dots) and "Hidden" (0 dots); each bar labeled with its dot glyphs. Update about 4 times per second.
  - Phase detection (smoothed N over 2 s): Elimination = from the start while N falls or stays below N0;
    Equilibrium = |dN/dt| < 1 cell/s for > 4 s with 5 < N < 150; Escape = N > 200 and rising for 3 s. If N reaches 0,
    show a centered banner "Eliminated — no tumor ever becomes visible" and stop.

  TRANSPLANT TEST. Takes 40 random living cells (keeping their v), resets to a fresh tissue patch, seeds them, sets
  pressure to Strong, and runs. A label at the top of the stage: "Moved into a fresh host whose immune system has never
  been dampened." The outcome must emerge from the model, not be scripted. Show caption 4 when the test starts on an
  edited tumor (mean v < 0.3), and caption 5 or 6 when a test on an unedited tumor ends. A "Try again" link reruns the
  test with a new random sample. A test on an unedited tumor "ends" when N reaches 0 (rejected: caption 5) or N passes 200
  (grew: caption 6). After any transplant test, pressing Play or changing the pressure toggle starts a fresh default
  tumor with the chosen pressure, so the reader can grow an unedited tumor (pressure Off) and test it.

  GUIDED RUN. A preset seed with pressure On that reliably shows all three phases. Captions 1–3 appear as each phase
  is detected; at the end the Transplant test button pulses gently once. If the reader switches pressure Off while the
  Equilibrium band is active, show caption 7.

  TUNING TARGETS (adjust b, q, speeds and counts until these hold; they matter more than the exact numbers):
  - Off: the tumor reaches the cap within ~20 s, with its make-up unchanged.
  - On: the typical run shows a fall in N, then a plateau of roughly 10–60 cells lasting 10–30 s, then growth to the
    cap, with "Hidden" + "Faint" cells making up most of the tumor at the end (mean v below ~0.2).
  - Strong, from the default start: eliminated in roughly 6 of 10 random runs.
  - Transplant test on an UNEDITED tumor (grown with pressure Off): rejected (N → 0) in roughly 4–6 of 10 runs.
  - Transplant test on an EDITED tumor (after Escape with pressure On): grows in at least 9 of 10 runs.

  SCIENTIFIC CARE (what the builder must not get wrong).
  - "Visibility" stands for how strongly a cell displays neoantigens on MHC class I. Cells never change their own
    visibility in response to attack; change happens only through random inheritance at division plus selection.
  - T cells must sometimes touch a visible cell and fail to kill it, and must never kill a 0-dot cell.
  - Do not show T cells "learning" to see hidden cells. NK cells, brakes and suppressive cells are not modeled.
  - In the one direct mouse study, cells in equilibrium were still highly visible and became edited only at escape;
    this model compresses that into gradual editing. Captions are worded accordingly — do not add claims.
  - Performance: pause the loop when off-screen or when the tab is hidden. Reduced motion: no kill animations or
    drifting; redraw at about 4 frames per second, and offer the guided run as three selectable snapshots
    (Elimination / Equilibrium / Escape) instead of auto-play.
steps:
  1. Elimination. Killer T cells find and destroy the tumor cells with the most neoantigens on display. Often this is the end of the story, and no tumor ever becomes visible.
  2. Equilibrium. The tumor neither grows nor disappears: T cells kill some cells and hold back the growth of others about as fast as new ones appear — in people, possibly for years. Meanwhile, selection quietly favors the less visible.
  3. Escape. Selection has done its work: most remaining cells are faint or hidden. The tumor now grows unchecked, built from exactly the cells the immune system could not see.
  4. The transplant test. This escaped tumor has been edited: moved into a fresh host with a strong immune system, it should grow anyway. For comparison, switch immune pressure off, grow a new tumor, and transplant that one.
  5. Rejected. This tumor grew up without immune pressure, so it was never edited and still had plenty of easy-to-spot cells. In the 2001 mouse experiments, about 40% of unedited tumors were rejected like this — and none of the edited ones.
  6. This unedited tumor grew anyway, as most did in the 2001 experiments: only about 40% were rejected. Try again — and notice that edited tumors essentially never are.
  7. You removed the T cells during equilibrium, and the dormant tumor grew out quickly — just as in the 2007 mouse experiments.
alt: A simulation of a tumor whose cells vary in how many neoantigens they display. With immune pressure on, T cells first kill the most visible cells, the tumor then holds steady at a small size, and finally a population of faint or hidden cells grows out of control; charts show the tumor's size over time and the share of easy-to-spot, faint and hidden cells. A transplant test shows that an edited tumor grows in a new host with a strong immune system, while an unedited tumor is sometimes rejected.
:::

:::figure ch07-cycle
title: Break the cycle
goal: After using this, the reader can name the seven steps of an anti-tumor immune response, sees that breaking any one step stalls the whole cycle, and can find which kinds of treatment repair a step or make it unnecessary — and which steps they cannot skip.
kind: explorer
stage: dark
spec: |
  PURPOSE AND REUSE. An interactive wheel of the seven-step cancer-immunity cycle (Chen & Mellman 2013). In Chapter 7
  ("explore" mode) the reader (1) takes a short tour, (2) taps a step to read what happens there and how tumors break
  it, (3) breaks a step and watches the cycle stall, then (4) tries a small set of treatments. Keep this mode calm and
  simple. THE SAME MODULE IS REUSED IN CHAPTER 12 ("combine" mode) with the full therapy list and richer visuals, so
  build it data-driven:
  - All text lives in a data module (suggested: assets/js/figures/ch07-cycle-data.js) exporting STEPS and THERAPIES
    (contents below, verbatim). Each therapy has a flag ch07 (true = shown in Chapter 7).
  - mount(el, options), options: { mode: 'explore' | 'combine' (default 'explore'), initialStep: null | 1–7,
    enableBreak: true, enableTour: true, therapyIds: null (null = those flagged ch07 in explore mode, all in combine
    mode), allowMultiSelect: false (true in combine), chapterLinks: true }.
  - Controller methods: selectStep(n), breakStep(n), repairAll(), setTherapies(ids).
  - Combine mode (built now, used in Ch 12): therapy chips are multi-select; each selected therapy lights up the steps
    it acts on with a gold ring and a count badge per step; "skips" steps dim with a "not needed" tag. Chapter 12's
    writer may request more visuals later; keep the rendering layered so they can be added.

  LAYOUT (desktop ~900 x 560 px): left, the wheel (SVG, ~520 x 520); right, a detail panel (~340 px). Above the wheel:
  a "Take the tour" button. MOBILE (< 700 px): wheel on top (square, full width, max 360 px); panel below as a card.
  No horizontal page scroll.

  THE WHEEL.
  - Seven step nodes evenly spaced on a circle (radius ~190 in a 520 viewBox), step 1 at 12 o'clock, proceeding
    CLOCKWISE (step k at (k−1) x 360/7 degrees from the top). Each node: a 56 px circular badge (dark fill, 1.5 px
    light outline) with the step number and a simple glyph; a one-word label outside the ring (Inter 14 px; 12 px on
    mobile): 1 Release, 2 Presentation, 3 Priming, 4 Trafficking, 5 Infiltration, 6 Recognition, 7 Killing.
    Glyphs: 1 = violet cancer cell breaking into pink specks; 2 = green star-shaped dendritic cell holding a pink
    bead; 3 = blue T cell with a small "×2" copy mark; 4 = blue T cell in a short vessel segment with a flow arrow;
    5 = blue T cell squeezing through a gap in a wall; 6 = T-cell receptor touching an MHC cup holding a pink bead;
    7 = cancer cell with small pore marks.
  - Curved arrows connect consecutive nodes (k → k+1, and 7 → 1).
  - Three very soft location bands behind the ring, each with a small-caps label outside: "TUMOR" spanning steps 5,
    6, 7 and 1; "LYMPH NODE" spanning step 3 and the second half of step 2; "BLOOD" spanning step 4. Step 2 sits at
    the boundary (the dendritic cell travels from tumor to lymph node).
  - Flow: when the cycle is intact, small glowing dots travel clockwise along the arrows. Center text (Inter 16 px):
    "Cycle running".
  - Selected step: node scales to 1.12, outline brightens.

  DETAIL PANEL (for a selected step; verbatim text from STEPS): "Step N — <name>", a location line, then two short
  sections: "What happens" and "How tumors break it". Terms marked [[like this]] in the data render as dotted-underline
  tooltips with the given one-line explanation. Below them, a button "Break this step" (with a crimson #E5484D "⊣"
  icon plus the text; never color alone).

  BREAK. When a step is broken: its node shows the ⊣ icon and a crimson outline; dots pile up and stop before it; the
  nodes after it (around to the broken step again) fade to 40%; center text: "Stalled at step N: <name>". One broken
  step at a time in explore mode (breaking another repairs the first). Breaking also opens the "Treatments" tray.

  TREATMENTS TRAY (explore mode). A row of 7 chips in four labeled families, shown only after a step has been broken
  or after the tour ends (button "Show treatments"):
    Start the cycle: Radiation · Cancer vaccines
    Release the brakes: Anti-CTLA-4 · Anti-PD-1 / PD-L1
    Lower the walls: TGF-β blockers
    Bring your own killers: CAR-T cells · T-cell engagers
  Tapping a chip gives one of three results, decided from the data (acts / skips / replaces):
  - REPAIRS the broken step (it is in "acts"): the break clears with a soft green-cyan #3DDC97 "+" flash; flow
    resumes; panel line: "<Chip>: <one-line how>".
  - MAKES IT UNNECESSARY (the broken step is in "skips" or "replaces"): steps in "skips" dim with a small "not needed"
    tag, a gold (#F2B33D) ring marks the "entersAt" step, flow resumes from there; panel line: "<Chip> supplies
    killers at step 4. They still have to travel, get in and kill."
  - DOES NOT HELP here: panel line "That treatment acts at a different step" and a gold ring briefly marks the step(s)
    it does act on. For the two "Bring your own killers" chips this happens whenever the broken step is 4, 5 or 7, and
    the line reads: "Not this one: its T cells still have to travel, get in and kill — step N stays broken." (This is
    the real reason these treatments struggle in many solid tumors.)
  Each chip row in the panel shows the therapy's status tag and a "→ Chapter X" link.

  TOUR. "Take the tour" plays captions 1–9 below (verbatim), one per Next press: caption 1 shows the whole wheel;
  captions 2–8 select steps 1–7 in turn; caption 9 returns to the whole wheel and invites the reader to break a step.

  ACCESSIBILITY. Nodes are buttons in tab order 1→7 (aria-label "Step 1, Release: <what happens>"). Chips are toggle
  buttons (aria-pressed). Center status text and tour captions are in an aria-live polite region. Reduced motion: no
  flowing dots (static dotted arrows); a stall is shown by the ⊣ icon and faded nodes only.

  DATA — STEPS (verbatim; ids are stable for Chapter 12):
  1 release — "Release of cancer antigens" — Location: tumor.
    What happens: Cancer cells die and spill their contents, including neoantigens. Death that comes with danger signals alerts the immune system; quiet death does not.
    How tumors break it: Some tumors have few distinctive antigens to spill ([[a low mutation count|Fewer mutations means fewer neoantigens; Chapter 6]]), and their cells die quietly, without danger signals.
  2 presentation — "Antigen presentation" — Location: tumor, then lymph node.
    What happens: Dendritic cells collect the debris, mature in response to danger signals, and carry the antigens to a nearby lymph node.
    How tumors break it: Some tumors keep the key dendritic cells out ([[in some melanomas|Through an overactive cancer-driving signal called WNT/β-catenin]]), or keep them too immature to sound the alarm, so they teach tolerance instead of attack.
  3 priming — "Priming and activation" — Location: lymph node.
    What happens: The rare T cells whose receptors fit the displayed antigen get signal 1 and signal 2, then multiply into an army of killers.
    How tumors break it: Regulatory T cells damp priming. And T cells that react strongly to self-like tumor antigens were often removed in the thymus long ago.
  4 trafficking — "Trafficking to the tumor" — Location: blood.
    What happens: Activated T cells leave the lymph node, travel in the blood, and follow chemical trails toward the tumor.
    How tumors break it: Some tumors silence the [[chemokines|The chemical trails that guide immune cells]] that would call T cells in, and grow leaky, chaotic blood vessels that T cells struggle to cross.
  5 infiltration — "Infiltration into the tumor" — Location: tumor.
    What happens: T cells squeeze out of the tumor's blood vessels and push through the surrounding tissue.
    How tumors break it: Walls. Fibroblasts lay down dense collagen, and the signal [[TGF-β|A scarring signal that also calms immune cells]] helps keep T cells stuck at the edges.
  6 recognition — "Recognition of cancer cells" — Location: tumor.
    What happens: Each T cell checks the cancer cells' shop windows for its one target peptide.
    How tumors break it: Hiding. Cancer cells shutter their shop windows ([[for example by losing B2M|A small partner protein that MHC class I needs to reach the surface]]), or lose the mutations that made them visible.
  7 killing — "Killing of cancer cells" — Location: tumor.
    What happens: T cells kill matching cancer cells, releasing more antigen and turning the cycle again.
    How tumors break it: Brakes and poisons. PD-L1 dampens T cells, suppressive cells and molecules wear them down, and some cancer cells go [[deaf|They lose JAK1 or JAK2 and stop responding to interferon-gamma]].

  DATA — THERAPIES (id | label | ch07 | acts | skips | replaces | entersAt | one-line how | status | chapter):
  radiation | Radiation | true | 1 | — | — | — | Kills cancer cells in a way that can release antigens along with danger signals. | Approved as a cancer treatment; immune effects under study | Ch 12
  chemo-icd | Some chemotherapies | false | 1 | — | — | — | Certain drugs kill cancer cells in a way that can alert the immune system, at least in laboratory studies. | Approved as a cancer treatment; immune effects under study | Ch 12
  oncolytic | Oncolytic viruses | false | 1, 2 | — | — | — | Viruses that infect and burst cancer cells, releasing antigens and danger signals at once. | Approved in a few cancers | Ch 11
  vaccine | Cancer vaccines | true | 2, 3 | — | — | — | Deliver chosen tumor antigens, with immune stimulants, to dendritic cells. | Approved in few cancers; a personalized mRNA vaccine met its main goal in a phase 3 melanoma trial (company-reported, 2026), not yet approved | Ch 11
  innate-agonist | Innate immune stimulants | false | 2 | — | — | — | Molecules that mimic danger signals to mature dendritic cells. | One approved for skin use; others in trials | Ch 11, Ch 12
  anti-ctla4 | Anti-CTLA-4 | true | 3 | — | — | — | Releases a brake that acts mainly during priming in the lymph node. | Approved | Ch 8
  il2 | Interleukin-2 | false | 3 | — | — | — | A growth signal that drives T cells to multiply. | Approved; helps a minority, with heavy side effects | Ch 12
  anti-vegf | Anti-VEGF drugs | false | 4, 5 | — | — | — | Can calm the tumor's chaotic blood vessels, which may help T cells find and cross them. | Approved in some combinations | Ch 12
  tgfb-block | TGF-β blockers | true | 5 | — | — | — | Aim to lower the walls by blocking the signal that helps keep T cells out. | In trials; early attempts failed | Ch 12
  anti-pd1 | Anti-PD-1 / PD-L1 | true | 7 | — | — | — | Release the PD-1 brake on T cells already in the tumor. | Approved | Ch 8
  anti-lag3 | Anti-LAG-3 | false | 7 | — | — | — | Releases a second brake, used together with anti-PD-1. | Approved (with anti-PD-1, in melanoma) | Ch 8
  ido-inhib | IDO inhibitors | false | 7 | — | — | — | Block an enzyme that starves T cells of tryptophan. | Failed in a phase 3 trial | Ch 8
  car-t | CAR-T cells | true | — | 1, 2, 3 | 6 | 4 | Ready-made T cells with a synthetic receptor that recognizes a surface protein without needing MHC. They still have to travel, get in and kill. | Approved in blood cancers; first solid-tumor approval (stomach cancer, China, 2026) | Ch 10
  til-tcrt | TIL and TCR-T cells | false | — | 1, 2, 3 | — | 4 | Large numbers of tumor-reactive T cells grown or engineered outside the body. They still need the cancer cell's MHC display. | Approved in a few cancers | Ch 10
  bispecific | T-cell engagers | true | — | 1, 2, 3 | 6 | 4 | Antibodies that bridge a T cell to a cancer cell, so any T cell that reaches the tumor can kill it — no priming or MHC display needed. | Approved | Ch 9
  RULE: no therapy has steps 4, 5 or 7 in "skips" or "replaces". NOTE: tebentafusp (Chapter 9) is a T-cell engager
  that still requires HLA display; if it is ever added, give it replaces = none.
steps:
  1. Each turn of this cycle is one round of the hunt. Every step must succeed, and the weakest one sets the pace. Press Next to walk around the wheel and see where tumors attack it.
  2. Step 1, Release. Dying cancer cells spill their neoantigens. Tumors with few mutations have little to spill, and quiet deaths raise no alarm.
  3. Step 2, Presentation. Dendritic cells carry the debris to a lymph node. Some tumors keep these scouts out, or keep them too immature to sound the alarm.
  4. Step 3, Priming. Matching T cells are activated and multiply. Regulatory T cells — corrupt guards — can damp this step.
  5. Step 4, Trafficking. T cells travel through the blood toward the tumor. Some tumors erase the chemical trails that would guide them.
  6. Step 5, Infiltration. T cells push into the tumor. Walls of fibroblasts and collagen can stop them at the edges.
  7. Step 6, Recognition. T cells check the cancer cells' shop windows. Hiding cells have shuttered them.
  8. Step 7, Killing. T cells kill — unless brakes, poisoned air or deaf cancer cells stop them. Each kill releases antigen and turns the cycle again.
  9. Your turn. Choose any step, press "Break this step," and watch the cycle stall. Then look for a treatment that repairs it — or makes it unnecessary.
alt: A wheel of the seven steps of the cancer-immunity cycle: release of cancer antigens, presentation by dendritic cells, priming of T cells in the lymph node, trafficking through the blood, infiltration into the tumor, recognition of cancer cells, and killing, which releases more antigens. Each step shows how tumors break it. Breaking a step stalls the cycle until a treatment repairs it or makes it unnecessary; engineered T cells and T-cell engagers can replace the first three steps, but not travel, entry or killing.
:::

:::figure ch07-tme
title: Inside the fortified neighborhood
goal: After using this, the reader can tell inflamed, excluded and desert tumors apart by where the T cells are, and understands why a PD-1-blocking drug helps mainly when T cells are already inside the tumor.
kind: explorer
stage: dark
spec: |
  PURPOSE. A cross-section of a tumor "neighborhood". The PRIMARY path is simple: switch between three immune
  profiles (Inflamed / Excluded / Desert) and test a PD-1-blocking drug in each. A SECONDARY, optional layer ("Who
  lives here?") reveals the suppressive players described in the text.

  LAYOUT (desktop ~880 x 520 SVG, dark stage): the scene fills the stage. Above it: a segmented control
  "Inflamed | Excluded | Desert" (default Inflamed). Below it: a gold button "Add a PD-1 blocker" and a "Reset" link.
  An always-on three-item legend in the stage's top-left corner (Inter 12 px, with mini glyphs): "Cancer cell",
  "Killer T cell", "Wall (fibroblasts and collagen)". Caption area under the controls (aria-live): the mode caption
  (steps 1–3) or the latest drug caption (steps 4–6), verbatim. Below that, a quiet text button "Who lives here?" that
  expands the secondary layer.
  MOBILE (< 600 px): portrait scene (~360 x 560 viewBox) with the same elements, tumor nest centered, vessel along the
  bottom edge; segmented control full width; legend as a single line above the scene; secondary chips wrap into two
  rows; info cards become a bottom sheet.

  SCENE ELEMENTS (shared art-library silhouettes; sizes relative to a killer T cell of radius r ≈ 9 px):
  - Tumor nest: an irregular cluster of ~28 cancer cells (violet-magenta #B65FD8, lumpy membranes, large misshapen
    nuclei, radius ~1.7r), center-left.
  - Stroma ring around the nest: cancer-associated fibroblasts (gray-beige #9C8F80, spindle-shaped, ~4r long) and
    collagen fibers (thin beige curved lines, roughly parallel to the nest's edge). Thickness depends on mode.
  - Blood vessel: a tube entering from the right edge (desktop) / bottom edge (mobile), soft rose-gray outline with a
    faint lumen; T cells come out of it.
  - Killer T cells: electric blue #4C8DFF, radius r, fine fuzz; each carries a tiny PD-1 glyph.
  - Regulatory T cells: slate-lavender #8C95C9, radius r.
  - MDSCs: muted olive #A7A35A, small irregular cells, radius ~1.25r (about neutrophil size, slightly larger than a
    T cell).
  - Tumor-associated macrophages: dusky rose #B7727E, large amoeboid cells with ruffled edges, ~2.2r.
  - Dendritic cells: green #4FD18B, star-shaped with long dendrites, ~1.6r.
  - PD-L1: small crimson #E5484D "⊣" bar glyphs on cancer-cell (and some macrophage) membranes.
  - MHC cups: small silver #D9DEEA cups on cancer cells; "hiding" cells lack them.
  - Poisoned-air overlays (secondary layer only): a soft dark-violet radial gradient darkening the nest core, labeled
    "low oxygen"; tiny pale drifting dots in the nest, labeled "lactate · adenosine"; a faint gray-beige haze over
    the stroma, labeled "TGF-β".
  Labels (Inter 13 px, thin leader lines) appear only for the active chip or a tapped element, to keep the scene calm.

  MODES (switching animates over ~1.2 s with GSAP: T cells glide to new positions, the stroma ring thickens or thins,
  other cells fade in or out):
  - INFLAMED: ~16 killer T cells inside and around the nest, several touching cancer cells; small blue IFN-γ dots near
    them; many PD-L1 glyphs on cancer cells, clustered next to T cells (adaptive resistance); 2–3 cancer cells without
    MHC cups (hiders selected by the T-cell attack); thin stroma (one layer of fibroblasts); 3 Tregs; 2 macrophages;
    2 dendritic cells at the nest edge. Optional: a small tertiary lymphoid structure at the lower edge (~6 gold
    B cells ringed by blue and teal T cells), labeled only in the secondary layer.
  - EXCLUDED: ~14 killer T cells crowded within the stroma ring and along the fibers, at most 1–2 inside the nest;
    thick stroma (3–4 layers of fibroblasts, dense collagen); few PD-L1 glyphs inside the nest (no T cells there to
    trigger them); 2 Tregs; 3 macrophages.
  - DESERT: 0–2 killer T cells, near the vessel only; 1 immature dendritic cell (shorter, retracted dendrites);
    4 MDSCs and 3 macrophages; moderate stroma; generally few MHC cups on all cancer cells (no IFN-γ around to raise
    them); almost no PD-L1.
  Ambient motion (not under reduced motion): T cells drift slowly; in Excluded, T cells that wander inward bounce gently
  off the inner edge of the stroma.

  "ADD A PD-1 BLOCKER" (one run per mode until Reset):
  - Small gold Y-shaped antibody glyphs with a white outline (symbolic: real antibodies are about 1,000 times smaller
    than a cell) drift in from the vessel and attach to the PD-1 glyphs on nearby T cells.
  - Inflamed: brakes released — T cells touching cancer cells show a brief flash and 6–10 cancer cells die (shrink,
    fragment, fade) over ~3 s; the nest visibly shrinks but does not vanish. Show caption 4.
  - Excluded: antibodies reach the T cells in the stroma, but the walls stay; at most one cancer cell dies. Show
    caption 5.
  - Desert: antibodies drift in and find almost nothing to bind. Show caption 6.

  SECONDARY LAYER "Who lives here?" (collapsed by default). Five toggle chips, in the order the text introduces them:
  Hiding · Brakes · Corrupt guards · Walls · Poisoned air. Each highlights its elements with labels, dims everything
  else to 50%, and shows its card (verbatim):
  - Hiding: "Hiding. Some cancer cells stop displaying MHC class I, so killer T cells cannot see them. NK cells, which look for missing MHC, can still catch some of them."
  - Brakes: "Brakes. Cancer cells and macrophages display PD-L1, which dampens T cells carrying PD-1. Much of it appears only after T cells arrive and release interferon-gamma, so brakes are often a sign that an attack was underway."
  - Corrupt guards: "Corrupt guards. Regulatory T cells, myeloid-derived suppressor cells and wound-healing macrophages calm the immune response. They are doing their normal jobs; the tumor exploits them."
  - Walls: "Walls. Cancer-associated fibroblasts lay down dense collagen, and TGF-β helps keep T cells out. In excluded tumors, T cells pile up at these walls."
  - Poisoned air: "Poisoned air. Low oxygen, lactic acid, adenosine and TGF-β make the tumor a hostile place for T cells."
  Under the chips, one line of small text: "The sixth escape route, going deaf, happens inside cancer cells and can't be
  seen at this scale." Tapping any single cell (in either layer) opens a mini-card with its name and role, e.g.
  "Killer T cell — searching for its target peptide"; "Regulatory T cell — damps nearby killer T cells";
  "Tumor-associated macrophage — helps the tumor build vessels and calm immune attack"; "MDSC — starves and silences
  T cells"; "Cancer-associated fibroblast — builds the collagen walls"; "Dendritic cell — collects antigen and carries
  it to a lymph node".

  SCIENTIFIC CARE.
  - Not to scale, but keep relative sizes as given (macrophages > cancer cells > MDSCs > T cells).
  - PD-1 is on T cells; PD-L1 is on cancer cells and some immune cells (especially macrophages). Never draw PD-1 on
    cancer cells.
  - Excluded mode: PD-L1 sparse inside the nest. Inflamed mode: PD-L1 concentrated next to T cells (the visual point of
    adaptive resistance).
  - The drug outcomes illustrate tendencies, not guarantees: keep the inflamed response partial, and let the captions
    carry the caveats.
  - Reduced motion: no drift; mode switches and drug outcomes jump to their end states.
steps:
  1. Inflamed. Killer T cells have made it inside, among the cancer cells — but the tumor has switched on its brakes, often in direct response to their attack. Tumors like this are the most likely to respond to checkpoint inhibitors.
  2. Excluded. T cells arrived but are stuck at the edges, held back by dense fibers and the fibroblasts that build them. Inside, the cancer cells meet almost no T cells at all.
  3. Desert. Hardly any T cells anywhere. The cycle never really started — too little antigen, too few active dendritic cells, or no priming in the lymph node.
  4. The drug released the brakes on T cells that were already in place, and they resumed killing. Responses like this are most common in inflamed tumors — but even here, not every patient responds.
  5. The drug reached the T cells at the walls, but releasing brakes does not move walls. The cancer cells inside are still out of reach.
  6. There were almost no T cells for the drug to release. A tumor like this needs the cycle started first — the subject of Part III.
alt: A cross-section of a tumor that can be switched between three immune profiles. In the inflamed profile, killer T cells sit among the cancer cells, which display PD-L1 brakes near them; in the excluded profile, T cells are trapped in a thick ring of fibroblasts and collagen at the tumor's edge; in the desert profile, there are almost no T cells. A PD-1-blocking drug helps mainly in the inflamed tumor; an optional layer reveals hiding cells, brakes, suppressive immune cells, walls and a hostile chemical environment.
:::


# ===== interlude-history (1 figures) =====

:::figure int-timeline
title: 130 years of immunotherapy, at a glance
goal: After using this, the reader sees the acceleration. For about 80 years there were only a handful of milestones, then a burst after 2010, led by the release of the immune brakes. Filtering by treatment type is a secondary aid that shows when each Part III modality arrived.
kind: explorer
stage: light
spec: |
  ONE IDEA: almost nothing for decades, then a crowded burst after 2010. Every design choice below serves that. The timeline is a reference map and comes at the end of the narrative, so keep it calm and readable. All text comes from the JSON in `data`.

  DESKTOP (≥ 768px), top to bottom:
  1. CHIP ROW: "All" plus 5 lane chips (lane glyph + label + color swatch). Hovering or focusing a chip, or selecting it, shows that lane's one-line `description` beneath the row. Under the chips is a one-line legend of the three marker shapes, each shown inline: "○ finding or trial result  ◆ approval  ⊘ setback".
  2. MAIN PLOT: linear time on x, 1885 → 2027, never compressed. The long empty stretch is the point. Five horizontal lanes, labeled at the left in small caps and ordered top to bottom: Ideas & recognition · Microbes, cytokines & vaccines · Antibody drugs · Checkpoint inhibitors · Cell therapies. Each milestone is a marker on its lane at its date.
     - Marker shape follows `type`: "finding" = ring, "approval" = filled diamond, "setback" = ring with a diagonal slash, drawn at 16px minimum so the slash stays legible. Fill = lane color, with a 2px paper-colored outline.
     - Where markers in one lane would collide (2010s–2020s), offset them vertically within the lane (at most 2 rows). They never overlap.
     - Labels (`short`) show only where they fit without overlapping, which in practice means the sparse years. Elsewhere a label appears on hover or focus.
     - Three faint era bands with small-caps labels at the top: "Hunches" (to 1975), "Tools and doubt" (1975–2010), "Breakthrough and branching out" (2010 onward). They match the chapter's section arc.
     - A thin vertical line at the right labeled "Now (2026)".
     - Year ticks every 10 years, with labels every 20 years.
  No pace strip and no "evenly spaced" mode on desktop. The linear axis alone carries the message.

  FILTERING: a chip toggles its lane. Unselected lanes fade to ~15% opacity but stay visible, so the overall shape persists. "All" resets. With one lane selected, all of its labels are forced visible, using leader lines if needed.

  CARD: clicking or tapping a marker, or pressing Enter/Space on a focused one, opens a card. On desktop it is a popover anchored to the marker; on phones it is a bottom sheet. Card contents:
    - date, formatted from `date` ("1891", "Nov 1984", "30 Aug 2017")
    - lane glyph, lane name and `tag` (for example "Checkpoint inhibitors · Approval")
    - `title`
    - "What happened": `what`
    - "Why it mattered": `why`
    - a link chip "Read more → Chapter N: Title", built from `chapter` via chapters.json
    - superscript source numbers (`sources`) linking to this page's Sources list
    - Prev/Next buttons (chronological, visible milestones only) and a close button. Esc closes.
  The open marker gets a soft halo and enlarges 1.25×. Nothing else moves.

  KEYBOARD AND A11Y: markers sit in the tab order chronologically. Left/Right arrows move to the previous or next milestone, and Up/Down move to the nearest milestone in the adjacent lane. Focus rings are visible. Each marker has an aria-label like "1996, Checkpoint inhibitors, finding: Releasing the brake". The card is a dialog whose title is announced politely. Chips are buttons with aria-pressed.

  INITIAL STATE: all lanes on, no card open. A static (not pulsing) ring with the caption "Tap any marker" sits next to the 2011 ipilimumab marker and disappears after the first interaction.

  COLORS (light / dark). Final values come from tokens; check contrast for text on paper.
    - Ideas & recognition: #5B6478 / #A3ABC0
    - Microbes, cytokines & vaccines: #2E9E6B / #4FD18B
    - Antibody drugs: #B8860B / #F2B33D
    - Checkpoint inhibitors: #D93F4C / #FF6B73
    - Cell therapies: #3A72E8 / #6FA0FF
  Never rely on color alone. Lane position, glyph and label carry the modality, and shape carries the milestone type.

  LANE GLYPHS (small line icons): Ideas = open book; Microbes, cytokines & vaccines = rod-shaped bacterium; Antibody drugs = Y; Checkpoint inhibitors = brake bar with a minus sign; Cell therapies = round cell with one receptor spike.

  PHONE (< 768px): a vertical list. A thin rail on the left runs from 1891 at the top to 2026 at the bottom. Each row shows marker (shape + color), date, `short` label, and the lane glyph and name in muted small text. Rows are evenly spaced. Each gap longer than 10 years becomes a dashed divider with its length, for example "… 66 years …" for 1891 → 1957, so the emptiness of the early decades stays visible without endless scrolling. Tapping a row opens the bottom-sheet card. The chip row scrolls horizontally on its own, never the page.

  MOTION: no ambient animation. Fades of ≤ 250 ms on filter changes and card open, and instant under prefers-reduced-motion.
data: |
  {
    "lanes": [
      {"id": "ideas",       "label": "Ideas & recognition",            "glyph": "book",      "description": "Theories, lab discoveries and prizes that changed what people thought was possible."},
      {"id": "microbes",    "label": "Microbes, cytokines & vaccines", "glyph": "bacterium", "description": "Rousing immunity with germs, signaling proteins or vaccines (Chapter 11; cytokines return in Chapter 12)."},
      {"id": "antibodies",  "label": "Antibody drugs",                 "glyph": "y",         "description": "Lab-made antibodies that mark, block or carry poison to cancer cells, or link T cells to them (Chapter 9)."},
      {"id": "checkpoints", "label": "Checkpoint inhibitors",          "glyph": "brake",     "description": "Antibodies that release the brakes on T cells (Chapter 8)."},
      {"id": "cells",       "label": "Cell therapies",                 "glyph": "cell",      "description": "T cells removed, multiplied or engineered, then returned to the patient (Chapter 10)."}
    ],
    "types": ["finding", "approval", "setback"],
    "sources_note": "Numbers refer to this chapter's Sources list. US approval dates come from FDA announcements and records [8].",
    "milestones": [
      {"id": "coley-1891", "date": "1891", "lane": "microbes", "type": "finding", "tag": "Clinical experiment",
       "title": "Coley's toxins", "short": "Coley's toxins",
       "what": "New York surgeon William Coley injects streptococcal bacteria into a patient's tumor and sees it shrink. He soon switches to heat-killed bacteria, 'Coley's toxins', and treats close to a thousand patients.",
       "why": "The first sustained, systematic attempt to fight cancer by provoking an infection-like reaction (German doctors had tried it before him). Dramatic in some patients, it was inconsistent, never properly tested and eclipsed by radiation.",
       "chapter": "11-vaccines", "sources": [1, 2]},
      {"id": "surveillance-1957", "date": "1957", "lane": "ideas", "type": "finding", "tag": "Idea",
       "title": "Immunosurveillance", "short": "Immunosurveillance",
       "what": "Building on a 1909 guess by Paul Ehrlich, Macfarlane Burnet (1957) and Lewis Thomas (1959) propose that lymphocytes patrol the body and destroy newly transformed cells before they become tumors.",
       "why": "It gave tumor immunology a guiding theory, and gave skeptics a clear target.",
       "chapter": "07-escape", "sources": [2, 3]},
      {"id": "nude-1974", "date": "1974-02", "lane": "ideas", "type": "setback", "tag": "Setback",
       "title": "The nude-mouse 'disproof'", "short": "Nude mice",
       "what": "Osias Stutman finds that nude mice, which lack most T cells, develop no more chemically induced tumors than normal mice.",
       "why": "Widely read as disproving immunosurveillance, it pushed the idea out of fashion for about 25 years. Chapter 7 explains why the experiment misled.",
       "chapter": "07-escape", "sources": [3]},
      {"id": "hybridoma-1975", "date": "1975-08", "lane": "antibodies", "type": "finding", "tag": "Lab finding",
       "title": "Monoclonal antibodies", "short": "Monoclonal antibodies",
       "what": "Georges Köhler and César Milstein in Cambridge fuse antibody-making cells with immortal cancer cells. The resulting 'hybridomas' make unlimited amounts of one chosen antibody. They shared the 1984 Nobel Prize with Niels Jerne.",
       "why": "Antibodies became precision tools and, two decades later, drugs. Every checkpoint inhibitor approved so far is a monoclonal antibody.",
       "chapter": "09-antibodies", "sources": [4, 2]},
      {"id": "bcg-1976", "date": "1976-08", "lane": "microbes", "type": "finding", "tag": "Clinical study",
       "title": "BCG for bladder cancer", "short": "BCG",
       "what": "Alvaro Morales and colleagues wash the bladders of patients with recurring superficial bladder tumors with BCG, a tuberculosis vaccine, and recurrences fall in their first 9 patients. US approval for bladder cancer follows in 1990.",
       "why": "Coley's idea, done locally and reproducibly. BCG is still a mainstay of early bladder-cancer treatment.",
       "chapter": "11-vaccines", "sources": [5, 8]},
      {"id": "il2-1984", "date": "1984-11", "lane": "microbes", "type": "finding", "tag": "Clinical trial",
       "title": "First IL-2 responder", "short": "IL-2 works",
       "what": "At the US National Cancer Institute, a 33-year-old woman with widespread melanoma responds to very high doses of interleukin-2, a signal that makes T cells multiply. Her tumors disappear within months, and nearly 30 years later she was still disease-free.",
       "why": "An immune-only treatment could erase large tumors, at the cost of severe toxicity. IL-2 was approved for kidney cancer (1992) and melanoma (1998); roughly 5–10% of patients respond completely.",
       "chapter": "12-frontier", "sources": [6]},
      {"id": "ctla4-1987", "date": "1987", "lane": "checkpoints", "type": "finding", "tag": "Lab finding",
       "title": "CTLA-4 found", "short": "CTLA-4 found",
       "what": "Pierre Golstein's lab in Marseille finds CTLA-4, a T-cell molecule of unknown function. In 1994–95 two groups show that it is a brake on T-cell activation.",
       "why": "The first of the brakes that checkpoint drugs would later release.",
       "chapter": "05-t-cells", "sources": [2]},
      {"id": "til-1988", "date": "1988-12", "lane": "cells", "type": "finding", "tag": "Clinical trial",
       "title": "TIL therapy", "short": "First TIL",
       "what": "Steven Rosenberg's team grows T cells out of patients' melanomas, multiplies them with IL-2 and infuses them back. Tumors shrink in about half of the first 20 patients.",
       "why": "It showed that a patient's own T cells, expanded outside the body, can attack cancer. This is the root of later cell therapies.",
       "chapter": "10-cell-therapy", "sources": [6]},
      {"id": "car-1989", "date": "1989-12", "lane": "cells", "type": "finding", "tag": "Lab finding",
       "title": "Antibody-guided T cells", "short": "Early CAR",
       "what": "Zelig Eshhar's group at the Weizmann Institute gives T cells receptors built partly from antibodies, among the first chimeric antigen receptors (CARs). A Japanese team had reported a similar design in 1987, and Eshhar's 1993 single-chain version became the template for today's CARs.",
       "why": "The blueprint for CAR-T cells, though two more decades of redesign were needed before they worked in patients.",
       "chapter": "10-cell-therapy", "sources": [12, 13]},
      {"id": "pd1-1992", "date": "1992-11", "lane": "checkpoints", "type": "finding", "tag": "Lab finding",
       "title": "PD-1 found", "short": "PD-1 found",
       "what": "Tasuku Honjo's lab in Kyoto, studying genes switched on as cells die, finds PD-1 ('programmed death-1'). Mice lacking it later reveal it as a second brake on T cells.",
       "why": "PD-1 and its partner PD-L1 are the targets of most of today's checkpoint inhibitors.",
       "chapter": "05-t-cells", "sources": [2]},
      {"id": "ctla4block-1996", "date": "1996-03", "lane": "checkpoints", "type": "finding", "tag": "Lab finding",
       "title": "Releasing the brake", "short": "Releasing the brake",
       "what": "Dana Leach, Matthew Krummel and James Allison show that an antibody blocking CTLA-4 makes mice reject established tumors and stay immune to them afterward.",
       "why": "A new strategy: remove the immune system's brake instead of stimulating it, without needing to know what the T cells recognize.",
       "chapter": "08-checkpoints", "sources": [9, 2]},
      {"id": "rituximab-1997", "date": "1997-11-26", "lane": "antibodies", "type": "approval", "tag": "Approval",
       "title": "Rituximab", "short": "Rituximab",
       "what": "Rituximab (Rituxan), which flags lymphoma cells carrying the CD20 molecule for destruction, becomes the first monoclonal antibody approved in the US to treat cancer. Trastuzumab (Herceptin), for HER2-positive breast cancer, follows in 1998.",
       "why": "Köhler and Milstein's lab tool becomes a mainstream cancer drug.",
       "chapter": "09-antibodies", "sources": [8]},
      {"id": "hpv-2006", "date": "2006-06-08", "lane": "microbes", "type": "approval", "tag": "Approval",
       "title": "HPV vaccine", "short": "HPV vaccine",
       "what": "The first vaccine against human papillomavirus, the virus behind most cervical cancers, is approved in the US.",
       "why": "Blocking the virus prevents the cancer. Preventive vaccines remain the biggest success among cancer vaccines.",
       "chapter": "11-vaccines", "sources": [8]},
      {"id": "treme-2008", "date": "2008-04", "lane": "checkpoints", "type": "setback", "tag": "Setback",
       "title": "A sister drug fails", "short": "Trial stopped",
       "what": "A 655-patient trial of tremelimumab, another antibody that blocks CTLA-4, is stopped after it fails to beat chemotherapy in melanoma. Tumors shrank in no more patients than with chemotherapy, but those responses lasted much longer.",
       "why": "It deepened the skepticism just before the breakthrough. Tremelimumab itself was approved in 2022, in combination, for liver cancer.",
       "chapter": "08-checkpoints", "sources": [10, 8]},
      {"id": "ipilimumab-2011", "date": "2011-03-25", "lane": "checkpoints", "type": "approval", "tag": "Approval",
       "title": "Ipilimumab", "short": "Ipilimumab",
       "what": "In a phase 3 trial in previously treated melanoma, median survival was 10 months with ipilimumab (Yervoy), versus 6.4 months with a comparison vaccine alone. The FDA approves it in March 2011.",
       "why": "The first therapy approved by the FDA shown to help people with metastatic melanoma live longer, and the first approved checkpoint inhibitor.",
       "chapter": "08-checkpoints", "sources": [11, 8]},
      {"id": "emily-2012", "date": "2012-04", "lane": "cells", "type": "finding", "tag": "Clinical trial",
       "title": "Emily Whitehead", "short": "CAR-T for a child",
       "what": "Six-year-old Emily Whitehead, whose leukemia had relapsed twice, becomes the first child to receive the Philadelphia team's CD19-targeted CAR-T cells. She survives a severe cytokine storm and her leukemia disappears. Ten years later she was still cancer-free.",
       "why": "CAR-T cells could clear aggressive, treatment-resistant leukemia, and her doctors learned how to control the therapy's signature toxicity.",
       "chapter": "10-cell-therapy", "sources": [14, 15]},
      {"id": "pembro-2014", "date": "2014-09-04", "lane": "checkpoints", "type": "approval", "tag": "Approval",
       "title": "PD-1 blockers", "short": "PD-1 blockers",
       "what": "After a 2012 trial showed lasting tumor shrinkage in about one in five to one in four patients with melanoma, lung or kidney cancer, pembrolizumab (Keytruda) becomes the first PD-1 blocker approved in the US. Nivolumab (Opdivo) follows in December.",
       "why": "PD-1 blockers went on to be approved for many types of cancer.",
       "chapter": "08-checkpoints", "sources": [2, 8]},
      {"id": "blinatumomab-2014", "date": "2014-12-03", "lane": "antibodies", "type": "approval", "tag": "Approval",
       "title": "A T-cell engager", "short": "T-cell engager",
       "what": "Blinatumomab (Blincyto), an antibody with two different arms that physically links T cells to leukemia cells, is approved for a form of acute lymphoblastic leukemia.",
       "why": "The first bispecific T-cell engager approved in the US. Others followed, at first mostly for blood cancers.",
       "chapter": "09-antibodies", "sources": [8]},
      {"id": "tvec-2015", "date": "2015-10-27", "lane": "microbes", "type": "approval", "tag": "Approval",
       "title": "A cancer-killing virus", "short": "Cancer-killing virus",
       "what": "Talimogene laherparepvec (T-VEC, Imlygic) is approved for melanoma and is injected directly into tumors. It is a herpes virus engineered to infect and burst cancer cells and to release an immune-attracting signal.",
       "why": "The first oncolytic virus approved in the US, a living drug that turns the tumor into its own vaccine.",
       "chapter": "11-vaccines", "sources": [8]},
      {"id": "msi-2017", "date": "2017-05-23", "lane": "checkpoints", "type": "approval", "tag": "Approval",
       "title": "One drug, any organ", "short": "Tissue-agnostic",
       "what": "Pembrolizumab is approved for advanced solid tumors that are MSI-high or mismatch-repair deficient and have progressed after earlier treatment, wherever in the body they started. About 40% of patients in the supporting trials responded.",
       "why": "The FDA's first cancer approval based on a molecular feature of the tumor rather than the organ it came from.",
       "chapter": "08-checkpoints", "sources": [8]},
      {"id": "kymriah-2017", "date": "2017-08-30", "lane": "cells", "type": "approval", "tag": "Approval",
       "title": "CAR-T approved", "short": "First CAR-T approval",
       "what": "Tisagenlecleucel (Kymriah) is approved for children and young adults whose B-cell leukemia had returned or resisted other treatment. In the pivotal trial, 83% were in remission within three months.",
       "why": "The first CAR-T therapy approved in the US, which the FDA described as the first gene therapy available in the country.",
       "chapter": "10-cell-therapy", "sources": [8, 13]},
      {"id": "nobel-2018", "date": "2018-10-01", "lane": "ideas", "type": "finding", "tag": "Recognition",
       "title": "Nobel Prize to Allison and Honjo", "short": "Nobel Prize",
       "what": "James Allison and Tasuku Honjo share the Nobel Prize in Physiology or Medicine for discovering cancer therapy by inhibiting negative immune regulation.",
       "why": "It recognized the brakes, and the idea of releasing them, as a new pillar of cancer treatment.",
       "chapter": "08-checkpoints", "sources": [2]},
      {"id": "tdxd-2019", "date": "2019-12-20", "lane": "antibodies", "type": "approval", "tag": "Approval",
       "title": "An antibody that delivers poison", "short": "Antibody–drug conjugate",
       "what": "Trastuzumab deruxtecan (Enhertu), an antibody that carries a potent drug into cancer cells bearing HER2, is approved for HER2-positive breast cancer. In 2022 it becomes the first drug approved in the US for 'HER2-low' breast cancer.",
       "why": "It showed that a well-designed antibody–drug conjugate can work even when tumors carry only modest amounts of the target.",
       "chapter": "09-antibodies", "sources": [8]},
      {"id": "lifileucel-2024", "date": "2024-02-16", "lane": "cells", "type": "approval", "tag": "Approval",
       "title": "TIL therapy approved", "short": "First TIL approval",
       "what": "Lifileucel (Amtagvi) is approved for advanced melanoma that had already progressed on PD-1 treatment. About 31% of patients in the supporting trial responded.",
       "why": "The first T-cell therapy approved in the US for a solid tumor, more than 35 years after the first TIL report.",
       "chapter": "10-cell-therapy", "sources": [8, 6]},
      {"id": "tarlatamab-2024", "date": "2024-05-16", "lane": "antibodies", "type": "approval", "tag": "Approval",
       "title": "A T-cell engager for lung cancer", "short": "Engager for lung cancer",
       "what": "Tarlatamab (Imdelltra), a bispecific antibody that links T cells to small-cell lung cancer cells, is approved for patients whose disease progressed after chemotherapy; 40% responded.",
       "why": "Tebentafusp (2022) had shown that T-cell engagers could work in a rare solid tumor. Tarlatamab brought them to a common, aggressive one.",
       "chapter": "09-antibodies", "sources": [8]},
      {"id": "nadina-2024", "date": "2024-06", "lane": "checkpoints", "type": "finding", "tag": "Clinical trial",
       "title": "Treat before surgery", "short": "Before surgery",
       "what": "In the NADINA trial, 423 people with stage III melanoma received either two doses of ipilimumab plus nivolumab before surgery, or surgery followed by nivolumab. After a year, 84% versus 57% were alive without their cancer returning or worsening.",
       "why": "Strong evidence that timing matters: immunotherapy may work best while the tumor is still in place.",
       "chapter": "12-frontier", "sources": [17]},
      {"id": "afamicel-2024", "date": "2024-08-02", "lane": "cells", "type": "approval", "tag": "Approval",
       "title": "Engineered T-cell receptors", "short": "First TCR-T",
       "what": "Afamitresgene autoleucel (Tecelra) is approved for synovial sarcoma, a soft-tissue cancer, in patients with a matching tissue type; 43% responded. It consists of T cells engineered with a receptor that recognizes a fragment of the MAGE-A4 protein.",
       "why": "The first engineered T-cell receptor therapy approved in the US. Unlike a CAR, it can target proteins made inside the cell.",
       "chapter": "10-cell-therapy", "sources": [8]},
      {"id": "interpath-2026", "date": "2026-08-19", "lane": "microbes", "type": "finding", "tag": "Company-reported trial result",
       "title": "Personalized mRNA vaccine, phase 3", "short": "mRNA vaccine trial",
       "what": "Merck and Moderna report that adding a personalized mRNA vaccine, intismeran autogene, to pembrolizumab after melanoma surgery delayed recurrence in a 1,137-patient phase 3 trial. Detailed results had not been released at the time of writing.",
       "why": "The companies called it the first positive phase 3 result for a vaccine built from each patient's own tumor mutations. The vaccine was not yet approved.",
       "chapter": "11-vaccines", "sources": [18, 19]}
    ]
  }
alt: A timeline of 28 milestones in cancer immunotherapy from 1891 to 2026, in five lanes by type of treatment. Before 1975 there are only three: Coley's bacterial toxins (1891), the immunosurveillance hypothesis (1957) and the 1974 mouse experiment that seemed to disprove it. Between 1975 and 2010 come monoclonal antibodies, BCG, IL-2, the discovery of the CTLA-4 and PD-1 brakes, early T-cell therapies, the first antibody drugs and a failed trial. After 2010 the markers crowd together: checkpoint inhibitors from 2011, the first CAR-T approval in 2017, the 2018 Nobel Prize, newer antibody drugs, the first TIL and TCR-T approvals in 2024, and a company-reported phase 3 success for a personalized mRNA vaccine in 2026.
:::


# ===== 08-checkpoints (4 figures) =====

:::figure ch08-blockade
title: Jamming the handshake
goal: After using this, the reader understands that a checkpoint inhibitor physically covers one partner of the PD-1–PD-L1 handshake so the brake signal cannot be sent — and that this matters only when the T cell recognizes something on the cancer cell.
kind: explorer
stage: dark
spec: |
  WHAT IT SHOWS. A molecular close-up of the narrow gap where a CD8 killer T cell (top) touches a cancer cell (bottom).
  Put two small corner notes: "Not to scale" and "Illustrative".

  LAYOUT (desktop, ~16:9). Top ~30% of the stage: the underside of the T cell as a gently curved band, electric blue
  #4C8DFF, with a fine fuzz of microvilli, labeled "Killer T cell". Bottom ~30%: the top of the cancer cell as a lumpy,
  irregular violet-magenta band #B65FD8, labeled "Cancer cell". Between them, a dark gap. At the right edge, a vertical
  gauge labeled "T-cell activity".

  MOLECULES IN THE GAP:
  - Center: one T-cell receptor (TCR; a blue two-pronged glyph hanging from the T-cell membrane) touching one MHC class I
    "cup" (pale silver #D9DEEA) that rises from the cancer cell and holds a glowing hot-pink peptide bead #FF3D7F.
    Label: "TCR recognizes a neoantigen (signal 1)".
  - On each side of the center: 2 PD-1 receptors hanging from the T cell (4 in total; blue stalk with a rounded head;
    label one "PD-1"), each facing a PD-L1 molecule rising from the cancer cell (4 in total; stalk with a rounded head
    tinted violet; label one "PD-L1"). PD-1 and PD-L1 are drawn at similar heights, each about a third of the gap, so
    that when paired their heads meet in the middle.
  - Antibody (only when a drug is selected): a gold Y #F2B33D with a thin white outline, about 2–3x the height of a
    PD-1 stalk. It binds with the tip of one arm (the Fab) capping the head of its target. Its stem (Fc) points sideways,
    away from every other molecule.

  SIGNALS (shape carries meaning, not only color):
  - While the TCR is engaged, small green-cyan "+" glyphs #3DDC97 travel up from the TCR into the T cell toward the
    gauge, about one every 0.6 s.
  - Each formed PD-1–PD-L1 pair shows a crimson "−" bar glyph #E5484D at the inner end of PD-1 and sends crimson "−"
    pulses inward. Where a "−" pulse meets a "+" pulse, the "+" fades (damping).
  - Pairs are dynamic: each PD-1–PD-L1 pair separates and re-forms every 2–4 s (randomized), so at any moment most,
    not all, are paired. A molecule capped by an antibody can never pair. Antibodies, once docked, stay put.

  GAUGE. Vertical bar with three labeled ticks, low to high: "alert" (30%), "multiplying" (60%), "killing" (85%).
  The gauge is illustrative, not a measurement. Value V = S × (1 − 0.7 × P), where S = 1 if the neoantigen is displayed
  and 0 if not, and P = 1 with no drug, 0 with a drug (all four targets covered). No drug: V ≈ 30%. Drug: V = 100%.
  Tween changes over ~0.8 s. When V crosses "killing", show the T cell's granules (tiny dots) gathering toward the
  cancer cell and a brief, soft flash on the cancer-cell membrane (no gore). Below "killing", no flash.

  CONTROLS (below the stage):
  1. Segmented control "Drug": None · Anti-PD-1 · Anti-PD-L1. Choosing a drug makes gold antibodies drift in from the
     side edges of the gap and dock one by one over ~1.5 s: onto PD-1 (T-cell side) for anti-PD-1, onto PD-L1
     (cancer-cell side) for anti-PD-L1. Switching drugs undocks the old antibodies (they drift out) and docks the new ones.
  2. Toggle "Cancer cell displays its neoantigen": On (default) / Off. Off removes the pink bead and fades the MHC cup
     (the tumor has stopped displaying its target — the "hiding" of Chapter 7). No "+" pulses are made, the gauge falls
     to ~0 whatever the drug, and the "−" pulses have nothing to damp.

  CAPTIONS (reader-facing, verbatim; show the matching one in an ARIA live region under the stage):
  - None, displayed: "The T cell recognizes the cancer cell, but every PD-1–PD-L1 handshake sends a stop signal, holding the attack below the level needed to kill."
  - Anti-PD-1, displayed: "Antibodies cover PD-1 on the T cell, so PD-L1 has nothing to grab. With the brake silenced, the recognition signal gets through, and the T cell kills."
  - Anti-PD-L1, displayed: "This time the antibodies cover PD-L1 on the cancer cell. The handshake is blocked from the other side, with the same result."
  - Any drug, not displayed: "With no neoantigen on display, there is nothing to unleash. Releasing the brake cannot help a T cell that cannot see the cancer."
  - None, not displayed: "This cancer cell has stopped displaying its neoantigen. The T cell has no reason to attack, brake or no brake."

  SCIENTIFIC GUARDRAILS. Anti-PD-1 binds only PD-1 (on the T cell). Anti-PD-L1 binds only PD-L1 — in this scene, on
  the cancer cell (in patients, PD-L1 on nearby immune cells matters too). Antibodies never bind the TCR or MHC, carry
  nothing, and never damage the cancer cell themselves; any killing comes from the T cell. Do not show the antibody's
  stem engaging any receptor. The real gap at a T-cell contact is about 15 nm; drawing it wider so the antibodies fit
  is an acceptable simplification. Do not draw PD-1 on the cancer cell.

  MOBILE (<600 px). Portrait viewBox: T-cell band at top, cancer band at bottom, the TCR–MHC pair plus 2 PD-1–PD-L1
  pairs. The gauge becomes a horizontal bar under the stage with the same three ticks. Controls stack full width.
  Labels ≥14 px.

  REDUCED MOTION. No pulses or drifting: show static "+" and "−" arrows, dock antibodies instantly, jump the gauge.
alt: A close-up of the gap between a killer T cell and a cancer cell. The T cell's receptor recognizes a mutated peptide displayed by the cancer cell, but PD-1 on the T cell pairs with PD-L1 on the cancer cell and sends a stop signal that keeps the T cell's activity low. When antibodies cover PD-1, or PD-L1, the pairs cannot form and the T cell's activity rises high enough to kill. If the cancer cell stops displaying its peptide, blocking the brake makes no difference.
:::

:::figure ch08-two-brakes
title: Two brakes, two places
goal: After stepping through this, the reader understands that anti-CTLA-4 acts mainly where T cells are first switched on (widening the attack, at some risk to healthy tissue), while anti-PD-1/PD-L1 acts mainly inside the tumor (letting stem-like T cells and newly arriving clones produce fresh killers) — and why combining them adds both benefit and side effects.
kind: stepper
stage: dark
spec: |
  KEEP IT SPARE. Few cells, large and clearly labeled; one idea per step.

  LAYOUT (desktop). Two panels side by side, each with a small title in its top-left corner: left "Lymph node — where
  T cells are switched on", right "Tumor — where T cells do the work". A thin divider between them. Stepper controls
  (Back / Next, step dots) below. In steps 1–2 the right panel is dimmed (40% opacity); in steps 3–4 the left panel is.
  Only in step 5: two toggle switches under the panels ("Anti-CTLA-4", "Anti-PD-1 / PD-L1") and two qualitative
  5-segment meters ("Attack on the tumor", "Risk to healthy tissue") with the label "Illustrative, not measured".

  LEFT PANEL (lymph node, pale reticular texture in the background):
  - Center: one dendritic cell (green #4FD18B, star-shaped with long waving dendrites) holding up MHC cups with hot-pink
    tumor peptides, and 6 small B7 knobs (green-cyan #3DDC97 with a "+" glyph).
  - 4 naive CD8 T cells (blue #4C8DFF, smaller, dim), each with a different TCR glyph pattern (stripe, dot, chevron,
    plain) so they read as different clones: "strong match" (3 contact ticks), "weak match" (1 tick), a weak matcher to
    a self peptide (sand-colored #E9C9A1 "self" tag), and one that does not match at all.
  - Each T cell carries one CD28 (small "+" receptor). One regulatory T cell (slate-lavender #8C95C9, desaturated)
    beside the dendritic cell, with several CTLA-4 stalks (crimson #E5484D with a "−" glyph) gripping most of the B7 knobs.

  RIGHT PANEL (tumor):
  - 5 cancer cells (violet-magenta #B65FD8, lumpy, large irregular nuclei), displaying PD-L1 (violet-tinted stalks; a
    crimson "−" glyph where they touch PD-1).
  - 1 stem-like T cell (blue, with a thin inner ring and the label "stem-like (TCF1+)").
  - 2 exhausted T cells (blue but desaturated, slightly deflated outline, bristling with PD-1 stalks; label one "exhausted").
  - A blood vessel along the right edge (a softly glowing tube) through which new T cells can enter.

  STEP STATES:
  1. Lymph node, no drug. Most B7 is held by the Treg's CTLA-4. Only the "strong match" T cell receives CD28 contact:
     it brightens and divides into 3 copies that drift toward the panel's exit arrow. The others stay dim.
  2. Lymph node + anti-CTLA-4. Gold Y antibodies (#F2B33D, white outline) drift in and cap the CTLA-4 stalks. Freed B7
     knobs light up. The "weak match" cell and the "self"-tagged cell also make CD28 contact, brighten and divide (keep
     the self tag; add a dashed outline). A wider stream of differently patterned T cells leaves through the exit arrow.
     The Treg is NOT destroyed in this view.
  3. Tumor, no drug. PD-L1 pairs with PD-1 on the T cells (crimson "−" glyphs). Exhausted cells make occasional failed
     approaches. The stem-like cell divides slowly (every ~6 s) but its offspring quickly dim and become exhausted.
     A cancer cell divides every ~8 s.
  4. Tumor + anti-PD-1. Gold Ys cap the PD-1 stalks on the T cells (never on cancer cells). The stem-like cell divides
     faster (every ~2 s) into bright effector T cells (blue, no ring) that move to cancer cells; each contact ends with
     that cancer cell shrinking into small fragments (apoptosis) and fading. The exhausted cells brighten only slightly
     and stay put. Two T cells with new TCR patterns enter through the vessel (label "new clones arrive") and join in.
  5. Both panels active, free play; both toggles default ON. Each panel shows its drug state; with both ON, a faint
     dotted path runs from the left panel's exit arrow to the right panel's vessel and more new clones enter the tumor.
     Meters (attack/risk): none 1/1; anti-CTLA-4 only 2/3; anti-PD-1 only 4/2; both 5/4.

  SCIENTIFIC GUARDRAILS. CTLA-4 competes with CD28 for B7 on dendritic cells; Tregs carry the most CTLA-4. PD-1 is on
  T cells (most on exhausted ones); PD-L1 is on cancer cells. Anti-PD-1 binds T cells; anti-CTLA-4 binds T cells and
  Tregs; neither binds cancer cells. Do not show exhausted cells fully recovering. Do not show the drugs killing anything.

  MOBILE (<600 px). One panel at a time: steps 1–2 show the lymph node, steps 3–4 the tumor; step 5 adds a two-tab
  switch ("Lymph node" / "Tumor") above the stage, with toggles and meters below.

  REDUCED MOTION. Replace division and migration with cross-fades between end states; show arrows for movement.
steps:
  1. In a lymph node, a dendritic cell shows fragments of a tumor to passing T cells. CTLA-4, plentiful on regulatory T cells, grabs the dendritic cell's B7 molecules, so only the T cell with the strongest match gets enough of the "go" signal.
  2. Add anti-CTLA-4. With CTLA-4 covered, more B7 is free, and T cells with weaker matches switch on too. A broader army heads out — including a cell that reacts weakly to healthy tissue.
  3. In the tumor, T cells have been fighting for weeks. PD-L1 on the cancer cells keeps pressing their PD-1 brakes, and most are exhausted. The tumor keeps growing.
  4. Add anti-PD-1. Freed from the brake, the stem-like T cell multiplies into fresh killers, and new clones arrive from the blood. The most exhausted cells barely change.
  5. Now try the drugs together. The combination widens the army and frees it inside the tumor: more attack, but more risk to healthy tissue too.
alt: Two side-by-side scenes. In a lymph node, CTLA-4 on a regulatory T cell captures the B7 signals on a dendritic cell, so only a strongly matching T cell is switched on; blocking CTLA-4 frees B7 and lets more varied T cells switch on, including one that reacts to healthy tissue. In a tumor, PD-L1 on cancer cells keeps T cells exhausted; blocking PD-1 lets a stem-like T cell multiply into fresh killers and new clones arrive from the blood, while deeply exhausted cells barely change. Combining both drugs increases the attack on the tumor and the risk to healthy tissue.
:::

:::figure ch08-tail
title: The tail of the curve
goal: After using this, the reader understands that checkpoint inhibitors changed advanced melanoma less by shifting the median than by creating a long, gently sloping "tail" of patients alive many years later — and can read how many people out of 100 were alive at any time on each treatment.
kind: chart
stage: light
spec: |
  WHAT IT SHOWS. Simplified overall-survival curves for advanced melanoma from CheckMate 067 (ipilimumab, nivolumab,
  nivolumab + ipilimumab), plus a faded chemotherapy curve from an earlier trial. Permanent footnote under the chart
  (verbatim): "Simplified: smooth curves drawn through published survival percentages (dots), not the trials' actual
  curves. Chemotherapy comes from a different, earlier trial, so compare with caution."

  CHART. Light stage. X axis: "Years since starting treatment", 0–10 (ticks every year; data are in months, divide by
  12). Y axis: "% of patients alive", 0–100 (gridlines every 20). Curves: smooth monotone (non-increasing) cubic
  interpolation (Fritsch–Carlson / d3.curveMonotoneX) through the data points below, starting at (0, 100).
  Published points are small filled dots; hovering or tapping a dot shows its exact value and source number.
  Each curve ends at its last data point — do not extrapolate. Direct labels at line ends (no legend box); colors must
  also differ by line style:
    - Chemotherapy: warm gray #9C8F80 at 50% opacity, dashed, label "Chemotherapy (earlier trial)"; at its end, a small
      note "no data after year 3".
    - Ipilimumab: crimson #E5484D, solid, label "Ipilimumab".
    - Nivolumab: indigo #3D5AFE, solid, label "Nivolumab".
    - Nivolumab + ipilimumab: gold #C98A0B (a darker gold so it reads on paper), thick solid, label "Nivolumab + ipilimumab".
  A faint horizontal line at 50% labeled "half alive (median)".

  INTERACTIONS (keep to these):
  1. A vertical time cursor, dragged on the chart or set with a slider under it (0–10 years; arrow keys step 6 months).
     A readout lists each curve's value at the cursor, rounded to whole percent; values at published points are marked
     "published", values between points "approximate"; past a curve's last point, "no data".
  2. "100 people" panel to the right of the chart (below it on phones): a 10×10 grid of simple person glyphs for the
     selected curve (tap a curve or its label to select; default: Nivolumab + ipilimumab). Filled glyphs = alive at
     the cursor time; outlined = died. Text: "At [t] years: about [n] of 100 alive."
  3. Button "Show the long tail": shades years 3–10 and draws a light brace beside the two nivolumab-containing curves,
     labeled "the long tail", with this caption (verbatim): "After year 3 the curves keep sloping down, but gently.
     Counting only deaths from melanoma, the ten-year figures are higher: 52%, 44% and 23%."
  4. Stepper (Back / Next) for a guided tour; each step sets the state below, after which all controls remain usable.

  STEP STATES:
  1. Only chemotherapy visible (full opacity in this step); cursor at 3 years.
  2. Add ipilimumab; chemotherapy fades to 50%; cursor at 10 years.
  3. Add nivolumab and the combination; cursor at 10 years; the grid shows the combination.
  4. "Show the long tail" on; cursor at 3 years.
  5. Everything available; cursor at 5 years.

  MOBILE (<600 px). Chart full width (aspect ~4:3), the time slider below it, then the 100-people grid (glyphs ≥ 14 px),
  then the readout as a compact list.

  REDUCED MOTION. No transitions between steps beyond a quick fade.
steps:
  1. A survival curve starts with everyone alive and steps down as patients die. With chemotherapy, the standard treatment before 2011, half of the patients in one large trial had died by nine months, and only 12% were alive three years later.
  2. In randomized trials, ipilimumab added only a few months to median survival. (Its median looks much longer here because CheckMate 067 ran years later, in different patients.) What changed was the tail: about one in five patients was still alive ten years later, although many in this trial later also received a PD-1 blocker.
  3. Nivolumab, which blocks PD-1, raised the tail: 37% of patients were alive at ten years. Nivolumab plus ipilimumab raised it to 43%, and half of those patients were still alive at six years.
  4. After about year three, the curves keep sloping down, but gently: about two percentage points a year instead of fifteen or twenty. Some of those later deaths were from other causes.
  5. Explore on your own: drag the time marker to see how many people out of 100 were alive at any point. The faded chemotherapy curve comes from a different, earlier trial, so compare it with caution.
data: |
  All values = % of patients alive (overall survival). Time in months from randomization (x axis shows years = months/12).
  "median" points sit at 50% by definition of median overall survival. (0, 100) is the start of every curve.

  Chemotherapy — dacarbazine + placebo arm of a phase 3 trial in previously untreated metastatic melanoma (n = 252) [11]:
    (0, 100); (9.1, 50) median; (12, 36.3); (24, 17.9); (36, 12.2). Curve ends at 36 months.

  CheckMate 067, previously untreated advanced melanoma, randomized 1:1:1 (N = 945):
    Ipilimumab alone (n = 315):        (0, 100); (19.9, 50) median [5]; (24, 45) [12]; (36, 34) [12]; (60, 26) [15]; (90, 22) [5]; (120, 19) [5].
    Nivolumab alone (n = 316):         (0, 100); (24, 59) [12]; (36, 52) [12]; (36.9, 50) median [5]; (60, 44) [15]; (90, 42) [5]; (120, 37) [5].
    Nivolumab + ipilimumab (n = 314):  (0, 100); (24, 64) [12]; (36, 58) [12]; (60, 52) [15]; (71.9, 50) median [5]; (90, 48) [5]; (120, 43) [5].
    (90-month values = 7.5-year overall survival as reported in the introduction of [5].)
    Context for tooltips: by the 3-year analysis, 43% of the ipilimumab group had received a PD-1 blocker [12].

  Annotation values, all from [5]:
    Melanoma-specific survival at 10 years: combination 52%, nivolumab 44%, ipilimumab 23%.
    Progression-free at 3 years: 31.8%, 24.7%, 6.7% of patients; of these, 10-year melanoma-specific survival 96%, 97%, 88%.
alt: Survival curves for advanced melanoma. With chemotherapy, from an earlier trial, half of patients had died by nine months and 12% were alive at three years. In the CheckMate 067 trial, the ipilimumab, nivolumab and nivolumab-plus-ipilimumab curves fall less steeply, then slope down only gently after about three years, ending at 19%, 37% and 43% alive at ten years; median survival was 19.9, 36.9 and 71.9 months. The curves are simplified redrawings through published values.
:::

:::figure ch08-side-effects
title: When the brakes come off everywhere
goal: After using this, the reader understands that checkpoint side effects are autoimmune attacks that can hit almost any organ, that most are uncommon with a single PD-1 blocker while their frequency rises with anti-CTLA-4 and especially the combination, and that hormone-gland damage is often permanent.
kind: explorer
stage: light
spec: |
  WHAT IT SHOWS. A calm, front-facing, gender-neutral human silhouette (no face or features; soft paper-colored fill,
  ink outline) with 13 organ hotspots. Above it, a segmented control and two verbatim stat lines.

  CONTROL. Segmented control "Drug": PD-1 or PD-L1 blocker alone · CTLA-4 blocker alone · Both together
  (default: PD-1 or PD-L1 blocker alone, the most common treatment).

  HEADER (verbatim, in this order):
  - "Any treatment-related side effect in one melanoma trial (CheckMate 067): nivolumab 86% · ipilimumab 86% · both 96%. Severe (grade 3–4): 21% · 28% · 59% [12]"
  - "Deaths from side effects, pooled across trials: about 1 in 270 patients on a PD-1 or PD-L1 blocker · 1 in 90 on a CTLA-4 blocker · 1 in 80 on both [26]"

  HOTSPOTS. Each is a small organ glyph inside a soft circle, with a text label and a leader line: eyes, pituitary
  (inside the head), thyroid (neck), lungs, heart, liver, adrenal glands, pancreas, gut (colon), kidneys, joints
  (knee), nerves & muscles (upper arm), skin (a patch on the forearm). Each hotspot shows a frequency band for the
  selected drug, by BOTH ring thickness and a text tag: "rare" (thin ring), "uncommon" (medium), "common" (thick),
  "very common" (thick + filled tint). Use crimson #E5484D tints for the rings. Switching drugs animates rings (0.4 s).
  The four hormone glands (pituitary, thyroid, adrenals, pancreas) carry a small badge: a pill icon with the words
  "often permanent".

  BAND FOOTNOTE (verbatim): "Bands count patients diagnosed with inflammation of that organ, of any severity — not
  symptoms such as tiredness or diarrhea alone — pooled across trials and cancer types; real rates vary with dose and
  cancer. Rare: under 1% of patients. Uncommon: 1–5%. Common: 5–20%. Very common: over 20%."

  BANDS (PD-1/PD-L1 alone · CTLA-4 alone · both) with their basis:
    skin                very common · very common · very common   any-grade skin events 46% · 56% · 62% (CheckMate 067) [12]
    gut (colitis)       uncommon · common · common                colitis ~1% · 12% · 14% [26]
    liver (hepatitis)   uncommon · uncommon–common · common       1–6% · 1–25% (varies widely between trials) · 17–22% [26]
    lungs (pneumonitis) uncommon · rare · common                  ~1–3% (higher in lung cancer) [26]; less frequent with CTLA-4 blockers [26]; 6.6% with the combination in melanoma [30]
    thyroid             common · uncommon · common                underactive thyroid ~7% · 3.8% · 13% [27]
    pituitary           rare · uncommon · common                  0.4% · 3.2% · 6.4% [27]
    adrenal glands      rare · rare · uncommon                    under 1% with one drug; 4.2% with both [27]
    pancreas (diabetes) rare · rare · rare                        about 0.2% overall [27]; ≤1% [26]
    heart (myocarditis) rare · rare · rare                        severe cases reported in 0.06% (nivolumab) and 0.27% (combination) [29]
    nerves & muscles    rare · rare · rare                        serious forms (myasthenia ~1%, myositis ~0.6%) [26]
    joints (arthritis)  uncommon · uncommon · uncommon            joint aches ~8%, arthritis ~1% [26]
    kidneys (nephritis) uncommon · uncommon · uncommon            kidney injury ~2% overall [26]
    eyes (uveitis)      rare · rare · rare                        under 1% [26]
  For a range tag such as "uncommon–common", show that text and the thicker ring.

  CARDS. Hover (desktop) or tap (all devices) a hotspot to open its card beside the figure (bottom sheet on phones).
  Card text is reader-facing — use verbatim; bracketed numbers are source links:
  - Skin: "The most common target. Rash and itching are frequent, and in melanoma, patches of skin can lose their color as T cells attack pigment cells, healthy and cancerous alike. Usually mild and treated with creams. In CheckMate 067, skin side effects of any severity affected 46% of patients on nivolumab, 56% on ipilimumab and 62% on both [12]."
  - Gut: "Diarrhea is common (about 20% of patients on a PD-1 blocker, 35% on ipilimumab, over 40% on both), but true inflammation of the colon (colitis) is diagnosed in about 1%, 12% and 14% [26]. Colitis is the hallmark of ipilimumab and caused about 70% of reported deaths linked to CTLA-4 blockers [26]. Treated with steroids and, if needed, other immune-suppressing drugs."
  - Liver: "Hepatitis usually shows up on routine blood tests before it causes symptoms. It affects about 1–6% of patients on PD-1 or PD-L1 blockers and 17–22% on the combination [26]. It is managed by pausing treatment and giving steroids."
  - Lungs: "Pneumonitis, inflammation of the lungs, causes cough and breathlessness. It affects about 1–3% of patients on a PD-1 or PD-L1 blocker, more in lung cancer [26], and 6.6% of melanoma patients on the combination [30]. It was the leading cause of reported deaths linked to PD-1 or PD-L1 blockers, at 35% [26]."
  - Thyroid: "The most common hormone problem. The thyroid may first become overactive for a few weeks, then underactive, often for good. An underactive thyroid affected about 4% of patients on ipilimumab, 7% on PD-1 blockers and 13% on both [27]. Treated with a daily thyroid-hormone pill, usually for life."
  - Pituitary: "Hypophysitis, inflammation of the master hormone gland at the base of the brain, causes headaches and fatigue. It is typical of ipilimumab: about 3% of patients on ipilimumab and 6% on both, but fewer than 1% on PD-1 blockers [27]. Lost hormones, especially cortisol, usually need lifelong replacement [26]."
  - Adrenal glands: "Damage to the adrenal glands themselves is rare with a single drug (under 1% of patients) but affected about 4% of patients on the combination in one large analysis. Cortisol must then be replaced for life [27]."
  - Pancreas: "Very rarely, about 0.2% of patients, T cells destroy the insulin-making cells, causing sudden diabetes that needs insulin for life [27]."
  - Heart: "Myocarditis, inflammation of the heart muscle, is rare but the most dangerous side effect. Severe cases were reported in about 1 in 1,700 patients on nivolumab and 1 in 370 on the combination, usually within weeks of starting [29]; nearly half of reported cases have been fatal [26]."
  - Nerves & muscles: "Serious inflammation of muscles (myositis) or of the nerve–muscle junction (a myasthenia-like weakness) is rare, affecting around 1% of patients or fewer [26]. It can occur together with myocarditis."
  - Joints: "Joint aches affect about 8% of patients; true arthritis about 1% [26]."
  - Kidneys: "Kidney inflammation is uncommon (kidney injury in about 2% of patients overall) and is usually found on blood tests [26]."
  - Eyes: "Inflammation inside the eye (uveitis) is rare, under 1% of patients [26]."

  "WHY?" TOGGLE. A switch "Show the brakes in healthy tissue": overlays small crimson "−" brake glyphs on every hotspot
  and shows this caption (verbatim): "Healthy tissues use the same brakes. Many display PD-L1, especially when inflamed
  — in two patients who died of heart inflammation, the injured heart muscle displayed it [29] — and CTLA-4 keeps
  T cells that could attack them from switching on. A checkpoint inhibitor releases these brakes everywhere it reaches."

  ACCESSIBILITY. Provide an equivalent list of organ buttons (a collapsible "List view") that opens the same cards.
  Hotspots are keyboard-focusable in head-to-toe order.

  MOBILE (<600 px). Segmented control full width at top; header stats collapse into a "Key numbers" disclosure; the
  silhouette fills the width (portrait), hotspots ≥ 44 px touch targets with short labels; cards open as a bottom sheet.

  REDUCED MOTION. No ring animation; switch instantly.
alt: A human silhouette with markers on the organs that checkpoint inhibitors can inflame: skin, gut, liver, lungs, thyroid, pituitary, adrenal glands, pancreas, heart, nerves and muscles, joints, kidneys and eyes. With a PD-1 or PD-L1 blocker alone, skin problems are very common and thyroid problems common, while most other organs are affected uncommonly or rarely; with a CTLA-4 blocker, gut and pituitary inflammation become more frequent; the combination raises most rates. Hormone-gland damage is often permanent, and inflammation of the heart is rare but the most often fatal.
:::


# ===== 09-antibodies (4 figures) =====

:::figure ch09-humanization
title: From mouse to human, one frame at a time
goal: After using this, the reader understands that an antibody's grip lives in six small loops at each arm tip, so engineers could replace the rest with human parts without losing the target, and that the drug's name records how much was replaced.
kind: explorer
stage: dark
spec: |
  ONE IDEA: the grip lives in six tiny loops; everything else is a swappable frame. Keep the screen calm:
  one antibody, one magnifier, one slider, a name chip and two meters. No extra modes.

  LAYOUT (desktop, landscape viewBox ~960x540):
  - Center-left: one IgG antibody drawn upright as a Y (arms ~60° apart, stem down). At upper right, a
    strip of cancer-cell membrane (violet #B65FD8, lumpy edge) runs diagonally, carrying a small target
    protein (sand #E9C9A1 knob on a short stalk). The tip of the antibody's right arm touches the target
    at all times. Only two text labels on the antibody: "tip" (at an arm end) and "stem" (at the base).
  - Right of the antibody, just below the target: a permanent circular MAGNIFIER inset (~180 px) joined
    to the right arm tip by two thin lines that do not cross the antibody. Inside it: that tip enlarged, with six small finger-like loops (three on the heavy chain, three
    on the light chain) closing around the target. Caption under the inset: "six loops do the gripping".
  - Beside the stage (HTML panel on the right on desktop): the name chip, then two meters.
  - Bottom: a 4-stop slider, also usable as 4 buttons: "Mouse · Chimeric · Humanized · Fully human".
    Tiny year under each stop: 1986 · 1994 · 1997 · 2002, with a footnote: "Year of the first US approval
    of this kind of antibody, for any disease."

  THE ANTIBODY (draw it correctly even though it is barely labeled):
  - Four chains: two identical heavy chains, two identical light chains. Each heavy chain = 4 domains in a
    row (rounded ovals): variable domain at the arm tip, then one constant domain in the arm, then (after a
    thin flexible hinge) two constant domains forming half of the stem. The two heavy chains pair down the
    stem. Each light chain = 2 domains (variable at the tip, constant below it), lying on the OUTER side of
    each arm. So each arm = 4 domains and the stem = 4 domains: 12 in total.
  - The six loops sit at the very outer end of each arm (both arms have them; only the right arm touches
    the target). Never draw binding anywhere else.
  - Optional tiny scale bar "≈ 10 nm".

  COLOR AND TEXTURE (never color alone):
  - Human-derived: solid antibody gold #F2B33D with the white outline used for drug antibodies.
  - Mouse-derived: lavender-silver #A3A9D6 PLUS diagonal hatching.

  STATES (slider). Morph by sweeping gold upward from the stem to the tips over ~0.8 s. The gripping tip
  never moves or loosens, and the magnifier keeps showing the same grip.
  1. Mouse: all 12 domains and all loops hatched.
  2. Chimeric: the 4 variable domains (2 per arm, at the tips) hatched; the 8 constant domains gold.
  3. Humanized: all domains gold; only the 6 loops per arm hatched, plus 2–3 tiny hatched specks in the
     frame right next to the loops (the "supporting mouse building blocks"); the magnifier shows these.
  4. Fully human: everything gold.

  NAME CHIP (large, the source letters bold AND underlined, never color only):
  1. "ibritum·**o**·mab" (ibritumomab) 2. "ritu·**xi**·mab" (rituximab) 3. "trastu·**zu**·mab" (trastuzumab)
  4. "daratum·**u**·mab" (daratumumab). Under it, one line: "-o- mouse · -xi- chimeric · -zu- humanized ·
  -u- human". Footnote: "Names chosen since 2017 drop these letters. See 'Go deeper'."

  METERS (HTML, simple horizontal bars with text values):
  - "Grip on the target": FULL at every stop, the same bar. This constancy is the point.
  - "Patient's immune reaction against the drug": High · Lower · Low · Low (never zero).

  THE ONE ANIMATION (makes meter 2 visible): small "anti-drug antibodies" (thin outlined Ys in pale
  gray-white, about 1/5 the drug's size; the first one carries a tiny label "anti-drug antibody") drift in
  from the left and stick mainly to hatched parts. Mouse: ~10 stick all over within 3 s. Chimeric: ~4, on
  the arm tips. Humanized: 1–2, at the loops. Fully human: now and then a single one sticks at a (gold)
  loop, to show that even a fully human antibody's unique tips can be recognized.

  PROGRESSIVE DISCLOSURE: on load, show the Mouse state, the antibody, the magnifier and caption 1. The
  name chip and meters fade in the first time the reader moves the slider.

  MOBILE (≤ 480 px): portrait viewBox (~360x560). Antibody upper center with the target at its upper
  right, magnifier as a smaller circle at its lower right, name chip below, slider (4 tap targets ≥ 44 px), then the two meters.
  REDUCED MOTION: jump between states; show anti-drug antibodies already stuck in place.
  DO NOT: draw only two chains; put binding at the stem; show any immune-cell recruitment (this figure is
  only about the grip and the immune reaction); show "zero" reaction for fully human; faces or eyes.
steps:
  1. A pure mouse antibody. Its grip on the target is perfect, but the patient's immune system sees the whole molecule as foreign and makes antibodies against it. These clear the drug and can cause allergic reactions.
  2. Chimeric: the mouse's arm tips are mounted on a human frame, making the antibody roughly two-thirds human. The grip is unchanged and the immune reaction drops. In the old naming code, -xi- marks a chimeric antibody, as in rituximab.
  3. Humanized: only the six loops that touch the target remain from the mouse, plus a few mouse building blocks that hold them in shape. The grip is still unchanged, and -zu- marks the name, as in trastuzumab.
  4. Fully human: no mouse parts remain. These antibodies come from libraries of human antibody fragments or from mice carrying human antibody genes, and -u- marks the name, as in daratumumab. Their tips are still a new shape to the body, so reactions are uncommon but possible.
alt: An antibody shaped like a Y grips a target on a cancer cell with the tip of one arm; a magnifier shows six small loops doing the gripping. A slider replaces mouse-derived parts (hatched) with human parts (gold) in four stages: mouse, chimeric, humanized and fully human. The grip never changes, fewer anti-drug antibodies attach at each stage, and the example drug name changes from ibritumomab to rituximab, trastuzumab and daratumumab.
:::

:::figure ch09-wiring
title: When blocking the doorbell stops working
goal: After using this, the reader understands that an antibody blocking a growth receptor silences the "divide" signal only if nothing further down the chain is stuck on, which is why cetuximab fails in tumors with mutant KRAS.
kind: explorer
stage: dark
spec: |
  ONE IDEA, FOUR STATES (2 × 2): drug off/on × KRAS normal/mutant. No counters, no extra labels.

  SCENE (landscape viewBox ~900x500; portrait on mobile):
  - A stretch of cancer-cell membrane runs horizontally across the upper third (violet #B65FD8). Outside =
    above, inside = below.
  - Three EGFR receptors span the membrane: a two-lobed antenna above, a thin line through the membrane, a
    small box below. Label one "EGFR (receptor)". HER2 is NOT used here (it has no signal molecule to
    block).
  - Growth-factor molecules (small sand-colored dots, label one "growth factor") drift down and dock on
    the antennas.
  - Below the membrane, a "wire": a vertical chain of three beads. Only the first bead, sitting right
    against the inner face of the membrane, is labeled "KRAS"; the other two are unlabeled ("relay
    proteins" on hover). The chain ends at a nucleus outline near the bottom, which holds a round lamp
    labeled "DIVIDE" (activating green-cyan #3DDC97 with a "+" glyph when lit; gray outline when off).
  - When a receptor is triggered, a soft pulse runs down the chain and the lamp blinks.

  CONTROLS (HTML): toggle "Add cetuximab"; segmented "Tumor's KRAS: Normal | Mutant".
  PROGRESSIVE DISCLOSURE: on load only "Add cetuximab" is shown (KRAS = Normal). After the reader has
  switched cetuximab on once, the KRAS control fades in with a one-line prompt: "Now try a tumor whose
  KRAS is mutated."

  STATES AND VERBATIM CAPTIONS (aria-live):
  a) Normal, no drug: growth factor docks, pulses run, lamp blinks with each docking.
     "A growth factor docks on EGFR, and a pulse runs down the chain inside the cell. The cell gets the message to divide."
  b) Normal + cetuximab: gold Y antibodies (#F2B33D, white outline) sit on the outer lobe of each antenna,
     where the growth factor would land; growth-factor dots bounce off; no pulses; lamp dark.
     "Cetuximab sits where the growth factor would land. No docking, no pulse, no message to divide."
  c) Mutant, no drug: the KRAS bead glows constantly and shows a small toggle-switch glyph jammed in the
     ON position with the label "stuck on" (do NOT use a padlock, which reads as "off"); pulses run from
     KRAS downward nonstop; lamp lit continuously.
     "This tumor's KRAS is mutated and stuck on. It sends the divide signal nonstop, whatever happens at the receptor."
  d) Mutant + cetuximab: receptors capped, growth factor bouncing off, BUT KRAS still glowing and the lamp
     still lit; a brief dashed outline flashes around the KRAS bead.
     "Cetuximab still blocks the receptor, but it no longer matters: the signal starts below the blockade. That is why colorectal tumors are tested for RAS mutations before this drug is used."

  FOOTNOTE (small, always visible): "Simplified: real cells split this signal into several wires.
  Antibodies are drawn far larger than real scale."
  MOBILE: portrait viewBox (~360x520); membrane near the top, wire vertical below; controls stacked under
  the stage as large toggles.
  REDUCED MOTION: no drifting or pulses; show each state as a still with arrows (pulse path drawn as a
  solid arrow when active) and the lamp on or off.
alt: A cancer-cell membrane with EGFR receptors and, inside, a chain of relay proteins starting with KRAS that leads to a "divide" lamp in the nucleus. A growth factor docks and the lamp lights. Adding cetuximab caps the receptors and the lamp goes dark. In a tumor with mutant KRAS, KRAS is stuck on and the lamp stays lit whether or not cetuximab blocks the receptors.
:::

:::figure ch09-adc
title: Anatomy of a guided missile
goal: After using this, the reader understands how an antibody–drug conjugate delivers its payload inside a cancer cell, and how a payload that can cross membranes also kills neighboring cancer cells with little or no target.
kind: stepper
stage: dark
spec: |
  A 5-STEP STEPPER. Steps 1–4 run with T-DXd only and zoom in on one cell. Step 5 zooms out to a small
  patch of cells and only then reveals one extra control (a T-DXd / T-DM1 switch). No tallies, no
  explorer mode.

  THE ADC ICON: a gold antibody Y (#F2B33D, white outline). Payloads are small four-pointed stars in pale
  yellow-white #FFF1A8 with a dark outline (do not use hot pink #FF3D7F, reserved for peptides; no
  radiation symbols). Each star hangs on a short thin tether = the linker. T-DXd: 8 stars, each tether
  drawn with a small notch (it can snap). T-DM1: 3–4 stars (label "≈3.5 on average"), solid tethers.
  Stars attach along the lower arms and the stem (the antibody's constant parts), NEVER at the gripping
  tips. Footnote: "Antibodies and payloads are drawn far larger than real scale; a payload molecule is a
  few hundred times lighter than the antibody."

  STEPS 1–4 (one HER2-rich cancer cell; violet membrane across the lower half of the stage, HER2 as small
  knobs on its surface, cell interior and nucleus below):
  1 "Bind": several ADCs drift across the top from left to right; most pass by. One ADC's arm tips grip a
    HER2 knob; another binds nearby.
  2 "Swallow": the membrane under the bound ADC dimples inward and pinches off; ADC + HER2 are now inside
    a small bubble drifting into the cell.
  3 "Release": the bubble fuses with a larger round sac (the lysosome; slightly acidic tint, small enzyme
    glyphs). The linker notches snap and the stars float free.
  4 "Kill": free stars move to the nucleus; a DNA strand there shows a break; the cell shrinks, blebs into
    fragments and dims (apoptosis).

  STEP 5 "Neighbors" (zoom out): a patch of 7 touching cancer cells: 3 HER2-rich (many knobs), 2 HER2-poor
  (2–3 knobs), 2 with no HER2 (no knobs; marked with a small "0"). A segmented switch appears: "T-DXd |
  T-DM1" (default T-DXd). Pressing "Play" runs the scene qualitatively:
  - T-DXd: ADCs bind and enter the rich and poor cells; free stars pass straight through the membranes of
    dying cells into their touching neighbors; the two "0" cells, which touch dying cells, also die. All
    or nearly all 7 die. Stars reach only touching neighbors, never distant cells.
  - T-DM1: ADCs bind and enter mainly the rich cells; when T-DM1 is selected, step 3 is replayed in a small
    inset showing the antibody itself being digested and the stars coming free still attached to a short
    charged stub (tiny "+" tag). In the patch, freed stars bump against the inside of the membrane and
    stay there; the HER2-rich cells die, the HER2-poor cells mostly survive, and the "0" cells survive.
  Permanent small note under step 5: "Not shown: payload that leaks into the blood or is taken up by
  healthy organs, the main source of side effects such as lung inflammation."

  MOBILE: portrait viewBox; Back / Next buttons and step dots in a bar under the stage; the T-DXd / T-DM1
  switch appears under the stage at step 5 as two large buttons.
  REDUCED MOTION: each step shows its end state as a still with arrows.
  DO NOT: put payloads on the arm tips; show the ADC killing distant cells; imply radioactivity; show any
  numbers of cells killed.
steps:
  1. An antibody–drug conjugate drifts through the blood until its tips find HER2 on a cancer cell. The small stars tethered to it are the payload, still locked to the antibody and harmless for now. Most of the dose never reaches the tumor at all.
  2. The cell constantly pulls bits of its own surface inside. Here it swallows HER2 with the drug still attached, wrapped in a small bubble.
  3. The bubble merges with a lysosome, the cell's acidic recycling bin. Enzymes there cut the linker, the fuse, and set the payload free.
  4. The freed payload, deruxtecan, reaches the nucleus and breaks the cell's DNA. The cell dies.
  5. Deruxtecan slips through membranes, so some escapes into touching neighbors and kills them too, even cancer cells with no HER2. This is the bystander effect. Switch to T-DM1: its linker never breaks, so enzymes digest the antibody instead, and the freed payload keeps a charged scrap of linker that traps it inside the first cell.
alt: A step-by-step animation of an antibody–drug conjugate. A gold antibody carrying small payload stars binds HER2 on a cancer cell, is swallowed into a bubble, and is broken open in a lysosome; the payload is released and breaks the cell's DNA. In a patch of cells with high, low and no HER2, trastuzumab deruxtecan's payload spreads into touching neighbors and kills cells without HER2, while trastuzumab emtansine's payload stays trapped and only HER2-rich cells die.
:::

:::figure ch09-bridge
title: The matchmaker
goal: After using this, the reader understands that an antibody-based T-cell engager lets ordinary T cells kill a cancer cell without a matching receptor and even when the tumor hides its MHC, whereas a TCR-based engager (tebentafusp) needs the MHC shop window and the right HLA type.
kind: simulation
stage: dark
spec: |
  ONE IDEA: who can recognize the tumor. Two controls only (plus one revealed button). No dosing control
  and no cytokine chart (Chapter 10 owns the CRS curve).

  SCENE (Canvas 2D is fine, ~50 moving objects): a generic tissue field. Right of center, a cluster of 8
  cancer cells (violet #B65FD8, lumpy, large nuclei). Each cancer cell carries:
  (a) 4–6 small surface knobs labeled once "tumor surface protein";
  (b) 3–4 MHC-I cups (pale silver #D9DEEA), each holding a peptide bead: most beads sand (self), one per
      cell hot pink #FF3D7F labeled once "tumor peptide".
  T cells: ~36 killer T cells (electric blue #4C8DFF, small, round, fine microvilli fuzz) and ~6 helper
  T cells (teal #2EC4C9) wander slowly. Each carries a tiny receptor glyph with a notch shape drawn from
  many random shapes (its "search query"). Exactly ONE killer T cell has a notch matching the pink tumor
  peptide; give it a subtle halo. CD3 is implied on every T cell (not drawn).
  Footnote (always visible): "One matching T cell in about 40 is shown so you can find it. In reality,
  about one in 100,000 to a million matches a given target. Molecules are drawn far larger than real."

  CONTROLS (HTML, under the stage):
  1. Segmented "Engager": "None" | "Antibody-based (e.g., blinatumomab, tarlatamab)" | "TCR-based
     (tebentafusp)".
  2. Toggle "Tumor hides its shop window (MHC loss)": when on, all MHC cups and peptide beads fade away.
  PROGRESSIVE DISCLOSURE: only in TCR-based mode, a small text button appears under the caption: "What if
  the patient has a different HLA type?" Pressing it switches the cups to a visibly different cup shape
  (tagged "other HLA"); pressing again ("Back to HLA-A*02:01") restores them. Cups in the default state
  carry a tiny "A*02:01" tag only while TCR-based is selected.

  ENGAGER GLYPHS:
  - Antibody-based: a small two-armed gold molecule, one arm tip blue with a tiny "CD3" tag. It sticks to
    the surface knobs, studding cancer cells with engagers.
  - TCR-based: a small molecule whose cancer-binding end is a receptor-shaped notch (pale silver-blue) and
    whose other end is the blue CD3 grabber. It sticks ONLY to cups holding the pink peptide, ONLY with
    HLA-A*02:01 cups, and only while MHC is shown.

  BEHAVIOR:
  - None: T cells wander. If MHC is shown, only the haloed matching T cell docks on a cancer cell showing
    the pink peptide: contact flattens into a tight synapse, granules move to the contact, the cancer cell
    shrinks, blebs and fades; the T cell detaches and moves on. If MHC is hidden, nobody docks.
  - Antibody-based: any T cell that touches an engager-studded cancer cell is bridged (draw the engager
    linking both membranes), forms a synapse and kills. Many kills in parallel. Hiding MHC changes nothing.
  - TCR-based: engagers stick to pink-peptide cups; any T cell touching that cell is bridged and kills.
    Hiding MHC, or switching to "other HLA", leaves engagers nothing to bind: no kills.
  - One counter (HTML): "Cancer cells destroyed: x / 8". Restart automatically when the engager or a toggle
    changes.

  VERBATIM CAPTIONS (aria-live; show the one matching the state):
  - None, MHC shown: "Without help, only a T cell whose receptor matches the tumor's displayed peptide can recognize it. Here that is one cell in the crowd."
  - None, MHC hidden: "The tumor has closed its shop window. Even the one matching T cell now sees nothing."
  - Antibody-based (either MHC state): "The engager grabs a protein on the cancer cell's surface and CD3 on any T cell it meets. Ordinary T cells become killers, and hiding the shop window does not help the tumor."
  - TCR-based, MHC shown, HLA-A*02:01: "Tebentafusp reads the shop window. It sticks only to the gp100 peptide displayed in HLA-A*02:01, then pulls in any passing T cell."
  - TCR-based, MHC hidden: "With the shop window closed, tebentafusp has nothing to read. A TCR-based engager cannot see a tumor that has dropped its MHC."
  - TCR-based, other HLA: "This patient's HLA molecules display different peptides, or display them differently, so tebentafusp finds nothing it recognizes. That is why patients are tested for HLA-A*02:01 first."

  MOBILE: portrait field (~360x420) with ~24 T cells; controls stacked as large segmented buttons.
  REDUCED MOTION: no wandering; show a still of the end state for the chosen settings with the counter.
  ACCURACY NOTES: CD3 is on all T cells, helpers included; engagers do not need the T cell's own receptor
  to match; kills use the T cell's own granules; engagers bind and let go rather than locking; they bridge
  cells that touch and never drag T cells across distances.
alt: A field of wandering T cells and a cluster of cancer cells. Without an engager, only one rare T cell with a matching receptor can recognize the tumor, and none can once the tumor hides its MHC. With an antibody-based engager, any T cell that touches a cancer cell is bridged to it and kills, even when MHC is hidden. With the TCR-based engager tebentafusp, killing happens only if the tumor displays its peptide in MHC and the patient has HLA-A*02:01.
:::


# ===== 10-cell-therapy (4 figures) =====

:::figure ch10-build-a-car
title: One signal, or two
goal: After using this, the reader sees that a CAR whose tail carries only signal 1 kills once and then fades, while a tail carrying signal 1 plus signal 2 kills and then divides and survives — the single change that made CAR-T therapy work in patients.
kind: explorer
stage: dark
spec: |
  ONE idea only: what the signaling tail does. Everything else is scenery and should be quiet.

  LAYOUT. A T-cell membrane in cross-section across the middle of the stage: a horizontal lipid bilayer (two rows of soft-edged lipid heads), "outside the cell" above, "inside the cell" below in a faintly lighter cytoplasm tone. Electric blue (#4C8DFF) is the T-cell color.

  Standing in the membrane, one chimeric antigen receptor, drawn as a vertical stack and labeled once each with thin leader lines (these labels are STATIC — not controls):
    - binder: two rounded antibody-variable lobes joined by a visibly flexible squiggle, in antibody gold (#F2B33D), label "scFv binder";
    - hinge: short stalk above the membrane, label "hinge";
    - anchor: single helix barrel crossing the bilayer, label "anchor";
    - tail: below the membrane, a stack of beads — see control.

  THE ONE CONTROL. A three-way segmented control, "What is in the tail?":
    1. "CD3ζ only" — one bead in T-cell blue with three small notches on it (the three ITAMs). Caption chip: "signal 1 only".
    2. "CD28 + CD3ζ" — a green-cyan (#3DDC97) bead carrying a "+" glyph above the CD3ζ bead.
    3. "4-1BB + CD3ζ" — visually identical to option 2 but with a distinct glyph shape (a small square rather than a circle) and its own label, so the reader sees "a different second piece, same idea".
  Options 2 and 3 must produce the same outcome; the point is the presence of signal 2, not which molecule provides it.

  THE TEST. One button, "Meet a target cell". A cancer cell (violet-magenta #B65FD8, irregular, lumpy) slides in carrying small colored key-shapes standing on its membrane — clearly OUTSIDE, clearly not sitting in an MHC cup. Then a four-beat animation:
    beat 1 — the binder clamps a surface key; the membrane dimples slightly;
    beat 2 — the CD3ζ notches light up in sequence; chip reads "Signal 1: go";
    beat 3 — if a costimulatory bead is present it pulses and a second chip reads "Signal 2: divide, and survive". If not, a gray chip reads "No signal 2";
    beat 4 — lytic granules travel to the contact and the target cell shrinks and fragments (same visual grammar as the Chapter 5 kill figure). THEN, and this is the payoff: with signal 2, the T cell divides into two, both daughters keep their receptor, and both go looking for another target; without it, the T cell dims, slows, and stops moving.

  TWO METERS, labeled "illustrative, not measured":
    - "Kills on first contact" — effectively full for all three tails.
    - "Still alive and working weeks later" — near zero for CD3ζ only; high for both two-piece tails.
  One line of text under the meters, shown only after the first run: "This is the whole history of the field in one control: the first generation of these receptors had only the top option."

  PROGRESSIVE DISCLOSURE. On first load, only the receptor and the single control are visible; the meters appear after the first "Meet a target cell" run; the history line appears after that. Nothing animates until the reader presses the button.
  WRONG to show: the CAR binding a peptide held in an MHC cup; MHC as a requirement anywhere; the costimulatory piece outside the cell; a first-generation CAR containing CD28; signal 2 arriving from a second cell (it does not, and that is the chapter's point).
  Acceptable simplifications: one receptor instead of thousands; no ZAP-70/LAT cascade; no receptor dimerization; killing compressed into one beat.
  MOBILE: portrait viewBox, receptor centered, control as a full-width segmented bar below the stage, meters last. Keep in-SVG text to the four part labels and the two chips.
alt: An interactive cross-section of a T cell's membrane with a chimeric antigen receptor standing in it, labeled with its four parts. The reader chooses what sits in the receptor's signaling tail and then sends in a cancer cell. With signal 1 alone the cell kills once and then fades; adding a costimulatory piece makes it kill, divide and survive.
:::

:::figure ch10-journey
title: Vein to vein
goal: After using this, the reader understands that CAR-T is a manufacturing process wrapped around one person — about three weeks from blood draw to infusion — and that the drug's real expansion happens inside the patient, not in the factory.
kind: stepper
stage: light
spec: |
  ONE idea: the timeline, and where the expansion actually happens.

  A horizontal journey on a light (paper) stage with a persistent DAY COUNTER in large numerals at top left and a thin progress rail beneath. Days advance monotonically — never backwards. Two background zones: a "hospital" zone (left and right) and a "manufacturing facility" zone (middle), with a plane glyph marking each shipping leg. A standing caption under the title reads: "This example runs three weeks. Five is common."

  Nine steps, each a small vignette in the project's cell palette (T cells electric blue #4C8DFF, cancer cells violet-magenta #B65FD8, drugs gold). Only the current vignette is fully opaque; earlier ones stay on the rail at 35% opacity so the whole arc is visible.

  1. Day −21, hospital — leukapheresis. A seated patient silhouette (abstract, no face) linked to a machine: blood in, a bag of white cells out, red cells returned. A small inset shows the bag is a MIXTURE — T cells plus other white cells.
  2. Day −20, facility — the cold box arrives; T cells are separated from the mixture and meet activating beads. The cells visibly swell and begin to divide.
  3. Day −18, facility — gene transfer. A vector glyph labeled "disabled virus — carries the CAR gene, cannot copy itself" docks with a T cell; a gene ribbon enters and joins the cell's DNA. From here on, every blue cell wears a small CAR glyph.
  4. Days −17 to −6, facility — expansion and release testing. A culture vessel with a log-scale counter ticking from millions to hundreds of millions, then checklist chips appearing one by one: sterility, identity, potency, how many cells carry the CAR. Then a frozen vial. One chip can fail (see the toggle).
  5. Days −5 to −3, hospital — making room. Two drug glyphs labeled fludarabine and cyclophosphamide; the patient's existing white cells visibly thin out, leaving empty space. Meanwhile, in the facility lane, the plane glyph carries the frozen product back: draw the overlap, do not number it.
  6. Day −1, hospital — the frozen product arrives and is thawed at the bedside.
  7. Day 0 — infusion. One small bag, 10–100 mL, over a few minutes. Emphasize how anticlimactic it looks.
  8. Days 3 to 14 — the drug makes itself. This is the emotional center: a log-scale chart draws itself showing CAR-T cells in the blood rising a hundredfold or more and peaking around day 7–14, while a tumor-burden line falls. A shaded band labeled "when fever usually starts" covers the first week.
  9. Day 28 and beyond — response assessment, then a compressed axis jumping to months and years, with a thin persistent line of CAR-T cells, and a note that normal B cells are absent for months and in most patients return later.

  CONTROLS: Previous / Next / Play, keyboard arrows, and one toggle, "What can go wrong", which overlays amber annotations on steps 4 and 5: "manufacturing can fail, or fall short of the intended dose"; "patients can deteriorate while they wait, so bridging chemotherapy is often given"; "this chemotherapy itself causes low blood counts and infection risk".
  PROGRESSIVE DISCLOSURE: the day-8 chart draws only when that step is reached, and the toggle is off by default.
  WRONG to show: the day counter moving backwards; the product arriving after lymphodepletion has begun; B cells permanently absent.
  MOBILE: vertical timeline, day counter pinned at the top, one vignette per screenful, swipe or buttons to advance; the day-8 chart renders full width.
steps:
  1. Day −21. Blood is drawn from a vein and run through a machine that skims off white cells and returns the rest. This is leukapheresis, and it usually takes three to four hours. What comes out is a bag of mixed cells: the raw material.
  2. Day −20. The bag travels cold to a manufacturing facility that may be on another continent. T cells are separated out and woken up with artificial stimulation, because a resting T cell will not take up a new gene and a dividing one will.
  3. Day −18. A disabled virus, stripped of any ability to copy itself, carries the CAR gene into the T cells and inserts it permanently into their DNA. Every daughter cell will inherit it.
  4. Days −17 to −6. The cells are grown until there are hundreds of millions of them, then tested: Is the batch sterile? Is it really this patient's cells? What fraction carries the receptor? Does it kill? Then it is frozen. A small percentage of batches never pass.
  5. Days −5 to −3. Back at the hospital, the patient receives lymphodepleting chemotherapy — usually fludarabine and cyclophosphamide — which thins out their existing white cells to make room. The frozen product is flying back while this happens.
  6. Day −1. The product arrives at the hospital and is thawed at the bedside.
  7. Day 0. The infusion is a small bag over a few minutes. People are often surprised by how undramatic it looks.
  8. Days 3 to 14. Now the drug makes itself. The CAR-T cells find their target, divide, and expand a hundredfold or more, peaking somewhere around days 7 to 14 as the tumor falls. Fever, in most patients, starts in the first week. It is a sign the cells are active, not a measure of how well the treatment will work.
  9. Day 28 and beyond. Response is assessed at about a month. In some patients the engineered cells stay detectable for years. Normal B cells are usually gone for months; in most patients they eventually grow back, and the remission can outlast their absence.
alt: A step-by-step timeline of CAR-T treatment with a day counter, running from the blood draw about three weeks before treatment, through gene transfer and cell growth at a manufacturing facility, to chemotherapy that makes room, the infusion itself, and the hundredfold expansion of the engineered cells inside the patient during the first two weeks.
:::

:::figure ch10-crs
title: A fever you can switch off
goal: After playing with this, the reader understands that the fever of cytokine release syndrome is made by the patient's own macrophages responding to CAR-T activity — which is why blocking the IL-6 receptor can break the fever without switching off the therapy.
kind: simulation
stage: dark
spec: |
  ONE idea: the fever comes from the host's macrophages, so it can be blocked without blocking the treatment.

  LEFT (top on mobile) — the SCENE, a small patch of bone marrow: 20–40 cancer cells (violet-magenta #B65FD8, irregular), a handful of CAR-T cells (electric blue #4C8DFF with a small CAR glyph), and 3–5 macrophages (coral #FF7A6B, large, amoeboid, ruffled edges). CAR-T cells patrol, contact cancer cells, kill them (shrink and fragment), and divide. Each kill emits a few small blue signal dots (on hover: "IFN-γ, TNF"). When blue dots reach a macrophage, that macrophage swells, brightens, and starts emitting many coral dots labeled IL-6. The coral cloud must visibly dominate the scene: it should be obvious that the cloud filling the screen comes from the macrophages, not from the engineered cells.

  RIGHT (below on mobile) — TWO stacked plots sharing one x-axis (days 0–14), drawing in real time, labeled "illustrative time course":
    - "CAR-T cells in the blood" (log scale, blue): starts rising at about day 2, peaks day 7–14, then declines to a plateau.
    - "IL-6, and the patient's temperature" (coral line with a temperature band behind it): begins climbing about a day AFTER the blue curve starts rising, and peaks alongside it, not after it. The offset at the start is the whole point: the engineered cells move first, the host's cytokines follow.

  CONTROLS, three in total:
    - "Tumor burden": low | high. High burden means more kills, more macrophage activation, a far higher IL-6 and temperature peak. This causal chain is the figure's second-most-important beat and should be dramatic.
    - "Do nothing" | "Block the IL-6 receptor (tocilizumab)". When blocked: the macrophages keep making coral dots, but the dots visibly bounce off the temperature band, which falls back to normal within hours of simulated time — while the blue CAR-T curve KEEPS RISING and the killing in the scene continues. The reader should be able to say afterwards: "you can turn off the fever without turning off the drug."
    - Reset / replay.

  PROGRESSIVE DISCLOSURE: the scene runs first with only the blue cells visible; macrophages light up only once signal dots reach them; the plots draw as the simulation proceeds; the intervention button becomes available once the temperature band leaves the normal range.
  A single footer line: "Steroids also settle this syndrome, but unlike blocking the IL-6 receptor they can blunt the therapy — which is why they are not the first choice."
  WRONG to show: CAR-T cells as the main source of IL-6; the fever beginning before the CAR-T cells expand; IL-6 peaking after the CAR-T peak; tocilizumab killing CAR-T cells or binding IL-6 itself (it blocks the receptor); bigger fever implying better outcome.
  MOBILE: scene on top with a reduced cell count for performance, plots below at full width, controls in a sticky bar at the bottom.
alt: A simulation of cytokine release syndrome. CAR-T cells kill cancer cells in a patch of bone marrow and release signals that activate the patient's own macrophages, which flood the scene with IL-6. Two plots track the engineered cells and the patient's IL-6 and temperature, and the reader can block the IL-6 receptor and watch the fever settle while the killing continues.
:::

:::figure ch10-logic-gates
title: Giving a CAR-T cell a safety check
goal: After playing with this, the reader understands why one surface marker is rarely safe enough in solid tumors, how requiring two markers at once could spare healthy tissue — and why the narrower rule makes it easier for the tumor to escape by dropping a marker.
kind: simulation
stage: dark
spec: |
  ONE idea: requiring two markers buys safety and costs escape resistance.

  A single field of tissue on a dark stage, about 48 cells, in two populations distinguished by SHAPE as well as color, each named once in a legend:
    - TUMOR cells: violet-magenta (#B65FD8), irregular lumpy outline, carrying antigen A (small square glyph) AND antigen B (small triangle glyph).
    - HEALTHY LUNG cells: sand (#E9C9A1), calm rounded polygon, carrying antigen A only.
  CAR-T cells (electric blue #4C8DFF) enter from one edge and patrol.

  CONTROL 1 — "Targeting rule", two options:
    1. "Attack A" — every A-bearing cell dies: all tumor cells AND all healthy lung cells. The healthy-damage meter fills to crimson. This is today's single-target CAR.
    2. "A AND B" — a two-step sequence, drawn explicitly: a CAR-T cell meets A, an inner glyph lights and a chip reads "armed by A — now hunting B", there is a visible PAUSE of about a second (the real mechanism requires the cell to switch on a new gene, which takes hours), and only then can it kill a cell carrying B. Tumor cells die; the healthy population survives untouched.

  CONTROL 2 — "Antigen loss", a slider from 0% to 40%: that fraction of tumor cells is drawn WITHOUT antigen B, keeping A. Under the "A AND B" rule those cells visibly survive, keep dividing, and repopulate the field over about twenty seconds. A small population chart along the bottom tracks tumor cells over time and makes the relapse unmistakable. Under "Attack A" they die — the blunt rule has this one advantage, and the figure should let the reader discover the trade-off themselves rather than captioning it away.

  METERS: "tumor cells remaining" and one "healthy tissue damage" bar, both always visible.
  PROGRESSIVE DISCLOSURE: the antigen-loss slider is disabled until the reader has run both targeting rules once.
  A permanent footer chip: "Two-marker CAR-T cells are experimental. Every approved product today uses a single target."
  WRONG to show: two-marker logic as approved therapy; the second step as instantaneous; healthy cells spared because they are "healthy" rather than because of the specific markers they carry.
  MOBILE: portrait grid of about 36 cells; targeting rule as a full-width segmented control; meters stacked below.
alt: A field of tumor cells carrying two surface markers and healthy lung cells carrying one of them. The reader chooses whether the engineered T cells attack any cell with the first marker, or only cells carrying both, and watches which cells die. A slider then removes the second marker from some tumor cells, showing how the tumor escapes the stricter rule.
:::


# ===== 11-vaccines (4 figures) =====

:::figure ch11-hpv
title: The earlier, the better
goal: After using this, the reader understands that HPV vaccination has sharply reduced cervical cancer in real populations, and that the benefit is greatest when the vaccine is given before any exposure to the virus (age 12–13), because it prevents infection rather than curing it.
kind: chart
stage: light
spec: |
  PURPOSE. Real population data, made tangible. Three datasets, one per country; the reader switches between them and sees how much cervical cancer was prevented at each vaccination age. Keep it to one idea: earlier is better.

  LAYOUT (desktop, ≥ 760px). Top row: a segmented control with three options, "England" (default), "Sweden", "Scotland". Below it, the chart panel. In the England view only, a second panel sits to the right of the chart (~40% width): a 10 × 10 grid of 100 small circles titled "Out of every 100 cervical cancers expected without vaccination…". Below everything: a one-line dataset note (small, ink-2), a whisker legend, and a persistent "why age matters" footnote.

  WHISKER LEGEND (verbatim, small, next to a sample whisker glyph): "Thin line = range of plausible values (95% confidence interval)."

  ENGLAND VIEW (default). Three horizontal bars, one per age at which the vaccine was offered, labeled "Offered at 12–13", "Offered at 14–16", "Offered at 16–18" (top to bottom). Bar length = percent reduction in cervical-cancer rate versus earlier, unvaccinated cohorts: 87, 62, 34. Draw each 95% confidence interval as a thin whisker (ink-2) over the bar end: 72–94, 52–71, 25–41. X-axis 0–100%, labeled "Fewer cervical cancers". Print the value at the bar end ("87%").
  Precancer data appear only in each bar's tooltip, as a second line: "Precancer (CIN3): 97% fewer (96–98)" / "75% fewer (72–77)" / "39% fewer (36–41)". No toggle.
  Dataset note: "Bivalent vaccine, introduced in 2008. Women aged 20–29, data to mid-2019. Source: Falcaro et al., Lancet 2021."

  UNIT GRID (England view only). The grid reflects the currently selected bar (default: "Offered at 12–13"). Circles are drawn in a solid accent fill for cancers that still occurred and as faint outlines with a small check mark for cancers prevented. Still occurring: 13 / 38 / 66 for the three bars. When the selection changes, circles change state with a gentle left-to-right, row-by-row stagger (~400 ms total). Under the grid, a computed label: "13 still occurred · 87 prevented". Never rely on fill color alone: prevented circles must also carry the check mark and be outline-only.

  SWEDEN VIEW. Two bars: "Vaccinated before age 17" = 88% fewer (whisker 66–100) and "Vaccinated at 17–30" = 53% fewer (whisker 25–73). No grid; the chart takes the full width. Dataset note: "Quadrivalent vaccine. 1.7 million girls and women aged 10–30 followed 2006–2017; 19 cancers among vaccinated and 538 among unvaccinated women (rates, adjusted for age and family background, are compared). Source: Lei et al., NEJM 2020."

  SCOTLAND VIEW. This study reports rates, not reductions, so the axis changes to "Cervical cancers per 100,000 women per year" (0–10). Three bars: "Not vaccinated" 8.4 (whisker 7.2–9.6); "Vaccinated at 14–22, three doses" 3.2 (whisker 2.1–4.6); "Vaccinated at 12–13, any number of doses" drawn as a zero-length bar with a bold label "No cases recorded" (no whisker; do not invent an interval). To the right, a large, quiet numeral "0" with the text (verbatim): "cases recorded among women vaccinated at 12 or 13. With so few of them yet old enough for cervical cancer, zero is not the same as no risk." Dataset note: "Bivalent vaccine. Women born 1988–1996; data extracted July 2020, when those vaccinated at 12–13 were in their mid-twenties. Source: Palmer et al., JNCI 2024."

  FOOTNOTE (all views, reader-facing, verbatim): "Why age matters: the vaccine prevents infection but cannot clear an infection that is already there, so it protects best when given before any exposure to the virus."

  INTERACTION. Segmented control is keyboard-operable (arrow keys). Bars are focusable (Tab / arrow keys) and hoverable; focusing or tapping a bar selects it, updates the grid (England), and shows a tooltip with the exact value, the 95% CI and the short source ("Falcaro 2021"). Announce selection changes in an ARIA live region (e.g., "Offered at 14–16: 62% fewer cervical cancers; 38 of 100 expected cancers still occurred").

  STYLE. Light stage. One hue (accent indigo) for bars; the selected bar is darker and outlined, with a bold label. Whiskers in ink-2. No gridlines beyond a light 0/50/100 reference.

  MOBILE (< 600px). Stack vertically: segmented control (full width), bars (full width; each bar's label sits above it), unit grid (England only; 10 × 10, ~16–18px circles, centered), then legend and notes. Keep all text ≥ 14px.

  ACCURACY NOTES FOR THE BUILDER. These are reductions in rates among young women, not lifetime risk; never label them "lifetime". The age groups are separate cohorts, so do not join bars with lines. The three countries used different vaccines, methods and metrics; do not place them on one shared axis.
data: |
  England — Falcaro M et al., Lancet 2021;398:2084-92 [^7]. Bivalent vaccine; women aged 20 to <30; registry data to 30 June 2019. Relative reduction vs unvaccinated reference cohort (95% CI):
    Offered at 12–13: cervical cancer 87% (72–94); CIN3 97% (96–98)
    Offered at 14–16: cervical cancer 62% (52–71); CIN3 75% (72–77)
    Offered at 16–18: cervical cancer 34% (25–41); CIN3 39% (36–41)
  Sweden — Lei J et al., NEJM 2020;383:1340-8 [^6]. Quadrivalent vaccine; fully adjusted incidence rate ratios (95% CI) converted to % reduction = (1 − IRR) × 100:
    Vaccinated before 17: IRR 0.12 (0.00–0.34) → 88% (66–100)
    Vaccinated at 17–30: IRR 0.47 (0.27–0.75) → 53% (25–73)
  Scotland — Palmer TJ et al., JNCI 2024;116:857-65 [^1]. Bivalent vaccine; invasive cervical cancer per 100,000 person-years (95% CI):
    Unvaccinated: 8.4 (7.2–9.6)
    Vaccinated at 14–22 with 3 doses: 3.2 (2.1–4.6)
    Vaccinated at 12–13 (any number of doses): no cases recorded
alt: A bar chart of HPV-vaccine effects in three countries. In England, cervical cancer among women in their twenties fell by 87% for those offered the vaccine at 12–13, 62% at 14–16 and 34% at 16–18. In Sweden, vaccination before 17 was linked to an 88% lower cancer rate and vaccination at 17–30 to a 53% lower rate. In Scotland, no cervical cancers were recorded among women vaccinated at 12 or 13, compared with 8.4 per 100,000 women per year among unvaccinated women.
:::

:::figure ch11-four-fixes
title: Four weak links
goal: After using this, the reader understands a useful framework (not a settled verdict) for why most early therapeutic vaccines failed: success seems to need four things at once (a target the immune system is not tolerant to, a strong enough alarm, a small enough tumor, and released brakes), and early vaccines often broke several of these links simultaneously.
kind: explorer
stage: dark
spec: |
  PURPOSE. A "switchboard" that makes the framework tangible: the reader flips four switches and watches two linked scenes change. The outcome is a cartoon of the logic, not a quantitative model, and not an explanation of any specific trial; say so on screen.

  LAYOUT (desktop). Two scene panels side by side, each ~half width, on the dark stage:
  - LEFT, titled "Lymph node: training". A dendritic cell (green, star-shaped, long dendrites) at center-left holds up MHC molecules (pale silver cups) loaded with a peptide bead. To its right, a loose crowd of ~12 small, round, naive CD8 T cells (blue, with TCR glyphs). A thin "fit" indicator appears where the matching T cells touch the dendritic cell.
  - RIGHT, titled "Tumor: the fight". A tumor of violet-magenta cancer cells (irregular, lumpy). Each cancer cell carries 1–2 small PD-L1 glyphs (crimson bar with a minus icon). Trained T cells enter from the left edge of this panel. No other cell types: keep the scene simple.
  Below the scenes: four labeled two-position switches in a row, then a three-part outcome strip, then two preset buttons, then the disclaimer.
  MOBILE (< 600px): scenes stack vertically (lymph node above tumor), each ~16:10; switches become a 2 × 2 grid; outcome strip and presets below. Text ≥ 14px.

  THE FOUR SWITCHES (labels verbatim; default state = left option, i.e., the "old vaccine" configuration):
  1. "Target": "Shared tumor protein" | "Tumor mutations (neoantigens)"
  2. "Alarm": "Weak" | "Strong"
  3. "Tumor at vaccination": "Large, spread" | "Microscopic, after surgery"
  4. "Brakes": "On" | "Released (anti-PD-1)"

  WHAT EACH SWITCH CHANGES (animate transitions ~600–900 ms; keep motion calm):
  1. Target. Shared tumor protein: the peptide bead is sand-colored (self). Only 2 of the naive T cells approach; their TCR–peptide contact shows a loose fit (a visible gap in the glyph) and a dim glow. Neoantigens: the bead is hot pink (neo-peptide). 4 T cells approach with a snug, glowing fit.
  2. Alarm. Weak: the dendritic cell is dim; no costimulation icons. Matching T cells barely multiply (each matched cell yields at most one copy). Strong: the dendritic cell brightens; small green-cyan "+" icons (signal 2) appear at each contact; matched T cells multiply by "photocopying" (each splits into several copies over ~1.5 s).
  The number of trained T cells that then travel to the tumor panel is set by switches 1 and 2 together: shared + weak → 1; shared + strong → 3; neo + weak → 3; neo + strong → 8. T cells trained on the shared protein keep their dim, loose-fit look in the tumor too.
  3. Tumor at vaccination. Large: ~50 cancer cells packed into a mass. Microscopic: ~6 scattered cancer cells. (Fade between states.)
  4. Brakes. On: when a T cell touches a cancer cell, a PD-L1 glyph engages it (crimson bar), the T cell dims and stops (a small pause icon). Released: gold Y-shaped antibodies (white-outlined) sit on the T cells' PD-1, the PD-L1 contacts are blocked, and the T cells kill: the touched cancer cell shrinks and fragments (apoptosis), then the T cell moves on to the next.

  OUTCOME STRIP. Three qualitative indicators, no numbers:
  - "T cells trained": a row of up to 8 small blue dots, filled to the count above.
  - "Fit to target": "Loose" or "Snug" (text plus icon).
  - "Outcome (cartoon)": one of three tiers, shown as text with an icon:
    Tier 0 (icon: empty circle): "Little or no effect on the tumor."
    Tier 1 (icon: half circle): "An immune response, but no clear benefit from the vaccine."
    Tier 2 (icon: full circle): "The combination now in trials: early results suggest fewer relapses than anti-PD-1 alone, but this is not yet proven."
  OUTCOME RULE (implement exactly; it encodes the framework):
    Priming score P: Shared + Weak = 0; Shared + Strong = 1; Neoantigens + Weak = 1; Neoantigens + Strong = 2.
    Killing score K: Large + Brakes on = 0; Large + Released = 1; Microscopic + Brakes on = 1; Microscopic + Released = 2.
    Tier = min(P, K).
  In the tumor scene, mirror the tier: tier 0, the trained T cells stall and the tumor visibly keeps growing (add a few cancer cells by budding); tier 1, the T cells kill one or two cancer cells and the rest persist; tier 2, the T cells clear most of the scattered cells (microscopic case; leave one survivor) or a part of the mass.

  MICRO-CAPTIONS (reader-facing, verbatim). When a switch changes, show its caption under the scenes for its new state:
  - Shared tumor protein: "T cells that fit proteins the body already makes are rarer and usually bind more loosely; many of the best-fitting ones were deleted in the thymus."
  - Tumor mutations: "The mutation is new to the body, so T cells that fit it snugly were never deleted."
  - Weak: "Without a strong danger signal, dendritic cells give T cells signal 1 but not signal 2. Few T cells multiply."
  - Strong: "A strong adjuvant fully activates the dendritic cells, and matching T cells multiply."
  - Large, spread: "Billions of cancer cells, skilled at hiding: the newly trained T cells are outnumbered."
  - Microscopic, after surgery: "After surgery, only scattered cancer cells remain, and the T cells can outnumber them."
  - Brakes on: "Cancer cells display PD-L1, which engages the PD-1 brake on T cells and stops them."
  - Released: "Anti-PD-1 antibodies block the brake, and the T cells keep killing."

  PRESETS (two buttons; each sets all four switches, then shows its caption verbatim in a caption box):
  A. "A typical 1990s vaccine" → Shared, Weak, Large, On (tier 0). Caption: "Peptides from normal proteins, a mild adjuvant, and patients with advanced disease. In one large tally of such trials, fewer than 3 in 100 patients saw their tumors shrink."
  B. "Personal mRNA vaccine + anti-PD-1 after surgery" → Neoantigens, Strong, Microscopic, Released (tier 2). Caption: "Neoantigens, mRNA, early disease and released brakes. In a 157-patient melanoma trial, relapses were less common with the vaccine than with anti-PD-1 alone, a borderline result. In 2026 the companies reported that a larger trial had also met its main goal; full data were not yet published."

  DISCLAIMER (always visible, small, ink-3, verbatim): "A cartoon of a framework, not a simulation of any real trial. Anti-PD-1 after surgery lowers the risk of relapse on its own; trials measure what a vaccine adds. Real outcomes depend on many more factors."

  ACCESSIBILITY & MOTION. Switches are native toggle buttons (aria-pressed) with visible focus; captions go to an ARIA live region. Under prefers-reduced-motion, jump directly to each end state with a quick cross-fade and no budding/killing animation. Pause all motion when the figure is off-screen.

  SCIENTIFIC GUARDRAILS. Dendritic cells present peptides on MHC; they do not kill. T cells recognize a peptide held in an MHC cup, never a free-floating protein. Antibodies (gold Ys) bind PD-1 on the T cell (anti-PD-1); do not draw them on cancer cells.
alt: An interactive switchboard with two scenes, a lymph node where a dendritic cell trains T cells and a tumor where those T cells fight. Four switches set the vaccine's target (a shared tumor protein or tumor mutations), the strength of its alarm, the size of the tumor when vaccinating, and whether PD-1 brakes are released. In this cartoon framework, only when all four are favorable do many well-fitting T cells reach a small tumor and keep killing; presets compare a 1990s peptide vaccine with today's personalized mRNA approach.
:::

:::figure ch11-personal-vaccine
title: Design a personal vaccine
goal: After using this, the reader understands that choosing neoantigens means weighing how well a fragment is predicted to fit the patient's own HLA molecules and whether it stands out from normal, plus clonality; that the same mutation can be useful for one patient and useless for another; and that because predictions are imperfect, a vaccine needs several targets, ideally ones shared by every cancer cell.
kind: explorer
stage: dark
spec: |
  PURPOSE. A small design game in four phases (a stepper wraps the game; see steps). The reader picks up to four mutations from eight, "makes" the vaccine, sees which picks actually triggered T cells, and then sees which parts of the tumor were covered and which grew back. All data are illustrative (fixed table below), not real predictions; show a small "Illustrative data" tag in the corner.

  LAYOUT (desktop).
  - TOP-LEFT: "Tumor family tree". A simple tree: a thick trunk labeled "Trunk: in every cancer cell" splitting into two branches labeled "Branch B (55% of cells)" and "Branch C (45%)". Each branch has its own subtle hue variant of the cancer violet-magenta, plus a letter label (never color alone).
  - TOP-RIGHT: "The tumor". ~60 cancer cells (violet-magenta, irregular) packed into a mass; 33 belong to branch B and 27 to branch C, in two intermixed patches. Each cell carries a tiny letter mark (B/C) visible on hover/zoom; patch boundaries faintly outlined.
  - MIDDLE: "Whose tumor?". A two-position toggle: "Patient 1" | "Patient 2", each illustrated by a small shop window (a row of six pale-silver MHC cups) whose cup shapes differ visibly between the two patients. (Optional: allele names such as A*02:01 appear only in a tooltip.) Micro-caption (verbatim): "Same tumor, different HLA types: a thought experiment. Each person's HLA molecules hold different fragments, so the predictions change."
  - BOTTOM: eight candidate cards in a 4 × 2 grid, and a "vaccine" bar with four empty slots shaped like beads on a strand, plus a primary button "Make & test" (enabled once at least one card is chosen).

  EACH CARD shows:
  - Name: "Mutation 1" … "Mutation 8".
  - Location chip: "Trunk", "Branch B" or "Branch C".
  - A 9-letter peptide string in monospace with the mutated letter highlighted (hot pink, bold, underlined). Use the strings in the table.
  - "Predicted fit to this patient's HLA": a horizontal bar 0–100 (updates with the patient toggle; animate 400 ms).
  - "Stands out?": "Yes" (check icon) or "No" (dash icon). Tooltip (verbatim): "Yes = the tumor makes plenty of this protein, and the mutant fragment looks clearly different from the normal one."
  Tapping a card toggles it into/out of the vaccine (max 4; a fifth tap shows "The vaccine is full. Remove one first."). Selected cards get a glowing outline and a slot number.

  DATA (fixed). "Stands out?" is a property of the mutation and does not change with the patient; fit scores and the hidden T-cell outcome do.
  | # | Location | Peptide (mutant letter in brackets) | Stands out? | Fit, Patient 1 | T cells respond, Patient 1 | Fit, Patient 2 | T cells respond, Patient 2 |
  | 1 | Trunk | K M F E [W] L G R V | Yes | 85 | YES | 20 | No |
  | 2 | Trunk | V Y R D [P] T Q L F | Yes | 30 | No | 86 | YES |
  | 3 | Trunk | A L S E [Y] K N I L | No | 88 | No | 70 | No |
  | 4 | Branch B | F L D [C] R V E T M | Yes | 82 | YES | 35 | No |
  | 5 | Branch B | Q T W P [H] L A K Y | Yes | 60 | No | 84 | YES |
  | 6 | Branch B | N V L K [F] S Y R L | Yes | 25 | No | 70 | No |
  | 7 | Branch C | G L [W] T E A F K V | Yes | 78 | No | 30 | No |
  | 8 | Branch C | R Y T [D] L V N Q I | Yes | 45 | YES | 88 | YES |
  Design intent (do not show): each patient has exactly three successes out of eight (about one in three) and exactly one successful trunk mutation (1 for Patient 1, 2 for Patient 2), so a reader who prioritizes trunk mutations with a good fit that stand out can cover every cancer cell. Row 3 fits well but fails because it does not stand out; row 7 (Patient 1) and row 6 (Patient 2) are honest prediction misses; row 8 (Patient 1) is a surprise success.

  PHASE FLOW (the stepper's four steps; captions below are verbatim):
  Step 1 ("Read the tumor"): tree and tumor animate in; cards appear face up; selection disabled; a "Next" button.
  Step 2 ("Choose"): selection and patient toggle enabled. Switching patient clears the current selection (show a one-line notice: "Same tumor, different HLA types: choose again.").
  Step 3 ("Make & test"): pressing "Make & test" animates the chosen peptides sliding into their bead slots and the strand being wrapped in a small fatty sphere (~1.2 s). Then each chosen card flips: successful ones show a blue T-cell icon with "T cells responded" and glow; failures show a grey "No response". A summary line (computed): "{k} of your {n} picks triggered a T-cell response." Then, verbatim: "This game is kinder than reality. Here about one mutation in three works; in one pancreatic-cancer vaccine study, about one target in nine drew a T-cell response strong enough to detect directly in blood. That is why real vaccines carry up to 20 or 34 targets, not four."
  Step 4 ("Months later"): 3–4 blue T cells arrive; then most cells carrying at least one successful mutation (trunk = all cells; Branch X = cells of that branch) get a blue outline and shrink and fade (apoptosis), ~1.5 s, staggered. Leave 2–3 outlined cells alive inside the cleared patches (they stay outlined but intact). Cells with no successful target remain; if a branch is untouched, its cells then slowly multiply (budding) to refill part of the space (~2 s). Outcome message (computed, verbatim templates):
    - All branches covered: "Every cancer cell carried at least one target the T cells recognized."
    - Some covered: "T cells attacked the branches they could see. Branch {X} carried none of your successful targets, and grew back."
    - None covered: "None of your picks triggered T cells. In real trials, too, some patients' vaccines produce no detectable response."
  Then always, verbatim: "Even cells with a recognized target are not all killed: some stop displaying it, and some sit where T cells cannot work. Covering every branch helps; it does not guarantee a cure."
  A "Try again" button returns to step 2 with the same patient; a "Reset" returns to step 1.

  MOBILE (< 600px). Stack: tree (compact, ~120px tall) → tumor (square, ~260px) → patient toggle with the two small shop windows → vaccine bead bar, sticky at the bottom of the figure while choosing → cards in a 2-column grid (4 rows). Each card: name and location on one line, peptide on the next, then the fit bar, then the "Stands out?" icon. Tap targets ≥ 44px.

  ACCESSIBILITY. Cards are buttons (aria-pressed) reachable by Tab; selection count and phase results are announced in an ARIA live region. Under prefers-reduced-motion, replace flips and apoptosis with instant state changes and a brief highlight.

  SCIENTIFIC GUARDRAILS. Show peptides as short strings (8–11 letters; here 9), never whole proteins. Do not imply that one mutation equals one "drug". The mRNA "strand" should read as one strand carrying several segments in a row. Do not show the vaccine acting directly on cancer cells: the effect in step 4 is due to T cells. Branches are nested: every cell has the trunk mutations plus the mutations of exactly one branch.
steps:
  1. Read the tumor. Sequencing has found eight mutations that change a protein. Every cancer cell carries the three "trunk" mutations; the others belong to just one branch of the tumor's family tree.
  2. Choose up to four. Each card shows how well a mutant fragment is predicted to fit this patient's HLA molecules, and whether it stands out: plenty of the protein, and clearly different from the normal version.
  3. Make and test. Your picks are strung together on mRNA and given as a vaccine. Some trigger T cells and some don't, often in ways the predictions missed.
  4. Months later. T cells attack the cancer cells that carry a target they recognize. Any branch without a recognized target can grow back.
alt: An interactive design game. A tumor made of two branches shares three "trunk" mutations in every cell plus branch-specific mutations; the reader chooses up to four of eight candidate mutations, each scored for predicted fit to the patient's HLA molecules and for whether it stands out from normal. After "vaccination", only some picks trigger T cells, and any branch without a recognized target grows back. Switching to a patient with different HLA types changes the predictions, showing why each vaccine must be personal.
:::

:::figure ch11-oncolytic
title: A virus that turns a tumor into a vaccine
goal: After using this, the reader understands that an oncolytic virus multiplies in cancer cells whose antiviral alarm is broken, bursts them, and releases tumor proteins and danger signals that let dendritic cells prime T cells, which then attack cancer cells elsewhere too, including, less reliably, tumors the virus never reached.
kind: simulation
stage: dark
spec: |
  PURPOSE. Show the two-step logic of oncolytic therapy: (1) selective killing by the virus, (2) an immune response that outreaches the virus. A short, self-running simulation with a guided caption track (the steps below appear as the simulation reaches each phase) and two controls.

  LAYOUT (desktop, landscape viewBox ~16:9).
  - LEFT (~55% width): "Injected tumor". ~25 cancer cells (violet-magenta, irregular, lumpy, large misshapen nuclei) in a central mass, surrounded by ~12 healthy cells (sand, calm rounded polygons, neat round nuclei) at the edges. A thin blood-vessel band along the bottom edge.
  - TOP-RIGHT (~45% width, upper third): "Lymph node", a bean-shaped outline containing ~6 small resting T cells (blue, dim).
  - BOTTOM-RIGHT (~45% width, lower two thirds): "Distant tumor (not injected)", ~12 cancer cells.
  - Faint dotted paths connect the injected tumor to the lymph node and the lymph node to both tumors (lymph and blood routes; schematic).
  - Overlay counters (HTML, top-left of stage): "Cancer cells left — injected tumor: n / 25 · distant tumor: n / 12". A small day-scale label: "Time compressed: real events take days to weeks."
  - Controls below the stage: primary button "Inject virus" (becomes "Replay" after a run); toggle "Cancer cells' antiviral alarm: Broken (common) | Working"; a "Pause/Play" button. Under prefers-reduced-motion, replace the simulation with a stepper (Back/Next) that shows the end state of each step.
  MOBILE (< 600px): portrait viewBox. Stack: injected tumor (top, ~45% height), lymph node (thin strip, ~15%), distant tumor (bottom, ~40%). Counters move below the stage. Controls full width.

  ELEMENTS & LOOKS (use the shared art library where available):
  - Virus: tiny red-coral icosahedron with short spikes. Real viruses are ~100× smaller than cells; draw them ~1/10 of a cell's diameter and state in step 1 that they are enlarged.
  - Interferon alarm: a soft, sand-colored halo with a small shield icon around a defended cell; tiny sand-colored dots drift from it to neighbors, which get a fainter halo.
  - Tumor proteins released on bursting: hot-pink beads (neo/foreign peptide color).
  - Danger signals: small, pale-gold sparks (distinct shape from the beads: four-point stars).
  - Dendritic cells: green, star-shaped with long dendrites; 3 of them.
  - T cells: blue, round, small, fine microvilli fuzz, TCR glyphs.
  Target ≤ ~150 moving objects at peak; use Canvas 2D for particles with an SVG/HTML overlay for labels if needed.

  SEQUENCE ("Broken" alarm, default). Each phase triggers its step caption.
  Phase 1 (0–3 s): A syringe glyph at the left edge of the injected tumor releases ~20 virions that diffuse into the mass.
  Phase 2 (3–9 s): Virions that touch a HEALTHY cell enter it; the cell lights its interferon halo (shield icon), the virion inside fades out, and sand dots drift to 2–3 neighbors, which get faint halos and repel further entry. Virions that touch a CANCER cell enter it; dots multiply inside (1 → ~8 over ~2 s); the cell swells slightly.
  Phase 3 (6–14 s, overlapping): A full cancer cell bursts (membrane breaks into fragments that fade), releasing ~6 new virions, ~5 pink beads and ~4 gold sparks. New virions infect adjacent cancer cells, so a wave of bursting spreads through the mass. Stop the wave once ~16 of 25 cancer cells have burst. Some cancer cells at the far side are never reached; leave them. Remaining free virions slowly fade.
  Phase 4 (12–20 s): The 3 dendritic cells drift in from the edges, touch pink beads (beads attach to them), and then travel along the dotted path to the lymph node. In the node, 2 of the resting T cells brighten on contact and "photocopy" into ~8 blue T cells.
  Phase 5 (20–32 s): T cells travel along the dotted paths: ~5 into the injected tumor, ~3 into the distant tumor. A T cell that touches a cancer cell attaches briefly; the cancer cell shrinks and fragments (apoptosis), and the T cell moves on. End state: injected tumor ~5 of 25 cancer cells left; distant tumor ~9 of 12 left (the distant effect is real but modest).
  End: a "Replay" button appears.

  SEQUENCE ("Working" alarm). Same start, but cancer cells react like healthy cells: halo, shield, virus fades. At most 2 cancer cells burst, releasing few beads; 1 dendritic cell makes the trip; in the node only ~3 T cells form; they kill 1–2 cells in the injected tumor and none in the distant tumor. End state ~22 / 25 and 12 / 12. Show the alternative caption (verbatim): "If the cancer cells' alarm still works, they shut the virus down too: little bursting, few released proteins, and only a weak T-cell response."

  FINAL NOTE (verbatim, shown under the stage after any run): "In the trial behind T-VEC's approval, injected deposits shrank by at least half in about two thirds of cases, uninjected deposits in the skin and lymph nodes in about a third, and tumors in internal organs in about one in seven. Many patients do not respond at all."

  ACCESSIBILITY. Captions go to an ARIA live region. All controls keyboard-operable. Animation pauses when off-screen or when the tab is hidden.

  SCIENTIFIC GUARDRAILS. Healthy cells are not invulnerable to entry; they are protected because they detect the virus and shut it down. Dendritic cells do not kill; they carry and present. T cells kill cancer cells displaying tumor peptides, not because they "see the virus". The distant tumor must contain no virus at any point. Do not show 100% clearance in either tumor.
steps:
  1. An engineered virus is injected into one tumor. Viruses are far smaller than cells; here they are drawn much larger so you can see them.
  2. Healthy cells sound their interferon alarm, shut the virus down and warn their neighbors. Many cancer cells have lost this alarm, so the virus multiplies inside them.
  3. Infected cancer cells burst, releasing new viruses along with the tumor's own proteins and danger signals. The tumor has become a vaccine.
  4. Dendritic cells collect the tumor proteins and carry them to a lymph node, where T cells that match them multiply.
  5. The new T cells patrol the body. They attack cancer cells in the injected tumor and, less often, in a distant tumor the virus never reached.
alt: An animation of oncolytic virus therapy. Virus injected into one tumor is shut down by healthy cells, which raise an interferon alarm, but multiplies in cancer cells that lack the alarm, bursting them and releasing tumor proteins and danger signals. Dendritic cells carry those proteins to a lymph node, T cells multiply, and the T cells kill most cancer cells in the injected tumor and a few in a distant, uninjected tumor. If the cancer cells' alarm works, little happens.
:::


# ===== 12-frontier (4 figures) =====

:::figure ch12-resistance
title: Where the cycle breaks
goal: After using this, the reader understands that "resistance" is a family of distinct failures, each breaking a specific step of the cancer-immunity cycle, and that releasing the PD-1 brake mainly repairs one of them.
kind: explorer
stage: dark
spec: |
  OVERVIEW. A wheel (the 7-step cancer-immunity cycle) plus a close-up "vignette" panel. The reader picks one of SEVEN
  resistance mechanisms (matching the seven paragraphs of the main text); the wheel shows which step(s) it breaks,
  the vignette animates what happens at cell level, and an "Add anti-PD-1" switch shows whether releasing the brake
  helps.

  REUSE. Render the wheel with the Chapter 7 module ch07-cycle (same node order, glyphs, one-word labels — 1 Release,
  2 Presentation, 3 Priming, 4 Trafficking, 5 Infiltration, 6 Recognition, 7 Killing — location bands, flowing dots
  and ⊣ break styling) so readers recognize it. This figure needs TWO OR MORE steps broken at once and a "weak"
  (partial) break state; if ch07-cycle's controller only supports breakStep(n), add or request breakSteps([{step,
  severity:'broken'|'weak'}]) from the ch07-cycle owner rather than forking the wheel.

  LAYOUT — DESKTOP (stage max-width ~960px, aspect ~16:10):
  - Left ~55%: the wheel.
  - Right ~45%: THE VIGNETTE, a rounded dark panel (4:3) with an animated close-up for the selected mechanism.
    Directly under it: a switch labelled "Add anti-PD-1" and an OUTCOME BADGE (icon + text).
  - Under both: CAPTION area (aria-live="polite") showing the verbatim caption for the selected chip (see steps).
  - Bottom: SEVEN MECHANISM CHIPS as a radiogroup (4 + 3 grid). Each chip: short title + one-line subtitle.

  CHIPS (title — subtitle — steps marked on the wheel):
  1. Brake on — "PD-L1 switches T cells off" — step 7 broken. Selected by default on load.
  2. Nothing new to see — "Few neoantigens, or lost ones" — steps 1 and 6 broken.
  3. Shop window shut — "B2M loss: no MHC class I" — step 6 broken.
  4. Deaf to the alarm — "JAK1/2 loss: interferon ignored" — steps 6 and 7 broken.
  5. Walled off — "Stroma and TGF-β keep T cells out" — step 5 broken, step 4 weak.
  6. No scouts, corrupt guards — "Too little priming; suppressive cells" — steps 2 and 3 broken, step 7 weak.
  7. Host factors — "HLA genes, gut microbes, medicines" — no single node breaks; a translucent halo surrounds the
     wheel, densest near steps 2–3 with a second, fainter density near step 6.

  WHEEL RESPONSE ON SELECT: broken node(s) get a crimson (#E5484D) outline plus the ⊣ glyph; flow dots stop and pile
  up before the first broken step; downstream nodes fade to ~40%. "Weak" steps use a dashed crimson outline and the
  word "weak" (no new colors). Center status text: "Stalled at step N: <name>" (first broken step clockwise from 1).

  ANTI-PD-1 SWITCH: resets to OFF whenever a chip changes. When ON, gold antibody "Y" shapes with a white outline drift
  into the vignette and bind PD-1 knobs on T cells (never on cancer cells). The OUTCOME BADGE is binary in its icon
  and nuanced in its words (icon + text; never color alone):
  1 "✓ Fixed — the T cell kills" (green-cyan #3DDC97; step 7 un-breaks, flow resumes)
  2 "✕ Not fixed — little to recognize"
  3 "✕ Usually not fixed — killer T cells can't see the cell (other immune cells sometimes can)"
  4 "✕ Usually not fixed — the tumor ignores the alarm"
  5 "✕ Not fixed — T cells still can't get in"
  6 "✕ Not fixed — too few T cells primed, and other suppressors remain" (the dashed step-7 ring brightens a little)
  7 "Varies from person to person" (neutral icon "~")

  VIGNETTES (each a 6–10 s gentle loop; reduced motion = final frame only, no loop):
  1 Brake on: a blue CD8 T cell (#4C8DFF, fine microvilli, TCR glyphs) docks to a violet cancer cell (#B65FD8, lumpy).
    The cancer cell has silver MHC cups (#D9DEEA) holding hot-pink neo-peptide beads (#FF3D7F). The TCR touches a pink
    bead (soft white contact flash). Small PD-L1 knobs on the cancer cell meet PD-1 knobs on the T cell → crimson minus
    icon pulses; the T cell's granules stay dim; it lets go. With anti-PD-1: gold Ys cap the PD-1 knobs; granules
    move to the contact point; the cancer cell blebs into small round fragments (apoptosis); the T cell moves on.
  2 Nothing new to see: a cluster of 8 cancer cells; 5 show pink beads, 3 show only sand-colored self beads (#E9C9A1)
    and also carry a dotted rim (so the difference is not color-only). T cells kill the 5 pink-bead cells one by one;
    the 3 survivors divide and refill the cluster. Corner counter: "cells showing a typo: 5 → 0". With anti-PD-1:
    T cells move a little faster but find no targets.
  3 Shop window shut: a cancer cell's MHC cups fade and sink until none remain (label: "no B2M → no MHC class I on the
    surface"). A blue CD8 T cell scans, finds nothing, drifts off. A secondary button inside the vignette, "Who else
    could see it?", brings in an orange NK cell (#FF8A3D, visible granules); an "empty cup ✓" glyph appears (the
    missing-self check, Chapter 2) and it kills the cell. Line under the button (verbatim): "NK cells and some
    unconventional T cells can attack cells that lack MHC class I."
  4 Deaf to the alarm: two halves. "Before": the T cell releases small blue interferon dots that bind a forked receptor
    on the cancer cell; two small beads under the membrane (labelled JAK1, JAK2) light up; a signal arrow runs to the
    nucleus; more MHC cups and PD-L1 knobs appear. "After relapse": the JAK beads are grey and crossed by a bar icon;
    dots bind the receptor but nothing lights up and no new cups appear.
  5 Walled off: a nest of violet cells in the center, ringed by a band of grey-beige spindle fibroblasts (#9C8F80) and
    pale collagen lines, with a faint haze labelled "TGF-β". Blue T cells enter from a vessel at the left edge and
    accumulate inside the band, wandering along it, never crossing into the nest. With anti-PD-1: Ys bind; T cells
    stay in the band.
  6 No scouts, corrupt guards: split panel. Left half "No scouts": a few dying cells release fragments; one green
    dendritic cell (#4FD18B) sits far away, dim and rounded with dendrites retracted ("not activated"); inset: an empty
    lymph-node outline labelled "few tumor-specific T cells". Right half "Corrupt guards": a T cell docked on a cancer
    cell, surrounded by olive MDSCs (#A7A35A), dusky-rose tumor-associated macrophages (#B7727E) and a slate-lavender
    Treg (#8C95C9) emitting a soft grey-violet haze ("suppressive signals"); a small activity meter above the T cell
    sits low. With anti-PD-1: left unchanged; right meter rises to about half, then holds.
  7 Host factors: three small sub-panels with icons and one-line labels: "HLA genes" (two pairs of cups — one pair
    varied, one pair identical), "Gut microbes" (chartreuse rods #B5D94A), "Medicines" (a capsule icon). Each shows an
    arrow into a mini lymph-node icon that brightens or dims.

  SCIENCE GUARDRAILS: the antibody binds PD-1 on the T cell and never kills anything itself; in B2M loss, MHC class I
  is ABSENT from the surface (not merely empty); CD8 T cells cannot recognize MHC-I-negative cells, while NK cells (and
  γδ T cells) can; interferon-gamma comes from the T cell; "walled off" (T cells present but stuck in stroma) must look
  different from "no scouts" (few tumor-specific T cells at all); no faces or eyes on cells.

  MOBILE (<640px): stack wheel (square, ~min(92vw, 360px)) → vignette (4:3) → switch + badge → caption → chips as a
  2-column grid (Host factors full width). Wheel labels as in ch07-cycle mobile; tapping a node shows its full name.
  ACCESSIBILITY: chips = role="radiogroup"; switch = role="switch"; badge text is announced after each change.
steps:
  1. The T cell has found its target, but PD-L1 on the cancer cell switches it off. This is the problem PD-1 blockers were designed to fix — try adding anti-PD-1.
  2. Some tumors have few mutations to show; others lose the ones T cells were attacking, and the invisible cells regrow the tumor. Releasing the brakes cannot help T cells that have nothing to recognize.
  3. Without B2M, MHC class I never reaches the surface, and the shop window is boarded up. Killer T cells cannot see the cell at all — though NK cells, which hunt for missing MHC, and some unconventional T cells sometimes still can.
  4. T cells raise the alarm with interferon-gamma, telling the cancer cell to show more MHC and stop dividing. With JAK1 or JAK2 lost, the message arrives but is never relayed: the cell has gone deaf.
  5. T cells reach the tumor but are trapped in a band of fibroblasts and collagen, held there partly by TGF-β. Releasing the brake does not open the wall.
  6. Without activated dendritic cells, too few T cells are primed in the first place; and where suppressive cells crowd the tumor, they dampen T cells through routes unrelated to PD-1. Releasing one brake helps a little at most.
  7. Some resistance belongs to the person rather than the tumor: the HLA genes they inherited, the bacteria in their gut, the medicines they take. These shift how well T cells are primed and what the tumor can display.
alt: A wheel shows the seven steps of the cancer-immunity cycle. Choosing a resistance mechanism — such as loss of MHC class I, loss of interferon signaling, T cells walled out by stroma, or too little priming — marks the step it breaks and animates it at cell level. Adding an anti-PD-1 antibody fixes the case where the PD-L1 brake is the main problem, but not the others.
:::

:::figure ch12-combinations
title: Fix the cycle
goal: After playing, the reader understands that the right combination depends on which step of the cycle is broken, that drugs aimed at unbroken steps add side effects without benefit, and that some tumors (here, walled-off ones) resist every option on the tray.
kind: simulation
stage: dark
spec: |
  OVERVIEW. A teaching game built on the Chapter 7 wheel (ch07-cycle in mode 'combine', multi-select on). The reader
  picks a tumor profile — each has one or more weak steps — then adds up to THREE treatments from a tray of seven.
  Each treatment strengthens, skips or replaces specific steps (mappings taken from Chapter 7's THERAPIES data, so the
  two chapters never disagree) and adds side-effect points. Two meters show the result; a card shows what real trials
  of the chosen pairing found.

  ON-SCREEN TEXT (verbatim):
  - Prompt above the tray: "Pick a tumor and add up to three treatments. Which breaks can you repair, and what does
    it cost in side effects?"
  - Footnote, always visible under the meters: "A teaching model with made-up numbers, in which the weakest step sets
    the pace. Real tumors are messier: steps are rarely all-or-nothing, a strong step can partly make up for a weak
    one, and different parts of one tumor can fail differently. Not a prediction for any patient."

  LAYOUT — DESKTOP: top = PROFILE segmented control (4 options) with the profile's one-line description beneath.
  Center-left = WHEEL (~420px). Show a small vertical strength bar only beside the profile's weak steps (not all
  seven). Center-right = two METERS ("Tumor control (model)" and "Side effects"), the OUTCOME MESSAGE, then the
  REAL-WORLD CARD area. Bottom = THERAPY TRAY: 7 tiles (4 + 3 grid); selected tiles get a gold outline and a check;
  counter "2 of 3 chosen"; "Reset" button.

  MODEL (implement exactly; numbers are arbitrary teaching values; round to 2 decimals before comparing):
  Steps s1..s7 = strength 0–1, capped at 1.0. "Skip" = step treated as 1.0 and drawn dimmed with a "not needed" tag
  (ch07-cycle combine style). "Replace" = step treated as 1.0 and tagged "engineered recognition".
  Profiles [s1..s7] — description (verbatim):
   A "Inflamed but braked" [0.8,0.8,0.8,0.8,0.8,0.8,0.2] — "T cells are inside and recognize the tumor, but PD-L1
     brakes them."
   B "Walled off" [0.7,0.7,0.7,0.6,0.2,0.8,0.3] — "T cells are primed and arrive, but stroma keeps them at the edge."
   C "Cold desert" [0.2,0.2,0.2,0.8,0.7,0.8,0.5] — "Little antigen is released, dendritic cells stay idle, and few
     T cells are primed."
   D "Invisible to killer T cells" [0.8,0.8,0.8,0.8,0.8,0.05,0.6] — "The cancer cells have lost MHC class I."
  Tiles — subtitle — effect — side-effect points (ch07 THERAPIES ids in brackets):
   1 Anti-PD-1 — "Releases the PD-1 brake" — s7 +0.5 — 1 [anti-pd1]
   2 Anti-CTLA-4 — "Boosts priming in lymph nodes" — s3 +0.4 — 2 [anti-ctla4]
   3 Kill and alert — "Radiation, some chemotherapy, oncolytic viruses" — s1 +0.4, s2 +0.2 — 1.5 [radiation,
     chemo-icd, oncolytic]
   4 Cancer vaccine — "Delivers tumor antigens to dendritic cells" — s2 +0.4, s3 +0.4 — 0.5 [vaccine]
   5 Gate openers — "Anti-VEGF drugs; TGF-β blockers (experimental)" — s4 +0.2, s5 +0.3 — 1 [anti-vegf, tgfb-block]
   6 Engineered killers — "CAR-T cells, T-cell engagers" — SKIPS s1, s2, s3; REPLACES s6; s4, s5, s7 unchanged
     (they enter at step 4 and must still travel, get in and kill) — 2 [car-t, bispecific]
   7 IDO inhibitor — "Aims to stop T cells being starved" — draws its gold "aims at" ring on step 7 but adds 0 —
     0.5 [ido-inhib]
  Tumor control = MIN over s1..s7. Display: < 0.40 "Tumor keeps growing" (✕); 0.40–0.69 "Partial control" (≈);
  ≥ 0.70 "Strong response" (✓). Side effects = sum of points: ≤ 2 "Manageable"; 2.5–4 "Substantial"; > 4 "Often too
  much to continue".
  Sanity checks (builder must confirm): A + anti-PD-1 → strong. A + anti-PD-1 + anti-CTLA-4 → strong, substantial.
  B + anti-PD-1 → growing. B + anti-PD-1 + gate openers → partial (0.50), and no combination reaches strong for B.
  B + engineered killers → growing (walls still block them). C + anti-PD-1 → growing. C + kill and alert + vaccine
  (± anti-PD-1) → partial. C + engineered killers → partial (0.50, limited at killing). C + engineered killers +
  anti-PD-1 → strong (0.70). D + anything without engineered killers → growing. D + engineered killers → partial
  (0.60). D + engineered killers + anti-PD-1 → strong (0.80). Any + IDO inhibitor → no change in control.

  OUTCOME MESSAGES (verbatim; under the meters):
   growing: "The cycle still stalls at step k: [name]. Nothing chosen repairs it or makes it unnecessary."
   partial: "Better — but step k is only partly repaired."
   partial on profile B with gate openers selected: "No treatment on this tray fully opens the wall. That is where
     much of the real research is."
   strong: "Every step works well enough in this model."
   side effects > 4 (append): "In practice, a regimen like this would often be stopped because of side effects."

  REAL-WORLD CARDS (verbatim; show when the condition is met; stack, most recent first):
   Anti-PD-1 + Anti-CTLA-4: "Approved together for several cancers, including melanoma and kidney cancer. More
     effective in some settings — with markedly more side effects (Chapter 8)."
   Anti-PD-1 + Kill and alert: "Chemotherapy plus a PD-1 or PD-L1 blocker is a standard first treatment for many lung
     cancers, and a PD-L1 blocker after chemoradiation is standard for some stage III lung cancers. But adding an
     oncolytic virus to pembrolizumab did not extend survival in a large melanoma trial (Chapter 11)."
   Anti-PD-1 + Gate openers: "PD-1/PD-L1 blockers combined with VEGF-blocking drugs are approved for some kidney,
     liver and endometrial cancers. Drugs that block TGF-β have not yet succeeded in patients."
   Anti-PD-1 + Cancer vaccine: "A personalized mRNA vaccine with pembrolizumab met its main goal in a phase 3 melanoma
     trial, according to its makers in 2026; full results are awaited (Chapter 11)."
   Engineered killers (with anything): "They need a surface target that the cancer cells carry and healthy cells
     largely lack. Several are approved for blood cancers, and a T-cell engager for small-cell lung cancer, a 'cold'
     tumor (Chapters 9 and 10). Getting them into other solid tumors is the hard part."
   IDO inhibitor (with anything): "It aimed at step 7 and looked impressive in an early trial without a comparison
     group. In a large randomized trial it added nothing (Chapter 8). A sensible mechanism is not proof."

  ANIMATION: flowing dots move clockwise at a speed proportional to tumor control; at any step < 0.40 they stall and
  pile up (crimson ⊣, as in ch12-resistance). On "strong", each completed lap emits a soft pulse at node 7 and a small
  violet cancer-cell icon in the wheel center shrinks a little (min 20% size); on "growing" it slowly enlarges.
  Selecting a tile makes affected bars rise with a 400 ms ease. Reduced motion: no dots; bars and meters jump.
  SCIENCE GUARDRAILS: keep the footnote visible; no percentages or survival numbers inside the model; icons follow the
  palette (antibodies = gold Ys with white outline; radiation = a thin beam; chemotherapy = a droplet; virus =
  red-coral icosahedron #FF4D5E; vaccine = small mRNA strand; engineered killers = blue T cell with a synthetic
  receptor glyph).
  MOBILE (<640px): profile control becomes a select menu; wheel ~min(92vw, 340px); meters as two horizontal bars;
  outcome message and real-world card below; tray as a 2-column grid of compact tiles (subtitle on tap).
alt: A teaching game on the seven-step cancer-immunity cycle. The reader chooses a tumor type — inflamed but braked, walled off, cold, or invisible to killer T cells — and adds up to three treatments. Each treatment strengthens, skips or replaces particular steps and adds side effects; inflamed, cold and invisible tumors can each reach a strong response with the right pairing, while the walled-off tumor never fully does, and cards summarize what real trials found.
:::

:::figure ch12-neoadjuvant
title: Before or after surgery?
goal: After stepping through, the reader understands the leading explanation for why giving immunotherapy while the tumor is still in place can work better — the tumor keeps supplying antigens, so more T-cell clones are primed to find hidden micrometastases — and that the same drug can work better simply because of timing.
kind: stepper
stage: dark
spec: |
  OVERVIEW. Two synchronized "patients" (lanes) receive the same drug; only the order of drug and surgery differs.
  Six steps walk through what happens to antigen, dendritic cells, T-cell clones and hidden micrometastases. No trial
  numbers appear inside the figure (they are in the text).

  LAYOUT — DESKTOP: two horizontal lanes stacked, each ~900×260, labelled at left: top "After surgery (adjuvant)",
  bottom "Before surgery (neoadjuvant)". Each lane, left→right:
   (a) PRIMARY TUMOR: a cluster of ~25 violet cancer cells (#B65FD8) in sand-colored tissue (#E9C9A1). Its cells
       display three neoantigen GLYPHS in hot pink (#FF3D7F): triangle, star and diamond, mixed across cells.
   (b) LYMPH NODE: a bean outline (the "briefing room", Chapter 4) where dendritic cells (green #4FD18B, star-shaped)
       meet T cells.
   (c) BLOODSTREAM: a horizontal band with gentle flow; T cells travel along it.
   (d) THREE HIDDEN MICROMETASTASES at the far right: tiny clusters of 3–4 violet cells at 40% opacity with a dotted
       outline and a label "too small for scans". Micrometastasis A shows triangles only; B shows stars; C shows
       diamonds. (The SHAPE carries the meaning, never color alone.)
  Under each lane: a TIMELINE bar (Week 0 → Week 12 → Month 24) with gold antibody "Y" marks for doses and a scalpel
  icon for surgery. Adjuvant lane: scalpel at week 0, doses after. Neoadjuvant lane: doses at weeks 0, 3, 6, scalpel at
  week ~8, more doses after. A playhead moves along both timelines in sync with the steps.
  Right edge of each lane: a "T-cell clones expanded" counter: up to three glyph chips (triangle, star, diamond).

  T-CELL CLONES: blue T cells (#4C8DFF) whose TCR tip shows the glyph they recognize. Expansion = one cell duplicating
  into 4–8 identical copies ("photocopying", Chapter 3) with a soft pop.

  STEP STATES (match the verbatim captions in `steps`):
   1 Setup: both lanes identical; micrometastases pulse faintly; playheads at week 0; highlight the "too small for
     scans" labels.
   2 Adjuvant lane animates (neoadjuvant lane dims to 40%): the scalpel removes the primary tumor (cluster fades, small
     "removed" tag). Only a trickle of triangle fragments from micrometastasis A reaches the lymph node.
   3 Neoadjuvant lane animates (adjuvant dims): gold Ys arrive; the primary tumor sheds fragments of all three shapes;
     3–4 dendritic cells pick them up and travel to the lymph node.
   4 Both lanes: in the neoadjuvant lane, three clones (triangle, star, diamond) expand; in the adjuvant lane, one
     clone (triangle) expands. Counters show 3 vs 1. Small note on the stage (verbatim): "Illustrative: real tumors
     prime hundreds to thousands of clones."
   5 Both: T cells flow right through the bloodstream. Neoadjuvant lane: triangle, star and diamond T cells find and
     kill micrometastases A, B and C (each cluster blebs and disappears). Adjuvant lane: triangle T cells kill A; B and
     C remain.
   6 Neoadjuvant lane: the scalpel removes the now-shrunken primary; a "pathology report" card pops up: "Live cancer
     remaining: almost none — major pathologic response." Adjuvant lane: playhead jumps to Month 24 and B and C have
     grown into a visible relapse (solid, full opacity, "relapse" tag).

  CONTROLS: Prev / Next, step dots (1–6), and "Play" (auto-advance ~6 s per step). Keyboard: left/right arrows.
  Reduced motion: each step renders its end state with no movement.
  SCIENCE GUARDRAILS: the antibody never kills cancer cells itself — killing is always by T cells; micrometastases
  share antigens with the primary tumor, which is why clones primed by the primary can find them; keep the
  "illustrative" note visible in step 4; do not add labels implying every adjuvant patient relapses or every
  neoadjuvant patient is cured (the step-6 caption handles this).
  MOBILE (<640px): one lane at a time with a two-option toggle above the stage ("After surgery" / "Before surgery");
  in steps 4–6 the toggle auto-switches between lanes with a 1.5 s cross-fade, and both clone counters stay visible as
  a compact row above the stage.
steps:
  1. Two patients have the same melanoma: a visible tumor and, invisible to any scan, a few stray cancer cells that have already settled elsewhere. Both will receive the same drug. Only the order differs.
  2. After surgery (adjuvant): surgeons remove the tumor first, and the body's richest source of tumor antigens leaves with it. When the drug arrives, there is much less left to teach T cells.
  3. Before surgery (neoadjuvant): the drug arrives while the tumor is still in place. Dendritic cells keep carrying its antigens to the lymph node — the tumor acting as a vaccine, which is the leading explanation for why timing matters.
  4. With antigen still flowing, more kinds of T-cell clone are primed and multiply. In a pilot trial, giving the drugs before rather than after surgery expanded more of the tumor's T-cell clones.
  5. T cells patrol through the blood. A broader army is more likely to find the hidden seeds — including ones that carry different mutations.
  6. The neoadjuvant patient now has surgery, and a pathologist measures how much live cancer is left: here, almost none. Not every adjuvant patient relapses, and not every neoadjuvant patient is cured — but in trials, the odds shift.
alt: Two side-by-side scenarios show the same immunotherapy given after or before surgery. When the tumor is still in place, it supplies antigens that prime more kinds of T-cell clone, which then find and destroy hidden micrometastases; when surgery comes first, fewer clones are primed and some micrometastases survive to cause a relapse.
:::

:::figure ch12-ctdna
title: Listening to the blood
goal: After using this, the reader understands that tumor DNA in the blood can reveal cancer that scans cannot yet see — so leftover disease or relapse can be detected months earlier — and that a negative test lowers, but does not eliminate, the risk.
kind: chart
stage: light
spec: |
  OVERVIEW. A two-part interactive: (1) a small "blood sample" panel showing DNA fragments, and (2) a time chart of
  the amount of cancer in the body with two detection thresholds, driven by three scenarios. The point is the GAP
  between what scans can see and what a sensitive blood test can see. Everything on the chart is illustrative; real
  trial numbers appear only in the two callout cards (DATA).

  LAYOUT — DESKTOP (light stage, ~960×520):
  - Left 30%: BLOOD SAMPLE PANEL. A rounded test-tube outline containing ~120 short DNA fragments drawn as tiny
    double-helix dashes, mostly grey (from healthy cells) with a few violet ones (#B65FD8) carrying a small hot-pink
    "mutation" tick (#FF3D7F). Label below: "tumor DNA fragments: none / few / some". The number of violet fragments
    tracks the chart value under the playhead (0 below the blood-test line, 1–3 just above it, up to ~20 at the top).
    A magnifier ring over one violet fragment: "the tumor's own mutation identifies it". Small note under the tube
    (verbatim): "In reality, tumor fragments are far rarer than shown."
  - Right 70%: CHART. x-axis "Months" 0–24 (ticks every 6). y-axis "Amount of cancer in the body (illustrative)" with
    no numeric ticks — only "more" at the top and "less" at the bottom. Two horizontal dashed lines: upper "Visible on
    scans", lower "Detectable by this blood test". The region below the lower line is lightly hatched and labelled
    "Too little for this test to detect". Event markers on the x-axis: a scalpel icon at month 1 ("surgery") and gold
    antibody icons where treatment is given.
  - Above chart: SCENARIO segmented control: "Treatment clears it" · "Hidden leftover" · "Relapse after response".
  - Below chart: a PLAYHEAD scrubber (drag or Play) and two badges updating with the playhead: "Scan: sees cancer /
    clear" and "Blood test: positive / negative" (icon + word, not color alone).
  - Below that: two CALLOUT CARDS (verbatim text in DATA).

  CURVES (a smooth ink line #1B1F2A; values in arbitrary units on the y-axis: 0 = blood-test line, 3 = scan line,
  5 = top; interpolate smoothly):
   Treatment clears it: m0 4.5 → m1 (surgery) drops to 0.8 → treatment from m2 → falls below 0 by m4 → down to −1.5 by
     m8 and stays there. Blood test negative from ~m4; scan clear from m1.
   Hidden leftover: m0 4.5 → m1 surgery to −0.5 (below the blood-test line at first) → slowly rises: crosses 0 at ~m3,
     1.5 at ~m6, crosses the scan line (3) at ~m11, 3.8 at m15, flat to m24. Blood test negative until ~m3, then
     positive; scan clear until ~m11. Shade m3–m11 and label it "Lead time: months".
     Toggle (appears only in this scenario): "Treat when the blood test turns positive" → treatment icons from m3; the
     curve bends down from ~0.6 at m4 to between 0 and −0.5 by m9 and stays there (no dramatic plunge).
   Relapse after response: m0 4.5 (no surgery; treatment from m0) → 2.0 by m5, 0.5 by m9 (scan clear from ~m4) → a
     resistant clone regrows (the curve stays above the blood-test line throughout): 1.0 at ~m12 (mark a small flag
     "blood test rises"), crosses the scan line at ~m17, 3.6 at m24.

  INTERACTION: a scenario change redraws the curve with a 700 ms line-draw; the playhead auto-plays once (6 s) on first
  view and on each scenario change; dragging updates the blood panel and badges. Reduced motion: final curves drawn
  instantly; playhead parked at the end.
  CAPTIONS (verbatim; aria-live): `steps` 1 = intro/default; 2–4 = the three scenarios in order; 5 = when the "Treat
  when the blood test turns positive" toggle is on.
  SCIENCE GUARDRAILS: no numeric detection limits, cell counts or tumor sizes anywhere (they vary by test and cancer
  type); keep "illustrative" in the y-axis label; the blood-test line sits BELOW the scan line; the hatched zone must
  stay — no test is perfect; lead times shown are months, not years.
  MOBILE (<640px): the blood panel moves above the chart as a short horizontal strip; chart full width at 4:3; the
  scenario control becomes three stacked buttons; callout cards stack.
steps:
  1. Every day, dying cells spill short fragments of DNA into the blood. A tumor's fragments carry its own mutations, so a sensitive test can pick them out from the much larger crowd of fragments from healthy cells.
  2. After surgery and treatment, tumor DNA disappears from the blood and stays gone. A negative test is reassuring — but every test has a floor, and some tumors shed little DNA, so a negative result lowers the risk of relapse rather than ruling it out.
  3. The scans look clear after surgery. At first, so does the blood; but as hidden cancer cells grow, their DNA becomes detectable months before the tumor is large enough to show up on a scan. That is why blood is tested repeatedly.
  4. The tumor shrinks under treatment and its DNA in the blood falls — then a resistant clone begins to grow. The blood test can rise again while scans still look clear.
  5. This is the idea the IMvigor011 trial tested: treat when the blood test turns positive. Patients with tumor DNA in their blood lived longer, on average, with immunotherapy, while most whose tests stayed negative did well without it.
data: |
  Callout card 1 — IMvigor011 (bladder cancer; Powles et al., N Engl J Med 2025; FDA approval May 2026):
    "After surgery, patients had repeated blood tests for up to a year. 250 who turned ctDNA-positive were randomized:
    median survival 32.8 months with atezolizumab vs 21.1 months with placebo. Of 357 who stayed ctDNA-negative and
    received no immunotherapy, 88% were disease-free at two years. The US FDA approved this approach in May 2026."
  Callout card 2 — CheckMate 816 (lung cancer; Forde et al., N Engl J Med 2025):
    "Exploratory analysis: among patients given nivolumab plus chemotherapy before surgery, 75% of those whose ctDNA
    cleared were alive at five years, vs 53% of those whose ctDNA did not clear."
  All chart curves and thresholds: illustrative, not from any dataset. (For the builder's orientation only, not for
  display: in published studies, ctDNA has preceded imaging by a median of about three months in bladder cancer and
  by several months in colorectal cancer.)
alt: A chart follows the amount of cancer in the body over two years, with two thresholds: a higher one for what scans can see and a lower one for what a blood test for tumor DNA can detect. In the scenarios, the blood test reveals leftover cancer or relapse months before scans do, and stays negative when treatment succeeds, though no test can see below its own floor. Two cards summarize real trials in bladder and lung cancer that used these blood tests.
:::
