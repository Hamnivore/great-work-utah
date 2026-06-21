# Work Claim: Migration Factory — Myriad Finalize + Legacy Gap Batch

**Status:** done
**Agent:** Cursor boss agent
**Started:** 2026-06-19 13:00 MDT
**Updated:** 2026-06-19 13:15 MDT

## Goal

Close the malformed-venture migration by retiring `myriad-genetics-md` after validating the venture/work split, then migrate four high-value legacy `places_you_can_work` entries that lack public wiki venture pages.

## Broad Edit Zone

- `wiki/ventures/myriad-genetics.md`, `wiki/ventures/myriad-genetics-md` (delete stub)
- `wiki/sources/myriad-genetics-official-website.md`
- `wiki/work/myriad-genetics-brca.md` (See Also only if needed)
- New venture pages + sources for: `coreform`, `culmination-bio`, `intan-technologies`, `epitel`
- `legacy_wiki/places_you_can_work/` (read-only seed)
- this claim file

## Read-Only Context

- `docs/old-db-migration-malformed-ventures.md`
- `wiki/agent_ops/schema.md`
- `wiki/ventures/fortem-technologies.md`
- `wiki/sources/fortem-official-website.md`

## Must Not Edit

- `wiki/agent_ops/index.md`, `RUN_LOG.md`, `DECISIONS.md`, `docs/wiki-seed-worklist.md`
- `scripts/*`, `package.json` — Source Technology claim
- `src/lib/*`, `scripts/build-wiki-index.ts` — Application Data Contract claim

## Subagents

- Scientific-infrastructure batch ([coreform, culmination-bio](dc20116a-9666-427c-b9a5-1d40c2d484f7)) — completed
- Tools-for-thought batch ([intan-technologies, epitel](de1d5a46-a762-4cef-bfd5-03d48889bcf3)) — completed

## Progress

- Claimed Migration Factory slice after Source Recovery and legacy-merge completions.
- Verified Myriad venture/work split: `wiki/ventures/myriad-genetics.md` cites official source; `wiki/work/myriad-genetics-brca.md` holds BRCA history; malformed `myriad-genetics-md` already retired (zero `*-md` stubs remain).
- Launched two parallel subagents; integrated four new venture pages and four source records.
- Ran `npm run lint:wiki`: 445 files, 0 errors, 0 warnings.
- Ran `npm run build:wiki`: 446 entries, 53 ventures.

## Files Changed

**Myriad (verified, no edits needed)**
- `wiki/ventures/myriad-genetics.md` (pre-existing)
- `wiki/sources/myriad-genetics-official-website.md` (pre-existing)
- deleted earlier: `wiki/ventures/myriad-genetics-md`

**Subagent migrations**
- `wiki/ventures/coreform.md`
- `wiki/ventures/culmination-bio.md`
- `wiki/ventures/intan-technologies.md`
- `wiki/ventures/epitel.md`
- `wiki/sources/coreform-official-website.md`
- `wiki/sources/culmination-bio-official-website.md`
- `wiki/sources/intan-technologies-official-website.md`
- `wiki/sources/epitel-official-website.md`

**Generated**
- `src/data/generated/all.json`

## Handoff / Next Step

- **Malformed venture migration complete** — all 14 `*-md` stubs converted or retired per `docs/old-db-migration-malformed-ventures.md`.
- **Legacy gap backlog** — ~70+ `places_you_can_work` entries still lack venture pages; prioritize scientific-infrastructure, health-and-longevity, and biological-engineering clusters next.
- **Hero images** — new pages use picsum placeholders pending cleared imagery.
- **Open questions** — see Open Questions sections on coreform, culmination-bio, intan, epitel pages.
