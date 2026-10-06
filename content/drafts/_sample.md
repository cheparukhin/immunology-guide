---
id: _sample
title: The Big Eaters
subtitle: A sample chapter about macrophages, the cells that clean, defend and sometimes betray us. It exists to exercise every part of the page template.
part: I
number: 0
reading_time: 6
prev: index
next: 01-cells
hero: demo-hero
---

In 1882, working in Messina, Sicily, the zoologist Élie Metchnikoff pushed a rose thorn into a transparent starfish larva and watched. By the next morning the thorn was surrounded by a crowd of wandering cells, trying to swallow it. Metchnikoff guessed that he was looking at a defense system older than antibodies, older than fever, perhaps as old as animals themselves.[^1]

He was right. The cells he saw were the ancestors of our own {{macrophage|macrophages}}, a name that means simply "big eaters". A quarter-century later, Metchnikoff shared the 1908 Nobel Prize in Physiology or Medicine with Paul Ehrlich for founding the study of immunity.[^1]

## A cell in every tissue

Macrophages are not one population but a family spread through the whole body, with local names and local habits.[^2]

| Tissue | Local name | Everyday job |
|---|---|---|
| Liver | Kupffer cells | Filter blood arriving from the gut |
| Brain | Microglia | Prune connections, clear debris |
| Lungs | Alveolar macrophages | Swallow dust and microbes from every breath |
| Bone | Osteoclasts (close relatives) | Dissolve old bone so it can be rebuilt |

Each local branch has its own habits, but all of them share one talent: eating.

Most of what they eat is not dangerous at all. Macrophages in the spleen and liver retire worn-out red blood cells and recycle their iron; others clear away the cells that die by the billions every day as tissues renew themselves.[^2] Defense against infection is, in a sense, a side job of a cleaning crew.

- They **clean**: dead cells, debris, worn-out red blood cells.
- They **defend**: bacteria, fungi, cells infected by viruses.
- They **repair**: after damage they release signals that help tissue rebuild.

## How a macrophage eats

The act of swallowing a particle is called {{phagocytosis}}. It starts with recognition: receptors on the macrophage's surface fit molecular patterns found on microbes, or "eat me" labels that appear on dying cells. Recognition triggers a dramatic change of shape, as the cell's membrane flows around its target and seals it inside a bubble.[^3]

:::figure demo-stepper
title: How a macrophage eats
goal: After stepping through, the reader understands that eating is triggered by molecular recognition and ends with the microbe's fragments on display.
kind: stepper
stage: dark
spec: |
  A large coral macrophage on the left, a chartreuse rod-shaped bacterium on the right.
  Step by step: patrol, receptor binds a surface pattern (glow at the contact), pseudopods
  wrap and seal a phagosome, lysosomes fuse and the bacterium dissolves, fragments appear on
  MHC class II cups at the surface. Mobile: same scene, portrait viewBox.
steps:
  1. **Patrol** — A macrophage crawls through the tissue, sampling its surroundings. A bacterium drifts nearby.
  2. **Recognize** — A receptor on the macrophage fits a pattern on the bacterium's coat, like a hand in a glove. That contact is the signal to eat.
  3. **Engulf** — The membrane flows out in arm-like extensions that wrap the bacterium and seal it inside a bubble called a phagosome.
  4. **Digest** — Small sacs of acid and enzymes, the lysosomes, fuse with the phagosome. The bacterium is taken apart.
  5. **Report** — Fragments of the bacterium are loaded onto {{mhc-class-ii|MHC class II}} molecules and shown at the surface, where helper T cells can inspect them.
alt: A macrophage, drawn as a large coral cell, meets a rod-shaped bacterium. A receptor on the macrophage binds the bacterium's surface; the macrophage's membrane wraps around and swallows it; enzyme-filled sacs fuse with the bubble and break the bacterium down; finally, small fragments appear on display molecules at the cell surface.
:::

Inside the bubble, the macrophage turns hostile. Small sacs called lysosomes fuse with it, pumping in acid and digestive enzymes, while the cell generates reactive forms of oxygen that damage whatever is trapped.[^3] Within minutes to hours, most bacteria are reduced to fragments, and some of those fragments become a message for the rest of the immune system.[^2][^3]

:::note A note on names
Metchnikoff also described smaller eating cells, which he called "microphages". Today we call them neutrophils, and they are usually the first to arrive at an infection.
:::

:::key-idea
Macrophages decide what to eat by reading molecular labels. Patterns that say "microbe" or "dying cell" invite eating; other signals, such as the protein CD47, say "don't eat me".
:::

## Following the alarm

A macrophage that meets a microbe does not fight alone for long. It releases chemical messages, among them {{chemokine|chemokines}}, that spread outward through the tissue. Other immune cells sense the gradient and crawl up it, the way you might find a bakery by following the smell of bread.

:::figure demo-sim
title: Following the alarm
goal: The reader sees that individual cells move almost randomly, yet a chemical gradient is enough to gather a crowd.
kind: simulation
stage: dark
spec: |
  ~200 glowing immune cells drift randomly. An infection site pulses at the right.
  A slider sets the strength of the chemokine signal; at zero the cells just wander,
  at high strength they converge on the site. Play/pause. Portrait layout on phones.
alt: Two hundred small glowing immune cells wander across a dark field. When a chemical signal from an infection site is switched on, their random walks become biased toward it and they gradually gather around the site; stronger signals gather them faster.
:::

The analogy has limits: cells cannot smell, and no single cell "knows" where the infection is. Each one simply moves a little more often in the direction where the signal is slightly stronger. Summed over many cells and many minutes, that small bias becomes an unmistakable migration.

The crowd arrives in waves. Neutrophils are the sprinters: they pour in within hours and live only a day or two. Macrophages arrive later and stay longer, clearing away debris, including the dead neutrophils, and then helping the tissue rebuild.[^7]

:::figure demo-chart
title: Who arrives when
kind: chart
stage: light
aspect: 960:440 400:420
caption: Schematic shapes, not measured data. Exact timing varies with the tissue and the injury.
alt: A schematic chart of the cells at a wound over the first week. Neutrophils rise within hours, peak around the first day and then fall away. Macrophages rise more slowly, peak after about three days and stay while the tissue heals.
:::

:::deep-dive Not two kinds of macrophage, but a spectrum
Textbooks often sort macrophages into two types. "M1" macrophages, activated by microbial signals and the cytokine interferon-gamma, are aggressive: they kill microbes and sound the alarm. "M2" macrophages, shaped by signals such as interleukin-4, calm inflammation and help tissues heal.

The labels are useful shorthand but misleading if taken literally. Macrophages respond to dozens of signals at once, and their behavior varies along many dimensions rather than flipping between two states. In 2014 a group of leading macrophage biologists published guidelines urging researchers to describe exactly which signals activated a macrophage instead of relying on the M1/M2 binary alone.[^4]

### Why this matters for cancer

Tumors exploit this flexibility. Many solid tumors are full of tumor-associated macrophages that behave like wound-healers: they promote blood-vessel growth, suppress T cells and help cancer cells spread.[^5] Several experimental therapies try to "re-educate" these macrophages back toward an aggressive state rather than eliminate them.
:::

:::clinic
Some cancers display large amounts of CD47, the "don't eat me" signal, which binds a receptor called SIRPα on macrophages and holds them back.[^6] Antibodies that block CD47 were designed to release that brake. They have been tested in clinical trials, mostly in blood cancers, but so far they have not delivered the hoped-for benefit, and several programs have been stopped.
:::

:::figure demo-kit
title: Eat or spare?
kind: explorer
stage: dark
aspect: 16:9 4:5
caption: Simplified: real cells weigh many more signals than the few drawn here.
alt: A macrophage faces one target at a time. A bacterium shows only "eat me" signals and is eaten. A healthy cell shows "don't eat me" signals and is spared. A cancer cell with extra CD47 is often spared, and a cancer cell coated with drug antibodies may or may not be eaten, depending on the balance of the two kinds of signal.
:::

:::quiz
Q: What first triggers a macrophage to swallow a bacterium?
- [ ] The bacterium's size — Macrophages do not measure size; plenty of harmless particles of the same size are left alone.
- [x] A receptor recognizing a pattern on the bacterium's surface — Recognition of a molecular pattern is the signal that launches engulfment.
- [ ] A command from a T cell — T cells can boost macrophages, but recognition and eating do not need them.

Q: Why do many tumors contain macrophages that help, rather than fight, the cancer?
- [ ] Macrophages cannot enter tumors — They enter readily; in many tumors they are among the most abundant immune cells.
- [ ] Tumor cells are invisible to all immune cells — Some tumor cells are recognized; the problem is what the immune cells do next.
- [x] Signals in the tumor push them toward a wound-healing, suppressive behavior — Macrophages adapt to their surroundings, and tumors exploit that flexibility.
:::

:::takeaways
- Macrophages ("big eaters") live in almost every tissue and spend most of their time cleaning up.
- They eat by phagocytosis: recognize a target, wrap it in membrane, digest it with acid and enzymes.
- Eating also produces information: fragments are displayed to helper T cells.
- The same flexibility that lets macrophages heal wounds lets tumors recruit them as allies.
:::

## Glossary
- macrophage | Macrophage | A large immune cell that lives in tissues and engulfs microbes, dead cells and debris; it also signals to other immune cells.
- phagocytosis | Phagocytosis | The process by which a cell swallows a large particle, such as a bacterium, by wrapping it in its own membrane.
- chemokine | Chemokine | A small signaling protein that attracts immune cells; cells crawl toward places where its concentration is higher.

## Sources
1. Gordon S. Elie Metchnikoff: father of natural immunity. *Eur J Immunol* 2008;38(12):3257–3264. doi:10.1002/eji.200838855
2. Gordon S, Plüddemann A. Tissue macrophages: heterogeneity and functions. *BMC Biol* 2017;15:53. doi:10.1186/s12915-017-0392-4
3. Flannagan RS, Jaumouillé V, Grinstein S. The cell biology of phagocytosis. *Annu Rev Pathol* 2012;7:61–98. doi:10.1146/annurev-pathol-011811-132445
4. Murray PJ, Allen JE, Biswas SK, et al. Macrophage activation and polarization: nomenclature and experimental guidelines. *Immunity* 2014;41(1):14–20. doi:10.1016/j.immuni.2014.06.008
5. Mantovani A, Marchesi F, Malesci A, Laghi L, Allavena P. Tumour-associated macrophages as treatment targets in oncology. *Nat Rev Clin Oncol* 2017;14(7):399–416. doi:10.1038/nrclinonc.2016.217
6. Jaiswal S, Jamieson CHM, Pang WW, et al. CD47 is upregulated on circulating hematopoietic stem cells and leukemia cells to avoid phagocytosis. *Cell* 2009;138(2):271–285. doi:10.1016/j.cell.2009.05.046
7. Eming SA, Krieg T, Davidson JM. Inflammation in wound repair: molecular and cellular mechanisms. *J Invest Dermatol* 2007;127(3):514–525. doi:10.1038/sj.jid.5700701
