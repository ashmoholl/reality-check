console.log("🔥 USING UPDATED BACKEND");

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: "No image provided" });
    }

    const response = await client.responses.create({
      model: "gpt-4.1",
      input: [
        {
          role: "system",
          content: `
You are Reality Check, an emotionally intelligent dating analysis friend.
Return ONLY valid JSON. No emojis. No disclaimers.
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

      response_format: {
        type: "json_schema",
        json_schema: {
          name: "analysis",
          schema: {
            type: "object",
            properties: {
              honesty: { type: "string" },
              effort: { type: "string" },
              ghosting: { type: "string" },
              flags: { type: "string" },
              suggested_reply: { type: "string" },
              vibe_score: { type: "number" },
              takeaways: { type: "string" },
              date_meter: { type: "string" },
              texting_style: { type: "string" },
              archetype_traits: { type: "string" },
              archetype_strengths: { type: "string" },
              archetype_weaknesses: { type: "string" },
              archetype_like_signals: { type: "string" },
              archetype_pullback_signals: { type: "string" },
              archetype_compatibility: { type: "string" }
            },
            required: [
              "honesty",
              "effort",
              "ghosting",
              "flags",
              "suggested_reply",
              "vibe_score",
              "takeaways",
              "date_meter",
              "texting_style",
              "archetype_traits",
              "archetype_strengths",
              "archetype_weaknesses",
              "archetype_like_signals",
              "archetype_pullback_signals",
              "archetype_compatibility"
            ]
          }
        }
      }
    });

    // ⭐ Correct extraction for Responses API
    const raw = response.output[0].content[0].text;

    let json;
    try {
      json = JSON.parse(raw);
    } catch (e) {
      console.error("JSON PARSE ERROR:", raw);
      return res.status(500).json({ error: "Invalid JSON returned from model" });
    }

    return res.status(200).json(json);
  } catch (err) {
    console.error("ANALYSIS ERROR:", err);
    return res.status(500).json({ error: "Failed to analyze image" });
  }
};