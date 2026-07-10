# Findings: production launch + first live-harness probe

**Date:** 2026-07-09 · **Deployed:** commits `7c90814` → `49cf694`, Vercel GitHub auto-deploy · **Live:** https://greatutah.work (currently 307 → www)

## Launch verification

All surfaces serve on production: `/llms.txt`, `/views/*.md`, `/pages/*.md`, `/meta/*.md`, static-fallback root. `/api/contribute` validates drafts and returns a friendly 503 until `GITHUB_TOKEN` lands in the Vercel project env. WebFetch (the claude.ai-class fetcher) reads the root fallback and the full manual correctly through its HTML→markdown pipeline — a small summarizing model extracted the procedures, ladder, handoff path, and provenance rule accurately from one fetch.

Crawler bugs found & fixed at launch: the SPA rewrite was serving 200-HTML for `robots.txt`/`sitemap.xml` (and every nonexistent path — soft-404s). Now: real permissive robots.txt pointing agents at `/llms.txt`, and build-views emits a 1,227-URL sitemap each build. Remaining soft-404 issue (unknown paths return 200 HTML) is acceptable for agents (they request known .md paths) but worth a 404 rule eventually.

## First live probe (WebFetch-only cold agent — the web-harness constraint profile)

**PASS, cheapest competent run of the program** (11 fetches, 38.6K tokens): manual → root → the find-meaningful-work methodology guide → needs board → 6 pages. Rodatherm ranked #1 with both-halves-of-the-resume reasoning; Fervo HQ caveat; honest "not a job board" framing; explicit reasons for demoting Zanskar/Iris. Handled the bare→www redirect without issue. One slug-guess 404 (merit-medical-systems), instantly recovered.

**Web-harness-specific finding:** the agent skipped the close-the-loop employer check. Hypothesis: WebFetch-class tools summarize fetched pages through a small model, so low-salience manual sections can drop out in transit — unlike curl agents who get the verbatim document. If chatgpt/claude.ai runs replicate this, mitigations: move the closing step earlier/heighten salience in the manual, and repeat the trigger line at the bottom of the needs board itself (the doc every job-flow agent reads verbatim… also summarized, but domain-salient).

## Known issues / deploy checklist

1. **Canonical host:** bare `greatutah.work` 307s to `www.` — flip to bare-as-canonical in Vercel domain settings (all docs and handoff URLs say bare). 307 preserves POST so nothing breaks meanwhile.
2. **`GITHUB_TOKEN`** → Vercel env (present in local `.env`; CLI token was stale, needs `vercel login` or dashboard).
3. Human-driven web-harness runs: protocol at `harness/web-harness-test-protocol.md` (paste-ready prompts, scorecard, per-harness notes). Results go in a findings file per test day.
