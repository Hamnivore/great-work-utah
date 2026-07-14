# Findings: E12 — agent-first proximity search and regional overlays

**Date:** 2026-07-14  
**Local rig:** linked Vercel dev server at `http://127.0.0.1:3017`, real 610-page corpus  
**Mapped coverage:** 8 verified public points / 393 region-attributed pages  
**Runs:** 3 cold first-pass probes, 2 cold re-probes after fixes

## Hypothesis and decision rule

A cold agent given only a realistic location-shaped user request and the normal site URL should discover the location interface through `/llms.txt`, issue a valid query, interpret distance and precision correctly, fetch returned pages, and communicate sparse coverage without being told an endpoint exists.

The agent layer is ready to ship when discovery succeeds across varied competent runs, valid queries have no dead ends, nearest ordering and radius exclusion are correct, privacy exclusions remain intact, every response states non-comprehensive coverage, and agents use page evidence rather than treating a coordinate match as a recommendation. These runs are existence proofs, not rates.

## Candidate contract

`GET /api/locations` accepts either a common Utah place anchor (`near`) or WGS84 `lat` + `lon`, with optional `radius_miles`, `q`, `type`, `domain`, `precision`, and `limit`. Facets accept comma-separated values and combine with AND. Results are nearest-first when an origin exists and title-sorted otherwise.

Every result carries an absolute page URL, type, focus, region, domains, a human-readable location, latitude/longitude, exact/approximate precision, distance, and public provenance. The response reports published, matched, and returned counts; truncation; `comprehensive: false`; and a plain warning that absence is not evidence of local absence. Raw points remain available at `/locations.geojson`.

The endpoint rejects unknown parameters and invalid combinations with an actionable `400`, uses `405` for unsupported methods, supports CORS and OPTIONS, and caps radius at 500 miles and limit at 50.

## Local verification

- Haversine distance checked against Salt Lake City to Provo and for symmetry.
- Radius inclusion, nearest ordering, multi-token text filtering, facets, truncation, absolute URLs, empty valid facets, Utah bounds, incomplete coordinates, unknown parameters, and place-anchor resolution are tested.
- The generator emits both public GeoJSON and a statically importable Vercel data module from page metadata; freshness is checkable.
- Full-stack Vercel dev checks passed for valid/invalid GET, CORS, OPTIONS, POST rejection, cache headers, JSON content type, and page follow-through.

## Cold-agent experiment

Agents received only the local site URL and one realistic user request. Prompts did not mention `/llms.txt`, an endpoint, GeoJSON, maps, or proximity APIs.

| Scenario | Discovery | First query | Page follow-through | Coverage handling | Result |
|---|---|---|---|---|---|
| founder help, downtown Ogden | root → manual → API | valid; 2 mapped resources | fetched both, rejected irrelevant Job Corps | used regional fallback | pass |
| visits near St. George | root → manual → API | valid; Atwood at 0.95 mi | fetched Atwood and regional candidates | separated verified visit from contact-first nodes | pass |
| geothermal work near Milford | root → manual → API | `type=venture,work` failed | recovered, fetched FORGE and Fervo | correctly limited Fervo distance claim | kink found |
| Milford re-probe | root → manual → `near=Milford` | valid first try; FORGE at 9.66 mi | fetched FORGE | distinguished approximate origin from exact destination | pass |
| St. George re-probe | root → manual → `near=St. George` | valid first try; Atwood at 0.95 mi | fetched Atwood and fallback pages | did not call unmapped nodes within-radius | pass |

## Kinks and adjudications

1. **Valid wiki types failed when no mapped page used them.** The first Milford probe got `400` for `type=venture,work` because allowed facets were derived from the eight-point feed. Fix: validate against the stable wiki schema vocabularies. Re-probe: valid first request.
2. **Place-name users needed an external geocoder.** Ogden and St. George agents supplied coordinates from outside the site. Fix: add `near` with explicit approximate civic-center anchors for common Utah places, while retaining lat/lon for every other origin. Re-probes: both place-name requests worked first try.
3. **Sparse map points can produce misleading candidates.** Job Corps was geographically near Ogden but irrelevant to general founder help. The manual already required fetching returned pages; all agents did so and filtered it out. Distance remains a shortlist operation, not relevance ranking.
4. **Regional fallback lacks within-radius proof.** Agents correctly described unmapped regional pages as contact-first or broader-region leads. Keep the fallback because it restores recall, but never assign a distance without a verified point.
5. **Content debt is now more visible.** The probes surfaced overlapping Atwood pages, broad imported Focus tags, low-confidence stubs, and a malformed Utah FORGE Website value. These are corpus-quality follow-ups, not endpoint contract blockers.

## Production verification

Commit `de73a1d` deployed through the GitHub/Vercel production integration and reached Ready with aliases for `greatutah.work` and `www.greatutah.work`. Vercel bundled `api/locations` as an 8.35 KB function.

On the canonical host:

- `near=Milford&radius_miles=20&type=venture,work` returned Utah FORGE first at 9.66 miles with an absolute page URL and exact destination precision.
- `near=St. George&radius_miles=15&type=resource` returned Atwood Innovation Plaza at 0.95 miles.
- An unknown place returned actionable `400` JSON listing available anchors and the lat/lon fallback.
- A valid no-match text query returned `200`, zero results, and the non-comprehensive coverage warning.
- `/locations.geojson` returned a FeatureCollection with the same eight titles.
- `/llms.txt` exposed both the endpoint and the nearby procedure on the canonical host.
- Responses had JSON content type, CORS `*`, GET/OPTIONS Allow metadata, and public caching. Root, markdown pages, generated views, and `/api/contribute` retained their expected behavior.

## Map decision gate

**GO.** The endpoint contract survived cold re-probes and production verification. It is stable enough for a human map to consume without creating a parallel data system. The map must use the same feed/contract, distinguish exact from approximate points, expose sparse coverage and provenance, support correction/removal, and avoid implying statewide completeness.

## Human map verification

The map shipped at `/map` in commit `e0dcb49`, consuming `/api/locations` directly. It provides statewide browsing, common-place and browser-location origins, radius/type/precision controls, exact-versus-approximate markers, distances, page and provenance links, the correction/removal path, and the API's sparse-coverage warning. The route is lazy-loaded so ordinary wiki browsing does not load Leaflet.

Playwright full-page captures passed locally and on `https://greatutah.work/map` at 1440×1000 and 390×844. Tiles and all eight markers rendered; controls and text fit without overlap; the mobile view stacked the map and scan list cleanly. A production Ogden API regression still returned Startup Ogden then Clearfield Job Corps at 0.22 and 9.64 miles. Dependency audit reported zero vulnerabilities after the map dependency update.

## Regional-anchor expansion

Maintainer follow-up changed the coverage policy: people and private entities should remain visible at region granularity rather than disappearing. The generator now emits verified site points where explicitly sourced and otherwise derives coarse city/county/area anchors from `Region`. Person pages always downgrade to a regional anchor even if exact coordinates are accidentally present; residences remain excluded. Statewide-only, unknown, and unverified Utah locations still have no point.

Coverage increased from 8 verified sites to 288 mapped pages: 8 site points and 280 regional anchors. Shared centroids are not jittered into fake precision; the human map aggregates pages at identical coordinates into count-scaled regional markers. A local Salt Lake City people query returned six people, all labeled `anchorKind: regional`, and the expanded desktop map passed a fresh Playwright render check.

A follow-up address pass researched Salt Lake, Utah/northern, and southern/rural regions in parallel. Eighty-six organization/work pages were promoted from regional anchors to exact public sites using official location pages where available and stable Google Maps listings for otherwise clearly public places. Exact coverage rose to 94 sites; 194 pages remain regional. Ambiguous, residential, conflicting-geocode, and stale candidates were omitted. PhotoPharmics' official address also corrected its canonical region from American Fork to Lehi.

The next audit exposed a page-versus-site modeling gap: programs such as Sandbox operate at several public campuses. Pages now retain one primary map tuple and may add repeatable `Additional Map Location` records. The compiler emits one point and proximity result per site, assigns a stable site ID, and reports both distinct-page and point coverage so multi-site programs do not distort the UI's mapped-page count.

The exhaustive follow-up partitioned all 518 pages without exact metadata across three independent research agents and required a disposition for every assigned slug. It promoted 150 pages using 216 sourced current or historical public sites. The remaining review dispositions were 82 regional-only (people, distributed programs, sensitive facilities, or no canonical walk-in site), 222 with no independent Utah place (primarily source/guide artifacts), and 64 with insufficient evidence. No residence, PO box, ambiguous namesake, or nonpublic defense/industrial coordinate was promoted.

After integration the public feed contains 415 points across 349 mapped pages: 309 verified public sites across 243 pages and 106 regional anchors. Fourteen pages have multiple public sites, including all 31 Workforce Services centers and 11 Utah SBDC centers. Sandbox has six points: its published corporate location, BYU, University of Utah, Utah State University, Utah Valley University, and its documented historical Utah Tech program site. Historical corporate and invention sites are labeled as former or historical rather than presented as current offices.

The dense-map UI changed from overlapping circles to spatial clusters. Cluster markers expose counts and example names on hover, expand/spiderfy on click, and individual markers show name plus location in a desktop hover tooltip. This preserves real shared centroids rather than inventing offsets.

## What this establishes and does not

The experiment establishes discoverability, useful query ergonomics, correct distance behavior, page follow-through, privacy signaling, and an honest regional fallback. Eight points prove the plumbing, not statewide recall. Expanding verified location coverage remains a corpus task and should be measured separately from endpoint usability.
