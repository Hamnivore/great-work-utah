# Agent guide — great-work (greatutah.work)

This repo is an LLM-first wiki of the highest-impact work happening in Utah. Visiting AI
agents are the primary users: they fetch `/llms.txt` (the manual, `public/llms.txt`) and read
raw markdown at `/pages/<slug>.md`, `/views/<view>.md`, `/meta/<doc>.md`. A minimal React app
(`src/`, routes `/`, `/p/:slug`, `/v/:view`, `/map`, `/contribute`) renders the same files for
humans.

## Layout

- `wiki/pages/` — the corpus, one flat namespace, ~600 markdown files. **The only thing
  contributors edit.**
- `wiki/meta/` — the schema: `conventions.md` (principles + precedents for placement),
  `attributes.md` (metadata registry), `charter.md` (what "great work" means; used to
  prioritize, never to gatekeep).
- `wiki/views/` — **generated, never hand-edited**: master index, type indexes, the needs
  board, sector hubs, by-region.

## URL scheme (production)

`/pages/<slug>.md`, `/views/<view>.md`, `/meta/<doc>.md` — static files, copied into `dist/`
at build time. `/llms.txt` is the manual. `POST /api/contribute` is the single write endpoint.

## Working on wiki content

1. Read `wiki/meta/conventions.md` before placing or writing anything. Reason from its
   principles and report any case they fail to decide — ambiguity reports are how the schema
   improves.
2. Edit or add pages in `wiki/pages/` only. Never touch `wiki/views/` by hand.
3. After any page change run both of:
   - `node scripts/build-views.mjs` (regenerates views)
   - `node scripts/wiki-lint.mjs` (metadata, templates, links, staleness)
4. Page anatomy: H1 title, then bold-prefix metadata (`**Type:**`, `**Status:**`,
   `**Confidence:**`, `**Focus:**`, `**Domain:**` primary-first, `**Region:**`,
   `**Needs-reviewed:**` — see `wiki/meta/attributes.md`), then the sections required for the
   page's Type. Links are same-directory relative: `[Fervo Energy](fervo-energy.md)`. Links to
   pages that *should* exist are allowed — lint feeds them to the wanted queue.
5. Prefer official/primary sources; press releases are leads, not proof. Cite `Type: source`
   pages from Evidence sections.
6. Domain/Region attribution is mid-rollout. When you touch a page, attribute it.

## Working on the site

- Build: `npm run build` (build views → build locations → `tsc -b` → `vite build` → copy
  `wiki/{pages,views,meta}` into `dist/`). Dev: `npm run dev` (vite serves the wiki dirs via a
  small plugin). Tests: `npm test`.
- `api/contribute.ts` turns notes into GitHub issues and pages into review-gated PRs; it needs
  `GITHUB_TOKEN`. `api/locations.ts` serves proximity search.
- Keep `public/llms.txt` accurate — it is the entire agent interface.

## Startup State resource coverage

`https://startup.utah.gov/resources/` is mirrored as wiki resource pages. Keep coverage current:

- `npm run startup-state:check` — fetch the live WP `business-resource` CPT and write
  `research/startup-state/coverage-report.md` + `live-catalog.json` (both generated, not in
  Git). Reports live resources that lack a wiki page, and wiki stubs no longer listed.
- `npm run startup-state:check:strict` — same, exit 1 if any live resource is missing.
- `npm run startup-state:sync` — refresh Website / Focus / Summary / access fields from the live
  API onto matching wiki pages (does not invent editorial Best Fits copy). Needs a catalog, so
  run `:check` first.

Slug mismatches live in `ALIASES` inside both scripts. See `research/startup-state/README.md`.

## Broken / moved official URLs

Do not call a site dead from a failed `curl`. Use:

- `npm run links:recover` — probe every `**Website:**`, apply
  `research/link-recovery/url-aliases.json`, suggest Wayback snapshots and fuzzy catalog/wiki
  matches; writes a report (generated, not in Git).
- `npm run links:recover:browser` — same with headless Chrome (needs Playwright + Chrome) when a
  WAF blocks plain fetch.

Put the **best live** URL in `**Website:**`. Cite Wayback under Evidence when the live site is
gone. Add confirmed typo/redirect fixes to `url-aliases.json`. Playbook:
`research/link-recovery/README.md`.

## Before interface / navigation / contribution work

Read `research/README.md` first — it records the standing maintainer directives (radical
simplicity, agents-first, contribution ladder, test cold with subagents) and the cold-agent
findings behind the current design. `research/design/interface-v3.md` is the interface spec;
don't re-litigate decisions recorded there.
