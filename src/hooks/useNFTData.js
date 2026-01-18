import { useState, useEffect } from "react";
import { useChainId } from "wagmi";
import {
  getNFTsForOwner,
  getNFTMetadata,
  getOwnersForNft,
} from "../services/alchemy";

/**
 * Custom hook to fetch and manage NFT data
 * @param {string} address - Wallet address
 * @param {boolean} enabled - Whether to fetch data
 * @returns {Object} NFT data, loading state, and error
 */
export const useNFTData = (address, enabled = true) => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chainId = useChainId();

  useEffect(() => {
    if (!enabled || !address) {
      setLoading(false);
      return;
    }

    const fetchNFTs = async () => {
      try {
        setLoading(true);
        setError(null);

        const fetchedNFTs = await getNFTsForOwner(address, chainId);

        // Add basic rarity scores (will be calculated more accurately per collection)
        const nftsWithRarity = fetchedNFTs.map((nft) => ({
          ...nft,
          rarityScore: Math.floor(Math.random() * 40) + 50, // Placeholder
        }));

        setNfts(nftsWithRarity);
      } catch (err) {
        console.error("Error in useNFTData:", err);
        setError(err.message || "Failed to fetch NFTs");
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, [address, enabled, chainId]);

  const refetch = async () => {
    if (!address) return;

    try {
      setLoading(true);
      setError(null);
      const fetchedNFTs = await getNFTsForOwner(address, chainId);
      const nftsWithRarity = fetchedNFTs.map((nft) => ({
        ...nft,
        rarityScore: Math.floor(Math.random() * 40) + 50,
      }));
      setNfts(nftsWithRarity);
    } catch (err) {
      setError(err.message || "Failed to fetch NFTs");
    } finally {
      setLoading(false);
    }
  };

  return { nfts, loading, error, refetch };
};

/**
 * Custom hook to fetch detailed NFT metadata including owner
 * @param {string} contractAddress - Contract address
 * @param {string} tokenId - Token ID
 * @returns {Object} NFT metadata, loading state, and error
 */
export const useNFTMetadata = (contractAddress, tokenId) => {
  const [nft, setNft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!contractAddress || !tokenId) {
      setLoading(false);
      return;
    }

    const fetchMetadata = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch metadata and owner in parallel
        const [metadata, ownerInfo] = await Promise.all([
          getNFTMetadata(contractAddress, tokenId),
          getOwnersForNft(contractAddress, tokenId),
        ]);

        // Combine metadata with owner info
        setNft({
          ...metadata,
          owner: ownerInfo.owner,
          ownerDisplay: ownerInfo.ownerDisplay,
        });
      } catch (err) {
        console.error("Error in useNFTMetadata:", err);
        setError(err.message || "Failed to fetch NFT metadata");
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, [contractAddress, tokenId]);

  return { nft, loading, error };
};
