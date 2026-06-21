import fs from "node:fs/promises";
import path from "node:path";

const REPO_ROOT = path.resolve(new URL("..", import.meta.url).pathname);
const WIKI_ROOT = path.join(REPO_ROOT, "wiki");
const INDEX_DIR = path.join(WIKI_ROOT, "indexes");
const ROOT_INDEX = path.join(WIKI_ROOT, "index.md");

const PUBLIC_DIRS = [
  "resources",
  "sources",
  "ventures",
  "work",
  "helpers",
  "answers",
  "guides",
  "matches",
  "people",
];

const DESCRIPTIONS = {
  resources: "Grants, accelerators, state programs, labs, facilities, capital sources, courses, datasets, fellowships, competitions.",
  sources: "Raw or summarized evidence records used by fact and judgment pages.",
  ventures: "Startups, labs, spinouts, companies, nonprofits, and serious initiatives.",
  work: "Historical and current examples of great Utah work.",
  helpers: "Mentors, advisors, investors, service providers, firms, and other hands-on help.",
  answers: "Saved Ask articles and one-off syntheses.",
  guides: "Durable maps, playbooks, contextual rankings, and journey pages.",
  matches: "Specific recommendation artifacts connecting people, helpers, ventures, resources, or work.",
  people: "Founder, operator, researcher, student, executive, and candidate biographies.",
};

function parsePage(content) {
  const lines = content.split("\n");
  const h1 = lines.find((line) => line.startsWith("# "))?.slice(2).trim() ?? "(untitled)";
  const meta = {};
  const h1Index = lines.findIndex((line) => line.startsWith("# "));
  if (h1Index !== -1) {
    for (let i = h1Index + 1; i < lines.length; i += 1) {
      const line = lines[i];
      if (line.startsWith("## ")) break;
      const match = line.match(/^\*\*([^:]+):\*\*\s*(.*)$/);
      if (match) meta[match[1].trim()] = match[2].trim();
    }
  }

  const summaryHeading = lines.findIndex((line) => /^(## (Summary|Overview|Mission|What It Was|What it was))$/i.test(line));
  let summary = meta.Focus || meta["Source Type"] || "";
  if (summaryHeading !== -1) {
    const body = [];
    for (let i = summaryHeading + 1; i < lines.length; i += 1) {
      if (lines[i].startsWith("## ")) break;
      body.push(lines[i]);
    }
    const plain = body
      .join(" ")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/[*_`>#-]/g, "")
      .replace(/\s+/g, " ")
      .trim();
    const sentence = plain.match(/^.{1,220}?(?:[.!?](?:\s|$)|$)/)?.[0]?.trim();
    if (sentence) summary = sentence;
  }

  return {
    title: h1.replace(/\|/g, "\\|"),
    summary: (summary || "(no summary)").replace(/\|/g, "\\|"),
    updated: meta.Updated || meta.Accessed || "Unknown",
  };
}

async function readPages(dirName) {
  const dir = path.join(WIKI_ROOT, dirName);
  let entries = [];
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }

  const pages = [];
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".md")) continue;
    const filePath = path.join(dir, entry.name);
    const content = await fs.readFile(filePath, "utf8");
    pages.push({
      file: entry.name,
      ...parsePage(content),
    });
  }
  return pages.sort((a, b) => a.title.localeCompare(b.title));
}

function shardMarkdown(dirName, pages) {
  const description = DESCRIPTIONS[dirName] || "";
  const rows = pages
    .map((page) => `| [${page.title}](../${dirName}/${page.file}) | ${page.summary} | ${page.updated} |`)
    .join("\n");
  return [
    `# ${dirName}`,
    "",
    description,
    "",
    "| Article | Summary | Updated |",
    "|---------|---------|---------|",
    rows,
    "",
  ].join("\n");
}

async function main() {
  await fs.mkdir(INDEX_DIR, { recursive: true });
  const catalog = [];

  for (const dirName of PUBLIC_DIRS) {
    const pages = await readPages(dirName);
    await fs.writeFile(path.join(INDEX_DIR, `${dirName}.md`), shardMarkdown(dirName, pages), "utf8");
    catalog.push({ dirName, pages: pages.length });
  }

  const rows = catalog
    .map(({ dirName, pages }) => {
      const description = DESCRIPTIONS[dirName] || "";
      return `| ${dirName} | ${description.replace(/\|/g, "\\|")} | ${pages} | [indexes/${dirName}.md](indexes/${dirName}.md) |`;
    })
    .join("\n");

  const root = [
    "# Knowledge Base Index",
    "",
    "This Great Work wiki is sharded. Each page-type article table lives in `indexes/<type>.md`.",
    "",
    "| Topic | Description | Pages | Shard |",
    "|-------|-------------|-------|-------|",
    rows,
    "",
  ].join("\n");

  await fs.writeFile(ROOT_INDEX, root, "utf8");
  const total = catalog.reduce((sum, item) => sum + item.pages, 0);
  console.log(`built sharded wiki index for ${total} pages`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
