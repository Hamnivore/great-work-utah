# Source: FDA PMA — Life Pulse High Frequency Ventilator (P850064)

**Type:** source
**Status:** Useful
**Confidence:** High
**Source Type:** government-record
**URL:** https://api.fda.gov/device/pma.json?search=applicant:%22Bunnell,+Inc.%22+AND+pma_number:P850064&limit=20
**Publisher:** U.S. Food and Drug Administration (openFDA)
**Updated:** 2026-08-11
**Relates:** cites [Bunnell Incorporated](bunnell-incorporated.md) · https://greatutah.work/pages/bunnell-incorporated.md · https://api.fda.gov/device/pma.json?search=applicant:%22Bunnell,+Inc.%22+AND+pma_number:P850064&limit=20

## Summary

FDA Premarket Approval record for Bunnell's Life Pulse high-frequency ventilator. The original PMA
**P850064** was approved **1988-06-30** for the **MODEL 203 LIFE PULSE HIGH FREQUENCY VENTILATOR**,
product code **LSZ** (Ventilator, High Frequency), device class **3**. The applicant address on the
original record is **436 Lawndale Dr., Salt Lake City, UT 84115** — an older address than the
company's current published site.

## Useful Claims

- **PMA number:** P850064 (original approval; dozens of supplements follow in openFDA).
- **Applicant:** Bunnell, Inc.
- **Trade name (original):** MODEL 203 LIFE PULSE HIGH FREQUENCY VENTILATOR.
- **Generic name:** VENTILATOR, HIGH FREQUENCY.
- **Product code:** LSZ · **Device class:** 3 · **Decision code:** APPR.
- **Date received:** 1985-09-04 · **Decision date:** 1988-06-30 · **Docket:** 88M-0263.
- **Applicant address on original record:** 436 Lawndale Dr., Salt Lake City, UT 84115.
- **Four original LSZ PMAs exist, but only two remain in force — the decision code is what separates
  them.** A separate openFDA query for product code LSZ with empty supplement number returns four
  original approvals. Read with `decision_code`, which openFDA defines as `APPR` = approved and
  `APWD` = withdrawal after approval:
  - **APPR** — Bunnell **P850064** (1988-06-30), "MODEL 203 LIFE PULSE HIGH FREQUENCY VENTILATOR"
  - **APPR** — ZOLL **P890057** (1991-03-29), "MODEL 3100 FREQUENCY OSCILLATORY VENTILATOR"
  - **APWD** — Nellcor Puritan Bennett **P880013** (1990-01-19), "INFANT STAR HIGH FREQUENCY VENTILATOR"
  - **APWD** — Covidien **P890034** (1991-12-13), "MODEL APT 1010 ULTRAHIGH FREQUENCY VENTILATOR"

  So the live comparison is Bunnell and ZOLL, not a field of four. Counting the four without the
  decision code overstates the competition by two, and the trade names carry a further distinction:
  the one other in-force LSZ approval is an **oscillatory** ventilator, a different modality from
  Bunnell's jet.

## Reliability Notes

Primary tier at a host obliged to keep it: the regulatory record for the device's PMA pathway and
approval date. It does not by itself establish current labeling, indications, or market share, and
the applicant street address reflects the 1988 record rather than the company's 2026 published
address (330 Cutler Drive, North Salt Lake, UT 84054).

**Do not treat openFDA as the last word on a Class III device.** Every response from this endpoint
carries the publisher's own disclaimer — "Do not rely on openFDA to make decisions regarding medical
care… you should assume all results are unvalidated." For any regulatory-critical use, confirm
against FDA's PMA database directly and the Federal Register notice (1988-08-10, docket 88M-0263).
This page cites the API because it is queryable and stable, not because it is authoritative over the
agency's own records.

The `decision_code` field above is the reason this page enumerates all four LSZ approvals rather than
counting them. The count and the status live in the same response, and reporting the count alone
inverts the competitive picture.

To re-check Bunnell's PMA:

```bash
curl -s 'https://api.fda.gov/device/pma.json?search=applicant:"Bunnell,+Inc."+AND+pma_number:P850064&limit=20'
```

To list all original high-frequency ventilator PMAs (product code LSZ):

```bash
curl -s 'https://api.fda.gov/device/pma.json?search=product_code:LSZ+AND+supplement_number:""&limit=10'
```

## Related Pages

- [Bunnell Incorporated](bunnell-incorporated.md)
- [Source: Bunnell Official Website — About Page](bunnell-official-website.md)
- [Source: Bunnell Life Pulse 204 Product Page](bunnell-life-pulse-204-product.md)
