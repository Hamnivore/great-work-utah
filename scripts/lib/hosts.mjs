// Hosts that are obliged to keep what they publish.
//
// This list decides whether a source page owes a capture. A document at one of these hosts is
// held by a body with a statutory or chartered duty to preserve it — EDGAR keeps the 10-K,
// GPO keeps the Federal Register, the Court keeps the United States Reports — so a copy in
// `raw/` would only be a second, staler copy of something already permanent. Everything else
// is treated as fragile, including large, apparently stable sites: durability here means
// somebody is required to keep the bytes at that address, not that they probably will.
//
// Two rules keep the list honest:
//
//   1. The duty must attach to the *document*, not to the domain. A `.gov` press release or
//      history essay is the agency talking about itself, and is secondary — see the tier
//      discussion in wiki/meta/attributes.md. Adding a host here does not make what it hosts
//      primary; it only says the address will resolve.
//   2. Add a host only when its publisher is the issuer or the designated archive of record.
//      Convenience mirrors — Justia, secdatabase, ProPublica — do not belong, however
//      reliable, because the fix for a mirror is to cite the issuer or capture the bytes.
//
// State hosts are listed narrowly, by the specific body that keeps records, not by domain:
// `le.utah.gov` (the Legislature keeps the statutes) and not `utah.gov`, which would sweep in
// every agency marketing page in the state and hand each one an exemption from capture.
//
// Lives in one place because it is duplicated logic by nature: both the linter (which decides
// what is owed) and the capture script (which decides what to fetch) must agree, and a list
// that disagreed with itself silently stopped flagging real gaps once already.
export const MANDATED_HOST_RE =
  /(^|\.)(sec\.gov|irs\.gov|uspto\.gov|nih\.gov|nsf\.gov|usaspending\.gov|sbir\.gov|clinicaltrials\.gov|fda\.gov|census\.gov|gpo\.gov|govinfo\.gov|congress\.gov|federalregister\.gov|supremecourt\.gov|uscourts\.gov|archives\.gov|loc\.gov|nps\.gov|usgs\.gov|sba\.gov|le\.utah\.gov|doi\.org|arxiv\.org|nasa\.gov|energy\.gov|osti\.gov)$/i;

// Hosts that are never the subject speaking about itself: encyclopedias, business directories,
// and profile aggregators. A page typed `official-page` or `press-release` is a claim about *who
// is talking* — the organization, in its own voice — so pointing one of those types at a host in
// this list is a contradiction, and a costly one. The corpus carried a Wikipedia article typed
// `official-page` and attributed to the National Security Agency, which made a crowdsourced
// article read as a federal agency describing its own classified facility.
//
// These hosts are perfectly citable; they are `reference` (or `news`), and their tier says so.
export const REFERENCE_HOST_RE =
  /(^|\.)(wikipedia\.org|wikimedia\.org|wikidata\.org|britannica\.com|crunchbase\.com|linkedin\.com|pitchbook\.com|zoominfo\.com|owler\.com|dnb\.com|bloomberg\.com|glassdoor\.com|indeed\.com)$/i;

// Hosts that answer a signed-out fetch with HTTP 200 and a sign-in shell rather than the
// document. These defeat every heuristic the probe has: the status is 200, there is no parking
// copy, and no bot-wall challenge — just 60KB of loader JavaScript where the content should be.
// A probe that believes it therefore writes `Retrieved:`, asserting that a script successfully
// fetched the live URL, which is precisely the lie `Retrieved:` exists to prevent. It happened:
// `forgeutah.slack.com` permalinks were stamped 2026-08-11 from a login page.
//
// A source at one of these hosts is real and citable — see wiki/meta/attributes.md,
// "Community-channel testimony". What it cannot have is a `Retrieved:` (nothing can fetch it
// signed out) or an `Archive:` (the Internet Archive cannot crawl past the login either), and
// lint must not bill it for those.
//
// It can, however, have a `Raw:`. The messages were captured with a real session by the
// scraper that feeds this wiki, so `scripts/capture-slack-sources.mjs` writes the cited ones
// into `raw/` and `verbatim-not-in-raw` then checks them exactly as it checks anything else.
// Do not weaken that: an uncheckable quote is the one hole this corpus cannot afford, and the
// first run of that script caught four silently mis-transcribed quotes on three pages.
export const AUTH_WALLED_HOST_RE = /(^|\.)(slack\.com|discord\.com|teams\.microsoft\.com|workplace\.com)$/i;

export function isAuthWalledHost(url) {
  try {
    return AUTH_WALLED_HOST_RE.test(new URL(String(url).trim()).hostname);
  } catch {
    return false;
  }
}

export function isReferenceHost(url) {
  try {
    return REFERENCE_HOST_RE.test(new URL(String(url).trim()).hostname);
  } catch {
    return false;
  }
}

export function isMandatedHost(url) {
  try {
    return MANDATED_HOST_RE.test(new URL(String(url).trim()).hostname);
  } catch {
    return false;
  }
}
