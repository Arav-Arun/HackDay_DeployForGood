import React, { useState, useEffect } from "react";
import "./ContractBadge.css";

/**
 * ContractBadge Component
 * Shows if a contract is verified on Etherscan
 */
const ContractBadge = ({ contractAddress }) => {
  const [verified, setVerified] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkVerification = async () => {
      try {
        // Etherscan free API to check source code (verified contracts have source)
        // Use backend proxy to keep API key hidden
        const response = await fetch(
          `/api/etherscan?module=contract&action=getsourcecode&address=${contractAddress}`,
        );
        const data = await response.json();

        if (data.status === "1" && data.result && data.result[0]) {
          // If SourceCode is not empty, contract is verified
          const isVerified =
            data.result[0].SourceCode && data.result[0].SourceCode !== "";
          setVerified(isVerified);
        } else {
          // API error or rate limit - don't show badge
          setVerified(null);
        }
      } catch (err) {
        console.error("Error checking verification:", err);
        setVerified(null);
      } finally {
        setLoading(false);
      }
    };

    if (contractAddress) {
      checkVerification();
    }
  }, [contractAddress]);

  if (loading) {
    return null;
  }

  if (verified === null) {
    return null; // Don't show if we couldn't determine
  }

  return (
    <div className={`contract-badge ${verified ? "verified" : "unverified"}`}>
      <span className="badge-icon">{verified ? "✓" : "⚠"}</span>
      <span className="badge-text">
        {verified ? "Verified Contract" : "Unverified Contract"}
      </span>
    </div>
  );
};

export default ContractBadge;
