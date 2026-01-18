import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRoutes from "./routes/chat.js";
import analysisRoutes from "./routes/analysis.js";
import researchRoutes from "./routes/research.js";
import proxyRoutes from "./routes/proxy.js";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// Mount all routes under /api
app.use("/api", chatRoutes);
app.use("/api", analysisRoutes);
app.use("/api", researchRoutes);
app.use("/api", proxyRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Export the app for Vercel and server.js
export default app;
