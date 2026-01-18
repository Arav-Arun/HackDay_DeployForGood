import React, { useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { useNavigate } from "react-router-dom";
import { useNFTData } from "../hooks/useNFTData";
import NFTCard from "../components/common/NFTCard";
import ConnectWalletPopup from "../components/common/ConnectWalletPopup";
import "./Dashboard.css";

const Dashboard = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [popupDismissed, setPopupDismissed] = useState(false);

  // Use custom hook to fetch real NFT data
  const { nfts, loading, error, refetch } = useNFTData(address, isConnected);

  // Use useMemo to derive filtered NFTs (must be called before conditional return)
  const filteredNfts = React.useMemo(() => {
    let sorted = [...nfts];

    switch (filter) {
      case "most-rare":
        sorted.sort((a, b) => (b.rarityScore || 0) - (a.rarityScore || 0));
        break;
      case "least-rare":
        sorted.sort((a, b) => (a.rarityScore || 0) - (b.rarityScore || 0));
        break;
      case "recent":
        // Keep original order
        break;
      default:
        break;
    }

    return sorted;
  }, [filter, nfts]);

  // Handle popup close - navigate away if still not connected
  const handlePopupClose = () => {
    setPopupDismissed(true);
    navigate("/");
  };

  // Show popup if not connected and popup hasn't been dismissed
  if (!isConnected) {
    return (
      <ConnectWalletPopup
        isOpen={!popupDismissed}
        onClose={handlePopupClose}
        featureName="your collection"
      />
    );
  }

  const handleDisconnect = () => {
    disconnect();
    navigate("/");
  };

  return (
    <div className="dashboard-page">
      <div className="container">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">My Collection</h1>
            <p className="dashboard-subtitle">
              {address &&
                `${address.substring(0, 6)}...${address.substring(
                  address.length - 4,
                )}`}
              {!loading && nfts.length > 0 && (
                <span className="nft-count">
                  • {nfts.length} NFT{nfts.length !== 1 ? "s" : ""}
                </span>
              )}
            </p>
          </div>

          <div className="dashboard-actions">
            <button
              onClick={refetch}
              className="btn btn-secondary"
              disabled={loading}
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
            <button onClick={handleDisconnect} className="btn btn-ghost">
              Disconnect
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="filter-bar glass">
          <button
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All NFTs
          </button>
          <button
            className={`filter-btn ${filter === "most-rare" ? "active" : ""}`}
            onClick={() => setFilter("most-rare")}
          >
            Most Rare
          </button>
          <button
            className={`filter-btn ${filter === "least-rare" ? "active" : ""}`}
            onClick={() => setFilter("least-rare")}
          >
            Least Rare
          </button>
          <button
            className={`filter-btn ${filter === "recent" ? "active" : ""}`}
            onClick={() => setFilter("recent")}
          >
            Recently Acquired
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="error-banner">
            <p className="error-message">{error}</p>
            <button onClick={refetch} className="btn btn-secondary">
              Try Again
            </button>
          </div>
        )}

        {/* NFT Grid */}
        {loading ? (
          <div className="loading-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="nft-loading-card">
                <div className="shimmer"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="nft-grid">
            {filteredNfts.length > 0 ? (
              filteredNfts.map((nft) => <NFTCard key={nft.id} nft={nft} />)
            ) : (
              <div className="empty-state">
                <p className="empty-message">No NFTs found in your wallet</p>
                <button
                  onClick={() => navigate("/explore")}
                  className="btn btn-secondary"
                >
                  Explore NFTs
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
