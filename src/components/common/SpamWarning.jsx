import React, { useState, useEffect } from "react";
import { checkSpamStatus } from "../../services/alchemy";
import "./SpamWarning.css";

/**
 * SpamWarning Component
 * Displays a warning if the NFT collection is flagged as spam
 */
const SpamWarning = ({ contractAddress }) => {
  const [spamStatus, setSpamStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSpam = async () => {
      try {
        setLoading(true);
        const status = await checkSpamStatus(contractAddress);
        setSpamStatus(status);
      } catch (err) {
        console.error("Error checking spam:", err);
      } finally {
        setLoading(false);
      }
    };

    if (contractAddress) {
      checkSpam();
    }
  }, [contractAddress]);

  // Don't show anything if loading or not spam
  if (loading || !spamStatus?.isSpam) {
    return null;
  }

  // Format spam reasons for display
  const formatReason = (classification) => {
    const reasons = {
      OwnedByMostHoneyPots: "Owned by known scam wallets",
      Erc721TooManyOwners: "Suspicious ownership pattern",
      Erc721TooManyTokens: "Abnormal token distribution",
      NoSalesActivity: "No legitimate sales",
      HighAirdropPercent: "Airdropped to many wallets",
      LowDistinctOwnersPercent: "Very few unique owners",
      MostlyHoneyPotOwners: "Primarily held by flagged wallets",
    };
    return (
      reasons[classification] ||
      classification.replace(/([A-Z])/g, " $1").trim()
    );
  };

  return (
    <div className="spam-warning">
      <div className="spam-warning-header">
        <span className="spam-icon">⚠</span>
        <span className="spam-title">Potential Spam Collection</span>
      </div>
      {spamStatus.spamClassifications?.length > 0 && (
        <ul className="spam-reasons">
          {spamStatus.spamClassifications.slice(0, 2).map((reason, idx) => (
            <li key={idx}>{formatReason(reason)}</li>
          ))}
        </ul>
      )}
      <p className="spam-advice">
        Exercise caution. This collection has been flagged by Alchemy's spam
        detection.
      </p>
    </div>
  );
};

export default SpamWarning;
