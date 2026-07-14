#!/usr/bin/env node
// Lints wiki/pages/*.md against wiki/meta/attributes.md and wiki/meta/conventions.md.
// Views (wiki/views/) are generated, never hand-edited — this script does not lint
// their content, it only checks that wiki/views/index.md exists (a reminder that
// `node scripts/build-views.mjs` needs to be (re)run). See wiki/WIKI.md.
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const REPO_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const WIKI_ROOT = path.join(REPO_ROOT, "wiki");
const PAGES_DIR = path.join(WIKI_ROOT, "pages");
const VIEWS_DIR = path.join(WIKI_ROOT, "views");

// Closed vocabularies from wiki/meta/attributes.md.
const TYPE_VOCAB = ["venture", "person", "helper", "resource", "work", "guide", "source"];
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

const NEEDS_SECTION_RE = /^## What They Need Now\s*$/m;
const SECTION_HEADER_RE = /^## (.+?)\s*$/gm;
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
  mapAttributed: 0,
};
const wanted = new Map(); // target filename -> Set of referencing pages

async function lintPage(filename) {
  const filePath = path.join(PAGES_DIR, filename);
  const content = await fs.readFile(filePath, "utf8");
  const lines = splitLines(content);
  const h1Index = lines.findIndex((line) => line.startsWith("# "));
  const headers = parseAttributeHeaders(lines, h1Index);
  const sections = parseSectionHeaders(content);
  const hasNeedsSection = NEEDS_SECTION_RE.test(content);

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
  if (!headers.has("Status") || !headers.get("Status").value) {
    addFinding("error", "missing-attribute", filePath, "Missing required **Status:** attribute.");
  }
  const updatedHeader = headers.get("Updated");
  if (!updatedHeader || !updatedHeader.value) {
    addFinding("error", "missing-attribute", filePath, "Missing required **Updated:** attribute.");
  }

  // -- Confidence (required except Type: guide) --------------------------
  if (type !== "guide") {
    if (!headers.has("Confidence") || !headers.get("Confidence").value) {
      addFinding("error", "missing-attribute", filePath, "Missing required **Confidence:** attribute (required for all Types except guide).");
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
