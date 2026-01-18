import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getBasicNFTMetadata } from "../services/alchemy";
import "./Collection.css";
import NFTCard from "../components/common/NFTCard";

// Default token IDs if none provided
const DEFAULT_TOKENS = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
];

const Collection = () => {
  const { contractAddress } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Get collection data from navigation state
  const collectionData = location.state?.collection || {
    name: "Collection",
    description: "Explore NFTs from this collection",
    tokenIds: DEFAULT_TOKENS,
  };

  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNFTs = async () => {
      setLoading(true);
      const tokenIds = collectionData.tokenIds || DEFAULT_TOKENS;

      const nftPromises = tokenIds.map(async (tokenId) => {
        try {
          const metadata = await getBasicNFTMetadata(contractAddress, tokenId);
          return {
            tokenId,
            name: metadata?.name || `#${tokenId}`,
            image: metadata?.image || null,
            thumbnail: metadata?.thumbnail || null, // Ensure thumbnail is passed
            contract: contractAddress,
          };
        } catch (err) {
          console.warn(`Failed to fetch token ${tokenId}:`, err);
          return {
            tokenId,
            name: `#${tokenId}`,
            image: null,
            contract: contractAddress,
          };
        }
      });

      const results = await Promise.all(nftPromises);
      setNfts(results);
      setLoading(false);
    };

    fetchNFTs();
  }, [contractAddress, collectionData.tokenIds]);

  return (
    <div className="collection-page">
      <div className="container">
        {/* Header */}
        <div className="collection-header-nav">
          <button className="back-btn" onClick={() => navigate("/explore")}>
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
            Back to Collections
          </button>
        </div>
        {/* Collection Info */}
        <div className="collection-hero">
          <h1 className="collection-title">{collectionData.name}</h1>
          <p className="collection-description">{collectionData.description}</p>
          <div className="collection-meta-info">
            <span className="meta-badge">
              {collectionData.category || "NFT"}
            </span>
            <span className="meta-count">{nfts.length} NFTs</span>
          </div>
        </div>

        {/* NFT Grid */}
        <div className="nft-selection-grid">
          {loading
            ? // Loading skeleton
              Array.from({ length: 15 }).map((_, i) => (
                <div key={i} className="nft-skeleton">
                  <div className="skeleton-image" />
                  <div className="skeleton-text" />
                </div>
              ))
            : nfts.map((nft) => (
                <div key={nft.tokenId} className="collection-nft-wrapper">
                  <NFTCard nft={nft} />
                </div>
              ))}
        </div>
        {/* Instructions */}
        <div className="collection-instructions">
          <p>
            👆 Click any NFT above to explore AI-powered analysis, trait rarity,
            and generated narratives
          </p>
        </div>
      </div>
    </div>
  );
};

export default Collection;
