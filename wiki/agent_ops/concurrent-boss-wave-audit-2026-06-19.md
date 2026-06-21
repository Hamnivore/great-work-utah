# Concurrent Boss Wave Audit: 2026-06-19

**Status:** Draft
**Confidence:** High
**Updated:** 2026-06-19

Audit of what broke after many boss agents ran concurrently.

## What Broke

1. **Claims stayed open after work moved on.** Several claims still say `active` with pending files/handoffs, even though later bosses completed overlapping work. Main examples: `2026-06-19-1116-application-data-contract.md`, `2026-06-19-ask-runtime-and-people-pilot.md`, `2026-06-19-migration-factory-wave2.md`, `2026-06-19-migration-factory-final-wave.md`, and `2026-06-19-people-pages-first-wave.md`.

2. **Broad claims collided with narrower later claims.** Migration Factory and People work overlapped heavily. Later bosses finished slices but did not supersede or narrow the old broad claims.

3. **Wiki lint regressed.** `npm run lint:wiki` now fails. The audit run saw 21 errors, mostly broken links from newly migrated pages to missing `wiki/sources/*-official-website.md` records, plus broken people/source links.

4. **General ESLint now scans Trigger temp builds.** `npm run lint` fails on `.trigger/tmp/...` generated files before reaching useful app issues. It also reports pre-existing React/ref and fast-refresh issues plus one `src/trigger/search-agent.ts` `any`.

5. **Indexes drifted during the wave.** Before rebuilding, sharded wiki indexes lagged behind public files. Running `npm run build:wiki:skill-index` rebuilt the skill index for 590 pages.

6. **App index and skill index are different surfaces.** `npm run build:wiki` built 546 app entries; `build:wiki:skill-index` built 590 wiki-skill pages. This may be intentional, but the distinction must be explicit or bosses will treat one as stale.

7. **Roadmap log bloated immediately.** Bosses appended detailed run logs to `leader-agent-roadmap.md`, recreating the context problem. The roadmap was compacted again; detailed logs belong in claim files.

8. **Source syntax drift remains.** `report:source-coverage` reports 25 legacy `[source:slug]` tokens in public pages. Current schema wants relative markdown links and optional `Relates: cites`.

9. **Source coverage is improving but noisy.** Coverage report checked 408 public content files: 188 covered, 196 directory-only, 1 uncovered, 471 warnings, 8 errors. `Relates: cites` coverage is still low: 88 pages with cites, 320 without.

10. **Malformed venture migration report became stale.** `docs/old-db-migration-malformed-ventures.md` said malformed files remained, but the working tree now deletes them and adds replacement `.md` files. The report was updated to mark itself historical.

## Immediate Cleanup Queue

1. Run a Command Center pass to mark stale broad claims `superseded` or `paused`.
2. Fix `lint:wiki` broken links by either adding missing source pages or correcting bad links.
3. Add `.trigger/tmp/` to lint ignores or otherwise exclude generated Trigger build output from ESLint.
4. Decide and document the app-index vs skill-index boundary.
5. Convert legacy `[source:slug]` tokens to relative markdown links.
6. Re-run: `npm run lint:wiki`, `npm run build:wiki`, `npm run build:wiki:skill-index`, `npm run report:source-coverage -- --json`.

## Checks Run

- `npm run lint:wiki` — failed with broken links.
- `npm run build:wiki` — sandbox IPC failed, rerun with approval succeeded: 546 entries.
- `npm run build:wiki:skill-index` — succeeded: 590 pages.
- `npm run report:source-coverage -- --json` — failed nonzero because coverage warnings/errors remain; report generated.
- `npm run lint` — failed because ESLint scans `.trigger/tmp` generated output, plus existing app lint issues.
