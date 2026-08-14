# Activity rollout — method, state, and how to resume

**Working directory for the corpus-wide Activity pass. Generated artifacts; the assigner rubric is
[`rubric.md`](rubric.md). The public explanation is [`wiki/meta/activity.md`](../../wiki/meta/activity.md).** This file is the ledger: if a session dies,
read it and continue. Nothing here is required to build the site.

## What this is

The tier list ranks how far something could move the world and says nothing about whether it is still
happening — so twelve of the thirteen S-tier pages are historical and a reader looking for something
to join hits the Golden Spike first. `**Activity:**` is the missing facet. 485 fact pages are in
scope, the same set the two tier ladders cover: 173 `venture`, 249 `resource`, 37 `work`, 13 `person`,
13 `helper`. The 401 `source` and 11 `guide` pages are out of scope by type.

Unlike the tier ladders, this pass is **research, not judgment**: a rater's job is to find the most
recent dated public artifact showing the work being done, and the label is derived from that date.
That is deliberate — thresholds can be re-cut later by re-running one script, without re-doing 485
page-hours of research.

## Layout

| Path | What |
|---|---|
| `rater-prompt.md` | The exact standing brief every rater gets. Relaunch from this, verbatim. |
| `{venture,resource,work,person,helper}.txt` | Per-type page manifests, one slug per line. |
| `batches/*.txt` | The 23 batches. Exhaustive and non-overlapping over all 485. |
| `results/*.tsv` | Rater output: `slug⇥value⇥signal-date⇥signal-kind⇥signal-url⇥note`. One TSV per batch. |
| `website-probe.tsv` | Mechanical pre-pass (generated, not in Git — regenerate any time). |
| `batch-index.json` | Batch sizes and types, for launch planning. |
| `findings.md` | Page problems the pass surfaced that are not activity problems. |

**Batch 01 and 02 are the 37 S- and A-tier pages, across every type.** The batches are ordered that
way on purpose: if the run is cut off, the pages a reader actually opens are already done.

## Method

1. **Pre-probe, mechanically.** `node scripts/probe-activity-signals.mjs` → `website-probe.tsv`.
   Records whether each `**Website:**` answers, the newest year its homepage mentions, and the newest
   date the page's cited sources carry. Triage only; a 200 is not a signal and the rubric says why.
2. **Research in batches.** One subagent per batch, working from `rater-prompt.md`. Raters append to
   their TSV **after every page**, so a killed agent leaves its completed work on disk, and skip slugs
   already present in their TSV, so a relaunch resumes instead of redoing.
3. **Apply centrally.** `node scripts/apply-activity.mjs` merges the TSVs, derives the label from the
   recorded dates, reports every disagreement between derived and rater label, and writes
   `**Activity:**` / `**Activity-checked:**` / `**Activity-signal:**` onto each page. Dry run by
   default, `--write` to edit. Raters never touch `wiki/` — conventions P5 precedent 10.
4. **Rebuild.** `node scripts/build-views.mjs && node scripts/build-search-index.mjs && node
   scripts/wiki-lint.mjs`, then `npm test`.

## State

Last resumed **2026-08-13 19:05 MDT**. Second wave finished **2026-08-13 19:14**. All 23 batches
reported. Do not re-rate.

- [x] Rubric written (`research/activity/rubric.md`); public explanation in `wiki/meta/activity.md`; three keys registered in `wiki/meta/attributes.md`
- [x] Mechanical probe written and run — 431/485 websites answer, 15 are 4xx/5xx, 5 unreachable, 34
      pages carry no `**Website:**` at all, and 52 live sites mention no year past 2024
- [x] 485 pages split into 23 batches, gems first
- [x] `rater-prompt.md` written
- [x] `scripts/apply-activity.mjs` written (dry-run only until the TSVs are complete)
- [x] Raters complete — **485 / 485**. Histogram: 420 active, 26 concluded, 22 dormant, 17 unknown.
      All TSVs pass field-count / active-URL / concluded-terminal checks. Findings in
      `research/activity/findings.md`.
- [x] Values applied 2026-08-13 (`node scripts/apply-activity.mjs --write`). Derived histogram:
      422 active, 26 concluded, 20 dormant, 17 unknown. Two calendar overrides:
      `futureready-utah` and `utif` (rater dormant → derived active).
- [x] One tier list; `active` pages marked `(active)` on the line (no second filtered view)
- [x] Human-facing indicator shipped (badge on pages; unmarked rows recede on the HTML tier list)
- [x] `public/llms.txt` and `AGENTS.md` updated

## Batch status

Regenerate this table any time with the coverage check below; it is a convenience, not the source of
truth. `results/` is the source of truth. Counts below are from 2026-08-13 19:09.

| batch | pages | type | landed |
|---|---|---|---|
| 01-gems | 19 | venture/work | **19/19** |
| 02-gems | 18 | venture/work | **18/18** |
| 03-venture | 20 | venture | **20/20** |
| 04-venture | 20 | venture | **20/20** |
| 05-venture | 20 | venture | **20/20** |
| 06-venture | 20 | venture | **20/20** |
| 07-venture | 20 | venture | **20/20** |
| 08-venture | 20 | venture | **20/20** |
| 09-venture | 20 | venture | **20/20** |
| 10-venture | 19 | venture | **19/19** |
| 11-work | 14 | work | **14/14** |
| 12-person | 13 | person | **13/13** |
| 13-helper | 13 | helper | **13/13** |
| 14-resource | 25 | resource | **25/25** |
| 15-resource | 25 | resource | **25/25** |
| 16-resource | 25 | resource | **25/25** |
| 17-resource | 25 | resource | **25/25** |
| 18-resource | 25 | resource | **25/25** |
| 19-resource | 25 | resource | **25/25** |
| 20-resource | 25 | resource | **25/25** |
| 21-resource | 25 | resource | **25/25** |
| 22-resource | 25 | resource | **25/25** |
| 23-resource | 24 | resource | **24/24** |

## Resuming after a dead session

`results/` is the durable state, and it is written incrementally, so a batch that died mid-run has
partial output that is still good. Check coverage first:

```sh
cat research/activity/results/*.tsv | cut -f1 | sort -u > /tmp/rated.txt
cat research/activity/batches/*.txt | sort -u > /tmp/all.txt
comm -13 /tmp/rated.txt /tmp/all.txt | wc -l     # pages still unrated
comm -13 /tmp/rated.txt /tmp/all.txt             # which ones
```

Then relaunch **only** the batches with missing slugs, handing each agent `rater-prompt.md` and its
batch name. Raters skip slugs already in their own TSV, so a relaunched batch picks up where it
stopped. Never re-rate a page that already has a line: it costs tokens and invites drift.

Sanity checks worth running on the merged output before applying:

```sh
# active rows with no signal URL — the one rule that must never break
awk -F'\t' '$2=="active" && $5==""' research/activity/results/*.tsv
# concluded rows without a terminal signal-kind
awk -F'\t' '$2=="concluded" && $4 !~ /^terminal:/' research/activity/results/*.tsv
# rubric gaps the raters reported
grep -h 'RUBRIC-GAP:' research/activity/results/*.tsv
```

`scripts/apply-activity.mjs` runs all three itself and refuses to write on the first.
