---
id: 12-frontier
title: Resistance and New Directions
subtitle: Why immunotherapy cures some people and does nothing for others, and what researchers are trying next.
part: III
reading_time: 27
hero: ch12-hero
coda: The guide began with molecules that recognize each other by contact and ends with medicines that release the immune system's brakes, redirect it, rebuild its cells and give it new targets. All of them depend on that same act of recognition, and each falls short where a cancer looks too much like self. Today about one in five people with advanced cancer responds to checkpoint drugs, and most attempts to raise that share are still in clinical trials.
---

In 2022, oncologists at Memorial Sloan Kettering Cancer Center in New York reported an unusual result. Twelve people with a rare type of rectal cancer — {{msi-high|mismatch-repair deficient (MSI-high)}}, so heavily mutated that T cells recognize it unusually easily ([Chapter 6](06-cancer.html)) — received six months of dostarlimab (Jemperli), an antibody that blocks the {{pd-1|PD-1}} brake ([Chapter 8](08-checkpoints.html)). In all twelve who had completed treatment, the tumor disappeared from scans, endoscopy and biopsies.[^1] None needed the radiation, chemotherapy and surgery that normally follow, which can leave people with a colostomy bag, infertility, or lasting bowel and sexual problems.

The broader picture (Chapter 8) is less encouraging. In 2023, about 57% of Americans with advanced cancer were eligible for a {{checkpoint-inhibitor|checkpoint inhibitor}}, but only about 20% of all those patients, roughly a third of the eligible, were expected to respond, meaning that their tumors shrank substantially. A response is not a cure.[^2]

Twelve out of twelve against one in five is not a fair comparison, since those tumors were unusually visible and caught early, but the gap is the subject of this last chapter: why immunotherapy cures some people and not others, and what is being done about it.

## A loop with seven links

In the {{cancer-immunity-cycle|cancer-immunity cycle}} of [Chapter 7](07-escape.html), dying cancer cells release antigens (1, release); {{dendritic-cell|dendritic cells}} take them up (2, presentation) and carry them to a {{lymph-node|lymph node}}, where they prime matching T cells (3, priming); the T cells travel through the blood (4, trafficking), enter the tumor (5, infiltration), recognize cancer cells (6, recognition) and kill them (7, killing), which releases more antigen and starts the cycle again.

PD-1 blockers, the most widely used checkpoint inhibitors, act mainly at the end of the cycle, releasing the brake on killer T cells that already recognize the tumor. They also keep the attack supplied (Chapter 8): a reserve of {{stem-like-t-cell|stem-like T cells}} in the tumor, its lymph nodes and the blood keeps producing new killer T cells, often from clones not previously seen in the tumor. ({{ctla-4|CTLA-4}} blockers act mainly earlier, at priming.) A PD-1 blocker can strengthen priming a little, but it cannot create an attack from nothing. If an earlier link is badly broken — too few antigens to recognize, too few T cells primed, T cells stuck outside the tumor — releasing the brake achieves little. Links are rarely all-or-nothing, though, and a weak one can sometimes be offset by strengthening another.

Resistance takes two forms. In {{primary-resistance|primary resistance}} the tumor never responds; in {{acquired-resistance|acquired resistance}} it shrinks, sometimes for years, and then grows back. In melanoma, about three in four responses to PD-1 blockade last; the rest eventually relapse.[^3]

## How tumors resist

Chapter 7 described the escape routes, among them barriers, suppressor cells, loss of {{b2m|B2M}} and loss of {{jak|JAK1 or JAK2}}. B2M is the small protein without which {{mhc-class-i|MHC class I}} cannot reach the cell surface; JAK1 and JAK2 relay the signal of {{ifn-gamma|interferon-gamma (IFN-γ)}} from its receptor into the cell, so losing either leaves cancer cells unresponsive to it. It also described four melanomas that regrew on PD-1 blockade: two had lost JAK1 or JAK2, and one B2M.[^3] Larger studies have since added four lessons.

**Lost neoantigens had been real targets.** In a handful of lung cancers that regrew after checkpoint therapy, the resistant cells had lost 7 to 18 {{neoantigen|neoantigens}} each. When researchers synthesized the missing peptides and exposed the same patients' T cells to them in the lab, the T cells expanded.[^4] This is {{immunoediting|immunoediting}} under the drug: cells that present these neoantigens are killed, and cells that have lost them regrow the tumor.

**Losing MHC class I is common, but not always decisive.** In melanoma, about 30% of non-responders' tumors had lost one of their two copies of the B2M gene, against about 10% of responders'.[^5] Yet in mismatch-repair-deficient cancers, 20 of 21 tumors that had lost B2M still responded to checkpoint blockade. The likely reason is {{gamma-delta-t-cell|γδ (gamma-delta) T cells}}, a minor subset of T cells whose receptors are built from two chains, γ and δ, that differ from those of conventional T cells. They recognize stressed cells without needing MHC class I, and they express PD-1 too, so the drugs release their brake as well.[^6]

**Some resistance comes from {{driver-mutation|driver mutations}}, the mutations that make a cell cancerous.** Lung cancers that have lost a gene called STK11 respond poorly to PD-1 blockade even when they carry many mutations, and melanomas that lose the tumor suppressor PTEN resist T-cell infiltration ([Chapter 7](07-escape.html)).[^7][^8]

**The patient matters too.** People inherit two versions, or {{allele|alleles}}, of each {{hla|HLA}} gene, one from each parent, and these determine which peptides their cells can present. Among 1,535 patients treated with checkpoint inhibitors, those whose two alleles differed at every HLA class I gene survived longer than those with an identical pair at one or more, plausibly because two different alleles present a wider range of peptides.[^9] Gut bacteria and some medicines also matter.

:::figure ch12-resistance
title: Where the cycle breaks
goal: After using this, the reader understands that "resistance" is a family of distinct failures, each breaking a specific step of the cancer-immunity cycle, and that releasing the PD-1 brake mainly repairs one of them.
kind: explorer
stage: dark
spec: |
  ROLE (FIGURE-AUDIT §2B). This figure DIAGNOSES; it never prescribes (ch12-combinations is the book's only
  prescribing figure). It is led by its vignette; the wheel is a compact locator. The reader picks one of SEVEN
  resistance mechanisms (matching the main text and Chapter 7's escape routes); the locator wheel shows which step(s)
  it breaks, the vignette shows what happens at cell level, and one "Add anti-PD-1" switch shows whether releasing the
  brake helps.

  SHARED MODULES. Wheel = shared/cycle-wheel.js, density 'locator' (no tour, no bands text, flow on). Chip titles,
  subtitles, step states and badge strings come from shared/cycle-data.js MECHANISMS — the single source; this spec's
  strings below are the ones that module must hold. The T-cell activity meter (vignette 6) is shared/activity-meter.js
  with the "Illustrative" tag. Cells, PD-1/PD-L1, interferon and kill animations follow FIGURE-AUDIT §4 exactly.

  LAYOUT — DESKTOP (stage max-width ~960px, aspect ~16:10):
  - Left ~40%: the locator wheel (step numbers + one-word labels: 1 Release, 2 Presentation, 3 Priming,
    4 Trafficking, 5 Infiltration, 6 Recognition, 7 Killing).
  - Right ~60%: THE VIGNETTE (4:3 dark panel). Directly under it: the switch "Add anti-PD-1" and the OUTCOME BADGE.
  - Under both: CAPTION area (aria-live="polite") with the verbatim caption for the selected chip (see steps).
  - Bottom: SEVEN CHIPS as a radiogroup (4 + 3 grid), each with title, subtitle and its mechanism icon.

  CHIPS (title — subtitle — wheel states):
  1. Brake on — "PD-L1 switches T cells off" — step 7 broken. Selected on load.
  2. Nothing new to see — "Few neoantigens, or lost ones" — steps 1 and 6 broken.
  3. Shop window shut — "B2M loss: no MHC class I" — step 6 broken.
  4. Deaf to the alarm — "JAK1/2 loss: interferon-gamma ignored" — steps 6 and 7 broken.
  5. Excluded — "Stroma keeps T cells at the edge" — step 5 broken, step 4 weak.
  6. No scouts, corrupt guards — "Too little priming; suppressive cells" — steps 2 and 3 broken, step 7 weak.
  7. Host factors — "HLA genes, gut microbes, medicines" — no single node breaks; wheel halo({ dense:[2,3],
     faint:[6] }).

  WHEEL: broken = crimson ⊣ and outline; weak = dashed crimson outline + the word "weak"; flow dots stop before the
  first broken step; center text "Stalled at step N: <name>".
  ANTI-PD-1 SWITCH: resets to OFF on every chip change. When ON: gold therapeutic antibodies (white outline) cap PD-1
  on T cells only; on the wheel, a full gold ring marks steps 6–7 and a thin ring marks step 3 ("also acts here"),
  as in cycle-data THERAPIES. OUTCOME BADGE (foundation badge vocabulary ✓ ≈ ✕ ~; icon + words, never color alone):
  1 "✓ Fixed — the T cell kills" (step 7 un-breaks; flow resumes)
  2 "✕ Not fixed — little to recognize"
  3 "✕ Usually not fixed — killer T cells can't see the cell (other immune cells sometimes can)"
  4 "✕ Usually not fixed — the tumor ignores the alarm"
  5 "✕ Not fixed — T cells still can't get in"
  6 "≈ A little help at most — too few T cells primed, and other suppressors remain" (dashed step-7 ring brightens
    a little; meter rises to about half)
  7 "~ Varies from person to person"

  VIGNETTES (reduced motion = final frame):
  1 Brake on (6–8 s loop): a blue killer T cell docks on a violet cancer cell whose MHC class I cups hold glowing pink
    neo-peptides. TCR meets MHC head to head → recognition ring + green-cyan "+" disc. PD-1 (crimson stalk, socket
    head, on the T cell) locks with PD-L1 (light crimson plug, on the cancer cell) → one crimson "−" disc on the T-cell
    side; granules stay dim; the T cell lets go. With anti-PD-1: gold antibodies cap PD-1; granules slide to the
    contact; the cancer cell dies by the shared kill grammar (shrink, blebs, fragments); the T cell detaches intact.
  2 Nothing new to see (a short NON-LOOPING sequence, ~6 s, with a Replay button): 8 cancer cells, 5 with pink
    neo-peptides and 3 with sand self-peptides only (those 3 also carry a hatch, so the difference is not color-only).
    T cells kill the 5; the 3 survivors divide and refill the cluster. Counter: "cells showing a typo: 5 → 0".
  3 Shop window shut: a cancer cell's MHC cups sink away until NONE remain on the surface (use the book's shared
    "empty window" rendering: absent cups, never empty cups). Label: "no B2M → no MHC class I on the surface". A blue
    killer T cell scans, finds nothing, drifts off. Secondary button "Who else could see it?": an orange NK cell
    arrives, a missing-self ✓ check appears (Chapter 2), and it kills by the same kill grammar in orange. Line under
    the button (verbatim): "NK cells and some unconventional T cells can attack cells that lack MHC class I."
  4 Deaf to the alarm: two halves. "Before": the T cell releases interferon-gamma as small HOLLOW BLUE RINGS (§4 rule
    12) that bind a forked receptor; two beads under the membrane (JAK1, JAK2) light up; a signal arrow reaches the
    nucleus; more MHC cups and PD-L1 plugs appear. "After relapse": JAK beads grey, crossed by ⊣; rings bind but
    nothing lights and no new cups appear.
  5 Excluded: must look like ch07-tme "Excluded" — the same fibroblast ring and collagen lines around a violet nest,
    a faint haze labelled "TGF-β". Blue T cells exit a vessel and wander inside the ring, never entering the nest.
    With anti-PD-1: antibodies cap PD-1; T cells stay in the ring.
  6 No scouts, corrupt guards: split panel. Left half must look like ch07-tme "Desert" (empty field; one immature,
    rounded green dendritic cell far from a few dying cancer cells; inset lymph-node icon "few tumor-specific T
    cells"). Right half: a T cell docked on a cancer cell amid olive MDSCs, tumor-associated macrophages
    (macrophage variant 'tam') and a Treg, with a soft grey-violet haze ("suppressive signals"); activity meter low
    (Illustrative). With anti-PD-1: left unchanged; meter rises to about half and holds.
  7 Host factors: a STATIC icon trio with one-line labels — "HLA genes" (two pairs of cups: one varied, one
    identical), "Gut microbes" (chartreuse rods), "Medicines" (capsule) — each with an arrow to a lymph-node icon.

  SCIENCE GUARDRAILS: the antibody never kills; in B2M loss, MHC class I is ABSENT from the surface; killer (CD8) T
  cells cannot recognize cells lacking MHC class I, while NK cells (and γδ T cells) can; interferon-gamma comes from the T
  cell; vignette 5 (excluded: T cells present but stuck) must look different from vignette 6 left (desert: few
  tumor-specific T cells at all); nothing flashes; no faces or eyes on cells.
  MOBILE (<640px): locator wheel (~min(60vw, 240px)) beside the switch + badge; vignette full width (4:3) below;
  caption; chips as a 2-column grid (Host factors full width).
  ACCESSIBILITY: chips = role="radiogroup"; switch = role="switch"; badge text is announced after each change.
steps:
  1. The T cell has found its target, but PD-L1 on the cancer cell binds PD-1, which inhibits the T cell. PD-1 blockers were designed for this problem; try adding anti-PD-1.
  2. Some tumors have few mutations and so few neoantigens to present; others lose the neoantigens T cells were attacking, and the cells without them regrow the tumor. Releasing the brake cannot help T cells that have nothing to recognize.
  3. Without B2M, MHC class I never reaches the surface, so killer T cells cannot recognize the cell at all. NK cells, which attack cells lacking MHC class I, and γδ T cells sometimes still can.
  4. T cells secrete interferon-gamma (IFN-γ), which signals the cancer cell to express more MHC and stop dividing. Without JAK1 or JAK2, IFN-γ still binds its receptor, but the signal is not relayed into the cell.
  5. In an excluded tumor, T cells arrive but stay in the stroma, a ring of fibroblasts and collagen around the cancer cells, held there partly by TGF-β. Releasing the brake does not get them through.
  6. Without activated dendritic cells, too few T cells are primed in the first place, and where suppressor cells crowd the tumor, they inhibit T cells by mechanisms unrelated to PD-1. Releasing one brake helps a little at most.
  7. Some resistance lies with the person rather than the tumor: the HLA alleles they inherited, their gut bacteria and the medicines they take. These affect how well T cells are primed and what the tumor can present.
alt: A small wheel shows the seven steps of the cancer-immunity cycle beside a close-up scene. Choosing a resistance mechanism — such as loss of MHC class I, loss of interferon signaling, T cells excluded by stroma, or too little priming — marks the step it breaks and shows it at cell level. Adding an anti-PD-1 antibody fixes the case where the PD-L1 brake is the main problem, but helps little or not at all in the others.
:::

:::key-idea
"Immunotherapy didn't work" covers many different failures, each a broken link somewhere in the seven-step cycle. Releasing the PD-1 brake mainly repairs the last link, with some help at priming.
:::

:::deep-dive Resistance, molecule by molecule
Biologists add a third category to primary and acquired resistance: **{{adaptive-resistance|adaptive resistance}}**, in which the tumor raises PD-L1 as soon as it is attacked, in response to IFN-γ from the T cells ([Chapter 7](07-escape.html)). This helps explain why JAK loss is so damaging. A tumor that has lost IFN-γ signaling cannot raise PD-L1 either, so PD-1 blockade has little to release, and the tumor also no longer responds to IFN-γ's signal to express more MHC and stop dividing. In the relapsed melanomas, JAK1 or JAK2 had taken two hits, as with the tumor-suppressor genes of [Chapter 6](06-cancer.html): a damaging mutation in one copy and loss of the other, healthy copy, an event called loss of heterozygosity.[^3]

B2M shows a similar pattern. Losing one copy was about three times more common in melanoma non-responders, and losing *both* copies was seen only in non-responders.[^5] Tumors can also delete one of their two inherited sets of HLA genes (HLA loss of heterozygosity), narrowing the range of peptides they can present; this, too, was linked to worse outcomes.[^9] The γδ exception was found in mismatch-repair-deficient tumors, which are crowded with neoantigens and immune cells; the γδ T cells there became more numerous after checkpoint blockade.[^6] Whether γδ T cells play the same role in other cancers is unknown.
:::

## Turning cold tumors hot

Many tumors that do not respond to checkpoint inhibitors are {{cold-tumor|cold}}, with few or no T cells inside. One strategy is to make cancer cells die the way infected cells do, releasing antigens together with danger signals ({{immunogenic-cell-death|immunogenic cell death}}).

**Radiation and chemotherapy** kill cancer cells and, in mice, can trigger interferon responses. Very occasionally, irradiating one tumor makes distant ones shrink too, the *abscopal effect*, documented mostly in individual case reports.[^10] The proven combinations are more ordinary: chemotherapy plus a PD-1 blocker is a standard first treatment for many lung cancers, and in stage III lung cancer an anti-PD-L1 antibody given after chemoradiation raised five-year survival from about 33% to 43%,[^11] though how much of that benefit comes through the immune system is debated.

**Viruses and synthetic danger signals.** {{oncolytic-virus|Oncolytic viruses}} infect and lyse (burst) cancer cells, but adding one to pembrolizumab (Keytruda) did not extend survival in a large melanoma trial ([Chapter 11](11-vaccines.html)). {{sting|STING}} relays the signal in the cGAS–STING pathway of [Chapter 2](02-innate.html), which detects DNA free in the cytoplasm (the cell's interior outside the nucleus), a sign of infection or damage. Drugs that activate it (STING agonists), injected into tumors, worked well in mice; among 106 patients given one with an anti-PD-1 antibody, about one in ten responded.[^12] An ordinary COVID-19 vaccine has also been proposed as such a signal.

:::deep-dive Could a COVID-19 vaccine help immunotherapy?
In October 2025, a team at MD Anderson Cancer Center in Houston and the University of Florida reported on 884 MD Anderson patients with advanced lung cancer who began a checkpoint inhibitor: the 180 who had received a COVID-19 mRNA vaccine within 100 days of starting it lived a median of 37 months, against 21 for the rest; melanoma patients showed a similar gap.[^46] In mice, the vaccine triggered a burst of type I interferon ([Chapter 2](02-innate.html)) that activated dendritic cells, which then primed killer T cells against the tumor's own antigens. The vaccine carries nothing from the tumor, only the activating signal: the reverse of [Chapter 11](11-vaccines.html)'s peptide vaccines, which supplied tumor antigens with too weak a signal. The mouse tumors responded by raising PD-L1, which is why the checkpoint drug was also needed. In the same hospital's records, flu and pneumonia vaccines were not linked to longer survival.

An analysis of 4,407 patients in an Israeli health system found the same association.[^47] US Medicare records pointed to a different explanation: among 10,824 patients starting checkpoint inhibitors, a non-mRNA COVID-19 vaccine and an ordinary flu vaccine were linked to about the same survival gain as the mRNA vaccines, and vaccinated patients starting other cancer drugs also lived longer.[^48] That pattern fits two explanations that have nothing to do with the tumor: people who get vaccinated tend to be healthier and to receive better care, and vaccines prevent deadly infections.

Only a randomized trial can separate these explanations. One, registered to start in November 2026, plans to enroll 500 people with advanced lung cancer starting their first checkpoint treatment; some will be assigned at random to an mRNA COVID-19 vaccine or none, and others will choose. It measures side effects first and time to progression second.[^49]
:::

So far, these approaches have worked well in mice but mostly modestly in people, chemotherapy aside. Mouse tumors are usually transplanted and uniform, while human tumors have evolved for years under immune pressure.

## Why combinations are so hard

If one drug repairs one link, two drugs should repair two. The idea has been tested widely: by the end of 2021, 5,683 clinical trials worldwide were testing PD-1 or PD-L1 antibodies, most of them in combination with something else.[^13]

Some combinations have worked: PD-1 or PD-L1 blockers with anti-CTLA-4 in melanoma and kidney cancer; with a LAG-3 blocker in melanoma; with chemotherapy in lung cancer; with drugs that block {{vegf|VEGF}}, a blood-vessel growth signal, in some kidney, liver and endometrial cancers. Many others have failed, among them epacadostat (Chapter 8), which looked impressive in an early trial with no comparison group and added nothing in a large randomized one.

Several things make combinations hard:

- **Side effects add up faster than benefits.** Each brake a drug releases also protects some healthy tissue.
- **The wrong link, or the wrong patients.** A drug that improves infiltration cannot help a tumor whose problem is recognition, and a benefit confined to a minority can vanish in a trial that enrolls everyone with a given cancer.
- **Uncontrolled trials mislead.** In a randomized trial, chance decides who gets the new drug, so the groups are comparable. Without a comparison group, a drug can look good because the patients enrolled were doing well anyway.
- **Biology has redundancy.** When one escape route is blocked, a tumor may come to rely on another.

:::figure ch12-combinations
title: Fix the cycle
goal: After playing, the reader understands that the right combination depends on which step of the cycle is broken, that drugs aimed at unbroken steps add side effects without benefit, and that some tumors (here, excluded ones) resist every option on the tray.
kind: simulation
stage: dark
spec: |
  ROLE (FIGURE-AUDIT §2B). The ONLY figure in the book where the reader prescribes (ch07-cycle teaches the steps;
  ch12-resistance diagnoses). Wheel-led. The reader picks a tumor profile — each has one or more weak steps — then adds
  up to THREE treatments from a tray of seven. Each treatment strengthens, skips or replaces specific steps and adds
  side-effect points. Two meters show the result; a card shows what real trials of the chosen pairing found.

  SHARED MODULES. Wheel = shared/cycle-wheel.js (density 'full'); PROFILES, tray tiles, step mappings, STATUS strings
  and evaluateCombination() all come from shared/cycle-data.js, so Chapters 7 and 12 never disagree. Meters =
  shared/activity-meter.js. Each profile shows the matching ch12-resistance chip icon (A ↔ Brake on, B ↔ Excluded,
  C ↔ No scouts, D ↔ Shop window shut), so the reader sees one story told three ways.

  ON-SCREEN TEXT (verbatim):
  - Prompt above the tray: "Pick a tumor and add up to three treatments. Which breaks can you repair, and what does
    it cost in side effects?"
  - Footnote, always visible under the meters: "A teaching model with made-up numbers, in which the weakest step sets
    the pace. Real tumors are messier: steps are rarely all-or-nothing, a strong step can partly make up for a weak
    one, and different parts of one tumor can fail differently. Not a prediction for any patient."

  LAYOUT — DESKTOP: top = PROFILE segmented control (4 options) with the profile's one-line description beneath.
  Center-left = WHEEL (~420px). Show a small vertical strength bar only beside the profile's weak steps (not all
  seven). Center-right = two METERS ("Tumor control (model)" and "Side effects", both tagged "Illustrative, not measured"; outcome icons ✕ ≈ ✓), the OUTCOME MESSAGE, then the
  REAL-WORLD CARD area. Bottom = THERAPY TRAY: 7 tiles (4 + 3 grid); selected tiles get a gold outline and a check;
  counter "2 of 3 chosen"; "Reset" button.

  MODEL (implement exactly; numbers are arbitrary teaching values; round to 2 decimals before comparing):
  Steps s1..s7 = strength 0–1, capped at 1.0. "Skip" = step treated as 1.0 and drawn dimmed with a "not needed" tag
  (ch07-cycle combine style). "Replace" = step treated as 1.0 and tagged "engineered recognition".
  Profiles [s1..s7] — description (verbatim):
   A "Inflamed but braked" [0.8,0.8,0.8,0.8,0.8,0.8,0.2] — "T cells are inside and recognize the tumor, but PD-L1
     brakes them."
   B "Excluded" [0.7,0.7,0.7,0.6,0.2,0.8,0.3] — "T cells are primed and arrive, but stroma keeps them at the edge."
   C "Desert (cold)" [0.2,0.2,0.2,0.8,0.7,0.8,0.5] — "Little antigen is released, dendritic cells stay idle, and few
     T cells are primed."
   D "Inflamed but hidden (MHC loss)" [0.8,0.8,0.8,0.8,0.8,0.05,0.6] — "T cells arrive, but the cancer cells have
     lost MHC class I."
  Tiles — subtitle — effect — side-effect points (ch07 THERAPIES ids in brackets):
   1 Anti-PD-1 — "Releases the PD-1 brake" — s7 +0.5 — 1 [anti-pd1]. Rings follow cycle-data: full gold ring at
     steps 6–7, thin "also acts here" ring at step 3 (PD-1 blockade also frees some T cells being primed — too little
     in this model to repair missing priming).
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
   partial on profile B (Excluded) with gate openers selected: "No treatment on this tray fully opens the wall
     around an excluded tumor. That is where much of the real research is."
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
   Anti-PD-1 + Cancer vaccine: use the cycle-data STATUS string for the vaccine verbatim (it must say "company-
     reported" and "not yet approved"), followed by "(Chapter 11)."
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
alt: An interactive teaching model of the seven-step cancer-immunity cycle. The reader chooses a tumor type — inflamed but braked, excluded, desert (cold), or inflamed but hidden by MHC loss — and adds up to three treatments. Each treatment strengthens, skips or replaces particular steps and adds side effects; three of the four types can reach a strong response with the right pairing, while the excluded tumor never fully does, and cards summarize what real trials found.
:::

:::deep-dive Why good ideas fail in the clinic
The IDO1 episode ([Chapter 8](08-checkpoints.html)) has a second lesson. On the strength of single-arm results, several phase 3 trials were launched at once, and most were stopped or scaled back after the first one failed. Whether the target, the dose or the choice of patients was wrong is still unclear.

Engineered cytokines followed a similar course. High-dose {{il-2|interleukin-2}} (IL-2), a cytokine that drives T cells to proliferate, has been used since the 1990s and helps a minority of patients at the cost of severe side effects (see the [Interlude](interlude-history.html)). Bempegaldesleukin was a modified version designed to stimulate killer T cells and NK cells preferentially over {{regulatory-t-cell|regulatory T cells}}. In a 783-patient melanoma trial, adding it to nivolumab (Opdivo) shrank fewer tumors than nivolumab alone (28% vs 36%), did not improve survival, and roughly doubled severe side effects.[^14]

The general problem is statistical. To show that drug B adds something, a trial must randomize patients to A versus A+B, and if B helps only the minority whose tumor has the matching broken link, the trial may miss its benefit. That is one reason many researchers now favor smaller randomized trials with biopsies before and after treatment, and short "window" studies before surgery, in which a combination's effect on the tumor can be seen within weeks.
:::

## Treat first, operate later

Traditionally, surgery comes first and drugs second, as {{adjuvant-therapy|adjuvant therapy}} to kill any cancer cells left behind. In {{neoadjuvant-therapy|neoadjuvant therapy}}, the drug comes first.

The rationale is that a tumor left in place can act as a personalized vaccine, supplying its antigens to dendritic cells, while the drug counters the tumor's suppression of T cells. If the brakes are released while the tumor is still there, many T-cell clones — groups of identical T cells sharing one receptor ([Chapter 3](03-adaptive.html)) — should expand and circulate, attacking {{micrometastasis|micrometastases}}: deposits of cancer too small to see on scans, which cause most relapses. Surgery removes that source of antigen, and often also the lymph nodes that drain the tumor, where T cells against it are primed. In mice, removing these lymph nodes abolished the benefit of PD-1 blockade.[^50]

After encouraging mouse experiments, a 20-patient pilot in Amsterdam found that ipilimumab (Yervoy) plus nivolumab given before surgery expanded more of the tumor's T-cell clones than the same drugs given afterward.[^15]

In the SWOG S1801 trial, 313 people with operable advanced melanoma all received 18 doses of pembrolizumab; in one group, three of those doses came before surgery. Two years later, 72% of that group were {{event-free-survival|event-free}} (alive, with no relapse and no complication that stopped treatment or surgery), against 49% of those treated only after surgery.[^16] (Event-free survival is a surrogate for survival; see Chapter 8.) Because only the order differed, S1801 is the cleanest test of timing. The phase 3 NADINA trial, with 423 patients, compared two doses of ipilimumab plus nivolumab before surgery with standard nivolumab after it: at one year, 84% versus 57% were event-free. The 59% whose tumors held little or no viable cancer at surgery, a major {{pathologic-response|pathologic response}}, were spared further drug treatment.[^17] Unlike S1801, NADINA changed the drugs as well as the timing. Both trials show that order matters; the tumor-as-vaccine idea is the leading explanation, not a proven one.

In lung cancer, the CheckMate 816 trial found that adding nivolumab to chemotherapy before surgery raised five-year survival from 55% to 65%,[^18] and similar approaches are now approved for some lung and head and neck cancers.[^19]

Sometimes there is no surgery at all. In 2025, the Memorial Sloan Kettering team reported 117 patients with early-stage mismatch-repair-deficient tumors, in the rectum and elsewhere. Every rectal-cancer patient who completed treatment had a {{clinical-complete-response|clinical complete response}} — no sign of cancer on any examination, scan or biopsy — and chose to skip surgery. Across all tumor types, an estimated 92% were free of recurrence at two years.[^20] Such tumors are a small minority of rectal cancers; most rectal tumors do not respond to PD-1 blockade alone.

:::clinic
**"Watch and wait" involves close monitoring.** After a clinical complete response, patients in these studies had regular scans, endoscopies and examinations, so that any regrowth could be caught while surgery was still possible; in the 2025 report, no patient lost that option.[^20] **Where things stand (October 2026):** US treatment guidelines already list checkpoint immunotherapy as the preferred first treatment for locally advanced mismatch-repair-deficient rectal cancer.[^21] A larger trial, AZUR-1 (154 patients, no comparison group), has met its main goal according to its sponsor, and US regulators are due to decide on approving dostarlimab for this use by February 2027 — possibly sooner, because the application is eligible for the FDA's national priority voucher program.[^22]
:::

:::figure ch12-neoadjuvant
title: Before or after surgery?
goal: After stepping through, the reader understands the leading explanation for why giving immunotherapy while the tumor is still in place can work better — the tumor keeps supplying antigens, so more T-cell clones are primed to find hidden micrometastases — and that the same drug can work better simply because of timing.
kind: stepper
stage: dark
spec: |
  OVERVIEW. Two synchronized "patients" (lanes) receive the same drug; only the order of drug and surgery differs.
  Six steps walk through what happens to antigen, dendritic cells, T-cell clones and hidden micrometastases. No trial
  numbers appear inside the figure (they are in the text). Stage tags (top right, t-caps): "Illustrative",
  "Time compressed".

  SHARED ART (FIGURE-AUDIT §2D, §4): lymphNodeField for the node interior (label "LYMPH NODE"); cell-actions.divide()
  for clonal "photocopying"; clone identity = tcrKey notch on each TCR tip matching an epitopeKey on the antigen,
  using the named triangle / star / diamond keys in hot pink; kills use the shared kill grammar. Same path and lane
  grammar as ch11-oncolytic (one agent builds both).

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
     prime many more clones."
   5 Both: T cells flow right through the bloodstream. Neoadjuvant lane: triangle, star and diamond T cells find and
     kill micrometastases A, B and C (each cluster blebs and disappears). Adjuvant lane: triangle T cells kill A; B and
     C remain.
   6 Neoadjuvant lane: the scalpel removes the now-shrunken primary; a "pathology report" card pops up: "Live cancer
     remaining: almost none — major pathologic response." Adjuvant lane: playhead jumps to Month 24 and B and C have
     grown into a visible relapse (solid, full opacity, "relapse" tag), with an on-stage tag beside the lane
     (verbatim): "one possible course".

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
  1. Two patients have the same melanoma: a visible tumor, and micrometastases, a few cancer cells that have already spread elsewhere but are too few for any scan to detect. Both will receive the same drug; only the order of drug and surgery differs.
  2. After surgery (adjuvant): surgeons remove the tumor first, and with it the main source of tumor antigens. When the drug arrives, there is much less antigen left to prime T cells.
  3. Before surgery (neoadjuvant): the drug arrives while the tumor is still in place. Dendritic cells keep carrying its antigens to the lymph node, so the tumor acts as a vaccine; this is the leading explanation for why timing matters.
  4. While antigen keeps arriving, more kinds of T-cell clone are primed and expand. In a pilot trial, giving the drugs before rather than after surgery expanded more of the tumor's T-cell clones.
  5. T cells circulate in the blood. A broader set of clones is more likely to find the hidden micrometastases, including ones that present different neoantigens.
  6. The neoadjuvant patient now has surgery, and a pathologist measures how much viable cancer is left: here, almost none. Not every adjuvant patient relapses, and not every neoadjuvant patient is cured, but in trials, treatment before surgery has improved the odds.
alt: Two side-by-side scenarios show the same immunotherapy given after or before surgery. When the tumor is still in place, it supplies antigens that prime more kinds of T-cell clone, which then find and destroy hidden micrometastases; when surgery comes first, fewer clones are primed and some micrometastases survive to cause a relapse.
:::

:::deep-dive Reading the pathology report, and the side effects
After neoadjuvant immunotherapy, pathologists measure how much of the tumor is still viable, not only whether cancer is present. In melanoma, an international consortium defined the categories: a **pathologic complete response** means no viable tumor cells remain; a **major pathologic response**, 10% or less of the tumor bed is still viable; a partial response, 10–50%; and a non-response, more than 50%.[^23]

Where the tumor used to be, pathologists find a *regression bed*: scar tissue (fibrosis), dense infiltrates of immune cells, and macrophages laden with engulfed debris and pigment, all signs of an immune attack.

The categories predict outcome. In NADINA, 95% of patients with a major pathologic response were free of relapse at one year, compared with 76% of partial responders and 57% of non-responders.[^17] In CheckMate 816, lung cancer patients with a pathologic complete response had 95% five-year survival, against 56% for those without one.[^18] This makes **response-adapted therapy** possible: stopping treatment for those who have clearly responded and escalating it for those who have not. But a strong link between pathologic response and survival *within* a trial does not guarantee that a new drug that raises pathologic response will also extend life; this is the surrogate-endpoint problem of Chapter 8.

The drawback is side effects. In the first Amsterdam pilot, 9 of 10 patients in each group had severe ones.[^15] With gentler dosing in NADINA, severe treatment-related side effects occurred in about 30% of patients, against about 15% with standard nivolumab after surgery.[^17]
:::

## Gut bacteria

The trillions of bacteria in the gut, the {{microbiome|gut microbiome}}, influence how the immune system develops from birth. In 2018, studies suggested they also affect the response to immunotherapy. A team in France found that patients who had taken antibiotics around the start of PD-1 blockade did worse, and that one species, *Akkermansia muciniphila*, was more common in responders.[^24] A team in Texas found that responders' gut communities were more diverse and richer in certain bacterial families.[^25] When stool from responders was transplanted into germ-free mice, the mice's tumors responded better to checkpoint blockade.

A {{fecal-microbiota-transplant|fecal microbiota transplant}} (FMT) delivers stool from a carefully screened donor into a patient's gut. In two small trials in 2021, people whose melanoma had resisted PD-1 blockade received stool from patients who had responded, and then restarted the drug. Tumors shrank or stopped growing for a long time in about a third of patients (3 of 10 and 6 of 15); neither trial had a comparison group.[^26][^27]

The first placebo-controlled trial, by its investigators' account, enrolled 45 people starting immunotherapy-based treatment for kidney cancer and narrowly missed its main goal: after a year, 70% of the transplant group versus 41% of the sham group were free of progression, a gap that could still be chance. On a secondary measure, the transplant group went a median of 24 months before progressing, against 9.[^28]

The antibiotic finding is an association: people who need antibiotics are often sicker, and sicker people do worse on any treatment. Nobody should skip antibiotics they need. The evidence on diet is weaker: among 128 melanoma patients, those who ate more fiber tended to go longer without their cancer progressing, while over-the-counter probiotics showed no clear benefit, and in mice they blunted the response.[^29] And FMT carries real risk: donor stool has transmitted drug-resistant bacteria, in one case fatally.[^30]

:::deep-dive Microbes: what is solid and what isn't
**Solid:** in mice, the gut microbiome clearly changes how well checkpoint inhibitors work — germ-free animals, or animals given antibiotics, respond worse, and transferring certain human communities changes that. In people, several independent groups have linked the microbiome to response, and early FMT trials suggest that changing it can sometimes rescue a response.[^24][^26][^27]

**Not solid:** *which* bacteria matter. The 2018 studies highlighted different microbes — *Akkermansia* in France, members of the Ruminococcaceae family in Texas.[^24][^25] Differences in diet, geography, sequencing methods and small sample sizes probably explain part of this; the useful signal may be a property of the whole community rather than of any single species.

**Proposed mechanisms** include bacterial molecules that stimulate the {{pattern-recognition-receptor|pattern-recognition receptors}} of dendritic cells ([Chapter 2](02-innate.html)), shifts in the cytokines that influence T-cell priming, and, more speculatively, bacterial peptides similar enough to tumor peptides to prime cross-reactive T cells. Any mechanism has to explain distance: T and B cells primed in the gut are imprinted to return to the gut wall ([Chapter 4](04-presentation.html)), yet the tumors in these studies grew in skin, lungs and kidneys. The influence therefore has to travel, and bacterial molecules and metabolites that reach the blood can act on dendritic cells and T cells throughout the body. Some of these molecules may work against treatment. Butyrate, which gut bacteria make from fiber, limits gut inflammation in mice by promoting the differentiation of helper T cells into regulatory T cells ([Chapter 5](05-t-cells.html)); among melanoma patients treated with ipilimumab, those with the most butyrate in their blood benefited least.[^51] This need not conflict with the fiber finding above: those patients were mostly on PD-1 blockade, these were on a CTLA-4 blocker, and both results are correlations.[^29]

**Reasons for caution.** Antibiotic studies are vulnerable to *confounding*: a hidden third factor (here, how sick the patient is) that drives both the exposure and the outcome. Commercial probiotics contain a few chosen strains, not the communities studied.[^29] Even stool from screened donors in clinical trials has transmitted dangerous infections;[^30] home-made transplants skip that screening entirely. Randomized trials, now under way in several cancers, should resolve some of these questions.
:::

## New biomarkers

Today's {{biomarker|biomarkers}} — PD-L1, mismatch-repair status, {{tumor-mutational-burden|tumor mutational burden}} — predict response imperfectly ([Chapter 8](08-checkpoints.html)). Newer tools aim to track the tumor and the immune response during treatment.

The most advanced is {{ctdna|circulating tumor DNA (ctDNA)}}. Dying cells release DNA fragments into the blood, and a tumor's fragments carry its mutations, so a sensitive test, a {{liquid-biopsy|liquid biopsy}}, can detect them and reveal {{minimal-residual-disease|minimal residual disease}}: cancer left after surgery in amounts too small for any scan.

The IMvigor011 trial applied this in bladder cancer, testing patients' blood repeatedly for up to a year after surgery. The 250 who turned ctDNA-positive were randomly assigned to atezolizumab (Tecentriq), an anti-PD-L1 antibody, or a placebo; with the drug, median survival rose from 21 to 33 months. Another 357 people stayed ctDNA-negative throughout and received no immunotherapy; 88% were still disease-free two years later.[^31] The test identified people who benefited from the drug, and most of those it cleared did well without it, though the trial did not test whether they would have done better with it. In May 2026, the US FDA approved this approach, so a ctDNA test now decides who receives this immunotherapy.[^32]

Artificial intelligence is the other main approach. Algorithms that analyze pathology slides, scans and sequencing data look promising at predicting response in past patients, but few have been validated in prospective trials, and most neoantigens predicted by computer turn out not to be recognized by T cells ([Chapter 11](11-vaccines.html)).

:::figure ch12-ctdna
title: Tumor DNA in the blood
goal: After using this, the reader understands that tumor DNA in the blood can reveal cancer that scans cannot yet see — so leftover disease or relapse can be detected months earlier — and that a negative test lowers, but does not eliminate, the risk.
kind: chart
stage: light
spec: |
  OVERVIEW. A two-part interactive: (1) a small "blood sample" panel showing DNA fragments, and (2) a time chart of
  the amount of cancer in the body with two detection thresholds, driven by three scenarios. The point is the GAP
  between what scans can see and what a sensitive blood test can see. Everything on the chart is illustrative; real
  trial numbers appear only in the two callout cards (DATA).

  LAYOUT — DESKTOP (light stage, ~960×520):
  - Left 30%: BLOOD SAMPLE PANEL (OPTIONAL — the first element to cut if the schedule slips, FIGURE-AUDIT §5; the
    chart alone must still teach the idea). A rounded test-tube outline containing ~120 short DNA fragments drawn as tiny
    double-helix dashes, mostly grey (from healthy cells) with a few violet ones (#B65FD8) carrying a small hot-pink
    "mutation" tick (#FF3D7F). Label below: "tumor DNA fragments: none / few / some". The number of violet fragments
    tracks the chart value under the playhead (0 below the blood-test line, 1–3 just above it, up to ~20 at the top).
    A magnifier ring over one violet fragment: "the tumor's own mutation identifies it". Small note under the tube
    (verbatim): "In reality, tumor fragments are far rarer than shown."
  - Right 70%: CHART, drawn with shared/chart.js (theme 'light'), with a visible source line under the callout cards.
    (If the blood panel is cut, the chart takes the full width.) x-axis "Months" 0–24 (ticks every 6). y-axis "Amount of cancer in the body (illustrative)" with
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
  1. Every day, dying cells release short fragments of DNA into the blood. A tumor's fragments, its circulating tumor DNA (ctDNA), carry its mutations, so a sensitive test can distinguish them from the far more numerous fragments from healthy cells.
  2. After surgery and treatment, ctDNA disappears from the blood and stays undetectable. A negative test is reassuring, but every test has a detection limit and some tumors shed little DNA, so a negative result lowers the risk of relapse rather than ruling it out.
  3. Scans are clear after surgery, and at first so is the blood. As hidden cancer cells grow, their ctDNA becomes detectable months before the tumor is large enough to appear on a scan, which is why the blood is tested repeatedly.
  4. The tumor shrinks under treatment and its DNA in the blood falls; then a resistant clone begins to grow. The ctDNA level can rise again while scans still look clear.
  5. The IMvigor011 trial tested this idea: treat when the blood test turns positive. Patients who turned ctDNA-positive lived longer, on average, with immunotherapy, and most whose tests stayed negative did well without it, though the trial did not test whether they too would have benefited.
data: |
  Callout card 1 — IMvigor011 (bladder cancer; Powles et al., N Engl J Med 2025; FDA approval 15 May 2026, verified
  against the FDA label for atezolizumab):
    "After surgery, patients had repeated blood tests for up to a year. 250 who turned ctDNA-positive were randomized:
    median survival 32.8 months with atezolizumab vs 21.1 months with placebo. Of 357 who stayed ctDNA-negative and
    received no immunotherapy, 88% were disease-free at two years. The US FDA approved this approach in May 2026."
  Callout card 2 — CheckMate 816 (lung cancer; Forde et al., N Engl J Med 2025):
    "Exploratory analysis: among patients given nivolumab plus chemotherapy before surgery, 75% of those whose ctDNA
    cleared were alive at five years, vs 53% of those whose ctDNA did not clear."
  All chart curves and thresholds: illustrative, not from any dataset. (For the builder's orientation only, not for
  display: in published studies, ctDNA has preceded imaging by a median of about three months in bladder cancer
  [Christensen E et al., J Clin Oncol 2019;37:1547–1557, PMID 31059311] and by a mean of about nine months in
  colorectal cancer [Reinert T et al., JAMA Oncol 2019;5:1124–1131, PMID 31070691].)
alt: A chart follows the amount of cancer in the body over two years, with two thresholds: a higher one for what scans can see and a lower one for what a blood test for tumor DNA can detect. In the scenarios, the blood test reveals leftover cancer or relapse months before scans do, and stays negative when treatment succeeds, though every test has a detection limit. Two cards summarize real trials in bladder and lung cancer that used these blood tests.
:::

## Beyond killer T cells

Newer drugs target two other kinds of immune cell, and the tumor's blood vessels.

**NK cells.** {{nk-cell|Natural killer (NK) cells}} (Chapter 2) can kill cells that have lost MHC class I ({{missing-self|missing self}}), so they could take over when tumors become invisible to killer T cells. Approaches under test include NK-cell engagers (antibodies that physically bridge an NK cell to a cancer cell), cytokines that expand NK cells, engineered {{car-nk|CAR-NK cells}}, and antibodies that block NKG2A, the inhibitory receptor that binds HLA-E, a molecule whose surface level reflects how much MHC class I a cell is making (Chapter 2).[^33] None is yet approved, and NK cells share the T cells' difficulty infiltrating solid tumors. The most advanced NKG2A blocker, monalizumab, failed a phase 3 trial in head and neck cancer.[^34]

**Macrophages.** {{macrophage|Macrophages}} are {{myeloid-cell|myeloid cells}}, members of the branch of white blood cells that also includes monocytes, neutrophils and most dendritic cells (T, B and NK cells form the other, lymphoid branch). They are plentiful in many tumors ([Chapter 7](07-escape.html)), and many cancers display {{cd47|CD47}}, a "don't eat me" signal that inhibits {{phagocytosis|phagocytosis}} by macrophages. Blocking it looked like a way to get the tumor's own macrophages to engulf and digest cancer cells. But CD47 is not unique to cancer (red blood cells rely on it too), and the lead antibody, magrolimab, failed in a large trial in a bone-marrow cancer, with more deaths from side effects.[^35]

**Blood vessels.** Tumors produce large amounts of VEGF, the blood-vessel growth signal mentioned above. The vessels it induces are leaky and disorganized, which hinders immune cells' entry, and VEGF also helps keep the {{tumor-microenvironment|tumor microenvironment}} suppressive. Drugs that block it can partly "normalize" the vessels and let more T cells in.[^36] Ivonescimab, a {{bispecific-antibody|bispecific antibody}} that blocks PD-1 and VEGF at once, has been approved in China since May 2024[^37] and outperformed pembrolizumab in a head-to-head lung cancer trial there.[^38] A US decision on its use in EGFR-mutant lung cancer is due on 14 November 2026.[^39]

New cell therapies and vaccines are covered in [Chapter 10](10-cell-therapy.html) and [Chapter 11](11-vaccines.html). As the results above show, a plausible mechanism justifies testing a drug but does not predict whether it will work.

:::deep-dive Where the newer targets stand
**LAG-3 and TIGIT.** LAG-3 is the one newer brake target to win approval; TIGIT mostly failed. [Chapter 8](08-checkpoints.html) covers both.

**NKG2A — failure, so far.** In INTERLINK-1, 216 people with head and neck cancer that had progressed after immunotherapy and chemotherapy received cetuximab with monalizumab or a placebo. Median survival was 8.8 versus 8.6 months, and the trial was stopped early for futility.[^34] A phase 3 trial adding monalizumab to durvalumab after chemoradiation for stage III lung cancer (PACIFIC-9, NCT05221840) has finished enrolling. NK-cell engagers and CAR-NK cells remain in early trials.[^33]

**CD47 — failure, so far.** Because red blood cells rely on CD47, anti-CD47 antibodies cause anemia, and magrolimab was started with a small "priming" dose. In ENHANCE, 539 patients with higher-risk myelodysplastic syndrome, a bone-marrow cancer, received azacitidine with magrolimab or a placebo. Remission rates and survival were no better with magrolimab, and fatal side effects were more frequent (15.2% vs 9.8%).[^35] Other drugs aimed at the CD47 pathway are still in trials.

**Engineered cytokines — failure, so far.** See *Why good ideas fail in the clinic*, above.[^14]

**PD-1 × VEGF — promising, with questions.** In HARMONi-2 (398 patients, all in China, with PD-L1-positive lung cancer), median {{progression-free-survival|progression-free survival}} was 11.1 months with ivonescimab, against 5.8 with pembrolizumab.[^38] In an interim analysis presented at a conference in September 2026, not yet published in full, median survival was 30.8 versus 22.6 months; China approved the drug for this use in 2025.[^40] (Its first Chinese approval, in May 2024, was for EGFR-mutant lung cancer.[^37]) Outside China the picture is less clear. In the global HARMONi trial in EGFR-mutant lung cancer, adding ivonescimab to chemotherapy delayed tumor growth, but the survival difference could still have been chance;[^41] the FDA's decision on that use is due on 14 November 2026. An early look at a global trial against pembrolizumab plus chemotherapy did not cross its bar for significance, and the trial continues.[^39]

**Engineered cells and vaccines.** CAR-T cells made inside the body and personalized mRNA vaccines are in human trials. Chapters [10](10-cell-therapy.html) and [11](11-vaccines.html) explain where each stands, including a positive phase 3 result for a personalized vaccine, reported by its makers in 2026.
:::

## Who gets these medicines

At US list prices in early 2025, a standard dose of pembrolizumab cost roughly $12,000, about five times as much per milligram as in Australia. With a dose every three weeks, a year of treatment can exceed $200,000 before discounts.[^42]

Between rich and poorer countries the gap is wider still. An Indian trial noted that approved immunotherapy regimens for advanced head and neck cancer reach only 1–3% of patients in low- and middle-income countries. Its investigators added a flat 20-milligram dose of nivolumab, a small fraction of the usual dose, to inexpensive oral drugs: compared with the oral drugs alone, one-year survival rose from 16% to 43%. The trial did not compare low with full doses, so it shows that a small dose is far better than none, not that it matches a full one.[^43]

Policy is moving slowly. In 2025 the World Health Organization extended pembrolizumab's place on its Model List of Essential Medicines to metastatic cervical, colorectal and lung cancers.[^44] Pembrolizumab's key patents expire in the United States and China in 2028 (later in Europe and Japan), which will allow cheaper {{biosimilar|biosimilars}}.[^42]

:::clinic
**A note for readers facing treatment.** Nothing here is medical advice ([About](about.html)). Every advance in this chapter came from {{clinical-trial|clinical trials}}, searchable at [ClinicalTrials.gov](https://clinicaltrials.gov), which is a registry, not a seal of approval. Be wary of clinics that sell "immunotherapy" for cash outside a proper trial: "activated" immune cells, dendritic-cell vaccines or stem cells, promoted with testimonials, promises of cure without side effects, no published results and large upfront fees.[^45] And because checkpoint side effects are immune attacks on healthy tissue (Chapter 8), they can start months after treatment, even after it ends, so anyone who has had immunotherapy should report new symptoms promptly and tell every doctor they see.
:::

## What nobody knows yet

- Which link is broken in *this* patient's tumor, and can a biopsy or a blood test tell before treatment starts?
- Do the gains in event-free and recurrence-free survival from earlier treatment, or from added vaccines, translate into longer lives?
- Which gut microbes matter, and can diet or transplants change them reliably?
- Can a nonspecific immune stimulus, such as an ordinary vaccine, make checkpoint drugs work better, or are vaccinated patients just healthier?
- Can NK cells, γδ T cells or myeloid cells such as macrophages take over where killer T cells fail?
- Can engineered cells be made to travel into, survive in and kill within solid tumors?
- Will prices fall far enough, as patents expire, for these drugs to reach most of the world?

## Where immunotherapy stands

Fifteen years ago, metastatic melanoma usually killed within a year; today, many people treated with checkpoint inhibitors are alive a decade later ([Chapter 8](08-checkpoints.html)). In trials, some people with one rare kind of rectal cancer have been spared surgery, and in bladder cancer a blood test now helps decide who needs immunotherapy.

Most people with advanced cancer still do not benefit, and tumor types that are mostly cold, such as pancreatic cancer, remain largely resistant. Side effects can be serious, prices are high, and access depends heavily on where a person lives.

The immune system's power comes from recognition, from telling self from other, and cancer is hard to treat this way because it is mostly self. Most of the approaches in this chapter try to help the immune system recognize what is already there, or to tell sooner whether it has done so. For now, the response figures are still the ones this chapter opened with: twelve out of twelve in one rare rectal cancer, and about one in five across advanced cancers treated with checkpoint drugs.

:::quiz
Q: A melanoma shrank on anti-PD-1 for two years, then regrew. Its cancer cells have lost both working copies of JAK1. What has changed?
- [x] The cells have lost IFN-γ signaling — so T-cell attacks no longer make them express more MHC or stop dividing.
- [ ] T cells can no longer infiltrate the tumor — that would be exclusion by stroma; JAK1 loss is a change inside the cancer cell.
- [ ] The T cells attacking it have become too exhausted to kill — exhaustion is a T-cell state; JAK1 loss happens in the cancer cell.

Q: Both groups in the SWOG S1801 trial received pembrolizumab. What did the trial vary, and why might it matter?
- [x] The timing of the doses relative to surgery — in one group, three of the 18 doses came before surgery, while the tumor was still there to supply antigens for priming T cells.
- [ ] The drug: one group also received ipilimumab — that was NADINA; S1801 used pembrolizumab alone in both groups.
- [ ] The dose: one group received larger, more frequent doses — both groups received 18 doses of the same strength; only the order changed.

Q: In several studies, patients who took antibiotics around the start of immunotherapy did worse. What is the most careful conclusion?
- [ ] Antibiotics make immunotherapy fail, so patients should avoid them — this is an association, and skipping needed antibiotics can be dangerous.
- [x] It could be the effect on gut bacteria, or it could be that sicker patients are the ones who need antibiotics — mouse experiments suggest a causal role, but these data alone cannot rule out confounding.
- [ ] Gut bacteria play no part in how well immunotherapy works — mouse experiments and early transplant trials suggest they matter.

Q: A company announces that its new drug "met its main goal" in a phase 3 trial, but has released no numbers. What is the most careful reading?
- [ ] It will soon be approved — regulators judge the full data, and many factors can still change the picture.
- [ ] It cures the patients who take it — "met its main goal" usually means a statistically significant improvement, not a cure.
- [x] Promising but provisional — wait for the full results, the size of the benefit and the side effects.
:::

:::takeaways
- "Resistance" covers many failures, each breaking a step of the cancer-immunity cycle: tumors lose neoantigens or MHC class I, lose IFN-γ signaling (by losing JAK1 or JAK2), exclude T cells, or never trigger enough priming; driver mutations and the patient's HLA alleles also play a part. Releasing the PD-1 brake mainly repairs the last link, with some help at priming; γδ T cells can sometimes attack tumors that have lost MHC class I.
- Turning cold tumors hot and combining drugs has proved hard: thousands of trials have tested combinations, and many plausible ones have failed. Success depends on matching the treatment to the broken link while keeping side effects tolerable.
- Timing matters: immunotherapy given before surgery has improved outcomes in melanoma, lung and head and neck cancer, and in trials in mismatch-repair-deficient rectal cancer it has so far let most patients avoid surgery altogether.
- Gut bacteria influence response, and fecal microbiota transplants show early promise, but much of the evidence is association; probiotics and do-it-yourself approaches are unproven and can be risky.
- In bladder cancer, a blood test for circulating tumor DNA (ctDNA) now helps decide who receives immunotherapy after surgery; AI and neoantigen prediction are promising but not yet validated. Beyond T cells, the leading drugs aimed at NK cells (an NKG2A blocker) and macrophages (a CD47 blocker) failed their first large trials, while PD-1 × VEGF antibodies show promise, so far mostly in Chinese trials.
- Most patients still do not respond, and cost and access are very unequal. A plausible mechanism is a reason to test a drug, not evidence that it works, and company announcements are provisional until the data are published.
:::

## Glossary
- msi-high | Mismatch-repair deficient (MSI-high) | Describes a tumor whose DNA-proofreading (mismatch-repair) system is broken, so it accumulates very many mutations, especially in short repeated stretches of DNA (microsatellite instability). Such tumors are often highly visible to T cells. Also abbreviated dMMR.
- pd-1 | PD-1 | An inhibitory ("brake") receptor on T cells. When it binds PD-L1 on another cell, the T cell's activity is inhibited; drugs such as pembrolizumab, nivolumab and dostarlimab block it.
- checkpoint-inhibitor | Checkpoint inhibitor | A drug, usually an antibody, that blocks an immune brake such as PD-1, PD-L1 or CTLA-4, releasing T cells to attack cancer.
- cancer-immunity-cycle | Cancer-immunity cycle | The seven-step loop by which the immune system attacks a tumor: antigen release, presentation by dendritic cells, priming in lymph nodes, trafficking, infiltration, recognition and killing.
- dendritic-cell | Dendritic cell | An immune cell that collects antigens in tissues and carries them to lymph nodes, where it presents them to T cells and activates matching ones.
- lymph-node | Lymph node | A small bean-shaped organ where dendritic cells present antigens and rare matching T cells are found and activated.
- ctla-4 | CTLA-4 | A brake receptor on T cells that acts mainly during priming in lymph nodes; ipilimumab blocks it.
- primary-resistance | Primary resistance | When a cancer does not respond to a treatment from the start.
- acquired-resistance | Acquired resistance | When a cancer that first responded to a treatment later grows back despite it.
- b2m | Beta-2-microglobulin (B2M) | A small protein that MHC class I needs to reach the cell surface. Cells that lose it cannot present peptides to killer T cells.
- ifn-gamma | Interferon-gamma (IFN-γ) | A cytokine secreted by activated T cells (and NK cells) that makes nearby cells express more MHC and can halt their growth.
- jak | JAK1 and JAK2 | Enzymes attached to the inner side of interferon receptors that relay the interferon signal into the cell. Tumors that lose them no longer respond to interferon.
- neoantigen | Neoantigen | A new peptide created by a mutation in a cancer cell, which the immune system can recognize as foreign.
- gamma-delta-t-cell | γδ (gamma-delta) T cell | A minority family of T cells whose receptors are built from different chains (gamma and delta) than ordinary T cells'. They recognize signs of stress and do not need MHC class I, so they can attack cells that have lost it.
- mhc-class-i | MHC class I | The molecule nearly every cell with a nucleus uses to present peptides, short fragments of its internal proteins, to killer T cells — the cell's "shop window".
- hla | HLA | The human versions of MHC molecules. People inherit two alleles (versions) of each HLA gene, which determine which peptides their cells can present.
- cold-tumor | Cold tumor | Informal term for a tumor with few or no T cells inside. Strictly a "desert", though often also used for "excluded" tumors whose T cells are stuck at the edges.
- immunogenic-cell-death | Immunogenic cell death | A way of dying in which a cell releases antigens along with danger signals, alerting the immune system, unlike the quiet, orderly death of most cells.
- oncolytic-virus | Oncolytic virus | A virus, often engineered, that preferentially infects and lyses (bursts) cancer cells, releasing antigens and danger signals.
- sting | STING | "Stimulator of interferon genes": a signaling protein inside cells that is activated when its partner sensor, cGAS, detects DNA free in the cytoplasm (a sign of infection or damage), triggering type I interferon production.
- vegf | VEGF | Vascular endothelial growth factor, a signal that makes blood vessels grow. Tumors overproduce it, creating leaky vessels that also hinder immune cells.
- adjuvant-therapy | Adjuvant therapy | Treatment given after surgery to destroy any cancer cells left behind. (Not to be confused with a vaccine adjuvant.)
- neoadjuvant-therapy | Neoadjuvant therapy | Treatment given before surgery, while the tumor is still in place.
- micrometastasis | Micrometastasis | A small cluster of cancer cells that has spread to another site but is too small to detect on scans.
- event-free-survival | Event-free survival | Whether, or for how long, patients stay alive without any defined setback — such as cancer growth, relapse, or being unable to have planned surgery.
- pathologic-response | Pathologic response | How much viable (live) cancer a pathologist finds in tissue removed at surgery after treatment. A complete response means none; a major response means 10% or less.
- clinical-complete-response | Clinical complete response | No sign of cancer on any examination, scan or biopsy after treatment, without surgery to confirm it under the microscope.
- microbiome | Microbiome | The community of microbes — mostly bacteria — living in and on the body, especially in the gut.
- fecal-microbiota-transplant | Fecal microbiota transplant (FMT) | Transfer of stool from a screened donor into a patient's gut, to replace their gut bacterial community.
- biomarker | Biomarker | A measurable feature — a protein, a gene change, a blood level — that indicates something about a disease or predicts how it will respond to treatment.
- tumor-mutational-burden | Tumor mutational burden (TMB) | The number of mutations in a tumor's DNA, usually per million DNA bases. More mutations generally mean more potential neoantigens.
- ctdna | Circulating tumor DNA (ctDNA) | Fragments of DNA released into the blood by cancer cells, identifiable by the tumor's own mutations.
- liquid-biopsy | Liquid biopsy | A blood test (or other body-fluid test) that detects signs of cancer, such as ctDNA, without cutting out tissue.
- minimal-residual-disease | Minimal residual disease (MRD) | Cancer cells that remain after treatment in numbers too small to see on scans, which can later cause relapse.
- nk-cell | NK cell (natural killer cell) | An innate killer cell that destroys stressed cells and cells that have lost MHC class I ("missing self", Chapter 2).
- macrophage | Macrophage | A large myeloid immune cell that engulfs microbes, debris and dying cells (phagocytosis). In tumors, many macrophages are reprogrammed to suppress immunity and help the cancer.
- myeloid-cell | Myeloid cell | A white blood cell of the myeloid branch, which includes monocytes, macrophages, neutrophils and most dendritic cells. The other branch, the lymphoid cells, comprises T cells, B cells and NK cells.
- cd47 | CD47 | A "don't eat me" signal on the surface of cells that inhibits their phagocytosis by macrophages. Many cancers overexpress it; red blood cells depend on it too.
- bispecific-antibody | Bispecific antibody | An engineered antibody with two different antigen-binding arms, so it can bind two different targets at once.
- biosimilar | Biosimilar | A near-identical, usually cheaper, copy of an antibody or other biological drug, sold after the original's patents expire.
- clinical-trial | Clinical trial | A study that tests a treatment in people. Phase 1 trials test safety; phase 2, early effectiveness; phase 3 compares the new treatment with the standard one in large, usually randomized groups.

## Sources
1. Cercek A, Lumish M, Sinopoli J, et al. PD-1 blockade in mismatch repair–deficient, locally advanced rectal cancer. *N Engl J Med* 2022;386:2363–2376. doi:10.1056/NEJMoa2201445
2. Haslam A, Olivier T, Prasad V. How many people in the US are eligible for and respond to checkpoint inhibitors: an empirical analysis. *Int J Cancer* 2025;156:2352–2359. doi:10.1002/ijc.35347
3. Zaretsky JM, Garcia-Diaz A, Shin DS, et al. Mutations associated with acquired resistance to PD-1 blockade in melanoma. *N Engl J Med* 2016;375:819–829. doi:10.1056/NEJMoa1604958
4. Anagnostou V, Smith KN, Forde PM, et al. Evolution of neoantigen landscape during immune checkpoint blockade in non-small cell lung cancer. *Cancer Discov* 2017;7:264–276. doi:10.1158/2159-8290.CD-16-0828
5. Sade-Feldman M, Jiao YJ, Chen JH, et al. Resistance to checkpoint blockade therapy through inactivation of antigen presentation. *Nat Commun* 2017;8:1136. doi:10.1038/s41467-017-01062-w
6. de Vries NL, van de Haar J, Veninga V, et al. γδ T cells are effectors of immunotherapy in cancers with HLA class I defects. *Nature* 2023;613:743–750. doi:10.1038/s41586-022-05593-1
7. Skoulidis F, Goldberg ME, Greenawalt DM, et al. STK11/LKB1 mutations and PD-1 inhibitor resistance in KRAS-mutant lung adenocarcinoma. *Cancer Discov* 2018;8:822–835. doi:10.1158/2159-8290.CD-18-0099
8. Peng W, Chen JQ, Liu C, et al. Loss of PTEN promotes resistance to T cell–mediated immunotherapy. *Cancer Discov* 2016;6:202–216. doi:10.1158/2159-8290.CD-15-0283
9. Chowell D, Morris LGT, Grigg CM, et al. Patient HLA class I genotype influences cancer response to checkpoint blockade immunotherapy. *Science* 2018;359:582–587. doi:10.1126/science.aao4572
10. Postow MA, Callahan MK, Barker CA, et al. Immunologic correlates of the abscopal effect in a patient with melanoma. *N Engl J Med* 2012;366:925–931. doi:10.1056/NEJMoa1112824
11. Spigel DR, Faivre-Finn C, Gray JE, et al. Five-year survival outcomes from the PACIFIC trial: durvalumab after chemoradiotherapy in stage III non-small-cell lung cancer. *J Clin Oncol* 2022;40:1301–1311. doi:10.1200/JCO.21.01308
12. Meric-Bernstam F, Sweis RF, Kasper S, et al. Combination of the STING agonist MIW815 (ADU-S100) and PD-1 inhibitor spartalizumab in advanced/metastatic solid tumors or lymphomas: an open-label, multicenter, phase Ib study. *Clin Cancer Res* 2023;29:110–121. doi:10.1158/1078-0432.CCR-22-2235
13. Upadhaya S, Neftelinov ST, Hodge J, et al. Challenges and opportunities in the PD1/PDL1 inhibitor clinical trial landscape. *Nat Rev Drug Discov* 2022;21:482–483. doi:10.1038/d41573-022-00030-4
14. Diab A, Gogas H, Sandhu S, et al. Bempegaldesleukin plus nivolumab in untreated advanced melanoma: the open-label, phase III PIVOT IO 001 trial results. *J Clin Oncol* 2023;41:4756–4767. doi:10.1200/JCO.23.00172
15. Blank CU, Rozeman EA, Fanchi LF, et al. Neoadjuvant versus adjuvant ipilimumab plus nivolumab in macroscopic stage III melanoma. *Nat Med* 2018;24:1655–1661. doi:10.1038/s41591-018-0198-0
16. Patel SP, Othus M, Chen Y, et al. Neoadjuvant–adjuvant or adjuvant-only pembrolizumab in advanced melanoma (SWOG S1801). *N Engl J Med* 2023;388:813–823. doi:10.1056/NEJMoa2211437
17. Blank CU, Lucas MW, Scolyer RA, et al. Neoadjuvant nivolumab and ipilimumab in resectable stage III melanoma (NADINA). *N Engl J Med* 2024;391:1696–1708. doi:10.1056/NEJMoa2402604
18. Forde PM, Spicer JD, Provencio M, et al. Overall survival with neoadjuvant nivolumab plus chemotherapy in lung cancer (CheckMate 816). *N Engl J Med* 2025;393:741–752. doi:10.1056/NEJMoa2502931
19. US Food and Drug Administration. KEYTRUDA (pembrolizumab) prescribing information, BLA 125514 (label revised July 2026; includes the perioperative resectable non-small-cell lung cancer and resectable locally advanced head and neck cancer indications). https://www.accessdata.fda.gov/scripts/cder/daf/index.cfm?event=overview.process&ApplNo=125514
20. Cercek A, Foote MB, Rousseau B, et al. Nonoperative management of mismatch repair–deficient tumors. *N Engl J Med* 2025;392:2297–2308. doi:10.1056/NEJMoa2404512
21. National Comprehensive Cancer Network. NCCN Clinical Practice Guidelines in Oncology: Rectal Cancer, Version 2.2026 (April 7, 2026). Open-access summary: NCCN Guidelines for Patients: Rectal Cancer, 2026. https://www.nccn.org/patients/guidelines/content/PDF/rectal-patient.pdf
22. GSK plc. Jemperli (dostarlimab) accepted for priority review by the US FDA for dMMR/MSI-H locally advanced rectal cancer. Press release, 24 August 2026 (PDUFA date February 2027; eligible for the National Priority Voucher program). https://www.gsk.com/en-gb/media/press-releases/jemperli-dostarlimab-accepted-for-priority-review-by-the-us-fda/ (company-reported)
23. Tetzlaff MT, Messina JL, Stein JE, et al. Pathological assessment of resection specimens after neoadjuvant therapy for metastatic melanoma. *Ann Oncol* 2018;29:1861–1868. doi:10.1093/annonc/mdy226
24. Routy B, Le Chatelier E, Derosa L, et al. Gut microbiome influences efficacy of PD-1–based immunotherapy against epithelial tumors. *Science* 2018;359:91–97. doi:10.1126/science.aan3706
25. Gopalakrishnan V, Spencer CN, Nezi L, et al. Gut microbiome modulates response to anti–PD-1 immunotherapy in melanoma patients. *Science* 2018;359:97–103. doi:10.1126/science.aan4236
26. Baruch EN, Youngster I, Ben-Betzalel G, et al. Fecal microbiota transplant promotes response in immunotherapy-refractory melanoma patients. *Science* 2021;371:602–609. doi:10.1126/science.abb5920
27. Davar D, Dzutsev AK, McCulloch JA, et al. Fecal microbiota transplant overcomes resistance to anti–PD-1 therapy in melanoma patients. *Science* 2021;371:595–602. doi:10.1126/science.abf3363
28. Porcari S, Ciccarese C, Heidrich V, et al. Fecal microbiota transplantation plus pembrolizumab and axitinib in metastatic renal cell carcinoma: the randomized phase 2 TACITO trial. *Nat Med* 2026;32:1316–1324. doi:10.1038/s41591-025-04189-2
29. Spencer CN, McQuade JL, Gopalakrishnan V, et al. Dietary fiber and probiotics influence the gut microbiome and melanoma immunotherapy response. *Science* 2021;374:1632–1640. doi:10.1126/science.aaz7015
30. DeFilipp Z, Bloom PP, Torres Soto M, et al. Drug-resistant E. coli bacteremia transmitted by fecal microbiota transplant. *N Engl J Med* 2019;381:2043–2050. doi:10.1056/NEJMoa1910437
31. Powles T, Kann AG, Castellano D, et al. ctDNA-guided adjuvant atezolizumab in muscle-invasive bladder cancer (IMvigor011). *N Engl J Med* 2025;393:2395–2408. doi:10.1056/NEJMoa2511885
32. US Food and Drug Administration. TECENTRIQ (atezolizumab) prescribing information, BLA 761034: adjuvant treatment of adults with muscle-invasive bladder cancer after cystectomy who have circulating tumor DNA molecular residual disease (approved 15 May 2026; companion diagnostic Signatera CDx). https://www.accessdata.fda.gov/scripts/cder/daf/index.cfm?event=overview.process&ApplNo=761034 ; news summary: The ASCO Post, May 2026, https://ascopost.com/news/may-2026/fda-approves-atezolizumab-for-adjuvant-treatment-of-mrd-positive-mibc/
33. Vivier E, Rebuffet L, Narni-Mancinelli E, et al. Natural killer cell therapies. *Nature* 2024;626:727–736. doi:10.1038/s41586-023-06945-1
34. Fayette J, Licitra L, Harrington K, et al. INTERLINK-1: a phase III, randomized, placebo-controlled study of monalizumab plus cetuximab in recurrent/metastatic head and neck squamous cell carcinoma. *Clin Cancer Res* 2025;31:2617–2627. doi:10.1158/1078-0432.CCR-25-0073
35. Sallman DA, Garcia-Manero G, Daver N, et al. Magrolimab plus azacitidine versus placebo plus azacitidine in patients with untreated higher-risk myelodysplastic syndromes: the phase III ENHANCE study. *J Clin Oncol* 2026;44:2529–2542. doi:10.1200/JCO-25-00617
36. Fukumura D, Kloepper J, Amoozgar Z, Duda DG, Jain RK. Enhancing cancer immunotherapy using antiangiogenics: opportunities and challenges. *Nat Rev Clin Oncol* 2018;15:325–340. doi:10.1038/nrclinonc.2018.29
37. Summit Therapeutics. Ivonescimab in combination with chemotherapy approved in China by NMPA for first-line treatment of patients with squamous non-small cell lung cancer. Press release, 12 August 2026 (third Chinese indication; initial approval May 2024). https://smmttx.com/news/press-releases/news-details/2026/Ivonescimab-in-Combination-with-Chemotherapy-Approved-in-China-by-NMPA-for-First-Line-Treatment-of-Patients-with-Squamous-Non-Small-Cell-Lung-Cancer/default.aspx (company-reported)
38. Xiong A, Wang L, Chen J, et al. Ivonescimab versus pembrolizumab for PD-L1-positive non-small cell lung cancer (HARMONi-2): a randomised, double-blind, phase 3 study in China. *Lancet* 2025;405:839–849. doi:10.1016/S0140-6736(24)02722-3
39. Summit Therapeutics. Summit Therapeutics reports financial results and operational progress for the first quarter ended March 31, 2026. Press release, 30 April 2026 (PDUFA goal date 14 November 2026 for ivonescimab plus chemotherapy in EGFR-mutant NSCLC; HARMONi-3 early interim analysis did not meet its significance threshold, trial continuing). https://smmttx.com/news/press-releases/news-details/2026/Summit-Therapeutics-Reports-Financial-Results-and-Operational-Progress-for-the-First-Quarter-Ended-March-31-2026/default.aspx (company-reported)
40. ecancer. WCLC 2026: Analysis shows ivonescimab significantly improves overall survival versus pembrolizumab in PD-L1-positive advanced NSCLC. News report of a conference presentation, 15 September 2026 (also reports the April 2025 approval in China for this population). https://ecancer.org/en/news/28884-wclc-2026-analysis-shows-ivonescimab-significantly-improves-overall-survival-versus-pembrolizumab-in-pd-l1-positive-advanced-nsclc (interim conference data, not yet published in full)
41. Le X, Passaro A, Zhao Y, et al. Ivonescimab plus chemotherapy versus placebo plus chemotherapy in patients with advanced EGFR-mutated non-small-cell lung cancer after disease progression on EGFR tyrosine kinase inhibitor therapy (HARMONi): a multicentre, randomised, double-blind, phase 3 trial. *Lancet Oncol* 2026;27:1094–1109. doi:10.1016/S1470-2045(26)00282-2
42. Schouten A. Addressing the financial implications of PD-1/PD-L1 immune checkpoint inhibitors: a policy analysis of access and inclusion on the WHO Model List of Essential Medicines. Report for the 25th WHO Expert Committee on Selection and Use of Essential Medicines, January 2025. https://cdn.who.int/media/docs/default-source/2025-eml-expert-committee/addition-of-new-medicines/a.22-pd1-pdl1-icis_financial-impact-report.pdf
43. Patil VM, Noronha V, Menon N, et al. Low-dose immunotherapy in head and neck cancer: a randomized study. *J Clin Oncol* 2023;41:222–232. doi:10.1200/JCO.22.01015
44. World Health Organization / Pan American Health Organization. WHO updates list of essential medicines to include key cancer, diabetes treatments. News release, 8 September 2025. https://www.paho.org/en/news/8-9-2025-who-updates-list-essential-medicines-include-key-cancer-diabetes-treatments
45. Ikonomou L, Cuende N, Forte M, et al. International Society for Cell & Gene Therapy position paper: key considerations to support evidence-based cell and gene therapies and oppose marketing of unproven products. *Cytotherapy* 2023;25:920–929. doi:10.1016/j.jcyt.2023.03.002
46. Grippin AJ, Marconi C, Copling S, et al. SARS-CoV-2 mRNA vaccines sensitize tumours to immune checkpoint blockade. *Nature* 2025;647:488–497. doi:10.1038/s41586-025-09655-y (retrospective MD Anderson cohorts: in stage III/IV non-small-cell lung cancer, 180 vaccinated within 100 days of starting a checkpoint inhibitor vs 704 unvaccinated, median overall survival 37.3 vs 20.6 months, adjusted HR 0.51, 95% CI 0.37–0.71; in melanoma, 43 vs 167, HR 0.37, 95% CI 0.18–0.74; no survival improvement with influenza or pneumonia vaccines)
47. Arbel R, Rokach L, Razi T, Tadmor T. Validation of "SARS-CoV-2 mRNA vaccines sensitize tumors to immune checkpoint blockade" in an independent cohort of 4,407 patients. *Cancer Lett* 2026;643:218319. doi:10.1016/j.canlet.2026.218319
48. Karadakic R, Keating NL, Barnett ML. Interpreting vaccine-associated survival differences in immune checkpoint inhibitor therapy. *Proc Natl Acad Sci U S A* 2026;123:e2621501123. doi:10.1073/pnas.2621501123 (100% Medicare fee-for-service; among 10,824 people starting checkpoint inhibitors, mortality hazard ratios were 0.67 for mRNA COVID-19 vaccination, 0.68 for adenoviral and 0.64 for influenza, with similar gains among 121,676 people starting any systemic anticancer therapy)
49. ClinicalTrials.gov. Universal Immunization to Fortify Immunotherapy Efficacy and Response (UNIFIER), NCT07597070: randomized (1:1) phase 2 with a non-randomized patient-preference cohort, 500 patients planned in all, with stage IV non-small-cell lung cancer, University of Florida with MD Anderson, registered start November 2026; primary endpoint immune-related adverse events requiring hospitalization, progression-free survival secondary. https://clinicaltrials.gov/study/NCT07597070 (checked October 2026; not yet recruiting)
50. Fransen MF, Schoonderwoerd M, Knopf P, et al. Tumor-draining lymph nodes are pivotal in PD-1/PD-L1 checkpoint therapy. *JCI Insight* 2018;3:e124507. doi:10.1172/jci.insight.124507
51. Coutzac C, Jouniaux JM, Paci A, et al. Systemic short chain fatty acids limit antitumor effect of CTLA-4 blockade in hosts with cancer. *Nat Commun* 2020;11:2168. doi:10.1038/s41467-020-16079-x (in two melanoma cohorts treated with ipilimumab, high blood butyrate and propionate were associated with shorter progression-free survival and more regulatory T cells)
