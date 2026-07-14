# Site issues — open tracker

Living list of bugs and rough edges observed on the live site or in local runs. Add a dated note when you hit something; mark fixed when solved. For design wishlist items (not bugs), use [`wishlist.md`](wishlist.md). For experiment writeups, use `findings/`.

## Open

### Cursor harness: Anthropic/OpenAI Task API quota blocked cross-model probes

- **Seen:** 2026-07-14 · harness: Cursor Task subagent
- **Where:** Task launches with `claude-sonnet-5-thinking-high`, `claude-4.5-sonnet-thinking`, `gpt-5.6-sol-medium`, `gpt-5.2-codex`
- **What:** Immediate fail: `API usage limit reached Switched to composer-2.5 after reaching API limit.` Zero wiki fetches on those models. Grok + Composer Task launches still start.
- **Impact:** Cannot complete planned 3×3 provider matrix until quota recovers.
- **Next check:** Re-run Claude/OpenAI legs when quota available; see `research/findings/model-harness-probes-2026-07-14.md`.
- **Note:** Unrelated harness *wiki* frictions (WebFetch strip, contribute aliases, agent 404) were mitigated 2026-07-14 — see Fixed below.

### Needs: no careers URLs; synonym / filter gaps remain

- **Seen:** 2026-07-14 (job-seeker probes; **Grok** `cursor-grok-4.5-high-fast` + **Composer** `composer-2.5-fast` · harness: Cursor) · notes [#80](https://github.com/Hamnivore/great-work-utah/issues/80)–[#82](https://github.com/Hamnivore/great-work-utah/issues/82), [#84](https://github.com/Hamnivore/great-work-utah/issues/84), [#85](https://github.com/Hamnivore/great-work-utah/issues/85), [#87](https://github.com/Hamnivore/great-work-utah/issues/87), [#95](https://github.com/Hamnivore/great-work-utah/issues/95)
- **Where:** `/views/needs.md`, venture pages
- **What:** No skill filter; most pages lack careers/apply links (agents leave wiki / guess `/careers` → 404). Dead L3Harris Evidence URLs. Both models still shortlisted IMSAR / L3Harris / Fortem.
- **Partial fix:** Region on needs lines; Qualtrics careers link.
- **Next check:** Optional `**Careers:**` metadata; fix L3Harris Evidence; defense-software cluster.

### Capital stubs + Focus sludge; empty capital-programs hub; Silicon Slopes typo

- **Seen:** 2026-07-14 (**Grok** + **Composer** SaaS-founder / slug probes · harness: Cursor) · [#69](https://github.com/Hamnivore/great-work-utah/issues/69), [#71](https://github.com/Hamnivore/great-work-utah/issues/71), [#86](https://github.com/Hamnivore/great-work-utah/issues/86), [#88](https://github.com/Hamnivore/great-work-utah/issues/88), [#89](https://github.com/Hamnivore/great-work-utah/issues/89), [#93](https://github.com/Hamnivore/great-work-utah/issues/93), [#94](https://github.com/Hamnivore/great-work-utah/issues/94)
- **Where:** capital guide, stubs, `domain-capital-programs`, Silicon Slopes
- **What:** Same path break on both models — advisors OK, SaaS equity dead-ends. Typo slug was canonical (fixed 2026-07-14 — see Fixed).
- **Next check:** Medium Draft Album/Kickstart/Peterson; Focus cleanup; capital-programs attribution.

### Agent 404 recovery points at SPA `/v/*`; soft `/p/*` 200

- **Seen:** 2026-07-14 (**Grok** + **Composer** slug probes · harness: Cursor) · [#91](https://github.com/Hamnivore/great-work-utah/issues/91), [#92](https://github.com/Hamnivore/great-work-utah/issues/92), [#93](https://github.com/Hamnivore/great-work-utah/issues/93)
- **Where:** `public/404.html`, `/p/*`
- **What:** Markdown 404 body advertised `/v/needs` / `/v/guides` (HTML). Unknown `/p/` returns 200 SPA.
- **Partial fix:** 2026-07-14 — `404.html` + SPA NotFound list `/views/*.md` for agents and `/v/*` for humans.
- **Next check:** Hard 404 or clearer soft-404 for unknown `/p/` (still SPA 200).

### Evidence links often unfetchable via HTML sanitizers (Cursor WebFetch)

- **Seen:** 2026-07-14 (**Grok** + **Composer** · harness: Cursor WebFetch)
- **Where:** page Evidence / See Also; intermittent timeouts on Fortem / advisor / capital
- **What:** Both models: hrefs stripped; views backticks OK; page bodies often not. Timeouts forced curl fallback.
- **Partial fix:** 2026-07-14 — served `/pages/*.md` append backtick paths + resolved source URLs after Evidence/See Also/Relates; CDN Cache-Control; llms.txt timeout tip. Source `wiki/pages` stays clean.
- **Next check:** Re-probe with WebFetch; careers field still separate.

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
