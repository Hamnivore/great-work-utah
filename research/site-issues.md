# Site issues — open tracker

Living list of bugs and rough edges observed on the live site or in local runs. Add a dated note when you hit something; mark fixed when solved. For design wishlist items (not bugs), use [`wishlist.md`](wishlist.md). For experiment writeups, use `findings/`.

## Open

### Domain / by-region attribution thin (RF, bio, rural under-listed)

- **Seen:** 2026-07-14 (RF / rural / founder probes, round 2–3)
- **Where:** sector hubs, rural stubs
- **What:** Hubs only list Domain-attributed pages. Round 3 attributed core RF/bio/computing ventures (IMSAR, Fortem, Recursion, Qualtrics, …). **by-region** no longer requires Domain (fixed 2026-07-14) — Cedar/Moab/Iron now appear when they have Region.
- **Still open:** Many ventures still lack Domain; rural stubs Low confidence / polluted Focus; culture-place thin.
- **Next check:** Keep attribution rollout; stub quality; Focus cleanup.

### Needs still inferred; no careers URLs; helpers often Draft

- **Seen:** 2026-07-14
- **Where:** `/views/needs.md`, venture pages, helper pages
- **What:** Needs are “Likely needs…” not live openings; pages don’t link careers; helpers often `Status: Draft`.
- **Impact:** Cannot answer live hiring; trust weaker than prose depth.
- **Next check:** Careers link field; review pass on helpers.

### Contribute: no rate limit / dedupe

- **Seen:** 2026-07-14 (notes through ~#61+)
- **Where:** `POST /api/contribute`
- **What:** Rapid notes create many GitHub issues; no dedupe.
- **Impact:** Queue noise (also a sign closing-the-loop works).
- **Next check:** Light rate limit or content hash dedupe.

### Capital / advisor guides incomplete; UIF/UTIF collision; Silicon Slopes gap

- **Seen:** 2026-07-14 (founder / advisor / wrong-slug probes)
- **Where:** guides, angel/VC stubs, `sillicon-slopes` typo page
- **What:** Guides omit life-sciences helpers / angels; UIF stub vs UTIF confusion; typo slug alias only.
- **Next check:** Guide refresh; rename Silicon Slopes; cross-link UIF/Nucleus Fund.

### No full-text search; SPA still agent-leaning for humans

- **Seen:** 2026-07-14 (human browse probes)
- **Where:** `/`, nav
- **What:** No search. Round 3: nav labels “looking for work” / “founding”; footer quieter; index opens with those paths.
- **Next check:** Wishlist grep; share/SSR if humans matter more.

### Evidence links often unfetchable via HTML sanitizers

- **Seen:** 2026-07-14 (RF / SWE probes)
- **Where:** page Evidence / See Also
- **What:** WebFetch drops hrefs; page bodies don’t repeat paths in backticks like views do.
- **Next check:** Evidence lines include plaintext paths or absolute URLs.

## Fixed / closed (selected, round 3)

### Day-1 founder / job-seeker entrypaths unclear

- **Fixed:** 2026-07-14 — `llms.txt` first-visit procedures; master index lead-ins; human nav labels; Main Street → `find-business-services` + `by-region`.

### Sector hubs missed RF / bio / SaaS employers

- **Fixed:** 2026-07-14 (partial) — Domain on IMSAR, Fortem, L3Harris, SDL, Recursion, Teal, Wavetronix, Vector, Halia, Epitel, Qualtrics, Instructure.

### by-region hid non-Domain pages (Cedar / Moab / Iron)

- **Fixed:** 2026-07-14 — by-region includes every page with `**Region:**`.

## Fixed / closed

### Notes rejected on `views/` / `meta/` paths

- **Seen:** 2026-07-14 (RF / rural / history probes) · **Fixed:** 2026-07-14
- **What:** `POST /api/contribute` 400 for `views/by-region.md` etc.; agents couldn’t file gaps against indexes.
- **Fix:** Notes accept `pages|views|meta/{slug}.md`; llms.txt documents it. Pages still require `pages/`.

### `domain-capital-programs.md` 404 while listed in llms.txt

- **Seen:** 2026-07-14 · **Fixed:** 2026-07-14
- **Fix:** Always emit every domain hub file; empty hubs explain attribution gap and point to type views.

### `silicon-slopes` obvious slug 404

- **Seen:** 2026-07-14 · **Fixed:** 2026-07-14 (alias only)
- **Fix:** 308 `/pages/silicon-slopes.md` → `/pages/sillicon-slopes.md` (existing typo slug). Real rename still open.

### Human contribute UX is agent-handoff shaped

- **Seen:** 2026-07-14 · **Fixed:** 2026-07-14
- **Fix:** `/contribute` leads with a plain “Leave a note” form; agent handoff/JSON paste moved below; bad hash shows a decode error.

### Human SPA: soft-blank unmatched routes; no document.title

- **Seen:** 2026-07-14 · **Fixed:** 2026-07-14
- **Fix:** Client `*` 404; `document.title` from H1; `/p/{slug}.md` strips `.md`.

### Trailing-slash / extensionless / view `../` path traps

- **Seen:** 2026-07-14 · **Fixed:** 2026-07-14
- **Fix:** 308 trailing-slash strip + extensionless→`.md`; views use root-absolute `/pages/...` hrefs.

### Needs board truncates mid-sentence

- **Seen:** 2026-07-14 · **Fixed:** 2026-07-14 (partial)
- **Fix:** Needs clip 400 chars (ventures inline 280).

### `llms.txt` / view paths broken under Cursor WebFetch

- **Seen:** 2026-07-14 · **Fixed:** 2026-07-14
- **Fix:** `{slug}` placeholders; backtick paths in views; fetch tip.

### Soft 404 SPA catch-all / opaque Vercel NOT_FOUND

- **Seen:** 2026-07-14 · **Fixed:** 2026-07-14
- **Fix:** Narrow rewrites; slim `404.html` with `/llms.txt` + `/views/index.md`.
