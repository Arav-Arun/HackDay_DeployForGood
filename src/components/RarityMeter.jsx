import React, { useEffect, useState } from "react";
import "./RarityMeter.css";

const RarityMeter = ({ score = 50, percentile = 50 }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // animate immediately
    requestAnimationFrame(() => {
      setAnimatedScore(score);
    });
  }, [score]);

  const getRarityLabel = (score) => {
    if (score >= 90) return "Legendary";
    if (score >= 75) return "Epic";
    if (score >= 50) return "Rare";
    if (score >= 25) return "Uncommon";
    return "Common";
  };

  const getRarityColor = (score) => {
    if (score >= 90) return "#ffd700"; // Gold - Legendary
    if (score >= 75) return "#f5b041"; // Amber - Epic
    if (score >= 50) return "#d4a853"; // Warm Gold - Rare
    if (score >= 25) return "#b87333"; // Copper - Uncommon
    return "#737373"; // Gray - Common
  };

  const getRarityGradient = (score) => {
    if (score >= 90) return "linear-gradient(90deg, #ffd700, #ffed4e)";
    if (score >= 75) return "linear-gradient(90deg, #f5b041, #f7c471)";
    if (score >= 50) return "linear-gradient(90deg, #d4a853, #e5be6e)";
    if (score >= 25) return "linear-gradient(90deg, #b87333, #cd8f55)";
    return "linear-gradient(90deg, #737373, #9ca3af)";
  };

  const topPercentage = Math.max(1, 100 - percentile);

  return (
    <div className="rarity-meter">
      <div className="rarity-meter-header">
        <div className="rarity-label-wrapper">
          <span
            className="rarity-label"
            style={{ color: getRarityColor(score) }}
          >
            {getRarityLabel(score)}
          </span>
          <span className="rarity-score">{score}/100</span>
        </div>
        <span className="rarity-percentile">Top {topPercentage}%</span>
      </div>

      <div className="rarity-meter-bar">
        <div
          className="rarity-meter-fill"
          style={{
            width: `${animatedScore}%`,
            background: getRarityGradient(score),
          }}
        />
        {/* Scale markers */}
        <div className="scale-markers">
          <span className="marker" style={{ left: "25%" }} />
          <span className="marker" style={{ left: "50%" }} />
          <span className="marker" style={{ left: "75%" }} />
          <span className="marker" style={{ left: "90%" }} />
        </div>
      </div>

      <div className="rarity-scale">
        <span>Common</span>
        <span>Uncommon</span>
        <span>Rare</span>
        <span>Epic</span>
        <span>Legendary</span>
      </div>
    </div>
  );
};

export default RarityMeter;
