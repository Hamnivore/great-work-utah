# Work Claim: Migration Factory — Energy, Transportation & Education Batch

**Status:** done
**Agent:** Cursor boss agent
**Started:** 2026-06-19 16:00 MDT
**Updated:** 2026-06-19 16:45 MDT

## Goal

Migrate nine unmigrated `legacy_wiki/places_you_can_work/` entries into source-first `wiki/ventures/` pages with matching `wiki/sources/` records:

- Energy: oxeon-energy, rodatherm-energy, valar-atomics
- Transportation: electric-power-systems, jump-aero, wave-inc
- Education: byu-pathway, sandbox, schoolai

## Broad Edit Zone

- `wiki/ventures/` — nine new venture pages
- `wiki/sources/` — official-website or primary-source records per venture
- `wiki/indexes/ventures.md`, `wiki/indexes/sources.md`, `wiki/index.md`, `wiki/log.md` (boss integration)
- this claim file

## Read-Only Context

- `legacy_wiki/places_you_can_work/energy/`, `transportation/`, `education/`
- `wiki/ventures/epitel.md`, `wiki/sources/epitel-official-website.md` (format exemplars)
- `wiki/agent_ops/schema.md`
- wiki skill at `~/.claude/plugins/cache/claude-plugins-official/wiki/0.1.0/skills/wiki/SKILL.md`

## Must Not Edit

- `wiki/agent_ops/RUN_LOG.md`, `DECISIONS.md`, `docs/wiki-seed-worklist.md`
- `scripts/*`, `src/lib/*` — Application Data Contract claim
- `wiki/work/`, `wiki/ventures/intactis-bio.md`, `jarvik-7-artificial-heart.md` — Source Recovery uncited claim
- `wiki/matches/`, `wiki/people/` — Judgment Layer zones
- biological-engineering and health-and-longevity legacy entries claimed by other active Migration Factory slices

## Subagents

- Group A (Energy): oxeon-energy, rodatherm-energy, valar-atomics — completed
- Group B (Transportation): electric-power-systems, jump-aero, wave-inc — completed
- Group C (Education): byu-pathway, sandbox, schoolai — completed

## Progress

- Claimed Migration Factory slice (energy + transportation + education).
- Launched three parallel subagents; all nine ventures migrated with source records.
- Boss ran `build:wiki:skill-index`, added Fervo↔Rodatherm See Also cross-link, updated `wiki/log.md`.
- Checks: `npm run lint:wiki` 0 errors; `npm run build:wiki` 532 entries, ventures=82.

## Files Changed

**Ventures (9):** `oxeon-energy.md`, `rodatherm-energy.md`, `valar-atomics.md`, `electric-power-systems.md`, `jump-aero.md`, `wave-inc.md`, `byu-pathway.md`, `sandbox.md`, `schoolai.md`

**Sources (9):** `oxeon-energy-official-website.md`, `rodatherm-energy-official-website.md`, `valar-atomics-official-website.md`, `electric-power-systems-official-website.md`, `jump-aero-official-website.md`, `wave-inc-official-website.md`, `byu-pathway-official-website.md`, `sandbox-official-website.md`, `schoolai-official-website.md`

**Integration:** `wiki/index.md`, `wiki/indexes/ventures.md`, `wiki/indexes/sources.md`, `wiki/log.md`, `wiki/ventures/fervo-energy.md`, `src/data/generated/all.json`

## Handoff / Next Step

- Residual gaps: Valar Ward 250 criticality press source page; EPS Go Utah incentive source; Jump Aero UDOT MOU primary doc; WAVE Tillou/Ideanomics parentage source.
- Next Migration Factory slice candidates: manufacturing-and-materials (act-aerospace, ionic-mt, sky-quarry), health-and-longevity remainder (rebel-medicine, trace-aq), or scientific-infrastructure (ripple-neuro, utah-arch).
