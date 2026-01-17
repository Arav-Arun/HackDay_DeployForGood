import React, { useState, useEffect } from "react";
import "./GasTracker.css";

/**
 * GasTracker Component
 * Shows current gas prices from Etherscan (free, no API key needed)
 */
const GasTracker = () => {
  const [gasData, setGasData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGas = async () => {
      try {
        // Etherscan free gas oracle (no API key required for this endpoint)
        const response = await fetch(
          "https://api.etherscan.io/api?module=gastracker&action=gasoracle"
        );
        const data = await response.json();

        if (data.status === "1" && data.result) {
          setGasData({
            low: parseInt(data.result.SafeGasPrice),
            average: parseInt(data.result.ProposeGasPrice),
            high: parseInt(data.result.FastGasPrice),
          });
        }
      } catch (err) {
        console.error("Error fetching gas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGas();
    // Refresh every 30 seconds
    const interval = setInterval(fetchGas, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !gasData) {
    return null; // Don't show anything while loading
  }

  // Determine if it's a good time to buy
  const isLowGas = gasData.average < 30;
  const isHighGas = gasData.average > 80;

  return (
    <div
      className={`gas-tracker ${
        isLowGas ? "gas-low" : isHighGas ? "gas-high" : ""
      }`}
    >
      <span className="gas-icon">⛽</span>
      <span className="gas-label">Gas:</span>
      <span className="gas-values">
        <span className="gas-value low">{gasData.low}</span>
        <span className="gas-separator">/</span>
        <span className="gas-value avg">{gasData.average}</span>
        <span className="gas-separator">/</span>
        <span className="gas-value high">{gasData.high}</span>
      </span>
      <span className="gas-unit">gwei</span>
      {isLowGas && <span className="gas-hint">Good time to buy!</span>}
    </div>
  );
};

export default GasTracker;
