---
id: 08-checkpoints
title: Checkpoint Inhibitors
subtitle: Checkpoint inhibitors do not attack cancer cells; they release brakes on T cells. For a minority of patients, the benefit lasts for years.
part: III
reading_time: 27
hero: ch08-hero
---

In August 2015, surgeons in Atlanta removed a small tumor from the liver of Jimmy Carter, the 39th president of the United States, then 90 years old. It was {{melanoma|melanoma}}, and it had already spread: scans found four small tumors in his brain.[^1]

His doctors treated the brain tumors with focused radiation and started him on pembrolizumab (Keytruda), a drug approved for advanced melanoma only the year before, given by infusion every three weeks.[^2]

In December, Carter told his Sunday-school class that his latest brain scan showed no sign of cancer. In March 2016 he told them his doctors had decided he needed no more treatment.[^2] He lived another nine years and died in December 2024, at 100.

A single case proves little: Carter also had radiation, and many people whose melanoma reaches the brain do far worse. But it illustrates what is unusual about the drug. Unlike {{chemotherapy|chemotherapy}}, pembrolizumab does not kill cancer cells directly or even bind them; it binds and blocks one receptor on the surface of {{t-cell|T cells}}, a brake on their activity. Drugs that work this way, checkpoint inhibitors, made {{immunotherapy|immunotherapy}} a standard cancer treatment.

## Brakes, briefly

Two brakes matter here, both inhibitory receptors on T cells introduced in [Chapter 5](05-t-cells.html); the formal term is immune {{checkpoint|checkpoints}}.

**{{ctla-4|CTLA-4}}** acts early, in the {{lymph-node|lymph nodes}} where T cells are first activated, a step called {{priming|priming}}. **{{pd-1|PD-1}}** acts later, out in the tissues: when it binds its {{ligand|ligand}} (binding partner) **{{pd-l1|PD-L1}}** on another cell, it sends an inhibitory signal into the T cell. Many tumors express PD-L1 on their surface, often in response to the {{ifn-gamma|interferon-gamma}} secreted by attacking T cells ([Chapter 7](07-escape.html)).

The brakes are essential: mice born without CTLA-4 die within weeks, their organs infiltrated by their own T cells. But they are not the main way a response ends. A response to an infection winds down chiefly because the pathogen is cleared (Chapter 5); a tumor persists, so the brakes and {{exhaustion|exhaustion}} are what hold the attack back.

A {{checkpoint-inhibitor|checkpoint inhibitor}} gives T cells no new ability to recognize cancer. And a drug in the blood cannot release a brake only in the tumor; it releases it everywhere.

## Blocking the binding site

Every checkpoint inhibitor approved in the United States is a {{monoclonal-antibody|monoclonal antibody}}: identical copies of one Y-shaped antibody, whose two arms (the {{fab|Fab arms}}) each end in the same binding site for a single target ([Chapter 3](03-adaptive.html)). (China has also approved {{bispecific-antibody|bispecific antibodies}} such as ivonescimab, which carry binding sites for two different targets and so block a checkpoint and a second target at once; see Chapter 12.)

An anti-PD-1 antibody binds the same patch of PD-1 that PD-L1 would otherwise bind. While the antibody is bound, PD-L1 cannot reach that site, and the inhibitory signal is never sent. These antibodies bind with high {{affinity|affinity}}, so each stays bound for a long time, and the body clears them slowly. The share of target molecules with drug bound is called {{receptor-occupancy|receptor occupancy}}; after one infusion, most of the target stays occupied for weeks, often two months or more.[^39]

Four drugs come up most often in this chapter. Pembrolizumab and nivolumab (Opdivo) block PD-1 on T cells. Atezolizumab (Tecentriq) blocks PD-L1, on the tumor and the immune cells around it. Ipilimumab (Yervoy) blocks CTLA-4. Others work the same way (see the box below); by 2023, eleven checkpoint inhibitors had been approved in the United States for 20 types of advanced cancer, and more have followed.[^3]

:::key-idea
A checkpoint inhibitor adds no activating signal of its own and gives T cells no new targets. It removes an inhibitory signal, so it can help only T cells whose receptors already recognize something on the cancer, including some that had not yet been activated.
:::

:::figure ch08-blockade
title: Blocking PD-1 or PD-L1
goal: After using this, the reader understands that a checkpoint inhibitor physically covers one partner of the PD-1–PD-L1 handshake so the brake signal cannot be sent — and that this matters only when the T cell recognizes something on the cancer cell.
kind: explorer
stage: dark
spec: |
  ROLE. The book's only drug close-up (FIGURE-AUDIT §2A). Build it on the shared `synapse` scene
  (`synapseScene` with pairs tcr-mhc ×1 and pd1-pdl1 ×4; `cap()` for antibodies; `pulses()`; `setDisplay()`) and the
  shared `activity-meter` (gauge mode). Follow FIGURE-AUDIT §4 rules exactly; where this spec and §4 differ, §4 wins.
  Stage tags (top right, t-caps): "Not to scale" and "Illustrative" — both always visible, including on phones.

  LAYOUT (desktop, ~16:9). Top ~30% of the stage: the underside of a killer T cell (`tCell`, canonical blue, fine
  microvilli fuzz), labeled "Killer T cell". Bottom ~30%: the top of a cancer cell (`cancerCell`, lumpy membrane),
  labeled "Cancer cell". Between them, a dark gap. At the right edge, a vertical gauge labeled "T-cell activity".

  MOLECULES IN THE GAP (all from the art library):
  - Center: one TCR (`tcr`) meeting one MHC class I cup (`mhc1({ peptide })`) head to head; the peptide is hot pink with
    a glow (a neoantigen). Label: "TCR recognizes a neoantigen". While engaged, show the recognition ring
    (`recognize()`) plus a green-cyan "+" disc at the contact.
  - On each side of the center: 2 PD-1 receptors (library `pd1`: crimson stalk, socket head) hanging from the T cell
    only, each facing a PD-L1 (library `pdl1`: light crimson stalk, plug head) rising from the cancer cell. Label one
    of each. An engaged pair shows interlocked heads plus one crimson "−" disc on the T-cell side.
  - Antibody (only when a drug is selected): `antibody({ variant:'therapeutic' })` — gold with a white outline, about
    2–3× the height of a PD-1 stalk. One arm tip caps the head of its target; the Fc stem points away from every other
    molecule and engages nothing.

  SIGNALS (shape carries meaning, not only color):
  - While the TCR is engaged, small green-cyan "+" discs travel up into the T cell toward the gauge (`pulseAlong`, sign +),
    about one every 0.6 s.
  - Each engaged PD-1–PD-L1 pair sends crimson "−" bar discs inward. Where a "−" meets a "+", the "+" fades (damping).
  - Pairs are dynamic (`life:[2, 4]` s): each separates and re-forms at random, so at any moment most, not all, are
    paired. A capped molecule can never pair. Antibodies, once docked, stay put.

  GAUGE (shared `activity-meter`, gauge mode, tag "Illustrative"). Three zones, low to high: "alert", "multiplying",
  "killing". No drug: the needle sits in "alert". Either drug (with the neoantigen displayed): it rises to "killing".
  Neoantigen not displayed: it falls to the bottom, whatever the drug. Tween changes over ~0.8 s.
  At "killing", show granules gathering toward the contact (`polarize`) and, after ~1 s, the cancer-cell membrane
  segment under the contact begins to bleb (`setDying` partial, held at ~0.3; the cell is mostly off-stage, so no full
  death animation). Nothing flashes. Never show any killing step when the neoantigen is not displayed.

  CONTROLS (below the stage):
  1. Segmented control "Drug": None · Anti-PD-1 · Anti-PD-L1. Choosing a drug makes antibodies drift in from the side
     edges and dock one by one over ~1.5 s: onto PD-1 (T-cell side) for anti-PD-1, onto PD-L1 (cancer-cell side) for
     anti-PD-L1. Switching drugs undocks the old antibodies (they drift out) and docks the new ones.
  2. Toggle "Cancer cell displays its neoantigen": On (default) / Off. Off removes the MHC cups from the cancer-cell
     surface entirely (a shuttered window is absent cups, never empty cups — §4 rule 3). No "+" discs are made, and the
     "−" discs have nothing to damp.

  CAPTIONS (reader-facing, verbatim; show the matching one in an ARIA live region under the stage):
  - None, displayed: "The T cell recognizes the cancer cell, but every PD-1–PD-L1 handshake sends a stop signal, holding the attack below the level needed to kill."
  - Anti-PD-1, displayed: "Antibodies cover PD-1 on the T cell, so PD-L1 has nothing to grab. With the brake silenced, the recognition signal gets through, and the T cell attacks."
  - Anti-PD-L1, displayed: "This time the antibodies cover PD-L1 on the cancer cell. The handshake is blocked from the other side, with the same result."
  - Any drug, not displayed: "With no neoantigen on display, there is nothing to unleash. Releasing the brake cannot help a T cell that cannot see the cancer."
  - None, not displayed: "This cancer cell has stopped displaying its neoantigen. The T cell has no reason to attack, brake or no brake."

  SCIENTIFIC GUARDRAILS. Anti-PD-1 binds only PD-1 (on the T cell). Anti-PD-L1 binds only PD-L1 — in this scene, on the
  cancer cell (in patients, PD-L1 on nearby immune cells matters too). Antibodies never bind the TCR or MHC, carry
  nothing, and never damage the cancer cell themselves; any harm comes from the T cell. The real gap at a T-cell
  contact is about 15 nm; drawing it wider so the antibodies fit is an acceptable simplification. Never draw PD-1 on
  the cancer cell. No "accelerator" artwork here (that belongs to CD28).

  MOBILE (<600 px). Portrait viewBox: T-cell band at top, cancer band at bottom, the TCR–MHC pair plus 2 PD-1–PD-L1
  pairs. The gauge becomes a horizontal bar under the stage with the same three zones and its "Illustrative" tag.
  Controls stack full width. Labels ≥14 px.

  REDUCED MOTION. No pulses or drifting: show static "+" and "−" discs, dock antibodies instantly, jump the gauge.
alt: A close-up of the gap between a killer T cell and a cancer cell. The T cell's receptor recognizes a mutated peptide presented on MHC class I by the cancer cell, but PD-1 on the T cell binds PD-L1 on the cancer cell and sends an inhibitory signal that keeps the T cell's activity low. When antibodies bind PD-1, or PD-L1, the two cannot bind each other and the T cell's activity rises high enough to attack. If the cancer cell stops displaying its peptide, blocking the brake makes no difference.
:::

:::deep-dive Anatomy of a checkpoint drug
All checkpoint inhibitors approved in the United States are IgG antibodies, the most common {{antibody-class|antibody class}} in blood; an anti-PD-1 antibody is several times larger than the part of PD-1 it binds. The main ones:

| Brake blocked | Drugs (brand names) |
|---|---|
| PD-1 (on T cells) | pembrolizumab (Keytruda), nivolumab (Opdivo), cemiplimab (Libtayo), dostarlimab (Jemperli), and newer ones such as retifanlimab (Zynyz), toripalimab (Loqtorzi), tislelizumab (Tevimbra) and penpulimab |
| PD-L1 (on tumor and immune cells) | atezolizumab (Tecentriq), durvalumab (Imfinzi), avelumab (Bavencio), cosibelimab (Unloxcyt) |
| CTLA-4 | ipilimumab (Yervoy), tremelimumab (Imjudo) |
| LAG-3 | relatlimab (sold with nivolumab as Opdualag) |

**The Fc region.** An antibody's {{fc-region|Fc region}}, the constant stem of the Y, binds {{fc-receptor|Fc receptors}} on other immune cells, which can then destroy whatever the antibody is bound to (Chapter 3). An anti-PD-1 antibody that did this would deplete the very T cells it is meant to free. So the established PD-1 blockers — nivolumab, pembrolizumab, cemiplimab, dostarlimab — are built on the IgG4 subclass, whose Fc region triggers this destruction only weakly. Atezolizumab is an IgG1 antibody with an Fc region engineered not to trigger it,[^4] and so is the newer PD-1 blocker penpulimab.[^5] Ipilimumab (IgG1) and tremelimumab (IgG2), by contrast, have Fc regions that can bind Fc receptors, which matters for a later box on regulatory T cells.[^6]

**Receptor or ligand.** Anti-PD-1 stops PD-1 from binding either of its ligands, PD-L1 or its relative PD-L2. Anti-PD-L1 leaves PD-L2 free, but also stops PD-L1 from binding one of the B7 molecules, CD80. Whether this matters in patients is unclear; there are few head-to-head trials.

**Dosing.** Because antibodies are cleared slowly, infusions are spaced weeks apart. In landmark trials, nivolumab was given every two weeks[^7] and pembrolizumab every three weeks for up to about two years.[^8]
:::

## Two brakes, two places

**Anti-CTLA-4 acts mainly during priming.** In a lymph node, a {{dendritic-cell|dendritic cell}} presents peptides from tumor proteins to passing T cells. To be fully activated, a T cell also needs a second signal, {{costimulation|costimulation}}, which arrives when {{cd28|CD28}}, a receptor on the T cell, binds molecules called {{b7|B7}} on the dendritic cell. CTLA-4 binds B7 with higher affinity than CD28 does, and {{regulatory-t-cell|regulatory T cells}}, which suppress other immune cells, express a lot of it. Chapter 5 described this competition for B7 as limiting how large a response grows; clone by clone, it probably also raises the activation threshold, so only strong matches are activated. Blocking CTLA-4 makes the response larger and broader: weaker matches join in, and T cells from more {{clone|clones}} leave the node.

The broader response has a cost. {{negative-selection|Negative selection}} in the thymus removes T cells that react strongly to the body's own proteins but lets weakly self-reactive ones through (Chapter 5), and some of these are activated too, probably one reason ipilimumab causes more serious side effects than PD-1 blockers.

**Anti-PD-1 and anti-PD-L1 act mainly in the tumor.** T cells that have been stimulated inside a tumor for weeks become exhausted: they express high levels of PD-1, divide little and kill poorly. As Chapter 5 described, blocking PD-1 mainly acts on a small reserve of {{stem-like-t-cell|stem-like T cells}} (marked by TCF1), which divide and differentiate into new killer cells; it does little to revive the most exhausted cells.

That reserve also sits in the lymph nodes that drain the tumor, where PD-L1 on dendritic cells restrains T cells as they are primed; in mice, blocking PD-L1 in those nodes alone improved tumor control by supplying the tumor with stem-like cells.[^9] And when scientists tracked individual T-cell clones in patients before and after treatment, many clones that expanded in the tumor had not been detectable there before, suggesting that the tumor was being resupplied from elsewhere.[^10][^11] Their receptors fit the tumor; that they had been primed elsewhere is inferred rather than shown.

:::deep-dive Where do the responding T cells come from?
For years the favored explanation was "reinvigoration": PD-1 blockade revives exhausted T cells already in the tumor. Newer evidence suggests that much of the response comes from elsewhere.

First, as Chapter 5 described, the burst after PD-1 blockade comes mainly from the stem-like, TCF1-positive reserve, which sits largely in lymphoid tissue.[^13]

Second, in 2019 a Stanford team sequenced the receptors of tens of thousands of single T cells (each clone's receptor sequence is unique) in skin cancers (basal-cell and squamous-cell carcinomas) sampled before and after anti-PD-1 treatment. The expanded clones with the hallmarks of tumor-reactive cells were mostly clones that had not been detected in the tumor beforehand. The team called this {{clonal-replacement|clonal replacement}}.[^10] (Biopsies sample only part of a tumor, so "not detected" is not quite "absent".)

Third, a study of 47 biopsies from 36 patients with lung cancer found a mixture of both.[^11] In tumors that responded, a population of precursor exhausted cells (overlapping with, though not identical to, the TCF1-positive cells) accumulated, both by dividing locally and by being replenished from the blood — with new clones as well as old ones. The authors called this "clonal revival." Terminally exhausted cells were unlikely to be the source.

Together, these studies suggest that PD-1 blockade works less by reviving exhausted cells than by releasing a reserve, in the tumor, the lymph nodes and the blood, that produces new killer cells. The mix varies by cancer and by patient. They also suggest that lymph nodes, and a steady supply of new T cells, matter a great deal, an idea [Chapter 12](12-frontier.html) builds on.
:::

Because anti-CTLA-4 acts chiefly at priming and anti-PD-1 chiefly inside the tumor, the two drugs combine well.

:::figure ch08-two-brakes
title: Two brakes, two places
goal: After stepping through this, the reader understands where each drug mainly acts — anti-CTLA-4 where T cells are first switched on (widening the attack, at some risk to healthy tissue), anti-PD-1/PD-L1 in the tumor and in the nodes that resupply it (fresh killers from the stem-like reserve, plus newly arriving clones) — and why combining them adds both benefit and side effects.
kind: stepper
stage: dark
spec: |
  ROLE (FIGURE-AUDIT §2A). This figure owns *where each drug acts, and what the combination costs*. Its tumor panel
  reuses ch05-exhaustion's stem-like/terminal vocabulary verbatim and teaches nothing new about exhaustion; build it in
  the same task as ch05-exhaustion so they match. Run steps through `ctx.ui.stepper`; the last step unlocks free play.
  Follow FIGURE-AUDIT §4 exactly; where this spec and §4 differ, §4 wins. Keep it spare: few cells, large and labeled.

  LAYOUT (desktop). Two panels side by side, each titled in its top-left corner: left "LYMPH NODE — where T cells are
  switched on", right "TUMOR — where T cells do the work". A thin divider between them. In steps 1–2 the right panel is
  dimmed (40% opacity); in steps 3–4 the left panel is. Only in step 5: two toggle switches under the panels
  ("Anti-CTLA-4", "Anti-PD-1 / PD-L1") and two shared `activity-meter` segment bars ("Attack on the tumor", "Risk to
  healthy tissue"), tagged "Illustrative, not measured".

  LEFT PANEL (interior from `lymphNodeField`):
  - One `dendriticCell({ state:'mature' })` holding `mhc1` cups with hot-pink tumor peptides, and 6 `b7` molecules
    (pale mint, no icon).
  - 4 naive killer T cells (smaller, dim), each with a distinct `tcrKey` notch, and the matching `epitopeKey` on the
    peptide they fit: "strong match", "weak match", one weak matcher to a self peptide (sand peptide; a small "self"
    tag), and one that fits nothing. Each carries one `cd28` (green-cyan, "+").
  - One regulatory T cell (`tCell({ type:'treg' })`) beside the dendritic cell, carrying several `ctla4` (crimson, bar)
    that grip most of the B7. CTLA-4 appears only on the Treg and on T cells after they activate.

  RIGHT PANEL (tumor):
  - 5 cancer cells (`cancerCell`) displaying `pdl1` (light crimson, plug head).
  - The ch05-exhaustion cast, identical in look: 1 stem-like cell (sprout badge "TCF1", one PD-1 badge, TOX tag) and
    2 terminally exhausted cells (`tCell({ state:'exhausted' })`, padlock "terminal (TCF1 lost)", many `pd1`).
  - A blood vessel along the right edge (a softly glowing tube) through which new T cells enter.

  STEP STATES:
  1. Lymph node, no drug. Most B7 is held by the Treg's CTLA-4. Only the "strong match" cell's CD28 reaches B7: it
     brightens and divides (`divide`, 3 copies, same `tcrKey`) and the copies drift to the exit arrow. Others stay dim.
  2. Lymph node + anti-CTLA-4. Therapeutic antibodies (`antibody({ variant:'therapeutic' })`) cap the CTLA-4. Freed B7
     becomes available; the "weak match" and the "self"-tagged cell also engage CD28, brighten and divide (keep the
     self tag; dashed outline). More copies, with more distinct `tcrKey` notches, leave through the exit arrow. The Treg
     is NOT destroyed in this view.
  3. Tumor, no drug. PD-L1 pairs with PD-1 (interlocked heads, crimson "−" disc on the T-cell side). The terminally
     exhausted cells make failed approaches; the stem-like cell divides slowly (every ~6 s) and its offspring soon dim.
     A cancer cell divides every ~8 s.
  4. Tumor + anti-PD-1. Antibodies cap PD-1 on the T cells (never on cancer cells). The emphasis is what Chapter 8 adds:
     **new clones arrive**. Three T cells with new `tcrKey` notches enter through the vessel (label "new clones arrive
     from nodes and blood"), and the stem-like cell divides a little faster. Arrivals and fresh effectors use the kill
     grammar (`cell-actions.kill`): dock, granules to the contact, the cancer cell dies by `setDying`, the killer detaches.
     The exhausted cells brighten only slightly and stay put.
  5. Both panels active, free play; both toggles default ON. With both ON, a faint dotted path runs from the left
     panel's exit arrow to the right panel's vessel, and more varied clones arrive. Meter tiers (attack / risk), as
     words, never numbers: none = low / low; anti-CTLA-4 only = moderate / raised; anti-PD-1 only = strong / modest;
     both = strongest / highest.

  SCIENTIFIC GUARDRAILS. CTLA-4 competes with CD28 for B7 on dendritic cells; Tregs carry the most CTLA-4. PD-1 is on
  T cells only; PD-L1 on cancer cells (and on myeloid cells, not drawn here). Anti-PD-1 binds T cells; anti-CTLA-4 binds
  T cells and Tregs; neither binds cancer cells. Do not show exhausted cells fully recovering. Do not show the drugs
  killing anything. PD-1 blockade also acts in the lymph nodes that drain the tumor; the "arrive from nodes and blood"
  label carries that point without a third panel.

  MOBILE (<600 px). One panel at a time: steps 1–2 show the lymph node, steps 3–4 the tumor; step 5 adds a two-tab
  switch ("Lymph node" / "Tumor") above the stage, with toggles and meters below.

  REDUCED MOTION. Replace division and migration with cross-fades between end states; show arrows for movement.
steps:
  1. In a lymph node, a dendritic cell presents tumor peptides to passing T cells. CTLA-4, plentiful on regulatory T cells, binds the dendritic cell's B7 molecules, so only the T cell with the strongest match gets enough costimulation through CD28.
  2. Add anti-CTLA-4. With CTLA-4 blocked, more B7 is free, and T cells with weaker matches are activated too. More T cells, from more clones, leave the lymph node, including one that reacts weakly to healthy tissue.
  3. In the tumor, T cells have been stimulated for weeks. PD-L1 on the cancer cells keeps binding their PD-1, most of the T cells are exhausted, and the tumor keeps growing.
  4. Add anti-PD-1. With the brake released, the stem-like reserve produces new killer cells, and new clones arrive from the lymph nodes and blood. The most exhausted cells barely change.
  5. Try the drugs together. The combination broadens the response in the lymph node and releases it in the tumor, increasing both the attack and the risk to healthy tissue.
alt: Two side-by-side scenes. In a lymph node, CTLA-4 on a regulatory T cell binds the B7 molecules on a dendritic cell, so only a strongly matching T cell is activated; blocking CTLA-4 frees B7 and lets more varied T cells be activated, including one that reacts to healthy tissue. In a tumor, PD-L1 on cancer cells keeps T cells exhausted; blocking PD-1 lets the stem-like reserve produce fresh killers and brings new clones in from the blood, while deeply exhausted cells barely change. Combining both drugs increases the attack on the tumor and the risk to healthy tissue.
:::

:::deep-dive Does anti-CTLA-4 also deplete regulatory T cells?
Regulatory T cells (Tregs) express more CTLA-4 than any other cell, especially inside tumors. That makes them a possible target for an anti-CTLA-4 antibody with an active Fc region: macrophages and NK cells, which carry Fc receptors, could bind antibody-coated Tregs and destroy them, removing a second, independent restraint.

It does in mice: in animals engineered to carry human Fc receptors, antibodies built like ipilimumab and tremelimumab depleted Tregs inside tumors, and versions that bound Fc receptors more strongly worked better.[^12]

In people, the evidence is mixed. Researchers compared tumors from patients with melanoma, prostate cancer and bladder cancer treated with ipilimumab against matched untreated tumors, and examined before-and-after biopsies from melanoma patients given tremelimumab. Both drugs drew more CD4 and CD8 T cells into the tumors, but Treg numbers did not fall.[^6] On the other hand, melanoma patients who had inherited a variant of an Fc receptor that binds the Fc region of IgG with higher affinity were more likely to respond to ipilimumab, at least when their tumors were inflamed.[^12] Neither finding settles whether Tregs disappear from human tumors; a biopsy captures one moment in one spot.

The idea is now being tested directly with anti-CTLA-4 antibodies whose Fc regions are engineered to bind Fc receptors more strongly; if they clearly outperform ipilimumab, that will be the strongest evidence yet.
:::

## The tail of the curve

To judge a cancer treatment, doctors use a **survival curve**, which starts with 100% of patients alive and steps down as patients die. Two numbers are read off it: the **{{median|median}}** survival, the time by which half of the patients have died (a midpoint, not an average), and the percentage still alive at a fixed time, such as three or ten years.

In a trial published in 2011, patients with {{metastasis|metastatic}} melanoma given the standard chemotherapy, dacarbazine, had a median survival of 9.1 months, and only 12% were alive three years later.[^14]

Ipilimumab was the first drug shown in {{randomized-trial|randomized trials}}, where chance decides who gets which treatment, to lengthen survival in advanced melanoma.[^15] The gain in the median was modest: about four months against a comparison vaccine in a 2010 trial of previously treated patients (10.0 vs 6.4 months),[^16] and two months when added to chemotherapy in the 2011 trial (11.2 vs 9.1).[^14] But when researchers pooled data on 1,861 patients treated with ipilimumab, the curve flattened from about year three at roughly one patient in five and stayed flat for as long as patients were followed, up to ten years.[^17] Oncologists call this flat stretch the **tail of the curve**.

The clearest data come from CheckMate 067, in which 945 people with untreated advanced melanoma were randomly assigned to ipilimumab, nivolumab or both in 2013–14, then followed for at least ten years.[^7] Median survival was 19.9 months with ipilimumab, 36.9 months with nivolumab and 71.9 months — six years — with the combination. At ten years, 19%, 37% and 43% of each group were alive. Part of the ipilimumab group's tail reflects later treatment: by year three, 43% of them had gone on to a PD-1 blocker.[^15]

After year three the curves kept sloping down, but gently: about two percentage points a year, instead of fifteen or twenty early on. Some of those later deaths had nothing to do with melanoma; 52% of the combination group had not died of melanoma by year ten.[^7]

Melanoma is the most favorable case. Even on the combination, only half of patients had confirmed tumor shrinkage (58% by a looser count), and nearly half died of melanoma within ten years. Nor was the trial designed to prove that the combination beats nivolumab alone; the difference favors it, but could be partly chance.[^7] Other cancers have tails too, usually lower. In a lung cancer trial of 305 patients whose tumors carried a lot of PD-L1, 32% of those started on pembrolizumab were alive after five years, against 16% started on chemotherapy, though two-thirds of the latter later received immunotherapy.[^18]

:::figure ch08-tail
title: The tail of the curve
goal: After using this, the reader understands that checkpoint inhibitors changed advanced melanoma less by shifting the median than by creating a long, gently sloping "tail" of patients alive many years later — and can read how many people out of 100 were alive at any time on each treatment.
kind: chart
stage: light
spec: |
  BUILD. Shared `chart.js` (theme 'light'), shared `unit-grid.js` for the 100-people panel, `ctx.ui.stepper` for the
  guided tour (guided, then free). Follow FIGURE-AUDIT §4 rules 19–21: real data on a light stage, a visible source
  line, per-mark source tooltips, chart color tokens plus line styles.

  WHAT IT SHOWS. Simplified overall-survival curves for advanced melanoma from CheckMate 067 (ipilimumab, nivolumab,
  nivolumab + ipilimumab), plus a faded chemotherapy curve from an earlier trial.

  ALWAYS-VISIBLE TEXT (on every viewport, never collapsed — FIGURE-AUDIT §7.10):
  - Footnote under the chart (verbatim): "Simplified: smooth curves drawn through published survival percentages (dots), not the trials' actual curves. Chemotherapy comes from a different, earlier trial, so compare with caution."
  - Source line (ink-3, 12 px): "Sources: CheckMate 067 [15][19][7]; chemotherapy [14]."

  CHART. X axis: "Years since starting treatment", 0–10 (ticks every year; data are in months, divide by 12). Y axis:
  "% of patients alive", 0–100 (gridlines every 20). Curves: monotone (non-increasing) interpolation
  (`line(..., { curve:'monotone' })`) through the data points below, starting at (0, 100). Published points are small
  filled dots with a tooltip giving the exact value and source. Each curve ends at its last data point — do not
  extrapolate. Direct labels at line ends (`directLabel`), no legend box. Series styling (token + line style, so color
  is never the only cue):
    - Nivolumab + ipilimumab: `--chart-1`, thick solid. Label "Nivolumab + ipilimumab".
    - Nivolumab: `--chart-2`, medium solid. Label "Nivolumab".
    - Ipilimumab: `--chart-3`, medium long-dash. Label "Ipilimumab".
    - Chemotherapy: `--chart-5`, thin dotted, 50% opacity after step 1. Label "Chemotherapy (earlier trial)"; at its end
      a small note "no data after year 3".
  A faint `threshold` line at 50% labeled "half alive (median)".

  INTERACTIONS (keep to these):
  1. A vertical time cursor (`cursor`; drag on the chart, or the slider under it; arrow keys step 6 months). A readout
     lists each curve's value at the cursor, rounded to whole percent; values at published points are marked
     "published", values between points "approximate"; past a curve's last point, "no data". Between 0 and 24 months
     no CheckMate 067 points exist, so readouts there are always "approximate".
  2. "100 people" panel (`unitGrid`, 10×10, shape 'person') to the right of the chart, below it on phones: filled =
     alive at the cursor time, outline = died, for the selected curve (tap a curve or its label; default:
     Nivolumab + ipilimumab). Text: "At [t] years: about [n] of 100 alive."
  3. Button "Show the long tail": `band` shading years 3–10 and a light brace beside the two nivolumab-containing curves,
     labeled "the long tail", with this caption (verbatim): "After year 3 the curves keep sloping down, but gently. Counting only deaths from melanoma, the ten-year figures are higher: 52%, 44% and 23%."

  STEP STATES:
  1. Only chemotherapy visible (full opacity in this step); cursor at 3 years.
  2. Add ipilimumab; chemotherapy fades to 50%; cursor at 10 years.
  3. Add nivolumab and the combination; cursor at 10 years; the grid shows the combination.
  4. "Show the long tail" on; cursor at 3 years.
  5. Everything available; cursor at 5 years.

  MOBILE (<600 px). Chart full width (aspect ~4:3); the footnote and source line directly under it (always visible);
  then the time slider, the 100-people grid (glyphs ≥ 14 px) and the readout as a compact list.

  REDUCED MOTION. No transitions between steps beyond a quick fade; no draw-in animation.
steps:
  1. A survival curve starts with everyone alive and steps down as patients die. With chemotherapy, the standard treatment before 2011, half of the patients in one large trial had died by nine months, and only 12% were alive three years later.
  2. In randomized trials, ipilimumab added only a few months to median survival. (Its median looks much longer here because CheckMate 067 ran years later, in different patients.) The change was in the tail: about one in five patients was still alive ten years later, although many in this trial later also received a PD-1 blocker.
  3. Nivolumab, which blocks PD-1, raised the tail: 37% of patients were alive at ten years. Nivolumab plus ipilimumab raised it to 43%, and half of those patients were still alive at six years.
  4. After about year three, the curves keep sloping down, but gently: about two percentage points a year instead of fifteen or twenty. Some of those later deaths were from other causes.
  5. Drag the time marker to see how many people out of 100 were alive at any point. The faded chemotherapy curve comes from a different, earlier trial, so compare it with caution.
data: |
  All values = % of patients alive (overall survival). Time in months from randomization (x axis shows years = months/12).
  "median" points sit at 50% by definition of median overall survival. (0, 100) is the start of every curve.

  Chemotherapy — dacarbazine + placebo arm of a phase 3 trial in previously untreated metastatic melanoma (n = 252) [14]:
    (0, 100); (9.1, 50) median; (12, 36.3); (24, 17.9); (36, 12.2). Curve ends at 36 months.

  CheckMate 067, previously untreated advanced melanoma, randomized 1:1:1 (N = 945):
    Ipilimumab alone (n = 315):        (0, 100); (19.9, 50) median [7]; (24, 45) [15]; (36, 34) [15]; (60, 26) [19]; (90, 22) [7]; (120, 19) [7].
    Nivolumab alone (n = 316):         (0, 100); (24, 59) [15]; (36, 52) [15]; (36.9, 50) median [7]; (60, 44) [19]; (90, 42) [7]; (120, 37) [7].
    Nivolumab + ipilimumab (n = 314):  (0, 100); (24, 64) [15]; (36, 58) [15]; (60, 52) [19]; (71.9, 50) median [7]; (90, 48) [7]; (120, 43) [7].
    (90-month values = 7.5-year overall survival as reported in the introduction of [7].)
    Context for tooltips: by the 3-year analysis, 43% of the ipilimumab group had received a PD-1 blocker [15].

  Annotation values, all from [7]:
    Melanoma-specific survival at 10 years: combination 52%, nivolumab 44%, ipilimumab 23%.
    Progression-free at 3 years: 31.8%, 24.7%, 6.7% of patients; of these, 10-year melanoma-specific survival 96%, 97%, 88%.
alt: Survival curves for advanced melanoma. With chemotherapy, from an earlier trial, half of patients had died by nine months and 12% were alive at three years. In the CheckMate 067 trial, the ipilimumab, nivolumab and nivolumab-plus-ipilimumab curves fall less steeply, then slope down only gently after about three years, ending at 19%, 37% and 43% alive at ten years; median survival was 19.9, 36.9 and 71.9 months. The curves are simplified redrawings through published values.
:::

:::key-idea
The benefit of checkpoint inhibitors shows less in the median than in the tail: a minority of patients stay alive, often free of their cancer, for many years, sometimes long after treatment stops.
:::

:::deep-dive How to read a survival curve
The survival curves in medical papers are usually {{kaplan-meier-curve|Kaplan–Meier curves}}. The horizontal axis is time since patients joined the trial. The vertical axis is the percentage still alive (overall survival) or still alive with no cancer growth ({{progression-free-survival|progression-free survival}}). Each step down marks one or more events. Patients still alive when the data are analyzed, or who leave the study, are "censored": they count as alive up to the last time they were seen, then drop out of the calculation.

Three numbers summarize a curve, and each hides something.

- The **median** says nothing about what happens afterward. Ipilimumab moved the median by only a few months, yet it created a long tail.
- A **landmark rate**, such as "43% alive at ten years," describes the tail, but only at one moment.
- The {{hazard-ratio|hazard ratio}} compares how often the event happens in two groups at any given moment. In CheckMate 067, the hazard ratio for death with the combination versus ipilimumab was 0.53: at any point, patients on the combination were dying at about half the rate. For the combination versus nivolumab alone it was 0.85, with a 95% confidence interval (the range of values the data are compatible with) of 0.69 to 1.05. Because that range includes 1.0, meaning no difference, the trial cannot say for sure that the combination is better.[^7]

Two cautions apply. Overall survival counts deaths from any cause; melanoma-specific survival counts only deaths from melanoma, and the gap grows once patients live long enough to die of something else. And curves from different trials, like the chemotherapy curve in the figure above, cannot be compared directly, because patients, eras and later treatments all differ.

**The long tail in detail.** In CheckMate 067, reaching year three free of cancer growth was a strong predictor. About a third of patients on the combination and a quarter on nivolumab got that far, and 96–97% of them had not died of melanoma by year ten. Patients who stopped the combination during the first few months because of side effects did about as well as the group as a whole: 43% were alive at ten years. That is encouraging, but not proof that stopping early is harmless, since people who stop may differ from those who don't. And late relapses were rare: after year five, only eight patients in the whole trial saw their cancer start growing for the first time.[^7]

**Why there is a tail.** Drugs that kill dividing cells, or block one growth signal, select for resistant clones (Chapter 6), so their survival curves tend to keep falling. An immune response can adapt: new clones join, and memory cells persist. Whether a ten-year survivor is cured, or held in a long equilibrium like the one in Chapter 7, cannot yet be determined.
:::

## Who responds, and why

Checkpoint inhibitors first succeeded in melanoma and work best in a few other cancers because releasing a brake helps only if T cells recognize something in the tumor and can reach it (Chapters 6 and 7). (A patient "responds" when their tumors shrink substantially; the share who do is the {{objective-response-rate|response rate}}.)

- **Cancers with many mutations.** Sun-damaged melanomas, lung cancers in smokers, bladder cancers and squamous-cell skin cancers carry many mutations, and so many {{neoantigen|neoantigens}}. The most extreme case is tumors that are {{msi-high|mismatch-repair deficient (MSI-high)}}, which cannot fix DNA copying errors ([Chapter 6](06-cancer.html)). In an early pembrolizumab trial, deficient tumors averaged 1,782 mutations, ordinary ones 73; 4 of 10 patients with deficient colorectal cancers responded, and none of 18 with ordinary ones.[^23]
- **Cancers caused by viruses.** Most Merkel cell carcinomas (a rare, aggressive skin cancer), throat cancers caused by the human papillomavirus (HPV), and cervical cancers, nearly all of which HPV causes, present fragments of viral proteins, which are ready-made targets.
- **Cancers with extra PD-L1 genes.** Hodgkin {{lymphoma|lymphoma}} cells often carry extra copies of the genes for PD-L1 and its relative PD-L2. In a small early nivolumab trial, 20 of 23 heavily pretreated patients responded;[^24] in two larger trials of PD-1 blockers, about 7 in 10 did.[^44][^45] Yet about four in five of these tumors express less {{mhc-class-i|MHC class I}} or none,[^42] and after nivolumab, complete remissions were associated with {{mhc-class-ii|MHC class II}} instead.[^43] Helper T cells or other cells may do much of the work (Chapter 12 describes another such case).
- **Exceptions.** Kidney cancer responds reasonably well despite modest mutation counts; mutations are only part of the explanation.

At the other end are the {{cold-tumor|cold tumors}} of [Chapter 7](07-escape.html): pancreatic cancer, most colorectal cancers, prostate cancer and glioblastoma, the most common aggressive brain cancer. Few T cells are in them or can get in, and checkpoint inhibitors alone rarely shrink them. None has a checkpoint-inhibitor approval of its own, apart from the minority of tumors that are mismatch-repair deficient or carry very many mutations.

In 2023, about 57 of every 100 people in the United States with advanced cancer were eligible for a checkpoint inhibitor, and about 20 of those 100 were expected to respond — roughly one in three of those eligible.[^3] Some others benefit without much shrinkage, but for most, these drugs are not enough.

## Predicting who will respond

Doctors would like a {{biomarker|biomarker}} that predicts who will benefit. Three are used in practice, and none predicts perfectly.

**PD-L1 staining.** Pathologists stain a thin slice of tumor so that cells expressing PD-L1 turn brown — a technique called {{immunohistochemistry|immunohistochemistry}} — and count them. More PD-L1 means better odds in some cancers, notably lung cancer, where it guides treatment. But PD-L1-negative tumors can respond, labs use different staining kits and cut-offs, and PD-L1 varies across a tumor and over time. In CheckMate 067, patients with little PD-L1 still did well: on nivolumab alone, 43% of them had not died of melanoma after ten years, against 54% of those with more PD-L1.[^7] In a formal test, PD-L1 predicted three-year survival only slightly better than chance.[^15]

**Mismatch-repair deficiency (MSI-high).** Such tumors often respond, whatever organ they arise in.[^23] In 2017 the US Food and Drug Administration (FDA) approved pembrolizumab for advanced solid tumors with this defect that had progressed after earlier treatment: the first {{tissue-agnostic|tissue-agnostic}} cancer drug approval, defined by biology rather than organ.

**Tumor mutational burden.** In 2020, the FDA extended pembrolizumab, again after earlier treatment, to any advanced solid tumor with a high {{tumor-mutational-burden|tumor mutational burden}} (TMB): at least 10 mutations per million DNA bases (a megabase). The evidence came from a study without a comparison group, spanning ten cancer types, in which 29% of patients with high-TMB tumors responded, against 6% of the rest.[^8] A later analysis of more than 1,500 treated patients found the cut-off worked unevenly. In melanoma, lung and bladder cancers, about 40% of high-TMB tumors responded. In breast cancer, prostate cancer and gliomas, only about 15% did, somewhat fewer than low-TMB tumors of the same types.[^25]

One of the best clues is whether an attack is already under way — a "hot" tumor — and no test yet captures that reliably enough for routine use. Research tests come closer: an 18-gene "T-cell-inflamed" signature, built from genes induced by interferon-gamma, predicted benefit from pembrolizumab across nine cancer types,[^26] and Chapter 7's Immunoscore counts T cells directly.

But a T cell inside a tumor is not necessarily attacking it. Many are bystanders whose receptors recognize viruses from past infections, such as flu or Epstein–Barr virus.[^41] In colorectal and ovarian cancers, only about one killer T cell in ten recognized the patient's tumor, and in two of the four tumors tested, no tumor-reactive killer T cells were found.[^40]

## More brakes, more partners, expensive lessons

Adding ipilimumab to nivolumab, releasing two brakes at once, raises response rates in melanoma, and probably survival, at a steep price in side effects (below). The pair is also used, usually with less ipilimumab, in kidney, lung, MSI-high colorectal and other cancers.

T cells carry other brakes, such as **{{lag-3|LAG-3}}**. In a trial of 714 people with untreated advanced melanoma, adding the anti-LAG-3 antibody relatlimab to nivolumab lengthened the median time before the cancer grew from 4.6 to 10.1 months, while severe side effects rose from 10% to 19%.[^21] People on the pair also tended to live longer, but that difference fell just short of statistical significance in the trial's planned analysis.[^22] The pair was approved in 2022.

:::deep-dive Survival versus surrogate endpoints
Overall survival is the measure that matters most, but it takes years and many patients to measure, especially when treatments work well. So trials often use earlier stand-ins, called surrogate endpoints:

- **Progression-free survival:** time until the cancer grows or the patient dies.
- **Recurrence-free (or disease-free) survival:** after surgery, time until the cancer comes back.
- **Event-free survival:** when treatment starts before surgery, time until any of several setbacks — growth that prevents surgery, recurrence or death.
- **Pathologic response:** how much living cancer a pathologist finds in tissue removed after treatment given before surgery ("complete" if none).

Surrogates are faster and often support approvals. But a delay in cancer growth does not automatically mean longer life: in one review of trial-level analyses across oncology, more than half of the reported correlations between a surrogate endpoint and survival were weak.[^20] The relatlimab trial above is one example: the pair clearly delayed melanoma growth, but its survival gain fell just short of statistical significance.[^21][^22] Immunotherapy adds complications: slow responses and pseudoprogression can make early scans look worse than the final outcome, and a drug that lifts the tail may barely move a median. Chapters 11 and 12 report recurrence-free survival, event-free survival and pathologic responses; read them with these caveats in mind.
:::

Other add-ons have failed, and the failures are informative. **{{ido|IDO1}}** is an enzyme that some tumors use to suppress T cells ([Chapter 7](07-escape.html)): it degrades tryptophan, an amino acid T cells need. In early studies without a comparison group, the IDO1 blocker epacadostat plus pembrolizumab looked promising. Then, in 2018, a randomized trial in 706 melanoma patients found no benefit at all: the median time before the cancer progressed was 4.7 months with epacadostat and 4.9 months with a placebo.[^27]

**{{tigit|TIGIT}}**, another brake, followed the same pattern: encouraging early results, then a large randomized trial in 521 people with lung cancer in which adding the anti-TIGIT antibody tiragolumab to atezolizumab did not significantly improve survival.[^28] Similar failures followed (see the box).

These were costly lessons. Studies without a comparison group cannot show what an add-on contributes, because anti-PD-1 alone already works for some patients; small randomized trials can flatter a drug by chance; and blocking a brake helps only if that brake is what holds T cells back.

:::deep-dive More add-ons that failed
**LAG-3, again.** In May 2026, Regeneron reported that its anti-LAG-3 antibody fianlimab, added to the PD-1 blocker cemiplimab, did not significantly delay melanoma growth compared with pembrolizumab in a trial of 1,546 patients (median 11.5 vs 6.4 months; hazard ratio 0.85, not significant; company-reported).[^29]

**TIGIT, again.** After further late-stage failures, Roche stopped developing tiragolumab in July 2025, some 5,000 patients into its program.[^30] In December 2025, one of the last large TIGIT trials, of domvanalimab in stomach and esophageal cancers, was stopped after a planned interim analysis showed no survival gain over nivolumab plus chemotherapy (company-reported).[^31]
:::

## The price of a released brake

The brakes exist to protect healthy tissue, and releasing them lets T cells attack it. These {{immune-related-adverse-event|immune-related adverse events}} can affect almost any organ, most often the skin, gut, liver, lungs and endocrine (hormone-making) glands.[^32]

Self-tolerance is built in layers, none of them complete (Chapter 5). Self-reactive T cells that escape the thymus are restrained in the rest of the body by other mechanisms, the last of which are the brakes. A checkpoint inhibitor weakens that last layer everywhere at once. Some of the freed T cells were self-reactive all along; others, aimed at the tumor, also recognize something in healthy tissue (see the box after the figure).

A PD-1 blocker alone is the most common treatment. In CheckMate 067, 86% of patients on nivolumab had some treatment-related side effect, mostly mild, such as rash or itching. About one in five (21%) had a severe one — "grade 3 or 4," meaning severe (often needing hospital care) or life-threatening — against 28% on ipilimumab and 59% on the combination.[^15] Ipilimumab is more likely to inflame the gut and the pituitary gland; PD-1 blockers more often affect the thyroid.[^32][^33]

Most side effects appear in the first few months but can arise at any time, even a year or more after treatment ends.[^32] Caught early, most can be controlled: doctors pause the drug and give {{corticosteroid|corticosteroids}}, strong anti-inflammatory hormones such as prednisone, plus other immunosuppressive drugs for stubborn cases.[^32] Treatment is needed because an attack on a healthy organ does not end on its own: unlike a pathogen, the organ is never cleared. The drug also persists: in an early nivolumab trial, receptor occupancy on blood T cells was still above 70% two months after one infusion.[^39]

Suppressing these side effects did not appear to weaken the attack on the cancer: in a later analysis of CheckMate 067, patients who needed immunosuppressive drugs in their first six months were no less likely to avoid death from melanoma over ten years than those who did not.[^7] At least one study suggests that very high steroid doses may reduce the benefit, so doctors try to use no more than needed.[^34]

Most severe side effects in CheckMate 067 resolved within three to four weeks.[^15] The main exception is the endocrine glands, whose hormone-producing cells do not grow back once T cells destroy them. An underactive thyroid developed in about 7% of patients on PD-1 blockers and 13% on the combination; inflammation of the pituitary, the master gland at the base of the brain ({{hypophysitis|hypophysitis}}), in about 3% on ipilimumab and 6% on the combination, but under 1% on PD-1 blockers. Adrenal damage affected about 4% on the combination, and rarely T cells destroy the pancreas's insulin-making cells.[^33] Patients may then need thyroid hormone, {{cortisol|cortisol}} or insulin for life. Occasionally damage elsewhere lasts too, such as lung scarring after severe inflammation.[^32]

Deaths are rare. Pooled across trials, side effects proved fatal for about 1 in 270 patients on a PD-1 or PD-L1 blocker, 1 in 90 on anti-CTLA-4 and 1 in 80 on the combination.[^32] The most dangerous is inflammation of the heart muscle, {{myocarditis|myocarditis}}. In the manufacturer's safety records, severe cases were reported in about 1 in 1,700 patients on nivolumab and 1 in 370 on the combination,[^35] and nearly half of reported cases have been fatal.[^32]

All of this is far milder than the disease of Chapter 5's mice lacking CTLA-4, because an antibody blocks the brake only partly, and only while the drug is in the body.

:::figure ch08-side-effects
title: Side effects by organ
goal: After using this, the reader understands that checkpoint side effects are immune attacks on healthy tissue (autoimmunity, or something very like it) that can hit almost any organ, that most are uncommon with a single PD-1 blocker while their frequency rises with anti-CTLA-4 and especially the combination, and that hormone-gland damage is often permanent.
kind: explorer
stage: light
spec: |
  BUILD. Shared art `bodyMap({ organs })` (front-facing, gender-neutral, no face), foundation `ctx.ui.infoCard()` for
  organ details (beside the stage on desktop, an inline panel under the stage on phones — no bottom sheets),
  `ctx.ui.badge` and the foundation pill icon. Real numbers: light stage, visible source line (FIGURE-AUDIT §4 rule 19).

  CONTROL. Segmented control "Drug": PD-1 or PD-L1 blocker alone · CTLA-4 blocker alone · Both together
  (default: PD-1 or PD-L1 blocker alone, the most common treatment).

  HEADER (verbatim, in this order, always visible):
  - "Any treatment-related side effect in one melanoma trial (CheckMate 067): nivolumab 86% · ipilimumab 86% · both 96%. Severe (grade 3–4): 21% · 28% · 59% [15]"
  - "Deaths from side effects, pooled across trials: about 1 in 270 patients on a PD-1 or PD-L1 blocker · 1 in 90 on a CTLA-4 blocker · 1 in 80 on both [32]"

  HOTSPOTS. 13 organ glyphs on the body map, each in a soft circle with a short text label and leader line: eyes,
  pituitary (inside the head), thyroid (neck), lungs, heart, liver, adrenal glands, pancreas, gut (colon), kidneys,
  joints (knee), nerves & muscles (upper arm), skin (a patch on the forearm). Each shows a frequency band for the
  selected drug, by BOTH ring thickness and a text tag: "rare" (thin ring), "uncommon" (medium), "common" (thick),
  "very common" (thick + filled tint). Rings use crimson tints. Switching drugs animates rings (0.4 s). The four hormone
  glands (pituitary, thyroid, adrenals, pancreas) carry a small badge: the pill icon with the words "often permanent".

  BAND FOOTNOTE (verbatim, always visible): "Bands count patients diagnosed with inflammation of that organ, of any severity — not symptoms such as tiredness or diarrhea alone. Skin figures come from one melanoma trial; most others are pooled across trials and cancer types, and real rates vary with dose and cancer. Rare: under 1% of patients. Uncommon: 1–5%. Common: 5–20%. Very common: over 20%."

  BANDS (PD-1/PD-L1 alone · CTLA-4 alone · both) with their basis:
    skin                very common · very common · very common   any-grade skin events 46% · 56% · 62% (CheckMate 067) [15]
    gut (colitis)       uncommon · common · common                colitis ~1% · 12% · 14% [32]
    liver (hepatitis)   uncommon · uncommon–common · common       1–6% · 1–25% (varies widely between trials) · 17–22% [32]
    lungs (pneumonitis) uncommon · rare · common                  ~1–3% (higher in lung cancer) [32]; less frequent with CTLA-4 blockers [32]; 6.6% with the combination in melanoma [36]
    thyroid             common · uncommon · common                underactive thyroid ~7% · 3.8% · 13% [33]
    pituitary           rare · uncommon · common                  0.4% · 3.2% · 6.4% [33]
    adrenal glands      rare · rare · uncommon                    about 1% or less with one drug; 4.2% with both [33]
    pancreas (diabetes) rare · rare · rare                        about 0.2% overall [33]; ≤1% [32]
    heart (myocarditis) rare · rare · rare                        severe cases reported in 0.06% (nivolumab) and 0.27% (combination) [35]
    nerves & muscles    rare · rare · rare                        serious forms are rare: myositis ~0.6% [32]; myasthenia about 0.1% in a survey of nearly 10,000 nivolumab-treated patients [37]
    joints (arthritis)  uncommon · uncommon · uncommon            joint aches ~8%, arthritis ~1% [32]
    kidneys (nephritis) uncommon · uncommon · uncommon            kidney injury ~2% overall [32]
    eyes (uveitis)      rare · rare · rare                        under 1% [32]
  For a range tag such as "uncommon–common", show that text and the thicker ring.

  CARDS (`infoCard`; open on hover on desktop and on tap everywhere). Card text is reader-facing — use verbatim; bracketed
  numbers are source links:
  - Skin: "The most common target. Rash and itching are frequent, and in melanoma, patches of skin can lose their color as T cells attack pigment cells, healthy and cancerous alike. Usually mild. In CheckMate 067, skin side effects of any severity affected 46% of patients on nivolumab, 56% on ipilimumab and 62% on both [15]."
  - Gut: "Diarrhea is common (any severity: about 20% of patients on a PD-1 blocker, 35% on ipilimumab, over 40% on both), but diagnosed inflammation of the colon (colitis) affects about 1%, 12% and 14% [32]. Colitis is the hallmark of ipilimumab and caused about 70% of reported deaths linked to CTLA-4 blockers [32]. Treated with steroids and, if needed, other immune-suppressing drugs."
  - Liver: "Hepatitis (any severity) usually shows up on routine blood tests before it causes symptoms. It affects about 1–6% of patients on PD-1 or PD-L1 blockers and 17–22% on the combination [32]."
  - Lungs: "Pneumonitis, inflammation of the lungs, causes cough and breathlessness. It affects about 1–3% of patients on a PD-1 or PD-L1 blocker, more in lung cancer [32], and 6.6% of melanoma patients on the combination [36]. It was the leading cause of reported deaths linked to PD-1 or PD-L1 blockers, at 35% [32]."
  - Thyroid: "The most common hormone problem. The thyroid may first become overactive for a few weeks, then underactive, often for good. An underactive thyroid affected about 4% of patients on ipilimumab, 7% on PD-1 blockers and 13% on both [33]. Treated with a daily thyroid-hormone pill, usually for life."
  - Pituitary: "Hypophysitis, inflammation of the master hormone gland at the base of the brain, causes headaches and fatigue. It is typical of ipilimumab: about 3% of patients on ipilimumab and 6% on both, but under 1% on PD-1 blockers [33]. Lost hormones, especially cortisol, usually need lifelong replacement [32]."
  - Adrenal glands: "Damage to the adrenal glands themselves is rare with a single drug (about 1% or less) but affected about 4% of patients on the combination in one large analysis. Cortisol must then be replaced for life [33]."
  - Pancreas: "Very rarely, about 0.2% of patients, T cells destroy the insulin-making cells, causing sudden diabetes that needs insulin for life [33]."
  - Heart: "Myocarditis, inflammation of the heart muscle, is rare but the most dangerous side effect. Severe cases were reported in about 1 in 1,700 patients on nivolumab and 1 in 370 on the combination, usually within weeks of starting [35]; nearly half of reported cases have been fatal [32]."
  - Nerves & muscles: "Serious inflammation of muscles (myositis) or of the nerve–muscle junction (a myasthenia-like weakness) is rare, affecting well under 1% of patients [32][37]. It can occur together with myocarditis."
  - Joints: "Joint aches affect about 8% of patients; true arthritis about 1% [32]."
  - Kidneys: "Kidney inflammation is uncommon (kidney injury in about 2% of patients overall) and is usually found on blood tests [32]."
  - Eyes: "Inflammation inside the eye (uveitis) is rare, under 1% of patients [32]."

  "WHY?" TOGGLE. A switch "Show the brakes in healthy tissue": overlays a small crimson "−" bar disc (the brake signal
  icon) on every hotspot and shows this caption (verbatim): "Healthy tissues use the same brakes. Many display PD-L1, especially when inflamed — in two patients who died of heart inflammation, the injured heart muscle displayed it [35] — and CTLA-4 keeps T cells that could attack them from switching on. A checkpoint inhibitor releases these brakes everywhere it reaches."

  ACCESSIBILITY. An equivalent "List view" of organ buttons opens the same cards. Hotspots are keyboard-focusable in
  head-to-toe order.

  MOBILE (<600 px). Segmented control full width at top; the two header lines stay visible (smaller type). The body map
  fills the width. Eyes, pituitary and thyroid crowd the head and neck, so on phones they merge into one "Head & neck"
  hotspot that opens a three-button chooser in the info card; all other hotspots are ≥ 44 px touch targets with short
  labels. The band footnote stays visible under the map; cards open inline under the stage.

  REDUCED MOTION. No ring animation; switch instantly.
alt: A human silhouette with markers on the organs that checkpoint inhibitors can inflame: skin, gut, liver, lungs, thyroid, pituitary, adrenal glands, pancreas, heart, nerves and muscles, joints, kidneys and eyes. With a PD-1 or PD-L1 blocker alone, skin problems are very common and thyroid problems common, while most other organs are affected uncommonly or rarely; with a CTLA-4 blocker, gut and pituitary inflammation become more frequent; the combination raises most rates. Hormone-gland damage is often permanent, and inflammation of the heart is rare but the most often fatal.
:::

:::key-idea
Checkpoint side effects are not direct drug toxicity but immune attacks on healthy tissue: autoimmunity, or something very like it. Tumors exploit the same brakes that protect healthy organs.
:::

:::deep-dive Who gets side effects, and why there?
Damaging an organ takes more than a missing brake. The person's HLA molecules must present a peptide from one of the organ's own proteins, a T cell that recognizes it must have escaped negative selection in the thymus, and a local signal, such as inflammation, must activate that T cell (Chapters 4 and 5). Checkpoint inhibitors lower that last barrier everywhere, so damage occurs where the other conditions are already met.

**Existing autoimmunity.** Among 52 melanoma patients with an existing autoimmune disease who were given a PD-1 blocker, 38% had a flare needing treatment, though only two stopped the drug over it.[^46] In 137 lung-cancer patients on PD-1 blockers, thyroid problems occurred in 20% of those already carrying thyroid autoantibodies (antibodies against their own tissue), versus 1% of the rest.[^47]

**PD-L1 in the tissue itself.** In diabetes-prone mice, PD-L1 on the pancreas's own cells, not on immune cells, protected insulin-making cells from self-reactive T cells.[^48]

**Spillover from the tumor.** Some side effects spill over from the attack on the tumor. In two patients who died of heart inflammation on nivolumab plus ipilimumab, the same T-cell clones turned up in tumor, heart and skeletal muscle.[^35]

**The gut's reliance on CTLA-4.** The gut is exposed to trillions of bacteria, and keeping it free of inflammation depends on regulatory T cells and their CTLA-4 (Chapter 5), which may be why colitis is ipilimumab's hallmark. People born with one faulty copy of the CTLA-4 gene have poorly functioning regulatory T cells, and 59% of those who fall ill have gut problems.[^49][^50]

**Benefit and side effects together.** In the lung study, patients with any of the tested autoantibodies also went longer before their cancer grew.[^47] As with the vitiligo described in Chapter 6, benefit and side effects often go together, though neither guarantees the other.
:::

:::clinic
**What treatment looks like.** For most patients, checkpoint therapy is an infusion every few weeks, for up to about two years,[^8] or, increasingly, an injection under the skin that takes a few minutes, approved in the United States for nivolumab in December 2024 and for pembrolizumab in September 2025.[^4] The first scans may show little change, and side effects can appear months later, even after treatment ends.[^32]
:::

## How responses unfold

Checkpoint inhibitors often act slowly, because the responding T-cell population has to expand first; a first scan after two or three months may show little change.

Occasionally a tumor looks bigger on a scan before it shrinks, a pattern called {{pseudoprogression|pseudoprogression}}. It is uncommon, but it is why doctors sometimes continue treatment through an ambiguous first scan. A more controversial pattern, {{hyperprogression|hyperprogression}}, describes tumors that seem to accelerate after treatment starts; whether the drugs cause it is still debated (see the box).

Once a tumor responds, the response often lasts for years after the last infusion, probably because the drug leaves behind an expanded population of T cells, including long-lived {{memory-cell|memory cells}}.

:::deep-dive Pseudoprogression and hyperprogression
The standard rules for judging a cancer treatment, called RECIST, declare "progression" when the summed size of the measured tumors grows by at least 20% over its smallest earlier value, or when new tumors appear. These rules were designed in the chemotherapy era and fit immunotherapy poorly; they also count only shrinkage, though long-lasting stable disease can be a benefit too.

In **pseudoprogression**, tumors look bigger on a scan, because T cells and fluid have accumulated in them or because the tumor kept growing until the immune response caught up, and then they shrink. It is real but uncommon: in a French study of 406 patients with lung cancer treated with PD-1 or PD-L1 blockers, it occurred in 4.7%.[^38] Modified rules let doctors confirm progression with a second scan before stopping treatment in a patient who is otherwise doing well.

**Hyperprogression** is the opposite worry: a sudden acceleration of growth after treatment starts. In the same study, 13.8% of patients met its definition, compared with 5.1% of 59 patients given chemotherapy, and they did badly, with a median survival of 3.4 months.[^38] But definitions vary between studies, most studies look back at past records, and aggressive cancers sometimes speed up on their own. Whether checkpoint inhibitors cause hyperprogression, and in whom, remains open.
:::

## From last resort to first move

Checkpoint inhibitors were first used as a last resort. Today they are often the first treatment, and are increasingly given after surgery ({{adjuvant-therapy|adjuvant therapy}}) in melanoma, lung, kidney and other cancers, and before it ({{neoadjuvant-therapy|neoadjuvant therapy}}), while the tumor and its antigens are still in place to stimulate the immune response. [Chapter 12](12-frontier.html) explores why that timing may matter.

Whatever part pembrolizumab played in Jimmy Carter's recovery, it gave his T cells no new targets. Any T cells able to recognize his melanoma were already in his body, either active or still {{naive-t-cell|naive}} (not yet activated); the drug could only remove a restraint on them.

For most patients, whose tumors T cells do not recognize or cannot reach, treatment has to direct the immune system at a target. Chapter 9 begins with the most versatile tools for that: antibodies that bind the cancer cell itself rather than a receptor on a T cell.

:::quiz
Q: Jimmy Carter's melanoma disappeared after treatment that included pembrolizumab. What does the drug itself do?
- [x] It binds PD-1 on T cells, so PD-L1 can no longer bind it and inhibit them — Right: blocking the brake lets T cells that already recognize the cancer keep working.
- [ ] It kills melanoma cells directly, much as chemotherapy does but more selectively — No: checkpoint inhibitors don't attack cancer cells; T cells do the killing.
- [ ] It teaches T cells to recognize a new target on the melanoma — No: the drug creates no new recognition; that is the job of approaches such as engineered T cells and vaccines (Chapters 10 and 11).

Q: In CheckMate 067, median survival on nivolumab plus ipilimumab was 71.9 months, and 43% of patients were alive at ten years. What do these numbers mean?
- [ ] The average patient on the combination lived about six years — No: a median is a midpoint, not an average, and it says nothing about the spread.
- [ ] Most patients on the combination were cured of their melanoma — No: more than half of the patients had died by ten years, many of them of melanoma.
- [x] Half were alive at about six years; a sizable minority, a decade on — Right: the median marks the halfway point, and the ten-year figure describes the long tail.

Q: Ipilimumab causes more severe gut and pituitary inflammation than nivolumab. Which explanation fits this chapter best?
- [ ] It is chemically more toxic to the gut and the pituitary gland than nivolumab is — No: the damage is immune-mediated (mainly T cells attacking healthy tissue), not direct chemical toxicity.
- [x] It releases the brake during priming in lymph nodes, so more T cells are activated — Right: broadening the response also lets through T cells that react weakly to healthy tissue, and these can attack the body's own organs.
- [ ] It blocks PD-1 directly on gut and pituitary cells, inflaming them — No: ipilimumab blocks CTLA-4, and PD-1 sits on T cells.

Q: Why do most pancreatic cancers and ordinary (mismatch-repair-proficient) colorectal cancers rarely respond to PD-1 blockers?
- [ ] Their cancer cells lack PD-1, so there is nothing for the drug to block — No: PD-1 sits on T cells, not on cancer cells; the drug releases the T cell's brake.
- [ ] The antibody cannot get out of the blood into these organs — Not the main reason: the drug reaches most tumors. What these tumors lack is a T-cell attack to release.
- [x] Few T cells recognize or reach these "cold" tumors — Right: blocking a brake helps only if T cells are already engaged, so there is little attack to release.
:::

:::takeaways
- Checkpoint inhibitors are monoclonal antibodies that bind PD-1, PD-L1 or CTLA-4 so that the brake cannot engage. They do not attack cancer cells, and they give T cells no new targets.
- Anti-CTLA-4 acts mainly during priming in lymph nodes, broadening the attack. Anti-PD-1 and anti-PD-L1 act mainly in the tumor, and also in the lymph nodes that resupply it, letting stem-like T cells and newly arriving clones produce new killer cells.
- The hallmark benefit is the tail of the curve: in advanced melanoma, 37% of patients on nivolumab alone and 43% on nivolumab plus ipilimumab were alive ten years later. Tails exist in other cancers too, usually lower.
- The drugs work only if T cells can recognize and reach the tumor. Mutation-rich, virus-driven, mismatch-repair-deficient cancers, and cancers with extra PD-L1 genes, respond best; "cold" cancers rarely do. Of every 100 Americans with advanced cancer, about 20 are expected to respond.
- Biomarkers (PD-L1, MSI-high, tumor mutational burden) help but predict imperfectly. Promising add-ons, such as IDO1 and TIGIT blockers, failed in large randomized trials.
- Because the same brakes protect healthy organs, the side effects (immune-related adverse events) are immune attacks on healthy tissue: usually mild or manageable with steroids, sometimes permanent (endocrine glands), rarely fatal — and much more frequent with the combination than with a single PD-1 blocker.
:::

## Glossary
- melanoma | Melanoma | A cancer of melanocytes, the pigment-making cells of the skin (and, more rarely, of the eye or mucous membranes). Because sunlight damages their DNA, skin melanomas often carry very many mutations.
- chemotherapy | Chemotherapy | Drugs that kill rapidly dividing cells, usually by damaging DNA or blocking cell division. They hit cancer cells hardest but also harm healthy dividing cells.
- t-cell | T cell | A white blood cell of the adaptive immune system that recognizes targets with its T-cell receptor. Killer (CD8) T cells destroy infected or cancerous cells; helper (CD4) T cells coordinate the response.
- immunotherapy | Immunotherapy | Treatment that works by strengthening, redirecting or releasing restraints on the patient's immune system, rather than by attacking the disease directly.
- checkpoint | Immune checkpoint | An inhibitory receptor on immune cells (a "brake"), such as CTLA-4 or PD-1, that limits the strength and length of a response and protects healthy tissue from attack.
- ctla-4 | CTLA-4 | An inhibitory receptor on T cells, abundant on regulatory T cells, that competes with CD28 for B7 molecules on dendritic cells and binds them with higher affinity. It acts mainly during priming, when T cells are first activated.
- lymph-node | Lymph node | A bean-sized organ where dendritic cells present captured antigens to T and B cells, and where immune responses are launched.
- pd-1 | PD-1 | An inhibitory receptor that T cells express soon after they are activated and keep at high levels when stimulation is prolonged. When it binds its ligands, PD-L1 or PD-L2, on another cell, it inhibits the T cell's activity.
- pd-l1 | PD-L1 | The main ligand of PD-1. Many cells express it, especially during inflammation, and many tumors use it to inhibit attacking T cells.
- ifn-gamma | Interferon-gamma (IFN-γ) | A cytokine secreted mainly by activated T cells and NK cells. Among other effects, it makes nearby cells, including tumor cells, express PD-L1.
- checkpoint-inhibitor | Checkpoint inhibitor | A drug, usually a monoclonal antibody, that blocks an immune checkpoint such as PD-1, PD-L1 or CTLA-4, releasing a brake on T cells.
- monoclonal-antibody | Monoclonal antibody | Many identical copies of one antibody, made in the laboratory from a single line of cells so that every molecule binds the same target.
- receptor-occupancy | Receptor occupancy | The share of a drug's target molecules that have drug bound at a given moment. For PD-1 blockers it is often measured on blood T cells; it shows how completely, and for how long, the drug blocks its target.
- fc-region | Fc region | The constant stem of an antibody's Y. It does not bind the target; instead, Fc receptors on immune cells and complement proteins bind it, which can trigger destruction of whatever the antibody coats.
- fc-receptor | Fc receptor | A receptor on immune cells such as macrophages and NK cells that binds the Fc region of antibodies, letting those cells attack antibody-coated targets.
- dendritic-cell | Dendritic cell | A star-shaped immune cell that samples tissues, carries fragments of what it finds to lymph nodes and activates matching T cells.
- costimulation | Costimulation | The second, confirming signal a T cell needs to be fully activated, typically when CD28 on the T cell binds B7 molecules on a dendritic cell. Without it, recognition alone can leave the T cell unresponsive.
- cd28 | CD28 | The main costimulatory (activating) receptor on T cells. It delivers signal 2 when it binds B7 molecules on antigen-presenting cells.
- b7 | B7 (CD80/CD86) | Molecules on dendritic cells and other antigen-presenting cells that deliver costimulation to T cells by binding CD28, and that CTLA-4 binds instead, with higher affinity.
- regulatory-t-cell | Regulatory T cell (Treg) | A type of CD4 T cell that suppresses other immune cells to prevent autoimmunity. Tumors often recruit them.
- clonal-expansion | Clonal expansion | The rapid multiplication of a T or B cell that has recognized its target, producing many identical copies, called a clone.
- exhaustion | T-cell exhaustion | A state of reduced function that T cells enter after long, unrelenting stimulation, as in chronic infections and tumors. Exhausted cells express many inhibitory receptors, divide little and kill poorly.
- stem-like-t-cell | Stem-like T cell | A subset of T cells within an exhausted population, marked by the protein TCF1, that can renew itself and keep differentiating into new killer cells. It is the main responder to PD-1 blockade.
- clonal-replacement | Clonal replacement | The observation that many T-cell clones expanding in a tumor after PD-1 blockade are new arrivals rather than clones that were there before treatment.
- median | Median | The middle value: half of the patients are below it and half above. A median survival of 20 months means half of the patients had died by 20 months and half were still alive.
- metastasis | Metastasis | The spread of cancer cells from where they started to distant organs, where they form new tumors. A "metastatic" cancer is one that has spread.
- randomized-trial | Randomized trial | A study in which chance decides which treatment each patient receives, so the groups are alike and differences in outcome can be credited to the treatment.
- kaplan-meier-curve | Kaplan–Meier curve | The standard survival graph in medicine, showing the fraction of patients still alive (or free of an event) over time, while accounting for patients followed for different lengths of time.
- progression-free-survival | Progression-free survival | How long patients live without their cancer growing or spreading; it ends at the first sign of progression or at death.
- hazard-ratio | Hazard ratio | A comparison of how often an event, such as death, happens in two groups at any given moment. A hazard ratio of 0.5 means the event happens half as often in the first group.
- objective-response-rate | Response rate (objective response rate) | The share of patients whose tumors shrink substantially (by at least 30% by standard measuring rules) or disappear.
- neoantigen | Neoantigen | A new protein fragment created by a tumor mutation, which the immune system can recognize as foreign.
- msi-high | Mismatch-repair deficient (MSI-high) | Describes tumors that have lost the cell's system for correcting DNA copying errors. They pile up huge numbers of mutations, and so neoantigens. Also abbreviated dMMR.
- lymphoma | Lymphoma | A cancer of lymphocytes (B or T cells) that usually grows in lymph nodes and other lymphoid tissue. Hodgkin lymphoma is one type.
- mhc-class-i | MHC class I | The molecules on nearly every cell with a nucleus that present peptides 8–10 amino acids long, sampled from the proteins the cell is making inside, to killer (CD8) T cells.
- mhc-class-ii | MHC class II | The molecules on professional antigen-presenting cells that present longer peptides (roughly 13–25 amino acids) from whatever reaches the cell's endosomes and lysosomes: material taken up from outside, alongside much of the cell's own protein. Read by helper (CD4) T cells.
- cold-tumor | Cold tumor | Informal term for a tumor with few or no T cells inside. Strictly a "desert", though often also used for "excluded" tumors whose T cells are stuck at the edges.
- biomarker | Biomarker | A measurable feature, such as a protein, a gene change or a blood test result, used to predict or track how a disease will behave or respond to treatment.
- immunohistochemistry | Immunohistochemistry | A laboratory technique that stains a thin slice of tissue with labeled antibodies, revealing which cells carry a particular protein.
- tissue-agnostic | Tissue-agnostic approval | A drug approval based on a tumor's molecular feature, such as MSI-high status, regardless of the organ where the cancer began.
- tumor-mutational-burden | Tumor mutational burden (TMB) | The number of mutations in a tumor's DNA, usually counted per million DNA bases (megabase). High TMB often, but not always, means more neoantigens.
- lag-3 | LAG-3 | An inhibitory receptor on activated and exhausted T cells, distinct from PD-1. The antibody relatlimab blocks it.
- ido | IDO (indoleamine 2,3-dioxygenase) | An enzyme that converts the amino acid tryptophan into kynurenine; both the shortage and the by-product suppress T cells.
- tigit | TIGIT | An inhibitory receptor on T cells and NK cells. Antibodies against it looked promising in early trials but failed in large ones.
- immune-related-adverse-event | Immune-related adverse event (irAE) | A side effect of immunotherapy caused by the immune system attacking healthy tissue, such as colitis, thyroiditis or pneumonitis.
- corticosteroid | Corticosteroid | A drug related to the body's stress hormone cortisol, such as prednisone, that strongly suppresses inflammation and immune activity.
- hypophysitis | Hypophysitis | Inflammation of the pituitary gland, the "master" hormone gland at the base of the brain. It can permanently reduce hormones such as cortisol.
- cortisol | Cortisol | The body's main stress hormone, made by the adrenal glands on instructions from the pituitary. It is essential for life; if the glands are damaged, it must be replaced with pills.
- myocarditis | Myocarditis | Inflammation of the heart muscle. As a side effect of checkpoint inhibitors it is rare but can be fatal.
- pseudoprogression | Pseudoprogression | Apparent growth of tumors on scans early in immunotherapy, from an influx of immune cells or a delayed response, followed by shrinkage.
- hyperprogression | Hyperprogression | A sudden acceleration of tumor growth after starting immunotherapy. How often it happens, how to define it and whether the drugs cause it are all debated.
- memory-cell | Memory cell | A long-lived T or B cell left behind after an immune response, ready to respond faster and more strongly if the same target returns.
- adjuvant-therapy | Adjuvant therapy | Treatment given after surgery to destroy hidden cancer cells and lower the risk of relapse. (Not the same as a vaccine adjuvant.)
- neoadjuvant-therapy | Neoadjuvant therapy | Treatment given before surgery, while the tumor is still in place.

## Sources
1. Emory News Center. A year in the life: Jimmy Carter shares his cancer experience. Emory University, July 11, 2016 (from *Winship Magazine*, Spring 2016). https://news.emory.edu/stories/2016/07/year-life-jimmy-carter-shares-his-cancer-experience
2. Associated Press. Jimmy Carter says he no longer needs cancer treatment. *STAT*, March 7, 2016. https://www.statnews.com/2016/03/07/jimmy-carter-cancer-treatment/
3. Haslam A, Olivier T, Prasad V. How many people in the US are eligible for and respond to checkpoint inhibitors: an empirical analysis. *Int J Cancer* 2025;156(12):2352–2359. doi:10.1002/ijc.35347
4. US Food and Drug Administration. Drugs@FDA: prescribing information, section 11 (Description), for Opdivo (nivolumab), Keytruda (pembrolizumab), Libtayo (cemiplimab), Jemperli (dostarlimab), Tecentriq (atezolizumab), Imjudo (tremelimumab) and penpulimab-kcqx (approved April 23, 2025); approval records for Opdivo Qvantig (nivolumab and hyaluronidase-nvhy, December 27, 2024) and Keytruda Qlex (pembrolizumab and berahyaluronidase alfa-pmph, September 19, 2025). https://www.accessdata.fda.gov/scripts/cder/daf/
5. Huang Z, Pang X, Zhong T, et al. Penpulimab, an Fc-engineered IgG1 anti-PD-1 antibody, with improved efficacy and low incidence of immune-related adverse events. *Front Immunol* 2022;13:924542. doi:10.3389/fimmu.2022.924542
6. Sharma A, Subudhi SK, Blando J, et al. Anti-CTLA-4 immunotherapy does not deplete FOXP3+ regulatory T cells (Tregs) in human cancers. *Clin Cancer Res* 2019;25(4):1233–1238. doi:10.1158/1078-0432.CCR-18-0762
7. Wolchok JD, Chiarion-Sileni V, Rutkowski P, et al. Final, 10-year outcomes with nivolumab plus ipilimumab in advanced melanoma. *N Engl J Med* 2025;392(1):11–22 (published online 2024). doi:10.1056/NEJMoa2407417
8. Marabelle A, Fakih M, Lopez J, et al. Association of tumour mutational burden with outcomes in patients with advanced solid tumours treated with pembrolizumab: prospective biomarker analysis of the multicohort, open-label, phase 2 KEYNOTE-158 study. *Lancet Oncol* 2020;21(10):1353–1365. doi:10.1016/S1470-2045(20)30445-9
9. Dammeijer F, van Gulijk M, Mulder EE, et al. The PD-1/PD-L1-checkpoint restrains T cell immunity in tumor-draining lymph nodes. *Cancer Cell* 2020;38(5):685–700.e8. doi:10.1016/j.ccell.2020.09.001
10. Yost KE, Satpathy AT, Wells DK, et al. Clonal replacement of tumor-specific T cells following PD-1 blockade. *Nat Med* 2019;25(8):1251–1259. doi:10.1038/s41591-019-0522-3
11. Liu B, Hu X, Feng K, et al. Temporal single-cell tracing reveals clonal revival and expansion of precursor exhausted T cells during anti-PD-1 therapy in lung cancer. *Nat Cancer* 2022;3(1):108–121. doi:10.1038/s43018-021-00292-8
12. Arce Vargas F, Furness AJS, Litchfield K, et al. Fc effector function contributes to the activity of human anti-CTLA-4 antibodies. *Cancer Cell* 2018;33(4):649–663.e4. doi:10.1016/j.ccell.2018.02.010
13. Im SJ, Hashimoto M, Gerner MY, et al. Defining CD8+ T cells that provide the proliferative burst after PD-1 therapy. *Nature* 2016;537(7620):417–421. doi:10.1038/nature19330
14. Robert C, Thomas L, Bondarenko I, et al. Ipilimumab plus dacarbazine for previously untreated metastatic melanoma. *N Engl J Med* 2011;364(26):2517–2526. doi:10.1056/NEJMoa1104621
15. Wolchok JD, Chiarion-Sileni V, Gonzalez R, et al. Overall survival with combined nivolumab and ipilimumab in advanced melanoma. *N Engl J Med* 2017;377(14):1345–1356. doi:10.1056/NEJMoa1709684
16. Hodi FS, O'Day SJ, McDermott DF, et al. Improved survival with ipilimumab in patients with metastatic melanoma. *N Engl J Med* 2010;363(8):711–723. doi:10.1056/NEJMoa1003466
17. Schadendorf D, Hodi FS, Robert C, et al. Pooled analysis of long-term survival data from phase II and phase III trials of ipilimumab in unresectable or metastatic melanoma. *J Clin Oncol* 2015;33(17):1889–1894. doi:10.1200/JCO.2014.56.2736
18. Reck M, Rodríguez-Abreu D, Robinson AG, et al. Five-year outcomes with pembrolizumab versus chemotherapy for metastatic non-small-cell lung cancer with PD-L1 tumor proportion score ≥ 50%. *J Clin Oncol* 2021;39(21):2339–2349. doi:10.1200/JCO.21.00174
19. Larkin J, Chiarion-Sileni V, Gonzalez R, et al. Five-year survival with combined nivolumab and ipilimumab in advanced melanoma. *N Engl J Med* 2019;381(16):1535–1546. doi:10.1056/NEJMoa1910836
20. Prasad V, Kim C, Burotto M, Vandross A. The strength of association between surrogate end points and survival in oncology: a systematic review of trial-level meta-analyses. *JAMA Intern Med* 2015;175(8):1389–1398. doi:10.1001/jamainternmed.2015.2829
21. Tawbi HA, Schadendorf D, Lipson EJ, et al. Relatlimab and nivolumab versus nivolumab in untreated advanced melanoma. *N Engl J Med* 2022;386(1):24–34. doi:10.1056/NEJMoa2109970
22. Long GV, Hodi FS, Lipson EJ, et al. Overall survival and response with nivolumab and relatlimab in advanced melanoma. *NEJM Evid* 2023;2(4):EVIDoa2200239. doi:10.1056/EVIDoa2200239
23. Le DT, Uram JN, Wang H, et al. PD-1 blockade in tumors with mismatch-repair deficiency. *N Engl J Med* 2015;372(26):2509–2520. doi:10.1056/NEJMoa1500596
24. Ansell SM, Lesokhin AM, Borrello I, et al. PD-1 blockade with nivolumab in relapsed or refractory Hodgkin's lymphoma. *N Engl J Med* 2015;372(4):311–319. doi:10.1056/NEJMoa1411087
25. McGrail DJ, Pilié PG, Rashid NU, et al. High tumor mutation burden fails to predict immune checkpoint blockade response across all cancer types. *Ann Oncol* 2021;32(5):661–672. doi:10.1016/j.annonc.2021.02.006
26. Ayers M, Lunceford J, Nebozhyn M, et al. IFN-γ-related mRNA profile predicts clinical response to PD-1 blockade. *J Clin Invest* 2017;127(8):2930–2940. doi:10.1172/JCI91190
27. Long GV, Dummer R, Hamid O, et al. Epacadostat plus pembrolizumab versus placebo plus pembrolizumab in patients with unresectable or metastatic melanoma (ECHO-301/KEYNOTE-252): a phase 3, randomised, double-blind study. *Lancet Oncol* 2019;20(8):1083–1097. doi:10.1016/S1470-2045(19)30274-8
28. Peters S, Herbst R, Horinouchi H, et al. SKYSCRAPER-01: tiragolumab in combination with atezolizumab in previously untreated PD-L1-high, locally advanced, unresectable or metastatic non-small cell lung cancer. *J Clin Oncol* 2026;44(25):2400–2408. doi:10.1200/JCO-25-02777
29. Regeneron Pharmaceuticals. Regeneron provides update on phase 3 trial of fianlimab (LAG-3 inhibitor) combination in first-line unresectable or metastatic melanoma. Press release, May 15, 2026 (company-reported results). https://www.globenewswire.com/news-release/2026/05/16/3296192/0/en/regeneron-provides-update-on-phase-3-trial-of-fianlimab-lag-3-inhibitor-combination-in-first-line-unresectable-or-metastatic-melanoma.html
30. ApexOnco. 5,000 patients later, Roche scraps its TIGIT. News report, July 24, 2025. https://www.apexonco.com/5000-patients-later-roche-scraps-its-tigit
31. Gilead Sciences. Gilead provides update on phase 3 STAR-221 study. Company statement, December 12, 2025 (company-reported). https://www.gilead.com/company/company-statements/2025/gilead-provides-update-on-phase-3-star-221-study
32. Ramos-Casals M, Brahmer JR, Callahan MK, et al. Immune-related adverse events of checkpoint inhibitors. *Nat Rev Dis Primers* 2020;6(1):38. doi:10.1038/s41572-020-0160-6
33. Barroso-Sousa R, Barry WT, Garrido-Castro AC, et al. Incidence of endocrine dysfunction following the use of different immune checkpoint inhibitor regimens: a systematic review and meta-analysis. *JAMA Oncol* 2018;4(2):173–182. doi:10.1001/jamaoncol.2017.3064
34. Faje AT, Lawrence D, Flaherty K, et al. High-dose glucocorticoids for the treatment of ipilimumab-induced hypophysitis is associated with reduced survival in patients with melanoma. *Cancer* 2018;124(18):3706–3714. doi:10.1002/cncr.31629
35. Johnson DB, Balko JM, Compton ML, et al. Fulminant myocarditis with combination immune checkpoint blockade. *N Engl J Med* 2016;375(18):1749–1755. doi:10.1056/NEJMoa1609214
36. Nishino M, Giobbie-Hurder A, Hatabu H, Ramaiya NH, Hodi FS. Incidence of programmed cell death 1 inhibitor-related pneumonitis in patients with advanced cancer: a systematic review and meta-analysis. *JAMA Oncol* 2016;2(12):1607–1616. doi:10.1001/jamaoncol.2016.2453
37. Suzuki S, Ishikawa N, Konoeda F, et al. Nivolumab-related myasthenia gravis with myositis and myocarditis in Japan. *Neurology* 2017;89(11):1127–1134. doi:10.1212/WNL.0000000000004359
38. Ferrara R, Mezquita L, Texier M, et al. Hyperprogressive disease in patients with advanced non-small cell lung cancer treated with PD-1/PD-L1 inhibitors or with single-agent chemotherapy. *JAMA Oncol* 2018;4(11):1543–1552. doi:10.1001/jamaoncol.2018.3676
39. Brahmer JR, Drake CG, Wollner I, et al. Phase I study of single-agent anti-programmed death-1 (MDX-1106) in refractory solid tumors: safety, clinical activity, pharmacodynamics, and immunologic correlates. *J Clin Oncol* 2010;28(19):3167–3175. doi:10.1200/JCO.2009.26.7609
40. Scheper W, Kelderman S, Fanchi LF, et al. Low and variable tumor reactivity of the intratumoral TCR repertoire in human cancers. *Nat Med* 2019;25(1):89–94. doi:10.1038/s41591-018-0266-5
41. Simoni Y, Becht E, Fehlings M, et al. Bystander CD8+ T cells are abundant and phenotypically distinct in human tumour infiltrates. *Nature* 2018;557(7706):575–579. doi:10.1038/s41586-018-0130-2
42. Roemer MGM, Advani RH, Redd RA, et al. Classical Hodgkin lymphoma with reduced β2M/MHC class I expression is associated with inferior outcome independent of 9p24.1 status. *Cancer Immunol Res* 2016;4(11):910–916. doi:10.1158/2326-6066.CIR-16-0201
43. Roemer MGM, Redd RA, Cader FZ, et al. Major histocompatibility complex class II and programmed death ligand 1 expression predict outcome after programmed death 1 blockade in classic Hodgkin lymphoma. *J Clin Oncol* 2018;36(10):942–950. doi:10.1200/JCO.2017.77.3994
44. Armand P, Engert A, Younes A, et al. Nivolumab for relapsed/refractory classic Hodgkin lymphoma after failure of autologous hematopoietic cell transplantation: extended follow-up of the multicohort single-arm phase II CheckMate 205 trial. *J Clin Oncol* 2018;36(14):1428–1439. doi:10.1200/JCO.2017.76.0793
45. Chen R, Zinzani PL, Fanale MA, et al. Phase II study of the efficacy and safety of pembrolizumab for relapsed/refractory classic Hodgkin lymphoma. *J Clin Oncol* 2017;35(19):2125–2132. doi:10.1200/JCO.2016.72.1316
46. Menzies AM, Johnson DB, Ramanujam S, et al. Anti-PD-1 therapy in patients with advanced melanoma and preexisting autoimmune disorders or major toxicity with ipilimumab. *Ann Oncol* 2017;28(2):368–376. doi:10.1093/annonc/mdw443
47. Toi Y, Sugawara S, Sugisaka J, et al. Profiling preexisting antibodies in patients treated with anti-PD-1 therapy for advanced non-small cell lung cancer. *JAMA Oncol* 2019;5(3):376–383. doi:10.1001/jamaoncol.2018.5860
48. Keir ME, Liang SC, Guleria I, et al. Tissue expression of PD-L1 mediates peripheral T cell tolerance. *J Exp Med* 2006;203(4):883–895. doi:10.1084/jem.20051776
49. Schubert D, Bode C, Kenefeck R, et al. Autosomal dominant immune dysregulation syndrome in humans with CTLA4 mutations. *Nat Med* 2014;20(12):1410–1416. doi:10.1038/nm.3746
50. Schwab C, Gabrysch A, Olbrich P, et al. Phenotype, penetrance, and treatment of 133 cytotoxic T-lymphocyte antigen 4–insufficient subjects. *J Allergy Clin Immunol* 2018;142(6):1932–1946. doi:10.1016/j.jaci.2018.02.055
