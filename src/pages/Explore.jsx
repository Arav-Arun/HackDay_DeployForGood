import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Explore.css";
import azukiCover from "../assets/azuki-cover.png";
import baycCover from "../assets/bayc-cover.png";
import doodlesCover from "../assets/doodles-cover.png";
import artblocksCover from "../assets/artblocks-cover.png";
import autoglyphsCover from "../assets/autoglyphs_banner.png";
import coolcatsCover from "../assets/coolcats-cover.png";

// 6 Featured Collections - curated for demo purposes
const FEATURED_COLLECTIONS = [
  {
    id: "azuki",
    name: "Azuki",
    contract: "0xED5AF388653567Af2F388E6224dC7C4b3241C544",
    description: "A brand for the metaverse built by the community",
    image: azukiCover,
    tokenIds: [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
    ],
    category: "PFP",
    color: "#C03540",
  },
  {
    id: "bayc",
    name: "Bored Ape Yacht Club",
    contract: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
    description: "10,000 unique Bored Ape NFTs living on Ethereum",
    image: baycCover,
    tokenIds: [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
    ],
    category: "PFP",
    color: "#FFD700",
  },
  {
    id: "doodles",
    name: "Doodles",
    contract: "0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e",
    description: "Colorful, community-driven collectibles by Burnt Toast",
    image: doodlesCover,
    tokenIds: [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "100",
      "200",
      "300",
      "400",
      "500",
    ],
    category: "PFP",
    color: "#FFB8D0",
  },
  {
    id: "art-blocks",
    name: "Art Blocks Curated",
    contract: "0xa7d8d9ef8D8Ce8992Df33D8b8CF4Aebabd5bD270",
    description: "Premium generative art on the Ethereum blockchain",
    image: artblocksCover,
    tokenIds: [
      "0",
      "1000000",
      "78000000",
      "164000000",
      "1000001",
      "1000002",
      "78000001",
      "78000002",
      "164000001",
      "164000002",
      "1000003",
      "1000004",
      "1000005",
      "1000006",
      "1000007",
    ],
    category: "Generative Art",
    color: "#00D4D4",
  },
  {
    id: "autoglyphs",
    name: "Autoglyphs",
    contract: "0xd4e4078ca3495DE5B1d4dB434BEbc5a986197782",
    description: "The first on-chain generative art by Larva Labs",
    image: autoglyphsCover,
    tokenIds: [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
    ],
    category: "Generative Art",
    color: "#1A1A2E",
  },
  {
    id: "cool-cats",
    name: "Cool Cats",
    contract: "0x1A92f7381B9F03921564a437210bB9396471050C",
    description: "9,999 randomly generated Cool Cats",
    image: coolcatsCover,
    tokenIds: [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "100",
      "200",
      "300",
      "400",
      "500",
    ],
    category: "PFP",
    color: "#4FC3F7",
  },
];

const Explore = () => {
  const navigate = useNavigate();
  const [contractAddress, setContractAddress] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [error, setError] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    setError("");

    if (!contractAddress.trim()) {
      setError("Please enter a contract address");
      return;
    }
    if (!tokenId.trim()) {
      setError("Please enter a token ID");
      return;
    }

    // Navigate to NFT detail page
    navigate(`/nft/${contractAddress.trim()}/${tokenId.trim()}`);
  };

  const handleCollectionClick = (collection) => {
    navigate(`/collection/${collection.contract}`, {
      state: { collection },
    });
  };

  return (
    <div className="explore-page">
      <div className="container">
        {/* Hero Section */}
        <div className="explore-hero">
          <h1 className="explore-title">NFT Intelligence Hub</h1>
          <p className="explore-subtitle">
            Research any NFT with AI-powered trait analysis, rarity scoring,
            ownership history, and market insights
          </p>
        </div>

        {/* Quick Search */}
        <div className="search-section">
          <form className="search-form apple-glass" onSubmit={handleSearch}>
            <h3 className="search-title">Analyze Any NFT</h3>
            <div className="search-grid">
              <div className="form-group">
                <label>Contract Address</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="0x..."
                  value={contractAddress}
                  onChange={(e) => setContractAddress(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Token ID</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., 1234"
                  value={tokenId}
                  onChange={(e) => setTokenId(e.target.value)}
                />
              </div>
              <button type="submit" className="search-btn">
                Analyze
              </button>
            </div>
            {error && <div className="error-message">{error}</div>}
          </form>
        </div>

        {/* Featured Collections */}
        <section className="collections-section">
          <h2 className="section-title">Featured Collections</h2>
          <p className="section-subtitle">
            Click any collection to explore NFTs and try our AI-powered analysis
          </p>

          <div className="featured-grid">
            {FEATURED_COLLECTIONS.map((collection) => (
              <button
                key={collection.id}
                className="featured-card"
                onClick={() => handleCollectionClick(collection)}
                style={{ "--card-accent": collection.color }}
              >
                <div className="featured-image-wrapper">
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="featured-image"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  <div
                    className="featured-image-fallback"
                    style={{ display: "none" }}
                  >
                    <span>{collection.name.charAt(0)}</span>
                  </div>
                  <div className="featured-overlay">
                    <span className="explore-badge">View Collection →</span>
                  </div>
                </div>
                <div className="featured-content">
                  <div className="featured-header">
                    <h3 className="featured-name">{collection.name}</h3>
                    <span className="featured-category">
                      {collection.category}
                    </span>
                  </div>
                  <p className="featured-description">
                    {collection.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Explore;
