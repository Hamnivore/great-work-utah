// Verbatim-quote verification: the corpus's anti-fabrication mechanism.
//
// A `## Verbatim` blockquote on a source page must be a literal substring of the captured
// document in `raw/`. Extracted here rather than inlined in wiki-lint.mjs so it can be
// unit-tested directly — this is the one check that stands between the corpus and a
// confidently invented quote, and it needs to be known to fail when it should.
//
// See wiki/meta/attributes.md, "Raw captures".

// Both sides are flattened so comparison survives the trip through HTML extraction and
// markdown re-wrapping: whitespace collapsed, punctuation folded, case dropped.
//
// Three foldings look lax and are not. Every quote mark becomes one character, because an
// excerpt quoting a document that itself contains double quotes has to switch them to
// single quotes to nest — a markdown constraint, not a change to the words. A space
// before punctuation is dropped, because tag-stripping inserts one wherever a site wraps
// its closing period in its own element ("carbon-free energy ."). And a backslash before
// punctuation is dropped, because that is markdown escaping (`\"`, `\*`) — a writer telling
// the renderer to print a character, not a character the document contained. None of the
// three is where a fabricated quote hides: the words and the numbers still match exactly.
export function normalizeForQuoteCheck(text) {
  return String(text)
    .replace(/\\(?=[^\w\s])/g, "")
    .replace(/[\u2018\u2019\u02bc\u201c\u201d\u201a\u201e'"`]/g, "'")
    .replace(/[\u2013\u2014\u2212]/g, "-")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\s+([.,;:!?])/g, "$1")
    .trim()
    .toLowerCase();
}

// Minimum length for a fragment to be worth checking. Short fragments match almost any
// document by chance, so asserting them would be theatre.
const MIN_QUOTE_CHARS = 25;

// Blockquotes in a ## Verbatim section, with our own locator lines ("— Home page, ...")
// dropped, since those are the wiki talking and are not in the document. Fenced code
// blocks are skipped: they carry machine output (an API response, a CDX row), which is
// verified by the query recorded beside it rather than by substring.
export function verbatimQuotes(verbatim) {
  const withoutFences = String(verbatim).replace(/```[\s\S]*?```/g, "");
  const quotes = [];
  let current = [];
  for (const line of withoutFences.split("\n")) {
    const match = line.match(/^\s*>\s?(.*)$/);
    if (!match) {
      if (current.length) quotes.push(current.join(" "));
      current = [];
      continue;
    }
    const body = match[1].trim();
    if (/^[-\u2014\u2013]/.test(body)) continue; // locator line
    if (body) current.push(body);
  }
  if (current.length) quotes.push(current.join(" "));
  return quotes.map((q) => q.replace(/^"|"$/g, "").trim()).filter((q) => q.length > MIN_QUOTE_CHARS);
}

// Quotes in `verbatim` that do not appear in `rawText`. A quote may legitimately elide
// with an ellipsis; each surviving fragment must still be a literal substring, which is
// what stops "…" from laundering a rewrite of the parts in between.
export function verbatimNotInRaw(verbatim, rawText) {
  const haystack = normalizeForQuoteCheck(rawText);
  if (!haystack) return [];
  const missing = [];
  for (const quote of verbatimQuotes(verbatim)) {
    const fragments = normalizeForQuoteCheck(quote)
      .split(/\s*(?:\u2026|\.\.\.|\[\.\.\.\])\s*/)
      .map((f) => f.replace(/^['"]|['"]$/g, "").trim())
      .filter((f) => f.length > MIN_QUOTE_CHARS);
    if (!fragments.length) continue;
    if (!fragments.every((f) => haystack.includes(f))) missing.push(quote);
  }
  return missing;
}
