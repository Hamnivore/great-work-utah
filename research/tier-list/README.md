# Tier list — method, state, and how to resume

**Working directory for the corpus-wide impact ranking. Generated artifacts; the normative rubric is
`wiki/meta/tiers.md`.** This file is the ledger: if a session dies, read it and continue.

## What this is

Charter probe E11 run at corpus scale. `wiki/meta/charter.md` says impact is displacement in joy;
`wiki/meta/tiers.md` turns that into a Smash-style ladder (`S`/`A`/`B`/`C`/`D`/`F`/`unranked`, with a
`*` hype-tier bump) that every fact page carries as `**Tier:**`. 485 fact pages are in scope — 173
`venture`, 249 `resource`, 37 `work`, 13 `person`, 13 `helper`. The 401 `source` and 11 `guide` pages
are out of scope by type: evidence artifacts and wiki apparatus displace nothing.

## Layout

| Path | What |
|---|---|
| `anchors.md` | Hand-placed calibration anchors that fix the scale for every rater. Read with `wiki/meta/tiers.md`. |
| `{venture,resource,work,person,helper}.txt` | Per-type page manifests, one slug per line. |
| `batches/*.txt` | The 15 subagent batches. Exhaustive and non-overlapping over all 485. |
| `results/*.tsv` | Rater output: `slug<TAB>tier<TAB>argument`, one line per page. One TSV per batch. |
| `adjudication.md` | Hand review of every `S`/`A`, boundary cases, and divergence found. |

## Method

1. **Rate in batches.** Subagents read `tiers.md` + `anchors.md` + their batch, and write one TSV
   each. They are forbidden from editing anything under `wiki/` — tiers are applied centrally, because
   concurrent agents editing this corpus have destroyed sourced work before (conventions P5 precedent
   10). Cheap fast models handle the `resource` shelf, which is formulaic; the `work` and `venture`
   batches carry the judgment and get stronger models.
2. **Adjudicate by hand.** Every `S` and `A` is re-reviewed centrally — they are few and they are the
   whole point of the ladder. Boundary and flag reports are resolved into `adjudication.md`.
3. **Apply centrally.** `scripts/apply-tiers.mjs` writes the `**Tier:**` line into each page from the
   merged TSVs.
4. **Rebuild.** `node scripts/build-views.mjs && node scripts/build-search-index.mjs && node
   scripts/wiki-lint.mjs`.

## State

- [x] Rubric written (`wiki/meta/tiers.md`), `Tier` registered in `wiki/meta/attributes.md`
- [x] Charter kept short: it carries the ladder and three rules, and points at `tiers.md`
- [x] 485 pages split into 15 batches
- [x] 15 rater subagents launched 2026-08-11
- [x] All 15 TSVs landed; coverage validated exact at 485/485, no conflicts
- [x] `S`/`A` adjudicated by hand — 3 demotions and one rubric fix, see `adjudication.md`
- [x] Tiers applied to all 485 pages; lint clean; 95 tests pass; build passes
- [x] `views/tier-list.md` generated; `tier:` on every index line; linked from the master index
- [x] `public/llms.txt` and the `wiki` skill updated
- [x] Rater reports reviewed for findings the TSVs did not carry; one under-specified ruling found
      (ruling 1 on multinationals with a Utah site) and fixed in `tiers.md`
- [ ] **Open, for a later session:** the framing defects the run surfaced — 12 shared atoms to merge,
      3 pages carrying two atoms, 2 titled for a global corporation while scoped to a Utah site, 8 with
      no established Utah presence, 4 type mismatches, 8 dead or stale URLs. All enumerated in
      `adjudication.md`. These are `conventions.md` questions, not tier questions, and none of them
      blocks the ladder.

## Resuming after a dead session

`results/` is the durable state. Check coverage first:

```
cat research/tier-list/results/*.tsv | cut -f1 | sort > /tmp/rated.txt
cat research/tier-list/*.txt | sort -u > /tmp/all.txt   # note: type manifests, not batches
comm -13 /tmp/rated.txt /tmp/all.txt                   # pages still unrated
```

Re-launch only the batches whose TSV is missing or short. Never re-rate a page that already has a
line: the ladder is supposed to be reproducible, but re-running raters costs tokens and invites drift.
