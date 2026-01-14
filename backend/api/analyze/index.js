const { OpenAI } = require("openai");

module.exports = async (req, res) => {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "POST method required" });
    }

    let body = "";
    await new Promise((resolve) => {
      req.on("data", (chunk) => (body += chunk));
      req.on("end", resolve);
    });

    const { image } = JSON.parse(body);

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: [
        {
          role: "system",
          content: `
Return ONLY valid JSON in this format:

{
  "honesty": "...",
  "effort": "...",
  "ghosting": "...",
  "flags": "...",
  "suggested_reply": "..."
}

Tone guidelines:
- Sound like a real 30-year-old human.
- Be warm, grounded, and emotionally intelligent.
- Avoid therapy jargon.
- Avoid being harsh or dramatic.
- Be specific and observational.
- Keep each section 2–4 sentences.
- "suggested_reply" should be 1–2 sentences max.
- No emojis.
- No disclaimers.
- No extra text outside the JSON.
          `,
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: "Analyze this dating profile screenshot and generate a suggested reply.",
            },
            {
              type: "input_image",
              image_url: image,
            },
          ],
        },
      ],
    });

    const raw = response.output_text;

    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(500).json({ error: "No JSON found in model response." });
    }

    const cleanJSON = jsonMatch[0];
    const analysis = JSON.parse(cleanJSON);

    return res.status(200).json(analysis);
  } catch (err) {
    console.error("BACKEND ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
};
