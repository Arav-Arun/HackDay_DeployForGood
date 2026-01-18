import React from "react";
import "./ValueAnalysis.css";

const ValueAnalysis = ({ rarityScore, floorPrice }) => {
  // Simple valuation heuristic
  const calculateValuationMultiplier = (score) => {
    if (score >= 90) return 3.5; // Legendary: ~3.5x Floor
    if (score >= 80) return 2.0; // Epic: ~2x Floor
    if (score >= 60) return 1.3; // Rare: ~1.3x Floor
    return 1.0; // Common: Floor Price
  };

  const multiplier = calculateValuationMultiplier(rarityScore);
  const estimatedValue = (floorPrice * multiplier).toFixed(2);

  return (
    <div className="value-analysis ml-glass-card">
      <h3 className="subsection-title">Valuation Analysis</h3>

      <div className="valuation-grid">
        <div className="valuation-card">
          <span className="valuation-label">Estimated Value</span>
          <div className="valuation-price">
            <span className="eth-symbol">Ξ</span>
            {estimatedValue}
          </div>
          <span className="valuation-sub">
            {multiplier > 1.2 ? (
              <span className="valuation-badge high">
                Priced {Math.round((multiplier - 1) * 100)}% Above Floor
              </span>
            ) : multiplier < 1.0 ? (
              <span className="valuation-badge low">Priced Below Average</span>
            ) : (
              <span className="valuation-badge floor">
                Aligned with Floor Price
              </span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ValueAnalysis;
