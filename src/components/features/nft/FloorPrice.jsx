import React, { useState, useEffect } from "react";
import { getFloorPrice } from "../../../services/alchemy";
import "./FloorPrice.css";

const FloorPrice = ({ contractAddress, compact = false }) => {
  const [floorData, setFloorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [prices, setPrices] = useState({ usd: 0, inr: 0 });
  const [activeCurrency, setActiveCurrency] = useState("eth");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [floorResult, priceResponse] = await Promise.all([
          getFloorPrice(contractAddress),
          fetch(
            "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd,inr",
          ),
        ]);

        setFloorData(floorResult);

        if (priceResponse.ok) {
          const priceData = await priceResponse.json();
          setPrices({
            usd: priceData.ethereum?.usd || 0,
            inr: priceData.ethereum?.inr || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching floor price:", error);
      } finally {
        setLoading(false);
      }
    };

    if (contractAddress) {
      fetchData();
    }
  }, [contractAddress]);

  const floorPrice = floorData?.openSea || 0;

  const formatPrice = (currency) => {
    if (floorPrice <= 0) return "N/A";

    switch (currency) {
      case "eth":
        return `${floorPrice.toFixed(2)} ETH`;
      case "usd":
        return `$${(floorPrice * prices.usd).toLocaleString("en-US", {
          maximumFractionDigits: 0,
        })}`;
      case "inr":
        return `₹${(floorPrice * prices.inr).toLocaleString("en-IN", {
          maximumFractionDigits: 0,
        })}`;
      default:
        return `${floorPrice.toFixed(2)} ETH`;
    }
  };

  // Compact mode for inline display
  if (compact) {
    if (loading) {
      return <span className="floor-compact loading">...</span>;
    }
    return (
      <span className="floor-compact">
        {floorPrice > 0 ? formatPrice("eth") : "N/A"}
      </span>
    );
  }

  // Full card display
  if (loading) {
    return (
      <div className="floor-price-card glass-card">
        <h3 className="floor-title">Collection Floor Price</h3>
        <div className="shimmer-wrapper" style={{ height: "80px" }}>
          <div className="shimmer"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="floor-price-card glass-card">
      <div className="floor-header">
        <h3 className="floor-title">Collection Floor Price</h3>
        <div className="currency-toggle">
          {["eth", "usd", "inr"].map((currency) => (
            <button
              key={currency}
              className={`currency-btn ${
                activeCurrency === currency ? "active" : ""
              }`}
              onClick={() => setActiveCurrency(currency)}
            >
              {currency.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {floorPrice > 0 ? (
        <div className="floor-price-content">
          <div className="price-display">
            <span className="price-main">{formatPrice(activeCurrency)}</span>
          </div>

          <div className="price-conversions">
            {activeCurrency !== "eth" && (
              <span className="conversion">{floorPrice.toFixed(3)} ETH</span>
            )}
            {activeCurrency !== "usd" && prices.usd > 0 && (
              <span className="conversion">
                $
                {(floorPrice * prices.usd).toLocaleString("en-US", {
                  maximumFractionDigits: 0,
                })}
              </span>
            )}
            {activeCurrency !== "inr" && prices.inr > 0 && (
              <span className="conversion">
                ₹
                {(floorPrice * prices.inr).toLocaleString("en-IN", {
                  maximumFractionDigits: 0,
                })}
              </span>
            )}
          </div>

          <p className="price-source">Source: OpenSea</p>
        </div>
      ) : (
        <div className="floor-price-unavailable">
          <p>Floor price data unavailable</p>
        </div>
      )}
    </div>
  );
};

export default FloorPrice;
