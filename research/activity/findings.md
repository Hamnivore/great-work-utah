# Activity pass — page problems and rubric gaps

Not activity verdicts. Raters are forbidden to edit `wiki/`; these land here so a later
maintainer can place, merge, or rewrite. One section per batch as it reports.

## 02-gems

### Rubric gaps

- **`utah-computer-graphics-program`.** The page is almost entirely the 1968–1985 Evans/Sutherland
  DARPA peak (ruling 1 would read `concluded`, like Capecchi), but the named Utah Graphics Lab still
  publishes. Rated `active` on the living lab (SIGGRAPH 2025). The rubric does not say whether a
  historic-peak `work` page inherits the successor lab.

### Page framing

- **`utah-test-and-training-range`** (`work`) and **`uttr`** (`venture`) are the same range, same
  website, same doing — an obvious duplicate pair.
- **`utah-computer-graphics-program`** carries two subjects: the 1968–1985 origin story and a
  still-running School of Computing lab.
- **`thiokol-solid-rocket-motors`** overlaps `northrop-grumman-promontory`; the Thiokol page’s
  `**Website:**` is the Rogers Commission history index, not the live Promontory operation.
- **`utah-array-bci-platform`** `**Website:**` is a Medical Design and Outsourcing feature, not
  Blackrock or the U of U.
- **`telescope-array-ultra-high-energy-cosmic-rays`** is typed `venture` for an international
  observatory.

### Threshold edge (for apply, not a re-rate)

- **`nsa-utah-data-center`** signal is `2025-02` (USACE EA). Eighteen months before 2026-08-13 is
  2025-02-13, so a month-only date sits on the active/dormant cut. Leave the rater row; let
  `apply-activity.mjs` derive the label.

## 01-gems

### Page framing

- **`help-clinical-decision-support-system`.** Era says “1967-present in successor forms,” mixing the
  retired HELP HIS with later Cerner/Epic EHRs. `**Website:**` is a PMC article with a trailing
  semicolon.
- **`intermountain-clinical-quality-improvement`.** `**Website:**` is Wikipedia, not the live ATP
  program page.
- **`myriad-genetics-brca`.** Two subjects: 1990s sequencing + 2013 patent case vs still-shipping
  BRACAnalysis CDx. `**Website:**` is the SCOTUS opinion; the company already has `myriad-genetics.md`.
- **`harvey-fletcher-stereophonic-sound`.** `**Website:**` is the 2016 posthumous Grammy write-up, not
  a record of the 1930s work.

## 05-venture

### Page framing

- **`furnace-outbound`.** H1 is “Furnace”; slug is the productized name.
- **`globus-relief`.** Operating name vs IRS legal name Globous Relief Fund (EIN 84-1369453).
- **`hope-squad`.** Page scopes the school program; 990/Deseret coverage is Hope 4 Utah, the parent
  nonprofit.
- **`helpside`.** Careers URL is a benefits landing page with no dated requisitions.
- **`huntsman-world-senior-games`.** Type: venture for a recurring nonprofit event.
- **`imagine-learning`.** Utah-founded; HQ is Tempe. Activity is the company; Utah employment is still
  unknown.
- **`hypercraft`.** `**Website:**` is hypercraft.com; the Dec 2025 artifact and careers live on
  hypercraftusa.com.

## 07-venture

### Threshold edge (for apply, not a re-rate)

- **`nephronovus`.** Only dated artifact is a 2025-02-20 Demo Day listing, seven days inside the
  18-month window; not named on the April 2026 Demo Day page. Rater kept `active`.

### Page framing

- **`owlet-baby-care`.** `Stage` says private; Owlet Inc. is NYSE: OWLT.
- **`pluralsight`.** Page HQ is Farmington, UT; current newsroom copy says Westlake, Texas. Vista PE
  ownership is also stale (lender recap).
- **`mx-technologies`** / **`oc-tanner`.** No `**Website:**` (probe: `no-website`); live sites are
  mx.com and octanner.com.
- **`nephronovus`.** `**Website:**` is the Altitude Lab portfolio, not nephronovus.com.
- **`ram-aviation-space-defense`.** Wiki `**Website:**` is ramasd.com; current public site is ram.space.

## 08-venture

### Page framing

- **`sarcos-technology-and-robotics`.** Still describes Guardian XO hardware as current work; the
  legal entity is Palladyne AI (NASDAQ: PDYN) after a software pivot, and a separate `palladyne-ai`
  page exists. Rated `active` on ruling 3 (absorbed is not ended).
- **`spectrum-solutions`.** No live official URL (probe: no-website); continues as Spectrum Health
  Science / SimplyTest.
- **`splunk`.** Unverified Utah hook; the page already flags that.
- **`sci-institute`** and **`sandbox`.** Typed `venture` but scoped as a university institute and an
  education program.
- **`struvia`.** No independent filing, registration, or named customer.

## 09-venture

### Page framing

- **`utah-film-industry`.** Typed `venture` but scoped as a statewide ecosystem; official URL is the
  Film Commission. Two subjects on one page.
- **`usu-integrated-biosystems`**, **`utah-arch`**, **`utah-neurorobotics-lab`.** University
  centers/labs typed `venture`.
- **`us-magnesium`.** Page still reads as if the January 2026 auction is open; Utah FFSL closed on
  the Rowley land and water rights, and the estate is in liquidation. Rated `concluded`.
- **`us-synthetic`.** Open Questions still treat the LongRange sale as unconfirmed (closed
  2025-07-21) and say no identifiers are resolved, though metadata already has `cik`/`ein`.
- **`utah-neurorobotics-lab`.** Evidence points at two different lab URLs and a Relates slug that
  does not match the linked filename.

## 13-helper

### Rubric gaps

- **`preferred-cfo`.** Newest opened artifact is a dated firm insights post (2026-02-12), not a
  filing, job posting, or named engagement. Treated as `news`; a website that loads would not have
  been enough.

### Page framing

- **`bbcetc`** and **`rqm-plus`.** No verified Utah presence; both national helpers are active anyway.
- **`eide-bailly-utah`.** Still lists 5 Triad Center; Colliers dated 2026-06-22 has a 21,248 sq ft
  lease at 650 Main.
- **`tanner-llc`.** Official site 403s; Utah Business styles the firm Tanner LLP.
- **`wilson-sonsini-salt-lake-city`.** Office URL 403s; the Jan 2026 Pearce hire is on a different
  WSGR insights URL.
- **`choice-humanitarian`.** Utah nonprofit EIN 74-2494806; 2026-07-28 board memo is a U.S. wind-down
  (`terminal:dissolved`). Country teams may continue under other vehicles.

## 03-venture

### Threshold edge (for apply, not a re-rate)

- **`bioparin`.** Nucleus post dated 2025-02-03 for an NHLBI Phase I STTR. Day-level 18-month cutoff
  is 2025-02-13; rater kept `active` because apply counts calendar months with `<= 18`. No Phase II
  or 2026 follow-on found.

### Page framing

- **`auticon-us`.** Best-of-State lead put it in Salt Lake; official US contact is Sacramento; no
  verified Utah office.
- **`batu-biologics`.** Page frames a U of U / SLC spinout; EDGAR and patents are San Diego;
  `batubiologics.com` is parked.
- **`bioenergenix`.** `**Website:**` is a 2014 U of U press URL, not a company site; TLO still lists
  “Active” against a cold public trail.
- **`bioparin`.** Probe `no-website`; still no live company URL.
- **`blundell-geothermal-plant`.** Type:venture for a PacifiCorp generating station. Rated on whether
  generation continues (ruling 6).
- **`best-friends-animal-society`.** Type:venture for a 501(c)(3).
- **`blue-raven-solar`.** Customer-facing brand is now SunPower Inc.; install work continues under
  the parent (ruling 3).

## 10-venture

### Rubric gaps

- **`wasatch-ionics`.** Army STTR Phase II (`W15QKN-24-C-0039`) awarded 2024-07-11 with scheduled end
  2026-06-30. Award artifact is older than 18 months, so rated `dormant`. The rubric does not say
  whether a period of performance that runs into the last 18 months, with no newer public
  deliverable, counts as `active`.

### Page framing

- **`utahquantum`.** TechBuzz 2026-07-10 calls UtahQuantum.org a BODEX-launched nonprofit; the wiki
  page describes a for-profit QSI. Two identities on one page.
- **`vector`.** Probe listed `no-website`, but Evidence already cites `tfvector.com`. Name drifts
  between Vector and Vector Defense Inc.
- **`wordperfect`.** Type:venture for an Orem company acquired in 1994; the page also says Corel
  still sells WordPerfect Office. Rated `concluded` on the Novell close (ruling 3).
- **`xandem`.** No `**Website:**` even though xandem.com loads; Stage’s “2024 consumer pivot” was not
  visible in the live record.
- **`wasatch-ionics`.** No website, location unknown; the GOEO URL on the page does not match the
  live path.
- **`western-governors-university`.** Primary Location still `unknown` for a Utah-headquartered
  nonprofit with a public 990.

## 12-person

### Rubric gaps

- **`ryan-smith-imsar`.** Still listed as Founder & CEO on the live official about page, and IMSAR’s
  news calendar lists 2026 shows, but no dated professional artifact *naming him* after the
  2019-04-09 Split Aces PR. LinkedIn excluded. Picked `unknown` rather than `active` (no named dated
  signal) or `dormant` (expensive miss if he is still running it). Ruling 5 / ruling 8 do not decide
  “title on an undated about page.”

### Page framing

- **`karl-sun`.** Still says he “leads” Lucid and is “still CEO as of 2026”; he has been Board Chair
  since April 2022, with Dave Grow as CEO. The page’s own open question already flags the role
  mismatch.
- **`fred-lampropoulos`.** Still reads as a sitting founder-operator; Merit’s 2026-01-04 8-K answers
  the page’s open question (resigned as director/chair). Rated `concluded`.
- **`ryan-smith-qualtrics`.** Scopes both Qualtrics founding and Jazz/civic ownership; the live
  signal is the sports/civic half.

## 21-resource

### Rubric gaps

- Recurring annual camp whose 2026 edition already ran (`utah-kids-code-camp`, 2026-08-01) with no
  2027 date posted: treated as `active` under ruling 4’s “open or recently closed” window.
- **`utah-digital-entertainment-network`.** May 2025 LinkedIn “we’re restarting” post exists;
  LinkedIn is excluded, so the last citable artifact is a 12/2020 $0 return. Rated `dormant`.

### Page framing

- **`utah-chinese-association`.** Official site is an undated 2022 WordPress stub; the live program
  is on Eventbrite.
- **`utah-defense-alliance`.** Official site still has lorem-ipsum testimonials; probe was HTTP 202.
- **`utah-innovation-center`** / **`utah-innovation-fund`.** Wiki titles are the old names; live
  brands are Nucleus Grow and Nucleus Fund.
- **`utah-geek-events`.** Homepage still lists Kids Code Camp as 2026-06-20; the event page moved it
  to 2026-08-01.
- **`university-of-utah`.** Thin umbrella resource page pointing elsewhere.
- **`utah-association-of-counties-uac`.** `**Website:**` is uacnet.org; the dated events calendar is
  on utahcounties.org.

## 04-venture

### Rubric gaps

- **`curza`.** NIH SBIR `R44AI186898` started 2024-07-09 (outside 18 months) but is still in
  performance through 2027-06-30. HigherGov last-modified 2026-07-06 shows ongoing status and
  obligations raised to $3M. Rated **active**. Same gap as `wasatch-ionics` (10-venture), which was
  rated **dormant** on an older award date with no newer public deliverable. Adjudicate together:
  does a period of performance inside the window count without a new artifact?

### Page framing

- **`deseret-book-bonneville`.** Two subjects on one page (Deseret Book publishing and Bonneville
  broadcasting).
- **`culmination-bio`.** `culmination.com` now serves Intermountain MyChart; the Intermountain URL in
  `**Website:**` no longer describes the spinout. Rated `dormant`.
- **`eden-technologies`.** Page still frames a St. George / Utah Tech company; Genesis launch
  materials put HQ at Proto-Town near Lockhart, Texas.

## 06-venture

### Rubric gaps

- **`iris-biomedical`.** No first-party dated artifact. Rated `active` on a May 2025 *Nature
  Biomedical Engineering* review that says the Ripple spin-out “is also working on” Athena. A
  landscape mention is weaker than a company filing or release.
- **`keva-locks`.** Terminal event is a founder LinkedIn post (16 Jul 2026) that they shut the
  company. The rubric discounts LinkedIn as an activity *signal*; here it is the only public closure
  record. Site still markets the product. Same LinkedIn-exclusion tension as
  `utah-digital-entertainment-network` (21-resource).
- **`interval-ai`.** Dated independent hit is a named portfolio mention in Philo’s Oct 2025 fund
  launch, plus an undated live sales job on the company board.

### Page framing

- **`intan-technologies`.** Los Angeles company; page already says no verified Utah presence.
- **`jump-aero`.** Petaluma company; Utah tie is UDOT planning plus a West Jordan mockup display.
- **`l3harris-salt-lake`.** No `**Website:**`; subject is a site of a national prime.
- **`intergalactic`.** Work continues under Unison / GE Aerospace; page still scoped to the
  Intergalactic name (absorbed ≠ ended).
- **`keva-locks`.** Official URL still live after the shutdown announcement.
- **`innosys`.** Maintainer notes already flag a mis-slugged source page and a provisional CIK.
- **`music-ai`.** Trades as Moises; App Store seller is Moises Systems Inc.

## 11-work

### Rubric gaps

- **`spiral-jetty`.** Sits between ruling 1 (April 1970 construction is over; NRHP period of
  significance is 1970) and ruling 6 (Dia still stewards the site). Treated stewardship of a
  finished earthwork like a decommissioned instrument → **concluded**. If “work at the place” means
  ongoing Dia conservation, this would be active or dormant instead.

### Page framing

- **`moxie-solid-oxide-electrolysis-stack`.** H1/summary are the flown Mars stack; Era and Impact
  also cover OxEon’s Earth-side SOEC (MOMS SBIR through 2026). Two subjects.
- **`omniture-web-analytics`.** Body is a 2009-exit history; Era says “continued inside Adobe,” which
  is what ruling 3 then forces.
- **`spiral-jetty`.** Era is “1970-present,” which fights a construction-complete reading.
- **`wordperfect-and-novell`.** Two companies on one page. Corel still sells WordPerfect; OpenText
  still sells OES/GroupWise. Ranked the Utah Valley category-leader era, not those follow-ons.
- **`high-density-sustainable-aviation-fuels`.** CleanJoule (civil SAF) and CycloKinetics (defense)
  share one page and one SLC facility.

## 15-resource

### Page framing

- **`event-grand-summit-moab`.** Official URL frozen on Aug 20 2024; 2026 cycle ran Jan 16 as Grand
  Business Summit via the Moab Chamber. Rated `active` on ruling 2.
- **`escalante-city-innovation-center`.** Listed `escalantecity-utah.com` URL 500s; live copy
  (undated rates) is at `escalanteutah.gov`. Rated `unknown`.
- **`business-resource-center-utah-tech-university`.** Launch Series still names Colette Cox, April
  cohort marked CANCELLED with no year. Rated `unknown`.
- **`coworking-space-in-salt-lake-city-offices-net`.** National listing aggregator, not a Utah
  operator. Rated `unknown`.
- **`business-technical-assistance-center`.** BTAC facility vs SEEN network; `btac.business` still
  500s.
- **`epic-ventures`.** Homepage is a near-empty Squarespace shell (probe newest year 2020) despite
  2025 fundraising news.
- **`cross-creek`.** Own `/news` page has no dated stories; activity is only visible in
  portfolio-company posts.

## 14-resource

### Threshold edge (for apply, not a re-rate)

- **`acceler8-wasatch`.** No 2026 cycle, official domain NXDOMAIN, but the May 2025 week is still
  inside 18 months. Rated `active` on that release.

### Page framing

- **`1-million-cups-salt-lake`** and **`1mc-salt-lake`.** Same Salt Lake chapter.
- **`a-tech-home-plans`** and **`ai-seminar-for-small-businesses-and-non-profits`.** Startup State
  stubs dropped from the live directory; seminar registration URL 404s. Rated `unknown`.
- **`acceler8-wasatch`.** `**Website:**` is a 2025 Ogden PDF; acceler8wasatch.com is NXDOMAIN.
- **`a-bolder-way-forward`.** URL redirects to the general UWLP homepage.
- **`bear-lake-regional-commission`.** Homepage still advertises 2013 agendas even though 2026
  meetings are posted on Utah’s public-notice site.
- **`bear-lake-valley-chamber-of-commerce`.** Rated `unknown`.

## 22-resource

### Rubric gaps

- **`utah-office-of-regulatory-relief`.** Sandbox application is continuously open with no posted
  cycle dates. Ruling 4 wants a current cycle; rated **active** from a June 2026 Pioneer Institute
  article saying Utah currently has the most active U.S. sandbox.

### Page framing

- **`utah-small-business-credit-initiative`** and **`utah-small-business-credit-initiative-usbci`.**
  Same program, same URL.
- UVU “Innovation Center/Academy” is now the Office of Engaged Learning; the Entrepreneur Institute
  is the Baugh Institute; USU’s Jeffrey D. Clark name is a discoverability alias for the Center for
  Entrepreneurship.
- **`utah-tourism-association`.** `utahtourism.org/events/` is leftover template copy (Fairfax, VA /
  lorem ipsum). Conference lives at utahtourismconference.com.
- **`utah-muslim-civic-league-umcl`.** Own domain is dead; Startup State still lists it. Rated
  `unknown`.
- **`utah-native-american-chamber-of-commerce`.** Homepage says “No events” while a July 2026 powwow
  page still exists.
- **`utah-tech-university-atwood-innovation-center`.** Rated `unknown`.

## 17-resource

### Page framing

- **`impact-utah`.** Page is iMpact Utah; 47G Impact Center still describes the joint venture in
  present tense after the July 2025 shutdown. Rated `concluded`.
- **`juab-county-economic-development`.** `juabcounty.gov/business/` is still “More Information
  Coming Soon.”
- **`lialaunch`.** Offerings described with no dates; pitch-competition path 404s. Rated `unknown`.
- **`indie-square`.** `www.indiesquare.org` 404s several paths that work on `indiesquare.org`.
- **`morgan-chamber-of-commerce`.** Wiki recorded the domain as parked (2026-07-14); the site is live
  again and hosted the 2026 4th of July.
- **`morgan-county-economic-development`.** `**Website:**` is `morgancountyinfo.com`; live ED/grant
  copy is on `morgancountyutah.gov`. Grant page says “July 15th” with no year.
- **`mountain-land-association-of-governments-revolving-loan-fund-rlf`.** Wiki points at the undated
  Heber Valley RLF page ($10k–$100k); current MAG Small Business Loan Fund is on `magutah.gov`
  ($10k–$250k, year-round).

## 19-resource

### Rubric gaps

- **`sba-thrive`.** Official Thrive URLs 404 or redirect; `sbathrive.com` is now unrelated casino
  content. Last opened SBA artifact is the archived 2023 application (deadline 2023-04-30). No
  sunset notice, so rated **dormant** rather than concluded.

### Page framing

- **`salina-chamber`.** `**Website:**` is Salina city hall; live chamber work is North Sevier Chamber.
- **`sevier-county-economic-development`.** `scedc.com` is Sevier County, **Tennessee**; Utah work is
  on `sevieredc.com` / `sevier.utah.gov`.
- **`southeastern-utah-association-of-local-governments-economic-development`.** Duplicate of the
  live SERDA/SEUALG org (`southeastern-association-of-local-governments`).
- **`signal-peak-ventures`.** Public brand is Run Ventures; work continues under the new name.
- **`snow-college-grit-center`.** `snow.edu` GRIT page still shows April 2023 deadlines; current
  cycle is on `thegritcenter.com`.
- **`score-utah`** / **`silicon-slopes`.** Official domains 403/timeout; ratings used other opened
  artifacts.
- **`san-juan-county-economic-development`.** `sjcutaheconomicdevelopment.com` is an undated
  placeholder.
- **`six-county-association-of-governments`.** `r6.utah.gov` is an empty CMS shell.

## 23-resource

### Rubric gaps

- Rolling state programs (**`utif`**, **`wildcat-microfund`**) still show live Apply Here portals
  with no dated 2026 window, cohort, or award list. Ruling 4 applied strictly: last dated official
  document (Feb 2025 guide / Spring 2024 magazine) → **dormant**, not active on an undated portal.
  Opposite call from `utah-office-of-regulatory-relief` (22-resource), which was rated **active**
  on independent news that the sandbox is currently the most active in the U.S. Adjudicate together.

### Page framing

- **`vernal-downtown-alliance`.** `**Website:**` is Vernal City’s downtown plan, not the Alliance
  (`vernaldowntown.org`).
- **`vision-iron-county`.** Wiki still says the domain is a GoDaddy parking page; it now loads org
  content (2020 survey + lorem-ipsum “current projects”).
- **`women-tech-counsel`.** Slug/title is “Counsel”; the org is Women Tech Council.
- **`visit-utah`.** Consumer travel site vs Utah Office of Tourism industry programs; the page
  already notes the split.
- **`weber-state-ai-hackathon`.** Official site is a countdown rewritten per edition (2027 only).
- **`work-hive`.** Official site still describes the July 2025 HQ move as upcoming after the fall
  2025 opening.
- **`veteran-owned-business-registration-utah`.** Rated `unknown`.

## 16-resource

### Rubric gaps

- **`first-step-entrepreneur`** / **`fstep-idea-explorer`.** Live, undated self-serve challenge/tool
  and $47/mo Pro with no posted cohort or deadline. Ruling 4 wants a current cycle; rated `unknown`
  rather than treating evergreen enrollment as `active`. Same family as UTIF/Wildcat (dormant on
  undated portals) and the regulatory sandbox (active on independent news). Three calls, one gap.

### Page framing

- **`grand-county-economic-development`.** `**Website:**` is Colorado Grand County (`co.grand.co.us`),
  not Utah; the page is about Moab/Grand County, UT.
- **`goldman-sachs-1000-small-businesses`.** Title says “1000”; the program is Goldman Sachs
  **10,000** Small Businesses.
- **`first-step-entrepreneur`.** Startup State listing is gone; the live program is Art Harrison’s
  Toronto-based FSTEP, not a Utah cohort.
- **`futureready-utah`.** Official homepage has shifted to undated layoff/career-transition copy.
  Rated `dormant`.
- **`grix`.** `grix.vc` is an undated Wix splash (“Home | My Site”).

## 20-resource

### Page framing

- **`startup-state-resource-list`.** Titled “Startup State Resource Filter” but the live site is the
  whole Startup State Initiative.
- **`uinta-basin-tech-entrepreneur-center`.** Slug and title read as UBTech; the page is USU’s
  Bingham Entrepreneurship Center.
- **`university-of-utah-pivot-center`.** Rename stub (PIVOT → Technology Licensing Office, Oct 2023);
  the office continues under the new name. Rated `concluded`.
- **`teen-entrepreneur-support-center`.** `teen-entrepreneurship.org` is Cloudflare-blocked (probe
  403); programming is visible only via local press.
- **`startup-ogden`.** Nexudus portal times out; WSU Downtown copy is undated present tense. Rated
  `dormant`.
- **`st-george-city-economic-development`** and **`tech-ridge`.** Both rest on the same St. George
  mesa project.

## 18-resource

### Close calls (resolved by existing rulings)

- **`revolving-loan-fund-program-rlf-r6`.** Program page 404s and no RLF cycle appears on the 2026
  board agenda. Parent AOG being active does not make the loan program active (ruling 2). Rated
  `unknown`.
- **`revroad`.** “Fund fully deployed / applications closed” on an undated homepage is not a dated
  terminal event, so `unknown` rather than `terminal:program-sunset`.

### Page framing

- **`mountainland-association-of-governments`.** `**Website:**` is mountainland.org; live official
  site is magutah.gov.
- **`orem-library-makerspace`.** Official makerspace URL 403s; current workshops live on
  orem.librarycalendar.com.
- **`pitted-ventures`.** pittedventures.com is a default vhost; last work signal is the 2022 fund
  launch. Rated `dormant`.
- **`revroad`.** Page is the venture-services firm; sister RevRoad Capital rebranded to Stalwart
  Ventures in 2025 (two subjects).
- **`park-city-chamber-of-commerce`.** wasatch-back-economic-summit and annual-meeting URLs 404.
- **`renewable-tech-ventures`.** Site still cites “Utah Technology Council”; last dated investment
  artifact is 2011. Rated `dormant`.
