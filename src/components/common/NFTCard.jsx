import React from "react";
import { useNavigate } from "react-router-dom";

const NFTCard = ({ nft, onClick }) => {
  const navigate = useNavigate();
  const [isImageLoaded, setIsImageLoaded] = React.useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    if (onClick) {
      onClick(nft);
    } else {
      navigate(`/nft/${nft.contract}/${nft.tokenId}`);
    }
  };

  const getRarityLevel = (score) => {
    if (score >= 90) return "legendary";
    if (score >= 75) return "epic";
    if (score >= 50) return "rare";
    if (score >= 25) return "uncommon";
    return "common";
  };

  const rarityScore = nft.rarityScore || 50;
  const rarityLevel = getRarityLevel(rarityScore);

  // Use thumbnail if available for faster loading, fallback to main image
  const displayImage = nft.thumbnail || nft.image || "";

  return (
    <div
      className="nft-card glass-card"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleClick(e)}
    >
      <div className={`nft-card-image-wrapper rarity-aura-${rarityLevel}`}>
        {!isImageLoaded && (
          <div className="nft-image-skeleton">
            <div className="shimmer" />
          </div>
        )}
        <img
          src={displayImage}
          alt={nft.name || `NFT #${nft.tokenId}`}
          className={`nft-card-image ${isImageLoaded ? "loaded" : "loading"}`}
          loading="lazy"
          onLoad={() => setIsImageLoaded(true)}
          style={{ opacity: isImageLoaded ? 1 : 0 }}
          onError={(e) => {
            // If thumbnail fails, try main image if different
            if (nft.thumbnail && e.target.src === nft.thumbnail && nft.image) {
              e.target.src = nft.image;
              return;
            }
            e.target.onerror = null;
            // Enhanced fallback
            e.target.src =
              "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiB2aWV3Qm94PSIwIDAgMzAwIDMwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzFmMjkzNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0ic3lzdGVtLXVpIiBmb250LXNpemU9IjI0IiBmaWxsPSIjNGI1NTYzIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TkZUPC90ZXh0Pjwvc3ZnPg==";
            setIsImageLoaded(true); // Show fallback
          }}
        />
        <div className="nft-card-overlay">
          <span className="overlay-text">View Analysis</span>
        </div>
      </div>

      <div className="nft-card-content">
        <div className="nft-card-header">
          <h3 className="nft-card-title">{nft.name || `#${nft.tokenId}`}</h3>
          <span className={`rarity-badge rarity-${rarityLevel}`}>
            {rarityScore}
          </span>
        </div>

        <p className="nft-card-collection">
          {nft.collection || "Unknown Collection"}
        </p>
      </div>
    </div>
  );
};

export default NFTCard;
