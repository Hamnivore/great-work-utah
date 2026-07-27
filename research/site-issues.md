# Site issues — open tracker

Living list of bugs and rough edges observed on the live site or in local runs. Add a dated note when you hit something; mark fixed when solved. For experiment writeups, use `findings/`.

## Open

### Cursor harness: Anthropic/OpenAI Task API quota blocked cross-model probes

- **Seen:** 2026-07-14 · harness: Cursor Task subagent
- **Where:** Task launches with `claude-sonnet-5-thinking-high`, `claude-4.5-sonnet-thinking`, `gpt-5.6-sol-medium`, `gpt-5.2-codex`
- **What:** Immediate fail: `API usage limit reached Switched to composer-2.5 after reaching API limit.` Zero wiki fetches on those models. Grok + Composer Task launches still start.
- **Impact:** Cannot complete planned 3×3 provider matrix until quota recovers.
- **Next check:** Re-run Claude/OpenAI legs when quota available; see `research/findings/model-harness-probes-2026-07-14.md`.

### Needs: synonym / filter gaps remain (careers coverage now done)

- **Seen:** 2026-07-14 · harness: Cursor
- **Where:** `/views/needs.md`, venture pages
- **What:** Synonym/filter gaps remain (no skill clustering).
- **Partial fix:** 2026-07-14 — careers pass complete: `**Careers:**` on 75/114 needs pages (every venture/helper/resource with a real hiring surface; all URLs curl-verified 200). The 40 without carry an Open Questions note saying why (no board exists, domain dead, email-only hiring). Conventions now pin the rules: Careers = the org's general careers page or own ATS board, for the *human* applicant (JS-rendered fine; never a single posting, aggregator, or raw ATS API endpoint), and needs prose stays at role-family level — board-snapshot role lists were rewritten out of ~45 pages. Dead links fixed en route: L3Harris Evidence URLs (post-restructure), Fortem Paylocity board, FamilySearch jobs path, Culmination/ASI/Baxter/Intactis/Hypercraft/Varda `**Website:**` fields that pointed at news articles or dead domains.
- **Verified on prod:** 2026-07-14 — 3 cold Sonnet probes (RF/biotech/machinist), 3/3 pass: zero guessed `/careers`, zero dead links, no-careers notes routed agents to warm outreach. See `findings/2026-07-14-careers-probes.md`.
- **Next check:** Skill clustering / synonym gloss; multi-model re-run (E6).

### Proximity API rejects real place names outside anchor list

- **Seen:** 2026-07-14 (machinist careers probe · Claude Sonnet subagent)
- **Where:** `/api/locations?near=Spanish+Fork&radius_miles=40&type=venture`
- **What:** HTTP 400 `INVALID_QUERY` — only 15 geocoding anchors (beaver…st george). Error text does say "use lat/lon", but the probe abandoned the endpoint instead of retrying. Agents will try real towns.
- **Next check:** More anchors (Spanish Fork, Springville, Lindon, American Fork…) or geocode fallback; or teach llms.txt the lat/lon form.

### Capital stubs + Focus sludge; empty capital-programs hub

- **Seen:** 2026-07-14 · harness: Cursor
- **Where:** capital guide, stubs, `domain-capital-programs`
- **What:** SaaS equity path dead-ends at Low stubs; Focus CSV sludge.
- **Next check:** Medium Draft Album/Kickstart/Peterson; Focus cleanup.

### Contribution from an HTML arrival is untested

- **Seen:** 2026-07-27 · `findings/2026-07-27-html-arrival-probe.md`
- **Where:** the prerendered `/p/*` layer
- **What:** the cold probe that arrived on an HTML page found the manual, the views, and the trust doc, and cited the site — but never contributed, because the scenario contained no gap the corpus was missing. So the ladder is unvalidated on this arrival path.
- **Next check:** re-run the HTML-arrival probe with a scenario containing a real public gap (contribute-freely branch).

### Pages self-flag unfinished work while being used for real decisions

- **Seen:** 2026-07-27 (cold probe, unprompted criticism)
- **Where:** `fervo-energy`, `rodatherm-energy`, `zanskar-geothermal`, others
- **What:** Open Questions on load-bearing pages name uncleared hero-image rights and unresolved facts ("has the pilot produced first power?"). Honest, but these pages route career decisions.
- **Next check:** corpus-priority call — close Open Questions on high-traffic pages before writing new ones.

### No per-page OpenGraph image; hero images not deployed

- **Seen:** 2026-07-27
- **Where:** prerendered pages
- **What:** shared links render as text-only cards. `**Hero:**` paths (`/img/heroes/...`) have no deployed images, so heroes are not rendered at all.
- **Next check:** decide whether heroes ship (rights are unresolved on several) or whether the field should be retired.

### No `Stub + High` precedent exists

- **Seen:** 2026-07-27
- **Where:** `wiki/meta/attributes.md`
- **What:** the new Status/Confidence rubric documents Stub+High as a worked example, but no page has that shape — all 8 Stubs are Low. The example is an illustration, not a precedent, which is weaker than conventions.md's house standard.
- **Next check:** write one such page (a program page: name, bill number, one Evidence line to the enrolled statute).

### Domain attribution still incomplete; Utah Valley geo buckets confusing

- **Seen:** 2026-07-14
- **Where:** sector hubs, `by-region`
- **What:** Many ventures still lack Domain; “Utah Valley” heading ≠ Provo/Lehi company list intuition.
- **Partial fix:** Round 3 Domain on RF/bio/SaaS + FamilySearch, SCI, Adobe, Merit, Hexcel, Northrop.
- **Next check:** Keep attribution; consider Utah Valley rollup note.

### Hire-your-own-team intent inverted

- **Seen:** 2026-07-14 (human founder / job seeker)
- **Where:** `/`, nav
- **Partial fix:** 2026-07-27 — full-text search shipped for both audiences (below), which is the half of this that was about finding things.
- **What remains:** “Looking for work” / Needs = other orgs’ talent needs — founders trying to hire for *their* company still hit a job board for someone else.
- **Next check:** optional “hiring?” copy under founding.

## Fixed / closed (2026-07-27)

### Every `/p/*` and `/v/*` URL served identical contentless HTML

- **Fixed:** 2026-07-27 — `scripts/prerender.mjs` emits static HTML for all 638 documents with unique titles, descriptions, canonical, OpenGraph, JSON-LD, and a markdown `rel=alternate`. Verified 616/616 unique titles and descriptions. Rationale and what would falsify it: `design/static-html-is-the-second-half.md`.

### No full-text search

- **Fixed:** 2026-07-27 — `/search` for humans (static index, 260KB) and `GET /api/search` for agents: exact-phrase grep over full page text with `section=`, `type=`, `limit`, `hits_per_page`. This is the grep endpoint `design/interface-v3.md` specified and never shipped (E3 remainder). `/api/grep` aliases it. Verified against the 2026-07-09 missed gem: `q=drilling engineers&section=what-they-need-now` returns Rodatherm.

### Soft `/p/*` 200 SPA; soft-404

- **Fixed:** 2026-07-27 — `cleanUrls` resolves `/p/<slug>` from the filesystem, so an unknown slug is a real 404 serving a recovery page with human doors and agent entry points.

### Sitemap / SEO skewed to agent paths

- **Fixed:** 2026-07-27 — the sitemap is now emitted by the prerenderer, the only step that knows every shipped URL: 1,281 entries covering `/p/`, `/pages/`, `/v/`, `/views/`, `/meta/`, `/about`, `/charter`, `/conventions`, `/attributes`, `/search`, `/contribute`, `/map`.

### Indexed `/raise-hand` returned 404

- **Fixed:** 2026-07-27 — 308 to `/contribute`.

### No transparency, no correction policy, no privacy notice

- **Fixed:** 2026-07-27 — `wiki/meta/about.md`, published at `/about` and `/meta/about.md`: maintainer, review gate, funding (none), Confidence rubric, coverage skew stated plainly, corrections, and exactly what `/api/contribute` publishes and where. A cold probe read it and downgraded its own claims accordingly.

### `/api/contribute` unauthenticated and unthrottled

- **Fixed:** 2026-07-27 — 64KiB body cap, per-instance rate limiting (request + write buckets), duplicate suppression, spam heuristics calibrated so no real wiki page trips them. `llms.txt` documents the 413/429 so agents recover.

### Status vocabulary did not match the corpus; Confidence had no rubric

- **Fixed:** 2026-07-27 — Status is now `Stub · Draft · Useful` (page maturity, explicitly not fact verification; `Reviewed` retired, never used). Confidence has a published rubric graded to the weakest load-bearing claim. Lint enforces both vocabularies. 5 off-vocabulary pages migrated individually.

### No security headers

- **Fixed:** 2026-07-27 — CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `frame-ancestors 'none'`. Verified no CSP violations across `/`, `/search`, `/p/*`, `/map`, `/contribute` in headless Chrome.

## Fixed / closed (selected, round 3)

### Evidence / WebFetch strip — plaintext URLs in wiki source

- **Fixed:** 2026-07-14 — Evidence/See Also/Relates append bare `https://greatutah.work/pages/…` + external source URLs in **source** markdown; `**Website:**` / `**Careers:**` bare metadata; needs board surfaces them. `npm run urls:plaintext`.

### Contribute schema aliases for Cursor harness briefs

- **Fixed:** 2026-07-14 — `POST /api/contribute` accepts `type`∈{note,page} as `kind`, and `body`/`note`/`message`/`text` as `content`; paths may omit `.md`.

### Silicon Slopes typo was canonical slug

- **Fixed:** 2026-07-14 — page renamed to `silicon-slopes`; typo slug 308s into correct spelling (was the reverse).

### Day-1 founder / job-seeker entrypaths unclear

- **Fixed:** 2026-07-14 — `llms.txt` first-visit procedures; master index lead-ins; human nav labels; Main Street → `find-business-services` + `by-region`.

### First paint / no-JS was agent-first

- **Fixed:** 2026-07-14 — `index.html` SSR leads with looking for work / founding / contribute; agents secondary. SPA 404 + static 404 recover to human doors.

### Sector hubs missed RF / bio / SaaS employers

- **Fixed:** 2026-07-14 (partial) — Domain on IMSAR, Fortem, L3Harris, SDL, Recursion, Teal, Wavetronix, Vector, Halia, Epitel, Qualtrics, Instructure, FamilySearch, SCI, Northrop Promontory, Merit, Hexcel, Adobe.

### by-region hid non-Domain pages (Cedar / Moab / Iron)

- **Fixed:** 2026-07-14 — by-region includes every page with `**Region:**`.

### helpers view omitted free mentor layer

- **Fixed:** 2026-07-14 — helpers intro + Type blurb point to `find-an-advisor` / SCORE-SBDC as resources · [#72](https://github.com/Hamnivore/great-work-utah/issues/72).

### Needs lines omitted location

- **Fixed:** 2026-07-14 — region on needs board lines when `**Region:**` is set.

### Advisor guide IP routing incomplete

- **Fixed:** 2026-07-14 — Maschoff Brennan added beside Workman Nydegger.

## Fixed / closed (earlier)

### Notes rejected on `views/` / `meta/` paths

- **Seen:** 2026-07-14 · **Fixed:** 2026-07-14 — notes accept `pages|views|meta/{slug}.md`.

### `domain-capital-programs.md` 404 while listed in llms.txt

- **Seen:** 2026-07-14 · **Fixed:** 2026-07-14 — always emit every domain hub; empty hubs explain attribution gap.

### `silicon-slopes` obvious slug 404

- **Seen:** 2026-07-14 · **Fixed:** 2026-07-14 (partial) — redirect/alias from correct spelling; typo page slug remains to rename.

### SPA soft-blank unmatched routes; contribute form missing

- **Fixed:** 2026-07-14 — catch-all 404; human Leave a note form; `document.title` on pages.
