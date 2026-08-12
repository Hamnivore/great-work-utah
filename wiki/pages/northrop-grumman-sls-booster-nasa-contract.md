# Source: NASA SLS Booster Contract NNM07AA75C

**Type:** source
**Status:** Useful
**Confidence:** High
**Source Type:** government-record
**URL:** https://www.usaspending.gov/award/CONT_AWD_NNM07AA75C_8000_-NONE-_-NONE-
**Publisher:** USAspending.gov (U.S. Department of the Treasury), from NASA's contract reporting to FPDS
**Retrieved:** 2026-08-12
**Updated:** 2026-08-11

## Summary

The federal award record for NASA contract **NNM07AA75C** — the five-segment solid rocket booster
contract held by **Northrop Grumman Systems Corporation** and performed in **Corinne, Box Elder
County, Utah**. It began as the Ares I first stage under Constellation and is now the Space Launch
System booster contract: modifications through 2026 are described in the award's own transaction
record as "SPACE LAUNCH SYSTEM (SLS) BOOSTER."

This is the record that ties the booster program to a Utah place of performance. Northrop Grumman's
Form 10-K names Corinne as a Space Systems location and names the SLS booster program, but never
connects the two; this award does, with a street address, a county, and a dollar figure.

## Useful Claims

- Award identity: PIID **NNM07AA75C**, a definitive contract (award type D), signed **2007-08-10**,
  period of performance **2006-04-17** through **2026-12-31**, NAICS **336415** ("Guided Missile and
  Space Vehicle Propulsion Unit and Propulsion Unit Parts Manufacturing").
- Recipient: **Northrop Grumman Systems Corporation**, UEI **LRVQERN7YNH9**, at **9160 N Hwy 83,
  Corinne, UT 84307** (Box Elder County). Parent recipient: **Northrop Grumman Corporation**, UEI
  **NKVZLJL93QT6**.
- Place of performance: **Corinne, Box Elder County, Utah**, ZIP 84307, congressional district UT-01.
  This is a Utah-performed contract, not a Utah-headquartered company's out-of-state work.
- Money: **$4,430,784,857** obligated to date, against a base-and-all-options value of
  **$4,474,280,956** — one of the largest single federal awards performed in Utah.
- Scope, from the contract description: development, qualification, certification and acceptance of a
  first stage that "will be a five segment, solid rocket booster derived from the Space Shuttle
  Program (SSP) Solid Rocket Booster (SRB)/Reusable Solid Rocket Motor (RSRM)," including five
  full-scale ground static test motors — two development motors and three qualification motors — plus
  a structural test article and ground vibration test motors.
- The work is current, and it is SLS: the most recent modifications in the award's transaction record
  are **modification 420, dated 2026-06-30**, each described as "SPACE LAUNCH SYSTEM (SLS) BOOSTER,"
  with obligations still flowing in 2026.
- Competition: not competed. Extent competed **C** ("NOT COMPETED"), other-than-full-and-open reason
  "ONLY ONE SOURCE-OTHER (FAR 6.302-1 OTHER)", one offer received. The award record is therefore also
  the government's own documentation that it treats this capability as sole-source.

## Verbatim

From the award record and its transactions, exactly as the API returns them:

```
piid                     NNM07AA75C
type_description         DEFINITIVE CONTRACT
date_signed              2007-08-10
period_of_performance    2006-04-17 to 2026-12-31
total_obligation         4430784857.0
base_and_all_options     4474280956.0
recipient_name           NORTHROP GRUMMAN SYSTEMS CORPORATION
recipient_uei            LRVQERN7YNH9
recipient address        9160 N HWY 83, CORINNE, UT 84307-9501, BOX ELDER county
parent_recipient_name    NORTHROP GRUMMAN CORPORATION
parent_recipient_uei     NKVZLJL93QT6
place_of_performance     CORINNE, UT 84307, BOX ELDER county, congressional district 01
naics                    336415  GUIDED MISSILE AND SPACE VEHICLE PROPULSION UNIT AND PROPULSION UNIT PARTS MANUFACTURING
major_program            ARES I FIRST STAGE
extent_competed          C  NOT COMPETED
other_than_full_and_open ONE  ONLY ONE SOURCE-OTHER (FAR 6.302-1 OTHER)
number_of_offers_received 1
```

Contract description, verbatim:

```
FIRST DDT AND E, ARES I-X, AND FLIGHT TESTS.  FIRST STAGE WILL BE A FIVE SEGMENT, SOLID ROCKET
BOOSTER DERIVED FROM THE SPACE SHUTTLE PROGRAM (SSP) SOLID ROCKET BOOSTER (SRB)/REUSABLE SOLID
ROCKET MOTOR (RSRM). THE CONTRACTOR SHALL FURNISH THE NECESSARY MANAGEMENT, ENGINEERING, LABOR,
FACILITIES, TOOLS, EQUIPMENT, AND MATERIALS REQUIRED FOR FIRST STAGE DEVELOPMENT, QUALIFICATION,
CERTIFICATION AND ACCEPTANCE PROGRAM.
```

Most recent transactions (action date, modification number, obligation, description):

```
2026-06-30  420  0.0        SPACE LAUNCH SYSTEM (SLS) BOOSTER
2026-05-27  418  5000000.0  SPACE LAUNCH SYSTEM (SLS) BOOSTER
2026-03-26  414  2000000.0  SPACE LAUNCH SYSTEM (SLS) BOOSTER
```

## Reliability Notes

Primary tier at a host that must keep it: USAspending is the statutory public record of federal
awards, assembled from the agency's own FPDS reporting, and an award stays retrievable by its unique
award ID.

What it does and does not establish. It **does** establish that a multi-billion-dollar NASA
solid-rocket-booster contract is performed at a Box Elder County address by Northrop Grumman Systems
Corporation, and that the current work is SLS booster work. It **does not** establish anything about
the motor's dimensions, thrust, or test history, nor about site employment: federal award records
carry money, dates, places, and codes, not engineering specifications. The site name "Promontory"
appears nowhere in the record; the tie is the Corinne mailing address, which the company also reports
to the SEC as a Space Systems location.

Two data cautions. The contract **description is the original 2006 Ares I scope** and was never
rewritten when the program became SLS — which is why the description and the recent modification
titles disagree, and why the transaction record rather than the description is what dates the work.
And obligations are cumulative across two decades and many modifications, so the total is not an
annual figure; USAspending's outlay figures on older awards are also incomplete, because linkage to
federal-account outlays only began part-way through this contract's life.

To re-check:

```bash
curl -s https://api.usaspending.gov/api/v2/awards/CONT_AWD_NNM07AA75C_8000_-NONE-_-NONE-/ \
  | jq '{piid, total_obligation, recipient: .recipient.recipient_uei, pop: .place_of_performance}'
```

## Related Pages

- [Northrop Grumman — Promontory Facility](northrop-grumman-promontory.md)
- [Source: Northrop Grumman Form 10-K, Fiscal Year 2025](northrop-grumman-10k-fy2025.md)
- [NASA Thiokol Solid Rocket Boosters](nasa-thiokol-solid-rocket-boosters.md)
