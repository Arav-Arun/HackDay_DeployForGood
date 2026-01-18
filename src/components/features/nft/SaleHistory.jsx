import React, { useState, useEffect } from "react";
import { getNftSales } from "../../../services/alchemy";
import "./SaleHistory.css";

/**
 * SaleHistory Component
 * Shows real NFT sale history from Alchemy
 */
const SaleHistory = ({ contractAddress, tokenId }) => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        const salesData = await getNftSales(contractAddress, tokenId);
        setSales(salesData);
      } catch (err) {
        console.error("Error fetching sales:", err);
      } finally {
        setLoading(false);
      }
    };

    if (contractAddress && tokenId) {
      fetchSales();
    }
  }, [contractAddress, tokenId]);

  // Format price nicely
  const formatPrice = (price) => {
    if (price === null || price === undefined) return "—";
    return `Ξ ${price.toFixed(4)}`;
  };

  // Format marketplace name
  const formatMarketplace = (name) => {
    const marketplaces = {
      seaport: "OpenSea",
      looksrare: "LooksRare",
      x2y2: "X2Y2",
      blur: "Blur",
      wyvern: "OpenSea (Legacy)",
    };
    return marketplaces[name?.toLowerCase()] || name || "Unknown";
  };

  if (loading) {
    return (
      <div className="sale-history-card glass-card">
        <h3 className="subsection-title">Sale History</h3>
        <div className="shimmer-wrapper" style={{ height: "120px" }}>
          <div className="shimmer"></div>
        </div>
      </div>
    );
  }

  if (sales.length === 0) {
    return (
      <div className="sale-history-card glass-card">
        <h3 className="subsection-title">Sale History</h3>
        <p className="no-sales">No recorded sales for this NFT</p>
      </div>
    );
  }

  // Get the most recent sale
  const lastSale = sales[0];

  return (
    <div className="sale-history-card glass-card">
      <h3 className="subsection-title">Sale History</h3>

      {/* Last Sale Highlight */}
      <div className="last-sale-highlight">
        <span className="last-sale-label">Last Sold</span>
        <span className="last-sale-price">{formatPrice(lastSale.price)}</span>
        <span className="last-sale-marketplace">
          on {formatMarketplace(lastSale.marketplace)}
        </span>
      </div>

      {/* Sale List */}
      {sales.length > 1 && (
        <div className="sales-list">
          {sales.slice(1, 5).map((sale, idx) => (
            <div key={idx} className="sale-item">
              <span className="sale-price">{formatPrice(sale.price)}</span>
              <span className="sale-marketplace">
                {formatMarketplace(sale.marketplace)}
              </span>
              {sale.transactionHash && (
                <a
                  href={`https://etherscan.io/tx/${sale.transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sale-tx-link"
                >
                  TX
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SaleHistory;
