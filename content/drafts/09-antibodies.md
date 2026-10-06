---
id: 09-antibodies
title: Therapeutic Antibodies
subtitle: An antibody can only bind. Medicine has turned that one property into five ways to treat cancer.
part: III
reading_time: 24
hero: ch09-hero
---

Many of the drugs on a modern cancer ward share an ending: trastuzumab, rituximab, pembrolizumab, tarlatamab. The suffix *-mab* stands for **m**onoclonal **a**nti**b**ody. In 2025 alone, 19 new antibody drugs, for cancer and many other diseases, won their first approval somewhere in the world.[^1]

An {{antibody|antibody}} ([Chapter 3](03-adaptive.html)) is a Y-shaped {{protein|protein}} whose two arms bind one particular molecular shape. It carries no toxin and does nothing to its target except *bind* it; even its stem, the {{fc-region|Fc region}}, acts only by being bound, by receptors on immune cells and by complement proteins. **How does a molecule that can only bind become a medicine against cancer?**

The {{checkpoint-inhibitor|checkpoint inhibitors}} of [Chapter 8](08-checkpoints.html) are one answer: antibodies that bind the brakes on T cells, or the tumor's half of the brake, PD-L1, and free T cells to act without doing damage themselves. This chapter covers antibodies that act on the cancer more directly: they block its growth signals, mark it for immune attack, cut off its blood supply, deliver a toxic drug into it, or bring a T cell into contact with it.

:::key-idea
An antibody can only bind. What it achieves as a medicine depends on what it binds and what it carries.
:::

## Borrowing immortality from cancer

When your body meets a pathogen, hundreds of different {{b-cell|B cells}} respond, each making its own antibody against a different {{epitope|epitope}}, the small patch of a molecule that an antibody binds. That mixture is good for defense but useless as a drug, which must be one exact molecule, identical in every vial and made by the kilogram. A single B cell could supply such a molecule, but B cells taken out of the body die within days in a dish.

In 1975, Georges Köhler and César Milstein, working in Cambridge, England, found a way around this.[^2] They fused antibody-making B cells from an immunized mouse with cells from a {{myeloma|myeloma}}, a cancer of antibody-making {{plasma-cell|plasma cells}} that can divide indefinitely in a dish. Some of the fused cells, called {{hybridoma|hybridomas}}, inherited one property from each parent: the B cell's chosen antibody and the cancer cell's immortality.

Single hybridoma cells were grown into colonies, and the ones making the right antibody were kept. Each colony descends from one cell and makes a single antibody, a {{monoclonal-antibody|monoclonal antibody}}. The method won Köhler and Milstein a share of the 1984 Nobel Prize.

## The mouse problem

The first monoclonal antibody approved as a drug, in 1986, was pure mouse protein, used to stop the rejection of transplanted organs.[^3] To a human {{immune-system|immune system}}, a mouse antibody is foreign. Patients quickly made antibodies *against the drug*, called {{anti-drug-antibody|anti-drug antibodies}}, which cleared it from the blood and could trigger allergic reactions. Mouse antibodies were also poor at recruiting human immune cells.[^3]

The fix relies on antibody anatomy. Each of the antibody's two arms (the {{fab|Fab arms}}) ends in the {{variable-region|variable regions}} of one heavy and one light chain, the part that differs from one antibody to the next. Within them, the contact with the target is made by six short loops, three from each chain, called {{cdr|complementarity-determining regions}} (CDRs). The remainder of each variable region, its framework, holds the loops in place, and the {{constant-region|constant regions}} form the rest of the arms and the Fc region. Since only the loops contact the target, engineers replaced the mouse parts around them with human ones in stages:[^3]

- {{chimeric-antibody|**Chimeric**}} antibodies keep the mouse's entire variable regions on human constant regions. They are roughly two-thirds human. Rituximab and cetuximab, both discussed below, are chimeric.
- {{humanized-antibody|**Humanized**}} antibodies keep only the six mouse CDRs (plus, usually, a few mouse amino acids in the framework that hold them in shape), grafted onto a human antibody. Greg Winter's lab pioneered the method in 1986. They are about 90% human or more. Trastuzumab and pembrolizumab are humanized.
- **Fully human** antibodies contain no mouse protein at all. They are selected from vast libraries of human antibody fragments, a method called {{phage-display|phage display}}, or made by mice whose own antibody genes have been replaced with human ones. The first approvals came in 2002 and 2006.

The names record this history. In the classic code, the letters just before *-mab* give the source: *-o-* for mouse, *-xi-* for chimeric, *-zu-* for humanized, *-u-* for human.[^4] Hence ritu**xi**mab, trastu**zu**mab and daratum**u**mab (a fully human myeloma drug discussed later). Names chosen since 2017 leave the source out, which is why tarlatamab's name says nothing about its origin (see the box below).

Humanization lowers the risk of an immune reaction without removing it: even a fully human antibody's variable regions are a shape the body has never made.

:::figure ch09-humanization
title: From mouse to human, one part at a time
goal: After using this, the reader understands that an antibody's grip lives in six small loops at each arm tip, so engineers could replace the rest with human parts without losing the target, and that the drug's name records how much was replaced.
kind: explorer
stage: dark
spec: |
  ONE IDEA: the grip lives in six tiny loops; everything else is a swappable frame. Keep the screen calm:
  one antibody, one magnifier, one slider, a name chip and two meters. No extra modes.
  SHARED ART: built in the same task as ch03-antibody (FIGURE-AUDIT §2.I). The antibody is the library
  antibody() at high detail (12 domains), variant 'therapeutic' (gold, white outline). Mouse-derived parts
  use the library's origin:'mouse' rendering (slate plus hatch). Stage tags (top right, t-caps):
  "Illustrative" (the meters are a teaching model, not measurements) and "Not to scale".

  LAYOUT (desktop, landscape viewBox ~960x540):
  - Center-left: the antibody upright as a Y (arms ~60° apart, stem down). At upper right, a strip of
    cancer-cell membrane (library cancer-cell edge) runs diagonally, carrying one target: library antigen()
    on a stalk, generic circle head. The tip of the antibody's right arm caps the target head at all times;
    the stem points away. Only two text labels on the antibody: "tip" and "stem".
  - Right of the antibody, just below the target: a permanent circular MAGNIFIER inset (~180 px) joined
    to the right arm tip by two thin lines that do not cross the antibody. Inside it: that tip enlarged,
    with six small finger-like loops (three on the heavy chain, three on the light chain) closing around
    the target head. Caption under the inset: "six loops do the gripping".
  - Beside the stage (HTML panel, right on desktop): the name chip, then two meters.
  - Bottom: a 4-stop slider, also usable as 4 buttons: "Mouse · Chimeric · Humanized · Fully human".
    Tiny year under each stop: 1986 · 1994 · 1997 · 2002, with a footnote: "Year of the first US approval
    of this kind of antibody, for any disease."

  THE ANTIBODY (library art already draws this; the builder must not simplify it): two heavy and two
  light chains; each arm = 4 domains (two variable domains at the tip, two constant below), stem = 4
  constant domains; 12 in total. The six loops sit at the very outer end of each arm (both arms have
  them; only the right arm touches the target). Never draw binding anywhere else.

  STATES (slider). Morph by sweeping gold upward from the stem to the tips over ~0.8 s. The gripping tip
  never moves or loosens, and the magnifier keeps showing the same grip.
  1. Mouse: all 12 domains and all loops mouse-rendered.
  2. Chimeric: the 4 variable domains (2 per arm, at the tips) mouse-rendered; the 8 constant domains gold.
  3. Humanized: all domains gold; only the 6 loops per arm mouse-rendered, plus 2–3 tiny mouse specks in
     the frame right next to the loops (the "supporting mouse building blocks"); the magnifier shows these.
  4. Fully human: everything gold.

  NAME CHIP (large; the source letters bold AND underlined, never color only):
  1. "ibritum·**o**·mab" (ibritumomab) 2. "ritu·**xi**·mab" (rituximab) 3. "trastu·**zu**·mab" (trastuzumab)
  4. "daratum·**u**·mab" (daratumumab). Under it, one line: "-o- mouse · -xi- chimeric · -zu- humanized ·
  -u- human". Footnote: "Names chosen since 2017 drop these letters. See 'Go deeper'."

  METERS (HTML, horizontal bars with word values, no numbers):
  - "Grip on the target": FULL at every stop, the same bar. This constancy is the point.
  - "Patient's immune reaction against the drug": High · Lower · Low · Low (never zero).

  THE ONE ANIMATION (makes meter 2 visible): small anti-drug antibodies (natural antibodies: library
  antibody(), gold with NO outline, about 1/5 the drug's size; the first carries a tiny label "anti-drug
  antibody") drift in from the left and stick mainly to mouse-rendered parts. Mouse: ~10 stick all over
  within 3 s. Chimeric: ~4, on the arm tips. Humanized: 1–2, at the loops. Fully human: now and then a
  single one sticks at a (gold) loop, to show that even a fully human antibody's unique tips can be
  recognized.

  PROGRESSIVE DISCLOSURE: on load, show the Mouse state, the antibody, the magnifier and caption 1. The
  name chip and meters fade in the first time the reader moves the slider.

  MOBILE (≤ 480 px): portrait viewBox (~360x560). Antibody upper center with the target at its upper
  right, magnifier as a smaller circle at its lower right, name chip below, slider (4 tap targets ≥ 44 px),
  then the two meters.
  REDUCED MOTION: jump between states; show anti-drug antibodies already stuck in place.
  DO NOT: simplify the antibody below 12 domains; put binding at the stem; show any immune-cell
  recruitment (this figure is only about the grip and the immune reaction); show "zero" reaction for
  fully human; faces or eyes.
steps:
  1. A pure mouse antibody. It binds the target well, but the patient's immune system treats the whole molecule as foreign and makes antibodies against it. These clear the drug and can cause allergic reactions.
  2. Chimeric: the mouse's variable regions, at the ends of the arms, are joined to human constant regions, making the antibody roughly two-thirds human. Binding to the target is unchanged and the immune reaction drops. In the old naming code, -xi- marks a chimeric antibody, as in rituximab.
  3. Humanized: only the six loops that contact the target (the CDRs) remain from the mouse, plus a few mouse amino acids that hold them in shape. Binding is still unchanged, and -zu- marks the name, as in trastuzumab.
  4. Fully human: no mouse parts remain. These antibodies come from libraries of human antibody fragments or from mice carrying human antibody genes, and -u- marks the name, as in daratumumab. Their variable regions are still a new shape to the body, so reactions are uncommon but possible.
alt: A Y-shaped antibody binds a target on a cancer cell with the end of one arm; a magnifier shows the six small loops (CDRs) that contact the target. A slider replaces mouse-derived parts (slate, hatched) with human parts (gold) in four stages: mouse, chimeric, humanized and fully human. Binding never changes, fewer anti-drug antibodies attach at each stage, and the example drug name changes from ibritumomab to rituximab, trastuzumab and daratumumab.
:::

:::deep-dive Reading a -mab's name, and why new antibodies no longer end in -mab
Antibody drugs get their generic names (International Nonproprietary Names) from the World Health Organization. The first antibody scheme, adopted in 1991, built names from a random prefix, a target infix, a source infix and the stem *-mab*.[^4] So *ri·tu·xi·mab* is "tu" for tumor plus "xi" for chimeric.

**2016–17: the source letters were dropped.** WHO experts saw no scientific basis for ranking source infixes, worried that the more "human" ones had become a mark of prestige, and were running out of distinct names. The tumor infix also became *-ta-*,[^4] hence the many recent cancer drugs ending in *-tamab*, like teclistamab and tarlatamab.

**2021–22: the end of -mab.** With nearly 880 names already ending in *-mab*, distinctive new ones had become hard to find. In October 2021 the WHO retired the stem for new drugs and replaced it with four that describe the molecule's *structure*:[^4]

- **-tug**: an unmodified, full-length, single-target antibody.
- **-bart**: a full-length, single-target antibody with a deliberately engineered constant region, often in the Fc region ("artificial").
- **-mig**: a bispecific or multispecific antibody of any shape.
- **-ment**: a single-target fragment, such as Fab arms without a full Fc region.

The changes are not retroactive. Drugs named earlier keep their names, so most antibodies approved in 2025 and 2026, such as the myeloma engager linvoseltamab, still end in *-mab*; the first drugs with the new endings were approved in 2025, in China.[^4][^1] Tebentafusp, discussed later in this chapter, ends in yet another stem, *-fusp*, for engineered fusion proteins;[^4] its targeting end is not an antibody at all.
:::

## Three jobs for a naked antibody

The simplest antibody drugs carry nothing extra: no attached drug and no second kind of arm. Doctors call them {{naked-antibody|"naked" antibodies}}. Depending on what they bind, they block a signal, mark a cell for destruction, or starve a tumor of blood.

### Block: jamming a growth signal

Cells decide whether to divide partly in response to outside signals, which they detect with {{receptor|receptors}}: proteins with a binding site outside the cell and a signaling part inside. In about 15–20% of breast cancers, the cells carry extra copies of the {{gene|gene}} for one such receptor, {{her2|HER2}}, and express it densely on their surface.[^5] The excess makes these tumors unusually aggressive.[^6] Trastuzumab (Herceptin), an antibody against HER2, was approved in 1998.[^3] In the pivotal trial, led by the UCLA oncologist Dennis Slamon, adding it to {{chemotherapy|chemotherapy}} for {{metastasis|metastatic}} HER2-positive breast cancer (cancer that has spread to distant organs) extended median survival from about 20 to 25 months.[^6] Trastuzumab probably does more than block, though: through its Fc region it also marks HER2-rich cells for immune attack (see the box below).

A related antibody, cetuximab (Erbitux), blocks {{egfr|EGFR}}, a receptor of the same family as HER2. An activated EGFR passes its signal inward along a chain of relay proteins. One of the first in the chain is {{kras|KRAS}}. In about 40% of colorectal cancers, a {{mutation|mutation}} locks KRAS in its active state, so it signals continuously whatever happens at the receptor.[^7] (Real cells have several parallel chains; this is the simplest version.)

In a 2008 analysis of a cetuximab trial, patients whose tumors had normal KRAS lived about twice as long with the drug as with supportive care alone (median 9.5 vs 4.8 months). Patients with mutant KRAS gained nothing.[^7] Colorectal tumors are now tested for mutations in KRAS and its close relatives (the RAS family) before these antibodies are considered.

**Blocking a signal helps only if the cancer still depends on that signal at that point in the chain.**

:::figure ch09-wiring
title: When blocking the receptor stops working
goal: After using this, the reader understands that an antibody blocking a growth receptor silences the "divide" signal only if nothing further down the chain is stuck on, which is why cetuximab fails in tumors with mutant KRAS.
kind: explorer
stage: dark
spec: |
  ONE IDEA, FOUR STATES (2 × 2): drug off/on × KRAS normal/mutant. No counters, no extra labels.
  Stage tags: "Illustrative" and "Not to scale".

  SCENE (landscape viewBox ~900x500; portrait on mobile):
  - A stretch of cancer-cell membrane runs horizontally across the upper third (cancer-cell violet).
    Outside = above, inside = below.
  - Three EGFR receptors span the membrane. EGFR is the one bespoke receptor in the book (FIGURE-AUDIT
    §4.4): a two-lobed antenna above, a thin line through the membrane, a small box below. Label one
    "EGFR (receptor)". HER2 is NOT used here (it has no signal molecule to block).
  - Growth-factor molecules (small sand-colored dots; label one "growth factor") drift down and dock on
    the antennas.
  - Below the membrane, a "wire": a vertical chain of three beads. Only the first bead, sitting right
    against the inner face of the membrane, is labeled "KRAS"; the other two are unlabeled ("relay
    proteins" on hover). The chain ends at a nucleus outline near the bottom, which holds a round lamp
    labeled "DIVIDE": the library activating signalIcon (green-cyan "+" disc) when lit; gray outline when
    off.
  - When a receptor is triggered, a soft pulse runs down the chain and the lamp turns on (a gentle fade,
    nothing flashes).

  CONTROLS (HTML): toggle "Add cetuximab"; segmented "Tumor's KRAS: Normal | Mutant".
  PROGRESSIVE DISCLOSURE: on load only "Add cetuximab" is shown (KRAS = Normal). After the reader has
  switched cetuximab on once, the KRAS control fades in with a one-line prompt: "Now try a tumor whose
  KRAS is mutated."

  STATES AND VERBATIM CAPTIONS (aria-live):
  a) Normal, no drug: growth factor docks, pulses run, lamp lights with each docking.
     "A growth factor docks on EGFR, and a pulse runs down the chain inside the cell. The cell gets the message to divide."
  b) Normal + cetuximab: drug antibodies (library antibody, variant 'therapeutic') cap the outer lobe of
     each antenna with one arm tip, stems pointing away; growth-factor dots bounce off; no pulses; lamp dark.
     "Cetuximab sits where the growth factor would land. No docking, no pulse, no message to divide."
  c) Mutant, no drug: the KRAS bead glows steadily and shows a small toggle-switch glyph jammed in the ON
     position with the label "stuck on" (never a padlock, which reads as "off"); pulses run from KRAS
     downward nonstop; lamp lit continuously.
     "This tumor's KRAS is mutated and stuck on. It sends the divide signal nonstop, whatever happens at the receptor."
  d) Mutant + cetuximab: receptors capped, growth factor bouncing off, BUT KRAS still glowing and the lamp
     still lit; a recognition-style ring (not a flash) pulses once around the KRAS bead.
     "Cetuximab still blocks the receptor, but it no longer matters: the signal starts below the blockade. That is why colorectal tumors are tested for RAS mutations before this drug is used."

  FOOTNOTE (small, always visible): "Simplified: real cells split this signal into several wires."
  MOBILE: portrait viewBox (~360x520); membrane near the top, wire vertical below; controls stacked under
  the stage as large toggles.
  REDUCED MOTION: no drifting or pulses; show each state as a still with arrows (pulse path drawn as a
  solid arrow when active) and the lamp on or off.
alt: A cancer-cell membrane with EGFR receptors and, inside, a chain of relay proteins starting with KRAS that leads to a "divide" lamp in the nucleus. A growth factor binds and the lamp lights. Adding cetuximab binds and blocks the receptors, and the lamp goes dark. In a tumor with mutant KRAS, KRAS is locked in its active state and the lamp stays lit whether or not cetuximab blocks the receptors.
:::

### Mark: coating a cell for attack

The second job uses the Fc region. Rituximab (Rituxan) binds {{cd20|CD20}}, a protein on nearly all B cells, including the cancerous B cells of most B-cell {{lymphoma|lymphomas}}. Approved in 1997, it was the first antibody approved in the United States to treat cancer.[^3] Once rituximab coats a lymphoma cell, its exposed Fc regions are bound by the immune components described in [Chapter 3](03-adaptive.html). {{nk-cell|NK cells}} bind them through their {{fc-receptor|Fc receptors}} and release cytotoxic granules, a process called {{adcc|antibody-dependent cellular cytotoxicity}} (ADCC). {{complement|Complement}} proteins, activated by the clustered Fc regions, form pores in the cell's membrane ({{cdc|complement-dependent cytotoxicity}}, or CDC), and {{macrophage|macrophages}} engulf the coated cell ({{adcp|antibody-dependent cellular phagocytosis}}, or ADCP).[^8] (Chapter 3's antibody figure shows each of them at work.)

CD20 is missing from two cell types that matter here: the blood-forming cells in the {{bone-marrow|bone marrow}} that make new B cells, and plasma cells, which already secrete antibodies. So healthy B cells destroyed along with the cancer grow back, usually within 6 to 12 months, and much of the patient's existing antibody protection remains.[^9]

In a 2002 trial in older patients with diffuse large B-cell lymphoma, the most common aggressive lymphoma, adding rituximab to standard chemotherapy raised complete remissions (no detectable lymphoma after treatment) from 63% to 76% and cut the risk of death by about a third.[^10] That combination became the standard treatment worldwide.

### Starve: neutralizing a signal

In the third job, the antibody never binds a cancer cell. A growing tumor needs a blood supply, and its cells secrete a signaling protein, {{vegf|VEGF}}, that makes nearby blood vessels sprout new branches toward them. Bevacizumab (Avastin) circulates in the blood, binds VEGF and neutralizes it before it reaches the vessels.

In 2004, adding bevacizumab to chemotherapy for metastatic colorectal cancer extended median survival from 15.6 to 20.3 months; because healthy vessels need VEGF too, it can raise blood pressure.[^11]

The same drawback appears outside cancer. Infliximab (Remicade) binds and neutralizes {{tnf|TNF}}, an inflammatory signaling protein (Chapter 2), to treat rheumatoid arthritis, but TNF also helps keep tuberculosis in check, and some patients developed tuberculosis within months of starting the drug.[^30]

:::deep-dive Does trastuzumab block HER2 or mark the cell?
HER2 is an unusual receptor: no {{ligand|ligand}} (signal molecule) is known to bind it. Packed densely onto a cancer cell, HER2 molecules pair with one another and with relatives such as EGFR, and the pairs activate each other.[^31] Trastuzumab damps some of that signaling, but with no ligand to keep out, "blocker" is a loose label. Its Fc region may matter as much.

In 2000, Jeffrey Ravetch's lab tested trastuzumab and rituximab in mice lacking the activating Fc receptors that immune cells use to bind antibody Fc regions. In these mice, the drugs could no longer stop tumor growth, and neither could antibodies engineered so their Fc regions could not bind those receptors. Mice lacking an *inhibitory* Fc receptor, which normally damps the response, showed stronger antibody-driven killing.[^12] In mice, at least, recruiting immune cells through the Fc region was a dominant part of how these antibodies worked.

In patients the answer is probably "both, in proportions that vary by drug, tumor and person." The practical result was **Fc engineering**: altering the Fc region on purpose. Antibodies meant to recruit immune cells can be given Fc regions that bind activating Fc receptors with higher {{affinity|affinity}}. Antibodies whose Fc regions would do harm, such as many checkpoint blockers and most T-cell engagers, get silenced Fc regions that barely bind Fc receptors; others, like trastuzumab and cetuximab, keep ordinary ones. Under the WHO's new naming rules, a single-target antibody with an engineered Fc region ends in *-bart*; bispecifics end in *-mig* whatever their Fc region.[^4] The Fc region also decides how long an antibody lasts in the blood (see "Why blinatumomab needs a pump" below).
:::

## Armed antibodies: antibody–drug conjugates

Monoclonal antibodies brought medicine close to Paul Ehrlich's "magic bullet" (see the [Interlude](interlude-history.html)), a drug that reaches only the cells it is aimed at. An {{adc|antibody–drug conjugate}}, or ADC, attaches a cytotoxic (cell-killing) drug to the antibody. It has three parts:[^13]

- The **antibody** binds a protein abundant on cancer cells.
- The {{linker|linker}} is a chemical tether designed to stay intact in the blood and release the drug inside the target cell.
- The {{payload|payload}} is a chemotherapy drug far too toxic to be given on its own.

The ADC binds its target, and the cancer cell, which constantly draws parts of its surface membrane inward, takes in the ADC and its target together, a process called {{internalization|internalization}}. They arrive in an {{endosome|endosome}}, a membrane-bound vesicle that fuses with a {{lysosome|lysosome}}, the cell's acidic degradation compartment. There, proteases (protein-degrading enzymes) cleave the linker or digest the antibody, releasing the payload. The payload then disrupts the microtubules the cell needs to divide or breaks its DNA, and the cell dies.

Nothing steers an ADC to its target. It circulates until it happens to bind, and only around 0.1% of an injected dose of a tumor-targeting antibody reaches the tumor at all.[^13] The payload therefore has to be lethal in tiny amounts, and some of it ends up in the wrong place: linkers can break early, and healthy cells carrying a little of the target take up the drug too. **Much of an ADC's toxicity comes from its payload, not its antibody.**

Two details decide how an ADC behaves: how many payload molecules each antibody carries (its {{drug-to-antibody-ratio|drug-to-antibody ratio}}, or DAR), and whether the released payload can cross cell membranes. If it can, some escapes the dying cell and kills its neighbors. This {{bystander-effect|bystander effect}} matters because tumors are {{tumor-heterogeneity|heterogeneous}} ([Chapter 6](06-cancer.html)): some cells carry plenty of the target, others little or none.

Two drugs built on trastuzumab show the difference. Trastuzumab emtansine (T-DM1, Kadcyla), approved in 2013, has a DAR of about 3.5. Its linker is non-cleavable: lysosomal proteases must digest the whole antibody to release the payload, which then stays trapped in that cell. Trastuzumab deruxtecan (T-DXd, Enhertu) has a DAR of about 8 and a cleavable linker, and its payload crosses membranes.[^13][^14] In the lab, T-DXd killed HER2-negative cancer cells mixed among HER2-positive ones; T-DM1 did not.[^14] In a head-to-head trial in HER2-positive metastatic breast cancer, 76% of patients on T-DXd were alive without cancer growth after a year, versus 34% on T-DM1.[^15]

Many breast cancers labeled "HER2-negative" in fact carry *some* HER2, and existing HER2 drugs, including plain trastuzumab, had not helped them. In a trial in these "HER2-low" cancers, T-DXd extended median survival from 16.8 to 23.4 months compared with chemotherapy.[^16] The likely reason is the design just described: even a little HER2 gives an antibody carrying eight payload molecules a place to bind and be internalized, and a payload that crosses membranes reaches neighbors that have none. The FDA's 2022 approval for HER2-low breast cancer created a new treatment category.[^17]

:::key-idea
A blocking antibody works only if its target *matters* to the cancer. An antibody that recruits immune cells, or an ADC, needs its target only as an *address*: a surface protein that marks the cell and, for an ADC, is internalized so the payload can get in.
:::

The payloads have costs: in the HER2-low trial, 12% of patients on T-DXd developed {{interstitial-lung-disease|lung inflammation}} and 0.8% died of it, so patients are watched closely for cough or breathlessness.[^16] Other ADCs now treat triple-negative breast cancer and bladder cancer (see the field guide below).

:::figure ch09-adc
title: Anatomy of an antibody–drug conjugate
goal: After using this, the reader understands how an antibody–drug conjugate delivers its payload inside a cancer cell, and how a payload that can cross membranes also kills touching neighbors with little or no target, while cells out of reach survive.
kind: stepper
stage: dark
spec: |
  A 5-STEP STEPPER (ctx.ui.stepper, guided then free). Steps 1–4 run with T-DXd only and zoom in on one
  cell. Step 5 zooms out to a small patch of cells and only then reveals one extra control (a T-DXd /
  T-DM1 switch). No tallies or counts anywhere. Stage tags: "Not to scale" and "Illustrative".

  THE ADC ICON: a drug antibody (library antibody, variant 'therapeutic': gold, white outline) carrying
  payloads drawn as the library `adc` hexagons (#E6F7FF). Never stars (stars mean danger signals) and no
  radiation symbols. Each hexagon hangs on a short thin tether = the linker: drawn with a small notch if
  cleavable (T-DXd), as a solid line if not (T-DM1). T-DXd carries 8 hexagons; T-DM1 3–4 (label "≈3.5 on
  average"). Hexagons attach along the lower arms and the stem (the antibody's constant parts), NEVER at
  the gripping tips. Footnote: "A payload molecule is a few hundred times lighter than the antibody."

  TARGET: HER2 is the library antigen() on a stalk with a DIAMOND head (FIGURE-AUDIT §4.4). The antibody
  caps a diamond head with one arm tip, stem pointing away.

  STEPS 1–4 (one HER2-rich cancer cell; cancer-cell membrane across the lower half of the stage, cell
  interior and nucleus below):
  1 "Bind": several ADCs drift across the top from left to right; most pass by. One ADC's arm tip caps a
    HER2 diamond; another binds nearby.
  2 "Swallow": the membrane under the bound ADC dimples inward and pinches off; ADC + HER2 are now inside
    a small bubble drifting into the cell.
  3 "Release": the bubble fuses with a larger round sac (the lysosome; slightly acidic tint, small enzyme
    glyphs). The linker notches snap and the hexagons float free.
  4 "Kill": free hexagons move to the nucleus; a DNA strand there shows a break; the cell dies by the
    shared kill grammar's dying sequence (shrink, blebs, fragments). Nothing explodes or flashes.

  STEP 5 "Neighbors" (zoom out): a patch of 7 cancer cells. 3 HER2-rich (many diamonds), 2 HER2-poor (2–3
  diamonds), 2 with no HER2 (no diamonds; small "0" badge). Arrangement matters: ONE "0" cell touches a
  HER2-rich cell; the OTHER "0" cell sits at the edge, touching only the other "0" cell, so no dying cell
  touches it. A segmented switch appears: "T-DXd | T-DM1" (default T-DXd). "Play" runs the scene:
  - T-DXd: ADCs bind and enter the rich and poor cells; free hexagons pass straight through the membranes
    of dying cells into their touching neighbors. The rich and poor cells die, and so does the "0" cell
    that touches a dying cell. The edge "0" cell, touching no dying cell, SURVIVES. Hexagons reach only
    touching neighbors, never distant cells.
  - T-DM1: ADCs bind and enter mainly the rich cells; a small inset replays step 3 for T-DM1, showing the
    antibody itself being digested and the hexagons coming free still attached to a short charged stub
    (tiny "+" tag). In the patch, freed hexagons bump against the inside of the membrane and stay; the
    HER2-rich cells die, the HER2-poor cells mostly survive, and both "0" cells survive.
  Permanent small note under step 5: "Not shown: payload that leaks into the blood or is taken up by
  healthy organs, the main source of side effects such as lung inflammation."

  MOBILE: portrait viewBox; Back / Next buttons and step dots in a bar under the stage; the T-DXd / T-DM1
  switch appears under the stage at step 5 as two large buttons.
  REDUCED MOTION: each step shows its end state as a still with arrows.
  DO NOT: put payloads on the arm tips; show the ADC killing distant cells; let every cell die; imply
  radioactivity; show any numbers of cells killed.
steps:
  1. An antibody–drug conjugate circulates in the blood until one of its arms binds HER2 on a cancer cell. The small hexagons attached to it by linkers are the payload, still joined to the antibody and harmless for now. Most of the dose never reaches the tumor at all.
  2. The cell constantly takes parts of its own surface membrane inside. Here it internalizes HER2 with the drug still bound, enclosed in an endosome, a small membrane vesicle.
  3. The endosome fuses with a lysosome, the cell's acidic degradation compartment. Proteases there cleave the linker and release the payload.
  4. The released payload reaches the nucleus and breaks the cell's DNA. The cell dies.
  5. T-DXd's payload crosses membranes, so some escapes into touching neighbors and kills them too, even cancer cells with no HER2; a cell out of reach survives. This is the bystander effect. Switch to T-DM1: its linker is non-cleavable, so proteases digest the antibody instead, and the released payload keeps a charged fragment of linker that traps it inside the first cell.
alt: A step-by-step animation of an antibody–drug conjugate. A gold antibody carrying small payload hexagons binds HER2 on a cancer cell, is internalized in an endosome, and is degraded in a lysosome; the payload is released and breaks the cell's DNA. In a patch of cells with high, low and no HER2, trastuzumab deruxtecan's payload spreads into touching neighbors and kills a HER2-negative cell next to a dying one, while a HER2-negative cell out of reach survives; with trastuzumab emtansine the payload stays trapped and only HER2-rich cells die.
:::

:::deep-dive ADC design: linkers, payload counts and the bystander trade-off
**Linkers.** A linker has to survive days in the blood, then release its payload inside the target cell. *Cleavable* linkers exploit conditions inside the cell: acid-sensitive bonds (in gemtuzumab ozogamicin, the first ADC), disulfide bonds that break in the cell's chemically "reducing" interior, or short peptides cleaved by lysosomal proteases such as cathepsins. *Non-cleavable* linkers, as in T-DM1, release their payload only after the whole antibody is degraded, leaving a charged fragment of linker attached that traps the payload inside the cell.[^13]

**More is not always better.** The DAR of approved ADCs ranges from 2 to 8. Heavier loading makes an ADC more potent in a dish but can backfire in the body. In mice, a version of brentuximab vedotin with a DAR of 8 was cleared five times faster than one with a DAR of 2, and it was more toxic without working better. The {{hydrophobic|hydrophobic}} (water-repelling) payload–linker units seem to make the molecule easier for the liver to clear; more hydrophilic linker designs avoid this.[^13]

**The bystander trade-off.** In mice carrying a mix of HER2-positive and HER2-negative tumor cells, T-DXd suppressed the HER2-negative cells. It did *not* affect HER2-negative tumors implanted on the other side of the body, so the bystander effect is local.[^14] The same leakiness, though, puts more payload in places it was not aimed.

**A rocky history.** The first ADC, gemtuzumab ozogamicin (2000), was withdrawn and later re-approved (see the [Interlude](interlude-history.html)); brentuximab vedotin (2011) and T-DM1 (2013) restarted the field.[^13] Today ADCs are among the busiest areas of cancer drug development.[^1]
:::

## Bispecific antibodies: T-cell engagers

A {{t-cell|T cell}} reacts only if its {{tcr|T-cell receptor}} matches a {{peptide|peptide}} displayed on another cell's {{mhc-class-i|MHC class I}} molecules, the "shop window" of [Chapter 4](04-presentation.html). Each T cell carries one receptor specificity, and for any given target only about one T cell in 10,000 to a million matches, usually toward the rare end. Tumors can also hide by losing class I ([Chapter 7](07-escape.html)).

A {{bispecific-antibody|bispecific antibody}} has two different binding sites. In a {{t-cell-engager|T-cell engager}}, one site binds a protein on the cancer cell's surface. The other binds {{cd3|CD3}}, the set of signaling chains attached to the T-cell receptor on *every* T cell, whatever its receptor specificity.[^18] The drug physically bridges the T cell to the cancer cell; the T cell forms an {{immunological-synapse|immunological synapse}}, the tight contact of Chapter 5, and releases perforin and granzymes into it. Engagers bind and dissociate like any antibody rather than locking the cells together.

The two-factor authentication of Chapter 4 does not stand in the way. That check governs a naive T cell's *first* activation in a lymph node. Engagers mostly recruit antigen-experienced T cells, already activated by past infections, and these can kill without the second signal.[^19]

Bypassing the T cell's own recognition has three consequences:

1. **Almost any antigen-experienced T cell nearby can become a killer**, not just the rare one with a matching receptor.
2. **Losing class I does not protect the tumor**, because the engager never uses class I.
3. **Many T cells can be activated at once.** That can release a surge of {{cytokine|cytokines}}, the immune system's signaling proteins, causing {{crs|cytokine release syndrome}} (CRS): fever, falling blood pressure and, at worst, organ failure.

The first T-cell engager approved in the US, blinatumomab (Blincyto), arrived in 2014.[^17] It links {{cd19|CD19}}, found on B cells and on B-cell {{leukemia|acute lymphoblastic leukemia}}, to CD3. In adults whose leukemia had relapsed or resisted treatment, it extended median survival from 4.0 to 7.7 months compared with chemotherapy.[^20]

Myeloma and lymphoma followed. Teclistamab (Tecvayli) links {{bcma|BCMA}}, a protein on myeloma cells, to CD3. In patients who had run out of the main drug classes, 63% responded.[^21] It then moved to earlier treatment: in myeloma that had come back after one to three treatments, teclistamab plus daratumumab (Darzalex), a naked antibody that marks myeloma cells for immune attack, kept an estimated 83% of patients alive without progression at three years, versus 30% on a standard combination. The cost was mainly infections: 7.1% of patients died of complications during treatment, versus 5.9% on the standard combination.[^22] Even so, more patients were alive overall with the combination, and the FDA approved it in March 2026.[^17]

Solid tumors were harder: few surface proteins sit on cancer cells but not on vital healthy tissue, and T cells must physically get into the tumor. The first US engager for a solid tumor, approved in 2022, was tebentafusp, an unusual design described below. The first for a more common cancer came in small-cell lung cancer, a fast-growing type with few options once first-line chemotherapy fails. These tumors often display very little class I,[^23] which hides them from ordinary T cells but not from an engager. Tarlatamab (Imdelltra) links {{dll3|DLL3}}, a protein these tumors commonly express on their surface, to CD3. In a randomized trial it extended median survival from 8.3 to 13.6 months compared with chemotherapy, with fewer severe side effects (54% vs 80% of patients), though cytokine release still needs monitoring after the first doses.[^24] It won accelerated approval in 2024 and full approval in November 2025.[^17] In September 2026 its maker announced that adding tarlatamab to checkpoint-inhibitor maintenance after first-line chemotherapy also lengthened survival in a phase 3 trial (company-reported; no numbers yet).[^25]

:::deep-dive Why blinatumomab needs a pump
A normal antibody lasts in the blood for weeks because of its Fc region. Cells lining blood vessels constantly take up plasma and send its contents to lysosomes for degradation, but the Fc region binds a recycling receptor, FcRn (the neonatal Fc receptor), that returns the antibody to the blood. Small proteins without an Fc region are also quickly filtered out by the kidneys.

Blinatumomab is two {{scfv|single-chain variable fragments}} (scFvs) joined end to end, with no Fc region. Each scFv is the pair of variable regions from one antibody's heavy and light chains, linked into a single protein chain. The whole molecule is about a third the size of a normal antibody. Its {{half-life|half-life}} is about two hours. To keep a steady level in the blood, patients receive it as a continuous infusion through a small portable pump, typically for four weeks at a time, followed by a break.[^9]

Most newer engagers carry an Fc region. Some, like teclistamab, are built on a full-size antibody; others, like tarlatamab, are blinatumomab-style molecules with an Fc region attached. Either way, they keep the part of the Fc region that binds FcRn, so they last long enough to be given weekly or less often. The rest of the Fc region is silenced so that it barely binds Fc receptors, and NK cells and macrophages do not attack the T cells the drug has bound.[^18] Designers also tune the affinity of the CD3-binding arm and how gradually doses ramp up, which shifts the balance between killing and cytokine release.
:::

An engager cannot create T cells; it works only with the ones that reach the tumor, which is one reason it fails in many "cold" tumors (Chapter 7). Even in small-cell lung cancer, tumors shrank in only about four in ten patients in an early trial.[^26]

:::key-idea
A T-cell engager ignores the T cell's own receptor specificity. It turns nearby T cells into potential killers of whatever its other arm binds, which is the source of both its effectiveness and its danger.
:::

### Tebentafusp: an engager that reads class I

Tebentafusp (Kimmtrak) replaces the tumor-binding antibody arm with an engineered *T-cell receptor* of unusually high affinity, fused to an antibody fragment that binds CD3.[^27] Unlike an antibody, it reads the class I display: it recognizes a peptide from gp100, a protein made by pigment cells and melanomas, displayed in one particular human class I type, {{hla|HLA}}-A*02:01. Because peptides in class I come from *inside* the cell, this reaches targets that antibodies, which see only surface proteins, cannot.

The limits follow from [Chapter 4](04-presentation.html). HLA types differ from person to person, so tebentafusp works only for patients who carry HLA-A*02:01, a type common in people of European ancestry but far from universal. Every patient is tested first, and a tumor that stops displaying class I is invisible to the drug.

It was tested in metastatic uveal melanoma, an eye cancer with few mutations (partly why checkpoint inhibitors do little against it), in which no drug had ever been shown to extend survival. Tebentafusp raised one-year survival from 59% to 73%.[^27] Its common side effects reflect its design: fever (in 76% of patients), a sign of cytokine release, and rash (83%), because healthy pigment cells in the skin carry gp100 too.

:::figure ch09-bridge
title: Bridging T cells to a tumor
goal: After using this, the reader understands that an antibody-based T-cell engager lets ordinary T cells kill a cancer cell without a matching receptor and even when the tumor hides its class I shop window, whereas a TCR-based engager (tebentafusp) needs that shop window and the right HLA type.
kind: simulation
stage: dark
spec: |
  ONE IDEA: who can recognize the tumor. Two controls only (plus one revealed button). No dosing control
  and no cytokine chart (Chapter 10 owns the CRS curve). Built on the shared canvas kit (agents.js) with
  the shared kill grammar and the shared MHC-display art. Stage tags: "Not to scale" and "Illustrative"
  (the kill counter is a teaching model).

  SCENE (~50 moving agents): a generic tissue field. Right of center, a cluster of 8 cancer cells. Each
  carries:
  (a) 4–6 surface targets: library antigen() on stalks with the generic CIRCLE head, labeled once "tumor
      surface protein";
  (b) 3–4 MHC class I cups (library mhc1, ≥14 px), each holding a peptide: most self (sand), one per cell
      the tumor peptide (hot pink with glow), labeled once "tumor peptide".
  T cells: ~36 killer T cells and ~6 helper T cells (library tCell in canonical blue / teal), drawn in
  their experienced, tissue-patrolling form (naive T cells never patrol tissue), wandering slowly. Each
  carries a TCR whose tip shows a tcrKey notch (clone identity); notches are drawn from many keys. Exactly
  ONE killer T cell's tcrKey matches the tumor peptide's epitopeKey; give it a subtle halo. CD3 is implied
  on every T cell (not drawn).
  Footnote (always visible, beside the demo): "One matching T cell in about 40 is shown so you can find
  it. In reality, about one T cell in 10,000 to a million matches a given target, usually toward the rare
  end."

  CONTROLS (HTML, under the stage):
  1. Segmented "Engager": "None" | "Antibody-based (e.g., blinatumomab, tarlatamab)" | "TCR-based
     (tebentafusp)".
  2. Toggle "Tumor hides its shop window (class I loss)": when on, the cups are removed from the surface
     using the book's shared "empty window" rendering (absent cups, never empty cups).
  PROGRESSIVE DISCLOSURE: only in TCR-based mode, a small text button appears under the caption: "What if
  the patient has a different HLA type?" Pressing it swaps the cups to a visibly different library mhc1
  pocket variant (tagged "other HLA"); pressing again ("Back to HLA-A*02:01") restores them. Default cups
  carry a tiny "A*02:01" tag only while TCR-based is selected.

  ENGAGER GLYPHS (must be visually distinct from the natural TCR and from Chapter 10's CAR):
  - Antibody-based: library bite() / antibody variant 'bispecific': a small gold antibody with two
    different arms, one tip blue with a tiny "CD3" tag. It caps the circle-headed targets, studding cancer
    cells with engagers.
  - TCR-based: a TCR-shaped head (pale silver-blue) with an anti-CD3 arm. It docks ONLY on cups holding
    the pink peptide, ONLY with HLA-A*02:01 cups, and only while class I is shown.

  BEHAVIOR (shared kill grammar: dock and flatten, granules slide to the contact, target dies by
  shrink-blebs-fragments, killer detaches intact; in the crowd, shrink plus fading specks):
  - None: if class I is shown, only the haloed matching T cell docks on a cancer cell showing the pink
    peptide (recognition ring at the contact), kills it, detaches and moves on. If class I is hidden,
    nobody docks.
  - Antibody-based: any T cell that touches an engager-studded cancer cell is bridged (draw the engager
    spanning both membranes), docks and kills. Many kills in parallel. Hiding class I changes nothing.
  - TCR-based: engagers dock on pink-peptide cups; any T cell touching that cell is bridged and kills.
    Hiding class I, or switching to "other HLA", leaves engagers nothing to dock on: no kills.
  - One counter (HTML, with the "Illustrative" tag beside it): "Cancer cells destroyed: x / 8". Restart
    automatically when the engager or a toggle changes.

  VERBATIM CAPTIONS (aria-live; show the one matching the state):
  - None, class I shown: "Without help, only a T cell whose receptor matches the tumor's displayed peptide can recognize it. Here that is one cell in the crowd."
  - None, class I hidden: "The tumor has closed its shop window. Even the one matching T cell now sees nothing."
  - Antibody-based (either state): "The engager grabs a protein on the cancer cell's surface and CD3 on any T cell it meets. Ordinary T cells become killers, and hiding the shop window does not help the tumor."
  - TCR-based, class I shown, HLA-A*02:01: "Tebentafusp reads the shop window. It sticks only to the gp100 peptide displayed in HLA-A*02:01, then pulls in any passing T cell."
  - TCR-based, class I hidden: "With the shop window closed, tebentafusp has nothing to read. A TCR-based engager cannot see a tumor that has dropped class I."
  - TCR-based, other HLA: "This patient's HLA molecules display different peptides, or display them differently, so tebentafusp finds nothing it recognizes. That is why patients are tested for HLA-A*02:01 first."

  MOBILE: portrait field (~360x420) with ~24 T cells; controls stacked as large segmented buttons.
  REDUCED MOTION: no wandering; show a still of the end state for the chosen settings with the counter.
  ACCURACY NOTES: CD3 is on all T cells, helpers included; engagers do not need the T cell's own receptor
  to match; kills use the T cell's own granules; engagers bind and let go rather than locking; they bridge
  cells that touch and never drag T cells across distances.
alt: A field of wandering T cells and a cluster of cancer cells. Without an engager, only one rare T cell with a matching receptor can recognize the tumor, and none can once the tumor hides its class I molecules. With an antibody-based engager, any T cell that touches a cancer cell is bridged to it and kills, even when class I is hidden. With the TCR-based engager tebentafusp, killing happens only if the tumor displays its peptide in class I and the patient has HLA-A*02:01.
:::

:::deep-dive Field guide: the antibody drugs in this chapter, and some relatives
Brand names in parentheses. "×" joins the two targets of a bispecific engager.

| Drug | Kind | Binds | Used mainly for |
|---|---|---|---|
| Trastuzumab (Herceptin) | Naked: blocks and marks | HER2 | HER2-positive breast cancer |
| Cetuximab (Erbitux) | Naked: blocks | EGFR | Colorectal cancer with normal RAS |
| Rituximab (Rituxan) | Naked: marks | CD20 | B-cell lymphomas |
| Daratumumab (Darzalex) | Naked: marks | CD38 | Multiple myeloma |
| Bevacizumab (Avastin) | Naked: neutralizes a signal | VEGF | Colorectal and other cancers, with chemotherapy |
| Trastuzumab emtansine (Kadcyla) | ADC | HER2 | HER2-positive breast cancer |
| Trastuzumab deruxtecan (Enhertu) | ADC | HER2 | HER2-positive, HER2-low and some HER2-ultralow breast cancers |
| Sacituzumab govitecan (Trodelvy) | ADC | TROP2 | Previously treated triple-negative breast cancer |
| Enfortumab vedotin (Padcev) | ADC | Nectin-4 | Bladder (urothelial) cancer |
| Blinatumomab (Blincyto) | Engager | CD19 × CD3 | B-cell acute lymphoblastic leukemia |
| Teclistamab (Tecvayli), elranatamab (Elrexfio), linvoseltamab (Lynozyfic) | Engagers | BCMA × CD3 | Multiple myeloma |
| Talquetamab (Talvey) | Engager | GPRC5D × CD3 | Multiple myeloma |
| Mosunetuzumab (Lunsumio), epcoritamab (Epkinly), glofitamab (Columvi) | Engagers | CD20 × CD3 | B-cell lymphomas |
| Tarlatamab (Imdelltra) | Engager | DLL3 × CD3 | Small-cell lung cancer |
| Tebentafusp (Kimmtrak) | TCR-based engager | gp100 peptide in HLA-A*02:01 × CD3 | Uveal melanoma |

Sources: US approvals[^17]; ADC targets and uses.[^13] "Triple-negative" breast cancer lacks the hormone receptors and HER2 that other drugs target.

One combination links this chapter to the previous one. In untreated advanced bladder cancer, enfortumab vedotin plus the checkpoint inhibitor pembrolizumab became the first treatment without platinum chemotherapy to outlive it. Median survival was 31.5 months, versus 16.1 with platinum chemotherapy.[^28]
:::

## The price of precision

Most survival gains in this chapter are measured in months, not cures; the largest, such as the myeloma combination above, have come as these drugs moved to earlier treatment. All of them have costs, because almost no target exists *only* on cancer.

The commonest problem is {{on-target-off-tumor|"on-target, off-tumor" toxicity}}: the right protein, hit in the wrong place. The heart uses HER2. In the pivotal trastuzumab trial, 27% of women who received it at the same time as an anthracycline, a heart-straining chemotherapy, developed heart dysfunction, and 16% developed serious heart failure.[^6] That is why the two are no longer given at the same time.[^5] Tebentafusp's rash is the same problem in the skin.

Drugs that deplete cancerous B cells or plasma cells also deplete healthy ones, leaving patients short of antibodies: with teclistamab, 76% of patients had infections and 45% had severe ones.[^21]

Cytokine release syndrome, the signature risk of engagers, is reduced by {{step-up-dosing|step-up dosing}}: teclistamab starts with two small doses before the full one. In its first major trial, 72% of patients had CRS, but fewer than 1% had a severe case.[^21] Engagers can also cause neurological side effects such as confusion, so first doses are given under close observation.

Finally, tumors evolve under treatment ([Chapter 7](07-escape.html)): a therapy aimed at one protein selects for cancer cells that lack it. In myeloma that relapsed after treatment aimed at BCMA or at {{gprc5d|GPRC5D}}, another myeloma protein, some tumor cells had deleted the target gene. Others had mutated the drug's epitope, the precise site it binds, so the protein stayed on the surface but the drug could no longer bind it.[^29] This {{antigen-escape|antigen escape}} is pushing designers toward drugs that hit two different tumor proteins at once.

:::clinic
**Before the drug, the test.** Many antibody drugs come with a test that decides who gets them:

- Breast tumors are scored for HER2. The score now separates candidates for trastuzumab (HER2-positive) from candidates for trastuzumab deruxtecan (HER2-positive, HER2-low and, in some hormone-sensitive cancers, even "HER2-ultralow").[^17]
- Colorectal tumors are tested for RAS mutations before cetuximab.
- Patients with uveal melanoma are tested for their HLA type before tebentafusp.
:::

## From borrowing to building

Naked antibodies borrow the immune system's existing ways of destroying cells. ADCs borrow chemotherapy and give it an address. T-cell engagers borrow the body's most effective killer cells and direct them at a chosen target. The borrowing lasts only as long as the drug: once an engager is cleared, the T cells go back to what they were doing. The next step is to rebuild the T cell itself, giving it a permanent synthetic receptor made from an antibody's variable regions, so that it can multiply and keep attacking on its own. That is the idea behind {{car-t|CAR-T cells}}, the subject of [Chapter 10](10-cell-therapy.html).

:::quiz
Q: A patient's colorectal tumor has a KRAS mutation that locks KRAS in its active state. Why is cetuximab, which blocks EGFR, unlikely to help?
- [ ] Cetuximab cannot reach colorectal tumors through the blood. — It reaches them; patients with normal KRAS clearly benefit.
- [ ] The mutation removes EGFR from the cell surface. — EGFR is still there and still blocked; blocking it no longer matters.
- [x] The divide signal now starts below the receptor. — Mutant KRAS sends the signal on its own, so blocking the receptor changes nothing.
- [ ] The patient's immune system destroys cetuximab before it acts. — The reason is the tumor's signaling pathway, not anti-drug antibodies.

Q: Suppose you removed rituximab's Fc region but kept its Fab arms. It would still bind lymphoma cells. Why would it kill far fewer of them?
- [x] NK cells, complement and macrophages bind the Fc region. — For an antibody that recruits immune cells, the Fc region is the part the immune system recognizes.
- [ ] Without its Fc region the antibody can no longer find CD20 on the cell. — The variable regions bind CD20, so it still binds.
- [ ] The Fc region carries a built-in toxin that kills the cell. — Rituximab carries no toxin; its Fc region recruits the immune system.
- [ ] The Fc region is what blocks CD20's growth signal. — Blocking, where it happens, is done by the variable regions; the Fc region's job is to be bound.

Q: Plain trastuzumab does not help "HER2-low" breast cancers, but trastuzumab deruxtecan can. What best explains the difference?
- [ ] HER2-low tumors secretly depend on HER2 signaling. — If they did, plain trastuzumab would help.
- [ ] T-DXd blocks HER2 signaling more strongly than trastuzumab does. — Its antibody part is trastuzumab; blocking is not the point.
- [ ] T-DXd works without binding HER2. — It still needs HER2 to get into the cells.
- [x] For an ADC, HER2 only has to be an address that lets the drug in. — A little HER2 is enough to deliver the payload, which can also spread to neighbors.

Q: A tumor has lost all MHC class I, so it no longer displays peptides to T cells. Which treatment could still direct T cells to kill it?
- [ ] Tebentafusp, the TCR-based engager approved for uveal melanoma. — It reads a peptide displayed in class I, so a tumor without class I is invisible to it.
- [x] An engager linking CD3 to a protein on the tumor's surface. — It never looks at class I, so T cells can be bridged to the tumor anyway.
- [ ] A checkpoint inhibitor that releases the brakes on the tumor's own T cells. — Freed T cells still need to see a peptide in class I.
- [ ] Waiting for the rare T cell whose receptor matches. — Without class I, that T cell has nothing to recognize.
:::

:::takeaways
- Monoclonal antibodies became possible in 1975, when B cells were fused with immortal myeloma cells to make hybridomas, cell lines that produce one antibody indefinitely.
- Mouse antibodies provoke immune reactions, so engineers replaced mouse parts step by step: chimeric (-xi-, mouse variable regions on human constant regions), humanized (-zu-, only the mouse CDR loops left), then fully human (-u-). Newer names drop the source letters, and antibodies named under the rules adopted in late 2021 no longer end in -mab at all.
- Naked antibodies block growth signals (trastuzumab, cetuximab), mark cells for destruction through their Fc regions (rituximab), or bind and neutralize signals that feed tumors (bevacizumab). Blocking works only if the cancer still depends on that signal, which is why cetuximab fails against KRAS-mutant colorectal cancer.
- Antibody–drug conjugates use the antibody as an address for a potent payload, held by a linker until the drug is inside the cell. A payload that crosses membranes reaches neighboring cells, which likely helps explain why trastuzumab deruxtecan works in "HER2-low" breast cancer.
- T-cell engagers bridge T cells to cancer cells through CD3, bypassing receptor matching and MHC class I. They have changed treatment for several blood cancers and, more recently, small-cell lung cancer, but can trigger cytokine release syndrome. Tebentafusp reads a peptide in HLA-A*02:01, so it works only for patients with that HLA type.
- Almost no target is unique to cancer. Side effects often come from hitting the right protein in the wrong place, tumors can escape by losing or mutating the target, and most gains are still measured in months.
:::

## Glossary
- antibody | Antibody | A Y-shaped protein made by B cells. The variable regions at the ends of its two Fab arms bind one specific molecular shape, and its stem, the Fc region, is bound by receptors on immune cells and by complement.
- protein | Protein | A molecular machine built from a chain of amino acids folded into a precise shape. Most of a cell's work, including recognition, is done by proteins.
- checkpoint | Immune checkpoint | A built-in "brake" on T cells, such as PD-1 or CTLA-4. Checkpoint inhibitors are antibodies that block these brakes or their partners, such as PD-L1.
- b-cell | B cell | An immune cell that carries antibody-like receptors on its surface and, when activated, produces antibodies.
- myeloma | Myeloma (multiple myeloma) | A cancer of plasma cells, the cells that secrete antibodies, that grows mainly in the bone marrow.
- plasma-cell | Plasma cell | A fully matured B cell that secretes large amounts of a single antibody.
- hybridoma | Hybridoma | A hybrid cell made by fusing an antibody-producing B cell with an immortal myeloma cell. It makes one antibody and keeps dividing indefinitely.
- monoclonal-antibody | Monoclonal antibody | An antibody made by a population of identical cells descended from a single cell, so every molecule is the same. Drug names have traditionally ended in -mab.
- immune-system | Immune system | The body's network of cells, tissues and molecules that detects and eliminates threats while sparing healthy tissue.
- anti-drug-antibody | Anti-drug antibodies | Antibodies a patient makes against a protein drug. They can neutralize the drug, speed its removal or cause allergic reactions.
- cdr | Complementarity-determining regions (CDRs) | The six short loops at the end of each antibody arm, three from the heavy chain's variable region and three from the light chain's, that contact the target. They differ most from one antibody to the next; a humanized antibody keeps only the mouse CDRs.
- chimeric-antibody | Chimeric antibody | An engineered antibody in which the mouse's entire variable regions are joined to human constant regions. Classic names contain -xi-, as in rituximab.
- humanized-antibody | Humanized antibody | An engineered antibody in which only the mouse's six target-contacting loops (the CDRs), plus a few supporting amino acids, are grafted onto a human antibody. Classic names contain -zu-, as in trastuzumab.
- phage-display | Phage display | A technique that displays huge libraries of antibody fragments on viruses that infect bacteria (phages), so binders to a target can be fished out and their genes recovered. Its pioneers, George Smith and Greg Winter, shared in the 2018 Nobel Prize in Chemistry.
- receptor | Receptor | A protein, often spanning the cell membrane, that recognizes a specific signal molecule and relays a message into the cell.
- gene | Gene | A stretch of DNA that holds the instructions for making a protein.
- her2 | HER2 | A growth-signal receptor on cell surfaces. Its gene is amplified in about 15–20% of breast cancers ("HER2-positive"); many more carry low levels ("HER2-low").
- chemotherapy | Chemotherapy | Drugs that kill rapidly dividing cells, cancerous or not, usually by damaging DNA or disrupting the process of cell division.
- metastasis | Metastasis | The spread of cancer cells from where the tumor began to distant organs, where they form new tumors. "Metastatic" cancer has spread this way.
- egfr | EGFR (epidermal growth factor receptor) | A growth-signal receptor related to HER2. It is the target of cetuximab and panitumumab.
- kras | KRAS | A relay protein just inside the cell membrane that passes growth signals from receptors like EGFR toward the nucleus. Mutations can lock it in its active state, so it signals without input from the receptor.
- mutation | Mutation | A change in the DNA sequence. In a gene, it can alter the protein that gene encodes.
- naked-antibody | Naked antibody | An antibody drug with nothing attached. It works by blocking its target, marking cells for immune attack through its Fc region, or binding and neutralizing a signaling molecule.
- fc-region | Fc region | The stem of the antibody's Y, formed by the lower parts of the two heavy chains' constant regions. Fc receptors on immune cells and complement proteins bind it, and its binding to the recycling receptor FcRn controls how long the antibody lasts in the blood.
- cd20 | CD20 | A protein on the surface of nearly all B cells, but not on the blood-forming cells that make them or on plasma cells. It is the target of rituximab and several engagers.
- lymphoma | Lymphoma | A cancer of lymphocytes (often B cells) that typically grows in lymph nodes and other lymphoid tissues.
- nk-cell | NK cell (natural killer cell) | An innate immune killer cell. It can recognize and destroy antibody-coated cells by binding the antibodies' Fc regions with its Fc receptors.
- adcc | ADCC (antibody-dependent cellular cytotoxicity) | Killing of an antibody-coated cell by an immune cell, usually an NK cell, that binds the antibodies' Fc regions with its Fc receptors.
- complement | Complement | A set of blood proteins that, once triggered (for example by antibody Fc regions clustered on a cell), set off a cascade that forms pores in the target's membrane and opsonizes it for phagocytes.
- cdc | CDC (complement-dependent cytotoxicity) | Killing of an antibody-coated cell by complement: proteins activated by the antibodies' clustered Fc regions assemble pores in the cell's membrane.
- macrophage | Macrophage | A large immune cell that engulfs (phagocytoses) microbes, debris and opsonized cells.
- adcp | ADCP (antibody-dependent cellular phagocytosis) | Engulfment of an antibody-coated cell by a macrophage or other phagocyte that binds the antibodies' Fc regions with its Fc receptors.
- bone-marrow | Bone marrow | The soft tissue inside bones where blood and immune cells, including B cells, are made.
- vegf | VEGF (vascular endothelial growth factor) | A signaling protein that makes blood vessels sprout new branches. Tumors release it to build their blood supply.
- tnf | Tumor necrosis factor (TNF) | An inflammatory cytokine released by T cells and macrophages that activates blood vessels and immune cells and can kill some tumor cells.
- adc | ADC (antibody–drug conjugate) | An antibody chemically linked to a potent drug (payload). The antibody delivers the drug to cells carrying its target.
- linker | Linker | The chemical tether that attaches an ADC's payload to its antibody. It is designed to hold in the blood and release the drug inside target cells.
- payload | Payload | The cytotoxic drug carried by an ADC, usually too potent to be given on its own.
- internalization | Internalization | A cell's uptake of part of its own surface membrane, along with anything bound to it, into a vesicle inside the cell.
- lysosome | Lysosome | A cell's acidic compartment filled with degrading enzymes, where material the cell has taken up is broken down.
- bystander-effect | Bystander effect | Killing of neighboring cells by an ADC payload that leaks out of the targeted cell, which can reach cancer cells lacking the target.
- interstitial-lung-disease | Interstitial lung disease (pneumonitis) | Inflammation and scarring of the lung tissue around the air sacs. It is a known, sometimes serious side effect of trastuzumab deruxtecan.
- drug-to-antibody-ratio | Drug-to-antibody ratio (DAR) | The average number of payload molecules attached to each antibody in an ADC.
- t-cell | T cell | An adaptive immune cell that recognizes peptide fragments displayed on MHC via its T-cell receptor. Killer (CD8) T cells destroy infected or cancerous cells.
- tcr | T-cell receptor (TCR) | The unique receptor on each T cell. It recognizes a specific peptide displayed in a specific MHC (HLA) molecule.
- peptide | Peptide | A short chain of amino acids, such as the protein fragments displayed in MHC molecules.
- mhc-class-i | MHC class I | A molecule on nearly every cell that displays peptide fragments of the proteins the cell is making inside (nicknamed the "shop window").
- bispecific-antibody | Bispecific antibody | An engineered antibody with two different binding specificities, for example one arm for a tumor protein and one for a T cell.
- t-cell-engager | T-cell engager | A bispecific molecule that binds CD3 on T cells and a target on another cell, bridging them so the T cell kills the target.
- cd3 | CD3 | The set of signaling chains attached to the T-cell receptor on every T cell. It transmits the activating signal into the cell when the receptor binds its target. Engagers bind it to activate T cells.
- cytokine | Cytokine | A small signaling protein that immune cells use to communicate with one another.
- crs | Cytokine release syndrome (CRS) | A body-wide reaction to the mass activation of immune cells, with fever, low blood pressure and sometimes low oxygen or organ damage.
- cd19 | CD19 | A protein on the surface of B cells and most B-cell leukemias and lymphomas. It is the target of blinatumomab and many CAR-T therapies.
- leukemia | Leukemia | A cancer of blood-forming cells that fills the bone marrow and blood. Acute lymphoblastic leukemia (ALL) arises from immature lymphocytes, often B-cell precursors.
- bcma | BCMA (B-cell maturation antigen) | A surface protein on plasma cells and myeloma cells. It is the target of several engagers and CAR-T therapies.
- dll3 | DLL3 | A protein displayed on the surface of many small-cell lung cancers. It is the target of tarlatamab.
- hla | HLA (human leukocyte antigen) | The human version of MHC. HLA types differ between people, and a TCR-based drug may work only with one specific type, such as HLA-A*02:01.
- half-life | Half-life | The time it takes for the amount of a drug in the body to fall by half.
- on-target-off-tumor | On-target, off-tumor toxicity | Side effects caused when a targeted drug hits its intended protein on healthy tissue.
- step-up-dosing | Step-up dosing | Starting a drug at small doses and increasing in steps, which reduces the risk of cytokine release syndrome.
- gprc5d | GPRC5D | A surface protein on myeloma cells that is also found in a few healthy tissues, such as hair follicles. It is the target of talquetamab.
- epitope | Epitope | The exact patch on a target molecule that an antibody's variable regions bind.
- antigen-escape | Antigen escape | Relapse driven by cancer cells that have lost, or changed, the target a therapy was aimed at.
- car-t | CAR-T cell | A T cell, usually the patient's own, engineered to carry a chimeric antigen receptor: a synthetic receptor built from an antibody's variable regions and T-cell signaling domains.

## Sources
1. Crescioli S, Kaplon H, Chenoweth A, et al. Antibodies to watch in 2026. *mAbs* 2026;18:2614669. doi:10.1080/19420862.2026.2614669
2. Köhler G, Milstein C. Continuous cultures of fused cells secreting antibody of predefined specificity. *Nature* 1975;256:495–497. doi:10.1038/256495a0
3. Lu RM, Hwang YC, Liu IJ, et al. Development of therapeutic antibodies for the treatment of diseases. *J Biomed Sci* 2020;27:1. doi:10.1186/s12929-019-0592-z
4. Guimaraes Koch SS, Thorpe R, Kawasaki N, et al. International nonproprietary names for monoclonal antibodies: an evolving nomenclature system. *mAbs* 2022;14:2075078. doi:10.1080/19420862.2022.2075078
5. Loibl S, Gianni L. HER2-positive breast cancer. *Lancet* 2017;389:2415–2429. doi:10.1016/S0140-6736(16)32417-5
6. Slamon DJ, Leyland-Jones B, Shak S, et al. Use of chemotherapy plus a monoclonal antibody against HER2 for metastatic breast cancer that overexpresses HER2. *N Engl J Med* 2001;344:783–792. doi:10.1056/NEJM200103153441101
7. Karapetis CS, Khambata-Ford S, Jonker DJ, et al. K-ras mutations and benefit from cetuximab in advanced colorectal cancer. *N Engl J Med* 2008;359:1757–1765. doi:10.1056/NEJMoa0804385
8. Weiner GJ. Rituximab: mechanism of action. *Semin Hematol* 2010;47:115–123. doi:10.1053/j.seminhematol.2010.01.011
9. US Food and Drug Administration. Prescribing information: RITUXAN (rituximab), BLA 103705 (CD20 distribution; B-cell recovery); BLINCYTO (blinatumomab), BLA 125557 (half-life; continuous infusion). Drugs@FDA, accessed October 2026.
10. Coiffier B, Lepage E, Briere J, et al. CHOP chemotherapy plus rituximab compared with CHOP alone in elderly patients with diffuse large-B-cell lymphoma. *N Engl J Med* 2002;346:235–242. doi:10.1056/NEJMoa011795
11. Hurwitz H, Fehrenbacher L, Novotny W, et al. Bevacizumab plus irinotecan, fluorouracil, and leucovorin for metastatic colorectal cancer. *N Engl J Med* 2004;350:2335–2342. doi:10.1056/NEJMoa032691
12. Clynes RA, Towers TL, Presta LG, Ravetch JV. Inhibitory Fc receptors modulate in vivo cytotoxicity against tumor targets. *Nat Med* 2000;6:443–446. doi:10.1038/74704
13. Drago JZ, Modi S, Chandarlapaty S. Unlocking the potential of antibody–drug conjugates for cancer therapy. *Nat Rev Clin Oncol* 2021;18:327–344. doi:10.1038/s41571-021-00470-8
14. Ogitani Y, Hagihara K, Oitate M, Naito H, Agatsuma T. Bystander killing effect of DS-8201a, a novel anti-human epidermal growth factor receptor 2 antibody–drug conjugate, in tumors with human epidermal growth factor receptor 2 heterogeneity. *Cancer Sci* 2016;107:1039–1046. doi:10.1111/cas.12966
15. Cortés J, Kim SB, Chung WP, et al. Trastuzumab deruxtecan versus trastuzumab emtansine for breast cancer. *N Engl J Med* 2022;386:1143–1154. doi:10.1056/NEJMoa2115022 [DESTINY-Breast03]
16. Modi S, Jacot W, Yamashita T, et al. Trastuzumab deruxtecan in previously treated HER2-low advanced breast cancer. *N Engl J Med* 2022;387:9–20. doi:10.1056/NEJMoa2203690 [DESTINY-Breast04]
17. US Food and Drug Administration. Oncology (cancer) and hematologic malignancies approval notifications and Drugs@FDA records for the drugs in this chapter, accessed October 2026. Dates cited in the text: blinatumomab (accelerated approval, December 2014); tebentafusp-tebn (January 2022); fam-trastuzumab deruxtecan for HER2-low breast cancer (August 2022) and for HR-positive HER2-low or HER2-ultralow breast cancer after endocrine therapy (January 2025); tarlatamab-dlle (accelerated approval, May 2024; traditional approval, November 2025); teclistamab with daratumumab and hyaluronidase-fihj (March 2026; overall survival HR 0.46).
18. Goebeler ME, Bargou RC. T cell-engaging therapies — BiTEs and beyond. *Nat Rev Clin Oncol* 2020;17:418–434. doi:10.1038/s41571-020-0347-5
19. Dreier T, Lorenczewski G, Brandl C, et al. Extremely potent, rapid and costimulation-independent cytotoxic T-cell response against lymphoma cells catalyzed by a single-chain bispecific antibody. *Int J Cancer* 2002;100:690–697. doi:10.1002/ijc.10557
20. Kantarjian H, Stein A, Gökbuget N, et al. Blinatumomab versus chemotherapy for advanced acute lymphoblastic leukemia. *N Engl J Med* 2017;376:836–847. doi:10.1056/NEJMoa1609783 [TOWER]
21. Moreau P, Garfall AL, van de Donk NWCJ, et al. Teclistamab in relapsed or refractory multiple myeloma. *N Engl J Med* 2022;387:495–505. doi:10.1056/NEJMoa2203478 [MajesTEC-1]
22. Costa LJ, Bahlis NJ, Perrot A, et al. Teclistamab plus daratumumab in relapsed or refractory multiple myeloma. *N Engl J Med* 2026;394:739–752. doi:10.1056/NEJMoa2514663 [MajesTEC-3]
23. Burr ML, Sparbier CE, Chan KL, et al. An evolutionarily conserved function of polycomb silences the MHC class I antigen presentation pathway and enables immune evasion in cancer. *Cancer Cell* 2019;36:385–401.e8. doi:10.1016/j.ccell.2019.08.008
24. Mountzios G, Sun L, Cho BC, et al. Tarlatamab in small-cell lung cancer after platinum-based chemotherapy. *N Engl J Med* 2025;393:349–361. doi:10.1056/NEJMoa2502099 [DeLLphi-304]
25. Amgen. Press release: phase 3 DeLLphi-305 trial of tarlatamab plus durvalumab as first-line maintenance in extensive-stage small-cell lung cancer met its primary endpoint of overall survival at a prespecified interim analysis. 8 September 2026 (company-reported; ClinicalTrials.gov NCT06211036).
26. Ahn MJ, Cho BC, Felip E, et al. Tarlatamab for patients with previously treated small-cell lung cancer. *N Engl J Med* 2023;389:2063–2075. doi:10.1056/NEJMoa2307980 [DeLLphi-301]
27. Nathan P, Hassel JC, Rutkowski P, et al. Overall survival benefit with tebentafusp in metastatic uveal melanoma. *N Engl J Med* 2021;385:1196–1206. doi:10.1056/NEJMoa2103485 [IMCgp100-202]
28. Powles T, Valderrama BP, Gupta S, et al. Enfortumab vedotin and pembrolizumab in untreated advanced urothelial cancer. *N Engl J Med* 2024;390:875–888. doi:10.1056/NEJMoa2312117 [EV-302]
29. Lee H, Ahn S, Maity R, et al. Mechanisms of antigen escape from BCMA- or GPRC5D-targeted immunotherapies in multiple myeloma. *Nat Med* 2023;29:2295–2306. doi:10.1038/s41591-023-02491-5
30. Keane J, Gershon S, Wise RP, et al. Tuberculosis associated with infliximab, a tumor necrosis factor α-neutralizing agent. *N Engl J Med* 2001;345:1098–1104. doi:10.1056/NEJMoa011110
31. Hudis CA. Trastuzumab — mechanism of action and use in clinical practice. *N Engl J Med* 2007;357:39–51. doi:10.1056/NEJMra043186
