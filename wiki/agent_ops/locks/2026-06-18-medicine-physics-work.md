# Work Claim: Medicine & Physics Historical Work Pages

**Status:** done
**Agent:** subagent-medicine-physics
**Started:** 2026-06-18 06:57 MST
**Updated:** 2026-06-18 07:20 MST

## Goal

Create 6 NEW historical `work/` pages about Utah medicine, biology, and physics achievements, verified/enriched against public web sources. Seeded from internal legacy material (provenance not mentioned on public pages).

## Owned Files / Folders

- `wiki/work/conotoxins-and-prialt.md`
- `wiki/work/intermountain-clinical-quality-improvement.md`
- `wiki/work/utah-array-bci-platform.md`
- `wiki/work/pons-fleischmann-cold-fusion.md`
- `wiki/work/harvey-fletcher-stereophonic-sound.md`
- `wiki/work/h-tracy-hall-diamond-presses.md`
- `wiki/sources/*.md` — only for especially strong primary sources (optional)
- `wiki/agent_ops/locks/2026-06-18-medicine-physics-work.md` (this file)

## Read-Only Context

- `docs/wiki-seed-worklist.md`
- `wiki/agent_ops/schema.md`
- `wiki/agent_ops/agents.md`
- `wiki/work/capecchi-gene-targeting.md`, `wiki/work/flys-eye-hires-cosmic-rays.md`
- `wiki/ventures/blackrock-neurotech.md`
- `wiki/guides/utah-deep-tech-map.md`
- legacy seed files under `legacy_wiki/great_work/medicine-and-biology/` and `legacy_wiki/great_work/physics-and-materials/`

## Must Not Edit

- `wiki/agent_ops/index.md`, `RUN_LOG.md`, `DECISIONS.md`
- `docs/wiki-seed-worklist.md`
- existing guides and any files claimed by other active agents
- Coordinator merges shared files.

## Plan

1. Read schema, exemplars, agents.md, seed files. (done)
2. Verify key facts/dates via public web sources.
3. Create the 6 work pages using the WORK template.
4. Validate headers, links, source quality.
5. Update this claim with results + suggested cross-links for the coordinator.

## Progress

- Read all format/context/seed files.
- Verified key facts/dates for all 6 topics via public web sources.
- Created all 6 work pages using the WORK template.
- Ran `npm run build:wiki` — 469 entries built, exit 0, my pages parse.

## Files Changed

- Created `wiki/work/conotoxins-and-prialt.md`
- Created `wiki/work/intermountain-clinical-quality-improvement.md`
- Created `wiki/work/utah-array-bci-platform.md`
- Created `wiki/work/pons-fleischmann-cold-fusion.md`
- Created `wiki/work/harvey-fletcher-stereophonic-sound.md`
- Created `wiki/work/h-tracy-hall-diamond-presses.md`
- No source pages created (used inline links; optional follow-up below).

## Handoff / Next Step

Coordinator should (shared files left untouched per parallel-work rules):

1. Add 6 index lines to `wiki/agent_ops/index.md` (see below).
2. Add cross-links into `guides/utah-deep-tech-map.md`:
   - Biology and Medical Devices section: conotoxins-and-prialt, intermountain-clinical-quality-improvement, utah-array-bci-platform.
   - Physics and Desert Instruments (or a new "Physics and Materials" entry): pons-fleischmann-cold-fusion (cautionary), harvey-fletcher-stereophonic-sound, h-tracy-hall-diamond-presses.
3. Add a cross-link from `ventures/blackrock-neurotech.md` to `work/utah-array-bci-platform.md` (foundational research page).

### Suggested index lines

- `work/conotoxins-and-prialt.md` — **Conotoxins and Prialt** — cone-snail venom peptides became a first-in-class non-opioid painkiller and a neuroscience toolkit.
- `work/intermountain-clinical-quality-improvement.md` — **Intermountain Clinical Quality Improvement** — a Utah health system engineered care delivery and exported the method worldwide.
- `work/utah-array-bci-platform.md` — **Utah Array BCI Platform** — the University of Utah microelectrode array that became the standard intracortical BCI tool.
- `work/pons-fleischmann-cold-fusion.md` — **Pons and Fleischmann Cold Fusion Announcement** — Utah's famous 1989 cautionary tale about announcing before verification.
- `work/harvey-fletcher-stereophonic-sound.md` — **Harvey Fletcher and Stereophonic Sound** — Provo-born physicist who founded psychoacoustics and gave the world stereo sound.
- `work/h-tracy-hall-diamond-presses.md` — **H. Tracy Hall's Diamond Presses** — synthetic-diamond pioneer who reinvented high-pressure presses at BYU.

### Open follow-ups

- Optional source pages: U of U "New Painkiller Was Born in Utah"; Elan FDA approval SEC filing; NeuroPort FDA 510(k) record.
- A `ventures/megadiamond.md` page would let the Hall page link its company lineage (currently plain text).
