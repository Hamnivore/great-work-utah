# Attribute registry

The authoritative list of page metadata. Lint and the view generators parse this file. An attribute exists only if a view consumes it; a vocabulary value is added by adjudicating a real case (see `conventions.md`). Headers are bold-prefix lines after the H1: `**Key:** value`.

| Attribute | Applies to | Required | Vocabulary | Consumed by |
|---|---|---|---|---|
| Type | all pages | yes | venture · person · helper · resource · work · guide · source | type indexes, master index, templates lint |
| Status | all pages | yes | Stub · Draft · Useful — page maturity; see "Status and Confidence" below | trust display |
| Confidence | all except guides | yes | High · Medium · Low — evidentiary support; see "Status and Confidence" below | trust display, index lines |
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

## Status and Confidence

These two are rendered as badges at the top of every prerendered page, so they are the first thing a reader or an arriving agent uses to decide how much weight to put on the page. Both vocabularies are closed and lint-enforced (`invalid-status`, `invalid-confidence`).

### Status — how complete the page is

Status grades the **page**, never the subject and never the facts. It answers "how much of this page is written?", so a reader can check it against the page in front of them.

- **Stub** — a placeholder. The page identifies its subject and little else: sections required by its Type are missing or one line long, and `## Evidence` is empty or holds a single link. Treat it as a pointer that the subject exists and a note that someone should write it; do not expect it to answer a question.
- **Draft** — written but unfinished. The required sections for the Type all exist and say something real, but at least one is thin, a known gap is unfilled, or facets (`Domain`, `Region`, the map tuple) are still unattributed. This is the default for a page produced in one research pass and not returned to, and it is where most of the corpus sits.
- **Useful** — complete for its Type. Every required section is present and substantive, each load-bearing claim has an Evidence line behind it, and `## Open Questions` names what is still unknown instead of leaving the gap silent. A reader can act on the page without first going to another one.

**Status is not a fact-verification claim.** No value here means a human checked the facts. Pages are merged by one maintainer who catches nonsense and off-scope material; that gate does not fact-check sentences. `Reviewed` was in this registry until 2026-07-27, was never used by any page, and is retired precisely because it implied a review that does not happen. Verification lives in Confidence and in `## Evidence`.

Status is written by whoever last edited the page, and it should be raised only by editing the page up to the next definition — never as an assertion about the subject's own health or activity. A dormant company can have a Useful page; a thriving one can have a Stub.

### Confidence — how well the cited evidence supports the claims

Confidence grades the **evidence**, read against the page's `## Evidence` section (on `Type: source` pages, against the artifact itself and `## Reliability Notes`). A load-bearing claim is a sentence a reader would repeat or act on: what the entity does, what it built, the number, the date, the location, the current state.

- **High** — every load-bearing claim traces to a primary or official source cited on the page: the entity's own site or filing, an SEC or state corporate filing, a peer-reviewed paper, a government dataset or award record, a court document, a statute. Where sources conflict, the page says which it followed and why.
- **Medium** — sourced, but one link in the chain is weaker: secondary reporting (trade press, local news, a university press release) standing in for the primary record; an official source that is plainly out of date; or a page where most claims are well cited and a named minority are not. This is the honest default for a page assembled from public reporting rather than documents.
- **Low** — the evidence does not carry the claims. A single source; a source that only repeats what the page asserts (self-description, marketing copy); material inference from adjacent facts; or a source that could not be retrieved and verified. Follow the Evidence links before repeating anything from a Low page.

Two rules keep the grade auditable. **Grade to the weakest load-bearing claim, not the average** — one unsupported number in an otherwise well-cited page makes it Medium. And **only sources move the grade**: adding citations raises Confidence, adding prose does not. If a page's Confidence and its Evidence section disagree, the Evidence section is right.

### They are orthogonal

Status and Confidence measure different things and move independently. Any of the nine combinations is legitimate; neither is a tiebreaker for the other.

- **Stub + High.** A page created the day a program is authorized, carrying the program's name, its authorizing bill number, and one Evidence line pointing at the enrolled statute. Nothing is written — no Who It's For, no How To Use It — so it is a Stub. The one claim it makes is carried by the primary document it cites, so it is High. Writing the rest of the page will not raise its Confidence; finding out whether the program actually opened will.
- **Useful + Low.** `araknitek-official-website.md` is finished: it states plainly that no official URL could be confirmed, records what the venture page's claims actually rest on (the USU Randy Lewis lab's research record, not the company's own materials), and says what would resolve it. There is nothing left to write, so it is Useful. What it rests on is a lab's publication record and inference about a spinout that may be dormant, so it is Low. Citing more sources would raise it to Medium; adding sections would only make it longer.
