import { task } from "@trigger.dev/sdk/v3";
import OpenAI from "openai";

export const llmChat = task({
  id: "llm-chat",
  run: async (payload: { prompt: string }) => {
    const client = new OpenAI({
      baseURL: "https://api.deepseek.com",
      apiKey: process.env.DEEPSEEK_API_KEY,
    });
    const message = await client.chat.completions.create({
      model: "deepseek-v4-flash",
      max_tokens: 1024,
      messages: [{ role: "user", content: payload.prompt }],
    });

    const text = message.choices[0].message.content ?? "";
    console.log("Response:", text);
    return { response: text };
  },
});
