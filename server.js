/* global process */
import dotenv from "dotenv";
import app from "./api/index.js";

// Load environment variables for local dev
dotenv.config();

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
  console.log(`   Gemini API: ${process.env.GEMINI_API_KEY ? "✓" : "✗"}`);
  console.log(`   OpenAI API: ${process.env.OPENAI_API_KEY ? "✓" : "✗"}`);
  console.log(`   Etherscan API: ${process.env.ETHERSCAN_API_KEY ? "✓" : "✗"}`);
});
