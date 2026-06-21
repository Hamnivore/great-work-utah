# Work Claim: People Pages — First Wave

**Status:** done
**Agent:** Claude Sonnet 4.6 boss
**Started:** 2026-06-19 MDT
**Updated:** 2026-06-19 MDT

## Goal

Create `wiki/people/` pages for 8 notable Utah founders, researchers, and operators. The people index is currently empty (0 pages) and five venture pages already have live broken links to people/ targets. This slice fixes those broken links and builds the foundation the Judgment Layer needs for people↔venture and people↔helper match pages.

## Targets

Live broken links (must fix):
- `people/dave-bearss.md` — founder of Halia Therapeutics; linked from halia-therapeutics.md
- `people/ryan-smith-imsar.md` — founder/CEO of IMSAR; linked from imsar.md
- `people/chad-testa.md` — CEO of Curza; linked from curza.md
- `people/aaron-skonnard.md` — co-founder of Pluralsight; linked from pluralsight.md
- `people/florian-solzbacher.md` — co-founder of Blackrock Neurotech; linked from blackrock-neurotech.md

Additional high-value pages:
- `people/jared-rutter.md` — U of U Biochemistry professor, co-founder of Atavistik Bio
- `people/davis-smith.md` — founder of Cotopaxi
- `people/fred-lampropoulos.md` — founder of Merit Medical Systems (1987), handed CEO 2025

## Broad Edit Zone

- `wiki/people/*.md` (all new files)
- `wiki/indexes/people.md` (update with all new entries)
- `wiki/log.md` (append operation)
- this claim file

## Read-Only Context

- `wiki/agent_ops/schema.md` (person page template)
- `wiki/ventures/halia-therapeutics.md`, `imsar.md`, `curza.md`, `pluralsight.md`, `blackrock-neurotech.md`, `atavistik-bio.md`, `cotopaxi.md`, `merit-medical.md`

## Must Not Edit

- `scripts/build-wiki-index.ts` or `src/lib/` (Application Data Contract zone)
- `wiki/sources/` uncited-pages zone (separate claim)
- Any file not in the edit zone above

## Subagents

- **A**: dave-bearss + fred-lampropoulos (life-sciences founders)
- **B**: florian-solzbacher + ryan-smith-imsar (hardware/defense founders)
- **C**: aaron-skonnard + chad-testa (software/antibiotic CEO)
- **Boss**: jared-rutter + davis-smith (working in parallel)

## Progress

- Claimed slice; launched 3 parallel subagents; discovered 10 people pages already existed from prior runs; boss wrote jared-rutter and davis-smith; cleared all 39 lint errors (source stubs + legacy-provenance fix) that appeared when prior-wave venture pages were added without their sources.

## Files Changed

- `wiki/people/`: jared-rutter.md, davis-smith.md (new); dave-bearss, fred-lampropoulos, florian-solzbacher, ryan-smith-imsar, aaron-skonnard, chad-testa, josh-james, karl-sun, ryan-smith-qualtrics, tim-latimer (confirmed existing) — 12 total
- `wiki/indexes/people.md`: all 12 entries present
- `wiki/indexes/sources.md`: added 2 missing rows (tellus-networked-sensor-solutions, wave-wireless-vehicle-electrification)
- `wiki/sources/`: iris-biomedical-official-website.md, nielson-scientific-doe-sbir.md, tellus-networked-sensor-solutions-official-website.md, wave-wireless-vehicle-electrification-official-website.md (new); jump-aero-official-website.md (legacy-provenance fix)
- `wiki/log.md`: operation appended

## Handoff / Next Step

- People↔helper match pages: dave-bearss↔huntsman-cancer-institute, florian-solzbacher↔maschoff-brennan, ryan-smith-qualtrics↔wilson-sonsini
- Venture↔resource matches for SBIR-eligible ventures using person pages as evidence nodes
- Checks: lint 0 errors 0 warnings, build 604 entries, people=12, ventures=108
