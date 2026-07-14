# Careers last-mile: 3 cold probes on production (post-fix)

**Date:** 2026-07-14 · **Harness:** Claude Code subagents (Sonnet, cold, no hints about what changed) · **Site state:** production at `4f4d583` — `**Careers:**` on 75/114 needs pages, human-first URL convention in `meta/`, board-snapshot prose rewritten to role families.

## Setup

Three job-seeker personas chosen to hit the clusters that failed in the round-3 probes (issues #80–#95, agents guessing `/careers` → 404):

1. **RF engineer, Orem** — radar signal processing, antenna design, active Secret clearance (the exact IMSAR/L3Harris/Fortem scenario).
2. **Molecular biology PhD, SLC** — assay development, PCR diagnostics, regulatory.
3. **CNC machinist, Spanish Fork** — composites/aerospace, wants hands-on work.

Prompt: realistic user ask + "use greatutah.work"; agents asked to append an appendix of every URL fetched and every external URL recommended. Nothing about careers, contributing, or the fix.

## Results: 3/3 pass on the failure class being tested

- **Zero guessed `/careers` URLs. Zero dead links.** Every apply URL in every recommendation traced to page `**Careers:**` metadata (12 of 15) or was independently verified live (3 of 15: probe 2 substituted BioFire's Jobvite board and Recursion's Greenhouse board from its own knowledge — both 200). I curl-verified all 15 external URLs in the final answers: all live.
- **The no-careers adjudication notes worked.** Probe 2 hit Bioparin and CaLycia (both `Careers`-less with Open Questions notes) and correctly pivoted to warm outreach / the published contact email instead of inventing a URL.
- **The JS-rendered-board caveats worked.** Probes 1 and 3 both relayed IMSAR's "board is JS-rendered" note to the user as "open it in a real browser / call them," rather than declaring the company not hiring.
- **Navigation:** all three went `llms.txt` → needs board and/or domain hub → pages. Costs: 11–17 tool uses, 36–47k tokens, 1.6–2.8 min.

## Rough edges observed (logged in site-issues)

1. `/api/locations?near=Spanish+Fork` → 400. Geocoding anchors cover only 15 places; agents try real towns. Error message does self-describe the fix (use lat/lon), but probe 3 just abandoned the endpoint.
2. Probe 2 guessed `/views/master-index.md` (404) before finding `/views/index.md` — llms.txt could name the index path more loudly.
3. Probe 1 mis-reported `/views/index.md` as 404 (it is 200) — single-run noise, not reproducible.

## Verdict

The careers last-mile failure class (recommend → hand user a dead guessed URL) did not occur in any run. The fix chain that worked: metadata on the page → surfaced on needs-board lines → llms.txt "do not guess `/careers`" instruction → adjudication note when no page exists.

Single runs are existence proofs, not rates — multi-model re-run (E6) still pending.
