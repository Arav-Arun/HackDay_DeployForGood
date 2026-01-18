import React from "react";
import "./Tooltip.css";

// NFT Glossary - definitions for common terms
const GLOSSARY = {
  "floor price":
    "The lowest price at which an NFT from this collection is currently listed for sale.",
  "rarity score":
    "A calculated score indicating how unique this NFT is compared to others in its collection. Higher = more rare.",
  gas: "The fee paid to process transactions on the Ethereum blockchain. Measured in Gwei.",
  mint: "The process of creating an NFT and recording it on the blockchain for the first time.",
  traits:
    "Visual attributes or characteristics of an NFT (e.g., background color, accessories, clothing).",
  holder: "The wallet address that currently owns this NFT.",
  collection:
    "A set of NFTs created under the same smart contract, often with a shared theme or art style.",
  "smart contract":
    "The blockchain code that defines ownership, transfers, and rules for an NFT collection.",
  opensea:
    "The largest NFT marketplace where collectors buy, sell, and discover NFTs.",
  eth: "Ethereum, the cryptocurrency used to buy and sell most NFTs.",
  wallet:
    "A digital account that stores your cryptocurrency and NFTs. Examples: MetaMask, Coinbase Wallet.",
  airdrop:
    "Free NFTs or tokens sent directly to wallet addresses, often as a reward or promotion.",
  "diamond hands":
    "A holder who refuses to sell their NFT, even during price drops. Opposite of 'paper hands'.",
  "paper hands":
    "Someone who sells their NFT quickly, often at the first sign of price decline.",
  "rug pull":
    "A scam where creators abandon a project after collecting funds, leaving NFTs worthless.",
  whitelist:
    "A list of wallet addresses allowed to mint NFTs before the public sale.",
  reveal:
    "When NFT artwork is shown after minting. Some collections hide art until a specific date.",
};

/**
 * Tooltip Component
 * Wrap text in <Tooltip term="floor price">Floor Price</Tooltip>
 * to show a definition on hover.
 */
const Tooltip = ({ term, children }) => {
  const definition = GLOSSARY[term.toLowerCase()];

  if (!definition) {
    // If no definition found, just render children without tooltip
    return <>{children}</>;
  }

  return (
    <span className="tooltip-wrapper">
      <span className="tooltip-trigger">{children}</span>
      <span className="tooltip-content">{definition}</span>
    </span>
  );
};

export default Tooltip;
