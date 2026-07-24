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

### Soft `/p/*` 200 SPA; soft-404 remains

- **Seen:** 2026-07-14 · harness: Cursor
- **Where:** `/p/*`
- **What:** Unknown `/p/` returns HTTP 200 SPA shell. Agent `/pages/` 404 recovery now lists `/views/*.md`.
- **Next check:** Harder soft-404 if humans need it.

### Domain attribution still incomplete; Utah Valley geo buckets confusing

- **Seen:** 2026-07-14
- **Where:** sector hubs, `by-region`
- **What:** Many ventures still lack Domain; “Utah Valley” heading ≠ Provo/Lehi company list intuition.
- **Partial fix:** Round 3 Domain on RF/bio/SaaS + FamilySearch, SCI, Adobe, Merit, Hexcel, Northrop.
- **Next check:** Keep attribution; consider Utah Valley rollup note.

### No full-text search; hire-your-own-team intent inverted

- **Seen:** 2026-07-14 (human founder / job seeker)
- **Where:** `/`, nav
- **What:** No search. “Looking for work” / Needs = other orgs’ talent needs — founders trying to hire for *their* company hit a job board for someone else.
- **Next check:** Wishlist search; optional “hiring?” copy under founding.

### Sitemap / SEO skewed to agent paths

- **Seen:** 2026-07-14 (founder human)
- **Where:** `/sitemap.xml`
- **What:** `/p/` + `/pages/` present; zero `/v/` URLs; no `/contribute`.
- **Next check:** Emit human view URLs in sitemap.

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
