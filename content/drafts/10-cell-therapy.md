---
id: 10-cell-therapy
title: Cell Therapies
subtitle: Medicines that are cells rather than molecules: they multiply inside the patient, kill on contact, and can still be present a decade later.
part: III
reading_time: 24
hero: ch10-hero
---

In August 2011, doctors at the University of Pennsylvania reported the case of a man with chronic lymphocytic leukemia who had run out of treatment options. They had infused about 14 million of his own {{t-cell|T cells}} that had been engineered in a laboratory.

Inside him, the cells multiplied more than a thousandfold and killed the leukemia in his blood and then his bone marrow. Within a month none was detectable, and six months later the engineered cells were still present, carrying their synthetic receptor.[^5]

Every therapy in this guide so far has been a molecule. A {{t-cell-engager|T-cell engager}} such as blinatumomab (Chapter 9) works well, but it has to be given continuously: once the infusion stops, the drug is cleared from the blood within hours.

This chapter is about the alternative: instead of sending a molecule to direct the immune system, give the patient T cells rebuilt with a synthetic targeting receptor. Such a product is called a **living drug**, and the phrase is literal. A molecule is cleared at a predictable rate; a cell divides. The number of cells infused is only a starting point, the effect keeps growing after the infusion ends, it can persist for years, and it cannot be recalled. For that reason, some experimental products carry a **safety switch** (also called a suicide gene), an added gene that, once a second drug is given, drives the engineered cells into {{apoptosis|apoptosis}} (programmed cell death) within hours.[^22] Nearly every strength and danger of the approach follows from the fact that the cells multiply.

## Keep the T cell, change its target

A {{cd8-t-cell|killer T cell}} already does most of what a cancer therapy needs: it finds one abnormal cell among millions, kills it, detaches, kills the next, and divides into a large clone that leaves decades of memory behind. What it lacks, as Chapters 6 and 7 explained, is a reliable way to target a tumor. T cells that could recognize one are rare, often deleted in the {{thymus|thymus}} for being too self-reactive, and those that survive are frequently suppressed. CAR-T therapy keeps the T cell and replaces its targeting.

## An antibody's aim, a T cell's trigger

A T cell's natural {{tcr|T-cell receptor}} recognizes a peptide held in the {{peptide-binding-groove|peptide-binding groove}} of {{mhc-class-i|MHC class I}}, the "shop window" of Chapter 4. {{antibody|Antibodies}} work differently: their variable regions bind intact molecules on a cell's outer surface.

In 1989, Zelig Eshhar's group at the Weizmann Institute fused the variable regions of an antibody onto the chains of a T-cell receptor, so that binding by the antibody part triggered the T cell's own signaling. T cells carrying the hybrid killed cells bearing the antibody's target, and needed no MHC to do it.[^1] The group called them T-bodies. Today the molecule is a {{chimeric-antigen-receptor|chimeric antigen receptor}}, or CAR, and a T cell carrying one is a {{car-t|CAR-T cell}}.

A CAR is a single protein chain that spans the T cell's membrane, with three functional parts:

- **The binding domain, outside.** An antibody's two variable regions, from its heavy and light chains, joined by a short flexible linker into one protein chain called a {{scfv|single-chain variable fragment}} (scFv). It determines what the cell attacks.
- **The hinge and the transmembrane domain.** The hinge is a short stalk that sets how far the scFv reaches from the cell surface; the transmembrane domain crosses the membrane and anchors the receptor in it.
- **The signaling domains, inside.** They pass the signal into the cell. Getting this part right took a decade.

### The decade of failure, and the fix

The first CARs carried a single signaling domain: {{cd3-zeta|CD3ζ}} (CD3 zeta), a chain of the natural T-cell receptor's CD3 complex that signals that the receptor has bound its target. That is signal 1 from Chapter 4, and on its own it was not enough. The cells killed in a dish, but after being infused by the billion they faded: in a 2006 ovarian cancer trial they were abundant in the blood for two days and barely detectable a month later, and no patient's tumor shrank.[^2] In the terms of Chapter 4's two-factor authentication, the cells had a password but no second factor.

In 2002 and 2004, two groups built the second factor into the receptor itself by adding a {{costimulation|costimulatory domain}}: one used the intracellular signaling domain of CD28, the classic costimulatory receptor, the other that of a receptor called 4-1BB. Cells carrying these domains killed, and also multiplied and survived far better.[^3][^4] These are **second-generation** CARs: both signals in one molecule, from a single binding event. Every CAR-T product approved today is second generation.

The analogy has a limit. In nature, signal 2 comes from a *different* cell that has independently judged the situation dangerous, and it governs a naive T cell's first activation in the lymph node (Chapter 4); an activated killer T cell needs no second signal to kill. A CAR carries both signals in one receptor, so the built-in signal 2 mainly buys survival and multiplication, and the cell expands against anything carrying its target with no independent check to restrain it.

:::key-idea
A chimeric antigen receptor joins an antibody's variable regions, as an scFv, to a T cell's activating signal (CD3ζ) and its costimulatory signal, all in one molecule. Building signal 2 into the receptor turned a laboratory curiosity into a medicine, at the cost of removing the independent check.
:::

:::figure ch10-build-a-car
title: One signal, or two
goal: After using this, the reader sees that a CAR whose tail carries only signal 1 kills once and then fades, while a tail carrying signal 1 plus signal 2 kills and then divides and survives — the single change that made CAR-T therapy work in patients.
kind: explorer
stage: dark
spec: |
  ONE idea only: what the signaling tail does. Everything else is scenery and should be quiet.

  SHARED CODE. Build the contact with `shared/synapse.js` (`pairs:[{kind:'car-antigen'}]`), the kill with `cell-actions.kill`, and the meters with `shared/activity-meter.js` (`mode:'segments'`, `tag:'Illustrative'`). Stage tag: "Illustrative", top right.

  LAYOUT. A T-cell membrane in cross-section across the middle of the stage: a horizontal lipid bilayer (two rows of soft-edged lipid heads), "outside the cell" above, "inside the cell" below in a faintly lighter cytoplasm tone. Electric blue (#4C8DFF) is the T-cell color.

  Standing in the membrane, one chimeric antigen receptor, drawn as a vertical stack and labeled once each with thin leader lines (these labels are STATIC — not controls):
    - binder: two rounded antibody-variable lobes joined by a visibly flexible squiggle, in antibody gold (#F2B33D), label "scFv binder";
    - hinge: short stalk above the membrane, label "hinge";
    - anchor: single helix barrel crossing the bilayer, label "anchor";
    - tail: below the membrane, a stack of beads — see control.

  THE ONE CONTROL. A three-way segmented control, "What is in the tail?":
    1. "CD3ζ only" — one bead in T-cell blue with three small notches on it (the three ITAMs). Caption chip: "signal 1 only".
    2. "CD28 + CD3ζ" — above the CD3ζ bead, one costimulatory bead drawn as the library's activating `signalIcon`: a green-cyan (#3DDC97) disc with a "+". Label "CD28".
    3. "4-1BB + CD3ζ" — the same green-cyan "+" disc, labeled "4-1BB". The glyph is deliberately identical: the point is that a second piece is present, not which molecule it is. Do not invent a new color or shape; the "+" disc is the book's only activating-signal glyph.
  Options 2 and 3 must produce the same outcome; the point is the presence of signal 2, not which molecule provides it.

  THE TEST. One button, "Meet a target cell". A cancer cell (violet-magenta #B65FD8, irregular, lumpy) slides in carrying four or five `antigen()` glyphs on stalks — circles, the book's generic CAR-target shape — standing clearly OUTSIDE the membrane and never sitting in an MHC cup. Then a four-beat animation:
    beat 1 — the binder clamps a surface key; the membrane dimples slightly;
    beat 2 — the CD3ζ notches light up in sequence; chip reads "Signal 1: go";
    beat 3 — if a costimulatory bead is present it pulses and a second chip reads "Signal 2: divide, and survive". If not, a gray chip reads "No signal 2";
    beat 4 — `cell-actions.kill`: the cell docks and flattens, granules slide to the contact, the target dies by `setDying` (shrink, blebs, fragments) and the killer detaches intact — the Chapter 5 grammar, unchanged. THEN, and this is the payoff: with signal 2, the T cell divides into two, both daughters keep their receptor, and both go looking for another target; without it, the T cell dims, slows, and stops moving.

  TWO METERS (`activity-meter`, segments, `tag:'Illustrative'`; words and segments only, never percentages):
    - "Kills on first contact" — effectively full for all three tails.
    - "Still alive and working weeks later" — near zero for CD3ζ only; high for both two-piece tails.
  One line of text under the meters, shown only after the first run: "This is the whole history of the field in one control: the first generation of these receptors had only the top option."

  PROGRESSIVE DISCLOSURE. On first load, only the receptor and the single control are visible; the meters appear after the first "Meet a target cell" run; the history line appears after that. Nothing animates until the reader presses the button.
  WRONG to show: the CAR binding a peptide held in an MHC cup; MHC as a requirement anywhere; the costimulatory piece outside the cell; a first-generation CAR containing CD28; signal 2 arriving from a second cell (it does not, and that is the chapter's point).
  Acceptable simplifications: one receptor instead of thousands; no ZAP-70/LAT cascade; no receptor dimerization; killing compressed into one beat.
  MOBILE: portrait viewBox, receptor centered, control as a full-width segmented bar below the stage, meters last. Keep in-SVG text to the four part labels and the two chips.
alt: An interactive cross-section of a T cell's membrane with a chimeric antigen receptor standing in it, labeled with its four parts: the scFv, the hinge, the transmembrane domain and the intracellular signaling domains. The reader chooses which signaling domains the receptor carries and then sends in a cancer cell. With CD3ζ alone (signal 1) the cell kills once and then fades; adding a costimulatory domain makes it kill, divide and survive.
:::

:::deep-dive The generations, and why "more" stopped helping
**First generation (from the early 1990s):** an scFv plus a single signaling domain, from CD3ζ or the closely related γ chain of an Fc receptor. Potent in a dish but clinically inert, because the cells did not persist.[^2]

**Second generation (2002–2004 onward):** one costimulatory domain plus CD3ζ.[^3][^4] The two domains in approved use behave differently. CD28 drives fast, steep expansion and strong early killing; those products (axicabtagene ciloleucel, brexucabtagene autoleucel) tend to produce higher peaks and more early toxicity. 4-1BB signaling is weaker but keeps cells alive: tisagenlecleucel and lisocabtagene maraleucel expand more slowly and persist longer, sometimes for years. Neither is globally better; the choice interacts with the disease, the dose, and how much target the tumor displays.

**Third generation:** two costimulatory domains plus CD3ζ. Adding more signaling has not reliably produced better outcomes, and no third-generation product is broadly approved.

**Fourth generation ("armored" CARs):** a second-generation CAR plus an extra gene, usually for a {{cytokine|cytokine}} (an immune signaling protein) that the cell secretes when it binds its target. These are promising but still unproven, and they add toxicity risk, because the cell now also secretes a cytokine.

Two smaller design details also change outcomes. The **hinge and transmembrane domain** set the geometry of the contact between the two cells; swapping them changes how much target a CAR needs before it activates the cell. The **scFv's {{affinity|affinity}}** matters in a counterintuitive way: an scFv that binds too tightly can exhaust the cell and make it less able to detach and kill again. Obecabtagene autoleucel, approved in the US in November 2024 for adult B-cell leukemia, was built on that premise, with a deliberately *intermediate*-affinity scFv and a fast dissociation rate (the off-rate of Chapter 1), meant to let the cell disengage, rest and persist. In its pivotal trial 77% of patients went into remission, with severe cytokine release syndrome in 2.4% and severe neurotoxicity in 7.1%.[^20] These rates are low for this disease, though they come from a separate trial in different patients, not a head-to-head comparison.
:::

## Seeing without the shop window

A natural T cell sees only what a cell displays on its {{mhc|MHC}} molecules, so one of the commonest ways for a tumor to escape (Chapter 7) is to stop displaying. **A CAR is unaffected by this.** It binds the outside of the target cell directly, as an antibody does.

The same property sets a hard limit. Most of a cell's proteins never reach its surface (a few thousand out of just under twenty thousand do), so mutated transcription factors, fusion proteins and most other proteins that drive cancer are invisible to a CAR. The target must also be *shared* across the tumor and *expendable* everywhere else, because the cell attacks it wherever it finds it.

For B-cell cancers, such a target already existed: **{{cd19|CD19}}**, a protein on nearly every B cell, healthy or malignant. Attacking it destroys the patient's entire B-cell population, a loss that turned out to be survivable, which is why the field began with B-cell cancers.

## Three weeks at best

A CAR-T product is made from the patient's own cells, for that patient alone (an {{autologous|autologous}} therapy), and the manufacturing time matters, because people with {{refractory|refractory}} leukemia may not have long. Three weeks from blood draw to infusion is fast. Measured "vein-to-vein" times are longer and vary by product, with medians of 31 days for axi-cel, 36 for liso-cel and 48 for tisa-cel (the short names of three approved products). Shipping and hospital scheduling add days, and so can a batch that has to be remade or bridging treatment given during the wait.[^30] Made-to-order manufacturing is also expensive. In one 2026 analysis, US list prices at launch ranged from $373,000 to $475,000 and had risen to roughly $462,000–$594,000 by 2025, not counting the hospital care around the infusion.[^36]

:::figure ch10-journey
title: Vein to vein
goal: After using this, the reader understands that CAR-T is a manufacturing process wrapped around one person — as little as three weeks from blood draw to infusion, typically four to seven — and that the drug's real expansion happens inside the patient, not in the factory.
kind: stepper
stage: light
spec: |
  ONE idea: the timeline, and where the expansion actually happens.

  SHARED CODE. Drive the steps with `ctx.ui.stepper` (no hand-rolled stepper), the day-8 panel with `shared/chart.js`, and the counter with `ctx.ui.clock`; it advances monotonically and never runs backwards. Stage tags: "Illustrative" for the example timeline, plus "Time compressed" once the axis jumps to months in step 9 — two tags maximum.

  A horizontal journey on a light (paper) stage with a persistent DAY COUNTER in large numerals at top left and a thin progress rail beneath. Two background zones: a "hospital" zone (left and right) and a "manufacturing facility" zone (middle), with a plane glyph marking each shipping leg. A standing caption under the title reads: "This example is a fast one. Measured medians run from about a month to seven weeks, depending on the product." A source line in ink-3 beneath it credits the vein-to-vein meta-analysis for those medians; the day-by-day rail is an illustrative example, not measured data.

  Nine steps, each a small vignette in the project's cell palette (T cells electric blue #4C8DFF, cancer cells violet-magenta #B65FD8, drugs gold). Only the current vignette is fully opaque; earlier ones stay on the rail at 35% opacity so the whole arc is visible.

  1. Day −21, hospital — leukapheresis. A seated patient silhouette (abstract, no face) linked to a machine: blood in, a bag of white cells out, red cells returned. A small inset shows the bag is a MIXTURE — T cells plus other white cells.
  2. Day −20, facility — the cold box arrives; T cells are separated from the mixture and meet activating beads. The cells visibly swell and begin to divide.
  3. Day −18, facility — gene transfer. A vector glyph labeled "disabled virus — carries the CAR gene, cannot copy itself" docks with a T cell; a gene ribbon enters and joins the cell's DNA. From here on, every blue cell wears a small CAR glyph.
  4. Days −17 to −6, facility — expansion and release testing. A culture vessel with a log-scale counter ticking from millions to hundreds of millions, then checklist chips appearing one by one: sterility, identity, potency, how many cells carry the CAR. Then a frozen vial. One chip can fail (see the toggle).
  5. Days −6 to −3 — the frozen product flies back and is logged into the hospital's freezer FIRST (plane lands, vial goes into storage); only then does chemotherapy start. Two drug glyphs labeled fludarabine and cyclophosphamide; the patient's existing white cells visibly thin out, leaving empty space. (Centers generally confirm the product is on site before starting lymphodepletion, so a patient is not given this chemotherapy without cells to follow.)
  6. Days −2 to −1, hospital — a short rest: the chemotherapy clears from the body so it will not harm the incoming cells. The vial waits, frozen.
  7. Day 0 — the bag is thawed at the bedside and infused right away: one small bag, 10–100 mL, over a few minutes. Emphasize how anticlimactic it looks.
  8. Days 3 to 14 — the drug makes itself. This is the emotional center: a log-scale `chart.js` panel draws itself showing CAR-T cells in the blood rising a hundredfold or more and peaking around day 7–14 (blue, the T-cell color, because the series *is* the entity), while a tumor-burden line falls in violet. A labeled phase band behind the curve reads "when fever usually starts" and covers the first week. The curve shapes are illustrative, not patient data, and the panel says so.
  9. Day 28 and beyond — response assessment, then a compressed axis jumping to months and years, with a thin persistent line of CAR-T cells, and a note that normal B cells are absent for months and in most patients return later.

  CONTROLS: Previous / Next / Play, keyboard arrows, and one toggle, "What can go wrong", which overlays amber annotations on steps 4 and 5: "manufacturing can fail, or fall short of the intended dose"; "patients can deteriorate while they wait, so bridging chemotherapy is often given"; "this chemotherapy itself causes low blood counts and infection risk".
  PROGRESSIVE DISCLOSURE: the day-8 chart draws only when that step is reached, and the toggle is off by default.
  WRONG to show: the day counter moving backwards; the product arriving after lymphodepletion has begun; B cells permanently absent.
  MOBILE: vertical timeline, day counter pinned at the top, one vignette per screenful, swipe or buttons to advance; the day-8 chart renders full width.
steps:
  1. Day −21. Blood is drawn from a vein and run through a machine that collects white cells and returns the rest. This is leukapheresis, and it usually takes three to four hours. The result is a bag of mixed white cells, the starting material.
  2. Day −20. The bag travels cold to a manufacturing facility that may be on another continent. T cells are separated out and activated with artificial stimulation, because a resting T cell will not take up a new gene and a dividing one will.
  3. Day −18. A viral vector, a disabled virus that cannot replicate, carries the CAR gene into the T cells and integrates it permanently into their DNA. This gene transfer is called transduction. Every daughter cell will inherit the gene.
  4. Days −17 to −6. The cells are expanded to hundreds of millions, then tested for sterility, for identity (that they are this patient's cells), for the fraction expressing the CAR and for killing. The batch is then frozen. A small percentage of batches never pass.
  5. Days −6 to −3. The frozen cells are flown back and stored at the hospital. Usually only after they arrive does the patient start lymphodepleting chemotherapy, typically fludarabine and cyclophosphamide, which depletes their existing lymphocytes to make room.
  6. Days −2 to −1. A short pause lets the chemotherapy clear from the body, so it will not harm the cells about to arrive.
  7. Day 0. The bag is thawed at the bedside and infused over a few minutes, a brief and undramatic procedure.
  8. Days 3 to 14. Inside the patient, the CAR-T cells find their target and multiply a hundredfold or more, peaking around days 7 to 14 as the tumor shrinks. Most patients develop a fever in the first week. It shows the cells are active but does not measure how well the treatment will work.
  9. Day 28 and beyond. Response is assessed at about a month. In some patients the engineered cells stay detectable for years. Normal B cells are usually gone for months; in most patients they eventually grow back, and the remission can outlast their absence.
alt: A step-by-step timeline of CAR-T treatment with a day counter. It runs from the blood draw, as little as three weeks and typically four to seven weeks before treatment, through transduction with a viral vector and cell expansion at a manufacturing facility, to lymphodepleting chemotherapy that makes room, the infusion itself, and the hundredfold expansion of the engineered cells inside the patient during the first two weeks.
:::

:::deep-dive Three things about the process that surprise people
**The gene transfer is permanent.** The CAR gene is delivered by {{transduction|transduction}}, using a {{viral-vector|viral vector}}: a virus stripped down so that it can deliver a gene and integrate it into the cell's chromosomes but cannot replicate or spread. Most approved products use a {{lentiviral-vector|lentiviral vector}}, built from a disabled HIV; axi-cel and brexucabtagene autoleucel use a related retroviral vector.[^44] The CAR gene becomes part of that T cell's genome and of every cell it produces, which is why the secondary-cancer question later in this chapter is taken seriously.

**The chemotherapy before the infusion is not there to treat the cancer.** {{lymphodepletion|Lymphodepletion}} clears space. The body makes the lymphocyte survival cytokines IL-7 and IL-15 at a roughly fixed rate, so with far fewer lymphocytes competing, the infused cells get a much larger share; suppressive cells, including {{regulatory-t-cell|regulatory T cells}}, are temporarily depleted too. Without this step the engineered cells expand poorly. Lymphodepletion also causes much of the early toxicity, particularly the low blood counts.

**The dose is only a starting point.** Every other drug in this guide has a dose-response relationship you can reason about: more drug, more effect, up to a ceiling. Here the number of cells infused only sets the starting size of a population that will grow by two or three orders of magnitude, peak in the second week, and may then persist for years.[^11] How far it grows depends on the patient, the tumor burden, the receptor's design and the fitness of the collected T cells, which partly reflects how much chemotherapy the patient has already had. Two people given identical products can have very different outcomes.
:::

## What the trials show

Three diseases account for most of the evidence, largely in patients for whom doctors had little left to offer.

| Disease | Target | What the trial showed |
|---|---|---|
| Children's B-cell leukemia, after relapse — tisagenlecleucel (Kymriah) | CD19 | About 8 in 10 in remission within three months, no leukemia detectable in any of them; 76% alive at one year.[^7] |
| Aggressive large B-cell lymphoma — axicabtagene ciloleucel, "axi-cel" (Yescarta) | CD19 | About 8 in 10 responded, nearly 6 in 10 completely; five years on, 31% still in response and 43% alive.[^8] Used second-line instead of a stem-cell transplant, it raised four-year survival to 54.6% from 46.0%.[^9] |
| Myeloma, resistant to standard drugs — ciltacabtagene autoleucel, "cilta-cel" (Carvykti); idecabtagene vicleucel is the other | {{bcma|BCMA}} | At one year, 76% alive with no sign of the cancer growing, against 49% on standard treatment.[^10] |

In 2022, Penn reported on two of its first leukemia patients, treated in 2010. Both were still in remission ten years later, with CAR-T cells still in their blood. By then these were mostly CD4 helper cells that had taken up killing, which helper cells rarely do (Chapter 5).[^11]

:::key-idea
Response rates for CAR-T in refractory {{blood-cancer|blood cancers}} are among the highest in oncology, but response is not cure. In the trial with the longest follow-up, roughly 60% of the lymphoma patients who responded had relapsed or lost the response by five years,[^8] and most myeloma patients relapse. What the therapy offers is a long, treatment-free remission for a minority of patients who had no other route to one.
:::

## Toxicity

The main toxicities come from the same activity that makes the therapy work.

**{{crs|Cytokine release syndrome}}.** As the CAR-T cells find their targets and multiply, most patients develop a fever, usually in the first week; in worse cases blood pressure falls, oxygen drops and organs begin to fail. Severe cases run from about 1% to 11% with the approved adult products,[^8][^10][^20] and were far more common in the pivotal pediatric trial, whose patients carried far more disease and were graded on a stricter scale.[^7]

The central cytokine is **{{il-6|IL-6}}**, and most of it does not come from the engineered cells. In mice, the CAR-T cells trigger the reaction, and the host's own {{macrophage|macrophages}} secrete the IL-6 and other cytokines that cause the illness; human data are consistent with this.[^12]

The first evidence that this reaction could be interrupted came in 2012, with the first child to receive the Penn team's CAR-T cells. Emily Whitehead was six, her leukemia had relapsed twice, and days after her April 2012 infusion she was in intensive care with failing organs and an extremely high IL-6 level. Carl June, whose own daughter was being treated for juvenile arthritis, knew of an antibody in the hospital pharmacy for rheumatology patients: **tocilizumab**, which binds the IL-6 receptor and so blocks IL-6 signaling. The team gave it, along with a second cytokine blocker. Her fever broke within hours, and the drug did not stop the CAR-T cells working: she went into remission, and ten years later her doctors said publicly that they believed she was cured.[^6][^37] Blocking the IL-6 receptor is now the standard first treatment. (Tocilizumab was later used in COVID-19: in a randomized trial of more than 4,000 people hospitalized with the disease, short of oxygen and with signs of runaway inflammation, it cut deaths within four weeks from 35% to 31%.[^43]) The fever does not measure success, however: patients who never develop one can still have complete remissions, and in a lymphodepleted patient fever can also be the first sign of infection.

:::figure ch10-crs
title: Blocking the fever, not the therapy
goal: After playing with this, the reader understands that the fever of cytokine release syndrome is made by the patient's own macrophages responding to CAR-T activity — which is why blocking the IL-6 receptor can break the fever without switching off the therapy.
kind: simulation
stage: dark
spec: |
  ONE idea: the fever comes from the host's macrophages, so it can be blocked without blocking the treatment.

  LEFT (top on mobile) — the SCENE, a small patch of bone marrow: 20–40 cancer cells (violet-magenta #B65FD8, irregular), a handful of CAR-T cells (electric blue #4C8DFF with a small CAR glyph), and 3–5 macrophages (coral #FF7A6B, large, amoeboid, ruffled edges). CAR-T cells patrol, contact cancer cells, kill them (shrink and fragment), and divide. Each kill emits a few signals in the T cell's blue — IFN-γ as hollow rings, TNF as solid dots, per the book's cytokine rules (hover: "IFN-γ, TNF"). When they reach a macrophage it swells, brightens, and starts emitting many solid coral dots labeled IL-6, coral because the macrophage is the sender. The coral cloud must visibly dominate the scene: it should be obvious that the cloud filling the screen comes from the macrophages, not from the engineered cells.

  SHARED CODE. Crowd and effects from `shared/agents.js`; kills use the crowd form of the kill grammar (shrink plus 4–6 specks fading over 0.6 s — never an explosion). Both plots are drawn **dark-native** with `shared/chart.js` (`theme:'stage-dark'`): no paper inset inside this dark stage. Stage tags: "Illustrative" and "Time compressed".

  RIGHT (below on mobile) — TWO stacked plots sharing one x-axis (days 0–14), drawing in real time, labeled "illustrative time course":
    - "CAR-T cells in the blood" (log scale, blue): starts rising at about day 2, peaks day 7–14, then declines to a plateau.
    - "IL-6, and the patient's temperature" (coral line with a temperature band behind it): begins climbing about a day AFTER the blue curve starts rising, and peaks alongside it, not after it. The offset at the start is the whole point: the engineered cells move first, the host's cytokines follow.

  CONTROLS, three in total:
    - "Tumor burden": low | high. High burden means more kills, more macrophage activation, a far higher IL-6 and temperature peak. This causal chain is the figure's second-most-important beat and should be dramatic.
    - "Do nothing" | "Block the IL-6 receptor (tocilizumab)". When blocked: the macrophages keep making coral dots, but the dots visibly bounce off the temperature band, which falls back to normal within hours of simulated time — while the blue CAR-T curve KEEPS RISING and the killing in the scene continues. The reader should be able to say afterwards: "you can turn off the fever without turning off the drug."
    - Reset / replay.

  PROGRESSIVE DISCLOSURE: the scene runs first with only the blue cells visible; macrophages light up only once signal dots reach them; the plots draw as the simulation proceeds; the intervention button becomes available once the temperature band leaves the normal range.
  A single footer line: "Steroids also settle this syndrome; because they act on T cells directly, they are used second for the fever and first for the neurological syndrome."
  WRONG to show: CAR-T cells as the main source of IL-6; the fever beginning before the CAR-T cells expand; IL-6 peaking after the CAR-T peak; tocilizumab killing CAR-T cells or binding IL-6 itself (it blocks the receptor); bigger fever implying better outcome.
  MOBILE: scene on top with a reduced cell count for performance, plots below at full width, controls in a sticky bar at the bottom.
alt: A simulation of cytokine release syndrome. CAR-T cells kill cancer cells in a patch of bone marrow and release cytokines that activate the patient's own macrophages, which secrete large amounts of IL-6. Two plots track the engineered cells and the patient's IL-6 and temperature, and the reader can block the IL-6 receptor and watch the fever settle while the killing continues.
:::

**Neurotoxicity.** Days after the fever, some patients become confused, lose the ability to write or find words, and in severe cases have seizures or, rarely, fatal brain swelling. This is {{icans|immune effector cell-associated neurotoxicity syndrome}} (ICANS), and how often it happens depends strongly on the product: neurological events affected 64% of patients given axi-cel and 40% of the children given tisa-cel, and were severe in roughly 7% to 30% across the approved products.[^7][^8][^20] It is usually fully reversible, and unlike the fever it responds poorly to IL-6 blockade, so {{corticosteroid|corticosteroids}} are used instead.

**Low blood counts and infections.** The most *common* severe toxicity is prolonged low blood counts (cytopenias): neutrophils, red cells and platelets can stay low for months. Across nearly 8,000 treated patients, infection caused more than half of all deaths that were not from the cancer returning.[^13]

**Missing B cells.** CD19 is expressed on every B cell, so successful CD19 CAR-T therapy destroys the healthy ones along with the cancer: **{{on-target-off-tumor|on-target, off-tumor}}** toxicity, the drug working as designed on the wrong cell. Many patients then need regular infusions of donor antibodies, though not all do: the long-lived {{plasma-cell|plasma cells}} that secrete most of the body's circulating antibody stopped expressing CD19 long ago and survive.[^40] The B cells often return later, and the remission lasts anyway.[^8] There is no equivalent replacement for a heart or a lung.

**A rare second cancer.** Since April 2024 these products have carried a boxed warning about secondary T-cell cancers: 22 reported cases against more than 27,000 doses given, with the CAR gene inside the malignant cells in three.[^14] The risk looks very small, and smaller than the diseases being treated, but it is why patients are monitored for life. The box below gives the details.

:::clinic
For years, CAR-T came with heavy logistical restrictions in the US: certified centers only, a stocked supply of tocilizumab on site, and a requirement that patients stay within two hours of the hospital for four weeks and not drive for eight. In June 2025 the FDA removed the formal risk-management program for the approved CD19 and BCMA products and relaxed the guidance, cutting the proximity and driving restrictions to about two weeks, on the grounds that the field now knows how to manage these toxicities and that the restrictions were themselves a barrier to access.[^33] The toxicities have not changed; confidence in handling them has.

The list of approved uses also keeps growing: marginal zone lymphoma, a slow-growing lymphoma, in December 2025,[^32] and in February 2026 the removal of the restriction that had kept these cells out of lymphoma in the brain.[^33] Any such list dates quickly.
:::

:::deep-dive The secondary cancer question
In April 2024 the FDA required a boxed warning on all approved CD19- and BCMA-directed CAR-T products for the risk of secondary T-cell cancers. The agency counted 22 cases of T-cell malignancy reported to it by the end of 2023, against more than 27,000 doses of the approved products given in the US since 2017. In three of the 22, sequencing found the CAR gene inside the malignant cells, which means that in those three the vector insertion plausibly contributed. Of the cases with enough data to judge, all appeared within two years of treatment, about half within one.[^14]

A causal link in some cases is biologically plausible: integrating a gene into a chromosome at a semi-random position has always carried a theoretical risk of disrupting a growth-control gene, and this is the first direct hint of it in this field. The absolute risk, however, is very small, far smaller than the risk of the diseases being treated.

The risk is also hard to attribute. Patients who receive CAR-T have typically had years of chemotherapy and radiation, both of which cause second cancers. A single-center review of 724 patients found one secondary T-cell lymphoma, and detailed molecular work found no evidence of vector involvement: the lymphoma carried Epstein–Barr virus and arose from a pre-existing abnormal clone in the patient's own blood.[^15] Disentangling these causes takes long registries, not single cases. The current approach, lifelong monitoring with no change to who is treated, is a reasonable reading of weak evidence, and it may change in either direction.
:::

## Why solid tumors have been so much harder

CD19 CAR-T cells were approved in 2017. The first CAR-T approval anywhere for a {{solid-tumor|solid tumor}} came nearly a decade later, in June 2026, in China.[^35] The gap is not for lack of effort, and the stakes are high: solid tumors cause about nine in ten cancer deaths.[^38] Two obstacles compound, and the first is decisive.

**1. Solid tumors have almost no equivalent of CD19.** The approach needs a surface protein on nearly every tumor cell and on no tissue the body cannot do without. For the common carcinomas no such protein exists: HER2, EGFR, mesothelin, GD2 and claudin-18.2 all appear somewhere in normal tissue. In a 2010 case report, a patient given ten billion HER2-targeted CAR-T cells went into respiratory failure within fifteen minutes and died five days later; the investigators suspected that the cells had recognized low levels of HER2 on normal lung.[^16] The safety margin is far narrower for a cell that multiplies than for a molecule that is cleared.

**2. Heterogeneity, escape and the tumor microenvironment.** Tumors are {{tumor-heterogeneity|heterogeneous}}, made of genetically different cells, so killing every cell that carries the target selects for the ones that lack it, a process called {{antigen-escape|antigen escape}}. Of the first two children the Penn team treated, the second relapsed about two months later with leukemia that no longer carried CD19.[^6] Solid tumors are more diverse and harder to reach. A pancreatic tumor, for example, is surrounded by dense fibrous tissue that keeps T cells out, and those that get in meet suppressive molecules and suppressor cells (the {{tumor-microenvironment|tumor microenvironment}} of Chapter 7). Engineered cells become {{exhaustion|exhausted}} there faster than natural ones, because a CAR signals continuously whenever its target is present.

One possible answer to the first obstacle is a cell that requires two markers, A *and* B, before it attacks. Such a cell could tell a tumor cell from a healthy cell that carries only one of them.

:::figure ch10-logic-gates
title: Giving a CAR-T cell a safety check
goal: After playing with this, the reader understands why one surface marker is rarely safe enough in solid tumors, how requiring two markers at once could spare healthy tissue — and why the narrower rule makes it easier for the tumor to escape by dropping a marker.
kind: simulation
stage: dark
spec: |
  ONE idea: requiring two markers buys safety and costs escape resistance.

  SHARED CODE. Crowd from `shared/agents.js`, kills in the crowd form of the kill grammar, antigens from the art library's `antigen()` on stalks (A = square, B = triangle), the population chart drawn **dark-native** with `shared/chart.js` (`theme:'stage-dark'`), meters from `shared/activity-meter.js` with `tag:'Illustrative'`. Stage tag: "Illustrative".

  A single field of tissue on a dark stage, about 48 cells, in two populations distinguished by SHAPE as well as color, each named once in a legend:
    - TUMOR cells: violet-magenta (#B65FD8), irregular lumpy outline, carrying antigen A (small square glyph) AND antigen B (small triangle glyph).
    - HEALTHY LUNG cells: sand (#E9C9A1), calm rounded polygon, carrying antigen A only.
  CAR-T cells (electric blue #4C8DFF) enter from one edge and patrol.

  CONTROL 1 — "Targeting rule", two options:
    1. "Attack A" — the cells kill on antigen A wherever they find it: all tumor cells, and the healthy lung cells too. Draw the healthy cells carrying visibly FEWER A glyphs than the tumor cells, and let a minority of the lowest-antigen healthy cells survive, with an on-stage note: "Illustrative — how much healthy tissue is hit depends on how much antigen those cells carry." The healthy-damage meter fills to crimson. This is today's single-target CAR.
    2. "A AND B" — a two-step sequence, drawn explicitly: a CAR-T cell meets A, an inner glyph lights and a chip reads "armed by A — now hunting B", there is a visible PAUSE of about a second (the real mechanism requires the cell to switch on a new gene, which takes hours), and only then can it kill a cell carrying B. Tumor cells die; the healthy population survives untouched.

  CONTROL 2 — "Antigen loss", a slider from 0% to 40%: that fraction of tumor cells is drawn WITHOUT antigen B, keeping A. Under the "A AND B" rule those cells visibly survive, keep dividing, and repopulate the field over about twenty seconds. A small population chart along the bottom tracks tumor cells over time and makes the relapse unmistakable. Under "Attack A" they die — the blunt rule has this one advantage, and the figure should let the reader discover the trade-off themselves rather than captioning it away.

  METERS: "tumor cells remaining" and one "healthy tissue damage" bar, both always visible and both tagged "Illustrative" — model outputs, not measurements, never shown as percentages.
  PROGRESSIVE DISCLOSURE: the antigen-loss slider is disabled until the reader has run both targeting rules once.
  A permanent footer chip: "Two-marker CAR-T cells are experimental. Every approved product today uses a single target."
  WRONG to show: two-marker logic as approved therapy; the second step as instantaneous; healthy cells spared because they are "healthy" rather than because of the specific markers they carry.
  MOBILE: portrait grid of about 36 cells; targeting rule as a full-width segmented control; meters stacked below.
alt: A field of tumor cells carrying two surface markers and healthy lung cells carrying one of them. The reader chooses whether the engineered T cells attack any cell with the first marker, or only cells carrying both, and watches which cells die. A slider then removes the second marker from some tumor cells, showing how the tumor escapes the stricter rule.
:::

In June 2026, China's regulator approved satricabtagene autoleucel, a CAR-T product against claudin-18.2 (a protein on stomach-lining cells and many stomach cancers), for advanced gastric and gastroesophageal cancer after at least two previous treatments.[^35] The median time before the cancer grew again was 3.25 months against 1.77 months on standard treatment, a gain of about six weeks, and 22% of patients had a confirmed response against 4%. Among the 88 who received the cells, nearly all had cytokine release syndrome and 99% a grade 3 or worse side effect.[^17] It was a randomized benefit in a setting with almost nothing else to offer, at a substantial cost in side effects.

:::deep-dive What is being tried in solid tumors
**{{armored-car|Armored CARs}}.** In a first-in-human study in liver and other cancers carrying the protein GPC3, a CAR alone produced no objective responses; the same CAR co-expressing IL-15 expanded far better and produced responses in a third of patients, along with more cytokine release syndrome.[^22]

**Two-marker logic.** The AND gate in the figure above is usually built with a {{synnotch|synthetic Notch receptor}}: binding the first antigen induces expression of the gene for a CAR against the second, so only cells carrying both are attacked.[^18] It works in mice. In people it is harder, and it narrows the target enough that losing one marker becomes an easy escape route.

**Regional delivery** sidesteps the problem of getting cells into the tumor. Cells carrying a CAR against a mutant form of EGFR *and* secreting a T-cell engager of the kind Chapter 9 described, infused into the fluid spaces of the brain, produced tumor regression within days in all three patients of a first-in-human glioblastoma study, though it lasted in only one.[^19] In children and young adults with diffuse midline glioma, otherwise uniformly fatal, a GD2-targeted CAR given intravenously and then into the brain produced major tumor shrinkage in four patients, neurological improvement in nine, and one complete response ongoing beyond thirty months.[^21] These are large effects in very few patients with diseases that are almost always fatal; they are not yet a treatment.
:::

## Two other ways to arm a T cell

CAR-T is not the only cell therapy, and the two alternatives can see targets that CARs cannot.

**{{til|TIL}} therapy** takes the opposite approach to engineering: instead of designing the targeting, it uses T cells that have already found the tumor. Steven Rosenberg's group at the NIH reasoned in the 1980s that a tumor may already hold T cells that recognize it, but too few to control it. (Not every T cell inside a tumor is one of them; many are bystanders, as Chapter 8 explained.) Surgeons remove a piece of tumor; the tumor-infiltrating lymphocytes inside it are grown to tens of billions; the patient receives lymphodepletion, the cells, and IL-2 to keep them alive. No genes are added, so the receptors are the patient's own, which means TILs can recognize anything a natural T cell can, including targets inside the cell, and possibly many at once.

In the NIH's early series of 93 people with heavily treated melanoma, 20 had every tumor disappear, and 19 of those were still in complete remission beyond three years.[^39] Checkpoint drugs free T cells that are held back; TIL therapy expands T cells that are outnumbered. A randomized phase 3 trial at Dutch and Danish centers, using a TIL product made in-house, later found responses in 49% of patients with advanced melanoma against 21% for ipilimumab.[^23] In February 2024 the FDA approved lifileucel, a commercial TIL product, for melanoma after anti-PD-1 failure, on accelerated terms, based on a single-arm study in which 31.5% of 73 patients responded.[^32] It was the first TIL therapy licensed in the US, and the first T-cell therapy of any kind licensed there for a solid tumor. Europe never licensed it; the application was withdrawn during review in July 2025.[^34] The treatment is demanding: every TIL-treated patient in the randomized trial had a grade 3 or worse adverse event, mostly from the lymphodepletion and the IL-2.

**{{tcr-t|TCR-T}} therapy** sits between the two. The cell receives a T-cell receptor cloned from someone whose immune system recognized the target, usually with its affinity increased in the laboratory, because natural tumor-reactive receptors often bind too weakly to be useful. Being a TCR, it recognizes peptides in the peptide-binding groove of {{mhc|MHC}}, so it can see proteins *inside* the cell.

That is its advantage, and it comes with two costs. The receptor works only in people with a matching {{hla|HLA}} type. And raising its affinity defeats the time-based filtering of Chapter 4, which discriminates by how long the receptor stays bound, and removes the one guarantee a natural receptor carries: that it passed negative selection in the thymus. An affinity-enhanced receptor against MAGE-A3, one of Chapter 6's cancer-testis antigens, unexpectedly also recognized a fragment of titin, a muscle protein, and the first two patients treated died of heart failure within days.[^25] Engineered receptors are now screened against the human protein repertoire for exactly this.

The one approved product is afamitresgene autoleucel, for synovial sarcoma, in patients carrying a particular HLA type (written HLA-A*02) whose tumor makes MAGE-A4. Approved on accelerated terms in August 2024 and confirmed in June 2026, with the indication extended to children as young as 12, it was the first engineered-receptor T-cell therapy for a solid tumor. About four in ten patients respond.[^32][^24]

| | **CAR-T** | **TIL** | **TCR-T** |
|---|---|---|---|
| What the cell is given | A synthetic receptor: scFv plus signaling domains | Nothing — its own receptors | A cloned TCR, usually affinity-enhanced |
| What it can see | Surface proteins only | Anything a natural T cell can | Proteins inside the cell, as peptides on HLA |
| Needs a matching HLA type? | No | No (they are the patient's own) | Yes |
| Weakened by tumor MHC loss? | No | Yes | Yes |
| Number of targets | One | Probably many (not measured) | One |
| Approved for | B-cell cancers, myeloma; gastric cancer in China | Melanoma (US) | Synovial sarcoma (US) |
| Main limitation | No good surface targets in most solid tumors | Needs a removable tumor; demanding regimen | HLA restriction; off-target risk |

## Three bets on the future

**Off-the-shelf cells.** Making a product from each patient is slow, costly and impossible for people too sick to wait, so one line of work is {{allogeneic|allogeneic}} products made in batches from donors, or from other cell types. The box below explains why that is harder than it sounds.

:::deep-dive Why someone else's cells are harder
{{allogeneic|Allogeneic}} products would be ready on the day they are needed, but the immune conflict runs in both directions. Donor T cells can attack the recipient's tissues ({{gvhd|graft-versus-host disease}}, the classic hazard of bone-marrow transplantation), and the recipient's own immune system rejects the donor cells, which is why gene-edited allogeneic CAR-T cells have so far disappeared sooner than a patient's own. Editing out the donor cells' T-cell receptor addresses the first problem; hiding them from the recipient is the harder one.

A different route changes the cell type. Natural killer cells carrying the same receptor ({{car-nk|CAR-NK}} cells) cause less cytokine release syndrome and little graft-versus-host disease, which makes them attractive for off-the-shelf use, but they persist for a shorter time.[^26] CAR-macrophages, which would engulf their targets ({{phagocytosis|phagocytosis}}) rather than kill them with cytotoxic granules, are at an earlier stage still.
:::

**{{in-vivo-car-t|In vivo CAR-T}}.** The most radical idea is to skip manufacturing: inject something that delivers the CAR gene to T cells inside the body, so that the patient's body makes the CAR-T cells. That would remove the need for {{apheresis|leukapheresis}} and the three-week wait, and could cost a fraction as much. The first published data arrived in 2025. Five myeloma patients received one infusion of a T-cell-targeted viral vector, with no lymphodepletion at all: four responded, three completely, all had a grade 3 or worse adverse event, and enrollment stopped after the fifth.[^27] Five patients with refractory lupus received a CD19 CAR as mRNA inside a {{lipid-nanoparticle|lipid nanoparticle}}, the type of lipid carrier used in the mRNA COVID-19 vaccines, and their circulating B cells were depleted and disease activity fell.[^28] So far the approach rests on a few dozen patients, most of them in datasets that companies have announced but not published.[^31]

**Autoimmune disease.** In cancer, destroying a patient's B cells is a side effect; in some autoimmune diseases it is the aim. In the first small German studies every lupus patient went into remission, and the B cells later returned without the disease.

:::deep-dive CAR-T against the immune system itself
Several autoimmune diseases are driven by B cells making antibodies against the patient's own tissues: systemic lupus erythematosus, some forms of muscle inflammation, systemic sclerosis. In lupus the targets sit in the cell nucleus: DNA and the proteins packed around it, which the antibodies bind, forming clumps called immune complexes that lodge in the kidneys, joints and skin. Drugs that deplete B cells, such as rituximab, help many patients, but they must be given repeatedly and they leave reservoirs of B cells untouched in lymph nodes and tissue.

A team in Erlangen gave a single infusion of CD19 CAR-T cells, at a dose like those used in cancer, to young patients with severe refractory lupus. By 2024 they had reported fifteen patients across three different diseases. Every lupus patient met formal remission criteria; every patient with muscle inflammation had a major clinical response; all fifteen stopped their immunosuppressive drugs entirely; ten had only the mildest grade of cytokine release syndrome.[^29] By 2025 the team had followed 11 lupus patients for a median of two and a half years: all remained in remission without immunosuppressive drugs, and only one had had a flare.[^41]

The B cells came back after about three to four months, and the disease did not. The returning B cells were naive, with unmutated receptors. The interpretation, still being tested, is that the CAR-T cells did more than deplete B cells: they reset the whole compartment, clearing the long-lived self-reactive clones and letting the body rebuild its B-cell repertoire from scratch, without the pathological memory.

The caveats are substantial: small numbers, selected young patients, short follow-up, and the unresolved question of whether exposing people with non-fatal diseases to lymphodepleting chemotherapy and a genetically modified cell product is an acceptable long-term trade. Larger trials are under way; in lupus they still have no comparison groups, but randomized trials have begun in other autoimmune diseases, such as myasthenia gravis and vasculitis.[^42] This is the first serious suggestion that some autoimmune diseases might be curable rather than only suppressible, and it came from cancer research.
:::

Chapters 8 to 10 have covered three ways to direct the immune system at a tumor: release its brakes, bridge T cells to the tumor with a molecule, or rebuild the T cell itself. Chapter 11 turns to an older and more ambitious approach: instead of engineering a cell to recognize a tumor, *teaching* the immune system to recognize it, as vaccines teach it to recognize a virus.

:::quiz
Q: Why can a CAR-T cell kill a tumor cell that has shut down its MHC class I molecules, when an ordinary killer T cell cannot?
- [ ] It carries a stronger version of the T-cell receptor that detects even very low levels of class I — Wrong: a CAR is not a T-cell receptor; it is built from an antibody and does not read MHC at all.
- [x] Its scFv binds a surface protein directly, as an antibody does — Right: MHC-independence is built into the design, which is why MHC loss does not hide a tumor from a CAR.
- [ ] Lymphodepleting chemotherapy restores MHC on the tumor cells — Wrong: that chemotherapy clears space for the infused cells and does nothing to tumor MHC.
- [ ] It kills by starving tumor cells rather than by contact — Wrong: it kills exactly as the killer T cell of Chapter 5 does, by forming a contact and delivering perforin and granzymes.

Q: Five days after a CD19 CAR-T infusion a patient has a high fever and falling blood pressure, and is given tocilizumab, which blocks the IL-6 receptor. What should happen to the engineered cells?
- [ ] They are inactivated along with the fever, so the cancer can return — Wrong: this is the key clinical finding from the first pediatric case; the cells kept working.
- [x] They keep expanding and killing, while the fever settles — Right: the fever is driven largely by host macrophages, so blocking the signal they send does not disable the therapy.
- [ ] They stop dividing but keep killing the cells they have already found — Wrong: blocking this receptor does not measurably restrain the engineered cells.
- [ ] Nothing: the fever is unrelated to the cells — Wrong: the fever is a downstream consequence of the cells doing their job.

Q: CD19 turned out to be an unusually good CAR-T target. Which description of an ideal target is correct?
- [ ] Hidden inside the cell, where only the tumor's own T cells can reach it — Wrong: a CAR can only ever see the outside of a cell.
- [x] On every tumor cell, and absent from tissues the body can't spare — Right: CD19 is on nearly all B cells, and B cells can be replaced with donor antibodies; a lung cannot.
- [ ] Displayed only in an MHC groove, so healthy cells stay hidden — Wrong: that describes a TCR's view, not a CAR's.
- [ ] On one tumor cell in ten, so that most healthy tissue is spared — Wrong: that guarantees escape by the nine cells that lack it.

Q: Early CARs carried only CD3ζ, the signaling domain that delivers signal 1. They killed in a dish but vanished within weeks in patients. What fixed it?
- [ ] Infusing far larger numbers of cells — Wrong: large doses were given, and the cells still disappeared.
- [ ] Swapping the scFv for a receptor that reads MHC — Wrong: that removes the design's main advantage.
- [x] Adding a costimulatory domain, so the receptor also delivers signal 2 — Right: one binding event now delivers both signals, and this second-generation design is why these cells persist and expand.
- [ ] Adding a second scFv, so the cell recognizes two targets — Wrong: useful against escape, but it does nothing about survival.
:::

:::takeaways
- CAR-T cells are a patient's own T cells given a synthetic targeting receptor, infused once, that multiply a hundredfold or more inside the body. The dose is only a starting point, and the cells cannot be withdrawn.
- The receptor is an antibody's variable regions (an scFv) outside the cell, joined through a hinge and transmembrane domain to T-cell signaling domains inside. The design worked only once a costimulatory domain (signal 2) was built into the same molecule as CD3ζ (signal 1), which also removed the independent check a natural T cell gets.
- Because it reads the cell surface directly, a CAR ignores MHC loss, one of the commonest escape routes. The same property makes every protein inside the cell invisible to it.
- Response rates in refractory blood cancers are among the highest in oncology, but response is not cure: most lymphoma patients who respond eventually relapse, and the lasting remissions belong to a minority.
- The toxicities come from the same activity that makes the therapy work: cytokine release syndrome, driven largely by IL-6 from the patient's own macrophages (treatable by blocking the IL-6 receptor), neurotoxicity (ICANS), prolonged low blood counts with infection as the leading cause of non-relapse death, and the loss of healthy B cells.
- Blood cancers had an unusually clean target in CD19. Solid tumors have none, and they add heterogeneity, poor access and a suppressive microenvironment, which is why the first solid-tumor CAR-T approval came only in 2026 and buys weeks rather than years. TIL and TCR-T therapies attack the targeting problem from the other end.
:::

## Glossary
- car-t | CAR-T cell | A T cell taken from a patient and given a synthetic receptor that makes it attack a chosen target. Because the cell multiplies and can persist for years, it is called a "living drug".
- chimeric-antigen-receptor | Chimeric antigen receptor (CAR) | A laboratory-made receptor that joins an antibody's target-binding variable regions (an scFv) outside the cell, through a hinge and a transmembrane domain, to T-cell signaling domains inside it: CD3ζ plus, in approved products, one costimulatory domain. "Chimeric" because it is assembled from parts of different molecules, after the Chimera of Greek myth, a monster made from parts of different animals.
- scfv | scFv (single-chain variable fragment) | The target-binding part of an antibody: the variable regions of its heavy and light chains joined by a short flexible linker into one protein chain. It determines what a CAR binds.
- cd3-zeta | CD3ζ (CD3 zeta) | A signaling chain of the T-cell receptor's CD3 complex that carries signal 1 into the cell when the receptor binds its target. Its intracellular domain is the activating part of every approved chimeric antigen receptor.
- costimulation | Costimulation (signal 2) | A confirming signal a T cell needs, in addition to recognizing its target, before it will fully commit. In a CAR it is supplied by a costimulatory domain (from CD28 or 4-1BB) built into the receptor's intracellular part.
- cd19 | CD19 | A protein on the surface of nearly every B cell, healthy or cancerous. It was the first successful CAR-T target, because B cells can be destroyed and their antibodies replaced from donors.
- bcma | BCMA | A protein on mature antibody-producing plasma cells and on myeloma cells. It is the target of the approved CAR-T products for multiple myeloma.
- apheresis | Leukapheresis | A procedure lasting a few hours in which blood is drawn, passed through a machine that skims off white blood cells, and returned. It collects the starting material for a cell therapy.
- refractory | Refractory | Describes a cancer that does not respond to treatment, or has stopped responding. "Relapsed" means it came back after a response.
- autologous | Autologous | Coming from the patient's own body. Every approved CAR-T, TIL and TCR-T product is autologous.
- allogeneic | Allogeneic | Coming from a donor rather than the patient. Allogeneic ("off-the-shelf") products could be made in batches in advance, but risk attacking the recipient or being rejected by them.
- transduction | Transduction | Delivery of a gene into a cell by a viral vector. In CAR-T manufacturing, the CAR gene is transduced into the patient's T cells, where it integrates into their DNA.
- viral-vector | Viral vector | A virus stripped of the genes it needs to replicate and cause disease, used to carry a chosen gene into cells. Lentiviral and retroviral vectors integrate the gene permanently into the cell's chromosomes.
- gvhd | Graft-versus-host disease | The reaction in which transplanted donor immune cells attack the recipient's own tissues. It is the main danger of using someone else's T cells.
- lentiviral-vector | Lentiviral vector | A gene-delivery tool built from a disabled HIV that cannot copy itself or cause disease. It integrates a new gene permanently into a cell's chromosomes.
- lymphodepletion | Lymphodepletion | A short course of chemotherapy, usually fludarabine and cyclophosphamide, given before a cell infusion. It clears existing lymphocytes so the infused cells face less competition for space and survival signals.
- crs | Cytokine release syndrome | A systemic inflammatory reaction — fever, low blood pressure, breathlessness — set off when engineered cells engage their targets in large numbers. Much of the key cytokine, IL-6, comes from the patient's own macrophages rather than from the engineered cells. Popularly called a "cytokine storm".
- icans | ICANS (neurotoxicity) | Immune effector cell-associated neurotoxicity syndrome: confusion, difficulty speaking or writing, tremor and, rarely, seizures or brain swelling, appearing days after a cell infusion. Usually reversible.
- on-target-off-tumor | On-target, off-tumor toxicity | Damage caused by a therapy working exactly as designed, on healthy cells that happen to carry the same target as the tumor. The loss of normal B cells after CD19 CAR-T is the classic example.
- antigen-escape | Antigen escape | Relapse of a cancer in a form that no longer displays the target the therapy was aimed at, because treatment selected for cells that lacked it or could stop making it.
- til | Tumor-infiltrating lymphocytes (TIL) | T cells harvested from inside a patient's own tumor, grown to very large numbers in the laboratory, and given back. Their receptors are the patient's own and are not engineered.
- tcr-t | TCR-T cell | A T cell engineered with a T-cell receptor cloned from someone whose immune system recognized a particular tumor peptide, usually with its affinity increased in the laboratory. Unlike a CAR it can see proteins inside a cell — but only in people with a matching HLA type.
- armored-car | Armored CAR | A CAR-T cell carrying an extra gene, usually for a cytokine, that it releases on engaging its target, intended to help immune cells survive and work inside a suppressive tumor. Experimental.
- synnotch | SynNotch | A synthetic receptor that, on binding one antigen, induces expression of a gene — for example the gene for a CAR against a second antigen. It is how a two-marker "AND" rule is built into a cell.
- car-nk | CAR-NK cell | A natural killer cell given a chimeric antigen receptor. Early studies suggest less cytokine release syndrome and less risk from donor cells, at the cost of persisting for a shorter time.
- in-vivo-car-t | In vivo CAR-T | An experimental approach that delivers the CAR gene to a patient's T cells inside the body, using a targeted viral vector or a lipid nanoparticle, instead of manufacturing cells outside it.

## Sources
1. Gross G, Waks T, Eshhar Z. Expression of immunoglobulin-T-cell receptor chimeric molecules as functional receptors with antibody-type specificity. *Proc Natl Acad Sci U S A* 1989;86:10024–10028. doi:10.1073/pnas.86.24.10024
2. Kershaw MH, Westwood JA, Parker LL, et al. A phase I study on adoptive immunotherapy using gene-modified T cells for ovarian cancer. *Clin Cancer Res* 2006;12:6106–6115. doi:10.1158/1078-0432.CCR-06-1183
3. Maher J, Brentjens RJ, Gunset G, Rivière I, Sadelain M. Human T-lymphocyte cytotoxicity and proliferation directed by a single chimeric TCRζ/CD28 receptor. *Nat Biotechnol* 2002;20:70–75. doi:10.1038/nbt0102-70
4. Imai C, Mihara K, Andreansky M, et al. Chimeric receptors with 4-1BB signaling capacity provoke potent cytotoxicity against acute lymphoblastic leukemia. *Leukemia* 2004;18:676–684. doi:10.1038/sj.leu.2403302
5. Porter DL, Levine BL, Kalos M, Bagg A, June CH. Chimeric antigen receptor-modified T cells in chronic lymphoid leukemia. *N Engl J Med* 2011;365:725–733. doi:10.1056/NEJMoa1103849
6. Grupp SA, Kalos M, Barrett D, et al. Chimeric antigen receptor-modified T cells for acute lymphoid leukemia. *N Engl J Med* 2013;368:1509–1518. doi:10.1056/NEJMoa1215134
7. Maude SL, Laetsch TW, Buechner J, et al. Tisagenlecleucel in children and young adults with B-cell lymphoblastic leukemia (ELIANA). *N Engl J Med* 2018;378:439–448. doi:10.1056/NEJMoa1709866
8. Neelapu SS, Jacobson CA, Ghobadi A, et al. Five-year follow-up of ZUMA-1 supports the curative potential of axicabtagene ciloleucel in refractory large B-cell lymphoma. *Blood* 2023;141:2307–2315. doi:10.1182/blood.2022018893
9. Westin JR, Oluwole OO, Kersten MJ, et al. Survival with axicabtagene ciloleucel in large B-cell lymphoma (ZUMA-7). *N Engl J Med* 2023;389:148–157. doi:10.1056/NEJMoa2301665
10. San-Miguel J, Dhakal B, Yong K, et al. Cilta-cel or standard care in lenalidomide-refractory multiple myeloma (CARTITUDE-4). *N Engl J Med* 2023;389:335–347. doi:10.1056/NEJMoa2303379
11. Melenhorst JJ, Chen GM, Wang M, et al. Decade-long leukaemia remissions with persistence of CD4+ CAR T cells. *Nature* 2022;602:503–509. doi:10.1038/s41586-021-04390-6
12. Giavridis T, van der Stegen SJC, Eyquem J, Hamieh M, Piersigilli A, Sadelain M. CAR T cell-induced cytokine release syndrome is mediated by macrophages and abated by IL-1 blockade. *Nat Med* 2018;24:731–738. doi:10.1038/s41591-018-0041-7
13. Cordas Dos Santos DM, Tix T, Shouval R, et al. A systematic review and meta-analysis of nonrelapse mortality after CAR T cell therapy. *Nat Med* 2024;30:2667–2678. doi:10.1038/s41591-024-03084-6
14. Verdun N, Marks P. Secondary cancers after chimeric antigen receptor T-cell therapy. *N Engl J Med* 2024;390:584–586. doi:10.1056/NEJMp2400209
15. Hamilton MP, Sugio T, Noordenbos T, et al. Risk of second tumors and T-cell lymphoma after CAR T-cell therapy. *N Engl J Med* 2024;390:2047–2060. doi:10.1056/NEJMoa2401361
16. Morgan RA, Yang JC, Kitano M, Dudley ME, Laurencot CM, Rosenberg SA. Case report of a serious adverse event following the administration of T cells transduced with a chimeric antigen receptor recognizing ERBB2. *Mol Ther* 2010;18:843–851. doi:10.1038/mt.2010.24
17. Qi C, Liu C, Peng Z, et al. Claudin-18 isoform 2-specific CAR T-cell therapy (satri-cel) versus treatment of physician's choice for previously treated advanced gastric or gastro-oesophageal junction cancer (CT041-ST-01): a randomised, open-label, phase 2 trial. *Lancet* 2025;405:2049–2060. doi:10.1016/S0140-6736(25)00860-8
18. Roybal KT, Rupp LJ, Morsut L, et al. Precision tumor recognition by T cells with combinatorial antigen-sensing circuits. *Cell* 2016;164:770–779. doi:10.1016/j.cell.2016.01.011
19. Choi BD, Gerstner ER, Frigault MJ, et al. Intraventricular CARv3-TEAM-E T cells in recurrent glioblastoma. *N Engl J Med* 2024;390:1290–1298. doi:10.1056/NEJMoa2314390
20. Roddie C, Sandhu KS, Tholouli E, et al. Obecabtagene autoleucel in adults with B-cell acute lymphoblastic leukemia (FELIX). *N Engl J Med* 2024;391:2219–2230. doi:10.1056/NEJMoa2406526
21. Monje M, Mahdi J, Majzner R, et al. Intravenous and intracranial GD2-CAR T cells for H3K27M+ diffuse midline gliomas. *Nature* 2025;637:708–715. doi:10.1038/s41586-024-08171-9
22. Steffin D, Ghatwai N, Montalbano A, et al. Interleukin-15-armoured GPC3 CAR T cells for patients with solid cancers. *Nature* 2025;637:940–946. doi:10.1038/s41586-024-08261-8
23. Rohaan MW, Borch TH, van den Berg JH, et al. Tumor-infiltrating lymphocyte therapy or ipilimumab in advanced melanoma. *N Engl J Med* 2022;387:2113–2125. doi:10.1056/NEJMoa2210233
24. D'Angelo SP, Araujo DM, Abdul Razak AR, et al. Afamitresgene autoleucel for advanced synovial sarcoma and myxoid round cell liposarcoma (SPEARHEAD-1). *Lancet* 2024;403:1460–1471. doi:10.1016/S0140-6736(24)00319-2
25. Linette GP, Stadtmauer EA, Maus MV, et al. Cardiovascular toxicity and titin cross-reactivity of affinity-enhanced T cells in myeloma and melanoma. *Blood* 2013;122:863–871. doi:10.1182/blood-2013-03-490565
26. Liu E, Marin D, Banerjee P, et al. Use of CAR-transduced natural killer cells in CD19-positive lymphoid tumors. *N Engl J Med* 2020;382:545–553. doi:10.1056/NEJMoa1910607
27. An N, Wang D, Zhang P, et al. In vivo generation of anti-BCMA CAR-T cells in relapsed or refractory multiple myeloma: a phase 1 study. *Nat Med* 2026;32:1257–1266. doi:10.1038/s41591-026-04244-6
28. Wang Q, Xiao ZX, Zheng X, et al. In vivo CD19 CAR T-cell therapy for refractory systemic lupus erythematosus (correspondence). *N Engl J Med* 2025;393:1542–1544. doi:10.1056/NEJMc2509522
29. Müller F, Taubmann J, Bucci L, et al. CD19 CAR T-cell therapy in autoimmune disease — a case series with follow-up. *N Engl J Med* 2024;390:687–700. doi:10.1056/NEJMoa2308917
30. Locke FL, Siddiqi T, Jacobson CA, et al. Impact of vein-to-vein time in patients with relapsed/refractory large B-cell lymphoma treated with axicabtagene ciloleucel. *Blood Adv* 2025;9:2663–2676. doi:10.1182/bloodadvances.2024013656 (median vein-to-vein time 30.6 days for axi-cel, 35.9 for liso-cel, 48.4 for tisa-cel)
31. Company-reported, not peer-reviewed: Kelonia Therapeutics, in-vivo BCMA CAR (KLN-1010) phase 1 interim data, 18 patients dosed, announced 31 May 2026 (ASCO 2026 abstract 7509, *J Clin Oncol* 2026;44(16_suppl):7509).
32. US Food and Drug Administration, cell-therapy approvals. Amtagvi (lifileucel) for unresectable or metastatic melanoma, accelerated approval 16 Feb 2024, objective response rate 31.5% in 73 patients: https://www.fda.gov/news-events/press-announcements/fda-approves-first-cellular-therapy-treat-patients-unresectable-or-metastatic-melanoma · Tecelra (afamitresgene autoleucel) for synovial sarcoma, accelerated approval 2 Aug 2024: https://www.fda.gov/news-events/press-announcements/fda-approves-first-gene-therapy-treat-adults-metastatic-synovial-sarcoma — full approval with the indication extended to patients aged 12 and older announced by US WorldMeds on 22 Jun 2026 (137 patients, response rate 43.8%) · Aucatzyl (obecabtagene autoleucel) for adult B-cell acute lymphoblastic leukemia, 8 Nov 2024: https://www.fda.gov/vaccines-blood-biologics/aucatzyl · Breyanzi (lisocabtagene maraleucel) for relapsed or refractory marginal zone lymphoma, 4 Dec 2025, response in 95.5% of the 66 patients treated with complete responses in 62.1%: https://www.fda.gov/news-events/press-announcements/fda-approves-first-car-t-cell-therapy-marginal-zone-lymphoma-us
33. US Food and Drug Administration, safety and risk-management actions. Boxed warning for T-cell malignancies added to approved BCMA- and CD19-directed autologous CAR-T products, 18 Apr 2024; label expansions moving both BCMA products into earlier lines of myeloma treatment, April 2024; elimination of the risk evaluation and mitigation strategy (REMS) for the approved autologous CAR-T products, 26 Jun 2025, with the proximity recommendation reduced from four weeks to two and the driving restriction from eight weeks to two: https://www.fda.gov/vaccines-blood-biologics/safety-availability-biologics · removal of the Limitations of Use that had excluded primary central nervous system lymphoma from axicabtagene ciloleucel's label, 6 Feb 2026: https://www.gilead.com/news/news-details/2026/fda-approves-label-update-for-kites-yescarta-for-relapsedrefractory-primary-central-nervous-system-lymphoma
34. European Medicines Agency. Amtagvi (lifileucel): marketing-authorization application withdrawn during review, 22 July 2025. https://www.ema.europa.eu/en/medicines/human/EPAR/amtagvi
35. CARsgen Therapeutics. Approval of satricabtagene autoleucel by China's National Medical Products Administration for CLDN18.2-positive, HER2-negative advanced gastric or gastro-oesophageal junction adenocarcinoma after at least two prior lines of treatment; 22 June 2026. https://www.carsgen.com/en/news/20260622/
36. Pulice TD, Schulman KA. CAR-T therapy: escalating costs in an expanding market. *Health Management, Policy and Innovation* 2026;11(1). https://hmpi.org/2026/02/18/car-t-therapy-escalating-costs-in-an-expanding-market/
37. Children's Hospital of Philadelphia. Emily Whitehead, first pediatric patient to receive CAR T-cell therapy, celebrates cure 10 years later; 10 May 2022. https://www.chop.edu/news/emily-whitehead-first-pediatric-patient-receive-car-t-cell-therapy-celebrates-cure-10-years
38. Siegel RL, Kratzer TB, Wagle NS, Sung H, Jemal A. Cancer statistics, 2026. *CA Cancer J Clin* 2026;76(1):e70043. doi:10.3322/caac.70043 (projected US deaths in 2026: 626,140 from all cancers; leukemia 23,910, lymphoma 21,070, myeloma 10,850)
39. Rosenberg SA, Yang JC, Sherry RM, et al. Durable complete responses in heavily pretreated patients with metastatic melanoma using T-cell transfer immunotherapy. *Clin Cancer Res* 2011;17:4550–4557. doi:10.1158/1078-0432.CCR-11-0116
40. Bhoj VG, Arhontoulis D, Wertheim G, et al. Persistence of long-lived plasma cells and humoral immunity in individuals responding to CD19-directed CAR T-cell therapy. *Blood* 2016;128:360–370. doi:10.1182/blood-2016-01-694356
41. Taubmann J, Böltz S, Hagen M, et al. Langzeitverlauf von Effizienz und Sicherheit der CD19-CAR T-Zell-Therapie beim systemischen Lupus erythematodes [Long-term follow up of efficiency and safety of CD19-CAR T-cell treatment of systemic lupus erythematosus]. *Z Rheumatol* 2025;84:612–620. doi:10.1007/s00393-025-01705-0
42. ClinicalTrials.gov registry records, checked October 2026. Lupus, single-arm (no comparison group): rapcabtagene autoleucel, phase 2, NCT06581198 (https://clinicaltrials.gov/study/NCT06581198); zolacabtagene autoleucel (Breakfree-SLE), phase 2, NCT07015983 (https://clinicaltrials.gov/study/NCT07015983). Randomized: Descartes-08 versus placebo in myasthenia gravis, phase 3, NCT06799247 (https://clinicaltrials.gov/study/NCT06799247); KYV-101 versus standard care in myasthenia gravis, phase 2/3, NCT06193889 (https://clinicaltrials.gov/study/NCT06193889); rapcabtagene autoleucel versus an active comparator in ANCA-associated vasculitis, phase 2, NCT06868290 (https://clinicaltrials.gov/study/NCT06868290)
43. RECOVERY Collaborative Group. Tocilizumab in patients admitted to hospital with COVID-19 (RECOVERY): a randomised, controlled, open-label, platform trial. *Lancet* 2021;397:1637–1645. doi:10.1016/S0140-6736(21)00676-0 (28-day mortality 621/2,022 [31%] with tocilizumab vs 729/2,094 [35%] with usual care)
44. US Food and Drug Administration, prescribing information (gene-transfer vector). Retroviral: Yescarta (axicabtagene ciloleucel), https://www.fda.gov/vaccines-blood-biologics/cellular-gene-therapy-products/yescarta-axicabtagene-ciloleucel ; Tecartus (brexucabtagene autoleucel), https://www.fda.gov/vaccines-blood-biologics/cellular-gene-therapy-products/tecartus-brexucabtagene-autoleucel . Lentiviral: Kymriah (tisagenlecleucel), Breyanzi (lisocabtagene maraleucel), Abecma (idecabtagene vicleucel), Carvykti (ciltacabtagene autoleucel) and Aucatzyl (obecabtagene autoleucel), each described in section 11 of its label.
