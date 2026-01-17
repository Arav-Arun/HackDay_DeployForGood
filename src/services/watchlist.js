/**
 * Watchlist Service
 * Manages saved NFTs in LocalStorage
 */

const WATCHLIST_KEY = "loremint_watchlist";

/**
 * Get all saved NFTs from watchlist
 * @returns {Array} Array of saved NFT objects
 */
export const getWatchlist = () => {
  try {
    const data = localStorage.getItem(WATCHLIST_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

/**
 * Add an NFT to the watchlist
 * @param {Object} nft - NFT data to save
 */
export const addToWatchlist = (nft) => {
  const watchlist = getWatchlist();
  const id = `${nft.contract}-${nft.tokenId}`;

  // Check if already exists
  if (watchlist.some((item) => item.id === id)) {
    return false; // Already in watchlist
  }

  watchlist.push({
    id,
    contract: nft.contract,
    tokenId: nft.tokenId,
    name: nft.name,
    collection: nft.collection,
    image: nft.image,
    addedAt: Date.now(),
  });

  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
  return true;
};

/**
 * Remove an NFT from the watchlist
 * @param {string} contract - Contract address
 * @param {string} tokenId - Token ID
 */
export const removeFromWatchlist = (contract, tokenId) => {
  const watchlist = getWatchlist();
  const id = `${contract}-${tokenId}`;
  const filtered = watchlist.filter((item) => item.id !== id);
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(filtered));
};

/**
 * Check if an NFT is in the watchlist
 * @param {string} contract - Contract address
 * @param {string} tokenId - Token ID
 * @returns {boolean}
 */
export const isInWatchlist = (contract, tokenId) => {
  const watchlist = getWatchlist();
  const id = `${contract}-${tokenId}`;
  return watchlist.some((item) => item.id === id);
};

/**
 * Clear entire watchlist
 */
export const clearWatchlist = () => {
  localStorage.removeItem(WATCHLIST_KEY);
};
