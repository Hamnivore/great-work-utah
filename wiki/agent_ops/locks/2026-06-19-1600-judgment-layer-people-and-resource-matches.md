# Work Claim: Judgment Layer — People Pages Launch + Venture↔Resource Matches

**Status:** done
**Agent:** Cursor boss agent (resumed 2026-06-19)
**Started:** 2026-06-19 16:00 MDT
**Updated:** 2026-06-19 17:15 MDT

## Goal

Launch the `wiki/people/` directory with 5 founder/operator bios for people already named in existing venture pages, and write 5 venture↔resource match pages connecting Utah deep-tech ventures to the most relevant Utah funding resources. Both domains are currently empty (0 people pages, 0 venture↔resource matches).

## Broad Edit Zone

- `wiki/people/` — 5 new pages: dave-bearss.md, florian-solzbacher.md, aaron-skonnard.md, chad-testa.md, ryan-smith-imsar.md
- `wiki/matches/` — 5 new match pages: halia-therapeutics-x-nucleus-fund.md, coreform-x-nucleus-fund.md, blackrock-neurotech-x-nucleus-fund.md, curza-x-utif.md, inherent-biosciences-x-biohive-utah.md
- `wiki/indexes/people.md` — populate with new entries
- `wiki/indexes/matches.md` — add new entries
- `wiki/log.md` — append operation entry
- this claim file

## Read-Only Context

- `wiki/agent_ops/schema.md` — page templates and allowed header fields
- `wiki/ventures/halia-therapeutics.md`, `blackrock-neurotech.md`, `coreform.md`, `curza.md`, `inherent-biosciences.md`, `pluralsight.md`
- `wiki/resources/nucleus-fund.md`, `utif.md`, `biohive-utah.md`
- `wiki/sources/nucleus-fund-website.md`, `nucleus-utif.md`

## Must Not Edit

- `wiki/agent_ops/locks/2026-06-19-1116-application-data-contract.md` (active Codex claim)
- `wiki/agent_ops/locks/2026-06-19-source-recovery-uncited.md` (active Codex claim)
- `wiki/agent_ops/locks/2026-06-19-1400-migration-factory-health-bio-batch1.md` (active Cursor claim)
- `wiki/agent_ops/locks/2026-06-19-migration-factory-biological-engineering.md` (active Cursor claim)
- `wiki/agent_ops/locks/2026-06-19-1600-migration-factory-health-gap-batch2.md` (active Cursor claim)

## Plan

1. Subagent A: write dave-bearss.md, aaron-skonnard.md, ryan-smith-imsar.md people pages
2. Subagent B: write florian-solzbacher.md, chad-testa.md people pages
3. Subagent C: write halia-therapeutics-x-nucleus-fund.md, coreform-x-nucleus-fund.md, blackrock-neurotech-x-nucleus-fund.md match pages
4. Boss: write curza-x-utif.md, inherent-biosciences-x-biohive-utah.md match pages
5. Boss integration: update indexes/people.md, indexes/matches.md, log.md; lint; build

## Progress

- Resumed stalled claim; relaunched three parallel subagents.
- Subagent A: dave-bearss, aaron-skonnard, ryan-smith-imsar people pages.
- Subagent B: florian-solzbacher, chad-testa people pages + partial index/log updates.
- Subagent C: three Nucleus Fund venture↔resource matches.
- Boss: curza-x-utif and inherent-biosciences-x-biohive-utah matches; index integration; venture→people See Also links on five venture pages.
- Checks: `npm run lint:wiki` 0 errors; `npm run build:wiki` 534 entries (people=5, matches=17).

## Files Changed

- `wiki/people/dave-bearss.md`
- `wiki/people/aaron-skonnard.md`
- `wiki/people/ryan-smith-imsar.md`
- `wiki/people/florian-solzbacher.md`
- `wiki/people/chad-testa.md`
- `wiki/matches/halia-therapeutics-x-nucleus-fund.md`
- `wiki/matches/coreform-x-nucleus-fund.md`
- `wiki/matches/blackrock-neurotech-x-nucleus-fund.md`
- `wiki/matches/curza-x-utif.md`
- `wiki/matches/inherent-biosciences-x-biohive-utah.md`
- `wiki/indexes/people.md`
- `wiki/indexes/matches.md`
- `wiki/index.md`
- `wiki/log.md`
- `wiki/ventures/halia-therapeutics.md`
- `wiki/ventures/curza.md`
- `wiki/ventures/blackrock-neurotech.md`
- `wiki/ventures/imsar.md`
- `wiki/ventures/pluralsight.md`
- `wiki/agent_ops/locks/2026-06-19-1600-judgment-layer-people-and-resource-matches.md`

## Handoff / Next Step

- Write person↔venture and person↔helper match pages now that people layer exists.
- Editorial refresh of `wiki/resources/biohive-utah.md` stub before treating Inherent↔BIOHive match as high confidence.
- Ingest primary sources naming Chad Testa (CEO) and Aaron Skonnard's current role post-Vista.
- IP routing guide (judgment layer) per prior matches handoff.
