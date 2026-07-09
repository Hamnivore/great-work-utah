# Attribute registry

The authoritative list of page metadata. Lint and the view generators parse this file. An attribute exists only if a view consumes it; a vocabulary value is added by adjudicating a real case (see `conventions.md`). Headers are bold-prefix lines after the H1: `**Key:** value`.

| Attribute | Applies to | Required | Vocabulary | Consumed by |
|---|---|---|---|---|
| Type | all pages | yes | venture · person · helper · resource · work · guide · source | type indexes, master index, templates lint |
| Status | all pages | yes | Draft · Reviewed | trust display |
| Confidence | all except guides | yes | High · Medium · Low | trust display, index lines |
| Focus | all except sources | yes | free tags, comma-separated | index lines, shortlisting |
| Domain | venture, person, helper, resource, work | rollout in progress | energy · health-bio · aerospace-defense · computing · materials-mfg · space-science · capital-programs · culture-place — first entry is primary | sector hubs, facet indexes |
| Region | venture, person, helper, resource, work | rollout in progress | Utah city; county for field/distributed; `statewide`; `out-of-state (Utah operations: <place>)`; area label; `unknown (Utah)` | by-region view |
| Needs-reviewed | any page with `## What They Need Now` | yes (with that section) | `YYYY-MM-DD` | needs board staleness flags |
| Ownership | venture | optional (candidate for required) | founder-led private · private · public · PE-owned · nonprofit · government | judgment layer (see charter.md) |
| Domain-flagged | any | no | `review` | lint queue for editor adjudication |
| Updated | all pages | yes | `YYYY-MM-DD` | index lines, staleness |
