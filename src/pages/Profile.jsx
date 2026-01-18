import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount, useDisconnect } from "wagmi";
import { useNFTData } from "../hooks/useNFTData";
import ConnectWalletPopup from "../components/common/ConnectWalletPopup";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { nfts, loading } = useNFTData(address, isConnected);
  const [popupDismissed, setPopupDismissed] = useState(false);

  // Handle popup close - navigate away if still not connected
  const handlePopupClose = () => {
    setPopupDismissed(true);
    navigate("/explore");
  };

  // Show popup if not connected and popup hasn't been dismissed
  if (!isConnected) {
    return (
      <ConnectWalletPopup
        isOpen={!popupDismissed}
        onClose={handlePopupClose}
        featureName="your profile"
      />
    );
  }

  const formatAddress = (addr) => {
    if (!addr) return "";
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  // Group NFTs by collection
  const collectionStats = nfts.reduce((acc, nft) => {
    const collection = nft.collection || "Unknown";
    if (!acc[collection]) {
      acc[collection] = { count: 0, nfts: [] };
    }
    acc[collection].count++;
    acc[collection].nfts.push(nft);
    return acc;
  }, {});

  return (
    <div className="profile-page">
      <div className="container">
        {/* Top Navigation */}
        <nav className="profile-nav">
          <button onClick={() => navigate(-1)} className="back-btn">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>Back</span>
          </button>
          <div className="nav-actions">
            <a
              href={`https://etherscan.io/address/${address}`}
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

        {/* Profile Header */}
        <section className="profile-header glass-card">
          <div className="profile-info">
            <div className="profile-avatar">
              <span className="avatar-placeholder">
                {address ? address.substring(2, 4).toUpperCase() : "??"}
              </span>
            </div>
            <div className="profile-details">
              <h1 className="profile-address">{formatAddress(address)}</h1>
              <p className="wallet-label">Connected Wallet</p>
            </div>
          </div>

          <div className="profile-actions">
            <button
              onClick={() => navigator.clipboard.writeText(address)}
              className="btn btn-secondary"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy Address
            </button>
            <button
              onClick={() => disconnect()}
              className="btn btn-ghost btn-danger"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Disconnect
            </button>
          </div>
        </section>

        {/* Portfolio Stats */}
        <section className="portfolio-stats">
          <div className="profile-stat-card glass-card">
            <span className="stat-value">{loading ? "..." : nfts.length}</span>
            <span className="stat-label">Total NFTs</span>
          </div>
          <div className="profile-stat-card glass-card">
            <span className="stat-value">
              {loading ? "..." : Object.keys(collectionStats).length}
            </span>
            <span className="stat-label">Collections</span>
          </div>
        </section>

        {/* Collections Breakdown */}
        <section className="collections-breakdown">
          <h2 className="section-title">Your Collections</h2>

          {loading ? (
            <div className="loading-state">
              <p>Loading your NFTs...</p>
            </div>
          ) : Object.keys(collectionStats).length > 0 ? (
            <div className="collections-list">
              {Object.entries(collectionStats).map(([collection, data]) => (
                <div key={collection} className="collection-item glass-card">
                  <div className="collection-info">
                    <h3 className="collection-name">{collection}</h3>
                    <span className="collection-count">
                      {data.count} NFT{data.count !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="btn btn-ghost btn-small"
                  >
                    View All
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state glass-card">
              <p>No NFTs found in this wallet</p>
              <button
                onClick={() => navigate("/explore")}
                className="btn btn-primary"
              >
                Explore NFTs
              </button>
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section className="quick-actions">
          <h2 className="section-title">Quick Actions</h2>
          <div className="actions-grid">
            <button
              onClick={() => navigate("/dashboard")}
              className="action-card glass-card"
            >
              <span className="action-title">View Collection</span>
              <span className="action-desc">Browse all your NFTs</span>
            </button>
            <button
              onClick={() => navigate("/explore")}
              className="action-card glass-card"
            >
              <span className="action-title">Analyze NFT</span>
              <span className="action-desc">Search any NFT by contract</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;
