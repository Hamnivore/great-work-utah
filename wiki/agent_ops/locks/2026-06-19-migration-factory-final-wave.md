# Work Claim: Migration Factory — Final Category Wave

**Status:** active
**Agent:** Claude boss (Sonnet 4.6)
**Started:** 2026-06-19 MDT
**Updated:** 2026-06-19 MDT

## Goal

Migrate all 30 remaining `legacy_wiki/places_you_can_work` entries that lack `wiki/ventures/` pages. Covers 10 categories: art-and-meaning, food-and-agriculture, manufacturing-and-materials, transportation, space, tools-for-thought, other, education, scientific-infrastructure, energy.

Target slugs:
- **Art (4):** cosm, deseret-book-bonneville, music-ai, utah-film-industry
- **Food (2):** renaissance-ag, usu-integrated-biosystems
- **Manufacturing (5):** act-aerospace, enduracure, innosys, ionic-mt, sky-quarry
- **Transportation (3):** electric-power-systems, jump-aero, wave-inc
- **Space (2):** northrop-grumman-promontory, ram-aviation-space-defense
- **Tools (1):** iris-biomedical
- **Other (4):** eden-technologies, great-salt-lake, nielson-scientific, nsa-utah-data-center
- **Education (3):** byu-pathway, sandbox, schoolai
- **Sci Infra (3):** ripple-neuro, tellus, utah-arch
- **Energy (3):** oxeon-energy, rodatherm-energy, valar-atomics

## Broad Edit Zone

- `wiki/ventures/` — 30 new venture pages
- `wiki/sources/` — source records per venture (official website or primary source)
- `wiki/indexes/ventures.md`, `wiki/indexes/sources.md`, `wiki/index.md`, `wiki/log.md` — boss integration pass
- `src/data/generated/all.json` — rebuilt by boss after all subagents complete
- this claim file

## Read-Only Context

- `legacy_wiki/places_you_can_work/<category>/<slug>.md` — source content per venture
- `wiki/ventures/coreform.md` — format exemplar
- `wiki/sources/coreform-official-website.md` — source page format exemplar
- `wiki/agent_ops/schema.md` — wiki schema

## Must Not Edit

- `wiki/work/`, `wiki/matches/`, `wiki/people/`, `wiki/guides/` — other workstreams
- `wiki/agent_ops/RUN_LOG.md`, `DECISIONS.md`, `docs/wiki-seed-worklist.md`
- `scripts/`, `src/lib/` — Application Data Contract zone
- Files owned by active source-recovery claims

## Subagents

- **Group A (Manufacturing):** act-aerospace, enduracure, innosys, ionic-mt, sky-quarry
- **Group B (Art + Food):** cosm, deseret-book-bonneville, music-ai, utah-film-industry, renaissance-ag, usu-integrated-biosystems
- **Group C (Transportation + Space):** electric-power-systems, jump-aero, wave-inc, northrop-grumman-promontory, ram-aviation-space-defense
- **Group D (Education + Sci Infra):** byu-pathway, sandbox, schoolai, ripple-neuro, tellus, utah-arch
- **Group E (Energy + Other + Tools):** oxeon-energy, rodatherm-energy, valar-atomics, eden-technologies, great-salt-lake, nielson-scientific, nsa-utah-data-center, iris-biomedical

## Progress

- Claimed slice. Launching 5 parallel subagents.

## Files Changed

- Pending (subagent results).

## Handoff / Next Step

- After integration: people/ pages (0 currently), venture↔resource matches, source coverage.
