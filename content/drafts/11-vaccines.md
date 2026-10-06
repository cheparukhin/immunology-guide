---
id: 11-vaccines
title: Cancer Vaccines and Oncolytic Viruses
subtitle: The most successful cancer vaccines never show the immune system a cancer cell. The newest are made from the mutations in one patient's tumor.
part: III
reading_time: 27
hero: ch11-hero
---

In 2024, public-health researchers in Scotland linked the screening, vaccination and cancer records of women born between 1988 and 1996, and looked for cervical cancer among those vaccinated against {{hpv|human papillomavirus (HPV)}} at school, at age 12 or 13.[^1] They found no cases at all.

That is a very strong signal but not proof: the women vaccinated at 12 or 13 were only in their mid-twenties when the data were extracted in 2020, an age at which cervical cancer is still uncommon. The vaccine never shows the immune system a cancer cell. It teaches the body to recognize a virus, and the cancers that virus would have caused never begin.

A very different cancer vaccine is made one patient at a time, by sequencing a removed tumor's DNA and encoding dozens of its mutations in a strand of {{mrna|messenger RNA (mRNA)}}. In August 2026, Moderna and Merck announced that a large trial of their version had met its main goal (company-reported; full data were still to come).[^2]

A third approach needs no predefined target: viruses that turn a tumor into its own vaccine.

## Two very different promises

A {{vaccine|vaccine}} shows the immune system a harmless version of a threat ([Chapter 3](03-adaptive.html)), so that the rare {{b-cell|B cells}} and {{t-cell|T cells}} whose receptors already bind it multiply ({{clonal-expansion|clonal expansion}}) and leave {{memory-cell|memory cells}} behind.

"Cancer vaccine" covers two different things. A {{preventive-vaccine|preventive vaccine}} is given to healthy people before they are exposed to one of the few viruses that cause cancer. Its target is foreign and known in advance, and {{antibody|antibodies}} are already circulating when the virus arrives.

A {{therapeutic-vaccine|therapeutic vaccine}} is given to someone who already has cancer. Its target is a tumor of possibly billions of cells, built from the body's own cells (so almost everything about it looks like self, unless a virus caused it) and already able to evade immune attack ([Chapter 7](07-escape.html)).

The two kinds also rely on different immune cells, which determines what each vaccine is made of. Blocking a virus before it enters cells is a job for antibodies, and a harmless protein is enough to activate the B cells and helper T cells behind them: {{dendritic-cell|dendritic cells}} take it up and present short fragments of it, called {{peptide|peptides}}, on MHC class II ([Chapter 4](04-presentation.html)). Killing a cancerous cell is a job for {{cd8-t-cell|killer T cells}}, which recognize only peptides on MHC class I, drawn from proteins made inside the cell. An injected protein reaches class I only by {{cross-presentation|cross-presentation}}, a specialty of a few kinds of dendritic cell, so many newer therapeutic vaccines have the body's own cells produce the target protein, from mRNA or an engineered virus.

:::key-idea
Preventive cancer vaccines block the viruses behind some cancers, and where they are widely used those cancers have fallen sharply. Therapeutic vaccines try to turn the immune system against a tumor that already exists, a much harder problem on which trials are only beginning to show benefit.
:::

## The cancer vaccines that already work

Infections cause roughly one in eight new cancers worldwide, about 2.2 million cases in 2018, including some 690,000 from HPV and 360,000 from hepatitis B virus.[^3] Vaccines prevent infection with both.

### HPV: a virus that disarms the cell's safeguards

HPV spreads through intimate skin contact and is very common. Most infections clear, but persistent infection with a "high-risk" type, above all HPV16 or HPV18, can over many years cause cancer of the cervix, anus, throat, penis, vulva or vagina. Two viral proteins, E6 and E7, cause the damage by disabling the cell's {{tumor-suppressor|tumor suppressors}}, the proteins that stop damaged cells from dividing ([Chapter 6](06-cancer.html)).

The vaccine contains no virus, only L1, the major protein of the viral capsid (the protein shell that encloses the virus's DNA). L1 self-assembles into empty capsids called {{virus-like-particle|virus-like particles}}.[^4] B cells respond with {{neutralization|neutralizing antibodies}}, antibodies that bind incoming virus and block it from entering cells.

This design has one big limitation. Antibodies cannot reach virus inside cells, and persistently infected cells, like the cancers they can become, make little or no L1, the capsid protein the vaccine targets. The vaccine therefore prevents infection but cannot cure it: in a trial of 2,189 young women in Costa Rica who already carried HPV, vaccination did not speed up clearance.[^5]

This is why WHO advises vaccinating girls aged 9 to 14, before they become sexually active; by 2022, 47 countries vaccinated boys too.[^4] Age at vaccination makes a large difference:

- **Sweden** (1.7 million girls and women followed 2006–2017): compared with no vaccination, vaccination before age 17 was linked to an 88% lower rate of invasive cervical cancer, and vaccination at 17–30 to a 53% lower rate.[^6]
- **England**: compared with earlier, unvaccinated cohorts of women in their twenties, cervical cancer fell by 87% in those offered the vaccine at 12–13, by 62% at 14–16 and by 34% at 16–18.[^7]

:::figure ch11-hpv
title: Cervical cancer prevented, by age at vaccination
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

  STYLE. Light stage (real data). Bars use the chart token --chart-1 (not entity colors); the selected bar is darker and outlined, with a bold label. Whiskers in ink-2. No gridlines beyond a light 0/50/100 reference. A visible source line under the chart (ink-3, 12 px) names the current dataset's paper, and every bar's tooltip repeats its source. Build with shared chart.js (bars with whiskers, focusable rows) and unit-grid.js (states: filled / outline+check).

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

These are early results in young women; the lifetime effect, and the effect on other HPV-related cancers, will take decades to measure.

:::clinic
Vaccination does not replace screening: people vaccinated late or not at all still benefit from screening, and no vaccine covers every cancer-causing HPV type. The burden of HPV-related cancer is heaviest in low-income countries,[^3] one reason WHO endorsed a cheaper single-dose schedule in 2022.[^4]
:::

:::deep-dive How a virus causes cancer, and how a virus-like particle prevents it
HPV is a small DNA virus that infects basal cells, the dividing cells at the base of skin and mucous membranes. To replicate its DNA it needs the host cell's DNA-replication enzymes to be active. Its protein E7 binds and inactivates Rb, a tumor suppressor that normally keeps the cell from entering the cell cycle (the sequence of DNA copying and division); its protein E6 marks p53, the cell's damage sensor, for degradation. A cell that keeps dividing without working p53 accumulates further mutations. In many HPV-driven cancers, the viral DNA has been integrated into the cell's own chromosomes, and E6 and E7 are expressed continuously.

The preventive vaccines contain neither protein. They are made only of the capsid protein L1, produced by recombinant DNA technology. L1 self-assembles into empty, type-specific virus-like particles; vaccines differ in how many HPV types they cover, from two (bivalent: types 16 and 18) to nine (nonavalent).[^4] Neutralizing antibodies in the blood pass into the genital tract and block the virus before it can enter cells. In the Costa Rica trial, the control group received a hepatitis A vaccine, and the HPV vaccine made no difference to infections already under way.[^5]

The particle's structure explains why the vaccine works so well, often after a single dose. Each particle is built from 360 copies of L1, arranged as 72 pentamers (five-copy units) in a dense, regular lattice. A B cell whose {{bcr|B-cell receptors}} recognize L1 can bind many copies at once, and receptors clustered that densely send an unusually strong signal to activate and survive. Virus surfaces produce this clustering; most soluble proteins, which float free as separate molecules, don't. This produces a durable population of long-lived {{plasma-cell|plasma cells}}, the antibody-secreting cells that activated B cells become.[^34] In the Costa Rica trial's long-term follow-up, women who happened to receive only one dose still had stable antibody levels 11 years later, and seemed about as well protected against HPV16 and HPV18 infection as women given three.[^35]

A therapeutic HPV vaccine targets proteins made inside infected cells, such as E6 and E7, and aims to {{priming|prime}} T cells that kill cells already infected, rather than to induce neutralizing antibodies that block entry. Such vaccines are in clinical testing. In a small Dutch study, synthetic peptides from HPV16's E6 and E7 shrank precancerous lesions of the vulva in 15 of 19 women within a year, clearing 9 completely.[^32] In August 2025 the FDA approved one for a benign HPV disease: zopapogene imadenovec (Papzimeos), a replication-deficient adenovirus (one that cannot copy itself) that expresses fragments of HPV6 and HPV11 proteins, for adults with recurrent respiratory papillomatosis. In this disease, the two low-risk types cause papillomas, wart-like growths in the airway that return however often surgeons remove them. In its single-arm trial, 18 of 35 patients needed no further surgery for a year.[^33] No therapeutic vaccine is yet approved for an HPV-driven cancer. A phase 3 trial of one in HPV16-positive head and neck cancer was stopped in 2026 after enrolling a dozen patients; the sponsor's registry record gives financial constraints as the reason, not safety or any sign that the vaccine was failing.[^46] Smaller trials continue.
:::

### Hepatitis B: preventing liver cancer from birth

Hepatitis B virus ({{hbv|HBV}}) infects the liver. Babies infected at birth, usually by their mothers, often become chronic carriers, infected for life, and decades of inflammation can lead to liver cancer. In a study that followed 22,707 Taiwanese men, chronic carriers developed liver cancer at roughly 200 times the rate of non-carriers.[^40]

In July 1984, Taiwan began vaccinating the newborns of infected mothers with hepatitis B surface antigen (HBsAg), a harmless protein from the virus's surface; from July 1986, every newborn was included.[^8] A 2016 analysis found liver cancer among Taiwanese aged 6 to 26 to be about three-quarters lower in vaccinated birth cohorts than in earlier ones (0.23 versus 0.92 cases per 100,000 people per year). The gap narrowed with age, to 58% in those aged 20 to 26, and the remaining cases clustered among children who had missed doses or whose mothers had very high viral loads.[^9] The hepatitis B vaccine is often called the first anticancer vaccine.

## Why vaccinating against a tumor is so much harder

Researchers have tried for more than a century to vaccinate people who already have cancer against their own tumor (see the [Interlude](interlude-history.html)), mostly without success. In 2004, Steven Rosenberg's group at the US National Cancer Institute tallied its own vaccine trials: of 440 patients, mostly with advanced melanoma, only 2.6% had measurable tumor shrinkage.[^10] In hindsight, researchers identify four weak links: a useful framework, not a settled verdict.

**1. Targets the body tolerates.** Early vaccines mostly used {{tumor-associated-antigen|tumor-associated antigens}}, normal proteins that tumors often overproduce but healthy cells also make. {{negative-selection|Negative selection}} in the thymus, part of {{tolerance|central tolerance}} ([Chapter 5](05-t-cells.html)), deletes many of the T cells that recognize self peptides with high {{affinity|affinity}}; the survivors tend to bind them weakly.

**2. Alarms too weak.** A {{peptide|peptide}} injected without a strong {{adjuvant|adjuvant}} (an ingredient that triggers the innate danger signals of [Chapter 2](02-innate.html)) supplies a target without an alarm. Dendritic cells then present the target to naive T cells without {{costimulation|costimulation}} (signal 2, [Chapter 4](04-presentation.html)), and T cells that receive signal 1 alone tend to become {{anergy|anergic}}: alive but unresponsive. The signals that count are those that drive dendritic-cell maturation, not inflammation in general; tumors often carry plenty of wound-healing inflammation ([Chapter 2](02-innate.html)).

**3. Too much tumor, too late.** Vaccines were mostly tested in people whose cancer had {{metastasis|metastasized}} (spread to distant sites), so newly activated T cells were outnumbered by billions of cancer cells in an immunosuppressive {{tumor-microenvironment|tumor microenvironment}}.

**4. The brakes are on.** T cells reaching the tumor often meet {{pd-l1|PD-L1}}, which binds {{pd-1|PD-1}}, an inhibitory receptor (a brake) on T cells. Persistent stimulation by antigen also drives them into {{exhaustion|exhaustion}}, a state in which they kill and multiply poorly. A vaccine can expand tumor-specific T cells, but it cannot release the brakes.

The framework doesn't explain everything. MAGRIT, one of the largest randomized trials, assigned 2,312 people whose lung cancers had been removed to placebo or to a vaccine against MAGE-A3, given with a potent adjuvant. MAGE-A3 is a {{cancer-testis-antigen|cancer-testis antigen}}, a protein that normal adult tissues other than the testis barely make. The trial addressed links 2 and 3, and arguably link 1, yet the cancer came back equally often in both groups;[^11] the reason is still debated.

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
  - "T cells trained": a unit-grid row of 8 small blue dots (shared unit-grid.js), filled to the count above.
  - "Fit to target": "Loose" or "Snug" (text plus icon).
  - "Outcome (cartoon)": one of three tiers, shown with the foundation outcome badge and text (verbatim):
    Tier 0 (badge ✕): "Little or no effect"
    Tier 1 (badge ≈): "A response, no clear benefit"
    Tier 2 (badge ✓): "The combination now in trials: early results suggest fewer relapses than anti-PD-1 alone, but this is not yet proven."
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
  B. "Personal mRNA vaccine + anti-PD-1 after surgery" → Neoantigens, Strong, Microscopic, Released (tier 2). Caption: "Neoantigens, mRNA, early disease and released brakes. In a 157-patient melanoma trial, relapses were less common with the vaccine than with anti-PD-1 alone, a borderline result. A personalized mRNA vaccine met its main goal in a phase 3 melanoma trial (company-reported, 2026); not yet approved." (The last sentence is STATUS['mrna-vaccine'].text from shared/cycle-data.js; import it rather than retyping it.)

  DISCLAIMER (always visible, small, ink-3, verbatim): "A cartoon of a framework, not a simulation of any real trial. Anti-PD-1 after surgery lowers the risk of relapse on its own; trials measure what a vaccine adds. Real outcomes depend on many more factors."

  ACCESSIBILITY & MOTION. Switches are native toggle buttons (aria-pressed) with visible focus; captions go to an ARIA live region. Under prefers-reduced-motion, jump directly to each end state with a quick cross-fade and no budding/killing animation. Pause all motion when the figure is off-screen.

  STAGE TAG. "Illustrative" (top right, t-caps), since the tiers and dot counts are a teaching model, not data.

  VISUAL VOCABULARY (FIGURE-AUDIT §4). Dendritic cell: dendriticCell({ state: 'immature' }) for Weak, 'mature' for Strong. Lymph-node panel interior: lymphNodeField. Photocopying: cell-actions.divide(). Recognition: TCR meets mhc1 head to head, then a recognition ring plus a green-cyan "+" disc. PD-1/PD-L1: library pd1 on T cells, pdl1 on cancer cells; an engaged pair shows interlocked heads plus one crimson "−" disc on the T-cell side. Anti-PD-1: antibody({ variant: 'therapeutic' }) capping PD-1, Fc pointing away. Kills: cell-actions.kill grammar (dock, granules, setDying; the killer detaches intact); nothing flashes. Unit grid for the dot row; outcome badges from the foundation (✕ / ≈ / ✓).

  SCIENTIFIC GUARDRAILS. Dendritic cells present peptides on MHC; they do not kill. T cells recognize a peptide held in an MHC cup, never a free-floating protein. Antibodies (gold Ys) bind PD-1 on the T cell (anti-PD-1); do not draw them on cancer cells. Signal 2 matters only for the naive T cells being primed in the lymph node; armed killers in the tumor panel need no "+" disc to kill.
alt: Two scenes: a lymph node, where a dendritic cell primes T cells, and a tumor, where those T cells attack cancer cells. Four switches set the vaccine's target (a tumor-associated antigen that normal cells also make, or neoantigens from tumor mutations), the strength of its adjuvant's alarm, the tumor's size at vaccination, and whether PD-1 brakes are released. In this simplified model, many high-affinity T cells reach a small tumor and keep killing only when all four are favorable. Two presets compare a 1990s peptide vaccine with today's personalized mRNA approach.
:::

### Two early wins

The first therapeutic cancer vaccine approved by the US Food and Drug Administration (FDA), in 2010, was **sipuleucel-T (Provenge)** for advanced prostate cancer. Strictly, it is a cell therapy: a patient's own blood immune cells, including {{antigen|antigen}}-presenting cells, are exposed in the lab to a prostate protein fused to an immune-stimulating {{cytokine|cytokine}} and then infused back. In the pivotal trial of 512 men, median survival rose from 21.7 to 25.8 months, but the time to progression (until scans showed the cancer growing) did not change.[^12]

For about half a century, doctors have also treated early bladder cancer by washing **{{bcg|BCG}}**, the weakened tuberculosis-vaccine bacterium, into the bladder (see the [Interlude](interlude-history.html)); it remains a standard treatment for higher-risk early disease.[^13] BCG has no tumor-specific target; it acts as a nonspecific immune stimulant, and the inflammation it causes recruits immune cells that attack the tumor by mechanisms not yet fully understood. One candidate is {{trained-immunity|trained immunity}}, the innate reprogramming described in Chapter 2: in one study, a gene variant that affects it was linked to how often bladder cancer progressed or returned after BCG.[^36][^37]

Neither success relied on a foreign target: sipuleucel-T's is a tumor-associated antigen that normal prostate cells also make, and BCG has none.

:::deep-dive Lessons from the early trials
In 2004, Rosenberg's team wrote that optimism about cancer vaccines rested more on surrogate measures, such as T cells counted in blood, than on tumors regressing.[^10] For two decades, many trials reported "immune responses" while patients' cancers grew.

MAGRIT shows how hard the problem was even when a trial was done well. To find 2,312 eligible patients, investigators screened 13,849 lung-cancer samples; only about a third expressed MAGE-A3. Of those randomized, 1,515 received the protein with a potent adjuvant (13 injections planned over 27 months), 757 received placebo, and 40 never started treatment. The hazard ratio for disease-free survival was 1.02 (1.0 means no effect), and development stopped.[^11]

Older vaccines relied on alum, aluminum salts that are good at inducing antibodies but weak at priming killer T cells.[^38] Many modern adjuvants are purified or synthetic copies of the microbial molecules that Chapter 2's {{toll-like-receptor|Toll-like receptors}} detect. MAGRIT's mixture contained two of them, a detoxified fragment of bacterial {{lps|LPS}} and a synthetic DNA strand that mimics bacterial DNA, plus a saponin (a soap-like molecule) from tree bark that activates dendritic cells by a different route,[^39] and the 2017 Boston peptide vaccine used a synthetic double-stranded RNA.[^16]

Cancer-testis antigens such as MAGE-A3 are made in healthy adults mainly in the testis, which is partly shielded from the immune system. Tolerance to such proteins was expected to be weaker than to ordinary self proteins, so MAGRIT's failure shows that tolerance is not the whole story. Proposed explanations include patchy expression within tumors, the weakness of protein vaccines at priming CD8 killer T cells (which requires cross-presentation), and PD-1 brakes left active in an era before checkpoint inhibitors; how much each contributed is still debated.

Sipuleucel-T's pattern, longer survival without a delay in progression, is unusual and still prompts debate about how the treatment works.[^12]

Modern vaccine trials choose targets the immune system does not tolerate, use far stronger delivery platforms, treat earlier, pair vaccines with checkpoint inhibitors, and count recurrences and deaths rather than laboratory measures of immune response.
:::

## A vaccine written from one tumor

A tumor's own {{mutation|mutations}} are a source of foreign targets: some put a new fragment into the cell's {{mhc-class-i|MHC class I}} display ([Chapter 6](06-cancer.html)). These {{neoantigen|neoantigens}} are close to ideal targets, because healthy cells don't carry them and the thymus never displayed them during {{negative-selection|negative selection}}, which deletes T cells that react strongly to self.

But most neoantigens are unique to one person's tumor, so each vaccine must be designed from scratch, and fast:

1. **Read.** Tumor tissue, usually from surgery, and blood, a source of the patient's normal, inherited (germline) DNA, are {{sequencing|sequenced}} and compared to find the mutations present only in the tumor.
2. **Predict.** {{hla|HLA}} typing identifies which HLA molecules (the human MHC) the patient carries: up to six main class I types per person. Software then estimates how tightly each mutant fragment will bind them, its binding {{affinity|affinity}}. Because HLA types differ between people, a good target in one patient may not be displayed in another.
3. **Choose.** The top candidates are kept: up to 34 in Moderna and Merck's vaccine (intismeran autogene) and up to 20 in BioNTech and Genentech's (autogene cevumeran).[^2][^14] Designers favor {{clonal-neoantigen|clonal}} mutations, present in every cancer cell, because a vaccine aimed at one branch of the tumor's family tree leaves the others free to grow.
4. **Encode.** The chosen stretches, each a short run of protein around one mutation, are encoded in tandem in mRNA and packaged in lipids (fat-like molecules): {{lipid-nanoparticle|lipid nanoparticles}} injected into a muscle for Moderna and Merck's vaccine,[^15] an RNA–lipid complex (lipoplex) infused into a vein for BioNTech and Genentech's (a box below explains why).[^14]
5. **Give.** Doses follow over months, usually with a {{checkpoint-inhibitor|checkpoint inhibitor}}. In one study, manufacturing took about six weeks, and the first dose came a median of nine weeks after surgery.[^14]

Cells that take up the mRNA, including dendritic cells, translate it into the encoded protein stretches and present fragments of them on class I. The RNA and its lipid carrier also activate {{pattern-recognition-receptor|pattern-recognition receptors}}, the innate immune system's sensors for signs of infection, and so act as a built-in adjuvant.

:::deep-dive Tuning the alarm
Cells treat RNA arriving from outside as a sign of infection: pattern-recognition receptors such as TLR7 ([Chapter 2](02-innate.html)) respond by inducing type I {{interferon|interferons}}, the antiviral signaling proteins of the innate alarm. Interferon is a useful adjuvant, but it also makes cells slow protein synthesis, so an RNA vaccine risks suppressing production of the protein it encodes.

In 2005, Katalin Karikó and Drew Weissman showed that replacing uridine, one of RNA's four nucleosides (the base-and-sugar units behind its four "letters"), with a chemically modified version largely hides RNA from these receptors.[^41] The COVID-19 mRNA vaccines use one such modified nucleoside, N1-methylpseudouridine,[^42] and rely partly on their lipid nanoparticles, whose lipids are themselves adjuvants, for immune activation.[^43] Karikó and Weissman shared the 2023 Nobel Prize in Physiology or Medicine for the discovery.

Cancer vaccines can make the opposite choice. BioNTech and Genentech's autogene cevumeran uses unmodified RNA.[^14] In mice, lipoplexes of this kind infused into a vein are taken up by dendritic cells in lymphoid organs throughout the body and, by design, set off a burst of interferon resembling the early phase of a viral infection.[^44] Which approach works better against cancer is not yet known.
:::

Neoantigen prediction is the weakest step: software can estimate which fragments *could* be displayed, but not reliably which ones T cells will respond to. In the pancreatic-cancer study described below, only 25 of the 230 neoantigens put into vaccines (11%) drew a T-cell response strong enough to detect directly in blood.[^14] In an earlier melanoma study, 60% of the chosen fragments drew a helper-T-cell response but only 16% a killer-T-cell response.[^16] Because so many chosen targets fail, each vaccine includes many.

Helper responses are not wasted: helper T cells license dendritic cells and sustain killer T cells ([Chapter 5](05-t-cells.html)). Killers primed without help also form poorer memory, and memory is what a vaccine given after surgery must leave behind. Newer designs therefore include fragments for class II.

:::figure ch11-personal-vaccine
title: Design a personal vaccine
goal: After using this, the reader understands that choosing neoantigens means weighing how well a fragment is predicted to fit the patient's own HLA molecules and whether it stands out from normal, plus clonality; that the same mutation can be useful for one patient and useless for another; and that because predictions are imperfect, a vaccine needs several targets, ideally ones shared by every cancer cell.
kind: explorer
stage: dark
spec: |
  PURPOSE. A small design game in four phases (a stepper wraps the game; see steps). The reader picks up to four mutations from eight, "makes" the vaccine, sees which picks actually triggered T cells, and then sees which parts of the tumor were covered and which grew back. All data are illustrative (fixed table below), not real predictions; show a small "Illustrative data" tag in the corner.

  LAYOUT (desktop).
  - TOP-LEFT: "Tumor family tree", drawn in exactly the tree style of ch06-clonal-evolution (same task as ch06-antigen-kinds): a thick labeled "Trunk: in every cancer cell" splitting into two hue-shifted branches with letter labels and hatches, "Branch B (55% of cells)" and "Branch C (45%)". Use cancerCell({ clone }) / shiftHue within ±25°, always with the letter or hatch (never color alone).
  - TOP-RIGHT: "The tumor". ~60 cancer cells (violet-magenta, irregular) packed into a mass; 33 belong to branch B and 27 to branch C, in two intermixed patches. Each cell carries its branch letter or hatch; patch boundaries faintly outlined.
  - MIDDLE: "Whose tumor?". A two-position toggle: "Patient 1" | "Patient 2", each illustrated by a small shop window (a row of six mhc1 cups from the art library's pocket variants, drawn at ≥ 14 px) whose pocket shapes differ visibly between the two patients. (Optional: allele names such as A*02:01 appear only in a tooltip.) Micro-caption (verbatim): "Same tumor, different HLA types: a thought experiment. Each person's HLA molecules hold different fragments, so the predictions change."
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
  Step 3 ("Make & test"): pressing "Make & test" animates the chosen peptides sliding into their bead slots and the strand being wrapped in a small fatty sphere (~1.2 s). Then each chosen card flips: successful ones show a ✓ badge, a blue T-cell icon and "T cells responded"; failures show a ✕ badge and a grey "No response". A summary line (computed): "{k} of your {n} picks triggered a T-cell response." Then, verbatim: "This game is kinder than reality. Here about one mutation in three works; in one pancreatic-cancer vaccine study, about one target in nine drew a T-cell response strong enough to detect directly in blood. That is why real vaccines carry up to 20 or 34 targets, not four."
  Step 4 ("Months later"): 3–4 blue T cells arrive; then most cells carrying at least one successful mutation (trunk = all cells; Branch X = cells of that branch) get a blue outline and shrink and fade (apoptosis), ~1.5 s, staggered. Leave 2–3 outlined cells alive inside the cleared patches (they stay outlined but intact). Cells with no successful target remain; if a branch is untouched, its cells then slowly multiply (budding) to refill part of the space (~2 s). Outcome message (computed, verbatim templates):
    - All branches covered: "Every cancer cell carried at least one target the T cells recognized."
    - Some covered: "T cells attacked the branches they could see. Branch {X} carried none of your successful targets, and grew back."
    - None covered: "None of your picks triggered T cells. In real trials, too, some patients' vaccines produce no detectable response."
  Then always, verbatim: "Even cells with a recognized target are not all killed: some stop displaying it, and some sit where T cells cannot work. Covering every branch helps; it does not guarantee a cure."
  A "Try again" button returns to step 2 with the same patient; a "Reset" returns to step 1.

  MOBILE (< 600px). Stack: tree (compact, ~120px tall) → tumor (square, ~260px) → patient toggle with the two small shop windows → vaccine bead bar, sticky at the bottom of the figure while choosing → cards in a 2-column grid (4 rows). Each card: name and location on one line, peptide on the next, then the fit bar, then the "Stands out?" icon. Tap targets ≥ 44px.

  ACCESSIBILITY. Cards are buttons (aria-pressed) reachable by Tab; selection count and phase results are announced in an ARIA live region. Under prefers-reduced-motion, replace flips and apoptosis with instant state changes and a brief highlight.

  STAGE TAG. "Illustrative" (top right, t-caps). The demo ratio (about 1 in 3) always appears beside the real one (about 1 in 9) in the step 3 caption.

  SCIENTIFIC GUARDRAILS. Show peptides as short strings (usually 8–10 letters; here 9), never whole proteins. Mutant peptides are hot pink with a glow; normal peptides sand. Do not imply that one mutation equals one "drug". The mRNA "strand" should read as one strand carrying several segments in a row. Do not show the vaccine acting directly on cancer cells: the effect in step 4 is due to T cells. Branches are nested: every cell has the trunk mutations plus the mutations of exactly one branch.
steps:
  1. Read the tumor. Sequencing of tumor and normal DNA has found eight mutations that change a protein. Every cancer cell carries the three "trunk" mutations; the others belong to only one branch of the tumor's family tree.
  2. Choose up to four. Each card shows a mutant fragment's predicted binding to this patient's HLA molecules and whether it stands out: abundant protein, clearly different from the normal version.
  3. Make and test. Your picks are encoded together in mRNA and given as a vaccine. Some trigger T cells and some don't, often contrary to the predictions.
  4. Months later. T cells attack the cancer cells that carry a target they recognize. Any branch without a recognized target can grow back.
alt: An interactive design game. A tumor with two branches carries three "trunk" mutations in every cell plus mutations specific to each branch. The reader chooses up to four of eight candidate mutations, each scored for predicted binding to the patient's HLA molecules and for whether it stands out from normal. After "vaccination", only some picks trigger T cells, and any branch without a recognized target grows back. Switching to a patient with different HLA types changes the predictions, showing why each vaccine must be personal.
:::

Proof of concept came in 2017, in two papers published side by side: a Boston team vaccinated six melanoma patients with up to 20 neoantigens as synthetic peptides, and a BioNTech team in Mainz, Germany, vaccinated 13 using RNA.[^16][^17] The vaccines produced T cells that recognized the mutated fragments, and several patients stayed free of relapse, but with no comparison group the vaccine's contribution could not be measured. One Mainz patient's cancer returned having lost {{b2m|B2M}}, the small protein subunit every MHC class I molecule needs ([Chapter 7](07-escape.html)), and with it all class I display.[^17]

:::deep-dive How the targets are chosen
**Finding the mutations.** Tumor and normal (germline) DNA are sequenced, and software compares millions of short reads, the individual stretches of sequence the instrument produces, to find changes present only in the tumor. Single-base substitutions are the most common; small insertions or deletions that shift the reading frame, called {{frameshift|frameshift mutations}}, are especially valuable, because they produce long stretches of new protein. The fraction of reads carrying each mutation, corrected for the share of normal cells in the sample and for how many copies of that stretch of DNA the cancer cells carry, estimates whether a mutation is clonal or subclonal.

**HLA typing.** The patient's HLA types are read from the same sequencing data. Most people carry two {{allele|alleles}}, or inherited versions, each of the HLA-A, -B and -C genes, so up to six class I types, plus several class II types. Each type binds a different range of peptides.

**Predicting binding.** Tools such as NetMHCpan and MHCflurry are neural networks trained on measured peptide–HLA binding affinities and on peptides isolated from cells' HLA molecules and identified by mass spectrometry. They are good at class I peptides, which are usually 8 to 10 amino acids long, and less reliable for the longer, more variable peptides bound by class II.

**Predicting recognition.** A displayed fragment is not necessarily recognized, so pipelines also weigh how strongly the tumor expresses the mutant protein and how different the fragment is from the normal peptide. Even so, many chosen targets draw no detectable response.

**Helper responses.** Most responses in the 2017 Boston study came from CD4 helper rather than CD8 killer T cells.[^16] One likely reason is the format: long peptides injected under the skin are taken up from outside by dendritic cells, the class II route, while class I display depends on cross-presentation ([Chapter 4](04-presentation.html)). Class II peptide-binding grooves are also open at both ends and bind a wider variety of peptides. The pancreatic RNA vaccines encoded neoantigens for both classes and drew strong CD8 responses too.[^14]

**Why many targets also make escape harder.** When the Omicron variant changed the coronavirus's spike protein in late 2021, vaccine-induced antibodies and memory B cells recognized it much less well (memory B-cell recognition of its receptor-binding domain fell to 42% of the level for the original strain), yet vaccine-induced T-cell responses kept about 85% of their strength against it.[^45] The T-cell response is spread across many {{epitope|epitopes}}, the short fragments that individual T-cell receptors recognize, and no single set of mutations changes them all. The same holds for tumors, which is one reason they tend to escape a broad attack wholesale, by shutting down class I display ([Chapter 7](07-escape.html)).

**Number of targets.** The caps of 20 and 34 are practical design choices. Even pancreatic tumors, with relatively few mutations, yielded enough candidates for a vaccine in all but one of 19 patients whose tumors were analyzed.[^14]
:::

## The evidence so far

In {{clinical-trial|clinical trials}}, mid-sized phase 2 studies look for signs of benefit, ideally against a randomly assigned comparison group, and large phase 3 studies, often blinded with a placebo so that nobody knows who got what, decide whether a treatment works. A single-arm trial has no comparison group.

### Melanoma: a vaccine plus a checkpoint inhibitor

After surgery for high-risk melanoma, patients often receive a year of pembrolizumab (Keytruda) as {{adjuvant-therapy|adjuvant therapy}}, treatment to destroy undetectable leftover cancer cells (unrelated to a vaccine's adjuvant).

The phase 2b trial KEYNOTE-942 randomly assigned 157 people with completely removed stage IIIB–IV melanoma, two to one, to Moderna and Merck's vaccine plus pembrolizumab or to pembrolizumab alone. After about two years, 22% of the vaccine group and 40% of the comparison group had relapsed or died. With so few patients the result was statistically borderline, and severe side effects were somewhat more common with the combination (25% versus 18%).[^18] At five years the gap had held, though the trial was too small to show a survival benefit.[^15]

The confirmatory phase 3 trial, INTerpath-001, randomly assigned 1,137 people with resected stage IIB–IV melanoma, two to one, to the vaccine or a placebo, both alongside pembrolizumab.[^19] In August 2026, the companies announced that at a pre-planned interim analysis it had met its main goal, longer recurrence-free survival, and a key secondary one, longer survival free of distant metastases.[^2] The result is company-reported: as of early October 2026 the numbers had not been released or peer-reviewed. Recurrence-free survival is also a surrogate endpoint, and a longer time to relapse does not automatically mean a longer life (see Chapter 8's box on endpoints); overall survival is still being followed.

No personalized neoantigen vaccine has been approved by the FDA or the European Medicines Agency. In November 2025, Russia authorized clinical use of one, NeoOncovac, for melanoma that is inoperable or has spread, and after surgery to remove metastases; the announcement included no efficacy data.[^20]

:::deep-dive Reading the melanoma results
KEYNOTE-942's main measure was {{recurrence-free-survival|recurrence-free survival}}, the time until the cancer returns or the patient dies, compared between groups as a {{hazard-ratio|hazard ratio}} (both explained in [Chapter 8](08-checkpoints.html), along with why such surrogates can mislead).

In the first report, the hazard ratio was 0.56, with a 95% confidence interval (the range of values reasonably compatible with the data) from 0.31 to 1.02.[^18] Because the upper end just crosses 1.0, the data could not firmly rule out "no effect" by the usual 5% threshold (p = 0.053). At five years, the hazard ratio was 0.51 (0.29 to 0.89), which excludes 1.0, but these later analyses were labeled descriptive rather than formal tests. For overall survival the interval ran from 0.17 to 1.35: a favorable trend, not evidence of longer survival.[^15]

A hazard ratio of 0.5 does not mean half the patients are cured. Design matters too: KEYNOTE-942 was open-label (everyone knew who got the vaccine), and its comparison group had only 50 patients, so both chance and bias could have shaped the result. That is why the larger, blinded phase 3 trial matters, and why its full results, rather than a press release, will settle the question.
:::

### Pancreatic cancer: a hard test

Pancreatic cancer is among the deadliest cancers, carries relatively few mutations, and almost never responds to checkpoint inhibitors alone. At Memorial Sloan Kettering Cancer Center in New York, 16 patients received BioNTech and Genentech's vaccine after surgery, with the checkpoint inhibitor atezolizumab (Tecentriq) and then chemotherapy. Half made strong new T-cell responses; most of them had not relapsed at the time of analysis, while non-responders relapsed after a median of 13.4 months.[^14] At about three years, the vaccine-induced T cells were estimated to persist for an average of 7.7 years, and in the recurrent tumors that were sequenced, the cancer-cell lineages carrying the vaccine's targets had disappeared, evidence of selection under immune pressure.[^21]

Comparing responders with non-responders is not the same as comparing vaccine with no vaccine. Responders might have had stronger immune systems, though both groups responded equally well to a COVID-19 mRNA vaccine, which argues against that.[^14] A randomized trial of 260 patients, IMCODE003, is under way, but it tests the vaccine plus a checkpoint inhibitor and chemotherapy against chemotherapy alone,[^47] so a positive result would not show which of the two was responsible.

### Setbacks, and an off-the-shelf idea

In August 2026, BioNTech stopped a randomized trial comparing its vaccine alone, without a checkpoint inhibitor, with watchful waiting after colorectal-cancer surgery. By the company's account, the trial had crossed a futility boundary, and monitors noted a numerical imbalance in overall survival without saying which way; no data have been published.[^22]

Some mutations recur across thousands of patients, notably a handful in the {{oncogene|oncogene}} KRAS in pancreatic and colorectal cancers, so a vaccine against them could be made in advance (though each mutant peptide binds only some HLA types). In June 2026, the company developing one such vaccine, ELI-002 7P, reported that a randomized trial in 144 people with resected pancreatic cancer had missed its main goal, without releasing the overall numbers; subgroups it highlighted were chosen after the fact.[^23]

## Oncolytic viruses

Every approach so far requires knowing the target in advance. An {{oncolytic-virus|oncolytic virus}}, literally a cancer-dissolving virus, avoids that requirement by turning the tumor into its own vaccine.

Healthy cells resist viruses with a type I {{interferon|interferon}} response ([Chapter 2](02-innate.html)): an infected cell shuts down protein synthesis and releases interferon, which puts neighboring cells into an antiviral state. Many cancer cells carry defects in this pathway. Engineers therefore delete the viral genes that counter it, so the attenuated (weakened) virus is shut down in healthy cells but still replicates in cancer cells whose interferon response is defective.[^24]

An infected cancer cell fills with new virus and lyses (bursts), releasing more virus, the tumor's own proteins (neoantigens included) and danger signals. Because antigen and danger signals are released together, this is {{immunogenic-cell-death|immunogenic cell death}}, a form of cell death that provokes an immune response. Dendritic cells need both; they carry the tumor proteins to a lymph node and prime T cells, which then circulate through the body. The result is {{in-situ-vaccination|in situ vaccination}}: vaccination performed inside the tumor, using whatever antigens it contains.[^24]

The first oncolytic virus licensed by the FDA and the European Medicines Agency, in 2015, was **talimogene laherparepvec (T-VEC; Imlygic)**, a herpes simplex (cold-sore) virus engineered to replicate in tumors and make {{gm-csf|GM-CSF}}, a signaling protein that attracts dendritic cells.[^25][^26] It is injected directly into melanoma lesions (tumor deposits) in the skin and lymph nodes. In its pivotal trial, 16% of patients had a durable response, meaning their tumors shrank substantially and stayed that way for at least six months, versus 2% with GM-CSF injections alone.[^26] Of the injected lesions, 64% shrank by at least half. Uninjected lesions, whose shrinkage points to a systemic immune response, did so less often: 34% of those in the skin and lymph nodes and 15% of those in internal organs, a real but modest effect.[^27] Adding T-VEC to pembrolizumab improved neither progression-free nor overall survival in a 692-patient trial.[^28]

In August 2026, the FDA granted {{accelerated-approval|accelerated approval}} (provisional, pending proof of benefit) to a newer herpes-based virus, vusolimogene oderparepvec (RP1; Tudriqev), given with the checkpoint inhibitor nivolumab (Opdivo) for melanoma that had stopped responding to anti-PD-1 drugs. In the FDA's analysis of its single-arm trial, IGNYTE, the {{objective-response-rate|response rate}} (the share of patients whose tumors shrank substantially) was 24% among the 91 patients who had at least one uninjected lesion;[^29] the investigators' published report, covering all 140 patients enrolled, gives 33%.[^48]

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
  - Overlay counters (HTML, below the HUD at top left): "Cancer cells left — injected tumor: n / 25 · distant tumor: n / 12", with an "Illustrative" tag directly beside them (the counts are a teaching model, not data).
  - HUD (ctx.ui.clock, top left): clock icon plus "Time compressed: real events take days to weeks". Stage tags (top right, t-caps, two at most): "Illustrative", "Not to scale".
  - Controls below the stage: primary button "Inject virus" (becomes "Replay" after a run); toggle "Cancer cells' antiviral alarm: Broken (common) | Working"; a "Pause/Play" button. Under prefers-reduced-motion, replace the simulation with a stepper (Back/Next) that shows the end state of each step.
  MOBILE (< 600px): portrait viewBox. Stack: injected tumor (top, ~45% height), lymph node (thin strip, ~15%), distant tumor (bottom, ~40%). Counters move below the stage. Controls full width.

  ELEMENTS & LOOKS (use the shared art library where available):
  - Virus: tiny red-coral icosahedron with short spikes. Real viruses are ~100× smaller than cells; draw them ~1/10 of a cell's diameter and state in step 1 that they are enlarged.
  - Interferon alarm: a soft, sand-colored halo with a small shield icon around a defended cell; interferon itself drifts to neighbors as hollow sand-colored rings (interferons are hollow rings in the sender's color, FIGURE-AUDIT §4.12), and neighbors get a fainter halo.
  - Tumor proteins released on bursting: hot-pink beads (neo/foreign peptide color).
  - Danger signals: library dangerSpark (four-point stars), distinct from the beads.
  - Dendritic cells: green, star-shaped with long dendrites; 3 of them, drawn dendriticCell({ state: 'immature' }) until they pick up beads and sparks, then 'mature'.
  - Lymph node interior: lymphNodeField; photocopying T cells use cell-actions.divide(). Use the same path and lane grammar as ch12-neoadjuvant (one agent builds both).
  - Kills in this crowd use the crowd form of the kill grammar: the cancer cell shrinks and sheds 4–6 specks that fade over 0.6 s; never an explosion. Virus-driven bursting is a separate effect (membrane fragments, released beads, virions and sparks).
  - T cells: blue, round, small, fine microvilli fuzz, TCR glyphs.
  Target ≤ ~150 moving objects at peak; use Canvas 2D for particles with an SVG/HTML overlay for labels if needed.

  SEQUENCE ("Broken" alarm, default). Each phase triggers its step caption.
  Phase 1 (0–3 s): A syringe glyph at the left edge of the injected tumor releases ~20 virions that diffuse into the mass.
  Phase 2 (3–9 s): Virions that touch a HEALTHY cell enter it; the cell lights its interferon halo (shield icon), the virion inside fades out, and hollow sand rings drift to 2–3 neighbors, which get faint halos and repel further entry. Virions that touch a CANCER cell enter it; dots multiply inside (1 → ~8 over ~2 s); the cell swells slightly.
  Phase 3 (6–14 s, overlapping): A full cancer cell bursts (membrane breaks into fragments that fade), releasing ~6 new virions, ~5 pink beads and ~4 gold sparks. New virions infect adjacent cancer cells, so a wave of bursting spreads through the mass. Stop the wave once ~16 of 25 cancer cells have burst. Some cancer cells at the far side are never reached; leave them. Remaining free virions slowly fade.
  Phase 4 (12–20 s): The 3 dendritic cells drift in from the edges, touch pink beads (beads attach to them), and then travel along the dotted path to the lymph node. In the node, 2 of the resting T cells brighten on contact and "photocopy" into ~8 blue T cells.
  Phase 5 (20–32 s): T cells travel along the dotted paths: ~5 into the injected tumor, ~3 into the distant tumor. A T cell that touches a cancer cell attaches briefly; the cancer cell shrinks and fragments (apoptosis), and the T cell moves on. End state: injected tumor ~5 of 25 cancer cells left; distant tumor ~9 of 12 left (the distant effect is real but modest).
  End: a "Replay" button appears.

  SEQUENCE ("Working" alarm). Same start, but cancer cells react like healthy cells: halo, shield, virus fades. At most 2 cancer cells burst, releasing few beads; 1 dendritic cell makes the trip; in the node only ~3 T cells form; they kill 1–2 cells in the injected tumor and none in the distant tumor. End state ~22 / 25 and 12 / 12. Show the alternative caption (verbatim): "If the cancer cells' alarm still works, they shut the virus down too: little bursting, few released proteins, and only a weak T-cell response."

  FINAL NOTE (verbatim, shown under the stage after any run): "In the trial behind T-VEC's approval, about two thirds of injected deposits shrank by at least half, as did about a third of uninjected deposits in the skin and lymph nodes and about one in seven tumors in internal organs. Many patients do not respond at all."

  ACCESSIBILITY. Captions go to an ARIA live region. All controls keyboard-operable. Animation pauses when off-screen or when the tab is hidden.

  SCIENTIFIC GUARDRAILS. Healthy cells are not invulnerable to entry; they are protected because they detect the virus and shut it down. Dendritic cells do not kill; they carry and present. T cells kill cancer cells displaying tumor peptides, not because they "see the virus". The distant tumor must contain no virus at any point. Do not show 100% clearance in either tumor.
steps:
  1. An engineered virus is injected into one tumor. Viruses are far smaller than cells and are drawn enlarged here.
  2. Healthy cells detect the virus, shut it down and release interferon, which puts their neighbors into an antiviral state. Many cancer cells have lost this interferon response, so the virus replicates inside them.
  3. Infected cancer cells lyse (burst), releasing new viruses along with the tumor's own proteins and danger signals. This immunogenic cell death lets the tumor act as its own vaccine.
  4. Dendritic cells take up the tumor proteins and carry them to a lymph node, where T cells that recognize them are primed and multiply.
  5. The new T cells patrol the body. They attack cancer cells in the injected tumor and, less often, in a distant tumor the virus never reached.
alt: An animation of oncolytic virus therapy. Virus injected into one tumor is shut down by healthy cells, which mount an interferon response, but replicates in cancer cells that lack this response, lysing them and releasing tumor proteins and danger signals. Dendritic cells carry those proteins to a lymph node, where T cells are primed and multiply; these kill most cancer cells in the injected tumor and a few in a distant, uninjected tumor. If the cancer cells' interferon response works, little happens.
:::

:::deep-dive Building a better virus
T-VEC is herpes simplex virus type 1 with three changes.[^24][^26]

- **Delete ICP34.5.** This viral gene lets herpes override PKR, a sensor that halts protein synthesis when a cell detects a virus. Without it, the virus stalls in healthy cells but can still replicate in many cancer cells, where this defense is often weak or missing.
- **Delete ICP47.** Herpes normally makes ICP47 to block {{tap-transporter|TAP}}, the transporter that supplies peptides for loading onto MHC class I. Without it, infected cells keep presenting peptides on class I, so killer T cells can still recognize them.
- **Add GM-CSF.** Infected cells secrete this cytokine, which attracts dendritic cells and helps them mature; in situ vaccination depends on these cells.

Other oncolytic viruses have been built from adenoviruses, poxviruses, reoviruses and others.[^24] Rigvir, an enterovirus that had not been genetically engineered, was registered in Latvia in 2004[^30] and withdrawn from sale there in 2019 after tests found less virus in samples than its maker declared.[^31]

The main design problem is the immune response to the virus. Inflammation against the virus supplies the danger signals that alert the immune system to the dying tumor cells. But the same immunity clears the virus, sometimes before it has spread far, and antibodies against it, which many patients already carry from past cold sores and which each dose raises further, can neutralize it. An effective oncolytic virus must replicate fast enough to kill tumor cells and provoke just enough immune response to turn that killing into a vaccine.
:::

## Where things stand

So far, therapeutic vaccines seem to work best when the target is foreign, the adjuvant strong, the disease small and the brakes released, which is why they are paired with checkpoint inhibitors: the vaccine primes T cells, and the checkpoint inhibitor keeps PD-1 from inhibiting them. Status as of October 2026:

| Approach | Status |
|---|---|
| HPV and hepatitis B vaccines | Proven; standard |
| BCG (bladder) | Standard; not tumor-specific |
| Sipuleucel-T (prostate) | Approved 2010; modest gain |
| T-VEC, RP1 (melanoma) | Approved (RP1 provisionally); help a minority |
| Personal mRNA + anti-PD-1 (melanoma) | Promising: phase 2 borderline but durable; phase 3 positive by company report; not approved in US or EU |
| Personal mRNA (pancreas) | Small, uncontrolled; randomized trial under way |
| Personal mRNA alone (colorectal); KRAS vaccine | Setbacks in 2026 |

Tumors also evolve: the pancreatic tumors that came back had lost the targeted cell lineages, and the relapsed melanoma had lost its MHC class I display. Every successful immunotherapy selects for the cancer cells that can escape it.

For more than a century, doctors tried to show the immune system what cancer looks like. The clearest successes, the HPV and hepatitis B vaccines, instead show it a foreign viral protein before infection. Newer therapeutic approaches show it mutant proteins to which it is not tolerant, or a tumor's proteins released with danger signals by a virus bursting its cells. Why tumors still escape, and how combined treatments might prevent it, is the subject of the final chapter.

:::quiz
Q: Why is the HPV vaccine given to 9- to 14-year-olds rather than to women who already carry the virus?
- [ ] Younger people's immune systems respond more strongly, and that alone explains the timing — Young adolescents do make strong antibody responses, but that is not why the vaccine fails in people already infected.
- [x] Its antibodies block virus before it enters cells, not virus already inside — A trial in women already carrying HPV found no faster clearance after vaccination, so the vaccine must come before exposure.
- [ ] Adult cervical cells cannot be infected by the types in the vaccine — Adults can be and often are infected by these types; persistent infection is what leads to cancer later in life.

Q: A personalized vaccine encodes up to 34 neoantigens rather than only the single best-scoring one. Why?
- [ ] Each neoantigen must be carried to a different lymph node to prime T cells — They are encoded in tandem on one mRNA and travel together.
- [x] Predictions are unreliable and tumors are heterogeneous, so many targets raise the odds — In the pancreatic study, only about 1 in 9 chosen neoantigens drew a detectable T-cell response; designers also favor clonal targets, present in every cancer cell.
- [ ] More neoantigens strengthen the vaccine's adjuvant effect on the innate immune system — That effect comes mainly from the mRNA and its lipid packaging, not from the number of targets.

Q: An oncolytic virus is injected into one melanoma deposit, and a distant tumor that was never injected shrinks. What is the most likely explanation?
- [ ] The virus spread through the bloodstream and infected the distant tumor directly — Possible in principle, but distant shrinkage is attributed mainly to the immune response; the virus is injected locally and largely cleared.
- [x] Dying infected cancer cells helped prime T cells that found the distant tumor — This is in situ vaccination: their proteins and danger signals let dendritic cells prime T cells, which patrol the whole body.
- [ ] Healthy cells near the injection were reprogrammed to attack the cancer — Healthy cells mostly shut the virus down.

Q: Which statement best describes personalized mRNA cancer vaccines as of October 2026?
- [ ] Approved in the US and Europe after a successful phase 3 trial in melanoma — Neither the FDA nor the European Medicines Agency had approved one; the phase 3 result was a company announcement without published numbers.
- [x] Promising in phase 2, positive in phase 3 by company report; not approved — The randomized phase 2 was borderline but held at five years; the phase 3 has only company-reported topline results; none is approved in the US or Europe.
- [ ] Abandoned in 2026 after the trial in colorectal cancer was stopped for futility — One trial of the vaccine given alone was stopped, but trials combining vaccines with checkpoint inhibitors continue.
:::

:::takeaways
- "Cancer vaccine" means two different things: **preventive** vaccines against cancer-causing viruses, proven at population scale, and **therapeutic** vaccines against an existing tumor, still mostly experimental.
- Early HPV vaccination has cut cervical cancer among women in their twenties by 87% in England (offered at 12–13), and in Sweden vaccination before 17 was linked to an 88% lower rate in girls and women followed to age 30; in Scotland, no cases were recorded among women vaccinated at 12–13. It works best before exposure because its antibodies block infection but cannot clear it. Vaccinating newborns against hepatitis B has cut liver cancer in Taiwan's young people by roughly 60–75%.
- Older therapeutic vaccines often failed on several counts at once: targets the immune system tolerates, weak adjuvants, large late-stage tumors and active brakes. Modern designs try to fix all four together; whether that is enough is still being tested.
- Personalized neoantigen vaccines start from a tumor's mutations, predict which will be displayed on the patient's own HLA molecules, and encode up to 34 of them (Moderna and Merck's vaccine) or 20 (BioNTech and Genentech's) in mRNA. Predictions are imperfect and many targets draw no detectable T-cell response, so vaccines carry many and favor clonal mutations, found in every cancer cell.
- In a small, open-label trial in high-risk melanoma, 22% of patients given a personalized mRNA vaccine plus pembrolizumab relapsed or died within about two years, versus 40% with pembrolizumab alone; the result was borderline but held at five years. In August 2026 the companies reported that a 1,137-patient phase 3 trial had met its main goal. Those topline results are not yet peer-reviewed, and no such vaccine is approved in the US or Europe.
- Oncolytic viruses replicate in cancer cells whose interferon defenses are defective, and turn the tumor into its own vaccine (in situ vaccination); T-VEC and the provisionally approved RP1 help a minority of patients.
:::

## Glossary
- hpv | HPV (human papillomavirus) | A very common virus spread by intimate skin contact. Most infections clear on their own, but persistent infection with high-risk types can cause cervical, anal, throat and other cancers.
- mrna | mRNA (messenger RNA) | A working copy of a gene that the cell's ribosomes translate into a protein. mRNA vaccines deliver such instructions so the body's own cells make the target protein.
- vaccine | Vaccine | A preparation that shows the immune system a target, activating and expanding the B and T cells whose receptors recognize it and leaving memory cells behind.
- b-cell | B cell | An immune cell whose receptor recognizes intact molecules; when activated, it can differentiate into a plasma cell that secretes antibodies.
- t-cell | T cell | An immune cell whose receptor recognizes peptides (protein fragments) presented on MHC molecules; killer T cells destroy infected or cancerous cells, helper T cells coordinate.
- clonal-expansion | Clonal expansion | The rapid multiplication of the few immune cells whose receptors recognize a target, producing a large clone of identical cells.
- memory-cell | Memory cell | A long-lived B or T cell left behind after an immune response, ready to respond faster and more strongly the next time.
- preventive-vaccine | Preventive vaccine | A vaccine given before exposure to stop an infection or disease from starting. Against cancer, these target cancer-causing viruses such as HPV and hepatitis B.
- antibody | Antibody | A Y-shaped protein secreted by B cells (plasma cells) that binds a specific target, for example neutralizing a virus by covering the parts it needs to enter cells.
- therapeutic-vaccine | Therapeutic vaccine | A vaccine given to someone who already has a disease, to strengthen the immune attack on it, for example on an existing tumor.
- tumor-suppressor | Tumor suppressor | A gene whose protein restrains cell division or triggers DNA repair or apoptosis (programmed cell death) when something goes wrong; losing it removes a safeguard against cancer.
- virus-like-particle | Virus-like particle (VLP) | An empty viral shell (capsid) assembled from a virus's coat protein. It looks like the virus to the immune system but contains no genetic material, so it cannot infect.
- hbv | Hepatitis B virus (HBV) | A virus that infects the liver. Lifelong infection, often acquired at birth, can lead to scarring (cirrhosis) and liver cancer.
- tolerance | Tolerance | The immune system's learned unresponsiveness to the body's own molecules, created largely by deleting or restraining self-reactive T and B cells.
- peptide | Peptide | A short chain of amino acids, such as the protein fragments presented on MHC molecules.
- adjuvant | Adjuvant | An ingredient added to a vaccine to trigger innate danger signals, so that antigen-presenting cells fully activate T and B cells.
- dendritic-cell | Dendritic cell | An immune cell that samples tissues and carries what it collects to a lymph node, where it presents peptides from that material to T cells.
- costimulation | Costimulation (signal 2) | A confirming signal, such as CD28 binding B7, that a T cell needs in addition to recognizing its target before it will activate.
- metastasis | Metastasis | The spread of cancer cells from the original tumor to other parts of the body, and the new tumors they form there.
- tumor-microenvironment | Tumor microenvironment | Everything surrounding the cancer cells inside a tumor: blood vessels, stromal (support) cells, immune cells and signaling molecules, often arranged in ways that suppress immunity.
- pd-l1 | PD-L1 | A protein on many tumor and immune cells that binds the PD-1 brake on T cells and inhibits them.
- pd-1 | PD-1 | An inhibitory ("brake") receptor on activated T cells; when bound by PD-L1 it dampens T-cell activity. Blocked by checkpoint-inhibitor drugs.
- exhaustion | T-cell exhaustion | A dysfunctional state that T cells enter after prolonged stimulation, in which they kill and multiply poorly.
- antigen | Antigen | Any molecule, or part of one, that the immune system can specifically recognize.
- cytokine | Cytokine | A small signaling protein that immune cells use to communicate, attract other cells and change each other's behavior.
- bcg | BCG (bacillus Calmette–Guérin) | A weakened relative of the tuberculosis bacterium, used as a TB vaccine and, instilled into the bladder, as a treatment for early bladder cancer.
- mutation | Mutation | A change in the DNA sequence; some alter the protein a gene encodes.
- mhc-class-i | MHC class I | The molecule on nearly every cell that presents peptides from proteins made inside the cell, for inspection by CD8 killer T cells; nicknamed the "shop window".
- neoantigen | Neoantigen | A new peptide created by a tumor mutation and presented on MHC, which the immune system can recognize as foreign.
- sequencing | Sequencing | Reading the order of nucleotides (the "letters", or bases) in DNA or RNA. Comparing a tumor's sequence with a normal sample reveals the tumor's mutations.
- hla | HLA (human leukocyte antigen) | The human versions of MHC molecules. People inherit different HLA types, which determine which peptides their cells can present.
- clonal-neoantigen | Clonal (vs subclonal) neoantigen | A clonal neoantigen comes from a mutation present in every cancer cell, the trunk of the tumor's family tree; a subclonal one is found only in some branches.
- lipid-nanoparticle | Lipid nanoparticle (LNP) | A tiny particle made of lipids that encloses and protects mRNA and helps it enter cells; it also triggers innate danger signals.
- checkpoint-inhibitor | Checkpoint inhibitor | A drug, usually an antibody, that blocks an inhibitory immune checkpoint (a "brake") such as PD-1, its ligand PD-L1, or CTLA-4, so that T cells stay active.
- cd8-t-cell | Killer T cell (CD8 T cell) | A T cell that recognizes peptides on MHC class I and kills infected or cancerous cells.
- b2m | Beta-2-microglobulin (B2M) | A small protein that forms an essential part of every MHC class I molecule. Cells that lose it cannot present peptides to killer T cells.
- clinical-trial | Clinical trial | A study that tests a treatment in people, usually in phases: small safety studies (phase 1), mid-sized studies looking for benefit (phase 2), and large, often randomized and placebo-controlled studies that decide whether it works (phase 3).
- adjuvant-therapy | Adjuvant therapy | In cancer medicine, treatment given after surgery to destroy undetectable leftover cancer cells and prevent relapse. Not the same as an immunological adjuvant.
- hazard-ratio | Hazard ratio | A comparison of how fast events such as relapse or death occur in two groups over time. 1.0 means no difference; 0.5 means events happen at half the rate.
- recurrence-free-survival | Recurrence-free survival | The time from the start of treatment until the cancer comes back or the patient dies, whichever comes first.
- oncogene | Oncogene | A mutated gene that keeps driving cell division; KRAS is a common example.
- oncolytic-virus | Oncolytic virus | A virus, often genetically engineered, that preferentially infects and kills cancer cells and, by doing so, stimulates an immune response against the tumor.
- interferon | Interferon | A family of signaling proteins that cells release when infected; they put neighboring cells into an antiviral state and activate immune cells.
- in-situ-vaccination | In situ vaccination | Turning a tumor into its own vaccine by killing cancer cells in place in an inflammatory way, so the immune system learns from whatever antigens the tumor contains.
- gm-csf | GM-CSF | Granulocyte-macrophage colony-stimulating factor, a cytokine that recruits and matures dendritic cells; some vaccines and oncolytic viruses carry its gene.
- accelerated-approval | Accelerated approval | An FDA pathway that approves a drug on early evidence, such as tumor shrinkage, on condition that later trials confirm a real clinical benefit.

## Sources
1. Palmer TJ, Kavanagh K, Cuschieri K, et al. Invasive cervical cancer incidence following bivalent human papillomavirus vaccination: a population-based observational study of age at immunization, dose, and deprivation. *J Natl Cancer Inst* 2024;116(6):857-865. doi:10.1093/jnci/djad263
2. Merck & Co., Inc. and Moderna, Inc. Merck and Moderna announce phase 3 INTerpath-001 trial of intismeran autogene plus KEYTRUDA met endpoints of recurrence-free survival (RFS) and distant metastasis-free survival (DMFS) in patients with completely resected stage IIB–IV melanoma. Press release, August 19, 2026. https://www.merck.com/news/merck-and-moderna-announce-phase-3-interpath-001-trial-of-intismeran-autogene-plus-keytruda-met-endpoints-of-recurrence-free-survival-rfs-and-distant-metastasis-free-survival-dmfs-in-patient/ ; and Moderna, Inc. Moderna announces late-breaking data to be presented at ESMO Congress 2026 (INTerpath-001, LBA1, October 24, 2026). Press release, September 21, 2026.
3. de Martel C, Georges D, Bray F, Ferlay J, Clifford GM. Global burden of cancer attributable to infections in 2018: a worldwide incidence analysis. *Lancet Glob Health* 2020;8(2):e180-e190. doi:10.1016/S2214-109X(19)30488-7
4. World Health Organization. Human papillomavirus vaccines: WHO position paper, December 2022. *Wkly Epidemiol Rec* 2022;97(50):645-672. https://www.who.int/publications/i/item/who-wer9750-645-672
5. Hildesheim A, Herrero R, Wacholder S, et al. Effect of human papillomavirus 16/18 L1 viruslike particle vaccine among young women with preexisting infection: a randomized trial. *JAMA* 2007;298(7):743-753. doi:10.1001/jama.298.7.743
6. Lei J, Ploner A, Elfström KM, et al. HPV vaccination and the risk of invasive cervical cancer. *N Engl J Med* 2020;383(14):1340-1348. doi:10.1056/NEJMoa1917338
7. Falcaro M, Castañon A, Ndlela B, et al. The effects of the national HPV vaccination programme in England, UK, on cervical cancer and grade 3 cervical intraepithelial neoplasia incidence: a register-based observational study. *Lancet* 2021;398(10316):2084-2092. doi:10.1016/S0140-6736(21)02178-4
8. Wang HH, Sun SL, Jau RC, et al. Risk of HBV infection among male and female first-time blood donors born before and after the July 1986 HBV vaccination program in Taiwan. *BMC Public Health* 2021;21:1831. doi:10.1186/s12889-021-11846-x
9. Chang MH, You SL, Chen CJ, et al. Long-term effects of hepatitis B immunization of infants in preventing liver cancer. *Gastroenterology* 2016;151(3):472-480.e1. doi:10.1053/j.gastro.2016.05.048
10. Rosenberg SA, Yang JC, Restifo NP. Cancer immunotherapy: moving beyond current vaccines. *Nat Med* 2004;10(9):909-915. doi:10.1038/nm1100
11. Vansteenkiste JF, Cho BC, Vanakesa T, et al. Efficacy of the MAGE-A3 cancer immunotherapeutic as adjuvant therapy in patients with resected MAGE-A3-positive non-small-cell lung cancer (MAGRIT): a randomised, double-blind, placebo-controlled, phase 3 trial. *Lancet Oncol* 2016;17(6):822-835. doi:10.1016/S1470-2045(16)00099-1
12. Kantoff PW, Higano CS, Shore ND, et al. Sipuleucel-T immunotherapy for castration-resistant prostate cancer. *N Engl J Med* 2010;363(5):411-422. doi:10.1056/NEJMoa1001294
13. Gontero P, Birtle A, Capoun O, et al. European Association of Urology guidelines on non-muscle-invasive bladder cancer (TaT1 and carcinoma in situ): a summary of the 2024 guidelines update. *Eur Urol* 2024;86(6):531-549. doi:10.1016/j.eururo.2024.07.027
14. Rojas LA, Sethna Z, Soares KC, et al. Personalized RNA neoantigen vaccines stimulate T cells in pancreatic cancer. *Nature* 2023;618(7963):144-150. doi:10.1038/s41586-023-06063-y
15. Khattak A, Carlino MS, Meniawy T, et al. Intismeran autogene plus pembrolizumab versus pembrolizumab alone in high-risk resected melanoma: 5-year update of the randomized phase IIb KEYNOTE-942 study. *J Clin Oncol* 2026;44(26):2482-2489. doi:10.1200/JCO-26-00835
16. Ott PA, Hu Z, Keskin DB, et al. An immunogenic personal neoantigen vaccine for patients with melanoma. *Nature* 2017;547(7662):217-221. doi:10.1038/nature22991
17. Sahin U, Derhovanessian E, Miller M, et al. Personalized RNA mutanome vaccines mobilize poly-specific therapeutic immunity against cancer. *Nature* 2017;547(7662):222-226. doi:10.1038/nature23003
18. Weber JS, Carlino MS, Khattak A, et al. Individualised neoantigen therapy mRNA-4157 (V940) plus pembrolizumab versus pembrolizumab monotherapy in resected melanoma (KEYNOTE-942): a randomised, phase 2b study. *Lancet* 2024;403(10427):632-644. doi:10.1016/S0140-6736(23)02268-7
19. ClinicalTrials.gov. A clinical study of intismeran autogene (V940) plus pembrolizumab in people with high-risk melanoma (INTerpath-001). NCT05933577. https://clinicaltrials.gov/study/NCT05933577
20. National Medical Research Radiological Centre, Ministry of Health of the Russian Federation. For the first time in the world, approval has been granted for the use of a personalized mRNA vaccine (NeoOncovac). News release, November 21, 2025. https://new.nmicr.ru/en/news/for-the-first-time-in-the-world-approval-has-been-granted-for-the-use-of-a-personalized-mrna-vaccine/
21. Sethna Z, Guasp P, Reiche C, et al. RNA neoantigen vaccines prime long-lived CD8+ T cells in pancreatic cancer. *Nature* 2025;639(8056):1042-1051. doi:10.1038/s41586-024-08508-4
22. BioNTech SE. BioNTech provides update on phase 2 clinical trial of autogene cevumeran in resected colorectal cancer (BNT122-01, NCT04486378). Company statement, August 28, 2026. https://www.biontech.com/int/en/home/mediaroom/news/statements/2026/08/BioNTech-Provides-Update-on-Phase-2-Clinical-Trial-of-Autogene-Cevumeran-in-Resected-Colorectal-Cancer.html
23. Elicio Therapeutics. Elicio Therapeutics reports results from phase 2 AMPLIFY-7P study and outlines refined phase 3 development strategy for ELI-002 7P in adjuvant pancreatic cancer. Press release, June 15, 2026. https://elicio.com/press_releases/elicio-therapeutics-reports-results-from-phase-2-amplify-7p-study-and-outlines-refined-phase-3-development-strategy-for-eli-002-7p-in-adjuvant-pancreatic-cancer/
24. Kaufman HL, Kohlhapp FJ, Zloza A. Oncolytic viruses: a new class of immunotherapy drugs. *Nat Rev Drug Discov* 2015;14(9):642-662. doi:10.1038/nrd4663
25. Imlygic (talimogene laherparepvec) regulatory records: US prescribing information (initial US approval 2015), https://www.fda.gov/media/94129/download ; and European Medicines Agency, Imlygic European public assessment report (EU authorization 16 December 2015), https://www.ema.europa.eu/en/medicines/human/EPAR/imlygic
26. Andtbacka RHI, Kaufman HL, Collichio F, et al. Talimogene laherparepvec improves durable response rate in patients with advanced melanoma. *J Clin Oncol* 2015;33(25):2780-2788. doi:10.1200/JCO.2014.58.3377
27. Andtbacka RHI, Ross M, Puzanov I, et al. Patterns of clinical response with talimogene laherparepvec (T-VEC) in patients with melanoma treated in the OPTiM phase III clinical trial. *Ann Surg Oncol* 2016;23(13):4169-4177. doi:10.1245/s10434-016-5286-0
28. Chesney JA, Ribas A, Long GV, et al. Randomized, double-blind, placebo-controlled, global phase III trial of talimogene laherparepvec combined with pembrolizumab for advanced melanoma. *J Clin Oncol* 2023;41(3):528-540. doi:10.1200/JCO.22.00343
29. US Food and Drug Administration. FDA grants accelerated approval to vusolimogene oderparepvec-wtpg in combination with nivolumab for melanoma. August 6, 2026. https://www.fda.gov/drugs/resources-information-approved-drugs/fda-grants-accelerated-approval-vusolimogene-oderparepvec-wtpg-combination-nivolumab-melanoma (brand name Tudriqev; objective response rate 24.2%, 95% CI 15.8–34.3, in the 91 of 140 enrolled patients with at least one noninjected lesion; median duration of response 14.1 months)
30. Piwoni K, Jaeckel G, Rasa A, Alberts P. 4-Week repeated dose rat GLP toxicity study of oncolytic ECHO-7 virus Rigvir administered intramuscularly with a 4-week recovery period. *Toxicol Rep* 2021;8:230-238. doi:10.1016/j.toxrep.2021.01.009
31. LSM (Latvian Public Broadcasting). Calls for official probe over Rigvir cancer treatment scandal. April 3, 2019. https://eng.lsm.lv/article/society/health/calls-for-official-probe-over-rigvir-cancer-treatment-scandal.a314845/
32. Kenter GG, Welters MJP, Valentijn ARPM, et al. Vaccination against HPV-16 oncoproteins for vulvar intraepithelial neoplasia. *N Engl J Med* 2009;361:1838–1847. doi:10.1056/NEJMoa0810097 (20 women vaccinated; at 12 months, clinical responses in 15 of 19 and complete regression in 9 of 19)
33. US Food and Drug Administration. PAPZIMEOS (zopapogene imadenovec-drba) prescribing information and approval record, approved 14 August 2025 for the treatment of adults with recurrent respiratory papillomatosis. https://www.fda.gov/vaccines-blood-biologics/papzimeos (non-replicating adenoviral vector expressing a fusion antigen from HPV types 6 and 11; in study PRGN-2012-201, NCT04724980, 18 of 35 patients at the pivotal dose needed no surgery in the 12 months after treatment, 51%, 95% CI 34–69%)
34. Schiller J, Lowy D. Explanations for the high potency of HPV prophylactic vaccines. *Vaccine* 2018;36:4768–4773. doi:10.1016/j.vaccine.2017.12.079 (the particles self-assemble from 360 copies of L1, arranged as 72 pentamers)
35. Kreimer AR, Sampson JN, Porras C, et al. Evaluation of durability of a single dose of the bivalent HPV vaccine: the CVT trial. *J Natl Cancer Inst* 2020;112:1038–1046. doi:10.1093/jnci/djaa011 (single-dose efficacy against HPV16/18 infection 82%, 95% CI 40–97%, about 11 years after vaccination; dose groups were not randomly assigned)
36. Buffen K, Oosting M, Quintin J, et al. Autophagy controls BCG-induced trained immunity and the response to intravesical BCG therapy for bladder cancer. *PLoS Pathog* 2014;10:e1004485. doi:10.1371/journal.ppat.1004485 (an association between an *ATG2B* variant and progression or recurrence after BCG, not proof of a causal mechanism)
37. van Puffelen JH, Keating ST, Oosterwijk E, et al. Trained immunity as a molecular mechanism for BCG immunotherapy in bladder cancer. *Nat Rev Urol* 2020;17:513–525. doi:10.1038/s41585-020-0346-4
38. Marrack P, McKee AS, Munks MW. Towards an understanding of the adjuvant action of aluminium. *Nat Rev Immunol* 2009;9:287–293. doi:10.1038/nri2510
39. Gérard C, Baudson N, Ory T, Louahed J. Tumor mouse model confirms MAGE-A3 cancer immunotherapeutic as an efficient inducer of long-lasting anti-tumoral responses. *PLoS One* 2014;9:e94883. doi:10.1371/journal.pone.0094883 (MAGRIT's AS15 immunostimulant contains monophosphoryl lipid A, the saponin QS-21, CpG 7909 and liposomes). On QS-21, a saponin from the bark of *Quillaja saponaria* that activates dendritic cells through lysosomal destabilization rather than a Toll-like receptor: Welsby I, Detienne S, N'Kuli F, et al. Lysosome-dependent activation of human dendritic cells by the vaccine adjuvant QS-21. *Front Immunol* 2017;7:663. doi:10.3389/fimmu.2016.00663
40. Beasley RP, Hwang LY, Lin CC, Chien CS. Hepatocellular carcinoma and hepatitis B virus: a prospective study of 22 707 men in Taiwan. *Lancet* 1981;2:1129–1133. doi:10.1016/s0140-6736(81)90585-7 (relative risk 223, 95% CI 28–1479; see also Koshiol J, Liu Z, O'Brien TR, Hildesheim A. Beasley's 1981 paper: the power of a well-designed cohort study to drive liver cancer research and prevention. *Cancer Epidemiol* 2018;53:195–199. doi:10.1016/j.canep.2018.01.007)
41. Karikó K, Buckstein M, Ni H, Weissman D. Suppression of RNA recognition by Toll-like receptors: the impact of nucleoside modification and the evolutionary origin of RNA. *Immunity* 2005;23:165–175. doi:10.1016/j.immuni.2005.06.008
42. Nance KD, Meier JL. Modifications in an emergency: the role of N1-methylpseudouridine in COVID-19 vaccines. *ACS Cent Sci* 2021;7:748–756. doi:10.1021/acscentsci.1c00197
43. Alameh MG, Tombácz I, Bettini E, et al. Lipid nanoparticles enhance the efficacy of mRNA and protein subunit vaccines by inducing robust T follicular helper cell and humoral responses. *Immunity* 2021;54:2877–2892.e7. doi:10.1016/j.immuni.2021.11.001
44. Kranz LM, Diken M, Haas H, et al. Systemic RNA delivery to dendritic cells exploits antiviral defence for cancer immunotherapy. *Nature* 2016;534:396–401. doi:10.1038/nature18300 (intravenous RNA–lipoplex particles are taken up and expressed by dendritic cells and macrophages in lymphoid compartments, including the spleen, and trigger interferon-α release)
45. Tarke A, Coelho CH, Zhang Z, et al. SARS-CoV-2 vaccination induces immunological T cell memory able to cross-recognize variants from Alpha to Omicron. *Cell* 2022;185:847–859.e11. doi:10.1016/j.cell.2022.01.015 (about six months after vaccination, memory CD4 and CD8 T-cell responses to Omicron spike kept on average 84% and 85% of their strength against the ancestral spike by AIM assay, while memory B-cell recognition of the Omicron receptor-binding domain fell to 0.42 of the ancestral level)
46. ClinicalTrials.gov. VERSATILE-003: phase 3 study of PDS0101 (Versamune HPV) and pembrolizumab in HPV16-positive recurrent or metastatic head and neck squamous cell carcinoma, NCT06790966; terminated, record updated 2 September 2026, 12 patients enrolled, reason given: "The study is being discontinued solely based on financial constraints and is not related to the safety of study participants, the investigational product, PDS0101, nor the conduct of the study." https://clinicaltrials.gov/study/NCT06790966 (sponsor-reported)
47. ClinicalTrials.gov. A study of the efficacy and safety of adjuvant autogene cevumeran plus atezolizumab and mFOLFIRINOX versus mFOLFIRINOX alone in participants with resected PDAC (IMCODE003). NCT05968326. https://clinicaltrials.gov/study/NCT05968326 (phase 2, open-label, randomized; 260 participants; active, not recruiting)
48. Wong MK, Milhem MM, Sacco JJ, et al. RP1 combined with nivolumab in advanced anti-PD-1-failed melanoma (IGNYTE). *J Clin Oncol* 2025;43(33):3589-3599. doi:10.1200/JCO-25-01346 (confirmed objective response rate 32.9%, 95% CI 25.2–41.3%, by independent central review in all 140 enrolled patients)
