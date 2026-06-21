# Work Claim: Ask / Runtime SDK Migration + People Pages Pilot

**Status:** done
**Agent:** Claude boss (leader-agent-roadmap)
**Started:** 2026-06-19 17:00 MDT
**Updated:** 2026-06-19 17:30 MDT

## Goal

Two concurrent slices:

1. **Ask / Runtime** — Migrate all `@trigger.dev/sdk/v3` imports to `@trigger.dev/sdk` (v4 is already installed at ^4.4.5). Add write safety to the search agent so it does not blindly overwrite existing wiki pages.

2. **Judgment Layer: People Pilot** — Create 5 people pages for key Utah innovation figures mentioned across existing venture and work pages: Josh James, Ryan Smith, Aaron Skonnard, Tim Latimer, Karl Sun. Each with a matching source record and `Relates` back-links from venture/work pages.

## Broad Edit Zone

### Ask / Runtime
- `trigger.config.ts`
- `src/trigger/wiki-agent.ts`
- `src/trigger/search-agent.ts`
- `api/trigger-token.ts`

### People Pilot
- `wiki/people/` — new people pages
- `wiki/sources/` — source records per person
- `wiki/ventures/domo.md`, `wiki/ventures/qualtrics.md`, `wiki/ventures/pluralsight.md`, `wiki/ventures/lucid-software.md`, `wiki/ventures/fervo-energy.md` — add `Relates: helps` back-links
- `wiki/work/omniture-web-analytics.md` — add `Relates: cites` Josh James link
- `wiki/indexes/people.md`, `wiki/indexes/sources.md` (boss integration after subagents)
- `wiki/index.md`, `wiki/log.md`, `WIKI.md`

## Read-Only Context

- `wiki/agent_ops/schema.md` (page formats, Relates verbs)
- `wiki/ventures/domo.md`, `wiki/ventures/qualtrics.md`, `wiki/ventures/pluralsight.md`, `wiki/ventures/lucid-software.md`, `wiki/ventures/fervo-energy.md`
- `wiki/work/omniture-web-analytics.md`
- `wiki/sources/` (existing source records for style)
- `wiki/agent_ops/locks/TEMPLATE.md`

## Must Not Edit

- `wiki/work/` pages targeted by `2026-06-19-source-recovery-uncited.md`
- `wiki/ventures/intactis-bio.md`, `wiki/ventures/jarvik-7-artificial-heart.md`
- `scripts/build-wiki-index.ts`, `src/lib/*` — Application Data Contract claim
- `wiki/agent_ops/RUN_LOG.md`, `DECISIONS.md`, `docs/wiki-seed-worklist.md`
- Active claims owned by other agents

## Subagents

- People batch A: Josh James + Ryan Smith
- People batch B: Aaron Skonnard + Tim Latimer + Karl Sun

## Progress

- Fixed all `@trigger.dev/sdk/v3` imports to `@trigger.dev/sdk` (trigger.config.ts, wiki-agent.ts, search-agent.ts, api/trigger-token.ts). SDK already at ^4.4.5; only import paths were stale.
- Added write-safety guard to search-agent.ts: blocks overwrite of existing wiki pages; prompts read-first instead.
- Two parallel people subagents launched. Aaron Skonnard already existed; created Josh James, Ryan Smith (Qualtrics), Tim Latimer, Karl Sun.
- Renamed 4 source files from `-profile` to `-bio` suffix to clear lint warnings; updated all internal references.
- Checks: lint 0 warnings (23 pre-existing broken-source errors from other migration batches, unrelated to this slice). Build: 588 entries, people=10, sources=180.

## Files Changed

### Ask / Runtime
- `trigger.config.ts` — `@trigger.dev/sdk/v3` → `@trigger.dev/sdk`
- `src/trigger/wiki-agent.ts` — same import fix
- `src/trigger/search-agent.ts` — import fix + write-safety guard in write_file handler
- `api/trigger-token.ts` — import fix

### People Pilot
- `wiki/people/josh-james.md` (new)
- `wiki/people/ryan-smith-qualtrics.md` (new)
- `wiki/people/tim-latimer.md` (new, by subagent)
- `wiki/people/karl-sun.md` (new, by subagent)
- `wiki/sources/josh-james-domo-bio.md` (new)
- `wiki/sources/ryan-smith-qualtrics-bio.md` (new)
- `wiki/sources/tim-latimer-fervo-bio.md` (new, by subagent)
- `wiki/sources/karl-sun-lucid-bio.md` (new, by subagent)
- `wiki/ventures/domo.md` — added `Relates: helps Josh James`
- `wiki/ventures/qualtrics.md` — added `Relates: helps Ryan Smith (Qualtrics)`
- `wiki/ventures/fervo-energy.md` — added `Relates: helps Tim Latimer` (by subagent)
- `wiki/ventures/lucid-software.md` — added `Relates: helps Karl Sun` (by subagent)
- `wiki/work/omniture-web-analytics.md` — added `Relates: helps Josh James`
- `wiki/indexes/people.md`, `wiki/indexes/sources.md` — rebuilt via build:wiki:skill-index
- `wiki/index.md` — people count updated to 10
- `wiki/log.md` — two entries appended
- `WIKI.md` — article count updated to 588

## Handoff / Next Step

- **Source Recovery uncited** (`2026-06-19-source-recovery-uncited.md`) is still active — 7 uncited pages. Can resume after that claim completes.
- **Application Data Contract** (`2026-06-19-1116-application-data-contract.md`) still active — scripts/build-wiki-index.ts and src/lib alignment.
- **Remaining lint errors** (23): all broken-source links from recent migration batches. A Source Recovery pass targeting those ventures would clear them.
- **Person↔resource matches** — now that people pages exist, venture↔resource match pages like Halia/Nucleus can be extended to person matches.
- **Next people batch** — no people pages for Recursion, Fortem, BioFire, Halia founders; natural candidates for a second pass.
