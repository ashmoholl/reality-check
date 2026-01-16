import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { text } = req.body;

    const response = await client.responses.create({
      model: "gpt-5-mini",
      input: `
You are Reality Check, an emotionally intelligent dating analysis engine.

Analyze the following message and return ONLY valid JSON with these fields:

{
  "honesty": "string",
  "effort": "string",
  "ghosting": "string",
  "flags": "string",
  "suggested_reply": "string",
  "emojis": "string",
  "vibe_score": "number",
  "takeaways": "string",
  "date_meter": "string"
}

Message to analyze:
${text}
      `,
      response_format: { type: "json" },
    });

    const json = response.output[0].content[0].json;

    return res.status(200).json(json);
  } catch (err) {
    console.error("ANALYSIS ERROR:", err);
    return res.status(500).json({ error: "Failed to analyze message" });
  }
}