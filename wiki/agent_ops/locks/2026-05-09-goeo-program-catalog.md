# Claim: GOEO Program Catalog

**Agent:** Codex
**Started:** 2026-05-09 06:06 MDT
**Seed Worklist Item:** 6. `business.utah.gov` GOEO Program Catalog
**Status:** done
**Updated:** 2026-05-09 06:06 MDT

## Scope

Create a first pass for five official GOEO program resources: APEX Accelerator, Utah Office of Regulatory Relief, Utah Small Business Credit Initiative, Utah Center for Global Talent, and International Trade & Diplomacy. Link them into capital, commercialization, and business-service navigation where useful.

## Files Expected

- `wiki/resources/apex-accelerator.md`
- `wiki/resources/utah-office-of-regulatory-relief.md`
- `wiki/resources/utah-small-business-credit-initiative.md`
- `wiki/resources/utah-center-for-global-talent.md`
- `wiki/resources/international-trade-and-diplomacy.md`
- `wiki/sources/*`
- `wiki/guides/find-business-services.md`
- `wiki/guides/startup-capital-in-utah.md`
- `wiki/guides/commercialize-research.md`

## Files Changed

- `wiki/resources/apex-accelerator.md`
- `wiki/resources/utah-office-of-regulatory-relief.md`
- `wiki/resources/utah-small-business-credit-initiative.md`
- `wiki/resources/utah-center-for-global-talent.md`
- `wiki/resources/international-trade-and-diplomacy.md`
- `wiki/sources/goeo-apex-accelerator-page.md`
- `wiki/sources/goeo-regulatory-relief-page.md`
- `wiki/sources/goeo-usbci-page.md`
- `wiki/sources/goeo-global-talent-page.md`
- `wiki/sources/goeo-international-trade-diplomacy-page.md`
- `wiki/guides/find-business-services.md`
- `wiki/guides/startup-capital-in-utah.md`
- `wiki/guides/commercialize-research.md`

## Verification

- Confirmed each GOEO resource page has required `Status`, `Confidence`, and `Updated` header lines.
- Removed duplicate alternate source records after finding the `goeo-*` source names already used by the resource pages.
- `npm run build:wiki` could not complete inside the sandbox because `tsx` could not open its IPC pipe under `/tmp`. Escalation was requested but blocked by the environment's usage limit, so generated-index verification remains outstanding.

## Handoff Notes

The five target GOEO resources now have first-pass resource pages and official source records. They are linked from `find-business-services.md`, and APEX/Regulatory Relief/USBCI are also linked from commercialization and capital guides.

Worklist and run log were updated after the parallel Startup State claim was completed. Next best follow-up: add Opportunity Zones, Center for Rural Development, UPSTART, Business Recruitment & Expansion, and World Trade Center Utah-specific export grant resources.
