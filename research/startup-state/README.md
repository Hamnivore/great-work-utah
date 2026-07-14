# Startup State ↔ wiki coverage

Source of truth for the public directory: [startup.utah.gov/resources/](https://startup.utah.gov/resources/)
(WordPress CPT `business-resource`, JSON at `/wp-json/wp/v2/business-resource`).

## Commands

| Command | Purpose |
|---------|---------|
| `npm run startup-state:check` | Diff live catalog vs `wiki/pages/`; write `coverage-report.md` |
| `npm run startup-state:check:strict` | Same; **exit 1** if any live resource is missing on the wiki |
| `npm run startup-state:sync` | Pull live ACF fields onto matching wiki pages |

Artifacts land in this directory (`live-catalog.json`, `taxonomies.json`, `coverage-report.*`).

## Matching rules

1. Startup State numeric ID (`**Startup State ID:**` / CSV ID note) → wiki page
2. Exact slug match (`wiki/pages/<slug>.md`)
3. `ALIASES` map in `scripts/check-startup-state-resources.mjs` (and the sync script) for known
   spelling / `event-` prefix / punctuation differences (e.g. live `sillicon-slopes` → wiki
   `silicon-slopes`)

When check reports a **Missing on wiki** row that is really an existing page under another stem,
add an alias rather than duplicating the page.

## Orphans

Wiki stubs with a historical CSV ID that no longer appear on the live directory stay in the
report under “Wiki stubs not on current live list.” Do not delete them automatically — they may
still be useful; mark Status / Open Questions if the program shut down.
