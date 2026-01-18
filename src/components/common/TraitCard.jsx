import React from "react";
import "./TraitCard.css";

const TraitCard = ({ trait, index }) => {
  // Handle missing or null rarity
  const rarity = trait.rarity;
  const hasRarity = rarity !== null && rarity !== undefined;

  const getRarityColor = (rarity) => {
    if (!hasRarity) return "var(--text-secondary)";
    if (rarity <= 1) return "#ff0055"; // Mythic - Red
    if (rarity <= 5) return "#ffd700"; // Legendary - Gold
    if (rarity <= 15) return "#d4a853"; // Rare - Warm Gold
    if (rarity <= 30) return "#b87333"; // Uncommon - Copper
    return "var(--text-secondary)"; // Common
  };

  const getRarityLabel = (rarity) => {
    if (!hasRarity) return "Unknown";
    if (rarity <= 1) return "Mythic";
    if (rarity <= 5) return "Legendary";
    if (rarity <= 15) return "Rare";
    if (rarity <= 30) return "Uncommon";
    return "Common";
  };

  // Safe formatting for displaying percentage
  const displayRarity = hasRarity
    ? rarity < 0.01
      ? "< 0.01"
      : parseFloat(rarity).toFixed(2).replace(/\.00$/, "")
    : "?";

  return (
    <div
      className="trait-card glass-card"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="trait-header">
        <span className="trait-type">{trait.trait_type}</span>
        {hasRarity && (
          <span
            className="trait-rarity-badge"
            style={{
              color: getRarityColor(rarity),
              borderColor: getRarityColor(rarity),
            }}
          >
            {displayRarity}%
          </span>
        )}
      </div>

      <h4 className="trait-value">{trait.value}</h4>

      {hasRarity && (
        <>
          <div className="trait-rarity-bar">
            {/* Width represents "Score" (100 - rarity%) so rarer items have fuller bars
             * OR we make it represent frequency (small bar = rare)?
             * Visual convention: Full bar = Best/Rare. So (100 - rarity) works well.
             */}
            <div
              className="trait-rarity-fill"
              style={{
                width: `${Math.max(5, 100 - rarity)}%`, // Ensure at least 5% visible
                background: getRarityColor(rarity),
              }}
            />
          </div>
          <span className="trait-rarity-label">{getRarityLabel(rarity)}</span>
        </>
      )}

      {!hasRarity && (
        <p className="trait-no-rarity">Rarity data not available</p>
      )}
    </div>
  );
};

export default TraitCard;
