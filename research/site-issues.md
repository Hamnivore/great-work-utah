# Site issues — open tracker

Living list of bugs and rough edges observed on the live site or in local runs. Add a dated note when you hit something; mark fixed when solved. For design wishlist items (not bugs), use [`wishlist.md`](wishlist.md). For experiment writeups, use `findings/`.

## Open

### Human contribute UX is agent-handoff shaped

- **Seen:** 2026-07-14 (human homepage probe)
- **Where:** https://greatutah.work/contribute
- **What:** Default state shows “No draft found in the link.” Primary non-GitHub path is paste-JSON / agent deep-link, not a plain “leave a note” form.
- **Impact:** First-time humans who click Contribute bounce confused.
- **Next check:** Human-first note form; keep JSON/deep-link as advanced path.

### Human SPA: soft-blank unmatched routes; no document.title; agent-first chrome

- **Seen:** 2026-07-14
- **Where:** `/about`, `/search`, empty `/p/`, `/v/` (before rewrite narrow); SPA chrome
- **What:** Unmatched client routes render empty main (200). Tab title stays “Great Work — Utah.” Nav is only needs + contribute; homepage/footer shout agents.
- **Note:** 2026-07-14 narrowed Vercel rewrites so unknown paths (including stray `*.md`) are hard 404s at the edge; in-app unmatched React routes can still blank.
- **Next check:** Client catch-all 404; set `document.title` from H1; optional human browse affordances.

### No full-text search; discovery is skim-indexes or guess slugs

- **Seen:** 2026-07-14 (rural / founder / advisor probes)
- **Where:** site-wide
- **What:** Agents must skim type views; title→slug guesses often 404 (`find-an-advisor-in-utah` vs `find-an-advisor`; `eide-bailly` vs `eide-bailly-utah`).
- **Impact:** High friction for cold agents; wasted round-trips.
- **Next check:** Wishlist grep endpoint / better slug hints; keep “don’t guess — use views” but make view paths WebFetch-safe (done).

### `by-region` / Domain attribution thin; rural & bio hubs misleading

- **Seen:** 2026-07-14
- **Where:** `/views/by-region.md`, `/views/domain-health-bio.md`, resource stubs
- **What:** Region view only includes attributed pages; many chambers use Location not Region. Health-bio hub nearly empty while bio ventures lack Domain. Rural coverage exists mostly as Low-confidence CSV stubs.
- **Impact:** Geography/sector browse understates real corpus.
- **Next check:** Attribution rollout; stub quality pass.

### Needs board truncates; no careers URLs; helpers all Draft

- **Seen:** 2026-07-14 (job-seeker / advisor probes)
- **Where:** `/views/needs.md`, venture pages, helper pages
- **What:** Needs lines end in `…`; pages don’t link careers; every helper checked was `Status: Draft`.
- **Impact:** Weaker job-match and advisor trust than content depth suggests.
- **Next check:** Longer needs clips or “open page” cue; careers link field; review pass on helpers.

### Contribute: silent deep-link failures; no rate limit

- **Seen:** 2026-07-14 (contribute probe) — opened test issues #3–#5
- **Where:** `/contribute#…`, `POST /api/contribute`
- **What:** Bad hash → “No draft found” with no decode detail; rapid notes create multiple GitHub issues.
- **Impact:** Opaque handoff failures; queue noise.
- **Next check:** Surface decode errors; light rate limit or dedupe.

### Trailing-slash URLs break Relates joins; view `../` not normalized server-side

- **Seen:** 2026-07-14 (URL/404 probe)
- **Where:** `/pages/fervo-energy.md/` (200, no redirect); `/views/../pages/...` with path-as-is → 404
- **What:** Trailing slash keeps content but Relates resolve under the slash path and 404. Naive clients that don’t normalize `../pages/` from views also 404.
- **Impact:** Graph follow-through fails after a common URL variant; view discovery brittle for some fetchers.
- **Next check:** 308 strip trailing slash on `*.md`; consider root-absolute `/pages/` hrefs in generated views (backtick paths already mitigate WebFetch).

### Capital / advisor guides incomplete vs corpus; focus tags polluted

- **Seen:** 2026-07-14 (founder / advisor probes)
- **Where:** `startup-capital-in-utah.md`, `find-an-advisor.md`, angel/VC stubs, resource Focus lines
- **What:** Canonical guides omit angels/VCs/life-sciences helpers that exist elsewhere; CSV stubs tagged Aerospace/Agriculture; Nucleus pages bury apply URLs on source pages; `utah-innovation-fund` vs `nucleus-fund` overlap.
- **Impact:** Following llms procedures systematically under-serves biotech founders and private-capital seekers.
- **Next check:** Guide refresh; Focus cleanup; put primary URLs on resource pages.

### Extensionless paths / `/p/{slug}.md` traps

- **Seen:** 2026-07-14 (URL/404 probe)
- **Where:** `/pages/fervo-energy` (no `.md`), `/p/fervo-energy.md`
- **What:** No alias to `.md`; human route always appends `.md` → double extension.
- **Impact:** Common paste/guess mistakes still fail (now with a helpful 404 body).
- **Next check:** Optional extensionless→`.md` redirects; strip `.md` in `/p/` param.

## Fixed / closed

### `llms.txt` / view paths broken under Cursor WebFetch (HTML sanitization)

- **Seen:** 2026-07-14 · **Fixed:** 2026-07-14
- **Where:** `/llms.txt`, generated `/views/*.md`
- **What:** Angle-bracket placeholders (`<slug>`) became empty (`/pages/.md`). Markdown link hrefs were dropped so type views showed titles with no fetchable paths.
- **Fix:** `{slug}` / `{type}` placeholders; valid copy-paste JSON contribute example; views repeat `` `/pages/{slug}.md` `` in backticks; manual documents fetch tip + `/p/` vs `/pages/` + sector hub filenames; contribute API errors avoid angle brackets and mention `Content-Type`.

### Soft 404: unknown paths (incl. stray `.md`) returned SPA homepage

- **Seen:** 2026-07-14 · **Fixed:** 2026-07-14
- **Where:** e.g. `/jarvik-7-utah-history.md`, `/about` (edge)
- **What:** Catch-all rewrite sent everything to `index.html` (HTTP 200), so agents treated wrong URLs as success.
- **Fix:** `vercel.json` rewrites only `/`, `/contribute`, `/p/*`, `/v/*` — other missing paths get a real Vercel 404.

### Opaque hard 404 body (Vercel `NOT_FOUND`)

- **Seen:** 2026-07-14 · **Fixed:** 2026-07-14
- **Where:** missing `/pages/*.md`, `/views/*.md`, unknown paths
- **What:** Generic plain-text `NOT_FOUND` + request id; no recovery pointers.
- **Fix:** Slim `public/404.html` — status still 404; body points at `/llms.txt` and `/views/index.md`. SPA miss message matches.
