# Site issues — open tracker

Living list of bugs and rough edges observed on the live site or in local runs. Add a dated note when you hit something; mark fixed when solved. For design wishlist items (not bugs), use [`wishlist.md`](wishlist.md). For experiment writeups, use `findings/`.

## Open

### No full-text search; discovery is skim-indexes or guess slugs

- **Seen:** 2026-07-14 (rural / founder / advisor probes)
- **Where:** site-wide
- **What:** Agents must skim type views; title→slug guesses often 404 (`find-an-advisor-in-utah` vs `find-an-advisor`; `eide-bailly` vs `eide-bailly-utah`).
- **Impact:** High friction for cold agents; wasted round-trips.
- **Next check:** Wishlist grep endpoint / better slug hints; keep “don’t guess — use views” but make view paths WebFetch-safe (done). Extensionless + trailing-slash redirects shipped 2026-07-14.

### `by-region` / Domain attribution thin; rural & bio hubs misleading

- **Seen:** 2026-07-14
- **Where:** `/views/by-region.md`, `/views/domain-health-bio.md`, resource stubs
- **What:** Region view only includes attributed pages; many chambers use Location not Region. Health-bio hub nearly empty while bio ventures lack Domain. Rural coverage exists mostly as Low-confidence CSV stubs.
- **Impact:** Geography/sector browse understates real corpus.
- **Next check:** Attribution rollout; stub quality pass.

### Needs still inferred; no careers URLs; helpers often Draft

- **Seen:** 2026-07-14 (job-seeker / advisor probes)
- **Where:** `/views/needs.md`, venture pages, helper pages
- **What:** Needs are “Likely needs…” not live openings; pages don’t link careers; helpers often `Status: Draft`. Needs board truncation lengthened 2026-07-14 (400/280 chars).
- **Impact:** Cannot answer live hiring; trust weaker than prose depth.
- **Next check:** Careers link field; review pass on helpers.

### Contribute: no rate limit / dedupe

- **Seen:** 2026-07-14 (contribute probe) — opened test issues #3–#5
- **Where:** `POST /api/contribute`
- **What:** Rapid notes create multiple GitHub issues; llms says no rate limits.
- **Impact:** Queue noise.
- **Next check:** Light rate limit or dedupe. (Deep-link decode errors now surfaced in UI.)

### Capital / advisor guides incomplete vs corpus; focus tags polluted

- **Seen:** 2026-07-14 (founder / advisor probes)
- **Where:** `startup-capital-in-utah.md`, `find-an-advisor.md`, angel/VC stubs, resource Focus lines
- **What:** Canonical guides omit angels/VCs/life-sciences helpers that exist elsewhere; CSV stubs tagged Aerospace/Agriculture; Nucleus pages bury apply URLs on source pages; `utah-innovation-fund` vs `nucleus-fund` overlap.
- **Impact:** Following llms procedures systematically under-serves biotech founders and private-capital seekers.
- **Next check:** Guide refresh; Focus cleanup; put primary URLs on resource pages.

## Fixed / closed

### Human contribute UX is agent-handoff shaped

- **Seen:** 2026-07-14 · **Fixed:** 2026-07-14
- **Fix:** `/contribute` leads with a plain “Leave a note” form; agent handoff/JSON paste moved below; bad hash shows a decode error instead of only “No draft found.”

### Human SPA: soft-blank unmatched routes; no document.title

- **Seen:** 2026-07-14 · **Fixed:** 2026-07-14
- **Fix:** Client `*` route shows slim 404 with `/llms.txt` + `/views/index.md`; `document.title` set from page H1; `/p/{slug}.md` strips `.md` before fetch.

### Trailing-slash / extensionless / view `../` path traps

- **Seen:** 2026-07-14 · **Fixed:** 2026-07-14
- **Fix:** `vercel.json` 308s strip trailing slashes on `*.md` / `llms.txt` and map extensionless `/pages|views|meta/{slug}` → `{slug}.md`. Generated views use root-absolute `/pages/...` hrefs (no `../`).

### Needs board truncates mid-sentence

- **Seen:** 2026-07-14 · **Fixed:** 2026-07-14 (partial)
- **Fix:** Needs clip raised to 400 chars (ventures inline needs 280). Still not full section text — full page remains source of truth.

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
