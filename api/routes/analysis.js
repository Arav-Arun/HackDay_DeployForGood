import express from "express";
import { getOpenAI } from "../utils/clients.js";

const router = express.Router();

router.post("/analysis", async (req, res) => {
  try {
    const openai = getOpenAI();
    if (!openai)
      return res.status(500).json({ error: "Missing OpenAI API Key" });

    const { prompt } = req.body;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o",
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    res.json({ content });
  } catch (error) {
    console.error("Analysis API error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
