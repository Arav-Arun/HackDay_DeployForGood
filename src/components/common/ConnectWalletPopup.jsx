import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import "./ConnectWalletPopup.css";

const ConnectWalletPopup = ({
  isOpen,
  onClose,
  featureName = "this feature",
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="wallet-popup-overlay" onClick={handleBackdropClick}>
      <div className="wallet-popup">
        {/* Close button */}
        <button
          className="popup-close-btn"
          onClick={onClose}
          aria-label="Close"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Wallet icon */}
        <div className="popup-icon">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="url(#walletGradient)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <defs>
              <linearGradient
                id="walletGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M22 10H2" />
            <circle cx="17" cy="14" r="2" />
          </svg>
        </div>

        {/* Content */}
        <h2 className="popup-title">Connect Your Wallet</h2>
        <p className="popup-description">
          Connect your wallet to access {featureName}. Your NFTs and collections
          will be loaded automatically.
        </p>

        {/* Features list */}
        <div className="popup-features">
          <div className="feature-item">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>View your NFT collection</span>
          </div>
          <div className="feature-item">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>AI-powered NFT analysis</span>
          </div>
          <div className="feature-item">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Track your portfolio</span>
          </div>
        </div>

        {/* Connect button */}
        <div className="popup-actions">
          <ConnectButton.Custom>
            {({ openConnectModal }) => (
              <button className="connect-wallet-btn" onClick={openConnectModal}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M22 10H2" />
                  <circle cx="17" cy="14" r="2" />
                </svg>
                Connect Wallet
              </button>
            )}
          </ConnectButton.Custom>
        </div>

        {/* Footer text */}
        <p className="popup-footer">
          Secure connection via WalletConnect & MetaMask
        </p>
      </div>
    </div>
  );
};

export default ConnectWalletPopup;
