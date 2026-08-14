# Builder tier list — method and state

Corpus-wide rating of builder character visible in the work. Normative rubric:
`wiki/meta/builder-tiers.md`. This is independent of impact and founder-resource tiers.

## Method

- Scope: all 485 fact pages in the existing `research/tier-list/batches/*.txt` manifests.
- Raters write `slug<TAB>tier<TAB>argument` into `results/*.tsv` and never edit `wiki/`.
- The coordinator rates the first batch, adjudicates all S/A ratings and the largest impact gaps,
  then applies centrally with `node scripts/apply-builder-tiers.mjs --write`.
- The generated view leads with active hidden gems: Builder S/A with impact C or below.

## State

- [x] Rubric written and attribute registered
- [x] First 29-page calibration batch rated centrally
- [x] Remaining batches rated by subagents
- [x] Every S/A and large-gap call centrally reviewed; venture batches re-audited after five
      slug/argument mismatches exposed a packaging failure, producing 14 corrections
- [x] Ratings applied centrally to all 485 fact pages
- [x] Builder view generated with 30 active hidden gems
- [x] Wiki lint: 0 errors; tests: 99/99; production build passes

The original impact batch files are reused as immutable manifests; duplicating 15 copies here would
create a second inventory that could drift.
