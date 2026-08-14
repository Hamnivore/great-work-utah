#!/usr/bin/env node
// Lints wiki/pages/*.md against wiki/meta/attributes.md and wiki/meta/conventions.md.
// Views (wiki/views/) are generated, never hand-edited — this script does not lint
// their content, it only checks that wiki/views/index.md exists (a reminder that
// `node scripts/build-views.mjs` needs to be (re)run). See AGENTS.md.
import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import process from "node:process";
import { verbatimNotInRaw } from "./lib/verbatim.mjs";
import { unsupportedClaimAnchors } from "./lib/claims.mjs";
import { isMandatedHost, isReferenceHost, isAuthWalledHost } from "./lib/hosts.mjs";

const REPO_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const WIKI_ROOT = path.join(REPO_ROOT, "wiki");
const PAGES_DIR = path.join(WIKI_ROOT, "pages");
const VIEWS_DIR = path.join(WIKI_ROOT, "views");

// Closed vocabularies from wiki/meta/attributes.md.
const TYPE_VOCAB = ["venture", "person", "helper", "resource", "work", "guide", "source"];
const STATUS_VOCAB = ["Stub", "Draft", "Useful"];
const CONFIDENCE_VOCAB = ["High", "Medium", "Low"];
// The impact ladder. Rubric and rulings in wiki/meta/tiers.md. A trailing `*` is the hype-tier bump
// (ruling 9): one step, marked so stripping asterisks recovers the pure displacement ranking.
const TIER_VOCAB = ["S", "A", "B", "C", "D", "F", "unranked"];
const TIER_RE = /^(S|A|B|C|D|F|unranked)(\*)?$/;
const TIER_TYPES = ["venture", "person", "helper", "resource", "work"];
// A tier this high asserts the page argues its own bounds, so the argument has to exist.
const TIER_NEEDS_IMPACT = new Set(["S", "A", "B"]);
// Builder character visible in the work under a maximum-faith reading. Same fact-page scope as
// impact, no hype bump. The judgment lives in scratch TSVs; the page carries only its closed-vocab
// result. See wiki/meta/builder-tiers.md.
const BUILDER_TIER_VOCAB = ["S", "A", "B", "C", "D", "F", "unranked"];
const BUILDER_TIER_RE = /^(S|A|B|C|D|F|unranked)$/;
const BUILDER_TIER_TYPES = TIER_TYPES;
// The founder-resource ladder — a second, independent ranking of the resource shelf by what it hands
// a founder, rather than by world impact. Rubric and rulings in wiki/meta/founder-tiers.md. No hype
// bump here (a founder's week is not spent on delightful reading), and one extra value: `n/a` marks a
// page that serves a different audience entirely, which is not the same claim as F.
const FOUNDER_TIER_VOCAB = ["S", "A", "B", "C", "D", "F", "unranked", "n/a"];
const FOUNDER_TIER_RE = /^(S|A|B|C|D|F|unranked|n\/a)$/;
const FOUNDER_TIER_TYPES = ["resource", "helper"];
// The letter above D is a claim about what the page says it provides, so the section has to exist.
const FOUNDER_TIER_NEEDS_PROVIDES = new Set(["S", "A", "B"]);
const FOUNDER_PROVIDES_SECTIONS = ["What It Provides", "Who They Help"];
// Whether the subject is still being done. Assigner rubric in research/activity/rubric.md. Same page set as Tier;
// missing is not `unknown` — unknown means someone looked and failed.
const ACTIVITY_VOCAB = ["active", "dormant", "concluded", "unknown"];
const ACTIVITY_TYPES = TIER_TYPES;
const ACTIVITY_STALE_DAYS = 365;
const DOMAIN_VOCAB = [
  "energy",
  "health-bio",
  "aerospace-defense",
  "computing",
  "materials-mfg",
  "space-science",
  "capital-programs",
  "culture-place",
];
const ROLE_VOCAB = [
  "software-engineering",
  "data-science",
  "biology-life-sciences",
  "physical-sciences",
  "hardware-engineering",
  "manufacturing-operations",
  "clinical-regulatory",
  "product-design",
  "sales-business-development",
  "marketing-communications",
  "finance-accounting",
  "legal-policy",
  "program-project-management",
  "field-skilled-trades",
  "people-operations",
];

// Source Type vocabulary and the evidence tier each value carries, from
// meta/attributes.md "Source Type and tiers". Tier is a property of the type, not
// a separate attribute: primary sources are kept by an institution under a mandate,
// self-reported and secondary ones are not and must be captured (Archive + Verbatim).
const SOURCE_TYPE_TIERS = {
  filing: "primary",
  "government-record": "primary",
  dataset: "primary",
  "peer-reviewed": "primary",
  patent: "primary",
  preprint: "secondary",
  news: "secondary",
  reference: "secondary",
  testimony: "secondary",
  "official-page": "self-reported",
  "press-release": "self-reported",
};
const SOURCE_TYPE_VOCAB = Object.keys(SOURCE_TYPE_TIERS);
const CAPTURE_REQUIRED_TIERS = new Set(["self-reported", "secondary"]);

// Primary tier only excuses a page from capture when its URL points at a host obliged to
// keep the record (scripts/lib/hosts.mjs): a 10-K cited through a third-party EDGAR mirror,
// or IRS 990 data cited through a nonprofit aggregator, is a primary *record* behind a link
// nobody must keep, and it needs capturing like any other fragile URL. See
// meta/attributes.md, "Raw captures".

// Whether **URL:** names something that can actually be fetched. `Unknown` is a legitimate
// value meaning "no official page could be confirmed", not a malformed URL.
function isFetchableUrl(value) {
  if (!value) return false;
  try {
    return /^https?:$/.test(new URL(value.trim()).protocol);
  } catch {
    return false;
  }
}

function hostOf(url) {
  try {
    return new URL(String(url).split(/[;,]\s*/)[0]).hostname;
  } catch {
    return "unparseable URL";
  }
}

// meta/attributes.md "Identifiers". A wrong key is worse than no key, so shapes are
// checked strictly and unknown keys are rejected rather than passed through.
const IDENTIFIER_SHAPES = {
  cik: /^\d{10}$/,
  ein: /^\d{2}-\d{7}$/,
  uei: /^[A-Za-z0-9]{12}$/,
  lei: /^[A-Za-z0-9]{20}$/,
  ror: /^0[a-z0-9]{8}$/,
  orcid: /^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/,
  "utah-entity": /^\d{5,}(-\d{4})?$/,
  wikidata: /^Q\d+$/,
};
const IDENTIFIER_TYPES = new Set(["venture", "person", "helper", "resource", "work"]);

// A "figure" is a number a reader would repeat: money, a percentage, a physical or
// human quantity, or a comma-grouped number. Deliberately excludes bare small
// integers and bare years, which are noise rather than claims.
const FIGURE_RE =
  /\$\s?\d[\d,]*(?:\.\d+)?\s*(?:million|billion|trillion)?|\d[\d,]*(?:\.\d+)?\s*(?:%|percent|MW|GW|kW|MWh|GWh|megawatts?|gigawatts?|kilowatts?|acres?|tons?|tonnes?|square feet|sq\.? ?ft|employees|jobs|patients|students|beds|wells|users|customers)|\d{1,3}(?:,\d{3})+(?:\.\d+)?/gi;
// Non-global twin: `test()` on a /g/ regex advances lastIndex between calls.
const FIGURE_TEST_RE = new RegExp(FIGURE_RE.source, "i");
const MAGNITUDES = { million: 1e6, billion: 1e9, trillion: 1e12 };
const ARCHIVE_URL_RE = /^https:\/\/web\.archive\.org\/web\/\d{4,14}(?:id_)?\/\S+$/;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// Required section headers by Type, from meta/conventions.md "Page templates".
// guide is free-form and source's requirement is prose-shaped (not a fixed header
// list), so neither is checked here.
const TEMPLATE_SECTIONS = {
  venture: ["Summary", "Impact", "Utah Context", "What They Need Now", "Open Questions", "Evidence"],
  work: ["Summary", "Impact", "Utah Context", "What It Took", "Open Questions", "Evidence"],
  resource: ["Summary", "Who It's For", "How To Use It", "Open Questions", "Evidence"],
  person: ["Summary", "Track Record", "What They're Looking For", "Evidence"],
  helper: ["Summary", "Who They Help", "Evidence"],
};

// Every bold-prefix key the corpus is allowed to carry. This exists because an unrecognized key
// is not inert: it is a claim written in the metadata register, where readers grant it the
// authority of a checked field, and nothing checks it. A misspelling (**Regoin:**) silently
// drops a page out of every regional view while still looking attributed on the page. Keeping
// the set closed also forces new fields through meta/attributes.md, which is the only place a
// visiting agent will look to find out what a field means.
const METADATA_KEYS = new Set([
  // identity and grading
  "Type", "Status", "Updated", "Confidence", "Tier", "Builder-tier", "Founder-tier",
  "Activity", "Activity-checked", "Activity-signal",
  "Focus", "Domain", "Domain-flagged", "Region",
  "Needs-reviewed", "Identifiers", "Era", "Stage", "Roles", "Ownership", "Careers", "Audience",
  // the document a source page is about
  "Website", "URL", "Publisher", "Published", "Source Type", "Retrieved", "Archive", "Archived",
  "Raw", "Derived From",
  // map tuple
  "Primary Location", "Utah Location", "Map Location", "Coordinates", "Location Precision",
  "Location Source", "Additional Map Location",
  // presentation, consumed by the generators
  "Relates", "Pull",
]);

const NEEDS_SECTION_RE = /^## What They Need Now\s*$/m;
const SECTION_HEADER_RE = /^## (.+?)\s*$/gm;
const MAINTAINER_PROSE_RE = /\b(?:legacy intake|legacy research|(?:local|older|prior|earlier) intake notes?|intake relied|internal notes?|capture note|during (?:this|the) migration|outside (?:this|the) migration|sparse migration|(?:this|the) page previously|future agents?|an editor|future editor|lint (?:requires|will|feeds|reports|reads)|before promoting this page|the wiki should)\b/i;
const EDITORIAL_TASK_RE = /^[-*] (?:add|create|locate and capture|decide whether|consider a future|a future [^.]+ should)\b/i;
const MARKDOWN_LINK_RE = /(?<!!)\[[^\]]+\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
const OLD_STYLE_LINK_RE = /\]\((\.\.\/|\/wiki\/)/g;
const STALE_MS = 183 * 24 * 3600 * 1000; // ~6 months, matches build-views.mjs
const MAP_FIELDS = ["Map Location", "Coordinates", "Location Precision", "Location Source"];
const UTAH_BOUNDS = { minLat: 36.99, maxLat: 42.01, minLon: -114.06, maxLon: -109.04 };

const args = new Set(process.argv.slice(2));
const json = args.has("--json");
const help = args.has("--help") || args.has("-h");

if (help) {
  console.log(`Usage: node scripts/wiki-lint.mjs [--json]

Lints wiki/pages/*.md against wiki/meta/attributes.md and wiki/meta/conventions.md.

Options:
  --json   Print machine-readable JSON instead of plain text.
`);
  process.exit(0);
}

const findings = [];
function addFinding(severity, code, filePath, message, line = null) {
  findings.push({
    severity,
    code,
    path: filePath ? path.relative(REPO_ROOT, filePath) : null,
    line,
    message,
  });
}

async function pathExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

function splitLines(content) {
  const normalized = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  return normalized.endsWith("\n") ? normalized.slice(0, -1).split("\n") : normalized.split("\n");
}

function lineForIndex(content, index) {
  return content.slice(0, index).split("\n").length;
}

// Bold-prefix attribute headers appear between the H1 and the first `## ` section.
function parseAttributeHeaders(lines, h1Index) {
  const headers = new Map();
  if (h1Index === -1) return headers;
  for (let i = h1Index + 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (line.startsWith("## ")) break;
    const match = line.match(/^\*\*([^:]+):\*\*\s*(.*)$/);
    if (match) {
      headers.set(match[1].trim(), { value: match[2].trim(), line: i + 1 });
    }
  }
  return headers;
}

function parseSectionHeaders(content) {
  const sections = new Set();
  for (const match of content.matchAll(SECTION_HEADER_RE)) {
    sections.add(match[1].trim());
  }
  return sections;
}

// Body text of one `## Section`, up to the next `## ` heading. Same idiom as the
// generators in build-views.mjs so a section reads the same everywhere.
function sectionBody(content, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = content.match(new RegExp(`## ${escaped}\\s+([\\s\\S]*?)(?=\\n## |$)`));
  return match ? match[1].trim() : "";
}

// -- Raw captures ----------------------------------------------------------
// raw/ holds captured source documents with none of our content in them. Captures are
// immutable (the filename carries the content hash), so they can be loaded once and
// compared against by substring. See meta/attributes.md, "Raw captures".
const rawCaptures = new Map(); // repo-relative path -> captured text
const captureFinalUrl = new Map(); // repo-relative .txt path -> URL the bytes actually came from
const captureStatus = new Map(); // repo-relative .txt path -> HTTP status the fetch returned

function loadRawCaptures() {
  const rawDir = path.join(REPO_ROOT, "raw");
  let dirs;
  try {
    dirs = fsSync.readdirSync(rawDir, { withFileTypes: true });
  } catch {
    return; // no raw store yet
  }
  for (const dir of dirs) {
    if (!dir.isDirectory()) continue;
    const abs = path.join(rawDir, dir.name);
    for (const file of fsSync.readdirSync(abs)) {
      const rel = `raw/${dir.name}/${file}`;
      if (file.endsWith(".txt")) {
        rawCaptures.set(rel, fsSync.readFileSync(path.join(abs, file), "utf8"));
        continue;
      }
      if (!file.endsWith(".json")) continue;
      try {
        const sidecar = JSON.parse(fsSync.readFileSync(path.join(abs, file), "utf8"));
        if (sidecar.final_url && !sidecar.via_archive) {
          captureFinalUrl.set(rel.replace(/\.json$/, ".txt"), sidecar.final_url);
        }
        if (typeof sidecar.http_status === "number") {
          captureStatus.set(rel.replace(/\.json$/, ".txt"), sidecar.http_status);
        }
      } catch {
        // A malformed sidecar loses the redirect check, not the quote check.
      }
    }
  }
}

function rawCaptureExists(rel) {
  return rawCaptures.has(rel);
}

// Registrable-ish domain: enough to tell "the site moved to a new company" from "the site
// added a www". Deliberately naive about multi-part public suffixes (.co.uk) — this feeds a
// warning a human reads, not an automated rewrite.
function registrableDomain(url) {
  try {
    const parts = new URL(String(url).trim()).hostname.toLowerCase().replace(/^www\./, "").split(".");
    return parts.slice(-2).join(".");
  } catch {
    return null;
  }
}

// A capture fetched from a domain the page does not cite is the most dangerous artifact in
// the store: it looks like evidence and quotes cleanly, but the words belong to somebody
// else. One dead venture's URL redirected to a hospital system's homepage, and an agent
// dutifully quoted the hospital.
//
// Not every off-site redirect is wrong, which is why this warns instead of refusing: a
// company gets acquired and its domain forwards to the parent, a project serves its
// canonical name from another host. The page just has to say so — naming the destination
// domain in the prose clears this, because then a reader knows whose words they are reading.
function captureRedirectedOffSite(rel, pageUrl, content) {
  const finalUrl = captureFinalUrl.get(rel);
  if (!finalUrl || !pageUrl) return null;
  const cited = registrableDomain(pageUrl.split(/[;,]\s*/)[0]);
  const actual = registrableDomain(finalUrl);
  if (!cited || !actual || cited === actual) return null;
  return content.includes(actual) ? null : actual;
}

// Same host, different path: the page cites one document and the capture holds another. Far
// quieter than an off-site redirect and just as corrosive, because everything downstream keys
// off **URL:** rather than off the bytes — `resolve-archive-snapshots.mjs` asks the Wayback
// Machine about the *cited* path, so a page whose URL still names the pre-redirect location
// gets a snapshot of a document it does not quote, or a truthful-sounding "no snapshot exists"
// for a URL that has not existed in years. Seven pages carried this before it was checked.
function captureMovedOnHost(rel, pageUrl) {
  const finalUrl = captureFinalUrl.get(rel);
  if (!finalUrl || !pageUrl) return null;
  try {
    const cited = new URL(pageUrl.split(/[;,]\s*/)[0].trim());
    const actual = new URL(finalUrl);
    if (registrableDomain(cited.href) !== registrableDomain(actual.href)) return null; // capture-off-site's job
    const citedPath = `${cited.pathname.replace(/\/$/, "")}${cited.search}`;
    const actualPath = `${actual.pathname.replace(/\/$/, "")}${actual.search}`;
    return citedPath === actualPath ? null : actual.href;
  } catch {
    return null;
  }
}

function quotesMissingFromCapture(verbatim, rel) {
  const rawText = rawCaptures.get(rel);
  return rawText ? verbatimNotInRaw(verbatim, rawText) : [];
}

function rawCaptureText(rel) {
  return rawCaptures.get(rel) || "";
}

// Numeric value of a figure match, scaled by any magnitude word, so "$824.5 million"
// and the XBRL fact "824500000" compare equal.
function figureValue(raw) {
  const digits = raw.replace(/,/g, "").match(/\d+(?:\.\d+)?/);
  if (!digits) return null;
  let value = Number(digits[0]);
  if (!Number.isFinite(value)) return null;
  const magnitude = raw.toLowerCase().match(/million|billion|trillion/);
  if (magnitude) value *= MAGNITUDES[magnitude[0]];
  return value;
}

// Quoted material is read permissively — every number in it counts, including the bare
// integers of a machine-readable fact block ("totrevenue 109245", "val 824500000") — and
// both the plain and magnitude-scaled reading of each. Only the claim side is strict.
function supportedFigureValues(text) {
  const values = [];
  // Unwrap blockquote markers first: a quote that line-breaks between "$70.0" and
  // "million" still carries the figure.
  const flat = text.replace(/^\s*>\s?/gm, " ").replace(/\s+/g, " ");
  for (const match of flat.matchAll(/-?\d[\d,]*(?:\.\d+)?(?:\s*(?:million|billion|trillion))?/gi)) {
    const plain = match[0].replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
    if (plain) values.push(Math.abs(Number(plain[0])));
    const scaled = figureValue(match[0]);
    if (scaled !== null) values.push(Math.abs(scaled));
  }
  return values.filter((v) => Number.isFinite(v));
}

// Rounding is honest reporting, not a mismatch: "$461.8 million" for 461,836,000 is
// within 0.5%, while "roughly $110,000" for 109,245 (0.7%) is a number the quote does
// not actually carry.
function figureIsSupported(value, supported) {
  return supported.some((candidate) => {
    if (candidate === value) return true;
    const scale = Math.max(Math.abs(candidate), Math.abs(value));
    return scale > 0 && Math.abs(candidate - value) / scale <= 0.005;
  });
}

function localMarkdownTarget(rawTarget) {
  if (!rawTarget || rawTarget.startsWith("#")) return null;
  if (/^[a-z][a-z0-9+.-]*:/i.test(rawTarget)) return null; // scheme (http:, mailto:, ...)
  if (rawTarget.startsWith("../") || rawTarget.startsWith("/wiki/")) return null; // caught by old-style-link check
  const withoutAnchor = rawTarget.split("#")[0];
  const withoutQuery = withoutAnchor.split("?")[0];
  if (!withoutQuery.endsWith(".md")) return null;
  try {
    return decodeURIComponent(withoutQuery);
  } catch {
    return withoutQuery;
  }
}

async function listPages() {
  if (!(await pathExists(PAGES_DIR))) return [];
  const entries = await fs.readdir(PAGES_DIR, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && e.name.endsWith(".md"))
    .map((e) => e.name)
    .sort((a, b) => a.localeCompare(b));
}

// -- collected stats -------------------------------------------------------
const stats = {
  totalPages: 0,
  domainAttributed: 0,
  regionAttributed: 0,
  primaryLocationAttributed: 0,
  utahLocationAttributed: 0,
  legacyLocation: 0,
  domainFlagged: 0,
  needsSectionCount: 0,
  needsReviewedCount: 0,
  rolesAttributed: 0,
  mapAttributed: 0,
  identifierAttributed: 0,
  identifierEligible: 0,
  sourcePages: 0,
  sourceTypeStandard: 0,
  retrievedAttributed: 0,
  captureRequired: 0,
  captureArchived: 0,
  captureVerbatim: 0,
  captureRaw: 0,
  sourcesWithoutUrl: 0,
  sourcesAuthWalled: 0,
  figureLines: 0,
  figureLinesCited: 0,
};
const wanted = new Map(); // target filename -> Set of referencing pages
// Work owed on pages that are otherwise valid. Reported as one finding per kind with
// every affected file named (not a sample), because the point is that the number is
// visible and shrinking — not that individual pages are exempt. Nothing here is a
// grandfather clause: a page in a backlog bucket is a page the corpus admits is unproven.
const backlog = {
  "missing-archive": [],
  "missing-verbatim": [],
  "missing-raw": [],
  "primary-behind-mirror": [],
};
const sourceTier = new Map(); // source filename -> tier
const sourcePages = new Set(); // every filename with Type: source, tiered or not
const evidenceCitations = new Map(); // fact filename -> { confidence, line, cited: Set, inProse: Map }

async function lintPage(filename) {
  const filePath = path.join(PAGES_DIR, filename);
  const content = await fs.readFile(filePath, "utf8");
  const lines = splitLines(content);
  const h1Index = lines.findIndex((line) => line.startsWith("# "));
  const headers = parseAttributeHeaders(lines, h1Index);
  const sections = parseSectionHeaders(content);
  const sectionEntries = [...content.matchAll(/^## (.+?)\s*$/gm)].map((match) => ({
    name: match[1].trim(),
    line: lineForIndex(content, match.index),
  }));
  const hasNeedsSection = NEEDS_SECTION_RE.test(content);

  // -- Unregistered metadata keys (warning) ---------------------------------
  // `Accessed` and `Location` are deliberately absent from METADATA_KEYS but reported
  // elsewhere with instructions specific to them; warning twice would bury the useful message.
  for (const [key, header] of headers) {
    if (METADATA_KEYS.has(key) || key === "Accessed" || key === "Location") continue;
    addFinding(
      "warning",
      "unknown-metadata-key",
      filePath,
      `**${key}:** is not a registered attribute. Check the spelling against wiki/meta/attributes.md, or register it there and in METADATA_KEYS if the field is real — an unregistered key looks checked and is not.`,
      header.line
    );
  }

  // -- Type ------------------------------------------------------------
  const typeHeader = headers.get("Type");
  let type = null;
  if (!typeHeader || !typeHeader.value) {
    addFinding("error", "missing-attribute", filePath, "Missing required **Type:** attribute.");
  } else {
    type = typeHeader.value;
    if (!TYPE_VOCAB.includes(type)) {
      addFinding(
        "error",
        "invalid-type",
        filePath,
        `**Type:** "${type}" is outside the closed vocabulary (${TYPE_VOCAB.join(" · ")}).`,
        typeHeader.line
      );
    }
  }

  // -- Status / Updated (required on every page) ------------------------
  const statusHeader = headers.get("Status");
  if (!statusHeader || !statusHeader.value) {
    addFinding("error", "missing-attribute", filePath, "Missing required **Status:** attribute.");
  } else if (!STATUS_VOCAB.includes(statusHeader.value)) {
    addFinding(
      "error",
      "invalid-status",
      filePath,
      `**Status:** "${statusHeader.value}" is outside the closed vocabulary (${STATUS_VOCAB.join(" · ")}).`,
      statusHeader.line
    );
  }
  const updatedHeader = headers.get("Updated");
  if (!updatedHeader || !updatedHeader.value) {
    addFinding("error", "missing-attribute", filePath, "Missing required **Updated:** attribute.");
  }

  // -- Confidence (required except Type: guide) --------------------------
  const confidenceHeader = headers.get("Confidence");
  if (type !== "guide" && (!confidenceHeader || !confidenceHeader.value)) {
    addFinding("error", "missing-attribute", filePath, "Missing required **Confidence:** attribute (required for all Types except guide).");
  }
  // Vocabulary is checked wherever the attribute appears, guides included.
  if (confidenceHeader && confidenceHeader.value && !CONFIDENCE_VOCAB.includes(confidenceHeader.value)) {
    addFinding(
      "error",
      "invalid-confidence",
      filePath,
      `**Confidence:** "${confidenceHeader.value}" is outside the closed vocabulary (${CONFIDENCE_VOCAB.join(" · ")}).`,
      confidenceHeader.line
    );
  }

  // -- Tier (required on fact pages; see wiki/meta/tiers.md) --------------
  const tierHeader = headers.get("Tier");
  if (TIER_TYPES.includes(type) && (!tierHeader || !tierHeader.value)) {
    addFinding(
      "error",
      "missing-attribute",
      filePath,
      `Missing required **Tier:** attribute (required for ${TIER_TYPES.join(", ")}). Assign one from the ladder in wiki/meta/tiers.md, or **Tier:** unranked when the page is too thin to argue bounds from — that escape hatch is honest, a silent guess is not.`
    );
  }
  if (tierHeader && tierHeader.value) {
    const raw = tierHeader.value.trim();
    const match = TIER_RE.exec(raw);
    if (!match) {
      addFinding(
        "error",
        "invalid-tier",
        filePath,
        `**Tier:** "${raw}" is outside the closed vocabulary (${TIER_VOCAB.join(" · ")}), each optionally suffixed "*" for the hype-tier bump. See wiki/meta/tiers.md.`,
        tierHeader.line
      );
    } else {
      if (!TIER_TYPES.includes(type)) {
        addFinding(
          "warning",
          "tier-on-wrong-type",
          filePath,
          `**Tier:** does not apply to Type: ${type} — evidence artifacts and wiki apparatus displace nothing, so ranking them is a category error.`,
          tierHeader.line
        );
      }
      if (match[2] && match[1] === "S") {
        addFinding(
          "error",
          "invalid-tier",
          filePath,
          `**Tier:** "S*" is not allowed: the hype-tier bump may reach A* but never S (tiers.md ruling 9), because the top of the ladder is a claim about the world.`,
          tierHeader.line
        );
      }
      if (TIER_NEEDS_IMPACT.has(match[1]) && !sections.has("Impact")) {
        addFinding(
          "warning",
          "tier-without-impact",
          filePath,
          `**Tier:** ${raw} claims this page argues its own bounds, but there is no "## Impact" section. A tier of B or above requires one whatever the Type (tiers.md, "Hooks into the machinery") — write the argument or lower the tier.`,
          tierHeader.line
        );
      }
    }
  }

  // -- Builder-tier (required on fact pages; wiki/meta/builder-tiers.md) --
  const builderTierHeader = headers.get("Builder-tier");
  if (BUILDER_TIER_TYPES.includes(type) && (!builderTierHeader || !builderTierHeader.value)) {
    addFinding(
      "error",
      "missing-attribute",
      filePath,
      `Missing required **Builder-tier:** attribute (required for ${BUILDER_TIER_TYPES.join(", ")}). Assign one from wiki/meta/builder-tiers.md, or **Builder-tier:** unranked when the work reveals too little about its builders.`
    );
  }
  if (builderTierHeader && builderTierHeader.value) {
    const raw = builderTierHeader.value.trim();
    if (!BUILDER_TIER_RE.test(raw)) {
      addFinding(
        "error",
        "invalid-builder-tier",
        filePath,
        `**Builder-tier:** "${raw}" is outside the closed vocabulary (${BUILDER_TIER_VOCAB.join(" · ")}). There is no "*" bump. See wiki/meta/builder-tiers.md.`,
        builderTierHeader.line
      );
    } else if (!BUILDER_TIER_TYPES.includes(type)) {
      addFinding(
        "warning",
        "builder-tier-on-wrong-type",
        filePath,
        `**Builder-tier:** does not apply to Type: ${type} — source and guide pages do not embody a fact-page subject whose builders this ladder can read.`,
        builderTierHeader.line
      );
    }
  }

  // -- Founder-tier (required on the resource shelf; wiki/meta/founder-tiers.md) --
  const founderTierHeader = headers.get("Founder-tier");
  if (FOUNDER_TIER_TYPES.includes(type) && (!founderTierHeader || !founderTierHeader.value)) {
    addFinding(
      "error",
      "missing-attribute",
      filePath,
      `Missing required **Founder-tier:** attribute (required for ${FOUNDER_TIER_TYPES.join(", ")}). Assign one from the ladder in wiki/meta/founder-tiers.md — **Founder-tier:** unranked when nobody can tell what the page hands a founder, or **Founder-tier:** n/a when it serves a different audience entirely.`
    );
  }
  if (founderTierHeader && founderTierHeader.value) {
    const raw = founderTierHeader.value.trim();
    if (!FOUNDER_TIER_RE.test(raw)) {
      addFinding(
        "error",
        "invalid-founder-tier",
        filePath,
        `**Founder-tier:** "${raw}" is outside the closed vocabulary (${FOUNDER_TIER_VOCAB.join(" · ")}). There is no "*" bump on this ladder. See wiki/meta/founder-tiers.md.`,
        founderTierHeader.line
      );
    } else {
      if (!FOUNDER_TIER_TYPES.includes(type)) {
        addFinding(
          "warning",
          "founder-tier-on-wrong-type",
          filePath,
          `**Founder-tier:** does not apply to Type: ${type} — the founder ladder ranks the resource shelf, and a company or a historical proof is not something a founder can walk into and use.`,
          founderTierHeader.line
        );
      }
      if (FOUNDER_TIER_NEEDS_PROVIDES.has(raw) && !FOUNDER_PROVIDES_SECTIONS.some((s) => sections.has(s))) {
        addFinding(
          "warning",
          "founder-tier-without-provides",
          filePath,
          `**Founder-tier:** ${raw} claims this hands a founder something substantial, but there is no "## ${FOUNDER_PROVIDES_SECTIONS.join('" or "## ')}" section to check that against (founder-tiers.md ruling 1). Write what it hands over or lower the letter.`,
          founderTierHeader.line
        );
      }
    }
  }

  // -- Activity (research/activity/rubric.md). Not required: missing means unchecked, not unknown. --
  const activityHeader = headers.get("Activity");
  if (activityHeader && activityHeader.value) {
    const raw = activityHeader.value.trim();
    if (!ACTIVITY_VOCAB.includes(raw)) {
      addFinding(
        "error",
        "invalid-activity",
        filePath,
        `**Activity:** "${raw}" is outside the closed vocabulary (${ACTIVITY_VOCAB.join(" · ")}). See research/activity/rubric.md.`,
        activityHeader.line
      );
    } else {
      if (!ACTIVITY_TYPES.includes(type)) {
        addFinding(
          "warning",
          "activity-on-wrong-type",
          filePath,
          `**Activity:** does not apply to Type: ${type} — evidence artifacts and wiki apparatus are not things that are still being done.`,
          activityHeader.line
        );
      }
      if (raw === "active") {
        const signal = headers.get("Activity-signal");
        if (!signal || !/https?:\/\//.test(signal.value || "")) {
          addFinding(
            "error",
            "activity-without-signal",
            filePath,
            `**Activity:** active requires **Activity-signal:** with a dated public URL. A website that merely loads is not one; see research/activity/rubric.md.`,
            activityHeader.line
          );
        }
      }
      const checked = headers.get("Activity-checked");
      if (checked && ISO_DATE_RE.test(checked.value || "")) {
        const ageMs = Date.now() - Date.parse(`${checked.value}T00:00:00Z`);
        if (ageMs > ACTIVITY_STALE_DAYS * 24 * 60 * 60 * 1000) {
          addFinding(
            "warning",
            "activity-stale",
            filePath,
            `**Activity-checked:** ${checked.value} is more than a year old. Re-check the live public record; the value decays.`,
            checked.line
          );
        }
      }
    }
  }

  // -- Focus (required except Type: source) ------------------------------
  if (type !== "source") {
    if (!headers.has("Focus") || !headers.get("Focus").value) {
      addFinding("error", "missing-attribute", filePath, "Missing required **Focus:** attribute (required for all Types except source).");
    }
  }

  // -- Needs-reviewed iff "## What They Need Now" -------------------------
  const needsReviewedHeader = headers.get("Needs-reviewed");
  if (hasNeedsSection) {
    stats.needsSectionCount += 1;
    if (!needsReviewedHeader || !needsReviewedHeader.value) {
      addFinding(
        "error",
        "missing-needs-reviewed",
        filePath,
        "Page has a `## What They Need Now` section but no **Needs-reviewed:** date."
      );
    }
  } else if (needsReviewedHeader) {
    addFinding(
      "error",
      "unexpected-needs-reviewed",
      filePath,
      "Page has a **Needs-reviewed:** attribute but no `## What They Need Now` section.",
      needsReviewedHeader.line
    );
  }
  if (needsReviewedHeader && needsReviewedHeader.value) {
    stats.needsReviewedCount += 1;
    const parsed = new Date(needsReviewedHeader.value);
    if (!Number.isNaN(parsed.getTime())) {
      if (Date.now() - parsed.getTime() > STALE_MS) {
        addFinding(
          "warning",
          "stale-needs-reviewed",
          filePath,
          `**Needs-reviewed:** ${needsReviewedHeader.value} is older than ~6 months.`,
          needsReviewedHeader.line
        );
      }
    } else {
      addFinding("warning", "unparseable-needs-reviewed", filePath, `**Needs-reviewed:** "${needsReviewedHeader.value}" is not a parseable date.`, needsReviewedHeader.line);
    }
  }

  // -- Roles vocabulary, placement, and coverage ---------------------------
  const rolesHeader = headers.get("Roles");
  if (rolesHeader) {
    if (!hasNeedsSection) {
      addFinding(
        "error",
        "unexpected-roles",
        filePath,
        "Page has a **Roles:** attribute but no `## What They Need Now` section.",
        rolesHeader.line
      );
    }

    const tokens = rolesHeader.value.split(",").map((token) => token.trim());
    if (!rolesHeader.value || tokens.some((token) => !token)) {
      addFinding(
        "error",
        "invalid-role",
        filePath,
        `**Roles:** must be a non-empty comma-separated list from the closed vocabulary (${ROLE_VOCAB.join(" · ")}).`,
        rolesHeader.line
      );
    } else {
      stats.rolesAttributed += hasNeedsSection ? 1 : 0;
      const seenRoles = new Set();
      for (const token of tokens) {
        if (!ROLE_VOCAB.includes(token)) {
          addFinding(
            "error",
            "invalid-role",
            filePath,
            `**Roles:** value "${token}" is outside the closed vocabulary (${ROLE_VOCAB.join(" · ")}).`,
            rolesHeader.line
          );
        }
        if (seenRoles.has(token)) {
          addFinding(
            "error",
            "duplicate-role",
            filePath,
            `**Roles:** repeats "${token}".`,
            rolesHeader.line
          );
        }
        seenRoles.add(token);
      }
    }
  }

  // -- Domain vocabulary + coverage ---------------------------------------
  const domainHeader = headers.get("Domain");
  if (domainHeader && domainHeader.value) {
    stats.domainAttributed += 1;
    const tokens = domainHeader.value.split(",").map((t) => t.trim()).filter(Boolean);
    for (const token of tokens) {
      if (!DOMAIN_VOCAB.includes(token)) {
        addFinding(
          "error",
          "invalid-domain",
          filePath,
          `**Domain:** value "${token}" is outside the closed vocabulary (${DOMAIN_VOCAB.join(" · ")}).`,
          domainHeader.line
        );
      }
    }
  }

  // -- Region coverage (no vocabulary check requested) ---------------------
  const primaryLocationHeader = headers.get("Primary Location");
  if (primaryLocationHeader && primaryLocationHeader.value) {
    stats.primaryLocationAttributed += 1;
  }

  const utahLocationHeader = headers.get("Utah Location");
  if (utahLocationHeader && utahLocationHeader.value) {
    stats.utahLocationAttributed += 1;
  }

  const legacyLocationHeader = headers.get("Location");
  if (legacyLocationHeader && legacyLocationHeader.value) {
    stats.legacyLocation += 1;
    addFinding(
      "warning",
      "legacy-location",
      filePath,
      "**Location:** is legacy; use **Primary Location:** and **Utah Location:**.",
      legacyLocationHeader.line
    );
  }

  const regionHeader = headers.get("Region");
  if (regionHeader && regionHeader.value) {
    stats.regionAttributed += 1;
  }

  // -- Optional map tuple: complete, sourced, Utah-bounded, and never personal. --
  const presentMapFields = MAP_FIELDS.filter((key) => headers.get(key)?.value);
  if (presentMapFields.length > 0 && presentMapFields.length < MAP_FIELDS.length) {
    const missing = MAP_FIELDS.filter((key) => !headers.get(key)?.value);
    addFinding("error", "incomplete-map-location", filePath, `Map metadata is all-or-nothing; missing ${missing.map((key) => `**${key}:**`).join(", ")}.`);
  }
  if (presentMapFields.length === MAP_FIELDS.length) {
    stats.mapAttributed += 1;
    if (type === "person") {
      addFinding("error", "personal-map-location", filePath, "Person pages must not publish map coordinates.", headers.get("Coordinates").line);
    }
    const precision = headers.get("Location Precision").value;
    if (!["exact", "approximate"].includes(precision)) {
      addFinding("error", "invalid-location-precision", filePath, `**Location Precision:** must be "exact" or "approximate" (got "${precision}").`, headers.get("Location Precision").line);
    }
    const coordinateText = headers.get("Coordinates").value;
    const coordinateMatch = coordinateText.match(/^(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)$/);
    if (!coordinateMatch) {
      addFinding("error", "invalid-coordinates", filePath, "**Coordinates:** must be WGS84 decimal `latitude, longitude`.", headers.get("Coordinates").line);
    } else {
      const latitude = Number(coordinateMatch[1]);
      const longitude = Number(coordinateMatch[2]);
      if (latitude < UTAH_BOUNDS.minLat || latitude > UTAH_BOUNDS.maxLat || longitude < UTAH_BOUNDS.minLon || longitude > UTAH_BOUNDS.maxLon) {
        addFinding("error", "coordinates-outside-utah", filePath, `Coordinates ${coordinateText} fall outside Utah bounds.`, headers.get("Coordinates").line);
      }
    }
    const source = headers.get("Location Source").value;
    if (!/^https:\/\/\S+$/.test(source)) {
      addFinding("error", "invalid-location-source", filePath, "**Location Source:** must be one public HTTPS URL.", headers.get("Location Source").line);
    }
  }
  const additionalMapLocations = [...content.matchAll(/^\*\*Additional Map Location:\*\* (.+)$/gm)];
  const seenMapLabels = new Set();
  const seenMapCoordinates = new Set();
  if (presentMapFields.length === MAP_FIELDS.length) {
    seenMapLabels.add(headers.get("Map Location").value.trim().toLowerCase().replace(/\s+/g, " "));
    const [latitude, longitude] = headers.get("Coordinates").value.split(",").map(Number);
    if (Number.isFinite(latitude) && Number.isFinite(longitude)) seenMapCoordinates.add(`${latitude},${longitude}`);
  }
  for (const match of additionalMapLocations) {
    const line = lineForIndex(content, match.index);
    if (presentMapFields.length !== MAP_FIELDS.length) {
      addFinding("error", "additional-location-without-primary", filePath, "Additional map locations require a complete primary map tuple.", line);
      continue;
    }
    if (type === "person") {
      addFinding("error", "personal-map-location", filePath, "Person pages must not publish additional map coordinates.", line);
    }
    const parts = match[1].split(" | ").map((part) => part.trim());
    const coordinateMatch = parts[1]?.match(/^(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)$/);
    if (parts.length !== 4 || !parts[0] || !coordinateMatch || parts[2] !== "exact" || !/^https:\/\/\S+$/.test(parts[3] || "")) {
      addFinding("error", "invalid-additional-map-location", filePath, "Use `address | latitude, longitude | exact | https://source`.", line);
      continue;
    }
    const latitude = Number(coordinateMatch[1]);
    const longitude = Number(coordinateMatch[2]);
    const labelKey = parts[0].toLowerCase().replace(/\s+/g, " ");
    const coordinateKey = `${latitude},${longitude}`;
    if (seenMapLabels.has(labelKey) || seenMapCoordinates.has(coordinateKey)) {
      addFinding("error", "duplicate-map-location", filePath, `Additional map location duplicates an existing site: ${parts[0]}.`, line);
    }
    seenMapLabels.add(labelKey);
    seenMapCoordinates.add(coordinateKey);
    if (latitude < UTAH_BOUNDS.minLat || latitude > UTAH_BOUNDS.maxLat || longitude < UTAH_BOUNDS.minLon || longitude > UTAH_BOUNDS.maxLon) {
      addFinding("error", "coordinates-outside-utah", filePath, `Additional coordinates ${parts[1]} fall outside Utah bounds.`, line);
    }
  }

  // -- Identifiers: the join key into public registries ---------------------
  const identifiersHeader = headers.get("Identifiers");
  if (type && IDENTIFIER_TYPES.has(type)) stats.identifierEligible += 1;
  if (identifiersHeader && identifiersHeader.value) {
    if (type && !IDENTIFIER_TYPES.has(type)) {
      addFinding(
        "error",
        "unexpected-identifiers",
        filePath,
        `**Identifiers:** applies to ${[...IDENTIFIER_TYPES].join(" · ")} pages, not Type: ${type}. A filing's own accession or award number belongs in the page body.`,
        identifiersHeader.line
      );
    } else {
      stats.identifierAttributed += 1;
    }
    const seenKeys = new Set();
    for (const token of identifiersHeader.value.split(",").map((t) => t.trim()).filter(Boolean)) {
      const match = token.match(/^([a-z-]+)=(.+)$/);
      if (!match) {
        addFinding("error", "invalid-identifier", filePath, `**Identifiers:** entry "${token}" is not \`key=value\`.`, identifiersHeader.line);
        continue;
      }
      const [, key, value] = match;
      const shape = IDENTIFIER_SHAPES[key];
      if (!shape) {
        addFinding(
          "error",
          "invalid-identifier",
          filePath,
          `**Identifiers:** key "${key}" is outside the closed vocabulary (${Object.keys(IDENTIFIER_SHAPES).join(" · ")}).`,
          identifiersHeader.line
        );
      } else if (!shape.test(value)) {
        addFinding("error", "invalid-identifier", filePath, `**Identifiers:** "${key}=${value}" does not match the registered shape ${shape}.`, identifiersHeader.line);
      }
      if (seenKeys.has(key)) {
        addFinding("error", "duplicate-identifier", filePath, `**Identifiers:** repeats key "${key}".`, identifiersHeader.line);
      }
      seenKeys.add(key);
    }
  }

  // -- Source pages: tier, capture, and quote-backed claims ------------------
  if (type === "source") {
    stats.sourcePages += 1;
    sourcePages.add(filename);
    const sourceTypeHeader = headers.get("Source Type");
    let tier = null;
    if (!sourceTypeHeader || !sourceTypeHeader.value) {
      addFinding("error", "missing-attribute", filePath, "Missing required **Source Type:** attribute on a Type: source page.");
    } else if (SOURCE_TYPE_VOCAB.includes(sourceTypeHeader.value)) {
      stats.sourceTypeStandard += 1;
      tier = SOURCE_TYPE_TIERS[sourceTypeHeader.value];
      sourceTier.set(filename, tier);
    } else {
      // The vocabulary is closed with no grace period: an unrecognized value leaves the
      // page untiered, and an untiered page is invisible to the Confidence check, which
      // is how a freeform vocabulary quietly disables enforcement.
      addFinding(
        "error",
        "invalid-source-type",
        filePath,
        `**Source Type:** "${sourceTypeHeader.value}" is not in the closed vocabulary (${SOURCE_TYPE_VOCAB.join(" · ")}). Run \`node scripts/migrate-source-metadata.mjs\`.`,
        sourceTypeHeader.line
      );
    }

    // `official-page` and `press-release` assert a speaker, not just a document. Pointing one
    // at an encyclopedia or a business directory attributes that host's words to the subject.
    const selfReportedType = sourceTypeHeader?.value === "official-page" || sourceTypeHeader?.value === "press-release";
    const sourceUrl = headers.get("URL")?.value;
    if (selfReportedType && sourceUrl && isReferenceHost(sourceUrl.split(/[;,]\s*/)[0])) {
      addFinding(
        "error",
        "self-reported-type-on-reference-host",
        filePath,
        `**Source Type:** ${sourceTypeHeader.value} says the subject is speaking in its own voice, but **URL:** points at ${hostOf(sourceUrl)}, which speaks for itself. Retype this as \`reference\` and credit that publisher, or cite the subject's own site.`,
        sourceTypeHeader.line
      );
    }

    if (headers.has("Accessed")) {
      addFinding(
        "error",
        "hand-typed-accessed",
        filePath,
        "**Accessed:** is not an attribute. Retrieval dates are written by scripts as **Retrieved:** — run `node scripts/migrate-source-metadata.mjs --write --probe`.",
        headers.get("Accessed").line
      );
    }

    const retrievedHeader = headers.get("Retrieved");
    if (retrievedHeader && retrievedHeader.value) {
      if (!ISO_DATE_RE.test(retrievedHeader.value)) {
        addFinding("error", "invalid-retrieved", filePath, `**Retrieved:** "${retrievedHeader.value}" must be \`YYYY-MM-DD\`.`, retrievedHeader.line);
      } else {
        stats.retrievedAttributed += 1;
        if (Date.now() - new Date(retrievedHeader.value).getTime() > STALE_MS) {
          addFinding("warning", "stale-retrieval", filePath, `**Retrieved:** ${retrievedHeader.value} is older than ~6 months — re-fetch and check for drift.`, retrievedHeader.line);
        }
      }
    }

    const archiveHeader = headers.get("Archive");
    const archivedHeader = headers.get("Archived");
    if (archiveHeader?.value && !archivedHeader?.value) {
      addFinding("error", "incomplete-archive", filePath, "**Archive:** requires **Archived:** (the snapshot's capture date).", archiveHeader.line);
    }
    if (archivedHeader?.value && !archiveHeader?.value) {
      addFinding("error", "incomplete-archive", filePath, "**Archived:** requires **Archive:** (the snapshot URL).", archivedHeader.line);
    }
    if (archiveHeader?.value && !ARCHIVE_URL_RE.test(archiveHeader.value)) {
      addFinding("error", "invalid-archive", filePath, "**Archive:** must be one bare `https://web.archive.org/web/<timestamp>/<url>` snapshot URL.", archiveHeader.line);
    }
    if (archivedHeader?.value && !ISO_DATE_RE.test(archivedHeader.value)) {
      addFinding("error", "invalid-archived", filePath, `**Archived:** "${archivedHeader.value}" must be \`YYYY-MM-DD\`.`, archivedHeader.line);
    }

    // A heading with nothing under it used to satisfy the verbatim requirement, because an empty
    // section body is whitespace and whitespace is truthy. That silently inflated the coverage
    // figure the whole capture effort is measured by. Content means a blockquote, or a fenced
    // block — dataset and API pages record machine output (JSON fields, a gauge reading, a CDX
    // row) in fences rather than quotes, and those are verified by the query recorded beside
    // them, so seven legitimate pages carry no `>` at all.
    // One source page describes one document (conventions.md). The way that rule gets broken is
    // always the same: a page is created as a bundle of "sources" on a topic, and its `Publisher`
    // ends up naming a committee — "Wikipedia contributors, health-policy journalism, and public
    // reference sources". Such a page cannot carry an honest `Source Type`, a single `URL`, or a
    // capture, and it hides its own gaps: one titled "WordPerfect and Novell Historical Sources"
    // claimed a 1994 acquisition and a BYU origin while the only document it cited was Corel's
    // current product page. Requiring a conjunction alongside the collective noun keeps a genuine
    // single publisher like "Wikipedia contributors (Wikimedia Foundation)" out of it.
    const publisherValue = headers.get("Publisher")?.value || "";
    if (/(,| and )/i.test(publisherValue) && /\b(sources|contributors|journalism|various|multiple|others)\b/i.test(publisherValue)) {
      addFinding(
        "warning",
        "source-bundles-publishers",
        filePath,
        `**Publisher:** names several publishers at once ("${publisherValue}"), so this page is a bundle rather than one document. Split it: one source page per document, each with its own **URL:**, **Source Type:**, and capture.`,
        headers.get("Publisher")?.line
      );
    }

    const verbatim = sectionBody(content, "Verbatim");
    const verbatimHasContent = /^\s*>/m.test(verbatim) || /```/.test(verbatim);
    const urlHeader = headers.get("URL");
    const rawHeader = headers.get("Raw");

    // A missing **Retrieved:** is meaningful — it is how the corpus says "nobody has got a 200
    // out of this URL" — so a page that plainly did fetch must not look like one that did not.
    // The way this happens is never deliberate: an agent captures the document, then rewrites
    // the page around its new quotes and carries **Raw:** across while dropping the fields it
    // did not author. Twelve pages inverted their own liveness signal that way in one sitting.
    if (rawHeader?.value && !retrievedHeader?.value && captureStatus.get(rawHeader.value.trim()) === 200) {
      addFinding(
        "warning",
        "retrieved-missing-despite-capture",
        filePath,
        "The capture recorded HTTP 200, but **Retrieved:** is absent — which reads as a dead URL. This field is script-owned: run `node scripts/migrate-source-metadata.mjs --write --probe` rather than typing a date.",
        rawHeader.line
      );
    }

    // Capture is owed when nobody is obliged to keep the artifact: either the tier is
    // self-reported/secondary, or the tier is primary but the cited URL is a mirror.
    const fragileUrl = Boolean(urlHeader?.value) && !isMandatedHost(urlHeader.value.split(/[;,]\s*/)[0]);
    // ...but only if there is a document at all. A source page may legitimately record an
    // unresolved lead — `**URL:** Unknown`, stating that no official page could be confirmed
    // (see meta/attributes.md, which holds araknitek-official-website.md up as the precedent
    // for a page like that being *finished*). Charging those pages archive, raw, and verbatim
    // debt puts work in the backlog that cannot ever be done, and a backlog with permanently
    // unpayable entries is one people learn to discount. They are counted separately below.
    const hasDocument = isFetchableUrl(urlHeader?.value?.split(/[;,]\s*/)[0]);
    if (!hasDocument) stats.sourcesWithoutUrl += 1;
    // A community-channel permalink is a narrower case, and only one of the three obligations
    // is genuinely impossible for it. A signed-out fetch gets 200 and a login shell, and the
    // Internet Archive cannot crawl past that either — so **Archive:** can never exist and
    // billing it is billing work nobody can do. **Raw:** and **Verbatim:** are a different
    // matter: the messages were captured with a real session and live in the scraper's
    // export, so `scripts/capture-slack-sources.mjs` can write them into raw/ and the
    // substring check applies exactly as it does anywhere else. Those two stay owed, because
    // they are the only thing standing between the corpus and an invented quote.
    const authWalled = isAuthWalledHost(urlHeader?.value?.split(/[;,]\s*/)[0]);
    if (authWalled) stats.sourcesAuthWalled += 1;
    const captureOwed = Boolean(tier) && hasDocument && (CAPTURE_REQUIRED_TIERS.has(tier) || fragileUrl);

    if (captureOwed) {
      stats.captureRequired += 1;
      if (archiveHeader?.value) stats.captureArchived += 1;
      else if (!authWalled) backlog["missing-archive"].push(`${filename} (${sourceTypeHeader.value})`);
      if (verbatimHasContent) stats.captureVerbatim += 1;
      else backlog["missing-verbatim"].push(`${filename} (${sourceTypeHeader.value})`);
      if (rawHeader?.value) stats.captureRaw += 1;
      else backlog["missing-raw"].push(`${filename} (${sourceTypeHeader.value})`);
      // A permanent record cited through a mirror is a real defect, but a fixable one, and
      // there are two honest fixes: point at the issuing body, or capture the mirror so the
      // document outlives it. Only flag when neither has happened. Warning a fully captured
      // page forever would train readers to scroll past this code — and some primary records
      // genuinely have no fetchable URL at the issuer (IRS 990 data is the standing case).
      //
      // Capture here means raw + verbatim, deliberately not archive: a snapshot is a
      // third-party courtesy that cannot be obtained for every document — no crawler indexes
      // a JSON API response — whereas the committed bytes and the checked quotes are what
      // actually make the record survive the mirror. A missing snapshot is still reported, by
      // missing-archive, which is the bucket that means it.
      const captured = Boolean(rawHeader?.value) && Boolean(verbatim);
      if (tier === "primary" && fragileUrl && !captured) {
        backlog["primary-behind-mirror"].push(`${filename} (${hostOf(urlHeader.value)})`);
      }
    }

    // The raw capture is what makes a quote checkable rather than merely consistent.
    if (rawHeader?.value) {
      const rawRel = rawHeader.value.trim();
      if (!rawRel.startsWith("raw/")) {
        addFinding("error", "invalid-raw", filePath, "**Raw:** must be a repo-relative path under `raw/`.", rawHeader.line);
      } else if (!rawCaptureExists(rawRel)) {
        addFinding("error", "missing-raw-file", filePath, `**Raw:** ${rawRel} does not exist. Captures are immutable — never rename or delete one.`, rawHeader.line);
      } else {
        // Checked whether or not the page quotes the capture: a capture of the wrong site is
        // a defect on its own, and the page that has not quoted it yet is precisely the one
        // where the mistake is still invisible.
        const offSite = captureRedirectedOffSite(rawRel, urlHeader?.value, content);
        if (offSite) {
          addFinding(
            "warning",
            "capture-off-site",
            filePath,
            `**URL:** was followed to ${offSite}, so the capture holds that site's words, not this one's. Point **URL:** at where the document now lives, or name ${offSite} on the page and say why the redirect is legitimate.`,
            rawHeader.line
          );
        } else {
          const moved = captureMovedOnHost(rawRel, urlHeader?.value);
          if (moved) {
            addFinding(
              "warning",
              "capture-url-drift",
              filePath,
              `**URL:** redirected to ${moved}, which is what was captured. Everything downstream trusts **URL:** over the bytes — archive resolution asks about the path you cite — so point **URL:** at the document this page actually quotes and re-run \`node scripts/resolve-archive-snapshots.mjs --write\`.`,
              urlHeader?.line ?? rawHeader.line
            );
          }
        }
        for (const quote of quotesMissingFromCapture(verbatim, rawRel)) {
          addFinding(
            "error",
            "verbatim-not-in-raw",
            filePath,
            `A ## Verbatim quote is not present in ${rawRel}: "${quote.slice(0, 90)}${quote.length > 90 ? "…" : ""}". Quote the document exactly, or re-capture it if the page changed.`
          );
        }
        // Quoting honestly and then claiming more than the document says is the defect the
        // verbatim check cannot see, and the one three audits actually found. See lib/claims.mjs.
        // Both sections describe the document, so both are bounded by it. Summary is checked
        // because that is the text views and search results surface: a stale figure there is
        // read by more people than one buried in a bullet.
        for (const section of ["Useful Claims", "Summary"]) {
          const strayAnchors = unsupportedClaimAnchors(sectionBody(content, section), rawCaptureText(rawRel));
          if (strayAnchors.length === 0) continue;
          const named = strayAnchors.slice(0, 5).map((a) => `${a.text} (${a.kind})`).join(", ");
          addFinding(
            // An error, not a warning: the corpus is at zero, and the failure mode is a page that
            // reads as sourced while asserting something its own document does not. A warning here
            // would accumulate exactly the pages nobody should be able to add.
            "error",
            "claim-anchor-not-in-raw",
            filePath,
            `${strayAnchors.length} date(s)/figure(s) in ## ${section} appear nowhere in ${rawRel}: ${named}. On a source page this section is bounded by the document — move the claim to a fact page that cites a document supporting it, or say plainly that this capture does not carry it.`
          );
        }
      }
    }

    // Every figure claimed must be quotable from the artifact. Claim lines that cite
    // another page are that page's responsibility (supersession notes, cross-refs).
    if (verbatim) {
      const supported = supportedFigureValues(verbatim);
      const unsupported = [];
      // One claim = one bullet, continuation lines folded in, so a wrapped claim is
      // read whole and the cross-reference exemption applies to the whole claim.
      const claims = [];
      for (const rawLine of sectionBody(content, "Useful Claims").split("\n")) {
        if (/^\s*[-*]\s/.test(rawLine) || claims.length === 0) claims.push(rawLine.trim());
        else claims[claims.length - 1] += ` ${rawLine.trim()}`;
      }
      for (const claim of claims) {
        if (/\]\([^)\s]+\.md/.test(claim)) continue;
        for (const match of claim.matchAll(FIGURE_RE)) {
          const value = figureValue(match[0]);
          if (value === null) continue;
          if (!figureIsSupported(Math.abs(value), supported)) unsupported.push(match[0].trim());
        }
      }
      if (unsupported.length > 0) {
        addFinding(
          "warning",
          "claim-figure-not-in-verbatim",
          filePath,
          `${unsupported.length} figure(s) in ## Useful Claims are not carried by ## Verbatim: ${[...new Set(unsupported)].slice(0, 5).join(", ")}. Quote the sentence or drop the number.`
        );
      }
    }
  }

  // -- Fact pages: what the Evidence section actually cites, and figure provenance --
  if (type && TEMPLATE_SECTIONS[type]) {
    const evidence = sectionBody(content, "Evidence");
    const cited = new Set();
    for (const match of evidence.matchAll(MARKDOWN_LINK_RE)) {
      const target = localMarkdownTarget(match[1]);
      if (target && !target.includes("/")) cited.add(target);
    }
    // Where else the page reaches for a source page, so a citation made only in prose can be
    // told from one the Evidence section actually lists. **Relates:** counts as prose here: it
    // holds the same `cites [Page](slug.md)` links and was in practice being used as a second,
    // unreadable Evidence section — three sources were reachable from nothing else.
    const inProse = new Map();
    const relates = headers.get("Relates");
    if (relates?.value) {
      for (const match of relates.value.matchAll(MARKDOWN_LINK_RE)) {
        const target = localMarkdownTarget(match[1]);
        if (target && !target.includes("/") && !cited.has(target)) inProse.set(target, relates.line);
      }
    }

    const skipped = new Set(["Evidence", "See Also", "Related Pages", "Maintainer Notes"]);
    let currentSection = null;
    for (const [index, line] of lines.entries()) {
      const heading = line.match(/^## (.+?)\s*$/);
      if (heading) {
        currentSection = heading[1].trim();
        continue;
      }
      if (currentSection === null || skipped.has(currentSection)) continue;
      for (const match of line.matchAll(MARKDOWN_LINK_RE)) {
        const target = localMarkdownTarget(match[1]);
        if (target && !target.includes("/") && !cited.has(target) && !inProse.has(target)) {
          inProse.set(target, index + 1);
        }
      }
      if (/^\*\*[^:]+:\*\*/.test(line)) continue;
      if (!FIGURE_TEST_RE.test(line)) continue;
      stats.figureLines += 1;
      if (/\]\([^)\s]+\.md/.test(line) || /https?:\/\//.test(line)) stats.figureLinesCited += 1;
    }

    evidenceCitations.set(filename, {
      confidence: confidenceHeader?.value ?? null,
      line: confidenceHeader?.line ?? null,
      cited,
      inProse,
    });
  }

  // -- Domain-flagged adjudication queue -----------------------------------
  const flaggedHeader = headers.get("Domain-flagged");
  if (flaggedHeader && flaggedHeader.value) {
    stats.domainFlagged += 1;
    addFinding("warning", "domain-flagged", filePath, `Flagged for domain adjudication: "${flaggedHeader.value}".`, flaggedHeader.line);
  }

  // -- Old-style links (error) ----------------------------------------------
  for (const match of content.matchAll(OLD_STYLE_LINK_RE)) {
    const line = lineForIndex(content, match.index);
    addFinding("error", "old-style-link", filePath, `Old-style link target "${match[1]}..." — links must be same-directory relative (see conventions.md Links).`, line);
  }

  // -- Template sections (warning) -------------------------------------------
  if (type && TEMPLATE_SECTIONS[type]) {
    const missing = TEMPLATE_SECTIONS[type].filter((required) => !sections.has(required));
    if (missing.length > 0) {
      addFinding(
        "warning",
        "missing-template-sections",
        filePath,
        `Missing template section(s) for Type: ${type} — ${missing.map((s) => `## ${s}`).join(", ")}.`
      );
    }
    if (sections.has("Summary")) {
      const length = sectionBody(content, "Summary").replace(/\s+/g, " ").trim().length;
      if (length > 400) {
        addFinding(
          "warning",
          "summary-too-long",
          filePath,
          `## Summary is ${length} characters after whitespace is collapsed; it really should be under the 400-character soft limit.`
        );
      }
    }
  }

  // -- Maintainer notes (error) ----------------------------------------------
  // Editorial state stays available to agents in the canonical markdown, but it must be
  // segregated from reader-facing prose and easy to find at the end of the document.
  const maintainerSections = sectionEntries.filter(({ name }) => name === "Maintainer Notes");
  if (maintainerSections.length > 1) {
    addFinding(
      "error",
      "duplicate-maintainer-notes",
      filePath,
      "A page may contain at most one `## Maintainer Notes` section.",
      maintainerSections[1].line
    );
  }
  if (maintainerSections.length > 0) {
    const first = maintainerSections[0];
    if (sectionEntries.at(-1)?.name !== "Maintainer Notes") {
      addFinding(
        "error",
        "maintainer-notes-not-final",
        filePath,
        "`## Maintainer Notes` must be the final level-two section.",
        first.line
      );
    }
    if (!sectionBody(content, "Maintainer Notes").trim()) {
      addFinding(
        "error",
        "empty-maintainer-notes",
        filePath,
        "Remove an empty `## Maintainer Notes` section or add the editorial note it is meant to hold.",
        first.line
      );
    }
  }

  // Internal workflow language in normal prose is almost always an editorial note that was
  // left behind. Keep this deliberately narrow: reader-facing uncertainty and source limits
  // belong in their normal sections, but intake/migration/lint history belongs at the end.
  let currentSection = null;
  for (const [index, line] of lines.entries()) {
    const heading = line.match(/^## (.+?)\s*$/);
    if (heading) currentSection = heading[1].trim();
    if (currentSection === "Maintainer Notes") continue;
    if (MAINTAINER_PROSE_RE.test(line)) {
      addFinding(
        "error",
        "maintainer-prose-outside-notes",
        filePath,
        "Internal intake, migration, lint, or editorial workflow prose belongs in the final `## Maintainer Notes`; preserve any reader-facing uncertainty by rewriting it directly.",
        index + 1
      );
    }
    if (currentSection === "Open Questions" && EDITORIAL_TASK_RE.test(line)) {
      addFinding(
        "error",
        "editorial-task-in-open-questions",
        filePath,
        "An editorial task is not an open question about the subject. Move it to the final `## Maintainer Notes`, and leave a direct factual question here only when readers need the answer.",
        index + 1
      );
    }
  }

  // -- Dangling internal links (warning; feeds wanted-pages list) -------------
  for (const match of content.matchAll(MARKDOWN_LINK_RE)) {
    const target = localMarkdownTarget(match[1]);
    if (!target) continue;
    if (target.includes("/")) continue; // not same-directory relative; not our concern here
    if (!wanted.has(target)) wanted.set(target, new Set());
    wanted.get(target).add(filename);
  }
}

// -- run ---------------------------------------------------------------------
loadRawCaptures();
const pageFiles = await listPages();
stats.totalPages = pageFiles.length;

for (const filename of pageFiles) {
  await lintPage(filename);
}

// Resolve dangling links against the actual page set.
const pageSet = new Set(pageFiles);
const wantedPages = [];
for (const [target, referrers] of wanted) {
  if (!pageSet.has(target)) {
    wantedPages.push({ target, referrers: [...referrers].sort() });
  }
}
wantedPages.sort((a, b) => a.target.localeCompare(b.target));
for (const { target, referrers } of wantedPages) {
  addFinding(
    "warning",
    "wanted-page",
    null,
    `${target} does not exist — referenced by ${referrers.length} page(s): ${referrers.slice(0, 5).join(", ")}${referrers.length > 5 ? ", ..." : ""}`
  );
}

// A source page reached from the prose but absent from ## Evidence is the failure mode that
// disables the check below, because that one reads the Evidence section and nothing else. The
// sequence is ordinary: an agent finds a filing, writes a source page for it, works the finding
// into the Impact paragraph where it belongs, and never returns to the list at the bottom. The
// page now rests on a primary record that the corpus cannot see it resting on — so the grade
// goes ungoverned, the source looks uncited from the other direction, and a later reader
// auditing "what is this page built on" gets the wrong answer. Same session, three pages.
for (const [filename, { cited, inProse }] of evidenceCitations) {
  const unlisted = [...inProse].filter(([target]) => sourcePages.has(target) && !cited.has(target));
  for (const [target, line] of unlisted) {
    addFinding(
      "error",
      "source-cited-outside-evidence",
      path.join(PAGES_DIR, filename),
      `${target} is a Type: source page cited in the prose but missing from ## Evidence, so nothing downstream counts it as evidence for this page. Add it to ## Evidence.`,
      line
    );
  }
}

// Confidence: High requires a primary-tier source among the pages it cites
// (meta/attributes.md, "Source Type and tiers"). Every source page now carries a tier, so
// this sees the whole corpus; a cited page with no tier is a page that is not a source
// page at all, which other checks handle.
for (const [filename, { confidence, line, cited }] of evidenceCitations) {
  if (confidence !== "High" || cited.size === 0) continue;
  const tiers = [...cited].map((target) => sourceTier.get(target)).filter(Boolean);
  if (tiers.length === 0 || tiers.includes("primary")) continue;
  addFinding(
    "warning",
    "confidence-without-primary",
    path.join(PAGES_DIR, filename),
    `**Confidence:** High but every tiered source cited is ${[...new Set(tiers)].join("/")}. A subject's own site is not primary evidence — cite a filing, award record, dataset, or paper, or drop to Medium.`,
    line
  );
}

// Capture backlog: one finding per kind, naming every affected page. Not a sample — an
// unarchived source is a claim with a fuse on it, and the list is the work queue.
const BACKLOG_MESSAGES = {
  "missing-archive": (n) => `${n} source page(s) owe an **Archive:** snapshot — the claim dies with the URL`,
  "missing-verbatim": (n) => `${n} source page(s) owe a ## Verbatim excerpt — nothing survives the URL`,
  "missing-raw": (n) => `${n} source page(s) owe a **Raw:** capture — the quote cannot be checked against the document`,
  "primary-behind-mirror": (n) =>
    `${n} primary-tier source page(s) cite a host nobody must preserve and have not captured it — point the URL at the issuing body, or finish the capture (archive + raw + verbatim)`,
};
// The console gets the count and a handful of examples; the full lists go to a generated
// report. A 215-name warning line is not transparency, it is a wall nobody reads — and an
// unread warning is the same as an exemption.
const BACKLOG_REPORT = path.join(REPO_ROOT, "research", "raw-data", "capture-backlog.md");
const backlogEntries = Object.entries(backlog).filter(([, e]) => e.length);
for (const [code, entries] of backlogEntries) {
  addFinding(
    "warning",
    code,
    null,
    `${BACKLOG_MESSAGES[code](entries.length)}. First: ${entries.slice(0, 3).join(", ")}${entries.length > 3 ? ` — full list in ${path.relative(REPO_ROOT, BACKLOG_REPORT)}` : ""}`
  );
}
if (backlogEntries.length) {
  const report = [
    "# Capture backlog",
    "",
    `Generated by \`node scripts/wiki-lint.mjs\` on ${new Date().toISOString().slice(0, 10)}. Regenerate rather than edit.`,
    "",
    "Every page here is valid and typed; what it lacks is evidence that outlives its URL.",
    "This is the Phase 2 work queue — see `research/design/raw-source-capture.md`.",
    "",
  ];
  for (const [code, entries] of backlogEntries) {
    report.push(`## ${code} (${entries.length})`, "", ...entries.map((e) => `- ${e}`), "");
  }
  fsSync.mkdirSync(path.dirname(BACKLOG_REPORT), { recursive: true });
  fsSync.writeFileSync(BACKLOG_REPORT, report.join("\n"));
}

// views/index.md must exist (reminder to run build-views.mjs); we do not otherwise scan views/.
const viewsIndexPath = path.join(VIEWS_DIR, "index.md");
if (!(await pathExists(viewsIndexPath))) {
  addFinding("error", "missing-views-index", viewsIndexPath, "wiki/views/index.md is missing — run `node scripts/build-views.mjs`.");
}

findings.sort((a, b) => {
  const pathCompare = (a.path ?? "").localeCompare(b.path ?? "");
  if (pathCompare !== 0) return pathCompare;
  return (a.line ?? 0) - (b.line ?? 0);
});

const errors = findings.filter((f) => f.severity === "error");
const warnings = findings.filter((f) => f.severity === "warning");

const countByCode = (list) => {
  const counts = {};
  for (const f of list) counts[f.code] = (counts[f.code] ?? 0) + 1;
  return counts;
};

const summary = {
  ok: errors.length === 0,
  checkedPages: pageFiles.length,
  errors: errors.length,
  warnings: warnings.length,
  errorsByCode: countByCode(errors),
  warningsByCode: countByCode(warnings),
    coverage: {
      domain: `${stats.domainAttributed}/${stats.totalPages}`,
      region: `${stats.regionAttributed}/${stats.totalPages}`,
      primaryLocation: `${stats.primaryLocationAttributed}/${stats.totalPages}`,
      utahLocation: `${stats.utahLocationAttributed}/${stats.totalPages}`,
      legacyLocation: `${stats.legacyLocation}/${stats.totalPages}`,
      map: `${stats.mapAttributed}/${stats.totalPages}`,
      roles: `${stats.rolesAttributed}/${stats.needsSectionCount}`,
      identifiers: `${stats.identifierAttributed}/${stats.identifierEligible}`,
      sourceType: `${stats.sourceTypeStandard}/${stats.sourcePages}`,
      retrieved: `${stats.retrievedAttributed}/${stats.sourcePages}`,
      archive: `${stats.captureArchived}/${stats.captureRequired}`,
      verbatim: `${stats.captureVerbatim}/${stats.captureRequired}`,
      raw: `${stats.captureRaw}/${stats.captureRequired}`,
      citedFigures: `${stats.figureLinesCited}/${stats.figureLines}`,
    },
  needsReviewed: {
    pagesWithNeedsSection: stats.needsSectionCount,
    pagesWithNeedsReviewed: stats.needsReviewedCount,
  },
  domainFlagged: stats.domainFlagged,
  wantedPagesCount: wantedPages.length,
};

if (json) {
  console.log(JSON.stringify({ ...summary, findings }, null, 2));
} else {
  console.log(`wiki-lint: checked ${pageFiles.length} pages in wiki/pages/`);
  console.log(`  errors:   ${errors.length}`);
  for (const [code, count] of Object.entries(summary.errorsByCode).sort()) console.log(`    ${code}: ${count}`);
  console.log(`  warnings: ${warnings.length}`);
  for (const [code, count] of Object.entries(summary.warningsByCode).sort()) console.log(`    ${code}: ${count}`);
  console.log(`  Domain attribution coverage: ${summary.coverage.domain}`);
  console.log(`  Region attribution coverage: ${summary.coverage.region}`);
  console.log(`  Primary Location coverage: ${summary.coverage.primaryLocation}`);
  console.log(`  Utah Location coverage: ${summary.coverage.utahLocation}`);
  console.log(`  Legacy Location remaining: ${summary.coverage.legacyLocation}`);
  console.log(`  Map location coverage: ${summary.coverage.map}`);
  console.log(`  Roles coverage: ${summary.coverage.roles} pages with a "What They Need Now" section`);
  console.log(`  Identifier coverage: ${summary.coverage.identifiers} eligible pages`);
  console.log(`  Source Type in vocabulary: ${summary.coverage.sourceType} source pages`);
  console.log(`  Retrieved (script-written) coverage: ${summary.coverage.retrieved} source pages`);
  console.log(`  Archive coverage: ${summary.coverage.archive} source pages that owe capture`);
  console.log(`  Verbatim coverage: ${summary.coverage.verbatim} source pages that owe capture`);
  console.log(`  Raw capture coverage: ${summary.coverage.raw} source pages that owe capture`);
  console.log(`  Sources with no resolvable URL: ${stats.sourcesWithoutUrl} (owe no capture; owe a URL)`);
  console.log(`  Auth-walled community sources: ${stats.sourcesAuthWalled} (owe raw + verbatim; no archive is possible)`);
  console.log(`  Cited figures: ${summary.coverage.citedFigures} numeric lines on fact pages`);
  console.log(`  Domain-flagged (adjudication queue): ${stats.domainFlagged}`);
  console.log(
    `  Needs-reviewed: ${stats.needsReviewedCount} present / ${stats.needsSectionCount} pages have a "What They Need Now" section`
  );
  console.log(`  Wanted pages (dangling links): ${wantedPages.length}`);
  console.log("");
  console.log("-- details --");
  for (const finding of findings) {
    const location = finding.path ? (finding.line ? `${finding.path}:${finding.line}` : finding.path) : "(cross-page)";
    console.log(`${finding.severity.toUpperCase()} ${finding.code} ${location} - ${finding.message}`);
  }
}

// Use exitCode (not exit()) so buffered stdout fully flushes when piped —
// process.exit() can truncate output on non-TTY/piped stdout in Node.
process.exitCode = errors.length > 0 ? 1 : 0;
