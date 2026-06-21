# Work Claim: Migration Factory — Health & Longevity Gap Batch 2

**Status:** done
**Agent:** Cursor boss agent
**Started:** 2026-06-19 16:00 MDT
**Updated:** 2026-06-19 16:45 MDT

## Goal

Migrate six remaining `legacy_wiki/places_you_can_work/health-and-longevity/` entries into source-first `wiki/ventures/` pages with matching `wiki/sources/` records: rebel-medicine, spire-therapeutic, trace-aq, symbiocelltech, bioenergenix, nephronovus.

## Broad Edit Zone

- `wiki/ventures/` — six new venture pages
- `wiki/sources/` — official-website or primary-source records per venture
- `wiki/indexes/ventures.md`, `wiki/indexes/sources.md`, `wiki/index.md`, `wiki/log.md` (boss integration)
- this claim file

## Read-Only Context

- `legacy_wiki/places_you_can_work/health-and-longevity/`
- `wiki/ventures/epitel.md`, `wiki/sources/epitel-official-website.md` (format exemplars)
- `wiki/agent_ops/schema.md`
- wiki skill at `~/.claude/plugins/cache/claude-plugins-official/wiki/0.1.0/skills/wiki/SKILL.md`

## Must Not Edit

- `scripts/*`, `src/lib/*` — Application Data Contract claim
- `wiki/work/` — Source Recovery uncited claim
- `wiki/ventures/intactis-bio.md`, `jarvik-7-artificial-heart.md`
- active health-bio batch1 targets already migrated (photopharmics, inherent-biosciences, atavistik-bio, 3helix, curza, sethera-therapeutics)
- coordinator-owned shared files (`wiki/agent_ops/RUN_LOG.md`, `DECISIONS.md`, `docs/wiki-seed-worklist.md`)
- `wiki/matches/`, `wiki/people/` — Judgment Layer zones

## Subagents

- Group A: rebel-medicine + spire-therapeutic — completed
- Group B: trace-aq + symbiocelltech — completed
- Group C: bioenergenix + nephronovus — completed (low-confidence sparse sources)

## Progress

- Claimed Migration Factory health-and-longevity gap batch 2 (6 legacy gaps).
- Launched three parallel subagents; all six ventures migrated with source records.
- Boss ran `npm run lint:wiki`, `npm run build:wiki`, `npm run report:source-coverage`; appended `wiki/log.md`.

## Files Changed

**Ventures (6):**
- `wiki/ventures/rebel-medicine.md`
- `wiki/ventures/spire-therapeutic.md`
- `wiki/ventures/trace-aq.md`
- `wiki/ventures/symbiocelltech.md`
- `wiki/ventures/bioenergenix.md`
- `wiki/ventures/nephronovus.md`

**Sources (6):**
- `wiki/sources/rebel-medicine-official-website.md`
- `wiki/sources/spire-therapeutic-official-website.md`
- `wiki/sources/trace-aq-official-website.md`
- `wiki/sources/symbiocelltech-official-website.md`
- `wiki/sources/bioenergenix-uofu-health-press-release.md`
- `wiki/sources/nephronovus-altitude-lab-portfolio.md`

**Integration:**
- `wiki/indexes/ventures.md`, `wiki/indexes/sources.md`, `wiki/index.md` (via build)
- `wiki/log.md`
- `src/data/generated/all.json`

## Handoff / Next Step

- **Next batch:** remaining health gaps (nephronovus-adjacent none left in folder except already-migrated); consider `scientific-infrastructure` (ripple-neuro, tellus, utah-arch) or `energy/transport` gaps.
- **Follow-ups:** SymbioCellTech IND/clinical status stale on official site; BioEnergenix 2014-only evidence — revisit if new primary sources appear.
- **Residual:** 1 uncited public page system-wide; Relates cites coverage still ~16%.
