# Work Claim: People Pages — First Wave

**Status:** active
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

- Claimed slice; launched 3 parallel subagents; boss writing jared-rutter and davis-smith directly.

## Files Changed

- Pending.

## Handoff / Next Step

- After completion: people↔helper match pages (e.g. dave-bearss↔huntsman-cancer-institute, florian-solzbacher↔maschoff-brennan)
