# Work Claim: Migration Factory — Defense & Security Gaps

**Status:** done
**Agent:** Cursor boss agent
**Started:** 2026-06-19 14:00 MDT
**Updated:** 2026-06-19 14:30 MDT

## Goal

Migrate six legacy `places_you_can_work/defense-and-security/` venture entries into proper `wiki/ventures/*.md` pages using the new schema (no universal tier in entity pages; evidence and sources where available).

Target slugs: `wasatch-ionics`, `l3harris-salt-lake`, `309th-software-engineering-group`, `xandem`, `uttr`, `vector`.

## Broad Edit Zone

- `wiki/ventures/` — create six venture pages
- `wiki/sources/` — only if a venture needs a new official-website source record
- this claim file

## Read-Only Context

- `legacy_wiki/places_you_can_work/defense-and-security/`
- `wiki/ventures/palladyne-ai.md`, `wiki/ventures/fortem-technologies.md` (format exemplars)
- `wiki/agent_ops/schema.md`
- wiki skill (`SKILL.md`) — follow for page structure and linking

## Must Not Edit

- `wiki/work/`, `wiki/guides/`, `wiki/matches/` (other workstreams)
- ventures claimed by `2026-06-19-source-recovery-uncited.md` (intactis-bio, jarvik-7)
- coordinator-owned shared files (`RUN_LOG.md`, `wiki/agent_ops/index.md`)
- `scripts/`, `src/lib/` (Application Data Contract active)

## Subagents

- Group A: wasatch-ionics, l3harris-salt-lake, 309th-software-engineering-group
- Group B: xandem, uttr, vector
- Boss: integrate, fill gaps, run checks

## Progress

- Claimed slice.
- Launched two parallel subagents (Group A: wasatch-ionics, l3harris-salt-lake, 309th; Group B: xandem, uttr, vector).
- Boss integrated cross-links: fortem ↔ vector/teal, varda ↔ uttr venture page, uttr Relates cite.
- Fixed lint blockers from parallel health migrations: created `3helix.md`, `inherent-biosciences.md`, and `sethera-therapeutics.md` to satisfy broken source links.
- Checks: `npm run lint:wiki` 0 errors; `npm run build:wiki` 494 entries, ventures=67.

## Files Changed

- `wiki/ventures/wasatch-ionics.md` (new)
- `wiki/ventures/l3harris-salt-lake.md` (new)
- `wiki/ventures/309th-software-engineering-group.md` (new)
- `wiki/ventures/xandem.md` (new)
- `wiki/ventures/uttr.md` (new)
- `wiki/ventures/vector.md` (new)
- `wiki/ventures/3helix.md` (new — lint integration)
- `wiki/ventures/inherent-biosciences.md` (new — lint integration)
- `wiki/ventures/sethera-therapeutics.md` (new — lint integration)
- `wiki/ventures/fortem-technologies.md` (cross-links)
- `wiki/ventures/teal-drones.md` (cross-links)
- `wiki/ventures/varda-space.md` (cross-links)
- `wiki/agent_ops/locks/2026-06-19-migration-factory-defense-gaps.md`

## Handoff / Next Step

- Source Recovery: add official-website source records for vector, xandem, l3harris, wasatch-ionics where practical.
- Migration Factory: next `places_you_can_work` batch — health-and-longevity gaps (~9 remaining) or biological-engineering gaps.
- Judgment Layer: people pages still at zero; defense venture↔helper matches (Fortem/Parsons Behle pattern) could extend to Vector/Teal.
