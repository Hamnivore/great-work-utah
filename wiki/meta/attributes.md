# Attribute registry

The authoritative list of page metadata. Lint and the view generators parse this file. An attribute exists only if a view consumes it; a vocabulary value is added by adjudicating a real case (see `conventions.md`). Headers are bold-prefix lines after the H1: `**Key:** value`.

| Attribute | Applies to | Required | Vocabulary | Consumed by |
|---|---|---|---|---|
| Type | all pages | yes | venture · person · helper · resource · work · guide · source | type indexes, master index, templates lint |
| Status | all pages | yes | Draft · Reviewed | trust display |
| Confidence | all except guides | yes | High · Medium · Low | trust display, index lines |
| Focus | all except sources | yes | free tags, comma-separated | index lines, shortlisting |
| Domain | venture, person, helper, resource, work | rollout in progress | energy · health-bio · aerospace-defense · computing · materials-mfg · space-science · capital-programs · culture-place — first entry is primary | sector hubs, facet indexes |
| Primary Location | venture, person, helper, resource, work | rollout in progress | canonical main home: HQ, main lab, main site, institution, or `unknown` | identity, shortlisting, location migration |
| Utah Location | venture, person, helper, resource, work | rollout in progress | verified Utah city/county/site/area; `statewide`; `no verified Utah presence`; `unknown` | Utah-footprint audit, future region derivation |
| Region | venture, person, helper, resource, work | rollout in progress | normalized by-region key derived from Utah Location: Utah city/county/area; `statewide`; `no verified Utah presence`; `unknown` | by-region view |
| Map Location | venture, helper, resource, work | optional; required with any explicit map field | public Utah site at the same granularity as Coordinates; people/private/ambiguous entities are generated only from coarse Region anchors | regional overlay, map display |
| Coordinates | venture, helper, resource, work | optional; required with any map field | WGS84 decimal `latitude, longitude`; Utah bounds only | `/locations.geojson`, future proximity queries |
| Location Precision | venture, helper, resource, work | optional; required with any map field | exact · approximate | regional overlay privacy and map display |
| Location Source | venture, helper, resource, work | optional; required with any map field | public `https://` URL supporting the mapped site | regional overlay provenance |
| Needs-reviewed | any page with `## What They Need Now` | yes (with that section) | `YYYY-MM-DD` | needs board staleness flags |
| Website | venture, helper, resource, work | optional | bare `https://` URL (no markdown link) — official site | needs board, agent shortlists |
| Careers | venture, helper, resource | optional | bare `https://` URL (no markdown link) of the org's general careers/jobs page or its own ATS board — never a single posting, an aggregator, or a raw ATS API endpoint | needs board, job-seeker next step |
| Ownership | venture | optional (candidate for required) | founder-led private · private · public · PE-owned · nonprofit · government | judgment layer (see charter.md) |
| Domain-flagged | any | no | `review` | lint queue for editor adjudication |
| Location | legacy only | no | superseded by `Primary Location` + `Utah Location` | lint warning until removed |
| Updated | all pages | yes | `YYYY-MM-DD` | index lines, staleness |
