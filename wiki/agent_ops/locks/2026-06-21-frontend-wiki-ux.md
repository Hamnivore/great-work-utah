# Work Claim: Frontend Wiki UX

**Status:** done
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

- Executed directly (bounded frontend changes, no subagents needed).
- `src/pages/Directory.tsx`: replaced legacy filter type + chips with `SOURCE_FILTERS` array covering all 9 `PublicWikiSource` values + `all`. Default is `ventures`.
- `src/pages/Entry.tsx`: added `SOURCE_LABELS` map; replaced 3-condition chain with single lookup.
- Checks: tsc clean, lint 0 errors 0 warnings, build 604 entries, `npm run build` clean (2.47s).

## Files Changed

- `src/pages/Directory.tsx` — filters updated
- `src/pages/Entry.tsx` — source labels updated
- `wiki/log.md` — entry appended

## Handoff / Next Step

- After: person↔helper match pages; second people batch (Recursion, Fortem, BioFire, Halia founders).
