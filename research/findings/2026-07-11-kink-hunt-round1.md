# Findings: production kink hunt, round 1

**Date:** 2026-07-11 · **Method:** 4 parallel live probes — adversarial QA (exhaustive path/API testing) + three untested scenarios (find-a-helper, researcher commercialization, inspiration/history) · **Fixed same-day:** commit `077368f`, verified live.

## Scenario probes: 3/3 competent answers, new behaviors observed

- **Helper task** (9 requests, zero dead ends): tiered IP-firm and fractional-CFO recommendations with stage caveats; spontaneously suggested the regulatory-affairs helper the user didn't ask about; **consent routing generalized unprompted** to a new scenario ("your diagnostics startup isn't on the wiki — I won't publish without your OK").
- **Researcher commercialization** (25 requests): correctly recognized the user was past the guide's early stages; sequenced IP counsel → SBIR (Nucleus Grow → UTIF) → Nucleus Fund; cited two Utah precedents from the same technical lineage; identified the **U of U TVC page as "the single most load-bearing gap"** for this user class (already in the guide's own Open Questions — now validated by a real usage failure; high-priority wanted page).
- **Inspiration/history** (21 requests): Oh-My-God particle, MOXIE-on-Mars, Thiokol, Tracy Hall's presses — a genuinely persuasive answer for a physics-minded student. Surfaced the sharpest navigation critique: **domain hubs are sparse and miss their best members** (Fly's Eye absent from space-science) because attribution is 22/604 — the E10 rollout is now the binding constraint on navigation quality, not design.

## QA probe: 8 kinks, disposition

| Kink | Disposition |
|---|---|
| Bare→www 307 on every request while all site copy advertises bare | Manual now documents it; **real fix is the dashboard domain flip (user action, pending)** |
| Soft-404s (200+HTML) for /LLMS.TXT, /index.md, /wiki/pages/* | 308 redirects added for the plausible guesses; SPA-route soft-404s are inherent; manual warns against slug-guessing |
| Non-JSON POST → empty 400 body | **Fixed** — runtime body-getter throw now caught; helpful message verified live |
| Master index linked bare `/pages/` (404) | **Fixed** in generator |
| Generic Vercel 404 text is a dead end | Manual now says: don't guess slugs, look them up in views |
| Note length cap undocumented | **Fixed** in manual |
| One validation error per round trip | **Fixed** — all errors in one response, verified live |
| `reason` optional / `type` per-kind requirements undocumented | **Fixed** in manual |

Also: `GET /views/` serves the master index while `/pages/` 404s (inconsistent dir-root behavior; harmless, noted). QA confirmed the good news exhaustively: all 116 links in the big views resolve, every llms.txt path resolves, traversal rejected, CORS open, HEAD/query-strings/trailing-slashes all fine.

## Method note: verify probe claims before fixing

The inspiration probe reported a "dead link in a generated view" (utah-quantum). Reproduction showed the generated view is correct — **the probe guessed the slug itself, then attributed its own typo to the site.** Generated-view integrity holds. Rule: reproduce every reported kink before coding; agent self-reports misattribute.

## Open (blocked or queued)

1. **GITHUB_TOKEN invalid** — 401 from GitHub even locally; needs a fresh fine-grained PAT (Contents/Issues/PRs RW on the repo), then .env + Vercel env + redeploy, then the write path gets its live E2E test (note→issue, page→PR).
2. Domain flip to bare-canonical (dashboard).
3. E10 attribution rollout — now demonstrably the navigation-quality bottleneck (empty materials hub, hubs missing star members, 37KB resources monolith wanting domain slices).
4. Wanted page validated by real usage: University of Utah TVC / tech-transfer.
