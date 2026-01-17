import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

// Load environment variables from parent directory's .env
dotenv.config({ path: "../.env" });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize AI clients (keys are now server-side only!)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

// ============================================
// GEMINI CHAT ENDPOINT
// ============================================
app.post("/api/chat", async (req, res) => {
  try {
    const { systemPrompt, userMessage, history } = req.body;

    const chat = geminiModel.startChat({
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

    let text = "";
    if (response.candidates && response.candidates.length > 0) {
      const candidate = response.candidates[0];
      if (candidate.finishReason === "SAFETY") {
        return res.json({
          text: "*Coughs nervously* (Safety filters blocked this response)",
        });
      }
      if (candidate.content?.parts?.length > 0) {
        text = candidate.content.parts.map((p) => p.text).join("");
      }
    }

    res.json({ text: text || "*Stares silently* (Empty response)" });
  } catch (error) {
    console.error("Chat API error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// GEMINI LORE GENERATION (backup)
// ============================================
app.post("/api/chat/lore", async (req, res) => {
  try {
    const { prompt } = req.body;
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up markdown
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

// ============================================
// OPENAI LORE GENERATION
// ============================================
app.post("/api/lore", async (req, res) => {
  try {
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

// ============================================
// OPENAI CHAT (for NFT chat sessions)
// ============================================
app.post("/api/lore/chat", async (req, res) => {
  try {
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

    if (error?.status === 429 || error?.code === "insufficient_quota") {
      return res.json({
        reply:
          "*Glitch* Network busy (Rate Limit Exceeded). Please wait a moment.",
      });
    }

    res.status(500).json({ error: error.message });
  }
});

// ============================================
// OPENAI DEEP ANALYSIS
// ============================================
app.post("/api/analysis", async (req, res) => {
  try {
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

// ============================================
// GEMINI RESEARCH
// ============================================
app.post("/api/research", async (req, res) => {
  try {
    const { prompt } = req.body;
    const result = await geminiModel.generateContent(prompt);
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

// ============================================
// ETHERSCAN PROXY
// ============================================
app.get("/api/etherscan", async (req, res) => {
  try {
    const { module, action, address, contractaddress, ...otherParams } =
      req.query;

    const params = new URLSearchParams({
      module,
      action,
      ...(address && { address }),
      ...(contractaddress && { contractaddress }),
      ...otherParams,
      apikey: ETHERSCAN_API_KEY,
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

app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
  console.log(`   Gemini API: ${process.env.GEMINI_API_KEY ? "✓" : "✗"}`);
  console.log(`   OpenAI API: ${process.env.OPENAI_API_KEY ? "✓" : "✗"}`);
  console.log(`   Etherscan API: ${process.env.ETHERSCAN_API_KEY ? "✓" : "✗"}`);
});
