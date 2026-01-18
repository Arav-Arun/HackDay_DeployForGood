import express from "express";
import { getGenAI } from "../utils/clients.js";

const router = express.Router();

router.post("/research", async (req, res) => {
  try {
    const genAI = getGenAI();
    if (!genAI)
      return res.status(500).json({ error: "Missing Gemini API Key" });

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const { prompt } = req.body;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const cleanedContent = text
      .replace(/```json\s*/g, "")
      .replace(/```\s*/g, "")
      .trim();
    res.json(JSON.parse(cleanedContent));
  } catch (error) {
    console.error("Research API error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
