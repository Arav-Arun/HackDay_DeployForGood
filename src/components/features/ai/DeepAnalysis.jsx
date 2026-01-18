import React, { useState } from "react";
import { generateDeepAnalysis } from "../../../services/deepAnalysis";
import {
  getCollectionResearch,
  generateComprehensiveResearch,
} from "../../../services/nftResearch";
import "./DeepAnalysis.css";

/**
 * DeepAnalysis Component
 * Provides research-grade AI-powered analysis of an NFT
 */
const DeepAnalysis = ({ nft, floorPrice, collectionData }) => {
  const [analysis, setAnalysis] = useState(null);
  const [research, setResearch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("research");

  const handleGenerateAnalysis = async () => {
    if (!nft) return;

    setLoading(true);
    setError(null);

    try {
      // First, check if we have verified research data for this collection
      const verifiedResearch = getCollectionResearch(nft.contract);
      setResearch(verifiedResearch);

      const nftData = {
        name: nft.name,
        collection: nft.collection,
        tokenId: nft.tokenId,
        traits: nft.traits || [],
        rarityScore: nft.rarityScore || null,
        description: nft.description,
        contract: nft.contract,
      };

      const collData = {
        floorPrice: floorPrice || 0,
        totalSupply:
          nft.contractMetadata?.totalSupply || collectionData?.totalSupply,
        contractDeployer: nft.contractMetadata?.contractDeployer,
        collectionDescription:
          nft.contractMetadata?.description || collectionData?.description,
      };

      // Generate comprehensive research with verified data
      const researchResult = await generateComprehensiveResearch(
        nftData,
        collData,
        verifiedResearch,
      );

      // Also get the trait-based analysis
      const traitAnalysis = await generateDeepAnalysis(nftData, collData);

      // Combine both results
      setAnalysis({
        ...traitAnalysis,
        research: researchResult,
        hasVerifiedData: !!verifiedResearch,
      });
    } catch (err) {
      console.error("Analysis error:", err);
      setError("Failed to generate analysis. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "research", label: "Collection Research" },
    { id: "unique", label: "This NFT" },
    { id: "pricing", label: "Pricing Factors" },
    { id: "traits", label: "Trait Analysis" },
  ];

  const renderTabContent = () => {
    if (!analysis) return null;
    const r = analysis.research;

    switch (activeTab) {
      case "research":
        return (
          <div className="tab-content">
            {/* Verification Badge */}

            {/* Collection Overview */}
            <div className="analysis-header">
              <h4>{r?.collectionOverview?.title || "Collection Overview"}</h4>
            </div>

            <div className="insight-block">
              <h5>History & Origin</h5>
              <p className="analysis-text">
                {r?.collectionOverview?.history ||
                  research?.backstory ||
                  "No history data available"}
              </p>
            </div>

            <div className="insight-block">
              <h5>Creator</h5>
              <p className="analysis-text">
                {r?.collectionOverview?.creator ||
                  research?.creator ||
                  "Unknown"}
              </p>
            </div>

            <div className="insight-block">
              <h5>Launch Info</h5>
              <p className="analysis-text">
                {r?.collectionOverview?.launchInfo ||
                  (research?.launchDate
                    ? `Launched ${research.launchDate}`
                    : "Unknown launch date")}
              </p>
            </div>

            {/* Rise to Fame */}
            {r?.whyFamous && (
              <>
                <div
                  className="analysis-header"
                  style={{ marginTop: "1.5rem" }}
                >
                  <h4>{r.whyFamous.title || "Rise to Fame"}</h4>
                </div>

                <div className="key-factors">
                  <h5>Key Moments</h5>
                  <ul>
                    {r.whyFamous.keyMoments?.map((moment, i) => (
                      <li key={i}>{moment}</li>
                    )) || <li className="muted">No data available</li>}
                  </ul>
                </div>

                {r.whyFamous.culturalImpact && (
                  <div className="insight-block">
                    <h5>Cultural Impact</h5>
                    <p className="analysis-text">
                      {r.whyFamous.culturalImpact}
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Data Sources */}
            {r?.dataConfidence && (
              <div className="sources-section">
                <h5>Data Sources</h5>
                <ul className="sources-list">
                  {r.dataConfidence.sources?.map((src, i) => (
                    <li key={i}>
                      <a href={src} target="_blank" rel="noopener noreferrer">
                        {src.replace(/^https?:\/\//, "").split("/")[0]}
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="disclaimer">{r.dataConfidence.disclaimer}</p>
              </div>
            )}
          </div>
        );

      case "unique":
        return (
          <div className="tab-content">
            <div className="analysis-header">
              <h4>{r?.whatMakesUnique?.title || "What Makes It Unique"}</h4>
            </div>

            <div className="insight-block">
              <h5>Art Style</h5>
              <p className="analysis-text">
                {r?.whatMakesUnique?.artStyle || "No art style data available"}
              </p>
            </div>

            <div className="insight-block">
              <h5>Technical Innovation</h5>
              <p className="analysis-text">
                {r?.whatMakesUnique?.technicalInnovation ||
                  "No technical innovation data"}
              </p>
            </div>

            <div className="insight-block">
              <h5>Community & Benefits</h5>
              <p className="analysis-text">
                {r?.whatMakesUnique?.communityAspects ||
                  "No community data available"}
              </p>
            </div>

            {/* This Specific NFT */}
            {r?.thisSpecificNFT && (
              <>
                <div
                  className="analysis-header"
                  style={{ marginTop: "1.5rem" }}
                >
                  <h4>{r.thisSpecificNFT.title || "About This NFT"}</h4>
                </div>

                <div className="insight-block">
                  <h5>Trait Analysis</h5>
                  <p className="analysis-text">
                    {r.thisSpecificNFT.traitAnalysis ||
                      "No specific trait analysis"}
                  </p>
                </div>

                <div className="insight-block">
                  <h5>Relative Value</h5>
                  <p className="analysis-text">
                    {r.thisSpecificNFT.relativeValue ||
                      "No relative value data"}
                  </p>
                </div>
              </>
            )}
          </div>
        );

      case "pricing":
        return (
          <div className="tab-content">
            <div className="analysis-header">
              <h4>{r?.pricingAnalysis?.title || "Pricing Analysis"}</h4>
              {r?.pricingAnalysis?.currentFloor && (
                <span className="floor-badge">
                  Floor: {r.pricingAnalysis.currentFloor}
                </span>
              )}
            </div>

            <div className="insight-block">
              <h5>Market Position</h5>
              <p className="analysis-text">
                {r?.pricingAnalysis?.marketPosition ||
                  "No market position data"}
              </p>
            </div>

            <div className="key-factors">
              <h5>Value Drivers</h5>
              <ul>
                {r?.pricingAnalysis?.valueDrivers?.map((driver, i) => (
                  <li key={i}>{driver}</li>
                )) || <li className="muted">No value drivers identified</li>}
              </ul>
            </div>

            <div className="insight-block">
              <h5>How Rarity Affects Price</h5>
              <p className="analysis-text">
                {r?.pricingAnalysis?.rarityImpact || "No rarity impact data"}
              </p>
            </div>

            {/* Show verified pricing factors if available */}
            {research?.pricingFactors && (
              <div className="key-factors verified">
                <h5>Verified Pricing Factors</h5>
                <ul>
                  {research.pricingFactors.map((factor, i) => (
                    <li key={i}>{factor}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      case "traits":
        return (
          <div className="tab-content">
            <div className="analysis-header">
              <h4>Trait Analysis</h4>
            </div>

            {analysis.traitComparison && analysis.traitComparison.length > 0 ? (
              <div className="trait-breakdown">
                <div className="trait-table">
                  {analysis.traitComparison.map((trait, i) => (
                    <div key={i} className="trait-row">
                      <span className="trait-name">{trait.trait_type}</span>
                      <span className="trait-value">{trait.value}</span>
                      <span
                        className={`trait-tier tier-${trait.tier
                          ?.toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {trait.tier || "UNKNOWN"}
                      </span>
                      <span className="trait-rarity">
                        {trait.rarity !== null ? `${trait.rarity}%` : "N/A"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="muted">
                No trait rarity data available for this NFT.
              </p>
            )}

            {/* Show verified trait info if available */}
            {research?.uniqueTraits && (
              <div className="verified-traits">
                <h5>Notable Traits in This Collection</h5>
                <div className="trait-info-grid">
                  {Object.entries(research.uniqueTraits).map(
                    ([trait, info]) => (
                      <div key={trait} className="trait-info-card">
                        <span className="trait-name">{trait}</span>
                        <span className="trait-count">{info.count} exist</span>
                        <span className="trait-significance">
                          {info.significance}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section className="deep-analysis-section glass-card">
      <div className="section-header">
        <h3 className="section-title">
          <svg
            className="title-icon-svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
            <path d="M11 8v6" />
            <path d="M8 11h6" />
          </svg>
          Deep Analysis
        </h3>
        {analysis?.hasVerifiedData && (
          <span className="ai-badge verified">Verified Data</span>
        )}
      </div>

      {!analysis && !loading && (
        <div className="generate-prompt">
          <p>Get comprehensive research-grade insights on this NFT:</p>
          <ul>
            <li>What makes this NFT unique vs others in collection</li>
            <li>Art & visual factors affecting its value</li>
            <li>External world factors (market, creator, history)</li>
            <li>Price analysis & floor comparison</li>
            <li>Investment outlook with risks & opportunities</li>
          </ul>
          <button
            className="btn btn-primary generate-btn"
            onClick={handleGenerateAnalysis}
            disabled={loading}
          >
            Generate Deep Analysis
          </button>
        </div>
      )}

      {loading && (
        <div className="loading-analysis">
          <div className="spinner"></div>
          <p>Analyzing NFT across collection database...</p>
          <p className="loading-detail">
            Comparing traits, evaluating market position, researching
            collection...
          </p>
        </div>
      )}

      {error && (
        <div className="analysis-error">
          <p>{error}</p>
          <button
            className="btn btn-secondary"
            onClick={handleGenerateAnalysis}
          >
            Try Again
          </button>
        </div>
      )}

      {analysis && !loading && (
        <div className="analysis-content">
          <div className="tab-nav">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>

          {renderTabContent()}

          <div className="regenerate-row">
            <button className="btn btn-ghost" onClick={handleGenerateAnalysis}>
              ↻ Regenerate Analysis
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default DeepAnalysis;
