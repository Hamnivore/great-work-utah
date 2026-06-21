# Old DB Migration: Malformed Venture Files

**Status:** Draft
**Updated:** 2026-06-19

Inventory of malformed files in `wiki/ventures/` that did not end in `.md` at the start of the migration pass. These files were public-wiki-adjacent but invalid for the new wiki schema.

Boss claim: `wiki/agent_ops/locks/2026-06-19-old-db-inventory-malformed-ventures.md`

## Summary

- Malformed files found: 14
- Post-wave status: the malformed filenames are now deleted in the working tree and replacement `.md` pages exist as untracked files. This report is now a historical handoff/checklist, not a live inventory.
- Most are short legacy-shaped venture drafts with `Category`, `Domain`, and `Website` headers instead of the new required `Status`, `Confidence`, and `Updated` headers.
- None should remain under the current malformed filenames.
- Most should become proper `.md` venture pages, but the legacy-backed ones should be merged from the richer legacy page rather than converted from the short malformed stub.
- `novell-md` is probably not a current venture page; fold into historical work or retire after confirming.
- `myriad-genetics-md` should be reviewed against `wiki/work/myriad-genetics-brca.md` so the venture page describes the company and the work page preserves the BRCA story.

## Manifest

| Malformed file | Likely title | Existing public duplicate | Legacy source found | Recommended action | Notes |
|---|---|---|---|---|---|
| `ancestry-md` | Ancestry.com | none | not found in quick legacy scan | needs_review | Related to `wiki/ventures/familysearch.md`, but not a duplicate. Needs sources and current-company framing. |
| `bamboohr-md` | BambooHR | none | not found in quick legacy scan | needs_review | Plausible Utah SaaS page, but verify inclusion fit and source evidence before converting. |
| `cotopaxi-md` | Cotopaxi | none | not found in quick legacy scan | needs_review | Social enterprise/outdoor brand; check whether it belongs in ventures, work, or a guide. |
| `domo-md` | Domo | none | `legacy_wiki/places_you_can_work/machine-intelligence/domo.md` | merge | Legacy page is much stronger than malformed draft; use it as seed, remove universal tier. |
| `instructure-md` | Instructure | none | `legacy_wiki/places_you_can_work/education/instructure.md` | merge | Legacy page is richer; malformed draft may contain current ownership claims that need verification. |
| `lucid-software-md` | Lucid Software | none | not found in quick legacy scan | needs_review | Plausible SaaS/tools page, but needs source recovery and inclusion rationale. |
| `myriad-genetics-md` | Myriad Genetics | no venture duplicate; related work page exists | `legacy_wiki/places_you_can_work/health-and-longevity/myriad-genetics.md` | needs_review | Convert to venture page only after separating it from `wiki/work/myriad-genetics-brca.md`. |
| `novell-md` | Novell | related work page exists | not found in quick places scan | needs_review | Likely historical work, not current venture. Compare with `wiki/work/wordperfect-and-novell.md`; probably retire malformed venture file. |
| `overstock-com-md` | Overstock.com | none | not found in quick legacy scan | needs_review | Needs current naming/status check because Overstock/Beyond/Bed Bath & Beyond branding has shifted over time. |
| `owlet-baby-care-md` | Owlet Baby Care | none | not found in quick legacy scan | convert | Good medtech/consumer health venture candidate. Needs FDA/regulatory source context. |
| `pluralsight-md` | Pluralsight | none | `legacy_wiki/places_you_can_work/education/pluralsight.md` | merge | Legacy page is richer; malformed draft should not replace it. |
| `qualtrics-md` | Qualtrics | none | `legacy_wiki/places_you_can_work/machine-intelligence/qualtrics.md` | merge | Legacy page is stronger; malformed draft appears to have a founder error that must be corrected. |
| `skullcandy-md` | Skullcandy | none | not found in quick legacy scan | needs_review | Consumer/lifestyle electronics; verify whether venture scope includes Utah brand history. |
| `vivint-smart-home-md` | Vivint Smart Home | none | not found in quick legacy scan | needs_review | Smart-home/security fit is plausible, but corporate history/status claims need verification. |

## Recommended Subagent Split

- **Legacy-backed merges:** `domo`, `instructure`, `myriad-genetics`, `pluralsight`, `qualtrics`.
- **Source-first reviews:** `ancestry`, `bamboohr`, `cotopaxi`, `lucid-software`, `overstock-com`, `skullcandy`, `vivint-smart-home`.
- **Source-first conversion:** `owlet-baby-care`.
- **Retire-or-move review:** `novell`.

## Handoff

Migration Factory should claim one group at a time, convert malformed files to proper `.md` pages, and then delete or retire the malformed filename only after the new page is validated. Source Recovery should run in parallel for the source-first group.
