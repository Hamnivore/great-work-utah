# Ingest queue — carried over from the 2026-08-11 scrape ingest

Researched but unwritten, or written but unverifiable. Everything here has had the research done at
least once; none of it needs re-deriving from scratch. Ordered roughly by value.

Source of the queue: `~/coding/scrapers/ingest/out/candidates.md` (110 candidates, all triaged) plus a
second extraction described below. Citation policy for anything Slack-sourced is normative in
`wiki/meta/attributes.md`, "Community-channel testimony" — **Sandbox Slack is never a source.**

---

## 1. Five Utah community pages — researched, not written

All five sites were fetched on 2026-08-11 and the facts below were read off them. They need writing up
as `Type: resource` pages using the house template (`Summary · Who It's For · What It Provides · How
To Use It · Cost / Eligibility · Best Fits · Evidence · Open Questions`), each with a captured
`official-page` source page.

| Slug | What was found |
|---|---|
| `cto-breakfast-utah` | `ctobreakfast.com/communities/utah/`. Utah chapter "running for over 20 years"; second Friday, 8:00 AM, IHOP in American Fork. Norms are the interesting content: go dutch, one conversation at a time, **Chatham House Rules**, no politics or religion, intros every meeting. Slack (Forge Utah `#localevents`, Derek Carter) corroborates the cadence and shows a 2026 schedule wobble — May 8, then June 5 as a *first* Friday "CHANGE", then back to July 10 as the usual second Friday. Multi-city site; the Utah chapter is the atom. |
| `southern-utah-code-camp` | `southernutahcodecamp.com`. 24-hour hackathon, teams of 1–4, **Nov 13–14 2026** at **Vasion** HQ on Tech Ridge, St George, with a Nov 12 pre-flight meeting. Organised by **Tech Threads, INC** — *not* in the IRS Utah exempt-org extract, so likely for-profit or registered elsewhere; worth resolving. Sponsor tiers from $250. Note `vasion` already appears in `3helix.md`. |
| `ai-builder-day` | `aibuilderday.com`. **Part 2 runs Aug 14–15 2026 in Lehi — three days out from this ingest, so write it as upcoming, not past.** Part 1 drew 350+ builders. $35K+ in prizes; Friday to learn, Saturday to build; sponsor "bounty tracks", demos to investors. Organiser Jacob Wright (also MadeThis / JustBuild). Ties to the existing `justbuild.md`. |
| `weber-state-ai-hackathon` | `hackathon.weber.edu`. Site had already rolled to **2027 (March 20)** when fetched, so the 2026 detail survives only in Slack: two-week remote build then in-person finale at Shepherd Union, Ogden; $1,800 prize pool across novice/intermediate/advanced; **$10** ticket; a free-for-employers job fair alongside. Organiser Tristan Rhodes, WSU. The site is thin — Slack is the better source, which is a second worked example of the pattern in `conventions.md` P5 precedent 8. |
| `utah-tech-calendar` | `utahtechcalendar.com`. Statewide "every tech event in the state" calendar. **Resolved:** it is a Forge Utah Foundation property — `forgeutah.tech` presents it as "ours and everyone else's". Built by Benjamin Reece; Clint Berry (Forge president) discussed the domain choice in Slack. `forge-utah.md` already links to it, so this is currently a dangling-link target. Homepage is JS-rendered and returned no text to a plain fetch — needs a browser capture (`npm run links:recover:browser` pattern). |

## 2. Two company pages — partly researched

- **`carv`** — Carv, `getcarv.com`. A **London** company that in Feb 2026 publicly said it was exploring
  a Park City engineering office and ran developer ski days at Deer Valley. Builds a clip-on ski
  sensor doing real-time biomechanical analysis; stack is Rust (backend + on-device), Swift, Kotlin,
  TypeScript. Under location precedent 6 this is `Utah Location: unknown` / `Region: unknown` with the
  uncertainty named. **Open question first:** did the Park City office actually happen? If not, this
  may not be an atom yet.
- **`neumont-college-of-computer-science`** — Salt Lake City CS college, 143 South Main Street. Appears
  in this corpus as the Kids Code Camp venue and is a real Utah institution with no page. Note the
  name drift: "Neumont University" on some pages, "Neumont College of Computer Science" on others.

## 3. Two triage tables that need rebuilding

The agents that did this work died before writing their reports, so pages exist without the reasoning
that justified them. Both tables are cheap to regenerate and make the queue re-runnable.

- **Sandbox triage — done 2026-08-11, and the pool was 2.5× bigger than `candidates.md` showed.**
  Full probed roster: [`queue/sandbox-cohort-triage-2026-08-11.md`](queue/sandbox-cohort-triage-2026-08-11.md)
  (gitignored — it derives from an authenticated scrape of Sandbox's private directory).

  `candidates.md` surfaced **50** Sandbox domains. The real pool is **125 distinct websites** across
  503 teams. Two mechanical causes:
  1. `ingest/extract-companies.mjs` `fromSandbox()` read only `sandbox/data/raw/` and
     `sandbox/data/teams.jsonl` (125 teams, current program year). **It never read
     `sandbox/data/cohorts.jsonl`** — the exhaustive SB02–SB06 crawl, 503 teams, 27 MB, which is by
     far the largest capture.
  2. `candidates.md` was generated at 13:33 and `cohorts.jsonl` finished at 14:02, so the file did not
     exist yet when the queue was built.

  **Both fixed 2026-08-11.** `fromSandbox()` now also walks `cohorts.jsonl`, taking each team's
  `website` field as well as its `external_links` (the cohort records carry a `website` the team pages
  often lack). Re-running `node ingest/extract-companies.mjs` took the queue from **110 to 178** new
  candidates, with the Sandbox slice going **50 → 125** — matching an independent probe of the same
  data exactly, which is the check that the extractor is now complete rather than merely bigger.
  Cohort codes are collected as lead context only and are deliberately not written to any wiki page.

  93 of the 125 never appeared in `candidates.md`; 89 appear nowhere in the wiki. Probe verdicts:
  **63 LIVE · 29 THIN · 16 PARKED? · 17 DEAD.**

  There is **no usable traction signal** to rank them: the Sandbox ratings API returned 403 for most
  cohorts, so the private research wiki's `by-traction` view buckets all 503 as `unknown`. The
  internal metrics that did come through — weekly hours worked, check-in streaks — are private
  performance data about named students and must never be published.

  **The bar — approved by the maintainer 2026-08-11. Apply it; do not re-litigate it.** A LIVE site
  is necessary and *not* sufficient. The wiki holds 127 ventures in total, so 63 student ventures
  would swamp it and bury the entities the charter exists to surface. Promote only on:

  > **a LIVE site, plus at least one corroborating public record independent of the company's own
  > site** — a funding announcement, a Utah Division of Corporations registration, an App Store or
  > Product Hunt listing with real traction, named customers, or independent press.

  A lead that fails the bar stays a lead in the roster file. That is a correct outcome, not a gap.

  Still outstanding: four pages were written from the old 50-domain batch — `bidi-contracting`,
  `furnace-outbound`, `keva-locks`, `vuely` — and **the basis for including those four rather than the
  other 46 is unrecorded**; treat them as unverified until re-checked against the bar above. Watch for
  name collisions with bigger companies: `Nucleus`, `Torus`, `Prism`, `Compli`, `Angler`, `Cherry`,
  `Furnace`, `Ember`, `Horizon`, `Finch` all appear in the roster.
- **51-employer verdict table.** `candidates.md` is keyed on domains mentioned twice or more, so a
  company named in a `#jobs` post linking to a generic ATS is invisible to it. Re-extracting
  `<slack-data>/forgeutah.messages.jsonl` and `justbuilding.messages.jsonl` exports by the
  structured post template yields 51 distinct employers:

  ```
  node -e 'const fs=require("fs");for(const l of fs.readFileSync("<slack-data>/forgeutah.messages.jsonl","utf8").trim().split("\n")){let m;try{m=JSON.parse(l)}catch(e){continue};if(/\*Company Name\*/.test(m.text||""))console.log(m.text)}'
  ```

  Pages exist for Usana, Acima, Neighbor, Les Olson IT, DigiCert, TCN, SalesRabbit, Teiko Bio,
  SubcontractorHub, Halda and others; still unverdicted are Engine, Applause, Crumbl, Jase Medical,
  Uplift Aerospace, SageCreek AI, Haikei Labs, Mango Voice, Zamp, Spot Parking, Katabase, Civic Star,
  Philo Ventures, Xerpa, MTN (`themtn.ai`), Energy4Life. Expected skips (national companies whose
  posting merely appeared in a Utah Slack): Autodesk, Goldman Sachs, NVIDIA, Shopify, Five9, Oklo,
  Obsidian.md, Nagarro, Auction Technology Group, Group1001, Mural Health, Smule, Stable Kernel,
  Extensiv, Everpure/Purestorage, Krazy Coupon Lady, Gauntlet AI, Mechanize Inc, Flexion, Google Cloud.

## 4. The capture gap (blocks nothing, but weakens everything Slack-sourced)

`verbatim-not-in-raw` is the corpus's anti-fabrication check, and on a community-channel testimony page
it silently passes because there is no `raw/` capture to check against — a fabricated Slack quote would
land undetected. Rationale and the recommended fix are in
[`class-c-private-ephemeral-sources.md`](class-c-private-ephemeral-sources.md): a sibling of
`capture-raw-sources.mjs` that reads the scraper's JSONL instead of fetching a URL, and writes the
cited messages into `raw/<slug>/` under the existing immutable `<date>-<hash>` naming. No schema change
needed; `Retrieved:` and `Archive:` stay absent because nothing is re-fetched or crawlable.

Until then, lint should probably stop accruing `missing-archive` / `missing-verbatim` / `missing-raw`
against testimony pages whose URL host is a chat workspace — that debt can never be paid and it
inflates a counter that is meant to mean something.

## 5. Verification owed on pages already written

- **`utahn.md`** — two open questions are the load-bearing ones and both are cheap to answer against
  the site itself: are the bylines actually anonymous, and is AI use disclosed as the charter promises?
  Readers asserted both in July 2026; the wiki correctly does not assert either. Checking them would
  move the page's Confidence.
- **`stratos-data-center.md`** — the 3 GW / 9 GW figures now have primary and self-reported backing
  respectively, but nothing located states Utah's total generation or peak demand, so the comparison
  that circulates in press coverage ("Utah as a whole uses about 4 gigawatts") is still unsourced here.
  EIA is the obvious place to close it.
- **`northern-utah-dotnet-users-group.md`** — the last located announcement is 2026-07-09. Whether the
  cadence survived past July is unknown.
