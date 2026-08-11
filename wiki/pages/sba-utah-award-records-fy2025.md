# Source: SBA Awards in Utah, FY2025 (USAspending)

**Type:** source
**Status:** Useful
**Confidence:** High
**Source Type:** dataset
**URL:** https://api.usaspending.gov/api/v2/search/spending_by_award_count/
**Publisher:** USAspending.gov (U.S. Department of the Treasury), from Small Business Administration award reporting
**Updated:** 2026-08-11

## Summary

What the Small Business Administration actually did in Utah in fiscal year 2025, from the federal
award record rather than from the agency's description of itself. Two queries against USAspending —
one for award counts, one enumerating the grant-category awards — filtered to awarding agency
**Small Business Administration**, place of performance **Utah**, and the FY2025 window
**2024-10-01 to 2025-09-30**.

This exists because an SBA district office page is otherwise sourced entirely to `sba.gov`, which is
good evidence of what SBA says it offers and no evidence of volume or of which Utah organizations
actually carry the work. The award record answers both: guaranteed lending happens at four-figure
annual scale in Utah, and the counseling network the district office refers people to is a named,
funded list of grantees.

## Useful Claims

- SBA awards with a Utah place of performance and at least one FY2025 transaction, by category:
  **1,964** loans, 198 direct payments, 9 grants, and 7 contracts. Loan guarantees, not grants, are
  what SBA does at scale in Utah, by three orders of magnitude.
- The Utah SBDC network is SBA-funded through **Utah State University**: award **SBAHQ25B0017**,
  "UTAH SMALL BUSINESS DEVELOPMENT CENTER PROGRAM", **$1,695,762**, period 2025-01-01 to 2026-12-31.
  A separate CARES Act SBDC award to the same recipient, **SBAHQ20C0063** at **$1,562,273**, still
  carried FY2025 transactions.
- The state's own economic-development office is an SBA grantee: **SBAHQ24G0044**, recorded as "FAST
  AWARDEE-GOVERNORS OFFICE OF ECONOMIC OPPORTUNITY", **$294,420.33**, running 2024-09-30 to
  2029-09-29. The record gives only the acronym; do not expand it here without checking SBA's program
  documentation.
- Other FY2025 grant-category recipients, with the award descriptions as recorded: **Utah
  Microenterprise Loan Fund** (SBAHQ25Y0131, **$151,000**); **Salt Lake Area Chamber of Commerce**
  twice, at **$150,000** each, one labeled Salt Lake City and one Cedar City (SBAHQ25W0012,
  SBAHQ25W0018); **Warrior Rising** (SBAHQ25V0042, **$105,000**, "SDVETP-2025"); and **Salt Lake
  Community College** (SBAHQ25V0035, **$75,000**, "FY25 WVETP-").
- "An SBA loan" is several different programs in this data. The largest FY2025 Utah loan record by
  face value is **$25,855,000** of SBIC leverage to Signal Peak Ventures IV-A, L.P. (Salt Lake County
  place of performance) — a guarantee on a venture fund's borrowing, not a small-business term loan.
  The set also includes surety bond guarantees (**$6,824,724.18** to T.W.S. Construction) and
  debenture-financed fixed-asset lending, which is the 504 program's mechanism as the record
  describes it (**$5,500,000** to Beehive Meals).

## Verbatim

Award counts, from `POST https://api.usaspending.gov/api/v2/search/spending_by_award_count/`,
returned exactly:

```
{"results": {"contracts": 7, "direct_payments": 198, "grants": 9, "idvs": 0, "loans": 1964,
 "other": 0}, "spending_level": "awards"}
```

Grant-category awards (types 04 and 05), from
`POST https://api.usaspending.gov/api/v2/search/spending_by_award/`, as returned
(`Award ID | Recipient Name | Award Amount | Description`):

```
SBAHQ25B0017 | UTAH STATE UNIVERSITY | 1695762.0 | UTAH SMALL BUSINESS DEVELOPMENT CENTER PROGRAM
SBAHQ20C0063 | UTAH STATE UNIVERSITY | 1562273.0 | UTAH SBDC CARES ACT
SBAHQ24G0044 | GOVERNOR'S OFFICE OF ECONOMIC OPPORTUNITY | 294420.33 | FAST AWARDEE-GOVERNORS OFFICE OF ECONOMIC OPPORTUNITY
SBAHQ25Y0131 | UTAH MICROENTERPRISE LOAN FUND | 151000.0 | UTAH MICROENTERPRISE LOAN FUND - UT
SBAHQ25W0018 | SALT LAKE AREA CHAMBER OF COMMERCE | 150000.0 | SALT LAKE AREA CHAMBER OF COMMERCE (CEDAR CITY)
SBAHQ25W0012 | SALT LAKE AREA CHAMBER OF COMMERCE | 150000.0 | SALT LAKE AREA CHAMBER OF COMMERCE (SALT LAKE CITY)
SBAHQ25V0042 | WARRIOR RISING | 105000.0 | SDVETP-2025 WARRIOR RISING
SBAHQ25V0035 | SALT LAKE COMMUNITY COLLEGE | 75000.0 | FY25 WVETP- SALT LAKE COMMUNITY COLLEGE
```

The three largest FY2025 Utah loan records, from the same endpoint with `award_type_codes` `07` and
`08` (`Award ID | Recipient Name | Loan Value | Place of Performance City Code`), with the recorded
award-type text:

```
7846039110       | SIGNAL PEAK VENTURES IV-A, L.P.  | 25855000.0 | UT**035
   AWARDTYPE: GUARANTEED/INSURED LOANS ... LICENSED AND REGULATED SBICS USE THEIR OWN CAPITAL, PLUS
   FUNDS BORROWED WITH AN SBA GUARANTEE, TO MAKE EQUITY AND/OR DEBT INVESTMENTS IN ELIGIBLE SMALL
   BUSINESSES
25E2089914360001 | T.W.S. CONSTRUCTION INCORPORATED | 6824724.18 | UT**019
   AWARDTYPE: GUARANTEED/INSURED SURETY BONDS ... GUARANTEE SURETY BONDS
7807369101       | BEEHIVE MEALS                    | 5500000.0  | UT**057
   AWARDTYPE: GUARANTEED/INSURED LOANS ... LONG-TERM, FIXED-RATE FINANCING FOR FIXED ASSETS THROUGH
   THE SALE OF DEBENTURES TO PRIVATE INVESTORS
```

## Reliability Notes

Primary tier. These are the government's own award records, published under the DATA Act at a host
obliged to keep them, and each award stays retrievable by its award ID at
`https://www.usaspending.gov/award/ASST_NON_<award-id>_073`.

Five limits, and the first two are the reason this page enumerates a query rather than asserting a
total.

**The counts and the enumeration disagree by one.** The count endpoint returns 9 in the grants
bucket; the award search restricted to grant types 04 and 05 returns the eight rows above. The ninth
is not surfaced by the search, and rather than guess at it, this page reports both numbers as
returned. **"FY2025" here means transactions, not awards started.** The filter selects awards with
activity in the window, which is why a 2020 CARES Act award and a five-year FAST award both appear;
none of these figures is an annual obligation. **Amounts are award-level, not disbursed.** For loans,
USAspending's face value is the guaranteed amount, not government outlay or the borrower's balance.
**Place of performance is as reported**, so an award to a national organization serving Utah may sit
outside this slice, and a Utah recipient serving several states may sit inside it. **Program names
are acronyms in the record** — FAST, SDVETP, WVETP — and this page reproduces them without expanding
them, because the record does not.

To re-check:

```bash
curl -s -X POST https://api.usaspending.gov/api/v2/search/spending_by_award_count/ \
  -H 'Content-Type: application/json' \
  -d '{"filters":{"agencies":[{"type":"awarding","tier":"toptier","name":"Small Business Administration"}],
       "place_of_performance_locations":[{"country":"USA","state":"UT"}],
       "time_period":[{"start_date":"2024-10-01","end_date":"2025-09-30"}]},"spending_level":"awards"}'
```

## Related Pages

- [SBA Utah District Office](sba-utah-district-office.md)
- [SBA Utah District Office Page](sba-utah-district-office-source.md)
- [Utah Governor's Office of Economic Opportunity](utah-governor-s-office-of-economic-opportunity.md)
