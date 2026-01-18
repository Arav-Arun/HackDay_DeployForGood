import React from "react";
import { useNavigate } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import NFTCard from "../components/common/NFTCard";
import "./Demo.css";

// Demo NFTs with real working images
const demoNFTs = [
  {
    id: "demo-1",
    contract: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
    tokenId: "8520",
    name: "Bored Ape #8520",
    collection: "Bored Ape Yacht Club",
    image:
      "https://ipfs.io/ipfs/QmPbxeGcXhYQQNgsC6a36dDyYUcHgMLnGKnF8pVFmGsvqi",
    rarityScore: 85,
    traits: [
      { trait_type: "Background", value: "Army Green", rarity: 12 },
      { trait_type: "Fur", value: "Brown", rarity: 15 },
      { trait_type: "Eyes", value: "Bored", rarity: 17 },
      { trait_type: "Mouth", value: "Bored", rarity: 22 },
    ],
  },
  {
    id: "demo-2",
    contract: "0xED5AF388653567Af2F388E6224dC7C4b3241C544",
    tokenId: "9605",
    name: "Azuki #9605",
    collection: "Azuki",
    image:
      "https://ipfs.io/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/9605.png",
    rarityScore: 72,
    traits: [
      { trait_type: "Type", value: "Human", rarity: 45 },
      { trait_type: "Hair", value: "Pink Pigtails", rarity: 8 },
      { trait_type: "Eyes", value: "Determined", rarity: 12 },
    ],
  },
  {
    id: "demo-3",
    contract: "0x23581767a106ae21c074b2276D25e5C3e136a68b",
    tokenId: "2100",
    name: "Moonbird #2100",
    collection: "Moonbirds",
    image: "https://live---metadata-5covpqijaa-uc.a.run.app/images/2100",
    rarityScore: 94,
    traits: [
      { trait_type: "Feathers", value: "Legendary", rarity: 2 },
      { trait_type: "Eyes", value: "Rainbow", rarity: 5 },
      { trait_type: "Beak", value: "Short", rarity: 18 },
    ],
  },
];

const Demo = () => {
  const navigate = useNavigate();

  return (
    <div className="demo-page">
      <div className="container">
        {/* Header */}
        <div className="demo-header">
          <button onClick={() => navigate("/")} className="btn btn-ghost">
            ← Back to Home
          </button>
        </div>

        {/* Hero Section */}
        <div className="demo-hero">
          <h1 className="demo-title">Experience LoreMint</h1>
          <p className="demo-subtitle">
            Explore how LoreMint brings NFTs to life with AI-powered
            explanations and storytelling
          </p>
        </div>

        {/* Demo NFT Grid */}
        <div className="demo-grid">
          {demoNFTs.map((nft) => (
            <NFTCard key={nft.id} nft={nft} />
          ))}
        </div>

        {/* CTA Section */}
        <div className="demo-cta glass-card">
          <div className="demo-cta-content">
            <h3 className="cta-title">Ready to explore your collection?</h3>
            <p className="cta-text">
              Connect your wallet to see AI-powered insights for all your NFTs
            </p>
            <div className="cta-button">
              <ConnectButton />
            </div>
          </div>

          <div className="cta-features">
            <div className="cta-feature">
              <span className="feature-check">✓</span>
              <span>No wallet? Try these demo NFTs</span>
            </div>
            <div className="cta-feature">
              <span className="feature-check">✓</span>
              <span>AI explanations for every trait</span>
            </div>
            <div className="cta-feature">
              <span className="feature-check">✓</span>
              <span>Unique lore for each NFT</span>
            </div>
            <div className="cta-feature">
              <span className="feature-check">✓</span>
              <span>Rarity insights & value context</span>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="demo-info">
          <p>
            <strong>Note:</strong> These are demo NFTs with pre-generated
            explanations. Connect your wallet to see real-time analysis of your
            own collection.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Demo;
