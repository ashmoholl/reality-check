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

      // ⭐ The correct, supported format
      text: {
        format: {
          type: "json_object"
        }
      }
    });

    // ⭐ Correct extraction for json_object output
    const json = response.output[0].content[0].json;

    return res.status(200).json(json);
  } catch (err) {
    console.error("ANALYSIS ERROR:", err);
    return res.status(500).json({ error: "Failed to analyze image" });
  }
};