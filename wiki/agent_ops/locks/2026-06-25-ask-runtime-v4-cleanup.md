# Work Claim: Ask Runtime V4 Cleanup

**Status:** done
**Agent:** Codex boss
**Started:** 2026-06-25 10:52 MDT
**Updated:** 2026-06-25 11:18 MDT

## Goal

Finish a narrow Ask / Runtime slice: remove remaining Trigger.dev v3 import drift, audit Ask realtime trigger usage, and add small write-safety/runtime hardening where the current code makes it practical.

## Broad Edit Zone

- `src/trigger/...`
- `src/pages/Ask.tsx`
- `src/components/home-prototypes/parts/WhosReading.tsx`
- `api/trigger-token.ts`
- `vite.config.ts`
- supporting docs/log entries for this claim

## Read-Only Context

- `AGENTS.md`
- `wiki/agent_ops/leader-agent-roadmap.md`
- `wiki/agent_ops/locks/2026-06-19-ask-runtime-and-people-pilot.md`
- `wiki/log.md`

## Must Not Edit

- Active boss claim files other than this one
- Current in-flight wiki rename/index changes outside this slice
- `wiki/people/...` and `wiki/ventures/...` content pages unless a runtime check requires read-only inspection

## Plan

1. Inspect remaining Trigger.dev runtime files and Ask frontend usage.
2. Delegate independent audits for frontend realtime/token handling and task definitions/write-safety.
3. Patch remaining v3 imports and practical runtime safety gaps.
4. Run TypeScript/build and relevant wiki checks.
5. Update this claim and roadmap log with results.

## Progress

- 2026-06-25 10:52 MDT: Claimed narrow Ask / Runtime v4 cleanup after confirming the prior 2026-06-19 Ask / Runtime claim was marked done but runtime v3 import drift remained.
- Spawned two read-only explorer subagents:
  - Trigger.dev/runtime audit: confirmed target-code imports now use root `@trigger.dev/sdk`, `task`/`schedules.task` usage is v4-compatible, and no `client.defineJob` or unsupported wait patterns were present.
  - Ask/realtime frontend audit: confirmed `useRealtimeTaskTrigger<typeof searchAgent>("search-agent", { accessToken })` and payload/output/metadata wiring are compatible with Trigger.dev v4.
- Boss patch:
  - Removed remaining `@trigger.dev/sdk/v3` imports in runtime entry points.
  - Added 15-minute Trigger.dev trigger-token expiration in the production API route and Vite dev middleware.
  - Hardened the Vite dev token middleware so it does not clobber an inherited `TRIGGER_SECRET_KEY` with an empty env value and fails clearly when no secret is present.
  - Hardened `search-agent` tool handling: fixed-string grep, safe wiki path resolution, malformed tool-JSON recovery, category/slug write validation, and opt-in writes via `SEARCH_AGENT_WRITE_ENABLED`.
  - Stopped streaming raw model reasoning into Trigger metadata; the UI now gets short progress summaries plus the final streamed response.
  - Hardened `github-wiki` writes so helper calls can create public wiki pages only in allowed directories and cannot overwrite unless explicitly enabled by the caller.
  - Made the scheduled `wiki-agent` write path opt-in via `WIKI_AGENT_WRITES_ENABLED`, validates generated filenames, skips existing pages, and returns non-ok status on blocked/API write results.
  - Improved Ask and WhosReading token/error handling so non-JSON token failures, pending Trigger statuses, and terminal run failures do not leave permanent loading states.
- Coordination note: `wiki/agent_ops/locks/2026-06-25-1052-ask-runtime-hardening.md` appeared during this run and owns a broader Ask / Runtime hardening slice. This claim is closed to avoid duplicate active ownership.

## Files Changed

- `src/trigger/hello-world.ts`
- `src/trigger/github-wiki.ts`
- `src/trigger/llm.ts`
- `src/trigger/search-agent.ts`
- `src/trigger/wiki-agent.ts`
- `src/pages/Ask.tsx`
- `src/components/home-prototypes/parts/WhosReading.tsx`
- `api/trigger-token.ts`
- `vite.config.ts`
- `wiki/agent_ops/locks/2026-06-25-ask-runtime-v4-cleanup.md`

## Handoff / Next Step

- Checks run:
  - `rg -n "@trigger\\.dev/sdk/v3|client\\.defineJob|defineJob\\(|Promise\\.all\\([^\\n]*(triggerAndWait|batchTriggerAndWait|wait\\.)|reasoning_content.*metadata" src api vite.config.ts trigger.config.ts` — no matches.
  - `./node_modules/.bin/tsc -p tsconfig.app.json --noEmit --incremental false` — passed.
  - `npm run build` — passed; built 636 wiki entries and Vite production bundle. Vite reported the existing large chunk warning.
  - `npm run lint:wiki` — passed, 636 files, 0 errors, 0 warnings.
- Next: broader hardening can decide whether to add app-level auth/rate limiting around `/api/trigger-token`; this slice only shortened token lifetime and improved failure behavior.
