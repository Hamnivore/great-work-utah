# Work Claim: Migration Factory — Final Pass

**Status:** done
**Agent:** Codex boss agent
**Started:** 2026-06-19 12:00 MDT
**Updated:** 2026-06-19 12:30 MDT

## Goal

Complete the migration factory workstream:
1. Convert `wiki/ventures/myriad-genetics-md` → proper `wiki/ventures/myriad-genetics.md` venture page (separating cleanly from `wiki/work/myriad-genetics-brca.md`).
2. Fix 17 discouraged-filename-suffix warnings: rename source files ending in `-profile`, `-page`, and update all cross-references.
3. Run lint and build checks; confirm clean.

## Broad Edit Zone

- `wiki/ventures/myriad-genetics.md` (create)
- `wiki/ventures/myriad-genetics-md` (delete after creation)
- `wiki/sources/*.md` — renames for discouraged suffixes only
- Any wiki page that references renamed source files

## Read-Only Context

- `wiki/ventures/myriad-genetics-md`
- `wiki/work/myriad-genetics-brca.md`
- `legacy_wiki/places_you_can_work/health-and-longevity/myriad-genetics.md`
- `wiki/agent_ops/schema.md`

## Must Not Edit

- `wiki/work/myriad-genetics-brca.md` (separate page, not in scope)
- `wiki/agent_ops/RUN_LOG.md`
- `wiki/agent_ops/DECISIONS.md`
- `docs/wiki-seed-worklist.md`
- Files claimed by other active agents

## Subagents

- Filename-fix worker: renames 17 discouraged-suffix source files and updates references.

## Progress

- Claimed this slice.
- Discovered all malformed venture files (`domo-md`, `instructure-md`, `pluralsight-md`, `qualtrics-md`, `ancestry-md`, `bamboohr-md`, `cotopaxi-md`, `lucid-software-md`, `novell-md`, `overstock-com-md`, `owlet-baby-care-md`, `skullcandy-md`, `vivint-smart-home-md`, `myriad-genetics-md`) already converted to proper `.md` venture pages by prior agents.
- Launched filename-fix subagent: renamed 16 of 17 discouraged-suffix source files; 1 conflict (`cotopaxi-b-lab-profile.md`) already resolved prior.
- Source renames: updated references in 24 wiki pages.
- Ran `npm run lint:wiki`: 0 errors, 0 warnings (445 files checked).
- Ran `npm run build:wiki`: 450 entries built, clean.
- Application Data Contract also completed by prior agent: `build-wiki-index.ts` and `src/lib/types.ts` updated to read from public wiki tree.

## Files Changed

- `wiki/agent_ops/locks/2026-06-19-migration-factory-final.md`
- 16 source renames via subagent
- References updated across 24 wiki pages

## Handoff / Next Step

- Source Recovery: 7 uncited pages (4 work, 2 ventures, 1 answer) need `wiki/sources/` records; work pages have external evidence but no source record pages.
- Run `node scripts/wiki-source-coverage.mjs` to monitor coverage improvements.
