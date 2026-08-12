# Failed-site identity audit — 2026-08-11

Each non-LIVE Website result in the full-corpus probe was searched individually by entity name. A failed HTTP probe was treated only as a lead: identity required an entity-controlled page, government/registry record, archival capture, or independent authoritative source connecting the entity to the domain.

| Page | Domain or record | Identity finding | Action |
|---|---|---|---|
| Acceler8 Wasatch | `acceler8wasatch.com` | Genuine historical program domain; dead | Website now points to Ogden City's current Acceler8 program record; archive retained |
| BYU–Pathway Worldwide | `byupathway.edu` | Current official domain | Kept; probe failure was technical |
| Evans & Sutherland | University of Utah ArchivesSpace record | Genuine archival evidence, but not an entity homepage | Website now points to Cosm's official successor-company page; archive record retained as evidence |
| U.S. Economic Development Administration | `eda.gov` | Current official federal domain | Kept |
| iMpact Utah | `impactutah.org` | Genuine historical domain; TLS-dead | Website now points to 47G Impact Center, whose official page identifies the iMpact Utah joint venture; archive retained |
| Iomega Zip Drive | `edgar.secdatabase.com` filing mirror | Filing identity correct, but mirror was third-party | Replaced with the official SEC accession page |
| Lucid Software | `lucidsoftware.com` | Genuine former/canonicalizing domain | Replaced with current official `lucid.co` |
| Myriad Genetics BRCA patents | Justia Supreme Court page | Correct authoritative work record, not a company homepage | Kept |
| Neighbor | `neighbor.com` | Current official domain | Kept; access failure was bot/WAF behavior |
| Orem Library Makerspace | `library.orem.gov/makerspace` | Current city-controlled page | Kept |
| Pitted Ventures | `pittedventures.com` | Genuine official domain; intermittently inaccessible | Kept with existing Wayback fallback |
| Pons–Fleischmann cold fusion | Axios article | Correct work/evidence record | Kept |
| Renaissance Ag / PastureBox | `renaissance-ag.com` | Unsupported, hallucinated hyphenated domain | Removed; current company LinkedIn used instead |
| Renaissance Ag / PastureBox | `renaissanceag.com` | Genuine historical domain; currently unavailable | Recorded as historical identity evidence and archive candidate |
| SCORE Utah | `score.org/utah` | Genuine organization, stale path | Replaced with current official `score.org/ut/` |
| Silicon Slopes | `siliconslopes.com` | Current official domain | Kept; independent nonprofit record corroborates it |
| SkyWest, Inc. | `inc.skywest.com` | Current official holding-company domain | Kept; distinct from the airline subsidiary site |
| Sword Health | `swordhealth.com` | Genuine company-controlled domain; new umbrella homepage is `sword.com` | Website changed to `sword.com`; company-controlled careers path retained |
| Tanner LLC | `tannerco.com` | Current official domain | Kept; probe failure was WAF behavior |
| Teen Entrepreneur Support Center | `teenentrepreneurship.org` | Current official domain | Kept; Startup State and independent Utah ecosystem records corroborate it |
| Utah Muslim Civic League | `utahmcl.com` | Current official domain | Kept; stale NXDOMAIN note removed |
| Utah Veteran Business Registry | `vbr.veterans.utah.gov/s/` | Current state-government registry | Kept |
| Vivint Smart Home | `vivint.com` | Current official domain | Kept; probe failure was Cloudflare behavior |
| Wilson Sonsini Salt Lake City | `wsgr.com/.../salt-lake-city.html` | Current official firm office page | Kept; probe failure was WAF behavior |

## Conclusion

The hyphenated Renaissance Ag domain was the only unsupported invented domain in this failed-site set. Four real domains are historical or unavailable (`acceler8wasatch.com`, `impactutah.org`, `pittedventures.com`, and `renaissanceag.com`); their identity is corroborated separately from their availability. The remaining failures were stale paths, non-homepage evidence records, or automated-access failures—not evidence that the domains belonged to different organizations.
