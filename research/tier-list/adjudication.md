# Adjudication — first corpus-wide tier run, 2026-08-11

Hand review of the batch output. 485 fact pages rated by 15 subagents against `wiki/meta/tiers.md`
and `anchors.md`; every `S` and `A` re-reviewed here, plus every `[FLAG:]` and `[BOUNDARY:]` the
raters raised. Applied tiers are the merge of `results/*.tsv` with `adjudications.tsv` overriding.

## Final distribution

| Tier | Pages | Share |
|---|---|---|
| S | 13 | 2.7% |
| A | 24 | 4.9% |
| B | 54 | 11.1% |
| C | 121 | 24.9% |
| D | 232 | 47.8% |
| F | 36 | 7.4% |
| unranked | 5 | 1.0% |

11 pages carry the `*` hype bump. `S` at 2.7% sits under the 4% drift guardrail without anyone
targeting it, and the `C`/`D` mass is where the rubric says it should be. The shape is a real tier
list rather than a curve.

## The one rubric change this run forced

Three pages came back `A` on ruling 4 (an unproven bet keeps its ceiling) with arguments that were
individually reasonable and collectively wrong: `curza`, `halia-therapeutics`, `rodatherm-energy`.
Each argued "if this works, the world changes" — true, and true of every credible competitor chasing
the same prize. Ruling 4 as written had no way to say so, and would have promoted every plausible
preclinical company to `A`, which would empty `A` of meaning.

**Fix went into the ruling, not the pages:** the counterfactual applies to the bet too — the ceiling is
the prize divided by the number of credible pursuers, so `A` for a bet requires a *distinctive* claim
on it. `fervo-energy` (the only 500 MW EGS plant under construction) and `zanskar-geothermal` (an
independently reported blind-system confirmation, first in thirty years) clear that bar; the three
above are `B`. This is E11 working as designed: divergence between raters was a gap in the rubric.

## S tier, defended

All 13 stand. `browning-firearms-designs`, `harvey-fletcher-stereophonic-sound`, and
`thiokol-solid-rocket-motors` were raised as `S vs A` boundaries and all three resolve to `S`:

- **Browning** — the M1911, BAR, and M2 are in service on every continent a century after design.
  Permanence is a hundred years of essentially unmodified mechanisms. Ruling 2 magnitude case.
- **Fletcher** — stereo is in every recording and pair of headphones on earth, and the psychoacoustics
  under it is the basis of audio engineering and audiometry. Blumlein was patenting stereo at EMI in
  parallel, so the counterfactual is partial — which is precisely the `capecchi-gene-targeting` shape
  (three Nobel co-recipients) and lands in the same place. Ranked as the invention the page is named
  for, per ruling 1's sub-ruling on work done outside Utah.
- **Thiokol** — Shuttle SRBs plus the solid stages of Minuteman and Polaris. See the overlap note
  below; the overlap is a framing defect and demoting for it would encode a page-structure problem as
  an impact judgment.

Four `S` pages are consequential in directions the corpus does not endorse — `bingham-canyon-mine`,
`northrop-grumman-promontory`, `thiokol-solid-rocket-motors`, `browning-firearms-designs` — and
`myriad-genetics-brca` sits there partly on patent enforcement that suppressed rival tests until 2013.
That is ruling 2 doing its job. A ladder that flinched would rank Utah's most consequential work below
its most agreeable work.

Notably **absent** from `S`: `evans-and-sutherland` (`A`), because the Catmull/Warnock/Clark diaspora
is counted under `utah-computer-graphics-program` — the rater applied ruling 8's no-double-counting
logic to an org pair unprompted, which is the clearest signal the rubric transferred.

## Structural findings: the ladder audited page framing

Ruling 1 predicted this and it happened at scale. **12 pages share an atom with another page**, which
double-counts the same displacement — the thing ruling 8 forbids for person/company pairs. Each needs a
merge or a re-scope, and none is a tiering error:

| Pages | Problem |
|---|---|
| `1mc-salt-lake` · `1-million-cups-salt-lake` · `1-million-cups-orem` | Three pages, one program. Raters flagged them independently in different batches. |
| `utah-small-business-credit-initiative-usbci` · `utah-small-business-credit-initiative` | Same program, slug variants. |
| `uttr` · `utah-test-and-training-range` | Same range; one page points at the other as "the deeper institutional history". Both `A`. |
| `thiokol-solid-rocket-motors` · `northrop-grumman-promontory` | Same site and program lineage across an ownership change. Both `S`. |
| `army-short-range-reconnaissance-uas` · `teal-drones` | Program-of-record page whose substance is one vendor's manufacturing role. |
| `autonomous-low-collateral-counter-uas-interception` · `fortem-technologies` | Same product, same displacement, two pages. |
| `high-density-sustainable-aviation-fuels` | Bundles `cleanjoule` and `cyclokinetics`, which have their own pages. |
| `cyclokinetics` · `cleanjoule` | May be one facility and a defense-facing brand rather than two entities. |
| `university-of-utah-pivot-center` · `university-of-utah-technology-licensing-office` | Redirect duplicate. |
| `the-mill-entrepreneurship-center` · `salt-lake-community-college-slcc-the-mill` | Same campus, same website. |
| `southeastern-utah-association-of-local-governments-economic-development` · `southeastern-association-of-local-governments` | Same Price office and revolving loan fund. |
| `visit-utah` · `utah-office-of-tourism` | Consumer marketing arm of the same office. |

**3 pages carry two atoms that cannot share one tier** and should split: `wordperfect-and-novell`
(NetWare's ceiling is not WordPerfect's), `utah-film-industry` (a century of location cinema vs. a
state film office and crew economy), `deseret-book-bonneville` (publisher + broadcaster + newspaper).
`varda-space` oscillates between the company and the single W-1 landing, and ranks differently
depending which one the page means.

**2 pages are titled for a global corporation while existing here because of a Utah site**, which two
raters hit independently and resolved differently — the clearest inter-rater divergence in the run.
`hexcel` was ranked as the corporation ("world's largest producer of aerospace carbon fiber") on the
grounds that the page keeps a global frame; `sword-health` was ranked as the company with a note that
scoping the atom to its Salt Lake hub would drop the tier. Both raters reasoned from the `adobe`
anchor and reached opposite conclusions about which thing they were ranking, which means ruling 1 was
under-specified rather than that either rater was careless. **Fixed in the ruling:** a multinational's
atom in this corpus is its Utah operation unless the page argues otherwise, and `adobe` is the pattern
to copy. The assigned tiers (`hexcel` `B`, `sword-health` `C`, `adobe` `B`) survive the clarification;
the two pages need re-framing, not re-ranking.

**8 pages have no established Utah presence**, which is a corpus-membership question and not a tier:
`auticon-us` (Sacramento address; the Salt Lake placement traces to a Best-of-State list error),
`imagine-learning`, `intan-technologies` (Los Angeles; the tie is the founder's U of U training),
`jump-aero` (Petaluma), `splunk` (all location fields read "unknown"), plus `bbcetc` and `rqm-plus`
(out-of-state vendor recommendations typed as Utah entities). Adjudicating these needs
`conventions.md`, not `tiers.md`.

**4 type/placement mismatches:** `great-salt-lake` is `Type: venture` for a natural system —
there is no better type in the current vocabulary, and this is the clearest gap the run found in the
type set. `choice-humanitarian` is an operating NGO typed `helper`, which ruling 5 reserves for paid
advisors. `sandbox` is a university education program typed `venture`. `cynosure` is an institutional
asset manager filed as a founder-facing enabler.

**8 pages are dead, stale, or unverifiable at the URL level:** `vision-iron-county`, `morgan-chamber-of-commerce`,
`indie-square`, `pitted-ventures` (403), `renaissance-ag` (Website is now a LinkedIn profile),
`overstock-com` (title and slug are a retired brand; the entity is Bed Bath & Beyond, Inc.),
`bioenergenix` (likely defunct), `first-step-entrepreneur` / `fstep-idea-explorer` (unverified FSTEP
providers removed from Startup State). Feed these to `npm run links:recover` rather than trusting a
failed fetch.

**4 pages are not entities at all** and `F` is doing exactly what ruling 7 says it does — they may still
be useful listings: `coworking-space-in-salt-lake-city-offices-net` and
`salt-lake-city-office-space-for-rent` (third-party brokerage directories), `startup-state-resource-list`
(a directory filter layer), `stopfakes-gov` (federal guidance with no Utah presence),
`a-tech-home-plans`, `veteran-owned-business-registration-utah` (a registry listing),
`university-of-utah` (institutional navigation node).

## The escape hatch got used correctly

Five pages came back `unranked`, all for the right reason — the page cannot establish that there is an
entity to argue bounds about: `araknitek` (nothing establishes it currently exists, "however large
spider silk's ceiling is"), `evolution-bio`, `innosys` (its own Open Questions ask whether the company
still exists; both domains fail TLS), `interval-ai`, `nielson-scientific` (Focus reads "deep tech
(domain unknown)"). Not one rater used `unranked` as a synonym for "low", which was the failure mode
worth worrying about.

## Hype bumps

11, and they land where ruling 9 said they would — mostly at the bottom, rescuing pages that are
disproportionately worth reading: `pons-fleischmann-cold-fusion` (`A*`, the worked case),
`spiral-jetty` (`B*`), `yesco` (`C*`, Las Vegas neon, on an argument that says "on pure displacement it
is D"), `iomega-zip-drive` (`C*`), `carv`, `intactis-bio`, `apa-sherpa-everest-summits`,
`cto-breakfast-utah` (`D*`, for Chatham House Rules at a monthly breakfast), `southern-utah-code-camp`,
`forge-utah`, `clint-betts`. No rater tried for `S*`.

## What transferred and what did not

Transferred cleanly: magnitude-not-sign (no rater flinched at weapons, surveillance, or extraction);
the enabler counterfactual (the `resource` shelf landed at `D`/`F` without protest); `unranked` as an
honest refusal; ruling 1's atom discipline, which is what produced the duplicate findings above.

Needed the fixes recorded here: ruling 4's ceiling, which was exploitable by any page whose field has a
large prize (watch for it recurring in preclinical biotech and climate hardware, where "if this works"
arguments are cheap and abundant), and ruling 1's silence on multinationals with a Utah site.

Two pages worth a second look on their own merits, both surfaced by raters as candidates for veto
rather than as findings. `utah-congregate-care-oversight-reform` sits at `B` rather than `A` because its
national-standard breadth rests on APM Reports figures the page itself says it could not confirm — that
is ruling 3 biting on the multiplier rather than on the reform, which is the right call but a thin one.
`symbiocelltech` sits at `B` on a functional-T1D-cure ceiling corroborated by a published paper and a
canine pilot, while its Phase I timeline still reads "aiming to begin in 2023"; that staleness is the
falsifiable case for `C` and would be settled by a single check of whether the trial opened.

One page needs a status check before its tier means anything: `choice-humanitarian`'s own homepage says
U.S. operations have ceased, which the rater caught while flagging the `helper` type mismatch.

One process note worth keeping: raters put `[BOUNDARY:]` and `[FLAG:]` notes in the tier column rather
than the argument column often enough that `scripts/apply-tiers.mjs` absorbs the deviation instead of
rejecting it. Rejecting would have cost six re-runs to recover judgment that was already correct.
