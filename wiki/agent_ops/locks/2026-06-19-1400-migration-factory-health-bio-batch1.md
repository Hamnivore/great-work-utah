# Work Claim: Migration Factory — Health & Bio-Engineering Batch 1

**Status:** done
**Agent:** Cursor boss agent
**Started:** 2026-06-19 14:00 MDT
**Updated:** 2026-06-19 14:45 MDT

## Goal

Migrate six high-value legacy `places_you_can_work` entries into source-first `wiki/ventures/` pages with matching `wiki/sources/` records: photopharmics, inherent-biosciences, atavistik-bio, 3helix, curza, sethera-therapeutics.

## Broad Edit Zone

- `wiki/ventures/` — new venture pages for the six targets
- `wiki/sources/` — official-website source records per venture
- this claim file

## Read-Only Context

- `legacy_wiki/places_you_can_work/health-and-longevity/`
- `legacy_wiki/places_you_can_work/biological-engineering/`
- `wiki/ventures/coreform.md`, `wiki/ventures/fortem-technologies.md`
- `wiki/sources/coreform-official-website.md`
- `wiki/agent_ops/schema.md`
- `.claude/skills/wiki/SKILL.md` (wiki skill v0.2.0)

## Must Not Edit

- `scripts/*`, `src/lib/*` — Application Data Contract claim
- `wiki/work/` pages targeted by Source Recovery uncited claim
- `wiki/ventures/intactis-bio.md`, `wiki/ventures/jarvik-7-artificial-heart.md`
- coordinator-owned shared files (`wiki/agent_ops/index.md`, `RUN_LOG.md`, `DECISIONS.md`)

## Subagents

- Group A: photopharmics, inherent-biosciences, atavistik-bio (health-and-longevity)
- Group B: 3helix, curza, sethera-therapeutics (biological-engineering)

## Progress

- Claimed Migration Factory slice (health + bio-engineering batch 1).
- Launched two parallel subagents (health ×3, bio-engineering ×3).
- Integrated 6 venture pages + 6 source records; verified cross-links (Sethera → 3Helix, Recursion).
- Ran `npm run lint:wiki`: 494 files, 0 errors, 0 warnings.
- Ran `npm run build:wiki`: 494 entries, 67 ventures.
- Ran `npm run build:wiki:skill-index`: refreshed sharded indexes.

## Files Changed

**Ventures**
- `wiki/ventures/photopharmics.md`
- `wiki/ventures/inherent-biosciences.md`
- `wiki/ventures/atavistik-bio.md`
- `wiki/ventures/3helix.md`
- `wiki/ventures/curza.md`
- `wiki/ventures/sethera-therapeutics.md`

**Sources**
- `wiki/sources/photopharmics-official-website.md`
- `wiki/sources/inherent-biosciences-official-website.md`
- `wiki/sources/atavistik-bio-official-website.md`
- `wiki/sources/3helix-official-website.md`
- `wiki/sources/curza-official-website.md`
- `wiki/sources/sethera-therapeutics-official-website.md`

**Generated**
- `src/data/generated/all.json`
- `wiki/indexes/ventures.md`, `wiki/indexes/sources.md`, `wiki/index.md` (via skill-index)

## Handoff / Next Step

- **Legacy gap backlog** — ~48 `places_you_can_work` entries still lack venture pages (down from ~54).
- **Next batch candidates** — health: trace-aq, spire-therapeutic, rebel-medicine, nephronovus; bio: batu-biologics, araknitek, cleanjoule; scientific-infrastructure: ripple-neuro, tellus, sci-institute.
- **Follow-ups** — Atavistik pipeline emphasis drift (HHT vs AKT1 E17K) needs dedicated source ingest; PhotoPharmics HQ (American Fork vs SLC) verify; no `raw/` verbatim captures yet for these six.
- **Hero images** — all six use picsum placeholders pending cleared imagery.
