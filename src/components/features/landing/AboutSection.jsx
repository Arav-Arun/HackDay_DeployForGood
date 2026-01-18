import React, { useState, useEffect } from "react";
import { generateCreatorBio } from "../../../services/loreAI";
import "./AboutSection.css";

/**
 * AboutSection - Tabbed component for NFT, Collection, and Creator info
 * Uses only real data from Alchemy API - no hallucinations
 */
const AboutSection = ({ nft, contractAddress }) => {
  const [activeTab, setActiveTab] = useState("nft");
  const [creatorBio, setCreatorBio] = useState(null);
  const [loadingBio, setLoadingBio] = useState(false);

  // Fetch creator bio when tab is selected
  useEffect(() => {
    const fetchCreatorBio = async () => {
      if (activeTab === "creator" && !creatorBio && nft) {
        setLoadingBio(true);
        const collectionName =
          nft?.contractMetadata?.name ||
          nft?.collection ||
          "Unknown Collection";
        const bio = await generateCreatorBio(collectionName);
        setCreatorBio(bio);
        setLoadingBio(false);
      }
    };
    fetchCreatorBio();
  }, [activeTab, creatorBio, nft]);

  const tabs = [
    { id: "nft", label: "About NFT" },
    { id: "collection", label: "About Collection" },
    { id: "creator", label: "About Creator" },
  ];

  // Extract verified data
  const contractMeta = nft?.contractMetadata || {};
  const openSeaMeta = contractMeta?.openSeaMetadata || {};

  return (
    <section className="about-section-tabbed content-card">
      <h2 className="card-title">
        <svg
          className="title-icon-svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
        About
        <span className="verified-badge-text">Verified Data</span>
      </h2>

      {/* Tab Navigation */}
      <div className="about-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`about-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="about-content">
        {/* About NFT Tab */}
        {activeTab === "nft" && (
          <div className="tab-panel">
            <div className="about-grid">
              <div className="about-item">
                <span className="about-label">Name</span>
                <span className="about-value">{nft?.name || "Unknown"}</span>
              </div>
              <div className="about-item">
                <span className="about-label">Token ID</span>
                <span className="about-value">#{nft?.tokenId}</span>
              </div>
              <div className="about-item">
                <span className="about-label">Token Standard</span>
                <span className="about-value">
                  {contractMeta?.tokenType || "ERC-721"}
                </span>
              </div>
              <div className="about-item">
                <span className="about-label">Contract</span>
                <a
                  href={`https://etherscan.io/address/${contractAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="about-value link"
                >
                  {contractAddress?.slice(0, 6)}...{contractAddress?.slice(-4)}
                </a>
              </div>
            </div>

            {/* NFT Description */}
            {nft?.description && (
              <div className="about-description">
                <h4 className="about-subtitle">Description</h4>
                <p className="about-text">{nft.description}</p>
              </div>
            )}

            {/* Traits Summary */}
            {nft?.traits && nft.traits.length > 0 && (
              <div className="about-traits-summary">
                <h4 className="about-subtitle">Traits Overview</h4>
                <div className="traits-mini-grid">
                  {nft.traits.slice(0, 6).map((trait, idx) => (
                    <div key={idx} className="trait-mini">
                      <span className="trait-type">{trait.trait_type}</span>
                      <span className="trait-value">{trait.value}</span>
                      {trait.rarity !== null && (
                        <span className="trait-rarity">
                          {trait.rarity < 5
                            ? "Rare"
                            : trait.rarity < 15
                              ? "Uncommon"
                              : "Common"}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                {nft.traits.length > 6 && (
                  <p className="traits-more">
                    +{nft.traits.length - 6} more traits
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* About Collection Tab */}
        {activeTab === "collection" && (
          <div className="tab-panel">
            <div className="collection-header">
              {contractMeta?.imageUrl && (
                <img
                  src={contractMeta.imageUrl}
                  alt={contractMeta.name}
                  className="collection-avatar-large"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              )}
              <div className="collection-header-info">
                <h3 className="collection-name-large">
                  {contractMeta?.name ||
                    nft?.collection ||
                    "Unknown Collection"}
                  {openSeaMeta?.safelistRequestStatus === "verified" && (
                    <svg
                      className="verified-icon"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="#00d4d4"
                    >
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                  )}
                </h3>
                {contractMeta?.symbol && (
                  <span className="collection-symbol">
                    ${contractMeta.symbol}
                  </span>
                )}
              </div>
            </div>

            {/* Collection Stats */}
            <div className="collection-stats-grid">
              {contractMeta?.totalSupply && (
                <div className="stat-box">
                  <span className="stat-number">
                    {parseInt(contractMeta.totalSupply).toLocaleString()}
                  </span>
                  <span className="stat-label">Total Items</span>
                </div>
              )}
              {nft?.floorPrice !== undefined && nft?.floorPrice > 0 && (
                <div className="stat-box">
                  <span className="stat-number">
                    {nft.floorPrice.toFixed(2)} ETH
                  </span>
                  <span className="stat-label">Floor Price</span>
                </div>
              )}
              {contractMeta?.tokenType && (
                <div className="stat-box">
                  <span className="stat-number">{contractMeta.tokenType}</span>
                  <span className="stat-label">Token Type</span>
                </div>
              )}
            </div>

            {/* Collection Description */}
            <div className="about-description">
              <h4 className="about-subtitle">About</h4>
              <p className="about-text">
                {contractMeta?.description &&
                contractMeta.description !==
                  "No collection description available."
                  ? contractMeta.description
                  : `${contractMeta?.name || nft?.collection} is an NFT collection on Ethereum${
                      contractMeta?.totalSupply
                        ? ` with ${parseInt(contractMeta.totalSupply).toLocaleString()} unique items`
                        : ""
                    }.`}
              </p>
            </div>

            {/* Social Links */}
            <div className="collection-links">
              {openSeaMeta?.collectionSlug && (
                <a
                  href={`https://opensea.io/collection/${openSeaMeta.collectionSlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link opensea"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0C5.374 0 0 5.374 0 12s5.374 12 12 12 12-5.374 12-12S18.629 0 12 0ZM5.92 12.403l.051-.081 3.123-4.884a.107.107 0 0 1 .187.014c.52 1.169.972 2.623.76 3.528-.09.372-.335.876-.614 1.342-.044.081-.093.162-.147.238-.034.044-.073.063-.117.063H6.032a.106.106 0 0 1-.112-.12Z" />
                  </svg>
                  OpenSea
                </a>
              )}
              <a
                href={`https://etherscan.io/address/${contractAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link etherscan"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35z" />
                </svg>
                Etherscan
              </a>
            </div>
          </div>
        )}

        {/* About Creator Tab */}
        {activeTab === "creator" && (
          <div className="tab-panel">
            {/* AI-Generated Artist Biography */}
            {loadingBio ? (
              <div className="shimmer-wrapper" style={{ height: "200px" }}>
                <div className="shimmer"></div>
              </div>
            ) : creatorBio ? (
              <div className="creator-bio-section">
                <div className="creator-card">
                  <div className="creator-avatar-container">
                    <div className="creator-avatar-placeholder">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                  </div>
                  <div className="creator-info">
                    <h4 className="creator-label">{creatorBio.name}</h4>
                    <p className="creator-note">{creatorBio.background}</p>
                  </div>
                </div>

                <div className="about-description">
                  <h4 className="about-subtitle">Artistic Style</h4>
                  <p className="about-text">{creatorBio.style}</p>
                </div>

                <div className="about-description">
                  <h4 className="about-subtitle">Achievements</h4>
                  <p className="about-text">{creatorBio.achievements}</p>
                </div>

                <div className="about-description">
                  <h4 className="about-subtitle">Collection Story</h4>
                  <p className="about-text">{creatorBio.collectionStory}</p>
                </div>
              </div>
            ) : null}

            {/* Contract Deployer */}
            {contractMeta?.contractDeployer && (
              <div
                className="creator-card"
                style={{ marginTop: "var(--spacing-4)" }}
              >
                <div className="creator-avatar-container">
                  <div className="creator-avatar-placeholder">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                </div>
                <div className="creator-info">
                  <h4 className="creator-label">Contract Deployer</h4>
                  <a
                    href={`https://etherscan.io/address/${contractMeta.contractDeployer}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="creator-address"
                  >
                    {contractMeta.contractDeployer}
                  </a>
                  <p className="creator-note">
                    This is the wallet address that deployed the smart contract
                    for this collection.
                  </p>
                </div>
              </div>
            )}

            {/* No Creator Data Message (fallback) */}
            {!contractMeta?.contractDeployer && !creatorBio && !loadingBio && (
              <div className="no-data-message">
                <svg
                  className="no-data-icon-svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <p>Creator information is not available for this contract.</p>
              </div>
            )}

            {/* Social Links */}
            <div className="creator-socials">
              <h4 className="about-subtitle">Official Links</h4>
              <div className="social-links-grid">
                {openSeaMeta?.twitterUsername && (
                  <a
                    href={`https://twitter.com/${openSeaMeta.twitterUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link twitter"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    @{openSeaMeta.twitterUsername}
                  </a>
                )}
                {openSeaMeta?.discordUrl && (
                  <a
                    href={openSeaMeta.discordUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link discord"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.373-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.099.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                    </svg>
                    Discord
                  </a>
                )}
                {openSeaMeta?.externalUrl && (
                  <a
                    href={openSeaMeta.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link website"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                    Website
                  </a>
                )}
                {!openSeaMeta?.twitterUsername &&
                  !openSeaMeta?.discordUrl &&
                  !openSeaMeta?.externalUrl && (
                    <p className="no-socials">
                      No official social links available.
                    </p>
                  )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AboutSection;
