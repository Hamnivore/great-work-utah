# Source: FDA Establishment Registration — Bunnell Incorporated

**Type:** source
**Status:** Useful
**Confidence:** High
**Source Type:** government-record
**URL:** https://api.fda.gov/device/registrationlisting.json?search=proprietary_name:%22LIFE+PULSE%22&limit=1
**Publisher:** U.S. Food and Drug Administration (openFDA device registration and listing)
**Retrieved:** 2026-08-11
**Updated:** 2026-08-11
**Relates:** cites [Bunnell Incorporated](bunnell-incorporated.md) · https://greatutah.work/pages/bunnell-incorporated.md · https://api.fda.gov/device/registrationlisting.json

## Summary

FDA's device establishment registration and listing record for the Life Pulse ventilator, retrieved
2026-08-11. It exists to answer one question the company's own website could only assert: whether
Bunnell actually manufactures in Utah, or merely sells hardware built elsewhere. FDA registers the
physical establishment, so the record is independent of the company's marketing.

Class A source: re-derivable by re-running the query above, or by searching FDA's registration
database for FEI 3032745446.

## Useful Claims

- **Owner/operator: BUNNELL INCORPORATED.** Establishment name "Cutler Campus."
- **Establishment type includes "Manufacture Medical Device"** (also "Complaint File Establishment
  per 21 CFR 820.198"). This is the load-bearing field: FDA classifies the site as a manufacturing
  establishment, not solely a distributor or complaint-handling office.
- **Registration number / FEI: 3032745446**, status code 1, registration year **2026** — an active
  registration at retrieval, not a lapsed historical record.
- **Address: 330 North Cutler Dr, North Salt Lake, UT 84054**, matching the company's published
  address and distinct from the 1988 PMA record's 436 Lawndale Dr., Salt Lake City.
- Listed product code: **LSZ**, the same high-frequency ventilator code as the
  [Life Pulse PMA](bunnell-fda-life-pulse-pma.md).

## Verbatim

Structured API fields rather than prose; the values above are quoted from the response's
`owner_operator.firm_name`, `establishment_type`, `registration_number`, `fei_number`,
`status_code`, `reg_expiry_date_year`, `name`, `address`, and `products[].product_code`. No excerpt
is carried because the document is a JSON record, re-derivable by identifier.

## Reliability Notes

Primary tier: FDA's own registration data, at FDA's own host, keyed to a durable establishment
identifier.

What it establishes is narrower than it looks, and worth stating precisely. A registered
manufacturing establishment at a Utah address means FDA recognizes device manufacturing there. It
does **not** establish what share of the device is built on site versus assembled from outsourced
subassemblies, nor headcount, nor output. It is sufficient to retire the weaker question — whether
the company is a Utah sales office for hardware made elsewhere — and insufficient to characterize the
depth of the manufacturing.

The same openFDA disclaimer applies as on the PMA record: openFDA states its extracts are
unvalidated and should not be relied on for decisions regarding medical care. For regulatory-critical
use, confirm against FDA's establishment registration database directly.

## Related Pages

- [Bunnell Incorporated](bunnell-incorporated.md)
- [Source: FDA PMA Record — Bunnell Life Pulse](bunnell-fda-life-pulse-pma.md)
