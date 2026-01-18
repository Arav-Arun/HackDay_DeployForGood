import express from "express";
import { getGenAI, getOpenAI } from "../utils/clients.js";

const router = express.Router();

// Gemini Chat
router.post("/chat", async (req, res) => {
  try {
    const genAI = getGenAI();
    if (!genAI)
      return res.status(500).json({ error: "Missing Gemini API Key" });

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const { systemPrompt, userMessage, history } = req.body;

    const chat = model.startChat({
      history: history || [],
      generationConfig: { maxOutputTokens: 150, temperature: 0.8 },
    });

    const result = await chat.sendMessage(
      systemPrompt ? `${systemPrompt}\n\nUser: ${userMessage}` : userMessage,
    );
    const response = await result.response;
    const text = response.text();

    res.json({ text: text || "*Stares silently* (Empty response)" });
  } catch (error) {
    console.error("Chat API error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Gemini Lore (Backup)
router.post("/chat/lore", async (req, res) => {
  try {
    const genAI = getGenAI();
    if (!genAI)
      return res.status(500).json({ error: "Missing Gemini API Key" });

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const { prompt } = req.body;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const cleanText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    res.json(JSON.parse(cleanText));
  } catch (error) {
    console.error("Gemini lore error:", error);
    res.status(500).json({ error: error.message });
  }
});

// OpenAI Lore
router.post("/lore", async (req, res) => {
  try {
    const openai = getOpenAI();
    if (!openai)
      return res.status(500).json({ error: "Missing OpenAI API Key" });

    const { prompt, responseFormat } = req.body;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o",
      response_format: responseFormat || { type: "json_object" },
      max_tokens: 1500,
    });

    const content = completion.choices[0].message.content;
    res.json(JSON.parse(content));
  } catch (error) {
    console.error("OpenAI lore error:", error);
    res.status(500).json({ error: error.message });
  }
});

// OpenAI Chat (Lore Chat)
router.post("/lore/chat", async (req, res) => {
  try {
    const openai = getOpenAI();
    if (!openai)
      return res.status(500).json({ error: "Missing OpenAI API Key" });

    const { messages, maxTokens } = req.body;

    const completion = await openai.chat.completions.create({
      messages,
      model: "gpt-4o",
      max_tokens: maxTokens || 150,
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("OpenAI chat error:", error);
    if (error?.status === 429) {
      return res.json({ reply: "*Glitch* Network busy. Please wait." });
    }
    res.status(500).json({ error: error.message });
  }
});

export default router;
