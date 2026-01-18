import React, { useState } from "react";
import {
  isInWatchlist,
  addToWatchlist,
  removeFromWatchlist,
} from "../../services/watchlist";
import "./WatchlistButton.css";

/**
 * WatchlistButton Component
 * Add/Remove NFT from watchlist
 */
const WatchlistButton = ({ nft }) => {
  // Initialize state with lazy evaluation to check localStorage
  const [saved, setSaved] = useState(
    () =>
      nft?.contract && nft?.tokenId && isInWatchlist(nft.contract, nft.tokenId),
  );

  const handleToggle = () => {
    if (saved) {
      removeFromWatchlist(nft.contract, nft.tokenId);
      setSaved(false);
    } else {
      addToWatchlist(nft);
      setSaved(true);
    }
  };

  return (
    <button
      className={`watchlist-btn ${saved ? "saved" : ""}`}
      onClick={handleToggle}
      title={saved ? "Remove from Watchlist" : "Add to Watchlist"}
    >
      <span className="watchlist-icon">{saved ? "★" : "☆"}</span>
      <span className="watchlist-text">{saved ? "Saved" : "Save"}</span>
    </button>
  );
};

export default WatchlistButton;
