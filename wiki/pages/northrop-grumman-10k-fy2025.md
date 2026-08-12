# Source: Northrop Grumman Form 10-K, Fiscal Year 2025

**Type:** source
**Status:** Useful
**Confidence:** High
**Source Type:** filing
**URL:** https://www.sec.gov/Archives/edgar/data/1133421/000113342126000003/noc-20251231.htm
**Publisher:** U.S. Securities and Exchange Commission (EDGAR) — Northrop Grumman Corporation
**Retrieved:** 2026-08-12
**Updated:** 2026-08-11

## Summary

Northrop Grumman Corporation's annual report on Form 10-K for the fiscal year ended 2025-12-31,
filed 2026-01-27. CIK **0001133421**, accession **0001133421-26-000003**, primary document
`noc-20251231.htm`. Retrievable from EDGAR by accession number indefinitely, which is why no archive
snapshot is recorded here.

For this wiki the filing does two things no company web page can. Item 2 (Properties) names the
company's major operating locations by segment — including five in Utah — and Item 1 (Business) and
the MD&A name the programs those segments run, with the contract values and the trouble attached to
them, under the accuracy duties that attach to an SEC filing.

## Useful Claims

- **Utah shows up in three of the four segments.** Item 2 lists Space Systems major operations at
  "Clearfield, Corinne, Magna, Salt Lake City and Tremonton, UT"; Defense Systems at "Ogden and Roy,
  UT"; Aeronautics Systems at "Clearfield and Layton, UT"; and Mission Systems at "Salt Lake City,
  UT". **Corinne** is the postal city of the Promontory solid-rocket-motor plant — see Reliability
  Notes on why the filing never uses the word "Promontory".
- Space Systems' key programs include "Development and production of solid rocket motors for NASA's
  Space Launch System (SLS) heavy lift vehicle," the GEM 63 and GEM 63XL solid rocket boosters for
  Atlas V and Vulcan, and medium-class solid rocket motors for the Navy's Trident II fleet ballistic
  missile.
- Defense Systems' key programs include the Sentinel Engineering & Manufacturing Development (EMD)
  program, described as the initial phase of modernizing the ICBM system that will serve as the
  ground-based strategic deterrent of the US nuclear triad.
- Sentinel's contracting history, as the company states it: the Air Force awarded Northrop Grumman a
  **$13.3 billion** contract for the EMD phase in 2020; in January 2024 the Air Force gave
  congressional notification of a Nunn-McCurdy breach review; in July 2024 the program was certified
  for continuation and directed to be restructured, with the command-and-launch segment infrastructure
  named as the main driver of the cost growth. The Production and Deployment phases are "yet to be
  priced and negotiated."
- Booster volume is currently falling, not rising: 2025 Space Systems sales decreased by
  **$102 million** on lower volume on the SLS Booster program, part of an **8 percent** segment sales
  decline.
- Company-wide scale for context: approximately **95,000 employees** as of 2025-12-31, and
  approximately **53 million square feet** of floor space at **446** locations. The filing gives no
  site-level headcount, so it cannot confirm or refute any figure for Promontory specifically.

## Verbatim

Quoted exactly from the filing:

> Development and production of solid rocket motors for NASA's Space Launch System (SLS) heavy lift
> vehicle

— Item 1, Business, Space Systems key programs

> Sentinel Engineering & Manufacturing Development (EMD) program, initial phase of the modernization
> of the intercontinental ballistic missile (ICBM) system that will serve as the ground-based
> strategic deterrent for the U.S. nuclear triad

— Item 1, Business, Defense Systems key programs

> In 2020, the U.S. Air Force awarded Northrop Grumman a $13.3 billion contract for the EMD phase of
> the Sentinel program. In January 2024, the U.S. Air Force provided congressional notification that
> the Sentinel program was under a Nunn-McCurdy breach review, which is required when total program
> cost estimates exceed certain defined thresholds.

— MD&A, Sentinel Program

> Clearfield, Corinne, Magna, Salt Lake City and Tremonton, UT

— Item 2, Properties, Space Systems major operations

> At December 31, 2025, we had approximately 53 million square feet of floor space at 446 separate
> locations, primarily in the U.S., for manufacturing, warehousing, research and testing,
> administration and various other uses.

— Item 2, Properties

> as of December 31, 2025, we have approximately 95,000 employees

— Item 1, Business, Human Capital

> 2025 sales decreased $960 million, or 8 percent, primarily due to wind-down of work on the
> restricted space and NGI programs, which reduced sales by $738 million, as well as a $172 million
> decrease for the SDA satellite programs due to the timing of materials and a $102 million decrease
> driven by lower volume on the SLS Booster program.

— MD&A, Space Systems segment results

> 8 percent

— MD&A, Space Systems segment results

## Reliability Notes

Primary tier: a filing made with the SEC under legal accuracy duties, cited at sec.gov, permanently
retrievable by accession number.

Three limits. **It is corporate, not site-level.** The filing names Corinne as a Space Systems
location and names the SLS booster and Sentinel programs, but it never states what is built where,
how many people work at any plant, or the dimensions and performance of any motor. Nothing on this
page should be read as a Promontory-specific figure. **The filing does not use the name
"Promontory."** The identification of Corinne as the Promontory plant rests on a separate primary
record: the recipient address on NASA contract NNM07AA75C is 9160 N Hwy 83, Corinne, UT 84307, and
that contract's current modifications are described as "SPACE LAUNCH SYSTEM (SLS) BOOSTER" with place
of performance in Box Elder County — see
[Source: NASA SLS Booster Contract NNM07AA75C](northrop-grumman-sls-booster-nasa-contract.md).
**Management's numbers are management's.** The $13.3 billion award value and the segment sales
movements are the company's own accounting of programs it is a party to; the Nunn-McCurdy review is
disclosed because it is material, and the program's total life-cycle cost is not disclosed here at
all. For a total-program cost estimate, the primary records are the Air Force's Selected Acquisition
Report and GAO's annual weapon systems assessment, not this filing.

To retrieve the filing index and confirm the accession:

```bash
curl -s -A "your-contact@example.com" https://data.sec.gov/submissions/CIK0001133421.json \
  | jq -r '[.filings.recent.form, .filings.recent.accessionNumber, .filings.recent.reportDate]
           | transpose | map(select(.[0] == "10-K")) | .[0:3][] | @tsv'
```

## Related Pages

- [Northrop Grumman — Promontory Facility](northrop-grumman-promontory.md)
- [Source: NASA SLS Booster Contract NNM07AA75C](northrop-grumman-sls-booster-nasa-contract.md)
