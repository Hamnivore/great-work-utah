# Work Claim: S-Tier Ventures Backfill

**Status:** done
**Agent:** Claude (Cursor)
**Started:** 2026-05-09 08:10 MDT
**Updated:** 2026-05-09 08:35 MDT

## Goal

Backfill the new `wiki/ventures/` directory with the six S-tier entries from the legacy `legacy_wiki/places_you_can_work/` list that are not yet present, and find license-clean (or clearly-attributed) hero images for all eleven S-tier ventures so each page can render at the magazine layout.

## Owned Files / Folders

- `wiki/ventures/zanskar-geothermal.md` (new)
- `wiki/ventures/merit-medical.md` (new)
- `wiki/ventures/blackrock-neurotech.md` (new)
- `wiki/ventures/sci-institute.md` (new)
- `wiki/ventures/sundance-institute.md` (new)
- `wiki/ventures/familysearch.md` (new)
- `wiki/ventures/recursion-pharmaceuticals.md` (Hero only)
- `wiki/ventures/fervo-energy.md` (Hero only)
- `wiki/ventures/fortem-technologies.md` (Hero only)
- `wiki/ventures/hexcel.md` (Hero only)
- `wiki/ventures/space-dynamics-laboratory.md` (Hero only)
- `wiki/sources/` source records for new ventures
- `wiki/guides/find-meaningful-work.md` (link in new entries)
- `wiki/agent_ops/index.md` (one-liners + count refresh)
- `wiki/agent_ops/RUN_LOG.md` (run entry)

## Read-Only Context

- `docs/wiki-seed-worklist.md`
- `wiki/agent_ops/agents.md`
- `wiki/agent_ops/schema.md`
- `legacy_wiki/places_you_can_work/`

## Must Not Edit

- files claimed by other active agents (none currently overlap)

## Plan

1. Read the six legacy S-tier entries to seed prose.
2. Find a real, license-clean (or clearly attributable) hero image per venture; fall back to `picsum.photos` seeds and note the gap in `Open Questions`.
3. Write new venture pages in the prose-first schema (no universal tier on the page; tier-style judgment goes in the meaningful-work guide).
4. Add a `**Hero:**` line to each existing S-tier page where one is missing.
5. Add at least one source page per new venture for traceability.
6. Refresh `guides/find-meaningful-work.md` to mention the six new anchors.
7. Update `wiki/agent_ops/index.md` (entries + counts).
8. Append a run-log entry.

## Progress

- 2026-05-09 08:10 MDT: Claim opened; legacy S-tier entries identified (Zanskar Geothermal, Merit Medical, Blackrock Neurotech, SCI Institute, Sundance Institute, FamilySearch).
- 2026-05-09 08:35 MDT: Run complete. Six new venture pages written; Hero + Pull added to all eleven S-tier ventures (three real Wikimedia photos with attribution, eight `picsum.photos` placeholders flagged in Open Questions); six source-record pages added; meaningful-work guide rewritten to cover all eleven; index and seed worklist updated.

## Files Changed

- Created: `wiki/ventures/zanskar-geothermal.md`, `wiki/ventures/merit-medical.md`, `wiki/ventures/blackrock-neurotech.md`, `wiki/ventures/sci-institute.md`, `wiki/ventures/sundance-institute.md`, `wiki/ventures/familysearch.md`.
- Created: `wiki/sources/zanskar-mit-technology-review.md`, `wiki/sources/merit-medical-pentax-cryoballoon-acquisition.md`, `wiki/sources/blackrock-utah-array-medical-design.md`, `wiki/sources/sci-institute-official-site.md`, `wiki/sources/sundance-institute-official-site.md`, `wiki/sources/familysearch-official-site.md`.
- Updated: `wiki/ventures/recursion-pharmaceuticals.md`, `wiki/ventures/fervo-energy.md`, `wiki/ventures/fortem-technologies.md`, `wiki/ventures/hexcel.md`, `wiki/ventures/space-dynamics-laboratory.md` (Hero + Pull + Open Question refresh).
- Updated: `wiki/guides/find-meaningful-work.md`.
- Updated: `wiki/agent_ops/index.md` (entries + counts + gap note).
- Updated: `docs/wiki-seed-worklist.md` (item 1 progress note).
- Updated: `wiki/agent_ops/RUN_LOG.md` (run entry appended).

## Handoff / Next Step

- Source approved company photographs for the eight ventures still on `picsum.photos` placeholders: Recursion, Fervo, Fortem, Hexcel, Merit Medical, Blackrock Neurotech, SCI Institute, Zanskar Geothermal.
- Sweep A-tier legacy entries into `wiki/ventures/` next: Ripple Neuro, Intan Technologies, Strider Technologies, IMSAR, Vector, Energy Fuels White Mesa.
- Reconcile the legacy `legacy_wiki/places_you_can_work/scientific-infrastructure/sci-institute.md` tier-line discrepancy (file says A; README and PLAN say S).
- Run `npm run build:wiki` to verify the new pages render at the magazine layout once a coordinator merges parallel claims.
