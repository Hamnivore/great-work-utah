import fs from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const csvPath = path.join(repoRoot, "docs", "resouces-list.csv");
const resourcesDir = path.join(repoRoot, "wiki", "resources");
const indexPath = path.join(repoRoot, "wiki", "agent_ops", "index.md");
const today = "2026-05-09";

function parseCsv(text) {
  const normalized = text.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < normalized.length; i += 1) {
    const char = normalized[i];
    const next = normalized[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        i += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  const [headers, ...records] = rows.filter((record) => record.some((value) => value.trim() !== ""));
  return records.map((record) =>
    Object.fromEntries(headers.map((header, index) => [header.trim(), decodeEntities((record[index] ?? "").trim())]))
  );
}

function decodeEntities(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function slugify(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function titleCaseFromSlug(slug) {
  const keepLower = new Set(["and", "or", "of", "the", "for", "in", "to", "at", "by"]);
  return slug
    .split("-")
    .map((word, index) => {
      if (index > 0 && keepLower.has(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

function splitPipe(value) {
  return value
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
}

function sentence(value) {
  const cleaned = value.replace(/\s+/g, " ").trim();
  if (!cleaned) return "";
  return /[.!?]$/.test(cleaned) ? cleaned : `${cleaned}.`;
}

function chooseFocus(row) {
  const topics = splitPipe(row.Topics);
  const communities = splitPipe(row.Communities);
  const industries = splitPipe(row.Industries).filter((item) => item !== "Other");
  const parts = [...topics.slice(0, 4), ...communities.slice(0, 2), ...industries.slice(0, 2)];
  return [...new Set(parts)].join(", ") || "Utah business resource";
}

function chooseLocation(row) {
  const locations = splitPipe(row.Locations);
  if (locations.length === 0 || locations.length >= 20) return "Utah";
  if (locations.length <= 6) return locations.join(", ");
  return `${locations.slice(0, 6).join(", ")} and nearby counties`;
}

function formatList(items) {
  if (items.length === 0) return "- Not specified in the CSV import.";
  return items.map((item) => `- ${item}`).join("\n");
}

function formatLink(row) {
  if (!row.link) return "";
  return `\n- [Official website](${row.link.trim()})`;
}

function buildPage(row) {
  const title = row.Title.trim();
  const focus = chooseFocus(row);
  const location = chooseLocation(row);
  const topics = splitPipe(row.Topics);
  const communities = splitPipe(row.Communities);
  const industries = splitPipe(row.Industries);
  const counties = splitPipe(row.Locations);
  const summary = sentence(row.description) || `${title} is listed in the Startup State resource directory.`;
  const contact = row.email ? `\n- Email: [${row.email}](mailto:${row.email})` : "";

  return `# ${title}

**Status:** Stub
**Confidence:** Low
**Focus:** ${focus}
**Location:** ${location}
**Updated:** ${today}
**Layout:** field-guide

## Summary

${summary}

This page was bulk-imported from the Startup State resource CSV so the resource is discoverable in the wiki. It needs a future editorial pass against the provider's current official page before the wiki makes strong recommendations from it.

## Who It Helps

The CSV lists this resource for these communities:

${formatList(communities)}

It also maps the resource to these industries:

${formatList(industries)}

## What It Provides

The imported description suggests this resource may provide support related to:

${formatList(topics)}

## How To Access It

Start with the official link or contact information from the CSV, then verify the current program details before recommending it to a founder.
${formatLink(row)}${contact}

## Cost / Eligibility

Not specified in the CSV import. Verify current cost, application requirements, geographic coverage, and eligibility on the provider's official page.

## Best Fits

Based on the Startup State tags, this may fit Utah founders or operators working on:

${formatList([...new Set([...topics, ...communities])])}

## Imported Coverage

- Startup State CSV ID: ${row.id}
- Counties or regions: ${counties.length ? counties.join(", ") : "Not specified"}
- Communities: ${communities.length ? communities.join(", ") : "Not specified"}
- Industries: ${industries.length ? industries.join(", ") : "Not specified"}
- Topics: ${topics.length ? topics.join(", ") : "Not specified"}

## Evidence

- [Startup State Resource Filter](./startup-state-resource-list.md)
- [Startup State Resource List source note](../sources/startup-utah-resource-list.md)${formatLink(row)}

## Open Questions

- Is the imported description still accurate on the provider's current website?
- What is the exact next step for a founder: apply, schedule advising, attend an event, reserve space, or contact staff?
- Are there costs, deadlines, geographic limits, or eligibility rules that should change the recommendation?
`;
}

function parseTitleAndMeta(markdown) {
  const title = markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? "Untitled";
  const focus = markdown.match(/^\*\*Focus:\*\*\s*(.+)$/m)?.[1]?.trim();
  const summary = markdown.match(/^## Summary\n\n([\s\S]*?)(?:\n\n## |\n?$)/m)?.[1]?.replace(/\s+/g, " ").trim();
  return { title, focus, summary };
}

function firstSentence(value) {
  const cleaned = (value ?? "").replace(/\[[^\]]+\]\([^)]+\)/g, "").replace(/\s+/g, " ").trim();
  return cleaned.match(/^.+?[.!?](?:\s|$)/)?.[0]?.trim() ?? cleaned;
}

function refreshIndex() {
  let index = fs.readFileSync(indexPath, "utf8");
  const resourceFiles = fs
    .readdirSync(resourcesDir)
    .filter((file) => file.endsWith(".md"))
    .sort((a, b) => a.localeCompare(b));

  const lines = resourceFiles.map((file) => {
    const markdown = fs.readFileSync(path.join(resourcesDir, file), "utf8");
    const { title, focus, summary } = parseTitleAndMeta(markdown);
    const descriptor = focus || firstSentence(summary) || "resource page";
    return `- \`resources/${file}\` — **${title}** — ${descriptor}`;
  });

  index = index.replace(
    /^(\*\*Updated:\*\* ).+$/m,
    `$1${today} (bulk-ingested Startup State CSV resources; resources now cover the full imported list)`
  );

  index = index.replace(
    /\| `resources\/` \| \d+ \|/,
    `| \`resources/\` | ${resourceFiles.length} |`
  );

  index = index.replace(
    /## Resources\n\nGrants, accelerators, state programs, labs, facilities, capital sources, courses, datasets, fellowships, competitions\.\n\n[\s\S]*?\n\n## Work/,
    `## Resources\n\nGrants, accelerators, state programs, labs, facilities, capital sources, courses, datasets, fellowships, competitions.\n\n${lines.join("\n")}\n\n## Work`
  );

  fs.writeFileSync(indexPath, index);
}

const rows = parseCsv(fs.readFileSync(csvPath, "utf8"));
const existingFiles = new Set(fs.readdirSync(resourcesDir).filter((file) => file.endsWith(".md")));
const titleToExisting = new Map();
const csvTitleAliases = new Map([
  ["apex-accelerator", "apex-accelerator.md"],
  ["score", "score-utah.md"],
  ["small-business-administration-sba", "sba-utah-district-office.md"],
  ["small-business-development-center-sbdc", "utah-sbdc.md"],
  ["startup-state", "startup-state-resource-list.md"],
  ["utah-small-business-credit-initiative-usbci", "utah-small-business-credit-initiative.md"],
]);

for (const file of existingFiles) {
  const markdown = fs.readFileSync(path.join(resourcesDir, file), "utf8");
  const title = markdown.match(/^#\s+(.+)$/m)?.[1]?.trim();
  if (title) titleToExisting.set(slugify(title), file);
}

for (const [titleKey, filename] of csvTitleAliases) {
  if (existingFiles.has(filename)) {
    titleToExisting.set(titleKey, filename);
  }
}

let created = 0;
let skipped = 0;
const seenOutput = new Set(existingFiles);

for (const row of rows) {
  const titleKey = slugify(row.Title);
  if (titleToExisting.has(titleKey)) {
    skipped += 1;
    continue;
  }

  let slug = titleKey || `resource-${row.id}`;
  let filename = `${slug}.md`;
  if (seenOutput.has(filename)) {
    slug = `${slug}-${row.id}`;
    filename = `${slug}.md`;
  }

  fs.writeFileSync(path.join(resourcesDir, filename), buildPage(row));
  seenOutput.add(filename);
  titleToExisting.set(titleKey, filename);
  created += 1;
}

refreshIndex();

console.log(
  JSON.stringify(
    {
      rows: rows.length,
      created,
      skippedExistingByTitle: skipped,
      resourceFiles: fs.readdirSync(resourcesDir).filter((file) => file.endsWith(".md")).length,
    },
    null,
    2
  )
);
