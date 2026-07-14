# Site issues — open tracker

Living list of bugs and rough edges observed on the live site or in local runs. Add a dated note when you hit something; mark fixed when solved. For design wishlist items (not bugs), use [`wishlist.md`](wishlist.md). For experiment writeups, use `findings/`.

## Open

### Needs: no careers URLs; synonym / filter gaps remain

- **Seen:** 2026-07-14 (job-seeker probes, round 3) · note [#80](https://github.com/Hamnivore/great-work-utah/issues/80)
- **Where:** `/views/needs.md`, venture pages
- **What:** Needs are still “Likely needs…” not live openings; no careers/apply links on pages. Role-string mismatch (data scientist vs applied scientist) still requires synonym skim. No role/city filter UI.
- **Partial fix:** 2026-07-14 — needs lines now include **Region** when set; intro warns about synonyms + points to by-region.
- **Next check:** Careers URL field; optional synonym gloss on needs.

### Contribute: no rate limit / dedupe; path schema friction for humans

- **Seen:** 2026-07-14 (notes through ~#80) · founder human [#73](https://github.com/Hamnivore/great-work-utah/issues/73)
- **Where:** `POST /api/contribute`, `/contribute`
- **What:** Rapid notes create many GitHub issues; path must look like `pages/….md`; “add my company” not obvious.
- **Next check:** Light rate limit / content hash; clearer human “missing company” path.

### Capital stubs + Focus sludge; empty capital-programs hub

- **Seen:** 2026-07-14 (hardware / founder human) · [#69](https://github.com/Hamnivore/great-work-utah/issues/69), [#71](https://github.com/Hamnivore/great-work-utah/issues/71)
- **Where:** angel/VC stubs, `domain-capital-programs`, Focus lines
- **What:** Empty hub; CSV Focus (Aerospace/Agriculture on cleantech); Low-confidence stubs look like recommendations if skimmed from Resources.
- **Partial fix:** 2026-07-14 — `startup-capital-in-utah` warns stubs are a watchlist; helpers view points free mentors to `find-an-advisor`.
- **Next check:** Focus cleanup; attribute or retire capital-programs hub; Silicon Slopes typo rename; UIF/UTIF.

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

### Evidence links often unfetchable via HTML sanitizers

- **Seen:** 2026-07-14
- **Where:** page Evidence / See Also
- **What:** WebFetch drops hrefs; page bodies don’t always repeat paths in backticks like views do.
- **Next check:** Evidence lines include plaintext paths or absolute URLs.

### Sitemap / SEO skewed to agent paths

- **Seen:** 2026-07-14 (founder human)
- **Where:** `/sitemap.xml`
- **What:** `/p/` + `/pages/` present; zero `/v/` URLs; no `/contribute`.
- **Next check:** Emit human view URLs in sitemap.

## Fixed / closed (selected, round 3)

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
