# Agent guide — great-work (greatutah.work)

This repo is an LLM-first wiki of the highest-impact work happening in Utah. Visiting AI
agents are the primary users: they fetch `/llms.txt` (the manual, `public/llms.txt`) and read
raw markdown at `/pages/<slug>.md`, `/views/<view>.md`, `/meta/<doc>.md`. A minimal React app
(`src/`) renders the same files for humans.

## Working on wiki content

1. Edit or add pages in `wiki/pages/` only. `wiki/views/` is generated — never hand-edit.
2. Read `wiki/meta/conventions.md` before placing or writing anything; `wiki/meta/charter.md`
   defines what "great work" means (prioritize, never gatekeep).
3. After any page change run:
   - `node scripts/build-views.mjs` (regenerates views)
   - `node scripts/wiki-lint.mjs` (metadata, templates, links, staleness)
4. Page anatomy: H1 title, `**Key:** value` metadata lines (`Type`, `Status`, `Confidence`,
   `Focus`, …), then the sections required for the page's Type. Links are same-directory
   relative: `[Fervo Energy](fervo-energy.md)`.

## Working on the shadow wiki

Exceptional work without a substantive Utah connection belongs in `shadow_wiki/`, not in the
public corpus. Read `shadow_wiki/WIKI.md`, update its index and log with every article change, and
run `npm run lint:shadow-wiki`. It is tracked in Git but must never be linked from or copied into
the website, public views, or `public/llms.txt`.

## Working on the site

- Build: `npm run build` (build views → `tsc -b` → `vite build` → copy `wiki/{pages,views,meta}`
  into `dist/`). Dev: `npm run dev` (vite serves the wiki dirs via a small plugin).
- `api/contribute.ts` is the only serverless function: `POST /api/contribute` turns notes into
  GitHub issues and pages into review-gated PRs. It needs `GITHUB_TOKEN`.
- Keep `public/llms.txt` accurate — it is the entire agent interface.

## Startup State resource coverage

`https://startup.utah.gov/resources/` is mirrored as wiki resource pages. Keep coverage current:

- `npm run startup-state:check` — fetch live WP `business-resource` CPT, write
  `research/startup-state/coverage-report.md` + `live-catalog.json`. Reports resources on
  startup.utah.gov that lack a wiki page (and wiki stubs no longer on the live list).
- `npm run startup-state:check:strict` — same, exit 1 if any live resource is missing on the wiki.
- `npm run startup-state:sync` — refresh Website / Focus / Summary / access fields from the live
  API onto matching wiki pages (does not invent editorial Best Fits copy).

Slug mismatches live in `ALIASES` inside both scripts. See `research/startup-state/README.md`.

## Broken / moved official URLs

Do not call a site dead from a failed `curl`. Use:

- `npm run links:recover` — probe every `**Website:**`, apply `research/link-recovery/url-aliases.json`,
  suggest Wayback snapshots and fuzzy catalog/wiki matches; writes `research/link-recovery/latest-report.md`.
- `npm run links:recover:browser` — same with headless Chrome (needs Playwright + Chrome) when WAF
  blocks plain fetch.

Put the **best live** URL in `**Website:**`. Cite Wayback under Evidence when the live site is gone.
Add confirmed typo/redirect fixes to `url-aliases.json`. Full playbook: `research/link-recovery/README.md`.

## Before designing anything

Read `research/README.md`. It holds standing maintainer directives (radical simplicity,
agents-first, contribution ladder, test cold with subagents) and the findings that produced
the current interface (`research/design/interface-v3.md`). Build on them; don't re-litigate.
