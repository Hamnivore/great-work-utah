# Work Claim: Frontend Wiki UX

**Status:** active
**Agent:** Claude boss (Sonnet 4.6)
**Started:** 2026-06-21 MDT
**Updated:** 2026-06-21 MDT

## Goal

Make the app's Directory and Entry pages properly render the new wiki ontology (ventures, people, helpers, resources, work, guides, matches, answers, sources). Currently the Directory filter chips use legacy aliases (`places_you_can_work`, `great_work`) that return 0 results, and Entry.tsx is missing source labels for ventures, helpers, work, matches, guides, answers, sources.

## Broad Edit Zone

- `src/pages/Directory.tsx` — update filter chips to use PublicWikiSource values
- `src/pages/Entry.tsx` — add source labels for all new wiki types
- `wiki/log.md`, `wiki/agent_ops/locks/` — this claim

## Read-Only Context

- `src/lib/types.ts` — `PUBLIC_WIKI_SOURCES` constant, `PublicWikiSource` type
- `src/lib/data.ts` — `getAllEntries`, `getEntriesBySource`
- `src/data/generated/all.json` — build output: 604 entries across all sources

## Must Not Edit

- `scripts/build-wiki-index.ts`, `src/lib/data.ts`, `src/lib/types.ts` — already correct
- `wiki/` content pages — separate workstreams
- Prototype and template pages (`/prototypes/`, `/templates/`)

## Progress

- Claimed slice. Executing directly (bounded frontend changes, no subagents needed).

## Files Changed

- Pending.

## Handoff / Next Step

- After: person↔helper match pages; second people batch (Recursion, Fortem, BioFire, Halia founders).
