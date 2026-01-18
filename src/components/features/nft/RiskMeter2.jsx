import React, { useState, useEffect } from "react";
import { getNftSales, checkSpamStatus } from "../../../services/alchemy";
import "./RiskMeter2.css";

/**
 * RiskMeter2 Component
 * Fetches real data to show investment risk level
 */
const RiskMeter2 = ({
  contractAddress,
  tokenId,
  floorPrice = 0,
  hasRarityData = false,
}) => {
  const [riskData, setRiskData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRiskData = async () => {
      if (!contractAddress) {
        setLoading(false);
        return;
      }

      try {
        // Fetch sales data and spam status in parallel
        const [salesData, spamData] = await Promise.all([
          getNftSales(contractAddress, tokenId).catch(() => []),
          checkSpamStatus(contractAddress).catch(() => ({ isSpam: false })),
        ]);

        // Check contract verification via Etherscan
        let isVerified = true;
        try {
          // Use backend proxy to keep API key hidden
          const response = await fetch(
            `/api/etherscan?module=contract&action=getsourcecode&address=${contractAddress}`,
          );
          const data = await response.json();
          if (data.status === "1" && data.result && data.result[0]) {
            isVerified =
              data.result[0].SourceCode && data.result[0].SourceCode !== "";
          }
        } catch {
          isVerified = true; // Assume verified if API fails
        }

        setRiskData({
          salesCount: salesData.length,
          isSpam: spamData.isSpam,
          isVerified,
        });
      } catch (err) {
        console.error("Error fetching risk data:", err);
        setRiskData({ salesCount: 0, isSpam: false, isVerified: true });
      } finally {
        setLoading(false);
      }
    };

    fetchRiskData();
  }, [contractAddress, tokenId]);

  if (loading) {
    return (
      <div className="risk-meter glass-card">
        <h3 className="subsection-title">Investment Risk</h3>
        <div className="shimmer-wrapper" style={{ height: "80px" }}>
          <div className="shimmer"></div>
        </div>
      </div>
    );
  }

  if (!riskData) {
    return null;
  }

  const { salesCount, isSpam, isVerified } = riskData;

  // Calculate risk score (0-100, lower = safer)
  let riskScore = 50; // Start neutral

  // Verified contract reduces risk
  if (isVerified) riskScore -= 20;
  else riskScore += 20;

  // Spam flag increases risk significantly
  if (isSpam) riskScore += 40;

  // Floor price indicates established market
  if (floorPrice > 1) riskScore -= 15;
  else if (floorPrice > 0.1) riskScore -= 5;
  else if (floorPrice === 0) riskScore += 10;

  // Rarity data indicates legitimate collection
  if (hasRarityData) riskScore -= 10;

  // Sales history indicates liquidity
  if (salesCount > 5) riskScore -= 10;
  else if (salesCount === 0) riskScore += 10;

  // Clamp to 0-100
  riskScore = Math.max(0, Math.min(100, riskScore));

  // Determine risk level
  let riskLevel, riskLabel, riskColor;
  if (riskScore <= 30) {
    riskLevel = "low";
    riskLabel = "Low Risk";
    riskColor = "#10b981";
  } else if (riskScore <= 60) {
    riskLevel = "medium";
    riskLabel = "Medium Risk";
    riskColor = "#f59e0b";
  } else {
    riskLevel = "high";
    riskLabel = "High Risk";
    riskColor = "#ef4444";
  }

  // Risk factors for display
  const factors = [];
  if (isVerified) factors.push({ positive: true, text: "Verified contract" });
  else factors.push({ positive: false, text: "Unverified contract" });

  if (isSpam) factors.push({ positive: false, text: "Flagged as spam" });
  if (floorPrice > 0.5)
    factors.push({ positive: true, text: "Established floor price" });
  if (salesCount > 3)
    factors.push({ positive: true, text: `${salesCount} recorded sales` });
  else if (salesCount === 0)
    factors.push({ positive: false, text: "No recorded sales" });

  return (
    <div className={`risk-meter glass-card risk-${riskLevel}`}>
      <h3 className="subsection-title">Investment Risk</h3>

      <div className="risk-gauge">
        <div
          className="risk-bar"
          style={{
            width: `${100 - riskScore}%`,
            background: riskColor,
          }}
        />
      </div>

      <div className="risk-label" style={{ color: riskColor }}>
        {riskLabel}
      </div>

      <ul className="risk-factors">
        {factors.slice(0, 4).map((factor, idx) => (
          <li key={idx} className={factor.positive ? "positive" : "negative"}>
            <span className="factor-icon">{factor.positive ? "✓" : "!"}</span>
            {factor.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RiskMeter2;
