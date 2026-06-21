# Work Claim: Application Data Contract

**Status:** active
**Agent:** Codex boss agent
**Started:** 2026-06-19 11:16 MDT
**Updated:** 2026-06-19 11:16 MDT

## Goal

Make the generated wiki index and `src/lib` consumers align with the new public wiki ontology so the app can browse/search public pages by type without depending on retired legacy assumptions.

## Broad Edit Zone

- `scripts/build-wiki-index.ts`
- `src/lib/`
- route/filter consumers in `src/pages/` and `src/components/` that hard-code old entry sources
- generated public wiki index artifacts, if owned by the build script
- this claim file

## Read-Only Context

- `wiki/agent_ops/leader-agent-roadmap.md`
- `WIKI.md`
- `wiki/index.md`
- `wiki/agent_ops/locks/`
- active claim files

## Must Not Edit

- active source-recovery, venture, and lint-debt claim zones
- `wiki/work/` and `wiki/sources/` pages owned by the active lint-debt repair
- coordinator-owned shared files unless final integration requires a brief roadmap log update
- unrelated content pages

## Plan

1. Inspect current generated data contract and app consumers.
2. Launch subagents for independent contract audit and UI/consumer usage audit.
3. Implement the minimal contract changes in the build script and `src/lib`.
4. Integrate subagent findings, run checks, and repair fallout.
5. Mark this claim done with files changed, checks, and residual gaps.

## Progress

- Claimed Application Data Contract slice.
- Widened app edit zone to cover route/filter consumers with old source ids.

## Files Changed

- Pending.

## Handoff / Next Step

- Pending.
