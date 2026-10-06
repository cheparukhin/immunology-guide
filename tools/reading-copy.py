#!/usr/bin/env python3
"""Build a condensed 'reader's edition' of the whole book for aggregate reviews.
Keeps prose, callouts, quizzes, takeaways; reduces figures to title/goal/steps/alt; drops Glossary & Sources.
Usage: python3 tools/reading-copy.py [--with-figure-specs] > out.md"""
import re, sys, pathlib
ORDER = ["01-cells","02-innate","03-adaptive","04-presentation","05-t-cells","06-cancer","07-escape",
         "interlude-history","08-checkpoints","09-antibodies","10-cell-therapy","11-vaccines","12-frontier"]
root = pathlib.Path(__file__).resolve().parent.parent / "content" / "drafts"
full = "--with-figure-specs" in sys.argv
out = []
for slug in ORDER:
    p = root / f"{slug}.md"
    if not p.exists():
        out.append(f"\n\n# [MISSING {slug}]\n"); continue
    t = p.read_text()
    # drop Glossary and Sources sections (from heading to next H2 or EOF)
    t = re.sub(r"\n## (Glossary|Sources)\b.*?(?=\n## |\Z)", "\n", t, flags=re.S)
    if not full:
        def fig(m):
            body = m.group(2)
            keep = []
            title = re.search(r"^title:\s*(.*)$", body, re.M)
            goal = re.search(r"^goal:\s*(.*)$", body, re.M)
            alt = re.search(r"^alt:\s*(.*)$", body, re.M)
            steps = re.search(r"^steps:\s*\n((?:\s+\d+\..*\n?)+)", body, re.M)
            keep.append(f"[FIGURE {m.group(1)} — {title.group(1) if title else ''}]")
            if goal: keep.append(f"Goal: {goal.group(1)}")
            if steps: keep.append("Step captions:\n" + steps.group(1).rstrip())
            if alt: keep.append(f"Alt: {alt.group(1)}")
            return "\n".join(keep) + "\n"
        t = re.sub(r"^:::figure\s+(\S+)\s*\n(.*?)^:::\s*$", fig, t, flags=re.S | re.M)
    out.append(f"\n\n<!-- ===================== FILE: content/drafts/{slug}.md ===================== -->\n\n" + t.strip())
sys.stdout.write("\n".join(out) + "\n")
