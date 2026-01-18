import React, { useState, useEffect } from "react";
import { generateTraitAnalysis } from "../../../services/loreAI";
import "./UniqueSummary.css";

/**
 * UniqueSummary Component
 * AI-generated explanation of what makes this NFT unique
 */
const UniqueSummary = ({ nft, traits }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateSummary = async () => {
      if (!nft || !traits || traits.length === 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Find the rarest traits (lowest percentage)
        const rarestTraits = [...traits]
          .filter((t) => t.rarity !== null && t.rarity !== undefined)
          .sort((a, b) => (a.rarity || 100) - (b.rarity || 100))
          .slice(0, 3);

        // Call AI for a simple summary
        const analysis = await generateTraitAnalysis(nft, rarestTraits);
        setSummary(analysis);
      } catch (err) {
        console.error("Error generating summary:", err);
        setSummary(null);
      } finally {
        setLoading(false);
      }
    };

    generateSummary();
  }, [nft, traits]);

  if (loading) {
    return (
      <div className="unique-summary glass-card">
        <h3 className="subsection-title">What Makes This Unique?</h3>
        <div className="shimmer-wrapper" style={{ height: "80px" }}>
          <div className="shimmer"></div>
        </div>
      </div>
    );
  }

  // Find rarest traits for manual display
  const rarestTraits = traits
    .filter((t) => t.rarity !== null && t.rarity !== undefined)
    .sort((a, b) => (a.rarity || 100) - (b.rarity || 100))
    .slice(0, 3);

  return (
    <div className="unique-summary glass-card">
      <h3 className="subsection-title">What Makes This Unique?</h3>

      {rarestTraits.length > 0 && (
        <div className="rarest-traits">
          {rarestTraits.map((trait, idx) => (
            <div key={idx} className="rare-trait-item">
              <span className="trait-name">{trait.trait_type}:</span>
              <span className="trait-value">{trait.value}</span>
              <span className="trait-rarity">
                {trait.rarity < 5
                  ? "Very Rare"
                  : trait.rarity < 15
                    ? "Rare"
                    : "Uncommon"}{" "}
                ({trait.rarity?.toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      )}

      {summary && <p className="ai-summary">{summary}</p>}

      {!summary && rarestTraits.length === 0 && (
        <p className="no-data">Unable to analyze uniqueness for this NFT.</p>
      )}
    </div>
  );
};

export default UniqueSummary;
