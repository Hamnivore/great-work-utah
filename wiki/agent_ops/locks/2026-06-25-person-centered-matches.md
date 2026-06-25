# Work Claim: Person-Centered Matches

**Status:** done
**Agent:** GPT-5.5 boss agent
**Started:** 2026-06-25 10:51 MDT
**Updated:** 2026-06-25 11:15 MDT

## Goal

Create a focused first batch of judgment-layer match pages that connect existing people pages to relevant ventures, helpers, or resources, with cited rationale and clear caveats.

## Broad Edit Zone

- `wiki/matches/`
- `wiki/indexes/matches.md`
- `wiki/people/`
- `wiki/helpers/`
- `wiki/resources/`
- `wiki/ventures/`
- `wiki/agent_ops/locks/2026-06-25-person-centered-matches.md`
- `wiki/log.md`

## Read-Only Context

- `wiki/agent_ops/leader-agent-roadmap.md`
- `wiki/agent_ops/locks/`
- `WIKI.md`
- `wiki/index.md`
- `wiki/indexes/people.md`
- `wiki/indexes/helpers.md`
- `wiki/indexes/resources.md`
- `wiki/indexes/ventures.md`
- Existing `wiki/matches/*.md`

## Must Not Edit

- Active claim files owned by another boss agent
- Frontend files unless validation exposes a direct index/data contract break
- Legacy seed files
- `raw/`

## Plan

1. Pick 3-5 people with existing fact pages and obvious, source-backed match opportunities.
2. Launch subagents to inspect candidate people/helper/resource/venture pages and draft recommendations.
3. Write the strongest match pages in the existing match-page schema.
4. Update affected index/log files and this claim with results.
5. Run wiki lint/build checks and fix issues in the claimed zone.

## Progress

- 2026-06-25: Claim opened; checking candidate people-centered matches.
- 2026-06-25: Launched 3 read-only subagents across software/consumer, life-sciences/deep-tech, and energy/defense candidate discovery.
- 2026-06-25: Added 6 direct person↔venture pages: Davis Smith↔Cotopaxi, Dave Bearss↔Halia Therapeutics, Florian Solzbacher↔Blackrock Neurotech, Karl Sun↔Lucid Software, Ryan Smith (IMSAR)↔IMSAR, Tim Latimer↔Fervo Energy.
- 2026-06-25: Integrated 5 carry-in match pages already present on disk but missing from `wiki/indexes/matches.md`: Ryan Smith (IMSAR)↔47G, Josh James↔Tanner LLC, Jared Rutter↔Wilson Sonsini Salt Lake City, Karl Sun↔Wilson Sonsini Salt Lake City, Tim Latimer↔Utah FORGE.
- 2026-06-25: Boss added 3 additional person-centered match pages: Tim Latimer↔Zanskar Geothermal, Florian Solzbacher↔Ripple Neuro, Fred Lampropoulos↔Ripple Neuro.
- 2026-06-25: Reconciled `wiki/indexes/matches.md` to all 34 match files, with 17 person-centered pages in the 2026-06-25 batch.
- 2026-06-25: Checks passed: `npm run lint:wiki` checked 630 files with 0 errors/0 warnings; `npm run build:wiki` built 630 entries with matches=34; `npm run report:source-coverage` returned 0 errors, 524 warnings, all 194 source records cited.
- 2026-06-25: Newer active claim `2026-06-25-person-matches-integration.md` appeared after this reconciliation and owns the remaining Josh/Aaron/Ryan Qualtrics integration work.

## Files Changed

- `wiki/agent_ops/locks/2026-06-25-person-centered-matches.md`
- `wiki/agent_ops/locks/2026-06-25-person-venture-matches.md` (superseded)
- `WIKI.md`
- `wiki/matches/davis-smith-x-cotopaxi.md`
- `wiki/matches/dave-bearss-x-halia-therapeutics.md`
- `wiki/matches/florian-solzbacher-x-blackrock-neurotech.md`
- `wiki/matches/florian-solzbacher-x-ripple-neuro.md`
- `wiki/matches/florian-solzbacher-x-rqm-plus.md`
- `wiki/matches/fred-lampropoulos-x-ripple-neuro.md`
- `wiki/matches/karl-sun-x-lucid-software.md`
- `wiki/matches/ryan-smith-imsar-x-47g.md`
- `wiki/matches/ryan-smith-imsar-x-imsar.md`
- `wiki/matches/tim-latimer-x-fervo-energy.md`
- `wiki/matches/tim-latimer-x-zanskar-geothermal.md`
- `wiki/indexes/matches.md`
- `wiki/index.md`
- `wiki/log.md`
- `src/data/generated/all.json`

## Handoff / Next Step

- Done for the 34-page person-centered match reconciliation. The newer active `person-matches-integration` claim should handle newly appearing match pages such as `wiki/matches/josh-james-x-domo.md`, any remaining person gaps, roadmap logging, and commit coordination.
