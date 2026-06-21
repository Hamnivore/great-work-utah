# Work Claim: Migration Factory — Biological Engineering Gap Batch

**Status:** done
**Agent:** Cursor boss agent
**Started:** 2026-06-19 15:30 MDT
**Updated:** 2026-06-19 15:45 MDT

## Goal

Migrate four high-value `legacy_wiki/places_you_can_work/biological-engineering/` entries into source-first `wiki/ventures/` pages with matching `wiki/sources/` records: curza, 3helix, evolution-bio, calycia-biosciences.

## Broad Edit Zone

- `wiki/ventures/curza.md`, `3helix.md`, `evolution-bio.md`, `calycia-biosciences.md` (new)
- `wiki/sources/` — official-website or primary-source records for each
- `wiki/indexes/ventures.md`, `wiki/indexes/sources.md`, `wiki/index.md`, `wiki/log.md` (boss integration)
- this claim file

## Read-Only Context

- `legacy_wiki/places_you_can_work/biological-engineering/`
- `wiki/ventures/epitel.md`, `wiki/sources/epitel-official-website.md` (format exemplars)
- `wiki/agent_ops/schema.md`
- wiki skill at `~/.claude/skills/wiki/SKILL.md`

## Must Not Edit

- `wiki/agent_ops/RUN_LOG.md`, `DECISIONS.md`, `docs/wiki-seed-worklist.md`
- `scripts/*`, `src/lib/*` — Application Data Contract claim
- `wiki/work/`, `wiki/ventures/intactis-bio.md`, `jarvik-7-artificial-heart.md` — Source Recovery uncited claim
- `wiki/matches/`, `wiki/people/` — Judgment Layer zones

## Subagents

- Antibiotics batch: curza + calycia-biosciences
- Platform batch: 3helix + evolution-bio

## Progress

- Claimed Migration Factory biological-engineering slice (56 legacy gaps remain overall).
- Launched two parallel subagents (curza+calycia, 3helix+evolution-bio); boss integrated indexes and ran checks.
- `npm run lint:wiki`: 494 files, 0 errors, 0 warnings.
- `npm run build:wiki`: 494 entries, ventures=67, sources=142.
- `npm run build:wiki:skill-index`: refreshed sharded indexes.

## Files Changed

**Ventures (new)**
- `wiki/ventures/curza.md`
- `wiki/ventures/3helix.md`
- `wiki/ventures/evolution-bio.md`
- `wiki/ventures/calycia-biosciences.md`

**Sources (new)**
- `wiki/sources/curza-official-website.md`
- `wiki/sources/3helix-official-website.md`
- `wiki/sources/calycia-biosciences-official-website.md`
- `wiki/sources/evolution-bio-english-lab.md`
- `wiki/sources/evolution-bio-vegas-cell-paper.md`

**Integration**
- `wiki/index.md`, `wiki/indexes/ventures.md`, `wiki/indexes/sources.md`
- `wiki/log.md`
- `src/data/generated/all.json`

## Handoff / Next Step

- **Legacy gap backlog** — ~52 `places_you_can_work` entries still lack venture pages; next batches: remaining biological-engineering (sethera-therapeutics, thera-t-pharmaceutics, bioparin), health-and-longevity (atavistik-bio, inherent-biosciences), or scientific-infrastructure (ripple-neuro, sci-institute gaps).
- **Evolution Bio** — no confirmed company website; discovery-evolution.com rebrand unverified; Eli Lilly/Kallyope partnerships unverified.
- **Curza/CaLycia** — grant and investor claims from legacy intake need dedicated press-release source pages for higher confidence.
- **Hero images** — all four pages use picsum placeholders.
