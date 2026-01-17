/**
 * Calculate rarity score for an NFT based on trait frequencies
 * @param {Array} nftTraits - Traits of the NFT being analyzed
 * @param {Array} collectionNFTs - All NFTs in the collection
 * @returns {Object} Rarity data including score and percentile
 */
export const calculateRarityScore = (nftTraits, collectionNFTs) => {
  if (!collectionNFTs || collectionNFTs.length === 0) {
    return { score: 50, percentile: 50, traits: nftTraits };
  }

  const totalNFTs = collectionNFTs.length;

  // Calculate trait frequencies
  const traitFrequencies = {};

  collectionNFTs.forEach((nft) => {
    nft.traits?.forEach((trait) => {
      const key = `${trait.trait_type}:${trait.value}`;
      traitFrequencies[key] = (traitFrequencies[key] || 0) + 1;
    });
  });

  // Calculate rarity for each trait
  const traitsWithRarity = nftTraits.map((trait) => {
    const key = `${trait.trait_type}:${trait.value}`;
    const frequency = traitFrequencies[key] || 1;
    const rarity = ((frequency / totalNFTs) * 100).toFixed(2);

    return {
      ...trait,
      rarity: parseFloat(rarity),
    };
  });

  // Calculate overall rarity score (inverse of average rarity percentage)
  const averageRarity =
    traitsWithRarity.reduce((sum, trait) => sum + trait.rarity, 0) /
    traitsWithRarity.length;

  // Convert to score (lower rarity percentage = higher score)
  const rarityScore = Math.max(0, Math.min(100, 100 - averageRarity));

  // Calculate percentile (what % of collection is less rare)
  const percentile = Math.round(rarityScore);

  return {
    score: Math.round(rarityScore),
    percentile: percentile,
    traits: traitsWithRarity,
  };
};

/**
 * Get rarity level label based on score
 * @param {number} score - Rarity score (0-100)
 * @returns {string} Rarity level
 */
/**
 * Get rarity level label based on score
 * Thresholds are designed to be realistic:
 * - Legendary: Only the top 3% (score 97+) - truly exceptional
 * - Epic: Top 10% (score 90+) - very rare
 * - Rare: Top 25% (score 75+) - uncommon but notable
 * - Uncommon: Top 50% (score 50+) - slightly above average
 * - Common: Everything else - average or below
 */
export const getRarityLevel = (score) => {
  if (score >= 97) return "legendary"; // Top 3% only
  if (score >= 90) return "epic"; // Top 10%
  if (score >= 75) return "rare"; // Top 25%
  if (score >= 50) return "uncommon"; // Top 50%
  return "common"; // Average or below
};

/**
 * Sort NFTs by rarity
 * @param {Array} nfts - Array of NFTs with rarity scores
 * @param {string} order - 'asc' or 'desc'
 * @returns {Array} Sorted NFTs
 */
export const sortByRarity = (nfts, order = "desc") => {
  return [...nfts].sort((a, b) => {
    const scoreA = a.rarityScore || 0;
    const scoreB = b.rarityScore || 0;
    return order === "desc" ? scoreB - scoreA : scoreA - scoreB;
  });
};

/**
 * Calculate trait rarity percentages for a collection
 * @param {Array} collectionNFTs - All NFTs in collection
 * @returns {Object} Trait frequencies
 */
export const getTraitFrequencies = (collectionNFTs) => {
  const frequencies = {};
  const totalNFTs = collectionNFTs.length;

  collectionNFTs.forEach((nft) => {
    nft.traits?.forEach((trait) => {
      const traitType = trait.trait_type;
      if (!frequencies[traitType]) {
        frequencies[traitType] = {};
      }

      const traitValue = trait.value;
      frequencies[traitType][traitValue] =
        (frequencies[traitType][traitValue] || 0) + 1;
    });
  });

  // Convert counts to percentages
  Object.keys(frequencies).forEach((traitType) => {
    Object.keys(frequencies[traitType]).forEach((value) => {
      frequencies[traitType][value] = (
        (frequencies[traitType][value] / totalNFTs) *
        100
      ).toFixed(2);
    });
  });

  return frequencies;
};
