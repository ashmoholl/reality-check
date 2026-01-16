import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: "No image provided" });
    }

    const response = await client.responses.create({
      model: "gpt-4o-mini", // vision-capable model
      input: [
        {
          role: "system",
          content: `
You are Reality Check, an emotionally intelligent dating analysis engine.

Analyze the screenshot and return ONLY valid JSON with these fields:

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

Tone:
- Warm, grounded, emotionally intelligent
- No therapy jargon
- No emojis in the JSON
- No disclaimers
- 2–4 sentences per section
- suggested_reply = 1–2 sentences max
          `,
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: "Analyze this dating screenshot and return the JSON.",
            },
            {
              type: "input_image",
              image_url: image,
            },
          ],
        },
      ],
      response_format: { type: "json" },
    });

    const json = response.output[0].content[0].json;

    return res.status(200).json(json);
  } catch (err) {
    console.error("ANALYSIS ERROR:", err);
    return res.status(500).json({ error: "Failed to analyze image" });
  }
}