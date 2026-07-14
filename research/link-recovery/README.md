# Link recovery — broken / moved / mistyped official URLs

Agents often hit **Website:** fields that 404, park, fail TLS, or bot-block automated fetches.
Do not mark a program dead from a single `curl` failure.

## Quick commands

```bash
# Scan every wiki **Website:**; print non-live + suggestions
npm run links:recover

# Persist report under this directory
npm run links:recover -- --write-report

# One page or URL
node scripts/recover-broken-links.mjs --stem impact-utah --write-report
node scripts/recover-broken-links.mjs --url https://seualg.utah.gov/ --browser

# Headless Chrome when fetch looks blocked (needs `playwright` + Chrome)
npm run links:recover:browser
```

## Recovery order (do this on the page)

1. **Alias map** — `url-aliases.json` in this folder. Add a row when you confirm a moved/typo URL.
2. **Headless browser** — Cloudflare / WAF often blocks bare fetch; Chrome may still load the site.
3. **Successor org** — e.g. SEUALG public face is [serda.utah.gov](https://serda.utah.gov/); iMpact Utah overlaps [utah-mep](../../wiki/pages/utah-mep.md).
4. **Wayback CDX** — script suggests a last-known-good snapshot; cite it under Evidence, not as `**Website:**`.
5. **Startup State catalog** — fuzzy title match against `research/startup-state/live-catalog.json` (refresh via `npm run startup-state:check`).
6. **Staff / Startup State card** — keep Low confidence; document phone/email in How To Access.

## What to write on the wiki page

| Situation | `**Website:**` | Confidence | Evidence / notes |
|-----------|----------------|------------|------------------|
| Live successor found | Put the **live** URL | Medium+ if verified | Mention old URL once under Evidence |
| Bot-blocked but browser-live | Keep the official URL | Medium if you verified in browser | Note “automated fetch blocked” |
| Parked / NXDOMAIN / empty shell | Keep for history **or** clear if misleading | Low | Wayback + “domain parked/expired …” |
| TLS / 500 / auth-gated | Prefer public successor if any | Low | Note failure mode; staff contact |
| Hard 403 (not CF interstitial) | Keep + Wayback | Low | May be IP allowlist or shutdown |

Never invent a new official domain. Prefer P3: record what you verified.

## Adding aliases

Edit `url-aliases.json`:

- `aliases` — old URL → preferred live URL (typos, renames, http→https, Colorado mix-ups).
- `wayback_preferred` — pin a known-good snapshot (`null` = do not suggest Wayback).
- `notes` — short human/agent hint for a host or path.

Then re-run `npm run links:recover -- --write-report`.
