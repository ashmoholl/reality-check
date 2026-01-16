const OpenAI = require("openai");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { text } = req.body;

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

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

  "emojis": "string of emojis representing the vibe (🔥💚😬🚩 etc.)",
  "vibe_score": "number from 0 to 100",
  "takeaways": "Top 3 bullet points summarizing the deeper emotional insights",
  "date_meter": "A fun rating of whether we would date this person"
}

Message to analyze:
${text}
      `,
      response_format: {
        type: "json",
      },
    });

    // FIXED LINE
    const json = JSON.parse(response.output_text);

    return res.status(200).json(json);
  } catch (err) {
    console.error("ANALYSIS ERROR:", err);
    return res.status(500).json({ error: "Failed to analyze message" });
  }
};