---
id: 02-innate
title: Innate Immunity
subtitle: Within minutes of a splinter, your body mounts a defense against bacteria it has never encountered and never needs to identify.
part: I
reading_time: 23
hero: ch02-hero
---

A wooden splinter in the side of your thumb carries bacteria from the soil and from your skin into warm, wet, nutrient-rich tissue. Some bacteria can double their numbers every half hour when conditions are good, so left alone overnight, a few dozen could in principle become millions.

In practice, the skin around the splinter turns pink within minutes and is warm, puffy and tender within an hour. By the next day there may be a bead of yellowish pus, and usually no infection worth mentioning. The body does all of this without working out *which* bacteria it is dealing with.

The cells and molecules responsible belong to the {{innate-immunity|innate immune system}}: the defenses you are born with. Its {{receptor|receptors}} (the sensor proteins of Chapter 1) are encoded in your genes and work from the first minute. The better-known parts of immunity, {{antibody|antibodies}} and {{t-cell|T cells}}, belong to {{adaptive-immunity|adaptive immunity}}, which builds receptors specific to one invader and remembers it. But adaptive immunity needs days, often a week or more, to mount a first response (Chapters 3 to 5), far too long against bacteria that double every half hour.

The chapter's question is **how a body can recognize, within minutes, an intruder it has never encountered, without knowing what it is.** The answer also sets up a puzzle that runs through the rest of this guide: tumors are often full of inflammation, yet the immune system frequently fails to attack them.

## Barriers and sentinel cells

The first defense is a physical barrier. The skin's outer layer is made of flattened, dead cells and is dry, slightly acidic and constantly shedding. Wet surfaces such as the airways and gut rely on chemistry instead: sticky mucus, stomach acid, and enzymes in tears and saliva that attack {{microbe|microbes}} (bacteria, viruses, fungi and other agents of infection too small to see).

A splinter goes straight through these barriers, but the tissue beneath already contains immune cells. Almost every tissue is home to {{macrophage|macrophages}} (large cells whose name means "big eaters"), {{dendritic-cell|dendritic cells}} (introduced in Chapter 1) and {{mast-cell|mast cells}}, which are packed with granules, small membrane-enclosed stores of ready-made inflammatory chemicals. Because these sentinel cells live in the tissue, the first immune cell to meet the splinter's bacteria is usually already there.

## Recognizing microbes without identifying them

Microbes come in enormous variety and evolve quickly, so a macrophage can't carry a separate detector for each one, and whatever it detects must never be found on your own healthy cells.

In 1989, the immunologist Charles Janeway predicted how this works.[^1] Rather than telling each species apart, he suggested, innate sensors detect *signatures*: molecular features that whole classes of microbes share, that are so essential to the microbe it can't easily change them, and that our own cells lack.

Such signatures exist. Many bacteria, including *E. coli*, coat their outer wall with {{lps|lipopolysaccharide (LPS)}}, a molecule built from a lipid anchor and a chain of sugars. Human cells never make it. Swimming bacteria drive themselves with a flagellum, a whip-like tail built from a protein called flagellin. Viruses often make RNA in forms our own cells rarely produce, such as double strands. Immunologists call these signatures {{pamp|PAMPs}}, for *pathogen-associated molecular patterns* (a {{pathogen|pathogen}} is any disease-causing microbe).

The sensors that detect them are called {{pattern-recognition-receptor|pattern-recognition receptors}}. The best known are the {{toll-like-receptor|Toll-like receptors}} (TLRs). Humans have ten: one binds LPS, another flagellin, and several detect microbial RNA or DNA.[^2]

Most pattern-recognition receptors are not vague detectors: each binds one kind of molecule as precisely as any receptor in Chapter 1. What is broad is the target's reach: the part of LPS that its receptor senses, the lipid anchor called lipid A, looks much the same on thousands of bacterial species.

Location matters too. Our cells are full of our own DNA and RNA, so the sensors for genetic material sit where ours should not be: inside endosomes, the membrane-enclosed compartments in which a cell breaks down material it has taken up from outside, or in the cell's interior, where they detect DNA that has escaped the nucleus.

Danger can also come from within. Crushed, burned or oxygen-starved cells burst and spill molecules that belong inside them: the energy molecule ATP, DNA, and uric acid, which forms tiny needle-like crystals once it is outside. Sensors for these {{damp|DAMPs}} (*damage-associated molecular patterns*) let the body respond to injury itself, which is why a sprained ankle swells with no microbe in sight.

Within minutes of a sensor being triggered, the cell starts reading the genes for {{cytokine|cytokines}}, small signaling proteins that cells secrete to communicate with one another. They come in two main kinds: inflammatory cytokines recruit other immune cells (next section), and {{interferon|interferons}} put neighboring cells into an antiviral state. The figure below shows which sensors respond to which signatures, and which kind of cytokine each one triggers.

:::figure ch02-pattern-recognition
title: Innate sensors and the cytokines they trigger
goal: After using this, the reader understands that innate sensors recognize broad molecular signatures shared by whole classes of microbes (or released by damaged cells), that different sensors sit in different places in the cell, that each kind of threat triggers a matching alarm (inflammatory cytokines or antiviral interferons), and that healthy cells, and most cancer cells, trigger nothing.
kind: explorer
stage: dark
spec: |
  CONCEPT. A "sensor panel" game. The reader offers different things to a sentinel cell (a macrophage) and
  watches which of its sensors light up, where in the cell they are, and which alarm the cell sends out.

  LAYOUT (desktop, landscape viewBox about 1000x620).
  - Stage tag (top right, t-caps): "Not to scale".
  - Left ~62%: one large macrophage (art library macrophage, polarization 0, i.e. coral; amoeboid outline
    with soft ruffles; translucent cytoplasm) drawn as a cutaway so three zones are visible, each labeled
    with a thin leader line (1–3 words):
    (a) "Outer surface": the membrane edge facing right, toward the tray.
    (b) "Digestion bubble": ONE round internal compartment (art `vesicle({kind:'endosome'})`), about 22% of
        the cell's diameter, upper middle of the cell.
    (c) "Interior": the cytoplasm around it. In the interior, also draw one short, curved strip of internal
        membrane (art `vesicle({kind:'er'})` fragment), unlabeled in plain mode; it carries the small STING
        glyph described below.
    A rounded nucleus (darker coral) sits lower-left inside the cell.
  - Eight sensor glyphs, neutral silver-gray at 60% opacity when idle, each with a NUMBERED BADGE (1–8) on
    every screen size; the names live in the legend under the stage, not in the SVG. Three glyph types:
    RECEPTOR glyphs (a stem with a cupped head, like a tiny "C" clamp, about 1/20 of the cell's diameter;
    a different notch shape from the MHC cup, which is reserved for MHC);
    a GATE glyph (a short channel through the membrane, two parallel bars with a gap); and an ASSEMBLY glyph
    (6–7 small scattered pieces that snap together into a ring when triggered).
      On the OUTER SURFACE (spanning the membrane, heads facing outward):
        1 Bacterial-wall sensor (receptor)   2 Flagellum sensor (receptor)   3 ATP gate (gate)
      In the DIGESTION BUBBLE's membrane (heads facing INTO the bubble):
        4 Viral-RNA sensor (receptor)   5 Microbial-DNA sensor (receptor)
      In the INTERIOR (cytoplasm):
        6 Interior RNA sensor (receptor, free-floating)
        7 Misplaced-DNA sensor (receptor, free-floating). Next to it, on the ER membrane strip, a small partner
          glyph (STING) that glows when sensor 7 fires; a faint dotted line links them.
        8 Damage sensor (assembly glyph: scattered pieces that assemble into a ring when triggered)
  - Right ~38%: the "tray", five cards stacked vertically, each with a small illustration and a name:
    "Swimming bacterium", "Virus", "Crushed body cell", "Healthy body cell", "Cancer cell".
  - Below the stage (HTML): a readout panel with four rows (Detected / Sensors / Where / Alarm), the numbered
    sensor legend, the output legend, and a toggle "Show molecular names".

  SUSPECT ILLUSTRATIONS (art library cells in canonical colors).
  - Swimming bacterium: chartreuse rod with rounded ends and one long wavy tail (flagellum); a faint fringe on
    its outer surface represents LPS.
  - Virus: red-coral small icosahedral particle with short spikes, drawn hugely enlarged (hence the tag).
  - Crushed body cell: sand, broken outline with a gap; small particles spilling out.
  - Healthy body cell: sand, intact rounded polygon with a neat round nucleus.
  - Cancer cell: violet-magenta, lumpy irregular outline, large misshapen nucleus.

  PATTERN TOKENS. Each pattern has a unique SHAPE, so color is never the only cue:
  LPS = tiny comb/fringe; flagellin = short helical spring; viral RNA = single wavy line, or a short double
  wavy line for double strands; microbial DNA = double wavy line (ladder); ATP = small dot; the body's own
  DNA = double wavy line in sand color; uric-acid crystal = small angular needle (crystals appear only
  OUTSIDE cells, after spilling).

  INTERACTION. Tap/click a card, or focus it and press Enter/Space (cards are buttons). No drag-and-drop.
  One suspect at a time; choosing another fades the scene back to idle (0.4 s) and starts again.

  ANIMATION (about 3 s, eased; physical, never flashing):
  1. The suspect floats from the tray to the cell's outer surface.
  2. Matching SURFACE receptors bind their tokens: the receptor head closes around the token and glows (warm
     white-gold glow, plus a thicker outline so the change is not color-only).
  3. Bacterium: the membrane wraps around it and pinches it into the digestion bubble, where it breaks open
     and reveals DNA tokens; sensor 5 lights. Virus: part of it enters the digestion bubble (sensor 4 lights)
     and part releases its RNA into the interior (sensor 6 lights).
  4. Each lit sensor sends a soft pulse along a thin line to the nucleus (0.5 s).
  5. The nucleus brightens and the cell releases a plume of output particles, both in the sender's coral:
     - SOLID coral dots. Legend: "Inflammatory cytokines: call for help".
     - HOLLOW coral rings (art `interferon`). Legend: "Interferons (antiviral cytokines): warn the neighbors".
     Shape, not color, separates the two.
  Lit sensors stay lit until the next suspect is chosen.
  IMPORTANT: sensors 3 (ATP gate) and 8 (damage sensor) never "grab" a token. The gate OPENS (its bars part)
  and lets a pulse through; the damage sensor ASSEMBLES (its pieces snap into a ring) and then glows.

  OUTCOMES (implement exactly; readout text is shown to readers verbatim):
  - Swimming bacterium: sensors 1 and 2 at the surface; after engulfing, sensor 5 in the bubble.
    Output: inflammatory cytokines only.
    Detected: "LPS from the outer wall, flagellin from the tail, and bacterial DNA once the bacterium is digested."
    Sensors: "1, 2 and 5: bacterial-wall, flagellum and microbial-DNA sensors."
    Where: "On the surface first, then inside the digestion bubble."
    Alarm: "Inflammatory cytokines: call for reinforcements."
  - Virus: sensors 4 (bubble) and 6 (interior). Output: strong interferon plume plus a smaller cytokine plume.
    Detected: "Viral RNA in forms our own cells rarely make: double strands, or strands with an unusual chemical tag at one end."
    Sensors: "4 and 6: viral-RNA sensor in the bubble; interior RNA sensor."
    Where: "Inside the cell. From the outside, a virus offers few patterns to grab."
    Alarm: "Interferons warn the neighbors; some inflammatory cytokines too."
  - Crushed body cell: as its particles spill, small needle-shaped crystals form outside it. ATP dots touch
    the outer surface: the ATP gate (3) opens and a pulse runs inward. A crystal is swallowed into the
    digestion bubble, and the bubble's membrane tears (a small visible rip). Both events converge on the
    damage sensor (8), which assembles into its ring and glows. A few DNA strands reach the interior and
    sensor 7 lights faintly. Output: moderate inflammatory-cytokine plume.
    Detected: "Molecules that belong inside cells (ATP, DNA, uric acid) spilled outside, where uric acid forms crystals."
    Sensors: "3, 8 and 7: ATP gate, damage sensor, misplaced-DNA sensor."
    Where: "At the surface and inside the sentinel. The damage sensor reacts to the disturbance these spilled molecules cause, not to the molecules themselves."
    Alarm: "Inflammatory cytokines, with no microbe in sight. This is why injuries swell even without infection."
  - Healthy body cell: it drifts up, touches the macrophage, and drifts back. NOTHING lights.
    Detected: "Nothing. Every molecule here is 'self', and in its proper place." Alarm: "None."
  - Cancer cell: it drifts up and touches; nothing lights.
    Detected: "No microbial patterns. Cancer cells are built from the body's own molecules." Alarm: "None, so far."
    Then show a secondary button inside the readout: "What if it dies messily?" Pressing it ruptures the
    cancer cell; DNA and ATP tokens spill. The ATP gate opens, the damage sensor assembles, and the
    misplaced-DNA sensor (7) lights, with its STING partner glowing on the ER strip. A small interferon plume
    and a small cytokine plume appear. Readout becomes: "Dying cancer cells can spill DNA that trips the
    misplaced-DNA sensor, producing interferons. In nearby dendritic cells, this is one way the immune
    system first notices a tumor (Chapter 7)."

  LEGEND / "Show molecular names" toggle. Default legend (plain): 1 Bacterial-wall sensor, 2 Flagellum
  sensor, 3 ATP gate, 4 Viral-RNA sensor, 5 Microbial-DNA sensor, 6 Interior RNA sensor, 7 Misplaced-DNA
  sensor, 8 Damage sensor. With the toggle on, the legend adds molecular names: 1 TLR4, 2 TLR5, 3 P2X7,
  4 TLR8 (and TLR7), 5 TLR9, 6 RIG-I (and MDA5), 7 cGAS, with its partner STING on the ER, 8 NLRP3
  inflammasome. When the toggle is on, show one line under the legend: "In human macrophages, TLR8 does
  most of the RNA sensing inside digestion bubbles, and TLR9 works mainly in other immune cells (plasmacytoid
  dendritic cells and B cells). This sentinel is drawn with the full set for simplicity."

  SCIENCE: DO NOT CHANGE.
  - TLR4 and TLR5 sit on the outer surface; TLR8/7 and TLR9 sit in the digestion-bubble membrane, never on
    the outer surface. RIG-I/MDA5, cGAS and NLRP3 work in the cell interior (cytoplasm), never inside the
    bubble or on the outer surface. STING is NOT free-floating: it sits on the ER membrane strip.
  - NLRP3 (damage sensor) does not bind ATP or crystals. ATP is detected at the surface by the P2X7 gate;
    crystals act by rupturing the digestion bubble; NLRP3 responds to these disturbances by assembling.
  - Uric acid is dissolved inside cells; it forms crystals only after release. Do not draw crystals inside
    the intact or crushed cell.
  - The healthy cell must trigger nothing.
  - Sensors recognize CLASSES of molecules, not species. Never label a sensor "E. coli sensor" or "flu sensor".
  - The macrophage does not learn the specific suspect: offering the same suspect twice gives the same
    response.
  - Scale: macrophage about 1.5× a neutrophil; bacterium about 1/12 of the macrophage's diameter; the virus
    is hundreds of times smaller than drawn (hence "Not to scale"). Body cells are roughly macrophage-sized;
    on tray cards they can be drawn small, and only part of them needs to touch the macrophage.
  - Acceptable simplifications (leave out): helper proteins (e.g., MD-2 for TLR4), the many signaling steps,
    and the inflammasome's need for a "priming" signal.

  MOBILE (≤600 px). Portrait viewBox (about 420x640): the cell fills the top ~65% of the stage at full width,
  with the three zone labels kept and the numbered badges at ≥14 px. The tray becomes a row of five HTML
  buttons (wrapping to 3+2) below the stage; the readout and legend sit below the tray (minimum font 12 px).
  REDUCED MOTION: skip travel and engulfing tweens; cross-fade straight to the end state (sensors lit, plume static).
alt: A large macrophage is shown in cutaway with eight numbered sensors on its outer surface, in the membrane of an internal digestive compartment (an endosome), and in its interior. The reader offers it a bacterium, a virus, a crushed body cell, a healthy cell or a cancer cell. The bacterium and virus light up specific sensors and make the macrophage release inflammatory cytokines or antiviral interferons; the crushed cell triggers a damage sensor; the healthy cell and the intact cancer cell trigger nothing.
:::

:::key-idea
The innate immune system does not identify which microbe it faces, only *what kind of thing* it is and whether something is wrong. It detects molecular signatures that microbes can't easily change and that healthy cells don't display.
:::

:::deep-dive A fly, a mouse and a prediction
Janeway's 1989 essay argued that adaptive immunity could not be the whole explanation.[^1] He predicted that innate cells carry inherited receptors for conserved microbial patterns, and that these receptors give the adaptive system permission to respond.

The receptors were first found in fruit flies, where a gene called *Toll* (named, the story goes, after a German exclamation of amazement) was known for helping to set up the body plan of the embryo. In 1996, Jules Hoffmann's group in Strasbourg found that adult flies with a broken Toll pathway could not activate their antifungal defenses and died of fungal infections.[^3] A year later, Ruslan Medzhitov and Janeway described a human relative of Toll. When activated in cultured human cells, it triggered expression of genes for inflammatory cytokines and for B7.1, a molecule T cells need before they will respond.[^4] In 1998, Bruce Beutler's group solved an old mystery. Two mouse strains that tolerated huge doses of LPS, yet died easily of infections with LPS-coated bacteria, both had a broken *Tlr4* gene.[^5] TLR4 was the LPS sensor. Hoffmann and Beutler shared the 2011 Nobel Prize in Physiology or Medicine with Ralph Steinman, who discovered dendritic cells.

Humans have ten TLRs.[^2] Those on the cell surface (TLR1, 2, 4, 5 and 6) recognize microbial membranes and proteins; TLR10, also on the surface, still has an uncertain role. Those in endosomes (TLR3, 7, 8 and 9) recognize genetic material: double-stranded RNA (TLR3), single-stranded RNA (TLR7 and 8), and DNA rich in unmethylated "CpG" motifs (TLR9). TLRs are one of several families of pattern-recognition receptors.[^2] The others are NOD-like receptors (some assemble "inflammasomes" that activate the cytokine IL-1β), RIG-I-like receptors for viral RNA in the cytoplasm (RIG-I favors short double strands with an unusual triphosphate group at one end; MDA5 favors long double strands), and C-type lectin receptors for microbial sugars, such as those in fungal walls. A cytoplasmic DNA sensor, cGAS, signals through STING, a partner protein anchored in the membrane of the endoplasmic reticulum.[^6][^7]

Not every innate sensor binds its target directly. The NLRP3 inflammasome responds to the *consequences* of damage. Extracellular ATP opens a surface channel called P2X7, letting potassium leak out of the cell,[^8] and engulfed crystals rupture the membranes of the compartments that hold them.[^9] NLRP3 detects these disturbances and assembles into a ring-shaped complex that activates IL-1β.
:::

## Anatomy of an inflammation

{{inflammation|Inflammation}} is the body's emergency response to infection or injury: a coordinated set of changes that brings defensive cells and proteins to one spot. About two thousand years ago, the Roman writer Celsus listed its four signs: *rubor, calor, tumor, dolor*, or redness, heat, swelling and pain.[^10] (*Tumor* originally meant any swelling.) Each sign has a specific mechanism.

**The alarm.** The macrophage that has detected bacteria releases inflammatory cytokines. The main ones are {{tnf|TNF}}, IL-1 and {{il-6|IL-6}} (which returns in Chapter 10); TNF and IL-1 make nearby vessel linings display {{adhesion-molecule|adhesion molecules}}, surface proteins that bind passing white blood cells.[^12] Other cytokines, called {{chemokine|chemokines}}, attract cells: they form a concentration gradient that white blood cells follow to its source. Nearby mast cells release the {{histamine|histamine}} in their granules within minutes.

**Redness and heat.** These signals widen the small blood vessels nearby. More warm blood from the body's core flows through, so the skin reddens and feels hot.

**Swelling.** The cells lining the vessels, the {{endothelium|endothelium}}, loosen the junctions between them, and fluid seeps out into the tissue. This leak, not the bacteria, makes the area puffy. It also carries defensive blood proteins, such as complement (below), straight to the site. The blood left behind slows down, so passing white blood cells drift close to the vessel wall, where they can be caught.

**Pain.** Chemicals made at the site, such as {{prostaglandin|prostaglandins}}, make nerve endings fire more easily, and the swelling adds pressure. The pain makes you protect the injured part. Aspirin and ibuprofen dull it largely by blocking the enzymes that make prostaglandins.

Next, white blood cells arrive from the blood: first {{neutrophil|neutrophils}}, then {{monocyte|monocytes}}, which become new macrophages in the tissue. Neutrophils are the most abundant white blood cells and among the shortest-lived. The bone marrow makes roughly 50 to 100 billion a day, and half of those in circulation are replaced in under a day (classic estimates said 6 to 8 hours; a 2016 labeling study, about 19).[^11][^24] In the bloodstream they move too fast to stop at a small wound unless an inflamed vessel wall catches them.

The capture takes three steps.[^12] {{selectin|Selectins}}, adhesion molecules on the vessel lining, bind passing neutrophils and quickly let go again, so the cells slow down and *roll* along the wall. Chemokines on the wall then activate the neutrophil's own adhesion molecules, the {{integrin|integrins}}, which bind the lining much more strongly, and the neutrophil *sticks*. Finally it *squeezes* out between the lining cells and crawls up the chemokine gradient toward the bacteria. Within hours, neutrophils are pouring in.

The number that arrive depends on the threat. A larger invasion triggers more sensors and a stronger cytokine response, while a single dying cell may attract none: in mice, a resident macrophage covers it before the damage signals it releases can spread.[^25] Because each step needs its own signal, neutrophils leave the blood only where the vessel lining and the chemokines agree, so one faulty patch of vessel can't easily release them into healthy tissue. T-cell activation relies on the same principle of several confirmations (Chapter 4).

Neutrophils engulf bacteria and die quickly; their remains, mixed with dead bacteria, form pus. Macrophages then engulf the dead neutrophils, the signals change, the vessels tighten and repair begins. Healthy inflammation is brief, and it is actively shut down.

Inflammatory cytokines also act at a distance. Those that reach the brain raise the body's temperature set point, causing fever. Sometimes the response to an infection runs out of control: vessels leak all over the body, blood pressure falls and organs fail. This is {{sepsis|sepsis}}. The danger comes from the body's own response, and the microbes need not be in the blood. Some cancer immunotherapies trigger a similar surge, {{crs|cytokine release syndrome}} (Chapters 9 and 10).

:::figure ch02-inflammation
title: Anatomy of an inflammation
goal: After stepping through this, the reader can explain each of the four classic signs of inflammation (redness, heat, swelling, pain) by its mechanism, and describe how neutrophils leave the blood (roll, stick, squeeze through) to reach bacteria, in the right order and on roughly the right time scale.
kind: stepper
stage: dark
spec: |
  LAYOUT (desktop, landscape viewBox about 1000x600). A side-on cross-section through skin.
  - Stage tags (top right, t-caps, two at most): "Not to scale" and "Time compressed".
  - HUD (top left): `ctx.ui.clock` with a phrase that changes per step ("0 min", "first minutes", "first
    hour", "hours", "first day", "days"). Use these phrases only; no precise times.
  - FOUR-SIGNS STRIP (HTML, directly above the stage on every screen size, so it never collides with the tags):
    four badges, each an icon plus a word: Redness (drop icon), Heat (thermometer), Swelling (outward arrows),
    Pain (bolt). Unlit = outline only; lit = filled plus soft glow. Never rely on color alone.
  - Top band (~15% of height): the skin surface, layered sand/beige strata. A splinter (warm brown wooden
    shard, only its tip visible; it is millimeters long while cells are micrometers) pierces it diagonally
    from the upper left.
  - Middle (~50%): loose connective tissue (faint wavy fibers on the dark stage). In it: one resident
    macrophage (art library macrophage, polarization 0), one mast cell (art library `mastCell`), and one fine
    nerve ending (thin, pale, branching line ending near the splinter).
  - Bottom (~35%): a small blood vessel (a postcapillary venule) running horizontally across the stage. Its
    wall is a row of flat endothelial cells (thin tiles with visible junctions). Inside, blood flows left to
    right carrying red blood cells (art library `redBloodCell`, seen side-on) and a few neutrophils (art
    library neutrophil: pale pink, multi-lobed nucleus, fine granules).

  CONTROLS (HTML under the stage, via `ctx.ui.stepper`): Back / Next buttons and step dots (clickable), with
  the dots GROUPED into three labeled phases: "The alarm" (steps 1–2), "The four signs" (steps 3–5), "The
  reinforcements" (steps 6–9). "Play all" auto-advances with a per-step hold of 2.5 s + 0.35 s per caption
  word (≈10–12 s per step); it pauses on any interaction. "Restart". The caption region is an ARIA live
  region. Each step animates into its state in 1.5–2.5 s, then holds a calm idle loop (blood flowing, cells
  breathing). Going Back restores the previous state exactly.

  STEP STATES.
  1. Splinter enters; about 12 bacteria (chartreuse, small rods and spheres, ~1/10 of a neutrophil's
     diameter) spill into the tissue near the tip and drift slightly. Clock "0 min". All badges unlit.
  2. Macrophage's surface sensors glow briefly (echo of the previous figure). It releases solid coral dots
     (cytokines) that spread, plus smaller dots arranged as a gradient (chemokines), densest near the bacteria.
     The mast cell empties its granules: small dots in the mast-cell palette color (histamine) drift outward
     gently. Clock "first minutes".
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
     bacterium, which ends up inside a bubble in the neutrophil and fades. Several neutrophils then die
     (`setDying`: shrink and fragment, never explode); their remains collect near the splinter as a pale-yellow
     cluster labeled "pus". Clock "first day".
  9. Bacteria gone. The macrophage eats dead neutrophils; its polarization tweens slowly from 0 toward 0.6
     (repair mode, previewing a later figure). The vessel narrows back, gaps close, the swelling subsides, the
     warm tint fades, and all four badges dim to outline. Clock "days".

  SCIENCE: DO NOT CHANGE.
  - Neutrophils leave at small venules, never through an artery. Order is fixed: roll → stick → squeeze through.
  - Rolling uses weak, fast on/off bonds (selectins); firm sticking uses a different, stronger grip
    (integrins) that is switched on by chemokines. Show these as visually distinct molecules.
  - Neutrophils mostly squeeze BETWEEN endothelial cells (showing that is fine).
  - Red blood cells do not leave the vessel.
  - Size ratios: neutrophil about 1.7× a red blood cell; macrophage about 1.5× a neutrophil or more; bacteria
    about 1/10 of a neutrophil. The vessel may be drawn wider than real for clarity.
  - Swelling is mainly fluid leaking out of vessels; heat and redness are mainly more blood flowing through.
  MOBILE: portrait viewBox (about 420x700) with the same top-to-bottom layering (skin, tissue, vessel); the
  vessel runs horizontally across the full width. The four-signs strip stays above the stage; phase labels sit
  above the step dots. Controls stay as large touch targets.
  REDUCED MOTION: jump to each step's end state; no idle loops (blood shown static).
steps:
  1. A splinter breaks the skin and carries bacteria into the tissue below. In the warm, nutrient-rich tissue, they begin to multiply.
  2. A resident macrophage detects the bacteria and releases inflammatory cytokines, which recruit other immune cells, and chemokines, which form a concentration gradient leading to the site. A nearby mast cell releases its histamine.
  3. Cytokines and histamine widen the blood vessels. Small arteries upstream relax, so more warm blood from the body's core pours into vessels like this one, and the skin turns red and hot.
  4. The cells lining the vessel loosen the junctions between them, and fluid leaks into the tissue. That leak is the swelling, and it carries defensive blood proteins to the site.
  5. Chemicals such as prostaglandins make nerve endings fire more easily, and the swelling adds pressure. The pain makes you protect the injured spot.
  6. Blood flow has slowed. Near the infection, the vessel lining displays adhesion molecules called selectins; passing neutrophils bind them, let go and bind again, so they roll along the wall.
  7. Chemokines on the vessel wall activate the neutrophil's integrins, adhesion molecules that bind much more strongly. The neutrophil stops, flattens, and squeezes out between the lining cells into the tissue.
  8. Neutrophils follow the chemokine gradient to the bacteria and engulf them. Many neutrophils die in the process; their remains, mixed with dead bacteria, are pus.
  9. Once the bacteria are gone, macrophages clear away the dead neutrophils and shift toward repair. The vessels tighten, the swelling drains, and the four signs fade.
alt: A cross-section of skin with a splinter, tissue and a blood vessel. In nine steps grouped into three phases, bacteria enter; a macrophage and a mast cell release cytokines and histamine; the vessel widens (redness, heat) and leaks fluid (swelling); nerve endings are sensitized (pain); neutrophils roll along the vessel wall, stick, squeeze out, and engulf the bacteria, forming pus; finally macrophages clean up and the signs fade.
:::

:::deep-dive The molecules behind the four signs
**Redness and heat.** Histamine from mast cells, followed by prostaglandins and nitric oxide, relaxes the muscle around small arteries so that more blood enters the local capillary beds.

**Swelling.** Histamine, bradykinin and cytokines make the endothelial cells of small venules contract and loosen their junctions. Plasma proteins leak out, and water follows them.

**Pain.** Prostaglandin E2 and bradykinin lower the firing threshold of pain-sensing nerve endings. Aspirin, ibuprofen and related drugs block the cyclooxygenase (COX) enzymes that make prostaglandins.

**Fever.** The cytokines IL-1, IL-6 and TNF act on the brain and trigger prostaglandin E2 production in the hypothalamus, which raises the body's temperature set point. This is why the same drugs that dull inflammatory pain also bring down fever.

**The neutrophil's exit**, called {{extravasation|extravasation}}, follows a sequence known as the leukocyte adhesion cascade.[^12] (1) Selectins on activated endothelium bind sugar structures on the neutrophil. These bonds form and break quickly, which produces rolling. (2) Chemokines such as CXCL8 (also called IL-8), displayed on the vessel wall, shift the neutrophil's integrins, such as LFA-1 and Mac-1, into a high-affinity state. (3) The integrins bind ligands such as ICAM-1 on the endothelium, causing firm arrest. (4) The neutrophil crawls to a junction and transmigrates, usually between endothelial cells and occasionally straight through one. The same routine, run with different adhesion molecules and chemokines, decides where other white blood cells, T cells among them, can leave the blood (Chapter 4).

The cascade's importance is clearest when it breaks. In leukocyte adhesion deficiency type 1, a rare inherited disease, the integrin chain CD18 is missing or defective. Patients' blood is crowded with neutrophils that cannot get out of it, so they suffer severe bacterial infections that form little or no pus.
:::

## Phagocytosis

The cells that respond deal with most microbes by engulfing and digesting them. In 1882, in Messina, Sicily, the zoologist Élie Metchnikoff pushed rose thorns into transparent starfish larvae. When he looked again, the thorns were surrounded by mobile cells that appeared to be trying to engulf the intruder. He went on to argue that such "eating cells", or phagocytes, are a central defense in animals, including us, and shared the 1908 Nobel Prize for the idea.[^13]

In {{phagocytosis|phagocytosis}}, a phagocyte (usually a neutrophil or a macrophage) binds a microbe with its surface receptors, extends its membrane around it and seals it inside an internal compartment, the {{phagosome|phagosome}}. The phagosome fuses with {{lysosome|lysosomes}}, compartments filled with acid and digestive enzymes, while the cell pumps in reactive oxygen species, unstable oxygen-containing molecules that act like bleach. Few bacteria survive this, though some, such as the tuberculosis bacterium, have evolved to live inside macrophages.

Phagocytes also clear away the body's own dead cells, some 330 billion a day, mostly worn-out blood cells.[^26] A cell dying by {{apoptosis|apoptosis}}, an orderly, programmed death, dismantles itself without spilling its contents, releases "find me" signals and displays "eat me" signals; healthy cells display "don't eat me" signals instead.[^27] One of these, {{cd47|CD47}}, matters for cancer: some tumors make extra CD47 to escape phagocytosis by macrophages (Chapter 12).

Phagocytes engulf a microbe more readily once it is coated with blood proteins that their receptors bind. This coating is called {{opsonization|opsonization}}, from a Greek word for preparing food. The two main coatings are antibodies, which appear later in an infection (Chapter 3), and {{complement|complement}}, which is present from the start.

## Complement: a cascade in the blood

Complement is a set of dozens of inactive proteins, made mostly by the liver, that circulate in your blood. Once triggered on a microbe's surface, the first protein activates many copies of the next, and so on down the chain, so that within minutes a small trigger is greatly amplified. The cascade **opsonizes** the microbe for phagocytes, **attracts** neutrophils, and can **form ring-shaped pores** that burst some bacteria.[^14]

Complement spares our own cells because they carry surface proteins that inactivate it as soon as it starts, and microbes lack them.[^14] The target is recognized by what it is *missing*, a principle that returns with NK cells below.

:::deep-dive Complement's three pathways
Complement can be activated in three ways, all converging on one central protein, C3.[^14]

- **Classical pathway.** A protein called C1q binds antibodies that are bound to a surface (it can also bind some microbes directly). This is how antibodies recruit complement, and one way some antibody drugs damage cancer cells (Chapter 9).
- **Lectin pathway.** Mannose-binding lectin and ficolins recognize sugar patterns on microbes: pattern recognition again, this time floating in the blood.
- **Alternative pathway.** C3 breaks down slowly and spontaneously all the time, and its active fragment attaches to whatever surface is nearby. On a microbe, it amplifies; on our cells, regulators inactivate it.

All three routes build an enzyme, a C3 convertase, that cleaves C3 into C3b, which opsonizes the target, and C3a, a small fragment that promotes inflammation. C5 is cleaved next. C5a strongly attracts neutrophils, and C5b seeds the membrane attack complex, which is built from C5b, C6, C7, C8 and many copies of C9.

Human cells protect themselves with membrane regulators such as CD55, CD46 and CD59, and with factor H from the blood. The same regulators now protect transplanted organs: the pig whose heart was given to a man in 2022 had been gene-edited to carry human CD46 and CD55, to help shield it from human complement, and to lack three sugars that human antibodies attack.[^28] Many tumors that persist in the body carry high levels of these same regulators, which is one reason complement on its own rarely clears cancer.[^14] Complement can even help tumors: in some, fragments such as C5a appear to recruit immune-suppressing cells.[^14]
:::

## The antiviral alarm

Viruses are copied inside cells, out of reach of phagocytes and complement.

The infected cell is the first to detect the virus. Its internal sensors find viral genetic material where none should be, and it releases *type I* interferons, named because they *interfere* with viruses. A rare specialist, the plasmacytoid dendritic cell, also makes interferon without being infected, hundreds of times more than other blood cells.[^29] Neighboring cells that bind these interferons activate many defensive genes. They slow their protein synthesis, which the virus needs, and degrade RNA to stall the virus. They also display more {{mhc-class-i|MHC class I}} molecules (explained below), so that killer T cells can inspect them (Chapter 4). Type I interferons also activate {{nk-cell|natural killer cells}}, the subject of the next section. The interferon response has a cost: some of the fever, aches and exhaustion of a viral illness come from it, not from the virus.

**Two interferons, two jobs.** Type I interferons come mostly from *infected* cells and act on their neighbors. {{ifn-gamma|Interferon-gamma (IFN-γ)}} comes from *immune* cells, NK cells and T cells, once they are activated, and strengthens the immune attack instead. It drives macrophages into fight mode and makes nearby cells display more MHC class I, but it also makes them display PD-L1, which binds a brake receptor on T cells and damps their response (Chapters 5 and 8).

Interferons also matter for cancer in other ways. In mice, DNA from tumor cells can reach dendritic cells and trigger the misplaced-DNA sensor there (called cGAS–STING), and the type I interferon it produces is needed to {{priming|prime}} killer T cells against the tumor.[^6] Drugs that trigger this sensor, and tumors that stop responding to IFN-γ, return in Chapters 7 and 12.

:::clinic
A cream that mimics a viral alarm can clear some skin cancers. Imiquimod activates TLR7, one of the sensors for viral RNA, mainly in plasmacytoid dendritic cells,[^30] and so triggers a local, interferon-rich inflammatory response that recruits other immune cells. In two randomized trials in superficial basal cell carcinoma, a slow-growing skin cancer, about three-quarters of tumors treated five times a week for six weeks were gone when checked clinically and under the microscope 12 weeks later.[^15] The cream has been approved for this use in the United States since 2004, mainly where surgery is a poor option. It is a small proof of principle that triggering innate sensors can turn the immune system against a tumor.
:::

## Natural killers and the missing self

Natural killer (NK) cells are {{lymphocyte|lymphocytes}}, related to T and B cells, but they belong to the innate system: they kill without prior exposure to their target, hence "natural". Their granules hold {{perforin|perforin}}, which forms pores in a target cell's membrane, and {{granzyme|granzymes}}, enzymes that enter through those pores and trigger apoptosis in the target cell. (Killer T cells use the same molecules; see Chapter 5.)

NK cells have no receptor for any particular virus or tumor. In the 1980s, the Swedish immunologist Klas Kärre proposed that they look not for something foreign but for something *missing*.[^16]

Almost every cell with a nucleus displays MHC class I molecules on its surface, and these continuously present fragments of the proteins the cell is making inside. This guide calls the class I display the cell's **shop window**. The nickname has one limit: the display shows short fragments of proteins, not whole ones (Chapter 4 explains how). Killer T cells inspect *what* class I displays (Chapters 4 and 5); NK cells detect when the display is *missing*.

Viruses and tumors both benefit from removing this display. Many viruses make infected cells remove MHC class I from their surface, so killer T cells can't detect the viral fragments. Many cancers end up the same way: T cells kill the tumor cells whose class I molecules display abnormal fragments, while cells that happen to have lost class I survive and multiply, so over time the tumor fills with cells T cells cannot detect.[^17] (Chapter 7 returns to this.) Kärre's team found that losing class I has a cost. In mice, lymphoma cells (a cancer of lymphocytes) that had lost their MHC molecules were rejected more readily than ordinary ones, by a defense that needed no prior immunization.[^16] Kärre called the principle {{missing-self|missing self}}.

An NK cell decides by adding up two kinds of signal. *Inhibitory* receptors bind MHC class I and send a **stop** signal. *Activating* receptors bind {{stress-ligand|stress ligands}} (drawn as flags in the figure), molecules that cells display when they are infected, damaged or turning cancerous, and send a **go** signal.[^18] Healthy cells provide strong inhibitory signals and only weak, constant activating ones, so they are spared. Remove the inhibitory signal and activation wins, by a wider margin if the cell is also stressed.

:::figure ch02-nk-missing-self
title: The missing-self balance
goal: After playing with this, the reader understands that an NK cell weighs "stop" signals (MHC class I in the shop window) against "go" signals (stress ligands), kills when go outweighs stop, and that a cancer cell which empties its shop window to hide from killer T cells can thereby become visible to NK cells, if an NK cell reaches it.
kind: explorer
stage: dark
spec: |
  LAYOUT (desktop, landscape viewBox about 1000x560).
  - Stage tag (top right, t-caps): "Simplified model".
  - Left: an NK cell (art library NK cell: orange, round, visible darker granules). Right: the TARGET cell
    (about the same size or slightly larger), whose look depends on the target type: Healthy = sand, calm
    rounded polygon with neat nucleus; Infected = the same sand cell with 4–6 small red-coral virus particles
    visible inside; Cancer = violet-magenta, lumpy outline, large misshapen nucleus. The two cells nearly
    touch in the middle (the "contact zone").
  - On the target's surface: up to 8 SHOP-WINDOW DISPLAYS (art `mhc1({ peptide })`, cups ≥14 px). Peptide
    beads follow the book rule: Healthy = all sand (self); Infected or Cancer = roughly 1 in 4 beads hot pink
    with a glow (viral or mutant), the rest sand. And up to 8 STRESS FLAGS (stress ligands: small pennant
    glyphs in the activating green-cyan with a "+" signal icon). Both are spread around the WHOLE target
    outline; only those in the contact zone pair up with the NK cell. An emptier window means FEWER CUPS on
    the surface (absent cups), never empty cups.
  - On the NK cell's facing surface: inhibitory receptors (crimson bar shape with the "−" signal icon) and
    activating receptors (green-cyan arrow-head shape with the "+" signal icon). When a receptor meets its
    partner, a short bond line forms and glows. Inhibitory pairs with displays; activating with flags.
  - Top center: a BALANCE (a beam on a fulcrum). Left pan "STOP (−)" fills with small crimson weights (one per
    bound display, each with a "−"). Right pan "GO (+)" holds two small hollow green weights labeled "everyday
    activating signals" plus one solid green weight per bound flag (each with a "+"). The beam tilts smoothly
    with the net signal. Under the beam, a verdict badge (`ctx.ui.badge`): ✓ "Spared", ≈ "Undecided" or
    ✕ "Killed".
  - Under the verdict badge, ONE line of text: the "T-cell note" (rules below). No other inset.
    No faces or eyes on any cell.
  - Under the stage (HTML, ink-3, always visible): "Shows only how the decision works once an NK cell touches
    a cell. In real solid tumors, NK cells often fail to get in at all."

  CONTROLS (HTML below the stage):
  - Slider A: "Shop window (MHC class I)", end labels "empty" and "full". No numbers or percentages shown.
  - Slider B: "Stress flags", end labels "none" and "many". No numbers or percentages shown.
  - Preset buttons (each sets target type and both sliders, then automatically runs the decision):
      "Healthy cell" → Healthy, window 1.00, flags 0.05
      "Virus-infected cell hiding from T cells" → Infected, window 0.15, flags 0.70
      "Cancer cell that kept its window" → Cancer, window 0.90, flags 0.55
      "Cancer cell that emptied its window" → Cancer, window 0.10, flags 0.65
  - Button "Let the NK cell decide" (runs the decision animation for the current slider values).
  Moving sliders updates displays, flags, bonds, beam tilt, verdict badge and T-cell note LIVE; the kill/spare
  animation runs only on preset or button press. Sliders keep the current target type.

  MODEL (a deliberate simplification; implement exactly; internal values 0..1):
    I (stop) = window
    A (go)   = 0.2 + 0.8 × flags (0.2 = everyday activating signals most nucleated cells carry)
    net = A − I
    verdict = "Killed" if net ≥ 0.15; "Spared" if net ≤ −0.10; otherwise "Undecided".
    Beam tilt = clamp(net, −1, 1) × 18°. Visible display count = round(window × 8); flag count = round(flags × 8).
  Check: Healthy → Spared; Infected hiding → Killed; Cancer kept window → Spared; Cancer emptied window →
  Killed; flags 1.00 with window 0.90 → Undecided (strong stress can partly override the window).

  T-CELL NOTE (shown verbatim; one line):
    Healthy target (window > 0): "A killer T cell would see only normal fragments and move on."
    Infected/Cancer, window ≥ 0.30: "A killer T cell can read this window and may spot the abnormal fragments (Chapters 4–5)."
    Infected/Cancer, 0 < window < 0.30: "With few windows left, a killer T cell may miss this cell."
    Any target, window = 0: "With no window at all, a killer T cell cannot see this cell."
  When the preset "Cancer cell that emptied its window" is active and the verdict is Killed, add a second line:
  "Hiding from T cells made it visible to this NK cell."

  DECISION ANIMATION (use the shared kill grammar, `cell-actions.kill`, in orange).
  - Killed (≈2.5 s): the NK cell docks and flattens slightly; granules glide to the contact side; a small
    perforin/granzyme puff crosses the gap; the target dies by `setDying` (shrinks, blebs into 3–5 fragments
    that fade), never an explosion. The NK cell detaches intact and glides a little away, ready for the next
    target. Then show "New target" to restore the target with current settings.
  - Spared (≈1.2 s): the bonds release and the NK cell drifts slightly away, then settles.
  - Undecided: the NK cell stays in contact; the contact zone pulses slowly (no flashing).

  SCIENCE: DO NOT CHANGE.
  - NK inhibitory receptors care mainly THAT MHC class I is present, not which fragment it holds. Do not
    show NK cells reading the bead in the window.
  - Killer T cells are extremely sensitive: a handful of displays can be enough. Never describe a T cell as
    blind unless the window is completely empty.
  - The NK cell needs no prior exposure to the target. Its tools are perforin and granzymes, causing
    apoptosis (an orderly shrink-and-fragment death), not an explosion.
  - Real NK cells integrate many receptor types; the two-slider balance is an acknowledged simplification.
  - Size ratio: NK cell about 1.5× a resting T cell (it is a large granular lymphocyte); body cells somewhat
    larger than the NK cell.
  MOBILE: portrait viewBox (about 420x620): the balance across the top of the stage; NK cell top-center and
  target bottom-center with the contact zone between them; verdict badge, T-cell note and footnote below the
  stage as HTML. Sliders full-width; presets as a 2x2 grid of buttons.
  REDUCED MOTION: no idle pulsing; decisions cross-fade directly to the end state (target fragmented or intact).
alt: An NK cell faces a target cell. Two sliders set how full the target's MHC class I "shop window" is and how many stress ligands (drawn as flags) it displays; a balance weighs inhibitory signals from the window against activating signals from the stress ligands. Healthy cells with a full window are spared; infected or cancerous cells that have emptied their window and display stress ligands are killed. A note explains that an emptied window makes the cell hard for killer T cells to detect but exposes it to an NK cell that reaches it.
:::

:::key-idea
In principle, a cancer cell can't easily hide from both killer T cells and NK cells. If it keeps its MHC class I display, killer T cells may detect the abnormal fragments in it; if it loses class I, NK cells detect that something is missing. In practice, NK cells often never reach a {{solid-tumor|solid tumor}}, so losing class I remains a common and often successful escape.
:::

In people, the clearest evidence for a role against viruses comes from rare individuals born without working NK cells. The first described, a teenage girl, had severe chickenpox and other herpesvirus infections; others struggle to clear papillomavirus.[^31][^32] For cancer, the evidence is thinner. In an 11-year study of 3,625 residents in Japan, those whose blood cells showed medium or high natural killing activity had about a 40 percent lower risk of cancer than those with low activity.[^19] That is a correlation, not proof. How much NK cells control established solid tumors in people is uncertain, and tumors have ways of evading them (Chapters 7 and 12).

:::deep-dive The molecules of missing self
**Inhibitory receptors.** In humans, the main inhibitory NK receptors for MHC class I are the killer-cell immunoglobulin-like receptors (KIRs), which bind particular groups of HLA-A, HLA-B and HLA-C molecules (HLA is the human version of MHC; see Chapter 4). The other main one is CD94/NKG2A, which binds a much less variable MHC-like molecule called HLA-E.[^18] HLA-E displays fragments cut from the starting segment of other HLA molecules, so its presence reports whether the cell is producing its other HLA molecules normally.

**Activating receptors.** The best-studied activating receptor is NKG2D. It binds stress-induced proteins called MICA, MICB and the ULBP family, which are scarce on healthy cells but appear after DNA damage, infection or cancerous transformation.[^18] Other activating receptors include NKp30, NKp46 and DNAM-1. There is also CD16, which binds the Fc region (the stem of the Y; Chapter 3) of antibodies coating a target cell and triggers *antibody-dependent cellular cytotoxicity* (ADCC), a mechanism that some antibody drugs rely on (Chapter 9).

**Calibration.** KIR genes vary enormously between people and are inherited separately from HLA genes, so each person's NK cells must be tuned to that person's own MHC molecules. During development, NK cells whose inhibitory receptors bind self MHC class I become fully responsive, a process called "education". Those that never bind a matching MHC class I molecule stay less responsive, which helps prevent NK cells from attacking healthy cells that happen to display little MHC class I. Red blood cells, which carry little or no MHC class I, are spared for a related reason: they also carry almost no activating ligands.

**Limits.** NK cells clearly control some virus infections and can kill tumor cells efficiently in a dish and in mouse models. Their role against established solid tumors in people is less certain: they often fail to penetrate such tumors, and tumors can blunt them, for example by shedding stress ligands as decoys or by raising HLA-E. NK cells may matter most against cancer cells spreading through the blood, which NK cells patrol; in mice, removing NK cells lets injected cancer cells seed far more metastases, and in one model NK cells kept breast-cancer cells dormant in the liver until the NK cells dwindled.[^33][^34] Boosting NK cells, with cytokines, NK-cell engagers, antibodies that block NKG2A, or engineered CAR-NK cells, is an active research area with mixed results so far (Chapter 12).
:::

## Macrophages: fight mode and repair mode

The same macrophage runs different programs depending on the signals around it. Exposed to microbial molecules and IFN-γ, it goes into **fight mode**: it kills what it engulfs and releases cytokines that recruit other immune cells and help activate T cells. Exposed to anti-inflammatory signals once an infection has cleared, it shifts into **repair mode**: it clears debris, damps inflammation, promotes the growth of new blood vessels and helps lay down new tissue.

Immunologists label the two ends "M1" and "M2". The labels are a simplification: macrophages show a spectrum of mixed states, and one cell can shift between them as conditions change.[^20] In healthy inflammation, macrophages move from fighting to repair; problems arise when they get stuck in one mode.

In 1986, the pathologist Harold Dvorak pointed out that tumors closely resemble wounds, full of leaky vessels, clotting proteins, scar-forming cells and new blood vessels, and called them "wounds that do not heal".[^21] Tumors exploit the repair program. Many are packed with {{tumor-associated-macrophage|tumor-associated macrophages}} that sit toward the repair end of the spectrum, helping build the tumor's blood supply and suppressing the T cells that might attack it. A tumor can be heavily inflamed and still protected, because its inflammation is of the repair kind. Chapter 7 returns to them as one of the suppressor cell types that tumors recruit.

The reverse is also true: inflammation that never resolves can help *start* cancer. Many cancers arise at sites of long-term infection, irritation and inflammation.[^22] Chronic infection with the stomach bacterium *Helicobacter pylori* raises the risk of stomach cancer; years of hepatitis B or C raise the risk of liver cancer; long-standing inflammatory bowel disease raises the risk of colon cancer. Constant damage, repair and cell division create more opportunities for the {{mutation|mutations}} that drive cancer (Chapter 6).

:::figure ch02-macrophage-spectrum
title: Fight mode, repair mode
goal: After using this, the reader understands that a macrophage's behavior is set by the signals around it along a continuum from "fight" to "repair", that "M1" and "M2" are textbook labels for the two ends of that continuum, and that tumors push macrophages toward the repair end, so a tumor can be inflamed in a way that feeds it and quiets T cells.
kind: explorer
stage: dark
spec: |
  LAYOUT (desktop, landscape viewBox about 1000x560).
  - Stage tag (top right, t-caps): "Illustrative".
  - Let s be the slider value, from 0 (fight end) to 1 (repair end); the default on load is s = 0.3.
  - Center: one large macrophage drawn with the art library's continuous `polarization` parameter set to s
    (0 = coral fight form, 1 = dusky-rose repair form). Fight end = more ruffled and spiky, with small
    vacuoles; repair end = smoother, slightly elongated, calmer. Shape and color interpolate smoothly; never
    snap between states.
  - Around it, six labeled "output" vignettes (1–4 words each), three per side, whose opacity follows the slider:
      FIGHT outputs (opacity = 1 − s), on the left:
        (a) "Kills microbes": two or three chartreuse bacteria near the cell; they shrink and fade.
        (b) "Calls reinforcements": solid coral dots streaming outward (inflammatory cytokines).
        (c) "Wakes T cells": a small killer T cell (art library, blue) at the lower edge brightens, with the
            green-cyan "+" signal icon.
      REPAIR outputs (opacity = s), on the right:
        (d) "Grows blood vessels": a thin blood-vessel sprout (art library vessel style) grows from the stage
            edge toward the macrophage.
        (e) "Rebuilds tissue": a spindle-shaped fibroblast (art library, gray-beige) lays down a few fine fibers.
        (f) "Calms T cells": the same T cell dims, with the crimson "−" bar signal icon.
    At mid-slider, both sets are partly visible: mixed states are real, so this is intended.
  - Slider (HTML, full width under the stage): "Signals in the neighborhood". Left end label: "Danger:
    microbes, IFN-γ". Right end label: "Calm-down and repair signals: IL-4, IL-10, TGF-β". Under the two
    ends, small gray labels in quotes: "'M1'" and "'M2'", with a footnote line: "Textbook labels for the two
    ends of a spectrum."
  - One toggle, "Place it in a tumor": cancer cells (art library, violet-magenta, lumpy, 5–7 of them) fade in
    around the edges and emit small violet dots that drift toward the macrophage (legend: "tumor signals:
    CSF-1, IL-10, TGF-β, lactate, low oxygen"). A small arrow above the slider reads "tumor signals push this
    way →". When the toggle is switched ON, the slider thumb glides ONCE (over ~2 s) to s = 0.85; after that it
    stays fully under the reader's control (never auto-drifts again). The macrophage switches to the art
    library's tumor-associated variant at the same polarization and gets the label "tumor-associated
    macrophage" (never "M2"); the vessel sprout grows toward the cancer cells. Switching the toggle OFF removes
    the cancer cells and the label but leaves the slider where it is.
  CAPTION STATES (HTML caption under the stage; shown verbatim; pick by state):
    Toggle off, s < 0.33: "Fight mode. Surrounded by microbial signals and IFN-γ, the macrophage kills what it eats and calls for help."
    Toggle off, 0.33 ≤ s ≤ 0.66: "In between. Real macrophages often run parts of both programs at once; 'M1' and 'M2' are just labels for the two ends."
    Toggle off, s > 0.66: "Repair mode. After the danger has passed, the macrophage calms inflammation, grows blood vessels and rebuilds tissue."
    Toggle on (any s): "Inside a tumor, signals from cancer cells push the macrophage toward repair mode. The tumor is inflamed, but in the wrong way: it feeds the tumor's blood supply and quiets T cells, like a wound that never heals."

  SCIENCE: DO NOT CHANGE.
  - The same macrophage can move in either direction; the slider must be fully reversible (plasticity).
  - Repair mode is not "bad": it is essential for healing. Only its hijacking by tumors is harmful.
  - IFN-γ plus microbial products push toward fight; IL-4/IL-13, IL-10 and TGF-β push toward repair.
  - Do not label the tumor-associated macrophage "M2"; it sits toward, not at, the repair end.
  MOBILE: portrait viewBox (about 420x600) with the macrophage centered, fight vignettes above it and repair
  vignettes below; the slider and toggle stack full-width below the stage.
  REDUCED MOTION: no drifting particles; outputs change opacity instantly; the tumor toggle sets s = 0.85 instantly.
alt: A single macrophage changes color and shape as a slider moves from danger signals to anti-inflammatory and repair signals. At the fight end it kills bacteria, releases inflammatory cytokines and activates a T cell; at the repair end it grows blood vessels, helps rebuild tissue and quiets the T cell; in between, it does some of both. Placing it in a tumor pushes it toward the repair end: the tumor is inflamed, but in a way that helps it.
:::

## The bridge to adaptive immunity

The innate system has one more job, perhaps its most important: it decides whether the adaptive immune system responds at all.

Dendritic cells link the two systems. When their pattern-recognition receptors detect PAMPs or DAMPs, they carry samples of what they have collected through lymph vessels to the nearest {{lymph-node|lymph node}}, where T cells gather. Sensor activation also makes them display "confirmation" molecules that a T cell requires before it will respond for the first time, much as a login can require a code from your phone as well as a password. Chapter 4 explains this *two-factor authentication*.

This explains what Janeway called the immunologist's "dirty little secret".[^1] A purified protein injected on its own usually provokes little immune response; to make it work, researchers had to mix in something microbial, an {{adjuvant|adjuvant}}. The adaptive system, Janeway argued, waits for the innate system's permission. That is why many vaccines contain adjuvants.

The dendritic cell also carries information about the threat. Which of its sensors fired shapes the cytokines it releases in the lymph node, and those steer the response: toward killer T cells for a virus, for example, or, for parasitic worms, toward a program that causes allergies when it misfires.[^35] Gut dendritic cells even program the T cells they activate to return to the gut (Chapter 4).[^36] So the innate system signals not only *whether* to respond but *what* the threat is and *where*.

Many tumors are inflamed, but mostly in the wound-healing way that feeds them and calms T cells. What they tend to lack is the interferon-rich alarm that matures dendritic cells and permits an attack. Some of that alarm often gets through, for instance when tumor DNA triggers a dendritic cell's internal DNA sensor, and spontaneous T-cell responses against tumors are common.[^6] Chapter 7 follows what happens next.

:::key-idea
Without a danger signal, the adaptive system does not respond. But danger signals come in two kinds: the alarm that permits a T-cell attack, and the wound-healing inflammation that rebuilds tissue. Tumors usually have plenty of the second and little of the first.
:::

## The limits of innate immunity

**Innate immunity is generic.** A few dozen kinds of sensors can register "bacterium with LPS", but not "this strain of *Salmonella*", and they can't tell one flu virus from another.

**Microbes evolve ways around it**, such as polysaccharide capsules (sugar coats) that phagocytes struggle to bind and engulf, or proteins that block the interferon response.

**It has no lasting, specific memory.** If the same bacterium returns next year, the innate response unfolds much as before. Innate cells can be "trained" into a heightened state for a while (see the box below), but the boost is general, not tailored to one invader.

**It often responds poorly to cancer**, which carries no microbial patterns and mostly provokes the repair kind of inflammation.

:::deep-dive Trained immunity: a memory of sorts
For decades, textbooks said flatly that innate immunity has no memory. That is not quite right. After certain infections or vaccines, with the tuberculosis vaccine BCG as the best-studied example, monocytes and macrophages, and even their parent cells in the bone marrow, can be reprogrammed to respond more strongly to later challenges, including unrelated microbes.[^23] The reprogramming works through chemical marks on the cells' DNA packaging (epigenetic changes) and shifts in their metabolism, not through new receptors. Researchers call it {{trained-immunity|trained immunity}}.

It differs from adaptive memory in two ways. It is not specific to one invader, and it seems to last months, not decades. It may also have a downside: the same heightened state could contribute to some chronic inflammatory diseases.[^23] Whether trained immunity contributes to BCG's effect in bladder cancer (Chapter 11), and whether it can be harnessed more widely, are open questions.
:::

To recognize targets it cannot predict, such as a new virus or a cell that differs from its neighbors by a single mutation, the body needs a different system: receptors for things it has never encountered, a way to multiply the rare cells that carry the right one, and memory. That system evolved late. Insects and worms manage without it, and the gene-shuffling mechanism that generates an almost limitless variety of receptors arose in early jawed fish, about 500 million years ago.[^37] Chapter 3 describes how it works.

:::quiz
Q: A macrophage meets a bacterium it has never encountered before, and raises the alarm within minutes. What is it recognizing?
- [ ] Which species it is, using a dedicated receptor for each kind of bacterium — a body can't carry a receptor per species; innate sensors are few and recognize broad patterns.
- [x] Molecular signatures, such as LPS, shared by whole classes of microbes — a small set of pattern-recognition receptors can cover thousands of species this way, because our own cells lack these signatures.
- [ ] A receptor custom-built for that bacterium in the first minutes of the infection — building custom receptors is how adaptive immunity works, and it takes days.

Q: Why does the skin around an infected splinter swell?
- [ ] The bacteria multiply so fast that they take up space in the tissue — there are far too few of them to cause visible swelling.
- [x] Vessel walls loosen and fluid leaks from the blood into the tissue — and the leak delivers defensive proteins to the site.
- [ ] More warm blood flows in because the small vessels nearby widen — that is what makes the area red and warm; the swelling is fluid leaking out of the vessels.

Q: To hide from killer T cells, a tumor cell stops displaying MHC class I, emptying its "shop window". Which cell is now more likely to notice it?
- [ ] A neutrophil — neutrophils hunt microbes and don't check for MHC class I.
- [x] An NK cell — losing class I removes an inhibitory signal, especially if the cell also shows stress ligands (though NK cells often fail to reach solid tumors).
- [ ] A B cell — B cells recognize shapes with antibody-like receptors and don't check for MHC class I.

Q: Many tumors are full of inflammation. Why doesn't that reliably trigger a T-cell attack?
- [ ] Inflammation and T-cell attack are run by separate systems that never interact — they interact constantly: the innate alarm is exactly what permits T cells to respond.
- [x] It is mostly the wound-healing kind, not the alarm that permits an attack — wound-healing inflammation feeds the tumor and calms T cells, and the interferon-rich alarm is often faint; some still gets through, and spontaneous T-cell responses against tumors are common.
- [ ] Innate sensors work only in the bloodstream, not in solid tissues — they work in tissues too, where most tumors grow.
:::

:::takeaways
- Innate immunity acts within minutes, using inherited sensors that detect broad molecular signatures of microbes (PAMPs) and of damaged cells (DAMPs).
- Inflammation is a delivery system: wider, leakier blood vessels bring fluid, defensive proteins and neutrophils to the site, producing redness, heat, swelling and pain.
- Phagocytes engulf and digest microbes; complement opsonizes them, attracts neutrophils and forms pores in some. Type I interferons put neighboring cells on antiviral alert, while IFN-γ, from NK and T cells, activates macrophages and increases MHC display.
- NK cells kill stressed cells whose MHC class I "shop window" is missing. In principle this catches tumors that hide from T cells; in practice NK cells often fail to reach solid tumors.
- Macrophages slide along a spectrum from fighting to repairing. Tumors are often inflamed in the repair way, which feeds them, and chronic inflammation can help cancer start.
- The innate system decides whether the adaptive system responds, and steers what kind of response it mounts. Tumors usually provoke plenty of wound-healing inflammation but little of the alarm that permits a T-cell attack.
:::

## Glossary
- innate-immunity | Innate immunity | The defenses you are born with: barriers, sentinel cells, blood proteins and inherited receptors that respond within minutes to hours to broad signs of infection or damage. It doesn't adapt to a specific invader.
- adaptive-immunity | Adaptive immunity | The slower, learned arm of the immune system (T cells, B cells and antibodies). It builds receptors specific to one invader and remembers it for years.
- receptor | Receptor | A protein, usually on a cell's surface, whose shape lets it bind a particular molecule and pass a signal into the cell.
- antibody | Antibody | A Y-shaped protein made by B cells that binds one specific target shape, neutralizing it or marking it for destruction.
- t-cell | T cell | A lymphocyte of the adaptive immune system that recognizes protein fragments displayed by other cells. Killer T cells destroy infected or cancerous cells; helper T cells coordinate responses.
- microbe | Microbe | A microscopic agent of infection or a tiny organism, such as a bacterium, virus, fungus or single-celled parasite. Most are harmless; a few cause disease.
- macrophage | Macrophage | A large immune cell ("big eater") that lives in tissues, engulfs microbes and debris, releases cytokines that start inflammation, and later helps repair tissue.
- dendritic-cell | Dendritic cell | A star-shaped sentinel cell that samples tissues and, when it senses danger, carries what it found to a lymph node to activate T cells.
- mast-cell | Mast cell | A tissue-resident immune cell packed with granules of histamine and other chemicals that it releases within minutes of injury or infection.
- lps | LPS (lipopolysaccharide) | A molecule built from a lipid anchor and a chain of sugars that coats the outer wall of many bacteria, such as *E. coli*. Human cells never make it, so its conserved lipid anchor (lipid A) is a classic danger signature.
- pathogen | Pathogen | Any microbe (bacterium, virus, fungus or parasite) that can cause disease.
- pamp | PAMP (pathogen-associated molecular pattern) | A molecular feature shared by whole classes of microbes and absent from healthy human cells, such as LPS, flagellin or viral double-stranded RNA, that innate sensors recognize.
- damp | DAMP (damage-associated molecular pattern) | A molecule that normally stays inside cells, such as ATP, DNA or uric acid (which crystallizes once outside the cell), and signals danger when it spills out of damaged or dying cells.
- pattern-recognition-receptor | Pattern-recognition receptor | An inherited innate sensor that recognizes PAMPs or DAMPs and triggers an inflammatory or antiviral response. Toll-like receptors are the best-known family.
- toll-like-receptor | Toll-like receptor (TLR) | A family of ten pattern-recognition receptors in humans, located on the cell surface or inside endosomes. Each recognizes a different microbial signature, such as LPS (TLR4) or viral RNA (TLR7 and TLR8).
- cytokine | Cytokine | A small signaling protein that cells release to communicate with other cells. Inflammatory cytokines recruit immune cells; interferons are cytokines too.
- interferon | Interferon | A family of cytokines named for their ability to interfere with viruses. Type I interferons, released by infected cells (and some sentinel cells), put neighboring cells on antiviral alert. Interferon-gamma (IFN-γ) is a different member, made by T cells and NK cells.
- ifn-gamma | Interferon-gamma (IFN-γ) | A cytokine made by activated T cells and natural killer cells that strengthens immune attack rather than warning of a virus. It makes nearby cells display more MHC, drives macrophages into fight mode, slows some tumor cells and induces PD-L1, which engages the PD-1 brake on T cells.
- inflammation | Inflammation | The body's coordinated emergency response to infection or injury: blood vessels widen and leak and white blood cells arrive, producing redness, heat, swelling and pain.
- chemokine | Chemokine | A type of cytokine that attracts cells, forming a concentration gradient that immune cells follow toward its source.
- histamine | Histamine | A small molecule released by mast cells that widens blood vessels and makes them leaky within minutes.
- endothelium | Endothelium | The single layer of cells lining the inside of every blood vessel.
- prostaglandin | Prostaglandin | A fat-derived signaling molecule that contributes to pain, fever and vessel widening; drugs such as aspirin and ibuprofen block its production.
- neutrophil | Neutrophil | The most abundant white blood cell: short-lived, fast-moving and the first to rush from the blood into infected tissue, where it engulfs bacteria.
- extravasation | Extravasation | The process by which a white blood cell leaves the bloodstream: it rolls along the vessel wall on selectins, sticks when its integrins bind, and squeezes out between the lining cells.
- adhesion-molecule | Adhesion molecule | A surface protein that binds a partner molecule on another cell or on surrounding tissue, holding cells together or in place. Selectins and integrins are the adhesion molecules that let white blood cells leave the blood.
- selectin | Selectin | An adhesion molecule that binds sugar structures on other cells, with bonds that form and break quickly. Selectins on inflamed vessel walls catch passing white blood cells and make them roll along the wall; L-selectin, on white blood cells themselves, does the same on lymph-node vessels (Chapter 4).
- integrin | Integrin | An adhesion molecule on white blood cells (and many other cells) that can be shifted into a high-affinity state. Activated by chemokines, integrins bind the vessel wall firmly and stop a rolling white blood cell; they also hold T cells against the cells they inspect.
- sepsis | Sepsis | A life-threatening condition in which the body's response to an infection runs out of control and damages its own organs, causing widespread vessel leakage and low blood pressure. The infection itself need not be in the blood.
- crs | Cytokine release syndrome (CRS) | A body-wide surge of inflammatory cytokines, causing fever and sometimes dangerous drops in blood pressure, that can follow therapies which strongly activate immune cells.
- phagocytosis | Phagocytosis | "Cell eating": a cell engulfs a microbe or other large particle, enclosing it in a compartment of its own membrane (a phagosome), which then fuses with lysosomes that digest the contents.
- phagosome | Phagosome | The membrane-enclosed compartment that forms around a microbe or particle when a cell engulfs it. It fuses with lysosomes, whose acid and enzymes degrade its contents.
- lysosome | Lysosome | A membrane-enclosed compartment inside a cell, filled with acid and digestive enzymes, where engulfed or internalized material is degraded.
- opsonization | Opsonization | Coating a microbe with proteins such as antibodies or complement fragments, which phagocytes' receptors bind, so that phagocytes engulf it more readily.
- complement | Complement | A set of dozens of blood proteins that, once triggered on a microbe's surface, set off a chain reaction that opsonizes the microbe, attracts immune cells and can form pores in its membrane.
- mhc-class-i | MHC class I | Molecules on nearly every cell with a nucleus that display fragments of the proteins the cell is making, including any viral or mutated ones: the cell's shop window. Explained fully in Chapter 4.
- nk-cell | NK (natural killer) cell | An innate lymphocyte that kills stressed cells, especially those missing MHC class I, without prior exposure to the target.
- lymphocyte | Lymphocyte | The family of small, round immune cells that includes T cells, B cells and natural killer cells.
- perforin | Perforin | A protein released by NK cells and killer T cells that forms pores in the target cell's membrane.
- granzyme | Granzyme | An enzyme that enters a target cell through perforin pores and triggers apoptosis.
- apoptosis | Apoptosis | Programmed, orderly cell death: the cell shrinks and breaks into membrane-wrapped fragments, without spilling its contents, and phagocytes engulf them without triggering inflammation.
- missing-self | Missing self | The principle, proposed by Klas Kärre, that NK cells attack cells lacking normal levels of MHC class I.
- stress-ligand | Stress ligand | A molecule, such as MICA or MICB, that cells display when infected, damaged or turning cancerous, and that activates NK cells.
- tumor-associated-macrophage | Tumor-associated macrophage (TAM) | A macrophage inside a tumor, often pushed toward a repair-like state in which it helps the tumor grow blood vessels and suppresses T cells.
- mutation | Mutation | A change in the DNA sequence. Some mutations alter proteins, and an accumulation of certain mutations can turn a normal cell cancerous.
- lymph-node | Lymph node | A small, bean-shaped organ where immune cells gather, and where dendritic cells present what they have found to T cells.
- adjuvant | Adjuvant | An ingredient added to a vaccine that triggers innate danger sensors, giving the adaptive immune system "permission" to respond strongly.
- trained-immunity | Trained immunity | A temporary, non-specific heightened state of innate immune cells after certain infections or vaccines, produced by epigenetic and metabolic reprogramming.
- tnf | Tumor necrosis factor (TNF) | An inflammatory cytokine released by T cells and macrophages that activates blood vessels and immune cells and can kill some tumor cells.
- il-6 | IL-6 (interleukin-6) | An inflammatory cytokine, made largely by macrophages, that drives fever and other body-wide signs of inflammation. It is the central cytokine in cytokine release syndrome (Chapter 10).
- monocyte | Monocyte | A white blood cell that circulates in the blood and can leave it to become a macrophage or dendritic cell.
- priming | Priming | The first activation of a naive T cell, usually in a lymph node, when a dendritic cell presents the T cell's target together with the confirming signals. Primed T cells multiply and become effector cells.
- solid-tumor | Solid tumor | A cancer that grows as a mass in an organ or tissue, such as most cancers of the lung, breast, colon or skin; contrasted with blood cancers.

## Sources
1. Janeway CA Jr. Approaching the asymptote? Evolution and revolution in immunology. *Cold Spring Harb Symp Quant Biol* 1989;54 Pt 1:1-13. doi:10.1101/sqb.1989.054.01.003 (PMID 2700931)
2. Takeuchi O, Akira S. Pattern recognition receptors and inflammation. *Cell* 2010;140(6):805-820. doi:10.1016/j.cell.2010.01.022 (PMID 20303872)
3. Lemaitre B, Nicolas E, Michaut L, Reichhart JM, Hoffmann JA. The dorsoventral regulatory gene cassette spätzle/Toll/cactus controls the potent antifungal response in Drosophila adults. *Cell* 1996;86(6):973-983. doi:10.1016/S0092-8674(00)80172-5 (PMID 8808632)
4. Medzhitov R, Preston-Hurlburt P, Janeway CA Jr. A human homologue of the Drosophila Toll protein signals activation of adaptive immunity. *Nature* 1997;388(6640):394-397. doi:10.1038/41131 (PMID 9237759)
5. Poltorak A, He X, Smirnova I, et al. Defective LPS signaling in C3H/HeJ and C57BL/10ScCr mice: mutations in Tlr4 gene. *Science* 1998;282(5396):2085-2088. doi:10.1126/science.282.5396.2085 (PMID 9851930)
6. Woo SR, Fuertes MB, Corrales L, et al. STING-dependent cytosolic DNA sensing mediates innate immune recognition of immunogenic tumors. *Immunity* 2014;41(5):830-842. doi:10.1016/j.immuni.2014.10.017 (PMID 25517615)
7. Ishikawa H, Barber GN. STING is an endoplasmic reticulum adaptor that facilitates innate immune signalling. *Nature* 2008;455(7213):674-678. doi:10.1038/nature07317 (PMID 18724357)
8. Mariathasan S, Weiss DS, Newton K, et al. Cryopyrin activates the inflammasome in response to toxins and ATP. *Nature* 2006;440(7081):228-232. doi:10.1038/nature04515 (PMID 16407890)
9. Hornung V, Bauernfeind F, Halle A, et al. Silica crystals and aluminum salts activate the NALP3 inflammasome through phagosomal destabilization. *Nat Immunol* 2008;9(8):847-856. doi:10.1038/ni.1631 (PMID 18604214)
10. Medzhitov R. Inflammation 2010: new adventures of an old flame. *Cell* 2010;140(6):771-776. doi:10.1016/j.cell.2010.03.006 (PMID 20303867)
11. Summers C, Rankin SM, Condliffe AM, Singh N, Peters AM, Chilvers ER. Neutrophil kinetics in health and disease. *Trends Immunol* 2010;31(8):318-324. doi:10.1016/j.it.2010.05.006 (PMID 20620114)
12. Ley K, Laudanna C, Cybulsky MI, Nourshargh S. Getting to the site of inflammation: the leukocyte adhesion cascade updated. *Nat Rev Immunol* 2007;7(9):678-689. doi:10.1038/nri2156 (PMID 17717539)
13. Gordon S. Elie Metchnikoff: father of natural immunity. *Eur J Immunol* 2008;38(12):3257-3264. doi:10.1002/eji.200838855 (PMID 19039772)
14. Ricklin D, Hajishengallis G, Yang K, Lambris JD. Complement: a key system for immune surveillance and homeostasis. *Nat Immunol* 2010;11(9):785-797. doi:10.1038/ni.1923 (PMID 20720586)
15. Geisse J, Caro I, Lindholm J, Golitz L, Stampone P, Owens M. Imiquimod 5% cream for the treatment of superficial basal cell carcinoma: results from two phase III, randomized, vehicle-controlled studies. *J Am Acad Dermatol* 2004;50(5):722-733. doi:10.1016/j.jaad.2003.11.066 (PMID 15097956)
16. Kärre K, Ljunggren HG, Piontek G, Kiessling R. Selective rejection of H-2-deficient lymphoma variants suggests alternative immune defence strategy. *Nature* 1986;319(6055):675-678. doi:10.1038/319675a0 (PMID 3951539)
17. Garrido F, Aptsiauri N, Doorduijn EM, Garcia Lora AM, van Hall T. The urgent need to recover MHC class I in cancers for effective immunotherapy. *Curr Opin Immunol* 2016;39:44-51. doi:10.1016/j.coi.2015.12.007 (PMID 26796069)
18. Lanier LL. NK cell recognition. *Annu Rev Immunol* 2005;23:225-274. doi:10.1146/annurev.immunol.23.021704.115526 (PMID 15771571)
19. Imai K, Matsuyama S, Miyake S, Suga K, Nakachi K. Natural cytotoxic activity of peripheral-blood lymphocytes and cancer incidence: an 11-year follow-up study of a general population. *Lancet* 2000;356(9244):1795-1799. doi:10.1016/S0140-6736(00)03231-1 (PMID 11117911)
20. Murray PJ, Allen JE, Biswas SK, et al. Macrophage activation and polarization: nomenclature and experimental guidelines. *Immunity* 2014;41(1):14-20. doi:10.1016/j.immuni.2014.06.008 (PMID 25035950)
21. Dvorak HF. Tumors: wounds that do not heal. Similarities between tumor stroma generation and wound healing. *N Engl J Med* 1986;315(26):1650-1659. doi:10.1056/NEJM198612253152606 (PMID 3537791)
22. Coussens LM, Werb Z. Inflammation and cancer. *Nature* 2002;420(6917):860-867. doi:10.1038/nature01322 (PMID 12490959)
23. Netea MG, Domínguez-Andrés J, Barreiro LB, et al. Defining trained immunity and its role in health and disease. *Nat Rev Immunol* 2020;20(6):375-388. doi:10.1038/s41577-020-0285-6 (PMID 32132681)
24. Lahoz-Beneytez J, Elemans M, Zhang Y, et al. Human neutrophil kinetics: modeling of stable isotope labeling data supports short blood neutrophil half-lives. *Blood* 2016;127(26):3431-3438. doi:10.1182/blood-2016-03-700336 (PMID 27136946)
25. Uderhardt S, Martins AJ, Tsang JS, Lämmermann T, Germain RN. Resident macrophages cloak tissue microlesions to prevent neutrophil-driven inflammatory damage. *Cell* 2019;177(3):541-555.e17. doi:10.1016/j.cell.2019.02.028 (PMID 30955887)
26. Sender R, Milo R. The distribution of cellular turnover in the human body. *Nat Med* 2021;27(1):45-48. doi:10.1038/s41591-020-01182-9 (PMID 33432173)
27. Ravichandran KS. Find-me and eat-me signals in apoptotic cell clearance: progress and conundrums. *J Exp Med* 2010;207(9):1807-1817. doi:10.1084/jem.20101157 (PMID 20805564)
28. Griffith BP, Goerlich CE, Singh AK, et al. Genetically modified porcine-to-human cardiac xenotransplantation. *N Engl J Med* 2022;387(1):35-44. doi:10.1056/NEJMoa2201422 (PMID 35731912)
29. Siegal FP, Kadowaki N, Shodell M, et al. The nature of the principal type 1 interferon-producing cells in human blood. *Science* 1999;284(5421):1835-1837. doi:10.1126/science.284.5421.1835 (PMID 10364556)
30. Urosevic M, Dummer R, Conrad C, et al. Disease-independent skin recruitment and activation of plasmacytoid predendritic cells following imiquimod treatment. *J Natl Cancer Inst* 2005;97(15):1143-1153. doi:10.1093/jnci/dji207 (PMID 16077073)
31. Biron CA, Byron KS, Sullivan JL. Severe herpesvirus infections in an adolescent without natural killer cells. *N Engl J Med* 1989;320(26):1731-1735. doi:10.1056/NEJM198906293202605 (PMID 2543925)
32. Orange JS. Natural killer cell deficiency. *J Allergy Clin Immunol* 2013;132(3):515-525. doi:10.1016/j.jaci.2013.07.020 (PMID 23993353)
33. López-Soto A, Gonzalez S, Smyth MJ, Galluzzi L. Control of metastasis by NK cells. *Cancer Cell* 2017;32(2):135-154. doi:10.1016/j.ccell.2017.06.009 (PMID 28810142)
34. Correia AL, Guimaraes JC, Auf der Maur P, et al. Hepatic stellate cells suppress NK cell-sustained breast cancer dormancy. *Nature* 2021;594(7864):566-571. doi:10.1038/s41586-021-03614-z (PMID 34079127)
35. Iwasaki A, Medzhitov R. Control of adaptive immunity by the innate immune system. *Nat Immunol* 2015;16(4):343-353. doi:10.1038/ni.3123 (PMID 25789684)
36. Mora JR, Bono MR, Manjunath N, et al. Selective imprinting of gut-homing T cells by Peyer's patch dendritic cells. *Nature* 2003;424(6944):88-93. doi:10.1038/nature01726 (PMID 12840763)
37. Flajnik MF, Kasahara M. Origin and evolution of the adaptive immune system: genetic events and selective pressures. *Nat Rev Genet* 2010;11(1):47-59. doi:10.1038/nrg2703 (PMID 19997068)
