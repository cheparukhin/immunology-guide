# Revision round 2 — whole-book fixes (supervisor brief)

Round 2 applies the **aggregate** reviews, which judged the book as a whole. Read the parts relevant to your chapter in all of these:

| Review | File | What it covers |
|---|---|---|
| Science verification (claim by claim) | `docs/aggregate/verify-NN.md` (your chapter) | errors, unsupported claims, citation problems |
| Whole-book science review | `docs/aggregate/SCIENCE-REVIEW.md` | cross-chapter coherence, currency (2025–26), gaps |
| Editor-in-chief | `docs/aggregate/EDITOR-REVIEW.md` — **"Global decisions" A–F are binding**; plus your chapter's section | style sheet, canonical numbers, story ownership, broken cross-references |
| Whole-book reader | `docs/aggregate/READER-REVIEW.md` (+ `reader-journal.md` for your chapter) | comprehension cliffs, repetition, misconceptions the book causes |
| Figure audit | `docs/aggregate/FIGURE-AUDIT.md` — §2 decisions, §4 rules, §7 red flags for your figures | figure ownership/merges, visual vocabulary, honesty tags |

**Audience (clarified by the site owner):** curious, science-interested lay adults (popular-science readers) — **not** primarily patients or caregivers. Favor mechanistic understanding. Patient-oriented material stays brief and proportionate.

## Priority when reviews conflict
1. Verified facts (verify-NN, SCIENCE-REVIEW) — accuracy wins.
2. Editor's binding Global decisions (terms, numbers, ownership).
3. Reader comprehension.
Note: the TCR repertoire is "at least ~10^8 (a sequencing-based statistical lower bound — **not** a direct count); one model suggests ~10^10".

## Cross-chapter assignments (supervisor decisions)
- **Cancer-immunity cycle & PD-1 blockade location** (SCIENCE #1): anti-PD-1/PD-L1 acts at the effector end (recognition/killing in the tumor) **and** refuels the response from a stem-like (TCF1+) reserve in lymph nodes and blood (priming/expansion), often recruiting new clones. Anti-CTLA-4 acts mainly at priming. Ch 7 text + `ch07-cycle` spec and Ch 12 must say this; Ch 8 owns the detail. (The shared `cycle-data.js` is being built with this mapping.)
- **"No danger signal, no response"** (SCIENCE #2): distinguish *immunostimulatory* inflammation (type I IFN, mature cDC1s, priming) from *tumor-promoting*, wound-healing inflammation (macrophage-rich, suppressive). Tumors are often inflamed in the wrong way, and spontaneous T-cell responses against tumors are common (Woo 2014). Fix in Ch 2 (owner), echo correctly in Ch 6 and Ch 11.
- **Signal 2 scope** (reader misconception 1): the two-factor check governs a **naive** T cell's first activation in the lymph node; armed killer T cells don't need CD28/B7 confirmation to kill. Ch 4 states this explicitly; Ch 6 fixes its sentence; Ch 9/10 can lean on it.
- **How T cells decide with weak, brief binding** (Ch 1's unpaid promise): Ch 4 adds a short paragraph or Go-deeper (many brief contacts, serial engagement, co-receptor help, kinetic proofreading — a T cell can respond to a handful of peptide–MHC complexes). Ch 1 keeps its forward reference pointing to Ch 4.
- **Avidity** (Ch 1's promise to Ch 3): Ch 3 mentions avidity where antibody arms are explained (two arms, IgM's ten) in 2–3 sentences; Ch 1's pointer stays.
- **Helper T cells** (reader misconception 2, CD8-centrism): Ch 5 strengthens "The conductors" with one concrete, mechanism-light example; Ch 11 reconciles its CD4-dominant vaccine responses with the main text in one or two sentences.
- **Interferons**: Ch 2 cleanly distinguishes type I interferons (antiviral alarm) from IFN-γ (the T/NK-cell alarm that raises MHC and PD-L1); later chapters use "IFN-γ" when they mean it.
- **TMB as predictor** (reader misconception 4): Ch 6 adds one caveat next to its "lottery tickets" image (more tickets ≠ guaranteed win; TMB predicts poorly in some cancer types — Ch 8 owns the detail).
- **NK cells** (reader misconception 6; SCIENCE gap): Ch 2 hedges NK surveillance of solid tumors; Ch 12 pays Ch 2's forward reference with NK-directed therapy status (e.g. monalizumab's phase 3 failure; NK engagers and CAR-NK as early-stage).
- **Surrogate endpoints** (SCIENCE gap): Ch 8 adds a short Go-deeper "Survival vs. surrogate endpoints" (overall survival vs progression-/recurrence-/event-free survival, pathologic response) — Ch 11 and Ch 12 refer back when citing RFS/EFS/pCR headlines.
- **Tumor-intrinsic resistance signaling** (SCIENCE gap): Ch 7 adds a brief Go-deeper mention (e.g. WNT/β-catenin-driven exclusion, PTEN loss, STK11 in lung cancer); Ch 12 gives one line in its resistance section.
- **Currency** (SCIENCE #4): Ch 8 — subcutaneous PD-1 blockers (approved Dec 2024 / Sept 2025), penpulimab (IgG1) and non-IgG/bispecific checkpoint drugs in China (fix absolute statements); Ch 9/10 — tarlatamab first-line DeLLphi-305 company topline (Sept 2026) if relevant; Ch 12 — ivonescimab US decision date (PDUFA Nov 14, 2026), monalizumab failure.
- **Repetition** (reader + editor): follow the editor's ownership table. The Interlude keeps the arc but drops Part III's anchor stories and numbers (Carter, Whitehead details, NADINA, vaccine trial numbers). Stem-like reserve: owned by Ch 5, one back-reference in Ch 8. Epacadostat: owned by Ch 8. Ch 12 recaps, never retells.
- **Ch 12** (weakest per editor): reduce patient-guide drift to a short, proportionate closing section; strengthen the science of the frontier.
- **Ch 4** vocabulary cliff: move CD80/CD86, IL-12, cDC1, TAP-level names into Go-deeper boxes or drop them; keep the main text to the story with ≤ ~6 new terms per section.
- **Ch 10**: delete the duplicated price paragraph.

## Figure specs
Update your figure specs to match FIGURE-AUDIT §2 decisions and §7 red flags for your figures (e.g. cut/merge controls, "Illustrative" tags, infoCard instead of bottom sheets, ✓ ≈ ✕ ~ badges). §4 visual rules bind the builders regardless; where your spec contradicts §4, update the spec to agree. Keep step captions polished — they're shown verbatim.

## Constraints
- Main narrative ≤ ~3,000 words (±5%). Sources: keep only what carries a claim.
- Quiz first, then takeaways (editor E).
- Verification: Amass via `tools/amass.sh <core> "<query>"` (key from ~/.env; never print it), PubMed, WebSearch. Label company-reported results as such.
- After editing: run `node tools/build-content.mjs --only NN` and make sure it builds without warnings for your chapter; re-run your two self-reviews.

## Report (under 150 words)
What changed (by source review), anything declined and why, and any cross-chapter request for another chapter.
