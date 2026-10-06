# Copyedit log: final whole-book pass (after round 2)

Scope: I read the whole book in order (`book-reading-copy-r2.md`, regenerated after these edits), grepped across `content/drafts/*.md`, and made sentence-level fixes only. I did not touch any `:::figure` block. Working notes are in `copyedit-ledger.md`.

Verification after the edits:
- `node tools/build-content.mjs` builds every page with no warnings. The glossary has 303 terms, down from 304, because the duplicate `neoadjuvant` id was merged.
- `node tools/check.mjs --pending-ok` reports 21 pages, 0 errors and 13 warnings. Every warning is "figure module not built yet".

## Changes

| Chapter | Change | Reason |
|---|---|---|
| 01-cells | Deep dive "Self, non-self, or danger?": "often grows without sounding any alarm" → "often grows without sounding the kind of alarm that rallies an attack (Chapter 2)" | It contradicted Chapter 2's two-kinds-of-inflammation fix (ROUND2, "No danger signal"). |
| 02-innate | "tumors that go deaf to interferon" → "tumors that go deaf to IFN-γ" | Interferon assignment: Chapters 7 and 12 mean IFN-γ (JAK1/2 loss). |
| 04-presentation | Deep dive, immunoproteasome: "Interferon, the alarm signal from Chapter 2, makes…" → "Interferons, the alarm signals from Chapter 2 (above all IFN-γ), make…" | Chapter 2 now separates two interferons, so the singular was ambiguous. |
| 05-t-cells | "The kill": added "Unlike its first activation, a kill needs no confirmation signal from the target: recognition alone is enough." | Chapter 4's signal-2 sentence points to Chapter 5 for this ("the cell they kill needs no B7 (Chapter 5)"), and Chapter 5 never said it. |
| 06-cancer | "catalogued" → "cataloged" | US spelling (style sheet). |
| interlude-history | `{{neoadjuvant\|neoadjuvant}}` → `{{neoadjuvant-therapy\|neoadjuvant}}`; glossary line id renamed to match | It was a duplicate id with the same definition as the `neoadjuvant-therapy` id used by Chapters 8 and 12, so the glossary listed one term twice. |
| 08-checkpoints | Opener: dropped the inline definition of melanoma ("a cancer of the skin's pigment cells") | Style sheet A: melanoma is not re-defined inline after Chapter 7. The glossary link stays. |
| 08-checkpoints | China note: "two-in-one antibodies, such as ivonescimab, that block…" | The "see Chapter 12" pointer is kept only by ivonescimab, so naming it makes the cross-reference exact. |
| 08-checkpoints | Takeaway: anti-PD-1/PD-L1 now act "mainly in the tumor, and also in the lymph nodes that resupply it" | PD-1 two-sites assignment: the takeaway still gave the tumor only, while the chapter's own text gives both sites. |
| 09-antibodies | `{{checkpoint\|checkpoint inhibitors}}` → `{{checkpoint-inhibitor\|…}}` | Wrong popover: it defined "immune checkpoint" for the drug (glossary harmonization, as in Chapter 11 edit #6). |
| 09-antibodies | "(Chapter 3's antibody figure shows each of them at work on a cancer cell.)" → "…at work." | ch03-antibody shows complement and macrophages acting on microbes, not on a cancer cell. |
| 10-cell-therapy | `{{bispecific-antibody\|T-cell engager}}` → `{{t-cell-engager\|T-cell engager}}` | Glossary id should match the term (style sheet: "T-cell engager"). |
| 10-cell-therapy | Emily Whitehead: "the first child in the world to receive these cells" → "the first child to receive the Penn team's CAR-T cells"; "Of the first two children ever treated" → "Of the first two children the Penn team treated" | Matches the scoping the Interlude verifier required (verify-interlude must-fix 8) and editor Chapter 10 #2. Earlier children had received other CAR-modified cells. |
| 10-cell-therapy | Heading "Three weeks, sometimes five" → "Three weeks at best" | The section's own data give vein-to-vein medians of 31, 36 and 48 days. No links point to the old anchor. |
| 11-vaccines | "(see the [interlude]…)" → "(see the [Interlude]…)", twice | Consistent proper-noun capitalization, as in Chapters 9 and 12. |
| 12-frontier | "([the history interlude](…))" → "(see the [Interlude](…))" | Same convention. |

Total: 16 edits. Ch 1: 1 · Ch 2: 1 · Ch 4: 1 · Ch 5: 1 · Ch 6: 1 · Interlude: 1 (two lines) · Ch 8: 3 · Ch 9: 2 · Ch 10: 3 (four lines) · Ch 11: 1 (two places) · Ch 12: 1. Chapters 3 and 7: no prose changes.

## Checked and found coherent (no change)

- **PD-1 blockade's two sites:** Chapter 7's text and its deep dive, Chapter 8 ("Two brakes, two places" and its deep dive), Chapter 12's recap, key idea and takeaway, and `cycle-data.js` (`acts: [6, 7], also: [3]`).
- **Two kinds of inflammation:** Chapter 2 (owner), echoed in Chapter 4 (signal 2), Chapter 6 ("Altered self"), Chapter 7 (cycle) and Chapter 11 (weak link 2).
- **Signal-2 scope:** stated in Chapter 4; Chapter 6 now says "naive"; Chapters 9 and 10 lean on it.
- **Weak-grip deep dive:** Chapter 4 delivers both promises from Chapter 1 (the puzzle and the off-rate distinction), and Chapter 10 pays its pointer (the time filter).
- **Avidity:** Chapter 3, with IgM's ten tips.
- **TMB caveat:** Chapter 6, with Chapter 8's detail (breast, prostate, glioma).
- **NK cells:** Chapter 2's hedges are paid off in Chapter 12's main text and scoreboard (monalizumab/INTERLINK-1; NK engagers and CAR-NK early).
- **Surrogate endpoints:** Chapter 8's box, pointed to by Chapter 11 (twice) and Chapter 12 (twice).
- **Tumor-intrinsic resistance:** Chapter 7's driver-gene deep dive and Chapter 12's single line.
- **satri-cel:** "approved", June 2026, in Chapter 10's text, table, takeaway and source [^35], and in `cycle-data.js`.
- **ivonescimab:** first Chinese approval May 2024, Chinese approval for the HARMONi-2 population in April 2025, US PDUFA date 14 November 2026. Main text and deep dive agree, and so do sources 37, 39 and 40.
- **Emily Whitehead:** told once in Chapter 10. The Interlude has one clause; its timeline entry is consistent.
- **CTLA-4 toxicity:** Chapter 5's forward sentence now matches Chapter 8 ("most can be calmed" and "far milder than Chapter 5's CTLA-4-less mice").
- **Canonical numbers (table C):** all match, including 1 in 8 / 2018 in Chapters 6 and 11, 8–10 aa, at least 10⁸ / ~10¹⁰, 1 in 10,000 to 1 in a million in Chapter 9, 57/20, CheckMate 067, NADINA, KEYNOTE-942, INTerpath-001 and the four relapsed melanomas.
- **Style sheet A:** no CTL, MHC-I, MSI-H, dMMR, β2m, BiTE, "walled off" or "tumour" in prose. Remaining hits are in sources, glossary aliases or figure code names.
- **Mismatch-repair wording:** the first use in each chapter is "mismatch-repair deficient (MSI-high)".
- **Structure:** the quiz comes before the takeaways in all 13 chapters. No duplicated sentences or 12-word passages within or across chapters.
- **Citations:** no [^n] lacks a source. Chapter 8's sources 19, 36 and 37 have no [^n] in the prose, but the figure specs cite them as [19], [36] and [37], so they are not orphans. Do not delete them.
- **Glossary:** every `{{id|…}}` is defined, and no defined id is unused.

## Figure-spec changes needed (not edited; builders own these blocks)

1. **ch07-cycle, `spec` revision note (f).** It still carries the writer's flag ("…Chapter 10's verification says conditional. Whichever wording the supervisor confirms…"). The question is settled: regular approval in June 2026, already in `cycle-data.js`. Replace it with: *"CAR-T status text: use cycle-data STATUS['car-t'] verbatim (satri-cel approved in China, June 2026)."*
2. **ch07-cycle `goal` and `alt` (optional).** Both say engineered killers "skip the first three steps" but not that they also replace step 6. The main text and `cycle-data` (`replaces: [6]`) say they do. Append to the alt: *"CAR-T cells and most engagers also stand in for step 6, recognizing a surface protein without the shop window."*
3. **ch10-journey `goal` and `alt`.** "About three weeks from blood draw to infusion" / "the blood draw about three weeks before treatment" understates the measured vein-to-vein medians (31, 36 and 48 days). The spec body's standing caption already says "This example is a fast one". Make the goal read *"…as little as three weeks from blood draw to infusion, often four to seven…"*. Make the alt read *"…running from the blood draw three weeks before treatment (a fast example; typical medians are about a month to seven weeks)…"*.

## Larger issues (recommendations only)

- None blocking. One low-priority item: Chapter 8 names only ivonescimab, while its note speaks of two-in-one antibodies in the plural. Cadonilimab (PD-1 × CTLA-4, China 2022) appears nowhere in the book. If the science lead wants the plural fully paid off, add one clause to Chapter 12's PD-1 × VEGF scoreboard entry. Otherwise the current wording is accurate.

---

# Polish round (POLISH.md, Content items C1–C4)

These items come from VISITOR-REVIEW-A #9 and VISITOR-REVIEW-B #1, #2 and #14. I edited the drafts only. Whole `:::figure` blocks were moved but not changed. After the edits, `node tools/build-content.mjs` builds with no warnings, and `node tools/check.mjs --pending-ok` reports 21 pages, 0 errors and 0 warnings.

## C1: Quiz distractors, all 13 chapters (51 questions)

Before, the key was the longest option in 43 of 51 questions. Now it is the longest in 10 of 51, at most once per chapter:

| Chapter | 1 | 2 | 3 | 4 | 5 | 6 | 7 | Int | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Key longest | 1/4 | 0/4 | 1/4 | 1/4 | 1/4 | 0/4 | 1/4 | 0/3 | 1/4 | 1/4 | 1/4 | 1/4 | 1/4 |

Method:
- **Distractors:** made as long and as specific as the key, each a plausible misconception taken from the chapter (for example, "Perforin pores make the target burst open", "Tebentafusp, the TCR-based engager approved for uveal melanoma", "The dose: one group got larger, more frequent doses").
- **Keys:** where a key carried its reasoning in the visible text, I shortened it and moved the reasoning into the explanation after " — ". This affected Ch 2 Q4, Ch 8 Q2–Q4, Ch 10 Q1/Q3/Q4, Ch 11 Q2–Q4 and Interlude Q1–Q3.
- **Ch 7 Q4:** the visible options were bare step names that did not answer the second half of the question ("who might still catch the tumor?"). Each option now gives a step plus a claim.
- **Kept fixed:** the same questions, the same number of options and the same key positions (the build shuffles order). Explanations were updated where a distractor's wording changed, and every one was checked against its chapter. The chapter's separator style (" — ", ". — ", right/wrong/No prefixes) is unchanged.

## C2: Chapter 12 ending

- The clinic box "A note for readers facing treatment" moved from between "What nobody knows yet" and "Honest hope" to just before "What nobody knows yet", at the end of "Who gets these medicines". "Honest hope" now follows the open questions directly.
- A frontmatter `coda:` was added for the end-of-book panel (S3), three sentences on one line: *"You began with molecules that recognize each other by touch and ended with medicines that release the immune system's brakes, give it new aim, rebuild its cells and teach it new targets. Every one of them works through that same act of recognition, and each falls short where a cancer looks too much like self. Today only about one in five people with advanced cancer responds to checkpoint drugs; the rest of the story is being written in trials that are running now."* The "one in five" figure is the canonical 57/20 number. Until the foundation implements S3, the build ignores the key.

## C3: Pacing

**Ch 1, "Seven powers of ten":**
- `ch01-scale` (Fig 1.1) moved, whole and unchanged, to right after the section's first paragraph.
- The size-narrating prose after it went from five paragraphs to three, about 289 → 253 words. "Zoom in again… / Keep going…" and the "fifty to a hundred per millimeter" and "seventy across a lymphocyte" asides were cut. What the figure cannot carry was kept: definitions, glossary first uses, 30 trillion cells, virus ≠ cell, and sources [^2]–[^6].
- New lead-in: "Some landmarks from that tour."

**Back-to-back Go-deeper boxes:**
- **Ch 4:** "Inside the loading dock" moved up into the shop-window text, after the "Each loaded molecule…" paragraph. "How class II is loaded" moved before the class I/II table. Each box now sits between paragraphs.
- **Ch 8:** "Where do the responding T cells come from?" moved into "Two brakes, two places", after the lymph-node reserve paragraph. "Survival versus surrogate endpoints" moved to follow the relatlimab paragraph in "More brakes…", the trial it uses as its example. Its sentence "This chapter has its own example" became "The relatlimab trial above is one example: …". Ch 11 and Ch 12 refer to it by name ("Chapter 8's box on surrogate endpoints"), so they still resolve.
- **Not changed (outside the brief):** the end-of-chapter Go-deeper run in Ch 3 (four boxes before the quiz) and the pair in Ch 9 ("Why blinatumomab needs a pump" → "Field guide").

**Bold one-line summaries:** an "**In short:** …" line now opens the ten longest boxes:
- Ch 1 "Affinity by the numbers"
- Ch 2 "A fly, a mouse and a prediction" and "The molecules of missing self"
- Ch 3 "Counting the library"
- Ch 4 "Inside the loading dock"
- Ch 6 "Why most typos stay invisible"
- Ch 8 "How to read a survival curve"
- Ch 10 "The generations…"
- Ch 11 "Inside the prediction machine"
- Ch 12 "The next-generation scoreboard"

Each line summarizes only what its box says.

## C4: Interlude pull-quotes

Two pull-quotes were added in the long text-only stretch, written as raw `<blockquote class="pullquote" aria-hidden="true">`. Each echoes a sentence a few paragraphs away:
- "Hope often ran ahead of the evidence." sits before the 1980s cytokine paragraph in "Pressing the accelerator".
- "What if the immune system was already braking?" sits after the Medarex paragraph in "The brakes nobody was looking for".

I used the template's existing `.prose .pullquote` style instead of a plain markdown `>`, because the plain style is italic and reads as an attributed quotation. `aria-hidden` stops screen readers from reading the sentence twice. Curly quotes keep it from reading as a subheading.

Note for the foundation: `.pullquote` has no rule or accent and leaves a large gap below it. A hairline or accent would separate it more clearly from h3 headings.

## C3 follow-up: Chapter 3 and Chapter 9 (coordinator request)

I moved each box into the section it deepens. Nothing was merged, and every box now sits between paragraphs.

**Chapter 3:** the four boxes stacked before the quiz now sit as follows.

| Box | New position |
|---|---|
| "Inside the cut" | "Shuffling the deck", after the junctional-diversity paragraph |
| "Counting the library" | "A library with gaps", after the random-sample paragraph |
| "How long does memory last…" | End of "Memory: why the second time is different", after the "(see Go deeper)" paragraph |
| "Getting better with practice…" | "Antibodies: one molecule, four jobs", after the five-classes paragraph, so IgM and IgG are defined before it |

**Chapter 9:** "Why blinatumomab needs a pump" moved into "Two-handed antibodies", after the solid-tumor paragraph. Teclistamab and tarlatamab, which the box mentions, are both introduced above it there. The trastuzumab box's pointer to it ("below") still holds.

**Checks:** the build has no warnings, and `check.mjs` reports 0 errors and 0 warnings for both pages.
