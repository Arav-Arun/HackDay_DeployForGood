/* global process */
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.get("/etherscan", async (req, res) => {
  try {
    const { module, action, address, contractaddress, ...otherParams } =
      req.query;
    const apiKey = process.env.ETHERSCAN_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Missing Etherscan API Key" });
    }

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

export default router;
