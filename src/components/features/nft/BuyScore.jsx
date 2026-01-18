import React, { useState, useEffect } from "react";
import { generateBuyRecommendation } from "../../../services/loreAI";
import "./BuyScore.css";

/**
 * BuyScore Component
 * AI-powered "Should I Buy?" recommendation
 */
const BuyScore = ({ nft, traits, floorPrice, rarityScore }) => {
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const analyze = async () => {
      if (!nft) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const result = await generateBuyRecommendation({
          name: nft.name,
          collection: nft.collection,
          floorPrice,
          rarityScore,
          traitsCount: traits?.length || 0,
        });

        setRecommendation(result);
      } catch (err) {
        console.error("Error generating recommendation:", err);
        setRecommendation(null);
      } finally {
        setLoading(false);
      }
    };

    analyze();
  }, [nft, floorPrice, rarityScore, traits]);

  if (loading) {
    return (
      <div className="buy-score glass-card">
        <h3 className="subsection-title">Should I Buy?</h3>
        <div className="shimmer-wrapper" style={{ height: "100px" }}>
          <div className="shimmer"></div>
        </div>
      </div>
    );
  }

  if (!recommendation) {
    return null;
  }

  const { score, verdict, reason } = recommendation;

  let scoreClass = "neutral";
  if (score >= 70) scoreClass = "positive";
  else if (score <= 40) scoreClass = "negative";

  return (
    <div className={`buy-score glass-card score-${scoreClass}`}>
      <h3 className="subsection-title">Should I Buy?</h3>

      <div className="score-display">
        <div className="score-circle">
          <span className="score-number">{score}</span>
          <span className="score-max">/100</span>
        </div>
        <div className="score-verdict">{verdict}</div>
      </div>

      <p className="score-reason">{reason}</p>

      <p className="score-disclaimer">
        AI analysis for educational purposes only. Not financial advice.
      </p>
    </div>
  );
};

export default BuyScore;
