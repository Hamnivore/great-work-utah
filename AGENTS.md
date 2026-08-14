# Agent guide — great-work (greatutah.work)

This repo is an LLM-first wiki of the highest-impact work happening in Utah. Visiting AI
agents are the primary users: they fetch `/llms.txt` (the manual, `public/llms.txt`) and read
raw markdown at `/pages/<slug>.md`, `/views/<view>.md`, `/meta/<doc>.md`.

Every one of those documents is **also** published as static HTML — `/p/<slug>`, `/v/<view>`,
`/about` — prerendered at build time by `scripts/prerender.mjs`. That layer is not a
concession to human visitors; it is how agents that arrive through a search index rather than
through `/llms.txt` reach the corpus at all. Read
`research/design/static-html-is-the-second-half.md` before changing or removing it.

A small React app (`src/`) now covers only the three routes that need to run code: `/`,
`/contribute`, `/map`.

## Layout

- `wiki/pages/` — the corpus, one flat namespace, ~900 markdown files. **The only thing
  contributors edit.**
- `wiki/meta/` — the schema: `conventions.md` (principles + precedents for placement),
  `attributes.md` (metadata registry), `charter.md` (what "great work" means; used to
  prioritize, never to gatekeep), `tiers.md` (the impact ladder — read before assigning a `**Tier:**`),
  `activity.md` (what `(active)` means on the list).
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
3. After any page change run all three of:
   - `node scripts/build-views.mjs` (regenerates views)
   - `node scripts/build-search-index.mjs` (regenerates the browse index + the API's corpus)
   - `node scripts/wiki-lint.mjs` (metadata, templates, links, staleness)
4. Page anatomy: H1 title, then bold-prefix metadata (`**Type:**`, `**Status:**`,
   `**Confidence:**`, `**Focus:**`, `**Domain:**` primary-first, `**Region:**`,
   `**Needs-reviewed:**` — see `wiki/meta/attributes.md`), then the sections required for the
   page's Type. Links are same-directory relative: `[Fervo Energy](fervo-energy.md)`. Links to
   pages that *should* exist are allowed — lint feeds them to the wanted queue.
   Fact pages also carry `**Tier:**` and `**Activity:**` (applied centrally, not guessed).
   An optional `## Maintainer Notes` may appear only as the final level-two section. Put
   editorial state, migration/internal-provenance notes, presentation tasks, and wiki cleanup
   instructions there. Keep reader-relevant uncertainty in `## Open Questions`, source
   limitations in `## Reliability Notes`, and never treat Maintainer Notes as evidence.
5. Prefer official/primary sources; press releases are leads, not proof. Cite `Type: source`
   pages from Evidence sections.
6. Domain/Region attribution is mid-rollout. When you touch a page, attribute it.
7. Every fact page carries a `**Tier:**` — the impact ladder, `S` through `F` plus `unranked`, rubric
   and nine rulings in `wiki/meta/tiers.md`. A new page needs one; `unranked` is the honest answer when
   the page is too thin to argue bounds from. `B` or above requires an `## Impact` section, and lint
   enforces it. Tier ranks how far something could move the world, not whether that's good or bad,
   and is independent of Confidence.
   Assigning tiers in bulk: rate with subagents that write TSVs and never touch `wiki/`, then apply
   centrally with `node scripts/apply-tiers.mjs` (dry run by default, `--write` to edit). The first
   corpus-wide run, its method, and the page-framing defects it surfaced are in `research/tier-list/`.
8. Every `resource` and `helper` page **also** carries a `**Founder-tier:**` — a second, independent ladder
   asking what the thing hands a founder rather than what it displaces in the world, rubric in
   `wiki/meta/founder-tiers.md`. It exists because impact ruling 5 correctly crushes the whole resource
   shelf to D and F, which is useless for "what should I actually use." Vocabulary is the same letters plus
   `n/a` (serves a different audience entirely — a hospital, a school) and no `*` bump. The two ladders are
   expected to disagree in both directions; never derive one from the other. `B` or above requires a
   `## What It Provides` (resources) or `## Who They Help` (helpers) section, and lint enforces it.
   Same bulk workflow, different script: `node scripts/apply-founder-tiers.mjs`, reading
   `research/founder-tier-list/results/`. That directory also records the duplicate-page sets the ranking
   pass surfaced.
9. Every fact page also carries `**Activity:**` — whether the *subject* is still being done (`active` /
   `dormant` / `concluded` / `unknown`), independent of Tier and of Status. The public explanation is
   `wiki/meta/activity.md`. The assigner rubric (signals, thresholds, eight rulings) is
   `research/activity/rubric.md`. Views print live ones as `(active)` next to the name; unmarked means
   not currently happening, or not yet checked. `active` needs a dated public artifact in
   `**Activity-signal:**`. Do not invent a value when touching a page: missing is the honest unchecked
   state. Corpus-scale assignment is the same bulk workflow as the ladders: `research/activity/results/`
   TSVs, then `node scripts/apply-activity.mjs`.
10. Every fact page also carries `**Builder-tier:**` — a separate S-through-F ladder asking what
    builder character is visible in the work under a maximum-faith reading. It measures specific
    conviction, agency, craft, costly commitment, endurance, chosen leverage, and community
    formation; it never claims to know private morality or intrinsic worth, and absent signal is not
    negative evidence. Read `wiki/meta/builder-tiers.md` before assigning it. Corpus-scale ratings
    live in `research/builder-tier-list/results/` and are applied centrally with
    `node scripts/apply-builder-tiers.mjs`; subagents never edit pages for this judgment.

## Working on the site

- `vercel.json` sets `"cleanUrls": true`: that is what maps the prerendered
  `dist/p/<slug>.html` onto `/p/<slug>` and 308s the `.html` form away, so every content route
  resolves straight from the filesystem with no SPA rewrite — and an unknown slug returns a
  real 404 instead of a 200 shell. The React routes `/map` and `/contribute` are the same
  pattern: prerender copies the Vite `index.html` shell to `dist/map.html` and
  `dist/contribute.html`. Under `cleanUrls`, rewrite destinations must omit `.html`
  (`/index`, not `/index.html`) or they 404. Markdown paths (`/pages|views|meta/*.md`) carry
  an HTTP `Link` canonical to their HTML twin via `routes` (capture `$1` — the high-level
  `headers` array does not interpolate path captures into values). The master index is the one
  exception: `cleanUrls` serves an index document at its directory URL, so it is prerendered to
  `dist/v.html` and published at bare `/v`. `/v/index` is therefore a 308 to `/v`, and
  `/views/index.md` needs its own canonical `routes` entry ahead of the generic one (which
  excludes `index` by lookahead so a path never collects two `Link` headers). Note the file is
  schema-validated on deploy and rejects unknown keys, so it cannot carry comments; document
  routing changes here instead.
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

## Identifiers (the registry join key)

`**Identifiers:**` (`cik`, `ein`, `ror`, `uei`, …) is what turns "find a primary source for this
company" into a fetch instead of a search. Resolve them with the script, never by memory:

- `npm run identifiers` — dry run; proposes candidates and writes
  `research/raw-data/identifier-resolution.md` (generated, not in Git).
- `npm run identifiers:write` — applies **only** matches it could corroborate by name against the
  registry's own record. Never overwrites an identifier a page already carries.
- `npm run identifiers:audit` — re-derives identifiers the corpus already has and reports
  agreement. Run this after changing the matching rules; it is the only guard on precision.

A wrong key is worse than no key: every later harvest inherits it, and nothing downstream can tell a
corroborated identifier from a guessed one. Anything ambiguous goes to the report for adjudication —
recording nothing and saying why in `## Open Questions` is a finished page, not an unfinished one.

Two traps the audit found. **A registry's state is corroboration, not a requirement** — Fervo files
from Houston and drills in Beaver County, so demanding a Utah address rejects correct matches.
**Prefer the entity's own registrant over its parent**: a subsidiary page carrying the acquirer's
CIK will hand a harvester the parent's consolidated financials (see `blue-raven-solar.md`).

## Promoting a lead to a page

A list of companies is not a list of pages. **A live website is necessary and not sufficient** — a
lead earns a page only with a live site *plus* at least one corroborating public record independent
of the company's own site: a funding announcement, a state registration, an App Store or Product Hunt
listing with real traction, named customers, or independent press.

`node scripts/probe-venture-leads.mjs --in leads.tsv --out report.md` establishes the mechanical half.
It re-probes each site (separating live from thin, parked, and dead) and searches SEC EDGAR for a
matching **registrant**, which is what a funded startup leaves behind. Input is a bare
`host<TAB>name` TSV, deliberately, so the provenance of a lead list never reaches the script or its
output.

Read the results with the name-collision problem in view: "Finch", "Ember", "Horizon", "Alto",
"Quill", and "Paloma" all match much larger companies in both EDGAR and the App Store, so an exact
name match still needs the state and the filing checked before it counts.

**A lead that fails the bar stays a lead. That is a finished result, not a gap** — write the verdict
into the queue file so the next agent does not re-derive it.

## Before interface / navigation / contribution work

Read `research/README.md` first — it records the standing maintainer directives (radical
simplicity, agents-first, contribution ladder, test cold with subagents) and the cold-agent
findings behind the current design. `research/design/interface-v3.md` is the interface spec;
don't re-litigate decisions recorded there.
