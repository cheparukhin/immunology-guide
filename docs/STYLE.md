# Language and voice (binding)

This guide supersedes the voice rules and the "Canonical metaphors" table in `docs/PLAN.md` §2, and the metaphor canon in `docs/aggregate/EDITOR-REVIEW.md` §B. Terminology (§A), canonical numbers (§C) and topic ownership (§D) in EDITOR-REVIEW still apply.

## The reader
An intelligent, curious adult with an engineer's mind: comfortable with systems, signals, thresholds, feedback, probabilities and numbers, but with little biology. They want to understand how the mechanism actually works. They are put off by condescension, cuteness, hype and padding. Write for them the way a first-rate science journalist writes for a technical magazine: plain, exact, economical and confident, with vividness that comes from **real facts, numbers, experiments and cases**, not from imagery.

## Principles
1. **Name things correctly, then explain them.** Use the real scientific term with a short plain explanation at its first appearance, then keep using the term. Clear is not the same as simplified: this reader wants the vocabulary used in papers and the news, explained well, not folk substitutes for it (see "Scientific terms" below).
2. **A metaphor must earn its place.** Keep one only if it carries mechanism that literal language would make harder for this reader, *and* it is used consistently. Never use a metaphor for color, and never stack them. If a sentence would lose nothing but decoration without the image, cut the image.
3. **Every sentence carries information.** Cut throat-clearing, signposting, staged reveals, recaps of what was just said, and sentences that only announce that something is interesting.
4. **Natural rhythm.** Mix sentence lengths the way careful human writing does. Avoid strings of short punchy sentences and dramatic fragments. Write paragraphs of 2–5 sentences that develop one point. Em dashes are fine.
5. **Calibrated, not hedged.** State the strength of evidence once, precisely ("in mice", "in one study of 52 patients", "not yet replicated"), then move on. Don't stack hedges, apologize for simplifying, or editorialize ("honest hope", "the truth is more interesting").
6. **Adult register.** No "Let's", "we'll see", "don't worry", "you'll meet". Avoid "Remember…?" and the tour-guide voice. Second person is fine for the reader's own body ("your T cells"). Don't use exclamation marks or the cute personification of cells. Conventional shorthand such as "the T cell recognizes" or "the tumor evades" is fine.

## Metaphor decisions (apply everywhere)
**Keep, using it plainly.** Introduce it once in the chapter that owns it, with its limit stated in one sentence, and don't decorate it:
- **Brakes** for inhibitory receptors (CTLA-4, PD-1) and checkpoint inhibitors "releasing the brakes". This is the field's own vocabulary.
- **Two-factor authentication** for signal 1 + signal 2.
- **Shop window** as an occasional nickname for the MHC class I display. The primary terms are "MHC class I", "class I" and "the class I display". Use the nickname where it truly shortens a sentence, not as a refrain (aim for a handful of uses per chapter at most). Figures keep their existing labels.
- **Typo** for a mutation that changes one letter of a gene, and the resulting neoantigen. DNA really is a text, so this is close to literal. Use it sparingly.
- **Living drug** for CAR-T and other cell therapies. It is the field's phrase; use it once or twice.
- **Lock and key / shape fit** for molecular recognition. Introduce it once in Ch 1 with "induced fit" as the refinement. Elsewhere, say "binds" or "fits".
- **Set point / threshold / thermostat** where it is a genuine control-system description, never introduced with "Picture…".
- **Immune surveillance** (the field's term) and an occasional "patrol" for circulating cells.

**Drop, replacing each with literal language:**
- the cell as a city, walls, kitchens, library, "master plans", workers;
- **recipe / recipe book** for genes: say gene, sequence, instructions;
- cytokines as "text messages": say signaling proteins;
- **evidence board** for class II: say "class II displays fragments of what the cell has taken up from outside";
- dendritic cells as **scouts and couriers**: say they sample tissue and carry what they collect to a lymph node;
- the lymph node as **briefing room or matchmaking hub**;
- the TCR as a **search query**: say "each T cell carries one receptor specificity";
- **photocopy**: say copies, clonal expansion;
- **army, soldiers, troops, recruits**: say population, clone, effector cells. Avoid war framing in general ("battle", "enemy", "foe"); "attack" and "kill" are literal and fine;
- helpers as **conductors**: say they coordinate or help;
- thymus **school, exam, graduate, class**: say positive selection and negative selection, or the thymus "tests" each cell;
- the tumor as a **fortified neighborhood with corrupt guards, poisoned air and walls**;
- **evolution under police pressure**: say selection under immune pressure;
- ADC as a **guided missile, warhead or fuse**: say antibody, linker and payload (payload and linker are the technical terms);
- bispecifics as a **matchmaker or handcuffs**: say the drug physically bridges a T cell to a cancer cell;
- **loading dock, dance, first responders as a running image, tour, journey, story** (as in "the story of…");
- any "Picture…", "Imagine…" or "Think of…" setup.

**Renamed escape routes (Ch 7 headings, figure data and every reference):**
| Old | New |
|---|---|
| Hide | **Hide** (unchanged) |
| Brake | **Brake** (unchanged) |
| Recruit corrupt guards | **Recruit suppressor cells** |
| Build walls | **Build barriers** |
| Poison the air | **Release suppressive molecules** |
| Go deaf | **Ignore interferon** |

## Scientific terms (binding)
Simplified language is not the same as clear language. The reader can handle real vocabulary. What they need is for each term to be explained when it first appears, and then used consistently. Childlike substitutes ("oily", "sticky", "chopped up", "the stem") talk down to the reader and leave them unable to read anything else on the subject.

- **First use:** give the correct term with a short plain gloss, for example "hydrophobic (water-repelling) amino acids" or "the Fc region, the constant stem of the Y". Mark it `{{id|term}}` if it has or deserves a glossary entry. After that, use the term, not the gloss. A gloss may come back later in a chapter if the term has not appeared for a long stretch.
- **Precise verbs:** binds, cleaves, degrades, secretes, expresses, presents, recognizes, primes, differentiates, phosphorylates, engulfs, internalizes.
- **Calibrate the jargon:** introduce a term when it names something the reader will meet again or that is the standard word in papers and the news. Otherwise a precise plain description is fine. Avoid piling several new terms into one sentence.
- **Keep everyday words that are accurate:** kill, copy, cut, signal, attack.

| Avoid as the main term | Use (with a gloss at first use) |
|---|---|
| oily, fatty (amino acids, protein surfaces) | hydrophobic; nonpolar |
| "a film of fatty molecules" (membrane) | lipid bilayer, made of phospholipids |
| grab, grip, latch onto, stick to (molecules) | bind; affinity, avidity, dissociation |
| sticky molecules (on vessels or white cells) | adhesion molecules (selectins, integrins and their ligands) |
| chopped up, cut into pieces, shredder | degraded, cleaved; the proteasome; proteases |
| cup, holder (MHC) | MHC molecule; peptide-binding groove |
| stem (antibody) | Fc region, or constant region |
| arms, tips (antibody) | Fab arms; variable regions; antigen-binding site |
| letters (DNA, RNA) | nucleotides or bases ("letters" is fine as the first-use gloss) |
| bubble, sac, pouch (inside cells) | vesicle, endosome, phagosome, lysosome |
| eat, swallow, gobble | engulf, phagocytose (phagocytosis); take up (endocytosis) |
| self-destruct, suicide program | apoptosis (programmed cell death) |
| punch holes | form pores |
| flag, tag, label (for destruction) | opsonize (opsonization), mark |
| go / stop signals | activating / inhibitory signals or receptors |
| switch on / off (genes, cells) | express, silence; activate, inhibit |
| machinery | name the actual components (proteasome, TAP, the signaling complex…) |
| messengers, alarm signals (generic) | cytokines, chemokines, interferons, or the specific molecule. "Alarm" may stay occasionally for danger sensing. |
| soak up, mop up | bind and neutralize, sequester |
| factory | name the cell or process (plasma cells secrete antibody) |
| poison (drugs, payloads) | cytotoxic drug, payload |

Examples:
- **Before:** "Its amino acids differ in character: some are oily and avoid water, some carry a positive or negative charge…"
  **After:** "Its amino acids differ in their chemistry: some are hydrophobic (they repel water and cluster together away from it), others are polar or carry a positive or negative charge…"
- **Before:** "That oily patch sits on the outside of the protein."
  **After:** "That hydrophobic patch sits on the protein's surface."
- **Before:** "…to swap the stem of its antibody, for example from IgM to IgG…"
  **After:** "…to swap the constant region that forms its antibody's Fc stem, for example from IgM to IgG…"

## Mannerisms to remove ("Claudisms")
| Pattern | Example | Fix |
|---|---|---|
| Staged reveal | "The answer: …", "Here's the twist", "The truth looks more interesting", "The point of the tour: …", "That is the point." | State the content directly. |
| Contrast framing for drama | "Not by sight, but by touch." "It's not X — it's Y." "Not just X but Y." | Use only when the contrast *is* the information. |
| Rhetorical question as a hook or transition | "How? …", "Why does this matter?", "So what changed?" | Use a declarative sentence. Keep at most the one central question in a chapter's opening. |
| Dramatic fragment | "Not always, though." "Mostly." "Until it doesn't." | Fold it into a full sentence. |
| Hype and empty adjectives | extraordinary, remarkable, striking, elegant, beautiful, astonishing, fascinating, crucial, powerful, profound | Delete, or replace with the fact that makes it notable. |
| Intensifiers and softeners | simply, quietly, actually, really, genuinely, truly, essentially, in a sense | Delete. |
| Signposting and recaps | "As we'll see", "As you'll see", "This chapter builds the toolkit…", "In short:" (on a short box), "To recap" | Delete, unless a single orienting sentence is truly needed. |
| Analogy-break boilerplate | "(It's an analogy, and it breaks in one important way.)" "Here is where the metaphor breaks." | If the metaphor is kept, state its limit in a plain sentence. Otherwise drop both. |
| Tour-guide voice | "Let's zoom in", "Meet the…", "Don't worry about memorizing…", "Keep one question in view" | Plain statements. |
| Personified cuteness | "the cell cooks up", "the virus hijacks… and throws a party" | Literal verbs. |
| Grand framing | "one of the great stories of modern medicine", "honest hope", "a reminder that…" | Delete or make specific. |
| Formulaic triplets and parallel stacks | "fast, generic, and forgetful"; three short parallel sentences in a row | Keep only when the three items are each needed; vary the structure. |
| Over-colon-ing | "The reason: …", "The result: …", "The catch: …" | Write a normal sentence. |

## Mechanics (what must not change)
- **Keep every fact, number, date, name and citation.** Keep every `[^n]` marker attached to the claim it supports, and every `{{id|text}}` glossary mark. You may change the display text; if you delete the sentence holding a term's first marked use, move the mark to the new first use. Keep `:::` directive syntax and the order of blocks.
- **Don't add new content.** Remove content only when it is pure decoration (an image, an aside or a repeated recap). If you think a fact is wrong, flag it; don't change it.
- **Headings.** Rewrite a heading only if it relies on a dropped metaphor or is opaque. Headings generate anchors, so grep for links to the old anchor (`#old-slug`) across `content/drafts`, `index.html`, `about.html` and `assets/js` and report any you can't update yourself.
- **Figure blocks:** edit only the reader-facing fields (`title`, the `steps` captions, `alt`). Leave `goal`, `spec` and `data` alone, except where a caption must match a renamed label.
- **Also edit:** quiz questions and explanations, takeaways, callouts (key idea / in the clinic / note), deep dives, the chapter's front-matter `subtitle`, and the chapter's `## Glossary` definitions.
- **Length:** about the same. Cut padding, but don't cut explanations; introducing a term with its gloss may add a few words.
- **US spelling.** Keep the terminology table in EDITOR-REVIEW §A.

## Calibration examples (from this site)
**Before:** "How? Not by sight, because cells are blind, but by touch. Every act of recognition in the immune system comes down to one molecule bumping into another and fitting, or not fitting, like a hand in a glove."
**After:** "Cells have no eyes; they recognize things by contact. Every act of recognition in the immune system comes down to one molecule meeting another and either fitting it or not."

**Before:** "Picture a cell as a tiny walled city. (It's an analogy, and it breaks in one important way.) The city wall is the cell membrane, a film of fatty molecules that keeps the inside in and the outside out. It is studded with gates, sensors and ID badges, most of them proteins. … Deep inside sits the nucleus, a library holding the master plans. Countless small kitchens called ribosomes cook up proteins. Proteins are the workers that do nearly every job…"
**After:** "A cell is enclosed by its cell membrane, a film of fatty molecules that separates inside from outside. Proteins embedded in the membrane serve as channels, sensors and identity markers, and this surface is where the immune system does its recognizing. The nucleus holds the cell's DNA, and ribosomes build proteins from copies of its genes. Proteins do nearly every job in the cell…"

**Before:** "The tips of an anti-PD-1 antibody fit snugly over the part of PD-1 that PD-L1 would otherwise grab. With the antibody in place, the handshake can't happen and the brake signal is never sent. Picture a car parked in the only bay of a loading dock: the dock is still there, but no truck can pull in."
**After:** "The tips of an anti-PD-1 antibody bind the same patch of PD-1 that PD-L1 would otherwise grab. While the antibody sits there, PD-L1 can't bind, and the brake signal is never sent."

**Before (figure caption):** "Your hand. Everything you can see here is built from units far too small to see. Let's zoom in, magnifying tenfold at each step."
**After:** "A hand. Each step magnifies ten times."

**Before:** "For years the favored picture was 'reinvigoration': PD-1 blockade would revive the exhausted T cells already in a tumor. The truth looks more interesting."
**After:** "For years the favored explanation was 'reinvigoration': PD-1 blockade revives exhausted T cells already in the tumor. Newer evidence suggests that much of the response comes from elsewhere."
