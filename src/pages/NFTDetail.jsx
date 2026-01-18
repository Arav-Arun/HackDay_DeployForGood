import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { useNFTMetadata } from "../hooks/useNFTData";
import TraitCard from "../components/common/TraitCard";
import RarityMeter from "../components/features/nft/RarityMeter";
import LoreGenerator from "../components/features/ai/LoreGenerator";
import FloorPrice from "../components/features/nft/FloorPrice";
import TransferHistory from "../components/features/nft/TransferHistory";
import DeepAnalysis from "../components/features/ai/DeepAnalysis";
import LivingNFTChat from "../components/features/ai/LivingNFTChat";
import SaleHistory from "../components/features/nft/SaleHistory";
import SpamWarning from "../components/common/SpamWarning";

import ContractBadge from "../components/common/ContractBadge";
import UniqueSummary from "../components/features/ai/UniqueSummary";
import RiskMeter2 from "../components/features/nft/RiskMeter2";
import BuyScore from "../components/features/nft/BuyScore";
import Tooltip from "../components/common/Tooltip";
import AboutSection from "../components/features/landing/AboutSection";
import "./NFTDetail.css";

// Default avatar SVG
const DEFAULT_AVATAR = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <circle cx="24" cy="24" r="24" fill="#1a1a2e"/>
  <text x="24" y="30" text-anchor="middle" fill="#00d4d4" font-family="Arial" font-size="20" font-weight="500">?</text>
</svg>
`)}`;

const NFTDetail = () => {
  const { contractAddress, tokenId } = useParams();
  const navigate = useNavigate();
  const { address: connectedAddress } = useAccount();
  const [showChat, setShowChat] = useState(false);

  const { nft, loading, error } = useNFTMetadata(contractAddress, tokenId);

  const { rarityScore, rarityPercentile, traits, hasRealRarityData } =
    useMemo(() => {
      if (!nft) return {};
      const traitsData = nft.traits || [];
      const hasRealData = traitsData.some(
        (t) => t.rarity !== null && t.rarity !== undefined,
      );
      const rScore = hasRealData ? nft.rarityScore || null : null;
      const rPercentile = hasRealData ? nft.rarityPercentile || null : null;

      return {
        rarityScore: rScore,
        rarityPercentile: rPercentile,
        traits: traitsData,
        hasRealRarityData: hasRealData,
      };
    }, [nft]);

  const isOwnedByUser = useMemo(() => {
    if (!nft?.owner || !connectedAddress) return false;
    return nft.owner.toLowerCase() === connectedAddress.toLowerCase();
  }, [nft, connectedAddress]);

  const creatorAvatar = useMemo(() => {
    const imageUrl =
      nft?.contractMetadata?.imageUrl ||
      nft?.contractMetadata?.openSeaMetadata?.imageUrl ||
      nft?.image;
    return imageUrl || DEFAULT_AVATAR;
  }, [nft?.contractMetadata, nft?.image]);

  if (error) {
    return (
      <div className="nft-detail-page">
        <div className="container">
          <div className="error-state glass-card">
            <div className="error-icon">⚠️</div>
            <h2>Unable to Load NFT</h2>
            <p>{error}</p>
            <button
              onClick={() => navigate("/explore")}
              className="btn btn-primary"
            >
              Search Another NFT
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading || !nft) {
    return (
      <div className="nft-detail-page">
        <div className="container">
          <div className="loading-state">
            <div className="loading-artwork">
              <div className="shimmer"></div>
            </div>
            <div className="loading-content">
              <div className="loading-bar wide"></div>
              <div className="loading-bar medium"></div>
              <div className="loading-bar short"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="nft-detail-page">
      {/* Cinematic Background */}
      <div className="cinematic-background">
        <img src={nft.image} alt="" className="cinematic-blur" />
        <div className="cinematic-overlay"></div>
      </div>

      <div className="container">
        {/* Top Navigation Bar */}
        <nav className="detail-nav">
          <button onClick={() => navigate(-1)} className="back-btn">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <div className="nav-actions">
            <a
              href={`https://opensea.io/assets/ethereum/${contractAddress}/${tokenId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0C5.374 0 0 5.374 0 12s5.374 12 12 12 12-5.374 12-12S18.629 0 12 0ZM5.92 12.403l.051-.081 3.123-4.884a.107.107 0 0 1 .187.014c.52 1.169.972 2.623.76 3.528-.09.372-.335.876-.614 1.342-.044.081-.093.162-.147.238-.034.044-.073.063-.117.063H6.032a.106.106 0 0 1-.112-.12Zm13.86 1.873c0 .059-.035.098-.085.114-.323.11-1.043.505-1.378.995-.852 1.246-1.503 3.03-2.965 3.03h-4.126c-2.16 0-3.913-1.771-3.913-3.95v-.072c0-.063.051-.114.114-.114h2.943c.076 0 .131.063.126.139a1.27 1.27 0 0 0 .12.716c.227.456.687.74 1.185.74h1.862v-1.452h-1.835c-.064 0-.101-.076-.063-.127.017-.022.034-.044.051-.072.237-.338.581-.876.923-1.495.239-.421.456-.868.627-1.314a7.25 7.25 0 0 0 .12-.313 4.81 4.81 0 0 0 .143-.522c.034-.148.063-.295.088-.448.083-.411.122-.852.122-1.31 0-.177-.005-.363-.022-.544-.012-.191-.034-.382-.068-.573a3.92 3.92 0 0 0-.088-.473 4.49 4.49 0 0 0-.131-.498l-.017-.063c-.034-.126-.068-.247-.102-.368a9.87 9.87 0 0 0-.437-1.253l-.177-.441c-.085-.21-.177-.41-.271-.605-.093-.196-.182-.372-.266-.534-.127-.243-.239-.456-.338-.642l-.183-.33c-.034-.059.022-.127.085-.11l1.422.386h.005l.185.054.205.059.076.022v-1.313c0-.553.447-1.004.996-1.004.274 0 .524.114.699.295.18.182.293.431.293.709v1.968l.151.044s.012.005.017.009c.042.034.102.085.177.153.059.051.122.11.198.177.153.139.339.317.544.534.054.054.107.114.165.172.285.315.605.7.917 1.133.108.153.216.311.319.473.107.163.22.326.318.489.131.217.261.448.373.684.051.11.102.225.147.339.129.317.232.642.3.968.022.072.039.153.051.225v.017c.034.139.051.288.063.437.039.346.022.692-.063 1.024a4.18 4.18 0 0 1-.152.505c-.068.173-.131.351-.21.519a5.96 5.96 0 0 1-.498.89c-.063.104-.131.206-.199.3-.073.101-.146.203-.223.295a4.66 4.66 0 0 1-.22.273c-.093.114-.182.22-.271.324-.131.148-.257.295-.39.427a4.7 4.7 0 0 1-.229.229c-.085.085-.165.161-.249.236-.059.054-.117.109-.18.158l-.115.101c-.029.022-.051.039-.068.051l-.159.133H13.63v1.452h1.143c.315 0 .616-.097.869-.278.085-.059.338-.266.634-.524.01-.012.022-.017.034-.022l.012.002h.001l2.993.872a.108.108 0 0 1 .075.103Z" />
              </svg>
              OpenSea
            </a>
            <a
              href={`https://etherscan.io/token/${contractAddress}?a=${tokenId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" />
              </svg>
              Etherscan
            </a>
          </div>
        </nav>

        {/* Hero Section - NFT Image + Quick Info */}
        <div className="nft-hero">
          <div className="hero-artwork">
            <div className="artwork-frame">
              <img
                src={nft.image}
                alt={nft.name}
                className="nft-image"
                onError={(e) => {
                  e.target.src =
                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgZmlsbD0iIzFhMWEyNCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiNhODU1ZjciIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ORlQ8L3RleHQ+PC9zdmc+";
                }}
              />
            </div>
          </div>

          <div className="hero-info">
            <div className="collection-badge">
              <img
                src={creatorAvatar}
                alt=""
                className="collection-avatar"
                onError={(e) => {
                  e.target.src = DEFAULT_AVATAR;
                }}
              />
              <span className="collection-name">{nft.collection}</span>
              {nft.contractMetadata?.openSeaMetadata?.safelistRequestStatus ===
                "verified" && (
                <svg
                  className="verified-badge"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="#00d4d4"
                >
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                </svg>
              )}
            </div>

            <h1 className="nft-title">{nft.name}</h1>
            <p className="token-id">Token ID: #{tokenId}</p>

            {/* Quick Stats Row */}
            <div className="quick-stats">
              <div className="stat-card">
                <span className="stat-label">
                  <Tooltip term="floor price">Floor Price</Tooltip>
                </span>
                <FloorPrice contractAddress={contractAddress} compact />
              </div>
              {hasRealRarityData && rarityPercentile !== null && (
                <div className="stat-card highlight">
                  <span className="stat-label">
                    <Tooltip term="rarity score">Rarity Rank</Tooltip>
                  </span>
                  <span className="stat-value">
                    Top {(100 - rarityPercentile).toFixed(1)}%
                  </span>
                </div>
              )}
              <div className="stat-card">
                <span className="stat-label">Owner</span>
                <span
                  className={`stat-value owner-address ${
                    isOwnedByUser ? "owner-you" : ""
                  }`}
                >
                  {isOwnedByUser
                    ? "You"
                    : nft.owner
                      ? `${nft.owner.slice(0, 6)}...${nft.owner.slice(-4)}`
                      : "Unknown"}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="hero-actions">
              <a
                href={`https://opensea.io/assets/ethereum/${contractAddress}/${tokenId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                View on OpenSea
              </a>
              {nft.contractMetadata?.openSeaMetadata?.collectionSlug && (
                <a
                  href={`https://opensea.io/collection/${nft.contractMetadata.openSeaMetadata.collectionSlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                >
                  Explore Collection
                </a>
              )}
              <button
                className="btn btn-accent chat-btn"
                onClick={() => setShowChat(true)}
              >
                <span className="btn-icon">💬</span>
                Chat with {nft.name}
              </button>
            </div>
            <ContractBadge contractAddress={contractAddress} />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="content-grid">
          {/* Left Column - Analysis */}
          <div className="main-column">
            {/* AI Story */}
            <section className="content-card">
              <div className="card-header">
                <h2 className="card-title">The Story</h2>
                {/* Badge removed */}
              </div>
              <LoreGenerator nft={nft} />
            </section>

            {/* Deep Analysis */}
            <DeepAnalysis
              nft={nft}
              floorPrice={nft.floorPrice || 0}
              collectionData={nft.contractMetadata}
            />

            {/* About Section - Tabbed Component */}
            <AboutSection nft={nft} contractAddress={contractAddress} />

            {/* Traits Grid */}
            <section className="content-card">
              <h2 className="card-title">Traits & Attributes</h2>
              {traits.length > 0 ? (
                <div className="traits-grid">
                  {traits.map((trait, index) => (
                    <TraitCard key={index} trait={trait} index={index} />
                  ))}
                </div>
              ) : (
                <p className="no-data">No trait data available for this NFT</p>
              )}
            </section>
          </div>

          {/* Right Column - Stats */}
          <div className="sidebar-column">
            {/* Spam Warning (if applicable) */}
            <SpamWarning contractAddress={contractAddress} />

            {/* Sale History */}
            <SaleHistory contractAddress={contractAddress} tokenId={tokenId} />

            {/* What Makes This Unique? */}
            <UniqueSummary nft={nft} traits={traits} />

            {/* Should I Buy? Score */}
            <BuyScore
              nft={nft}
              traits={traits}
              floorPrice={nft.floorPrice || 0}
              rarityScore={rarityScore || 50}
            />

            {/* Investment Risk */}
            <RiskMeter2
              contractAddress={contractAddress}
              tokenId={tokenId}
              floorPrice={nft.floorPrice || 0}
              hasRarityData={hasRealRarityData}
            />

            {/* Rarity Analysis */}
            {hasRealRarityData && rarityScore !== null && (
              <section className="content-card">
                <h2 className="card-title">Rarity Analysis</h2>
                <RarityMeter
                  score={rarityScore}
                  percentile={rarityPercentile}
                />
                {nft.contractMetadata?.totalSupply && (
                  <p className="rarity-note">
                    Ranked against{" "}
                    <strong>
                      {parseInt(
                        nft.contractMetadata.totalSupply,
                      ).toLocaleString()}
                    </strong>{" "}
                    items in this collection
                  </p>
                )}
              </section>
            )}

            {/* Collection Info */}
            <section className="content-card">
              <h2 className="card-title">Collection Info</h2>
              <div className="info-list">
                <div className="info-item">
                  <span className="info-label">Collection</span>
                  <span className="info-value">
                    {nft.contractMetadata?.name || nft.collection}
                  </span>
                </div>
                {nft.contractMetadata?.totalSupply && (
                  <div className="info-item">
                    <span className="info-label">Total Supply</span>
                    <span className="info-value">
                      {parseInt(
                        nft.contractMetadata.totalSupply,
                      ).toLocaleString()}{" "}
                      items
                    </span>
                  </div>
                )}
                {nft.contractMetadata?.tokenType && (
                  <div className="info-item">
                    <span className="info-label">Token Standard</span>
                    <span className="info-value">
                      {nft.contractMetadata.tokenType}
                    </span>
                  </div>
                )}
                {nft.contractMetadata?.contractDeployer && (
                  <div className="info-item">
                    <span className="info-label">Contract Creator</span>
                    <a
                      href={`https://etherscan.io/address/${nft.contractMetadata.contractDeployer}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="info-value link"
                    >
                      {nft.contractMetadata.contractDeployer.slice(0, 6)}...
                      {nft.contractMetadata.contractDeployer.slice(-4)}
                    </a>
                  </div>
                )}
              </div>
            </section>

            {/* Transfer History */}
            <TransferHistory
              contractAddress={contractAddress}
              tokenId={tokenId}
            />
          </div>
        </div>
      </div>
      {/* Chat Modal Overlay */}
      {showChat && (
        <div className="chat-modal-overlay">
          <div className="chat-modal-content">
            <button
              className="close-chat-btn"
              onClick={() => setShowChat(false)}
            >
              ×
            </button>
            <LivingNFTChat nft={nft} />
          </div>
        </div>
      )}
    </div>
  );
};

export default NFTDetail;
