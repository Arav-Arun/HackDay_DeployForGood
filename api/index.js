import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize AI clients
// Note: We use process.env directly for Vercel
const getGenAI = () => {
  if (!process.env.GEMINI_API_KEY) return null;
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
};

const getOpenAI = () => {
  if (!process.env.OPENAI_API_KEY) return null;
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
};

// Start Chat
app.post("/api/chat", async (req, res) => {
  try {
    const genAI = getGenAI();
    if (!genAI)
      return res.status(500).json({ error: "Missing Gemini API Key" });

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const { systemPrompt, userMessage, history } = req.body;

    const chat = model.startChat({
      history: history || [],
      generationConfig: {
        maxOutputTokens: 150,
        temperature: 0.8,
      },
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

// Lore Generation (Gemini)
app.post("/api/chat/lore", async (req, res) => {
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

// Lore Generation (OpenAI)
app.post("/api/lore", async (req, res) => {
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

// Chat (OpenAI)
app.post("/api/lore/chat", async (req, res) => {
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
      return res.json({
        reply: "*Glitch* Network busy (Rate Limit). Please wait.",
      });
    }
    res.status(500).json({ error: error.message });
  }
});

// Analysis
app.post("/api/analysis", async (req, res) => {
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

// Research
app.post("/api/research", async (req, res) => {
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

// Etherscan Proxy
app.get("/api/etherscan", async (req, res) => {
  try {
    const { module, action, address, contractaddress, ...otherParams } =
      req.query;
    const apiKey = process.env.ETHERSCAN_API_KEY;

    const params = new URLSearchParams({
      module,
      action,
      ...(address && { address }),
      ...(contractaddress && { contractaddress }),
      ...otherParams,
      apikey: apiKey,
    });

    const response = await fetch(
      `https://api.etherscan.io/api?${params.toString()}`,
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Etherscan proxy error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Export the app for Vercel
export default app;
