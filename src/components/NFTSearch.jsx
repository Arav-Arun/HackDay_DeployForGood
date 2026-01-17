import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NFTSearch.css";

const NFTSearch = () => {
  const navigate = useNavigate();
  const [contractAddress, setContractAddress] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Validate Ethereum address format
  const isValidAddress = (address) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");

    // Validate inputs
    if (!contractAddress.trim()) {
      setError("Please enter a contract address");
      return;
    }

    if (!isValidAddress(contractAddress.trim())) {
      setError("Invalid Ethereum address format");
      return;
    }

    if (!tokenId.trim()) {
      setError("Please enter a token ID");
      return;
    }

    if (isNaN(tokenId) || parseInt(tokenId) < 0) {
      setError("Token ID must be a valid number");
      return;
    }

    setLoading(true);

    // Navigate to NFT detail page
    navigate(`/nft/${contractAddress.trim()}/${tokenId.trim()}`);
  };

  // Quick access to popular collections
  const popularCollections = [
    {
      name: "Bored Ape Yacht Club",
      contract: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
      sampleTokens: ["1", "100", "1000", "5000"],
    },
    {
      name: "Azuki",
      contract: "0xED5AF388653567Af2F388E6224dC7C4b3241C544",
      sampleTokens: ["1", "100", "500", "9999"],
    },
    {
      name: "Pudgy Penguins",
      contract: "0xBd3531dA5CF5857e7CfAA92426877b022e612cf8",
      sampleTokens: ["1", "100", "1000"],
    },
    {
      name: "Doodles",
      contract: "0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e",
      sampleTokens: ["1", "100", "500"],
    },
  ];

  const handleQuickSearch = (contract, tokenId) => {
    navigate(`/nft/${contract}/${tokenId}`);
  };

  return (
    <div className="nft-search">
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-inputs">
          <div className="input-group">
            <label htmlFor="contract">Contract Address</label>
            <input
              id="contract"
              type="text"
              placeholder="0x..."
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="input-group">
            <label htmlFor="tokenId">Token ID</label>
            <input
              id="tokenId"
              type="text"
              placeholder="1234"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
              className="search-input"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary search-btn"
            disabled={loading}
          >
            {loading ? "Loading..." : "Analyze NFT"}
          </button>
        </div>

        {error && <p className="search-error">{error}</p>}
      </form>

      <div className="quick-search">
        <h3 className="quick-search-title">
          Quick Access: Popular Collections
        </h3>
        <div className="collections-grid">
          {popularCollections.map((collection) => (
            <div key={collection.contract} className="collection-card">
              <h4 className="collection-name">{collection.name}</h4>
              <div className="sample-tokens">
                {collection.sampleTokens.map((token) => (
                  <button
                    key={token}
                    className="token-btn"
                    onClick={() =>
                      handleQuickSearch(collection.contract, token)
                    }
                  >
                    #{token}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NFTSearch;
