import React, { useState, useEffect } from "react";
import { getFloorPrice } from "../../../services/alchemy";
import "./PriceChart.css";

/**
 * PriceChart Component
 * NOTE: Historical price data requires paid APIs (Reservoir, etc.)
 * Currently only shows real floor price, no simulated history
 */
const PriceChart = ({ contractAddress }) => {
  const [floorPrice, setFloorPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ethPrices, setEthPrices] = useState({ usd: 0, inr: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [priceInfo, priceResponse] = await Promise.all([
          getFloorPrice(contractAddress),
          fetch(
            "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd,inr",
          ),
        ]);

        const floor = priceInfo.openSea || null;
        setFloorPrice(floor);

        if (priceResponse.ok) {
          const prices = await priceResponse.json();
          setEthPrices({
            usd: prices.ethereum?.usd || 0,
            inr: prices.ethereum?.inr || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching price data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (contractAddress) {
      fetchData();
    }
  }, [contractAddress]);

  if (loading) {
    return (
      <div className="price-chart-container glass-card">
        <h3 className="chart-title">Price Data</h3>
        <div className="chart-loading">
          <div className="shimmer-wrapper" style={{ height: "80px" }}>
            <div className="shimmer"></div>
          </div>
        </div>
      </div>
    );
  }

  // If no floor price available, don't show the component at all
  if (!floorPrice || floorPrice <= 0) {
    return null;
  }

  return (
    <div className="price-chart-container glass-card">
      <h3 className="chart-title">Current Floor Price</h3>
      <div className="floor-price-display">
        <span className="floor-price-value">Ξ {floorPrice.toFixed(4)}</span>
        {ethPrices.usd > 0 && (
          <span className="floor-price-fiat">
            ≈ $
            {(floorPrice * ethPrices.usd).toLocaleString("en-US", {
              maximumFractionDigits: 2,
            })}{" "}
            USD
          </span>
        )}
      </div>
      <p className="chart-disclaimer">
        Live floor price from OpenSea. Historical price charts require premium
        API access.
      </p>
    </div>
  );
};

export default PriceChart;
