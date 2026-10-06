#!/bin/bash
# Stage the public site for publishing as a Claude Artifact.
# Usage: tools/stage-artifact.sh <out-dir>
#   <out-dir>/site/   all public files (pages + assets; dev pages and tooling excluded)
#   <out-dir>/entry.html  the home page without doctype/html/head/body (the Artifact wraps its entry page)
# Publish entry.html as the page and every file under site/ (except index.html) as `files` with root=site/.
set -euo pipefail
SRC="$(cd "$(dirname "$0")/.." && pwd)"; OUT="${1:?usage: tools/stage-artifact.sh <out-dir>}"
rm -rf "$OUT/site"; mkdir -p "$OUT/site"; cd "$SRC"
cp index.html about.html glossary.html sources.html interlude-history.html [0-9][0-9]-*.html "$OUT/site/"
rsync -a --exclude 'figures/demo-*.js' --exclude 'figures/shared/_kit-demo.js' --exclude '.DS_Store' assets "$OUT/site/"
python3 - "$OUT" <<'PY'
import re, sys, pathlib
out = pathlib.Path(sys.argv[1]); src = (out/'site'/'index.html').read_text()
head = re.search(r'<head>(.*?)</head>', src, re.S).group(1)
m = re.search(r'<body([^>]*)>(.*?)</body>', src, re.S); attrs, body = m.group(1), m.group(2)
cls = re.search(r'class="([^"]*)"', attrs); page = re.search(r'data-page="([^"]*)"', attrs)
for pat in (r'<meta charset[^>]*>\s*', r'<meta name="viewport"[^>]*>\s*', r'<title>.*?</title>'):
    head = re.sub(pat, '', head, flags=re.S)
boot = '<script>document.documentElement.lang="en";' + (f'document.body.className={cls.group(1)!r};' if cls else '') \
     + (f'document.body.dataset.page={page.group(1)!r};' if page else '') + '</script>'
(out/'entry.html').write_text('<title>Self &amp; Other</title>\n' + boot + '\n' + head.strip() + '\n' + body.strip() + '\n')
PY
(cd "$OUT/site" && find . -type f ! -name index.html | sed 's#^\./##' | sort > ../files.txt)
echo "staged $(wc -l < "$OUT/files.txt") files + entry.html in $OUT"
