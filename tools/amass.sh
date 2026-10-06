#!/usr/bin/env bash
# Amass REST API helper (dev-only). Reads AMASS_API_KEY from ~/.env; never prints it.
# Usage: tools/amass.sh <core> "<query>" [extra query params...]
#   core: biomedcore | trialcore | regulatorycore | drugcore | genecore
#   e.g.  tools/amass.sh regulatorycore "lifileucel" "agency=FDA" "limit=5"
#         tools/amass.sh trialcore "INTerpath-001" "limit=3"
#         tools/amass.sh biomedcore "CheckMate 067 10-year" "minPublicationDate=2024-01-01" "limit=5"
# Raw path mode: tools/amass.sh raw "/v1/cores/biomedcore/records/AMBC_xxx?include=references"
# Docs: https://platform.amass.tech/documentation/for-ai-agents/llm-quick-reference  (rate limit 60 req/min)
set -euo pipefail
KEY=$(grep '^AMASS_API_KEY=' "$HOME/.env" | head -1 | cut -d= -f2- | tr -d '"'"'"'')
BASE="https://api.amass.tech/api"
if [ "${1:-}" = "raw" ]; then
  curl -s -m 60 "$BASE$2" -H "Authorization: Bearer $KEY"; echo; exit 0
fi
CORE="$1"; Q="$2"; shift 2
URL="$BASE/v1/cores/$CORE/records?query=$(python3 -c 'import sys,urllib.parse;print(urllib.parse.quote(sys.argv[1]))' "$Q")"
for p in "$@"; do URL="$URL&$p"; done
case "$URL" in *limit=*) ;; *) URL="$URL&limit=5";; esac
curl -s -m 60 "$URL" -H "Authorization: Bearer $KEY" | python3 -c '
import sys,json
d=json.load(sys.stdin)
if "error" in d: print(json.dumps(d,indent=1)); sys.exit(1)
recs=d.get("data",[])
def trim(v):
    if isinstance(v,str) and len(v)>500: return v[:500]+"…"
    if isinstance(v,dict): return {k:trim(x) for k,x in v.items()}
    if isinstance(v,list): return [trim(x) for x in v[:15]]
    return v
print(json.dumps([trim(r) for r in recs],indent=1,ensure_ascii=False))'
