---
id: 04-presentation
title: Antigen Presentation
subtitle: Nearly every cell in your body displays a continuous sample of the proteins it is making inside, and this display is the main way T cells tell a healthy cell from an infected or mutated one.
part: I
reading_time: 26
hero: ch04-hero
---

From the outside, a cell infected by a virus looks much like its neighbors: the same membrane, the same size, the same proteins on its surface. Inside, the virus has redirected the cell's ribosomes and enzymes to making thousands of copies of itself, out of reach of the {{antibody|antibodies}} of Chapter 3, which can bind only what is exposed.

Since viruses replicate inside cells, and cancer begins as a change in a protein *inside* a cell, that would be a serious gap. It is closed by an unusual arrangement: **nearly every cell in your body continuously displays samples of its own interior** — fragments of the proteins it is making, held on the outside of the membrane, where T cells can detect them by contact.

## Strings, not sculptures

A {{protein|protein}} is a long chain of {{amino-acid|amino acids}} folded into a specific shape (Chapter 1). Each short piece cut from the chain is a {{peptide|peptide}}: here, a fragment roughly 8 to 25 amino acids long, with no particular folded shape of its own.

Antibodies typically bind a folded surface patch, an {{epitope|epitope}} whose amino acids are often far apart along the chain and come together only when the protein folds. {{t-cell|T cells}} recognize a string of amino acids that sit next to each other in the chain, and only when that string is held on another cell's surface by a molecule called {{mhc|MHC}}, for *major histocompatibility complex*, a name from transplant biology that says nothing about what the molecule does.

Each MHC molecule sits on the cell surface with a cleft along its outer face, the {{peptide-binding-groove|peptide-binding groove}}. A peptide lies in the groove, partly exposed on top, where the receptor of a passing T cell can contact it. (In this guide's figures, an MHC molecule is drawn as a small silver cup with a groove along its rim.)

Cutting proteins into peptides and displaying them this way is called **{{antigen-presentation|antigen presentation}}**. It is the only way T cells can detect what is inside a cell.

:::key-idea
Antibodies bind surfaces. T cells recognize fragments of a cell's *contents*: short peptides held in the groove of MHC molecules on the outside of the membrane. This is how the immune system detects what is happening inside cells.
:::

## The shop window

MHC molecules come in two classes, which display peptides from different sources.

{{mhc-class-i|MHC class I}} sits on almost every cell with a nucleus. Chapter 2 introduced it as the cell's **shop window** and showed that NK cells notice when it is missing. Class I is a continuously refreshed display of samples of the proteins the cell is making, and it is read by {{cd8-t-cell|killer T cells}} (formally, CD8 T cells).

Every cell continuously feeds its worn-out, misfolded or unneeded proteins into the {{proteasome|proteasome}}, a barrel-shaped enzyme complex that cleaves them into short fragments. Most of the fragments are then broken down into amino acids and recycled; by one estimate only about **1 in 5,000** survives to be displayed.[^6]

The survivors are pumped by a transporter called {{tap-transporter|TAP}} (*transporter associated with antigen processing*) into the {{endoplasmic-reticulum|endoplasmic reticulum (ER)}}, an internal membrane compartment where proteins bound for the cell surface are assembled. Empty class I molecules wait there with their grooves open, binding peptide after peptide and releasing almost all of them.[^6]

A peptide stays only if it meets two conditions. The first is length: a class I groove is closed at both ends, so it holds a peptide of usually **8 to 10 amino acids**. The second is a pair of **{{anchor-residue|anchor residues}}**: the floor of the groove has small pockets, and two of the peptide's amino acids, often the second and the last, must fit into them.[^6] A fragment with the wrong anchors is released.

Loaded molecules then travel to the surface. A lymphocyte, for example, carries about **200,000** class I molecules displaying a few thousand different peptides.[^6] The display is a sample rather than an inventory, weighted toward proteins the cell makes in large amounts or degrades quickly.

:::deep-dive How class I is loaded
**How we know T cells recognize peptides.** The decisive experiment came in 1986, when Alain Townsend and colleagues showed that killer T cells against influenza would attack uninfected cells that had only been bathed in a short synthetic peptide from a viral protein.[^2] The added peptides bound to class I molecules already on the cell surface. Laboratories use this routinely to load cells with a chosen peptide, but in the body class I almost always reaches the surface already loaded, so the display remains almost entirely a sample of the cell's own interior.[^6]

**Ubiquitin.** Proteins bound for the proteasome are usually first marked by the attachment of a small protein called ubiquitin, which targets them for degradation.

**The loading complex.** Around TAP sits the peptide-loading complex. One of its proteins, tapasin, working with calreticulin and ERp57, two proteins that assist folding throughout the ER, holds empty grooves open and favors peptides that bind tightly and dissociate slowly. An enzyme called ERAP1 trims peptides that arrive too long; it becomes active only when it binds a peptide longer than about eight or nine amino acids, so it tends to stop near the length class I prefers. Peptides that never find a groove are exported from the ER and degraded.[^6]

**Where the fragments come from.** Much of the display seems to come not from old proteins but from faulty new ones — mistranslated, misfolded or cut short — degraded almost as soon as they were made. So a cell can display peptides from a newly arrived virus soon after it starts making viral proteins, rather than once those proteins wear out.[^6]

**The immunoproteasome.** Interferons (Chapter 2), above all IFN-γ, make cells assemble an *immunoproteasome*, a variant that cleaves at somewhat different sites and so produces a partly different set of peptides. Inflammation changes what is displayed as well as how much.[^6]
:::

A virus-infected cell makes plenty of viral protein, so viral peptides appear on its class I. If a {{mutation|mutation}} has changed one amino acid in one of the cell's own proteins, the altered peptide can appear too: a {{neoantigen|neoantigen}}, a peptide never before displayed in this body. Much of Part II depends on that idea.

Some viruses counter this by blocking TAP or other steps of peptide loading, or by removing class I from the surface.[^9][^6] As Chapter 2 showed, missing class I is itself a signal: {{nk-cell|NK cells}} attack cells that lack it.

Unlike a shop window, the class I display is not curated: it is the automatic result of degradation, transport and binding, so an infected cell cannot avoid displaying its virus. Nor can a healthy cell be implicated by mistake: viral debris on its outer surface does not enter its class I display, so killer T cells pass it by and attack the cells making the foreign protein.

:::figure ch04-mhc1-pathway
title: The shop window
goal: After using this, the reader understands that every cell continuously shreds its own internal proteins and displays short samples on its surface, and that a virus or a single mutation changes what appears in that display — which is what a patrolling killer T cell reads.
kind: stepper
stage: dark
spec: |
  Stage tags (top right): "Not to scale", "Illustrative".

  A single large body cell fills most of the stage, drawn in cross-section: sand-colored
  (#E9C9A1) rounded polygon, round nucleus, and a band of membrane along the top where the
  display appears. Outside the membrane, in a strip along the top of the stage, an ACTIVATED
  killer T cell (library tCell, CD8, electric blue #4C8DFF, fine microvilli fuzz, three or
  four TCR glyphs on its leading edge) drifts slowly left to right. Label it "activated
  killer T cell" — naive T cells never patrol tissues (they are activated in lymph nodes,
  later in the chapter).

  Inside the cell, left to right, a short production line. In-SVG labels use PLAIN names;
  the molecular name sits in an "i" chip beside each label:
  (a) a cluster of folded protein glyphs, visibly larger and lumpier than peptides;
  (b) "shredder" — a squat silver-gray barrel with a channel through it ("i": proteasome);
  (c) a scatter of peptide chains emerging from the barrel, most of which fade out;
  (d) "gate" — a pale silver pore ("i": TAP) set into the wall of a large, soft-edged
      compartment labeled "loading bay" ("i": endoplasmic reticulum, ER) occupying the
      right third of the interior;
  (e) inside the loading bay, two or three empty MHC class I molecules drawn with the
      library mhc1 cup (#D9DEEA, ≥14 px) with a groove along the rim and two small pockets
      in the groove floor;
  (f) a transport arrow from the loading bay to the membrane, where loaded cups dock facing
      outward.

  Peptides are short chains of 8–10 small sub-beads, with a tiny "8–10 amino acids" ruler
  beside the first one the reader sees. Two sub-beads in each chain (the 2nd and the last)
  are "anchors", drawn with a distinct small shape that drops DOWN into the cup's pockets
  when loaded. Color by origin: self = sand #E9C9A1; viral = red-coral #FF4D5E (this
  figure only, always with its origin icon); mutated/neo = hot pink #FF3D7F with a soft
  glow. Origin is also carried by a small icon on each readout chip (self = plain dot,
  viral = small spiked hexagon, neo = small asterisk) so color is never the only cue.

  CONTROLS. (1) Segmented control with four scenarios, "Healthy" (DEFAULT on load) ·
  "Virus-infected" · "Mutated (cancer)" · "Window shuttered". (2) Stepper (Back / Next /
  Play) through the six steps below, built on ctx.ui.stepper; caption in an ARIA live
  region. (3) A persistent readout panel, bottom-right, titled "What's in the window": a
  row of twelve slots that updates as soon as the scenario changes. Directly under the
  twelve slots, ALWAYS VISIBLE, a small-print line: "Illustrative: 12 slots stand in for a
  few thousand different peptides on ~200,000 molecules."

  PER SCENARIO.
  · Healthy: all protein glyphs and all slots sand. The T cell touches the cell, pauses,
    moves on. Inline note: "Nothing to report."
  · Virus-infected: a small red-coral icosahedral virus inside the cell; 2 of 12 slots
    become viral. The T cell stops; recognition is drawn with the shared recognize()
    grammar (a ring in the T cell's blue with a white core, plus a green-cyan "+" disc at
    the contact). No killing — that is Chapter 5.
  · Mutated (cancer): cell silhouette slightly irregular and violet-tinted (#B65FD8) with a
    misshapen nucleus; exactly one protein glyph carries a small pink "typo" mark; exactly
    one slot glows hot pink. Second readout note, this scenario only: "In a real tumor
    cell, one neoantigen would be about one in several thousand different peptides —
    which is why it is so easy to miss." Do NOT label the single lit slot as "scarce".
  · Window shuttered: violet cell; the gate is drawn blocked with the ⊣ glyph; cups stay
    inside the loading bay and NO cups appear on the membrane at all (absent cups, never
    empty cups on the surface); all readout slots are empty outlines. The T cell touches and
    drifts away with no ring. Then an NK cell (orange #FF8A3D, visible granules) enters
    from the right and a "missing self" label appears — a two-second callback to Chapter 2.

  EMPHASIS AND HONESTY. At step 2 about four in five fragments fade out in the scene, and an
  on-stage note sits beside them: "Shown: 1 in 5 survive. Real: about 1 in 5,000." Only
  fragments move — never a whole folded protein. No peptide binds a cup outside the loading
  bay. A cup never reaches the surface empty. Acceptable simplifications: one shredder
  instead of thousands; twelve slots instead of ~200,000 molecules; helper proteins in the
  loading bay omitted; the Golgi omitted from the route between loading bay and surface (do
  not "fix" this by adding it); the loading bay as one smooth compartment.

  MOBILE. Below 700px use a portrait viewBox and stack the line vertically: proteins and
  shredder at the top, gate and loading bay in the middle, membrane and display near the
  bottom, T-cell lane pinned to the bottom edge. Scenario control becomes a two-by-two
  button grid above the stage; the readout becomes a full-width strip under the stage,
  above the caption, with its "Illustrative" note kept. In-SVG labels ≥13px.
steps:
  1. Every cell continuously degrades worn-out, faulty and surplus proteins in the proteasome, a barrel-shaped enzyme complex that cleaves them into short fragments.
  2. Most fragments are broken down further and recycled. Here about 1 in 5 survive so you can follow them; in a real cell it is closer to 1 in 5,000.
  3. The survivors are pumped by the transporter TAP into the endoplasmic reticulum (ER), the internal compartment where proteins bound for the surface are assembled.
  4. Empty MHC class I molecules in the ER bind and release peptide after peptide. Only a peptide of the right length, usually 8 to 10 amino acids, whose anchor residues fit the pockets in the groove stays bound.
  5. Loaded molecules travel to the surface and face outward. A real cell carries a couple of hundred thousand of them; the twelve slots in the readout stand in for a few thousand different peptides.
  6. An activated killer T cell patrolling the tissue inspects the display by contact. Switch between the four scenarios to see what the window shows in each case.
alt: A cross-section of a cell showing how it displays samples of its proteins. Proteins enter the proteasome, drawn as a barrel, and emerge as short fragments, most of which are degraded; survivors pass through the TAP transporter into the endoplasmic reticulum, bind in the grooves of MHC class I molecules (drawn as cups), and travel to the surface. A readout shows what is on display. Switching between a healthy, a virus-infected, a mutated and a display-silenced cell changes the display; a patrolling killer T cell reacts only to foreign fragments, and an NK cell attacks the cell whose display has gone dark.
:::

:::deep-dive How viruses block class I
The effort viruses spend disabling class I shows how much it matters. Herpes simplex virus, carried by most adults, makes a protein called ICP47 among its very first proteins, and ICP47 blocks TAP. Class I molecules then stay in the ER with empty grooves and never reach the surface, so the infected cell stops displaying new peptides on class I early in infection.[^9] Cytomegalovirus attacks the same pathway at other points, including by sending class I molecules to be degraded, and virologists have found nearly every step the cell can live without targeted by one virus or another.[^6]

The cost, as described above, is that a cell without class I invites attack by NK cells. Tumors face the same trade-off, and their compromises — losing one HLA gene, or a component every class I molecule needs — are a theme of Chapter 7.
:::

## Peptide plus groove

In 1974, Rolf Zinkernagel and Peter Doherty were studying killer T cells from mice infected with a virus. The T cells efficiently killed infected cells from their own inbred mouse line (animals bred to be genetically identical) but left alone infected cells from a different line, though these carried the same virus and made the same viral proteins.[^1]

The T cells were recognizing not the virus alone but the virus *together with the MHC molecule displaying it*. This is called **{{mhc-restriction|MHC restriction}}**, and it earned the two men the 1996 Nobel Prize in Physiology or Medicine.

Molecular structures later showed why. In 1987, Pamela Bjorkman and colleagues solved the first structure of a human class I molecule and found the groove, with something unidentified already lying in it.[^3] About a decade later, a structure of a {{tcr|T-cell receptor}} bound to its target showed it lying diagonally across the top, contacting the peptide in the middle and the walls of the groove on either side.[^5]

Each T cell's single receptor specificity (Chapter 3) is not for a shape but for *this peptide, in this groove*, a combination called the peptide–MHC complex; change either part and the T cell does not respond. The receptor makes this distinction through a low-affinity bond that lasts from about a second to a minute (see the box below).

:::deep-dive How a weak bond makes a sharp decision
Chapter 1 left a puzzle. A T-cell receptor binds its peptide–MHC complex a thousand to a million times more weakly than a mature antibody binds its target, and each contact lasts from about a second to about a minute.[^15] Yet T cells distinguish a foreign peptide from thousands of near-identical self peptides with high precision. Three mechanisms seem to combine.

**Time as a filter.** Binding sets off a chain of biochemical steps inside the T cell, mostly phosphorylations (the attachment of phosphate groups to signaling proteins), and the signal goes through only if the receptor stays bound long enough for the chain to finish. A slightly wrong peptide that dissociates a little sooner rarely completes it, so a small difference in bond lifetime — set by the off-rate of Chapter 1 — becomes a large difference in signal. The idea is called kinetic proofreading.[^16]

**Many brief contacts.** Because each bond is short-lived, one peptide–MHC complex can engage receptor after receptor; in one experiment a single complex triggered up to about 200 of them.[^17] A handful of correct complexes among thousands of self ones can therefore add up. A killer T cell can detect a single one and kill with about three.[^18]

**A {{co-receptor|co-receptor}}.** CD8 or CD4 binds the side of the same MHC molecule while the T-cell receptor binds its top, stabilizing the contact and bringing signaling enzymes close to the receptor complex.

The receptor's own antigen-binding chains have only very short tails inside the cell and cannot signal by themselves. The signal is relayed inward by {{cd3|CD3}}, a cluster of signaling chains bound to every T-cell receptor whatever its specificity; together they form the TCR–CD3 complex.[^29] Part III exploits this twice: the T-cell engagers of Chapter 9 bind CD3 to activate any T cell they attach to, and the CARs of Chapter 10 carry the signaling tail of one of its chains, CD3ζ.

How the three mechanisms combine is still debated. One consequence matters later: a receptor engineered to bind far more tightly can lose its discrimination and react to the wrong targets (Chapter 10).[^15]
:::

## Your HLA type

The groove half of that combined target is encoded by highly variable genes. In humans, MHC molecules are called {{hla|HLA}}, for *human leukocyte antigen*, another name from transplant research. You inherit three main class I genes, HLA-A, HLA-B and HLA-C, one copy of each from each parent, so your cells use at most six different class I molecules, each with its own anchor preferences.

HLA genes are the most variable in the human genome, with a vast number of versions, called {{allele|alleles}}, across the population. The mid-2026 release of the reference database lists more than 45,000 HLA alleles, about 31,000 of them for class I genes, and the count keeps growing.[^10][^11] Most of the variation lies in and around the peptide-binding groove, where it changes which peptides can bind.[^4]

**Two people infected with the same virus display different fragments of it.** If a virus changes an anchor in one of its peptides, the peptide may disappear from one person's display and remain in another's.[^6]

**As a result, no single viral variant can escape everyone's T cells at once**, even if it escapes some people's.

**HLA variation also makes transplantation difficult.** A donated organ carries its donor's HLA. To the recipient's T cells, those unfamiliar grooves, loaded with ordinary donor peptides, look foreign, and a large share of T cells react: around 7% of all T cells in one mouse study, against roughly one in a hundred thousand for a typical viral peptide.[^12] That is why donors are matched as closely as possible, and why transplant recipients take drugs that suppress T cells.

**The same variation is why personalized cancer vaccines must be matched to each patient's HLA.** Predicting which fragment of a patient's mutated protein will be displayed requires knowing their HLA type (Chapter 11).

:::figure ch04-peptide-plus-groove
title: Peptide plus groove
goal: After using this, the reader understands that a T-cell receptor recognizes a peptide and the MHC groove holding it as one combined target — so the same virus looks different to different people's T cells.
kind: explorer
stage: dark
spec: |
  Stage tag (top right): "Illustrative". Shared art: the library mhcGroove close-up and
  mhc1 pocket variants (built with ch06-typo-to-target as one task).

  A staged explorer built on ctx.ui.stepper: four steps revealed one at a time (Back /
  Next), each adding exactly one control. After step 4, ALL controls unlock for free play
  (person, peptide, T cell, mutation). Two panels on desktop: the DETAIL view (left, large)
  and, from step 3, the GRID (right). Before step 3 the detail view fills the stage.

  DRAWING VOCABULARY. An MHC molecule is the silver cup (#D9DEEA) seen slightly from above,
  with a groove along its rim. The groove floor has exactly TWO pockets. The tops of the two
  groove walls carry a short "ridge pattern" (three small bumps in a person-specific
  arrangement) — this is what the TCR touches besides the peptide. A peptide is a chain of
  nine beads; bead 2 and bead 9 are ANCHORS that point DOWN into the pockets; beads 4–6
  point UP and carry a small pattern the TCR reads. Viral peptides are hot pink (#FF3D7F)
  with a soft glow; the replacement self peptide is sand (#E9C9A1). A TCR is a flat paddle
  with three short loops on its underside; when it docks it lies DIAGONALLY across the
  groove, with one loop on the peptide's up-facing beads and one on each wall's ridge.

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

  THREE OUTCOMES, each with a shape cue, a foundation badge (ctx.ui.badge) and these exact
  labels:
  · ✕ "Not displayed" — the peptide's anchors fail to seat; it is pushed out and falls away
    INSIDE the cell (draw the event below a faint dashed line labeled "inside the cell"),
    and a plain sand self peptide slides into the groove instead. The cup that reaches the
    surface is never empty; it simply never carries our peptide.
  · ≈ "Displayed, but this T cell can't read it" — peptide seated; TCR descends, touches,
    lifts off; no ring.
  · ✓ "Recognized" — TCR docks diagonally; all three contacts glow; the shared recognize()
    ring plus a green-cyan "+" disc appears; the paddle stays docked.

  STEPS AND CONTROLS (caption for each step in an ARIA live region; see `steps`).
  Step 1 "Does it fit?" — person fixed to Ana. Control: peptide picker P1 / P2 / P3.
  Step 2 "Can this T cell read it?" — T1 appears above Ana's display. Same peptide picker
  stays; add ONE button: "Swap to a different T cell" (toggles T1 ↔ T2).
  Step 3 "Different people" — the GRID appears: 3 rows (P1–P3) × 3 columns (Ana, Ben,
  Chen), each cell showing its outcome badge (✓ ≈ ✕) for the current T cell. Clicking a
  cell animates the detail view to that case. Under the grid, one line of small print:
  "Each real person has up to six class I types, so real coverage is broader than this
  grid — but the differences between people are real."
  Step 4 "The virus mutates" — ONE button: "Change one anchor in P1". Row P1 becomes P1*:
  Ana's cell flips to ✕ "Not displayed" (animate the peptide falling out of her groove,
  inside the cell), Ben's stays displayed. Caption explains.

  SCIENTIFIC CARE. The TCR always contacts BOTH peptide and groove, never the peptide
  alone. Anchors point down; TCR-read beads point up. The escape mutation changes an anchor
  only and hides P1 from Ana but not from Ben. Acceptable simplifications: two pockets
  instead of several; three TCR loops instead of six; one class I type per person; nine-bead
  peptides throughout.

  MOBILE. Below 760px, stack: detail view first (landscape viewBox, scaled), controls in a
  single column under it, then (from step 3) the grid full width with column headers as
  initials (A, B, C) plus a legend, then the caption. Grid cells ≥44px tap targets.
steps:
  1. This is one person's class I peptide-binding groove, with two pockets in its floor. Pick a peptide from the virus. It is displayed only if its two anchor residues fit the pockets; otherwise it is released inside the cell, and an ordinary self peptide binds the groove instead.
  2. Now a T cell arrives. Its receptor lies across the groove and contacts the peptide and the groove walls at the same time. It responds only if both match — try swapping in a different T cell.
  3. The same virus in three people. Each person's grooves bind a different subset of its peptides, and the same peptide in a different person's groove can look unfamiliar to the same T cell.
  4. The virus changes one anchor residue in a peptide. Ana's grooves can no longer bind it, so it disappears from her display, but Ben's wider pocket still accepts it. One mutation can hide a virus from one person and not from another.
alt: An interactive showing a peptide seated in the peptide-binding groove of an MHC molecule, with two anchor residues fitting pockets in the groove floor, and a T-cell receptor lying across the top contacting both the peptide and the groove walls. A grid of three people against three viral peptides shows that each person displays a different subset of the same virus's fragments and that a given T cell recognizes only one peptide-and-groove combination. A final step shows a single mutation hiding a peptide from one person but not another.
:::

:::deep-dive A drug that rewrote the display
Abacavir, an HIV medicine, used to cause a severe hypersensitivity reaction in a small fraction of patients — almost all of them carriers of one HLA variant, HLA-B*57:01. As researchers showed in 2012, abacavir, a small molecule rather than a protein, binds in the floor of the HLA-B*57:01 groove and stays there, changing the groove's shape. The altered groove binds a *different* set of the patient's own peptides, so the patient's cells suddenly display self peptides to which their T cells were never made tolerant, and the T cells react.[^13]

The case became a model for genetic testing. In a randomized trial of 1,956 patients, screening for HLA-B*57:01 and withholding the drug from carriers eliminated hypersensitivity confirmed by skin patch testing: 0% against 2.7%.[^14] Reactions diagnosed by doctors fell too (3.4% against 7.8%) without vanishing, since other things also cause rashes and fevers early in HIV treatment. The test is an excellent rule-out but a weak rule-in: only about half of carriers would have reacted. About 5.6% of that mostly white cohort carried the allele; carriage rates differ between populations.[^14] Testing before prescribing is now standard practice.
:::

## MHC class II

Class I reports what a cell makes inside. Much of what the immune system deals with, though, was never inside a cell: bacteria in a wound, debris from a dying tumor, pollen.

For these there is a second display, {{mhc-class-ii|MHC class II}}, which is not on every cell. It belongs to **{{antigen-presenting-cell|professional antigen-presenting cells}}** — {{dendritic-cell|dendritic cells}}, {{macrophage|macrophages}} and {{b-cell|B cells}} — "professional" because presenting is part of their job, and because they can provide the confirmation signals described later. Some other cells start to express class II during inflammation.[^6] Professional presenters take up material from their surroundings and degrade it in {{endosome|endosomes}}, acidic membrane-bound compartments that receive what the cell has taken in and pass it on to the {{lysosome|lysosomes}} of Chapter 2. Engulfed particles first enter phagosomes, which fuse with these compartments. Class II therefore displays fragments of what the cell has taken up from outside, along with much of its own protein.

Class II grooves are open at both ends, so the peptides can extend past the edges and are longer, **roughly 13 to 25 amino acids, averaging around 15**.[^7] Class II is read by {{cd4-t-cell|helper T cells}} (formally, CD4 T cells).

:::deep-dive How class II is loaded
A class II molecule is assembled in the ER alongside class I and could bind the same peptides. A placeholder protein, the **invariant chain**, blocks its groove and carries a sorting signal that sends the whole complex to the endosomes instead of straight to the surface. There, the proteases (protein-cleaving enzymes) that degrade ingested material also cleave the invariant chain down to a fragment called **CLIP**, which still occupies the groove. A dedicated exchange protein, **HLA-DM**, opens the groove, releases weakly bound peptides, and keeps doing so until a tightly binding one is in place; another molecule, HLA-DO, inhibits DM and so regulates where loading happens.[^6]

Class II variants are among the strongest genetic risk factors for several autoimmune diseases, often because one groove can bind a particular peptide that others cannot. Celiac disease is the clearest case, although its peptide comes from food: HLA-DQ2 can display a chemically modified fragment of dietary gluten that activates helper T cells.[^6] Children born unable to make class II suffer overwhelming infections from infancy.[^6]
:::

| | Class I | Class II |
|---|---|---|
| Found on | Nearly every cell with a nucleus | Professional antigen-presenting cells |
| Shows | Fragments of what the cell makes | Fragments of what the cell took in (plus much of its own protein) |
| Loaded in | The ER | Endosomes |
| Peptide length | 8–10 amino acids | ~13–25 amino acids |
| Read by | CD8 killer T cells | CD4 helper T cells |

CD8 and CD4 are {{co-receptor|co-receptors}}: molecules on the T cell's surface that bind the MHC molecule alongside the T-cell receptor, at a site on its side away from the groove. CD8 binds class I and CD4 binds class II, which is what restricts each kind of T cell to one display.

:::deep-dive Limits of the two displays
**Class I is not a representative sample.** Abundant and fast-turnover proteins are over-represented, peptides that TAP won't carry are missing, and a peptide that fits none of your grooves is never displayed, however abundant its protein. Much of a cell's interior is never displayed, which makes it one of cancer's best hiding places. Cells also differ in how much class I they carry: neurons, for instance, display very little. And T cells read the display only by direct contact, never from a distance.

**Class II shows mostly self.** Most of what sits on class II at any moment comes from the presenter's own proteins, such as its own membrane molecules, degraded and displayed.[^7] Some even comes from inside the cell, when the cell degrades parts of its own interior in lysosomes.[^8] Foreign peptides are a minority, which is one reason the confirmation signals described later in this chapter matter so much.

**Not every T cell recognizes peptides.** Small groups of T cells recognize other things: lipids presented by MHC-like molecules called CD1, by-products of bacterial vitamin synthesis presented by one called MR1, or signs of stress, recognized without MHC at all, as many {{gamma-delta-t-cell|γδ (gamma-delta) T cells}} do (Chapter 12).[^30] Their contribution against cancer is still being worked out; this guide follows the T cells that recognize peptides.
:::

## Dendritic cells: from tissue to lymph node

A display is useful only if the right T cell reads it, and the T cell with the right receptor for a given peptide is extremely rare and almost certainly not where the infection or tumor is. It is in the blood or in one of the hundreds of {{lymph-node|lymph nodes}} distributed through the body.

So dendritic cells bring the samples to the T cells. These star-shaped cells with long branching projections live in the skin, gut, lungs and most other tissues. They sample the tissue around them, taking up fluid and particles and displaying fragments on class II,[^19] and carry these samples to a lymph node.

Which node a dendritic cell goes to is set by anatomy. Each lymph node collects the lymph draining one region of the body, so it receives samples from that region first: the tender lumps under your jaw during a sore throat are nodes that drain the throat, swollen with cells that have arrived and begun to multiply. A tumor has draining lymph nodes too. They are probably the main place where T cells against it are first activated,[^23][^31] and, because tumor cells can travel along the same lymph vessels, often the first place it spreads.

A steady trickle of dendritic cells travels to the draining lymph node all the time, carrying harmless samples even from healthy tissue.[^20] Danger changes both how many travel and what they present. When its {{pattern-recognition-receptor|pattern-recognition receptors}}, the danger sensors of Chapter 2, detect bacterial cell-wall components, viral genetic material or the contents of cells that burst as they died, a dendritic cell **matures**, an irreversible change that takes a day or two:[^19]

- it **stops taking up material**, so its class II display keeps samples from the time danger was detected;
- it **moves its MHC molecules to the surface and keeps them there**: a mature dendritic cell can carry around two million class II molecules;[^6]
- it **raises its confirmation signals** for T cells (see "Two-factor authentication" below);
- and it **leaves the tissue**, crawling into the lymphatic vessels and traveling with the lymph to the node.

### Cross-presentation: the loophole cancer immunity depends on

Dendritic cells display what they *take up* on class II, which helper T cells read. A killer T cell must be primed (activated for the first time) before it can attack an infected or cancerous cell, but it reads class I, which reports only on what a cell makes *inside itself*. A dendritic cell that has engulfed a dead tumor cell makes none of the tumor's proteins, so by the rules so far it cannot prime a killer T cell against the tumor.

In 1976, Michael Bevan injected mice with cells from a different mouse line and got a result the rules did not allow. The killer T cells that arose recognized the foreign proteins on the *host's* MHC molecules, which the injected cells did not carry, so host cells must have picked up the foreign material and displayed it on their own class I.[^21] This is **{{cross-presentation|cross-presentation}}**: certain dendritic cells route material they have taken up into the class I pathway, putting material from outside the cell in the shop window.[^6]

Cross-presentation is done mainly by a rare, specialized kind of dendritic cell. Mice engineered to lack it fail to cross-present, fail to make killer T cells against some viruses, and fail to reject tumors that normal mice reject.[^22] The same cells carry tumor material from the tumor to the nearby lymph node and present it to T cells there.[^23]

:::figure ch04-cross-presentation
title: Cross-presentation
goal: After using this, the reader understands that a dendritic cell that merely ate tumor debris can brief a killer T cell only by cross-presentation — routing the eaten material onto its own class I molecules.
kind: stepper
stage: dark
spec: |
  Stage tags (top right): "Not to scale", "Time compressed".

  A small, three-step figure (about half a day to build), on ctx.ui.stepper. Two panels
  side by side, joined by a faint lymphatic channel:

  LEFT PANEL, "In the tumor": a violet (#B65FD8), irregular tumor cell (library
  cancerCell) dying with the shared setDying grammar (shrink, blebs, fragments); some
  fragments carry a hot-pink (#FF3D7F) tag (a tumor protein). A green (#4FD18B)
  star-shaped dendritic cell (dendriticCell, state 'immature'), labeled "specialist
  dendritic cell" with an "i" chip reading "Immunologists call this kind cDC1", engulfs
  fragments into an internal bubble.

  RIGHT PANEL, "LYMPH NODE" (t-caps, library lymphNodeField backdrop): the same dendritic
  cell, now dendriticCell state 'mature' with pale-mint B7 studs (no icon on B7), displaying
  on two kinds of cup: class II cups (library mhc2, labeled "evidence board") and class I
  cups (library mhc1, labeled "shop window"). Two T cells wait nearby: a teal (#2EC4C9)
  helper labeled "reads class II", and a blue (#4C8DFF) killer labeled "reads class I".

  Inside the dendritic cell, the eaten material follows routes drawn as glowing paths:
  · Route A (always on): bubble → class II cups. Hot-pink beads appear on the evidence
    board. The helper docks and shows the recognize() ring plus a green-cyan "+" disc.
  · Route B (cross-presentation): bubble → class I pathway → class I cups. Shown only in
    step 3.

  STEP STATES.
  Step 1: left panel animates the eating; the dendritic cell then travels along the
  channel to the right panel. Class I cups show only sand self beads; class II cups show
  pink.
  Step 2 ("Without cross-presentation"): helper recognizes class II (ring + "+"). Killer
  touches the class I cups, finds only sand self beads, and drifts away; inline note "The
  killer is never briefed."
  Step 3 ("With cross-presentation"): Route B lights; pink beads move onto some class I
  cups; the killer docks and gets the ring + "+". A small toggle "Cross-presentation:
  off / on" appears on this step only, so the reader can flip between the step-2 and
  step-3 outcomes.

  SCIENTIFIC CARE. Route B must start from the eaten material in the bubble, not from the
  dendritic cell's own nucleus or protein-making machinery: the dendritic cell is not
  infected and makes no tumor protein. The tumor cell never presents directly to the
  T cells. Both T cells are in the lymph node, not the tumor. Acceptable simplifications:
  one dendritic cell; Route B drawn as a single path (real cells use more than one route);
  the journey compressed to a second or two.

  MOBILE. Below 700px, stack the panels vertically (tumor above, lymph node below) with the
  channel running downward. Toggle full width under the stage.
steps:
  1. In the tumor, a specialist dendritic cell engulfs debris from a dying tumor cell, then carries it to the nearest lymph node. It makes none of the tumor's proteins itself.
  2. By the ordinary rules, engulfed material goes onto class II. A helper T cell can recognize it there, but the killer T cell reads only class I, which shows nothing unusual, so the killer T cell is never activated.
  3. Cross-presentation routes some of the engulfed material into the class I pathway, so tumor fragments appear on class I too, and the killer T cell can recognize them. Use the switch to compare.
alt: A two-panel figure. In a tumor, a dendritic cell engulfs debris from a dying cancer cell and travels to a lymph node. There it displays the tumor fragments on MHC class II, where a helper T cell recognizes them. Without cross-presentation, its MHC class I molecules show only self peptides and a killer T cell passes by; with cross-presentation, tumor fragments also appear on class I and the killer T cell recognizes them.
:::

:::key-idea
Most tumors never infect dendritic cells, so cross-presentation is the main known route by which killer T cells can be primed against a tumor at all. That makes it a foundation of most cancer immunotherapy.
:::

## The search

Chapter 3 gave one example of how rare the matching T cell is: about 1 in 200,000. Across many peptides, the frequency runs from roughly **1 in 10,000 to 1 in a million** {{naive-t-cell|naive T cells}} (those that have never met their target), with most targets toward the rare end. In a mouse that can mean as few as 15 to about 1,100 matching cells in the entire animal, and frequencies measured in people are similar.[^24][^25] Some targets have a hundred times more matching T cells than others, which partly explains why some fragments of a virus provoke large responses and others are ignored.[^24][^25]

The lymph node solves this by brute force. Naive T cells enter from the blood, wander through the node's dense mesh, and leave hours later for the next node, a circuit one cell can keep up for years without meeting its target.[^32] Dendritic cells stay in place and extend their branches among the passing T cells. Under the microscope, contacts last about three minutes, and at this stage the T cells are not attracted to the dendritic cells: they approach no faster than they leave. Even so, one dendritic cell contacts a few thousand T cells an hour.[^26]

An infection also sends a stream of dendritic cells, all carrying fragments of the same invader, while new T cells keep arriving. Over hours and days, this random search finds the matching T cell. Then its behavior changes: in mice, the matching T cell slows, stays attached to dendritic cells for about half a day, and on the second day detaches and starts to divide.[^33]

:::figure ch04-lymph-node-search
title: Finding the matching T cell
goal: After using this, the reader understands how rare the matching T cell is, and how random, brief contacts at a high rate — shared among many dendritic cells — still find it.
kind: simulation
stage: dark
spec: |
  Stage tags (top right): "Illustrative", "Time compressed". A HUD clock at top left
  (ctx.ui.clock) reads simulated time with the phrase "Time compressed". Canvas 2D crowd
  built on shared/agents.js (seeded, deterministic); SVG overlay for labels, counters and
  controls. Interior uses the library lymphNodeField, labeled "LYMPH NODE" in t-caps.

  OPENING BEAT (about 3 seconds, plays once when the figure enters the viewport): a green
  (#4FD18B) star-shaped dendritic cell (dendriticCell, state 'mature', pale-mint B7 studs
  with no icon, hot-pink peptides on its cups) enters from an afferent lymphatic at the
  top-left and settles near the center. With prefers-reduced-motion it is simply shown in
  place.

  THE CROWD. 400 small T cells (3px dots; blue #4C8DFF for killer, teal #2EC4C9 for
  helper) on independent random walks through the mesh. The dendritic cell's dendrites
  wave slowly into the traffic. A T cell that brushes a dendrite pauses briefly (the shared
  contactRing), then moves on at the same speed it arrived. EXACTLY ONE T cell is the match
  (its tcrKey matches the cargo's epitopeKey, but it is not visually distinguished until
  contact). When it touches a dendrite, the contact holds, the recognize() ring and a
  green-cyan "+" disc appear, and after a beat it divides with cell-actions.divide —
  2, 4, 8 — ending in a small labeled cluster "8 shown; real: thousands within days".

  ALWAYS-VISIBLE RARITY LABEL (top of stage, computed from the actual crowd size N):
  "In this demo: 1 matching T cell among N. In your body: roughly 1 in 100,000 (range
  about 1 in 10,000 to 1 in a million). This demo is hundreds of times easier than
  reality."

  COUNTERS: "contacts made" and simulated time (scaled so that one dendritic cell makes
  about 3,000 contacts per simulated hour).

  CONTROLS: (1) speed slider 1×–20×; (2) "Find the match" button that highlights the
  matching T cell for readers who do not want to wait; (3) reset.

  PROGRESSIVE DISCLOSURE — "Now the real odds". After the match is found (or revealed), a
  small panel opens below the stage (inline; no bottom sheet). It is a back-of-the-envelope
  calculator, not a simulation, with its own "Illustrative" tag. Fixed assumptions are
  printed in it: "odds 1 in 100,000; about 3,000 contacts per dendritic cell per hour;
  every contact a different T cell". One control: a segmented picker "dendritic cells
  carrying this cargo: 1 · 10 · 100". Readout: "expected time to the first match: about
  33 hours · about 3 hours · about 20 minutes". Footnote: "Real numbers vary; the point is
  that many dendritic cells and a constant inflow of fresh T cells make a hopeless-looking
  search routine."

  SCIENTIFIC CARE. T cells must not home toward the dendritic cell; approach and departure
  speeds are equal (this is the finding, not a simplification). Contacts are brief. The
  match is singular and unmarked until contact. Acceptable simplifications: one dendritic
  cell on screen; 400 T cells instead of millions; expansion to eight cells.

  prefers-reduced-motion: no drift or random walk; the crowd is static, the match is
  highlighted at once, expansion is a still frame, and the real-odds panel is open.

  MOBILE. Below 760px, the crowd drops to 150 cells (the rarity label updates to "1 among
  150"); counters sit in a sticky bar under the stage; the slider moves into a disclosure;
  the real-odds panel is full width. Canvas capped at 2× DPR; pause when off-screen.
steps:
  1. A dendritic cell carrying fragments from an infection arrives in a lymph node and settles, its branches reaching among the passing T cells.
  2. T cells arrive from the blood through a high endothelial venule, a specialized small vessel in the node, wander at random and leave with the lymph hours later. Each one that brushes the dendritic cell pauses for a few minutes, then moves on. Somewhere in the crowd is a single T cell whose receptor binds one of the peptides it carries.
  3. In this demo the match is 1 in a few hundred. In your body it is closer to 1 in 100,000. Open "the real odds" to see why the search still succeeds.
alt: A simulation of a lymph node. T cells enter from a blood vessel on one edge and leave with the lymph on the other. A dendritic cell settles among hundreds of T cells that wander at random, each pausing briefly when it touches the dendritic cell. One unmarked T cell carries a matching receptor; when it touches the dendritic cell it stays attached and begins to divide. A label contrasts the demo's odds with the real odds of roughly 1 in 100,000, and a small calculator shows how many dendritic cells sharing the work turn a search of days into one of minutes.
:::

:::deep-dive Where a T cell can leave the blood
A T cell in the blood cannot steer. It can leave only where it can adhere to the vessel wall, by the same sequence Chapter 2 described for neutrophils: rolling, firm arrest, then migration through the wall. Each step needs a ligand on the wall for one of the T cell's {{adhesion-molecule|adhesion molecules}} or chemokine receptors, so which walls carry which ligands determines where each kind of T cell can leave the blood. This targeting is called homing.

**Naive T cells** express L-selectin, an adhesion molecule of the {{selectin|selectin}} family, and CCR7, a receptor for chemokines made in lymph nodes and lymphatic vessels. Both find their ligands on {{high-endothelial-venule|high endothelial venules}}, specialized small vessels in lymph nodes named for their unusually tall lining cells. Binding by L-selectin makes the T cell roll. The chemokines displayed on the wall, acting through CCR7, then switch the T cell's {{integrin|integrins}} (the adhesion molecules for firm attachment) into a high-affinity state, so it arrests and migrates through the wall into the node.[^34] Vessels in healthy skin or muscle display neither ligand, so naive T cells seldom enter ordinary tissues, a safeguard in itself (Chapter 5). Maturing dendritic cells start to express the same CCR7, which guides them into the lymphatic vessels and on to the same nodes,[^35][^20] so one chemokine receptor brings dendritic cells and naive T cells to the same place.

**Leaving the node** means following a lipid signaling molecule, S1P, into the outgoing lymph and so back to the blood. A T cell that has found its match reduces the S1P receptor on its surface and stays to multiply; the multiple sclerosis drug fingolimod (Gilenya) does the same to most lymphocytes, retaining many of them in the nodes.[^36]

**Activated T cells** change their adhesion molecules. They lose most of those used for entering lymph nodes and gain ones that bind the walls of inflamed vessels, plus receptors for the chemokines inflamed tissue makes.[^37] On the vessel wall, those chemokines trigger the T cell's firm arrest; only after it has crossed the wall does it follow them along their concentration gradient. The site of priming can add a preference: dendritic cells from the gut make retinoic acid from vitamin A, which leads the T cells they prime to express the adhesion molecules and chemokine receptors for homing back to the gut.[^38] A tumor's vessels, too, must carry the right adhesion molecules and chemokines, or killer T cells pass it by (Chapter 7).
:::

## Two-factor authentication

Finding its peptide is not enough to activate a naive T cell.

Recognition alone would be a dangerous trigger: your own peptides are displayed everywhere, and screening in the thymus (Chapter 5) cannot have removed every T cell that reacts to some self peptide somewhere. A naive T cell's first activation therefore needs a second factor, on the same principle as two-factor authentication for a login.

**Signal 1 is recognition.** The T-cell receptor binds its peptide in the MHC groove, identifying *what* the target is.

**Signal 2 is confirmation**, called {{costimulation|costimulation}}. A receptor on the T cell called {{cd28|CD28}} must also bind its ligands on the dendritic cell, molecules called {{b7|B7}}. An unalarmed dendritic cell expresses only a little B7, and maturation raises it many times over, so signal 2 indicates that the presenting cell has detected danger.

The two factors come from two different cells, each checked in its own way. The T cell's receptor survived screening against self in the thymus; the dendritic cell's B7 rises mainly after its own pattern-recognition receptors have been triggered. Neither cell can start an adaptive response alone, which is a further benefit of T cells reading only what other cells present. For a killer T cell, a helper T cell often adds a third confirmation (Chapter 5).

Unlike a login, which checks each factor separately as pass or fail, the T cell combines the two signals, and signal 2 lowers the amount of signal 1 it needs: in lab-grown human T cells, costimulation cut the number of engaged receptors needed to respond from about 8,000 to about 1,500.[^39]

Signal 1 alone does more than fail to activate a T cell. In cell-culture experiments, T cells shown their peptide without a confirmation signal entered a lasting unresponsive state called **{{anergy|anergy}}**: they stayed alive but no longer responded, even to correct presentation later. An antibody that activated CD28 prevented it.[^27] In a living body the same encounter can also end with the T cell dividing briefly and then dying. Either way, recognition without confirmation removes a T cell from the response instead of activating it. This safeguard is a major part of *peripheral* {{tolerance|tolerance}}, which silences self-reactive T cells in the body as a backstop to the thymus.

This check governs only the *first* activation of a naive T cell, in a lymph node. Once activated and multiplied, killer T cells in the tissues act on recognition alone; the cell they kill needs no B7 (Chapter 5). Two-factor authentication controls the start of a response, not every action that follows.

In cancer, the same safeguard can work against the patient. Tumors are often inflamed, but mostly in a wound-healing way that does little to alarm dendritic cells (Chapter 2). The steady trickle of unalarmed dendritic cells still carries cross-presented tumor fragments to the lymph node, offering signal 1 with little signal 2, so the T cells that recognize them can become anergic or die instead of being activated. Cross-presentation makes anti-tumor immunity possible, but the right kind of alarm decides whether it produces killer T cells. As Chapter 7 shows, enough alarm gets through that many tumors do provoke T-cell responses.

**Signal 3 is instruction.** Unlike the two factors, it is not a check but information about what kind of response to mount. It arrives as {{cytokine|cytokines}}, signaling proteins secreted by the dendritic cell and its neighbors, among them the type I {{interferon|interferons}} of Chapter 2. Without them, even killer T cells that have received signals 1 and 2 multiply poorly and can drift toward tolerance.[^28] Because those cytokines depend on what the pattern-recognition receptors detected, the original threat shapes the response.

Once a T cell has been activated, it also starts expressing {{ctla-4|CTLA-4}}, a close relative of CD28 that binds the same B7 molecules more tightly and has the opposite effect: a brake competing with CD28 for the same ligands. Chapter 5 describes it in detail, and Chapter 8 covers a drug that blocks it.

:::deep-dive The names behind the signals
**B7** is two related proteins, CD80 and CD86, and CD28 and CTLA-4 both bind each of them. The **signal 3** cytokines that matter most for killer T cells are IL-12 and the type I interferons; when both are missing, cells that received signals 1 and 2 still divide poorly and tend toward tolerance.[^28] The specialist dendritic cells that cross-present best are called **cDC1s** (type 1 conventional dendritic cells). In mice they depend on a gene called *Batf3*, which let researchers delete them and show that tumor rejection then fails.[^22] Deleting a whole cell type also removes everything else it does, so a cleaner test came in 2018: mice whose cDC1s were present and still made IL-12, but lacked WDFY4, a protein needed for cross-presentation, also failed to reject tumors.[^40] In mice there is a second route as well: dendritic cells can acquire peptide-loaded class I molecules from tumor cells and display them intact, a process called cross-dressing.[^41] The steady trickle of unalarmed dendritic cells has also been measured: in mouse skin-draining lymph nodes, a population of "semi-mature" dendritic cells with low CD80 and CD86 arrives even without inflammation and can start T-cell responses of the kind that end in tolerance.[^20]
:::

:::figure ch04-three-signals
title: Two-factor authentication, plus signal 3
goal: After using this, the reader can predict a naive T cell's fate from the signals it receives — nothing, switched off, or activated — and understands that signal 1 without signal 2 is an active shutdown, not a neutral result.
kind: explorer
stage: dark
spec: |
  Stage tag (top right): "Illustrative". Built on ctx.ui.stepper (three guided steps, then
  all controls unlock) and the shared synapse scene (contact band with 'tcr-mhc' and
  'cd28-b7' pairs).

  A single contact scene in a lymph node (library lymphNodeField backdrop, faint "LYMPH
  NODE" label in t-caps): a presenting dendritic cell along the bottom of the stage meets
  one naive T cell above it. Three signal channels run across the contact zone, each
  independently switchable:

  · SIGNAL 1 (center) — a TCR paddle on the T cell meeting an mhc1 cup holding a peptide.
  · SIGNAL 2 (left) — library cd28 on the T cell (green-cyan #3DDC97 with a "+" icon)
    meeting library b7 studs on the dendritic cell (pale mint, NO icon). When signal 2 is
    OFF, the studs shrink to one or two faint, unlit nubs (not grayed-out copies of the lit
    version): a quiet presenter carries far too little B7 to count. It is a threshold, not
    a switch.
  · SIGNAL 3 (right) — cytokines in the dendritic cell's green arriving at a receptor on
    the T cell: solid green dots plus hollow green rings (interferons are drawn as rings).
    In-SVG label "briefing cytokines", with an "i" chip: "Mainly IL-12 and type I
    interferons."
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
  · 1 + 2 → "Activated": the T cell brightens, swells slightly and divides a few times
    (cell-actions.divide).
  · 1 + 2 + 3 → "Activated and briefed": as above, plus daughter cells acquire granule
    glyphs and an "armed killers" label; the division counter runs higher.
  Signals 2 and/or 3 without signal 1 always give "Walks on by". Signal 3 never rescues a
  cell that lacks signal 2.
  Directly under the outcome readout, one fixed line: "The brake that follows → Chapter 5."

  CONTROLS. (1) Three independent toggles, keyboard-operable, with on/off stated in text.
  (2) Scenario presets (segmented control), each setting the toggles and redrawing the
  presenting cell:
  · "Alarmed dendritic cell" (dendriticCell state 'mature') → 1+2+3; full B7 studs.
  · "Quiet dendritic cell, harmless self-protein" (state 'immature') → 1 only; sand peptide.
  · "Quiet dendritic cell, tumor debris" (state 'immature') → 1 only; hot-pink (#FF3D7F)
    peptide; one-line note: "Cross-presented tumor material without the right alarm: the
    T cells that could fight the tumor are switched off instead."
  Two small side annotations, always visible: "Naive T cells meet presenters in lymph
  nodes; ordinary body cells carry essentially no B7." and "This check governs a naive
  T cell's first activation. Armed killers act on signal 1 alone (Chapter 5)."

  No CTLA-4 appears anywhere in this figure (Chapter 5's ch05-brakes owns the brake).
  Acceptable simplifications: three channels instead of dozens of molecular pairs; CD80
  and CD86 merged as "B7"; division shown as a handful of cells; the dendritic cell's
  maturation shown only through its B7 studs and shape.

  MOBILE. Below 700px, portrait viewBox: dendritic cell as a wide band at the bottom, T
  cell above, the three channels side by side across the contact band with abbreviated
  labels and a legend. Outcome readout directly beneath the stage, then the toggles as a
  three-row list (label left, switch right), then presets as a stacked list.
steps:
  1. Signal 1 is recognition: the T cell's receptor binds its peptide in an MHC groove. On its own, it leaves a naive T cell unresponsive (anergic).
  2. Signal 2 is confirmation: CD28 on the T cell binds B7 on a dendritic cell that has detected danger. With both factors, the T cell activates and begins to divide.
  3. Signal 3 is instruction: cytokines tell the activated T cell what kind of response to mount, here turning its daughter cells into killer T cells that are ready to kill. Try the presets to see how a tumor that raises the wrong kind of alarm can silence the T cells that could attack it.
alt: An interactive contact in a lymph node between a dendritic cell and a naive T cell, with three switchable signals: receptor recognition of a peptide in an MHC groove, CD28 binding B7 confirmation molecules, and instructive cytokines. Recognition alone leaves the T cell unresponsive; adding confirmation activates it; adding cytokines turns its descendants into killer T cells ready to kill. Presets compare a danger-alarmed dendritic cell with quiet ones carrying self or tumor material.
:::

## What the T cell knows now

Every step in this chapter works by contact: cells display samples of their proteins, dendritic cells carry samples to a lymph node, a random search brings them to the rare T cell that can recognize them, and that cell activates only if recognition comes with confirmation.

Within days, that T cell becomes thousands through {{clonal-expansion|clonal expansion}}, all carrying the same receptor. They leave the node, now able to stop at inflamed blood vessels and enter tissues. How a killer T cell destroys one infected cell without harming its neighbors, and what keeps thousands of activated T cells from attacking the body's own tissues, is the subject of Chapter 5.

:::quiz
Q: A skin cell is infected by a virus, and nearby a dendritic cell has engulfed a bacterium. Which pairing is right?
- [x] Viral fragments on class I, read by killer T cells; bacterial fragments on class II, read by helper T cells — right: class I reports what a cell makes inside, class II what a presenter has taken in.
- [ ] Viral fragments on class II, read by helper T cells; bacterial fragments on class I, read by killer T cells — wrong: this swaps the displays; the infected cell makes viral protein inside, which feeds class I.
- [ ] Both kinds of fragment on class I, read by killer T cells, since class I is the display that nearly every cell carries — wrong: engulfed material goes mainly to class II; cross-presentation onto class I is a specialist exception.
- [ ] Neither cell shows anything until antibodies have marked the microbes for inspection — wrong: antigen presentation does not depend on antibodies at all.

Q: Two friends are infected with the same virus, and the infected cells of both make the same viral protein. A T cell that reads one peptide from that protein in friend A is copied, and a cell with the same receptor is placed in friend B, where it ignores the infected cells. Why?
- [ ] Friend B's proteasomes cleave the viral protein into completely different peptides — wrong: proteasomal cleavage is broadly similar; what differs is which peptides each person's grooves can bind.
- [ ] T-cell receptors work only inside the body in which they were made and selected — wrong: the receptor works anywhere; what differs is the display it has to read.
- [x] The receptor reads the peptide and its HLA groove together, and B's HLA differs — right: B's grooves either don't bind that peptide or present it in a groove the receptor doesn't fit.
- [ ] In friend B the peptide is displayed on class II rather than on class I — wrong: which class shows a fragment depends on where the protein came from, not on whose body it is in.

Q: Most tumors never infect a dendritic cell. How can killer T cells still be primed against them?
- [x] Specialist dendritic cells route engulfed tumor material onto their own class I — right: this is cross-presentation, and mice lacking these cells fail to reject tumors that normal mice reject.
- [ ] Killer T cells are primed from MHC class II, which shows what the dendritic cell has engulfed — wrong: killer T cells read class I; class II is read by helper T cells.
- [ ] Tumor cells travel to the lymph node and prime the naive T cells there themselves — wrong: tumor cells lack the confirmation signals needed to activate a naive T cell.
- [ ] Naive killer T cells patrol the tissues and attack any cell with an unusual display — wrong: naive T cells circulate through lymph nodes and need both signals before they can act.

Q: In a lymph node, a naive T cell meets its exact peptide on a dendritic cell that arrived without any danger signal, so it offers almost no costimulation. What is the most likely outcome?
- [ ] Nothing happens: it detaches unchanged and keeps searching other dendritic cells — wrong, and this is the intuition the experiments overturned.
- [ ] It activates more slowly, but after a few days becomes a killer anyway — wrong: signal 1 alone does not lead to activation.
- [x] It is inactivated: anergy, or sometimes brief division followed by death — right: recognition without confirmation removes the T cell from the response.
- [ ] It turns on the dendritic cell and attacks it as a threat — wrong: without costimulation a naive T cell cannot become a killer at all.
:::

:::takeaways
- T cells do not recognize folded proteins. They read short peptides held in the peptide-binding groove of MHC molecules on other cells' surfaces, which is how the immune system monitors the inside of cells.
- MHC class I, nearly every cell's shop window, displays samples of what the cell makes: the proteasome degrades proteins into fragments, TAP carries them into the ER, and 8–10-amino-acid peptides that bind a class I groove there are displayed on the surface. Viral and mutated proteins appear automatically, and a cell that loses its class I invites attack by NK cells.
- A T-cell receptor reads the peptide and the groove together (MHC restriction), and does so precisely despite a weak, brief bond. HLA genes are the most variable in the human genome, so each person displays a different subset of any threat; this underlies transplant rejection and is the reason personalized cancer vaccines must be matched to each patient's HLA.
- MHC class II, on professional antigen-presenting cells, is loaded in endosomes and displays longer fragments (13–25 amino acids) of what the cell has taken up from outside, along with much of its own protein. Killer (CD8) T cells read class I; helper (CD4) T cells read class II.
- Dendritic cells sample tissues and carry what they collect to lymph nodes, in a steady trickle or, after danger, in large numbers. There a random search finds the roughly 1-in-100,000 matching T cell. Cross-presentation by a specialized kind of dendritic cell is how killer T cells are primed against tumors.
- A naive T cell's first activation requires two-factor authentication — recognition (signal 1) plus CD28–B7 confirmation (signal 2) — followed by instructions from cytokines (signal 3). Signal 1 alone inactivates it (anergy), which protects against autoimmunity but can silence T cells that could fight a tumor. Once activated, killer T cells act on recognition alone.
:::

## Glossary
- antigen-presentation | antigen presentation | The process by which a cell degrades proteins into short peptides and displays them on its surface in MHC molecules, so T cells can detect what is happening inside or around it.
- mhc-class-i | MHC class I | The display molecules on nearly every cell with a nucleus, showing 8–10-amino-acid samples of the proteins the cell is making inside: the cell's shop window. Read by killer (CD8) T cells.
- mhc-class-ii | MHC class II | The display molecules of professional antigen-presenting cells, showing longer fragments (roughly 13–25 amino acids) of whatever reaches the cell's endosomes: material taken in from outside, alongside much of the cell's own protein. Read by helper (CD4) T cells.
- endosome | Endosome | A membrane-bound compartment inside a cell that receives material taken up from outside. Endosomes become more acidic as they mature and pass their contents to lysosomes for degradation; MHC class II molecules are loaded with peptides in these compartments.
- hla | HLA (human leukocyte antigen) | The human name for MHC molecules and the genes that encode them. HLA genes are the most variable in the human genome, which is why transplants must be matched and why each person displays a different subset of any threat.
- mhc-restriction | MHC restriction | The rule that a T cell recognizes its target fragment only when it is held by a particular MHC molecule, usually one of its owner's own HLA types.
- allele | allele | One of the different versions of a gene that exist across a population. More than 45,000 HLA alleles were known by mid-2026.
- endoplasmic-reticulum | endoplasmic reticulum (ER) | A folded internal membrane compartment where a cell assembles proteins destined for its surface; MHC class I molecules are loaded with peptides there.
- proteasome | proteasome | A barrel-shaped enzyme complex inside every cell that cleaves unwanted or faulty proteins into short fragments. Most fragments are broken down to amino acids and recycled; a few are carried into the ER by TAP and displayed on MHC class I.
- tap-transporter | TAP (transporter associated with antigen processing) | A pump in the membrane of the endoplasmic reticulum that carries peptides produced by the proteasome into the ER, where they can be loaded onto MHC class I molecules.
- anchor-residue | anchor residue | One of the few amino acids in a peptide, often the second and the last for class I, that must fit pockets in the floor of the peptide-binding groove for the peptide to stay bound. Different HLA versions have differently shaped pockets.
- peptide-binding-groove | Peptide-binding groove | The cleft along the outer face of an MHC molecule in which a peptide is held for T cells to inspect. Pockets in its floor accept the peptide's anchor residues. The class I groove is closed at both ends and holds peptides of 8–10 amino acids; the class II groove is open at both ends and holds longer ones. Most of the variation between HLA types lies in and around the groove.
- neoantigen | neoantigen | A peptide produced by a mutated protein in a cancer cell, which the immune system has never learned to tolerate: the result of a typo in a gene, displayed on the cell's MHC molecules.
- cd8-t-cell | killer T cell (CD8 T cell) | A T cell whose CD8 molecule binds MHC class I, so it can inspect the class I display of nearly any cell in the body and, once activated, kill cells displaying its target.
- cd4-t-cell | helper T cell (CD4 T cell) | A T cell whose CD4 molecule binds MHC class II, so it reads the class II display of professional antigen-presenting cells; it coordinates other parts of the response.
- co-receptor | Co-receptor | CD8 or CD4: a molecule on a T cell that binds the same MHC molecule as the T-cell receptor, at a site away from the peptide-binding groove, stabilizing the contact and helping to start signaling. CD8 binds MHC class I and CD4 binds class II, which ties killer T cells to class I and helper T cells to class II.
- antigen-presenting-cell | professional antigen-presenting cell | A cell equipped with MHC class II and costimulatory molecules. Dendritic cells, macrophages and B cells are the main ones, but in practice only dendritic cells reliably activate a naive T cell; macrophages and B cells mostly interact with T cells that are already activated.
- cross-presentation | cross-presentation | The ability of certain dendritic cells to route material they have taken up — for example from a dead tumor cell — onto their own MHC class I molecules, so that killer T cells can be primed against it.
- naive-t-cell | naive T cell | A mature T cell that has not yet met its target. Naive T cells circulate between blood and lymph nodes, sampling dendritic cells as they go.
- high-endothelial-venule | High endothelial venule | A specialized small blood vessel in lymph nodes (and some other lymphoid tissue) where naive lymphocytes leave the blood.
- cd3 | CD3 | The cluster of signaling chains bound to every T-cell receptor, together forming the TCR–CD3 complex. The receptor's antigen-binding chains cannot signal on their own; CD3 relays the activating signal into the cell.
- costimulation | costimulation | The confirming second signal a naive T cell needs for its first activation — chiefly CD28 on the T cell binding B7 molecules on a mature dendritic cell.
- cd28 | CD28 | The main costimulatory receptor on T cells. When it binds B7 alongside recognition, a naive T cell activates instead of becoming anergic.
- b7 | B7 (CD80 and CD86) | Two related molecules on antigen-presenting cells that rise sharply when danger signals mature them, providing the confirming signal to CD28 on T cells.
- anergy | anergy | A lasting unresponsive state induced in a T cell that recognizes its target without costimulation. The cell stays alive but stops responding — a safety mechanism that can also silence T cells able to fight a tumor.
- ctla-4 | CTLA-4 | A receptor that T cells make after activation. A close relative of CD28, it competes for the same B7 molecules but delivers an inhibitory signal: a brake. Covered in Chapter 5.

## Sources
1. Zinkernagel RM, Doherty PC. Restriction of in vitro T cell-mediated cytotoxicity in lymphocytic choriomeningitis within a syngeneic or semiallogeneic system. *Nature* 1974;248:701–702. doi:10.1038/248701a0
2. Townsend AR, Rothbard J, Gotch FM, Bahadur G, Wraith D, McMichael AJ. The epitopes of influenza nucleoprotein recognized by cytotoxic T lymphocytes can be defined with short synthetic peptides. *Cell* 1986;44:959–968. doi:10.1016/0092-8674(86)90019-x
3. Bjorkman PJ, Saper MA, Samraoui B, Bennett WS, Strominger JL, Wiley DC. Structure of the human class I histocompatibility antigen, HLA-A2. *Nature* 1987;329:506–512. doi:10.1038/329506a0
4. Bjorkman PJ, Saper MA, Samraoui B, Bennett WS, Strominger JL, Wiley DC. The foreign antigen binding site and T cell recognition regions of class I histocompatibility antigens. *Nature* 1987;329:512–518. doi:10.1038/329512a0
5. Garboczi DN, Ghosh P, Utz U, Fan QR, Biddison WE, Wiley DC. Structure of the complex between human T-cell receptor, viral peptide and HLA-A2. *Nature* 1996;384:134–141. doi:10.1038/384134a0
6. Rock KL, Reits E, Neefjes J. Present Yourself! By MHC Class I and MHC Class II Molecules. *Trends in Immunology* 2016;37:724–737. doi:10.1016/j.it.2016.08.010
7. Chicz RM, Urban RG, Lane WS, Gorga JC, Stern LJ, Vignali DA, Strominger JL. Predominant naturally processed peptides bound to HLA-DR1 are derived from MHC-related molecules and are heterogeneous in size. *Nature* 1992;358:764–768. doi:10.1038/358764a0
8. Dengjel J, Schoor O, Fischer R, et al. Autophagy promotes MHC class II presentation of peptides from intracellular source proteins. *Proceedings of the National Academy of Sciences USA* 2005;102:7922–7927. doi:10.1073/pnas.0501190102
9. Hill A, Jugovic P, York I, Russ G, Bennink J, Yewdell J, Ploegh H, Johnson D. Herpes simplex virus turns off the TAP to evade host immunity. *Nature* 1995;375:411–415. doi:10.1038/375411a0
10. Barker DJ, Natarajan RHL, Cooper MA, Hopper SJF, Yates AD, Parham P, Marsh SGE, Robinson J. The IPD-IMGT/HLA database: recent developments in sequence submission. *Nucleic Acids Research* 2026;54:D1152–D1158. doi:10.1093/nar/gkaf1218
11. IPD-IMGT/HLA Database. Allele statistics, release 3.65, July 2026 (45,421 HLA alleles; 30,894 class I). European Bioinformatics Institute; https://www.ebi.ac.uk/ipd/imgt/hla/about/statistics/ (accessed October 2026).
12. Suchin EJ, Langmuir PB, Palmer E, Sayegh MH, Wells AD, Turka LA. Quantifying the frequency of alloreactive T cells in vivo: new answers to an old question. *Journal of Immunology* 2001;166:973–981. doi:10.4049/jimmunol.166.2.973
13. Illing PT, Vivian JP, Dudek NL, et al. Immune self-reactivity triggered by drug-modified HLA-peptide repertoire. *Nature* 2012;486:554–558. doi:10.1038/nature11147
14. Mallal S, Phillips E, Carosi G, et al. HLA-B*5701 screening for hypersensitivity to abacavir. *New England Journal of Medicine* 2008;358:568–579. doi:10.1056/NEJMoa0706135
15. Stone JD, Chervin AS, Kranz DM. T-cell receptor binding affinities and kinetics: impact on T-cell activity and specificity. *Immunology* 2009;126:165–176. doi:10.1111/j.1365-2567.2008.03015.x
16. McKeithan TW. Kinetic proofreading in T-cell receptor signal transduction. *Proceedings of the National Academy of Sciences USA* 1995;92:5042–5046. doi:10.1073/pnas.92.11.5042
17. Valitutti S, Müller S, Cella M, Padovan E, Lanzavecchia A. Serial triggering of many T-cell receptors by a few peptide-MHC complexes. *Nature* 1995;375:148–151. doi:10.1038/375148a0
18. Purbhoo MA, Irvine DJ, Huppa JB, Davis MM. T cell killing does not require the formation of a stable mature immunological synapse. *Nature Immunology* 2004;5:524–530. doi:10.1038/ni1058
19. Sallusto F, Cella M, Danieli C, Lanzavecchia A. Dendritic cells use macropinocytosis and the mannose receptor to concentrate macromolecules in the major histocompatibility complex class II compartment: downregulation by cytokines and bacterial products. *Journal of Experimental Medicine* 1995;182:389–400. doi:10.1084/jem.182.2.389
20. Ohl L, Mohaupt M, Czeloth N, et al. CCR7 governs skin dendritic cell migration under inflammatory and steady-state conditions. *Immunity* 2004;21:279–288. doi:10.1016/j.immuni.2004.06.014
21. Bevan MJ. Cross-priming for a secondary cytotoxic response to minor H antigens with H-2 congenic cells which do not cross-react in the cytotoxic assay. *Journal of Experimental Medicine* 1976;143:1283–1288. doi:10.1084/jem.143.5.1283
22. Hildner K, Edelson BT, Purtha WE, et al. Batf3 deficiency reveals a critical role for CD8alpha+ dendritic cells in cytotoxic T cell immunity. *Science* 2008;322:1097–1100. doi:10.1126/science.1164206
23. Roberts EW, Broz ML, Binnewies M, et al. Critical role for CD103+/CD141+ dendritic cells bearing CCR7 for tumor antigen trafficking and priming of T cell immunity in melanoma. *Cancer Cell* 2016;30:324–336. doi:10.1016/j.ccell.2016.06.003
24. Jenkins MK, Moon JJ. The role of naive T cell precursor frequency and recruitment in dictating immune response magnitude. *Journal of Immunology* 2012;188:4135–4140. doi:10.4049/jimmunol.1102661
25. Alanio C, Lemaitre F, Law HKW, Hasan M, Albert ML. Enumeration of human antigen-specific naive CD8+ T cells reveals conserved precursor frequencies. *Blood* 2010;115:3718–3725. doi:10.1182/blood-2009-10-251124
26. Miller MJ, Hejazi AS, Wei SH, Cahalan MD, Parker I. T cell repertoire scanning is promoted by dynamic dendritic cell behavior and random T cell motility in the lymph node. *Proceedings of the National Academy of Sciences USA* 2004;101:998–1003. doi:10.1073/pnas.0306407101
27. Harding FA, McArthur JG, Gross JA, Raulet DH, Allison JP. CD28-mediated signalling co-stimulates murine T cells and prevents induction of anergy in T-cell clones. *Nature* 1992;356:607–609. doi:10.1038/356607a0
28. Curtsinger JM, Mescher MF. Inflammatory cytokines as a third signal for T cell activation. *Current Opinion in Immunology* 2010;22:333–340. doi:10.1016/j.coi.2010.02.013
29. Kuhns MS, Davis MM, Garcia KC. Deconstructing the form and function of the TCR/CD3 complex. *Immunity* 2006;24:133–139. doi:10.1016/j.immuni.2006.01.006
30. Godfrey DI, Uldrich AP, McCluskey J, Rossjohn J, Moody DB. The burgeoning family of unconventional T cells. *Nature Immunology* 2015;16:1114–1123. doi:10.1038/ni.3298
31. Fransen MF, Schoonderwoerd M, Knopf P, et al. Tumor-draining lymph nodes are pivotal in PD-1/PD-L1 checkpoint therapy. *JCI Insight* 2018;3:e124507. doi:10.1172/jci.insight.124507
32. Vrisekoop N, den Braber I, de Boer AB, et al. Sparse production but preferential incorporation of recently produced naive T cells in the human peripheral pool. *Proceedings of the National Academy of Sciences USA* 2008;105:6115–6120. doi:10.1073/pnas.0709713105
33. Mempel TR, Henrickson SE, von Andrian UH. T-cell priming by dendritic cells in lymph nodes occurs in three distinct phases. *Nature* 2004;427:154–159. doi:10.1038/nature02238
34. von Andrian UH, Mempel TR. Homing and cellular traffic in lymph nodes. *Nature Reviews Immunology* 2003;3:867–878. doi:10.1038/nri1222
35. Förster R, Schubel A, Breitfeld D, et al. CCR7 coordinates the primary immune response by establishing functional microenvironments in secondary lymphoid organs. *Cell* 1999;99:23–33. doi:10.1016/s0092-8674(00)80059-8
36. Matloubian M, Lo CG, Cinamon G, et al. Lymphocyte egress from thymus and peripheral lymphoid organs is dependent on S1P receptor 1. *Nature* 2004;427:355–360. doi:10.1038/nature02284
37. Fowell DJ, Kim M. The spatio-temporal control of effector T cell migration. *Nature Reviews Immunology* 2021;21:582–596. doi:10.1038/s41577-021-00507-0
38. Iwata M, Hirakiyama A, Eshima Y, et al. Retinoic acid imprints gut-homing specificity on T cells. *Immunity* 2004;21:527–538. doi:10.1016/j.immuni.2004.08.011
39. Viola A, Lanzavecchia A. T cell activation determined by T cell receptor number and tunable thresholds. *Science* 1996;273:104–106. doi:10.1126/science.273.5271.104
40. Theisen DJ, Davidson JT, Briseño CG, et al. WDFY4 is required for cross-presentation in response to viral and tumor antigens. *Science* 2018;362:694–699. doi:10.1126/science.aat5030
41. MacNabb BW, Tumuluru S, Chen X, et al. Dendritic cells can prime anti-tumor CD8+ T cell responses through major histocompatibility complex cross-dressing. *Immunity* 2022;55:982–997. doi:10.1016/j.immuni.2022.04.016
