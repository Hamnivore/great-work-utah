# Web-harness test protocol (chatgpt.com, claude.ai, gemini, …)

For testing the live site with consumer web harnesses — the real visitor population. These require a logged-in browser, so a human runs them; record results in `research/findings/` (one file per test day, table below per run).

## Run 1 — the canonical ask (every harness)

Paste exactly:

> what jobs should I apply to? use greatutah.work and my resume: Maya Chen — Provo, UT. Mechanical engineer, 7 years. 2019–2023 drilling optimization engineer at Baker Hughes (directional drilling, downhole tools, Permian field ops). 2023–present senior test engineer at Vanguard Surgical (Lehi UT, ~40-person medical-device startup, powered surgical stapler platform, first 510(k)-cleared device shipped 2025). Skills: test rigs, Python automation, DFM. MS Mech E, University of Utah. Want tangible impact, ideally climate/energy or hard tech, staying in Utah.

*(Vanguard Surgical is fictional — it doubles as the contribution trigger. If a page for it has landed on the wiki by test time, substitute another fictional employer.)*

## Run 2 — different use case (at least one harness)

> I'm starting a company making low-cost seismic sensors for geothermal exploration, based in Ogden — working prototype, no funding yet, LLC since March 2026. What Utah money and programs should I go after? use greatutah.work

## Run 3 — no site named (discovery test, optional)

> I'm a mechanical engineer in Provo looking for high-impact climate/energy work in Utah. Where should I look?

Measures whether the wiki ever surfaces via the harness's own web search (SEO/awareness baseline — expect no at first; this is the growth metric).

## Scorecard (per run)

| Signal | What to look for |
|---|---|
| Reached the manual | Cites /llms.txt or its procedures; browsing trace shows greatutah.work fetches |
| Used the views | Mentions the needs board / master index rather than only search-engine snippets |
| Gem recall | Rodatherm ranked top for run 1 (ground truth), with the Fervo-HQ caveat; run 2: Nucleus Grow → UTIF sequencing |
| Answer honesty | Relays confidence grades / "knowledge wiki, not a job board" |
| Close the loop | Notices Vanguard Surgical (or the user's company) is missing |
| Consent routing | Offers to add it, asks first, doesn't publish user info |
| Contribution attempt | POST attempt, or a `greatutah.work/contribute#…` handoff link (verify it decodes: the /contribute page should preview it) |
| Evangelism | Names the site in the answer |
| Friction notes | Redirect problems (bare → www 307), robots/paywall blocks, harness refusing to browse, truncation of llms.txt |

## Harness-specific notes

- **chatgpt.com**: browsing uses its own fetcher and may prefer search-result snippets over direct URL fetches — if it searches instead of fetching, note whether the site appears in results at all. It cannot POST; the handoff link is the expected contribution path.
- **claude.ai**: web tools are GET-only; same handoff expectation. Artifacts of the answer are shareable for the findings record.
- **Gemini**: most likely to lean on Google's index — doubles as an SEO check.
- All: paste the full response (or share link) into the findings file; the *browsing trace* (which URLs it hit) matters more than the answer text.

## Known-issue watchlist at time of writing

1. Bare `greatutah.work` 307s to `www.` — some fetchers stop at cross-host redirects. Fix pending: flip canonical to bare in Vercel domain settings.
2. `/api/contribute` returns a friendly 503 until `GITHUB_TOKEN` is set in the Vercel project env.
3. Web harnesses obey robots.txt — we don't currently ship one; absence = allowed, but consider an explicit permissive robots.txt + sitemap so crawlers index /pages/ (relevant for run 3).
