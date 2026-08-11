// Whether a source page's `## Useful Claims` stay inside the document the page cites.
//
// The verbatim check (lib/verbatim.mjs) proved the quotes are real. Three adversarial audits of
// 201 pages then found that quoting was almost never the problem: the defect had moved one
// section up. Pages carried bullets like "Energy Fuels acquired Denison Mines' U.S. assets in
// 2012" or "379M tons hauled" while `**Raw:**` pointed at a homepage capture containing neither
// the year nor the number. The words came from the writer's prior knowledge, and the page's
// layout made them look sourced.
//
// That failure is worse than a bad quote, because a reader who checks the quote and finds it
// exact reasonably concludes the rest of the page was checked too. On a `Type: source` page,
// `## Useful Claims` means "what this document establishes" — a claim the document does not
// make belongs on a fact page, where it can cite something that does.
//
// So this looks for load-bearing anchors — dates, years, and round magnitudes — that appear in
// the claims and nowhere in the captured document. It deliberately does not attempt to judge
// prose: "framed as validating Utah Valley's capability" is also a defect, and catching it needs
// a reader. What is mechanized here is the part that is unambiguous once you look.

const MONTHS = [
  ["january", "jan"],
  ["february", "feb"],
  ["march", "mar"],
  ["april", "apr"],
  ["may", "may"],
  ["june", "jun"],
  ["july", "jul"],
  ["august", "aug"],
  ["september", "sept", "sep"],
  ["october", "oct"],
  ["november", "nov"],
  ["december", "dec"],
];
const MONTH_ALT = MONTHS.flat().join("|");

// Commas fall out of numbers so "6,600" and "6600" compare equal, and quote marks and dashes
// are folded the way the verbatim checker folds them. Everything else is left alone: this
// comparison decides whether a number is in a document, and loosening it further would start
// finding numbers that are not there.
function normalize(text) {
  return String(text)
    .replace(/[\u2018\u2019\u201c\u201d]/g, "'")
    .replace(/[\u2013\u2014\u2212]/g, "-")
    .replace(/(\d),(?=\d{3}\b)/g, "$1")
    .replace(/\s+/g, " ")
    .toLowerCase();
}

// A bullet may legitimately mention a figure the capture lacks, in exactly two situations, and
// both announce themselves. It may hand the claim to another page — the cross-reference — or it
// may be a note that the document is silent, that a figure was superseded, or that something
// previously asserted here could not be reconfirmed. Recognizing the second case requires
// language about the *document*, not merely a negation: a bare "no" or "not" would let any
// sentence containing one smuggle an unsourced date through.
const DEFERS_TO_ANOTHER_PAGE = /\]\([^)\s]+\.md/;
const DISCUSSES_THE_CAPTURES_SILENCE =
  /\b(?:not (?:in|present|reconfirmed|captured|stated|shown|visible|corroborated)\b|does not (?:appear|contain|state|say|mention)\b|do not appear\b|absent from\b|is silent\b|are silent\b|no longer (?:appears|present|available)\b|not available in\b|previously (?:said|stated|summarized|asserted|added|listed|claimed)\b|superseded\b|unconfirmed\b|could not be (?:confirmed|reconfirmed|verified)\b)/i;

// One bullet is one claim, with wrapped continuation lines folded in, so an exemption that
// appears anywhere in the bullet applies to the whole of it.
//
// `## Summary` is prose rather than a list and needs the same scrutiny — a stale figure there is
// read by more people than one in a bullet, since the summary is what surfaces in views and search
// results. With no bullets to split on, each sentence becomes the unit, so "the page does not give
// a founding date" exempts its own sentence and not the whole paragraph.
export function claimBullets(text) {
  const lines = String(text).split("\n");
  const bullets = [];
  for (const line of lines) {
    if (/^\s*[-*]\s/.test(line)) bullets.push(line.trim());
    else if (bullets.length && line.trim()) bullets[bullets.length - 1] += ` ${line.trim()}`;
  }
  if (bullets.length) return bullets;
  return String(text)
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

// The forms a document might legitimately use for the same figure. "379M" is written "379
// million" as often as not, and a page should not be told its number is missing because the
// document spelled the magnitude out.
function magnitudeVariants(digits, suffix) {
  const words = { m: "million", b: "billion", k: "thousand" };
  return [`${digits}${suffix}`, `${digits} ${suffix}`, `${digits} ${words[suffix]}`, `${digits}${words[suffix]}`];
}

// The forms a document might use for a date: "December 16, 1954", "Dec. 16, 1954", "16 December
// 1954". Checked as month+day, with the year checked separately, because a document frequently
// gives the day in one place and the year in another ("On Sept. 15, days after it filed").
function dateVariants(month, day) {
  const names = MONTHS.find((m) => m.includes(month)) || [month];
  const forms = [];
  for (const name of names) {
    forms.push(`${name} ${day}`, `${name}. ${day}`, `${day} ${name}`);
  }
  return forms;
}

// Anchors in `usefulClaims` that do not appear anywhere in `rawText`. Each result names the
// anchor as written and why it is checkable, so a finding can be acted on without re-deriving it.
export function unsupportedClaimAnchors(usefulClaims, rawText) {
  const haystack = normalize(rawText);
  if (!haystack) return [];
  const missing = [];
  const seen = new Set();
  const record = (text, kind) => {
    const key = `${kind}:${text}`;
    if (seen.has(key)) return;
    seen.add(key);
    missing.push({ text, kind });
  };

  for (const bullet of claimBullets(usefulClaims)) {
    if (DEFERS_TO_ANOTHER_PAGE.test(bullet)) continue;
    const claim = normalize(bullet);

    // The silence exemption is itself a claim about the document, and it can be false. One page
    // stated that two population figures and a study-recruitment invitation were absent from its
    // capture when all three were in it — the figures written `20M` and `6M` in a statistics band,
    // which is why searching for "approximately 20 million" found nothing. A false disclaimer is
    // worse than a bald unsourced claim, because its hedging reads as diligence.
    //
    // Checked only for magnitudes and full dates, deliberately. A bare year is too promiscuous:
    // "the 2012 acquisition does not appear here" would be flagged by a stray copyright line.
    if (DISCUSSES_THE_CAPTURES_SILENCE.test(bullet)) {
      for (const m of claim.matchAll(/\b(\d[\d.]*)\s?([mbk])\+?(?![a-z])/g)) {
        if (magnitudeVariants(m[1], m[2]).some((v) => haystack.includes(v))) record(m[0].trim(), "disclaimed-but-present");
      }
      for (const m of claim.matchAll(new RegExp(`\\b(${MONTH_ALT})\\.?\\s+(\\d{1,2})(?:st|nd|rd|th)?,?\\s+(\\d{4})\\b`, "g"))) {
        if (dateVariants(m[1], m[2]).some((v) => haystack.includes(v))) record(`${m[1]} ${m[2]}, ${m[3]}`, "disclaimed-but-present");
      }
      continue;
    }

    // A year written as part of a full date belongs to that date, and is reported — or
    // cleared — with it. Reporting both turns one assertion into two findings, and the
    // duplicate is the kind of noise that gets a check disabled rather than obeyed.
    const yearsOwnedByADate = new Set();
    for (const m of claim.matchAll(new RegExp(`\\b(${MONTH_ALT})\\.?\\s+(\\d{1,2})(?:st|nd|rd|th)?,?\\s+(\\d{4})\\b`, "g"))) {
      const [, month, day, year] = m;
      yearsOwnedByADate.add(year);
      if (!dateVariants(month, day).some((v) => haystack.includes(v))) record(`${month} ${day}, ${year}`, "date");
    }

    for (const m of claim.matchAll(/\b(\d[\d.]*)\s?([mbk])\+?(?![a-z])/g)) {
      if (!magnitudeVariants(m[1], m[2]).some((v) => haystack.includes(v))) record(m[0].trim(), "figure");
    }

    // Years are the cheapest thing to assert and the most quietly wrong: a founding date or an
    // acquisition year reads as a fact anybody could look up, and on a source page it is
    // presented as one this document supports.
    for (const m of claim.matchAll(/\b(1[89]\d{2}|20[0-4]\d)\b/g)) {
      if (yearsOwnedByADate.has(m[1])) continue;
      if (!haystack.includes(m[1])) record(m[1], "year");
    }
  }
  return missing;
}
