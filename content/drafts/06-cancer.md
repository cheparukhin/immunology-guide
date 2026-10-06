---
id: 06-cancer
title: Cancer Cells and Tumor Antigens
subtitle: Cancer is evolution within one body. A cancer cell is almost entirely self, so the immune system has to detect the few things about it that are new.
part: II
reading_time: 24
hero: ch06-hero
---

In 2015, a team of geneticists near Cambridge, England, sequenced 74 cancer genes in 234 small samples of normal eyelid skin, removed from four people aged 55 to 73 during routine surgery. The skin was healthy.

Its DNA showed that it was a patchwork of thousands of small {{clone|clones}}, families of cells each descended from a single ancestor that had acquired a {{mutation|mutation}}, a change in the cell's DNA sequence. Roughly a quarter of the cells carried a mutation in a known cancer {{gene|gene}}, at a density of about 140 such mutations per square centimeter of skin, counting only the 74 genes the team sequenced.[^1]

Mutant cells are not rare; in aging tissue they can be everywhere. A cancer arises when one of these clones keeps out-competing its neighbors over many years.

This chapter opens Part II, which turns from how the immune system works to what it faces in cancer. What turns an ordinary cell into a cancer, and what then makes it look any different to a {{t-cell|T cell}} that tolerates the body's own proteins?

## A society of cells

The tens of trillions of {{cell|cells}} in your body live by a few rules: divide only when signaled to, stop when crowded, stay in place, and, if the DNA is badly damaged, die by {{apoptosis|apoptosis}}, programmed cell death.

Cancer is a population of cells that has stopped following those rules. A lump of surplus cells is a {{tumor|tumor}}; one that stays within its boundaries, as most moles do, is {{benign|benign}}, and one that invades neighboring tissue is {{malignant|malignant}}, a cancer. The deadliest step comes when cancer cells break away and form new tumors in distant organs: {{metastasis|metastasis}}, the most common cause of death from cancer.[^2]

"Cancer" is more than a hundred diseases, named for the tissue where each begins, and most fall into a few families. {{carcinoma|Carcinomas}}, by far the most common, start in {{epithelium|epithelial}} cells, which form the sheets lining organs and covering the skin, as most lung, breast, colon and prostate cancers do; {{sarcoma|sarcomas}} start in bone, muscle, fat or other connective tissue; leukemias, lymphomas and myeloma start in blood-forming and immune cells. Doctors often contrast {{solid-tumor|solid tumors}} with {{blood-cancer|blood cancers}}, a distinction that matters later: some immunotherapies have worked far better against blood cancers (Chapter 10). All of them arise through evolution.

## Where the typos come from

Each time a cell divides, it copies its entire {{dna|DNA}}, about six billion base pairs, the "letters" of its sequence. The copying is highly accurate but not perfect: a stem cell, one of the cells that replenish a tissue, acquires roughly three new mistakes every time it divides.[^3] Most fall where they make no difference; occasionally one falls in a gene that matters.

Copying errors are only one source of mutations. Others come from the environment or are inherited:

- **Sunlight.** Ultraviolet light damages DNA in skin cells, and imperfect repair leaves a characteristic pattern of base substitutions throughout the genomes of skin {{melanoma|melanomas}}, cancers of the skin's pigment cells.[^4]
- **Tobacco smoke.** Its chemicals damage DNA in the airways, with a pattern of their own.[^4] Lung cancers in smokers carry about ten times as many mutations as those in people who never smoked.[^5]
- **Infections.** Some viruses carry growth-promoting genes into human cells; other infections cause years of damaging inflammation (Chapter 2). Together they caused about 2.2 million cancers worldwide in 2018 — about one in eight (13%) — led by the stomach bacterium *Helicobacter pylori*, human papillomavirus (HPV) and the hepatitis B and C viruses.[^6]
- **Inheritance.** Almost all the mutations in a cancer are acquired during life and never passed to children. But some people are born with a high-risk version of a gene in every cell. Inherited faults in *BRCA1* or *BRCA2* sharply raise the risk of breast and ovarian cancer; inherited faults in genes that correct DNA copying errors cause {{lynch-syndrome|Lynch syndrome}}, with high risks of colon and uterine cancer.

Each process leaves its own {{mutational-signature|mutational signature}}, a characteristic pattern of changes from which geneticists can tell which processes caused most of a tumor's mutations.[^4]

:::deep-dive The "bad luck" debate
In 2015, Cristian Tomasetti and Bert Vogelstein compared the lifetime cancer risk of 31 tissues with the number of times the stem cells in each tissue divide over a lifetime. The two tracked each other closely (a correlation of 0.81), and they concluded that only about a third of the *variation in risk among tissues* came from environment or inheritance; the rest reflected random copying errors, or "bad luck".[^3] Headlines turned this into "most cancers are just bad luck," but the analysis explained why some tissues get cancer far more often than others, not why a particular person did. Critics, including Song Wu and colleagues, argued that the correlation cannot separate internal from external causes at all.[^7]

In 2017 the authors added data from 69 countries and a different estimate: across 32 cancer types in the United Kingdom, 66% of the *driver* mutations arose from copying errors, 29% from the environment and 5% from inheritance.[^3] But the share of mutations due to a cause is not the share of cancers that avoiding it would prevent. If a lung cancer needs three driver mutations and tobacco supplies just one, never smoking still prevents that cancer, even though the other two arose by chance. That is why these numbers are consistent with Cancer Research UK's estimate that about 4 in 10 UK cancers (38%) could be prevented.[^8]
:::

## Oncogenes and tumor suppressors

A mutation matters only if it falls in the right place. The great majority of mutations in a tumor are {{passenger-mutation|passengers}}: they are carried along without changing how the cell behaves. A few are {{driver-mutation|drivers}}, which give the cell an advantage over its neighbors; a typical tumor carries only about two to eight of them.[^5]

Drivers hit two kinds of gene, which biologists describe as a cell's gas pedals and brakes. These are not the T-cell accelerators and brakes of Chapter 5, which sit on immune cells; these act inside the would-be cancer cell (see the box below).

{{oncogene|Oncogenes}} are the gas pedals, and cancer-causing mutations keep them permanently active. Normally the signaling proteins that drive division are activated only when an external growth signal reaches the cell. KRAS, for example, is a {{protein|protein}} that relays growth signals from receptors at the cell surface to the cell's interior. In many cancers a single-base change in its gene swaps one amino acid in the chain: the twelfth, where glycine (G) becomes aspartic acid (D), a change called **G12D**. The protein is then locked in its active ("on") state, and the cell receives a growth signal all the time. An oncogene can also be overactive through sheer quantity: in some breast cancers the gene for HER2, a growth-signal {{receptor|receptor}}, is {{amplification|amplified}}, present in many extra copies (more than twentyfold in some tumors), which fills the cell surface with receptors.[^9]

{{tumor-suppressor|Tumor suppressors}} are the brakes, and cancer disables them. They halt division, repair damage or trigger apoptosis in a damaged cell. The best known, *TP53*, encodes a protein called p53 that senses DNA damage and determines whether the cell pauses for repair or undergoes apoptosis; it is mutated more often in human cancers than any other gene.[^5] Some tumor suppressors work through DNA repair rather than as brakes: *BRCA1*, *BRCA2* and the {{mismatch-repair|mismatch-repair}} genes, which correct copying errors, keep the genome intact, and when they fail, mutations accumulate faster throughout it.

:::key-idea
**Two kinds of brake.** Inside a cell, tumor suppressors such as p53 restrain *growth*; when a cancer disables them, the cancer gains. On a T cell, inhibitory receptors such as {{pd-1|PD-1}} and {{ctla-4|CTLA-4}}, the immune {{checkpoint|checkpoints}}, restrain the *attack*; when a drug blocks them (Chapter 8), the attack strengthens. Disabling the first kind helps the cancer; releasing the second works against it.
:::

The analogy has a limit: a real cell has dozens of interacting pedals and brakes, and an overactive oncogene often triggers a safeguard, such as p53, that halts or kills the cell. That is why a single driver is rarely enough, as the healthy but driver-laden eyelid skin showed.

In colon cancer, drivers usually accumulate in a typical order. A first driver, in a gene called *APC*, lets one cell's clone grow into a small, harmless lump, a polyp. A second, in *KRAS*, makes the lump grow faster. A third, in *TP53*, removes the p53 safeguard, and the descendants push through the basement membrane, the thin sheet of protein mesh beneath the gut's epithelium, at which point the growth is a cancer.[^5] Each step is a round of mutation followed by expansion of the clone that carries it, as the figure below simulates. Accumulating two to eight such hits in one lineage typically takes 20 to 30 years, which is why most cancers occur late in life.[^5]

Every cell is protected by several layers of defense. DNA repair fixes almost all of the tens of thousands of DNA lesions a cell can suffer each day;[^31] safeguards such as p53 catch many cells whose damage slips through; and because several hits must strike one lineage, most mutant clones stall. A cancer has overcome every layer. Chapter 7 describes another, outside the cell.

:::deep-dive Two hits, and why inherited faults matter
You carry two copies of most genes, one from each parent, and a cell with one working copy of a tumor suppressor can usually still use it. So an oncogene can be activated through a single faulty copy, while a tumor suppressor usually fails only when *both* copies are broken.

Alfred Knudson deduced this in 1971 from 48 cases of retinoblastoma, a cancer of the developing eye. Some children had a single tumor; others, often from affected families, had several, sometimes in both eyes. He proposed that the cancer needs two mutational "hits": in the inherited form, the first is present from conception in every cell, so a single further hit in any eye cell suffices, and carriers develop about three tumors on average; in the non-inherited form, both hits must strike the same cell by chance.[^10] The gene turned out to be *RB1*, a tumor suppressor that restrains cell division, and the two hits were mutations in its two copies.

The same logic explains inherited cancer risk generally. A person born with one broken copy of *BRCA1*, *BRCA2* or a mismatch-repair gene starts life one hit closer to cancer in every cell of their body. Some viruses bypass the hits: the E6 and E7 proteins of high-risk human papillomaviruses inactivate two tumor suppressors, p53 and RB, directly.[^11]
:::

## Evolution inside the body

In 1976 the American pathologist Peter Nowell proposed that a tumor begins as one cell. Its descendants keep mutating, so they vary; whichever variants out-reproduce their neighbors take over; and the cycle of variation, selection and expansion repeats. This is Darwinian evolution within one person, and Nowell called it {{clonal-evolution|clonal evolution}}, because the tumor and each of its sub-populations are clones.[^12]

No cell "wants" anything: mutations are random, and selection favors the cells that happen to divide more or die less. The process is slow, typically taking decades.[^13]

Clonal evolution gives each tumor a family tree. Mutations from the founding cell form the **trunk**: every cancer cell carries them. Later mutations form **branches**, carried by only some cells. The result is {{tumor-heterogeneity|tumor heterogeneity}}: one tumor, many slightly different subclones. In a UK study that sampled 327 regions from 100 early lung cancers, the major drivers were almost always in the trunk, while more than three-quarters of tumors also carried later drivers in only some branches.[^14] This tree matters for what the immune system can target (see "Trunk and branches" below).

:::figure ch06-clonal-evolution
title: Evolution in a patch of tissue
goal: After using this, the reader understands that cancer arises from random mutation plus selection — most mutations are harmless passengers, rare drivers let one family of cells out-compete its neighbors, several drivers must pile up in the same lineage — and that the result is a branching family tree in which trunk mutations are in every cancer cell and branch mutations in only some.
kind: simulation
stage: dark
spec: |
  SHARED PLATFORM (figure audit §2 G, §4). This figure's family tree is the reference style that
  ch11-personal-vaccine copies: a thick labeled "trunk", branches hue-shifted by at most ±25° (`shiftHue`) and
  always carrying a letter label and a hatch pattern (§4 rule 15). Cells come from the art library
  (`cancerCell({ clone })`), the guided run uses `ctx.ui.stepper` (§4 rule 21), and time is shown in the
  `ctx.ui.clock` HUD at the top left (§4 rule 16). Stage tags: "Illustrative" and "Time compressed". Nothing
  flashes (§4 rule 6).

  WHAT IT IS. An honest, simplified evolution simulator of a sheet of lining tissue (an epithelium, like the lining of
  the colon), with a guided "story" mode (7 steps, seeded and partly scripted so the story always plays out) and a
  free-play mode. The reader watches mutations appear at random, sees selection enlarge some families of cells, and
  sees a family tree grow alongside the tissue.

  LAYOUT (desktop, ~16:9 stage). Left ~62%: the TISSUE panel (Canvas 2D). Right ~38%: the FAMILY TREE panel (SVG)
  on top and a COUNTERS strip below it. Under the stage (HTML, not canvas): the step caption (ARIA live region) and
  the controls. MOBILE (< 700 px): portrait. Tissue panel on top (full width, aspect ~3:4), family tree below it
  (full width, ~220 px tall), counters as one line of small text. No horizontal page scroll; the tree compresses to
  fit the width (labels drop to single letters, full names in a tap tooltip).

  TISSUE PANEL. A hexagonal grid (desktop ~44 x 28 ≈ 1,200 sites; mobile ~26 x 24 ≈ 620 — the audit flags canvas
  cost, so keep the mobile grid small and cap the frame rate there). The top ~75% of rows are
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
  - New-mutation mark: whenever a division produces a mutation, a small pale dot swells on the daughter and fades
    over ~400 ms — a soft pulse, never a flash. Passenger = small neutral spark; driver = a larger spark with a gold ring and a brief floating label
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

COUNTERS STRIP. Time lives in the clock HUD ("Year 48 · time compressed"), mapped so that the story-mode cancer
  appears at ~40–60 "years". Beside it, one model readout for the eyelid callback — and because it is a teaching
  model, not data, it is given in words, not a percentage (§4 rule 19): "Cells carrying a driver: about a quarter",
  stepping through "hardly any / about one in ten / about a quarter / about a third". The measured range sits next to
  it as the real number (§4 rule 18): "measured in normal eyelid skin: 18–32% of cells". Average mutations per cell
  and drivers in the largest family belong in the tapped-cell card instead.

  CONTROLS. Stepper (Back / Next, step dots) for story mode; after step 7, free play unlocks: Play/Pause; Speed 1x /
  4x / 16x; Reset (new seed); Replay; segmented control "DNA repair: normal | faulty (10x mutations)".

  STORY MODE (each step plays a short scripted stretch, then holds; captions below are verbatim):
  1. Healthy tissue turns over at a steady rate. Sparks of passengers appear constantly; nothing changes visibly.
     Tree: a single root with a lengthening edge of ticks.
  2. Script a first driver ("APC") into one cell near the center. Its family slowly enlarges into a patch. Tissue
     still looks normal (cells keep their shape; thin violet rims only).
  3. Script two more first-driver clones elsewhere; run until at least one of them goes extinct by chance (show it
     turning hollow gray in the tree) while the APC patch persists. The driver readout climbs into its "about a
     quarter" band, matching the measured eyelid range shown beside it, by the time this caption appears.
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
  - At the end of step 3 the driver readout sits in its "about a quarter" band (internally 20–30% of cells), which is
    the range measured in normal eyelid skin (Martincorena et al. 2015: 18–32% of cells).
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
  1. A healthy epithelium renews itself constantly: cells divide just fast enough to replace those that are lost. Every division leaves a few copying errors, and almost all are passengers that change nothing.
  2. By chance, one cell picks up a driver mutation. Its descendants divide a little more often than their neighbors, so its clone slowly takes over a patch. The tissue still looks normal.
  3. Most driver clones stay small, and some die out by chance. Still, in an older body, normal-looking tissue becomes a patchwork of mutant clones, like the eyelid skin.
  4. A second driver arises inside the enlarged clone. The new subclone grows faster still and forms a small, benign bulge, like a polyp in the colon.
  5. A third driver arises in the same lineage. Its cells now cross the boundary layer, the basement membrane, into the tissue beneath, and a growth that invades is a cancer. (Real cancers usually need between two and eight drivers.)
  6. The cancer keeps mutating as it grows, so its family tree branches. Tap the trunk: its mutations are in every cancer cell. Tap a branch: its mutations are in only some.
  7. Run it yourself: most runs never produce a cancer, because several rare hits must land in the same lineage. Switching to faulty DNA repair changes that.
alt: A simulation of a sheet of tissue in which cells divide and occasionally pick up random mutations. Most mutations are harmless passengers; rare driver mutations let a clone grow slightly faster and take over a patch. After three drivers accumulate in one lineage, its cells become cancerous and push through the boundary layer (the basement membrane) beneath the tissue. A family tree beside the tissue shows the trunk mutations shared by every cancer cell and later branches found in only some of them.
:::

## The hallmarks — and the one this guide is about

In 2000, Douglas Hanahan and Robert Weinberg summarized what a cell lineage must acquire to become a dangerous cancer as six {{hallmarks-of-cancer|hallmarks of cancer}}: producing its own growth signals, ignoring signals to stop, resisting cell death, dividing without limit, recruiting a blood supply, and invading and spreading. In 2011 they provisionally added two more: rewiring the cell's energy metabolism, and the one this guide is about, **avoiding immune destruction**.[^15]

That raises a puzzle. A cancer is made of your own cells, so it is not obvious why it would need to evade the immune system; if it does, something about it must be visible.

:::deep-dive The hallmarks, version by version
The 2000 list described cancer cells; the 2011 revision added that a tumor is an ecosystem. Recruited, ostensibly normal cells (blood-vessel cells, immune cells and fibroblasts, the cells that make connective tissue) together form the {{tumor-microenvironment|tumor microenvironment}} and supply hallmark capabilities the cancer cells cannot supply themselves.[^15] Chapter 7 describes it in detail.

In 2022, Hanahan proposed further, provisional "new dimensions", among them cancer cells escaping the fixed identity of a mature cell type, and {{epigenetic|epigenetic}} changes, which alter which genes a cell expresses without changing its DNA sequence.[^16] The hallmarks are a list of capabilities, not a fixed sequence: different cancers acquire the same capability by different routes, and some capabilities come not from mutations but from the tumor's surrounding cells.
:::

## Altered self

To the immune system, almost everything about a cancer cell is *self*. Its proteins are your proteins, made from your genes. Its {{mhc-class-i|MHC class I}} molecules (Chapter 4) display thousands of {{peptide|peptides}}, nearly all of them the self peptides every healthy cell shows. T cells are tolerant of exactly these peptides: the T cells that reacted most strongly to them were removed long ago in the thymus by {{negative-selection|negative selection}} (Chapter 5).

A tumor also rarely produces the right kind of danger signal. Tumors are often inflamed, in the wound-healing way described in Chapter 2, but they are poor at making the particular signals that mature a {{dendritic-cell|dendritic cell}} and permit an attack, and a naive T cell that meets tumor antigen without signal 2 is more likely to become {{anergy|anergic}}, lastingly unresponsive, than to be activated (Chapter 4). Enough of the right signal gets through often enough to matter (Chapter 7). Immunologists sum up the cancer cell's status as **altered self**.

The immune system faces two problems with cancer. One is context: whether there is any danger at all, which Chapter 7 takes up. The other is recognition, this chapter's subject: whether anything about a cancer cell looks new to a T cell.

## Four ways to look different

Any molecule that lets the immune system tell a tumor cell from a healthy one is a {{tumor-antigen|tumor antigen}}. There are four kinds.[^17]

**Neoantigens.** {{neoantigen|Neoantigens}} are mutated peptides displayed on class I: sequences this body has never shown before (Chapter 4). They exist only in the tumor, so T cells were never made tolerant of them, but most are unique to one patient. A few recurring mutations, such as the KRAS change G12D, are shared by many patients, though they are targets only in those whose {{hla|HLA}} molecules, the human MHC molecules, can display them.

**Viral antigens.** Some cancers are driven by viruses, and their cells keep making viral proteins. In cervical cancer and many throat cancers, two papillomavirus proteins, E6 and E7, inactivate tumor suppressors, including p53.[^11] The cancer depends on them, so it cannot easily stop making them, and they are entirely foreign: among the most attractive tumor targets known. Such cancers still arise in people with working immune systems; Chapter 7 explains how. Epstein–Barr virus drives some lymphomas and nasopharyngeal cancers in a similar way,[^6] but those tumors express only one or two viral proteins, and those few are poorly recognized by T cells.[^18]

**Cancer-testis antigens.** More than two hundred genes are expressed almost nowhere in a healthy adult except in developing sperm cells, which carry no MHC class I, so T cells never encounter these proteins and are not tolerant of them.[^19] Many cancers reactivate these genes, and peptides from the proteins appear on class I. Because they are shared between patients, such {{cancer-testis-antigen|cancer-testis antigens}} are attractive targets for engineered T cells, though engineered receptors aimed at them have recognized similar proteins in healthy organs, with fatal results in early trials (Chapter 10).

**Tumor-associated antigens.** {{tumor-associated-antigen|Tumor-associated antigens}} are ordinary self proteins a tumor makes in excess, like HER2 in some breast cancers, or inherits from its tissue of origin, like melanoma's pigment-making proteins (gp100, MART-1).[^17] They are shared and easy to find, but healthy cells carry them too, so tolerance has weakened the T cells that might attack them, and an attack risks damaging healthy tissue.

The ideal target would be **specific** (only on cancer cells), **shared** (the same in many patients) and **common** (present in most cancers). No antigen is all three: viral and cancer-testis antigens come closest, but only some cancers carry them.

:::deep-dive Finding tumor antigens
For decades, many immunologists doubted that human tumors carried anything T cells could recognize. Thierry Boon's team in Brussels settled the question in 1991. They grew killer T cells from a melanoma patient who had done unusually well and identified the gene encoding the antigen those cells recognized on the patient's tumor. The gene, later named *MAGE-A1*, was silent in the normal tissues they examined but active in a range of tumors; it later turned out to be expressed in normal testis, which made it the first known cancer-testis antigen. In 1997, Lloyd Old's group found NY-ESO-1 by a different route, screening tumor proteins against a patient's own antibodies.[^17][^20]

Cancer-testis antigens are not entirely unseen by the immune system: some are made in small amounts in the thymus, where they can induce partial tolerance (Chapter 5). Their expression also tends to increase as cancers advance: in melanoma, MAGE-A1 and MAGE-A4 appeared in 20% and 9% of primary tumors, but 51% and 44% of distant metastases.[^19]

Tissue-type proteins show both sides of targeting shared self antigens. Melanoma cells keep making the proteins of normal pigment cells, such as gp100 and MART-1, and T cells attacking them can also destroy pigment cells in the skin. In a meta-analysis of 5,737 melanoma patients given various immunotherapies, 3.4% developed patches of depigmented skin, {{vitiligo|vitiligo}}, and those who did were less likely to see their cancer progress or to die.[^21] In these patients, damage to healthy pigment cells marked an immune attack that was also reaching the tumor.
:::

:::figure ch06-antigen-kinds
title: The target map
goal: After using this, the reader can name the kinds of tumor antigen, and understands the three-way trade-off between targets that are tumor-specific, targets shared between patients, and targets present in most cancers — and why nothing scores well on all three.
kind: explorer
stage: light
spec: |
  PURPOSE. One idea, one picture: every tumor antigen is a compromise. The reader reveals five example antigens on a
  two-axis map and reads, for each, where it is found in healthy tissue and what the catch is.

  SHARED PLATFORM (figure audit §2 G, §4). Built in the same task as ch11-personal-vaccine, and the two must share
  their chip, card and axis styling. Light stage, `chart.js` scales for the two axes, `ctx.ui.stepper` for the
  guided captions (no hand-rolled stepper), and the foundation `infoCard` for the detail card on every breakpoint
  (no bottom sheet). Stage tag: "Illustrative" (positions are qualitative). Surface-antigen glyphs follow §4 rule 4:
  HER2 is a diamond on a stalk; peptide-derived targets are beads, never on stalks.

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
    and most typos never reach the shop window. Used by: Personalized vaccines — one met its main goal in a phase 3
    melanoma trial in 2026 (company-reported), and none is approved yet (Chapter 11); also much of the T-cell attack
    that checkpoint inhibitors unleash (approved, Chapter 8).
  - KRAS G12D — What it is: A mutation that recurs at the same spot in many cancers: roughly 45% of pancreatic and
    13% of colorectal cancers. Found in healthy tissue: Nowhere. The catch: Each person's HLA molecules decide
    whether the mutant fragment is displayed at all. The best-documented type, HLA-C*08:02, is carried by roughly 8% of white and 11% of Black Americans, and
    HLA-A*11:01 can display an overlapping fragment that carries the same mutation; many people's types display it
    poorly or not at all. Used by: T-cell
    therapies (in trials, this chapter) and vaccines (in trials, Chapter 11).
  - HPV E6/E7 — What it is: Proteins of a virus that drives the cancer. Found in healthy tissue: Only in infected
    cells — never in healthy, uninfected tissue. The catch: Only virus-driven cancers have them, a minority of all
    cancers, and the tumors make them in small amounts. Used by: Therapeutic vaccines aimed at E6/E7 (in trials,
    Chapter 11); engineered T cells aimed at them are also in trials. Preventive HPV vaccines work differently: they are built from the virus's
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
  1. Every tumor target is a compromise. The horizontal axis shows how tumor-specific a target is, the vertical axis how many patients share it, and marker size how many cancers carry a target of that kind.
  2. Neoantigens sit far to the right, since only the tumor has them, but most are unique to one patient and sit near the bottom. A recurring mutation such as KRAS G12D sits higher, though only for patients whose HLA molecules can display it.
  3. Viral and cancer-testis antigens come closest to the ideal corner: foreign, or normally unseen by T cells, and shared by many patients. Their markers are small because only some cancers carry them.
  4. Self proteins such as HER2 are shared and easy to find, but healthy cells carry them too. Tolerance weakens the T cells that could attack them, and an attack risks damaging healthy tissue.
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

## A typo in the shop window

In 2016, Steven Rosenberg's team at the US National Cancer Institute reported on a 50-year-old woman whose colorectal cancer had spread to her lungs. Her tumor carried the KRAS change G12D, and among the T cells inside it the team found several that recognized the mutant peptide and ignored the normal one. They grew about a hundred billion of those cells and infused them back, and all seven lung metastases shrank.[^22]

Months later, one tumor grew back; its cells had lost the chromosome carrying the gene for the class I molecule those T cells depended on.[^22]

That dependence makes neoantigens difficult targets. Her T cells could recognize the mutant peptide only when it was presented by one particular {{allele|allele}}, or version, of one class I gene: HLA-C, one of the three class I genes from Chapter 4, in the version cataloged as C\*08:02, which roughly 8% of white and 11% of Black Americans carry.[^22] In someone without it, the same mutation would most likely have been invisible. A neoantigen requires both a mutation and an HLA type that can display it.

Most mutations never become targets. To become one, a mutation must clear five hurdles:

1. **Change the protein.** Many mutations fall between genes, or are "silent" (Chapter 1).
2. **Be made.** The mutated gene has to be expressed in the tumor.
3. **Be cut and presented.** The {{proteasome|proteasome}}, the protein complex that degrades proteins (Chapter 4), must cut out a peptide carrying the change, usually eight to ten amino acids long, that binds the {{peptide-binding-groove|peptide-binding groove}} of one of the patient's six or so class I HLA molecules.
4. **Look new.** If the changed amino acid is buried in the groove, the peptide still looks like self; the change has to alter the surface that the T-cell receptor contacts.
5. **Meet a matching T cell.** The body's T-cell receptor repertoire (Chapter 3) must include one that fits, and that T cell must be primed (Chapter 4).

When Rosenberg's group screened the T cells inside the tumors of 75 people with digestive-tract cancers, only 1.6% of the patients' protein-changing mutations were recognized, and 99% of those neoantigens were unique to one patient.[^23]

:::key-idea
Cancer cells are mostly, but not entirely, self. A small minority of their mutations produce neoantigens that T cells can recognize, and which ones depends on each patient's HLA types.
:::

:::figure ch06-typo-to-target
title: From typo to target
goal: After using this, the reader understands that a mutation becomes visible to a T cell only if it clears five hurdles in turn — and that the third hurdle, display by one of the patient's own HLA molecules, is decided by what that patient inherited, not by the tumor.
kind: stepper
stage: dark
spec: |
  SHARED PLATFORM (figure audit §2 E/F/L, §4). Built in the same task as ch04-peptide-plus-groove — step 4 here is
  that figure applied to a real patient — and it uses the art library's `mhc1({ peptide })` cups and `mhcGroove`
  close-up, `tcr` + `recognize()` for recognition, `ctx.ui.stepper` for the guided steps, `unit-grid.js` for the
  scoreboard, and the foundation `infoCard` for card text. Cups are drawn at ≥14 px wherever their identity matters.
  Peptide color follows §4 rule 3: self peptides sand, the mutant peptide hot pink with a glow. Nothing flashes
  (§4 rule 6). Stage tags: "Not to scale".

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
    the only allele label on screen: "HLA-C*08:02". Gate 3 ✓, and the loaded cup travels to the cancer-cell membrane. With
    Patient B the fragment slides out of all six cups and fades; gate 3 shows a crimson #E5484D "⊣" bar icon with
    "not displayed", and the gates beyond dim.
  - Step 5 (looks new, and a matching T cell): Patient A only. Side by side at the membrane: a healthy sand-colored
    cell displaying the normal fragment G A G G V G K S A, and the cancer cell displaying G A D G V G K S A. The T
    cell drifts past the healthy cell with no badge, stops at the cancer cell, and recognition is drawn the shared
    way: a recognition ring in the T cell's blue with a white core, plus a green-cyan "+" disc at the contact
    (§4 rule 5). No killing (that is Chapter 5), and no flash.
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

  THE SCOREBOARD (a `unitGrid`, never a funnel with per-stage numbers — §4 rule 18). Under the card strip, 100 small beads labeled
  "100 protein-changing mutations in a tumor". Two of them glow, labeled "about 2 are recognized by the patient's own
  T cells". Source line beneath, small: "Measured in 75 patients with digestive-tract cancers: 1.6% of
  protein-changing mutations were recognized (Parkhurst et al. 2019)." The losses at each gate are described in
  words in the caption, not drawn as numbers, because only the final share is measured.

  SCIENTIFIC CARE.
  - Patients A and B are hypothetical, and only HLA-C*08:02 is labeled. Do not give Patient B any of HLA-A*02,
    A*03 or A*11: peptides spanning codon-12 mutant KRAS have published reports of binding all three (HLA-A*11:01
    displays the longer, ten-amino-acid version), so a reader could rightly object. The caption says "none of their
    six grooves holds this fragment well enough to display it", not that no HLA type anywhere could.
  - Peptides are 8–10 amino acids and are drawn as short strings of beads, never as folded proteins.
  - HLA type, not the mutation alone, decides display: never show the mutant fragment in one of Patient B's cups.
  - The healthy cell's normal fragment is there to make the contrast; T cells tolerant to it ignore it.
  - Gate 4's "hidden in the groove" is the common case, not a rule: a mutation can also create an anchor and so make
    a fragment displayable that never was before (the deep-dive text covers this). Do not state it as a rule on screen.
  - CD4 T cells and MHC class II also see neoantigens; this figure shows only the class I route, by choice.
  - Reduced motion: tokens jump from gate to gate; no bead animation.
steps:
  1. In this tumor, one base of the KRAS gene has changed: its twelfth codon reads GAT instead of GGT.
  2. The cell's ribosomes read the changed codon and put aspartic acid (D) where glycine (G) belongs. The protein is locked in its active ("on") state and drives the cancer, so the cancer keeps making it.
  3. Like every protein, KRAS is eventually degraded by the proteasome. Most of the resulting peptides are broken down further, but one nine-amino-acid peptide, GADGVGKSA in the one-letter code, carries the change.
  4. Whether it is displayed depends on the patient's HLA molecules. One of Patient A's six, HLA-C*08:02, binds this peptide tightly and carries it to the surface. Switch to Patient B: none of their six peptide-binding grooves binds this peptide well enough to display it, and the mutation stays invisible.
  5. In Patient A, a passing T cell ignores the normal peptide on healthy cells and stops at the mutant one, which is now a target.
  6. In 2016, T cells like these shrank all seven lung metastases of a woman with colorectal cancer. Months later one grew back, and its cells had lost the chromosome carrying HLA-C*08:02. Now try the other typos.
alt: A step-by-step view of one mutation, KRAS G12D, from a changed DNA base to a changed protein, a peptide nine amino acids long, display on an HLA molecule and recognition by a T cell. A switch shows that the peptide is displayed in a patient who carries HLA-C*08:02 but not in a patient whose grooves cannot bind it. The reader can then send other typos down the same five gates — changing the protein, being made, being displayed, looking new, and meeting a matching T cell — and see where each one stops. A scoreboard shows that of 100 protein-changing mutations, about two are recognized by the patient's own T cells.
:::

:::deep-dive Why most mutations stay invisible
**The groove.** Each HLA class I molecule binds a peptide mainly through two or three {{anchor-residue|anchor residues}}, often the second amino acid and the last one. Prediction programs estimate a peptide's {{affinity|affinity}} for each of a patient's HLA molecules; peptides that bind only weakly are rarely displayed for long enough to provoke a response. Since each person has up to six class I types, each with its own binding preferences, the same tumor mutation yields a different set of candidates in every patient. (The route is the one described in Chapter 4: cut by the proteasome, pumped by the transporter {{tap-transporter|TAP}} into the {{endoplasmic-reticulum|endoplasmic reticulum}}, where newly made class I molecules wait, loaded onto one and carried to the surface.)

**Anchor mutations.** If a mutation changes an anchor, the T-cell-facing surface of the peptide may look exactly like the normal, tolerated version. The opposite also happens: a mutation can *create* an anchor, so a peptide that never bound before is displayed. T cells have then never encountered its normal counterpart on class I, and it can look new even though the only change is an amino acid buried in the groove. In one patient in a trial of PD-1 blockade, a mutation altered the last two amino acids of a peptide, and the mutant version bound its HLA molecule more than 100 times more tightly than the normal one.[^24]

**Prediction is still poor.** Display also depends on how much of the protein is made, how the proteasome cleaves it, and how long the loaded HLA molecule survives at the surface. In a worldwide benchmark published in 2020, teams nominated candidate neoantigens from shared tumor data and 608 of them were tested against the patients' own T cells; just 37 were recognized. The features that best separated recognized from unrecognized candidates were how tightly and how stably a peptide binds, how abundant it is in the tumor, and how foreign it looks to the T-cell repertoire. Combining those four filtered out 98% of the unrecognized candidates, while also discarding more than half of the real neoantigens. Two further patterns appeared: recognized peptides were slightly *less* {{hydrophobic|hydrophobic}} (water-repelling), and the change tended to sit just off the anchor positions.[^25]

**Not only killer T cells.** Neoantigen peptides can also be displayed on {{mhc-class-ii|MHC class II}}, which presents fragments of what a cell has taken up from outside (Chapter 4), and recognized by CD4 helper T cells. In early personalized-vaccine trials, most neoantigen responses came from helpers rather than killers (Chapter 11).

**Frameshifts are likely targets, not certain ones.** A mutation that inserts or deletes a base shifts the reading frame, so every amino acid after it is new (Chapter 1). The result is a long stretch the body has never become tolerant of, which is why such peptides are enriched among real neoantigens. But most frameshifts also create a premature stop codon, and the cell usually detects the faulty mRNA and degrades it after only a little of the altered protein has been made.

**Drivers and passengers.** Most neoantigens come from passengers, because there are so many more of them. Neoantigens from drivers like KRAS G12D are especially valuable: the cancer cannot easily lose a mutation it depends on, and it is usually present in every cancer cell. But only a few driver mutations recur often, and only some HLA types can display them.
:::

## How many typos is that?

Each protein-changing mutation has a small chance of producing a visible neoantigen, so tumors with more mutations have more chances. A high count guarantees nothing, though, and in some cancers it predicts response to immunotherapy poorly or not at all (Chapter 8). A typical childhood leukemia carries a handful of protein-changing mutations in all its coding DNA; a typical skin melanoma carries hundreds; the most extreme melanomas and lung cancers carry thousands. Only a handful of these are drivers. Counted per million bases of DNA sequenced (a "megabase"), typical tumors of different kinds differ about 150-fold, as the chart below shows, and individual tumors by more than a thousandfold.[^26] This count is a tumor's {{tumor-mutational-burden|tumor mutational burden}}, or TMB.

The ranking follows the causes described earlier: melanomas of sun-exposed skin and lung cancers of smokers are at the top,[^5] while melanoma of the eye, which arises from the same kind of cell shielded from sunlight, is near the bottom. Childhood cancers carry the fewest of all.[^27]

The outliers are tumors that have lost their {{mismatch-repair|mismatch-repair}} system, which corrects copying errors. DNA polymerase, the enzyme that copies DNA, slips most easily on {{microsatellite|microsatellites}}, short stretches where the same few bases repeat, such as CACACACA, and when repair fails, through an inherited fault as in Lynch syndrome or because the tumor silenced the gene itself, those slips go uncorrected. Such tumors are called {{msi-high|mismatch-repair deficient (MSI-high)}}, after the microsatellites where the damage shows, and in the chart below they carry roughly ten times as many mutations as tumors whose repair works. Many slips insert or delete a base, changing every amino acid from that point on (Chapter 1) and producing long stretches of new protein: {{frameshift|frameshift}} neoantigens, which look especially foreign.[^24]

Across 27 cancer types, a cancer's typical mutation count explained roughly half of the differences in how often it responded to PD-1-blocking drugs.[^28] That is why MSI-high status and a high count became {{biomarker|biomarkers}}, measurable signs of who is likely to benefit (Chapter 8). But a count is a crude measure. It says nothing about which mutations are displayed, and some cancers respond more often than their counts predict: Merkel-cell carcinoma, a rare skin cancer often caused by a virus, also offers foreign viral proteins as targets.[^28]

:::figure ch06-tmb
title: How many mutations?
goal: After using this, the reader understands that the number of mutations varies more than a thousandfold between and within cancer types; that sunlight and tobacco drive the highest counts while childhood cancers have the lowest; and that broken mismatch repair multiplies the count roughly tenfold — while knowing these are counts of mutations, not of visible neoantigens.
kind: chart
stage: light
spec: |
  SHARED PLATFORM (figure audit §2, §4). Built on `shared/chart.js` (log scale, axis, grid) with
  `ctx.ui.stepper` for the three guided captions and the foundation `infoCard` for the per-row card on every
  breakpoint (no bottom sheet). Real data on a light stage with a visible source line and per-row source tooltips
  (§4 rule 19); data marks use `--chart-1…5` rather than entity colors (§4 rule 20).

  PURPOSE. An honest, sourced "quantile dot strip" chart: one row per cancer type, each row a strip of 20 dots
  placed at the 2.5th, 7.5th, …, 97.5th percentiles of that type's tumor mutational burden (so each dot stands for
  one-twentieth — 5% — of the tumors). This shows both the typical value and the spread without plotting thousands
  of points. A guided three-step reveal, then free exploration.

  LAYOUT (desktop ~820 x 820 px, light stage = paper/surface background, ink lines).
  - Horizontal rows, one per cancer type (29 rows; data below), row height ~22 px, sorted by median (lowest at the
    bottom, highest at the top) within the current view. DEFAULT VIEW: only the twelve rows the captions need —
    Childhood B-cell leukemia, Medulloblastoma, Thyroid, Uveal melanoma, Pancreas, Breast, Colorectal MSS,
    Colorectal MSI-high, Bladder, Lung adenocarcinoma, Lung squamous-cell and Melanoma (skin) — with a "Show all 29"
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
    filled circles in ink-2; mismatch-repair-deficient (MSI-high) rows = filled diamonds in accent (#3D5AFE-ish indigo,
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
  - Step 3: Highlight the paired rows "Colorectal, MSS" and "Colorectal, MSI-high" and draw an arrow from the MSS
    median to the MSI-high median, labeled "≈ 11x". In the "Show all 29" view, draw the same arrow, unlabeled, on the
    endometrial pair.
  - After step 3: all rows at full opacity; a segmented control "Sort: by median | group childhood/adult" and a
    toggle "Show MSI-high rows" (on by default).

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
  1. Each row is one kind of cancer, and each dot stands for 5% of its tumors. Typical tumors differ about 150-fold, from childhood leukemias, with almost no protein-changing mutations, to skin melanomas. Individual tumors differ more than a thousandfold.
  2. The causes show in the counts. Melanomas of sun-exposed skin carry dozens of times more mutations than melanomas of the eye, which sunlight barely reaches. Lung cancers, mostly in smokers, rank near the top.
  3. A broken mismatch-repair system multiplies the count about tenfold, whatever the organ. These are counts of mutations, not of visible neoantigens, and only a small minority of mutations ever become targets.
data: |
  Units: protein-changing (nonsynonymous) somatic mutations per megabase, as computed by cBioPortal
  (TMB_NONSYNONYMOUS = count of nonsynonymous mutations / ~30 Mb exome). Childhood rows: primary tumors only. TCGA
  rows: all samples in each PanCancer Atlas study, almost always one per patient (skin melanoma in TCGA is mostly
  metastatic samples). Tumors recorded with
  zero mutations were excluded (in TCGA these are mostly samples whose mutation calls were filtered out; ovary had
  114 such samples, breast 57, kidney 46; childhood 24 in total).
  MSI status for colorectal and endometrial rows: MANTIS score > 0.4 = MSI-high (threshold of Bonneville et al. 2017),
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
  msi | Colorectal, MSI-high | 84 | 4.09 | 25.91 | 36.65 | 54.46 | 75.01 | 2.08 3.24 4.49 7.29 21.2 27.2 30.3 32.6 35.2 36.3 37.1 39.3 40.6 47.3 52.0 58.2 64.1 66.8 79.4 115.3 | Mismatch-repair deficient; about 11x the MSS median.
  adult | Endometrium (uterus), MSS | 352 | 1.10 | 1.40 | 1.83 | 2.75 | 42.97 | 0.83 1.01 1.13 1.31 1.37 1.43 1.50 1.63 1.70 1.80 1.90 2.03 2.17 2.36 2.58 3.10 4.28 7.76 115.2 343.5 | The top dots are "ultramutated" tumors with a broken proofreading enzyme (POLE), not mismatch-repair defects.
  msi | Endometrium (uterus), MSI-high | 161 | 9.90 | 13.73 | 20.00 | 33.23 | 155.63 | 6.17 8.73 10.1 11.3 12.5 14.2 14.8 15.9 18.2 19.4 21.0 22.0 24.3 26.9 29.8 34.2 43.9 90.0 216.4 383.9 | Mismatch-repair deficient; about 11x the MSS median.
  adult | Bladder | 409 | 1.93 | 3.07 | 5.77 | 10.40 | 16.87 | 0.90 1.63 2.10 2.53 2.90 3.33 3.75 4.33 4.91 5.59 6.05 6.87 7.63 8.43 9.72 11.1 12.8 14.3 20.0 28.9 | —
  adult | Lung adenocarcinoma | 561 | 1.33 | 2.83 | 6.73 | 13.70 | 23.07 | 0.67 1.13 1.63 2.07 2.53 3.17 3.70 4.27 5.03 6.27 7.13 8.20 9.27 10.8 12.7 14.6 16.7 20.2 26.5 41.2 | Very wide spread: includes both smokers and never-smokers; smokers' lung cancers carry about 10x more mutations (Vogelstein et al. 2013).
  adult | Lung squamous-cell | 469 | 3.76 | 5.60 | 7.93 | 11.33 | 17.23 | 1.67 3.30 4.20 4.96 5.40 5.85 6.20 6.67 7.13 7.61 8.17 8.90 9.65 10.5 11.1 11.8 12.7 15.1 19.8 30.5 | Strongly tied to smoking.
  adult | Melanoma (skin) | 440 | 2.52 | 7.04 | 14.88 | 31.39 | 54.30 | 0.77 2.00 3.49 5.00 6.31 7.65 9.26 10.7 12.3 13.7 15.7 18.2 20.8 23.3 28.2 32.7 40.8 50.3 63.6 103.1 | Sunlight's signature dominates; the highest single tumor in these data lies above 1,000 per megabase, beyond the axis.
  Summary rows (optional, for a footnote): all 32 TCGA cancer types together (n = 10,105 after excluding zeros) median 2.0; all tumors of children and young adults in the study (n = 771) median 0.23 by this method, against the 0.13 per megabase published by Gröbner et al. for the same cohort.
  Method references for the builder: MSI calls use the MANTIS average-distance threshold of 0.4 from Bonneville R, et al. Landscape of microsatellite instability across 39 cancer types. *JCO Precis Oncol* 2017. doi:10.1200/PO.17.00073. Adult mutation calls come from Hoadley KA, et al. *Cell* 2018;173:291–304 and the MC3 project, Ellrott K, et al. *Cell Syst* 2018;6:271–281. The kidney row's note follows Turajlic S, et al. *Lancet Oncol* 2017;18:1009–1021, in which renal cell carcinoma had the highest share of insertion/deletion mutations and indel-derived neoantigens were nine times more enriched for mutant-specific HLA binding than those from single-letter swaps.
alt: A chart of how many protein-changing mutations tumors carry, per million DNA bases, on a logarithmic scale, for 27 kinds of cancer (colorectal and endometrial cancers are each split by mismatch-repair status), with each dot representing 5% of tumors of that kind. Childhood cancers such as leukemia and retinoblastoma have the fewest, with medians around 0.1; skin melanoma and smoking-related lung cancers have the most, with medians around 7 to 15 and some tumors above 100. Melanoma of the eye carries about forty times fewer mutations than melanoma of the skin, and colorectal and endometrial tumors with broken mismatch repair carry about eleven times more than those whose repair is intact.
:::

:::clinic
In many hospitals, every newly diagnosed colorectal cancer is tested for mismatch-repair deficiency, as US pathology and oncology societies recommend. About 15% of them turn out to be deficient: roughly four-fifths of those because the tumor silenced a repair gene itself, and the remaining fifth because of an inherited fault — Lynch syndrome, which can then be tested for in the patient's relatives.[^29] (In cancers that have already spread, the share is smaller, about 4%.[^24]) The same test now also flags patients whose advanced cancers are likely to respond to checkpoint inhibitors (Chapter 8).
:::

## Trunk and branches

Whether a neoantigen is a useful target also depends on where its mutation sits on the tumor's family tree, as in the simulation above. A neoantigen from a **trunk** mutation is on every cancer cell and is called {{clonal-neoantigen|clonal}}; one from a **branch** is on only some cells and is called subclonal. T cells that destroy one branch leave the rest of the tumor to regrow.

In 2016, Nicholas McGranahan, Charles Swanton and colleagues in London found support for this in patients: people whose lung cancers carried many trunk neoantigens tended to live longer, and in advanced lung cancer and melanoma, tumors rich in trunk neoantigens responded better to checkpoint inhibitors.[^14]

Shared antigens can also be patchy: of 25 synovial sarcomas, 20 carried NY-ESO-1, and in 6 of those only some of the cells did.[^30] That is one reason therapies aimed at a single antigen often leave surviving cancer cells (Chapters 9 and 10), and why designers of personalized vaccines favor trunk mutations (Chapter 11).

## The view from the T cell

To a T cell, a cancer cell's class I display consists almost entirely of familiar self peptides, with perhaps a handful of new ones from a mutated protein, a viral protein or a cancer-testis protein. Whether those peptides are displayed depends on the patient's HLA types; whether they are worth attacking depends on whether every cancer cell carries them.

The display also changes as the tumor evolves. If T cells kill the cells displaying a conspicuous neoantigen, cells that happen not to display it take over, as in the woman whose regrown tumor had lost an HLA gene, and the immune system becomes one more selective force.

Recognition is also only half the problem: even a visible tumor may provoke no response without a danger signal. Chapter 7 asks why, if T cells can sometimes recognize cancer cells, anyone gets cancer at all.

:::quiz
Q: A drug that blocks PD-1 "releases a brake." Which statement about brakes is correct?
- [ ] It repairs the broken p53 brake inside cancer cells — p53 is a growth brake inside the cancer cell, and PD-1 blockers do not touch it.
- [x] It releases a brake on T cells — PD-1 sits on T cells, so blocking it frees them to attack. The tumor-suppressor brakes like p53 sit inside cancer cells, and breaking those helps the cancer.
- [ ] It unjams a stuck gas pedal such as mutant KRAS — KRAS is an oncogene inside the cancer cell, unrelated to PD-1.

Q: Two people have the same kind of cancer, and both tumors carry exactly the same KRAS mutation, G12D. T cells in one patient recognize it; in the other, the mutation seems invisible. What is the most likely reason?
- [ ] The second patient's tumor is not really driven by KRAS, despite carrying the mutation — the same driver mutation is present, and at work, in both tumors.
- [ ] The second patient's cells have stopped sending KRAS to their proteasomes — every cell degrades its own proteins; that is not the difference.
- [x] They inherited different HLA types, and only some can bind the mutant peptide — display depends on the grooves each person happens to have.
- [ ] T cells can only see mutations in passenger genes, never in drivers like KRAS — drivers can be seen too, as this very mutation shows.

Q: A colon cancer has lost its mismatch-repair system. Why does it carry roughly ten times more mutations than one whose repair is intact?
- [ ] Its cells divide about ten times faster, so they make ten times more copying errors — mismatch repair corrects copying slips; it does not set the pace of division.
- [x] Copying slips are no longer corrected, so they pile up everywhere — especially in the repeated stretches called microsatellites.
- [ ] It was exposed to more ultraviolet light, the main cause of high mutation counts — sunlight damages skin, not the lining of the colon.
- [ ] It carries more driver genes than an ordinary colon cancer does — every cell carries the same genes; what differs is which ones are mutated.

Q: Why are cancer-testis antigens such as NY-ESO-1 attractive targets, even though healthy sperm cells make them too?
- [x] Sperm cells lack MHC class I, so T cells never became tolerant of them — and because many patients' tumors express the same genes, one therapy can fit many people.
- [ ] They are made by every cell in a tumor that carries them, so no cancer cell can escape — they are often patchy, present in only some of a tumor's cells.
- [ ] They are viral proteins left behind by old infections, and therefore foreign — they are human proteins, just ones a healthy adult hardly ever displays.
:::

:::takeaways
- Cancer is evolution inside the body: random mutations create variation, and cells that happen to divide more or die less take over. Clones of mutant cells are common even in healthy aging tissue.
- Most mutations are passengers. A few drivers activate oncogenes such as KRAS (the cell's gas pedals) or disable tumor suppressors such as p53 (its growth brakes), which are not the immune brakes PD-1 and CTLA-4. Two to eight drivers, accumulated over decades, are typically needed.
- Tumors grow as branching family trees: trunk mutations are in every cancer cell, branch mutations in only some. "Avoiding immune destruction" is one of the recognized hallmarks of cancer.
- A cancer cell is altered self. T cells can tell it apart only through tumor antigens, of four kinds: neoantigens, viral antigens, cancer-testis antigens and self proteins a tumor overproduces, each trading tumor-specificity against how many patients share it.
- Only a small minority of mutations ever become visible neoantigens (1.6% in one large study), and which ones depends on each patient's HLA types.
- Mutation counts differ by more than a thousandfold: highest with sunlight, tobacco and broken DNA repair (MSI-high), lowest in childhood cancers. More mutations, and more trunk neoantigens, tend to mean more targets, the basis for the biomarkers in Chapter 8 and the vaccines in Chapter 11.
:::

## Glossary
- clone | Clone | A family of cells descended from a single ancestor cell.
- mutation | Mutation | A change in the sequence of a cell's DNA. Mutations can be inherited or acquired during life; most are harmless, but some change a protein.
- gene | Gene | A stretch of DNA that encodes a protein (or a few related versions of one).
- t-cell | T cell | A white blood cell that recognizes protein fragments displayed on MHC molecules, using its own unique receptor. Killer (CD8) T cells destroy infected or cancerous cells; helper (CD4) T cells coordinate the response.
- cell | Cell | The basic living unit of the body: a membrane-bound compartment containing, in most cases, a full copy of the body's DNA.
- apoptosis | Apoptosis | Programmed cell death, in which a cell dismantles itself into membrane-wrapped fragments that other cells engulf, without spilling its contents or causing inflammation.
- tumor | Tumor | A lump of cells growing beyond the body's normal controls. Tumors can be benign or malignant.
- benign | Benign | Describes a tumor that grows but stays within its boundaries, without invading nearby tissue or spreading.
- malignant | Malignant | Describes a tumor that invades neighboring tissue and can spread to other organs; another word for cancerous.
- metastasis | Metastasis | The spread of cancer cells from where they started to distant organs, where they form new tumors (metastases).
- carcinoma | Carcinoma | A cancer that starts in epithelial cells, which line the skin and the surfaces of organs. Most common cancers, such as lung, breast, colon and prostate cancer, are carcinomas.
- epithelium | Epithelium | A sheet of tightly joined cells that covers the skin and lines the surfaces of organs and body cavities. Carcinomas, the most common cancers, arise from epithelial cells.
- sarcoma | Sarcoma | A cancer that starts in connective tissue such as bone, muscle, fat or cartilage.
- solid-tumor | Solid tumor | A cancer that grows as a mass in an organ or tissue, such as most cancers of the lung, breast, colon or skin; contrasted with blood cancers.
- blood-cancer | Blood cancer | A cancer of blood-forming or immune cells (leukemia, lymphoma or myeloma), growing mainly in the bone marrow, blood and lymph nodes.
- dna | DNA | The long, double-stranded molecule that stores genetic information as a sequence of four bases, written A, C, G and T. Each strand is a chain of nucleotides, and the bases of the two strands pair up, A with T and C with G.
- lynch-syndrome | Lynch syndrome | An inherited condition caused by a faulty copy of a mismatch-repair gene. It sharply raises the risk of colorectal, endometrial and several other cancers.
- mutational-signature | Mutational signature | The characteristic pattern of DNA changes left by a particular cause of mutation, such as sunlight, tobacco smoke, aging or a broken repair system.
- passenger-mutation | Passenger mutation | A mutation that gives a cell no advantage and is simply carried along as its descendants multiply. Most mutations in a tumor are passengers.
- driver-mutation | Driver mutation | A mutation that gives a cell a growth or survival advantage, pushing it toward cancer. A typical tumor carries roughly two to eight.
- oncogene | Oncogene | A gene whose mutated or overactive form drives cancer by keeping the cell's growth signaling permanently active: a growth "gas pedal" held down. Examples include KRAS and HER2.
- protein | Protein | A chain of amino acids folded into a precise shape that does a job in the body, such as building, signaling, speeding up chemical reactions or recognizing other molecules.
- receptor | Receptor | A protein, often on the cell surface, that binds a specific signal molecule and relays the message into the cell.
- amplification | Gene amplification | The presence of extra copies of a gene, sometimes dozens, so that a cell makes far more of its protein than normal.
- tumor-suppressor | Tumor suppressor | A gene whose normal job is to restrain cell division, repair DNA or trigger apoptosis: a growth brake inside the cell. Examples include TP53 and RB1. Not to be confused with immune checkpoints, which are brakes on T cells.
- mismatch-repair | Mismatch repair | The cell's system for finding and fixing mismatched bases and small slips left behind when DNA is copied.
- checkpoint | Immune checkpoint | An inhibitory receptor (a "brake") on immune cells, such as PD-1 or CTLA-4, that prevents overreaction and autoimmunity; checkpoint inhibitors are drugs that block these brakes.
- ctla-4 | CTLA-4 | An inhibitory ("brake") receptor on T cells that acts mainly during activation in lymph nodes, by outcompeting the activating receptor CD28 for their shared ligands, the B7 molecules.
- pd-1 | PD-1 | An inhibitory ("brake") receptor on activated T cells. When it binds its ligands, PD-L1 or PD-L2, it dampens the T cell's activity.
- clonal-evolution | Clonal evolution | The process, set out for cancer by Peter Nowell in 1976, by which random mutation and selection let ever-fitter clones take over a tumor.
- tumor-heterogeneity | Tumor heterogeneity | Differences between the cells of one tumor, which arise as different branches of its family tree pick up different mutations.
- hallmarks-of-cancer | Hallmarks of cancer | A framework introduced by Douglas Hanahan and Robert Weinberg in 2000, and expanded in 2011 and 2022, listing the capabilities a cell lineage acquires on its way to becoming a dangerous cancer — including avoiding immune destruction.
- tumor-microenvironment | Tumor microenvironment | Everything in and around a tumor that is not a cancer cell: blood vessels, fibroblasts, immune cells, signaling molecules and the fibers between cells.
- epigenetic | Epigenetic | Describes chemical and structural marks on DNA and its packaging that control which genes a cell can use, without changing the DNA sequence. They can make a cell's identity stable.
- mhc-class-i | MHC class I | The display molecules on nearly every cell with a nucleus, showing 8–10-amino-acid samples of the proteins the cell is making inside: the cell's shop window. Read by killer T cells.
- peptide | Peptide | A short chain of amino acids — a fragment of a protein. MHC class I molecules usually display peptides 8 to 10 amino acids long.
- negative-selection | Negative selection | The test in the thymus that removes developing T cells whose receptors bind self-peptides too strongly.
- dendritic-cell | Dendritic cell | A star-shaped immune cell that samples tissues, picks up antigens, and carries them to lymph nodes to activate T cells.
- anergy | Anergy | A lasting unresponsive state that a T cell enters when it recognizes its target without receiving the confirming (costimulatory) signal. The cell stays alive but no longer responds; this protects against autoimmunity but can also silence T cells able to attack a tumor.
- tumor-antigen | Tumor antigen | Any molecule that lets the immune system tell a tumor cell from a healthy one, such as a neoantigen, a viral protein, a cancer-testis antigen or an overexpressed self protein.
- neoantigen | Neoantigen | A peptide produced by a mutated protein in a cancer cell, to which the immune system has never become tolerant. Displayed on MHC, it can mark the cell as abnormal.
- hla | HLA | The human version of MHC. HLA genes are extremely varied between people, and each person inherits two sets, one from each parent.
- cancer-testis-antigen | Cancer-testis antigen | A protein made almost nowhere in a healthy adult except in developing sperm cells — which carry no MHC class I and so never show it to T cells — but re-expressed in many cancers. Examples include NY-ESO-1 and MAGE-A4.
- tumor-associated-antigen | Tumor-associated antigen | A normal self protein that tumor cells make in excess, or that belongs to their tissue of origin, such as HER2 or pigment-cell proteins. Healthy cells carry it too.
- vitiligo | Vitiligo | Patchy loss of skin color, caused when the immune system destroys pigment-producing cells.
- allele | Allele | One of the different versions of a gene that exist across a population. More than 45,000 HLA alleles were known by mid-2026.
- proteasome | Proteasome | A barrel-shaped protein complex inside every cell that degrades unwanted proteins into short peptides, some of which are displayed on MHC class I.
- peptide-binding-groove | Peptide-binding groove | The cleft along the outer face of an MHC molecule in which a peptide is held for T cells to inspect. Pockets in its floor accept the peptide's anchor residues. The class I groove is closed at both ends and holds peptides of 8–10 amino acids; the class II groove is open at both ends and holds longer ones. Most of the variation between HLA types lies in and around the groove.
- anchor-residue | Anchor residue | One of the few amino acids in a peptide, often the second and the last for class I, that must fit pockets in the floor of the peptide-binding groove for the peptide to stay bound. Different HLA versions have differently shaped pockets.
- affinity | Affinity | The strength of binding between two molecules at a single binding site, usually measured as a dissociation constant (K<sub>D</sub>). It reflects the balance between binding and dissociation; for most immune molecules, mainly how long partners stay bound.
- tap-transporter | TAP (transporter associated with antigen processing) | A pump in the membrane of the endoplasmic reticulum that carries peptides produced by the proteasome into the ER, where they can be loaded onto MHC class I molecules.
- endoplasmic-reticulum | Endoplasmic reticulum (ER) | A folded internal compartment where a cell assembles proteins destined for its surface. MHC class I molecules are loaded with their peptides there.
- hydrophobic | Hydrophobic and hydrophilic | Hydrophobic (water-repelling) molecules, or parts of molecules, are not attracted by water and cluster together in it. Hydrophilic (water-attracting) ones are charged or polar (carrying slight positive and negative charges) and mix readily with water. The difference shapes cell membranes and drives protein folding.
- mhc-class-ii | MHC class II | The display molecules of professional antigen-presenting cells such as dendritic cells, macrophages and B cells. They show longer fragments (roughly 13–25 amino acids) of material the cell has taken up from outside, alongside much of the cell's own protein, and are read by helper (CD4) T cells.
- tumor-mutational-burden | Tumor mutational burden (TMB) | The number of mutations in a tumor's DNA, counted per million bases sequenced (a megabase) — normally in the protein-coding part. Numbers from different tests are not directly comparable. A high count often, but not always, means more neoantigens.
- microsatellite | Microsatellite | A short stretch of DNA in which a few bases repeat many times, such as CACACACA. DNA polymerase, the enzyme that copies DNA, slips easily on these repeats.
- msi-high | Mismatch-repair deficient (MSI-high) | The state of a tumor whose mismatch-repair system is broken, so uncorrected copying slips pile up in microsatellites and throughout its DNA. Such tumors carry many mutations, including many frameshifts. Also abbreviated dMMR.
- frameshift | Frameshift mutation | An insertion or deletion of DNA bases (not in a multiple of three) that shifts how the sequence is read in three-base codons, changing every amino acid after it.
- melanoma | Melanoma | A cancer of melanocytes, the pigment-producing cells of the skin (and, more rarely, the eye and mucous membranes). It usually carries many mutations, often caused by sunlight.
- biomarker | Biomarker | Something measurable in a patient or their tumor that predicts how the disease will behave or who is likely to benefit from a treatment.
- clonal-neoantigen | Clonal (vs subclonal) neoantigen | A clonal neoantigen comes from a mutation present in every cancer cell, the trunk of the tumor's family tree; a subclonal one is found only in some branches.

## Sources
1. Martincorena I, Roshan A, Gerstung M, et al. High burden and pervasive positive selection of somatic mutations in normal human skin. *Science* 2015;348:880–886. doi:10.1126/science.aaa6806
2. Dillekås H, Rogers MS, Straume O. Are 90% of deaths from cancer caused by metastases? *Cancer Med* 2019;8:5574–5576. doi:10.1002/cam4.2474
3. Tomasetti C, Vogelstein B. Variation in cancer risk among tissues can be explained by the number of stem cell divisions. *Science* 2015;347:78–81. doi:10.1126/science.1260825 — and: Tomasetti C, Li L, Vogelstein B. Stem cell divisions, somatic mutations, cancer etiology, and cancer prevention. *Science* 2017;355:1330–1334. doi:10.1126/science.aaf9011
4. Alexandrov LB, Nik-Zainal S, Wedge DC, et al. Signatures of mutational processes in human cancer. *Nature* 2013;500:415–421. doi:10.1038/nature12477
5. Vogelstein B, Papadopoulos N, Velculescu VE, Zhou S, Diaz LA Jr, Kinzler KW. Cancer genome landscapes. *Science* 2013;339:1546–1558. doi:10.1126/science.1235122
6. de Martel C, Georges D, Bray F, Ferlay J, Clifford GM. Global burden of cancer attributable to infections in 2018: a worldwide incidence analysis. *Lancet Glob Health* 2020;8:e180–e190. doi:10.1016/S2214-109X(19)30488-7
7. Wu S, Powers S, Zhu W, Hannun YA. Substantial contribution of extrinsic risk factors to cancer development. *Nature* 2016;529:43–47. doi:10.1038/nature16166
8. Brown KF, Rumgay H, Dunlop C, et al. The fraction of cancer attributable to modifiable risk factors in England, Wales, Scotland, Northern Ireland, and the United Kingdom in 2015. *Br J Cancer* 2018;118:1130–1141. doi:10.1038/s41416-018-0029-6
9. Slamon DJ, Clark GM, Wong SG, Levin WJ, Ullrich A, McGuire WL. Human breast cancer: correlation of relapse and survival with amplification of the HER-2/neu oncogene. *Science* 1987;235:177–182. doi:10.1126/science.3798106
10. Knudson AG Jr. Mutation and cancer: statistical study of retinoblastoma. *Proc Natl Acad Sci U S A* 1971;68:820–823. doi:10.1073/pnas.68.4.820
11. zur Hausen H. Papillomaviruses and cancer: from basic studies to clinical application. *Nat Rev Cancer* 2002;2:342–350. doi:10.1038/nrc798
12. Nowell PC. The clonal evolution of tumor cell populations. *Science* 1976;194:23–28. doi:10.1126/science.959840
13. Yachida S, Jones S, Bozic I, et al. Distant metastasis occurs late during the genetic evolution of pancreatic cancer. *Nature* 2010;467:1114–1117. doi:10.1038/nature09515
14. Jamal-Hanjani M, Wilson GA, McGranahan N, et al. Tracking the evolution of non-small-cell lung cancer. *N Engl J Med* 2017;376:2109–2121. doi:10.1056/NEJMoa1616288 — and: McGranahan N, Furness AJS, Rosenthal R, et al. Clonal neoantigens elicit T cell immunoreactivity and sensitivity to immune checkpoint blockade. *Science* 2016;351:1463–1469. doi:10.1126/science.aaf1490
15. Hanahan D, Weinberg RA. The hallmarks of cancer. *Cell* 2000;100:57–70. doi:10.1016/S0092-8674(00)81683-9 — and: Hanahan D, Weinberg RA. Hallmarks of cancer: the next generation. *Cell* 2011;144:646–674. doi:10.1016/j.cell.2011.02.013
16. Hanahan D. Hallmarks of cancer: new dimensions. *Cancer Discov* 2022;12:31–46. doi:10.1158/2159-8290.CD-21-1059
17. Coulie PG, Van den Eynde BJ, van der Bruggen P, Boon T. Tumour antigens recognized by T lymphocytes: at the core of cancer immunotherapy. *Nat Rev Cancer* 2014;14:135–146. doi:10.1038/nrc3670
18. Young LS, Rickinson AB. Epstein–Barr virus: 40 years on. *Nat Rev Cancer* 2004;4:757–768. doi:10.1038/nrc1452
19. Gjerstorff MF, Andersen MH, Ditzel HJ. Oncogenic cancer/testis antigens: prime candidates for immunotherapy. *Oncotarget* 2015;6:15772–15787. doi:10.18632/oncotarget.4694
20. Chen YT, Scanlan MJ, Sahin U, et al. A testicular antigen aberrantly expressed in human cancers detected by autologous antibody screening. *Proc Natl Acad Sci U S A* 1997;94:1914–1918. doi:10.1073/pnas.94.5.1914
21. Teulings HE, Limpens J, Jansen SN, et al. Vitiligo-like depigmentation in patients with stage III–IV melanoma receiving immunotherapy and its association with survival: a systematic review and meta-analysis. *J Clin Oncol* 2015;33:773–781. doi:10.1200/JCO.2014.57.4756
22. Tran E, Robbins PF, Lu YC, et al. T-cell transfer therapy targeting mutant KRAS in cancer. *N Engl J Med* 2016;375:2255–2262. doi:10.1056/NEJMoa1609279
23. Parkhurst MR, Robbins PF, Tran E, et al. Unique neoantigens arise from somatic mutations in patients with gastrointestinal cancers. *Cancer Discov* 2019;9:1022–1035. doi:10.1158/2159-8290.CD-18-1494
24. Le DT, Durham JN, Smith KN, et al. Mismatch repair deficiency predicts response of solid tumors to PD-1 blockade. *Science* 2017;357:409–413. doi:10.1126/science.aan6733
25. Wells DK, van Buuren MM, Dang KK, et al. Key parameters of tumor epitope immunogenicity revealed through a consortium approach improve neoantigen prediction. *Cell* 2020;183:818–834. doi:10.1016/j.cell.2020.09.015
26. Lawrence MS, Stojanov P, Polak P, et al. Mutational heterogeneity in cancer and the search for new cancer-associated genes. *Nature* 2013;499:214–218. doi:10.1038/nature12213
27. Gröbner SN, Worst BC, Weischenfeldt J, et al. The landscape of genomic alterations across childhood cancers. *Nature* 2018;555:321–327. doi:10.1038/nature25480
28. Yarchoan M, Hopkins A, Jaffee EM. Tumor mutational burden and response rate to PD-1 inhibition. *N Engl J Med* 2017;377:2500–2501. doi:10.1056/NEJMc1713444
29. Sepulveda AR, Hamilton SR, Allegra CJ, et al. Molecular biomarkers for the evaluation of colorectal cancer: guideline from the American Society for Clinical Pathology, College of American Pathologists, Association for Molecular Pathology, and American Society of Clinical Oncology. *J Mol Diagn* 2017;19:187–225. doi:10.1016/j.jmoldx.2016.11.001
30. Jungbluth AA, Antonescu CR, Busam KJ, et al. Monophasic and biphasic synovial sarcomas abundantly express cancer/testis antigen NY-ESO-1 but not MAGE-A1 or CT7. *Int J Cancer* 2001;94:252–256. doi:10.1002/ijc.1451
31. Hoeijmakers JHJ. DNA damage, aging, and cancer. *N Engl J Med* 2009;361:1475–1485. doi:10.1056/NEJMra0804615 — and: Ciccia A, Elledge SJ. The DNA damage response: making it safe to play with knives. *Mol Cell* 2010;40:179–204. doi:10.1016/j.molcel.2010.09.019 (estimate of up to 100,000 spontaneous DNA lesions per cell per day)
