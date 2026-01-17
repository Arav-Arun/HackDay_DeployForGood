import { useState } from "react";
import { generateLore, explainTrait, analyzeRarity } from "../services/loreAI";

// Hook for AI-powered features (lore generation, trait analysis, etc.)
export const useAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateNFTLore = async (nftData) => {
    try {
      setLoading(true);
      setError(null);
      const lore = await generateLore(nftData);
      return lore;
    } catch (err) {
      console.error("Error generating lore:", err);
      setError(err.message || "Failed to generate lore");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const explainNFTTrait = async (trait, collection) => {
    try {
      setLoading(true);
      setError(null);
      const explanation = await explainTrait(trait, collection);
      return explanation;
    } catch (err) {
      console.error("Error explaining trait:", err);
      setError(err.message || "Failed to explain trait");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const analyzeNFTRarity = async (traits, rarityScore) => {
    try {
      setLoading(true);
      setError(null);
      const analysis = await analyzeRarity(traits, rarityScore);
      return analysis;
    } catch (err) {
      console.error("Error analyzing rarity:", err);
      setError(err.message || "Failed to analyze rarity");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    generateNFTLore,
    explainNFTTrait,
    analyzeNFTRarity,
    loading,
    error,
  };
};
