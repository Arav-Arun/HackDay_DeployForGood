import React, { useState, useEffect } from "react";
import { getTransferHistory, resolveENS } from "../../../services/alchemy";
import "./TransferHistory.css";

const TransferHistory = ({ contractAddress, tokenId }) => {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolvedNames, setResolvedNames] = useState({});

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const history = await getTransferHistory(contractAddress, tokenId);

        // Get all transfers (up to 10)
        const recentTransfers = history.slice(0, 10);
        setTransfers(recentTransfers);

        // Resolve ENS names for addresses
        const addresses = new Set();
        recentTransfers.forEach((t) => {
          addresses.add(t.from);
          addresses.add(t.to);
        });

        const names = {};
        for (const addr of addresses) {
          if (addr !== "0x0000000000000000000000000000000000000000") {
            names[addr] = await resolveENS(addr);
          }
        }
        setResolvedNames(names);
      } catch (err) {
        console.error("Error fetching transfer history:", err);
      } finally {
        setLoading(false);
      }
    };

    if (contractAddress && tokenId) {
      fetchHistory();
    }
  }, [contractAddress, tokenId]);

  // Calculate holding duration between two timestamps
  const getHoldingDuration = (fromTimestamp, toTimestamp) => {
    if (!fromTimestamp) return null;
    const from = new Date(fromTimestamp).getTime();
    const to = toTimestamp ? new Date(toTimestamp).getTime() : Date.now();
    const diffMs = to - from;
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (days >= 365) {
      const years = Math.floor(days / 365);
      return `${years} year${years > 1 ? "s" : ""}`;
    } else if (days >= 30) {
      const months = Math.floor(days / 30);
      return `${months} month${months > 1 ? "s" : ""}`;
    } else if (days >= 1) {
      return `${days} day${days > 1 ? "s" : ""}`;
    } else {
      return "< 1 day";
    }
  };

  // Determine holder type based on duration and position
  const getHolderType = (durationDays, transferIndex, totalTransfers) => {
    // OG Holder = first 3 transfers in the collection
    if (transferIndex >= totalTransfers - 3) {
      return "OG Holder";
    }
    // Diamond Hands = held for > 365 days
    if (durationDays >= 365) {
      return "Diamond Hands";
    }
    // Flipper = held for < 7 days
    if (durationDays < 7) {
      return "Flipper";
    }
    return null;
  };

  const getDaysFromDuration = (fromTimestamp, toTimestamp) => {
    if (!fromTimestamp) return 0;
    const from = new Date(fromTimestamp).getTime();
    const to = toTimestamp ? new Date(toTimestamp).getTime() : Date.now();
    return Math.floor((to - from) / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="transfer-history-card glass-card">
        <h3 className="subsection-title">Ownership Journey</h3>
        <div className="shimmer-wrapper" style={{ height: "200px" }}>
          <div className="shimmer"></div>
        </div>
      </div>
    );
  }

  const getDisplayName = (address) => {
    if (address === "0x0000000000000000000000000000000000000000") {
      return "Mint";
    }
    const resolved = resolvedNames[address];
    if (resolved && resolved !== address) {
      return resolved;
    }
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="transfer-history-card glass-card">
      <h3 className="subsection-title">Ownership Journey</h3>

      {transfers.length > 0 ? (
        <div className="transfer-timeline">
          {transfers.map((transfer, index) => {
            // Calculate holding duration (from this transfer to the next one)
            const nextTransfer = transfers[index - 1]; // previous in array = next in time
            const holdingDuration = getHoldingDuration(
              transfer.timestamp,
              nextTransfer?.timestamp,
            );
            const daysHeld = getDaysFromDuration(
              transfer.timestamp,
              nextTransfer?.timestamp,
            );
            const holderType = getHolderType(daysHeld, index, transfers.length);

            return (
              <div key={index} className="transfer-item">
                <div className="transfer-indicator">
                  <div
                    className={`transfer-dot ${index === 0 ? "current" : ""}`}
                  ></div>
                  {index < transfers.length - 1 && (
                    <div className="transfer-line"></div>
                  )}
                </div>

                <div className="transfer-details">
                  <div className="transfer-direction">
                    <span className="address-from">
                      {getDisplayName(transfer.from)}
                    </span>
                    <span className="arrow">→</span>
                    <span className="address-to">
                      {getDisplayName(transfer.to)}
                    </span>
                  </div>

                  <div className="transfer-meta">
                    {transfer.timestamp && (
                      <span className="transfer-date">
                        {formatDate(transfer.timestamp)}
                      </span>
                    )}
                    {holdingDuration && index !== 0 && (
                      <span className="holding-duration">
                        Held for {holdingDuration}
                      </span>
                    )}
                    {holderType && (
                      <span
                        className={`holder-type holder-type-${holderType
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {holderType}
                      </span>
                    )}
                  </div>

                  {transfer.hash && (
                    <a
                      href={`https://etherscan.io/tx/${transfer.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tx-link"
                    >
                      View TX
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="transfer-empty">
          <p>No transfer history available for this NFT.</p>
        </div>
      )}
    </div>
  );
};

export default TransferHistory;
