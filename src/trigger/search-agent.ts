import { task, metadata } from "@trigger.dev/sdk";
import OpenAI from "openai";
import fs from "node:fs/promises";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { ghReadFile, ghWriteFile } from "./github-wiki";

function getClient() {
  return new OpenAI({
    baseURL: "https://api.deepseek.com",
    apiKey: process.env.DEEPSEEK_API_KEY,
  });
}

const WIKI_ROOT = path.resolve(process.cwd(), "wiki");
const LEGACY_WIKI_ROOT = path.resolve(process.cwd(), "legacy_wiki/great_work");

function searchWiki(query: string): string {
  const roots = [WIKI_ROOT, LEGACY_WIKI_ROOT];
  const allFiles: string[] = [];
  const allSnippets: string[] = [];

  for (const root of roots) {
    try {
      const files = execFileSync("grep", ["-r", "-i", "-l", "--include=*.md", query, root], {
        encoding: "utf8",
        timeout: 5000,
      })
        .trim()
        .split("\n")
        .filter(Boolean);
      allFiles.push(...files);

      const snippets = execFileSync(
        "grep",
        ["-r", "-i", "-n", "--include=*.md", "-m", "15", query, root],
        { encoding: "utf8", timeout: 5000 }
      );
      allSnippets.push(snippets);
    } catch {
      // no matches in this root
    }
  }

  if (!allFiles.length) return `No wiki files found matching "${query}"`;
  return `Files matching "${query}":\n${allFiles.join("\n")}\n\nSnippets:\n${allSnippets.join("\n")}`;
}

async function readFile(filePath: string): Promise<string> {
  const resolved = path.resolve(
    filePath.startsWith("/") ? filePath : path.join(WIKI_ROOT, filePath)
  );

  // New wiki: read via GitHub API so agents always see the latest content,
  // including pages written after the last Trigger.dev deploy.
  if (resolved.startsWith(WIKI_ROOT)) {
    const repoRelative = "wiki/" + path.relative(WIKI_ROOT, resolved);
    return ghReadFile(repoRelative);
  }

  // Legacy wiki: bundled at deploy time; local read is fine (these don't change).
  if (resolved.startsWith(LEGACY_WIKI_ROOT)) {
    try {
      return await fs.readFile(resolved, "utf8");
    } catch {
      return `Error: could not read ${filePath}`;
    }
  }

  return "Error: path is outside wiki directories";
}

const SYSTEM_PROMPT = `You are the Great Work Utah wiki agent — a field guide for Utah's startup, research, and talent ecosystem. You can also write back to the wiki.

When answering a question reveals a clear gap — a company, person, or topic that deserves a wiki page but doesn't have one yet — use write_file to save it. Keep new pages concise and factual. Use the same markdown style as existing wiki entries.

You have access to two wiki corpora:

1. New wiki (${WIKI_ROOT}):
   - wiki/ventures/   — Utah companies and research groups
   - wiki/people/     — Notable individuals
   - wiki/helpers/    — Advisors, investors, service providers
   - wiki/resources/  — Programs, funds, accelerators
   - wiki/guides/     — Topic guides

2. Legacy wiki (${LEGACY_WIKI_ROOT}):
   - aerospace-and-propulsion/
   - computing-and-software/
   - culture-and-arts/
   - defense-and-security/
   - environment-and-earth/
   - industry-and-infrastructure/
   - mathematics-and-theoretical-science/
   - medicine-and-biology/
   - physics-and-materials/

Search both. Prefer the new wiki when entries overlap, but draw on the legacy wiki for depth and breadth.

Before calling any tool, write 1–3 sentences explaining your reasoning: what you're looking for, why, and what you expect to find. Think step by step.

Use your tools to search the wiki, then read the relevant files, then write a thorough response.
Always respond in well-formatted markdown with headers, bullets, and bold text. Cite specific entries.`;

const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "search_wiki",
      description:
        "Grep all wiki .md files for a keyword. Returns matching file paths and snippets. Run multiple searches with different terms to cover synonyms.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "Keyword or phrase to grep for" },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "read_file",
      description: "Read the full contents of a specific wiki file.",
      parameters: {
        type: "object",
        properties: {
          path: {
            type: "string",
            description:
              "File path — either a full path like /home/.../wiki/ventures/foo.md or relative like ventures/foo.md",
          },
        },
        required: ["path"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "write_file",
      description:
        "Write or update a wiki page. Use when you've synthesized something valuable enough to persist for future queries. Path is relative to wiki/, e.g. 'ventures/new-company.md' or 'guides/utah-vc-landscape.md'.",
      parameters: {
        type: "object",
        properties: {
          path: {
            type: "string",
            description: "Wiki-relative path, e.g. 'ventures/new-company.md'",
          },
          content: {
            type: "string",
            description: "Full markdown content of the page",
          },
          commit_message: {
            type: "string",
            description: "Short git commit message, e.g. 'search-agent: add XYZ entry'",
          },
        },
        required: ["path", "content", "commit_message"],
      },
    },
  },
];

type FunctionToolCall = {
  id: string;
  type: "function";
  function: { name: string; arguments: string };
};

async function runToolCallRound(
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  thinkingAcc: string
): Promise<{
  done: boolean;
  thinkingAcc: string;
  toolCalls: FunctionToolCall[];
  textContent: string;
  reasoningContent: string;
}> {
  const stream = await getClient().chat.completions.create({
    model: "deepseek-v4-flash",
    max_tokens: 1024,
    messages,
    tools,
    tool_choice: "auto",
    stream: true,
  });

  let textContent = "";
  let reasoningContent = "";
  let finishReason: string | null = null;
  const toolCallsMap: Record<number, { id: string; name: string; arguments: string }> = {};

  let updateCount = 0;
  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta as any;
    finishReason = chunk.choices[0]?.finish_reason ?? finishReason;

    // DeepSeek streams reasoning tokens separately — this is the real CoT
    if (delta?.reasoning_content) {
      reasoningContent += delta.reasoning_content;
      thinkingAcc += delta.reasoning_content;
      updateCount++;
      if (updateCount === 1 || updateCount % 8 === 0) {
        await metadata.set("thinking", thinkingAcc);
      }
    }

    if (delta?.content) {
      textContent += delta.content;
    }

    if (delta?.tool_calls) {
      for (const tc of delta.tool_calls) {
        if (!toolCallsMap[tc.index]) {
          toolCallsMap[tc.index] = { id: tc.id ?? "", name: tc.function?.name ?? "", arguments: "" };
        }
        if (tc.id) toolCallsMap[tc.index].id = tc.id;
        if (tc.function?.name) toolCallsMap[tc.index].name = tc.function.name;
        if (tc.function?.arguments) toolCallsMap[tc.index].arguments += tc.function.arguments;
      }
    }
  }

  await metadata.set("thinking", thinkingAcc);

  const toolCalls = Object.values(toolCallsMap).map((tc) => ({
    id: tc.id,
    type: "function" as const,
    function: { name: tc.name, arguments: tc.arguments },
  }));

  const done = finishReason === "stop" || toolCalls.length === 0;
  return { done, thinkingAcc, toolCalls, textContent, reasoningContent };
}

export const searchAgent = task({
  id: "search-agent",
  maxDuration: 120,
  run: async (payload: { query: string }) => {
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: payload.query },
    ];

    let thinkingAcc = "";

    // Phase 1: tool call loop with streamed reasoning
    for (let round = 0; round < 8; round++) {
      const { done, thinkingAcc: newThinking, toolCalls, textContent, reasoningContent } =
        await runToolCallRound(messages, thinkingAcc);
      thinkingAcc = newThinking;

      // reasoning_content must be passed back to DeepSeek or it errors
      messages.push({
        role: "assistant",
        content: textContent || null,
        ...(reasoningContent ? { reasoning_content: reasoningContent } : {}),
        tool_calls: toolCalls.length ? toolCalls : undefined,
      } as OpenAI.Chat.Completions.ChatCompletionMessageParam);

      if (done) break;

      for (const toolCall of toolCalls) {
        const args = JSON.parse(toolCall.function.arguments);
        let result: string;

        if (toolCall.function.name === "search_wiki") {
          const line = `\n\n🔍 search_wiki("${args.query}")\n`;
          thinkingAcc += line;
          await metadata.set("thinking", thinkingAcc);
          result = searchWiki(args.query);
        } else if (toolCall.function.name === "read_file") {
          const line = `\n\n📖 read_file("${path.basename(args.path)}")\n`;
          thinkingAcc += line;
          await metadata.set("thinking", thinkingAcc);
          result = await readFile(args.path);
        } else if (toolCall.function.name === "write_file") {
          const line = `\n\n💾 write_file("${args.path}")\n`;
          thinkingAcc += line;
          await metadata.set("thinking", thinkingAcc);
          // Safety: read first so we don't blindly overwrite existing wiki pages.
          const existing = await readFile(args.path);
          const exists = !existing.startsWith("Error");
          if (exists) {
            result = `Write blocked: wiki/${args.path} already exists (${existing.length} chars). Call read_file("${args.path}") to review it, then decide whether an update is needed. If you want to update, call write_file again with the full merged content.`;
          } else {
            result = await ghWriteFile(
              `wiki/${args.path}`,
              args.content,
              args.commit_message ?? `search-agent: add ${args.path}`,
            );
          }
        } else {
          result = "Unknown tool";
        }

        messages.push({ role: "tool", tool_call_id: toolCall.id, content: result });
      }
    }

    // Phase 2: stream the final response
    thinkingAcc += "\n\n✍️ Writing response…\n";
    await metadata.set("thinking", thinkingAcc);

    const finalStream = await getClient().chat.completions.create({
      model: "deepseek-v4-flash",
      max_tokens: 2048,
      messages: [
        ...messages,
        {
          role: "user",
          content:
            "Now write your final response in markdown based on what you found. Be specific and cite entries.",
        },
      ],
      stream: true,
    });

    let response = "";
    let tokenCount = 0;
    for await (const chunk of finalStream) {
      const content = chunk.choices[0]?.delta?.content ?? "";
      if (content) {
        response += content;
        tokenCount++;
        if (tokenCount === 1 || tokenCount % 10 === 0) {
          await metadata.set("response", response);
        }
      }
    }
    await metadata.set("response", response);
    return { response };
  },
});
