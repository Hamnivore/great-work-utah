# Work Claim: Migration Factory — Legacy Wave 2 (Multi-Category)

**Status:** active
**Agent:** Claude Sonnet boss agent
**Started:** 2026-06-19 ~18:00 MDT
**Updated:** 2026-06-19 ~18:00 MDT

## Goal

Migrate the remaining ~44 legacy `places_you_can_work` entries into `wiki/ventures/` pages with matching `wiki/sources/` records. Cover all categories not yet claimed: energy, manufacturing, space, transportation, scientific-infrastructure, remaining bio-engineering, remaining health-and-longevity, other, art-and-meaning, food-and-agriculture.

## Broad Edit Zone

- `wiki/ventures/` — new venture pages for all targets
- `wiki/sources/` — official-website source records per venture
- `wiki/indexes/` — refreshed after all subagents complete
- this claim file

## Read-Only Context

- `wiki/agent_ops/schema.md`
- `wiki/WIKI.md`
- `legacy_wiki/places_you_can_work/` — seed material
- `wiki/ventures/torus.md`, `wiki/ventures/fortem-technologies.md` — style reference
- `wiki/sources/torus-official-website.md` — source record style reference

## Must Not Edit

- `wiki/agent_ops/RUN_LOG.md`, `DECISIONS.md` — coordinator-owned
- `wiki/agent_ops/index.md` — coordinator-owned
- Files claimed by other active agents
- `scripts/*`, `src/lib/*` — Application Data Contract already done

## Subagents

- **Group A (Energy):** fervo-energy, zanskar-geothermal, oxeon-energy, rodatherm-energy, valar-atomics
- **Group B (Manufacturing):** act-aerospace, enduracure, hexcel, innosys, ionic-mt, merit-medical, sky-quarry
- **Group C (Space + Transportation):** northrop-grumman-promontory, ram-aviation-space-defense, space-dynamics-laboratory, electric-power-systems, jump-aero, wave-inc
- **Group D (Sci-Infra + remaining Bio):** ripple-neuro, tellus, utah-arch, iris-biomedical, araknitek, batu-biologics, bioparin, cleanjoule, thera-t-pharmaceutics
- **Group E (Health remaining):** bioenergenix, nephronovus, rebel-medicine, recursion-pharmaceuticals, spire-therapeutic, symbiocelltech, trace-aq
- **Boss (Other + Art/Food):** eden-technologies, great-salt-lake, nielson-scientific, nsa-utah-data-center, cosm, deseret-book-bonneville, music-ai, utah-film-industry, renaissance-ag, usu-integrated-biosystems

## Progress

- Claimed slice. Launched 5 parallel subagents. Boss working on Other/Art/Food batch.

## Files Changed

- Pending.

## Handoff / Next Step

- Run `npm run lint:wiki` and `npm run build:wiki` after all subagents complete.
- People pages (`wiki/people/`) — 0 currently; next wave priority.
- Guides source coverage — 7 guides need `Relates: cites` edges.
