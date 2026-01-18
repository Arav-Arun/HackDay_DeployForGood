import React, { useState } from "react";
import { useAI } from "../../../hooks/useAI";
import "./LoreGenerator.css";

const LoreGenerator = ({ nft }) => {
  const { generateNFTLore, loading } = useAI();
  const [currentLore, setCurrentLore] = useState(null);
  const [error, setError] = useState(null);

  const regenerateLore = async () => {
    try {
      setError(null);
      const lore = await generateNFTLore(nft);
      setCurrentLore(lore);
    } catch (err) {
      setError("Failed to generate narrative. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="lore-generator">
      <div className="lore-header">
        <button
          onClick={regenerateLore}
          className="btn btn-secondary btn-generate"
          disabled={loading}
        >
          {loading
            ? "Generating..."
            : currentLore
              ? "Regenerate"
              : "Generate Narrative"}
        </button>
      </div>

      {loading ? (
        <div className="lore-loading">
          <div className="shimmer-wrapper" style={{ height: "150px" }}>
            <div className="shimmer"></div>
          </div>
        </div>
      ) : error ? (
        <div className="lore-error">
          <p>{error}</p>
        </div>
      ) : currentLore ? (
        <div className="lore-content">
          <h4 className="lore-title">{currentLore.title}</h4>
          <div className="lore-story">
            {currentLore.story.split("\n\n").map((paragraph, index) => (
              <p key={index} className="lore-paragraph">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      ) : (
        <div className="lore-empty">
          <p>
            Generate an AI-powered creative interpretation of this NFT based on
            its visual elements and traits.
          </p>
        </div>
      )}

      <div className="lore-footer">
        <span className="lore-disclaimer">
          Content for illustrative purposes
        </span>
      </div>
    </div>
  );
};

export default LoreGenerator;
